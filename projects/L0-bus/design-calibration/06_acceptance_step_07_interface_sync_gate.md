# L0-bus 06 验收标准 Step 7: 接口、事件与跨仓同步验收

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 7 中间产物。
> 本步定义 Command、Query、Inbound Event、Outbound Event、Operations Job 和跨仓接缝的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 定义接口、事件与跨仓同步验收 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §7 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` §8 / §10 | 已完成 | 提取编译期、运行期、事件协作和只读消费边界 |
| `02-概要设计.md` §7 / §8 | 已完成 | 提取 Command / Query / Event / Job 骨架和主要处理流 |
| `03-详细设计.md` §7 / §8 / §13 | 已完成 | 提取协议总表、公共协议约定、错误映射、逐接口处理流和外部依赖绑定 |
| `05-测试方案.md` §6 / §8 / §9 / §13 | 已完成 | 提取 `TC-BUS-*`、gate suites、reports / artifacts 和依赖类型证据 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承功能门禁到接口、事件和 job 的映射 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承只读不反写、forbidden body、P1/P2 不污染 P0 的边界红线 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 Command / Query 如何验收?

Command 验收关注输入协议、幂等、状态副作用、审计和错误映射。Query 验收关注只读语义、projection consistency marker、access audit 和不写 truth。

| 协议族 | 验收口径 | 关键证据 |
|---|---|---|
| `AcceptPublication` | HTTP JSON route 能接受合法发布材料并拒绝非法材料;写入 acceptance / audit;幂等键和 request digest 生效 | `TC-BUS-PUB-*`、contract / API tests |
| `RecordDeliveryFeedback` | feedback route 能记录 ack / fail / timeout;duplicate 同 key 同 digest 返回 existing;不同 digest conflict | `TC-BUS-FDB-*` |
| `RequestRetry` | retry request 只对 eligible failed delivery 生效;已有 active plan 不重复创建 | `TC-BUS-REC-001` |
| `MoveDeliveryToDeadLetter` | 只对满足条件的 failed delivery 创建 DLQ 和 failure material | `TC-BUS-REC-002` |
| `PrepareReplay` | replay preparation 必须验证 approval ref、DLQ、history 和 audit chain;缺失时 rejected | `TC-BUS-REC-003`~`004` |
| 7 个 Query API | 读取 publication、delivery、history、transport view、failure summary、audit trail、backend health;不写 truth;stale / missing 有 marker | `TC-BUS-OUT-001`~`006` |

### 3.2 每个 P0 Event 如何证明可消费 / 可重放?

Inbound Event 必须证明可重复消费且不生成重复 truth。Outbound Event 必须证明基于已提交 truth 发布,失败时保留 retryable evidence,且 payload 不越界。

| Event 方向 | 协议 | 验收口径 |
|---|---|---|
| Inbound | `ConsumeCommittedOutboxFact` | `event_id + source_ref + idempotency_key` 幂等;只承接 committed outbox fact |
| Inbound | `ConsumeBackendDeliverySignal` | backend signal 被 normalization;private body 不进入 truth;duplicate signal 可判定 |
| Inbound | `ConsumeTimeoutSignal` | timeout signal 对 eligible delivery 生效;重复或状态冲突不会产生孤儿反馈 |
| Outbound | 9 个 `bus.*.v1` event | 只传播已提交 fact 或只读材料;schema 可验证;publish failure 不回滚 truth |
| Replay / reconsume | inbound event / outbound event evidence | 固定 `<run_id>` 下可通过 fixture replay 或 in-memory sink 复核 |

### 3.3 每个 P0 Job 如何证明幂等和恢复?

Operations Job 的验收不要求真实调度系统完整上线,但必须证明 job input、job_run_id、item key、checkpoint / cursor、partial success 和每 item 事务边界成立。

| Job | 验收口径 | 关键证据 |
|---|---|---|
| `RunOutboxRelay` | 每个 outbox fact 一个 item;duplicate fact 不重复 acceptance;source unavailable 有 retryable summary | `TC-BUS-OBX-*`、job runner tests |
| `RunDeliveryProgression` | 每个 delivery item 独立推进;backend success / unavailable / conflict 可区分;partial success 不污染其他 item | `TC-BUS-DLV-*` |
| `RunRetryCycle` | due retry 产生受控 attempt;exhausted 不自动 DLQ;backend failure 留证据 | `TC-BUS-REC-*` |
| `RunReadOutputProjection` | 增量更新 projection;失败不反写 truth;stale / current 可判定 | `TC-BUS-OUT-*` |
| `RebuildReadProjection` | 由受控 job / operator 触发;dry run、batch replace、version conflict 有证据 | projection / read-output gate |
| `CheckBackendCapability` | 更新 backend health view / capability evidence;不直接改变 delivery truth | `TC-BUS-BND-*` |

### 3.4 跨仓同步成功标准是什么?

跨仓同步成功不是“所有下游仓都实现完”,而是 L0-bus 自身的输入、输出和边界接缝可被固定证据证明。

| 协作对象 | 成功标准 |
|---|---|
| `L0-core` | `core-contracts` path dependency 可编译;bus 使用 core event envelope / metadata / trace / actor / error contract,不重新定义共享契约 |
| 发布方仓 | 合法发布材料或 committed outbox fact 可进入 bus;未提交或重复 fact 被拒绝或幂等处理 |
| 订阅方仓 | delivery / feedback 协议可通过 fixture 或 fake subscriber 证明;业务副作用不归 bus 裁决 |
| MQ backend / store | 当前 P0 可使用 fake / in-memory 证明 port 语义;真实 adapter 只作为 P1-risk |
| Outbound publisher | in-memory sink / fake publisher 能证明 `bus.*.v1` event schema、retryable publish failure 和 evidence |
| `L0-sdk` / observability / governance | transport view、tap、failure material、audit material 可读;不要求下游产品完整实现 |

### 3.5 下游未就绪时如何验接缝?

下游未就绪不应阻断 L0-bus P0,但必须用 fixture、fake、contract test 或 in-memory sink 证明接缝。

| 下游未就绪对象 | 当前验收替代方式 | 不允许的误判 |
|---|---|---|
| 发布方业务仓 | committed outbox fact fixture、publication command fixture | 要求业务仓真实代码参与验收 |
| 订阅方业务仓 | fake subscriber、feedback fixture、timeout signal | 把业务副作用幂等纳入 bus 验收 |
| Observability | tap / audit material snapshot、fake consumer | 要求 dashboard / long-term store 完成 |
| Governance | failure material / DLQ summary contract、fake consumer | 要求审批流或 decision truth 完成 |
| SDK | transport view / error contract contract test | 要求多语言 SDK 完整实现 |
| MQ / store 产品 | in-memory backend / store、adapter unavailable evidence | 要求生产 MQ / durable DB 成为 P0 前置 |

### 3.6 跨仓验收项分别属于哪类依赖?

L0-bus 只有一个 P0 编译期跨仓依赖: `L0-core shared contracts`。其他协作应按运行期依赖、事件协作依赖或只读消费边界验收。

| 验收对象 | 全局依赖类型 | 验收方式 |
|---|---|---|
| `L0-core shared contracts` | 编译期依赖 | package dependency / contract compile / dependency snapshot |
| MQ backend、store、secret provider | 运行期依赖 | port / adapter / fake / in-memory / unavailable evidence |
| 发布方、订阅方 | 事件协作依赖 | publish / subscribe / feedback / replay fixture |
| Outbound publisher | 事件协作依赖 | event schema、sink evidence、retryable publish evidence |
| `L0-sdk`、observability、governance、operator | 只读消费边界 / 事件协作 | query / projection / outbound event / fake consumer evidence |

### 3.7 每类依赖应使用什么验收证据?

| 依赖类型 | 正确证据 | 错误证据 |
|---|---|---|
| 编译期依赖 | Cargo path dependency、lockfile / dependency snapshot、contract compile test | 手写同名 DTO 或复制 core schema |
| 运行期依赖 | adapter port test、fake / in-memory integration、config summary、unavailable / unsupported evidence | 强制真实 MQ / DB / KMS 成为 P0 前置 |
| 事件协作依赖 | event fixture、consumer replay、publisher sink、idempotency evidence、schema validation | 要求上下游仓源码直接依赖 bus |
| 只读消费边界 | query result、projection snapshot、access audit、fake downstream consumer | 要求 SDK / observability / governance 产品功能完整上线 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 接口、事件和 job 容易混成一个“API 通过” | 旧文档没有按协议族和依赖类型拆开 | 失败时无法判断是 route、event、job 还是跨仓接缝问题 | 本步按 Command / Query / Event / Job 分门禁 |
| 跨仓同步容易被误解成下游完整实现 | bus 输出给 SDK、observability、governance | P0 被未实现下游阻塞 | 本步固定“验接缝,不验下游完整产品” |
| 编译期依赖和事件协作依赖混淆 | 可能要求业务仓源码直接依赖 bus | 破坏全局依赖方向 | 本步只有 `L0-core` 是编译期依赖,其余按 port / event / query 验收 |
| Event 可消费 / 可重放证据不清 | 只说发布事件,没有证明 idempotency / replay | 事件协作不可审计 | 本步要求 event_id、source_ref、sink evidence 和 replay fixture |
| Job 幂等和恢复边界容易遗漏 | job 被当成批处理黑盒 | partial success、cursor、unsafe retry 无法裁决 | 本步单列 6 个 Operations Job 门禁 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 接口门禁 | 泛称 API / event 可用 | Command、Query、Inbound Event、Outbound Event、Job 分别裁决 | 可定位 |
| 跨仓依赖 | 容易要求下游完整实现 | 编译期、运行期、事件协作、只读消费边界分开 | 不越界 |
| 证据来源 | 测试通过式描述 | contract compile、API / consumer / job tests、sink evidence、reports / artifacts | 可追溯 |
| 下游未就绪 | 可能阻断 P0 | 使用 fixture、fake、in-memory sink 验接缝 | 可交付 |
| P1 adapter | 可能被当 P0 | 只验 port 和 unavailable / unsupported evidence | 防止范围漂移 |

---

## 6. 验收设计取舍

### 6.1 是否逐个接口写验收项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个 Command / Query / Event / Job 全部逐条展开 | 最细 | 表格过长,且 Query / Event 有通用门禁 |
| B. 按协议族写门禁,关键协议列入通过条件 | 可读且可裁决 | 需要在证据中保持协议清单完整 | 采用 |
| C. 只写“接口全部通过” | 简短 | 不可审计 | 不采用 |

### 6.2 是否要求下游仓真实实现参与 P0 验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 要求全部下游真实实现 | 端到端更真实 | 当前范围越界,会阻塞 bus P0 |
| B. 当前使用 fixture / fake / contract / sink 验接缝 | 范围清晰,可验证 | 下游产品体验后续验收 | 采用 |
| C. 完全不验下游接缝 | 文档简单 | 无法证明 bus 输出可消费 | 不采用 |

### 6.3 是否把真实 MQ / durable store 作为 P0 前置

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 作为 P0 前置 | 更接近生产 | 与当前 P0 in-memory / fake 默认路径冲突 |
| B. 当前 P0 用 port + fake / in-memory,真实后端作为 P1-risk | 符合设计和测试基线 | 生产 adapter 风险后置 | 采用 |
| C. 完全不提真实后端 | 简洁 | 后续风险不透明 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| AC-IF-001 | 5 个 Command API | 运行期入口 | HTTP JSON -> application service | route、DTO、validation、idempotency、audit、错误映射与状态副作用均符合 `03` | route 缺失;幂等失效;错误映射错误;写入无 audit | `TC-BUS-PUB-*`、`TC-BUS-FDB-*`、`TC-BUS-REC-*`、API / contract tests |
| AC-IF-002 | 7 个 Query API | 只读消费边界 | HTTP JSON -> `ReadOutputService` | Query 不写 truth;stale / missing 返回 marker;敏感读写 access audit;view DTO 稳定 | Query 写 UoW;自动 rebuild truth;stale 当 current;view 泄漏 forbidden body | `TC-BUS-OUT-001`~`006`、read-only tests |
| AC-IF-003 | 3 个 Inbound Event Consumer | 事件协作依赖 | consumer / fixture replay -> application service | event envelope / metadata 可解析;event idempotency 成立;duplicate 不重复 truth;private body rejected | duplicate 生成新 truth;uncommitted fact 被接受;backend private body 入库 | `TC-BUS-OBX-*`、`TC-BUS-BND-*`、consumer tests |
| AC-IF-004 | 9 个 Outbound Event | 事件协作依赖 | committed truth -> outbox publisher / sink | 只基于已提交 fact 发布;schema / topic 可验证;publish retryable failure 有证据;forbidden body absent | 未提交 truth 发布;schema 破坏;publish failure 回滚 truth;event 泄漏正文 | `TC-BUS-OUT-006`、publisher sink evidence、redaction report |
| AC-IF-005 | 6 个 Operations Job | 运行期入口 / 事件协作 | scheduler / CLI / operator -> job runner | job_run_id、item key、cursor / checkpoint、partial success、每 item UoW、summary 均可审计 | job 重跑重复副作用;partial failure 污染成功项;cursor 丢失;unsafe retry | `TC-BUS-DLV-*`、`TC-BUS-REC-*`、`TC-BUS-OBX-*`、job runner tests |
| AC-IF-006 | `L0-core shared contracts` | 编译期依赖 | Cargo path dependency / contract compile | `core-contracts` 可编译;bus 不复制共享契约;dependency snapshot 固定 | bus 重新定义 Event / Error / Trace / Metadata / ActorRef;依赖缺失 | dependency snapshot、contract compile、`TC-BUS-PUB-*` |
| AC-IF-007 | MQ backend / store / secret provider | 运行期依赖 | port / adapter / fake / in-memory | P0 使用 fake / in-memory 证明 port 语义;unavailable / unsupported / secret unavailable 有稳定错误 | 真实产品依赖成为 P0 前置;adapter 错误静默吞掉;raw secret 泄漏 | `TC-BUS-BND-*`、`TC-BUS-CFG-*`、config summary |
| AC-IF-008 | 发布方 / 订阅方仓 | 事件协作依赖 | publication / outbox fact / delivery feedback fixture | committed fact、publication command、feedback fixture 能证明协作;业务副作用不纳入 bus truth | 要求业务仓源码直接依赖;未提交 fact 进入 bus;业务幂等归 bus | `TC-BUS-PUB-*`、`TC-BUS-OBX-*`、`TC-BUS-FDB-*` |
| AC-IF-009 | SDK / observability / governance / operator | 只读消费边界 / 事件协作 | query / projection / outbound event / fake consumer | transport view、tap、audit、failure material 可消费;downstream 未就绪时 fake consumer 可验 | 要求下游产品完整上线;failure material 生成 decision body;只读输出反写 truth | `TC-BUS-OUT-*`、fake consumer evidence、redaction report |

### 7.2 跨仓依赖类型与验收方式映射表

| 依赖类型 | L0-bus 对象 | 验收证据 | 不得要求 |
|---|---|---|---|
| 编译期依赖 | `L0-core shared contracts` | Cargo path dependency、contract compile、dependency snapshot | 不得复制 core DTO,不得直接依赖业务仓 |
| 运行期依赖 | store、backend、secret provider、publisher adapter | port tests、fake / in-memory integration、config summary、unavailable evidence | 不得要求真实 MQ / DB / KMS 作为当前 P0 前置 |
| 事件协作依赖 | 发布方、订阅方、outbound publisher、consumer replay | event fixture、in-memory sink、idempotency evidence、schema validation | 不得要求上下游仓源码相互依赖 |
| 只读消费边界 | SDK、observability、governance、operator | query result、projection snapshot、fake consumer、access audit | 不得要求下游完整产品实现 |

### 7.3 接口与跨仓协作验收图

图类型: 接口与跨仓协作图

图标题: L0-bus P0 接口、事件与依赖验收边界

```text
L0-core contracts
  --[compile]--> L0-bus contracts/domain

publisher / outbox fixture
  --[event/cmd]--> Command API / Inbound Event Consumer
                    -> application service
                    -> bus truth + audit
                    -> Outbound Event publisher
                         --[event]--> fake SDK / observability / governance consumer

subscriber / backend fixture
  --[feedback/signal]--> Command API / Inbound Event Consumer
                         -> delivery / feedback / recovery truth

operator / scheduler
  --[job/cmd]--> Operations Job / Recovery Command
                 -> controlled retry / DLQ / replay preparation

MQ / store / secret provider
  --[runtime port]--> fake / in-memory adapter for P0
```

关键说明:

- `L0-core` 是当前唯一 P0 编译期跨仓依赖。
- 发布方、订阅方和下游消费方按事件协作或只读消费边界验收,不要求源码直接依赖。
- MQ、store、secret provider 是运行期 port / adapter 依赖,当前 P0 用 fake / in-memory 验收。
- Outbound Event 只能传播已提交事实或只读材料,不能携带 forbidden body。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_07_interface_sync_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“接口 / 事件 / 同步验收表”“跨仓依赖类型与验收方式映射表”和“接口与跨仓协作验收图”小节,了解本章如何区分接口门禁、事件协作和跨仓依赖类型。

L0-bus 的接口、事件与跨仓同步验收以 `AC-IF-001`~`AC-IF-009` 为裁决入口。Command API 必须证明 route、DTO、validation、idempotency、audit、错误映射和状态副作用符合 `03-详细设计.md`;Query API 必须证明只读语义成立,不得写 truth 或自动 rebuild projection truth。

Inbound Event Consumer 必须证明 event envelope / metadata 可解析、事件幂等成立、重复事件不生成重复 truth,并且 backend private body 或未提交 fact 不进入 bus truth。Outbound Event 必须证明只基于已提交 fact 或只读材料发布,topic / schema 可验证,publish retryable failure 有证据,且 event payload 不携带 forbidden body。

Operations Job 必须证明 job_run_id、item key、cursor / checkpoint、partial success、每 item UoW 和 job summary 可审计。Job 重跑不得产生重复副作用,partial failure 不得污染成功 item,backend 或 publisher 失败必须形成 retryable evidence 或 manual action evidence。

跨仓验收必须区分依赖类型。`L0-core shared contracts` 是编译期依赖,通过 Cargo path dependency、contract compile 和 dependency snapshot 验收。MQ backend、store、secret provider 和 publisher adapter 是运行期依赖,当前 P0 通过 port、fake / in-memory integration、config summary 和 unavailable evidence 验收。发布方、订阅方、SDK、observability、governance 和 operator 通过事件协作或只读消费边界验接缝,不要求下游完整产品实现。

---

## 9. 待确认事项

当前没有阻塞进入 Step 8 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否逐个 Command / Query / Event / Job 全量展开 | A. 全量逐条;B. 按协议族门禁并列完整清单;C. 只写接口通过 | 采用 B | 能保持可读性,同时保留协议清单和证据追溯 |
| 下游未就绪是否阻断 P0 | A. 阻断;B. 使用 fixture / fake / sink 验接缝;C. 不验下游接缝 | 采用 B | L0-bus 不替下游验完整产品,但必须证明输出可消费 |
| 真实 MQ / durable store 是否作为 P0 前置 | A. 是;B. 否,当前用 port + fake / in-memory;C. 完全不提 | 采用 B | 与 `03` 和 `05` 的 P0 默认可验证路径一致 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 Command / Query 验收口径已定义 | 已满足 |
| P0 Inbound / Outbound Event 验收口径已定义 | 已满足 |
| P0 Operations Job 幂等和恢复验收口径已定义 | 已满足 |
| 跨仓同步成功标准已定义 | 已满足 |
| 下游未就绪时的接缝验收方式已定义 | 已满足 |
| 编译期 / 运行期 / 事件协作 / 只读消费边界依赖已区分 | 已满足 |
| 每类依赖的正确证据与错误证据已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 8,定义状态机、事务与一致性验收。
