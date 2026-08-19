# Step 13. 正式实施计划装配校准

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 13
> 正式输出：projects/L2-runtime/07-实施计划.md
> 同批输出：implementation_execution_ledger.md 与 39 个 planned boundary skeleton
> 状态：completed / closed_stop_review
> 事实边界：装配只形成 design handoff inventory；不创建实现仓、不实现代码、不运行实现测试、不生成真实 artifact/report/evidence/verdict/signoff/readiness、不提交。

## 1. 三层写入门禁

| 层级 | 条件 | 当前 |
|---|---|---|
| project ledger | current document=07，current Step=13，formal write was allowed only at this step | pass-designed |
| document flow | Step 1~12 completed，Step 13 completed | pass-designed |
| Step 13 | formal source mapping、output inventory、audit plan preceded formal assembly | pass-designed |

## 2. 正式章节来源

| 正式章节 | Calibration source |
|---|---|
| §1 上游关系 | Step 1 |
| §2 目标范围 | Step 2 |
| §3 前置阅读 | Step 3 |
| §4 对象交付物 | Step 4 |
| §5 Phase/依赖 | Step 5 |
| §6 task/boundary | Step 6 + Annex A/B |
| §7 test/acceptance gates | Step 7 |
| §8 config/environment/dependency | Step 8 |
| §9 Spike/risk/OQ | Step 9 |
| §10 rollback/pause/change | Step 10 |
| §11 commit/review/handoff | Step 11 |
| §12 completion | Step 12 |
| §13 reference/fact boundary | 本 Step |

Annex B 的唯一正确路径为 07_implementation_plan_step_06_tasks_batches_ph07_13.md；旧 ph07_12 名称视为 historical filename，不得引用。

## 3. 装配合同

| 审计面 | 固定要求 |
|---|---|
| structure | 正式 07 恰好 13 个编号主章节 |
| phase/boundary | 13 Phase、39 boundary、117 IMPL、117 BATCH、39 GATE |
| denominator | 12 CAP、17 C、12 Q、6+6 E、7 J、31 states、7 UoW、6 replay、15 config、13 slots、37 CUT、177 TC-EV、8 suites、9 checks、36 AC、8 VF、19 NFR、18 EG |
| dependency | 仅 verified L0-core 可为 compile candidate；其余 runtime/event/ref/adapter/fake |
| current | commit-01-a 唯一 current，blocked / wait_design |
| future | 38 个 future planned / pending / wait_until_current |
| gates | 351 个子门禁（39 x 9），0 pass；current blocker 不伪装为 test failure |
| records | committed_hash=none；run/artifact/report/evidence/verdict/signoff/readiness=none |
| stop | 装配审计完成，状态 closed_stop_review；不进入实现 |

## 4. Boundary skeleton 最小 schema

每个 skeleton 必须包含：Header、Truth Banner、Boundary Intent、Activation Context、Required Reads、Allowed Scope、Forbidden Scope、Batch A/B/C、Required Checks、Design Closure Gate、Experience Review、9-row Gate Matrix、Commit Gate、Commit Record、Handoff Gate、Blockers、Recovery Notes。未来文件存在不表示 current 或授权实现。

## 5. 输出清单

| 输出 | 装配目标 |
|---|---|
| 正式 07 | 13 章，校准来源明确，current counts 无旧污染 |
| implementation ledger | 39 rows；1 current blocked + 38 future planned |
| boundary skeletons | commit-01-a 至 commit-13-c，39 files |
| flow/project ledger | Step 13 closed_stop_review |
| Annex naming | ph07_13 唯一引用 |

## 6. 后置审计计划

1. formal top-level numbered chapter = 13。
2. Step 6、Step 7、Step 11、formal 07、implementation ledger、skeleton filename 的 boundary set 相等。
3. IMPL=117、BATCH=117、GATE=39，编号连续且每 boundary 3/3/1。
4. phase=13，每 Phase 3 boundary；PH-03 是 Runtime Loop Kernel。
5. skeleton=39；1 current blocked，38 future planned；351 sub-gates，0 pass。
6. 扫描旧 12/35/105/109/4-check/12-suite 当前口径污染。
7. 扫描伪造 hash/run/artifact/report/evidence/verdict/signoff/readiness。
8. 检查 compile/runtime/event/ref/adapter/fake 与 external blocker 姿态。
9. git diff --check -- projects/L2-runtime。
10. 完成后更新本文件、flow、project ledger 并立即停审。

## 7. 后置审计结果与当前事实

formal_07_write_allowed = closed_after_step_13
implementation_ledger_write_allowed = planned_inventory_only
boundary_skeleton_write_allowed = planned_inventory_only
implementation_repo_write_allowed = false
actual_implementation_commit_run_evidence = none
acceptance_verdict_signoff_readiness = none

| 审计项 | 结果 |
|---|---|
| formal 07 numbered chapters | 13，顺序 1~13 |
| canonical boundary set | 39；Step 6/7/11/ledger/skeleton 集合一致 |
| IMPL/BATCH/GATE | 117 / 117 / 39；每 boundary 3/3/1 |
| phase mapping | 13 Phase，每 Phase 3 boundary；PH-03 为 Runtime Loop Kernel |
| skeleton inventory | 39 files；1 current blocked，38 future planned；351 sub-gates，0 actual pass |
| dependency posture | only verified L0-core compile candidate；其他 seam 分类保持显式 |
| old count/name scan | old values only historical_material；ph07_13 是唯一 Annex B 当前路径 |
| fabricated fact scan | no hash/run/artifact/report/evidence/verdict/signoff/readiness |
| whitespace audit | `git diff --check -- projects/L2-runtime` pass（无输出）；无实现仓写入 |

## 8. 收口结论

正式 `07-实施计划.md`、implementation ledger 与 39 个 planned skeleton 已装配。`commit-01-a` 仍因 target repo absent、immutable baseline not_bound、Core compatibility unverified、binary identities unresolved 和 `L2R-LANG-002` 保持 `blocked / wait_design`。本 Step 完成后立即停审；不创建实现仓、不落码、不运行实现测试、不生成证据、不提交。
