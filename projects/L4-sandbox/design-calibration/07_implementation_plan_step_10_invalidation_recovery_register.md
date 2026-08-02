# L4-sandbox Step 10 失效传播与恢复登记表

> 主件: `07_implementation_plan_step_10_rollback_pause_change_control.md`
> 权威上游: 正式`04` complete generation / rollback;正式`05` run / source / RELEASE / P0-Q;正式`06` acceptance process / decision invalidation
> 当前成熟度: design_only;本文没有真实generation、candidate、run、source、RELEASE、EV、batch、decision或signoff实例

---

## 1. 真相单元与不可混写边界

| 真相单元 | Owner /固定来源 | 可发生的控制变化 | 绝不能替代 |
|---|---|---|---|
| design baseline | 设计仓正式文档 +真实design commit | supersede旧实施输入,重跑Design Gate | implementation commit或工作区HEAD |
| implementation boundary | target repo commit +项目 /boundary ledger | 未提交撤销、forward-fix、授权revert | config rollback、resource cleanup |
| complete candidate | 正式`04`的immutable complete config candidate | new revision、review、prior candidate再选择 | patch、old process memory、LKG猜测 |
| runtime generation | same-generation complete handle set | 新candidate /binding全量构建新generation | in-place mutation、partial /mixed identity |
| product truth | 正式`03` truth /audit /relay /stored result /capture /failure | forward mutation或新事实 | teardown、report generator、Query /job repair |
| resource disposition | cleanup /reaper /containment /teardown记录 | cleaned /contained /investigation等处置 | run成功、capture撤销、qualification结论 |
| test run | `artifacts/test/<run_id>` immutable raw | failed /blocked保留;修复后new run | 覆盖旧目录、`latest`、手写report |
| evidence item | source raw /report pair经validation control派生 | Missing /Invalidated /新item | 静态alias、human summary |
| formal source | MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q固定role run | 新run替换当前候选source | targeted run或RELEASE聚合器自产证明 |
| RELEASE | 固定四source聚合 | 新四source集合生成new RELEASE | 修改source status、缺源默认Pass |
| P0-Q product disposition | 单一candidate qualification事实 | Blocked /Failed /qualifying result按正式状态保持 | lab teardown /containment disposition |
| acceptance batch | frozen scope /claim /stage /subject /RELEASE输入 | Paused、DecisionReady、Closed;identity变更new batch | 旧batch原地换source /config |
| decision lifecycle | Draft /PendingSignoff /Effective /RejectedBySignoff /Invalidated /Superseded | invalidate或由新record supersede | 删除旧decision、改三值历史 |

核心规则: 每个单元只能由自己的owner更新。代码撤销不删除product truth;resource cleanup不改变P0-Q product disposition;report生成不改变run status;RELEASE聚合不改变source;acceptance不修改evidence。

---

## 2. Config Candidate与Generation回退

### 2.1 Generation失效触发

| 触发 | 当前generation处理 | 下游失效 | 恢复 |
|---|---|---|---|
| ordinary candidate任一值 /source winner /profile变化 | 旧generation历史保持;不得原地改 | 依赖config digest的targeted /source run、P0-Q packet、RELEASE、acceptance输入 | 新complete candidate经全量parse /validate /review后构建新generation |
| registry /adapter /store /route /target binding变化 | 旧complete set不得混入新binding | adapter parity、profile资格、affected source /RELEASE | new same-generation complete set;required binding全量qualified |
| opaque material ref语义或descriptor变化 | 旧candidate /generation历史保持;revoked /expired不可复用 | material资格、P0-Q、redaction /anti-leak evidence | new ref /candidate /generation;provider资格重新闭合 |
| same-ref concrete material version rotation | ordinary candidate可不变,但active lease /version身份变化 | 消费该version的run /qualification和availability evidence | provider-native rotation;每consumer新lease;必要时terminate /restart |
| parser /schema /software baseline变化 | prior candidate不自动compatible | generation、migration /rollback evidence、所有source identity | prior /new candidate分别在current software全量验证 |
| hard guard /redaction /cleanup规则变化 | 旧资格立即不可用于新claim | profile qualification、source、RELEASE、acceptance | 回写设计并重跑安全全闭集;不得compatibility waiver |

### 2.2 配置回退算法

```text
request rollback to prior candidate
  -> identify immutable prior candidate revision
  -> verify current software / parser / schema / registry / profile compatibility
  -> re-resolve required S04 descriptors and concrete material eligibility
  -> run full load / cross-field / profile / binding validation
  -> build an entirely new same-generation complete handle set
  -> publish zero handles on any failure
  -> assign a new generation identity on success
  -> mark desired / observed only through the approved future carrier
  -> invalidate runs / sources / RELEASE / acceptance tied to replaced generation
```

| 情形 | 结论 | 禁止 |
|---|---|---|
| prior candidate在current software完整通过 | 可作为新generation输入候选,仍需profile /binding资格 | 说“恢复原generation” |
| prior candidate不兼容 | rollback诚实失败;选择forward-fix或协调software + candidate组合 | 绕validator、unknown ignore、partial field fallback |
| old process仍运行 | 只是一项observed事实 | 推断online LKG、rollback ready或current accepted |
| rollout /desired /observed carrier未选 | 可验证单instance generation能力 | 宣称fleet aligned、zero-downtime或rollback success |

---

## 3. Run、Artifact、Report与Evidence失效

### 3.1 Immutable失败保留

| 失败 | 原记录 | 新记录 | 禁止 |
|---|---|---|---|
| mandatory TC /suite Failed | 原`run_id` raw /report保持Failed | 修复后分配新合法`run_id`并执行受影响suite | 覆盖case JSON、删run、改report为Pass |
| InfraFailed | 保留environment /harness /resource disposition | 环境修复后new run;不自动转产品Failed | 用重跑覆盖infra原因 |
| Blocked前置 | context记录missing identity且0非法调用 | 前置闭合后new run /source | 把Blocked写Skipped /N/A /Passed |
| schema /digest /path失败 | 原bytes和verifier finding immutable | 修writer /schema后new run生成新artifact | 原地re-canonicalize并保留同digest |
| raw /report pairing失败 | orphan /missing显式保留,不分配EV | 生成合法new run pair或按正式规则补同run deterministic projection（仅raw未变且generator contract允许） | 手写report、伪造alias |
| redaction命中 | 隔离受影响材料并保留safe finding | 修复后扩大载体范围new run | finding中回显secret正文、直接删除审计痕迹 |
| cleanup disposition缺失 | run不得进入evidence /entry | resource owner补合法处置;identity变化则new run | report摘要写“cleaned”替代raw disposition |

### 3.2 Evidence状态传播

| 变化 | 受影响item | 状态 /动作 | 恢复 |
|---|---|---|---|
| raw bytes /digest变化 | 所有引用该raw的report /EV /source | 旧引用Invalidated或不可选;历史保留 | 新raw + report pair通过validation controls |
| report generator语义变化 | 由该版本生成的人读report /index /draft | 重新生成并比较;不得改raw | generator版本固定,report audit通过 |
| schema /canonical规则变化 | 该schema下全部artifact /index | 按兼容结论重验;不自动接受旧artifact | 新schema owner closure + verifier regression |
| TC /AC /VETO映射变化 | 相关evidence slot /coverage /decision input | 旧覆盖关系Invalidated;raw事实可继续历史可读 | 重新计算mapping与coverage,必要时new run |
| source identity变化 | source引用的全部EV与RELEASE | 旧source不再是current候选;旧RELEASE失效 | 新source全量满足role和controls |
| redaction /dependency /no-static check规则加强 | 旧材料资格待重验 | 未重验前不得继续消费 | 对历史候选source重跑新check;失败则new source run |

`Invalidated`不等于删除,也不等于原事实变成Failed。它表示该材料不能继续支持当前claim /identity。

---

## 4. 四Source与RELEASE传播

### 4.1 Source独立性

| Source role | 固定职责 | 变化 /失败后的处理 | 不得替代 |
|---|---|---|---|
| MAIN-CONTRACT | ENV-02 /PROFILE-02 contract /domain /consistency全量source | new subject /design /config /harness identity时new run | MAIN-SEAM、targeted PR |
| MAIN-SEAM | ENV-03 /PROFILE-03 controlled seam source | seam /adapter /source identity变化时new run | MAIN-CONTRACT或real candidate |
| OPS | ENV-04 /PROFILE-04 operations simulation source | cleanup /reaper /relay /resource disposition变化时new run | P0-Q真实资格 |
| P0Q | ENV-05 /PROFILE-05单candidate qualification source | 任一immutable identity变化时whole packet new run | fake /simulation /PROFILE-06 |

### 4.2 RELEASE失效矩阵

| 触发 | Source状态 | RELEASE状态 | 后续动作 |
|---|---|---|---|
| 任一source缺失 /Blocked /Failed /InfraFailed | 原样保持 | 不得Pass;保持Blocked /Failed formal语义 | 关闭根因并new source run;重新聚合 |
| 任一source design /subject /core /harness revision变化 | 未匹配新baseline的source不可选 | 旧RELEASE Invalidated for new claim | 四source按同baseline重新选择 /运行 |
| config generation /redacted digest变化 | 旧config identity source不可用于新generation claim | 旧RELEASE失效 | affected source全部new run,然后new RELEASE |
| P0-Q candidate /profile /ENV /template /provider /material /lab变化 | 旧P0Q packet全失效 | 旧RELEASE失效 | 13 CONF + identity /redaction /cleanup全量new run |
| report /evidence schema或validation control变化 | source raw可历史保留,资格待重验 | 未完成重验前RELEASE不可消费 | verifier /report audit重跑;必要时new source |
| 聚合器修复但四source未变 | source不变 | 旧错误RELEASE保留;生成新RELEASE record | 不得改旧RELEASE或source status |
| source次序 /role绑定错误 | source run事实不变但选择无效 | RELEASE Failed /Blocked | 修selection并new RELEASE聚合 |

RELEASE只允许按`MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q`聚合。修复RELEASE generator不能让缺失或失败source通过;new RELEASE必须有独立identity /digest并回指四source。

---

## 5. P0-Q Product与Lab双处置

### 5.1 双处置字段边界

| 处置 | 回答的问题 | Owner | 失败时保持 |
|---|---|---|---|
| product qualification disposition | 该固定candidate /profile /generation /capability /template组合是否满足13 CONF与正式checks | qualification owner / formal source | `Blocked / Failed /正式结果`按上游状态,不被cleanup改写 |
| lab resource disposition | 此次probe /launch产生的resource是否cleaned、contained、under investigation或teardown failed | operations /security /lab owner | resource事实和guard状态,不推导产品通过 /失败 |

### 5.2 P0-Q暂停与恢复

| 触发 | probe /launch | Product disposition | Lab disposition | 恢复 |
|---|---:|---|---|---|
| preflight identity缺失 | 0 | `Blocked` | `not_created`或已有资源按真实状态 | packet补齐后new run |
| identity mismatch /candidate substitution | 0或立即停止后续 | `Failed / Blocked`按正式check | 已创建资源必须inspect /contain /cleanup | 固定唯一新packet,全量new run |
| probe中部分CONF失败 | 停止依赖该前置的后续动作 | 保留失败,不得用后续case抵消 | 每项resource有处置 | 修复后whole affected packet new run |
| teardown成功 | 不新增probe | product结果不变 | `cleaned`等真实处置 | 不因此使P0-Q Pass |
| teardown失败 /orphan | 停止entry与后续launch | product结果不被改写,但source /entry受阻 | `contained / investigation / failed` | resource closure + new cleanup evidence;必要时new qualification run |
| containment解除请求 | 只有formal guard允许 | 不改变历史qualification | 形成新的controlled resource transition | security /operations授权和guard复验 |

禁止路径:

- `teardown success -> P0-Q Passed`
- `teardown failure -> 删除qualification raw`
- `candidate unavailable -> 搜索另一个candidate继续同run`
- `simulation clean -> real lab disposition clean`
- `resource released -> product failure /capture /run truth回滚`

---

## 6. Acceptance Batch、Decision与授权失效

### 6.1 Canonical状态

| 状态族 | 合法值 | 本Step使用方式 |
|---|---|---|
| acceptance process | `NotEntered / EntryBlocked / InReview / Paused / DecisionReady / Closed` | 任一required输入失效时进入 /保持`Paused`;不是第四种结论 |
| decision lifecycle | `Draft / PendingSignoff / Effective / RejectedBySignoff / Invalidated / Superseded` | 旧授权失效写`Invalidated`;新完整record替代旧record时旧者`Superseded` |
| final verdict | `通过 / 有条件通过 / 不通过` | 本Step不产生实例;输入不全不得计算 |

### 6.2 何时同batch暂停,何时必须新batch

| 变化 | 当前batch | Decision | 是否新batch | 理由 |
|---|---|---|---|---|
| 同一frozen identity下发现evidence missing /defect /review dispute | `Paused` | existing Draft /Effective按规则`Invalidated` | 修复不改identity时可在同batch复验,但必须保留完整历史 | claim /subject /RELEASE identity未变 |
| failed test修复后new run,但正式source集合 /RELEASE identity变化 | `Paused` | `Invalidated` | 是 | acceptance固定输入已变化 |
| design /subject /core /harness revision变化 | `Paused`并停止旧消费 | `Invalidated` | 是 | baseline身份变化 |
| config candidate /generation /profile变化 | `Paused` | `Invalidated` | 是 | execution environment identity变化 |
| P0-Q candidate /provider /material /lab packet变化 | `Paused` | `Invalidated` | 是 | qualification identity变化 |
| claim set /scope /target stage变化 | `Paused`或旧batch关闭 | `Invalidated` | 是 | 裁决问题本身变化 |
| signer authority /delegation失效,其他packet identity不变 | `Paused` | `Invalidated` | 可在同batch重新签署或按正式规则重裁 | decision authorization失效但input packet可保持 |
| 后续完整packet形成新decision | 新batch /record按流程推进 | 旧decision=`Superseded` | 是或新record identity | 旧记录不可继续授权 |

### 6.3 失效传播算法

```text
detect invalidation trigger
  -> freeze consumption of current RELEASE / decision / authorization
  -> process_state = Paused (or remain NotEntered / EntryBlocked if never entered)
  -> mark current decision Invalidated without changing its historical verdict
  -> revoke release / next-stage authorization derived from it
  -> preserve batch packet, reviews, signoffs and invalidation reason / time
  -> determine identity delta
       no frozen identity change -> same batch may collect lawful retest / review
       any RELEASE / subject / config / claim / stage identity change -> create new batch
  -> execute full AENT / review / DecisionReady path for the valid packet
  -> when a new complete decision becomes current, mark old record Superseded
```

不得只替换acceptance draft中的`run_id`或digest后保留旧签署。任一新batch都必须重新经过FormalEntryReady、独立review、VETO /defect /risk对账、DecisionReady和signoff;历史Draft /Effective不自动继承。

---

## 7. Cleanup、Lease、Reaper与Failure Truth

| 场景 | Product truth | Resource action | Evidence /acceptance影响 |
|---|---|---|---|
| lease expiry | 不自动把run /boundary写Released | inspect、stop-new-use、按guard进入cleanup /containment | disposition缺失阻Evidence /Entry |
| orphan发现 | 保留原run /failure /capture /handoff | reaper仅按formal selection和per-item UoW处理 | orphan未闭合阻相关source /acceptance |
| cleanup guard missing /uncertain | 不删truth /material evidence | release call=0,保持Blocked /Contained | 安全Gate失败;不得risk acceptance |
| cleanup成功 | 历史product truth不变 | resource标真实cleaned /released状态 | 只满足resource disposition,不改变产品结论 |
| cleanup失败 | 不伪Released,不重写failure分类 | contained /investigation /retry按正式flow | 旧raw保留,修复后new cleanup evidence |
| redline触发 | failure /capture /audit保持 | containment always active,receipt不解除 | VETO /S级传播,acceptance Paused /不可进入 |
| reaper /reconciliation重跑 | 不重算stored result、不修core truth | 只处理其formal owner surface | report replay保持,duplicate owner calls=0 |

---

## 8. 失效范围计算清单

任何pause /rollback /change恢复前必须逐项回答:

| 检查 | 必填答案 |
|---|---|
| design | 哪个正式baseline /章节 /calibration变化?最早受影响boundary? |
| subject | 哪些implementation commit /path /crate /script变化? |
| config | complete candidate /generation /profile /material identity是否变化? |
| product truth | 哪些truth已成立且必须保留?哪些只是未提交试探? |
| resource | active /cleaned /contained /investigation /failed disposition分别是什么? |
| run | 哪些`run_id`历史保留?哪些required checks必须new run? |
| evidence | 哪些raw /report /slot /EV引用Missing或Invalidated? |
| source | 四source中哪些identity /status /digest失效? |
| RELEASE | 旧RELEASE能否支持当前claim?若否,新聚合前置是什么? |
| P0-Q | product与lab disposition是否分别记录?是否0非法launch? |
| acceptance | 当前process /decision状态?是否撤销授权?是否必须new batch? |
| ledger | current boundary、gate、reason和合法next action是什么? |

任一答案为空,恢复门禁不通过。

---

## 9. 正反例

| 类型 | 场景 | 判定 |
|---|---|---|
| 正例 | `03B`发现adapter binding变化,保留旧generation,用prior candidate在current software全量构建new generation,重跑affected source并new RELEASE | 真相单元和身份传播正确 |
| 反例 | 把process重启后加载旧文件称为“rollback succeeded”,继续复用旧P0-Q /RELEASE | 无兼容 /generation /evidence证明 |
| 正例 | P0-Q case失败后先contain,teardown成功记lab cleaned,product仍Failed;修复后new run | 双处置分离 |
| 反例 | teardown成功后把qualification result改Pass | resource owner改写product truth |
| 正例 | redaction check命中,隔离材料、保留safe finding,旧RELEASE /decision失效,修复后扩大new run | failure与失效历史完整 |
| 反例 | 删除泄漏run并重新生成同一`run_id` | 破坏immutable evidence |
| 正例 | signer authority撤销,decision Invalidated且过程Paused;packet identity未变时按正式规则重新签署 | authorization失效被显式处理 |
| 反例 | 只更新签署日期或替换签署人名称 | 伪造authority continuity |
| 正例 | config generation变化后创建new acceptance batch并重走AENT | frozen identity变化正确传播 |
| 反例 | 在旧handoff.md里替换config digest并保留旧review /signoff | 原地篡改batch身份 |

---

## 10. 覆盖审计与停审

| 审计项 | 结果 | 说明 |
|---|---|---|
| complete candidate /generation rollback | passed_design | prior compatibility、新complete generation、0 partial publication明确 |
| failed raw /report retention | passed_design | 原run immutable,修复后new run |
| evidence invalidation | passed_design | raw /schema /mapping /source变化均有传播 |
| 四source /RELEASE | passed_design | role独立、固定顺序、new aggregation不改source |
| P0-Q双处置 | passed_design | product disposition与lab disposition完全分离 |
| cleanup /lease /reaper | passed_design | resource action不回写product truth |
| acceptance状态 | passed_design | canonical process与decision lifecycle名称一致 |
| acceptance new batch | passed_design | RELEASE /subject /config /claim /stage身份变化强制新batch |
| 授权撤销 | passed_design | decision Invalidated时停止下游消费 |
| 真实事实 | absent_as_expected | 无generation /run /EV /RELEASE /batch /decision实例 |

本分件已完成,与Step 10主件共同等待用户审查。不得单独据此进入Step 11。
