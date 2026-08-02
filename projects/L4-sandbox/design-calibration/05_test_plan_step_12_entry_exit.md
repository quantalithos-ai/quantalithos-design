# Step 12. 定义进入准则与退出准则

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 书写规范: `standards/document/测试方案书写规范.md` §5.12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_13
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 定义diagnostic、P0-C、P0-Q、整体P0和conditional测试何时允许开始、何时允许退出、何时必须暂停。所有checkbox均为未来可判定准则,当前一律未勾选;本文不创建run、结果、EV、风险接受或验收结论。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 11并允许进入Step 12 | 是。用户在Step 11停审后明确回复“同意”,本次只放行Step 12。 |
| 台账与flow是否允许进入 | 是。Step 11原为`pass_wait_review`;本次确认后转为`passed_to_step_12`。 |
| 是否读取Step 12标准 | 是。已读取测试SOP Step 12和书写规范§5.12,准则必须可判定且不得写“基本完成”。 |
| 是否读取全部输入 | 是。复核Step 7数据、Step 8环境、Step 9自动化、Step 10专项、Step 11缺陷规则及正式P0 / VF / blocker。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact checklist和追溯结构,按Sandbox双门禁、真实隔离资格和当前执行阻塞重建。 |
| 当前状态 | 全局 / P0-C / P0-Q进入、分层退出、暂停、风险接受和当前readiness已闭合;用户已确认并传递至Step 13。 |
| 上游blocker | 未发现需回写`00/03/04`的新冲突。目标仓、suite /脚本 /环境实例和ENV-05缺失使真实执行入口保持Blocked。 |
| 停审 | 用户已确认Step 12;只放行Step 13,不得跨入Step 14或修改正式`05-测试方案.md`。 |

## 2. 本步目标、非范围与判定词汇

本Step完成:

1. 区分本地diagnostic、P0-C机器门禁、P0-Q candidate qualification、整体P0 / release和P1 selected-run的进入条件。
2. 固定237条P0-C、13条P0-Q、合计250条P0与4条conditional的退出关系。
3. 将55协议、31个 Step 10 canonical status enum entries、38错误、19 race、FDT-01~30、I001~I101和关键checks纳入可判定退出。
4. 将S / A缺陷、VF / VETO、Blocked / InfraFailed、identity mismatch、raw / report缺失和cleanup disposition纳入阻断。
5. 明确当前只完成设计准则,真实执行与退出均未开始。

本Step不固定正式EV编号、evidence index schema、acceptance handoff、签署角色或release批准。Step 13定义证据归档,新版`06`定义验收裁决。

| 词汇 | 本Step含义 | 不表示 |
|---|---|---|
| `Required` | 对指定测试层级是硬进入 /退出条件 | 当前已满足。 |
| `Conditional` | 只有正式激活P1 / P2范围后才适用 | 可补偿P0。 |
| `Satisfied` | 未来由真实可回链材料证明条件成立 | 本文已给出该结论。 |
| `Blocked` | 必需前置缺失,不能开始或退出 | Failed、Skipped或风险接受。 |
| `NotEvaluated` | 尚无合法run可判定 | Passed或NotApplicable。 |

`ENT-SBX-*`、`QENT-SBX-*`和`EXT-SBX-*`是准则设计ID,不是TC、缺陷、EV或执行结果。表内`SUITE-001`按`SUITE-SBX-001`展开,`CMD-001`按`TC-SBX-CMD-001`展开,紧凑引用不创建第二编号体系。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档必须冻结 | 正式`00~04`、已确认Step 1~12、254 TC /28数据集 /16 suite manifest及planned artifact / report contract必须绑定同一设计基线。影响DTO、state、flow、port、config、redaction、gate或profile的变化须先重审。 |
| 哪些环境和数据必须可用 | P0-C按suite需要ENV-02 /03 /04及对应PROFILE-02 /03 /04;28数据集中的P0-C部分须可构造、隔离和清理。P0-Q还须完整ENV-05、candidate、capability、template、provider适用项和dedicated lab。 |
| 哪些自动化必须可运行 | P0-C需要SUITE-001~012 /014及scope absence 016、相应gate / report / checks;P0-Q需要SUITE-013及identity / redaction / cleanup checks。人工只可授权ENV-05启动,不能裁决断言。 |
| 退出时哪些用例必须通过 | 237 P0-C和13 P0-Q均须有唯一主结果并通过;4 conditional不得补偿。55协议、30状态、38错误、19 race、FDT-01~30和配置全集不得以抽样报告替代。 |
| 哪些缺陷和风险阻断退出 | 任一S / A open、VF / VETO命中、P0 suite Failed / InfraFailed / Blocked、identity混用、raw / report / digest缺失、redaction / dependency / pairing / no-static check失败均阻断。B只在非P0且按Step 11记录后可不阻断。 |

## 4. 测试层级与准则适用关系

| 层级 | 允许用途 | 进入条件范围 | 退出效力 |
|---|---|---|---|
| ENV-01 diagnostic | loader / contract定位和本地sanity | 最小合法PROFILE-01、synthetic数据、0 real launch | 不形成P0或release证据。 |
| P0-C PR / MAIN | deterministic contract、state、protocol、UoW、config、redaction、boundedness | 全局ENT + MAIN-CONTRACT的ENV-02;MAIN-SEAM另用ENV-03补强 | 两个fixed run共同证明MAIN范围的P0-C,均不证明真实隔离。 |
| P0-C OPS | replay、race、cleanup / redline simulation、no-repair | 全局ENT + ENV-04 | 作为release固定输入,不证明真实release / containment。 |
| P0-Q | candidate-real四维、launch / capture / lifecycle / cleanup / redline | 全局ENT适用项 +全部QENT | 只证明固定qualification identity。 |
| P0整体 / RELEASE | 按序聚合固定MAIN-CONTRACT + MAIN-SEAM + OPS + P0Q四源run | 四源design / subject / core-contracts / harness revision一致,各自profile-specific identity合法 | 才可交给新版`06`,不是验收签署。 |
| P1 selected-run | durable / real-like / rollout /量化候选 | PROFILE-06已独立qualified且显式激活 | Conditional,不补偿P0。 |
| P2 / PROFILE-07 | 当前无合法执行 | 先回写`00~04`并重开Step 2~12 | 当前只能design-reopen。 |

## 5. 全局进入准则

以下checkbox只定义未来判定,当前不勾选。

- [ ] `ENT-SBX-001` 正式`00-需求文档.md`至`04-配置设计.md`是当前冻结基线,旧`README/05/06`未进入事实来源。
- [ ] `ENT-SBX-002` Step 1~12均已审查,且自审查后没有未处理的P0 contract / state / flow / config / profile / redaction变更。
- [ ] `ENT-SBX-003` 目标实现仓、`core-contracts` exact path / version和唯一subject revision可定位;不存在非core sibling编译依赖。
- [ ] `ENT-SBX-004` 254条TC manifest、38个CUT / PER、28数据集和16 suite映射由固定revision读取,无断号、换义或重复主归属。
- [ ] `ENT-SBX-005` 不存在阻塞当前切口的design-reopen项;无法从`00~04`得到唯一断言的场景已暂停并回写owner文档。
- [ ] `ENT-SBX-006` 所需数据集可由builder / seed构造,使用固定clock / ID、run namespace和synthetic marker,不含真实secret /外部正文。
- [ ] `ENT-SBX-007` 数据清理按owner和run namespace执行;qualification数据另有guard-first与lab teardown,不得共用普通强删。
- [ ] `ENT-SBX-008` 所需ENV / PROFILE完整装配,required dependency缺失会fail-fast,不会fallback到host、fake、旧generation或低优先级source。
- [ ] `ENT-SBX-009` SUITE-001~014和016中本次gate要求的suite、TC参数、fault injection、write-audit和deterministic scheduler均已实现且可枚举。
- [ ] `ENT-SBX-010` Step 9的gate、report和check脚本均已实现,参数包含固定`--run-id` / artifact / report / profile输入,失败返回nonzero并保留raw。
- [ ] `ENT-SBX-011` artifact使用`artifacts/test/<run_id>`,report使用`reports/runs/<run_id>`;无`latest`、project子层或静态pass文件作为输入。
- [ ] `ENT-SBX-012` redaction corpus、dependency metadata、254 TC manifest、55 protocol manifest、pairing、no-static-evidence和blocked propagation检查输入均可构造。
- [ ] `ENT-SBX-013` Step 11的S / A / B、归因、复验、证据失效与风险接受规则已成为gate failure处置输入。
- [ ] `ENT-SBX-014` 本次run的subject、config generation、environment、profile、dataset manifest和suite manifest在启动前冻结并写入immutable run manifest。
- [ ] `ENT-SBX-015` 计划用于退出 / release的run已采用Step 13确认后的raw / report schema;仅diagnostic run可在此前运行且不得升格证据。

任一Required条目未满足时,对应正式gate不得启动;已启动的diagnostic结果不得补写成P0结果。

## 6. P0-C与P0-Q专项进入准则

### 6.1 P0-C进入准则

- [ ] `ENT-SBX-C01` ENV-02 / PROFILE-02具有run-isolated semantic fake、fixed clock / ID和除qualification / conditional外全部P0-C数据。
- [ ] `ENT-SBX-C02` ENV-03 / PROFILE-03的controlled resolver / publisher / target / sink仅按注册scenario工作,缺route / target属于环境失败而非negative case通过。
- [ ] `ENT-SBX-C03` ENV-04 / PROFILE-04具有body-free replay root、simulation state和honest report输入,不会读取raw history或调用真实release。
- [ ] `ENT-SBX-C04` fake store满足UoW staging、rollback、version、unique、page order、stored replay和append-only parity;不满足时相关suite不启动。
- [ ] `ENT-SBX-C05` PR / MAIN / OPS各自必需suite与checks可运行,分片后仍能汇总完整TC / parameter manifest。

### 6.2 P0-Q进入准则

- [ ] `QENT-SBX-001` 固定candidate backend、subject revision、PROFILE-05、config generation、Fresh capability matrix和四维boundary template均有不可变identity / digest。
- [ ] `QENT-SBX-002` ENV-05 dedicated safety lab真实存在,resource / filesystem / network / process受控probe目标与forbidden marker均可验证且非production。
- [ ] `QENT-SBX-003` policy fixture、candidate adapter、capture / inspect / release、controlled material / observability / investigation targets均为同一qualification packet要求的完整组合。
- [ ] `QENT-SBX-004` 使用material的case具备qualified non-production provider、principal、lease / revoke / release和platform anti-leak前置;不适用case由immutable manifest明确,不能临时删项。
- [ ] `QENT-SBX-005` cleanup / reaper / redline guard、stop-new-use、containment、investigation handoff和lab emergency teardown已分别可执行;无force-clean修改被测truth。
- [ ] `QENT-SBX-006` SUITE-013的13条CONF TC、qualification identity、redaction、cleanup disposition和substitution veto checks均由deterministic harness判定。
- [ ] `QENT-SBX-007` 受控人员只负责授权启动和lab安全,不能手工覆盖case状态、identity mismatch、Blocked或cleanup失败。

QENT任一缺失时必须`Blocked`且0 launch;ENV-01~04、PROFILE-06、host / fake / fixture或历史backend结果均不可替代。

## 7. P0-C退出准则

- [ ] `EXT-SBX-C01` 固定subject下237条P0-C TC均有唯一主结果,没有Failed、InfraFailed、Blocked、missing或重复主归属。
- [ ] `EXT-SBX-C02` GATE-MAIN的MAIN-CONTRACT固定run在ENV-02完成SUITE-001~011 /014、237条主结果和全部MAIN checks;MAIN-SEAM固定run在ENV-03完成SUITE-005 /008 /010 /011 controlled补强;二者不得合并run。
- [ ] `EXT-SBX-C03` GATE-OPS完成SUITE-012及要求的007~010 /014参数,cleanup disposition、raw / report pairing完整。
- [ ] `EXT-SBX-C04` 55协议、31个 Step 10 canonical status enum entries、38错误、19 race、FDT-01~30、I001~I101、NCFG-01~24、FC-01~06和XVAL-01~36的适用coverage index均无缺项。
- [ ] `EXT-SBX-C05` AC-SBX-035~041的P0-C部分、VF-SBX-001~010和VETO-CFG-01~16适用负向均有可回链结果,零容忍成功数为0。
- [ ] `EXT-SBX-C06` redaction、dependency、TC coverage、protocol inventory、artifact / report pairing、no-static-evidence、blocked propagation checks全部通过。
- [ ] `EXT-SBX-C07` structural boundedness具有selection / visited / call-count / write-count / duration sample;无无界scan、duplicate副作用或optional增强阻塞核心。
- [ ] `EXT-SBX-C08` formal audit、query no-write、job no-repair、transaction visibility、stored replay和single-winner断言全部通过。
- [ ] `EXT-SBX-C09` P0-C范围S级和A级open数量均为0;B级只允许非P0且按Step 11记录,不改变gate状态。
- [ ] `EXT-SBX-C10` 每个blocking suite保留固定run raw、case index、suite report和digest;失败 /诊断run未被覆盖或删除。

P0-C退出只证明contract / fake / controlled / simulation语义,不得写成真实四维隔离或整体P0通过。

## 8. P0-Q退出准则

- [ ] `EXT-SBX-Q01` SUITE-013固定packet内13条CONF TC全部完成并通过,没有Failed、InfraFailed、Blocked、missing或手工覆盖。
- [ ] `EXT-SBX-Q02` candidate、subject、profile、generation、capability、template、environment、provider / material identity在preflight、case、report间连续且digest匹配。
- [ ] `EXT-SBX-Q03` resource / filesystem / network / process四维均真实施加;forbidden动作成功数为0,unsupported / partial请求为整体拒绝且0 bounded launch。
- [ ] `EXT-SBX-Q04` bounded launch、timeout / kill、capture / inspect、lease / orphan、cleanup / reaper和redline containment均产生正式状态与safe材料。
- [ ] `EXT-SBX-Q05` raw output、secret、provider response、full sensitive ref和forbidden marker泄漏数为0;失败报告不回显禁止内容。
- [ ] `EXT-SBX-Q06` 每个case有cleanup / containment disposition;non-Allowed时产品release调用为0,lab teardown结果单列且无未追踪active resource。
- [ ] `EXT-SBX-Q07` qualification identity、redaction、cleanup和substitution checks全部通过,无host / fake / fixture /错误generation替代。
- [ ] `EXT-SBX-Q08` P0-Q范围S级和A级open数量均为0,qualification raw / report / digest完整配对。

任一Q退出项不成立时GATE-P0Q只能Failed或Blocked,并传播到RELEASE;不允许waive、N/A或P1替代。

## 9. 整体P0与Release退出准则

- [ ] `EXT-SBX-P01` P0-C和P0-Q分别满足§7 / §8,合计250条P0 TC均有唯一Passed主结果;4条conditional不计入P0分母。
- [ ] `EXT-SBX-P02` GATE-RELEASE只按`MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q`顺序聚合四个固定source run identity与digest;四源design / subject / core-contracts / harness revision一致,各自profile-specific config / dataset / suite identity精确匹配。
- [ ] `EXT-SBX-P03` PER-SBX-001~033有P0-C producer结果,PER-SBX-034~036有P0-Q producer结果;PER-SBX-037/038保留明确conditional状态且不补偿。
- [ ] `EXT-SBX-P04` release summary保持Passed / Failed / Blocked / NotRunConditional / InfraFailed差异,不存在Blocked归一Skipped、`latest`或静态pass。
- [ ] `EXT-SBX-P05` VF-SBX-001~010、VETO-CFG-01~16、redaction、dependency、pairing、no-static、identity和cleanup否决检查均无命中。
- [ ] `EXT-SBX-P06` 当前无open S / A缺陷,无未处置design blocker或P0 evidence invalidation;B级仅限非P0且具备owner、理由、期限和重开触发。
- [ ] `EXT-SBX-P07` 所有test-created namespace / resource有清理、contained、investigation或lab teardown的明确disposition,不存在未追踪active / orphan环境。
- [ ] `EXT-SBX-P08` 固定run raw / report可按Step 13 schema形成TC / CUT / PER / AC / VF追溯和验收handoff输入,但本文不生成EV或签署。
- [ ] `EXT-SBX-P09` AC-SBX-036只按结构有界性退出;无正式workload / baseline时不以历史时延、吞吐、容量或可用率数字判定。
- [ ] `EXT-SBX-P10` GATE-RELEASE结果完成后只可交给新版`06-验收标准.md`裁决,不得在测试方案中自签验收通过。

## 10. Conditional退出与暂停 /失效规则

### 10.1 Conditional处理

| 项 | P0退出处理 | 必需记录 |
|---|---|---|
| SUITE-015 / PROFILE-06未激活 | 不阻断 | `NotRunConditional`、缺失资格和激活触发。 |
| COND-005无正式产品 / workload / baseline | 不阻断 | sample / trend若有只作诊断,不得形成阈值结论。 |
| PROFILE-07 / production target | 不阻断当前P0 | inactive和design-reopen要求。 |
| B级P1 / P2缺陷 | 不阻断 | owner、影响、期限、接受理由、重开触发。 |
| Conditional范围被升级P0 | 立即阻断旧准则继续使用 | 回写Step 2 /5~12、环境、suite和gate。 |

### 10.2 暂停、阻断与结果失效

| 触发 | 当前run / Gate处理 | 恢复条件 |
|---|---|---|
| 正式`00~04`出现影响当前断言的变更 | 暂停受影响suite;相关旧结果失效 | 回写 /重审Step并新run。 |
| subject revision、config generation、profile或dataset manifest在run中变化 | 当前run作废,不得聚合 | 固定新identity重新执行。 |
| required ENV / adapter / fixture / scheduler缺失 | InfraFailed或Blocked,不计negative pass | 修复测试基础设施后新run。 |
| ENV-05 identity / provider /lab任一缺失 | P0Q Blocked且0 launch | 全部QENT满足后新packet。 |
| raw body / secret泄漏或redaction check失败 | S级;停止相关handoff / release并保留安全材料 | 修复、全carrier复验和新gate run。 |
| cleanup / redline guard失守或lab teardown异常 | 阻断OPS / P0Q / RELEASE;保持containment | Step 11复验且所有resource有disposition。 |
| TC / protocol / PER coverage、pairing或no-static check失败 | 对应gate Failed | 修复manifest /生成工具并从固定raw重验或重跑。 |
| open S / A、evidence invalidated或design-reopen未关闭 | 阻断退出 | 按Step 11关闭并形成新证据。 |
| diagnostic重跑变绿 | 原失败不失效 | 完成根因、自动化补强和正式gate复验。 |

## 11. 当前Readiness事实

本表记录当前已知前置事实,不是测试结果或验收结论。

| 判定面 | 当前状态 | 原因 | 允许动作 |
|---|---|---|---|
| Step 12设计产物 | completed_wait_user_review | 准则已设计,尚待用户审查 | 只审查本文。 |
| 正式`05`测试基线 | not_assembled | 仅Step 15允许整体重建 | 不得修改旧正式`05`。 |
| 目标实现仓 / subject revision | Blocked | 目标仓与exact revision尚未形成 /确认 | `07` precheck后再评估。 |
| SUITE / gate / check实现 | Blocked | Step 9全部为planned_not_implemented | 不得启动正式P0 run。 |
| ENV-02~04实例 | Blocked | 当前只有环境设计,无真实实例 / harness | 不得声明P0-C进入或退出。 |
| ENV-05 / PROFILE-05 | Blocked | candidate、capability、provider、dedicated lab缺失 | GATE-P0Q / RELEASE保持Blocked。 |
| P0-C执行 | NotEvaluated | 无合法subject、suite、environment或run | 无Passed / Failed结论。 |
| P0-Q执行 | NotEvaluatedBlocked | QENT未满足且0 launch | 不得由低profile替代。 |
| P1 / PROFILE-06 | NotRunConditional | composition未qualified | 不影响P0状态。 |
| 整体P0 / RELEASE退出 | Blocked | MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四源真实run与Step 13证据均不存在 | 不得生成release pass或验收handoff。 |

## 12. 追溯、上游影响与停审

| 准则组 | 来源 | 当前闭合 |
|---|---|---|
| 文档 /范围 /用例 | Step 1~6;正式`00~04` | 254 TC与P0-C / P0-Q边界进入ENT / EXT。 |
| 数据 /环境 | Step 7~8 | 28数据集、ENV-01~07和PROFILE-01~07进入分层准则。 |
| 自动化 /真实性 | Step 9 | 16 suite、七gate、17脚本契约和固定run checks进入准则。 |
| NFR /红线 | Step 10 | AC-SBX-035~041、VF-SBX-001~010和结构有界性进入退出。 |
| 缺陷 /复验 | Step 11 | S / A / B、identity、证据失效和风险接受进入阻断。 |

| 影响判定 | 是否回写上游 | 当前处理 |
|---|---:|---|
| 双门禁、250条P0和4条conditional | 否 | 承接已确认范围与suite manifest。 |
| 当前真实执行 / release均Blocked | 否 | 是事实成熟度,不是设计冲突。 |
| Step 13 schema成为正式退出run的进入前置 | 否 | 下游顺序约束,当前不创建schema。 |
| 未来P1 / P2升级P0或新增public surface | 条件性是 | 回写`00~04`及Step 2~12。 |

正式`05-测试方案.md` §12后续应装配§5~§10的未勾选准则、§11当前readiness和§12追溯。不得把本文checkbox改为已通过;真实判定只能来自后续实现与固定run。

| 进入下一步条件 | 状态 | 说明 |
|---|---|---|
| 进入 /退出准则均可判定 | 通过 | 每项有稳定ID、对象和失败传播。 |
| 无“基本完成”类模糊条件 | 通过 | 使用精确数量、状态与identity。 |
| P0-C / P0-Q不可互相替代 | 通过 | 分别定义ENT / EXT。 |
| P1 / P2不补偿P0 | 通过 | Conditional单列。 |
| 当前状态未伪造通过 | 通过 | P0-C / P0-Q NotEvaluated,release Blocked。 |
| 是否存在阻塞Step 13设计的上游blocker | 否 | 执行blocker继续保留,不阻塞证据结构设计。 |

新增`SBX-TEST-ENTRY-EXIT-001`已解析为`resolved_for_test_step_12`:Step 7~11原有数据、环境、suite、专项和缺陷规则尚缺统一可判定进入 /退出门禁,现已闭合。当前状态为`reviewed_passed_to_step_13`;用户已确认Step 12,Step 13完成后必须重新停审。
