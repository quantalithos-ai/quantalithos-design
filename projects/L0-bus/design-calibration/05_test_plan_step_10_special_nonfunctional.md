# L0-bus 05 测试方案 Step 10: 专项测试与非功能验证

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 10 中间产物。
> 本步定义性能、安全边界、一致性、恢复、配置、观测和审计专项测试。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 设计专项测试与非功能验证 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §10 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | 已完成 | 提取性能、可用性、安全、审计、幂等、一致性、可观测性和非功能验收口径 |
| `03-详细设计.md` §10~§15 | 已完成 | 提取事务、一致性、错误恢复、幂等、配置、观测、redaction 和测试切口 |
| `04-配置设计.md` §8 / §11 / §12 | 已完成 | 提取敏感配置、fail-fast / fail-closed、redaction 和 reports / artifacts 承接 |
| `05_test_plan_step_06_cases.md` | 已确认 | 提取功能用例、恢复用例和 redaction 用例 |
| `05_test_plan_step_09_automation_ci_gates.md` | 已确认 | 提取 nightly、failure injection、release gate、check / report 脚本 |

---

## 3. SOP 问题回答

### 3.1 哪些性能指标必须验证?

需求文档没有写死生产级数字,但要求测试方案补默认可验证路径的压测口径。因此当前专项只定义 P0 默认路径基线,不把它伪装成生产 SLO。

| 性能指标 | 验证对象 | 阈值来源 | 当前通过条件 |
|---|---|---|---|
| publication acceptance latency | `AcceptPublication` / outbox relay | Step 10 首次 release gate baseline | 生成 p50 / p95 / max 基线,且不触发 gate timeout |
| delivery progression throughput | `RunDeliveryProgression` / fake backend | Step 10 baseline + 后续回归比较 | 完成固定 fixture batch,无静默丢失 |
| feedback recording latency | `RecordDeliveryFeedback` | Step 10 baseline | ack / fail / timeout 均能完成并留 history |
| read-only query latency | Query / projection | Step 10 baseline | current / stale / not found 均返回一致性标记 |
| recovery operation latency | retry / DLQ / replay preparation | Step 10 baseline | recovery chain 完成,无 audit chain 缺失 |
| report generation time | report scripts | gate timeout | release report 生成完成,不超 gate timeout |

### 3.2 哪些安全和边界红线必须负向测试?

| 红线 | 负向触发 | 通过条件 |
|---|---|---|
| payload body 不得进入 bus | command / event / projection / evidence 注入 payload body | boundary violation 或 redaction check fail |
| raw secret 不得进入配置 / 日志 / 审计 | JSON / env / fake provider 返回 raw secret | fail-fast / fail-closed,无明文输出 |
| backend private body 不得泄漏 | fake backend 返回 private response | normalized result only,private body absent |
| Query 不得写 truth | Query stale projection 时尝试 auto rebuild | no write UoW,只返回 marker |
| failure material 不得生成 governance decision | 读取 failure material | 只输出 bus failure facts |
| replay 不得绕过 audit chain | 缺失 DLQ / approval / audit chain | replay preparation rejected |
| security boundary config 不得放宽 | `redaction_policy != required` 等 | config validation fail-closed |

### 3.3 哪些一致性和恢复场景必须故障注入?

| 故障注入 | 目标风险 | 通过条件 |
|---|---|---|
| publisher retryable failure | truth 提交后 outbound publish 失败 | truth 不回滚,写 publish evidence |
| source ack failure | committed outbox fact 已接入但 ack 失败 | 重复消费返回 existing |
| backend unavailable | delivery dispatch 失败 | delivery failed / retryable evidence,history append |
| repository unavailable | 写路径依赖失败 | dependency error,不生成半状态 |
| commit uncertain | UoW commit 不确定 | manual action evidence,不自动 unsafe retry |
| projection write failure | 派生输出失败 | truth 不回滚,projection marker stale / failed |
| duplicate idempotency key | 重复命令或 feedback | same digest existing,different digest conflict |
| concurrent delivery progression | 同一 delivery 并发推进 | expected version / conflict,不双写 |

### 3.4 哪些日志、指标和审计证据必须存在?

| 证据类型 | 必须存在的内容 | 禁止内容 |
|---|---|---|
| structured log | flow name、run_id、trace ref、result、error class | payload body、raw secret、backend private body |
| metric sample | suite、flow、status、duration、count | record id、secret ref 明文、高基数 payload digest |
| bus audit | actor、operation、target ref、state change、trace ref | payload body、raw secret、governance decision body |
| delivery history | delivery id、from / to status、reason、timestamp | backend private raw response |
| evidence artifact | test result、fixture summary、config profile、failure reason | forbidden body |
| report | suite result、coverage matrix、redaction result、artifact index | `latest` 引用、跨 run artifact 引用 |

### 3.5 阈值来自哪里?

| 阈值 / 通过条件类型 | 来源 | 当前处理 |
|---|---|---|
| 安全红线 | `00` §13 / §14、`03` §14 / §15、`04` §8 / §11 | 硬门禁,不得风险接受 |
| 一致性 / 幂等 | `00` §13、`03` §10~§12 | 硬门禁,失败阻断 |
| 审计 / 可追溯 | `00` §13 / §14、`03` §14 | 硬门禁,缺证据阻断 |
| 性能数值 | `00` §13 明确留给测试方案补默认路径基准 | 当前以 release gate baseline 方式建立,不虚构生产 SLO |
| gate timeout | Step 9 gate script 配置 | 超时即失败,具体 timeout 在实施脚本中配置并报告 |
| P1 adapter 指标 | P1 staging-like 专项 | 当前不阻断 P0 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 性能指标没有来源 | 需求层明确未写死数字 | 虚构 SLO 会误导验收 | 本步定义默认路径 baseline,不冒充生产 SLO |
| 安全红线分散 | payload、secret、private body、governance decision 分散在多章 | redaction 漏测会直接破坏 P0 | 本步单列安全负向专项 |
| 一致性故障未集中 | publisher/source/projection/commit uncertain 分散 | 副作用顺序错误难发现 | 本步单列故障注入专项 |
| 可观测性容易停留在“有日志” | 没有证据格式和禁止内容 | 无法验收 | 本步要求 log / metric / audit / evidence / report 均可检查 |
| 配置失效模式可能只测 happy path | raw secret、reload、policy 放宽未被专项覆盖 | 安全边界被配置绕过 | 本步纳入 config failure 专项 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 非功能验证 | 隐含在功能用例 | 性能、安全、一致性、恢复、观测、审计专项化 | 可评审 |
| 性能口径 | 数字未定义 | 默认路径 baseline + gate timeout | 不虚构 SLO |
| 安全验证 | redaction 用例局部覆盖 | 红线矩阵 + release check | 可阻断 |
| 故障注入 | 分散在用例 | publisher/source/backend/repository/projection/commit uncertain 统一覆盖 | 可复现 |
| 证据 | 只说明 artifacts / reports | 明确 log / metric / audit / evidence / report 的必须项和禁止项 | 可验收 |

---

## 6. 测试设计取舍

### 6.1 是否直接定义生产级性能 SLO

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接写死生产 p95 / throughput | 看似明确 | 当前无来源,违反 SOP | 不采用 |
| B. 先建立 P0 默认路径 baseline,后续由验收 / 运维补生产 SLO | 有来源,可演进 | 当前不是生产容量承诺 | 采用 |
| C. 完全不测性能 | 简单 | 违反需求 §13 | 不采用 |

### 6.2 是否把授权实现纳入 L0-bus 安全专项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在 bus 内实现完整认证授权测试 | 覆盖完整 | 与 gateway / identity / security 边界冲突 | 不采用 |
| B. bus 测 actor / privileged ref / access audit 接缝,不测认证实现 | 边界准确 | 授权产品链需后续仓覆盖 | 采用 |
| C. 完全不测授权边界 | 简洁 | tap / DLQ / replay / failure material 风险不可控 | 不采用 |

### 6.3 是否把专项测试全部放进 release gate

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部专项都 release gate 阻断 | 覆盖最强 | release 慢,且压力专项不必每次阻断 | 不采用 |
| B. 安全 / 一致性 / 审计硬红线阻断 release,压力和 P1 adapter 进入 nightly | 平衡风险和速度 | 需要分层 | 采用 |
| C. 专项只 nightly | release 快 | 红线可能绕过 release | 不采用 |

---

## 7. 结构化中间产物

### 7.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| Performance baseline | publication、delivery、feedback、query、recovery 默认路径耗时 | fixed fixture batch + duration metrics | release gate / nightly | 生成 p50 / p95 / max baseline,不触发 gate timeout | `EV-BUS-PERF-001`、`reports/runs/<run_id>/performance-baseline.md` |
| Security boundary | payload body、raw secret、backend private body、governance decision 泄漏 | negative fixture + redaction scan | PR / release gate | forbidden body absent,命中即失败 | `RP-BUS-RED-001` |
| Authorization seam | tap、DLQ read、replay preparation、failure material 输出边界 | actor context + privileged ref negative tests | service / API | 未授权或缺 ref 时 stable rejection + access audit | `EV-BUS-SEC-001` |
| Consistency / UoW | truth、audit、history、outbox evidence 顺序错误 | fake UoW call order + failure injection | service / integration | no half-state,no unsafe retry | `EV-BUS-CONS-001` |
| Idempotency / concurrency | duplicate command、duplicate event、same / different digest、并发推进 | deterministic duplicate + concurrent execution | PR / nightly | existing / conflict / version conflict 符合预期 | `EV-BUS-IDEM-001` |
| Recovery fault injection | backend unavailable、retry exhausted、DLQ、replay rejected / ready | recovery fixture + fake backend | main CI / release gate | history / audit / failure material 完整 | `EV-BUS-REC-FAULT-001` |
| Config failure mode | invalid JSON、unsupported key、raw secret、secret unavailable、reload request | config negative suite | PR / release gate | fail-fast / fail-closed / rejected | `EV-BUS-CFG-FAULT-001` |
| Observability / audit | log、metric、audit、trace ref、delivery history 缺失 | snapshot + report checks | main CI / release gate | required evidence present,forbidden body absent | `EV-BUS-OBS-001` |
| Report / artifact integrity | evidence 缺失、跨 run 引用、latest 引用 | `check_artifact_layout.sh` + `check_report_links.sh` | release gate | no latest,no project layer,no missing evidence | `RP-BUS-SUM-001` |
| P1 adapter smoke | staging-like adapter 差异 | real-like smoke | nightly / P1 | 当前不阻断 P0,失败进风险 | `EV-BUS-P1-ADAPTER-001` |

### 7.2 专项与门禁映射

| 专项 | PR gate | main CI | nightly | release gate |
|---|---|---|---|---|
| Performance baseline | smoke only | baseline sample | extended sample | required baseline report |
| Security boundary | redaction smoke | redaction sample | extended scan | full redaction check |
| Authorization seam | service negative | API negative | - | privileged operation gate |
| Consistency / UoW | service tests | integration tests | stress | selected release checks |
| Idempotency / concurrency | deterministic duplicates | integration duplicates | stress | selected release checks |
| Recovery fault injection | unit / service | integration | extended failure injection | recovery chain gate |
| Config failure mode | config unit | config integration | - | config runtime gate |
| Observability / audit | snapshot smoke | evidence sample | - | report evidence check |
| Report / artifact integrity | layout smoke | report smoke | - | full report / acceptance index |
| P1 adapter smoke | - | - | optional | not P0 blocking |

### 7.3 红线型通过条件

| 红线 | 失败即阻断 |
|---|---|
| forbidden body 出现在 log / audit / event / projection / evidence / report | 是 |
| raw secret 或完整连接串出现在配置摘要、日志、审计或报告 | 是 |
| Query 写 truth 或自动 rebuild projection | 是 |
| replay 缺少 dead-letter / history / audit chain 仍 ready | 是 |
| same idempotency key + different digest 没有 conflict | 是 |
| publisher / source ack / projection failure 回滚已提交 truth | 是 |
| report 引用 `latest` 或跨 run artifact | 是 |
| P0 gate 没有生成必要 evidence | 是 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_10_special_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“专项测试矩阵”“专项与门禁映射”和“红线型通过条件”小节，了解本章非功能和横切风险如何被验证。

本章把性能、安全边界、一致性、恢复、配置、观测、审计和证据完整性作为专项测试处理。性能当前不定义生产级 SLO,而是按照需求文档要求先建立 P0 默认可验证路径 baseline,报告 publication、delivery、feedback、query、recovery 和 report generation 的 p50 / p95 / max。安全、审计、一致性、幂等、redaction 和证据完整性属于硬门禁,失败不得降级为普通风险。

专项测试分别进入 PR gate、main CI、nightly 和 release gate。PR 前移安全和一致性红线;main CI 覆盖完整 fake / in-memory 集成路径;nightly 承接压力和故障注入扩展;release gate 必须覆盖 P0 主闭环、恢复链、配置装配、redaction、report / artifact integrity。

---

## 9. 待确认事项

当前没有阻塞进入 Step 11 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否写死生产级性能阈值 | A. 写死;B. 先建立默认路径 baseline;C. 不测性能 | 采用 B | 需求层没有生产数字来源,但要求测试方案补默认路径基准 |
| 授权是否由 bus 完整测试 | A. 完整认证授权;B. 测 actor / privileged ref / access audit 接缝;C. 不测 | 采用 B | gateway / identity / security 承接认证实现,bus 必须守住输出边界 |
| 压力和 P1 adapter 是否阻断 release | A. 全阻断;B. P0 红线阻断,压力和 P1 adapter 进入 nightly / 风险 | 采用 B | 当前 P0 不交付生产 adapter,但需要保留趋势和风险 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 性能 baseline 验证方式已定义 | 已满足 |
| 安全和边界红线负向测试已定义 | 已满足 |
| 一致性和恢复故障注入已定义 | 已满足 |
| 日志、指标、审计和报告证据已定义 | 已满足 |
| 阈值 / 通过条件来源已说明 | 已满足 |
| P0 非功能和红线均有验证方式 | 已满足 |

结论: 可以进入 Step 11,定义缺陷管理与复验规则。
