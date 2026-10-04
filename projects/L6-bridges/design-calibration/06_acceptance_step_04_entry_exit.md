# L6-bridges 06 Step4：进入退出

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step4 / 书写§5.4；回填正式06§4。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| entry_exit | pass | design_static_only_external_gates_open | enter_step_5 | Step3固定基线/全部未决；05§11~13 entry/exit/缺陷与证据；验收SOP Step4、书写§5.4。 |

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

单模块：设计讨论准入与未来验收准入分开；暂停、正向退出与真实否决退出。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§4已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

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

Step3固定基线/全部未决；05§11~13 entry/exit/缺陷与证据；验收SOP Step4、书写§5.4。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 开始实际验收先固定已认可00~06/真实source/build/current/scope及授权，本文生成不是实际验收开始。
2. 全P0实例/两check/22EV/完整runreport/交接审查必须真实；missing不是skip。
3. S/A或qualification blocker阻正向，已实际发现VETO可优先负向裁决，不必凑齐其余positive证据。
4. 退出需三值结论/真实签署及范围责任，或明确不可裁决暂停；不把not_evaluated当第四结论。
5. 仅不涉及P0/VETO的B/C遗留可接受，实际acceptor/action/deadline等齐后进入条件通过；无材料waiting。

## 4. 当前材料问题诊断

通用进入示例允许“0或不进入”，若对Bridges承诺P0摘除缺陷后送验会绕00/05；应要求baseline变更正式批准而非entry临时排除。05§12执行权限仍false。

## 5. 改动前后对比

| 项 | 当前计划 | 06规则 | 原因 |
|---|---|---|---|
| 设计生成 | 已授权06 | 可定义门禁 | 不需要虚构runtime |
| 实际正向准入 | 全planned/not_run | 完整基线与真实材料后才可裁决 | 防静态验收 |
| 实际否决 | 可能未来出现确证VETO | 可立即负向+安全停止 | 不等正向资料凑齐 |

## 6. 验收裁决取舍与复杂度

| 方案 | 判断 |
|---|---|
| 分设计讨论/真实准入/正向退出/否决退出 | 采用；状态无混同 |
| 缺资格时默认有条件通过 | 不采用；risk不能补P0 |

复杂度：一组分层清单与暂停规则，不需附录；实际值均未满足不勾选。

## 7. 结构化中间产物

### 4.1 分层进入条件

以下是未来判定条件，不是已满足勾选。

| 准入 | 必须可复核 | 不满足结果 |
|---|---|---|
| DESIGN | 当前00~05认可、本06已定义可判定规则，未解actual缺口如实列出 | 可继续设计校准，但不能运行/签署 |
| EXECUTION | 正式07及实施ledger/全部plannedboundary、用户实施/测试授权、真实repo/source存在 | 当前全部未成立；不得本轮进入07/实施 |
| BASELINE | §3全部selected基线、scope/current、真实assignment/送验权，06 standard hash独立绑定 | blocked/not_evaluated，禁止最新/旧run |
| QUALIFICATION | 所选actual SDK/平台/owner/driver/probe/secret/route/executor/producer及数据/安全sandbox已准入 | selected不足阻正向；未选WS/Bus不强制 |
| TEST/EVIDENCE | 05 LOCAL/REAL/SAFETY/EVIDENCE-EXIT全部满足；116TC封闭实例/两check/22EV真实同run完整 | missing/failed/blocked/unavailable/not_run不汇pass |
| HANDOFF | fixedrun handoff、veto/issue/risk初稿和实际人审；无未处置S/A/P0缺陷 | waiting；初稿不signoff |

### 4.2 退出条件

| 退出分支 | 全部必要条件 | 禁止推断 |
|---|---|---|
| 正向“通过”候选 | 所有required P0按实际scope被证据证明，六VETO均明确未触发且审查完整，S/A=0；无未处置遗留；真实最终签署 | 不从设计、local通过率、ACK或handoff生成 |
| 正向“有条件通过”候选 | 全P0独立成立；仅合格B/C残余且实际接受人/动作/期限/责任/失效规则齐，真实签署 | 不接受S/A/VETO或缺actual资格，不删P0 |
| 负向“不通过” | 实际确证required P0不成立/VETO/S/A，安全finding和范围/责任已核验；授权裁决记录 | 不需要伪补其余missing用例；没有证据不能臆判VETO触发 |
| 暂停/不可裁决 | 基线、qualification、证据、权限或实际signature不足 | process=blocked/not_evaluated/waiting，不是第四验收结论 |

所有原AC/门禁、VETO、缺陷/复验、残余、原unknown及下一阶段许可必须在同fixedrun审查闭合。真实“不通过”可以在确证红线后优先形成；没有足够材料则暂停，不填写最终值。

### 4.3 暂停与恢复

出现漂移/证据路径或hash错/检查器不可用/泄露疑似/actual资格撤销/未知效果责任不清，停止受影响操作及裁决。安全保存已确认safe材料；不要转储不安全候选、清理unknown/key或重试effects。修复需owning合同及05回归、新fixedrun/当前授权与重新审查，不能在旧包修改成通过。当前仅文档准入成立，actual验收仍not_evaluated/blocked/waiting。

## 8. 回填草稿

正式06§4按书写规范直接摘录§7规范段；章节名为“进入条件与退出条件”。只补具名校准来源及延伸阅读链接，不搬§3~6诊断/取舍或§10自检状态，不新增结论。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。准入/正向退出/负向确证退出/暂停四种路径核对；不把process posture写成第四verdict。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_5。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
