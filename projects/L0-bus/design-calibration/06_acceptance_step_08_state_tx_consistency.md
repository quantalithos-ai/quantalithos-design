# L0-bus 06 验收标准 Step 8: 状态机、事务与一致性验收

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 8 中间产物。
> 本步把状态机合法 / 非法迁移、事务原子性、锁与版本、幂等、并发和失败副作用转换成可裁决的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义状态机、事务与一致性验收 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §8 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §9 | 已完成 | 提取 7 类状态机、允许迁移、禁止迁移和跨状态机禁止规则 |
| `03-详细设计.md` §10 | 已完成 | 提取 repository 约束、UnitOfWork、事务边界、锁、版本和唯一约束 |
| `03-详细设计.md` §11 | 已完成 | 提取错误分层、version conflict、duplicate、commit uncertain、publisher failure 和 projection stale 处理 |
| `03-详细设计.md` §12 | 已完成 | 提取幂等键、重复调用处理和关键并发场景 |
| `05-测试方案.md` §6 / §10 / §11 | 已完成 | 提取状态机用例、UoW / consistency、idempotency / concurrency、S0/S1 分级 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承 Query 不写 truth、projection 不反写、replay 不绕过 audit chain 等红线 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已确认 | 继承 Command / Event / Job 的事务和幂等验收边界 |

---

## 3. SOP 问题回答

### 3.1 哪些合法状态迁移必须通过?

合法状态迁移必须覆盖 bus truth 状态机、recovery 状态机和只读 projection 状态机。验收时不要求每个枚举值都有独立人工签署,但测试证据必须证明关键合法迁移可执行且副作用一致。

| 状态机 | 合法迁移 | 验收口径 |
|---|---|---|
| Publication acceptance | `Draft -> Accepted`、`Draft -> Rejected` | 合法发布材料 accepted,非法材料 rejected;结果事实、audit、outbound evidence 一致 |
| Delivery lifecycle | `Scheduled -> Dispatched -> Completed`、`Dispatched -> Failed/TimedOut`、`Failed -> RetryScheduled/DeadLettered` | delivery 推进、失败、超时、重试和死信均有 history / audit |
| Feedback result | ack / fail / timeout 生成终态结果 | feedback 一次生成即终态,并绑定 delivery、history 和 idempotency anchor |
| Retry plan | `Draft -> Scheduled`, due retry 产生 attempt,耗尽后 exhausted | retry 只对 eligible failed delivery 生效,耗尽不自动 DLQ |
| Dead letter | created 后可 replay prepared 或 archived | DLQ 创建必须绑定 failure material,active DLQ 不重复创建 |
| Replay preparation | `Draft -> Ready` 或 `Draft -> Rejected` | ready 必须具备 approval ref、DLQ、history、audit chain;缺失则 rejected |
| Read projection | missing / stale / rebuilding / current | projection 只表达只读新鲜度;rebuild 由 job 触发,Query 只返回 marker |

### 3.2 哪些非法迁移必须拒绝?

非法迁移必须拒绝,并且拒绝本身不能产生半状态、孤儿 history 或隐藏写副作用。

| 非法迁移 / 行为 | 期望拒绝方式 |
|---|---|
| accepted / rejected publication 互相改写 | domain error / conflict,不改变已成立 truth |
| completed delivery reopen 或跳过 attempt | conflict / domain error,不追加错误 history |
| backend raw status 直接写入 `DeliveryStatus` | boundary violation 或 normalization failure |
| duplicate feedback 改变已成立 delivery 状态 | duplicate / existing result,不改写 delivery |
| same idempotency key + different digest | `409 ConflictError`,不写新 truth |
| 非 failed delivery 创建 retry | domain error / conflict,不创建 active retry |
| exhausted retry 继续 running | domain error / skipped item |
| archived / closed DLQ 被 replay | conflict / rejected |
| 缺 approval / audit chain 进入 replay ready | replay rejected,不得 ready |
| Query 触发 projection rebuild 或写 truth | stable read response + consistency marker,无写 UoW |

### 3.3 哪些事务必须原子提交?

事务验收必须证明关键 truth、history、audit、idempotency、outbox evidence 的提交顺序和失败处理符合设计。

| 事务场景 | 原子性要求 |
|---|---|
| 写 Command | 单 command 一个 UoW;truth、history / audit、idempotency anchor、outbound evidence 在事务规则内一致 |
| Inbound Event | 单 event / fact 一个 UoW;duplicate 不重复写 truth;source ack 在 truth commit 后执行 |
| Operations Job | 每个业务 item 一个 UoW;job summary 单独记录;partial success 不污染失败 item |
| Feedback | feedback result、idempotency anchor、delivery history、audit 强一致 |
| Recovery | retry / DLQ / replay preparation 与 failure material、history、audit chain 强一致 |
| Publisher | truth 已提交后发布;publish 失败写 retry evidence,不回滚 truth |
| Projection | 异步派生;projection 失败不回滚 truth |
| Query | 无写 UoW;不得打开隐式写事务 |

### 3.4 哪些幂等和并发行为必须成立?

幂等和并发验收必须证明重复请求、重复事件、重复 job item、并发推进和发布重试不会生成重复 truth 或不一致状态。

| 场景 | 必须成立的行为 |
|---|---|
| same idempotency key + same digest | 返回 existing result,不重复写 truth |
| same idempotency key + different digest | 返回 conflict,不 mutation |
| same event id + same source ref + same digest | existing / duplicate result |
| same event id + different source / digest | rejected / conflict |
| same job run + same item key | skip 或 previous item result |
| new job run 扫描已处理 item | 根据当前状态 skip / existing |
| 两个 worker 推进同一 delivery | lock + expected version,其中一个成功,另一个 version conflict |
| feedback 与 timeout 并发 | feedback unique + delivery lock,结果为 duplicate / conflict,无孤儿 feedback |
| retry 与 DLQ 并发 | delivery lock + recovery policy,冲突可见,不产生双恢复路径 |
| projection rebuild 与 incremental 并发 | projection version conflict 或受控合并,不反写真相 |
| source ack 失败后重复消费 | idempotency anchor 返回 existing result |
| publisher retry 重复发布 | publish evidence unique,existing receipt 视为成功 |

### 3.5 失败时如何判定不通过?

状态、事务和一致性失败比普通功能失败更危险,因为它们会破坏可追溯性和恢复可信度。

| 失败类型 | 验收结论影响 |
|---|---|
| P0 合法迁移无法完成 | S1,总体不通过 |
| 非法迁移被接受 | S1;如触发 replay 绕过、Query 写 truth、forbidden body 泄漏则升级 S0 |
| truth / history / audit / idempotency 半状态 | S0 或 S1,取决于是否破坏可审计链 |
| Query 打开写事务或自动 rebuild truth | S0 候选,Step 11 汇总 |
| same key different digest 未 conflict | S1,幂等边界失败 |
| 并发推进产生双 truth 或不可解释终态 | S1;若证据不可追溯则升级 S0 |
| publish failure 回滚 truth | S1,破坏 truth 提交语义 |
| projection failure 回滚 truth | S1,破坏只读派生边界 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 状态机在 `03` 中已定义,但验收未形成门禁 | 只知道有哪些状态,不知道如何裁决 | 非法迁移可能被漏验 | 本步生成状态迁移门禁 |
| 事务规则容易被写成实现细节 | UoW、source ack、publisher failure、projection failure 分散在详细设计 | 验收无法判断半状态 | 本步把关键事务原子性转成验收项 |
| 幂等和并发容易被合并到功能测试 | duplicate、version conflict、job item retry 没有独立裁决 | 重复 truth 和并发错写难以发现 | 本步单列幂等 / 并发门禁 |
| Query / projection 边界同时属于红线和一致性 | Step 6 已定义红线,但事务侧还需证明无写 UoW | 只写红线不足以裁决事务副作用 | 本步补充无写事务和 projection version 验收 |
| 失败严重度不清 | 同样是状态失败,有些 S1,有些 S0 | 验收结论不稳定 | 本步先定义影响,Step 11 汇总一票否决 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 状态迁移 | 分散在概要 / 详细设计 | 合法迁移和非法迁移均有验收口径 | 可裁决 |
| 事务原子性 | 作为实现契约存在 | 写 Command、Event、Job、Feedback、Recovery、Publisher、Projection 都有门禁 | 可审计 |
| 幂等 | 只在接口和测试中出现 | key / digest / event / job item / publish receipt 均有裁决 | 防重复 truth |
| 并发 | 作为风险或测试切口 | delivery、feedback、retry、projection、source ack、publisher retry 均有并发口径 | 防竞态 |
| 失败影响 | 缺少统一严重度 | S0 / S1 / S2 承接关系明确 | 支撑 Step 11 / Step 12 |

---

## 6. 验收设计取舍

### 6.1 是否逐个枚举值展开为验收项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个 enum value 单独一条验收项 | 极细 | 表格过长,且很多状态需要结合流转才有意义 |
| B. 按状态机和关键迁移展开 | 可读,能覆盖 P0 风险 | 需要证据矩阵确保无漏项 | 采用 |
| C. 只写“状态机测试通过” | 简短 | 不可裁决 | 不采用 |

### 6.2 是否把 projection rebuild 失败视为 P0 不通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 任意 projection 失败都 P0 不通过 | 严格 | 会把可恢复派生失败等同 truth 失败 |
| B. projection 失败不回滚 truth;若导致 P0 read-only output 无证据则不通过 | 区分 truth 和 snapshot | 需要读模型证据 | 采用 |
| C. projection 失败只作风险 | 过宽 | 可能导致 F-006 无法验收 | 不采用 |

### 6.3 是否允许 publish failure 回滚 truth

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许回滚 truth | 事件和 truth 更同步 | 会破坏已提交事实和 source ack 语义 |
| B. truth commit 后发布,失败写 retry evidence,不回滚 truth | 符合 outbox / eventually publish 语义 | 需要 evidence 和重试处理 | 采用 |
| C. publish failure 忽略 | 简单 | 事件丢失不可审计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-STATE-001 | Publication acceptance 状态机 | `Draft -> Accepted / Rejected` 成立;accepted / rejected 终态互改被拒绝;接入结果有 audit | 终态互改成功;rejected fact 无法追溯;accepted 缺 audit | `TC-BUS-PUB-001`~`004`;`EV-BUS-PUB-*` |
| AC-STATE-002 | Delivery lifecycle 状态机 | `Scheduled / Dispatching / Delivered / Completed / Failed / DeadLettered` 迁移符合设计;`RunDeliveryProgression` 只推进到 `Delivered / Failed`;`Completed` 由 feedback ack 推动;timeout 表达为 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed`;history append | completed reopen;跳过 attempt;backend raw status 直接写入 | `TC-BUS-DLV-001`~`004`,`TC-BUS-FDB-001`~`004`;`EV-BUS-DLV-*`,`EV-BUS-FDB-*` |
| AC-STATE-003 | Feedback result 状态机 | ack / fail / timeout 一次生成终态;duplicate 不改变已成立 delivery | feedback 被当多步生命周期;late / unknown feedback 生成孤儿结果 | `TC-BUS-FDB-001`~`004`;`EV-BUS-FDB-*` |
| AC-STATE-004 | Recovery 状态机 | retry、DLQ、replay preparation 分段受控;ready 依赖 approval / DLQ / history / audit chain | retry exhausted 自动 DLQ;缺材料 replay ready;replay 直接改 delivery | `TC-BUS-REC-001`~`004`;`EV-BUS-REC-*` |
| AC-STATE-005 | Projection 状态机 | missing / stale / rebuilding / current 只影响只读新鲜度;Query 返回 marker;rebuild 由 job 触发 | Query 写 truth;stale 当 current;projection 改写 bus truth | `TC-BUS-OUT-001`~`002`;`EV-BUS-OUT-*` |
| AC-TX-001 | 写 Command 原子性 | 单 command 一个 UoW;truth、history / audit、idempotency、outbound evidence 一致 | 任一半状态;truth 成功但 audit / idempotency 缺失;rollback 后残留 truth | `EV-BUS-CONS-001`;service tests |
| AC-TX-002 | Inbound Event 事务 | 单 event / fact 一个 UoW;source ack 在 commit 后;ack 失败重复消费走幂等 | ack 先于 commit;ack 失败后重复写 truth;duplicate event 产生重复副作用 | `TC-BUS-OBX-*`;consumer tests |
| AC-TX-003 | Operations Job item 事务 | 每 item 一个 UoW;job summary 单独记录;partial success item 隔离 | 一个 item 失败回滚成功 item;job_run_id 被当业务幂等键;summary 不可审计 | `TC-BUS-DLV-004`;job runner tests |
| AC-TX-004 | Publisher / projection 副作用 | truth 提交后发布;publish failure 写 retry evidence 不回滚 truth;projection failure 不回滚 truth | publish failure 回滚 truth;projection failure 改 truth;retry evidence 缺失 | `TC-BUS-OUT-006`;`EV-BUS-CONS-001` |
| AC-IDEM-001 | Command / feedback 幂等 | same key + same digest 返回 existing;different digest conflict;无重复 truth | same digest 重复写;different digest 未 conflict;duplicate 改状态 | `TC-BUS-FDB-002`~`003`;`EV-BUS-IDEM-001` |
| AC-IDEM-002 | Event / source 幂等 | same event + same source 返回 existing / duplicate;不同 source / digest rejected / conflict | duplicate event 重复 acceptance;source ack failure 造成重复 truth | `TC-BUS-OBX-002`;consumer evidence |
| AC-IDEM-003 | Job / publisher 幂等 | same job item skip / previous result;publisher duplicate receipt 视为成功 | job 重跑重复写 truth;publisher retry 生成重复 event truth | job evidence;publisher sink evidence |
| AC-CONC-001 | 并发推进控制 | delivery lock + expected version 生效;并发 worker 只有一个成功,另一个 conflict | 双写 delivery;version conflict 被吞掉;状态不可解释 | `EV-BUS-IDEM-001`;concurrency tests |
| AC-CONC-002 | 并发 feedback / timeout / recovery | feedback unique、delivery lock、recovery policy 生效;冲突可见且无孤儿事实 | timeout 与 feedback 双终态;retry 与 DLQ 双恢复路径 | `EV-BUS-IDEM-001`;`EV-BUS-REC-FAULT-001` |

### 7.2 状态、事务与证据映射表

| 主题 | 主要用例 / 证据 | 必须检查的副作用 |
|---|---|---|
| Publication | `TC-BUS-PUB-*` | acceptance truth、audit、idempotency、redaction |
| Delivery | `TC-BUS-DLV-*` | delivery status、attempt、history、backend evidence |
| Feedback | `TC-BUS-FDB-*` | feedback result、idempotency anchor、history、conflict |
| Recovery | `TC-BUS-REC-*` | retry plan、DLQ、replay preparation、approval / audit chain |
| Read projection | `TC-BUS-OUT-*` | no write UoW、consistency marker、projection version |
| Outbox relay | `TC-BUS-OBX-*` | source ref unique、event idempotency、source ack after commit |
| Backend boundary | `TC-BUS-BND-*` | normalized signal、manual action evidence、no unsafe retry |
| Cross-cutting consistency | `EV-BUS-CONS-001` | UoW order、no half-state、publisher / projection failure behavior |
| Idempotency / concurrency | `EV-BUS-IDEM-001` | existing / conflict / version conflict |

### 7.3 状态与事务裁决图

图类型: 状态与事务裁决图

图标题: L0-bus 状态迁移、事务和副作用裁决边界

```text
Command / Event / Job item
  -> validate input / idempotency
  -> begin UnitOfWork
       -> load current truth with lock / version
       -> apply domain transition
       -> append history / audit
       -> bind idempotency / evidence
  -> commit UnitOfWork
       -> publish event / ack source / update projection
            -> success: record receipt / marker
            -> retryable failure: record evidence, do not rollback truth

Query
  -> read projection / truth view
  -> return view or consistency marker
  X no write UnitOfWork
```

关键说明:

- 状态迁移必须先通过 domain transition guard。
- 写路径必须在 UoW 内形成 truth、history / audit、idempotency 的一致关系。
- publisher、source ack 和 projection 是提交后的副作用,失败不得回滚已提交 truth。
- Query 只能读取和返回一致性标记,不能启动写事务或自动修复 truth。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“状态与一致性验收表”“状态、事务与证据映射表”和“状态与事务裁决图”小节,了解本章如何把状态机、事务、幂等和并发转换为验收门禁。

本轮状态机、事务与一致性验收以 `AC-STATE-001`~`AC-STATE-005`、`AC-TX-001`~`AC-TX-004`、`AC-IDEM-001`~`AC-IDEM-003` 和 `AC-CONC-001`~`AC-CONC-002` 为裁决入口。状态机验收覆盖 Publication acceptance、Delivery lifecycle、Feedback result、Retry / DLQ / Replay preparation 和 Read projection。合法迁移必须可执行,非法迁移必须被拒绝且不得产生半状态、孤儿 history 或隐藏写副作用。

写 Command 必须以单 command 一个 UnitOfWork 提交;Inbound Event 必须以单 event / fact 一个 UnitOfWork 提交;Operations Job 必须以每个业务 item 一个 UnitOfWork 提交,job summary 单独记录。truth、history / audit、idempotency anchor、failure material 和 outbound evidence 必须形成一致关系。publisher、source ack 和 projection 是 truth 提交后的副作用,失败时必须写 retry / manual action evidence,不得回滚已提交 truth。

幂等与并发验收必须证明 same idempotency key + same digest 返回 existing result,same key + different digest 返回 conflict;重复 event、重复 source fact、重复 job item 和 publisher retry 不得生成重复 truth。并发 worker、feedback 与 timeout、retry 与 DLQ、projection rebuild 与 incremental 并发时,必须通过 lock、expected version、unique constraint 或 projection version 产生可解释结果。

---

## 9. 待确认事项

当前没有阻塞进入 Step 9 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 状态验收是否逐个 enum value 展开 | A. 每个值独立;B. 按状态机和关键迁移;C. 只写状态机测试通过 | 采用 B | 可读且覆盖 P0 风险,不把验收表写成枚举清单 |
| projection failure 是否直接 P0 不通过 | A. 任意失败都不通过;B. 不回滚 truth,但 P0 read-only output 无证据则不通过;C. 只作风险 | 采用 B | 区分 truth 和派生视图,同时保证 F-006 可验收 |
| publish failure 是否回滚 truth | A. 回滚;B. 不回滚,写 retry evidence;C. 忽略 | 采用 B | 符合 outbox / eventually publish 语义,且可审计 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 合法状态迁移必须通过的范围已定义 | 已满足 |
| 非法状态迁移必须拒绝的范围已定义 | 已满足 |
| 写 Command / Event / Job / Publisher / Projection / Query 事务副作用已定义 | 已满足 |
| 幂等和并发行为已定义 | 已满足 |
| 失败时 S0 / S1 影响口径已定义 | 已满足 |
| 每个状态与一致性门禁均有证据来源 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 9,定义非功能验收门禁。
