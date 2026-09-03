# 07 Step 12：实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填目标：正式 `07-实施计划.md` §12
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：本文件定义 future implementation complete 的可审计谓词；当前不填写任何实际完成、测试通过、commit、artifact、report、verdict 或 readiness。

## 1. 完成判定原则

“设计计划完成”与“实现完成”“验收通过”“发布就绪”是四个不同结论。本轮只能完成设计计划和 planned ledger/skeleton 的建立；目标实现仓不存在，因此 implementation 状态仍为 `not_started`，acceptance 为 `not_entered`。

```text
design plan assembled
  != implementation complete
  != acceptance passed
  != release/consumer/runtime readiness
```

## 2. Boundary 完成谓词

future boundary 只有同时满足下列条件，才可从 `pending` 进入 `handoff`，再由项目台账显式激活 successor：

```text
BoundaryComplete(B) =
  DesignClosure
  AND ScopeClosure
  AND WorktreeClosure
  AND BatchA/B/CVerified
  AND RequiredTests
  AND EvidencePairing
  AND CommitGate
  AND HandoffGate
  AND NoOpenBlockingIssue
```

其中：

- `DesignClosure`：字段、DTO、support carrier、状态、ref identity、validation truth、error、metadata/idempotency、projection/artifact source 与 phase boundary 均能回指正式文档。
- `ScopeClosure`：只改当前 allowed scope；无 sibling body、transport lifecycle、container、scheduler、event/outbox 或产品越界。
- `WorktreeClosure`：目标仓、branch、用户改动、baseline、repo-local identity 可复查。
- `BatchA/B/CVerified`：contracts/fixtures、domain/application、高风险/infra/entry 各自按当前 boundary 验证。
- `RequiredTests` 与 `EvidencePairing`：使用固定 run；不存在真实 raw/report 时不得假定通过。
- `NoOpenBlockingIssue`：当前 boundary 受影响的 B01/B02/B03/OPEN/PF/MI-UP/Q-MI 已有正式解除或明确不影响该 boundary 的书面处置。

## 3. Phase 出口判定

| Phase | 出口 Gate | 设计完成判定 | 当前 implementation 上限 |
|---|---|---|---|
| PH-01 | `GATE-03` | workspace/config/script contracts 已闭合 | `blocked / wait_design`（目标仓缺失） |
| PH-02 | `GATE-06` | definition/static assembly/revision 的 typed/negative seam 可审查 | `blocked`（owner/B01） |
| PH-03 | `GATE-09` | intent/outcome/bounded selectors 可保守停止 | `blocked`（B01/B02） |
| PH-04 | `GATE-12` | provenance/qualification/Artifact gap 分层明确 | `blocked`（Q-MI/MI-UP-007） |
| PH-05 | `GATE-15` | local supply/history 与 consumer gap 分开 | `blocked`（B03/MI-UP-001） |
| PH-06 | `GATE-18` | 10 Query/view/freshness/API strict no-write | `planned`（PF recovery pending） |
| PH-07 | `GATE-21` | marker-only inbound、six bounded jobs、facade mapping | `blocked`（MI-UP-005/B01/PF） |
| PH-08 | `GATE-24` | test/report/evidence/handoff tooling contract | `not_generated`（无 runner/run） |

任一出口 Gate 为 `pending`、`blocked`、`failed` 或 `not_evaluable`，Phase 不能标记 implementation complete，后续 Phase 不能激活。

## 4. 全项目完成判定表

| 判定项 | future 标准 | 当前证据 | 当前结论 |
|---|---|---|---|
| 需求覆盖 | `C-MI-1~5`、`F-MI-001~015` 与选定 P0 scope 有实现/测试闭环 | 07/05/06 设计映射 | `designed`，非实现完成 |
| 模块交付 | 七职责 workspace、package/crate、logical entry 真实存在且可编译 | 目标仓不存在 | `blocked` |
| 协议覆盖 | 10 Command、10 Query、2 inbound、6 Job、0 outbound exact mapping | 正式 03 与 boundary tables | `planned` |
| 状态/一致性 | 19 matrix、20 subject、UoW/version/history/replay 真实测试闭环 | B01/B02/B03/OPEN 未闭 | `blocked` |
| 配置 | 五域 21 key strict/fail-closed/profile/fake | 正式 04 设计 | `designed`，未执行 |
| 测试 | planned TC/EV/suite/check 全执行并有同 run raw/report | 无实现仓/run | `not_entered` |
| VETO/安全 | 无 S/VETO、无 redaction/dependency/outbound/query-write 违规 | 只有规划规则 | `not_evaluable` |
| 证据 | raw→report→EV→acceptance draft 配对完整 | 未生成 | `not_generated` |
| 提交/移交 | 24 actual commit/handoff records 与 post-status | 无 commit | `not_started` |
| 验收/发布 | 06 授权角色形成 verdict/signoff/readiness | 不属于 07，且未发生 | `not_entered` |

## 5. 未完成项处理

| 未完成项 | 状态 | 处理 | 能否绕过 |
|---|---|---|---|
| 目标仓/工具链/基线 | `environment_blocked` | 建仓、核验、固定 baseline 后重新开 `01-a` | 否 |
| B01/B02/B03/OPEN/PF | `design_blocked` | 回写 03 并重核受影响 boundary | 否 |
| MI-UP/Q-MI | `owner_pending` | 等 owner 正式合同；保持 gap/unknown | 否 |
| P1/P2/多架构/性能/产品 | `residual/future` | 单独 scope、baseline、gate 和验收 | 不得污染 P0 |
| report/evidence 缺失 | `not_evaluable` | 新固定 run 重生成 | 不得手写 pass |
| 文档编辑问题 | `fix_gate_failure` | 修订文档并静态审计 | 可在 design 仓修正 |

## 6. 交付清单（future handoff）

实现完成后，移交包至少应包含：

- project implementation ledger 与 24 boundary ledger 的真实状态、baseline、hash、post-commit status 和 next action。
- 七职责 workspace 的实际目录、manifest、依赖扫描、Rustfmt/check/test 结果。
- 对应 boundary 的 raw artifact、suite report、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 与 pairing check。
- `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 及必要的 `risk-acceptance.md` 草稿，均由 06 授权角色审查。
- owner pending、blocked lane、fake/test profile、P1/P2 residual 和未完成项的显式说明。

这些清单是 future requirements，不是当前已生成文件；当前只生成设计期 ledger/skeleton。

## 7. 交付实现前可落码闭环审计

| 复核面 | 必须满足 | 当前 |
|---|---|---|
| `03` fields/DTO/ports/flows/states | boundary 能逐项构造、保存、返回和测试 | 设计可定位；受 blocker 的正向部分 blocked |
| `04` keys/profile/activation | binding、sensitive、failure、rollback 与 03 一致 | `pass-designed` |
| `05` TC/EV/suite/path | 每个 Gate 有 owning suite 与 same-run path | `pass-designed`；无实例 |
| `06` AC/VETO/evidence | implementation plan 不替代裁决、风险接受或签署 | `pass-designed` |
| `07` phase/boundary/ledger | 24 boundary、24 Gate、current identity 和 successor rule 一致 | `pass-designed`；当前 blocked |

## 8. 回填草稿、待确认事项与进入下一步

### 回填草稿（正式 §12）

本项目只有在 24 boundary、8 Phase exit、planned tests/evidence、same-run pairing、zero hard redline、无未关闭设计/owner blocker、真实 commit/handoff 和 06 授权审查均具备证据后，才可由实现侧提出“implementation complete”。当前仅完成实施计划设计与台账骨架，结论为 `implementation_incomplete / blocked`，不产生 acceptance verdict、signoff 或 readiness。

### 待确认事项

1. 未来执行方是否接受上述完成谓词及 P0/P1/P2 分母。
2. 设计 blocker 和 owner closure 后，是否需要重开 03/04/05/06 与调整 24 boundary。
3. 真实 artifact/report/evidence 由哪个 runner 与授权角色负责。

### 进入 Step 13 条件

- 完成谓词、phase exit、未完成项、交付清单和闭环审计均明确。
- 当前 `not_started/not_entered/blocked` 事实不会被正式 07 误写为完成。

**Step 12 结论：`completed_with_explicit_blockers`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

Step 2/4/7/9、正式 05/06、ledger 规范

## 本步输出

BoundaryComplete、Phase exit、项目完成谓词

## 事实边界

当前 implementation incomplete；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 什么时候算 boundary complete？——设计、范围、工作区、三批次、测试、证据、Commit/Handoff 和 blocker 条件全部满足。
2. 什么时候算项目完成？——八 Phase exit、24 boundary、P0 tests/evidence、无硬红线且交付记录齐全。
3. 未完成如何处理？——environment/design/owner/not_evaluable/residual 分层，不能用“基本完成”。
4. 谁给最终验收？——正式 06 授权角色。
## 当前文档问题诊断

- 设计计划完成不能等同 implementation complete。
- owner blocker、S/VETO 和证据缺失不允许风险接受替代。
- 当前无实际证据可证明任何实现完成。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 完成 | 只有任务列表 | BoundaryComplete/Phase exit/项目谓词 |
| 未完成 | 可能模糊为延期 | 明确 blocked/not_evaluable/residual 处置 |
| 交付 | 与验收混合 | 实现 handoff 与 06 verdict 分离 |
## 设计取舍

- 采用严格合取谓词，避免部分完成被误宣称。
- 将设计、实现、验收、发布四类状态分开。
- 用 same-run evidence 和真实 ledger 作为证据前提。
## 结构化中间产物

本步结构化产物是 BoundaryComplete 谓词、Phase 出口表、项目完成表、未完成项处理和交付清单。
