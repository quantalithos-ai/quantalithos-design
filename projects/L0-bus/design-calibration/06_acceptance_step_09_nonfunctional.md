# L0-bus 06 验收标准 Step 9: 非功能验收门禁

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 9 中间产物。
> 本步把性能、安全、可用性、恢复、审计、可观测性、配置失效、兼容性和证据完整性等非功能要求转换成可裁决的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义非功能验收门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §9 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §13 | 已完成 | 提取性能、可用性、安全、审计、幂等、一致性、可观测性要求 |
| `01-架构设计.md` §13 / §14 | 已完成 | 提取横切关注点、P0 / P1 / P2 演进边界和不可接受设计债务 |
| `03-详细设计.md` §14 / §15 | 已完成 | 提取观测处理流、redaction 规则和最小测试断言 |
| `05-测试方案.md` §10 / §11 / §14 | 已完成 | 提取专项测试矩阵、S0/S1/S2/P1-risk 分级和残余风险 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承 forbidden body、Query 不写 truth、P1/P2 不污染 P0 的红线 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已确认 | 继承 consistency / UoW、idempotency / concurrency 的裁决口径 |

---

## 3. SOP 问题回答

### 3.1 哪些非功能指标是 P0?

L0-bus 当前 P0 非功能指标围绕“默认可验证事件传递主闭环可运行、可追溯、可恢复、可审计、不泄漏、可交接”展开。

| 非功能维度 | 是否 P0 | 原因 |
|---|---|---|
| 性能 baseline | 是 | 需要证明默认可验证路径不会成为结构性瓶颈,但当前不写死生产容量数字 |
| 安全 / forbidden body | 是 | payload body、raw secret、backend private body、governance decision 泄漏会破坏边界 |
| 授权接缝 | 是 | tap、DLQ read、replay preparation、failure material 不能成为无约束面 |
| 可用性 / 恢复 | 是 | 后端、store、发布方输入不可用时必须形成拒绝、失败或恢复状态 |
| 审计 / 可追溯 | 是 | publication、delivery、feedback、retry、DLQ、replay 必须能追溯 |
| 幂等 / 一致性 | 是 | at-least-once 语义依赖 bus idempotency anchor 和 conflict 规则 |
| 可观测材料 | 是 | operator 和下游必须能读取必要运行材料,但不要求完整 dashboard |
| 配置失效模式 | 是 | invalid config、raw secret、secret unavailable、reload request 必须 fail-fast / fail-closed / rejected |
| Report / artifact integrity | 是 | 验收需要固定 `<run_id>`、无 latest、无跨 run 引用、无 forbidden body |
| production MQ / durable store 全量行为 | 否, P1-risk | 当前 P0 使用 fake / in-memory 默认路径 |
| Observability dashboard / alerting | 否, P1/P2 | bus 只输出材料,不做观测产品 |
| SDK developer experience | 否, P1/P2 | bus 只保证 view / error contract,SDK 体验归 SDK |
| Exactly-once / effectively-once | 否,专项 | 当前默认 at-least-once + subscriber idempotency |

### 3.2 阈值来自需求、设计还是运行基线?

非功能阈值必须来自上游文档或测试方案。当前不能凭空写生产吞吐、延迟或容量数字。

| 阈值类型 | 来源 | 当前口径 |
|---|---|---|
| 性能阈值 | `05-测试方案.md` Performance baseline | 生成 p50 / p95 / max baseline,不触发 gate timeout |
| 安全阈值 | `00` 数据边界、`03` redaction、`05` redaction check | forbidden body absent,命中即失败 |
| 授权阈值 | `00` / `01` 授权边界、`05` Authorization seam | 未授权或缺 privileged ref 时 stable rejection + access audit |
| 可用性阈值 | `00` 可用性、`03` error recovery、`05` recovery fault injection | 不静默丢弃,形成 rejected / failed / retryable / manual action evidence |
| 审计阈值 | `00` 审计要求、`03` observability、`05` Observability / audit | required audit / history / evidence present |
| 一致性阈值 | `03` UoW / idempotency / concurrency、`05` consistency tests | no half-state,no unsafe retry,existing / conflict / version conflict 符合预期 |
| 配置阈值 | `04` 配置设计、`05` config failure mode | invalid / unsupported / raw secret fail-fast;secret unavailable fail-closed;reload rejected |
| 证据阈值 | `05` report / artifact integrity | no latest,no project layer,no missing evidence |

### 3.3 哪些专项未覆盖,是否影响验收?

未覆盖专项必须区分为 P0 缺口、S2 条件接受或 P1/P2 残余风险。

| 未覆盖 / 后置专项 | 当前影响 |
|---|---|
| production MQ / durable store 全量行为 | P1-risk,不阻断当前 P0,但不得宣称已交付 |
| Secret provider / KMS / Vault 产品集成 | P1-risk,当前只验 secret ref / fake provider |
| Gateway / auth / TLS | 外部归属,当前 bus 保留 actor / access audit 接缝 |
| 业务 payload 正文语义 | 外部归属,不阻断 bus P0;bus 保存正文则 S0 |
| Governance decision truth | 外部归属,不阻断 bus P0;bus 生成 decision body 则 S0 |
| Observability dashboard / alerting | P1/P2,不阻断 bus P0;bus 输出材料缺失则阻断 |
| SDK developer experience | P1/P2,不阻断 bus P0;view / error contract 不稳定则阻断 |
| Exactly-once / effectively-once | 专项,当前非目标;误声明为已支持需进入风险或整改 |
| Config center / hot reload / admin override | P2,当前 reload request 必须 rejected |
| Multi-backend / multi-tenant matrix | P2,当前不作为 P0 门禁 |

### 3.4 哪些非功能失败会阻断发布?

非功能失败是否阻断发布取决于其是否破坏 P0 主闭环、红线、安全、证据或可追溯性。

| 失败类型 | 阻断口径 |
|---|---|
| forbidden body 泄漏 | S0,阻断 PR / release / acceptance |
| raw secret 或完整连接串泄漏 | S0,阻断 PR / release / acceptance |
| Query 写 truth、replay 绕过 audit chain | S0,阻断 PR / release / acceptance |
| 无 reports 或 P0 证据不可用 | S0 或阻断进入验收 |
| P0 主链用例失败、schema 破坏、幂等 conflict 缺失 | S1,阻断 PR / main CI / release |
| UoW 半状态、unsafe retry、不可追溯失败 | S1,严重时升级 S0 |
| performance baseline 生成失败或触发 gate timeout | S1 或 S2,按是否影响 P0 主闭环裁决 |
| 非关键报告字段缺失 | S2,可条件接受但需 owner / deadline / 复验 |
| staging-like adapter smoke 失败 | P1-risk,不阻断当前 P0,但必须记录 |

### 3.5 证据来自哪里?

正式验收证据必须来自固定 `<run_id>` 下的 reports / artifacts,不能来自口头确认或本机当前状态。

| 证据类型 | 来源 |
|---|---|
| 性能 baseline | `EV-BUS-PERF-001`、`reports/runs/<run_id>/performance-baseline.md` 如生成 |
| 安全 / redaction | `RP-BUS-RED-001`、`reports/runs/<run_id>/redaction-check.md` |
| 授权接缝 | `EV-BUS-SEC-001`、service / API negative tests |
| 一致性 / UoW | `EV-BUS-CONS-001` |
| 幂等 / 并发 | `EV-BUS-IDEM-001` |
| 恢复故障注入 | `EV-BUS-REC-FAULT-001`、`EV-BUS-REC-*` |
| 配置失效模式 | `EV-BUS-CFG-FAULT-001`、`EV-BUS-CFG-*`、`config-summary.md` |
| 观测 / 审计 | `EV-BUS-OBS-001`、audit / history evidence |
| report / artifact integrity | `RP-BUS-SUM-001`、`artifact-index.md`、`evidence-index.md` |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 需求层没有写死生产性能数字 | 只有“不得成为结构性瓶颈” | 验收时可能凭空造阈值 | 本步只采用 baseline + gate timeout 口径 |
| 安全、边界、证据与非功能交叉 | Step 6 / Step 10 / Step 11 都会涉及 | 重复或遗漏红线 | 本步定义非功能维度和结论口径,Step 10 / 11 再展开证据和否决 |
| P1 生产化能力容易被写成 P0 非功能 | production MQ、KMS、dashboard、SDK 体验 | 当前验收范围失控 | 本步明确 P1/P2 风险不阻断 P0,但不得误声明 |
| 非功能失败严重度不稳 | performance 波动、报告字段缺失、红线泄漏差异很大 | 结论口径混乱 | 本步按 S0 / S1 / S2 / P1-risk 分层 |
| 证据来源可能口头化 | “已检查安全/性能”不可复查 | 验收不可审计 | 本步要求固定 `<run_id>` 证据 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 性能 | 模糊质量要求 | baseline + no gate timeout,不虚构生产数字 | 有来源 |
| 安全 | 边界规则分散 | forbidden body / raw secret / authorization seam 形成门禁 | 可裁决 |
| 可用性 / 恢复 | 只写不可用时要处理 | rejected / failed / retryable / manual action evidence | 可审计 |
| 审计 / 可观测 | 输出材料要求分散 | required evidence present,不承载 dashboard 产品 | 不越界 |
| P1/P2 | 容易混入当前通过条件 | P1-risk / P2 明确后置 | 防止范围漂移 |
| 严重度 | 未统一 | S0 / S1 / S2 / P1-risk 对应结论口径 | 支撑放行 |

---

## 6. 验收设计取舍

### 6.1 是否写死性能数字

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接写 p95 / QPS 数字 | 看起来明确 | 上游未定义,会虚构阈值 |
| B. 当前绑定 baseline 生成和 gate timeout,后续专项再补生产数字 | 有来源,不虚构 | 生产容量结论后置 | 采用 |
| C. 不验性能 | 文档简单 | 无法证明默认路径不是结构性瓶颈 | 不采用 |

### 6.2 是否把 P1 production adapter smoke 失败作为 P0 不通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 是 | 更严格 | 与当前 P0 fake / in-memory 默认路径冲突 |
| B. 否,记录 P1-risk;若污染 P0 semantic 或安全红线则升级 | 范围清晰 | 生产化风险后置 | 采用 |
| C. 完全不记录 | 简短 | 后续风险不透明 | 不采用 |

### 6.3 是否把非关键报告字段缺失判为不通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部不通过 | 严格 | 低风险格式问题会阻断交付 |
| B. P0 证据缺失不通过,非关键字段缺失可 S2 条件接受 | 可裁决 | 需要明确 owner / deadline / 复验 | 采用 |
| C. 全部条件接受 | 宽松 | 证据链可能不可审计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-NFR-001 | 性能 baseline | publication、delivery、feedback、query、recovery 默认路径必须生成耗时基线 | 生成 p50 / p95 / max baseline,且不触发 gate timeout | `EV-BUS-PERF-001`、release / nightly report | baseline 缺失或 gate timeout 影响 P0 时不通过;轻微波动可 S2 |
| AC-NFR-002 | 安全 / forbidden body | payload body、raw secret、backend private body、governance decision 不得泄漏 | forbidden body absent,命中即失败 | `RP-BUS-RED-001`、`redaction-check.md` | S0,一票否决候选 |
| AC-NFR-003 | 授权接缝 | tap、DLQ read、replay preparation、failure material 输出必须有授权边界 | 未授权或缺 privileged ref 时 stable rejection + access audit | `EV-BUS-SEC-001` | 未授权可读 / 可操作时不通过;严重越权进入 S0 候选 |
| AC-NFR-004 | 可用性 / 依赖不可用 | store、backend、source、publisher 不可用时形成明确失败或恢复证据 | rejected / failed / retryable / manual action evidence,不静默丢弃 | `EV-BUS-REC-FAULT-001`、`TC-BUS-BND-*` | 静默丢弃或不可追溯失败不通过 |
| AC-NFR-005 | 审计 / 可追溯 | publication、delivery、feedback、retry、DLQ、replay、tap 输出必须可追溯 | required audit / history present | `EV-BUS-OBS-001`、`EV-BUS-CONS-001` | 关键链路缺 audit / history 不通过;影响 replay trusted chain 时 S0 候选 |
| AC-NFR-006 | 幂等 / 一致性 | duplicate command / event / job / publisher retry 必须可判定 | existing / conflict / version conflict 符合 `03` | `EV-BUS-IDEM-001` | conflict 缺失或重复 truth 不通过 |
| AC-NFR-007 | 配置失效模式 | invalid JSON、unsupported key、raw secret、secret unavailable、reload request 有稳定失败口径 | fail-fast / fail-closed / rejected | `EV-BUS-CFG-FAULT-001`、config summary | 非法配置仍启动或 reload 隐式生效不通过 |
| AC-NFR-008 | 可观测材料 | operator 可判断 backlog、retry backlog、DLQ material、failed summary、backend health | required evidence present,forbidden body absent | `EV-BUS-OBS-001`、`reports/runs/<run_id>` | bus 输出材料缺失不通过;dashboard 缺失为 P1/P2 风险 |
| AC-NFR-009 | Report / artifact integrity | 验收证据必须固定 `<run_id>`,无 latest、无 project layer、无 missing evidence | no latest,no project layer,no missing evidence | `RP-BUS-SUM-001`、`artifact-index.md`、`evidence-index.md` | P0 证据不可用不通过或阻断进入验收 |
| AC-NFR-010 | P1/P2 非范围声明 | production adapter、KMS、dashboard、SDK、exactly-once 等不得误声明为当前 P0 已交付 | handoff / risk list 明确后置归属 | `reports/acceptance/risk-acceptance.md` | 误声明需修正;造成红线事实则不通过 |

### 7.2 非功能专项到结论映射表

| 专项 | P0 裁决 | 不通过条件 | 可条件接受条件 |
|---|---|---|---|
| Performance baseline | 必须有 baseline 和 gate timeout 结果 | 无 baseline、触发 P0 gate timeout、默认路径无法运行 | baseline 波动但不影响 P0,有 owner / deadline / 复验 |
| Security boundary | 必须 redaction clean | forbidden body / raw secret 命中 | 不允许条件接受 |
| Authorization seam | 必须 stable rejection + access audit | 未授权可读 / 可操作 privileged material | 低风险 access audit 字段缺失可 S2 |
| Consistency / UoW | 必须 no half-state / no unsafe retry | 半状态、unsafe retry、truth 与 audit 不一致 | 不影响 P0 的非关键 evidence 字段可 S2 |
| Idempotency / concurrency | 必须 existing / conflict / version conflict | duplicate truth、conflict 缺失、并发双终态 | 不允许核心幂等条件接受 |
| Recovery fault injection | 必须 history / audit / failure material 完整 | 静默丢弃、不可追溯失败、replay 绕过链路 | 非关键 failure reason 文案可 S2 |
| Config failure mode | 必须 fail-fast / fail-closed / rejected | raw secret 接受、invalid config 启动、reload 生效 | 非关键 validation message 可 S2 |
| Observability / audit | 必须 required evidence present | P0 audit / history / material 缺失 | 非关键字段缺失可 S2 |
| Report / artifact integrity | 必须 no latest / no project layer / no missing P0 evidence | P0 证据缺失、跨 run、latest、forbidden body | 非关键报告字段可 S2 |

### 7.3 P1/P2 非功能残余风险表

| 风险 | 当前不阻断原因 | 必须保留的说明 |
|---|---|---|
| Production MQ / durable store 全量行为 | P0 使用 fake / in-memory 默认路径 | 后续 P1 adapter smoke / production adapter 专项 |
| Secret provider / KMS / Vault 产品集成 | P0 只验 secret ref / fake provider | 后续 security / ops 专项 |
| Gateway / auth / TLS | bus 不实现身份校验入口 | bus 只保留 actor / access audit 接缝 |
| Observability dashboard / alerting | bus 只输出观测材料 | dashboard、长期存储、告警阈值归 observability |
| SDK developer experience | bus 只提供 transport view / error contract | 多语言 SDK 和封装体验归 SDK |
| Exactly-once / effectively-once | 当前非目标 | 当前语义为 at-least-once + bus idempotency anchor + subscriber idempotency |
| Config center / hot reload / admin override | P2 非范围 | reload request 当前必须 rejected |
| Multi-backend / multi-tenant matrix | P2 非范围 | 不改变当前单一默认可验证 path 验收 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“非功能验收表”“非功能专项到结论映射表”和“P1/P2 非功能残余风险表”小节,了解本章如何把非功能需求和专项测试转换为验收门禁。

本轮非功能验收以 `AC-NFR-001`~`AC-NFR-010` 为裁决入口。P0 非功能门禁包括性能 baseline、安全 / forbidden body、授权接缝、可用性 / 依赖不可用、审计 / 可追溯、幂等 / 一致性、配置失效模式、可观测材料、report / artifact integrity 和 P1/P2 非范围声明。

性能门禁不得虚构生产吞吐或延迟数字。当前阈值来自 `05-测试方案.md` 的 Performance baseline:必须生成 p50 / p95 / max baseline,且不触发 gate timeout。后续如需要生产容量指标,必须进入 P1/P2 或专项测试,不能在本轮 P0 验收中临时补写。

安全、边界、幂等、一致性、配置失效和证据完整性属于硬门禁。forbidden body 或 raw secret 泄漏、Query 写 truth、replay 绕过 audit chain、P0 证据缺失、幂等 conflict 缺失、非法配置仍启动等失败不得判定为通过或有条件通过。

Production MQ / durable store、KMS / Vault、gateway / auth / TLS、observability dashboard、SDK developer experience、exactly-once、config center / hot reload、多后端和多租户不属于当前 P0 完整非功能验收范围。它们必须进入残余风险或后续专项,且不得被误声明为当前已交付能力。

---

## 9. 待确认事项

当前没有阻塞进入 Step 10 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 性能是否写死生产数字 | A. 写死;B. 当前只绑定 baseline + gate timeout;C. 不验性能 | 采用 B | 上游没有生产数字,不能虚构阈值 |
| P1 production adapter smoke 失败是否阻断 P0 | A. 阻断;B. 记录 P1-risk,除非污染 P0 / 红线;C. 不记录 | 采用 B | 与当前 fake / in-memory P0 默认路径一致 |
| 非关键报告字段缺失是否不通过 | A. 全部不通过;B. P0 证据缺失不通过,非关键字段可 S2;C. 全部条件接受 | 采用 B | 区分证据链硬门禁和低风险文档质量问题 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 非功能指标已定义 | 已满足 |
| 每个阈值均有来源,未虚构生产数字 | 已满足 |
| 未覆盖专项对验收结论的影响已定义 | 已满足 |
| 非功能失败的 S0 / S1 / S2 / P1-risk 口径已定义 | 已满足 |
| 证据来源已绑定固定 `<run_id>` 下的 reports / artifacts | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 10,定义可观测性、审计与证据门禁。
