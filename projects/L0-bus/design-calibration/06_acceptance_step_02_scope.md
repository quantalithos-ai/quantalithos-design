# L0-bus 06 验收标准 Step 2: 验收目标与范围

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 2 中间产物。
> 本步定义本轮验收裁决什么、不裁决什么,并明确 P0 / P0-min / P1 / P2 的验收范围。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确验收目标与范围 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §2 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已确认 | 继承新版 `00~05` 为事实源、旧 `06` 不作为事实源的边界 |
| `00-需求文档.md` §4 / §9 / §10 / §14 | 已完成 | 提取目标、非目标、F-001~F-008、BR-001~BR-012、需求验收方向和一票否决方向 |
| `01-架构设计.md` | 已完成 | 提取 core / bus / sdk / observability / governance / MQ / store 的职责边界 |
| `03-详细设计.md` §2 | 已完成 | 提取 P0 展开范围、非范围和 P1 后置边界 |
| `04-配置设计.md` §2 / §12 | 已完成 | 提取 P0 配置控制面、P1/P2 配置非范围和下游承接口径 |
| `05-测试方案.md` §2 / §11 / §14 | 已完成 | 提取 P0 / P0-min 测试范围、缺陷分级、残余风险和必须转入验收标准的规则 |

---

## 3. SOP 问题回答

### 3.1 本轮验收的核心裁决目标是什么?

本轮验收的核心裁决目标是判断 L0-bus 的 P0 事件传递主闭环和 P0-min 支撑边界是否成立,并判断交付物是否可以进入下一阶段。

验收不裁决“是否已经具备完整生产化事件平台”,而裁决以下目标:

| 裁决目标 | 说明 | 主要证据来源 |
|---|---|---|
| P0 主闭环成立 | publication -> transport semantic -> delivery -> feedback -> recovery -> read-only output 可被证据证明 | `TC-BUS-PUB-*`、`TC-BUS-SEM-*`、`TC-BUS-DLV-*`、`TC-BUS-FDB-*`、`TC-BUS-REC-*`、`TC-BUS-OUT-*` |
| P0-min 支撑边界成立 | Outbox relay 和默认 backend / store / fixture path 能支撑 P0 主链 | `TC-BUS-OBX-*`、`TC-BUS-BND-*` |
| 配置控制面成立 | JSON profile、ConfigLoader / Validator、RuntimeBuilder、secret ref、reload rejection 和 fail-fast / fail-closed 可验收 | `TC-BUS-CFG-*`、config summary |
| 安全与数据边界成立 | payload body、raw secret、backend private body、governance decision body 不进入 bus truth / evidence | redaction report、boundary negative cases |
| 证据链可裁决 | reports / artifacts / acceptance handoff 足以支撑验收判断 | `reports/runs/<run_id>`、`reports/acceptance` |
| 残余风险可接受 | P1/P2 非范围不被误声明为已交付,且有接受人和后续动作 | risk acceptance、open issues |

### 3.2 P0/P1/P2 验收范围如何划分?

| 优先级 | 验收含义 | 当前裁决方式 |
|---|---|---|
| P0 | 当前必须通过的主闭环能力 | 任一 P0 主线失败即不通过或触发 S1 / S0 |
| P0-min | 支撑 P0 的最小边界能力 | 失败会影响 P0 主链成立,默认阻断 |
| P1 | 后续生产化或 adapter 扩展能力 | 当前只验接缝、unsupported / unavailable / fail-fast,不要求全量交付 |
| P2 | 中长期能力或产品化能力 | 当前不裁决实现完成度,只作为残余风险或非范围说明 |
| 非范围 | 明确不由 L0-bus 当前交付证明的能力 | 不作为失败条件,但必须防止被误声明为已验收 |

P0 / P0-min 是本轮验收的硬范围。P1 / P2 不是本轮通过的前置条件,但如果 P1/P2 风险暴露出 S0 红线,例如 raw secret 泄漏、Query 写 truth、replay 绕过 audit chain,则按 S0 处理。

### 3.3 哪些下游能力只验接缝?

L0-bus 位于事件传递主干,它必须验对外输出和接缝,但不替下游仓裁决完整产品能力。

| 下游 / 外部能力 | 当前只验接缝 | 不裁决完整实现 |
|---|---|---|
| `L0-core` | bus 引用 core contracts、metadata、trace、outbox boundary 的方式正确 | core 内部类型、事件目录和错误码实现 |
| 发布方业务仓 | 已提交 outbox fact、payload reference、contract reference 能被接入 | 发布方业务事务、payload 正文语义和业务补偿 |
| 订阅方业务仓 | delivery、ack / fail / timeout feedback 与 bus 语义交互 | 订阅方业务副作用和业务幂等实现 |
| `L0-sdk` | transport view、error contract、read-only 输出可被 SDK 消费 | 多语言 SDK、认证封装、开发者便利 API |
| `L4-observability` | tap、trace、audit material、metrics material 输出边界 | 长期存储、dashboard、报表、告警阈值 |
| `L1-governance` | failure material、dead-letter material 只读输出边界 | 审批、策略裁决、governance decision truth |
| 生产 MQ / durable store | port、adapter capability、unsupported / unavailable 语义 | Kafka / NATS / Redis / RabbitMQ / DB 产品级行为和运维 |
| secret / connection provider | secret ref / connection ref、fail-closed、明文不落盘 | KMS / Vault / config center 产品集成 |

### 3.4 哪些非范围会影响最终结论?

非范围不会直接导致“不通过”,但会影响最终结论是否可以写成“通过”还是“有条件通过”,以及是否需要在验收结论中附风险说明。

| 非范围 | 对最终结论的影响 | 处理方式 |
|---|---|---|
| production MQ / durable store 全量行为 | 不阻断 P0;若该版本对外宣称生产 adapter 已交付,则必须补 P1 专项验收 | 默认进入残余风险 |
| gateway / auth / TLS | 不阻断 bus P0;但 bus 必须保留 actor / access audit 接缝 | 归 gateway / identity / security |
| 业务 payload 正文语义 | 不阻断 bus P0;但 bus 若保存或解释正文则触发 S0 | 发布方 / 订阅方自验 |
| governance decision truth | 不阻断 bus P0;bus 若生成 decision body 触发 S0 | 归 governance |
| observability dashboard / alerting | 不阻断 bus P0;但 bus 输出材料缺失会阻断 | 归 observability |
| SDK 高层开发者体验 | 不阻断 bus P0;但 transport view / error contract 不稳定会阻断 | 归 SDK |
| exactly-once / effectively-once | 不作为当前交付目标;若文档或产品声明误导为已支持,需列为风险 | 验收结论中说明 at-least-once + subscriber idempotency |
| config center / hot reload / admin override | 不阻断 bus P0;reload request 应明确 rejected | 归 P2 config / ops |
| multi-backend / multi-tenant 矩阵 | 不阻断 bus P0 | 进入后续专项 |

### 3.5 哪些范围项可能成为一票否决?

一票否决项来自需求、测试方案和安全边界。Step 11 会正式展开,本步先识别候选范围。

| 候选一票否决项 | 触发条件 | 关联范围 |
|---|---|---|
| core / bus 双真相 | bus 重新定义或绕过 `L0-core` 契约 | publication / semantic |
| payload body 泄漏 | bus 保存、解释或输出完整业务正文 | publication / read-only output / evidence |
| raw secret 泄漏 | 配置、日志、审计、artifact 或 report 出现 raw secret / credential value | config / evidence / security |
| backend private body 泄漏 | backend private response 进入 truth、projection、report 或 audit | backend boundary |
| replay 绕过材料链 | 缺少 dead-letter、history、audit chain 仍进入 replay ready | recovery |
| Query 反写真相 | read-only query 或 projection 自动写 bus truth | read-only output |
| governance 越界 | failure material 直接生成 governance decision body | governance boundary |
| 审计 / history 不可追溯 | delivery、feedback、retry、DLQ、replay 缺少可追溯链 | delivery / recovery / audit |
| 证据链缺失 | P0 gate 通过但缺少 reports / artifacts / acceptance index | evidence |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 验收范围仍是旧主线 | 包络、路由、callback、死信、投影等旧对象作为中心 | 与新版 P0 主闭环不一致 | 本步改为 publication / delivery / feedback / recovery / read-only output / config / evidence |
| P0 / P1 / P2 未清晰分层 | 旧文档把 MQ 后端、SDK、observability、governance 混入验收范围 | 当前验收范围失控 | 本步明确 P0 硬范围、P1 接缝、P2 非范围 |
| 非范围对结论影响不清 | 旧文档只写“否”,没有说明是否影响最终结论 | 可能误判“未交付 P1”导致 P0 不通过 | 本步定义非范围如何进入残余风险 |
| 一票否决候选分散 | 旧文档没有把新版 S0 红线和 evidence 缺失纳入范围 | Step 11 无法完整展开 | 本步预先列出候选一票否决项 |
| 接缝验收和完整产品验收混淆 | bus 可能替 SDK、observability、governance、MQ 产品做完整验收 | 仓库边界被破坏 | 本步明确只验接缝 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 核心裁决目标 | 验旧 envelope / route / callback 是否成立 | 验 P0 事件传递主闭环和 P0-min 支撑边界是否成立 | 与新版 `00~05` 对齐 |
| 优先级 | 未稳定区分 P0 / P1 / P2 | P0 / P0-min 硬裁决,P1 接缝,P2 残余风险 | 可裁决 |
| 下游能力 | 容易全量纳入 | 只验接缝,完整产品归属下游 | 防止越界 |
| 非范围 | 只列不验 | 明确影响最终结论和风险接受 | 支撑 Step 13 |
| 一票否决 | 不完整 | 提前识别 S0 候选 | 支撑 Step 11 |

---

## 6. 验收设计取舍

### 6.1 是否把 production adapter 全量能力纳入当前验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入当前 P0 验收 | 更接近生产 | 超出当前设计和测试范围,会阻塞 P0 主闭环 |
| B. 当前只验 port / adapter 接缝和默认可验证路径,production adapter 进入 P1 专项 | 范围清晰,可交付 | 生产化风险后置 | 采用 |
| C. 完全不提 production adapter | 文档更短 | 后续误解为无风险 | 不采用 |

### 6.2 是否把下游 SDK / observability / governance 完整能力作为验收范围

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全量验收下游产品能力 | 看似端到端完整 | bus 仓验收越界,依赖大量未实现仓 |
| B. 只验 bus 输出接缝和只读边界 | 边界清楚 | 下游完整体验需后续仓验收 | 采用 |
| C. 完全不验下游接缝 | 文档简单 | 无法证明 bus 输出可消费 | 不采用 |

### 6.3 是否把非范围写入验收目标章节

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 写入 §2 并在 §13 再收口 | 验收边界早期清晰 | 文档略长 | 采用 |
| B. 只在 §13 风险章节写 | §2 更短 | 前面门禁容易误把 P1/P2 当 P0 |
| C. 不写非范围 | 简洁 | 验收结论会被误读 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| Publication acceptance | 功能主链 | P0 | 合法 core contract ref + payload ref / outbox fact 可进入 bus,非法材料被拒绝 | 不裁决 core 契约内部实现 |
| Transport semantic formation | 功能主链 / 架构边界 | P0 | 合法发布材料形成平台级 transport semantic,不泄漏裸后端参数 | 不裁决所有 MQ 产品语义 |
| Delivery progression | 功能主链 | P0 | delivery 可从 scheduled 推进到 dispatched / completed / failed 等可追溯状态 | 不承诺全局 exactly-once |
| Feedback recording and idempotency anchor | 功能主链 / 一致性 | P0 | ack / fail / timeout / duplicate feedback 形成 history 和幂等锚点 | 不裁决订阅方业务副作用 |
| Retry / DLQ / replay preparation | 恢复主链 | P0 | retry、dead-letter、replay preparation 有材料、状态和审计链 | 不实现 DLQ Console UI |
| Read-only output and audit | 输出 / 审计 / 治理接缝 | P0 | transport view、tap、audit material、failure material 可读且不反写 truth | 不裁决 observability 长期存储或 governance decision |
| Outbox relay boundary | 接入边界 | P0-min | 只承接已提交 outbox fact,重复或未提交 fact 不推进为新事实 | 不裁决发布方业务事务内部 |
| Default verifiable backend / store path | 默认可验证路径 | P0-min | in-memory / fake / fixture path 能证明 port 语义和 delivery 默认路径 | 不裁决 production adapter 全量行为 |
| Config control plane | 配置 / 安全 | P0 | JSON profile、loader、validator、runtime graph、secret ref、reload rejection 成立 | 不裁决 config center、hot reload、admin override |
| Evidence and report chain | 证据门禁 | P0 | `reports/runs/<run_id>`、`reports/acceptance` 可裁决,不引用 latest | 不把 raw artifacts 当主要验收阅读材料 |
| Production MQ / durable adapter | adapter 专项 | P1 | 当前只裁决接缝和风险记录 | 真实产品行为后续专项 |
| Secret provider / KMS / Vault | 安全接缝 | P1 | 当前只裁决 secret ref 和 fail-closed | 真实 provider 集成后续专项 |
| Multi-backend / multi-tenant / config center | 未来扩展 | P2 | 当前只作为残余风险 | 不进入当前验收门禁 |

### 7.2 验收目标表

| 验收目标 | 通过条件摘要 | 失败条件摘要 |
|---|---|---|
| P0 主闭环成立 | F-001~F-006 均有通过证据,且无 S0 / S1 | 任一主链缺失或证据不可用 |
| P0-min 支撑边界成立 | F-007 / F-008 默认路径和接缝通过 | Outbox relay 或默认可验证路径不能支撑主链 |
| 数据边界成立 | bus 只保存 truth / snapshot / ref,不保存 forbidden body | payload body、raw secret、governance decision body 泄漏 |
| 架构边界成立 | core / bus / sdk / observability / governance / backend 边界清晰 | core / bus 双真相、downstream 反写真相 |
| 证据链成立 | report、artifact、acceptance handoff 可追溯到固定 `run_id` | 缺 report、缺 evidence、引用 latest 或跨 run |
| 残余风险可接受 | P1/P2 非范围有接受人和后续动作 | 无 owner、无期限、误声明已交付 |

### 7.3 非范围影响表

| 非范围 | 是否阻断 P0 | 是否进入最终结论 | 后续位置 |
|---|---|---|---|
| Production MQ / durable store 全量行为 | 否 | 是,作为 P1-risk | §13 |
| Gateway / auth / TLS | 否 | 是,说明外部归属 | §13 |
| 业务 payload 正文语义 | 否 | 是,但正文泄漏触发 S0 | §6 / §11 / §13 |
| Governance decision truth | 否 | 是,但 bus 生成 decision body 触发 S0 | §6 / §11 / §13 |
| Observability dashboard / alerting | 否 | 是,输出材料缺失则阻断 | §10 / §13 |
| SDK 高层开发者体验 | 否 | 是,transport view 不稳定则阻断 | §7 / §13 |
| Exactly-once / effectively-once | 否 | 是,说明非目标 | §13 |
| Config center / hot reload / admin override | 否 | 是,reload request 应 rejected | §9 / §13 |
| Multi-backend / multi-tenant | 否 | 是,作为 P2-risk | §13 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收范围表”“验收目标表”和“非范围影响表”小节，了解本章如何划分 P0 / P0-min / P1 / P2 验收范围。

本轮验收的核心目标是裁决 L0-bus 的 P0 事件传递主闭环和 P0-min 支撑边界是否成立。P0 主闭环包括 publication acceptance、transport semantic、delivery progression、feedback / idempotency、retry / DLQ / replay preparation、read-only output and audit。P0-min 支撑边界包括 Outbox relay boundary 和 default verifiable backend / store path。

本轮验收同时裁决配置控制面和证据链是否成立: JSON profile、ConfigLoader / ConfigValidator、RuntimeBuilder、secret ref、reload rejection、fail-fast / fail-closed 必须可验收;`reports/runs/<run_id>`、`reports/acceptance` 和必要的 `artifacts/test/<run_id>` 必须可追溯到固定 `run_id`。

Production MQ / durable store 全量行为、gateway / auth / TLS、业务 payload 正文语义、governance decision truth、observability dashboard / alerting、SDK 高层开发者体验、exactly-once、config center / hot reload、多后端和多租户矩阵不属于当前 P0 完整裁决范围。它们不应导致当前 P0 自动不通过,但必须在残余风险中保留责任角色和后续动作。

---

## 9. 待确认事项

当前没有阻塞进入 Step 3 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| production adapter 是否进入当前 P0 验收 | A. 进入;B. 只验接缝并作为 P1-risk;C. 不提 | 采用 B | 当前测试方案只支持 fake / in-memory 默认路径和 adapter 接缝 |
| 下游 SDK / observability / governance 是否全量验收 | A. 全量;B. 只验接缝;C. 不验 | 采用 B | L0-bus 只负责输出材料和边界,不替下游仓裁决产品能力 |
| 非范围是否写入 §2 | A. 写入;B. 只在风险章节写;C. 不写 | 采用 A | 验收范围必须一开始清楚,避免 P1/P2 污染 P0 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 核心裁决目标已定义 | 已满足 |
| P0 / P0-min / P1 / P2 验收范围已划分 | 已满足 |
| 下游能力只验接缝的范围已定义 | 已满足 |
| 影响最终结论的非范围已列出 | 已满足 |
| 一票否决候选范围已识别 | 已满足 |
| 验收范围可裁决,没有用“本次全部验收”替代范围表 | 已满足 |

结论: 可以进入 Step 3,固定验收基线。
