# Step 8. 定义状态机、事务与一致性验收

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-core/06-验收标准.md` §8

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `03-详细设计.md` §9 | 契约定义生命周期、兼容性、发布基线、快照、事实输出、引用、读面状态机 | 定义合法 / 非法状态迁移验收 |
| `03-详细设计.md` §10 | 存储对象、事务边界、一致性规则 | 定义原子提交和副作用验收 |
| `03-详细设计.md` §11 / §12 | 错误恢复、并发、幂等和重入保护 | 定义失败、重试、冲突和 replay 口径 |
| `05-测试方案.md` §6 / §10 / §13 | TC-CMD、TC-IDEM、TC-CONC、TC-TXN、TC-OUTBOX、TC-JOB、EV 证据 | 绑定状态和一致性证据 |
| Step 7 接口验收 | Command / Query / Event / Job 已有接口级裁决 | 避免重复接口验收,本步只看状态和副作用 |

依赖的前序 Step：Step 1~7 已确认。

## 3. SOP 问题回答

1. 哪些合法状态迁移必须通过?

   回答：P0 必须覆盖 `Draft -> InReview -> Published`、`Published -> Deprecated / Retired / Superseded`、baseline `Prepared -> Released`、snapshot `Building -> Ready`、fact `Pending -> Published / Failed`、projection stale / rebuilding / active、reference pending / resolved / stale / invalidated 等状态主线。当前测试方案直接覆盖的重点是 draft / review / publish / retire、snapshot ready、projection rebuild 和 outbox / fact delivery。

2. 哪些非法迁移必须拒绝?

   回答：必须拒绝 Published 回到 Draft、Retired 继续迁移、gate 未通过却发布、fingerprint mismatch 发布、缺 reason 的退役 / 废弃、stale version 写入、P1 的 `InReview -> Draft` 退回草稿和 snapshot supersede 在 P0 暴露。非法迁移失败时必须保持原状态。

3. 哪些事务必须原子提交?

   回答：Command 写路径的 idempotency reserve、truth save、audit append、outbox append、idempotency complete 必须在同一事务或等价原子边界内成立;发布基线必须与 definition 发布同事务;snapshot metadata、audit 和 outbox 必须一致;audit 静默失败和 truth + outbox 半提交均不可接受。

4. 哪些幂等和并发行为必须成立?

   回答：同 key 同 payload 必须 replay 既有 receipt;同 key 不同 payload 必须 conflict;expected version 并发写只能一个成功;snapshot derive 重跑不得生成重复快照;projection rebuild watermark 不得倒退;outbox relay 多 worker 或重放不得重复完成或生成新 truth。

5. 失败时如何判定不通过?

   回答：非法状态被接受、失败路径留下成功副作用、truth / audit / outbox 半提交、audit 静默失败、幂等 key 被错误复用、expected version 被覆盖、projection 反写真相、snapshot metadata 与 asset fingerprint 不一致、outbox relay 丢事件或伪成功,均导致本步验收失败。其中 truth + outbox 半提交、audit 静默失败、失败伪成功进入 Step 11 一票否决候选。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §5 / §8 | 旧文档只写 replay、consume drift 和 S/A 缺陷 | 没有覆盖新版状态机、事务、幂等、并发和副作用断言 |
| `06-验收标准.md` 全文 | 没有列出合法 / 非法状态迁移 | 无法判断状态机失败是否阻断验收 |
| `06-验收标准.md` 全文 | 没有 truth + audit + outbox 原子边界 | 关键一致性红线缺失 |
| `06-验收标准.md` 全文 | 没有幂等 replay、payload conflict、expected version 冲突规则 | 重复调用和并发写入无法裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态验收 | 未展开 | 定义合法迁移、非法迁移和 P1 不暴露迁移 | 对齐详细设计 §9 |
| 事务验收 | 旧 replay / compare | 明确 command、release、snapshot、audit、outbox、projection 事务边界 | 对齐详细设计 §10 |
| 幂等验收 | 未展开 | 同 key replay、payload conflict、job 重跑幂等 | 对齐详细设计 §12 |
| 并发验收 | 未展开 | expected version 和 projection watermark | 防止覆盖 truth 或倒退读面 |
| 副作用断言 | 未写 | 每条门禁都包含状态、truth、audit、outbox、projection 或 snapshot 副作用 | 满足 SOP 要求 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只要求 P0 用例通过,不单列状态和事务门禁 | 文档短 | 无法知道失败破坏了哪个不变量 | 不采用 |
| B. 把所有状态机都作为 P0 完整验收 | 最严格 | 会把 P1 package lifecycle、snapshot supersede 等提前纳入 P0 | 不采用 |
| C. P0 只验已设计并被 05 覆盖的状态、事务、幂等和并发主线;P1 状态不暴露 | 边界清楚,证据可定位 | 需要记录未覆盖状态风险 | 采用 |

## 7. 结构化中间产物

### 7.1 状态、事务与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-CONS-001 | 契约定义生命周期合法迁移 | `Draft -> InReview -> Published` 主线成立;发布后可进入 Deprecated / Retired / Superseded 的 P0 允许路径;receipt、audit、outbox 对齐 | 合法迁移失败;Published 回 Draft;Retired 继续迁移;状态变化无审计或 outbox | `TC-CMD-003`、`TC-CMD-005`、`TC-CMD-006`;EV-UNIT-001、EV-SVC-001、EV-AUDIT-001 |
| AC-CONS-002 | 发布前置条件和非法迁移拒绝 | gate fail、fingerprint mismatch、缺前置条件时不得发布;原状态保持 | gate fail 被发布;失败后生成 Released baseline;原状态被改写 | `TC-CMD-004`;EV-SVC-001、EV-INT-001 |
| AC-CONS-003 | P1 状态迁移不暴露为 P0 | `InReview -> Draft`、snapshot supersede、package write protocol 等 P1 迁移不出现在 P0 command / schema / 验收门禁中 | P1 迁移成为 P0 必填入口或被 P0 测试要求 | API surface scan、EV-SCOPE-001 |
| AC-CONS-004 | Command 写路径原子边界 | idempotency reserve、truth save、audit append、outbox append、idempotency complete 同事务或等价原子成立 | truth 成功但 audit / outbox 缺失;idempotency complete 与 truth 不一致;半提交 | `TC-OUTBOX-001`、`TC-TXN-001`;EV-INT-001、EV-AUDIT-001 |
| AC-CONS-005 | audit 不得静默失败 | audit append 失败时 command / job 失败或事务回滚,不得伪成功 | audit 失败但 command 返回成功;trace / audit 缺口无法追溯 | `TC-TXN-001`、`TC-AUDIT-001`;EV-AUDIT-001、EV-INT-001 |
| AC-CONS-006 | outbox 与 truth 一致 | 已提交事实必须有 outbox event;relay publish fail 后保留 pending / failed;重放不产生新 truth | truth 成功但无 outbox;relay 失败丢事件;重放生成新 truth | `TC-OUTBOX-001`、`TC-OUTBOX-002`;EV-CONTRACT-002、EV-INT-001 |
| AC-CONS-007 | 幂等 replay 与 payload conflict | 同 key 同 payload replay 既有 receipt;同 key 不同 payload 返回 conflict;不新增 truth / outbox | 重复提交生成新 truth / outbox;不同 payload 复用 key 成功 | `TC-IDEM-001`、`TC-IDEM-002`;EV-SVC-001 |
| AC-CONS-008 | expected version 并发冲突 | 两个写者修改同一 definition 时只有一个成功;后写返回 conflict;truth 不被覆盖 | 后写覆盖前写;两个写入都成功;版本号不稳定 | `TC-CONC-001`;EV-CONC-001、EV-INT-001 |
| AC-CONS-009 | snapshot 派生一致性 | snapshot metadata 与 asset fingerprint 匹配;同 baseline + job id / fingerprint 重跑不生成重复快照 | metadata 与资产不匹配;重跑生成重复快照;Ready 后回到 Building | `TC-JOB-002`;EV-WORKER-001 |
| AC-CONS-010 | projection stale / rebuild 一致性 | stale 显式暴露;rebuild 后 watermark 前进且不倒退;projection 不反写真相 | stale 被当作 current;watermark 倒退;projection rebuild 修改 truth | `TC-QUERY-002`、`TC-JOB-003`;EV-WORKER-001、EV-INT-001 |
| AC-CONS-011 | reference / resolver fail closed | reference 不可解析或 resolver 配置错误时不发布,不补造正文,错误可诊断 | 引用失败默认放行;source missing 被 job 伪成功;临时补造正文 | `TC-CONFIG-003`、`TC-JOB-004`;EV-CONFIG-001、EV-WORKER-001 |
| AC-CONS-012 | 最小闭环一致性 | draft -> review -> publish -> snapshot -> query -> fact -> relay boundary 全链状态和证据一致 | 任一状态跳转、receipt、snapshot、trace、outbox evidence 不一致 | `TC-E2E-001`;EV-E2E-001、EV-TRACE-001、EV-CONTRACT-002 |

### 7.2 P0 / P1 状态边界表

| 状态主题 | P0 验收 | P1 / 后续 |
|---|---|---|
| ContractLifecycleState | Draft、InReview、Published、Deprecated、Retired、Superseded 主线和终态保护 | review reject / rollback 体验 |
| ContractReleaseBaselineStatus | Prepared / Released 和 gate fail 不发布 | 更复杂多基线治理 |
| ContractReleaseSnapshotStatus | Building -> Ready,失败可重跑 | Ready -> Superseded |
| FactDeliveryStatus | Pending / Published / Failed,relay 可恢复 | 真实 L0-bus ack / dead-letter |
| ProjectionState | stale / rebuild / active,watermark 不倒退 | 大规模增量投影优化 |
| ContractPackageLifecycleState | 只保留只读 package view | package 写协议和完整包管理 |

### 7.3 一致性失败对最终结论的影响

| 情况 | 结论影响 |
|---|---|
| AC-CONS-001~AC-CONS-012 任一失败 | 不通过 |
| truth + audit + outbox 半提交 | 一票否决 |
| audit 静默失败或失败伪成功 | 一票否决 |
| reference fail open | 一票否决 |
| P1 状态未实现但未污染 P0 | 不阻断,进入风险或后续增强 |
| P1 状态污染 P0 command / schema / gate | 不通过 |

## 8. 回填草稿

```md
## 8. 状态机、事务与一致性验收

> 校准来源：
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“状态、事务与一致性验收表”“P0 / P1 状态边界表”和“一致性失败对最终结论的影响”小节,了解状态机和事务门禁如何从详细设计状态矩阵与 05 的一致性证据收敛。

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-CONS-001 | 契约定义生命周期合法迁移 | P0 合法迁移成立,receipt、audit、outbox 对齐 | 合法迁移失败、非法回退成功、终态继续迁移 | `TC-CMD-003`、`TC-CMD-005`、`TC-CMD-006`;EV-UNIT-001、EV-SVC-001、EV-AUDIT-001 |
| AC-CONS-002 | 发布前置条件和非法迁移拒绝 | gate fail、fingerprint mismatch、缺前置条件时不得发布 | gate fail 被发布或失败后生成 Released baseline | `TC-CMD-004`;EV-SVC-001、EV-INT-001 |
| AC-CONS-003 | P1 状态迁移不暴露为 P0 | P1 迁移不出现在 P0 command / schema / gate 中 | P1 迁移成为 P0 必填入口 | API surface scan、EV-SCOPE-001 |
| AC-CONS-004 | Command 写路径原子边界 | idempotency、truth、audit、outbox 同事务或等价原子成立 | truth 成功但 audit / outbox 缺失或半提交 | `TC-OUTBOX-001`、`TC-TXN-001`;EV-INT-001、EV-AUDIT-001 |
| AC-CONS-005 | audit 不得静默失败 | audit append 失败时 command / job 失败或事务回滚 | audit 失败但 command 返回成功 | `TC-TXN-001`、`TC-AUDIT-001`;EV-AUDIT-001、EV-INT-001 |
| AC-CONS-006 | outbox 与 truth 一致 | 已提交事实有 outbox,event id 稳定,relay fail 可恢复 | truth 成功但无 outbox,relay 失败丢事件 | `TC-OUTBOX-001`、`TC-OUTBOX-002`;EV-CONTRACT-002、EV-INT-001 |
| AC-CONS-007 | 幂等 replay 与 payload conflict | 同 key 同 payload replay,不同 payload conflict | 重复提交生成新 truth / outbox 或 key 被错误复用 | `TC-IDEM-001`、`TC-IDEM-002`;EV-SVC-001 |
| AC-CONS-008 | expected version 并发冲突 | 并发写只有一个成功,后写 conflict | 后写覆盖前写或两个写入都成功 | `TC-CONC-001`;EV-CONC-001、EV-INT-001 |
| AC-CONS-009 | snapshot 派生一致性 | metadata 与 asset fingerprint 匹配,重跑不重复 | metadata 与资产不匹配或重复快照 | `TC-JOB-002`;EV-WORKER-001 |
| AC-CONS-010 | projection stale / rebuild 一致性 | stale 显式暴露,watermark 前进且不倒退 | stale 被当作 current 或 projection 反写真相 | `TC-QUERY-002`、`TC-JOB-003`;EV-WORKER-001、EV-INT-001 |
| AC-CONS-011 | reference / resolver fail closed | 引用失败不发布、不补造正文、错误可诊断 | 引用失败默认放行或 source missing 伪成功 | `TC-CONFIG-003`、`TC-JOB-004`;EV-CONFIG-001、EV-WORKER-001 |
| AC-CONS-012 | 最小闭环一致性 | 最小闭环全链状态和证据一致 | 任一状态、receipt、snapshot、trace、outbox evidence 不一致 | `TC-E2E-001`;EV-E2E-001、EV-TRACE-001、EV-CONTRACT-002 |
```

## 9. 待确认事项

- 是否接受 P1 状态迁移未实现不阻断,但不得污染 P0 command / schema / gate。
- 是否接受 audit 静默失败和 truth + outbox 半提交进入 Step 11 一票否决。
- 是否接受本步只裁决状态 / 事务 / 一致性,性能阈值留到 Step 9。

## 10. 进入下一步条件

- [x] 状态和一致性门禁可裁决。
- [x] 合法迁移、非法迁移、事务、幂等、并发和恢复均有验收项。
- [x] 每条门禁都有明确副作用断言。
- [x] 可以进入 Step 9 定义非功能验收门禁。
