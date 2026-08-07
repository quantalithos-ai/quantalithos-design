# L2-tools 06 Step 12 缺陷分级、复验与放行规则校准

> 文档状态：Step 12 completed / design stop-review passed
> 当前模式：full-restart
> 回填目标：`06-验收标准.md` §12
> 事实边界：本文定义未来缺陷、复验和放行合同；不创建缺陷 ID、run、artifact、关闭记录、风险接受或实际放行结论

---

## 1. 本步输入与执行计划

### 1.1 已读取输入

| 输入 | 本步用途 |
|---|---|
| `standards/document/验收标准讨论流程_SOP.md` Step 12 | 固定分级、结论影响、复验和放行问题 |
| `standards/document/验收标准书写规范.md` §5.12 | 固定正式 §12 的必备表和最低语义 |
| `05-测试方案.md` §11、§12、§14 | S/A/B/R、回归影响面、进入/退出和关闭证据来源 |
| Step 3、Step 4 | immutable baseline、新 run 和 `S=0/P0 A=0` 退出条件 |
| Step 10 | raw/report/check/final seal/projection 的证据权威和 integrity gate |
| Step 11 | `VF-L2T-001~013` 触发即 S、总体不通过、不可风险接受 |

### 1.2 Step 内计划

- [x] 区分 case execution status、finding、defect severity、blocker 和 residual。
- [x] 固定 S/A/B/R 对当前验收结论的影响。
- [x] 固定 direct S、P0 A 和非缺陷阻塞的归类规则。
- [x] 固定影响清单算法、分层复验、P0 全量升级条件和新 baseline/run 纪律。
- [x] 固定关闭证据、放行矩阵和防回归要求。
- [x] 自检与 VETO、entry/exit、evidence authority 无冲突。

## 2. SOP 问题回答与设计取舍

| SOP 问题 | L2-tools 裁决 |
|---|---|
| S/A/B 缺陷如何定义？ | S 是 VF 或 P0 truth/security/consistency/dependency/config/evidence hard redline；A 是当前 P0 的非 VETO semantic failure 或使 P0 不可裁决的 harness/environment defect；B 是不影响当前 P0 的一般问题；R 是已确认 future/excluded/open-authority residual 分类。 |
| 每级对结论有什么影响？ | S 或 A 未关闭时均不能“通过”或“有条件通过”；B/R 只有满足 Step 13 eligible residual predicate 并被逐项接受时才可能支持“有条件通过”。 |
| 修复后如何复验？ | 修复必建新 implementation/delivery baseline 与新 fixed run；至少执行原 TC、同 family 相邻正负/duplicate/no-write 项、owning suite、相关 mandatory checks，必要时升级 11 suite + 11 check 全量 release。 |
| 哪些缺陷可以风险接受？ | S、VF、当前 P0 A 和所有 hard gate 均不可；只有客观证明不在当前 P0 denominator 的 B/R residual 可进入 Step 13。 |
| 哪些必须阻断下一阶段？ | open S/A、VF trigger、P0 missing/failed/blocked/not-evaluated/invalid、redaction/dependency/pair/profile/blocker/pairing/no-static check 非 passed、缺复验关闭链均阻断。 |

### 2.1 关键取舍

| 议题 | 裁决 | 原因 |
|---|---|---|
| P0 A 能否风险接受 | 不能 | Step 4 退出谓词明确要求 `P0 A=0`；“harness 问题”仍使证据不可裁决 |
| `blocked_dependency` 是否自动建缺陷 | 不自动 | 它可能是正式开放上游；先按适用范围判 blocker，不伪装为 L2 产品缺陷或通过 |
| invalid artifact 是否固定为 S | 先阻断，再归因 | 伪造/篡改/static promotion 为 S；普通 generator/harness defect 为 A；二者都不能放行 |
| 修复能否覆盖旧 run | 不能 | 旧 failure 和 source tuple 必须只读；fix 改变交付输入，必须新 baseline/new run |
| 单 case 重跑能否关闭 | 不能独立关闭 | 只能诊断；formal closure 必须含影响 family、suite/check 和 matching release chain |
| 手工 waiver 能否跳过用例 | 不能 | P0 finding 必须下沉 concrete TC/fixture/check；手工说明只可补充，不替代机器证据 |

## 3. Authority 与对象分层

| 对象 | Authority | 允许作用 | 禁止推断 |
|---|---|---|---|
| case/suite/check status | matching raw artifact 和 final seal | 表示某次执行状态 | 自动决定 severity、风险接受或最终验收 |
| finding | case/check/reviewer 的 safe finding ref | 记录一个可复核异常 | 自身等于 defect closure 或 VETO trigger，除非 oracle 已证明 |
| defect record | future formal defect authority 的 immutable ref | 根因、severity、scope、owner、修复和关闭状态 | 由 `open-issues.md` 或 Markdown 自行创建真实缺陷事实 |
| blocker | formal dependency/baseline/authority status | 表示为何当前不可执行或不可裁决 | provider 失败、产品通过、风险已接受 |
| residual | Step 13 审查对象 | 表示已排除 hard gate 后的剩余影响 | P0 pass、defect closure 或 accepted risk |
| `reports/acceptance/open-issues.md` | matching projection 的 working view | 聚合 safe refs 供审查 | defect authority、关闭事实或放行决定 |

一个 finding 可关联多个 `AC/VF`，但只能回指一个 canonical defect 或显式多个不同根因 defect；不得复制同一 defect 以稀释 severity。多个 finding 可归并到一个 defect，但原 finding 和失败 run 都必须保留。

## 4. 执行状态到分级的判定

### 4.1 状态与 severity 正交

| 执行 / 证据状态 | 是否自动是缺陷 | 必须先回答 | 当前验收影响 |
|---|---|---|---|
| `failed` | 否 | 违反 VF/hard invariant、当前 P0，还是非 P0？ | 按根因分 S/A/B；未归类前阻断相关 gate |
| `blocked_dependency` | 否 | 该 positive path 是否属于当前 P0，blocker 是否正式开放？ | P0 applicable 则不可进入/退出；P1/future 可进入 R 候选，绝不计 pass |
| `unavailable` | 否 | 是 expected degraded oracle，还是 suite/source 不可用？ | expected branch 可通过；执行缺失则不通过相关门禁 |
| business `unknown` | 否 | 是否按正式 unknown/manual fence 保持？ | 正确保持可通过；被折叠/盲重调则 S |
| execution `not_evaluated/cancelled` | 否 | 是否在 current denominator？ | current P0 未完成，不得通过或有条件通过 |
| `invalid_artifact` | 否 | 是伪造/integrity breach 还是 generator/harness fault？ | 先使 evidence gate 无效；根因分 S/A，新 run 前不可放行 |
| `pending_review` | 否 | authorized review disposition 是否存在？ | 未处理前不能完成对应 AC/VF/defect 裁决 |

### 4.2 缺陷分级主表

| 缺陷级别 | 定义 | L2-tools 典型触发 | 对结论的影响 | 最低复验要求 | 风险接受 |
|---|---|---|---|---|---|
| `S` | 任一 VF，或 P0 truth、安全、原子性、依赖裁剪、配置安全、证据真实性 hard redline 被破坏 | forbidden body；self-auth/no-host bypass；half pair；unknown blind retry；Query 写/Job 修 truth；sibling compile；static evidence/伪造 blocker closure | open 时总体只能“不通过”；若送验前已知则阻断 formal entry | `RT-L2T-2`；命中全量条件时 `RT-L2T-3` | 禁止 |
| `A` | 当前 P0 非 VETO semantic failure，或使当前 P0 evidence 不可裁决的 harness/environment/generator defect | concrete P0 oracle 失败；full denominator 缺项；非恶意 artifact generator/pairing 失败；P0 fixture 无法重复 | open 时不得“通过”或“有条件通过”；修复前阻断下一阶段 | `RT-L2T-2`；P0 shared/integrity 变更升级 `RT-L2T-3` | 当前 P0 禁止 |
| `B` | 已证明不影响当前 P0 truth/hard gate 的一般、维护性、P1 条件路径或报告可读性问题 | P1 real-like 非关键分支；safe report 可读性；非阻断诊断质量 | 不可计入 P0 pass；未关闭时只能按 Step 13 决定是否有条件通过 | `RT-L2T-1` 或影响面选定的 suite/check | 可作为 Step 13 候选 |
| `R` | 已正式确认 out-of-scope/future/open-authority 的 residual 跟踪类别，不是已验证能力 | production-like capacity；未启用 provider positive；SDK tools client；具体产品深度行为 | 不改变 P0 门禁；若影响进入下一阶段，须 Step 13 逐项接受，否则保持 pending | owner contract/范围触发时重新 baseline，并按新优先级设计和执行 | 可作为 Step 13 候选 |

任何原分级变更都必须 append reclassification record，包含旧/新级别、正式 scope/oracle 依据、批准角色和时间；不得原地把 S/A 改成 B/R 来绕过 release。若问题仍影响当前 P0，即使责任在外部或 harness，也不能降为 B/R。

## 5. Direct S 与 P0 A 判定

### 5.1 Direct S 触发矩阵

| 触发面 | Direct S oracle | VF / 主要 TC | 必须附带检查 |
|---|---|---|---|
| 核心/owner | 五节点缺失、第二 identity/definition、吸收相邻 owner | `VF-L2T-001/002/010`; `VETO-001/002/010` | dependency、case manifest |
| Binding/auth | 复制 Hub truth、self-authorize、missing/stale/conflict fail-open | `VF-L2T-003/005`; `VETO-003/005` | blocker truth、profile isolation |
| invocation/Runtime | caller/carrier 分叉或吸收 loop/planning/recovery | `VF-L2T-004`; `VETO-004` | dependency、phase/unknown |
| Sandbox/fact | required isolation bypass，或虚构 run/receipt/delivery | `VF-L2T-005/006`; `VETO-005/006` | phase/unknown、blocker truth、no-static |
| outcome/audit | raw/external source 替代 pair，或 half pair/terminal overwrite | `VF-L2T-007/011`; `VETO-007/011`; `OUTCOME/TX/CONC` | outcome-audit pair、phase/unknown |
| forbidden material | 任一禁止正文泄漏，或四门未全真仍建 material/Port | `VF-L2T-008`; `VETO-008`; `OBS-008` | redaction、artifact/report pairing |
| reverse write/recovery | Bus/Obs/SDK/Runtime/Query/Job 状态反写或触发 retry/repair | `VF-L2T-009`; `VETO-009` | query no-write、job boundedness、phase |
| dependency/open seam | 非 Core sibling compile；pending/future/open 写 ready | `VF-L2T-010/012`; `VETO-010/012` | dependency、blocker truth、profile、no-static |
| historical/evidence | 旧合同/指标/签署复活；candidate/fake/health/open blocker promoted | `VF-L2T-013`; `VETO-013` | no-static、pairing、blocker、redaction |
| concurrency/idempotency | second winner/effect、stale CAS overwrite、unknown automatic retry | `03` §10~§12; `TX/CONC/ERR` | pair、phase/unknown |
| config safety | invalid-high fallback、partial activation、redline override、raw diagnostic | `04` V0~V8/B0~B8; `CFG-F/X` | profile、redaction、dependency |

### 5.2 P0 A 与非缺陷 blocker

| 情形 | 分类 | 放行前动作 |
|---|---|---|
| current P0 concrete oracle 失败但未命中 direct S | `A` | 修复产品语义，执行影响复验和新 release |
| P0 suite/check 因 runner、fixture、clock/ID、环境装配缺陷无法可信执行 | `A`（harness/environment root cause） | 修复 harness/环境；不得用其他 run 或人工说明替代 |
| open upstream 使 formally conditional positive P1 无法执行，而 local/negative P0 完整 | blocker + `R` candidate，不自动建产品 defect | 保持 `L2T-UP-*`，Step 13 记录；不得声明 readiness |
| open upstream 导致 current P0 local/negative denominator 缺失 | entry/exit blocker；若 L2 harness/adapter 责任则 `A` | 补齐 current P0 后新 release；不能裁剪 denominator |
| expected `Blocked/Unavailable/Unknown/Partial` 业务分支符合 oracle | 非缺陷 | 保留 typed disposition 和零副作用证据 |
| static/human report 存在但无 matching raw/seal | invalid evidence；若被 promoted 则 `S`，否则 generator gap 为 `A` | 修复链并新 release；不消费旧 projection |

## 6. 影响清单与复验层级

### 6.1 影响清单算法

每个 S/A 修复在执行前必须冻结 `retest_impact_manifest`，至少包含：original finding/defect、受影响 formal `AC/VF/FR/BR/DR/NFR`、original TC、同 family 正/负/duplicate/no-write/unknown/late 分支、owning suite、相邻 Store/UoW/Port/entry、mandatory checks、candidate slots、配置/profile/data、blocker snapshot、是否触发 full P0 及理由。多个影响面取并集，不允许手工删减 failed/blocked case。

### 6.2 复验层级

| Level | 固定范围 | 可用于什么 | 不足以证明什么 |
|---|---|---|---|
| `RT-L2T-1` targeted diagnostic | original TC + exact fixture/assertion + direct owning suite segment | 验证修复方向、B 级局部确认 | S/A formal closure、release eligibility |
| `RT-L2T-2` affected regression | original TC + 同 family 代表集 + owning/adjacent suites + applicable checks + exact reports | S/A 影响面复验的最低层级 | 触发 full P0 条件后的 closure |
| `RT-L2T-3` full P0 release | 11 P0 owning suites + `release-local-smoke` aggregate + 11 mandatory checks + complete seal/index/manifest/projection | formal defect closure、重新进入验收和最终放行 | external provider readiness 或 P1/future completion |

即使 `RT-L2T-2` 全部通过，任何 S/A 修复要进入正式 06 决策仍须在同一新 baseline 上完成 `RT-L2T-3`。`RT-L2T-1/2` 可以提前反馈，但不能与另一 run 拼接 final eligibility。

### 6.3 触发面到最低 affected regression

| 触发面 | Original / family | 必跑 suites | Applicable checks / closure oracle |
|---|---|---|---|
| typed ref/metadata/public carrier/error | original `FOUNDATION/CONTRACT` + wrong-kind/version/digest/redaction | `static-boundary`,`contract-domain`,`application-core` | case manifest、redaction、dependency；typed parity |
| contract/state/evolution | original `CONTRACT/STATE` + positive/illegal/terminal/late | `contract-domain`,`application-core`,`transaction-concurrency` | pair/phase as applicable；single switch/history immutable |
| Binding/Hub/source | original `BIND/CONSUMER-001/JOB-001` + bound/unbound/blocked/stale/duplicate | `application-core`,`controlled-seam`,`entry-worker-job` | blocker、dependency、profile；no local registry |
| invocation/admission/auth | original `INV/PRE` + carrier/missing/duplicate/no-execution | `contract-domain`,`application-core`,`query-purity`,`controlled-seam` | query no-write、phase、blocker；canonical/no Port |
| Sandbox/handoff/outcome | original `PRE/OUTCOME/HANDOFF/CONT` + known/unknown/late/status | `application-core`,`controlled-seam`,`transaction-concurrency`,`entry-worker-job` | phase、pair、blocker；one-call/local disposition |
| UoW/CAS/replay/error | original `TX/CONC/ERR` + same/different digest/stale/unknown/half pair | `transaction-concurrency`,`application-core`,`contract-domain` | pair、phase、case manifest；one winner/exact replay |
| Query/Projection | original `QUERY` + Fresh/Stale/Rebuilding/Unavailable/Failed | `query-purity`,`contract-domain` | query no-write、redaction；zero effect |
| Consumer/Event/Job | original `CONSUMER/CONT/JOB` + duplicate/version/route/partial/cursor | `entry-worker-job`,`transaction-concurrency`,`query-purity` | job boundedness、phase、query no-write；receipt/report independent |
| config/assembly/profile | original `CFG/CFG-T/A/F/X` + invalid-high/cross/redline/B0~B8 fault | `config-validator`,`config-assembly`,`static-boundary` | profile、dependency、redaction；fail-fast/no partial |
| observability/redaction | original `OBS/VETO` + every affected carrier/output | `observability-redaction`,`static-boundary` + owning suite | redaction、pairing；clean/low-cardinality/local truth first |
| dependency/evidence generator | original `VETO/static` + package/history/static/pairing corpus | `static-boundary`,`observability-redaction`,`release-local-smoke` + affected suite | dependency、blocker、pairing、no-static、redaction |

### 6.4 Full P0 强制升级

以下任一变化强制 `RT-L2T-3`，不得仅做 targeted regression：public contract/ref/version/variant/error/carrier；六状态族或 terminal guard；Store/UoW/CAS/pair/idempotency/replay；phase/unknown/one-call；`NC/VF` 或 security/redaction；dependency graph/public export；config root/item/source/profile/V0~V8/B0~B8；Query no-write/Job no-repair；suite/check/artifact/report/evidence schema/derivation；blocker truth；S 或 P0 A 修复；source/workspace/delivery baseline 改变。

## 7. 修复、复验与关闭状态机

```text
finding recorded
  -> triaged (scope + root cause + severity)
  -> fix_in_progress
  -> ready_for_retest (new source/delivery baseline + impact manifest)
  -> retest_running (new fixed run)
  -> retest_failed -> fix_in_progress
  -> retest_passed -> closure_review
  -> closed_fixed
```

`closed_duplicate` 必须指向 canonical defect，不能删除 finding；`closed_not_defect` 必须证明 expected oracle 或错误测试假设，并在 current denominator 受影响时修正测试后执行新 release；`deferred` 只允许 B/R，且必须转 Step 13，不能用于 S/A。

### 7.1 关闭谓词

S/A 只有同时满足以下条件才能 `closed_fixed`：

1. original defect/finding、failed baseline/run/artifact/report（若曾执行）保持可定位且只读；
2. 根因、受影响 formal refs、修复设计依据、source/delivery ref 和 `retest_impact_manifest` 完整；
3. 新 baseline 与 original 不混用，新 fixed release run 非 `latest`；
4. original TC、同 family、owning/adjacent suite 和 applicable checks 均有 closed status；
5. matching final seal `status=passed`，index/manifest/four projections exact matching；
6. 相关 candidate item eligible，review 无 unresolved dispute；
7. S 对应 VF 在新 run 被裁决 `not_triggered`，A 对应 P0 gate 已通过；
8. 防回归断言已进入 concrete TC/fixture/check，不只留手工 checklist；
9. closure reviewer 追加签署关闭记录；该记录不回写 raw artifact 或 seal。

任何 `blocked/unavailable/not_evaluated/cancelled/invalid/pending_review` 都不能满足关闭谓词。不存在“连续重跑至绿”：每次运行保留，只有按预先冻结 impact manifest 的新 release 可供关闭审查。

### 7.2 Future defect/closure record 最低字段

| 字段组 | 必填内容 |
|---|---|
| identity | opaque `defect_ref`、发现时间、finding refs、canonical/duplicate relation |
| classification | severity、execution status、root-cause class、P0 applicability、reclassification history |
| impact | AC/VF/formal design refs、TC/family/suite/check/candidate、Store/UoW/Port/entry/config/data/blocker |
| failure provenance | failed baseline/source/delivery/run、raw case/suite/check/report refs/digests；未执行发现须明确 `not_run` |
| fix provenance | 修复设计来源、source/delivery refs、change scope；不伪填 commit |
| retest | impact manifest、new baseline/run、case/suite/check/seal/index/manifest/projection refs |
| closure | fixed/not-defect/duplicate disposition、reviewer role、time、safe rationale、remaining residual refs |
| follow-up | concrete regression addition，或 B/R 的 Step 13 risk/follow-up refs |

## 8. 放行规则

| 当前缺陷 / 证据状态 | Formal entry | “通过” | “有条件通过” | 下一阶段 | 必须动作 |
|---|---|---|---|---|---|
| 任一 open S 或 triggered VF | 禁止 | 禁止 | 禁止 | 禁止 | 修复 + `RT-L2T-3` + VF `not_triggered` |
| 任一 open current-P0 A | 禁止或暂停 | 禁止 | 禁止 | 禁止 | 修复 harness/product + `RT-L2T-3` |
| P0 failed/blocked/not-evaluated/cancelled/invalid | 禁止或暂停 | 禁止 | 禁止 | 禁止 | 补齐并生成 matching release chain |
| hard check 非 passed | 禁止 | 禁止 | 禁止 | 禁止 | 修复 redaction/dependency/profile/purity/phase/pair/blocker/pairing/no-static 问题 |
| S/A 均 closed，但 closure 缺 failed/new run pairing | 禁止 | 禁止 | 禁止 | 禁止 | 补 closure provenance；不得人工 waive |
| 仅 open B | 可审查 | 仅在已关闭或证明不影响且无需接受时 | 仅在 Step 13 逐项接受后 | 有条件 | owner/acceptor/deadline/reopen trigger |
| 仅 R/open P1/future blocker | 可审查 local P0 | 只有完全不适用且无影响时 | 影响下一阶段时须 Step 13 接受 | 依 accepted condition | 不声称 external readiness |
| 无 open defect/residual，全部 exit predicate 成立 | 允许 | 可候选 | 不需要 | 可候选 | Step 14 最终裁决与签署 |

放行不是测试 gate 自动输出。`gate-summary.json status=passed` 只是验收输入；最终是否通过、条件进入或不通过由 Step 14 基于 AC/VF/defect/risk/signoff 作出。

## 9. 自动化防回归触发

| 发现方式 | 必须动作 |
|---|---|
| 手工发现 P0 | 固化为现有 family concrete TC，或重开 05 Step 6 正式增加 TC；绑定 dataset、oracle、owning suite |
| release smoke 发现、低层 suite 未发现 | 将断言下沉到 owning semantic suite；smoke 不成为第二 denominator |
| redaction 漏检 | 扩展 forbidden corpus、所有 carrier/output 扫描和 `check_redaction_boundary` |
| dependency/historical 漏检 | 扩展 package/import/public signature graph 和 historical deny corpus |
| pairing/static evidence 漏检 | 扩展 `check_artifact_report_pairing`、`check_no_static_evidence` 和 generator schema |
| duplicate/UoW/unknown 再现 | 增加 same/different digest、fault point、one-call/effect journal 和 manual fence assertion |
| blocker 被误写 ready | 扩展 blocker snapshot corpus 和 `check_blocker_truth`，保留 open/closed authority 来源 |
| B/R 被升级为 P0 | 先更新正式 scope、test denominator 和 baseline，再创建 TC；不得在 defect record 中私增 oracle |

## 10. 停审与跨 Step 审计

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 可判定 | pass | severity 与 execution status 分离，root cause 未判前不误分类 |
| VETO 一致性 | pass | 13/13 VF 触发均为 S；不允许 risk/deferred/waiver |
| P0 A 口径 | pass | 与 `EXT-L2T-005` 的 P0 A=0 一致；harness A 也阻断 evidence |
| Blocker 边界 | pass | open upstream 不自动算产品 defect；current P0 missing 仍不可放行 |
| 复验影响面 | pass | 11 类触发面均固定 family/suite/check；多个影响面取并集 |
| Full release | pass | S/P0 A 和 shared/evidence/config/dependency change 均强制新 baseline + `RT-L2T-3` |
| Closure predicate | pass | failed/new run、raw/report/check/seal/review 和 regression 全闭合 |
| Evidence authority | pass | index/projection/open-issues 不独立关闭 defect；final seal 也不自动放行 |
| 放行矩阵 | pass | open S/A、P0 missing/invalid、hard check failure 均禁止通过和有条件通过 |
| Risk handoff | pass | 仅 B/R eligible candidate 进入 Step 13；当前未接受任何实例 |
| 当前事实 | pass | 无 defect、run、artifact、closure、risk acceptance 或 release verdict 实例 |
| 上游 blocker | pass | `L2T-UP-001~009` 继续开放，无新增 blocker |

## 11. 旧正式 06 差异与回填草稿

旧 §8 只有 S/A/B 三行和旧 `ToolDefinition/ToolPolicy/ToolInvocationResult` 示例，没有 execution status 分层、VETO 全集、复验影响面、new run、closure evidence 或 hard-check release predicate；整体作为 historical material，不继承。

正式 §12 应回填：authority/状态分层、S/A/B/R 主表、direct S/P0 A 判定、影响清单与三级复验、full P0 升级条件、关闭谓词、future record 字段、放行矩阵和停审结论。必须明确当前缺陷台账未绑定，不写“缺陷为零”或“已关闭”。

## 12. 进入下一步条件

- [x] S/A/B/R 及其对结论和下一阶段的影响可判定。
- [x] defect severity、test/evidence status、blocker 和 residual 不混用。
- [x] VETO、S、当前 P0 A 和 hard checks 均不可风险接受。
- [x] 11 类触发面、三级复验、全量升级和 new baseline/run 规则闭合。
- [x] closure predicate、记录字段、防回归和放行矩阵可执行。
- [x] 无新增上游 blocker；允许进入 Step 13 风险接受与遗留项。
