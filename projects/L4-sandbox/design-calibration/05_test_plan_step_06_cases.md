# Step 6. 设计测试场景与用例矩阵

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/测试方案书写规范.md` §5.6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_7
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 将`CUT / CBC-SBX-001~038`展开为254条正式测试设计`TC-SBX-*`,覆盖55协议、31个Step 10 canonical status enum entries、事务 /幂等 /竞态、38命名错误、FDT-01~30、安全carrier和P0-Q资格。TC是设计编号,不是已实现 /执行用例;PER仍是planned evidence requirement,不是EV / artifact / result。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 5并允许进入Step 6 | 是。用户审查Step 5后回复“同意”,本次只放行Step 6。 |
| 台账与flow是否允许进入 | 是。原恢复点为Step 5 `pass_wait_review`;用户确认后解除门禁。 |
| 是否读取Step 6标准 | 是。已读取测试SOP Step 6与书写规范§5.6,必须按切口输出场景、可执行用例、断言、停审和phase审计。 |
| 是否读取正式真相源 | 是。已复核正式`03`协议 / flow /状态 /事务 /错误 /并发及正式`04`配置 /安全 /failure handoff。 |
| 是否读取已确认Step 1~5 | 是。范围、CUT、L1~L6、CBC / PER成熟度和P0-Q阻塞保持不变。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact Step 6的协议逐项与横切矩阵结构,按sandbox 55协议和安全边界重建。 |
| 长文档处理 | 主文件 + 5个Step 6分件。所有文件均小于500行;分件只拆内容批次,不形成新Step。 |
| 当前状态 | 254条TC、38个CBC批次、逐切口停审、跨用例审计与回填草稿已完成设计静态同步;未声明已实现或执行。 |
| 上游blocker | 无阻塞Step 7设计的上游blocker。backend / lab / provider /目标仓缺失只阻塞相应用例执行。 |
| 停审 | 用户已确认Step 6;Step 7已据此完成。正式`05`仍不得修改。 |

## 2. 本步目标、非范围与分件索引

本Step完成:

1. 每个P0切口至少有正向主线、关键反向 /边界及适用状态 /事务 /恢复断言。
2. 55个协议逐项进入正式TC,不以E2E抽样替代。
3. 31个Step 10 canonical status enum entries、38个错误、19类race和FDT-01~30逐项case化；状态库同时保留30个owner-level state machines口径。
4. 每个TC绑定formal前置、输入 /操作、预期结果、字段 /状态 /副作用、自动化层级和PER。
5. P0-Q case可执行设计完整但状态保持execution blocked;conditional不补偿P0。

本Step不定义fixture / seed / builder /清理、环境 /产品 /lab拓扑、suite /命令 /CI、性能硬阈值、EV / artifact schema、测试结果或验收裁决;分别留Step 7~10 /13和新版`06`。

| 分件 | 覆盖 | TC数量 | 状态 |
|---|---|---:|---|
| `05_test_plan_step_06_cases_commands_queries.md` | shared carrier、10 Command、13 Query | 52 | reviewed_passed_with_step_06 |
| `05_test_plan_step_06_cases_consumers_events_jobs.md` | 9 Consumer、13 Event、10 Job | 49 | reviewed_passed_with_step_06 |
| `05_test_plan_step_06_cases_state_txn_race.md` | 31 Step 10 enum entries、14事务 /幂等、19 race | 64 | current_design_static_revalidated |
| `05_test_plan_step_06_cases_errors_recovery.md` | 38命名错误与恢复 | 38 | reviewed_passed_with_step_06 |
| `05_test_plan_step_06_cases_config_security_qualification.md` | 30 FDT、3 ARCH、13 P0-Q、5 conditional | 51 | reviewed_passed_with_step_06 |
| 总计 | 14个稳定前缀,无重复 | 254 | designed_not_executed |

## 3. ID、前置与成熟度规则

| 项 | 规则 |
|---|---|
| TC ID | `TC-SBX-<family>-<nnn>`是正式测试设计ID。一个ID只证明一个主要命题;后续实现可拆parameter row,不得换义复用。 |
| CBC | `CBC-SBX-nnn`保持Step 5 case batch candidate,本Step作为同序CUT的用例批次索引;不是TC或suite。 |
| 数据前置 | 本Step只写formal object state、version、port outcome、config集合或qualification identity类别;Step 7分配实际数据集。 |
| 自动化 | L1~L4 / static / deterministic race必须自动化;L5使用可重复harness,即使受控人工启动也不得自由文本裁决。 |
| planned evidence | TC只绑定`PER-SBX-*`;不创建`EV-*`、路径、run或结果。 |
| `designed` | 用例步骤和断言已设计,不表示实现 /执行 /pass。 |
| `designed_execution_blocked` | P0-Q或目标仓前置未形成;不能标N/A或由fake替代。 |
| `conditional_non_p0` | P1 / P2 / enhancement触发后执行;不补偿P0。 |

## 4. CBC-SBX-001~038用例批次总表

| CUT / CBC | 正式TC批次 | 场景覆盖 | 优先级 /层级 | formal数据前置类别 | PER | 停审状态 |
|---|---|---|---|---|---|---|
| CUT-SBX-001 / CBC-SBX-001 | TC-SBX-CTR-001~003/006;TC-SBX-EVT-014 | carrier roundtrip、required / enum / ref family / raw detail拒绝 | P0;L1/L4 | valid / invalid carrier family | PER-SBX-001 | designed_complete |
| CUT-SBX-002 / CBC-SBX-002 | TC-SBX-CTR-003~005;TC-SBX-TXN-010~013 | metadata、canonical digest、field distinction、cursor / version禁止混同 | P0;L1~L4 | metadata / key / cursor variants | PER-SBX-002 | designed_complete |
| CUT-SBX-003 / CBC-SBX-003 | TC-SBX-CMD-001/002;TC-SBX-STA-001~003;TC-SBX-ERR-014/015 | context / identity accepted、unresolved / conflict /匿名 /正文 /终态 | P0;L1/L2/L4 | intake / resolver / authority states | PER-SBX-003 | designed_complete |
| CUT-SBX-004 / CBC-SBX-004 | TC-SBX-CMD-003/004;TC-SBX-STA-004~007;TC-SBX-ERR-006/007;TC-SBX-CONF-001~006 | coherent四维裁定、unsupported / stale / partial / weak fallback;真实施加 | P0-C + P0-Q;L1~L5 | context + capability + boundary outcomes | PER-SBX-004/034/036 | designed_p0c_complete;qualification_blocked |
| CUT-SBX-005 / CBC-SBX-005 | TC-SBX-CMD-005/006/008;TC-SBX-STA-010~012;TC-SBX-ERR-005 | policy主线、missing / stale / conflict / unauthorized / high-risk fail-closed | P0;L1~L3 | policy / authorization summaries | PER-SBX-005 | designed_complete |
| CUT-SBX-006 / CBC-SBX-006 | TC-SBX-CMD-007~012;TC-SBX-EVT-004~006;TC-SBX-ERR-009/037/038 | run / capture / handoff分owner、partial / failure no rollback | P0;L1~L4 | run / capture / handoff outcomes | PER-SBX-006 | designed_complete |
| CUT-SBX-007 / CBC-SBX-007 | TC-SBX-CMD-013~020;TC-SBX-STA-016~019;TC-SBX-ERR-010/011 | failure / control / cleanup / redline guard-first与保守收束 | P0;L1~L4 | safety group / guard markers | PER-SBX-007 | designed_complete |
| CUT-SBX-008 / CBC-SBX-008 | TC-SBX-QRY-017~024;TC-SBX-EVT-011~013;TC-SBX-JOB-008~010;TC-SBX-ERR-020 | projection / derived / reconciliation owner、no-repair、report-only | P0;L1~L4 | read / derived / report states | PER-SBX-008 | designed_complete |
| CUT-SBX-009 / CBC-SBX-009 | TC-SBX-CMD-001~020;TC-SBX-CNS-017/018 | 10 Command主线 /拒绝 /entry parity / formal control path | P0;L2/L4 + L3 | command state / port outcome matrix | PER-SBX-009 | designed_complete_10_of_10 |
| CUT-SBX-010 / CBC-SBX-010 | TC-SBX-QRY-001~026;TC-SBX-ERR-019/025/026 | 13 Query visible /空 /降级 /非法selector及0 write | P0;L2/L4 + L3 | query snapshots / access states | PER-SBX-010 | designed_complete_13_of_13 |
| CUT-SBX-011 / CBC-SBX-011 | TC-SBX-CNS-001~022;TC-SBX-STA-027;TC-SBX-ERR-002/012/032/033 | 9 Consumer accepted / duplicate / delayed / quarantine / authority | P0;L2/L4 + L3 | envelope / receipt / target states | PER-SBX-011 | designed_complete_9_of_9 |
| CUT-SBX-012 / CBC-SBX-012 | TC-SBX-EVT-001~015;TC-SBX-JOB-001;TC-SBX-ERR-035/036 | 13 payload、stored snapshot、append atomicity、publish no rollback | P0;L1/L3/L4 | committed source / relay outcomes | PER-SBX-012 | designed_complete_13_of_13 |
| CUT-SBX-013 / CBC-SBX-013 | TC-SBX-JOB-001~012;TC-SBX-STA-028;TC-SBX-ERR-020/034 | 10 Job success / empty / invalid / partial / duplicate / no-repair | P0;L2~L4 | selection / item outcome / reports | PER-SBX-013 | designed_complete_10_of_10 |
| CUT-SBX-014 / CBC-SBX-014 | TC-SBX-STA-001~003;TC-SBX-CMD-001/002 | intake / identity / reference合法 /非法状态闭集 | P0;L1/L2 | three enum state matrix | PER-SBX-014 | designed_complete |
| CUT-SBX-015 / CBC-SBX-015 | TC-SBX-STA-004~009;TC-SBX-CMD-003/004 | boundary / capability / handle / lease / orphan合法与terminal guard | P0;L1~L3 | six enum + adapter outcomes | PER-SBX-015 | designed_complete |
| CUT-SBX-016 / CBC-SBX-016 | TC-SBX-STA-010~012;TC-SBX-CMD-005/006 | policy / high-risk全部non-allow分支 | P0;L1/L2 | three enum + source states | PER-SBX-016 | designed_complete |
| CUT-SBX-017 / CBC-SBX-017 | TC-SBX-STA-013~015/031;TC-SBX-CMD-007~012;TC-SBX-CNS-013~016 | run / immutable capture / handoff aggregate + per-target attempt terminal、partial、retry和no rollback | P0;L1~L3 | four canonical enum slots over three owner groups | PER-SBX-017 | designed_complete |
| CUT-SBX-018 / CBC-SBX-018 | TC-SBX-STA-016~019;TC-SBX-CMD-013~020;TC-SBX-JOB-005~007 | failure / control / cleanup / redline合法 /非法与release guard | P0;L1~L3 | four safety enum groups | PER-SBX-018 | designed_complete |
| CUT-SBX-019 / CBC-SBX-019 | TC-SBX-STA-020~023;TC-SBX-QRY-017~024;TC-SBX-JOB-008~010 | query / projection / derived / reconciliation owner与no-write / repair | P0;L1~L3 | read-side state groups | PER-SBX-019 | designed_complete |
| CUT-SBX-020 / CBC-SBX-020 | TC-SBX-STA-024;TC-SBX-CNS-021/022;TC-SBX-EVT-015;TC-SBX-JOB-001;TC-SBX-RACE-014 | relay状态、retry / dead-letter、terminal race、source不回滚 | P0;L1/L3/L4 | relay records / publisher outcomes | PER-SBX-020 | designed_complete |
| CUT-SBX-021 / CBC-SBX-021 | TC-SBX-STA-025~030;TC-SBX-TXN-007~012;TC-SBX-ERR-018/028~030 | idempotency / result / receipt / report / availability / config technical states | P0;L1~L4 | replay / adapter / config states | PER-SBX-021 | designed_complete |
| CUT-SBX-022 / CBC-SBX-022 | TC-SBX-TXN-001~006;TC-SBX-EVT-015;TC-SBX-ERR-022~024/034 | staged failure、rollback、commit unknown、全量可见 /不可见 | P0;L2/L3 | UoW injection stages | PER-SBX-022 | designed_complete |
| CUT-SBX-023 / CBC-SBX-023 | TC-SBX-CTR-005;TC-SBX-QRY-004/017/024~026;TC-SBX-TXN-005/013/014;TC-SBX-ERR-021 | version / truth / reference / page cursor / selector / no-scan | P0;L1/L3/L4 | typed cursor / selector variants | PER-SBX-023 | designed_complete |
| CUT-SBX-024 / CBC-SBX-024 | TC-SBX-CTR-004;TC-SBX-CNS-003/004;TC-SBX-JOB-011;TC-SBX-TXN-007~012;TC-SBX-ERR-017/018 | Command / Consumer / Job same replay、different conflict、missing no recompute | P0;L2~L4 | three-channel stored results | PER-SBX-024 | designed_complete |
| CUT-SBX-025 / CBC-SBX-025 | TC-SBX-RACE-001~019;TC-SBX-TXN-012~014;TC-SBX-CMD-013/014 | 19类single-winner、loser surface、无半状态 | P0;L2/L3 | deterministic interleaving | PER-SBX-025 | designed_complete_19_of_19 |
| CUT-SBX-026 / CBC-SBX-026 | TC-SBX-ERR-001~038;TC-SBX-CTR-002/006 | 38错误producer / typed mapping / safe surface /恢复禁止 | P0;L1~L4 | typed failure outcomes | PER-SBX-026 | designed_complete_38_of_38 |
| CUT-SBX-027 / CBC-SBX-027 | TC-SBX-CFG-001~008/029 | source / strict parse / I001~I101 item / unsupported / NCFG | P0;L1 | source / config parameter matrix | PER-SBX-027 | designed_complete_fdt_01_08_29 |
| CUT-SBX-028 / CBC-SBX-028 | TC-SBX-CFG-005/008/010~018;TC-SBX-STA-029/030;TC-SBX-ERR-030 | profile / FC / XVAL / generation / scoped composition与0或完整发布 | P0;L1/L3/L4 | profile / generation / composition | PER-SBX-028 | designed_complete |
| CUT-SBX-029 / CBC-SBX-029 | TC-SBX-CTR-006;TC-SBX-CMD-009~012;TC-SBX-CFG-009/012/013/030;TC-SBX-CONF-013 | sensitive / lease / carrier / material lifecycle与synthetic scan | P0-C + P0-Q;L1~L6 | sensitive taxonomy / material slots | PER-SBX-029 | designed_p0c_complete;provider_subset_blocked |
| CUT-SBX-030 / CBC-SBX-030 | TC-SBX-CFG-024~028;TC-SBX-COND-004 | review / TOCTOU、apply / rollback / drift honesty及结构性有界 | P0-C;L1~L3 | change / desired / observed states | PER-SBX-030 | designed_complete;physical_drill_conditional |
| CUT-SBX-031 / CBC-SBX-031 | TC-SBX-CTR-003;TC-SBX-CMD-001~020;TC-SBX-QRY-001~026;TC-SBX-CNS-001~022;TC-SBX-JOB-001~012;TC-SBX-CFG-014~018;TC-SBX-ERR-030~032 | complete builder、API / worker / job mapping、current-unit isolation | P0;L3/L4 | registry / generation / scoped inputs | PER-SBX-031 | designed_complete |
| CUT-SBX-032 / CBC-SBX-032 | TC-SBX-CTR-006;TC-SBX-EVT-001~013;TC-SBX-CFG-009/015/030;TC-SBX-ERR-001~038适用safe surface | formal audit same-UoW、safe carrier、低基数、telemetry不替代audit | P0;L1~L6 | audit / carrier marker matrix | PER-SBX-032 | designed_complete |
| CUT-SBX-033 / CBC-SBX-033 | TC-SBX-ARCH-001~003;TC-SBX-CFG-007/029;TC-SBX-ERR-029~032 | sibling dependency闭集、unsupported surface absence、领域责任裁剪 | P0;static/L3/L4 | manifest / protocol / registry | PER-SBX-033 | designed_complete;target_repo_execution_blocked |
| CUT-SBX-034 / CBC-SBX-034 | TC-SBX-CONF-001~006 | candidate四维真实施加、越界阻断、unsupported整体拒绝 | P0-Q;L5 | fixed candidate / template / lab | PER-SBX-034 | designed_execution_blocked |
| CUT-SBX-035 / CBC-SBX-035 | TC-SBX-CONF-007~010/013;CMD safety cases;TC-SBX-JOB-005~007 | 真实launch / timeout / kill / capture / lease / orphan / cleanup / redline | P0-Q;L5 | dedicated safety lab / material controls | PER-SBX-035 | designed_execution_blocked |
| CUT-SBX-036 / CBC-SBX-036 | TC-SBX-CONF-001/006/011~013;TC-SBX-ARCH-001 | qualification identity、no host / fake / fixture fallback、anti-leak | P0-Q;L5/L6 summary | profile / generation / environment identity | PER-SBX-036 | designed_execution_blocked |
| CUT-SBX-037 / CBC-SBX-037 | TC-SBX-COND-001/002;TC-SBX-CFG-025~028;TC-SBX-COND-005 | durable / real-like parity、outage / rollout / rollback / drift及量化候选 | P1;selected-run | qualified PROFILE-06 / products | PER-SBX-037 | conditional_non_p0 |
| CUT-SBX-038 / CBC-SBX-038 | TC-SBX-ARCH-002;TC-SBX-COND-003/005;TC-SBX-CFG-007/010/029 | current production / peripheral absence、design-reopen trigger、量化候选 | P2;static scope gate | PROFILE-07 inactive / future scope | PER-SBX-038 | conditional_non_p0 |

## 5. 单测试切口用例停审

| 批次 | 审查结论 | 缺口 /处理 |
|---|---|---|
| CUT-SBX-001~008 capability切口 | 通过（设计） | 正向 /拒绝 /owner边界完整;真实施加另由034~036 |
| CUT-SBX-009~013 55协议 | 通过（设计） | 10 + 13 + 9 + 13 + 10逐项有TC,无E2E抽样替代 |
| CUT-SBX-014~021 状态 | 通过（设计） | 31 Step 10 enum entries逐项合法 /非法;同名状态不跨owner |
| CUT-SBX-022~026 consistency / errors | 通过（设计） | staged failure、三通道replay、19 race、38 error逐项闭合 |
| CUT-SBX-027~033 config / security / boundary | 通过（设计） | FDT-01~30、参数化全集和3个static case;目标仓static执行仍开放 |
| CUT-SBX-034~036 P0-Q | 通过（设计）,执行blocked | 13个L5 case已设计;candidate / capability / lab / provider未形成 |
| CUT-SBX-037~038 P1 / P2 | conditional | 只保留selected-run / absence / reopen;不补偿P0 |

## 6. 跨用例断言与phase审计

| 审计项 | 结论 | 缺口 /处理 |
|---|---|---|
| TC重复 /换义 /断号 | 无 | 14前缀各自从001连续,共254条 |
| P0只测happy path | 无 | 每个P0 CUT含关键negative / boundary;状态 /错误另有闭集 |
| 协议孤儿 | 无 | 55 /55逐项进入TC |
| 状态 /错误命名漂移 | 无 | 31 Step 10 enum entries与38 error使用正式名称 |
| transaction / race仅靠偶现 | 无 | staged injection与19类deterministic schedule明确 |
| query write / job repair | 无 | 每个Query和maintenance族都有0 write / no-repair断言 |
| no rollback / no recompute | 通过 | relay / handoff / duplicate / recovery均只改owning marker |
| P0-Q被fake替代 | 无 | CONF case只认L5固定identity结果,当前blocked |
| P1 / P2补偿P0 | 无 | CUT-SBX-037/038保持conditional |
| tools / runtime / member越界 | 无 | TC-SBX-ARCH-003与Command launch边界显式否定 |
| Step 7~13越级 | 无 | 未固定数据集、环境、suite、硬阈值、EV、artifact或结果 |
| evidence冲突 | 无 | 仅消费PER-SBX-001~038,未创建EV |

## 7. 对上游设计的影响判定

| 结论 | 是否回写 | 处理 |
|---|---:|---|
| 所有P0用例均能引用正式字段 /状态 /协议 /错误 /事务 /配置 | 否 | 无当前上游blocker |
| write-audit、failure injection、deterministic race需要测试实现能力 | 否 | Step 9定义suite / harness contract,不是设计缺口 |
| P0-Q candidate / lab / provider / target repo未形成 | 否 | 不阻塞Step 7数据设计;阻塞相应执行 |
| Step 7若无法构造某formal state / error前置 | 条件性是 | 停止相关数据集并回写`03/04`,不得测试私造状态 |

## 8. 正式`05` §6回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_06_cases.md`
> - `design-calibration/05_test_plan_step_06_cases_commands_queries.md`
> - `design-calibration/05_test_plan_step_06_cases_consumers_events_jobs.md`
> - `design-calibration/05_test_plan_step_06_cases_state_txn_race.md`
> - `design-calibration/05_test_plan_step_06_cases_errors_recovery.md`
> - `design-calibration/05_test_plan_step_06_cases_config_security_qualification.md`
>
> 延伸阅读: 建议继续阅读各分件的用例矩阵 /停审和本文件§4~§7,了解字段、状态、错误、副作用、资格成熟度与phase边界。

正式§6应回填254条TC的稳定索引和可执行矩阵,并保留以下结论:

1. 55协议逐项测试,Query显式0 write,Job显式no core repair,Consumer / relay / handoff显式no truth rewrite。
2. 31 Step 10 enum entries、38 error、19 race、FDT-01~30及参数化配置 /安全集合不得抽样省略。
3. P0-Q TC已设计但execution blocked;fake / seam / L6 summary不能替代L5。
4. PER只是planned evidence requirement;正式EV与artifact到Step 13定义,真实执行才产生结果。

## 9. 待确认事项与进入下一步条件

| 待确认事项 | 当前状态 | 是否阻塞Step 7 | 后续处理 |
|---|---|---:|---|
| 254条TC如何分配数据集 / builder | current_delta_to_step_7 | 否 | 既有28个数据集和13类构造契约继续复用；`STA-031`归入现有handoff / retry deterministic dataset，不新增环境。 |
| write-audit / failure injection / deterministic scheduler实现 | open_for_step_9 | 否 | Step 9定义自动化contract |
| P0-Q candidate / lab / provider | open_for_execution | 否 | Step 8 /10 / `07/09`关闭 |
| AC-SBX-036硬阈值 | open_for_step_10 | 否 | 不影响结构性case |

| 进入条件 | 结果 | 说明 |
|---|---|---|
| 每个P0 CUT有可执行TC与明确断言 | 通过（设计） | CUT-SBX-001~036逐项停审;034~036执行blocked |
| 55协议 /31 Step 10 enum entries /38 error /19 race /30 FDT完整 | 设计静态闭合 | 机械校验目标已建立，未执行测试 |
| 跨用例无unresolved phase冲突 | 通过 | §6 |
| 未伪造执行 / evidence /环境 | 通过 | designed only |
| 可进入Step 7 | `passed_to_step_7` | 用户已审查确认;Step 7已据此完成。 |

```text
current_document = `05-测试方案.md`
current_step = Step 6 `设计测试场景与用例矩阵`
gate_status = passed_to_step_7
next_allowed_action = Step 7已承接本Step的254条TC并完成数据设计;当前恢复点以flow和项目台账为准
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
