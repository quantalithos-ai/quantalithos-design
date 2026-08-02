# Step 3 分件 A. 验收基线登记与失效规则

> 父Step: `06_acceptance_step_03_baseline.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/验收标准书写规范.md` §5.3
> 生成日期: 2026-07-14
> 状态: completed_reviewed_passed_to_step_4_with_step_4_entry_phase_writeback
> 边界: 本分件定义验收基线槽、字段、合法路径、缺失传播和失效规则;不填写真实commit、build、digest、`run_id`、EV、review version、风险接受、结论或签署。

---

## 1. 登记语义与状态词汇

`ABSL-SBX-*`是acceptance baseline requirement的稳定索引,用于让后续验收项、handoff和实现计划引用“必须固定什么”。它不是需求AC、测试TC、planned ESLOT、runtime EV、缺陷、run或验收结论。

| 状态 | 含义 | 裁决边界 |
|---|---|---|
| `reviewed_design_requirement` | 字段、路径和约束已经设计审查 | 不表示实例存在或已通过 |
| `awaiting_immutable_ref` | 内容已审查,但尚无可代表当前内容的immutable source ref | 不能作为实际送验版本 |
| `absent_blocks_entry` | 必填实例不存在 | Step 4应判对应进入条件不满足 |
| `absent_blocks_decision` | 可开始部分准备,但没有该项就不能形成实际裁决 | 不得写Passed或有条件通过 |
| `conditional_not_activated` | 只有正式送验声明激活后才必填 | 未激活时须显式披露,不得伪造N/A证据 |
| `historical_forbidden` | 材料只可做差异审计 | 不得作为当前验收基线 |

登记规则:

1. 一个实际验收批次必须创建一份immutable baseline packet,逐项填写适用`ABSL-SBX-*`的真实值、来源和digest。
2. 同一槽不得用“latest”“当前版本”“默认环境”“测试通过”等自然语言替代唯一identity。
3. 条件项必须由送验声明决定是否激活;不能由执行人员在看到结果后改成不适用。
4. 任一真实值只能来自实现仓、构建系统、配置owner、test harness、fixed run或独立review,不得从本设计文档推断。
5. 当前全部实例状态只描述磁盘事实;不预填任何未来状态或结论。

---

## 2. 基线身份链

图类型: 验收基线依赖图
图标题: L4-sandbox固定送验身份与证据链

```text
immutable design and standards refs
  -> declared delivery claims
  -> subject / build / core-contracts / harness revisions
  -> role-specific ENV / PROFILE / config / data / suite manifests
  -> MAIN-CONTRACT + MAIN-SEAM + OPS + P0Q fixed source runs
  -> RELEASE aggregation with ordered source identities and digests
  -> raw artifact + run report + final evidence index
  -> acceptance handoff + veto + risk + issues
  -> independent reviewer / agent review
  -> only then may Step 4~14 consume a fixed acceptance packet
```

关键说明:

- 图中箭头表示裁决依赖,不是实现phase或运行时业务调用顺序。
- 四个source run必须使用同一design / subject / core-contracts / harness revision,但各自绑定不同profile-specific config / data / suite identity。
- RELEASE聚合器使用SBX-ENV-02 / SBX-PROFILE-02只表示聚合执行位置,不产生P0证明效力。
- 当前链路只在“设计要求”层成立;目标仓、实例、run、report和review均不存在。

---

## 3. 稳定基线登记闭集

### 3.1 文档、标准与设计revision

| Baseline ID | 必须固定的内容 | 最小identity /字段 | 权威来源 | 当前状态 | 缺失传播 |
|---|---|---|---|---|---|
| ABSL-SBX-001 | 需求基线 | `00-需求文档.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | 不得判定C / FR / BR / AC / VF适用版本 |
| ABSL-SBX-002 | 架构基线 | `01-架构设计.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | truth ownership、依赖与红线不可固定 |
| ABSL-SBX-003 | 概要基线 | `02-概要设计.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | 组成部分、关键对象与流程版本不可固定 |
| ABSL-SBX-004 | 详细设计基线 | `03-详细设计.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | 55协议、31 canonical enum entry /30 owner-level machine /39 shared declaration、38 error及事务断言不可固定 |
| ABSL-SBX-005 | 配置设计基线 | `04-配置设计.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | PROFILE、I / FDT / NCFG / XVAL与VETO-CFG不可固定 |
| ABSL-SBX-006 | 测试方案基线 | `05-测试方案.md`路径、immutable design ref、content digest | 设计仓 | reviewed content;`awaiting_immutable_ref` | 254 TC、suite、gate、ESLOT和schema分母不可固定 |
| ABSL-SBX-007 | 验收生成标准 | 验收SOP、书写规范、通用标准的immutable standards ref / digest | 设计仓 standards | current standard read;`awaiting_immutable_ref` | 无法证明裁决规则版本 |
| ABSL-SBX-008 | 统一设计source ref | design repository locator、revision、workspace status digest、ABSL-001~007 digest map | baseline packet writer | `absent_blocks_entry`;当前HEAD不包含本工作树内容 | 不允许用现有HEAD冒充当前设计基线 |

旧`README.md`与旧正式`06-验收标准.md`固定为`historical_forbidden`。它们可以出现在差异审计中,不得进入ABSL-001~008的当前source set。

### 3.2 送验声明与交付identity

| Baseline ID | 必须固定的内容 | 最小identity /字段 | 权威来源 | 当前状态 | 缺失传播 |
|---|---|---|---|---|---|
| ABSL-SBX-009 | 送验声明与能力claim | acceptance target、P0 mandatory、激活的P1 / P2 claim、明确非范围、声明者role、immutable declaration ref | delivery owner | `absent_blocks_entry` | 无法确定mandatory scope;不得默认只验最小集 |
| ABSL-SBX-010 | 目标实现仓identity | repository locator、default branch / workspace locator、ownership ref | implementation owner | `absent_blocks_entry`;`/home/aris/Projects/quantalithos-sandbox`不存在 | 无test subject |
| ABSL-SBX-011 | subject revision | implementation commit /等价immutable ref、workspace clean / status digest | implementation owner | `absent_blocks_entry` | 所有run不得升格为送验证据 |
| ABSL-SBX-012 | build / package manifest | build ID、binary / package paths、每项sha256、toolchain / lock ref | build owner | `absent_blocks_entry` | 无法证明被测物与subject一致 |
| ABSL-SBX-013 | image identity | image reference + immutable digest + build manifest link;仅交付claim含image时mandatory | build / deployment owner | `conditional_not_activated` | 激活后缺失则对应交付claim不可裁决 |
| ABSL-SBX-014 | core-contracts identity | exact repository / package、revision / version、digest | shared contract owner | `absent_blocks_entry` | compile boundary和DTO契约不可复验 |
| ABSL-SBX-015 | test harness identity | suite / gate / report / check scripts revision、writer version ref | test owner | `absent_blocks_entry` | raw / report不能证明使用已审查断言 |
| ABSL-SBX-016 | dependency与构建边界 | lockfile digest、dependency graph digest、non-core sibling compile dependency检查结果 | build / check owner | `absent_blocks_entry` | 依赖裁剪与可复现构建不可裁决 |

交付identity禁止只填branch、tag、文件时间、容器mutable tag、commit message或工作区路径。任何workspace非clean状态必须保存safe status digest并重新判断是否需要形成新的immutable revision;不得把diff正文写入证据。

### 3.3 环境、配置、数据与依赖composition

| Baseline ID | 必须固定的内容 | 最小identity /字段 | 权威来源 | 当前状态 | 缺失传播 |
|---|---|---|---|---|---|
| ABSL-SBX-017 | execution environment manifest | environment ID、instance / lab ref、owner、isolation / dependency composition ref、availability status | environment owner | 七类设计已存在;实例`absent_blocks_entry` | 对应source run不得启动或升格 |
| ABSL-SBX-018 | profile与config generation map | 每个source的SBX-PROFILE、config generation ref、effective config digest、material descriptor digest | config owner / run writer | 设计存在;真实值`absent_blocks_entry` | 禁止fallback到旧generation、默认值或另一profile |
| ABSL-SBX-019 | P0-Q qualification manifest | candidate、capability matrix、boundary template、provider / material适用identity、dedicated lab与授权trigger | qualification owner | `absent_blocks_entry` | P0Q保持Blocked且0 launch |
| ABSL-SBX-020 | dataset manifest | source role、DS refs、builder / seed version、fixed clock / ID、namespace、fixture / replay digests、cleanup class | test data owner | 28 DS设计存在;manifest实例`absent_blocks_entry` | case结果不可复现或可能跨run污染 |
| ABSL-SBX-021 | suite / coverage manifest | 254 TC、38 CUT / PER、16 suite、21 slot catalog、参数与conditional激活清单的immutable digest | test owner | designed;manifest实例`absent_blocks_entry` | coverage分母不可判定 |
| ABSL-SBX-022 | 外部依赖composition | fake / controlled / simulation / candidate-real adapter refs、route / target registry digest、required / optional分类 | environment / config owner | designed;实例`absent_blocks_entry` | required缺失必须fail-fast,不得隐式fake / host fallback |
| ABSL-SBX-023 | redaction与安全检查输入 | deny marker catalog digest、forbidden carrier规则、safe finding code catalog、scanner revision | security / test owner | designed;实例`absent_blocks_entry` | raw / report不得形成final evidence |

不同role的config generation、dataset和suite manifest可以不同,但必须在run启动前分别冻结。跨role“一致”只指它们属于同一送验source set并满足固定role矩阵,不表示四个profile共享同一个config generation。

### 3.4 Fixed run与Release source set

| Baseline ID | Role /用途 | 固定Gate与ENV / PROFILE | 必需run内容 | 当前状态 | 缺失传播 |
|---|---|---|---|---|---|
| ABSL-SBX-024 | MAIN-CONTRACT | GATE-SBX-MAIN;SBX-ENV-02 / SBX-PROFILE-02 | 独立run ID;SUITE-001~011 /014;237条P0-C主结果;MAIN checks;context / source / config / evidence digests | `absent_blocks_entry` | P0-C与RELEASE均Blocked,不得开始正式验收审查 |
| ABSL-SBX-025 | MAIN-SEAM | GATE-SBX-MAIN;SBX-ENV-03 / SBX-PROFILE-03 | 独立run ID;SUITE-005 /008 /010 /011 controlled补强;自身context / config / evidence digests | `absent_blocks_entry` | seam证明缺失;不得由MAIN-CONTRACT内混入第二profile替代 |
| ABSL-SBX-026 | OPS | GATE-SBX-OPS;SBX-ENV-04 / SBX-PROFILE-04 | 独立run ID;SUITE-012及007~010 /014扩展参数;cleanup / pairing checks | `absent_blocks_entry` | lifecycle simulation与P0-C退出不成立 |
| ABSL-SBX-027 | P0Q | GATE-SBX-P0Q;SBX-ENV-05 / SBX-PROFILE-05 | 独立qualification run;SUITE-013整包;identity / redaction / cleanup / pairing checks | `absent_blocks_entry` | P0-Q与整体P0均Blocked;不能风险接受或进入验收 |
| ABSL-SBX-028 | RELEASE aggregation | GATE-SBX-RELEASE;聚合器SBX-ENV-02 / SBX-PROFILE-02 | 独立run ID;按024 /025 /026 /027顺序的source refs;250 P0;全部checks与final index | `absent_blocks_entry` | 没有可供新版`06`消费的fixed release packet |
| ABSL-SBX-029 | P1 selected run | GATE-SBX-P1;SBX-ENV-06 / SBX-PROFILE-06 | 仅正式claim激活的SUITE-015参数;独立run / report;不得进入P0 source set | `conditional_not_activated` | 激活后缺失阻断对应claim,不补偿P0 |

每个run context只能有一个`environment_id`、一个`profile_id`和一个`config_generation_ref`。ABSL-024与025共享gate ID但不得共享run ID或把两套identity写入同一context。

### 3.5 Evidence、acceptance与review packet

| Baseline ID | 固定入口 /对象 | 必需identity /内容 | 当前状态 | 缺失传播 |
|---|---|---|---|---|
| ABSL-SBX-030 | `artifacts/test/<run_id>/...` | 024~029适用run的context、source / config、suite / case / check、logs、qualification与raw digest | 根目录不存在;`absent_blocks_entry` | 无机器事实,不得分配runtime EV或开始正式验收 |
| ABSL-SBX-031 | `reports/runs/<run_id>/...` | 每个fixed run的summary、gate、coverage、suite、evidence、redaction / dependency / audit报告及raw回链 | 根目录不存在;`absent_blocks_entry` | 无人类可读fixed report |
| ABSL-SBX-032 | final evidence index与validation checks | RELEASE `evidence-index.json / .md`、ESLOT-001~019 item、四源refs、pairing / no-static / blocked propagation等结果 | 不存在;`absent_blocks_entry` | 无正式EV消费入口 |
| ABSL-SBX-033 | P0-Q qualification packet | qualification result、candidate / capability / template / provider identity、product disposition、lab teardown与safe failure refs | 不存在;`absent_blocks_entry` | P0-Q不可裁决或进入正式验收 |
| ABSL-SBX-034 | `reports/acceptance/handoff.md` | fixed RELEASE、四源identity / digest、送验claim、范围、missing / conditional披露、review version | 不存在;`absent_blocks_entry` | 不得进入正式验收裁决 |
| ABSL-SBX-035 | `reports/acceptance/veto-checklist.md` | fixed RELEASE、VF / VETO逐项evidence / check refs、未评估 /命中状态、review version | draft不存在时`absent_blocks_entry`;最终未review时`absent_blocks_decision` | 一票否决输入或最终裁决不可判定 |
| ABSL-SBX-036 | `reports/acceptance/risk-acceptance.md` | fixed RELEASE、候选RR / defect refs、owner role、动作、期限来源、状态与review version;无接受项也须明确 | draft不存在时`absent_blocks_entry`;最终状态未定时`absent_blocks_decision` | 不得形成有条件通过或暗含风险接受 |
| ABSL-SBX-037 | `reports/acceptance/open-issues.md` | fixed RELEASE、Failed / Blocked / missing / invalidated / disputed项、defect refs与状态 | draft不存在时`absent_blocks_entry`;未最终对账时`absent_blocks_decision` | 无法证明进入披露或退出问题集完整 |
| ABSL-SBX-038 | `reports/review/reviewer-notes.md` | fixed RELEASE、四源digest、review identity / version / time、抽查与争议refs | 不存在;`absent_blocks_decision` | 独立人工复核未形成 |
| ABSL-SBX-039 | `reports/review/agent-review.md` | fixed RELEASE、四源digest、orphan / duplicate / path / digest / redaction / trace机械复核 | 不存在;`absent_blocks_decision` | 独立机械复核未形成 |
| ABSL-SBX-040 | defect / invalidation / supersede ledger refs | 原run / evidence、缺陷、变更、失效范围、新run、superseding evidence和保留状态 | 不存在;按实际变化必填 | 旧Passed不得继续支撑当前baseline |

ABSL-034~039使用固定平铺入口,不得再增加`<release_run_id>`子目录。fixed release run、四源run / digest和review version由文件正文承载;路径本身不承载版本身份。

---

## 4. 字段级固定与交叉校验规则

### 4.1 文档和交付source ref

| 对象 | 必须保存 | 禁止替代 |
|---|---|---|
| design source | repository locator、immutable revision、ABSL-001~007逐文件path / digest、safe workspace status digest | 当前HEAD但内容未入该revision、branch名、工作区mtime |
| subject source | repository locator、immutable subject revision、safe workspace status digest | 本地目录存在、branch / tag mutable ref、commit message |
| core-contracts | exact package / repository、immutable revision / version、resolved digest | “使用最新core”、workspace sibling路径 |
| test harness | suite / scripts revision、writer version、TC / suite / slot manifest digest | 只记录CI job名或报告生成时间 |
| build / image | build manifest、artifact digest;适用时image digest回链同一build | mutable image tag、文件名、手工声明“由该commit构建” |

`workspace_status_digest`只能证明状态快照,不能让dirty workspace变成immutable source。若验收所需内容未被任何immutable revision包含,ABSL-008 /011保持缺失。

### 4.2 Run context与source ref对象

所有可被RELEASE消费的source run必须在`meta/context.json`中写入与下表一致的`release_source_role`。不含该字段的diagnostic、PR、targeted或普通回归run不得事后升格。

| Role | Gate | ENV / PROFILE | Suite责任 | Evidence责任 |
|---|---|---|---|---|
| MAIN-CONTRACT | GATE-SBX-MAIN | SBX-ENV-02 / SBX-PROFILE-02 | 001~011 /014;237条P0-C主结果 | MAIN checks、coverage分母、P0-C contract / state / protocol / config主体 |
| MAIN-SEAM | GATE-SBX-MAIN | SBX-ENV-03 / SBX-PROFILE-03 | 005 /008 /010 /011 controlled补强 | resolver / publisher / target / sink接缝与failure mapping |
| OPS | GATE-SBX-OPS | SBX-ENV-04 / SBX-PROFILE-04 | 012 + 007~010 /014扩展参数 | replay、cleanup / redline simulation、pairing与honest disposition |
| P0Q | GATE-SBX-P0Q | SBX-ENV-05 / SBX-PROFILE-05 | 013完整qualification packet | 四维真实隔离、lifecycle、capture、cleanup / redline、anti-substitution |

RELEASE `source_run_refs`数组严格使用上述顺序。每项必须保存:

```text
role
run_id
gate_id
environment_id
profile_id
subject_revision_ref
config_generation_ref
context_digest
source_revisions_digest
config_identity_digest
evidence_index_digest
```

交叉校验:

1. 四个`run_id`互不相同且都不是`latest`。
2. role、gate、ENV、PROFILE与矩阵逐项相等。
3. 四个source的design / subject / core-contracts / test-harness revision逐项相等。
4. 每个source的config generation、dataset manifest和suite manifest与自己的context / config artifact相等;不做跨profile相等断言。
5. 每个digest从不可变文件实际bytes计算;不得从Markdown文字或路径名推断。
6. RELEASE aggregator自己的ENV-02 / PROFILE-02不出现在source role中,也不证明P0-C / P0-Q。
7. 任一校验失败保持`Blocked`或`Failed`;不得删除错误source后继续聚合。

### 4.3 Acceptance与review正文identity

| 文件 | 必须共同绑定 | 文件专属内容 |
|---|---|---|
| handoff | fixed RELEASE run、四源role / run / digest、design / subject refs、review version | 送验claim、mandatory / conditional / inactive范围、missing与声明限制 |
| veto checklist | 同上 | VF-SBX、VETO-CFG及后续VETO-SBX逐项evidence / check ref和状态 |
| risk acceptance | 同上 | 只允许后续Step 13判定可接受的风险;owner role、动作、期限来源、失效trigger |
| open issues | 同上 | Failed / Blocked / InfraFailed / missing / invalidated / disputed与defect refs |
| reviewer notes | 同上 + reviewer identity / time | 抽查路径、争议、签署前意见;不改raw status |
| agent review | 同上 + agent / tool version ref | orphan / duplicate / digest / path / redaction / trace机械审计 |

六个文件的review version分别固定,不要求文本版本号相同;它们必须引用同一个fixed RELEASE和同一组四源digest。任何文件更新后必须判断其他五个文件是否被其引用变化失效。

---

## 5. 缺失与状态传播

| 缺失 /不一致 | 当前合法状态 | 禁止状态 | 后续传播 |
|---|---|---|---|
| ABSL-001~008任一未固定 | baseline incomplete | 文档“默认采用当前版” | Step 4进入条件失败;不能开始正式验收 |
| ABSL-009无送验claim | scope unresolved | 默认只验P0或从报告反推claim | Step 4进入条件失败;P1 / P2激活不可判定 |
| ABSL-010~016任一required项缺失 | no test subject / unreproducible delivery | diagnostic绿色升格 | 所有P0 source run不得启动或不得升格 |
| ABSL-017~023某source前置缺失 | source `Blocked`;0 launch适用 | fallback、N/A、另一profile替代 | 该source与RELEASE保持Blocked |
| MAIN-CONTRACT缺失 | P0-C / RELEASE Blocked | MAIN-SEAM / OPS补主分母 | 237条P0-C无固定主体 |
| MAIN-SEAM缺失 | P0-C / RELEASE Blocked | 在MAIN-CONTRACT context内声称也用了ENV-03 | controlled seam未被诚实证明 |
| OPS缺失 | P0-C / RELEASE Blocked | MAIN或P0Q替代simulation责任 | lifecycle / operations补强未闭合 |
| P0Q缺失或identity不全 | P0-Q / RELEASE Blocked;0 launch | P0-C、P1、host、fake或历史packet替代 | 整体P0不得通过 |
| RELEASE聚合缺失 | acceptance packet unavailable | 直接引用若干独立绿色run | 新版`06`无固定测试聚合输入 |
| raw / report pair缺失 | Failed / Blocked按schema | 手写report补洞 | 不分配runtime EV |
| final evidence index / check缺失 | evidence incomplete | planned ESLOT升格EV | Step 5~14实际项不可裁决 |
| acceptance / review文件缺失 | handoff / review incomplete | 文档内预填结论或签署 | 最终裁决和签署不可形成 |
| P1 claim已激活但ABSL-029缺失 | claim-specific Blocked | 改回未激活掩盖缺失 | 对应目标阶段不得放行,不改变P0分母 |

“缺失”不能自动等同产品断言Failed。环境 /身份前置缺失通常传播为Blocked,执行断言失败传播为Failed;二者都不能被写成Passed、Skipped、Waived或NotApplicable。

---

## 6. 基线变更、失效与复验

| 变化 | 立即失效范围 | 必须动作 | 可保留内容 |
|---|---|---|---|
| ABSL-001~007语义 /编号 /标准变化 | 受影响验收Step、TC / gate解释和旧RELEASE | 先回写owner文档,重开受影响Step,形成新design ref | 旧packet作为historical,不得覆盖 |
| subject revision变化 | 所有产品行为source run与RELEASE | 新建四源中受影响的完整run;release intent默认重建四源 | 旧raw immutable保留 |
| core-contracts变化 | contract、protocol、consumer / producer与dependency检查 | 至少重跑MAIN-CONTRACT / MAIN-SEAM及受影响OPS / P0Q,重新聚合 | 无关历史调查材料 |
| harness / TC / suite / slot变化 | 使用旧断言 /分母的run、report和EV | 新manifest、新run或按正式规则证明只需重生成report | 仅在raw语义完全不变时保留产品raw |
| source role的profile / config generation变化 | 该role完整source run;可能波及跨源兼容 | 新run,不得拼接旧Passed case | 旧source作为superseded |
| dataset / fixture / clock / namespace变化 | 使用该数据的case / suite / evidence item | 重跑受影响case与owner suite;重新coverage / pairing | 不受影响raw按digest保留 |
| P0Q candidate / capability / template / provider / lab变化 | 整个P0Q packet | 13条CONF与全部identity / redaction / cleanup checks完整重跑 | 旧packet只作历史资格 |
| report generator /模板变化 | derived report / review version | immutable raw有效时可重生成report并复跑pairing / no-static | raw与case status不改 |
| redaction rule / scanner变化 | 旧scan结论和受影响report | 可验证完整raw时重扫;raw不完整则重跑producer | 原safe finding与调查hold |
| acceptance正文任一source ref / digest变化 | ABSL-034~039中引用旧集合的文件 | 更新受影响文件并分配新review version;重新独立review | 旧review记录不可覆盖 |
| 缺陷重开 / evidence integrity发现 | 关联item、gate、RELEASE和结论输入 | ABSL-040记录invalidated / superseded,执行Step 11 /14规则 | 原失败与旧Passed均保留 |

基线变更后禁止“只改handoff版本号”继续引用旧evidence。复验范围由正式`05` §11 / §14决定;新版`06`只消费新的fixed packet并披露旧packet为何失效。

---

## 7. 禁止作为正式基线的引用

| 禁止引用 | 原因 | 合法替代 |
|---|---|---|
| `latest`、`current`、`default`、`most recent successful` | 不可复验且可漂移 | immutable revision / fixed `run_id` / digest |
| `artifacts/test/<project>/<run_id>` | 违反统一raw root | `artifacts/test/<run_id>/...` |
| `reports/<project>/...`或acceptance / review run子目录 | 违反固定报告入口 | `reports/runs/<run_id>`、`reports/acceptance/*.md`、`reports/review/*.md` |
| branch、mutable tag、image tag | 不能唯一定位bytes | commit / package digest / image digest |
| 旧README、旧正式`06` | historical主语和结论污染 | ABSL-001~007 current reviewed source set |
| planned ESLOT / EHR / PER | 只表示应产生什么 | runtime EV + raw / report pair |
| 静态JSON或手写Markdown `Passed` | 无执行producer与digest链 | fixed suite / check raw生成的final index |
| PR / diagnostic / targeted绿色run | 证明效力不足 | 带合法source role的四个fixed source run |
| P1 / PROFILE-06结果 | 不在P0 source set | P0Q只能使用ENV-05 / PROFILE-05 packet |
| 聚合器ENV-02身份 | 只执行完整性聚合 | 证明效力来自四个source refs |
| 空checkbox、预填risk acceptance或签署 | 不是事实 | 实际review / authority动作形成的独立记录 |

---

## 8. ASCP-SBX-001~024到基线覆盖

| Scope item | 必需ABSL | 覆盖说明 |
|---|---|---|
| ASCP-SBX-001 | 001~012,014~018,020~025,030~032,034 | execution identity与统一受理需设计、subject、MAIN contract / seam及fixed evidence |
| ASCP-SBX-002 | 001~006,011~023,024,027~033 | coherent boundary同时需要P0-C裁定和P0-Q真实资格 |
| ASCP-SBX-003 | 009~012,017~023,027,030~035 | candidate真实四维隔离只由固定P0Q packet证明 |
| ASCP-SBX-004 | 001~006,009~023,024~028,030~035 | policy适用 / launch enforcement覆盖contract与真实launch |
| ASCP-SBX-005 | 001~006,011~023,024~033,034 | run / capture / handoff需四源与分层材料 |
| ASCP-SBX-006 | 004~006,011~023,024~033,037,040 | failure / control需typed设计、fixed失败材料和失效ledger |
| ASCP-SBX-007 | 001~006,017~023,024~033,037,040 | lease / cleanup / reaper覆盖simulation与P0Q真实处置 |
| ASCP-SBX-008 | 001~006,017~023,024~039 | redline containment还需handoff / review链 |
| ASCP-SBX-009~013 | 004,006,008,011,014~016,020~025,030~032 | 五类55协议由MAIN contract / seam与完整manifest证明 |
| ASCP-SBX-014 | 004,006,011,015,020~026,030~032,040 | 状态 /事务 /幂等 /并发需主结果、OPS补强与失效记录 |
| ASCP-SBX-015 | 005~008,011,015,017~024,030~032 | config source / generation只消费固定profile identity |
| ASCP-SBX-016 | 005~006,012~023,024~033,035 | sensitive material需要all-carrier redaction与P0Q适用资格 |
| ASCP-SBX-017 | 005~006,015~023,024~032,040 | change / rollback / drift由contract、OPS与失效链覆盖 |
| ASCP-SBX-018 | 002,004~008,010~016,022~024,030~032 | truth ownership与dependency boundary需source / build graph证据 |
| ASCP-SBX-019 | 001~008,009,015~024,030~032,035 | unsupported surface必须与送验claim、static absence和VETO对齐 |
| ASCP-SBX-020 | 001~008,015,023~040 | evidence integrity要求完整raw / report / acceptance / review链 |
| ASCP-SBX-021 | 001,004~006,011~028,030~035 | 零容忍NFR与结构有界需要四源和全部checks |
| ASCP-SBX-022 | 009,011~023,029~040 | PROFILE-06只在claim激活后使用独立conditional run |
| ASCP-SBX-023 | 001~009,013,017~023,034~040 | production / capacity / DR claim会触发DesignReopen,不能直接执行 |
| ASCP-SBX-024 | 001~009,011~023,034~040 | 外围增强进入current scope前必须先重开上游设计与测试基线 |

覆盖审计:

- 24 /24 ASCP均至少绑定一组文档 /交付、环境 /数据、run或evidence基线。
- ABSL-001~040均被主登记、传播 /失效规则或ASCP映射消费,无孤儿基线槽。
- 映射只表示“裁决该scope必须具备哪些基线”,不表示对应验收项已生成或已通过。

---

## 9. 当前实例readiness

| 层级 | 当前事实 | Readiness |
|---|---|---|
| reviewed design content | 正式`00~05`和Step 1~3规则可读 | designed,但无代表当前工作树的immutable design ref |
| delivery | 目标实现仓不存在;无subject / build / image / core / harness固定包 | `Blocked` |
| ENV / config / data | 只有设计矩阵,无实例、generation digest或manifest | `Blocked` |
| source runs | MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q均不存在 | `Blocked / NotEvaluated` |
| RELEASE | 无四源可聚合 | `Blocked` |
| raw / report | `artifacts/test`与`reports/runs`不存在 | absent |
| acceptance / review | `reports/acceptance`与`reports/review`不存在 | absent |
| runtime EV / result | 无EV alias、测试结果、风险接受、结论或签署 | none |

该readiness不阻塞本分件定义基线规则,但阻塞真实验收进入、执行、裁决与签署。任何后续文档不得把`designed`润色为`ready`、`qualified`或`passed`。
