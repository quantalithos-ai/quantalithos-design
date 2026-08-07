# 06 验收标准校准 · Step 4 进入、暂停与退出条件

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4
- 回填章节：正式 `06-验收标准.md` §4

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 3、正式 05 §12~§14、16 项 residual
- [x] SOP 问题回答：基线、证据、缺陷、退出、风险
- [x] 当前材料 / 旧文档诊断：消除空 checklist、未进入与不通过混同
- [x] 设计取舍：拆分 preflight、formal entry、pause/not-decidable、exit/closure
- [x] 结构化中间产物：过程状态、进入/退出条件、暂停矩阵和当前状态
- [x] 复杂度判断 / 是否拆模块或附录：不拆；缺陷/风险细节后移 Step 12/13
- [x] 回填草稿：形成正式 §4 条件清单
- [x] 自检与进入下一步条件：每条条件有 owner、证据和失败语义

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 3 baseline tuple | required baseline 未绑定时不得进入实际验收；single release seal / manifest 是 test evidence entry |
| 05 §12.1 | test execution entry 必须有 current source、TC/DS/profile、dependency/redaction/check 和 severity rule |
| 05 §12.2 | full denominator、11 P0 suites/checks、VETO、pairing、S/A、structural NFR 和 forbidden claims |
| 05 §12.3 | design/config 缺口、capability missing、injection unavailable、S/redaction/pairing 失败和 P1 unavailable 的分流 |
| 05 §14 | full regression triggers、new run、16 residual 和 06 handoff |

## 3. SOP 问题回答

1. **开始验收前哪些基线必须确认？**

   回答：Step 3 baseline tuple 的 scope、formal design source set、implementation/delivery、`ci-test` config/data/blocker snapshot、release run/seal/index/manifest 及 review source tuple均必须绑定且相互一致。未绑定不是“不通过”实例，而是 `not_entered`。

2. **哪些测试证据必须先生成？**

   回答：同一 release run 的 complete raw artifact、11 P0 suite reports、same-run release-local-smoke aggregate、11 mandatory check JSON/report、successful pre-check index、passed final seal、四份 staged/fixed acceptance projection 和 manifest；每项都须 digest/redaction/pairing 验证。`pending_review` slot 可以进入人工 review，但不能自动通过对应门禁。

3. **哪些缺陷会阻断进入验收？**

   回答：已知 S、触发 VF、设计/schema 无法绑定、delivery/source 不可定位、release seal invalid/failed、redaction/dependency/pairing/static-evidence 失败、P0 denominator 缺失、scope 中 P0 result 为 blocked/not_evaluated/cancelled，均阻断 formal entry 或使已提交送验失败。A 缺陷若影响 P0 truth/security/consistency/evidence，也必须修复并新 run；其他 A 的风险资格由 Step 12/13 判定。

4. **退出验收需要哪些结论？**

   回答：`AC-L2T-001~039` 全部有三值维度裁决支撑，`VF-L2T-001~013` 全部明确未触发，P0 evidence gate 完整，缺陷与复验闭合，所有 residual 有 disposition，允许有条件通过的风险均有 authorized acceptance，最终总体结论和角色签署已完成。不能以“待补”退出。

5. **哪些风险必须先接受？**

   回答：只有符合 Step 13 eligible residual predicate、不会触发 VF/P0 hard gate、不会掩盖 invalid/unavailable evidence、且具备影响/缓解/owner/acceptor/deadline/reopen trigger 的 residual 才能支撑有条件通过。没有接受人的风险只能保持 open，不能满足退出条件。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 | 当前修正 |
|---|---|---|---|
| 旧 06 §3.1 | 进入条件仅 4 条泛化 checklist | 无 source/seal/profile/run/evidence predicate | 承接 Step 3 完整 baseline tuple |
| 旧 06 §3.2 | 退出条件把“门禁通过”写成空勾选项 | 没有缺失、失败、pending、risk 的状态语义 | 定义 per-item closed disposition 和 exit predicate |
| 旧 06 | 未区分尚未送验、暂停、不可裁决、不通过 | 容易把设计完成误写成验收失败/通过 | 引入 process state，结论仍只保留三值 |
| 旧 06 | P1 unavailable 可能阻断所有验收 | local P0 被外部 owner 长期卡死 | 只在 scope 显式纳入 positive 时影响该 scope |
| 旧 06 | 风险“记录”即可退出 | 无接受人也可能有条件通过 | 强制 risk acceptance predicate 和签署 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 过程状态 | 无 | `not_entered/in_review/paused/not_decidable/closed` | 区分流程状态与三值 verdict |
| 进入 | 文档和测试报告存在 | immutable baseline + acceptable release seal + no blocking defect | 可判定 |
| 暂停 | 未定义 | source/schema/evidence/review drift 和 external scope conflict 有明确处理 | 防止带病继续 |
| 退出 | 勾完表格 | 全 AC/VF/evidence/defect/risk/signoff predicate | 避免“基本完成” |
| 当前状态 | 空白 | `not_entered`，原因可定位 | 不伪造实际验收 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 缺 evidence 直接判“不通过” | 严格 | 尚未送验也被误作失败记录 | 不采用；未送验=`not_entered` |
| 允许边生成 evidence 边验收 | 提前发现问题 | baseline 漂移、跨 run 补证和循环 writer 风险 | 不采用 |
| formal entry 前冻结 tuple，进入后漂移即暂停并新 baseline | 裁决可复现 | 需要重新运行受影响门禁 | 采用 |

## 7. 结构化中间产物

### 7.1 Acceptance process state

| State | 含义 | 允许动作 | 禁止声明 |
|---|---|---|---|
| `not_entered` | baseline/evidence/送验尚未成立 | 补交付、执行 release、修复输入 | pass/fail/signoff |
| `in_review` | entry predicate 全部成立，正在逐门禁裁决 | 只读已捕获 evidence、追加 review、记录 defect/risk proposal | 改写 seal/index/fixed snapshot |
| `paused` | 可恢复的输入/设计/证据/评审缺口 | 修复 owner source、形成新 baseline/new run 或补 authorized review | 用旧 tuple 继续裁决 |
| `not_decidable` | required fact 未绑定或冲突且当前无合法替代 | 记录 blocker和所需 reopening evidence | 把 unknown 当 pass/fail |
| `closed` | 所有 exit predicate 成立并形成三值总体结论和签署 | 进入 07 仅按结论允许范围 | 事后覆盖；变化须新验收 instance |

这些是验收过程状态，不是书写规范规定的总体结论；总体结论仍只能是通过/有条件通过/不通过。

### 7.2 送验前置条件

| ID | 条件 | 检查入口 | 不满足处理 |
|---|---|---|---|
| `ENT-L2T-001` | scope manifest 明确 P0/P1/P2/excluded，无 hidden optional denominator | baseline scope ref/digest | `not_entered` |
| `ENT-L2T-002` | 正式 `00~06` source set immutable 且 digest 可验证 | design baseline | `not_entered`;`L2T-RR-007` |
| `ENT-L2T-003` | implementation source 和 delivery ref 可定位、可重现 | source/delivery baseline | `not_entered`;`L2T-RR-012` |
| `ENT-L2T-004` | `ci-test` config safe digest、dataset manifest、blocked ledger 固定 | run metadata | `not_entered`/invalid |
| `ENT-L2T-005` | release run uses full 234 concrete denominator through 11 owning suites；无 hidden filter | context/case manifest check | invalid/failed send-off |
| `ENT-L2T-006` | matching release seal 满足 Step 3 predicate | gate-summary parser | `not_entered` if no send-off；submitted invalid => no pass |
| `ENT-L2T-007` | index/seal/manifest/staged+fixed projection snapshot 完整且 redaction clean | Step 3 consumer algorithm | invalid evidence / pause |
| `ENT-L2T-008` | 无 open S/VF-triggering defect；P0 A 已修复并新 run | defect/retest records | block entry |
| `ENT-L2T-009` | acceptance owner、required reviewer roles 和 risk/signoff authority 可定位 | review contract | `not_decidable` |

### 7.3 Formal entry predicate

```text
formal_entry :=
  ENT-L2T-001..009 all satisfied
  AND every required final evidence slot is eligible or explicitly pending_review
  AND no slot is invalid/ineligible/unavailable for a P0 hard gate
  AND manifest snapshot remains stable during capture
```

`pending_review` 只允许进入相应人工审查，不满足 gate pass。若 scope 中仅 P1 positive 为 unavailable，而 P0 release seal完整，P0 local acceptance 可进入；P1 继续 residual/conditional。

### 7.4 暂停 / 不可裁决 / 失败分流

| Trigger | Process disposition | Verdict impact | Recovery |
|---|---|---|---|
| formal design field/state/port 无法定位 | `paused` | 对应 gate 不可判定，不得通过 | 回 owning 00~05 Step；new baseline/run |
| baseline tuple 或 manifest double-read drift | `paused` | current snapshot invalid | 新 baseline / release run |
| release seal/index schema/digest/path/pairing invalid | submitted scope cannot pass | evidence gate/VETO 可能不通过 | 修复 generator/runner；new run |
| semantic test failure / `ineligible` | `in_review` 可记录 defect | 对应 P0 gate failed；最终不得通过 | fix + impact retest/new run |
| P0 `unavailable`/`not_evaluated`/`cancelled` | `paused` or submitted failure | P0 不可通过 | complete denominator/new run |
| P1 positive unavailable and not scoped P0 | continue P0 review | residual only；no readiness claim | owner closure then separate qualification |
| `pending_review` | `in_review` | gate remains pending | authorized review block;不能改 machine status |
| any VF triggered | continue only to record finding | forces overall 不通过 | fix + mandatory retest/new acceptance |
| authorized signer/acceptor missing | `not_decidable` for conditional/closure | cannot close as conditional pass | assign authorized role, append signed record |

### 7.5 退出条件

| ID | 条件 | 通过 / 有条件通过要求 |
|---|---|---|
| `EXT-L2T-001` | `AC-L2T-001~039` 逐项有 closed gate disposition | 通过：全部 P0 pass；有条件：P0 mainline pass，仅 eligible accepted residual |
| `EXT-L2T-002` | `VF-L2T-001~013` 逐项检查 | 全部明确未触发；任何触发只能不通过 |
| `EXT-L2T-003` | evidence completeness | matching passed release seal，required item 无 invalid/ineligible/unavailable/pending |
| `EXT-L2T-004` | redaction/dependency/pairing/no-static/blocker truth | 全部 passed，不能风险接受 |
| `EXT-L2T-005` | defect status | S=0；P0 A=0；其它 defect 有 closed/retest/risk disposition |
| `EXT-L2T-006` | retest | 修复后按 impact manifest 在新 run 完成，旧 failure 保留 |
| `EXT-L2T-007` | residual | 16 residual 和新增项均有 owner、影响、mitigation、reopen；用于条件通过者已 authorized accept |
| `EXT-L2T-008` | scope-specific P1 | 未纳入者明确 excluded/residual；纳入者有独立 qualification，不冒充 P0 release |
| `EXT-L2T-009` | final package | baseline、captured evidence snapshot、handoff/VETO/risk/issues、review blocks 和 decision record 可回链 |
| `EXT-L2T-010` | final decision/signoff | 使用唯一三值，required roles 已签署且风险接受不被验收签署隐含替代 |

### 7.6 当前状态

| 项 | 当前值 | 依据 |
|---|---|---|
| process state | `not_entered` | Step 3 implementation/delivery/run/digest/review tuple 均 `not_bound` |
| current verdict | none | 未执行实际验收，不允许填三值实例 |
| upstream blocker | no new blocker | `L2T-UP-001~009` 继续开放并影响 P1 positive |
| document workflow | Step 4 completed | 只表示验收标准设计推进，不表示实际送验进入 |

## 8. 回填草稿

正式 §4 应包含 process state、送验前置、formal entry、暂停/不可裁决分流、退出条件和当前状态。当前明确 `not_entered`、无 verdict。进入实际验收必须满足 immutable baseline、完整 release seal/projection、无 S/VF trigger 和可定位 review authority；退出必须完成全部 AC/VF/evidence/defect/risk/signoff。P1 unavailable 只有在未作为 P0 scope 时不阻塞 local review，但不得产生 readiness 声明。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| acceptance/reviewer/risk signer role assignment | formal entry 和 closure | Step 14 固定角色责任；当前无实例 |
| delivery and release run | ENT-L2T-003~007 | implementation/test 后生成；本文不伪造 |
| conditional provider scope | P1 entry/exit | 默认不进入 P0；scope manifest 显式绑定 |

## 10. 进入下一步条件

- [x] 送验前置、formal entry、暂停、不可裁决和退出条件均可判定。
- [x] process state 与三值 verdict 分离，当前状态诚实记录为 `not_entered`。
- [x] P0 hard gate、P1 conditional 和 P2 future 的缺失影响一致。
- [x] 无空勾选被误写成已满足条件。
- [x] 允许进入 Step 5：逐项定义功能验收门禁。
