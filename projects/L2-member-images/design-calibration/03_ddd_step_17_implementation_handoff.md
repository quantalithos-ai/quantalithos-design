# L2-member-images 03 详细设计 Step 17：详细设计到实施计划的承接清单

> 创建日期：2026-09-01  
> 状态：completed_stop_review（已完成本 Step 的设计承接与预复核；等待用户明确确认 Step 18）  
> 文档模式：full-restart  
> 对应 SOP：standards/document/详细设计讨论流程_SOP.md Step 17  
> 中间产物规范：standards/document/设计文档讨论中间产物规范.md §5.10  
> 回填位置：正式 03-详细设计.md §16“详细设计到实施计划的承接清单”（当前仅有草稿，禁止装配）  
> 粒度参照：L1-governance 的 Step 17 只提供“承接、预复核、冲突回流与停审”的组织粒度；不继承其治理对象、outbox、publisher、report、evidence、外部 backend 或任何已闭合正向事实。

## 0. Step 状态、授权范围与执行计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 17：收口详细设计到实施计划的承接清单。 |
| 本 Step 输入 | 已停审的 03 Step 1 至 Step 16，以及重建版 00、01、02。 |
| 本 Step 输出 | 本文件；03 flow 与项目执行台账的 Step 17 完成停审状态。 |
| 用户授权 | 用户于 2026-08-31 明确同意进入 Step 17；授权仅覆盖本 Step。 |
| 本 Step 做什么 | 整理后续 07 可引用的设计真相源、实施前阅读、字段/协议/状态/命名预复核，以及 blocker 回流位置。 |
| 本 Step 不做什么 | 不定义排期、phase、commit boundary、任务、实现仓、Cargo、测试执行、run_id、digest、report、evidence、verdict、signoff 或 readiness。 |
| 当前实现状态 | 未授权实现；目标实现仓 quantalithos-member-images 先前核查为未发现，且本 Step 没有创建或重新检查它。 |
| 正式文档状态 | 正式 03 未装配；旧正式 03 仍不可读取，只有 Step 19 历史污染审计可打开。 |
| 强制停点 | 完成本文件后立即停审；未经用户明确确认，不得创建 Step 18。 |

### 0.1 本 Step 写入批次

| 批次 | 内容 | 状态 | 完成门禁 |
|---:|---|---|---|
| 17.1 | 输入准入、Step 边界、SOP 问题回答与材料诊断 | done | 不把承接清单写成实施计划或实施批准。 |
| 17.2 | 设计真相源、实施承接项、实施前阅读与前置检查 | done | 所有实现前材料均可回指来源，且不形成第二真相源。 |
| 17.3 | 字段、输入构造、Query、状态、传递类型、命名与 phase boundary 预复核 | done | 按中间产物规范 §5.10 输出固定复核面。 |
| 17.4 | 冲突、正反例、blocker 回流、可落码性判断与正式章节草稿 | done | 所有未闭合项仍显式阻断相应正向 lane。 |
| 17.5 | Step 完成停审与 flow/ledger 回写 | done | 不创建 Step 18、正式 03、04、05、06、07、implementation ledger 或 planned boundary skeleton。 |

### 0.2 本 Step 的结论分级

| 分级 | 含义 | 本文件中的适用范围 | 不代表 |
|---|---|---|---|
| 可供后续 07 引用 | 设计对象、端口、逻辑协议、flow、状态和测试切口有明确来源。 | Step 1 至 Step 16 的已收敛材料。 | 07 已生成、实现可开工或任何正向路径已运行。 |
| current-negative/no-write | 当前唯一可验证的 fail-closed、只读或 marker-only 约束。 | Command/Job 的 B01/B02 stop、Query strict no-write、conditional inbound marker-only、zero outbound。 | mutation、replay、adapter 调用、发布或外部成功。 |
| planned-pure-contract | future domain/typed-ref/guard/state/config/redaction 的实现与测试切口。 | contracts、domain、静态输入边界、状态矩阵、fake parity。 | 代码、测试框架、fixture 或结果存在。 |
| future/reopen-positive | 只有本仓 blocker 与 owner 合同重开后才能设计和实施的正向行为。 | local mutation、builder outcome、gate、Artifact、consumer handoff、projection recovery。 | 当前可以实现、调用或验收。 |
| blocked | 缺少唯一、owner-controlled、可落码输入，不能交给实现者选择。 | DDD-S9-B01/B02、DDD-S11-B03、DDD-S13-OPEN-01/02、PF 与 MI-UP/Q-MI。 | fake、cache、ACK、配置或 sibling 草稿可补足该输入。 |

## 1. 本 Step 目标与不可越界边界

本 Step 把 03 Step 1 至 Step 16 的内容整理为后续正式 07 可以按 phase / commit boundary 引用的来源索引，并完成一次设计层预复核。预复核只说明“哪个问题已有唯一设计来源、哪个问题必须回写设计、哪个问题还未获得 owner 合同”；它不是交付实现前审计的通过结论。

正式移交实现至少还需要：

1. Step 18 和 Step 19 完成，且新版正式 03 已装配；
2. 按正式 03 生成并停审的 04、05、06、07；
3. 07 对每一个实际 phase / commit boundary 对正式 03、05、06、07 重新执行整体可落码审计；
4. 当时确认目标实现仓、正式 design baseline、适用技术栈、项目级 git identity、依赖批准与当前 owner 合同。

本仓不能拥有或补齐 RoleDefinition、member 主体、runtime loop、tool execution、live memory/checkpoint/workspace、container 生命周期、sandbox policy/backend、Artifact truth、governance approval truth、observability backend、外部 MCP/A2A/API adapter truth、marketplace listing 或产品入口。模板、静态 seed、构建输入、构建产物、local truth 与运行时 live state 始终分离。

## 2. 输入清单与准入结论

| 输入 | 状态 | 本 Step 的限定用法 | 不可从中推导 |
|---|---|---|---|
| 重建版 00-需求文档.md | 已停审的需求基线 | 承接本仓使命、五条核心能力、VETO、owner 与 fail-closed 要求。 | Role 数量、具体产品、具体 evidence kind、实现成功或 readiness。 |
| 重建版 01-架构设计.md | 已停审的架构基线 | 承接五个语义责任段、向内依赖、truth/projection 与六类 seam。 | sibling Cargo dependency、active service/process、外部适配器或 positive integration。 |
| 重建版 02-概要设计.md | 03 的直接输入 | 承接五 capability、对象轮廓、接口分类、flow/state 骨架和 03 回退规则。 | 未闭合对端 DTO、route、topic、产品或运行事实。 |
| Step 1 至 Step 4 | 已完成 | 承接上游边界、范围、Rust planned baseline、目标实现仓及 planned layout。 | 已存在实现仓、manifest、compile 成功或已核验 git identity。 |
| Step 5 | 已完成 | 承接七技术模块、五 capability 与依赖方向。 | 以 capability 为 crate/service/database 的机械映射。 |
| Step 6 | 已完成 | 承接对象字段、factory、typed ref、static/live 红线与状态词表。 | 任意 owner body、裸字符串、外部 digest 或 runtime live state。 |
| Step 7 | 已完成 | 承接 application-owned port、infra implementation/fake、UoW 与 idempotency seam。 | concrete provider、outbox/publisher、receipt 或已经可调用的 adapter。 |
| Step 8 | 已完成 | 承接 10 Command、10 Query、2 条条件入站、6 Job、0 outbound 的逻辑协议。 | HTTP/RPC route、topic、broker、scheduler、run/report/evidence。 |
| Step 9 至 Step 13 | 已完成且有 blocker | 承接 flow、状态到持久化、错误、unknown、并发与重放的 fail-closed 顺序。 | 当前 write UoW、reservation、stored replay、自动 recovery 或 external retry。 |
| Step 14 至 Step 16 | 已完成且有 blocker | 承接 config/slot、依赖分类、redaction、local trace 和最小测试切口。 | 生产 fake fallback、运行时 readiness、观测 backend、测试执行或证据。 |
| 详细设计 SOP、书写规范、中间产物规范 §5.10 | 已读取 | 约束 Step 17 的固定输出、回填边界和停审机制。 | 将中间产物直接当作正式 03 或 07。 |
| 实施计划 SOP、实施计划书写规范 | 已读取 | 识别 07 才拥有的 phase、commit、implementation ledger、planned boundary skeleton 与永久记忆种子职责。 | 在 Step 17 提前创建任一 07 产物。 |
| Rust、目录组织、代码实施台账与门禁、可落码性标准 | 已由 Step 3/4 承接并本轮复核适用性 | 列入未来实施前阅读与 07 boundary 审计输入。 | 当前已经执行格式化、lint、测试、git config 检查或 commit。 |
| L2-member、L2-member-service 进行中材料 | pending owner direction | 只保留 owner、seam、gap 与重开条件。 | manifest/variant/ref、consumer confirmation、host/container、兼容性或 readiness 合同。 |
| 未停审的其他 owner 输入 | pending | 只用 body-free ref、safe conclusion、gap 或 unavailable/unknown 语义。 | exact schema、release、digest、evidence、Artifact acceptance 或发布结果。 |
| 旧 README、旧 00/01/02/03/05/06 | historical_material | 本 Step 不读取旧正式 03，也不继承旧材料。 | 当前设计 authority。 |

## 3. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 哪些实现契约已经足够进入实施计划？ | Step 1 至 Step 16 已给出模块、对象、port、logical protocol、flow、状态、persistence/error/idempotency 边界、config、observability 与 test seam 的可追溯输入。它们足以供未来 07 引用和重新审计；尚不足以授权实现，因为正式 03/04/05/06/07 未完成，且正向 write/owner 路径仍 blocked。 |
| 2 | 实施者需要先阅读哪些文档？ | 必须先读当时已正式化的 00 至 07，当前 boundary 所需的 calibration 来源、Rust 规范、目录组织规范、实施计划规范/SOP、代码实施台账与门禁规范、可落码性标准及实现仓项目规则。若正式文档和中间产物冲突，以正式文档为准；仍不清楚时暂停并回报。 |
| 3 | 提交规范、git config 用户、Rust 编码规范和注释规范是否列入前置阅读？ | 已列入未来实施前阅读。目标实现仓必须在实际开工前按项目级而非 global 方式核验 user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com；源码标识符、rustdoc、普通注释、error text 与测试名使用英文；commit 采用当时正式 07 所规定的英文 type(scope): subject。当前没有执行核验或提交。 |
| 4 | 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则？ | 对 Step 6 已列出的 local object，字段来源预复核通过：来自 application ID/clock、validated command/job input、exact local read、body-free typed external ref、安全结论、pure guard 或 committed local truth。所有要求未闭合 external body、raw digest、live state、授权结论或 Artifact truth 的字段仍被标为 blocked，不能由 implementation 补写。 |
| 5 | 每个 Command / Event / Job 是否能构造目标对象，或明确缺失处理？ | 10 Command 的 DTO 到目标对象映射已定义，但所有 mutation 目前在 DDD-S9-B01/B02 前停止；2 条条件入站没有 envelope/payload，只构造 InboundContractMarker 且 accepted_input=false；6 Job 当前只能构造 action/boundary disposition，不能 page/select/mutate。outbound inventory 为 NoneAuthorized，故没有 outbound event 构造面。 |
| 6 | 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否已经闭合？ | 10 Query 都有 contracts-owned response/view/page/marker、来源、empty/gap/unavailable/freshness 口径和 public ref/cursor 规则。Query 只读 existing committed local truth/projection；Visible 只表示 local read path 可达，不是授权；RequireFresh 只接受已有 Fresh marker。真实数据、visibility authority 与 projection recovery仍需在相应后续 boundary 复核。 |
| 7 | 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名？ | Step 6、10、16 已按同一 local state vocabulary 预复核：19 张 matrix、20 个 subject，无 GlobalState 或 Ready。05/06/07 尚未生成，故不能声明完整跨文档验收闭环；未来文档必须复用这些正式状态名，并把 future/reserved 的正向状态继续标明条件。 |
| 8 | 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据？ | 本 Step 没有定义 phase 或 commit boundary，因此没有产生预写 boundary。未来 07 的每个实际 boundary 必须单独证明其需要的 contracts、mapper、port、state、test/acceptance input 同 boundary 可得；不得依赖后续 result/report/evidence。当前 B01/B02、B03、PF 和 owner 合同已被列为边界 blocker。 |
| 9 | 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移？ | 当前校准链中已收稳 operation、module、state 和 view 命名；需持续防止将 Available、Assembled、Fresh、Resolved、Accepted、Buildable、Complete 或 Succeeded 统称 ready/published/delivered。旧正式 03 当前未获读取许可，故其旧名污染只能在 Step 19 做后置审计，不能在本 Step 猜测或继承。 |
| 10 | 哪些内容仍待确认，不能进入实施？ | 正式 03/04/05/06/07、目标实现仓、active Core compile contract、canonical/result mapper、availability terminal persistence、idempotency in-flight/namespace、projection unavailable recovery、各 MI-UP/Q-MI owner 合同均未闭合；见第 11 节。 |
| 11 | 实施计划应该如何引用本文，而不是重复本文？ | 07 应为每个实际 phase/commit boundary 引用正式 03 的章节和对应 calibration 文件，转化为阅读门禁、前置 surface、测试/验收门禁和暂停条件。07 不得复制 Step 6 字段卡、Step 8 DTO、Step 9 flow、Step 10 matrix 或 Step 16 seam 表成为第二真相源。 |
| 12 | 本文是否为 07 的交付实现前闭环审计提供足够输入？ | 是，作为设计层预复核输入：本文件提供真相源、字段、构造、Query、状态、传递类型、命名、冲突、boundary 规则和 blocker 回流。最终交付实现前审计仍只能在新版正式 03/05/06/07 齐备后，由 07 对每个实际 boundary 重做。 |

## 4. 当前材料诊断

| 位置 | 当前诊断 | 若不处理的风险 | 本 Step 处理 |
|---|---|---|---|
| 03 Step 1 至 Step 16 | 详细设计材料按对象、port、协议、flow、状态和测试切口分散，信息密度高。 | 未来实施计划可能只复制“实现七个 crate”，遗漏字段来源、no-write、gap 或 phase 前置。 | 建立第 8 节承接索引和第 9 节固定闭环表。 |
| Step 8 与 Step 9 | 逻辑 DTO/flow 已存在，但 B01/B02 使 Command/Job mutation 不可达。 | 将 schema 存在误读为 write path 已可实现，或以 fake 绕过 stop。 | 把所有 write/replay 改列 future/reopen 或 blocked；只保留 current-negative/no-write。 |
| Step 10 | 19 张 matrix 中存在多个阶段性正向状态。 | 把 Buildable、Succeeded、Eligible、Available、Resolved 或 Fresh 合并成 readiness。 | 在状态表、命名表和反例中固定阶段隔离。 |
| Step 11 至 Step 13 | persistence、unknown、replay、B03、OPEN 和 PF 有明确缺口。 | 实现者私加 lease、TTL、global key、upsert、delete/reinsert 或自动 recovery。 | 逐 blocker 指向受影响单元与重开 Step，禁止现场补设计。 |
| Step 14 至 Step 16 | config、composition、fake、观测与测试切口容易被误读为 runtime/owner success。 | slot Available、fake success、metric/span 或 test 名称被升级为 readiness/evidence。 | 明确它们只说明 local composition 或 planned seam，不产生外部/验收事实。 |
| 下游正式文档 | 新版 04、05、06、07 尚未生成；旧 05/06 仅 historical。 | 实施计划、测试、验收和配置承担的职责被 Step 17 越权预写。 | 仅记录未来输入、门禁和回填草稿，不创建任何下游文件或计划材料。 |
| 并行 sibling / owner | exact contract 仍在讨论。 | 以消费方向、草稿、cache 或 sample 伪造 manifest/ref/confirmation/acceptance。 | 保留 ref/runtime/event/adapter/fake 分类与 ContractGap/ConsumerHandoffGap 语义。 |

## 5. 改动前后对比

| 主题 | 本 Step 前 | 本 Step 后 | 不代表 |
|---|---|---|---|
| 实施承接 | 前序结论分布在 16 个 Step 文件。 | 有一份引用索引与固定交接预复核表。 | 已生成实施计划或批准开工。 |
| 字段来源 | Step 6 已逐对象展开。 | 关键对象组可回指输入、factory、缺失处理和测试切口来源。 | 每个正向 factory 当前可调用。 |
| Command/Job | 协议和 future flow 具名。 | 明确当前只能在 B01/B02 前停止，positive/replay 需重开。 | 写入、UoW、adapter 或 stored result 已存在。 |
| Query | response/view/page/marker 已分散定义。 | 10 Query 的 view 读取、empty/gap/freshness/ref 统一可审计。 | visibility authority、真实 projection 或数据已存在。 |
| 状态 | 多个 lifecycle 分散在矩阵中。 | 统一强调 19 matrix/20 subject、正式名和不跨阶段语义。 | 状态已被实现、测试或验收。 |
| 下游接口 | 04 至 07 尚无新版正式基线。 | 明确哪些文档必须后续生成、哪些内容不能在此提前定义。 | legacy 文档可直接继承。 |
| 风险处置 | blocker 分散在前序 Step。 | 形成 blocker 到实现单元、owner 条件和重开路径。 | blocker 已关闭、风险已接受或 readiness 已形成。 |

## 6. 设计取舍

| 议题 | 采用 | 未采用 | 原因 |
|---|---|---|---|
| Step 17 的职责 | 承接索引和跨文档预复核。 | phase、排期、commit、任务或实施台账。 | 后者是 07 的职责；提前定义会伪造实施开始。 |
| 真相源表达 | 07 引用正式 03 与校准来源。 | 在本文件复制完整字段、DTO、flow 或 state 表作为唯一实现说明。 | 避免第二真相源和后续漂移；本文件仅保留必要的闭环摘要。 |
| 当前可实施边界 | current-negative/no-write、read-only、marker-only 和 planned pure contract。 | 为“正向覆盖”建立 fake success 或 placeholder mutation。 | B01/B02 和 owner pending 明确要求 fail closed。 |
| 状态语义 | local object 分机、staged truth 和 gap-visible。 | 统一 global ready / release / deployment lifecycle。 | 本仓只拥有镜像资产和供给层 local facts，不拥有 runtime/container/consumer truth。 |
| 跨仓关系 | compile/runtime/event/ref/adapter/fake 分类。 | 把消费关系直接写为 Cargo、route、topic 或 external DTO 依赖。 | 防止 owner 反转、循环依赖和伪合同。 |
| 参考 L1-governance | 采用其交接表、回流、复核与停审粒度。 | 复制 outbox、publisher、report、evidence 或治理对象。 | 本仓 outbound inventory 是严格零，且没有这些 owner authority。 |

## 7. 实施承接总览

### 7.1 详细设计真相源到未来实施计划的引用清单

| 承接项 | 已定义位置 | 未来实施计划如何使用 | 当前限制 |
|---|---|---|---|
| 范围、非范围、owner 与 VETO | 00、01、02；Step 1、2 | 每个 boundary 先确认没有扩大到 member/runtime/tools/live-state/Artifact/container/governance 等外部 truth。 | 不能以实现便利扩大范围。 |
| Rust、仓库、依赖与命名约束 | Step 3、4 | 在真正 activation 前核验目标仓、workspace、toolchain、项目级 git identity、目录和 approved dependency。 | 目标仓/manifest/active dependency 当前不存在。 |
| 七模块与五 capability 双轴 | Step 5 | 验证 contracts、domain、application、infra、api、worker、jobs 的向内依赖与 capability 归属。 | 不按 capability 建独立服务或反向依赖。 |
| objects、typed refs、factory、guard、static/live 边界 | Step 6 | 将当前 boundary 所需 object/field/factory 和禁止字段作为代码前置 surface。 | 缺字段必须回 Step 6，不由实现新增。 |
| port、adapter、UoW、repository、fake 限制 | Step 7 | 将所用 port、durable/fake parity、adapter failure 与 entry restriction 纳入同一边界审计。 | adapter implementation 不改变 application trait；fake 不替 external truth。 |
| logical public protocol | Step 8 | 先落 contracts carrier 和 protocol-to-operation mapper，再落相应 handler/service；不绑定未授权 transport。 | 10/10/2/0/6 是逻辑 inventory，不是 server/worker/scheduler inventory。 |
| function flow | Step 9 | 每个 actual boundary 引用其涉及 flow 的顺序、stop rule、UoW 和 side-effect 限制。 | 不自改 canonicalize/reserve/save/result/commit 顺序。 |
| state matrix | Step 10 | 按对象状态机实现合法/非法边，测试和验收复用正式名称。 | 不建立 GlobalState；reserved positive edge 不得前置。 |
| persistence、一致性、error、recovery、idempotency | Step 11、12、13 | 写边界必须同时审计 version、append-only、UoW、stored result、unknown 与 rollback。 | B01/B02/B03/OPEN/PF 未解除时受影响行为不能实施。 |
| config 与依赖绑定 | Step 14 | 仅把已批准 config/slot/adapter binding 纳入 infra composition。 | config 不能改 truth、状态、owner、metadata 或 positive lane。 |
| observability 与 local audit | Step 15 | 将 redaction、低基数、local trace append 约束随相关实现边界审计。 | log/metric/span/slot 不构成 readiness、evidence 或 owner truth。 |
| test seam | Step 16 | 05/07 从 seam 名、oracle、current/future/blocked 分类展开测试门禁。 | 没有 TC、fixture、CI、run/report/evidence 或执行结果。 |

### 7.2 当前可承接的边界类别

| 边界类别 | 当前可以作为未来 07 的设计输入 | 必须保持的限制 |
|---|---|---|
| contracts/domain 纯契约 | typed ID/ref、state enum、factory input、guard、static/live 拒绝、exact-kind 与 redaction规则。 | 仍需正式 03、目标仓与 07 boundary 才能写代码；不能借纯契约 mint external ref/digest。 |
| current Command/Job negative boundary | 合法/非法 shape 在 B01/B02 前 fail-closed，且零 UoW、repository、adapter、trace/history/gap/freshness/result/commit。 | 不把 stop 返回说成 accepted mutation、replay 或 test pass。 |
| Query read boundary | existing committed local truth/projection 的 strict no-write、page/marker/gap/freshness表面。 | Query 不 mint projection、gap、trace、reservation或 refresh/rebuild。 |
| conditional inbound boundary | InboundContractMarker 的 Unavailable/Rejected/ReopenRequired 和 accepted_input=false。 | 无 envelope、payload、event id、receipt、dedup、quarantine、UoW 或 truth write。 |
| config/fake/local composition | body-free config ref、slot、TestOnly fake、Assembled/Blocked 的 local 含义。 | 不使用 fake 生产 fallback；Available/Assembled 不等 external health、candidate/consumer/runtime readiness。 |
| future positive boundary | 仅记录对象、guard、port、flow 和 blocker 重开条件。 | 不创建 mutation、replay、builder call、Artifact Accepted、consumer Resolved、projection recovery 或 evidence。 |

### 7.3 实施前置阅读清单

| 文档 / 规范 | 阅读目的 | 当前状态与使用纪律 |
|---|---|---|
| 正式 00-需求文档.md | 确认本仓目标、非目标、VETO、owner 和验收语义。 | 当前可用；不得以旧 00 覆盖。 |
| 正式 01-架构设计.md | 确认语义边界、依赖方向、truth/projection 与 seam 分类。 | 当前可用；不得将 runtime/ref/adapter 升格 compile。 |
| 正式 02-概要设计.md | 确认对象骨架、接口/flow/state 主线及回退规则。 | 当前可用；主语变动要回退 02。 |
| 正式 03-详细设计.md | 实现代码的正式契约入口。 | 当前未生成；必须在 Step 19 后阅读，不可用旧正式 03 代替。 |
| 03 Step 1 至 Step 17 calibration | 在正式 03 某一字段、flow、state 或 blocker 的来源需要追溯时使用。 | 只读与正式 03 一致的相关 Step，不要求无差别复制整个目录。 |
| 正式 04-配置设计.md | 确认 config source、key、profile、adapter binding 与 secret 安全边界。 | 新版未生成；缺失时不得猜 key/product/endpoint。 |
| 正式 05-测试方案.md | 确认可执行 suite、fixture、执行方式、artifact/report 规则。 | 新版未生成；Step 16 seam 不能替代。 |
| 正式 06-验收标准.md | 确认 gate、VETO、验收映射和 evidence 语义。 | 新版未生成；不得伪造 verdict/signoff。 |
| 正式 07-实施计划.md | 确认当前 phase/commit boundary、阅读矩阵、implementation ledger、planned skeleton 和暂停条件。 | 当前未生成；没有它不得实施。 |
| standards/coding/rust.md | 确认英文命名、rustdoc、public enum variant、错误/测试命名与 domain purity。 | 当前适用的 planned Rust baseline；实际 toolchain由 07 激活时核验。 |
| standards/document/子项目目录与代码文件组织规范.md | 确认项目 slug、workspace/member/package/crate/目录命名。 | 实现仓创建前必须重读。 |
| standards/document/代码实施台账与门禁规范.md | 确认实施台账、边界门禁和事实记录纪律。 | implementation ledger 只能在 07 建立。 |
| standards/document/实施计划书写规范.md 与实施计划讨论流程_SOP.md | 确认 phase、commit、任务、提交与永久记忆种子应如何在 07 收敛。 | 本 Step 只引用其边界，不提前执行其 Step。 |
| standards/document/设计真相源闭环与可落码性标准.md | 在 07 boundary 审计中复核字段、DTO、Query、状态、前置 surface 和 phase isolation。 | 不能以“适用该标准”的口号替代逐项结论。 |
| 项目级提交规则与实现仓 git config | 确认 project-level user.name/user.email、英文 commit 格式和 footer。 | 仅在目标实现仓实际存在且 07 允许时检查；不使用 global config。 |

### 7.4 实施前检查清单

| 检查项 | 必须满足的条件 | 不满足时处理 |
|---|---|---|
| 正式设计基线 | 新版正式 03 已由 Step 19 装配，且与相关 calibration 无冲突。 | 暂停，回写 Step 19 或冲突来源。 |
| 下游设计基线 | 新版正式 04、05、06、07 已生成并停审。 | 暂停，不以 legacy 文件或本 Step 草稿代替。 |
| 实际 boundary | 07 已定义当前 phase/commit boundary，并完成其逐项整体可落码审计。 | 暂停，不自行拆任务或 commit。 |
| 目标实现仓 | quantalithos-member-images 的路径、创建/接管方式和工作区状态已在 07 首个 activation boundary 确认。 | 暂停代码、Cargo、配置、测试和提交写入。 |
| workspace 与技术栈 | root manifest、members、edition/rust-version、工具链和目录均与正式 03/07 一致。 | 回写 07 或设计；不凭 Step 4 planned tree创建事实。 |
| git identity 与提交纪律 | 项目级 user.name/user.email 与 07 当前 boundary 的 commit 规则通过核验。 | 修复项目级配置后再允许提交；当前不提交。 |
| compile dependency | 仅已获正式批准、包名/lib 名/路径已实际核验的依赖可进入 Cargo。 | 没有 active sibling Cargo dependency；MI-UP-004 未关前不加 Core path。 |
| write path | 当前 boundary 若涉及 Command/Job mutation，B01/B02 和所需 UoW/result surface已在同一边界闭合。 | 暂停 write path；不得以 fake 或 negative result绕过。 |
| owner contract | 任何 builder/gate/Artifact/consumer/inbound/outbound positive lane都有正式 owner contract和重新校准记录。 | 使用 blocked/gap/no-write，不实现正向 lane。 |
| verification | 05/06/07 已为本 boundary 定义而非伪造测试/验收门禁。 | 暂停，不生成 run/report/evidence/verdict。 |

## 8. 跨文档一致性预复核

### 8.1 真相源表

| 设计事实 | 真相源 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 本仓范围、owner、VETO 与需求语义 | 00 | §2、§4、§9至§15 | 03、04、05、06、07 | 与历史材料冲突时以重建版 00 为准。 |
| 架构边界、责任段、依赖与数据所有权 | 01 | §4至§10、§15 | 03、04、07 | 不得从消费关系推导 source/Cargo dependency。 |
| 五 capability、对象/接口/flow/state 骨架 | 02 | §4至§13 | 03 Step 5至17、05、06、07 | 主语改变时回退 02 对应 Step。 |
| 实现范围、Rust、目标仓与布局 | Step 1至4 | 03 Step 1至4 | 07 activation、实现仓 | planned 不等存在；目标仓/manifest要实际复核。 |
| 模块职责与依赖方向 | Step 5 | 七模块/五 capability 矩阵 | 07 boundary/Cargo review | contracts→domain→application；infra实现 port；entry 不直写。 |
| object、field、factory、ref、guard | Step 6 | §6至§16 | domain/application/contracts/test | 字段缺失或新对象回 Step 6，不得代码补齐。 |
| port、adapter、repository、UoW、fake | Step 7 | §5至§15 | application/infra/entry/test | adapter 不改 application trait；fake 不替 owner truth。 |
| logical protocol与public carrier | Step 8 | §1、§2至§8 | contracts/api/worker/jobs | DTO/mapper 冲突回 Step 8；transport仍未绑定。 |
| function flow 与当前 stop rule | Step 9 | §7至§12 | application/entry/07 | 不自改 UoW/idempotency/side-effect 顺序。 |
| local state machine | Step 10 | §3至§10 | domain/test/05/06/07 | 状态名/edge 冲突回 Step 10。 |
| persistence、error、recovery、concurrency | Step 11至13 | 各 Step 的 store/error/replay/blocker ledger | application/infra/test/07 | 不自动 repair、last-write-wins、lease/TTL 或重算 replay。 |
| config、dependency、observability、test seam | Step 14至16 | config/slot、signals、test seams | 04、05、06、07 | 不从 config/signal/test seam推导 readiness/evidence。 |
| phase/commit/implementation ledger | 未来 07 | 正式 07 与其 calibration | implementation agent | Step 17 不拥有这些真相；缺失即开工 blocker。 |

### 8.2 字段闭环表

下表只复核会影响对象构造、阶段隔离和未来 boundary 判断的关键字段组。完整字段、类型、factory 及每个禁止事项仍以 Step 6 为唯一来源；“未来 05/06”不是 TC、evidence 或验收事实，而是对应文档尚待生成的入口。

| Domain / technical 对象 | 关键字段组 | 类型 / 来源 | 构造入口 | DTO / Event / Job 字段或派生 | 缺失处理 | 测试切口来源 | 验收入口 |
|---|---|---|---|---|---|---|---|
| ImageFamilyDefinition | family_id、family_name、variant_refs、active_revision_ref、lifecycle | ImageLocalId 由 application；safe name/typed local refs 来自 command/local relation。 | create、attach_variant、mark_resolved。 | DefineImageVariantRequest；revision pointer 由后续 exact local read/flow协调。 | 缺 local relation/reason 时 reject/blocked；不以 Role body补齐。 | definition_lifecycle_matrix。 | 未来 06，未定义。 |
| ImageVariantDefinition | variant_id、family_ref、persona_label、mapping_snapshot_ref、current_revision_ref | app ID、command、body-free MappingSourceSnapshotRef。 | define、bind_mapping、link_revision。 | DefineImageVariantRequest 与 safe mapping snapshot。 | mapping owner/schema不可验证时 Draft/Blocked/gap；不 hardcode mapping。 | definition_lifecycle_matrix、get_image_variant_definition_read_only。 | 未来 06，未定义。 |
| AssemblyBaseline | baseline identity、variant/mapping refs、component pins、seed bindings、base ref、completeness、captured_at | typed local/external static refs；app clock；immutable/pinned guard。 | capture、apply_completeness、supersede。 | CaptureAssemblyBaselineRequest 的 static input set；不含 runtime/live body。 | 缺 pin/seed/base/safe conclusion为 Incomplete/Blocked/Conflict；不使用 latest/selector。 | assembly_baseline_completeness_matrix。 | 未来 06，未定义。 |
| VariantRevision | revision identity、variant/baseline refs、derivation reason、lifecycle、supersedes | local refs、pure guard、app ID/clock。 | propose、validate、supersede。 | ProposeVariantRevisionRequest。 | baseline不完整/关联冲突为 Invalid/Blocked；不直接启动 builder。 | variant_revision_lifecycle_matrix。 | 未来 06，未定义。 |
| MappingSourceSnapshot、ComponentPinSet、SeedPlacementBinding | owner/kind/revision、declared use、static placement、pin completeness | body-free safe ref/conclusion；禁止 Role/component/seed body。 | capture、assemble、bind、guard check。 | Define/Capture request 的 typed refs；future Refresh job只能在 reopen 后使用。 | owner missing/stale/conflict走 ref validity/gap；template不变 live state。 | static_seed_not_live_state、reference_validity_matrix。 | 未来 06，未定义。 |
| BuildIntent | intent_id、revision_ref、trigger kind/ref、metadata、lifecycle、reason | app ID/clock、validated command/job metadata、typed trigger ref。 | request、accept、block、cancel。 | RequestBuildIntentRequest 或 future bounded job selection。 | B01/B02 当前在 context后停止；MI-UP-005 event不得产生 Accepted。 | build_intent_lifecycle_matrix、all_command_job_b01_b02_zero_effect。 | 未来 06，未定义。 |
| BuildInputSnapshot | snapshot_id、revision/baseline refs、input_identity、lifecycle、captured_at | exact local refs、canonical static bindings、app clock。 | capture、validate_against。 | future Request/Record flow 的 derived static input；不是 payload/digest。 | 不完整/冲突保持 Incomplete/Invalid；不原地增加输入。 | build_snapshot_lifecycle_matrix。 | 未来 06，未定义。 |
| BuildAttempt 与 BuildOutcomeConclusion | attempt/intent/snapshot refs、handoff/execution ref、result kind、immutable output identity、reason | exact local relation和 future safe builder/registry observation。 | start、record_handoff、record_outcome、mark_unknown。 | RecordBuildOutcomeRequest.outcome；不接 provider body/ACK/tag。 | unavailable/unknown不重试、不形成 candidate；Q-MI-003 pending。 | build_attempt_lifecycle_matrix、reconcile_build_attempts_stop_boundary。 | 未来 06，未定义。 |
| CandidateImage | candidate/attempt/revision/output/basis refs、lifecycle、reason | matching attempt + Complete snapshot + safe outcome + verified immutable identity。 | form、reject、block、mark_unknown。 | RecordBuildOutcomeRequest 的 safe outcome chain。 | 缺 correlated safe identity为 Blocked/Unknown/Rejected；不得猜 digest。 | candidate_lifecycle_matrix。 | 未来 06，未定义。 |
| ProvenanceBinding | candidate/snapshot/execution/output refs、source bindings、lifecycle | same candidate chain、safe source refs、pure provenance guard。 | bind、verify、mark_conflict。 | EvaluateCandidateEligibilityRequest。 | missing/invalid role chain为 Incomplete/Conflict；不由 log/tag/availability补 Complete。 | provenance_lifecycle_matrix。 | 未来 06，未定义。 |
| GateEvaluation | candidate、applicable gate set ref、conclusions、state/reason/replacement | authority-owned typed refs/safe conclusion。 | open、record_conclusion、close。 | EvaluateCandidateEligibilityRequest 的 gate inputs。 | Q-MI-004 下不能 default-pass；Pending/Blocked/Unknown。 | gate_evaluation_lifecycle_matrix。 | 未来 06，未定义。 |
| EligibilityDecision | candidate/provenance/gate refs、lifecycle、reason | exact same-candidate local reads和 gate/provenance result。 | decide、evaluate、supersede。 | EvaluateCandidateEligibilityRequest。 | 缺/unknown/failed input不得 Eligible；不跨到 entry。 | eligibility_lifecycle_matrix。 | 未来 06，未定义。 |
| ArtifactHandoffRecord | candidate/eligibility refs、optional Artifact ref、formal resolution/gap、state | local qualification refs；future owner ArtifactConsumableRef/ContractResolutionRef。 | open、record_gap、reserved bind_artifact_ref。 | RecordArtifactHandoffRequest。 | MI-UP-007 下仅 Pending/Gap；不 mint Artifact version/lineage/ref。 | artifact_handoff_lifecycle_matrix。 | 未来 06，未定义。 |
| AvailabilityTransition | variant/action/candidate/prior/resulting refs、state、reason、time | exact local facts、app ID/clock、AvailabilityTransitionGuard。 | propose、commit、reject、supersede。 | Publish/Transition/Rollback requests。 | B03 下不更新/删除/reinsert/overwrite existing history；guard failure non-positive。 | availability_transition_lifecycle_matrix。 | 未来 06，未定义。 |
| InstantiableEntry | variant/candidate/eligibility/provenance/image/transition refs、lifecycle | local qualification chain、verified immutable image ref、committed local transition。 | create、publish、retire、supersede。 | PublishInstantiableEntryRequest、Transition/Rollback local relation。 | non-Eligible/non-Complete/mutable input不能 Available；Available非 consumer/runtime fact。 | instantiable_entry_lifecycle_matrix、resolve_instantiable_entry_read_only。 | 未来 06，未定义。 |
| ConsumerHandoffGap | entry/consumer contract/resolution/confirmation refs、gap kind、state/reason | local entry plus optional formal owner refs。 | open、reserved resolve、mark_stale。 | Resolve query/reconcile job reads；future positive owner input。 | MI-UP-001 下 Open/Stale/Gap；Available不能关闭 gap。 | consumer_handoff_gap_lifecycle_matrix。 | 未来 06，未定义。 |
| ExternalReferenceSnapshot | source ref、declared use/lane、safe conclusion、validity/reason/replacement | approved body-free source conclusion、app ID/clock。 | capture、invalidate、supersede。 | future refresh Job input; no current inbound payload. | non-Valid不原地恢复；cache/fake/body不可判 Valid。 | reference_validity_matrix。 | 未来 06，未定义。 |
| ContractGap | seam/owner/affected lane/reason/resolution/expiry/state | local boundary diagnosis或 future formal ContractResolutionRef。 | open、block、reserved resolve、expire。 | command/job future safe boundary result。 | 只冻结一个 lane；fake/config/ACK/sibling draft不能 Resolved。 | contract_gap_lifecycle_matrix。 | 未来 06，未定义。 |
| ProjectionFreshness 与 ImageDerivedReadModel | projection key/watermark/state/gap/rebuilt time、safe stage summary | committed local truth only、projection guard、app clock。 | start、mark_stale、begin_rebuild、mark_fresh/unavailable。 | existing query selector / future rebuild Job. | PF-UNAVAILABLE-RECOVERY 下 Unavailable不可恢复；Query不 rebuild。 | projection_freshness_matrix、rebuild_image_derived_views_stop_boundary。 | 未来 06，未定义。 |
| ImageTraceRecord | subject/source refs、correlation/causation、safe reason、recorded_at | committed local effect、metadata、app ID/clock。 | record、append via future same UoW。 | no public raw body field；future flow only。 | current command/job/query/inbound不 append；不可 update/delete。 | image_trace_record_is_body_free_and_append_only。 | 未来 06，未定义。 |
| ImageOperationContext、ImageIdempotencyRecord、StoredImageOperationResult | channel/name/metadata/UoW mode/key/stable input/result ref/state | validated input、future canonicalizer/ID/clock/store。 | from_write/from_query、reserve/complete/record。 | command/job metadata；Query 不使用写 metadata。 | B01/B02/OPEN 下无 reserve/result/replay；不得从 current truth重算。 | idempotency_lifecycle_matrix、future_same_key_same_input_replay。 | 未来 06，未定义。 |
| InboundContractMarker、ImageJobActionMarker | named boundary/action、safe reason/disposition | entry boundary inspection。 | unavailable/rejected/reopen factory；job action mapping。 | no inbound event body；Job request只含 bounded metadata/scope。 | inbound恒 accepted_input=false；Job 在 B01/B02 前停止。 | conditional_inbound_zero_effect、jobs_bounded_action_stop_boundary。 | 未来 06，未定义。 |
| ImageRuntimeConfigRef、slot、assembly、fake mode | body-free config ref、seam kind、availability、local assembly lifecycle | infra validation和 explicit TestOnly composition。 | bound/blocked、declare/record/start/validate。 | future 04 config binding only。 | 不含 key/value/secret/endpoint；Assembled/slot Available不是 readiness。 | config_validation_is_redacted_and_fail_closed、slot_assembly_is_local_only。 | 未来 06，未定义。 |

### 8.3 DTO / Event / Job 到 Domain 对象构造闭环表

“已定义”只表示 request/body、目标对象、guard 与缺失语义可回指；它不解除当前 B01/B02 的 mutation stop。所有 future write 行均需在实际 07 boundary 内再次证明 canonicalizer、result mapper、UoW、repository 和 test gate 同 boundary 可用。

| 输入契约 | 目标对象 / 当前目标 | 字段构造预复核 | 派生字段来源 | 不得混同 | 当前缺失行为 | 关联 flow |
|---|---|---|---|---|---|---|
| DefineImageVariant | ImageFamilyDefinition、ImageVariantDefinition、MappingSourceSnapshot/guard | request shape已定义；写对象当前 blocked。 | app ID/clock、safe mapping snapshot、local family relation。 | persona label 不等 RoleDefinition body；mapping snapshot不等 mapping truth。 | invalid typed ref/metadata在 UoW 前 reject；合法 shape在 B01/B02 stop。 | DefineImageVariantFlow。 |
| CaptureAssemblyBaseline | AssemblyBaseline、ComponentPinSet、SeedPlacementBinding、guards | static input carrier已定义；写对象当前 blocked。 | exact refs、safe conclusion、app ID/clock。 | template/seed不等 live memory/workspace；pin不等 mutable tag/latest。 | incomplete/conflict/owner pending fail closed；B01/B02 stop。 | CaptureAssemblyBaselineFlow。 |
| ProposeVariantRevision | VariantRevision、baseline/definition guards | request/guard mapping已定义；写对象当前 blocked。 | exact variant/baseline reads、guard、app ID/clock。 | Buildable不等 build/candidate. | relation mismatch/invalid baseline reject or blocked；B01/B02 stop。 | ProposeVariantRevisionFlow。 |
| RequestBuildIntent | BuildIntent，future BuildInputSnapshot | request mapping已定义；当前只可 stop。 | exact Buildable revision、trigger ref、metadata、app ID/clock。 | local intent Accepted不等 builder acceptance。 | MI-UP-005 forbids event Accepted；all write path B01/B02 stop。 | RequestBuildIntentFlow。 |
| RecordBuildOutcome | BuildOutcomeConclusion、BuildAttempt，conditional CandidateImage | safe outcome fields/guard已定义；当前不可 record。 | exact attempt/snapshot, safe adapter observation, app ID/clock。 | ACK/tag/cache/raw digest 不等 verified output identity。 | Unknown/Unavailable/invalid chain不 candidate；B01/B02/Q-MI-003 block。 | RecordBuildOutcomeFlow。 |
| EvaluateCandidateEligibility | ProvenanceBinding、GateEvaluation、EligibilityDecision、ContractGap | local object relation已定义；当前不可 write。 | exact candidate chain、safe authority/gate conclusion、app ID/clock。 | Complete、Passed、Eligible 是不同 subjects。 | missing authority/gate -> Pending/Blocked/Unknown；不得 default-pass。 | EvaluateCandidateEligibilityFlow。 |
| RecordArtifactHandoff | ArtifactHandoffRecord、ContractGap | Pending/Gap carrier已定义；Accepted reserved。 | local eligible chain；future ArtifactConsumableRef + ContractResolutionRef。 | image ref/ACK/fake 不等 Artifact acceptance/lineage。 | MI-UP-007 -> Pending/Gap only；B01/B02 stop。 | RecordArtifactHandoffFlow。 |
| PublishInstantiableEntry | InstantiableEntry、AvailabilityTransition | local pin/qualification chain已定义；当前不可 write。 | exact candidate/eligibility/provenance/image refs、guard、ID/clock。 | local publish不等 registry/Artifact/consumer delivery。 | non-Eligible/non-Complete/mutable input reject/blocked；B01/B02 stop。 | PublishInstantiableEntryFlow。 |
| TransitionAvailability | AvailabilityTransition，conditional entry relation | action/current-facts carrier已定义；B03 unresolved。 | exact local current facts、guard、ID/clock。 | transition kind不等 lifecycle; local history不等 external rollback。 | invalid action/target reject; B03 blocks terminal persistence design。 | TransitionAvailabilityFlow。 |
| RollbackOrRetireEntry | AvailabilityTransition、InstantiableEntry | request/target guard已定义；current mutation blocked。 | exact local prior/target facts、guard、ID/clock。 | local rollback不等 registry/container rollback。 | self/invalid target reject; B03/B01/B02 block. | RollbackOrRetireEntryFlow。 |
| 10 Query request | View/page/marker only；不构造 domain mutation。 | response/source/ref/page rules已定义。 | existing committed truth or existing projection only。 | public cursor不等 version/watermark/idempotency key。 | missing/visibility unavailable/gap/stale按每 Query surface；zero write。 | Step 9 Query flows。 |
| ConsumeVerifiedBuildRequest | InboundContractMarker only。 | 无 event schema/body/envelope，因此没有 target truth构造。 | named boundary inspection and SafeReason. | marker不等 event receipt/dedup/build intent。 | Unavailable/Rejected/ReopenRequired，accepted_input=false，zero write。 | ConsumeVerifiedBuildRequestFlow。 |
| ConsumeVerifiedSourceRefresh | InboundContractMarker only。 | 无 source-refresh payload/target snapshot构造。 | named boundary inspection and SafeReason. | marker不等 source validity/refresh result。 | Unavailable/Rejected/ReopenRequired，accepted_input=false，zero write。 | ConsumeVerifiedSourceRefreshFlow。 |
| RunNightlyBuildSweep | ImageJobActionMarker；future bounded BuildIntent selection。 | job name/scope/page carrier已定义；当前无 page/select/write。 | future explicit repository page and canonical job metadata。 | nightly action不等 scheduler tick/run/report。 | B01/B02/Q-MI-003 and scope prerequisites -> stop. | RunNightlyBuildSweepFlow。 |
| ReconcileBuildAttempts | ImageJobActionMarker；future BuildAttempt/outcome observation。 | bounded scope carrier已定义；当前无 attempt inspection。 | future exact page and safe builder observation。 | reconciliation不等 blind retry。 | B01/B02/Q-MI-003 -> stop; Unknown remains unknown。 | ReconcileBuildAttemptsFlow。 |
| ReevaluatePendingQualifications | ImageJobActionMarker；future qualification contexts。 | bounded scope carrier已定义；current no re-evaluation。 | future exact page, authority/gate safe conclusion。 | job repeat不等 gate pass。 | B01/B02/Q-MI-004 -> stop; no default-pass。 | ReevaluatePendingQualificationsFlow。 |
| RefreshExternalReferenceSnapshots | ImageJobActionMarker；future ExternalReferenceSnapshot/ContractGap。 | declared-use carrier已定义；current no resolver/capture. | future exact snapshot read and approved safe conclusion。 | refresh不等 owner body ingestion. | B01/B02/owner ref pending -> stop。 | RefreshExternalReferenceSnapshotsFlow。 |
| RebuildImageDerivedViews | ImageJobActionMarker；future read model/freshness marker。 | projection selector/key carrier已定义；current no rebuild. | committed local truth watermark only。 | rebuild不等 query repair/readiness. | B01/B02/PF -> stop; Unavailable no fabricated recovery。 | RebuildImageDerivedViewsFlow。 |
| ReconcileArtifactAndConsumerHandoffs | ImageJobActionMarker；future local Pending/Gap/Open/Stale maintenance。 | bounded target carrier已定义；positive handoff absent。 | exact local handoff/gap page and owner formal refs if any。 | local entry Available不等 Artifact Accepted/consumer Resolved。 | B01/B02/MI-UP-001/007 -> stop; no accept/resolve/confirm。 | ReconcileArtifactAndConsumerHandoffsFlow。 |
| Outbound Event | None；ImageOutboundEventInventory::NoneAuthorized only。 | zero inventory is explicit closure. | none. | local publish/trace/result不等 outbound payload/delivery。 | no DTO/topic/outbox/publisher/receipt/retry may be created. | no outbound flow。 |

### 8.4 Query response / view 闭环表

| Query | Response DTO / view | 字段与来源摘要 | empty / gap / unavailable / freshness 口径 | public id/ref 规则 | Step 16 seam | 预复核结论 |
|---|---|---|---|---|---|---|
| GetImageVariantDefinition | ImageQueryResponse<ImageVariantDefinitionView> | variant/family/current revision/mapping snapshot from exact local definition reads. | missing or authority unavailable -> None/Unavailable; linked revision断裂可按协议返回 safe partial + gap; Fresh仅有 existing DefinitionSummary。 | request VariantRef；view ref只能来自 existing projection index。 | get_image_variant_definition_read_only。 | pass_with_pending_authority。 |
| GetAssemblyDerivation | ImageQueryResponse<ImageAssemblyDerivationView> | revision/baseline/pins/seed/base safe refs from exact local reads. | incomplete/relationship gap可安全 partial；no owner body; RequireFresh/InspectMarker无 existing DefinitionSummary则 Unavailable。 | request RevisionRef；no cursor/version substitution。 | get_assembly_derivation_read_only。 | pass_with_pending_owner_refs。 |
| GetBuildTrace | ImageQueryResponse<ImageBuildTraceView> | persisted intent/attempt/outcome/candidate local chain. | missing selector/visibility/preference failure -> None; incomplete item不重算、不 probe builder；Fresh only existing BuildTrace projection。 | ImageBuildTraceSelector uses IntentRef or VariantRef explicitly. | get_build_trace_read_only。 | pass_with_pending_data. |
| GetProvenanceAndEligibility | ImageQueryResponse<ImageProvenanceEligibilityView> | existing candidate/provenance/gate/eligibility local chain. | missing/gap/authority unavailable remain explicit; no gate/evidence fetch; Fresh only existing QualificationSummary. | request CandidateRef; local refs remain typed. | get_provenance_and_eligibility_read_only。 | pass_with_pending_authority. |
| ResolveInstantiableEntry | ImageQueryResponse<ImageInstantiableEntryResolutionView> | existing local entry plus ConsumerHandoffGap from supply/gap reads. | entry may be partial only with typed consumer gap; no consumer confirmation; Fresh only existing SupplyCatalog. | request local entry/variant selector and optional formal consumer context; none is not confirmation. | resolve_instantiable_entry_read_only。 | pass_with_MI-UP-001. |
| ListAvailableVariants | ImageQueryPageResponse<ImageAvailableVariantItem> | existing SupplyCatalog page, local Available entry and safe label. | Empty only in explicit readable local catalog scope; stale/gap marker visible; RequireFresh requires existing Fresh catalog. | ImagePublicPageCursor from application page mapper only. | list_available_variants_page_read_only。 | pass_with_pending_visibility. |
| GetAvailabilityHistory | ImageQueryPageResponse<ImageAvailabilityHistoryItem> | append-only local transition history. | empty only exact readable variant scope; relation conflict not hidden as partial; no projection companion so freshness preferences Unavailable. | request VariantRef + public cursor; cursor is not version/watermark. | get_availability_history_page_read_only。 | pass_with_B03_history_limit. |
| GetImageTrace | ImageQueryPageResponse<ImageTraceViewItem> | existing body-free append-only local trace. | empty exact subject scope only; source mismatch is gap/none; no fresh projection companion. | request local subject ref + public cursor; external sources remain OpaqueReference. | get_image_trace_page_read_only。 | pass_with_future_trace_write. |
| GetContractGaps | ImageQueryPageResponse<ImageBoundaryGapViewItem> | selector-bounded ContractGap or ConsumerHandoffGap reads. | Empty only explicit readable selector; relation gaps stay typed; RequireFresh only existing ContractGapSummary. | ImageBoundaryGapRef preserves Contract vs Consumer variant. | get_contract_gaps_page_read_only。 | pass_with_pending_owner_resolution. |
| GetProjectionFreshness | ImageQueryResponse<ImageProjectionFreshnessView> | existing projection key-to-marker relation and committed-source refs. | marker missing/rebuilding/unavailable/visibility failure follow marker surface; Query never mint/rebuild. RequireFresh only existing Fresh. | public projection key maps to existing lookup key; no query-name/cursor synthesis. | get_projection_freshness_read_only。 | pass_with_PF_blocker. |

共同约束：

- ImageQueryVisibility::Visible 是 local read-path reachability，不是 authentication、authorization、scope membership、consumer entitlement 或 governance approval。
- ImageQuerySurface 的 status、content_state、view_ref、projection_key、freshness、gap_refs 和 source_subject_refs 必须来自已定义的 read/projection source；service/fake 不得从错误文本、cache 或字符串合成 marker。
- Query 永不 reserve idempotency、写 trace/gap/freshness、refresh reference、rebuild projection 或修 local truth。

### 8.5 状态闭环表

Step 10 的 19 张 matrix 覆盖 20 个 local lifecycle subject；ImageFamilyDefinition 与 ImageVariantDefinition 共享 DefinitionLifecycle enum，但仍是不同 subject。所有测试入口为 Step 16 的计划 seam，不是测试执行结果；未来 05/06/07 必须采用同一正式名称。

| 状态机 / subject | 正式状态值与起点 | 关键合法边 | 禁止边 / 阶段隔离 | 实现与测试入口 | 当前结论 |
|---|---|---|---|---|---|
| DefinitionLifecycle / family、variant | Draft；Resolved、Blocked、Superseded | Draft -> Resolved/Blocked/Superseded；Resolved -> Blocked/Superseded。 | Blocked/Superseded不能原地 Resolved；Resolved不推 baseline/revision/candidate。 | define/mark_resolved；definition_lifecycle_matrix。 | planned-pure-contract；mutation B01/B02 blocked。 |
| BaselineCompleteness / AssemblyBaseline | Incomplete；Complete、Conflict、Superseded | Incomplete -> Complete/Conflict/Superseded；Complete可重评为 Incomplete/Conflict。 | Conflict/Superseded不能 Complete；immutable input不原地补 pin/seed/base。 | capture/apply_completeness；assembly_baseline_completeness_matrix。 | owner refs and write path future/reopen。 |
| VariantRevisionLifecycle / VariantRevision | Proposed；Buildable、Invalid、Superseded | Proposed -> Buildable/Invalid/Superseded。 | Invalid/Superseded不能 Buildable；Buildable不等 build. | propose/validate；variant_revision_lifecycle_matrix。 | planned-pure-contract；write blocked。 |
| BuildIntentLifecycle / BuildIntent | Accepted/Pending/Blocked；Cancelled | Pending -> Accepted only safe input; Accepted/Pending -> Pending/Blocked/Cancelled。 | Blocked/Cancelled不能 Accepted；Accepted不等 builder acceptance。 | request/accept；build_intent_lifecycle_matrix。 | B01/B02 and MI-UP-005 blocked。 |
| BuildSnapshotLifecycle / BuildInputSnapshot | Incomplete；Complete、Invalid | Incomplete -> Complete/Invalid；Complete may return Incomplete/Invalid on valid recheck. | Invalid不能 Complete；captured input不能追加/替换。 | capture/validate_against；build_snapshot_lifecycle_matrix。 | future/reopen. |
| BuildAttemptLifecycle / BuildAttempt | Created；HandoffPending、OutcomePending、Succeeded、Failed、Unknown | Created -> HandoffPending/Unknown; pending -> outcome conclusion. | Created不能 Succeeded；Unknown/Failed不能原地 Succeeded；replacement only relation。 | start/record_handoff/outcome；build_attempt_lifecycle_matrix。 | B01/B02/Q-MI-003 blocked。 |
| CandidateLifecycle / CandidateImage | Formed；Rejected、Blocked、Unknown | form when correlated complete snapshot/safe outcome/immutable identity all hold. | negative terminal不能 Formed；Formed不跨 qualification/supply。 | form/guard；candidate_lifecycle_matrix。 | future/reopen. |
| ProvenanceLifecycle / ProvenanceBinding | Incomplete；Complete、Conflict | Incomplete -> Complete/Conflict; Complete may discover Conflict. | Conflict不能 Complete；Complete不等 gate/eligibility/Artifact。 | bind/verify；provenance_lifecycle_matrix。 | future/reopen. |
| GateEvaluationLifecycle / GateEvaluation | Pending；Passed、Failed、Blocked、Unknown | Pending collect -> close with applicable authority conclusion. | empty/missing authority不能 Passed；outcome via replacement context。 | open/record/close；gate_evaluation_lifecycle_matrix。 | Q-MI-004 blocked positive. |
| EligibilityLifecycle / EligibilityDecision | Pending；Eligible、Ineligible、Blocked | Pending -> Eligible only same candidate + Complete provenance + Passed gate. | terminal outcome不覆盖；Eligible不等 entry/Artifact/consumer. | decide/evaluate；eligibility_lifecycle_matrix。 | Q-MI-004/B01/B02 blocked. |
| ArtifactHandoffLifecycle / ArtifactHandoffRecord | Pending；Gap、Accepted reserved | Pending/Gap -> Gap; Accepted only formal Artifact ref + resolution. | Accepted不能 overwrite to Gap; image ref/ACK/fake不能 Accepted。 | open/record_gap/bind reserved；artifact_handoff_lifecycle_matrix。 | MI-UP-007 blocked. |
| AvailabilityTransitionLifecycle / AvailabilityTransition | Proposed；Committed、Rejected、Superseded | Proposed -> Committed/Rejected/Superseded; history replacement relation. | Committed/Rejected不能回 Proposed/each other；no old-history rewrite。 | propose/commit/reject；availability_transition_lifecycle_matrix。 | B03 plus B01/B02 blocked. |
| InstantiableEntryLifecycle / InstantiableEntry | Unavailable；Available、Superseded、Retired | Unavailable -> Available only immutable pinned/local qualification/committed transition. | Superseded/Retired不能 Available；Available不等 runtime/consumer. | create/publish/retire；instantiable_entry_lifecycle_matrix。 | future/reopen. |
| ConsumerHandoffGapLifecycle / ConsumerHandoffGap | Open；Resolved reserved、Stale | Open -> Stale; Open -> Resolved only formal contract/resolution/confirmation. | Stale -> Resolved、Resolved -> Open forbidden; entry Available cannot close gap. | open/resolve reserved；consumer_handoff_gap_lifecycle_matrix。 | MI-UP-001 blocked. |
| ReferenceValidity / ExternalReferenceSnapshot | Valid/Stale/Conflict/Unavailable | capture maps safe conclusion; Valid -> non-Valid; replacement is new capture. | non-Valid不能原地 Valid；one declared use不跨 lane。 | capture/invalidate；reference_validity_matrix。 | future owner safe seam. |
| ContractGapLifecycle / ContractGap | Open；Blocked、Resolved reserved、Expired | Open -> Blocked/Expired; formal resolution may resolve Open/Blocked. | Resolved/Expired不能 reopen; no global readiness. | open/block/resolve reserved；contract_gap_lifecycle_matrix。 | owner resolution and write path blocked. |
| ProjectionFreshnessLifecycle / ProjectionFreshness | Stale；Rebuilding、Fresh、Unavailable | Stale -> Rebuilding -> Fresh; Fresh/Rebuilding -> Stale; Stale/Rebuilding -> Unavailable. | Unavailable -> Rebuilding/Fresh has no formal recovery edge; Fresh not readiness. | start/begin_rebuild/mark_fresh；projection_freshness_matrix。 | PF-UNAVAILABLE-RECOVERY blocked. |
| ImageIdempotencyLifecycle / ImageIdempotencyRecord | Reserved；Completed、Conflict | Reserved -> Completed only matching legal stored result; Reserved -> Conflict. | Completed/Conflict不能 Reserved; Query no reservation. | reserve/complete；idempotency_lifecycle_matrix。 | B01/B02/OPEN-01/02 blocked. |
| InboundContractState / InboundContractMarker | Unavailable、Rejected、ReopenRequired | each is boundary disposition factory only. | any marker -> accepted write forbidden; no event lifecycle. | inspect boundary；conditional_inbound_zero_effect。 | current-negative/no-write; MI-UP-005 blocked. |

### 8.6 Public protocol 传递类型闭环表

| 协议 surface | 外层 carrier | 关键传递类型 | 正式归属 / 定义位置 | 缺失、duplicate、retry 口径 | 依赖边界 | 预复核结论 |
|---|---|---|---|---|---|---|
| Command | ImageCommandRequest<T> / ImageCommandResult<T> | ImageCommandName、ImageWriteMetadata、ImageWriteEffectSummary、ImageCommandOutcomeKind、ImageProtocolError、typed refs/gaps。 | contracts；Step 8 §2至§3。 | invalid -> safe reject; future duplicate only reads stored shell/body; B01/B02 currently no reservation/result. | contracts 不依赖 domain；logical in-process only。 | schema pass; mutation/replay blocked. |
| Query | ImageQueryRequest<T> / ImageQueryResponse<T> / ImageQueryPageResponse<T> | ImageQueryName、ImageQuerySurface、visibility/status/content state、ImagePublicPageCursor/Info、views/gap/freshness wrappers。 | contracts；Step 8 §2.4至§4。 | Empty/Gap/Stale/Rebuilding/Unavailable are explicit; no retry/rebuild/write by query。 | contracts 不依赖 domain; public cursor not internal cursor/version/watermark。 | schema pass_with_pending_authority. |
| Conditional inbound | ImageInboundBoundaryResult only | ImageInboundConsumerName、InboundContractMarker disposition、accepted_input=false。 | contracts/worker boundary；Step 8 §5。 | no envelope/payload/event id/receipt/dedup/retry/quarantine exists; Unavailable/Rejected/ReopenRequired only. | no event transport/schema or sibling compile dependency。 | current-negative/no-write. |
| Operations Job | ImageOperationsJobRequest<T> / ImageOperationsJobResult | ImageOperationsJobName、ImageJobPageRequest/Cursor、scope selector/action disposition, ImageWriteMetadata。 | contracts/jobs; Step 8 §7。 | current marker/B01/B02 stop; future duplicate requires same stored local disposition; no run/report/evidence. | bounded in-process entry; no scheduler/lease/cron authority. | schema pass; action execution blocked. |
| Gap/public refs | ImageBoundaryGapRef/Set and detail view items | ContractGapRef versus ConsumerHandoffGapRef, ContractResolutionRef, optional owner refs。 | contracts; Step 8 §2.5/§4. | formal resolution only; no fake/config/ACK close. | ref/adapter seam, never owner body or compile dependency. | pass_with_owner_pending. |
| Projection/public read identity | ImagePublicReadModelRef、ImagePublicProjectionKey、ImageProjectionFreshnessView | projection kind mapper, public cursor, existing marker/ref. | contracts; Step 8 §2.4/§2.5. | missing marker/key obeys Query surface; no mint/rebuild. | projection reads committed local truth; no cache/fake truth. | pass_with_PF_pending. |
| Application internal crossing | ImageOperationContext、ImageOperationName、ImageOperationResultRef、StableOperationInputRef | channel/UoW/replay identity and body-free stable input. | application; Step 6 §13 and Step 7. | B01/B02/OPEN block current canonicalization/result/replay. | not a public contracts DTO; no transport/route/topic semantics. | local design pass_with_blocker. |
| Outbound | ImageOutboundEventInventory::NoneAuthorized only | no outbound DTO/payload/topic/outbox/publisher/receipt. | contracts; Step 8 §6. | no retry/delivery disposition exists because inventory is zero. | no event/compile/adapter implication. | zero_pass; MI-UP-009 remains reopen condition. |

### 8.7 Phase / commit boundary 预复核表

本表不是 phase 划分、任务清单或 commit 计划。它只规定未来 07 在定义任何实际 boundary 时必须检查的条件。当前不得产生 PH 编号、commit 名称、implementation ledger 或 planned boundary skeleton。

| 未来 boundary 若包含 | 同一 boundary 前必须已具备 | 明确不得依赖后续 | 设计复核来源 | 当前预复核 |
|---|---|---|---|---|
| 实现仓 activation / workspace | 正式 03至07、目标仓确认、目录/工具链/项目级 git identity、approved dependency。 | 尚未批准的 Core/sibling Cargo path、未生成的 07 ledger。 | Step 3、4；正式 07。 | blocked until 07. |
| contracts/domain pure types or guards | formal object/typed-ref/state contract、Rustdoc/命名、对应 test seam 与 static/live boundary。 | provider/product/body/digest/live state、future adapter contract。 | Step 6、10、16。 | reference-ready only; no coding authority. |
| Query handler/read model | response/view/page/marker mapper、exact repository read, visibility/freshness source and no-write gate. | query-time rebuild/refresh/gap mint、future state mutation、unapproved visibility authority。 | Step 7至10、12、16。 | design pre-review pass_with_pending. |
| Command or Job write path | concrete canonical input mapper、legal result shell/body mapper、UoW/idempotency/repository ordering、state/test gate all in same boundary. | B01/B02 surface、future stored result, adapter result or acceptance evidence deferred to later boundary. | Step 7至13、16。 | blocked by DDD-S9-B01/B02. |
| Supply transition/history | legal persistence model for Proposed/Committed/Rejected/Superseded and exact-version/append behavior. | delete/reinsert/overwrite, entry state as history substitute, external rollback claim. | Step 7、10、11、13、16。 | blocked by DDD-S11-B03. |
| Projection rebuild/recovery | committed truth source, projection key/marker, UoW/version/error mapping and recovery function. | Query repair, cache/fake watermark, Unavailable -> Fresh/Rebuilding shortcut. | Step 7、9至16。 | PF recovery blocked. |
| Conditional inbound consumer | formal authority/family/schema/identity/version/dedup/receipt/transport semantics plus reopened worker flow/test design. | marker-only boundary or sample payload as accepted event. | Step 7至10、16。 | blocked by MI-UP-005. |
| Builder/registry positive outcome | safe adapter contract, immutable identity basis, unknown/recovery semantics, product/config binding and test gate. | ACK/tag/cache/raw digest as candidate source. | Step 7至16、future 04/05/07。 | blocked by Q-MI-003 and B01/B02. |
| Gate/eligibility positive decision | applicable gate authority/set/conclusions, same-candidate guard, policy/evidence contract, test/acceptance gate. | missing input/default pass/observer signal as Passed/Eligible. | Step 7至16、future 05/06/07。 | blocked by Q-MI-004 and B01/B02. |
| Artifact or consumer positive handoff | exact owner contract/ref/resolution/confirmation and corresponding local state persistence. | local entry Available, image ref, fake or ACK as Artifact Accepted/consumer Resolved. | Step 7至16、future 04至07。 | blocked by MI-UP-001/007. |
| Any test/acceptance/evidence work | 05/06/07 define suite, artifact/report/evidence semantics and boundary-specific gate. | planned test seam name as run, report, evidence, verdict or signoff. | Step 16; future 05/06/07. | blocked; documents absent. |

### 8.8 命名一致性表

| 名称类型 | 正式名称 / 规则 | 禁止旧名、口语名或错误推导 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| 项目与实现仓 | project slug member-images；实现仓 quantalithos-member-images。 | L2-member-images 作为代码仓/package/crate 前缀。 | Step 3、4。 | 07 activation 前按目录规范实际核验。 |
| package/crate | member-images-<role>；member_images_<role>。 | l2_member_images_*、quantalithos_* 内部重复前缀、按 capability 命名 crate。 | Step 4、5。 | 以七职责 member 命名；capability仅作对象/flow主线。 |
| 技术模块 | contracts、domain、application、infra、api、worker、jobs。 | common/utils/manager 顶层逃生舱，或 entry 直接写 domain/repository。 | Step 4、5、7。 | 新文件先做模块归属与依赖审计。 |
| capability | DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived。 | 将其中任一当 service/database/Cargo boundary，或把 ReferenceDerived 当第二 truth。 | Step 5、6。 | 保持 capability × technical module 双轴。 |
| protocol inventory | 10 Command、10 Query、2 conditional inbound、0 outbound、6 Operations Job；总计 28 条 non-outbound logical surface。 | 将 total 改成 active HTTP/broker/cron inventory，或增加“临时 outbound”。 | Step 8、9、16。 | 新增/删减须重开相关 Step并同步审计。 |
| operation identity | ImageOperationName 是 application-owned NonEmptyText newtype；protocol enum经穷尽 mapper形成。 | 从 Debug/Display、route、topic、handler、scheduler tick 或用户字符串猜 operation name。 | Step 6、8、13。 | 只使用 formal literal mapper。 |
| local staged state | Buildable、Accepted、Succeeded、Formed、Complete、Passed、Eligible、Available、Resolved、Fresh 各属不同 subject。 | ready、published、delivered、running、healthy 或统一全局 lifecycle。 | Step 6、10、16。 | 保留完整 state enum和跨阶段 guard。 |
| local publish | PublishInstantiableEntry 和 AvailabilityTransition::Committed 是 local supply/history。 | registry publish、Artifact delivery、Member Service notification、container start/health。 | Step 8至10。 | 对外发布若获授权，重开多 Step。 |
| composition | ImageRuntimeAssemblyLifecycle::Assembled 与 ImageAdapterAvailability::Available 只表 local composition。 | service started、provider healthy、consumer/runtime ready。 | Step 6、14、15。 | signals/metrics不得升级语义。 |
| seed/static input | StaticSeedKind、SeedPlacementBinding、template/ref/static placement。 | live memory、checkpoint、workspace mount、conversation、credential 或 container state。 | Step 6、8、14、16。 | 任一 live field进入即回退边界设计。 |
| outbound | ImageOutboundEventInventory::NoneAuthorized。 | outbox、publisher、delivery、receipt、event payload/topic/retry。 | Step 5、7至9、15、16。 | MI-UP-009 关闭后从范围重开，而非补 mock。 |
| gap/ref | ContractGap 与 ConsumerHandoffGap 有不同 typed refs/lifecycles；external OpaqueReference 与 local ref不互转。 | 一个 generic gap、raw string、empty result或 fake state 代替 owner resolution。 | Step 6至8、10。 | 保持 exact owner/kind/lane 与 formal resolution。 |

### 8.9 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 处理状态 |
|---|---|---|---|---|---|
| MI-DDD-17-001 | 当前正式 03 与 Step 1至17 | 正式文档仍为 historical material，尚未按重建链装配。 | 正式实现真相源。 | 仅在 Step 19 读取旧 03 进行污染审计，并由 Step 1至18/19 重建。 | open; Step 19 only. |
| MI-DDD-17-002 | 04、05、06、07 的新版正式基线 | 下游文档尚未按重建 03 生成；legacy 05/06不可继承。 | config、test、acceptance、implementation gate。 | 按串行文档门禁在后续 SOP 中创建/重写；本 Step 不预写。 | open; document sequence blocked. |
| MI-DDD-17-003 | Step 4 worker 的 prospective“receipt mapping”表述与 Step 8/9 current contract | current inbound contract已收紧为 marker-only，无 receipt/envelope/dedup。 | future worker implementation/readers。 | Step 19 正式 03 必须以 Step 8/9 的 marker-only current boundary为准；receipt只可在 MI-UP-005 后重开。 | pending historical/prospective wording audit. |
| MI-DDD-17-004 | Step 8 Command/Job schema 与 Step 9 current stop | schema/flow存在，但 canonicalizer/result mapper尚未形成合法可调用链。 | 所有 mutation/replay boundary。 | 不视为矛盾或 readiness；07 必须把 B01/B02 前置 surface与写边界放在同一审计范围。 | blocked by DDD-S9-B01/B02. |
| MI-DDD-17-005 | AvailabilityTransition matrix 与 current repository surface | matrix有已有 transition terminal/supersede语义，port/persistence尚无合法模型。 | supply history/rollback/retire。 | 重开 Step 7/10并选择 versioned update或纯 append-final-record模型，再同步 Step 11至16。 | blocked by DDD-S11-B03. |
| MI-DDD-17-006 | ProjectionFreshness Unavailable | matrix明确没有 Unavailable recovery function。 | rebuild/recovery/test/operations job。 | 先补 function、truth source、version/UoW/error/test contract，再重开受影响 Step。 | blocked by PF-UNAVAILABLE-RECOVERY. |
| MI-DDD-17-007 | application replay carrier | stable input/result shell的类型有位置，但 existing Reserved/in-flight 与 namespace/recovery未闭口。 | duplicate/concurrency/crash recovery。 | 重开 canonicalizer/result/store/recovery identity设计；不能私加 lease/TTL/global raw-key index。 | blocked by DDD-S13-OPEN-01/02. |
| MI-DDD-17-008 | local entry 与 external handoff | Available、Artifact Accepted、consumer Resolved 各自是不同 state/owner。 | supply, Artifact, Member Service integration。 | 在 Step 19/04至07继续保持分层；owner formal contract到位后重开对应 Step。 | blocked by MI-UP-001/007. |
| MI-DDD-17-009 | planned Core reuse | Step 3/4只允许 conditional future Core path，当前 active compile dependency为零。 | Cargo/workspace boundary。 | 只有 MI-UP-004正式关闭且 package/lib/path重核验后，07 才可安排相应 boundary。 | pending. |
| MI-DDD-17-010 | old names/legacy quantitative/product claims | 旧正式 03和旧材料尚不可作为 current vocabulary source。 | formal assembly与下游文档。 | Step 19 对历史材料做逐项污染审计；不得在本 Step猜列或继承。 | deferred to Step 19. |

## 9. 正反例

### 9.1 正确的承接引用

~~~md
| 承接项 | 已定义位置 | 未来 boundary 使用方式 |
|---|---|---|
| CandidateImage formation guard | Step 6 BuildCandidate；Step 10 CandidateLifecycle；Step 16 candidate_lifecycle_matrix | 先在同一 boundary 确认 B01/B02、safe outcome、immutable identity和对应 test gate；不足时暂停并回写设计。 |
~~~

正确原因：

- 引用 object、state 和 test seam 的真相源，没有复制或重新发明字段。
- 明确 B01/B02 和 owner input 是前置条件，不把 CandidateImage 误当可立即构造。
- 允许 07 再按实际 phase/commit boundary 审计，而不是预设任务或提交。

### 9.2 错误的正向 mutation 示例

~~~md
先用 fake registry 返回成功，然后实现所有 Command；若缺 digest 就从 tag 计算。
~~~

错误原因：

- fake、registry ACK、tag 或猜测 digest不能成为 CandidateImage 的 safe immutable identity。
- B01/B02 尚未关闭，当前不允许 canonicalize、reserve、UoW、repository、adapter、trace、result 或 commit。
- 这会同时越过 Q-MI-003 和 staged truth 边界。

### 9.3 正确的 Query 承接示例

~~~md
ResolveInstantiableEntry 读取 existing local entry 与 ConsumerHandoffGap；
entry Available 仅表示 local pinned supply，consumer contract未闭合时返回 typed gap，
Query 不创建 gap、不调用 Member Service、不启动 rebuild。
~~~

正确原因：

- view、source、gap 与 no-write 语义均能回指 Step 8/9。
- local entry、consumer confirmation 和 runtime/container state 没有混同。
- MI-UP-001 尚未关闭时仍保持信息可见而不伪造 resolve。

### 9.4 错误的 phase boundary 示例

~~~md
commit-x：实现 Command handler、自动恢复 ProjectionFreshness::Unavailable，
并产出最终验收 evidence。
~~~

错误原因：

- 本 Step 和当前文档链没有定义 commit-x；07 才能拆 boundary。
- PF-UNAVAILABLE-RECOVERY 尚缺正式 recovery function，不能在实现现场发明。
- 测试/验收 evidence 属于新版 05/06/07 的职责，当前没有合法来源。

### 9.5 正确的 inbound 示例

~~~md
ConsumeVerifiedBuildRequest 当前只检查其 named boundary，
返回 Unavailable、Rejected 或 ReopenRequired，accepted_input=false，
并断言没有 envelope、receipt、dedup、UoW 或 local truth write。
~~~

正确原因：

- 与 MI-UP-005 未关闭时的唯一 current contract 一致。
- 不以 sample event、broker offset 或 fake payload扩大协议。
- 可以作为未来测试方案的 current-negative/no-write seam，而不是执行结果。

## 10. Blocker、受影响实现单元与重开条件

| blocker / pending | 受影响实现单元与 logical surface | 当前不得做的事 | 重开 Step / owner 条件 |
|---|---|---|---|
| DDD-S9-B01 | application canonicalizer/UoW/idempotency；api Command；jobs；全部 10 Command、6 Job。 | canonicalize、reserve、begin UoW、read/save、adapter call、trace/history/gap/freshness/result/commit。 | 重开 Step 7/8/9，定义 concrete CanonicalImageOperationInput、每协议字段来源/mapping与同一 boundary 规则；随后复核 Step 11至16。 |
| DDD-S9-B02 | application StoredImageOperationResult/result ref；idempotency store；Command/Job duplicate surface。 | mint result ref、保存 shell/body、complete reservation、DuplicateReplay positive、从 truth重算 response。 | 重开 Step 6/7/8，闭合合法 result identity、factory、shell/body mapper与UoW ordering；随后复核 Step 9、11至16。 |
| DDD-S11-B03 | SupplyEntryRepositoryPort、AvailabilityTransition、TransitionAvailability/RollbackOrRetireEntry。 | delete/reinsert/overwrite existing history，或以 current entry替代 transition terminalization。 | 重开 Step 7/10，选择并闭合 versioned update或append-final-record模型；同步 Step 11至16。 |
| DDD-S13-OPEN-01 | ImageIdempotencyRecord/store/UoW；所有 concurrent first/second writer与crash re-entry。 | 私加 Reserved public result、lease、TTL、cleanup、AlreadyInProgress 或 second-writer retry。 | 重开 Step 6/7/11/13，闭合 lookup、outcome、recovery、durable/fake parity。 |
| DDD-S13-OPEN-02 | channel/name/key identity、cross-command/job replay、idempotency conflict mapping。 | 假定 raw key全局唯一、cross replay、建 global raw-key index。 | 重开 Step 6/7/11/13，统一 namespace、lookup 与 conflict policy。 |
| PF-UNAVAILABLE-RECOVERY | ReferenceDerived projection repository/job/query state；RebuildImageDerivedViews。 | 将 Unavailable直接变 Rebuilding/Fresh，或用 Query/cache/fake恢复。 | 重开 Step 10至16相关 recovery设计，定义 function、committed truth source、version/UoW/error/test；07再审计 boundary。 |
| MI-UP-001 | MemberServiceSupplyPort、ConsumerHandoffGap、ResolveInstantiableEntry、handoff reconcile。 | 虚构 manifest/variant/ref/qualification/confirmation、consumer Resolved、launch/health/readiness。 | L2-member-service 正式停审并与本仓校准 exact consumer contract/ref/confirmation；重开 Step 7至11及受影响 14至16。 |
| MI-UP-002 | component reference resolver、AssemblyBaseline、ComponentPinSet、revision guard。 | 假定 member release shape/compatibility，复制 member truth或 confirmation。 | L2-member/runtime owner提供正式 pinned release/compatibility contract；重开 Step 6至10、14至16受影响 seam。 |
| MI-UP-003 | MappingReferencePort、MappingSourceSnapshot、definition/baseline/revision input。 | hardcode Role-to-variant、复制 RoleDefinition/mapping body、无 fallback判定为 usable。 | L3-method-library正式 body-free query/snapshot/ref contract；重开 Step 7至10、14至16受影响 mapping lane。 |
| MI-UP-004 | Core shared carrier/Cargo possibility。 | 创建 active Core path dependency、shadow shared schema或将 actor ref当 authorization。 | L0-core明确接受 image-specific shared contract，且在目标仓重核 package/lib/path；重开 Step 3/4/7/8/14与 07 dependency boundary。 |
| MI-UP-005 | worker、conditional inbound、BuildIntent/source refresh。 | event envelope/payload/identity/receipt/dedup/quarantine/topic/accepted write。 | Bus/Core/event owner正式关闭 authority/family/schema/identity/version/dedup/receipt/transport；重开 Step 7至10、12、13、16。 |
| MI-UP-006 | SeedReferencePort、SeedPlacementBinding、AssemblyBaseline。 | 复制 policy/memory/workspace template semantic body，或把 seed变 live state。 | template owner正式关闭 semantic owner/ref/placement/static-safe contract；重开 Step 6至10、14至16。 |
| MI-UP-007 | QualificationBoundaryPort、ArtifactHandoffRecord、RecordArtifactHandoff/reconcile。 | mint ArtifactVersion/lineage/consumable ref、Accepted、storage/delivery receipt。 | L1-artifact正式 image handoff schema、ConsumableArtifactReference、resolution/acceptance contract；重开 Step 7至11、14至16。 |
| MI-UP-008 | future base-image/reference slot、AssemblyBaseline enhancement。 | 进入 hardened base current core、读取 Sandbox policy/backend、声明 hardened result。 | L4-sandbox/formal scope提供 pinned base boundary；如启用范围，先重开 00至02及受影响 03 Step。 |
| MI-UP-009 | outbound event/object/port/config/flow/test surfaces。 | 建 outbox/publisher/event DTO/topic/delivery/receipt/retry或用 local publish替代。 | Bus/Core owner给出正式 outbound authority/consumer/schema/version/delivery failure semantics；从 Step 5起跨 Step 重开。 |
| Q-MI-001 | restricted/read-only variant scope、DefinitionAssembly/Qualification。 | 枚举特殊 Role、把它放入核心分母或自产 governance truth。 | 正式 scope/governance decision；必要时回退 00至02并重开对象/协议/state。 |
| Q-MI-002 | architecture dimension、variant identity/snapshot/catalog。 | 自创 architecture enum、coverage/complete ratio或不同 platform success。 | 正式 product/SRE scope与identity basis；回退 00至02并重开受影响 03 Step。 |
| Q-MI-003 | BuilderPort/RegistryPort、infra config/adapter、build candidate。 | 锁定产品、endpoint/credential、猜 digest、把 ACK/presence写成 outcome/candidate。 | Infrastructure/config authority选择安全 adapter/product contract；重开 Step 7至16及未来 04。 |
| Q-MI-004 | QualificationBoundaryPort、gate evaluation、eligibility、Artifact interaction。 | 枚举 BOM/scan/signature、default-pass、生成 evidence/report/gate success。 | security/governance/artifact authority给出 applicable gate/evidence kind/priority/safe conclusion contract；重开 Step 7至16。 |

## 11. 复杂度与可落码性判断

| 维度 | 当前判断 | 对未来实施的含义 |
|---|---|---|
| 结构规模 | 7 个技术模块 × 5 个 capability；28 条 non-outbound logical surface；19 张状态 matrix/20 local subject。 | 07 不能用“一次实现项目”替代逐 boundary 审计；但本 Step 不拆 phase/commit。 |
| 领域复杂度 | definition、assembly、build、qualification、supply、reference 和 replay 是独立 staged truth。 | 任何 boundary 都要避免把前一阶段 positive state自动传播为下一阶段。 |
| 纯领域可落码性 | objects、typed refs、factory、guard、enum、禁止事项和许多 negative cases有唯一来源。 | 正式 03/07 后可作为纯 contracts/domain边界的输入；当前仍无代码授权。 |
| 读侧可落码性 | 10 Query 已有 response/view/page/marker/public ref 与 strict no-write 规则。 | 实现前仍需同 boundary 提供 read port、visibility/freshness source、store/fake parity和 05/06/07 gate。 |
| 写侧可落码性 | protocol-to-object mapping有设计位置，但 canonical input/result/UoW/replay链不完整。 | 所有 Command/Job mutation/replay当前 blocked，不能用“接口已定义”替代闭环。 |
| 跨 owner 复杂度 | Member Service、member/runtime/tools、Method Library、Artifact、Bus、seed/Sandbox、builder/gate owner均为 pending seam。 | 只能实现 fail-closed/ref/gap 语义；正向 adapter/handoff必须等 owner正式闭口和重新校准。 |
| 存储/恢复复杂度 | append-only history、exact version、unknown、replay、projection watermark和 no-write 有严格约束。 | B03、OPEN、PF 未关闭前不得让实现者选择 store/recovery策略。 |
| 验证复杂度 | Step 16有 module/protocol/state/consistency/config/redaction seam，但 05/06/07未生成。 | 可以用于后续测试设计追溯，不能声称 test execution、coverage、evidence或验收。 |
| 总体结论 | 设计层为“可定位、可回写、受 blocker 限制的 implementation-plan input”。 | 不是 implementation-ready，也不是 release-ready；07 的逐 boundary 交付实现前审计仍是必要开工门禁。 |

## 12. 正式 03-详细设计.md §16 回填草稿（禁止当前装配）

> 回填前提：项目级台账允许正式 03 装配、03 flow完成至 Step 19、Step 18和Step 19均获用户确认，且装配前已完成历史污染审计。当前条件不满足。

### 16. 详细设计到实施计划的承接清单

正式 07-实施计划.md 必须以正式 03-详细设计.md 为直接输入，并按实际 phase / commit boundary 引用对应的 03 calibration 文件，用于追溯对象字段、port、protocol、flow、state、persistence、error、config、observability 和 test seam。07 不得复制字段表、DTO 表、function flow、state matrix 或 test seam 形成第二真相源。

本仓的详细设计已为未来实施计划提供七技术模块、五 capability、10 Command、10 Query、2 条 marker-only conditional inbound、6 条 bounded Job、严格 zero outbound、19 张 local state matrix、版本/append-only/UoW/idempotency 约束、config/fake/redaction 边界和最小测试切口。它们仅是实施计划引用输入，不等于实现、测试、发布、Artifact handoff、consumer confirmation 或 readiness。

未来实施者开始任何代码、Cargo、配置、脚本或测试改动前，必须：

1. 阅读当时正式化的 00 至 07、当前 boundary 所需 03 calibration 来源、Rust/目录/实施计划/实施台账/可落码性规范和实现仓项目规则；
2. 由正式 07 确认目标实现仓 quantalithos-member-images、workspace/toolchain、项目级 git identity、目录命名、approved compile dependency、implementation ledger 与 planned boundary skeleton；
3. 对每一个实际 boundary 重新审计字段、DTO/Job 构造、Query view/page/marker、状态、命名、前置 surface、测试/验收输入与 phase isolation；
4. 在 DDD-S9-B01/B02、DDD-S11-B03、DDD-S13-OPEN-01/02、PF-UNAVAILABLE-RECOVERY、MI-UP 或 Q-MI 仍影响该 boundary 时暂停，回写设计或等待 owner正式合同，不得现场补 schema、port、状态、恢复、digest、report 或 evidence。

当前 Command/Job 仅允许 B01/B02 前的 fail-closed zero-effect contract；Query 严格只读；conditional inbound 恒为 marker-only 且 accepted_input=false；ImageOutboundEventInventory::NoneAuthorized 是严格零库存。Available、Assembled、Fresh、Resolved、Accepted、Passed、Eligible、Buildable、Complete 和 Succeeded均只具各自 local/staged 含义，不构成全局或外部 readiness。

## 13. 未进入实施的待确认事项

| 项目 | 当前状态 | 未确认前处理 | 后续责任 |
|---|---|---|---|
| 新版正式 03 | Step 17 后仍待 Step 18/19；旧正式 03不可用。 | 不得实现或用旧正式 03补字段。 | Step 18、19。 |
| 新版正式 04 | 未创建。 | 不猜 config key/source/profile/product/secret binding。 | 04 配置设计 SOP。 |
| 新版正式 05 | 未创建；legacy 文件仅 historical。 | Step 16 seam不当 TC、fixture、CI、run/report。 | 05 测试方案 SOP。 |
| 新版正式 06 | 未创建；legacy 文件仅 historical。 | 不生成 acceptance evidence/verdict/signoff。 | 06 验收标准 SOP。 |
| 新版正式 07 | 未创建。 | 不拆 phase/commit/任务，不建 implementation ledger/skeleton。 | 07 实施计划 SOP。 |
| 目标实现仓 | Step 3 曾核查未发现。 | 不创建仓、Cargo、代码或测试。 | 07 首个 activation boundary。 |
| active compile dependency | 当前为零。 | 不加 Core/sibling path dependency。 | MI-UP-004关闭后由07重核。 |
| write/replay surface | B01/B02、OPEN 尚未关闭。 | 只保留 no-write/future marker。 | 重开受影响 03 Step 后再由07审计。 |
| history terminal / projection recovery | B03/PF未关闭。 | 不实现 history overwrite、auto recovery 或 rebuild shortcut。 | 重开 Step 7/10至16。 |
| external positive lane | MI-UP/Q-MI 仍 pending。 | ref/gap/blocked/unknown/marker-only；无 positive contract。 | 对应 owner正式停审和双方校准。 |

## 14. Step 18 进入条件

| 条件 | 当前结果 | 说明 |
|---|---|---|
| Step 17 承接清单完成 | pass | 本文件覆盖固定 SOP 输出、预复核、blocker 回流和回填草稿。 |
| flow 与项目台账回写 | pass | 已切换为 Step 17 completed_stop_review，且 Step 18 未授权。 |
| 未装配正式 03 | pass | 正式 03仍关闭；旧正式 03仍未读取。 |
| 未创建下游/实施材料 | pass | 未创建 04至07、implementation ledger、planned skeleton、实现仓、Cargo、代码、测试/运行材料。 |
| blocker 明确 | pass_with_explicit_blockers | B01/B02、B03、OPEN、PF、MI-UP、Q-MI未被关闭或弱化。 |
| 用户明确确认 Step 18 | waiting | 这是创建 03_ddd_step_18_risks_open_questions.md 的唯一授权条件。 |

## 15. Step 17 完成停审记录

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP 要求的实施承接、阅读、字段/DTO/Query/状态/命名/boundary 复核齐全 | pass | §3、§7、§8。 |
| 中间产物规范 §5.10 的十类固定输出已覆盖 | pass | §8.1至§8.9、§9。 |
| 所有外部依赖保持 compile/runtime/event/ref/adapter/fake 分类 | pass | §2、§7、§8.1、§10。 |
| 模板/静态 seed/构建产物与 live state分离 | pass | §1、§8.2、§8.8、§9。 |
| 不把 pending 输入写成 positive contract/readiness | pass_with_explicit_blockers | §0.2、§3、§10、§13。 |
| 不提前定义 phase、commit、implementation ledger 或 planned skeleton | pass | §0、§7.4、§8.7、§13。 |
| 不替代 04/05/06/07 | pass | §3、§7.3、§13。 |
| 未实现/执行测试/生成事实/提交 | pass | 本 Step 仅写 calibration 和状态台账；没有实现仓、Cargo、run_id、digest、report、evidence、verdict、signoff 或 readiness。 |
| 下一步门禁 | stop_review_required | 必须等待用户明确确认后才可创建 Step 18。 |

~~~text
Step 17 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_18
step_18_creation_allowed = false_until_explicit_user_confirmation
formal_03_write_allowed = false_until_step_19
old_formal_03_read_allowed = false_until_step_19_historical_audit
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false_until_07
planned_boundary_skeleton_allowed = false_until_07
commit_required = false
~~~
