# Step 6 回归 `6R-07`: 主控回填与 Step 7 handoff

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-24
> 状态: `review_confirmed_consumed_by_7r_m0`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游控制: `03_ddd_step_06_object_contracts_regression_control.md`
> 当前边界: 用户已确认Step 6；`6R-07`结果已由Step 7 regression `7R-M0`消费。本文件继续拥有Step 6 handoff事实，不拥有Step 7 callable，不修改正式`03~07`。

---

## 1. 开工确认与恢复点

| 检查项 | 当前结论 |
|---|---|
| 用户是否确认`6R-06` | 是。本次“同意”只把`6R-06 completed_wait_user_review`转为`review_confirmed`，并授权启动一个下一批`6R-07`。 |
| 当前文档 / Step | `03-详细设计.md` / Step 6 regression / `6R-07`。 |
| `6R-M0~06`效力 | `6R-M0~05`已确认并消费；`6R-06`的17/17静态检查族、8/8恢复源和unresolved 0已获确认。 |
| 本批允许修改 | 本文件、Step 6主控末尾current override、shared types末尾恢复override、regression control、`03` flow、project ledger、implementation ledger。 |
| 本批禁止修改 | 五份已确认canonical schema正文、正式`03~07`、Step 7正文、implementation boundary skeleton/status、实现仓和代码。 |
| implementation状态 | `CB-SBX-01A blocked / wait_design`；实现未开始。 |
| 新L1/L2 blocker | 0。historical actor authority差异仍由Step 8回归处理。 |
| 本批完成后动作 | 停在`Step 6 regression completed_wait_user_review`；用户确认前不得进入Step 7。 |

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
current_batch = 6R-07 master assembly and Step 7 handoff
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_step_7_regression
upstream_6R_06 = review_confirmed_consumed
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## 2. 本批目标与非目标

`6R-07`不再设计新对象。它负责把`6R-01~06`的已确认结果装配成Step 6唯一可恢复入口，使后续
Step 7不需要在六份分件和回归前主控之间猜效力。

本批必须完成：

1. 将Step 6主控原§1~§28整体标为historical reviewed input，不允许其中旧类型、状态和helper覆盖current分件。
2. 以shared types §8的69-row registry为唯一对象/type索引，不在主控复制第二套registry定义。
3. 为五份current canonical source建立唯一效力、owner、章节与消费规则。
4. 给Step 7列出逐契约族必须承接的Step 6对象能力、输入、禁止猜测项和暂停条件。
5. 证明Step 6进入正式审查点，但不把一次`6R-07`完成自动扩展为Step 6用户确认或Step 7开工。

本批明确不做：

- 不修补historical Step 7 trait/port/adapter签名。
- 不定义Step 8 DTO、Step 9 flow、Step 10 state matrix或Step 11 persistence。
- 不装配正式`03-详细设计.md`；正式装配仍由回归后的Step 19负责。
- 不调整`04~07`、32件planned boundary skeleton或implementation gate。
- 不声明Rust编译、测试、运行、provider、evidence或验收事实。

---

## 3. 权威输入与效力判定

| 输入 | 当前效力 | `6R-07`处理方式 |
|---|---|---|
| `03_ddd_step_04_file_layout.md` | reviewed targeted input | 只提供36个current owner path和既有planned tree，不新增文件owner。 |
| `03_ddd_step_05_module_contracts.md` §9.5~§9.8 | reviewed unaffected input | 固定七模块owner、依赖矩阵和Step 6闭口边界。 |
| `03_ddd_step_06_object_contracts_shared_types.md` | current shared truth | §7~§13提供shared/core、69-row registry、52 refs、39 status和error layer；物理末尾恢复override只管状态。 |
| context/boundary分件 | current canonical source | 只索引其current object/guard/view章节，不摘录schema。 |
| policy/run/capture分件 | current canonical source | 只索引其current object/guard/view章节，不摘录schema。 |
| failure/cleanup/read分件 | current canonical source | 只索引§12~§17 current章节；historical draft明确失效。 |
| application/infra/entry分件 | current canonical source | 只索引§9~§11 current章节；§6~§8为historical draft。 |
| `03_ddd_step_06_object_contracts_closure_audit.md` | review_confirmed audit | 提供17类静态检查的零差集结论，不成为第六份schema owner。 |
| 原Step 6主控§1~§28 | historical reviewed input | 只保留过程、差异和污染诊断；任何同名声明均不能被后续Step实现。 |
| 原Step 7~10 | historical reviewed / revalidation pending | 只用于建立rewrite watch，不可反向修改Step 6。 |

### 3.1 冲突裁决顺序

```text
core-contracts exact export
  -> shared types canonical registry / shared declaration
  -> registry row指定的current canonical分件section
  -> 6R-06 closure audit对差集的确认
  -> 6R-07主控索引与handoff
  -> historical Step 6 / Step 7~10（仅诊断，不具覆盖权）
```

若同一名称在current分件和historical主控中字段、variant、factory或error不同，必须采用current分件，
并把historical声明视为ghost；不得折中合并、增加alias或让Step 7自行选择。

---

## 4. SOP问题回答

| SOP问题 | `6R-07`回答 |
|---|---|
| Step 6骨架、批次和模块顺序是否完成 | 是；回归前骨架保留为historical，current执行序列由`6R-M0~07`控制。 |
| shared vocabulary是否先收敛 | 是；4 core row + 10 shared row已闭合，52 named refs和39 status owner唯一。 |
| 七模块capability是否均有对象承接 | 是；69 registry row覆盖contracts/core/domain/application/infra/entry stable carrier，current owner path 36/36。 |
| 对象是否能回到模块功能 | 是；`6R-02~05`各分件均有capability/object/owner map，`6R-06`复核module owner 7/7。 |
| non-core对象闭口/defer是否明确 | 是；application/infra/API/worker/jobs stable carrier已在`6R-05`闭口；trait/DTO/flow/state按Step 7~10承接。 |
| 字段/factory/serialization是否闭合 | 是；`6R06-B`差集0，checked deserialize 3/3。 |
| guard和transition是否闭合 | 是；12/12 guard、20/20 mutable owner、10/10 forward helper闭合。 |
| status/ref/error是否唯一 | 是；39 status唯一分类，52 kind/wrapper一一对应，entry error 41/7/12/17闭合。 |
| 跨模块依赖是否闭合 | 是；七模块矩阵命中，unplanned split path为0，contracts反向domain依赖为0。 |
| Step 7承接是否可执行 | 本文件§8~§10将按契约族给出exact source与暂停条件；不沿用旧粗粒度trait。 |

---

## 5. 改动前后与设计取舍

### 5.1 改动前后

| 项 | 回填前 | 回填后 |
|---|---|---|
| Step 6恢复入口 | 主控停在`6R-04 batch 4`，真实恢复点分散在control/flow/ledger。 | 主控物理末尾追加唯一current override并链接本文件。 |
| 对象索引 | 回归前主控复制大量旧schema，shared registry另有69 row。 | 69-row registry是唯一索引；主控只放source map和查找规则。 |
| 同名冲突 | 旧status/helper可能被误读为current。 | 整体historical fence + current source precedence，ghost不得实现。 |
| Step 7输入 | 旧§19承接表按粗粒度port family描述。 | 按current object ability、exact carrier、error/guard/version/UoW watch给出handoff。 |
| Step 6完成语义 | 容易把静态审计通过误写成Step 6已确认。 | `6R-07`完成只进入Step 6待用户审查；确认后才可启动Step 7。 |

### 5.2 设计取舍

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 重写3378行主控并复制五份分件 | 单文件看似完整 | 形成第二schema owner，未来必然漂移 | 不采用 |
| B. 删除历史主控只保留新索引 | 入口简短 | 丢失已确认过程与historical conflict证据 | 不采用 |
| C. 保留历史正文，在物理末尾追加current authority/index/handoff | 真相唯一且保留审计历史 | 阅读必须遵守末尾override | 采用 |
| D. 直接开始改旧Step 7 | 表面推进快 | 跳过Step 6正式审查门禁 | 不采用 |

---

## 6. `6R-07`写入批次

| 批次 | 范围 | 状态 | 完成门禁 |
|---|---|---|---|
| `6R07-A` | 开工、效力模型、SOP回答、取舍、69-row family索引 | completed | 69 row按6 family计数唯一，source file存在。 |
| `6R07-B` | 五份canonical source map、七模块owner和Step 7 handoff | completed | 每个handoff family有current input、输出要求、禁止猜测和blocker。 |
| `6R07-C` | 主控/shared override、三层台账、implementation freeze、静态审计 | completed_wait_user_review | 恢复源一致、unresolved 0，停在Step 6用户审查点。 |

---

## 7. Canonical registry索引

### 7.1 唯一索引规则

registry master唯一位于`03_ddd_step_06_object_contracts_shared_types.md` §8.2~§8.6。本文和主控只记录
family count与source link，不复制69行的type/category/module/location/state字段。后续Step若需要对象，
必须先按ID定位registry row，再读取row指定的canonical section。

| family | ID范围 | row数 | canonical source | current state |
|---|---|---:|---|---|
| core reuse | `S6T-CORE-001~004` | 4 | shared types §7.1 / §8.2 | current exact export input |
| shared contracts | `S6T-SH-001~010` | 10 | shared types §9~§13 / §8.2 | current canonical here |
| context / boundary | `S6T-02-001~017` | 17 | shared types §8.3 -> context/boundary分件 | review_confirmed current |
| policy / run / capture | `S6T-03-001~012` | 12 | shared types §8.4 -> policy/run/capture分件 | review_confirmed current |
| failure / cleanup / read | `S6T-04-001~015` | 15 | shared types §8.5 -> failure/cleanup/read分件 | review_confirmed current |
| non-core | `S6T-05-001~011` | 11 | shared types §8.6 -> application/infra/entry分件 | review_confirmed current |
| **total** | six disjoint families | **69** | one registry master + five schema sources | **unresolved 0** |

### 7.2 Registry消费算法

```text
1. 用exact Registry ID查shared §8 master row。
2. 核对canonical type、module、planned owner path和current state。
3. 若为core/shared，读取shared types指定section。
4. 若为S6T-02~05，读取row所指current分件section。
5. 读取closure audit中的field/factory/guard/status/ref/error join。
6. 忽略主控§1~§28和原Step 7~10中的同名schema。
7. 若current source缺字段、callable或relation，登记Step 6 blocker并停止；不得从historical补齐。
```

### 7.3 Family级完整性门禁

| 检查 | expected | 当前结论 |
|---|---:|---|
| family数 | 6 | closed |
| registry row | 69 | closed |
| duplicate ID | 0 | closed |
| empty current row | 0 | closed |
| current owner path未命中Step 4 | 0 | closed |
| unplanned contracts split module | 0 | closed |
| typed ref kind/wrapper差集 | 0 / 52 | closed |
| status owner未分类 | 0 / 39 | closed |

本节结论来自`6R-06`已确认静态审计，只建立查找入口，不制造新的测试或实现事实。

---

## 8. 五份 current canonical source map

### 8.1 Shared / core source

| contract surface | unique current section | exact owner | historical exclusion |
|---|---|---|---|
| core export | shared types §7.1 | `core_contracts::actor`;`core_contracts::metadata` | Sandbox不得重定义actor、request、time、idempotency、page或version。 |
| reason / digest / cursor | shared types §9.1 | `crates/contracts/src/refs.rs` | 主控旧`SandboxReason/SandboxDigest/SandboxInstant`不得实现。 |
| trace composition | shared types §9.2 | `crates/contracts/src/metadata.rs` | 主控旧opaque trace ref shape失效。 |
| external source / safe summary / forbidden body | shared types §9.3~§9.5 | `crates/contracts/src/refs.rs` | 不允许String、generic body ref或raw body fallback。 |
| object ref kind / named wrapper | shared types §10.1~§10.7 | `crates/contracts/src/refs.rs` | 52 wrapper不是alias；generic->named必须校验kind。 |
| status / selector / marker / finite carrier | shared types §11~§12 | `crates/contracts/src/refs.rs` | 后续Step不得新增同义wire-only enum。 |
| shared / public error | shared types §13 | `crates/contracts/src/errors.rs` | `SandboxPublicErrorKind`固定16 variant；不接raw cause。 |

### 8.2 Context / boundary source

唯一schema owner为`03_ddd_step_06_object_contracts_context_boundary.md`。其§10~§21为current正文，§22为
已确认closure audit。Step 7必须按以下组读取，不得从主控旧§10或historical Step 7反推：

| registry set | current section | owner path family | Step 7 consumption |
|---|---|---|---|
| `S6T-02-001~007` | §10~§13 | `domain/execution_context.rs`;`environment_identity.rs`;`policies.rs`;contracts support | resolver、intake application callable、truth repository、guard input。 |
| `S6T-02-008~012/016` | §14、§17~§19 | `domain/boundary.rs`;`policies.rs` | requirement load/save、backend establishment observation、boundary decision与guard。 |
| `S6T-02-013~015` | §15~§16 | `domain/backend_capability.rs`;`boundary.rs` | capability read、handle/lease relation、establish/inspect/release adapter input。 |
| `S6T-02-017` | §20~§21 | `contracts/views.rs` | query source snapshot和view mapper；读取路径no-write。 |

关键current callable只以该分件与`6R-06` transition join为准。特别是
`ControlledExecutionContext::mark_unresolved`需要完整resolution、guard decision、audit ref和time；旧
`mark_unresolved(reason)`签名已失效。

### 8.3 Policy / run / capture source

唯一schema owner为`03_ddd_step_06_object_contracts_policy_run_capture.md`。§10~§24为current正文，§26为
最终分件审计；§9与文中明确标记的早期snapshot只作historical difference。

| registry set | current section | owner path family | Step 7 consumption |
|---|---|---|---|
| `S6T-03-001~005` | §10~§13 | `domain/policy_decision.rs`;`policies.rs`;`contracts/views.rs` | policy source resolver、strict evaluation callable、decision/read mapper。 |
| `S6T-03-006` | §14 | `domain/run.rs` | launch/inspect/terminate application callable与run repository。 |
| `S6T-03-007~009/011` | §15~§19 | `domain/capture.rs`;`observability.rs`;`policies.rs` | capture adapter observation、material lifecycle、completeness guard和immutable fact save。 |
| `S6T-03-010` | §20~§22 | `domain/handoff.rs` | exact target attempt、delivery observation、aggregate/material sync与cleanup proof。 |
| `S6T-03-012` | §23~§24 | `contracts/views.rs` | capture/handoff committed source与read mapper；不得触发adapter或repair。 |

Step 7不得恢复one-result handoff、generic receipt或adapter直接返回domain status。所有target进度通过
`begin_target_attempt`和`apply_target_observation`推进，aggregate status由owner机械派生。

### 8.4 Failure / cleanup / read source

唯一schema owner为`03_ddd_step_06_object_contracts_failure_cleanup_read.md`。current正文只取§12~§16；
§17是已确认cross-object audit。明确标为historical draft/snapshot的段落不能作为trait input。

| registry set | current section | owner path family | Step 7 consumption |
|---|---|---|---|
| `S6T-04-001/004` failure/control | §12.1~§12.3 | `domain/failure.rs`;`control.rs`;`policies.rs` | typed classification/control basis、repository与control facade。 |
| `S6T-04-002/014` lease/orphan/reaper | §13.1~§13.3 | `domain/cleanup.rs`;contracts marker | active lease relation、lifecycle inspection、orphan recovery与reaper selection。 |
| `S6T-04-003/004` cleanup/redline | §14.1~§14.4 | `domain/cleanup.rs`;`redline.rs`;`policies.rs` | release authorization、investigation observation、containment/termination proof。 |
| `S6T-04-006~010/014~015` reference/projection/derived | §15.1~§15.9、§16.8~§16.9 | domain read owners + `contracts/views.rs` | typed resolver dispatch、scope index、rebuild plan/body input、query no-write mapper。 |
| `S6T-04-011` reconciliation | §16.10 | `contracts/jobs.rs/views.rs/refs.rs`及application/infra later owner | same-snapshot report assembly、whole-group persistence、exact report query和relay prerequisite。 |
| `S6T-04-012~013` audit/relay | §16.3~§16.4 | `domain/audit_trace.rs`;`event_relay.rs`;contracts attempt ref | append-only trace、frozen payload、attempt inspect和publisher observation。 |
| `S6T-04-005` failure/cleanup/redline views | §16.5~§16.7 | `contracts/views.rs` | committed source mapper、degraded relation和zero-write query。 |

`SandboxReconciliationReport`属于审计、对账和异常记录面，不是主体执行能力。Step 7不得让它创建
environment、决定launch、采集材料正文、授权cleanup或提升finding为owner truth。

### 8.5 Application / infra / entry source

唯一schema owner为`03_ddd_step_06_object_contracts_application_infra_entry.md`。current application只取§9，
infra只取§10，entry只取§11；§6~§8是明确失效的historical draft。

| registry set | current section | exact owner | Step 7 consumption |
|---|---|---|---|
| `S6T-05-001~003` | §9.2~§9.7、§9.10、§11.13 | `application` | exact service context、idempotency/stored replay、41-detail error、service/query/maintenance result。 |
| `S6T-05-004~005` | §10.2~§10.8 | `infra` stable carrier | validated generation/binding availability、establishment/handoff/publisher typed outcome mapper。 |
| `S6T-05-006` | §11.3~§11.7 | `api` | command/query envelope、checked context conversion、7-variant entry error和disposition。 |
| `S6T-05-007` | §11.8~§11.12 | `worker` | system-only worker context、receipt、fulfillment/relay result和12-variant error。 |
| `S6T-05-008` | §11.14~§11.18 | `jobs` | full-batch accumulator、fresh/duplicate finalizer、exit disposition和17-variant error。 |
| `S6T-05-009~011` | shared §13 + per-object/per-module current sections | owning module | public/object/application/infra/entry error分层，不得generic collapse。 |

infra outcome只在concrete adapter内部分类并转换为domain-owned observation或application result。Step 7
不得暴露`EventPublisherAdapterOutcome`给jobs，也不得恢复`to_boundary_decision_status`、
`to_handoff_status`或`to_relay_status` shortcut。

### 8.6 Source-map完整性

| source | registry rows | current section exists | historical exclusion exists | unresolved |
|---|---:|---:|---:|---:|
| shared/core | 14 | yes | yes | 0 |
| context/boundary | 17 | yes | yes | 0 |
| policy/run/capture | 12 | yes | yes | 0 |
| failure/cleanup/read | 15 | yes | yes | 0 |
| application/infra/entry | 11 | yes | yes | 0 |
| **total** | **69** | **5/5** | **5/5** | **0** |

---

## 9. 七模块 current owner与依赖门禁

| module | Step 6 current ownership | Step 7允许新增的契约 | 禁止动作 |
|---|---|---|---|
| `contracts` | shared refs/status/selector/marker、public view/receipt/report/error carrier | 不定义port；只被Step 7 callable引用 | 引用domain/application/infra；新增同义status/ref。 |
| `domain` | truth、immutable decision/fact、guard、lifecycle、audit/relay/read identity | 不定义infra port；只暴露current object callable/error | 访问repository/config/adapter；用generic `DomainError`覆盖owner error。 |
| `application` | call context、idempotency/stored result、service/query/maintenance outcome、application error | 唯一service facade、repository/resolver/UoW/external port trait owner | 依赖infra concrete type；从opaque ref/status/error字符串推导业务语义。 |
| `infra` | runtime binding/availability和typed adapter outcome | 实现application port、durable/fake parity、runtime assembly | 私自定义trait；让provider/SDK type穿透内层。 |
| `api` | command/query entry shell、disposition、entry error | 只定义entry adapter调用application facade的exact mapping | 直接访问repository/domain transition；从route猜operation。 |
| `worker` | worker context、receipt、fulfillment/relay result、entry error | consumer/loop entry callable映射application outcome | 与jobs互调；执行tools semantics/runtime loop/member lifecycle。 |
| `jobs` | job context、full-batch accumulator、exit disposition、entry error | one-shot runner entry callable映射maintenance outcome | 扫repository/adapter私有state；把job当业务command。 |

依赖方向继续固定为：

```text
core-contracts <- contracts <- domain <- application <- infra
                                             ^
                                             |
                                    api / worker / jobs
```

图中`api/worker/jobs -> infra`只允许startup assembly，业务调用只到application；三类entry之间没有依赖。
Step 7发现必须反向依赖时，应登记`SBX-DDD-GRANULARITY-STEP7-*`并停审，不能回写Step 6 owner迁就旧trait。

---

## 10. Step 7 exact contract handoff

### 10.1 Handoff消费纪律

Step 7必须先按module建立port capability清单，再逐trait/callable写exact参数、返回、错误、async、
transaction/version和fake parity。下表只是输入与验收契约，不定义Step 7最终trait名称或函数签名；这些
必须在Step 7自己的校准flow和分件中先思考后落文。

每个Step 7 callable至少必须回答：

```text
owner module + planned file
caller + implementer
exact method name
exact typed parameters and ownership/borrowing
exact return carrier and finite business outcome
exact error type and mapping boundary
sync/async rule
read/write/append/no-write classification
Version source + UoW participation + commit visibility
idempotency/stored replay behavior where applicable
fake/durable parity and unavailable behavior
Step 8/9/10/11 downstream consumer
```

### 10.2 Service facade and dispatch groups

| ID | Step 7 contract group | exact Step 6 input | Step 7 required output | forbidden fallback / blocker |
|---|---|---|---|---|
| `S7H-01` | 10 Command application callables | `SandboxCommandKind` 10 variants；context/boundary/policy/run/capture/handoff/control/failure/cleanup/redline current factories | 每variant一个exact method，或closed selector + 10 exact input carriers + exhaustive dispatch；返回`SandboxServiceOutcome`/stored surface relation | 16个未定义`*Input`名称、`run_command(String, ..)`、从route猜operation均阻塞。 |
| `S7H-02` | 13 Query application callables | `SandboxQueryKind` 13 variants；13类committed source/view/report/audit refs；`SandboxQueryAccessDecision` | 每query exact selector/input/output；access-first、zero write、Found/absence/degraded完整读取面 | 压成`get_status/get_view/list`、拼view ref、query触发repair/rebuild均阻塞。 |
| `S7H-03` | 9 Consumer application callables | `SandboxConsumerKind` 9 variants；reference markers、typed signal/observation、control/handoff/relay feedback、stored receipt | 每consumer exact source envelope input、dedup/stored receipt result和finite business outcome；source authority显式 | 两个generic consumer method、error字符串分类、external body或topic分派均阻塞。 |
| `S7H-04` | 10 Operations Job application callables | `SandboxJobKind` 10 variants；maintenance target/item/batch outcome；full accumulator/finalizer | 每job exact selection input/item callable/batch outcome/report finalizer；fresh与duplicate路径分离 | 单一`run_job`+opaque target、jobs扫描repository、counter-only report均阻塞。 |
| `S7H-05` | API/worker/jobs entry adapter | API §11.4~§11.7；worker §11.9~§11.12；jobs §11.15~§11.18 | command/query、9 consumer/fulfillment/relay、10 job分别有exact context/mapping callable和module error | generic`map_outcome`、`consumer_context(...OpaqueRef)`、`record_job_outcome(ServiceOutcome)`均失效。 |

Command/Query/Consumer/Job合计42个application entry callable；13 outbound event不作为entry facade，
由relay/publisher组承接。Step 7可采用“每variant独立method”或“closed selector + exact variant carrier”之一，
但必须提供42/42 exhaustive mapping，不能依赖字符串或未定义union。

### 10.3 Transaction, identity and repository groups

| ID | Step 7 contract group | exact Step 6 input | Step 7 required output | forbidden fallback / blocker |
|---|---|---|---|---|
| `S7H-06` | UoW / clock / typed ID | core `Version/Timestamp/JobRunId`；52 named refs；audit/relay attempt/stored surface typed identities | begin/commit/rollback、transaction handle、clock和每类application-generated identity的exact method；rollback不泄露cursor/ref | `SandboxRepositoryVersion`别名、timestamp/cursor当Version、为transient entry对象生成opaque identity均阻塞。 |
| `S7H-07` | mutable truth repositories | §9.2的20个mutable owner及object-owned transition error | get-with-version + create/save/CAS/append所需exact surface；same-UoW multi-object write和not-found/conflict语义 | generic`save<T>`、row-only update、repository私有状态转换、caller传status均阻塞。 |
| `S7H-08` | immutable snapshot/fact repositories | §9.3的13个immutable owner | exact get/append/create、replacement identity、source/version/correlation读取面；旧snapshot不update | 把immutable snapshot写成mutable row、latest-only读取或从status重建对象均阻塞。 |
| `S7H-09` | idempotency / stored public surface | `SandboxServiceCallContext`;`SandboxIdempotencyRecord`;`SandboxStoredOperationResult`;full command/receipt/report surface | reserve读取channel/operation/key/digest；complete/fail；typed save/get对称；duplicate只replay | channel硬编码、missing result时重跑、只存generic ref/placeholder均阻塞。 |
| `S7H-10` | audit / relay repositories | `SandboxAuditTrace`;`SandboxEventRelayDraft/Record`;frozen payload/attempt/target binding | append-only trace；draft/finalize；pending/retry selection；exact attempt inspect/save和Version/UoW | post-commit补event、publisher现查current truth重建payload、publish failure回滚source均阻塞。 |

repository trait owner只能是application，infra实现fake/durable adapter。domain transition必须在application已加载
`Versioned<T>`、已取得typed external observation后调用；repository不能拥有额外业务状态机。

### 10.4 Resolver, external adapter and read-maintenance groups

| ID | Step 7 contract group | exact Step 6 input | Step 7 required output | forbidden fallback / blocker |
|---|---|---|---|---|
| `S7H-11` | context/reference/policy/capability resolver | external/source refs、safe summary、source digest/version、resolution objects、policy/capability snapshot factory | 每种source exact typed resolver input与finite outcome；body-free summary/snapshot；unavailable/invalid/stale显式 | 返回external body、generic map、用`ApplicationError`字符串决定可持久化resolution status均阻塞。 |
| `S7H-12` | isolation lifecycle adapter | accepted context/identity、boundary requirement、fresh capability、persisted handle/lease、typed lifecycle observation | establish/launch/inspect/release分别独立port；exact correlation；commit-unknown进入inspect；不复用establishment outcome | policy decision传入environment establishment、generic backend action、weak fallback或SDK type泄漏均阻塞。 |
| `S7H-13` | capture/handoff/investigation/publisher adapter | terminal run/capture candidate、persisted target attempt、redline preservation/investigation、persisted relay attempt | capture、per-target handoff、investigation和publisher各有finite typed outcome；转换为domain observation后再apply | aggregate handoff result、generic receipt、adapter直接写status、jobs消费infra outcome均阻塞。 |
| `S7H-14` | projection/derived/reference/reconciliation maintenance | refresh scope/index/bundle key、rebuild plan完整body-free input、same-snapshot report scope/coverage/finding | exact selection + typed load/save/whole-group replace；scope index、dispatch target、view factory全部输入；query side零写 | 扫描sibling body、从state ref解析bundle key、从existing view/config/fake map补字段、reconciliation修truth均阻塞。 |
| `S7H-15` | runtime config / availability / assembly | 18 adapter kind + activation/binding summary + exact generation；API/worker/jobs runtime dependencies | validated config summary read、18-slot availability、generation publication后build；fake/durable binding parity | optional selected binding、startup required失败转degraded、config改变domain redline/guard均阻塞。 |

### 10.5 Step 7 error and parity gate

| surface | required error boundary | parity requirement |
|---|---|---|
| application facade / repository / port | `SandboxApplicationError` 16 kind + 41 detail exhaustive；保留typed source relation | fake/durable相同输入返回同一finite disposition、not-found/conflict/unavailable语义。 |
| domain callable | object-owned error，不退化为`DomainError::InvalidStateTransition` | fake不得绕过factory/guard/transition。 |
| infra adapter | `InfraError` 18 variant；raw provider cause止于adapter内部 | fake必须能制造每个finite outcome和commit-unknown，不可默认成功。 |
| API entry | `ApiError` 7 variant | transport fake与real都只能消费checked disposition/public kind。 |
| worker entry | `WorkerError` 12 variant | ack/retry后移Step 9/12；fake不能从status猜处置。 |
| jobs entry | `JobsError` 17 variant | fresh/duplicate、完整batch/continuation/report relation一致。 |

### 10.6 Step 7 开工前 blocker register

| Blocker ID | current evidence | Step 7 required closure | status at Step 6 handoff |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-INPUT-001` | historical facade引用16个未定义`*Input` | exact carrier schema、字段来源、optionality、error和DTO source map | open_for_step_7_regression |
| `SBX-DDD-GRANULARITY-STEP7-DISPATCH-001` | historical 13 Query/9 Consumer/10 Job压成粗粒度method | 42/42 entry callable exhaustive dispatch | open_for_step_7_regression |
| `SBX-DDD-GRANULARITY-STEP7-REF-001` | historical id generator/repository使用`SandboxOpaqueRef`和旧version wrapper | named typed identity、core `Version`、transient no-second-id | open_for_step_7_regression |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | historical adapter outcome可直接转domain status | typed observation/application result后由owner method接受 | open_for_step_7_regression |
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | historical read/maintenance port缺exact index、bundle key、body input与whole-group writer | `S7H-11/14`读取与写入面对称闭口 | open_for_step_7_regression |
| `SBX-DDD-GRANULARITY-STEP7-ENTRY-001` | historical API/worker/jobs entry mapper丢selector/status/result relation | `S7H-05`逐entry exact callable | open_for_step_7_regression |

这些是Step 7的预登记内部设计blocker，不是新L1/L2 blocker。它们不会阻止Step 6完成，但任一在Step 7
结束时仍open，都必须使Step 7保持blocked，不能进入Step 8或implementation。

---

## 11. Downstream watch与禁止反向传播

| downstream owner | Step 6固定输入 | current state | 本批禁止事项 |
|---|---|---|---|
| Step 7 | 本文件§8~§10 + 69 registry | next regression step after review | 不修改旧Step 7正文。 |
| Step 8 | 55 logical selector、52 refs、39 status、16 public error | blocked_by_step_7_regression | 不提前写DTO schema或解决actor authority。 |
| Step 9 | current factories/transitions/helpers和42 entry/13 relay handoff需求 | blocked_by_step_8_regression | 不提前改flow。 |
| Step 10 | 20 mutable +13 immutable +6 surface status分类 | blocked_by_step_9_regression | 不提前传播30状态机/31 enum结论。 |
| Step 11~18 | affected persistence/error/race/config/observability/test/handoff | downstream_revalidation_pending | 不把watch写成pass或测试结果。 |
| 正式`03~07` | 回归后的完整校准链 | historical_reviewed_revalidation_pending | 不定向patch正式正文。 |
| implementation | 11 boundary overlay；`CB-SBX-01A`唯一current identity | blocked / wait_design | 不改skeleton、Gate或allowed scope。 |

Sandbox scope redline继续成立：Step 7只能定义运行隔离基础的repository/resolver/backend/capture/handoff/
cleanup/audit/relay/read接缝，不得吸收tools semantic execution、runtime agent loop或member lifecycle
orchestration。artifact与observability只通过body-free handoff/ref/summary协作，Sandbox不拥有其正文真相。

---

## 12. `6R07-A/B`阶段自检

| check | expected | current result |
|---|---:|---|
| registry family / row | 6 / 69 | 6 / 69 |
| canonical source | 5 | 5 unique |
| module owner | 7 | 7 |
| Step 7 handoff group | 15 | 15 |
| entry callable inventory | 42 | 10 + 13 + 9 + 10 |
| outbound event logical owner | 13 | relay/publisher group，非entry facade |
| Step 7 pre-registered blocker | 6 | 6 exact later owner |
| new L1/L2 blocker | 0 | 0 |
| schema duplicated in this file | 0 | 0 |
| formal doc / Step 7 / skeleton / code modified | 0 | 0 |

`6R07-A/B`内容已闭合，下一批只允许执行主控回填、恢复源同步和静态差集审计。此时仍不能把
`6R-07`或Step 6标记为完成。

---

## 13. Step 19正式回填草稿

本节只提供未来Step 19装配规则，不修改正式`03-详细设计.md`。

### 13.1 正式章节来源映射

| 正式`03`位置 | current校准来源 | 必须进入正式正文 | 不得装配的historical内容 |
|---|---|---|---|
| §5 modules总览与owner | Step 5 §9.5~§9.8；本文件§9 | 七模块职责、依赖、non-core闭口结论 | 回归前主控旧模块对象摘要。 |
| §5 contracts对象契约 | shared types §7~§13；各分件contracts-owned view/support | exact shared type/ref/status/error和public view/report carrier | old opaque ref、旧status alias和wire-only duplicate。 |
| §5 domain对象契约 | context §10~§21；policy §10~§24；failure §12~§16 | 每个current object独立schema、factory/method/error/guard/invariant | 主控§10~§14/§24~§25中的旧同名声明。 |
| §5 application/infra/entry对象契约 | application/infra/entry §9~§11 | stable carrier、typed outcome、entry shell和module error | 该分件§6~§8 historical draft。 |
| §5收口摘要 | closure audit §6~§12；本文件§7~§12 | field/factory/guard/ref/status/error/dependency闭合和Step 7 handoff | 过程性批次快照、临时审计命令输出。 |
| §6全局对象索引 | shared §8 registry；本文件§7~§8 | 69-ID索引与unique canonical source link | 第二套对象字段或状态定义。 |

正式正文必须保留可落码的完整对象契约，不能只写本文件的索引摘要并要求实现者回读校准文件自行拼接。
索引章只负责查找，不承载新设计判断。

### 13.2 正式装配红线

- 不把`6R-07`的15个handoff组写成Step 7已经完成；它们只是下一Step输入。
- 不写入旧`SandboxOpaqueRef`、旧`DomainError::InvalidStateTransition`、幽灵helper或旧status名。
- 不把静态文本审计写成Rust compile/test/runtime结果。
- 不改变formal`04~07`效力；Step 19重装配完成后仍需按受影响集合定向重验。
- 不把tools/runtime/member语义、artifact body、observability store或policy definition truth装入Sandbox。

---

## 14. 待确认事项与后续owner

| item | current disposition | exact later owner | 是否阻塞Step 6 |
|---|---|---|---:|
| 15个Step 7 contract group的最终trait/callable名称与schema | 本文件只固定输入/门禁 | Step 7 regression | 否；阻塞Step 8 |
| 42 entry callable具体采用独立method还是closed selector dispatch | 两种均可，但必须42/42 exhaustive且carrier exact | Step 7 | 否；Step 7未闭合则阻塞 |
| 13 outbound event payload/schema | logical selector固定，payload未定义 | Step 8 | 否 |
| historical actor `Maintenance/operator-scoped`冲突 | P0 worker/job继续System-only | Step 8 | 否；不是新上游blocker |
| 30 state machine /31 enum重验 | 只登记watch，不宣称通过 | Step 10 | 否 |
| persistence/UoW/CAS/whole-group具体schema | Step 7先闭callable，Step 11闭存储与顺序 | Step 7 / 11 | 否 |
| edition/rust-version/core revision/design commit baseline | 仍未固定 | implementation Activation | 否；implementation保持blocked |
| 目标实现仓 | 不存在且本轮不创建 | `CB-SBX-01A` Activation | 否；implementation保持blocked |

Step 6内没有剩余schema/field/factory/guard/transition/ref/status/error/module-owner unresolved。后续Step若
发现current object无法支撑exact callable，必须重开Step 6并更新69-row owner，不得用local helper绕过。

---

## 15. `6R07-C`静态审计

### 15.1 审计范围

一次性检查器`/tmp/audit_l4_sandbox_6r07.pl`读取15个设计输入：shared、四份对象分件、Step 4/5、
`6R-06` closure、本文件、Step 6主控、control、flow、两层ledger和historical Step 7。它只解析Markdown
registry、source heading、module/handoff/blocker row、scope redline和恢复字段。

该工具不是compiler、linter、test runner、runtime probe或evidence producer。其结果只对本轮读取的设计
文本有效，任何后续修改都要求重新审计。

### 15.2 状态同步前结果

| check | expected | observed | unresolved |
|---|---:|---:|---:|
| registry master | 69 | 69 | 0 |
| canonical source | 5 | 5 | 0 |
| module owner | 7 | 7 | 0 |
| Step 7 handoff group | 15 | 15 | 0 |
| Step 7 pre-registered blocker | 6 | 6 | 0 |
| scope/schema boundary | 5 | 5 | 0 |
| completed recovery source | 10 | 1 before sync | 9 expected pending |

首轮唯一失败是九个完成态来源尚未同步，符合“先验证内容，后切恢复点”的顺序。最终必须复跑到
`audit_failures=0`后才能关闭`6R-07`。

### 15.3 状态同步后最终结果

完成态同步后以`perl /tmp/audit_l4_sandbox_6r07.pl ...`读取同一15个设计输入复跑。脚本文件本身未设置
执行位，因此未把直接执行返回的`permission denied`误记为设计失败；改由Perl解释器执行同一脚本后，
命令退出码为0。

| check | expected | observed | unresolved |
|---|---:|---:|---:|
| registry master | 69 | 69 | 0 |
| canonical source | 5 | 5 | 0 |
| module owner | 7 | 7 | 0 |
| Step 7 handoff group | 15 | 15 | 0 |
| Step 7 pre-registered blocker | 6 | 6 | 0 |
| scope/schema boundary | 5 | 5 | 0 |
| completed recovery source | 10 | 10 | 0 |

最终输出为`audit_failures=0`。本结果只证明当前Markdown设计文本中上述集合和恢复字段闭合；不证明
Rust编译、测试、运行、provider可用、evidence形成或验收通过。此后任一审计输入发生修改都必须复跑。

### 15.4 负向事实

| fact | result |
|---|---|
| 正式`03~07`修改 | 0 |
| Step 7正文修改 | 0；仍是historical reviewed material。 |
| implementation boundary skeleton/status修改 | 0 |
| 实现代码/仓修改 | 0 |
| compile/test/run/provider/evidence/acceptance事实 | 0 |
| 新L1/L2 blocker | 0 |

---

## 16. `6R-07`完成门禁与Step 6停审点

69-row registry、五份canonical source、七模块owner、15个Step 7 handoff组和六个Step 7预登记blocker
均已唯一定位。Step 6的对象schema差集已由`6R-06`确认，本批没有新增或复制schema。因此`6R-07`可在
最终恢复审计为0后进入`completed_wait_user_review`，同时Step 6进入回归后的正式用户审查点。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
current_batch = 6R-07 master assembly and Step 7 handoff
step_status = reopened_completed_wait_user_review
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = step_6_current_canonical_baseline_closed_wait_review
next_allowed_action = wait_user_review_before_step_7_regression
upstream_6R_06 = review_confirmed_consumed
registry_rows = 69/69
canonical_sources = 5/5
module_owners = 7/7
step_7_handoff_groups = 15/15
step_7_entry_callable_inventory = 42/42
step_7_preregistered_blockers = 6/6
static_audit_unresolved = 0
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

用户确认Step 6前不得启动Step 7回归，不得修改historical Step 7正文，不得进入Step 8~10、正式`03~07`
或实现仓。本次用户确认若到达，只授权读取Step 7 SOP/规范、创建Step 7 regression control/flow分件并从
第一个明确批次开始，不自动完成Step 7。

上述§16是Step 6完成待审时的historical recovery snapshot，现由物理末尾§17覆盖；69-row registry、
五份canonical source、15个handoff和六个Step 7 blocker继续作为current Step 7输入。

## 17. Step 6 review confirmation consumed by `7R-M0`

用户已确认Step 6。本次确认只授权创建Step 7 regression控制面`7R-M0`，不等于确认historical Step 7，
也不授权直接进入任何trait内容批次。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
step_6_status = review_confirmed_consumed_by_7R_M0
step_6_registry_rows = 69/69
step_6_canonical_sources = 5/5
step_6_handoff_groups = 15/15
step_7_preregistered_blockers = 6/6_open_with_owner
next_allowed_action = wait_user_review_before_7R_01_service_facades
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

Step 6 schema authority保持不变。Step 7若发现schema缺口，必须显式重开Step 6，不能修改本节掩盖差异。
