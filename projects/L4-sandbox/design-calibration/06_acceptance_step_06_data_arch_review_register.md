# Step 6 分件 B. 数据 /架构红线单项停审与跨红线审计

> 父Step: `06_acceptance_step_06_data_arch_redlines.md`
> 追溯分件: `06_acceptance_step_06_data_arch_trace_register.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_7
> 本分件口径: 对`RL-SBX-001~016`和canonical `AC-SBX-026~035`执行设计停审,审计truth ownership、依赖 /产品 /四维边界、配置 /敏感材料、P0双轴、Step职责与证据复用。结论只表示门禁设计可审,不表示任何红线已执行或通过。

---

## 1. 停审方法与结论词汇

每个canonical AC必须检查七个维度:

| 维度 | PassDesign条件 |
|---|---|
| R 正式需求 | canonical AC、BR /数据归属和适用VF存在,无同号改义 |
| A 架构owner | truth / snapshot / ref / body、模块 /依赖 /产品边界有正式owner |
| D 详细 /配置契约 | exact对象、flow、port、store、NCFG / AHG / VETO-CFG来源存在,未由`06`发明 |
| T 测试来源 | 正向、关键负向、static与适用P0-Q TC可定位,当前仍是designed |
| E 证据来源 | primary / supporting slot、source role、future EV / fixed report明确,未把slot当EV |
| J 可裁决性 | 通过 /失败互斥,Blocked / expected reject / redaction failure传播明确 |
| B 边界纪律 | 不吞并Step 7 /8 /10 /11,不拥有相邻仓truth,不让P1 / P2污染P0 |

`PassDesign`只表示上述七维设计审查通过。它不是case status、runtime disposition、验收结论、review签署或risk acceptance。

用户已明确回复“同意”并放行父Step进入Step 7。该确认是设计流程门禁确认,不把10项`PassDesign`升级为runtime Pass,也不构成验收签署。

---

## 2. RL-SBX-001~016逐红线可检查性停审

| 红线 | 可观察正向 | 必需负向 /失败面 | 证据与phase审查 | 设计停审结论 |
|---|---|---|---|---|
| RL-SBX-001 execution isolation truth | 正式owner对象 /flow /repository与accepted group | caller / backend / receipt / telemetry / UI第二writer | MAIN-CONTRACT owner TC;事务完整性留Step 8加严 | PassDesign |
| RL-SBX-002 sibling truth不入仓 | typed ref /safe summary /marker接缝 | tools / runtime / member / artifact / obs / policy truth字段或writer | ARCH-003 + carrier /body cases;只验Sandbox边界 | PassDesign |
| RL-SBX-003 snapshot只服务判断 | source /freshness /resolution和degraded /fail-closed | stale /missing snapshot直接Accepted /Allowed /Coherent | INTAKE /BOUNDARY /POLICY /READ exact slice;不验上游内部truth | PassDesign |
| RL-SBX-004 typed ref不接管生命周期 | ref family roundtrip、resolution /receipt | wrong-family猜测、创建 /批准 /删除外部对象 | CONTRACT /INTAKE主证,P0Q identity补强 | PassDesign |
| RL-SBX-005 forbidden body零入仓 | body-free carrier + synthetic marker scan | raw正文 /secret /SDK /process output落任一carrier | AUDIT /CONTRACT /QUAL identity;证据完整性留Step 10 | PassDesign |
| RL-SBX-006 四维coherent boundary | 同context /template /generation /candidate /env四维成立 | 单维、跨代、partial、unsupported仍launch | P0-C语义 + P0-Q逐维probe不可替代 | PassDesign |
| RL-SBX-007 backend不反定义truth | raw outcome在infra映射typed outcome,domain再裁定 | 产品名 /SDK state /success string成为domain truth | ARCH /BOUNDARY /ERROR + qualification identity | PassDesign |
| RL-SBX-008 policy来源与decision分离 | body-free snapshot -> new execution decision | 本地allowlist /DSL /approval truth或旧decision复用 | POLICY主证;candidate capability不能补policy | PassDesign |
| RL-SBX-009 capture /handoff不转下游truth | source capture、owning handoff和receipt分层 | raw output、receipt升格、target failure回滚source | EXECUTION主证;RELAY /AUDIT /QUAL补强 | PassDesign |
| RL-SBX-010 safety不重写外部truth | 新failure /control /guard /containment事实保留因果 | replay /cleanup /reaper重算外部truth /old result | SAFETY主证;OPS /P0Q只按适用slice补强 | PassDesign |
| RL-SBX-011 derived /job no-write /repair | query write=0,job只写owning report /marker | query refresh、job修core truth、report成为truth source | READ /PROTOCOL supporting;状态 /事务细节留Step 8 | PassDesign |
| RL-SBX-012 compile dependency闭集 | manifest仅有`core-contracts` sibling | 任一runtime /event /backend /sibling path dependency | ARCH-001 + dependency check;目标仓缺失传播Blocked | PassDesign |
| RL-SBX-013 module /entry依赖方向 | 正式七模块矩阵与facade入口 | domain -> infra /SDK、entry直访repo /backend、第二port | ARCH-003 /CTR-003 /builder mapping;不替代代码review事实 | PassDesign |
| RL-SBX-014 config hard guard | NCFG逐项reject,complete generation 0或完整 | 配置放宽truth /四维 /policy /audit /cleanup /redline或partial publish | CONFIG主证;具体状态一致性留Step 8 | PassDesign |
| RL-SBX-015 sensitive bounded lifecycle | opaque ref、class /slot /consumer /lease与全carrier no raw | stale /revoked /wrong consumer继续或raw泄漏 | AUDIT P0-C + QUAL-LIFECYCLE /IDENTITY适用P0-Q | PassDesign |
| RL-SBX-016 unsupported /P1 /P2不污染 | unsupported absent /reject;conditional独立 | silent ignore /fallback或P1 /P2补P0 | ARCH /SCOPE /REAL-LIKE分层;不将conditional写P0 | PassDesign |

16 /16红线都有正向、负向、证据来源和phase owner;0项只依赖文档评审口号。

---

## 3. AC-SBX-026~035逐项停审记录

| canonical AC | R / A审查 | D / T审查 | E / J审查 | B审查 | 设计结论 | 当前缺口 /执行限制 |
|---|---|---|---|---|---|---|
| AC-SBX-026 | BR-001~005与四层context数据owner完整;intake /identity职责正式 | context /identity /reference对象与CMD /STA /CNS正负TC完整 | INTAKE primary,CONTRACT /CONSISTENCY /AUDIT补强;旁路 /匿名 /正文与formal owner互斥 | 不验identity /work内部truth,不重复Step 5功能结果 | PassDesign | target /run不存在,实际NotEvaluated |
| AC-SBX-027 | BR-006~010、coherent boundary和backend非owner正式 | boundary对象 /ports、CFG hard guard、CMD /STA /ARCH /CONF覆盖四维 /partial /substitution | BOUNDARY + QUAL-BOUNDARY /IDENTITY主证;任一P0轴缺失即不成立 | 不选backend产品;不把P0-Q降P1 | PassDesign | candidate /lab缺失,P0-Q当前Blocked |
| AC-SBX-028 | BR-011~017、policy snapshot与execution decision owner清晰 | policy对象 /port、fail-closed error、CMD /CNS /STA /CFG /CONF完整 | POLICY + QUAL-IDENTITY;非Accepted launch=0;旧decision不可复用 | 不验policy DSL正确性,不拥有governance /capability truth | PassDesign | real policy source非P0前提,但candidate不可绕summary identity |
| AC-SBX-029 | BR-018~024、capture /handoff与下游body /truth分类完整 | run /capture /handoff对象与CMD /CNS /EVT /JOB /CFG /CONF完整 | EXECUTION + QUAL-LIFECYCLE /IDENTITY;raw /receipt /rollback条件可判 | 不裁Artifact /observability内部truth;协议完整性留Step 7 | PassDesign | provider /target真实子集Blocked,不影响设计停审 |
| AC-SBX-030 | BR-025~033、safety truth和external recover禁区完整 | failure /control /lease /orphan /guard /redline与CMD /CNS /STA /JOB /CONF完整 | SAFETY /READ + QUAL;release=0、new fact、material retained可判 | 不推进runtime recover;状态 /事务精确传播留Step 8 | PassDesign | real lifecycle /containment P0-Q当前Blocked |
| AC-SBX-031 ARCH-SLICE | §6 /§12依赖来源与`01`依赖方向正式 | 七模块 /Cargo binding /NCFG /ARCH-001~003完整 | ARCH primary,CONTRACT /CONFIG supporting;target缺失必须Blocked | 只裁ARCH-SLICE,PROTOCOL-SLICE留Step 7,不重复AC | PassDesign | target manifest不存在,实际static case未执行 |
| AC-SBX-032 | §11 truth闭集与`01/03`owner /stores完整 | owner CMD、STA、TXN与query /job no-write正负覆盖 | INTAKE /BOUNDARY /CONSISTENCY等按exact owner slice;第二writer直接失败 | accepted UoW细节留Step 8,evidence pairing留Step 10 | PassDesign | shared slot多,必须按assertion切片防重复计数 |
| AC-SBX-033 | 四类snapshot与source /freshness边界正式 | reference /capability /policy /handoff snapshot及CNS /QRY /JOB /STA退化TC完整 | primary /supporting按owner slice;stale success与正式degraded互斥 | 不要求外部owner实现完整,不让cache /refresh修truth | PassDesign | future evidence需记录snapshot kind /source /freshness参数 |
| AC-SBX-034 | external ref全集与唯一shared contract来源正式 | typed refs /metadata /cursor、ARCH /CONF identity正负完整 | CONTRACT /INTAKE /ARCH /QUAL-IDENTITY主证;wrong family /missing identity可判 | 不接管外部生命周期;不本地复制core type | PassDesign | exact shared type由`07` precheck,当前不伪造可用性 |
| AC-SBX-035 | 四组forbidden body与VF-005正式 | contracts /domain /infra /config redaction、CTR /CMD /CNS /ERR /CFG /CONF全carrier覆盖 | CONTRACT /INTAKE /EXECUTION /AUDIT /QUAL-IDENTITY;marker泄漏=0 | Step 10再裁evidence自身redaction完整性;本项裁业务carrier边界 | PassDesign | P0-Q provider /platform anti-leak当前Blocked |

逐项停审结论:10 /10达到`PassDesign`;0项形成runtime Pass / Fail;0项因目标仓 /P0-Q缺失被删除或降级。

---

## 4. 跨数据 /架构红线裁决审计

| 审计ID | 审计项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| DAA-SBX-001 | canonical AC是否复用而未平行编号 | pass | 只使用AC-SBX-026~035;RL-SBX是检查索引 |
| DAA-SBX-002 | BR-SBX-001~033是否连续覆盖 | pass;33 /33 | AC-026~030五组闭合,无orphan BR |
| DAA-SBX-003 | 四层数据边界是否完整 | pass | truth /snapshot /ref /forbidden body各有owner与失败面 |
| DAA-SBX-004 | Sandbox truth是否被backend /caller /downstream替代 | pass | 全部非owner只能typed outcome /ref /marker /report |
| DAA-SBX-005 | 下游是否能反写 /删除Sandbox truth | pass | receipt /feedback只改owning marker;source no rollback |
| DAA-SBX-006 | projection /cache /query /job是否能修truth | pass | no-write /no-repair独立红线;Step 8继续加严事务 |
| DAA-SBX-007 | 外部正文禁止清单是否覆盖用户重点 | pass | tools /runtime /member /artifact /obs /policy /UI /raw backend /secret均覆盖 |
| DAA-SBX-008 | only core-contracts compile dependency是否可执行检查 | pass at design level | ARCH-001 /ESLOT-016 /fixed dependency report已定义;target执行Blocked |
| DAA-SBX-009 | module依赖方向与跨仓依赖是否混同 | pass | 内部模块矩阵与跨仓compile /runtime /event分别裁决 |
| DAA-SBX-010 | domain truth是否保持product-neutral | pass | raw SDK /product /endpoint /topic禁入domain /public carrier |
| DAA-SBX-011 | backend outcome是否越权决定正式状态 | pass | infra typed outcome后由domain decision /guard唯一裁定 |
| DAA-SBX-012 | coherent四维是否可被单维 /跨代替代 | pass | 同identity约束 + CONF-001~006逐维 /partial负向 |
| DAA-SBX-013 | P0-C是否被写成P0-Q通过 | pass | 低profile只证明语义;P0Q Blocked原样传播 |
| DAA-SBX-014 | P1 /P2 /外围是否补偿P0 | pass | conditional /inactive /DesignReopen规则明确 |
| DAA-SBX-015 | config是否可关闭hard guard | pass | NCFG /AHG /VETO-CFG逐项映射,无degraded allow |
| DAA-SBX-016 | sensitive material是否只扫log | pass | config /DTO /workload /audit /event /receipt /report /error /handoff /log /metric全carrier |
| DAA-SBX-017 | AC-SBX-031是否重复或提前总体通过 | pass | ARCH-SLICE当前owner;PROTOCOL-SLICE留Step 7;canonical单一disposition |
| DAA-SBX-018 | 是否吞并Step 7 /8 /10 /11 | pass | 协议同步、状态事务、证据完整性、正式VETO分别保留 |
| DAA-SBX-019 | shared slot /suite是否被重复证明 | pass with control | 必须按exact TC /parameter /assertion /source role消费 |
| DAA-SBX-020 | primary /supporting evidence是否区分 | pass | supporting不伪改`ac_refs`,不能单独判本项通过 |
| DAA-SBX-021 | planned slot是否写成runtime EV | pass | future form均明确未分配;当前0 EV |
| DAA-SBX-022 | historical material是否回流 | pass | 旧session /host runtime /API-DB-trace /三红线均未进入当前门禁 |
| DAA-SBX-023 | 是否发现需回写`00~05`的冲突 | pass;未发现 | AC-031用slice分工即可,不需改canonical契约 |
| DAA-SBX-024 | 当前事实是否诚实 | pass | `NotEntered`;无target、run、EV、report、review、VETO命中或结论 |

跨红线审计结论:`no_unresolved_data_arch_redline_conflict`。

---

## 5. 后续Step责任保留审计

| 本Step出现的横切语义 | 本Step只裁决 | 后续唯一加严owner |
|---|---|---|
| 55 Command /Query /Consumer /Event /Job协议 | 依赖 /责任 /body-free架构slice | Step 7协议、事件与跨仓同步 |
| status /UoW /version /replay /race | owner不得被派生面改写 | Step 8状态、事务与一致性 |
| 安全 /可用 /结构有界 | 架构hard guard和四维边界 | Step 9非功能门禁 |
| evidence redaction /pairing /digest /review | 业务carrier必须body-free且证据可定位 | Step 10 observability /evidence integrity |
| VF /VETO-CFG候选 | 记录失败可能影响 | Step 11正式VETO编号与传播 |
| defect /retest /release | mandatory红线失败阻断当前通过 | Step 12分级、复验与放行 |
| conditional /residual | P1 /P2不补P0 | Step 13风险接受与遗留项 |
| overall conclusion | mandatory红线失败不能通过 /有条件通过 | Step 14三值结论与签署 |

---

## 6. 分件自检

| 自检项 | 结论 |
|---|---|
| 是否逐项停审16条RL | 是,16 /16 |
| 是否逐项停审10个canonical AC | 是,10 /10 |
| 每项是否覆盖R / A / D / T / E / J / B | 是 |
| 是否存在unresolved数据 /架构冲突 | 否 |
| 是否把设计Pass写成runtime通过 | 否;只使用`PassDesign` |
| 是否创建实际review记录 /签署 /VETO命中 | 否 |
| 是否允许进入Step 7 | 是;父Step总审已完成且用户已明确确认,当前由Step 7接续 |
