# L0-bus 06 验收标准 Step 5: 功能验收门禁

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 5 中间产物。
> 本步把 P0 / P0-min 功能需求、主处理流、测试用例和证据编号转换成可裁决的功能验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 定义功能验收门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §5 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 主闭环、P0-min 支撑边界和 P1/P2 非范围 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 继承固定 `<run_id>`、reports / artifacts / acceptance handoff 证据基线 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承进入验收前必须具备完整证据和三值退出结论 |
| `00-需求文档.md` §9 / §14 / §15 | 已完成 | 提取 F-001~F-008、需求验收方向和追溯矩阵 |
| `03-详细设计.md` §8 | 已完成 | 提取 publication、outbox、delivery、feedback、recovery、query、outbound event 等处理流 |
| `05-测试方案.md` §5 / §6 / §13 | 已完成 | 提取 TS-BUS、TC-BUS、EV-BUS、RP-BUS 和报告证据映射 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 功能的通过条件是什么?

P0 功能的通过条件不是“接口能调用”,而是对应功能在默认可验证路径上形成预期事实、状态、审计或只读输出,并且证据可追溯到固定 `<run_id>`。

| 功能 | 优先级 | 通过条件摘要 |
|---|---|---|
| F-001 契约绑定的发布材料接入 | P0 | 合法 core contract ref + payload ref / outbox fact 可被接受;非法材料被拒绝;不保存 payload body;接入结果有 audit |
| F-002 统一传递语义形成 | P0 | 合法发布材料能形成平台级 transport semantic;后端能力只作为引用或 capability;无裸 MQ 参数泄漏 |
| F-003 订阅与 delivery 推进 | P0 | scheduled delivery 能经默认后端路径推进到 dispatched / completed / failed;history 可追溯;批处理隔离成功和失败项 |
| F-004 delivery 结果与幂等锚点记录 | P0 | ack / fail / timeout / duplicate feedback 能形成结果、history 和 bus 级 idempotency anchor |
| F-005 失败恢复与死信 / replay 准备 | P0 | retry、dead-letter、replay preparation 均具备材料、状态、审计链和受控拒绝条件 |
| F-006 总线级审计、tap 和只读输出 | P0 | transport view、failure material、audit trail 可读且不反写 truth;governance-facing 输出不包含 decision body |
| 配置控制面 | P0 | JSON profile 可加载并验证 runtime graph;非法配置 fail-fast;secret unavailable / reload request fail-closed 或 rejected |
| 证据生成 | P0 | reports、artifact index、redaction check 和 acceptance index 能形成固定 `<run_id>` 证据链 |

### 3.2 每个 P0 功能的失败条件是什么?

失败条件必须能导致明确裁决。功能失败按影响分三类:主链失败、边界失败、证据失败。

| 失败类型 | 示例 | 裁决影响 |
|---|---|---|
| 主链失败 | 发布材料不能进入 bus、delivery 无法推进、feedback 不形成 history、recovery 无材料 | P0 不通过 |
| 边界失败 | payload body 持久化、裸后端参数进入语义、Query 写 truth、replay 绕过审计链 | 通常触发 S0 或 Step 6 / Step 11 红线 |
| 证据失败 | TC 结果缺失、EV 无法追溯、reports 使用 `latest`、artifact 路径非法 | 不得判定通过;严重时阻断进入验收 |

### 3.3 证据来自哪些测试用例或报告?

功能门禁的直接证据来自 `05-测试方案.md` 的 `TC-BUS-*` 用例族和 `EV-BUS-*` / `RP-BUS-*` 报告。

| 验收门禁族 | 测试用例 | 证据入口 |
|---|---|---|
| Publication | `TC-BUS-PUB-001`~`004` | `EV-BUS-PUB-*`、redaction evidence |
| Transport semantic | `TC-BUS-SEM-001`~`002` | `EV-BUS-SEM-*` |
| Delivery | `TC-BUS-DLV-001`~`004` | `EV-BUS-DLV-*` |
| Feedback | `TC-BUS-FDB-001`~`004` | `EV-BUS-FDB-*` |
| Recovery | `TC-BUS-REC-001`~`004` | `EV-BUS-REC-*` |
| Read-only output / audit | `TC-BUS-OUT-001`~`006` | `EV-BUS-OUT-*` |
| Outbox relay | `TC-BUS-OBX-001`~`002` | `EV-BUS-OBX-*` |
| Backend boundary | `TC-BUS-BND-001`~`003` | `EV-BUS-BND-*` |
| Config control plane | `TC-BUS-CFG-001`~`003` | `EV-BUS-CFG-*`、`config-summary.md` |
| Redaction / reports | `TC-BUS-RED-001`~`002` | `RP-BUS-RED-*`、`reports/runs/<run_id>`、`reports/acceptance` |

### 3.4 哪些 P1 功能只做后置边界验收?

P1/P2 不进入本步的完整功能门禁。它们只在当前验收中证明“不会污染 P0”,完整能力留给后续专项或对应仓库。

| P1/P2 能力 | 当前只验什么 | 不验什么 |
|---|---|---|
| production MQ / durable store adapter | port 语义、unsupported / unavailable / manual action、默认 path 不被破坏 | Kafka / NATS / Redis / RabbitMQ / DB 产品级行为 |
| secret provider / KMS / Vault | secret ref、fail-closed、raw secret 不落地 | 真实 provider 集成和密钥轮换 |
| observability dashboard / alerting | bus 输出 tap / audit / metrics material 接缝 | dashboard、长期存储、告警阈值 |
| governance workflow | failure material / dead-letter material 只读输出 | governance decision truth、审批流执行 |
| SDK 高层体验 | transport view、error contract、read-only 输出稳定 | 多语言 SDK、封装体验 |
| config center / hot reload | reload request 被拒绝或清晰 fail-fast | 热更新、admin override、远程配置中心 |
| DLQ Console UI | dead-letter material 可读 | Console UI 和交互操作 |
| exactly-once / effectively-once | at-least-once + bus idempotency anchor 可解释 | 全局 exactly-once 承诺 |

### 3.5 哪些功能失败会导致总体不通过?

以下失败默认导致总体“不通过”,不能降级为“有条件通过”。如果同时触发 S0,则在 Step 11 作为一票否决展开。

| 失败项 | 结论影响 |
|---|---|
| F-001~F-006 任一 P0 主链功能无通过证据 | 不通过 |
| F-007 / F-008 任一 P0-min 支撑边界不能支撑 F-001~F-003 | 不通过 |
| 配置控制面无法加载 P0 profile 或不能构建 runtime graph | 不通过 |
| redaction / reports / artifact index 缺失导致证据不可审计 | 不通过或阻断进入验收 |
| payload body、raw secret、backend private body 或 governance decision body 泄漏 | 进入 S0 一票否决 |
| replay 绕过 dead-letter / history / audit chain | 进入 S0 一票否决 |
| Query / projection 反写 bus truth | 进入 S0 一票否决 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 功能门禁沿用旧主线 | 仍可能围绕 envelope、routing、callback、projection 旧口径 | 与新版 F-001~F-008 不一致 | 本步改用 publication / semantic / delivery / feedback / recovery / read-only output 主线 |
| 功能门禁缺少失败条件 | 只写能力存在,没有写何时失败 | 无法裁决不通过 | 本步每个 AC-FUNC 都写失败条件 |
| 功能和红线混在一起 | payload、secret、Query 反写等边界既是功能负例又是一票否决候选 | 后续章节重复或遗漏 | 本步只把它们作为功能失败触发点,Step 6 / Step 11 再正式展开红线 |
| P0-min 容易被误认为 P1 | Outbox relay 和默认 backend path 看似接缝,但支撑主链 | P0 主闭环无落点 | 本步把 F-007 / F-008 列为 P0-min 硬门禁 |
| 配置和证据容易被排除在功能门禁外 | 配置、report 不是业务功能 | 实际验收无法进入 runtime 或无法审计 | 本步把配置控制面和证据生成作为 P0 支撑功能门禁 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 功能主语 | envelope / route / callback 等旧对象 | F-001~F-008 + config + evidence | 与新版需求和测试一致 |
| 门禁格式 | 功能可用式描述 | AC-FUNC ID、优先级、通过条件、失败条件、证据来源 | 可裁决 |
| P0 / P0-min | 边界不清 | P0 主链和 P0-min 支撑边界分别裁决 | 防止范围漂移 |
| 测试证据 | 泛称测试通过 | 精确到 TC / EV / report | 可追溯 |
| P1/P2 | 容易混入当前通过条件 | 只做后置边界验收和风险记录 | 防止验收越界 |

---

## 6. 验收设计取舍

### 6.1 是否按 F-001~F-008 一一生成功能门禁

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个功能需求一个门禁 | 与需求追溯清晰 | 配置和证据这类支撑能力需要额外补充 |
| B. 只按 P0 闭环大门禁写一条 | 文档短 | 失败时无法定位断点 |
| C. 按 F-001~F-008 生成,并补 config / evidence 支撑门禁 | 追溯清晰,也覆盖验收可运行性 | 表格稍长 | 采用 |

### 6.2 是否把 redaction / reports 放在功能门禁中

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 放入功能门禁 | 证据链和安全检查不会遗漏 | 与 Step 10 / Step 11 有交叉 |
| B. 完全放到 Step 10 / Step 11 | 职责纯粹 | Step 5 看不出 P0 功能如何被验收 |
| C. Step 5 只作为支撑功能门禁引用,Step 10 / Step 11 再展开证据和一票否决 | 避免遗漏又避免重复 | 需要交叉引用 | 采用 |

### 6.3 是否允许某个 P0 功能失败后有条件通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行灵活 | P0 主闭环不成立,结论失真 |
| B. 不允许 P0 / P0-min 功能失败有条件通过 | 结论可信 | 必须保证 P0 范围准确 | 采用 |
| C. 由签署人临时判断 | 灵活 | 不可审计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-FUNC-001 | F-001 契约绑定的发布材料接入 | P0 | 合法 core contract ref + payload ref / outbox fact 被接受;accepted / rejected 有明确事实和 audit;payload body 未被持久化 | 缺 core contract ref 仍 accepted;payload body 被保存;accepted / rejected 终态互改成功;无 audit | `TC-BUS-PUB-001`~`004`;`EV-BUS-PUB-*`;`RP-BUS-RED-*` |
| AC-FUNC-002 | F-002 统一传递语义形成 | P0 | accepted material + backend capability ref 形成平台级 transport semantic;不暴露 raw backend param | 裸 MQ 参数进入上层语义;backend private field 被接受;语义与 core contract 冲突 | `TC-BUS-SEM-001`~`002`;`EV-BUS-SEM-*` |
| AC-FUNC-003 | F-003 订阅与 delivery 推进 | P0 | scheduled delivery 可经默认后端路径推进到 dispatched / completed / failed;history append;批处理成功失败隔离 | delivery 卡在不可解释状态;completed 被 reopen;batch failure 污染成功项;backend unavailable 无失败或重试证据 | `TC-BUS-DLV-001`~`004`;`EV-BUS-DLV-*` |
| AC-FUNC-004 | F-004 delivery 结果与幂等锚点记录 | P0 | ack / fail / timeout / duplicate feedback 形成 result、history 和 idempotency anchor;同 key 同 digest 返回 existing result | duplicate 生成新 truth;同 key 不同 digest 未 conflict;unknown / late feedback 生成孤儿结果;history 缺失 | `TC-BUS-FDB-001`~`004`;`EV-BUS-FDB-*` |
| AC-FUNC-005 | F-005 失败恢复与死信 / replay preparation | P0 | failed delivery 可受控生成 retry plan、dead-letter material 和 replay preparation;缺 approval / audit chain 时 replay rejected | 非 failed delivery 创建 retry;missing material 仍 dead-letter;缺 approval / audit chain 仍 replay ready;replay 改写 delivery truth | `TC-BUS-REC-001`~`004`;`EV-BUS-REC-*` |
| AC-FUNC-006 | F-006 总线级审计、tap 和只读输出 | P0 | transport view、failure material、audit trail 可读;stale / missing projection 有一致性标记;Query 不写 truth;governance-facing 输出无 decision body | Query 触发写 UoW 或 rebuild;stale 被当 current;failure material 生成 governance decision;sequence 不单调 | `TC-BUS-OUT-001`~`006`;`EV-BUS-OUT-*` |
| AC-FUNC-007 | F-007 Outbox relay 边界承接 | P0-min | committed outbox fact 可被消费并形成 publication acceptance;source ref 唯一;duplicate / source ack failure 不生成重复 acceptance | 未提交 fact 推进为 bus truth;duplicate 生成新 acceptance;source ack failure 后重放破坏幂等 | `TC-BUS-OBX-001`~`002`;`EV-BUS-OBX-*` |
| AC-FUNC-008 | F-008 后端适配边界与默认可验证路径 | P0-min | backend capability available 时可 dispatch;unsupported / unavailable / uncertain commit 有明确证据;无 secret leak;默认 in-memory path 成立 | backend 差异改变上层 semantic;unsupported 被静默吞掉;commit uncertain 触发 unsafe retry;secret 泄漏 | `TC-BUS-BND-001`~`003`;`EV-BUS-BND-*` |
| AC-FUNC-009 | 配置控制面与 runtime graph | P0 | valid JSON profile 可构建 runtime graph;unsupported key / invalid enum / raw secret fail-fast;secret unavailable / reload request fail-closed 或 rejected | invalid config 仍启动 runtime;raw secret 被接受;secret unavailable 后继续危险运行;reload request 隐式生效 | `TC-BUS-CFG-001`~`003`;`EV-BUS-CFG-*`;`config-summary.md` |
| AC-FUNC-010 | reports / artifacts 证据生成 | P0 | 完成测试 run 后生成 `reports/runs/<run_id>`、`reports/acceptance` 和 `artifacts/test/<run_id>`;redaction check 通过;不使用 `latest` 或 `<project>` 层级 | report 缺失;artifact path 非法;证据无法从 AC / TC 追到 EV / artifact;forbidden body 出现在证据中 | `TC-BUS-RED-001`~`002`;`RP-BUS-RED-*`;`reports/runs/<run_id>` |

### 7.2 功能门禁到需求追溯表

| 验收项 ID | 需求 | 核心闭环 | 主要处理流 |
|---|---|---|---|
| AC-FUNC-001 | F-001 | CL-001 | `AcceptPublicationFlow`、`ConsumeCommittedOutboxFactFlow` |
| AC-FUNC-002 | F-002 | CL-002 | `AcceptPublicationFlow`、semantic derive |
| AC-FUNC-003 | F-003 | CL-003 | `RunDeliveryProgressionFlow`、`ConsumeBackendDeliverySignalFlow` |
| AC-FUNC-004 | F-004 | CL-004 | `RecordDeliveryFeedbackFlow` |
| AC-FUNC-005 | F-005 | CL-005 | `RequestRetryFlow`、`RunRetryCycleFlow`、`MoveDeliveryToDeadLetterFlow`、`PrepareReplayFlow` |
| AC-FUNC-006 | F-006 | CL-006 | `QueryReadOnlyFlow`、`OutboundEventPublishFlow` |
| AC-FUNC-007 | F-007 | CL-001 / CL-002 | `ConsumeCommittedOutboxFactFlow`、`RunOutboxRelayFlow` |
| AC-FUNC-008 | F-008 | CL-002 / CL-003 | `RunDeliveryProgressionFlow`、`CheckBackendCapabilityFlow` |
| AC-FUNC-009 | 配置支撑 | P0 支撑 | config load / validate / runtime build |
| AC-FUNC-010 | 证据支撑 | P0 支撑 | report generation / artifact layout / redaction check |

### 7.3 P1/P2 后置边界表

| 能力 | 当前验收口径 | 不通过触发点 | 后续归属 |
|---|---|---|---|
| production MQ / durable store adapter | 当前只要求 port、capability、unsupported / unavailable 语义不破坏 P0 | 对外宣称已交付但无 P1 专项证据;或污染 P0 semantic | P1 adapter 专项 |
| observability dashboard / alerting | 当前只要求 tap / audit / metrics material 输出接缝 | bus 无输出材料或输出不可追溯 | L4-observability |
| governance workflow | 当前只要求 failure material / dead-letter material 只读输出 | bus 直接生成 governance decision body | L1-governance |
| SDK convenience API | 当前只要求 transport view / error contract 可消费 | read-only output 不稳定或反写真相 | L0-sdk |
| config center / hot reload | 当前只要求 reload rejected / fail-fast | reload 隐式改变 runtime graph | P2 config / ops |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能门禁到需求追溯表”和“P1/P2 后置边界表”小节,了解本章如何把 F-001~F-008、配置控制面和证据生成转换为可裁决验收门禁。

本轮功能验收以 `AC-FUNC-001`~`AC-FUNC-010` 为裁决入口。`AC-FUNC-001`~`AC-FUNC-006` 对应 P0 事件传递主闭环,覆盖契约绑定发布材料接入、统一传递语义、delivery 推进、feedback / idempotency、retry / DLQ / replay preparation、总线级审计与只读输出。`AC-FUNC-007`~`AC-FUNC-008` 对应 P0-min 支撑边界,覆盖 Outbox relay 和默认 backend / store / fixture path。`AC-FUNC-009` 和 `AC-FUNC-010` 分别裁决配置控制面和证据生成能力。

任一 P0 主链功能没有通过证据,不得判定为通过或有条件通过。任一 P0-min 支撑边界失败并影响 P0 主链成立,不得判定为通过或有条件通过。配置控制面无法加载 P0 profile、构建 runtime graph 或正确拒绝非法配置时,不得判定通过。reports / artifacts / acceptance handoff 缺失、路径非法或证据不可追溯时,不得判定通过。

production MQ / durable store adapter、observability dashboard、governance workflow、SDK convenience API、config center / hot reload 等 P1/P2 能力不作为当前 P0 功能完整交付门禁。当前仅裁决它们的接缝和后置边界是否污染 P0 主链;完整产品能力进入对应后续仓库或专项验收。

---

## 9. 待确认事项

当前没有阻塞进入 Step 6 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 功能门禁是否只覆盖 F-001~F-008 | A. 只覆盖 F;B. 覆盖 F 并补 config / evidence;C. 按测试 suite 全部展开 | 采用 B | 配置和证据不是业务功能,但决定验收是否可运行和可审计 |
| P0 功能失败是否允许有条件通过 | A. 允许;B. 不允许;C. 签署时临时判断 | 采用 B | P0 主闭环失败时有条件通过会破坏验收结论可信度 |
| P1/P2 是否进入功能门禁表 | A. 全量进入;B. 只列后置边界表;C. 完全不提 | 采用 B | 防止 P1/P2 污染 P0,同时保留风险和后续归属 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 主链功能均有 AC-FUNC 门禁 | 已满足 |
| P0-min 支撑边界均有 AC-FUNC 门禁 | 已满足 |
| 每个门禁均包含通过条件、失败条件和证据来源 | 已满足 |
| P1/P2 后置边界已列出,未混入 P0 完整交付 | 已满足 |
| 功能失败与 Step 6 / Step 11 红线展开边界已区分 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 6,定义数据边界与架构红线验收。
