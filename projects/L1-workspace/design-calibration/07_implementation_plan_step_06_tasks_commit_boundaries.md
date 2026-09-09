# Step 6. 拆分阶段任务、编写顺序与提交边界

## 1. Step 状态

`completed / boundary_skeleton_planned`。

## 2. 统一编码顺序

1. 读取项目级和当前 boundary 台账；2. 阅读阶段输入；3. 锁定对外契约和测试切口；4. 更新 Design/Scope Gate；5. 建立测试切口；6. 实现 domain/application；7. 接 adapter；8. 接 API/worker/jobs；9. 补错误、状态、事务、幂等、审计；10. 执行门禁并留证；11. 更新 Commit Gate；12. 经用户授权再 commit；13. 回写 Handoff Gate。

## 3. 批次与 boundary 总表

| Boundary | 阶段 | 可验证增量 | 预计批次 | 当前 |
|---|---|---|---|---|
| BND-01-foundation | PH-01 | crate/manifest/composition skeleton | 2 | planned |
| BND-02-contract-domain | PH-02 | typed contract + object/state invariants | 4 | planned |
| BND-03-local-surface | PH-03 | local Command/Query/no-write | 4 | planned |
| BND-04-projection | PH-04 | event classification/projection/Inbox/idempotency | 4 | blocked |
| BND-05-recovery | PH-05 | recovery/generation/invalidation | 4 | blocked |
| BND-06-adapters | PH-06 | config/store/cursor/fault/redaction/dependency | 4 | blocked |
| BND-07-entry-evidence | PH-07 | API/worker/jobs/scripts/report capability | 4 | planned |
| BND-08-formal-seam | PH-08 | owner/bus/durable/downstream selected run | 3 | blocked |

## 4. Boundary 通用闭环复核

每个 boundary 开工前必须检查：字段来源、DTO 可构造、正式状态名、ref identity/key、validation truth source、metadata/digest/idempotency/UoW、projection committed truth/replay source、artifact materialization、phase boundary。任何一项缺失即 `blocked`，由设计者回写真相源；实现者不得现场补。

## 5. 阶段任务、批次与提交边界

### PH-01 Foundation / composition

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 建立 manifest/目录计划 | 03 §4、07 §4 | planned crate tree | 路径与依赖分类审计 |
| IMPL-01-02 | 2 | 建立 composition/台账入口 | 03 §5、04 | builder boundary | fake/owner capability 分离 |

| 批次 | 目标 | 规模 | 门禁 | 提交关系 |
|---|---|---|---|---|
| BATCH-01-01 | manifest 与 crate skeleton | 100~200行，未来 | GATE-01/DEP | BND-01 |
| BATCH-01-02 | composition 与 boundary ledger wiring | 100~200行，未来 | GATE-01 | BND-01 |

| Boundary | commit 时机 | 包含 | 不包含 | 状态 |
|---|---|---|---|---|
| BND-01-foundation | 两批通过且用户授权 | manifest、目录、台账 | 业务对象/真实 driver | planned |

### PH-02 Contracts / domain invariants

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 建立 typed refs/DTO/error/cursor | 03 §6/7 | contract constructors | roundtrip/wrong-kind tests |
| IMPL-02-02 | 2 | 实现 partition/source/projection/local objects | 03 §6/9 | 16 object factories | invariant tests |
| IMPL-02-03 | 3 | 实现 pure Inbox projector | 03 §6 | Present/Withdrawn rules | no-I/O tests |
| IMPL-02-04 | 4 | 完成状态组合与非法迁移 | 03 §9 | state matrix tests | terminal/gap rules |

| 批次 | 目标 | 规模 | 门禁 | 提交关系 |
|---|---|---|---|---|
| BATCH-02-01 | typed refs/DTO/error | 150~250行，未来 | GATE-01/CONTRACT | BND-02 |
| BATCH-02-02 | partition/source/projection objects | 200~300行，未来 | GATE-02/OBJECT | BND-02 |
| BATCH-02-03 | local/inbox objects | 150~250行，未来 | GATE-02/STATE | BND-02 |
| BATCH-02-04 | invalid transitions/property cuts | 高风险独立批次 | GATE-02/STATE | BND-02 |

### PH-03 Local command-query vertical slice

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | Provision partition/local store port | 03 §7/10 | atomic write carrier | TXN/IDEM local tests |
| IMPL-03-02 | 2 | Change local state/CAS | 03 §8/12 | expected version flow | LOCAL/IDEM tests |
| IMPL-03-03 | 3 | Implement six Query read-only services | 03 §7~9 | safe response | seven-write spy |
| IMPL-03-04 | 4 | API thin handlers | 03 §4/7 | command/query handler | API surface tests |

| 批次 | 目标 | 规模 | 门禁 | 提交关系 |
|---|---|---|---|---|
| BATCH-03-01 | provision + operation record | 150~250行，未来 | GATE-03/TXN | BND-03 |
| BATCH-03-02 | local CAS + replay | 高风险独立批次 | GATE-03/IDEM | BND-03 |
| BATCH-03-03 | GetView/ListInbox/LocalState | 200~300行，未来 | GATE-03/QRY | BND-03 |
| BATCH-03-04 | operation/recovery/export Query | 200~300行，未来 | GATE-03/QRY | BND-03 |

### PH-04 Projection / consumer / idempotency

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | source key/digest classification | 03 §7/12 | Applied/Late/Conflict/Gap/Unknown | SRC/IDEM tests |
| IMPL-04-02 | 2 | atomic projection apply | 03 §8/10 | projection/coverage/record carrier | TXN tests |
| IMPL-04-03 | 3 | explicit attention Inbox derive | 03 §6、WS-UP-004 slot | Inbox lifecycle | INBOX tests |
| IMPL-04-04 | 4 | worker consumer boundary | 03 §4/7 | receipt non-ACK | worker tests |

| BND-04-projection | formal event/order/proof unavailable时不得开工正向批次 | 仅 local classifier/fault 可先做 | blocked |

### PH-05 Recovery / generation / invalidation

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | Request/Supersede records | 03 §8~12 | attempt transitions | state/idempotency |
| IMPL-05-02 | 2 | one-phase Advance | 03 §8/9 | bounded continuation | phase tests |
| IMPL-05-03 | 3 | basis validation/cutover | 03 §10/12 | atomic generation switch | race tests |
| IMPL-05-04 | 4 | Invalidate DataStale/SafetyBlocked | 03 §8/11 | target effects | invalidation tests |

`BND-05-recovery` 在 baseline/replay/durable seam 未闭合时保持 blocked；不得以旧 projection 充当 baseline。

### PH-06 Config / adapters / controlled seams

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | strict RuntimeConfig/profile loader | 04 §3~9 | validation/fail-fast | CONFIG tests |
| IMPL-06-02 | 2 | store/cursor controlled adapter | 03 §10/13、04 | capability handles | fault/resource tests |
| IMPL-06-03 | 3 | owner/bus adapter interfaces | 03 §7/13 | typed runtime/event seam | missing slot blocked |
| IMPL-06-04 | 4 | redaction/dependency checks | 04 §8/11 | static check capability | SEC/DEP tests |

`BND-06-adapters` 的 durable/crypto/transport 正向部分保持 blocked；fake 仅用于 local/controlled 机制。

### PH-07 API-worker-jobs / reports / evidence

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | wire API/worker/jobs handlers | 03 §4/7 | bounded entry composition | entry suites |
| IMPL-07-02 | 2 | add planned gate/check scripts | 05 §9 | script capability | path/arg checks |
| IMPL-07-03 | 3 | raw/report/evidence index shell | 05 §13、06 §10 | same-run pairing | integrity checks |
| IMPL-07-04 | 4 | acceptance handoff draft generator | 06 §10/14 | draft only | human/Agent review required |

`BND-07-entry-evidence` 不创建真实 evidence 或 acceptance verdict；只实现未来脚本能力。

### PH-08 Formal seam conformance / handoff

| 任务 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | verify versioned owner/bus manifest | WS-UP-001~007 | seam manifest | all required slots bound |
| IMPL-08-02 | 2 | run selected formal conformance | 05/06 gate | fixed run raw/report | 13 suites + 59 EV |
| IMPL-08-03 | 3 | human/Agent review handoff | 06 §10/14 | reviewed drafts | no VETO/blocker |

`BND-08-formal-seam` 当前 blocked；不得填写 commit hash、run_id、EV、verdict 或 readiness。

## 6. Commit boundary 统一台账字段

每个 BND 文件必须包含：`status=planned|blocked|waiting`、`design_baseline=pending`、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate、Handoff Gate、blockers、next_allowed_action=wait_until_current。未来 commit 时机是该 boundary 的批次、门禁和用户授权均满足后；当前不提交。

## 7. 停审与进入下一步

8 个 boundary 均有可验证增量、禁止范围、门禁和依赖；高风险状态/事务/幂等/安全/跨仓同步分开批次；允许 Step7。
