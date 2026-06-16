# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填章节: `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 5 phase 计划、新版 `03` object / port / protocol / flow / state / persistence / error / idempotency / test cuts、`05/06` 测试验收输入 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 自动停审:PH-01~PH-08 的任务、BATCH、commit boundary、设计闭环复核、经验复核和跨 boundary 审计已列出 |

## 2. 本步目标

本 Step 把 Step 5 的 PH-01~PH-08 继续拆成可执行、可 review、可回退、可验证的 commit boundary。

本 Step 只回答:

- 每个 phase 内有哪些实施动作。
- 阶段内代码、测试和脚本应该按什么顺序写。
- 哪些 BATCH 属于同一提交边界,哪些必须拆分。
- 每个 commit boundary 包含什么、不包含什么、何时可以提交。
- 每个 commit boundary 开工前要复核哪些设计闭环和历史经验项。
- 发现设计缺口时如何暂停,而不是让实现者现场补 schema、port、状态、mapper、stored surface 或 evidence 规则。

本 Step 不写正式测试 GATE 编号,不新增 TC、EV、AC、VETO,不定义新的 DTO、trait、状态、错误类型、config key、artifact JSON schema 或代码文件内容。正式门禁编号、命令和 evidence 映射留给 Step 7。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | 提供 PH-01~PH-08 阶段顺序、可验证增量和阶段停审 |
| `03_ddd_step_04_file_layout.md` | 已完成 | 提供 workspace、crate、binary、文件路径和依赖方向 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 提供七个 crate 的职责和禁止依赖 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供对象、字段、factory、state value、view/report/outbox/handoff/replay surface |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 application-owned port、UoW、repository、resolver、publisher、handoff、fake parity 和 entry restriction |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 6 Command、14 Query、5 Inbound/Callback、10 Outbound material、6 Job public protocol surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command/query/consumer/callback/outbound/job function flow、transaction order、no-write/no-repair |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供状态 owner、合法迁移、terminal/retryable、query/job/entry 状态边界 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、version、cursor、UoW、stored replay、fake/durable parity |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供错误层级、public mapping、异常分支和 recovery class |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 提供 key/digest、duplicate replay、in-flight、commit unknown、reentry guard |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供最小测试切口和 negative cut 输入 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 提供 implementer reading matrix、boundary audit input 和 blocker 回报格式 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 P0 suite、TC/EV 族、artifact/report root 和 evidence 规则 |
| `06-验收标准.md` | 已审核通过 | 提供 AC/VETO、P0 blocking suite、证据入口和退出条件 |
| `设计真相源闭环与可落码性标准.md` §九 | 当前标准 | 提供每个 boundary 的开工前复核和经验复核项 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 6 规则与统一模板 | 固定 boundary 粒度、BATCH、复核和暂停规则 | SOP Step 6、书写规范、可落码性标准 §九、Step 17 handoff | 统一拆分原则、统一表格模板、全局 boundary 清单 | 不写业务新契约;不定义正式 GATE 编号 |
| M2 PH-01 / PH-02 foundation boundary | 拆 workspace、contracts、domain、state 基座 | Step 4/5 file layout、module contracts、object/state/protocol shell | commit-01-a、commit-02-a~c | contracts 不依赖 domain;domain 不依赖 application/infra |
| M3 PH-03 application / infra foundation boundary | 拆 ports、UoW、fake runtime、stored replay 基座 | Step 7/11/13 | commit-03-a~c | fake 只实现正式 port;不得用 private map 补口 |
| M4 PH-04 command write path boundary | 拆 6 Command 写链 | Step 8/9 command、Step 10/11/12/13 | commit-04-a~c | accepted side effect same-UoW;duplicate replay 不重跑 |
| M5 PH-05 query / read model boundary | 拆 14 Query 和 visibility/read model | Step 8/9 query、Step 10/12 query surface | commit-05-a~c | query no-write;stable lookup/visibility 来源正式 |
| M6 PH-06 inbound / callback / outbound material boundary | 拆 5 consumer/callback 与 10 outbound material | Step 8/9 consumer/outbound、Step 11/13 receipt replay | commit-06-a~c | missing target 不隐式创建;outbound accepted-only |
| M7 PH-07 operations job boundary | 拆 6 Job、maintenance、publish/deliver/retry | Step 8/9 job、Step 10/11/12/13 job/outbox/handoff | commit-07-a~c | job report replay;job no business truth repair |
| M8 PH-08 entry / config / scripts / evidence boundary | 拆 API/worker/jobs entry、config、gate/report/evidence | Step 4/5/14/15/16、`04/05/06` | commit-08-a~c | entry 不直连 store;report/evidence 不静态伪造 |
| M9 跨 boundary 审计与回填 | 统一检查粒度、依赖、经验复核、进入 Step 7 条件 | M1~M8 | 跨 boundary 审计、回填草稿、待确认事项 | blocker 不得标通过;Step 7 才绑定正式门禁编号 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | commit boundary 必须比 phase 小,但大到能独立 review / rollback;BATCH 超过风险逻辑应拆 | §7.1~§7.4 | 通过 |
| M2 | foundation 先按 crate boundary 和状态/协议 shell 建立编译约束,避免业务 flow 先行 | §7.5~§7.6 | 通过 |
| M3 | ports/fake/stored replay 是所有 flow 的前置,必须在 command/query/consumer/job 前收口 | §7.7 | 通过 |
| M4 | command 按 member/lifecycle、role/career/memory、handoff 三组纵切拆,防止 6 条 command 一笔过大 | §7.8 | 通过 |
| M5 | query 按 visibility/projection 基座、core read、operations read 三组拆,确保 no-write 先被测试 | §7.9 | 通过 |
| M6 | consumer/callback 和 outbound material 共用 receipt/outbox marker,但 publisher 执行后移 PH-07 | §7.10 | 通过 |
| M7 | job 先 report/replay surface,再 maintenance,最后 propagation publish/deliver/retry | §7.11 | 通过 |
| M8 | entry/config/scripts/evidence 分三段,避免 entry 绕过 facade 或 final evidence 静态伪造 | §7.12 | 通过 |
| M9 | 统一复核所有 boundary 的设计闭环和经验项 | §7.13~§7.16 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个阶段内有哪些实施动作? | 见 §7.5~§7.12。每个 PH 均拆为 IMPL 任务、BATCH 和 commit boundary。 |
| 每个任务的输入、输出和完成判定是什么? | 每个 PH 的阶段任务表列出正式输入、输出和完成判定。 |
| 阶段内代码应该按什么顺序写,为什么? | 顺序遵循 contracts/domain -> application ports/fake -> command -> query -> consumer/outbound -> job -> entry/config/evidence。原因是后续 flow 不能依赖未定义 surface。 |
| 是否先锁定外部契约和测试切口,再填内部实现? | 是。PH-01~PH-03 先锁 workspace、contracts/domain、port/fake/stored replay;业务 service 从 PH-04 开始。 |
| 哪些任务必须同提交,哪些必须分开提交? | 同一可验证纵切且无法单独 review 的子功能同提交;状态机、事务、幂等、adapter outcome、artifact/report 等高风险面单独或前置提交。 |
| 哪些时机可以 commit,哪些时机不能 commit? | 只有 boundary 内代码、targeted tests、格式检查、设计闭环复核和经验复核均通过时可以 commit。存在 half-written schema、未验证 fake parity、未跑对应 suite direction 或 blocker 时不能 commit。 |
| 哪些测试必须在提交前执行? | 本 Step 列 suite direction 和 check direction;正式命令 / GATE 编号留 Step 7。每个 commit 至少需要 format/check、相关 crate unit、相关 P0 suite 子集和 redaction/dependency scan direction。 |
| 是否存在提交边界过大或过小的问题? | 当前边界按 1~3 个 BATCH 聚合为一个 reviewable increment。PH-04~PH-07 按 flow family 拆分,避免一笔包含全部 command/query/job。 |
| 是否存在把无关修改混入同一提交的风险? | 有,尤其 entry/config/evidence 和 infra fake 容易夹带业务 surface。每个 boundary 都列 explicit exclusions,并由 Step 11 继续写工作区安全规则。 |
| 每个提交边界能否用一句话描述? | 能。见 §7.4 和各 PH commit boundary 表。 |
| 每个提交边界是否可以独立 review、验证和回退? | 是。每个 commit boundary 都有 included/excluded、BATCH、预提交门禁方向和停审。 |
| 单批代码预计超过 300 行或 500 行如何处理? | 预计超过 300 行标为需分批 review;超过 500 行必须拆。本文把大面拆到 BATCH 层,并要求 implementation 时继续按可验证切片拆。 |
| 状态机、事务、并发、幂等、安全、审计、错误恢复或跨仓同步逻辑如何处理? | 不并入普通 happy path 大批次;分别在 PH-02/03/04/07/08 中前置或单独 BATCH,并触发 §九经验复核。 |
| 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary? | 使用 §7.3 通用设计闭环复核表,并在各 boundary 经验复核表选择适用项。 |
| 发现详细设计、测试方案、验收标准冲突时怎么办? | 当前 boundary 标为 blocker,记录证据、影响范围、建议闭口点,先回写设计真相源并固定 baseline 后再继续。 |
| 实现 agent 后续只需二次校验哪些条件? | 校验当前 boundary 的正式文档 baseline、included/excluded、port/schema/state 是否存在、测试门禁是否可跑、工作树是否有无关改动。实现 agent 不承担现场补口。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 | 只有 PH-01~PH-08 phase,未拆 commit boundary | 本 Step 拆 commit-01-a 到 commit-08-c |
| `03` handoff | 只给 boundary audit input,未给本项目实际边界结论 | 本 Step 对每个 boundary 做设计闭环复核和经验复核 |
| `05/06` | suite、EV、AC/VETO 已有,但正式 GATE 编号未嵌入 | 本 Step 只写 suite direction;Step 7 正式绑定 |
| report/evidence | `05` 已有 raw artifact 必填字段,但 final evidence 不能在脚本壳阶段伪造 | PH-08 区分脚本能力、report audit、final acceptance handoff |
| entry / job | entry 容易绕过 application facade 或 job runner 直连 repo | PH-08 entry 前置 facade/dispatch catalog,PH-07 job service 先完成 |
| fake runtime | fake 容易先用 private map 填缺口 | PH-03 和各 flow boundary 明确 fake 只能实现正式 port |

## 7. 结构化中间产物

### 7.1 拆分原则

| 原则 | 说明 | 失败处理 |
|---|---|---|
| phase 是能力阶段 | PH-01~PH-08 仍按 Step 5 的可验证功能增量组织 | 发现 phase 内边界过大时在 commit boundary 拆分,不新造 phase |
| commit 是 review / rollback 单元 | 每个 commit boundary 应能一句话描述,能独立 review 和回退 | 过大则拆 BATCH / commit;过小则合并到同一可验证增量 |
| BATCH 是代码写入节奏 | BATCH 可小于 commit,用于控制大文件和高风险逻辑 | 单 BATCH 超 500 行必须拆 |
| external contract 先于 orchestration | DTO/ref/state/port/fake 基座必须先于 service flow | 若 flow 依赖未落 surface,调整到前置 boundary 或回写设计 |
| write path 先于 read path | command accepted truth / side effect 完成后再做 query/read model | query 不得为通过测试创建 truth |
| job runner 后于 job service | job service/report/stored replay 完成后才接 entry runner | runner 不得直连 repo 反推 report |
| evidence 分层成熟 | script capability、run report、evidence index、acceptance handoff 分阶段收口 | 无 raw artifact / report pairing 时不得写通过结论 |

### 7.2 全局 commit boundary 清单

| Phase | Commit boundary | 一句话描述 | 主要 BATCH | 预提交门禁方向 |
|---|---|---|---|---|
| PH-01 | commit-01-a | 建立 workspace、crate skeleton、依赖边界和空入口骨架 | BATCH-01-01~02 | compile / format / dependency boundary scan |
| PH-02 | commit-02-a | 建立 contracts shared refs、metadata、protocol envelope 和 public surface shell | BATCH-02-01~02 | contracts unit / body-free schema scan |
| PH-02 | commit-02-b | 建立 domain core truth、policy、guard 和 business state transition foundation | BATCH-02-03~04 | contract-domain-fast core domain subset;`TC-ID-DOMAIN-001~006` |
| PH-02 | commit-02-c | 建立 domain projection/reference/outbox/handoff/replay state helpers | BATCH-02-05~06 | support state subset / forbidden body scan;`TC-ID-STATE-001~002` |
| PH-03 | commit-03-a | 建立 application shared helpers、UoW、context、id/clock/cursor 和 mapper ports | BATCH-03-01~02 | application compile / mapper key tests |
| PH-03 | commit-03-b | 建立 repository / resolver / publisher / handoff / read ports 和 fake runtime skeleton | BATCH-03-03~04 | infra-runtime-fake subset |
| PH-03 | commit-03-c | 建立 idempotency、stored result、receipt/report replay 和 fake parity 基座 | BATCH-03-05~06 | replay / conflict / rollback subset |
| PH-04 | commit-04-a | 落 member anchor 与 lifecycle command 写链 | BATCH-04-01~02 | service-flow-fast command subset |
| PH-04 | commit-04-b | 落 role/career/memory command 写链 | BATCH-04-03~05 | service-flow-fast command subset + redaction |
| PH-04 | commit-04-c | 落 trace handoff command 与 command side-effect/replay 收口 | BATCH-04-06~07 | command replay / handoff pending subset |
| PH-05 | commit-05-a | 落 query visibility、projection lookup、read model helper 基座 | BATCH-05-01~02 | query no-write foundation |
| PH-05 | commit-05-b | 落 core truth / member summary / trace / audit query family | BATCH-05-03~05 | service-flow-fast query subset;`TC-ID-QUERY-001~008`;`TC-ID-QUERY-015` |
| PH-05 | commit-05-c | 落 maintenance/report/outbox/handoff query family 与 no-write audit | BATCH-05-06~07 | query no-write + degraded/stale subset;`TC-ID-QUERY-009~014`;`TC-ID-QUERY-015` |
| PH-06 | commit-06-a | 落 inbound/callback envelope、receipt store、consumer context 基座 | BATCH-06-01~02 | entry-worker-job consumer scaffold subset |
| PH-06 | commit-06-b | 落 5 consumer/callback accepted/delayed/quarantined/replay flow | BATCH-06-03~05 | entry-worker-job consumer subset |
| PH-06 | commit-06-c | 落 10 outbound accepted material、payload marker 和 outbox snapshot | BATCH-06-06~07 | operations-replay-core outbox material subset |
| PH-07 | commit-07-a | 落 job request/report/stored replay shared surface 和 job service skeleton | BATCH-07-01~02 | operations job replay scaffold |
| PH-07 | commit-07-b | 落 rebuild、refresh、reconciliation maintenance job family | BATCH-07-03~05 | operations-replay-core maintenance subset |
| PH-07 | commit-07-c | 落 publish、deliver、retry propagation job family | BATCH-07-06~08 | operations-replay-core propagation subset |
| PH-08 | commit-08-a | 落 API/worker/jobs entry wiring、runtime builder 和 config redline | BATCH-08-01~03 | entry-worker-job + config-redline direction |
| PH-08 | commit-08-b | 落 gate/report/check scripts 和 run-scoped artifact/report writer | BATCH-08-04~06 | report-generation-audit direction |
| PH-08 | commit-08-c | 落 release smoke、evidence index、acceptance handoff 和 final audit | BATCH-08-07~09 | release-main-smoke + all P0 evidence direction |

### 7.3 通用开工前设计闭环复核表

每个 commit boundary 开工前必须用下表复核。各 phase 后续表只列重点适用项,不重复全文。

| 复核项 | 检查内容 | 失败处理 |
|---|---|---|
| 字段闭环 | 当前 boundary 涉及的必填字段能回指 request/event/job、repository read、resolver summary、Clock、IdGenerator、cursor 或 formal mapper | 暂停并回写 object/protocol/flow |
| DTO 构造闭环 | public request / envelope / job input 能构造目标 domain input 或明确只读取 view/report | 暂停并回写 protocol/flow |
| Query response 闭环 | query view/page/marker 有正式字段、来源、empty/not visible/degraded/stale/missing surface | 暂停并回写 query schema/flow |
| ref identity 闭环 | lookup ref、subject ref、view ref、report ref、handoff ref 均有正式 type、key 和 mapper/lookup | 暂停并回写 ref schema/port |
| validation truth 闭环 | 每条校验有 truth source / resolver / repository / policy 输入 | 暂停并回写 port 或 flow |
| 状态闭环 | enum / state matrix / factory / transition helper / test cut 使用同一状态名 | 暂停并回写 object/state matrix |
| persistence / version 闭环 | save/update expected version 来自正式 versioned read 或 create result | 暂停并回写 repository/persistence |
| cursor 闭环 | truth cursor / reference marker cursor 来自 UoW / formal assigner,不来自 timestamp/version/digest | 暂停并回写 UnitOfWork/cursor source |
| idempotency / stored replay 闭环 | context/channel/key/digest、reserve、stored result/receipt/report save/get、duplicate replay 均闭合 | 暂停并回写 Step 7/8/11/13 |
| side-effect inventory 闭环 | accepted trace/audit/outbox/stale/effect/stored result 已逐项列明;无 canonical payload 时 outbox refs 为空 | 暂停并回写 flow/outbound material |
| query no-write 闭环 | query 不开写 UoW、不 reserve idempotency、不 repair projection/reference/report/outbox/handoff | 暂停并调整 boundary 或回写 flow |
| job no-repair 闭环 | job 只写 projection/reference/report/outbox/handoff/job report,不修 business truth | 暂停并调整 boundary 或回写 job flow |
| adapter outcome 分类闭环 | resolver/publisher/handoff 返回面可判定 retryable/permanent/skipped/unsupported/unavailable 等 outcome | 暂停并回写 port/error mapping |
| machine artifact schema 闭环 | 若写机器 artifact/report,字段、required、status、digest、writer owner 和 redaction 边界来自 `05` | 暂停并回写测试方案,不得凭字段印象实现 |
| phase boundary | 当前 boundary 不依赖后续才实现的 DTO、port、state、stored report、artifact、evidence 或 runner | 调整 boundary 或先回写设计 |
| blocker 经验回写 | 当前 boundary 暴露的新型 blocker 已检查标准,必要时回写经验 | 暂停并完成标准/设计回写 |

### 7.4 通用提交粒度与停审模板

| 判断项 | 通过条件 | 失败处理 |
|---|---|---|
| 一句话描述 | commit boundary 目标能用一句话说明 | 拆分或改名 |
| 独立 review | reviewer 不需要阅读后续未提交代码才能判断正确性 | 拆分前置 surface |
| 独立验证 | 至少有 compile/check/unit/suite direction 能验证主要风险 | 补 Step 7 门禁或调整 boundary |
| 独立回退 | 回退该 commit 不破坏已完成前序 boundary 的概念完整性 | 拆出无关改动 |
| 不混入后续 | 不提前实现后续 phase 的 DTO、port、runner、script、evidence | 移出当前 commit |

### 7.5 PH-01 Workspace / Dependency / Skeleton

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 建立 workspace root 和 7 个 crate skeleton | Step 4 file layout、module contracts | root manifest、crate manifests、lib/bin skeleton | workspace 可以空编译 |
| IMPL-01-02 | 2 | 固定 compile dependency boundary 和 package / crate / binary 命名 | Step 4 dependency 表、目录规范 | workspace dependency declaration、dependency scan baseline | 除 core contracts 外无 sibling business path dependency |
| IMPL-01-03 | 3 | 建立 minimal module docs 和 placeholder entry main | Step 4 file tree | api/worker/jobs 空入口和模块注释 | 无业务 DTO / service / repository implementation |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | workspace / crate skeleton | Step 4 §7.2~§7.7 | root Cargo、7 crate Cargo、lib skeleton | 100~300 行 | compile / format | commit-01-a |
| BATCH-01-02 | entry skeleton and dependency scan | Step 4 binary list、dependency 表 | api/worker/jobs bin skeleton、dependency check script hook direction | 100~300 行 | dependency boundary scan | commit-01-a |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-01-a | workspace skeleton 编译、命名和依赖边界检查通过后 | workspace、crate、binary skeleton、manifest dependency shape | DTO 字段、domain object、application port、fake runtime、业务测试证据 | format、workspace compile、dependency boundary scan |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-01-a | workspace + dependency + empty entry | 共同形成后续所有 crate 可编译边界;拆开会留下不可编译 workspace | BATCH-01-01~02 | compile / dependency scan | business implementation |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-01-a | phase boundary、dependency boundary、path baseline、crate naming | Step 4 file layout、Step 5 module contracts | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-01-a | workspace / dependency / entry skeleton | phase boundary;config binding;path baseline | query、idempotency、outbox、job report 尚不涉及 | Step 4 file layout;Step 5 modules;标准 §九 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-01-a | 是否只建立 skeleton,不写业务 surface | 通过 | 无 |
| commit-01-a | 是否为后续 contracts/domain/application 提供稳定 crate boundary | 通过 | 无 |

### 7.6 PH-02 Contracts / Domain / State Foundation

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 写 contracts typed refs、metadata、公共 marker 和 shared envelope shell | Step 6 object refs、Step 8 shared protocol | `identity-contracts` refs / common / envelope | contracts crate 可编译且无 domain dependency |
| IMPL-02-02 | 2 | 写 Command / Query / Inbound / Outbound / Job public DTO shell | Step 8 protocol inventory | commands、queries、events、jobs、views shell | DTO 能 body-free roundtrip |
| IMPL-02-03 | 3 | 写 member / lifecycle / role / career / memory domain truth 与 policy | Step 6 object contracts、Step 10 state | domain core truth modules | domain invariant / transition helper 可测试 |
| IMPL-02-04 | 4 | 写 trace/audit/projection/reference/outbox/handoff/replay domain helpers | Step 6 object contracts、Step 10 state | domain support state modules | 状态名和 Step 10 一致 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | shared refs / markers / metadata | Step 6 refs、Step 8 shared helper | contracts refs/common | 300~500 行,按文件拆 | contracts unit | commit-02-a |
| BATCH-02-02 | protocol / view / receipt / report shell | Step 8 inventories | contracts commands/queries/events/jobs/views | 需拆分 | body-free schema scan | commit-02-a |
| BATCH-02-03 | member / lifecycle domain foundation | Step 6 member/lifecycle、Step 10 10.1 | domain member_identity/lifecycle | 300~500 行,按状态族拆 | core domain subset;`TC-ID-DOMAIN-001~003` | commit-02-b |
| BATCH-02-04 | role / career / memory domain foundation | Step 6 role/career/memory、Step 10 10.2 | domain role/career/memory | 需拆分 | core domain subset;`TC-ID-DOMAIN-004~006` | commit-02-b |
| BATCH-02-05 | trace/audit/projection/reference/report state helpers | Step 6 trace/projection/report、Step 10 10.3~10.4 | domain trace_audit/projection | 300~500 行 | support state subset;`TC-ID-STATE-001` | commit-02-c |
| BATCH-02-06 | outbox/handoff/idempotency/job/runtime support states | Step 6 outbox/handoff/replay、Step 10 10.5~10.7 | domain outbox_handoff/support | 300~500 行 | support state subset;`TC-ID-STATE-002`;forbidden transition subset | commit-02-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-02-a | contracts shell 编译和 body-free schema checks 通过后 | refs、metadata、protocol envelopes、DTO/view/receipt/report shell | domain policy、repository trait、application service、infra fake | contracts unit、schema/serialization subset、redaction scan direction |
| commit-02-b | core truth domain 状态和 invariant tests 通过后 | member/lifecycle/role/career/memory truth、policy、guard、domain errors;`TC-ID-DOMAIN-001~006` evidence | application orchestration、repository/UoW、trace/outbox write side effect implementation;`TC-ID-STATE-001~002` | contract-domain-fast core domain subset |
| commit-02-c | support state helpers 和 forbidden transition tests 通过后 | trace/audit/projection/reference/report/outbox/handoff/replay/job/runtime state helpers | application ports、fake runtime、operations service | state transition subset、forbidden body scan direction |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-02-a | public contracts shared vocabulary + protocol shell | public DTO/ref vocabulary 必须同源,否则后续 domain/application 会引用漂移名称 | BATCH-02-01~02 | contracts unit | domain / application |
| commit-02-b | core business truth state + policy | core command write path 依赖这些 domain invariant,必须在 application service 前闭合 | BATCH-02-03~04 | `TC-ID-DOMAIN-001~006` | repository / UoW;support state cases |
| commit-02-c | support state families | query/job/outbox/handoff later surface 共用这些状态,必须先于 ports/fake/service | BATCH-02-05~06 | `TC-ID-STATE-001~002` | service flow |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-02-a | 字段闭环、DTO 构造闭环、body-free schema、machine artifact 不适用 | Step 6 object;Step 8 protocol | 通过 |
| commit-02-b | 状态闭环、validation truth、factory 签名、public command intent | Step 6 object;Step 9 command;Step 10 state | 通过 |
| commit-02-c | 状态闭环、public target 穷尽、outbox/handoff marker、job report state | Step 6 object;Step 10 state;Step 12 error | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-02-a | contracts / protocol | 字段闭环;DTO 构造闭环;Query response 闭环;machine artifact schema 不适用 | persistence/outbox/job runner 尚不涉及 | Step 6 object;Step 8 protocol;标准 §九 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-02-b | domain truth / policy / state | 状态闭环;validation truth;public command intent;factory 签名 | query/report/artifact 不涉及 | Step 6 object;Step 10 state | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-02-c | support states / markers | 状态闭环;public read-model identity;handoff/export marker subject;job public surface | actual port wiring 留 PH-03 | Step 6 object;Step 7 mapper;Step 10 state | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-02-a | 适中偏大,但可按 BATCH 文件拆 | 是 | 是 | 保留,实现时分文件 review |
| commit-02-b | 适中 | 是 | 是 | 保留 |
| commit-02-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-02-a | contracts 是否不依赖 domain/application | 通过 | 无 |
| commit-02-b | domain 是否不读 repository/adapter/config | 通过 | 无 |
| commit-02-c | support state 是否只落已定义 state / marker | 通过 | 无 |

### 7.7 PH-03 Application Ports / UoW / Fake Runtime Foundation

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 写 application shared helpers、UoW、Clock、IdGenerator、cursor assigner、operation context factory | Step 7 7.1~7.2 | `identity-application` helpers / operation / ports foundation | application crate 编译 |
| IMPL-03-02 | 2 | 写 subject mapper、marker mapper、maintenance issue mapper 和 dispatch target catalog | Step 7 helper contracts | mapper traits and default application helpers | canonical key tests 可写 |
| IMPL-03-03 | 3 | 写 core/read/reference/report/outbox/handoff/replay repository port traits | Step 7 7.3~7.7 | `ports.rs` repository / adapter traits | service 只见正式 port |
| IMPL-03-04 | 4 | 写 fake runtime skeleton 和 repository fake 基础语义 | Step 11 fake parity | `identity-infra` memory runtime skeleton | infra-runtime-fake subset 可跑 |
| IMPL-03-05 | 5 | 写 idempotency/stored result/receipt/job report save/get 和 replay helpers | Step 11/13 | application result assembly + fake replay stores | duplicate replay no-rerun tests 可写 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | shared helpers and UoW/context/id/clock | Step 7 7.1~7.2 | application helper modules | 300~500 行 | application unit | commit-03-a |
| BATCH-03-02 | mapper and dispatch catalog | Step 7 subject/marker/issue mapper | mapper traits/default impl shell | 100~300 行 | canonical key / target tests | commit-03-a |
| BATCH-03-03 | repository and adapter port families | Step 7 7.3~7.7 | `ports.rs` trait families | 需拆分 | application compile | commit-03-b |
| BATCH-03-04 | memory runtime / fake repository skeleton | Step 11 fake parity | infra memory runtime stores and fake ports | 需拆分 | infra-runtime-fake subset | commit-03-b |
| BATCH-03-05 | idempotency / stored result / receipt / job report helpers | Step 11/13 | result assembly and replay helper | 300~500 行 | replay subset | commit-03-c |
| BATCH-03-06 | fake parity conflict / rollback / missing replay tests | Step 11/13/16 | targeted infra tests | 300~500 行 | infra-runtime-fake subset | commit-03-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-03-a | application helper compile and mapper key tests pass | UoW/context/id/clock/cursor/mapper/catalog shared surface | repository implementations、business service flows、entry routes | application compile, mapper key tests |
| commit-03-b | formal ports and fake skeleton compile with basic parity tests | repository/adapter/read/outbox/handoff ports, fake runtime skeleton | idempotency replay semantics, command/query service | infra-runtime-fake foundation |
| commit-03-c | stored replay/idempotency/fake conflict tests pass | idempotency, stored command/receipt/job result, fake rollback/conflict/missing replay | actual command/query/consumer/job flow | replay / conflict / rollback subset |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-03-a | operation context + generated ids/cursors + mappers | 后续所有 write/read/job services 共享同一 context 和 canonical key 来源 | BATCH-03-01~02 | application unit | repositories |
| commit-03-b | ports + fake runtime skeleton | fake 必须实现正式 port surface;port 与 fake skeleton 分离会造成无法验证 | BATCH-03-03~04 | infra-runtime-fake | services |
| commit-03-c | idempotency + stored replay + fake parity | duplicate replay 是 command/consumer/job 前置能力,必须先于业务 flow | BATCH-03-05~06 | replay subset | business flow |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-03-a | accepted subject identity、marker trace subject、cursor source、operation context/channel | Step 7 helper;Step 9 shared flow;Step 13 | 通过 |
| commit-03-b | sidecar typed read/write、projection lookup、read visibility resolution、adapter outcome classification | Step 7 ports;Step 11 persistence;Step 12 error | 通过 |
| commit-03-c | idempotency reserve context/channel、stored receipt typed save/get、stored job report replay、fake parity | Step 7 result ports;Step 11/13 | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-03-a | application helper / mapper | Accepted subject identity;Reference marker trace subject;Handoff marker subject;Accepted truth cursor | query/artifact 不涉及 | Step 7 7.1~7.2;标准 §九 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-03-b | port / fake | Query visibility resolution;Projection-backed query lookup;Sidecar truth read;Adapter failure outcome;Config binding | actual entry/config 后续 | Step 7 7.3~7.9;Step 11 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-03-c | idempotency / replay | Idempotency reserve context;stored receipt typed save/get;job public surface;fake parity | command bodies 后续 | Step 8 replay shell;Step 11/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 偏大,但 port/fake skeleton 必须同源 | 是 | 是 | 保留,实现时按 port family 拆 BATCH |
| commit-03-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-03-a | mapper/cursor/context 是否不拼字符串或 timestamp | 通过 | 无 |
| commit-03-b | fake 是否只实现正式 port,不用 private map 补 lookup | 通过 | 无 |
| commit-03-c | duplicate replay 是否有 typed stored surface,不重跑 mutation | 通过 | 无 |

### 7.8 PH-04 Command Write Path Vertical Slices

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 实现 command shared discipline、request digest、accepted effect assembly | Step 9 command shared、Step 13 | command service shared helper | duplicate / conflict branch 可测 |
| IMPL-04-02 | 2 | 实现 `EstablishGlobalMember` 和 `UpdateGlobalLifecycleState` | Step 8/9 command 9.1-a、Step 10 10.1 | member/lifecycle command use cases | accepted/rejected/duplicate/conflict tests pass |
| IMPL-04-03 | 3 | 实现 `MaintainRoleCapabilitySummary`、`AppendCareerRecord`、`MaintainMemoryReference` | Step 8/9 command 9.1-b、Step 10 10.2 | role/career/memory command use cases | body-free and no external truth tests pass |
| IMPL-04-04 | 4 | 实现 `PrepareTraceHandoff` and command side-effect closure | Step 8/9 command 9.1-c、handoff state | trace handoff command use case | pending intent and no-delivery tests pass |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | command service shared skeleton | Step 9 shared command discipline | command service shell / result assembly | 100~300 行 | service compile | commit-04-a |
| BATCH-04-02 | member/lifecycle command vertical slice | Step 9 9.1-a | member/lifecycle service + tests | 300~500 行 | service-flow-fast command subset | commit-04-a |
| BATCH-04-03 | role capability command vertical slice | Step 9 9.1-b | role service + tests | 300~500 行 | service-flow-fast command subset | commit-04-b |
| BATCH-04-04 | career command vertical slice | Step 9 9.1-b | career service + tests | 300~500 行 | service-flow-fast command subset | commit-04-b |
| BATCH-04-05 | memory reference command vertical slice | Step 9 9.1-b | memory service + tests | 300~500 行 | service-flow-fast command subset | commit-04-b |
| BATCH-04-06 | trace handoff command vertical slice | Step 9 9.1-c | handoff command service + tests | 300~500 行 | handoff pending subset | commit-04-c |
| BATCH-04-07 | command cross-side-effect and replay audit tests | Step 9 §21、Step 13 | accepted effect / stored replay tests | 100~300 行 | duplicate no-rerun subset | commit-04-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-04-a | member/lifecycle accepted/rejected/duplicate/conflict tests pass | shared command helper、member establish、lifecycle transition | role/career/memory/handoff commands,query,consumer | service-flow-fast command subset |
| commit-04-b | role/career/memory command tests and redaction scan pass | role/career/memory write flows,source/basis/reference body-free guards | trace handoff delivery,consumer/job publish | service-flow-fast command subset,redaction direction |
| commit-04-c | handoff pending command and command replay audit pass | `PrepareTraceHandoff`, side-effect inventory, stored replay closure | handoff delivery callback/job,API entry | command replay / handoff pending subset |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-04-a | command skeleton + member/lifecycle | lifecycle command needs shared command discipline and establishes first accepted truth vertical slice | BATCH-04-01~02 | command subset | role/career/memory |
| commit-04-b | role + career + memory commands | 三者共同验证 external source/ref body-free command pattern,但仍不涉及 consumer | BATCH-04-03~05 | command + redaction subset | consumer/callback |
| commit-04-c | trace handoff command + command effect audit | handoff prepare closes command family and verifies no delivery in command | BATCH-04-06~07 | replay/handoff subset | delivery job/callback |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-04-a | command DTO 构造、lifecycle state、high-risk basis validation、accepted truth cursor、side-effect inventory | Step 8 command;Step 9 9.1-a;Step 10 10.1;Step 11/13 | 通过 |
| commit-04-b | source/reference typed sidecar version、append-only career、memory relation state、forbidden body | Step 8/9 9.1-b;Step 10 10.2;Step 11 reference/career | 通过 |
| commit-04-c | non-empty trace refs、handoff pending state、handoff marker subject、no delivery、stored command replay | Step 8/9 9.1-c;Step 10 handoff;Step 13 | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-04-a | command / state / idempotency / outbox | DTO 构造;状态闭环;Accepted truth cursor;Accepted subject identity;Accepted side-effect inventory;Idempotency reserve context | query/artifact 不涉及 | Step 8/9/10/11/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-04-b | command / external source / body-free | Sidecar truth read;Reference typed sidecar version;validation truth;history/record id;forbidden body recovery | handoff delivery/job 不涉及 | Step 7/9/11/12/16 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-04-c | command / handoff marker | Handoff marker trace subject;public command intent;state closure;stored replay;phase boundary | callback/delivery 后续 | Step 7 marker mapper;Step 9 handoff;Step 10/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 偏大,但三条 command 共享 source/ref pattern | 是 | 是 | 保留,实现时按 BATCH 顺序停审 |
| commit-04-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-04-a | accepted flow 是否同 UoW 保存 truth/trace/audit/outbox/stale/effect/stored result | 通过 | 无 |
| commit-04-b | 是否拒绝保存 external body / sibling truth | 通过 | 无 |
| commit-04-c | handoff command 是否只创建 pending intent,不 delivery | 通过 | 无 |

### 7.9 PH-05 Query / Read Model / Visibility Slices

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 实现 query shared discipline、visibility resolution、stable projection lookup helpers | Step 7 read/projection ports、Step 9 query shared | query service foundation | query no-write spy 可测 |
| IMPL-05-02 | 2 | 实现 core truth 和 member summary query family | Step 9 9.2-a/b | anchor/lifecycle/role/career/memory/summary queries | visible/missing/not-visible/degraded tests pass |
| IMPL-05-03 | 3 | 实现 trace/audit query family | Step 9 9.2-b | trace/audit query service | redaction and per-item visibility tests pass |
| IMPL-05-04 | 4 | 实现 projection/reference/report/outbox/handoff operations read query family | Step 9 9.2-c | maintenance/propagation query service | no-write / stale/degraded tests pass |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | query service skeleton and visibility helper | Step 9 shared query discipline | query service foundation | 100~300 行 | query no-write foundation | commit-05-a |
| BATCH-05-02 | projection lookup / read surface fake parity | Step 7 projection/read ports;Step 11 lookup indexes | lookup helpers and fake tests | 300~500 行 | projection lookup subset | commit-05-a |
| BATCH-05-03 | core truth query family | Step 9 9.2-a | anchor/lifecycle/role/career/memory queries | 300~500 行 | service-flow-fast query subset | commit-05-b |
| BATCH-05-04 | member summary query | Step 9 9.2-b | `ReadMemberSummary` | 100~300 行 | summary query subset | commit-05-b |
| BATCH-05-05 | trace/audit query family | Step 9 9.2-b | trace/audit queries | 300~500 行 | trace/audit redaction subset | commit-05-b |
| BATCH-05-06 | projection/reference/report queries | Step 9 9.2-c | projection/reference/report queries | 300~500 行 | degraded/stale subset | commit-05-c |
| BATCH-05-07 | outbox/handoff queries and no-write audit | Step 9 9.2-c;Step 16 | outbox/handoff queries + write spy tests | 300~500 行 | no-write audit | commit-05-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-05-a | query foundation and stable lookup tests pass | visibility resolution, projection lookup, query service skeleton, fake no-write spies | actual 14 query full implementation,consumer/job | query no-write foundation |
| commit-05-b | core/member/trace/audit query tests pass | core truth queries, member summary, trace/audit read;`TC-ID-QUERY-001~008`;`TC-ID-QUERY-015` | maintenance/outbox/handoff operations reads;`TC-ID-QUERY-009~014` | service-flow-fast query subset |
| commit-05-c | operations read queries and write-audit pass | projection/reference/report/outbox/handoff queries, degraded/stale/missing priority;`TC-ID-QUERY-009~014`;`TC-ID-QUERY-015` | rebuild/refresh/reconciliation/publish/deliver jobs | query no-write + degraded/stale subset |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-05-a | visibility + stable lookup + no-write spy | 所有 query 依赖该 read foundation,必须先于具体 query | BATCH-05-01~02 | query foundation | query family body |
| commit-05-b | core/member/trace/audit reads | 共同验证 identity truth/read history 的 visibility-first 读取 | BATCH-05-03~05 | query subset | operations read |
| commit-05-c | operations read queries | 共同验证 maintenance/propagation read-only surface,为 PH-07 jobs 之前提供状态可见性 | BATCH-05-06~07 | no-write audit | job mutation |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-05-a | Query visibility resolution、Projection-backed query lookup、Query response 闭环、query no-write | Step 7 read/projection;Step 8 query surface;Step 9 shared query | 通过 |
| commit-05-b | read subject/scope、per-item visibility、trace/audit subject、redaction | Step 7 visibility/history;Step 9 9.2-a/b;Step 12 query mapping | 通过 |
| commit-05-c | report/outbox/handoff read surface、missing/degraded/stale priority、no rebuild/refresh/publish/deliver | Step 9 9.2-c;Step 10/12 | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-05-a | query / visibility / projection | Query response;Query visibility resolution;Projection-backed query lookup;public read-model identity;phase boundary | command accepted side effects 已在 PH-04 | Step 7/8/9/11/12 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-05-b | core read / trace / audit | read subject/scope;Accepted subject identity;redaction;history read surface;no-write | operations job 不涉及 | Step 7 trace/read;Step 9 query;Step 16 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-05-c | maintenance/propagation read | report/outbox/handoff read surface;query status marker;adapter failure surface only as read marker;no repair | actual adapter calls 后续 PH-07 | Step 9 9.2-c;Step 10/12 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 偏大,但是同一 read family | 是 | 是 | 保留,实现时按 query group 分批 |
| commit-05-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-05-a | 是否没有 query miss rebuild / refresh | 通过 | 无 |
| commit-05-b | 是否 not visible 不泄漏 existence | 通过 | 无 |
| commit-05-c | 是否 operations read 不 publish / deliver / retry | 通过 | 无 |

### 7.10 PH-06 Inbound / Callback / Outbound Material Slices

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 实现 consumer/callback shared envelope、operation context、typed receipt assembly 和 stored receipt replay | Step 8 inbound shell、Step 9 consumer discipline、Step 13 | consumer service foundation | duplicate receipt replay tests pass |
| IMPL-06-02 | 2 | 实现 role/work/memory source consumer flows | Step 9 9.3 | source changed and work accepted flows | accepted/delayed/quarantined tests pass |
| IMPL-06-03 | 3 | 实现 archive/trace handoff callback flows | Step 9 9.3 | callback services | callback receipt kind and delivered guard tests pass |
| IMPL-06-04 | 4 | 实现 10 outbound accepted material factory and outbox payload marker snapshot | Step 9 9.4、Step 8 outbound events | accepted-only outbox material | outbound body-free tests pass |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | consumer/callback shared service skeleton | Step 9 shared consumer discipline | consumer service foundation | 100~300 行 | consumer scaffold subset | commit-06-a |
| BATCH-06-02 | typed receipt store/replay and fake parity | Step 11/13 receipt replay | receipt assembly + fake tests | 300~500 行 | entry-worker-job scaffold | commit-06-a |
| BATCH-06-03 | role source and work accepted consumers | Step 9 9.3 | role/work consumer flows | 300~500 行 | entry-worker-job subset | commit-06-b |
| BATCH-06-04 | memory source consumer | Step 9 9.3 | memory consumer flow | 300~500 行 | entry-worker-job subset | commit-06-b |
| BATCH-06-05 | archive and trace handoff callbacks | Step 9 9.3 | callback flows | 300~500 行 | callback subset | commit-06-b |
| BATCH-06-06 | accepted outbound material factories | Step 9 9.4 | payload marker factories | 300~500 行 | outbox material subset | commit-06-c |
| BATCH-06-07 | outbox snapshot and accepted-only audit | Step 11 outbox;Step 16 outbound cuts | outbox payload marker tests | 100~300 行 | operations-replay-core material subset | commit-06-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-06-a | consumer shared receipt and duplicate replay tests pass | envelope/context, typed receipt, stored replay foundation | actual consumer/callback mutation, outbound material factories | entry-worker-job scaffold subset |
| commit-06-b | 5 consumer/callback flow tests pass | role/work/memory/archive/trace consumer/callback flows | outbox publisher job, API/worker entry loop | entry-worker-job consumer/callback subset |
| commit-06-c | accepted outbound material snapshot and body-free tests pass | 10 outbound material factories, payload marker, outbox record snapshot | actual publish/deliver/retry jobs | operations-replay-core material subset |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-06-a | consumer context + receipt replay | 5 个 consumer/callback 都依赖 typed receipt replay,必须先于具体 mutation | BATCH-06-01~02 | consumer scaffold | specific payload mutation |
| commit-06-b | inbound/callback mutation flows | 共同验证 external event no implicit create,且都使用 typed receipt | BATCH-06-03~05 | consumer/callback subset | outbound factory |
| commit-06-c | outbound accepted material | accepted material 依赖 command/consumer/callback accepted facts,但 publish 执行后移 PH-07 | BATCH-06-06~07 | outbox material subset | publisher |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-06-a | stored receipt typed save/get、entry context factory、idempotency context/channel、receipt envelope schema | Step 7 result ports;Step 8 inbound shell;Step 13 | 通过 |
| commit-06-b | reference marker cursor、marker trace subject、sidecar version、missing target no-create、callback receipt kind | Step 7 marker/reference;Step 9 9.3;Step 11/12 | 通过 |
| commit-06-c | accepted side-effect inventory、outbound payload marker、accepted subject identity、body-free payload | Step 8 outbound;Step 9 9.4;Step 11 outbox | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-06-a | consumer replay | stored receipt typed save/get;Idempotency reserve context;entry context factory;phase boundary | actual worker entry 后续 PH-08 | Step 7/8/11/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-06-b | consumer/callback mutation | Reference-only stale cursor;Reference marker trace subject;Body-free snapshot typed read;Reference typed sidecar version;missing target no-create | publisher job 后续 | Step 7/9/10/11/12 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-06-c | outbox material | Accepted side-effect inventory;Accepted subject identity;outbox payload schema;body-free redaction;public target closure | actual publish outcome 后续 | Step 8 outbound;Step 9 9.4;Step 11 outbox | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-06-a | 适中 | 是 | 是 | 保留 |
| commit-06-b | 偏大,但 5 flow 同属 consumer/callback family | 是 | 是 | 保留,实现时按 flow BATCH 停审 |
| commit-06-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-06-a | duplicate receipt replay 是否 typed,不重跑 payload | 通过 | 无 |
| commit-06-b | consumer/callback missing target 是否不隐式创建 truth | 通过 | 无 |
| commit-06-c | outbound material 是否只来自 accepted facts | 通过 | 无 |

### 7.11 PH-07 Operations Job / Propagation / Maintenance Slices

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 实现 job request/report shared surface、job report assembly、stored job replay | Step 8 job shell、Step 9 job discipline、Step 13 | job service foundation | duplicate job report replay tests pass |
| IMPL-07-02 | 2 | 实现 projection rebuild、reference refresh、reconciliation jobs | Step 9 9.5 maintenance | maintenance job services | partial/failed/no-repair tests pass |
| IMPL-07-03 | 3 | 实现 outbox publish、trace handoff deliver、propagation retry jobs | Step 9 9.5 propagation | propagation job services | published/delivered/retryable/terminal tests pass |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | job shared skeleton and report assembly | Step 8 job report;Step 9 shared job | job service foundation | 100~300 行 | job replay scaffold | commit-07-a |
| BATCH-07-02 | stored job report save/get and fake parity | Step 11/13 job replay | job report repository fake + tests | 300~500 行 | operations replay scaffold | commit-07-a |
| BATCH-07-03 | rebuild projection job | Step 9 `RebuildIdentityProjectionFlow` | rebuild service + tests | 300~500 行 | maintenance subset | commit-07-b |
| BATCH-07-04 | refresh reference job | Step 9 `RefreshExternalReferenceStateFlow` | refresh service + tests | 300~500 行 | reference subset | commit-07-b |
| BATCH-07-05 | reconciliation job | Step 9 `RunIdentityReconciliationFlow` | reconciliation service + tests | 300~500 行 | report-only subset | commit-07-b |
| BATCH-07-06 | publish outbox job | Step 9 `PublishIdentityOutboxFlow` | publish service + tests | 300~500 行 | propagation subset | commit-07-c |
| BATCH-07-07 | deliver trace handoff job | Step 9 `DeliverTraceHandoffFlow` | delivery service + tests | 300~500 行 | handoff subset | commit-07-c |
| BATCH-07-08 | retry propagation failures job | Step 9 `RetryIdentityPropagationFailuresFlow` | retry service + tests | 300~500 行 | retry subset | commit-07-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-07-a | job report/stored replay tests pass | job shared service, report assembly, stored job report replay | actual maintenance/propagation job bodies, job CLI runner | operations replay scaffold |
| commit-07-b | rebuild/refresh/reconciliation tests pass | maintenance job family and no truth repair tests | publish/deliver/retry jobs, entry runner | operations-replay-core maintenance subset |
| commit-07-c | publish/deliver/retry tests pass | propagation job family, outcome mapping, terminal/retry guards | job binary argument schema, release scripts | operations-replay-core propagation subset |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-07-a | job report + stored replay foundation | six jobs all require replayable report before any job body | BATCH-07-01~02 | job scaffold | job bodies |
| commit-07-b | maintenance job family | rebuild/refresh/reconciliation share no-repair/report-only maintenance surface | BATCH-07-03~05 | maintenance subset | publish/deliver |
| commit-07-c | propagation job family | publish/deliver/retry share adapter outcome and retryable/terminal marker semantics | BATCH-07-06~08 | propagation subset | CLI / entry scripts |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-07-a | public job surface、stored job report typed save/get、job idempotency key/digest、report item refs | Step 8 job;Step 11/13 | 通过 |
| commit-07-b | projection rebuild source cursor、reference bundle version、report-only reconciliation、job no-repair | Step 7/9/10/11/12 | 通过 |
| commit-07-c | publisher/handoff outcome classification、outbox/handoff state transition、terminal retry guard、adapter body-free | Step 7 publisher/handoff;Step 9/10/12/13 | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-07-a | job replay | public job surface;stored receipt/report typed save/get;idempotency reserve context;entry loop detail surface | CLI runner 后续 PH-08 | Step 8 job;Step 11/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-07-b | projection/reference/report maintenance | projection rebuild;Reference typed sidecar version;job policy executable summary;job no-repair;machine artifact 不适用 | publish/deliver 后续 | Step 7/9/10/11/12 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-07-c | outbox/handoff propagation | adapter failure outcome classification;handoff marker trace subject;terminal state closure;body-free recovery;Accepted truth isolation | entry/config/evidence 后续 | Step 7 publisher/handoff;Step 9/10/12/13 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-07-a | 适中 | 是 | 是 | 保留 |
| commit-07-b | 偏大,但同属 maintenance no-repair family | 是 | 是 | 保留,实现时按 job 拆 BATCH |
| commit-07-c | 偏大,但同属 propagation outcome family | 是 | 是 | 保留,实现时按 job 拆 BATCH |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-07-a | duplicate job 是否只 replay stored report | 通过 | 无 |
| commit-07-b | maintenance job 是否不修 core identity truth | 通过 | 无 |
| commit-07-c | publish/deliver failure 是否不回滚 accepted truth | 通过 | 无 |

### 7.12 PH-08 Entry / Config / Scripts / Evidence Release Closure

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | 实现 API command/query entry、worker consumer/callback entry、jobs entry facade wiring | Step 7 entry restrictions、Step 10 entry states、Step 12 entry mapping | api/worker/jobs entry wiring | entry pre-dispatch no-store tests pass |
| IMPL-08-02 | 2 | 实现 runtime builder、config profile、adapter availability and redline validation | `04` config design、Step 14/15 handoff | infra config/runtime wiring | config-redline direction pass |
| IMPL-08-03 | 3 | 实现 gate/report/check scripts and run-scoped artifact/report writer | `05` automation/evidence、`06` evidence entry | scripts/gates, scripts/reports, scripts/checks | report-generation-audit direction pass |
| IMPL-08-04 | 4 | 实现 release smoke, evidence index, acceptance handoff and final audit material | `05/06` evidence/acceptance | reports/runs, reports/acceptance, review docs | release-main-smoke and evidence audit direction pass |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁方向 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-08-01 | API entry mapping | Step 7 API entry;Step 12 entry mapping | api handlers/binary | 300~500 行 | entry-worker-job API subset | commit-08-a |
| BATCH-08-02 | worker/jobs entry mapping | Step 7 worker/jobs entry;Step 8 inbound/job request | worker/jobs runner shell | 300~500 行 | entry-worker-job worker/job subset | commit-08-a |
| BATCH-08-03 | runtime config builder and adapter availability | `04` config,Step 14/15 | infra config/runtime | 300~500 行 | config-redline + dependency scan | commit-08-a |
| BATCH-08-04 | gate runner scripts | `05` automation gates | scripts/gates | 100~300 行 | script dry run / report pairing direction | commit-08-b |
| BATCH-08-05 | report/check scripts | `05` evidence/report;`06` evidence entry | scripts/reports, scripts/checks | 300~500 行 | report-generation-audit direction | commit-08-b |
| BATCH-08-06 | run-scoped artifact/report writer | `05` raw artifact required fields | artifact/report writer helpers | 300~500 行 | raw artifact/report pairing direction | commit-08-b |
| BATCH-08-07 | release smoke orchestration | `05/06` release smoke | release gate wiring | 100~300 行 | release-main-smoke direction | commit-08-c |
| BATCH-08-08 | evidence index and EV detail generation | `05` evidence index、`06` evidence entry | evidence-index and evidence pages | 300~500 行 | evidence audit direction | commit-08-c |
| BATCH-08-09 | acceptance handoff / veto checklist / final review | `06` acceptance | reports/acceptance and review handoff | 100~300 行 | acceptance audit direction | commit-08-c |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁方向 |
|---|---|---|---|---|
| commit-08-a | entry/config/dependency tests pass | API/worker/jobs entry facade wiring, runtime builder, config redline, dependency boundary check | report/evidence scripts, release acceptance conclusion | entry-worker-job + config-redline + dependency-boundary direction |
| commit-08-b | scripts and run-scoped artifact/report pairing tests pass | gate/report/check scripts, artifact/report writer, report audit tooling | final release run conclusion, acceptance handoff signoff | report-generation-audit direction |
| commit-08-c | release smoke and final evidence audit pass | release smoke, evidence index, acceptance handoff, veto checklist, final review material | production capacity, real product selected-run as P0, runbook | release-main-smoke + all P0 evidence direction |

#### Commit boundary 子功能分组

| Commit boundary | 子功能分组 | 必须同提交的原因 | 涉及批次 | 验证门禁方向 | 不包含 |
|---|---|---|---|---|---|
| commit-08-a | entry + runtime config | entry dispatch cannot be validated without runtime/config dispatchability guards | BATCH-08-01~03 | entry/config/dependency | report scripts |
| commit-08-b | scripts + artifact/report writer | evidence generation requires gate/report/check scripts and run-scoped writer together | BATCH-08-04~06 | report audit | final acceptance |
| commit-08-c | release + evidence + acceptance handoff | final acceptance depends on actual run evidence,not static declarations | BATCH-08-07~09 | release/evidence/acceptance | P1/P2 production claims |

#### 开工前设计闭环复核

| Commit boundary | 重点复核项 | 证据位置 | 结论 |
|---|---|---|---|
| commit-08-a | entry context factory、entry no repository、config binding、runtime unavailable mapping、dependency boundary | Step 7 entry;Step 10/12 entry;`04` config;`06` dependency boundary | 通过 |
| commit-08-b | machine artifact JSON required fields、artifact/report root、digest/redaction owner、script capability vs final evidence | `05` §13、`06` §3 | 通过 |
| commit-08-c | evidence index, report audit, no static evidence, AC/VETO handoff, no P1/P2 pollution | `05` evidence;`06` acceptance/veto | 通过 |

#### Commit boundary 经验复核

| Commit boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论 | 处理 | 复核责任 |
|---|---|---|---|---|---|---|---|
| commit-08-a | entry / config / runtime | entry context factory;Entry loop result detail;config binding;adapter availability;phase boundary | machine artifact 后续 | Step 7 entry;Step 10/12;`04` config | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-08-b | scripts / artifacts / reports | machine artifact JSON schema;artifact materialization;path baseline;body-free redaction | final acceptance conclusion 后续 | `05` §13;`06` §3 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |
| commit-08-c | release / evidence / acceptance | evidence no static pass;machine artifact schema;phase boundary;blocker experience writeback;P1/P2 no P0 pollution | business implementation 已前序完成 | `05` §13~14;`06` §3~§11 | 通过 | 允许开工 | 设计者完成;实现者二次校验 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-08-a | 适中 | 是 | 是 | 保留 |
| commit-08-b | 适中 | 是 | 是 | 保留 |
| commit-08-c | 适中 | 是 | 是 | 保留 |

#### Commit boundary 停审记录

| Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| commit-08-a | entry 是否只走 application facade,不直连 repository/adapter | 通过 | 无 |
| commit-08-b | report/artifact 是否 run-scoped,不使用 latest 或静态 pass | 通过 | 无 |
| commit-08-c | final evidence 是否来自实际 suite artifact/report pairing | 通过 | 无 |

### 7.13 跨 boundary 依赖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| commit boundary 是否覆盖 PH-01~PH-08 | 通过 | 22 个 commit boundary 覆盖所有 phase |
| 是否存在后续 surface 被前置借用 | 通过 | entry/job/evidence 均后置;query 不依赖 rebuild job;publisher 后置 PH-07 |
| contracts/domain/application/infra dependency direction | 通过 | PH-01~PH-03 先固定 crate 和 port/fake |
| command accepted side effects | 通过 | PH-04 才落 command service;PH-03 先落 UoW/stored replay |
| query no-write | 通过 | PH-05 单独落 visibility/read model/no-write audit |
| consumer missing no-create | 通过 | PH-06 在 typed receipt/replay 后落 |
| outbound accepted-only | 通过 | PH-06 只落 material;PH-07 才 publish |
| job no truth repair | 通过 | PH-07 单独落 maintenance/propagation job |
| entry no direct repo | 通过 | PH-08-a 只在 application facade 完成后落 |
| report/evidence integrity | 通过 | PH-08-b/c 分开脚本能力与 final evidence |
| P1/P2 误入 P0 | 通过 | PH-08-c 明确不把 production-like selected-run 作为 P0 |
| 是否有必须回写设计的 blocker | 通过 | 当前未发现;实现前仍需每 boundary 二次复核 |

### 7.14 跨 boundary 粒度审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否有一笔提交覆盖全部 command/query/job | 通过 | command、query、job 均按 family 拆分 |
| 是否有过细提交无法独立验证 | 通过 | 每个 commit 至少含一个可验证能力 |
| 是否有 BATCH 超过风险阈值未拆 | 通过 | 大面均标为按文件 / flow BATCH 拆 |
| 是否有测试/证据只在最后才出现 | 通过 | 每个 commit 有门禁方向,Step 7 再正式绑定 |
| 是否有无关修改混入风险 | 已控制 | Explicit exclusions 和 Step 11 工作区纪律继续收口 |

### 7.15 Boundary 开工阅读矩阵

| Boundary 范围 | 必读正式 / 校准文件 |
|---|---|
| PH-01 | Step 4 file layout、Step 5 module contracts、Step 3 prerequisites |
| PH-02 | Step 6 object contracts、Step 8 protocol contracts、Step 10 state matrix、Step 16 contract/domain cuts |
| PH-03 | Step 7 port contracts、Step 11 persistence、Step 13 idempotency、Step 16 infra/runtime cuts |
| PH-04 | Step 8 command protocols、Step 9 command flows、Step 10 state matrix、Step 11/12/13、Step 16 command cuts |
| PH-05 | Step 8 query protocols、Step 9 query flows、Step 7 read/projection/reference/report ports、Step 12 query mapping、Step 16 query cuts |
| PH-06 | Step 8 inbound/outbound protocols、Step 9 consumer/outbound flows、Step 11 receipt/outbox persistence、Step 13 replay、Step 16 consumer/outbox cuts |
| PH-07 | Step 8 job protocols、Step 9 job flows、Step 10 maintenance/propagation states、Step 11/12/13、Step 16 job cuts |
| PH-08 | Step 7 entry restrictions、Step 10 runtime/entry states、Step 12 entry mapping、`04` config、`05` automation/evidence、`06` acceptance |

### 7.16 Step 6 停审总表

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否先思考模块再写入模块 | 通过 | §4 已列 M1~M9,并记录模块思考与停审 |
| 是否按 phase 拆 commit boundary | 通过 | §7.5~§7.12 按 PH-01~PH-08 展开 |
| 是否每个 phase 有任务表 / BATCH / commit boundary | 通过 | 每个 PH 均已列出 |
| 是否每个 commit boundary 有设计闭环复核 | 通过 | 每个 PH 均有开工前复核表 |
| 是否每个 commit boundary 有经验复核 | 通过 | 每个 PH 均按标准 §九选择适用项 |
| 是否提前定义正式 GATE 编号 | 未提前 | 只写门禁方向,Step 7 绑定正式测试/验收门禁 |
| 是否新增 schema、port、state、test ID 或 evidence ID | 未新增 | 仅引用 `03/05/06` 已有 surface |
| 是否发现 blocker | 未发现 | 当前可进入 Step 7 |

## 8. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施阶段 | PH-01~PH-08,未拆 commit | 22 个 commit boundary 和对应 BATCH | 实现需要 review / rollback 单元 |
| 代码写入顺序 | 只有 phase 顺序 | 每个 phase 内有 IMPL 顺序和 BATCH 顺序 | 防止 service 先于 contract/port/fake |
| 提交前门禁 | 只有 suite direction | 每个 commit 有预提交门禁方向 | Step 7 可继续绑定正式门禁 |
| 经验复核 | 只在工作台要求 | 每个 boundary 有项目级经验复核表 | 防止把 design blocker 留给实现 agent |
| evidence 收口 | PH-08 单阶段 | commit-08-b 和 commit-08-c 区分脚本能力和 final handoff | 防止静态 pass 或无 raw artifact 的验收 |

## 9. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| command 边界 | A. 6 条 command 一笔;B. 按 member/lifecycle、role/career/memory、handoff 拆 | 采用 B,既保留纵切,又避免过大 |
| query 边界 | A. 14 条 query 一笔;B. 先 visibility/lookup,再 core/history,再 operations read | 采用 B,先证明 no-write 基座 |
| consumer/outbound 边界 | A. consumer 与 outbox publish 同提交;B. consumer/outbound material 在 PH-06,publish 在 PH-07 | 采用 B,publish 是 job/adapter outcome,不能提前混入 |
| job 边界 | A. 先写 runner;B. 先 job report/replay and application job service | 采用 B,runner 不得直连 repo |
| evidence 边界 | A. 最后一笔写所有 scripts/evidence;B. scripts/report writer 与 final acceptance 分开 | 采用 B,符合分阶段报告证据成熟度 |
| Step 6 是否定义 GATE 编号 | A. 直接定义;B. 只写门禁方向,Step 7 正式绑定 | 采用 B,避免绕过测试方案 / 验收标准映射 |

## 10. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 boundary 未新增设计契约 | 否 | 承接 `03/05/06` | 无需回写 |
| Step 7 需要按 commit boundary 绑定 TC/EV/AC/VETO | 是 | 下游测试与验收门禁嵌入 | Step 7 输入 |
| Step 8 需要按 PH-08-a/b/c 细化 config/profile/artifact roots | 是 | 配置环境准备 | Step 8 输入 |
| Step 9 需要记录 residual / spike / blocker 分类 | 是 | 风险收敛 | Step 9 输入 |
| Step 10/11 需要引用本 boundary 暂停、回退、提交纪律 | 是 | 变更控制 / 提交评审 | Step 10/11 输入 |
| 正式 `07` §6 待回填 | 是 | Step 13 正式装配 | 本 Step 提供回填草稿 |

## 11. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“全局 commit boundary 清单”“通用开工前设计闭环复核表”“PH-xx 阶段任务表 / 代码实现批次 / 提交边界”“Commit boundary 经验复核”和“跨 boundary 审计表”小节,了解实施提交边界如何从详细设计和测试验收输入收敛。

正式 `07-实施计划.md` §6 应回填:

- 本轮实施以 PH-01~PH-08 为 phase,以 commit-01-a 到 commit-08-c 为实现提交边界。
- 每个 commit boundary 都必须列出 included / excluded、BATCH、提交时机、预提交门禁方向、设计闭环复核、经验复核和停审结论。
- PH-01 建立 workspace skeleton。
- PH-02 拆为 contracts shell、core domain truth、support state helpers。
- PH-03 拆为 application helpers/mappers、ports/fake skeleton、idempotency/stored replay。
- PH-04 拆为 member/lifecycle commands、role/career/memory commands、trace handoff command。
- PH-05 拆为 query foundation、core/member/trace/audit queries、operations read queries。
- PH-06 拆为 consumer receipt foundation、consumer/callback flows、outbound accepted material。
- PH-07 拆为 job report/replay foundation、maintenance jobs、propagation jobs。
- PH-08 拆为 entry/config、scripts/artifact/report writer、release/evidence/acceptance handoff。
- 每个 boundary 开工前必须按 `设计真相源闭环与可落码性标准.md` §九选择适用经验项,结论只能是通过 / 不适用 / blocker。
- blocker 必须先回写设计真相源并固定 baseline,不得要求实现者自行补 schema、port、状态、mapper、stored surface 或 evidence 规则。

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓旧单 crate 到 workspace 的实际迁移是否需要额外技术准备提交 | 影响 commit-01-a 规模 | 当前 commit-01-a 覆盖 skeleton;若迁移成本超出 skeleton,Step 9 记录 spike |
| PH-04-b 三条 command 是否实现时仍过大 | 影响提交粒度 | 当前 BATCH 已按 role/career/memory 拆;实现时单 BATCH 超阈值继续拆 |
| PH-06-b 五条 consumer/callback 是否实现时仍过大 | 影响提交粒度 | 当前 BATCH 已按 flow 拆;实现时可在不改变 commit boundary 的前提下小批提交前停审 |
| PH-07-b/c job family 是否应按 job 单独 commit | 影响 review 粒度 | 当前按 maintenance / propagation family;若实现发现超过 review 阈值,Step 10/11 允许 boundary 重审 |
| artifact/report writer 是否已有足够机器 schema | 影响 commit-08-b | 当前仅按 `05` raw artifact 必填字段和 evidence index item 实施;若实现发现字段/enum/digest算法不闭合,按 blocker 暂停 |

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 6 必读输入已阅读 | 通过 | 已复核 SOP、书写规范、可落码标准、Step 5、`03` Step 6~13/16/17、`05/06` |
| 模块计划 / 模块目录已写 | 通过 | 见 §4 |
| 每个 phase 有任务表 | 通过 | 见 §7.5~§7.12 |
| 每个 phase 有代码实现批次 | 通过 | 见各 PH “代码实现批次” |
| 每个 phase 有 commit boundary | 通过 | 见各 PH “提交边界” |
| 每个 commit boundary 有子功能分组 | 通过 | 见各 PH “Commit boundary 子功能分组” |
| 每个 commit boundary 有开工前设计闭环复核 | 通过 | 见各 PH “开工前设计闭环复核” |
| 每个 commit boundary 有经验复核 | 通过 | 见各 PH “Commit boundary 经验复核” |
| 跨 boundary 粒度 / 依赖 / 门禁审计已完成 | 通过 | 见 §7.13~§7.14 |
| 未修改正式 `07-实施计划.md` | 通过 | Step 13 前不修改正式文档 |
| 可进入 Step 7 | 通过 | 下一步:嵌入测试与验收门禁 |
