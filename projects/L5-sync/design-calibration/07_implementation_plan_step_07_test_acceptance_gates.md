# Step 7. 嵌入测试与验收门禁

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填目标：正式 `07-实施计划.md` §7

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 7 / test_and_acceptance_gates |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 8；定义配置、环境和外部依赖准备 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 16 boundary/阶段门禁 | `07_implementation_plan_step_06_tasks_commits.md` | completed / stop_review |
| TC/SUITE/EV 计划 | `05-测试方案.md` | formal / stop_review |
| AC/VETO/evidence ceiling | `06-验收标准.md` | formal / stop_review |
| 固定路径规则 | 05 §9/§13、06 §3/§10、目录规范 | formal |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 每个 phase 有测试门禁吗？ | 有；PH-01～PH-08 分别绑定 GATE-01～16，覆盖 type/config、domain/state、flow/UoW、query-zero-write、handoff、ops、report/handoff。 | 05 §9、07 Step 6 |
| 每个 boundary 有验收/VETO 回指吗？ | 有；boundary matrix 绑定 AC-SYNC 项和 VETO 风险，任何 VETO/S/证据硬失败阻断。 | 06 §5～§12 |
| 证据放哪里？ | raw `artifacts/test/<run_id>/`，可读报告 `reports/runs/<run_id>/`，交接 `reports/acceptance/`；禁止 `latest` 和 project 子目录。 | 05 §13、06 §3/§10 |
| 报告何时成熟？ | PH-01 可只定义 script capability；PH-08-a 生成 minimal evidence index shell；PH-08-b 才可生成最终 handoff 模板；真实 EV 仍需真实 run。 | 07 书写规范 §4.7.2 |
| 门禁失败能否继续？ | 当前 boundary 只可修复同 boundary；blocked/unknown/partial 不压成 pass，不进入下一 boundary。 | 05 §9、代码实施台账规范 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| runner/script 尚未确定 | 不能写真实命令或结果 | 只规定参数、路径和输出契约，命令保持 planned |
| EV 是计划标识 | 不能在 07 声称证据存在 | EV 只作为未来回指，所有当前状态 planned/blocked/waiting |
| P1 external positive 受 blocker | 不能让 CI fake 关闭 blocker | P1 gate 失败/blocked 时保留状态并停止危险动作 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阶段测试 | 仅有 05 计划 | 每 phase/boundary 有具体 TC、suite、AC/VETO、artifact/report 输出 | 让实现可逐步验证 |
| 报告 | 路径定义但无阶段成熟度 | script capability → minimal index → handoff 分层 | 避免把脚本能力当证据 |
| 失败 | 泛化“修复后重跑” | 明确 gate 状态、保留失败 run、禁止进入下一 boundary | 可审计和可恢复 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有测试最后运行 | 集中 | 返工大，无法定位 boundary | 拒绝 |
| 每个函数单独生成报告 | 细 | 噪声和重复严重 | 拒绝 |
| 每个 boundary 绑定最小 test cut，phase/最终边界生成聚合报告 | 可验证、证据归属清晰 | 需要 gate matrix | 采用 |

## 结构化中间产物

### 阶段门禁矩阵

| Phase | 测试门禁 | 验收门禁 | 计划执行入口 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | `TC-SYNC-PROTO-001/002/004/006`、config negative | AC-017/020；VETO-004/005 | `scripts/gates/run_ci_gate.sh`（planned） | `artifacts/test/<run_id>/suites/protocol,config/` | `reports/runs/<run_id>/suites/protocol.md` | blocked；修复当前 contract，不进入 PH-02 |
| PH-02 | `TC-SYNC-MOD-001/002`、`TC-SYNC-STATE-001~007` | AC-001/002/007/010/013/014；VETO-003/004/005 | `run_ci_gate.sh` + targeted suite | `.../suites/domain,metadata/` | domain/metadata reports | 保留 failed run；设计缺口回写 03/04 |
| PH-03 | `TC-SYNC-MOD-003/008`、`TC-SYNC-CMD-001/004`、QRY-004~006 | AC-003/008/011/016/019；VETO-001/005 | flow/fault gate | `.../suites/flow,fault/` | flow/gate results | dirty/gap/unknown 阻断；不推进 cursor |
| PH-04 | `TC-SYNC-MOD-004`、`TC-SYNC-STATE-008~017`、consistency/idempotency | AC-004/008/011/019；VETO-001/005 | consistency/fault gate | `.../suites/recovery,consistency/` | recovery/consistency reports | outcome unknown 保留；不得盲重放 |
| PH-05 | `TC-SYNC-MOD-005`、`TC-SYNC-CMD-009/010`、PROTO-003 | AC-005/009/018/019；VETO-001/002/003/005 | handoff gate | `.../suites/handoff/` | handoff report | ACK 只停 transport；owner blocker 保留 |
| PH-06 | `TC-SYNC-QRY-001`、QRY-001~006、PROTO-005/006、REDACT-001 | AC-003/006/014/017/020；VETO-001/003/004/005 | query/entry gate | `.../suites/query,entry,redaction/` | query/redaction reports | Query write/probe 立即阻断 |
| PH-07 | `TC-SYNC-MOD-009/011`、PROTO-004/005、IDEMP-001 | AC-006/016/018/020；VETO-002/003/004 | operations gate | `.../suites/ops/` | ops report | raw payload/repair/scheduler drift 阻断 |
| PH-08 | `TC-SYNC-ARCH-001`、全部 P0 summary/audit | AC-001~020；VETO-001~005 | release/acceptance gate | `artifacts/test/<run_id>/meta`, `evidence-index.json` | `reports/runs/<run_id>` + `reports/acceptance` | 缺 EV/report/audit 不可交接 |

### Commit boundary 门禁矩阵

| Boundary | 提交前测试 | AC/VETO 回指 | artifact/report | 失败处理 |
|---|---|---|---|---|
| commit-01-a | protocol/config script shape | AC-017/020；VETO-004 | planned script output；无真实实例 | fix gate / wait_design |
| commit-01-b | carrier/error/config/UoW negative | AC-014/017/019/020；VETO-004/005 | planned suite | fix current boundary |
| commit-02-a | MOD-001、STATE-001~003 | AC-001/007/010；VETO-003/005 | domain artifact/report | stop on owner/access ambiguity |
| commit-02-b | MOD-002、STATE-004~007 | AC-002/013/014；VETO-003/004 | metadata artifact/report | physical blocker stays blocked |
| commit-03-a | QRY zero-write、MOD-003 read cuts | AC-003/006/020；VETO-001/003/005 | query report planned | any write/probe = S/VETO |
| commit-03-b | CMD-001/004、MOD-003/008、consistency | AC-003/008/011/019；VETO-001/005 | flow/fault reports | no cursor advance on unknown |
| commit-04-a | MOD-004、STATE-011~014 | AC-004/011/019；VETO-001/004 | recovery report planned | preserve facts/checkpoint |
| commit-04-b | CONSISTENCY-001、IDEMP-001、STATE-015~017 | AC-008/019；VETO-001/005 | consistency report planned | exact replay/unknown reload only |
| commit-05-a | MOD-005 candidate/provenance | AC-005/009/018；VETO-003/004 | handoff trace planned | provenance protected |
| commit-05-b | CMD-009/010、PROTO-003 | AC-005/009/019；VETO-001/002/003/005 | handoff report planned | ACK not accepted |
| commit-06-a | QRY-001~006, REDACT-001 | AC-003/006/014/017/020；VETO-004 | query/redaction report | zero-write violation blocks |
| commit-06-b | entry/selection/forbidden action | AC-001/003/005/017；VETO-001/003/005 | entry report planned | parser/tool pending |
| commit-07-a | consumer/job/IDEMP-001 | AC-006/016/018/020；VETO-002/003/004 | ops report planned | no repair/auto action |
| commit-07-b | redaction/link/diagnostic sink | AC-014/017/018/020；VETO-004 | link/redaction report | raw leak blocks |
| commit-08-a | G0～G7 script and index shape | all P0 planned; VETO checklist shape | minimal index shell | no static evidence |
| commit-08-b | report-audit/handoff review inputs | AC/VETO/S/A/B/R final mapping | acceptance files | human review required; no verdict claim |

### Gate definitions

| Gate | Meaning | Future evidence | Current status |
|---|---|---|---|
| `GATE-01` | package/tree/script shape | fixed diff/check output | planned |
| `GATE-02` | shared carrier/config/UoW negative | suite report + index | planned/blocked |
| `GATE-03` | selection/access safety | MOD/STATE evidence | planned/blocked |
| `GATE-04` | metadata generation/UoW | metadata/consistency evidence | planned/blocked |
| `GATE-05` | Query/inspection zero-write | QRY/flow evidence | planned |
| `GATE-06` | materialization safe finalize | flow/fault/consistency evidence | blocked positive |
| `GATE-07` | conflict/recovery facts | state/recovery evidence | planned |
| `GATE-08` | unknown/idempotency/replay | consistency/idempotency evidence | blocked probe |
| `GATE-09` | candidate/provenance | trace/handoff evidence | planned/blocked |
| `GATE-10` | handoff layer separation | handoff/Decision evidence | blocked owner |
| `GATE-11` | query/redaction | query/redaction evidence | planned |
| `GATE-12` | CLI safe entry | entry evidence | waiting local choices |
| `GATE-13` | consumer/job bounded contract | ops/replay evidence | blocked source |
| `GATE-14` | telemetry/evidence hooks | redaction/link evidence | planned |
| `GATE-15` | script/report/index capability | fixed-run artifact/report pairing | planned |
| `GATE-16` | acceptance handoff/audit | human-reviewed acceptance package | waiting real run |

### 报告生成与审查规则

| 成熟度 | 允许 boundary | 输出 | 禁止解释 |
|---|---|---|---|
| script capability | PH-01/PH-07 | 参数、路径、失败摘要、redaction check contract | 不证明功能或 readiness |
| minimal evidence index shell | PH-08/commit-08-a | `reports/runs/<run_id>/evidence-index.md` 链接壳 | 不证明 EV detail 或通过 |
| final EV detail pages | 真实实现后的 report boundary | `reports/runs/<run_id>/evidence/EV-*.md` | 不可由静态文件伪造 |
| acceptance handoff | commit-08-b | `reports/acceptance/handoff.md`、`veto-checklist.md`、必要 risk file | 不等于 verdict/signoff/readiness |

### 固定证据路径和最小字段

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
reports/runs/<run_id>/
  summary.md
  evidence-index.md
  gate-results.md
  redaction-check.md
  dependency-boundary.md
  report-audit.md
reports/acceptance/
  handoff.md
  veto-checklist.md
  risk-acceptance.md
```

当前以上路径均无实例。所有正式引用必须使用固定 `<run_id>`，禁止 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`。

### 门禁停审记录

| Phase / Boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 / 01-a～01-b | test cut、script shape、config negative | pass (plan) | local toolchain/baseline blocker |
| PH-02 / 02-a～02-b | domain/state/UoW coverage | pass (plan) | owner/physical metadata blocker |
| PH-03 / 03-a～03-b | zero-write/materialization safety | pass (plan) | source/Git/fs/comparator blocker |
| PH-04 / 04-a～04-b | recovery/idempotency/unknown | pass (plan) | probe/effect equivalence blocker |
| PH-05 / 05-a～05-b | handoff/provenance/VETO | pass (plan) | Governance blocker |
| PH-06 / 06-a～06-b | Query/CLI/redaction | pass (plan) | parser/bin/runtime blocker |
| PH-07 / 07-a～07-b | consumer/job/ops/evidence hook | pass (plan) | event/scheduler/report runner blocker |
| PH-08 / 08-a～08-b | report/audit/handoff | pass (plan) | no real run/review |

### 跨门禁覆盖/证据归属审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| AC→TC/SUITE | pass (planned) | future run required |
| TC/SUITE→EV | pass (planned) | EV IDs not execution evidence |
| EV→artifact/report | planned gate | fixed run and pairing required |
| VETO→checklist | planned gate | never default passed |
| redaction/dependency/report audit | planned gate | failure blocks handoff |
| failure run retention | required | fixed failed/fixed run pair; no latest overwrite |

## 回填草稿

正式 §7 将承载阶段/Boundary Gate Matrix、GATE-01～16、TC/AC/VETO 回指、报告成熟度、固定 evidence roots、失败处理和跨门禁审计；不填写实际命令结果或 evidence clean。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| runner/package command | 所有 Build/Test Gate | PH-01 |
| artifact/report generator ownership | PH-08 | PH-07 前 |
| human/Agent acceptance reviewer | final handoff | commit-08-b 前 |

## 进入下一步条件

- [x] 每个 phase/boundary 有测试、验收、artifact、report 和失败处理口径。
- [x] GATE-01～16 编号稳定。
- [x] evidence ceiling、redaction、VETO 和 report audit 规则无冲突。
