# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/配置设计书写规范.md` §5.13
> 回填章节: `04-配置设计.md` §13 配置迁移、废弃与演进
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_14
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接Step 5的S00~S08 / C01~C27、Step 6的ENV-01~07 / PROFILE-01~07、Step 7的I001~I101 / 40配置组 / D01~D44、Step 8的S04 / material lifecycle、Step 9的strict parser / validation / atomic generation、Step 10的candidate / rollback / drift、Step 11的failure / recovery和Step 12的下游责任,定义当前迁移基线与未来新增、重命名、废弃、兼容和移除协议。不得伪造已发布schema、软件版本、兼容窗口日期、迁移执行、使用量、evidence alias、run_id、验收签署、实现commit、implementation ledger、planned boundary skeleton、真实产品或部署事实。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入Step 13 | 是。用户审查Step 12后回复“同意”,本次只放行Step 13。 |
| 项目级台账是否允许进入Step 13 | 是。恢复点为Step 12 `pass_wait_review`,且用户已明确确认。 |
| 文档级flow是否允许进入Step 13 | 是。Step 12已闭合`04 -> 05/06/07/09`责任、planned evidence和开放blocker分发。 |
| 是否读取Step 13 SOP /书写规范 | 是。必须输出“旧配置 /新配置 /状态 /兼容窗口 /迁移策略 /移除条件”,暂无迁移时也必须明确说明。 |
| 是否读取演进必需上游 | 是。已复核Step 5 / 7 / 8 / 9 / 10 / 11 / 12及正式`03` config carrier边界。 |
| 是否参考L1项目粒度 | 是。参考L1-governance / L1-artifact Step 13结构,但针对L4 strict parser、complete generation、四维boundary、S04和rollback compatibility重新展开。 |
| 当前状态 | 已完成并通过语义一致性与机械门禁;用户已确认并放行Step 14 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 正式文档状态 | `projects/L4-sandbox/04-配置设计.md`仍不存在;只允许Step 15装配 |
| 停审方式 | 本Step完成后已暂停并经用户确认;Step 14已独立完成并等待审查 |
| 是否发现阻塞本Step的上游blocker | 否。当前没有可声明为已发布配置契约的旧schema;目标实现仓、真实软件baseline、产品binding和P05+资格仍未形成,因此本Step只能定义未来协议而不能伪造具体迁移。若要求当前支持alias双读、runtime schema协商、remote / admin / reload / LKG / hot swap或immediate revoke callback,则转为`03/04`重开blocker。 |

---

## 2. 本步目标与非范围

本Step的核心不是为不存在的旧配置编造迁移,而是固定两个事实:

1. L4-sandbox当前只有经Step 1~12讨论形成的`I001~I101`初始设计基线,正式`04`尚未装配、目标实现仓尚未确认,没有可证明已发布 /已部署 /仍被消费的旧runtime config schema。
2. 一旦未来首个配置契约真实发布,任何新增、重命名、移动、分拆、合并、默认值变化、范围变化、来源变化、profile变化、废弃或移除都必须同时闭合软件baseline、完整candidate、strict parser、rollback compatibility、下游证据和运维退出条件。

本Step必须回答:

- 旧README / `05/06`中的Docker、gVisor、host runtime、dev / test / staging、默认出网 / cleanup等文字为何不是迁移输入。
- 当前101项配置是否存在旧key、alias、deprecated key、版本协商或兼容窗口。
- 新配置项如何在不破坏closed schema、no-fallback和atomic generation的前提下引入。
- 新软件 /旧配置、旧软件 /新配置、混合软件fleet /单一desired candidate分别如何判定兼容。
- 重命名 /移动 /拆分 /合并为何不能直接依赖当前parser双读,以及未来若批准双读必须回写哪些Step。
- default、range、enum、requiredness、source、profile、registry ref、S04 material version、route / target和安全guard的演进有什么不同。
- deprecated何时仍可接受、何时必须reject、何时才可从schema和rollback资产中移除。
- 哪些演进只需`04`重开,哪些会改变`03` object / port / DTO / error / flow / state / audit而必须先回写`03`。
- 未来`05/06/07/09`需要什么迁移验证、裁决、实施和运维输入,但为何当前不能生成真实evidence。

本Step不定义:

- 真实软件版本号、config schema版本号、发布日期、兼容截止日期、release train或fleet拓扑。
- 迁移脚本、转换器、配置文件路径、命令、CI job、deployment wave或rollback runbook。
- 当前不存在的alias parser、multi-schema loader、runtime negotiation、remote source、admin override、reload、online LKG、hot adapter swap或callback实现。
- 具体provider / backend / store / bus / scheduler / alert产品及其版本兼容矩阵。
- 真实旧key使用量、迁移完成率、scan结果、test result、EV alias、run_id、验收或风险接受。
- 正式`04`、Step 14、`05/06/07/09`正文、implementation ledger、planned boundary skeleton或代码。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | reviewed | 提供S00~S08、strict duplicate / alias / unknown、S01 < S02 < S03、no fallback和future source重开条件 |
| `04_config_step_06_environment_profiles_matrix.md` | reviewed | 提供ENV-01~07、PROFILE-01~07、profile资格不可传递和P07 inactive事实 |
| `04_config_step_07_config_items.md` | reviewed | 提供I001~I101、40配置组、D01~D44、exact type / default / required / source / scope和D44 no-current-key |
| `04_config_step_08_sensitive_secrets.md` | reviewed | 提供40 sensitive、23 material-capable、15 reference-only、2 test-only、S04和material version / lease / revoke边界 |
| `04_config_step_09_loading_validation_activation.md` | reviewed | 提供closed parse、V01~10、FZ / LD、CFG-VAL、XVAL、complete generation和unsupported reload / hot |
| `04_config_step_10_change_audit_rollback.md` | reviewed | 提供S00~S08变更、candidate revision、prior compatibility、CAP / CRB / CDR和marker边界 |
| `04_config_step_11_failure_degradation.md` | reviewed | 提供ordinary config无隐含TTL、unsupported source / LKG、失败分类和recovery unit |
| `04_config_step_12_downstream_handoff.md` | reviewed_passed_to_step_13 | 提供TSH / AHG / EHR / IMH / OPH责任、P05+ blocker和no-fabrication边界 |
| `projects/L4-sandbox/03-详细设计.md` §13~§17 | current formal baseline | 提供`SandboxRuntimeConfigSummary`、config ref、builder / adapter binding、测试 /实施承接和`03`回写判断 |
| 旧`README.md` / `05-测试方案.md` / `06-验收标准.md` | historical_material | 只在当前结论形成后审计为何不构成已发布旧配置;不得反推迁移mapping |
| L1-governance / L1-artifact Step 13 | granularity reference | 参考current-no-migration、deprecation、evidence和future queue结构,不继承其GRC / artifact / outbox配置语义 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 是否存在旧配置需要迁移 | 当前无迁移项。正式`04`尚未创建,目标实现仓和首个runtime config release均不存在可验证事实;旧README / `05/06`不是当前配置契约。不得把历史文字映射成旧key或声称存在已部署用户。 |
| 新配置如何引入 | 先分类演进类型和兼容方向,再回写Step 3~12对应真相源。新增key至少闭合Step 7 schema、Step 5 source、Step 8 sensitivity、Step 9 parse / validation / activation、Step 10 change / rollback、Step 11 failure和Step 12 downstream;若改变runtime carrier / flow则先回写`03`。实现不得先加key再补设计。 |
| 旧配置如何废弃 | 未来只有真实发布过的canonical key才可进入deprecated。必须定义替代项、窗口起止baseline、old-only / new-only / both / absent行为、safe diagnostic、artifact迁移、rollback资产、下游验证和移除门禁。当前alias一律reject,不得把“deprecated”写成隐含双读能力。 |
| 是否需要兼容窗口 | 当前无迁移项,所以没有真实窗口。未来每个新增 /废弃都必须显式选择ECW-01~07之一;窗口按软件baseline、candidate和资格 /证据门禁界定,不得用未定义天数、ordinary TTL或old process存活代替。 |
| 何时允许移除旧配置 | 只有deprecated窗口结束、所有声明scope已迁移、当前和rollback软件 / candidate矩阵通过、旧key / old ref使用为零有真实fixed evidence、`05/06/07/09`同步、无P05+资格依赖、且移除不会迫使`03`契约变化时才允许。当前没有任何可执行移除项。 |

---

## 5. 当前文档问题诊断

| 位置 | Step 13前问题 | 本Step处理 |
|---|---|---|
| 正式`04`缺失 | 容易把初始设计误称v1已发布schema | 区分`designed_initial_baseline`与真实published / implemented / accepted事实 |
| Step 5 C05 / C06 | alias、deprecated key和unknown当前统一reject,但L1通用模板提到old->new双读 | 保持当前无alias;双读只作为future design-reopen protocol,不写成现有loader行为 |
| Step 7 I001~I101 | 字段级schema完整,但没有统一演进类别和移除规则 | 建立EVC分类、40组回指和逐域影响审计 |
| Step 8 S04 | ordinary ref、descriptor和material version可能被混成一种迁移 | 分离key / ref / descriptor / same-ref material version / lease五层生命周期 |
| Step 9 strict parser | 新key对旧软件并不向后兼容,容易被“additive”一词掩盖 | 建立old-software/new-config与new-software/old-config双向矩阵 |
| Step 10 rollback | prior candidate必须重新走当前validator,但未定义跨软件schema compatibility | 增加software baseline + complete candidate + profile资格联合门禁 |
| Step 10 markers | marker / config_ref / generation_ref可能被误作schema version | 明确它们只标识candidate / semantics / generation,不提供版本协商 |
| Step 11 ordinary TTL | 可能被artifact retention或deprecated window误推导出runtime expiry | 窗口属于release治理;ordinary config仍无隐含TTL |
| Step 12 evidence | 已有planned EHR,但没有迁移专项证明命题 | 新增MER planned requirement并映射TSH / AHG / EHR,不分配真实alias |
| historical material | 旧Docker / host / environment语义可能被润色成legacy config | 单列historical exclusion,不产生migration mapping |

---

## 6. 改动前后对比

| 维度 | Step 13前 | Step 13后 |
|---|---|---|
| current migration | 只知道正式`04`缺失 | 明确“当前无迁移项”,并说明何种事实形成后才建立首个published baseline |
| version identity | config ref / marker / generation分散 | 区分设计baseline、软件baseline、candidate、semantics marker、profile、registry、material和generation |
| compatibility | prior candidate只要求当前validator重跑 | 同时评估new software / old config、old software / new config、mixed fleet和rollback target |
| additive field | 可能被误作天然兼容 | old software strict unknown reject;必须software-first或显式多artifact方案 |
| rename / deprecation | 当前alias reject,无未来协议 | 定义future dual-read重开条件、both-present reject和bounded exit gate |
| sensitive evolution | ref / descriptor / material rotation混写风险 | 分离ordinary schema迁移、binding迁移和provider-native material lifecycle |
| coverage | 无迁移逐组 /逐域审计 | 40配置组 / I001~I101和D01~D44全部有演进责任 |
| downstream | 只有通用handoff | 迁移专项test / acceptance / implementation / operations和planned evidence可反查 |

---

## 7. 配置设计取舍

| 议题 | 候选 | 结论与理由 |
|---|---|---|
| 是否把旧README / `05/06`当legacy schema | A. 推导旧key;B. historical only | 采用B。没有正式key、parser、release或consumer evidence,推导mapping会伪造迁移事实。 |
| 是否现在增加`schemaVersion` key | A. 增加;B. 不增加 | 采用B。Step 7无该项,当前无multi-schema loader / negotiation;本Step只定义治理协议。未来需要时重开Step 5 / 7 / 9,影响runtime carrier时先回`03`。 |
| marker是否可替代schema version | A. 可以;B. 不可以 | 采用B。`RedactedConfigMarker`标识validated semantics,`generation_ref`标识发布代次,都不表达兼容关系。 |
| 新optional key是否天然向后兼容 | A. 是;B. 否 | 采用B。旧软件closed parser会把新key当unknown;必须先部署能接受旧artifact的新软件,再引入新key,或设计明确的artifact分流。 |
| rename是否直接接受old / new alias | A. 直接双读;B. 当前reject,未来显式重开 | 采用B。当前C05无alias例外。若批准双读,必须重开Step 5 / 7 / 9 / 10 / 11 / 12并定义both-present conflict。 |
| deprecated窗口是否按天数默认 | A. 固定默认天数;B. 基于baseline和证据 | 采用B。当前无release cadence;窗口必须有明确起止baseline、scope和exit evidence,不得发明数字。 |
| material rotation是否属于ordinary key migration | A. 是;B. 分层 | 采用B。same-ref version rotation由provider / lease lifecycle处理;ref或descriptor变化才进入candidate / generation兼容。 |
| 是否允许安全红线提供兼容成功窗口 | A. 临时允许;B. 立即reject | 采用B。raw material、hard guard削弱、host / fake fallback、truth rewrite等不获得成功兼容期。 |

---

## 8. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 12 | done | 确认用户只放行Step 13 |
| 2 | 读取Step 13 SOP、书写规范和L1参考 | done | 固定mandatory table、no-current-migration与兼容窗口要求 |
| 3 | 读取Step 5~12和正式`03` | done | 固定strict parser、101项、S04、generation、rollback与handoff边界 |
| 4 | 定义当前迁移基线、演进单位和状态 | done | §9.1~§9.3;current-no-migration、EBU与ELS闭合 |
| 5 | 定义兼容窗口、引入、分类和废弃协议 | done | §9.4~§9.9;ECW / software matrix / EIP / EVC / DSG / ERG闭合 |
| 6 | 完成source / profile / sensitive / 40组 / 44域审计 | done | §9.10~§9.14;S00~S08、PROFILE、23 / 15 / 2、I001~I101和D01~D44闭合 |
| 7 | 完成future queue、下游证据和blocker | done | §9.15~§9.18;FEQ / MER、下游、historical与转阻塞时机闭合 |
| 8 | 完成`03`影响、回填草稿和待确认 | done | §9.19~§12;当前无`03`回写项,future trigger明确 |
| 9 | 机械校验、状态同步并停审 | done | 35个Markdown表、稳定编号、source / profile / sensitive / 40组 / 101项 / 44域、引用、secret和提前产物门禁通过;未创建Step 14、正式`04`或实现类文件 |

---

## 9. 结构化中间产物

### 9.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无:当前不存在已发布的L4-sandbox正式runtime config schema | `I001~I101`初始设计基线,仍待Step 15装配和后续实现 /验证 /验收 | `current_no_migration_item`;`designed_initial_baseline` | 不适用;不得伪造起止版本 /日期 | 不从旧README / `05/06`推导key或转换器;未来首个真实release形成后才建立published baseline | 不适用;当前没有old key、alias、deprecated key或可执行removal |

“当前无迁移项”只表示没有合法old -> new runtime mapping,不表示未来可以跳过演进治理。以下事实均尚未发生:首个实现仓baseline、首个software release、首个published config artifact、首个profile qualification、真实migration evidence和验收签署。

### 9.2 演进真相单元与禁止替代

`EBU-xx`表示Evolution Baseline Unit,只用于本设计文档分类,不是新增public DTO、runtime enum、repository或audit kind。

| EBU ID /单元 | 当前真相源 | 表达什么 | 不表达什么 | 演进责任 |
|---|---|---|---|---|
| EBU-01 design contract baseline | 正式`00~03`、当前`04`校准来源及未来装配的正式`04` | 当前允许的schema、source、profile、guard和binding契约 | 正式`04`已装配、实现已完成、软件版本或runtime已发布 | 任何语义变更先修改拥有真相的校准Step /正式文档 |
| EBU-02 software baseline | 未来目标实现仓与release事实 | 某构建实际支持的parser / validator / builder契约 | config candidate本身、fleet rollout结果 | `07`规划;真实实现 /release后由operations固定 |
| EBU-03 complete candidate | Step 10 `CompleteCandidateConfig` / `candidate_config_ref` | 可独立走Step 9的完整ordinary candidate与source语义 | patch、schema version、material body | 每次global变化都形成immutable revision并重新review |
| EBU-04 validated semantics marker | Step 10 `RedactedConfigMarker` | 某candidate经当前parser / validator得到的不可枚举safe semantics identity | plain hash、schema compatibility、软件版本 | drift / desired比较;不得用于自动选parser |
| EBU-05 profile qualification | Step 6 PROFILE-01~07 + Step 12 EHR / AHG | candidate在哪类环境 / adapter / workload资格下可用 | 产品自动可用、相邻profile资格传递 | profile语义变化回Step 6;资格由`05/06/09`闭合 |
| EBU-06 registry / descriptor baseline | Step 7 P0 registry + Step 8 S04 descriptor | opaque ref family、adapter / store / route / target descriptor语义 | material正文、provider产品已选、same-ref version | semantic rebinding禁止;不兼容语义使用新ref并迁移candidate |
| EBU-07 material lease / version | Step 8 + Step 10 CCT-16 | concrete consumer的bounded material版本、lease、expiry / revoke | ordinary config key、global fallback、schema revision | provider-native rotation;不改写candidate历史 |
| EBU-08 runtime generation | Step 9 FZ-03 / LD-24 + Step 10 generation marker | same-generation complete handle set及单generation观察 | fleet-wide aligned、schema version、rollback成功 | 新candidate或binding变化默认构建new generation |
| EBU-09 downstream decision baseline | Step 12 DSH / EHR,未来正式`05/06/07/09` | 测试schema、真实evidence、acceptance和运行准备状态 | 设计表本身就是证据或已批准release | 迁移窗口退出前必须有fixed evidence与裁决 |

跨单元不变量:

- EBU-03 / 04 / 08不得替代EBU-02的software compatibility;old process存活也不得证明new candidate可rollback。
- EBU-04是不可枚举safe marker,不能拿来推导字段、版本、material、产品或compatibility。
- EBU-05 qualification不能从PROFILE-02 / 03 / 04传递到PROFILE-05+,也不能从P05自动传递到P06 / P07。
- EBU-06 descriptor与EBU-07 concrete material分离;ordinary candidate只选择opaque ref,不保存material version。
- EBU-09只有真实执行后才会形成evidence / acceptance;本Step只定义未来要求。

### 9.3 配置演进生命周期

`ELS-xx`表示Evolution Lifecycle State,是release / design治理术语,不是runtime状态或新增`SandboxRuntimeConfigSummary`字段。

| ELS ID /状态 | 含义 | Parser / validator资格 | 允许迁移 | 禁止声明 |
|---|---|---|---|---|
| ELS-01 `designed_initial` | 已在当前校准设计定义并待正式`04`装配,尚无真实published / implemented事实 | 只存在设计契约;不能声称loader支持 | 正式装配及真实首发门禁闭合后到ELS-02 | 正式`04`已存在、已发布、已部署、已验收、已有consumer |
| ELS-02 `active_published` | 某software baseline与canonical key /语义已真实发布 | 只接受该baseline声明的closed schema | 保持ELS-02或经正式change进入ELS-03 | 从设计状态直接推导active |
| ELS-03 `deprecated_accepted` | canonical legacy输入在有界窗口内仍被明确接受,且有替代目标 | 只有经Step 5 / 7 / 9重开后定义的兼容parser才可接受;必须safe diagnostic | ELS-04;必要时新change回ELS-02但不得改写历史 | 当前parser天然支持alias、silent fallback、无结束窗口 |
| ELS-04 `legacy_rejected` | 旧输入已越过兼容窗口,明确validation reject | old key / value / profile进入stable safe rejection | ELS-05 | 仍把旧输入算accepted或fallback到新default |
| ELS-05 `removed_from_current_schema` | 当前实现不再保留旧解析 /映射分支,但历史ID /记录保留 | 作为unknown / removed class拒绝;历史evidence仍可读 | terminal;未来复用需新设计 /新ID | 删除历史ID、复用旧ID表示新语义、清除change / evidence记录 |
| ELS-06 `rejected_without_compatibility` | 输入从未合法发布或违反安全 /设计边界 | 立即reject,没有accepted窗口 | 只有正式重开设计后成为新的ELS-01条目 | 把reject期称deprecated兼容期 |
| ELS-07 `design_reopen_required` | 演进会改变`03`或重写当前source / state / flow / public surface | 不进入current schema或implementation boundary | `03`回写 + `04`对应Step重开后重新分类 | 用ops exception、alias或feature flag绕过设计 |

生命周期规则:

- 当前`I001~I101`整体处于ELS-01,不是ELS-02;没有任何ELS-03~05实例。
- stable item ID和历史key身份一经真实发布不得复用。未来removed项仍保留历史ID、owner、replacement和evidence索引;新语义必须获得新ID。
- ELS-03必须同时有replacement、兼容窗口、old-only / new-only / both行为、safe diagnostic和exit evidence;缺任一项不得开始。
- ELS-04是窗口退出后的显式拒绝阶段,不是配置缺失时的default fallback。
- ELS-06适用于raw secret、unknown / typo、unsupported source、hard guard削弱、P07未授权激活等从未合法的输入;它们不先进入deprecated。
- ELS-07不能被普通config review批准;沿用Step 10 CRL-04 / CCA-07设计重开边界。

### 9.4 兼容窗口类型与选择规则

`ECW-xx`表示Evolution Compatibility Window。窗口不是时间TTL,必须由起始baseline、适用rollout scope、允许组合、结束门禁和rollback资产共同界定。当前没有真实日期 /版本可填,所以只定义窗口类型。

| ECW ID /窗口 | 适用变化 | 窗口内允许组合 | 明确禁止 | 退出条件 |
|---|---|---|---|---|
| ECW-01 initial release / no prior | 首个真实software + config release | 只有首发candidate +首发software经完整资格后发布 | 声称兼容旧README /旧`05/06`、伪造v1或使用量 | 正式`04~07`闭合,implementation / tests产生真实首发证据后建立首个published baseline |
| ECW-02 same-schema overlap | key集合 /类型不变,old / new software都接受完整candidate的值、ref或safe default变化 | 同一candidate必须分别通过old与new software完整Step 9等价验证;scope内仍只有一个desired | 用新软件通过替代旧软件验证、partial field patch、降级guard | 所有required software / profile组合有fixed compatibility evidence,rollback candidate仍可重建 |
| ECW-03 software-first additive | 新增optional或可缺省key,新软件先支持old artifact absence | old software + old artifact;new software + old artifact;待old software退出后new software + new artifact | old software +含new key artifact;unknown-key ignore;在mixed fleet共享new artifact | scope内old software observation归零,新软件对old / new artifact均通过,再切new complete candidate |
| ECW-04 explicit dual-schema deprecation | rename / move /受控old->new转换确有业务必要 | 仅在重开Step 5 / 7 / 9后允许old-only或new-only;both-present必须reject semantic duplicate | 当前直接双读、old覆盖new、silent warning、无限窗口 | new-only artifact覆盖全部scope,old software退出,old-key usage为零,rollback不依赖old-only后进入ELS-04 |
| ECW-05 coordinated breaking cutover | 类型 /shape /split /merge /requiredness等无法双向兼容 | 按不同rollout scope使用各自完整software + complete candidate组合;同一instance无overlay /混合schema | 单artifact跨不兼容software、partial generation、同scope多desired、猜测转换 | 每scope先通过新组合与rollback plan;切换完成且旧组合退出后关闭窗口 |
| ECW-06 qualified binding overlap | opaque ref /descriptor、provider material、backend / store / route / target或profile资格迁移 | old / new binding分别完整qualification;provider允许时material lease可有有界重叠;candidate仍单一 | revoked / expired material回退、fake / host fallback、一个ref隐式改变family /语义 | new binding资格、anti-leak、availability、rollback / forward-fix和profile evidence全部闭合 |
| ECW-07 reject-only / no success | 从未合法的unknown / alias、raw material、unsupported source、hard guard削弱、truth rewrite、P07未授权等 | 只允许safe rejection与design reopen请求 | 任何temporary allow、warning-only、emergency override或old process success | 只有新的正式设计把能力定义为ELS-01后才能离开;原非法输入不被追认为legacy |

选择规则:

- 每个future EVC变化必须恰好选择一个主ECW;涉及binding / material时可在主窗口上叠加ECW-06,但不得用叠加掩盖schema不兼容。
- “兼容窗口为零”只能写成ECW-07或经过裁决的coordinated cutover,不能省略迁移策略。
- ECW-03不能在old software仍存在的scope投放含new key的S02 / S03;S03 allowlist也属于software parser baseline,必须同步升级。
- ECW-04当前不可执行。只有兼容parser、safe warning carrier、both-present conflict、artifact scanner和移除测试均设计闭合后才能启用。
- ECW-05允许不同rollout scope暂时运行不同complete candidate,但不允许在同一process做profile overlay / hot swap;每scope desired / observed仍遵守Step 10。
- ECW-06的same-ref material rotation不是ordinary config schema窗口;若ref / descriptor语义变化,仍需new complete candidate和new generation。

### 9.5 软件、配置与回滚兼容矩阵

`SW-old/SW-new`和`CFG-old/CFG-new`只是未来相邻published baseline的关系占位,不是当前版本事实。

| 组合 | 默认资格 | 必须证明 | 失败处置 | 禁止推断 |
|---|---|---|---|---|
| SW-old + CFG-old | 只作为已知prior候选,不自动持续qualified | prior software / profile仍在支持范围,required dependencies和material未失效 | 保持prior运行事实或进入incident;不得延长为online LKG | old process alive等于rollback / current acceptance |
| SW-new + CFG-old | software-first / rollback关键组合 | new parser、validator、builder对完整old candidate通过;defaults / registry / protocol / profile语义不漂移 | 阻塞software rollout或判rollback target incompatible | new software能启动即证明行为等价 |
| SW-old + CFG-new | 默认不兼容 | 只有ECW-02明确same-schema且old software实测通过时才可用;ECW-03新增key必定禁止 | 不向old scope投放;使用scope-specific complete candidate | optional new key会被old parser忽略 |
| SW-new + CFG-new | 新目标组合 | 全量Step 9、profile qualification、generation atomicity、`05/06`迁移门禁 | 不发布或rollback / forward-fix | unit parse通过等于profile ready |
| mixed software + one CFG-old | 仅ECW-02 / 03软件先行阶段可候选 | 每个software baseline都对同一完整candidate通过,desired scope和observation完整 | 任一baseline不兼容则拆scope或停止rollout | 部分instance通过等于fleet compatible |
| mixed software + one CFG-new | 默认禁止 | 只有ECW-02且old software对完整new candidate有固定证据时可候选 | 拆分scope;不得靠unknown ignore | new key absence / presence可由instance自行决定 |
| mixed software + scoped CFG-old / CFG-new | 只允许ECW-05受控cutover | 每scope唯一desired、artifact不可交叉、required observation / rollback资产明确 | observation incomplete即不判aligned;失败scope独立处置 | 多scope等于overlay或可自动互相覆盖 |
| SW-new + prior rollback candidate | 每次rollback重新判定 | prior candidate在current software / schema / registry / material / profile下完整重建 | CCS-14 / CRB-12;forward fix或协调software rollback | prior approved必然compatible |
| prior SW + current candidate软件回滚 | 默认禁止 | prior software明确接受current complete candidate;否则software与candidate必须协调回到已验证组合 | 阻塞软件rollback,保留诚实失败 / incident | 只回二进制不回config仍安全 |

兼容判定不得只比较key集合。至少覆盖type / default / requiredness、source winner、cross-field、registry family、profile、S04 / availability、state / protocol binding、complete generation、failure disposition、redaction和rollback target。

### 9.6 新配置引入协议

`EIP-xx`表示Evolution Introduction Phase,是未来设计 /release门禁顺序,不是当前实现phase或`07` commit boundary。

| EIP ID /阶段 | 必须完成 | 主要真相源 | 不满足时处理 |
|---|---|---|---|
| EIP-01 motive / owner | 指向需求、风险、运维或产品资格问题;确认sandbox owner且不混入tools / runtime / member / artifact / observability / policy truth | 正式`00~02`;全局依赖裁剪规则 | 拒绝或交正确项目,不得新增key |
| EIP-02 evolution classify | 选择EVC、ELS目标、主ECW、affected item / domain / profile / source和compatibility方向 | 本文件§9.3~§9.7 | 分类不完整不得设计approval |
| EIP-03 `03` impact gate | 检查object / port / DTO / error / flow / state / persistence / audit / config summary carrier | 正式`03`;本文件§10 | 有影响先回写`03`,当前`04`停止推进该变化 |
| EIP-04 stable identity | 为新项分配不可复用的新stable ID、canonical key、owner group / domain;旧ID保持historical | Step 7 | 不得复用removed ID或只靠string alias |
| EIP-05 schema contract | 定义exact type、default、requiredness、range / enum / collection、source、scope、freeze、sensitivity、failure和code binding | Step 7 | 任一字段缺失不得进入implementation |
| EIP-06 source / conflict | 定义S00~S08资格、priority、old / new / both / unknown行为、S03 allowlist和no-fallback | Step 5 | ambiguous / high-invalid fallback一律reject |
| EIP-07 profile / qualification | 定义ENV / PROFILE适用性、fake / real边界、activation前置和不可传递资格 | Step 6 | 未闭合profile保持inactive / blocked |
| EIP-08 sensitive / material | 分类public / internal / sensitive / material-capable,定义S04、redaction、lease / revoke和provider qualification | Step 8 | raw / class / carrier未闭合即reject |
| EIP-09 load / activation | 更新V / LD / CFG-VAL / XVAL、freeze和complete generation;定义旧 /新software矩阵 | Step 9;本文件§9.5 | 无atomic / compatibility闭环不得发布 |
| EIP-10 change / rollback | 定义CCA / CRL / CCT、candidate revision、safe manifest、prior compatibility、desired / observed和rollback | Step 10 | prior不兼容可正式失败,不得绕validator |
| EIP-11 failure / recovery | 定义fail-fast / fail-closed / degraded资格、alert、recovery unit和negative cut | Step 11 | 不得silent fallback或truth rewrite |
| EIP-12 downstream handoff | 更新TSH / AHG / EHR / IMH / OPH及迁移专项MER;明确产品 /运维owner | Step 12;本文件§9.16 | `05/06/07/09`未承接不得release |
| EIP-13 formal approval | 正式`03/04`回写完成,Step 14风险关闭,正式`05/06/07`允许实施 | 正式文档链 | design状态未闭合不得创建实现boundary |
| EIP-14 implementation / evidence | 由正式`07`拆boundary并在真实执行后产生fixed evidence / acceptance | `07` + implementation ledger +真实gate | 本Step不得伪造完成、commit或证据 |

新项兼容规则:

- 新optional key只有在absence保持旧语义或明确safe-disabled、且SW-new + CFG-old通过时才可选ECW-03;否则按breaking change处理。
- 新required key、new enum mandatory branch、new closed-map required member和new active route通常选择ECW-05,不能靠default掩盖。
- S01 default变化属于software baseline变化,即使S02 key不变也必须做ECW-02双software验证;安全default弱化升级CRL-03 / 04。
- 新项若仅服务inactive future profile,仍必须closed schema / profile reject规则完整,不能把“暂未启用”当免验证。

### 9.7 配置演进分类矩阵

`EVC-xx`表示Evolution Change Class。每个future change至少选择一个主类;跨类时按最高风险和最强重开要求处理。

| EVC ID /变化 | 默认兼容性 | 主ECW | 必须重开 | 最低验证 /处置 |
|---|---|---|---|---|
| EVC-01 docs clarification only | runtime语义不变 | ECW-02或无runtime窗口 | 拥有文字的正式章节 | 证明key / type / default / behavior / code binding完全不变;不得借clarification改语义 |
| EVC-02 S01 default change | 双向未知 | ECW-02;不兼容则ECW-05 | Step 7 / 9 / 10 / 11 / 12 | old / new software各自对explicit / absent candidate验证;安全方向审查 |
| EVC-03 range / ceiling change | direction-sensitive | ECW-02或05 | Step 7 / 9 / 10 / 11 / 12 | boundary值、old candidate、direction risk、reject / no-clamp和capacity / safety证据 |
| EVC-04 enum / closed-set member change | 通常breaking;新增member对旧software不兼容 | ECW-03或05 | Step 7 / 9 / 10 / 11 / 12;影响protocol / state先回`03` | old software reject、new branch穷尽、unknown / unsupported disposition |
| EVC-05 optional key introduction | 仅new software可兼容old absence | ECW-03 | Step 5~12 | SW-new + CFG-old与SW-new + CFG-new;old software退出后才投new key |
| EVC-06 required key / required map member | breaking | ECW-05 | Step 5~12 | coordinated software + complete candidate;absence / old candidate明确失败或转换 |
| EVC-07 key rename / move | 当前不支持 | ECW-04或05 | Step 5 / 7 / 9 / 10 / 11 / 12;carrier变化先回`03` | old-only / new-only / both / absent,source priority,S03 mapping,warning / rejection和scanner |
| EVC-08 split / merge / type-shape conversion | breaking | ECW-05;仅一一无损时可申请ECW-04 | Step 5~12;对象 / DTO / flow变化先回`03` | deterministic mapping、semantic duplicate、round-trip不丢guard、rollback组合 |
| EVC-09 requiredness relax | 可能兼容new software,old software仍可能要求 | ECW-03或05 | Step 7 / 9 / 10 / 11 / 12 | absence语义、S01 default、old software behavior和profile impact |
| EVC-10 item deprecation / removal | 当前无实例 | ECW-04 -> ELS-04/05 | Step 5 / 7 / 9 / 10 / 11 / 12 | bounded window、usage zero、rollback independent、removed-key negative |
| EVC-11 source / priority / S03 mapping change | high risk | ECW-05;new source能力ELS-07 | Step 5 / 7 / 9 / 10 / 11 / 12;reload等先回`03` | winner matrix、present-invalid no-fallback、drift和source provenance |
| EVC-12 profile semantic / qualification change | high risk | ECW-05 / 06 | Step 6~12;public profile carrier变化先回`03` | 每profile独立资格、no fake / host fallback、promotion / deactivation |
| EVC-13 feature / route / target / closed-map change | high risk / often breaking | ECW-05 / 06 | Step 7~12;protocol kind变化先回`03` | active-key coverage、complete map、stored relay / handoff compatibility和no truth rollback |
| EVC-14 opaque ref / descriptor rebinding | semantic change,不是string替换 | ECW-06 | Step 7~12 | family / class / capability、old / new binding qualification、availability、safe markers |
| EVC-15 same-ref material version rotation | ordinary schema不变 | ECW-06 provider-native | Step 8 / 10 / 11 / 12;callback需求先回`03` | lease / renew / expiry / revoke / release、provider audit、forward rotation |
| EVC-16 retention / retry / cadence relation | direction-sensitive | ECW-02或05 | Step 7 / 9 / 10 / 11 / 12 | cross-field windows、stored replay / report / cleanup integrity和old records |
| EVC-17 redaction / audit / safety strengthening | 可能影响reader / ops,不能只看更严格 | ECW-02或05 | Step 7~12 | all-carrier scan、reader compatibility、formal audit保持、deny floor only grows |
| EVC-18 safety weakening / raw / fallback | 不允许 | ECW-07 | design authority;通常正式`00~03` | immediate reject;不得批准兼容窗口或风险接受绕过hard guard |
| EVC-19 runtime source / mutation / reload / LKG / hot | 当前无契约 | ELS-07 | 先回`03`,再重开Step 3~13 | source / state / concurrency / audit / rollback / in-flight / failure完整重设计 |
| EVC-20 runtime schema negotiation / multi-parser | 当前无契约 | ELS-07 | `03` object / DTO / error / flow / audit + Step 5 / 7 / 9~13 | exact version carrier、supported set、selection、unknown handling、downgrade prevention |

分类不改变Step 10风险下限。EVC-18~20不能由普通CCA-01~03流程直接activation;EVC-15也不能把provider允许的material overlap扩大为ordinary config alias窗口。

### 9.8 重命名、废弃与移除协议

当前strict parser保持以下事实:canonical + alias、canonical + deprecated key和unknown key都reject;当前没有warning-only deprecated path。未来若某个真实published key需要ECW-04,必须先通过下表全部设计门禁。

#### 9.8.1 未来dual-schema准入门禁

| Gate ID | 必须定义 | 当前状态 | 未满足时行为 |
|---|---|---|---|
| DSG-01 stable old / new identity | old stable item ID / canonical key、new stable ID / canonical key、owner group / domain和replacement relation | current_not_applicable | C05 / C06 strict reject保持 |
| DSG-02 semantic mapping | old-only到new semantic slot的一一映射、type / unit / enum / default / missing语义和不可映射分支 | current_not_applicable | 不得双读;选择ECW-05或放弃变化 |
| DSG-03 source parity | S01 / S02 / S03 / S05 / S06中old / new资格、winner provenance和S03 allowlist迁移 | current_not_applicable | source ambiguity reject |
| DSG-04 four-input behavior | old-only、new-only、both-present、both-absent精确处理;both-present无论值是否相同都默认semantic duplicate reject | current_not_applicable | 当前C05 reject |
| DSG-05 safe diagnostic | deprecation / removed issue进入既有safe carrier的字段闭集、redaction、低基数规则和store前fallback | current_not_applicable | 不得输出key value / full ref或新增public error |
| DSG-06 canonical snapshot | old-only被接受后如何形成唯一canonical in-memory semantic slot和marker;不得同时保留两份truth | current_not_applicable | 不得发布generation |
| DSG-07 complete generation | old / new candidate均全量走LD / XVAL / S04 / builder,禁止partial module或mixed identity | current_not_applicable | publish 0 handles |
| DSG-08 tests / evidence | parser、source、mapping、both-present、profile、binding、rollback和removed negative的planned evidence | current_not_applicable | 不进入`06/07` |
| DSG-09 bounded window | 起始software baseline、结束门禁、适用scope、old software退出和artifact scan owner | current_not_applicable | 不得标ELS-03 |
| DSG-10 removal / rollback | old branch删除前current / prior software-candidate组合、old usage zero、rollback candidate和history retention | current_not_applicable | 保持deprecated或rejected,不得移除代码 /设计记录 |

任何DSG门禁要求新增public config warning、schema version、query / status DTO或runtime negotiation时,先回写`03`;若只使用既有infra-private config issue / local safe diagnostic,仍需重开Step 9 / 11确认carrier。

#### 9.8.2 废弃阶段表

| 阶段 | ELS | Loader / validator行为 | Change / rollout要求 | 下游 /退出门禁 |
|---|---|---|---|---|
| deprecation proposal | ELS-02保持 | current parser不变;只形成design proposal | 选择replacement、EVC / ECW、owner、scope和rollback matrix | 未完成DSG不得进入accepted deprecation |
| compatibility introduced | ELS-03 | 经重开设计后old-only / new-only按定义接受;both-present reject;产生safe deprecation issue | software-first,新兼容software先在old artifact上qualification | `05`全部组合、`06`门禁、`09`artifact inventory可执行 |
| artifact migration | ELS-03 | new-only成为desired candidate;old-only仍只在窗口scope可接受 | 每scope唯一desired / active rollout;old artifact不可自动重写 | required scope new-only aligned;old usage scan fixed evidence |
| old input rejection | ELS-04 | old-only和both-present stable reject;new-only唯一accepted | rollout / rollback资产不得再需要old-only | removed-key negative、prior candidate matrix、P05+ profile证据通过 |
| parser branch removal | ELS-05 | 删除old mapping;old key按removed / unknown reject;历史ID / mapping / evidence保留 | 新software baseline +完整regression;不复用old ID / key | `05/06/07/09`同步、支持窗口关闭、history可追溯 |

不得把deprecation issue作为metric高基数label;只允许stable issue class / item ID等既有safe字段。真实old-key使用量需要受控artifact inventory或ops-private record,不能从raw config value日志推导。

### 9.9 移除门禁与禁止删除清单

`ERG-xx`表示Evolution Removal Gate。未来任一published item从ELS-04进入ELS-05前必须全部通过;当前无item具备适用事实。

| ERG ID | 门禁 | 必须证明 | 当前事实 |
|---|---|---|---|
| ERG-01 design closure | old / replacement / EVC / ECW / DSG / owner / scope完整 | 正式`03/04`已回写且无待处理影响 | no_current_removal |
| ERG-02 software floor | 所有支持scope已退出不理解new-only的software | fixed software observation / release inventory | no_current_software_baseline |
| ERG-03 artifact zero-use | S02 / S03 / profile artifacts和受控registry无old key / old semantic binding | fixed artifact scan,不使用`latest` | no_current_artifact_baseline |
| ERG-04 runtime alignment | required scope均运行new-only accepted generation | desired / observed / active relation和observation完整 | no_current_generation_evidence |
| ERG-05 profile qualification | 所有适用PROFILE独立通过;P05+无fake / host替代 | profile-specific fixed evidence和裁决 | no_current_profile_qualification |
| ERG-06 rollback independence | 所有仍保留的software rollback与prior candidate不依赖old parser / old key / revoked binding | current validator重建与failure drill | no_current_rollback_evidence |
| ERG-07 stored truth compatibility | replay / relay / receipt / report / handoff / audit / capture历史不需通过old config重算或改写 | no-truth-rewrite compatibility suite | planned_only |
| ERG-08 sensitive safety | old ref / descriptor / material无active lease、未完成rotation或未审计carrier;history只保留safe marker | provider / anti-leak / redaction evidence | provider_not_selected |
| ERG-09 downstream closure | `05/06/07/09`已更新,真实evidence被固定消费,无未接受风险 | formal document / fixed evidence / acceptance | downstream_not_rebuilt |
| ERG-10 history retention | old ID、replacement relation、change / rejection / evidence index和移除原因仍可追溯 | historical metadata不含raw value / material | planned_only |

以下内容不得因配置迁移而删除或改写:

- accepted domain truth、stored operation result、idempotency record、consumer receipt、job report、relay / handoff fact、capture fact、audit trace和failure / control history。
- `RedactedConfigMarker`、desired / observed / rollout历史和failed / cancelled / superseded disposition。
- provider native audit、lease / revoke / release disposition和security incident记录。
- stable item / domain / profile / source ID的历史定义和replacement / removal relation。
- NCFG、four-dimension boundary、policy fail-closed、query no-write、job no-repair、cleanup / redline / redaction hard guard。

移除配置项只改变未来candidate的合法输入和future runtime assembly,不允许retroactive重算或清洗上述truth。

### 9.10 S00~S08来源演进矩阵

| Source | 允许的演进 | 默认窗口 | 必须验证 | 禁止迁移路径 |
|---|---|---|---|---|
| S00 static boundary | 只通过正式`00~03`设计变化重新定义 | ELS-07 / ECW-07 until redesign | ownership、state / flow / security / acceptance全链 | 把static boundary变成config key、ops override或legacy allow |
| S01 code defaults | 同key safe default、disabled registry baseline或新software parser capability | ECW-02 / 03 / 05 | old / new software对explicit / absent candidate、direction risk和profile | config-only rollback、old default当LKG、real-like fallback fake |
| S02 selected JSON | 完整candidate按schema / artifact窗口迁移 | ECW-02~05 | strict parse、old / new / both、artifact inventory、scope desired / observed | patch source、directory merge、unreadable fallback或自动改写文件 |
| S03 allowlisted env | scalar / ref mapping随canonical item迁移,并同步部署注入契约 | 跟随主EVC窗口 | old / new env name conflict、present-invalid、allowlist和secret ban | implicit env alias、raw material、empty值回退或未审计host env |
| S04 secure material | descriptor / ref选取走ECW-06;same-ref version走provider-native lifecycle | ECW-06 | family / class、lease / expiry / revoke / release、native audit与anti-leak | ordinary sourcematerial、shared cache、revoked rollback、隐式改变ref语义 |
| S05 entry / loop / job input | typed field演进必须与protocol / job input contract协调;只作用new unit | ECW-02 / 05;DTO变化先ELS-07 | global ceiling / registry、old result immutability、idempotency和scope | global override、in-flight mutation、clamp或修改old receipt / report |
| S06 deterministic fixture | 只随P01~04 test contract演进 | ECW-02 / 05 | fake / durable parity、fixed clock / id、failure injection与P05+排除 | 进入P05~07、host / real fallback或证明backend qualification |
| S07 remote config center | 当前不能从unsupported直接“迁移启用” | ELS-07 / ECW-07 | 先回`03`;source priority、snapshot、consistency、audit、rollback、failure全闭合 | endpoint key一加即启用、local fallback或把unreachable写current failure |
| S08 admin / emergency override | 当前不能以break-glass legacy方式引入 | ELS-07 / ECW-07 | 先回`03`;authorization、scope、review、audit、conflict、expiry语义 | hard guard bypass、silent override、observed反写desired |

S02 / S03在兼容期仍遵守高层present-invalid不fallback。若old / new env mapping同时present,默认semantic duplicate reject;不得通过priority悄悄选一个。

### 9.11 PROFILE-01~07演进与资格矩阵

| Profile | 允许的当前演进方向 | 主EVC / ECW | 必须重新闭合 | 禁止升级捷径 |
|---|---|---|---|---|
| PROFILE-01 `local-contract` | schema / loader / builder contract在non-executing前提下演进 | EVC-01~10 / ECW-02~05 | P01 source / fixture、no-real-launch、safe diagnostics和SW/CFG矩阵 | 把local启动写成backend / deployment compatibility |
| PROFILE-02 `ci-contract` | deterministic negative matrix、fake parity、fixture schema演进 | EVC-04~10/16/17 / ECW-02~05 | fixed clock / id、transaction / replay / redaction parity、S06 isolation | CI pass传递为P05 conformance或真实material资格 |
| PROFILE-03 `integration-seam` | resolver / event / handoff / sink接缝与binding contract演进 | EVC-11~14/16/17 / ECW-05/06 | route / target closed map、controlled outcome、no sibling dependency和no real launch | seam通过证明四维boundary、产品capacity或P05资格 |
| PROFILE-04 `operations-simulation` | lease / cleanup / redline / retry / rollback状态simulation演进 | EVC-12~17 / ECW-02/05/06 | simulated handle / report、no core truth repair、no real release / delete | simulation通过证明真实cleanup、reaper、provider或rollout ready |
| PROFILE-05 `backend-conformance` | candidate backend / boundary / capture / release产品中立binding和资格演进 | EVC-12~17 / ECW-05/06 | dedicated environment、四维boundary、S04、anti-leak、no-host/fake、conformance evidence | 用P01~04结果、单次smoke或old candidate资格自动传递 |
| PROFILE-06 `staging-like` | durable / bus / resolver / handoff / scheduler / telemetry完整组合演进 | EVC-11~17 / ECW-05/06 | P05前置、real-like完整binding、rollout / rollback / alert / continuity和全部迁移evidence | 缺binding时fallback、partial generation或从P05自动promotion |
| PROFILE-07 `production-like` | 只保留future inactive target;任何current activation均需正式重开 | EVC-12/19/20;当前ELS-07 / ECW-07 | `03/04/05/06/07/09`、security / capacity / continuity / acceptance全链 | 配置selector、设计表、P06通过或ops approval直接启用 |

Profile新增 /重命名 /删除规则:

- 新profile不是给现有I001增加一个enum文本即可;必须同时定义ENV、source、adapter mode、workload、sensitive、D01~D44差异、activation、failure、下游资格和software compatibility。
- Profile canonical serialized value若未来真实发布后重命名,按EVC-07 / ECW-04处理;当前不接受旧`dev/test/staging/prod` alias。
- 降低profile资格前置或把real profile改为接受fake / host属于EVC-18,立即reject,不提供deprecation窗口。
- Profile停用先禁止new desired / activation,再证明所有scope无active generation / pending rollout / rollback依赖;历史profile ID和evidence仍保留。
- PROFILE-07未来激活是设计范围扩展,不是从PROFILE-06做配置迁移;必须先从ELS-07重新进入ELS-01设计状态。

### 9.12 Sensitive Ref、Descriptor、Material与Lease演进

#### 9.12.1 五层演进分离

| 层级 | 当前载体 | 变化类别 | 兼容 /回退规则 | 禁止混写 |
|---|---|---|---|---|
| ordinary canonical item | I013等40个sensitive ref item | key / type / source变化按EVC-05~10 | closed schema + candidate / generation窗口 | 把raw material或provider endpoint加入JSON / env |
| selected opaque ref | 38个sensitive ref项中的validated value | EVC-14 + CCT-15 | old / new ref各自family / registry / capability qualification;prior仅在仍valid时可重建 | string相同即语义相同、substring猜family、full ref输出 |
| registry descriptor | 23个material-capable slot的`SecureMaterialSlotDescriptor` | EVC-14 + ECW-06 | predicate / class / consumer / lease policy变化视为高风险binding migration;new generation | descriptor伪装第102个key、一个ref静默换family / consumer |
| concrete material version | provider-side same-ref version | EVC-15 + CCT-16 | bounded renew / rotation;expired / revoked不得rollback;必要时terminate / restart | ordinary config TTL、material进入summary、provider body进audit |
| concrete consumer lease | adapter-local bounded lease | EVC-15 | 不跨consumer / generation无界复用;lease结束后stop-new-use / release | shared global cache、stale extension、callback能力伪造 |

#### 9.12.2 敏感分类演进责任

| 分类 | Item集合 | 演进规则 | 移除 /退出前置 |
|---|---|---|---|
| material-capable,23项 | I017~I022,I028,I031,I035,I041,I044,I049~I051,I055~I060,I071,I086,I087 | ref / descriptor变化走EVC-14,active slot调用S04,same-ref version走EVC-15;provider产品不进入schema | 无active / renewable lease、new binding qualified、provider audit / anti-leak证据、rollback不依赖old binding |
| reference-only,15项 | I013,I033,I036,I039,I040,I046,I053,I061,I065,I069,I072,I083,I091,I092,I094 | 不调用S04;仍按family / registry / marker / profile和EVC-14迁移;不得因`sensitive`标签生成material slot | new ref / profile已完整验证,old ref使用为零,history只保留safe marker |
| test-only,2项 | I098,I101 | 只在P01~04及FZ-06演进;P05~07出现即reject | fixture / scenario迁移不影响真实profile,old report / case history不改写 |
| internal sensitive semantics,2项 | I033 / I046等属于上表reference-only,不是额外item | policy / material class ref变化仍不得暴露正文或改变truth ownership | 使用所属item门禁,不重复计数 |
| raw secret / credential material | 0个ordinary config item | 永远不进入I001~I101;只在S04 adapter-private boundary | 不存在deprecated-success窗口;任一ordinary source出现即ECW-07 reject |

40 sensitive item集合保持Step 8原分类,本Step不新增或重分类任何item。未来若item从reference-only变material-capable,必须重开Step 7 / 8 / 9 / 10 / 11 / 12;若需要新public secret port、callback或summary字段则先回写`03`。

Sensitive migration的safe record只允许item ID、binding / material class、old/new不可枚举marker、profile、provider outcome class、generation / lease disposition和safe reason ref。禁止full ref、provider path、material version原文、raw SDK / HTTP / stack / process body。

### 9.13 按40配置组组织的演进审计

| 配置组 / Item | 主演进类别 /窗口 | 兼容与rollback闭口 | 不可演进边界 /重开条件 |
|---|---|---|---|
| `configIdentity` I001 | EVC-04/07/12;ECW-04/05 | profile serialized value、selector和candidate identity同步;old / new profile artifact不可alias猜测;rollback重新资格 | `dev/test/staging/prod` alias禁止;profile carrier变化先回`03` |
| `entryEnvelope` I002~I006 | EVC-02~05/09;ECW-02/03/05 | bytes/page/timeout/mode按方向验证;new software必须接受old artifact;S05只影响new entry | 不得clamp、扩大global ceiling或新增raw / verbose mode |
| `workerEnvelope` I007~I009 | EVC-02/03/05/09;ECW-02/03/05 | old / new loop只消费各自frozen snapshot;batch / parallelism / timeout方向和receipt行为验证 | 不在loop中途切换;DTO / worker flow变化先回`03` |
| `jobEnvelope` I010~I013 | EVC-02~05/14/16;ECW-02/03/05/06 | new job snapshot、retry ref family和stored report replay闭口;old report immutable | 不换idempotency key、不修改old report、不把retry ref展开成raw policy |
| `featureAssembly` I014~I016 | EVC-04/13;ECW-05 | feature enablement与store / publisher / route / query / job完整composition一起切;rollback用prior complete composition | 不partial toggle、silent disable、改变truth / no-repair语义 |
| `truthStore` I017 | EVC-14/15;ECW-06 | old / new store均需UoW + audit + material资格;new generation;prior仅在valid时重建 | 无memory / fake fallback;store migration不改accepted truth |
| `projectionStore` I018 | EVC-14/15;ECW-06 | old / new projection adapter与read / rebuild兼容;runtime unavailable只允许read degraded | 不复用truth store或让query写修复 |
| `derivedStore` I019 | EVC-13~15;ECW-05/06 | 与I015 / I016及derived / reconciliation surface一起qualification;new generation | 不成为policy / core truth或fallback truth store |
| `referenceStore` I020 | EVC-14/15;ECW-06 | body-free store / resolver / refresh能力、old / new ref和material完整验证 | 不保存external body、不猜reference truth |
| `relayStore` I021 | EVC-13~15;ECW-05/06 | publisher enabled关系、stored payload snapshot和old relay facts保持;new store migration不重建payload | publish failure不回滚source,不得从current truth重算 |
| `replayStore` I022 | EVC-14~16;ECW-05/06 | idempotency / stored result / receipt / report parity与retention联合迁移 | duplicate不得重算、completed不得失去stored result |
| `replayLifecycle` I023~I027 | EVC-03/16;ECW-02/05 | retention关系、existing record覆盖和software rollback验证;缩短高风险 | 不retroactive删除、隐式TTL或绕过replay |
| `contextSource` I028~I030 | EVC-03/14/15;ECW-02/06 | old / new adapter、freshness / timeout、body-free summary和command / consumer / query处分面 | 不造identity / work / runtime truth,无raw sibling fallback |
| `policySource` I031~I034 | EVC-03/14/15/18;ECW-02/06/07 | old / new source与material分别qualification;missing / stale / conflict持续fail-closed | 不本地定义policy / allowlist / approval或default allow |
| `backendCapability` I035~I038 | EVC-03/12/14/15;ECW-05/06 | backend registry、freshness、probe、profile / boundary兼容和candidate evidence | 不猜support、不fallback host / fake或弱backend |
| `boundaryEnforcement` I039~I040 | EVC-12/14/17/18;ECW-05/06/07 | boundary / template ref迁移必须四维整体qualification,prior也重新验证 | 不partial dimension、best-effort或配置化弱化 |
| `isolationBackend` I041~I043 | EVC-03/12/14/15;ECW-05/06 | backend / adapter / timeout、inspect / release compatibility和profile独立证据 | P01~04不real launch,P05+不host / fake fallback |
| `executionCapture` I044~I048 | EVC-03/13~15/17;ECW-05/06 | capture adapter / class / timeout / handoff / redaction完整迁移;old capture truth保持 | 不把process output写truth / log或用capture失败伪run成功 |
| `inboundEvents` I049 | EVC-04/08/13~15;ECW-05/06 | exact9-key map、schema / source / quarantine / dedup与consumer loop兼容;old receipt保留 | 不改协议schema / authority、猜payload或consumer造core success |
| `eventPublisher` I050 | EVC-13~15;ECW-05/06 | feature、publisher、relay store、route、material、availability联合切换;relay facts保留 | publish failure no rollback,不得重定义event schema |
| `eventRoutes` I051 | EVC-04/08/13~15;ECW-05/06 | exact13-key map和全部active event coverage;old / new route scope与stored payload兼容 | 不拼raw topic、partial route或改变protocol kind |
| `eventRelay` I052~I054 | EVC-03/14/16;ECW-02/05/06 | new loop / job参数、retry ref、publisher / route / store联合;old relay record immutable | 不重建payload、删dead-letter或回滚source truth |
| `materialHandoff` I055~I056 | EVC-08/13~15;ECW-05/06 | adapter / target / material class和nonempty enablement整体qualification;new job只选registry子集 | receipt不升格artifact truth、failure不回滚capture |
| `observabilityHandoff` I057~I058 | EVC-08/13~15/17;ECW-05/06 | I048 / adapter / target / redaction一致;formal audit独立 | 不把handoff当audit或保存observability body |
| `investigationHandoff` I059~I060 | EVC-08/13~15/18;ECW-05/06/07 | I074 / adapter / approved target与containment guard一起迁移 | receipt不得解除containment / cleanup guard |
| `handoffDelivery` I061~I064 | EVC-03/14/16;ECW-02/05/06 | retry / retention / timeout / batch和target registry闭合;old fact / report immutable | 不切target重算、回滚capture或修改old result |
| `leaseSafety` I065~I067 | EVC-03/14~16/18;ECW-05/06/07 | lease / cadence / batch与backend handle兼容;expiry后inspect / stop-new-use | 不expiry auto-release、default duration猜测或force action |
| `cleanupSafety` I068~I070 | EVC-03/14/16~18;ECW-05/06/07 | cadence / strict guard / batch迁移保持evidence / investigation / redline前置 | 不force-clean、missing default allow或删除blocked history |
| `backendRelease` I071~I073 | EVC-03/14~16/18;ECW-05/06/07 | optional adapter / reuse capability / retry / timeout和prior backend资格 | failure不伪Released,无weak fallback或orphan消失 |
| `redlineSafety` I074~I075 | EVC-13/16~18;ECW-05/06/07 | external handoff可演进,containment always active;cadence和target完整 | 不advisory-only、auto-release或用migration清除containment |
| `referenceRefresh` I076~I078 | EVC-03/14/16;ECW-02/05/06 | threshold / batch / cadence和body-free source兼容;new job / report | 不写external truth或由query触发write |
| `projectionMaintenance` I079~I081 | EVC-03/16;ECW-02/05 | threshold / batch / cadence与store / index兼容;old report保持 | query no-write、job不修core truth |
| `derivedMaintenance` I082~I084 | EVC-03/13/14/16;ECW-02/05/06 | feature / store / comparison scope / cadence联合;new job | 不promotion为policy / truth或修改old report |
| `reconciliationMaintenance` I085 | EVC-13/16;ECW-05 | I016 / derived store / query / job / report / optional route完整迁移 | finding不auto-fix或升格accepted fact |
| `runtimeTelemetry` I086~I090 | EVC-04/14/15/17/18;ECW-02/05/06/07 | sink / level / sampling / labels与safe local fallback、formal audit独立验证 | 不trace raw、high-cardinality label或sink failure削弱audit |
| `auditTrace` I091 | EVC-14/17/18;ECW-05/06/07 | route与truth store same-UoW、old / new audit可用性和safe fields | 不disable、async-loss或用provider audit替代business audit |
| `diagnostics` I092~I093 | EVC-03/14/17/18;ECW-02/05/06/07 | surface / retention与safe / quiet、store前signal和all-carrier redaction兼容 | 不raw / verbose body或新增public surface而不回`03` |
| `safeOutput` I094~I095 | EVC-04/14/17/18;ECW-02/05/06/07 | profile / deny list只可equal-or-stricter;reader与all-carrier scan闭合 | 不删除17-class floor、debug relax或输出matched value |
| `deterministicAdapters` I096~I097 | EVC-04/12/14;ECW-02/05/06 | clock / id ref与fixture pair、formal ID family和fake parity | P05+ fixture override、wall clock偷读或random string替代 |
| `testFixtures` I098~I101 | EVC-04~10/14;ECW-02/05/06 | fixture set / instant / seed / scenario与P02 / P04资格和case isolation | 不进入P05~07、host / real fallback或声称real evidence |

本表40行必须与Step 7 / 9 / 10 / 11 / 12同名同序,Item集合恰好覆盖I001~I101。任一组变化仍需逐item评估,不得以组级分类覆盖字段级type / default / source / scope差异。

### 9.14 D01~D44配置域演进责任审计

| Domain | 演进 /迁移主语 | 必须保持 | `03`重开条件 | 审计结论 |
|---|---|---|---|---|
| D01 config source intake | source selector、S02 artifact、S03 allowlist、future old/new key intake | single source、strict parse、present-invalid no-fallback | 新source、multi-source、remote / reload / negotiation | covered;S07/S08当前reject |
| D02 runtime profile / identity | profile selector、canonical config semantics / marker | body-free identity、profile exact、instance不反推desired | identity / summary新增public version或字段 | covered;marker非schema version |
| D03 startup validation | validator rules、issue taxonomy、deprecated / removed disposition | blocked发布0 handle、safe issue、无silent warning bypass | 新public error / status / query surface | covered;future warning先设计carrier |
| D04 runtime builder / registry | registry / adapter / store set和generation compatibility | same-generation complete set、raw config不下沉 | builder port / runtime state / hot swap变化 | covered;new generation only |
| D05 sync API envelope | ceiling / timeout / diagnostics和S05 field compatibility | request只收窄、query no-write、old committed truth不变 | DTO / protocol metadata / public error变化 | covered;new entry snapshot |
| D06 worker envelope | loop参数 / binding和consumer software compatibility | loop frozen、delayed / quarantine诚实、receipt immutable | loop protocol / state / callback变化 | covered;no in-loop migration |
| D07 job envelope | job参数、retry ref、retention和report schema compatibility | new job unit、idempotency / stored report replay | job DTO / report / idempotency contract变化 | covered;old report immutable |
| D08 feature assembly | feature bool、dependencies、registration和route coverage | complete composition、disabled不删truth | 新service / command / event / state surface | covered;no partial toggle |
| D09 truth / audit / UoW store | store binding / product迁移和data compatibility | same-UoW audit、accepted truth不重写、no memory fallback | repository / transaction / schema保存面变化 | covered;store migration not truth migration |
| D10 projection / derived store | adapter / index / rebuild兼容 | read degraded only、query no-write、no truth fallback | projection / derived repository contract变化 | covered;rebuild不是core migration |
| D11 reference store | body-free reference storage / resolver compatibility | external body不入仓、missing不猜truth | reference object / repository / version carrier变化 | covered;new binding qualification |
| D12 relay store | relay record / stored payload store迁移 | source truth no-rollback、payload不重建 | relay record / repository / payload snapshot变化 | covered;history retained |
| D13 replay / stored surface | replay store、retention、record / result compatibility | duplicate不重算、completed result保持 | idempotency / stored result schema / repository变化 | covered;cross-version replay tested |
| D14 context source | adapter、freshness、timeout和summary shape compatibility | body-free、role-specific failure、no sibling truth | context port / summary DTO / state变化 | covered;no local truth synthesis |
| D15 policy source | adapter、profile、freshness和material compatibility | missing / stale / conflict fail-closed | policy port / decision / summary schema变化 | covered;no local policy migration |
| D16 backend capability | adapter / backend registry、probe与capability summary | no guessed support、profile资格独立 | capability object / port / state / event变化 | covered;candidate requalification |
| D17 coherent boundary | boundary / limit template和四维能力演进 | resource / filesystem / network / process整体成立 | requirement / decision / boundary object或flow变化 | covered;partial is reject |
| D18 backend lifecycle | backend / launch / inspect adapter和timeout | no host / fake fallback、formal outcome | launch / inspect / lifecycle port / state变化 | covered;software + backend matrix |
| D19 execution capture | capture adapter / class / timeout / handoff compatibility | typed ref / digest / status only、failure不伪run success | capture fact / adapter port / protocol变化 | covered;body-free invariant |
| D20 backend handle / lease | handle capability、lease / revoke和generation relation | stop-new-use、guarded lifecycle、no force release | callback / termination / handle state / port变化 | covered;immediate callback is reopen |
| D21 inbound subscription | exact map、source/schema/dedup/quarantine和loop compatibility | consumer不造core success、payload不猜 | event envelope / receipt / consumer flow变化 | covered;config不能改protocol schema |
| D22 publisher | publisher binding / material / availability和feature relation | event schema不变、failure no rollback | publisher port / outbound DTO / event kind变化 | covered;binding only |
| D23 route binding | topic-neutral closed map与transport migration | route不改protocol、active keys完整 | protocol key / event registry变化 | covered;no raw topic synthesis |
| D24 relay delivery | batch / retry / timeout和publisher product migration | stored payload、old relay fact、dead-letter history | relay flow / report / state变化 | covered;new run only |
| D25 material handoff | adapter / target / class和receipt compatibility | capture truth保持、receipt不升格artifact truth | handoff port / fact / receipt DTO变化 | covered;downstream truth separate |
| D26 observability handoff | adapter / target / redaction和formal audit relation | handoff不替代audit、body不入sandbox | handoff protocol / observability contract变化 | covered;target requalification |
| D27 investigation handoff | target / adapter和containment relation | receipt不解除guard、contained状态保持 | investigation port / control flow / state变化 | covered;guard first |
| D28 handoff retry | retry / retention / batch和target compatibility | old fact / report immutable、no capture rollback | retry job / handoff report contract变化 | covered;new job unit |
| D29 lease / orphan | lease profile、cadence、inspection和orphan records | expiry inspect-only、uncertain remains blocked | lease / orphan state / repository / lifecycle flow变化 | covered;no auto-delete |
| D30 cleanup guard | cadence / strict guard / batch和evidence dependencies | missing default blocked、no force-clean | cleanup guard object / transition / evidence input变化 | covered;safety no compatibility allow |
| D31 backend release | adapter / capability / retry / timeout和orphan compatibility | guard first、failure不伪Released | release port / handle state / flow变化 | covered;no weak fallback |
| D32 redline | target / cadence / handoff和containment lifecycle | containment always active、no advisory / auto-release | redline state / control / handoff flow变化 | covered;ECW-07 for weakening |
| D33 reference refresh | freshness / batch / cadence和source compatibility | body-free update、partial report、no core truth write | reference refresh port / report / state变化 | covered;new job only |
| D34 projection rebuild | threshold / batch / cadence和index compatibility | query no-write、rebuild不repair truth | projection repository / rebuild flow变化 | covered;old report retained |
| D35 derived view | feature / store / scope / cadence compatibility | derived不成truth / policy、read degraded bounded | derived object / query / job / event变化 | covered;complete composition |
| D36 reconciliation | feature / store / cadence / optional route compatibility | finding only、no auto-fix / truth promotion | reconciliation query / job / report / event变化 | covered;no repair switch |
| D37 runtime log / metric | sink / level / sampling / labels与reader compatibility | low-cardinality、safe local signal、audit独立 | public observability DTO / hook contract变化 | covered;unsafe labels ECW-07 |
| D38 audit / trace | route / store binding和safe schema compatibility | mandatory same-UoW audit、provider audit分层 | audit object / kind / repository / transaction变化 | covered;cannot deprecate guard |
| D39 diagnostic issue | mode / surface / retention和deprecated issue carrier | safe / quiet redacted、store前signal诚实 | public diagnostic / error / query carrier变化 | covered;current deprecated warning absent |
| D40 redaction gate | profile / deny floor / all-carrier reader compatibility | 17-class floor only equal-or-stricter | redaction carrier / public output contract变化 | covered;weakening reject-only |
| D41 profile composition | exact profile、source / S04 / S06 / adapter eligibility | qualification不可传递、no implicit capability | public profile enum / runtime state变化 | covered;P07 remains inactive |
| D42 deterministic fixture | fixture / clock / id / state / scenario compatibility | P01~04 only、fake parity、no host / real fallback | test port / object contract变化 | covered;not real evidence |
| D43 real-like composition | P05 / P06 / P07 full binding和software/product matrix | no fake / host fallback、product / evidence缺失即unqualified | real runtime carrier / lifecycle / product-specific public contract | covered;P07 design reopen |
| D44 overlay / reload trigger | remote / admin / reload / LKG / hot / schema negotiation | current no key / no source / reject | 任一能力要求都先回`03`并重开`04` | covered;ELS-07 / ECW-07 |

本表名称与顺序必须与Step 9 D01~D44一致。它只定义future evolution responsibility,不声明任何software、adapter、migration、qualification或evidence已存在。

### 9.15 Future Evolution Queue与重新打开条件

| FEQ ID /候选 | 当前状态 | 进入条件 | 必须先重开 | 当前禁止声明 |
|---|---|---|---|---|
| FEQ-01 first published config baseline | planned_after_formal_chain | 正式`04~07`完成、目标仓确认、首个software / candidate真实实现并有固定验证事实 | 当前Step 15、后续`05/06/07` | 已有v1、发布日期、consumer或兼容窗口 |
| FEQ-02 PROFILE-05 backend conformance activation | conditional_unqualified | backend / environment / S04 / anti-leak /四维suite / evidence / acceptance闭合 | Step 6 / 8 / 12和正式`05/06/07/09` | 已qualified或可由fake / seam迁移 |
| FEQ-03 PROFILE-06 staging-like activation | conditional_unqualified | FEQ-02 + durable / bus / resolver / handoff / scheduler / telemetry / rollout全链 | Step 6~13和`05/06/07/09` | release-ready、zero-downtime或产品已选 |
| FEQ-04 PROFILE-07 production-like | inactive_design_target | 生产范围、security / capacity / continuity / products / evidence / sign-off成为正式需求 | 先正式`00~03`,再`04` Step 3~13 | 当前可激活 /测试ready /验收 |
| FEQ-05 provider / principal / native audit product | open_for_p05_activation | 产品选型、安全模型、anti-leak和adapter-private实现边界批准 | Step 8 / 9 / 10 / 11 / 12;port变化先`03` | endpoint / credential /产品已确定 |
| FEQ-06 backend / store / bus / target product rebinding | open_for_p05_p06 | 产品能力与contract parity、迁移 / rollback / continuity和profile资格定义 | Step 6~13;public contract变化先`03` | product swap天然兼容或no-data migration |
| FEQ-07 remote config center S07 | unsupported_future | 正式需求、source consistency、auth、audit、rollout、rollback、failure和availability模型 | `03` Step 6~15 + `04` Step 3~13 | endpoint key即可启用、local fallback或current outage场景 |
| FEQ-08 admin / emergency override S08 | unsupported_future | 正式authorization、review、scope、conflict、audit、expiry / revoke模型 | `03` Step 6~15 + `04` Step 3~13 | break-glass可放宽hard guard |
| FEQ-09 runtime reload / hot swap | unsupported_future | in-flight consistency、generation handoff、partial failure、adapter lifecycle和rollback状态正式定义 | `03` object / port / flow / state / concurrency / audit + `04` Step 4~13 | old process = LKG、partial handle或in-place mutation |
| FEQ-10 online LKG | unsupported_future | approved candidate store、selection authority、compatibility、audit、desired / observed和failure语义 | 同FEQ-09,并重开Step 10 / 11 | 任意old config / process自动成为LKG |
| FEQ-11 runtime schema negotiation / multi-parser | unsupported_future | exact schema-version carrier、supported set、selection / downgrade / unknown规则和安全审计 | `03` carrier / DTO / error / flow + Step 5 / 7 / 9~13 | marker / config_ref / protocol schema_version可复用 |
| FEQ-12 immediate revoke callback / adapter hot-stop | unsupported_future | callback port、consumer registry、termination / restart、race / idempotency和observability正式定义 | `03` Step 7~15 + `04` Step 8~13 | 当前已即时push revoke |
| FEQ-13 ordinary config TTL / expiry | unsupported_future | source freshness authority、marker、expiry / grace、audit、rollback和running-generation行为定义 | `03` runtime state / flow if needed + Step 5 / 7 / 9~13 | artifact retention或deprecated window自动产生TTL |
| FEQ-14 public migration / status API | unsupported_future | authorization、DTO、query no-write、repository / audit / idempotency和truth owner正式定义 | `03` Step 5~15 + Step 10~13 | ops-private record等于public API |

FEQ只记录触发器,不构成roadmap承诺、实现范围或产品决策。任何FEQ进入实施前必须重新执行EIP-01~14,不能直接从本表创建`07` boundary。

### 9.16 迁移验证、验收、实施与运维承接

#### 9.16.1 Planned Migration Evidence Requirement

`MER-xx`表示Migration Evidence Requirement,只定义未来必须证明的命题。它不是`EV-*` alias、run_id、artifact ID、测试结果、验收签署或release approval。

| MER ID /未来证明命题 | `05`未来producer方向 | `06`消费门禁 | `07`实施承接 | `09`运行承接 | 当前事实 |
|---|---|---|---|---|---|
| MER-01 baseline provenance | baseline inventory / static check | 旧材料未被误作published schema | precheck固定design / software / candidate来源 | 建立真实baseline / support inventory | planned_only;当前无published baseline |
| MER-02 stable ID / canonical key | schema catalog / parser contract suite | old ID不复用,new ID唯一,canonical闭集 | schema / registry owner boundary | release note / inventory保持replacement relation | planned_only |
| MER-03 old / new / both / absent parser | strict parser matrix | 每种输入唯一disposition,both无silent precedence | parser / validator boundary | artifact preflight与safe diagnostic | planned_only;当前无dual-read |
| MER-04 software-config compatibility | SW/CFG四象限 + mixed fleet matrix | required组合全部通过或明确blocked | software / candidate gate与scope拆分 | software floor / desired artifact inventory | planned_only |
| MER-05 default / range / enum semantics | item boundary / behavior suite | absence / explicit、direction和unsupported branch不漂移 | typed schema / validator boundary | rollout前兼容检查 | planned_only |
| MER-06 source / priority migration | S01~S08 / S03 mapping matrix | winner、present-invalid、old/new env和unsupported source成立 | loader / allowlist / provenance boundary | artifact / env注入迁移与drift巡检 | planned_only |
| MER-07 profile evolution qualification | PROFILE-01~07独立suite | 资格不传递,P05+前置和P07 inactive成立 | profile composition / qualification assets | promotion / deactivation packet | planned_only |
| MER-08 sensitive key / ref / descriptor | ref / registry / redaction contract | family / class / consumer / no-output和no raw migration成立 | S04 registry / adapter construction boundary | provider binding / principal / audit inventory | planned_only;provider未选 |
| MER-09 material rotation / lease | provider-neutral lifecycle + future product qualification | renew / expiry / revoke / release / stop-new-use无stale fallback | adapter-local lease / safe hook boundary | rotation / termination / forward-fix runbook | planned_only;无真实provider result |
| MER-10 complete generation / cutover | builder / publication / mixed identity suite | publish 0或完整,无partial / hot / old-process伪success | generation / atomic publication boundary | desired / observed / rollout scope检查 | planned_only |
| MER-11 rollback compatibility | prior candidate + current software / registry / material drill | incompatible prior可诚实失败,不绕current validator | rollback gate / compatibility asset boundary | candidate retention / retrieval / failure runbook | planned_only;无drill结果 |
| MER-12 drift / fleet observation | scope / marker / active relation matrix | missing observation不aligned,failed rollout不掩盖drift | ops-private observation integration | fleet observation / investigation / closure | planned_only;carrier未选 |
| MER-13 stored truth / replay continuity | transaction / replay / relay / handoff / report compatibility suite | migration不重写accepted truth / stored result / old receipt / report | repository / adapter parity boundaries | retention / backup / continuity / incident handling | planned_only |
| MER-14 deprecated diagnostic safety | log / metric / audit / report all-carrier scan | warning / rejection safe且不泄露value / full ref;metric低基数 | diagnostic / redaction boundary | warning routing / inventory without raw config | planned_only;当前无deprecated warning carrier |
| MER-15 artifact zero-use / removal | fixed artifact / env / registry scan | declared scope old usage为零,不使用`latest`或抽样猜测 | scanner / report asset boundary | owner inventory与support floor | planned_only |
| MER-16 removed-input negative | old key / ref / profile / source reject suite | ELS-04 / 05 disposition稳定,无fallback / alias | parser cleanup + regression boundary | rollback / incident文档不依赖removed input | planned_only |
| MER-17 downstream closure | traceability check for `04/05/06/07/09` | required evidence绑定、风险与裁决完整 | boundary gates / ledger同步 | runbook / release record同步 | planned_only |
| MER-18 security redline non-regression | NCFG / boundary / policy / cleanup / redline / redaction negative suite | EVC-18始终ECW-07 reject,无风险接受绕过 | hard-guard regression boundary | emergency / rollback动作不放宽guard | planned_only |
| MER-19 dependency / product neutrality | Cargo graph + adapter replacement contract | no sibling compile dependency,产品替换不改协议 / truth | workspace / adapter boundary | product binding inventory与qualification | planned_only |
| MER-20 history / evidence retention | historical ID / mapping / change / evidence index checks | removal后仍可追溯且无raw / secret history | metadata / report boundary | retention / access / export policy | planned_only |

MER与Step 12的现有handoff关系:

| MER集合 | 主要TSH | 主要AHG / EHR | 说明 |
|---|---|---|---|
| MER-01~06 | TSH-01~06/09/12~14/20 | AHG-01~05/10~12/17/18;EHR-01~06/11~13/18/19 | schema / source / compatibility必须回到现有strict parser与change contract |
| MER-07 | TSH-04/19/20 | AHG-03/17/19;EHR-04/18/20 | profile资格不从设计或fake传递 |
| MER-08~09 | TSH-07/08/12/17/18 | AHG-06/07/10/15/16/19;EHR-07/08/11/16/17/20 | sensitive migration与material lifecycle分层 |
| MER-10~12 | TSH-10/12~14/17 | AHG-08/10~12/15;EHR-09/11~13/16 | generation / rollback / drift保持诚实状态 |
| MER-13 | TSH-06/10/15~17/19 | AHG-05/08/13~15/17;EHR-06/09/14~16/18 | truth / replay / relay / report不被迁移重写 |
| MER-14~16 | TSH-01~03/07/18 | AHG-01/02/06/16/18;EHR-01~03/07/17/19 | deprecated / removed input必须safe且可判 |
| MER-17~20 | TSH-05/18~20 | AHG-04/16~19;EHR-05/17~20 | downstream、redline、dependency和history门禁 |

#### 9.16.2 下游责任表

| 下游 | 必须承接 | 本Step提供 | 本Step不提供 | 完成前阻塞条件 |
|---|---|---|---|---|
| `05-测试方案.md` | 为适用EVC / ECW / DSG / ERG和MER设计environment、fixture、前置、步骤、formal state / error / side-effect断言和evidence schema | 20个MER、software / config matrix、40组 / 44域和existing TSH映射 | 真实TC编号、脚本路径、run_id、结果或产品fixture | 正式`04`未完成;未来具体migration proposal未定义时只能保留通用suite |
| `06-验收标准.md` | 为baseline、compatibility、profile、rollback、zero-use、removed negative和redline设gate / veto及fixed evidence绑定 | MER到AHG / EHR映射、ERG-01~10、ECW退出条件 | 正式AC / VF / VETO编号、alias、签署、risk acceptance | 无真实evidence不得pass;EVC-18不得普通风险接受 |
| `07-实施计划.md` | 把批准的schema / loader / validator / adapter / scanner / compatibility assets拆为依赖闭合boundary | EIP-01~14、EVC / ECW、MER、affected item / domain与重开条件 | 当前phase / commit boundary、baseline hash、commit或ledger文件 | 只有具体migration正式设计 /测试 /验收闭合后才可规划;正式`07`完成时同步ledger / skeleton |
| `09-部署与运维手册.md` | 固定software floor、artifact inventory、scope cutover、provider rotation、observation、rollback、zero-use和history retention操作 | ECW / ERG / FEQ、MER运行责任和hard-guard边界 | 当前路径、命令、产品、版本、阈值、日期、pager或runbook | implementation / product / evidence / acceptance事实未形成时不得声称可执行 |

下游不得把MER写成generated / accepted evidence。未来每个真实migration proposal必须给MER分配fixed evidence identity,但只能在正式`05/06` schema和真实执行形成后完成。

### 9.17 Historical Material后置差异审计

| Historical material | 缺少的迁移资格 | 当前结论 | 禁止生成的mapping |
|---|---|---|---|
| README中的Docker / gVisor / seccomp / AppArmor线索 | 无canonical key、type、source、parser、release、consumer或support window | historical technology direction only | 不映射到backend / boundary / profile ref或声称legacy product binding |
| README /旧`05`的default no-egress等安全文字 | 无当前policy / boundary owner与配置项身份 | 不作为旧config;当前四维boundary由typed requirement / summary整体决定 | 不创建`networkDisabled`等旧key或把no-egress硬编码迁移成current truth |
| 旧`05`的dev / test / staging矩阵 | 无PROFILE stable ID、source、qualification、software / artifact baseline | historical environment vocabulary | 不作为PROFILE-01~07 alias,不建立environment rename migration |
| 旧`05`的local / real-like host runtime | 违反P01~04 non-executing和P05+ no-host fallback | rejected historical direction | 不生成host backend profile、fallback key或legacy compatibility |
| 旧`05`的cleanup disabled /调试方向 | 违反guard-first / cleanup / redline不可关闭 | EVC-18 / ECW-07类污染风险,但从未是合法published input | 不提供deprecated warning期或emergency allow |
| 旧`05/06`的allowlist / policy本地语义 | truth不归sandbox,无合法schema owner | historical boundary conflict | 不迁移成policy DSL、allowlist key或local approval config |
| 旧`05` TC-001~TC-012 /报告描述 | 无当前schema、run_id、fixed evidence identity或执行事实 | historical test material | 不当作MER evidence、old usage或migration pass |
| 旧`06`空checkbox /待评审结论 | 无签署、alias、裁决和当前baseline | not accepted / not evidence | 不证明旧配置已验收、已部署或必须兼容 |

后置审计未发现任何可升级为current migration item的旧配置。若未来发现真实外部部署或配置artifact,必须先固定来源、software / candidate / profile / scope和使用事实,登记blocker并重开本Step;不得仅凭文件名或口述补写old key。

### 9.18 Historical Material / Blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-CFG-EVOLUTION-001 | design gap | resolved_for_cfg_step_13 | Step 5~12有演进触发器,但无统一current baseline、compatibility、deprecation、removal和逐项审计 | 本文件闭合EBU / ELS / ECW / EIP / EVC / DSG / ERG / FEQ / MER、40组和44域 |
| SBX-CFG-EVOLUTION-BASELINE-001 | baseline maturity guard | contained_as_designed_initial | 正式`04`、目标实现仓、首个software / config release和资格事实均未形成 | 当前迁移表明确“无迁移项”;I001~I101仅designed_initial,不伪造v1 /日期 /consumer |
| SBX-CFG-EVOLUTION-HIST-001 | historical_material | contained | 旧README / `05/06`可能被误写成legacy schema / product / environment | §9.17后置审计为非迁移输入 |
| SBX-CFG-EVOLUTION-VERSION-001 | carrier watch | contained_by_current_baseline | 当前无config schema-version / runtime negotiation carrier;marker / ref / generation可能被误用 | §9.2 / §9.5明确禁止替代;当前不回写`03` |
| SBX-CFG-EVOLUTION-DUAL-READ-001 | future design reopen | blocker_if_requested | 当前C05 / C06 strict reject,无alias / deprecated warning / dual-parser contract | 要求rename兼容时先重开Step 5 / 7 / 9~13;需要public carrier先回写`03` |
| SBX-CFG-EVOLUTION-ROLLBACK-001 | downstream compatibility gap | open_for_05_06_07_09 | 尚无真实software baseline、prior candidate或rollback drill | 不阻塞Step 13;真实release前按MER-04/11与ERG-06闭合 |
| SBX-CFG-EVOLUTION-PROFILE-001 | P05+ activation gap | open_for_p05_p06_p07_activation | backend / provider / products / anti-leak / rollout / evidence / runbook未闭合 | 不阻塞P0或Step 13;任何P05+ migration / promotion前关闭 |
| SBX-CFG-EVOLUTION-REPO-001 | implementation precheck | open_for_07 | 目标实现仓与software baseline当前不存在 | 不阻塞Step 13;`07`首个precheck确认,不得伪造version / commit |
| SBX-CFG-EVOLUTION-FUTURE-001 | future blocker | blocker_if_requested | S07 / S08 / reload / LKG / hot / schema negotiation / callback / public migration API会越过当前`03/04` | 触发时按FEQ-07~14先回写`03`,再重开`04`对应Step |
| SBX-CFG-EVOLUTION-EVIDENCE-001 | evidence maturity guard | planned_requirement_only | MER可能被误写成真实report / pass / removal evidence | MER只定义证明命题;真实identity / result由后续正式`05/06`和执行形成 |

当前未发现阻塞Step 13完成的上游blocker。上述open项都有明确转阻塞时机;“不阻塞当前Step”不代表实现、profile资格、migration或release已准备完成。

### 9.19 配置迁移逐类停审记录

| 审查对象 | current baseline | compatibility | deprecation / removal | downstream / evidence | 结论 /修正 |
|---|---:|---:|---:|---:|---|
| 当前迁移项 | 是 | 是 | 是 | 是 | 通过;明确当前无migration item,I001~I101仅designed_initial |
| EBU-01~09 | 是 | 是 | 是 | 是 | 通过;设计 /软件 / candidate / marker / profile / descriptor / material / generation / decision不混用 |
| ELS-01~07 | 是 | 是 | 是 | 是 | 通过;active / deprecated / rejected / removed / reopen状态可判且不进入runtime enum |
| ECW-01~07 | 是 | 是 | 是 | 是 | 通过;窗口由baseline / scope /组合 / exit gate定义,无隐含TTL |
| software / config / rollback matrix | 是 | 是 | 是 | 是 | 通过;old / new / mixed fleet / software rollback组合均有默认资格和失败处置 |
| EIP-01~14 | 是 | 是 | 是 | 是 | 通过;先设计闭合再实施 /证据,不提前拆`07`boundary |
| EVC-01~20 | 是 | 是 | 是 | 是 | 通过;additive、breaking、binding、safety和future runtime能力分类完整 |
| DSG-01~10 | 是 | 是 | 是 | 是 | 通过;当前dual-read仍不适用,未来准入必须全门禁闭合 |
| ERG-01~10 | 是 | 是 | 是 | 是 | 通过;当前无可执行removal,历史truth / ID / evidence不可删除 |
| S00~S08 | 是 | 是 | 是 | 是 | 通过;source演进保持strict winner / no-fallback,S07 / S08仍unsupported |
| PROFILE-01~07 | 是 | 是 | 是 | 是 | 通过;资格不可传递,P07激活是设计重开而非config migration |
| sensitive 40项 | 是 | 是 | 是 | 是 | 通过;23 material-capable / 15 reference-only / 2 test-only与raw-secret零item分层 |
| 40配置组 / I001~I101 | 是 | 是 | 是 | 是 | 通过;同名同序逐组定义演进、rollback和reopen边界 |
| D01~D44 | 是 | 是 | 是 | 是 | 通过;同名同序逐域保持parse / activation / truth / safety边界 |
| FEQ-01~14 | 是 | 是 | 是 | 是 | 通过;只登记trigger,不成为roadmap / product / implementation事实 |
| MER-01~20 | 是 | 是 | 是 | 是 | 通过;均为planned requirement,未生成alias / run_id / result |
| historical material | 是 | 是 | 是 | 是 | 通过;旧README / `05/06`不产生legacy mapping |

### 9.20 跨迁移演进审计表

| 审计项 | 结论 | 证据 /修正 | unresolved缺口 |
|---|---|---|---|
| 是否满足SOP mandatory migration table | 是 | §9.1含旧配置 /新配置 /状态 /窗口 /策略 /移除条件 | 无 |
| 是否明确当前无迁移项 | 是 | §4 / §9.1;正式`04`与真实release均未形成 | 无 |
| 是否伪造首版schema / version / date / consumer | 否 | ELS-01 / EBU分层;未分配schema version | 无 |
| marker / config_ref / generation是否被误作schema version | 否 | §9.2 / §9.5明确禁止 | config runtime negotiation仍unsupported |
| 新optional key是否误判天然兼容 | 否 | ECW-03要求software-first,old software不得接收new key artifact | 无 |
| rename / move是否暗中启用alias | 否 | C05 / C06保持strict reject;DSG仅future准入 | dual-read若被要求需重开 |
| both-present行为是否可判 | 是 | DSG-04默认semantic duplicate reject,不按值相同放行 | 无 |
| default / type / range / enum / requiredness是否分类 | 是 | EVC-02~09与40组审计 | 无 |
| source / priority / env mapping演进是否闭合 | 是 | EVC-11 / §9.10;present-invalid no-fallback保持 | S07 / S08 future blocker |
| profile演进是否保持资格不可传递 | 是 | §9.11逐profile | P05+资格仍open downstream |
| sensitive ref / descriptor / material / lease是否分层 | 是 | §9.12五层模型与三类item集合 | provider产品 / anti-leak仍open |
| complete generation / mixed identity是否保持 | 是 | ECW / EIP / MER-10;D04 | 无 |
| prior candidate是否被假定可rollback | 否 | §9.5 / MER-11 / ERG-06;不兼容可CCS-14 | 真实drill待后续 |
| old process是否被写成LKG / success | 否 | ECW / software矩阵 / FEQ-10 | online LKG unsupported |
| migration是否会改写truth / receipt / report / relay / handoff | 否 | ERG-07 / MER-13 / §9.14 | 真实compatibility suite待`05` |
| hard guard是否获得deprecated success window | 否 | EVC-18 / ECW-07 / MER-18 | 无 |
| ordinary config是否产生隐含TTL | 否 | ECW是release gate,FEQ-13明确future reopen | 无 |
| 40组 / 101项是否全覆盖 | 是 | §9.13 | 待机械集合校验 |
| 44域是否全覆盖 | 是 | §9.14 | 待机械同名同序校验 |
| `05/06/07/09`责任是否明确 | 是 | §9.16.2 | 正式下游仍待full-restart /创建 |
| 是否伪造MER evidence / acceptance | 否 | MER均planned_only | 无 |
| implementation ledger / boundary skeleton是否提前创建 | 否 | 本Step只定义EIP,不拆boundary | 正式`07`完成时创建 |
| 是否需要当前回写`03` | 否 | 当前只定义治理 /未来trigger,不新增runtime carrier / flow | future trigger见§9.15 / §10 |

### 9.21 对下游文档的影响总表

| 下游 | 从本Step接收 | 必须继续读取 | 本Step明确不提供 |
|---|---|---|---|
| `04` Step 14 | current-no-migration、EBU / ELS / ECW、open FEQ / blocker、P05+资格、dual-read / rollback / carrier gap | Step 6 / 8 / 10 / 11 / 12及本文件§9.18 / §12 | 风险优先级最终裁决、待确认方和Step 15准入结论 |
| `04` Step 15 | mandatory migration table、演进协议、40组 / 44域审计、historical exclusion和`03`影响 | 已确认Step 1~14 | 正式文档当前版本 /发布事实或未来migration执行结果 |
| `05-测试方案.md` | MER-01~20、EVC / ECW / DSG / ERG、software matrix和existing TSH映射 | 正式`00~04`、测试SOP /规范、正式`03` | 真实TC / EV、run_id、case result或script path |
| `06-验收标准.md` | MER到AHG / EHR映射、ERG、hard veto与exit gate | 正式`00~05`、验收SOP /规范、真实fixed evidence | 正式AC / VF / VETO、签署、risk acceptance或release approval |
| `07-实施计划.md` | EIP-01~14、affected item / domain、reopen条件、migration asset / gate义务 | 正式`00~06`、实施SOP /规范、代码实施台账规范 | phase / commit boundary、baseline hash、commit、ledger / skeleton文件 |
| `09-部署与运维手册.md` | ECW / ERG / FEQ、software floor、artifact inventory、provider / rollout / history责任 | implemented baseline、真实产品、fixed evidence和acceptance | 路径、命令、版本、日期、阈值、pager或runbook |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 影响类型 | `03`回写位置 | 处理状态 |
|---|---:|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置baseline成熟度事实 | 不适用 | no_writeback |
| EBU / ELS / ECW / EIP / EVC / DSG / ERG / FEQ / MER为设计治理ID | 否 | 文档分类 /追溯,不进入runtime object / enum / DTO | 不适用 | no_writeback |
| 当前不新增config `schemaVersion`或runtime negotiation | 否 | 保持Step 7 /正式`03`现有carrier | 不适用 | no_writeback |
| marker / config ref / generation ref不替代schema version | 否 | 承接现有infra-private / ops-private语义 | 不适用 | no_writeback |
| future same-schema value / ref变化只复用既有candidate / generation / availability surface | 否,若不改变contract | config governance / qualification | 不适用 | future_no_writeback_if_existing_surface |
| future key新增 / default / range / requiredness / rename只改变infra-private raw schema | 否,若不改变public carrier / flow | 必须重开`04` Step 5 / 7 / 9~13 | 不适用 | future_reopen_04 |
| future ref / descriptor产品binding只实现既有infra-private S04 / adapter constructor | 否,若保持既有port与summary | 必须重开`04` Step 6~13并完成资格 | 不适用 | future_reopen_04_and_qualification |
| config warning需要新增public error / diagnostic / query / audit kind | 是 | public carrier、protocol、flow和observability变化 | `03` Step 6~9 / 12 / 15 | blocker_if_requested |
| runtime config schema version / negotiation / multi-parser | 是 | config summary / DTO / error / selection flow / audit / downgrade防护 | `03` Step 6~10 / 12~15 | blocker_if_requested |
| S07 / S08、runtime mutation / query / repository | 是 | authorization、DTO、idempotency、persistence、flow、audit | `03` Step 5~15 | blocker_if_requested |
| reload / online LKG / partial generation / hot adapter swap | 是 | runtime state、concurrency、builder、rollback、entry / worker / job consistency | `03` Step 6 / 7 / 9~15 | blocker_if_requested |
| immediate revoke callback / adapter hot-stop | 是 | callback port、consumer registry、termination / restart flow、race和observability | `03` Step 7~9 / 12~15 | blocker_if_requested |
| ordinary config TTL / expiry影响running generation | 是,若要求 | freshness authority、runtime state、failure / recovery / audit | `03` Step 6 / 9 / 10 / 12~15 | blocker_if_requested |
| public migration / compatibility status API | 是 | request / response、authorization、repository、query no-write、audit / idempotency | `03` Step 5~15 | blocker_if_requested |

本Step没有当前`待回写`项。No-writeback成立的前提是当前仍无真实migration item,所有新增ID保持文档级治理术语,并且future能力在被请求时按本表先回写`03` /重开`04`,而不是由实现或运维私下补carrier。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“当前迁移与废弃表”“演进真相单元”“生命周期”“兼容窗口”“软件 /配置 /回滚矩阵”“引入协议”“演进分类”“dual-schema /废弃 /移除门禁”“source / profile / sensitive演进”“40组 / 44域审计”“future queue”“MER与下游承接”和“跨迁移演进审计”。

正式`04-配置设计.md` §13应回填:

1. mandatory当前配置迁移与废弃表,明确“当前无迁移项”和I001~I101仅为designed initial baseline。
2. EBU-01~09演进真相单元与marker / ref / generation禁止替代schema version规则。
3. ELS-01~07生命周期和stable ID不可复用规则。
4. ECW-01~07兼容窗口、software / config / rollback矩阵和mixed fleet约束。
5. EIP-01~14新配置引入协议。
6. EVC-01~20变化分类与风险 /重开方向。
7. DSG-01~10 dual-schema准入、废弃阶段和ERG-01~10移除门禁。
8. S00~S08、PROFILE-01~07、sensitive五层与40项分类的演进规则。
9. 40配置组 / I001~I101与D01~D44逐项演进审计。
10. FEQ-01~14 future queue及触发时重开`03/04`的条件。
11. MER-01~20 planned migration evidence、TSH / AHG / EHR映射和`05/06/07/09`责任。
12. historical material、blocker、逐类停审、跨演进审计和`03`影响判定。

正式装配不得:

- 声称存在已发布v1、真实旧schema、software version、发布日期、consumer、迁移率或兼容期日期。
- 把旧README / `05/06`技术 /环境文字转换为legacy key、profile alias或产品migration。
- 新增未讨论的`schemaVersion` key、alias parser、deprecated warning DTO、migration API或runtime negotiation。
- 把`RedactedConfigMarker`、config ref、profile ref、generation ref或protocol `schema_version`当作config schema version。
- 把ECW写成ordinary config TTL,或把old process存活写成LKG / rollback / fleet aligned。
- 把EVC-18安全违规写成temporary compatibility或风险接受。
- 把MER写成真实EV alias / report / result,或给出run_id、验收、commit和implementation事实。
- 提前创建Step 14、正式`04`、implementation ledger、boundary skeleton或代码。

---

## 12. 待确认事项

| 事项 | 当前状态 | 是否阻塞Step 13 | 后续owner /处理 |
|---|---|---:|---|
| 首个published software / config baseline何时形成 | not_yet_formed | 否 | 正式`04~07`闭合并真实实现 /验证后建立;当前不分配版本 |
| 未来是否需要explicit config schema version | not_requested | 否 | 只有multi-parser / negotiation需求明确时先回写`03`,再重开Step 5 / 7 / 9~13 |
| future rename是否采用dual-read还是coordinated cutover | no_current_rename | 否 | 具体proposal选择ECW-04或05;当前C05 / C06 strict reject |
| deprecated warning是否需要public surface | not_requested | 否 | 默认优先existing infra-private safe issue;若public则先回`03` |
| software / artifact inventory carrier与owner | open_for_07_09 | 否 | 真实release前由`07/09`选择ops-private carrier;不得扩L4 public API |
| 目标实现仓与software baseline | open_for_07_precheck | 否 | `07`首个precheck确认;缺失不阻塞current design Step |
| provider / backend / store / bus / target产品兼容矩阵 | open_for_p05_p06 | 否 | 产品选择后重开Step 6~13并由`05/06/07/09`qualification |
| PROFILE-07是否进入正式生产范围 | inactive_target | 否 | Step 14继续列风险 /待确认;真正进入时先回正式`00~03` |
| S07 / S08 / reload / LKG / hot / callback未来需求 | unsupported_future | 否 | 任一被请求即转blocker,按FEQ先回写`03`并重开`04` |
| ordinary config是否需要TTL / expiry | no_current_contract | 否 | 不从retention / migration window推导;需求明确时按FEQ-13重开 |
| migration automation / scanner / report资产 | planned_only | 否 | 具体migration proposal进入`05/07`后设计和实施,当前无路径 /脚本事实 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 12 | 通过 | 本次确认只放行Step 13 |
| mandatory migration table已输出 | 通过 | §9.1列结构符合SOP /规范 |
| 当前无迁移项且无伪造baseline / version事实 | 通过 | §4 / §9.1 / §9.17;旧材料无legacy mapping |
| EBU-01~09演进真相单元连续 | 通过 | §9.2编号连续,各单元不可替代关系明确 |
| ELS-01~07生命周期连续 | 通过 | §9.3编号连续,当前仅ELS-01 designed initial |
| ECW-01~07窗口连续且无隐含TTL | 通过 | §9.4编号连续;窗口按baseline / scope / evidence定义 |
| software / config / rollback兼容矩阵闭合 | 通过 | §9.5覆盖old / new / mixed fleet / software rollback |
| EIP-01~14引入协议连续 | 通过 | §9.6编号连续,未拆implementation boundary |
| EVC-01~20变化分类连续 | 通过 | §9.7编号连续,additive / breaking / binding / safety / future capability可判 |
| DSG-01~10 dual-schema门禁连续 | 通过 | §9.8.1编号连续;当前仍strict reject |
| ERG-01~10移除门禁连续 | 通过 | §9.9编号连续;当前无可执行removal |
| S00~S08演进责任完整 | 通过 | §9.10恰好9行且顺序一致 |
| PROFILE-01~07演进责任完整 | 通过 | §9.11恰好7行且顺序一致 |
| sensitive 23 / 15 / 2分类与五层演进一致 | 通过 | §9.12三集合并集40项、无重复;raw secret仍0 ordinary item |
| 40配置组 / I001~I101完整覆盖且顺序一致 | 通过 | §9.13与Step 9同名同序;I001~I101恰好覆盖一次 |
| D01~D44完整覆盖且顺序一致 | 通过 | §9.14与Step 9同名同序 |
| FEQ-01~14 future queue连续且未伪造roadmap | 通过 | §9.15编号连续,仅trigger / reopen条件 |
| MER-01~20连续且仅planned requirement | 通过 | §9.16定义表编号连续;无EV alias / run_id / result |
| historical material未生成legacy mapping | 通过 | §9.17 |
| open blocker均有owner /转阻塞时机 | 通过 | §9.18 / §12 |
| 逐类停审和跨迁移审计无unresolved conflict | 通过 | §9.19 / §9.20;开放缺口均有owner /转阻塞时机 |
| 对`03`影响已判定 | 通过 | 当前无待回写;future triggers已登记 |
| Step 14未在本Step审查前提前创建 | 通过 | 用户确认本Step后才读取Step 14标准并创建对应中间产物;正式`04`、implementation ledger、boundary skeleton和实现类文件仍未创建 |

```text
current_document = `04-配置设计.md`
current_step = Step 13 `定义配置迁移、废弃与演进`
gate_status = passed_to_step_14
next_allowed_action = Step 14已按门禁创建并完成;当前等待用户审查`04_config_step_14_risks_open_questions.md`
formal_document_write = not_started
commit_required = no
```
