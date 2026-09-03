# L2-member-images 06 验收标准 Step 12：缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.12
> 回填位置：正式 `06-验收标准.md` 第 12 章“缺陷分级、复验与放行规则”
> 方法粒度：参考 L1-governance 的“记录类型 → 严重度 → 复验矩阵 → 放行门禁 → 关闭证据 → 停审审计”链路；所有对象、TC、EV、suite、状态和 blocker 仍以 L2-member-images 的正式 `00~05` 与前序 06 Step 为准。

本文是 `full-restart` 下的 future acceptance contract。它不创建真实缺陷、修复、run、artifact、report、EV instance、digest、verdict、risk acceptance、signoff 或 release 结果；正式 `06-验收标准.md` 仍只能在 Step 15 删除 historical 内容后重建。

## 1. Step 状态、输入与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 12：定义缺陷分级、复验与放行规则 |
| 本步状态 | `completed_stop_review` |
| 用户授权 | 本轮用户“继续”视为解除 Step 11 停审并允许完成本 Step；完成后立即停审，不自动进入 Step 13。 |
| 输出文件 | `projects/L2-member-images/design-calibration/06_acceptance_step_12_defects_release.md` |
| 正式回填 | 仅提供未来 `06-验收标准.md` §12 回填草稿；当前不装配正式文档。 |
| 输入基线 | 正式 `05-测试方案.md` §11、§12、§13、§14；06 Step 4、10、11；正式 `03` §9~§16、`04` §8~§12。 |
| 当前实际事实 | 没有获授权的实现仓、送验版本、`run_id`、artifact、report、EV instance、defect、retest、closure 或 release verdict。 |
| 下一步 | 等待用户明确确认后进入 Step 13；不得在确认前创建 Step 13 文件或修改正式 `06`。 |

### 1.1 本步目标

本步固定以下五件事：

1. 把执行状态、设计 blocker、缺陷候选和 residual 分开，避免把“不能执行”写成产品失败或通过。
2. 用项目自己的 `VETO-MI-001~007`、`AC-*`、`TC-*`、`EV-*` 和 planned suite 定义 S/A/B/R。
3. 规定修复后如何以新的固定 `<run_id>` 复验，并保留首次失败的不可变证据。
4. 规定哪些状态可以进入 Step 13 的风险接受，哪些状态必须阻断验收或下一阶段。
5. 将字段、状态、port、error、配置和 phase boundary 变化回写到相应 calibration Step，禁止只改测试 oracle。

### 1.2 不做事项

- 不绑定具体缺陷平台、通知渠道、SLA、审批系统或 CI 实现。
- 不把 `planned`、`blocked`、`absent`、`not_evaluable` 直接称为 observed defect。
- 不把预期的 `Unavailable`、`Unknown`、`ContractGap` 或 `ConsumerHandoffGap` 负向分支当作失败；只有违背正式 oracle 才形成 finding。
- 不把 P1/P2、无量化 baseline、兄弟项目 pending 或未获授权执行升级为 P0 通过条件或 VETO。
- 不以 release smoke、fake、adapter marker、local `Assembled` / `Available`、日志或手工说明替代底层 raw artifact/report pair。

## 2. 输入承接与来源审计

| 输入 | 状态 | 本步承接 | 不得推导 |
|---|---|---|---|
| 验收 SOP Step 12 | 已读取 | 输出缺陷分级表、复验规则和放行规则。 | 不改变 SOP 的正式回填位置。 |
| 验收标准书写规范 §5.12 | 已读取 | 保留“级别—结论—复验”四列最小结构，并补充 R residual 及项目边界。 | 不把本表写成测试报告或缺陷系统 schema。 |
| `05-测试方案.md` §11 | 已完成 | 承接 S/A/B/C 操作标签、缺陷生命周期和复验触点；具体校准入口为 `design-calibration/05_test_plan_step_11_defects_retest.md`。 | 不把 05 的 planned 规则写成实际 defect count。 |
| `05-测试方案.md` §12~§14 | 已完成 | 承接 entry/exit、same-run 证据、回归触发和残余风险；具体校准入口为 `design-calibration/05_test_plan_step_12_entry_exit.md`、`design-calibration/05_test_plan_step_13_evidence.md`、`design-calibration/05_test_plan_step_14_regression_risks.md`。 | 不把 blocked owner lane 计入 P0 passed。 |
| 06 Step 4 | 已完成 | 承接固定 delivery/profile/fixture/run、P0 退出与暂停条件。 | 不生成真实 baseline 或 run。 |
| 06 Step 10 | 已完成 | 承接 artifact/report pairing、EV index、redaction、dependency、report-audit 和 handoff 门禁。 | 不由 acceptance 文档补造 raw evidence。 |
| 06 Step 11 | 已完成 | 承接 `VETO-MI-001~007` 触发即总体“不通过”、不可风险接受和 `absent/not_evaluable` 语义。 | 不新增 VETO 编号或实际命中。 |
| 正式 `03` / `04` | 已停审 | 承接状态、UoW、错误、幂等、配置 fail-closed 和 no-audit 约束。 | 不私造字段、状态、恢复函数、外部 schema 或产品绑定。 |
| `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md` | 仅作格式参考 | 借鉴记录类型、分层复验和关闭证据的粒度。 | 不复制其领域 ID、suite、VETO 或放行事实。 |

## 3. SOP 问题回答

| SOP 问题 | L2-member-images 裁决 |
|---|---|
| S/A/B 缺陷如何定义？ | 验收层采用 `S/A/B/R`。S 是 `VETO-MI-001~007` 或 P0 truth、边界、安全、证据完整性硬门禁被破坏；A 是未命中 VETO 但影响 P0 主线契约、状态/UoW/幂等、严格配置或可信证明的失败；B 是不影响 P0 truth 的一般、报告、维护或 P1/P2 问题；R 是范围外、future、设计未闭口或无阈值的 residual。 |
| 每级缺陷对验收结论有什么影响？ | 未关闭 S 或命中 VETO 时只能“不通过/暂停”；未关闭 A 且没有后续正式接受时不得“通过”；B/R 不进入 P0 passed，可在 Step 13 形成合格的有条件通过候选；当前 Step 不填写任何真实结论。 |
| 修复后如何复验？ | 每次复验使用新的固定 `<run_id>`，先重跑原 TC，再跑同协议/状态 family、owning suite 和受影响的 redaction/dependency/report audit；共享字段、状态、port、error、配置或 evidence tooling 变化时升级为 P0 相关全量回归。 |
| 哪些缺陷可以风险接受？ | S、VETO、过程硬门禁失败和仍影响 P0 truth 的 A 不可接受；只有已经排除 P0 影响的 B/R，或经 Step 13 严格审查的 A 候选，才可进入风险接受。 |
| 哪些缺陷必须阻断下一阶段？ | 任一 S/VETO、P0 evidence 不可裁决、redaction/dependency/report audit failed、静默 fallback、Query/Job/Inbound 反写真相、无 authority 仍生成 candidate/ref、或不合格版本进入 availability，均阻断。 |

## 4. 记录类型：状态、finding、缺陷、阻塞与 residual 分离

严重度不能直接从退出码或 Markdown 表推导。先确定记录类型，再判断是否违反正式 oracle。

| 记录类型 | 判定 | 是否等于缺陷 | 当前验收影响 | 后续处理 |
|---|---|---|---|---|
| `planned` | TC、EV、suite、check 或回归动作尚未执行。 | 否 | 没有验收结论。 | 保持规划，等待 future run。 |
| `design_blocker` | `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` 等正式设计未闭口。 | 否 | 受影响 positive lane 为 blocked；不得写成 failed 或 passed。 | blocker ledger；owner 事实变化后重开对应 Step。 |
| `dependency_blocker` | `MI-UP-001~009`、`Q-MI-001~004`、实现仓/环境/owner oracle 未提供。 | 否 | 只能 `blocked` / `gap` / `unavailable` / `not_evaluable`；不计 P0 通过分母。 | 等待合同闭合并重新基线。 |
| `expected_negative` | 正式 oracle 要求的 `Blocked`、`Unavailable`、`Unknown`、`ContractGap`、marker-only 或 zero outbound 结果。 | 否 | 有对应 raw/report 时可以通过该负向用例；不解除正向 blocker。 | 保留安全 disposition 和证据。 |
| `failed_finding` | 真实 future run 中，观察结果不符合正式 TC/AC/状态/边界 oracle。 | 待分级 | 先阻断受影响 gate；不能由 exit code 单独决定严重度。 | 归并到 canonical defect 或 execution incident。 |
| `not_evaluable` | selected actual acceptance 缺固定 baseline、raw/report pair、EV mapping 或必需审查输入。 | 不自动是缺陷 | P0 不得通过；根因未查清前暂停。 | 先修执行/证据链，再按根因分级。 |
| `residual_candidate` | 已明确不在当前 P0 denominator 的 future/P1/P2/容量/产品行为。 | 否 | 进入 Step 13 候选，不伪装成已验证。 | 记录 owner、触发条件、动作和截止点。 |

`failed_finding` 的生命周期只能沿以下方向推进；任何一步都必须保留前序记录：

```text
planned/blocked
    -> observed (future fixed run only)
    -> triaged
    -> fixed or formally accepted
    -> retested
    -> closed
```

当前没有 `observed`、`fixed`、`accepted`、`retested` 或 `closed` 实例。设计 blocker、dependency blocker 和 `absent` 不得通过手工确认跳过上述链路。

## 5. 验收层 S/A/B/R 分级表

| 级别 | 精确定义 | 本项目典型触发 | 对验收结论的影响 | 最低复验要求 | 风险接受 |
|---|---|---|---|---|---|
| `S` | 任一正式 VETO 或 P0 truth、owner/数据边界、安全、证据完整性、配置 fail-closed、阶段隔离硬红线被破坏。 | VETO-MI-001~007；secret/body/live state 泄露；无 authority 生成 candidate/digest/ref；不合格版本进入 availability；Query/Job/Inbound 写 truth；sibling compile 或 outbound 非零；静态/伪造 evidence。 | 未关闭时只能“不通过”或暂停；不得通过、不得有条件通过、不得风险接受。 | 新 run：原 TC + same family + owning blocking suite + 受影响 P0 suite；必跑 redaction、dependency、pairing、report-audit；共享真相或证据工具变化时 P0 全量。 | 不允许。 |
| `A` | 未命中 S/VETO，但 P0 主线契约、状态迁移、UoW/version/history、幂等/replay、strict config、错误映射或 P0 可信证明失败。 | 合法 transition 错误；partial commit；stale overwrite；重复动作产生第二 effect；strict config 误接受；P0 suite 的非恶意 harness/generator 缺失导致不可裁决。 | 未关闭且未获正式接受时不得通过；可导致暂停或严格条件通过候选。 | 原 TC + 同协议/状态 family + owning suite + matching artifact/report pair；按影响补 audit。 | 默认不允许；只有不影响 P0 truth、证据完整且 Step 13 明确接受时才可候选。 |
| `B` | 已证明不影响 P0 truth、VETO 或过程硬门禁的一般问题。 | safe reason/报告可读性；非阻断诊断；P1 selected-run unavailable；维护性或非核心文案。 | 不改变 P0 结论；可进入 Step 13 的有条件通过清单，但不得计入 P0 passed。 | 受影响 suite、report review 或抽样复验。 | 可候选，须记录接受人和动作。 |
| `R` | 当前范围外、future、设计未闭口、无正式阈值或 owner-controlled residual。 | `Q-MI-*` 增强；多架构、hardened base、真实 builder/registry/Artifact/consumer quality；性能/容量/SLO/retention。 | 不阻断已定义 P0，但不能被写成已验证或 readiness；是否允许下一阶段由 Step 13 决定。 | 触发正式范围/阈值变化时重新基线、回 owning Step 并重测。 | 可候选，必须有 owner、触发条件和后续动作。 |

只有在正式确认该事项不属于当前 P0 denominator 时，才可使用 `R`；仍影响当前 P0 的未闭设计或 owner 条件必须继续保持 `design_blocker` / `dependency_blocker`，不得借 `R` 降级。

### 5.1 与 `05` §11 的 `C` 标签对齐

`05-测试方案.md` §11 的 `C` 是测试方案层的纯编辑/格式标签，不作为正式验收 §12 的第四严重度。进入验收分诊时：

- 若确实只影响文档排版、拼写或可读性，归入 `B`；
- 若属于范围外或 future residual，归入 `R`；
- 若改动了正式字段、状态、证据路径、oracle 或 P0 语义，不能沿用 `C`，必须按影响重新评为 `S` 或 `A`。

这只是标签归一化，不改变 `05` 的历史记录，也不把任何当前编辑问题宣称为 observed defect。

## 6. S 级阻断判定表

| 触发条件 | 分类 | 必须动作 | 复验方向 |
|---|---|---|---|
| `VETO-MI-001~007` 任一在实际验收中命中 | `S` | 总体立即不通过；保留首次失败，不得风险接受或用新 run 覆盖。 | 对应 VETO 的原 TC、same-family、owning suite、`veto-checklist` 回指和所有适用硬门禁。 |
| secret、credential、endpoint、外部正文、live memory/checkpoint/workspace 或 provider body 进入 truth/input/artifact/report | `S` | 停止受影响 lane，修复泄露和二次报告面。 | `TC-SEC-001~002`、`TC-OBS-001~002`；`pr-config-security`、`ci-dependency-redaction`；同 run `redaction-check.md`。 |
| 未授权的 sibling compile/path dependency、私造 owner schema、outbound event/outbox/publisher/topic/delivery 或 accepted inbound 出现 | `S` | 移除越界面；恢复六类 seam、marker-only inbound 和 `ImageOutboundEventInventory::NoneAuthorized`。 | `TC-DEP-001`、`TC-EVENT-001`、`TC-IN-001~002`；`ci-dependency-redaction`、`ci-entry-contracts`。 |
| 无 authority、输入不完整或 builder/registry 结果为 failed/blocked/unknown 时生成 candidate digest/ref | `S` | 使 build/qualification lane 不通过；不得用 ACK、cache、tag 或猜测值补齐。 | `TC-CMD-004~005`、`TC-JOB-001~002/004`、`TC-STATE-004~006`、`TC-CON-004~005`；`pr-contract-domain`、`ci-integration-seams`、`nightly-risk`。 |
| provenance、applicable gate 或 Artifact handoff 不完整却宣称 `Eligible` / formal ref | `S` | 取消越界 positive 结论，保持 `Blocked`/`Gap`/`Unknown`；不得由 Artifact owner 缺口风险接受。 | `TC-CMD-006~007`、`TC-JOB-003/006`、`TC-STATE-006~007`、`TC-SEC-001~002`；qualification / gate report。 |
| 不合格版本进入 availability、历史被原地改写，或 local supply 冒充 consumer/notification/container 成功 | `S` | 停止 supply lane；恢复 append-only history 和阶段隔离。 | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-008~010`、`TC-CON-005`；`pr-boundary-no-write`、`ci-entry-contracts`、`ci-integration-seams`。 |
| Query、marker-only inbound、Job 或 observability path 反写 core truth、repair projection，或制造未定义的 receipt/result | `S` | 回滚越界写；禁止以“重试/修复”掩盖 source ownership 违规。 | `TC-QUERY-001~010`、`TC-IN-001~002`、`TC-JOB-001~006`、`TC-OBS-001~002`、`TC-STATE-018`；`pr-boundary-no-write`、`ci-entry-contracts`。 |
| report/evidence 被静态表、手写 JSON、跨 run 拼接、default pass、orphan EV 或覆盖失败 raw 伪造 | `S` | evidence gate 失败；保留 raw 失败材料，重新生成 same-run report。 | `EV-UNIT-001`、`EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001`、`EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-GATE-001` 对应 pair；`evidence-index.md`、`report-audit.md`、`gate-results.md`。 |
| strict config silent fallback、partial apply、Production 使用 TestOnly fake，或 `Assembled`/slot `Available` 升格 readiness | `S` | 配置/组合整体 fail closed；不得人工 override。 | `TC-CONFIG-001~005`、`TC-SEC-001`、`TC-OBS-001`；`pr-config-security` 与 redaction audit。 |
| selected P0 run 缺 raw/report pair 或必需审查输入 | `not_evaluable`，先不自动定级 | 阻断验收，不得写通过；先判断是环境/工具缺陷、设计 blocker 还是 integrity 伪造。若发现隐瞒/篡改则升级 `S`；普通 harness 缺陷通常归 `A`。 | 新 fixed run 的 owning suite、pairing、evidence/report audit；不允许静态补证据。 |
| 当前没有实际 run、owner pending 或设计 blocker 尚未解除 | `absent` / `blocked`，不是 S | 保持 pending；不进入 P0 通过分母，不把它写成系统失败或已验收。 | owner/设计事实变化后重新基线并执行受影响 TC。 |

## 7. 修复、复验身份与证据规则

### 7.1 新 run 和首次失败不可变规则

1. 每次 targeted、impacted 或 full retest 都必须使用新的固定 `<run_id>`，可用 `prior_run_id` 回指首次失败；禁止同 run 重跑、`latest`、best-of-run、cherry-pick 或跨 run 拼接。
2. 首次失败的 safe raw artifact、suite report、failure reason、case mapping 和审查记录必须保留；不得删除失败材料来形成绿色结果。
3. 同一复验 run 内，`artifacts/test/<run_id>/...`、`reports/runs/<run_id>/...`、EV instance、case、suite 和 gate status 必须成对且可逆向回指。
4. `reports/acceptance/handoff.md`、未来 `veto-checklist.md` 和 `risk-acceptance.md` 只能引用证据，不能生成、修补或覆盖 raw result。
5. 绿色退出码、单个日志、local trace、fake marker、`Assembled` 或 adapter ACK 均不能独立关闭缺陷。

### 7.2 关闭证据最低集合

| 级别/记录 | 关闭前必须具备 | 缺失时 |
|---|---|---|
| `S` | 首次失败引用；适用 `VETO`/AC/TC；修复后的新 run；原 TC、受影响 P0 suite、redaction/dependency/pairing/report audit；安全审查和 closure review。 | 保持 failed/blocked；禁止风险接受。 |
| `A` | 首次失败、根因/影响、修复引用、新 run 的原 TC 与受影响 suite、matching artifact/report pair、必要 audit 和 closure review。 | P0 gate 继续阻断；不能仅靠口头接受。 |
| `B` | defect/finding ref、影响范围、受影响 suite 或 report review、owner/action/deadline。 | 作为 open issue/residual，不得隐式关闭。 |
| `R` | scope/authority 依据、触发条件、owner、后续动作和重新基线条件。 | 保持 pending；不得写成已验证能力。 |
| `design_blocker` / `dependency_blocker` | blocker ref、owner/source、当前安全 disposition、重开条件。 | 继续 blocked；不创建虚假 defect closure。 |

所有关闭证据必须是脱敏、body-free、同 run 可追溯的引用；不得复制 raw secret、外部正文、live state、完整 endpoint、provider error body 或 stack trace。

## 8. 修复后复验矩阵

“原 TC + 同 family + owning suite + 受影响审计”是最低闭环。`release-controlled-smoke` 只能作代表性补充，不能替代底层 suite。

| 缺陷触点 | 原 TC / 同 family | 必跑 suite 或 check | 关闭证据方向 |
|---|---|---|---|
| typed ref、DTO、definition/mapping、baseline/revision | `TC-CMD-001~003`、`TC-STATE-001~003`，再跑同一 ref/definition family 的 missing/unknown/conflict | `pr-contract-domain`；输出变化时 `ci-dependency-redaction` / redaction check | `EV-UNIT-001` 的 case artifact + suite report。 |
| assembly、static/live、seed/component/base pin、derivation | `TC-CMD-001~003`、`TC-STATE-001~003`、`TC-SEC-001~002` | `pr-contract-domain`、`pr-config-security`、必要的 dependency/redaction check | baseline/revision case、`EV-UNIT-001`、`EV-SEC-001`。 |
| build intent、snapshot、attempt、outcome、candidate | `TC-CMD-004~005`、`TC-JOB-001~002/004`、`TC-STATE-004~006`、`TC-CON-004~005` | `pr-boundary-no-write`、`ci-integration-seams`、`nightly-risk` | `EV-SVC-001` / `EV-INT-001` / `EV-REC-001` 同 run pair。 |
| provenance、gate、eligibility、Artifact handoff | `TC-CMD-006~007`、`TC-JOB-003/006`、`TC-STATE-006~007`、`TC-SEC-001~002` | `pr-contract-domain`、`ci-integration-seams`、`ci-dependency-redaction` | `EV-UNIT-001`、`EV-INT-001`、`EV-SEC-001`、`EV-GATE-001` 与 gate report。 |
| availability、entry、rollback/retire、consumer gap | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-008~010`、`TC-CON-005` | `pr-boundary-no-write`、`ci-entry-contracts`、`ci-integration-seams` | `EV-SVC-001` / `EV-ENTRY-001` / `EV-INT-001`；history/entry report。 |
| Query visibility、pagination、freshness、strict no-write | `TC-QUERY-001~010`，加 missing/partial/stale/rebuilding/unavailable 代表项 | `pr-boundary-no-write`；必要时 `ci-entry-contracts`；write-audit/redaction check | `EV-SVC-001`、`EV-OBS-001`；同 run query report。 |
| Command/Job stop、UoW、version、history、idempotency/replay | 受影响 `TC-CMD-004~010`、`TC-JOB-001~006`、`TC-CON-001~005`、`TC-STATE-001~019` 原项及 duplicate/conflict/unknown 代表项 | `pr-boundary-no-write`、`ci-integration-seams`、`nightly-risk` | UoW/fault/case artifact + `EV-INT-001` / `EV-REC-001`。 |
| inbound marker / outbound-zero / dependency category | `TC-IN-001~002`、`TC-EVENT-001`、`TC-DEP-001`、`TC-STATE-013~019` | `ci-entry-contracts`、`ci-dependency-redaction`；dependency boundary check | `EV-ENTRY-001`、`EV-GATE-001`、`dependency-boundary.md`。 |
| config/profile/source/fake/redaction | `TC-CONFIG-001~005`、`TC-SEC-001~002`、`TC-OBS-001~002` | `pr-config-security`、`ci-dependency-redaction`；redaction check | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`。 |
| evidence index、report generation、pairing、gate status | 失败 case 原项；每个受影响 EV family 至少一项代表 case | `check_artifact_report_pairing.sh`、report-generation/report-audit、dependency/redaction checks | 同一新 run 的 `evidence-index.md`、`gate-results.md`、`report-audit.md`。 |
| release handoff / controlled smoke | 原场景 + 受影响底层 suite | `release-controlled-smoke` 及所有 required P0 suite/check | release report + lower-suite reports；不得单凭 smoke 关闭底层缺陷。 |
| `EV-PERF-001` 或容量/SLO residual | 原 benchmark 设计仅作 baseline input | 无正式阈值时不判 P0 pass/fail；阈值获权后重开 Step 3/4/9/13 | future baseline report；不能作为当前 release verdict。 |

### 8.1 回归升级条件

以下任一变化必须从 targeted/impacted 升级为受影响 P0 全量回归，并先重开对应设计校准：

- public DTO、typed ref、enum variant、状态边、port、error mapping 或 canonical input/result 改变；
- UoW 顺序、version、append/supersede、幂等/replay、projection source 或 recovery 语义改变；
- 配置 key/source/profile/fake/redaction/startup-only 语义改变；
- 依赖分类、inbound marker、outbound inventory、evidence/report schema 或 gate 判定脚本改变；
- 任一 VETO、P0 hard gate 或共享 report/evidence 工具修复；
- `MI-UP-*` / `Q-MI-*` / `DDD-*` / `PF-*` blocker 解除，导致 positive lane 从 blocked 变为可验证。

设计回写顺序必须是：先回写 `03`/`04`/`05` 对应 calibration，再更新验收 oracle，最后用新 baseline/new run 复验；不得用修改 expected 值来消除正式设计冲突。

## 9. 放行规则

| 条件 | 是否可放行 | 裁决口径 |
|---|---|---|
| 存在未关闭 `S` 或任一 `VETO-MI-*` 命中 | 否 | 只能“不通过”或暂停修复后重验；不可风险接受。 |
| redaction、dependency/zero-outbound、artifact/report pairing 或 report-audit failed | 否 | 过程硬门禁失败，不能用 handoff、人工说明或新报告覆盖。 |
| P0 selected run 为 `absent`、`blocked` 或 `not_evaluable` | 否 | 不作正向验收结论；先补合法基线/证据或记录正式 blocker。 |
| 存在未关闭 `A` | 通常否 | 只有在不影响 P0 truth、不触发 VETO、证据完整、影响范围受控且 Step 13 有正式接受人/动作/截止点时，才可作为有条件通过候选；本 Step 不填写接受事实。 |
| 仅存在已排除 P0 影响的 `B` | 可作为有条件通过候选 | 进入 Step 13 风险清单，不能计入 P0 passed 或伪造全绿。 |
| 仅存在合格的 `R` residual | 视 Step 13/14 | 必须记录范围、owner、触发条件和后续动作；未获接受前保持 pending。 |
| P1 selected-run unavailable、owner positive lane pending | 不构成 P0 失败，但不能作为通过依据 | 记 `blocked` / `gap` / `unavailable` / residual；不得把 fake、adapter、local entry 或 marker 升格为 readiness。 |
| 无正式性能/容量/SLO 阈值 | 不作数值放行结论 | `EV-PERF-001` 仅 baseline input；若本次交付要求阈值，先重开基线和范围。 |
| `release-controlled-smoke` 通过但底层 P0 suite 缺失或未配对 | 否 | smoke 不能替代 contract/domain/no-write/config/dependency/report gate。 |

三值结论仍只使用“通过 / 有条件通过 / 不通过”。“基本通过”“原则上通过”“后面补一下”等措辞不构成放行。

## 10. 跨 Step 一致性与防越权审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| S/A/B/R 是否可判定 | `pass_with_explicit_blockers` | S/VETO、A/P0、B/一般、R/residual 已按影响区分；实际分诊需 future evidence。 |
| VETO 是否不可降级 | `pass` | `VETO-MI-001~007` 固定为 S；不得由风险接受或新 run 覆盖。 |
| `failed`、`blocked`、`absent`、`not_evaluable` 是否分离 | `pass` | 缺 run/owner pending 不自动变成 defect 或 VETO；selected P0 不可裁决仍阻断放行。 |
| 复验是否同一 provenance 链 | `pass_with_explicit_blockers` | 新 run、保留首次失败、同 run artifact/report/EV pair 规则已固定；当前没有实例。 |
| release smoke 是否越权 | `pass` | 明确只能补充代表性闭环，不能替代底层 P0 suite。 |
| B/R 是否被误写为 P0 passed | `pass` | 明确进入 Step 13 风险清单，不计入 P0 分母。 |
| blocker 是否被误写为 observed defect | `pass` | `DDD-*`、`MI-UP-*`、`Q-MI-*`、`PF-*` 保持 blocker/pending。 |
| 关闭证据是否可审计 | `pass_with_explicit_blockers` | 需要 future defect ref、first/new run、artifact/report、audit 和 review；当前均 absent。 |
| 是否生成实际缺陷或放行结论 | `absent` | 本 Step 没有 observed defect、retest、closure、verdict、signoff 或 readiness。 |

## 11. 正式 `06-验收标准.md` §12 回填草稿（当前禁止装配）

只有 Step 1~14 完成且 Step 15 获准后，才可将以下语义装配到正式文档：

```md
## 12. 缺陷分级、复验与放行规则

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_release.md`
>
> 延伸阅读：
> - 建议继续阅读该中间产物的“记录类型”“验收层 S/A/B/R 分级表”“S 级阻断判定表”“修复后复验矩阵”“放行规则”和“跨 Step 一致性与防越权审计”小节。

验收层使用 `S/A/B/R`。`S` 覆盖 `VETO-MI-001~007` 及 P0 truth、边界、安全、证据完整性和配置 fail-closed 硬门禁；`A` 覆盖未命中 VETO 但影响 P0 主线可信证明的契约/一致性失败；`B` 覆盖不影响 P0 的一般问题；`R` 表示范围外、future、设计未闭口或无正式阈值的 residual。`05` 的测试层 `C` 标签在本章按影响归一为 `B` 或 `R`，若触及 P0 语义则重新评为 `S/A`。

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S | VETO 或 P0 truth/安全/证据/依赖/阶段红线破坏 | 未关闭时只能不通过或暂停；不可风险接受 | 新固定 run 跑原 TC、同 family、owning blocking suite、相关 P0 与 redaction/dependency/report audit |
| A | 未命中 VETO 的 P0 主线或可信证明失败 | 未关闭且未正式接受时不得通过；严格条件通过仅是候选 | 新固定 run 跑原 TC、相关 suite、artifact/report pair 和受影响 audit |
| B | 不影响 P0 的一般、报告或维护问题 | 不阻断 P0；可进入风险清单 | 受影响 suite、report review 或抽样复验 |
| R | 范围外、future、设计未闭口或无阈值 residual | 不得伪装成已验证；由风险接受决定后续 | 范围/阈值变化后重新基线并回 owning Step |

缺 run、owner pending 或设计 blocker 本身保持 `absent` / `blocked` / `not_evaluable`，不是自动 VETO；但 P0 selected acceptance 在这些状态下不得通过。每次修复复验都必须使用新的固定 `<run_id>`，保留首次失败并形成同 run 的 raw artifact、suite report、evidence index、gate/report audit 和 closure review。`release-controlled-smoke` 只能补充，不能替代底层 P0 suite。

未关闭 S/VETO、过程硬门禁失败或 P0 evidence 不可裁决时不得放行；A 只有在不影响 P0 truth、证据完整并经后续正式风险接受时才可成为有条件通过候选；B/R 不得计入 P0 passed。
```

## 12. Blocker、待确认与当前实际状态

| blocker / 待确认项 | 对本 Step 的影响 | 当前处理与重开条件 |
|---|---|---|
| `DDD-S9-B01/B02` | Command/Job 正向 mutation、stored result 和 replay 仍不能形成实际 defect closure。 | 仅保留 zero-effect/no-write 负向断言；设计闭口后重开 build/UoW/idempotency 复验。 |
| `DDD-S11-B03` | availability transition 的正向持久化/历史验证受阻。 | 保留 append-only/不覆盖规则；owner contract 闭合后重开 supply suite。 |
| `DDD-S13-OPEN-01/02` | in-flight、replay、namespace 语义未闭。 | 不私加 lease/TTL/cleanup/AlreadyInProgress；闭口后重建复验矩阵。 |
| `PF-UNAVAILABLE-RECOVERY` | projection `Unavailable` 无正式 recovery edge。 | 只允许 blocked/no-repair；不得把 unavailable 修成 Fresh/Rebuilding。 |
| `MI-UP-001~009` | member-service、member、method、Core、event、seed、Artifact、Sandbox 等 owner positive lane 未闭。 | 保持 `blocked/gap/unknown/unavailable`；owner 正式合同变化后重开受影响 Step。 |
| `Q-MI-001~004` | 增强范围、产品绑定、证据 kind/priority 未定。 | 归 R residual；不进入 P0 分母；正式启用后重开范围/基线/测试。 |
| 无实现仓、真实环境、delivery/profile/fixture/run | 没有 actual defect/retest/release 可供裁决。 | 当前均 `absent`；不得生成实例或结论。 |
| 无量化性能/容量/SLO 阈值 | 不能作数值通过或失败。 | `EV-PERF-001` 仅 baseline input；阈值确权后重开 Step 3/4/9/13。 |

当前事实声明：本 Step 只完成设计规则，未观察到任何实际 defect，也没有关闭、风险接受、复验、放行或 readiness 结果。所有 actual defect/retest/release 状态均为 `absent / not_evaluable`，不代表系统通过或失败。

## 13. 自检与 Step 门禁

### 13.1 自检清单

- [x] 已读取验收 Step 12 SOP、§5.12 书写规范、项目 05 §11~§14、06 Step 10/11 和 L1-governance Step 12。
- [x] 已区分 planned、design/dependency blocker、expected negative、finding、not_evaluable 和 residual。
- [x] 已用项目正式 `VETO-MI-001~007`、TC、EV、suite、状态和路径定义 S 级阻断。
- [x] 已使用 S/A/B/R，并明确 `05` 的 C 只作测试层标签，不能绕过验收严重度。
- [x] 已固定新 run、首次失败保留、同 run artifact/report pair、redaction/dependency/report audit 和 closure review 规则。
- [x] 已明确 targeted/impacted/full 回归升级条件，且 release smoke 不替代底层 suite。
- [x] 已明确 S/VETO 不可风险接受，B/R 不计入 P0 passed，A 仅为严格条件候选。
- [x] 未创建真实 defect、run、artifact、report、EV instance、digest、verdict、signoff、readiness 或实现材料。
- [x] 未修改正式 `06-验收标准.md`、`07-实施计划.md` 或任何上游/兄弟项目文档。

### 13.2 Step 停审结论

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷对验收结论的影响可判定 | `pass` | S/A/B/R 与状态/记录类型边界已固定。 |
| 缺陷规则与 VETO 一致 | `pass` | VETO 触发即 S、总体不通过且不可风险接受。 |
| 复验和关闭证据可回指 | `pass_with_explicit_blockers` | TC/EV/suite/path 规划已固定；实际 run 和 defect authority 仍 absent。 |
| 放行条件可判定 | `pass_with_explicit_blockers` | 三值规则、P0 evidence、B/R residual 和 A 候选边界已固定；Step 13/14 尚未定义接受与签署事实。 |
| 当前实际 defect/retest/release | `absent` | 未授权执行，不生成任何实际结果。 |
| 可进入 Step 13 | `pending_user_review` | 本 Step 完成后停审；必须等待用户再次明确确认。 |

```text
step_12_status = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = pending_user_review_for_step_13
severity_contract = S/A/B/R
veto_ids = VETO-MI-001..007
actual_defect_instance = absent
actual_retest = absent
actual_release_verdict = absent
formal_06_write_allowed = false_until_step_15
step_13_creation_allowed = false_until_user_confirmation
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
