# L0-bus 05 测试方案 Step 2: 测试目标、范围和非范围

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 2 中间产物。
> 本步定义本轮测试要证明什么、覆盖什么、不覆盖什么,并明确 P0 / P1 / P2 的测试优先级口径。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确测试目标、范围和非范围 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §2 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已确认 | 继承测试方案只承接新版 `00~04`、旧 `06` 不作为事实源的边界 |
| `00-需求文档.md` §4 | 已完成 | 提取 L0-bus 的目标、非目标和 P0 主闭环范围 |
| `00-需求文档.md` §7~§14 | 已完成 | 提取 CL-001~CL-006、F-001~F-008、BR-001~BR-012、数据边界和验收方向 |
| `03-详细设计.md` §2 | 已完成 | 提取 P0 展开范围、非范围和 P1 后置边界 |
| `04-配置设计.md` §2 | 已完成 | 提取配置测试的 P0 / P1 / P2 范围和下游承接口径 |

---

## 3. SOP 问题回答

### 3.1 P0 必须通过哪些测试才能证明主链成立?

P0 主链不是单个接口通过,而是以下能力闭环均可被执行和留证:

| P0 测试目标 | 对应需求 | 必须证明的内容 |
|---|---|---|
| 契约绑定的发布材料能被接入或拒绝 | F-001 / BR-001 / BR-002 | 合法 core contract reference、payload reference、outbox fact 可以进入 bus;缺失契约、非法 metadata、payload 正文越界必须被拒绝 |
| 平台级传递语义能形成且不泄漏后端差异 | F-002 / BR-003 / BR-012 | 合法发布材料能形成统一 transport semantic;测试断言不得依赖裸 MQ 参数作为上层真相 |
| delivery 能按统一语义推进 | F-003 / F-008 | 至少一条默认可验证 delivery path 可以从待投递推进到订阅方可消费状态 |
| 订阅方反馈和幂等锚点能留痕 | F-004 / BR-004 / BR-006 / BR-011 | ack / fail / timeout / duplicate feedback 能形成 delivery history、audit trail 和 bus 级 idempotency anchor |
| 失败恢复链能受控推进 | F-005 / BR-005 / BR-008 | retry、dead-letter、replay preparation 有状态、历史和审计链;缺少 dead-letter / history / audit chain 时 replay 必须拒绝 |
| 只读输出不反写真相 | F-006 / BR-007 / BR-009 | transport view、tap output、audit material、failure material 可以被读取,但不能反写 bus truth 或生成 governance decision |
| Outbox relay 边界可被验证 | F-007 / BR-010 | bus 只承接已提交 outbox fact;未提交或重复 relay 不得推进为新的发布事实 |
| 默认 backend / store / fixture 路径可验证 | F-008 / BR-012 | in-memory / fake / fixture 路径能证明 port 语义,并为后续 production adapter 保留替换边界 |
| 配置控制面可验证 | `04` §2 / §12 | JSON config、profile、validator、redaction、fail-fast / fail-closed 和 reload rejection 均有测试证据 |
| 证据归档可被验收引用 | `00` §14 / `04` §12 | 测试执行能产生 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 证据,供 `06` 裁决 |

结论: P0 测试通过的最低标准是 F-001~F-008 的主链均有正向、反向或边界证据,并且没有触发一票否决类边界破坏。

### 3.2 P1/P2 是否只做边界验证或延后?

P1/P2 不进入当前 P0 完整测试矩阵,但其中一部分必须在 P0 阶段做接缝验证。

| 层级 | 当前测试策略 | 原因 |
|---|---|---|
| P0 | 完整设计测试目标、切口、用例、数据、环境、门禁和证据 | 证明 L0-bus 最小可用闭环成立 |
| P1 | 只测 port / adapter / config binding / unsupported / fail-fast 接缝 | 生产 MQ、durable store、基础 secret provider 后续实现,但当前不能破坏可替换边界 |
| P2 | 仅记录为残余风险或未来测试扩展点 | 多后端矩阵、多租户、config center、hot reload、admin override、完整 runbook 不属于当前交付 |

因此,当前测试方案可以写 P1/P2 的边界约束和 future risk,但不能把 P1/P2 当成当前必须完成的测试用例。

### 3.3 哪些下游能力只测接缝,不测对方完整实现?

| 下游 / 外部能力 | 当前只测什么 | 不测什么 | 风险归属 |
|---|---|---|---|
| `L0-core` | bus 引用 core 契约、错误、trace、metadata、actor ref 的方式正确 | core 内部类型定义和校验实现 | `L0-core` |
| 发布方业务仓 | 已提交事实、payload reference、outbox fact 是否可被 bus 接入 | 业务 payload 语义、业务事务和业务补偿 | 发布方 / 业务域 |
| 订阅方业务仓 | fake subscriber ack / fail / timeout feedback 与 bus 语义交互 | 订阅方业务副作用幂等 | 订阅方 / 业务域 |
| `L0-sdk` | SDK transport view 所需只读输出契约 | 多语言 client、认证封装、开发者便利 API | `L0-sdk` |
| `L4-observability` | tap、trace、audit material 的只读输出材料 | 长期存储、dashboard、告警阈值、报表 | `L4-observability` |
| `L1-governance` | failure material、dead-letter material 的只读输出边界 | 审批、策略裁决、治理决策真相 | `L1-governance` |
| 生产 MQ / durable store | adapter port、capability ref、unsupported / unavailable 行为 | Kafka / NATS / Redis / RabbitMQ / DB 产品级实现和运维 | P1 adapter / 运维文档 |
| secret / connection provider | secret ref、connection ref 不落明文和不可用时 fail-closed | KMS / Vault / config center 产品集成 | P1/P2 security / ops |

结论: L0-bus 测试方案验证“bus 与这些能力的接缝是否守住设计契约”,不替这些仓或产品完成全量测试。

### 3.4 哪些非范围有残余风险?

| 非范围 | 当前不测原因 | 残余风险 | 风险归属 |
|---|---|---|---|
| 生产级 MQ / durable adapter 全量实现 | 当前 P0 采用 in-memory / fake / fixture 默认路径 | 后续 adapter 可能暴露后端差异、重试语义差异或可用性差异 | P1 adapter 专项测试 |
| gateway / auth / TLS | L0-bus 不做身份校验入口 | 入口安全缺陷无法由 bus 测试发现 | gateway / identity / security |
| 业务 payload 正文语义 | bus 不拥有正文真相 | 业务消息内容错误不会在 bus 测试中被解释 | 发布方 / 订阅方 |
| governance decision truth | bus 只输出 failure material | 治理审批错误不属于 bus 测试失败 | `L1-governance` |
| observability dashboard / alerting / runbook | bus 只输出观测材料 | 长期趋势、告警阈值和报表无法由 bus P0 证明 | `L4-observability` / ops |
| SDK 高层开发者体验 | bus 只提供 transport view | client retry、credential injection 和便利 API 风险后置 | `L0-sdk` |
| DLQ Console UI | 产品层能力 | 操作界面不可用不影响 bus P0 语义成立 | `L5-console` |
| exactly-once / effectively-once | 当前默认 at-least-once + subscriber idempotency | 业务侧误认为 bus 提供全局 exactly-once | 文档边界 + 订阅方 |
| 热更新 / config center / admin override | P2 不进入当前配置范围 | 运行期配置变更风险后置 | P2 config / ops |

### 3.5 哪些范围项是一票否决相关?

以下测试范围与后续 `06-验收标准.md` 的一票否决高度相关。当前 `05` 负责定义可执行测试和证据,最终裁决由 `06` 给出。

| 一票否决候选 | 触发条件 | 测试方案必须提供的证据 |
|---|---|---|
| core / bus 双真相 | bus 重新定义或绕过 `L0-core` 契约 | contract boundary negative tests |
| payload 正文越界 | bus 保存、解释或输出业务 payload body | forbidden body tests、redaction evidence |
| 传递语义退化成裸 MQ 参数 | 上层语义依赖具体后端参数 | semantic mapping tests、adapter boundary tests |
| delivery / feedback / history 不可追溯 | ack / fail / timeout / retry / DLQ 未留 history 或 audit | state transition tests、history append tests |
| replay 绕过材料链 | 没有 dead-letter / history / audit chain 仍允许 replay | recovery negative tests |
| 只读输出反写真相 | Query / projection / tap / failure material 反写 bus truth | read-only output tests |
| governance 越界 | bus 直接生成治理决策正文 | governance boundary tests |
| 配置安全红线破坏 | raw secret 明文落盘、redaction 关闭、非法 reload 静默生效 | config validator tests、redaction check evidence |
| 证据链缺失 | 测试通过但没有 artifacts / reports 可追溯 | report generation and archive tests |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 测试目标过时 | 目标围绕 EventEnvelope / RoutingRule / CallbackEnvelope | 与新版 P0 闭环不一致 | Step 2 改为 publication / delivery / feedback / recovery / read-only output / config / evidence |
| 范围和非范围未分层 | 旧文档没有稳定区分 P0、P1、P2 和外部仓责任 | 容易把生产 MQ、SDK、治理、观测全量测试混入当前 P0 | 本步建立优先级口径和风险归属 |
| 一票否决范围不清 | 旧文档缺少 payload、replay、read-only、config safety 等红线 | 后续验收缺少测试证据来源 | 本步列出一票否决候选与证据要求 |
| 配置测试未进入目标范围 | 旧文档没有承接新版 `04` | 配置错误、redaction、reload 拒绝无法被测试方案覆盖 | 本步把配置控制面列为 P0 测试目标 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试目标 | 验证旧 envelope / routing / callback 结构 | 验证 F-001~F-008 的 bus 传递闭环 | 与新版需求一致 |
| 测试范围 | 技术对象优先,范围边界不清 | P0 完整验证,P1/P2 只做接缝或延后 | 防止测试矩阵失控 |
| 下游关系 | 容易替 SDK / observability / governance / MQ 产品测试 | 只测接缝,不测对方完整实现 | 保持仓库职责边界 |
| 非范围 | 只写“不做”,风险归属不足 | 每个非范围明确残余风险和归属 | 便于验收和后续规划 |
| 否决项 | 未与测试证据绑定 | 红线边界与测试证据对应 | 支撑后续 `06` 裁决 |

---

## 6. 测试设计取舍

### 6.1 是否把生产 MQ / durable store 放进 P0

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 使用 in-memory / fake / fixture,只验证 port 语义 | 速度快、可复现、能守住设计边界 | 不能证明生产后端性能和产品行为 | 采用 |
| B. P0 直接接入真实 Kafka / NATS / Redis / DB | 更接近生产 | 会把 P1 adapter 和运维复杂度提前拉入 P0 | 不采用 |
| C. P0 同时维护 fake 和所有真实后端矩阵 | 覆盖最全 | 成本高且不符合当前 P0 目标 | 不采用 |

结论: 当前 P0 测试以 in-memory / fake / fixture 为默认路径,并通过 port / adapter boundary tests 证明后续 production adapter 的接缝。

### 6.2 是否把下游产品完整行为纳入 bus 测试

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只测试 bus 输出与下游接缝 | 边界清晰,不会替下游仓测试 | 下游完整行为需要后续仓自行覆盖 | 采用 |
| B. 在 bus 测试中模拟完整 SDK / observability / governance 行为 | 更像端到端产品链 | bus 测试会变成跨仓产品测试 | 不采用 |
| C. 暂不测试任何下游接缝 | 测试简单 | 无法证明只读输出和失败材料可消费 | 不采用 |

结论: bus 只证明输出材料、只读边界和事件 / 查询契约可被消费。

### 6.3 是否把配置测试作为专项还是 P0 主范围

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 配置控制面进入 P0 范围,后续在 Step 8 / 10 / 13 展开 | 能确保默认路径、redaction 和 fail-fast 可验收 | 测试方案内容更多 | 采用 |
| B. 配置测试完全放到专项测试 | 章节更轻 | 配置错误会影响所有测试环境和证据可靠性 | 不采用 |
| C. 配置只由实施计划处理 | 实施更自由 | 测试无法裁决配置安全和失效模式 | 不采用 |

结论: 配置控制面是 P0 测试范围的一部分,不是可选附录。

---

## 7. 结构化中间产物

### 7.1 测试目标表

| 测试目标 | 优先级 | 覆盖需求 / 设计 | 预期证据 |
|---|---|---|---|
| 验证契约绑定发布材料接入 | P0 | F-001、BR-001、BR-002、`03` §2.2 | publication acceptance 正反用例、rejection reason、audit evidence |
| 验证统一传递语义 | P0 | F-002、BR-003、BR-012 | semantic mapping assertions、backend boundary evidence |
| 验证 delivery 推进 | P0 | F-003、F-008 | delivery progression cases、history evidence |
| 验证反馈记录与幂等锚点 | P0 | F-004、BR-004、BR-006、BR-011 | ack / fail / timeout / duplicate feedback cases |
| 验证 retry、DLQ、replay preparation | P0 | F-005、BR-005、BR-008 | recovery cases、replay rejection evidence |
| 验证 audit、tap、transport view、failure material | P0 | F-006、BR-007、BR-009 | read-only query / output cases、no-write assertions |
| 验证 Outbox relay 边界 | P0-min | F-007、BR-010 | committed / uncommitted / duplicate outbox cases |
| 验证默认 backend / store / fixture path | P0-min | F-008、`03` §2.2 | in-memory integration evidence、adapter unsupported evidence |
| 验证配置控制面 | P0 | `04` §2、`04` §12 | config loader / validator / redaction / reload rejection cases |
| 验证报告与证据归档 | P0 | `00` §14、`04` §12 | artifacts and reports archive evidence |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Publication acceptance | 功能主链 | P0 | 验证合法材料接入、非法材料拒绝、audit 留痕 | 不定义 core 契约本身 |
| Transport semantic formation | 功能主链 / 边界 | P0 | 验证平台语义独立于后端参数 | 不测试所有 MQ 产品语义 |
| Delivery progression | 功能主链 | P0 | 验证 delivery 状态推进和默认可验证路径 | 不承诺全局 exactly-once |
| Feedback recording | 功能主链 / 幂等 | P0 | 验证 ack / fail / timeout / duplicate feedback 与 history | 不验证订阅方业务副作用 |
| Recovery operations | 恢复主链 | P0 | 验证 retry、DLQ、replay preparation 和拒绝条件 | 不实现 DLQ Console UI |
| Read-only output and audit | 输出 / 审计 | P0 | 验证 transport view、tap、failure material 只读输出 | 不做 observability 长期存储和 dashboard |
| Outbox relay boundary | 接入边界 | P0-min | 验证只承接已提交 outbox fact | 不验证发布方业务事务实现 |
| In-memory default path and fake adapters | 环境 / 接缝 | P0-min | 验证 port 语义和默认可复现路径 | 不测试 production adapter 全量行为 |
| Config loader / validator / redaction | 配置 / 安全 | P0 | 验证严格 JSON、profile、secret ref、redaction、fail-fast / fail-closed | 不做 config center 和 hot reload |
| Reports and artifacts | 证据 | P0 | 验证测试证据可以被归档和验收引用 | 不替代测试执行报告正文 |
| Production MQ / durable DB adapter | adapter 专项 | P1 | 仅验证接口接缝、unsupported / unavailable 行为 | 不进入当前 P0 全量测试 |
| Secret provider / connection provider | 安全接缝 | P1 | 仅验证 ref 读取边界和不可用失败策略 | 不接入具体 KMS / Vault 产品 |
| Multi-backend / multi-tenant / config center | 未来扩展 | P2 | 当前只记录残余风险 | 不进入当前测试矩阵 |

### 7.3 优先级口径

| 优先级 | 测试含义 | 当前处理 |
|---|---|---|
| P0 | 当前必须设计、执行并留证的测试范围 | Step 3~13 必须展开对象、切口、用例、数据、环境、门禁和证据 |
| P0-min | 支撑 P0 主链的最小边界能力 | 必须有接缝和默认路径测试,但不要求覆盖所有生产变体 |
| P1 | 后续生产化或 adapter 扩展能力 | 当前只做边界、unsupported、fail-fast 或 future risk |
| P2 | 中长期能力或产品化能力 | 当前不设计用例,只记录残余风险和后续归属 |
| 非范围 | 明确不由 L0-bus 当前测试方案证明 | 必须写明风险归属,防止后续验收误判 |

### 7.4 一票否决候选与测试证据映射

| 候选否决项 | 证据类别 | 后续展开位置 |
|---|---|---|
| core / bus 双真相 | contract boundary tests | Step 3 / Step 5 / Step 6 |
| payload 正文越界 | forbidden body tests、redaction evidence | Step 6 / Step 10 / Step 13 |
| 传递语义泄漏后端差异 | semantic mapping and adapter boundary tests | Step 3 / Step 4 / Step 6 |
| feedback / history / audit 不可追溯 | state transition and append-only tests | Step 3 / Step 6 / Step 10 |
| replay 绕过材料链 | recovery negative tests | Step 6 / Step 10 |
| 只读输出反写 | query / projection no-write tests | Step 3 / Step 6 |
| 配置安全红线破坏 | config validation and redaction tests | Step 8 / Step 10 |
| 缺少 artifacts / reports | evidence archive tests | Step 9 / Step 13 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“测试设计取舍”和“待确认事项”小节，了解本章测试目标、范围、非范围和优先级口径如何收敛。

本次测试方案的目标是证明 L0-bus 的 P0 主闭环成立: 基于 `L0-core` 契约的发布材料可以进入 bus,形成统一传递语义,推进 delivery,记录反馈和幂等锚点,进入失败恢复链,并输出只读 audit / tap / transport view / failure material。同时,测试方案必须证明配置控制面和证据归档路径可被验收引用。

当前 P0 覆盖 publication acceptance、transport semantic、delivery progression、feedback recording、recovery operations、read-only output、Outbox relay boundary、默认可验证 backend path、config loader / validator / redaction、reports / artifacts。P1 production adapter、durable store、secret provider 等只做接缝和失败策略验证;P2 config center、hot reload、多后端矩阵、多租户和产品化 runbook 不进入当前测试矩阵。

测试方案不验证 `L0-core` 内部契约实现、不验证发布方 / 订阅方业务 payload 语义、不替 `L0-sdk`、`L4-observability`、`L1-governance`、生产 MQ / DB 产品和运维文档完成全量测试。所有非范围必须在正式文档中说明残余风险和风险归属。

---

## 9. 待确认事项

当前没有阻塞进入 Step 3 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| `P0-min` 是否继续作为正式优先级写入 `05` | A. 保留 `P0-min`;B. 并入 `P0`;C. 只在说明中提及 | 采用 A | `F-007` / `F-008` 是 P0 主链的支撑边界,但不要求覆盖所有生产后端变体,保留 `P0-min` 能表达测试深度差异 |
| 旧 `06-验收标准.md` 是否影响 Step 2 | A. 不作为事实源;B. 反向作为测试基线;C. 暂不读取 | 采用 A | 旧 `06` 主线过时,但可以提醒后续验收重校准 |
| 生产 MQ / durable store 是否进入 P0 | A. 只测接缝;B. 进入 P0 全量集成;C. 完全不提 | 采用 A | 接缝必须稳定,但产品级 adapter 属于 P1 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 测试目标已明确 | 已满足 |
| 范围 / 非范围已区分 | 已满足 |
| P1 / P2 测试口径已明确 | 已满足 |
| 下游接缝与对方完整实现边界已明确 | 已满足 |
| 非范围残余风险和归属已记录 | 已满足 |
| 一票否决候选与测试证据已建立映射 | 已满足 |

结论: 可以进入 Step 3,抽取测试对象与测试切口。
