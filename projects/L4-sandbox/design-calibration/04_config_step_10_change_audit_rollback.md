# Step 10. 定义配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/配置设计书写规范.md` §5.10
> 回填章节: `04-配置设计.md` §10 配置变更、审计与回滚
> 生成日期: 2026-07-11
> 状态: reviewed_passed_to_step_11
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接Step 7的I001~I101、Step 8的sensitive / S04 lifecycle、Step 9的restart-only generation / scoped snapshot和正式`03`安全审计边界,定义产品中立的变更职责、风险评审、safe diff、apply、rollback、drift和审计规则。不得写具体工单 / 审批 / 发布产品、实现代码、部署命令、真实actor、run_id、evidence alias、测试结果、验收签署、implementation ledger、planned boundary skeleton或commit boundary。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入Step 10 | 是。用户审查Step 9后回复“同意”,本次只放行Step 10。 |
| 项目级台账是否允许进入Step 10 | 是。恢复点为Step 9 `pass_wait_review`,且用户已明确确认。 |
| 文档级flow是否允许进入Step 10 | 是。Step 9的I001~I101、D01~D44、LD/XVAL/CFG-VAL/SEC和atomic publication已闭合。 |
| 是否读取Step 10 SOP /书写规范 | 是。必须输出变更表、审计 /回滚规则、逐类停审和跨变更审计。 |
| 是否读取Step 7/8/9 | 是。已复核40个配置组、40项sensitive、23个M slot、FZ-01~06和restart-only语义。 |
| 是否读取详细设计错误 /审计边界 | 是。已复核正式`03` §11/§14和`03_ddd_step_15_observability_audit.md`。 |
| 是否参考L1项目粒度 | 是。参考L1-governance / L1-artifact Step 10结构,但不继承其digest、actor、GRC或项目特有配置。 |
| 当前状态 | 已完成并通过语义一致性与机械门禁;用户已确认并放行Step 11 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_10_change_audit_rollback.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md`仍不存在;只允许Step 15装配 |
| 停审方式 | 本Step完成后暂停;用户确认前不得进入Step 11 |
| 是否发现阻塞本Step的上游blocker | 否。Change-control / release载体产品未选择,但可用产品中立ops-private契约闭合;若要求runtime mutation API或L4内部change object则转为`03`回写blocker。 |

---

## 2. 本步目标与非范围

本Step把“候选配置能够通过Step 9构造generation”推进到“配置变化有明确责任、评审、审计、apply和rollback行为”。它必须同时避免两种伪闭环:把“旧process仍在运行”写成新配置回滚成功,以及把“完整配置diff写入日志”写成可审计。

本Step必须回答:

- S01~S08每种来源的变化由谁发起、哪些是普通change、哪些必须拒绝或重开设计。
- I001~I101按40个配置组分别属于什么风险、谁可提议、如何评审、何时生效、如何审计与回滚。
- resource / timeout / retention / freshness等有方向性的变化如何升级风险。
- feature、route、target、backend、boundary、cleanup、redline、audit和redaction变化为何属于高风险或不可配置变化。
- sensitive ref change、registry descriptor change和same-ref material version rotation如何分层。
- 完整candidate如何形成safe change manifest,何时允许调用S04,何时才算applied。
- startup失败、builder失败、publish前失败、publish后效果异常、scoped input失败和rollback自身失败如何处理。
- desired marker与observed generation marker不一致时如何记录drift,为何不能自动互相覆盖。
- release / operations change record、L4 config validation audit、provider native audit和business audit如何分工。

本Step不定义:

- 具体ticket、审批、IAM、release、deployment、secret manager、CMDB、config repository或audit产品。
- 具体actor账号、角色绑定、权限授予流程或member lifecycle orchestration。
- runtime hot reload、remote config、admin override、last-known-good live switch、partial generation或hot adapter swap。
- 流量切换、实例编排、进程drain、软件binary rollback和部署命令;这些留给`07` / `09-部署与运维手册.md`。
- 撤销已经提交的sandbox truth、audit、relay、receipt、report、handoff、capture或cleanup/redline事实。
- Step 11完整失效 /告警 /恢复矩阵。
- 实现代码、真实change record、测试结果、evidence、验收或commit。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供S00~S08、C01~C27、no-fallback和C26 drift候选 |
| `04_config_step_06_environment_profiles_matrix.md` | reviewed | 提供PROFILE-01~07资格、P05/P06 conditional和P07 inactive边界 |
| `04_config_step_07_config_items.md` | reviewed | 提供I001~I101、40配置组、来源、作用域、生效、敏感性和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | reviewed | 提供40项sensitive分类、23个M slot、ref / version rotation、audit最小字段和SEC-01~18 |
| `04_config_step_09_loading_validation_activation.md` | reviewed_passed_to_step_10 | 提供FZ-01~06、LD-01~30、XVAL、CFG-VAL、atomic generation和scoped failure边界 |
| `projects/L4-sandbox/03-详细设计.md` §11/§13/§14 | current formal baseline | 提供错误恢复、config读取、safe log/metric/audit/diagnostic和forbidden carrier |
| `03_ddd_step_15_observability_audit.md` | direct audit input | 提供`SandboxConfigValidationAudit`、`SandboxAdapterAvailabilityAudit`、store前观测和business audit边界 |
| L1-governance / L1-artifact Step 10 | granularity reference | 参考actor、review、change、rollback、sensitive和cross-audit结构;不复制项目配置或plain digest口径 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 哪些配置可以由谁变更 | Startup candidate由经外部授权的config proposer提出、independent reviewer评审、release executor应用。S05由当前entry / loop / job的正式typed caller提出,只能收窄FZ-03。S06由test harness维护。S04 material由secure-material custodian / provider lifecycle变更。application/domain/contracts不读也不改配置。 |
| 哪些变更需要评审 | Store/adapter/backend/boundary/route/target/feature/sensitive ref/retention/freshness/cleanup/redline/telemetry/audit/redaction/profile与P05+ composition均需controlled或high-risk评审。扩大资源 /并发、放宽freshness、缩短retention、启用external side effect会升级风险。NCFG、raw secret、redaction削弱、fake/host进入real-like、P07激活和reload/hot直接reject或重开设计。 |
| 变更如何生效 | Global change提交完整candidate,经Step 9全管线构造新的FZ-03 generation并原子发布;不是patch现有generation。S05只生成新的FZ-04/FZ-05,S06只生成FZ-06。Same-ref material rotation默认通过新generation重新解析;只有Step 8逐slot批准的adapter-bounded renew不改变ordinary config。 |
| 变更如何记录审计 | Release / operations plane保存ops-private change control record,包含safe refs、item IDs、review、old/new redacted markers、validation/build/apply/rollback disposition。L4 runtime只复用现有config validation / adapter availability safe surface;provider保存native material access audit。不得伪造新的business audit kind或把完整diff写入`SandboxAuditTrace`。 |
| 失败或异常如何回滚 | 回滚必须创建新的rollback request,选择prior approved complete candidate,重新执行Step 9并发布新的generation。失败candidate不得发布;已提交业务事实不撤销。Prior candidate若与当前软件 / schema不兼容或重新构建失败,rollback状态为failed并交Step 11 /运维处置,不得绕过validator。 |
| 是否回指Step 7/8/9/11 | 是。§9.4按40配置组回指I001~I101、sensitivity、FZ / LD和Step 11 handoff;§9.8单列sensitive rotation。 |
| 每类配置变更是否停审 | 完成§9.11对CCT-01~18逐类审查后才标记通过。 |
| 是否存在无评审 /无审计 /无回滚或泄露 | 必须由§9.12审计。Critical attempt不需要runtime rollback,因为它从未activation;但必须有safe rejection record。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 10前问题 | 本Step处理 |
|---|---|---|
| Step 7 item表 | 有来源 /作用域 /失败策略,无变更actor和review | 按40配置组闭合proposer、review、effect、audit、rollback |
| Step 8 rotation | 已区分ref / version rotation,但未定义change-control过程 | 单列config ref、descriptor、same-ref version、revoke和shutdown路径 |
| Step 9 restart-only | 已定义new generation,但“旧process仍运行”可能被误称rollback | rollback必须重新validate / build / publish并有独立disposition |
| Step 9 safe issue | 有CFG-VAL,没有change request / review / apply关联 | ops-private record关联safe issue,不扩展public error |
| `SandboxConfigValidationAudit` | 字段不足以承载完整change lifecycle | 只承载runtime validation事实;完整change record由release / ops plane拥有 |
| C26 drift | 只说记录drift候选 | 定义desired / observed marker、scope、状态和no-auto-overwrite |
| S01 code defaults | 容易被当普通file change回滚 | 属software / design baseline change,需新software baseline +完整验证,不靠config-only rollback |
| S05 / S06 | 易与global change混写 | 使用existing entry / job / test record,不修改desired global marker |

---

## 6. 改动前后对比

| 维度 | Step 10前 | Step 10后 |
|---|---|---|
| authority | source可读者可能被误当变更者 | proposer / reviewer / executor / scoped caller / fixture / material职责分离 |
| risk | 只有sensitive / internal | 增加direction-aware CRL-01~04和critical reject |
| candidate | 文件 / env可被原地修改 | 以完整candidate + safe manifest + prior candidate为change单位 |
| apply | restart方向 | CAP阶段明确review在S04前、LD-24后才算generation applied |
| audit | validation / availability surface | operations record、runtime audit、provider audit三层分工 |
| rollback | 未定义 | 新request + prior complete candidate +全量Step 9;rollback也可失败 |
| drift | candidate marker | desired / observed / rollout scope / no-auto-overwrite闭合 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| change单位 | A. JSON patch /单key mutation;B. 完整candidate | 采用B。cross-field、profile和generation原子性要求全量验证。Safe manifest可以列changed item,但不是apply payload。 |
| 完整diff是否写audit | A. 写完整old/new;B. item IDs + safe markers | 采用B。完整diff可能泄露sensitive ref、拓扑或raw value;完整candidate留在受控config source。 |
| 是否新增runtime change API | A. public port;B. release / ops plane | 采用B。当前只有startup sources;新增API会改变`03`协议 /审计 /并发边界。 |
| 高风险是否允许self-approve | A. proposer兼reviewer;B. independent review | 采用B。身份 / RBAC产品不在本Step定义,但reviewer ref必须与proposer responsibility分离。 |
| preflight何时调用S04 | A. review前;B. review通过后 | 采用B。避免未批准candidate触碰material provider;ordinary validation可先执行。 |
| rollback是否直接切旧process | A. live switch;B. prior candidate new generation | 采用B。当前无traffic / hot switch contract,只能重新执行Step 9。 |
| config rollback是否撤销业务truth | A. 撤销;B. 不撤销 | 采用B。truth、audit、relay、receipt、report和handoff均按正式flow不可逆。 |
| drift是否自动修复 | A. observed覆盖desired或反之;B. 记录并阻断/人工处置 | 采用B。无admin override或fleet reconciliation contract。 |

---

## 8. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 9 | done | 确认用户只放行Step 10 |
| 2 | 读取Step 10 SOP、书写规范§5.10和L1参考 | done | 固定必出表和产品中立约束 |
| 3 | 读取Step 7~9、正式`03`错误 /审计边界 | done | 固定item、sensitive、generation和audit分工 |
| 4 | 提取40配置组、40 sensitive、23 M slot和C26 drift | done | 建立机械覆盖基线 |
| 5 | 定义actor、review、change class和source rule | done | §9.1~§9.3已闭合 |
| 6 | 完成40组change-control回指 | done | §9.4覆盖I001~I101且组名 / 顺序与Step 7一致 |
| 7 | 完成apply、audit、rollback、sensitive和drift矩阵 | done | §9.5~§9.10已闭合 |
| 8 | 逐类停审、跨变更审计和`03`影响判定 | done | §9.11~§10无unresolved conflict或当前回写项 |
| 9 | 机械校验、状态同步并停审 | done | 表结构、集合、编号、敏感分类、泄露和提前产物门禁通过;未创建Step 11或正式`04` |

---

## 9. 结构化中间产物

### 9.1 变更职责、逻辑载体与评审层级

本节actor class只表达责任分工,不定义identity/member角色、账号、RBAC或审批产品。所有actor / reviewer ref必须来自外部正式授权语境,L4-sandbox不得自行创建member lifecycle truth。

| Actor ID /责任 | 允许动作 | 禁止动作 | 最小safe记录 |
|---|---|---|---|
| CCA-01 config proposer | 提交完整startup candidate、reason ref和prior candidate ref | 直接apply、绕validator、提交raw secret | proposer ref、request ref、affected item IDs |
| CCA-02 independent reviewer | 评审manifest、risk、rollback candidate和profile资格 | 修改candidate后沿用旧approval、自审高风险change | reviewer ref、review disposition、reviewed marker |
| CCA-03 release executor | 对已批准candidate执行CAP流程、记录generation disposition | 批准high-risk、自造fallback、标记未发布generation成功 | executor ref、candidate marker、apply disposition |
| CCA-04 scoped caller | 提交formal S05 entry/loop/job typed input | 修改FZ-02/FZ-03、扩大ceiling/registry、持久化global override | entry/loop/job ref、scope class、validation disposition |
| CCA-05 fixture maintainer / harness | 维护S06 fixture-owned value并运行P01~P04 case | 将fixture注入P05~P07或替代real adapter/material | fixture set marker、profile、case disposition |
| CCA-06 secure-material custodian | 变更provider binding / material version / revoke状态 | 把material写ordinary config或输出full provider marker | provider native audit、owner item、redacted marker、rotation class |
| CCA-07 design authority | 审查NCFG、P07、reload / public API等设计reopen | 把design decision伪装普通config approval | design baseline ref、decision ref;不写正文 |

以下术语是release / operations plane的逻辑契约,不是新增L4 public DTO、domain object、port或`SandboxAuditTrace` kind:

| 逻辑术语 | 含义 | 禁止误用 |
|---|---|---|
| `CompleteCandidateConfig` | 能独立进入Step 9的完整S01/S02/S03语义候选及source refs | JSON patch、未解析env dump或部分module |
| `SafeChangeManifest` | changed item IDs、change classes、source classes、profile、risk和old/new safe markers | 完整config diff、full sensitive ref或raw value |
| `ConfigurationChangeControlRecord` | ops-private lifecycle record,关联proposal/review/validation/apply/rollback/drift | 新business audit object、public DTO或accepted truth |
| `PriorApprovedCandidate` | 曾经通过适用review且当前可重新取回的完整candidate ref | 假定其必然兼容当前software / schema或必然可用 |
| `RedactedConfigMarker` | 对validated ordinary semantics生成的不可逆、不可枚举safe marker | plain hash、字符串截尾、完整配置摘要 |
| `DesiredConfigMarker` | 某声明rollout scope在approval后由executor正式启动的目标marker;它是target而非applied evidence,必须保留active rollout relation | 把approval本身当desired切换、metric label、global singleton或observed truth反向覆盖 |
| `ObservedGenerationMarker` | 单generation在validation / publication时报告的safe config / profile marker | full ref、material version或fleet-wide applied结论 |

| Review ID | 适用范围 | 必须满足 | 结果 |
|---|---|---|---|
| CRL-01 routine scoped | S05收窄、P0 test case内S06变化、低风险scalar收窄 | formal typed input、validator pass、safe record | 可由预授权规则执行;不改变global desired marker |
| CRL-02 controlled | P0/P03/P04普通scalar、cadence、retry、fixture、non-executing adapter ref变化 | proposer、reviewer / approved policy ref、prior candidate、Step 9 pass | 可进入CAP流程 |
| CRL-03 high risk | profile、feature、store、resolver、backend、boundary、route、target、retention、S04、audit/redaction等 | independent reviewer、rollback candidate、完整preflight、safe audit | 全部通过才可构建 /发布generation |
| CRL-04 config-ineligible | NCFG override、raw secret、redaction削弱、force-clean、host/fake real-like、P07 activation、S07/S08、reload/hot/partial generation | 不得普通批准;只能reject或正式重开设计 | no activation;safe rejection record |

方向性升级规则:

| 变化方向 | 最低review | 原因 |
|---|---|---|
| resource/body/page/batch/parallelism ceiling扩大 | CRL-03 | 扩大负载或资源暴露面 |
| timeout扩大或缩短 | CRL-02;影响safety / external call时CRL-03 | 可能扩大占用或提高误失败 |
| freshness threshold扩大 | CRL-03 | 允许使用更陈旧语境 / policy / capability |
| retention缩短 | CRL-03 | 可能破坏dedup、stored result、handoff或diagnostic完整性 |
| retention扩大 | CRL-02;容量 / evidence边界变化时CRL-03 | 增加资源与数据保留面 |
| feature / consumer / publisher / handoff由disabled变enabled | CRL-03 | 新增external side effect或worker surface |
| redaction deny增加 | CRL-02 | 更严格但仍需兼容性验证 |
| redaction deny删除、audit关闭、cleanup/redline放宽 | CRL-04 | 破坏immutable safety floor |

### 9.2 S00~S08来源变化规则

| Source | 变化owner | Review | 生效 /审计 | Rollback /禁止事项 |
|---|---|---|---|---|
| S00 static boundary | CCA-07 only | CRL-04 design reopen | 不进入runtime config change | 无普通rollback;禁止配置覆盖 |
| S01 code defaults | software/design maintainer + CCA-07/02 | 最低CRL-02;安全default /NCFG影响CRL-03/04 | 新software baseline +完整Step 9;change record只记baseline / item IDs | 需要compatible software/config恢复;不能靠file hot rollback |
| S02 selected JSON | CCA-01/02/03 | 按affected item最高CRL | 完整candidate、safe manifest、restart generation | prior approved complete S02重新Step 9 |
| S03 allowlisted env | CCA-01/02/03 | 按affected item最高CRL;manual untracked change不算approved | env source class、item IDs、safe markers、restart | 恢复prior approved env candidate并restart;非法winner不fallback |
| S04 secure material | CCA-06 + CCA-02/03 | CRL-03;revocation按security control | provider native audit + ops record + runtime availability safe marker | prior approved ref/version仅在未revoked且重新qualified时可选;无raw/fake fallback |
| S05 scoped typed input | CCA-04 | CRL-01或目标 / scope高风险时existing authorization + CRL-02 policy | current entry/loop/job record;不改desired marker | 新entry/loop/job使用prior / corrected input;不改旧receipt/report |
| S06 deterministic fixture | CCA-05 | CRL-01/02,P04 safety scenario需controlled review | test definition / fixture marker;FZ-06 rerun | prior fixture rerun;P05~P07出现即reject |
| S07 remote config | none current | CRL-04 | rejected CFG-VAL / change record | no activation;先回写`03/04` |
| S08 admin override | none current | CRL-04 | rejected CFG-VAL / security diagnostic | no break-glass bypass;走formal control / investigation |

### 9.3 配置变更总表

| Change ID /变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| CCT-01 source / profile composition | CCA-01/03 | CRL-03;P07 / overlay为CRL-04 | full candidate -> new startup generation | source classes、profile、item IDs、old/new config marker、review | prior approved source/profile candidate重新Step 9 |
| CCT-02 scalar envelope / timeout / batch | CCA-01/03;S05由CCA-04 | CRL-01~03按方向与scope | startup generation或FZ-04/FZ-05收窄 | item IDs、safe value class、direction、scope、validation | prior candidate restart或new scoped run |
| CCT-03 feature / service registration | CCA-01/03 | CRL-03;关闭hard guard为CRL-04 | new generation,重算FC-01~06 | feature item、old/new bool class、dependency coverage、review | prior complete feature composition重新构建 |
| CCT-04 store / UoW / replay binding | CCA-01/03 | CRL-03 | new generation,required store preflight | store family、old/new binding marker、retention relation、availability | prior approved binding;不得memory/fake fallback |
| CCT-05 context / policy / capability source | CCA-01/03 | CRL-03 | new generation | source family、old/new marker、freshness direction、availability | prior approved adapter/ref;policy始终fail-closed |
| CCT-06 boundary / backend / capture / release | CCA-01/03 | CRL-03;partial / host fallback为CRL-04 | new generation + four-dimension/capture/release preflight | backend/boundary/class marker、capability、review、availability | prior approved complete composition;无weak backend |
| CCT-07 inbound consumer binding | CCA-01/03;loop选择CCA-04 | CRL-03 global,CRL-01 scoped subset | new generation或new FZ-04 | changed formal keys、schema class、source/quarantine markers | prior map restart或new loop with prior binding |
| CCT-08 publisher / route / relay | CCA-01/03;batch收窄CCA-04 | CRL-03 binding,CRL-01 batch收窄 | new generation或new relay run | publisher / route markers、active event keys、FC coverage | prior complete map;pending relay truth不删 |
| CCT-09 handoff adapter / target / retry | CCA-01/03;target subset CCA-04 | CRL-03 global,scoped selection按existing authorization | new generation或new job | handoff kind、target markers、class compatibility、review | prior target set / new job;source truth不回滚 |
| CCT-10 lease / cleanup / release / redline safety | CCA-01/03 | CRL-03;force / advisory / guard削弱CRL-04 | new generation | guard / cadence / adapter markers、direction、review | prior strict candidate;不解除existing block/containment |
| CCT-11 refresh / projection / derived / reconciliation maintenance | CCA-01/03;batch/scope subset CCA-04 | CRL-02;freshness放宽或feature依赖CRL-03 | new generation或new job | job family、threshold direction、scope/cadence marker、validation | prior candidate或new job;不repair truth |
| CCT-12 telemetry sink / sampling / labels | CCA-01/03 | CRL-02;external sink / label放宽CRL-03/04 | new generation | sink markers、log/sampling/label class、redaction result | prior safe telemetry candidate;formal audit不受影响 |
| CCT-13 audit / diagnostic / redaction | CCA-01/03 | CRL-03;disable / deny removal / unsafe surface CRL-04 | new generation | route/surface/redaction markers、deny add/remove IDs、review | prior stricter candidate;unsafe candidate never activates |
| CCT-14 deterministic adapter / fixture | CCA-05;global ref由CCA-01/03 | CRL-01/02;real-like混入CRL-04 | test / simulation FZ-06或P0 startup | fixture/profile/scenario markers、validation | prior fixture/ref rerun;无host/real fallback |
| CCT-15 sensitive config ref / descriptor | CCA-01/03 + CCA-06 where provider-bound | CRL-03 | new candidate + new generation | owner item、family、old/new `RedactedBindingMarker`、class/predicate change | prior approved ref only if valid/not revoked;否则new approved ref |
| CCT-16 same-ref material version rotation | CCA-06 + independent review policy | CRL-03 | 默认new generation;approved adapter-bounded renew按Step 8 | owner item、material class、version marker class、provider audit、generation | prior version仅provider允许且未revoked / expired;否则forward rotation |
| CCT-17 S05 scoped input | CCA-04 | CRL-01;high-risk target/scope须既有authorization | current entry / new loop / new job only | scope class、selected registered marker、validation / report ref | new scoped invocation;旧formal result不改写 |
| CCT-18 static / unsupported / security violation | any source attempt;design only CCA-07 | CRL-04 | no activation | NCFG / CFG-VAL / SEC class、safe actor/source ref、diagnostic | no config rollback;reject or formal design reopen |

### 9.4 按40个配置组组织的变更控制与四步回指表

| 配置组 / Item | Change / review | Proposer / reviewer | 生效与Step 9回指 | Safe audit | Rollback | Step 11失效承接 |
|---|---|---|---|---|---|---|
| `configIdentity` I001 | CCT-01 / CRL-03;P07 CRL-04 | CCA-01 -> CCA-02 -> CCA-03 | LD-06/13,完整new generation | profile、source classes、old/new config marker、review | prior approved profile/source candidate | unknown/inactive/profile drift fail-fast |
| `entryEnvelope` I002~I006 | CCT-02;收窄CRL-02,扩大CRL-03;unsafe diagnostics CRL-04 | CCA-01/03;I006 scoped CCA-04 | LD-09/14;startup或current entry | item IDs、direction、safe limit class、validation | prior candidate或entry rerun | range error / entry reject / timeout surface |
| `workerEnvelope` I007~I009 | CCT-02;global CRL-02/03,scoped CCT-17 CRL-01 | CCA-01/03;loop CCA-04 | LD-26,FZ-04只收窄 | item IDs、loop kind、ceiling class、validation | prior startup defaults或new loop | invalid ceiling / loop not started |
| `jobEnvelope` I010~I013 | CCT-02;retry ref叠加CCT-15 | CCA-01/02/03;job CCA-04 | LD-28,FZ-05 | item IDs、job kind、safe value/ref marker、report ref | prior defaults或new job input | job reject / timeout / retry dependency failure |
| `featureAssembly` I014~I016 | CCT-03 / CRL-03 | CCA-01 -> CCA-02 -> CCA-03 | XVAL-08~13,LD-15,new generation | feature IDs、old/new bool、dependency coverage | prior complete FC composition | enabled dependency missing / startup blocked |
| `truthStore` I017 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02 -> CCA-03 | LD-18/19,new generation | owner item、store family、binding marker、UoW/audit capability | prior valid store binding;no memory fallback | store/material unavailable -> no mutation |
| `projectionStore` I018 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | LD-18/19,new generation | store family、binding marker、availability | prior valid projection store | startup failure / runtime degraded query |
| `derivedStore` I019 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | FC-03~05,LD-18/19 | store marker、feature dependency、availability | prior valid derived store;no truth fallback | startup blocked / derived unavailable |
| `referenceStore` I020 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | LD-18/19,body-free capability | binding marker、body-free qualification、availability | prior valid reference store | startup / resolver unavailable |
| `relayStore` I021 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | FC-02,LD-18/19 | binding marker、I014 relation、availability | prior valid relay store;relay facts retained | enabled startup blocked / publish pending |
| `replayStore` I022 | CCT-04 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | LD-18/19,replay parity | binding marker、capability、availability | prior valid replay store;no recompute | no mutation / duplicate missing result |
| `replayLifecycle` I023~I027 | CCT-04 / CRL-03 for decrease;increase CRL-02/03 | CCA-01 -> CCA-02 -> CCA-03 | XVAL-16,new generation | item IDs、direction、safe duration class、relation result | prior complete retention set | relation invalid / cleanup integrity risk |
| `contextSource` I028~I030 | CCT-05 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | LD-18/20/21,new generation | source family、binding marker、freshness direction、availability | prior valid resolver;no fake fallback | unresolved / stale / unavailable |
| `policySource` I031~I034 | CCT-05 + CCT-15 / CRL-03;fail-open CRL-04 | CCA-01/06 -> CCA-02/03 | LD-18/20/21,fail-closed | source/profile markers、freshness direction、availability | prior valid source;policy remains fail-closed | missing/stale/conflicted/denied |
| `backendCapability` I035~I038 | CCT-05 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | XVAL-17,LD-18/20/21 | adapter/backend markers、probe class、availability | prior qualified capability composition | unsupported/stale/unavailable boundary reject |
| `boundaryEnforcement` I039~I040 | CCT-06 + CCT-15 / CRL-03;partial/weak CRL-04 | CCA-01 -> independent CCA-02 -> CCA-03 | XVAL-18,new generation | profile/template markers、four-dimension result、review | prior coherent boundary candidate | partial enforcement / startup blocked |
| `isolationBackend` I041~I043 | CCT-06 + CCT-15 / CRL-03;host fallback CRL-04 | CCA-01/06 -> CCA-02/03 | XVAL-19,LD-18/20/21 | backend marker、profile、timeout direction、availability | prior qualified backend;no weak fallback | unsupported/unavailable/launch or inspect failure |
| `executionCapture` I044~I048 | CCT-06 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | XVAL-20/22,new generation | adapter/class markers、I048 direction、redaction result | prior complete capture composition | capture unavailable/failed;no fake success |
| `inboundEvents` I049 | CCT-07 + CCT-15 / CRL-03;loop subset CCT-17 | CCA-01/06 -> CCA-02/03;loop CCA-04 | XVAL-14,LD-15/18/26 | changed formal keys、source/quarantine markers、schema class | prior exact9-key map或new loop | missing binding / delayed / quarantined |
| `eventPublisher` I050 | CCT-08 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | FC-02,LD-18/20/21 | publisher marker、activation、availability | prior approved publisher;relay facts retained | startup blocked / retryable / dead-letter |
| `eventRoutes` I051 | CCT-08 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | XVAL-15,new generation | changed event keys、route markers、coverage result | prior exact13-key map;no topic synthesis | active route missing / startup blocked |
| `eventRelay` I052~I054 | CCT-08;retry ref叠加CCT-15;scoped CCT-17 | CCA-01/02/03;run CCA-04 | LD-27,FZ-04/05 | item IDs、batch/timeout direction、retry marker、run ref | prior defaults或new relay run | scoped reject / retryable / failed / dead-letter |
| `materialHandoff` I055~I056 | CCT-09 + CCT-15 / CRL-03;target subset CCT-17 | CCA-01/06 -> CCA-02/03;job CCA-04 | XVAL-21,LD-18/20/28 | handoff kind、adapter/target markers、class result | prior target set / new job;capture truth retained | startup/job reject / retryable / failed |
| `observabilityHandoff` I057~I058 | CCT-09 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | XVAL-22,new generation | adapter/target markers、I048 relation、redaction | prior complete safe target set | handoff degraded;formal audit unchanged |
| `investigationHandoff` I059~I060 | CCT-09 + CCT-15 / CRL-03;guard release CRL-04 | CCA-01/06 -> CCA-02/03 | XVAL-23,new generation/job | adapter/target markers、I074 relation、review | prior target set;containment remains | pending / failed;no automatic release |
| `handoffDelivery` I061~I064 | CCT-09;retry ref CCT-15 / CRL-02/03 | CCA-01/02/03;job CCA-04 | XVAL-24,LD-28 | retry marker、retention/batch/timeout direction、report | prior candidate或new retry job | invalid / timeout / retry exhausted |
| `leaseSafety` I065~I067 | CCT-10 + CCT-15 / CRL-03;batch scoped CRL-01 | CCA-01 -> CCA-02/03;scan CCA-04 | XVAL-26,new generation/scan | lease/cadence markers、batch direction、review | prior strict lease candidate / new scan | launch reject / orphan inspection failed |
| `cleanupSafety` I068~I070 | CCT-10 + CCT-15 / CRL-03;guard weakening CRL-04 | CCA-01 -> independent CCA-02 -> CCA-03 | XVAL-26,new generation/job | cadence/guard markers、batch direction、review | prior strict guard;existing blocked state retained | missing evidence -> blocked;no force-clean |
| `backendRelease` I071~I073 | CCT-10 + CCT-15 / CRL-03 | CCA-01/06 -> CCA-02/03 | XVAL-25,LD-18/20 | adapter/retry markers、reuse capability、timeout direction | prior qualified release path;orphan remains | unavailable/timeout/release failed |
| `redlineSafety` I074~I075 | CCT-10 / CRL-03;containment disable CRL-04 | CCA-01 -> independent CCA-02 -> CCA-03 | XVAL-27,new generation | enablement/cadence marker、target relation、review | prior strict candidate;containment truth retained | startup blocked / handoff pending / contained |
| `referenceRefresh` I076~I078 | CCT-11 / CRL-02;freshness放宽CRL-03 | CCA-01/02/03;job CCA-04 | LD-28,new generation/job | threshold direction、batch/cadence marker、report | prior candidate或new job | stale / resolver unavailable / item failed |
| `projectionMaintenance` I079~I081 | CCT-11 / CRL-02;freshness放宽CRL-03 | CCA-01/02/03;job CCA-04 | LD-28,new generation/job | threshold direction、batch/cadence marker、report | prior candidate或new job | stale/degraded/missing projection |
| `derivedMaintenance` I082~I084 | CCT-11;scope sensitive叠加CCT-15 / CRL-02/03 | CCA-01/02/03;job CCA-04 | FC-03~05,LD-28 | batch/scope/cadence markers、feature relation | prior candidate或new job;no truth repair | scope reject / job partial / dependency unavailable |
| `reconciliationMaintenance` I085 | CCT-11 / CRL-02;feature relationCRL-03 | CCA-01/02/03 | FC-04~06,new generation | cadence marker、I016 relation、review | prior candidate;finding truth retained | job disabled/failed/degraded;no auto-fix |
| `runtimeTelemetry` I086~I090 | CCT-12 + CCT-15 / CRL-02/03;unsafe labels CRL-04 | CCA-01/06 -> CCA-02/03 | XVAL-30,LD-18/20/21 | sink/sampling/label markers、log class、redaction | prior safe telemetry candidate | invalid startup / external sink degraded |
| `auditTrace` I091 | CCT-13 + CCT-15 / CRL-03;disable CRL-04 | CCA-01 -> independent CCA-02 -> CCA-03 | XVAL-31,new generation | route marker、same-UoW result、review | prior mandatory audit route | startup blocked / mutation unavailable |
| `diagnostics` I092~I093 | CCT-13 + CCT-15 / CRL-02/03;unsafe surface CRL-04 | CCA-01/02/03 | XVAL-32,new generation | surface/retention markers、redaction result | prior safe diagnostic candidate | invalid startup / local safe fallback only |
| `safeOutput` I094~I095 | CCT-13 + CCT-15 / CRL-03;deny removal CRL-04 | CCA-01 -> independent CCA-02 -> CCA-03 | XVAL-32,new generation | redaction marker、deny added IDs、attempted removals、review | prior equal-or-stricter candidate | unsafe candidate rejected / security diagnostic |
| `deterministicAdapters` I096~I097 | CCT-14 / CRL-02;real-like fixture CRL-04 | CCA-05;global CCA-01/02/03 | XVAL-33,FZ-06或P0 startup | clock/id markers、profile、fixture relation | prior refs / rerun case | invalid fixture / profile reject |
| `testFixtures` I098~I101 | CCT-14 / CRL-01/02;P05+ CRL-04 | CCA-05;P04 controlled reviewer | LD-29,FZ-06 | fixture/scenario markers、profile、validation | prior fixture rerun;no real/host fallback | test/simulation fail-fast |

本表的CCT-15表示该组发生sensitive ref / descriptor变化时叠加执行§9.8,不表示同组所有internal scalar都成为material-capable。Same-ref material version rotation不改变I001~I101值,统一由CCT-16承接。

### 9.5 Safe Change Manifest与审计载体分工

#### 9.5.1 三层记录职责

| Record plane | Owner | 记录内容 | 不承担 |
|---|---|---|---|
| release / operations change control | external ops-private carrier | proposal、review、candidate / prior refs、safe manifest、validation、apply、rollback、drift | sandbox business truth、raw config diff、material body |
| L4 runtime config observability | existing config validation / adapter availability log、metric、diagnostic和conditional audit | config/profile ref、section、issue ref、startup disposition、adapter availability | proposal approval、完整change lifecycle、member role truth |
| secure material provider audit | provider-native | resolve / renew / deny / revoke、principal class、slot marker、time / version class | sandbox accepted audit、ordinary config diff、business event |

若未来要求L4 runtime直接接收mutation command、持久化完整change record或暴露change query,必须先回写`03`的object / port / DTO / flow / authorization / audit / idempotency。本Step不借logical term静默新增该能力。

#### 9.5.2 Change control record最小字段

| 字段 | 必填性 | 语义 /来源 | 禁止内容 |
|---|---|---|---|
| `change_request_ref` | 全局change必填 | 产品中立request ref;scoped change可用existing entry/job ref | ticket正文、free text、secret |
| `proposer_ref` | 必填 | CCA-01/04/05/06的外部授权ref | raw credential、member profile body |
| `reviewer_refs` | CRL-02/03必填 | review responsibility refs;CRL-03至少有独立reviewer | approval正文、与proposer混同的未声明self-review |
| `executor_ref` | apply / rollback必填 | CCA-03或provider executor safe ref | deployment credential |
| `reason_ref` | CRL-02/03必填 | 指向受控原因记录 | 原始事故 /审批正文 |
| `rollout_scope_ref` | global apply必填 | 声明本record所覆盖的process / environment scope,只作opaque ref | host list、endpoint、tenant body |
| `candidate_config_ref` | startup change必填 | 可重新取回完整candidate的受控ref | config正文或path细节 |
| `prior_config_ref` | rollback-capable global change必填 | prior approved complete candidate ref | 假定必然可用 /兼容 |
| `profile_ref` | 必填 | target PROFILE-01~07 safe ref | profile secret body |
| `changed_item_ids` | 必填 | I001~I101有序唯一集合;CCT-16可为owner item IDs | unknown key / raw diff |
| `change_class_ids` | 必填 | CCT-01~18有序唯一集合 | 临时字符串风险名 |
| `review_level` | 必填 | CRL-01~04 | 绕过required review的低级别伪装 |
| `old_config_marker` / `new_config_marker` | global change必填 | `RedactedConfigMarker`;由受控marker factory生成 | plain hash、full config、可枚举低熵摘要 |
| `binding_marker_deltas` | sensitive ref change必填 | owner item + old/new `RedactedBindingMarker` | full ref、provider path、endpoint、topic |
| `safe_value_directions` | scalar change必填 | increase / decrease / enable / disable / replace + safe class | sensitive raw value、完整numeric dump不受控输出 |
| `material_class_changed` | material binding change必填 | bool + SBX-MC class ID | material version / body原文 |
| `activation_predicate_changed` | feature / slot change必填 | bool + XVAL / owner item refs | candidate expression body |
| `validation_disposition` | 必填 | accepted / rejected / failed with CFG-VAL refs | raw invalid value |
| `build_disposition` | startup apply必填 | blocked / complete / permitted-degraded + safe reason refs | SDK error / stack |
| `generation_ref` | successful per-generation apply必填 | LD-24发布的opaque generation ref | process handle / host pid |
| `apply_disposition` | 必填 | rejected / validation-failed / build-failed / applied-to-generation / effect-suspect | 未发布却记applied |
| `rollback_request_ref` | rollback时必填 | 新request ref | 覆盖原record状态历史 |
| `rollback_disposition` | rollback时必填 | not-needed / requested / validated / applied / failed | “old process alive”冒充applied |
| `diagnostic_refs` | 失败 / drift时必填 | CFG-VAL / SEC / availability / Step11 safe refs | raw body、stack、SQL、HTTP / SDK body |
| `recorded_at_ref` | 必填 | formal clock safe instant ref | 本地猜时间或DB default隐式truth |

#### 9.5.3 Change lifecycle状态

以下status是ops-private record语义,不是L4 domain state enum:

| Status ID /状态 | 进入条件 | 允许后继 | 禁止跳转 |
|---|---|---|---|
| CCS-01 Proposed | 完整request / candidate ref已登记 | CCS-02/05/06 | 跳过prevalidation或直接Approved / Applied |
| CCS-02 Prevalidated | Step 9 ordinary validation通过,safe manifest已形成 | CCS-03/04/05 | 未review调用S04 |
| CCS-03 ReviewRequired | CRL-02/03等待review | CCS-04/05 | 自行降级CRL-01 |
| CCS-04 Approved | review通过且candidate marker未变化 | CCS-02/05/06/07 | candidate变化时必须追加新immutable revision、使旧approval失效并重做CAP-03~06;不得直接跳到review或building |
| CCS-05 Rejected | review拒绝或CRL-04 attempt | terminal或new request | activation / rollback |
| CCS-06 ValidationFailed | prevalidation / revalidation失败 | terminal或new request | fallback低层 / apply |
| CCS-07 Building | approved candidate进入S04 / builder | CCS-08/09 | 部分entry发布 |
| CCS-08 AppliedToGeneration | LD-24完整发布且observed marker记录 | CCS-10/11/13 | 声称fleet-wide完成而无scope evidence |
| CCS-09 BuildFailed | S04 / adapter / availability / publication失败 | CCS-11或terminal | applied标记 |
| CCS-10 EffectSuspect | Step11 / ops返回safe anomaly或drift | CCS-11或new investigation | 自动修改config |
| CCS-11 RollbackRequested | 新rollback request关联prior candidate | CCS-12/14 | 直接改原generation |
| CCS-12 RolledBackToGeneration | prior candidate完整新generation已发布 | CCS-13 | 撤销既有业务truth |
| CCS-13 Superseded | 后续scope-bound desired取代本record关联target;只由CCS-08/12进入 | terminal | 把CCS-05/06/09/14失败事实改写成Superseded或删除历史record |
| CCS-14 RollbackFailed | prior candidate validation / build / publication失败 | new request / Step11 incident | 绕validator强制旧值 |

`CCS-11`描述原change record已请求回滚;与其关联的新rollback request仍从`CCS-01`开始,按`CCS-02~09`记录自己的prevalidation、review、build和publication history。只有关联rollback request发布完整new generation时,原record才从`CCS-11`进入`CCS-12`;关联request在prior candidate不可用、validation、S04、build或publication任一处失败时,原record进入`CCS-14`,child record保留其`CCS-05/06/09`终态。这样CAP-14~16不会跳过review / build状态,也不会覆盖原apply history。

### 9.6 Apply与Rollback处理流

#### 配置变更处理流: complete candidate到new generation

```text
[proposal + CompleteCandidateConfig ref + PriorApprovedCandidate ref]
                         |
                         v
              [SafeChangeManifest]
                         |
             [risk classify CRL-01~04]
                         |
       [Step 9 ordinary prevalidation, no S04]
                         |
                [required review]
                         |
 [candidate marker check + rollout scope authorization]
                         |
       [DesiredConfigMarker + active rollout]
                         |
        [Step 9 LD-18 S04 + LD-19~23 builder]
                         |
             [LD-24 atomic publication]
                         |
      [ObservedGenerationMarker + AppliedToGeneration]
                         |
        effect suspect / drift / rollback request
                         |
        [prior complete candidate runs same full path]
                         |
        [RolledBackToGeneration or RollbackFailed]
```

| Stage | Owner | 输入 /前置 | 动作 | 成功输出 | 失败处理 |
|---|---|---|---|---|---|
| CAP-01 | CCA-01/04/05/06 | request ref、candidate / scoped input | 登记proposal与source class | CCS-01 | incomplete request reject |
| CAP-02 | CCA-01/03 | complete candidate ref | 取回完整candidate,确认不是patch / raw dump | immutable candidate marker | unreadable -> CCS-06 |
| CAP-03 | change classifier | old/new candidate markers | 生成changed item IDs、CCT、direction和binding marker deltas | `SafeChangeManifest` | unknown item / marker failure -> CCS-06 |
| CAP-04 | risk classifier | manifest + profile + direction | 计算最高CRL;CRL-04直接reject/design reopen | review requirement | 不得拆单降低风险 |
| CAP-05 | Step 9 validator | candidate,不调用S04 | 执行LD-01~17 ordinary / XVAL prevalidation | CCS-02 + CFG-VAL refs | CCS-06;无fallback |
| CAP-06 | CCA-02 / approved policy | manifest、prevalidation、prior candidate | 完成required review | CCS-04或CCS-05 | reject无activation |
| CAP-07 | CCA-03 | approved marker + current candidate marker + rollout scope | 防TOCTOU一致性检查;任何byte / semantic / source变化追加新immutable revision、使旧approval失效并重新CAP-03~06;一致且executor正式启动该scope rollout时,原子声明new desired / active rollout并把同scope prior desired relation标记superseded | apply-eligible candidate +唯一scope-bound desired target | mismatch -> CCS-02/05/06或重新CCS-04;不得触达S04 |
| CAP-08 | CCA-03 + CCA-06 | approved active slots | 执行LD-18 descriptor / provider / material qualification | bounded leases / safe provider outcomes | CCS-09;provider native audit保留 |
| CAP-09 | runtime builder | approved FZ-02 + leases | 执行LD-19~23 repositories / adapters / availability / services | unpublished complete generation | required failure -> CCS-09 |
| CAP-10 | generation publisher | same-generation complete set | 执行LD-24原子发布 | FZ-03 generation ref | 发布0或完整;失败CCS-09 |
| CAP-11 | runtime + CCA-03 | published generation | LD-24之后记录ObservedGenerationMarker、runtime validation / availability safe surface | CCS-08 per-generation | 无observed marker不得声称rollout complete |
| CAP-12 | ops / Step11 signal owner | applied generation + safe indicators | 评估是否出现配置相关异常;本Step不定义阈值 | remain CCS-08或CCS-10 | 不自动改config |
| CAP-13 | CCA-01/02/03 | effect suspect / drift / explicit request | 创建独立rollback request,保留原record | CCS-11 | 不覆盖原apply history |
| CAP-14 | rollback classifier | prior candidate ref + current compatibility inputs | 创建CCS-01 child rollback request,确认prior仍approved,重新执行CAP-02~04并生成manifest / risk | rollback candidate | prior missing / revoked -> parent CCS-14;child CCS-05/06 safe终态 |
| CAP-15 | Step 9 full pipeline | rollback candidate | child request重新执行CAP-05~10,包括review、scope-bound desired declaration、S04 / availability | new prior-based generation | validation/build失败 -> child CCS-06/09 + parent CCS-14 |
| CAP-16 | runtime + ops | rollback generation published | 记录new observed generation和rollback relation;只在声明scope的required observation闭合后记录scope rollback完成 | parent CCS-12 per-generation / per-scope disposition | old process alive或单instance成功不计scope成功 |
| CAP-17 | change controller | rollout aligned、failed、cancelled或被后续rollout取代 | 关闭active rollout relation并保留desired、observed、superseded与terminal history;失败 /取消不得恢复prior desired | closed rollout relation;被取代的CCS-08/12 record进入CCS-13,CCS-05/06/09/14保留原失败终态 | 删除history、改写失败事实、自动回切desired或让terminal relation继续掩盖drift |

Marker时序固定如下:

- `CCS-04 Approved`只表示candidate通过适用review,不会自行改变任何scope的desired marker。
- CCA-03在CAP-07确认candidate未变、rollout scope明确并正式启动执行时,才以一个原子关系更新声明该scope的`DesiredConfigMarker`与active rollout relation,并同步把同scope prior desired relation保留为superseded history;任一时刻同scope只能有一个current desired。只有原record处于CCS-08/12时进入CCS-13;CCS-05/06/09/14失败状态不得因desired被取代而改写。
- LD-18~23失败、LD-24发布失败、rollout取消或被取代时,必须终止active rollout relation并记录失败 / superseded disposition;未终止或无执行事实的relation不得长期把差异伪装成CDR-03。
- 只有LD-24完整发布后,CAP-11才记录该generation的`ObservedGenerationMarker`;observed不得反向修改desired。
- Rollback child request遵守相同时序:通过当前review后声明prior-based desired target,发布后写new observed marker;失败时保留desired / failure事实并进入CDR-05、CDR-06或Step 11处置,不得把仍存活的old process视为observed rollback success。

Apply success只表示某声明rollout scope内的一个generation完成LD-24并报告observed marker。多实例顺序、流量切换、drain和fleet completion由部署 /运维契约定义;本文不伪造全局成功。

### 9.7 Rollback规则矩阵

| Rollback ID /场景 | 是否已有新generation | 必须动作 | 成功判定 | 禁止行为 |
|---|---:|---|---|---|
| CRB-01 review reject / CRL-04 | 否 | 记录CCS-05 / safe issue | no activation | 启用emergency override |
| CRB-02 ordinary validation failure | 否 | CCS-06;修正或新request | corrected candidate重新通过 | fallback S01 / lower source |
| CRB-03 S04 / builder / availability failure | 否 | CCS-09;可创建rollback request或保持existing deployment | prior candidate new generation通过 | 把old process存活记rolled back |
| CRB-04 LD-24 publication failure | 否,必须发布0个handle | CCS-09 + diagnostic | 另一个完整generation发布 | partial handle exposure |
| CRB-05 applied generation effect suspect | 是 | CCS-10 -> independent rollback request | prior-based new generation发布 | 撤销已提交业务truth / audit / relay |
| CRB-06 profile / feature activation anomaly | 是或否 | 恢复prior complete composition并全量XVAL | new generation与prior marker一致 | 单独toggle部分service / mixed generation |
| CRB-07 sensitive config ref change失败 | 是或否 | 选择仍valid/not-revoked的prior approved ref或forward fix | S04 / builder / availability全通过 | 输出full ref或切fake/raw env |
| CRB-08 same-ref material rotation异常 | 可能 | provider规则允许时选prior valid version,否则forward rotation / terminate | new valid lease / generation且provider audit完整 | 使用expired / revoked material |
| CRB-09 S05 scoped input失败 | global无变化 | reject current entry/loop/job;新调用用prior/corrected input | new scoped snapshot通过 | 修改旧receipt/report或global config |
| CRB-10 S06 fixture失败 | global无变化 | prior fixture / corrected fixture rerun | new FZ-06通过 | host / real dependency fallback |
| CRB-11 drift detected | 可能多generation | freeze desired decision,调查scope,创建apply/rollback request | scope内observed markers与approved desired一致 | observed反向成为desired / auto overwrite |
| CRB-12 prior candidate incompatible / rollback build失败 | 否或旧generation仍可能运行 | CCS-14 + Step11 / incident disposition;选择new compatible candidate | subsequent approved generation发布 | skip schema/validator、声称rollback成功 |

跨所有rollback不变量:

- rollback只改变未来generation / scoped invocation的配置选择,不删除或重写sandbox truth。
- accepted audit、relay、stored result、receipt、report、handoff、capture、failure、cleanup和redline fact保持原样。
- prior candidate必须重新通过当前适用validator、profile和provider资格;“曾经可用”不是当前可用证明。
- rollback request、validation、build、generation和disposition必须形成独立history;不得覆盖原change record。
- rollback failure是正式结果,不能通过lower priority、fake、host、expired material或unsafe redaction伪造成成功。

### 9.8 Sensitive Ref、Descriptor与Material Rotation附加规则

Step 8 sensitive闭集继续保持:

| Category | Item IDs | Change处理 |
|---|---|---|
| material-capable,23项 | I017~I022,I028,I031,I035,I041,I044,I049~I051,I055~I060,I071,I086,I087 | config ref / descriptor change执行CCT-15;active slot调用S04;same-ref version执行CCT-16 |
| reference-only,15项 | I013,I033,I036,I039,I040,I046,I053,I061,I065,I069,I072,I083,I091,I092,I094 | 不调用S04;仍按CRL-02/03、family / registry和safe marker审计 |
| test-only,2项 | I098,I101 | 只在P01~P04按CCT-14;P05~P07 change request直接reject |

| 敏感change | Review /读取 | Apply | Audit | Rollback |
|---|---|---|---|---|
| opaque config ref change | CRL-03;ordinary validator只看family / registry | new complete candidate + new generation | owner item、family、old/new `RedactedBindingMarker`、profile | prior approved ref仅在仍valid时重建;否则forward fix |
| registry descriptor / provider marker change | CRL-03;不新增project JSON key | reviewed registry baseline + LD-18 | owner item、material class、predicate / lease policy changed bool、provider native audit ref | prior descriptor重新qualification;禁止任意provider fallback |
| same-ref material version rotation | CCA-06 + CRL-03 policy;ordinary config marker可不变 | 默认new generation;逐slot批准的adapter-bounded renew除外 | material class、safe version class、provider result、generation / lease disposition | prior version只有provider明确允许且未expired/revoked;否则forward rotation |
| expiry / renew failure | provider / adapter runtime hook | 旧lease仅用到明确expiry;不得改ordinary config | owner slot、expiry state class、renew outcome、safe reason | 不延长;new generation或停止能力 |
| revocation | security control;无需等待普通change approval才能stop use | stop new use,adapter stop / runtime termination / restart | revoked class、incident ref、affected slot markers | revoked version不可rollback;只能forward-safe binding |
| sensitive target / route change | CRL-03;reference-only或M按entry定义 | new generation;S05只选startup registry子集 | changed formal key / target kind、old/new marker、coverage | prior complete map/set重新build |
| sensitive telemetry binding | CRL-03 | new generation / approved material rotation | sink kind、binding marker、availability、redaction | prior safe sink;formal audit / local diagnostic保持 |
| sensitive test fixture ref | CCA-05 CRL-01/02 | FZ-06 only | fixture/scenario marker、profile、case disposition | prior fixture rerun |

Step 8要求的change audit最小字段全部保留:change request ref、operator / actor safe ref、profile、owner item ID、binding family、old/new `RedactedBindingMarker`、material class是否变化、activation predicate是否变化、validation result、new runtime generation ref、apply / rollback disposition和safe reason ref。任何载体均不得记录full ref、provider marker原文、material version原文或raw material。

### 9.9 Drift检测与处置矩阵

| Drift ID /状态 | 判定输入 | 含义 | 必须动作 | 禁止动作 |
|---|---|---|---|---|
| CDR-01 DesiredUnknown | 无approved `DesiredConfigMarker`或scope | 不能证明期望配置 | 阻止宣称rollout aligned;补change-control事实 | 从任一instance反推desired |
| CDR-02 DesiredDeclared | CAP-07已启动的approved target marker + rollout scope | 已声明target,但不等于任何generation已applied | 保留active rollout relation并收集observed marker | 仅凭approval创建desired或仅凭desired标记fleet applied |
| CDR-03 RolloutPending | observed marker与target不同,且差异被同scope未终止的active approved rollout执行事实明确覆盖 | 允许的渐进发布过渡,不是untracked drift | 记录expected old/new marker class、pending scope和active disposition;继续观察 | 失败 /取消 /过期relation继续掩盖差异或省略active rollout ref |
| CDR-04 Aligned | scope内required observed markers与desired一致 | 该声明scope内可判一致 | 记录aligned disposition与观察时间ref | 把marker放metric label |
| CDR-05 DriftDetected | observed marker / profile与desired不一致且不被active approved rollout覆盖 | 未审计变化、过期rollout残留或错误source | 记录safe mismatch、freeze自动处置、创建调查 / apply / rollback request | 自动覆盖file/env或其他instance |
| CDR-06 ObservationIncomplete | 部分instance无marker / unobservable | 不能判定aligned或drift全貌 | 记录missing observation;交Step11 /运维 | 当作aligned或删除instance事实 |
| CDR-07 RollbackPending | drift / anomaly已触发CCS-11 | desired决策待prior-based generation | 按CAP-14~16执行 | 让observed old config自动成为desired |
| CDR-08 SupersededGeneration | generation曾aligned但已被新desired取代 | 保留历史,不再作为current desired | 记录superseded relation | 删除old record或混算current scope |

Drift comparison只使用`RedactedConfigMarker`、profile ref、generation ref、rollout scope ref、active rollout ref和必要的binding marker class。只有同scope、target marker一致、已由CAP-07正式启动且仍有未终止执行事实的approved rollout才能把差异分类为CDR-03;approval-only、failed、cancelled、superseded或已越过Step 11判定窗口的relation均不得掩盖差异,应进入CDR-05或CDR-06。Marker / generation / actor / instance ref不得作为metric label;应进入safe structured log、ops-private record、conditional config validation audit或diagnostic ref。C26要求“不得自动互相覆盖”在本表保持不变。

### 9.10 Rollback与Sandbox Truth / Carrier边界

| Subject | Config rollback是否修改 | 正式处理 |
|---|---:|---|
| `SandboxRuntimeConfigSummary` / runtime handles | 只通过new generation替换未来使用 | old generation history保留;无in-place mutation |
| accepted domain truth / state | 否 | 继续按repository / UoW truth存在 |
| `SandboxAuditTrace` | 否 | 不删除、不改写、不为config rollback伪造inverse audit |
| idempotency / stored result | 否 | duplicate继续返回original stored surface |
| relay record / publication marker | 否 | pending / delivered / failed状态按原flow推进 |
| capture / handoff / receipt | 否 | source facts与downstream markers保持 |
| job report / consumer receipt | 否 | failed / partial / rejected结果不可改写;新run有新record |
| cleanup guard / redline containment | 否 | prior安全事实保持;config change不得解除block / containment |
| provider material lease | 按Step 8 lifecycle | revoke/expiry不可被rollback覆盖;new generation获得new lease |
| config validation / availability diagnostic | 否 | 关联原generation;rollback生成新validation事实 |

### 9.11 配置变更逐类停审记录

| Change | Authority / review | Audit | Apply / rollback | Sensitive / failure | 结论 |
|---|---|---|---|---|---|
| CCT-01 source / profile | CCA-01/02/03,CRL-03 | source/profile/config markers完整 | full candidate new generation / prior candidate | P07/overlay reject,drift承接 | 通过 |
| CCT-02 scalar envelope | direction-aware CRL-01~03 | item/direction/safe class | startup或scoped rerun | range / timeout交Step11 | 通过 |
| CCT-03 feature registration | independent CRL-03 | feature/dependency coverage | complete composition / prior complete composition | hard guard不可disable | 通过 |
| CCT-04 store / replay | independent CRL-03 | store/binding/retention/availability | full generation / prior valid store | material no-fallback,truth不回滚 | 通过 |
| CCT-05 source adapters | independent CRL-03 | family/freshness/binding/availability | full generation / prior adapter | policy fail-closed | 通过 |
| CCT-06 backend / boundary / capture | independent CRL-03;weak CRL-04 | four-dimension/backend/class markers | complete generation / prior qualified composition | no host/fake/partial fallback | 通过 |
| CCT-07 inbound binding | global CRL-03,scoped CRL-01 | formal keys/schema/source markers | exact map generation / new loop | unavailable delayed/quarantined | 通过 |
| CCT-08 publisher / route / relay | binding CRL-03,scoped CRL-01 | publisher/routes/FC/availability | complete map / prior map or new run | relay truth no rollback | 通过 |
| CCT-09 handoff | global CRL-03,scoped authorized | kind/target/class/retry markers | full generation / prior target set/new job | source truth/receipt semantics preserved | 通过 |
| CCT-10 safety lifecycle | independent CRL-03;weakening CRL-04 | guard/cadence/adapter/review | strict generation / prior strict candidate | no force clean/release/advisory containment | 通过 |
| CCT-11 maintenance | CRL-02;freshness relax CRL-03 | threshold direction/scope/cadence/report | generation或new job | no truth repair | 通过 |
| CCT-12 telemetry | CRL-02/03;unsafe labels CRL-04 | sink/sampling/label/redaction | safe generation / prior safe candidate | formal audit独立 | 通过 |
| CCT-13 audit / redaction | independent CRL-03;disable/remove CRL-04 | route/surface/deny delta/review | new generation / prior equal-or-stricter | raw output forbidden | 通过 |
| CCT-14 deterministic fixture | CCA-05 CRL-01/02;P05+ CRL-04 | fixture/profile/scenario markers | FZ-06 rerun / prior fixture | no host/real fallback | 通过 |
| CCT-15 sensitive ref / descriptor | CCA-06 + independent CRL-03 | Step8 minimum fields + provider audit | new generation / prior valid or forward fix | full ref/material forbidden | 通过 |
| CCT-16 same-ref version rotation | CCA-06 + CRL-03 policy | material class/version class/provider result | default new generation / valid prior or forward rotation | expired/revoked不可rollback | 通过 |
| CCT-17 S05 scoped input | CCA-04 CRL-01 + existing authorization | scope/registered marker/receipt/report | new invocation | global marker与old result不改 | 通过 |
| CCT-18 unsupported / violation | any attempt -> CRL-04 | NCFG/CFG-VAL/SEC + safe actor/source | no activation;design reopen only | rejection redacted,无emergency bypass | 通过 |

### 9.12 跨变更审计 /回滚审计表

| 审计项 | 结论 | 证据 /修正 | unresolved缺口 |
|---|---|---|---|
| I001~I101是否全覆盖 | 是 | §9.4的40配置组并集恰好覆盖全部item | 无 |
| 40个配置组是否与Step 7同集 | 是 | group name与item range逐组回指 | 无 |
| CCT-01~18是否全部停审 | 是 | §9.3 / §9.11 | 无 |
| 每个global change是否有proposer / reviewer / executor边界 | 是 | CCA-01~03;high-risk independent review | exact IAM产品未选,非本Step blocker |
| scoped / fixture / material actor是否分离 | 是 | CCA-04~06;不混入member lifecycle truth | 无 |
| 高风险change是否都有review | 是 | CRL-03 + §9.4逐组 | 无 |
| config-ineligible change是否可普通批准 | 否 | CRL-04 / CCT-18 no activation | 无 |
| 是否假定具体ticket / approval / release产品 | 否 | 只定义opaque refs和logical record | carrier选择留`07/09` |
| change是否以partial patch应用 | 否 | `CompleteCandidateConfig`;manifest不是apply payload | 无 |
| reviewed candidate变化后是否沿用approval | 否 | CAP-07 marker consistency;变化重走CAP-03~06 | 无 |
| 未review candidate是否调用S04 | 否 | CAP-05 ordinary prevalidate;CAP-08在approval后 | 无 |
| apply是否在LD-24前记成功 | 否 | CCS-08仅在完整generation发布后 | 无 |
| partial / mixed generation是否可见 | 否 | Step 9 LD-24 + CAP-10发布0或完整 | 无 |
| rollback是否是原record原地改写 | 否 | CCS-11新request,原history保留 | 无 |
| prior candidate是否跳过当前validator | 否 | CAP-14~16重新走完整Step 9 | 无 |
| rollback是否允许失败 | 是 | CCS-14 / CRB-12是正式结果 | Step11定义告警 /恢复动作 |
| old process仍运行是否等于rollback成功 | 否 | 必须prior-based new generation发布 | exact deployment topology留运维 |
| config rollback是否撤销sandbox truth | 否 | §9.10逐carrier no mutation | 无 |
| failed receipt/report是否被改成成功 | 否 | 新invocation有新record,old formal result immutable | 无 |
| S05是否改变global desired marker | 否 | FZ-04/FZ-05 only | 无 |
| S06是否进入P05~P07 | 否 | CCT-14 / CRL-04 reject | 无 |
| S01 default change是否伪装config-only rollback | 否 | software/design baseline + full validation | compatible software rollback细节留`07/09` |
| untracked file/env变化是否算approved change | 否 | 只能成为CDR-05 drift / safe rejection | 无 |
| 高层非法值是否rollback到低层 | 否 | Step 5 C02/C03/C08继续fail-fast | 无 |
| sensitive ref是否进入audit正文 | 否 | 只用`RedactedBindingMarker`;禁止plain hash / truncation | 无 |
| material version / raw material是否进入change record | 否 | 只记录version class / material class / provider result | 无 |
| provider audit是否替代runtime / ops record | 否 | 三层记录职责分离 | 无 |
| revocation是否可以rollback到revoked version | 否 | 只能stop use / forward-safe binding | immediate callback仍future reopen |
| critical rejection是否无记录 | 否 | CCT-18要求safe rejection record | 无 |
| drift是否自动互相覆盖 | 否 | CDR-05 freeze auto action,创建调查 / request | 无 |
| instance marker是否进入metric label | 否 | safe log / record / diagnostic only | 无 |
| 单generation applied是否伪装fleet completion | 否 | rollout scope + observation completeness门禁 | exact orchestrator产品未选 |
| runtime是否新增business config-change audit | 否 | 只复用existing validation / availability surface | runtime mutation需求将触发`03` blocker |
| 是否存在无回滚的高风险成功change | 否 | prior candidate + CRB矩阵;rollback failure显式 | 无 |
| 是否需要立即回写`03` | 否 | ops-private record且runtime仍startup-only | future triggers已登记 |

### 9.13 Historical Material / Blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-CFG-CHANGE-001 | design gap | resolved_for_cfg_step_10 | Step 7~9尚无actor、review、change、rollback和drift闭环 | 本文件已闭合CCA/CRL/CCT/CCS/CAP/CRB/CDR及40组回指 |
| SBX-CFG-CHANGE-CARRIER-001 | carrier watch | resolved_ops_private_no_writeback | `03`没有完整configuration change object / port | 完整record归release / ops plane;runtime只复用existing safe surfaces |
| SBX-CFG-CHANGE-RUNTIME-API-001 | future blocker | blocker_if_requested | runtime mutation API、change query或内部持久化record会改变protocol / auth / audit / idempotency | 当前禁止;要求时先回写`03` Step 6~15 |
| SBX-CFG-CHANGE-DRIFT-001 | downstream carrier gap | open_for_07_09 | rollout scope、desired marker store、fleet observation产品未选择 | 不阻塞设计;`07/09`必须选carrier且保持no-auto-overwrite |
| SBX-CFG-CHANGE-ROLLBACK-001 | downstream operations gap | open_for_07_09 | process orchestration、traffic/drain、software/config compatibility runbook未定义 | 本Step只定义prior candidate full rebuild与成功判定,不伪造部署能力 |
| SBX-CFG-CHANGE-PROVIDER-001 | activation blocker | open_for_p05_p06_p07_activation | provider rotation / revoke产品和principal未选择 | 不阻塞P0/Step10;激活前闭合CCT-15/16和provider audit |
| SBX-CFG-CHANGE-HIST-001 | historical_material | contained | 旧README/05/06可能诱导host fallback、raw env secret、unreviewed override或hot rollback | 未继承;S07/S08/reload/hot均CRL-04 |
| SBX-DOC-GAP-TEST-001 | downstream document gap | open | 正式`05`仍是旧材料 | 不阻塞Step10;后续覆盖review/TOCTOU/apply/rollback/drift/sensitive negative tests |
| SBX-DOC-GAP-ACCEPT-001 | downstream document gap | open | 正式`06`仍是旧材料 | 不阻塞Step10;high-risk无review/audit/rollback、truth rewrite和unsafe rollback进入veto候选 |

当前未发现阻塞Step 10完成的上游blocker。Ops carrier、orchestration和provider产品缺失是实施 /运维或P05+资格缺口,不能在本文伪造成已选型或已验证。

### 9.14 对下游文档的影响总表

| 下游 | 从本Step接收 | 本Step不提供 |
|---|---|---|
| `04` Step 11 | CCT/CCS/CAP/CRB/CDR失败面、rollback failure、drift、revocation和effect suspect | 完整告警、severity、恢复 /降级矩阵 |
| `04` Step 12 | 40组change control、review、audit、rollback、sensitive和drift测试 /验收 /实施输入 | 真实record、run_id、evidence、签署 |
| `04` Step 13 | S01 schema compatibility、marker evolution、source /field migration、reload reopen trigger | 迁移 /废弃版本策略 |
| `05-测试方案.md` | risk escalation、TOCTOU、S04-after-review、atomic apply、rollback revalidation、drift和no-truth-rewrite | 测试执行结果 |
| `06-验收标准.md` | high-risk review/audit/rollback、unsafe change reject、rollback failure truthfulness、no leak / no rewrite veto | 验收签署 /风险接受 |
| `07-实施计划.md` | ops-private record、marker factory、validator integration、generation relation、drift carrier职责 | phase / commit、ledger、skeleton或产品已存在事实 |
| `09-部署与运维手册.md` | proposal/review/apply/rollback/drift/provider rotation的产品中立流程和成功判定 | 具体命令、账号、路径、endpoint、secret、排班和runbook |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 判定依据 | 回写位置 | 状态 |
|---|---:|---|---|---|
| complete candidate + restart-only generation apply | 否 | 承接Step 9 / `03` startup builder,不新增runtime mutation | 不适用 | no_writeback |
| `ConfigurationChangeControlRecord`归ops-private plane | 否 | 不进入L4 domain/contracts/application/public API | 不适用 | resolved_no_writeback |
| runtime只复用config validation / adapter availability surface | 否 | 不新增`SandboxTraceKind`或business audit object | 不适用 | no_writeback |
| high-risk independent review与S04-after-review | 否 | release / provider调用前置门禁,不改变runtime port | 不适用 | no_writeback |
| rollback不改写truth / audit / relay / receipt / report / handoff | 否 | 承接正式`03`事务、幂等和audit不变量 | 不适用 | no_writeback |
| desired / observed marker与drift在ops plane | 否 | runtime只报告existing safe config ref / diagnostic;无fleet API | 不适用 | no_writeback |
| runtime mutation command / query / change repository | 是,若要求 | 新增object、port、DTO、authorization、idempotency、flow和audit | `03` Step 6~15 | blocker_if_requested |
| remote config / admin override / reload / LKG / partial hot swap | 是,若要求 | 改变builder state、并发、一致性、rollback和entry flow | `03` Step 6/9/10/12/13/14/15 | future_reopen_trigger |
| immediate revocation callback / adapter hot-stop | 是,若要求 | 需要provider callback、runtime termination和observability flow | `03` Step 7/9/12/14/15 | future_reopen_trigger |
| deployment rollout / traffic / drain / software rollback | 否,当前下游 | 不属于L4 business runtime;由`07/09`产品化 | 不适用 | downstream_only |

本Step没有`待回写`项。No-writeback成立的前提是change lifecycle保持release / ops-private,runtime仍只接受startup sources和typed scoped input,并且任何online mutation能力都视为设计reopen。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“变更职责与评审层级”“来源变化规则”“配置变更总表”“40配置组回指”“Safe Change Manifest与审计分工”“Apply与Rollback处理流”“Rollback矩阵”“Sensitive Rotation”“Drift矩阵”“逐类停审”和“跨变更审计”。

正式`04-配置设计.md` §10应回填:

1. CCA-01~07职责与CRL-01~04评审层级,明确不定义member角色产品。
2. Direction-aware风险升级规则。
3. S00~S08来源变化 / rollback规则。
4. CCT-01~18配置变更总表。
5. 40配置组到I001~I101、Step 8 sensitivity、Step 9 FZ/LD和Step 11失效的回指表。
6. Ops change control、runtime validation / availability和provider native audit三层分工。
7. Safe record字段与CCS-01~14 lifecycle。
8. CAP-01~17 apply / rollback流程和TOCTOU marker check。
9. CRB-01~12 rollback矩阵与no-truth-rewrite不变量。
10. Sensitive ref / descriptor / same-ref material rotation附加规则。
11. CDR-01~08 drift状态与no-auto-overwrite规则。
12. 逐类停审、跨变更审计、historical / blocker与`03`影响判定。

正式装配不得:

- 写具体ticket、IAM、approval、release、orchestrator、secret provider或audit产品。
- 把完整config diff、plain digest、full sensitive ref、provider marker或raw material写入audit。
- 把old process存活、prior config存在或partial instance success写成rollback / rollout成功。
- 把rollback写成撤销sandbox truth、audit、relay、receipt、report、handoff、cleanup或redline事实。
- 把S05 / S06写成global desired state或允许S07/S08/reload/hot。
- 伪造actor、review、change record、generation、测试、evidence、验收或commit。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 10 | 后续处理 |
|---|---|---:|---|
| change control / review / release物理产品 | product not selected | 否 | `07/09`选择carrier;不得改变logical field与redaction边界 |
| actor authorization和independent reviewer判定来源 | external authorization truth | 否 | 不归sandbox;实施前确认safe actor refs与policy |
| `RedactedConfigMarker` exact算法 | implementation detail | 否 | `07`定义不可枚举marker factory;禁止plain hash / truncation |
| rollout scope / desired marker store | downstream carrier gap | 否 | `07/09`定义;无scope时不得声称fleet aligned |
| effect anomaly / smoke / observation threshold | Step11 / operations input | 否 | Step11定义失效与告警;本文只消费safe signal |
| prior config与当前software / schema compatibility | release preflight input | 否 | rollback必须重新Step 9;失败记CCS-14 |
| provider rotation / revoke产品 | P05+ activation gap | 否 | 激活前闭合CCT-15/16和provider audit |
| zero-downtime、traffic、drain和process order | operations detail | 否 | `07/09`定义;本文不声明能力 |
| change record / config candidate retention | operations detail | 否 | Step11/13/09定义保留、迁移和不可用处置 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 9 | 通过 | 本次确认只放行Step 10 |
| I001~I101由40配置组完整覆盖 | 通过 | §9.4共40行;首列item集合恰好覆盖101项且无重复,组名 / 顺序与Step 7一致 |
| CCA-01~07、CRL-01~04连续且职责闭合 | 通过 | §9.1编号、职责分离和方向升级规则完整 |
| CCT-01~18变更表与停审完整 | 通过 | §9.3 / §9.11各18项且集合 / 顺序一致 |
| CCS-01~14 lifecycle连续且无非法跳转 | 通过 | §9.5编号连续;candidate revision与rollback child request迁移已对齐CAP流程 |
| CAP-01~17 apply / rollback阶段连续 | 通过 | §9.6编号连续;desired / active rollout / observed时序与LD-24一致 |
| CRB-01~12 rollback场景闭合 | 通过 | §9.7编号连续;prior incompatibility、revocation与rollback failure均显式 |
| 40 sensitive与23 M / 15 reference-only / 2 test-only承接一致 | 通过 | §9.8与Step 8三类集合精确一致;38项sensitive ref组均叠加CCT-15,2项test-only组叠加CCT-14 |
| CDR-01~08 drift状态闭合 | 通过 | §9.9编号连续;approval-only / failed / cancelled / superseded rollout不得掩盖drift |
| high-risk review / audit / rollback与critical reject闭合 | 通过 | §9.1~§9.7 |
| rollback不改写sandbox truth / formal carrier | 通过 | §9.10 |
| 逐类停审和跨变更审计无unresolved conflict | 通过 | §9.11 / §9.12共30组Markdown表结构校验通过 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future blocker已登记 |
| 未创建正式`04`、Step 11或实现类文件 | 通过 | 文件检查未发现正式`04`、Step 11、implementation ledger或planned boundary skeleton |

```text
current_document = `04-配置设计.md`
current_step = Step 10 `定义配置变更、审计与回滚`
gate_status = passed_to_step_11
next_allowed_action = Step 11已按门禁创建并完成;当前等待用户审查`04_config_step_11_failure_degradation.md`
formal_document_write = not_started
commit_required = no
```
