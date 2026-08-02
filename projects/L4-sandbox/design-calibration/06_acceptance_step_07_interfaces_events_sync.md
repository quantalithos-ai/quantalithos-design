# Step 7. 定义接口、事件与跨仓同步验收

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/验收标准书写规范.md` §5.7
> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_8
> 所属流程: `06_acceptance_calibration_flow.md`
> 协议登记分件: `06_acceptance_step_07_protocol_trace_register.md`
> 同步 /停审分件: `06_acceptance_step_07_sync_review_register.md`
> 本Step口径: 对正式10 Command、13 Query、9 Inbound Consumer、13 Outbound Event和10 Operations Job逐协议建立可裁决门禁,并固定compile / runtime / event / handoff / downstream依赖验收方式。本文不执行验收,不创建run、EV、报告、缺陷、风险、结论或签署,不修改旧正式`06`,不进入Step 8。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 6 | 是。用户明确回复“同意”;Step 6三件、flow和项目台账已转`passed_to_step_7`。 |
| 项目 /文档 /Step门禁 | 通过。Step 7三件已完成并获用户确认;正式`06`仍禁止写入,Step 8现可按自身标准创建中间产物。 |
| 是否读取Step 7标准 | 是。已读取验收SOP Step 7、书写规范§5.7和中间产物规范。 |
| 是否读取正式协议与测试来源 | 是。已复核正式`03` §7 /§8、详细设计协议校准件、正式`04` transport-neutral binding、正式`05` TC / suite / ESLOT / fixed report。 |
| 是否读取上游范围与门禁 | 是。已复核Step 2范围、Step 5功能门禁、Step 6数据 /架构红线及`AC-SBX-031` slice分工。 |
| 是否读取跨仓来源 | 是。已复核正式`00/01`依赖裁剪及L2-tools、L2-runtime、L2-member-service、L1-identity、L1-work中与Sandbox相邻的边界;旧上游文档只用于识别接缝需求,不得覆盖Sandbox当前正式契约。 |
| 是否读取粒度参考 | 是。已读取L1-governance / L1-artifact验收Step 7;只参考表、停审和同步审计结构,不继承其协议或证据编号。 |
| 旧正式`06`定位 | historical material。旧泛化API、host runtime、旧事件 /证据和下游实现假设不得继承。 |
| canonical编号选择 | 不创建平行需求AC。`PG-SBX-001~055`仅为本Step协议检查索引;正式裁决仍回指`AC-SBX-006~023`及`AC-SBX-031 PROTOCOL-SLICE`。 |
| 是否发现阻塞Step 7的上游冲突 | 否。55个正式协议、正式surface、正负TC、planned slot和依赖裁剪均可定位。目标仓、真实下游、route/topic产品和P0-Q缺失只阻塞执行 /激活,不阻塞本Step设计。 |
| 当前真实验收状态 | `NotEntered`;目标实现仓、fixed source run、raw / report、runtime EV和acceptance review均不存在。 |
| 当前Step状态 | 三件中间产物及机械 /语义审计已完成;用户已明确回复“同意”,Step 7审查通过并放行Step 8。 |

### 1.1 Step内计划

| 模块 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| M1 inventory /编号 /phase | 固定55协议、shared carrier、逻辑surface、canonical AC与Step职责 | done | 10 +13 +9 +13 +10精确;不新造AC / route / topic |
| M2 逐协议门禁 | 为PG-SBX-001~055绑定字段、正负TC、slot、source role、suite、report和裁决 | done | 55 /55均可判定,不以五类摘要替代逐项登记 |
| M3 跨仓同步 | 固定compile / runtime / event / handoff / downstream类型及下游未就绪处置 | done | 仅`core-contracts`为sibling compile dependency;无完整下游误要求 |
| M4 停审 /总审 | 执行55项PassDesign停审与跨接口同步审计 | done | 无orphan、协议漂移、依赖误判或证据断裂 |
| M5 回填 /台账 | 形成正式§7草稿并更新两层恢复台账 | done_reviewed | 用户已确认;由Step 8接续 |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|
| M1 inventory /编号 | done | done | done | done | pass | pass | 由M2接续 |
| M2 逐协议门禁 | done | done | done | done | pass | pass | 由M3接续 |
| M3 跨仓同步 | done | done | done | done | pass | pass | 由M4接续 |
| M4 停审 /总审 | done | done | done | done | pass | pass | 由M5接续 |
| M5 回填 /台账 | done | done | done | done | pass | passed_to_step_8 | 用户已确认;由Step 8接续 |

---

## 2. 本步目标与边界

### 2.1 本步必须完成

1. 对55个正式协议逐项固定协议名、正式request / view / envelope / payload / report surface和逻辑传输名。
2. 为每项绑定至少一个正向和关键负向TC、planned ESLOT、future EV form、fixed source role、suite及report path。
3. 固定五类协议的共用通过 /失败 /Blocked谓词,并允许单项记录准确定位到TC、parameter和assertion code。
4. 固定跨仓依赖的全局类型和协作方式,避免把runtime / event / handoff关系误写为源码依赖。
5. 明确真实下游未就绪时P0以fake / controlled / disabled seam裁决,同时保留真实激活成熟度,不得伪造集成成功。
6. 关闭`AC-SBX-031 PROTOCOL-SLICE`;只有与Step 6已批准的`ARCH-SLICE`同时满足时,canonical `AC-SBX-031`才具备总体裁决资格。

### 2.2 本步不完成

- 不重定义request / response字段、enum、状态或错误;只消费正式`03`协议surface。
- 不写HTTP path、RPC method、bus topic、queue、schema registry、job executable或产品endpoint。
- 不裁决UoW save order、状态迁移、duplicate winner、commit unknown、race或跨记录原子性;它们由Step 8加严。
- 不定义性能、容量、可用性、安全量化或真实backend资格总体门禁;它们由Step 9加严。
- 不裁决raw / report pairing、digest、evidence index真实性、review完整性或证据自身redaction;它们由Step 10加严。
- 不分配正式VETO编号,不记录缺陷、risk acceptance、release结论或签署。
- 不要求L2-tools、L2-runtime、L2-member-service、L1-identity、L1-work、L1-artifact、L4-observability、bus或isolation backend完整实现。
- 不拥有tools semantic execution、runtime agent loop、member lifecycle orchestration、Artifact truth、observability store、policy truth或外部调查truth。

---

## 3. 本步输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | reviewed | 提供P0-C / P0-Q、P1 / P2、接缝、非范围与下游未激活边界 |
| Step 5三件 | reviewed | 提供AC-SBX-006~023功能owner和协议补强TC,防止重复创建功能AC |
| Step 6三件 | reviewed | 提供依赖裁剪、数据红线及AC-SBX-031 ARCH / PROTOCOL slice分工 |
| 正式`00` §6 /§9 /§12 /§14 | current reviewed | 提供使用方、依赖、FR / BR / AC和接口边界 |
| 正式`01` §7~§9 /§12 | current reviewed | 提供模块 /跨仓依赖方向、通信与事件 /handoff边界 |
| 正式`02` §5~§8 /§12 | current reviewed | 提供组成部分、对象、API骨架和处理流 |
| 正式`03` §6~§8 | current reviewed | 提供shared carrier、55协议正式surface、逻辑协议名和flow入口 |
| `03_ddd_step_08_protocol_contracts.md` | reviewed detailed source | 提供逐协议字段、二级类型、缺失处理、stored replay和payload / report来源 |
| 正式`04` §7 /§9 /§12 | current reviewed | 提供inbound source map、`transport_topic_bindings`、完整配置代和启用门禁 |
| 正式`05` §6 /§9 /§13 | current reviewed | 提供254 TC、SUITE-004~006 /011 /012、四源run、ESLOT-008 /009 /010 /016和fixed report |
| 全局依赖裁剪标准 | current | 固定compile / runtime / event类型;只有`L0-core` / `core-contracts`可作sibling compile dependency |
| 五个上游参考项目 | mixed maturity | 只用于识别caller / consumer责任与旧契约冲突;Sandbox当前正式`00~05`优先 |
| 旧正式`06` | historical material | 只做污染诊断;不得继承旧route、host runtime、证据或结果 |
| L1-governance / L1-artifact Step 7 | granularity reference | 只参考结构,本项目坚持55协议逐项登记而非族级摘要 |

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 每个P0 Command如何验收 | 10个Command逐项验证`SandboxCommandMetadataDto`、正式request必填字段、accepted / rejected / pending / failed surface、完整stored result和duplicate不重跑。每项绑定一对CMD正负TC及SUITE-004 /011。 |
| 每个P0 Query如何验收 | 13个Query逐项验证selector、正式view / page / marker、visible与missing / restricted / stale / degraded等适用surface,并断言write UoW、refresh、repair和side-effect port调用为0。每项绑定一对QRY TC及SUITE-004 /011。 |
| 每个P0 Event如何证明可消费 /可重放 | 9个Consumer验证trusted envelope、schema / source / digest / forbidden-body gate、stored receipt、duplicate replay和quarantine no-write;13个Outbound Event验证committed stored payload snapshot、event kind / payload family、relay append / publish与source no-rollback。 |
| 每个P0 Job如何证明幂等和恢复 | 10个Job逐项验证typed input、selection、honest `SandboxJobReportDto`、partial / empty / invalid surface、stored report replay和no core truth repair;replay事务精确性仍由Step 8加严。 |
| 跨仓同步成功标准是什么 | 本仓只通过正式typed ref、safe snapshot、consumer receipt、outbound stored payload、handoff marker或adapter outcome协作;外部反馈不得反写Sandbox source truth,本仓也不得写相邻仓正文或生命周期truth。 |
| 下游未就绪时如何验接缝 | P0要求formal fake / controlled / disabled seam可执行并产生正式Accepted / Delayed / Rejected / Failed / Degraded / Blocked surface。required seam缺失或吞掉错误为Failed / Blocked;未激活的真实下游集成保持conditional / NotEvaluated,不能冒充P0通过。 |
| 依赖类型如何区分 | `core-contracts`为唯一sibling compile dependency;identity / work / policy / backend为runtime input;bus与状态通知为event;artifact / observability / investigation为handoff;tools / runtime / member-service / runner及查询订阅方为runtime caller或downstream consumer。 |
| 各类依赖使用什么证据 | compile用SUITE-003 / ESLOT-016 dependency边界;runtime adapter用SUITE-004 /006及controlled seam;event用SUITE-005 /011与relay report;handoff用CMD /CNS /JOB report;downstream consumption用query /event schema与stored payload,不要求其源码或内部DB。 |
| 是否能回指正式字段、状态和测试证据 | 能。55项逐项登记见协议分件;字段只引用正式`03`的DTO / view / payload / report,TC来自正式`05`。 |
| 是否有固定topic / route / job surface | 有稳定逻辑surface:`Command/*`,`Query/*`,`InboundEvent/*`,`OutboundEvent/*`,`Job/*`。真实transport topic / HTTP route未定义且不得伪造;Outbound只验13 formal key在`transport_topic_bindings`启用闭集中的完整映射。 |
| 下游不可用时如何裁决 | required P0 seam不存在、协议分支不可触发或错误被吞并为成功 => `Blocked` / `Fail`;seam存在且正式不可用分支如实成立 => 该协议slice可`Pass`;真实下游未激活 => `NotEvaluated` / conditional,不补偿也不损害已定义的P0 seam结果。 |
| 是否逐项停审 | 是。PG-SBX-001~055均按protocol / surface / dependency / TC / evidence / downstream / phase七维停审,只形成`PassDesign`。 |
| 是否存在跨接口冲突 | 未发现unresolved冲突。协议计数55、正式名称、逻辑surface和TC族闭合;无跨仓源码依赖误要求,无真实route/topic伪造。 |

---

## 5. 当前文档与historical material问题诊断

| 位置 /材料 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧正式`06`接口章节 | 使用旧API /泛化事件 /host runtime和无固定证据入口,没有55协议闭集 | 全部降级historical;按五类正式协议逐项重建 |
| 旧正式`06`跨仓口径 | 容易要求tools / runtime / member-service真实联调或把其对象写入Sandbox | 固定compile / runtime / event / handoff / downstream类型与seam-only P0 |
| 上游旧文档 | L2-tools等存在早期`sandbox_exec`、SDK / RPC、SandboxRequest / Result等旧接口描述 | 记录为相邻仓historical_material;不覆盖当前55协议,未来接入须由上游适配或DesignReopen |
| 正式`03` | 已有55协议完整schema,但验收尚未逐项绑定TC / slot / fixed report | 建立PG-SBX-001~055登记和逐项停审 |
| 正式`04` | 只定义topic-neutral 13-key binding,没有真实topic | 验binding闭集和fail-fast,不发明transport topic |
| 正式`05` | ESLOT-008按55协议聚合,若只写族级门禁会隐藏单协议缺失 | release item必须保存exact protocol / TC / parameter / assertion;55项不可由总数绿色替代 |
| `AC-SBX-031` | Step 6只关闭ARCH-SLICE,若本Step另建AC会形成双重真相 | 本Step关闭PROTOCOL-SLICE并保持一个canonical AC disposition |

---

## 6. 改动前后对比

| 维度 | 旧口径 | 本Step收稳后的口径 | 原因 |
|---|---|---|---|
| 协议范围 | 泛化API /事件 /控制入口 | 10 Command +13 Query +9 Consumer +13 Event +10 Job = 55 | 防止漏项与旁路 |
| 协议粒度 | 五类摘要即可 | 55个PG逐项字段 /TC /证据 /裁决 | 族级绿色不能证明单协议完整 |
| route / topic | 易把产品transport写进验收 | 逻辑surface + formal event key + config binding | 当前无权威transport值 |
| Query | 只看返回成功 | view / visibility / degraded / missing + zero-write | Query不能成为修复入口 |
| Consumer | 只看消息被接收 | trusted envelope + stored receipt + duplicate + quarantine no-write | 防止外部正文和第二writer |
| Outbound | 只看publish成功 | committed stored payload + relay / replay + source no-rollback | publisher不是truth owner |
| Job | 只看任务结束 | typed input + honest partial report + stored replay + no repair | 防止maintenance绕业务门禁 |
| 下游未就绪 | 要么阻塞所有P0,要么伪造联调成功 | required seam必须可验;真实未激活保持conditional | 区分契约成立与产品集成成熟度 |
| 跨仓依赖 | 泛化“依赖项目” | compile / runtime / event / handoff / downstream逐项裁剪 | 禁止源码依赖误判 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 是否新建同步AC | PG仅作检查索引,复用AC-SBX-006~023 /031 | 创建`AC-SBX-SYNC-*`平行体系 | 保持需求验收真相唯一 |
| 55协议如何表达 | 登记分件逐协议55行,主件按族汇总 | 五个汇总行替代逐项 | 协议缺失必须可单独阻断 |
| 是否写真实route/topic | 只写逻辑协议名、event kind和binding key职责 | 猜HTTP / RPC / bus topic | 产品 /部署输入未形成 |
| 下游是否必须完整实现 | 验本仓formal seam和不可用surface | 把上游 /下游完整系统纳入P0 | 仓级验收不得扩张范围 |
| fake / controlled seam效力 | 可证明P0-C契约,但不得证明P0-Q /真实产品 | fake绿色等于整体release ready | 防止证明轴替代 |
| Job幂等是否在本Step终结 | 验public stored replay / no rerun surface;事务 /race留Step 8 | 在本Step重复全部TXN /RACE裁决 | 保持Step职责分离 |
| AC-SBX-031如何收口 | ARCH-SLICE + PROTOCOL-SLICE均mandatory,一个canonical disposition | 两个独立AC或任一slice单独通过 | 防止架构静态检查替代协议完整性 |

---

## 8. 结构化中间产物

### 8.1 协议族验收门禁总表

该表只定义族级共同谓词;单协议不得仅凭本表判定。55项exact surface、TC和evidence绑定见`06_acceptance_step_07_protocol_trace_register.md`。

| 门禁 | 协议族 /数量 | 共同通过条件 | 共同失败条件 | Primary planned evidence | Fixed source / report |
|---|---|---|---|---|---|
| IFG-SBX-CMD | Command /10 | exact逻辑协议、metadata、request必填字段、正式result与stored replay均成立;accepted / rejected互不吞并 | 缺协议 /字段;绕scope / guard;duplicate重跑;stored result不完整;raw body进入carrier | ESLOT-SBX-008 -> future `EV-SBX-PROTOCOL-008` | MAIN-CONTRACT SUITE-004 /011;对应suite report与case JSON |
| IFG-SBX-QRY | Query /13 | exact selector / view / marker / page及适用degraded surface成立;write / refresh / repair为0 | scan拼ref、visibility泄漏、stale伪fresh、query写truth / projection / audit / report | ESLOT-SBX-008;READ / AUDIT按协议补强 | MAIN-CONTRACT SUITE-004 /011 |
| IFG-SBX-CNS | Consumer /9 | trusted envelope、schema / source / digest / body gate、stored receipt、duplicate replay、delayed / quarantine成立 | invalid仍解析 /写入;duplicate二写;receipt重算;external body落任一carrier | ESLOT-SBX-008;RELAY / REPLAY按协议补强 | MAIN-CONTRACT与MAIN-SEAM SUITE-005 /011 |
| IFG-SBX-EVT | Outbound Event /13 | exact event family / payload、committed source cursor、stored payload、relay append及publish no-rollback成立 | kind / payload错配;从current truth重建;缺payload仍发布;publisher失败回滚source | ESLOT-SBX-008;ESLOT-009 RELAY;AUDIT适用 | MAIN-CONTRACT与MAIN-SEAM SUITE-005 /011 |
| IFG-SBX-JOB | Operations Job /10 | typed input / selection、honest item report、partial / failed保存、duplicate stored replay、no core repair成立 | invalid / partial伪Succeeded;duplicate重跑;job修core truth;report refs私造 | ESLOT-SBX-008;REPLAY及领域slot补强 | MAIN-CONTRACT SUITE-006 /011;OPS SUITE-012适用 |

### 8.2 Shared carrier验收约束

| Carrier | 必验surface | 失败条件 | 主要TC / evidence |
|---|---|---|---|
| `SandboxProtocolMetadataDto` / actor context | protocol / schema / trace / digest、authority / scope / source分离 | 从route / topic猜digest;trusted source绕schema / body / state gate | CTR-001~006;ESLOT-001 /008 |
| `SandboxCommandResultDto` / stored result | status、primary / affected / audit / relay / stored result refs完整 | rejected / failed不存结果;duplicate重跑或返回新ref | CMD正负 + TXN-007~012 supporting;ESLOT-008 /010 |
| `SandboxQueryResponseDto<T>` / page / marker | surface、view、page info、projection / visibility marker互相一致 | NotVisible仍有view;cursor混truth;query打开write UoW | QRY-001~026;ESLOT-007 /008 |
| `SandboxInboundEventEnvelopeDto<T>` / receipt | event / source / schema / dedup / digest / forbidden marker / payload分离;receipt可重放 | envelope字段缺失仍业务mapping;raw payload进入receipt / error | CNS-001~004 +逐consumer;ESLOT-008 /010 |
| `SandboxOutboundEventEnvelopeDto<T>` | event kind、source truth / cursor、payload ref、audit / trace与typed payload | page cursor / timestamp替source cursor;payload family错配 | EVT-001~015;ESLOT-008 /009 /015 |
| `SandboxJobInputDto<T>` / report | job kind / scope / spec / page进入digest;item refs / status / counts可重放 | `job_run_ref`充当幂等key;partial隐藏;failed无report | JOB-001~012;ESLOT-008 /010 |

### 8.3 跨仓依赖类型与验收方式摘要

完整方向、同步成功 /失败和未就绪裁决见同步分件。

| 关联方 | 全局依赖类型 | 协作方式 | P0验收方式 | 禁止误判 |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile | shared IDs / typed refs / actor / trace / error / metadata | manifest dependency closure、contract compile、carrier roundtrip | 不复制core type;不把其他sibling变compile dependency |
| isolation backend / capability source | runtime | capability summary、establish / launch / capture / inspect / release typed adapter outcome | fake / controlled unavailable seam;P0-Q另验fixed candidate | 不把SDK response /产品状态写成domain truth |
| `L1-identity` / `L1-work` / policy sources | runtime + event input | typed ref、safe snapshot、reference change consumer | resolver fake / controlled source、stale / unavailable / quarantine | 不保存identity / work / policy正文 |
| `L0-bus` | event collaboration | inbound envelope、outbound relay、publisher feedback | consumer / event / relay suite,13-key binding completeness | 不要求bus源码;不以local log替代relay |
| artifact / observability / investigation target | handoff + event feedback | body-free material / target refs、receipt / status consumer | fake / disabled / controlled handoff与retry / failure report | receipt不升格下游truth,失败不回滚capture / containment |
| tools / runtime / member-service / runner | runtime caller + downstream consumer | command / query调用、event / handoff消费 | entry inventory、scope / authority / unavailable surface | 不拥有其semantic execution / loop / lifecycle truth |

### 8.4 下游未就绪裁决规则

| 场景 | 本仓P0裁决 | 必需证据设计 | 不允许 |
|---|---|---|---|
| required fake / controlled adapter不存在或协议分支无法触发 | `Blocked`;若实现宣称支持却吞掉错误则`Failed` | exact PG、suite / case missing或blocked reason | 用文档评审或mock空实现标Passed |
| runtime source unavailable / stale | 正式`Pending / Rejected / Degraded / Unavailable / Delayed`成立且no-write / no-launch时,该负向slice可Pass | CMD / QRY / CNS exact negative TC | default allow、host fallback、创建外部truth |
| inbound unsupported / untrusted / body-bearing | `Rejected / Quarantined`且业务mutation=0才可Pass | CNS-001~004及逐协议负向 | 解析后再拒绝、raw payload留存 |
| publisher / bus unavailable | source truth保持;relay为Retryable / DeadLetter / Failed且stored payload不变才可Pass | EVT-015、JOB-001、relay report | 回滚source或从current truth重建payload |
| handoff target unavailable / disabled | formal retryable / failed / skipped report且source capture / containment不回滚才可Pass | CMD-012、相关CNS、JOB-004 /007 | 伪造下游ref / delivered / released |
| 真实P0-Q backend / provider未形成 | 对P0-Q保持`Blocked`,不影响P0-C协议设计完成 | P0Q source identity与SUITE-013缺失记录 | MAIN / seam / P1替代P0-Q |
| 未激活真实下游联合集成 | `NotEvaluated`或conditional,不计P0 pass / fail | 激活后另行固定identity / run / report | 声称端到端ready或要求下游完整实现 |

### 8.5 `AC-SBX-031`双slice合并规则

| Slice | Owner Step | 必需planned evidence | 通过前提 | 单独满足时的canonical结果 |
|---|---|---|---|---|
| `ARCH-SLICE` | Step 6 | ESLOT-SBX-016 ARCH,CONTRACT / CONFIG supporting | 仅`core-contracts` sibling compile dependency;七模块与entry依赖方向成立 | 不得单独判AC-SBX-031 Passed |
| `PROTOCOL-SLICE` | Step 7 | ESLOT-SBX-008 PROTOCOL,ESLOT-001 /013 /016 supporting | 55协议exact inventory、public carrier、entry disposition、event binding和cross-repo seam完整 | 不得单独判AC-SBX-031 Passed |
| canonical merge | Step 14最终裁决消费 | 两slice各自fixed source item与digest | 两slice均Passed且无更高优先级Fail / Blocked / VETO | 才可形成一个AC-SBX-031 disposition |

---

## 9. 证据与单项裁决契约

### 9.1 Planned evidence映射

| Evidence role | Planned slot / future form | 主要producer | 本Step用途 | 当前成熟度 |
|---|---|---|---|---|
| protocol primary | ESLOT-SBX-008 PROTOCOL -> future `EV-SBX-PROTOCOL-008` | SUITE-004~006 /011 | 55协议inventory、正式entry与disposition主证 | planned P0-C |
| relay supporting | ESLOT-SBX-009 RELAY -> future `EV-SBX-RELAY-009` | SUITE-002 /005 /006 /009 | relay state、stored payload、feedback、publish no-rollback | planned P0-C |
| replay supporting | ESLOT-SBX-010 REPLAY -> future `EV-SBX-REPLAY-010` | SUITE-002 /005~007 | stored result / receipt / report replay公共surface | planned P0-C;事务精确性由Step 8拥有 |
| architecture supporting | ESLOT-SBX-016 ARCH -> future `EV-SBX-ARCH-016` | SUITE-003 /016 | compile dependency和unsupported absence | planned P0-C;target repo缺失导致执行Blocked |
| domain supporting | ESLOT-SBX-002~007 /015 | SUITE-001~006 /012适用 | 协议承载的intake / boundary / policy / execution / safety / read / audit断言 | planned P0-C |
| qualification supporting | ESLOT-SBX-017~019 | SUITE-013 | 真实四维、lifecycle、identity / anti-substitution | P0-Q Blocked;不得替代protocol primary |

### 9.2 Fixed source与report入口

| Source role | Protocol范围 | 必须定位的report | 资格限制 |
|---|---|---|---|
| MAIN-CONTRACT | 全55协议;Command / Query / Job主行为;Consumer / Event本地合同 | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-004.md`;`SUITE-SBX-005.md`;`SUITE-SBX-006.md`;`SUITE-SBX-011.md`;对应case JSON | P0-C主证;不能证明真实下游 / backend |
| MAIN-SEAM | 9 Consumer、13 Event及adapter / entry补强 | `reports/runs/<main_seam_run_id>/suites/SUITE-SBX-005.md`;`SUITE-SBX-011.md`;适用008 /010 | controlled seam主证;不能替代MAIN-CONTRACT或P0Q |
| OPS | relay / handoff retry / cleanup / reaper / redline / projection / reconciliation job补强 | `reports/runs/<ops_run_id>/suites/SUITE-SBX-012.md`;适用006~010 /014 | simulation不证明真实产品集成或P0-Q |
| P0Q | 真实backend相关command / consumer / job的资格slice | `reports/runs/<p0q_run_id>/suites/SUITE-SBX-013.md`;qualification-result.json | fixed candidate / profile / generation / env / provider identity缺一即Blocked |
| RELEASE | 55项detail与AC-SBX-031合并索引 | `reports/runs/<release_run_id>/evidence/<evidence_id>.md`;`evidence-index.md`;`protocol-inventory.md` | 只聚合四源;不得删失败、换源或使用latest |

每个PG单项未来裁决记录至少包含:

```text
protocol_gate_id + canonical_protocol_name + logical_surface
protocol_family + dependency_type + collaboration_mode
request_or_payload_schema_ref + required_field_assertions
positive_tc_ids + negative_tc_ids + parameter_id + assertion_codes
source_role + source_run_id + suite_id + suite_report_path + case_artifact_path
planned_slot + runtime_evidence_id + artifact_digest
Pass / Fail / Blocked / NotEvaluated disposition + reason_refs
canonical_ac_refs + decision_impact
```

当前不得实例化上述runtime字段。

---

## 10. 通过 /失败 /Blocked与裁决影响

| Disposition | 本Step定义 | 传播规则 |
|---|---|---|
| `Pass` | exact PG所列协议名 / surface /字段 /正负TC在required source role均形成合法证据,且无missing / Failed / Blocked断言 | 只表示该协议slice通过;不自动使族、AC或release通过 |
| `Fail` | 协议缺失 /漂移、required字段或surface错误、非法路径成功、no-write / no-rollback / no-repair失败、证据显示断言失败 | 阻断对应IFG、关联canonical AC和release;Step 11再判断是否命中VETO |
| `Blocked` | required目标仓 / harness / seam /source identity / raw-report缺失,导致协议义务无法执行或无法判定 | 不等于Fail或Pass;保持门禁未满足并传播到release |
| `NotEvaluated` | 非当前激活的真实下游 / conditional scope未进入固定送验基线 | 不补偿P0,也不伪造成缺陷;激活后转required并重新固定baseline |

族级通过要求该族全部PG在适用P0 source role为Pass,且没有Fail / Blocked / missing。总Step 7运行时通过还要求五族、跨仓同步门禁和`AC-SBX-031 PROTOCOL-SLICE`均满足;当前只完成设计,真实状态仍为`NotEntered`。

---

## 11. 回填草稿

正式`06-验收标准.md` Step 15装配时,§7按以下结构回填。本Step不直接修改正式`06`。

```md
## 7. 接口、事件与跨仓同步验收

> 校准来源:
> - `design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
> - `design-calibration/06_acceptance_step_07_protocol_trace_register.md`
> - `design-calibration/06_acceptance_step_07_sync_review_register.md`

### 7.1 协议范围与共同裁决规则

本章覆盖10 Command、13 Query、9 Inbound Consumer、13 Outbound Event和10 Operations Job。每个协议必须按exact protocol name、logical surface、正式字段、正负TC、planned slot、fixed source role / suite / report独立裁决。族级总数或单一inventory绿色不得替代单协议结果。

### 7.2 Command与Query验收

Command必须证明metadata、正式accepted / rejected surface及stored result replay。Query必须证明正式view / degraded / missing surface和zero-write。

### 7.3 Consumer与Outbound Event验收

Consumer必须证明trusted envelope、stored receipt、duplicate replay、invalid / body-bearing quarantine no-write。Outbound Event必须证明committed stored payload、source cursor、relay / replay和publisher failure no source rollback。

### 7.4 Operations Job验收

Job必须证明typed input、honest partial report、stored report replay和no core truth repair。

### 7.5 跨仓依赖与下游未就绪裁决

只有core-contracts是sibling compile dependency。其他关系按runtime、event、handoff或downstream consumption验formal seam;P0不要求下游完整实现。required seam缺失为Blocked / Failed,未激活真实下游保持conditional / NotEvaluated。

### 7.6 AC-SBX-031合并门禁

ARCH-SLICE和PROTOCOL-SLICE均mandatory,只形成一个canonical AC-SBX-031 disposition。
```

---

## 12. 待确认事项

| 事项 | 当前处理 | 是否阻塞本Step |
|---|---|---|
| 真实HTTP / RPC / topic / queue / job executable | 当前无权威值;保持逻辑surface和transport-neutral binding | 否;若实施要求public transport contract,先回写`03/04` |
| 目标实现仓与manifest | `/home/aris/Projects/quantalithos-sandbox`不存在 | 不阻塞设计;阻塞ARCH / protocol inventory真实执行 |
| 真实bus / backend / handoff / store产品 | 未选择 | 不阻塞P0-C设计;阻塞相关激活 /P0-Q / real-like |
| 上游旧sandbox SDK / request / result名 | 作为historical material,不覆盖当前55协议 | 否;未来上游接入需adapter或DesignReopen |
| 真实下游联合E2E | 未激活 | 否;保持conditional,不得声明ready |

---

## 13. 自检

| 检查项 | 结论 |
|---|---|
| 协议计数是否为10 +13 +9 +13 +10 | 是,55 /55 |
| 是否以五个汇总行替代逐协议 | 否;协议分件逐项55行 |
| 每个协议是否有exact surface /字段 /正负TC | 是 |
| 每个协议是否有planned slot / future EV / source role / suite / report | 是 |
| 是否仅`core-contracts`为sibling compile dependency | 是 |
| 是否发明transport route / topic /产品 | 否 |
| 下游未就绪是否要求完整实现或伪通过 | 否;seam与真实激活分离 |
| AC-SBX-031是否保持单一canonical disposition | 是;ARCH / PROTOCOL双slice mandatory |
| 是否吞并Step 8 /9 /10 /11 | 否 |
| 是否创建run、EV、report、结果、review、风险或签署 | 否 |
| 是否发现上游blocker | 未发现阻塞Step 7设计的上游blocker |
| 正式`06`是否修改 | 否;保持historical material |

---

## 14. 进入下一步条件

```text
当前Step 7三件中间产物已完成并经用户确认,状态为completed_reviewed_passed_to_step_8。

用户已明确确认Step 7,现可进入Step 8 `定义状态机、事务与一致性验收`。
进入Step 8前必须读取:
1. `project_execution_ledger.md`
2. `06_acceptance_calibration_flow.md`
3. Step 7主件、协议登记分件和同步 /停审分件
4. 验收SOP Step 8
5. 验收标准书写规范§5.8
6. 正式`03`状态 /事务 /一致性章节与正式`05` STA / TXN / RACE / REPLAY测试来源

当前只允许按Step 8标准创建Step 8中间产物;不得修改正式`06`,不得创建`07`、implementation ledger或planned boundary skeleton。
```
