# L4-sandbox 实施计划 Step 5 设计实施阶段与依赖顺序

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/实施计划书写规范.md` §5.5
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `07-实施计划.md` §5 实施阶段与依赖顺序
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_6
> 本Step口径: 将Step 4的39项交付物组织为可验证功能增量,固定phase、依赖、并行支线、输入 / 输出 / 非范围、阶段门禁和停审。本Step不拆commit boundary、不指定commit、不创建实现仓、正式`07`、implementation ledger、planned boundary skeleton、runtime artifact、测试结果或验收结论。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 4 / pending_user_review`;用户已明确“同意”,确认Step 4并放行Step 5。 | passed_for_step_5 |
| 文档级flow | Step 1~4已依次审查传递;Step 5是唯一合法下一步。 | passed_for_step_5 |
| Step级输入 | Step 4已形成19个实施surface和39项可判定交付物;正式`01~06`提供依赖、flow、配置、suite / gate和验收门禁。 | passed_for_phase_design |
| 正式文档写入 | 本Step只形成§5回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_5 |
| commit boundary | 本Step只定义phase;boundary ID、allowed scope和commit gate只能由Step 6形成。 | forbidden_until_step_6 |
| 实现侧产物 | 目标仓、代码、测试、脚本、CI、run和evidence均未形成。 | forbidden_in_design_task |
| 下游Step | 用户已确认Step 5,Step 6已获得一次性放行。 | passed_to_step_6 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 5 `设计实施阶段与依赖顺序`
current_module = `implementation_phases_dependencies_reviewed`
gate_status = passed_to_step_6
next_allowed_action = 由`07_implementation_plan_step_06_tasks_commit_boundaries.md`承接;不得跳到Step 7
phase_count = 14
pre_implementation_handoff_gate = HDO-SBX-00
commit_boundary_count = undefined_wait_until_step_6
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 可审查产物 / 完成门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 4审查状态。 | done | 用户放行与唯一下一动作可追溯 |
| 2 | 读取Step 5标准、正式依赖 / flow /配置 /测试 /验收输入和L1粒度参考。 | done | 10项SOP问题均有权威来源 |
| 3 | 按可验证能力增量设计phase、实现前handoff gate与P0-Q准备支线。 | done | phase不按crate /对象 /文件裸拆 |
| 4 | 为每个phase固定输入、输出、不包含、门禁和后续依赖检查。 | done | 当前phase不依赖后续实现或证据 |
| 5 | 完成逐phase停审和跨phase覆盖 /依赖审计。 | done | 39交付物、五能力、55协议、suite / gate / slot均有去向 |
| 6 | 输出§5回填草稿、blocker、自检和停审条件。 | done | 停在Step 5待审 |

---

## 2. 本步目标、输入与拆分原则

### 2.1 本步目标

1. 建立从实现前handoff gate、可执行基础到P0-C、P0-Q和release aggregation的完整阶段依赖链。
2. 让每个phase交付一个可以用正式TC / suite / gate检查的能力增量,而不是一组文件或对象。
3. 将candidate、ENV-05、Shell lint、RFC 8785和target version等风险放到最迟关闭点之前,但不让未选candidate阻塞可独立推进的P0-C主线。
4. 保证任何phase不要求后续phase尚未实现的协议、state、adapter、flow或evidence才能通过。
5. 为Step 6留下足够粒度拆commit boundary,同时不在本Step伪造boundary ID。

### 2.2 输入表

| 输入 | 状态 | 本Step使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_objects_deliverables.md` | completed_reviewed | 39项交付物、19个surface、非交付物与跨仓依赖的唯一直接输入 |
| `01-架构设计.md`职责 /依赖 /一致性章节 | reviewed | 固定execution isolation truth、只允许core编译依赖和fail-closed安全红线 |
| `02-概要设计.md`§5~§11 | reviewed | 固定六组成部分、主处理链、状态传播和异常先后关系 |
| `03-详细设计.md`§4~§16 | reviewed | 固定七crate依赖、55协议 / flow、30 owner machines /31 canonical enum entries /39 shared declarations、38错误、UoW、replay、adapter和handoff |
| `04-配置设计.md`§3~§12 | reviewed | 固定source / typed config / generation / profile / material / adapter装配先后与IMH-01~16 |
| `05-测试方案.md`§3~§14 | reviewed | 固定254 TC、28数据集、16 suite、7 gate、17脚本、21 slot和四source release关系 |
| `06-验收标准.md`§5~§14 | reviewed | 固定18功能AC、架构 /协议 /状态 / NFR / evidence /17 VETO和最终裁决消费规则 |
| L1-governance / L1-artifact Step 5 | granularity reference | 参考phase图、可验证增量和停审格式,不继承领域phase或数量 |

### 2.3 Phase拆分原则

| 原则 | 本Step应用 |
|---|---|
| 能力纵切优先 | phase围绕intake、boundary、policy、run / capture、安全收束、read / async / operations和qualification组织 |
| 基础能力可独立验证 | bootstrap / contract / config foundation只允许建立后续纵切必需的可测试基础,不宣称业务功能完成 |
| 横切能力随纵切增量进入 | UoW、audit、relay snapshot、projection stale、stored result、redaction不得全部推迟到最终phase |
| P0-C / P0-Q正交推进 | candidate准备从PH-01后开始,但candidate实现 /资格必须消费稳定的P0-C contract和config foundation |
| final phase只聚合 | RELEASE / acceptance phase不得新增业务truth、协议、状态、配置或测试断言 |
| phase不等于commit | Step 6可将每个phase拆成多个boundary;本Step不承诺一phase一commit |

---

## 3. SOP问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 1. 最小可运行或可测试纵切是什么? | PH-03受理与execution identity纵切:在PH-01~02可编译foundation上,从`OpenControlledExecutionContext` entry经metadata / resolver / UoW / idempotency / domain / repository fake到stored result、audit、relay snapshot和projection stale形成可验证闭环。 | `03`§7.3 / §8.2;`05`CMD / TXN / STA;`06`AC-006~008 |
| 2. 哪些阶段必须先于其他阶段? | PH-01仓前置 -> PH-02 carrier / persistence / harness kernel -> PH-03 strict config / profile foundation -> PH-04 intake -> PH-05 boundary -> PH-06 policy -> PH-07 run / capture / handoff -> PH-08 safety。PH-09 read与PH-10 consumer / relay汇合后进入PH-11 operations,再由PH-12做P0-C hardening。PH-13 qualification依赖PH-05~08 /12与PH-QP,PH-14 release等待PH-12 +13。 | 模块依赖、10 Command先后、state owner、suite / gate source关系 |
| 3. 哪些风险或跨仓依赖需要前置? | target repo / version / core revision在PH-01;Shell与RFC 8785在PH-02;candidate ADR / ENV-05 / material identity由PH-QP准备支线最迟在PH-11前关闭。其他相邻仓只使用formal fake / controlled seam,不作为compile前置。 | Step 3 PRE-SBX-001~013;Step 4跨仓表 |
| 4. 每阶段完成后能验证什么? | PH-01验证开工基础;PH-02验证shared carrier / UoW / replay / harness kernel;PH-03验证strict config / profile / generation;PH-04~08依次验证五个核心能力链;PH-09验证13 Query no-write;PH-10验证9 Consumer /13 Event;PH-11验证10 Job no-repair;PH-12验证55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN /19 race和237条P0-C;PH-13验证13 CONF;PH-14验证四source aggregation与report真实性。 | 阶段总表和逐phase增量表 |
| 5. 是否存在按对象拆分而不可验证的阶段? | 否。contracts / domain / application / infra / entry会在同一能力phase内形成纵切;PH-02虽是foundation,也以carrier roundtrip、strict config和harness自测作为独立可判定结果。 | Step 5原则;`03`§5.2依赖规则 |
| 6. 哪些阶段可并行,哪些不能? | PH-04~08核心写链必须串行;PH-09 /10在phase依赖图上都由PH-08后置,但Step 6按单current ledger进一步固定为`09A -> 09B -> 10A -> 10B`,只允许后序材料预读,不允许并行实现 /提交。PH-QP可从PH-01后并行准备,PH-13需等待PH-05~08 /12及准备关闭。PH-14等待PH-12和PH-13。 | 状态 / read / relay / job依赖;P0-C / P0-Q正交关系;Step 6 boundary纪律 |
| 7. 每个phase是否有增量、输入、输出、测试和验收门禁? | 是。§7逐phase登记五项SOP字段并增加前置、暂停和不得依赖后续检查;§6总表绑定planned suite / gate / AC / slot。 | 本文件§6~§8 |
| 8. 是否包含只能由后续phase提供的对象、协议、flow、状态或证据? | 否。当前phase只消费已完成phase或同phase交付;允许在contracts提前存在variant / DTO,但当前门禁不要求后续service / adapter / runtime evidence。PH-14只消费PH-12 /13已能产生的真实source run,不能制造缺失source。 | §8逐phase停审;§9跨phase审计 |
| 9. 每个phase是否完成停审? | 已完成设计层逐phase停审并记录`PassDesign`;这不是实现 /测试通过。未来执行期仍需按Step 6 /7 gate重复判定。 | §8 Phase停审记录 |
| 10. 跨phase依赖、风险、外部依赖和验收覆盖是否闭合? | 设计层审计通过,无需要回写正式`00~06`的冲突。candidate、目标仓、工具选择和design baseline仍是对应开工 /移交前置,不被写成ready。 | §9跨phase审计与§11 blocker表 |

---

## 4. 当前材料问题诊断

| 位置 / 材料 | 当前问题 | 影响 | 本Step处理 |
|---|---|---|---|
| 正式`07-实施计划.md` | 尚无phase顺序且文档不存在 | Step 6无法合法拆boundary | 本Step形成HDO-SBX-00和PH-01~14依赖关系;Step 13才回填正式文档 |
| Step 4交付物 | 按类型 / surface聚合,未给实施顺序 | 同一交付可能跨多个能力阶段 | 按“首次形成可用能力 + 后续补强”分配primary owner和supporting phase |
| `03`七crate布局 | 易诱导按crate拆phase | 单crate完成不等于能力可验证 | 每个功能phase跨contracts / domain / application / infra / entry纵切 |
| `05` suite | 一个suite覆盖多个能力 / phase | 无法一phase独占完整suite | 先执行targeted subset;PH-10再执行完整P0-C inventory与suite闭集 |
| P0-Q candidate未选 | 若串入P0-C主链会全面阻塞;若最后才处理会隐藏高风险 | 阶段顺序失真或release晚阻塞 | 建立PH-QP持续准备支线和PH-13独立qualification phase |
| Step 13 ledger交付 | 容易被当作release后的实现phase | 实现agent开工前反而没有恢复入口 | 定义为`HDO-SBX-00`实现前门禁;文件仍由文档Step 13同步创建 |

---

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阶段主轴 | 39项交付物无顺序 | 14个可验证phase +1个实现前handoff gate +1条外部准备支线 | 让依赖和汇合点可审查 |
| 最小纵切 | 仅知道需实现10 Command | PH-03先闭合intake / identity全层纵切 | 尽早验证metadata、UoW、replay、audit和entry方向 |
| Safety | 容易并入run happy path末尾 | PH-07独立failure / control / cleanup / redline纵切 | 安全红线是一等能力,非后补运维 |
| Read / async / operations | 容易按Query / Consumer / Job对象堆叠 | PH-09 read、PH-10 consumer / relay、PH-11 jobs分别形成owner边界增量 | 分别验证no-write、no-rollback和no-repair |
| Consistency | 容易随各phase零散后遗漏全量race | PH-12在增量测试后做跨flow hardening | 汇合55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN、19 race |
| P0-Q | candidate未选导致模糊挂起 | PH-QP前置准备 + PH-11真实qualification | 不阻塞P0-C,也不允许release绕过P0-Q |
| Evidence | 可能最后静态补报告 | PH-02建立writer基础,各phase产生producer能力,PH-12 /13形成source writer,PH-14只做真实聚合 | 防止静态EV / pass |

### 5.2 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| 按七crate横向拆phase | 与目录一一对应 | 无独立业务能力,后续phase才能验证前序代码 | 不采用 |
| 将10 Command全部放一个phase | 顺序简单 | phase过大,coherent boundary / safety风险被淹没 | 不采用 |
| 按五个核心能力纵切并分离read / consumer-relay / operations / consistency | 每步有明确AC和test slice | Step 6需跨crate拆多个boundary | 采用 |
| candidate准备完全前置并阻塞PH-02 | 最早确定产品 | 外部决策阻塞所有P0-C学习 | 不采用 |
| candidate完全放在release前临时处理 | P0-C推进快 | 风险发现过晚,容易被fake替代 | 不采用 |
| PH-QP持续准备 + PH-13独立qualification | 正交推进且在release前硬汇合 | 需要明确准备不是实现 /通过事实 | 采用 |
| 把ledger / skeleton排在release后作为代码phase | 看似覆盖DOC交付 | 实现开工前缺恢复与授权入口,顺序倒置 | 不采用;改为`HDO-SBX-00`实现前门禁 |

---

## 6. 结构化中间产物

### 6.1 阶段依赖图: L4-sandbox实施阶段顺序

```text
[HDO-SBX-00 正式07 / Implementation Ledger / Planned Skeleton]
  | authorizes
  v
[PH-01 实现开工与仓基础]
  | enables
  +-------------------- prepares -------------------> [PH-QP P0-Q外部准备支线]
  |                                                    | supplies
  v                                                    |
[PH-02 Contract / Persistence / Harness Kernel]        |
  | enables                                            |
  v                                                    |
[PH-03 Strict Config / Profile / Runtime Assembly]     |
  | enables                                            |
  v                                                    |
[PH-04 受理与Execution Identity纵切]                    |
  | depends_on                                         |
  v                                                    |
[PH-05 Coherent Boundary纵切] <--- design_check -------+
  | depends_on
  v
[PH-06 Policy与Launch Enforcement纵切]
  | depends_on
  v
[PH-07 Run / Capture / Handoff纵切]
  | depends_on
  v
[PH-08 Failure / Control / Cleanup / Redline纵切]
  | enables
  +------------------------+
  |                        |
  v                        v
[PH-09 Query / Read]    [PH-10 Consumer / Event Relay]
  |                        |
  +-----------+------------+
              | converges
              v
[PH-11 Operations Jobs]
  | depends_on
  v
[PH-12 P0-C一致性与协议全量加固]
  | depends_on
  +--------------------------+
                             |
[PH-QP] -- activation_input -+--> [PH-13 P0-Q Candidate Qualification]
                                  | enables
                                  v
                             [PH-14 Gate / Report / Release汇总]
```

关键说明:

- 图表达实施依赖和汇合点,不表达函数调用链或commit数量。
- HDO-SBX-00不是实现phase;它由设计文档Step 13同步创建正式`07`、项目implementation ledger和全部planned boundary skeleton,并在PH-01前授权唯一current boundary。
- PH-QP只准备candidate ADR、capability / lifecycle / capture / release契约、ENV-05与适用material identity;它不创建candidate实现、probe结果或资格通过事实。
- PH-09与PH-10在phase依赖层都后置于PH-08;Step 6为保证项目ledger只有一个current boundary,将实现 /验证 /提交线性化为`09A -> 09B -> 10A -> 10B`,PH-11随后消费二者,PH-12再完成跨flow一致性加固。
- PH-13必须同时消费PH-05~08形成的正式语义、PH-12的完整harness和PH-QP固定的资格identity;缺任一项只能Blocked且0 launch。
- PH-14只聚合MAIN-CONTRACT、MAIN-SEAM、OPS和P0Q固定source,不得新增实现功能。

### 6.2 阶段总表

| Phase | 阶段名称 | 可验证实施目标 | 依赖 / 并行关系 | 核心交付物 | Planned阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 实现开工与仓基础 | 使目标仓、git / Rust / core依赖、七crate骨架和恢复规则达到可开始代码boundary的状态 | HDO-SBX-00;PH-QP可在完成后启动 | CODE-001基础;PRE-002~004关闭路径;future scratch入口 | Activation / Design / Scope / Worktree precheck;Cargo metadata / dependency direction / naming / local git;无业务通过声明 |
| PH-02 | Contract / Persistence / Harness Kernel | 建立shared typed carrier、canonical digest、UoW / version / cursor、三通道replay store的semantic fake及deterministic test kernel | PH-01 | CODE-002 /004 /005基础;DATA-001 /002基础;EVD-001 canonical primitive | SUITE-001 targeted;CTR-001~006;UoW / replay fixture self-test;dependency / redaction check |
| PH-03 | Strict Config / Profile / Runtime Assembly | 建立单一raw owner、40组 / I001~I101 / D01~D44、validator、material descriptor、P01~05 eligibility和complete generation assembly | PH-02 | CFG-001~006;ADP-001 registry;DATA-002 config corpus;runtime builder | SUITE-003 /008 targeted;CFG-001~030;ARCH-001~003;ESLOT-013 /014 /016 planned producer |
| PH-04 | 受理与Execution Identity纵切 | 打通`OpenControlledExecutionContext`从entry到committed truth / stored replay / audit / relay / stale marker的最小纵切 | PH-03 | CODE-003~007适用;intake states / errors;Command 1;对应query / event carrier | SUITE-002 /004 targeted;CMD-001/002;STA-001~003;AC-006~008;ESLOT-002 |
| PH-05 | Coherent Boundary纵切 | 形成resource / filesystem / network / process同代整体decision、handle与lease,unsupported时0 launch / no weak fallback | PH-04;消费PH-QP契约线索但不要求candidate实例 | CODE-003~005 /009~011适用;Command 2;backend capability controlled seam | SUITE-002 /004 /008 targeted;CMD-003/004;AC-009~011;ESLOT-003;P0-C only |
| PH-06 | Policy与Launch Enforcement纵切 | 形成body-free policy / authorization snapshot、high-risk decision和launch前统一fail-closed gate | PH-05 | Command 3;policy port / fake;state / error / audit / replay | SUITE-002 /004 /010 targeted;CMD-005/006/008;AC-012~015;ESLOT-004 |
| PH-07 | Run / Capture / Handoff纵切 | 在accepted identity + coherent boundary + policy下启动run,如实记录capture并安全handoff,失败不回滚source truth | PH-06 | Commands 4~6;candidate material refs;capture / handoff adapter fake;events / markers适用 | SUITE-002 /004 /008 /010 targeted;CMD-007~012;AC-016~019;ESLOT-005 |
| PH-08 | Failure / Control / Cleanup / Redline纵切 | 将failure classification、control、lease / orphan、cleanup guard和redline containment作为正式安全收束能力 | PH-07 | Commands 7~10;safety state / error;guard / investigation seam;reaper基础 | SUITE-002 /004 /010 /012 targeted;CMD-013~020;AC-020~023;ESLOT-006 |
| PH-09 | Query / Projection / Audit Read纵切 | 交付13 Query、projection / derived / comparison / reconciliation / audit read surface并证明write set为0 | PH-08;Step 6要求PH-09两个boundary handoff后才激活PH-10 | CODE-002 /004~006适用;13 Query;read stores / views / page / marker | SUITE-004 /011 /014 targeted;QRY-001~026;AC-032 /036~041适用;ESLOT-007 |
| PH-10 | Consumer / Event Relay纵切 | 交付9 Consumer与13 Event的authority、dedup、receipt、stored payload、relay retry / dead-letter和source no-rollback | PH-08;与PH-09共享契约冻结后可并行 | CODE-004 /005 /007 /009;Consumer / Event全族;publisher / relay adapter | SUITE-005 /008 /011 targeted;CNS-001~022;EVT-001~015;ESLOT-008 /009 |
| PH-11 | Operations Jobs纵切 | 交付10 Job的selection、per-item UoW、stored report replay、partial failure及projection / safety / relay maintenance no-repair | PH-09 + PH-10 | CODE-004 /005 /008 /009;Job全族;maintenance adapter与report | SUITE-006 /012;JOB-001~012;AC-022 /023 /030 /036~041适用;ESLOT-007 /009 /010 |
| PH-12 | P0-C一致性与协议全量加固 | 汇合所有P0-C flow,完成55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN、19 race、config / redaction / architecture和237条P0-C主归属 | PH-11 | CODE-009~012;TEST-001 /002 /005;AUTO check基础;EVD-002 P0-C catalog | SUITE-001~012 +014 +016;MAIN-CONTRACT / MAIN-SEAM / OPS候选能力;ESLOT-001~016;不产生真实pass事实 |
| PH-13 | P0-Q Candidate Qualification | 实现单一concrete candidate binding并以固定PROFILE-05 / ENV-05 packet执行13 CONF资格路径 | PH-12 + PH-QP;candidate / environment前置必须关闭 | ADP-002;TEST-004;DATA-003;qualification writer;ESLOT-017~019 producer | SUITE-013 / GATE-P0Q;CONF-001~013;AC / VETO适用;identity缺失Blocked且0 launch |
| PH-14 | Gate / Report / Release汇总 | 收口随前序phase形成的17脚本、7 gate和九schema /21 slot producer,实现四source RELEASE聚合与acceptance draft生成 | PH-12 + PH-13 | TEST-003;AUTO-001~003;EVD-001~005;release / report / draft capability | SUITE-001~016适用;GATE-PR / MAIN / OPS / P0Q / RELEASE / P1 / SCOPE;report audit / 17 VETO可判定 |

### 6.3 实现前Handoff Gate

| Gate | 创建时机 | 必需输入 | 必需输出 | 放行条件 | 禁止事项 |
|---|---|---|---|---|---|
| HDO-SBX-00 | 设计文档Step 13,任何PH-01实现动作之前 | 已审查Step 1~12;Step 6 Boundary Gate Matrix;真实design baseline由用户决定后记录 | DOC-001正式`07`;DOC-002项目implementation ledger;DOC-003全部planned boundary skeleton | 恰好一个current boundary,未来boundary均`planned / wait_until_current`;required reads / scope / checks完整;无伪pass / commit / run / EV | 实现agent自行生成boundary ID;只创建当前skeleton;在baseline未固定或gate未授权时创建目标仓 /改代码 |

### 6.4 P0-Q外部准备支线

`PH-QP`是阶段依赖图中的准备支线,不是可宣称完成P0能力的代码phase,也不计入PH-01~14编号闭集。它可在PH-01后并行推进,但其输出只能作为PH-05设计核对和PH-13开工前置。

| 准备包 | 最早开始 | 最迟关闭 | 需要形成 | 不允许形成 |
|---|---|---|---|---|
| QP-01 candidate ADR与责任边界 | PH-01后 | PH-13开工前 | 单一产品选择、owner、版本 / revision、SDK / process boundary和no compile leakage裁决 | 用历史README、Docker / gVisor示例或实现者偏好代替ADR |
| QP-02 capability / boundary template契约 | PH-01后 | PH-05设计核对;PH-13前固定 | resource / fs / network / process能力、unsupported / stale、launch / inspect / release包络 | partial capability被解释为coherent |
| QP-03 ENV-05与qualification identity | PH-03后 | PH-13开工前 | dedicated lab、candidate、profile、generation、template、provider适用性和immutable manifest identity | 真实`run_id`、预填CONF结果或复用ENV-02~04 |
| QP-04 capture / cleanup / redline / material契约 | PH-03后 | PH-13开工前 | capture / inspect、timeout / kill、lease / orphan、guarded release、teardown和适用material provider边界 | raw output / secret进入设计仓,或以fake证明真实lifecycle |

### 6.5 Phase Gate契约

`PHG-SBX-*`是phase完成检查ID,不是正式`05`的`GATE-SBX-*`运行门禁,也不是已执行结果。Step 7必须将每个PHG展开为exact suite / TC / AC / evidence requirement;Step 6必须把PHG拆入对应commit boundary的Build / Test / Evidence / Handoff Gate。

| Phase Gate | 适用Phase | 必需检查能力 | 完成判定 | 失败 / 暂停 |
|---|---|---|---|---|
| PHG-SBX-01 | PH-01 | HDO读取、target / git / version / core / Cargo / naming / dependency | workspace与依赖图可机械检查,无业务claim | 任一前置未固定则phase未开始 |
| PHG-SBX-02 | PH-02 | carrier / digest、UoW / replay fake、deterministic kernel、script / schema primitive | targeted contract / fixture checks可独立执行 | canonical / Shell / shared type缺口阻断 |
| PHG-SBX-03 | PH-03 | strict source / schema / validator / generation / profile / material / assembly | invalid为0 publication,valid为complete set | partial / fallback / unsafe material立即阻断 |
| PHG-SBX-04 | PH-04 | intake / identity纵切、UoW、replay、audit、stored relay / result | CMD / state / negative / rollback targeted slice完整 | 后续Query / publisher不得作为通过前置 |
| PHG-SBX-05 | PH-05 | four-dimension coherent decision、handle / lease、no weak fallback | P0-C semantic boundary正反向可判定 | candidate真实结果仍Blocked / NotEvaluated |
| PHG-SBX-06 | PH-06 | policy / high-risk fail-closed、backend call budget=0 | missing / stale / conflict / unsupported均无launch | 任何local allow / old decision复用阻断 |
| PHG-SBX-07 | PH-07 | run / capture / handoff owner分离与no rollback | complete / partial / failed / retryable如实可判定 | raw body / truth升格 / source rollback阻断 |
| PHG-SBX-08 | PH-08 | failure / control / cleanup / redline guard | non-Allowed release=0,containment不advisory | early delete / auto-release / unknown success阻断 |
| PHG-SBX-09 | PH-09 | 13 Query / views / page / marker / write-audit | 13 /13 surface且write=0 | finder缺失scan / repair / cursor混同阻断 |
| PHG-SBX-10 | PH-10 | 9 Consumer /13 Event、receipt / relay / stored payload | 9 /9 +13 /13,source no-rollback | authority / body / dedup / payload source违规阻断 |
| PHG-SBX-11 | PH-11 | 10 Job、selection / per-item / report / replay / no-repair | 10 /10,partial诚实且duplicate owner calls=0 | job修truth / hidden partial / failed no-report阻断 |
| PHG-SBX-12 | PH-12 | 237 P0-C、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38 error、14 TXN、19 race及MAIN / SEAM / OPS writer | P0-C source run能力与checks完整,不预写结果 | orphan、race不确定、source role混用或fake parity失败阻断 |
| PHG-SBX-13 | PH-13 | candidate preflight、13 CONF、P0Q writer、identity / redaction / cleanup | fixed packet可执行;缺identity时诚实Blocked且0 launch | substitution / leak / no disposition阻断 |
| PHG-SBX-14 | PH-14 | 17脚本、7 gate、九schema、21 slot、四source aggregation、report / draft audit | 缺source保持Blocked;完整source可生成可审查packet | 静态EV / pass、source改写、路径漂移阻断 |

---

## 7. Phase可验证增量说明

以下各phase描述未来实施完成门禁。`PassDesign`只表示阶段边界在本Step可审查,不表示对应代码、测试、run或验收已经完成。

### 7.1 PH-01 实现开工与仓基础

| 项 | 内容 |
|---|---|
| 功能增量 | 从无目标实现仓转为有正式恢复入口、可识别七crate、依赖方向和本地git身份的最小workspace。 |
| 输入 /前置 | HDO-SBX-00已完成;PRE-SBX-001~004适用;正式`03`§3~§4;目录 / Rust /依赖规范。 |
| 输出 | 目标仓、root Cargo和七member skeleton;package / crate / binary命名;target edition / rust-version;固定`core-contracts`revision / path;项目git config;implementation scratch入口。 |
| 不包含 | DTO、domain object、service、adapter业务行为、测试结果、CI、artifact / report或candidate产品实现。 |
| 验证方式 | planned `PHG-SBX-01`:目录 /命名检查、Cargo metadata / dependency direction、空skeleton check、本地git config回读、用户改动保护检查。 |
| 验收 /证据边界 | 只为AC-SBX-031 ARCH-SLICE和VETO-SBX-016提供未来build / graph producer基础;不产生runtime evidence。 |
| 不得依赖后续 | 不得依赖PH-02 carrier、测试脚本或任何后续crate实现才能通过workspace检查。 |
| 暂停条件 | HDO缺失、design baseline未授权、target version未固定、core revision / API不兼容或目标路径偏离时暂停,不得先写代码后补前置。 |

### 7.2 PH-02 Contract / Persistence / Harness Kernel

| 项 | 内容 |
|---|---|
| 功能增量 | 建立所有纵切共用的typed carrier、metadata / digest、public status / error carrier、UoW / version / cursor / replay抽象和可重复测试kernel。 |
| 输入 /前置 | PH-01;正式`03`§5~§7 / §10 / §12;`05`§7 / §13;PRE-SBX-007 /008在首个script / canonical writer boundary前关闭。 |
| 输出 | DEL-SBX-CODE-002及CODE-004 /005共享trait基础;Namespace / Protocol builder;semantic UoW / idempotency / stored result fake kernel;RFC 8785 fixture;`run_ci_gate.sh`最小入口及dependency / redaction / no-static check最小入口。 |
| 不包含 | 任何Command业务handler、domain状态推进、raw config schema、runtime entry assembly、真实external adapter或EV alias。 |
| 验证方式 | planned `PHG-SBX-02`:SUITE-001 targeted;CTR-001~006;carrier roundtrip / missing field / ref-family / digest;fake staged commit / rollback / replay self-test;Shell lint与check safe-failure。 |
| 验收 /证据边界 | 形成ESLOT-001与ESLOT-011的producer primitive,支撑AC-SBX-031 /034 /035 /039 /040;slot仍不是EV实例。 |
| 不得依赖后续 | 测试只使用contract fixture和通用transaction kernel,不得要求PH-03 config、PH-04 domain service或PH-10 publisher。 |
| 暂停条件 | canonical JSON实现 /fixture不闭合、Shell规则未定、shared type缺失、UoW fake不能模拟rollback / version / replay时暂停。 |

### 7.3 PH-03 Strict Config / Profile / Runtime Assembly

| 项 | 内容 |
|---|---|
| 功能增量 | 将raw source严格解析为完整typed generation,验证40组 /101项 /44域、material descriptor、P01~05资格和adapter registry,只原子发布完整assembly。 |
| 输入 /前置 | PH-02;正式`04`§3~§12;P0 built-in registry;config / material negative corpus。 |
| 输出 | DEL-SBX-CFG-001~006;ADP-001 registry / availability基础;ConfigCorpusBuilder / sensitive corpus;runtime builder kernel;P01~04 deterministic composition和P05缺前置拒绝面。 |
| 不包含 | concrete candidate产品、真实secret / principal、fleet desired truth、hot reload / LKG / S07 / S08、尚未存在的业务service实例。 |
| 验证方式 | planned `PHG-SBX-03`:SUITE-003 /008 targeted;CFG-001~030、ARCH-001~003;strict parser、NCFG / FC / XVAL、complete generation、redaction、unsupported surface absence。 |
| 验收 /证据边界 | 建立ESLOT-013 /014 /016 planned producer,支撑AC-SBX-031 /034 /037 /038 /041和VETO-SBX-006~008 /016。 |
| 不得依赖后续 | builder kernel以本phase正式target / registry fixture验证原子性;不得等待PH-04 service或PH-13 candidate才能证明invalid generation不发布。 |
| 暂停条件 | 需要新增config key / default / source / profile / public state / port时`wait_design`;material进入ordinary config或P05 silent fallback时立即阻断。 |

### 7.4 PH-04 受理与Execution Identity纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 形成首个端到端可测写纵切:`OpenControlledExecutionContext`从API entry经resolver、UoW、idempotency、domain factory到truth / identity / audit / stored result / relay snapshot / stale marker同组commit。 |
| 输入 /前置 | PH-03;正式`03`的intake对象 / Command / flow /状态 /错误;controlled context resolver fake。 |
| 输出 | intake / identity domain truth与状态;Command 1 DTO / service / API handler;resolver port / fake;truth / audit / relay / result repositories;`SandboxExecutionContextChanged`stored payload基础。 |
| 不包含 | boundary、policy、backend launch、13 Query实现、relay publish worker、Consumer / Job或真实tools / runtime / member integration。 |
| 验证方式 | planned `PHG-SBX-04`:SUITE-002 /004 targeted;CMD-001/002、STA-001~003、TXN / RACE intake适用、ERR-014/015;accepted / rejected / unresolved / duplicate / rollback。 |
| 验收 /证据边界 | AC-SBX-006~008;ESLOT-002 /008 /010 /011 /015适用;VETO-SBX-001 /002 /005 /010 /013 /016检查面。 |
| 不得依赖后续 | 通过Command result、repository inspection和stored relay snapshot验证;不得等待PH-09 Query或PH-10 publisher / subscriber。 |
| 暂停条件 | context / identity字段无法1:1构造、resolver正文入仓、entry绕application、accepted group不能原子commit或duplicate重算时暂停。 |

### 7.5 PH-05 Coherent Boundary纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 形成`EstablishExecutionBoundary`纵切,以同一context / template / generation / capability建立四维整体decision、handle和lease;任一维不成立即整体拒绝且0 launch。 |
| 输入 /前置 | PH-04;正式boundary / capability / handle / lease对象与state;PH-QP的capability contract仅作设计核对;P0-C controlled backend fake。 |
| 输出 | Command 2全层纵切;boundary repositories / port / fake;coherent set、handle / lease state与typed errors;boundary event snapshot / audit / replay。 |
| 不包含 | 真实candidate probe、policy allow、run start、host fallback、partial handle或cleanup release。 |
| 验证方式 | planned `PHG-SBX-05`:SUITE-002 /004 /008 targeted;CMD-003/004、STA-004~009、ERR-006/007/027 /029 /030适用;unsupported / stale / unavailable / race / rollback。 |
| 验收 /证据边界 | P0-C slice AC-SBX-009~011、032 /037~041适用;ESLOT-003 /011~013 /015;P0-Q仍明确Blocked / NotEvaluated。 |
| 不得依赖后续 | 当前门禁只验证formal decision与semantic handle fake,不要求PH-13 candidate或CONF结果。 |
| 暂停条件 | QP capability暴露设计契约不支持的必需字段 /生命周期、四维无法同代绑定、weak fallback或lease owner冲突时回写设计。 |

### 7.6 PH-06 Policy与Launch Enforcement纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 形成`EvaluatePolicyExecution`纵切,消费body-free policy / authorization summary和high-risk refs,统一输出Accepted / Rejected / FailClosed / Blocked并保证非允许路径backend调用为0。 |
| 输入 /前置 | PH-05;正式policy对象 / state / error;policy summary controlled fake;shared replay / audit kernel。 |
| 输出 | Command 3全层纵切;policy snapshot / decision / high-risk decision;policy port / fake;safe audit、stored result、event snapshot和projection marker。 |
| 不包含 | Policy DSL / approval truth、本地allowlist、实际run launch、candidate真实unauthorized probe或runtime agent loop。 |
| 验证方式 | planned `PHG-SBX-06`:SUITE-002 /004 /010 targeted;CMD-005/006/008、CNS-007/008 fixture适用、STA-010~012、ERR-005;missing / stale / conflict / unsupported / duplicate。 |
| 验收 /证据边界 | AC-SBX-012~015、037~041适用;ESLOT-004 /008 /010 /012 /013 /015;VETO-SBX-004 /005 /013。 |
| 不得依赖后续 | 用backend call budget=0 / policy stored result验证enforcement,不得等待PH-07 run实现才证明fail-closed。 |
| 暂停条件 | 需要保存policy正文、由config / caller推断allow、trusted source绕guard或旧Accepted跨snapshot复用时阻断。 |

### 7.7 PH-07 Run / Capture / Handoff纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 在正式identity + boundary + policy前置下实现Start Run -> Record Capture -> Open Handoff,如实区分run、capture与handoff owner,delivery失败不回滚run / capture。 |
| 输入 /前置 | PH-06;正式run / capture / handoff state与flow;semantic backend / capture / material / observability handoff fake。 |
| 输出 | Commands 4~6全层纵切;run / capture / handoff truth;backend launch / capture / handoff adapter fake;body-free material refs、audit、stored event payload和replay。 |
| 不包含 | 真实candidate执行、Artifact / Observability truth、failure / cleanup / redline Command、retry Job或下游正式acceptance。 |
| 验证方式 | planned `PHG-SBX-07`:SUITE-002 /004 /008 /010 targeted;CMD-007~012、STA-013~015、ERR-009 /035~038、TXN / RACE适用;complete / partial / failed / retryable / no-rollback。 |
| 验收 /证据边界 | P0-C AC-SBX-016~019、032 /037~041适用;ESLOT-005 /008~012 /015;VETO-SBX-006 /009~011 /013。 |
| 不得依赖后续 | handoff retry / feedback可用formal outcome fake和stored marker验证;不得等待PH-10 Consumer或PH-11 retry Job。 |
| 暂停条件 | raw process output进入carrier、capture与handoff升格 /混同、backend调用发生在guard前、delivery失败回滚source或duplicate重做时阻断。 |

### 7.8 PH-08 Failure / Control / Cleanup / Redline纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 将Submit Control、Classify Failure、Evaluate Cleanup和Record Redline组成安全收束纵切,保证unknown不成功、non-Allowed release=0、redline非advisory并保留调查 /材料。 |
| 输入 /前置 | PH-07;正式failure / control / lease / orphan / cleanup / redline objects / states / errors;investigation / release controlled fake。 |
| 输出 | Commands 7~10全层纵切;safety truth与guard;release call budget / lifecycle marker;investigation handoff;safe audit / event snapshot / replay;reaper service primitive。 |
| 不包含 | 10 Job runner、真实backend teardown、正式investigation truth、operator console、force cleanup或risk acceptance。 |
| 验证方式 | planned `PHG-SBX-08`:SUITE-002 /004 /010 /012 targeted;CMD-013~020、STA-016~019、ERR-010/011、TXN / RACE safety适用;guard / containment / no early delete。 |
| 验收 /证据边界 | P0-C AC-SBX-020~023、032 /037~041适用;ESLOT-006 /010~012 /015;VETO-SBX-014 /015和安全相关VETO。 |
| 不得依赖后续 | 以direct service selection、release fake call trace和guard state验证,不得等待PH-11 reaper Job或PH-13真实lab。 |
| 暂停条件 | cleanup / release语义需要后补字段、普通receipt解除containment、failure改写run success、non-Allowed调用release或材料提前删除时阻断。 |

### 7.9 PH-09 Query / Projection / Audit Read纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 实现13 Query、read projection / derived / comparison / reconciliation / audit view与page / marker,在fresh / stale / missing / degraded场景保持write set为0。 |
| 输入 /前置 | PH-08;committed truth / audit / relay snapshots;ReadSurfaceSeedPlan;query access / visibility contract。 |
| 输出 | 13 Query DTO / service / API handler;projection / derived / reconciliation / audit repositories与views;read-only selector / page / marker映射。 |
| 不包含 | refresh、rebuild、retry handoff、cleanup release、reconciliation执行、storage scan或任何Query-triggered repair。 |
| 验证方式 | planned `PHG-SBX-09`:SUITE-004 /011 /014 targeted;QRY-001~026、STA-020~023、RACE-019;visible / empty / restricted / stale / degraded / missing及write audit=0。 |
| 验收 /证据边界 | AC-SBX-018 /020~023 /030 /032 /036~041适用;ESLOT-007 /008 /011 /015;VETO-SBX-009 /010 /012。 |
| 不得依赖后续 | 使用formal seed plan和已提交truth验证所有read surface,不得等待PH-10 Consumer marker或PH-11 maintenance Job实际生成数据。 |
| 暂停条件 | query需要新增selector / view字段、finder缺失导致全仓scan、page / truth cursor混同、任何write / audit append / repair发生时阻断。 |

### 7.10 PH-10 Consumer / Event Relay纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 实现9 Consumer和13 Outbound Event,闭合source authority / schema / forbidden body、dedup / receipt、reference / feedback marker、stored immutable payload和relay retry / dead-letter no-rollback。 |
| 输入 /前置 | PH-08;与PH-09冻结shared read / marker / view contract;正式consumer / event DTO、flow和relay state;controlled publisher / source fakes。 |
| 输出 | 9 consumer service / worker entry;13 event payload / append mapping;consumer receipt / stored result;relay repository / publisher worker;transport-neutral route binding。 |
| 不包含 | 10 public Operations Job runner、真实bus、下游truth、从current truth重建payload或consumer直接创建核心success。 |
| 验证方式 | planned `PHG-SBX-10`:SUITE-005 /008 /011 targeted;CNS-001~022、EVT-001~015、STA-024、RACE-014 /015;accepted / duplicate / delayed / quarantine / retry / dead-letter。 |
| 验收 /证据边界 | AC-SBX-008 /012 /015 /017~023 /031 /033 /037~041适用;ESLOT-008 /009 /010 /015 /016;VETO-SBX-005 /006 /009~013 /016。 |
| 不得依赖后续 | publisher loop在本phase可独立执行;不得等待PH-11 `PublishSandboxEventRelay` public job或真实subscriber。 |
| 暂停条件 | trusted source绕schema / guard、raw body持久化、receipt / dedup类型混同、payload非source tx snapshot、publisher失败回滚source时阻断。 |

### 7.11 PH-11 Operations Jobs纵切

| 项 | 内容 |
|---|---|
| 功能增量 | 实现10 Operations Job的typed input、selection / page、job idempotency、per-item UoW、stored report replay、partial failure以及relay / refresh / retry / reaper / projection / reconciliation no-repair。 |
| 输入 /前置 | PH-09 + PH-10;正式Job protocol / flow;maintenance repositories / adapters;ReadSurfaceSeedPlan / ReplaySeedPlan。 |
| 输出 | 10 Job DTO / application service / jobs binary;job report / item;maintenance selection / cursor;stored report replay;safe partial / degraded disposition。 |
| 不包含 | 修复context / boundary / policy / run / capture核心success、修改外部truth、隐藏partial failure、真实scheduler / durable bus或release结论。 |
| 验证方式 | planned `PHG-SBX-11`:SUITE-006 /012;JOB-001~012、STA-020~024 / job-report状态、TXN / RACE job适用;selection bounded、duplicate owner calls=0、partial逐item。 |
| 验收 /证据边界 | AC-SBX-018~023 /030 /032 /036~041适用;ESLOT-006~010 /013~015;VETO-SBX-009~015。 |
| 不得依赖后续 | 全部job用semantic stores / adapter fakes验证,不要求PH-12全量suite、PH-13 candidate或PH-14 reports。 |
| 暂停条件 | job需要新增业务truth、job_run_ref当idempotency key、failed无report、整批重跑副作用、projection / reconciliation修core truth时阻断。 |

### 7.12 PH-12 P0-C一致性与协议全量加固

| 项 | 内容 |
|---|---|
| 功能增量 | 汇合PH-02~11,补齐全55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38 typed error、14 TXN、19 deterministic race、config / architecture / redaction / structural boundedness及237条P0-C主归属。 |
| 输入 /前置 | PH-11;全部formal fakes / datasets / protocol manifests;Shell / RFC 8785前置已关闭;MAIN-CONTRACT / MAIN-SEAM / OPS source identity contract。 |
| 输出 | TEST-001 /002 /005完整case;SUITE-001~012 /014 /016 harness;5类protocol inventory;9个check能力基础;ESLOT-001~016 producer / manifest;P0-C gate source writer能力。 |
| 不包含 | candidate真实证明、PROFILE-06量化claim、真实release aggregation、acceptance verdict或以重跑覆盖失败。 |
| 验证方式 | planned `PHG-SBX-12`:全部237 P0-C主归属,SUITE-001~012 /014 /016,MAIN-CONTRACT / MAIN-SEAM / OPS exact split,coverage / protocol / dependency / redaction / pairing / blocked checks。 |
| 验收 /证据边界 | AC-SBX-006~041全部P0-C slice、AC-031双slice、17 VETO的P0-C producer和ESLOT-001~016可判定;不宣称runtime Pass。 |
| 不得依赖后续 | P0-C门禁必须在candidate缺失时仍能诚实输出自身状态;不得要求PH-13结果来掩盖P0-C缺陷或缺case。 |
| 暂停条件 | 任何协议 /状态 /错误 /TC孤儿、fake parity断裂、race不可重复、source role混用、Blocked归一skip / pass或需要改设计truth时暂停。 |

### 7.13 PH-13 P0-Q Candidate Qualification

| 项 | 内容 |
|---|---|
| 功能增量 | 将单一正式candidate绑定到`IsolationBackendPort`,以同一PROFILE-05 / ENV-05 / generation / template / provider packet执行13 CONF,证明真实四维、lifecycle、capture、cleanup / redline和anti-substitution。 |
| 输入 /前置 | PH-12 + PH-QP全部包;candidate ADR、dedicated lab、immutable qualification manifest、适用material provider和0-launch preflight。 |
| 输出 | ADP-002 concrete adapter;SUITE-013 / GATE-P0Q;qualification result writer;CONF-001~013 case / probe / teardown;ESLOT-017~019 producer。 |
| 不包含 | 多candidate市场 /自动选择、host / fake fallback、PROFILE-06 real-like、production / capacity / DR、静态资格报告或预填Passed。 |
| 验证方式 | planned `PHG-SBX-13`:identity preflight -> 13 CONF -> redaction / qualification identity / cleanup disposition checks;任一身份缺失或错配为Blocked / Failed且0 launch。 |
| 验收 /证据边界 | P0-Q适用AC-SBX-008~023 /031 /037~041、ESLOT-017~019和VETO-SBX-001~017适用predicate;真实结果只由future run产生。 |
| 不得依赖后续 | SUITE-013必须直接产出完整qualification raw / report;不得等待PH-14 generator补失踪probe、identity或teardown。 |
| 暂停条件 | candidate contract不支持正式四维 / capture / release、provider身份未闭合、任何substitution、raw泄漏、cleanup / containment无disposition时停止probe并保留Blocked / Failed。 |

### 7.14 PH-14 Gate / Report / Release汇总

| 项 | 内容 |
|---|---|
| 功能增量 | 收口前序phase已形成的5 gate +3 report +9 check脚本与source writer,完成7 gate触发语义、九machine schema /21 slot、fixed-run renderer、四source RELEASE聚合及acceptance draft。 |
| 输入 /前置 | PH-12 + PH-13;四source真实run / identity / digest在未来执行时提供;正式`05/06` evidence / acceptance contract。 |
| 输出 | AUTO-001~003;TEST-003;EVD-001~005完整能力;GATE-PR / MAIN / OPS / P0Q / RELEASE / P1 / SCOPE;run / suite / evidence reports和四份acceptance draft generator。 |
| 不包含 | 新业务功能 /协议 /状态 /配置、静态EV、人工review内容、风险接受、final verdict、runtime authorization或签署。 |
| 验证方式 | planned `PHG-SBX-14`:script contract / failure fixture、九schema / digest fixture、21 slot expected / missing、pairing / no-static / blocked propagation、四source顺序 / identity mismatch、report roundtrip audit。 |
| 验收 /证据边界 | 使18功能AC、架构 /协议 /状态 /NFR / evidence、17 VETO和最终决策具备future可消费packet;generator不得自己裁决Pass。 |
| 不得依赖后续 | PH-14是最后实现phase;所有输入缺失必须如实Blocked / missing,不得指向“后续手工补报告”。 |
| 暂停条件 | script从路径猜identity、缺raw仍分配EV、修改source status、静态写pass /签署、acceptance / review路径漂移或任何report回显敏感正文时阻断。 |

---

## 8. Phase停审记录

### 8.1 逐Phase停审

| Phase | 可验证增量检查 | 依赖 / 后续越界检查 | 门禁可执行性 | 设计停审结论 | 缺口 / 修正 |
|---|---|---|---|---|---|
| PH-01 | workspace / dependency / naming可独立检查 | HDO前置;不依赖业务代码 | exact precheck可定义 | PassDesign | target repo / version / core revision仍是实际开工前置 |
| PH-02 | carrier / UoW fake / harness kernel可独立测 | 不等待config / domain service | CTR + fixture self-test明确 | PassDesign | Shell与RFC 8785在受影响boundary前关闭 |
| PH-03 | strict config到complete assembly可独立测 | 用formal target fixture,不等待业务service | CFG / ARCH与SUITE-003 /008明确 | PassDesign | material provider产品未选不影响descriptor / rejection测试 |
| PH-04 | intake / identity端到端最小纵切 | 不等待Query / publisher | CMD / STA / TXN / AC-006~008明确 | PassDesign | 无 |
| PH-05 | coherent boundary P0-C纵切 | 不等待candidate CONF | CMD / STA / ERR / AC-009~011明确 | PassDesign | QP契约差异触发design check,不允许实现私补 |
| PH-06 | policy / high-risk fail-closed纵切 | backend call budget验证,不等run phase | CMD / ERR / AC-012~015明确 | PassDesign | 无 |
| PH-07 | run / capture / handoff owner分离纵切 | 不等待feedback consumer / retry job | CMD / STA / ERR / AC-016~019明确 | PassDesign | 无 |
| PH-08 | safety closure纵切 | 不等待reaper job /真实lab | CMD / guard / release call trace明确 | PassDesign | 无 |
| PH-09 | 13 Query no-write read surface | seed plan替代后续maintenance生成 | QRY / write audit / AC / slot明确 | PassDesign | 与PH-10并行前先冻结shared marker contract |
| PH-10 | 9 Consumer +13 Event relay闭环 | 不等待public jobs /真实bus | CNS / EVT / relay tests明确 | PassDesign | 与PH-09并行不得改shared carrier |
| PH-11 | 10 Operations Job闭环 | 只消费已完成read / relay surface | JOB / partial / replay / no-repair明确 | PassDesign | 无 |
| PH-12 | 全量P0-C cross-flow hardening | candidate缺失不改变P0-C状态 | 237 TC /16中适用suite / checks明确 | PassDesign | 真实run仍不存在,不得写Passed |
| PH-13 | fixed candidate 13 CONF qualification | 必须等待PH-QP + PH-12,不等待report补洞 | SUITE-013 / P0Q / cleanup checks明确 | PassDesign | candidate / ENV-05当前open,未来可能Blocked |
| PH-14 | scripts / schema / RELEASE / draft生成 | 最终phase,无后续手工补洞 | 17脚本 /7 gate /9 schema /21 slot明确 | PassDesign | human review / verdict不属于实现交付 |

### 8.2 并行与汇合停审

| 关系 | 允许并行内容 | 必须先冻结 | 汇合门禁 | 设计结论 |
|---|---|---|---|---|
| PH-QP与PH-02~12 | ADR / lab / manifest / product contract准备 | `03/04/05` formal port / config / qualification schema;任何差异先回写 | PH-13 Design / Activation Gate | allowed_with_no_runtime_claim |
| PH-09与PH-10 | Query / read store vs Consumer / relay worker | contracts DTO、marker / cursor / view owner、repository trait、event payload source | PH-11 compile + integration;PH-12 consistency | allowed_after_contract_freeze |
| 其他PH-04~08 | 不并行主写链 | 前一phase truth / state / error / replay语义 | 下一phase开工Design Gate | sequential_required |
| PH-12与PH-13 | 不并行资格执行;QP准备可继续 | PH-12完整harness / source identity contract | PH-13 preflight | qualification_waits_for_p0c_harness |
| PH-14 | 不与未完成source producer并行宣称release | PH-12 P0-C producer + PH-13 P0-Q producer | RELEASE四source identity / digest | final_aggregation_only |

---

## 9. 跨Phase依赖闭环审计

### 9.1 Step 4交付物到Phase主归属

`主完成Phase`表示该交付物首次达到Step 4完成判定的位置;“增量形成”不允许前序phase宣称完整交付。DOC类交付物由HDO-SBX-00在实现前形成,不属于实现phase。

| Step 4交付物 | 增量形成Phase | 主完成Phase | 完成判定保持 | 审计结论 |
|---|---|---|---|---|
| DEL-SBX-CODE-001 | PH-01 | PH-01 | 七crate / binary可识别、依赖方向和only-core sibling可检查 | covered |
| DEL-SBX-CODE-002 | PH-02;PH-04~11补协议carrier | PH-12 | 55协议所需DTO / view / receipt / report / error roundtrip完整 | covered |
| DEL-SBX-CODE-003 | PH-04~08;PH-09~11只消费owner state | PH-12 | 30 owner machines /31 canonical enum entries /39 shared declarations / invariant / illegal / terminal inventory完整 | covered |
| DEL-SBX-CODE-004 | PH-02 kernel;PH-04~11各flow | PH-12 | 10 Command /13 Query /9 Consumer /10 Job orchestration和横切语义完整 | covered |
| DEL-SBX-CODE-005 | PH-02 kernel;PH-03 config;PH-04~11 adapter / store | PH-12 | repository / adapter / runtime builder parity与entry不下探 | covered |
| DEL-SBX-CODE-006 | PH-04 Command entry;PH-09 Query entry | PH-12 | 23 entry metadata / application call / safe error完整 | covered |
| DEL-SBX-CODE-007 | PH-04~08 fulfillment / control entry;PH-10 consumer / relay worker | PH-12 | worker authority、receipt、retry / quarantine与no-rollback完整 | covered |
| DEL-SBX-CODE-008 | PH-11 | PH-12 | 10 Job runner / binary、partial、stored replay和no-repair完整 | covered |
| DEL-SBX-CODE-009 | PH-04~11逐family | PH-12 | 10 +13 +9 +13 +10 =55 inventory及TC绑定完整 | covered |
| DEL-SBX-CODE-010 | PH-02 carrier;PH-03~11 producer / mapping | PH-12 | ERR-001~038 producer、safe mapping和恢复边界完整 | covered |
| DEL-SBX-CODE-011 | PH-02 kernel;PH-04~11增量race / TXN | PH-12 | 14 TXN、19 race、三通replay、no-write / no-repair / no-rollback完整 | covered |
| DEL-SBX-CODE-012 | PH-02 redaction primitive;PH-03~11 hooks | PH-12 | 全carrier safe audit / log / metric / report检查完整 | covered |
| DEL-SBX-CFG-001 | PH-03;后续只消费validated config | PH-03 | 单一raw owner、source selector与strict loader可测 | covered |
| DEL-SBX-CFG-002 | PH-03;PH-12 coverage复核 | PH-03 | 40组、I001~I101、D01~D44 typed schema / index完整 | covered |
| DEL-SBX-CFG-003 | PH-03;后续新增composition只消费formal validator | PH-03 | NCFG / FC / XVAL issue稳定且redacted | covered |
| DEL-SBX-CFG-004 | PH-03;PH-QP /13消费P05资格 | PH-03 | P01~05 eligibility、P06 conditional、P07 DesignReopen完整 | covered |
| DEL-SBX-CFG-005 | PH-03;PH-04~13消费complete set | PH-03 | complete generation、scoped snapshot和atomic assembly完整 | covered |
| DEL-SBX-CFG-006 | PH-03 descriptor / lifecycle;PH-QP /13绑定provider | PH-03 | 23 material slot与provider-neutral lifecycle、no raw carrier完整 | covered |
| DEL-SBX-ADP-001 | PH-03 registry;PH-04~11按能力补outcome | PH-12 | P01~04 formal fake / failure injection / UoW parity完整 | covered |
| DEL-SBX-ADP-002 | PH-QP准备;PH-13实现 | PH-13 | 单一candidate四维 / launch / capture / lease / release映射且无fallback | covered_with_open_activation_prerequisite |
| DEL-SBX-DATA-001 | PH-02 kernel;PH-03~13增量builder | PH-13 | 13类fixture / builder / schedule均可重复且identity隔离 | covered |
| DEL-SBX-DATA-002 | PH-02基础;PH-03~13逐family | PH-13 | 28 /28数据集、单违规和隔离清理完整 | covered |
| DEL-SBX-DATA-003 | PH-02 schema primitive;PH-QP fixed input;PH-13 | PH-13 | qualification / probe manifest绑定完整identity且无真实credential | covered_with_open_external_input |
| DEL-SBX-TEST-001 | PH-02~12形成237 P0-C;PH-13形成13 P0-Q;PH-14保留4 conditional contract | PH-14 | 254主归属唯一,conditional不补P0 | covered |
| DEL-SBX-TEST-002 | PH-02~12形成SUITE-001~012 /014 /016;PH-13形成013;PH-14形成015入口 | PH-14 | 16 /16 suite可执行或诚实Blocked / NotRunConditional | covered |
| DEL-SBX-TEST-003 | 各phase形成gate producer;PH-13形成P0Q runner;PH-14汇总 | PH-14 | 7 /7 gate触发、source / identity和失败传播完整 | covered |
| DEL-SBX-TEST-004 | PH-QP准备;PH-13 | PH-13 | CONF-001~013、identity / redaction / cleanup disposition完整 | covered_with_open_activation_prerequisite |
| DEL-SBX-TEST-005 | PH-02 kernel;PH-04~11增量;PH-12全量 | PH-12 | 14 TXN /19 RACE / replay / no-write专项完整 | covered |
| DEL-SBX-AUTO-001 | PH-02 `run_ci`;PH-11 operations;PH-13 P0Q;PH-14 release / P1 | PH-14 | 5 /5 gate脚本参数、context writer和nonzero语义完整 | covered |
| DEL-SBX-AUTO-002 | PH-02 report primitive;PH-14三入口收口 | PH-14 | 3 /3 report脚本只从fixed raw生成且不写裁决 | covered |
| DEL-SBX-AUTO-003 | PH-02 dependency / redaction / no-static基础;PH-12 /13补齐;PH-14收口 | PH-14 | 9 /9 check具备stable safe finding与阻断语义 | covered |
| DEL-SBX-EVD-001 | PH-02 canonical primitive;PH-03~13逐schema producer;PH-14收口 | PH-14 | 九schema、RFC 8785、digest / path / status fixture完整 | covered |
| DEL-SBX-EVD-002 | PH-02~12形成001~016;PH-13形成017~019;PH-14保留020 /021 | PH-14 | 21 /21 slot catalog和无pair不分配EV guard完整 | covered |
| DEL-SBX-EVD-003 | PH-02 writer primitive;PH-12 /13 source writer;PH-14完整pairing | PH-14 | fixed-run context / suite / case / log / checks真实生成契约完整 | covered |
| DEL-SBX-EVD-004 | PH-02 renderer primitive;PH-14 | PH-14 | run / suite / evidence human report只从fixed raw生成 | covered |
| DEL-SBX-EVD-005 | PH-14 | PH-14 | acceptance四draft生成与review入口分离,无结论 /签署 | covered |
| DEL-SBX-DOC-001 | Step 1~12形成章节输入;设计文档Step 13装配 | HDO-SBX-00 | 正式`07`在PH-01前完整且只含已审查计划 | covered_as_pre_implementation_handoff |
| DEL-SBX-DOC-002 | Step 3 /5 /6形成ledger输入;设计文档Step 13创建 | HDO-SBX-00 | 项目implementation ledger字段 / blockers / boundary index完整 | covered_as_pre_implementation_handoff |
| DEL-SBX-DOC-003 | Step 6形成全部boundary定义;设计文档Step 13创建 | HDO-SBX-00 | 每个boundary恰有一件planned skeleton,唯一current | covered_as_pre_implementation_handoff |

39 /39交付物均逐项有主完成位置。正式Step 6 boundary仍必须逐项引用适用`DEL-SBX-*`,不得只写phase名或类型范围。

### 9.2 核心能力与55协议覆盖

| 能力 /协议族 | Primary Phase | Supporting Phase | 数量 /完成门禁 | 不得前移 /后移的内容 |
|---|---|---|---|---|
| C-SBX-1受理与execution identity | PH-04 | PH-02 /03 /12 /13适用anti-substitution | Command 1;AC-006~008;intake / identity state;P0-Q anti-substitution | 不得在PH-01~03宣称受理完成;不得等PH-09 Query才验证 |
| C-SBX-2 coherent boundary | PH-05 P0-C;PH-13 P0-Q | PH-03 /12 /PH-QP | Command 2;四维同代;AC-009~011;CONF-001~006 | P0-C不得等candidate;P0-Q不得用fake补偿 |
| C-SBX-3 policy / launch enforcement | PH-06;launch调用在PH-07 | PH-03 /12 /13 | Command 3;fail-closed;high-risk;AC-012~015 | policy gate先于run;不得让PH-07重新定义policy |
| C-SBX-4 run / capture / handoff | PH-07 P0-C;PH-13 P0-Q | PH-10 feedback;PH-11 retry;PH-12 | Commands 4~6;AC-016~019;CONF-007 /008 /013 | feedback / retry只改marker,不重新拥有source truth |
| C-SBX-5 failure / cleanup / redline | PH-08 P0-C;PH-13 P0-Q | PH-10 feedback;PH-11 jobs;PH-12 | Commands 7~10;AC-020~023;CONF-009 /010 /013 | safety不得后置为operations辅助;Job不得修core truth |
| Command | PH-04~08 | PH-12 inventory;PH-13 real slices | 10 /10;CMD-001~020 | 每个Command在其能力phase形成全层纵切 |
| Query | PH-09 | PH-12 inventory | 13 /13;QRY-001~026;write=0 | 不得由PH-11 job补Query repair |
| Inbound Consumer | PH-10 | PH-12 inventory | 9 /9;CNS-001~022 | 不得创建核心success或绕formal command |
| Outbound Event | PH-10 | PH-12 inventory | 13 /13;EVT-001~015 | payload必须来自source tx snapshot,发布失败不回滚 |
| Operations Job | PH-11 | PH-12 inventory;PH-13 lifecycle适用 | 10 /10;JOB-001~012 | 不得把private worker loop冒充public Job或修truth |

### 9.3 Suite与Gate Phase映射

| Suite / Gate | 首次可执行Phase | 完整门禁Phase | Phase作用 | 真实性边界 |
|---|---|---|---|---|
| SUITE-SBX-001 | PH-02 | PH-12 | carrier / metadata / digest / redaction | 设计fixture不等runtime evidence |
| SUITE-SBX-002 | PH-04 | PH-12 | 30 owner machines /31 canonical enum entries随能力增量进入，39 shared declarations同步核名 | 未实现owner不得用占位variant算覆盖 |
| SUITE-SBX-003 | PH-03 | PH-12 | config / security / ARCH | target缺失时ARCH只能Blocked |
| SUITE-SBX-004 | PH-04 | PH-12 | 10 Command +13 Query | Query直到PH-09才完整 |
| SUITE-SBX-005 | PH-10 | PH-12 | 9 Consumer +13 Event relay | MAIN-CONTRACT / MAIN-SEAM分run |
| SUITE-SBX-006 | PH-11 | PH-12 | 10 Job / partial / replay | report不得隐藏failed item |
| SUITE-SBX-007 | PH-02 kernel;PH-04增量 | PH-12 | 14 TXN / three-channel replay | 三channel直到PH-11才完整 |
| SUITE-SBX-008 | PH-03 | PH-12 | repository / adapter parity | durable未激活不阻塞formal fake parity |
| SUITE-SBX-009 | PH-04增量 | PH-12 | 19 deterministic race | PH-12必须双顺序全量 |
| SUITE-SBX-010 | PH-04增量 | PH-12 | 38 typed error / recovery | 不得按字符串统计 |
| SUITE-SBX-011 | PH-09 /10 | PH-12 | 55 entry / protocol inventory | Job入口待PH-11,PH-12才55 /55 |
| SUITE-SBX-012 | PH-08 /11 | PH-12 | operations simulation | 不证明真实lifecycle |
| SUITE-SBX-013 | PH-13 | PH-13 | 13 CONF candidate conformance | identity缺失Blocked且0 launch |
| SUITE-SBX-014 | PH-09 | PH-12 | structural boundedness | 无量化SLO claim |
| SUITE-SBX-015 | PH-14入口 | PH-14 conditional | PROFILE-06 selected-run | 未激活`NotRunConditional`,不补P0 |
| SUITE-SBX-016 | PH-03 | PH-12 /14 scope check | future surface absence | 命中新surface先DesignReopen |
| GATE-SBX-PR | PH-02增量 | PH-14 | 每phase受影响fast checks | 不替代MAIN |
| GATE-SBX-MAIN | PH-12 | PH-14 | MAIN-CONTRACT + MAIN-SEAM source | 两role不同run且不得混profile |
| GATE-SBX-OPS | PH-11增量 | PH-14 | ENV-04 operations source | 不证明candidate |
| GATE-SBX-P0Q | PH-13 | PH-14 | ENV-05 qualification source | Blocked不能映射skip / N/A |
| GATE-SBX-RELEASE | PH-14 | PH-14 | 四source固定顺序聚合 | 缺任一source不得形成release pass |
| GATE-SBX-P1 | PH-14 conditional | PH-14 conditional | selected PROFILE-06 | 未激活不影响P0但不产量化结论 |
| GATE-SBX-SCOPE-REOPEN | PH-03起 | PH-14 | future / unsupported surface检查 | 命中后暂停并回写设计 |

### 9.4 Planned Evidence Slot到Phase映射

| Slot范围 | Producer Phase | 聚合Phase | 证明面 | 当前事实 |
|---|---|---|---|---|
| ESLOT-SBX-001 CONTRACT | PH-02;PH-12补全family | PH-14 | carrier / digest / body-free | planned_only |
| ESLOT-SBX-002 INTAKE | PH-04;PH-12加固 | PH-14 | intake / identity | planned_only |
| ESLOT-SBX-003 BOUNDARY | PH-05;PH-12加固 | PH-14 | coherent boundary P0-C | planned_only |
| ESLOT-SBX-004 POLICY | PH-06;PH-12加固 | PH-14 | policy / launch fail-closed | planned_only |
| ESLOT-SBX-005 EXECUTION | PH-07;PH-12加固 | PH-14 | run / capture / handoff | planned_only |
| ESLOT-SBX-006 SAFETY | PH-08;PH-11 /12补强 | PH-14 | failure / control / cleanup / redline | planned_only |
| ESLOT-SBX-007 READ | PH-09;PH-11 maintenance补强 | PH-14 | no-write / reconciliation | planned_only |
| ESLOT-SBX-008 PROTOCOL | PH-04~11增量;PH-12全量 | PH-14 | 55 /55 inventory | planned_only |
| ESLOT-SBX-009 RELAY | PH-10;PH-11 publish Job补强 | PH-14 | stored payload / no rollback | planned_only |
| ESLOT-SBX-010 REPLAY | PH-02 kernel;PH-04~11三通闭合;PH-12加固 | PH-14 | duplicate / stored result | planned_only |
| ESLOT-SBX-011 CONSISTENCY | PH-02 kernel;PH-04~12增量 /全量 | PH-14 | UoW / race / winner | planned_only |
| ESLOT-SBX-012 ERROR | PH-04~12 producer /全量 | PH-14 | 38 typed error / recovery | planned_only |
| ESLOT-SBX-013 CONFIG | PH-03;PH-12补cross-flow | PH-14 | strict config / generation | planned_only |
| ESLOT-SBX-014 CHANGE | PH-03;PH-12补cross-flow | PH-14 | change / rollback / drift honesty | planned_only |
| ESLOT-SBX-015 AUDIT | PH-04~12增量 | PH-14 | formal audit / redaction | planned_only |
| ESLOT-SBX-016 ARCH | PH-01 /03;PH-12全图 | PH-14 | dependency / absence | planned_only |
| ESLOT-SBX-017 QUAL-BOUNDARY | PH-13 | PH-14 | real four-dimension boundary | planned;activation inputs open |
| ESLOT-SBX-018 QUAL-LIFECYCLE | PH-13 | PH-14 | real lifecycle / cleanup / redline | planned;activation inputs open |
| ESLOT-SBX-019 QUAL-IDENTITY | PH-13 | PH-14 | qualification identity / anti-substitution | planned;activation inputs open |
| ESLOT-SBX-020 REAL-LIKE | PH-14 conditional入口 | PH-14 conditional | PROFILE-06 | `NotRunConditional` design contract |
| ESLOT-SBX-021 SCOPE | PH-03 absence primitive;PH-14 scope gate | PH-14 | future scope / reopen | conditional / inactive design contract |

Slot producer、schema writer和report renderer是交付能力;表中没有创建`EV-SBX-*`、`run_id`、artifact、report、review或通过结论。

### 9.5 Phase Boundary闭环审计

| 审计项 | 结论 | 审计依据 | 缺口 / 修正 |
|---|---|---|---|
| 顺序是否由依赖驱动 | passed | handoff -> workspace -> carrier / transaction -> config assembly -> core write chain -> read / async -> jobs -> hardening -> qualification -> aggregation | 无 |
| 是否按crate /对象 /函数裸拆 | passed | PH-04~11均跨contracts / domain / application / infra / entry形成能力纵切;PH-01~03也有独立机械门禁 | 无 |
| 字段 / DTO构造闭环 | passed_design | 每个protocol在primary phase回读`03`§6~§8,PH-12做55 /55 inventory | Step 6逐boundary列exact DTO owner章节,不得只写phase名 |
| Ref / metadata / digest闭环 | passed_design | PH-02先固定typed carrier / canonical primitive,PH-04~14只消费 | RFC 8785库 /工具仍需对应boundary前固定 |
| State / error闭环 | passed_design | PH-04~11随owner增量,PH-12做30 owner machines /31 canonical enum entries /39 shared declarations /38 error全量 | 实现发现新state / error必须`wait_design` |
| Read model闭环 | passed_design | PH-09定义no-write view,PH-11只做maintenance,PH-12审计second writer=0 | rich preview / analytics继续非范围 |
| Transaction / replay闭环 | passed_design | PH-02提供kernel,各写phase增量,PH-12执行14 TXN /19 race /三通replay | durable parity是P1 conditional,不削弱formal fake契约 |
| Config / adapter闭环 | passed_design | PH-03在业务纵切前完成strict generation / registry;PH-13只绑定已验证candidate | candidate / provider / ENV-05仍是PH-13 activation blocker |
| Artifact / evidence闭环 | passed_design | PH-02提供schema primitive,各phase提供producer,PH-14只聚合 | 不得把planned slot /报告路径写成runtime事实 |
| 当前phase是否依赖后续实现 | passed | 每个§7表均给出“不包括 /不得依赖后续”;PH-04 /05 /06 /07 /08 /09 /10 /11可用formal fake / seed独立验证 | 无 |
| P0-C / P0-Q是否互相替代 | passed | PH-12 / PH-13正交,PH-14硬汇合 | candidate缺失使release Blocked,不能删PH-13 |
| 外部依赖是否错误变compile dependency | passed | PH-01依赖检查 + PH-03 registry + PH-12 /14 check;仅core compile | 无 |
| Safety是否后置 | passed | failure / cleanup / redline为PH-08正式纵切,PH-11只消费guard做maintenance | 无 |
| Evidence /验收是否最后才临时补 | passed | producer / redaction / audit从PH-02起随能力形成,PH-14只收口 | 无 |
| Handoff顺序 | passed_after_correction | DOC-001~003由HDO-SBX-00在PH-01前形成,不再错误排在release后 | Step 13必须按此顺序同步创建 |
| Step 6粒度是否足够 | passed | 14 phase分别有明确输出 /门禁,可继续跨crate拆boundary | Step 6不得强制一phase一commit |

### 9.6 经验复核输入

本Step发现一项可复用顺序约束:implementation ledger和全部planned boundary skeleton虽然是实施计划“交付物”,其生命周期位置是任何实现phase之前的handoff gate,不是最后一个实现phase。该约束已经存在于实施计划SOP和Step 3台账门禁中,本Step只是正确应用,未发现需要新增通用标准 / SOP的缺口。Step 6必须保持HDO-SBX-00前置,并为全部boundary一次性提供skeleton输入。

---

## 10. 正式章节回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“Phase可验证增量说明”“Phase停审记录”和“跨Phase依赖闭环审计”,了解14个phase为何按能力纵切、P0-Q如何正交准备、每个phase为何不依赖后续实现,以及HDO-SBX-00为何必须位于实现开工前。

正式`07-实施计划.md` §5应收口为:

在任何实现phase之前,设计文档Step 13必须完成`HDO-SBX-00`:同步创建正式`07-实施计划.md`、项目级implementation ledger和Step 6定义的全部planned boundary skeleton,固定可复现design baseline,仅授权一个current boundary,其余保持`planned / wait_until_current`。缺任一项不得创建目标仓或修改代码。

实现按14个可验证能力phase推进:

```text
HDO-SBX-00
  -> PH-01 实现开工与仓基础
  -> PH-02 Contract / Persistence / Harness Kernel
  -> PH-03 Strict Config / Profile / Runtime Assembly
  -> PH-04 受理与Execution Identity
  -> PH-05 Coherent Boundary
  -> PH-06 Policy与Launch Enforcement
  -> PH-07 Run / Capture / Handoff
  -> PH-08 Failure / Control / Cleanup / Redline
  -> [PH-09 Query / Read || PH-10 Consumer / Event Relay]
  -> PH-11 Operations Jobs
  -> PH-12 P0-C一致性与协议全量加固
  -> PH-13 P0-Q Candidate Qualification
  -> PH-14 Gate / Report / Release汇总
```

PH-QP从PH-01后并行准备candidate ADR、四维capability / lifecycle / capture / release契约、ENV-05、provider / material适用性和immutable qualification identity。它不产生candidate代码或资格结果;PH-05只消费其契约线索做设计核对,PH-13开工前必须完整关闭。PH-09与PH-10的材料准备可在shared carrier、marker、cursor、repository和event snapshot契约冻结后交错进行,但Step 6已将实现、验证、提交和handoff固定为`09A -> 09B -> 10A -> 10B`;不得形成两个current boundary。

PH-04~08依次形成Sandbox五段核心写链,每个phase都必须同批闭合contracts、domain、application、infra / fake、entry、UoW / replay、audit、stored relay / result、projection marker和targeted tests,不得把横切完整性推给后续phase。PH-09严格no-write,PH-10严格consumer不创建核心success且relay no-rollback,PH-11严格job no-repair,PH-12完成55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN、19 race和237条P0-C全量加固。

PH-13只接受固定PROFILE-05 / ENV-05 candidate packet和13 CONF真实资格路径。任何candidate、generation、template、environment、provider / material或cleanup identity缺失时必须Blocked且0 launch,不得由P0-C fake、PROFILE-06或host替代。PH-14收口并全量验证随前序phase形成的17脚本、7 gate、九schema、21 slot和fixed-run producer,再实现按MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q顺序的RELEASE聚合;不得新增业务功能或静态制造EV、pass、风险接受、验收结论与签署。

每个phase完成后必须停审可验证增量、输入 /输出、non-scope、后续依赖、测试 /验收门禁和暂停条件。phase只定义功能增量;Step 6可将一个phase拆为多个commit boundary,不得机械采用“一phase一commit”。

---

## 11. 待确认事项与Blocker

| 事项 | 类型 | 是否阻塞Step 6讨论 | 当前Phase定位 | 最迟关闭位置 |
|---|---|---:|---|---|
| design baseline与HDO-SBX-00实例 | handoff blocker | 否 | phase链前置,当前只设计 | 文档Step 13 /任何PH-01动作前 |
| 目标实现仓创建策略 | planning decision | 否 | PH-01首个允许实现增量创建,不得在HDO前创建 | Step 6 PH-01首boundary固定 |
| target edition / rust-version | affected-boundary blocker | 否 | PH-01 | Step 6 PH-01 bootstrap boundary开工前design owner固定 |
| core revision / compatibility | affected-boundary blocker | 否 | PH-01 | 首个Cargo boundary前固定真实revision / worktree |
| Shell规则 / lint | automation blocker | 否 | PH-02最小script;PH-14完整脚本 | Step 6 /7首个script boundary前关闭 |
| RFC 8785实现库 /工具 | schema writer blocker | 否 | PH-02 canonical primitive | Step 6 /7对应boundary前关闭 |
| candidate ADR / product / revision | P0-Q activation blocker | 否 | PH-QP -> PH-13 | PH-13 Design / Activation Gate前关闭 |
| ENV-05 / provider / material identity | P0-Q execution blocker | 否 | PH-QP -> PH-13 | PH-13真实probe前关闭 |
| CI provider / binding | external integration decision | 否 | phase gate语义先独立,PH-14收口binding | Step 8或首个CI boundary前固定 |
| PROFILE-06 real-like | P1 conditional | 否 | PH-14只交付入口;未激活`NotRunConditional` | 只有正式claim激活后关闭 |
| retention物理策略 | conditional downstream | 否 | 各phase遵守condition guard,不发明TTL | future硬要求 / `09`运维设计 |

当前没有需要回写正式`00~06`才能进入Step 6的上游设计blocker。以上事项分别阻塞HDO、PH-01、PH-02、PH-13或未来真实执行;Step 6必须把它们绑定到exact boundary Activation / Design Gate,不能把open写成ready。

---

## 12. 自检与停审

| 自检项 | 结果 |
|---|---|
| 是否回答Step 5十项SOP问题 | 通过,10 /10 |
| 是否输出阶段依赖图 | 通过,HDO + PH-01~14 + PH-QP |
| phase是否按可验证能力而非对象 /文件拆分 | 通过 |
| 每个phase是否有输入、输出、不包含、验证、验收、后续依赖和暂停条件 | 通过,14 /14 |
| 是否逐phase停审 | 通过,14 /14均为设计层`PassDesign` |
| 是否明确并行与汇合 | 通过,PH-QP仅作准备支线;PH-09 /10的实现boundary按Step 6严格串行,PH-11 /12 /13 /14依次汇合 |
| Step 4交付物是否全覆盖 | 通过,39 /39有主完成位置 |
| 五个核心能力是否有P0-C / P0-Q去向 | 通过 |
| 55协议是否完整 | 通过,10 Command +13 Query +9 Consumer +13 Event +10 Job |
| 254 TC /16 suite /7 gate /17脚本 /21 slot是否有phase去向 | 通过 |
| 是否保持Query no-write / Consumer no-core-success / Job no-repair / relay no-rollback | 通过 |
| 是否把candidate未定当作删除P0-Q理由 | 否,PH-QP + PH-13 mandatory |
| 是否把ledger / skeleton错误排到release后 | 否,已修正为HDO-SBX-00实现前门禁 |
| 是否提前定义commit boundary /创建ledger / skeleton /正式07 | 否 |
| 是否伪造commit、run、EV、测试结果、风险接受、结论或签署 | 否 |

本Step已完成停审并经用户确认,由Step 6承接。正式`07`、implementation ledger、`implementation-boundaries/`和目标实现仓仍不得在Step 6创建。

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| phase顺序与依赖明确 | passed | HDO -> PH-01~14,含PH-QP准备支线;commit boundary由Step 6线性化 |
| 每个phase为可验证功能增量 | passed | 均有targeted tests / planned AC / slot和non-scope |
| 当前phase不依赖后续实现 /证据 | passed | 逐phase审计无后序硬依赖 |
| 跨phase交付物 /协议 /门禁覆盖完整 | passed | 39交付物、55协议、16 suite、7 gate、21 slot无orphan |
| 风险与外部依赖前置明确 | passed | open项均有phase / gate /最迟关闭位置 |
| 无阻塞Step 6的上游设计冲突 | passed | boundary级前置不阻塞Step 6设计 |
| 用户确认Step 5 | passed | 用户已明确“同意”,Step 6获得一次性放行。 |

```text
step_5_result = completed_reviewed_passed_to_step_6
pre_implementation_handoff_gate = HDO-SBX-00
implementation_phases = 14
parallel_preparation_lane = PH-QP
limited_parallel_preparation = PH-09,PH-10 materials_only
linear_commit_boundaries = CB-SBX-09A -> CB-SBX-09B -> CB-SBX-10A -> CB-SBX-10B
deliverables_mapped = 39_of_39
protocols_mapped = 55_of_55
suites_mapped = 16_of_16
gates_mapped = 7_of_7
planned_evidence_slots_mapped = 21_of_21
allow_step_6_discussion = yes_user_confirmed
allow_formal_07_assembly = no
allow_implementation_handoff = no
commit_required = no
```
