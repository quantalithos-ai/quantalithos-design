# Step 3. 抽取测试对象与测试切口

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/测试方案书写规范.md` §5.3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_4
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 从已确认Step 2范围和正式`02~04`中抽取测试对象,形成`CUT-SBX-001~038`测试切口、逐协议盘点、P0切口停审和跨切口审计。`CUT-SBX-*`是设计期切口ID,不是TC、suite、EV、run或测试结果。本步不修改旧正式`05`,不创建测试代码、脚本、环境、evidence或实现事实。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 2并允许进入Step 3 | 是。用户审查Step 2后回复“同意”,本次只放行Step 3。 |
| 项目级台账与flow是否允许进入Step 3 | 是。原恢复点为Step 2 `pass_wait_review`;用户确认后解除门禁。 |
| 是否读取Step 3标准 | 是。已读取测试SOP Step 3与书写规范§5.3,必须输出对象 /切口总表、P0逐切口停审和跨切口设计来源审计。 |
| 是否读取已确认范围 | 是。Step 1 / 2固定权威输入、P0-C / P0-Q、P1 / P2、非范围和veto边界。 |
| 是否读取直接设计输入 | 是。已读取正式`02~04`、`03_ddd_step_06~16`相关产物以及`04` TSH / FDT承接。 |
| 是否参考L1粒度 | 是。已读取L1-governance / L1-artifact Step 3,只参考结构和停审深度。 |
| 当前状态 | 38个测试切口、55个协议去向、8个状态批次、38个错误与配置 /安全对象入口已收稳;用户已确认并传递至Step 4。 |
| 是否发现阻塞Step 3的上游设计blocker | 否。对象、字段、协议、状态、错误和配置均有正式来源。P0-Q产品 /环境缺失只阻塞执行,不阻塞切口设计。 |
| 停审方式 | Step 3停审已由用户确认解除;当前审查门禁位于Step 4。 |

---

## 2. 本步目标与非范围

本Step必须完成:

1. 把七模块、对象 / value carrier、service、repository / UoW、port / adapter、entry helper转成可验证对象。
2. 为10 Command、13 Query、9 Consumer、13 Outbound Event和10 Job逐项分配切口,不允许协议抽样。
3. 把概要6组状态主题按正式`03`展开为8个状态批次、30个 owner-level state machines和31个 Step 10 canonical status enum entries测试入口。
4. 单列事务、rollback visibility、version / cursor、幂等 / replay、并发、错误 /恢复、配置、观测和依赖边界切口。
5. 为P0-C与P0-Q每个切口记录真相源、风险、推荐层级和后续用例要求,逐项停审。
6. 审计SCP-SBX-001~036、VF-SBX-001~010、VETO-CFG-01~16、TSH-01~20和FDT-01~30是否有切口去向。

本Step不定义:

- 测试金字塔、每种风险最终落在哪一层;Step 4再正式确定,本步层级仅作推荐。
- 需求 /设计 /切口 /case /evidence覆盖矩阵;留给Step 5。
- TC编号、前置、输入、步骤、期望、断言和自动化标记;留给Step 6。
- fixture、seed、property generator、测试数据和清理策略;留给Step 7。
- backend产品、环境拓扑、profile实例、suite、CI gate、脚本或报告路径;留给Step 8 / 9。
- 真实P0-Q / P1执行、run_id、EV alias、测试结果、资格签署或验收裁决。
- 正式`05-测试方案.md`;只允许Step 15装配。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | reviewed | 固定权威顺序、historical隔离和测试不补设计原则 |
| `05_test_plan_step_02_scope.md` | reviewed_passed_to_step_3 | 固定TG-SBX-01~11、SCP-SBX-001~036、P0-C / P0-Q、P1 / P2、非范围和veto |
| `02-概要设计.md` §5~§10 | current formal baseline | 提供六个组成部分、关键对象、6类接口骨架、flow与6组状态主题 |
| `03-详细设计.md` §5 / §6 | direct formal input | 提供七模块、对象、service、repository、port、adapter和entry helper索引 |
| `03-详细设计.md` §7 / §8 | direct formal input | 提供55个协议、DTO、字段构造闭环和逐接口flow |
| `03-详细设计.md` §9~§12 | direct formal input | 提供8个状态批次 /30个 owner-level state machines、UoW、repository、错误和恢复 |
| `03-详细设计.md` §13~§15 | direct formal input | 提供并发 /幂等、配置binding、观测 /审计和最小测试入口 |
| `03_ddd_step_16_test_cuts.md` | current explanatory input | 提供逐协议、状态、一致性、配置和观测最小切口;冲突时以正式`03`为准 |
| `04-配置设计.md` §6 / §8~§14 | direct formal input | 提供PROFILE、source / schema / item、sensitive、generation、change / failure和veto对象 |
| `04_config_step_12_downstream_handoff.md` | current explanatory input | 提供TSH-01~20、FDT-01~30及planned成熟度 |
| L1-governance / L1-artifact Step 3 | granularity reference | 参考对象盘点、逐协议覆盖、停审和跨切口审计结构 |

---

## 4. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复Step 2、flow和项目台账 | done | 用户确认只放行Step 3 |
| 2 | 读取SOP Step 3、书写规范§5.3和L1参考 | done | 固定对象、切口、逐切口停审与总审计要求 |
| 3 | 机械清点对象 /协议 /状态 /错误 | done | 55协议、8状态批次、30 owner-level state machines、31 Step 10 canonical status enum entries、38命名错误 |
| 4 | 从Step 2范围构造`CUT-SBX-001~038` | done | P0-C 33个、P0-Q 3个、P1 1个、P2 1个 |
| 5 | 逐项映射55个协议与横切对象 | done | 无协议抽样或孤儿public surface |
| 6 | 完成P0逐切口停审与跨切口审计 | done | 无unresolved设计来源冲突 |
| 7 | 完成影响判定、回填草稿和门禁 | done | 无当前上游回写;P0-Q执行blocker保留 |
| 8 | 更新Step 2、flow和项目台账 | done | 三方状态已同步到Step 3审查点;Step 4仍被用户审查门禁阻塞 |

---

## 5. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 哪些domain object / value object / policy必须单测 | context / identity / resolution、boundary requirement / decision / coherent boundary、capability / handle / lease、policy snapshot / decision / high-risk、run / capture / handoff、failure / control / cleanup / redline及其typed ref / reason / digest /状态均进入CUT-001~008与CUT-014~021。 |
| 哪些application service必须做service test | `SandboxCommandService`、`SandboxQueryService`、`SandboxConsumerService`、`SandboxJobService`的全部55个flow分别进入CUT-009~013;不得只测facade smoke。 |
| 哪些repository / adapter / worker必须做集成测试 | UoW、truth / audit / snapshot / reference / projection / derived / relay / idempotency / stored result repositories进入CUT-022~025;resolver、policy、backend、handoff、publisher、runtime builder和entry adapters进入CUT-031 / 033~037。 |
| 哪些协议必须做协议和流程测试 | 10 Command、13 Query、9 Consumer、13 Outbound Event、10 Job全部逐项盘点。Command至少accepted / reject / duplicate / conflict;Query至少read surface + no-write;Consumer至少accepted / duplicate / delayed / quarantine;Event至少stored payload + no-rollback;Job至少report / partial / replay / no-repair。 |
| 哪些状态 /一致性 /恢复行为必须单列 | 正式8个状态批次分别进入CUT-014~021;UoW / rollback、version / cursor、idempotency / replay、并发单赢家和38个错误 /恢复分别进入CUT-022~026。 |
| 哪些字段缺失、DTO构造失败或引用混同必须负向覆盖 | metadata / actor / idempotency / dedup / schema / required ref缺失,typed ref family错误,request digest混入raw body,expected version / page cursor / truth cursor混同,backend raw outcome、external body、full secret ref进入carrier均进入CUT-001/002/023/026/029/032。 |
| 哪些状态名为唯一来源 | 只使用正式`03` §9中的31个 Step 10 canonical status enum entries与其variant;不得把同名`Failed`跨owner合并,也不得用`Delivered`替代source accepted或用`Visible`替代truth success。 |
| 哪些P0设计契约仍无切口 | 未发现。七模块、对象索引、55协议、30 owner-level state machines、38错误、配置 /观测、P0-Q资格和全部Step 2 P0范围均有切口。字段级case数量留给Step 6,不是当前孤儿。 |
| 每个P0切口是否完成停审 | 是。CUT-SBX-001~036逐项通过来源、风险、层级建议和可落地性审查;见§9.5。 |

---

## 6. 当前文档问题诊断与取舍

| 议题 /问题 | 处理与取舍 | 原因 |
|---|---|---|
| 旧`05`按旧对象和TC-001~012组织 | 完全隔离,不继承对象、切口或编号 | 与当前55协议和truth对象不一致 |
| 是否直接复制`03` Step 16 | 转译成38个稳定切口、协议盘点和停审审计 | `05`需形成测试对象结构,不能重复详细设计摘要 |
| 是否每个协议创建一个横切切口 | 每个协议逐项盘点,但共享CUT-009~013编排规则并叠加对象 /状态切口 | 既防孤儿,又避免重复55套事务真相 |
| 概要6组状态与详细设计8批次 | 以正式`03`的8批次 /30 owner-level state machines /31 Step 10 enum entries为测试真相 | 概要是轮廓,详细设计已合法展开 |
| 是否把38个错误各建独立切口 | 统一由CUT-026闭集覆盖,具体case在Step 6逐错误展开 | 错误映射是同一横切契约,仍保留38项机械审计 |
| PROFILE-05在配置层P1但测试层P0-Q | CUT-034~036保持P0-Q且blocked until executable | 配置成熟度与核心隔离风险是不同分类轴 |
| P0-Q产品未选是否删除对象 | 保留product-neutral对象、前置和断言;不得降级为P1或N/A | VF-SBX-002/003不允许fake替代真实隔离 |
| P1 / P2是否混入P0停审 | CUT-037 / 038单独记录,不参与P0通过补偿 | 保持范围与成熟度诚实 |

---

## 7. 测试对象与主切口总表

| 测试对象 | 正式来源 | 主切口 | 主要风险 | 推荐层级 |
|---|---|---|---|---|
| public refs / IDs / reason / digest / metadata / DTO / error carrier | `03` §6.1 / §7.2 | CUT-001/002 | 缺字段、family混同、digest漂移、raw body进入carrier | contract unit |
| context / identity / resolution / reference state | `03` §6.1;Step 6 §11.4~11.6 | CUT-003/014 | 匿名受理、外部正文入仓、accepted终态重开 | domain unit + service |
| boundary requirement / decision / coherent boundary / capability / handle / lease / orphan | `03` §6.1;Step 6 §11.7~11.9/11.13 | CUT-004/015/034~036 | 四维拆分、weak fallback、handle / lease误绑定 | domain + backend conformance |
| policy snapshot / execution decision / high-risk decision | `03` §6.1;Step 6 §11.10 | CUT-005/016 | missing / stale / conflict被映射allow,policy truth回流 | domain + service |
| run / capture / handoff facts and material refs | `03` §6.1;Step 6 §11.11 | CUT-006/017/035 | runtime truth混入、body泄露、handoff失败回滚capture | domain + service / conformance |
| failure / control / cleanup / redline safety group | `03` §6.1;Step 6 §11.12~11.13 | CUT-007/018/035 |分类冲突、先删证据、advisory redline | domain + service / safety lab |
| projection / derived / reconciliation / relay / audit | `03` §6.1;Step 6 §11.14 | CUT-008/019/020/032 | read / maintenance反写真相、publish回滚、audit替代 | query / job / relay |
| service context / idempotency record / stored result / query access | `03` §6.1;Step 6 §12.4~12.6 | CUT-021~026 | duplicate重算、key / digest冲突、query写入 | service + repository fake |
| runtime config / adapter availability / adapter outcomes | `03` §6.1;Step 6 §13.4~13.5;`04` | CUT-021/027~031 | invalid / partial generation、outcome string推断、guard降级 | config + builder integration |
| consumer receipt / worker context / job accumulator / exit disposition | `03` §6.1;Step 6 §14.6~14.8 | CUT-011/013/021/031 | ack / report伪成功、batch污染、job repair truth | worker / job runner |
| service facades and 55 protocol flows | `03` §6.2~§8 | CUT-009~013 | public protocol孤儿、flow副作用顺序漂移 | service / handler / worker / job |
| UoW and logical repositories | `03` §6.2 / §10 | CUT-022~025 | partial visibility、version覆盖、cursor误用、replay失真 | repository fake + service |
| context / policy / capability resolver ports | `03` §6.2 / §13 | CUT-003~005/011/013/031 | guessed truth、unavailable被当allow | adapter contract |
| isolation / capture / release ports | `03` §6.2 / §13 | CUT-004/006/034~036 | raw outcome推断、host fallback、真实限制未落实 | fake + dedicated conformance |
| handoff / observability / investigation / publisher ports | `03` §6.2 / §13 | CUT-006~008/012/013/032/037 | target错配、no-rollback破坏、body泄露 | adapter integration |
| API / worker / jobs entry adapters | `03` §5.8 / §6.1;Step 7 §14 | CUT-031 | metadata绕过、entry直连repository、scope / batch越界 | handler / worker / runner |
| dependency graph and unsupported surface | `01` §8;`03` §5.2 / §13;`04` §14 | CUT-033/038 | sibling编译依赖、产品反写协议、future surface伪成功 | static contract / design gate |

---

## 8. 测试切口设计真相源表

| 切口ID /测试切口 | 设计真相源 | 覆盖对象 /字段 /状态 /协议 /错误 | 优先级 | 推荐层级与后续用例要求 |
|---|---|---|---|---|
| CUT-SBX-001 public carrier schema | `03` §6.1 / §7.2;Step 6 §10;Step 8 | typed ref / opaque ID / reason / digest、metadata、Command / Query / Event / Job / View / Receipt / Error DTO | P0-C | contract unit;每类public carrier至少roundtrip、missing required、invalid enum / ref family |
| CUT-SBX-002 metadata / digest / field distinction | `03` §7.2 / §7.7 / §12.4;Step 13 | protocol / actor / command / query metadata、schema version、trace、idempotency / dedup、request digest、page / truth cursor、expected version | P0-C | contract + entry;逐输入族验证canonical digest及禁止混同字段 |
| CUT-SBX-003 context / identity / reference invariants | `03` §6.1 / §9批次10.1;Step 6 §11.4~11.6 | context、environment identity、resolution、reference state;accepted / rejected / unresolved;`ReferenceUnresolved` / `NotAuthorized` | P0-C | domain + service;正向受理、缺失 /冲突、匿名 /正文负向与终态保护 |
| CUT-SBX-004 coherent boundary decision contract | `03` §6.1 / §9批次10.2;Step 6 §11.7~11.9 | requirement、decision、coherent boundary、capability、handle、lease;四维同代;boundary errors | P0-C | domain + fake backend;完整 / unsupported / stale / unavailable / weak fallback矩阵 |
| CUT-SBX-005 policy / high-risk fail-closed | `03` §6.1 / §9批次10.3;Step 6 §11.10 | applicability snapshot、policy decision、high-risk decision;missing / stale / conflict / blocked | P0-C | domain + service;不得读取policy body或由technical degraded放行 |
| CUT-SBX-006 run / capture / handoff truth separation | `03` §6.1 / §9批次10.4;Step 6 §11.11 | run、capture、material / observability refs、handoff;partial / failed / retryable;no rollback | P0-C | domain + service;body-free、capture先于handoff且delivery失败不改capture |
| CUT-SBX-007 failure / control / cleanup / redline guards | `03` §6.1 / §9批次10.5;Step 6 §11.12~11.13 | stable failure、control conflict、lease / orphan、cleanup guard、redline containment | P0-C | domain + service;unknown不成功、missing blocked、no force-clean / advisory redline |
| CUT-SBX-008 projection / derived / reconciliation / relay ownership | `03` §6.1 / §9批次10.6~10.7;§10 | projection、derived、report、relay、audit;stale / rebuild / dead-letter;no truth repair | P0-C | query + job + relay;read / maintenance不反写,relay失败不回滚source |
| CUT-SBX-009 Command protocol / flow inventory | `03` §7.3 / §8.2;Step 16 §10 | 10 Command、metadata、service flow、stored result、public error | P0-C | API + service;每个Command至少accepted / reject、duplicate / conflict及主要adapter / version失败 |
| CUT-SBX-010 Query protocol / no-write inventory | `03` §7.4 / §8.3;Step 16 §11 | 13 Query、view / page / access surface、missing / stale / degraded / restricted | P0-C | query handler;每个Query断言0 write UoW / audit / relay / refresh / mutating port |
| CUT-SBX-011 Consumer protocol / dedup inventory | `03` §7.5 / §8.4;Step 16 §12 | 9 Consumer、envelope、source authority、schema、dedup、receipt、quarantine | P0-C | worker + service;每个Consumer覆盖accepted / duplicate / delayed或quarantined及正文拒绝 |
| CUT-SBX-012 Outbound Event / relay inventory | `03` §7.6 / §8.4;Step 16 §13 | 13 Event、stored payload snapshot、event kind、relay transition、publisher outcome | P0-C | contract + relay worker;每个Event映射committed source且无raw body,publish失败no rollback |
| CUT-SBX-013 Operations Job / report inventory | `03` §7.6 / §8.4;Step 16 §14 | 10 Job、typed input、selection、per-item UoW、partial report、stored replay | P0-C | job runner;每个Job覆盖success / empty或invalid / partial failure / duplicate / no-repair |
| CUT-SBX-014 intake / identity / reference states | `03` §9批次10.1 | `ControlledExecutionIntakeStatus`;`ExecutionEnvironmentIdentityStatus`;`ReferenceResolutionStatus` | P0-C | domain;每个状态机至少主线合法、边界合法、终态 /正文非法转换 |
| CUT-SBX-015 boundary / capability / handle / lease states | `03` §9批次10.2 | 6 status enum;unsupported -> coherent、released -> active等非法转换 | P0-C | domain + fake backend;四维整体、lease / orphan / release guard |
| CUT-SBX-016 policy / high-risk states | `03` §9批次10.3 | 3 status enum;pending / fail-closed / blocked / accepted边界 | P0-C | domain;missing / stale / conflicted不得转allow |
| CUT-SBX-017 run / capture / handoff states | `03` §9批次10.4 | 3 status enum;run terminal、capture partial、handoff retry / terminal | P0-C | domain + service;failed run不可completed,handoff失败不回滚capture |
| CUT-SBX-018 failure / control / cleanup / redline states | `03` §9批次10.5 | 4 status enum;classification、conflict、guard、containment | P0-C | domain + service;cleanup / release / launch的安全非法迁移 |
| CUT-SBX-019 query / projection / derived / reconciliation states | `03` §9批次10.6 | 4 status enum;visibility、freshness、rebuild、report terminal | P0-C | query + job;同名Failed不得跨owner,query repair非法 |
| CUT-SBX-020 relay states | `03` §9批次10.7 | `SandboxEventRelayStatus`;pending / retryable / published / failed / dead-letter | P0-C | relay worker;frozen bundle + exact attempt;terminal record不复活,version race单赢家 |
| CUT-SBX-021 idempotency / replay / entry-job / adapter states | `03` §9批次10.8 | 6 status enum;stored result、receipt、report、availability、config | P0-C | service + worker + job + infra;duplicate不重算,hard guard不可degraded allow |
| CUT-SBX-022 UoW ordering / atomic visibility | `03` §10.4 / §10.5;Step 16 §16 | begin、reserve、truth、audit / relay / stale、stored result、complete、cursor、commit / rollback | P0-C | service + fake UoW;逐失败点断言全量可见或全量不可见 |
| CUT-SBX-023 version / cursor / selector invariants | `03` §10.3 / §10.6~10.8 | `Versioned<T>.version`、truth / reference cursor、page cursor、direct selector / index | P0-C | repository + query;禁止cursor / version / timestamp / ref混用和storage scan |
| CUT-SBX-024 idempotency / stored replay | `03` §12.1 / §12.3~12.4 | operation / channel / key、canonical digest、stored result / receipt / report、missing result | P0-C | service / worker / job;same digest replay,different digest conflict,missing不重跑 |
| CUT-SBX-025 concurrency / single-winner races | `03` §12.2 | reserve、same truth、capability / policy refresh、capture / control、handoff、cleanup、relay、projection races | P0-C | deterministic concurrency;逐race断言version / terminal guard和无半状态 |
| CUT-SBX-026 error / recovery closed set | `03` §11;Step 12 | 38命名错误、public / receipt / report映射、retry / manual / no-recovery口径 | P0-C | contract + service;每个错误至少producer、safe surface、副作用和恢复禁止断言 |
| CUT-SBX-027 config source / parser / item validation | `04` §5 / §7 / §9;TSH-01~03 | S00~S08、C01~C27、strict JSON、I001~I101、unknown / alias / required / range | P0-C | config unit;no fallback / clamp / guess,global发布0或scope独立拒绝 |
| CUT-SBX-028 config composition / atomic generation | `04` §9 / §11;TSH-05/06/09~11 | NCFG-01~24、FC-01~06、XVAL-01~36、40组 /44域、same-generation publication | P0-C | validator + builder integration;required failure发布0,mixed / partial永不暴露 |
| CUT-SBX-029 sensitive material / carrier boundary | `04` §8 / §11;TSH-07/08/18 | 40 sensitive、23 slot、S04时序、lease / revoke、SEC / ALC carrier闭集 | P0-C | security contract;synthetic marker逐carrier扫描,不归档真实material |
| CUT-SBX-030 config change / rollback / drift honesty | `04` §10~§14;TSH-12~17 | review / TOCTOU、complete candidate、new rollback request、desired / observed、history immutable | P0-C | release-control contract / simulation;物理fleet另归CUT-037 |
| CUT-SBX-031 entry / runtime builder / scoped isolation | `03` §5.8 / §13;`04` §9;TSH-10/11 | API / worker / jobs mapping、required port assembly、S05 / S06 current-unit ceiling | P0-C | handler + runtime builder;entry不直连repo,scoped输入不改global /旧result |
| CUT-SBX-032 observability / formal audit / redaction | `03` §14;`04` §8 / §11;TSH-18 | log / metric / audit / receipt / report / event / handoff safe fields,低基数,accepted audit同UoW | P0-C | contract + scan;telemetry / provider audit不替代formal audit |
| CUT-SBX-033 dependency boundary / unsupported surface | `01` §8;`03` §5.2 / §13;`04` §14;TSH-20 | `core-contracts` only sibling compile dependency;S07 / S08 / reload / LKG / hot / callback absence | P0-C | static / protocol / config negative;目标仓缺失时保留planned check |
| CUT-SBX-034 real coherent-boundary conformance | `00` VF-002/003;`03` boundary ports;`04` PROFILE-05 | candidate capability与resource / fs / network / process真实施加、越界阻断、unsupported整体reject | P0-Q | dedicated backend lab;按candidate + template + environment绑定,当前blocked |
| CUT-SBX-035 real lifecycle / capture / cleanup / redline conformance | `00` VF-007/008;`03` backend / safety ports;`04` PROFILE-05 | bounded workload launch、timeout / kill、capture / inspect、lease / orphan、guarded release、containment | P0-Q | dedicated safety lab;真实资源副作用与材料保护,当前blocked |
| CUT-SBX-036 qualification integrity / no weak fallback | `00` VF-002/003/010;`04` AHG-03/19 | profile / config / capability / generation identity、no host / fake / fixture fallback、适用material anti-leak | P0-Q | qualification packet contract;任何前置缺失为blocked而非N/A,当前无真实evidence |
| CUT-SBX-037 durable / real-like / physical operations parity | Step 2 SCP-021/026/031/035;`04` PROFILE-06 | durable UoW / replay、bus / handoff / sink、provider rotation、rollout / rollback / drift / outage | P1 | controlled staging-like integration;不得补偿P0失败,当前unqualified |
| CUT-SBX-038 production / peripheral design-reopen trigger | Step 2 SCP-032/036;`00` FR-E01~E06;`04` PROFILE-07 | production capacity / DR / security、多backend /多host / inspect / trend及new public surface触发 | P2 | 当前无可执行happy-path;进入current scope先回写`00~04` |

切口关系规则:

- CUT-009~013保证55个协议无孤儿;具体协议还必须叠加其对象切口CUT-003~008、状态切口CUT-014~021及横切切口CUT-022~033。
- CUT-034~036均是P0-Q,不能由CUT-004 / 015 / 027~029的fake或设计表替代;执行前置未闭合时保持blocked。
- CUT-037 / 038不能补偿任何P0-C / P0-Q失败。CUT-038当前只定义设计重开条件,不允许发明future API测试。

---

## 9. 协议级测试对象逐项盘点

### 9.1 Command: 10 / 10

| Command | 对象 / flow来源 | 主切口 | 后续必测异常 |
|---|---|---|---|
| `OpenControlledExecutionContext` | context / identity / resolution;`03` §7.3 / §8 | CUT-003/009/014 | missing actor / refs、conflict、forbidden body、duplicate / digest conflict、rollback |
| `EstablishExecutionBoundary` | requirement / decision / boundary / handle / lease | CUT-004/009/015/034 | unsupported / stale capability、四维不一致、weak fallback、backend unavailable、version conflict |
| `EvaluatePolicyExecution` | policy snapshot / decision / high-risk | CUT-005/009/016 | missing / stale / conflicted / unauthorized、high-risk blocked、policy body拒绝 |
| `StartControlledExecutionRun` | context / boundary / policy / run / handle | CUT-005/006/009/017/035 | non-accepted context、boundary / policy blocked、launch unavailable、host fallback、duplicate |
| `RecordCaptureResult` | run / capture / material refs | CUT-006/009/017/029/035 | failed / partial capture、raw output / body、wrong run、duplicate、stored result failure |
| `OpenMaterialHandoff` | capture / handoff / target | CUT-006/009/017 | target mismatch、retryable / permanent failure、capture unchanged、duplicate |
| `SubmitSandboxControl` | control / run / failure | CUT-007/009/018 | conflicting signal、terminal run、duplicate、不触发runtime recover |
| `ClassifySandboxFailure` | failure / source markers | CUT-007/009/018/026 | unknown / insufficient marker、wrong source、not-success、duplicate |
| `EvaluateCleanupReadiness` | cleanup / handoff / lease / redline | CUT-007/009/018 | pending evidence / investigation、missing default blocked、no release side effect |
| `RecordRedlineContainment` | redline / cleanup / investigation | CUT-007/009/018/035 | advisory-only尝试、handoff unavailable、auto-release / cleanup blocked |

### 9.2 Query: 13 / 13

| Query | 读取对象 | 主切口 | 后续必测surface /禁止副作用 |
|---|---|---|---|
| `GetSandboxExecutionStatus` | status snapshot / context | CUT-010/014/019 | visible / unavailable / not-visible / degraded;零写 |
| `GetBoundaryStatus` | boundary projection | CUT-010/015/019 | established / pending / missing;不调用capability / establish |
| `GetPolicyDecisionSummary` | policy projection | CUT-010/016/019 | accepted / rejected / fail-closed / stale;不refresh policy |
| `GetCaptureSummary` | capture projection | CUT-010/017/019 | complete / partial / failed / empty;不读artifact body |
| `GetMaterialHandoffStatus` | handoff projection / index | CUT-010/017/019/023 | delivered / retryable / failed / missing;不retry |
| `GetFailureControlStatus` | safety projection | CUT-010/018/019 | classified / pending / conflict / missing;不classify |
| `GetCleanupReadiness` | cleanup view | CUT-010/018/019 | allowed / blocked / pending;不release |
| `GetRedlineContainmentStatus` | redline view | CUT-010/018/019 | detected / contained / handoff pending / missing;不解除containment |
| `GetSandboxReadProjection` | projection | CUT-010/019/023 | fresh / stale / missing / degraded;不rebuild或拼ref |
| `GetDerivedInspectPreviewTrend` | derived state | CUT-010/019 | fresh / stale / rebuilding / failed / empty;不maintain |
| `GetBackendCapabilityComparison` | derived comparison | CUT-010/015/019 | supported / unsupported / stale / unavailable;不refresh backend |
| `GetSandboxReconciliationReport` | reconciliation report | CUT-010/019/023 | clean / issues / degraded / failed / missing;不run reconciliation |
| `GetSandboxAuditTrace` | append-only audit page | CUT-010/023/032 | first / next / empty / restricted;page cursor不作truth cursor,不append |

### 9.3 Inbound Event Consumer: 9 / 9

| Consumer | 写入对象 /边界 | 主切口 | 后续必测异常 |
|---|---|---|---|
| `ConsumeCallerContextReferenceChanged` | reference state / projection stale | CUT-003/011/014/023 | invalid envelope、forbidden body、duplicate receipt、reference cursor非source version |
| `ConsumePolicySummaryChanged` | policy reference / stale marker | CUT-005/011/016 | stale / unavailable delayed、policy body quarantine、不把rejected decision改accepted |
| `ConsumeBackendCapabilitySummaryChanged` | capability reference / comparison stale | CUT-004/011/015 | unsupported / stale可见、duplicate、不直接establish boundary |
| `ConsumeIsolationBackendLifecycleSignal` | handle / lease / orphan / failure marker | CUT-007/011/015/018 | relation missing delayed、wrong handle quarantine、不release cleanup |
| `ConsumeMaterialHandoffStatusChanged` | matched handoff fact | CUT-006/011/017 | target mismatch、retryable / failed、capture不回滚、duplicate |
| `ConsumeObservabilityHandoffStatusChanged` | observability handoff marker | CUT-006/011/029/032 | material missing、external body、不得形成observability store truth |
| `ConsumeSandboxControlRequested` | formal control command path | CUT-007/009/011/018/024 | trusted source不绕schema / command guard、inner key conflict、duplicate event |
| `ConsumeInvestigationHandoffStatusChanged` | redline / cleanup relation marker | CUT-007/011/018 | mismatch quarantine、failed / pending marker、不自动解除containment |
| `ConsumeSandboxTruthRelayFeedback` | relay status | CUT-008/011/020 | published / retryable / dead-letter、unknown只inspect exact attempt、source truth不变、duplicate receipt |

### 9.4 Outbound Event: 13 / 13

| Outbound Event | committed payload来源 | 主切口 | 后续必测负向 |
|---|---|---|---|
| `SandboxExecutionContextChanged` | context / identity / resolution snapshot | CUT-003/012/014/022 | caller body absent、payload source missing不append、source tx rollback不可见 |
| `SandboxBoundaryChanged` | requirement / decision / boundary / handle snapshot | CUT-004/012/015 | backend raw response absent、rejected与established不混同、no weak fallback event |
| `SandboxPolicyDecisionChanged` | policy decision / high-risk snapshot | CUT-005/012/016 | policy DSL absent、fail-closed不写accepted、payload immutable |
| `SandboxRunChanged` | run truth snapshot | CUT-006/012/017 | runtime loop body absent、terminal状态不重建、publish failure不改run |
| `SandboxCaptureChanged` | capture fact / material refs | CUT-006/012/017/029 | stdout / stderr / file body absent、partial不伪complete |
| `SandboxMaterialHandoffChanged` | handoff fact snapshot | CUT-006/012/017 | receipt refs only、failed不改capture、target mismatch无event |
| `SandboxFailureChanged` | failure classification snapshot | CUT-007/012/018 | unknown不success、safe reason only、source marker不作raw body |
| `SandboxControlChanged` | control fact snapshot | CUT-007/012/018 | conflict不伪accepted、不声明runtime recover |
| `SandboxCleanupChanged` | cleanup guard snapshot | CUT-007/012/018 | blocked不伪released、missing evidence不写allowed |
| `SandboxRedlineContainmentChanged` | redline containment snapshot | CUT-007/012/018 | advisory-only / auto-release不存在、investigation body absent |
| `SandboxProjectionChanged` | projection status / source cursor | CUT-008/012/019/023 | no projection body dump、cursor来源正确、query不产生event |
| `SandboxDerivedViewChanged` | derived state snapshot | CUT-008/012/019 | source refs only、derived failure不升格core failure |
| `SandboxReconciliationFindingAvailable` | reconciliation report / finding refs | CUT-008/012/019 | finding body absent、report不修truth、degraded不伪clean |

### 9.5 Operations Job: 10 / 10

| Job | 维护对象 | 主切口 | 后续必测异常 /禁止动作 |
|---|---|---|---|
| `PublishSandboxEventRelay` | relay record / stored report | CUT-012/013/020/025 | retryable / dead-letter、version单赢家、source不回滚、duplicate report |
| `RefreshSandboxReferenceStates` | reference state / stale marker | CUT-003/013/014/023 | resolver unavailable、marker cursor、affected refs来自repo、no core repair |
| `RefreshBackendCapabilitySummaries` | capability state / comparison stale | CUT-004/013/015 | unsupported / stale / unavailable、no default allow、不establish boundary |
| `RetryPendingMaterialHandoffs` | handoff fact / report | CUT-006/013/017 | retryable / failed、capture不变、partial report、duplicate |
| `RunLeaseOrphanReaper` | lease / orphan / cleanup / handle | CUT-007/013/015/018/035 | lifecycle unavailable、missing guard blocked、不直接release、partial report |
| `EvaluatePendingCleanupGuards` | cleanup guard | CUT-007/013/018 | evidence / investigation missing、allowed / blocked、no release adapter |
| `MaintainRedlineContainmentHandoffs` | redline / investigation handoff | CUT-007/013/018 | target unavailable、pending / failed、no containment release |
| `RebuildSandboxReadProjections` | projection / snapshot / report | CUT-008/013/019/025 | snapshot missing degraded、race conflict、no existing-view reverse inference |
| `MaintainDerivedInspectPreviewTrend` | derived state / report | CUT-008/013/019 | source unavailable / failed、no core failure / truth repair、duplicate |
| `RunSandboxReconciliation` | reconciliation report / finding refs | CUT-008/013/019 | clean / issues / degraded / failed、no truth / projection / relay repair、duplicate |

协议盘点结论:

| 协议族 | 正式数量 | 本步盘点 | 孤儿 | 结论 |
|---|---:|---:|---:|---|
| Command | 10 | 10 | 0 | pass |
| Query | 13 | 13 | 0 | pass |
| Inbound Consumer | 9 | 9 | 0 | pass |
| Outbound Event | 13 | 13 | 0 | pass |
| Operations Job | 10 | 10 | 0 | pass |
| 合计 | 55 | 55 | 0 | pass |

---

## 10. 状态、错误、配置与负向对象闭集

### 10.1 8个状态批次 / 30个 owner-level state machines / 31个 Step 10 canonical status enum entries

| 状态批次 | 正式status enum | 主切口 | 最低后续用例要求 |
|---|---|---|---|
| intake / identity / reference | `ControlledExecutionIntakeStatus`;`ExecutionEnvironmentIdentityStatus`;`ReferenceResolutionStatus` | CUT-014 | 每个owner一条主线合法、一条边界合法、一条terminal / body非法 |
| boundary / capability / handle / lease / orphan | `BoundaryDecisionStatus`;`BoundaryCoherenceStatus`;`BackendCapabilityStatus`;`IsolationHandleStatus`;`LeaseStatus`;`OrphanRecoveryStatus` | CUT-015 | unsupported -> coherent与released -> active非法;lease / orphan / cleanup race |
| policy / high-risk | `PolicyApplicabilityStatus`;`PolicyExecutionDecisionStatus`;`HighRiskActionDecisionStatus` | CUT-016 | missing / stale / conflicted永不allow;blocked无无来源解除 |
| run / capture / handoff | `ControlledExecutionRunStatus`;`CaptureFactStatus`;`HandoffFactStatus`;`HandoffTargetProgressStatus` | CUT-017 | run terminal不重开;capture immutable;opening外呼0;per-target attempt-before-call;failure no rollback |
| failure / control / cleanup / redline | `FailureClassificationStatus`;`ControlFactStatus`;`CleanupGuardStatus`;`RedlineContainmentStatus` | CUT-018 | conflict、pending input、guard-first、contained不可advisory |
| query / projection / derived / reconciliation | `QueryAccessStatus`;`SandboxProjectionStatus`;`DerivedFreshnessStatus`;`ReconciliationReportStatus` | CUT-019 | 同名Failed owner分离;query no-write;job no-repair |
| relay | `SandboxEventRelayStatus` | CUT-020 | published / dead-letter terminal;exact attempt version单赢家;source不回滚 |
| idempotency / stored / receipt / report / adapter / config | `IdempotencyRecordStatus`;`StoredResultStatus`;`ConsumerReceiptStatus`;`JobReportStatus`;`AdapterAvailabilityStatus`;`RuntimeConfigStatus` | CUT-021 | duplicate replay、missing result、degraded上限与hard guard |

数量说明: 概要`02`的6组状态主题是轮廓;正式`03`已经合法展开为8个状态批次、30个 owner-level state machines和31个 Step 10 canonical status enum entries。本Step以正式`03`为唯一测试命名来源,不把两个数量口径视为冲突。

### 10.2 38个命名错误闭集

| 错误族 | 数量 | 代表性错误 /风险 | 主切口 | 后续覆盖规则 |
|---|---:|---|---|---|
| Contract | 2 | `InvalidCarrier`;`UnsupportedProtocolVersion` | CUT-001/002/026 | DTO / schema负向,无写入 |
| Domain | 10 | `InvalidStateTransition`;`PolicyFailClosedBypass`;`WeakBoundaryFallbackRejected`;`CleanupGuardRejected`;`RedlineContainmentRequired` | CUT-003~008/014~020/026 | 每个错误断言owner状态不越界和禁止副作用 |
| Application | 14 | `VersionConflict`;`DuplicateMissingResult`;`NoWriteViolation`;`JobNoRepairViolation`;UoW errors | CUT-009~013/022~026 | producer、public surface、rollback / no-recompute与恢复口径 |
| Infra | 4 | `AdapterUnavailable`;`AdapterDisabled`;`OutcomeClassificationMissing`;`RuntimeBuilderFailed` | CUT-026/028/031 | no fallback allow;safe failure surface |
| API / Worker / Jobs | 4 | invalid metadata / envelope、unsafe body、report persistence | CUT-001/002/011/013/026/031 | entry拒绝 / quarantine / failed report且不伪成功 |
| Relay / Handoff | 4 | retryable / dead-letter / permanent delivery failure | CUT-006/008/012/013/020/026 | only owning marker / report changes,no source rollback |
| 合计 | 38 | 与Step 12命名闭集一致 | CUT-026 | Step 6逐错误建立case去向,不得只断言error string |

### 10.3 配置与安全planned handoff闭集

| 集合 | 数量 | 切口去向 | 本Step结论 |
|---|---:|---|---|
| TSH-01~20 | 20 | CUT-027~033、CUT-034~037 | 20 / 20有对象切口;当前仍非suite / case |
| FDT-01~30 | 30 | CUT-027~032为P0-C;适用real行为叠加CUT-034~037 | 30 / 30有负向切口;Step 6仍须逐项case化 |
| VF-SBX-001~010 | 10 | CUT-003~036 | 10 / 10进入P0;无risk acceptance豁免 |
| VETO-CFG-01~16 | 16 | CUT-027~036并叠加对象 /协议切口 | 16 / 16进入P0负向对象;编号体系不与VF合并 |
| AHG-01~19 | 19 | 反查CUT-027~037 | 只作planned acceptance handoff,不分配正式AC / VETO |
| EHR-01~20 | 20 | 后续Step 5 / 9 / 13绑定切口 | 只作planned evidence requirement,不创建EV / run / artifact |

### 10.4 字段 / DTO /边界混同负向清单

| 负向对象 | 正式禁止关系 | 主切口 | 后续断言 |
|---|---|---|---|
| context / request / source refs | `context_ref`不等于caller request / work / runtime / tool ref | CUT-001~003 | family错即`InvalidCarrier` / validation,不创建truth |
| trace / cursor / version | trace ref、page cursor、truth cursor、reference cursor、repository version互不替代 | CUT-002/023 | 错用触发cursor / validation错误,无staged write外泄 |
| idempotency / dedup / job run | Command key、Consumer dedup、Job key、relay ref、job_run_ref互不替代 | CUT-002/024/025 | wrong channel / digest conflict不执行第二次mutation |
| policy / capability summary | body-free snapshot / ref不等于policy / approval / backend truth正文 | CUT-004/005/029/033 | body / guessed truth拒绝,missing fail-closed |
| boundary dimensions | resource / filesystem / network / process必须同一coherent set | CUT-004/015/028/034 | 任一unsupported整体reject,无partial success |
| capture / handoff / downstream truth | capture fact、handoff receipt、artifact / observability truth互不升格 | CUT-006/011/012/029/032 | receipt / marker不产生下游formal truth |
| error / state | adapter error string不推断domain state;同名Failed不跨owner | CUT-014~021/026 | 只消费正式enum / outcome / error mapping |
| profile / evidence | P01~04结果不等于P05资格,P05不等于P06 / P07 | CUT-028/031/034~037 | wrong-profile evidence拒绝,资格不传递 |

---

## 11. P0测试切口逐项停审记录

停审口径: `通过（设计）`只表示来源、风险、推荐层级和后续用例要求足以继续测试设计,不表示测试已实现或运行。`通过（设计）;执行阻塞`还表示P0-Q真实执行前置尚未闭合。

| 测试切口 | 来源 /风险 /层级 /可落地性审查 | 结论 | 缺口 /后续修正 |
|---|---|---|---|
| CUT-SBX-001 | public carrier来源明确;缺字段 / family风险具体;contract unit可落地 | 通过（设计） | Step 6逐DTO family列case |
| CUT-SBX-002 | metadata / digest来源明确;字段混同风险具体;entry断言可落地 | 通过（设计） | Step 6逐输入族列canonicalization case |
| CUT-SBX-003 | context / identity对象与错误明确;domain + service合理 | 通过（设计） | Step 6覆盖匿名、冲突、正文和终态 |
| CUT-SBX-004 | coherent boundary对象与四维风险明确;fake contract合理 | 通过（设计） | 真实施加由CUT-034补充,不可互代 |
| CUT-SBX-005 | policy decision与fail-closed来源明确;service层可断言 | 通过（设计） | Step 6覆盖全部missing / stale / conflict分支 |
| CUT-SBX-006 | run / capture / handoff owner分离明确;no-rollback可断言 | 通过（设计） | Step 6逐capture / handoff状态展开 |
| CUT-SBX-007 | safety group与guard来源明确;安全风险具体 | 通过（设计） | 真实lifecycle由CUT-035补充 |
| CUT-SBX-008 | read / maintenance / relay owner明确;no-repair风险具体 | 通过（设计） | Step 6拆query / job / relay副作用断言 |
| CUT-SBX-009 | 10 Command逐项可回指flow;service + API合理 | 通过（设计） | Step 6按10个Command分批停审 |
| CUT-SBX-010 | 13 Query逐项可回指;no-write可机械断言 | 通过（设计） | Step 6逐Query覆盖surface与0 write |
| CUT-SBX-011 | 9 Consumer逐项可回指;dedup / quarantine风险具体 | 通过（设计） | Step 6逐Consumer覆盖receipt与source authority |
| CUT-SBX-012 | 13 Event逐项可回指;stored payload / no-rollback明确 | 通过（设计） | Step 6逐Event验证字段和payload source |
| CUT-SBX-013 | 10 Job逐项可回指;report / no-repair明确 | 通过（设计） | Step 6逐Job覆盖partial与replay |
| CUT-SBX-014 | 3 enum /对象owner明确;合法 /非法转换可落地 | 通过（设计） | 禁止口语状态名 |
| CUT-SBX-015 | 6 enum与四维 / lease风险明确 | 通过（设计） | fake状态不充当真实conformance |
| CUT-SBX-016 | 3 enum与fail-closed非法迁移明确 | 通过（设计） | blocked解除必须有正式source |
| CUT-SBX-017 | 3 enum owner分离;terminal / no-rollback明确 | 通过（设计） | 同名Failed不可跨owner |
| CUT-SBX-018 | 4 safety enum与guard优先级明确 | 通过（设计） | cleanup / release / launch分别断言 |
| CUT-SBX-019 | 4 read-side enum与no-write / no-repair明确 | 通过（设计） | query与job用例不得合并owner |
| CUT-SBX-020 | relay enum / terminal规则明确;worker层合理 | 通过（设计） | 覆盖single-winner version race |
| CUT-SBX-021 | 6 technical / replay enum来源明确;degraded上限具体 | 通过（设计） | hard guard降级必须负向覆盖 |
| CUT-SBX-022 | UoW顺序和每个staged side effect明确 | 通过（设计） | Step 6逐失败点验证atomic visibility |
| CUT-SBX-023 | version / cursor / selector禁止混同明确 | 通过（设计） | current selector未开放时断言validation / degraded |
| CUT-SBX-024 | key / digest / stored replay契约明确 | 通过（设计） | Command / Consumer / Job三族都覆盖 |
| CUT-SBX-025 | 10类race来源明确;deterministic concurrency合理 | 通过（设计） | Step 6逐race列single-winner断言 |
| CUT-SBX-026 | 38错误闭集与恢复口径明确 | 通过（设计） | Step 6逐错误至少一个producer / surface去向 |
| CUT-SBX-027 | source / parser / 101 item来源明确 | 通过（设计） | FDT-01~08逐项case化 |
| CUT-SBX-028 | NCFG / XVAL / generation来源明确 | 通过（设计） | 40组 /44域覆盖索引留给Step 5 / 6 |
| CUT-SBX-029 | sensitive 40 /23 slot和carrier闭集明确 | 通过（设计） | 只用synthetic marker;真实material不归档 |
| CUT-SBX-030 | review / rollback / drift truth边界明确 | 通过（设计） | 物理carrier / fleet drill留CUT-037 |
| CUT-SBX-031 | entry / builder / scoped owner明确 | 通过（设计） | API / worker / job三类current unit分别覆盖 |
| CUT-SBX-032 | formal audit / telemetry / redaction分层明确 | 通过（设计） | Step 9 / 13再定义scan / evidence schema |
| CUT-SBX-033 | dependency / unsupported surface来源明确 | 通过（设计） | 目标仓缺失只阻塞真实static check |
| CUT-SBX-034 | P0-Q四维真实conformance对象 /风险 /lab层级明确 | 通过（设计）;执行阻塞 | candidate、template、capability、environment未绑定 |
| CUT-SBX-035 | P0-Q真实lifecycle / safety对象与副作用明确 | 通过（设计）;执行阻塞 | dedicated safety lab与材料保护条件未形成 |
| CUT-SBX-036 | 资格identity / no fallback / anti-leak边界明确 | 通过（设计）;执行阻塞 | 固定资格包、产品和真实evidence identity未形成 |

P0停审结论: CUT-SBX-001~036全部完成设计停审,无`来源不明`、`风险模糊`、`层级不可执行`或`后续无法成例`项。CUT-034~036的执行阻塞不改变设计停审结论,也不得被写成测试通过。

---

## 12. 范围反查与跨切口设计来源审计

### 12.1 SCP-SBX-001~036反查

| Step 2范围批次 | 主切口 | 反查结论 |
|---|---|---|
| SCP-001~005 identity / boundary / policy / launch | CUT-003~005/009/014~016/031/034~036 | P0-C与P0-Q均有对象入口 |
| SCP-006~012 run / failure / capture / cleanup / redline | CUT-006~008/017~018/026/032/035 | truth、state、error和真实safety均覆盖 |
| SCP-013~017五类协议 | CUT-009~013 | 55 / 55逐项盘点,无抽样 |
| SCP-018~020状态 /事务 /幂等 | CUT-014~025 | 8批次、30 owner-level state machines、UoW与replay覆盖 |
| SCP-021 durable parity | CUT-037 | P1保留,不补偿P0 |
| SCP-022~027配置 /变更 /恢复 | CUT-026~032/034~037 | P0 contract、P0-Q与P1物理操作分层 |
| SCP-028 dependency boundary | CUT-033 | static check待目标仓,设计对象已存在 |
| SCP-029~033 profile / unsupported | CUT-028/031/033~038 | P01~04、P05、P06、P07证明上限不混同 |
| SCP-034 zero-tolerance NFR | CUT-003~036 | VF / veto均落P0负向对象 |
| SCP-035 structural performance | CUT-037/038 | P1 / P2保留,无旧硬阈值 |
| SCP-036 peripheral enhancement | CUT-038 | 只保留设计重开触发,无伪造happy path |

### 12.2 跨切口总审计

| 审计项 | 结论 | 缺口 /修正 |
|---|---|---|
| 七模块 | contracts / domain / application / infra / api / worker / jobs均有对象和切口 | 无 |
| 对象索引 | truth / snapshot / guard / helper / carrier / report均有主切口 | 无 |
| Trait / Port / Adapter | service、UoW、repository、resolver、backend、handoff、publisher、runtime config均有入口 | 无 |
| 55协议 | 10 + 13 + 9 + 13 + 10逐项盘点 | 无孤儿 |
| 状态命名 | 只使用正式31个 Step 10 canonical status enum entries;概要6组仅作轮廓 | 无漂移 |
| 状态机 | 正式30个 owner-level state machines由8个CUT状态批次承接 | Step 6逐owner展开case |
| 错误闭集 | 38 / 38进入CUT-026及producer切口 | Step 6逐错误展开case |
| 事务 /幂等 /并发 | UoW、version、cursor、replay和race各有独立切口 | 无 |
| 配置 | 101 item、40组、44域、20 TSH、30 FDT均有切口去向 | 字段级矩阵留Step 5 / 6 |
| VF / VETO | 10 VF与16 VETO保留独立编号且全部进入P0 | 无豁免 |
| 重点隔离边界 | identity、resource / fs / network / process、launch、capture、observability、failure、cleanup / lease / reaper、redline均覆盖 | 无 |
| 非职责 | tools semantics、runtime loop、member lifecycle、artifact / observability truth只测接缝 | 无范围膨胀 |
| 重复切口 | 协议切口管flow inventory;对象切口管invariant;状态切口管transition;横切切口管atomicity / error / config | 无重复truth owner |
| P0-Q | CUT-034~036与fake contract分离,前置缺失诚实标blocked | 执行blocker开放 |
| P1 / P2 | CUT-037 / 038独立,不补偿P0 | 无优先级漂移 |
| historical material | 旧对象、TC、host runtime、Docker / gVisor、cleanup disabled未进入切口 | 无回流 |
| phase boundary | 未创建TC / suite / data / environment / script / evidence / implementation artifact | 无越界 |

跨切口审计结论: 未发现孤儿P0设计契约、重复真相owner、状态 /字段命名漂移或phase boundary越界,允许完成Step 3设计停审。

---

## 13. 对上游设计的影响判定

| Step 3结论 | 是否影响上游 | 回写位置 | 处理状态 |
|---|---:|---|---|
| 七模块、55协议、30 owner-level state machines和38错误均可形成稳定切口 | 否 | 不适用 | 无当前回写 |
| 概要6组状态主题按正式`03`展开为8批次 /31 Step 10 enum entries | 否 | 不适用 | 采用详细设计正式真相,不修改概要轮廓 |
| PROFILE-05真实隔离证明列为P0-Q | 否 | 不适用 | 测试风险轴不改变`04`配置成熟度轴 |
| P0-Q缺candidate backend、capability matrix和dedicated environment | 否 | Step 8~10、`07/09` | 保留执行blocker,不得由P0-C替代 |
| 后续若切口无法形成字段、状态、错误或副作用断言 | 条件性是 | 对应`00/03/04`章节 | 触发`SBX-TEST-DESIGN-REOPEN-001`后先回写上游 |

当前没有阻塞Step 4设计的上游blocker。目标仓、真实suite、backend和环境缺失只阻塞后续执行、资格与证据形成。

---

## 14. 正式`05` §3回填草稿

> 校准来源: `design-calibration/05_test_plan_step_03_test_objects_cuts.md`
>
> 延伸阅读: 建议继续阅读本文件§6对象池、§7切口总表、§8协议盘点、§9状态与错误盘点、§11逐切口停审和§12跨切口审计。

正式§3应回填:

1. 测试对象按contracts、domain、application、infra、api、worker和jobs七模块组织,并覆盖对象、service、port / adapter、repository / UoW和entry helper。
2. `CUT-SBX-001~038`构成切口闭集:33个P0-C、3个P0-Q、1个P1和1个P2;P0-C与P0-Q不可互相替代。
3. 10 Command、13 Query、9 Consumer、13 Outbound Event和10 Job必须55 /55逐协议承接,不得按协议族抽样。
4. 状态验证以正式`03`的8批次、30 owner-level state machines和31个 Step 10 canonical status enum entries为准,并独立覆盖UoW、version / cursor、幂等 / replay、并发单赢家和38个正式错误。
5. 配置 /安全切口承接101 item、40组、44域、20 TSH、30 FDT、10 VF和16 VETO-CFG,但不把planned handoff伪装成case或evidence。
6. CUT-034~036只可标记“设计通过、执行阻塞”;任何fake、simulation或较低profile结果都不能证明真实四维隔离资格。

---

## 15. 待确认事项

| 待确认事项 | 当前状态 | 是否阻塞Step 4 | 后续处理 |
|---|---|---:|---|
| candidate backend、capability matrix和dedicated conformance environment | open_for_p0q_execution | 否 | Step 8定义环境要求,`07/09`绑定真实载体 |
| destructive cleanup / reaper / redline的独立安全lab | open_for_environment_design | 否 | Step 8 / 10完成隔离和材料保护设计 |
| provider / platform anti-leak与durable parity产品 | open_for_profile_qualification | 否 | Step 8~10和`07/09`关闭资格前置 |
| 目标实现仓、suite和执行命令 | open_for_07_precheck | 否 | 当前不伪造;真实执行前关闭 |
| 正式`06`的evidence裁决 | open_for_06_full_restart | 否 | 新版正式`05`完成后重建 |

---

## 16. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| P0测试对象均有具体设计真相源 | 通过 | CUT-SBX-001~036逐项回指对象、协议、状态、事务、错误或配置 |
| 全部P0切口完成设计停审 | 通过 | 36 /36;其中3项诚实保留执行阻塞 |
| 55个协议逐项承接 | 通过 | 10 + 13 + 9 + 13 + 10,无抽样 |
| 状态、错误与配置对象闭合 | 通过 | 30 owner-level state machines、31 Step 10 enum entries、38错误及配置 /安全集合均有切口 |
| 跨切口审计无unresolved冲突 | 通过 | 无孤儿、重复owner、命名漂移或phase越界 |
| 正式`05`及实施产物未创建 /修改 | 通过 | 正式文件保持historical原状,无TC / EV / run / implementation artifact |
| 可进入Step 4 | `passed_to_step_4` | 用户已审查确认;Step 4已据此完成 |

```text
current_document = `05-测试方案.md`
current_step = Step 3 `抽取测试对象与测试切口`
gate_status = passed_to_step_4
next_allowed_action = 已传递至Step 4;后续恢复读取`05_test_plan_step_04_strategy_layers.md`
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
