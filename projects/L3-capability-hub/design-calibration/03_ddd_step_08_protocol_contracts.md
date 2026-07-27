# L3-capability-hub 03 详细设计 Step 8: 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §6 全局 API 索引;§7 API / Command / Query / Event / Job 协议契约
> 创建日期: 2026-07-10
> 当前模式: full-restart
> 状态: `completed_with_step_14_5_2_2_3_async_trait_and_metadata_copy_reopen`
> 当前批次: `8.7` + Step 9 batches `9.3 / 9.5 / 9.6 / 9.7 / 9.8 / 9.9 / 9.11-pre-entry / 9.11 / 9.12` + Step 10 batches `10.1 / 10.2 / 10.3 / 10.4 / 10.5 / 10.6` + Step 12 batches `12.3 / 12.4 / 12.5 / 12.6` + Step 13 controlled reopen + Step 14 batch `14.5.2.2.3`
> Step 14 batch 14.5.2.2.3 object-safety / response identity回开: 2026-07-21;23个含native async callable且进入dyn graph的handler / service trait逐声明增加`#[async_trait::async_trait]`，固定`async-trait 0.1.89`、`Send`future且禁止`?Send`；existing `CapabilityJobMetadata`新增exact六字段`copy_for_response_validation`实现。public wire type / DTO field / protocol / Port增量为0，contracts-owned public helper callable净`+1`
> Step 13 canonical / idempotency受控回开: 2026-07-18;26 Command、6 Inbound payload与8 Job input各自补exact public canonical-field-byte callable，private field writer归contracts ownership；closed operation mapper只接受本文件exact protocol name。250个public protocol struct / enum与83 protocols不变；callable均有英文`///`。6个Inbound callable等待L0-core正式声明existing `IdempotencyKey::as_str()`或等价canonical accessor
> Step 10 batch 10.3受控同步: 2026-07-16;formal applicability input保持同名DTO type但改为typed non-empty consumer set；exposure cards补active identity /完整local prerequisite与scope member validation、policy-only target、先降级后派生、pending reason history和suspend / retire visibility source-version symmetry。无新DTO、field、enum、variant、protocol、flow、trait或Port
> Step 10 batch 10.4受控同步: 2026-07-16;controlled-view既有`DescriptorConsumerSummary`保持同名secondary type但改为body-free summary + typed partial-kind set,Job planning / no-op / Query复制同一structured value；controlled-view / directory current Job明确不保存Rebuilding / Unavailable中间态。无新DTO field、protocol、flow、trait或Port
> Step 10 batch 10.5受控同步: 2026-07-16;Record reference Command对non-terminal current改为value + reason二元比较,same value + changed safe reason形成actual revision,仅exact value/reason equality no-op；Invalid / Forbidden仍terminal。无新type、field、DTO、protocol、flow、trait或Port
> Step 10 batch 10.6受控同步: 2026-07-17;event-collaboration facade校验改为capture / snapshot source、snapshot id、schema、digest、captured time五元组 + snapshot-owned bytes / digest完整性与typed trace原样复制,移除不存在的capture `trace_id / bytes`要求；无新type、field、DTO、protocol、flow、trait或Port
> Step 12 batch 12.3受控回开: 2026-07-17;existing validation issue carrier补51-variant closed `CapabilityIssueCode`、固定`v1`literal、deterministic `from_code`与stable duplicate-free set construction；tuple inner fields收为private并保留read-only access。无新response envelope、DTO field、protocol、flow、trait或Port；所有新增enum / variant / field / callable均有英文Rustdoc
> Step 12 batch 12.4受控回开: 2026-07-17;existing Query degraded kind补8-arm freshness mapper,existing marker补kind/ref同源constructor；application read-degraded reason改持closed kind并只委托该constructor。无新public type、DTO field、response envelope、protocol、flow、trait或Port；新增callable均有英文Rustdoc
> Step 12 batch 12.5受控回开: 2026-07-18;五张reference Inbound卡固定caller contradiction与matching resolver成功返回不对称的分界,new-subject `Forbidden` quarantine、existing non-terminal可进入body-free terminal及terminal exact replay规则；十张Outbound卡保持Phase A atomic capture、Phase B typed outcome、Phase C bind与IntentBound reentry边界。无新type、field、enum、variant、callable、protocol、flow、trait或Port
> Step 12 batch 12.6受控回开: 2026-07-18;八张Operations Job卡固定exact target/run identity + closed issue + typed impact + zero-effect / confirmed rollback的safe-terminalization gate；loaded owner/version/union/sidecar、capture/snapshot、journal/result不对称及codec/rollback/commit-unknown/control-plane failure保持exact `ApplicationError`与`Planned`恢复点；reconciliation五态issue/impact映射闭合。无新type、field、enum、variant、callable、protocol、flow、trait或Port；既有struct / field注释未遗漏
> Step 9 batch 9.3 回开修正: 2026-07-13;收紧exposure registry actual-delta、activation后visibility source-version对称、single-revision trace handoff、accepted-local-result post-commit语义与canonical-reference material propagation；无新public carrier / field / enum / variant / trait / Port
> Step 9 batch 9.5 回开修正: 2026-07-13;`GetSdkExposureBoundary`固定SDK subject后exposure subject的双resolver顺序、NotVisible / Degraded优先级、source-version union和较晚evaluation time；relation page缺失/错误pair与RuntimeTools非Resolved consumer均固定为degraded empty/no cursor；无新public carrier / field / enum / variant / trait / Port
> Step 9 batch 9.6 回开修正: 2026-07-13;single impact view删除无界summary-ref字段,paged downstream Query新增exact optional impact字段,public degraded enum新增`MaterialUnavailable` variant,并闭合historical trace、audit pair、actual derived state与collection degraded语义；无新public type / protocol / trait / Port,所有新增field / variant均有英文Rustdoc
> Step 9 batch 9.7 回开澄清: 2026-07-14;五条reference-support Query对`Invalid / Forbidden`统一保留已登记body-free ref/state view并返回`Degraded/Unavailable + Redacted`,不读取或返回external body；无public schema、object、repository、trait或Port变化
> Step 9 batch 9.8 回开修正: 2026-07-14;Inbound audit candidate固定使用Rustdoc-complete typed locator mapping；worker映射的existing operation context保留source family / public source event / source-provided key,使application可构造digest、public receipt和local feedback ref；无新public type / enum / variant / trait或Port,新增context字段均有英文Rustdoc
> Step 9 batch 9.9 回开修正: 2026-07-14~15;新增Rustdoc-complete application-local `CapabilityEventCollaborationService::collaborate_captured_event` exact callable,绑定Step 7 outcome exact-source symmetry,并明确`ConsumerViewMarkedStale`不是formal-exposure event source；不新增public protocol、schema、object、Port或business truth
> Step 9 batch 9.11 pre-entry 回开修正: 2026-07-15;绑定Step 6/7 typed Job execution journal到既有八类typed response的唯一装配规则,使reserved reentry可只从durable target outcome与initial / appended run issues恢复detail / generic refs / issues / disposition,并区分合法零目标Completed与planning-failure空计划Failed / Retryable。83个protocol及public schema/type计数不变；Step 6为43个HLD objects + 7个application technical helpers,Step 7为36个Port
> Step 9 batch 9.11 audit-export回开修正: 2026-07-15;既有audit Job构造绑定收紧为complete no-op check或same-trace/scope refresh后逐ref attachment,typed item只从saved stable ref set复制；无新public DTO、protocol、type、trait或Port
> Step 9 batch 9.11 planned-target回开修正: 2026-07-15;existing journal plan新增preclassified failed-target语义,complete multi-target planning保留失败target identity并在zero-effect UoW终态化；assembler/public schema/Port数量不变
> Step 9 batch 9.11 ecosystem回开修正: 2026-07-15;绑定existing formal visibility applicability read并固定ecosystem plan final Ready / Partial / Unavailable + reason,no-op与success item state均只读frozen plan；无新public DTO、type、Port或protocol
> Step 9 batch 9.12 回开澄清: 2026-07-15;reference refresh固定terminal current state skip、body-free observation transition与candidate parity；collaboration repair固定public/application source与intent ref逐variant一对一映射、local bind + journal success同target UoW及intent-only journal outcome；无新public DTO、protocol、trait或Port
> Step 10 batch 10.1 回开澄清: 2026-07-16;`EstablishCapabilityAccessContext`绑定existing identity policy与exact initial-state mapping,`RegisterCapabilityInRegistry`明确current factory直接形成Registered且不持久化Draft；无新public DTO、field、enum、variant、protocol、trait或Port
> Step 10 batch 10.2 回开澄清: 2026-07-16;descriptor replacement / attachment固定persisted current source为`Accepted / Unresolved`,risk-summary factory固定known risk -> Available、Unknown -> Partial、ForbiddenBody -> rejection；safe-summary existing recovery继续reserved。无新public DTO、field、enum、variant、protocol、trait或Port
> 本轮边界: 只定义 public protocol carrier、同步 API route、inbound / outbound event logical name、operations job trigger、字段级 schema、构造来源、错误 / 幂等 / 审计 surface 和 Step 9 handoff。允许使用 Step 6 / 7 已回开闭合的产品中立 immutable payload snapshot、versioned event capture与application-owned capture repository;不得定义 runtime / tools execution、marketplace listing、governance approval、method body、secret body、raw audit body、具体 bus 产品、物理 topic、consumer group、业务 outbox / relay 产品、delivery attempt log、DDL、配置 key、测试结果、实现 commit、run_id、evidence alias 或验收签署。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 8 `定义 API / Command / Query / Event / Job 协议契约` |
| 用户确认 | 用户已回复“同意”,确认 Step 7 并允许进入 Step 8 |
| 直接前序 | `03_ddd_step_07_trait_port_adapter_contracts.md` 状态 `completed_with_step_8_reopen`;durable event-capture回开已闭合 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 实现产物 | 不创建 implementation ledger / planned boundary skeleton;二者只允许在 `07-实施计划.md` 完成时创建 |

## 1. Step 8 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `8.0` | 恢复、标准 / 上游读取、协议全集、SOP 回答、回开判断、写入门禁 | completed | 是 | completed | `8.1` |
| `8.1` | shared protocol carrier、metadata authority、page / query surface、rejection / receipt / report | completed | 是 | completed | `8.2` |
| `8.2` | 26 个 Command protocol | completed | 是 | completed_wait_user_review | `8.3` |
| `8.3` | 33 个 Query protocol | completed | 是 | completed_wait_user_review | `8.4` |
| `8.4` | 6 个 Inbound Event Consumer protocol | completed | 是 | completed_wait_user_review | `8.5` |
| `8.5` | 10 个 Outbound Event protocol | completed | 是 | completed_wait_user_review | `8.6` |
| `8.6` | 8 个 Operations Job protocol | completed | 是 | completed_wait_user_review | `8.7` |
| `8.7` | 协议族停审、DTO 构造 / public surface / boundary 审计、回填草稿、Step 9 handoff | completed | 是 | completed_wait_user_review | 无 |
| `8.R1` | Step 9 batch `9.3` 回开:registry actual delta、visibility source-version、trace handoff phase、reference material / locator construction | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.3` |
| `8.R2` | Step 9 batch `9.5` 回开:SDK exposure双subject decision composition、relation page完整项与RuntimeTools consumer空页语义 | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.5` |
| `8.R3` | Step 9 batch `9.6` 回开:impact分页、historical trace、audit pair、derived state map与collection degraded语义 | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.6` |
| `8.R4` | Step 9 batch `9.7` 澄清:reference Invalid / Forbidden仍显式返回已登记body-free view | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.7` |
| `8.R5` | Step 9 batches `9.8 / 9.9` 回开:Inbound context authority、audit locator、collaboration exact source / facade | completed | 是 | completed_with_step_9_reopen | 回到对应Step 9 batch |
| `8.R6` | Step 9 batch `9.11` pre-entry回开:typed Job execution journal到八类existing response的exact assembly | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` pre-entry gate |
| `8.R7` | Step 9 batch `9.11`回开:audit export exact no-op / rebuild callable binding与saved ref symmetry | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `8.R8` | Step 9 batch `9.11`回开:preclassified failed-target construction / assembly semantics | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `8.R9` | Step 9 batch `9.11`回开:ecosystem applicability与final state/reason frozen-plan binding | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.11` |
| `8.R10` | Step 9 batch `9.12`回开:reference terminal/no-op mapping与collaboration repair target-UoW/source-ref symmetry | completed | 是 | completed_with_step_9_reopen | 回到 Step 9 batch `9.12` |
| `8.R11` | Step 10 batch `10.1`回开:identity factory policy / initial-state mapping与registry Draft不可达 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.1` |
| `8.R12` | Step 10 batch `10.2`回开:descriptor / safe-summary deterministic reachability与relation current exact subset | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.2` |
| `8.R13` | Step 10 batch `10.3`同步:typed applicability、exposure / visibility与trace invariant | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.3` |
| `8.R14` | Step 10 batch `10.4`同步:structured consumer partial input与view / directory Job final-state边界 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.4` |
| `8.R15` | Step 10 batch `10.5`同步:reference same-value + changed-reason Command语义 | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.5` |
| `8.R16` | Step 10 batch `10.6`同步:event-collaboration capture / snapshot五元组与bytes owner | completed | 是 | completed_with_step_10_reopen | 回到 Step 10 batch `10.6` |
| `8.R17` | Step 12 batch `12.3`回开:closed issue code、deterministic issue-ref与duplicate-free set constructor | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.3` |
| `8.R18` | Step 12 batch `12.4`回开:Query degraded kind到freshness / deterministic marker的唯一typed mapping | completed | 是 | completed_with_step_12_reopen | 回到 Step 12 batch `12.4` |

## 2. 本步输入

| 输入 | 当前状态 | 本 Step 用途 | 使用边界 |
|---|---|---|---|
| `project_execution_ledger.md` / `03_ddd_calibration_flow.md` | read | 确认 Step 7 已经用户审查并允许进入 Step 8 | 不继承任何未登记的旧恢复点 |
| 详细设计 SOP Step 8 / 书写规范 §5.7 | read | 约束协议总表、独立协议小节、schema、构造闭环、错误 / 幂等 / 审计和协议族停审 | 不以简略 inventory 代替字段级 schema |
| `设计真相源闭环与可落码性标准.md` | read | 执行 metadata、DTO 构造、query surface、page、typed ref、stored replay 和 phase boundary 闭环 | unresolved 缺口必须回开前序 Step,不得交给实现者猜测 |
| 正式 `01-架构设计.md` §8~§11 | active baseline | 数据 owner、依赖倒置、通信方式和禁止技术绑定 | 同步 / 异步 / job 类别成立,但 broker、topic、outbox 和产品选型不由本 Step发明 |
| 正式 `02-概要设计.md` §6~§10 | direct baseline | 43 个对象、26 Command、33 Query、6 Inbound、10 Outbound、8 Job、flow 和 state 输入 | 正式概要优先于旧 `03` |
| `02_hld_step_07_api_interface_skeleton.md` | completed | 完整接口 inventory、owner、输入 / 输出骨架和 old-interface audit | External Port 已由 Step 7 承接,本 Step 不把 port 再伪装成 public API |
| `02_hld_step_08_processing_flows.md` | completed | generic / independent flow 和 no-write / no-repair / no-rollback 要求 | exact function flow 留 Step 9 |
| `02_hld_step_09_state_machine.md` | completed | public surface 需要暴露的 formal state vocabulary | 完整转换矩阵留 Step 10 |
| `03_ddd_step_05_module_contracts.md` | completed | contracts / application / api / worker / jobs owner和依赖方向 | public DTO 只归 contracts;entry 只 mapping |
| `03_ddd_step_06_object_contracts.md` | completed_with_step_12_batch_12_6_reopen | shared enum / typed ref、43 HLD object fields / factories、7个application technical helper,含Job execution journal、Step 10 callable closure、Step 12 error reachability、audited-static issue-id入口、closed Query degraded reason与Job safe-terminalization invariant | public DTO不直接暴露domain object或application-local helper;journal只作response assembly source |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | completed_with_step_9_step_10_and_step_12_reopen | 36个Port,含typed consumer / Job replay、event capture、normalized-key Job execution repository与closed read-degraded resolver source | public page映射internal page;Job completed duplicate只typed get,reserved reentry只exact journal get；resolver/fake不得从文本推导degraded kind |
| L1 governance / artifact Step 8 | reference only | 参考 shared envelope、协议族、独立 schema、receipt / report和审计粒度 | 不复制 governance / artifact 主语,不继承 artifact 本地 relay / snapshot 设计 |
| 旧正式 `03-详细设计.md` / README | historical material | 识别旧 `QueryCapabilities`、ProviderContract、KMS / Vault、cost、runtime gateway、policy refresh和outbox污染 | 不作为 schema、route、event 或 job 真相源 |

输入结论:

- 当前协议全集为 `26 Command + 33 Query + 6 Inbound Event Consumer + 10 Outbound Event + 8 Operations Job = 83` 个入口。
- Step 7当前36个trait均是application callable seam,不是public protocol。历史baseline由原32个加read-visibility、observability/audit inbound和event-capture形成35；batch `9.11` pre-entry为Step 6 Job journal新增第36个repository。Step 8不为任何repository / resolver / handoff port创建外部路由。
- `ActorContext`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`JobRunId`、`Timestamp`、`TraceId`、`Version` 直接复用 `core-contracts`;不得本地复制第二套基础 metadata schema。
- batch `8.2` 的DTO构造反查触发两类Step 6最小回开:六类truth mutation返回change record的member缺record id / trace / reason / exact kind;专用safe reason newtype缺少到generic `ChangeReason`参数的无损bridge。修正已在`03_ddd_step_06_object_contracts.md` §7.6 / §20.4闭合;当时无需回开Step 7,也未新增business truth。后续batch `8.5`的durable capture回开是独立可靠传播修正。
- batch `8.2` 同时在Step 8内补齐descriptor replacement / exposure mutation所需exact registry ref、reference subject / state effect refs、secret safe-summary独立history和exposure / visibility / registry multi-object effect;这些均复用既有对象 / Port。

## 3. SOP 问题回答

### 3.1 协议如何分族、由谁调用和处理?

- Command / Query 采用 versioned HTTP/JSON 同步 request-response surface;`api` 解析 envelope并只调用 application service。
- Inbound Event 采用 schema-versioned logical event envelope;外部协作边界发布,`worker` 归一化 trusted source metadata并只调用 application consumer service。
- Outbound Event采用schema-versioned logical envelope;source-owning application service在accepted exact source的local UoW内完成mapping、serialization、immutable snapshot与initial capture,commit后application collaboration facade只从stored snapshot构造transient candidate并调用Step 7 external collaboration port。physical topic / exchange / stream / consumer group不在本Step绑定。
- Operations Job 采用显式 runner trigger + typed request/report;`jobs` 只调用 application job service。调度器、cron表达式、重试参数和部署绑定留 Step 14 / `04`。

### 3.2 metadata authority 如何保持唯一?

- Command envelope 的 `actor_context` 是 actor 唯一来源,`CommandMetadata` 是 request / trace / idempotency metadata 唯一来源;entry 从 core metadata提取并归一化 trace / idempotency给 `CapabilityOperationContext::from_command`,body 不重复这些字段。
- Query envelope 同理使用 `actor_context + QueryMetadata`;body 只承载 query target / scope / filter / public page request,不承载 write metadata或幂等键。
- Inbound envelope 独立承载 trusted `source_actor_context`、`source_event_ref`、`trace_id`、`idempotency_key` 和 schema version;typed payload不得重复 envelope字段。
- Job metadata独立承载 system / operator actor、`JobRunId`、trace和idempotency key;job body不得覆盖 authority。

### 3.3 DTO 字段怎样构造对象而不泄漏 owner body?

- typed id / ref、intent、reason、scope、safe summary和closed enum由调用方提供;system id、time、version、change / trace record id由 application IdGenerator / Clock / loaded repository提供。
- governance / method / secret / external document / runtime-tools / SDK / audit输入只允许 typed ref、locator summary、safe summary或candidate digest,禁止正文。
- command DTO只表达业务意图,不得接受 caller-supplied `version` 作为 optimistic expected version;application必须从 Step 7 `Loaded<T>.expected_version` 获取更新版本。
- outbound payload只复制本次accepted change / impact / derived / reference exact revision及其正式body-free状态;snapshot与source在同一UoW提交。commit后不得从current truth重算,也不得携带执行结果或相邻仓正文。

### 3.4 Query 的 visible / empty / not-visible / degraded surface 怎样表达?

- single query统一返回 explicit `CapabilityQuerySurface + Option<T>`;not-visible不伪装not-found,missing / degraded / stale / rebuilding / unavailable均由typed surface表达。
- paged query统一返回 `items + CapabilityPublicPageInfo + CapabilityQuerySurface`;visible empty page为items空且surface可区分正常empty与degraded。
- public cursor与Step 7 repository cursor是不同类型;entry/application mapper只做opaque单向包装和scope-bound validation,public层不得依赖 repository helper。
- truth read freshness为`NotApplicable`;projection / view / report读取必须复制formal state / freshness marker,不得由entry通过timestamp或error string猜测。

### 3.5 Command / Consumer / Job duplicate 如何回放?

- 三类write-channel均计算stable business digest、reserve idempotency并保存typed public surface;duplicate same digest读取原stored surface并返回同一public result ref。
- duplicate replay不得重跑domain mutation、consumer effect、job scan、handoff或event collaboration;missing / digest mismatch是Step 12 consistency failure。
- Query不使用idempotency、不保存result、不产生change / trace / event candidate。

### 3.6 Actor / trusted source例外有哪些不可绕过门禁?

- Command / Query actor来自可信同步入口,仍需application visibility / scope / policy判断;actor不从body、route或ref文本推导。
- Inbound source actor可为受信integration/system actor,但只对声明的source kind成立;不得绕过schema-version、digest、source isolation、forbidden-body、typed-ref-kind、idempotency或local state gate。
- Job actor只能是system/operator,不得借job修核心truth或伪造实现run、测试结果、evidence alias、验收签署。

### 3.7 Step 6 / 7 reopen watchpoint 是否触发?

触发过两类Step 6可落码性修正,现已关闭:

- 触发原因不是新增business object,而是既有mutation member无法构造其声明返回的append-only change record。
- Step 6已补齐application-generated record id、operation trace、body-free reason、sensitive marker和closed change kind;Step 7既有IdGenerator / change repository已完整承接,无需修改Port。
- Step 6已为`IdentityCorrectionReason`、`IdentityChangeReason`、registry / descriptor / method / exposure专用safe reason补`to_change_reason(&self) -> ChangeReason`;bridge只复制同一validated safe-text value,不解析debug text或引入第二reason truth。
- Step 8内已为descriptor replacement和exposure update / suspend / retire补exact `registry_entry_ref`;reference command effect补typed subject / state refs;secret safe summary使用既有`SafeSummaryChanged` change kind;均不要求新增Step 7读取面。
- batch `8.3` 开工反查触发Query只读面最小回开:Step 6 `CapabilityReadSubjectRef`补齐单对象与11类collection主语;Step 7新增`CapabilityReadVisibilityResolverPort`和scope / source resolution helper,使single read resolver-first且empty page有page-level visibility seed。该修正只增加ephemeral read carrier / Port,不新增truth或write path。
- batch `8.4` 开工反查触发Consumer replay / audit resolution最小回开:Step 7补`CapabilityConsumerReceiptEnvelope`及typed receipt save/get,并新增inbound-only `ObservabilityAuditReferencePort`;两者不新增business truth,也不把outbound audit handoff当resolver。
- batch `8.4` DTO -> object / repository闭环又发现Step 7统一`find_by_candidate_digest`无法由前四类reference对象自身字段实现;Step 6已为`ExternalCapabilitySourceRef`、`SecretRef`、`GovernanceResultRef`和`MethodAssetRef`补canonical `candidate_digest`及register / replace参数。8类ref现均持久化body-free digest,未新增owner、state或Port。
- public protocol name、page、surface、rejection、receipt、event envelope和job report仍只是Step 8 contracts carrier,不形成新的persisted business object。
- batch `8.5`开工反查已确认transient-only post-commit formation存在不可恢复pre-intent崩溃窗口,因此`CH-DDD-S7-WATCH-001`已触发并关闭:Step 6新增immutable payload snapshot / versioned capture,Step 7新增capture repository与snapshot / capture id source。
- source、complete serialized envelope snapshot和initial `Captured` record必须同一local UoW;external intent仍在commit后形成并由独立短UoW绑定。capture不复制external pending / delivered / failed / unavailable状态,也不是已选型outbox / relay产品。
- batch `8.7`跨协议replay反查触发typed Job最小回开:Step 7在既有`StoredCapabilityResultRepository`补`CapabilityStoredJobResponse`、`CapabilityStoredJobReportEnvelope`与`get_job_report / save_job_report`;8类Job duplicate不再自行选择generic bytes decoder、按run反查report或重跑scan / resolver / collaboration。Port总数仍为35。
- Step 9 batch `9.1`逐flow反查触发`CH-DDD-S9-AFFECTED-MATERIAL-001`:Step 6补`ChangeReason`到trace / 四类material stale reason的typed bridge并允许newer truth把任一non-stale current material推进stale;Step 7在既有scan scope补`MutableAffectedByTruth`,固定view + 三类mutable material选择、stable order、expected version和same-UoW capture。Port总数仍为35,未新增public protocol carrier。
- Step 9 batch `9.2`逐flow反查关闭两项受控缺口:`bind_descriptor(...)`现在原子绑定descriptor并把registry推进 / 保持`VisibilityPending`,唯一`DescriptorBound`record解释最终registry revision；multi-subject Command先按subject收集material candidate,再按typed ref union并单次load / stale / capture / save。两项均不新增public DTO、trait或Port。
- 同批candidate构造反查又关闭`CH-DDD-S9-REFERENCE-LOCATOR-MAP-001`:Step 6现有`ReferenceLocatorSummary`补secret/governance/method三个body-free one-way constructor,均有英文`///`Rustdoc；protocol DTO / object owner / Port总数不变。
- 若后续batch发现public schema必须拥有新的stable business字段 / state,仍须立即停止并回开Step 6 / 7,不得在contracts或infra私补。

## 4. 协议全集与执行顺序

### 4.1 协议族总览

| 协议族 | 数量 | public owner | entry / producer | application处理方 | transport surface | 后续Step 9 |
|---|---:|---|---|---|---|---|
| Command | 26 | `contracts::command` | `api` | command service family | `POST /v1/capability-hub/commands/{operation}` | 每个Command独立flow |
| Query | 33 | `contracts::query` | `api` | query service family | `POST /v1/capability-hub/queries/{operation}` | 每个Query独立flow |
| Inbound Event Consumer | 6 | `contracts::event` | external collaborator -> `worker` | consumer service family | logical event envelope | 每个Consumer独立flow |
| Outbound Event | 10 | `contracts::event` | application event mapper | external collaboration facade / port | logical event candidate | 每个candidate formation / collaboration flow |
| Operations Job | 8 | `contracts::job` | `jobs` runner | job / maintenance service family | `capability-hub.job.{operation}` trigger | 每个Job独立flow |

`{operation}` 的closed mapping由各协议族route表给出;entry不得用任意字符串反射dispatch。HTTP path是logical API contract,server framework / listener / endpoint binding仍留Step 14。

### 4.2 协议定义批次

| 顺序 | 协议族 | 先闭合内容 | 完成后停审点 |
|---:|---|---|---|
| 1 | shared | metadata authority、name / schema ref、request / response envelope、query/page surface、rejection、receipt、event/job report | 所有二级public type有schema和owner |
| 2 | Command | 26 request / result、route、field source、object construction、error / idempotency / audit | 每个mutation intent有Step 6对象和Step 7port承接 |
| 3 | Query | 33 request / view / page、read source、visible / empty / degraded口径 | 每个read surface有字段级schema和repository key |
| 4 | Inbound | 6 typed payload、envelope specialization、receipt / duplicate / quarantine / delayed | source authority、forbidden body、local effect闭合 |
| 5 | Outbound | 10 payload、schema version、routing key、exact-source mapping、same-UoW snapshot / capture | commit后无current-truth rebuild、无第二payload copy或业务outbox产品 |
| 6 | Job | 8 input / report、trigger、scope、partial failure / replay | no-core-truth-repair、result明细由application返回 |
| 7 | cross audit | DTO construction、public secondary types、naming、page、stored replay、body boundary、protocol-to-flow | 无unresolved conflict后停审 |

### 4.3 Command inventory

| owner group | Command |
|---|---|
| identity / review | `EstablishCapabilityAccessContext`;`CorrectCapabilityIdentity`;`RetireCapabilityIdentity`;`RecordCapabilityAccessReviewFact` |
| registry | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState`;`UpdateRegistryVisibilityBasis`;`RetireCapabilityRegistryEntry` |
| descriptor / safe summary | `EstablishAdapterDescriptor`;`ReplaceAdapterDescriptor`;`RecordDescriptorRiskConstraintSummary`;`AttachDescriptorSecretReference` |
| governance / method relation | `AttachGovernanceSeamRelation`;`ReplaceGovernanceSeamRelation`;`ExpireGovernanceSeamRelation`;`AttachCapabilityMethodRelation`;`RemoveCapabilityMethodRelation` |
| exposure | `EstablishFormalExposureBoundary`;`UpdateFormalVisibilityApplicability`;`SuspendFormalExposureBoundary`;`RetireFormalExposureBoundary` |
| trace / impact | `RecordCapabilityChangeImpactFact`;`RecordTraceabilityHandoffSummary` |
| reference support | `RecordReferenceResolutionState`;`RegisterExternalDocumentReference`;`RegisterCapabilityConsumerReference` |

### 4.4 Query inventory

| owner group | Query |
|---|---|
| identity / review | `GetCapabilityIdentity`;`SearchCapabilityIdentities`;`GetCapabilityAccessReviewFact` |
| registry | `GetCapabilityRegistryEntry`;`ListCapabilityRegistryEntries`;`GetRegistryVisibilitySemantics` |
| descriptor / safe summary | `GetAdapterDescriptor`;`GetDescriptorRiskConstraintSummary`;`GetDescriptorSecretSafeSummary`;`ListDescriptorsByCapability` |
| governance / method relation | `GetGovernanceSeamRelation`;`GetAccessGovernanceSeparation`;`GetCapabilityMethodRelation`;`ListCapabilityRelations` |
| exposure / consumer | `GetFormalExposureBoundary`;`GetFormalVisibilityApplicability`;`GetControlledConsumerView`;`ListConsumableCapabilitiesForRuntimeTools`;`GetSdkExposureBoundary` |
| trace / impact | `GetCapabilityAccessTrace`;`GetCapabilityChangeImpact`;`GetDownstreamConsumptionImpactSummary`;`GetAuditHandoffTraceSummary` |
| derived | `SearchCapabilityDirectory`;`BrowseCapabilityDirectory`;`GetAuditFriendlyExportSummary`;`GetReadOnlyEcosystemDiscoverySummary`;`GetCapabilityReconciliationReport` |
| reference support | `GetReferenceResolutionState`;`GetExternalDocumentReference`;`GetRuntimeToolsConsumerReference`;`GetSdkExposureConsumerReference`;`GetObservabilityAuditReference` |

### 4.5 Event / Job inventory

| 类别 | protocols |
|---|---|
| Inbound | `ConsumeGovernanceResultReferenceChanged`;`ConsumeMethodAssetReferenceChanged`;`ConsumeDownstreamConsumptionImpactReported`;`ConsumeExternalCapabilitySourceReferenceChanged`;`ConsumeAuditMaterialReferenceChanged`;`ConsumeExternalDocumentReferenceChanged` |
| Outbound | `CapabilityIdentityChanged`;`CapabilityRegistryChanged`;`AdapterDescriptorChanged`;`GovernanceSeamRelationChanged`;`CapabilityMethodRelationChanged`;`FormalExposureBoundaryChanged`;`ControlledConsumerViewAvailabilityChanged`;`CapabilityChangeImpactIdentified`;`DerivedMaterialRefreshed`;`ReferenceResolutionChanged` |
| Job | `RunCapabilityRegistryReconciliation`;`RefreshControlledConsumerView`;`RebuildDirectorySearchBrowseProjection`;`PrepareAuditFriendlyExportSummary`;`RebuildReadOnlyEcosystemDiscoverySummary`;`RunDerivedMaterialReconciliation`;`RefreshExternalReferenceResolution`;`RepairCapabilityAccessEventCollaboration` |

## 5. Step 8 写入门禁

1. 每个协议必须有独立小节、exact Rust request / response / payload schema、route / logical event / trigger、caller / handler、错误 / 幂等 / 审计规则和Step 9 flow名。
2. 所有public field type必须来自Step 6 contracts shared或本Step已定义的public secondary type;不得引用domain object、application `Loaded<T>` / repository cursor / stored-result helper或infra type。
3. Command调用方不得提交object id、change record id、trace id派生值、created / updated time或expected version作为business intent;这些由application context、IdGenerator、Clock和loaded repository提供。
4. Query body不携带actor、trace、idempotency或consistency的第二份来源;分页只使用public page request,并显式映射Step 7 page helper。
5. Inbound payload不重复envelope字段;source actor例外不绕过schema / digest / body-free / ref-kind / idempotency / state gate。
6. Outbound event schema只从本次accepted exact source形成;完整envelope snapshot / initial capture必须与source同一local UoW。commit后只能读取official snapshot,不得从current truth重建,也不得定义第二local queue / payload copy、业务outbox / relay产品或delivery attempt state。
7. Job input必须是typed scope / ref / page,report必须携带application返回的changed / failed / skipped明细;entry不得直读repository或adapter补report。
8. `ApplicationError` exact variant与HTTP / event retry mapping留Step 12,但本Step必须固定public rejection / surface / receipt / report shape和stable classification。
9. physical endpoint、broker topic、consumer group、codec product、scheduler、timeout、credential和retry配置留Step 14 / `04`;本Step只定义logical contract。
10. 正式 `03-详细设计.md` 保持不动;不得创建Step 9、implementation ledger、boundary skeleton或任何伪造实现 / 测试 / 验收事实。
11. 每个Rust public struct / enum、struct field、enum variant及variant field都必须有英文`///` Rustdoc；enum struct variant内不得写非法的field-level `pub`。

## 6. Shared Public Protocol Contract

所有本节类型归 `contracts::shared` / `contracts::command` / `contracts::query` / `contracts::event` / `contracts::job`。它们只承载public body-free surface;不得依赖`application`、`domain`或`infra`。实现时可通过显式mapper从Step 6/7 application-local type转换,不得直接re-export后者。

### 6.1 Protocol identity / schema / result ref

```rust
/// Closed public name of one capability-hub command protocol.
pub struct CapabilityCommandName(
    /// Validated route-neutral command name.
    pub CapabilitySafeText,
);

/// Closed public name of one capability-hub query protocol.
pub struct CapabilityQueryName(
    /// Validated route-neutral query name.
    pub CapabilitySafeText,
);

/// Closed public name of one capability-hub inbound consumer protocol.
pub struct CapabilityInboundConsumerName(
    /// Validated route-neutral inbound consumer name.
    pub CapabilitySafeText,
);

/// Closed public name of one capability-hub outbound event protocol.
pub struct CapabilityOutboundEventName(
    /// Validated route-neutral outbound event name.
    pub CapabilitySafeText,
);

/// Closed public name of one capability-hub operations job protocol.
pub struct CapabilityJobName(
    /// Validated route-neutral operations job name.
    pub CapabilitySafeText,
);

/// Version of a public protocol schema.
pub struct CapabilityProtocolSchemaVersion(
    /// Positive schema version accepted by the concrete protocol.
    pub u16,
);

/// Public protocol result identity mapped from an application result ref.
pub struct CapabilityProtocolResultRef {
    /// Stable route-neutral operation name.
    pub operation_name: CapabilitySafeText,
    /// Locally generated result identifier.
    pub result_id: CapabilityApplicationResultId,
}

/// Body-free reference to one public protocol surface.
pub struct CapabilityProtocolSurfaceRef(
    /// Opaque protocol-surface identifier.
    pub CapabilityOpaqueId,
);

/// Closed body-free issue classification shared by protocol and application mappers.
pub enum CapabilityIssueCode {
    /// Required envelope metadata is absent or internally inconsistent.
    InvalidEnvelope,
    /// A required body field is absent.
    MissingRequiredField,
    /// The closed operation name does not match the selected body schema.
    OperationMismatch,
    /// A field value or closed enum combination is invalid.
    InvalidField,
    /// Actor, target, filter, page, or job scope is invalid.
    InvalidScope,
    /// The same idempotency key identifies a different stable request.
    DuplicateConflict,
    /// A stable domain or boundary policy rejected the requested intent.
    PolicyRejected,
    /// The request attempted to cross a forbidden body or material boundary.
    BodyForbidden,
    /// The declared protocol schema version is unsupported.
    UnsupportedSchema,
    /// A visible requested subject is absent from the declared scope.
    SubjectMissing,
    /// A required external reference has not resolved.
    ReferenceUnresolved,
    /// A required external reference boundary is unavailable.
    ReferenceUnavailable,
    /// A source truth or derived material revision is stale.
    StaleSource,
    /// A derived material is rebuilding and cannot be served as fresh.
    MaterialRebuilding,
    /// A persisted material or immutable report cannot currently be served.
    MaterialUnavailable,
    /// Only a formally allowed partial body or result can be served.
    PartialSurface,
    /// A forbidden body or visibility rule requires a redacted surface.
    RedactedBoundary,
    /// An inbound operation cannot proceed until a prerequisite changes.
    RetryRequired,
    /// A stable boundary conflict requires an inbound item to be quarantined.
    BoundaryQuarantined,
    /// A reference or material target is terminal and was not reopened.
    TerminalTargetSkipped,
    /// A body-free external handoff was rejected by a stable boundary rule.
    HandoffRejected,
    /// The body-free external handoff boundary is temporarily unavailable.
    HandoffUnavailable,
    /// A body-free external handoff may be retried without changing local truth.
    HandoffRetryable,
    /// External event collaboration failed without rolling back committed truth.
    CollaborationFailed,
    /// The external event-collaboration boundary is unavailable.
    CollaborationUnavailable,
    /// An application-owned typed input or transient carrier is invalid.
    InvalidApplicationInput,
    /// An application technical state transition is invalid.
    InvalidTechnicalStateTransition,
    /// An application technical invariant failed before persistence or mapping.
    TechnicalInvariantViolation,
    /// A flow-declared typed prerequisite is absent.
    MissingPrerequisite,
    /// A stale version, dependency fence, or concurrent successor won.
    OptimisticConflict,
    /// A formal unique or current-owner key has a different winner.
    UniquenessConflict,
    /// The same idempotency key identifies a different operation or digest.
    IdempotencyConflict,
    /// The matching idempotent operation is still in progress.
    IdempotencyInProgress,
    /// A required Port failed before producing a valid typed return.
    DependencyFailure,
    /// A local unit of work could not be opened.
    TransactionBeginFailed,
    /// A local commit is confirmed not durable.
    TransactionCommitFailed,
    /// A local rollback attempt failed.
    TransactionRollbackFailed,
    /// A local commit may be durable but its outcome cannot be proved.
    CommitOutcomeUnknown,
    /// Persisted or returned typed data violates a required relation.
    ConsistencyDefect,
    /// Application-owned encoding, canonicalization, or digest verification failed.
    CodecFailure,
    /// Process runtime assembly failed before an application invocation existed.
    RuntimeAssemblyFailed,
    /// API route, RPC method, and concrete protocol operation do not match.
    ApiRouteAssemblyFailed,
    /// Trusted API request metadata cannot be normalized safely.
    ApiEnvelopeNormalizationFailed,
    /// A public API DTO cannot be mapped to or from the declared typed surface.
    ApiProtocolMappingFailed,
    /// Inbound event metadata, source actor, schema, or dispatch is invalid.
    WorkerInboundEnvelopeFailed,
    /// An inbound event cannot be decoded into its closed typed payload.
    WorkerPayloadDecodingFailed,
    /// A worker collaboration continuation cannot be mapped safely.
    WorkerCollaborationContinuationFailed,
    /// A worker maintenance trigger cannot be dispatched safely.
    WorkerMaintenanceTriggerFailed,
    /// Operations-job metadata, trigger, or typed input is invalid.
    JobInputFailed,
    /// An operations-job application service cannot be dispatched safely.
    JobApplicationDispatchFailed,
    /// A typed operations-job response cannot be mapped to the runner boundary.
    JobResultMappingFailed,
}

/// Body-free reference to one redacted protocol or application issue.
pub struct CapabilityProtocolValidationIssueRef(
    /// Deterministic opaque identifier derived from one closed issue code.
    CapabilityOpaqueId,
);

/// Ordered and duplicate-free validation issue references.
pub struct CapabilityProtocolValidationIssueRefSet(
    /// Redacted issue references in stable duplicate-free order.
    Vec<CapabilityProtocolValidationIssueRef>,
);

impl CapabilityIssueCode {
    /// Returns the fixed versioned literal for this issue classification.
    pub const fn literal(&self) -> &'static str;

    /// Parses one exact known literal without accepting aliases or unknown values.
    pub fn from_literal(value: &str) -> Option<Self>;
}

impl CapabilityProtocolValidationIssueRef {
    /// Creates the deterministic body-free reference for one closed issue code.
    pub fn from_code(code: CapabilityIssueCode) -> Self;

    /// Returns the fixed opaque issue identifier without exposing a mutable value.
    pub fn as_opaque_id(&self) -> &CapabilityOpaqueId;
}

impl CapabilityProtocolValidationIssueRefSet {
    /// Returns an empty stable issue-reference set.
    pub fn empty() -> Self;

    /// Maps closed issue codes in input order and removes later duplicates.
    pub fn from_codes(codes: Vec<CapabilityIssueCode>) -> Self;

    /// Validates an already mapped issue-reference set in stable input order.
    pub fn try_from_refs(
        refs: Vec<CapabilityProtocolValidationIssueRef>,
    ) -> Result<Self, ContractValueError>;

    /// Iterates over issue references in their stable stored order.
    pub fn iter(&self) -> impl Iterator<Item = &CapabilityProtocolValidationIssueRef>;

    /// Returns whether no issue reference is present.
    pub fn is_empty(&self) -> bool;
}
```

| type | source | invariant / mapping |
|---|---|---|
| five protocol names | §4 inventories | value必须等于closed inventory成员;不得使用route、handler名、topic或config key代替 |
| `CapabilityProtocolSchemaVersion` | protocol-family schema declaration | 当前每个协议初始值为`1`;unknown / `0` reject;兼容策略由每族固定 |
| `CapabilityProtocolResultRef` | `CapabilityApplicationResultRef` mapper | `operation_name`必须等于当前protocol name;duplicate replay复制原ref,不得生成新id |
| `CapabilityProtocolSurfaceRef` | entry normalizer / stored surface mapper | 不暴露repository row、HTTP path、topic、handler或serialized body |
| `CapabilityIssueCode` | Step 12 exact mapper over typed validation、degraded/outcome和application/entry failure | 51个closed variants；每个variant唯一映射一个`capability-hub.issue/<kebab-name>.v1`literal；不携带字段、对象、Port、subject或raw detail |
| validation issue ref/set | protocol validator / typed application mapper | ref只经`from_code`形成；set保持first-occurrence稳定顺序并去重；不得含raw field value、secret、stack或external body |

Step 12 batch `12.3`固定issue identity contract:

- `CapabilityIssueCode`必须实现`Clone + Copy + Eq + PartialEq`;issue ref与set必须实现`Clone + Eq + PartialEq`并使用transparent value serialization。不得依赖hash-map iteration或`Hash`语义决定stored order。
- `literal()`必须是51-arm穷尽`match`;51个值均为ASCII、non-empty、unique,固定namespace为`capability-hub.issue/`、suffix为`.v1`。`from_literal`只接受逐字节exact match,unknown / case-folded / trimmed alias均返回`None`。
- `from_code`唯一实现路径是`CapabilityOpaqueId::from_audited_static(code.literal())`;不得调用`IdGeneratorPort`、Clock、hash、format、repository、config或adapter。相同code在任何channel、进程和replay中产生相同ref。
- `from_codes`按输入顺序保留第一次出现并删除后续同code项；它不得排序。`try_from_refs`只验证已有ref非空且duplicate-free,遇到duplicate返回`ContractValueError::DuplicateTypedSetValue`;empty合法。
- `CapabilityProtocolValidationIssueRef`与Set的inner field为private。调用方不能包装任意`CapabilityOpaqueId`或直接构造`Vec`;序列化只能输出opaque literal,反序列化必须经exact `from_literal -> from_code` canonicalize,不能接受任意opaque string。
- issue ref只分类,不定位实例。同一code可对应多个同时发生的target/marker；target identity由外层`CapabilityJobTargetIssue.target_ref`、operation由outer response、source event由receipt承担,不得把subject id、field name、run id、trace id、timestamp或counter拼入ref。
- 既有serialized stored surface中的ref在duplicate replay时原样复制；mapper禁止用current code表重建旧surface。新写入必须使用当前closed code canonical ref。literal替换或复用是breaking compatibility change,不得静默改值。

### 6.2 Command envelope / outcome / accepted effect

```rust
/// Public synchronous command request envelope.
pub struct CapabilityCommandRequest<T> {
    /// Trusted actor supplied by the synchronous entry boundary.
    pub actor_context: ActorContext,
    /// Core command request, trace, time, and idempotency metadata.
    pub metadata: CommandMetadata,
    /// Closed route-neutral command name.
    pub command_name: CapabilityCommandName,
    /// Command-specific body-free business intent.
    pub body: T,
}

/// Body-free references produced by one accepted local transaction.
pub struct CapabilityCommandEffectSummary {
    /// Created or changed core truth subjects.
    pub changed_subject_refs: Vec<CapabilityTraceSubjectRef>,
    /// Created or changed body-free external reference subjects.
    pub changed_reference_subject_refs: Vec<ReferenceSubjectRef>,
    /// Append-only change records committed by the operation.
    pub change_record_refs: Vec<CapabilityChangeRecordRef>,
    /// Exact traceability revisions formed for changed truth subjects.
    pub traceability_refs: Vec<CapabilityAccessTraceabilityRecordRef>,
    /// Canonical reference-state revisions created or changed by the operation.
    pub reference_state_refs: Vec<ReferenceResolutionStateRef>,
    /// Exact impact fact revision when one was formed.
    pub impact_ref: Option<CapabilityChangeImpactFactRef>,
    /// Derived materials marked stale by committed truth change.
    pub affected_material_refs: Vec<DerivedMaterialRef>,
    /// Logical outbound event candidates formed from committed sources.
    pub outbound_event_names: Vec<CapabilityOutboundEventName>,
}

/// Public accepted command response envelope.
pub struct CapabilityCommandResponse<T> {
    /// Closed command name.
    pub command_name: CapabilityCommandName,
    /// Stable result identity used for duplicate replay.
    pub result_ref: CapabilityProtocolResultRef,
    /// Fresh execution or stored replay disposition.
    pub disposition: CapabilityCommandProtocolDisposition,
    /// Command-specific result body.
    pub result: T,
    /// Complete accepted local effect summary returned by application.
    pub effect: CapabilityCommandEffectSummary,
}

/// Public command completion disposition.
pub enum CapabilityCommandProtocolDisposition {
    /// The command completed a fresh accepted local transaction.
    Accepted,
    /// The original accepted response was replayed without rerunning mutation.
    DuplicateReplayed,
}

/// Public command handler outcome.
pub enum CapabilityCommandOutcome<T> {
    /// Accepted fresh or duplicate-replayed result.
    Accepted(
        /// Typed accepted command response.
        CapabilityCommandResponse<T>,
    ),
    /// Stable rejection before accepted truth mutation.
    Rejected(
        /// Body-free stable protocol rejection.
        CapabilityProtocolRejection,
    ),
}
```

| field / rule | source | constraints |
|---|---|---|
| `actor_context` | trusted API authentication / integration boundary | only actor authority;body不得重复;application仍执行scope/policy |
| `metadata` | `core_contracts::CommandMetadata` | request id / trace / requested time / idempotency source;entry不得补第二份 |
| `command_name` | exact route table | 必须与concrete `T`匹配;mismatch在进入service前reject |
| `result_ref` / disposition | stored result / idempotency service | fresh=`Accepted`;same digest replay=`DuplicateReplayed`;conflict走rejection |
| changed truth / reference、change / trace / reference-state / impact refs | application transaction result | entry不得在commit后查repository补齐;集合stable order + unique;每条trace revision只覆盖一个Step 6 trace subject;reference subject与state ref必须owner对称 |
| affected materials | terminal accepted change record + Step 7 §11.3.1 stale propagation | 只列本次UoW实际从non-stale推进stale并成功save / capture的view、directory、audit-export、ecosystem ref；candidate、already-stale、missing与immutable reconciliation report均不得列入；空集合只表示没有实际stale transition,不得暗示“全部” |
| outbound event names | committed source到§10 event mapping | 只表示candidate formed;不表示external collaboration delivered |

`CapabilityCommandResponse<T>`的完整serialized surface可以由`StoredCapabilityResultRepository`保存。首次响应与duplicate replay必须byte-semantics等价,仅entry可在HTTP header等transport metadata表达replay;typed body中的`disposition`必须按stored original response mapper稳定转换。若实现选择把`DuplicateReplayed`写入body,stored replay mapper必须复制original result/effect并只替换该public technical marker,不能重算current truth。Step 13已固定stored-surface domain-separated digest与byte integrity；concrete deterministic protocol codec binding留Step 14。

`traceability_refs`是vector而非single optional ref:单一truth subject变化通常返回一项；descriptor + registry等multi-subject transaction按subject canonical order返回多项；无Step 6正式change record的accepted operation返回空vector。不得把不同`CapabilityTraceSubjectRef`的change refs塞入一条trace revision,也不得只返回第一条而丢失其余审计事实。

Core-truth Command的`affected_material_refs`与material availability capture必须由Step 7 §11.3.1同一遍stable scan形成。每个actual stale revision分别形成`ControlledConsumerViewAvailabilityChanged`或`DerivedMaterialRefreshed`capture；`outbound_event_names`按logical event name去重且保持首次形成顺序,因此多个directory / export / discovery stale revision仍只列一次`DerivedMaterialRefreshed`,capture数量仍按exact source revision逐项计算。Command response不公开capture ref,也不把event name当delivery proof。

若一个accepted Command改变多个truth subject,必须先按flow规定的canonical subject order完成全部affected candidate扫描,再以`DerivedMaterialRef` typed variant + id形成union并按material canonical order处理。一个material即使被多个subject命中,也只能exact load、mark、capture、save和进入effect各一次；reason取首次命中subject的terminal accepted record,且所有subject record必须来自同一个caller command reason。不得逐subject即时mutation、依赖read-your-writes或返回重复material ref。

### 6.3 Query envelope / visibility / freshness / degraded surface

```rust
/// Public read-only query request envelope.
pub struct CapabilityQueryRequest<T> {
    /// Trusted actor supplied by the synchronous entry boundary.
    pub actor_context: ActorContext,
    /// Core query trace, consistency, and request metadata.
    pub metadata: QueryMetadata,
    /// Closed route-neutral query name.
    pub query_name: CapabilityQueryName,
    /// Query-specific target, scope, filter, and page input.
    pub body: T,
}

/// Public visibility marker mapped from application read decision.
pub enum CapabilityQueryVisibility {
    /// The caller may receive the declared response surface.
    Visible,
    /// The caller must not receive the requested body or item identities.
    NotVisible,
    /// A body-free degraded surface may be returned.
    Degraded,
}

/// Public freshness marker for truth and derived reads.
pub enum CapabilityQueryFreshness {
    /// The derived body matches its declared source versions.
    Fresh,
    /// The body is stale but policy permits an explicit degraded read.
    StaleReadable,
    /// The requested derived body is rebuilding and cannot be served as fresh.
    Rebuilding,
    /// The requested body is unavailable.
    Unavailable,
    /// Freshness does not apply to this direct truth read.
    NotApplicable,
}

/// Stable public degraded categories;details remain redacted refs.
pub enum CapabilityQueryDegradedKind {
    /// The requested subject does not exist in the visible scope.
    Missing,
    /// One or more required external references are unresolved.
    ReferenceUnresolved,
    /// One or more required external boundaries are unavailable.
    ReferenceUnavailable,
    /// A source truth or derived material revision is stale.
    StaleSource,
    /// The derived material is rebuilding.
    Rebuilding,
    /// The persisted derived material or immutable report cannot currently be served as available.
    MaterialUnavailable,
    /// Only a formally allowed partial body can be served.
    Partial,
    /// A forbidden body or visibility rule requires redaction.
    Redacted,
}

impl CapabilityQueryDegradedKind {
    /// Maps this typed degraded category to its stable body-free issue code.
    pub fn issue_code(&self) -> CapabilityIssueCode;

    /// Maps this typed degraded category to its exact public freshness marker.
    pub fn freshness(&self) -> CapabilityQueryFreshness;
}

/// One body-free degraded marker.
pub struct CapabilityQueryDegradedMarker {
    /// Stable degraded category.
    pub kind: CapabilityQueryDegradedKind,
    /// Redacted diagnostic reference,never a raw error or external body.
    pub issue_ref: CapabilityProtocolValidationIssueRef,
}

impl CapabilityQueryDegradedMarker {
    /// Creates a public marker whose kind and deterministic issue reference share one source.
    pub fn from_kind(kind: CapabilityQueryDegradedKind) -> Self;
}

/// Shared public query decision surface.
pub struct CapabilityQuerySurface {
    /// Explicit visibility mapped from application read decision.
    pub visibility: CapabilityQueryVisibility,
    /// Truth or derived freshness marker.
    pub freshness: CapabilityQueryFreshness,
    /// Zero or more stable degraded markers.
    pub degraded: Vec<CapabilityQueryDegradedMarker>,
    /// Exact source versions used by the read decision.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Application evaluation time.
    pub evaluated_at: Timestamp,
}

/// Public single-body query response.
pub struct CapabilityQueryResponse<T> {
    /// Closed query name.
    pub query_name: CapabilityQueryName,
    /// Explicit visibility and degradation decision.
    pub surface: CapabilityQuerySurface,
    /// Visible or explicitly allowed partial body.
    pub body: Option<T>,
}
```

Query surface invariants:

- `Visible`允许`body=Some`或正常`body=None`表示visible not-found;二者由各协议的not-found rule区分。`NotVisible`强制`body=None`且不得返回subject id。`Degraded`只允许各协议明示的body-free partial view。
- `NotApplicable`只用于direct truth / append-only record读取;controlled view、directory、export、discovery、report和reference-dependent surface不得伪装为`NotApplicable`。
- `degraded`只能由application从`CapabilityReadVisibilityDecision`、domain state、reference state、projection / report state映射;api不得解析`ApplicationError`文本、timestamp、cache age或private adapter code生成。
- `CapabilityQueryDegradedKind::freshness()`必须是8-arm显式match:`StaleSource / Partial -> StaleReadable`,`Rebuilding -> Rebuilding`,`Missing / ReferenceUnresolved / ReferenceUnavailable / MaterialUnavailable / Redacted -> Unavailable`。Normal visible missing和`NotVisible`不调用该mapper,分别保留协议定义的normal freshness与`NotApplicable`。
- `CapabilityQueryDegradedMarker::from_kind(kind)`必须先取得`kind.issue_code()`,再调用`CapabilityProtocolValidationIssueRef::from_code(code)`并原样保存同一kind；不得接受caller-supplied issue ref,不得用struct literal把其他code与kind组合。
- `source_versions`来自loaded truth / derived source marker;不作为optimistic expected version,不暴露repository cursor。
- Query不reserve idempotency、不保存stored result、不mark stale、不refresh、不rebuild、不append trace / change、不形成outbound candidate。

### 6.4 Public page contract and repository-page mapping

```rust
/// Opaque public continuation cursor bound to one query and scope.
pub struct CapabilityPublicPageCursor(
    /// Opaque continuation token bound to the originating query and scope.
    pub CapabilityOpaqueId,
);

/// Public page request carried only in query or job body.
pub struct CapabilityPublicPageRequest {
    /// Opaque continuation cursor returned by the same protocol and scope.
    pub cursor: Option<CapabilityPublicPageCursor>,
    /// Positive requested item limit.
    pub limit: u32,
}

/// Public page metadata mapped from one repository or external page.
pub struct CapabilityPublicPageInfo {
    /// Opaque next cursor for the same protocol and scope.
    pub next_cursor: Option<CapabilityPublicPageCursor>,
    /// Number of visible items in this response.
    pub returned_count: u32,
    /// Whether a next page is available.
    pub has_more: bool,
}

/// Public paged query response.
pub struct CapabilityPageResponse<T> {
    /// Closed query name.
    pub query_name: CapabilityQueryName,
    /// Explicit visibility and degradation decision.
    pub surface: CapabilityQuerySurface,
    /// Visible items in stable order.
    pub items: Vec<T>,
    /// Public page metadata.
    pub page: CapabilityPublicPageInfo,
}
```

| public -> application mapping | exact rule |
|---|---|
| `CapabilityPublicPageRequest.cursor` -> `CapabilityRepositoryCursor` | application page mapper validates opaque cursor integrity、query name和scope binding,再unwrap为application-local cursor;api不解析 |
| `limit` -> `CapabilityRepositoryPageRequest.limit` | 必须`>0`;Step 14配置给max,超过max在entry/application validation reject,adapter不静默截断 |
| repository `items` -> public `items` | application逐item执行visibility / view mapper;不得把`Loaded<T>`或domain object直接serialize |
| repository `next_cursor` -> public `next_cursor` | 单向opaque wrapper,只能回传给同query + same stable filter / scope |
| `returned_count` | public visible items长度 | 由mapper从最终items计算,不得使用DB total count猜测 |
| `has_more` | `next_cursor.is_some()` | 不单独接受adapter bool,避免双真相 |

not-visible page必须`items=[]`,`next_cursor=None`,`returned_count=0`,`has_more=false`;visible empty page同样items空,但`surface.visibility=Visible`且无`Missing` degraded marker。degraded page可返回允许的partial items,但每个item必须已经过同一visibility mapper。

### 6.5 Protocol rejection contract

```rust
/// Stable public reason for rejecting a command or job before accepted work.
pub enum CapabilityProtocolRejectionCode {
    /// Required envelope metadata is absent or internally inconsistent.
    InvalidEnvelope,
    /// A required body field is absent.
    MissingRequiredField,
    /// The closed operation name does not match the concrete body schema.
    OperationMismatch,
    /// A field value or closed enum combination is invalid.
    InvalidField,
    /// Actor, target, filter, or page scope is invalid.
    InvalidScope,
    /// The same idempotency key was used for a different stable request.
    DuplicateConflict,
    /// A stable domain or boundary policy rejected the requested intent.
    PolicyRejected,
    /// The request attempted to cross a forbidden body boundary.
    BodyForbidden,
    /// The declared protocol schema version is unsupported.
    UnsupportedSchema,
}

impl CapabilityProtocolRejectionCode {
    /// Maps this public rejection category to its stable body-free issue code.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}

/// Public body-free rejection surface.
pub struct CapabilityProtocolRejection {
    /// Rejected route-neutral protocol surface.
    pub surface_ref: CapabilityProtocolSurfaceRef,
    /// Rejected command or job operation name.
    pub operation_name: CapabilitySafeText,
    /// Stable rejection category.
    pub rejection_code: CapabilityProtocolRejectionCode,
    /// Redacted field or policy issue references.
    pub issue_refs: CapabilityProtocolValidationIssueRefSet,
    /// Stored rejection result when this rejection participates in replay.
    pub result_ref: Option<CapabilityProtocolResultRef>,
}
```

| scenario | public handling | persistence / replay rule |
|---|---|---|
| malformed envelope / operation mismatch | `InvalidEnvelope` / `OperationMismatch` | reject before idempotency reserve;`result_ref=None` |
| unsupported schema | `UnsupportedSchema` | payload/body不得解析;无业务写入;是否保存replay surface由Step 13在不泄漏body前提下统一 |
| same key + different digest / operation | `DuplicateConflict` | 不覆盖原reservation / result;不得返回原业务result给冲突请求 |
| policy / forbidden body | `PolicyRejected` / `BodyForbidden` | 无accepted truth mutation;若在reserve后形成stable rejection,保存`CommandRejection`并可replay |
| repository / UoW / serialization / wiring defect | `ApplicationError` | 不伪装protocol rejection;Step 12定义对外技术错误映射与恢复 |

Query的not-visible / missing / stale / unavailable优先使用`CapabilityQuerySurface`,不复用command rejection。Inbound和Job分别使用receipt/report disposition,不把`CapabilityProtocolRejection`作为它们的成功响应body。

### 6.6 Inbound event envelope / receipt

```rust
/// Declared upstream family for one inbound event.
pub enum CapabilityInboundSourceFamily {
    /// Governance result collaboration boundary.
    Governance,
    /// Method-library asset collaboration boundary.
    MethodLibrary,
    /// Runtime, tools, SDK, or product consumer feedback boundary.
    DownstreamConsumer,
    /// External MCP, A2A, or API capability source boundary.
    ExternalCapabilitySource,
    /// Observability or audit reference boundary.
    ObservabilityAudit,
    /// External protocol, standard, schema, or guide reference boundary.
    ExternalDocument,
}

/// Public body-free identity of an upstream event.
pub struct CapabilitySourceEventRef(
    /// Stable source-owned event identity without event body material.
    pub CapabilitySafeText,
);

/// Public inbound event envelope;payload must not repeat envelope metadata.
pub struct CapabilityInboundEventEnvelope<T> {
    /// Trusted integration or system actor for this source boundary.
    pub source_actor_context: ActorContext,
    /// Closed consumer operation selected by the worker route.
    pub consumer_name: CapabilityInboundConsumerName,
    /// Upstream source family consistent with the consumer.
    pub source_family: CapabilityInboundSourceFamily,
    /// Stable body-free upstream event identity.
    pub source_event_ref: CapabilitySourceEventRef,
    /// Version of the concrete payload schema.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Source-provided key included in duplicate consistency validation.
    pub idempotency_key: IdempotencyKey,
    /// Distributed trace propagated from the source envelope.
    pub trace_id: TraceId,
    /// Upstream occurrence time;not authoritative local mutation time.
    pub occurred_at: Timestamp,
    /// Consumer-specific body-free payload.
    pub payload: T,
}

/// Public inbound consumer completion disposition.
pub enum CapabilityInboundReceiptDisposition {
    /// The fresh event produced its declared local body-free effect.
    Accepted,
    /// The original stored receipt was replayed without rerunning effects.
    DuplicateReplayed,
    /// A required reference or external boundary is temporarily unavailable.
    Delayed,
    /// The event is valid but requires no new local canonical revision.
    Ignored,
    /// A stable schema or policy rule rejected the event.
    Rejected,
    /// The declared payload schema version is unsupported.
    UnsupportedSchema,
    /// Safe processing is impossible due to conflict or forbidden material.
    Quarantined,
}

/// Explicit public marker attached to a non-standard inbound receipt path.
pub enum CapabilityInboundReceiptMarker {
    /// The original stored receipt was replayed without rerunning local effects.
    StoredReplay,
    /// The source must use the declared retry boundary before processing can continue.
    RetryRequired,
    /// The fresh event completed without changing a local canonical object.
    NoLocalEffect,
    /// A body or boundary conflict prevented safe payload processing.
    BoundaryQuarantined,
}

/// Body-free follow-up suggested by an accepted inbound reference or feedback event.
pub enum CapabilityInboundFollowUpMarker {
    /// A governance seam must be reviewed through an explicit seam command.
    GovernanceSeamReview(
        /// Local governance-result reference whose state changed.
        GovernanceResultRefId,
    ),
    /// A capability-method relation must be reviewed through an explicit relation command.
    MethodRelationReview(
        /// Local method-asset reference whose state changed.
        MethodAssetRefId,
    ),
    /// A downstream impact fact may require an explicit application-owned review.
    CapabilityImpactReview(
        /// Exact impact fact answered by the accepted feedback.
        CapabilityChangeImpactFactRef,
    ),
    /// A source candidate may enter the explicit capability identity intake workflow.
    CapabilityIdentityIntakeReview(
        /// Local external capability source reference that was accepted or rechecked.
        ExternalCapabilitySourceRefId,
    ),
    /// An audit handoff must be reviewed through the explicit traceability boundary.
    AuditHandoffReview(
        /// Local observability or audit reference whose state changed.
        ObservabilityAuditRefId,
    ),
    /// Descriptor support must be reviewed through an explicit descriptor command.
    DescriptorSupportReview(
        /// Local external document reference whose state changed.
        ExternalDocumentRefId,
    ),
}

/// Public typed receipt for an inbound event operation.
pub struct CapabilityInboundEventReceipt {
    /// Consumer operation that produced this receipt.
    pub consumer_name: CapabilityInboundConsumerName,
    /// Upstream event identity handled by this operation.
    pub source_event_ref: CapabilitySourceEventRef,
    /// Stable stored receipt identity when reserved and completed.
    pub result_ref: Option<CapabilityProtocolResultRef>,
    /// Fresh or replayed completion disposition.
    pub disposition: CapabilityInboundReceiptDisposition,
    /// Explicit replay, retry, no-effect, or quarantine markers for this receipt.
    pub markers: Vec<CapabilityInboundReceiptMarker>,
    /// Local reference subjects whose reference object or canonical state revision changed.
    pub changed_reference_subject_refs: Vec<ReferenceSubjectRef>,
    /// Local canonical reference-state revisions changed by the event.
    pub reference_state_refs: Vec<ReferenceResolutionStateRef>,
    /// Downstream impact summaries appended by the event.
    pub downstream_summary_refs: Vec<DownstreamConsumptionImpactSummaryRef>,
    /// Derived materials marked stale by the accepted event.
    pub affected_material_refs: Vec<DerivedMaterialRef>,
    /// Body-free follow-up markers that never execute a command implicitly.
    pub follow_up_markers: Vec<CapabilityInboundFollowUpMarker>,
    /// Redacted validation, delay, or quarantine issues.
    pub issue_refs: CapabilityProtocolValidationIssueRefSet,
}
```

Envelope / receipt rules:

- `source_actor_context`必须是worker针对declared source family验证的integration/system actor;payload无法覆盖actor、source event、trace、time或idempotency。
- worker将`CapabilitySourceEventRef`单向映射为application-local `CapabilityInboundEventRef`;不得从event name、topic或payload字段拼接fallback。
- unsupported schema在解析typed payload前返回`UnsupportedSchema`;不mark stale、不更新reference state、不append downstream summary。
- `Accepted`的`result_ref`必须`Some`;`DuplicateReplayed`必须返回同一stored result ref和原始effect refs;不得重跑resolver或本地写入。
- `Delayed`与`UnsupportedSchema`固定`result_ref=None`;`Ignored`固定保存可重放no-op receipt并返回`Some`;`Rejected / Quarantined`仅在§9.7定义的safe canonical stable outcome完成reservation时返回`Some`,否则`None`。任何effect ref集合都必须与original operation一致且不得伪造。
- `markers`是closed public classification,不得从error text、transport status、topic或adapter private code拼接。`DuplicateReplayed`必须含`StoredReplay`;`Delayed`必须含`RetryRequired`和`NoLocalEffect`;`Ignored / Rejected / UnsupportedSchema`必须含`NoLocalEffect`;`Quarantined`必须含`BoundaryQuarantined`和`NoLocalEffect`。
- reference consumer的fresh accepted write必须在`changed_reference_subject_refs`列出每个发生ref-object或canonical-state revision的subject;只有实际保存state revision时才列`reference_state_refs`。首次注册必须两组均含同一subject/state;ref字段单独变化可只列subject;完全无变化返回`Ignored`且两组均为空。downstream feedback consumer不得伪造reference effect。
- `follow_up_markers`只形成可见的body-free后续提示,不得被worker解释为自动Command、local queue、governance approval、method lifecycle mutation、identity creation、audit handoff成功或descriptor support已成立。reference-only consumer不得直接修改seam / method relation / identity / trace / descriptor truth。
- receipt ref集合由application consumer result直接返回;worker不得查repository、adapter或local counter补齐。

### 6.7 Outbound logical event envelope

```rust
/// Public exact source used to form one outbound event candidate.
pub enum CapabilityOutboundEventSourceRef {
    /// Append-only capability access change record.
    Change(
        /// Exact committed change-record reference.
        CapabilityChangeRecordRef,
    ),
    /// Exact traceability record revision.
    Traceability(
        /// Exact committed traceability revision reference.
        CapabilityAccessTraceabilityRecordRef,
    ),
    /// Exact capability impact fact revision.
    Impact(
        /// Exact committed impact-fact revision reference.
        CapabilityChangeImpactFactRef,
    ),
    /// Exact derived material revision.
    DerivedMaterial {
        /// Stable derived-material identity.
        material_ref: DerivedMaterialRef,
        /// Exact accepted material version.
        version: Version,
    },
    /// Exact canonical reference-resolution revision.
    ReferenceResolution(
        /// Exact committed reference-resolution revision.
        ReferenceResolutionStateRef,
    ),
}

/// Topic-neutral routing key for one outbound event family.
pub struct CapabilityOutboundRoutingKey(
    /// Validated logical routing key independent of physical transport.
    pub CapabilitySafeText,
);

/// Schema-versioned logical outbound event candidate.
pub struct CapabilityOutboundEventEnvelope<T> {
    /// Closed logical event name.
    pub event_name: CapabilityOutboundEventName,
    /// Version of the event payload schema.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Immutable committed source of this candidate.
    pub source_ref: CapabilityOutboundEventSourceRef,
    /// Accepted source-revision time copied before the source transaction commits.
    pub occurred_at: Timestamp,
    /// Distributed trace copied from the committed operation or source.
    pub trace_id: TraceId,
    /// Topic-neutral routing key mapped from the closed event name.
    pub routing_key: CapabilityOutboundRoutingKey,
    /// Event-specific body-free payload.
    pub payload: T,
}
```

Outbound rules:

- `(event_name,schema_version,source_ref)`是public event identity输入;application technical durability另由Step 6 `CapabilityEventPayloadSnapshotId` / `CapabilityEventCaptureId`标识,二者不进入public envelope。
- envelope必须在source-owning service持有的local UoW内从本次accepted exact source形成。`occurred_at`复制change record `recorded_at`、versioned material `refreshed_at / generated_at`、impact `updated_at`或reference `last_checked_at`,不得使用post-commit adapter delivery time。
- mapper将typed public envelope完整序列化,形成closed `CapabilityEventSchemaRef`、candidate digest、immutable snapshot和initial capture;source write、snapshot、capture任一失败均rollback同一local UoW。
- source UoW commit后,collaboration facade只能由`CapabilityEventCaptureRepository::get_with_snapshot`或`list(AwaitingIntent)`加载official bytes并构造transient candidate;application、worker与adapter均不得回查current truth、重新运行mapper或替换schema / digest / trace。
- `routing_key`是logical key,不是physical topic / stream / exchange;Step 14 / `04`完成binding。
- collaboration outcome / intent ref不写入stored Command result,因为该external side effect发生在local commit之后且不能回滚truth。stable intent由独立短local UoW绑定到capture;bind失败保留`Captured`可扫描状态,repair / delivery status通过Step 7 capture repository、collaboration port和§11 Job report读取。
- 当前10个event不使用`Traceability` source variant;该variant只保留Step 6 source union完整性,不得据此私增第11个Traceability outbound event。

### 6.8 Operations job metadata / report

```rust
/// Public metadata for one operations job invocation.
pub struct CapabilityJobMetadata {
    /// Closed job operation name.
    pub job_name: CapabilityJobName,
    /// Version of the concrete operations-job request and report schema.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Core run identity supplied by the runner.
    pub run_id: JobRunId,
    /// Core idempotency key for this declared job scope.
    pub idempotency_key: IdempotencyKey,
    /// Trusted system or operator actor.
    pub actor_context: ActorContext,
    /// Distributed trace supplied by the runner.
    pub trace_id: TraceId,
}

impl CapabilityJobMetadata {
    /// Copies the complete accepted metadata for response-symmetry validation.
    pub fn copy_for_response_validation(&self) -> Self {
        Self {
            job_name: CapabilityJobName(self.job_name.0.copy_validated()),
            schema_version: CapabilityProtocolSchemaVersion(self.schema_version.0),
            run_id: self.run_id.clone(),
            idempotency_key: self.idempotency_key.clone(),
            actor_context: self.actor_context.clone(),
            trace_id: self.trace_id.clone(),
        }
    }
}

/// Public operations job request envelope.
pub struct CapabilityJobRequest<T> {
    /// Runner-owned authority, run, trace, and idempotency metadata.
    pub metadata: CapabilityJobMetadata,
    /// Job-specific typed scope and target input.
    pub body: T,
}

/// Public opaque view of an external collaboration intent reference.
pub struct CapabilityCollaborationIntentRef(
    /// Opaque external collaboration-intent identifier.
    pub CapabilityOpaqueId,
);

/// Public job target without carrying target body.
pub enum CapabilityJobTargetRef {
    /// Core capability access truth subject.
    Truth(
        /// Body-free core truth subject reference.
        CapabilityTraceSubjectRef,
    ),
    /// Exact capability access traceability revision selected by a Job.
    TraceabilityRecord(
        /// Exact traceability revision used by audit export or reconciliation.
        CapabilityAccessTraceabilityRecordRef,
    ),
    /// Controlled-view target identified before a material id necessarily exists.
    ControlledView {
        /// Exact formal exposure revision selected for the view.
        exposure_ref: FormalExposureBoundaryRef,
        /// Registered consumer boundary selected for the view.
        consumer_ref: CapabilityConsumerRef,
    },
    /// Ecosystem discovery target identified before a material id necessarily exists.
    EcosystemDiscovery {
        /// Exact formal exposure revision selected for discovery.
        exposure_ref: FormalExposureBoundaryRef,
        /// Body-free ecosystem context selected for discovery.
        ecosystem_context_ref: EcosystemContextRef,
    },
    /// Rebuildable derived material.
    DerivedMaterial(
        /// Derived material selected by the job.
        DerivedMaterialRef,
    ),
    /// Body-free external reference subject.
    Reference(
        /// Canonical external-reference subject.
        ReferenceSubjectRef,
    ),
    /// Durable local outbound event capture selected for recovery.
    EventCapture(
        /// Exact local capture revision selected by the job.
        CapabilityEventCaptureRef,
    ),
    /// External event-collaboration intent.
    CollaborationIntent(
        /// External collaboration intent selected for inspection or repair.
        CapabilityCollaborationIntentRef,
    ),
}

/// Redacted failed or skipped job target.
pub struct CapabilityJobTargetIssue {
    /// Target that was not completed.
    pub target_ref: CapabilityJobTargetRef,
    /// Body-free diagnostic issue reference.
    pub issue_ref: CapabilityProtocolValidationIssueRef,
}

/// Public collaboration status returned by the repair job.
pub struct CapabilityCollaborationStatusView {
    /// External collaboration intent.
    pub intent_ref: CapabilityCollaborationIntentRef,
    /// Body-free current collaboration status.
    pub status: EventCollaborationStatus,
    /// Redacted issue for failed or unavailable status.
    pub issue_ref: Option<CapabilityProtocolValidationIssueRef>,
}

/// Public operations job completion disposition.
pub enum CapabilityJobProtocolDisposition {
    /// The fresh declared scope completed.
    Completed,
    /// A fresh run completed only part of its declared scope.
    PartiallyCompleted,
    /// A fresh run failed without repairing core truth by shortcut.
    Failed,
    /// A fresh run returned an explicit retryable report.
    Retryable,
    /// The original stored report was replayed without rerunning the job.
    DuplicateReplayed,
    /// The request was rejected before the job body ran.
    Rejected,
}

/// Public body-free report assembled by one concrete application job service.
pub struct CapabilityJobReport<T> {
    /// Stable stored report identity for fresh run or replay.
    pub result_ref: CapabilityProtocolResultRef,
    /// Append-only reconciliation reports created by this run.
    pub reconciliation_report_refs: Vec<CapabilityReconciliationReportRef>,
    /// Derived materials created, rebuilt, or refreshed by this run.
    pub changed_material_refs: Vec<DerivedMaterialRef>,
    /// Canonical reference-state revisions changed by this run.
    pub changed_reference_state_refs: Vec<ReferenceResolutionStateRef>,
    /// External collaboration outcomes inspected or repaired by this run.
    pub collaboration_statuses: Vec<CapabilityCollaborationStatusView>,
    /// Declared targets that failed.
    pub failed_targets: Vec<CapabilityJobTargetIssue>,
    /// Declared targets skipped by a stable no-op or boundary rule.
    pub skipped_targets: Vec<CapabilityJobTargetIssue>,
    /// Job-specific typed result detail matching the closed job name.
    pub detail: T,
}

/// Public operations job response with one job-specific typed report detail.
pub struct CapabilityJobResponse<T> {
    /// Closed job operation name.
    pub job_name: CapabilityJobName,
    /// Version of the concrete stored response and typed report-detail schema.
    pub schema_version: CapabilityProtocolSchemaVersion,
    /// Core run identity from the request metadata.
    pub run_id: JobRunId,
    /// Fresh, replayed, or rejected disposition.
    pub disposition: CapabilityJobProtocolDisposition,
    /// Stored typed report for completed write-channel outcomes.
    pub report: Option<CapabilityJobReport<T>>,
    /// Redacted request or run-level issues.
    pub issue_refs: CapabilityProtocolValidationIssueRefSet,
}
```

Job rules:

- 本文只定义`JobRunId`字段,不声称任何真实run id存在。runner必须提供validated run id;它不得替代business id、result id、trace id或reconciliation report id。
- `schema_version`当前对8个Job均固定为`1`;runner必须在body解析前完成job name / schema / concrete `T`三者对称校验。unknown / zero version返回`Rejected`,不得运行job body或reserve completed result。
- response `schema_version`必须原样复制accepted request version,并进入serialized stored surface。duplicate replay通过Step 7 typed envelope验证stored union variant + job name + schema version + run id对称,再直接取得variant-bound concrete response;不得由entry / adapter选择decoder或仅凭当前binary默认版本猜schema。
- all eight jobs require idempotency;fresh completion / partial / failed / retryable report必须通过Step 7 `StoredCapabilityResultRepository::save_job_report`保存`JobReport` shell、serialized surface和variant-bound typed envelope,duplicate通过`get_job_report`读取同一result ref和report明细。
- `Rejected`且body未运行时`report=None`;其他completed stored outcomes要求`report=Some`。missing stored report是consistency failure,不得rerun job修复。
- `CapabilityJobReport<T>.detail`必须与`job_name`唯一对应;generic refs与typed detail中的ref / state必须完全对称。duplicate从`CapabilityStoredJobResponse`的matching variant恢复原typed detail,不得返回另一个Job的detail、解码generic bytes或从current state重建。
- report的changed / failed / skipped / collaboration明细全部来自application job result;`jobs` entry不得直接scan repository、读取adapter、解析error text或聚合private counter。
- Job只能维护derived material、reference state、reconciliation report、audit-friendly summary和external collaboration intent;不得创建 / 更正identity、registry、descriptor、seam、method relation或formal exposure truth。

### 6.9 Shared carrier stop review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| metadata authority | pass | Command / Query / Event / Job各有唯一authority;body不重复actor / trace / idempotency |
| public/application dependency | pass | public type只依赖core + contracts shared;application helper均经显式mapper隔离 |
| page / cursor | pass | public cursor与repository cursor分离;scope-bound单向mapping已固定 |
| Query surface | pass | visible / not-visible / degraded + freshness + source version字段闭合,entry不能猜marker |
| stored result | pass after Step 7 `7.R2` reopen | command result / rejection有immutable surface、consumer receipt与8类Job response有typed replay envelope;query excluded |
| receipt / report detail | pass | effect明细必须由application返回,entry不得反查补齐 |
| outbound durability watchpoint | pass after batch `8.5` reopen | Step 6 / 7已闭合immutable snapshot、versioned capture与capture repository;external delivery owner不变,未引入业务outbox / relay产品或第二payload copy |
| forbidden body | pass | shared envelope和diagnostic均限制为typed ref / safe summary / redacted issue ref |

### 6.10 Step 13 canonical operation and request-field bytes

`CapabilityOperationName`的closed mapper只接受本文件26个`CapabilityCommandName`、33个`CapabilityQueryName`、6个`CapabilityInboundConsumerName`和8个`CapabilityJobName` exact value。它不得从HTTP route、logical topic、handler name、Rust type name、trigger、`Debug / Display`或配置别名推导operation。Query只有operation identity,没有合法`CapabilityOperationIdempotencyKey`variant。

Canonical field encoding由`capability-hub-contracts`拥有,因为本crate合法拥有并可读取DTO与nested newtype的private fields。内部`CanonicalFieldWriter`保持private；跨crate只暴露standard`Vec<u8>`。Application在这些field bytes外增加Step 13 versioned frame/domain,执行SHA-256,再构造typed digest；不得注册application-local blanket trait、直接读取private field或使用JSON / serde map order。

Command与Job DTO使用同一个exact method shape:

```rust
impl EstablishCapabilityAccessContextCommand {
    /// Encodes this exact command body's stable fields for request-digest framing.
    pub fn canonical_request_field_bytes(
        &self,
    ) -> Result<Vec<u8>, ContractValueError>;
}

impl RunCapabilityRegistryReconciliationJobInput {
    /// Encodes this exact operations-job input's stable fields for request-digest framing.
    pub fn canonical_request_field_bytes(
        &self,
    ) -> Result<Vec<u8>, ContractValueError>;
}
```

Every one ofthefollowing exact types owns that same method name/signature andthe matching English Rustdoc。Its encoded field list/order isStep 13 §§11 / 13 andmust equalthe declaration-owned semantic fields,includingclosed variant tags、optional presence andvalidated vector order:

| family | exact DTO types owning `canonical_request_field_bytes(&self)` |
|---|---|
| Command identity / review / registry | `EstablishCapabilityAccessContextCommand`;`CorrectCapabilityIdentityCommand`;`RetireCapabilityIdentityCommand`;`RecordCapabilityAccessReviewFactCommand`;`RegisterCapabilityInRegistryCommand`;`UpdateRegistryLifecycleStateCommand`;`UpdateRegistryVisibilityBasisCommand`;`RetireCapabilityRegistryEntryCommand` |
| Command descriptor / relation | `EstablishAdapterDescriptorCommand`;`ReplaceAdapterDescriptorCommand`;`RecordDescriptorRiskConstraintSummaryCommand`;`AttachDescriptorSecretReferenceCommand`;`AttachGovernanceSeamRelationCommand`;`ReplaceGovernanceSeamRelationCommand`;`ExpireGovernanceSeamRelationCommand`;`AttachCapabilityMethodRelationCommand`;`RemoveCapabilityMethodRelationCommand` |
| Command exposure / trace / reference | `EstablishFormalExposureBoundaryCommand`;`UpdateFormalVisibilityApplicabilityCommand`;`SuspendFormalExposureBoundaryCommand`;`RetireFormalExposureBoundaryCommand`;`RecordCapabilityChangeImpactFactCommand`;`RecordTraceabilityHandoffSummaryCommand`;`RecordReferenceResolutionStateCommand`;`RegisterExternalDocumentReferenceCommand`;`RegisterCapabilityConsumerReferenceCommand` |
| Operations Job | `RunCapabilityRegistryReconciliationJobInput`;`RefreshControlledConsumerViewJobInput`;`RebuildDirectorySearchBrowseProjectionJobInput`;`PrepareAuditFriendlyExportSummaryJobInput`;`RebuildReadOnlyEcosystemDiscoverySummaryJobInput`;`RunDerivedMaterialReconciliationJobInput`;`RefreshExternalReferenceResolutionJobInput`;`RepairCapabilityAccessEventCollaborationJobInput` |

Inbound payload methods additionally receive the validated envelope authority thatStep 13 requires in thedigest:

```rust
impl ConsumeGovernanceResultReferenceChangedPayload {
    /// Encodes this exact inbound request's source authority and payload fields.
    pub fn canonical_request_field_bytes(
        &self,
        schema_version: &CapabilityProtocolSchemaVersion,
        source_family: &CapabilityInboundSourceFamily,
        source_event_ref: &CapabilitySourceEventRef,
        source_idempotency_key: &IdempotencyKey,
    ) -> Result<Vec<u8>, ContractValueError>;
}
```

The same exact signature andEnglish Rustdoc apply to`ConsumeMethodAssetReferenceChangedPayload`、`ConsumeDownstreamConsumptionImpactReportedPayload`、`ConsumeExternalCapabilitySourceReferenceChangedPayload`、`ConsumeAuditMaterialReferenceChangedPayload`and`ConsumeExternalDocumentReferenceChangedPayload`。Every implementation writes`schema_version,source_family,source_event_ref,source_idempotency_key`first,thenitsStep 13 §12 payload fields。It excludes actor、trace、`occurred_at`、topic/offset/attempt、local feedback ref、Clock、generated ids、resolver result andcurrent local state。

The historical `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` diagnosis remains recorded because L0-core formal design does not declare the accessor。Under the 2026-07-18 explicit user authorization,the Inbound methods call `source_idempotency_key.as_str().as_bytes()` and consume the returned string's original UTF-8 bytes without trim、case folding or normalization。Transport serialization、`Display / Debug` and local replacement key types remain forbidden substitutes；formal L0-core design sync is a non-blocking debt and a signature / byte-semantics change reopens Step 13。

## 7. Command Protocol

Command是唯一同步改写本仓truth / relation / reference state或append-only trace / impact的public协议族。所有入口统一接收`CapabilityCommandRequest<T>`,通过`CapabilityOperationContext::from_command`进入application,并返回`Result<CapabilityCommandOutcome<R>, ApplicationError>`。Command body不接收caller-supplied expected version、object id、change-record id、trace id或timestamp。

### 7.1 Command secondary input contract

```rust
/// Existing or newly registered external capability source input.
pub enum CapabilityExternalSourceSelection {
    /// Reuse one locally registered body-free source reference.
    Existing {
        /// Existing locally registered external capability source reference.
        source_ref_id: ExternalCapabilitySourceRefId,
    },
    /// Resolve and register a new body-free source reference.
    Register {
        /// Declared external source family.
        source_kind: ExternalCapabilitySourceKind,
        /// Body-free locator summary used by the source resolver.
        external_locator: ExternalLocatorSummary,
    },
}

/// Body-free identity intake context carried by the establishment command.
pub struct CapabilityAccessIntakeContextDto {
    /// Candidate capability identity key.
    pub identity_key: CapabilityIdentityKey,
    /// Access-review context recorded independently from governance approval.
    pub review_context: AccessReviewContext,
    /// Body-free intake risk summary.
    pub risk_summary: AccessRiskSummary,
    /// Actor-provided reason for establishing the access context.
    pub change_reason: ChangeReason,
}

/// Correction-only classification;it cannot represent create or retirement.
pub enum CapabilityIdentityCorrectionKind {
    /// Correct the key or declared identity attributes in place.
    Corrected,
    /// Merge this identity into one canonical identity relation.
    Merged,
    /// Split this identity into explicitly related identities.
    Split,
}

/// Existing or newly registered governance result input.
pub enum GovernanceResultSelection {
    /// Reuse one locally registered governance-result reference.
    Existing {
        /// Existing locally registered governance-result reference.
        governance_result_ref_id: GovernanceResultRefId,
    },
    /// Resolve and register one body-free governance-result reference.
    Register {
        /// Declared kind of governance result reference.
        governance_ref_kind: GovernanceRefKind,
        /// Body-free governance-owned source reference.
        governance_source: GovernanceSourceRef,
        /// Safe scope summary without approval or policy body.
        result_scope_summary: GovernanceResultScopeSummary,
    },
}

/// Existing or newly registered method-library asset input.
pub enum MethodAssetSelection {
    /// Reuse one locally registered method-asset reference.
    Existing {
        /// Existing locally registered method-asset reference.
        method_asset_ref_id: MethodAssetRefId,
    },
    /// Resolve and register one body-free method-library asset reference.
    Register {
        /// Body-free method asset classification.
        method_asset_kind: MethodAssetKindSummary,
        /// Method-library-owned locator without method body.
        method_library_locator: MethodLibraryLocator,
    },
}

/// Explicit public visibility update intent.
pub enum FormalVisibilityUpdateIntent {
    /// Reevaluate from current exposure truth and a body-free basis.
    Reevaluate {
        /// Ordered typed consumer scope in which formal visibility is reevaluated.
        applicability_scope: FormalApplicabilityScope,
        /// Body-free basis supplied to the visibility policy.
        basis_summary: FormalVisibilityBasisSummary,
    },
    /// Preserve a visible pending surface while prerequisites are incomplete.
    MarkPending {
        /// Stable reason why applicability remains pending.
        pending_reason: FormalVisibilityPendingReason,
    },
}

/// Public audit handoff scope mapped to the application-local handoff scope.
pub struct CapabilityAuditHandoffScopeInput(
    /// Validated body-free audit handoff scope.
    pub CapabilitySafeText,
);

/// Explicit canonical reference-resolution mutation intent.
pub enum ReferenceResolutionIntent {
    /// Transition an existing canonical reference state.
    Transition {
        /// Requested target resolution value subject to the transition matrix.
        target: ReferenceResolutionValue,
        /// Stable reason for the resolution transition.
        reason: ReferenceResolutionReason,
    },
    /// Record that resolving the reference would cross a forbidden-body boundary.
    MarkForbidden {
        /// Stable redacted reason for the forbidden-body decision.
        reason: ForbiddenBodyReason,
    },
}

/// Runtime/tools or SDK server-consumer registration input.
pub enum CapabilityConsumerRegistrationInput {
    /// Register a runtime or tools consumer reference without execution authority.
    RuntimeTools {
        /// Runtime or tools consumer classification.
        consumer_kind: RuntimeToolsConsumerKind,
        /// Body-free runtime or tools consumer locator.
        consumer_locator: RuntimeToolsConsumerLocator,
        /// Declared capability-consumption scope.
        consumer_scope: CapabilityConsumerScope,
    },
    /// Register an SDK exposure consumer reference without publication status.
    Sdk {
        /// Body-free SDK consumer locator.
        sdk_consumer_locator: SdkConsumerLocator,
        /// Safe SDK surface summary.
        sdk_surface_summary: SdkSurfaceSummary,
        /// Declared SDK exposure scope.
        exposure_scope: SdkExposureScope,
    },
}

/// Public union returned after registering a consumer reference.
pub enum CapabilityRegisteredConsumerRef {
    /// Registered runtime or tools consumer.
    RuntimeTools(
        /// Locally registered runtime or tools consumer reference.
        RuntimeToolsConsumerRefId,
    ),
    /// Registered SDK exposure consumer.
    Sdk(
        /// Locally registered SDK exposure consumer reference.
        SdkExposureConsumerRefId,
    ),
}
```

secondary input rules:

- every `Register` variant is body-free;application derives `ReferenceCandidateDigest` and `SensitiveBoundaryMarker`,invokes the matching Step 7 resolver,then creates the local ref + canonical state。caller cannot submit a precomputed local candidate digest or resolution result。
- every `Existing` variant loads the exact current local ref and canonical state;missing / kind mismatch is stable rejection,not implicit registration。
- `CapabilityIdentityCorrectionKind` maps 1:1 to domain `Corrected / Merged / Split`;no generic string or broad change-kind variant can reach the correction flow。
- `FormalVisibilityUpdateIntent::Reevaluate` lets `FormalExposurePolicy` derive the target state;caller cannot force `Visible`。`MarkPending` cannot be used to retire or activate exposure。
- `CapabilityConsumerRegistrationInput` is the only selector for the shared consumer-registration route;entry must not infer variant from locator text、route suffix or field presence。

### 7.2 Identity / review Command DTO schema

```rust
/// Command body for establishing the source, identity, and initial access-review context.
pub struct EstablishCapabilityAccessContextCommand {
    /// Existing or newly registered external capability source.
    pub source: CapabilityExternalSourceSelection,
    /// Body-free identity and review intake context.
    pub intake: CapabilityAccessIntakeContextDto,
}

/// Accepted result of establishing a capability access context.
pub struct EstablishCapabilityAccessContextResult {
    /// Locally registered external source reference used by the identity.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Canonical resolution-state revision for the external source.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Newly established capability identity reference.
    pub identity_ref: CapabilityIdentityRef,
    /// Actual persisted identity state.
    pub identity_state: CapabilityIdentityState,
    /// Initial access-review fact recorded separately from governance approval.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
}

/// Command body for correcting, merging, or splitting an existing identity.
pub struct CorrectCapabilityIdentityCommand {
    /// Existing capability identity to correct.
    pub identity_ref: CapabilityIdentityRef,
    /// Closed correction-only operation kind.
    pub correction_kind: CapabilityIdentityCorrectionKind,
    /// Corrected identity key validated by the identity policy.
    pub new_identity_key: CapabilityIdentityKey,
    /// Explicit identities participating in a merge or split relation.
    pub related_identity_refs: Vec<CapabilityIdentityRef>,
    /// Stable actor-provided reason for the correction.
    pub correction_reason: IdentityCorrectionReason,
}

/// Accepted result of correcting a capability identity.
pub struct CorrectCapabilityIdentityResult {
    /// Corrected capability identity reference.
    pub identity_ref: CapabilityIdentityRef,
    /// Identity state before the accepted correction.
    pub previous_state: CapabilityIdentityState,
    /// Identity state after the accepted correction.
    pub current_state: CapabilityIdentityState,
    /// Exact committed identity change classification.
    pub change_kind: CapabilityIdentityChangeKind,
    /// Validated related identities committed with the correction.
    pub related_identity_refs: Vec<CapabilityIdentityRef>,
}

/// Command body for retiring an existing capability identity.
pub struct RetireCapabilityIdentityCommand {
    /// Existing capability identity to retire.
    pub identity_ref: CapabilityIdentityRef,
    /// Stable actor-provided retirement reason.
    pub retirement_reason: IdentityChangeReason,
}

/// Accepted result of retiring a capability identity.
pub struct RetireCapabilityIdentityResult {
    /// Retired capability identity reference.
    pub identity_ref: CapabilityIdentityRef,
    /// Identity state before retirement.
    pub previous_state: CapabilityIdentityState,
    /// Terminal identity state committed by retirement.
    pub current_state: CapabilityIdentityState,
}

/// Command body for appending an access-review fact without governance approval.
pub struct RecordCapabilityAccessReviewFactCommand {
    /// Capability identity reviewed by the fact.
    pub identity_ref: CapabilityIdentityRef,
    /// Body-free context in which the access review occurred.
    pub review_context: AccessReviewContext,
    /// Safe risk summary recorded by this review fact.
    pub risk_summary: AccessRiskSummary,
}

/// Accepted result of recording a capability access-review fact.
pub struct RecordCapabilityAccessReviewFactResult {
    /// Capability identity associated with the review fact.
    pub identity_ref: CapabilityIdentityRef,
    /// Newly appended access-review fact reference.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Actual persisted review-fact state.
    pub review_state: CapabilityAccessReviewFactState,
    /// Explicit marker preventing the review fact from acting as approval.
    pub separation_marker: AccessGovernanceSeparationMarker,
}
```

### 7.3 Registry Command DTO schema

```rust
/// Command body for registering an established identity in the capability registry.
pub struct RegisterCapabilityInRegistryCommand {
    /// Established capability identity to register.
    pub identity_ref: CapabilityIdentityRef,
    /// Body-free basis used by registry visibility policy.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Scope and audience context for registry visibility.
    pub visibility_context: VisibilityContext,
    /// Stable actor-provided registry lifecycle reason.
    pub registration_reason: RegistryLifecycleReason,
}

/// Accepted result of registering a capability identity in the registry.
pub struct RegisterCapabilityInRegistryResult {
    /// Newly created registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Actual persisted registry lifecycle state.
    pub lifecycle_state: RegistryLifecycleState,
    /// Visibility basis committed with the registry entry.
    pub visibility_basis: RegistryVisibilityBasis,
}

/// Command body for applying an allowed lifecycle transition to a registry entry.
pub struct UpdateRegistryLifecycleStateCommand {
    /// Existing registry entry to transition.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Requested target state subject to the lifecycle transition policy.
    pub target_state: RegistryLifecycleState,
    /// Stable actor-provided reason for the transition.
    pub lifecycle_reason: RegistryLifecycleReason,
}

/// Accepted result of updating a registry entry lifecycle state.
pub struct UpdateRegistryLifecycleStateResult {
    /// Updated registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Registry lifecycle state before the transition.
    pub previous_state: RegistryLifecycleState,
    /// Registry lifecycle state after the transition.
    pub current_state: RegistryLifecycleState,
}

/// Command body for replacing the body-free visibility basis of a registry entry.
pub struct UpdateRegistryVisibilityBasisCommand {
    /// Existing registry entry whose visibility basis changes.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Replacement body-free visibility basis.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Replacement scope and audience context.
    pub visibility_context: VisibilityContext,
    /// Stable actor-provided reason for changing the visibility basis.
    pub change_reason: RegistryLifecycleReason,
}

/// Accepted result of updating a registry visibility basis.
pub struct UpdateRegistryVisibilityBasisResult {
    /// Updated registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Actual lifecycle state retained after the update.
    pub lifecycle_state: RegistryLifecycleState,
    /// Visibility basis committed by the update.
    pub visibility_basis: RegistryVisibilityBasis,
}

/// Command body for terminally retiring a capability registry entry.
pub struct RetireCapabilityRegistryEntryCommand {
    /// Existing registry entry to retire.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Stable actor-provided retirement reason.
    pub retirement_reason: RegistryRetirementReason,
}

/// Accepted result of retiring a capability registry entry.
pub struct RetireCapabilityRegistryEntryResult {
    /// Retired registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Registry lifecycle state before retirement.
    pub previous_state: RegistryLifecycleState,
    /// Terminal registry lifecycle state after retirement.
    pub current_state: RegistryLifecycleState,
}
```

### 7.4 Descriptor / safe-summary Command DTO schema

```rust
/// Command body for establishing a body-free adapter descriptor boundary.
pub struct EstablishAdapterDescriptorCommand {
    /// Capability identity represented by the descriptor.
    pub identity_ref: CapabilityIdentityRef,
    /// Registry entry bound to the same capability chain.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// External capability source represented by the descriptor.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Closed adapter descriptor classification.
    pub descriptor_kind: AdapterDescriptorKind,
    /// Body-free summary of the connection boundary.
    pub connection_boundary_summary: ConnectionBoundarySummary,
    /// Optional supporting document reference without document body.
    pub supporting_document_ref_id: Option<ExternalDocumentRefId>,
    /// Stable actor-provided reason for establishing the descriptor.
    pub change_reason: DescriptorChangeReason,
}

/// Accepted result of establishing an adapter descriptor.
pub struct EstablishAdapterDescriptorResult {
    /// Newly established adapter descriptor reference.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Actual persisted descriptor state.
    pub descriptor_state: AdapterDescriptorState,
    /// Registry entry evaluated and optionally bound by this transaction.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Actual registry lifecycle state after descriptor handling.
    pub registry_lifecycle_state: RegistryLifecycleState,
    /// Supporting document reference accepted by the descriptor policy.
    pub supporting_document_ref_id: Option<ExternalDocumentRefId>,
}

/// Command body for replacing an adapter descriptor with a new immutable identity.
pub struct ReplaceAdapterDescriptorCommand {
    /// Existing adapter descriptor to replace.
    pub current_descriptor_ref: AdapterDescriptorRef,
    /// Exact registry entry that owns the current and replacement descriptors.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// External capability source for the replacement descriptor.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Closed replacement descriptor classification.
    pub descriptor_kind: AdapterDescriptorKind,
    /// Replacement body-free connection boundary summary.
    pub connection_boundary_summary: ConnectionBoundarySummary,
    /// Optional supporting document reference for the replacement.
    pub supporting_document_ref_id: Option<ExternalDocumentRefId>,
    /// Stable actor-provided reason for replacement.
    pub replacement_reason: DescriptorChangeReason,
}

/// Accepted result of replacing an adapter descriptor.
pub struct ReplaceAdapterDescriptorResult {
    /// Descriptor reference placed into the replaced state.
    pub replaced_descriptor_ref: AdapterDescriptorRef,
    /// Newly created replacement descriptor reference.
    pub replacement_descriptor_ref: AdapterDescriptorRef,
    /// Actual terminal state of the replaced descriptor.
    pub replaced_state: AdapterDescriptorState,
    /// Actual initial state of the replacement descriptor.
    pub replacement_state: AdapterDescriptorState,
    /// Registry entry rebound to the accepted replacement descriptor.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Actual registry lifecycle state after replacement.
    pub registry_lifecycle_state: RegistryLifecycleState,
}

/// Command body for recording a safe descriptor risk and constraint summary.
pub struct RecordDescriptorRiskConstraintSummaryCommand {
    /// Existing descriptor evaluated by the summary.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Access-review fact used only as a review input.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Closed descriptor risk level.
    pub risk_level: DescriptorRiskLevel,
    /// Body-free capability constraint summary.
    pub constraint_summary: CapabilityConstraintSummary,
    /// Stable actor-provided reason for recording the summary.
    pub change_reason: DescriptorChangeReason,
}

/// Accepted result of recording a descriptor risk and constraint summary.
pub struct RecordDescriptorRiskConstraintSummaryResult {
    /// Descriptor associated with the safe summary.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Newly generated descriptor risk-summary identity.
    pub summary_id: DescriptorRiskConstraintSummaryId,
    /// Actual persisted risk-summary state.
    pub summary_state: DescriptorRiskConstraintSummaryState,
    /// Derived marker proving sensitive bodies remain outside this boundary.
    pub sensitive_boundary_marker: SensitiveBoundaryMarker,
}

/// Command body for attaching a body-free secret-provider reference to a descriptor.
pub struct AttachDescriptorSecretReferenceCommand {
    /// Existing descriptor that requires the secret reference.
    pub descriptor_ref: AdapterDescriptorRef,
    /// External secret-provider-owned reference without secret value.
    pub secret_provider_ref: ExternalSecretProviderRef,
    /// Safe summary of the intended secret usage scope.
    pub secret_usage_scope: SecretUsageScopeSummary,
    /// Safe summary of the secret handling boundary.
    pub handling_boundary: SecretHandlingBoundarySummary,
    /// Stable actor-provided reason for attaching the reference.
    pub change_reason: DescriptorChangeReason,
}

/// Accepted result of attaching a descriptor secret reference.
pub struct AttachDescriptorSecretReferenceResult {
    /// Descriptor associated with the secret reference.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Newly registered local secret reference identity.
    pub secret_ref_id: SecretRefId,
    /// Canonical resolution-state revision for the secret reference.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Newly generated safe handling-summary identity.
    pub safe_summary_id: SecretHandlingSafeSummaryId,
    /// Actual persisted safe handling-summary state.
    pub safe_summary_state: SecretHandlingSafeSummaryState,
    /// Derived marker proving no secret body enters exposure surfaces.
    pub exposure_safety_marker: ExposureSafetyMarker,
}
```

Descriptor construction rules:

- identity / registry / source refs必须属于同一capability chain;application分别load,不得仅信任caller组合。
- supporting document只用于验证body-free support relation,不是`AdapterDescriptor`字段正文;missing / unresolved / forbidden按descriptor policy形成rejection或unresolved,不读取document body。
- risk `SensitiveBoundaryMarker`由forbidden-body scanner / policy派生,caller不能提交或覆盖;result仅返回派生marker。
- secret command调用`SecretReferencePort`,以resolver observation构造`SecretRef + ReferenceResolutionState + SecretHandlingSafeSummary`;任何secret value / token / ciphertext使请求`BodyForbidden`且正文不落存储。
- secret command在descriptor关联`SecretRef`后,除`attach_secret_ref(...)`返回的`SecretReferenceChanged`记录外,还必须使用同一command reason / actor / trace / time直接调用`DescriptorChangeRecord::append(...)`追加`SafeSummaryChanged`记录;两条record在同一UoW、同一descriptor trace subject下按change-record id稳定排序,不得用一条泛化记录吞掉任一事实。
- replacement命令显式携带exact `registry_entry_ref`;application必须验证loaded current descriptor的`registry_entry_id`与entry ref一致。命令生成new descriptor id;current descriptor loaded expected version是old save唯一version source,new descriptor create使用`None`。
- replacement只有在new descriptor达到`Accepted`且optional supporting document已通过bind / rebind校验后才可把current置为`Replaced`并调用registry `bind_descriptor(...)`;replacement source / document为unresolved、invalid、forbidden或owner mismatch时稳定拒绝且current / registry均不变。

### 7.5 Governance / method relation Command DTO schema

```rust
/// Command body for attaching a governance-owned result through the approval seam.
pub struct AttachGovernanceSeamRelationCommand {
    /// Capability identity governed by the seam relation.
    pub identity_ref: CapabilityIdentityRef,
    /// Registry entry in the same capability ownership chain.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Access-review fact used only for separation-of-duties validation.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Existing or newly registered governance-result reference.
    pub governance_result: GovernanceResultSelection,
    /// Stable actor-provided reason for attaching the relation.
    pub change_reason: ChangeReason,
}

/// Accepted result of attaching a governance seam relation.
pub struct AttachGovernanceSeamRelationResult {
    /// Locally registered governance-result reference.
    pub governance_result_ref_id: GovernanceResultRefId,
    /// Canonical resolution-state revision for the governance result.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Newly established governance seam relation reference.
    pub seam_relation_ref: GovernanceSeamRelationRef,
    /// Actual persisted governance seam state.
    pub seam_state: GovernanceSeamState,
}

/// Command body for replacing a governance seam relation with a new relation.
pub struct ReplaceGovernanceSeamRelationCommand {
    /// Existing governance seam relation to replace.
    pub current_seam_ref: GovernanceSeamRelationRef,
    /// Existing or newly registered replacement governance result.
    pub replacement_governance_result: GovernanceResultSelection,
    /// Stable actor-provided reason for replacement.
    pub replacement_reason: ChangeReason,
}

/// Accepted result of replacing a governance seam relation.
pub struct ReplaceGovernanceSeamRelationResult {
    /// Governance seam relation placed into the replaced state.
    pub replaced_seam_ref: GovernanceSeamRelationRef,
    /// Newly created replacement seam relation.
    pub replacement_seam_ref: GovernanceSeamRelationRef,
    /// Governance-result reference bound to the replacement relation.
    pub governance_result_ref_id: GovernanceResultRefId,
    /// Actual persisted state of the replacement relation.
    pub replacement_state: GovernanceSeamState,
}

/// Command body for expiring an existing governance seam relation.
pub struct ExpireGovernanceSeamRelationCommand {
    /// Existing governance seam relation to expire.
    pub seam_relation_ref: GovernanceSeamRelationRef,
    /// Stable actor-provided expiry reason.
    pub expiry_reason: ChangeReason,
}

/// Accepted result of expiring a governance seam relation.
pub struct ExpireGovernanceSeamRelationResult {
    /// Expired governance seam relation reference.
    pub seam_relation_ref: GovernanceSeamRelationRef,
    /// Governance seam state before expiry.
    pub previous_state: GovernanceSeamState,
    /// Terminal governance seam state after expiry.
    pub current_state: GovernanceSeamState,
}

/// Command body for attaching a method-library asset relation to a capability.
pub struct AttachCapabilityMethodRelationCommand {
    /// Capability identity associated with the method relation.
    pub identity_ref: CapabilityIdentityRef,
    /// Existing or newly registered method-library asset reference.
    pub method_asset: MethodAssetSelection,
    /// Body-free scope of the capability-to-method relation.
    pub relation_scope: CapabilityMethodRelationScope,
    /// Stable actor-provided reason for attaching the relation.
    pub change_reason: MethodRelationChangeReason,
}

/// Accepted result of attaching a capability method relation.
pub struct AttachCapabilityMethodRelationResult {
    /// Locally registered method-library asset reference.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Canonical resolution-state revision for the method asset.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Newly established capability method relation reference.
    pub method_relation_ref: CapabilityMethodRelationRef,
    /// Actual persisted method relation state.
    pub relation_state: CapabilityMethodRelationState,
}

/// Command body for terminally removing a capability method relation.
pub struct RemoveCapabilityMethodRelationCommand {
    /// Existing capability method relation to remove.
    pub method_relation_ref: CapabilityMethodRelationRef,
    /// Stable actor-provided removal reason.
    pub removal_reason: MethodRelationRemovalReason,
}

/// Accepted result of removing a capability method relation.
pub struct RemoveCapabilityMethodRelationResult {
    /// Removed capability method relation reference.
    pub method_relation_ref: CapabilityMethodRelationRef,
    /// Method relation state before removal.
    pub previous_state: CapabilityMethodRelationState,
    /// Terminal method relation state after removal.
    pub current_state: CapabilityMethodRelationState,
}
```

Relation construction rules:

- governance `Register` branch通过`GovernanceResultReferencePort`获得allowed safe summary;`Existing` branch也必须加载ref并重新执行body-free resolution observation,不得从request接受approval / Policy summary正文。
- `review_fact_ref`只用于加载exact review并检查`Recorded + separates_from_governance()`；不得进入seam endpoint、safe summary或替代governance result。`GovernanceSeamPolicy::reject_access_review_as_approval`是approval-substitution负向guard,正常attach flow不得把其预期boundary error当作命令失败条件。
- replace创建new seam relation并把old relation标为replaced;不能原地替换governance endpoint。
- method `Register` branch调用`MethodAssetReferencePort`;`Existing` branch加载typed ref + canonical state。method body、definition、version body或source code一律`BodyForbidden`。
- removed relation terminal;再次关联必须走Attach并生成new relation id,不得恢复old relation。

### 7.6 Formal exposure Command DTO schema

```rust
/// Command body for establishing the formal capability exposure boundary.
pub struct EstablishFormalExposureBoundaryCommand {
    /// Registry entry participating in the exposure prerequisite chain.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Adapter descriptor participating in the exposure prerequisite chain.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Governance seam relation participating in the prerequisite chain.
    pub governance_seam_ref: GovernanceSeamRelationRef,
    /// Optional method relation required by the declared exposure scope.
    pub method_relation_ref: Option<CapabilityMethodRelationRef>,
    /// Ordered typed consumer scope in which formal visibility is evaluated.
    pub applicability_scope: FormalApplicabilityScope,
    /// Body-free basis supplied to formal exposure policy.
    pub basis_summary: FormalVisibilityBasisSummary,
    /// Stable actor-provided reason for establishing the exposure boundary.
    pub change_reason: ChangeReason,
}

/// Accepted result of establishing a formal exposure boundary.
pub struct EstablishFormalExposureBoundaryResult {
    /// Newly established formal exposure boundary reference.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Actual persisted exposure state after policy evaluation.
    pub exposure_state: FormalExposureState,
    /// Visibility applicability record created with the exposure.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Actual policy-derived formal visibility state.
    pub visibility_state: FormalVisibilityState,
    /// Actual registry lifecycle state derived in the same transaction.
    pub registry_lifecycle_state: RegistryLifecycleState,
}

/// Command body for reevaluating or marking formal visibility applicability pending.
pub struct UpdateFormalVisibilityApplicabilityCommand {
    /// Existing formal exposure boundary to evaluate.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Exact registry entry owned by the exposure boundary.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Closed update intent that cannot force a visible state.
    pub intent: FormalVisibilityUpdateIntent,
    /// Stable actor-provided reason for the applicability update.
    pub change_reason: ChangeReason,
}

/// Accepted result of updating formal visibility applicability.
pub struct UpdateFormalVisibilityApplicabilityResult {
    /// Formal exposure boundary evaluated by the update.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Actual exposure state after policy evaluation.
    pub exposure_state: FormalExposureState,
    /// Updated visibility applicability record identity.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Actual policy-derived formal visibility state.
    pub visibility_state: FormalVisibilityState,
    /// Actual registry lifecycle state derived in the same transaction.
    pub registry_lifecycle_state: RegistryLifecycleState,
}

/// Command body for suspending an active formal exposure boundary.
pub struct SuspendFormalExposureBoundaryCommand {
    /// Existing formal exposure boundary to suspend.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Exact registry entry owned by the exposure boundary.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Stable actor-provided suspension reason.
    pub suspension_reason: ChangeReason,
}

/// Accepted result of suspending a formal exposure boundary.
pub struct SuspendFormalExposureBoundaryResult {
    /// Suspended formal exposure boundary reference.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Exposure state before suspension.
    pub previous_state: FormalExposureState,
    /// Exposure state after suspension.
    pub current_state: FormalExposureState,
    /// Visibility applicability fact made unavailable with the exposure.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Actual unavailable visibility state after suspension.
    pub visibility_state: FormalVisibilityState,
    /// Actual registry lifecycle state after suspension.
    pub registry_lifecycle_state: RegistryLifecycleState,
}

/// Command body for terminally retiring a formal exposure boundary.
pub struct RetireFormalExposureBoundaryCommand {
    /// Existing formal exposure boundary to retire.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Exact registry entry owned by the exposure boundary.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Stable actor-provided retirement reason.
    pub retirement_reason: ExposureRetirementReason,
}

/// Accepted result of retiring a formal exposure boundary.
pub struct RetireFormalExposureBoundaryResult {
    /// Retired formal exposure boundary reference.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Exposure state before retirement.
    pub previous_state: FormalExposureState,
    /// Terminal exposure state after retirement.
    pub current_state: FormalExposureState,
    /// Visibility applicability fact retired with the exposure.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Formal visibility state derived after retirement.
    pub visibility_state: FormalVisibilityState,
    /// Actual registry lifecycle state after exposure retirement.
    pub registry_lifecycle_state: RegistryLifecycleState,
}
```

Exposure construction rules:

- application loads registry / descriptor / seam / optional method exact refs and all required canonical reference states;owner-chain mismatch or non-usable prerequisite cannot be bypassed bybasis text。
- command createsdraft,appliespolicy,derivesvisibility,and only activates whenformal visibility is`Visible`;result returnsactual states,notcaller requested success。
- visible applicability支撑`activate(...)`后,exposure version已经变化；application必须在内存中再次以final exposure调用visibility `reevaluate(...)`,只保存这份final visibility revision,使`source_exposure_version`与最终persisted exposure version严格对称。不得先保存pre-activation visibility再补第二次save。
- `FormalVisibilityUpdateIntent` cannot directly supplytarget enum;policy derives target or marks pending。consumer view、runtime allowlist、SDK cache、search projection、marketplace listing均不能成为basis source。
- establish / update在same UoW同步处理exposure、visibility和registry:visibility=`Visible`且exposure=`Active`时registry目标为`FormalVisible`;其他accepted non-retired surface目标为`VisibilityPending`。只有loaded registry当前状态与目标不同才调用`transition_lifecycle(...)`、save并形成registry record / trace / capture / changed subject；same-state严格no-op。registry command route不能自行形成`FormalVisible`。
- suspend在same UoW执行exposure `suspend(...)`与visibility `mark_unavailable(...)`,registry目标为`VisibilityPending`；retire执行exposure `retire(...)`与visibility `retire(...)`,non-retired registry目标同样为`VisibilityPending`,不得隐式retire registry truth。两者都遵守registry actual-delta-only,不得为same-state生成伪record / trace / capture。
- update / suspend / retire显式携带exact `registry_entry_ref`;application必须验证`exposure.registry_entry_id`与loaded entry一致。不存在current visibility fact或entry mismatch是consistency / stable policy rejection,不得临时补建对象。
- suspend / retire load persisted expected version;caller version ignored / rejected if added by an adapter-specific body。

### 7.7 Trace / impact Command DTO schema

```rust
/// Command body for appending a capability change-impact fact.
pub struct RecordCapabilityChangeImpactFactCommand {
    /// Exact traceability revision that owns the impact subject.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Body-free scope of the identified impact.
    pub impact_scope: CapabilityImpactScope,
    /// Registered consumers affected by the traced change.
    pub affected_consumers: Vec<CapabilityConsumerRef>,
}

/// Accepted result of recording a capability change-impact fact.
pub struct RecordCapabilityChangeImpactFactResult {
    /// Newly appended capability impact-fact reference.
    pub impact_ref: CapabilityChangeImpactFactRef,
    /// Exact traceability revision used as the impact source.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Actual persisted impact state.
    pub impact_state: CapabilityImpactState,
    /// Validated affected consumers in stable duplicate-free order.
    pub affected_consumers: Vec<CapabilityConsumerRef>,
}

/// Command body for appending an audit handoff summary to traceability.
pub struct RecordTraceabilityHandoffSummaryCommand {
    /// Exact traceability revision to extend.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Body-free scope of the requested audit handoff.
    pub handoff_scope: CapabilityAuditHandoffScopeInput,
    /// Optional locally registered observability audit reference.
    pub audit_ref_id: Option<ObservabilityAuditRefId>,
    /// Stable actor-provided reason for the traceability revision.
    pub trace_reason: TraceabilityReason,
}

/// Accepted local result of recording a traceability handoff summary.
pub struct RecordTraceabilityHandoffSummaryResult {
    /// Newly appended traceability revision reference.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Actual persisted traceability state.
    pub traceability_state: TraceabilityState,
    /// Audit reference validated for handoff when present.
    pub audit_ref_id: Option<ObservabilityAuditRefId>,
    /// Whether an external handoff was requested after local commit.
    pub handoff_requested: bool,
}
```

Trace / impact rules:

- affected consumer vector必须non-empty、stable order、deduplicated并全部为registered refs;application转换为`CapabilityConsumerRefSet`。
- impact subject只能来自loaded exact traceability revision,caller不能另传change subject或source change refs。
- handoff command先append local traceability revision;`audit_ref_id=None`只形成explicit pending/partial summary,不得调用port。
- `audit_ref_id=Some`要求registered resolved audit ref;external handoff发生在local commit之后,失败不回滚source truth。Command stored result只记录`handoff_requested`,不声称accepted receipt、evidence alias或验收签署；outcome由trace query / repair surface承接。

### 7.8 Reference-support Command DTO schema

```rust
/// Command body for transitioning an existing canonical reference-resolution state.
pub struct RecordReferenceResolutionStateCommand {
    /// Existing body-free reference subject to transition.
    pub reference_subject: ReferenceSubjectRef,
    /// Declared reference kind required to match the subject variant.
    pub reference_kind: ReferenceKind,
    /// Closed transition or forbidden-body intent.
    pub intent: ReferenceResolutionIntent,
}

/// Accepted result of recording a canonical reference-resolution transition.
pub struct RecordReferenceResolutionStateResult {
    /// Reference subject whose canonical state changed.
    pub reference_subject: ReferenceSubjectRef,
    /// Newly appended canonical resolution-state revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Prior resolution value when one existed.
    pub previous_value: Option<ReferenceResolutionValue>,
    /// Actual current resolution value after the transition.
    pub current_value: ReferenceResolutionValue,
}

/// Command body for registering a body-free external document reference.
pub struct RegisterExternalDocumentReferenceCommand {
    /// Closed external document classification.
    pub document_kind: ExternalDocumentKind,
    /// Body-free external document locator summary.
    pub document_locator: ExternalDocumentLocatorSummary,
    /// Optional descriptor supported by the document reference.
    pub supported_descriptor_ref: Option<AdapterDescriptorRef>,
}

/// Accepted result of registering an external document reference.
pub struct RegisterExternalDocumentReferenceResult {
    /// Newly registered external document reference identity.
    pub external_document_ref_id: ExternalDocumentRefId,
    /// Initial canonical resolution-state revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Resolver-derived initial resolution value.
    pub resolution_value: ReferenceResolutionValue,
}

/// Command body for registering a runtime/tools or SDK consumer reference.
pub struct RegisterCapabilityConsumerReferenceCommand {
    /// Closed consumer-family registration input.
    pub registration: CapabilityConsumerRegistrationInput,
}

/// Accepted result of registering a capability consumer reference.
pub struct RegisterCapabilityConsumerReferenceResult {
    /// Newly registered typed consumer reference.
    pub consumer_ref: CapabilityRegisteredConsumerRef,
    /// Initial canonical resolution-state revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Resolver-derived initial resolution value.
    pub resolution_value: ReferenceResolutionValue,
}
```

Reference construction rules:

- record-state command只接受已registered `ReferenceSubjectRef`;subject / kind variant必须对称,不存在时reject而非创建placeholder。
- `Transition`的exact per-kind allowed state / matrix留Step 10,但`Invalid / Forbidden`当前candidate terminal规则立即适用；`MarkForbidden`不保存命中的body。
- record-state发生actual canonical transition后,必须按exact `ReferenceSubjectRef`使用Step 7 reference-aware index收集实际依赖的controlled view与三类mutable material,typed union后只把non-stale revision在same UoW标记stale、capture并save；reason只能从final `ReferenceResolutionState.resolution_reason` typed bridge取得。不得伪造core change / trace、扫描summary / locator或修改immutable reconciliation report。
- document / consumer registration由application从safe fields构造candidate digest和marker,调用matching resolver,生成ref id + canonical state id并在same UoW保存；caller不能声明`Resolved`。candidate locator分别通过`ReferenceLocatorSummary::from_external_document(...)`、`from_runtime_tools_consumer(...)`和`from_sdk_consumer(...)`形成,不得访问safe newtype私有字段或拼接external body。
- runtime/tools consumer ref不表示invocation授权,SDK consumer ref不表示package已发布；registration failure不得修改formal exposure。

### 7.9 Command API exact handler surface

以下trait归`api::command_handlers`,固定transport-neutral handler callable surface。server framework extractor、listener、JSON codec和`ApiError`映射留Step 12 / 14；handler只验证route-envelope对称、调用`CapabilityOperationContext::from_command`并转交对应application service。application service method采用同名snake_case callable,参数固定为`(CapabilityOperationContext, CommandBody)`,返回同一`CapabilityCommandOutcome<ResultBody>`；Step 9逐方法展开内部调用顺序。

```rust
/// Closed synchronous API handler surface for all capability-hub commands.
#[async_trait::async_trait]
pub trait CapabilityCommandHandlers: Send + Sync {
    /// Establishes one external source, capability identity, and initial access-review context.
    async fn establish_capability_access_context(
        &self,
        request: CapabilityCommandRequest<EstablishCapabilityAccessContextCommand>,
    ) -> Result<CapabilityCommandOutcome<EstablishCapabilityAccessContextResult>, ApplicationError>;

    /// Corrects, merges, or splits an existing capability identity through the formal correction path.
    async fn correct_capability_identity(
        &self,
        request: CapabilityCommandRequest<CorrectCapabilityIdentityCommand>,
    ) -> Result<CapabilityCommandOutcome<CorrectCapabilityIdentityResult>, ApplicationError>;

    /// Terminally retires an existing capability identity.
    async fn retire_capability_identity(
        &self,
        request: CapabilityCommandRequest<RetireCapabilityIdentityCommand>,
    ) -> Result<CapabilityCommandOutcome<RetireCapabilityIdentityResult>, ApplicationError>;

    /// Records a body-free access-review fact separately from governance approval.
    async fn record_capability_access_review_fact(
        &self,
        request: CapabilityCommandRequest<RecordCapabilityAccessReviewFactCommand>,
    ) -> Result<CapabilityCommandOutcome<RecordCapabilityAccessReviewFactResult>, ApplicationError>;

    /// Registers an established capability identity in the capability registry.
    async fn register_capability_in_registry(
        &self,
        request: CapabilityCommandRequest<RegisterCapabilityInRegistryCommand>,
    ) -> Result<CapabilityCommandOutcome<RegisterCapabilityInRegistryResult>, ApplicationError>;

    /// Applies one allowed lifecycle transition to a capability registry entry.
    async fn update_registry_lifecycle_state(
        &self,
        request: CapabilityCommandRequest<UpdateRegistryLifecycleStateCommand>,
    ) -> Result<CapabilityCommandOutcome<UpdateRegistryLifecycleStateResult>, ApplicationError>;

    /// Replaces the body-free visibility basis of a capability registry entry.
    async fn update_registry_visibility_basis(
        &self,
        request: CapabilityCommandRequest<UpdateRegistryVisibilityBasisCommand>,
    ) -> Result<CapabilityCommandOutcome<UpdateRegistryVisibilityBasisResult>, ApplicationError>;

    /// Terminally retires a capability registry entry.
    async fn retire_capability_registry_entry(
        &self,
        request: CapabilityCommandRequest<RetireCapabilityRegistryEntryCommand>,
    ) -> Result<CapabilityCommandOutcome<RetireCapabilityRegistryEntryResult>, ApplicationError>;

    /// Establishes a body-free adapter descriptor for a registered capability.
    async fn establish_adapter_descriptor(
        &self,
        request: CapabilityCommandRequest<EstablishAdapterDescriptorCommand>,
    ) -> Result<CapabilityCommandOutcome<EstablishAdapterDescriptorResult>, ApplicationError>;

    /// Replaces an adapter descriptor while preserving the historical descriptor.
    async fn replace_adapter_descriptor(
        &self,
        request: CapabilityCommandRequest<ReplaceAdapterDescriptorCommand>,
    ) -> Result<CapabilityCommandOutcome<ReplaceAdapterDescriptorResult>, ApplicationError>;

    /// Records a body-free descriptor risk and constraint summary.
    async fn record_descriptor_risk_constraint_summary(
        &self,
        request: CapabilityCommandRequest<RecordDescriptorRiskConstraintSummaryCommand>,
    ) -> Result<CapabilityCommandOutcome<RecordDescriptorRiskConstraintSummaryResult>, ApplicationError>;

    /// Attaches an externally managed secret reference without reading secret material.
    async fn attach_descriptor_secret_reference(
        &self,
        request: CapabilityCommandRequest<AttachDescriptorSecretReferenceCommand>,
    ) -> Result<CapabilityCommandOutcome<AttachDescriptorSecretReferenceResult>, ApplicationError>;

    /// Attaches a governance-owned result through the capability governance seam.
    async fn attach_governance_seam_relation(
        &self,
        request: CapabilityCommandRequest<AttachGovernanceSeamRelationCommand>,
    ) -> Result<CapabilityCommandOutcome<AttachGovernanceSeamRelationResult>, ApplicationError>;

    /// Replaces a governance seam relation while retaining the historical relation.
    async fn replace_governance_seam_relation(
        &self,
        request: CapabilityCommandRequest<ReplaceGovernanceSeamRelationCommand>,
    ) -> Result<CapabilityCommandOutcome<ReplaceGovernanceSeamRelationResult>, ApplicationError>;

    /// Expires an existing governance seam relation.
    async fn expire_governance_seam_relation(
        &self,
        request: CapabilityCommandRequest<ExpireGovernanceSeamRelationCommand>,
    ) -> Result<CapabilityCommandOutcome<ExpireGovernanceSeamRelationResult>, ApplicationError>;

    /// Attaches a body-free method-library asset relation to a capability identity.
    async fn attach_capability_method_relation(
        &self,
        request: CapabilityCommandRequest<AttachCapabilityMethodRelationCommand>,
    ) -> Result<CapabilityCommandOutcome<AttachCapabilityMethodRelationResult>, ApplicationError>;

    /// Terminally removes a capability-to-method relation.
    async fn remove_capability_method_relation(
        &self,
        request: CapabilityCommandRequest<RemoveCapabilityMethodRelationCommand>,
    ) -> Result<CapabilityCommandOutcome<RemoveCapabilityMethodRelationResult>, ApplicationError>;

    /// Establishes and evaluates the server-owned formal exposure boundary.
    async fn establish_formal_exposure_boundary(
        &self,
        request: CapabilityCommandRequest<EstablishFormalExposureBoundaryCommand>,
    ) -> Result<CapabilityCommandOutcome<EstablishFormalExposureBoundaryResult>, ApplicationError>;

    /// Reevaluates or marks pending the formal visibility applicability of an exposure.
    async fn update_formal_visibility_applicability(
        &self,
        request: CapabilityCommandRequest<UpdateFormalVisibilityApplicabilityCommand>,
    ) -> Result<CapabilityCommandOutcome<UpdateFormalVisibilityApplicabilityResult>, ApplicationError>;

    /// Suspends an existing formal exposure boundary.
    async fn suspend_formal_exposure_boundary(
        &self,
        request: CapabilityCommandRequest<SuspendFormalExposureBoundaryCommand>,
    ) -> Result<CapabilityCommandOutcome<SuspendFormalExposureBoundaryResult>, ApplicationError>;

    /// Terminally retires an existing formal exposure boundary.
    async fn retire_formal_exposure_boundary(
        &self,
        request: CapabilityCommandRequest<RetireFormalExposureBoundaryCommand>,
    ) -> Result<CapabilityCommandOutcome<RetireFormalExposureBoundaryResult>, ApplicationError>;

    /// Records a body-free downstream impact fact from an exact traceability revision.
    async fn record_capability_change_impact_fact(
        &self,
        request: CapabilityCommandRequest<RecordCapabilityChangeImpactFactCommand>,
    ) -> Result<CapabilityCommandOutcome<RecordCapabilityChangeImpactFactResult>, ApplicationError>;

    /// Appends a local traceability handoff summary and optionally requests an audit handoff.
    async fn record_traceability_handoff_summary(
        &self,
        request: CapabilityCommandRequest<RecordTraceabilityHandoffSummaryCommand>,
    ) -> Result<CapabilityCommandOutcome<RecordTraceabilityHandoffSummaryResult>, ApplicationError>;

    /// Applies an explicit transition to one existing canonical reference-resolution state.
    async fn record_reference_resolution_state(
        &self,
        request: CapabilityCommandRequest<RecordReferenceResolutionStateCommand>,
    ) -> Result<CapabilityCommandOutcome<RecordReferenceResolutionStateResult>, ApplicationError>;

    /// Registers a body-free external document reference and its canonical resolution state.
    async fn register_external_document_reference(
        &self,
        request: CapabilityCommandRequest<RegisterExternalDocumentReferenceCommand>,
    ) -> Result<CapabilityCommandOutcome<RegisterExternalDocumentReferenceResult>, ApplicationError>;

    /// Registers a runtime/tools or SDK consumer boundary reference.
    async fn register_capability_consumer_reference(
        &self,
        request: CapabilityCommandRequest<RegisterCapabilityConsumerReferenceCommand>,
    ) -> Result<CapabilityCommandOutcome<RegisterCapabilityConsumerReferenceResult>, ApplicationError>;
}
```

handler/service mapping rules:

- handler必须先验证path对应closed `command_name`且`T`匹配；mismatch返回`OperationMismatch`,不得把body交给错误service。
- handler从envelope唯一构造`CapabilityOperationContext`;application同名method接收context + body,不得让service再次接收或解析HTTP metadata。
- `api`不得持有Step 7 repository、resolver、UoW、clock / id或external port；这些只由application service facade注入和调用。
- exact `ApplicationError`到HTTP status / `ApiError` mapping留Step 12；可预期业务拒绝必须留在`CapabilityCommandOutcome::Rejected`。

### 7.10 Command application service exact callable surface

以下trait归`application`各既有service文件。`context`必须由entry使用Step 6 factory构造；`command`是已验证route/name/schema对称的body。service不得再次接收HTTP request、header、path、JSON value或framework context。

```rust
/// Application command surface for capability identity and access-review use cases.
#[async_trait::async_trait]
pub trait CapabilityIdentityCommandService: Send + Sync {
    /// Establishes the source reference, identity, and initial access-review fact.
    async fn establish_capability_access_context(
        &self,
        context: CapabilityOperationContext,
        command: EstablishCapabilityAccessContextCommand,
    ) -> Result<CapabilityCommandOutcome<EstablishCapabilityAccessContextResult>, ApplicationError>;

    /// Applies one formal correction, merge, or split to the target identity.
    async fn correct_capability_identity(
        &self,
        context: CapabilityOperationContext,
        command: CorrectCapabilityIdentityCommand,
    ) -> Result<CapabilityCommandOutcome<CorrectCapabilityIdentityResult>, ApplicationError>;

    /// Terminally retires one capability identity.
    async fn retire_capability_identity(
        &self,
        context: CapabilityOperationContext,
        command: RetireCapabilityIdentityCommand,
    ) -> Result<CapabilityCommandOutcome<RetireCapabilityIdentityResult>, ApplicationError>;

    /// Records and attaches one current body-free access-review fact.
    async fn record_capability_access_review_fact(
        &self,
        context: CapabilityOperationContext,
        command: RecordCapabilityAccessReviewFactCommand,
    ) -> Result<CapabilityCommandOutcome<RecordCapabilityAccessReviewFactResult>, ApplicationError>;
}

/// Application command surface for capability registry use cases.
#[async_trait::async_trait]
pub trait CapabilityRegistryCommandService: Send + Sync {
    /// Registers one active capability identity in the registry.
    async fn register_capability_in_registry(
        &self,
        context: CapabilityOperationContext,
        command: RegisterCapabilityInRegistryCommand,
    ) -> Result<CapabilityCommandOutcome<RegisterCapabilityInRegistryResult>, ApplicationError>;

    /// Applies one allowed registry lifecycle transition.
    async fn update_registry_lifecycle_state(
        &self,
        context: CapabilityOperationContext,
        command: UpdateRegistryLifecycleStateCommand,
    ) -> Result<CapabilityCommandOutcome<UpdateRegistryLifecycleStateResult>, ApplicationError>;

    /// Replaces one registry visibility basis and reevaluates registry semantics.
    async fn update_registry_visibility_basis(
        &self,
        context: CapabilityOperationContext,
        command: UpdateRegistryVisibilityBasisCommand,
    ) -> Result<CapabilityCommandOutcome<UpdateRegistryVisibilityBasisResult>, ApplicationError>;

    /// Terminally retires one capability registry entry.
    async fn retire_capability_registry_entry(
        &self,
        context: CapabilityOperationContext,
        command: RetireCapabilityRegistryEntryCommand,
    ) -> Result<CapabilityCommandOutcome<RetireCapabilityRegistryEntryResult>, ApplicationError>;
}

/// Application command surface for adapter descriptor and safe-summary use cases.
#[async_trait::async_trait]
pub trait CapabilityDescriptorCommandService: Send + Sync {
    /// Establishes one accepted body-free adapter descriptor.
    async fn establish_adapter_descriptor(
        &self,
        context: CapabilityOperationContext,
        command: EstablishAdapterDescriptorCommand,
    ) -> Result<CapabilityCommandOutcome<EstablishAdapterDescriptorResult>, ApplicationError>;

    /// Replaces one current adapter descriptor with a new descriptor identity.
    async fn replace_adapter_descriptor(
        &self,
        context: CapabilityOperationContext,
        command: ReplaceAdapterDescriptorCommand,
    ) -> Result<CapabilityCommandOutcome<ReplaceAdapterDescriptorResult>, ApplicationError>;

    /// Records and attaches one descriptor risk and constraint safe summary.
    async fn record_descriptor_risk_constraint_summary(
        &self,
        context: CapabilityOperationContext,
        command: RecordDescriptorRiskConstraintSummaryCommand,
    ) -> Result<CapabilityCommandOutcome<RecordDescriptorRiskConstraintSummaryResult>, ApplicationError>;

    /// Registers and attaches one body-free external secret reference and safe summary.
    async fn attach_descriptor_secret_reference(
        &self,
        context: CapabilityOperationContext,
        command: AttachDescriptorSecretReferenceCommand,
    ) -> Result<CapabilityCommandOutcome<AttachDescriptorSecretReferenceResult>, ApplicationError>;
}

/// Application command surface for governance seam and method relation use cases.
#[async_trait::async_trait]
pub trait CapabilityRelationCommandService: Send + Sync {
    /// Establishes one body-free governance seam relation.
    async fn attach_governance_seam_relation(
        &self,
        context: CapabilityOperationContext,
        command: AttachGovernanceSeamRelationCommand,
    ) -> Result<CapabilityCommandOutcome<AttachGovernanceSeamRelationResult>, ApplicationError>;

    /// Replaces one governance seam relation with a newly identified relation.
    async fn replace_governance_seam_relation(
        &self,
        context: CapabilityOperationContext,
        command: ReplaceGovernanceSeamRelationCommand,
    ) -> Result<CapabilityCommandOutcome<ReplaceGovernanceSeamRelationResult>, ApplicationError>;

    /// Expires one current governance seam relation.
    async fn expire_governance_seam_relation(
        &self,
        context: CapabilityOperationContext,
        command: ExpireGovernanceSeamRelationCommand,
    ) -> Result<CapabilityCommandOutcome<ExpireGovernanceSeamRelationResult>, ApplicationError>;

    /// Establishes one body-free capability-to-method relation.
    async fn attach_capability_method_relation(
        &self,
        context: CapabilityOperationContext,
        command: AttachCapabilityMethodRelationCommand,
    ) -> Result<CapabilityCommandOutcome<AttachCapabilityMethodRelationResult>, ApplicationError>;

    /// Terminally removes one capability-to-method relation.
    async fn remove_capability_method_relation(
        &self,
        context: CapabilityOperationContext,
        command: RemoveCapabilityMethodRelationCommand,
    ) -> Result<CapabilityCommandOutcome<RemoveCapabilityMethodRelationResult>, ApplicationError>;
}

/// Application command surface for formal exposure and visibility use cases.
#[async_trait::async_trait]
pub trait CapabilityExposureCommandService: Send + Sync {
    /// Establishes and evaluates one formal exposure boundary and visibility fact.
    async fn establish_formal_exposure_boundary(
        &self,
        context: CapabilityOperationContext,
        command: EstablishFormalExposureBoundaryCommand,
    ) -> Result<CapabilityCommandOutcome<EstablishFormalExposureBoundaryResult>, ApplicationError>;

    /// Reevaluates or marks pending one formal visibility applicability fact.
    async fn update_formal_visibility_applicability(
        &self,
        context: CapabilityOperationContext,
        command: UpdateFormalVisibilityApplicabilityCommand,
    ) -> Result<CapabilityCommandOutcome<UpdateFormalVisibilityApplicabilityResult>, ApplicationError>;

    /// Suspends one formal exposure and makes its visibility unavailable.
    async fn suspend_formal_exposure_boundary(
        &self,
        context: CapabilityOperationContext,
        command: SuspendFormalExposureBoundaryCommand,
    ) -> Result<CapabilityCommandOutcome<SuspendFormalExposureBoundaryResult>, ApplicationError>;

    /// Terminally retires one formal exposure and its visibility fact.
    async fn retire_formal_exposure_boundary(
        &self,
        context: CapabilityOperationContext,
        command: RetireFormalExposureBoundaryCommand,
    ) -> Result<CapabilityCommandOutcome<RetireFormalExposureBoundaryResult>, ApplicationError>;
}

/// Application command surface for impact and traceability handoff use cases.
#[async_trait::async_trait]
pub trait CapabilityTraceImpactCommandService: Send + Sync {
    /// Derives one body-free impact fact from an exact traceability revision.
    async fn record_capability_change_impact_fact(
        &self,
        context: CapabilityOperationContext,
        command: RecordCapabilityChangeImpactFactCommand,
    ) -> Result<CapabilityCommandOutcome<RecordCapabilityChangeImpactFactResult>, ApplicationError>;

    /// Appends one local traceability handoff revision and optionally requests external handoff.
    async fn record_traceability_handoff_summary(
        &self,
        context: CapabilityOperationContext,
        command: RecordTraceabilityHandoffSummaryCommand,
    ) -> Result<CapabilityCommandOutcome<RecordTraceabilityHandoffSummaryResult>, ApplicationError>;
}

/// Application command surface for canonical external-reference support use cases.
#[async_trait::async_trait]
pub trait CapabilityReferenceCommandService: Send + Sync {
    /// Transitions one existing canonical reference-resolution state.
    async fn record_reference_resolution_state(
        &self,
        context: CapabilityOperationContext,
        command: RecordReferenceResolutionStateCommand,
    ) -> Result<CapabilityCommandOutcome<RecordReferenceResolutionStateResult>, ApplicationError>;

    /// Registers one body-free external document reference and canonical state.
    async fn register_external_document_reference(
        &self,
        context: CapabilityOperationContext,
        command: RegisterExternalDocumentReferenceCommand,
    ) -> Result<CapabilityCommandOutcome<RegisterExternalDocumentReferenceResult>, ApplicationError>;

    /// Registers one runtime/tools or SDK consumer reference and canonical state.
    async fn register_capability_consumer_reference(
        &self,
        context: CapabilityOperationContext,
        command: RegisterCapabilityConsumerReferenceCommand,
    ) -> Result<CapabilityCommandOutcome<RegisterCapabilityConsumerReferenceResult>, ApplicationError>;
}
```

callable rules:

- `context.operation_name`必须与exact method绑定的closed command name一致；service不得根据body字段、route文本或ref kind重新选择另一个method。
- context和command共同形成stable request digest；exact canonical field bytes / domain / reserve race由Step 13固定,stored replay transaction ordering由Step 11固定,所有method都必须走shared write-channel guard。
- native `async fn`是Rust-facing contract；Step 14 batch `14.5.2.2.3`已固定所有进入dyn graph的本Step async trait和对应impl使用`#[async_trait::async_trait]`、`async-trait 0.1.89`、`Send`future且禁止`?Send`。该lowering不得改变方法名、参数、返回、error或fake parity。
- facade可以聚合七个trait handle,但不得新增generic `execute(command_name, JsonValue)`或把七个owner合成持有domain/repository的entry service。

### 7.11 Command route / service mapping

| closed command name | HTTP route | handler / application owner | request -> accepted result |
|---|---|---|---|
| `EstablishCapabilityAccessContext` | `POST /v1/capability-hub/commands/establish-capability-access-context` | `establish_capability_access_context` / `identity_service` | `EstablishCapabilityAccessContextCommand` -> `EstablishCapabilityAccessContextResult` |
| `CorrectCapabilityIdentity` | `POST /v1/capability-hub/commands/correct-capability-identity` | `correct_capability_identity` / `identity_service` | `CorrectCapabilityIdentityCommand` -> `CorrectCapabilityIdentityResult` |
| `RetireCapabilityIdentity` | `POST /v1/capability-hub/commands/retire-capability-identity` | `retire_capability_identity` / `identity_service` | `RetireCapabilityIdentityCommand` -> `RetireCapabilityIdentityResult` |
| `RecordCapabilityAccessReviewFact` | `POST /v1/capability-hub/commands/record-capability-access-review-fact` | `record_capability_access_review_fact` / `identity_service` | `RecordCapabilityAccessReviewFactCommand` -> `RecordCapabilityAccessReviewFactResult` |
| `RegisterCapabilityInRegistry` | `POST /v1/capability-hub/commands/register-capability-in-registry` | `register_capability_in_registry` / `registry_service` | `RegisterCapabilityInRegistryCommand` -> `RegisterCapabilityInRegistryResult` |
| `UpdateRegistryLifecycleState` | `POST /v1/capability-hub/commands/update-registry-lifecycle-state` | `update_registry_lifecycle_state` / `registry_service` | `UpdateRegistryLifecycleStateCommand` -> `UpdateRegistryLifecycleStateResult` |
| `UpdateRegistryVisibilityBasis` | `POST /v1/capability-hub/commands/update-registry-visibility-basis` | `update_registry_visibility_basis` / `registry_service` | `UpdateRegistryVisibilityBasisCommand` -> `UpdateRegistryVisibilityBasisResult` |
| `RetireCapabilityRegistryEntry` | `POST /v1/capability-hub/commands/retire-capability-registry-entry` | `retire_capability_registry_entry` / `registry_service` | `RetireCapabilityRegistryEntryCommand` -> `RetireCapabilityRegistryEntryResult` |
| `EstablishAdapterDescriptor` | `POST /v1/capability-hub/commands/establish-adapter-descriptor` | `establish_adapter_descriptor` / `descriptor_service` | `EstablishAdapterDescriptorCommand` -> `EstablishAdapterDescriptorResult` |
| `ReplaceAdapterDescriptor` | `POST /v1/capability-hub/commands/replace-adapter-descriptor` | `replace_adapter_descriptor` / `descriptor_service` | `ReplaceAdapterDescriptorCommand` -> `ReplaceAdapterDescriptorResult` |
| `RecordDescriptorRiskConstraintSummary` | `POST /v1/capability-hub/commands/record-descriptor-risk-constraint-summary` | `record_descriptor_risk_constraint_summary` / `descriptor_service` | `RecordDescriptorRiskConstraintSummaryCommand` -> `RecordDescriptorRiskConstraintSummaryResult` |
| `AttachDescriptorSecretReference` | `POST /v1/capability-hub/commands/attach-descriptor-secret-reference` | `attach_descriptor_secret_reference` / `descriptor_service` | `AttachDescriptorSecretReferenceCommand` -> `AttachDescriptorSecretReferenceResult` |
| `AttachGovernanceSeamRelation` | `POST /v1/capability-hub/commands/attach-governance-seam-relation` | `attach_governance_seam_relation` / `relation_service` | `AttachGovernanceSeamRelationCommand` -> `AttachGovernanceSeamRelationResult` |
| `ReplaceGovernanceSeamRelation` | `POST /v1/capability-hub/commands/replace-governance-seam-relation` | `replace_governance_seam_relation` / `relation_service` | `ReplaceGovernanceSeamRelationCommand` -> `ReplaceGovernanceSeamRelationResult` |
| `ExpireGovernanceSeamRelation` | `POST /v1/capability-hub/commands/expire-governance-seam-relation` | `expire_governance_seam_relation` / `relation_service` | `ExpireGovernanceSeamRelationCommand` -> `ExpireGovernanceSeamRelationResult` |
| `AttachCapabilityMethodRelation` | `POST /v1/capability-hub/commands/attach-capability-method-relation` | `attach_capability_method_relation` / `relation_service` | `AttachCapabilityMethodRelationCommand` -> `AttachCapabilityMethodRelationResult` |
| `RemoveCapabilityMethodRelation` | `POST /v1/capability-hub/commands/remove-capability-method-relation` | `remove_capability_method_relation` / `relation_service` | `RemoveCapabilityMethodRelationCommand` -> `RemoveCapabilityMethodRelationResult` |
| `EstablishFormalExposureBoundary` | `POST /v1/capability-hub/commands/establish-formal-exposure-boundary` | `establish_formal_exposure_boundary` / `exposure_service` | `EstablishFormalExposureBoundaryCommand` -> `EstablishFormalExposureBoundaryResult` |
| `UpdateFormalVisibilityApplicability` | `POST /v1/capability-hub/commands/update-formal-visibility-applicability` | `update_formal_visibility_applicability` / `exposure_service` | `UpdateFormalVisibilityApplicabilityCommand` -> `UpdateFormalVisibilityApplicabilityResult` |
| `SuspendFormalExposureBoundary` | `POST /v1/capability-hub/commands/suspend-formal-exposure-boundary` | `suspend_formal_exposure_boundary` / `exposure_service` | `SuspendFormalExposureBoundaryCommand` -> `SuspendFormalExposureBoundaryResult` |
| `RetireFormalExposureBoundary` | `POST /v1/capability-hub/commands/retire-formal-exposure-boundary` | `retire_formal_exposure_boundary` / `exposure_service` | `RetireFormalExposureBoundaryCommand` -> `RetireFormalExposureBoundaryResult` |
| `RecordCapabilityChangeImpactFact` | `POST /v1/capability-hub/commands/record-capability-change-impact-fact` | `record_capability_change_impact_fact` / `trace_impact_service` | `RecordCapabilityChangeImpactFactCommand` -> `RecordCapabilityChangeImpactFactResult` |
| `RecordTraceabilityHandoffSummary` | `POST /v1/capability-hub/commands/record-traceability-handoff-summary` | `record_traceability_handoff_summary` / `trace_impact_service` | `RecordTraceabilityHandoffSummaryCommand` -> `RecordTraceabilityHandoffSummaryResult` |
| `RecordReferenceResolutionState` | `POST /v1/capability-hub/commands/record-reference-resolution-state` | `record_reference_resolution_state` / `reference_service` | `RecordReferenceResolutionStateCommand` -> `RecordReferenceResolutionStateResult` |
| `RegisterExternalDocumentReference` | `POST /v1/capability-hub/commands/register-external-document-reference` | `register_external_document_reference` / `reference_service` | `RegisterExternalDocumentReferenceCommand` -> `RegisterExternalDocumentReferenceResult` |
| `RegisterCapabilityConsumerReference` | `POST /v1/capability-hub/commands/register-capability-consumer-reference` | `register_capability_consumer_reference` / `reference_service` | `RegisterCapabilityConsumerReferenceCommand` -> `RegisterCapabilityConsumerReferenceResult` |

所有route只接受schema version `1`和表中exact body；method非`POST`、unknown path、unknown command name、route/body/name不对称均在进入application前拒绝。任何route alias、bulk mutation、generic `execute`、runtime invocation、tools execution或marketplace mutation均不属于本协议。

### 7.12 Identity / review and registry independent protocol cards

本组每张卡都是独立协议真相源。表中的common write ports统一指`CapabilityUnitOfWorkManager`、`CapabilityIdempotencyRepository`、`StoredCapabilityResultRepository`、`ClockPort`和`IdGeneratorPort`;它们不得由handler持有。所有request字段均来自typed body;actor、trace、idempotency和request metadata只来自`CapabilityCommandRequest<T>` envelope。

#### 7.12.1 `EstablishCapabilityAccessContext`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/establish-capability-access-context`;受信同步identity-intake participant / integration caller |
| API handler | `CapabilityCommandHandlers::establish_capability_access_context(CapabilityCommandRequest<EstablishCapabilityAccessContextCommand>) -> Result<CapabilityCommandOutcome<EstablishCapabilityAccessContextResult>, ApplicationError>` |
| application service | `CapabilityIdentityCommandService::establish_capability_access_context(CapabilityOperationContext, EstablishCapabilityAccessContextCommand) -> Result<CapabilityCommandOutcome<EstablishCapabilityAccessContextResult>, ApplicationError>` |
| exact schema | §7.1 `CapabilityExternalSourceSelection` + `CapabilityAccessIntakeContextDto`;§7.2 request / result;shared §6.2 envelope / outcome / effect |
| Step 9 flow | `command_establish_capability_access_context_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `source.Existing.source_ref_id` | caller local typed ref;missing variant field -> `MissingRequiredField`;not found / kind mismatch -> `PolicyRejected` | loaded `ExternalCapabilitySourceRef` + current `ReferenceResolutionState` |
| `source.Register.source_kind` | caller closed kind;missing -> `MissingRequiredField`;unsupported kind -> `InvalidField` | `ReferenceCandidate`;`ExternalCapabilitySourceRef::register` |
| `source.Register.external_locator` | caller body-free locator;missing -> `MissingRequiredField`;forbidden body -> `BodyForbidden` | resolver candidate + source ref locator |
| `intake.identity_key` | caller stable identity key;missing -> `MissingRequiredField`;duplicate current key -> `PolicyRejected` | `CapabilityIdentity::create_from_intake` |
| `intake.review_context` / `risk_summary` | caller body-free review fields;either missing -> `MissingRequiredField` | `CapabilityAccessReviewFact::draft` then `record` |
| `intake.change_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | identity `Created` record and `attach_review_fact(...)` reason |

| construction / effect | exact rule |
|---|---|
| object calls | Register branch generates source / state ids,builds locator through`ReferenceLocatorSummary::from_external_source(&external_locator)`,then builds candidate and canonical`ReferenceCandidateDigest`,invokes resolver,and constructs`ReferenceResolutionState::from_initial_resolution`+`ExternalCapabilitySourceRef::register(..., candidate_digest, ...)`;both branches construct the default `CapabilityIdentityPolicy`,call`CapabilityIdentity::create_from_intake(..., &identity_policy, ...)`,append`CapabilityIdentityChangeRecord::append(..., Created, ...)`,create / record review fact,and call`CapabilityIdentity::attach_review_fact(...)` |
| identity initial-state mapping | The factory must use the canonical external-source state and policy result without caller choice: `Resolved -> Active`;`Stale -> Candidate`;`Unresolved / Unavailable -> Unresolved`;`Invalid / Forbidden / Expired -> stable rejection`. The `Created` record `next_state` and accepted result copy the actual factory state. |
| Step 7 ports | `ExternalCapabilitySourceReferencePort::resolve_source_reference` only for Register;`CapabilityExternalReferenceRepository::{get_with_version, find_by_candidate_digest, save}`;`ReferenceResolutionStateRepository::{find_current_by_subject, save}`;`CapabilityIdentityRepository::{find_by_identity_key, save}`;`CapabilityAccessReviewRepository::{find_current_by_identity, save}`;`CapabilityChangeRecordRepository::append_identity_change`;`CapabilityTraceabilityRepository::append_revision`;Step 7 §11.3.1 affected-material ports;common write / capture ports |
| stable rejection | invalid envelope / source variant -> `InvalidEnvelope` / `InvalidField`;duplicate source candidate with incompatible fields、identity key conflict、invalid source state or identity policy failure -> `PolicyRejected`;forbidden source material -> `BodyForbidden` |
| idempotency / audit | required;digest coverssource variant + all intake fields。Fresh acceptance stores source / canonical state when registered,identity,review,two ordered identity change refs,one identity-subject trace revision and complete effect surface;both `Created` and `ReviewFactAttached` explain the final identity state and form separate `CapabilityIdentityChanged` captures;Register also forms one `ReferenceResolutionChanged` capture for the new canonical state。Run affected-material propagation once from the terminal `ReviewFactAttached` record;duplicate replays stored surface without resolver、scan or writes |

#### 7.12.2 `CorrectCapabilityIdentity`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/correct-capability-identity`;受信identity-maintenance participant |
| API handler | `CapabilityCommandHandlers::correct_capability_identity(CapabilityCommandRequest<CorrectCapabilityIdentityCommand>) -> Result<CapabilityCommandOutcome<CorrectCapabilityIdentityResult>, ApplicationError>` |
| application service | `CapabilityIdentityCommandService::correct_capability_identity(CapabilityOperationContext, CorrectCapabilityIdentityCommand) -> Result<CapabilityCommandOutcome<CorrectCapabilityIdentityResult>, ApplicationError>` |
| exact schema | §7.1 `CapabilityIdentityCorrectionKind`;§7.2 request / result;shared §6.2 |
| Step 9 flow | `command_correct_capability_identity_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact current ref;missing -> `MissingRequiredField`;missing / stale / retired -> `PolicyRejected` | `CapabilityIdentityRepository::get_with_version` target |
| `correction_kind` | caller closed correction kind;missing / unknown -> `MissingRequiredField` / `InvalidField` | exact `Corrected / Merged / Split` domain change kind |
| `new_identity_key` | caller corrected stable key;missing -> `MissingRequiredField`;owned by another current identity -> `PolicyRejected` | `CapabilityIdentity::complete_correction` |
| `related_identity_refs` | caller stable-order exact refs;`Corrected` requires empty,merge / split requires non-empty;shape mismatch -> `InvalidField` | `CapabilityIdentityRefSet` + loaded related identities |
| `correction_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | request / completion change records |

| construction / effect | exact rule |
|---|---|
| object calls | load target + every related exact identity,run `CapabilityIdentityPolicy::validate_correction`,call `request_correction(...)` then `complete_correction(...)` in one UoW;only target identity mutates,related refs enter append-only evidence and result stable order |
| Step 7 ports | `CapabilityIdentityRepository::{get_with_version, find_by_identity_key, save}`;`CapabilityChangeRecordRepository::append_identity_change`;`CapabilityTraceabilityRepository::append_revision`;Step 7 §11.3.1 affected-material ports;common write / capture ports |
| stable rejection | self / duplicate / retired related refs、kind / relation-cardinality mismatch、key collision、stale target ref or illegal lifecycle -> `PolicyRejected` / `InvalidField`;body rewrite attempt -> `BodyForbidden` |
| idempotency / audit | required;digest covers all five body fields including ordered canonical related-ref set。Acceptance appends `CorrectionRequested` then exact correction-kind records and one target-subject trace revision,但只保存一次final identity revision。`CorrectionRequested`只进入trace,因其`CorrectionPending` next state不与final active revision对称而不得capture；terminal `Corrected / Merged / Split`形成唯一`CapabilityIdentityChanged` capture并驱动一次affected-material propagation。duplicate不reopen correction、不scan material |

#### 7.12.3 `RetireCapabilityIdentity`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/retire-capability-identity`;受信identity-maintenance participant |
| API handler | `CapabilityCommandHandlers::retire_capability_identity(CapabilityCommandRequest<RetireCapabilityIdentityCommand>) -> Result<CapabilityCommandOutcome<RetireCapabilityIdentityResult>, ApplicationError>` |
| application service | `CapabilityIdentityCommandService::retire_capability_identity(CapabilityOperationContext, RetireCapabilityIdentityCommand) -> Result<CapabilityCommandOutcome<RetireCapabilityIdentityResult>, ApplicationError>` |
| exact schema | §7.2 request / result;shared §6.2 |
| Step 9 flow | `command_retire_capability_identity_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact current ref;missing -> `MissingRequiredField`;not found / stale -> `PolicyRejected` | loaded `CapabilityIdentity` |
| `retirement_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | `CapabilityIdentity::retire(...)` |

| construction / effect | exact rule |
|---|---|
| object / ports | load current registry through`CapabilityRegistryRepository::find_current_by_identity`for dependent-truth guard,then call`retire(...)`;save through`CapabilityIdentityRepository`,append through`CapabilityChangeRecordRepository::append_identity_change`,append one revision through`CapabilityTraceabilityRepository`;run Step 7 §11.3.1 affected-material propagation;use common write / capture ports |
| stable rejection | already retired、illegal current state、stale exact ref or active dependent-truth policy guard -> `PolicyRejected`;caller-supplied cascade / deletion intent -> `InvalidField` |
| idempotency / audit | required;digest covers ref + reason。Acceptance preserves history,appends one`Retired`record / identity trace and one`CapabilityIdentityChanged`capture,then marks only actually selected mutable materials stale in the same UoW;duplicate never cascades、re-retires or scans material |

#### 7.12.4 `RecordCapabilityAccessReviewFact`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/record-capability-access-review-fact`;受信access-review participant,not governance approver authority |
| API handler | `CapabilityCommandHandlers::record_capability_access_review_fact(CapabilityCommandRequest<RecordCapabilityAccessReviewFactCommand>) -> Result<CapabilityCommandOutcome<RecordCapabilityAccessReviewFactResult>, ApplicationError>` |
| application service | `CapabilityIdentityCommandService::record_capability_access_review_fact(CapabilityOperationContext, RecordCapabilityAccessReviewFactCommand) -> Result<CapabilityCommandOutcome<RecordCapabilityAccessReviewFactResult>, ApplicationError>` |
| exact schema | §7.2 request / result;shared §6.2 |
| Step 9 flow | `command_record_capability_access_review_fact_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact identity ref;missing -> `MissingRequiredField`;not found / retired -> `PolicyRejected` | loaded `CapabilityIdentity` and review owner id |
| `review_context` | caller body-free context;missing -> `MissingRequiredField`;approval / policy body shape -> `BodyForbidden` | `CapabilityAccessReviewFact::draft` |
| `risk_summary` | caller safe identity-level risk summary;missing / invalid -> `MissingRequiredField` / `InvalidField` | review factory;not descriptor risk or governance result |

| construction / effect | exact rule |
|---|---|
| object calls | generate new review id,derive `AccessGovernanceSeparationMarker::Separated`,call `draft(...)` then `record(...)`;when current review exists call old `supersede(...)`;call identity `attach_review_fact(...)` with deterministic safe attachment reason |
| Step 7 ports | `CapabilityIdentityRepository::{get_with_version, save}`;`CapabilityAccessReviewRepository::{find_current_by_identity, save}`;`CapabilityChangeRecordRepository::append_identity_change`;`CapabilityTraceabilityRepository::append_revision`;Step 7 §11.3.1 affected-material ports;common write / capture ports |
| stable rejection | non-current identity、current-review race、invalid review state -> `PolicyRejected`;approval / vote / Policy material -> `BodyForbidden`;caller separation marker -> `InvalidField` |
| idempotency / audit | required;digest covers identity + context + risk summary。Acceptance saves new fact / optional superseded fact / identity link,appends one`ReviewFactAttached`record / identity trace / `CapabilityIdentityChanged`capture,then runs affected-material propagation from `ChangeReason::access_review_fact_recorded()`;result marker remains`Separated`;duplicate does not create another fact or scan material |

#### 7.12.5 `RegisterCapabilityInRegistry`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/register-capability-in-registry`;受信registry-maintenance participant |
| API handler | `CapabilityCommandHandlers::register_capability_in_registry(CapabilityCommandRequest<RegisterCapabilityInRegistryCommand>) -> Result<CapabilityCommandOutcome<RegisterCapabilityInRegistryResult>, ApplicationError>` |
| application service | `CapabilityRegistryCommandService::register_capability_in_registry(CapabilityOperationContext, RegisterCapabilityInRegistryCommand) -> Result<CapabilityCommandOutcome<RegisterCapabilityInRegistryResult>, ApplicationError>` |
| exact schema | §7.3 request / result;shared §6.2 |
| Step 9 flow | `command_register_capability_in_registry_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact active identity;missing -> `MissingRequiredField`;not active / stale -> `PolicyRejected` | `CapabilityRegistryEntry::register` identity input |
| `visibility_basis` | caller body-free basis;missing -> `MissingRequiredField`;runtime / listing basis -> `BodyForbidden` | registry factory field + visibility policy validation |
| `visibility_context` | caller scope / audience context;missing / invalid scope -> `MissingRequiredField` / `InvalidScope` | `RegistryVisibilityPolicy::validate_visibility_basis` only |
| `registration_reason` | caller safe lifecycle reason;missing / empty -> `MissingRequiredField` / `InvalidField` | registry factory + `Registered` record |

| construction / effect | exact rule |
|---|---|
| object / ports | reject an existing current entry via`CapabilityRegistryRepository::find_current_by_identity`;call`CapabilityRegistryEntry::register(...)`in memory,which directly forms `RegistryLifecycleState::Registered`;the current flow does not form or persist `RegistryLifecycleState::Draft`. Then call`RegistryVisibilityPolicy::validate_visibility_basis(&entry,...)`before any save；save entry,append`append_registry_change`,append one registry-subject trace revision,then run Step 7 §11.3.1 affected-material propagation;use identity / registry repositories and common write / capture ports |
| stable rejection | duplicate current registration、inactive identity、invalid basis / scope or formal-visible claim -> `PolicyRejected`;runtime authorization / marketplace material -> `BodyForbidden` |
| idempotency / audit | required;digest covers all four fields。Acceptance returns actual initial lifecycle,one`Registered`record / trace / `CapabilityRegistryChanged`capture and only actually staled material refs / captures;duplicate replays original entry ref without material scan |

#### 7.12.6 `UpdateRegistryLifecycleState`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/update-registry-lifecycle-state`;受信registry-maintenance participant |
| API handler | `CapabilityCommandHandlers::update_registry_lifecycle_state(CapabilityCommandRequest<UpdateRegistryLifecycleStateCommand>) -> Result<CapabilityCommandOutcome<UpdateRegistryLifecycleStateResult>, ApplicationError>` |
| application service | `CapabilityRegistryCommandService::update_registry_lifecycle_state(CapabilityOperationContext, UpdateRegistryLifecycleStateCommand) -> Result<CapabilityCommandOutcome<UpdateRegistryLifecycleStateResult>, ApplicationError>` |
| exact schema | §7.3 request / result;shared §6.2 |
| Step 9 flow | `command_update_registry_lifecycle_state_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `registry_entry_ref` | caller exact current entry;missing -> `MissingRequiredField`;not found / stale -> `PolicyRejected` | loaded `CapabilityRegistryEntry` |
| `target_state` | caller closed state;missing -> `MissingRequiredField`;only `Undescribed / Ungoverned / VisibilityPending` are public maintenance targets | `transition_lifecycle(...)` after state / policy guard |
| `lifecycle_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | transition record |

| construction / effect | exact rule |
|---|---|
| object / ports | validate with`RegistryLifecycleState::can_transition_to`and`RegistryVisibilityPolicy::validate_transition`,call`transition_lifecycle(...)`;use`CapabilityRegistryRepository::{get_with_version, save}`,registry change append,trace append,Step 7 §11.3.1 affected-material propagation and common write / capture ports |
| stable rejection | `Draft / Registered / FormalVisible / Retired` target on this public route、no-op target、illegal transition or stale ref -> `PolicyRejected`;`FormalVisible` is exposure-service-only and `Retired` uses §7.12.8 |
| idempotency / audit | required;digest covers ref + target + reason。Acceptance appends one`LifecycleChanged`record / trace / `CapabilityRegistryChanged`capture and actual stale material revisions / captures;duplicate does not re-evaluate current prerequisites or scan material |

#### 7.12.7 `UpdateRegistryVisibilityBasis`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/update-registry-visibility-basis`;受信registry-maintenance participant |
| API handler | `CapabilityCommandHandlers::update_registry_visibility_basis(CapabilityCommandRequest<UpdateRegistryVisibilityBasisCommand>) -> Result<CapabilityCommandOutcome<UpdateRegistryVisibilityBasisResult>, ApplicationError>` |
| application service | `CapabilityRegistryCommandService::update_registry_visibility_basis(CapabilityOperationContext, UpdateRegistryVisibilityBasisCommand) -> Result<CapabilityCommandOutcome<UpdateRegistryVisibilityBasisResult>, ApplicationError>` |
| exact schema | §7.3 request / result;shared §6.2 |
| Step 9 flow | `command_update_registry_visibility_basis_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `registry_entry_ref` | caller exact current entry;missing -> `MissingRequiredField`;not found / stale -> `PolicyRejected` | loaded registry entry |
| `visibility_basis` | replacement body-free basis;missing -> `MissingRequiredField`;forbidden source -> `BodyForbidden` | `apply_visibility_basis(...)` basis |
| `visibility_context` | replacement scope / audience context;missing / invalid -> `MissingRequiredField` / `InvalidScope` | registry visibility policy input only |
| `change_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | visibility-basis change record |

| construction / effect | exact rule |
|---|---|
| object / ports | call`RegistryVisibilityPolicy::validate_visibility_basis`then`CapabilityRegistryEntry::apply_visibility_basis(...)`;save through registry repository,append registry change + trace,run Step 7 §11.3.1 affected-material propagation and use common write / capture ports |
| stable rejection | retired entry、replacement basis equals stored basis、invalid basis / context、runtime / search / marketplace authority or stale ref -> `PolicyRejected` / `BodyForbidden`；`visibility_context`is policy input only and is not persisted,so it cannot make a same-basis request an auditable truth change |
| idempotency / audit | required;digest covers all fields。Accepted lifecycle is always`VisibilityPending`for non-retired entry,never caller-forced`FormalVisible`;one`VisibilityBasisChanged`record / trace / `CapabilityRegistryChanged`capture and actual stale material revisions / captures are returned；already-stale material不重复列入effect |

#### 7.12.8 `RetireCapabilityRegistryEntry`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/retire-capability-registry-entry`;受信registry-maintenance participant |
| API handler | `CapabilityCommandHandlers::retire_capability_registry_entry(CapabilityCommandRequest<RetireCapabilityRegistryEntryCommand>) -> Result<CapabilityCommandOutcome<RetireCapabilityRegistryEntryResult>, ApplicationError>` |
| application service | `CapabilityRegistryCommandService::retire_capability_registry_entry(CapabilityOperationContext, RetireCapabilityRegistryEntryCommand) -> Result<CapabilityCommandOutcome<RetireCapabilityRegistryEntryResult>, ApplicationError>` |
| exact schema | §7.3 request / result;shared §6.2 |
| Step 9 flow | `command_retire_capability_registry_entry_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `registry_entry_ref` | caller exact current entry;missing -> `MissingRequiredField`;not found / stale -> `PolicyRejected` | loaded `CapabilityRegistryEntry` |
| `retirement_reason` | caller safe retirement reason;missing / empty -> `MissingRequiredField` / `InvalidField` | mapped `ChangeReason` for `retire(...)` |

| construction / effect | exact rule |
|---|---|
| object / ports | call registry`retire(...)`;save through`CapabilityRegistryRepository`,append`RegistryChangeRecord` / registry trace,run Step 7 §11.3.1 affected-material propagation and use common write / capture ports |
| stable rejection | already retired、illegal current transition、stale exact ref or implicit dependent-object deletion -> `PolicyRejected` |
| idempotency / audit | required;digest covers ref + reason。Acceptance retires registry only,does not retire identity / descriptor / exposure by implication;returns one`Retired`record / trace / `CapabilityRegistryChanged`capture and actual stale material revisions / captures;duplicate replays stored result without scan or cascade |

### 7.13 Descriptor / safe-summary and relation independent protocol cards

本组common write ports与§7.12相同。Reference registration / re-resolution同时使用`CapabilityExternalReferenceRepository`和`ReferenceResolutionStateRepository`;任何resolver response只能先映射为Step 6 body-free observation / canonical state,不能进入public result或stored replay surface。

#### 7.13.1 `EstablishAdapterDescriptor`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/establish-adapter-descriptor`;受信descriptor-maintenance participant |
| API handler | `CapabilityCommandHandlers::establish_adapter_descriptor(CapabilityCommandRequest<EstablishAdapterDescriptorCommand>) -> Result<CapabilityCommandOutcome<EstablishAdapterDescriptorResult>, ApplicationError>` |
| application service | `CapabilityDescriptorCommandService::establish_adapter_descriptor(CapabilityOperationContext, EstablishAdapterDescriptorCommand) -> Result<CapabilityCommandOutcome<EstablishAdapterDescriptorResult>, ApplicationError>` |
| exact schema | §7.4 request / result;shared §6.2 |
| Step 9 flow | `command_establish_adapter_descriptor_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact active identity;missing -> `MissingRequiredField`;not active / stale -> `PolicyRejected` | owner-chain validation |
| `registry_entry_ref` | caller exact non-retired entry;missing -> `MissingRequiredField`;identity mismatch -> `PolicyRejected` | `AdapterDescriptor::draft_for_entry`;registry bind / lifecycle |
| `source_ref_id` | caller existing external-source ref id;missing -> `MissingRequiredField`;not found / kind mismatch -> `PolicyRejected` | loaded source + canonical state |
| `descriptor_kind` | caller closed descriptor family;missing / incompatible source kind -> `MissingRequiredField` / `InvalidField` | descriptor factory / boundary policy |
| `connection_boundary_summary` | caller body-free summary;missing -> `MissingRequiredField`;provider contract / payload / route / secret body -> `BodyForbidden` | descriptor boundary field |
| `supporting_document_ref_id` | caller optional local document id;Some not found / wrong binding -> `PolicyRejected` | optional `ExternalDocumentRef::bind_supported_descriptor` |
| `change_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | descriptor and registry records |

| construction / effect | exact rule |
|---|---|
| object calls | load and cross-check identity / registry / source / source state / optional document state;reject duplicate current descriptor;call `AdapterDescriptor::draft_for_entry`;resolved safe prerequisites call `accept(...)`,recoverable non-resolved prerequisites call `mark_unresolved(...)`;resolved supporting document binds only after descriptor acceptance |
| registry effect | accepted descriptor调用一次registry `bind_descriptor(...)`,该domain mutation原子设置descriptor ref并把non-retired registry推进 / 保持`VisibilityPending`,只形成一条next=`VisibilityPending`的`DescriptorBound`record；不得为同一次绑定再调用`transition_lifecycle`。unresolved descriptor不绑定,只有registry实际不在`Undescribed`时才以一条`LifecycleChanged`推进`Undescribed` |
| Step 7 ports | identity / registry / adapter descriptor repositories;external reference + resolution-state repositories;`CapabilityChangeRecordRepository::{append_descriptor_change, append_registry_change}`;trace repository;common write ports |
| stable rejection | owner / kind mismatch、duplicate current descriptor、invalid / forbidden source or document、illegal registry transition -> `PolicyRejected` / `BodyForbidden`;recoverable unresolved yields accepted `Unresolved`,not fake `Accepted` |
| idempotency / audit | required;digest covers all seven fields。Effect contains descriptor and any changed registry subjects,ordered change refs and one trace revision per subject;document binding save and all local truth share one UoW;duplicate performs no rebind |

#### 7.13.2 `ReplaceAdapterDescriptor`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/replace-adapter-descriptor`;受信descriptor-maintenance participant |
| API handler | `CapabilityCommandHandlers::replace_adapter_descriptor(CapabilityCommandRequest<ReplaceAdapterDescriptorCommand>) -> Result<CapabilityCommandOutcome<ReplaceAdapterDescriptorResult>, ApplicationError>` |
| application service | `CapabilityDescriptorCommandService::replace_adapter_descriptor(CapabilityOperationContext, ReplaceAdapterDescriptorCommand) -> Result<CapabilityCommandOutcome<ReplaceAdapterDescriptorResult>, ApplicationError>` |
| exact schema | §7.4 request / result,including exact `registry_entry_ref`;shared §6.2 |
| Step 9 flow | `command_replace_adapter_descriptor_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `current_descriptor_ref` | caller exact current `Accepted / Unresolved` descriptor;missing -> `MissingRequiredField`;not current / stale / Draft / terminal -> `PolicyRejected` | loaded descriptor + `replace_with(...)` |
| `registry_entry_ref` | caller exact owner entry;missing -> `MissingRequiredField`;stored id mismatch -> `PolicyRejected` | replacement factory + registry rebind |
| `source_ref_id` / `descriptor_kind` | caller existing source + closed kind;either missing / mismatch -> `MissingRequiredField` / `InvalidField` | replacement `draft_for_entry` + `accept(...)` |
| `connection_boundary_summary` | caller body-free replacement summary;missing -> `MissingRequiredField`;forbidden shape -> `BodyForbidden` | new descriptor field / scanner marker |
| `supporting_document_ref_id` | optional local document ref;Some must be resolved and unbound-to-other-chain or bound to current | `bind_supported_descriptor` or `rebind_supported_descriptor` |
| `replacement_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | old / new descriptor and registry records |

| construction / effect | exact rule |
|---|---|
| object calls | require old current state exactly`Accepted / Unresolved`;build and accept a distinct replacement first;optional same document calls `rebind_supported_descriptor(current,replacement,...)`,new unbound document calls `bind_supported_descriptor`;only after every guard passes call current `replace_with(...)` and registry `bind_descriptor(...)`;the latter atomically binds replacement and moves / keeps registry `VisibilityPending`,so no second lifecycle call / record is allowed |
| Step 7 ports | `AdapterDescriptorRepository::{get_with_version, find_current_by_registry_entry, save}`;`CapabilityRegistryRepository::get_with_version`;`CapabilityIdentityRepository::get_with_version`for registry-owner source-chain validation;external-reference / state repositories;descriptor + registry change append;trace repository;common write ports |
| stable rejection | unresolved / invalid / forbidden replacement prerequisite、registry / document owner mismatch、current terminal or replacement id collision -> `PolicyRejected` / `BodyForbidden`;all reject paths leave current descriptor and registry unchanged |
| idempotency / audit | required;digest covers exact current / registry refs and all replacement fields。Acceptance savesold + new + registry + optional document,appends old `Replaced`,new `Created` / `Accepted` and registry records,and returns separate trace revisions for each changed subject;duplicate creates no second replacement id |

#### 7.13.3 `RecordDescriptorRiskConstraintSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/record-descriptor-risk-constraint-summary`;受信descriptor-review participant |
| API handler | `CapabilityCommandHandlers::record_descriptor_risk_constraint_summary(CapabilityCommandRequest<RecordDescriptorRiskConstraintSummaryCommand>) -> Result<CapabilityCommandOutcome<RecordDescriptorRiskConstraintSummaryResult>, ApplicationError>` |
| application service | `CapabilityDescriptorCommandService::record_descriptor_risk_constraint_summary(CapabilityOperationContext, RecordDescriptorRiskConstraintSummaryCommand) -> Result<CapabilityCommandOutcome<RecordDescriptorRiskConstraintSummaryResult>, ApplicationError>` |
| exact schema | §7.4 request / result;shared §6.2 |
| Step 9 flow | `command_record_descriptor_risk_constraint_summary_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `descriptor_ref` | caller exact current `Accepted / Unresolved` descriptor;missing -> `MissingRequiredField`;not found / stale / Draft / terminal -> `PolicyRejected` | loaded `AdapterDescriptor` |
| `review_fact_ref` | caller exact recorded review;missing -> `MissingRequiredField`;not current / not separated -> `PolicyRejected` | `DescriptorRiskConstraintSummary::derive` review input |
| `risk_level` | caller closed coarse classification;missing / invalid -> `MissingRequiredField` / `InvalidField` | summary factory field |
| `constraint_summary` | caller body-free constraints;missing -> `MissingRequiredField`;policy / secret / provider body -> `BodyForbidden` | summary factory field |
| `change_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | descriptor attach record |

| construction / effect | exact rule |
|---|---|
| object calls | load review,derive owner identity,load current registry by identity and verify descriptor chain;derive scanner-owned marker;call `DescriptorRiskConstraintSummary::derive`;known `Low / Medium / High / Critical` forms`Available`,Unknown forms`Partial`,ForbiddenBody rejects;supersede prior current `Available / Partial / Unavailable` summary when present;call descriptor `attach_risk_summary(...)` without changing descriptor lifecycle |
| Step 7 ports | adapter / registry / review repositories;`DescriptorSafeSummaryRepository::{find_current_risk_summary, save_risk_summary}`;descriptor change append;trace repository;common write ports |
| stable rejection | descriptor-review chain mismatch、non-recorded / non-separated review、forbidden marker、invalid low-risk representation or current-summary race -> `PolicyRejected` / `BodyForbidden` |
| idempotency / audit | required;digest covers all fields。Acceptance saves new / optional superseded summary and descriptor,appends one `RiskSummaryChanged` record and descriptor trace;result marker is application-derived;duplicate creates no second summary |

#### 7.13.4 `AttachDescriptorSecretReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/attach-descriptor-secret-reference`;受信secret-reference integration / descriptor participant,never secret-value caller |
| API handler | `CapabilityCommandHandlers::attach_descriptor_secret_reference(CapabilityCommandRequest<AttachDescriptorSecretReferenceCommand>) -> Result<CapabilityCommandOutcome<AttachDescriptorSecretReferenceResult>, ApplicationError>` |
| application service | `CapabilityDescriptorCommandService::attach_descriptor_secret_reference(CapabilityOperationContext, AttachDescriptorSecretReferenceCommand) -> Result<CapabilityCommandOutcome<AttachDescriptorSecretReferenceResult>, ApplicationError>` |
| exact schema | §7.4 request / result;§7.1 reference rules;shared §6.2 |
| Step 9 flow | `command_attach_descriptor_secret_reference_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `descriptor_ref` | caller exact current `Accepted / Unresolved` descriptor;missing -> `MissingRequiredField`;stale / Draft / terminal -> `PolicyRejected` | loaded descriptor + `attach_secret_ref(...)` |
| `secret_provider_ref` | caller external body-free provider ref;missing -> `MissingRequiredField`;credential / token material -> `BodyForbidden` | `ReferenceCandidate`;`SecretRef::register` |
| `secret_usage_scope` | caller safe usage scope;missing / invalid -> `MissingRequiredField` / `InvalidScope` | resolver + secret ref field |
| `handling_boundary` | caller safe handling summary;missing -> `MissingRequiredField`;secret / ciphertext / key-access material -> `BodyForbidden` | resolver check + `SecretHandlingSafeSummary::create` |
| `change_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | both descriptor change records |

| construction / effect | exact rule |
|---|---|
| object calls | generate secret / state / safe-summary ids,build candidate + canonical digest,call `SecretReferencePort::resolve_secret_reference`,construct canonical state + `SecretRef::register(..., candidate_digest, ...)` + `SecretHandlingSafeSummary::create`,then descriptor `attach_secret_ref(...)`;resolved summary=`Available`,recoverable unresolved / stale / unavailable summary=`Unavailable`,invalid / forbidden rejects |
| history rule | append returned `SecretReferenceChanged` record and a direct `DescriptorChangeRecord::append(..., SafeSummaryChanged, same current state, ...)` in stable id order;one descriptor trace revision covers both refs |
| Step 7 ports | `SecretReferencePort`;external-reference / state repositories;safe-summary repository;adapter repository;descriptor change append;trace repository;common write ports |
| stable rejection | any secret body、Forbidden marker、invalid canonical state、existing incompatible secret relation or descriptor terminal -> `BodyForbidden` / `PolicyRejected` |
| idempotency / audit | required;digest covers all five body-free fields。Acceptance returns local ref / state / summary ids and marker,not secret or provider receipt;duplicate invokes no resolver and appends neither history record again |

#### 7.13.5 `AttachGovernanceSeamRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/attach-governance-seam-relation`;受信capability-governance integration participant;not local approval authority |
| API handler | `CapabilityCommandHandlers::attach_governance_seam_relation(CapabilityCommandRequest<AttachGovernanceSeamRelationCommand>) -> Result<CapabilityCommandOutcome<AttachGovernanceSeamRelationResult>, ApplicationError>` |
| application service | `CapabilityRelationCommandService::attach_governance_seam_relation(CapabilityOperationContext, AttachGovernanceSeamRelationCommand) -> Result<CapabilityCommandOutcome<AttachGovernanceSeamRelationResult>, ApplicationError>` |
| exact schema | §7.1 `GovernanceResultSelection`;§7.5 request / result;shared §6.2 |
| Step 9 flow | `command_attach_governance_seam_relation_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` / `registry_entry_ref` | caller exact active identity + non-retired same-owner entry;either missing / mismatch -> `MissingRequiredField` / `PolicyRejected` | seam capability endpoint / chain guard |
| `review_fact_ref` | caller exact recorded separated review;missing / wrong identity -> `MissingRequiredField` / `PolicyRejected` | separation guard only;never seam endpoint |
| `governance_result.Existing.governance_result_ref_id` | caller local ref;missing / not found -> `MissingRequiredField` / `PolicyRejected` | loaded ref + re-resolution observation |
| `governance_result.Register.*` | caller kind / source / safe scope;any missing -> `MissingRequiredField`;approval / Policy body -> `BodyForbidden` | candidate,governance resolver,ref / state factories |
| `change_reason` | caller body-free relation reason;missing / empty -> `MissingRequiredField` / `InvalidField` | seam transition record |

| construction / effect | exact rule |
|---|---|
| object calls | reject current seam duplicate;for Register derive canonical candidate digest,resolve and call`GovernanceResultRef::register(..., candidate_digest, ...)`;re-observe Existing and save changed ref digest / canonical state when needed;call `GovernanceSeamRelation::create`;resolved reference calls `activate(...)`,recoverable non-resolved calls `mark_unresolved(...)`;forbidden candidate is rejected without seam truth |
| Step 7 ports | identity / registry / review / seam repositories;`GovernanceResultReferencePort`;external-reference + state repositories;governance seam change append;trace repository;common write ports |
| stable rejection | owner / separation mismatch、duplicate current seam、invalid governance ref / summary or resolver body boundary -> `PolicyRejected` / `BodyForbidden`;recoverable unresolved may return accepted `Unresolved` |
| idempotency / audit | required;digest coversselection variant + all command fields。Acceptance records body-free ref / canonical state as applicable,one seam change / trace and stale materials;no approval / vote / policy truth is created;duplicate does not re-resolve |

#### 7.13.6 `ReplaceGovernanceSeamRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/replace-governance-seam-relation`;受信capability-governance integration participant |
| API handler | `CapabilityCommandHandlers::replace_governance_seam_relation(CapabilityCommandRequest<ReplaceGovernanceSeamRelationCommand>) -> Result<CapabilityCommandOutcome<ReplaceGovernanceSeamRelationResult>, ApplicationError>` |
| application service | `CapabilityRelationCommandService::replace_governance_seam_relation(CapabilityOperationContext, ReplaceGovernanceSeamRelationCommand) -> Result<CapabilityCommandOutcome<ReplaceGovernanceSeamRelationResult>, ApplicationError>` |
| exact schema | §7.1 selection;§7.5 request / result;shared §6.2 |
| Step 9 flow | `command_replace_governance_seam_relation_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `current_seam_ref` | caller exact current `Active / Unresolved / Expired` seam;missing -> `MissingRequiredField`;not found / stale / Pending / terminal -> `PolicyRejected` | loaded seam + `replace_with(...)` |
| `replacement_governance_result` | Existing or Register body-free selection;missing variant fields -> `MissingRequiredField`;external body -> `BodyForbidden` | replacement ref / state + new seam factory |
| `replacement_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | new activation and old replacement records |

| construction / effect | exact rule |
|---|---|
| object calls | load identity by current seam owner;derive / persist canonical candidate digest for Register or validate persisted digest for Existing;resolve / re-observe replacement ref;build a distinct seam and require `activate(...)` success before calling old `replace_with(...)`;a non-active replacement is rejected and old seam remains current |
| Step 7 ports | seam + identity repositories;governance resolver;external-reference + state repositories;seam change append;trace repository;common write ports |
| stable rejection | unresolved / expired / forbidden replacement、same endpoint / id collision、current not replaceable or identity mismatch -> `PolicyRejected` / `BodyForbidden` |
| idempotency / audit | required;digest covers current ref + full replacement selection + reason。Acceptance appends new `Attached` and old `Replaced` records with separate seam-subject trace revisions;duplicate creates no second relation |

#### 7.13.7 `ExpireGovernanceSeamRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/expire-governance-seam-relation`;受信capability-governance maintenance participant |
| API handler | `CapabilityCommandHandlers::expire_governance_seam_relation(CapabilityCommandRequest<ExpireGovernanceSeamRelationCommand>) -> Result<CapabilityCommandOutcome<ExpireGovernanceSeamRelationResult>, ApplicationError>` |
| application service | `CapabilityRelationCommandService::expire_governance_seam_relation(CapabilityOperationContext, ExpireGovernanceSeamRelationCommand) -> Result<CapabilityCommandOutcome<ExpireGovernanceSeamRelationResult>, ApplicationError>` |
| exact schema | §7.5 request / result;shared §6.2 |
| Step 9 flow | `command_expire_governance_seam_relation_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `seam_relation_ref` | caller exact current active seam;missing -> `MissingRequiredField`;not active / stale -> `PolicyRejected` | loaded relation |
| `expiry_reason` | caller safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | `GovernanceSeamRelation::mark_expired(...)` |

| construction / effect | exact rule |
|---|---|
| object / ports | call `mark_expired(...)`;save through seam repository,append seam change + trace through Step 7 and use common write ports |
| stable rejection | pending / unresolved / forbidden / already expired state、stale ref or implicit governance truth mutation -> `PolicyRejected` |
| idempotency / audit | required;digest covers ref + reason。Acceptance changes seam only,marks derived materials stale and forms declared outbound candidate;duplicate does not repeat expiry |

#### 7.13.8 `AttachCapabilityMethodRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/attach-capability-method-relation`;受信method-library integration / capability-maintenance participant |
| API handler | `CapabilityCommandHandlers::attach_capability_method_relation(CapabilityCommandRequest<AttachCapabilityMethodRelationCommand>) -> Result<CapabilityCommandOutcome<AttachCapabilityMethodRelationResult>, ApplicationError>` |
| application service | `CapabilityRelationCommandService::attach_capability_method_relation(CapabilityOperationContext, AttachCapabilityMethodRelationCommand) -> Result<CapabilityCommandOutcome<AttachCapabilityMethodRelationResult>, ApplicationError>` |
| exact schema | §7.1 `MethodAssetSelection`;§7.5 request / result;shared §6.2 |
| Step 9 flow | `command_attach_capability_method_relation_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `identity_ref` | caller exact active identity;missing -> `MissingRequiredField`;not active / stale -> `PolicyRejected` | relation capability endpoint |
| `method_asset.Existing.method_asset_ref_id` | caller local typed ref;missing / not found -> `MissingRequiredField` / `PolicyRejected` | loaded `MethodAssetRef` + state |
| `method_asset.Register.*` | caller body-free asset kind + locator;missing -> `MissingRequiredField`;method body / code / definition -> `BodyForbidden` | candidate,resolver,ref / state factories |
| `relation_scope` | caller body-free applicability scope;missing / invalid -> `MissingRequiredField` / `InvalidScope` | relation factory field |
| `change_reason` | caller safe relation reason;missing / empty -> `MissingRequiredField` / `InvalidField` | relation transition record |

| construction / effect | exact rule |
|---|---|
| object calls | reject current relation duplicate;Register derives canonical candidate digest, calls resolver, constructs`MethodAssetRef::register(..., candidate_digest, ...)`and saves ref/state;Existing loads typed ref/state and validates persisted digest;call `CapabilityMethodBodyFreeRelation::create`;resolved state calls `activate(...)`,recoverable non-resolved calls `mark_unresolved(...)`;forbidden candidate rejects |
| Step 7 ports | identity / method-relation repositories;`MethodAssetReferencePort`;external-reference + state repositories;method-relation change append;trace repository;common write ports |
| stable rejection | duplicate current relation、owner / kind / scope mismatch、invalid / forbidden method candidate -> `PolicyRejected` / `BodyForbidden`;recoverable unresolved may return accepted `Unresolved` |
| idempotency / audit | required;digest covers selection variant + identity + scope + reason。Acceptance returns local method ref / canonical state / relation,one relation change / trace and no method body;duplicate does not call resolver |

#### 7.13.9 `RemoveCapabilityMethodRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/remove-capability-method-relation`;受信method-relation maintenance participant |
| API handler | `CapabilityCommandHandlers::remove_capability_method_relation(CapabilityCommandRequest<RemoveCapabilityMethodRelationCommand>) -> Result<CapabilityCommandOutcome<RemoveCapabilityMethodRelationResult>, ApplicationError>` |
| application service | `CapabilityRelationCommandService::remove_capability_method_relation(CapabilityOperationContext, RemoveCapabilityMethodRelationCommand) -> Result<CapabilityCommandOutcome<RemoveCapabilityMethodRelationResult>, ApplicationError>` |
| exact schema | §7.5 request / result;shared §6.2 |
| Step 9 flow | `command_remove_capability_method_relation_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `method_relation_ref` | caller exact current `Active / Unresolved` relation;missing -> `MissingRequiredField`;not found / stale / Pending / Stale / terminal -> `PolicyRejected` | loaded relation + current-by-identity parity |
| `removal_reason` | caller safe removal reason;missing / empty -> `MissingRequiredField` / `InvalidField` | mapped `ChangeReason` for `remove(...)` |

| construction / effect | exact rule |
|---|---|
| object / ports | exact-load relation,require `CapabilityMethodRelationRepository::find_current_by_identity` returns the same id and state is`Active / Unresolved`,then call relation `remove(...)`;save through method-relation repository,append method change + trace through Step 7 and use common write ports |
| stable rejection | already removed、illegal state、stale ref or request to delete method asset -> `PolicyRejected` / `InvalidField` |
| idempotency / audit | required;digest covers ref + reason。Acceptance makes relation terminal but does not delete method ref / body,returns one `Removed` record / trace and stale materials;duplicate does not remove again |

### 7.14 Exposure, trace / impact, and reference independent protocol cards

本组继续使用§7.12 common write ports。Exposure command允许在一个本地UoW改写exposure、visibility和registry三个既有owner,但每个owner仍分别保存、分别生成history / expected version;reference command只改body-free ref / canonical state,不伪造core truth change record。

#### 7.14.1 `EstablishFormalExposureBoundary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/establish-formal-exposure-boundary`;受信server-side exposure-maintenance participant |
| API handler | `CapabilityCommandHandlers::establish_formal_exposure_boundary(CapabilityCommandRequest<EstablishFormalExposureBoundaryCommand>) -> Result<CapabilityCommandOutcome<EstablishFormalExposureBoundaryResult>, ApplicationError>` |
| application service | `CapabilityExposureCommandService::establish_formal_exposure_boundary(CapabilityOperationContext, EstablishFormalExposureBoundaryCommand) -> Result<CapabilityCommandOutcome<EstablishFormalExposureBoundaryResult>, ApplicationError>` |
| exact schema | §7.6 request / result;shared §6.2 |
| Step 9 flow | `command_establish_formal_exposure_boundary_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `registry_entry_ref` | caller exact non-retired entry;missing -> `MissingRequiredField`;not evaluable / stale -> `PolicyRejected` | exposure owner + registry lifecycle effect |
| `descriptor_ref` | caller exact descriptor for same entry;missing -> `MissingRequiredField`;wrong owner / terminal -> `PolicyRejected` | exposure prerequisite snapshot |
| `governance_seam_ref` | caller exact seam for registry identity;missing -> `MissingRequiredField`;wrong owner / forbidden -> `PolicyRejected` | exposure prerequisite snapshot |
| `method_relation_ref` | caller optional exact relation;Some must match identity / declared scope;missing when policy requires -> `PolicyRejected` | optional exposure prerequisite snapshot |
| `applicability_scope` | caller non-empty stable ordered `FormalApplicabilityScope`;empty / duplicate -> `InvalidScope`;每个RuntimeTools / SDK member必须有registered current ref + canonical state,Ecosystem member保持typed body-free context | visibility factory field；membership只按exact typed equality |
| `basis_summary` | caller body-free prerequisite summary;missing -> `MissingRequiredField`;consumer / runtime / listing basis -> `BodyForbidden` | visibility policy input only |
| `change_reason` | caller safe establishment reason;missing / empty -> `MissingRequiredField` / `InvalidField` | exposure + registry records |

| construction / effect | exact rule |
|---|---|
| object calls | load registry-linked current identity、all exact local truths / prerequisite canonical states and every typed scope member;verify active identity、owner chain、scope membership sources and no current exposure,call `FormalExposureBoundary::draft`。`FormalExposurePolicy::prerequisites_are_complete(...)`为false时call`mark_pending(...)`;true时call`accept(...,identity,...)`。Visibility `derive(...)`接收完整prerequisite / scope / basis且内部由policy选target；只有derived `Visible`调用exposure `activate(...)`。Activation后必须以final exposure再次`visibility.reevaluate(...)`,只持久化final visibility,使`source_exposure_version`对称final exposure version |
| registry effect | exposure=`Active` + visibility=`Visible` -> target `FormalVisible`;all other accepted non-retired combinations -> target `VisibilityPending`。只有loaded registry state与target不同才调用`transition_lifecycle(...)`、save并形成record / trace / capture；same-state no-op且caller basis不能直接选target |
| Step 7 ports | identity / registry / descriptor / seam / method / exposure / visibility repositories;external-reference + state repositories;exposure + registry change append;trace repository;common write ports |
| stable rejection | owner-chain mismatch、duplicate current exposure、invalid / forbidden prerequisite、required method missing or illegal registry transition -> `PolicyRejected` / `BodyForbidden`;recoverable incompleteness returns actual `Pending`,not fake visibility |
| idempotency / audit | required;digest covers all seven fields。Acceptance saves exposure + visibility + registry in one UoW,returns actual three states,all exposure / registry records and one trace revision per changed subject;duplicate does not derive a second visibility id |

#### 7.14.2 `UpdateFormalVisibilityApplicability`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/update-formal-visibility-applicability`;受信server-side exposure-maintenance participant |
| API handler | `CapabilityCommandHandlers::update_formal_visibility_applicability(CapabilityCommandRequest<UpdateFormalVisibilityApplicabilityCommand>) -> Result<CapabilityCommandOutcome<UpdateFormalVisibilityApplicabilityResult>, ApplicationError>` |
| application service | `CapabilityExposureCommandService::update_formal_visibility_applicability(CapabilityOperationContext, UpdateFormalVisibilityApplicabilityCommand) -> Result<CapabilityCommandOutcome<UpdateFormalVisibilityApplicabilityResult>, ApplicationError>` |
| exact schema | §7.1 `FormalVisibilityUpdateIntent`;§7.6 request / result;shared §6.2 |
| Step 9 flow | `command_update_formal_visibility_applicability_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `exposure_ref` / `registry_entry_ref` | caller exact current pair;either missing -> `MissingRequiredField`;stored owner mismatch / stale -> `PolicyRejected` | loaded exposure,visibility and registry |
| `intent.Reevaluate.applicability_scope` / `basis_summary` | caller non-empty stable typed scope + body-free basis;empty / duplicate / unregistered scope member -> `InvalidScope / PolicyRejected`;forbidden authority source -> `BodyForbidden` | policy-only derive + visibility `reevaluate(...)`;no caller target enum |
| `intent.MarkPending.pending_reason` | caller typed safe pending reason;missing -> `MissingRequiredField`;invalid empty reason -> `InvalidField` | visibility `mark_pending(...)`;direct `VisibilityApplicabilityChanged` record reason via `to_change_reason()` |
| `change_reason` | caller safe operation reason;missing / empty -> `MissingRequiredField` / `InvalidField` | actual exposure lifecycle / registry records；Reevaluate direct applicability record也使用此reason |

| construction / effect | exact rule |
|---|---|
| reevaluate | requireloaded visibility same exposure、non-retired且`source_exposure_version == pre-mutation exposure.version`;reload registry-linked identity、descriptor / seam / optional method、their canonical states and every typed scope member。Complete Pending / Unavailable first calls exposure `accept(...,identity,...)`;incomplete Accepted / Active / Suspended first calls`mark_unavailable(...)`;other normalized state stays。Then visibility `reevaluate(...)`internally derives target throughpolicy；only`Visible + Accepted / Suspended`calls`activate(...)`,followed byfinal `visibility.reevaluate(...)`。Only final source-version-symmetric revision is saved |
| mark pending | never forces a target enum;draft / unavailable exposure calls `mark_pending(...)`,already pending / accepted / suspended retains its valid lifecycle,active exposure first calls `mark_unavailable(...)`;visibility always calls `mark_pending(...)` |
| history / registry | always append direct `ExposureChangeKind::VisibilityApplicabilityChanged` record with current exposure state before / after equal,plus any real exposure state record。Reevaluate direct reason=`change_reason`;MarkPending direct reason=`pending_reason.to_change_reason()`。Active + Visible -> registry target `FormalVisible`,otherwise non-retired target `VisibilityPending`。Only actual registry delta is saved / recorded / traced / captured；same-state contributes no registry effect |
| Step 7 ports | identity / exposure / visibility / registry / prerequisite repositories;external-reference + state repositories;exposure + registry change append;trace repository;common write ports |
| stable rejection | missing current visibility、retired exposure、owner mismatch、invalid state-intent combination、forbidden basis or policy failure -> `PolicyRejected` / `BodyForbidden` |
| idempotency / audit | required;digest covers exact pair + intent variant fields + reason。Acceptance returns actual exposure / visibility / registry states and complete ordered records;duplicate does not reevaluate current truth |

#### 7.14.3 `SuspendFormalExposureBoundary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/suspend-formal-exposure-boundary`;受信server-side exposure-maintenance participant |
| API handler | `CapabilityCommandHandlers::suspend_formal_exposure_boundary(CapabilityCommandRequest<SuspendFormalExposureBoundaryCommand>) -> Result<CapabilityCommandOutcome<SuspendFormalExposureBoundaryResult>, ApplicationError>` |
| application service | `CapabilityExposureCommandService::suspend_formal_exposure_boundary(CapabilityOperationContext, SuspendFormalExposureBoundaryCommand) -> Result<CapabilityCommandOutcome<SuspendFormalExposureBoundaryResult>, ApplicationError>` |
| exact schema | §7.6 request / result;shared §6.2 |
| Step 9 flow | `command_suspend_formal_exposure_boundary_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `exposure_ref` / `registry_entry_ref` | caller exact active exposure + owner entry;either missing -> `MissingRequiredField`;owner / version mismatch -> `PolicyRejected` | exposure / visibility / registry loaded tuple |
| `suspension_reason` | caller safe suspension reason;missing / empty -> `MissingRequiredField` / `InvalidField` | exposure suspend,visibility unavailable and registry pending reason |

| construction / effect | exact rule |
|---|---|
| object calls | require current visibility fact is`Visible`,same exposure and`source_exposure_version == pre-suspend exposure.version`;then call exposure `suspend(...)` and visibility `mark_unavailable(...,final exposure.version,...)`;only when non-retired registry is not already`VisibilityPending`call`transition_lifecycle(...)`。Same-state registry is not saved and forms no record / trace / capture；no consumer / runtime signal may trigger this route |
| Step 7 ports | `FormalExposureRepository::{get_with_version, save}`;`FormalVisibilityRepository::{find_current_by_exposure, save}`;registry repository;exposure + registry change append;trace repository;common write ports |
| stable rejection | non-active / retired exposure、missing / non-Visible / stale-source visibility、registry owner mismatch / retired inconsistency or consumer-originated suspension intent -> `PolicyRejected` / consistency rejection |
| idempotency / audit | required;digest covers exact pair + reason。Acceptance returns suspended exposure,unavailable visibility and actual registry state;one exposure suspension record plus actual registry record / separate traces;duplicate does not suspend again |

#### 7.14.4 `RetireFormalExposureBoundary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/retire-formal-exposure-boundary`;受信server-side exposure-maintenance participant |
| API handler | `CapabilityCommandHandlers::retire_formal_exposure_boundary(CapabilityCommandRequest<RetireFormalExposureBoundaryCommand>) -> Result<CapabilityCommandOutcome<RetireFormalExposureBoundaryResult>, ApplicationError>` |
| application service | `CapabilityExposureCommandService::retire_formal_exposure_boundary(CapabilityOperationContext, RetireFormalExposureBoundaryCommand) -> Result<CapabilityCommandOutcome<RetireFormalExposureBoundaryResult>, ApplicationError>` |
| exact schema | §7.6 request / result;shared §6.2 |
| Step 9 flow | `command_retire_formal_exposure_boundary_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `exposure_ref` / `registry_entry_ref` | caller exact non-retired exposure + owner entry;either missing -> `MissingRequiredField`;owner / version mismatch -> `PolicyRejected` | exposure / visibility / registry loaded tuple |
| `retirement_reason` | caller typed safe reason;missing / empty -> `MissingRequiredField` / `InvalidField` | visibility `retire(...)`;exposure / registry generic reason through `to_change_reason()` |

| construction / effect | exact rule |
|---|---|
| object calls | require current visibility isnon-retired、same exposure and`source_exposure_version == pre-retire exposure.version`;call exposure `retire(...)` with bridged reason and visibility `retire(...,final exposure.version,...)` with original typed reason;non-retired registry changes to`VisibilityPending`only when its current state differs,already pending / retired registry is not saved and forms no record / trace / capture;registry truth is never implicitly retired here |
| Step 7 ports | exposure / visibility / registry repositories;exposure + registry change append;trace repository;common write ports |
| stable rejection | exposure already retired / transaction-local Draft、missing / retired / stale-source visibility、owner mismatch / stale ref or request to delete registry / identity -> `PolicyRejected` / `InvalidField` / consistency rejection |
| idempotency / audit | required;digest covers exact pair + typed reason。Acceptance returns retired exposure / visibility and actual registry state,appends exposure retirement and any registry record with separate traces;duplicate does not recreate historical facts |

#### 7.14.5 `RecordCapabilityChangeImpactFact`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/record-capability-change-impact-fact`;受信impact-analysis participant / system actor |
| API handler | `CapabilityCommandHandlers::record_capability_change_impact_fact(CapabilityCommandRequest<RecordCapabilityChangeImpactFactCommand>) -> Result<CapabilityCommandOutcome<RecordCapabilityChangeImpactFactResult>, ApplicationError>` |
| application service | `CapabilityTraceImpactCommandService::record_capability_change_impact_fact(CapabilityOperationContext, RecordCapabilityChangeImpactFactCommand) -> Result<CapabilityCommandOutcome<RecordCapabilityChangeImpactFactResult>, ApplicationError>` |
| exact schema | §7.7 request / result;shared §6.2 |
| Step 9 flow | `command_record_capability_change_impact_fact_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `traceability_ref` | caller exact trace revision;missing -> `MissingRequiredField`;not current / not found -> `PolicyRejected` | `CapabilityChangeImpactFact::derive_from_traceability` source |
| `impact_scope` | caller body-free impact scope;missing / invalid -> `MissingRequiredField` / `InvalidScope` | impact factory field |
| `affected_consumers` | caller non-empty typed refs;missing / empty / duplicates -> `MissingRequiredField` / `InvalidField` | validated `CapabilityConsumerRefSet` |

| construction / effect | exact rule |
|---|---|
| object calls | load exact trace and every consumer reference + canonical state,canonical-sort / deduplicate only after rejecting duplicate input semantics,ensure no existing impact for trace,then call `CapabilityChangeImpactFact::derive_from_traceability(...)` |
| Step 7 ports | `CapabilityTraceabilityRepository::get_current_with_version`;external-reference + state repositories;`CapabilityImpactRepository::{find_impact_by_traceability, save_impact}`;common write ports |
| stable rejection | duplicate impact for trace、consumer missing / wrong kind / invalid state、empty scope or trace mismatch -> `PolicyRejected` / `InvalidField` |
| idempotency / audit | required;digest covers exact trace + scope + canonical consumer set。Acceptance sets `effect.impact_ref=Some`,forms `CapabilityChangeImpactIdentified`,but appends no fabricated change record / trace revision;duplicate returns original impact ref |

#### 7.14.6 `RecordTraceabilityHandoffSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/record-traceability-handoff-summary`;受信audit-handoff participant / system actor |
| API handler | `CapabilityCommandHandlers::record_traceability_handoff_summary(CapabilityCommandRequest<RecordTraceabilityHandoffSummaryCommand>) -> Result<CapabilityCommandOutcome<RecordTraceabilityHandoffSummaryResult>, ApplicationError>` |
| application service | `CapabilityTraceImpactCommandService::record_traceability_handoff_summary(CapabilityOperationContext, RecordTraceabilityHandoffSummaryCommand) -> Result<CapabilityCommandOutcome<RecordTraceabilityHandoffSummaryResult>, ApplicationError>` |
| exact schema | §7.1 handoff scope input;§7.7 request / result;shared §6.2 |
| Step 9 flow | `command_record_traceability_handoff_summary_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `traceability_ref` | caller exact current trace revision;missing -> `MissingRequiredField`;stale / superseded -> `PolicyRejected` | next traceability revision |
| `handoff_scope` | caller validated body-free scope;missing / invalid -> `MissingRequiredField` / `InvalidScope` | application `CapabilityAuditHandoffScope` mapper |
| `audit_ref_id` | optional local audit ref;Some missing / non-resolved -> `PolicyRejected`;None is explicit local-only pending summary | optional exact audit ref/state pair passed to`request_handoff(...)`and handoff port target |
| `trace_reason` | caller safe trace reason;missing / empty -> `MissingRequiredField` / `InvalidField` | next revision trace reason |

| construction / effect | exact rule |
|---|---|
| local revision | load current trace;Some audit loads exact ref/state,then both branches call`request_handoff(optional_pair,trace_reason,actor,trace_id,now)`exactly once and append exactly one next revision with prior expected version。不得串联`attach_handoff_ref + mark_handoff_pending`。Stored result`handoff_requested`is true only for Some |
| external call | First save the accepted-local-result + pending revision + idempotency completion and commit。Some then invokes`ObservabilityAuditHandoffPort::handoff_traceability`post-commit；failure cannot roll back or rewrite the accepted response and does not claim receipt / evidence alias / acceptance fact。None never calls the Port；same-key duplicate only replays stored result and never repeats handoff；explicit retry uses current trace ref plus a new idempotency key |
| Step 7 ports | trace repository;external-reference + state repositories;`ObservabilityAuditHandoffPort`;common write ports |
| stable rejection | stale trace、wrong / unresolved audit ref、invalid scope、forbidden audit body or illegal trace state -> `PolicyRejected` / `BodyForbidden` |
| idempotency / audit | required;digest covers trace + scope + optional audit + reason。Acceptance forms one exact next trace revision and returns it in `effect.traceability_refs`;no change record is invented;external outcome handling remains Step 9 / 12 recovery surface |

#### 7.14.7 `RecordReferenceResolutionState`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/record-reference-resolution-state`;受信reference-maintenance integration / system participant |
| API handler | `CapabilityCommandHandlers::record_reference_resolution_state(CapabilityCommandRequest<RecordReferenceResolutionStateCommand>) -> Result<CapabilityCommandOutcome<RecordReferenceResolutionStateResult>, ApplicationError>` |
| application service | `CapabilityReferenceCommandService::record_reference_resolution_state(CapabilityOperationContext, RecordReferenceResolutionStateCommand) -> Result<CapabilityCommandOutcome<RecordReferenceResolutionStateResult>, ApplicationError>` |
| exact schema | §7.1 `ReferenceResolutionIntent`;§7.8 request / result;shared §6.2 |
| Step 9 flow | `command_record_reference_resolution_state_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `reference_subject` | caller registered typed subject;missing / not found -> `MissingRequiredField` / `PolicyRejected` | loaded external ref + current canonical state |
| `reference_kind` | caller closed kind;missing / subject variant mismatch -> `MissingRequiredField` / `InvalidField` | `ReferenceResolutionPolicy::validate_subject_kind` |
| `intent.Transition.target / reason` | caller closed value + safe reason;either missing / illegal transition -> `MissingRequiredField` / `PolicyRejected` | state `transition(...)` |
| `intent.MarkForbidden.reason` | caller typed redacted forbidden reason;missing -> `MissingRequiredField` | state `mark_forbidden(...)`;no matched body retained |

| construction / effect | exact rule |
|---|---|
| object / ports | load reference and `ReferenceResolutionStateRepository::find_current_by_subject`,verify ref state-id parity,apply policy + exact member,save with loaded expected version。On any actual state revision,different value or reason-only,collect exact affected candidates through`list_affected_by_reference(subject)`and`list_material_refs(MutableAffectedByReference(subject))`,typed-union and mark/capture/save each eligible material in the same UoW；external-reference repository remains read-only |
| stable rejection | unknown subject、kind mismatch、terminal invalid / forbidden candidate、illegal per-kind transition or body-bearing reason -> `PolicyRejected` / `InvalidField` / `BodyForbidden` |
| idempotency / audit | required;digest covers subject + kind + intent variant。Acceptance returns previous / actual current value,sets changed-reference + reference-state effect refs,marks only exact reference-indexed non-stale materials stale from final state reason and forms`ReferenceResolutionChanged`;change / trace refs remain empty。For a non-terminal candidate,same value + changed validated safe reason is one real state revision；same value + same reason is an exact no-op rejection。Terminal `Invalid / Forbidden` remains rejected；duplicate performs no state/material scan |

#### 7.14.8 `RegisterExternalDocumentReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/register-external-document-reference`;受信external-document integration / reference participant |
| API handler | `CapabilityCommandHandlers::register_external_document_reference(CapabilityCommandRequest<RegisterExternalDocumentReferenceCommand>) -> Result<CapabilityCommandOutcome<RegisterExternalDocumentReferenceResult>, ApplicationError>` |
| application service | `CapabilityReferenceCommandService::register_external_document_reference(CapabilityOperationContext, RegisterExternalDocumentReferenceCommand) -> Result<CapabilityCommandOutcome<RegisterExternalDocumentReferenceResult>, ApplicationError>` |
| exact schema | §7.8 request / result;shared §6.2 |
| Step 9 flow | `command_register_external_document_reference_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `document_kind` | caller closed body-free kind;missing / unsupported -> `MissingRequiredField` / `InvalidField` | candidate + `ExternalDocumentRef::register` |
| `document_locator` | caller body-free locator summary;missing -> `MissingRequiredField`;document / schema / protocol body -> `BodyForbidden` | candidate digest + resolver input + ref field |
| `supported_descriptor_ref` | optional caller exact descriptor;Some missing / terminal / wrong support scope -> `PolicyRejected` | validated descriptor id in document ref factory |

| construction / effect | exact rule |
|---|---|
| object calls | generate document / state ids before resolver,build locator via`ReferenceLocatorSummary::from_external_document(&document_locator)`,construct / validate candidate,guard duplicate digest,load optional descriptor,call`ExternalDocumentReferencePort::resolve_external_document_reference`,construct canonical resolved / unresolved state and`ExternalDocumentRef::register(...)` |
| Step 7 ports | `ExternalDocumentReferencePort`;adapter repository for optional target;external-reference + state repositories;common write ports |
| stable rejection | duplicate candidate under another operation、invalid kind / target、forbidden body or invalid / forbidden resolver observation -> `PolicyRejected` / `BodyForbidden`;recoverable unresolved registration returns explicit non-resolved value |
| idempotency / audit | required;digest covers kind + locator + optional exact descriptor。Acceptance saves ref + state in one UoW,returns changed-reference / state effect refs and no core truth change / trace;duplicate calls no resolver and returns original ids |

#### 7.14.9 `RegisterCapabilityConsumerReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/commands/register-capability-consumer-reference`;受信runtime-tools / SDK server-boundary integration participant |
| API handler | `CapabilityCommandHandlers::register_capability_consumer_reference(CapabilityCommandRequest<RegisterCapabilityConsumerReferenceCommand>) -> Result<CapabilityCommandOutcome<RegisterCapabilityConsumerReferenceResult>, ApplicationError>` |
| application service | `CapabilityReferenceCommandService::register_capability_consumer_reference(CapabilityOperationContext, RegisterCapabilityConsumerReferenceCommand) -> Result<CapabilityCommandOutcome<RegisterCapabilityConsumerReferenceResult>, ApplicationError>` |
| exact schema | §7.1 `CapabilityConsumerRegistrationInput` / `CapabilityRegisteredConsumerRef`;§7.8 request / result;shared §6.2 |
| Step 9 flow | `command_register_capability_consumer_reference_flow` |

| request field | source / missing handling | Step 6 target |
|---|---|---|
| `registration.RuntimeTools.consumer_kind` | caller closed runtime / tools kind;missing / invalid -> `MissingRequiredField` / `InvalidField` | runtime-tools candidate / ref factory |
| `registration.RuntimeTools.consumer_locator` / `consumer_scope` | caller body-free locator + scope;either missing / invalid -> `MissingRequiredField` / `InvalidScope`;execution payload -> `BodyForbidden` | resolver + `RuntimeToolsConsumerRef::register` |
| `registration.Sdk.sdk_consumer_locator` | caller body-free SDK server-consumer locator;missing -> `MissingRequiredField`;client / package body -> `BodyForbidden` | SDK candidate / resolver / ref factory |
| `registration.Sdk.sdk_surface_summary` / `exposure_scope` | caller safe surface + scope;either missing / invalid -> `MissingRequiredField` / `InvalidScope` | `SdkExposureConsumerRef::register` |

| construction / effect | exact rule |
|---|---|
| object calls | select only by enum variant,generate matching typed ref + state ids；RuntimeTools uses`ReferenceLocatorSummary::from_runtime_tools_consumer(&consumer_locator)`,SDK uses`ReferenceLocatorSummary::from_sdk_consumer(&sdk_consumer_locator)`；then build / validate candidate and duplicate digest,call matching`CapabilityConsumerReferencePort`method,and construct canonical state plus matching typed ref |
| Step 7 ports | `CapabilityConsumerReferencePort::{resolve_runtime_tools_consumer, resolve_sdk_consumer}`;external-reference + state repositories;common write ports |
| stable rejection | variant / field mismatch、duplicate candidate、invalid scope、forbidden execution / SDK client material or invalid / forbidden observation -> `PolicyRejected` / `InvalidField` / `BodyForbidden`;recoverable unresolved remains explicit |
| idempotency / audit | required;digest includes variant tag + all variant fields。Acceptance saves typed ref + state,returns matching union variant and changed-reference / state effects;it grants no invocation authority or SDK publication status;duplicate calls no resolver |

### 7.15 Command protocol family stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 26 independent sections | pass | §7.12~§7.14逐Command固定route、caller、handler、service、schema、字段来源、构造、Port、rejection、幂等 / 审计和唯一Step 9 flow |
| DTO -> Step 6 construction | pass after minimal correction | replacement / exposure补exact registry ref;typed reason补无损bridge;secret safe summary明确双history record |
| Step 7 read / write surface | pass | 26卡只引用现有repository / resolver / UoW / clock / id / stored-result / handoff ports;无需新增Port |
| registry formal-visible authority | pass | registry public commands不能形成`FormalVisible`;仅exposure service在active + visible完整真相下推进 |
| multi-subject effect | pass | descriptor + registry、exposure + registry分别形成subject-scoped trace revision;reference subject / canonical state使用新增typed effect refs |
| idempotency / replay | pass | 26卡全部required;same digest只回放stored surface,不重跑resolver、domain mutation或handoff |
| forbidden-body boundary | pass | governance / method / secret / document / runtime / SDK只接受ref / safe summary;无owner body进入truth / result |
| structure / enum comments | pass | 本批新增`CapabilityCommandEffectSummary`字段及全部DTO字段均有英文`///`;未新增无注释struct / enum / variant / variant field |
| Step 9 handoff | pass | 26个唯一`command_*_flow`名称已固定,Step 9不得合并为generic execute / bulk flow |

## 8. Query Protocol

Query只读取本仓truth、body-free relation / reference、controlled view、derived material、trace / impact或immutable report。所有handler统一接收`CapabilityQueryRequest<T>`,调用`CapabilityOperationContext::from_query`,先经Step 7 `CapabilityReadVisibilityResolverPort`取得single或page-level resolution,再读取repository并映射`CapabilityQueryResponse<T>`或`CapabilityPageResponse<T>`。Query不reserve idempotency、不保存stored result、不打开write UoW、不刷新 / 修复对象、不形成outbound candidate。

### 8.1 Query selector / scope secondary contract

```rust
/// Selects one access-review fact by exact ref or current identity ownership.
pub enum CapabilityReviewFactQuerySelector {
    /// Load one exact access-review fact.
    Exact(
        /// Exact review-fact reference requested by the caller.
        CapabilityAccessReviewFactRef,
    ),
    /// Load the current recorded fact for one identity.
    CurrentByIdentity(
        /// Exact capability identity that owns the current fact.
        CapabilityIdentityRef,
    ),
}

/// Selects registry visibility semantics by entry or identity ownership.
pub enum RegistryVisibilityQuerySelector {
    /// Evaluate one exact registry entry.
    RegistryEntry(
        /// Exact registry entry requested by the caller.
        CapabilityRegistryEntryRef,
    ),
    /// Evaluate the current registry entry for one identity.
    CurrentByIdentity(
        /// Exact capability identity that owns the current entry.
        CapabilityIdentityRef,
    ),
}

/// Selects an adapter descriptor by exact ref or current identity ownership.
pub enum AdapterDescriptorQuerySelector {
    /// Load one exact adapter descriptor.
    Exact(
        /// Exact adapter descriptor requested by the caller.
        AdapterDescriptorRef,
    ),
    /// Load the current descriptor for one identity's current registry entry.
    CurrentByIdentity(
        /// Exact capability identity that owns the descriptor chain.
        CapabilityIdentityRef,
    ),
}

/// Selects a descriptor risk summary by exact summary or current descriptor ownership.
pub enum DescriptorRiskSummaryQuerySelector {
    /// Load one exact risk-summary identity.
    Exact(
        /// Stable local risk-summary identity.
        DescriptorRiskConstraintSummaryId,
    ),
    /// Load the current risk summary attached to one descriptor.
    CurrentByDescriptor(
        /// Exact descriptor that owns the current summary.
        AdapterDescriptorRef,
    ),
}

/// Selects a secret safe summary by descriptor or secret-reference ownership.
pub enum DescriptorSecretSummaryQuerySelector {
    /// Load the current secret safe summary attached through one descriptor.
    CurrentByDescriptor(
        /// Exact descriptor that owns the secret relation.
        AdapterDescriptorRef,
    ),
    /// Load the current safe summary for one local secret reference.
    CurrentBySecretRef(
        /// Stable local secret reference identity.
        SecretRefId,
    ),
}

/// Selects a governance seam by exact relation or identity ownership.
pub enum GovernanceSeamQuerySelector {
    /// Load one exact governance seam relation.
    Exact(
        /// Exact governance seam relation requested by the caller.
        GovernanceSeamRelationRef,
    ),
    /// Load the current seam for one capability identity.
    CurrentByIdentity(
        /// Exact identity that owns the current seam.
        CapabilityIdentityRef,
    ),
}

/// Selects the anchor used to explain access-review and governance separation.
pub enum AccessGovernanceSeparationQuerySelector {
    /// Resolve separation from one exact capability identity.
    Identity(
        /// Exact capability identity requested by the caller.
        CapabilityIdentityRef,
    ),
    /// Resolve separation from one exact access-review fact.
    ReviewFact(
        /// Exact access-review fact requested by the caller.
        CapabilityAccessReviewFactRef,
    ),
}

/// Selects a capability-method relation without ambiguous method-only lookup.
pub enum CapabilityMethodRelationQuerySelector {
    /// Load one exact body-free method relation.
    Exact(
        /// Exact capability-method relation requested by the caller.
        CapabilityMethodRelationRef,
    ),
    /// Load the current relation for one capability identity.
    CurrentByIdentity(
        /// Exact identity that owns the current relation.
        CapabilityIdentityRef,
    ),
    /// Find one relation by an explicit identity and method-asset pair.
    IdentityAndMethodAsset {
        /// Exact capability identity endpoint of the relation.
        identity_ref: CapabilityIdentityRef,
        /// Local method-asset reference endpoint of the relation.
        method_asset_ref_id: MethodAssetRefId,
    },
}

/// Closed relation family used by the paged relation query.
pub enum CapabilityRelationQueryKind {
    /// Governance-result seam relations.
    GovernanceSeam,
    /// Body-free method-library relations.
    MethodRelation,
}

/// Selects a formal exposure by exact, registry, or identity ownership.
pub enum FormalExposureQuerySelector {
    /// Load one exact formal exposure.
    Exact(
        /// Exact formal exposure requested by the caller.
        FormalExposureBoundaryRef,
    ),
    /// Load the current exposure for one registry entry.
    CurrentByRegistryEntry(
        /// Exact registry entry that owns the exposure.
        CapabilityRegistryEntryRef,
    ),
    /// Load the current exposure through one identity's current registry entry.
    CurrentByIdentity(
        /// Exact identity that owns the exposure chain.
        CapabilityIdentityRef,
    ),
}

/// Selects one controlled consumer view by exact ref or exposure-consumer pair.
pub enum ControlledConsumerViewQuerySelector {
    /// Load one exact controlled consumer view.
    Exact(
        /// Exact controlled consumer view requested by the caller.
        ControlledConsumerViewRef,
    ),
    /// Load the current view for an exact exposure and consumer.
    ExposureAndConsumer {
        /// Exact formal exposure represented by the view.
        exposure_ref: FormalExposureBoundaryRef,
        /// Registered consumer boundary that owns the view.
        consumer_ref: CapabilityConsumerRef,
    },
}

/// Explicit exposure scope for a controlled-view page.
pub enum CapabilityConsumerExposureQueryScope {
    /// List every stored view for the declared consumer.
    AllForConsumer,
    /// Restrict the page to explicitly listed formal exposures.
    ExplicitExposures(
        /// Stable duplicate-free exposure refs supplied by the caller.
        Vec<FormalExposureBoundaryRef>,
    ),
}

/// Selects one impact fact by exact ref or source change record.
pub enum CapabilityImpactQuerySelector {
    /// Load one exact impact fact.
    Exact(
        /// Exact impact fact requested by the caller.
        CapabilityChangeImpactFactRef,
    ),
    /// Resolve the current trace and impact for one immutable change record.
    ByChange(
        /// Immutable source change record requested by the caller.
        CapabilityChangeRecordRef,
    ),
}

/// Selects one audit export by exact ref or exact trace-and-scope ownership.
pub enum AuditExportQuerySelector {
    /// Load one exact audit-friendly export summary.
    Exact(
        /// Exact audit export requested by the caller.
        AuditFriendlyExportSummaryRef,
    ),
    /// Load the current export for one exact trace revision and scope.
    TraceabilityAndScope {
        /// Exact traceability revision summarized by the export.
        traceability_ref: CapabilityAccessTraceabilityRecordRef,
        /// Body-free export scope used by the current lookup.
        export_scope: AuditExportScope,
    },
}

/// Selects one reconciliation report or a page for one scope.
pub enum CapabilityReconciliationReportQuerySelector {
    /// Load one exact immutable reconciliation report.
    Exact(
        /// Exact reconciliation report requested by the caller.
        CapabilityReconciliationReportRef,
    ),
    /// List immutable reports for one declared reconciliation scope.
    Scope {
        /// Body-free reconciliation scope used by the report index.
        reconciliation_scope: CapabilityReconciliationScope,
        /// Public page request for the report list.
        page: CapabilityPublicPageRequest,
    },
}
```

selector rules:

- selector enum tag是分支唯一来源;entry / service不得从route、字段presence或ref string重新猜分支。
- exact ref中的version用于exact revision匹配,不是caller-supplied optimistic version;Query不写对象。
- `IdentityAndMethodAsset`显式补identity endpoint,避免method asset关联多个capability时返回任意一条。
- `ExplicitExposures`必须non-empty、stable order、duplicate-free;application验证每项后映射为Step 7 `exposure_ids`。`AllForConsumer`映射empty exposure id vector,只表示该consumer已存view全集。
- reconciliation `Scope`是唯一在single-named Query中返回page的closed分支;response union在§8.8固定,不得只取第一页第一项伪装latest。

### 8.2 Identity / access-review Query schema

```rust
/// Compact current access-review summary embedded in an identity view.
pub struct CapabilityAccessReviewSummaryView {
    /// Exact current access-review fact reference.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Current access-review fact state.
    pub review_state: CapabilityAccessReviewFactState,
    /// Body-free access risk summary.
    pub risk_summary: AccessRiskSummary,
    /// Explicit separation from governance approval.
    pub separation_marker: AccessGovernanceSeparationMarker,
}

/// Public body-free view of one capability identity and source boundary.
pub struct CapabilityIdentityView {
    /// Exact capability identity reference.
    pub identity_ref: CapabilityIdentityRef,
    /// Stable capability business identity key.
    pub identity_key: CapabilityIdentityKey,
    /// Local external capability source reference.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// External capability source family.
    pub source_kind: ExternalCapabilitySourceKind,
    /// Exact canonical source-resolution revision.
    pub source_resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical source-resolution value.
    pub source_resolution_value: ReferenceResolutionValue,
    /// Current capability identity state.
    pub identity_state: CapabilityIdentityState,
    /// Current body-free access-review summary when recorded.
    pub review_summary: Option<CapabilityAccessReviewSummaryView>,
    /// Current identity truth version.
    pub version: Version,
    /// Time when the identity was created.
    pub created_at: Timestamp,
    /// Time when the identity last changed.
    pub updated_at: Timestamp,
}

/// Compact identity item returned by a typed identity search.
pub struct CapabilityIdentitySearchItemView {
    /// Exact capability identity reference.
    pub identity_ref: CapabilityIdentityRef,
    /// Stable capability business identity key.
    pub identity_key: CapabilityIdentityKey,
    /// Local external capability source reference.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Current identity lifecycle state.
    pub identity_state: CapabilityIdentityState,
    /// Current access-review fact reference when recorded.
    pub review_fact_ref: Option<CapabilityAccessReviewFactRef>,
    /// Current identity truth version.
    pub version: Version,
    /// Time when the identity last changed.
    pub updated_at: Timestamp,
}

/// Public body-free view of one capability access-review fact.
pub struct CapabilityAccessReviewFactView {
    /// Exact access-review fact reference.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Exact capability identity reviewed by the fact.
    pub identity_ref: CapabilityIdentityRef,
    /// Body-free context in which the review occurred.
    pub review_context: AccessReviewContext,
    /// Body-free access risk summary.
    pub risk_summary: AccessRiskSummary,
    /// Explicit access-review and governance separation marker.
    pub separation_marker: AccessGovernanceSeparationMarker,
    /// Current review fact state.
    pub review_state: CapabilityAccessReviewFactState,
    /// Trusted actor that recorded the current fact version.
    pub recorded_by: ActorContext,
    /// Current review fact version.
    pub version: Version,
    /// Time when the fact was first recorded.
    pub recorded_at: Timestamp,
    /// Time when the fact last changed.
    pub updated_at: Timestamp,
}

/// Query body for loading one exact capability identity.
pub struct GetCapabilityIdentityQuery {
    /// Exact capability identity requested by the caller.
    pub identity_ref: CapabilityIdentityRef,
}

/// Query body for searching capability identity truth.
pub struct SearchCapabilityIdentitiesQuery {
    /// Exact stable identity key filter when supplied.
    pub identity_key: Option<CapabilityIdentityKey>,
    /// Allowed identity states;an empty vector means all states.
    pub identity_states: Vec<CapabilityIdentityState>,
    /// Exact source reference filter when supplied.
    pub source_ref_id: Option<ExternalCapabilitySourceRefId>,
    /// External source-family filter when supplied.
    pub source_kind: Option<ExternalCapabilitySourceKind>,
    /// Public page request for the identity search.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for loading an access-review fact.
pub struct GetCapabilityAccessReviewFactQuery {
    /// Exact or current-by-identity review selector.
    pub selector: CapabilityReviewFactQuerySelector,
}
```

Identity mapping rules:

| Query | response | repository / resolver mapping | missing / degraded |
|---|---|---|---|
| `GetCapabilityIdentity` | `CapabilityQueryResponse<CapabilityIdentityView>` | resolve `Identity(id)` first;identity exact load,source-ref exact load,current source state,current review optional | visible missing identity -> `body=None`;source / state mismatch -> body-free `Degraded(ReferenceUnresolved / ReferenceUnavailable)`;NotVisible hides id/body |
| `SearchCapabilityIdentities` | `CapabilityPageResponse<CapabilityIdentitySearchItemView>` | map filters to`CapabilityIdentityRepositorySearchScope`;resolve `IdentityCollection` before`search`;map repository page / cursor via§6.4 | visible empty page is normal empty;page resolver NotVisible forces empty / no cursor;repository failure is`ApplicationError` |
| `GetCapabilityAccessReviewFact` | `CapabilityQueryResponse<CapabilityAccessReviewFactView>` | selector maps exact get or`find_current_by_identity`;resolve exact review or identity subject before body load | no current fact -> visible `body=None`;governance body is never a fallback;NotVisible hides selector subject |

Search item只映射`CapabilityIdentity`自身字段,避免为page item隐式反查source / review body。single identity view可显式读取source + canonical state + current review;这些读取缺失时不返回半截body。

### 8.3 Registry Query schema

```rust
/// Public body-free view of one capability registry entry.
pub struct CapabilityRegistryEntryView {
    /// Exact capability registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact capability identity registered by the entry.
    pub identity_ref: CapabilityIdentityRef,
    /// Current registry lifecycle state.
    pub lifecycle_state: RegistryLifecycleState,
    /// Body-free reason for the current lifecycle state.
    pub lifecycle_reason: ChangeReason,
    /// Time when the current lifecycle state became effective.
    pub lifecycle_effective_at: Timestamp,
    /// Body-free visibility basis stored by the registry.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Current accepted descriptor reference when bound.
    pub descriptor_ref: Option<AdapterDescriptorRef>,
    /// Current registry truth version.
    pub version: Version,
    /// Time when the registry entry was created.
    pub created_at: Timestamp,
    /// Time when the registry entry last changed.
    pub updated_at: Timestamp,
}

/// Compact registry item returned by a typed registry listing.
pub struct CapabilityRegistryListItemView {
    /// Exact capability registry entry reference.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Capability identity identifier owned by the entry.
    pub capability_identity_id: CapabilityIdentityId,
    /// Current registry lifecycle state.
    pub lifecycle_state: RegistryLifecycleState,
    /// Body-free registry visibility basis.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Current descriptor reference when bound.
    pub descriptor_ref: Option<AdapterDescriptorRef>,
    /// Current registry truth version.
    pub version: Version,
    /// Time when the registry entry last changed.
    pub updated_at: Timestamp,
}

/// Public explanation of registry visibility without runtime authorization semantics.
pub struct RegistryVisibilitySemanticsView {
    /// Exact capability registry entry being explained.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact capability identity owned by the entry.
    pub identity_ref: CapabilityIdentityRef,
    /// Current registry lifecycle state.
    pub lifecycle_state: RegistryLifecycleState,
    /// Body-free registry visibility basis.
    pub visibility_basis: RegistryVisibilityBasis,
    /// Current formal exposure when one exists.
    pub formal_exposure_ref: Option<FormalExposureBoundaryRef>,
    /// Current formal visibility fact when one exists.
    pub visibility_applicability_id: Option<FormalVisibilityApplicabilityId>,
    /// Policy-derived formal visibility state when one exists.
    pub formal_visibility_state: Option<FormalVisibilityState>,
}

/// Query body for loading one capability registry entry.
pub struct GetCapabilityRegistryEntryQuery {
    /// Exact registry entry requested by the caller.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
}

/// Query body for listing registry truth by typed filters.
pub struct ListCapabilityRegistryEntriesQuery {
    /// Exact identity filter when supplied.
    pub identity_ref: Option<CapabilityIdentityRef>,
    /// Allowed registry lifecycle states;empty means all states.
    pub lifecycle_states: Vec<RegistryLifecycleState>,
    /// Exact body-free visibility-basis filter when supplied.
    pub visibility_basis: Option<RegistryVisibilityBasis>,
    /// Public page request for the registry listing.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for explaining registry visibility semantics.
pub struct GetRegistryVisibilitySemanticsQuery {
    /// Exact registry-entry or current-by-identity selector.
    pub selector: RegistryVisibilityQuerySelector,
}
```

Registry mapping rules:

| Query | response | repository / resolver mapping | missing / degraded |
|---|---|---|---|
| `GetCapabilityRegistryEntry` | `CapabilityQueryResponse<CapabilityRegistryEntryView>` | resolve `RegistryEntry(id)` first;exact entry + identity `find_by_id` | visible missing -> `body=None`;entry / identity mismatch -> `Degraded(Missing)`;no descriptor does not itself degrade truth view |
| `ListCapabilityRegistryEntries` | `CapabilityPageResponse<CapabilityRegistryListItemView>` | validate optional identity ref,build`CapabilityRegistryRepositoryListScope`,resolve `RegistryCollection`,then`list_matching` | empty visible page normal;NotVisible empty/no cursor;does not read directory projection |
| `GetRegistryVisibilitySemantics` | `CapabilityQueryResponse<RegistryVisibilitySemanticsView>` | resolve selected registry / identity subject,load current entry,optional current exposure and current visibility fact | absent exposure / visibility is visible semantics with optional fields;inconsistent owner / state pairs -> body-free degraded;never forms exposure |

Registry truth reads use`NotApplicable` freshness;visibility semantics is a composed direct-truth read and carries exact source versions fromentry / exposure / visibility in the shared surface。Neither query evaluates runtime allowlist、provider availability、search ranking or marketplace listing。

### 8.4 Descriptor / safe-summary Query schema

```rust
/// Public body-free view of one adapter descriptor.
pub struct AdapterDescriptorView {
    /// Exact adapter descriptor reference.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Registry entry identifier described by this descriptor.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// External capability source reference supporting the descriptor.
    pub source_ref_id: ExternalCapabilitySourceRefId,
    /// Closed adapter descriptor family.
    pub descriptor_kind: AdapterDescriptorKind,
    /// Body-free connection boundary summary.
    pub connection_boundary_summary: ConnectionBoundarySummary,
    /// Current risk and constraint summary identity when attached.
    pub risk_summary_id: Option<DescriptorRiskConstraintSummaryId>,
    /// Current secret reference identity when attached.
    pub secret_ref_id: Option<SecretRefId>,
    /// Current adapter descriptor state.
    pub descriptor_state: AdapterDescriptorState,
    /// Current descriptor truth version.
    pub version: Version,
    /// Time when the descriptor was created.
    pub created_at: Timestamp,
    /// Time when the descriptor last changed.
    pub updated_at: Timestamp,
}

/// Public body-free descriptor risk and constraint summary view.
pub struct DescriptorRiskConstraintSummaryView {
    /// Stable local descriptor risk-summary identity.
    pub summary_id: DescriptorRiskConstraintSummaryId,
    /// Adapter descriptor identifier summarized by this view.
    pub adapter_descriptor_id: AdapterDescriptorId,
    /// Coarse descriptor risk classification.
    pub risk_level: DescriptorRiskLevel,
    /// Body-free capability constraint summary.
    pub constraint_summary: CapabilityConstraintSummary,
    /// Derived sensitive-boundary marker.
    pub sensitive_boundary_marker: SensitiveBoundaryMarker,
    /// Current summary availability state.
    pub summary_state: DescriptorRiskConstraintSummaryState,
    /// Current summary version.
    pub version: Version,
    /// Time when the summary was created.
    pub created_at: Timestamp,
    /// Time when the summary last changed.
    pub updated_at: Timestamp,
}

/// Public secret-reference and handling-summary view without secret material.
pub struct DescriptorSecretSafeSummaryView {
    /// Stable local secret reference identity.
    pub secret_ref_id: SecretRefId,
    /// Body-free external secret-provider reference.
    pub secret_provider_ref: ExternalSecretProviderRef,
    /// Body-free secret usage scope.
    pub secret_usage_scope: SecretUsageScopeSummary,
    /// Exact canonical secret-reference resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical secret-reference resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Stable local secret handling-summary identity.
    pub safe_summary_id: SecretHandlingSafeSummaryId,
    /// Body-free secret handling boundary.
    pub handling_boundary: SecretHandlingBoundarySummary,
    /// Consumer exposure safety marker.
    pub exposure_safety_marker: ExposureSafetyMarker,
    /// Current safe-summary state.
    pub safe_summary_state: SecretHandlingSafeSummaryState,
    /// Current safe-summary version.
    pub version: Version,
    /// Time when the safe summary was last refreshed.
    pub refreshed_at: Timestamp,
}

/// Query body for loading an adapter descriptor.
pub struct GetAdapterDescriptorQuery {
    /// Exact or current-by-identity descriptor selector.
    pub selector: AdapterDescriptorQuerySelector,
}

/// Query body for loading a descriptor risk and constraint summary.
pub struct GetDescriptorRiskConstraintSummaryQuery {
    /// Exact or current-by-descriptor risk-summary selector.
    pub selector: DescriptorRiskSummaryQuerySelector,
}

/// Query body for loading a secret handling safe summary.
pub struct GetDescriptorSecretSafeSummaryQuery {
    /// Descriptor- or secret-owned safe-summary selector.
    pub selector: DescriptorSecretSummaryQuerySelector,
}

/// Query body for listing descriptor history by capability identity.
pub struct ListDescriptorsByCapabilityQuery {
    /// Exact capability identity that owns the descriptor chain.
    pub identity_ref: CapabilityIdentityRef,
    /// Public page request for descriptor history.
    pub page: CapabilityPublicPageRequest,
}
```

Descriptor mapping rules:

| Query | response | repository / resolver mapping | missing / degraded |
|---|---|---|---|
| `GetAdapterDescriptor` | `CapabilityQueryResponse<AdapterDescriptorView>` | resolve exact descriptor or identity subject;Exact usesdescriptor get,current selector loads identity -> current registry -> current descriptor | visible missing ->`body=None`;no provider runtime / route fallback |
| `GetDescriptorRiskConstraintSummary` | `CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>` | resolve summary or descriptor subject;map exact summary get or current-by-descriptor lookup | visible no current summary ->`body=None`;ForbiddenBody marker never exposes rejected input;not governance approval |
| `GetDescriptorSecretSafeSummary` | `CapabilityQueryResponse<DescriptorSecretSafeSummaryView>` | resolve secret-summary / descriptor subject;load safe summary,typed secret ref and canonical state;descriptor branch first finds current summary by descriptor | missing linked ref/state or state-id mismatch -> body-free degraded;unresolved / unavailable remain explicit view state/value;never calls secret port |
| `ListDescriptorsByCapability` | `CapabilityPageResponse<AdapterDescriptorView>` | validate identity,load current registry id,resolve `DescriptorCollection(identity_id)`,then descriptor`list_by_registry_entry` | no current registry -> visible empty;NotVisible empty/no cursor;history order preserved |

Descriptor page items map only descriptor truth fields。Secret and risk summary bodies require their dedicated Query;`ListDescriptorsByCapability`不得逐项读取safe summary或provider。Direct descriptor / summary reads use`NotApplicable`;secret safe-summary bundle usescanonical state refs in`source_versions`and mapsnon-resolved state to explicit freshness / degraded markers without hiding the body-free status。

### 8.5 Governance / method relation Query schema

```rust
/// Public body-free view of one governance seam relation.
pub struct GovernanceSeamRelationView {
    /// Exact governance seam relation reference.
    pub seam_relation_ref: GovernanceSeamRelationRef,
    /// Capability identity identifier at the capability endpoint.
    pub capability_identity_id: CapabilityIdentityId,
    /// Local governance-result reference at the external endpoint.
    pub governance_result_ref_id: GovernanceResultRefId,
    /// Body-free governance result classification.
    pub governance_ref_kind: GovernanceRefKind,
    /// Body-free governance source reference.
    pub governance_source: GovernanceSourceRef,
    /// Body-free governance result scope summary.
    pub result_scope_summary: GovernanceResultScopeSummary,
    /// Exact canonical governance-reference resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical governance-reference resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Current governance seam state.
    pub seam_state: GovernanceSeamState,
    /// Allowed body-free governance summary.
    pub allowed_safe_summary: GovernanceSafeSummary,
    /// Current relation version.
    pub version: Version,
    /// Time when the relation was created.
    pub created_at: Timestamp,
    /// Time when the relation last changed.
    pub updated_at: Timestamp,
}

/// Public explanation that access review and governance seam remain separate.
pub struct AccessGovernanceSeparationView {
    /// Exact capability identity whose separation is explained.
    pub identity_ref: CapabilityIdentityRef,
    /// Exact current or selected access-review fact.
    pub review_fact_ref: CapabilityAccessReviewFactRef,
    /// Current access-review fact state.
    pub review_state: CapabilityAccessReviewFactState,
    /// Explicit access-review separation marker.
    pub separation_marker: AccessGovernanceSeparationMarker,
    /// Current governance seam relation when one exists.
    pub seam_relation_ref: Option<GovernanceSeamRelationRef>,
    /// Current governance seam state when one exists.
    pub seam_state: Option<GovernanceSeamState>,
}

/// Public body-free view of one capability-method relation.
pub struct CapabilityMethodRelationView {
    /// Exact capability-method relation reference.
    pub method_relation_ref: CapabilityMethodRelationRef,
    /// Capability identity identifier at the capability endpoint.
    pub capability_identity_id: CapabilityIdentityId,
    /// Local method-asset reference at the method endpoint.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Body-free method-asset classification.
    pub method_asset_kind: MethodAssetKindSummary,
    /// Body-free method-library locator.
    pub method_library_locator: MethodLibraryLocator,
    /// Exact canonical method-reference resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical method-reference resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Body-free capability-method applicability scope.
    pub relation_scope: CapabilityMethodRelationScope,
    /// Current method relation state.
    pub relation_state: CapabilityMethodRelationState,
    /// Current relation version.
    pub version: Version,
    /// Time when the relation was created.
    pub created_at: Timestamp,
    /// Time when the relation last changed.
    pub updated_at: Timestamp,
}

/// Public closed union returned by the paged relation query.
pub enum CapabilityRelationView {
    /// Body-free governance seam relation item.
    GovernanceSeam(
        /// Governance seam relation view carried by this item.
        GovernanceSeamRelationView,
    ),
    /// Body-free capability-method relation item.
    MethodRelation(
        /// Capability-method relation view carried by this item.
        CapabilityMethodRelationView,
    ),
}

/// Query body for loading one governance seam relation.
pub struct GetGovernanceSeamRelationQuery {
    /// Exact or current-by-identity seam selector.
    pub selector: GovernanceSeamQuerySelector,
}

/// Query body for explaining access-review and governance separation.
pub struct GetAccessGovernanceSeparationQuery {
    /// Identity or review-fact anchor for the explanation.
    pub selector: AccessGovernanceSeparationQuerySelector,
}

/// Query body for loading one capability-method relation.
pub struct GetCapabilityMethodRelationQuery {
    /// Exact, current, or identity-and-method selector.
    pub selector: CapabilityMethodRelationQuerySelector,
}

/// Query body for listing one relation family by capability identity.
pub struct ListCapabilityRelationsQuery {
    /// Exact capability identity that owns the relation history.
    pub identity_ref: CapabilityIdentityRef,
    /// Closed relation family selected for this page.
    pub relation_kind: CapabilityRelationQueryKind,
    /// Public page request for relation history.
    pub page: CapabilityPublicPageRequest,
}
```

Relation mapping rules:

| Query | response | repository / resolver mapping | missing / degraded |
|---|---|---|---|
| `GetGovernanceSeamRelation` | `CapabilityQueryResponse<GovernanceSeamRelationView>` | resolve seam / identity subject;load seam,governance ref and canonical state | visible missing ->None;ref/state mismatch ->body-free degraded;does not read approval / Policy |
| `GetAccessGovernanceSeparation` | `CapabilityQueryResponse<AccessGovernanceSeparationView>` | resolver-first on identity / review;load selected/current review and optional current seam for same identity | no seam is valid separation view withNone;no recorded review ->visibleNone;never infers approval |
| `GetCapabilityMethodRelation` | `CapabilityQueryResponse<CapabilityMethodRelationView>` | resolve relation / identity subject;pair selector loads current-by-identity then requires exact method ref match;load method ref + state | pair mismatch ->visibleNone;ref/state unavailable ->degraded;no method body lookup |
| `ListCapabilityRelations` | `CapabilityPageResponse<CapabilityRelationView>` | maprelation kind to exactly one repository;resolve `RelationCollection(identity_id)` before list;wrap only selected variant | empty normal;cursor bound to relation kind + identity;never merges two repository cursors |

Relation direct views use`NotApplicable`when complete。Canonical ref non-resolved values remain inbody-free view and may set shared surface to`StaleReadable / Unavailable`or`Degraded`;invalid / forbidden never triggers external refresh。Paged relation items may map onlyrelation + local ref / canonical state reads required by the selected family;entry不得补外部正文。

### 8.6 Formal exposure / controlled consumer Query schema

```rust
/// Public body-free view of one formal exposure boundary.
pub struct FormalExposureBoundaryView {
    /// Exact formal exposure reference.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Registry entry identifier owned by the exposure.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Exact accepted descriptor snapshot reference.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Exact governance seam snapshot reference.
    pub governance_seam_ref: GovernanceSeamRelationRef,
    /// Optional exact method relation snapshot reference.
    pub method_relation_ref: Option<CapabilityMethodRelationRef>,
    /// Current formal exposure state.
    pub exposure_state: FormalExposureState,
    /// Current formal visibility fact identity when one exists.
    pub visibility_applicability_id: Option<FormalVisibilityApplicabilityId>,
    /// Current formal visibility state when one exists.
    pub visibility_state: Option<FormalVisibilityState>,
    /// Current exposure truth version.
    pub version: Version,
    /// Time when the exposure was created.
    pub created_at: Timestamp,
    /// Time when the exposure last changed.
    pub updated_at: Timestamp,
}

/// Explicit consumer-specific applicability result in a visibility view.
pub enum CapabilityConsumerApplicabilityView {
    /// The requested consumer is inside the formal applicability scope.
    Applicable,
    /// The requested consumer is outside the formal applicability scope.
    NotApplicable,
    /// No consumer-specific applicability evaluation was requested.
    NotEvaluated,
}

/// Public view of one formal visibility and applicability fact.
pub struct FormalVisibilityApplicabilityView {
    /// Stable formal visibility applicability identity.
    pub visibility_applicability_id: FormalVisibilityApplicabilityId,
    /// Exact formal exposure evaluated by the fact.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Current formal visibility state.
    pub visibility_state: FormalVisibilityState,
    /// Ordered typed server applicability scope.
    pub applicability_scope: FormalApplicabilityScope,
    /// Body-free visibility basis summary.
    pub basis_summary: FormalVisibilityBasisSummary,
    /// Source exposure version evaluated by this fact.
    pub source_exposure_version: Version,
    /// Explicit applicability result for the optional requested consumer.
    pub requested_consumer_applicability: CapabilityConsumerApplicabilityView,
    /// Current visibility fact version.
    pub version: Version,
    /// Time when the fact was first created.
    pub created_at: Timestamp,
    /// Time when the fact was last evaluated.
    pub evaluated_at: Timestamp,
}

/// Public body-free controlled consumer-view snapshot.
pub struct ControlledConsumerViewView {
    /// Exact controlled consumer-view reference.
    pub consumer_view_ref: ControlledConsumerViewRef,
    /// Formal exposure identifier represented by the view.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Registered consumer boundary that owns the view.
    pub consumer_ref: CapabilityConsumerRef,
    /// Consumer-safe descriptor summary and its typed optional-source gaps.
    pub descriptor_summary: DescriptorConsumerSummary,
    /// Exact access-truth source versions used by the view.
    pub source_versions: ConsumerViewSourceVersionSet,
    /// Current controlled-view freshness state.
    pub freshness_state: ConsumerViewFreshnessState,
    /// Current controlled-view version.
    pub version: Version,
    /// Time when the view was created.
    pub created_at: Timestamp,
    /// Time when the view was last refreshed.
    pub refreshed_at: Timestamp,
}

/// Public SDK server-exposure boundary view without SDK client material.
pub struct SdkExposureBoundaryView {
    /// Local SDK consumer reference identity.
    pub sdk_consumer_ref_id: SdkExposureConsumerRefId,
    /// Body-free SDK server-consumer locator.
    pub sdk_consumer_locator: SdkConsumerLocator,
    /// Body-free SDK-facing server surface summary.
    pub sdk_surface_summary: SdkSurfaceSummary,
    /// Declared SDK exposure scope.
    pub sdk_exposure_scope: SdkExposureScope,
    /// Exact canonical SDK-reference resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical SDK-reference resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Exact formal exposure requested for this boundary.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Current formal exposure state.
    pub exposure_state: FormalExposureState,
    /// Current formal visibility state when available.
    pub visibility_state: Option<FormalVisibilityState>,
    /// Current controlled view for this SDK consumer and exposure when built.
    pub consumer_view: Option<ControlledConsumerViewView>,
}

/// Query body for loading one formal exposure boundary.
pub struct GetFormalExposureBoundaryQuery {
    /// Exact, registry-owned, or identity-owned exposure selector.
    pub selector: FormalExposureQuerySelector,
}

/// Query body for loading formal visibility applicability.
pub struct GetFormalVisibilityApplicabilityQuery {
    /// Exact formal exposure that owns the visibility fact.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Optional registered consumer whose applicability is explained.
    pub consumer_ref: Option<CapabilityConsumerRef>,
}

/// Query body for loading one controlled consumer view.
pub struct GetControlledConsumerViewQuery {
    /// Exact or exposure-and-consumer controlled-view selector.
    pub selector: ControlledConsumerViewQuerySelector,
}

/// Query body for listing consumable views for one runtime or tools consumer.
pub struct ListConsumableCapabilitiesForRuntimeToolsQuery {
    /// Registered runtime or tools consumer reference.
    pub runtime_tools_consumer_ref_id: RuntimeToolsConsumerRefId,
    /// Explicit all-or-listed formal exposure scope.
    pub exposure_scope: CapabilityConsumerExposureQueryScope,
    /// Allowed controlled-view freshness states;empty means all query-visible states.
    pub freshness_states: Vec<ConsumerViewFreshnessState>,
    /// Public page request for the controlled-view listing.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for explaining an SDK server exposure boundary.
pub struct GetSdkExposureBoundaryQuery {
    /// Registered SDK server-consumer reference.
    pub sdk_consumer_ref_id: SdkExposureConsumerRefId,
    /// Exact formal exposure evaluated for the SDK boundary.
    pub exposure_ref: FormalExposureBoundaryRef,
}
```

Exposure / consumer mapping rules:

| Query | response | repository / resolver mapping | visible / degraded surface |
|---|---|---|---|
| `GetFormalExposureBoundary` | `CapabilityQueryResponse<FormalExposureBoundaryView>` | resolve exposure / registry / identity selector subject;load exact/current exposure and optional current visibility | visible missing ->None;missing current visibility on non-draft persisted exposure ->degraded consistency surface;no SDK config |
| `GetFormalVisibilityApplicability` | `CapabilityQueryResponse<FormalVisibilityApplicabilityView>` | resolve `FormalExposure(exposure_id)` directly from the request before any visibility lookup,then call`find_current_by_exposure`;optional consumer is validated registered ref and passed to`is_consumable_by` | no visibility for draft ->visibleNone;consumer mismatch yields`NotApplicable`,not runtime denial;owner mismatch degraded |
| `GetControlledConsumerView` | `CapabilityQueryResponse<ControlledConsumerViewView>` | resolve exact view or exposure+consumer subject before loading;pair uses`find_current_by_exposure_and_consumer` | Ready=`Visible/Fresh`;Stale=`Degraded/StaleReadable`;Rebuilding=`Degraded/Rebuilding`;Unavailable=`Degraded/Unavailable`;Partial=`Degraded/StaleReadable + Partial` |
| `ListConsumableCapabilitiesForRuntimeTools` | `CapabilityPageResponse<ControlledConsumerViewView>` | load runtime consumer ref + state;map exposure scope to explicit ids,build controlled-view scope,resolve `ConsumerViewCollection`,then`list_matching`;per item validates exact audience | unresolved consumer ->body-free degraded empty;visible empty normal;no execution allow / deny or provider lookup |
| `GetSdkExposureBoundary` | `CapabilityQueryResponse<SdkExposureBoundaryView>` | resolve SDK external-reference subject and exposure subject;load SDK ref/state,exposure,current visibility and optional current view by exposure+consumer | SDK ref non-resolved or view stale maps explicit degraded;missing view may return visible body with`consumer_view=None`;no SDK package / client lookup |

Formal exposure truth usesdirect source versions and normally`NotApplicable`;visibility and SDK bundle copy exact loaded versions。Controlled view freshness is copied from`ConsumerViewFreshnessState`,never inferred from timestamp。Query never calls`save`、`mark_stale`、`mark_rebuilding`、`refresh_from_exposure`or anyJob service。

### 8.7 Trace / impact / audit handoff Query schema

```rust
/// Public body-free view of one capability access traceability revision.
pub struct CapabilityAccessTraceView {
    /// Exact traceability record revision.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Capability access truth subject explained by the revision.
    pub trace_subject: CapabilityTraceSubjectRef,
    /// Immutable change records covered by the revision.
    pub source_change_refs: CapabilityChangeRecordRefSet,
    /// Body-free reason for the trace revision.
    pub trace_reason: TraceabilityReason,
    /// External audit or observability handoff refs when attached.
    pub handoff_refs: Option<TraceabilityHandoffRefSet>,
    /// Current traceability state.
    pub traceability_state: TraceabilityState,
    /// Explicit gap reason when the revision is partial.
    pub gap_reason: Option<TraceabilityGapReason>,
    /// Newer traceability revision when this revision was superseded.
    pub superseded_by: Option<CapabilityAccessTraceabilityRecordRef>,
    /// Trusted actor responsible for this revision.
    pub actor_context: ActorContext,
    /// Distributed trace associated with this revision.
    pub trace_id: TraceId,
    /// Current traceability record version.
    pub version: Version,
    /// Time when the traceability record was first created.
    pub recorded_at: Timestamp,
    /// Time when this revision was appended.
    pub updated_at: Timestamp,
}

/// Public body-free view of one capability change-impact fact.
pub struct CapabilityChangeImpactView {
    /// Exact capability impact-fact reference.
    pub impact_ref: CapabilityChangeImpactFactRef,
    /// Exact source traceability revision.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Changed capability access truth subject.
    pub change_subject: CapabilityTraceSubjectRef,
    /// Body-free impact scope.
    pub impact_scope: CapabilityImpactScope,
    /// Registered consumer boundaries affected by the change.
    pub affected_consumers: CapabilityConsumerRefSet,
    /// Current impact state.
    pub impact_state: CapabilityImpactState,
    /// Body-free reason for the current non-initial state.
    pub state_reason: Option<ChangeReason>,
    /// Trusted actor responsible for this impact revision.
    pub recorded_by: ActorContext,
    /// Distributed trace linking the impact to its source.
    pub trace_id: TraceId,
    /// Current impact-fact version.
    pub version: Version,
    /// Time when the impact fact was created.
    pub created_at: Timestamp,
    /// Time when the impact fact last changed.
    pub updated_at: Timestamp,
}

/// Public body-free downstream impact-feedback summary view.
pub struct DownstreamConsumptionImpactSummaryView {
    /// Exact downstream impact-summary reference.
    pub impact_summary_ref: DownstreamConsumptionImpactSummaryRef,
    /// Exact capability impact fact answered by this summary.
    pub impact_fact_ref: CapabilityChangeImpactFactRef,
    /// Registered consumer boundary that produced the summary.
    pub consumer_ref: CapabilityConsumerRef,
    /// Body-free inbound source event reference.
    pub source_feedback_ref: CapabilityInboundEventRef,
    /// Allowed body-free downstream impact observation when reported.
    pub impact_observation: Option<ConsumptionImpactObservationSummary>,
    /// Current downstream feedback state.
    pub feedback_state: DownstreamImpactSummaryState,
    /// Explicit gap reason when the feedback is partial.
    pub gap_reason: Option<ConsumptionFeedbackGapReason>,
    /// Explicit safe reason for delayed, unavailable, or ignored feedback.
    pub state_reason: Option<ChangeReason>,
    /// Trusted actor or system identity that accepted the feedback.
    pub accepted_by: ActorContext,
    /// Distributed trace propagated from the inbound boundary.
    pub trace_id: TraceId,
    /// Current safe-summary version.
    pub version: Version,
    /// Time when the feedback was first observed.
    pub observed_at: Timestamp,
    /// Time when the safe summary last changed.
    pub updated_at: Timestamp,
}

/// Canonical state of one audit reference attached to a traceability revision.
pub struct AuditHandoffReferenceStateView {
    /// Local observability or audit reference identity.
    pub audit_ref_id: ObservabilityAuditRefId,
    /// Exact canonical audit-reference resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Current canonical audit-reference resolution value.
    pub resolution_value: ReferenceResolutionValue,
}

/// Public body-free summary of traceability audit handoff state.
pub struct AuditHandoffTraceSummaryView {
    /// Exact traceability revision summarized by this view.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Current traceability state.
    pub traceability_state: TraceabilityState,
    /// Body-free requested handoff scope.
    pub handoff_scope: CapabilityAuditHandoffScopeInput,
    /// Canonical state of every attached audit reference.
    pub audit_references: Vec<AuditHandoffReferenceStateView>,
    /// Explicit trace gap when handoff is partial.
    pub gap_reason: Option<TraceabilityGapReason>,
}

/// Query body for listing traceability revisions by access truth subject.
pub struct GetCapabilityAccessTraceQuery {
    /// Capability access truth subject whose trace history is requested.
    pub trace_subject: CapabilityTraceSubjectRef,
    /// Public page request for traceability history.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for loading one capability change-impact fact.
pub struct GetCapabilityChangeImpactQuery {
    /// Exact impact or source-change selector.
    pub selector: CapabilityImpactQuerySelector,
}

/// Query body for listing downstream impact summaries by typed scope.
pub struct GetDownstreamConsumptionImpactSummaryQuery {
    /// Exact capability impact fact when the page is impact-centered.
    pub impact_fact_ref: Option<CapabilityChangeImpactFactRef>,
    /// Exact consumer boundary when the query is consumer-centered.
    pub consumer_ref: Option<CapabilityConsumerRef>,
    /// Exact changed truth subject when the query is subject-centered.
    pub change_subject: Option<CapabilityTraceSubjectRef>,
    /// Inclusive lower observation-time bound.
    pub observed_from: Option<Timestamp>,
    /// Exclusive upper observation-time bound.
    pub observed_until: Option<Timestamp>,
    /// Public page request for downstream impact summaries.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for reading audit handoff state from one traceability revision.
pub struct GetAuditHandoffTraceSummaryQuery {
    /// Exact traceability revision requested by the caller.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Body-free handoff scope being inspected.
    pub handoff_scope: CapabilityAuditHandoffScopeInput,
}
```

Trace / impact mapping rules:

| Query | response | repository / resolver mapping | visible / degraded surface |
|---|---|---|---|
| `GetCapabilityAccessTrace` | `CapabilityPageResponse<CapabilityAccessTraceView>` | resolve `TraceabilityCollection(trace_subject)` before`list_by_subject`;map each immutable revision without reading raw logs | visible empty normal;partial / handoff-pending items remain explicit;NotVisible empty/no cursor |
| `GetCapabilityChangeImpact` | `CapabilityQueryResponse<CapabilityChangeImpactView>` | Exact resolves impact subject then exact load;ByChange resolves `ChangeRecord(change_ref)`,loads current trace by change,then impact by trace | no trace / impact ->visibleNone;trace-impact mismatch ->degraded;never reads consumer execution payload |
| `GetDownstreamConsumptionImpactSummary` | `CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>` | require impact、consumer or change subject,validate time range,build typed scope,resolve `DownstreamSummaryCollection`,then`list_downstream_summaries` | visible empty normal;unavailable / delayed / ignored are item states,not query errors;NotVisible empty/no cursor |
| `GetAuditHandoffTraceSummary` | `CapabilityQueryResponse<AuditHandoffTraceSummaryView>` | resolve trace subject,load exact trace,then each attached audit ref + canonical state;scope validates and labels the body-free inspection context but never selects refs | no attached refs returns visible body with empty vector;non-resolved audit refs return body-free degraded partial view;no raw audit store read |

Trace / impact / downstream truth uses`NotApplicable`freshness。Audit handoff bundle usesexact trace / reference versions and may be`Degraded`while returning only the declared body-free partial view。Query never calls`ObservabilityAuditHandoffPort`,never appends trace revision,and never treatstrace id、source event id或audit ref as evidence alias / acceptance signature。

### 8.8 Derived material / reconciliation Query schema

```rust
/// Public read-only capability directory projection item.
pub struct CapabilityDirectoryProjectionView {
    /// Exact directory projection reference.
    pub projection_ref: DirectorySearchBrowseProjectionRef,
    /// Exact registry entry snapshot used by the projection.
    pub source_registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact adapter descriptor snapshot used by the projection.
    pub source_descriptor_ref: AdapterDescriptorRef,
    /// Exact formal exposure snapshot used by the projection.
    pub source_exposure_ref: FormalExposureBoundaryRef,
    /// Body-free directory display summary.
    pub display_summary: CapabilityDirectoryDisplaySummary,
    /// Validated search and browse facets.
    pub filter_facets: DirectorySearchFacetSet,
    /// Exact source versions used by the projection.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current directory projection state.
    pub freshness_state: DirectoryProjectionState,
    /// Explicit stale or unavailable reason when degraded.
    pub state_reason: Option<DerivedMaterialStaleReason>,
    /// Current projection version.
    pub version: Version,
    /// Time when the projection was created.
    pub created_at: Timestamp,
    /// Time when the projection was last refreshed.
    pub refreshed_at: Timestamp,
}

/// Public body-free audit-friendly export summary view.
pub struct AuditFriendlyExportSummaryView {
    /// Exact audit-friendly export reference.
    pub export_ref: AuditFriendlyExportSummaryRef,
    /// Exact traceability revision summarized by the export.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Body-free audit export scope.
    pub export_scope: AuditExportScope,
    /// Redacted summary allowed across the audit boundary.
    pub allowed_summary: AuditAllowedSummary,
    /// Attached observability or audit references when present.
    pub observability_refs: Option<ObservabilityAuditRefSet>,
    /// Exact source versions used by the export.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current audit export state.
    pub export_state: AuditExportState,
    /// Explicit gap or stale reason when degraded.
    pub state_reason: Option<AuditExportGapReason>,
    /// Current export material version.
    pub version: Version,
    /// Time when the export was created.
    pub created_at: Timestamp,
    /// Time when the export was last refreshed.
    pub refreshed_at: Timestamp,
}

/// Public read-only ecosystem discovery summary view.
pub struct ReadOnlyEcosystemDiscoverySummaryView {
    /// Exact ecosystem discovery summary reference.
    pub discovery_ref: ReadOnlyEcosystemDiscoverySummaryRef,
    /// Exact formal exposure snapshot used by the summary.
    pub formal_exposure_ref: FormalExposureBoundaryRef,
    /// Body-free ecosystem consumer context.
    pub ecosystem_context_ref: EcosystemContextRef,
    /// Body-free capability discoverability summary.
    pub discoverability_summary: CapabilityDiscoverabilitySummary,
    /// Exact source versions used by the summary.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Current ecosystem discovery freshness state.
    pub freshness_state: EcosystemDiscoveryState,
    /// Explicit degraded reason when present.
    pub state_reason: Option<DiscoveryUnavailableReason>,
    /// Current discovery material version.
    pub version: Version,
    /// Time when the discovery summary was created.
    pub created_at: Timestamp,
    /// Time when the discovery summary was last refreshed.
    pub refreshed_at: Timestamp,
}

/// Public immutable capability reconciliation report view.
pub struct CapabilityReconciliationReportView {
    /// Exact immutable reconciliation report reference.
    pub report_ref: CapabilityReconciliationReportRef,
    /// Body-free scope inspected by the report.
    pub reconciliation_scope: CapabilityReconciliationScope,
    /// Accepted truth subjects inspected by the report.
    pub source_truth_refs: AccessTruthRefSet,
    /// Derived materials inspected by the report.
    pub inspected_material_refs: DerivedMaterialRefSet,
    /// Exact source and material versions compared by the report.
    pub source_versions: DerivedMaterialSourceVersionSet,
    /// Body-free reconciliation finding summary.
    pub finding_summary: ReconciliationFindingSummary,
    /// Final reconciliation report state.
    pub report_state: ReconciliationReportState,
    /// Explicit safe failure reason for a failed report.
    pub failure_reason: Option<ReconciliationFailureReason>,
    /// Core job run that produced the immutable report.
    pub job_run_id: JobRunId,
    /// Trusted actor or system identity responsible for the run.
    pub generated_by: ActorContext,
    /// Distributed trace associated with the run.
    pub trace_id: TraceId,
    /// Immutable report version.
    pub version: Version,
    /// Time when the report was generated.
    pub generated_at: Timestamp,
}

/// Public page body for reconciliation reports selected by scope.
pub struct CapabilityReconciliationReportPageView {
    /// Immutable reconciliation report views in repository order.
    pub items: Vec<CapabilityReconciliationReportView>,
    /// Public continuation metadata for the same report scope.
    pub page: CapabilityPublicPageInfo,
}

/// Closed body returned by exact or scope-based reconciliation report lookup.
pub enum CapabilityReconciliationReportQueryBody {
    /// One exact immutable reconciliation report.
    Exact(
        /// Exact reconciliation report view.
        CapabilityReconciliationReportView,
    ),
    /// One page of immutable reports for a declared scope.
    ScopePage(
        /// Scope-bound reconciliation report page.
        CapabilityReconciliationReportPageView,
    ),
}

/// Query body for searching capability directory projections.
pub struct SearchCapabilityDirectoryQuery {
    /// Optional validated body-free search text.
    pub query_text: Option<CapabilitySafeText>,
    /// Optional typed directory facet filters.
    pub facets: Option<DirectorySearchFacetSet>,
    /// Public page request for directory search.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for browsing capability directory projections.
pub struct BrowseCapabilityDirectoryQuery {
    /// Optional typed browse facets;None means stable browse-all order.
    pub facets: Option<DirectorySearchFacetSet>,
    /// Public page request for directory browse.
    pub page: CapabilityPublicPageRequest,
}

/// Query body for loading one current audit-friendly export summary.
pub struct GetAuditFriendlyExportSummaryQuery {
    /// Exact or trace-and-scope audit export selector.
    pub selector: AuditExportQuerySelector,
}

/// Query body for loading one read-only ecosystem discovery summary.
pub struct GetReadOnlyEcosystemDiscoverySummaryQuery {
    /// Exact formal exposure represented by the discovery summary.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Body-free ecosystem consumer context.
    pub ecosystem_context_ref: EcosystemContextRef,
}

/// Query body for loading exact or scope-paged reconciliation reports.
pub struct GetCapabilityReconciliationReportQuery {
    /// Exact report or declared-scope page selector.
    pub selector: CapabilityReconciliationReportQuerySelector,
}
```

Derived material mapping rules:

| Query | response | repository / resolver mapping | visible / degraded surface |
|---|---|---|---|
| `SearchCapabilityDirectory` | `CapabilityPageResponse<CapabilityDirectoryProjectionView>` | build directory search scope,resolve `DirectorySearchCollection` before`search_directory_projections`;map public cursor | item states aggregate deterministically:Unavailable > Rebuilding > Stale > Ready;empty page uses resolver source marker,not first item |
| `BrowseCapabilityDirectory` | `CapabilityPageResponse<CapabilityDirectoryProjectionView>` | mapquery text=None + optional facets,resolve `DirectoryBrowseCollection`,use same repository search | same state aggregation;does not modify visibility or ranking truth |
| `GetAuditFriendlyExportSummary` | `CapabilityQueryResponse<AuditFriendlyExportSummaryView>` | Exact resolves export subject and exact get;TraceabilityAndScope resolves trace subject then`find_audit_export_by_traceability` | visible missing ->None;Partial / Stale / Unavailable returns body-free degraded view;no audit store fallback |
| `GetReadOnlyEcosystemDiscoverySummary` | `CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>` | resolve exposure subject,validate exact exposure id,then`find_ecosystem_discovery(exposure_id, context)` | visible missing ->None;Partial / Stale / Unavailable explicit;never forms marketplace listing |
| `GetCapabilityReconciliationReport` | `CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>` | Exact resolves report subject +`get`;Scope resolves `ReconciliationReportCollection` before`list_by_scope`,then embeds mapped public page | scope empty is`ScopePage`withempty items;failed report remains visible safe report / degraded marker;Query never repairs truth or starts rebuild |

Directory page freshness aggregation only usespersisted `DirectoryProjectionState`;tie / mixed-source ordering does not change repository order。Audit / discovery map their actual four persisted states without inventing`Rebuilding`:Ready -> Fresh、Partial / Stale -> StaleReadable、Unavailable -> Unavailable,with the matching stable degraded kind。Reconciliation report is immutable direct read;Completed -> Fresh,Partial / Inconsistent / RebuildRequired -> StaleReadable degraded safe body,and Failed -> Unavailable degraded safe body。For a scope page,the outer surface uses`Failed > RebuildRequired > Inconsistent > Partial > Completed`;empty visible page is Fresh。`report_state`is not treated as a projection lock or test result,and`job_run_id`does not prove a real execution beyond the stored report truth。

### 8.9 Reference-resolution and external-reference Query schema

```rust
/// Public canonical resolution-state view for one body-free external reference.
pub struct ReferenceResolutionStateView {
    /// Exact canonical reference-resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Exact external reference subject tracked by the state.
    pub reference_subject: ReferenceSubjectRef,
    /// Declared reference category matching the subject variant.
    pub reference_kind: ReferenceKind,
    /// Current canonical reference-resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Body-free reason for the current resolution value.
    pub resolution_reason: ReferenceResolutionReason,
    /// Trusted actor or system identity responsible for the latest check.
    pub checked_by: ActorContext,
    /// Distributed trace associated with the latest check.
    pub trace_id: TraceId,
    /// Current canonical state version.
    pub version: Version,
    /// Time when the canonical state was created.
    pub created_at: Timestamp,
    /// Time when the reference was last checked.
    pub last_checked_at: Timestamp,
}

/// Public body-free external document-reference view.
pub struct ExternalDocumentReferenceView {
    /// Stable local external document-reference identity.
    pub external_document_ref_id: ExternalDocumentRefId,
    /// Body-free external document category.
    pub document_kind: ExternalDocumentKind,
    /// Body-free external document locator summary.
    pub document_locator: ExternalDocumentLocatorSummary,
    /// Descriptor supported by this reference when bound.
    pub supported_descriptor_id: Option<AdapterDescriptorId>,
    /// Canonical resolution state for this document reference.
    pub resolution: ReferenceResolutionStateView,
    /// Current document-reference version.
    pub version: Version,
    /// Time when the document reference was created.
    pub created_at: Timestamp,
    /// Time when the document reference last changed.
    pub updated_at: Timestamp,
}

/// Public body-free runtime or tools consumer-reference view.
pub struct RuntimeToolsConsumerReferenceView {
    /// Stable local runtime or tools consumer-reference identity.
    pub runtime_tools_consumer_ref_id: RuntimeToolsConsumerRefId,
    /// Closed runtime or tools consumer family.
    pub consumer_kind: RuntimeToolsConsumerKind,
    /// Body-free runtime or tools consumer locator.
    pub consumer_locator: RuntimeToolsConsumerLocator,
    /// Body-free capability consumption scope.
    pub consumer_scope: CapabilityConsumerScope,
    /// Canonical resolution state for this consumer reference.
    pub resolution: ReferenceResolutionStateView,
    /// Current consumer-reference version.
    pub version: Version,
    /// Time when the consumer reference was created.
    pub created_at: Timestamp,
    /// Time when the consumer reference last changed.
    pub updated_at: Timestamp,
}

/// Public body-free SDK server-consumer reference view.
pub struct SdkExposureConsumerReferenceView {
    /// Stable local SDK server-consumer reference identity.
    pub sdk_consumer_ref_id: SdkExposureConsumerRefId,
    /// Body-free SDK server-consumer locator.
    pub sdk_consumer_locator: SdkConsumerLocator,
    /// Body-free SDK-facing server surface summary.
    pub sdk_surface_summary: SdkSurfaceSummary,
    /// Body-free SDK exposure scope.
    pub exposure_scope: SdkExposureScope,
    /// Canonical resolution state for this SDK reference.
    pub resolution: ReferenceResolutionStateView,
    /// Current SDK reference version.
    pub version: Version,
    /// Time when the SDK reference was created.
    pub created_at: Timestamp,
    /// Time when the SDK reference last changed.
    pub updated_at: Timestamp,
}

/// Public body-free observability or audit-reference view.
pub struct ObservabilityAuditReferenceView {
    /// Stable local observability or audit-reference identity.
    pub observability_audit_ref_id: ObservabilityAuditRefId,
    /// Body-free external audit material category.
    pub audit_material_kind: AuditMaterialKind,
    /// Body-free external audit material locator summary.
    pub audit_locator: AuditMaterialLocatorSummary,
    /// Canonical resolution state for this audit reference.
    pub resolution: ReferenceResolutionStateView,
    /// Current audit-reference version.
    pub version: Version,
    /// Time when the audit reference was created.
    pub created_at: Timestamp,
    /// Time when the audit reference last changed.
    pub updated_at: Timestamp,
}

/// Query body for loading one canonical reference-resolution state.
pub struct GetReferenceResolutionStateQuery {
    /// Exact registered body-free reference subject.
    pub reference_subject: ReferenceSubjectRef,
    /// Declared reference kind required to match the subject variant.
    pub reference_kind: ReferenceKind,
}

/// Query body for loading one external document reference.
pub struct GetExternalDocumentReferenceQuery {
    /// Stable local external document-reference identity.
    pub external_document_ref_id: ExternalDocumentRefId,
}

/// Query body for loading one runtime or tools consumer reference.
pub struct GetRuntimeToolsConsumerReferenceQuery {
    /// Stable local runtime or tools consumer-reference identity.
    pub runtime_tools_consumer_ref_id: RuntimeToolsConsumerRefId,
}

/// Query body for loading one SDK server-consumer reference.
pub struct GetSdkExposureConsumerReferenceQuery {
    /// Stable local SDK server-consumer reference identity.
    pub sdk_consumer_ref_id: SdkExposureConsumerRefId,
}

/// Query body for loading one observability or audit reference.
pub struct GetObservabilityAuditReferenceQuery {
    /// Stable local observability or audit-reference identity.
    pub observability_audit_ref_id: ObservabilityAuditRefId,
}
```

Reference mapping rules:

| Query | response | repository / resolver mapping | visible / degraded surface |
|---|---|---|---|
| `GetReferenceResolutionState` | `CapabilityQueryResponse<ReferenceResolutionStateView>` | validate subject-kind symmetry,resolve `ExternalReference(reference_subject)` directly from the request before any state lookup,then call`find_current_by_subject` and validate the loaded exact current state | visible missing ->None;all seven values returned explicitly;no external lookup |
| `GetExternalDocumentReference` | `CapabilityQueryResponse<ExternalDocumentReferenceView>` | wrap id asExternalDocument subject,resolve `ExternalReference(subject)`,load union ref + current canonical state | wrong union / state-id mismatch ->degraded consistency surface;document body never returned |
| `GetRuntimeToolsConsumerReference` | `CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>` | resolve runtime-tools external-reference subject,load typed union + current state | non-resolved explicit;no runtime execution / allowlist / tool result lookup |
| `GetSdkExposureConsumerReference` | `CapabilityQueryResponse<SdkExposureConsumerReferenceView>` | resolve SDK external-reference subject,load typed union + current state | non-resolved explicit;no SDK client / package / binding body |
| `GetObservabilityAuditReference` | `CapabilityQueryResponse<ObservabilityAuditReferenceView>` | resolve audit external-reference subject,load typed union + current state | non-resolved explicit;no raw log / metric / trace / audit store read |

Reference-state freshness mapping is closed:Resolved ->`Visible/NotApplicable`;Unresolved ->`Degraded/Unavailable + ReferenceUnresolved`;Stale / Expired ->`Degraded/StaleReadable + StaleSource`;Unavailable ->`Degraded/Unavailable + ReferenceUnavailable`;Invalid / Forbidden ->`Degraded/Unavailable + Redacted`。A visible missing ref returns`body=None`;NotVisible returns no subject id / body。All seven persisted values,includingInvalid / Forbidden,retain the complete registered body-free reference/state view because these carriers contain no external body;`Redacted`forbids external body fallback rather than erasing canonical state truth。No reference Query calls anyexternal resolver、refresh Job或state mutation member。

`CH-DDD-S9-REFERENCE-REDACTED-BODY-001` clarification:the generic state Query and all four typed reference Queries use the same body rule。Once the local reference union、persisted version、canonical state id、subject and kind are complete and symmetric,all seven canonical values return`body=Some(view)`。`Invalid / Forbidden`set`Degraded/Unavailable + Redacted`;they do not return`body=None`,silently drop the state or expose the rejected external body。Missing local ref、missing current canonical state or any pair mismatch remains a distinct missing / consistency branch and cannot be represented as an`Invalid / Forbidden`body。

### 8.10 Query API exact handler surface

```rust
/// Closed synchronous API handler surface for all capability-hub queries.
#[async_trait::async_trait]
pub trait CapabilityQueryHandlers: Send + Sync {
    /// Loads one exact capability identity view.
    async fn get_capability_identity(
        &self,
        request: CapabilityQueryRequest<GetCapabilityIdentityQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityIdentityView>, ApplicationError>;

    /// Searches capability identity truth with typed filters and pagination.
    async fn search_capability_identities(
        &self,
        request: CapabilityQueryRequest<SearchCapabilityIdentitiesQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityIdentitySearchItemView>, ApplicationError>;

    /// Loads one exact or current capability access-review fact.
    async fn get_capability_access_review_fact(
        &self,
        request: CapabilityQueryRequest<GetCapabilityAccessReviewFactQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityAccessReviewFactView>, ApplicationError>;

    /// Loads one exact capability registry entry.
    async fn get_capability_registry_entry(
        &self,
        request: CapabilityQueryRequest<GetCapabilityRegistryEntryQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityRegistryEntryView>, ApplicationError>;

    /// Lists registry truth with typed filters and pagination.
    async fn list_capability_registry_entries(
        &self,
        request: CapabilityQueryRequest<ListCapabilityRegistryEntriesQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityRegistryListItemView>, ApplicationError>;

    /// Explains registry visibility semantics without forming exposure truth.
    async fn get_registry_visibility_semantics(
        &self,
        request: CapabilityQueryRequest<GetRegistryVisibilitySemanticsQuery>,
    ) -> Result<CapabilityQueryResponse<RegistryVisibilitySemanticsView>, ApplicationError>;

    /// Loads one exact or current adapter descriptor view.
    async fn get_adapter_descriptor(
        &self,
        request: CapabilityQueryRequest<GetAdapterDescriptorQuery>,
    ) -> Result<CapabilityQueryResponse<AdapterDescriptorView>, ApplicationError>;

    /// Loads one descriptor risk and constraint summary view.
    async fn get_descriptor_risk_constraint_summary(
        &self,
        request: CapabilityQueryRequest<GetDescriptorRiskConstraintSummaryQuery>,
    ) -> Result<CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>, ApplicationError>;

    /// Loads one body-free descriptor secret handling summary view.
    async fn get_descriptor_secret_safe_summary(
        &self,
        request: CapabilityQueryRequest<GetDescriptorSecretSafeSummaryQuery>,
    ) -> Result<CapabilityQueryResponse<DescriptorSecretSafeSummaryView>, ApplicationError>;

    /// Lists adapter descriptor history for one capability identity.
    async fn list_descriptors_by_capability(
        &self,
        request: CapabilityQueryRequest<ListDescriptorsByCapabilityQuery>,
    ) -> Result<CapabilityPageResponse<AdapterDescriptorView>, ApplicationError>;

    /// Loads one governance seam relation view.
    async fn get_governance_seam_relation(
        &self,
        request: CapabilityQueryRequest<GetGovernanceSeamRelationQuery>,
    ) -> Result<CapabilityQueryResponse<GovernanceSeamRelationView>, ApplicationError>;

    /// Explains access-review and governance-seam separation.
    async fn get_access_governance_separation(
        &self,
        request: CapabilityQueryRequest<GetAccessGovernanceSeparationQuery>,
    ) -> Result<CapabilityQueryResponse<AccessGovernanceSeparationView>, ApplicationError>;

    /// Loads one body-free capability-method relation view.
    async fn get_capability_method_relation(
        &self,
        request: CapabilityQueryRequest<GetCapabilityMethodRelationQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityMethodRelationView>, ApplicationError>;

    /// Lists one closed relation family for a capability identity.
    async fn list_capability_relations(
        &self,
        request: CapabilityQueryRequest<ListCapabilityRelationsQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityRelationView>, ApplicationError>;

    /// Loads one formal exposure boundary view.
    async fn get_formal_exposure_boundary(
        &self,
        request: CapabilityQueryRequest<GetFormalExposureBoundaryQuery>,
    ) -> Result<CapabilityQueryResponse<FormalExposureBoundaryView>, ApplicationError>;

    /// Loads one formal visibility applicability view.
    async fn get_formal_visibility_applicability(
        &self,
        request: CapabilityQueryRequest<GetFormalVisibilityApplicabilityQuery>,
    ) -> Result<CapabilityQueryResponse<FormalVisibilityApplicabilityView>, ApplicationError>;

    /// Loads one controlled consumer-view snapshot.
    async fn get_controlled_consumer_view(
        &self,
        request: CapabilityQueryRequest<GetControlledConsumerViewQuery>,
    ) -> Result<CapabilityQueryResponse<ControlledConsumerViewView>, ApplicationError>;

    /// Lists query-visible controlled views for one runtime or tools consumer.
    async fn list_consumable_capabilities_for_runtime_tools(
        &self,
        request: CapabilityQueryRequest<ListConsumableCapabilitiesForRuntimeToolsQuery>,
    ) -> Result<CapabilityPageResponse<ControlledConsumerViewView>, ApplicationError>;

    /// Explains one SDK server exposure boundary.
    async fn get_sdk_exposure_boundary(
        &self,
        request: CapabilityQueryRequest<GetSdkExposureBoundaryQuery>,
    ) -> Result<CapabilityQueryResponse<SdkExposureBoundaryView>, ApplicationError>;

    /// Lists traceability revisions for one capability access truth subject.
    async fn get_capability_access_trace(
        &self,
        request: CapabilityQueryRequest<GetCapabilityAccessTraceQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityAccessTraceView>, ApplicationError>;

    /// Loads one capability change-impact fact.
    async fn get_capability_change_impact(
        &self,
        request: CapabilityQueryRequest<GetCapabilityChangeImpactQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityChangeImpactView>, ApplicationError>;

    /// Lists downstream body-free impact summaries by typed scope.
    async fn get_downstream_consumption_impact_summary(
        &self,
        request: CapabilityQueryRequest<GetDownstreamConsumptionImpactSummaryQuery>,
    ) -> Result<CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>, ApplicationError>;

    /// Loads one body-free traceability audit handoff summary.
    async fn get_audit_handoff_trace_summary(
        &self,
        request: CapabilityQueryRequest<GetAuditHandoffTraceSummaryQuery>,
    ) -> Result<CapabilityQueryResponse<AuditHandoffTraceSummaryView>, ApplicationError>;

    /// Searches capability directory projections.
    async fn search_capability_directory(
        &self,
        request: CapabilityQueryRequest<SearchCapabilityDirectoryQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>;

    /// Browses capability directory projections in stable order.
    async fn browse_capability_directory(
        &self,
        request: CapabilityQueryRequest<BrowseCapabilityDirectoryQuery>,
    ) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>;

    /// Loads one audit-friendly export summary.
    async fn get_audit_friendly_export_summary(
        &self,
        request: CapabilityQueryRequest<GetAuditFriendlyExportSummaryQuery>,
    ) -> Result<CapabilityQueryResponse<AuditFriendlyExportSummaryView>, ApplicationError>;

    /// Loads one read-only ecosystem discovery summary.
    async fn get_read_only_ecosystem_discovery_summary(
        &self,
        request: CapabilityQueryRequest<GetReadOnlyEcosystemDiscoverySummaryQuery>,
    ) -> Result<CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>, ApplicationError>;

    /// Loads one exact reconciliation report or a scope-bound report page.
    async fn get_capability_reconciliation_report(
        &self,
        request: CapabilityQueryRequest<GetCapabilityReconciliationReportQuery>,
    ) -> Result<CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>, ApplicationError>;

    /// Loads one canonical reference-resolution state view.
    async fn get_reference_resolution_state(
        &self,
        request: CapabilityQueryRequest<GetReferenceResolutionStateQuery>,
    ) -> Result<CapabilityQueryResponse<ReferenceResolutionStateView>, ApplicationError>;

    /// Loads one body-free external document-reference view.
    async fn get_external_document_reference(
        &self,
        request: CapabilityQueryRequest<GetExternalDocumentReferenceQuery>,
    ) -> Result<CapabilityQueryResponse<ExternalDocumentReferenceView>, ApplicationError>;

    /// Loads one body-free runtime or tools consumer-reference view.
    async fn get_runtime_tools_consumer_reference(
        &self,
        request: CapabilityQueryRequest<GetRuntimeToolsConsumerReferenceQuery>,
    ) -> Result<CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>, ApplicationError>;

    /// Loads one body-free SDK server-consumer reference view.
    async fn get_sdk_exposure_consumer_reference(
        &self,
        request: CapabilityQueryRequest<GetSdkExposureConsumerReferenceQuery>,
    ) -> Result<CapabilityQueryResponse<SdkExposureConsumerReferenceView>, ApplicationError>;

    /// Loads one body-free observability or audit-reference view.
    async fn get_observability_audit_reference(
        &self,
        request: CapabilityQueryRequest<GetObservabilityAuditReferenceQuery>,
    ) -> Result<CapabilityQueryResponse<ObservabilityAuditReferenceView>, ApplicationError>;
}
```

handler rules:

- handler先验证path对应closed `query_name`且`T`与exact route一致;mismatch在application前作为`OperationMismatch`处理。
- handler只从envelope构造`CapabilityOperationContext::from_query`;body不得重复actor、trace、consistency或page metadata authority。
- public Query outcome不复用Command `Accepted`;visible / not-visible / degraded均直接来自typed `CapabilityQuerySurface`。
- handler不持有repository、read-visibility resolver、clock、UoW、external resolver或job service;transport error映射留Step 12 / 14。

### 8.11 Query application service exact callable surface

```rust
/// Application query surface for capability identity and access-review reads.
#[async_trait::async_trait]
pub trait CapabilityIdentityQueryService: Send + Sync {
    /// Loads one exact capability identity view.
    async fn get_capability_identity(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityIdentityQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityIdentityView>, ApplicationError>;

    /// Searches capability identity truth with typed filters.
    async fn search_capability_identities(
        &self,
        context: CapabilityOperationContext,
        query: SearchCapabilityIdentitiesQuery,
    ) -> Result<CapabilityPageResponse<CapabilityIdentitySearchItemView>, ApplicationError>;

    /// Loads one exact or current access-review fact.
    async fn get_capability_access_review_fact(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityAccessReviewFactQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityAccessReviewFactView>, ApplicationError>;
}

/// Application query surface for capability registry reads.
#[async_trait::async_trait]
pub trait CapabilityRegistryQueryService: Send + Sync {
    /// Loads one exact capability registry entry.
    async fn get_capability_registry_entry(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityRegistryEntryQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityRegistryEntryView>, ApplicationError>;

    /// Lists registry truth with typed filters.
    async fn list_capability_registry_entries(
        &self,
        context: CapabilityOperationContext,
        query: ListCapabilityRegistryEntriesQuery,
    ) -> Result<CapabilityPageResponse<CapabilityRegistryListItemView>, ApplicationError>;

    /// Explains registry visibility semantics without mutation.
    async fn get_registry_visibility_semantics(
        &self,
        context: CapabilityOperationContext,
        query: GetRegistryVisibilitySemanticsQuery,
    ) -> Result<CapabilityQueryResponse<RegistryVisibilitySemanticsView>, ApplicationError>;
}

/// Application query surface for adapter descriptor and safe-summary reads.
#[async_trait::async_trait]
pub trait CapabilityDescriptorQueryService: Send + Sync {
    /// Loads one exact or current adapter descriptor.
    async fn get_adapter_descriptor(
        &self,
        context: CapabilityOperationContext,
        query: GetAdapterDescriptorQuery,
    ) -> Result<CapabilityQueryResponse<AdapterDescriptorView>, ApplicationError>;

    /// Loads one descriptor risk and constraint summary.
    async fn get_descriptor_risk_constraint_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetDescriptorRiskConstraintSummaryQuery,
    ) -> Result<CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>, ApplicationError>;

    /// Loads one body-free secret handling safe summary.
    async fn get_descriptor_secret_safe_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetDescriptorSecretSafeSummaryQuery,
    ) -> Result<CapabilityQueryResponse<DescriptorSecretSafeSummaryView>, ApplicationError>;

    /// Lists descriptor history for one capability identity.
    async fn list_descriptors_by_capability(
        &self,
        context: CapabilityOperationContext,
        query: ListDescriptorsByCapabilityQuery,
    ) -> Result<CapabilityPageResponse<AdapterDescriptorView>, ApplicationError>;
}

/// Application query surface for governance seam and method relation reads.
#[async_trait::async_trait]
pub trait CapabilityRelationQueryService: Send + Sync {
    /// Loads one governance seam relation.
    async fn get_governance_seam_relation(
        &self,
        context: CapabilityOperationContext,
        query: GetGovernanceSeamRelationQuery,
    ) -> Result<CapabilityQueryResponse<GovernanceSeamRelationView>, ApplicationError>;

    /// Explains access-review and governance separation.
    async fn get_access_governance_separation(
        &self,
        context: CapabilityOperationContext,
        query: GetAccessGovernanceSeparationQuery,
    ) -> Result<CapabilityQueryResponse<AccessGovernanceSeparationView>, ApplicationError>;

    /// Loads one body-free capability-method relation.
    async fn get_capability_method_relation(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityMethodRelationQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityMethodRelationView>, ApplicationError>;

    /// Lists one closed relation family for a capability identity.
    async fn list_capability_relations(
        &self,
        context: CapabilityOperationContext,
        query: ListCapabilityRelationsQuery,
    ) -> Result<CapabilityPageResponse<CapabilityRelationView>, ApplicationError>;
}

/// Application query surface for formal exposure and controlled consumer reads.
#[async_trait::async_trait]
pub trait CapabilityExposureQueryService: Send + Sync {
    /// Loads one formal exposure boundary.
    async fn get_formal_exposure_boundary(
        &self,
        context: CapabilityOperationContext,
        query: GetFormalExposureBoundaryQuery,
    ) -> Result<CapabilityQueryResponse<FormalExposureBoundaryView>, ApplicationError>;

    /// Loads one formal visibility applicability fact.
    async fn get_formal_visibility_applicability(
        &self,
        context: CapabilityOperationContext,
        query: GetFormalVisibilityApplicabilityQuery,
    ) -> Result<CapabilityQueryResponse<FormalVisibilityApplicabilityView>, ApplicationError>;

    /// Loads one controlled consumer-view snapshot.
    async fn get_controlled_consumer_view(
        &self,
        context: CapabilityOperationContext,
        query: GetControlledConsumerViewQuery,
    ) -> Result<CapabilityQueryResponse<ControlledConsumerViewView>, ApplicationError>;

    /// Lists query-visible controlled views for one runtime or tools consumer.
    async fn list_consumable_capabilities_for_runtime_tools(
        &self,
        context: CapabilityOperationContext,
        query: ListConsumableCapabilitiesForRuntimeToolsQuery,
    ) -> Result<CapabilityPageResponse<ControlledConsumerViewView>, ApplicationError>;

    /// Explains one SDK server exposure boundary.
    async fn get_sdk_exposure_boundary(
        &self,
        context: CapabilityOperationContext,
        query: GetSdkExposureBoundaryQuery,
    ) -> Result<CapabilityQueryResponse<SdkExposureBoundaryView>, ApplicationError>;
}
```

```rust
/// Application query surface for traceability, impact, and audit handoff reads.
#[async_trait::async_trait]
pub trait CapabilityTraceImpactQueryService: Send + Sync {
    /// Lists traceability revisions for one access truth subject.
    async fn get_capability_access_trace(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityAccessTraceQuery,
    ) -> Result<CapabilityPageResponse<CapabilityAccessTraceView>, ApplicationError>;

    /// Loads one capability change-impact fact.
    async fn get_capability_change_impact(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityChangeImpactQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityChangeImpactView>, ApplicationError>;

    /// Lists downstream impact summaries by typed scope.
    async fn get_downstream_consumption_impact_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetDownstreamConsumptionImpactSummaryQuery,
    ) -> Result<CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>, ApplicationError>;

    /// Loads one body-free traceability audit handoff summary.
    async fn get_audit_handoff_trace_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetAuditHandoffTraceSummaryQuery,
    ) -> Result<CapabilityQueryResponse<AuditHandoffTraceSummaryView>, ApplicationError>;
}

/// Application query surface for derived material and reconciliation reads.
#[async_trait::async_trait]
pub trait CapabilityDerivedMaterialQueryService: Send + Sync {
    /// Searches capability directory projections.
    async fn search_capability_directory(
        &self,
        context: CapabilityOperationContext,
        query: SearchCapabilityDirectoryQuery,
    ) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>;

    /// Browses capability directory projections in stable order.
    async fn browse_capability_directory(
        &self,
        context: CapabilityOperationContext,
        query: BrowseCapabilityDirectoryQuery,
    ) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>;

    /// Loads one audit-friendly export summary.
    async fn get_audit_friendly_export_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetAuditFriendlyExportSummaryQuery,
    ) -> Result<CapabilityQueryResponse<AuditFriendlyExportSummaryView>, ApplicationError>;

    /// Loads one read-only ecosystem discovery summary.
    async fn get_read_only_ecosystem_discovery_summary(
        &self,
        context: CapabilityOperationContext,
        query: GetReadOnlyEcosystemDiscoverySummaryQuery,
    ) -> Result<CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>, ApplicationError>;

    /// Loads one exact reconciliation report or a scope-bound report page.
    async fn get_capability_reconciliation_report(
        &self,
        context: CapabilityOperationContext,
        query: GetCapabilityReconciliationReportQuery,
    ) -> Result<CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>, ApplicationError>;
}

/// Application query surface for canonical reference and external-ref reads.
#[async_trait::async_trait]
pub trait CapabilityReferenceQueryService: Send + Sync {
    /// Loads one canonical reference-resolution state.
    async fn get_reference_resolution_state(
        &self,
        context: CapabilityOperationContext,
        query: GetReferenceResolutionStateQuery,
    ) -> Result<CapabilityQueryResponse<ReferenceResolutionStateView>, ApplicationError>;

    /// Loads one body-free external document reference.
    async fn get_external_document_reference(
        &self,
        context: CapabilityOperationContext,
        query: GetExternalDocumentReferenceQuery,
    ) -> Result<CapabilityQueryResponse<ExternalDocumentReferenceView>, ApplicationError>;

    /// Loads one body-free runtime or tools consumer reference.
    async fn get_runtime_tools_consumer_reference(
        &self,
        context: CapabilityOperationContext,
        query: GetRuntimeToolsConsumerReferenceQuery,
    ) -> Result<CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>, ApplicationError>;

    /// Loads one body-free SDK server-consumer reference.
    async fn get_sdk_exposure_consumer_reference(
        &self,
        context: CapabilityOperationContext,
        query: GetSdkExposureConsumerReferenceQuery,
    ) -> Result<CapabilityQueryResponse<SdkExposureConsumerReferenceView>, ApplicationError>;

    /// Loads one body-free observability or audit reference.
    async fn get_observability_audit_reference(
        &self,
        context: CapabilityOperationContext,
        query: GetObservabilityAuditReferenceQuery,
    ) -> Result<CapabilityQueryResponse<ObservabilityAuditReferenceView>, ApplicationError>;
}
```

service rules:

- every method first calls`context.assert_query_no_write()`,then the matchingStep 7 read-visibility resolver method,and only after an allowed resolution loads body / page repositories。
- `NotVisible`resolution returns public body-free surface without loading the requested body;`Degraded`loads only the protocol-declared partial body when the card permits it。
- service may compose exact / current repository reads but cannot parse ref strings、cursor internals、route text、error text or adapter private fields to derive scope / marker。
- no method callsUoW、idempotency / stored result、external resolver、handoff、event collaboration orrepository save / append。Clock is used only throughvisibility resolution / decision evaluation time,never to guess freshness。

### 8.12 Query route / service mapping

| closed query name | HTTP route | handler / application owner | request -> response body |
|---|---|---|---|
| `GetCapabilityIdentity` | `POST /v1/capability-hub/queries/get-capability-identity` | `get_capability_identity` / `identity_query_service` | `GetCapabilityIdentityQuery` -> `CapabilityIdentityView` |
| `SearchCapabilityIdentities` | `POST /v1/capability-hub/queries/search-capability-identities` | `search_capability_identities` / `identity_query_service` | `SearchCapabilityIdentitiesQuery` -> page of `CapabilityIdentitySearchItemView` |
| `GetCapabilityAccessReviewFact` | `POST /v1/capability-hub/queries/get-capability-access-review-fact` | `get_capability_access_review_fact` / `identity_query_service` | `GetCapabilityAccessReviewFactQuery` -> `CapabilityAccessReviewFactView` |
| `GetCapabilityRegistryEntry` | `POST /v1/capability-hub/queries/get-capability-registry-entry` | `get_capability_registry_entry` / `registry_query_service` | `GetCapabilityRegistryEntryQuery` -> `CapabilityRegistryEntryView` |
| `ListCapabilityRegistryEntries` | `POST /v1/capability-hub/queries/list-capability-registry-entries` | `list_capability_registry_entries` / `registry_query_service` | `ListCapabilityRegistryEntriesQuery` -> page of `CapabilityRegistryListItemView` |
| `GetRegistryVisibilitySemantics` | `POST /v1/capability-hub/queries/get-registry-visibility-semantics` | `get_registry_visibility_semantics` / `registry_query_service` | `GetRegistryVisibilitySemanticsQuery` -> `RegistryVisibilitySemanticsView` |
| `GetAdapterDescriptor` | `POST /v1/capability-hub/queries/get-adapter-descriptor` | `get_adapter_descriptor` / `descriptor_query_service` | `GetAdapterDescriptorQuery` -> `AdapterDescriptorView` |
| `GetDescriptorRiskConstraintSummary` | `POST /v1/capability-hub/queries/get-descriptor-risk-constraint-summary` | `get_descriptor_risk_constraint_summary` / `descriptor_query_service` | `GetDescriptorRiskConstraintSummaryQuery` -> `DescriptorRiskConstraintSummaryView` |
| `GetDescriptorSecretSafeSummary` | `POST /v1/capability-hub/queries/get-descriptor-secret-safe-summary` | `get_descriptor_secret_safe_summary` / `descriptor_query_service` | `GetDescriptorSecretSafeSummaryQuery` -> `DescriptorSecretSafeSummaryView` |
| `ListDescriptorsByCapability` | `POST /v1/capability-hub/queries/list-descriptors-by-capability` | `list_descriptors_by_capability` / `descriptor_query_service` | `ListDescriptorsByCapabilityQuery` -> page of `AdapterDescriptorView` |
| `GetGovernanceSeamRelation` | `POST /v1/capability-hub/queries/get-governance-seam-relation` | `get_governance_seam_relation` / `relation_query_service` | `GetGovernanceSeamRelationQuery` -> `GovernanceSeamRelationView` |
| `GetAccessGovernanceSeparation` | `POST /v1/capability-hub/queries/get-access-governance-separation` | `get_access_governance_separation` / `relation_query_service` | `GetAccessGovernanceSeparationQuery` -> `AccessGovernanceSeparationView` |
| `GetCapabilityMethodRelation` | `POST /v1/capability-hub/queries/get-capability-method-relation` | `get_capability_method_relation` / `relation_query_service` | `GetCapabilityMethodRelationQuery` -> `CapabilityMethodRelationView` |
| `ListCapabilityRelations` | `POST /v1/capability-hub/queries/list-capability-relations` | `list_capability_relations` / `relation_query_service` | `ListCapabilityRelationsQuery` -> page of `CapabilityRelationView` |
| `GetFormalExposureBoundary` | `POST /v1/capability-hub/queries/get-formal-exposure-boundary` | `get_formal_exposure_boundary` / `exposure_query_service` | `GetFormalExposureBoundaryQuery` -> `FormalExposureBoundaryView` |
| `GetFormalVisibilityApplicability` | `POST /v1/capability-hub/queries/get-formal-visibility-applicability` | `get_formal_visibility_applicability` / `exposure_query_service` | `GetFormalVisibilityApplicabilityQuery` -> `FormalVisibilityApplicabilityView` |
| `GetControlledConsumerView` | `POST /v1/capability-hub/queries/get-controlled-consumer-view` | `get_controlled_consumer_view` / `exposure_query_service` | `GetControlledConsumerViewQuery` -> `ControlledConsumerViewView` |
| `ListConsumableCapabilitiesForRuntimeTools` | `POST /v1/capability-hub/queries/list-consumable-capabilities-for-runtime-tools` | `list_consumable_capabilities_for_runtime_tools` / `exposure_query_service` | `ListConsumableCapabilitiesForRuntimeToolsQuery` -> page of `ControlledConsumerViewView` |
| `GetSdkExposureBoundary` | `POST /v1/capability-hub/queries/get-sdk-exposure-boundary` | `get_sdk_exposure_boundary` / `exposure_query_service` | `GetSdkExposureBoundaryQuery` -> `SdkExposureBoundaryView` |
| `GetCapabilityAccessTrace` | `POST /v1/capability-hub/queries/get-capability-access-trace` | `get_capability_access_trace` / `trace_impact_query_service` | `GetCapabilityAccessTraceQuery` -> page of `CapabilityAccessTraceView` |
| `GetCapabilityChangeImpact` | `POST /v1/capability-hub/queries/get-capability-change-impact` | `get_capability_change_impact` / `trace_impact_query_service` | `GetCapabilityChangeImpactQuery` -> `CapabilityChangeImpactView` |
| `GetDownstreamConsumptionImpactSummary` | `POST /v1/capability-hub/queries/get-downstream-consumption-impact-summary` | `get_downstream_consumption_impact_summary` / `trace_impact_query_service` | `GetDownstreamConsumptionImpactSummaryQuery` -> page of `DownstreamConsumptionImpactSummaryView` |
| `GetAuditHandoffTraceSummary` | `POST /v1/capability-hub/queries/get-audit-handoff-trace-summary` | `get_audit_handoff_trace_summary` / `trace_impact_query_service` | `GetAuditHandoffTraceSummaryQuery` -> `AuditHandoffTraceSummaryView` |
| `SearchCapabilityDirectory` | `POST /v1/capability-hub/queries/search-capability-directory` | `search_capability_directory` / `derived_material_query_service` | `SearchCapabilityDirectoryQuery` -> page of `CapabilityDirectoryProjectionView` |
| `BrowseCapabilityDirectory` | `POST /v1/capability-hub/queries/browse-capability-directory` | `browse_capability_directory` / `derived_material_query_service` | `BrowseCapabilityDirectoryQuery` -> page of `CapabilityDirectoryProjectionView` |
| `GetAuditFriendlyExportSummary` | `POST /v1/capability-hub/queries/get-audit-friendly-export-summary` | `get_audit_friendly_export_summary` / `derived_material_query_service` | `GetAuditFriendlyExportSummaryQuery` -> `AuditFriendlyExportSummaryView` |
| `GetReadOnlyEcosystemDiscoverySummary` | `POST /v1/capability-hub/queries/get-read-only-ecosystem-discovery-summary` | `get_read_only_ecosystem_discovery_summary` / `derived_material_query_service` | `GetReadOnlyEcosystemDiscoverySummaryQuery` -> `ReadOnlyEcosystemDiscoverySummaryView` |
| `GetCapabilityReconciliationReport` | `POST /v1/capability-hub/queries/get-capability-reconciliation-report` | `get_capability_reconciliation_report` / `derived_material_query_service` | `GetCapabilityReconciliationReportQuery` -> `CapabilityReconciliationReportQueryBody` |
| `GetReferenceResolutionState` | `POST /v1/capability-hub/queries/get-reference-resolution-state` | `get_reference_resolution_state` / `reference_query_service` | `GetReferenceResolutionStateQuery` -> `ReferenceResolutionStateView` |
| `GetExternalDocumentReference` | `POST /v1/capability-hub/queries/get-external-document-reference` | `get_external_document_reference` / `reference_query_service` | `GetExternalDocumentReferenceQuery` -> `ExternalDocumentReferenceView` |
| `GetRuntimeToolsConsumerReference` | `POST /v1/capability-hub/queries/get-runtime-tools-consumer-reference` | `get_runtime_tools_consumer_reference` / `reference_query_service` | `GetRuntimeToolsConsumerReferenceQuery` -> `RuntimeToolsConsumerReferenceView` |
| `GetSdkExposureConsumerReference` | `POST /v1/capability-hub/queries/get-sdk-exposure-consumer-reference` | `get_sdk_exposure_consumer_reference` / `reference_query_service` | `GetSdkExposureConsumerReferenceQuery` -> `SdkExposureConsumerReferenceView` |
| `GetObservabilityAuditReference` | `POST /v1/capability-hub/queries/get-observability-audit-reference` | `get_observability_audit_reference` / `reference_query_service` | `GetObservabilityAuditReferenceQuery` -> `ObservabilityAuditReferenceView` |

所有route只接受schema version `1`和exact body。Unknown route / name、method非`POST`、route-name-body不对称在application前拒绝。Query不支持generic search across truth families、bulk body lookup、runtime invocation、tools execution、marketplace listing lookup或hidden admin alias。

### 8.13 Identity / review and registry independent Query protocol cards

本组每张卡都是独立协议真相源。所有请求的actor、trace、consistency和request metadata只来自`CapabilityQueryRequest<T>` envelope；body只承载卡中列出的target / filter / page字段。`CapabilityReadVisibilityResolverPort`必须由application service持有并先于任何body repository读取执行；handler不得持有resolver或repository。

#### 8.13.1 `GetCapabilityIdentity`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-identity`;受信同步capability identity read caller |
| API handler | `CapabilityQueryHandlers::get_capability_identity(CapabilityQueryRequest<GetCapabilityIdentityQuery>) -> Result<CapabilityQueryResponse<CapabilityIdentityView>, ApplicationError>` |
| application service | `CapabilityIdentityQueryService::get_capability_identity(CapabilityOperationContext, GetCapabilityIdentityQuery) -> Result<CapabilityQueryResponse<CapabilityIdentityView>, ApplicationError>` |
| exact request / response schema | §8.2 `GetCapabilityIdentityQuery { identity_ref }` -> `CapabilityIdentityView`;shared §6.3 `CapabilityQueryRequest<T>` / `CapabilityQueryResponse<T>` / `CapabilityQuerySurface` |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_subject(actor, CapabilityReadSubjectRef::Identity(identity_ref.id))` |
| Step 9 flow | `query_get_capability_identity_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `identity_ref` | caller exact typed ref;missing -> `MissingRequiredField`;malformed / wrong kind -> `InvalidField`;exact version is a read selector,not an optimistic expected version | `CapabilityIdentityRepository::get_with_version(identity_ref)` after resolver |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `identity_ref`;`identity_key`;`identity_state`;`version`;`created_at`;`updated_at` | copied from loaded `CapabilityIdentity`;visible repository miss -> `body=None`;loaded id / version mismatch -> `ApplicationError::ConsistencyDefect(DomainObject(CapabilityIdentity), PersistedVersionSymmetry)` with no half body |
| `source_ref_id` | copied from the loaded identity's registered source relation and must match the loaded `ExternalCapabilitySourceRef` subject;once identity is loaded,missing registered source object -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` |
| `source_kind` | copied from `CapabilityExternalReferenceRepository::get_with_version(ReferenceSubjectRef::ExternalCapabilitySource(source_ref_id))`;wrong union variant -> `ConsistencyDefect(DomainObject(ExternalCapabilitySourceReference), PersistedVariantShape)` |
| `source_resolution_state_ref`;`source_resolution_value` | copied from `ReferenceResolutionStateRepository::find_current_by_subject(ExternalCapabilitySource(source_ref_id))`;registered ref without current state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;state subject / id / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;a complete unresolved value remains `Degraded(ReferenceUnresolved)` without external lookup |
| `review_summary.review_fact_ref`;`review_state`;`risk_summary`;`separation_marker` | copied only from `CapabilityAccessReviewRepository::find_current_by_identity(identity_ref.id)`;absence on both identity link and current index -> `review_summary=None`;one-sided link、owner or version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` and no fabricated summary |
| `surface` | resolver `NotVisible` returns `body=None` before identity load;complete direct truth uses `Visible/NotApplicable`;allowed reference degradation uses only §6.3 typed markers and exact loaded source versions |
| no-write gate | `context.assert_query_no_write()` first;no UoW、idempotency、stored result、external resolver、refresh、save、append、handoff or event collaboration |

#### 8.13.2 `SearchCapabilityIdentities`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/search-capability-identities`;受信同步identity directory maintainer / read consumer |
| API handler | `CapabilityQueryHandlers::search_capability_identities(CapabilityQueryRequest<SearchCapabilityIdentitiesQuery>) -> Result<CapabilityPageResponse<CapabilityIdentitySearchItemView>, ApplicationError>` |
| application service | `CapabilityIdentityQueryService::search_capability_identities(CapabilityOperationContext, SearchCapabilityIdentitiesQuery) -> Result<CapabilityPageResponse<CapabilityIdentitySearchItemView>, ApplicationError>` |
| exact request / response schema | §8.2 `SearchCapabilityIdentitiesQuery { identity_key, identity_states, source_ref_id, source_kind, page }` -> page of `CapabilityIdentitySearchItemView`;shared §6.3 / §6.4 |
| visibility resolver | build `CapabilityIdentityRepositorySearchScope`,then call `CapabilityReadVisibilityResolverPort::resolve_identity_search(actor, &scope)` before `search` |
| Step 9 flow | `query_search_capability_identities_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `identity_key` | optional caller exact stable key;malformed present value -> `InvalidField`;missing means no key filter | copied to `CapabilityIdentityRepositorySearchScope.identity_key` |
| `identity_states` | caller closed duplicate-free state set;unknown state -> `InvalidField`;empty means all lifecycle states | copied in canonical stable order to `scope.identity_states` |
| `source_ref_id` | optional caller typed source ref id;wrong kind -> `InvalidField`;missing means no exact source filter | copied to `scope.source_ref_id` |
| `source_kind` | optional caller closed source family;unknown value -> `InvalidField`;missing means no source-kind filter | copied to `scope.source_kind`;the repository does not inspect locator text |
| `page.cursor`;`page.limit` | cursor optional but must be bound to this query and the same four-filter scope;limit missing / zero / over configured max -> `MissingRequiredField` / `InvalidPage` | §6.4 mapper -> `CapabilityRepositoryPageRequest` |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| item `identity_ref`;`identity_key`;`source_ref_id`;`identity_state`;`version`;`updated_at` | copied 1:1 from each `Loaded<CapabilityIdentity>` returned by `CapabilityIdentityRepository::search(scope, page)`;no per-item source,review,registry or projection lookup |
| `items` order | preserves repository stable order after visibility mapping;filtered-out items are not replaced with hidden ids or placeholder rows |
| `page.next_cursor`;`returned_count`;`has_more` | opaque one-way mapping from repository `next_cursor`,final visible item length,and `next_cursor.is_some()`;cursor internals never reach contracts |
| `surface` / empty | page-level resolver `NotVisible` returns empty items and no cursor without calling `search`;visible empty page is `Visible`,empty,no `Missing` marker;resolver `Degraded` may return only policy-allowed partial items |
| loaded page consistency | item version or typed filter mismatch -> `ConsistencyDefect(PortReturn(CapabilityIdentityRepository), RepositoryAccessShape)`;the service does not drop the row or return a partial prefix |
| repository failure | typed `ApplicationError`;not converted to visible empty or `NotVisible` |
| no-write gate | no UoW、idempotency、stored result、source refresh、projection mutation、save / append or external calls |

#### 8.13.3 `GetCapabilityAccessReviewFact`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-access-review-fact`;受信同步access-review read caller,not governance approval authority |
| API handler | `CapabilityQueryHandlers::get_capability_access_review_fact(CapabilityQueryRequest<GetCapabilityAccessReviewFactQuery>) -> Result<CapabilityQueryResponse<CapabilityAccessReviewFactView>, ApplicationError>` |
| application service | `CapabilityIdentityQueryService::get_capability_access_review_fact(CapabilityOperationContext, GetCapabilityAccessReviewFactQuery) -> Result<CapabilityQueryResponse<CapabilityAccessReviewFactView>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityReviewFactQuerySelector`;§8.2 `GetCapabilityAccessReviewFactQuery { selector }` -> `CapabilityAccessReviewFactView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, AccessReviewFact(review_ref.id))`;`CurrentByIdentity` -> `resolve_subject(actor, Identity(identity_ref.id))`;resolver runs before review / identity load |
| Step 9 flow | `query_get_capability_access_review_fact_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.review_ref` | caller exact typed review ref;missing payload -> `MissingRequiredField`;wrong variant / version -> `InvalidField` | `CapabilityAccessReviewRepository::get_with_version(review_ref)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField`;identity not visible never leaks current-review existence | after resolution,`CapabilityIdentityRepository::get_with_version(identity_ref)` validates exact owner,then `find_current_by_identity(identity_ref.id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `review_fact_ref`;`review_context`;`risk_summary`;`separation_marker`;`review_state`;`recorded_by`;`version`;`recorded_at`;`updated_at` | copied from the loaded `CapabilityAccessReviewFact`;no governance result / policy body fallback |
| `identity_ref` | formed only from `CapabilityIdentityRepository::find_by_id(review.identity_id)` current typed identity;after a review is loaded,missing owner -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and owner / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;no guessed ref string |
| `body` | visible exact miss or no current recorded fact -> `None`;superseded / invalidated exact fact remains readable when visibility allows and retains its explicit state |
| `surface` | resolver `NotVisible` stops before body load;complete review truth uses `Visible/NotApplicable`;visible exact review or current-by-identity miss remains `body=None`;loaded identity-review inconsistency is a technical `ConsistencyDefect`,not a degraded success |
| no-write gate | no UoW、review supersede / record、governance resolver、idempotency、stored result、trace append or audit handoff |

#### 8.13.4 `GetCapabilityRegistryEntry`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-registry-entry`;受信同步registry read caller |
| API handler | `CapabilityQueryHandlers::get_capability_registry_entry(CapabilityQueryRequest<GetCapabilityRegistryEntryQuery>) -> Result<CapabilityQueryResponse<CapabilityRegistryEntryView>, ApplicationError>` |
| application service | `CapabilityRegistryQueryService::get_capability_registry_entry(CapabilityOperationContext, GetCapabilityRegistryEntryQuery) -> Result<CapabilityQueryResponse<CapabilityRegistryEntryView>, ApplicationError>` |
| exact request / response schema | §8.3 `GetCapabilityRegistryEntryQuery { registry_entry_ref }` -> `CapabilityRegistryEntryView`;shared §6.3 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_subject(actor, RegistryEntry(registry_entry_ref.id))` before repository load |
| Step 9 flow | `query_get_capability_registry_entry_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `registry_entry_ref` | caller exact typed ref;missing -> `MissingRequiredField`;malformed / wrong kind -> `InvalidField` | `CapabilityRegistryRepository::get_with_version(registry_entry_ref)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `registry_entry_ref`;`lifecycle_state`;`lifecycle_reason`;`lifecycle_effective_at`;`visibility_basis`;`descriptor_ref`;`version`;`created_at`;`updated_at` | copied from loaded `CapabilityRegistryEntry`;`descriptor_ref=None` is valid truth and does not trigger descriptor lookup |
| `identity_ref` | loaded with `CapabilityIdentityRepository::find_by_id(entry.identity_id)` and copied as exact typed ref;after an entry is loaded,missing identity -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and id / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` | visible entry miss -> `None`;retired exact entry remains readable when allowed and retains `Retired` state |
| `surface` | resolver `NotVisible` returns no body / entry id before repository load;complete direct truth -> `Visible/NotApplicable`;visible entry miss remains `body=None`;loaded owner-chain inconsistency returns technical `ConsistencyDefect` |
| no-write gate | no UoW、lifecycle transition、descriptor binding、idempotency、stored result、save / append or derived-material refresh |

#### 8.13.5 `ListCapabilityRegistryEntries`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/list-capability-registry-entries`;受信同步registry directory caller |
| API handler | `CapabilityQueryHandlers::list_capability_registry_entries(CapabilityQueryRequest<ListCapabilityRegistryEntriesQuery>) -> Result<CapabilityPageResponse<CapabilityRegistryListItemView>, ApplicationError>` |
| application service | `CapabilityRegistryQueryService::list_capability_registry_entries(CapabilityOperationContext, ListCapabilityRegistryEntriesQuery) -> Result<CapabilityPageResponse<CapabilityRegistryListItemView>, ApplicationError>` |
| exact request / response schema | §8.3 `ListCapabilityRegistryEntriesQuery { identity_ref, lifecycle_states, visibility_basis, page }` -> page of `CapabilityRegistryListItemView`;shared §6.3 / §6.4 |
| visibility resolver | build `CapabilityRegistryRepositoryListScope`,then `CapabilityReadVisibilityResolverPort::resolve_registry_list(actor, &scope)` before `list_matching` |
| Step 9 flow | `query_list_capability_registry_entries_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `identity_ref` | optional caller exact typed identity;malformed present value -> `InvalidField`;missing means all visible identities | validate ref shape without body load;copy `identity_ref.id` to `scope.identity_id` |
| `lifecycle_states` | caller closed duplicate-free states;unknown -> `InvalidField`;empty means all | canonical stable vector -> `scope.lifecycle_states` |
| `visibility_basis` | optional exact body-free basis;forbidden listing / runtime predicate -> `BodyForbidden`;missing means no basis filter | copied to `scope.visibility_basis` |
| `page.cursor`;`page.limit` | cursor must match query + identity/state/basis scope;zero / over max -> `InvalidPage` | §6.4 application page mapper |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| item `registry_entry_ref`;`capability_identity_id`;`lifecycle_state`;`visibility_basis`;`descriptor_ref`;`version`;`updated_at` | copied only from each repository `Loaded<CapabilityRegistryEntry>`;list does not load identity body、formal exposure、directory projection、runtime availability or marketplace listing |
| `page` | repository cursor is wrapped opaquely;`returned_count` is final item count;`has_more` derives only from next cursor |
| `surface` / empty | resolver `NotVisible` returns canonical empty page before list;visible empty is normal `Visible` empty;repository failure remains `ApplicationError`;item truth freshness is `NotApplicable` |
| loaded page consistency | item version or filter mismatch -> `ConsistencyDefect(PortReturn(CapabilityRegistryRepository), RepositoryAccessShape)`;no silent filtering or empty-page fallback |
| no-write gate | no UoW、registry mutation、projection rebuild、idempotency、stored result、save / append or runtime lookup |

#### 8.13.6 `GetRegistryVisibilitySemantics`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-registry-visibility-semantics`;受信同步registry / exposure explanation caller |
| API handler | `CapabilityQueryHandlers::get_registry_visibility_semantics(CapabilityQueryRequest<GetRegistryVisibilitySemanticsQuery>) -> Result<CapabilityQueryResponse<RegistryVisibilitySemanticsView>, ApplicationError>` |
| application service | `CapabilityRegistryQueryService::get_registry_visibility_semantics(CapabilityOperationContext, GetRegistryVisibilitySemanticsQuery) -> Result<CapabilityQueryResponse<RegistryVisibilitySemanticsView>, ApplicationError>` |
| exact request / response schema | §8.1 `RegistryVisibilityQuerySelector`;§8.3 `GetRegistryVisibilitySemanticsQuery { selector }` -> `RegistryVisibilitySemanticsView`;shared §6.3 |
| visibility resolver | `RegistryEntry` -> `resolve_subject(actor, RegistryEntry(entry_ref.id))`;`CurrentByIdentity` -> `resolve_subject(actor, Identity(identity_ref.id))`;always before owner-chain reads |
| Step 9 flow | `query_get_registry_visibility_semantics_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.RegistryEntry.registry_entry_ref` | caller exact typed entry ref;missing payload -> `MissingRequiredField`;wrong variant -> `InvalidField` | `CapabilityRegistryRepository::get_with_version(entry_ref)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField`;not visible stops before lookup | after resolution,validate with `CapabilityIdentityRepository::get_with_version`,then `CapabilityRegistryRepository::find_current_by_identity(identity_ref.id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `registry_entry_ref`;`lifecycle_state`;`visibility_basis` | copied from selected/current `CapabilityRegistryEntry` |
| `identity_ref` | exact current identity from `CapabilityIdentityRepository::find_by_id(entry.identity_id)`;once entry is loaded,missing owner -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `formal_exposure_ref` | copied from `FormalExposureRepository::find_current_by_registry_entry(entry.id)`;no current exposure -> `None`,not degraded by itself |
| `visibility_applicability_id`;`formal_visibility_state` | when exposure exists,copied from `FormalVisibilityRepository::find_current_by_exposure(exposure.id)`;no visibility -> both `None` only when the Step 10 lifecycle matrix permits absence;required visibility absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;owner / source-version contradiction -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `surface` | visible missing entry -> `body=None`;resolver `NotVisible` returns no selector identity / body;complete composed direct-truth read uses exact entry/exposure/visibility source versions;absence never creates an exposure or approval result |
| no-write gate | no UoW、formal exposure formation、visibility evaluation mutation、runtime authorization、idempotency、stored result、save / append or external call |

### 8.14 Descriptor / safe-summary and relation independent Query protocol cards

本组只返回body-free descriptor、safe summary和关系truth。`CapabilityExternalReferenceRepository`与`ReferenceResolutionStateRepository`只读取本仓登记的typed ref / canonical state；任何Query都不得调用secret、governance、method-library external resolver，也不得读取相邻仓正文。

#### 8.14.1 `GetAdapterDescriptor`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-adapter-descriptor`;受信同步descriptor read caller |
| API handler | `CapabilityQueryHandlers::get_adapter_descriptor(CapabilityQueryRequest<GetAdapterDescriptorQuery>) -> Result<CapabilityQueryResponse<AdapterDescriptorView>, ApplicationError>` |
| application service | `CapabilityDescriptorQueryService::get_adapter_descriptor(CapabilityOperationContext, GetAdapterDescriptorQuery) -> Result<CapabilityQueryResponse<AdapterDescriptorView>, ApplicationError>` |
| exact request / response schema | §8.1 `AdapterDescriptorQuerySelector`;§8.4 `GetAdapterDescriptorQuery { selector }` -> `AdapterDescriptorView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, AdapterDescriptor(descriptor_ref.id))`;`CurrentByIdentity` -> `resolve_subject(actor, Identity(identity_ref.id))`;resolver always precedes owner-chain load |
| Step 9 flow | `query_get_adapter_descriptor_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.descriptor_ref` | caller exact typed descriptor ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `AdapterDescriptorRepository::get_with_version(descriptor_ref)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField`;not visible stops all body reads | after resolver,identity exact validation -> `CapabilityRegistryRepository::find_current_by_identity(identity_ref.id)` -> `AdapterDescriptorRepository::find_current_by_registry_entry(entry.id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `descriptor_ref`;`registry_entry_id`;`source_ref_id`;`descriptor_kind`;`connection_boundary_summary`;`risk_summary_id`;`secret_ref_id`;`descriptor_state`;`version`;`created_at`;`updated_at` | copied 1:1 from loaded `AdapterDescriptor`;optional summary/ref ids remain `None` when not attached and do not trigger hidden body reads |
| `body` | visible exact miss,or current selector with no registry / current descriptor -> `None`;loaded identity / registry / descriptor owner or version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` rather than selecting another descriptor |
| `surface` | complete descriptor truth -> `Visible/NotApplicable`;resolver `NotVisible` prevents repository load;degraded descriptor state is copied explicitly and never replaced by provider runtime status |
| no-write gate | no UoW、descriptor accept / replace、risk or secret summary creation、idempotency、stored result、external source lookup、save / append or refresh |

#### 8.14.2 `GetDescriptorRiskConstraintSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-descriptor-risk-constraint-summary`;受信同步descriptor risk-summary caller |
| API handler | `CapabilityQueryHandlers::get_descriptor_risk_constraint_summary(CapabilityQueryRequest<GetDescriptorRiskConstraintSummaryQuery>) -> Result<CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>, ApplicationError>` |
| application service | `CapabilityDescriptorQueryService::get_descriptor_risk_constraint_summary(CapabilityOperationContext, GetDescriptorRiskConstraintSummaryQuery) -> Result<CapabilityQueryResponse<DescriptorRiskConstraintSummaryView>, ApplicationError>` |
| exact request / response schema | §8.1 `DescriptorRiskSummaryQuerySelector`;§8.4 `GetDescriptorRiskConstraintSummaryQuery { selector }` -> `DescriptorRiskConstraintSummaryView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, DescriptorRiskSummary(summary_id))`;`CurrentByDescriptor` -> `resolve_subject(actor, AdapterDescriptor(descriptor_ref.id))` |
| Step 9 flow | `query_get_descriptor_risk_constraint_summary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.summary_id` | caller stable typed id;missing payload -> `MissingRequiredField`;malformed -> `InvalidField` | `DescriptorSafeSummaryRepository::get_risk_summary_with_version(summary_id)` |
| `selector.CurrentByDescriptor.descriptor_ref` | caller exact typed descriptor ref;missing payload -> `MissingRequiredField`;visible descriptor or current-summary miss -> `body=None`;a successfully loaded mismatched row -> technical consistency error | after resolver,`AdapterDescriptorRepository::get_with_version(descriptor_ref)` validates owner,then `find_current_risk_summary(descriptor_ref.id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `summary_id`;`adapter_descriptor_id`;`risk_level`;`constraint_summary`;`sensitive_boundary_marker`;`summary_state`;`version`;`created_at`;`updated_at` | copied only from loaded `DescriptorRiskConstraintSummary`;no governance approval、secret detail or runtime risk calculation enters the view |
| `body` | visible exact miss or no current summary -> `None`;a missing summary never means low risk;loaded descriptor / summary owner or version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `surface` | direct body-free truth uses `Visible/NotApplicable`;`Forbidden` summary state may map `Degraded/Unavailable + Redacted` without exposing rejected text;`NotVisible` returns no id/body |
| no-write gate | no UoW、risk evaluation mutation、summary refresh、external resolver、idempotency、stored result、save / append or governance call |

#### 8.14.3 `GetDescriptorSecretSafeSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-descriptor-secret-safe-summary`;受信同步secret-boundary safe-summary caller with no secret-body authority |
| API handler | `CapabilityQueryHandlers::get_descriptor_secret_safe_summary(CapabilityQueryRequest<GetDescriptorSecretSafeSummaryQuery>) -> Result<CapabilityQueryResponse<DescriptorSecretSafeSummaryView>, ApplicationError>` |
| application service | `CapabilityDescriptorQueryService::get_descriptor_secret_safe_summary(CapabilityOperationContext, GetDescriptorSecretSafeSummaryQuery) -> Result<CapabilityQueryResponse<DescriptorSecretSafeSummaryView>, ApplicationError>` |
| exact request / response schema | §8.1 `DescriptorSecretSummaryQuerySelector`;§8.4 `GetDescriptorSecretSafeSummaryQuery { selector }` -> `DescriptorSecretSafeSummaryView`;shared §6.3 |
| visibility resolver | `CurrentByDescriptor` -> `resolve_subject(actor, AdapterDescriptor(descriptor_ref.id))`;`CurrentBySecretRef` -> `resolve_subject(actor, ExternalReference(ReferenceSubjectRef::Secret(secret_ref_id)))`;resolver precedes summary/ref/state load |
| Step 9 flow | `query_get_descriptor_secret_safe_summary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.CurrentByDescriptor.descriptor_ref` | caller exact typed descriptor ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | validate exact descriptor after resolution,then `DescriptorSafeSummaryRepository::find_current_secret_summary_by_descriptor(descriptor_ref.id)` |
| `selector.CurrentBySecretRef.secret_ref_id` | caller local typed secret-ref id;missing payload -> `MissingRequiredField`;not a secret subject -> `InvalidField` | `DescriptorSafeSummaryRepository::find_current_secret_summary(secret_ref_id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `safe_summary_id`;`handling_boundary`;`exposure_safety_marker`;`safe_summary_state`;`version`;`refreshed_at` | copied from loaded `SecretHandlingSafeSummary`;summary `secret_ref_id` must equal the selected / linked ref id |
| `secret_ref_id`;`secret_provider_ref`;`secret_usage_scope` | copied from `CapabilityExternalReferenceRepository::get_with_version(ReferenceSubjectRef::Secret(secret_ref_id))` after verifying the returned union is `CapabilityExternalReference::Secret` |
| `resolution_state_ref`;`resolution_value` | copied from `ReferenceResolutionStateRepository::find_current_by_subject(ReferenceSubjectRef::Secret(secret_ref_id))`;state id must equal the ref object's canonical state id |
| `body` / degradation | no current summary -> visible `None`;once a summary is loaded,missing registered secret ref or current state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;wrong union / id / owner / version -> `ConsistencyDefect(DomainObject(SecretReference) or CrossStoreRelation, PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry)`;only a complete canonical Unresolved / Stale / Expired / Unavailable / Forbidden state maps to the declared degraded surface |
| `surface` | resolver `NotVisible` stops before all three repositories;allowed degraded body contains only the declared safe fields;no provider response、secret path credential、token、ciphertext or value |
| no-write gate | no UoW、`SecretReferencePort`、secret manager、safe-summary creation / refresh、idempotency、stored result、save / append or external network call |

#### 8.14.4 `ListDescriptorsByCapability`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/list-descriptors-by-capability`;受信同步descriptor-history caller |
| API handler | `CapabilityQueryHandlers::list_descriptors_by_capability(CapabilityQueryRequest<ListDescriptorsByCapabilityQuery>) -> Result<CapabilityPageResponse<AdapterDescriptorView>, ApplicationError>` |
| application service | `CapabilityDescriptorQueryService::list_descriptors_by_capability(CapabilityOperationContext, ListDescriptorsByCapabilityQuery) -> Result<CapabilityPageResponse<AdapterDescriptorView>, ApplicationError>` |
| exact request / response schema | §8.4 `ListDescriptorsByCapabilityQuery { identity_ref, page }` -> page of `AdapterDescriptorView`;shared §6.3 / §6.4 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_descriptor_history(actor, identity_ref.id)` returns `DescriptorCollection(identity_ref.id)` before identity / registry / descriptor reads |
| Step 9 flow | `query_list_descriptors_by_capability_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `identity_ref` | caller exact typed identity ref;missing -> `MissingRequiredField`;malformed -> `InvalidField`;exact ref is validated only after page-level resolution permits body reads | `CapabilityIdentityRepository::get_with_version(identity_ref)`,then `CapabilityRegistryRepository::find_current_by_identity(identity_ref.id)` |
| `page.cursor`;`page.limit` | cursor bound to this identity and query;zero / over max -> `InvalidPage` | mapped to repository page for `AdapterDescriptorRepository::list_by_registry_entry(entry.id, page)` |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| each `AdapterDescriptorView` field | all eleven fields are copied from each loaded descriptor exactly as §8.14.1;page items never load risk summary、secret safe summary、source body or provider runtime state |
| `page` | preserves descriptor-history repository order;opaque next cursor,final item count,and next-cursor-derived `has_more` follow §6.4 |
| `surface` / empty | visible exact identity miss or no current registry -> visible empty page;resolver `NotVisible` -> canonical empty/no cursor before repository reads;loaded identity / registry / descriptor page owner or version mismatch -> technical `ConsistencyDefect`,not another identity's history or a degraded empty success |
| no-write gate | no UoW、descriptor replacement、summary refresh、idempotency、stored result、save / append or external resolver |

#### 8.14.5 `GetGovernanceSeamRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-governance-seam-relation`;受信同步governance-seam read caller,not governance approver |
| API handler | `CapabilityQueryHandlers::get_governance_seam_relation(CapabilityQueryRequest<GetGovernanceSeamRelationQuery>) -> Result<CapabilityQueryResponse<GovernanceSeamRelationView>, ApplicationError>` |
| application service | `CapabilityRelationQueryService::get_governance_seam_relation(CapabilityOperationContext, GetGovernanceSeamRelationQuery) -> Result<CapabilityQueryResponse<GovernanceSeamRelationView>, ApplicationError>` |
| exact request / response schema | §8.1 `GovernanceSeamQuerySelector`;§8.5 `GetGovernanceSeamRelationQuery { selector }` -> `GovernanceSeamRelationView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, GovernanceSeam(seam_ref.id))`;`CurrentByIdentity` -> `resolve_subject(actor, Identity(identity_ref.id))` |
| Step 9 flow | `query_get_governance_seam_relation_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.seam_relation_ref` | caller exact typed relation ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `GovernanceSeamRepository::get_with_version(seam_relation_ref)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField`;not visible stops before lookup | after resolver,identity exact validation,then `GovernanceSeamRepository::find_current_by_identity(identity_ref.id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `seam_relation_ref`;`capability_identity_id`;`governance_result_ref_id`;`seam_state`;`allowed_safe_summary`;`version`;`created_at`;`updated_at` | copied from loaded `GovernanceSeamRelation` |
| `governance_ref_kind`;`governance_source`;`result_scope_summary` | copied from `CapabilityExternalReferenceRepository::get_with_version(ReferenceSubjectRef::GovernanceResult(governance_result_ref_id))`;once relation is loaded,missing ref -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and wrong union / owner / version -> `ConsistencyDefect(DomainObject(GovernanceResultReference) or CrossStoreRelation, PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `resolution_state_ref`;`resolution_value` | copied from `ReferenceResolutionStateRepository::find_current_by_subject(GovernanceResult(governance_result_ref_id))`;registered ref without current state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;state-id / subject / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;a complete non-resolved value remains explicit |
| `body` / surface | visible missing relation -> `None`;complete paired body-free truth -> state-mapped visible / degraded success;resolver `NotVisible` hides selector subject;loaded pair inconsistency returns technical `ConsistencyDefect` and never a half body |
| no-write gate | no UoW、governance approval / vote / Policy read、`GovernanceResultReferencePort`、relation replacement、idempotency、stored result、save / append or external call |

#### 8.14.6 `GetAccessGovernanceSeparation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-access-governance-separation`;受信同步boundary-explanation caller |
| API handler | `CapabilityQueryHandlers::get_access_governance_separation(CapabilityQueryRequest<GetAccessGovernanceSeparationQuery>) -> Result<CapabilityQueryResponse<AccessGovernanceSeparationView>, ApplicationError>` |
| application service | `CapabilityRelationQueryService::get_access_governance_separation(CapabilityOperationContext, GetAccessGovernanceSeparationQuery) -> Result<CapabilityQueryResponse<AccessGovernanceSeparationView>, ApplicationError>` |
| exact request / response schema | §8.1 `AccessGovernanceSeparationQuerySelector`;§8.5 `GetAccessGovernanceSeparationQuery { selector }` -> `AccessGovernanceSeparationView`;shared §6.3 |
| visibility resolver | `Identity` -> `resolve_subject(actor, Identity(identity_ref.id))`;`ReviewFact` -> `resolve_subject(actor, AccessReviewFact(review_ref.id))`;always before body load |
| Step 9 flow | `query_get_access_governance_separation_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Identity.identity_ref` | caller exact identity ref;missing payload -> `MissingRequiredField`;malformed -> `InvalidField` | exact identity validation,then `CapabilityAccessReviewRepository::find_current_by_identity(identity_ref.id)` |
| `selector.ReviewFact.review_fact_ref` | caller exact review ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `CapabilityAccessReviewRepository::get_with_version(review_fact_ref)`,then `CapabilityIdentityRepository::find_by_id(review.identity_id)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `identity_ref` | selected exact identity,or exact current typed ref loaded by review owner id;never parsed from review-ref text |
| `review_fact_ref`;`review_state`;`separation_marker` | copied from selected/current `CapabilityAccessReviewFact`;no recorded/current review -> visible `body=None`,not an implied approval result |
| `seam_relation_ref`;`seam_state` | copied from optional `GovernanceSeamRepository::find_current_by_identity(identity_id)`;no seam -> both `None` and the separation view remains valid |
| `surface` | complete view is direct truth `Visible/NotApplicable`;visible identity / review miss remains `body=None`;loaded review-owner/current-link or present optional seam owner/version mismatch -> technical `ConsistencyDefect`;resolver `NotVisible` returns no identity/review/seam ids;governance result body is never loaded |
| no-write gate | no UoW、review record / supersede、seam attach、approval evaluation、idempotency、stored result、save / append or external resolver |

#### 8.14.7 `GetCapabilityMethodRelation`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-method-relation`;受信同步method-relation read caller |
| API handler | `CapabilityQueryHandlers::get_capability_method_relation(CapabilityQueryRequest<GetCapabilityMethodRelationQuery>) -> Result<CapabilityQueryResponse<CapabilityMethodRelationView>, ApplicationError>` |
| application service | `CapabilityRelationQueryService::get_capability_method_relation(CapabilityOperationContext, GetCapabilityMethodRelationQuery) -> Result<CapabilityQueryResponse<CapabilityMethodRelationView>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityMethodRelationQuerySelector`;§8.5 `GetCapabilityMethodRelationQuery { selector }` -> `CapabilityMethodRelationView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, MethodRelation(relation_ref.id))`;`CurrentByIdentity` / `IdentityAndMethodAsset` -> `resolve_subject(actor, Identity(identity_ref.id))` |
| Step 9 flow | `query_get_capability_method_relation_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.method_relation_ref` | caller exact typed relation ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `CapabilityMethodRelationRepository::get_with_version(method_relation_ref)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField` | identity exact validation,then `find_current_by_identity(identity_ref.id)` |
| `selector.IdentityAndMethodAsset.identity_ref` | caller exact typed identity endpoint;missing -> `MissingRequiredField`;not visible stops before lookup | identity exact validation,then same current-by-identity lookup |
| `selector.IdentityAndMethodAsset.method_asset_ref_id` | caller local typed method endpoint;missing -> `MissingRequiredField`;current relation with a different endpoint -> visible `None` | exact equality check against loaded relation;no method-only repository search |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `method_relation_ref`;`capability_identity_id`;`method_asset_ref_id`;`relation_scope`;`relation_state`;`version`;`created_at`;`updated_at` | copied from loaded `CapabilityMethodBodyFreeRelation` |
| `method_asset_kind`;`method_library_locator` | copied from `CapabilityExternalReferenceRepository::get_with_version(ReferenceSubjectRef::MethodAsset(method_asset_ref_id))`;once relation is loaded,missing ref -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and wrong union / id / version -> `ConsistencyDefect(DomainObject(MethodAssetReference) or CrossStoreRelation, PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `resolution_state_ref`;`resolution_value` | copied from `ReferenceResolutionStateRepository::find_current_by_subject(MethodAsset(method_asset_ref_id))`;registered ref without current state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;state-id / subject / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;a complete non-resolved value remains explicit |
| `body` / surface | visible miss or identity-method pair mismatch -> `None`;resolver `NotVisible` hides both endpoints;complete paired truth -> `Visible/NotApplicable`;no method content or method execution surface |
| no-write gate | no UoW、method attach / remove、`MethodAssetReferencePort`、method-library body read、idempotency、stored result、save / append or external call |

#### 8.14.8 `ListCapabilityRelations`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/list-capability-relations`;受信同步relation-history caller |
| API handler | `CapabilityQueryHandlers::list_capability_relations(CapabilityQueryRequest<ListCapabilityRelationsQuery>) -> Result<CapabilityPageResponse<CapabilityRelationView>, ApplicationError>` |
| application service | `CapabilityRelationQueryService::list_capability_relations(CapabilityOperationContext, ListCapabilityRelationsQuery) -> Result<CapabilityPageResponse<CapabilityRelationView>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityRelationQueryKind`;§8.5 `ListCapabilityRelationsQuery { identity_ref, relation_kind, page }` -> page of `CapabilityRelationView::{GovernanceSeam, MethodRelation}`;shared §6.3 / §6.4 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_relation_history(actor, identity_ref.id)` returns `RelationCollection(identity_ref.id)` before identity / relation repository reads |
| Step 9 flow | `query_list_capability_relations_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `identity_ref` | caller exact typed identity;missing -> `MissingRequiredField`;malformed -> `InvalidField`;validated after resolver allows reads | `CapabilityIdentityRepository::get_with_version(identity_ref)` owner check |
| `relation_kind` | caller closed `GovernanceSeam` or `MethodRelation`;missing / unknown -> `MissingRequiredField` / `InvalidField` | selects exactly `GovernanceSeamRepository::list_by_identity` or `CapabilityMethodRelationRepository::list_by_identity` |
| `page.cursor`;`page.limit` | cursor bound to identity + relation kind + query;zero / over max -> `InvalidPage` | §6.4 mapper;one repository cursor only |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| `CapabilityRelationView::GovernanceSeam` payload fields | every `GovernanceSeamRelationView` field is mapped exactly as §8.14.5,including typed governance ref + current canonical state;missing / wrong mandatory pair data yields technical `ConsistencyDefect`,not a degraded empty page |
| `CapabilityRelationView::MethodRelation` payload fields | every `CapabilityMethodRelationView` field is mapped exactly as §8.14.7,including typed method ref + current canonical state |
| variant / order | only the requested relation variant may appear;repository history order is preserved;the service never merges two pages or parses cursor to switch family |
| `page` / empty | next cursor opaque;count from final items;visible identity miss or empty history is normal visible empty;resolver `NotVisible` returns empty/no cursor before list;loaded owner / family / version mismatch -> `ConsistencyDefect(PortReturn, RepositoryAccessShape / PersistedOwnerRelation / PersistedVersionSymmetry)` |
| body boundary | per-item reference pairing may read only local body-free ref and canonical state;no approval、Policy、method body、secret、runtime result or marketplace material |
| no-write gate | no UoW、relation mutation、external resolver、idempotency、stored result、save / append、handoff or event collaboration |

Relation-page mapping is structurally closed:an item may remain in the page with a degraded aggregate surface only when relation、typed local ref and canonical state are all loaded and the canonical value is non-resolved but protocol-safe;complete `Invalid / Forbidden` state follows the card's redacted degraded rule。If any required local ref/state is missing,has the wrong union/subject/state id,or any item belongs to another identity/family,the service returns technical `ApplicationError::ConsistencyDefect`;it never emits a half-initialized union item、silently drops one row、returns a mixed valid/invalid page or disguises corruption as degraded success。This clarification changes no public schema、repository or Port。

### 8.15 Exposure / controlled-consumer and trace / impact independent Query protocol cards

本组将formal exposure、formal visibility、controlled consumer view和下游consumer reference严格分层。返回的visibility / applicability是capability-hub server exposure truth，不是runtime / tools execution授权；trace / impact / audit handoff只返回body-free本地truth和typed ref状态，不读取执行结果或raw audit material。

#### 8.15.1 `GetFormalExposureBoundary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-formal-exposure-boundary`;受信同步formal-exposure read caller |
| API handler | `CapabilityQueryHandlers::get_formal_exposure_boundary(CapabilityQueryRequest<GetFormalExposureBoundaryQuery>) -> Result<CapabilityQueryResponse<FormalExposureBoundaryView>, ApplicationError>` |
| application service | `CapabilityExposureQueryService::get_formal_exposure_boundary(CapabilityOperationContext, GetFormalExposureBoundaryQuery) -> Result<CapabilityQueryResponse<FormalExposureBoundaryView>, ApplicationError>` |
| exact request / response schema | §8.1 `FormalExposureQuerySelector`;§8.6 `GetFormalExposureBoundaryQuery { selector }` -> `FormalExposureBoundaryView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, FormalExposure(exposure_ref.id))`;`CurrentByRegistryEntry` -> `resolve_subject(actor, RegistryEntry(entry_ref.id))`;`CurrentByIdentity` -> `resolve_subject(actor, Identity(identity_ref.id))` |
| Step 9 flow | `query_get_formal_exposure_boundary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.exposure_ref` | caller exact typed exposure ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `FormalExposureRepository::get_with_version(exposure_ref)` |
| `selector.CurrentByRegistryEntry.registry_entry_ref` | caller exact typed registry ref;missing payload -> `MissingRequiredField`;not visible stops before load | after resolver,exact registry validation,then `FormalExposureRepository::find_current_by_registry_entry(entry_ref.id)` |
| `selector.CurrentByIdentity.identity_ref` | caller exact typed identity ref;missing payload -> `MissingRequiredField`;visible identity / current registry / current exposure miss -> `body=None`;a loaded owner-chain mismatch -> technical consistency error | identity exact validation -> current registry by identity -> current exposure by registry |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `exposure_ref`;`registry_entry_id`;`descriptor_ref`;`governance_seam_ref`;`method_relation_ref`;`exposure_state`;`version`;`created_at`;`updated_at` | copied from loaded `FormalExposureBoundary`;all accepted snapshot refs remain exact and are not replaced with current adjacent truth |
| `visibility_applicability_id`;`visibility_state` | copied from optional `FormalVisibilityRepository::find_current_by_exposure(exposure.id)`;both `None` is valid for Draft;missing visibility for a persisted state that requires one -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;present fact owner / source-version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` | visible exact/current miss -> `None`;loaded selector owner / version mismatch -> technical `ConsistencyDefect` rather than cross-owner fallback |
| `surface` | resolver `NotVisible` stops before repository reads;complete truth uses exact source versions and `Visible/NotApplicable`;no SDK configuration、runtime state or marketplace listing is joined |
| no-write gate | no UoW、exposure establish / suspend / retire、visibility mutation、idempotency、stored result、controlled-view refresh、save / append or external call |

#### 8.15.2 `GetFormalVisibilityApplicability`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-formal-visibility-applicability`;受信同步visibility-explanation caller |
| API handler | `CapabilityQueryHandlers::get_formal_visibility_applicability(CapabilityQueryRequest<GetFormalVisibilityApplicabilityQuery>) -> Result<CapabilityQueryResponse<FormalVisibilityApplicabilityView>, ApplicationError>` |
| application service | `CapabilityExposureQueryService::get_formal_visibility_applicability(CapabilityOperationContext, GetFormalVisibilityApplicabilityQuery) -> Result<CapabilityQueryResponse<FormalVisibilityApplicabilityView>, ApplicationError>` |
| exact request / response schema | §8.6 `GetFormalVisibilityApplicabilityQuery { exposure_ref, consumer_ref }` -> `FormalVisibilityApplicabilityView`;shared §6.3 |
| visibility resolver | first call `resolve_subject(actor, CapabilityReadSubjectRef::FormalExposure(exposure_ref.id))` directly from the request;only an allowed resolution permits exposure / current-visibility lookup |
| Step 9 flow | `query_get_formal_visibility_applicability_flow` |

| request field | source / validation / missing handling | repository / policy mapping |
|---|---|---|
| `exposure_ref` | caller exact typed formal exposure;missing -> `MissingRequiredField`;malformed -> `InvalidField` | after resolver,`FormalExposureRepository::get_with_version(exposure_ref)`,then `FormalVisibilityRepository::find_current_by_exposure(exposure_ref.id)` |
| `consumer_ref` | optional caller closed registered consumer ref;wrong variant / malformed endpoint -> `InvalidField`;missing means no consumer-specific evaluation | RuntimeTools / SDK variants may pair-read their local body-free ref + canonical state;Ecosystem remains a typed context ref;all variants pass unchanged to formal `is_consumable_by` and never to runtime authorization |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `visibility_applicability_id`;`exposure_ref`;`visibility_state`;`applicability_scope`;`basis_summary`;`source_exposure_version`;`version`;`created_at`;`evaluated_at` | copied from current loaded `FormalVisibilityApplicability`;loaded fact exposure id and source exposure version must match the selected exposure |
| `requested_consumer_applicability` | no consumer -> `NotEvaluated`;consumer within persisted applicability scope -> `Applicable`;outside scope -> `NotApplicable`;the last value is not an execution denial |
| `body` | Draft exposure with no visibility fact -> visible `None`;non-Draft missing fact -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;loaded exposure / fact owner or source-version contradiction -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `surface` | resolver `NotVisible` returns no exposure id/body before current-state lookup;complete visibility fact copies exact versions;reference-unavailable consumer may degrade the explanation without invoking a resolver |
| no-write gate | no UoW、visibility evaluate / update、runtime / tools policy、external resolver、idempotency、stored result、save / append or controlled-view refresh |

#### 8.15.3 `GetControlledConsumerView`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-controlled-consumer-view`;受信同步registered-consumer view caller |
| API handler | `CapabilityQueryHandlers::get_controlled_consumer_view(CapabilityQueryRequest<GetControlledConsumerViewQuery>) -> Result<CapabilityQueryResponse<ControlledConsumerViewView>, ApplicationError>` |
| application service | `CapabilityExposureQueryService::get_controlled_consumer_view(CapabilityOperationContext, GetControlledConsumerViewQuery) -> Result<CapabilityQueryResponse<ControlledConsumerViewView>, ApplicationError>` |
| exact request / response schema | §8.1 `ControlledConsumerViewQuerySelector`;§8.6 `GetControlledConsumerViewQuery { selector }` -> `ControlledConsumerViewView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, ConsumerView(view_ref.id))`;`ExposureAndConsumer` -> `resolve_subject(actor, FormalExposure(exposure_ref.id))` before validating consumer / loading the pair |
| Step 9 flow | `query_get_controlled_consumer_view_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.consumer_view_ref` | caller exact typed view ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `ControlledConsumerViewRepository::get_with_version(view_ref)` |
| `selector.ExposureAndConsumer.exposure_ref` | caller exact typed exposure;missing -> `MissingRequiredField`;visible exposure miss -> `body=None`;loaded owner / version mismatch -> technical consistency error | after resolver,`FormalExposureRepository::get_with_version(exposure_ref)` |
| `selector.ExposureAndConsumer.consumer_ref` | caller registered closed consumer boundary;missing -> `MissingRequiredField`;invalid local ref / exposure audience -> `InvalidField` or `NotVisible` | `ControlledConsumerViewRepository::find_current_by_exposure_and_consumer(exposure_ref.id, consumer_ref)` after typed consumer validation |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `consumer_view_ref`;`formal_exposure_id`;`consumer_ref`;`descriptor_summary`;`source_versions`;`freshness_state`;`version`;`created_at`;`refreshed_at` | copied 1:1 from loaded `ControlledConsumerView`;pair selector requires exact exposure id + consumer equality |
| `body` | visible exact/pair miss -> `None`;a loaded view with wrong audience / exposure / version -> `ConsistencyDefect(DomainObject(ControlledConsumerView), PersistedOwnerRelation / PersistedVersionSymmetry)`,never another consumer's view |
| freshness surface | `Ready` -> `Visible/Fresh`;`Stale` -> `Degraded/StaleReadable`;`Rebuilding` -> `Degraded/Rebuilding`;`Unavailable` -> `Degraded/Unavailable`;`Partial` -> `Degraded/StaleReadable` + `Partial`;timestamps never decide freshness |
| no-write gate | no UoW、`refresh_from_exposure`、mark stale / rebuilding、runtime execution、idempotency、stored result、save / append or job invocation |

#### 8.15.4 `ListConsumableCapabilitiesForRuntimeTools`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/list-consumable-capabilities-for-runtime-tools`;registered runtime / tools server-side consumer boundary |
| API handler | `CapabilityQueryHandlers::list_consumable_capabilities_for_runtime_tools(CapabilityQueryRequest<ListConsumableCapabilitiesForRuntimeToolsQuery>) -> Result<CapabilityPageResponse<ControlledConsumerViewView>, ApplicationError>` |
| application service | `CapabilityExposureQueryService::list_consumable_capabilities_for_runtime_tools(CapabilityOperationContext, ListConsumableCapabilitiesForRuntimeToolsQuery) -> Result<CapabilityPageResponse<ControlledConsumerViewView>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityConsumerExposureQueryScope`;§8.6 `ListConsumableCapabilitiesForRuntimeToolsQuery { runtime_tools_consumer_ref_id, exposure_scope, freshness_states, page }` -> page of `ControlledConsumerViewView`;shared §6.3 / §6.4 |
| visibility resolver | map request to `CapabilityControlledViewRepositoryListScope { consumer_ref: RuntimeTools(id), exposure_ids, freshness_states }`,then call `resolve_controlled_view_list(actor, &scope)` before consumer / exposure / view repository reads |
| Step 9 flow | `query_list_consumable_capabilities_for_runtime_tools_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `runtime_tools_consumer_ref_id` | caller local typed runtime/tools consumer id;missing -> `MissingRequiredField`;wrong reference kind -> `InvalidField` | `CapabilityConsumerRef::RuntimeTools(id)` and `ReferenceSubjectRef::RuntimeToolsConsumer(id)`;after resolver pair-read local ref + canonical state |
| `exposure_scope.AllForConsumer` | explicit closed variant;no payload;means all stored views for this consumer,not runtime allowlist expansion | `scope.exposure_ids=[]` |
| `exposure_scope.ExplicitExposures` | caller non-empty,duplicate-free,stable-order exact refs;empty / duplicate / malformed -> `InvalidField` | map ids to `scope.exposure_ids`;after resolver validate each exact exposure ref without widening scope |
| `freshness_states` | caller closed duplicate-free states;unknown -> `InvalidField`;empty means all query-visible stored states | canonical vector -> `scope.freshness_states` |
| `page.cursor`;`page.limit` | cursor bound to consumer + exact exposure/freshness scope;zero / over max -> `InvalidPage` | §6.4 page mapper |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| each `ControlledConsumerViewView` field | copied as §8.15.3 from `ControlledConsumerViewRepository::list_matching(scope, page)`;every item consumer and exposure id must match the declared scope |
| runtime consumer state | visible unregistered local `RuntimeToolsConsumerRef` returns typed `Degraded/ReferenceUnavailable` empty/no cursor;once the ref is loaded,current canonical state is mandatory and pair inconsistency returns `ConsistencyDefect`;a complete non-Resolved value returns the declared state-mapped degraded empty page;no runtime invocation or provider lookup |
| `page` / empty | stable repository order;opaque cursor;visible no stored view -> normal empty;resolver `NotVisible` -> empty/no cursor before repository reads |
| surface aggregation | item freshness aggregate is deterministic and never guessed from timestamps;loaded explicit exposure or item audience / exposure / version mismatch returns `ConsistencyDefect`,not degraded empty、silent narrowing or row drop;repository failure remains `ApplicationError`,not empty |
| no-write gate | no UoW、runtime / tools execution、allowlist mutation、view refresh、idempotency、stored result、save / append or external resolver |

#### 8.15.5 `GetSdkExposureBoundary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-sdk-exposure-boundary`;registered SDK server-consumer boundary caller |
| API handler | `CapabilityQueryHandlers::get_sdk_exposure_boundary(CapabilityQueryRequest<GetSdkExposureBoundaryQuery>) -> Result<CapabilityQueryResponse<SdkExposureBoundaryView>, ApplicationError>` |
| application service | `CapabilityExposureQueryService::get_sdk_exposure_boundary(CapabilityOperationContext, GetSdkExposureBoundaryQuery) -> Result<CapabilityQueryResponse<SdkExposureBoundaryView>, ApplicationError>` |
| exact request / response schema | §8.6 `GetSdkExposureBoundaryQuery { sdk_consumer_ref_id, exposure_ref }` -> `SdkExposureBoundaryView`;shared §6.3 |
| visibility resolver | before any body load,first resolve `ExternalReference(ReferenceSubjectRef::SdkConsumer(sdk_consumer_ref_id))`,then resolve `FormalExposure(exposure_ref.id)`;assert each exact subject / actor and each decision no-write。Any `NotVisible` suppresses the complete body;otherwise any resolver `Degraded` returns body-free degraded without body reads;only both `Visible` permit body reads |
| Step 9 flow | `query_get_sdk_exposure_boundary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `sdk_consumer_ref_id` | caller local typed SDK server-consumer id;missing -> `MissingRequiredField`;wrong union -> `InvalidField` | `CapabilityExternalReferenceRepository::get_with_version(SdkConsumer(id))` + current state by subject |
| `exposure_ref` | caller exact typed formal exposure;missing -> `MissingRequiredField`;malformed -> `InvalidField`;visible miss -> `body=None`;loaded id / version mismatch -> `ConsistencyDefect(DomainObject(FormalExposureBoundary), PersistedVersionSymmetry)` | `FormalExposureRepository::get_with_version(exposure_ref)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `sdk_consumer_ref_id`;`sdk_consumer_locator`;`sdk_surface_summary`;`sdk_exposure_scope` | copied from typed `CapabilityExternalReference::SdkConsumer`;no SDK package、client object、generated binding or credential |
| `resolution_state_ref`;`resolution_value` | copied from current canonical state for `ReferenceSubjectRef::SdkConsumer(id)`;once SDK ref is loaded,missing state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and ref state-id / subject / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;a complete non-resolved value follows the typed degraded mapping |
| `exposure_ref`;`exposure_state` | copied from exact loaded `FormalExposureBoundary` |
| `visibility_state` | copied from optional `FormalVisibilityRepository::find_current_by_exposure(exposure_ref.id)`;valid Draft absence -> `None`;required-state absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;present owner / source-version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `consumer_view` | optional view from `ControlledConsumerViewRepository::find_current_by_exposure_and_consumer(exposure_ref.id, CapabilityConsumerRef::Sdk(id))`,mapped exactly as §8.15.3;missing -> `None` while the outer body may remain visible |
| `surface` | missing visible SDK ref or exposure -> `body=None`;complete non-resolved SDK ref or persisted stale / partial / rebuilding / unavailable view -> typed degraded surface;loaded ref/state/exposure/visibility/view inconsistency -> technical `ConsistencyDefect`;resolver `NotVisible` prevents all body reads |
| no-write gate | no UoW、SDK client/package generation、view refresh、external resolver、idempotency、stored result、save / append or runtime execution |

Dual-decision surface composition is exact:call Step 6 `sdk_decision.source_versions.try_union(exposure_decision.source_versions)` in SDK-then-exposure order;map a returned`ContractValueError`to consistency `ApplicationError` before body reads。`evaluated_at` is the later of the two authoritative decision times。The public visibility branch follows `NotVisible > Degraded > Visible`;a degraded marker preserves the matching decision reason(s) in the same SDK-then-exposure order and never parses error text。This is protocol mapping,not a new public DTO or resolver Port。

#### 8.15.6 `GetCapabilityAccessTrace`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-access-trace`;受信同步traceability-history caller |
| API handler | `CapabilityQueryHandlers::get_capability_access_trace(CapabilityQueryRequest<GetCapabilityAccessTraceQuery>) -> Result<CapabilityPageResponse<CapabilityAccessTraceView>, ApplicationError>` |
| application service | `CapabilityTraceImpactQueryService::get_capability_access_trace(CapabilityOperationContext, GetCapabilityAccessTraceQuery) -> Result<CapabilityPageResponse<CapabilityAccessTraceView>, ApplicationError>` |
| exact request / response schema | §8.7 `GetCapabilityAccessTraceQuery { trace_subject, page }` -> page of `CapabilityAccessTraceView`;shared §6.3 / §6.4 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_traceability_list(actor, trace_subject)` returns `TraceabilityCollection(trace_subject)` before repository list |
| Step 9 flow | `query_get_capability_access_trace_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `trace_subject` | caller closed core access-truth subject;missing -> `MissingRequiredField`;projection / job / provider / marketplace subject -> `InvalidField` | `CapabilityTraceabilityRepository::list_by_subject(trace_subject, page)` after resolver |
| `page.cursor`;`page.limit` | cursor bound to exact trace subject + query;zero / over max -> `InvalidPage` | §6.4 page mapper |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| item `traceability_ref`;`trace_subject`;`source_change_refs`;`trace_reason`;`handoff_refs`;`traceability_state`;`gap_reason`;`superseded_by`;`actor_context`;`trace_id`;`version`;`recorded_at`;`updated_at` | copied 1:1 from each immutable `CapabilityAccessTraceabilityRecord`;raw log / span / external audit body is never loaded |
| item state | Partial / HandoffPending / superseded revisions remain explicit truth items;the query does not append or repair a revision |
| `page` / empty | repository history order preserved;visible no revision -> normal empty;resolver `NotVisible` -> empty/no cursor before list;repository failure remains error |
| `surface` | append-only trace truth uses `Visible/NotApplicable`;allowed page degradation must come from resolver or explicit stored item state,not trace-id parsing |
| no-write gate | no UoW、trace append、change creation、handoff delivery、idempotency、stored result、save / append or observability store read |

#### 8.15.7 `GetCapabilityChangeImpact`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-change-impact`;受信同步change-impact read caller |
| API handler | `CapabilityQueryHandlers::get_capability_change_impact(CapabilityQueryRequest<GetCapabilityChangeImpactQuery>) -> Result<CapabilityQueryResponse<CapabilityChangeImpactView>, ApplicationError>` |
| application service | `CapabilityTraceImpactQueryService::get_capability_change_impact(CapabilityOperationContext, GetCapabilityChangeImpactQuery) -> Result<CapabilityQueryResponse<CapabilityChangeImpactView>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityImpactQuerySelector`;§8.7 `GetCapabilityChangeImpactQuery { selector }` -> `CapabilityChangeImpactView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, ImpactFact(impact_ref.id))`;`ByChange` -> `resolve_subject(actor, ChangeRecord(change_ref))`;resolver precedes impact / trace / change reads |
| Step 9 flow | `query_get_capability_change_impact_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.impact_ref` | caller exact typed impact ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `CapabilityImpactRepository::get_impact_with_version(impact_ref)` |
| `selector.ByChange.change_ref` | caller immutable typed change-record union ref;missing payload -> `MissingRequiredField`;variant mismatch -> `InvalidField` | after resolver,optional exact validation via `CapabilityChangeRecordRepository::get(change_ref)`,then `CapabilityTraceabilityRepository::find_current_by_change(change_ref)` and `CapabilityImpactRepository::find_impact_by_traceability(trace_ref)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `impact_ref`;`traceability_ref`;`change_subject`;`impact_scope`;`affected_consumers`;`impact_state`;`state_reason`;`recorded_by`;`trace_id`;`version`;`created_at`;`updated_at` | copied from loaded `CapabilityChangeImpactFact`;consumer refs remain typed body-free boundaries and never trigger execution-result reads |
| `body` | visible exact miss,or ByChange with no current trace / impact -> `None`;once change / trace / impact rows are loaded,trace coverage、subject、source link or version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `surface` | direct impact truth uses `Visible/NotApplicable`;resolver `NotVisible` hides change / impact identities;Delayed / Partial impact state is a body field,not an adapter error string |
| no-write gate | no UoW、impact identify / update、consumer notification、runtime execution、idempotency、stored result、save / append or outbound candidate |

#### 8.15.8 `GetDownstreamConsumptionImpactSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-downstream-consumption-impact-summary`;受信同步downstream-impact summary caller |
| API handler | `CapabilityQueryHandlers::get_downstream_consumption_impact_summary(CapabilityQueryRequest<GetDownstreamConsumptionImpactSummaryQuery>) -> Result<CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>, ApplicationError>` |
| application service | `CapabilityTraceImpactQueryService::get_downstream_consumption_impact_summary(CapabilityOperationContext, GetDownstreamConsumptionImpactSummaryQuery) -> Result<CapabilityPageResponse<DownstreamConsumptionImpactSummaryView>, ApplicationError>` |
| exact request / response schema | §8.7 `GetDownstreamConsumptionImpactSummaryQuery { impact_fact_ref, consumer_ref, change_subject, observed_from, observed_until, page }` -> page of `DownstreamConsumptionImpactSummaryView`;shared §6.3 / §6.4 |
| visibility resolver | validate and build `CapabilityDownstreamSummaryRepositoryScope`,then `resolve_downstream_summary_list(actor, &scope)` before `list_downstream_summaries` |
| Step 9 flow | `query_get_downstream_consumption_impact_summary_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `impact_fact_ref` | optional exact impact fact answered by every returned summary;malformed present value -> `InvalidField`;all three selectors absent -> `InvalidScope` | copied to `scope.impact_fact_ref`;repository filters by the summary-owned exact link |
| `consumer_ref` | optional closed registered consumer boundary;malformed present value -> `InvalidField`;all three selectors absent -> `InvalidScope` | copied to `scope.consumer_ref` |
| `change_subject` | optional closed core truth subject;invalid family -> `InvalidField`;all three selectors absent -> `InvalidScope` | copied to `scope.change_subject` |
| `observed_from`;`observed_until` | optional authoritative time bounds;when both present require `from < until`;invalid range -> `InvalidField` | copied without local-clock substitution |
| `page.cursor`;`page.limit` | cursor bound to exact impact/consumer/subject/time scope;zero / over max -> `InvalidPage` | §6.4 page mapper |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| item `impact_summary_ref`;`impact_fact_ref`;`consumer_ref`;`source_feedback_ref`;`impact_observation`;`feedback_state`;`gap_reason`;`state_reason`;`accepted_by`;`trace_id`;`version`;`observed_at`;`updated_at` | copied from each loaded `DownstreamConsumptionImpactSummary`;source event ref remains body-free and is not fetched from an event payload store |
| item state | Unavailable / Delayed / Ignored / Partial feedback remains explicit stored state;it is not converted to query failure or runtime denial |
| `page` / empty | `CapabilityImpactRepository::list_downstream_summaries(scope, page)` order and cursor mapped by §6.4;visible no match normal empty;NotVisible canonical empty before list |
| `surface` | direct safe-summary truth normally `Visible/NotApplicable`;resolver degradation returns canonical empty/no cursor before list;loaded item filter / change-subject / owner / version mismatch -> `ConsistencyDefect(PortReturn(CapabilityImpactRepository), RepositoryAccessShape / PersistedOwnerRelation / PersistedVersionSymmetry)`;repository errors remain typed errors |
| no-write gate | no UoW、inbound receipt processing、impact mutation、runtime / SDK call、idempotency、stored result、save / append or event replay |

`CH-DDD-S9-IMPACT-SUMMARY-PAGE-001` controlled reopen removes the unbounded `consumer_impact_summary_refs` field from the single `CapabilityChangeImpactView` and adds the English-Rustdoc-complete optional `impact_fact_ref` field to the existing paged downstream-summary Query. The exact impact、consumer and subject filters are conjunctive when combined. This keeps all summaries retrievable without an implicit page size,does not change the 33-Query / 83-protocol inventory,and does not add a public struct / enum or repository Port.

#### 8.15.9 `GetAuditHandoffTraceSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-audit-handoff-trace-summary`;受信同步audit-handoff status caller without raw-audit authority |
| API handler | `CapabilityQueryHandlers::get_audit_handoff_trace_summary(CapabilityQueryRequest<GetAuditHandoffTraceSummaryQuery>) -> Result<CapabilityQueryResponse<AuditHandoffTraceSummaryView>, ApplicationError>` |
| application service | `CapabilityTraceImpactQueryService::get_audit_handoff_trace_summary(CapabilityOperationContext, GetAuditHandoffTraceSummaryQuery) -> Result<CapabilityQueryResponse<AuditHandoffTraceSummaryView>, ApplicationError>` |
| exact request / response schema | §8.7 `GetAuditHandoffTraceSummaryQuery { traceability_ref, handoff_scope }` -> `AuditHandoffTraceSummaryView` with `AuditHandoffReferenceStateView`;shared §6.3 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_subject(actor, Traceability(traceability_ref.id))` before trace or audit-reference reads |
| Step 9 flow | `query_get_audit_handoff_trace_summary_flow` |

| request field | source / validation / missing handling | repository / mapper key |
|---|---|---|
| `traceability_ref` | caller exact traceability revision;missing -> `MissingRequiredField`;malformed / wrong kind / absent version -> `InvalidField` | `CapabilityTraceabilityRepository::get_revision(traceability_ref)`;never substitutes current/latest revision |
| `handoff_scope` | caller body-free allowed audit-handoff context;missing / empty -> `MissingRequiredField`;raw query、target credential、evidence alias or audit body -> `BodyForbidden` | validate and copy to response;opaque safe text is never parsed as an audit-ref selector |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `traceability_ref`;`traceability_state`;`gap_reason` | copied from exact loaded traceability revision |
| `handoff_scope` | copied from the validated request scope;does not claim delivery or acceptance signing |
| `audit_references[].audit_ref_id` | copy every id from the trace's attached `TraceabilityHandoffRefSet` in stored stable order;no attached refs -> visible empty vector;no silent filtering |
| `audit_references[].resolution_state_ref`;`resolution_value` | for each persisted handoff id,load typed `CapabilityExternalReference::ObservabilityAudit` and `ReferenceResolutionStateRepository::find_current_by_subject(ObservabilityAudit(id))`;missing registered ref or current state -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;wrong union / state subject / id / version -> `ConsistencyDefect(CrossStoreRelation, PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` / surface | visible trace miss -> `None`;resolver `NotVisible` prevents trace/ref load;complete non-resolved refs return the declared body-free degraded partial body;loaded pair inconsistency is technical error;no raw logs、metrics、spans、audit content、evidence alias or acceptance signature |
| no-write gate | no UoW、`ObservabilityAuditHandoffPort`、trace append、reference refresh、idempotency、stored result、save / append or external audit-store call |

`CH-DDD-S9-AUDIT-SCOPE-FILTER-001` clarification:the handoff scope is validated opaque safe text shared with the Command / Port boundary,not a typed reference predicate. This Query returns all refs attached to the exact trace revision in stored order and echoes the validated inspection context. Filtering would require parsing opaque text or silently dropping refs,so it is forbidden;no public DTO、object、repository、trait or Port changes are needed.

`CH-DDD-S9-AUDIT-PAIR-PARTIAL-001` clarification as corrected by Step 12 batch `12.4`:the public `AuditHandoffReferenceStateView` has no missing/wrong-pair variant. Every attached id must load an exact `CapabilityExternalReference::ObservabilityAudit` plus a current canonical state with matching subject、kind、state id and persisted version before the response body is constructed. A missing/wrong mandatory pair returns exact `ApplicationError::ConsistencyDefect` and no partial vector;complete pairs with non-Resolved values remain in stable order and aggregate `Degraded` (`Stale/Expired -> StaleReadable`;all other non-Resolved values -> Unavailable;Invalid/Forbidden are redacted with no body). Items are never silently dropped、half-initialized or disguised as degraded success.

For `GetCapabilityAccessTrace`,a visible page aggregates persisted trace states as `Partial > HandoffPending > Recorded/Superseded`;Partial and HandoffPending retain complete body-free items with `Degraded/StaleReadable`,while Recorded/Superseded alone remain `Visible/NotApplicable`. For `GetDownstreamConsumptionImpactSummary`,all five persisted feedback states are direct truth fields and the outer page remains `Visible/NotApplicable`;Unavailable、Delayed、Ignored or Partial never become runtime denial、query failure or timestamp-derived freshness. Repository/parity failure remains an error,not an item drop.

### 8.16 Derived-material / reconciliation and reference independent Query protocol cards

本组把rebuildable material、immutable reconciliation report和canonical external-reference state作为只读surface。Query可以读取persisted degraded state，但不得启动rebuild / reconciliation / refresh、修复core truth、调用external resolver，或把job run、trace id、reference id解释为测试证据或验收签署。

#### 8.16.1 `SearchCapabilityDirectory`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/search-capability-directory`;受信同步capability directory search caller |
| API handler | `CapabilityQueryHandlers::search_capability_directory(CapabilityQueryRequest<SearchCapabilityDirectoryQuery>) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>` |
| application service | `CapabilityDerivedMaterialQueryService::search_capability_directory(CapabilityOperationContext, SearchCapabilityDirectoryQuery) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>` |
| exact request / response schema | §8.8 `SearchCapabilityDirectoryQuery { query_text, facets, page }` -> page of `CapabilityDirectoryProjectionView`;shared §6.3 / §6.4 |
| visibility resolver | build `CapabilityDirectoryRepositorySearchScope { query_text, facets }`,then call `resolve_directory_search(actor, &scope)` before projection search |
| Step 9 flow | `query_search_capability_directory_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `query_text` | optional validated `CapabilitySafeText`;empty / forbidden body -> `InvalidField` / `BodyForbidden`;missing permits facet-only or browse-all search | copied to `scope.query_text`;repository never interprets raw external query language |
| `facets` | optional typed `DirectorySearchFacetSet`;unknown facet、duplicate or invalid value -> `InvalidField`;missing means no facet restriction | copied to `scope.facets` |
| `page.cursor`;`page.limit` | cursor bound to search query + exact text/facet scope;zero / over max -> `InvalidPage` | §6.4 mapper -> repository page request |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| item `projection_ref`;`source_registry_entry_ref`;`source_descriptor_ref`;`source_exposure_ref`;`display_summary`;`filter_facets`;`source_versions`;`freshness_state`;`state_reason`;`version`;`created_at`;`refreshed_at` | copied 1:1 from each persisted `DirectorySearchBrowseProjection`;no fallback to registry truth、runtime provider、marketplace listing or external capability execution |
| `items` / order | `CapabilityDerivedMaterialRepository::search_directory_projections(scope, page)` stable order is preserved after visibility mapping;service does not rerank by adapter-private score |
| `page` / empty | opaque cursor mapping;page-level resolver is the visibility seed for empty pages;visible no match is normal empty;NotVisible empty/no cursor before search |
| freshness aggregation | aggregate persisted states only,with `Unavailable > Rebuilding > Stale > Ready`;mixed items do not alter order;degraded markers come from state mappers,not timestamps |
| loaded page consistency | item version、source marker or typed query / facet scope mismatch -> `ConsistencyDefect(PortReturn(CapabilityDerivedMaterialRepository), RepositoryAccessShape / PersistedVersionSymmetry)`;no partial prefix、fallback truth or row drop |
| no-write gate | no UoW、projection rebuild / save、registry mutation、runtime search、idempotency、stored result、external call or job start |

#### 8.16.2 `BrowseCapabilityDirectory`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/browse-capability-directory`;受信同步capability directory browse caller |
| API handler | `CapabilityQueryHandlers::browse_capability_directory(CapabilityQueryRequest<BrowseCapabilityDirectoryQuery>) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>` |
| application service | `CapabilityDerivedMaterialQueryService::browse_capability_directory(CapabilityOperationContext, BrowseCapabilityDirectoryQuery) -> Result<CapabilityPageResponse<CapabilityDirectoryProjectionView>, ApplicationError>` |
| exact request / response schema | §8.8 `BrowseCapabilityDirectoryQuery { facets, page }` -> page of `CapabilityDirectoryProjectionView`;shared §6.3 / §6.4 |
| visibility resolver | build `CapabilityDirectoryRepositorySearchScope { query_text: None, facets }`,then call `resolve_directory_browse(actor, &scope)` before repository search |
| Step 9 flow | `query_browse_capability_directory_flow` |

| request field | source / validation / missing handling | application mapping |
|---|---|---|
| `facets` | optional typed browse facets;invalid / duplicate -> `InvalidField`;missing means stable browse-all projection order | copied to `scope.facets`;`scope.query_text` is formally `None` |
| `page.cursor`;`page.limit` | cursor bound to browse operation + facet scope and cannot be replayed on search route;zero / over max -> `InvalidPage` | §6.4 mapper |

| response field / surface | exact source and empty / visibility handling |
|---|---|
| every `CapabilityDirectoryProjectionView` field | copied exactly as §8.16.1 from `search_directory_projections` using the browse scope;no hidden search text、ranking score or marketplace field is added |
| `items` / page | stable repository browse order and opaque cursor preserved;returned count is final visible item count;has-more derives only from next cursor |
| `surface` / empty | `resolve_directory_browse` supplies page visibility before repository read;visible empty normal;NotVisible canonical empty;state aggregation is identical to search |
| loaded page consistency | non-None internal query text、item version / source marker or facet scope mismatch -> `ConsistencyDefect(PortReturn(CapabilityDerivedMaterialRepository), RepositoryAccessShape / PersistedVersionSymmetry)`;no switch to Search、partial page or silent filtering |
| no-write gate | no UoW、projection refresh、ranking mutation、registry repair、idempotency、stored result、external call or job start |

#### 8.16.3 `GetAuditFriendlyExportSummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-audit-friendly-export-summary`;受信同步audit-export summary caller without raw-audit access |
| API handler | `CapabilityQueryHandlers::get_audit_friendly_export_summary(CapabilityQueryRequest<GetAuditFriendlyExportSummaryQuery>) -> Result<CapabilityQueryResponse<AuditFriendlyExportSummaryView>, ApplicationError>` |
| application service | `CapabilityDerivedMaterialQueryService::get_audit_friendly_export_summary(CapabilityOperationContext, GetAuditFriendlyExportSummaryQuery) -> Result<CapabilityQueryResponse<AuditFriendlyExportSummaryView>, ApplicationError>` |
| exact request / response schema | §8.1 `AuditExportQuerySelector`;§8.8 `GetAuditFriendlyExportSummaryQuery { selector }` -> `AuditFriendlyExportSummaryView`;shared §6.3 |
| visibility resolver | `Exact` -> `resolve_subject(actor, AuditExport(export_ref.id))`;`TraceabilityAndScope` -> `resolve_subject(actor, Traceability(traceability_ref.id))`;resolver precedes export / trace reads |
| Step 9 flow | `query_get_audit_friendly_export_summary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.export_ref` | caller exact typed export ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `CapabilityDerivedMaterialRepository::get_audit_export_with_version(export_ref)` |
| `selector.TraceabilityAndScope.traceability_ref` | caller exact traceability revision;missing -> `MissingRequiredField`;malformed / absent version -> `InvalidField` | after resolver,`CapabilityTraceabilityRepository::get_revision(traceability_ref)`,then current export lookup for that exact trace + scope |
| `selector.TraceabilityAndScope.export_scope` | caller body-free exact scope;missing / invalid -> `MissingRequiredField` / `InvalidScope`;raw audit query / credential / evidence alias -> `BodyForbidden` | `find_audit_export_by_traceability(traceability_ref, &export_scope)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `export_ref`;`traceability_ref`;`export_scope`;`allowed_summary`;`observability_refs`;`source_versions`;`export_state`;`state_reason`;`version`;`created_at`;`refreshed_at` | copied 1:1 from loaded `AuditFriendlyExportSummary`;observability refs remain typed ids and do not cause raw material reads |
| `body` | visible exact/current miss -> `None`;after trace or export is loaded,trace id / version、export id / version、source trace / scope mismatch -> `ConsistencyDefect(DomainObject(AuditExport) or CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`,never another scope's export |
| state surface | Ready -> `Visible/Fresh`;Partial -> `Degraded/StaleReadable + Partial`;Stale -> `Degraded/StaleReadable + StaleSource`;Unavailable -> `Degraded/Unavailable + MaterialUnavailable`;`AuditExportState` has no Rebuilding variant;state reason mapper is formal,not error text |
| no-write gate | no UoW、audit export preparation / rebuild、raw audit store、handoff、idempotency、stored result、save / append or evidence generation |

`CH-DDD-S9-TRACE-EXACT-READ-001` controlled reopen binds both exact historical trace consumers to `CapabilityTraceabilityRepository::get_revision`. `get_current_with_version` remains exclusive to write paths that require a current-state guard and expected version. A historical exact ref is never silently upgraded to current,while a missing exact revision remains a visible miss after resolver permission.

#### 8.16.4 `GetReadOnlyEcosystemDiscoverySummary`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-read-only-ecosystem-discovery-summary`;受信同步read-only ecosystem discovery caller |
| API handler | `CapabilityQueryHandlers::get_read_only_ecosystem_discovery_summary(CapabilityQueryRequest<GetReadOnlyEcosystemDiscoverySummaryQuery>) -> Result<CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>, ApplicationError>` |
| application service | `CapabilityDerivedMaterialQueryService::get_read_only_ecosystem_discovery_summary(CapabilityOperationContext, GetReadOnlyEcosystemDiscoverySummaryQuery) -> Result<CapabilityQueryResponse<ReadOnlyEcosystemDiscoverySummaryView>, ApplicationError>` |
| exact request / response schema | §8.8 `GetReadOnlyEcosystemDiscoverySummaryQuery { exposure_ref, ecosystem_context_ref }` -> `ReadOnlyEcosystemDiscoverySummaryView`;shared §6.3 |
| visibility resolver | `CapabilityReadVisibilityResolverPort::resolve_subject(actor, FormalExposure(exposure_ref.id))` before exposure or discovery material lookup |
| Step 9 flow | `query_get_read_only_ecosystem_discovery_summary_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `exposure_ref` | caller exact typed formal exposure;missing -> `MissingRequiredField`;malformed / not visible -> `InvalidField` or no body | after resolver,`FormalExposureRepository::get_with_version(exposure_ref)` validates exact source |
| `ecosystem_context_ref` | caller body-free typed ecosystem context;missing -> `MissingRequiredField`;marketplace listing / ranking / execution predicate -> `BodyForbidden` | `CapabilityDerivedMaterialRepository::find_ecosystem_discovery(exposure_ref.id, &ecosystem_context_ref)` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `discovery_ref`;`formal_exposure_ref`;`ecosystem_context_ref`;`discoverability_summary`;`source_versions`;`freshness_state`;`state_reason`;`version`;`created_at`;`refreshed_at` | copied from loaded `ReadOnlyEcosystemDiscoverySummary`;exposure and context must equal request |
| `body` | visible exposure or material miss -> `None`;after exposure or material is loaded,exposure id / version、material source ref / version or ecosystem-context mismatch -> `ConsistencyDefect(DomainObject(EcosystemDiscovery) or CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;no fallback directory / marketplace material is formed |
| state surface | Ready -> `Visible/Fresh`;Partial -> `Degraded/StaleReadable + Partial`;Stale -> `Degraded/StaleReadable + StaleSource`;Unavailable -> `Degraded/Unavailable + MaterialUnavailable`;`EcosystemDiscoveryState` has no Rebuilding variant;timestamps never infer state |
| no-write gate | no UoW、marketplace listing、ecosystem publish、discovery rebuild、idempotency、stored result、save / append or external resolver |

#### 8.16.5 `GetCapabilityReconciliationReport`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-capability-reconciliation-report`;受信同步operations / reconciliation-report reader |
| API handler | `CapabilityQueryHandlers::get_capability_reconciliation_report(CapabilityQueryRequest<GetCapabilityReconciliationReportQuery>) -> Result<CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>, ApplicationError>` |
| application service | `CapabilityDerivedMaterialQueryService::get_capability_reconciliation_report(CapabilityOperationContext, GetCapabilityReconciliationReportQuery) -> Result<CapabilityQueryResponse<CapabilityReconciliationReportQueryBody>, ApplicationError>` |
| exact request / response schema | §8.1 `CapabilityReconciliationReportQuerySelector`;§8.8 request -> `CapabilityReconciliationReportQueryBody::{Exact, ScopePage}`;scope payload uses `CapabilityReconciliationReportPageView { items, page }`;shared §6.3 / §6.4 |
| visibility resolver | `Exact` -> `resolve_subject(actor, ReconciliationReport(report_ref.id))`;`Scope` -> `resolve_reconciliation_report_list(actor, &reconciliation_scope)` before report list |
| Step 9 flow | `query_get_capability_reconciliation_report_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `selector.Exact.report_ref` | caller exact immutable report ref;missing payload -> `MissingRequiredField`;wrong kind -> `InvalidField` | `CapabilityReconciliationReportRepository::get(report_ref)` |
| `selector.Scope.reconciliation_scope` | caller closed body-free scope;missing / malformed -> `MissingRequiredField` / `InvalidScope`;scope cannot request truth repair | `CapabilityReconciliationReportRepository::list_by_scope(&scope, page)` after page resolver |
| `selector.Scope.page.cursor`;`page.limit` | cursor bound to exact reconciliation scope + this selector branch;zero / over max -> `InvalidPage` | §6.4 page mapper;never reused as exact selector |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| report `report_ref`;`reconciliation_scope`;`source_truth_refs`;`inspected_material_refs`;`source_versions`;`finding_summary`;`report_state`;`failure_reason`;`job_run_id`;`generated_by`;`trace_id`;`version`;`generated_at` | copied 1:1 from immutable `CapabilityReconciliationReport`;`job_run_id` / `trace_id` are stored correlation fields,not fabricated execution proof、test evidence、run alias or acceptance signature |
| `Exact` body | visible report miss -> outer `body=None`;success -> `Some(CapabilityReconciliationReportQueryBody::Exact(view))` |
| `ScopePage.items`;`ScopePage.page` | every item maps the same report fields;repository order / opaque cursor preserved;visible no reports -> `Some(ScopePage { items: [], page: empty })`,never `None` or first-item shortcut |
| surface | resolver `NotVisible` returns outer body `None` and no report ids;Completed -> `Visible/Fresh`;Partial -> `Degraded/StaleReadable + Partial`;Inconsistent / RebuildRequired -> `Degraded/StaleReadable + StaleSource`;Failed -> `Degraded/Unavailable + MaterialUnavailable`,while retaining the safe report body。Scope page aggregates`Failed > RebuildRequired > Inconsistent > Partial > Completed`;empty visible page is`Visible/Fresh`;repository failure is not a Failed report |
| loaded result consistency | exact report id / version -> `ConsistencyDefect(DomainObject(ReconciliationReport), PersistedVersionSymmetry)`;scope-page item / scope / count mismatch -> `ConsistencyDefect(PortReturn(CapabilityReconciliationReportRepository), RepositoryAccessShape)`;report no-truth-write或state/failure-field mismatch -> `DomainRejected(InvariantViolation(ReconciliationReport, ReconciliationOutcomeShape))`;no row drop、first-item shortcut or fabricated Failed report |
| no-write gate | no UoW、reconciliation job start、truth / material repair、report append、idempotency、stored result、save / append、handoff or event collaboration |

`CH-DDD-S9-DERIVED-STATE-MAP-001` clarification removes the nonexistent Rebuilding branches from audit-export and ecosystem-discovery cards and closes reconciliation page aggregation from persisted states only. No timestamp、error text、job-run existence or first-item shortcut may select a branch. This changes no public enum、field、object、repository、trait or Port.

#### 8.16.6 `GetReferenceResolutionState`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-reference-resolution-state`;受信同步canonical reference-state caller |
| API handler | `CapabilityQueryHandlers::get_reference_resolution_state(CapabilityQueryRequest<GetReferenceResolutionStateQuery>) -> Result<CapabilityQueryResponse<ReferenceResolutionStateView>, ApplicationError>` |
| application service | `CapabilityReferenceQueryService::get_reference_resolution_state(CapabilityOperationContext, GetReferenceResolutionStateQuery) -> Result<CapabilityQueryResponse<ReferenceResolutionStateView>, ApplicationError>` |
| exact request / response schema | §8.9 `GetReferenceResolutionStateQuery { reference_subject, reference_kind }` -> `ReferenceResolutionStateView`;shared §6.3 |
| visibility resolver | after subject-kind symmetry validation,form `CapabilityReadSubjectRef::ExternalReference` directly from request `reference_subject` and call `resolve_subject`;only then read external ref / current state |
| Step 9 flow | `query_get_reference_resolution_state_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `reference_subject` | caller closed typed union subject;missing -> `MissingRequiredField`;malformed variant -> `InvalidField`;never parsed from locator text | after resolver,`CapabilityExternalReferenceRepository::get_with_version(reference_subject)` validates registered union |
| `reference_kind` | caller closed kind;missing -> `MissingRequiredField`;must match subject variant exactly or -> `InvalidField` before resolver | no independent lookup key;used only for symmetry / response validation |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `resolution_state_ref`;`reference_subject`;`reference_kind`;`resolution_value`;`resolution_reason`;`checked_by`;`trace_id`;`version`;`created_at`;`last_checked_at` | copied 1:1 from `ReferenceResolutionStateRepository::find_current_by_subject(reference_subject)`;state subject/kind/id must match the registered ref object |
| `body` | visible unregistered subject -> `None`;once a registered ref exists,current state is mandatory:absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`;wrong union or state subject / kind / id / version mismatch -> `ConsistencyDefect(DomainObject(ReferenceResolutionState) or CrossStoreRelation, PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry)`,not a different subject's state |
| state surface | Resolved -> `Visible/NotApplicable`;Unresolved -> `Degraded/ReferenceUnresolved`;Stale / Expired -> `Degraded/StaleReadable`;Unavailable -> `ReferenceUnavailable`;Invalid / Forbidden -> `Unavailable + Redacted` |
| no-write gate | no UoW、external reference resolver、state record / refresh、idempotency、stored result、save / append、job invocation or external network call |

#### 8.16.7 `GetExternalDocumentReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-external-document-reference`;受信同步external-document boundary caller |
| API handler | `CapabilityQueryHandlers::get_external_document_reference(CapabilityQueryRequest<GetExternalDocumentReferenceQuery>) -> Result<CapabilityQueryResponse<ExternalDocumentReferenceView>, ApplicationError>` |
| application service | `CapabilityReferenceQueryService::get_external_document_reference(CapabilityOperationContext, GetExternalDocumentReferenceQuery) -> Result<CapabilityQueryResponse<ExternalDocumentReferenceView>, ApplicationError>` |
| exact request / response schema | §8.9 `GetExternalDocumentReferenceQuery { external_document_ref_id }` -> `ExternalDocumentReferenceView` embedding `ReferenceResolutionStateView`;shared §6.3 |
| visibility resolver | form `ReferenceSubjectRef::ExternalDocument(id)`,then `resolve_subject(actor, ExternalReference(subject))` before ref / state load |
| Step 9 flow | `query_get_external_document_reference_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `external_document_ref_id` | caller stable local typed id;missing -> `MissingRequiredField`;wrong kind / malformed -> `InvalidField` | `CapabilityExternalReferenceRepository::get_with_version(ReferenceSubjectRef::ExternalDocument(id))` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `external_document_ref_id`;`document_kind`;`document_locator`;`supported_descriptor_id`;`version`;`created_at`;`updated_at` | copied from typed `CapabilityExternalReference::ExternalDocument`;wrong union / id / version -> `ConsistencyDefect(DomainObject(ExternalDocumentReference), PersistedVariantShape / PersistedVersionSymmetry)`;document body is never returned |
| `resolution.*` | all ten `ReferenceResolutionStateView` fields are copied from `ReferenceResolutionStateRepository::find_current_by_subject(ExternalDocument(id))`;ref state-id must match |
| `body` / surface | visible ref miss -> `None`;after ref load,current state absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and pair mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)`;a complete canonical non-resolved state follows §8.16.6 mapping;resolver `NotVisible` returns no id/body |
| no-write gate | no UoW、document fetch、schema download、external resolver、idempotency、stored result、save / append or refresh job |

#### 8.16.8 `GetRuntimeToolsConsumerReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-runtime-tools-consumer-reference`;受信同步runtime / tools boundary caller,not execution caller |
| API handler | `CapabilityQueryHandlers::get_runtime_tools_consumer_reference(CapabilityQueryRequest<GetRuntimeToolsConsumerReferenceQuery>) -> Result<CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>, ApplicationError>` |
| application service | `CapabilityReferenceQueryService::get_runtime_tools_consumer_reference(CapabilityOperationContext, GetRuntimeToolsConsumerReferenceQuery) -> Result<CapabilityQueryResponse<RuntimeToolsConsumerReferenceView>, ApplicationError>` |
| exact request / response schema | §8.9 `GetRuntimeToolsConsumerReferenceQuery { runtime_tools_consumer_ref_id }` -> `RuntimeToolsConsumerReferenceView` embedding `ReferenceResolutionStateView`;shared §6.3 |
| visibility resolver | form `ReferenceSubjectRef::RuntimeToolsConsumer(id)`,then `resolve_subject(actor, ExternalReference(subject))` before ref / state load |
| Step 9 flow | `query_get_runtime_tools_consumer_reference_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `runtime_tools_consumer_ref_id` | caller stable local typed id;missing -> `MissingRequiredField`;wrong reference family -> `InvalidField` | `CapabilityExternalReferenceRepository::get_with_version(RuntimeToolsConsumer(id))` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `runtime_tools_consumer_ref_id`;`consumer_kind`;`consumer_locator`;`consumer_scope`;`version`;`created_at`;`updated_at` | copied from typed `CapabilityExternalReference::RuntimeToolsConsumer`;no allowlist、provider route、execution state or tool result |
| `resolution.*` | all canonical state view fields copied from current state by the same subject;after ref load,state absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and state id / kind / subject / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` / surface | visible ref miss -> `None`;non-resolved state explicit per §8.16.6;resolver `NotVisible` prevents local ref / state load |
| no-write gate | no UoW、runtime / tools invocation、consumer registration mutation、external resolver、idempotency、stored result、save / append or refresh |

#### 8.16.9 `GetSdkExposureConsumerReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-sdk-exposure-consumer-reference`;受信同步SDK server-consumer boundary caller |
| API handler | `CapabilityQueryHandlers::get_sdk_exposure_consumer_reference(CapabilityQueryRequest<GetSdkExposureConsumerReferenceQuery>) -> Result<CapabilityQueryResponse<SdkExposureConsumerReferenceView>, ApplicationError>` |
| application service | `CapabilityReferenceQueryService::get_sdk_exposure_consumer_reference(CapabilityOperationContext, GetSdkExposureConsumerReferenceQuery) -> Result<CapabilityQueryResponse<SdkExposureConsumerReferenceView>, ApplicationError>` |
| exact request / response schema | §8.9 `GetSdkExposureConsumerReferenceQuery { sdk_consumer_ref_id }` -> `SdkExposureConsumerReferenceView` embedding `ReferenceResolutionStateView`;shared §6.3 |
| visibility resolver | form `ReferenceSubjectRef::SdkConsumer(id)`,then `resolve_subject(actor, ExternalReference(subject))` before ref / state load |
| Step 9 flow | `query_get_sdk_exposure_consumer_reference_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `sdk_consumer_ref_id` | caller stable local typed id;missing -> `MissingRequiredField`;wrong family / malformed -> `InvalidField` | `CapabilityExternalReferenceRepository::get_with_version(SdkConsumer(id))` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `sdk_consumer_ref_id`;`sdk_consumer_locator`;`sdk_surface_summary`;`exposure_scope`;`version`;`created_at`;`updated_at` | copied from typed `CapabilityExternalReference::SdkConsumer`;no SDK package、client、generated binding or credential body |
| `resolution.*` | all canonical state view fields copied from current state by SDK subject;after ref load,state absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and state-id / subject / kind / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` / surface | visible ref miss -> `None`;non-resolved state mapping is identical to §8.16.6;resolver `NotVisible` hides id/body |
| no-write gate | no UoW、SDK package / client generation、consumer registration mutation、external resolver、idempotency、stored result、save / append or refresh |

#### 8.16.10 `GetObservabilityAuditReference`

| 项 | exact contract |
|---|---|
| route / caller | `POST /v1/capability-hub/queries/get-observability-audit-reference`;受信同步observability / audit boundary caller without raw-material authority |
| API handler | `CapabilityQueryHandlers::get_observability_audit_reference(CapabilityQueryRequest<GetObservabilityAuditReferenceQuery>) -> Result<CapabilityQueryResponse<ObservabilityAuditReferenceView>, ApplicationError>` |
| application service | `CapabilityReferenceQueryService::get_observability_audit_reference(CapabilityOperationContext, GetObservabilityAuditReferenceQuery) -> Result<CapabilityQueryResponse<ObservabilityAuditReferenceView>, ApplicationError>` |
| exact request / response schema | §8.9 `GetObservabilityAuditReferenceQuery { observability_audit_ref_id }` -> `ObservabilityAuditReferenceView` embedding `ReferenceResolutionStateView`;shared §6.3 |
| visibility resolver | form `ReferenceSubjectRef::ObservabilityAudit(id)`,then `resolve_subject(actor, ExternalReference(subject))` before ref / state load |
| Step 9 flow | `query_get_observability_audit_reference_flow` |

| request field | source / validation / missing handling | repository key |
|---|---|---|
| `observability_audit_ref_id` | caller stable local typed id;missing -> `MissingRequiredField`;wrong family / malformed -> `InvalidField` | `CapabilityExternalReferenceRepository::get_with_version(ObservabilityAudit(id))` |

| response field / surface | exact source and missing / visibility handling |
|---|---|
| `observability_audit_ref_id`;`audit_material_kind`;`audit_locator`;`version`;`created_at`;`updated_at` | copied from typed `CapabilityExternalReference::ObservabilityAudit`;no raw log、metric、span、audit content、evidence alias or acceptance signature |
| `resolution.*` | all canonical state view fields copied from current state by audit subject;after ref load,state absence -> `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` and ref state-id / kind / subject / version mismatch -> `ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry)` |
| `body` / surface | visible ref miss -> `None`;non-resolved state explicit per §8.16.6;resolver `NotVisible` suppresses id/body;no raw-store fallback |
| no-write gate | no UoW、audit handoff / fetch、external resolver、idempotency、stored result、save / append、evidence generation or refresh |

### 8.17 Query protocol family stop-review

`CH-DDD-S9-COLLECTION-DEGRADED-001` clarification applies to all collection-resolver Query cards in this batch. A resolver-level `Degraded` decision carries no typed visible-item subset,so the service returns a degraded empty page with no cursor and performs zero target list/search calls. Only after a `Visible` decision may persisted item states such as trace Partial / HandoffPending、directory Stale / Rebuilding / Unavailable、downstream feedback states or reconciliation outcomes retain declared body-free items and aggregate the outer degraded surface. Implementations must not list first and infer visibility from item state、first item、cursor、timestamp or error text. This changes no public schema、object、repository、trait or Port.

#### 8.17.1 Query coverage audit

| 审计项 | 预期 | 实际结论 | 缺口 / 修正 |
|---|---:|---|---|
| HLD Query inventory | 33 | §4.4 / §8.12 / §8.13~§8.16均为33,一一对应 | pass |
| request schema | 33 | 33个`*Query`均有字段级Rust schema;selector / scope二级类型在§8.1闭合 | pass |
| response schema | 33 | single / page / union body使用§8.2~§8.9字段级view schema和§6.3~§6.4 shared surface | pass |
| API handler | 33 | §8.10 `CapabilityQueryHandlers`含33个exact method | pass |
| application callable | 33 | §8.11八个query service trait合计33个exact method | pass |
| closed HTTP route | 33 | §8.12含33条schema-version-1 `POST` route,无generic alias | pass |
| independent protocol card | 33 | §8.13为6,§8.14为8,§8.15为9,§8.16为10 | pass |
| unique Step 9 flow | 33 | 每卡一个唯一`query_*_flow`,无共享generic flow替代独立入口 | pass |

#### 8.17.2 Visibility / page / failure audit

| 审查项 | 结论 | exact gate |
|---|---|---|
| resolver-first single read | pass after Step 6 / 7 minimal reopen | 每个single selector先从request typed ref形成`CapabilityReadSubjectRef`,调用`resolve_subject`,再读truth / material / report;`GetFormalVisibilityApplicability`先resolve `FormalExposure`,`GetReferenceResolutionState`先resolve `ExternalReference` |
| page-level empty visibility | pass after Step 7 minimal reopen | identity、registry、descriptor、relation、consumer-view、trace、downstream、directory search / browse和reconciliation scope均在repository page前调用专用resolver;empty page不依赖第一项或cursor |
| visible missing | closed | single query使用`Visible + body=None`;reconciliation Scope分支使用`Some(ScopePage(empty))`;missing不伪装NotVisible或Fresh projection |
| not visible | closed | single无body / subject id;page无items / cursor;body repository不读取 |
| degraded source | closed | marker只来自resolution、persisted state、canonical reference state或dedicated mapper;不解析error text、timestamp、ref string或adapter私有状态 |
| loaded consistency | closed after Step 12 batch `12.4` | loaded owner/version/union/index不对称、registered ref缺current state或committed object缺required sidecar统一返回exact `ApplicationError::ConsistencyDefect`;不得降格为`Degraded(Missing / ReferenceUnavailable)`、normal missing、row drop或fallback |
| page mapping | closed | public cursor与repository cursor单向opaque映射;query + scope binding、visible item count和next-cursor-derived `has_more`固定 |
| repository failure | closed | 返回typed `ApplicationError`;不得转换为visible empty、missing、NotVisible或persisted Failed state |

#### 8.17.3 Boundary / no-write audit

| 审查项 | 结论 | 边界 |
|---|---|---|
| query write side effect | none | 33卡均先`context.assert_query_no_write()`;不begin UoW、不reserve idempotency、不保存stored result、不save / append、不mark / refresh / rebuild / repair |
| external collaboration | none | 不调用六类external resolver、audit handoff、event collaboration、runtime / tools execution或SDK / marketplace surface |
| owner body boundary | pass | governance / method / secret / external document / runtime-tools / SDK / observability只返回typed ref、locator / safe summary和canonical state,无相邻仓正文 |
| governance seam | pass | access review与governance approval保持分离;Query不形成approval、Policy decision或runtime authorization |
| protocol secondary types | pass | 本batch新增的struct / enum、field、variant及variant payload均使用英文`///`;public page / surface复用§6.3~§6.4唯一schema |
| Step 6 / 7 blocker | resolved | `CH-DDD-S7-QUERY-RESOLUTION-001`已通过Step 6 read-subject扩展和Step 7 resolver Port闭合;未新增business truth、write path或local persisted event intent |

Query协议族状态为`completed_wait_user_review`。本停审不进入Inbound Event batch `8.4`,不修改正式`03-详细设计.md`,不创建implementation ledger / boundary skeleton,也不伪造实现commit、run_id、测试结果、evidence alias或验收签署。

## 9. Inbound Event Consumer Protocol

Inbound Event Consumer只承接外部owner发布的body-free reference change或downstream impact feedback。worker负责envelope header / source actor / source family / schema version归一化,application consumer负责幂等、matching resolver、local ref / canonical state或downstream summary写入及完整receipt存储。任何consumer都不得直接创建或改写governance approval、Policy、method body / lifecycle、capability identity、seam / method relation、formal exposure、runtime / tools execution、SDK client、marketplace listing或external owner truth。

### 9.1 Inbound secondary public contract

```rust
/// Selects whether an inbound reference event targets one local reference or a new candidate.
pub enum CapabilityInboundReferenceTarget {
    /// Update or recheck one already registered local reference subject.
    Existing {
        /// Exact local reference subject expected by the concrete consumer family.
        reference_subject: ReferenceSubjectRef,
    },
    /// Resolve the body-free candidate and reuse an exact digest match or register a new reference.
    ResolveOrRegister,
}

/// Body-free method-library change summary used only by the inbound protocol boundary.
pub struct CapabilityMethodAssetChangeSummary(
    /// Validated summary without method content, definition, version body, or source code.
    pub CapabilitySafeText,
);

/// Body-free observability or audit change summary used only by the inbound protocol boundary.
pub struct CapabilityAuditMaterialChangeSummary(
    /// Validated summary without raw logs, spans, metrics, alerts, or audit material.
    pub CapabilitySafeText,
);

/// Body-free external document change summary used only by the inbound protocol boundary.
pub struct CapabilityExternalDocumentChangeSummary(
    /// Validated summary without protocol, schema, guide, or API specification body.
    pub CapabilitySafeText,
);

/// Downstream consumer families allowed to report capability impact feedback.
pub enum CapabilityInboundDownstreamConsumerRef {
    /// Registered runtime or tools consumer boundary.
    RuntimeTools(
        /// Local runtime or tools consumer reference identifier.
        RuntimeToolsConsumerRefId,
    ),
    /// Registered SDK server-consumer boundary.
    Sdk(
        /// Local SDK exposure consumer reference identifier.
        SdkExposureConsumerRefId,
    ),
}

/// Closed body-free feedback shape reported by a downstream consumer.
pub enum CapabilityDownstreamImpactFeedback {
    /// A complete body-free impact observation was received.
    Received {
        /// Allowed observation without execution payload or tool result.
        observation: ConsumptionImpactObservationSummary,
    },
    /// Only part of the body-free impact observation is available.
    Partial {
        /// Available body-free portion of the downstream observation.
        observation: ConsumptionImpactObservationSummary,
        /// Explicit reason why the observation is incomplete.
        gap_reason: ConsumptionFeedbackGapReason,
    },
    /// The downstream observation is delayed but may later become available.
    Delayed {
        /// Optional body-free observation already available before completion.
        observation: Option<ConsumptionImpactObservationSummary>,
        /// Explicit safe reason for the delay.
        reason: ChangeReason,
    },
    /// The downstream consumer cannot currently provide a safe observation.
    Unavailable {
        /// Explicit safe reason for unavailability.
        reason: ChangeReason,
    },
    /// The downstream consumer explicitly reports that no action is required.
    Ignored {
        /// Explicit safe reason for ignoring this impact.
        reason: ChangeReason,
    },
}
```

Secondary contract rules:

- `CapabilityInboundReferenceTarget::Existing`必须使用当前consumer唯一允许的`ReferenceSubjectRef` variant;variant mismatch在resolver或repository调用前返回`Rejected`,不得按id文本改写variant。
- `ResolveOrRegister`先由application从payload的closed body-free fields计算`ReferenceCandidateDigest`,再调用`find_by_candidate_digest`;命中必须复用exact local subject,未命中才能生成local ref / state id。worker / resolver / repository不得生成或猜local id。
- `Existing`同样必须对new candidate digest调用`find_by_candidate_digest`:未命中表示可更新当前subject;命中同一subject表示一致;命中另一subject表示candidate ownership collision并`Quarantined`。不得把同一body-free candidate复制到第二个local ref,也不得自动合并两个subject。
- 三类`*ChangeSummary`只进入forbidden-body scan、request digest和safe protocol diagnostic;它们不是external truth、domain object或local persisted material,也不得替代matching resolver observation。
- `CapabilityInboundDownstreamConsumerRef`只允许runtime/tools或SDK server-consumer;不接受ecosystem / marketplace context,并显式映射到`CapabilityConsumerRef::{RuntimeTools, Sdk}`。
- `CapabilityDownstreamImpactFeedback`与Step 6 summary factory严格对称:`Received`走`from_consumer_feedback`;其余variant走`from_reported_state`。empty safe text、variant字段组合不完整或execution / SDK client body命中均不得进入factory。

### 9.2 Typed inbound payload schema

```rust
/// Payload for a governance-result reference change published by the governance boundary.
pub struct ConsumeGovernanceResultReferenceChangedPayload {
    /// Existing local target or resolve-and-register instruction.
    pub target: CapabilityInboundReferenceTarget,
    /// Body-free governance result or policy-result classification.
    pub governance_ref_kind: GovernanceRefKind,
    /// Body-free pointer to the governance-owned source.
    pub governance_source: GovernanceSourceRef,
    /// Allowed governance result scope without approval or policy body.
    pub result_scope_summary: GovernanceResultScopeSummary,
    /// Upstream-declared safe summary checked against the resolver-owned safe summary.
    pub declared_safe_summary: GovernanceSafeSummary,
}

/// Payload for a method-library asset reference change.
pub struct ConsumeMethodAssetReferenceChangedPayload {
    /// Existing local target or resolve-and-register instruction.
    pub target: CapabilityInboundReferenceTarget,
    /// Body-free method asset classification.
    pub method_asset_kind: MethodAssetKindSummary,
    /// Body-free method-library locator.
    pub method_library_locator: MethodLibraryLocator,
    /// Body-free explanation of the upstream asset change.
    pub change_summary: CapabilityMethodAssetChangeSummary,
}

/// Payload for body-free downstream consumption impact feedback.
pub struct ConsumeDownstreamConsumptionImpactReportedPayload {
    /// Exact capability impact fact answered by the downstream consumer.
    pub impact_fact_ref: CapabilityChangeImpactFactRef,
    /// Registered downstream consumer boundary that produced the feedback.
    pub consumer_ref: CapabilityInboundDownstreamConsumerRef,
    /// Closed state-specific body-free feedback.
    pub feedback: CapabilityDownstreamImpactFeedback,
}

/// Payload for an external MCP, A2A, or API capability-source reference change.
pub struct ConsumeExternalCapabilitySourceReferenceChangedPayload {
    /// Existing local target or resolve-and-register instruction.
    pub target: CapabilityInboundReferenceTarget,
    /// Declared MCP, A2A, or external API source family.
    pub source_kind: ExternalCapabilitySourceKind,
    /// Body-free external source locator summary.
    pub external_locator: ExternalLocatorSummary,
}

/// Payload for an observability or audit material reference change.
pub struct ConsumeAuditMaterialReferenceChangedPayload {
    /// Existing local target or resolve-and-register instruction.
    pub target: CapabilityInboundReferenceTarget,
    /// Body-free audit material classification.
    pub audit_material_kind: AuditMaterialKind,
    /// Body-free audit material locator summary.
    pub audit_locator: AuditMaterialLocatorSummary,
    /// Body-free explanation of the external audit-reference change.
    pub change_summary: CapabilityAuditMaterialChangeSummary,
}

/// Payload for an external protocol, schema, or guide reference change.
pub struct ConsumeExternalDocumentReferenceChangedPayload {
    /// Existing local target or resolve-and-register instruction.
    pub target: CapabilityInboundReferenceTarget,
    /// Body-free external document classification.
    pub document_kind: ExternalDocumentKind,
    /// Body-free external document locator summary.
    pub document_locator: ExternalDocumentLocatorSummary,
    /// Body-free explanation of the external document-reference change.
    pub change_summary: CapabilityExternalDocumentChangeSummary,
}
```

Payload fields never repeat`source_actor_context`、`consumer_name`、`source_family`、`source_event_ref`、`schema_version`、`idempotency_key`、`trace_id`或`occurred_at`;adding any duplicate envelope authority field is a protocol incompatibility,not an alias.

### 9.3 Envelope specialization and trusted-source gate

| consumer | exact public input | required source family | trusted actor authority | schema |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `CapabilityInboundEventEnvelope<ConsumeGovernanceResultReferenceChangedPayload>` | `Governance` | configured L1-governance integration / system actor | only version `1` |
| `ConsumeMethodAssetReferenceChanged` | `CapabilityInboundEventEnvelope<ConsumeMethodAssetReferenceChangedPayload>` | `MethodLibrary` | configured L3-method-library integration / system actor | only version `1` |
| `ConsumeDownstreamConsumptionImpactReported` | `CapabilityInboundEventEnvelope<ConsumeDownstreamConsumptionImpactReportedPayload>` | `DownstreamConsumer` | configured runtime、tools、SDK或product integration actor matching the declared consumer family | only version `1` |
| `ConsumeExternalCapabilitySourceReferenceChanged` | `CapabilityInboundEventEnvelope<ConsumeExternalCapabilitySourceReferenceChangedPayload>` | `ExternalCapabilitySource` | configured MCP / A2A / API discovery integration actor allowed for the payload source kind | only version `1` |
| `ConsumeAuditMaterialReferenceChanged` | `CapabilityInboundEventEnvelope<ConsumeAuditMaterialReferenceChangedPayload>` | `ObservabilityAudit` | configured observability / audit integration actor | only version `1` |
| `ConsumeExternalDocumentReferenceChanged` | `CapabilityInboundEventEnvelope<ConsumeExternalDocumentReferenceChangedPayload>` | `ExternalDocument` | configured external-document integration actor | only version `1` |

Envelope gate order:

1. worker先读取不含payload body的header,验证closed `consumer_name`、required `source_family`、trusted actor source binding、`source_event_ref`、idempotency key、trace和schema version。
2. schema version不是`1`时,worker ingress在调用任一§9.4 typed handler前停止,不得反序列化typed payload;ingress直接从已验证header返回`UnsupportedSchema`、`result_ref=None`、empty effect refs、`markers=[NoLocalEffect]`和redacted issue refs,不得reserve、调用resolver或打开UoW。header-first decode能力的具体codec binding留Step 14,但不得弱化此顺序。
3. source actor不是当前family的configured integration / system actor时返回`Rejected`或`Quarantined`;trusted source例外只绕过participant交互身份,不绕过source isolation、digest、forbidden-body、typed target、idempotency或state gate。
4. supported header通过后才把`CapabilitySourceEventRef`映射为application-local`CapabilityInboundEventRef`,并从closed `(consumer_name, source_family, source_event_ref)`确定性形成application idempotency key。worker调用existing `CapabilityOperationContext::from_inbound_event(...)`时必须同时传入validated `source_family`、原public `CapabilitySourceEventRef`、mapped local `CapabilityInboundEventRef`、source-provided `idempotency_key`和derived application key。application context使用public ref回填receipt / digest、local ref写本地feedback source；两者不得互相解析。source-provided key进入stable request digest但不参与application key派生,所以同一source event换source key命中同一reservation并形成digest conflict。Step 13已固定canonical frame / SHA-256 contract，并按显式用户授权采用exact `as_str().as_bytes()`字节边界。不得从topic、consumer group、payload locator或actor display name构造fallback ref / key。
5. `occurred_at`只保留upstream occurrence语义;local object / state / result的authoritative time始终来自`ClockPort`。

### 9.4 Worker handler exact callable surface

以下trait归`worker::consumers`。它定义supported schema完成header-first gate与typed payload decode后的logical event handler surface,不表示选择了broker、codec、topic或consumer group。worker ingress在method dispatch前完成§9.3 header / schema gate;每个typed method只验证consumer-specific envelope / payload symmetry、映射operation context、调用application并把receipt映射到ack / retry / quarantine。它不得直接调用repository、resolver、UoW、domain member或stored-result port。

```rust
/// Worker entry handlers for the six closed capability-hub inbound event protocols.
#[async_trait::async_trait]
pub trait CapabilityInboundEventHandlers: Send + Sync {
    /// Consumes one body-free governance-result reference change.
    async fn consume_governance_result_reference_changed(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeGovernanceResultReferenceChangedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Consumes one body-free method-library asset reference change.
    async fn consume_method_asset_reference_changed(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeMethodAssetReferenceChangedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Consumes one body-free downstream consumption impact report.
    async fn consume_downstream_consumption_impact_reported(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeDownstreamConsumptionImpactReportedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Consumes one body-free external capability-source reference change.
    async fn consume_external_capability_source_reference_changed(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeExternalCapabilitySourceReferenceChangedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Consumes one body-free observability or audit material reference change.
    async fn consume_audit_material_reference_changed(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeAuditMaterialReferenceChangedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Consumes one body-free external document reference change.
    async fn consume_external_document_reference_changed(
        &self,
        event: CapabilityInboundEventEnvelope<ConsumeExternalDocumentReferenceChangedPayload>,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;
}
```

### 9.5 Application consumer exact callable surface

以下trait归既有`application::consumer_service`;不新增平行service文件或generic string dispatcher。worker必须先从envelope构造`CapabilityOperationContext`,保留§9.3要求的Inbound authority metadata,再把context与typed payload分离传入。application以context中的source family / public source event / source-provided key + payload fields计算stable request digest;envelope trace / occurrence time、transport metadata和generated local ids不得进入digest。

```rust
/// Application orchestration surface for capability-hub inbound event consumers.
#[async_trait::async_trait]
pub trait CapabilityInboundConsumerService: Send + Sync {
    /// Resolves and records a governance-result reference change without mutating seam truth.
    async fn consume_governance_result_reference_changed(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeGovernanceResultReferenceChangedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Resolves and records a method-asset reference change without mutating relation truth.
    async fn consume_method_asset_reference_changed(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeMethodAssetReferenceChangedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Appends one body-free downstream impact feedback summary.
    async fn consume_downstream_consumption_impact_reported(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeDownstreamConsumptionImpactReportedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Resolves and records an external capability-source reference change without creating identity truth.
    async fn consume_external_capability_source_reference_changed(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeExternalCapabilitySourceReferenceChangedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Resolves and records an audit-material reference change without invoking audit handoff.
    async fn consume_audit_material_reference_changed(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeAuditMaterialReferenceChangedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;

    /// Resolves and records an external-document reference change without mutating descriptor truth.
    async fn consume_external_document_reference_changed(
        &self,
        context: CapabilityOperationContext,
        payload: ConsumeExternalDocumentReferenceChangedPayload,
    ) -> Result<CapabilityInboundEventReceipt, ApplicationError>;
}
```

### 9.6 Closed logical event mapping

| consumer name | logical event name | handler method | application method | input -> output |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `capability-hub.inbound.governance-result-reference-changed.v1` | `consume_governance_result_reference_changed` | same | `CapabilityInboundEventEnvelope<ConsumeGovernanceResultReferenceChangedPayload>` -> `CapabilityInboundEventReceipt` |
| `ConsumeMethodAssetReferenceChanged` | `capability-hub.inbound.method-asset-reference-changed.v1` | `consume_method_asset_reference_changed` | same | `CapabilityInboundEventEnvelope<ConsumeMethodAssetReferenceChangedPayload>` -> `CapabilityInboundEventReceipt` |
| `ConsumeDownstreamConsumptionImpactReported` | `capability-hub.inbound.downstream-consumption-impact-reported.v1` | `consume_downstream_consumption_impact_reported` | same | `CapabilityInboundEventEnvelope<ConsumeDownstreamConsumptionImpactReportedPayload>` -> `CapabilityInboundEventReceipt` |
| `ConsumeExternalCapabilitySourceReferenceChanged` | `capability-hub.inbound.external-capability-source-reference-changed.v1` | `consume_external_capability_source_reference_changed` | same | `CapabilityInboundEventEnvelope<ConsumeExternalCapabilitySourceReferenceChangedPayload>` -> `CapabilityInboundEventReceipt` |
| `ConsumeAuditMaterialReferenceChanged` | `capability-hub.inbound.audit-material-reference-changed.v1` | `consume_audit_material_reference_changed` | same | `CapabilityInboundEventEnvelope<ConsumeAuditMaterialReferenceChangedPayload>` -> `CapabilityInboundEventReceipt` |
| `ConsumeExternalDocumentReferenceChanged` | `capability-hub.inbound.external-document-reference-changed.v1` | `consume_external_document_reference_changed` | same | `CapabilityInboundEventEnvelope<ConsumeExternalDocumentReferenceChangedPayload>` -> `CapabilityInboundEventReceipt` |

Logical event names are closed protocol identities,not broker topic configuration.Physical topic / subscription、consumer group、partition key、codec、ack deadline、dead-letter target和retry policy留Step 14 / `04`;runtime binding不得改变consumer name、schema version、source-family mapping或payload type。

### 9.7 Common idempotency, receipt, and local-effect contract

#### 9.7.1 Request digest and duplicate replay

| gate | exact contract |
|---|---|
| stable request digest | source family + source event ref + source-provided idempotency key + concrete payload fields / target variant进入canonical digest;operation name由reservation单独比较。不含actor display data、trace、`occurred_at`、transport metadata、random/generated local id、resolver response或current local state |
| key binding | normalized application key由closed operation + source family + source event ref确定性形成,不含source-provided key。同source event换source key或payload命中同一canonical reservation并产生digest conflict;同key换operation由operation comparison冲突;无需按source event全表扫描 |
| fresh reserve | supported envelope + decoded typed payload + initial body-free validation通过后才可reserve;exact reserve / external call / accepted-write ordering留Step 11 / 13闭合 |
| completed duplicate | application先以normalized key调用`CapabilityIdempotencyRepository::get_with_version`;已存在且same channel + operation + digest + Completed时,不开UoW、不取Clock / IdGenerator,只读取`StoredCapabilityResultRepository::get_consumer_receipt`;返回原`result_ref`与effect / follow-up refs,在响应映射中临时把disposition改为`DuplicateReplayed`并加入`StoredReplay`;stored original receipt保持原fresh disposition且不得覆盖。preflight absent后才取reservation time并调用atomic`reserve_if_absent`;若并发插入使其返回Existing,不得调用业务IdGenerator、resolver、domain factory或effect write,精确race分类留Step 13 |
| missing / corrupt replay | completed reservation缺typed receipt、shell / surface / digest / operation不对称时返回`ApplicationError`;不得从current ref / state / summary重算receipt |
| duplicate conflict | original reservation / result保持不变;返回`Quarantined`、`BoundaryQuarantined + NoLocalEffect`、empty effect / follow-up refs和redacted issue,不得泄漏原receipt |

#### 9.7.2 Fresh disposition and storage matrix

| fresh disposition | condition | `result_ref` | local canonical effect | stored typed receipt |
|---|---|---|---|---|
| `Accepted` | declared ref / state or downstream summary was created / updated successfully | `Some` | only the exact effect declared by the concrete card | yes,same accepted local UoW |
| `Ignored` | event is valid and relevant but creates no local canonical revision;follow-up marker may still be returned | `Some` | none;`NoLocalEffect` required | yes,to make no-op deterministic |
| `Delayed` | required local prerequisite or matching resolver is temporarily unavailable before an accepted local write | `None` | none;`RetryRequired + NoLocalEffect` | no completed receipt;reservation/effect UoW must leave no committed write so the same event can retry through Step 13 |
| `Rejected` | supported typed payload violates a stable field / subject / state / owner rule without forbidden material | `Some` after a safe stable rejection is reserved;otherwise `None` | none;`NoLocalEffect` required | safe redacted receipt only when a replayable rejection was completed |
| `UnsupportedSchema` | header schema is not version `1` | `None` | none;payload not decoded | no reserve / stored result |
| `Quarantined` | source / target contradiction、forbidden body marker、digest conflict or unsafe subject relation | `Some` only for a safely canonicalized stable quarantine;conflict with an existing key returns `None` | none;`BoundaryQuarantined + NoLocalEffect` required | never stores offending input or external body |

`CapabilityDownstreamImpactFeedback::Delayed` / `Unavailable` / `Ignored` are domain feedback states,not consumer-processing dispositions.If their typed summary is saved successfully,the receipt disposition is`Accepted`;the receipt becomes`Delayed`only when this consumer invocation itself cannot safely complete.

#### 9.7.3 Accepted local UoW and receipt symmetry

- accepted reference effect saves only`CapabilityExternalReference` + matching `ReferenceResolutionState` revision as needed;accepted downstream effect saves only`DownstreamConsumptionImpactSummary`.No consumer directly saves relation、identity、descriptor、trace、impact fact、formal exposure、derived material or event collaboration intent。
- `changed_reference_subject_refs` contains every subject whose external ref object or canonical state revision was created / updated;`reference_state_refs` contains only canonical state revisions actually created / transitioned.Each state ref must belong to a listed subject,but a body-free ref field change with an unchanged state may list only the subject.The subject list identifies effect ownership and does not falsely claim the ref object changed when only its canonical state did。
- `downstream_summary_refs` is non-empty only for the downstream feedback consumer and must contain the exact saved summary ref.Reference consumers must return it empty。
- `affected_material_refs` remains empty for all six consumers in this batch. Step 7 explicitly forbids reference-only consumer direct relation / derived-material mutation;follow-up work is represented only by typed `follow_up_markers` and must enter an explicit Command / Job later。
- a completed fresh receipt is mapped to`StoredCapabilityOperationResult { result_kind=ConsumerReceipt, disposition=InboundEvent(original disposition) }`,matching serialized surface,`CapabilityConsumerReceiptEnvelope`,and completed idempotency record.The local effect、typed receipt、stored shell/surface and completion use the same declared UoW;exact persistence order is Step 11。
- `issue_refs` are stable redacted references generated by protocol / policy mapping.They never contain raw field values、resolver body、external error、stack、topic、credential、execution payload、method/governance/document/audit body、evidence alias or acceptance claim。
- all receipt vectors are stable and duplicate-free:`markers` / `follow_up_markers` use closed variant declaration order then typed-ref order;reference subjects / state refs / downstream refs / material refs use typed variant rank then id/version order.Worker不得按arrival order、hash iteration、repository row order或adapter private order重排。

#### 9.7.4 Inbound input boundary、Port return与terminal reference distinction

| branch source | exact disposition / error | persistence rule |
|---|---|---|
| envelope / payload actor、family、target、candidate或body-free field contradiction | typed `Rejected`或`Quarantined` receipt | 只在可安全canonicalize且已reserve时保存redacted receipt；offending body永不保存 |
| matching resolver返回的`reference_subject / reference_kind / candidate_digest`与selected candidate不对称 | exact `ApplicationError::ConsistencyDefect(PortReturn(matching resolver), ReferenceObservationShape)` | whole local UoW rollback；不得伪装`Quarantined` receipt或保存resolver output |
| governance resolver的typed subject/kind/digest对称,但request `declared_safe_summary`不等于resolver-owned `allowed_safe_summary` | typed `Quarantined` receipt | 这是request declaration与external authority不一致,不是Port return shape defect；不保存ref/state |
| body scanner在candidate形成前命中forbidden external body | `Quarantined + BoundaryQuarantined + NoLocalEffect` | issue顺序为`BoundaryQuarantined`后`BodyForbidden`;不调用resolver |
| new subject的matching resolver返回typed `Forbidden` | typed `Quarantined` receipt | `Forbidden`不是任一Inbound factory允许的initial value；不创建ref/state |
| existing或digest-reused registered subject从non-terminal收到typed `Forbidden` | accepted canonical state transition | 只保存body-free state/reason和matching capture；不保存external body,不把accepted receipt改成processing failure |
| terminal `Invalid / Forbidden`收到exact same value + same reason | stored `Ignored + NoLocalEffect` | no state revision/capture；follow-up可保持 |
| terminal `Invalid / Forbidden`收到不同value或same value + changed reason | stable `Rejected` | terminal candidate不原地恢复或改写reason；caller必须以different candidate走`ResolveOrRegister`形成new subject |

完整`Resolved / Unresolved / Stale / Unavailable / Expired / Invalid / Forbidden`是canonical state truth,不是Inbound receipt issue的第二份投影。Accepted / Ignored receipt只有在processing validation、delay或quarantine发生时才写`issue_refs`;成功保存一个non-Resolved state本身不追加Query read-surface issue code。

### 9.8 Independent inbound protocol cards

#### 9.8.1 `ConsumeGovernanceResultReferenceChanged`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.governance-result-reference-changed.v1`;configured L1-governance collaboration boundary,not a capability-hub approval participant |
| worker handler | `CapabilityInboundEventHandlers::consume_governance_result_reference_changed(CapabilityInboundEventEnvelope<ConsumeGovernanceResultReferenceChangedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_governance_result_reference_changed(CapabilityOperationContext, ConsumeGovernanceResultReferenceChangedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 target;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_governance_result_reference_changed_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `target` | upstream integration supplies exact local subject when known,otherwise`ResolveOrRegister`;missing -> `Rejected`;Existing must be`GovernanceResult` | exact get or kind + digest lookup;never scan seam / locator text |
| `governance_ref_kind` | closed result / policy-result category;missing / unsupported -> `Rejected` | candidate kind=`GovernanceResult`;`GovernanceResultRef.governance_ref_kind` |
| `governance_source` | body-free governance-owned pointer;empty / governance body -> `Rejected` / `Quarantined` | resolver input;`GovernanceResultRef.governance_source` |
| `result_scope_summary` | allowed body-free scope;approval、Policy、shared_rules or workflow body -> `Quarantined` | resolver input;`GovernanceResultRef.result_scope_summary` |
| `declared_safe_summary` | upstream safe declaration,required and body-free;must equal resolver`allowed_safe_summary` | validation / follow-up input only;not stored in the ref object and never written into seam by this consumer |

| construction / effect | exact rule |
|---|---|
| candidate / subject | application derives`ReferenceCandidate(kind=GovernanceResult, locator summary from governance kind + source + scope, canonical digest, safe marker)`;Existing loads exact subject,ResolveOrRegister reuses exact digest match or generates`GovernanceResultRefId` |
| resolver | call`GovernanceResultReferencePort::resolve_governance_result_reference`;observation subject / kind / digest必须与selected candidate对称,否则是technical consistency defect；resolver-owned allowed safe summary与request declaration不等是typed quarantine |
| new local effect | generate state id;call`ReferenceResolutionState::from_initial_resolution`;call`GovernanceResultRef::register(..., candidate_digest, state_id, ...)`;save ref + state in accepted UoW |
| existing local effect | verify ref variant / id / persisted digest and current state-id parity;governance kind / source must equal stored immutable fields;apply`replace_scope(scope, digest, state_id, now)`only when body-free scope changed;apply canonical state transition only when observation value / reason requires a new revision |
| receipt | changed ref / state refs exactly reflect writes;return`GovernanceSeamReview(governance_result_ref_id)`when the accepted or no-op change signal requires explicit seam review;never return relation / approval / Policy effect |
| Step 7 ports | external-ref / canonical-state repositories、governance resolver、Clock / IdGenerator、UoW、idempotency / typed stored receipt;no seam / exposure / derived repository write |

Stable boundary outcomes:

- resolver temporarily unavailable without typed observation ->`Delayed`;no ref/state write or completed result。
- exact candidate + canonical state unchanged ->`Ignored + NoLocalEffect`;follow-up marker may remain,allowing a caller to initiate an explicit seam review without claiming an automatic mutation。
- declared safe summary mismatch、request-side candidate ownership contradiction、approval / Policy body或new-subject typed Forbidden ->`Quarantined`;matching resolver subject/kind/digest不对称则是technical consistency error。Existing non-terminal subject可按canonical policy进入body-free Forbidden terminal。
- accepted receipt never includes governance approval、vote、Policy / shared_rules body、workflow state or seam state,does not append a governance seam change record,and does not change formal exposure。

#### 9.8.2 `ConsumeMethodAssetReferenceChanged`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.method-asset-reference-changed.v1`;configured L3-method-library relation boundary |
| worker handler | `CapabilityInboundEventHandlers::consume_method_asset_reference_changed(CapabilityInboundEventEnvelope<ConsumeMethodAssetReferenceChangedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_method_asset_reference_changed(CapabilityOperationContext, ConsumeMethodAssetReferenceChangedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 target / safe summary;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_method_asset_reference_changed_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `target` | exact local method subject when known,otherwise resolve/register;Existing variant mismatch -> `Rejected` | external-ref repository exact / digest lookup |
| `method_asset_kind` | body-free upstream classification;missing / empty -> `Rejected` | resolver input;`MethodAssetRef.method_asset_kind` |
| `method_library_locator` | body-free method-library locator;must not be a Cargo path/source body escape | candidate locator;`MethodAssetRef.method_library_locator` |
| `change_summary` | required safe explanation;method content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、version body or source code -> `Quarantined` | scanner / request digest / follow-up only;not persisted as method truth |

| construction / effect | exact rule |
|---|---|
| candidate / subject | derive`ReferenceCandidate(kind=MethodAsset, locator summary from asset kind + locator, canonical digest, safe marker)`;reuse exact digest match or generate`MethodAssetRefId` |
| resolver | call`MethodAssetReferencePort::resolve_method_asset_reference`;subject / kind / digest必须与selected candidate对称,否则是technical consistency defect;resolver returns no method body |
| new local effect | construct initial canonical state with`from_initial_resolution`;construct`MethodAssetRef::register(..., candidate_digest, state_id, ...)`;save both |
| existing local effect | verify object/state parity;call`replace_locator(locator, digest, state_id, now)`only for changed candidate;transition canonical state only for a changed observation |
| receipt | exact ref/state writes plus`MethodRelationReview(method_asset_ref_id)`when explicit relation review is warranted;never returns relation truth effect |
| Step 7 ports | external-ref / state repositories、method resolver、common write/replay ports;no method relation / exposure / derived write |

Stable boundary outcomes:

- resolver unavailable ->`Delayed`;exact no-change ->`Ignored`;invalid typed fields ->`Rejected`;method body / request target contradiction或new-subject typed Forbidden ->`Quarantined`；resolver return不对称 -> technical consistency error。Existing non-terminal subject可保存typed Forbidden transition。
- accepted event registers or updates only the body-free method ref / canonical state.It does not establish、remove、reactivate or mark stale a`CapabilityMethodBodyFreeRelation`;that requires an explicit relation Command。
- no Cargo dependency on method-library、no method body / version lifecycle body、no source code and no runtime method cache enters local state or stored receipt。

#### 9.8.3 `ConsumeDownstreamConsumptionImpactReported`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.downstream-consumption-impact-reported.v1`;configured runtime、tools、SDK or product feedback boundary,not an execution endpoint |
| worker handler | `CapabilityInboundEventHandlers::consume_downstream_consumption_impact_reported(CapabilityInboundEventEnvelope<ConsumeDownstreamConsumptionImpactReportedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_downstream_consumption_impact_reported(CapabilityOperationContext, ConsumeDownstreamConsumptionImpactReportedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 consumer / feedback union;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_downstream_consumption_impact_reported_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `impact_fact_ref` | exact versioned local fact ref previously exposed for feedback;missing / stale exact revision -> `Rejected`;temporarily unavailable read -> `Delayed` | `CapabilityImpactRepository::get_impact_with_version`;factory exact impact owner |
| `consumer_ref` | closed runtime/tools or SDK local ref;source actor must be authorized for same family;missing local ref -> `Delayed`,wrong union / actor mismatch -> `Rejected` / `Quarantined` | map to`CapabilityConsumerRef`;external-ref repository validates registration;impact must affect consumer |
| `feedback.Received.observation` | complete body-free observation;empty / execution payload -> `Rejected` / `Quarantined` | `from_consumer_feedback` observation |
| `feedback.Partial.*` | observation + non-empty gap,without state reason | `from_reported_state(Partial, Some, Some, None)` |
| `feedback.Delayed.*` | optional observation + required safe delay reason,without gap | `from_reported_state(Delayed, observation, None, Some)` |
| `feedback.Unavailable.reason` / `Ignored.reason` | required safe reason;no observation / gap | `from_reported_state(Unavailable / Ignored, None, None, Some)` |

| construction / effect | exact rule |
|---|---|
| source identity | application uses context `CapabilityInboundEventRef` as `source_feedback_ref`;payload cannot override it;source-level lookup guards against a second summary for the same event |
| object construction | generate`DownstreamConsumptionImpactSummaryId`,load exact impact / registered consumer,then call the variant-exact Step 6 factory withcontext actor / trace and`ClockPort.now()` |
| local effect | save one new`DownstreamConsumptionImpactSummary`withcreate expected version;do not mutate the loaded impact fact |
| receipt | `downstream_summary_refs=[saved exact ref]`;follow-up=`CapabilityImpactReview(impact_fact_ref)`;reference / state / affected-material refs empty |
| Step 7 ports | impact repository get / source-feedback lookup / save、external-ref repository consumer validation、Clock / IdGenerator、UoW、idempotency / typed stored receipt;no runtime / tools / SDK execution port |

Stable boundary outcomes:

- all five valid feedback variants produce a domain summary and therefore an`Accepted`receipt,including payload states`Delayed`、`Unavailable`and`Ignored`。Those words describe downstream feedback,not consumer processing。
- impact does not affect the declared consumer、exact impact revision mismatch、feedback field-combination mismatch or unregistered wrong-family ref -> stable`Rejected`;temporary missing prerequisite may be`Delayed`without a completed receipt。
- execution request / response、tool result、runtime authorization / cache / allowlist、SDK client / package state、provider route / quota / cost or raw error ->`Quarantined`;offending material is never stored。
- accepted effect does not create or update`CapabilityChangeImpactFact`,does not roll back source truth,and does not trigger runtime/tools execution or formal exposure mutation。

#### 9.8.4 `ConsumeExternalCapabilitySourceReferenceChanged`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.external-capability-source-reference-changed.v1`;configured MCP / A2A / external API discovery or source-reference boundary,not an invocation endpoint |
| worker handler | `CapabilityInboundEventHandlers::consume_external_capability_source_reference_changed(CapabilityInboundEventEnvelope<ConsumeExternalCapabilitySourceReferenceChangedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_external_capability_source_reference_changed(CapabilityOperationContext, ConsumeExternalCapabilitySourceReferenceChangedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 target;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_external_capability_source_reference_changed_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `target` | exact local external-source subject when known,otherwise resolve/register;wrong variant -> `Rejected` | external-ref repository exact / digest lookup |
| `source_kind` | one of MCP / A2A / external API;must match trusted actor binding and any Existing object's immutable kind | candidate / resolver kind;`ExternalCapabilitySourceRef.source_kind` |
| `external_locator` | required body-free source locator;request / response、tool schema body、A2A message、API payload or credential -> `Quarantined` | candidate locator;`ExternalCapabilitySourceRef.external_locator` |

| construction / effect | exact rule |
|---|---|
| candidate / subject | derive`ReferenceCandidate(kind=ExternalCapabilitySource, locator=ReferenceLocatorSummary::from_external_source(&external_locator), canonical digest, safe marker)`;ResolveOrRegister reuses an exact digest match or generates`ExternalCapabilitySourceRefId` |
| resolver | call`ExternalCapabilitySourceReferencePort::resolve_source_reference`;observation subject / kind / digest必须与selected candidate对称,否则是technical consistency defect,且typed return不含invocation / provider state |
| new local effect | construct initial state with`from_initial_resolution`;construct`ExternalCapabilitySourceRef::register(..., candidate_digest, state_id, ...)`;save both |
| existing local effect | reject a source-kind change on the same subject;reject candidate digest already owned by another subject;otherwise call`replace_locator(locator, digest, state_id, now)`when locator changed and transition canonical state when observation value / reason changed |
| receipt | exact subject/state writes plus`CapabilityIdentityIntakeReview(source_ref_id)`when the source should enter explicit intake review;never returns or creates an identity ref |
| Step 7 ports | external-ref / state repositories、external source resolver、common write/replay ports;no identity / descriptor / runtime execution repository or port |

Stable boundary outcomes:

- resolver unavailable ->`Delayed`;exact unchanged candidate and state ->`Ignored`;invalid kind / locator ->`Rejected`;forbidden body、kind / actor contradiction、cross-subject digest collision或new-subject typed Forbidden ->`Quarantined`；resolver return不对称 -> technical consistency error。Existing non-terminal subject可保存typed Forbidden transition。
- accepted event only registers or updates the source pointer and canonical resolution state.It cannot call`CapabilityIdentity::create_from_intake`,cannot create an adapter descriptor,and cannot invoke MCP / A2A / API capability execution。
- provider health、route、quota、cost、failover、runtime availability and invocation result are neither candidate fields nor receipt fields。

#### 9.8.5 `ConsumeAuditMaterialReferenceChanged`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.audit-material-reference-changed.v1`;configured observability / audit reference boundary,not an evidence or acceptance authority |
| worker handler | `CapabilityInboundEventHandlers::consume_audit_material_reference_changed(CapabilityInboundEventEnvelope<ConsumeAuditMaterialReferenceChangedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_audit_material_reference_changed(CapabilityOperationContext, ConsumeAuditMaterialReferenceChangedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 target / safe summary;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_audit_material_reference_changed_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `target` | exact local observability/audit subject when known,otherwise resolve/register;wrong variant -> `Rejected` | external-ref repository exact / digest lookup |
| `audit_material_kind` | trace / audit-record / metric-summary / alert-reference classification;must match Existing immutable kind unless a new candidate is formed | resolver input;`ObservabilityAuditRef.audit_material_kind` |
| `audit_locator` | body-free external pointer;must not embed raw material or credential | candidate locator;`ObservabilityAuditRef.audit_locator` |
| `change_summary` | safe explanation for scan / digest classification only;raw log、span、trace body、metric series、alert / incident body、audit event or GRC body -> `Quarantined` | protocol validation / follow-up only;not persisted audit material |

| construction / effect | exact rule |
|---|---|
| candidate / subject | derive`ReferenceCandidate(kind=ObservabilityAudit, locator=ReferenceLocatorSummary::from_observability_audit(&audit_material_kind, &audit_locator), canonical digest, safe marker)`;constructor使用typed length-delimited composition且不得读取raw material / enum display文本;reuse exact digest match or generate`ObservabilityAuditRefId` |
| resolver | call inbound-only`ObservabilityAuditReferencePort::resolve_observability_audit_reference`;subject / kind / digest必须与selected candidate对称,否则是technical consistency defect;do not call`ObservabilityAuditHandoffPort` |
| new local effect | construct initial canonical state and`ObservabilityAuditRef::register(..., candidate, state_id, policy, now)`;save both |
| existing local effect | immutable kind mismatch or cross-subject digest collision -> quarantine;otherwise call`replace_locator(kind, locator, digest, state_id, now)`only for changed candidate and transition state only for changed observation |
| receipt | exact subject/state refs plus`AuditHandoffReview(audit_ref_id)`when an explicit traceability handoff review is warranted;no handoff receipt / evidence alias is returned |
| Step 7 ports | external-ref / state repositories、`ObservabilityAuditReferencePort`、common write/replay ports;explicitly excludes audit handoff port and trace / export mutation |

Stable boundary outcomes:

- resolver unavailable ->`Delayed`;no-change ->`Ignored`;invalid safe fields ->`Rejected`;raw material、kind / actor contradiction、digest collision或new-subject typed Forbidden ->`Quarantined`；resolver return不对称 -> technical consistency error。Existing non-terminal subject可保存typed Forbidden transition。
- accepted event records only a body-free audit pointer and canonical resolution.It does not append a traceability revision、attach the ref to an export、execute an audit handoff or claim evidence / acceptance。
- `audit_material_kind=Trace` is an external reference category,not this operation's `TraceId`;the two fields must never be substituted。

#### 9.8.6 `ConsumeExternalDocumentReferenceChanged`

| 项 | exact contract |
|---|---|
| logical event / producer | `capability-hub.inbound.external-document-reference-changed.v1`;configured external protocol / schema / guide reference boundary |
| worker handler | `CapabilityInboundEventHandlers::consume_external_document_reference_changed(CapabilityInboundEventEnvelope<ConsumeExternalDocumentReferenceChangedPayload>) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| application service | `CapabilityInboundConsumerService::consume_external_document_reference_changed(CapabilityOperationContext, ConsumeExternalDocumentReferenceChangedPayload) -> Result<CapabilityInboundEventReceipt, ApplicationError>` |
| exact schema | shared §6.1 / §6.5 / §6.6;§9.1 target / safe summary;§9.2 payload;schema version `1` |
| Step 9 flow | `inbound_consume_external_document_reference_changed_flow` |

| payload field | source / validation / missing handling | object / port mapping |
|---|---|---|
| `target` | exact local external-document subject when known,otherwise resolve/register;wrong variant -> `Rejected` | external-ref repository exact / digest lookup |
| `document_kind` | protocol specification / access guide / schema reference / policy-validated Other;must match Existing immutable kind | resolver input;`ExternalDocumentRef.document_kind` |
| `document_locator` | body-free external locator;not a document or schema body | candidate locator;`ExternalDocumentRef.document_locator` |
| `change_summary` | safe explanation used by scan / digest classification only;OpenAPI / protocol / schema / guide / provider-contract body -> `Quarantined` | protocol validation / follow-up only;not persisted document material |

| construction / effect | exact rule |
|---|---|
| candidate / subject | derive`ReferenceCandidate(kind=ExternalDocument, locator summary from document kind + locator, canonical digest, safe marker)`;reuse exact digest match or generate`ExternalDocumentRefId` |
| resolver | call`ExternalDocumentReferencePort::resolve_external_document_reference`;observation subject / kind / digest必须与selected candidate对称,否则是technical consistency defect,且typed return不含document body |
| new local effect | construct initial canonical state;construct`ExternalDocumentRef::register(..., supported_descriptor_id=None, candidate, state_id, policy, now)`;save both |
| existing local effect | preserve existing`supported_descriptor_id`;reject immutable kind change or cross-subject digest collision;call`replace_locator(locator, digest, state_id, now)`only for changed candidate and transition state only for changed observation |
| receipt | exact subject/state refs plus`DescriptorSupportReview(document_ref_id)`when explicit descriptor support review is warranted;never returns descriptor effect |
| Step 7 ports | external-ref / state repositories、external document resolver、common write/replay ports;no descriptor / registry / exposure / derived write |

Stable boundary outcomes:

- resolver unavailable ->`Delayed`;exact no-change ->`Ignored`;invalid kind / locator ->`Rejected`;document body、kind / actor contradiction、digest collision或new-subject typed Forbidden ->`Quarantined`；resolver return不对称 -> technical consistency error。Existing non-terminal subject可保存typed Forbidden transition。
- accepted event cannot bind / rebind`supported_descriptor_id`,cannot establish or replace an`AdapterDescriptor`,and cannot treat a resolved document ref as a provider runtime contract。Binding remains an explicit descriptor Command concern。
- `Other` does not relax the body boundary;it must pass the same`ReferenceResolutionPolicy`and forbidden-body scan as every named document kind。

### 9.9 Inbound protocol family stop-review

#### 9.9.1 Inventory and callable coverage audit

| audit item | expected | actual conclusion | gap / correction |
|---|---:|---|---|
| HLD inbound inventory | 6 | §4.5 / §9.2 / §9.6 / §9.8均为6,一一对应 | pass |
| typed payload schema | 6 | 6个`Consume*Payload`均有字段级Rust schema,无envelope metadata重复字段 | pass |
| worker handler | 6 | `CapabilityInboundEventHandlers`含6个exact typed method;unsupported schema由typed dispatch前的header ingress处理 | pass |
| application callable | 6 | `CapabilityInboundConsumerService`含6个exact method,无generic string dispatcher | pass |
| closed logical event | 6 | §9.6含6个schema-version-1 logical event name;未绑定physical topic / group | pass |
| independent protocol card | 6 | §9.8.1~§9.8.6逐事件闭合caller、schema、field source、effect、port、boundary | pass |
| unique Step 9 flow | 6 | 每张卡有唯一`inbound_consume_*_flow`,不以generic consumer flow替代 | pass |

#### 9.9.2 DTO to object / port construction audit

| protocol | construct / affect target | required field closure | Step 7 port closure | forbidden fallback |
|---|---|---|---|---|
| governance result changed | `GovernanceResultRef`;`ReferenceResolutionState` | target + kind + source + scope形成candidate / persisted digest;resolver提供state observation + allowed safe summary;IdGenerator / context / Clock补id / actor / trace / time | governance resolver、external-ref / state repositories、common UoW / replay ports | 不写seam / approval / Policy / exposure |
| method asset changed | `MethodAssetRef`;`ReferenceResolutionState` | target + asset kind + locator形成candidate / digest;resolver补observation | method resolver、external-ref / state、common ports | 不写relation / method body / source dependency |
| downstream impact reported | `DownstreamConsumptionImpactSummary` | exact impact + registered consumer + closed feedback variant + context source / actor / trace + generated id / time完整满足Step 6 factory | impact / external-ref repositories、common ports | 不改impact fact / exposure,不读取execution body |
| external source changed | `ExternalCapabilitySourceRef`;`ReferenceResolutionState` | target + source kind + locator形成candidate / digest;resolver补observation | source resolver、external-ref / state、common ports | 不建identity / descriptor,不执行MCP / A2A / API |
| audit material changed | `ObservabilityAuditRef`;`ReferenceResolutionState` | target + audit kind + locator形成candidate / digest;dedicated inbound resolver补observation | audit resolver、external-ref / state、common ports | 不调用audit handoff,不写trace / evidence |
| external document changed | `ExternalDocumentRef`;`ReferenceResolutionState` | target + document kind + locator形成candidate / digest;resolver补observation;supported descriptor固定preserve / None | document resolver、external-ref / state、common ports | 不绑定descriptor,不保存document body |

Construction closure findings:

- Step 6 reference digest symmetry gap is closed:all eight reference objects persist canonical`candidate_digest`;the five inbound reference consumers and existing Command register branches can use Step 7`find_by_candidate_digest`without adapter recomputation or locator scan。
- Step 6`ReferenceResolutionState::from_initial_resolution`covers resolver-derived initial values;existing refs use exact transition withloaded expected version.New / existing subject、kind、digest and state-id parity are validated before save。
- existing non-terminal state uses`transition(...)`whenvalue differs or thevalidated body-free reason differs;same value + same reason is strict no-op。Same-value reason re-observation forms one real state revision/capture;Invalid / Forbidden current candidates remain terminal and must use a new/replacement subject rather than in-place recovery。
- Step 6`DownstreamConsumptionImpactSummary::from_reported_state`coversPartial / Delayed / Unavailable / Ignored field combinations,and`from_consumer_feedback`uniquely coversReceived.No payload variant leaves a required object field to implementation guesswork。
- no accepted effect requires a missing repository / resolver method。`CapabilityConsumerReceiptEnvelope` + typed save/get close complete duplicate replay;`ObservabilityAuditReferencePort` closes inbound audit resolution without conflating outbound handoff。

#### 9.9.3 Receipt, idempotency, and state-surface audit

| audit item | conclusion | exact gate |
|---|---|---|
| public outcome coverage | pass | Accepted、DuplicateReplayed、Delayed、Ignored、Rejected、UnsupportedSchema、Quarantined all have result-ref / marker / effect rules;not represented bybool / bare id |
| no-op vs delayed | pass | no-change valid event=`Ignored + stored no-op`;processing dependency unavailable=`Delayed + no completed receipt`;downstream feedback state`Delayed`still yieldsAccepted when summary saved |
| duplicate replay | pass after Step 7 reopen | canonical key + stable digest -> typed original receipt;response-only replay marker;no resolver / write / current-state reconstruction |
| duplicate conflict | pass | original reservation / result immutable;quarantine exposes no original effect or body |
| unsupported schema | pass | header-first gate beforetyped decode / reserve / UoW;empty effects + no result ref |
| accepted effect refs | pass | stable duplicate-free ordering;only actual local revisions listed;worker cannot query repositories to supplement receipt |
| stored result symmetry | pass | fresh completed receipt + shell + serialized surface + typed envelope + idempotency completion share operation/result/surface refs and declared UoW |
| exact transaction ordering | deferred by Step boundary | same-UoW participants named;save / completion order remains Step 11,concurrency / retry algorithm remains Step 13 |

#### 9.9.4 Actor, body ownership, and non-scope audit

| audit item | conclusion | boundary |
|---|---|---|
| trusted source authority | pass | eachconsumer has one source family + configured integration/system actor binding;exception does not bypass schema、digest、source isolation、body scan、idempotency or state gate |
| governance seam | pass | only result ref / canonical state + follow-up marker;no approval、Policy、shared_rules、vote、workflow or automatic seam mutation |
| method-library relation | pass | onlyasset ref / canonical state;no method content、definition / version body、source code or automatic relation mutation |
| runtime / tools / SDK | pass | downstream payload isbody-free summary only;no invocation、tool result、authorization、cache、allowlist、client / package state or execution port |
| external source | pass | no MCP tool call、A2A message processing、API invocation、provider health / route / quota / cost / failover |
| audit / document | pass | no raw log / span / metric / alert / audit material、evidence alias、acceptance signature、OpenAPI / schema / guide body or descriptor mutation |
| marketplace | pass | no listing、pricing、transaction、ranking or fulfillment carrier / effect |
| local event durability | not triggered by inbound batch | batch `8.4`只保存typed consumer result;后续batch `8.5`已单独触发并闭合outbound immutable snapshot / capture回开,不改变Inbound protocol |

#### 9.9.5 Rustdoc and historical-material audit

| audit item | conclusion | evidence |
|---|---|---|
| public struct / enum comments | pass | allnew inbound structs / enums have English`///` Rustdoc |
| struct field comments | pass | everyfield,including tuple-newtype field,has English`///` Rustdoc |
| enum variant comments | pass | everyvariant and everytuple / struct variant payload field has English`///`;struct-variant fields do not useillegal`pub` |
| protocol secondary type ownership | pass | all inbound public carriers remain`contracts::event`;no domain / application-local helper is re-exported |
| old provider/runtime/query line | excluded | noProviderContract、CostRecord、QueryCapabilities、KMS/Vault、policy refresh、execution gateway or marketplace metadata entered§9 |

Inbound Event Consumer protocol family status is`completed_wait_user_review`。Batch `8.4` closes six payloads、six worker handlers、six application callables、six logical event mappings、six independent protocol cards and six unique Step 9 flows.No unresolved upstream blocker remains for outbound batch `8.5`。This stop-review does not enter§10,does not modify formal`03-详细设计.md`,does not create an implementation ledger / boundary skeleton,and does not fabricate implementation commit、run_id、test result、evidence alias or acceptance signature。

## 10. Outbound Event Protocol

Outbound Event是对accepted local source revision的body-free协议投影,不是runtime execution命令、governance approval、method-library body同步、marketplace listing或本仓自有delivery truth。每个event先在source-owning local UoW内形成完整public envelope并冻结到Step 6 snapshot / capture,source commit成功后才允许调用external collaboration seam。

架构“异步传播不阻塞core truth”在本Step解释为:external collaboration、transport availability和downstream delivery永远不参与source UoW,其失败不得回滚已提交truth。same-UoW snapshot / capture是accepted source transaction的本地完整性不变量,不是一次异步交互;如果本地source / snapshot / capture原子持久化失败,该operation尚未形成“已提交truth”,按local transaction failure返回。只有commit后的stored capture才是可协作candidate,因此仍满足概要“从已提交事实传播”的边界。

### 10.1 Outbound定义批次、来源裁决与历史冲突

| Event | source-owning module | exact source | declared logical subscribers | Step 7 dependencies | Step 9 flow |
|---|---|---|---|---|---|
| `CapabilityIdentityChanged` | identity service | `CapabilityChangeRecordRef::Identity` | registry、descriptor、relation、exposure、trace / impact、derived maintenance | event-capture repository、Clock / IdGenerator已由source flow提供、external collaboration | `outbound_capability_identity_changed_capture_and_collaborate_flow` |
| `CapabilityRegistryChanged` | registry service | `CapabilityChangeRecordRef::Registry` | descriptor、exposure、trace / impact、derived maintenance、downstream consumer boundary | same | `outbound_capability_registry_changed_capture_and_collaborate_flow` |
| `AdapterDescriptorChanged` | descriptor service | `CapabilityChangeRecordRef::Descriptor` | exposure、controlled-view refresh、trace / impact、derived maintenance | same | `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` |
| `GovernanceSeamRelationChanged` | relation service | `CapabilityChangeRecordRef::GovernanceSeam` | exposure、trace / impact、derived maintenance、downstream consumer boundary | same | `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` |
| `CapabilityMethodRelationChanged` | relation service | `CapabilityChangeRecordRef::MethodRelation` | method-library relation observer、exposure、trace / impact、controlled-view refresh | same | `outbound_capability_method_relation_changed_capture_and_collaborate_flow` |
| `FormalExposureBoundaryChanged` | exposure service | `CapabilityChangeRecordRef::Exposure` | runtime / tools / SDK server boundary、trace / impact、derived maintenance | same | `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` |
| `ControlledConsumerViewAvailabilityChanged` | derived / controlled-view service | exact `DerivedMaterialRef::ControlledConsumerView + Version` | runtime / tools / SDK server boundary、console、observability candidate boundary | same | `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` |
| `CapabilityChangeImpactIdentified` | trace / impact service | exact `CapabilityChangeImpactFactRef` | declared downstream consumers、observability candidate boundary、derived maintenance | same | `outbound_capability_change_impact_identified_capture_and_collaborate_flow` |
| `DerivedMaterialRefreshed` | derived-material service | exact directory / audit-export / ecosystem / reconciliation revision | query consumers、observability candidate boundary | same | `outbound_derived_material_refreshed_capture_and_collaborate_flow` |
| `ReferenceResolutionChanged` | reference service / consumer / job | exact `ReferenceResolutionStateRef` | capability core services、trace / impact、derived maintenance | same | `outbound_reference_resolution_changed_capture_and_collaborate_flow` |

Source裁决:

- 前六个event的capture source必须分别是六个closed `CapabilityChangeRecordRef` variant。accepted truth object只补充payload所需exact versioned ref,不能替代append-only record成为capture source。
- `CapabilityRegistryChanged`只能来自已构造并将在同一UoW append的`RegistryChangeRecord`。正式`02`事件表中的“registry Command / reconciliation result”shorthand与同文档的reconciliation no-truth-repair规则存在歧义;本Step按后者和Step 6 object contract收口:reconciliation result只能形成`DerivedMaterialRefreshed`的reconciliation-report variant,report不得伪造registry change、调用registry mutation或生成Registry change record。该歧义已在当前协议source gate关闭,不构成后续blocker。
- `ControlledConsumerViewAvailabilityChanged`只来自exact controlled-view revision。`DerivedMaterialRefreshed`明确排除`DerivedMaterialRef::ControlledConsumerView`,避免同一view revision被两个event family重复表达。
- `CapabilityChangeImpactIdentified`只接受`CapabilityImpactState::Identified`的exact impact revision。后续partial / delayed / ignored / resolved revision不得继续冒充“identified”;如未来需要impact-state-changed事件,必须回开HLD inventory。
- `DerivedMaterialRefreshed`只覆盖`DirectoryProjection`、`AuditExport`、`EcosystemDiscovery`和`ReconciliationReport`四类exact revision。
- `ReferenceResolutionChanged`只来自canonical `ReferenceResolutionState` exact revision,不从external ref locator、resolver response或current owner truth拼装。
- 当前10个event没有直接映射`CapabilityEventCaptureSourceRef::Traceability`;不得从source union存在该variant推导新的Traceability event。
- `02_hld_step_07_api_interface_skeleton.md`曾使用“controlled view safe summary ref”措辞,但正式`02`只要求传播view freshness,Step 6也没有独立safe-summary ref owner。当前payload采用exact view ref + consumer / source-version / freshness surface,不伪造summary ref;这是一项已裁剪的historical refinement,不是blocker。

### 10.2 Typed outbound payload schema

以下类型归`contracts::event`。每个payload只包含public typed ref、closed state、safe marker或body-free source-version set;不得直接依赖application capture record、repository helper、external intent或transport metadata。

```rust
/// Body-free event payload for one accepted capability identity change.
pub struct CapabilityIdentityChangedPayload {
    /// Exact accepted capability identity revision after the change.
    pub identity_ref: CapabilityIdentityRef,
    /// Closed identity change classification copied from the source record.
    pub change_kind: CapabilityIdentityChangeKind,
    /// Capability identity state after the accepted change.
    pub next_state: CapabilityIdentityState,
}

/// Body-free event payload for one accepted capability registry change.
pub struct CapabilityRegistryChangedPayload {
    /// Exact accepted registry entry revision after the change.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Stable capability identity owned by the registry entry.
    pub capability_identity_id: CapabilityIdentityId,
    /// Closed registry change classification copied from the source record.
    pub change_kind: RegistryChangeKind,
    /// Registry lifecycle state after the accepted change.
    pub next_lifecycle_state: RegistryLifecycleState,
}

/// Body-free event payload for one accepted adapter descriptor change.
pub struct AdapterDescriptorChangedPayload {
    /// Exact accepted adapter descriptor revision after the change.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Registry entry that owns the changed descriptor.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Closed descriptor change classification copied from the source record.
    pub change_kind: DescriptorChangeKind,
    /// Adapter descriptor state after the accepted change.
    pub next_descriptor_state: AdapterDescriptorState,
    /// Sensitive-boundary classification copied without sensitive material.
    pub boundary_marker: SensitiveBoundaryMarker,
}

/// Body-free event payload for one accepted governance seam relation change.
pub struct GovernanceSeamRelationChangedPayload {
    /// Exact accepted governance seam relation revision after the change.
    pub governance_seam_ref: GovernanceSeamRelationRef,
    /// Stable capability identity related through the seam.
    pub capability_identity_id: CapabilityIdentityId,
    /// Closed governance seam change classification copied from the source record.
    pub change_kind: GovernanceSeamChangeKind,
    /// Governance seam state after the accepted change.
    pub next_seam_state: GovernanceSeamState,
}

/// Body-free event payload for one accepted capability-method relation change.
pub struct CapabilityMethodRelationChangedPayload {
    /// Exact accepted capability-method relation revision after the change.
    pub method_relation_ref: CapabilityMethodRelationRef,
    /// Body-free method asset reference attached at change time.
    pub method_asset_ref_id: MethodAssetRefId,
    /// Closed method relation change classification copied from the source record.
    pub change_kind: MethodRelationChangeKind,
    /// Capability-method relation state after the accepted change.
    pub next_relation_state: CapabilityMethodRelationState,
}

/// Body-free event payload for one accepted formal exposure boundary change.
pub struct FormalExposureBoundaryChangedPayload {
    /// Exact accepted formal exposure revision after the change.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Registry entry whose formal exposure changed.
    pub registry_entry_id: CapabilityRegistryEntryId,
    /// Closed exposure change classification copied from the source record.
    pub change_kind: ExposureChangeKind,
    /// Formal exposure state after the accepted change.
    pub next_exposure_state: FormalExposureState,
    /// Deterministic hint that controlled consumer views require refresh.
    pub consumer_view_refresh_required: bool,
}

/// Body-free event payload for one controlled consumer-view availability revision.
pub struct ControlledConsumerViewAvailabilityChangedPayload {
    /// Exact controlled consumer-view revision whose availability changed.
    pub consumer_view_ref: ControlledConsumerViewRef,
    /// Formal exposure represented by the controlled view.
    pub formal_exposure_id: FormalExposureBoundaryId,
    /// Registered downstream consumer boundary that owns the view.
    pub consumer_ref: CapabilityConsumerRef,
    /// Current controlled-view freshness and availability state.
    pub freshness_state: ConsumerViewFreshnessState,
    /// Exact source-version markers used by this controlled-view revision.
    pub source_versions: ConsumerViewSourceVersionSet,
}

/// Body-free event payload for one newly identified capability change impact.
pub struct CapabilityChangeImpactIdentifiedPayload {
    /// Exact identified impact-fact revision.
    pub impact_fact_ref: CapabilityChangeImpactFactRef,
    /// Exact traceability revision from which the impact was derived.
    pub traceability_record_ref: CapabilityAccessTraceabilityRecordRef,
    /// Capability access truth subject affected by the source change.
    pub change_subject: CapabilityTraceSubjectRef,
    /// Body-free scope of the identified impact.
    pub impact_scope: CapabilityImpactScope,
    /// Non-empty downstream consumer boundaries affected by the impact.
    pub affected_consumers: CapabilityConsumerRefSet,
}

/// Closed availability surface for material revisions emitted as DerivedMaterialRefreshed.
pub enum CapabilityDerivedMaterialAvailability {
    /// Directory search and browse projection availability.
    DirectoryProjection {
        /// Current exact projection freshness state.
        state: DirectoryProjectionState,
    },
    /// Audit-friendly export summary availability.
    AuditExport {
        /// Current exact audit-export state.
        state: AuditExportState,
    },
    /// Read-only ecosystem discovery summary availability.
    EcosystemDiscovery {
        /// Current exact ecosystem-discovery state.
        state: EcosystemDiscoveryState,
    },
    /// Capability reconciliation report outcome.
    ReconciliationReport {
        /// Immutable reconciliation-report outcome state.
        state: ReconciliationReportState,
    },
}

/// Body-free event payload for one accepted derived-material revision.
pub struct DerivedMaterialRefreshedPayload {
    /// Stable derived-material identity covered by this event family.
    pub material_ref: DerivedMaterialRef,
    /// Exact accepted version of the derived material.
    pub material_version: Version,
    /// Material-kind-specific freshness or outcome surface.
    pub availability: CapabilityDerivedMaterialAvailability,
    /// Exact source-version markers represented by this material revision.
    pub source_versions: DerivedMaterialSourceVersionSet,
}

/// Body-free event payload for one canonical reference-resolution revision.
pub struct ReferenceResolutionChangedPayload {
    /// Exact canonical reference-resolution revision.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Body-free external reference subject owned by the canonical state.
    pub reference_subject: ReferenceSubjectRef,
    /// Closed reference category matching the subject variant.
    pub reference_kind: ReferenceKind,
    /// Canonical resolution value after the accepted transition.
    pub resolution_value: ReferenceResolutionValue,
}
```

Payload field construction:

| Payload | field source | required symmetry | forbidden material |
|---|---|---|---|
| `CapabilityIdentityChangedPayload` | final persisted identity id/version + event-eligible identity change record kind/next state | `record.explains_identity(identity)`;record next state equals final persisted identity state;ref version equals final accepted identity version；transaction-local intermediate change只进入trace | source body、review body、correction evidence body |
| `CapabilityRegistryChangedPayload` | accepted entry id/version/identity id + registry record kind/next state | `record.explains_entry(entry)` | allowlist、runtime state、marketplace listing、reconciliation finding |
| `AdapterDescriptorChangedPayload` | accepted descriptor id/version/entry id + descriptor record kind/next state/marker | `record.explains_descriptor(descriptor)` | provider runtime、API schema body、secret、external document body |
| `GovernanceSeamRelationChangedPayload` | accepted relation id/version/identity id + seam record kind/next state | `record.explains_relation(relation)` | approval、Policy、shared_rules、workflow body |
| `CapabilityMethodRelationChangedPayload` | accepted relation id/version + record method ref/kind/next state | `record.explains_relation(relation)`;method ref id equals relation endpoint | method content、definition、version body、source code |
| `FormalExposureBoundaryChangedPayload` | accepted exposure id/version/entry id + exposure record kind/next state + `requires_consumer_view_refresh()` | `record.explains_exposure(exposure)` | runtime authorization、tool result、SDK client state、consumer cache |
| `ControlledConsumerViewAvailabilityChangedPayload` | exact view id/version/exposure/consumer/freshness/source versions | capture source material id/version equals payload ref;view audience is unchanged | provider runtime、secret body、invocation payload、inline descriptor body |
| `CapabilityChangeImpactIdentifiedPayload` | exact impact revision fields | state must be`Identified`;impact ref version equals fact version;trace subject symmetry | downstream execution / tool result、cost、runtime decision |
| `DerivedMaterialRefreshedPayload` | exact directory/export/discovery/report object | material ref kind,version,availability variant and source-version set must all match one object | projection index body、raw audit、listing、row diff、evidence alias |
| `ReferenceResolutionChangedPayload` | exact canonical resolution state | state ref version、subject-kind pair and value equal persisted revision | locator body、resolver response、external owner body、secret material |

### 10.3 Logical event, schema and routing map

| event name | schema version | application schema ref | logical routing key | payload |
|---|---:|---|---|---|
| `CapabilityIdentityChanged` | `1` | `capability-hub.outbound/CapabilityIdentityChanged@1` | `capability-hub.identity.changed.v1` | `CapabilityIdentityChangedPayload` |
| `CapabilityRegistryChanged` | `1` | `capability-hub.outbound/CapabilityRegistryChanged@1` | `capability-hub.registry.changed.v1` | `CapabilityRegistryChangedPayload` |
| `AdapterDescriptorChanged` | `1` | `capability-hub.outbound/AdapterDescriptorChanged@1` | `capability-hub.adapter-descriptor.changed.v1` | `AdapterDescriptorChangedPayload` |
| `GovernanceSeamRelationChanged` | `1` | `capability-hub.outbound/GovernanceSeamRelationChanged@1` | `capability-hub.governance-seam-relation.changed.v1` | `GovernanceSeamRelationChangedPayload` |
| `CapabilityMethodRelationChanged` | `1` | `capability-hub.outbound/CapabilityMethodRelationChanged@1` | `capability-hub.capability-method-relation.changed.v1` | `CapabilityMethodRelationChangedPayload` |
| `FormalExposureBoundaryChanged` | `1` | `capability-hub.outbound/FormalExposureBoundaryChanged@1` | `capability-hub.formal-exposure-boundary.changed.v1` | `FormalExposureBoundaryChangedPayload` |
| `ControlledConsumerViewAvailabilityChanged` | `1` | `capability-hub.outbound/ControlledConsumerViewAvailabilityChanged@1` | `capability-hub.controlled-consumer-view.availability-changed.v1` | `ControlledConsumerViewAvailabilityChangedPayload` |
| `CapabilityChangeImpactIdentified` | `1` | `capability-hub.outbound/CapabilityChangeImpactIdentified@1` | `capability-hub.capability-change-impact.identified.v1` | `CapabilityChangeImpactIdentifiedPayload` |
| `DerivedMaterialRefreshed` | `1` | `capability-hub.outbound/DerivedMaterialRefreshed@1` | `capability-hub.derived-material.refreshed.v1` | `DerivedMaterialRefreshedPayload` |
| `ReferenceResolutionChanged` | `1` | `capability-hub.outbound/ReferenceResolutionChanged@1` | `capability-hub.reference-resolution.changed.v1` | `ReferenceResolutionChangedPayload` |

Map rules:

- `CapabilityOutboundEventName`必须等于inventory中的PascalCase name;`CapabilityProtocolSchemaVersion(1)`单独承载schema version。schema ref按表中literal构造,不得使用routing key、physical topic或adapter code代替。
- routing key是public logical classification,必须逐event固定且包含`.v1`;Step 14只能把它映射到physical transport binding,不能改名或把多个payload schema压成一个untyped topic body。
- v1 serialized envelope必须完整包含§6.7的`event_name`、`schema_version`、tagged `source_ref`、`occurred_at`、`trace_id`、`routing_key`和concrete payload。capture id、snapshot id、external intent、delivery status不进入public bytes。
- Rust enum variant / field name是v1 closed wire vocabulary;Step 13已固定candidate digest canonical field/domain/algorithm,Step 14只绑定具体hash / protocol codec crate；不得丢字段、改source variant、把typed ref降级成裸字符串或只序列化payload body。

### 10.4 Pure mapper and same-UoW capture callable

`CapabilityEventCandidateMapper`归`domain::event_candidate`;其实现必须stateless,只执行source symmetry validation和typed public envelope formation,不访问repository、clock、id generator、external port或transport。`CapabilityDerivedMaterialRefreshSource`是本次调用期borrowed union,不持久化也不进入public protocol。该trait是pure domain callable,不是application-to-infra port。

```rust
/// Borrowed exact derived-material source accepted by DerivedMaterialRefreshed.
pub enum CapabilityDerivedMaterialRefreshSource<'a> {
    /// Exact directory search and browse projection revision.
    DirectoryProjection(
        /// Accepted projection object mapped before its local transaction commits.
        &'a DirectorySearchBrowseProjection,
    ),
    /// Exact audit-friendly export summary revision.
    AuditExport(
        /// Accepted audit-export object mapped before its local transaction commits.
        &'a AuditFriendlyExportSummary,
    ),
    /// Exact read-only ecosystem discovery summary revision.
    EcosystemDiscovery(
        /// Accepted ecosystem-discovery object mapped before its local transaction commits.
        &'a ReadOnlyEcosystemDiscoverySummary,
    ),
    /// Exact immutable capability reconciliation report.
    ReconciliationReport(
        /// Accepted reconciliation report mapped before its local transaction commits.
        &'a CapabilityReconciliationReport,
    ),
}

/// Pure domain mapping surface for closed capability-hub outbound event envelopes.
pub trait CapabilityEventCandidateMapper: Send + Sync {
    /// Maps one identity change record and matching accepted identity revision.
    fn map_capability_identity_changed(
        &self,
        record: &CapabilityIdentityChangeRecord,
        identity: &CapabilityIdentity,
    ) -> Result<CapabilityOutboundEventEnvelope<CapabilityIdentityChangedPayload>, DomainError>;

    /// Maps one registry change record and matching accepted registry revision.
    fn map_capability_registry_changed(
        &self,
        record: &RegistryChangeRecord,
        entry: &CapabilityRegistryEntry,
    ) -> Result<CapabilityOutboundEventEnvelope<CapabilityRegistryChangedPayload>, DomainError>;

    /// Maps one descriptor change record and matching accepted descriptor revision.
    fn map_adapter_descriptor_changed(
        &self,
        record: &DescriptorChangeRecord,
        descriptor: &AdapterDescriptor,
    ) -> Result<CapabilityOutboundEventEnvelope<AdapterDescriptorChangedPayload>, DomainError>;

    /// Maps one governance seam change record and matching accepted relation revision.
    fn map_governance_seam_relation_changed(
        &self,
        record: &GovernanceSeamChangeRecord,
        relation: &GovernanceSeamRelation,
    ) -> Result<CapabilityOutboundEventEnvelope<GovernanceSeamRelationChangedPayload>, DomainError>;

    /// Maps one method relation change record and matching accepted relation revision.
    fn map_capability_method_relation_changed(
        &self,
        record: &MethodRelationChangeRecord,
        relation: &CapabilityMethodBodyFreeRelation,
    ) -> Result<CapabilityOutboundEventEnvelope<CapabilityMethodRelationChangedPayload>, DomainError>;

    /// Maps one exposure change record and matching accepted exposure revision.
    fn map_formal_exposure_boundary_changed(
        &self,
        record: &CapabilityExposureChangeRecord,
        exposure: &FormalExposureBoundary,
    ) -> Result<CapabilityOutboundEventEnvelope<FormalExposureBoundaryChangedPayload>, DomainError>;

    /// Maps one exact controlled consumer-view revision with its accepted operation trace.
    fn map_controlled_consumer_view_availability_changed(
        &self,
        view: &ControlledConsumerView,
        trace_id: TraceId,
    ) -> Result<CapabilityOutboundEventEnvelope<ControlledConsumerViewAvailabilityChangedPayload>, DomainError>;

    /// Maps one exact newly identified capability impact revision.
    fn map_capability_change_impact_identified(
        &self,
        impact: &CapabilityChangeImpactFact,
    ) -> Result<CapabilityOutboundEventEnvelope<CapabilityChangeImpactIdentifiedPayload>, DomainError>;

    /// Maps one supported exact derived-material revision with its accepted operation trace.
    fn map_derived_material_refreshed(
        &self,
        source: CapabilityDerivedMaterialRefreshSource<'_>,
        trace_id: TraceId,
    ) -> Result<CapabilityOutboundEventEnvelope<DerivedMaterialRefreshedPayload>, DomainError>;

    /// Maps one exact canonical reference-resolution revision.
    fn map_reference_resolution_changed(
        &self,
        state: &ReferenceResolutionState,
    ) -> Result<CapabilityOutboundEventEnvelope<ReferenceResolutionChangedPayload>, DomainError>;
}
```

`CapabilityOutboundEventCaptureService`归`application::services`;source-owning services在自己的current local UoW内调用。每个method必须调用同名pure mapper,完整序列化envelope,构造schema ref / digest / snapshot / capture并调用Step 7 capture repository。该trait是application service callable,不是infra port,不计入Step 7的35个Port。

```rust
/// Application surface that maps and durably captures closed outbound event envelopes.
#[async_trait::async_trait]
pub trait CapabilityOutboundEventCaptureService: Send + Sync {
    /// Maps and captures one identity-changed envelope in the source transaction.
    async fn capture_capability_identity_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &CapabilityIdentityChangeRecord,
        identity: &CapabilityIdentity,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one registry-changed envelope in the source transaction.
    async fn capture_capability_registry_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &RegistryChangeRecord,
        entry: &CapabilityRegistryEntry,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one adapter-descriptor-changed envelope in the source transaction.
    async fn capture_adapter_descriptor_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &DescriptorChangeRecord,
        descriptor: &AdapterDescriptor,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one governance-seam-relation-changed envelope in the source transaction.
    async fn capture_governance_seam_relation_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &GovernanceSeamChangeRecord,
        relation: &GovernanceSeamRelation,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one capability-method-relation-changed envelope in the source transaction.
    async fn capture_capability_method_relation_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &MethodRelationChangeRecord,
        relation: &CapabilityMethodBodyFreeRelation,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one formal-exposure-boundary-changed envelope in the source transaction.
    async fn capture_formal_exposure_boundary_changed(
        &self,
        context: &CapabilityOperationContext,
        record: &CapabilityExposureChangeRecord,
        exposure: &FormalExposureBoundary,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one controlled-view-availability envelope in the view transaction.
    async fn capture_controlled_consumer_view_availability_changed(
        &self,
        context: &CapabilityOperationContext,
        view: &ControlledConsumerView,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one newly identified impact envelope in the impact transaction.
    async fn capture_capability_change_impact_identified(
        &self,
        context: &CapabilityOperationContext,
        impact: &CapabilityChangeImpactFact,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one supported derived-material-refreshed envelope in the material transaction.
    async fn capture_derived_material_refreshed(
        &self,
        context: &CapabilityOperationContext,
        source: CapabilityDerivedMaterialRefreshSource<'_>,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;

    /// Maps and captures one reference-resolution-changed envelope in the state transaction.
    async fn capture_reference_resolution_changed(
        &self,
        context: &CapabilityOperationContext,
        state: &ReferenceResolutionState,
        uow: &dyn CapabilityUnitOfWork,
    ) -> Result<CapabilityEventCaptureRef, ApplicationError>;
}
```

`CapabilityEventCollaborationService`归`application::services`,是Step 5 / 7已声明internal event-collaboration facade的exact callable。它不是新的Outbound protocol、infra Port或worker repository handle。Source-owning service只在source UoW commit后传入该次返回的exact capture ref；`worker::event_publisher`也只能把exact capture ref交给该service,不得直接读取capture repository或调用publisher adapter。

```rust
/// Application facade for collaborating one already committed outbound event capture.
#[async_trait::async_trait]
pub trait CapabilityEventCollaborationService: Send + Sync {
    /// Loads one official capture, collaborates its immutable envelope, and binds the stable intent.
    async fn collaborate_captured_event(
        &self,
        capture_ref: CapabilityEventCaptureRef,
    ) -> Result<CapabilityEventCollaborationOutcome, ApplicationError>;
}
```

Callable contract:

1. `capture_ref`必须是source transaction返回的exact ref或application-owned AwaitingIntent scan返回的exact ref。Service先调用`CapabilityEventCaptureRepository::get_with_snapshot`,校验input id/version、loaded expected version、capture / snapshot source、snapshot id、schema、digest、captured time五元组对称,并校验snapshot-owned complete bytes non-empty及recomputed digest匹配。Snapshot的typed `trace_id`原样复制到candidate,不与capture字段比较。Capture没有`trace_id / bytes`字段；missing/asymmetry不得回查source truth或重跑mapper。
2. `Captured + intent=None`才构造`CapabilityEventCollaborationCandidateSurface::try_from_stored_capture`并调用`CapabilityAccessEventCollaborationPort::collaborate`。若loaded capture已`IntentBound`,service调用`bound_intent_ref()`与Port `get`,要求item intent、item/outcome source与capture source一致后直接返回existing outcome；不得再次collaborate或bind。Missing external item是consistency error,repair仍只走existing intent的`repair` surface。
3. Outcome必须带Step 7 exact source且`outcome.source`等于candidate、capture和snapshot source。Source mismatch、opaque intent parse或无typed outcome均返回`ApplicationError`,capture保持`Captured`。
4. Source对称后,service调用`ClockPort::now`,在内存执行`capture.bind_intent(outcome.intent_ref, now)`,再开启一个独立短UoW,使用loaded capture的`expected_version`调用repository `bind_intent`并commit。Bind/commit失败rollback短UoW,source/snapshot不变且原capture继续`Captured`可扫描。
5. 返回的typed outcome只描述external intent/status,不改source-owning Command / Consumer / Job已存result。`Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable`都可绑定同一stable intent；Failed / HandoffUnavailable reason由external owner提供,不写入local capture。
6. exact duplicate/collision、同intent no-op和并发bind算法留Step 13；当前 callable已固定official read、single collaborate、source validation、short-UoW bind和no-current-truth-rebuild顺序。

Continuation ownership clarification:

- source-owning application service若选择commit后立即协作,必须把每次`capture_*`返回的exact ref保留在operation-local stable-order vector中,仅在source UoW commit成功后逐项调用`collaborate_captured_event`。该vector不是public response field、persisted helper、queue或delivery truth；commit失败时不得调用facade。
- source-owning Command / Consumer / Job的stored result只记录已形成的logical event name / declared effect,不保存capture ref或collaboration outcome,也不因post-commit facade失败改写accepted result。此前Step 9 source-flow伪代码中未绑定`capture_*`返回值的位置只表达same-UoW capture片段,不表示允许从current truth重建ref。
- 未选择immediate continuation或commit后进程中断时,只能由后续`RepairCapabilityAccessEventCollaboration` application Job通过`CapabilityEventCaptureRepository::list(AwaitingIntent)`取得exact refs。`worker::event_publisher`若被注入一个已由application选定的exact ref,只能转交本facade；worker不得自行scan repository、调用publisher adapter或持有隐藏queue。

Capture callable common contract:

1. Validate `context.trace_id` equals the record / impact / reconciliation / reference source trace when that source persists a trace. Controlled view、directory、audit export和ecosystem material没有独立trace field,必须复制current accepted job / command context trace;不得生成新trace。
2. Invoke the exact pure mapper and reject any subject、state、version、kind、method-asset、source-ref or trace asymmetry before persistence.
3. Serialize the complete typed `CapabilityOutboundEventEnvelope<T>` once. Create the table-fixed `CapabilityEventSchemaRef`,then compute `CapabilityEventCandidateDigest` from exactly those bytes.
4. Generate one payload snapshot id and one capture id through`IdGeneratorPort`;call`CapabilityEventPayloadSnapshot::freeze`with the technical source ref、schema、digest、bytes、trace and envelope `occurred_at`.
5. Call`CapabilityEventCaptureRecord::capture`,then`CapabilityEventCaptureRepository::capture(snapshot, capture, uow)`. Return the resulting version-1 capture ref only after repository acceptance.
6. The same UoW also saves/appends the exact source object. Source、snapshot或capture任一失败 must roll back all three;the capture method must not open or commit its own nested transaction.
7. The method does not call`CapabilityAccessEventCollaborationPort`. Post-commit collaboration is a separate Step 9 phase and receives only a loaded official capture / snapshot.
8. Local capture persistence is part of source-transaction completeness,not a downstream delivery attempt. External adapter availability、publisher status and subscriber outcome must never be checked before source commit.

### 10.5 Exact source, occurrence time and technical capture mapping

| Event | `CapabilityEventCaptureSourceRef` | `occurred_at` | `trace_id` | additional mapper gate |
|---|---|---|---|---|
| `CapabilityIdentityChanged` | `Change(Identity(record.change_record_id))` | `record.recorded_at` | `record.trace_id == context.trace_id` | final persisted identity id / state / versioned ref symmetry；intermediate `CorrectionRequested -> CorrectionPending` against final Active identity is ineligible |
| `CapabilityRegistryChanged` | `Change(Registry(record.registry_change_record_id))` | `record.recorded_at` | record/context equal | accepted entry id / lifecycle symmetry;report source rejected |
| `AdapterDescriptorChanged` | `Change(Descriptor(record.descriptor_change_record_id))` | `record.recorded_at` | record/context equal | accepted descriptor id / state / marker symmetry |
| `GovernanceSeamRelationChanged` | `Change(GovernanceSeam(record.seam_change_record_id))` | `record.recorded_at` | record/context equal | accepted relation id / state symmetry |
| `CapabilityMethodRelationChanged` | `Change(MethodRelation(record.method_relation_change_record_id))` | `record.recorded_at` | record/context equal | accepted relation id / method ref / state symmetry |
| `FormalExposureBoundaryChanged` | `Change(Exposure(record.exposure_change_record_id))` | `record.recorded_at` | record/context equal | accepted exposure id / state symmetry;`ConsumerViewMarkedStale` rejected;refresh hint only from record helper |
| `ControlledConsumerViewAvailabilityChanged` | `DerivedMaterial { material_ref: ControlledConsumerView(view.consumer_view_id), version: view.version }` | `view.refreshed_at` | current context trace | exact view ref / audience / source versions;not eligible for`DerivedMaterialRefreshed` |
| `CapabilityChangeImpactIdentified` | `Impact(VersionedRef(impact.impact_fact_id, impact.version))` | `impact.updated_at` | `impact.trace_id == context.trace_id` | state exactly`Identified`;non-empty consumers |
| `DerivedMaterialRefreshed` | `DerivedMaterial { material_ref, version }` for four allowed variants | object `refreshed_at` or report `generated_at` | context trace;report trace must equal context | kind/ref/version/availability/source-version symmetry;controlled-view variant rejected |
| `ReferenceResolutionChanged` | `ReferenceResolution(VersionedRef(state.resolution_state_id, state.version))` | `state.last_checked_at` | `state.trace_id == context.trace_id` | subject-kind pair valid;payload value equals state revision |

Snapshot / capture symmetry:

| axis | mandatory equality |
|---|---|
| source | public envelope source maps 1:1 to technical capture source;snapshot source equals capture source |
| schema | event name + version selects exactly one §10.3 schema ref;snapshot and capture store the same ref |
| bytes / digest | snapshot stores the complete serialized envelope;digest is calculated once from those exact non-empty bytes and copied to capture |
| trace / time | envelope trace equals snapshot trace;capture `captured_at` equals snapshot `captured_at`,which uses accepted source occurrence time rather than delivery time |
| local lifecycle | initial record is `Captured + collaboration_intent_ref=None + version=1`;only post-commit stable-intent binding may produce`IntentBound` |
| uniqueness | `(source_ref,schema_ref)` is the only capture uniqueness key;event name aliases、routing key、trace、job run or transport destination cannot create another logical capture |

### 10.6 Failure, collaboration and recovery surface

| stage | failure / outcome | local effect | required handling |
|---|---|---|---|
| source / payload symmetry | record/object mismatch、wrong state、wrong material kind、trace mismatch | none committed | return typed`DomainError` / `ApplicationError`;rollback source UoW;do not serialize |
| schema / serialization / digest | unsupported schema、empty / incomplete envelope bytes、digest construction failure | none committed | rollback source UoW;do not fall back to payload-only bytes or adapter serializer |
| snapshot / initial capture | id failure、snapshot invariant failure、capture repository failure / collision | none committed | rollback source UoW;do not commit source and repair later |
| local commit | transaction commit fails | source / snapshot / capture all invisible | surface transaction error;external collaboration must not run |
| post-commit capture load | capture / snapshot missing、五元组不对称或snapshot bytes empty / digest mismatch | committed source remains;external intent not formed | explicit consistency failure;never query current truth or rerun mapper;typed snapshot trace iscopied,not re-derived |
| external collaboration | `Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable` typed outcome | source and snapshot unchanged | no local truth rollback;failed / unavailable reason remains external outcome owner |
| stable intent bind | external stable intent returned but local bind fails | capture remains `Captured` and scan-visible | retry using the same stored bytes;adapter must return the same intent for duplicate candidate identity |
| duplicate / reentry | completed source operation or repair repeats | no second event mapping or source mutation | command / consumer / job duplicate replays stored result;repair loads existing capture;exact collision algorithm closes inStep 13 |

Post-commit collaboration sequence is the exact implementation contract of`CapabilityEventCollaborationService::collaborate_captured_event`:

```text
source UoW committed with source + snapshot + Captured record
  -> source-owning service / worker passes exact capture_ref to application facade
  -> load CapabilityEventCaptureRepository.get_with_snapshot(capture_ref)
  -> Captured:
       -> CapabilityEventCollaborationCandidateSurface::try_from_stored_capture(loaded)
       -> CapabilityAccessEventCollaborationPort.collaborate(candidate)
       -> validate outcome.source == candidate/capture/snapshot source
       -> ClockPort.now + CapabilityEventCaptureRecord.bind_intent(intent_ref, now)
       -> begin short local UoW
       -> CapabilityEventCaptureRepository.bind_intent(record, expected_version, uow)
       -> commit short local UoW
  -> IntentBound:
       -> capture.bound_intent_ref()
       -> CapabilityAccessEventCollaborationPort.get(existing intent)
       -> validate item/outcome/intent/source symmetry
       -> return existing outcome;do not collaborate or bind again
```

The sequence does not specify a broker、topic、relay、attempt record、retry count、schedule or delivery SLA。External status remains owned by`CapabilityAccessEventCollaborationPort`;local capture only proves which immutable bytes were committed and which stable intent was bound。

### 10.7 Independent outbound protocol cards

#### 10.7.1 `CapabilityIdentityChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces one accepted identity revision to registry、descriptor、relation、exposure、trace / impact and derived-maintenance collaborators;does not export source or review body |
| logical event / routing | `CapabilityIdentityChanged`;schema`1`;`capability-hub.identity.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_capability_identity_changed(&CapabilityIdentityChangeRecord, &CapabilityIdentity)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_capability_identity_changed(&CapabilityOperationContext, &CapabilityIdentityChangeRecord, &CapabilityIdentity, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 envelope + §10.2 `CapabilityIdentityChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(Identity(...))`;record kind / next state + final persisted identity id/version;`record.explains_identity(identity)`required。A multi-change transaction may trace every ordered record,但只event-eligible records whose next state matches the one persisted identity revision may call this mapper |
| Step 7 ports | source flow identity/change repositories + event-capture repository;post-commit collaboration port only throughapplication facade |
| error / recovery | source mismatch or capture failure rolls backidentity transaction;post-commit failure leavestruth andcapture durable |
| idempotency / audit | onecapture per(source,schema);trace/time copied fromrecord。Establish context may capture both`Created`and`ReviewFactAttached`because both explain final state;Correct identity captures only terminal`Corrected / Merged / Split`,not intermediate`CorrectionRequested`;duplicate command replaysstored result and does not form another capture |
| Step 9 flow | `outbound_capability_identity_changed_capture_and_collaborate_flow` |

#### 10.7.2 `CapabilityRegistryChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces accepted registry lifecycle surface to descriptor、exposure、impact、derived and declared downstream boundaries;does not publish allowlist / runtime / marketplace state |
| logical event / routing | `CapabilityRegistryChanged`;schema`1`;`capability-hub.registry.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_capability_registry_changed(&RegistryChangeRecord, &CapabilityRegistryEntry)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_capability_registry_changed(&CapabilityOperationContext, &RegistryChangeRecord, &CapabilityRegistryEntry, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `CapabilityRegistryChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(Registry(...))`;accepted entry ref / identity + record kind / next lifecycle;`record.explains_entry(entry)`required |
| Step 7 ports | registry/change repositories + event-capture repository;external collaboration after commit |
| error / recovery | reconciliation report、finding or projection cannot be input;capture failure rolls back registry write;post-commit failure does not change lifecycle |
| idempotency / audit | exact registry record is audit source;onecapture per source/schema;no reconciliation-generated synthetic record |
| Step 9 flow | `outbound_capability_registry_changed_capture_and_collaborate_flow` |

#### 10.7.3 `AdapterDescriptorChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces accepted descriptor state / boundary marker to exposure、view refresh、trace / impact and derived-maintenance collaborators without provider or secret body |
| logical event / routing | `AdapterDescriptorChanged`;schema`1`;`capability-hub.adapter-descriptor.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_adapter_descriptor_changed(&DescriptorChangeRecord, &AdapterDescriptor)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_adapter_descriptor_changed(&CapabilityOperationContext, &DescriptorChangeRecord, &AdapterDescriptor, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `AdapterDescriptorChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(Descriptor(...))`;accepted descriptor ref / owner + record kind / state / marker;`record.explains_descriptor`required |
| Step 7 ports | descriptor/change repositories + event-capture repository;no secret / external-document resolver call during mapping |
| error / recovery | forbidden body never enterspayload/snapshot;mapper/capture failure rolls backsource write;delivery failure cannot retire or mark descriptor unresolved |
| idempotency / audit | marker and trace are copied from the append-onlyrecord;dual secret-ref / safe-summary records each own their eligible capture rather than merging records |
| Step 9 flow | `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` |

#### 10.7.4 `GovernanceSeamRelationChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces one body-free seam relation revision to exposure、impact、derived and downstream boundary collaborators;never claims governance approval |
| logical event / routing | `GovernanceSeamRelationChanged`;schema`1`;`capability-hub.governance-seam-relation.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_governance_seam_relation_changed(&GovernanceSeamChangeRecord, &GovernanceSeamRelation)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_governance_seam_relation_changed(&CapabilityOperationContext, &GovernanceSeamChangeRecord, &GovernanceSeamRelation, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `GovernanceSeamRelationChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(GovernanceSeam(...))`;accepted relation ref / identity + record kind / next state;record/relation symmetry required |
| Step 7 ports | seam/change repositories + event-capture repository;governance resolver is not called bymapper/collaboration |
| error / recovery | approval / Policy / shared_rules / workflow body is rejected before mapping;delivery result cannot activate、expire or forbid the seam |
| idempotency / audit | exact append-only seam record is the audit basis;stable source/schema prevents duplicate candidate identity |
| Step 9 flow | `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` |

#### 10.7.5 `CapabilityMethodRelationChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces one body-free capability-method relation revision to relation observers、exposure、impact and view refresh;does not export method body |
| logical event / routing | `CapabilityMethodRelationChanged`;schema`1`;`capability-hub.capability-method-relation.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_capability_method_relation_changed(&MethodRelationChangeRecord, &CapabilityMethodBodyFreeRelation)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_capability_method_relation_changed(&CapabilityOperationContext, &MethodRelationChangeRecord, &CapabilityMethodBodyFreeRelation, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `CapabilityMethodRelationChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(MethodRelation(...))`;accepted relation ref + record method asset id / kind / next state;record endpoint must equal relation endpoint |
| Step 7 ports | method-relation/change repositories + event-capture repository;no method resolver or method-library source dependency during mapping |
| error / recovery | method body、definition、version body or source code is forbidden;delivery failure cannot mark relation stale / unresolved / removed |
| idempotency / audit | record id and method ref remain body-free audit anchors;duplicate source operation cannot create a second capture |
| Step 9 flow | `outbound_capability_method_relation_changed_capture_and_collaborate_flow` |

#### 10.7.6 `FormalExposureBoundaryChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces accepted formal exposure state and deterministic view-refresh hint to server-consumer and derived boundaries;does not authorize runtime execution |
| logical event / routing | `FormalExposureBoundaryChanged`;schema`1`;`capability-hub.formal-exposure-boundary.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_formal_exposure_boundary_changed(&CapabilityExposureChangeRecord, &FormalExposureBoundary)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_formal_exposure_boundary_changed(&CapabilityOperationContext, &CapabilityExposureChangeRecord, &FormalExposureBoundary, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `FormalExposureBoundaryChangedPayload`;schema ref from§10.3 |
| source / construction | exact`Change(Exposure(...))`;accepted exposure ref / registry owner + record kind / next state;`ConsumerViewMarkedStale` is excluded because it describes a derived-view change and is represented by`ControlledConsumerViewAvailabilityChanged`;refresh hint only from`requires_consumer_view_refresh()` |
| Step 7 ports | exposure/change repositories + event-capture repository;no runtime / SDK client / tool execution port |
| error / recovery | record/exposure mismatch rolls backsource transaction;delivery failure does not suspend、retire or reactivate exposure and does not alter formal visibility |
| idempotency / audit | exact exposure record / trace / time are stable;refresh hint is a notification,not an automatic job execution |
| Step 9 flow | `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` |

#### 10.7.7 `ControlledConsumerViewAvailabilityChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces exact controlled-view freshness to runtime / tools / SDK server boundaries、console and observability candidates;view remains derived,not formal truth |
| logical event / routing | `ControlledConsumerViewAvailabilityChanged`;schema`1`;`capability-hub.controlled-consumer-view.availability-changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_controlled_consumer_view_availability_changed(&ControlledConsumerView, TraceId)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_controlled_consumer_view_availability_changed(&CapabilityOperationContext, &ControlledConsumerView, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `ControlledConsumerViewAvailabilityChangedPayload`;schema ref from§10.3 |
| source / construction | exact`DerivedMaterial { ControlledConsumerView(id), version }`;copy exposure / consumer / freshness / source versions;occurred time=`refreshed_at` |
| Step 7 ports | controlled-view repository + event-capture repository;post-commit collaboration only;not derived-material-refreshed mapper |
| error / recovery | wrong audience、missing source versions or duplicate use as`DerivedMaterialRefreshed`is rejected;delivery failure cannot rewriteview or exposure |
| idempotency / audit | context trace is captured becauseview has no trace field;capture source fixes exact view version;no fabricatedsafe-summary ref |
| Step 9 flow | `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` |

#### 10.7.8 `CapabilityChangeImpactIdentified`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces one newly identifiedbody-free impact scope to declared consumers、observability candidates and derived maintenance;does not export execution feedback body |
| logical event / routing | `CapabilityChangeImpactIdentified`;schema`1`;`capability-hub.capability-change-impact.identified.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_capability_change_impact_identified(&CapabilityChangeImpactFact)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_capability_change_impact_identified(&CapabilityOperationContext, &CapabilityChangeImpactFact, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `CapabilityChangeImpactIdentifiedPayload`;schema ref from§10.3 |
| source / construction | exact`Impact(impact ref)`;copy traceability ref / subject / scope / consumer set;state must equal`Identified` |
| Step 7 ports | impact repository + event-capture repository;no downstream execution resolver or runtime store |
| error / recovery | partial / delayed / ignored / resolved source revisions are ineligible;delivery failure cannot changeimpact state or source truth |
| idempotency / audit | impact ref version + trace are exact;each eligible identified revision maps once;downstream feedback remains a separateInbound protocol |
| Step 9 flow | `outbound_capability_change_impact_identified_capture_and_collaborate_flow` |

#### 10.7.9 `DerivedMaterialRefreshed`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces exact directory、audit-export、ecosystem or reconciliation material freshness / outcome to query and observability boundaries;does not announce core truth mutation |
| logical event / routing | `DerivedMaterialRefreshed`;schema`1`;`capability-hub.derived-material.refreshed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_derived_material_refreshed(CapabilityDerivedMaterialRefreshSource, TraceId)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_derived_material_refreshed(&CapabilityOperationContext, CapabilityDerivedMaterialRefreshSource, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `DerivedMaterialRefreshedPayload` / `CapabilityDerivedMaterialAvailability`;schema ref from§10.3 |
| source / construction | exact`DerivedMaterial { material_ref, version }`;four allowed source variants map 1:1 to availability variant and source-version set |
| Step 7 ports | corresponding derived/report repository + event-capture repository;no registry / exposure mutation repository write frommapper |
| error / recovery | controlled-view source、kind/state mismatch or missing source-version set is rejected;report cannot form`CapabilityRegistryChanged`;delivery failure cannot run rebuild or repair |
| idempotency / audit | material exact version is source identity;report trace must equalcontext;no raw index、audit、listing、row diff、run result or evidence alias |
| Step 9 flow | `outbound_derived_material_refreshed_capture_and_collaborate_flow` |

#### 10.7.10 `ReferenceResolutionChanged`

| 项 | exact contract |
|---|---|
| purpose / subscribers | Announces one canonical reference-state revision to capability services、trace / impact and derived maintenance without external owner body |
| logical event / routing | `ReferenceResolutionChanged`;schema`1`;`capability-hub.reference-resolution.changed.v1` |
| pure mapper | `CapabilityEventCandidateMapper::map_reference_resolution_changed(&ReferenceResolutionState)` |
| application capture | `CapabilityOutboundEventCaptureService::capture_reference_resolution_changed(&CapabilityOperationContext, &ReferenceResolutionState, &dyn CapabilityUnitOfWork)` |
| exact schema | shared§6.7 + §10.2 `ReferenceResolutionChangedPayload`;schema ref from§10.3 |
| source / construction | exact`ReferenceResolution(state ref)`;copy subject / kind / value;`matches_subject`andpersisted version symmetry required |
| Step 7 ports | canonical-state repository + event-capture repository;resolver is upstream of accepted state,not called bymapper / collaboration |
| error / recovery | wrong subject-kind、trace mismatch or locator / resolver body is rejected;delivery failure cannot fabricate external truth or alter state |
| idempotency / audit | state exact version / trace / last-checked time are durable audit anchors;one capture per source/schema;duplicate refresh replays stored job / consumer result |
| Step 9 flow | `outbound_reference_resolution_changed_capture_and_collaborate_flow` |

### 10.8 Outbound protocol family stop-review

| 审查项 | expected | evidence / result |
|---|---:|---|
| independent payload structs | 10 | §10.2 exactly ten event payloads;support enum is not counted as an event payload;pass |
| pure mapper callables | 10 | §10.4 exactly one `map_*` per event;pass |
| application capture callables | 10 | §10.4 exactly one `capture_*` per event;pass |
| post-commit collaboration callable | 1 shared application facade | `CapabilityEventCollaborationService::collaborate_captured_event`;official capture load -> candidate -> collaborate -> exact-source check -> short-UoW bind;pass after Step 9 batch `9.9` reopen |
| logical event / schema / routing rows | 10 | §10.3;all schema version`1`,all schema refs and routing keys unique;pass |
| exact technical source rows | 10 | §10.5;six change variants + controlled view + impact + four-kind derived union + reference;pass |
| independent protocol cards | 10 | §10.7.1~§10.7.10;pass |
| unique Step 9 flows | 10 | each card has one unique event-specific capture-and-collaborate flow name;pass |
| source + snapshot + capture transaction | mandatory | §6.7、§10.4~§10.6;same local UoW and rollback as a unit;pass |
| stored-snapshot-only collaboration | mandatory | §10.6;post-commit loader / candidate / collaborate / bind sequence;pass |
| collaboration outcome source symmetry | mandatory | Step 7 outcome carries Rustdoc-complete exact source;candidate / capture / snapshot / outcome source must match before bind;pass after Step 9 batch `9.9` reopen |
| public / internal dependency | mandatory | public payload excludes capture / snapshot / intent;domain mapper has no port;application capture calls Step 7 port;pass |
| Rustdoc | mandatory | all new public structs、enum、fields、variants、variant payloads、trait and public methods have English`///`;pass |
| forbidden owner leakage | zero | no runtime execution、tools result、marketplace listing、governance approval、method / secret / audit body、evidence alias or delivery attempt state;pass |
| upstream blocker | zero unresolved | reconciliation / registry source conflict and controlled-view safe-summary-ref phrase are explicitly裁剪;durable capture reopen closed;pass |

Batch `8.5` status is`completed_wait_user_review`。The outbound family now has ten field-level payload schemas、ten pure mappers、ten same-UoW capture callables、ten closed schema/routing mappings、ten independent protocol cards and ten unique Step 9 flows。`CH-DDD-S7-WATCH-001` is closed through the Step 6 / 7 durable-capture reopen;no unresolved upstream blocker remains for Operations Job batch `8.6`。

This stop-review does not enter§11,does not modify formal`03-详细设计.md`,does not create an implementation ledger / planned boundary skeleton,and does not fabricate implementation commit、run_id、test result、evidence alias or acceptance signature。

## 11. Operations Job Protocol

Operations Job是system / operator显式触发的后台维护协议。它只读取已持久化truth / ref / safe summary / capture,并维护derived material、reconciliation report、canonical reference state或event collaboration recovery surface。Job request不是业务Command,report finding也不是自动修复授权。

### 11.1 Job source decisions and public scope contract

Source decisions:

- 8个Job全部使用§6.8 `CapabilityJobRequest<T> / CapabilityJobResponse<R>`与schema version `1`;logical trigger不等于scheduler、cron、queue或deployment binding。
- HLD中的`pending event refs`在batch `8.5` durable-capture回开后收口为exact local `CapabilityEventCaptureRef`或external `CapabilityCollaborationIntentRef`。repair不得加载change / impact / current truth重建event。
- Job scope必须是closed public enum或non-empty typed ref vector,再由application显式映射Step 7 application-local scan scope。public request不得暴露`CapabilityRepositoryCursor`、database page token或adapter filter。
- multi-target Job允许partial completion,但每个changed material / reference revision及其outbound snapshot / capture必须在该target的local UoW内原子提交。exact per-item / final-report transaction ordering留Step 11。
- report只记录本次实际processed / changed / failed / skipped target。runner不得根据repository、adapter private counter或current truth补齐明细。

以下secondary types归`contracts::job`。

```rust
/// Public committed-truth scope mapped to CapabilityTruthSnapshotScope.
pub enum CapabilityJobTruthSnapshotScope {
    /// Truth centered on one exact registry entry revision.
    RegistryEntry {
        /// Exact registry entry used to seed the truth snapshot.
        registry_entry_ref: CapabilityRegistryEntryRef,
    },
    /// Truth centered on one exact formal exposure revision.
    FormalExposure {
        /// Exact formal exposure used to seed the truth snapshot.
        exposure_ref: FormalExposureBoundaryRef,
    },
    /// Truth centered on one exact traceability revision.
    Traceability {
        /// Exact traceability revision used to seed the truth snapshot.
        traceability_ref: CapabilityAccessTraceabilityRecordRef,
    },
    /// Truth limited to one registered consumer boundary.
    Consumer {
        /// Body-free consumer boundary used to select committed truth.
        consumer_ref: CapabilityConsumerRef,
    },
    /// Truth selected by one declared reconciliation scope.
    Reconciliation {
        /// Body-free reconciliation scope mapped without widening.
        reconciliation_scope: CapabilityReconciliationScope,
    },
    /// All committed capability access truth visible to the job policy.
    AllCommittedTruth,
}

/// Public operations-job derived-material scope mapped to the maintenance-safe internal scan variants.
pub enum CapabilityJobDerivedMaterialScope {
    /// Materials affected by one capability access truth subject.
    AffectedByTruth {
        /// Body-free truth subject whose dependent materials are selected.
        subject_ref: CapabilityTraceSubjectRef,
    },
    /// Materials of one rebuildable category.
    MaterialKind {
        /// Closed derived-material category selected by the job.
        material_kind: DerivedMaterialKind,
    },
    /// Materials covered by one reconciliation scope.
    Reconciliation {
        /// Body-free reconciliation scope mapped without widening.
        reconciliation_scope: CapabilityReconciliationScope,
    },
    /// All rebuildable capability-hub materials visible to the job policy.
    AllMaterials,
}

/// Public target selection for controlled consumer-view refresh.
pub enum CapabilityControlledViewRefreshScope {
    /// Refresh or create views for explicit consumer boundaries.
    ExplicitConsumers {
        /// Non-empty duplicate-free consumer boundaries for one exposure.
        consumer_refs: Vec<CapabilityConsumerRef>,
    },
    /// Refresh explicit existing controlled-view revisions.
    ExistingViews {
        /// Non-empty duplicate-free exact view revisions owned by the exposure.
        consumer_view_refs: Vec<ControlledConsumerViewRef>,
    },
    /// Refresh all existing views indexed under the declared exposure.
    AllExistingForExposure,
}

/// Exact accepted truth chain used to build one directory projection.
pub struct CapabilityDirectoryProjectionSource {
    /// Exact registry entry source revision.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact accepted adapter descriptor source revision.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Exact accepted formal exposure source revision.
    pub exposure_ref: FormalExposureBoundaryRef,
}

/// Public target selection for directory projection rebuild.
pub enum CapabilityDirectoryProjectionRebuildScope {
    /// Build or refresh projections from explicit exact truth chains.
    ExplicitSources {
        /// Non-empty duplicate-free registry/descriptor/exposure source chains.
        sources: Vec<CapabilityDirectoryProjectionSource>,
    },
    /// Resolve current accepted descriptor and exposure sources for registry entries.
    RegistryEntries {
        /// Non-empty duplicate-free exact registry entry revisions.
        registry_entry_refs: Vec<CapabilityRegistryEntryRef>,
    },
    /// Rebuild explicit existing projection revisions from their stored source refs.
    ExistingProjections {
        /// Non-empty duplicate-free exact directory projection revisions.
        projection_refs: Vec<DirectorySearchBrowseProjectionRef>,
    },
}

/// Exact target for one read-only ecosystem discovery rebuild.
pub struct CapabilityEcosystemDiscoveryTarget {
    /// Exact formal exposure revision used by the discovery summary.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Body-free ecosystem consumer context for the summary.
    pub ecosystem_context_ref: EcosystemContextRef,
}

/// Public external-reference scan scope mapped to CapabilityReferenceScanScope.
pub enum CapabilityReferenceRefreshScope {
    /// Refresh explicit local reference subjects.
    ExplicitSubjects {
        /// Non-empty duplicate-free reference subjects.
        reference_subjects: Vec<ReferenceSubjectRef>,
    },
    /// Refresh references whose canonical value is not resolved.
    NonResolved,
    /// Refresh all registered references allowed by the job kind filter.
    AllReferences,
}

/// Public event-collaboration recovery scope.
pub enum CapabilityEventCollaborationRepairScope {
    /// Recover explicit local captures from their immutable snapshots.
    ExplicitCaptures {
        /// Non-empty duplicate-free exact local capture revisions.
        capture_refs: Vec<CapabilityEventCaptureRef>,
    },
    /// Recover every local capture committed without a bound external intent.
    AwaitingIntentCaptures,
    /// Repair explicit external collaboration intents.
    ExplicitIntents {
        /// Non-empty duplicate-free opaque external intent references.
        intent_refs: Vec<CapabilityCollaborationIntentRef>,
    },
    /// Inspect and repair the external intent formed from one exact event source.
    Source {
        /// Exact immutable outbound event source.
        source_ref: CapabilityOutboundEventSourceRef,
    },
    /// Repair external intents currently pending, failed, or unavailable.
    RepairableIntents,
}

/// Item-level material or reference change classification in a typed Job report.
pub enum CapabilityJobItemChange {
    /// A new derived material or canonical state was created.
    Created,
    /// An existing derived material or canonical state was updated.
    Updated,
    /// The target was valid and inspected but required no persisted change.
    Unchanged,
}
```

Scope mapping and validation:

| public scope | Step 7 mapping | validation / forbidden shortcut |
|---|---|---|
| `CapabilityJobTruthSnapshotScope` | 1:1 to`CapabilityTruthSnapshotScope`,after exact ref existence/version validation | `AllCommittedTruth`requiresdeclared system/operator policy;adapter cannot widen narrower variant |
| `CapabilityJobDerivedMaterialScope` | 1:1 only to maintenance-safe`AffectedByTruth / MaterialKind / Reconciliation / AllMaterials`variants | internal`MutableAffectedByTruth`has no public Job variant and is Command-only application orchestration；material scan never returns core truth mutation target |
| `CapabilityControlledViewRefreshScope::ExplicitConsumers` | per consumer `find_current_by_exposure_and_consumer`;missing may create throughdomain factory | vector non-empty / duplicate-free;consumer ref must be registered / applicable |
| `ExistingViews` | `get_with_version`per exact ref | every view must match request exposure id;no cross-exposure refresh |
| `AllExistingForExposure` | `list_affected_by_truth(FormalExposure(exposure_id))`withinternal pages | refreshes existing indexed views only;does not invent missing audiences |
| directory `ExplicitSources` | exact registry / descriptor / exposure repository loads | owner chain / accepted-state / ref-version symmetry required |
| directory `RegistryEntries` | exact registry load then formal current descriptor / exposure lookup | missing prerequisite becomesfailed target,never creates truth |
| directory `ExistingProjections` | derived repository exact load then source-ref validation | no current-truth fallback if stored source refs are corrupt |
| `CapabilityReferenceRefreshScope` | explicit / non-resolved / all Step 7 reference scan | `allowed_reference_kinds`filtersaftertyped load;never raw locator scan |
| repair captures | `CapabilityEventCaptureScanScope` / exact get | onlyofficial snapshot;no current-source mapper |
| repair intents / source / repairable | `CapabilityEventCollaborationScanScope` | external status owner remainscollaboration port;no local delivery-state copy |

### 11.2 Eight Operations Job input schemas

```rust
/// Input for registry-centered reconciliation without registry truth repair.
pub struct RunCapabilityRegistryReconciliationJobInput {
    /// Body-free scope recorded by the resulting reconciliation report.
    pub reconciliation_scope: CapabilityReconciliationScope,
    /// Committed truth scope inspected by the run.
    pub truth_scope: CapabilityJobTruthSnapshotScope,
    /// Derived materials compared with the registry-centered truth scope.
    pub material_scope: CapabilityJobDerivedMaterialScope,
}

/// Input for controlled consumer-view refresh under one formal exposure.
pub struct RefreshControlledConsumerViewJobInput {
    /// Exact formal exposure revision that remains read-only to this job.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Explicit existing or consumer-centered view targets.
    pub target_scope: CapabilityControlledViewRefreshScope,
}

/// Input for rebuilding directory search and browse projections.
pub struct RebuildDirectorySearchBrowseProjectionJobInput {
    /// Exact source chains, registry entries, or existing projections to rebuild.
    pub rebuild_scope: CapabilityDirectoryProjectionRebuildScope,
}

/// Input for preparing audit-friendly export summaries.
pub struct PrepareAuditFriendlyExportSummaryJobInput {
    /// Non-empty duplicate-free traceability revisions to summarize.
    pub traceability_refs: Vec<CapabilityAccessTraceabilityRecordRef>,
    /// Body-free allowed export scope applied to every selected trace revision.
    pub export_scope: AuditExportScope,
    /// Optional duplicate-free observability or audit references to attach.
    pub observability_ref_ids: Vec<ObservabilityAuditRefId>,
}

/// Input for rebuilding read-only ecosystem discovery summaries.
pub struct RebuildReadOnlyEcosystemDiscoverySummaryJobInput {
    /// Non-empty duplicate-free exposure and ecosystem-context pairs.
    pub targets: Vec<CapabilityEcosystemDiscoveryTarget>,
}

/// Input for reconciling rebuildable materials against committed truth.
pub struct RunDerivedMaterialReconciliationJobInput {
    /// Body-free scope recorded by the resulting reconciliation report.
    pub reconciliation_scope: CapabilityReconciliationScope,
    /// Committed truth scope used as the comparison basis.
    pub truth_scope: CapabilityJobTruthSnapshotScope,
    /// Rebuildable material scope inspected by the run.
    pub material_scope: CapabilityJobDerivedMaterialScope,
}

/// Input for refreshing canonical external-reference resolution states.
pub struct RefreshExternalReferenceResolutionJobInput {
    /// Explicit, unresolved, or all-reference scan scope.
    pub refresh_scope: CapabilityReferenceRefreshScope,
    /// Non-empty duplicate-free reference kinds allowed in this run.
    pub allowed_reference_kinds: Vec<ReferenceKind>,
}

/// Input for recovering local event captures or external collaboration intents.
pub struct RepairCapabilityAccessEventCollaborationJobInput {
    /// Closed local-capture or external-intent recovery scope.
    pub repair_scope: CapabilityEventCollaborationRepairScope,
}
```

Input invariants:

- every vector described as non-empty must reject empty and duplicate members before idempotency reservation;optional`observability_ref_ids`usesempty to mean no attachment and still rejects duplicates。
- exact ref versions are protocol input,not optimistic expected versions。Application loads each ref and obtains`Loaded.expected_version`for any update。
- `RunCapabilityRegistryReconciliation`requires a registry-centered truth scope and rejects a material-only scope that cannot explain any registry subject。`RunDerivedMaterialReconciliation`accepts the broader closed scope family。
- Audit export input contains onlytrace refs、safe export scope and optional audit ids;no raw log、metric、span、evidence body、evidence alias or target credential。
- reference kind filter applies to all three refresh-scope variants。An explicit subject whose persisted kind is outside the filter is rejected / failed target,not silently skipped by string comparison。
- repair input containscapture / intent / exact source refs only。It never carries serialized envelope bytes、topic、retry count、attempt id ortransport destination。

### 11.3 Typed Job report detail schemas

```rust
/// Public body-free summary of one persisted reconciliation report.
pub struct CapabilityReconciliationJobReportView {
    /// Exact immutable reconciliation report revision.
    pub report_ref: CapabilityReconciliationReportRef,
    /// Final reconciliation report state.
    pub report_state: ReconciliationReportState,
    /// Exact committed truth refs inspected by the report.
    pub source_truth_refs: AccessTruthRefSet,
    /// Exact derived material refs inspected by the report.
    pub inspected_material_refs: DerivedMaterialRefSet,
    /// Body-free finding summary copied from the report.
    pub finding_summary: ReconciliationFindingSummary,
}

/// Typed result detail for registry-centered reconciliation.
pub struct CapabilityRegistryReconciliationJobResult {
    /// Persisted report view when enough comparison basis existed to append one.
    pub reconciliation: Option<CapabilityReconciliationJobReportView>,
}

/// One successfully processed controlled consumer-view target.
pub struct CapabilityControlledViewRefreshItem {
    /// Exact controlled-view revision after processing.
    pub consumer_view_ref: ControlledConsumerViewRef,
    /// Exact formal exposure revision used as the source.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Registered consumer boundary that owns the view.
    pub consumer_ref: CapabilityConsumerRef,
    /// Resulting controlled-view freshness state.
    pub freshness_state: ConsumerViewFreshnessState,
    /// Whether the target was created, updated, or unchanged.
    pub change: CapabilityJobItemChange,
}

/// Typed result detail for controlled consumer-view refresh.
pub struct ControlledConsumerViewRefreshJobResult {
    /// Successfully processed controlled-view targets in stable request order.
    pub views: Vec<CapabilityControlledViewRefreshItem>,
}

/// One successfully rebuilt or unchanged directory projection target.
pub struct CapabilityDirectoryProjectionRebuildItem {
    /// Exact directory projection revision after processing.
    pub projection_ref: DirectorySearchBrowseProjectionRef,
    /// Exact registry entry source revision.
    pub registry_entry_ref: CapabilityRegistryEntryRef,
    /// Exact descriptor source revision.
    pub descriptor_ref: AdapterDescriptorRef,
    /// Exact formal exposure source revision.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Resulting directory projection freshness state.
    pub freshness_state: DirectoryProjectionState,
    /// Whether the target was created, updated, or unchanged.
    pub change: CapabilityJobItemChange,
}

/// Typed result detail for directory projection rebuild.
pub struct DirectorySearchBrowseProjectionRebuildJobResult {
    /// Successfully processed projection targets in stable scope order.
    pub projections: Vec<CapabilityDirectoryProjectionRebuildItem>,
}

/// One successfully prepared or unchanged audit-friendly export target.
pub struct CapabilityAuditExportPreparationItem {
    /// Exact audit-friendly export revision after processing.
    pub export_ref: AuditFriendlyExportSummaryRef,
    /// Exact traceability revision summarized by the export.
    pub traceability_ref: CapabilityAccessTraceabilityRecordRef,
    /// Resulting audit-export availability state.
    pub export_state: AuditExportState,
    /// Body-free observability or audit refs attached to the export.
    pub observability_ref_ids: Vec<ObservabilityAuditRefId>,
    /// Whether the target was created, updated, or unchanged.
    pub change: CapabilityJobItemChange,
}

/// Typed result detail for audit-friendly export preparation.
pub struct AuditFriendlyExportPreparationJobResult {
    /// Successfully processed export targets in stable trace order.
    pub exports: Vec<CapabilityAuditExportPreparationItem>,
}

/// One successfully rebuilt or unchanged ecosystem discovery target.
pub struct CapabilityEcosystemDiscoveryRebuildItem {
    /// Exact read-only ecosystem discovery revision after processing.
    pub discovery_ref: ReadOnlyEcosystemDiscoverySummaryRef,
    /// Exact formal exposure revision used as the source.
    pub exposure_ref: FormalExposureBoundaryRef,
    /// Body-free ecosystem context represented by the summary.
    pub ecosystem_context_ref: EcosystemContextRef,
    /// Resulting ecosystem discovery freshness state.
    pub freshness_state: EcosystemDiscoveryState,
    /// Whether the target was created, updated, or unchanged.
    pub change: CapabilityJobItemChange,
}

/// Typed result detail for read-only ecosystem discovery rebuild.
pub struct ReadOnlyEcosystemDiscoveryRebuildJobResult {
    /// Successfully processed discovery targets in stable request order.
    pub discoveries: Vec<CapabilityEcosystemDiscoveryRebuildItem>,
}

/// Typed result detail for derived-material reconciliation.
pub struct DerivedMaterialReconciliationJobResult {
    /// Persisted report view when enough comparison basis existed to append one.
    pub reconciliation: Option<CapabilityReconciliationJobReportView>,
}

/// One successfully inspected canonical reference-resolution target.
pub struct CapabilityReferenceResolutionRefreshItem {
    /// Body-free reference subject inspected by the resolver.
    pub reference_subject: ReferenceSubjectRef,
    /// Exact canonical resolution-state revision after processing.
    pub resolution_state_ref: ReferenceResolutionStateRef,
    /// Resulting canonical resolution value.
    pub resolution_value: ReferenceResolutionValue,
    /// Whether the existing canonical state was updated or unchanged;Created is invalid here.
    pub change: CapabilityJobItemChange,
}

/// Typed result detail for external-reference resolution refresh.
pub struct ExternalReferenceResolutionRefreshJobResult {
    /// Successfully inspected reference targets in stable scan order.
    pub references: Vec<CapabilityReferenceResolutionRefreshItem>,
}

/// Public local binding state of one durable outbound event capture.
pub enum CapabilityEventCaptureBindingView {
    /// The capture is committed locally without a bound external intent.
    AwaitingIntent,
    /// The capture is bound to one stable external collaboration intent.
    IntentBound {
        /// Opaque external intent reference bound to the local capture.
        intent_ref: CapabilityCollaborationIntentRef,
    },
}

/// One successfully inspected or repaired event-collaboration target.
pub struct CapabilityEventCollaborationRepairItem {
    /// Exact local capture revision when the target was local or could be correlated.
    pub capture_ref: Option<CapabilityEventCaptureRef>,
    /// External collaboration intent when one exists after processing.
    pub intent_ref: Option<CapabilityCollaborationIntentRef>,
    /// Exact immutable source represented by the capture or external intent.
    pub source_ref: CapabilityOutboundEventSourceRef,
    /// Local capture binding state when a local capture was loaded.
    pub capture_binding: Option<CapabilityEventCaptureBindingView>,
    /// Current external collaboration delivery status.
    pub status: EventCollaborationStatus,
    /// Redacted issue for a failed or unavailable typed status.
    pub issue_ref: Option<CapabilityProtocolValidationIssueRef>,
}

/// Typed result detail for event-collaboration recovery.
pub struct CapabilityAccessEventCollaborationRepairJobResult {
    /// Successfully inspected or repaired targets in stable scope order.
    pub items: Vec<CapabilityEventCollaborationRepairItem>,
}
```

Typed detail symmetry:

| Job result | generic `CapabilityJobReport<T>` symmetry |
|---|---|
| registry / derived reconciliation | `reconciliation_report_refs`equals the optional detail report ref;when present,`changed_material_refs`also includes`DerivedMaterialRef::ReconciliationReport(id)`;state / sets / finding equal domain report |
| controlled view | every`Created / Updated`view appears as`DerivedMaterialRef::ControlledConsumerView`in`changed_material_refs`;`Unchanged`does not |
| directory projection | every changed projection appears as`DerivedMaterialRef::DirectoryProjection`;source refs / freshness equal saved object |
| audit export | every changed export appears as`DerivedMaterialRef::AuditExport`;observability ids equal saved optional set |
| ecosystem discovery | every changed discovery appears as`DerivedMaterialRef::EcosystemDiscovery` |
| reference refresh | every`Updated`state ref appears in`changed_reference_state_refs`;`Unchanged`does not;`Created`is forbidden because every registered ref already owns a canonical state id |
| event collaboration repair | every item withintent appears once in`collaboration_statuses`withsame intent / status / issue;pre-intent consistency failure belongs`failed_targets`,not a fabricated intent |

#### 11.3.1 Application-local execution-journal response assembly

Batch `9.11` pre-entry adds no public DTO、protocol or Job variant。The Step 6 `CapabilityJobExecutionRecord` andsupport types remainapplication-local technical carriers。The final-report phase must use the following module-private pure assemblers;they are exact implementation callables,not apublic trait andnot aninfra Port:

```rust
/// Assembles the registry-reconciliation response solely from one all-terminal execution journal.
fn assemble_registry_reconciliation_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>, ApplicationError>;

/// Assembles the controlled-view response solely from one all-terminal execution journal.
fn assemble_controlled_view_refresh_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>, ApplicationError>;

/// Assembles the directory-projection response solely from one all-terminal execution journal.
fn assemble_directory_projection_rebuild_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>, ApplicationError>;

/// Assembles the audit-export response solely from one all-terminal execution journal.
fn assemble_audit_export_preparation_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>, ApplicationError>;

/// Assembles the ecosystem-discovery response solely from one all-terminal execution journal.
fn assemble_ecosystem_discovery_rebuild_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>, ApplicationError>;

/// Assembles the derived-reconciliation response solely from one all-terminal execution journal.
fn assemble_derived_reconciliation_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<DerivedMaterialReconciliationJobResult>, ApplicationError>;

/// Assembles the reference-refresh response solely from one all-terminal execution journal.
fn assemble_reference_resolution_refresh_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>, ApplicationError>;

/// Assembles the event-collaboration response solely from one all-terminal execution journal.
fn assemble_event_collaboration_repair_response(
    execution: &CapabilityJobExecutionRecord,
    result_ref: CapabilityProtocolResultRef,
) -> Result<CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>, ApplicationError>;
```

Shared preconditions andidentity mapping:

- assembler accepts onlythe matchingclosed `operation_name / job_name / schema_version / run_id`,an execution still`Planned`,all target outcomes terminal,and`final_result_ref / finalized_at=None`。A wrong plan variant、success variant、target ref、ordinal gap or non-terminal target isconsistency `ApplicationError`;assembler never skips orrepairs the row。
- `PreclassifiedFailure` is a complete target-plan variant,not a run issue orinitial terminal shortcut。Before final assembly its outcome must be`Failed`with the exact embedded failure;`Succeeded / Skipped / Planned` isconsistency error。It contributes onlythe ordinary`failed_targets`row andimpact-based disposition,nevera typed success item orchanged ref。
- `result_ref` isgenerated once in thefinal-report phase andmust map to the sameapplication `CapabilityApplicationResultRef` later used bystored shell / envelope、journal `finalize` andidempotency `complete`。Assembler does not generate ids、read repositories、mutate journal orserialize a surface。
- response `job_name / schema_version / run_id` copy the journal fields。`report.result_ref` uses the supplied public result ref。`issue_refs` arethe stable duplicate-free journal `run_issues[*].issue_ref` in stored order;impact remainsapplication-local andisnot exposed。
- all target vectors followjournal ordinal order。Assembler performs no sorting byreturned id、repository order or status anddoes not deduplicate asymmetric duplicates into success。
- an empty target vector is valid only in two closed forms:`run_issues` has no stable/retryable impact after a complete zero-target scan,or planning failed before a complete target plan existed and`run_issues` contains at least one `StableFailure` / `RetryablePrerequisite`。Assembler never rescans scope or treats the second form as a successful empty scan。

Generic vector andtyped-detail mapping:

| journal terminal outcome | generic report mapping | typed detail mapping |
|---|---|---|
| `Succeeded(Reconciliation(view))` | append `view.report_ref` to`reconciliation_report_refs` and`DerivedMaterialRef::ReconciliationReport(plan.report_id)` to`changed_material_refs` | matching reconciliation Job gets`Some(view)`;view ref must match plan report id;any second reconciliation success isconsistency failure |
| `Succeeded(ControlledView(item))` | `Created / Updated`append`ControlledConsumerView(plan.consumer_view_id)`;`Unchanged`appends nothing | append item to`views`;item ref must match plan id / exposure / consumer |
| `Succeeded(DirectoryProjection(item))` | `Created / Updated`append`DirectoryProjection(plan.projection_id)`;`Unchanged`appends nothing | append item to`projections`;item ref / source chain must match plan |
| `Succeeded(AuditExport(item))` | `Created / Updated`append`AuditExport(plan.export_id)`;`Unchanged`appends nothing | append item to`exports`;item ref / trace must match plan |
| `Succeeded(EcosystemDiscovery(item))` | `Created / Updated`append`EcosystemDiscovery(plan.discovery_id)`;`Unchanged`appends nothing | append item to`discoveries`;item ref / exposure / context / freshness state must match plan expected state |
| `Succeeded(ReferenceResolution(item))` | `Updated`appendexact`resolution_state_ref`;`Unchanged`appends nothing;`Created`isconsistency failure | append item to`references`;`Unchanged`must keep the exact planned state ref,while`Updated`must keep the same state id at exactly one successor version |
| `Succeeded(EventCollaboration(item))` | when`intent_ref=Some`,appendone status view withthe same intent / status / issue;when`None`,appendno generic status | append the complete item to`items`;for`EventCapture(existing_intent_ref=None)`require same capture id + exactly one successor version + frozen source + outcome intent,for`Some(intent)`require exact unchanged capture ref + frozen source + same intent;never fabricate an intent for a local capture |
| `Failed(failure)` | append`failure.issue()` to`failed_targets`;read`failure.impact()` onlyfor disposition | no success item |
| `Skipped(issue)` | append issue to`skipped_targets` | no success item |

Disposition assembly is deterministic and uses no request-local counters:

1. Any target failure orrun issue with`RetryablePrerequisite` -> `Retryable`。The report still preserves every succeeded / failed / skipped target exactly;retry requires a newrun / key andthe current journal isnever resumed after finalization。
2. Otherwise,a single reconciliation success whose persisted `report_state == ReconciliationReportState::Failed` must have at least one `StableFailure` run issue and -> `Failed`。Missing that impact row is a journal consistency error;the assembler does not infer impact from enum display text。
3. Otherwise,at least one success plusat least one failed / skipped target or`StableFailure` run issue -> `PartiallyCompleted`。
4. Otherwise,no success plusat least one failed / skipped target or`StableFailure` run issue -> `Failed`。
5. Otherwise,all targets succeeded or thecomplete valid zero-target scan plan is empty withonly`Advisory` / no run issues -> `Completed`。

`CapabilityJobItemChange::Unchanged` counts as success,not skip。A reconciliation success whose persisted domain `report_state=Failed` still remains a successfully committed report target for exact detail / ref assembly,but its public Job disposition is`Failed`only through rule 2 andthe required durable`StableFailure` run issue。Other reconciliation states do not alter disposition by enum label。Assembler may not infer`Retryable` fromopaque issue refs、external status、material state orerror strings。

Final UoW sequence consumes the assembled response without changing its public shape:

```text
all-terminal Loaded<CapabilityJobExecutionRecord>
  -> generate one application/public result ref pair
  -> call the matching pure assembler above
  -> build variant-bound CapabilityStoredJobResponse + serialized surface + shell
  -> execution.finalize(same application result ref)
  -> idempotency.complete(same application result ref)
  -> save_job_report + CapabilityJobExecutionRepository.save
     + CapabilityIdempotencyRepository.save in one final-report UoW
```

Ifany save orcommit fails,the public response isnot returned ascompleted。Prior target commits remain represented byterminal journal outcomes;reentry exact-loads thejournal andreattempts only final assembly whenno`Planned` target remains。It must not readreport-by-run、current material / reference / capture or aprivate accumulator。

### 11.4 Runner handler and application service callable surface

```rust
/// Jobs-entry handler surface for all closed capability-hub operations jobs.
#[async_trait::async_trait]
pub trait CapabilityOperationsJobHandlers: Send + Sync {
    /// Handles one registry-centered reconciliation request.
    async fn run_capability_registry_reconciliation(
        &self,
        request: CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>,
    ) -> Result<CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>, ApplicationError>;

    /// Handles one controlled consumer-view refresh request.
    async fn refresh_controlled_consumer_view(
        &self,
        request: CapabilityJobRequest<RefreshControlledConsumerViewJobInput>,
    ) -> Result<CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>, ApplicationError>;

    /// Handles one directory projection rebuild request.
    async fn rebuild_directory_search_browse_projection(
        &self,
        request: CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>,
    ) -> Result<CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>, ApplicationError>;

    /// Handles one audit-friendly export preparation request.
    async fn prepare_audit_friendly_export_summary(
        &self,
        request: CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>,
    ) -> Result<CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>, ApplicationError>;

    /// Handles one read-only ecosystem discovery rebuild request.
    async fn rebuild_read_only_ecosystem_discovery_summary(
        &self,
        request: CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>,
    ) -> Result<CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>, ApplicationError>;

    /// Handles one derived-material reconciliation request.
    async fn run_derived_material_reconciliation(
        &self,
        request: CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>,
    ) -> Result<CapabilityJobResponse<DerivedMaterialReconciliationJobResult>, ApplicationError>;

    /// Handles one external-reference resolution refresh request.
    async fn refresh_external_reference_resolution(
        &self,
        request: CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>,
    ) -> Result<CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>, ApplicationError>;

    /// Handles one event-collaboration recovery request.
    async fn repair_capability_access_event_collaboration(
        &self,
        request: CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>,
    ) -> Result<CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>, ApplicationError>;
}

/// Application service surface for all closed capability-hub operations jobs.
#[async_trait::async_trait]
pub trait CapabilityOperationsJobService: Send + Sync {
    /// Reconciles registry-centered committed truth and derived material without truth repair.
    async fn run_capability_registry_reconciliation(
        &self,
        context: CapabilityOperationContext,
        input: RunCapabilityRegistryReconciliationJobInput,
    ) -> Result<CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>, ApplicationError>;

    /// Refreshes controlled consumer views without changing formal exposure truth.
    async fn refresh_controlled_consumer_view(
        &self,
        context: CapabilityOperationContext,
        input: RefreshControlledConsumerViewJobInput,
    ) -> Result<CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>, ApplicationError>;

    /// Rebuilds read-only directory projections from accepted source refs.
    async fn rebuild_directory_search_browse_projection(
        &self,
        context: CapabilityOperationContext,
        input: RebuildDirectorySearchBrowseProjectionJobInput,
    ) -> Result<CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>, ApplicationError>;

    /// Prepares body-free audit-friendly export summaries.
    async fn prepare_audit_friendly_export_summary(
        &self,
        context: CapabilityOperationContext,
        input: PrepareAuditFriendlyExportSummaryJobInput,
    ) -> Result<CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>, ApplicationError>;

    /// Rebuilds read-only ecosystem discovery summaries without marketplace truth.
    async fn rebuild_read_only_ecosystem_discovery_summary(
        &self,
        context: CapabilityOperationContext,
        input: RebuildReadOnlyEcosystemDiscoverySummaryJobInput,
    ) -> Result<CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>, ApplicationError>;

    /// Reconciles rebuildable materials against committed truth without automatic repair.
    async fn run_derived_material_reconciliation(
        &self,
        context: CapabilityOperationContext,
        input: RunDerivedMaterialReconciliationJobInput,
    ) -> Result<CapabilityJobResponse<DerivedMaterialReconciliationJobResult>, ApplicationError>;

    /// Refreshes canonical external-reference states through body-free resolvers.
    async fn refresh_external_reference_resolution(
        &self,
        context: CapabilityOperationContext,
        input: RefreshExternalReferenceResolutionJobInput,
    ) -> Result<CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>, ApplicationError>;

    /// Recovers stored event captures or repairs external collaboration intents.
    async fn repair_capability_access_event_collaboration(
        &self,
        context: CapabilityOperationContext,
        input: RepairCapabilityAccessEventCollaborationJobInput,
    ) -> Result<CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>, ApplicationError>;
}
```

`CapabilityJobMetadata::copy_for_response_validation` is a contracts-owned, body-free copy operation. Its exact implementation copies the validated job name through the existing crate-visible `CapabilitySafeText::copy_validated`, copies the positive `u16` schema wrapper by value, and clones the four existing core-owned fields. The locally inspected `core-contracts` baseline confirms `JobRunId`、`IdempotencyKey`、`ActorContext` and `TraceId` implement `Clone`; no serialization、display-text parsing、regenerated identity or direct `core-contracts` dependency in the Jobs member is required. The returned value is invocation-local and may be used only to validate response symmetry; it is not persisted, hashed, logged as raw metadata, or accepted as a second request authority.

All 23 async trait declarations in this Step now carry the Step 14 controlled `#[async_trait::async_trait]` object-safety binding: 8 Command handler/service traits、9 Query handler/service traits、2 Inbound handler/service traits、2 Outbound service traits and 2 Operations Job handler/service traits. Their corresponding application/API/Worker/Jobs implementations must carry the same annotation, use the fixed `async-trait 0.1.89` `Send` lowering and never use `?Send`. This preserves every callable name、parameter、return value、`Send + Sync` requirement and error semantic; it adds no protocol method and authorizes no generic dispatcher.

Handler rules:

- handler validatesclosed job name、schema `1` and concrete input type before constructing`CapabilityOperationContext::from_job`;mismatch is`Rejected`and never reachesapplication。
- `jobs`entry supplies validated system/operator actor、run id、trace andidempotency key,but never callsrepository、resolver、capture repository、collaboration port orUoW directly。
- application service returns the complete typed public response;runner only maps process exit / scheduler acknowledgement and may not alter disposition、refs、states orissues。

### 11.5 Closed trigger, callable and Step 9 flow map

| Job | logical trigger | handler / application method | input -> typed detail | Step 9 flow |
|---|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | `capability-hub.job.run-capability-registry-reconciliation.v1` | `run_capability_registry_reconciliation` | `RunCapabilityRegistryReconciliationJobInput` -> `CapabilityRegistryReconciliationJobResult` | `job_run_capability_registry_reconciliation_flow` |
| `RefreshControlledConsumerView` | `capability-hub.job.refresh-controlled-consumer-view.v1` | `refresh_controlled_consumer_view` | `RefreshControlledConsumerViewJobInput` -> `ControlledConsumerViewRefreshJobResult` | `job_refresh_controlled_consumer_view_flow` |
| `RebuildDirectorySearchBrowseProjection` | `capability-hub.job.rebuild-directory-search-browse-projection.v1` | `rebuild_directory_search_browse_projection` | `RebuildDirectorySearchBrowseProjectionJobInput` -> `DirectorySearchBrowseProjectionRebuildJobResult` | `job_rebuild_directory_search_browse_projection_flow` |
| `PrepareAuditFriendlyExportSummary` | `capability-hub.job.prepare-audit-friendly-export-summary.v1` | `prepare_audit_friendly_export_summary` | `PrepareAuditFriendlyExportSummaryJobInput` -> `AuditFriendlyExportPreparationJobResult` | `job_prepare_audit_friendly_export_summary_flow` |
| `RebuildReadOnlyEcosystemDiscoverySummary` | `capability-hub.job.rebuild-read-only-ecosystem-discovery-summary.v1` | `rebuild_read_only_ecosystem_discovery_summary` | `RebuildReadOnlyEcosystemDiscoverySummaryJobInput` -> `ReadOnlyEcosystemDiscoveryRebuildJobResult` | `job_rebuild_read_only_ecosystem_discovery_summary_flow` |
| `RunDerivedMaterialReconciliation` | `capability-hub.job.run-derived-material-reconciliation.v1` | `run_derived_material_reconciliation` | `RunDerivedMaterialReconciliationJobInput` -> `DerivedMaterialReconciliationJobResult` | `job_run_derived_material_reconciliation_flow` |
| `RefreshExternalReferenceResolution` | `capability-hub.job.refresh-external-reference-resolution.v1` | `refresh_external_reference_resolution` | `RefreshExternalReferenceResolutionJobInput` -> `ExternalReferenceResolutionRefreshJobResult` | `job_refresh_external_reference_resolution_flow` |
| `RepairCapabilityAccessEventCollaboration` | `capability-hub.job.repair-capability-access-event-collaboration.v1` | `repair_capability_access_event_collaboration` | `RepairCapabilityAccessEventCollaborationJobInput` -> `CapabilityAccessEventCollaborationRepairJobResult` | `job_repair_capability_access_event_collaboration_flow` |

Logical trigger是closed protocol identity。Physical scheduler、cron、queue、process package、concurrency、timeout、retry count、checkpoint和parallelism由Step 14 / `04`绑定,不得改变job name、schema、input/detail pairing或idempotency semantics。

### 11.6 DTO to object / Port construction closure

| Job | input field construction | Step 6 object / function | Step 7 Port surface | write / outbound boundary |
|---|---|---|---|---|
| Registry reconciliation | maptruth / material public scopes,load committed snapshots and exact materials,derive non-empty inspected sets | `CapabilityReconciliationReport::{from_findings,failed}` | truth snapshot、registry/change/material reads、report append、id / clock / UoW | append report + `DerivedMaterialRefreshed`snapshot/capture same UoW;never`CapabilityRegistryChanged` |
| Controlled view refresh | load exact exposure,current source-version-symmetric visibility,accepted descriptor / optional safe summaries,consumer refs,current optional view；construct structured`DescriptorConsumerSummary`with closed partial kinds andderive source version set | `FormalVisibilityApplicability::is_consumable_by`;`ControlledConsumerView::{build,refresh_from_exposure}` + freshness policy；`mark_rebuilding / mark_unavailable`reserved andnotcalled | exposure / visibility / descriptor / relation / reference reads、controlled-view get/find/save | each changed view直接保存final Ready / Partial + `ControlledConsumerViewAvailabilityChanged`capture same UoW;no Rebuilding / Unavailable intermediate save,no exposure / visibility save |
| Directory rebuild | resolve exact source chain fromscope;derive safe display/facets/source versions | `DirectorySearchBrowseProjection::{build_from_access_truth,refresh_from_access_truth}` + derived policy；`mark_rebuilding / mark_unavailable`reserved andnotcalled | registry / descriptor / exposure reads、derived get/find/save | each changed projection直接保存final Ready + `DerivedMaterialRefreshed`capture same UoW;no Rebuilding / Unavailable intermediate save,no registry create |
| Audit export | load exact trace / change refs,resolved optional audit refs,derive allowed summary/source versions | `AuditFriendlyExportSummary::{build_from_traceability,matches_preparation,refresh_from_traceability,attach_observability_ref,mark_*}` | trace/change/reference/state reads、derived find/get/save | exact complete match -> Unchanged；otherwise build or same-trace/scope refresh,then attach frozen resolved refs；each changed export + `DerivedMaterialRefreshed`capture same UoW;no raw audit handoff or evidence |
| Ecosystem discovery | load exact exposure + source-version-symmetric visibility + accepted consumer-safe descriptor/relation/reference surface,derive source versions andfinal state/reason | `FormalVisibilityApplicability::is_consumable_by`;`ReadOnlyEcosystemDiscoverySummary::{build_read_only_summary,refresh_from_exposure,mark_*}` | exposure / visibility / descriptor / relation / reference reads、derived find/get/save | each changed discovery + `DerivedMaterialRefreshed`capture same UoW;no exposure / visibility / listing write |
| Derived reconciliation | map broad truth / material scopes,load snapshots and exact materials,derive findings | `CapabilityReconciliationReport::{from_findings,failed}` | truth snapshot、material scan/read、report append | report + `DerivedMaterialRefreshed`capture same UoW;no automatic rebuild / command |
| Reference refresh | list typed refs/states,dispatchmatching body-free resolver,validate observation,apply policy transition | `ReferenceResolutionState::transition`;`mark_forbidden`requiresa Command/Consumer typed boundary marker andisnot synthesized bythis Job | external-ref / state list/get/save + seven matching resolver groups | each changed state + `ReferenceResolutionChanged`capture same UoW;no relation / exposure mutation |
| Event collaboration repair | exact load/scan capture + immutable snapshot or external intent status | `CapabilityEventCaptureRecord::bind_intent`only whenstable intent formed | event-capture get/list/bind + collaboration collaborate/get/list/repair | no outbound mapper rerun,no core truth / material write,no local delivery-state copy |

Construction failures:

- missing exact truth / material / reference target becomes a typedfailed target unless the entire request scope is invalid,which is`Rejected`beforejob body。
- when that missing / inapplicable target is already fully identified during complete planning,the journal uses`PreclassifiedFailure`at the same stable ordinal。The execution loop terminalizes it with`record_failed`in azero-business-effect UoW;it does not fabricate a success-capable plan、drop the target into`run_issues`or discard unrelated valid targets。
- source-owner / ref-version / state / safe-summary asymmetry is consistency failure,not`Unchanged`。No Job may choosecurrent-by-id fallback for an exact input ref。
- reference refresh encountering a registered ref withmissing canonical state orstate-id mismatch is aconsistency failure。It must not callan initial-state factory or use`CapabilityJobItemChange::Created`to repair the broken invariant。
- reference refresh planning exact-loads every registered ref andcurrent canonical state,requires subject/kind/state-id parity,andfreezesonlythe ref version + state ref。A current `Invalid / Forbidden` state isterminal for that candidate andbecomesa stable `Skipped` target withoutresolver invocation。For non-terminal current states,the target reconstructs the body-free candidate fromthe exact ref fields,requires its digest equalthe persisted candidate digest,dispatches the matching resolver,andcalls existing`transition(observation.value, observation.reason, ...)`for every accepted observation includinga newly observed`Invalid / Forbidden`。`mark_forbidden`remains reserved forCommand/Consumer input that carriesa typed`ForbiddenBodyReason`;the Job must not inventthat type froma generic resolver reason。
- reference refresh exact same value + same safe reason is`Unchanged`andformsno state save/capture；same value + changed safe reason isone updated state revision。Any actual revision must save canonical state、capture`ReferenceResolutionChanged`andrecordmatching journal success inthe same target UoW。The refresh Job doesnot runreference-dependent material stale propagation;formal Step 8 Job contract andHLD §7.6 ownonlycanonical state + event,andderived maintenance consumes theevent separately。
- collaboration repair maps public`CapabilityOutboundEventSourceRef / CapabilityCollaborationIntentRef`to application`CapabilityEventCaptureSourceRef / CapabilityEventCollaborationIntentRef`byexhaustive variant-preserving one-way copy。No enum display/debug text oropaque inner value isparsed。A local capture plan freezes exact capture ref、official source andoptional already-bound intent。
- for a local`Captured`target,the Job service forms candidate fromthe official snapshot,collaborates idempotently,validates source,andcommits`bind_intent`plusjournal success inone target UoW；it must not callthe source-continuation facade that commits its own short UoW。Foralready`IntentBound`,external`get`plusjournal-only success isrequired。Intent-only targets useexact`get`forCandidate/Delivered inspection and`repair`onlyforPendingDelivery/Failed/HandoffUnavailable；the external outcome isnot a local write andcannot be rolled back。
- reconciliation with sufficient inspected basis must append a visiblecompleted / partial / inconsistent / rebuild-required / failed domain report。If failure occurs before a valid non-empty basis exists,typed detail uses`reconciliation=None`andgeneric report recordsfailed targets;it must not fabricate a domain report。
- no-op target produces`CapabilityJobItemChange::Unchanged`,nochanged ref and nooutbound capture。It does not callClock / IdGenerator for a fake newrevision。
- audit-export no-op requires`matches_preparation(...) == true`,includingexact trace/scope、safe summary、source versions、stable saved resolved-ref order andthe expected final state/reason。`Ready / Partial / Unavailable` caneach beUnchanged whenall fields match。Any mismatch uses`refresh_from_traceability(...)`to clear old attachments andrestoreReady,then reattaches onlythe frozen resolved refs through`attach_observability_ref(...)`andapplies at mostone final degraded transition;typed item ids come onlyfromthe saved`ObservabilityAuditRefSet::iter()`order。
- a changed material / reference save that cannot also save its batch `8.5`outbound snapshot/capture rolls back that target UoW。External collaboration remainspost-commit and cannot roll backthe target。

Step 12 batch `12.6` adds the following safe-terminalization gate without changing any public schema or journal declaration:

| detection source | durable Job mapping allowed | forbidden downgrade |
|---|---|---|
| invalid trigger、job name、schema、metadata、body shape or request-wide scope before application body | `Rejected`, `report=None`;no Clock、scan、reservation or journal | issue-bearing empty journal、target row or runner retry inference |
| complete scope expansion fails before a complete target set,while one existing closed body-free issue and `StableFailure / RetryablePrerequisite` impact are both known | `targets=[]` plus the exact run issue in the initial UoW | preserving a prefix plan、using raw error text or treating empty plan as `Completed` |
| one exact target identity is known during complete planning and a normal missing / inapplicable / terminal boundary has an existing closed issue | same-ordinal `PreclassifiedFailure`;later zero-effect `record_failed`,or terminal-reference `record_skipped` where the card says skip | fake success-capable plan、collapse to run issue or silent drop |
| target-specific domain / prerequisite / external dependency failure after planning | only after confirmed zero business effect or confirmed rollback,exact reload may record `Failed / Skipped` in a separate journal-only UoW | writing terminal outcome before rollback confirmation or after commit outcome becomes unknown |
| loaded owner/id/version/union/state-id/source chain、capture/snapshot、journal/reservation or stored-report relation is asymmetric | exact `ApplicationError::ConsistencyDefect`;target remains `Planned`,or no initial journal if detected during planning | `PreclassifiedFailure`、`Failed / Retryable` report、normal missing、current-owner fallback or auto-repair |
| journal plan/success variant、ordinal、all-terminal guard or pure assembler output is impossible | `TechnicalInvariantViolation / ConsistencyDefect` according to the exact subject;no final report commit | skip row、partial prefix、generic response reconstruction |
| codec failure、rollback failure、commit outcome unknown、invalid/unclassified Port return or journal/final-store control-plane failure | preserve exact `ApplicationError`;do not terminalize the target | generic `DependencyFailure` target、stable/retryable impact guessed from wrapper or raw source |

Only external target calls with a valid exact target and a closed safe failure class may map `PortFailure` into a journal issue after zero-effect proof:`TemporarilyUnavailable / Timeout -> DependencyFailure + RetryablePrerequisite`;`NotConfigured / PermanentlyRejected -> DependencyFailure + StableFailure`。`InvalidTypedResponse / UnexpectedSourceFailure`,repository/UoW failures and every persisted/returned asymmetry stay as `ApplicationError`。An optimistic target conflict may become`OptimisticConflict + RetryablePrerequisite`only after confirmed rollback and exact journal reload；uniqueness-winner handling remains Step 13-owned and cannot be guessed inthis Step。

Reconciliation report state has one deterministic issue/impact mapping;the assembler never parses`ReconciliationFailureReason`or finding text:

| persisted report state | required journal run issue | outer disposition consequence |
|---|---|---|
| `Completed` | none | success contributes to `Completed` |
| `Partial` | `PartialSurface + StableFailure` | report success remains typed detail；outer result is `PartiallyCompleted` |
| `Inconsistent` | `StaleSource + Advisory` | report success remains completed unless another blocking outcome exists |
| `RebuildRequired` | `StaleSource + Advisory` | report is a hint only；no nested rebuild |
| `Failed` | `MaterialUnavailable + StableFailure` | special assembler rule yields outer `Failed` before generic mixed-success precedence |

### 11.7 Idempotency, disposition and stored report contract

| gate | exact rule |
|---|---|
| normalized key | closedjob name + core`JobRunId` + request`IdempotencyKey`;run id、result id、trace id andbusiness refs remain distinct |
| canonical digest | schema version + normalized concretebody。Typed ref / kind vectors are validatedduplicate-free and canonicalized by typed identity beforedigest;actor、trace、run id、transport metadata、repository cursor、current state andgenerated ids are excluded |
| fresh reserve | valid metadata / schema / body andnon-empty scopes pass before`CapabilityIdempotencyRepository::reserve_if_absent` |
| completed duplicate | same operation / normalized key / digest只调用`StoredCapabilityResultRepository::get_job_report`,校验shell / surface / operation / union variant / closed job name / stored schema version / run id / result ref对称,返回original refs / states / issues并仅在当前response把disposition映射为`DuplicateReplayed`;不得自行选择decoder,不得scan、resolve、rebuild、reconcile、collaborate或generate ids |
| conflict | same normalized key withdifferent operation / digest returnsrejected conflict surface;stored report unchanged |
| missing / corrupt replay | completed reservation缺JobReport shell / surface / typed envelope,wrong union variant / schema / run id / result ref或generic/detail asymmetry返回consistency error;never rerunsjob |
| retryable | fresh temporary failure may store`Retryable`report。The samerun/key only replays it;an actualretry requires a newvalidatedrun id / idempotency key,without fixed delay/count inthisStep |

Disposition rules:

| disposition | condition | report | storage |
|---|---|---|---|
| `Completed` | all declared targets completed / unchanged andno blocking issue | `Some`typed detail | complete idempotency + typed `save_job_report` |
| `PartiallyCompleted` | at least one target completed / unchanged andat least one failed / skipped | `Some`with exact mixed detail / target issues | typed `save_job_report`;duplicate never retriesfailed items |
| `Failed` | no declared target completed,or reconciliation produced explicit failed report | `Some`;domain report optional pervalid basis | typed `save_job_report`;complete and replayable |
| `Retryable` | temporary prerequisite / resolver / collaboration unavailability preventedstable completion | `Some`with redacted issues | typed `save_job_report`;new run required toretry |
| `DuplicateReplayed` | completed same request loaded | originalstored typed report | no write / external call |
| `Rejected` | metadata/schema/name/body/scope invalid beforebody run | `None` | no completed JobReport;conflict handling remainsStep 13 |

Audit / security rules:

- report storesactor / trace throughstored result metadata anddomain object fields where declared;it does not inventevidence alias、test result、acceptance signature、approval orruntime execution record。
- issue refs are redacted and stable。No raw resolver error、audit body、search index row、secret、method / governance body、serialized event bytes ortransport response enterspublic report。
- report vectors preserve stable declared / scan order and rejectduplicates。Counters,if later needed forobservability,are derived fromtyped vectors andmust not become a secondresult truth inthisStep。

### 11.8 Independent Operations Job protocol cards

#### 11.8.1 `RunCapabilityRegistryReconciliation`

| 项 | exact contract |
|---|---|
| purpose | Compare registry-centered committed truth with derived materials and append a body-free report;never create / update / retire registry truth |
| trigger | `capability-hub.job.run-capability-registry-reconciliation.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::run_capability_registry_reconciliation` -> `CapabilityOperationsJobService::run_capability_registry_reconciliation` |
| request / response | `CapabilityJobRequest<RunCapabilityRegistryReconciliationJobInput>` -> `CapabilityJobResponse<CapabilityRegistryReconciliationJobResult>` |
| source / object | registry-centeredtruth snapshot + material scan -> optional`CapabilityReconciliationJobReportView` |
| Port boundary | truth snapshot、registry/change/material reads、report append、event capture、idempotency / stored result、UoW / clock / id |
| failure / partial | missing individual source may producepartial / failed report whenbasis remainsvalid;invalid broad scope isRejected;no automaticCommand orregistry write |
| outbound | only a persisted report maps to`DerivedMaterialRefreshed`;never`CapabilityRegistryChanged` |
| Step 9 flow | `job_run_capability_registry_reconciliation_flow` |

#### 11.8.2 `RefreshControlledConsumerView`

| 项 | exact contract |
|---|---|
| purpose | Build / refresh consumer-safe views for one exact exposure withoutchanging formal exposure orruntime cache |
| trigger | `capability-hub.job.refresh-controlled-consumer-view.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::refresh_controlled_consumer_view` -> `CapabilityOperationsJobService::refresh_controlled_consumer_view` |
| request / response | `CapabilityJobRequest<RefreshControlledConsumerViewJobInput>` -> `CapabilityJobResponse<ControlledConsumerViewRefreshJobResult>` |
| source / object | exact exposure、structured descriptor safe surface（body-free summary + closed typed optional gaps）、consumer refs、source versions -> `ControlledConsumerView`;empty gap set selectsReady,non-empty policy-allowed set selectsPartial |
| Port boundary | exposure / visibility / descriptor / relation / reference reads、controlled-view get/find/list/save、event capture、common job replay ports |
| failure / partial | inapplicable / unresolved consumer isfailed target;missing current view may becreated only forExplicitConsumers;one target failure does not rewriteexposure |
| outbound | each created / updatedview forms`ControlledConsumerViewAvailabilityChanged`;unchanged view formsnoevent |
| Step 9 flow | `job_refresh_controlled_consumer_view_flow` |

The current Job never persists `Rebuilding` or `Unavailable`。An identified invalid / required-source-missing target fails withoutmaterial mutation；a valid changed target calls`build / refresh_from_exposure`once andsaves onlythe finalReady / Partial revision。The existing `mark_rebuilding / mark_unavailable`members remainphase-reserved andmust havezero calls inthis protocol。

#### 11.8.3 `RebuildDirectorySearchBrowseProjection`

| 项 | exact contract |
|---|---|
| purpose | Rebuild read-only directory search / browse projections fromaccepted source chains;never backfill registry truth |
| trigger | `capability-hub.job.rebuild-directory-search-browse-projection.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::rebuild_directory_search_browse_projection` -> `CapabilityOperationsJobService::rebuild_directory_search_browse_projection` |
| request / response | `CapabilityJobRequest<RebuildDirectorySearchBrowseProjectionJobInput>` -> `CapabilityJobResponse<DirectorySearchBrowseProjectionRebuildJobResult>` |
| source / object | exact registry / descriptor / exposure refs -> `DirectorySearchBrowseProjection`safe display / facets / source versions |
| Port boundary | registry / descriptor / exposure reads、derived get/find/save、event capture、common job replay ports |
| failure / partial | normally absent / unresolved / retired prerequisite withanexact safe target isfailed target；loaded owner/id/version/source-chain asymmetry is`ConsistencyDefect`andremains`Planned`;no provider lookup、listing fallback orregistry creation |
| outbound | each created / updatedprojection forms`DerivedMaterialRefreshed`;unchanged formsnoevent |
| Step 9 flow | `job_rebuild_directory_search_browse_projection_flow` |

The current Job never persists a`Rebuilding`or`Unavailable`intermediate revision。A changed existing projection calls`refresh_from_access_truth`andstages onlyfinalReady withits event capture andjournal outcome；reserved degradation members cannot beused to inventa failure material orsecond target UoW。

#### 11.8.4 `PrepareAuditFriendlyExportSummary`

| 项 | exact contract |
|---|---|
| purpose | Prepare allowed body-free audit summaries fromexact trace revisions withoutcopying observability / audit store |
| trigger | `capability-hub.job.prepare-audit-friendly-export-summary.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::prepare_audit_friendly_export_summary` -> `CapabilityOperationsJobService::prepare_audit_friendly_export_summary` |
| request / response | `CapabilityJobRequest<PrepareAuditFriendlyExportSummaryJobInput>` -> `CapabilityJobResponse<AuditFriendlyExportPreparationJobResult>` |
| source / object | trace / change refs + safe export scope + resolved optional audit refs -> `AuditFriendlyExportSummary` |
| Port boundary | trace/change/reference/state reads、derived find/get/save、event capture、common job replay ports;no raw audit handoff required |
| failure / partial | unresolved optional audit ref may yieldpartial / unavailable material bypolicy;forbidden body isfailed / rejected andnever persisted |
| outbound | each created / updatedexport forms`DerivedMaterialRefreshed`;no evidence alias、sign-off orraw export payload |
| Step 9 flow | `job_prepare_audit_friendly_export_summary_flow` |

An existing target is never rebuilt with the initial factory and never keeps attachments absent from the frozen plan。It exact-loads the planned export revision,requires the same trace / scope identity,uses `matches_preparation(...)` for the only `Unchanged` branch,and otherwise calls `refresh_from_traceability(...)` before reattaching the frozen resolved pairs in plan order。A normally absent declared audit ref may form a failed trace target；a registered ref missing its mandatory canonical state,or any loaded wrong-version / wrong-union / wrong-owner pair,is`ConsistencyDefect`andkeeps thetarget`Planned`。Neither branch is silently omitted or replaced by a current lookup。

Canonical audit-reference outcome mapping is closed andevaluated overthe frozen exact ref/state plans beforematerial mutation:

| Frozen canonical values | Final export outcome |
|---|---|
| any `Invalid` or `Forbidden` | target `Failed(PolicyRejected + StableFailure)`;no export create/update/capture |
| otherwise any `Unavailable` | attach onlyResolved refs,then `mark_unavailable(resolution_reason.to_audit_export_gap_reason())` using the first unavailable plan in stable order |
| otherwise any `Unresolved / Stale / Expired` | attach onlyResolved refs,then `mark_partial(...)` using the first degraded plan in stable order |
| all `Resolved`,includingzero requested audit refs | `Ready`;attach resolved refs in request order;no degraded reason |

Onlyone final degraded transition is allowed per target。Later degraded refs remain represented bytheir absence fromthe saved resolved-ref set andthe stable first matching safe reason;raw errors / bodies are never concatenated。The exact mapping is repeated byStep 9 andlater state/error tests;adapter policy cannot reorder oroverride it。

#### 11.8.5 `RebuildReadOnlyEcosystemDiscoverySummary`

| 项 | exact contract |
|---|---|
| purpose | Rebuild read-only ecosystem discovery summaries withoutcreating marketplace listing / pricing / transaction truth |
| trigger | `capability-hub.job.rebuild-read-only-ecosystem-discovery-summary.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::rebuild_read_only_ecosystem_discovery_summary` -> `CapabilityOperationsJobService::rebuild_read_only_ecosystem_discovery_summary` |
| request / response | `CapabilityJobRequest<RebuildReadOnlyEcosystemDiscoverySummaryJobInput>` -> `CapabilityJobResponse<ReadOnlyEcosystemDiscoveryRebuildJobResult>` |
| source / object | exact exposure + source-version-symmetric formal visibility + ecosystem context + consumer-safe descriptor summary -> `ReadOnlyEcosystemDiscoverySummary` |
| Port boundary | exposure / visibility / descriptor / relation / reference reads、derived get/find/save、event capture、common replay ports |
| failure / partial | unavailable optional source yields explicitpartial / unavailable material whenpolicy allows;never queriesmarketplace orwriteslisting |
| outbound | each created / updateddiscovery forms`DerivedMaterialRefreshed`;unchanged formsnoevent |
| Step 9 flow | `job_rebuild_read_only_ecosystem_discovery_summary_flow` |

#### 11.8.6 `RunDerivedMaterialReconciliation`

| 项 | exact contract |
|---|---|
| purpose | Compare rebuildable materials with committed truth and append findings withoutautomatic rebuild ortruth repair |
| trigger | `capability-hub.job.run-derived-material-reconciliation.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::run_derived_material_reconciliation` -> `CapabilityOperationsJobService::run_derived_material_reconciliation` |
| request / response | `CapabilityJobRequest<RunDerivedMaterialReconciliationJobInput>` -> `CapabilityJobResponse<DerivedMaterialReconciliationJobResult>` |
| source / object | declaredtruth snapshot + broad material scan -> optional`CapabilityReconciliationJobReportView` |
| Port boundary | truth snapshot、material scan / exact reads、report append、event capture、common job replay ports |
| failure / partial | inconsistent / rebuild-required isreport state,not implicit execution;invalid / emptybasis cannot fabricate report;follow-up requiresseparateJob / Command |
| outbound | persisted report forms`DerivedMaterialRefreshed`only;report finding does not invokeanotherJob |
| Step 9 flow | `job_run_derived_material_reconciliation_flow` |

#### 11.8.7 `RefreshExternalReferenceResolution`

| 项 | exact contract |
|---|---|
| purpose | Refresh canonical reference states throughkind-matched body-free resolvers;never create core truth orcopyexternal body |
| trigger | `capability-hub.job.refresh-external-reference-resolution.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::refresh_external_reference_resolution` -> `CapabilityOperationsJobService::refresh_external_reference_resolution` |
| request / response | `CapabilityJobRequest<RefreshExternalReferenceResolutionJobInput>` -> `CapabilityJobResponse<ExternalReferenceResolutionRefreshJobResult>` |
| source / object | typed ref + current canonical state + matching resolver observation -> `ReferenceResolutionState`transition / unchanged |
| Port boundary | external-ref/state scan / get / save、seven resolver families、event capture、common replay ports |
| failure / partial | temporary resolver unavailable may produceRetryable / partial;forbidden / invalid usespolicy-approved explicit state andno external body;does not mutateseam / relation / exposure |
| outbound | each updated state forms`ReferenceResolutionChanged`;unchanged formsnoevent;Created is invalid for this refresh Job |
| Step 9 flow | `job_refresh_external_reference_resolution_flow` |

Exact branch closure:

- `ExplicitSubjects`preserves validated request order；`NonResolved / AllReferences`page the reference repository toexhaustion andfilter bythe non-empty typed kind set。Each selected subject appears once andmust haveone exact current state id。
- current`Invalid / Forbidden`is a stable terminal skip for that candidate,not aresolver call、success item orinitial-state repair。A resolver may returnnew`Invalid / Forbidden`for a non-terminal current state;aftersubject/kind/digest validation it usesexisting`transition`withthe observation's body-free reason。
- resolver`ApplicationError`that hasno typed stable outcome rolls backthe current target andis terminalized onlythroughStep 12 safe stable/retryable classification。No HTTP status/error text entersstate orreport。
- updated state save、complete reference event snapshot/capture andjournal `Succeeded(ReferenceResolution)`areone target UoW。Unchanged usesa journal-only target UoW。No dependent material ismarked stale inthis Job;the `ReferenceResolutionChanged`consumer/maintenance path remainsseparate。

#### 11.8.8 `RepairCapabilityAccessEventCollaboration`

| 项 | exact contract |
|---|---|
| purpose | Recover pre-intent local captures and repairpending / failed / unavailable external intents withoutrebuildingevent bytes orrolling backtruth |
| trigger | `capability-hub.job.repair-capability-access-event-collaboration.v1`;schema`1` |
| handler / service | `CapabilityOperationsJobHandlers::repair_capability_access_event_collaboration` -> `CapabilityOperationsJobService::repair_capability_access_event_collaboration` |
| request / response | `CapabilityJobRequest<RepairCapabilityAccessEventCollaborationJobInput>` -> `CapabilityJobResponse<CapabilityAccessEventCollaborationRepairJobResult>` |
| source / object | official capture + immutable snapshot,or external intent item -> stable intent binding / external typed status |
| Port boundary | event-capture exact get / awaiting scan / bind + collaboration collaborate/get/list/repair + common replay ports |
| failure / partial | missing / mismatched snapshot isconsistency failure;external failure remainsstatus / issue;local bind failure leavescaptureAwaitingIntent andscan-visible |
| outbound | no newOutbound Event is formed byrepair;it reuses exact storedbytes andnever reruns§10 mapper |
| Step 9 flow | `job_repair_capability_access_event_collaboration_flow` |

Exact branch closure:

- capture scopes plan`EventCapture { capture_ref,source_ref,existing_intent_ref }`fromofficial capture/snapshot joins。`Captured + None`usesstored candidate -> external`collaborate`；afterexact source validation,the capture object bind andjournal success shareone target UoW。`IntentBound + Some`usesexternal`get`andjournal-only success；the plan forbidsa second bind。
- intent/source/repairable scopes plan`CollaborationIntent { intent_ref,source_ref }`fromexternal typed items。`Candidate / Delivered`are inspected with`get`andneverrepaired；`PendingDelivery / Failed / HandoffUnavailable`call`repair`onthat same intent。Every item/outcome must echoexact intent/source。
- `CapabilityEventCollaborationService::collaborate_captured_event`isnot called bya Job target becauseits independent bind UoW would splitlocal binding fromthe durable target outcome。The Job reusesthe same declared repository/candidate/Port/object calls inline underits target UoW。
- `Failed / HandoffUnavailable`witha typed outcome is a successfully inspected/repaired item andmay carrya redacted public issue ref mapped byStep 12；an untyped`ApplicationError`is a failed/retryable target,not anitem inferred fromerror text。No newcapture/snapshot/event、local delivery status ortruth rollback isallowed。

### 11.9 Operations Job protocol family stop-review

| 审查项 | expected | evidence / result |
|---|---:|---|
| independent Job input structs | 8 | §11.2 one input per HLD Job;pass |
| typed Job result structs | 8 | §11.3 one top-level detail per Job;support item / view types are separately closed;pass |
| runner handler callables | 8 | §11.4 one method per Job;pass |
| application service callables | 8 | §11.4 one method per Job;pass |
| logical trigger rows | 8 | §11.5 all unique andversioned v1;pass |
| independent protocol cards | 8 | §11.8.1~§11.8.8;pass |
| unique Step 9 flows | 8 | one event-specific Job flow per card;pass |
| DTO -> object / Port construction | mandatory | §11.1、§11.6 exact scope mapping and object factories;pass |
| typed duplicate replay | mandatory | `save_job_report / get_job_report`保存并恢复8-variant concrete response;job-name / schema / run / result / surface symmetry与no-rerun在§6.8 / §11.7闭合;pass after Step 7 `7.R2` reopen |
| no core-truth repair | mandatory | no Job has identity / registry / descriptor / seam / method / exposure save or mutation shortcut;pass |
| outbound durability | mandatory | changed material / reference + batch `8.5`snapshot/capture same target UoW;repair stored-snapshot-only;pass |
| Rustdoc | mandatory | all new public structs、enum、fields、variants、variant payloads、traits andmethods have English`///`;pass |
| forbidden artifacts | zero | no scheduler product、retry number、real run id、test result、evidence alias、acceptance signature、topic / relay / attempt state;pass |
| upstream blocker | zero unresolved | HLD pending-event-ref shorthand isclosed bydurable capture refs;current Step 6 / 7 ports supportall scopes;pass |

Batch `8.6` status is`completed_wait_user_review`。The Operations Job family now has eight field-level inputs、eight typed result details、eight runner handlers、eight application callables、eight closed logical triggers、eight independent protocol cards and eight unique Step 9 flows。No unresolved upstream blocker remains forbatch `8.7` cross-protocol closure audit。

This stop-review does not enter§12~§16,does not modify formal`03-详细设计.md`,does not create an implementation ledger / planned boundary skeleton,and does not fabricate implementation commit、run_id、test result、evidence alias or acceptance signature。

## 12. 跨协议闭环审计

### 12.1 协议全集与入口覆盖审计

以下统计以每张独立协议卡中的 `Step 9 flow` 行为唯一权威来源。§7~§11 中用于解释通用编排的 `command_*_flow`、`query_*_flow`、`inbound_consume_*_flow` 族级占位不计为额外入口或额外 flow。

| 协议族 | HLD inventory | 字段级 schema / 独立卡 | entry handler / producer | application callable / mapper | 唯一 route / logical name / trigger | 唯一 Step 9 flow | 结论 |
|---|---:|---:|---:|---:|---:|---:|---|
| Command | 26 | 26 / 26 | 26 | 26 | 26 HTTP routes | 26 | pass |
| Query | 33 | 33 / 33 | 33 | 33 | 33 HTTP routes | 33 | pass |
| Inbound Event Consumer | 6 | 6 / 6 | 6 | 6 | 6 logical inbound events | 6 | pass |
| Outbound Event | 10 | 10 / 10 | 10 source-specific mappings | 10 mapper / capture callables | 10 logical outbound events | 10 | pass |
| Operations Job | 8 | 8 / 8 | 8 | 8 | 8 logical triggers | 8 | pass |
| **合计** | **83** | **83 / 83** | **83** | **83** | **83** | **83** | **closed** |

审计规则:

- 26 Command 与33 Query route均是closed `POST /v1/capability-hub/{commands|queries}/{operation}` mapping；不存在generic execute、任意字符串dispatch或同一路由映射两个protocol name。
- 6 Inbound logical event、10 Outbound logical event与8 Job trigger均带schema version `v1`，且name + version只映射一个typed payload / input / output；physical topic、consumer group、scheduler与deployment binding仍不在本Step。
- 83张卡均有exact caller / producer、handler / service、schema、对象 / Port来源、错误 / visibility / disposition、幂等或no-write规则及唯一flow。没有HLD入口被Port、adapter或generic facade替代。

### 12.2 Public secondary type owner / Rustdoc审计

| 审计项 | 机械结果 | owner / gate |
|---|---:|---|
| Step 8 `pub struct` / `pub enum` | 250 | 原249个carrier + Step 12 batch `12.3`新增1个closed `CapabilityIssueCode`;只归`contracts::shared / command / query / event / job` |
| type-level English `///`缺失 | 0 | 每个public struct / enum均有用途注释 |
| public field English `///`缺失 | 0 | tuple field、named field、generic carrier field均覆盖 |
| enum variant / variant payload English `///`缺失 | 0 | payload语义与variant边界均覆盖 |
| public trait / method Rustdoc缺失 | 0 | handler、service、mapper / capture callable均覆盖 |

二级类型归属规则:

- protocol name、schema version、result ref、validation issue、public page、query surface、event / Job common carrier归`contracts::shared`或对应协议族；不得下沉到domain或application后再被public DTO反向引用。
- identity、registry、descriptor、relation、exposure、trace、derived与reference的public view/ref/state由本Step显式定义或从Step 6 contracts-shared类型复用；domain-only object、`Loaded<T>`、repository cursor、UoW、capture helper与adapter outcome不得进入public字段。
- Step 7 `CapabilityConsumerReceiptEnvelope`、`CapabilityStoredJobResponse`、`CapabilityStoredJobReportEnvelope`、repository page / scan / capture helper均为application-local replay / callable carrier，不是第二份public schema或business truth。
- `CapabilityStoredJobResponse`的8个variant与8个`CapabilityJobResponse<T>`一一绑定；新增Job必须先扩展closed union、schema、repository parity与Step 9 flow，不能由adapter用type name或bytes猜decoder。
- `CapabilityIssueCode`的51个variant、51个fixed literal和issue-ref/set全部归`contracts::shared`;application / api / worker / jobs只穷尽映射,不得平行定义code、公开tuple inner field或生成随机/hashed ref。

### 12.3 Metadata authority / protocol identity审计

| channel | 唯一metadata authority | body禁止重复 | identity symmetry |
|---|---|---|---|
| Command | `ActorContext + CommandMetadata` | actor、trace、idempotency、request time、expected version | route name = operation name = stored result operation |
| Query | `ActorContext + QueryMetadata` | actor、trace、idempotency与write metadata | route name = operation name；不创建stored result |
| Inbound | `CapabilityInboundEventEnvelope<T>` | source actor / family / event ref、trace、idempotency、occurred time、schema | logical event = consumer name = operation；payload不复制envelope authority |
| Outbound | committed exact source + mapper | caller-supplied source version、post-commit time、transport destination | event name + schema + source = snapshot / capture schema identity |
| Job | `CapabilityJobMetadata` | actor、run id、trace、idempotency、schema | trigger = job name = operation = typed stored variant |

`ActorContext`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`JobRunId`、`Timestamp`、`TraceId`和`Version`继续复用`core-contracts`。本Step没有复制本地替代类型，也没有声称真实run id或transport metadata已存在。

### 12.4 DTO -> object / Port构造闭环审计

| 协议族 | Step 6 object / helper closure | Step 7 callable closure | 缺失 / mismatch行为 | 结论 |
|---|---|---|---|---|
| Command | request字段、system-generated id/time、loaded expected version、exact change / trace factory均有来源 | truth / relation / reference、change / trace、UoW、idempotency / stored result完整 | reject或consistency error；不得补id、猜current owner或省略change record | pass |
| Query | selector / scope映射到read subject、repository key与field-level view | resolver-first single / page读取、typed repository page与public page mapper完整 | visible missing / NotVisible / degraded / repository error分离 | pass |
| Inbound | envelope + typed payload映射body-free reference observation、state / impact effect与typed receipt | matching resolver、state / impact repository、typed receipt save/get完整 | unsupported / delayed / rejected / quarantined显式；不得读owner body | pass |
| Outbound | accepted exact source映射typed payload、complete envelope snapshot与capture | source-owning UoW + event-capture repository + external collaboration完整 | source/snapshot/capture mismatch rollback；post-commit missing snapshot consistency error | pass |
| Job | 8 input映射typed scope、material / report / state / capture helper与8 typed result detail | truth/material/report/reference/capture/collaboration及typed Job save/get完整 | invalid scope reject；per-target failure显式；duplicate不扫描或重建 | pass after Step 7 `7.R2` |

跨对象Command已反查`registry_entry_ref`、change record id / trace / reason / exact kind、safe reason bridge、reference effect refs与secret safe-summary双history；当前没有必填对象字段留给实现者从route、error text或current truth猜测。

### 12.5 Query page / visibility闭环审计

| 审计项 | 结论 | exact rule |
|---|---|---|
| public / repository page分离 | pass | public cursor只经scope-bound mapper转换；repository cursor格式不泄漏 |
| page-level resolver-first | pass | 10个paged Query在repository读取前取得collection-level visibility seed |
| visible empty | pass | `Visible + items=[] + cursor=None`，不伪装missing / degraded |
| NotVisible | pass | 不读body repository，返回empty / no cursor且不泄漏subject |
| degraded / freshness | pass | 只从resolver或persisted formal marker映射，不按timestamp / error text猜测 |
| reconciliation nested page | pass | Scope selector仍使用同一public page contract，cursor绑定query + exact reconciliation scope |

### 12.6 Write-channel replay闭环审计

| channel | fresh storage | duplicate read | duplicate禁止事项 | 结论 |
|---|---|---|---|---|
| Command | immutable shell + complete serialized command response / rejection | generic exact shell / surface；transport可直接回放byte-semantics等价body | domain mutation、current truth重算、new result id、第二event capture | pass |
| Inbound Consumer | shell + surface + `CapabilityConsumerReceiptEnvelope`同一UoW | `get_consumer_receipt`恢复完整effect / follow-up refs | resolver、factory、Clock / Id、write repository、placeholder decode | pass |
| Operations Job | shell + surface + `CapabilityStoredJobReportEnvelope`同一UoW | `get_job_report`恢复8-variant typed response，仅当前response标记`DuplicateReplayed` | generic decoder、report-by-run反查、scope scan、rebuild、resolver、handoff、collaboration | pass after `CH-DDD-S7-JOB-REPLAY-001` |

三类duplicate均保持original result ref、operation、schema与fresh result detail。missing shell / surface / typed envelope、digest mismatch、wrong kind / variant / schema / run id均为consistency failure；任何路径都不得用rerun“修复”stored replay。

### 12.7 Outbound durability / owner boundary审计

| 审计项 | 结论 | closed boundary |
|---|---|---|
| exact source | pass | 10类event只接受§10 closed committed source；registry reconciliation report不能形成registry-changed |
| local atomicity | pass | source + serialized complete envelope snapshot + initial capture同一local UoW |
| post-commit collaboration | pass | 只从official stored snapshot形成candidate；stable intent在独立短UoW绑定 |
| repair | pass | 可扫描`Captured`或读取external intent；不重跑mapper、不回查current truth、不新建event |
| delivery owner | pass | pending / delivered / failed / unavailable仍归external collaboration port；local capture只`Captured -> IntentBound` |
| product neutrality | pass | 无outbox / relay产品、topic、attempt log、retry counter、scheduler或第二hidden queue |

### 12.8 Body-free phase boundary审计

| 边界 | public / callable允许 | 明确禁止 | 结论 |
|---|---|---|---|
| governance / policy | result ref、safe summary、seam relation、canonical resolution | approval、Policy / shared_rules truth、decision body | pass |
| method-library | method asset ref、body-free relation、resolution state | method body、lifecycle mutation、path/source dependency | pass |
| secret / document | opaque ref、locator / safe summary、resolution state | secret value、KMS / Vault body、external document body | pass |
| runtime / tools | consumer ref、formal exposure、controlled view、impact ref | invocation、tool result、allow-deny enforcement、route / quota / cost | pass |
| SDK | consumer ref、exposure boundary、controlled view | SDK client / package / generated binding / cache | pass |
| marketplace / ecosystem | read-only discovery summary | listing / pricing / transaction / fulfillment truth | pass |
| observability / audit | body-free ref、safe handoff / trace summary | raw log / metric / span / audit body、evidence alias、签署 | pass |

### 12.9 Protocol-to-flow与前序回开结论

| 审计项 | 预期 | 实际 | 结论 |
|---|---:|---:|---|
| protocol card -> unique Step 9 flow | 83 | 83 | pass |
| orphan flow name | 0 | 0 | pass |
| duplicate flow name | 0 | 0 | pass |
| protocol missing object / Port source | 0 | 0 | pass |
| unresolved Step 6 / 7 reopen | 0 | 0 | pass |

Batch `8.7`反查只触发并关闭`CH-DDD-S7-JOB-REPLAY-001`：Step 7在既有`StoredCapabilityResultRepository`上增加typed Job save/get及application-local 8-variant envelope，Port总数保持35，Step 6的43个HLD object与6个application technical helper不变。当前不存在阻塞Step 8完成或进入Step 9的上游blocker。

## 13. Historical Material Audit

### 13.1 来源冲突处理

| material | 冲突 / 污染 | 当前处理 | 结果 |
|---|---|---|---|
| 旧README与旧正式`03` | 以provider contract、decision、cost、KMS、QueryCapabilities、policy refresh、execution gateway为主线 | 仅作`historical_material`；没有复用旧schema、route、service、repository、state或flow | isolated |
| 旧正式`05/06` | 旧测试 / 验收主语与旧边界绑定，可能诱导伪造结果或签署 | 本Step不读取其结果为协议事实；留后续正式`05/06` full-restart重建 | isolated |
| 正式`02` Outbound source简写 | 曾写“registry Command / reconciliation result”可形成`CapabilityRegistryChanged`，与no-core-truth-repair冲突 | 记录为`CH-DDD-OUTBOUND-SOURCE-001`并按exact object裁决：仅committed `RegistryChangeRecord`可形成该event；reconciliation只形成`DerivedMaterialRefreshed` | resolved, not inherited |
| restart前Step 8 / 9材料 | 不符合当前逐Step停审与新版上游基线 | 当前Step 8已原位重建为active baseline；旧版本不作为恢复点 | isolated |
| 旧实现 / adapter线索 | concrete outbox、relay、provider lookup、secret store、runtime gateway可能反向定义协议 | 未继承产品、topic、retry、attempt、provider/runtime body或private state | isolated |

### 13.2 旧主语污染审计

| historical subject | 当前替代边界 | Step 8中不存在的surface |
|---|---|---|
| `ProviderContract` / provider route | capability identity + registry + adapter descriptor + external source ref | provider contract API、route / failover / health DTO |
| `CapabilityDecision` / allow-deny | governance seam + formal exposure + controlled view | runtime authorization / enforcement result |
| `CostRecord` / quota | 不属于本仓 | cost、billing、quota、usage ledger schema |
| KMS / Vault / secret envelope | secret opaque ref + safe summary | secret body、credential、KMS operation |
| `QueryCapabilities` runtime cache | truth Query + controlled view + read-only directory projection | runtime cache refresh / provider availability query |
| governance policy refresh | result ref resolver + body-free seam | approval、Policy / shared_rules下发或刷新 |
| runtime / tools execution gateway | consumer ref + formal exposure + impact collaboration | invoke / execute / tool-result / runtime state |
| marketplace listing | read-only ecosystem discovery summary | listing、pricing、transaction、fulfillment |
| business outbox / relay | immutable payload snapshot + local capture prerequisite | topic、attempt log、delivery retry state、second queue |

Historical audit结论为`pass`。旧正式文档、README和实现线索没有被当作当前协议真相源；唯一当前上游简写冲突已登记、裁决并禁止在Step 9恢复。

## 14. 正式文档回填草稿

本节只供Step 19装配正式`03-详细设计.md`使用。当前不修改正式文档，正式正文只收录已收稳契约与索引，不复制本文件的过程诊断、批次停审或historical-material明细。

### 14.1 正式 §6 全局 API / Protocol索引回填

正式索引按以下五族逐项列83个protocol，不得只列generic envelope或service trait:

| 协议族 | 数量 | public owner | entry / producer | application owner | 本Step定义 | Step 9位置 |
|---|---:|---|---|---|---|---|
| Command | 26 | `contracts::command` | `api` | command service family | 本文件§7 | 26个`command_*_flow` |
| Query | 33 | `contracts::query` | `api` | query service family | 本文件§8 | 33个`query_*_flow` |
| Inbound Event Consumer | 6 | `contracts::event` | `worker::consumers` | consumer service | 本文件§9 | 6个`inbound_consume_*_flow` |
| Outbound Event | 10 | `contracts::event` | source-owning application service | event mapper / capture service + collaboration facade | 本文件§10 | 10个`outbound_*_capture_and_collaborate_flow` |
| Operations Job | 8 | `contracts::job` | `jobs` | operations job service | 本文件§11 | 8个`job_*_flow` |

每个正式索引行必须包含protocol name、类别、所属module、route / logical event / trigger、本文件独立协议卡位置与Step 9 flow name。索引不得新增协议、alias route、physical topic或generic execute flow。

### 14.2 正式 §7.1 Shared protocol contract回填

正式正文应收录并引用本文件§6:

- 五类closed protocol name、positive schema version、public result / surface / validation issue ref。
- `CapabilityCommandRequest<T>` / outcome / rejection、`CapabilityQueryRequest<T>` / single / page surface、Inbound envelope / receipt、Outbound envelope与Job request / typed response common carrier。
- metadata authority矩阵：body不得重复actor、trace、idempotency、run、source-event或schema authority。
- public page与Step 7 repository page的单向opaque mapper、scope binding、visible item count与`has_more`规则。
- Command / Consumer / Job stored replay分类；Job使用Step 7 8-variant typed envelope，不允许generic decoder。
- public contracts只依赖core-contracts与contracts shared；domain / application / infra carrier不得反向泄漏。

### 14.3 正式 §7.2 Command protocol回填

从本文件§7回填:

- 26个request / result schema、26个handler、26个application callable与26个closed HTTP route。
- 每个Command独立协议卡中的用途、exact field source、target object / factory / member、required Port、错误 / 幂等 / 审计与Step 9 flow。
- accepted mutation的change / trace / impact / reference effect构造，loaded expected version来源，以及source + outbound snapshot / capture same-UoW门禁。
- descriptor replacement / exposure mutation exact registry ref、safe reason bridge、secret safe-summary双history与reference effect refs等已回开结论。
- duplicate只恢复stored original command surface；不得重跑mutation、创建第二result或第二event capture。

### 14.4 正式 §7.3 Query protocol回填

从本文件§8回填:

- 33个request与field-level view / page / union body schema、33个handler、33个application callable和33个closed HTTP route。
- 每个single / page Query的read subject、resolver-first顺序、repository exact key / scope与public mapper。
- `Visible + None`、visible empty、NotVisible、Degraded、freshness / rebuilding / unavailable及repository failure的互斥surface。
- 10个paged Query的collection-level visibility seed与scope-bound cursor；不得从第一项、cursor文本或empty page猜visibility。
- Query统一no-write：不begin UoW、不reserve、不save / append、不调用resolver刷新、handoff、collaboration或rebuild。

### 14.5 正式 §7.4 Inbound Event Consumer回填

从本文件§9回填:

- 公共envelope、source actor / family gate、6个typed payload、6个handler、6个application callable与6个logical event mapping。
- header-first schema gate与payload authority去重；unsupported schema不得decode body或reserve completed result。
- accepted / delayed / ignored / rejected / unsupported / quarantined / duplicate receipt及effect / follow-up refs。
- fresh receipt、shell、surface、typed envelope与idempotency completion的same-UoW对称；duplicate只调用`get_consumer_receipt`。
- governance、method、source、audit、document均只解析body-free reference observation；不得把consumer变成owner truth mutation。

### 14.6 正式 §7.5 Outbound Event回填

从本文件§10回填:

- 10个typed payload、closed event name / schema / logical routing key、10个pure mapper / capture callable及10张独立协议卡。
- 每类event的唯一committed exact source；`CapabilityRegistryChanged`只来自`RegistryChangeRecord`，reconciliation report只可形成`DerivedMaterialRefreshed`。
- source mutation / material / state revision、complete serialized envelope snapshot与initial capture同一local UoW。
- commit后只从stored snapshot协作，stable external intent独立绑定；repair不重跑mapper、不复制delivery state。
- physical topic、broker、consumer group、outbox / relay产品、attempt / retry状态留后续配置与实现计划，不得写成已选型事实。

### 14.7 正式 §7.6 Operations Job回填

从本文件§11回填:

- 8个input、8个top-level typed result detail、8个handler、8个application callable、8个logical trigger和8张独立协议卡。
- `CapabilityJobMetadata`唯一actor / run / trace / idempotency / schema authority；本文不提供或伪造真实run id。
- typed scope到truth snapshot、derived material、reconciliation report、reference state、event capture / collaboration的构造与Port映射。
- `Completed / PartiallyCompleted / Failed / Retryable / DuplicateReplayed / Rejected`的report presence、storage与retry边界。
- fresh completed outcome使用`save_job_report`；duplicate只使用`get_job_report`并校验variant / job / schema / run / result / surface对称。
- 所有Job维持no-core-truth-repair，不创建 / 更正identity、registry、descriptor、seam、method relation或formal exposure。

### 14.8 正式 §7.7 Cross-protocol closure回填

正式正文用本文件§12的收口表记录:

- `26 + 33 + 6 + 10 + 8 = 83`个protocol，83个独立卡、83组entry/application callable、83个唯一route / logical name / trigger与83个唯一Step 9 flow。
- public secondary type owner、metadata authority、DTO construction、page / visibility、三类stored replay、outbound durability、body-free owner boundary均已闭合。
- Step 7 typed Job replay回开本身未增加trait；其后Step 9 `9.11-pre-entry`为durable Job execution journal新增第36个Port与第7个application technical helper。正式装配采用当前基线`43个HLD object + 7个application technical helper + 36个Port`，不得恢复本节早期`43 + 6 + 35`快照。
- historical material不进入正式协议正文；仅在正式上游关系 / 风险章节引用已裁决冲突ID，防止旧主语回流。

## 15. Step 9 Handoff

本节固定Step 9输入，不创建`03_ddd_step_09_function_flows.md`。用户确认进入下一Step后，必须重新读取项目台账、本flow、本文§12~§16、Step 6 exact object contract、Step 7已回开的Port contract、正式`02`处理流 / 状态机与详细设计SOP Step 9。

### 15.1 Step 9流全集与coverage

#### Command flows: 26

| owner group | Step 9 exact flows |
|---|---|
| identity / review | `command_establish_capability_access_context_flow`;`command_correct_capability_identity_flow`;`command_retire_capability_identity_flow`;`command_record_capability_access_review_fact_flow` |
| registry | `command_register_capability_in_registry_flow`;`command_update_registry_lifecycle_state_flow`;`command_update_registry_visibility_basis_flow`;`command_retire_capability_registry_entry_flow` |
| descriptor / safe summary | `command_establish_adapter_descriptor_flow`;`command_replace_adapter_descriptor_flow`;`command_record_descriptor_risk_constraint_summary_flow`;`command_attach_descriptor_secret_reference_flow` |
| governance / method relation | `command_attach_governance_seam_relation_flow`;`command_replace_governance_seam_relation_flow`;`command_expire_governance_seam_relation_flow`;`command_attach_capability_method_relation_flow`;`command_remove_capability_method_relation_flow` |
| formal exposure | `command_establish_formal_exposure_boundary_flow`;`command_update_formal_visibility_applicability_flow`;`command_suspend_formal_exposure_boundary_flow`;`command_retire_formal_exposure_boundary_flow` |
| trace / impact | `command_record_capability_change_impact_fact_flow`;`command_record_traceability_handoff_summary_flow` |
| reference support | `command_record_reference_resolution_state_flow`;`command_register_external_document_reference_flow`;`command_register_capability_consumer_reference_flow` |

#### Query flows: 33

| owner group | Step 9 exact flows |
|---|---|
| identity / review | `query_get_capability_identity_flow`;`query_search_capability_identities_flow`;`query_get_capability_access_review_fact_flow` |
| registry | `query_get_capability_registry_entry_flow`;`query_list_capability_registry_entries_flow`;`query_get_registry_visibility_semantics_flow` |
| descriptor / safe summary | `query_get_adapter_descriptor_flow`;`query_get_descriptor_risk_constraint_summary_flow`;`query_get_descriptor_secret_safe_summary_flow`;`query_list_descriptors_by_capability_flow` |
| governance / method relation | `query_get_governance_seam_relation_flow`;`query_get_access_governance_separation_flow`;`query_get_capability_method_relation_flow`;`query_list_capability_relations_flow` |
| formal exposure / consumer | `query_get_formal_exposure_boundary_flow`;`query_get_formal_visibility_applicability_flow`;`query_get_controlled_consumer_view_flow`;`query_list_consumable_capabilities_for_runtime_tools_flow`;`query_get_sdk_exposure_boundary_flow` |
| trace / impact | `query_get_capability_access_trace_flow`;`query_get_capability_change_impact_flow`;`query_get_downstream_consumption_impact_summary_flow`;`query_get_audit_handoff_trace_summary_flow` |
| derived / reconciliation | `query_search_capability_directory_flow`;`query_browse_capability_directory_flow`;`query_get_audit_friendly_export_summary_flow`;`query_get_read_only_ecosystem_discovery_summary_flow`;`query_get_capability_reconciliation_report_flow` |
| reference support | `query_get_reference_resolution_state_flow`;`query_get_external_document_reference_flow`;`query_get_runtime_tools_consumer_reference_flow`;`query_get_sdk_exposure_consumer_reference_flow`;`query_get_observability_audit_reference_flow` |

#### Inbound Event Consumer flows: 6

| protocol | Step 9 exact flow |
|---|---|
| `ConsumeGovernanceResultReferenceChanged` | `inbound_consume_governance_result_reference_changed_flow` |
| `ConsumeMethodAssetReferenceChanged` | `inbound_consume_method_asset_reference_changed_flow` |
| `ConsumeDownstreamConsumptionImpactReported` | `inbound_consume_downstream_consumption_impact_reported_flow` |
| `ConsumeExternalCapabilitySourceReferenceChanged` | `inbound_consume_external_capability_source_reference_changed_flow` |
| `ConsumeAuditMaterialReferenceChanged` | `inbound_consume_audit_material_reference_changed_flow` |
| `ConsumeExternalDocumentReferenceChanged` | `inbound_consume_external_document_reference_changed_flow` |

#### Outbound Event flows: 10

| event | Step 9 exact flow |
|---|---|
| `CapabilityIdentityChanged` | `outbound_capability_identity_changed_capture_and_collaborate_flow` |
| `CapabilityRegistryChanged` | `outbound_capability_registry_changed_capture_and_collaborate_flow` |
| `AdapterDescriptorChanged` | `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` |
| `GovernanceSeamRelationChanged` | `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` |
| `CapabilityMethodRelationChanged` | `outbound_capability_method_relation_changed_capture_and_collaborate_flow` |
| `FormalExposureBoundaryChanged` | `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` |
| `ControlledConsumerViewAvailabilityChanged` | `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` |
| `CapabilityChangeImpactIdentified` | `outbound_capability_change_impact_identified_capture_and_collaborate_flow` |
| `DerivedMaterialRefreshed` | `outbound_derived_material_refreshed_capture_and_collaborate_flow` |
| `ReferenceResolutionChanged` | `outbound_reference_resolution_changed_capture_and_collaborate_flow` |

#### Operations Job flows: 8

| Job | Step 9 exact flow |
|---|---|
| `RunCapabilityRegistryReconciliation` | `job_run_capability_registry_reconciliation_flow` |
| `RefreshControlledConsumerView` | `job_refresh_controlled_consumer_view_flow` |
| `RebuildDirectorySearchBrowseProjection` | `job_rebuild_directory_search_browse_projection_flow` |
| `PrepareAuditFriendlyExportSummary` | `job_prepare_audit_friendly_export_summary_flow` |
| `RebuildReadOnlyEcosystemDiscoverySummary` | `job_rebuild_read_only_ecosystem_discovery_summary_flow` |
| `RunDerivedMaterialReconciliation` | `job_run_derived_material_reconciliation_flow` |
| `RefreshExternalReferenceResolution` | `job_refresh_external_reference_resolution_flow` |
| `RepairCapabilityAccessEventCollaboration` | `job_repair_capability_access_event_collaboration_flow` |

Coverage total为`26 + 33 + 6 + 10 + 8 = 83`。Step 9不得把任何一族折叠为generic execute / query / consume / publish / job flow；共享helper可以作为每条flow中的内部调用，但不替代独立flow，也不增加第84个public protocol flow。

### 15.2 每条Step 9 flow的固定输出

每条flow必须独立给出:

1. exact protocol input / output与entry -> application函数签名。
2. ASCII调用图、对象factory / member、Port调用顺序与字段传递。
3. metadata / operation context构造、validation与early rejection位置。
4. UoW begin / write / stored result / idempotency completion / commit / rollback的exact边界，或Query no-write证明。
5. duplicate / conflict / missing replay、repository / resolver / collaboration failure与public error / disposition mapping。
6. state owner、expected version来源、append-only / optimistic write与outbound capture副作用。
7. body-free / no-core-truth-repair / no-current-truth-rebuild边界。
8. Step 10状态触发、Step 11持久化、Step 12错误、Step 13并发幂等与Step 16测试切口handoff。

### 15.3 各协议族不可弱化的flow门禁

| family | Step 9必须展开 | 禁止shortcut |
|---|---|---|
| Command | validate -> reserve -> load expected version -> domain transition -> change / trace / effect -> stored result + capture -> complete -> commit -> post-commit collaboration | caller version、post-commit event重建、duplicate mutation、external failure rollback truth |
| Query | context no-write -> resolver-first -> repository read -> view/page mapper -> explicit surface | 先读body再鉴权、empty默认visible、refresh / repair、stored result |
| Inbound | header/schema gate -> typed decode -> reserve -> resolver / effect -> typed receipt + shell/surface -> complete -> commit | payload重复authority、generic receipt bytes、duplicate resolver / write、owner body读取 |
| Outbound | accepted exact source -> pure mapper -> serialize -> snapshot + capture same-UoW -> commit -> official load -> collaborate -> stable intent bind | transient-only publish、current truth重建、第二queue、delivery state入capture |
| Job | metadata/schema/scope gate -> reserve -> typed target processing -> typed report -> `save_job_report` -> complete -> commit；duplicate先`get_job_report`并直接返回 | generic decoder、report-by-run reconstruction、duplicate scan / resolver / collaboration、core truth repair |

### 15.4 Step 9回开与停止条件

- flow需要Step 6不存在的stable object / field / factory / member时，停止该flow并按reopen gate回开Step 6；不得在伪代码私补。
- flow需要Step 7不存在的read / write / resolver / replay method时，停止该flow并回开Step 7；不得让entry / adapter绕过application。
- flow发现protocol缺字段、错误surface或typed secondary type时，停止并回开本文；不得从route、config、error text、current truth或fake private map推导。
- flow不得推翻`CH-DDD-OUTBOUND-SOURCE-001`和`CH-DDD-S7-JOB-REPLAY-001`的已解决裁决。
- 83条flow全部完成、逐条停审并通过cross-flow transaction / state / replay / protocol coverage审计后，才允许进入Step 10。

## 16. 待确认事项与 Step 自检

### 16.1 当前风险与后续owner

| ID | 事项 | 当前状态 | 后续owner / 不阻塞原因 |
|---|---|---|---|
| `CH-DDD-S8-RISK-001` | exact transaction save / complete / commit顺序尚未逐flow展开 | deferred, not blocking | Step 9逐flow固定调用顺序，Step 11固定持久化原子性；本Step已固定必须同一UoW的成员集合 |
| `CH-DDD-S8-RISK-002` | error variant、HTTP status、event ack / retry与Job exit code尚未完整映射 | deferred, not blocking | Step 12；本Step已有stable rejection / receipt / report / surface分类，入口无需猜返回shape |
| `CH-DDD-S8-RISK-003` | digest codec、canonicalization、collision与concurrent duplicate matrix未选定 | resolved by Step 13 with authorized dependency assumption | Step 13固定versioned frame、contracts-owned field bytes、SHA-256 domain、collision / duplicate matrix；core accessor按显式用户授权的`as_str().as_bytes()`原始UTF-8语义闭合，L0-core正式设计同步为非阻塞债务 |
| `CH-DDD-S8-RISK-004` | endpoint、transport、topic、scheduler、timeout与credential binding未选型 | deferred, not blocking | Step 14 / `04-配置设计.md`；logical route / event / trigger已闭合 |
| `CH-DDD-S8-RISK-005` | adjacent governance / method / SDK / runtime contracts可能继续演进 | monitored, not blocking | Step 14 adapter binding与后续全局依赖审计；当前只使用body-free typed ref / safe summary，不复制owner body |
| `CH-DDD-S8-RISK-006` | 83条flow数量较大，Step 9易被generic流程压缩 | active guard, not blocking | 本文件§15固定83个唯一flow与逐条输出门禁；Step 9必须分批停审 |

这些风险均未被写成已实现、已测试或已验收事实。它们不要求在Step 8新增配置值、产品选择、commit、run、evidence或签署。

### 16.2 已解决回开 / blocker

| ID | 解决位置 | 结论 |
|---|---|---|
| `CH-DDD-CONSTRUCTION-001~003` | Step 6 + 本文件Command | change record构造、exact registry ref与safe reason bridge已闭合 |
| `CH-DDD-HISTORY-001` / `CH-DDD-EFFECT-001` | 本文件Command | safe-summary history与reference effect refs已闭合 |
| `CH-DDD-S7-QUERY-RESOLUTION-001` | Step 6 / 7 + 本文件Query | single / empty-page resolver-first读取面已闭合 |
| `CH-DDD-S7-CONSUMER-REPLAY-001` | Step 7 + 本文件Inbound | typed receipt replay已闭合 |
| `CH-DDD-S7-AUDIT-RESOLUTION-001` / `CH-DDD-S7-REFERENCE-DIGEST-001` | Step 6 / 7 + 本文件Inbound | audit inbound resolver与8类candidate digest lookup已闭合 |
| `CH-DDD-S7-EVENT-CAPTURE-001` | Step 6 / 7 + 本文件Outbound | same-UoW immutable snapshot / capture与stored-snapshot collaboration已闭合 |
| `CH-DDD-OUTBOUND-SOURCE-001` | 本文件Outbound / historical audit | reconciliation不得伪造registry change的冲突已裁决 |
| `CH-DDD-JOB-REPORT-001` | 本文件Shared / Job | 8类typed Job result detail与target union已闭合 |
| `CH-DDD-S7-JOB-REPLAY-001` | Step 7 `7.R2` + 本文件Job / cross audit | 8-variant typed Job save/get与no-rerun duplicate gate已闭合，Port仍为35 |
| `CH-DDD-S9-AFFECTED-MATERIAL-001` | Step 6 §7.6 / state contract、Step 7 §6.1 / §11.2~§11.3.1、本文件§6.2 / §7.12 | core-truth Command现在由terminal accepted change驱动stable affected scan,只返回actual stale refs；四类material typed reason、own expected version、same-UoW save / capture、already-stale no-op与immutable report排除均已闭合；Port仍为35 |
| `CH-DDD-S9-TERMINAL-EVENT-001` | Step 6 §20.6 + 本文件§10.2 / §10.5 / §10.7.1 | multi-change trace覆盖全部ordered records,但outbound只接受与final persisted truth revision对称的record；identity correction不再为transaction-local`CorrectionRequested`伪造capture |
| `CH-DDD-S9-IDEMPOTENCY-VERSION-001` | Step 7 §13.1 + 本文件§6.1 / §7.2 | fresh reserve返回`Reserved(Loaded<CapabilityIdempotencyRecord>)`;所有Command completion save只使用该initial persisted `expected_version`,不猜create version或二次读取 |
| `CH-DDD-S9-RETIRE-IDENTITY-GUARD-001` | Step 7 `CapabilityRegistryRepository::find_current_by_identity` + 本文件§7.12.3 | identity retirement在current registry存在时稳定拒绝；不级联retire或delete registry、descriptor、relation、exposure或derived truth |
| `CH-DDD-S9-MULTI-SUBJECT-MATERIAL-001` | Step 7 §11.3.1 + 本文件§6.2 / §7.13 | multi-subject accepted Command先按canonical subject order收集candidate,再按typed material ref union；每个material只load / mark / capture / save一次,reason取首次命中terminal record,不依赖read-your-writes且effect无重复ref |
| `CH-DDD-S9-DESCRIPTOR-REGISTRY-RECORD-001` | Step 6 §8.7 / §8.10 + 本文件§7.13.1~§7.13.2 | `bind_descriptor(...)`原子设置descriptor ref与`VisibilityPending`,只形成一条解释最终registry revision的`DescriptorBound`record；application不得追加第二条中间态`LifecycleChanged`record |
| `CH-DDD-S9-REFERENCE-LOCATOR-MAP-001` | Step 6 §7.10.5 + 本文件§7.13.4~§7.13.9 | secret provider ref、governance source+scope、method locator现在分别通过三个exact body-free constructor形成generic candidate locator；不得发明enum variant、访问newtype私有字段或拼接external body |
| `CH-DDD-S9-EXPOSURE-REGISTRY-DELTA-001` | Step 8 §7.6 / §7.14.1~§7.14.4 | exposure service先计算registry target,只有current state与target不同才transition / save / record / trace / capture；same-state不进入changed subject或material scan |
| `CH-DDD-S9-EXPOSURE-VISIBILITY-VERSION-001` | Step 6 §10.3 + 本文件§7.6 / §7.14.1~§7.14.2 | visible fact支撑activation后必须以final exposure再次reevaluate,只保存final visibility revision；`source_exposure_version`与final exposure version对称 |
| `CH-DDD-S9-HANDOFF-REVISION-001` | Step 6 §10.8 + 本文件§7.7 / §7.14.6 | handoff Command只调用一次`request_handoff(...)`,形成exactly one next trace revision；local pending result / completion先commit,Some才post-commit handoff,duplicate不重复调用 |
| `CH-DDD-S9-REFERENCE-MATERIAL-001` | Step 6 §7.6、Step 7 §6.1 / §11.3.2 + 本文件§6.2 / §7.8 / §7.14.7 | canonical state actual transition以exact reference index收集mutable material,final resolution reason typed bridge、own expected version、same-UoW capture/save、already-stale no-op且无fake change / trace |
| `CH-DDD-S9-REFERENCE-LOCATOR-MAP-002` | Step 6 §7.10.5 + 本文件§7.12.1 / §7.14.8~§7.14.9 / §9.8.4 | source、document、runtime-tools、SDK candidate分别通过四个exact one-way constructor形成generic locator；不访问newtype private value、不拼接或读取external body |
| `CH-DDD-S9-IMPACT-SUMMARY-PAGE-001` | Step 6 §10.6、Step 7 §6.1 / §10.5 + 本文件§8.8 / §8.15.7 | single impact view删除无法完整分页的summary-ref字段；paged downstream Query与existing repository scope增加exact optional impact filter,组合过滤保持AND语义 |
| `CH-DDD-S9-TRACE-EXACT-READ-001` | Step 7 §10.3 + 本文件§8.15.9 / §8.16.3 | audit handoff与trace-and-scope export使用`get_revision`读取exact historical revision；write path继续使用current+expected read |
| `CH-DDD-S9-AUDIT-SCOPE-FILTER-001` / `CH-DDD-S9-AUDIT-PAIR-PARTIAL-001` | 本文件§8.15.9 | opaque scope只校验/回显inspection context；完整audit ref + canonical state pair才形成item；按Step 12 batch `12.4`校正,missing/wrong mandatory pair是exact `ConsistencyDefect`,不得整体降格body-free degraded |
| `CH-DDD-S9-DERIVED-STATE-MAP-001` | 本文件§6.3 / §8.8 / §8.16.3~§8.16.5 | export/discovery使用实际四态,public degraded enum补Rustdoc-complete `MaterialUnavailable`,reconciliation page固定五态优先级 |
| `CH-DDD-S9-DIRECTORY-FACET-PARITY-001` | Step 6 §7.10.3 + 本文件§8.16.1~§8.16.2 | Search/Browse通过existing facet set的pure `contains_all`验证adapter结果；不暴露facet vector或解析ranking |
| `CH-DDD-S9-COLLECTION-DEGRADED-001` | 本文件§8.15.6~§8.16.5 | resolver-level Degraded在target list/search前返回empty/no cursor；只有Visible后persisted item state可保留items并聚合degraded surface |
| `CH-DDD-S9-COLLAB-OUTCOME-SOURCE-001` | Step 7 §6.2 / §14.10 + 本文件§10.4 / §10.6 | existing collaboration outcome补Rustdoc-complete exact source；application在bind前校验candidate / capture / snapshot / outcome source一致,不解析opaque intent或回查current truth；Port仍35 |
| `CH-DDD-S9-COLLAB-FACADE-001` | Step 7 §15.3 / §17.2 + 本文件§10.4 / §10.6 | existing internal application facade现有exact `collaborate_captured_event` callable；source service / worker只传exact capture ref,不持有repository或publisher handle；不新增protocol / infra Port |
| `CH-DDD-S9-EXPOSURE-EVENT-KIND-001` | 本文件§10.5 / §10.7.6 | `FormalExposureBoundaryChanged`拒绝history union中的`ConsumerViewMarkedStale`;该kind描述derived view而非formal exposure,exact view revision由`ControlledConsumerViewAvailabilityChanged`表达；不改enum/schema/object/Port |
| `CH-DDD-S9-JOB-TX-001` | Step 6 §12.8 / §20.10、Step 7 §13.5、本文件§11.3.1、Step 9 §7.3 / §10 / §35 | normalized-key-owned typed journal保存完整planning outcome、terminal target outcome、run issues与final linkage；existing Reserved只exact-load journal,八类response只从journal装配；initial / target / final UoW成员与no-scan/no-repeat边界已闭合 |
| `CH-DDD-S9-AUDIT-EXPORT-REBUILD-001` | Step 6 §7.10.3 / §11.3 / §20.11、本文件§11.6 / §11.8.4 | existing audit export现在通过complete pure match决定Unchanged,或在same trace/scope identity上refresh并清空old refs后逐个重附；typed result只复制saved stable ref set。无新DTO / protocol / Port。 |
| `CH-DDD-S9-RECONCILIATION-DISPOSITION-001` | 本文件§11.3.1 / §11.7、Step 9 batch `9.11` reconciliation flows | persisted `Failed` reconciliation report仍以Succeeded outcome保存exact detail,但必须有`StableFailure` run issue并在generic mixed-success规则前装配Job `Failed`;missing impact是consistency error。无schema / journal / Port变化。 |
| `CH-DDD-S9-CONTROLLED-VIEW-APPLICABILITY-001` | Step 6 `FormalVisibilityApplicability::is_consumable_by`、Step 7 `FormalVisibilityRepository::find_current_by_exposure`、本文件§11.1 / §11.6 / §11.8.2 | controlled-view planning现在显式加载与exact exposure version对称的current visibility并逐consumer校验applicability；Job只读visibility,不保存或把它当runtime authorization。无新callable / Port。 |
| `CH-DDD-S9-JOB-PLANNED-FAILURE-001` | Step 6 `CapabilityJobExecutionTargetPlan::PreclassifiedFailure`、Step 7 §13.5、本文件§11.3.1 / §11.6、Step 9 §35 / §36 | complete multi-target planning保留stable failed target identity；zero-effect UoW按ordinal终态化,assembler只形成failed-target row。新增1个variant + 1个payload field；无新type / struct field / Port / protocol。 |
| `CH-DDD-S9-AUDIT-EXPORT-STATE-MAP-001` | Step 6 `matches_preparation` / reference-reason bridge、本文件§11.6 / §11.8.4、Step 9 audit-export Job flow | seven canonical values固定为failed / unavailable / partial / ready四类outcome；完整final state/reason与resolved saved-ref子集参与no-op,避免重复degraded revision。无schema / Port变化。 |
| `CH-DDD-S9-ECOSYSTEM-PLAN-001` | Step 6 ecosystem plan payload、`FormalVisibilityApplicability::is_consumable_by`、Step 7 existing visibility/source reads、本文件§11.6 / §11.8.5 | planning冻结consumer applicability、safe summary/source versions及Ready/Partial/Unavailable + reason；target不重读optional source决定state。无新type / Port / protocol。 |
| `CH-DDD-S9-REFERENCE-REFRESH-TERMINAL-001` | Step 6 canonical state transition contract、本文件§11.3.1 / §11.6 / §11.8.7、Step 9 reference-refresh flow | current Invalid/Forbidden保持`ReferenceResolution` frozen plan并在target phase稳定Skipped；non-terminal observation含new Invalid/Forbidden均使用existing`transition`与body-free reason；same value/reason为Unchanged。无type / field / Port / protocol变化。 |
| `CH-DDD-S10-REFERENCE-SAME-VALUE-COMMAND-001` | Step 6 canonical state `transition` contract、本文件§7.14.7、Step 9 `command_record_reference_resolution_state_flow` | `Transition` intent对non-terminal current执行value + reason二元比较；same value + changed safe reason形成actual revision / capture / affected-material stale,仅same value + same reason为no-op。Invalid / Forbidden仍terminal。无type / field / DTO / protocol / Port变化。 |
| `CH-DDD-S9-COLLAB-REPAIR-TX-001` | Step 6 `EventCapture` plan payload、Step 7 §13.4~§14.10、本文件§11.3.1 / §11.8.8、Step 9 collaboration-repair flow | Captured bind + journal success同target UoW；IntentBound / intent-only只写journal outcome；pure assembler按prior-intent校验successor-vs-exact capture revision及source/intent对称。新增2个private variant payload fields,均有英文Rustdoc；无public schema / Port变化。 |
| `CH-DDD-S10-DESCRIPTOR-SUMMARY-REACHABILITY-001` | Step 6 descriptor / risk / secret object contract、本文件§7.13.2~§7.13.4、Step 9 matching flows | old descriptor current source固定Accepted / Unresolved；known risk形成Available、Unknown形成Partial、ForbiddenBody拒绝；secret summary factory仍只形成Available / Unavailable。无DTO / protocol / Port变化。 |
| `CH-DDD-S10-RELATION-CURRENT-INDEX-001` | Step 7 governance / method current repositories、本文件§7.13.5~§7.13.9、Step 9 relation flows | current lookup保留Unresolved degraded relation并排除terminal；replace old只接受Active / Unresolved / Expired,remove只接受Active / Unresolved且必须exact current。无DTO / protocol / Port变化。 |
| `CH-DDD-S10-EXPOSURE-VISIBILITY-APPLICABILITY-001` | Step 6 formal applicability / exposure policy、本文件§7.6 / §7.14.1~§7.14.4、Step 9 exposure flows | 同名scope carrier改为typed consumer set；cards补active identity、scope member与完整prerequisite读取,policy-only target、先normalize exposure再derive、branch-specific applicability reason及pre/post source-version symmetry。无DTO / field / protocol / Port变化。 |
| `CH-DDD-S10-TRACE-REVISION-INVARIANT-001` | Step 6 trace member、本文件§7.14.6、Step 9 handoff flow | handoff revision从Partial离开时清gap并保持superseded pointer互斥；Command仍exactly one member / append revision。无schema / protocol / Port变化。 |
| `CH-DDD-S10-CONSUMER-VIEW-PARTIAL-REBUILD-GUARD-001` | Step 6 structured `DescriptorConsumerSummary` / view + directory member guards、本文件§8 controlled-view Query schema与§11.6 / §11.8.2~§11.8.3、Step 9 material flows | 同名secondary type内含body-free summary + typed partial kinds,所以existing DTO / journal field无需新增；current view Job只保存Ready / Partial,directory Job只保存Ready,两者均不保存Rebuilding / Unavailable中间态。无新DTO field / protocol / Port。 |
| `CH-DDD-S12-ISSUE-REF-CONSTRUCTION-001` | Step 6 `CapabilityOpaqueId` + 本文件§6.1 + Step 12 batch `12.3` | closed `CapabilityIssueCode`、51个固定versioned literal、deterministic `from_code`、exact `from_literal`与stable duplicate-free set construction闭合；inner fields收为private。无新response envelope、DTO field、protocol、flow、trait或Port。 |
| `CH-DDD-S12-QUERY-DEGRADED-SOURCE-001` | Step 6 closed `CapabilityReadDegradedReason`、Step 7 §7.4、本文件§6.3、Step 9 Query flows、Step 12 batch `12.4` | resolver-level degraded reason现持有closed kind；本文件补8-arm freshness和kind/ref同源marker constructor。Service只复制typed result,不解析reason text、repository error或fake-private分类。无新type / field / protocol / Port。 |
| `CH-DDD-S12-QUERY-CONSISTENCY-SEPARATION-001` | 本文件33张Query卡、Step 9 batches `9.4~9.7`的33条Query flow、Step 12 batch `12.4` | visible normal absence、完整typed degradation与loaded consistency defect已严格三分；owner/version/union/index不对称、mandatory current state或required sidecar缺失均返回exact `ApplicationError::ConsistencyDefect`,不得降格为degraded success、normal missing、row drop或partial prefix。无新type / field / protocol / Port。 |
| `CH-DDD-S12-INBOUND-PORT-RETURN-SEPARATION-001` | 本文件§9.7.4与5张reference Inbound卡、Step 9 batch `9.8`五条matching flow、Step 12 batch `12.5` | caller actor/family/target/candidate/body contradiction保留typed `Rejected / Quarantined` receipt；matching resolver成功返回的subject/kind/digest不对称固定为`ApplicationError::ConsistencyDefect(PortReturn(matching resolver), ReferenceObservationShape)`,不得伪装receipt。New-subject `Forbidden` quarantine；existing non-terminal可进入body-free `Forbidden` terminal；terminal exact value+reason为`Ignored`,任何delta为replayable `Rejected`并要求different candidate/new subject。无新type / field / protocol / Port。 |
| `CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001` | Step 6 §12.8 / §20.23、本文件§11.6~§11.8、Step 9 §§35~39、Step 11 Job initial / target / final UoW、Step 12 batch `12.6` | Job只在exact target/run identity、closed body-free issue、typed impact与zero-effect / confirmed rollback同时成立时写`PreclassifiedFailure / Failed / Skipped`。Loaded owner/version/union/sidecar、capture/snapshot、journal/result不对称及codec/rollback/commit-unknown/control-plane failure保持exact `ApplicationError`和`Planned`恢复点,不得伪装report。Reconciliation五态固定issue/impact映射。无新type / field / protocol / Port。 |

当前unresolved upstream blocker为`0`。`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`保留历史诊断，但已由Step 13显式用户授权依赖假设解除；L0-core正式设计同步为非阻塞债务。上述Step 9 / 10 / 12反查项是已关闭的受控回开 / contract clarification,不是实现完成、测试结果或验收事实。

### 16.3 Step 8完成门禁

| 检查项 | 结论 | 依据 |
|---|---|---|
| 五类protocol inventory完整 | pass | §4、§7~§11：26 / 33 / 6 / 10 / 8 |
| 每个protocol有字段级schema与独立卡 | pass | 83 / 83 |
| handler / producer与application callable完整 | pass | 83 / 83 |
| route / event / trigger closed且唯一 | pass | §7.11、§8.12、§9.5、§10.5、§11.5 |
| DTO -> object / Port构造 | pass | §7~§11 construction table + §12.4 |
| public secondary type owner | pass | §6 + §12.2；Step 12 batch `12.3`后250 public struct / enum均有owner；Step 13只新增existing DTO callable,未新增type |
| struct / field / enum / variant Rustdoc | pass | type / field / variant / payload缺失均为0 |
| Step 12 batch 12.3 issue-code Rustdoc | pass | 1个public enum、51个variant、2个private tuple fields及11个public callable均有英文`///`;无field-level `pub` |
| Step 12 batch 12.4 Query-degraded Rustdoc | pass | existing kind / marker新增2个public callable均有英文`///`;Step 6 reworked private field与3个callable同样有英文`///`,无struct / field / variant注释遗漏 |
| Step 12 batch 12.6 Job mapping / Rustdoc | pass | safe-terminalization与8张Job卡只收紧prose mapping；无新declaration,Step 6 journal/support与本文件Job DTO / field / variant / callable英文`///`保持完整 |
| Step 10 batch 10.4 structured summary Rustdoc | pass | reworked secondary type两个private fields、partial-set inner field及public methods均在Step 6有英文`///`;本文件无新增DTO field,全部existing struct / field注释保持完整 |
| Query view / page / marker | pass | 33 response field-level；10 page resolver-first |
| Command / Consumer / Job replay | pass after Step 7 reopen | generic command + typed consumer + 8-variant typed Job；duplicate core command不扫描affected material |
| Operations Job reserved reentry | pass after Step 9 batch `9.11-pre-entry` reopen | 7th application helper + 36th Port；reservation / complete planning outcome同initial UoW、target effect / capture / terminal outcome同target UoW、typed report / Finalized / Completed同final UoW |
| audit-export existing rebuild / typed result symmetry | pass after Step 9 batch `9.11` reopen | complete pure no-op guard；same-trace/scope refresh清old refs并恢复Ready；saved stable ref set是typed item唯一来源 |
| reference / collaboration Job result symmetry | pass after Step 9 batch `9.12` reopen | Unchanged exact vs Updated one-successor state ref；Captured one-successor vs IntentBound exact capture ref；source / intent frozen-plan parity |
| core-truth affected-material propagation | pass after Step 9 reopen | actual-stale-only effect、view + three mutable material scan、typed reasons、own expected versions、same-UoW availability captures、immutable report exclusion |
| canonical-reference affected-material propagation | pass after Step 9 reopen | exact reference marker index、typed union、final resolution reason、own expected versions、same-UoW availability captures；no fake change / trace |
| exposure delta / source-version symmetry | pass after Step 9 reopen | registry actual-delta-only；activation后visibility再次reevaluate且只保存final source-version-symmetric revision |
| trace handoff local / external phase | pass after Step 9 reopen | one`request_handoff`revision；stored accepted-local-result先commit；Some only post-commit；duplicate no-repeat |
| multi-change event eligibility | pass after Step 9 reopen | trace覆盖全部same-subject changes；capture只取与final persisted revision对称的record |
| outbound exact-source durability | pass | source + snapshot + capture same-UoW；stored-snapshot-only collaboration |
| body-free owner boundary | pass | governance / method / secret / runtime / SDK / marketplace / audit均未越界 |
| protocol-to-flow | pass | 83 cards -> 83 unique Step 9 flows |
| historical material隔离 | pass | §13；旧README / 正式`03/05/06` / implementation线索不作truth source |
| 正式`03`未提前修改 | pass | 正式装配仍留Step 19 |
| implementation artifact未提前创建 | pass | Step 9中间产物已按用户确认正常推进；未创建implementation ledger或boundary skeleton |
| 伪造事实 | none | 无实现commit、真实run_id、测试结果、evidence alias或验收签署 |

### 16.4 停审结论

Step 8 batch `8.7`原评审已完成,并在Step 9各受控batch闭合flow反查,在Step 10 batches `10.1~10.4`同步object/state可达性,在Step 12 batches `12.3~12.6`补齐closed issue identity、Query degraded typed-source、Inbound Port-return separation及8张Job卡safe-terminalization / reconciliation state mapping,Step 13补40个exact request-field-byte callable与closed operation mapper ownership，Step 14 batch `14.5.2.2.3`再固定23/23 async trait object-safety attribute与Job metadata六字段response-validation copy。当前状态为`completed_with_step_14_5_2_2_3_async_trait_and_metadata_copy_reopen`。本Step仍收稳shared carrier、26个Command、33个Query、6个Inbound Event Consumer、10个Outbound Event、8个Operations Job及83-entry cross-protocol closure；当前基线为43个HLD objects + 7个application technical helpers、36个Port、83个protocol、250个public struct / enum。public wire type、DTO field、response envelope、protocol、Port或business truth增量均为0，contracts-owned public helper callable净`+1`；全部结构体、字段、variant与callable英文Rustdoc保持完整。

原Step 8整体审查门已由用户明确确认解除；Step 9 batch `9.13`最终审计已完成,83 / 83 exact flow set、逐flow结构与cross-flow transaction / state / replay / phase门禁均通过。当前恢复点由Step 14中间产物、文档flow和项目台账共同控制。本文件作为`completed_with_step_13_controlled_reopen_and_authorized_dependency_assumption`基线使用；不得从旧停审文字绕过Step 14批次门禁、修改正式`03-详细设计.md`、创建implementation ledger / planned boundary skeleton或提交commit。
