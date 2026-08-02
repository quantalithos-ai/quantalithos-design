# L4-sandbox 实施计划 Step 10 定义回退、暂停与变更控制

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/实施计划书写规范.md` §5.10
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 回填位置: `07-实施计划.md` §10
> 当前成熟度: design_only;本文不表示实现已开始、门禁已执行、失败已发生、回退已实施或验收已进入

---

## 1. Step状态与开工门禁

| 项 | 状态 | 说明 |
|---|---|---|
| 当前Step | Step 10 | 定义回退、暂停与变更控制 |
| 当前状态 | completed_reviewed_passed_to_step_11 | 本Step三件中间产物已形成并经用户确认,由Step 11承接提交、评审与交付纪律 |
| 上游Step | Step 6~9 | 均已审查并由用户确认传递到本Step |
| 正式输入 | 正式`03/04/05/06` | 分别拥有实现契约、配置generation、测试 / evidence、验收batch与失效规则 |
| 输出主件 | 本文件 | 固定控制状态机、暂停 /回退 /变更 /恢复和正式§10草稿 |
| 输出分件一 | `07_implementation_plan_step_10_boundary_control_matrix.md` | HDO、14 phase、32 boundary逐项暂停 /恢复反查 |
| 输出分件二 | `07_implementation_plan_step_10_invalidation_recovery_register.md` | generation、run / evidence、四source / RELEASE、P0-Q、acceptance batch失效传播 |
| 本Step禁区 | 正式`07`、implementation ledger、planned skeleton、实现仓、代码、commit、run、EV、结果、签署 | 均不得在Step 10创建或伪造 |
| 停审规则 | 已完成并获确认 | Step 11已获得一次性放行;本Step控制契约保持为其直接输入 |

三层开工门禁结论:

1. **流程门禁通过。** Step 9已获用户确认,Step 10获得一次性放行。
2. **输入门禁通过。** Step 6的32 boundary、Step 7的门禁、Step 8的依赖、Step 9的风险均可定位。
3. **事实门禁受限。** 目标实现仓、真实design baseline、candidate、run和evidence仍未形成;本Step只能设计未来控制,不能记录执行事实。

---

## 2. 输入与规范约束

| 输入 | 本Step消费内容 | 不复制 /不推断 |
|---|---|---|
| Step 6 | `HDO-SBX-00`、严格串行32 boundary、allowed / forbidden scope、Gate和handoff | 不分配commit hash,不提前创建ledger实例 |
| Step 7 | G0~G4、Build / Test / Evidence / Commit / Handoff、7 formal gate、失败材料规则 | 不生成run、source、RELEASE或acceptance事实 |
| Step 8 | S00~S08、PROFILE / ENV、material、candidate、tool / repo / lab依赖 | 不把设计资格写成dependency ready |
| Step 9 | 15 Spike、20 Risk、18 OQ、DisclosureOnly / MandatoryBlocker / DesignReopen / Prohibited | 不执行Spike,不接受风险,不替decision owner裁决 |
| 正式`03` | truth / UoW / stored replay / no-write / no-repair / no-rollback / cleanup guard | 不用回退改写已成立product truth |
| 正式`04` | complete candidate、complete generation、prior compatibility、desired / observed和rollback | 不支持in-place config mutation、partial generation、online LKG或hot swap |
| 正式`05` | immutable run、raw / report pair、四source、RELEASE、P0-Q双处置、retention guard | 不覆盖失败raw,不复用旧run冒充复验 |
| 正式`06` | `Paused`、DecisionReady、结论`Invalidated / Superseded`、新batch规则 | 不把暂停当最终三值,不保留失效授权 |
| 台账规范 | `gate_status`和`next_allowed_action`闭集、单current boundary、blocker记录 | 不使用自由发明的台账状态 /动作 |

### 2.1 台账动作闭集修正

Step 10回查发现Step 7~9曾把`wait_dependency`写成未来`next_allowed_action`,但台账规范没有该合法值。已受控回写Step 7~9,不改变依赖与风险语义:

| 根因 | blocker原因分类 | `gate_status` | 合法`next_allowed_action` | 允许动作 |
|---|---|---|---|---|
| 设计真相源缺失 /冲突 | `design_gap` | `blocked` | `wait_design` | 写blocker并回写拥有真相的正式文档 |
| repo /外部tool /candidate /lab /外部授权不可用 | `dependency_wait` | `blocked` | `handoff` | 保留恢复包,移交依赖owner;不得继续当前boundary |
| 当前allowed scope内实现、harness、环境或检查可修复 | `gate_failure` | `blocked` | `fix_gate_failure` | 只修当前scope并重跑失败门禁 |

`dependency_wait`只允许作为`gate_reason`、blocker类别或Spike结论,不得再写入`next_allowed_action`。未来boundary的`planned / wait_until_current`仍遵守台账规范的专用未来态,不等于dependency blocker。

---

## 3. SOP问题逐项回答

| SOP问题 | L4-sandbox回答 |
|---|---|
| 哪些情况必须暂停当前阶段? | 当前boundary未唯一激活、baseline / required reads缺失、字段 / DTO /状态 /port /flow /UoW /配置 /TC /evidence冲突、scope越界、required gate失败、外部必需依赖不可用、P0-Q identity不完整、VETO /安全红线、用户改动冲突、source / RELEASE /acceptance身份失效时立即暂停受影响boundary。 |
| 哪些情况允许回退到上一个提交边界? | 默认不回退已验证前序boundary。当前boundary未提交试探可在确认路径归属和用户改动后受控撤销;已提交缺陷优先forward-fix,只有明确授权且完成依赖 / evidence影响审计后才可revert。 |
| 哪些情况必须回写详细设计或测试方案? | object / DTO /port /flow /state /UoW /truth owner回`03`;source /generation /profile /material /binding回`04`;TC /suite /script /schema /artifact /report /source role回`05`;AC /VETO /defect /risk /batch /signoff回`06`;phase /boundary /scope /gate /ledger /handoff回`07`。 |
| 门禁失败后如何处理? | 先保留失败原始材料并分类。当前scope bug走`blocked / fix_gate_failure`;设计缺口走`blocked / wait_design`;外部依赖走`dependency_wait + blocked / handoff`;任何修复都必须新执行受影响门禁,不得改写旧失败。 |
| 外部依赖不可用时能否继续局部实施? | 只允许继续与该依赖无数据、代码、证明或身份依赖的当前较早boundary,且项目ledger仍只有一个current。不得预实现后序boundary。candidate缺失不阻P0-C至PH-12,但阻PH-13及依赖P0Q的RELEASE;P1 /P2未激活不阻P0。 |
| 恢复实施条件是什么? | owner关闭blocker;design baseline / dependency identity重新固定;当前boundary仍唯一;scope和worktree复核通过;失效范围完成重算;required checks以新run /新记录重跑;失败历史保留;ledger明确给出合法下一动作。 |
| 字段缺失、状态冲突、DTO不完整、phase boundary越界如何处理? | 立即停止修改 / staging / commit,记录正式来源、受影响协议 /状态 /TC /AC /boundary、已触碰文件和禁止替代;按owner回写并固定新baseline。实现者不得补私有字段、字符串状态、local DTO、旁路port或提前实现后序phase。 |

---

## 4. 问题诊断、前后变化与取舍

### 4.1 当前问题诊断

| ID | 诊断 | 风险 | 本Step处理 |
|---|---|---|---|
| DIAG-SBX-10-01 | Step 6~9已有失败 / blocker,但缺统一暂停状态机 | 实现agent可能只记录风险后继续 | 固定`pause -> classify -> preserve -> resolve -> revalidate -> resume` |
| DIAG-SBX-10-02 | “rollback”容易混指代码、配置、evidence、验收和resource cleanup | 可能用teardown改写product truth或用旧run补新结论 | 拆为五种独立控制路径 |
| DIAG-SBX-10-03 | 已验证boundary保护规则未集中 | 可能直接revert历史或删除用户改动 | 默认只处理当前boundary;已提交优先forward-fix |
| DIAG-SBX-10-04 | generation、P0-Q、RELEASE、acceptance identity变化传播分散 | 旧资格 /授权可能继续被消费 | 建立失效传播分件和新generation / run / batch规则 |
| DIAG-SBX-10-05 | Step 7~9使用非法`wait_dependency`台账动作 | Step 13机械复制会生成非法skeleton | 保留`dependency_wait`原因并映射合法`handoff` |
| DIAG-SBX-10-06 | Step 6~10少量简称把四维隔离主边界与workspace requirement合称“五维” | 容易把正式`05/06`四维验收口径与正式`03`额外workspace字段混写 | 统一为active identity前置 + resource / filesystem / network / process四维隔离 + workspace requirement |

### 4.2 改动前后

| 关注点 | Step 10前 | Step 10后 |
|---|---|---|
| 暂停 | 分散写“阻断 /不得继续” | 有触发、状态、责任、证据、允许动作和恢复条件 |
| 回退 | 容易只写rollback | 区分未提交撤销、当前scope修复、已提交forward-fix / revert、new generation、evidence / batch失效 |
| 变更 | 只要求“回写设计” | 按`03/04/05/06/07` owner、影响扩散和重开范围路由 |
| 外部等待 | `wait_dependency`自由词 | `dependency_wait`原因 + `blocked / handoff`合法台账映射 |
| 恢复 | “修复后继续” | baseline、single-current、worktree、invalidation、gate、evidence、ledger七项全过 |

### 4.3 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 任一失败都回退上一commit | 不采用 | 会破坏已验证boundary,也无法处理设计、依赖、evidence身份问题 |
| 当前boundary内修到测试通过即可继续 | 条件采用 | 仅限根因和改动均在allowed scope,且全部受影响门禁重跑 |
| 已提交缺陷优先新增修复commit | 采用 | 保留历史、审查和evidence追溯;revert需额外授权与影响审计 |
| 配置原地改回旧值 | 不采用 | 违反complete generation和immutable candidate;必须生成新的完整generation |
| 删除失败run后重跑 | 不采用 | 破坏证据链;旧run immutable,修复后新run |
| resource teardown等价P0-Q失败 /通过 | 不采用 | lab处置与product qualification是两个truth owner |

---

## 5. 统一实施控制状态机

```text
trigger detected
  -> freeze current boundary: no new scope, no staging, no commit, no next boundary
  -> preserve: worktree snapshot + blocker + failed raw/report + resource disposition
  -> classify exactly one primary route
       design_gap       -> blocked / wait_design
       dependency_wait  -> blocked / handoff
       gate_failure     -> blocked / fix_gate_failure
       authorized_abort -> controlled uncommitted withdrawal
       committed_defect -> forward-fix, or authorized revert after impact audit
  -> propagate invalidation to generation / run / source / RELEASE / acceptance as applicable
  -> resolve by owner without rewriting historical truth
  -> rebase control context on fixed design / dependency / subject identity
  -> rerun all affected gates with new execution identity where required
  -> update ledger with evidence-backed gate status
  -> resume same boundary, or explicitly activate next boundary after Handoff Gate
```

### 5.1 暂停动作原子集

| 动作 | 必做 | 禁止 |
|---|---|---|
| `freeze` | 停止扩大diff、staging、commit、launch和后序激活 | “先写完再等设计” |
| `snapshot` | 记录HEAD、design baseline、current boundary、`git status`、已触碰 /用户文件 | 把用户改动纳入回退范围 |
| `preserve` | 保留失败raw / report、safe log、call budget、resource / cleanup disposition | 删除、覆盖、改写失败状态 |
| `classify` | 写根因owner、影响面、禁止workaround和合法next action | 同时给多个互相矛盾的next action |
| `invalidate` | 标记受影响资格 / source / RELEASE / decision不可继续消费 | 通过摘要文字保留旧授权 |
| `handoff` | 给依赖 /设计owner最小可复现恢复包 | 自行选择产品、candidate、字段或默认值 |

### 5.2 暂停规则总表

| 触发条件 | 台账动作 | 责任方 | 必须保留 | 恢复条件 |
|---|---|---|---|---|
| design baseline / required read不存在或冲突 | `blocked / wait_design` | design owner + implementer | baseline、冲突章节、影响boundary | 新baseline固定且Design Gate重跑 |
| 字段 / DTO /状态 /port /flow /UoW不闭合 | `blocked / wait_design` | `03` owner | 构造缺口、call site、状态 /事务影响 | `03`与受影响`05/06/07`同步后复核 |
| config source /generation /profile /material不闭合 | `blocked / wait_design` | `04` owner | candidate /generation identity、safe issue | `04`回写且完整candidate重新验证 |
| TC /suite /schema /report /source role不闭合 | `blocked / wait_design` | `05` owner | missing /duplicate /pairing清单 | `05`回写,writer / verifier与受影响run重验 |
| AC /VETO /batch /signoff冲突 | `blocked / wait_design` | `06` owner | decision input、争议、旧授权状态 | `06`回写,acceptance保持Paused或新batch |
| phase /boundary /allowed scope越界 | `blocked / wait_design` | `07` owner | diff路径、行为、前后序依赖 | `07`重排并同步ledger / skeleton定义 |
| 当前scope内Build / Test / Evidence失败 | `blocked / fix_gate_failure` | implementer + test owner | 命令、失败raw / report、首次错误 | 只修当前scope并以新执行记录重跑通过 |
| repo /core /外部tool /candidate /lab不可用 | `blocked / handoff`;reason=`dependency_wait` | dependency owner | precheck、identity缺项、owner /deadline | 依赖可定位且Activation Gate重新通过 |
| security redline / VETO /raw material泄漏 | `blocked`;按根因`fix_gate_failure`或`wait_design` | security + truth owner | 隔离材料、safe finding、受影响载体 | 泄漏面闭合、历史保留、扩大复验通过 |
| 用户改动与current scope冲突 | `blocked / handoff` | implementer + user | 初始 /当前status、冲突path、未stage清单 | 用户明确处置且Worktree /Scope Gate重跑 |

---

## 6. 回退控制

### 6.1 五条独立路径

| 路径 | 允许场景 | 允许范围 | 恢复方式 |
|---|---|---|---|
| R1 当前未提交改动受控撤销 | 试探失败、scope越界、用户要求放弃current boundary | 仅已确认由当前boundary创建 /修改且不含用户先存改动的path /hunk | 回到记录的current HEAD,重跑Worktree /Design /Scope Gate |
| R2 当前scope修复并重跑 | 实现 /test harness /script缺陷可在allowed scope修复 | 当前boundary allowed scope及必要targeted tests | 新执行记录重跑Build / Test / Evidence /Commit Gate |
| R3 已提交boundary修复 | 已提交后发现缺陷或后序暴露兼容问题 | 优先独立forward-fix boundary /commit;不重写旧hash | 影响审计、修复门禁、旧 /新commit关联和handoff |
| R4 已提交boundary授权revert | 缺陷无法安全forward-fix且回退面可判定 | 仅明确授权的commit及经审计依赖;禁止批量回退已验证历史 | revert后全量受影响gate、新source / RELEASE /batch失效传播 |
| R5 非代码真相回退 | config、evidence、acceptance需要撤回当前消费 | 新complete generation、新run、新batch /新decision record | 原记录immutable并标Invalidated / Superseded,不得原地覆盖 |

### 6.2 回退保护不变量

1. 不使用`git reset --hard`、目录级清空或删除untracked来代替路径 /hunk归属判断。
2. 不撤销用户原有改动、其他boundary改动、失败raw、历史decision、stored result、capture truth、relay payload或audit truth。
3. 当前boundary未提交撤销不等于前序boundary失败;项目ledger仍停在current,不得自动激活next。
4. 已提交boundary不因后序失败自动revert;先确定forward-fix、依赖影响和evidence invalidation。
5. cleanup /reaper /teardown只处置resource,不得撤销run /capture /failure /qualification product truth。
6. config rollback不是恢复旧process内存,而是将prior candidate在当前software /schema /registry /material /profile下全量重建为新generation。

---

## 7. Gate失败分类与恢复

| Gate /控制点 | 失败主类 | 初始台账 | 证据保留 | 恢复动作 |
|---|---|---|---|---|
| HDO / Activation | baseline缺失走design;现实repo /tool走dependency | `wait_design`或`handoff` | precheck与missing identity | 关闭前置,不得创建 /激活current实现scope |
| Design Gate | schema /owner /语义冲突 | `blocked / wait_design` | exact正式章节、冲突与禁止替代 | 回写owner文档,固定新baseline,全量重读 |
| Scope Gate | path /行为 /phase越界 | `blocked / wait_design`或当前scope缩减后`fix_gate_failure` | diff与scope mapping | 撤销越界部分或改计划,重跑Scope Gate |
| Worktree Gate | 用户改动、HEAD /root不明 | `blocked / handoff` | 初始 /当前status、path owner | 用户 /repo owner闭合后重跑 |
| Build Gate | format /compile /lint | `blocked / fix_gate_failure`;外部tool缺失则`handoff` | 命令、版本、首错 | 当前scope修复或依赖恢复后重跑 |
| Test Gate | Failed /InfraFailed /Blocked | 按根因三分 | immutable case raw、safe log、resource disposition | 新run重跑;不覆盖旧失败 |
| Evidence Gate | schema /digest /path /pairing /redaction失败 | writer bug=`fix_gate_failure`;契约=`wait_design` | 原artifact、verifier finding | 修writer /schema后新run,旧item不分配EV |
| Commit Gate | staged scope /message /checks失败 | `blocked / fix_gate_failure` | staged file list、diff check、missing check | 清理staging、补检查;不得提交半成品 |
| Handoff Gate | hash /ledger /post-status /blocker缺失 | `blocked / fix_gate_failure` | commit、post-status、未跑项 | 补真实handoff记录;下一boundary仍planned |
| Formal source / RELEASE | source missing /identity错 /status非Pass | source或RELEASE保持`Blocked / Failed`原语义 | 四source context、digest、report | 修复根因后新source run与新RELEASE聚合 |
| Acceptance | evidence /review /risk /signer失效 | 过程`Paused`;decision `Invalidated` | 旧packet /decision /signoff immutable | 同identity补合法复验或身份变化时新batch |

---

## 8. 变更控制与上游回写

| 变更类型 | 真相源 | 必须同步 | 重开范围 | 恢复门禁 |
|---|---|---|---|---|
| object / shared carrier / DTO / error / protocol | `03` | `05` TC、`06` AC / VETO、`07`受影响boundary | 从最早受影响`03` calibration Step开始 | 新baseline + contract / protocol /negative checks |
| function flow /UoW /state /idempotency /repository | `03` | `05` TXN /RACE /STA、`06`一致性门禁、`07`顺序 | 受影响详细设计Step及下游 | transaction / replay /state全量复验 |
| config source /item /profile /generation /material /binding | `04`;若public /runtime state变化先`03` | `05` CFG /ARCH /CONF、`06`资格、`07`phase | `04` owner Step;越界则`03 -> 04` | complete generation + profile /redaction /rollback门禁 |
| suite /TC /script /schema /artifact /report /source role | `05` | `06` evidence /entry、`07`Gate /checks | 对应测试Step及下游 | inventory、pairing、no-static、blocked propagation |
| AC /VETO /defect /risk /batch /signoff /authorization | `06` | `07` acceptance gate /handoff | 对应验收Step | AENT /DecisionReady /signoff /invalidation审计 |
| phase /boundary /scope /dependency /ledger /handoff | `07` | flow、项目ledger、全部受影响skeleton | 从最早受影响Step 5~12 | HDO一致、单current、32索引 /依赖重审 |
| requirement /architecture /ownership /non-goal变化 | `00~02` | `03~07`全链 | full affected chain | 用户重新审查,不得局部代码补偿 |

变更影响扩散算法:

```text
identify owning truth source
  -> pause earliest affected current boundary
  -> mark downstream design assumptions stale
  -> update owner document and calibration product
  -> recompute affected phase / boundary / TC / AC / evidence mappings
  -> invalidate runtime generation / source / RELEASE / acceptance where identity changed
  -> fix a new reproducible design baseline
  -> rerun Design Gate before any implementation resumes
```

---

## 9. 外部依赖不可用时的局部继续规则

| 不可用项 | 可继续 | 必须停止 | 禁止升格 |
|---|---|---|---|
| design baseline / HDO | 仅设计仓继续闭口 | 所有实现boundary | 不创建目标仓 /代码 |
| target repo /core /Rust baseline | 设计材料与后序计划审查 | `CB-SBX-01A`及全部实现 | 不复制core type /猜版本 |
| RFC 8785 /Shell规则 | 在其前序boundary已完成时可准备非执行阅读 | `02C`或`02D` exact boundary及后序依赖链 | 不以命令存在宣称合规 |
| optional real external source /bus /target | 已有formal semantic fake的P0-C boundary | 需要真实seam /source claim的exact gate | fake不升格real /P0-Q |
| candidate /provider /ENV-05 /lab | P0-C至PH-12;PH-QP非执行packet准备 | `13A /13B`及P0Q source、RELEASE | 0 probe /launch,不搜索替代candidate |
| CI provider binding | 本地script /fixture能力和safe failure测试 | “已接CI”、真实source /RELEASE运行声明 | 本地targeted不升格source |
| PROFILE-06 | P0-C /P0-Q不受影响 | P1 conditional执行 | 保持`NotRunConditional` |
| PROFILE-07 /production请求 | 现有P0范围可冻结保存 | production相关任何boundary | 必须DesignReopen,不得标ready |

局部继续必须同时满足:当前ledger唯一current不变;继续内容在该boundary allowed scope;required check不消费缺失依赖;不会产生依赖已就绪的claim;不会预实现未来boundary。否则必须暂停。

---

## 10. 恢复实施完整条件

| 恢复检查 | 必须满足 | 不满足时动作 |
|---|---|---|
| owner closure | blocker有责任方、关闭记录和禁止workaround核对 | 保持原blocked route |
| design baseline | 正式文档与calibration一致,真实baseline可复现 | `wait_design` |
| dependency identity | repo /tool /candidate /ENV /provider等exact identity可定位 | `dependency_wait + handoff` |
| single current | 恰好一个current,未来boundary仍planned | 修复项目ledger,不得实现 |
| worktree ownership | 用户改动、当前diff、staged范围清楚且无越界 | Worktree /Scope Gate blocked |
| invalidation closure | generation、run、source、RELEASE、batch影响已标明 | 不得消费旧资格 /授权 |
| gate replay | 所有受影响Gate以新执行记录完成,无复用旧Pass | `fix_gate_failure`或按根因再分类 |
| evidence continuity | failed material保留,新run /report可回链,无静态补洞 | Evidence Gate blocked |
| ledger transition | `gate_status`有证据,下一动作属于合法闭集 | 修正台账后才能恢复 |

恢复只允许回到**同一current boundary的第一个未通过Gate**。只有该boundary Commit + Handoff Gate均真实通过,项目ledger才可显式激活直接后继;不得因依赖恢复自动跳boundary。

---

## 11. 正式`07` §10回填草稿

### 10.1 暂停与分类

实施遇到design truth冲突、scope越界、required gate失败、现实依赖缺失、安全红线、用户改动冲突或identity失效时,必须冻结当前boundary,保留worktree与失败材料,禁止staging、commit、launch和下一boundary激活。设计缺口使用`blocked / wait_design`;现实依赖使用`dependency_wait`原因与`blocked / handoff`;当前allowed scope可修复失败使用`blocked / fix_gate_failure`。

### 10.2 回退

默认回退单位是当前boundary的未提交授权改动,且必须先识别用户已有改动。已验证前序boundary不因当前失败自动回退;已提交缺陷优先forward-fix,只有明确授权并完成依赖 / evidence影响审计后才可revert。配置回退生成新的complete generation;证据复验生成新run;验收身份变化生成新batch。旧事实保持immutable。

### 10.3 变更控制

字段 / DTO /port /flow /state /UoW回写`03`;source /generation /profile /material回写`04`;TC /suite /schema /artifact /report回写`05`;AC /VETO /defect /risk /batch /signoff回写`06`;phase /boundary /scope /ledger回写`07`。若变化触及需求、架构、ownership或非目标,从`00~02`拥有真相的位置重开。实现代码不得成为设计缺口的临时真相源。

### 10.4 证据与验收失效

失败raw / report不得删除或覆盖。修复后使用新run并重跑受影响Gate;任一四source变化都使旧RELEASE不可继续消费。P0-Q teardown / containment只记录lab disposition,不得改写product qualification disposition。RELEASE、subject、config、claim、stage或required evidence身份变化时,验收过程立即`Paused`,旧decision为`Invalidated`;身份变化必须新建batch,后续完整packet使旧记录`Superseded`。

### 10.5 恢复

恢复前必须关闭owner blocker、固定可复现baseline / dependency identity、确认单current和worktree ownership、完成失效传播、以新执行记录重跑全部受影响Gate并回写合法台账动作。恢复点是同一boundary的首个未通过Gate,不是自动进入下一boundary。

---

## 12. Blocker、待确认与停审

### 12.1 Blocker登记

| ID | 状态 | 描述 | 处理结果 /后续 |
|---|---|---|---|
| SBX-IMP-CONTROL-001 | resolved_for_step_10_design | Step 6~9控制语义尚未形成统一执行状态机 | 本Step主件与两分件已闭合 |
| SBX-IMP-LEDGER-ACTION-001 | resolved_by_step_10_writeback | Step 7~9把`wait_dependency`误作`next_allowed_action` | 已回写为`dependency_wait`原因 + `blocked / handoff`;可修复失败另走`fix_gate_failure` |
| SBX-IMP-BOUNDARY-DIMENSION-001 | resolved_by_step_10_writeback | Step 6~10少量“五维”简称未区分active identity、正式四维隔离主边界与`workspace_boundary`字段 | 已回写Step 6~10:identity为前置,resource / filesystem / network / process保持四维coherent isolation canonical验收口径,workspace作为同一requirement set的显式附加要求 |
| SBX-IMP-DESIGN-BASELINE-001 | open_before_handoff | 当前设计工作区尚无可复现新commit baseline | 不阻Step 10设计;阻HDO /首个boundary;本Step不commit |
| SBX-IMP-TARGET-REPO-001 | open_before_first_boundary | 目标实现仓尚不存在 | 不阻Step 10;未来按`dependency_wait + handoff`处理 |
| SBX-IMP-CANDIDATE-001 | open_before_p0q_boundary | candidate /provider /ENV-05 /lab identity未形成 | 不阻P0-C设计;阻13A /13B和P0Q source,保持0 launch |

未发现阻塞Step 10规则设计收口的产品契约blocker。现实依赖只阻塞其exact future boundary,不允许被本Step伪关闭。

### 12.2 自检与进入下一步条件

| 自检项 | 结果 | 依据 |
|---|---|---|
| 暂停触发、动作、责任、证据、恢复是否完整 | passed_design | §5及分件一 |
| 五类回退是否分离 | passed_design | §6 |
| Gate失败是否有合法台账路由 | passed_design | §2.1 /§7 |
| 外部依赖局部继续是否有边界 | passed_design | §9 |
| `03/04/05/06/07`回写owner是否明确 | passed_design | §8 |
| generation / P0-Q / source / RELEASE / acceptance失效是否闭合 | passed_design | 分件二 |
| HDO /14 phase /32 boundary是否反查 | passed_design | 分件一 |
| active identity /四维隔离 /workspace requirement是否分层一致 | passed_design | 正式`03`§7.3 / §7.7;正式`05/06`四维验收口径;Step 6~10受控回写 |
| 是否保护用户改动、已验证boundary和历史truth | passed_design | §6.2 |
| 是否伪造commit /run /EV /测试 /验收事实 | no | 全文均为future design contract |
| 是否已创建正式`07` /ledger /skeleton | no | 必须等待Step 13 |

```text
step_10_result = completed_reviewed_passed_to_step_11
gate_status = passed_to_step_11
next_allowed_action = 由`07_implementation_plan_step_11_commit_review_delivery.md`承接
allow_step_11 = yes
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```

用户已确认Step 10。Step 11已按一次性放行读取对应SOP和书写规范并开始形成中间产物;不得由此越级进入Step 12。
