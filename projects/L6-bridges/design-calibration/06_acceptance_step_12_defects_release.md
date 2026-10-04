# L6-bridges 06 Step12：缺陷放行

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step12 / 书写§5.12；回填正式06§12。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| defects_release | pass | design_static_only_external_gates_open | enter_step_13 | Step11六原VETO与Step5~10所有门禁；05§11缺陷管理/§12退出/§14回归；00P0/红线。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

S/A/B/C/qualification_blocker，safe缺陷记录/复验新run/完整切口与横切/actualscope/closed_verified、closed_deferred/no-waiver。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§12已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step11六原VETO与Step5~10所有门禁；05§11缺陷管理/§12退出/§14回归；00P0/红线。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 采用05S/A/B/C：S核心不变量/安全/假证据，A任何已承诺P0/完整覆盖/原子/资格被绕；B仅批准P1非P0，C无安全/真实关联影响的排版。
2. S/A/P0/VETO不能风险接受；qualificationblocker不是降级缺陷，也不是passedwarning。
3. 修复后新actualrun固定新source/design/config/harness/expectedbaseline；全部失败cut+STATE/LOCAL/PRIVATE/EVIDENCE及所有受影响REAL，oldrun安全保留。
4. only实际B/C且无P0污染，真实acceptor/action/deadline/授权/范围/signature满足§13才有条件；未确认closeddeferred仍范围blocked。
5. S/A/P0/VETO与原unknown责任不清、资格/材料缺失阻对应下一运行阶段和整体正向；文档06→07另需用户授权。

## 4. 当前材料问题诊断

测试status/severity/acceptanceverdict三者不能互换；blocked不等安全问题已确证，而实际缺参数、冒positive或原子失败至少A/S。普通C不能把requiredreport缺失/falsepass包装排版风险。

## 5. 改动前后对比

| 项 | 错误处理 | 本步规则 |
|---|---|---|
| status/severity | blocked降为B | qualificationblocker独立、P0缺证不放行 |
| retest | 覆盖旧failed/改断言 | newrun+完整影响闭包，不删旧 |
| unknown | 复验换businessidentity | 原权威只读/人工处置先行，无blindrerun |
| release | 通用规范允许A有条件 | 本仓05/00更严，S/A/P0/VETO绝不 |

## 6. 验收裁决取舍与复杂度

中等复杂度；规则与具体切口回归映射同一步整体微循环，无新增TC/脚本/JSONschema或实际缺陷。未来人工记录用固定MDsafe表，不扩05DTO。

## 7. 结构化中间产物

### 12.1 分级与放行

| 级别/类别 | 定义/判据（沿05§11） | 对结论/放行影响 | 复验要求 |
|---|---|---|---|
| S | 六VETO/越权/敏感泄漏/truth越界/重复效果/unknown错误NoEffect/Query写/假run-EV-pass | actual确证不通过；立刻阻受影响IO/交接，no waiver，不降级 | 全量受影响cut+共享保护+actual资格+全安全/证据复验，真实授权审查 |
| A | 已承诺P0协议/guard/fullCAS/config/entry/完整参数或required材料不成立，actual资格被绕过 | 阻对应actual/local/P0正向；充分确证可不通过，缺证则暂停；不得条件接受 | 完整失败cut与所有参与target/参数、横切及受影响REAL |
| B | 只批准P1扩展/非P0且不影响VETO/安全/原协议真实性 | 未接受默认阻其范围；符合§13实际接受才可条件；不能代替P0 | 全受影响P1范围及证明P0未被改变的回归 |
| C | 不影响P0/安全/真实关联/必需字段的非关键排版展示 | 可以修复复验或§13具名后续；缺requiredreport/falsepass不能归C | 实际受影响页/模板/安全渲染及来源关联复验 |
| qualification_blocker | account/provider/pin/owner/producer/SDK/store/WS/affected未established | process blocked/not_evaluated，不是B或passed_warning，不臆造实际失败 | 原owner正式合同/实际资格释放后对应real-seam完整执行 |

不得按通过率/环境不稳/管理员授权/上线时限降低severity；缺actual材料不判“缺陷已关闭”。原核验发现VETO或P0失败就优先该阻断，不以另一个维度通过掩盖。允许负向确证提前终止，但不能伪造剩余门禁结果。

### 12.2 安全缺陷材料与处置

未来仅在固定 `reports/acceptance/<run_id>/open-issues.md` 记录05允许的safe字段：deviation_id（测试工具标识）、severity、cut_refs/tc_refs及safe parameter tokens、old_run/new_run、assertion/failure有限分类、environment/mode/platform labels、schema/build/approvedbaseline测试path/digest、责任role、处置/复核材料path。正式assignment通过授权私有渠道核验，表只slot/role，不放私人identity或业务ref。此表是未来记录合同，当前没有实例/修复commit或关闭事实。

处置值唯一沿05：`open/triaged/fix_planned/retest_required/closed_deferred/closed_verified`，不是业务状态或验收结论。`closed_verified`必须新run的真实完整复验+checks/EV/report+actualscope/humanreview；`closed_deferred`仅真实非P0 B/C有§13接受，未执行/未验范围仍blocked/not_evaluated，不表示被测通过。assignment/接纳/日期未建立时保持waiting，不填假值。

禁止原message/attachment/secret/token/approval/callback/rawstack/error/canary/外部ID/namespace/业务op/ref/URL/configselector或可还原派生；业务original/unknown责任仅正式private owner/probe渠道关联，不能复制到缺陷报告。

### 12.3 复验链与具体最小回归集合

1. 保存真实safe失败/blocked/unavailable旧run、index/report与missing；不覆写或删failed/参数，不弱化expected。
2. source-contract诊断影响面；若需改变00~05合同/TC/manifest先具名授权反校准，不由实现者猜接口/新state。
3. 新actual授权run固定新baseline；业务原op/key/effect/window/used及unresolved不因test_run变化。未知先正式readonlyprobe/manual处置，无无效果证明不得复验时制造替代effects。
4. 执行全部失败cut的TC/所有封闭参数与参与target，加下面共享最低集；受影响actual资格重新核验/真实执行，fake只局部验证不能close actual。
5. 两checks及safe完整EV/report、人审缺陷核验；原failure_material引用保留，closed_verified才可作为新结论依据。

| 变更/失败主题 | 最小完整cut（不是代表实例） | 具体共享TC/EV及实际scope |
|---|---|---|
| 任一业务/规则cut | 原失败cut全部TC+STATE/LOCAL/PRIVATE/EVIDENCE，所有参与targets | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；EV=["EV-CONTRACT-020","EV-CONTRACT-014","EV-CONTRACT-018","EV-CONTRACT-021"]；原实际失败涉及REAL时必须真实资格/参数复验 |
| 协议/codec/core/SDK/key含义 | SURFACE/KEY/STATE/EVIDENCE/PRIVATE+全部受影响C/Q/E/J | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；EV=["EV-CONTRACT-001","EV-CONTRACT-010","EV-CONTRACT-020","EV-CONTRACT-021","EV-CONTRACT-018"]；actualSDK/export兼容不得local替 |
| store/UoW/fullCAS/immutable结果 | LOCAL+所有受影响mutatingflow+READ/STATE/AUDIT/KEY | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；EV=["EV-CONTRACT-014","EV-CONTRACT-015","EV-CONTRACT-020","EV-CONTRACT-016","EV-CONTRACT-010"]；TC-LOCAL-006 actualdriver必须 |
| 配置/secret/platform/mode/current/rate | CONFIG/PRIVATE/ENTRY/RATE+受影响BIND/INBOUND/DELIVERY/CALLBACK/CHANGE/ATTACH/REAL | ["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；EV=["EV-CONTRACT-017","EV-CONTRACT-018","EV-CONTRACT-019","EV-CONTRACT-012","EV-REAL-001"]；scope/pin/grant/route/source/version变更重资格 |
| producer/consumer/canonical/非递归 | AUDIT/RECOVERY/LOCAL/PRIVATE/EVIDENCE+受影响REAL与强制保护操作 | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；EV=["EV-CONTRACT-016","EV-CONTRACT-013","EV-CONTRACT-014","EV-CONTRACT-018","EV-CONTRACT-021","EV-REAL-001"]；当前无Bridgesproducer，不fakeclose |
| harness/schema/expectedmanifest/digest/report安全 | EVIDENCE全部、PRIVATE005及全部suite输出checks；变更关联/来源影响时全部22cuts | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；EV=["EV-CONTRACT-021","EV-CONTRACT-018"]；22cut全集=["CUT-BR-SURFACE","CUT-BR-BIND","CUT-BR-MAP","CUT-BR-INBOUND","CUT-BR-CHANGE","CUT-BR-PRESENT","CUT-BR-ATTACH","CUT-BR-DELIVERY","CUT-BR-CALLBACK","CUT-BR-KEY","CUT-BR-CURSOR","CUT-BR-RATE","CUT-BR-RECOVERY","CUT-BR-LOCAL","CUT-BR-READ","CUT-BR-AUDIT","CUT-BR-CONFIG","CUT-BR-PRIVATE","CUT-BR-ENTRY","CUT-BR-STATE","CUT-BR-EVIDENCE","CUT-BR-REAL"] |

### 12.4 阶段放行

正向运行/验收只在相应§4准入、所有P0/六VETO/actualscope材料、S/A=0开放、必要retention/资格成立后考虑；真实B/C条件另受§13/14。任何签名不能覆盖P0/VETO缺口。设计06完成只允许停审，后续07/实施/测试/发布各需其独立授权与ledger/gate，不以此节预授权。


## 8. 回填草稿

正式06§12按书写规范直接摘录§7规范段；章节名为“缺陷分级、复验与放行规则”。只补具名校准来源及延伸阅读链接，不搬§3~6诊断/取舍或§10自检状态，不新增结论。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。缺陷/复验/放行合同完成，具体共享TC/EV与六变更主题回归映射，S/A/P0/VETO不条件接受；没有实际缺陷/修复/关闭。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_13。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
