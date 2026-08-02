# Step 5 分件 B. 功能验收单项停审与跨功能审计

> 父Step: `06_acceptance_step_05_function_gate.md`
> 追溯分件: `06_acceptance_step_05_function_trace_register.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_6
> 本分件口径: 对`AC-SBX-006~023`逐项执行设计停审,并审计功能范围、证据复用、裁决冲突、P1 / P2污染和Step边界。结论只表示门禁设计可审,不表示任何功能已执行或通过。

---

## 1. 停审方法与结论词汇

每项必须检查六个维度:

| 维度 | Pass条件 |
|---|---|
| R 正式需求 | canonical FR / AC及适用BR明确,无同号改义 |
| D 正式设计 | exact对象、flow、protocol、状态 /错误来源存在,未由`06`发明 |
| T 测试来源 | 至少有正向、关键负向和适用真实资格TC,TC仍是designed而非伪执行 |
| E 证据来源 | planned slot、producer、future runtime form和fixed report路径明确,未把slot当EV |
| J 可裁决性 | 通过 /失败条件互斥可判定,expected reject / partial与test failure分离 |
| B 边界纪律 | P0-Q不可替代,P1 / P2不污染,Step 6~10专属问题未被吞并 |

本分件中的`PassDesign`只表示上述六维设计审查通过。它不是test artifact status、单项runtime disposition、验收结论或签署。

用户已明确回复“同意”并放行父Step进入Step 6。该确认是设计流程门禁确认,不把18项`PassDesign`升级为runtime Pass,也不构成验收签署。

---

## 2. AC-SBX-006~023逐项停审记录

| 验收项 | R / D审查 | T / E审查 | J / B审查 | 设计停审结论 | 缺口 /修正 |
|---|---|---|---|---|---|
| AC-SBX-006 | FR-001 / AC-006一一对应;intake对象与`OpenControlledExecutionContextFlow`正式 | CMD-001 /002 + metadata / replay负向;INTAKE / PROTOCOL / REPLAY producer固定 | accepted / rejected / duplicate可分;不以实现缺失写Failed | PassDesign | runtime run / item不存在,实际NotEvaluated |
| AC-SBX-007 | FR-002 / AC-007;identity、resolution、actor carrier与resolver正式 | CMD-001 /002、STA-001~003、wrong-ref / authority错误;CONTRACT / INTAKE主证 | identity Active与unresolved / unauthorized互斥;外部正文边界留Step 6加严 | PassDesign | primary item需直接含AC-007;补强item可经TC链回指 |
| AC-SBX-008 | FR-003 / AC-008;entry shell与formal service边界正式 | CMD / consumer fulfillment、ARCH-003、CONF substitution;INTAKE / PROTOCOL主证,ARCH / QUAL补强 | 第二入口与统一入口互斥;P0-Q只作anti-substitution,不把相邻仓内部逻辑纳入 | PassDesign | caller-kind参数须在future case manifest逐项展开 |
| AC-SBX-009 | FR-004 / AC-009;boundary / handle / lease与establish / start flow正式 | CMD-003 /004 /007 /008、state / race /error、CONF establish / substitution;BOUNDARY + QUAL主证 | P0-C成立不等于真实环境成立;两轴都必需 | PassDesign | P0-Q当前Blocked,不影响设计停审 |
| AC-SBX-010 | FR-005 / AC-010;四维requirement / capability / decision正式 | CMD-003 /004、state / config generation、CONF-001~005;BOUNDARY / CONFIG / QUAL | 四维同代全成立或整体失败;不得单维抽样通过 | PassDesign | P0-Q每个适用维度参数须有case result |
| AC-SBX-011 | FR-006 / AC-011;weak fallback错误与launch guard正式 | CMD-004 /008、typed errors、CONF partial / substitution;BOUNDARY / ERROR / QUAL | expected整体拒绝是功能成功分支;silent partial才是验收失败 | PassDesign | supporting POLICY / CONFIG item不得被误当唯一主证 |
| AC-SBX-012 | FR-007 / AC-012;policy snapshot / decision / port正式 | CMD-005 /006 /008、consumer、state、body错误;POLICY主证,AUDIT补强 | fresh body-free前置与missing / stale非Accepted可判定;不裁决policy DSL正确性 | PassDesign | policy truth ownership留Step 6正式红线裁决 |
| AC-SBX-013 | FR-008 / AC-013;policy decision、high-risk decision、run / backend port正式 | CMD-005~008、state / race /error、CONF network / process / lifecycle /redline | accepted + Allowed才launch;真实unauthorized probe必须失败;不吸收tool semantics | PassDesign | QUAL-BOUNDARY / LIFECYCLE按probe类型分别消费 |
| AC-SBX-014 | FR-009 / AC-014;fail-closed error与adapter availability正式 | CMD-006 /008、consumer / state / error /CONF partial;POLICY / ERROR / QUAL | missing / conflict / unsupported均不得allow;Blocked不能N/A | PassDesign | P0-Q只在真实launch /candidate适用,不得扩大成policy source验收 |
| AC-SBX-015 | FR-010 / AC-015;shared metadata、service / consumer、stored replay正式 | CMD、consumer、digest / replay矩阵;POLICY / PROTOCOL / REPLAY | caller / channel改变不改decision语义;不要求tools / runner内部实现相同 | PassDesign | Step 7再逐协议审查,本项不宣称55协议已验收 |
| AC-SBX-016 | FR-011 / AC-016;run / capture对象与capture flow正式 | CMD-007~010、query / state、carrier scan、CONF capture;EXECUTION + QUAL | Complete / Partial / Failed场景均可被测试正确处理;不得把expected Partial当测试Failed | PassDesign | 实际release item必须按case断言而非业务状态汇总 |
| AC-SBX-017 | FR-012 / AC-017;capture / handoff owner与ports正式 | CMD-009~012、feedback / event /error、CONF capture / anti-leak | candidate ref与Artifact truth分离;handoff失败不回滚capture | PassDesign | truth / raw-body红线由Step 6 /10加严 |
| AC-SBX-018 | FR-013 / AC-018;audit、observability handoff与safe refs正式 | command / consumer /event /audit query /carrier /CONF;EXECUTION / READ / AUDIT /QUAL | formal audit、telemetry、handoff marker三者不替代;功能只裁决分层交接 | PassDesign | evidence自身完整性留Step 10,不由AUDIT slot单独泛化 |
| AC-SBX-019 | FR-014 / AC-019;capture / handoff /relay /stored result正式 | command、feedback consumer、event、retry job、replay、CONF identity;EXECUTION / RELAY / REPLAY /QUAL | 各入口共享owner与语义,不是要求相邻仓同代码;feedback不反写source | PassDesign | Step 7再裁决全部consumer /event /job协议 |
| AC-SBX-020 | FR-015 / AC-020;failure object、kind、status及38 error正式 | CMD-013~016、state、error closed set、CONF resource / process / lifecycle | known Classified、unknown non-success和safe surface互斥可判定;不推进runtime recover | PassDesign | ERROR为P0-C主证;QUAL只补真实failure producer |
| AC-SBX-021 | FR-016 / AC-021;redline、cleanup guard、investigation port正式 | command / feedback /state /error /job /CONF redline;SAFETY + QUAL | contained / handoff pending保守成立;advisory / auto-release明确失败 | PassDesign | Step 11再决定VETO映射,本项不预填否决状态 |
| AC-SBX-022 | FR-017 / AC-022;control / failure /guard /audit /report对象正式 | CMD-013~020、consumer /event /jobs /replay /carrier /CONF;SAFETY / RELAY / AUDIT /QUAL | expected deny /kill等需留痕;duplicate不造第二truth;日志不能替代formal record | PassDesign | shared证据多,必须按TC / assertion切片防重复计数 |
| AC-SBX-023 | FR-018 / AC-023;lease / orphan /handle /guard与reaper jobs正式 | cleanup commands、lifecycle consumers、state /race /job /error /CONF;SAFETY + QUAL | stop-new-use、non-Allowed release=0、single attempt与诚实disposition可判定 | PassDesign | 物理retention期限不属于本功能项;留Step 13 /07 /09 |

逐项停审结论:18 /18达到`PassDesign`;0项形成runtime Pass / Fail;0项允许因当前无实现 /run而删除。

---

## 3. 跨功能门禁裁决审计

| 审计ID | 审计项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| FCA-SBX-001 | C-SBX-1~5是否全部有功能主题 | pass;5 /5 | 每主题只作聚合,不替代18项 |
| FCA-SBX-002 | FR-SBX-001~018是否有唯一功能门禁 | pass;18 /18映射AC-SBX-006~023 | 无orphan FR,无重复owner |
| FCA-SBX-003 | AC-SBX-006~023是否被改义 /重编号 | pass | 直接复用canonical需求AC;未创建平行`AC-SBX-FUNC-*` |
| FCA-SBX-004 | 是否缺正向或关键负向TC | pass | 18项均有正向 /拒绝 /错误 /适用资格场景 |
| FCA-SBX-005 | 10个Command主flow是否有功能去向 | pass;10 /10 | Open / Establish / Evaluate / Start / Capture / Handoff / Control / Classify / Cleanup / Redline全部进入至少一项 |
| FCA-SBX-006 | supporting Query / Consumer / Event / Job是否越权成第二truth | pass | 只用于read / feedback /relay /maintenance补强;Step 7 /8继续加严 |
| FCA-SBX-007 | 是否存在孤儿功能P0 TC | pass at Step 5 scope | CMD-001~020全部映射;其余横切P0 TC由Step 6~10继续裁决,不在本Step伪称全覆盖owner |
| FCA-SBX-008 | planned slot是否被写成runtime EV | pass | 所有future form明确未分配;当前0 EV |
| FCA-SBX-009 | shared slot / suite是否重复证明 | pass with control | shared producer允许复用,但必须按exact TC / assertion / AC主证切片;不得重复TC主归属计数 |
| FCA-SBX-010 | primary与supplemental evidence是否区分 | pass | primary item直接含该AC;补强item可通过formal TC / CUT / PER链回指,不得伪改catalog `ac_refs` |
| FCA-SBX-011 | fixed report path是否断裂 | pass at design level | raw case、suite report、RELEASE evidence detail / index四层路径固定;真实路径尚不存在 |
| FCA-SBX-012 | P0-C / P0-Q是否互相替代 | pass | boundary、launch、capture、failure、lifecycle适用项明确双轴;P0Q当前Blocked |
| FCA-SBX-013 | P1 / P2是否污染P0 | pass | PROFILE-06默认NotRunConditional;PROFILE-07 /外围claim触发DesignReopen |
| FCA-SBX-014 | expected reject / partial是否与测试失败混淆 | pass | 只有assertion / side-effect不符才是test Failed;合法拒绝 /partial可产生Passed case |
| FCA-SBX-015 | 功能失败裁决影响是否冲突 | pass | 任一mandatory项不满足均阻断“通过 /有条件通过”;VETO由Step 11唯一owner |
| FCA-SBX-016 | 是否允许P0功能风险接受 | pass;不允许 | Step 13不得接受P0功能缺口、P0-Q缺口或VETO |
| FCA-SBX-017 | 是否吸收Step 6~10专属门禁 | pass | truth /架构、协议、状态一致性、NFR、evidence完整性保持后续owner |
| FCA-SBX-018 | 是否越界拥有相邻仓功能 | pass | tools semantics、runtime loop、member lifecycle、Artifact / observability / policy truth均排除 |
| FCA-SBX-019 | historical material是否回流 | pass | 旧session / command主线、泛化证据和空checkbox未进入当前门禁 |
| FCA-SBX-020 | 当前事实是否诚实 | pass | 过程`NotEntered`;无delivery、run、EV、review、结论或签署 |

跨功能审计结论:`no_unresolved_function_gate_conflict`。

---

## 4. 后续Step责任保留审计

| 当前功能项中出现的横切语义 | 本Step只裁决 | 后续唯一加严owner |
|---|---|---|
| external body / truth / dependency | 功能不得依赖越权正文或第二truth | Step 6数据边界与架构红线 |
| Command / Query / Consumer / Event / Job | 功能主flow及必要接缝结果存在 | Step 7全55协议和跨仓同步 |
| status / UoW / replay / race | 功能条件引用正式状态与single-owner结果 | Step 8状态、事务与一致性 |
| bounded / security / availability | 功能不得silent bypass | Step 9 NFR与零容忍 /结构有界 |
| audit / redaction / pairing / digest | 功能必须可定位证据 | Step 10 observability / evidence integrity |
| VF / VETO候选 | 功能失败可触发候选影响 | Step 11唯一正式VETO索引 |
| defect / retest / release | 功能失败阻断当前结论 | Step 12分级、复验与放行 |
| conditional / residual | P1 / P2不补偿P0 | Step 13风险接受与遗留项 |
| overall conclusion | mandatory功能失败不能通过 | Step 14三值结论与签署 |

---

## 5. 分件自检

| 自检项 | 结论 |
|---|---|
| 是否逐项停审18个canonical功能AC | 是,18 /18 |
| 每项是否覆盖R / D / T / E / J / B | 是 |
| 是否存在unresolved跨功能冲突 | 否 |
| 是否把设计Pass写成runtime通过 | 否;只使用`PassDesign` |
| 是否创建实际review记录 /签署 | 否 |
| 是否允许进入Step 6 | 是;父Step总审已完成且用户已明确确认,当前由Step 6接续 |
