# Step 4. 定义配置分类与禁止配置化边界

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 4 中间产物。
> 本步定义 Conversation 配置类别、热更新 / 冷更新口径和禁止配置化边界。
> 本步不列完整配置项清单,不定义来源优先级,不写 JSON 示例,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
- 回填章节: `projects/L1-conversation/04-配置设计.md` §4 配置分类与边界

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认来源链、装配入口、控制面总表和模块读取边界 | 将控制面归类为启动、运行装配、入口、作业、策略、敏感、报告、测试和诊断配置 |
| `02-概要设计.md` §11.4 | 禁止配置化边界 | 作为本步禁止配置化项主来源 |
| `03-详细设计.md` §13 / §14.4 | 配置引用表、外部依赖绑定和观测字段禁止表 | 确认模块读取边界、secret / body / evidence 禁止项 |
| `01-架构设计.md` §13 / §14 / §15 | 横切关注点、不可接受方案和阻塞风险 | 确认授权视野、数据归属、派生不反写和失败不伪成功不能配置化 |
| `00-需求文档.md` §10 / §11 / §14 | 业务规则、数据归属和一票否决项 | 确认相邻仓正文、敏感凭据和越权消费不能通过配置进入 |

已确认结论:

```text
配置可以控制 runtime 装配、store / resolver / publisher / handoff adapter、entry profile、job policy、retention、projection feature、reports output 和 redaction profile。

配置不得控制或绕过 Conversation truth ownership、source truth isolation、forbidden body exclusion、participant / visibility boundary、domain state machine、idempotency semantics、audit / trace chain、projection read-only boundary、outbox / handoff failure rule 和 consistency diagnostic-only rule。
```

## 3. SOP 问题回答

### 3.1 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置?

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 Conversation runtime graph 如何装配 | `runtime.profile`、config path、entry enablement | 否 | 运行中替换会造成 repository、adapter 和 policy set 不一致 |
| 运行装配配置 | 绑定 store、resolver、publisher、handoff 和 runtime builder 接缝 | store profile、resolver profile、publisher profile、handoff profile | 否 | 外部接缝漂移会污染 truth、outbox 或 handoff evidence |
| 入口配置 | 控制 api / worker / jobs 入口启用和 intake profile | command intake、query intake、event source、job action | 否 | 入口绕过 runtime builder 或幂等边界 |
| 运行参数配置 | 控制 batch、retry、timeout、run id 和 report 输出 | batch limit、retry policy、timeout、report root | 否;job run 开始读取 | 运行中改变会破坏幂等、partial failure 和 evidence |
| 策略配置 | 选择已定义安全和横切策略 profile | redaction policy、retention policy、projection feature | 否 | 策略被误用为绕过边界的开关 |
| 敏感引用配置 | 只保存 secret / credential / endpoint 的引用 | `CredentialRef`、`SecretRef`、endpoint ref | 否 | raw secret、raw token 或来源正文泄露 |
| 报告 / 证据配置 | 控制 artifacts 和 reports 输出位置与格式 | `artifacts/test/<run_id>`、`reports/` | 否;run 开始读取 | 报告路径漂移会导致证据不可复核 |
| 测试 / fixture 配置 | 支撑 local / CI 和 deterministic tests | in-memory store、fake publisher、fake resolver、deterministic id | 否,启动选择 | fake / fixture 被误认为 production capability |
| 诊断 / 调试配置 | 支撑 local / CI 诊断,不改变 Conversation truth | verbose report、redaction check mode、safe diagnostic verbosity | local / test 有限允许 | 泄露 forbidden body、secret 或 private profile |
| P1/P2 扩展配置 | 后续 durable store、real bus、real resolver、remote config 和 hot reload | production endpoint refs、config center、admin override | 后续专项定义 | 提前写入会虚构字段并扩大 P0 |

### 3.2 哪些配置允许热更新?

P0 默认不支持核心配置热更新。凡是会改变 runtime graph、store、resolver、publisher、handoff、entry、job、retention、projection、redaction 或 report evidence 的配置,均采用启动读取、冷更新或 job run 开始读取。

当前只允许 local / test 诊断行为有限变化,且不得关闭 redaction、validator、forbidden body check、fake marker、idempotency、visibility guard 或 evidence output。

### 3.3 哪些配置只能冷更新或启动读取?

| 配置类别 | P0 生效方式 | 原因 |
|---|---|---|
| 启动配置 | 启动读取 | 改变 runtime graph |
| 运行装配配置 | 启动读取 | 改变 repository / adapter / port 实例 |
| 入口配置 | 启动读取 | 改变 api / worker / job 可用入口 |
| 运行参数配置 | job run 开始读取 | 绑定幂等、partial failure、report 和 rerun 语义 |
| 策略配置 | 启动读取 | 改变 policy set 和安全边界 |
| 敏感引用配置 | 启动读取 | 轮换需要 Step 8 和运维专项处理 |
| 报告 / 证据配置 | run 开始读取 | 证据路径必须稳定可复核 |
| 测试 / fixture 配置 | 测试启动读取 | 保持 local / CI 可复现 |
| P1/P2 扩展配置 | 后续专项定义 | remote reload 需要独立一致性、回滚和审计设计 |

### 3.4 哪些安全、审计、事务、一致性或领域规则禁止配置化?

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| Conversation truth 归属 | 配置不能让 Chat、Workspace、Runtime、Bridges、Governance、Artifact、Identity、Observability 或 Archive 接管本仓 truth | 回到需求、架构和概要设计重校准 |
| 来源仓 truth 不转移 | external fact 只能引用、快照或显化,不能复制来源正文或生命周期 | 回到数据归属、跨域显化和相邻仓契约重校准 |
| forbidden body 排除 | runtime reasoning、tool call、bridge message body、artifact body、source body、secret 不得进入本仓 fact / snapshot / outbox / trace | 回到安全需求、概要配置影响和详细设计对象契约重校准 |
| participant / visibility 授权视野 | 授权消费是核心边界,不能通过 profile 或 feature flag 绕过 | 回到需求、架构、概要和授权消费设计重校准 |
| domain state machine 迁移红线 | closed 重开、retracted 复活、invalid 变 fresh 等会破坏事实生命周期 | 回到详细设计状态矩阵重校准 |
| 幂等 duplicate / conflict 语义 | 冲突不能配置成成功,重复不能生成新事实 | 回到详细设计幂等和并发设计重校准 |
| audit / trace chain | fact append、scope change、manifestation、handoff 必须可追溯 | 回到追溯、审计和验收门禁重校准 |
| projection / search / cursor 反写真相 | 派生结构只能只读、可重建、最终一致 | 回到架构和概要派生边界重校准 |
| outbox / handoff 失败回滚 truth | 发布和交接是后置动作,失败不得取消已提交事实 | 回到一致性、恢复和详细设计状态矩阵重校准 |
| consistency validation 自动修复 truth | 当前只允许 diagnostic / report,不允许自动覆盖 truth | 回到概要接口、详细处理流和风险项重校准 |
| raw secret / raw token 写入配置或证据 | 破坏敏感信息保护和审计边界 | 回到配置 Step 8、安全门禁和实施计划重校准 |
| fake success 伪装 production success | fake / fixture 只能用于 local / CI,不能污染正式证据 | 回到测试、验收和 adapter 设计重校准 |
| 下游消费绕过授权视野 | Chat、Workspace、Runtime 或 SDK 消费不能反向定义可见范围 | 回到需求、架构和授权读取设计重校准 |
| 同步成功伪装异步传播 / 投影 / 归档完成 | command 成功只表示 truth 或 handoff intent 成立 | 回到关键交互、一致性和验收口径重校准 |

### 3.5 禁止配置化项如需改变应走什么流程?

禁止配置化项不是普通配置变更。任何改变都必须先判断它改变的是需求、架构、概要还是详细设计。

```text
提出改变禁止配置化边界
  |
  v
判断影响层级: 00 / 01 / 02 / 03
  |
  +-- 改变 00 / 01 / 02 / 03 -> 回到对应文档重新校准
  |
  +-- 只影响 04 表达 -> 进入 Step 14 风险 / 待确认事项
  |
  v
完成回写和复核
  |
  v
再进入 04 定稿 / 05 测试 / 06 验收 / 07 实施
```

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已有控制面总表,但没有分类和热 / 冷更新口径 | Step 5 / Step 7 难以判断来源覆盖和配置项生效方式 |
| `02-概要设计.md` §11.4 | 已列禁止配置化边界,但不是正式配置分类章节 | 读者可能把禁止项当作普通配置开关 |
| `03-详细设计.md` §13 | 已列配置引用,但没有禁止项改变流程 | 实现或运维可能绕过设计链路添加开关 |
| `03-详细设计.md` §14.4 | 已列观测字段禁止表,但未进入配置分类 | 需要在敏感和诊断配置中承接 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置分类 | 只有控制面 | 分为启动、运行装配、入口、运行参数、策略、敏感、报告、测试、诊断和扩展配置 | 支撑后续来源优先级、配置项清单和环境矩阵 |
| 热更新口径 | 未明确 | P0 核心配置默认冷更新 / 启动读取 | 避免 runtime graph 和 evidence 链运行中漂移 |
| 禁止配置化 | 分散在 01 / 02 / 03 | 汇总为禁止配置化项表和改变流程 | 防止配置开关绕过边界 |
| 诊断配置 | 未单独说明 | local / test 有限允许,但不得关闭安全和证据门禁 | 支撑排障,同时保护 redaction 和 forbidden body |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: P0 支持部分核心配置热更新 | 运维灵活 | 引入 runtime graph 替换、一致性、回滚和审计复杂度 | 不采用 |
| 方案 B: P0 核心配置冷更新,local / test 诊断项有限可变 | 行为稳定,测试可重复,实现边界清楚 | 运维灵活性较低 | 采用 |
| 方案 C: 所有诊断配置都禁止 | 安全保守 | 本地和 CI 排障成本过高 | 不采用 |
| 方案 D: 用 hidden feature flag 绕过红线 | 调试方便 | 本质上绕过需求、架构、状态和验收门禁 | 不采用 |

推荐方案 B。

原因:

- L1-conversation P0 当前目标是让 truth center 默认可验证路径稳定成立,不是建设在线动态配置系统。
- 冷更新能避免同一个 fact、projection、outbox、handoff 或 report run 跨配置版本。
- 诊断配置可以存在,但必须限制在 local / test,且不能关闭 redaction、validator、fake marker、visibility guard 或 evidence output。

## 7. 结构化中间产物

### 7.1 配置分类表

本表采用 SOP 要求的固定列,供正式 `04-配置设计.md` §4 直接回填。

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 如何装配 | `runtime.profile`、config path、entry enablement | 否 | 运行中替换依赖图 |
| 运行装配配置 | 绑定 store、resolver、publisher、handoff 接缝 | store / resolver / publisher / handoff profile | 否 | 外部接缝漂移污染 evidence |
| 入口配置 | 控制 api / worker / jobs 入口形态 | command intake、query intake、event source、job action | 否 | 入口绕过 runtime builder |
| 运行参数配置 | 控制 batch、retry、timeout、run id 和 output | batch limit、retry policy、timeout、report root | 否;run 开始读取 | 幂等和报告归档漂移 |
| 策略配置 | 选择已定义安全和横切策略 | redaction、retention、projection feature | 否 | 策略变成绕过边界开关 |
| 敏感引用配置 | 只保存 secret / credential 引用 | `SecretRef`、`CredentialRef` | 否 | raw secret 泄露 |
| 报告 / 证据配置 | 控制 artifacts 和 reports 输出 | `artifacts/test/<run_id>`、`reports/` | 否;run 开始读取 | 证据不可复核 |
| 测试 / fixture 配置 | 支撑 local / CI 可复现 | in-memory、fake resolver、fake publisher、deterministic id | 否 | fake 被误认成 production |
| 诊断 / 调试配置 | 支撑 local / CI 排障 | verbose report、safe diagnostic verbosity | local / test 有限允许 | 敏感数据泄露 |
| P1/P2 扩展配置 | 后续 production 和 remote config 能力 | durable store、real bus、config center、hot reload | 后续专项定义 | 虚构字段和范围膨胀 |

### 7.2 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| Conversation truth 归属 | 防止本仓退化为 UI、Workspace、Runtime 或来源仓副本 | 回到 00 / 01 / 02 重校准 |
| 来源仓 truth 不转移 | 防止 Work / Governance / Artifact / Identity 正文漂移 | 回到数据归属和相邻仓契约重校准 |
| forbidden body 排除 | 防止 runtime reasoning、tool call、bridge message、artifact body、secret 进入本仓 | 回到安全和对象契约重校准 |
| participant / visibility 授权视野 | 防止越权读取、订阅、变化感知或追溯读取 | 回到授权消费设计重校准 |
| domain state machine 红线 | 防止无效生命周期迁移 | 回到状态矩阵重校准 |
| 幂等 duplicate / conflict 语义 | 防止重复生成新事实或冲突伪成功 | 回到幂等和并发设计重校准 |
| audit / trace chain | 防止关键变化不可复盘 | 回到追溯、审计和验收门禁重校准 |
| projection / search / cursor 反写真相 | 防止派生结构成为第二 truth | 回到架构和概要派生边界重校准 |
| outbox / handoff 失败回滚 truth | 防止传播 / 交接失败取消已提交事实 | 回到一致性和恢复设计重校准 |
| consistency validation 自动修复 truth | 防止诊断 job 覆盖正式 truth | 回到概要接口和详细处理流重校准 |
| raw secret / raw token 写入配置或证据 | 防止敏感凭据泄露 | 回到配置 Step 8 和安全门禁重校准 |
| fake success 伪装 production success | 防止 local / CI 假能力污染正式证据 | 回到测试、验收和 adapter 设计重校准 |
| 下游消费绕过授权视野 | 防止下游反向定义可见范围 | 回到需求、架构和授权读取设计重校准 |
| 同步成功伪装异步完成 | 防止 command 成功被误解为 publish / projection / archive 完成 | 回到关键交互、一致性和验收口径重校准 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 4 定义配置分类、热 / 冷更新口径和禁止配置化边界,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 核心配置默认冷更新 / 启动读取 | 否 | 配置生效策略,未改变 loader / builder 签名 | 无 | 无回写 |
| 禁止配置化项承接 01 / 02 / 03 已有红线 | 否 | 与现有设计一致 | 无 | 无回写 |

说明:

```text
本步没有新增 `ConversationRuntimeConfig` 字段、`ConfigError` 枚举值、adapter constructor 参数或 trait。
Step 7 如需把某个禁止边界落为显式配置校验项,必须检查 `03` 是否已有可表达的错误模型。
```

## 9. 回填草稿

正式 `04-配置设计.md` §4 建议采用以下结构:

```text
4. 配置分类与边界
  4.1 配置分类表
  4.2 热更新 / 冷更新口径
  4.3 禁止配置化项表
  4.4 禁止项改变流程
  4.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §4.1 | `design-calibration/04_config_step_04_classification_boundaries.md` §7.1 |
| §4.2 | `design-calibration/04_config_step_04_classification_boundaries.md` §3.2 / §3.3 |
| §4.3 | `design-calibration/04_config_step_04_classification_boundaries.md` §7.2 |
| §4.4 | `design-calibration/04_config_step_04_classification_boundaries.md` §3.5 |
| §4.5 | `design-calibration/04_config_step_04_classification_boundaries.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续 Step 必须继续收口:

- Step 5 明确来源优先级中 secret / credential refs 不被普通 JSON 或 env raw value 覆盖。
- Step 7 明确哪些配置项对应本步分类,不得把禁止配置化项写成配置字段。
- Step 8 明确 raw secret、raw token 和 forbidden body 的配置拒绝策略。
- Step 11 明确配置错误、禁配项命中和依赖不可达时的 fail-fast / degraded 行为。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置分类表已形成 | 通过 | §7.1 |
| 禁止配置化项表已形成 | 通过 | §7.2 |
| 热 / 冷更新口径已形成 | 通过 | §3.2 / §3.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 5 | 通过 | 下一步定义配置来源、优先级与冲突处理 |
