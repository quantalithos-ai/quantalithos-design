# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/配置设计书写规范.md` §5.11
> 回填章节: `04-配置设计.md` §11 失效模式与降级 / fail-fast 策略
> 生成日期: 2026-07-11
> 状态: reviewed_passed_to_step_12
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接Step 5的C01~C27来源失败、Step 7的I001~I101失败策略、Step 8的SEC-01~18、Step 9的CFG-VAL-01~25 / generation与scoped失败面、Step 10的CCS / rollback / drift和正式`03`错误 /观测边界,定义candidate、generation、scope和post-publication四层配置失效行为。不得把普通业务adapter失败泛化为配置错误,不得写具体告警产品 /阈值 /值班流程、实现代码、部署命令、真实测试结果、run_id、evidence alias、验收签署、implementation ledger、planned boundary skeleton或commit boundary。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入Step 11 | 是。用户审查Step 10后回复“同意”,本次只放行Step 11。 |
| 项目级台账是否允许进入Step 11 | 是。恢复点为Step 10 `pass_wait_review`,且用户已明确确认。 |
| 文档级flow是否允许进入Step 11 | 是。Step 10的change / review / apply / rollback / drift和no-truth-rewrite已闭合。 |
| 是否读取Step 11 SOP /书写规范 | 是。必须覆盖缺失、错误、敏感配置不可读、config center不可达、过期、漂移及fail-fast / fail-closed / LKG / degraded。 |
| 是否读取Step 5 / 7 / 8 / 9 / 10 | 是。已复核C01~C27、I001~I101、SEC-01~18、CFG-VAL-01~25、CCS-01~14、CRB-01~12和CDR-01~08。 |
| 是否读取正式`03`错误 /观测边界 | 是。已复核正式`03` §11 / §14和`03_ddd_step_12_error_recovery.md` / `03_ddd_step_15_observability_audit.md`。 |
| 是否参考L1项目粒度 | 是。参考L1-governance / L1-artifact Step 11结构,但不继承其config digest、GRC、artifact store或项目特有adapter。 |
| 当前状态 | 已完成并通过语义一致性与机械门禁;用户已确认并放行Step 12 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_11_failure_degradation.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md`仍不存在;只允许Step 15装配 |
| 停审方式 | 本Step完成后暂停;用户确认前不得进入Step 12 |
| 是否发现阻塞本Step的上游blocker | 否。告警产品 /阈值、rollout carrier、provider产品和P05+资格仍是下游缺口,但可用safe logical contract闭合当前失效策略。若要求remote config、online LKG、hot reload或新的runtime failure DTO则转为`03/04`回写blocker。 |

---

## 2. 本步目标与非范围

本Step把“配置在何处被拒绝或何时可能失去依赖”推进到“每个失败都有唯一影响边界、显式状态、safe signal、恢复方式和测试入口”。核心是避免三种伪降级:把非法candidate当作degraded generation发布,把old process仍运行当作LKG / rollback成功,以及把policy / isolation / audit / cleanup / redline / redaction失效写成可继续执行。

本Step必须回答:

- S01~S08来源缺失、不可读、冲突、unknown、invalid winner和unsupported source如何失效。
- I001~I101按40个配置组在startup、entry、loop、job、test和post-publication分别如何处理。
- CFG-VAL-01~25和SEC-01~18如何映射到fail-fast、fail-closed、scope reject、stop-new-use或permitted degraded。
- required store / material / adapter与optional telemetry、read-side、maintenance surface的降级资格为何不同。
- material expiry、revocation、renew failure和release failure如何停止新使用且不泄露material。
- apply / rollback失败、effect suspect、drift和observation incomplete如何保持真实失败状态。
- 哪些safe signal需要立即动作、发布阻断、聚合告警或仅信息记录,以及哪些字段禁止进入label / log / audit。
- 恢复为何必须使用corrected input、new invocation、new generation或正式maintenance flow,不得修改既有truth / receipt / report。

本Step不定义:

- 具体告警平台、severity数字、SLO、阈值、聚合窗口、pager、值班角色、dashboard或runbook命令。
- 具体config center、secret manager、KMS、Vault、release orchestrator、traffic switch或incident产品。
- 业务adapter所有运行错误;只承接与已验证配置、binding、material、availability或scoped input直接相关的失败面。
- query写修复、job修core truth、relay / handoff rollback、automatic desired overwrite或emergency override。
- remote config、admin override、reload、online LKG、partial generation或hot adapter swap。
- Step 12完整下游承接表、实现代码、测试结果、验收、evidence或commit。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供S00~S08、C01~C27、invalid winner no-fallback和source阻断边界 |
| `04_config_step_07_config_items.md` | reviewed | 提供I001~I101、40配置组、required / conditional、作用域和逐项失败策略 |
| `04_config_step_08_sensitive_secrets.md` | reviewed | 提供40 sensitive、23 slot、lease lifecycle、SEC-01~18和safe carrier |
| `04_config_step_09_loading_validation_activation.md` | reviewed | 提供FZ-01~06、LD-01~30、CFG-VAL-01~25、atomic publication和permitted degraded边界 |
| `04_config_step_10_change_audit_rollback.md` | reviewed_passed_to_step_11 | 提供CCS-01~14、CAP-01~17、CRB-01~12、CDR-01~08、desired / observed与rollback child request |
| `projects/L4-sandbox/03-详细设计.md` §11 / §14 | current formal baseline | 提供public error、query degraded、consumer delayed / quarantine、job partial / failed、audit / diagnostic和no-repair / no-rollback边界 |
| `03_ddd_step_12_error_recovery.md` | direct error input | 提供error taxonomy、异常分支、重试 / manual intervention和恢复禁止项 |
| `03_ddd_step_15_observability_audit.md` | direct signal input | 提供safe log / metric / audit / diagnostic字段和store前观测边界 |
| L1-governance / L1-artifact Step 11 | granularity reference | 参考策略词汇、失效表、group回指、告警、测试和审计结构;不复制其配置域或LKG口径 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 必填配置缺失时系统如何处理 | Global required / conditional-active item缺失时不形成FZ-02或不发布FZ-03;current entry / loop / job的S05 required input缺失只拒绝当前scope;S06 required fixture缺失只使当前test / simulation fail-fast。不得造default、fake或silent disable enabled capability。 |
| 类型、范围、交叉字段错误如何处理 | 在LD-07~15产生CFG-VAL-08~18 safe issue。Global candidate fail-fast / profile reject / generation blocked;scoped input由CFG-VAL-23拒绝current invocation;fixture由CFG-VAL-24拒绝。Present-but-invalid winner不得回退低层,也不得clamp。 |
| secret / KMS / Vault不可用如何处理 | 当前只定义产品中立S04,不声称具体KMS / Vault。Required active slot缺descriptor、provider unavailable / denied、class mismatch或audit unavailable时generation blocked / profile unqualified;post-publication expiry / revoke停止新使用,按adapter边界终止 / restart。只有renew失败且old lease仍明确有效时可用到expiry,绝不延长或切fake / host。 |
| config center不可达如何处理 | 当前S07 remote config与S08 admin override均unsupported,因此没有运行期config-center dependency。“声明config center”本身由CFG-VAL-06 / C21拒绝并触发design reopen;不存在自动LKG。未来引入必须先回写`03/04`。 |
| 配置漂移或过期如何发现处理 | Drift使用scope-bound desired / observed marker与active rollout relation判定CDR-01~08;不自动互相覆盖。当前普通config无隐含TTL;“过期”只指material lease、freshness / registry资格或prior candidate与当前software / schema不兼容。相关能力fail-closed / unavailable,rollback失败记CCS-14。 |
| fail-fast / fail-closed / LKG / degraded如何区分 | 非法candidate永不以degraded发布;安全语义不确定时fail-closed;online LKG不存在;degraded只允许ordinary validation通过、无required failure且complete generation原子发布时的read / maintenance / optional telemetry显式surface,以及这些surface发布后的health变化。不得放宽policy、四维boundary、audit、cleanup、redline、redaction或required mutation dependency。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 11前问题 | 本Step处理 |
|---|---|---|
| Step 5 C01~C27 | 已有阻断边界,但未统一到alert / recovery / test | 建立source failure handoff与main failure mode表 |
| Step 7 item表 | 101项逐行有failure,但相同配置组在startup / scoped / runtime的差异分散 | 按40组形成唯一失败策略与降级资格 |
| Step 8 SEC | 已定义material行为,但expiry / revoke / renew与整体runtime disposition仍需汇总 | 单列post-publication material失效和stop-new-use规则 |
| Step 9 `Degraded` | permitted degraded已限制方向,但实现者仍可能把invalid config当degraded | 固定candidate invalid发布0 handle;degraded只属于ordinary validation通过、无required failure且完整原子发布的generation有限surface |
| Step 10 rollback / drift | 有CCS / CDR状态,尚无统一告警 /恢复 /测试切口 | 关联control failure、manual disposition和no-auto-overwrite |
| 正式`03`业务失败 | adapter unavailable、consumer delayed、job failed等可能被误写为配置失效 | 只在失败由binding / material / config-owned availability触发时回指;业务输入 / transaction错误仍归`03` |
| 旧README / 05 / 06 | 旧host fallback、默认出网或旧环境可能污染degradation | 继续作为historical material,不继承任何weak fallback |

---

## 6. 改动前后对比

| 维度 | Step 11前 | Step 11后 |
|---|---|---|
| failure subject | source、item、issue、change各自描述 | candidate / generation / scoped invocation / post-publication / change-control五层统一 |
| invalid config | 多处写fail-fast | 明确发布0 handle,不得映射Ready / Degraded |
| hard guard | 分散于XVAL / SEC / `03` | policy、boundary、audit、cleanup、redline、redaction和required dependency形成no-degrade闭集 |
| runtime degraded | generic availability方向 | 只允许complete generation中的read / maintenance / optional telemetry,每类有禁止副作用 |
| LKG | 已写unsupported但容易被old process混淆 | old process continuation、rollback、LKG三者完全分开 |
| drift / rollback | 状态已定义 | 补齐告警、恢复、observation incomplete和failed rollout处置 |
| testing | Step 7~10分散negative direction | 输出稳定test cut ID,供Step 12 /正式`05`承接 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| invalid startup candidate | A. ReadyWithWarnings;B. fail-fast | 采用B。Schema / profile / cross-field不成立时没有可信generation。 |
| required adapter unavailable | A. partial handles;B. generation blocked | 采用B。承接LD-24 same-generation原子发布。 |
| optional external telemetry失效 | A. core blocked;B. bounded degraded | 采用B,但safe local diagnostic、formal audit和redaction必须保持。 |
| policy / boundary source runtime失效 | A. degraded allow;B. fail-closed operation | 采用B。availability可记录degraded,但相关launch / mutation不得放行。 |
| projection / reference read失效 | A. query修复;B. degraded / missing + maintenance | 采用B。保持query no-write。 |
| old process仍使用old generation | A. LKG success;B. independent existing fact | 采用B。新apply / rollback仍可能failed / drift。 |
| config center unavailable | A. 自动本地fallback;B. current unsupported | 采用B。当前没有source / audit / consistency contract。 |
| alert字段 | A. full marker / actor / instance labels;B. safe refs与低基数class | 采用B。具体聚合和阈值留`09`,metric label不得包含marker / ref。 |

---

## 8. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 10 | done | 确认用户只放行Step 11 |
| 2 | 读取Step 11 SOP、书写规范§5.11和L1参考 | done | 固定必出失效表与策略边界 |
| 3 | 读取Step 5/7/8/9/10与正式`03`错误 /观测 | done | 固定source、item、issue、material、change和safe signal全集 |
| 4 | 提取C01~C27、40组、CFG-VAL-01~25、SEC-01~18、CCS/CRB/CDR | done | 建立机械覆盖基线 |
| 5 | 定义失效策略、阶段与主失效模式 | done | §9.1~§9.3 |
| 6 | 完成上游ID与40配置组回指 | done | §9.4~§9.6 |
| 7 | 完成runtime role、告警、恢复和测试矩阵 | done | §9.7~§9.10 |
| 8 | 完成停审、跨失效审计和`03`影响判定 | done | §9.11~§10 |
| 9 | 机械校验、状态同步并停审 | done | 表结构、集合、编号、40组 / 101项、44域、上游ID、secret和提前产物门禁通过;未创建Step 12或正式`04` |

---

## 9. 结构化中间产物

### 9.1 失效策略词汇与不可变规则

下列ID是配置设计logical disposition,不是新增public enum、error DTO、domain state或告警产品severity。实现必须映射到正式`03`既有error / availability / receipt / report / diagnostic surface。

| Policy ID /策略 | 精确定义 | 允许主语 | 禁止误用 |
|---|---|---|---|
| FDP-01 `CandidateRejected` | raw / parsed / merged candidate未通过V01~V07,不形成FZ-02 | startup candidate、profile、source | 继续builder、回退低层、标记degraded |
| FDP-02 `StartupFailFast` | 当前process / entry assembly停止,不暴露任何新generation handle | global required / schema / cross-field / hard guard | 影响已运行的独立old process或伪造business audit |
| FDP-03 `GenerationBlocked` | FZ-02存在但S04、constructor、required availability或LD-24失败,发布0个handle | active material、required store / adapter、same-generation set | partial publish、mixed generation、old process算成功 |
| FDP-04 `FailClosed` | 安全 / policy / isolation / audit语义不确定时拒绝相关操作或profile | policy、boundary、secret、audit、cleanup、redline、redaction | permissive default、fake / host fallback |
| FDP-05 `ScopedRejected` | 只拒绝current entry / loop / job,不修改FZ-03或既有formal result | S05 selector / ceiling / target / scope | clamp、写global override、修改旧receipt / report |
| FDP-06 `TestFailFast` | 只终止current fixture / test / simulation assembly或case | S06 / PROFILE-01~04 test slot | 进入P05~P07、fallback real / host |
| FDP-07 `StopNewUse` | 已发布generation的material / hard capability失效后停止新调用,按现有adapter / runtime边界终止或restart | expiry、revocation、required hard capability loss | 无限续期、silent continue、热切fake / host |
| FDP-08 `PermittedDegraded` | ordinary validation已通过、无required failure且generation完整时,可在LD-22标记受限surface并由LD-24原子发布;发布后同类surface也可显式返回degraded / stale / unavailable | read-side、maintenance、optional external telemetry | invalid config、required build failure、policy allow、partial boundary、audit / guard削弱 |
| FDP-09 `DelayedOrFailedMarker` | 已进入formal worker / relay / handoff / job flow后保存delayed / retryable / failed / partial surface | runtime dependency action | 回滚source truth、伪造success、重算stored result |
| FDP-10 `ControlDispositionRequired` | apply / rollback / drift / observation异常冻结自动动作,保留history并进入调查或新request | CCS / CDR control plane | observed反推desired、覆盖失败record、emergency mutation |

跨所有策略的不变量:

- 非法candidate不能产生`RuntimeConfigStatus::Degraded`;FDP-08只允许ordinary V01~V07通过、V08~V09无required failure且LD-23形成complete port set的generation,并必须通过LD-24原子发布。发布后同类optional / read surface的health变化可继续显式degraded,但不得改变config语义。
- `AdapterAvailabilityState`可以描述运行期不可用,但不能单独授权继续执行;相关operation仍按policy / boundary / mutation guard fail-closed。
- old process继续其immutable FZ-03只是既有运行事实,不是new apply成功、online LKG、rollback或fleet aligned evidence。
- 所有恢复只影响new candidate、new generation、new scoped invocation或正式maintenance flow;不得改写accepted truth、audit、relay、stored result、receipt、report、handoff、capture、cleanup或redline事实。
- failure signal只允许stable class、item / group ID、profile、safe reason / diagnostic ref、generation / scope opaque ref和低基数disposition;不得携带raw value、full sensitive ref、material version、endpoint、topic、SDK body、stack或controlled workload output。

### 9.2 失效检测阶段与影响半径

| Stage ID /阶段 | 输入事实 | 首要检测 | 最大允许影响半径 | 成功恢复单位 |
|---|---|---|---|---|
| FDS-01 source intent | S02 selector、S03/S05 selector、PROFILE intent | ambiguity、unreadable、unsupported | current startup / entry | corrected intent + new startup |
| FDS-02 parse / decode | selected JSON、allowlisted env | parse、duplicate、unknown、alias、raw material | current startup | corrected complete source |
| FDS-03 ordinary semantic | merged candidate | required、type、enum、range、collection、ref、registry | current startup | corrected complete candidate |
| FDS-04 profile / static / cross | typed candidate | profile资格、NCFG、FC / XVAL、activation dependency | current startup / profile | corrected candidate + full revalidation |
| FDS-05 secure resolve | approved active S04 slots | descriptor、provider、class、lease、audit | candidate generation | new valid slot / candidate + rebuild |
| FDS-06 construction / availability | repositories、adapters、services | constructor、required availability、degrade资格 | candidate generation | full same-generation rebuild |
| FDS-07 publication | complete generation set | identity mismatch、partial / publication failure | candidate generation | another complete atomic publication |
| FDS-08 scoped snapshot | S05 / S06 | ceiling、registry、target、scope、fixture资格 | current entry / loop / job / case | new corrected invocation |
| FDS-09 post-publication | material lease、adapter / source health | expiry、revoke、stale、runtime unavailable | owning operation / capability | provider / source recovery or new generation;不改old fact |
| FDS-10 change control | proposal、review、desired / observed、rollback | reject、build failure、effect suspect、drift、observation gap | declared rollout scope | new approved request / rollout / investigation |

### 9.3 失效模式总表

本表的“是否告警”使用§9.8的logical alert class,不声明产品、阈值或真实告警已配置。测试切口是后续`05`输入,不是测试结果。

| Failure ID /失效模式 | 上游回指 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|---|
| CFM-01 source / profile selector冲突 | C07;CFG-VAL-01 | source不唯一 | FDP-01/02;不读第二source | ALC-02 | conflicting selector rejected |
| CFM-02 explicit source不存在 /不可读 | C03/C08;CFG-VAL-02 | 无可信S02 | FDP-02;不回退default path / S01 | ALC-02 | selected source unavailable no fallback |
| CFM-03 parse / duplicate / unknown / alias | C03~C06;CFG-VAL-03~05 | schema不可信 | FDP-01/02 | ALC-02 | strict JSON / duplicate / unknown negative set |
| CFM-04 env mapping denied / malformed | C02/C06;CFG-VAL-07/08 | high winner非法 | FDP-01/02;不回退S02/S01 | ALC-02 | invalid allowlisted env no fallback |
| CFM-05 required / conditional-active item缺失 | C09~C13;CFG-VAL-09/18 | candidate或active capability不完整 | global FDP-02/03;scope FDP-05;test FDP-06 | ALC-02/03 | required item removal by activation class |
| CFM-06 type / enum / range / collection错误 | C02/C25;CFG-VAL-10~12 | typed snapshot不可构造 | global FDP-01/02;scope FDP-05;不clamp | ALC-02 | wrong type/range/cardinality matrix |
| CFM-07 ref family / registry mismatch / ambiguity | C15;CFG-VAL-13/14 | binding不可判定 | FDP-01/02;不猜family / provider | ALC-02/01 | unknown/mismatched/ambiguous ref |
| CFM-08 unsupported source / reload / LKG声明 | C21/C27;CFG-VAL-06 | 请求不存在的consistency路径 | FDP-01/02 + design reopen | ALC-01 | S07/S08/reload/LKG rejected |
| CFM-09 forbidden invariant override | C22;CFG-VAL-16 | 试图改写NCFG / safety truth | FDP-04 + design correction | ALC-01 | each NCFG class rejects override |
| CFM-10 raw secret / unsafe output carrier | C14;CFG-VAL-19;SEC-01/14/15 | 泄露或workload注入 | FDP-04;field / candidate / launch reject | ALC-01 | secret-like input and all-carrier leak scan |
| CFM-11 profile composition / real-like资格失败 | C19/C23;CFG-VAL-15;SEC-03 | profile不可信 | FDP-01/04;不降级P01 / fake | ALC-01/02 | P05+ incomplete/fake and P07 inactive |
| CFM-12 cross-field / route / retention冲突 | C24/C25;CFG-VAL-17 | 跨域guard不成立 | FDP-01/02;不拆分启用 | ALC-02 | XVAL-01~36 negative matrix |
| CFM-13 active slot / feature dependency缺失 | C13/C24;CFG-VAL-18;SEC-05 | enabled composition不完整 | FDP-02/03;不得silent disable | ALC-02/03 | enabled dependency missing |
| CFM-14 coherent boundary不完整 / weak backend | XVAL-18/19;NCFG | resource/fs/network/process不一致 | FDP-04;profile / launch reject | ALC-01 | four-dimension partial and host fallback veto |
| CFM-15 audit / cleanup / redline / redaction削弱 | XVAL-26/27/31/32;CCT-10/13 | hard guard被放宽 | FDP-04;candidate reject | ALC-01 | disable / deny removal / force-clean / advisory-only veto |
| CFM-16 fixture资格 / composition错误 | C19/C20;CFG-VAL-24;SEC-03 | test不可信或污染real-like | FDP-06;P05+ profile reject | ALC-05/01 | missing fixture and fixture-in-real-like |
| CFM-17 descriptor / required material slot缺失 | SEC-05/06;CFG-VAL-20 | S04不可解析 | FDP-03/04 | ALC-03/01 | missing/ambiguous descriptor |
| CFM-18 provider unavailable / denied / audit unavailable | SEC-07/08/12;CFG-VAL-20 | required binding不qualified | FDP-03/04;无raw / fake / other provider fallback | ALC-03/01 | provider unavailable/denied/audit unavailable |
| CFM-19 material class / consumer mismatch | SEC-09;CFG-VAL-20/21 | adapter material不可信 | FDP-03/04 | ALC-01 | wrong class / cross-consumer lease |
| CFM-20 material expired | SEC-10 | owning capability不能新使用 | FDP-07;new generation或停止能力 | ALC-01/03 | expiry stops new calls |
| CFM-21 material revoked | SEC-11 | 现有provider / operation hook检测到revoke后,安全边界不再可信 | 检测后执行FDP-07 stop-new-use,并按现有adapter / runtime边界terminate / restart;不承诺即时push callback | ALC-01 | existing hook detects revoke,then stops new use;revoked version never rollback |
| CFM-22 renew失败且old lease仍有效 | SEC-13 | capability进入有界风险窗口 | 仅用到expiry + safe degraded marker;到期FDP-07 | ALC-03 | renew failure bounded by expiry |
| CFM-23 shutdown lease release失败 | SEC-16 | lease可能残留 | failure marker;禁止new generation复用 | ALC-03 | failed release prevents reuse |
| CFM-24 adapter / repository construction失败 | CFG-VAL-21 | generation不完整 | FDP-03;accepted mutation未开始 | ALC-03 | each required constructor failure publishes zero |
| CFM-25 required availability rejected | CFG-VAL-22 | required capability不可用 | FDP-03;不得partial handle | ALC-03 | required availability blocks generation |
| CFM-26 optional telemetry sink不可用 | CFG-VAL-22;SEC-17 | external telemetry缺失 | FDP-08;local safe diagnostic / formal audit保持 | ALC-06 | telemetry degraded preserves audit/redaction |
| CFM-27 generation identity / atomic publication失败 | CFG-VAL-25;SEC-18 | mixed / partial generation风险 | FDP-03;发布0个handle | ALC-02/03 | mixed generation and publication failure |
| CFM-28 entry / loop / job scoped input非法 | C10/C11/C18;CFG-VAL-23 | current invocation不可执行 | FDP-05;FZ-03与旧result不变 | ALC-05 | each scoped ceiling/registry/target reject |
| CFM-29 post-publication context source不可用 | `03` ReferenceUnresolved | 依赖context的command / consumer不可判定 | related command reject;consumer FDP-09;query按既有surface | ALC-03/06 | no guessed context truth |
| CFM-30 post-publication policy missing / stale / conflicted | `03` policy error;I031~I034 | execution policy不可判定 | FDP-04;相关operation fail-closed | ALC-01/03 | stale policy never allows |
| CFM-31 backend capability stale / unavailable | `03` capability error;I035~I038 | boundary / launch资格不可判定 | availability可degraded,但establish / launch FDP-04 | ALC-03 | degraded marker cannot authorize launch |
| CFM-32 projection / reference read不可用 | `03` QueryMaterialDegraded | read surface不完整 | FDP-08 missing / stale / degraded;query no-write | ALC-06 | degraded query has zero writes |
| CFM-33 inbound dependency暂不可用 /输入不可信 | `03` consumer flow | current event不能安全应用 | unavailable可delayed;invalid / forbidden可quarantine;不造truth | ALC-03/01 | delayed vs quarantine classifier |
| CFM-34 publisher / relay依赖失败 | `03` relay flow;I050~I054 | outbound未交付 | FDP-09 retryable / failed / dead-letter;source truth不回滚 | ALC-03 | publish failure no source rollback |
| CFM-35 handoff target / adapter失败 | `03` handoff flow;I055~I064 | candidate handoff未交付 | FDP-09 retryable / failed;capture / guard不改写 | ALC-03 | handoff failure no truth / guard rewrite |
| CFM-36 cleanup / release / redline依赖失败 | `03` safety flow;I065~I075 | orphan / guard / containment未闭合 | 保持blocked / orphan / contained;不得force success | ALC-01/03 | missing evidence/release/handoff keeps guard |
| CFM-37 maintenance dependency / item失败 | `03` job flow;I076~I085 | refresh / rebuild / derived / reconcile不完整 | FDP-08/09 partial / degraded report;no core truth repair | ALC-06/03 | partial report and no-repair assertion |
| CFM-38 change prevalidation / review拒绝 | CCS-05/06 | candidate未获apply资格 | FDP-10;no activation | ALC-02/01 | rejected candidate never calls S04 |
| CFM-39 apply S04 / build / publication失败 | CCS-09;CRB-03/04 | desired未被observed满足 | FDP-10;关闭failed rollout relation;old process非成功 | ALC-02/04 | apply failure retains honest desired/observed |
| CFM-40 effect suspect | CCS-10;CRB-05/06 | generation已发布但效果异常 | freeze auto action;investigate / new rollback request | ALC-04 | no automatic config mutation |
| CFM-41 rollback target missing / revoked / incompatible | CAP-14;CRB-07/08/12 | prior candidate不可安全恢复 | parent CCS-14;forward fix / new compatible request | ALC-04/01 | invalid prior cannot bypass current validator |
| CFM-42 rollback validation / build / publication失败 | CCS-14;CRB-12 | rollback未成功 | FDP-10;保留原 / child失败history | ALC-04 | old process alive not rollback success |
| CFM-43 drift未被active rollout覆盖 | C26;CDR-05 | observed与desired不一致 | FDP-10;freeze auto overwrite,调查 / apply / rollback request | ALC-04 | observed never becomes desired automatically |
| CFM-44 observation incomplete | CDR-06 | 无法判定aligned / drift全貌 | FDP-10;记录missing observation,不得宣称aligned | ALC-04 | missing marker blocks alignment claim |
| CFM-45 ordinary config“过期”声明 | Step 7/9无TTL | 未定义的隐式失效语义 | reject该假设;只承认material / freshness / qualification / compatibility expiry | ALC-05 | no hidden config TTL |
| CFM-46 remote config center不可达 | S07;C21;CFG-VAL-06 | 当前能力不存在 | declaration在startup FDP-01/02 + design reopen;无LKG | ALC-01 | remote source declaration rejected |

### 9.4 Step 5 / Step 9 / Step 8失败ID完整承接表

本表用于证明上游失败集合没有在Step 11被压缩丢失。C01是合法覆盖路径,不是failure;仍列入并明确“不触发失效”。

| 上游集合 | ID范围 | Step 11承接 | 覆盖结论 |
|---|---|---|---|
| Step 5 source conflict | C01 | 合法winner选择,不触发FDP;若marker异常再进入CFM-43 | covered_non_failure |
| Step 5 source conflict | C02~C08 | CFM-01~04 | covered |
| Step 5 source conflict | C09~C13 | CFM-05/13/28 | covered |
| Step 5 source conflict | C14~C17 | CFM-07/10/17~19 | covered |
| Step 5 source conflict | C18~C20 | CFM-16/28 | covered |
| Step 5 source conflict | C21~C23 | CFM-08/09/11/46 | covered |
| Step 5 source conflict | C24~C25 | CFM-12/13 | covered |
| Step 5 source conflict | C26~C27 | CFM-08/43 | covered |
| Step 9 validation issue | CFG-VAL-01~08 | CFM-01~04/08 | covered |
| Step 9 validation issue | CFG-VAL-09~18 | CFM-05~07/09/11~13 | covered |
| Step 9 validation issue | CFG-VAL-19~22 | CFM-10/17~19/24~26 | covered |
| Step 9 validation issue | CFG-VAL-23~25 | CFM-16/27/28 | covered |
| Step 8 sensitive error | SEC-01~06 | CFM-07/10/11/13/17 | covered |
| Step 8 sensitive error | SEC-07~13 | CFM-18~22 | covered |
| Step 8 sensitive error | SEC-14~18 | CFM-10/23/26/27 | covered |

逐ID机械期望集合:

```text
C01~C27
CFG-VAL-01~CFG-VAL-25
SEC-01~SEC-18
```

Step 11装配时不得把C01算作failure数量,但必须保留其winner / source marker正常路径。其余ID必须至少映射一个CFM,且同一CFM可承接多个同义检测面。

### 9.5 生效方式到失效策略矩阵

| Activation / freeze | 配置错误 | 依赖 / material运行期失效 | 允许degraded | 恢复单位 | 禁止行为 |
|---|---|---|---|---|---|
| static S00 / NCFG | FDP-04 + design correction | 不适用 | 否 | 正式设计 / software baseline | runtime override |
| FZ-01 source / profile intent | FDP-01/02 | 不适用 | 否 | new startup intent | second source / default path fallback |
| FZ-02 ordinary snapshot | FDP-01/02 | 不适用 | 否 | corrected complete candidate | partial patch / invalid winner fallback |
| FZ-03 required generation build | FDP-03/04 | required失败不发布,因此无degraded success | 否 | complete new generation | partial / mixed handles |
| FZ-03 optional surface build | invalid config仍FDP-01/02;optional availability按LD-22 | FDP-08可作为complete generation disposition | 是,只限正式允许的read / maintenance / optional telemetry | LD-24原子发布或修复后new generation | 把required failure降级、发布不完整port set |
| FZ-03 published hard dependency | 不存在in-place config mutation | FDP-04/07/09 | 仅availability可见,operation不得放宽 | source recovery或new generation | degraded allow / fake / host |
| FZ-03 published read-side | 不存在in-place config mutation | FDP-08 | 是,只读missing / stale / unavailable | formal maintenance / source recovery | query write repair |
| FZ-03 optional telemetry | invalid config仍FDP-02/03 | FDP-08 | 是,local safe diagnostic / formal audit保持 | sink recovery或new generation | disable audit / redaction |
| FZ-04 worker loop | global错误已阻止FZ-03;local错误FDP-05 | FDP-09 delayed / quarantine按正式flow | 仅formal consumer disposition | new loop / redelivery | mutate FZ-03 / guessed truth |
| FZ-05 job | global错误已阻止FZ-03;local错误FDP-05 | FDP-09 partial / failed report | maintenance可显式degraded | new job / formal retry | rewrite old report / repair core truth |
| FZ-06 test / simulation | FDP-06 | formal injected outcome只作用current case | 否 | corrected fixture + rerun | host / real fallback |
| active rollout / rollback | FDP-10 | effect suspect / observation failure FDP-10 | 不构成runtime capability degraded | new approved request / investigation | auto overwrite / old process success claim |

### 9.6 按40个配置组组织的失败策略与四步回指表

| 配置组 / Item | Source / validation回指 | Startup / build失效 | Scoped / runtime失效 | Degraded资格 | 恢复与禁止事项 |
|---|---|---|---|---|---|
| `configIdentity` I001 | C01~08;CFG-VAL-01/02/06/08/15 | CFM-01/02/04/08/11 -> FDP-01/02 | CFM-43/44 drift / observation | 否 | new approved candidate / rollout;不得instance反推desired |
| `entryEnvelope` I002~I006 | C02/C09/C18;CFG-VAL-08~11/23 | invalid global envelope FDP-02 | invalid selector FDP-05;runtime timeout按`03`结果,不取消truth | query timeout可显式unavailable,不是配置降级 | corrected entry;不clamp / raw diagnostics |
| `workerEnvelope` I007~I009 | C10/C18;CFG-VAL-09~11/23 | invalid ceiling FDP-02 | current loop不启动 / FDP-05;运行依赖按CFM-33/34 | consumer仅delayed,非success | new loop;不扩大ceiling /改receipt |
| `jobEnvelope` I010~I013 | C11/C15/C18;CFG-VAL-09~14/23 | invalid global default / retry ref FDP-02 | current job FDP-05;runtime写failed / partial report | maintenance可显式degraded | new job;旧report immutable |
| `featureAssembly` I014~I016 | C13/C24/C25;CFG-VAL-17/18 | CFM-12/13 -> FDP-02/03 | 已发布feature不hot toggle | 否 | complete candidate / generation;不得silent disable enabled capability |
| `truthStore` I017 | C09/C16/C23;CFG-VAL-18~22;SEC-05~12 | required store / material FDP-03/04 | runtime unavailable -> no new accepted mutation | 否 | source recovery / new generation;无memory fallback |
| `projectionStore` I018 | C16/C23;CFG-VAL-20~22 | selected store build FDP-03 | query CFM-32;rebuild CFM-37 | 是,read / maintenance only | maintenance / recovery;query no-write,无truth fallback |
| `derivedStore` I019 | C13/C16/C23;CFG-VAL-18/20~22 | enabled dependency FDP-03 | derived query / job CFM-32/37 | 是,read / maintenance only | rebuild / new generation;不得升格truth |
| `referenceStore` I020 | C16/C23;CFG-VAL-20~22 | required binding FDP-03 | resolver / query CFM-29/32 | read可degraded;command不可猜ref | source recovery;external body不持久化 |
| `relayStore` I021 | C13/C16/C23;CFG-VAL-18/20~22 | publisher enabled时FDP-03 | relay CFM-34 -> FDP-09 | 否,只允许pending / failed fact | retry / new generation;source truth不回滚 |
| `replayStore` I022 | C09/C16/C23;CFG-VAL-20~22 | required replay FDP-03 | unavailable -> no mutation / duplicate missing result formal error | 否 | store recovery;不得duplicate重算 |
| `replayLifecycle` I023~I027 | C25;CFG-VAL-11/17 | retention关系CFM-12 -> FDP-02 | current records按原retention truth;无retroactive删除 | 否 | corrected complete retention set;不缩窗绕replay |
| `contextSource` I028~I030 | C16/C23/C25;CFG-VAL-17/20~22 | required adapter FDP-03 | CFM-29:command reject / consumer delayed / query unavailable | query可degraded;mutation不可 | source recovery / new generation;不造summary |
| `policySource` I031~I034 | C16/C23/C25;CFG-VAL-17/20~22 | source / material缺失FDP-03/04 | CFM-30 -> FDP-04 fail-closed | availability可标degraded,allow不可 | fresh source / new generation;禁止fallback allow |
| `backendCapability` I035~I038 | C15~17/C23/C25;CFG-VAL-13/14/17/20~22 | registry / material / adapter FDP-03 | CFM-31;boundary / launch reject | availability可degraded,execution不可 | capability recovery;无host / guessed support |
| `boundaryEnforcement` I039~I040 | C15/C22/C25;CFG-VAL-13~17 | CFM-14 -> FDP-04 | current establish operation拒绝不完整boundary | 否 | coherent new candidate;不得partial / best-effort |
| `isolationBackend` I041~I043 | C16/C19/C23;CFG-VAL-15/20~22 | real binding / builder FDP-03/04 | launch / inspect unavailable formal failure | 否 | qualified backend / new generation;无host / fake fallback |
| `executionCapture` I044~I048 | C13/C16/C23/C25;CFG-VAL-17/18/20~22 | required capture composition FDP-03 | capture unavailable / failed,不伪success | 否 | source recovery / new generation;body仍禁止输出 |
| `inboundEvents` I049 | C10/C13/C16/C24;CFG-VAL-12/17/18/20/23 | enabled map / material FDP-03 | CFM-33 delayed / quarantine;loop local FDP-05 | 仅formal delayed disposition | new loop / binding;不改schema / guessed payload |
| `eventPublisher` I050 | C13/C16/C23;CFG-VAL-18/20~22 | enabled publisher FDP-03 | CFM-34 retryable / dead-letter | 否 | retry / new generation;truth no rollback |
| `eventRoutes` I051 | C15/C16/C24;CFG-VAL-12~14/17/18/20 | active route不完整FDP-03 | 已有relay fact按原route marker推进 | 否 | complete route map;不拼raw topic |
| `eventRelay` I052~I054 | C11/C15/C18/C25;CFG-VAL-11/13/17/23 | invalid global defaults FDP-02 | current run FDP-05;publish CFM-34 FDP-09 | 否 | new run / formal retry;不重建payload /删relay |
| `materialHandoff` I055~I056 | C13/C15~18/C25;CFG-VAL-12~14/17/18/20~23 | enabled adapter / targets FDP-03 | CFM-35 retryable / failed;job selector FDP-05 | 否 | new job / generation;capture truth不回滚 |
| `observabilityHandoff` I057~I058 | C12/C13/C15~17;CFG-VAL-12~14/17/18/20~22 | enabled composition FDP-03 | target failure CFM-35;formal audit保持 | handoff可failed,不是core degraded | recovery / new generation;不保存ledger body |
| `investigationHandoff` I059~I060 | C12/C13/C15~17;CFG-VAL-12~14/17/18/20~22 | enabled composition FDP-03/04 | CFM-35/36;保持pending / contained | 否 | target recovery;receipt不得release guard |
| `handoffDelivery` I061~I064 | C11/C15/C18/C25;CFG-VAL-11/13/17/23 | invalid defaults / retry relation FDP-02 | current job FDP-05;delivery FDP-09 | 否 | new job / retry;旧fact / report不改写 |
| `leaseSafety` I065~I067 | C15/C18/C22/C25;CFG-VAL-13/16/17/23 | unsafe profile / guard FDP-04 | launch reject;scan item failed / blocked | 否 | source recovery / new scan;expiry只inspect |
| `cleanupSafety` I068~I070 | C15/C18/C22/C25;CFG-VAL-13/16/17/23 | missing / weak guard FDP-04 | CFM-36保持blocked | 否 | evidence / guard recovery;禁止force-clean |
| `backendRelease` I071~I073 | C13/C15~18/C25;CFG-VAL-13/14/17/18/20~23 | release composition FDP-03/04 | CFM-23/36 failed / pending;orphan保持 | 否 | qualified retry / adapter;不得伪Released |
| `redlineSafety` I074~I075 | C13/C22/C25;CFG-VAL-16~18 | containment削弱FDP-04 | CFM-36保持contained并safe escalate | 否 | target recovery;禁止advisory-only / auto release |
| `referenceRefresh` I076~I078 | C11/C18/C25;CFG-VAL-11/17/23 | invalid global threshold FDP-02 | current job FDP-05;item CFM-37 partial / failed | 是,reference保持stale / unavailable | new job / source recovery;不写external truth |
| `projectionMaintenance` I079~I081 | C11/C18/C25;CFG-VAL-11/17/23 | invalid global threshold FDP-02 | current job FDP-05;query / item CFM-32/37 | 是,missing / stale / rebuilding | new job;query不触发write |
| `derivedMaintenance` I082~I084 | C11/C15/C18/C25;CFG-VAL-11/13/17/23 | invalid scope / feature relation FDP-02 | current job FDP-05;partial / degraded report | 是,maintenance/read only | corrected scope / new job;no truth promotion |
| `reconciliationMaintenance` I085 | C13/C25;CFG-VAL-17/18 | enabled composition不完整FDP-02/03 | CFM-37 failed / degraded finding report | 是,report可degraded | new job;禁止auto-fix core truth |
| `runtimeTelemetry` I086~I090 | C12/C14~17/C25;CFG-VAL-10~14/17/19~22 | unsafe labels / redaction / required binding FDP-03/04 | CFM-26 optional external sink FDP-08 | 是,仅external sink | sink recovery;local diagnostic / formal audit保持 |
| `auditTrace` I091 | C13/C15/C22/C25;CFG-VAL-13/16~18 | audit disable / route invalid FDP-04 | store / audit unavailable -> no accepted mutation | 否 | restore mandatory route;不得async-loss / disable |
| `diagnostics` I092~I093 | C14/C15/C22/C25;CFG-VAL-11/13/16/17/19 | unsafe surface / retention FDP-04 | external surface失败只保留local safe diagnostic | 仅surface availability,redaction不降级 | safe profile recovery;不输出raw error |
| `safeOutput` I094~I095 | C14/C15/C22/C25;CFG-VAL-12~14/16/17/19 | deny floor / ref invalid FDP-04 | output field reject + security diagnostic | 否 | equal-or-stricter profile;禁止debug relax |
| `deterministicAdapters` I096~I097 | C19/C20;CFG-VAL-15/24 | invalid P0 test composition FDP-06 | current case formal injected outcome | 否 | corrected fixture;不得进入real-like |
| `testFixtures` I098~I101 | C19/C20;CFG-VAL-12/15/24 | missing / invalid fixture FDP-06 | current case failed;global / real generation不变 | 否 | prior / corrected fixture rerun;无host / real fallback |

本表中的scoped / runtime surface只在对应FZ-03合法原子发布后成立。Optional surface可在LD-22形成FDP-08 disposition,但LD-23仍须形成complete port set并由LD-24原子发布;若同一binding属于required且在build前不可用,仍按FDP-03发布0个handle。

#### 9.6.1 D01~D44配置域Failure Disposition审计

| Domain | Failure disposition | Runtime / recovery guard | 结论 |
|---|---|---|---|
| D01 config source intake | CFM-01/02 -> FDP-01/02 | new source intent;无second-source / default fallback | 通过 |
| D02 runtime profile / identity | CFM-01/04/11/43 | new profile candidate / rollout;identity不含raw | 通过 |
| D03 startup validation | CFM-03~15 -> FDP-01/02 | blocked发布0 handle | 通过 |
| D04 runtime builder / registry | CFM-17~27 -> FDP-03 | complete same-generation rebuild | 通过 |
| D05 sync API envelope | CFM-06/28 | global fail-fast;current entry reject | 通过 |
| D06 worker envelope | CFM-05/06/28 | current loop不启动 | 通过 |
| D07 job envelope | CFM-05~07/28 | current job reject;old report immutable | 通过 |
| D08 feature assembly | CFM-12/13 | enabled dependency不得silent disable | 通过 |
| D09 truth / audit / UoW store | CFM-17~19/24/25 | no accepted mutation / memory fallback | 通过 |
| D10 projection / derived store | CFM-24/25/32/37 | runtime read / maintenance bounded degraded,no truth fallback | 通过 |
| D11 reference store | CFM-24/25/29/32 | source recovery;body-free / no guessed ref | 通过 |
| D12 relay store | CFM-13/24/25/34 | relay fact retained;source truth no rollback | 通过 |
| D13 replay / stored surface | CFM-12/24/25 | no mutation;duplicate不重算 | 通过 |
| D14 context source | CFM-17~19/29 | command reject / consumer delayed / query unavailable | 通过 |
| D15 policy source | CFM-17~19/30 | fail-closed;availability marker不授权allow | 通过 |
| D16 backend capability | CFM-17~19/31 | boundary / launch reject;no assumed support | 通过 |
| D17 coherent boundary | CFM-14 | four dimensions atomic,no partial degrade | 通过 |
| D18 backend lifecycle | CFM-17~21/24/25/31 | no host / fake fallback | 通过 |
| D19 execution capture | CFM-17~21/24/25 | formal unavailable / failed,no fake success | 通过 |
| D20 backend handle / lease | CFM-20~23/36 | stop-new-use / orphan guard;no force release | 通过 |
| D21 inbound subscription | CFM-13/17~21/28/33 | loop reject / delayed / quarantine | 通过 |
| D22 publisher | CFM-13/17~21/24/25/34 | retry / failed marker,no truth rollback | 通过 |
| D23 route binding | CFM-07/12/13/17~19 | complete closed map;no raw topic synthesis | 通过 |
| D24 relay delivery | CFM-06/07/28/34 | new run / retry;relay fact retained | 通过 |
| D25 material handoff | CFM-07/12/13/17~21/28/35 | source capture retained | 通过 |
| D26 observability handoff | CFM-07/12/13/17~21/35 | formal audit独立 | 通过 |
| D27 investigation handoff | CFM-07/12/13/17~21/35/36 | containment retained;receipt no release | 通过 |
| D28 handoff retry | CFM-06/07/12/28/35 | old fact / report immutable | 通过 |
| D29 lease / orphan | CFM-07/09/20~23/28/36 | expiry inspect-only;unavailable no release | 通过 |
| D30 cleanup guard | CFM-09/15/28/36 | missing evidence defaults blocked | 通过 |
| D31 backend release | CFM-13/17~23/24/25/28/36 | orphan retained;no fake Released | 通过 |
| D32 redline | CFM-09/15/17~21/35/36 | containment always active | 通过 |
| D33 reference refresh | CFM-06/28/29/37 | partial report / stale marker,no external truth write | 通过 |
| D34 projection rebuild | CFM-06/28/32/37 | query no-write;maintenance only | 通过 |
| D35 derived view | CFM-06/12/13/28/32/37 | no truth promotion | 通过 |
| D36 reconciliation | CFM-12/13/24/25/37 | degraded report,no auto-fix | 通过 |
| D37 runtime log / metric | CFM-10/17~22/26 | optional sink only degraded;safe local signal remains | 通过 |
| D38 audit / trace | CFM-09/15/17~19/24/25 | no accepted mutation without audit | 通过 |
| D39 diagnostic issue | CFM-10/15/28 | local safe diagnostic only;no raw fallback | 通过 |
| D40 redaction gate | CFM-09/10/15 | field / candidate reject;deny floor immutable | 通过 |
| D41 profile composition | CFM-01/08/11/16 | profile reject / inactive,no lower profile fallback | 通过 |
| D42 deterministic fixture | CFM-16 | FDP-06 current case only | 通过 |
| D43 real-like composition | CFM-11/16~19 | profile blocked / inactive,no fake / host | 通过 |
| D44 overlay / reload trigger | CFM-08/46 | reject + design reopen;无online LKG | 通过 |

本表不新增Domain或carrier。D01~D44名称与Step 9一致;其failure disposition必须与§9.6配置组、§9.3 CFM和正式`03`既有surface同时成立。

### 9.7 Complete Generation与Post-publication依赖角色降级资格矩阵

本表描述complete generation在LD-22允许的optional degraded disposition及其发布后的availability变化。普通command input invalid、domain state conflict、UoW failure或业务target response并不自动成为config failure;只有其直接原因是config-owned binding / material / availability时才关联本Step的CFM。

| Runtime role | Config-owned失效输入 | 允许surface | 必须保持 | 禁止降级 |
|---|---|---|---|---|
| truth / UoW / audit mutation path | store material / availability loss | mutation unavailable / rejected;safe diagnostic | no partial truth、same-UoW audit、idempotency原结果 | memory fallback、accepted-without-audit |
| context resolver for command | source stale / unavailable | `ReferenceUnresolved` / unavailable | no guessed summary、no mutation | stale-allow / fake context |
| context / projection query | reference / projection missing | missing / stale / degraded / unavailable | query no-write、safe pagination | query rebuild / truth repair |
| policy decision | source missing / stale / conflicted / denied | fail-closed rejected / blocked | high-risk guard、audit安全字段 | degraded allow / cached permissive default |
| backend capability / boundary | capability stale / adapter unavailable | availability marker + boundary / launch reject | four-dimension coherent boundary | partial dimension、host-run、assumed support |
| isolation backend lifecycle | material / backend unavailable | establish / launch / inspect / release typed failure | handle / lease / cleanup / redline safety | weak backend / fake in real-like |
| execution capture | capture adapter / material unavailable | capture unavailable / failed formal surface | no fake capture success、no body leak | command success pretending capture complete |
| inbound consumer | source / resolver transient unavailable | delayed / retryable;invalid or forbidden -> quarantine | dedup / receipt / no guessed truth | ack success without formal disposition |
| relay publisher | publisher / route dependency unavailable | retryable / failed / dead-letter marker | source truth / relay fact retained | source rollback / payload reconstruction |
| handoff target | adapter / target unavailable | pending / retryable / failed marker | capture / cleanup / redline source facts | truth promotion / containment release |
| cleanup / release / redline | evidence / adapter / target unavailable | blocked / orphan / contained / failed | guard order、manual intervention marker | force-clean / fake release / advisory containment |
| reference / projection maintenance | source / store unavailable | per-item partial / degraded / failed report | no core truth repair、stored report replay | global success with lost items |
| derived / reconciliation maintenance | dependency / scope unavailable | partial / degraded report / no finding promotion | source snapshot refs、no auto-fix | mutate core truth / invent finding |
| external telemetry sink | sink material / availability loss | external sink degraded | safe local diagnostic、formal audit、redaction floor | raw troubleshooting output / disable audit |
| diagnostic external surface | target unavailable | local safe diagnostic only | quiet / safe仍redacted | raw / verbose body fallback |

### 9.8 Logical Alert与Safe Signal矩阵

Alert class只表示处理紧迫性和下游路由意图,不定义具体产品severity、阈值、notification channel或on-call owner。

| Alert ID /类别 | 触发条件 | 处理意图 | Safe signal最小字段 | 不得出现 |
|---|---|---|---|---|
| ALC-01 security / invariant immediate | raw material、NCFG、weak boundary、policy fail-open、revoke、audit / guard / redaction削弱 | 阻止或停止新使用,安全调查 | stable CFM / CFG-VAL / SEC class、profile、item / group、safe reason / diagnostic ref、generation / scope ref optional | raw value、full ref、material version、endpoint、topic、actor credential |
| ALC-02 startup / rollout blocking | source、schema、cross-field、profile、atomic publish或apply失败 | 阻断candidate / rollout并保留disposition | issue class、candidate / generation safe marker ref、failed stage、profile、rollout ref optional | full candidate diff、host list、process pid |
| ALC-03 dependency unavailable | required provider / store / adapter、consumer、relay、handoff、safety dependency失败 | 按role retry / block / fail,聚合重复信号 | adapter kind、availability class、owner item、safe failure ref、operation class | SDK / HTTP / SQL body、stack、payload |
| ALC-04 change / drift control | effect suspect、rollback failed、drift、observation incomplete | 冻结自动动作,进入调查 /新request | CCS / CDR class、desired / observed safe marker refs、rollout scope ref、diagnostic ref | observed details作为metric label、完整diff、虚构actor |
| ALC-05 scoped / test rejection | entry / loop / job / fixture输入非法 | 返回当前scope失败并聚合误用 | scope class、item / rule ID、validation disposition、report / case ref optional | raw input、target full ref、fixture body |
| ALC-06 bounded degraded | read / maintenance / optional telemetry受限 | 显式展示degraded,观察持续时间与恢复 | surface kind、availability / freshness class、safe reason ref、generation ref | marker / instance / actor作为metric label、body |

Signal carrier分工:

| Carrier | 允许用途 | 约束 |
|---|---|---|
| sanitized local log | store前startup issue、runtime safe diagnostic | 不伪造durable audit;字段通过I095 deny floor |
| low-cardinality metric | CFM / FDP / ALC class计数、stage / profile class | 不得携带item value、marker、generation、instance、actor或ref label |
| `SandboxConfigValidationAudit` | store可用且已有formal diagnostic marker后的config validation事实 | 不为early failure伪造accepted audit;不承载完整change record |
| `SandboxAdapterAvailabilityAudit` | formal operations job / runtime registry保存availability marker时 | 只记adapter slot / kind、state、safe failure ref和formal time ref |
| receipt / report / relay / handoff marker | 已进入正式consumer / job / delivery flow后的disposition | 不把业务失败改写成config validation success / failure |
| ops-private change record | apply / rollback / drift / observation lifecycle | 归release / operations plane,不新增L4 public DTO / business audit kind |

### 9.9 恢复与禁止动作矩阵

| Recovery ID /场景 | 恢复前提 | 允许恢复动作 | 成功判定 | 禁止动作 |
|---|---|---|---|---|
| RCV-01 source / schema invalid | corrected complete source可取回 | new startup从LD-01重跑 | new candidate通过V01~V10并发布 | fallback低层 / patch current FZ-03 |
| RCV-02 profile / cross-field invalid | complete compatible composition | corrected candidate全量revalidate | atomic new generation | 拆分feature / partial boundary |
| RCV-03 scoped input invalid | corrected typed input且仍在FZ-03 ceiling / registry内 | new entry / loop / job | new scoped snapshot通过 | 修改old receipt / report / global config |
| RCV-04 fixture invalid | corrected fixture与PROFILE-01~04资格成立 | new case / simulation rerun | FZ-06通过 | host / real dependency fallback |
| RCV-05 required S04 / adapter build失败 | valid descriptor / provider / adapter availability恢复 | same approved candidate重新完整build或new request | full generation原子发布 | reuse partial adapter / bypass audit |
| RCV-06 material renew failed before expiry | old lease仍明确valid | bounded continue + prepare renew / generation replacement | valid renew或new generation在expiry前就绪 | 延长expiry / ordinary config mutation |
| RCV-07 material expired / revoked | new forward-safe binding已批准 | stop new use + new generation / termination / restart | new valid lease / generation;revoked version未使用 | rollback revoked / expired version |
| RCV-08 read-side degraded | source / projection恢复或formal maintenance可运行 | refresh / rebuild / new read | formal freshness / projection marker恢复 | query写修复 / promote external truth |
| RCV-09 consumer delayed | transient dependency恢复且dedup identity不变 | formal redelivery / retry | stored receipt按existing flow完成 | guessed truth / duplicate side effect |
| RCV-10 relay / handoff failed | retry policy允许且source fact仍有效 | new formal retry / job | delivery marker / report完成 | rollback source truth / overwritefailed fact |
| RCV-11 cleanup / redline blocked | evidence、investigation、target或release前置正式满足 | new guarded evaluation / retry | existing state machine合法迁移 | force-clean / receipt auto-release |
| RCV-12 apply effect suspect | safe investigation支持新决策 | new rollback / forward change request | approved generation按scope观察闭合 | mutate current generation / deleteaudit |
| RCV-13 rollback failed | compatible forward / prior candidate可重新评审 | new child request重走CAP | new generation + honest disposition | old process alive算success / skip validator |
| RCV-14 drift / observation gap | desired、scope、observation事实补齐 | investigate / apply / rollback / restore observation | CDR-04 within declared scope | observed auto overwrite desired / infer missing marker |
| RCV-15 remote config / online LKG需求 | 先完成`03/04`正式重开 | 新design baseline后再实现 | 新contract通过后续设计 /测试 /验收 | 在当前baseline下私造fallback |

### 9.10 测试切口表

测试切口是后续`05-测试方案.md`的设计输入,不代表测试已实现或执行。

| Test Cut ID | 覆盖失效 | 最小断言 |
|---|---|---|
| FDT-01 source selector conflict | CFM-01 | reject before reading second source;safe issue only |
| FDT-02 explicit source unavailable | CFM-02 | fail-fast;no S01 / alternate path fallback |
| FDT-03 strict parse / duplicate / unknown | CFM-03 | JSONC/comment/trailing comma/duplicate/alias/unknown all rejected |
| FDT-04 invalid high winner | CFM-04 / CFM-06 | no lower-source fallback and no clamp |
| FDT-05 required / activation missing | CFM-05/13 | global publishes zero;scope only rejects current invocation |
| FDT-06 ref / registry ambiguity | CFM-07 | no substring / arbitrary provider choice |
| FDT-07 unsupported source / reload / LKG | CFM-08 / CFM-46 | CFG-VAL-06 + design gate;old process not success evidence |
| FDT-08 NCFG override | CFM-09 | each forbidden class reject / no builder |
| FDT-09 secret and carrier leak | CFM-10 | no raw/full ref/material in log/metric/audit/error/report/workload |
| FDT-10 profile qualification | CFM-11 / CFM-16 | P05+ fake/incomplete and P07 activation rejected;fixture isolated |
| FDT-11 XVAL negative matrix | CFM-12~15 | XVAL-01~36 failure yields exact blocked / fail-closed disposition |
| FDT-12 provider / descriptor failures | CFM-17~19 | no S04-before-approval,raw/fake/other-provider fallback or partial build |
| FDT-13 material lifecycle | CFM-20~23 | expiry/revoke stop new use;renew bounded;release failure prevents reuse |
| FDT-14 constructor / availability | CFM-24 / CFM-25 | every required failure publishes zero handles |
| FDT-15 optional telemetry degraded | CFM-26 | external sink degraded;local diagnostic/formal audit/redaction remain |
| FDT-16 generation atomicity | CFM-27 | mixed identity / partial adapter set never visible |
| FDT-17 scoped negative matrix | CFM-28 | entry/loop/job reject independently;FZ-03 and old formal result unchanged |
| FDT-18 context / policy / capability runtime | CFM-29~31 | no guessed context,policy fail-closed,degraded capability cannot authorize launch |
| FDT-19 query degraded no-write | CFM-32 | missing/stale/degraded surface and zero write UoW |
| FDT-20 consumer delayed / quarantine | CFM-33 | unavailable delayed;invalid/forbidden quarantine;no guessed truth |
| FDT-21 relay / handoff no rollback | CFM-34 / CFM-35 | failed marker / report only;source truth/capture/guard unchanged |
| FDT-22 cleanup / redline guard | CFM-36 | missing dependency remains blocked/orphan/contained;no force success |
| FDT-23 maintenance partial / no-repair | CFM-37 | per-item partial/degraded report;no core truth repair |
| FDT-24 rejected change no activation | CFM-38 | S04 / build not invoked;safe rejection retained |
| FDT-25 apply failure honesty | CFM-39 | desired / observed mismatch retained;active failed rollout closes;old process not applied |
| FDT-26 effect suspect control | CFM-40 | no auto mutation;new investigation / request required |
| FDT-27 rollback invalid / failed | CFM-41 / CFM-42 | current validator enforced;parent/child failure history immutable |
| FDT-28 drift classification | CFM-43 / CFM-44 | only active same-scope rollout gives pending;missing observation never aligned |
| FDT-29 no hidden config TTL | CFM-45 | ordinary config expiry assumption rejected;only declared expiry classes handled |
| FDT-30 alert carrier safety | ALC-01~06 | safe fields only;no marker/ref/instance/actor metric labels |

### 9.11 配置失效逐组停审记录

停审列固定检查:source / validation失败是否完整、startup / build影响是否明确、scope / runtime surface是否承接正式`03`、degraded是否越界、恢复是否改写既有事实。`通过`只表示设计闭合,不表示实现、测试、告警、部署或验收已完成。

| 配置组 | Source / Validation | Startup / Scope / Runtime | Degraded边界 | Recovery / No-fallback | 结论 |
|---|---:|---:|---:|---:|---|
| `configIdentity` | 是 | 是 | 是 | 是 | 通过;drift不自动改desired |
| `entryEnvelope` | 是 | 是 | 是 | 是 | 通过;timeout不取消已提交truth |
| `workerEnvelope` | 是 | 是 | 是 | 是 | 通过;invalid loop不启动 |
| `jobEnvelope` | 是 | 是 | 是 | 是 | 通过;old report不改写 |
| `featureAssembly` | 是 | 是 | 是 | 是 | 通过;enabled dependency不得silent disable |
| `truthStore` | 是 | 是 | 是 | 是 | 通过;required mutation path无degrade / memory fallback |
| `projectionStore` | 是 | 是 | 是 | 是 | 通过;query degraded仍no-write |
| `derivedStore` | 是 | 是 | 是 | 是 | 通过;derived不升格truth |
| `referenceStore` | 是 | 是 | 是 | 是 | 通过;无external body / guessed ref |
| `relayStore` | 是 | 是 | 是 | 是 | 通过;publish failure no rollback |
| `replayStore` | 是 | 是 | 是 | 是 | 通过;duplicate missing result不重算 |
| `replayLifecycle` | 是 | 是 | 是 | 是 | 通过;retention冲突fail-fast |
| `contextSource` | 是 | 是 | 是 | 是 | 通过;command不使用fake summary |
| `policySource` | 是 | 是 | 是 | 是 | 通过;missing / stale / conflict fail-closed |
| `backendCapability` | 是 | 是 | 是 | 是 | 通过;degraded marker不授权launch |
| `boundaryEnforcement` | 是 | 是 | 是 | 是 | 通过;四维不可partial degrade |
| `isolationBackend` | 是 | 是 | 是 | 是 | 通过;无host / fake real-like fallback |
| `executionCapture` | 是 | 是 | 是 | 是 | 通过;不得伪capture success |
| `inboundEvents` | 是 | 是 | 是 | 是 | 通过;delayed / quarantine分类明确 |
| `eventPublisher` | 是 | 是 | 是 | 是 | 通过;source truth immutable |
| `eventRoutes` | 是 | 是 | 是 | 是 | 通过;无raw topic synthesis |
| `eventRelay` | 是 | 是 | 是 | 是 | 通过;run failure不删relay fact |
| `materialHandoff` | 是 | 是 | 是 | 是 | 通过;capture truth retained |
| `observabilityHandoff` | 是 | 是 | 是 | 是 | 通过;formal audit独立 |
| `investigationHandoff` | 是 | 是 | 是 | 是 | 通过;receipt不解除containment |
| `handoffDelivery` | 是 | 是 | 是 | 是 | 通过;failed fact / report保留 |
| `leaseSafety` | 是 | 是 | 是 | 是 | 通过;expiry只inspect不delete |
| `cleanupSafety` | 是 | 是 | 是 | 是 | 通过;missing evidence默认blocked |
| `backendRelease` | 是 | 是 | 是 | 是 | 通过;release failure不伪Released |
| `redlineSafety` | 是 | 是 | 是 | 是 | 通过;containment不是advisory |
| `referenceRefresh` | 是 | 是 | 是 | 是 | 通过;partial report不写external truth |
| `projectionMaintenance` | 是 | 是 | 是 | 是 | 通过;query不触发rebuild |
| `derivedMaintenance` | 是 | 是 | 是 | 是 | 通过;scope失败不promote truth |
| `reconciliationMaintenance` | 是 | 是 | 是 | 是 | 通过;no auto-fix |
| `runtimeTelemetry` | 是 | 是 | 是 | 是 | 通过;只允许external sink degraded |
| `auditTrace` | 是 | 是 | 是 | 是 | 通过;accepted mutation无audit不得继续 |
| `diagnostics` | 是 | 是 | 是 | 是 | 通过;local fallback仍safe / redacted |
| `safeOutput` | 是 | 是 | 是 | 是 | 通过;deny floor不可降级 |
| `deterministicAdapters` | 是 | 是 | 是 | 是 | 通过;fixture隔离 |
| `testFixtures` | 是 | 是 | 是 | 是 | 通过;无host / real fallback |

### 9.12 跨失效策略审计表

| 审计项 | 结论 | 证据 /修正 | unresolved缺口 |
|---|---|---|---|
| C01~C27是否全部承接 | 是 | §9.4;C01明确为non-failure,其余均映射CFM | 无 |
| CFG-VAL-01~25是否全部承接 | 是 | §9.4与§9.3 | 无 |
| SEC-01~18是否全部承接 | 是 | §9.4与CFM-10/17~23/26/27 | 无 |
| I001~I101是否全部覆盖 | 是 | §9.6按40组覆盖Step 7完整集合 | 无 |
| 40配置组是否逐组停审 | 是 | §9.11与§9.6组名 /顺序一致 | 无 |
| required / conditional-active是否silent default | 否 | CFM-05/13 + FDP-02/03 | 无 |
| high-priority invalid是否fallback低层 | 否 | CFM-04 + RCV-01 | 无 |
| invalid candidate是否发布degraded generation | 否 | FDP-01~03与§9.5 | 无 |
| required adapter是否partial publish | 否 | CFM-24/25/27;LD-24发布0或完整 | 无 |
| hard guard是否允许degraded allow | 否 | FDP-04与§9.7;policy / boundary / audit / cleanup / redline / redaction闭集 | 无 |
| optional telemetry degraded是否削弱formal audit | 否 | CFM-26与runtimeTelemetry停审 | 无 |
| query degraded是否触发写修复 | 否 | CFM-32 / RCV-08;query no-write | 无 |
| consumer delayed是否造guess truth | 否 | CFM-33 / RCV-09 | 无 |
| relay / handoff失败是否回滚source truth | 否 | CFM-34/35与FDP-09 | 无 |
| maintenance failure是否repair core truth | 否 | CFM-37;partial report only | 无 |
| material expiry / revoke是否silent continue | 否 | CFM-20/21 + FDP-07 | immediate callback仍为future reopen,当前按已有hook / termination边界 |
| renew failure是否无限延长lease | 否 | CFM-22只允许到明确expiry | 无 |
| config center不可达是否自动LKG | 否 | CFM-46;S07 unsupported | future引入须重开`03/04` |
| old process是否算LKG / apply / rollback成功 | 否 | §9.1不变量 + CFM-39/42 | 无 |
| drift是否自动互相覆盖 | 否 | CFM-43/44 + FDP-10 | rollout carrier留`07/09` |
| ordinary config是否被发明隐含TTL | 否 | CFM-45;只承认明确expiry / freshness / compatibility | 无 |
| alert是否泄露raw / full ref / body | 否 | §9.8 ALC / carrier字段闭集 | exact产品 /阈值留`09` |
| early startup是否伪造accepted audit | 否 | sanitized local signal;store可用后才conditional config audit | 无 |
| 失败恢复是否改写accepted truth / receipt / report | 否 | RCV-01~15与Step 10 no-truth-rewrite | 无 |
| 是否把业务错误全部误归config failure | 否 | §9.7仅config-owned binding / material / availability关联CFM | 无 |
| 是否需要立即回写`03` | 否 | 现有error / availability / receipt / report / diagnostic足够承接 | future remote / LKG / hot / new DTO trigger已登记 |

### 9.13 Historical Material / Blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-CFG-FAILURE-001 | design gap | resolved_for_cfg_step_11 | Step 5/7/8/9/10失败面分散,尚无统一策略 /告警 /恢复 /测试闭环 | 本文件已闭合FDP / FDS / CFM / ALC / RCV / FDT、40组回指和停审 |
| SBX-CFG-FAILURE-DEGRADED-001 | safety watch | resolved_by_strict_boundary | `RuntimeConfigStatus::Degraded`可能被误用为invalid config或hard guard放宽 | 固定为ordinary validation通过、无required failure且完整原子发布的read / maintenance / optional telemetry有限surface |
| SBX-CFG-FAILURE-CARRIER-001 | carrier watch | resolved_existing_surface_no_writeback | Step 11 logical IDs不是`03` public enum / DTO | 映射existing error / availability / receipt / report / diagnostic;不新增public contract |
| SBX-CFG-FAILURE-ALERT-001 | downstream operations gap | open_for_05_06_07_09 | 告警产品、阈值、聚合窗口、notification和runbook未定义 | 不阻塞Step 11;§9.8只定义logical class和safe fields |
| SBX-CFG-FAILURE-REMOTE-001 | future blocker | blocker_if_requested | remote config、online LKG、reload / hot recovery无当前source / consistency / audit contract | 当前reject;若要求先回写`03`并重开`04` Step 4~13 |
| SBX-CFG-FAILURE-PROVIDER-001 | P05+ activation gap | open_for_p05_p06_p07_activation | provider产品、principal、native audit、revocation hook和平台anti-leak未验证 | 不阻塞P0 / Step 11;激活前由`05/06/07/09`资格闭合 |
| SBX-CFG-FAILURE-ROLLOUT-001 | downstream carrier gap | open_for_07_09 | desired / observed / rollout observation物理载体和fleet completion未选择 | 不阻塞Step 11;保持Step 10产品中立FDP-10 / ALC-04 |
| SBX-CFG-FAILURE-HIST-001 | historical_material | contained | 旧README/05/06可能诱导host fallback、silent disable、default no-egress或old environment LKG | 未继承;所有weak fallback / hot路径均拒绝 |
| SBX-DOC-GAP-TEST-001 | downstream document gap | open | 正式`05`仍是旧材料 | 不阻塞Step 11;后续承接FDT-01~30和40组negative matrix |
| SBX-DOC-GAP-ACCEPT-001 | downstream document gap | open | 正式`06`仍是旧材料 | 不阻塞Step 11;silent fallback、hard-guard degrade、partial publish、truth rewrite进入veto候选 |

当前未发现阻塞Step 11完成的上游blocker。告警 / rollout / provider物理产品和P05+平台事实缺失是下游资格缺口,不得在本Step伪造成已选型、已告警或已测试。

### 9.14 对下游文档的影响总表

| 下游 | 从本Step接收 | 本Step不提供 |
|---|---|---|
| `04` Step 12 | CFM-01~46、ALC-01~06、FDT-01~30、40组失败策略和开放carrier gap | 完整`05/06/07/09`承接表 |
| `04` Step 13 | unsupported remote / LKG / reload、ordinary no-TTL、provider / marker演进触发 | migration / deprecation版本策略 |
| `05-测试方案.md` | source / schema / material / generation / scope / runtime / rollback / drift negative matrix | 测试实现、执行结果、run_id、evidence |
| `06-验收标准.md` | silent fallback、fail-open、partial publish、weak backend、truth rewrite、unsafe alert carrier否决候选 | 验收签署 /风险接受 |
| `07-实施计划.md` | FDP / FDS阶段映射、safe issue / availability integration、alert hook和marker carrier实施输入 | phase / commit、ledger、skeleton或实现已存在事实 |
| `09-部署与运维手册.md` | ALC路由意图、RCV恢复前提、rollout / provider / alert产品中立输入 | 具体命令、阈值、账号、路径、endpoint、pager和runbook |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| invalid candidate不发布degraded generation | 否 | 承接Step 9 LD-22~24与existing builder state | 不适用 | no_writeback |
| hard guard unavailable时相关operation fail-closed | 否 | 承接正式`03` policy / boundary / cleanup / redline错误边界 | 不适用 | no_writeback |
| read / maintenance / optional telemetry bounded degraded | 否 | 承接existing query / job / availability surface | 不适用 | no_writeback |
| consumer delayed / quarantine、relay / handoff failed marker | 否 | 承接existing receipt / report / marker和no-rollback flow | 不适用 | no_writeback |
| material expiry / revoke stop-new-use | 否 | 承接Step 8与`03` adapter / runtime termination边界 | 不适用 | resolved_watch_no_writeback |
| Step 11 FDP / CFM / ALC / RCV / FDT为logical design ID | 否 | 不新增public enum、DTO、port、audit kind或repository | 不适用 | no_writeback |
| remote config center、online LKG、reload / hot recovery | 是,若要求 | 改变loader、runtime state、concurrency、rollback、audit和entry flow | `03` Step 6 / 7 / 9 / 10 / 12~15 | blocker_if_requested |
| immediate revocation callback / new runtime failure DTO | 是,若要求 | 新增adapter callback、termination flow或public error carrier | `03` Step 7 / 8 / 9 / 12 / 14 / 15 | blocker_if_requested |

本Step没有当前`待回写`项。No-writeback成立的前提是所有logical ID保持文档级分类,实现复用正式`03`既有safe surface,且不新增remote / LKG / reload / hot / callback能力。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“失效策略词汇”“失效检测阶段”“失效模式总表”“40配置组失败策略”“Complete Generation与Post-publication依赖角色”“Logical Alert”“恢复矩阵”“测试切口”“逐组停审”和“跨失效策略审计”。

正式`04-配置设计.md` §11应回填:

1. FDP-01~10策略词汇与跨策略不变量。
2. FDS-01~10检测阶段和影响半径。
3. CFM-01~46失效模式总表,保留影响、行为、告警与测试切口。
4. C01~C27、CFG-VAL-01~25、SEC-01~18完整承接说明。
5. activation / freeze到失效策略矩阵。
6. 40配置组failure / degraded / recovery表,保持I001~I101覆盖。
7. post-publication依赖角色与degraded资格闭集。
8. ALC-01~06 logical alert和safe carrier分工。
9. RCV-01~15恢复与禁止动作。
10. FDT-01~30测试切口、逐组停审和跨失效审计。
11. historical / blocker、下游影响和`03`影响判定。

正式装配不得:

- 把invalid candidate写成ReadyWithWarnings / Degraded。
- 把policy、四维boundary、truth / audit store、cleanup、redline或redaction失效写成继续执行。
- 把old process继续运行写成online LKG、apply / rollback成功或fleet aligned。
- 把remote config center不可达写成当前runtime场景;当前能力是unsupported source declaration reject。
- 把业务adapter所有错误都归为config failure,或新增public failure enum / audit kind。
- 写具体告警阈值、产品、测试结果、evidence、验收或实现事实。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 11 | 后续处理 |
|---|---|---:|---|
| alert产品、severity映射、聚合窗口和阈值 | operations detail | 否 | Step 12交`05/06/07/09`;不得改变ALC safe fields |
| desired / observed / rollout observation物理carrier | downstream carrier gap | 否 | `07/09`定义;无scope / observation不得aligned |
| P05/P06 provider产品与revocation hook | activation gap | 否 | 激活前完成资格、测试、验收和runbook |
| immediate material revocation callback | future reopen | 否 | 当前按bounded lease / provider deny / termination;要求时回写`03` |
| runtime failure是否需要新增public DTO variant | not requested | 否 | 当前复用existing error / receipt / report;要求时回写`03` |
| online LKG / remote config / hot reload未来是否需要 | unsupported future | 否 | Step 13 / 14登记;要求时重开`03/04` |
| ordinary config retention / TTL | no current contract | 否 | 当前不发明TTL;若未来需要先定义source / marker / expiry / audit语义 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 10 | 通过 | 本次确认只放行Step 11 |
| FDP-01~10策略边界连续且互斥可判 | 通过 | §9.1编号连续;candidate / startup / generation / fail-closed / scoped / test / stop-new-use / degraded / marker / control主语可判 |
| FDS-01~10检测阶段连续且影响半径明确 | 通过 | §9.2编号连续;source到change control各阶段均有恢复单位 |
| CFM-01~46失效模式连续且含告警 /测试 | 通过 | §9.3编号连续;每项均关联ALC与FDT切口 |
| C01~C27、CFG-VAL-01~25、SEC-01~18完整承接 | 通过 | §9.4范围与逐ID扫描完整;C01保留为non-failure正常路径 |
| I001~I101由40配置组完整覆盖 | 通过 | §9.6共40行;Item集合恰好覆盖101项且无重复 /遗漏 |
| 40配置组与Step 7 / 10组名及顺序一致 | 通过 | §9.6 / §9.11与Step 7原顺序逐项一致 |
| ALC-01~06 safe signal闭合 | 通过 | §9.8编号连续;carrier与禁止字段闭合 |
| RCV-01~15恢复路径连续且无truth rewrite | 通过 | §9.9编号连续;恢复单位均为new candidate / generation / invocation或formal maintenance |
| FDT-01~30测试切口连续 | 通过 | §9.10编号连续且显式覆盖CFM-01~46 |
| invalid / hard guard / degraded / delayed / failed / control边界闭合 | 通过 | §9.1 / §9.5 / §9.7 |
| remote config / LKG / ordinary expiry口径明确 | 通过 | CFM-08/45/46 |
| 逐组停审和跨失效审计无unresolved conflict | 通过 | §9.11共40行且顺序一致;§9.12无未处置冲突 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future blocker已登记 |
| 未创建正式`04`、Step 12或实现类文件 | 通过 | 文件检查未发现正式`04`、Step 12、implementation ledger或planned boundary skeleton |

```text
current_document = `04-配置设计.md`
current_step = Step 11 `定义失效模式与降级 / fail-fast 策略`
gate_status = passed_to_step_12
next_allowed_action = Step 12已按门禁创建并完成;当前等待用户审查`04_config_step_12_downstream_handoff.md`
formal_document_write = not_started
commit_required = no
```
