# L0-bus 05 测试方案 Step 6: 测试场景与用例矩阵

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 6 中间产物。
> 本步把 Step 5 的测试场景展开为可执行、可断言、可留证的测试用例矩阵。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 设计测试场景与用例矩阵 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §6 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | 已确认 | 继承 `TS-BUS` 场景、`TC-BUS` 用例编号族和 `EV-BUS` 证据编号族 |
| `05_test_plan_step_03_test_objects_slices.md` | 已确认 | 继承测试对象、测试切口和风险 |
| `05_test_plan_step_04_strategy_layers.md` | 已确认 | 继承测试层级和阻断策略 |
| `03-详细设计.md` §8 | 已完成 | 提取逐接口函数级处理流和写路径通用规则 |
| `03-详细设计.md` §9~§12 | 已完成 | 提取状态机、事务、一致性、错误、并发和幂等断言 |
| `03-详细设计.md` §13~§15 | 已完成 | 提取配置、观测、redaction 和脚本测试契约 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 正向主线怎么执行?

P0 正向主线按三个层次执行:

| 主线 | 执行方式 | 关键断言 |
|---|---|---|
| 发布到 delivery 主线 | `AcceptPublication` 或 `ConsumeCommittedOutboxFact` -> derive transport semantic -> `RunDeliveryProgression` | acceptance accepted、delivery dispatched / completed、history / audit append |
| feedback 到只读输出主线 | `RecordDeliveryFeedback` -> projection job -> Query transport view / history | feedback recorded、idempotency anchor、Query no-write、projection current / stale marker |
| 失败恢复主线 | failed delivery -> `RequestRetry` -> `RunRetryCycle` -> `MoveDeliveryToDeadLetter` -> `PrepareReplay` | retry / DLQ / replay preparation 状态和 audit chain 完整 |
| 配置与证据主线 | valid JSON profile -> runtime graph -> test gate -> report generator | validated config、redaction scan pass、artifacts / reports 生成 |

### 3.2 每个关键反向和边界场景如何触发?

| 边界类型 | 触发方式 | 预期结果 |
|---|---|---|
| core 契约缺失 | 提交缺少 core contract reference 的 publication | rejected / validation error,不写 accepted truth |
| payload 正文越界 | 在 command、event、projection 或 evidence 中注入 payload body | boundary violation,redaction gate fail |
| 裸后端参数泄漏 | 让 transport semantic 依赖 backend private field | semantic rejection 或 boundary violation |
| duplicate idempotency | same key same digest / same key different digest | existing result / conflict |
| 非法状态迁移 | 对 completed delivery 请求 reopen 或跳过 attempt | domain error / conflict |
| 缺失恢复材料 | 无 failure material / audit chain 时 prepare replay | rejected,不生成 ready |
| Query 写入 | Query 触发 projection rebuild 或 truth mutation | 测试失败,必须无写 UoW |
| 配置失效 | unsupported key、raw secret、secret unavailable、reload request | fail-fast / fail-closed / rejected |

### 3.3 每个状态非法迁移如何断言?

非法迁移必须在 domain unit 和 service test 两层断言:

| 状态机 | 非法迁移断言 | 推荐用例 |
|---|---|---|
| Publication acceptance | accepted / rejected 之间不能互改 | `TC-BUS-PUB-004` |
| Delivery lifecycle | completed 不得 reopen,不能跳过 attempt,backend raw status 不能直接写 truth | `TC-BUS-DLV-003` |
| Feedback result | feedback 不是多步生命周期,duplicate / late feedback 不得污染 truth | `TC-BUS-FDB-003` / `TC-BUS-FDB-004` |
| Retry plan | 非 failed delivery 不得创建 retry,exhausted 后不得继续 running | `TC-BUS-REC-001` |
| Dead letter | active DLQ 不能重复创建,closed / archived 后不得 replay | `TC-BUS-REC-002` |
| Replay preparation | 缺失 approval / audit chain 不得进入 ready | `TC-BUS-REC-003` |
| Projection | Query 不得把 stale 自动改为 current / rebuilding | `TC-BUS-OUT-002` |

### 3.4 每个事务回滚和副作用如何验证?

事务和副作用不只看最终状态,还要断言调用顺序和失败后的 evidence。

| 行为 | 验证方式 | 推荐用例 |
|---|---|---|
| 单 command 一个 UoW | fake UnitOfWork 记录 begin / save / commit 顺序 | `TC-BUS-PUB-001` |
| publisher failure 不回滚 truth | repository 已保存 acceptance / audit,publisher evidence 标记 retryable | `TC-BUS-OUT-006` |
| source ack failure 不回滚 truth | outbox fact 已接入,重复消费返回 existing | `TC-BUS-OBX-002` |
| projection failure 不回滚 truth | truth 保持,projection marker 为 stale / failed | `TC-BUS-OUT-002` |
| job item 独立事务 | 批量 job 中单 item 失败不影响其他 item summary | `TC-BUS-DLV-004` / `TC-BUS-REC-004` |
| commit uncertain | 返回 dependency / manual action evidence,不自动重试同事务 | `TC-BUS-BND-003` |

### 3.5 每个恢复场景如何复现?

恢复场景必须由可重复 fixture 构造,不依赖人工临时造数。

| 恢复场景 | 复现方式 | 关键断言 |
|---|---|---|
| retry allowed | 构造 failed delivery + retry policy ref + history | retry plan scheduled,audit append |
| retry exhausted | 构造 due retry plan 且 remaining attempts 为 0 | retry exhausted,不自动 DLQ |
| move to DLQ | 构造 failed delivery + feedback + failure material + history | DLQ created,failure material persisted |
| replay rejected | 构造 DLQ 但缺失 approval ref 或 audit chain | replay preparation rejected |
| replay ready | 构造 DLQ + approval ref + audit chain | replay preparation ready,event emitted |
| backend unavailable | fake transport backend 返回 unavailable | delivery failed / retryable evidence |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 用例不可直接执行 | 多为概念性测试项 | 开发者不知道前置条件、输入、断言和证据 | 本步使用用例矩阵补齐执行要素 |
| 旧 `05` 缺少反向和边界用例 | 只验证成功路径 | payload、replay、Query no-write、redaction 红线可能漏测 | 本步为关键边界单列用例 |
| 状态机与事务未转成用例 | 详细设计中有规则,测试方案未承接 | 非法迁移和副作用顺序无法验收 | 本步把状态机、UoW 和副作用变成断言 |
| 证据编号未落到用例 | Step 5 只有编号族 | Step 13 难以归档具体证据 | 本步为每条用例绑定证据编号 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 场景表达 | 只有追溯矩阵 | 场景表 + 用例矩阵 | 可执行 |
| 用例断言 | 不稳定 | 每条 P0 用例有断言点 | 可裁决 |
| 反向测试 | 分散 | boundary / invalid state / transaction / recovery 单列 | 覆盖红线 |
| 自动化 | 只说明必须自动化 | 每条用例标记自动化候选层级 | 支撑 Step 9 |
| 证据 | 只有编号族 | 每条用例绑定 `EV-BUS` / `RP-BUS` | 支撑 Step 13 |

---

## 6. 测试设计取舍

### 6.1 是否把全部字段级 schema 用例写进 Step 6

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个字段一个用例 | 极细 | 文档膨胀,难以 review | 不采用 |
| B. Step 6 写协议级 schema 用例族,字段细节由 contract tests 展开 | 粒度合适 | 具体字段要在实现测试中落细 | 采用 |
| C. 不写 schema 用例 | 简洁 | 协议破坏难以追溯 | 不采用 |

### 6.2 是否给每个 BR 单独写用例

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个 BR 单独用例 | 追溯直观 | 大量重复 | 不采用 |
| B. BR 复用功能 / 边界用例,矩阵中标注证据 | 覆盖完整且不重复 | 需要 Step 5 / Step 6 保持映射 | 采用 |
| C. BR 只人工审查 | 快 | 不符合 P0 自动化要求 | 不采用 |

### 6.3 是否把 P1 production adapter 写成当前用例

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 当前写真实 MQ / DB 产品用例 | 更接近生产 | 超出 P0 | 不采用 |
| B. 当前写 port / fake adapter / unsupported / unavailable 用例 | 守住接缝 | 不证明真实产品行为 | 采用 |
| C. 完全不写 adapter 用例 | 简单 | 无法证明 backend boundary | 不采用 |

---

## 7. 结构化中间产物

### 7.1 测试场景表

| 场景 ID | 场景名称 | 优先级 | 主要层级 | 必须覆盖的用例族 |
|---|---|---|---|---|
| TS-BUS-001 | 契约绑定发布材料接入 | P0 | Unit / Service / API | `TC-BUS-PUB-001`~`004` |
| TS-BUS-002 | 平台级传递语义形成 | P0 | Unit / Service | `TC-BUS-SEM-001`~`002` |
| TS-BUS-003 | delivery 推进与默认可验证路径 | P0 | Service / Integration / E2E | `TC-BUS-DLV-001`~`004` |
| TS-BUS-004 | feedback、history 与幂等锚点 | P0 | Unit / Service / API | `TC-BUS-FDB-001`~`004` |
| TS-BUS-005 | retry、DLQ 与 replay preparation | P0 | Unit / Service / E2E | `TC-BUS-REC-001`~`004` |
| TS-BUS-006 | audit、tap、transport view 与 failure material | P0 | Service / API / Contract | `TC-BUS-OUT-001`~`006` |
| TS-BUS-007 | Outbox relay 边界承接 | P0-min | Consumer / Integration | `TC-BUS-OBX-001`~`002` |
| TS-BUS-008 | backend adapter 接缝与 capability | P0-min | Integration / Job | `TC-BUS-BND-001`~`003` |
| TS-BUS-009 | 配置控制面与 runtime graph | P0 | Unit / Integration | `TC-BUS-CFG-001`~`003` |
| TS-BUS-010 | redaction、reports 与 artifacts 证据 | P0 | Snapshot / Release gate | `TC-BUS-RED-001`~`002` |

### 7.2 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| TC-BUS-PUB-001 | TS-BUS-001 | P0 | valid core contract ref + payload ref | 调用 `AcceptPublication` | publication accepted,audit append,event evidence | accepted truth、no payload body、UoW committed | service / API |
| TC-BUS-PUB-002 | TS-BUS-001 | P0 | missing core contract ref | 调用 `AcceptPublication` | rejected / validation error | no accepted truth、error code stable | unit / API |
| TC-BUS-PUB-003 | TS-BUS-001 | P0 | command 含 payload body | 调用 `AcceptPublication` | boundary violation | forbidden body not persisted / emitted | unit / API / redaction |
| TC-BUS-PUB-004 | TS-BUS-001 | P0 | accepted / rejected publication | 尝试终态互改 | domain error / conflict | final status immutable | unit / service |
| TC-BUS-SEM-001 | TS-BUS-002 | P0 | accepted material + backend capability ref | derive transport semantic | platform semantic created | no raw backend param in semantic | unit / service |
| TC-BUS-SEM-002 | TS-BUS-002 | P0 | backend private field 注入 semantic | derive / dispatch | rejected / boundary violation | backend difference not leaked | unit / service |
| TC-BUS-DLV-001 | TS-BUS-003 | P0 | scheduled delivery + fake backend success | run delivery progression | dispatched / completed | attempt recorded、history append | service / integration |
| TC-BUS-DLV-002 | TS-BUS-003 | P0 | scheduled delivery + backend unavailable | run delivery progression | failed or retryable evidence | no silent success、history / audit append | service / integration |
| TC-BUS-DLV-003 | TS-BUS-003 | P0 | completed delivery | 尝试 reopen / skip attempt | conflict / domain error | illegal transition rejected | unit / service |
| TC-BUS-DLV-004 | TS-BUS-003 | P0 | batch has success + failure item | run delivery job | partial success summary | per item UoW、failed item isolated | job runner |
| TC-BUS-FDB-001 | TS-BUS-004 | P0 | dispatched delivery | record ack feedback | completed + feedback result | feedback terminal、history append | service / API |
| TC-BUS-FDB-002 | TS-BUS-004 | P0 | existing idempotency key + same digest | repeat feedback | existing result | no duplicate truth | service / API |
| TC-BUS-FDB-003 | TS-BUS-004 | P0 | existing idempotency key + different digest | repeat feedback | conflict | no mutation、stable conflict | unit / service |
| TC-BUS-FDB-004 | TS-BUS-004 | P0 | unknown delivery or late feedback | record feedback | not found / conflict | no orphan feedback | service / API |
| TC-BUS-REC-001 | TS-BUS-005 | P0 | failed delivery + retry policy | request retry | retry plan scheduled | eligibility checked、audit append | unit / service |
| TC-BUS-REC-002 | TS-BUS-005 | P0 | failed delivery + failure material | move to dead letter | DLQ created | active DLQ unique、failure material linked | service / API |
| TC-BUS-REC-003 | TS-BUS-005 | P0 | DLQ missing approval / audit chain | prepare replay | replay rejected | no ready state、rejection evidence | unit / service / API |
| TC-BUS-REC-004 | TS-BUS-005 | P0 | DLQ + approval ref + audit chain | prepare replay | replay preparation ready | event evidence、audit chain kept | service / E2E |
| TC-BUS-OUT-001 | TS-BUS-006 | P0 | current transport projection | query transport view | read-only result | no write UoW、consistency marker | API / service |
| TC-BUS-OUT-002 | TS-BUS-006 | P0 | stale / missing projection | query transport view | stale / not found marker | Query does not rebuild | API / service |
| TC-BUS-OUT-003 | TS-BUS-006 | P0 | failure material + actor context | query failure material | authorized read or stable rejection | access audit、no truth write | API / service |
| TC-BUS-OUT-004 | TS-BUS-006 | P0 | failure material available | read governance-facing output | no governance decision body | boundary preserved | contract / API |
| TC-BUS-OUT-005 | TS-BUS-006 | P0 | audit trail with sequence | append / list audit | append-only chain | sequence monotonic、no overwrite | repository / service |
| TC-BUS-OUT-006 | TS-BUS-006 | P0 | publisher returns retryable failure | publish outbound event | truth not rolled back | publish evidence saved | service / integration |
| TC-BUS-OBX-001 | TS-BUS-007 | P0-min | committed outbox fact | consume outbox fact | publication accepted | committed fact only、source ref unique | consumer / integration |
| TC-BUS-OBX-002 | TS-BUS-007 | P0-min | duplicate fact or source ack failure | consume / reconsume | existing result | no duplicate acceptance | consumer / integration |
| TC-BUS-BND-001 | TS-BUS-008 | P0-min | backend capability available | check capability / dispatch | capability accepted | mapping allowed,no secret leak | integration / job |
| TC-BUS-BND-002 | TS-BUS-008 | P0-min | unsupported semantic or backend unavailable | dispatch / check | unsupported / unavailable evidence | no silent semantic change | integration |
| TC-BUS-BND-003 | TS-BUS-008 | P0-min | commit uncertain / adapter dependency error | run write flow | manual action / retryable evidence | no automatic unsafe retry | service / integration |
| TC-BUS-CFG-001 | TS-BUS-009 | P0 | valid JSON profile | load config + build runtime graph | validated runtime graph | defaults + overrides applied | config unit / integration |
| TC-BUS-CFG-002 | TS-BUS-009 | P0 | unsupported key / invalid enum / raw secret | load config | fail-fast | config rejected before runtime | config unit |
| TC-BUS-CFG-003 | TS-BUS-009 | P0 | secret unavailable or reload request | build / reload | fail-closed / rejected | no silent fallback,no hot reload | config integration |
| TC-BUS-RED-001 | TS-BUS-010 | P0 | artifacts with logs/events/projections | run redaction check | redaction report pass / fail | forbidden body absent | snapshot / release gate |
| TC-BUS-RED-002 | TS-BUS-010 | P0 | completed test run | generate reports | `reports/runs/<run_id>` created | summary,coverage,redaction refs exist | script / release gate |

### 7.3 用例到证据映射表

| 用例范围 | 证据编号 | 证据类型 |
|---|---|---|
| `TC-BUS-PUB-001`~`004` | `EV-BUS-PUB-001`~`004` | service/API result、audit snippet、negative error output |
| `TC-BUS-SEM-001`~`002` | `EV-BUS-SEM-001`~`002` | semantic assertion、backend boundary evidence |
| `TC-BUS-DLV-001`~`004` | `EV-BUS-DLV-001`~`004` | delivery history、job summary、state transition output |
| `TC-BUS-FDB-001`~`004` | `EV-BUS-FDB-001`~`004` | feedback result、idempotency anchor、conflict output |
| `TC-BUS-REC-001`~`004` | `EV-BUS-REC-001`~`004` | retry / DLQ / replay preparation evidence |
| `TC-BUS-OUT-001`~`006` | `EV-BUS-OUT-001`~`006` | query output、audit chain、publisher evidence |
| `TC-BUS-OBX-001`~`002` | `EV-BUS-OBX-001`~`002` | consumer result、source ack / duplicate evidence |
| `TC-BUS-BND-001`~`003` | `EV-BUS-BND-001`~`003` | backend capability / dependency evidence |
| `TC-BUS-CFG-001`~`003` | `EV-BUS-CFG-001`~`003` | config validation output、runtime graph summary |
| `TC-BUS-RED-001`~`002` | `RP-BUS-RED-001`、`RP-BUS-SUM-001` | redaction report、run summary report |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“用例矩阵”和“用例到证据映射表”小节，了解本章测试场景和用例如何从需求追溯矩阵展开。

本章把 `TS-BUS-001`~`TS-BUS-010` 展开为可执行用例矩阵。每条 P0 / P0-min 用例必须包含前置条件、输入或操作、预期结果、断言点、自动化候选层级和证据编号。用例不能只写“调用接口并观察成功”,必须断言状态、history、audit、UoW、副作用、错误映射或 redaction 结果。

当前用例覆盖 publication acceptance、transport semantic、delivery progression、feedback / idempotency、recovery、read-only output、outbox relay、backend boundary、config control plane 和 redaction / reports。P1 production adapter 和 P2 config center / hot reload 不在当前用例矩阵中展开。

---

## 9. 待确认事项

当前没有阻塞进入 Step 7 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把字段级 schema 全部列成用例 | A. 全部列出;B. 保留协议级 schema 用例族;C. 不列 schema | 采用 B | Step 6 需要可 review,字段细节由具体 contract tests 实现 |
| 是否把 redaction 单独成场景 | A. 单独成 TS-BUS-010;B. 只嵌入各用例;C. 只人工审查 | 采用 A | redaction 是验收红线,需要独立报告和统一扫描 |
| 是否把 reports generation 作为 release gate 用例 | A. 是;B. 否;C. 仅 Step 13 讨论 | 采用 A | 如果不能生成报告,测试结果无法交给 `06` 裁决 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个 P0 正向主线已有可执行用例 | 已满足 |
| 关键反向和边界场景已有触发方式 | 已满足 |
| 状态非法迁移已有断言用例 | 已满足 |
| 事务和副作用已有断言用例 | 已满足 |
| 恢复场景已有可复现用例 | 已满足 |
| P0 用例均有断言点和自动化候选 | 已满足 |
| 用例到证据编号已建立映射 | 已满足 |

结论: 可以进入 Step 7,设计测试数据。
