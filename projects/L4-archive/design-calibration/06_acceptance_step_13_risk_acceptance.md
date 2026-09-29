# Step 13. 定义风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13\
> 正式回填：`06-验收标准.md` §13\
> 日期：2026-09-14\
> 状态：`completed / risk_eligibility_and_all_current_dispositions_closed_no_acceptance_instances / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 13：定义风险接受与遗留项 |
| 目标 | 固定哪些 residual 才可能支持有条件通过，逐项裁决 12 个 upstream/architecture blocker 与 6 个 local pending，并定义风险接受的 authority、字段、到期与再触发规则 |
| gate_status | `completed / risk_eligibility_and_all_current_dispositions_closed_no_acceptance_instances` |
| gate_reason | 可接受资格、不可接受红线、18 个当前 blocker/pending 的 disposition、future P1/P2 residual 类别、risk record/review/expiry 合同均闭合；当前无具名接受人、证据、期限或接受实例 |
| next_allowed_action | 按连续授权创建并完成 Step 14 |
| source_files | 正式 00 §15；01/03/04 risks；05 §11～14；06 Step 4/9～12；验收 SOP/规范；L1-governance Step 13 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 13A | 可接受资格与不可接受项 | done | P0/VETO/S/formal/evidence 不可进入 residual |
| 13B | 18 个当前事项逐项 disposition | done | owner、影响、动作、是否可接受明确 |
| 13C | future residual 类别 | done | P1/P2/future 与当前 P0 分母隔离 |
| 13D | 风险记录、authority、review、expiry | done | 具名接受人、basis、动作、期限/触发、再验齐全 |
| 13E | 风险越权审计 | done | 无 Archive 自批、无 blocker closure、无接受实例伪造 |

## 2. 风险接受的资格边界

风险接受不是关闭 blocker、修改测试结果或绕过 P0 的机制。一个事项只有同时满足以下条件，才有资格成为未来“有条件通过”的 residual：

1. 不命中 `VETO-AR-001～010`，不是 S，也不是 required P0 formal seam/baseline/evidence/implementation prerequisite。
2. 所有受影响 P0 AC 已由 qualified fixed-run evidence 独立通过；风险只影响明确列入的 P1/P2/future/operation 范围，或已证明不污染 P0 的 B/极少数 A。
3. 影响边界、不可接受边界和证明上限均可写成可复查断言；“影响未知”不具资格。
4. 有来自正式权限边界之外的具名 risk owner 与具名 acceptor；Archive runtime、报告脚本、本文作者和测试 fake 均不是接受 authority。
5. 有 immutable baseline/run/evidence refs、后续动作、责任人、截止时间或触发条件、复验范围、follow-up 入口和自动失效条件。
6. `reports/acceptance/risk-acceptance.md` 已经过具名 review，且不修改 raw、EV、defect、VETO 或 owner truth。

任一条件缺失时，该事项只能保持 `blocked/pending/proposed`，不能支撑有条件通过。当前所有 risk acceptance instance 均为 0。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可能支持有条件通过？ | 不在本轮 P0/release scope 的 selected provider/SDK/product hardening、经正式 scope 排除的 P2 measured/long-run/DR、验收复验窗口之后的 test-evidence retention 操作，以及证据已证明不触 P0 红线的 B/极少数 A。 |
| 哪些不能接受？ | 10 个 VETO、S、任一 required P0 failed/blocked/infra/not_run、owner/authority/finality/restore formal seam、生产 store/codec/cursor/config、证据缺失/伪造、泄漏、Query 写、production fake、未授权 outbound，以及 Archive 产品 retention/hold/delete/destroy authority 缺口。 |
| 每个风险的接受人是谁？ | 本文只固定需要的 authority role，真实姓名必须由未来送验填写。产品范围由正式产品/验收 owner；架构依赖由架构 owner；安全/数据由对应 owner；records/evidence retention 由 governance/records owner。Archive 自身不能接受上游业务真相或治理授权风险。 |
| 后续动作和截止时间是什么？ | 每个实例必须有具体 action、owner、绝对 deadline 或可自动判断 trigger、required regression 与 closure proof；本文不私造日期。 |
| 是否需要同步实施计划或问题记录？ | 是。实现/测试项进入未来 07 boundary/ledger；跨仓合同指向 owning project issue/decision；运维/retention/DR 指向正式运维或 records owner。只有文档文本而无 follow-up ref 不合格。 |

## 4. Historical material 诊断与裁决取舍

| 历史/宽松口径 | 当前处置 | 理由 |
|---|---|---|
| “风险已知，可先上线” | 必须先证明不影响 P0，再具名接受；否则 blocked/不通过 | 已知不等于可接受 |
| 默认 7 年/hot-warm-cold | 产品 retention/storage authority 未闭合，不可风险接受为既成规则 | Archive 无决策权 |
| 外部接缝以后补 | required formal seam 保持 P0 blocked | fake/local negative 不证明价值链 |
| 无 workload 就沿用旧 P95/RTO | P2 pending，不作数字 verdict/readiness | 无 authority 的阈值不可裁决 |
| 签署表等同接受全部风险 | 每项独立 risk record；最终签署只确认清单 | 防 blanket acceptance |
| “owner 待定/日期待定”可有条件通过 | 不可；字段待定只说明没有接受实例 | 可执行性要求 |

## 5. 当前 18 个 blocker / pending 的风险 disposition

以下表不“接受”任何事项，也不改变项目台账状态。`不可接受`表示不得用 risk acceptance 关闭其对适用 P0 的阻断；`future residual candidate` 也只表示在严格缩小 scope、P0 全通过后可另建实例，当前仍未接受。

| ID | owner / 影响 | 当前 P0 / scope disposition | 是否可支撑当前有条件通过 | 解锁或后续动作 |
|---|---|---|---|---|
| `AR-UP-001` | 各 L1 truth owner；snapshot/export/version/fence/coverage | required source formal seam，P0 blocked | 否 | 每 target 正式合同、vector、binding、formal run |
| `AR-UP-002` | `L1-work`；project lifecycle trigger/restore handoff | owner state/command seam，P0 blocked；Archive 不推断 archived/restored | 否 | `L1-work` 正式决定/receiver 合同与 formal run |
| `AR-UP-003` | `L1-governance`/明确 owner；retention/hold/delete/risk | governance authority，P0 fail-closed | 否 | current decision/hold/delete authority 与冲突/过期语义闭合 |
| `AR-UP-004` | integrity/security/schema owner 待正式指定；digest/signature/key/compression/evolution | integrity/compatibility P0 blocked；test SHA-256 不关闭 | 否 | 具名 owner、算法/版本/target/verify/probe 合同与 formal run |
| `AR-UP-005` | storage/operations owner 待指定；location/tier/commit/retrieval | placement/retrieval finality P0 blocked | 否 | provider-neutral formal contract、binding、commit/probe/cleanup vector |
| `AR-UP-006` | `L1-artifact`；body/ref/lineage closure | material closure/restore P0 blocked；ref set 不等 material | 否 | owner-approved material/ref/lineage/compatibility 合同与 formal run |
| `AR-UP-007` | `L4-observability`；audit/evidence material | required audit source/handoff P0 blocked；telemetry 不替代 | 否 | coverage/redaction/provenance/verification/handoff 合同与 formal run |
| `AR-UP-008` | `L1-workspace`；archive read/export | source class P0 seam blocked；projection永久 Auxiliary | 否 | 正式受限 export contract；不得补 canonical source |
| `AR-UP-009` | 各 truth owner；restore receiver outcome/probe/compensation | owner-specific restore finality P0 blocked | 否 | 每 owner receiver/schema/commit/probe/compensation formal vector |
| `AR-ARCH-001` | 全局依赖标准 + `L0-sdk` owner；依赖方向冲突 | P0 architecture blocker；Archive→SDK compile 禁止 | 否 | owning docs 对齐并以 actual graph/contract test 核验 |
| `AR-HLD-Q-001` | Archive architecture + Bus/consumer owner；outbound family/outbox 未定 | 当前 P0 要求“完全不存在”；open decision 不赋予 outbound capability | 否，不能接受为 outbound readiness；只有 absence 通过时可作为 future non-scope 决策保留 | 若未来解锁，先回 02/03/04/05/06 重审对象、UoW、topic/publisher/delivery/证据；当前保持 blocked candidate |
| `AR-HLD-Q-002` | workload/product/acceptance/operations owner；规模、时延、容量、RTO/RPO | P0 只验 structural bounds；数值维度 P2 `blocked/not_run` | 不能支撑任何数值或 DR readiness；可在“仅 qualitative P0”scope 下作为 future residual candidate | 正式 workload、环境、方法、窗口、阈值与 owner 后执行 measured run |
| `AR-03-LOCAL-001` | Archive protocol/config/security owner；operation codec/digest | mutation idempotency P0 production prerequisite | 否 | 04 binding/security + implementation parity/restart evidence |
| `AR-03-LOCAL-002` | Archive query/store/security owner；cursor mapping | 五 Query continuation P0 prerequisite | 否 | authenticated codec 或 durable map + visibility/restart/security test |
| `AR-03-LOCAL-003` | Archive infra/implementation owner；durable store/UoW | atomicity/CAS/read-set/probe/fence/restart P0 prerequisite | 否 | 真实 adapter/binding + fault/concurrency/restart proof |
| `AR-03-LOCAL-004` | Archive config + workload/environment owner；完整 schema/refs/numbers | production assembly/job P0 prerequisite；无 implicit default | 否 | 55-key schema、required refs/values、relation、secret resolution 全闭合 |
| `AR-03-LOCAL-005` | Archive observability/operations owner；telemetry/material binding | safe signal/formal material/evidence integration 适用 P0 prerequisite | 否；optional sink 本身可降级，但不能关闭 material/evidence 缺口 | runtime binding、redaction、non-interference、material handoff formal proof |
| `AR-03-LOCAL-006` | L4-archive project/implementation owner；实现、运行与后续文档 | 当前无实现/真实测试/验收，实际 entry 不成立 | 否 | 完成正式 07 planned boundaries 后另获实施授权，真实实现与 fixed run |

## 6. Future residual 类别（非接受实例）

| residual 类别 | 何时才有资格 | 不得声称 | 责任 / 接受 authority 类别 | 当前状态 |
|---|---|---|---|---|
| selected storage/integrity/KMS/compression hardening | 抽象 P0 formal seam 已真实通过，且具体产品不在本轮 release scope | 未测 provider 已兼容、安全或 ready | integration owner / architecture+security acceptance authority | future candidate；无实例 |
| selected SDK/client/product consumer compatibility | `AR-ARCH-001` 已关闭，public boundary P0 通过，且消费者不在本轮 scope | Archive→SDK compile、SDK 有 owner write 权 | product/consumer owner / product acceptance authority | future candidate；无实例 |
| measured latency/throughput/capacity/RTO/RPO | `AR-HLD-Q-002` 的 authority、方法、阈值已形成；若仍明确不在当前 P0 scope | 数值达标、DR/production readiness | workload/operations owner / product+acceptance authority | P2 pending；无实例 |
| long-run/cross-region/DR 或未来 UI/operations workflow | 正式需求仍排除，且不影响当前 P0 contract/finality/operations safety | 能力已存在或发布可用 | product/operations owner / acceptance authority | future/non-scope；无实例 |
| test-evidence retention 超出送验与缺陷复验窗口 | 当前送验/复验证据已保证不可删除，长期 records policy 尚待正式 owner | Archive Bundle retention、legal hold/delete 已满足 | records/operations owner / governance or records acceptor | future candidate；无实例 |
| B 或证据界定的极少数 A defect | 所有 P0 AC/formal/VETO/evidence 均独立通过，影响可严格界定且不触红线 | 缺陷已修复、P0 failure 可忽略 | defect owner / formal acceptance authority；敏感面需对应 owner | future candidate；无实例 |

若上述任一能力被 release baseline、正式需求或进入条件纳入，则立即失去 residual 资格，必须按相应 P0/P1 required gate 执行，不能沿用旧接受。

## 7. 风险接受记录与 authority 合同

### 7.1 `reports/acceptance/risk-acceptance.md` 最小字段

| 字段 | 要求 |
|---|---|
| identity/status | stable `risk_id`；`proposed|under_review|accepted|rejected|expired|superseded`；不得默认 accepted |
| baseline | design/source/config/target identity、primary/supplemental fixed run IDs、scope/release identity |
| classification | A/B/R 或 P1/P2/future；明确为何不是 P0 blocker/VETO/S |
| impact | 受影响能力、用户/数据/运维面、worst safe consequence 与明确不受影响的 P0 AC |
| evidence | same-run EV/report/defect refs 与 digest；证明范围有限、P0 不受污染 |
| exclusions | 检查 `VETO-AR-001～010`、12 RL、formal seam、evidence/security 边界均未被绕过 |
| action | 后续动作、required regression/verification、follow-up issue/07 boundary/owning project/ops doc ref |
| responsibility | 具名 owner；具名 acceptor及其正式 authority；需要时 architecture/security/data/records co-reviewer |
| time | proposed/reviewed/accepted 时间、绝对 deadline 或可判定 trigger、expiry 与 review cadence |
| re-entry | 到期、scope/baseline/owner/threshold/evidence变化或事件发生时的自动失效与重新验收条件 |
| review | reviewer identity/role/time、结论/争议；review 不得改 raw/VETO/defect |

### 7.2 Authority 边界

| 风险主题 | 必需 authority | Archive / 本文不得做的事 |
|---|---|---|
| product scope / P1/P2 | 正式产品/验收 owner | 自行把 P0 改 P1/P2 |
| architecture/dependency | architecture/标准 owner | 接受反向 compile/shared DB/Tx |
| security/data/redaction | security/data owner + acceptance owner | 接受泄漏、hidden disclosure、owner write |
| retention/hold/delete/destroy | governance/records/legal 明确 owner | 自定期限、hold 例外、销毁授权或风险接受 |
| restore owner finality | 对应 truth owner/receiver contract owner | 替 owner 接受 commit-unknown 或声明 restored |
| evidence retention/operations | records/operations owner | 用 test report 代 records decision |
| project implementation defect | implementation/test owner + acceptance owner | 用 commit、日志或自审替代 fixed-run proof |

### 7.3 到期、撤销与再触发

已接受实例在以下任一条件发生时自动失效为 `expired/under_review`，不得继续支撑有条件通过：deadline/trigger 到达；design/source/config/target/run scope 变化；风险进入 P0/release scope；新 evidence 扩大影响；VETO/S/P0 failure 发现；owner/acceptor authority 失效；后续动作逾期；formal seam 或 retention/security规则改变。重新生效必须新建或 supersede 记录、执行影响回归并重新具名接受，不能改旧时间/证据。

## 8. 风险接受停审与跨项审计

| 审查项 | 设计结论 | 当前事实 |
|---|---|---|
| residual 资格是否要求 P0 全部独立通过 | 是 | 当前 P0/formal 未运行且 blocked |
| 18 个当前 blocker/pending 是否逐项有 disposition | 18/18 | 全部开放，无 closure |
| P0 blocker 是否可被 risk acceptance 关闭 | 否 | 0 acceptance |
| `AR-HLD-Q-001` 是否被当 outbound capability | 否 | candidate blocked；当前只允许 absence |
| `AR-HLD-Q-002` 是否产生数值结论 | 否 | P2 blocked/not_run |
| VETO/S/security/evidence 是否可接受 | 否 | 10 VETO 均无实例姿态 |
| risk owner 与 acceptor 是否分离且具名 | 规则已固定 | 姓名/authority 实例为 0 |
| deadline/trigger/follow-up/re-entry | 必填 | 实例为 0 |
| Archive 是否接受 governance/owner truth 风险 | 否 | authority 明确外置 |
| 当前 conditional verdict | 不存在 | acceptance not entered |

## 9. 回填草稿

正式 §13 应回填：六条资格条件、18 个当前事项的 disposition、future residual 类别、不可接受项、risk record 最小字段、authority 与自动失效规则。正文必须明确所有当前 blocker/pending 仍开放，`AR-HLD-Q-002` 只允许 P2 pending 而非数值 readiness，`AR-HLD-Q-001` 只允许当前 absence 而非 outbound readiness；当前无 risk acceptance 实例。

## 10. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；只收口既有 blocker/P1/P2/defect/evidence 语义 |
| 新 blocker | 无 |
| 持续 blocker | 12 upstream/architecture + 6 local 全部保留，未接受、未关闭 |
| 待 Step 14 | 将 P0/VETO/defect/evidence/risk posture 聚合为三值结论与签署职责 |
| 待未来 07/owner | follow-up boundary、真实 owner/acceptor/deadline、implementation/run/ops records；本 Step 不创建 |

## 11. 进入 Step 14 条件

- [x] 可接受 residual 与不可接受 P0/VETO/S/formal/evidence 条件可判定。
- [x] 18/18 当前 blocker/pending 有 owner、影响、disposition 与动作，未用风险接受关闭。
- [x] future P1/P2/future/B/有限 A 类别与 P0 requiredness 分离。
- [x] risk record、具名 authority、review、deadline/trigger、follow-up、失效与再进入规则完整。
- [x] 未伪造接受人、日期、risk acceptance、blocker closure、verdict 或 readiness。

当前 `gate_status`：`completed / risk_eligibility_and_all_current_dispositions_closed_no_acceptance_instances`。

`next_allowed_action`：按连续授权创建并完成 Step 14。
