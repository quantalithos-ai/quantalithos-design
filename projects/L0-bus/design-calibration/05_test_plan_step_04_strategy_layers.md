# L0-bus 05 测试方案 Step 4: 测试策略与分层

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 4 中间产物。
> 本步决定 Step 3 中的测试切口分别应该在哪个测试层发现问题,并明确执行时机与失败处理。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 制定测试策略与分层 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §4 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_03_test_objects_slices.md` | 已确认 | 继承 P0 测试对象、测试切口、风险和推荐层级 |
| `03-详细设计.md` §5 | 已完成 | 提取 `contracts / domain / application / infra / api / worker / jobs` 的模块边界 |
| `03-详细设计.md` §8 | 已完成 | 提取逐接口处理流和写路径通用规则 |
| `03-详细设计.md` §9~§12 | 已完成 | 提取状态机、事务、一致性、幂等、并发和恢复规则 |
| `03-详细设计.md` §13~§15 | 已完成 | 提取配置、可观测性、redaction 和最小验证清单 |
| `04-配置设计.md` §12 | 已完成 | 提取配置测试、reports / artifacts 和 redaction 承接口径 |

---

## 3. SOP 问题回答

### 3.1 哪些问题必须在 unit 层发现?

Unit 层负责发现“纯规则错误”,不依赖 repository、adapter、HTTP、worker 或真实 runtime。

| Unit 层对象 | 必须发现的问题 | 阻断性 |
|---|---|---|
| domain object / value object | 构造非法、必填字段缺失、状态 enum 非法值、终态被改写 | 阻断 PR |
| state machine / lifecycle | 合法迁移被拒绝、非法迁移被允许、跨状态机禁止规则失效 | 阻断 PR |
| policy | payload body 越界、retry / DLQ / replay eligibility 判断错误、read-only policy 失效 | 阻断 PR |
| idempotency value object | same key same digest / different digest 判定错误 | 阻断 PR |
| projection derive function | projection 派生包含 forbidden body 或把派生结果当 truth | 阻断 PR |
| config value object / validator core | 默认值、范围、枚举、禁止配置化边界校验错误 | 阻断 PR |

Unit 层不验证事务顺序、repository 约束、HTTP 映射或 worker 重试。这些属于 service / integration / API 层。

### 3.2 哪些问题必须在 service 层验证编排?

Service 层负责验证 application service 对 UnitOfWork、repository、port、audit、outbound event 和幂等锚点的编排。

| Service 层对象 | 必须验证的编排 | 阻断性 |
|---|---|---|
| `PublicationAcceptanceService` | idempotency lookup、accept / reject、audit append、accepted / rejected event evidence | 阻断 PR |
| `DeliveryProgressionService` | delivery lock、attempt start / finish、transport backend 调用、history 生成 | 阻断 PR |
| `FeedbackRecordingService` | get delivery for update、feedback unique、history、duplicate / late feedback | 阻断 PR |
| `RecoveryOrchestrationService` | retry / DLQ eligibility、active recovery 唯一、failure material 完整性 | 阻断 PR |
| `ReplayPreparationService` | dead-letter、approval ref、audit chain、ready / rejected 分支 | 阻断 PR |
| `ReadOutputService` | Query 不写 truth、stale / not found marker、access audit | 阻断 PR |
| `OutboxPublisherService` | truth 已提交后发布、publisher failure 不回滚 truth、schema / boundary violation evidence | 阻断 PR |

Service 层必须使用 fake repository / fake port / fake UnitOfWork 精确断言调用顺序和副作用顺序。它不依赖真实 DB / MQ 产品。

### 3.3 哪些问题必须依赖 DB / adapter / worker 集成测试?

当前 P0 不接入生产 DB / MQ 产品,但必须用 in-memory store、fake adapter、fixture source 和 worker / job runner 验证集成语义。

| 集成对象 | 必须验证的问题 | 阻断性 |
|---|---|---|
| repository adapters | unique、expected version、append-only、projection version、active retry / DLQ unique | 阻断 PR |
| `UnitOfWorkPort` | begin / commit / rollback 顺序、commit uncertain、每个 job item 一个事务 | 阻断 PR |
| source adapter | committed outbox fact only、source ack failure 后重复消费 existing | 阻断 PR |
| publisher adapter | retryable publish failure、existing receipt、schema / boundary rejected | 阻断 PR |
| transport backend adapter | dispatch success、backend unavailable、unsupported semantic、private body rejected | 阻断 PR |
| worker consumers | duplicate event、retryable consumer failure、at-least-once recovery | 阻断 PR |
| operations jobs | cursor、batch、partial success、job item idempotency、summary | 阻断 PR |
| config loader / runtime builder | JSON file、env override、profile、secret ref、禁止绕过 validator | 阻断 PR |

P1 production adapter 可以在后续专项中增加真实产品集成测试;当前 P0 只要求 port 语义和默认可验证路径成立。

### 3.4 哪些问题需要 API / contract test?

API / contract 层负责验证外部可见协议稳定,以及入口到 application service 的映射正确。

| 协议对象 | 必须验证的问题 | 阻断性 |
|---|---|---|
| Command API | HTTP JSON schema、header、actor / metadata、idempotency key、4xx / 5xx error mapping | 阻断 PR |
| Query API | pagination / filter、not found、stale marker、no write UoW、access audit | 阻断 PR |
| Inbound Event | event envelope、event id、source ref、duplicate、retryable / rejected consumer result | 阻断 PR |
| Outbound Event | schema roundtrip、event kind、topic、trace ref、forbidden body absent | 阻断 PR |
| Operations Job protocol | job input / output schema、cursor、summary、partial success status | 阻断 PR |
| Protocol error DTO | validation / conflict / boundary / dependency / internal error response shape | 阻断 PR |

API / contract tests 不验证下游 SDK、observability 或 governance 的完整产品行为,只验证 L0-bus 暴露给它们的稳定接缝。

### 3.5 哪些场景才需要 E2E 或 release gate?

E2E / release gate 只覆盖 P0 闭环和红线,不把所有问题推到末端。

| 场景 | 进入 E2E / release gate 的原因 | 阻断性 |
|---|---|---|
| publication -> delivery -> feedback -> read-only output | 证明 P0 主传递闭环成立 | 阻断 release |
| delivery failure -> retry -> DLQ -> replay preparation rejected / ready | 证明失败恢复链和审计链成立 | 阻断 release |
| committed outbox fact -> acceptance -> delivery | 证明 outbox relay 支撑边界成立 | 阻断 release |
| config profile + runtime graph + default in-memory path | 证明配置装配后的默认路径可运行 | 阻断 release |
| forbidden body / raw secret redaction gate | 证明证据、日志、事件、projection 不泄露红线内容 | 阻断 release |
| reports / artifacts generation | 证明测试结果可以交给 `06-验收标准.md` 裁决 | 阻断 release |

E2E 不用于发现普通字段校验、单个状态迁移、单个 repository 约束或简单错误映射,这些必须在更低层提前失败。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 缺少测试分层 | 用例和对象混在一起 | 高风险问题可能被推给 E2E,反馈慢且定位困难 | 本步建立测试金字塔和层级职责 |
| 失败是否阻断不清 | 旧文档未区分 PR gate、release gate、nightly | CI 策略和验收证据无法对齐 | 本步为每层定义执行时机和失败处理 |
| P0 fake / in-memory 路径边界不清 | 容易误认为必须接生产 MQ / DB 才能验收 | P0 范围膨胀 | 本步明确 P0 用默认可验证路径,production adapter 后置 |
| 下游完整产品测试边界不清 | 容易把 SDK / observability / governance 全量测试拉入 bus | 仓库职责越界 | 本步将其限定为 API / contract 接缝测试 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试策略 | 旧用例导向,缺少分层 | 风险导向分层,先低层发现规则错误 | 提高定位效率 |
| E2E 角色 | 可能承担大量验证 | 只验证 P0 闭环和 release 红线 | 防止慢测试膨胀 |
| CI 门禁 | 未明确失败处理 | 每层标注 PR / nightly / release 阻断 | 支撑 Step 9 |
| adapter 策略 | 后端真实产品边界不清 | P0 fake / in-memory,P1 production adapter 后续专项 | 保持 P0 可交付 |
| 验收证据 | 测试分层与 reports 脱节 | release gate 必须产出 artifacts / reports | 支撑 Step 13 和 `06` |

---

## 6. 测试设计取舍

### 6.1 是否把高风险场景全部放到 E2E

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 高风险场景全部由 E2E 覆盖 | 表面接近真实链路 | 反馈慢、定位难、易漏状态和边界细节 | 不采用 |
| B. 规则在 unit、编排在 service、接缝在 integration、闭环在 release gate | 反馈快,风险定位清楚 | 需要维护多层测试 | 采用 |
| C. 只写 unit 和 E2E | 层级少 | service / port / worker 接缝缺口大 | 不采用 |

结论: L0-bus 采用风险导向测试金字塔,每层只验证自己最擅长发现的问题。

### 6.2 是否把 production adapter 纳入当前分层

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 当前 P0 纳入真实 MQ / DB adapter | 更接近生产 | 把 P1 生产化复杂度提前引入 | 不采用 |
| B. 当前 P0 测 port 语义和 in-memory / fake 默认路径 | 可复现、成本可控、边界清楚 | 不能证明生产产品行为 | 采用 |
| C. 当前完全不测 adapter | 简单 | 无法证明 transport / source / publisher 接缝 | 不采用 |

结论: 当前测试分层覆盖 adapter port 和 fake implementation;production adapter 后续作为 P1 专项扩展。

### 6.3 是否把 redaction 放到专项测试才检查

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只在专项测试检查 redaction | 正文用例更轻 | 红线可能到后期才暴露 | 不采用 |
| B. 每层都保留 forbidden body 断言,release gate 再统一扫描 | 红线前移且可最终留证 | 断言分布更广 | 采用 |
| C. 只靠人工审查 | 成本低 | 不可重复、不可验收 | 不采用 |

结论: redaction 是横切门禁,unit / service / contract / release gate 都要有对应切口。

---

## 7. 结构化中间产物

### 7.1 测试分层图: L0-bus 测试金字塔

```text
+---------------------------------------------------------------+
| Release gate / E2E                                            |
| P0 closed loop, recovery chain, redaction, reports            |
+-------------------------------^-------------------------------+
                                |
+-------------------------------+-------------------------------+
| API / Consumer / Job / Contract                               |
| HTTP JSON, event schema, job protocol, error mapping           |
+-------------------------------^-------------------------------+
                                |
+-------------------------------+-------------------------------+
| Integration                                                   |
| repository, UnitOfWork, fake adapters, workers, runtime config |
+-------------------------------^-------------------------------+
                                |
+-------------------------------+-------------------------------+
| Service                                                       |
| application orchestration, idempotency, audit, side effects    |
+-------------------------------^-------------------------------+
                                |
+-------------------------------+-------------------------------+
| Unit                                                          |
| domain invariants, state machines, policies, config values     |
+---------------------------------------------------------------+
```

图后说明：

- 下层测试负责快速发现规则错误,上层测试负责验证接缝和闭环。
- P0 红线不能只依赖 release gate;unit / service / contract 层也必须有前置断言。
- release gate 只覆盖最小主链、恢复链、配置装配、redaction 和证据归档。
- 当前 P0 的 integration 使用 in-memory / fake / fixture,不要求真实 MQ / DB 产品。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Unit | 快速验证纯规则、不变量、状态和 policy | domain objects、state enum、policy、config value、projection derive | 本地开发 / PR gate | P0 失败阻断 PR |
| Service | 验证 application 编排、事务顺序、幂等和副作用 | application service + fake repository / fake port / fake UoW | 本地开发 / PR gate | P0 失败阻断 PR |
| Integration | 验证 repository、adapter、worker、job 和 runtime graph 接缝 | in-memory store、fake backend、fixture source、runtime builder | PR gate / nightly | P0 失败阻断 PR;非 P0 可 nightly |
| API / Consumer / Job / Contract | 验证外部协议、入口映射和错误响应 | HTTP route、event consumer、outbound event schema、job protocol | PR gate / nightly | P0 协议失败阻断 PR |
| Release gate / E2E | 验证最小闭环、红线和证据归档 | P0 closed loop、recovery chain、redaction scan、reports generation | release gate / pre-acceptance | 失败阻断 release / acceptance |

### 7.3 Step 3 切口到测试层级映射

| Step 3 切口 | 主层级 | 辅助层级 | 说明 |
|---|---|---|---|
| Publication domain objects | Unit | Service | Unit 验证不变量,Service 验证接入编排 |
| Transport semantic and backend boundary | Unit | Service / Integration | Unit 验证语义,Integration 验证 adapter unsupported / unavailable |
| Delivery domain objects | Unit | Service / Integration | Unit 验证迁移,Service 验证推进,Integration 验证并发约束 |
| Feedback and idempotency objects | Unit | Service / concurrency | Unit 验证 digest,Service 验证重复反馈处理 |
| Recovery objects and policy | Unit | Service / E2E | Unit 验证 eligibility,E2E 验证恢复链闭合 |
| Audit and read-only objects | Unit | Service / API | Unit 验证 projection derive,API 验证 no-write query |
| Config objects and validator | Unit | Integration / release gate | Unit 验证 validator,Integration 验证 runtime graph |
| Application services | Service | Integration | Service 为主,Integration 验证真实 adapter 接缝 |
| Repository ports | Integration | Service | Integration 验证约束,Service 验证调用顺序 |
| External adapter ports | Integration | E2E | Integration 验证 fake port 语义,E2E 验证主链 |
| API handlers | API / contract | Service | API 验证协议,Service 验证业务编排 |
| Worker consumers | Integration | E2E | Integration 验证消费语义,E2E 验证 outbox 主链 |
| Operations jobs | Job runner | E2E | Job runner 验证 item 事务,E2E 验证 recovery / projection |
| Outbound events | Contract | Service / release gate | Contract 验证 schema,release gate 验证证据 |
| Observability and redaction | Unit / snapshot | Release gate | 每层断言 forbidden body absent,release gate 统一扫描 |
| Reports and artifacts | Script / report check | Release gate | Step 13 展开目录和文件格式 |

### 7.4 阻断策略表

| 测试类型 | P0 失败是否阻断 PR | 是否阻断 release | 说明 |
|---|---|---|---|
| Unit | 是 | 是 | 规则和不变量失败不能进入主干 |
| Service | 是 | 是 | 编排和事务顺序失败不能进入主干 |
| Integration | 是,限 P0 fake / in-memory 路径 | 是 | P1 production adapter 可 nightly 或专项 |
| API / contract | 是 | 是 | 对外协议破坏必须阻断 |
| Redaction check | 是,若可在 PR 产物扫描 | 是 | release gate 必须完整扫描 |
| Reports generation | 否,PR 可 smoke | 是 | release / acceptance 必须有完整证据 |
| P1 production adapter | 否 | 否,除非该版本声明交付 P1 | 当前只记录 future risk |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“测试设计取舍”和“阻断策略表”小节，了解本章测试策略与分层如何收敛。

L0-bus 采用风险导向测试金字塔。Unit 层验证 domain object、value object、state machine、policy、config value 和 projection derive 的纯规则;Service 层验证 application service 的事务、幂等、repository / port 编排、audit 和 outbound event 副作用;Integration 层验证 repository、UnitOfWork、fake adapter、worker、job 和 runtime config 接缝;API / Consumer / Job / Contract 层验证 HTTP JSON、event schema、job protocol 和错误映射;Release gate / E2E 只验证 P0 主闭环、失败恢复链、配置装配、redaction 和 reports / artifacts 证据归档。

P0 失败默认阻断 PR 或 release。普通规则错误、状态迁移错误、协议错误、幂等错误和 redaction 红线不得推迟到 E2E 才发现。production MQ / durable store adapter 属于 P1 专项,当前 P0 通过 in-memory / fake / fixture 默认路径验证 port 语义和接缝。

---

## 9. 待确认事项

当前没有阻塞进入 Step 5 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否保留 E2E 层 | A. 保留最小 release gate;B. 删除 E2E;C. 大量 E2E 覆盖所有风险 | 采用 A | L0-bus 需要证明闭环和证据归档,但不应把普通风险推给 E2E |
| P1 production adapter 是否阻断 PR | A. 当前不阻断;B. 全部阻断;C. 完全不测试 | 采用 A | 当前 P0 只承诺默认可验证路径,但保留后续 adapter 专项 |
| reports generation 是否阻断 PR | A. PR smoke、release 完整阻断;B. PR 全量阻断;C. 不阻断 | 采用 A | PR 需要快反馈,release / acceptance 必须完整留证 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| Unit / Service / Integration / API / Release gate 层级已定义 | 已满足 |
| 每层目标、典型内容、执行时机和失败处理已明确 | 已满足 |
| Step 3 全部 P0 切口已映射到测试层级 | 已满足 |
| 未把所有高风险问题推给 E2E | 已满足 |
| P0 / P1 阻断策略已区分 | 已满足 |

结论: 可以进入 Step 5,建立需求追溯与覆盖矩阵。
