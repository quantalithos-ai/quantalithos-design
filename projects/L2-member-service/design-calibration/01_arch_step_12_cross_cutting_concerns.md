# 01 架构校准 Step 12：横切关注点

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 11 completed / pass
> 本步目的：按架构单元固定安全、追溯、韧性、并发、可观测、性能、配置和兼容性约束

## 1. Step 内计划

- [x] 读取 flow、台账、Step 2 / 8~11 和正式 00 的 NFR / VF。
- [x] 判断哪些横切类别确实适用于宿主控制面，排除通用模板空话。
- [x] 为每类关注点给出作用范围、架构约束、判断口径和保护目标。
- [x] 按 A1~A5、S1~S3、P1~P3 做适用性映射。
- [x] 单独处理未量化性能、配置不可越界和开放合同兼容性。
- [x] 逐横切项停审并执行跨横切冲突审计。
- [x] 形成正式 §13 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 安全边界如何处理

- 所有生命周期变更必须有正式 principal / source / scope 语境，当前项目型主语必须通过双锚验证。
- required qualification 缺失、冲突、陈旧或未知时 fail closed；不得本地 allowlist、默认授权或 host fallback。
- credential / secret、外部正文和敏感 endpoint / mount / capture 内容不得进入 truth、safe view、日志材料或 handoff。
- 高影响 restart / terminate / cleanup / relocate 必须受 generation fence 和可追溯决定保护；本仓不自行生成 Governance approval。

### 2.2 可观测性和审计覆盖什么

覆盖意图受理、决定、实例世代、装配分项 / readiness、注册 / session、健康变化、恢复 / 终止、cleanup / residual、reconciliation 和 handoff attempt / gap。材料必须 body-free、可关联、能区分 local fact 与 external status。Observability 失效不能使本仓失去本地判断能力，也不能让本仓声明 observed。

### 2.3 可用性和韧性守住什么

- 正式状态承载不可用时拒绝新增不可追溯 truth，不以内存或后端状态补写。
- 上游 source 不可用时新决定 waiting / blocked，存量 snapshot 显式 stale。
- backend / binding 不可用时新装配 blocked，存量 host 状态进入 degraded / unknown，不 host fallback。
- Bus / Observability / projection 失败不阻塞已提交核心 truth，但形成 gap / stale 并可重建。
- external side effect unknown 时 fence、hold、reconciliation，不盲重放。

### 2.4 性能预算如何表达

当前没有 workload、并发规模、健康窗口、环境或测量 authority，因此不写 P95、QPS、SLA、heartbeat 数字或保留窗口。架构判断口径是：同步入口只做即时权威判断；长时副作用和派生不得占用同步完成语义；运行角色可独立扩缩；投影 / 观测失败不阻塞核心；任何未来指标都必须按场景、环境、分位数 / 窗口和证据来源确权。

### 2.5 配置如何管理，什么不得配置化

可配置候选包括 source freshness、健康判定窗口、动作超时 / backoff、并发 / 容量 guard、backend adapter、required qualification、projection / reconciliation 节奏和安全材料裁剪。配置不得改变 truth owner、项目型主语、required seam 是否可被绕过、四语义层、forbidden body、single-active、generation fence、local / external outcome 分层或 pending 合同状态。具体 key、默认值、层级和热更新留给 04。

### 2.6 哪些横切项不适用或后移

- 业务多租户计费、LLM token 成本、模型安全、Tool policy、Sandbox enforcement、镜像供应链扫描、Artifact retention 和产品 UI accessibility 属相邻 owner，不作为本仓横切职责。
- 具体加密算法、secret store、监控产品、告警规则、压测脚本、备份拓扑和灾备数字属于后续设计 / 实施，不在架构层锁定。

## 3. 当前材料诊断与取舍

| 历史内容 | 诊断 | 本步处理 |
|---|---|---|
| SLA 99.9%、P95、QPS、并发数字 | 无 workload / measurement authority | 删除数字，保留同步轻量化、角色可扩缩和证据化指标口径。 |
| heartbeat 30s x 3、forensic 10 分钟 | 配置与策略数字越级 | 仅保留 freshness / missing / retention owner 语义，数值后移。 |
| 监控、日志、告警清单 | 通用实现模板，且可能吸收 Observability truth | 改为 body-free material、local diagnosability 和 no observed claim。 |
| 密钥存储方案 | credential owner 尚未闭口，产品选择越级 | 只固定 secret 不入仓、实例绑定 ref、fail closed。 |
| 自动重试一切失败 | unknown 副作用可能被重复执行 | 固定幂等、generation fence、可重试资格与 reconciliation。 |
| 配置可切换 Sandbox / policy | 配置可能绕过硬边界 | required qualification 和 owner boundary 不可配置化。 |

## 4. 结构化中间产物

### 4.1 横切关注点结论

| 类别 | 作用范围 | 架构约束 | 判断口径 | 保护目标 |
|---|---|---|---|---|
| 主语、授权与控制安全 | A1、A4、A5、正式入口 | 每次变化有 principal / source / scope；项目型双锚；高影响动作显式决定 | 无正式主语 / 授权 / 依据即 rejected / waiting / blocked | 防止越权、隐式和非项目型宿主。 |
| Qualification 与 fail closed | A1、A2、S1、S2 | required source / supply / credential / binding / carrier 缺一不可 | missing / stale / conflict / unknown / pending 均非 ready | 防止默认放行和 host fallback。 |
| 数据最小化与 forbidden body | 全部单元，重点 P1~P3 / S3 | 只保留 typed ref、safe snapshot、redacted marker、body-free material | 任一 secret / external body 进入 truth / view / material 即违反 | 防止敏感泄漏和 owner 迁移。 |
| 审计与追溯 | A1~A5、S3 | 决定、世代、状态变化、尝试和 gap 可回链且历史不覆盖 | 任一关键结论无法回指来源 / 实例 / 前态即不合格 | 支撑调查、恢复和责任归属。 |
| 幂等、顺序与并发 | A1~A5、正式入口、S2 | single-active、稳定相关锚、generation fence、迟到不覆盖 | duplicate / concurrent / late / out-of-order 不产生第二 truth 或盲重放 | 防止竞争宿主、session 和重复副作用。 |
| 可用性与韧性 | 三运行角色、状态承载、S1~S3 | 核心 truth 优先；source / backend 故障显式；外围失败隔离 | 无法提交则拒绝；外部失败为 blocked / degraded / unknown / gap | 不生成不可追溯状态，不 fail open。 |
| 可观测与本地可诊断 | A1~A5、S3、运行角色 | 输出最小 body-free material；本地事实足以判断，不依赖 observed | Observability 不可用仍能定位 local state / gap，且不声明 observed | 保持诊断能力并守住 Observability owner。 |
| 性能与容量结构 | 同步入口、后台推进、信号 / 维护、投影 | 同步边界轻量；长时与派生分离；角色可独立扩缩 | 未来指标必须有 workload、环境、口径和证据；当前无伪数字 | 防止长时副作用拖垮入口和无 authority 指标回流。 |
| 配置与变更控制 | 全部单元及 adapter | 配置只改变可调参数，不改变 owner、红线、状态语义或 pending | 配置无法开启非项目型、绕过 qualification、改写 truth 或伪造 ready | 防止配置暗改架构。 |
| 合同兼容与开放边界 | S1~S3、A3、技术承载 | 合同版本 / capability 不可识别时 unsupported / blocked；placeholder 不冒充兼容 | Member / Runtime / Images / Sandbox / Core / SDK 未闭口路径无正向声明 | 防止 schema drift 和 sibling 进行中内容升格。 |
| 投影与外围消费隔离 | P3、S3 | 只读、可迟滞、可重建；外部 receipt 不反写 | view stale / unavailable 不改变 A1~A5；delivery / observed 独立 | 防止消费便利成为第二写源。 |

### 4.2 按架构单元的横切适用性

| 单元 | 重点适用横切项 | 单元级判断口径 |
|---|---|---|
| A1 | 主语 / 授权、审计、幂等、配置 | 无双锚和正式 source 不受理；重复决定稳定；查询不触发变化。 |
| A2 | qualification、最小化、审计、并发、韧性、合同兼容 | required 前置共同成立；partial / pending 非 ready；实例世代唯一。 |
| A3 | 安全、审计、single-active、兼容 | 注册来源可信；endpoint / session 活动唯一；正向合同 pending 不伪造。 |
| A4 | 控制安全、审计、顺序、韧性、可诊断、配置 | 信号 freshness 与 generation 明确；unknown 不盲恢复；阈值不硬编码。 |
| A5 | 控制安全、审计、幂等、韧性、可诊断 | local cleanup / gap / residual 分层；对账不删历史；外部完成不冒认。 |
| S1 | qualification、最小化、兼容、配置 | 只消费 ref / safe snapshot；unresolved / stale fail closed。 |
| S2 | qualification、幂等、韧性、兼容、配置 | adapter 不泄漏产品语义；unknown 副作用 fenced；no host fallback。 |
| S3 | 最小化、审计、可观测、投影隔离、兼容 | body-free；local attempt / gap 分层；不声明 external completion。 |
| P1 | 最小化、freshness、配置 | snapshot 有 owner / scope / captured-at 语义；不反写。 |
| P2 | 最小化、顺序、对账 | refs / summaries 可失效；迟到 / 冲突显式；不保存正文。 |
| P3 | 投影隔离、性能、韧性 | 可迟滞 / 重建 / unavailable；不阻塞核心，不成为命令源。 |

### 4.3 横切主线映射

| 主线 | 必须共同成立的横切约束 |
|---|---|
| C-MS-1 / A1 | 双锚、正式 source、授权外置、幂等决定、审计、配置不可扩范围。 |
| C-MS-2 / A2 + S1 / S2 | fail-closed qualification、secret / body-free、generation fence、adapter 中立、合同兼容。 |
| C-MS-3 / A3 | 可信注册、single-active、历史连续、Member / Runtime placeholder 诚实。 |
| C-MS-4 / A4 | 信号 freshness、健康分层、fence / hold、可诊断、阈值后移。 |
| C-MS-5 / A5 + S3 / P3 | local / external outcome 分层、residual / gap、对账不删历史、投影只读。 |

## 5. 横切关注点逐项停审

| 横切项 | 适用范围明确 | 判断口径可审查 | 未下沉实现 | 与 Step 8 / 9 一致 | 结果 |
|---|---|---|---|---|---|
| 主语 / 授权安全 | 是 | 是 | 是 | 是 | pass |
| Qualification / fail closed | 是 | 是 | 是 | 是 | pass |
| 数据最小化 / forbidden body | 是 | 是 | 是 | 是 | pass |
| 审计 / 追溯 | 是 | 是 | 是 | 是 | pass |
| 幂等 / 顺序 / 并发 | 是 | 是 | 是 | 是 | pass |
| 可用性 / 韧性 | 是 | 是 | 是 | 是 | pass |
| 可观测 / 本地可诊断 | 是 | 是 | 是 | 是 | pass |
| 性能 / 容量结构 | 是 | 是，无伪数字 | 是 | 是 | pass |
| 配置 / 变更控制 | 是 | 是 | 是 | 是 | pass |
| 合同兼容 / 开放边界 | 是 | 是 | 是 | 是 | pass |
| 投影 / 外围消费隔离 | 是 | 是 | 是 | 是 | pass |

## 6. 跨横切约束审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在模板化空话 | pass | 每项均有具体作用范围、失败状态和保护目标。 |
| 安全与可用性是否冲突 | pass | required seam 失效选择 blocked / degraded，不以 fail open 换可用性。 |
| 审计与数据最小化是否冲突 | pass | 追溯使用 ref / safe summary / redacted marker，不保存正文。 |
| 性能与一致性是否冲突 | pass | 同步边界轻量化不削弱本仓提交、single-active 或 qualification。 |
| 配置是否可绕过架构 | pass | owner、主语、红线、fence、outcome layering 不可配置。 |
| Observability 是否反写真相 | pass | 只消费 material；本地判断不依赖 observed。 |
| pending 是否保持证据诚实 | pass | 开放合同只能 unsupported / blocked / waiting。 |

## 7. 回填草稿

- 正式 §13 采用 11 行横切关注点表、11 单元适用表和主线映射表。
- 逐项停审与跨横切审计留在 calibration。
- 正式正文不得出现旧 SLA / P95 / QPS / heartbeat / retention 数字或具体监控、密钥、告警、压测实现。

## 8. Gate 自检

| 检查项 | 结果 |
|---|---|
| 适用横切类别是否完整且非模板化 | pass |
| 11 个架构单元是否有适用性判断 | pass |
| 每个横切项是否独立停审 | pass |
| 是否与数据 / 交互语义无冲突 | pass |
| 性能和配置是否保持架构层口径 | pass |
| 是否允许创建 Step 13 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_13
formal_01_write_allowed = false
```
