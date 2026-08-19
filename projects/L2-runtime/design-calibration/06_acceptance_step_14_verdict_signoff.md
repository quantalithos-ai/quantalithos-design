# L2-runtime 06 验收标准 Step 14：最终结论与签署

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14
> 回填位置：正式 `06-验收标准.md` §14
> 状态：`completed_continuous_authorized`
> 输入：Step 3 immutable baseline、Step 4 entry/exit、Step 5~13 all acceptance gates、VETO/defect/risk/evidence contracts
> 事实边界：本 Step 定义 future verdict/signoff decision contract；当前没有 acceptance instance、fixed run、evidence、defect closure、risk acceptance、verdict、signoff 或 readiness

## 1. 最终结论三值合同

正式最终结论只允许：

```text
通过
有条件通过
不通过
```

禁止 `基本通过`、`原则上通过`、`大体没问题`、`待观察通过` 或将 `not_entered/not_decidable` 当作三值结果。`not_entered` 和 `not_decidable` 是验收流程状态；只有绑定一个 valid immutable baseline、eligible evidence 和授权裁决后，才可形成三值 verdict。

## 2. 分层结论模型

| Dimension | 裁决对象 | 必须独立记录 | 不得推导 |
|---|---|---|---|
| `G0_design` | 00~06 contract 是否可交接实现/测试 | source、denominator、case/data/env/evidence schema | code exists/pass |
| `G1_local` | 172 raw + 5 aggregate 的 Runtime local contract | 177 rows、9 checks、P0 AC/VF、缺陷/证据状态 | owner adapter、delivery、Observed、product readiness |
| `G2_candidate` | named integration seam candidate | owner contract/schema、real adapter/profile、independent run | G3 qualification、whole Runtime pass |
| `G3_slot` | 单个 external slot qualification | `TC-QUAL-SLOTnn`、owner/environment、independent evidence | 其它 slot 或 product readiness |
| `product_release` | downstream/product/release package | all mandatory lane refs、operational/release authority | local G1 alone |

每个 dimension 使用独立 `acceptance_instance_id`、`execution_run_id` 和 evidence namespace。上层只能引用下层 immutable package digest，不得复制、筛选、跨 run 拼接或改写子结论。

## 3. 总体结论判定矩阵

| 条件 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| baseline/entry | 一个 valid immutable tuple，所有 mandatory entry 满足 | 同上 | 缺 run/baseline/authority/manifest，或 entry invalid |
| applicable AC | 36 AC（或正式 scope 明确的 lane 子集）全部 eligible 且通过 | P0 AC 全部通过，只有允许的 B/C residual | 任一 applicable P0 AC failed/not_evaluable |
| VF | 所有 applicable VF `not_triggered` | 同“通过” | 任一 `triggered`，或 mandatory VF 无法判定而被错误宣告未触发 |
| defects | S/A=0，required B/C 已处理 | 仅允许 eligible B/C 且逐项授权接受 | open S/A、invalid execution、unclosed P0 |
| evidence | raw/report/check/digest/redaction/pairing 完整 | 完整且 residual package 可审查 | 缺失、跨 run、静态、脱敏失败或 orphan/duplicate |
| risk | accepted risk=0 或全部 eligible residual 有 authority/scope/expiry/action | 每项有接受人、理由、期限、trigger | VETO/S/A/P0/evidence gap 被接受，或风险字段缺失 |
| blockers | mandatory lane blocker 已 owner fact 闭合或明确不适用 | optional/non-mandatory lane blocker 被显式披露且不污染 P0 | mandatory seam `not_evaluable` 被隐瞒、缩分母或当 pass |
| signoff | all required roles bind same package digest | all required roles bind same package + conditions | role/authority/package digest 缺失或冲突 |

`有条件通过` 只能在 P0 主线、VETO、证据完整性和 mandatory lane 全部成立时使用；它不能接受 VF、S/A、P0 failure、mandatory seam `not_evaluable` 或 invalid evidence。

## 4. `not_decidable` 与三值 verdict 的边界

| 流程状态 | 含义 | 允许动作 | 禁止推导 |
|---|---|---|---|
| `not_entered` | 没有有效 candidate package | 补齐 baseline/entry | 通过/不通过/有条件通过 |
| `entry_review` | 正在校验 tuple/schema/authority | 只做准入审查 | P0 已通过 |
| `in_review` | package 已冻结，逐项裁决中 | 形成 AC/VF/defect/risk disposition | 自动总体通过 |
| `paused` | source/scope/authority/defect/evidence 冲突 | 保留旧 package，建立新 re-entry | 风险接受绕过冲突 |
| `not_decidable` | mandatory item 无法可靠判定 | 补证据/重建 package/new run | 当作“不通过”或“有条件通过”写入正式 verdict |
| `decision_ready` | 36 AC、8 VF、缺陷、风险和各 dimension 已闭合 | 授权角色形成三值结论 | 未签署即 readiness |
| `closed` | verdict、next-stage disposition、signoff、archive digest 同 tuple 固定 | 只读复查或新 acceptance instance | 旧结论适用于新 revision/scope |

若用户或流程要求当前输出结果而状态仍 `not_entered/not_decidable`，正式 06 只能记录“尚未形成结论/不可判定”，不能填三值 verdict。

## 5. 结论、下一阶段与 readiness 的分离

| Result | 可允许的下一动作 | 明确不包含 |
|---|---|---|
| G1 `local_contract_complete_candidate` | 交给未来实现/集成评审；披露 G2/G3 blockers | owner readiness、Sandbox isolation、Bus delivery、Observed、product entry |
| G2 `candidate_validated` | 进入该 named seam 的 G3 资格准备 | external owner truth 被 Runtime 拥有、全局 readiness |
| G3 `slot_qualified` | 该 slot 的独立 handoff | 其它 slot、全产品结论 |
| `通过` | 进入 formal next-stage/release-preparation（按授权 scope） | 自动上线/部署/产品接受 |
| `有条件通过` | 按条件、期限和责任人进入下一阶段 | VETO/P0/mandatory gap 的豁免 |
| `不通过` | 修复、重建 baseline、new run/retest | 复用旧 verdict 或删除失败证据 |

`readiness` 必须由其 owner/product/release authority 单独绑定 package；验收签署不自动等于 implementation、deployment、marketplace、member-service 或 product readiness。

## 6. 签署角色与职责

以下是 future role contract，不是当前人员、签名或日期：

| Role | 必须确认的范围 | 不得代替的范围 |
|---|---|---|
| Runtime/product owner | 目标、scope、P0/P1/P2、业务 residual 和下一阶段影响 | 技术证据、owner truth 或安全红线 |
| Architecture owner | truth ownership、dependency direction、13 slots、phase/VETO、cross-repo seam | 业务风险接受、测试执行 |
| Test/evidence owner | 177 denominator、suite/check、raw/report/EV pairing、defect/retest、evidence integrity | source owner、product release authority |
| Implementation owner | actual target revision/build/config/workspace、implementation scope、known technical risk | 设计 truth 或单独 acceptance verdict |
| Security/operations/compliance owner | redaction、dependency、profile、handoff、retention/compliance residual | Runtime domain state、业务验收 |
| External seam owner(s) | named owner contract、adapter/profile/environment、G2/G3 qualification evidence | G1 local verdict或其它 owner truth |
| Acceptance authority | final three-value verdict、VETO checklist、risk acceptance、open issues、archive package | 修改 raw artifact、伪造 evidence、替代 owner implementation |

签署人必须绑定同一个 `acceptance_instance_id`、baseline tuple、run/evidence package digest、review version 和日期。缺角色、权限、digest 或 scope 一致性时不得形成 `closed`。

## 7. 签署不等于风险接受

| Action | 必须写入 | 语义 |
|---|---|---|
| verdict signoff | final verdict、scope、package digest、next-stage disposition | 确认该验收结论 |
| risk acceptance | risk ID、evidence、impact、reason、action、owner、acceptor、deadline/expiry、reopen trigger | 逐项接受 eligible residual |
| blocker disposition | owner fact、source/provenance、affected lane、re-entry plan | 关闭/保持 blocker |
| readiness declaration | product/release/operational authority、独立 package、scope | 单独声明 readiness |

任何签署都不能覆盖 VETO、S/A、invalid evidence、owner truth leak、fail-open、unknown retry、dependency disguise 或 mandatory seam `not_evaluable`。

## 8. 最终验收包与归档

Future closed package must contain:

```text
acceptance_instance_id + immutable baseline tuple
design/source/implementation/config/dependency manifests
fixed run(s), artifact roots, suite/check reports, evidence-index
AC disposition table (36), VF checklist (8), defect/retest registry
risk-acceptance.md, handoff.md, open-issues.md, review notes
final verdict, next-stage disposition, signoff role records
archive/content digests and prior/superseding package links
```

固定入口：`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/*`。任何文件修改都创建新 review version/acceptance instance 或明确 supersession；旧 package 只读保留。

## 9. 当前实际审计

| Field | Current value | Meaning |
|---|---|---|
| acceptance instance/baseline | absent | 未进入验收 |
| fixed run/artifact/report/evidence | none | 177 EV 仍 M0 planned identity |
| AC/VF disposition | none/not_bound | 未形成逐项结论 |
| defects/retest | none/unknown_not_measured | 无实际缺陷统计 |
| risk acceptance | 0 accepted；future authority unbound | 不支持有条件通过 |
| verdict/signoff | none/not_bound/not_formed | 不得填写三值结论 |
| readiness | none/not_bound | 不由本文件声明 |

## 10. Final decision stop-review

| Audit | Result |
|---|---|
| verdict vocabulary | only 通过/有条件通过/不通过; process states separate |
| dimension isolation | G0/G1/G2/G3/product independent |
| VETO | 8/8 S; no risk/signoff override |
| evidence | same-run fixed package; no static/cross-run/alias |
| defects | S/A closure and new-run retest required |
| residual | 14 rows; no current acceptance |
| signoff | role contract defined; no names/dates/signatures asserted |
| readiness | separate authority and package required |
| actual state | not_entered/none/not_bound/not_formed |

## 11. 回填草稿与 Step stop-review

Formal §14 应写三值结论、dimension matrix、not_decidable boundary、signoff roles/meaning、archive package 和当前 actual audit。正文不得填写 placeholder 作为真实姓名、日期、签署或 verdict。

```text
step_status = completed_continuous_authorized
verdict_vocabulary = pass_conditional_fail_only
signoff_roles = defined_not_bound
actual_verdict = none
actual_signoff = none
actual_readiness = none
current_process_state = not_entered
next_step = Step 15
formal_06_write_allowed = false_until_step_15
```
