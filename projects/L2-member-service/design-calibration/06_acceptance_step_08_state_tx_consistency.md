# Step 8. 定义状态机、事务与一致性验收 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填章节：`06-验收标准.md` §8 状态机、事务与一致性验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义状态机、事务与一致性验收 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 7；`03` §9~§12；`05` TC-STATE / IDEMP / CMD / QUERY / JOB；`04` failure / builder 口径 |
| 输出文件 | `design-calibration/06_acceptance_step_08_state_tx_consistency.md` |
| 当前模块 | `state_axes`、`uow_atomicity`、`idempotency_concurrency` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 正式状态轴、合法 / 非法迁移、终态保护、UoW 原子写集、Query no-write、Job no-truth-repair、duplicate / revision / unknown 规则均已可裁决 |
| next_allowed_action | 进入 Step 9，定义非功能验收门禁 |

### 1.1 Step 内计划

- [x] 读取协议闭环、详细设计状态 / UoW / 幂等和测试用例。
- [x] 回答状态、事务、一致性和并发问题。
- [x] 诊断旧验收的万能状态、成功推导和事务缺证据问题。
- [x] 选择按正交状态轴 + 写集 + unknown fence 验收。
- [x] 产出状态 / 一致性验收表、闭环矩阵、失败裁决、停审和跨状态审计。
- [x] 形成 §8 回填草稿并自检。

## 2. 本步目标

把 `03` 的正式状态、状态迁移、UoW、expected revision、幂等 reservation、stable key、cursor、rollback 和 commit unknown 规则转成验收门禁。必须证明状态不会跨轴推导、accepted 写集不会部分提交、Query 不写、Job 不修复 truth、重复 / 迟到 / unknown 不产生第二副作用。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 正交状态轴与禁止矩阵 | `03` §9 | 正式状态名和合法迁移 |
| UoW / cursor / outbox / projection | `03` §10 | 原子性和副作用断言 |
| 错误 / 恢复 | `03` §11 | conflict、unknown、rollback 裁决 |
| 并发 / 幂等 | `03` §12 | reservation、digest、single-winner、旧世代保护 |
| 测试切口 | `05` §6、§14 | TC 与 EV 入口 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些合法状态迁移必须通过？ | 每个正式状态轴的 `03` allowed transition 必须由唯一 writer、正式 reason / source / revision 和适用 generation 写入；核心例包括 intent `Received→Accepted/Rejected/Conflicted`、decision `Proposed→Committed/Voided`、readiness 的共同前置、host current single-winner、attempt / cleanup / outbox / handoff 的同 key 推进。 | `03` §9.1~§9.2 |
| 哪些非法迁移必须拒绝？ | terminal / closed / superseded 再迁移、跨轴推导、旧 generation 覆盖 current、Consumer 直接写 Ready/Healthy/Recovery、Job 创建 decision/generation、outbox Submitted 推 Delivered/Accepted、cleanup Succeeded 推 external complete 均拒绝。 | `03` §9.3 |
| 哪些事务必须原子提交？ | accepted Command 的 truth、HostChangeCursor、history/material、outbox、projection stale、stored result、reservation completion 必须同一 UoW；source / feedback / maintenance marker 使用独立 reference 写集且 receipt/report 同步提交。 | `03` §8.6、§10.2 |
| 哪些幂等 / 并发行为必须成立？ | same key + same digest replay 同一 stored surface；different digest stable conflict；in-flight 不产生第二 writer；current host / session single-winner；old cursor / generation no-op；unknown 保留原 key。 | `03` §12 |
| 失败如何判定不通过？ | partial write、cursor 泄漏、stored result 缺失仍返回 accepted、Query / Job 写 truth、unknown 盲重放、旧世代覆盖、非法迁移被接受或状态名漂移均不通过；涉及红线时触发 VETO。 | `05` TC-STATE / IDEMP；`00` VF |
| 是否存在旧状态名或 phase 越界？ | 旧 06 使用“active / unhealthy / recycled”等口语描述；本 Step 只允许 `03` 正式状态族。`HostChangeCursor` / `CommittedChangeCursor` 的 exact type 仍 pending，但语义分工必须保持。 | `03` §9、§10.3；ledger blocker |
| 每项能否回指状态矩阵、flow、TC、EV、report？ | 可以。§8.2 按状态 / 事务主题映射 `03` §9~§12、`TC-STATE-*` / `TC-IDEMP-*` / `TC-QUERY-NEG-001` / `TC-JOB-NEG-001`、`EV-MS-*` 和固定 report。 | 06 书写规范 §5.8 |
| 每项是否完成停审？ | 是；逐项审查正式状态名、触发 flow、副作用断言、unknown / phase fence 和证据入口。 | 06 SOP Step 8 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §4~§7 | 用“active / unhealthy / recycled”一类万能状态，无法区分 readiness、session、health、closure 和 handoff | 按 `03` 正交状态轴验收 |
| 旧 `06` 功能门禁 | 只验证最终“成功”，没有非法迁移、终态保护和 phase boundary | 增加合法 / 非法迁移、terminal、层级不推导 |
| 旧 `06` 事务描述 | 未要求 history/material/outbox/result 同 UoW，未检查 rollback / commit unknown | 增加写集和 unknown 恢复门禁 |
| 旧 `06` 重试 | 可能把 timeout / adapter success 当可重试或成功 | 保留 stable key、hold / gap / reconcile，不盲重放 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态 | 万能 HostStatus | 23 个正交状态轴 / 状态族 | 避免跨语义推导 |
| 事务 | “保存成功” | truth + cursor + sidecar + result + reservation 原子写集 | 可审计 |
| Query / Job | 未单独验副作用 | no-write / no-truth-repair 硬门禁 | 保持 owner |
| unknown | 默认重试或失败 | 原 key + Unknown/Held/Gap + reconcile | 防不可逆重复 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否建立万能 `HostStatus` 验收项 | A. 建立；B. 按正式正交状态轴 | 采用 B，正式状态名可定位到 `03` |
| commit unknown 是否可直接补偿重试 | A. 直接重试；B. 查原 key / result 后 reconcile | 采用 B，禁止猜测副作用 |
| Query / Job 是否允许“顺便修复” | A. 允许；B. 严格 no-write / no-truth-repair | 采用 B |
| cursor 是否可作为 revision | A. 可复用；B. 语义分离 | 采用 B；exact type pending 也不改变语义 |

## 8. 结构化中间产物

### 8.1 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 | 裁决影响 |
|---|---|---|---|---|---|
| `AC-MS-STATE-001` | 正式状态名与合法迁移 | 仅使用 `03` 状态族；每条 allowed transition 有唯一 writer、reason、source、revision / generation | 口语 / 测试状态、非法或跨轴迁移被接受 | `EV-MS-DOMAIN-001`; `EV-MS-IDEMP-001` | 失败则不通过 |
| `AC-MS-STATE-002` | 终态 / supersede 保护 | `Closed`、`Superseded`、终态 marker 只能按正式 supersede / new fact flow 变化，history 保留 | 终态原地改写、旧 history 删除或无 relation | `EV-MS-DOMAIN-001`; `EV-MS-CMD-001` | 可能触发 VF-MS-006 |
| `AC-MS-TX-001` | Command UoW 原子性 | truth、cursor、history/material、outbox、projection stale、stored result、reservation completion 同 UoW | 任一 sidecar / result / reservation 缺失仍可见 accepted truth | `EV-MS-CMD-001`; `EV-MS-MATERIAL-001` | 失败则不通过 |
| `AC-MS-TX-002` | Consumer / Job 写集边界 | Consumer 只写 safe snapshot / marker / receipt；Job 只写已提交 work / report / derived state | 创建 intent / decision / generation、修复 source truth | `EV-MS-CONSUMER-001`; `EV-MS-JOB-001` | 可能触发 VF-MS-007 |
| `AC-MS-TX-003` | Query no-write | 6 Query 不 reserve、不写 UoW、不 refresh / rebuild / repair / append / publish | 任一 Query 改 truth、projection、reference、outbox 或 report | `EV-MS-QUERY-001` | 可能触发 VF-MS-007 |
| `AC-MS-IDEMP-001` | same / different digest | same key + same digest replay exact stored surface；different digest stable conflict | 覆盖 reservation、二次 transition、重跑外部动作 | `EV-MS-IDEMP-001`; `EV-MS-CMD-001` | 可能触发 VF-MS-006 |
| `AC-MS-IDEMP-002` | expected revision / single-winner | current pointer、对象、marker、projection 使用 expected revision；竞争 loser reload / held | None upsert 覆盖、第二 current / session、旧 cursor 覆盖新状态 | `EV-MS-IDEMP-001`; `EV-MS-DOMAIN-001` | 失败则不通过 |
| `AC-MS-IDEMP-003` | commit / rollback unknown | 先查原 key / result / truth，再 replay 或 reconcile；rollback unknown 有 safe diagnostic | 盲重跑、补偿写、吞掉 rollback 不确定性 | `EV-MS-IDEMP-001`; `EV-MS-REPORT-001` | 可能触发 VF-MS-006/009 |
| `AC-MS-IDEMP-004` | external effect / handoff key fence | timeout / unknown 保留原 effect / cleanup / publication / handoff key，进入 hold / gap | 换 key 盲重放、由 receipt 推 accepted | `EV-MS-IDEMP-001`; `EV-MS-JOB-001` | 可能触发 VF-MS-006/007 |
| `AC-MS-IDEMP-005` | old generation / cursor fence | old generation feedback、older cursor 只写 late / unknown / gap / no-op，不覆盖 current | 旧反馈改变 current 或新 projection | `EV-MS-CONSUMER-001`; `EV-MS-IDEMP-001` | 失败则不通过 |

### 8.2 状态 / 事务闭环矩阵

| 主题 | 设计契约 | 触发 flow | 测试用例 | EV / report | 裁决影响 |
|---|---|---|---|---|---|
| intent / decision | `03` §9.1~§9.2、§8.2 | Accept / Decide | `TC-STATE-001/002`;`TC-INTENT-*`;`TC-DECISION-*` | `EV-MS-DOMAIN-001`;`EV-MS-CMD-001` / `contract-domain-fast.md`;`service-flow-fast.md` | 非法或隐式决定不通过 |
| qualification / assembly / readiness | `03` §9.1~§9.2 | Resolve / Coordinate | `TC-DOMAIN-003`;`TC-QUAL-*`;`TC-ASSEMBLY-*` | `EV-MS-DOMAIN-001`;`EV-MS-CONFIG-001` | partial 不得 Ready |
| host / session / health | `03` §9.1~§9.3 | Generation / Registration / Health | `TC-STATE-003`;`TC-REG-*`;`TC-HEALTH-*` | `EV-MS-DOMAIN-001`;`EV-MS-CONSUMER-001` | 旧世代不得覆盖 current |
| closure / handoff | `03` §9.1~§9.4、§10.4 | Close / Cleanup / Publish / Feedback | `TC-CLOSE-*`;`TC-CONSUMER-004/005`;`TC-JOB-003/005/007` | `EV-MS-JOB-001`;`EV-MS-MATERIAL-001` | completion 层级不可推导 |
| UoW / reservation | `03` §10.2、§12.3~§12.4 | all Command / Consumer / Job | `TC-CMD-NEG-*`;`TC-IDEMP-001~010` | `EV-MS-CMD-001`;`EV-MS-IDEMP-001` | partial / unknown 不得 accepted |

### 8.3 一致性失败裁决表

| 失败场景 | 必须保持 | 禁止动作 | 结论影响 |
|---|---|---|---|
| expected revision conflict | rollback 当前写集，返回 `Conflict` | merge / last-write-wins | P0 失败若覆盖 |
| stored result missing | consistency defect，查原 key / manual recovery | 从 current truth 重算 | 不得通过 |
| external timeout / commit unknown | 原 key + `Unknown/Held/Gap` | 换 key / 盲重试 | 可能 VETO |
| projection rebuild failure | source truth 不变，view `Stale/Degraded/Unavailable` | Query 内修复 / 反写 source | 触发 no-write 失败 |
| duplicate consumer / publisher / job | replay stored receipt / report 或 reload / skip | 二次 mutation | 触发幂等失败 |
| old generation feedback | late / unknown / gap / history | 覆盖 current | 触发 generation fence 失败 |

### 8.4 状态 / 事务验收项停审记录

| 验收项 | 状态名审查 | 副作用审查 | unknown / phase 审查 | 结论 |
|---|---|---|---|---|
| `AC-MS-STATE-001~002` | 使用 `03` 正式状态族 | writer / relation 明确 | terminal / supersede 清楚 | 通过 |
| `AC-MS-TX-001~003` | 不引入新状态 | UoW / no-write 写集明确 | rollback / commit unknown 有路径 | 通过 |
| `AC-MS-IDEMP-001~005` | key / cursor / revision 语义分离 | duplicate / race 不二次写 | unknown 保留原 key | 通过 |

### 8.5 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在万能状态或口语状态 | 未发现 | 正式正文只引用 `03` 状态族 |
| 是否存在非法迁移缺证据 | 未发现设计缺口 | 真实 run 必须覆盖 `TC-STATE-002/003` |
| 是否存在 accepted truth 部分提交 | 未发现设计缺口 | UoW / rollback 由 `EV-MS-CMD-*` 验证 |
| Query no-write / Job no-truth-repair | 已覆盖 | 入口负向和 write spy 由 `05` 承接 |
| cursor / revision / generation / key 是否混用 | 未发现 | exact cursor type 仍 pending，不改变语义 fence |
| P1 / sibling 是否越过状态门禁 | 未发现 | blocked / unknown / residual，不计 ready |

## 9. 回填草稿

正式 §8 应以 `03` 正式状态族、合法 / 非法迁移、终态保护、UoW 原子写集、Query no-write、Consumer / Job no-truth-repair、expected revision、幂等 reservation、stable key、generation / cursor fence 和 commit / rollback unknown 为验收主题。每项必须有通过 / 失败条件和未来 `EV-MS-*` / report 入口；状态名不得使用旧口语名，unknown 不得盲重放。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| `HostChangeCursor` / `CommittedChangeCursor` exact type | UoW / marker 证据 schema | 语义已固定，类型待上游 / 实现闭合 |
| durable reservation / lease 产品 | 并发和重放性能 | P0 只验 Port / fake parity，产品行为后置 |
| Core/Bus feedback layer receipt | handoff 状态推进 | `MSVC-UP-007` pending，保留 gap / unknown |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 合法 / 非法状态门禁清楚 | 通过 | 见 §8.1~§8.2 |
| UoW / rollback / commit unknown 可裁决 | 通过 | 见 §8.3 |
| Query no-write / Job no-truth-repair 已覆盖 | 通过 | 见 §8.1、§8.5 |
| 幂等 / 并发 / generation fence 已停审 | 通过 | 见 §8.4 |
| 跨状态审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 9 | 通过 | 定义非功能验收门禁 |
