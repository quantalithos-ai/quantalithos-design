# L2-tools 07 实施计划 Step 10：回退、暂停与变更控制

## Step 状态

`accepted`

## 本步输入与原则

本步承接 26 个 boundary、Step 7 gate failure、Step 8 dependency unavailable 和 Step 9 risk/OQ。回退优先采用 fix-forward、停在当前 boundary、保留失败事实和新 baseline/new run；禁止用 destructive git 命令清理用户改动、覆盖历史 artifact 或把 unknown 改写为 success/failure。

## SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些情况必须暂停？ | repo/baseline/设计闭环缺失、scope drift、用户未知改动、build/test/check failure、VF/redaction/dependency/evidence failure、deadline逾期、external positive unavailable。 |
| 是否允许回退上一个 commit？ | 仅在 owner 明确授权且不破坏用户改动/历史时；默认 fix-forward 或停止激活下一 boundary，不使用 hard reset。 |
| 何时回写设计？ | field/DTO/Port/state/config/test/evidence/phase conflict；产品私有实现不改 semantic 时不回写。 |
| 外部依赖不可用能否继续？ | unaffected local/negative scope 可继续；positive/selected scope保持 blocked，不用 fake 补 pass。 |
| 如何恢复？ | blocker关闭、新 immutable design baseline、ledger更新、current boundary重读并重跑全部受影响 gate。 |

## 暂停规则

| ID | 触发 | 动作 | Gate/action | 保留证据 | 恢复条件 |
|---|---|---|---|---|---|
| `PAUSE-L2T-01` | target repo/git/Core/toolchain 缺失 | 停止 PH-01 | blocked/wait_design | preflight facts | authorized repo/baseline/toolchain ready |
| `PAUSE-L2T-02` | field/DTO/Port/state/config/evidence/phase 冲突 | 停当前 boundary，写 blocker | blocked/wait_design | exact source/path/conflict | owning design fixed + new baseline |
| `PAUSE-L2T-03` | touched path 越出 allowed scope | 停止编辑/暂存，拆分 scope | blocked/fix_gate_failure | status/diff names | out-of-scope work removed without touching user changes |
| `PAUSE-L2T-04` | 发现未知用户/其他 agent 改动 | 停止重叠文件工作并回报 | blocked/handoff or wait_design | initial/current status | ownership clarified or non-overlap plan |
| `PAUSE-L2T-05` | fmt/check/test/TC failure | 只修当前 boundary | blocked/fix_gate_failure | command/raw failure | fix + rerun applicable gates |
| `PAUSE-L2T-06` | redaction/dependency/profile/pair/phase/no-static check failure | hard stop，不进入下一 boundary | blocked/fix_gate_failure | failed check/report | new clean run/check; old failure retained |
| `PAUSE-L2T-07` | VF/S/current P0 A | stop release/handoff | blocked/fix_gate_failure | finding/TC/run refs | fix + independent retest + VF not_triggered |
| `PAUSE-L2T-08` | external owner/selected dependency unavailable | 只停 affected positive scope | blocked/wait_design | blocked_dependency record | owner contract/product ready or scope excluded |
| `PAUSE-L2T-09` | design/source/config baseline drift | invalidate eligibility | blocked/wait_design | old/new baseline refs | freeze new baseline + impact rerun |
| `PAUSE-L2T-10` | Spike/OQ deadline逾期 | stop affected boundary | blocked/wait_design | pending item/ref | adopt/reject/reopen decision recorded |

## 回退规则

| ID | 场景 | 允许动作 | 禁止动作 | 恢复/验证 |
|---|---|---|---|---|
| `RB-L2T-01` | 未提交 current boundary 实现错误 | 在 allowed scope 内 fix-forward，保留失败测试 | reset/checkout 用户文件、清空 worktree | rerun boundary gates |
| `RB-L2T-02` | 已提交 boundary 发现缺陷 | 新 fix boundary/commit 或 owner授权 revert | amend/rewrite已交付历史（无明确授权） | impact matrix + affected/full regression |
| `RB-L2T-03` | 设计修正 | 新 design baseline，更新 ledgers，再继续当前 boundary | 代码私自兼容两套 truth | Design Gate full reread |
| `RB-L2T-04` | config assembly failure | dispose partial graph，保留 valid previous candidate only if formal rule permits | invalid-high fallback、hot patch、partial entry | V0~V8/B0~B8 rerun |
| `RB-L2T-05` | side-effect outcome unknown | 保持 Prepared/Unknown/manual，same marker resolution | blind retry/new key/guess success | formal same-authority resolution |
| `RB-L2T-06` | test/release run failure | 保留 failed run，创建 new fixed run | overwrite/delete/cherry-pick cross-run | full applicable denominator in new run |
| `RB-L2T-07` | acceptance projection publication failure | whole projection invalid, retain staging | use partial/old fixed projection | new release run/publish/manifest/seal |
| `RB-L2T-08` | selected product fails capability | reject product or reopen design | fallback to fake while claiming selected | selected proof rerun |

## 变更控制表

| Change class | Authority | 影响分析 | 必须更新 | 恢复门禁 |
|---|---|---|---|---|
| documentation-only clarification | owning formal doc | check no semantic/boundary delta | formal + calibration + ledger refs | doc review/diff check |
| field/type/variant/callable | `03` | construction/flow/state/tests/boundaries | 03/05/06/07 + ledgers | new design baseline/full affected audit |
| state/TX/idempotency/unknown | `03` | all writers/readers/replay/evidence | 03/05/06/07 | affected + P0 escalation as required |
| config key/profile/source/activation | `04` (+03 if semantic) | loader/builder/profile/tests | 04/05/06/07 | CFG full matrix |
| TC/suite/artifact/report schema | `05` | denominator/writers/readers/evidence | 05/06/07 | full evidence audit |
| AC/VF/risk/signoff authority | `06` | decision/evidence/handoff | 06/07 | acceptance design review |
| phase/boundary split/merge/order | `07` | task/gate/commit/ledger | Step 5/6/7/11 + all skeletons | cross-boundary audit |
| private adapter/product only | infra/config binding | prove no semantic/public delta | implementation + targeted tests | boundary review; no design rewrite if exact |

### Blocker 记录与恢复协议

每个 blocker 必须记录 `blocker_id,boundary,gate,status,reason,affected_files,design_sources,forbidden_workarounds,requested_closure,next_allowed_action`。关闭后补 `design_fix_baseline,resolution_summary,status,next_allowed_action`；不得以用户“同意”替代 gate evidence。

### 停审与跨控制审计

| 审计项 | 结论 |
|---|---|
| 设计冲突必停 | pass-designed |
| 用户 worktree 保护 | pass-designed；禁止 destructive cleanup |
| unknown/no blind retry | pass-designed |
| failed run retention/no cross-run | pass-designed |
| external positive scope isolation | pass-designed |
| 26 boundary 共享规则可投影到 skeleton | pass-designed |

## 回填草稿

正式 07 §10 应收录 PAUSE-L2T-01~10、RB-L2T-01~08、change-control 表和 blocker schema；强调所有回退保护失败历史与用户改动，恢复必须基于新 baseline/新 run/重跑门禁。

## 进入下一步条件

- [x] 暂停、回退、变更、恢复均有明确条件。
- [x] 规则与 ledger state machine 一致。
- [x] 不含 destructive rollback 或事实覆盖。
