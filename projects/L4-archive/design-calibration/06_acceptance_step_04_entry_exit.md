# Step 4. 定义进入条件与退出条件

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4\
> 正式回填：`06-验收标准.md` §4\
> 日期：2026-09-13\
> 状态：`completed / criteria_closed_current_acceptance_not_entered / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 4：定义进入条件与退出条件 |
| 目标 | 区分设计推进、实际验收进入、验收退出和暂停/不可裁决条件 |
| gate_status | `completed / criteria_closed_current_acceptance_not_entered` |
| gate_reason | entry/exit/pause 均可判定，required blocked P0、证据、VETO、缺陷和签署未被省略；当前实际条件全部未满足 |
| next_allowed_action | 按连续授权创建并完成 Step 5 |
| source_files | Step 3；正式 05 §9/11～14；05 Step 11～14；验收规范 §5.4 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 4A | 验收进入条件 | done | baseline/test exit/handoff 可判定 |
| 4B | 验收退出条件 | done | P0/VETO/defect/risk/signoff 齐全 |
| 4C | pause/不可裁决 | done | 漂移、断链、blocked 与 S 分流 |
| 4D | 当前状态评估 | done | checklist 未勾选、无 verdict |
| 4E | 来源与冲突审计 | done | 不与 05 测试 exit 冲突 |

## 2. 本步输入与门禁层级

```text
06 design completion gate       <- 当前可推进
          |
          v
test full exit + delivery fixed <- 当前不满足
          |
          v
acceptance entry                <- not_entered
          |
          v
AC/VETO/evidence review
          |
          v
acceptance exit + signoff       <- no verdict / no signoff
```

关键说明：设计文档可完成不依赖真实测试运行；实际验收进入必须依赖真实 fixed-run 证据；签署不能修补 P0 blocker、VETO 或证据断链。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认？ | Step 3 全部 required baseline：00～06 design revision、实现/Core/formal seam、env/config/data、primary fixed run 和 acceptance review package。 |
| 哪些测试证据必须先生成？ | 102 TC required raw、19 EV instances、11 P0 suites、5 gates、redaction/dependency/report/blocked-lane checks，以及 same-run report/acceptance handoff。 |
| 哪些缺陷阻断进入？ | 任一未关闭 S、影响 P0 的未复验 A、evidence/redaction/dependency/config safety 缺陷；blocked prerequisite 则直接使相关 P0 lane/完整进入条件不满足。 |
| 退出需要哪些结论？ | 全部 P0 AC 有真实结果；VETO 均有检查且未触发；required P0 无 failed/blocked/infra/not_run；S/A=0；可接受 residual 有正式实例；最终验收包与签署完整。 |
| 哪些风险必须先接受？ | 仅可能影响“有条件通过”的 B/R/P1/P2 residual；必须有 scope、evidence、owner、acceptor、deadline/trigger、follow-up 和 P0 contamination check。P0 blocker/VETO/S 不可接受。 |

## 4. Historical material 诊断与前后对比

| 项 | 旧 06 | 当前规则 | 理由 |
|---|---|---|---|
| 进入 | 02/03/05 冻结、可构造旧样本 | 全基线 + 完整测试退出 + fixed-run evidence + handoff | 送验必须可复验 |
| 退出 | P0、五旧主链、S=0、遗留清单 | 每个 P0 AC、VETO、blocker、raw/report、defect、risk、signoff | 支撑三值裁决 |
| unavailable | 无明确处理 | blocked/infra/not_run 分开，均不能通过 | 防漏分母 |
| 当前状态 | 空 checkbox 易误解 | `acceptance_execution=not_entered`，无 verdict | 不造事实 |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| local exit 是否可进入完整验收 | 不可；formal P0 也必须完成 | 以 local negative 先验收 | Archive 价值依赖 authority/finality |
| P0 blocked 是否可写“不适用” | 不可 | 排出分母 | requiredness 已由 05 固定 |
| acceptance handoff 是否可后补 | 不可；进入前已审查 | 签署时补 | VETO/risk/范围必须先透明 |
| 当前结论 | 只记录过程态 not_entered | 自动“不通过” | 没有送验对象不构成 verdict instance |

## 6. 结构化中间产物

### 6.1 实际验收进入条件

- [ ] 正式 00～06、适用 standards 的 immutable design revision 已固定且无影响 P0 的未审变化。
- [ ] 目标实现 repository、source revision、build/image identity 与允许的 Core contract identity 已固定。
- [ ] 12 域/55 P0 keys 的 effective config identity、profile、source resolution、exact adapter slots 和 secret-ref resolution 已固定且通过校验。
- [ ] 26 DS、formal owner/provider vectors、isolated namespace、权限、cleanup/probe/finality 已固定。
- [ ] 05 §12 的完整测试退出已满足：102 required TC、11 P0 suites、formal seam 与 release gate 无 failed/blocked/infrastructure_failed/not_run。
- [ ] primary `<run_id>` 明确、非 `latest`；raw/report 同 run、schema/digest/redaction/pairing 有效。
- [ ] 19 个 `EV-AR-*` 均有真实 instance、非空 exact `tc_refs`、suite/raw/report refs 和未来 AC refs。
- [ ] `reports/acceptance/handoff.md` 与 `veto-checklist.md` 已生成并经具名审查；`open-issues.md` 完整。
- [ ] 存在 residual 时，`risk-acceptance.md` 已完整但尚不代表最终接受；无 residual 时明确 empty state。
- [ ] 无未关闭 S 或影响 P0 的未复验 A；无 redaction/dependency/report-integrity/config safety blocker。

### 6.2 验收退出条件

- [ ] 全部 P0 AC 有 `通过` 或明确 `失败` 的真实裁决输入；不得以不适用移除 required 项。
- [ ] 全部 VETO 有同 run 或显式 supplemental run 的真实检查，且均未触发。
- [ ] 全部 F-AR-001～009、BR-AR-001～012、30/32 protocol、18 states、55 keys、102 TC、19 EV 分母一致且无 orphan/duplicate/conflict。
- [ ] source authority、workspace Auxiliary、owner zero-write、Query no-write、状态不传播、formal finality 和 evidence authenticity 均通过。
- [ ] 所有 required P0 blocker 对受影响 target 有 owning-project closure proof，并在实际 formal run 中验证；不存在开放 P0 blocked lane。
- [ ] S=0、未接受 A=0；每个关闭缺陷均有失败 run 与新 fixed run 复验配对。
- [ ] 仅 B/R/P1/P2 residual 可进入风险接受，且具名 authority、依据、动作、期限/触发和复验计划完整。
- [ ] acceptance handoff、veto checklist、open issues、条件所需 risk acceptance 与 reviewer notes 相互一致。
- [ ] 最终结论只取 `通过/有条件通过/不通过`，所有必要职责已签署；签署不替代证据或风险接受。

### 6.3 暂停 / 不可裁决 / 不通过分流

| 触发 | 姿态 | 恢复条件 |
|---|---|---|
| delivery/design/config/data/run identity 未固定 | `not_entered /不可裁决` | 固定基线后重新进入 |
| formal prerequisite 缺失 | P0 `blocked`，不可进入完整验收 | owner closure proof + formal run |
| runner/harness 意外失败 | `infrastructure_failed`，不可裁决 | 修复 harness，新 run |
| baseline 在 run 后漂移 | pause | 影响分析 + required regression/new run |
| raw/report/EV 缺失、跨 run、digest 不符、static pass | 证据门禁失败；可能 VETO/不通过 | 从真实 runner 生成新证据，保留旧历史 |
| redaction/secret/body leak、cross-domain write、blind replay | S/VETO，`不通过` | 修复、隔离/清理、全量新 run；不得风险接受 |
| measured P2 无 authority | `not_run/pending`，禁止数值/readiness 声明 | workload/method/threshold/owner 正式化后执行 |

### 6.4 当前门禁评估

| 层 | 当前状态 | 依据 |
|---|---|---|
| 06 设计推进 | allowed | 用户授权全部 06；Step 1～3 完成 |
| actual acceptance entry | `not_entered` | implementation/env/data/run/EV/handoff 全为 0 |
| formal P0 | `blocked` | 12 upstream/architecture + 6 local pending 开放 |
| acceptance exit | `not_run / blocked` | 无真实 AC/VETO/evidence/defect review |
| verdict/signoff/readiness | absent | 0 instances |

## 7. 复杂度判断

进入、退出、暂停和当前评估四个层次足以避免把测试执行门禁与验收裁决混同；具体 AC/VETO/defect/risk 在 Step 5～14 细化。

## 8. 回填草稿

正式 §4 的 checklist 全部保持未勾选，明确这些是 future actual acceptance 条件。正文应列 entry、exit、暂停分流与当前 `not_entered/blocked`；不得把 06 设计完成当 entry，也不得提前填写三值 verdict。

## 9. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 05 回写 | 无；完整测试退出与证据规则一致 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部阻断相应 formal lane/完整进入 |
| 待后续 | AC/VETO/defect/risk/signoff 的 exact registry 与闭环 |

## 10. 进入 Step 5 条件

- [x] entry/exit 条件可判定且与 05 一致。
- [x] blocked/infra/not_run/failed 不会被当 passed 或不适用。
- [x] 当前 `not_entered` 与三值 verdict 分离。
- [x] P0 blocker、VETO、证据、缺陷、风险和签署均有后续落点。

当前 `gate_status`：`completed / criteria_closed_current_acceptance_not_entered`。

`next_allowed_action`：按连续授权创建并完成 Step 5。
