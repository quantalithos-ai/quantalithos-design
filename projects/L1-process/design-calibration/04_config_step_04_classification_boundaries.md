# Step 4. 定义配置分类与禁止配置化边界

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 4 中间产物。
> 本步定义配置类别、热 / 冷更新口径和禁止配置化红线。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
- 回填章节: `projects/L1-process/04-配置设计.md` §4 配置分类与边界

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 3 配置控制面 | 分类配置项 | 配置主要落在 runtime、adapter、entry、job、security、evidence 等控制面 |
| `01-架构设计.md` §13 / §15 | 架构红线 | 配置不得绕过外部输入、数据正文、依赖边界、恢复和可观测边界 |
| `02-概要设计.md` §11.2 | 禁止配置化边界 | Process truth、外部正文、profile / instance 显式边界、recovery 不分叉等不可配置化 |
| `03-详细设计.md` §13 | 配置 validation rules | 违反边界的配置必须 reject |

## 3. SOP 问题回答

### 3.1 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置?

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 如何装配 | config path、profile、store adapter、clock / id kind | 否 | 运行中替换依赖图 |
| 运行装配配置 | 绑定 store、resolver、publisher、handoff 接缝 | store / resolver / publisher / handoff profile | 否 | 外部接缝漂移污染 evidence |
| 入口配置 | 控制 api / worker / jobs 入口形态 | command intake、query limit、event source、job action | 否 | 入口绕过 runtime builder |
| 运行参数配置 | 控制 batch、retry、timeout、retention 和 output | batch size、retry policy、timeout、retention duration | 否;job-run-start 读取 | 幂等和报告归档漂移 |
| 策略配置 | 选择已定义安全和横切策略 | projection stale threshold、derived view feature、search feature | 否 | 策略变成绕过边界开关 |
| 敏感引用配置 | 只保存 secret / credential / endpoint 引用 | `CredentialRef`、`ExternalEndpointRef` | 否 | raw secret 泄露 |
| 报告 / 证据配置 | 控制 artifacts 和 reports 输出 | job report ref、run-scoped output root | 否;run 开始读取 | 证据不可复核 |
| 测试 / fixture 配置 | 支撑 local / CI 可复现 | in-memory、fake resolver、fake publisher、fixed clock、sequence id | 否 | fake 被误认成 production |
| 诊断 / 调试配置 | 支撑 local / CI 排障 | safe diagnostic verbosity、redacted failure report | local / test 有限允许 | 敏感数据泄露 |
| P1/P2 扩展配置 | 后续 production 和 remote config 能力 | durable store、real bus、config center、hot reload | 后续专项定义 | 虚构字段和范围膨胀 |

### 3.2 哪些配置允许热更新?

P0 不支持核心配置热更新。所有配置在 startup 或 job-run-start 读取:

- startup: store、boundary、idempotency、projection adapter、external resolver、outbox publisher、handoff target、features、runtime clock / id。
- job-run-start: batch size、parallelism、job timeout、retry backoff、job scope、report output。

如未来启用 hot reload,必须重新打开配置设计,并在 `03` 中明确 runtime builder / validator / rollback 代码契约。

### 3.3 哪些配置只能冷更新或启动读取?

所有改变 runtime graph、adapter kind、endpoint / credential ref、feature wiring、topic map、store behavior、idempotency retention、projection store 或 handoff target 的配置都只能冷更新。变更后必须通过完整 validation 并重启 runtime 或启动新 job run。

### 3.4 哪些安全、审计、事务、一致性或领域规则禁止配置化?

见本 Step §4.2 禁止配置化项表。核心原则:

- 配置可以影响运行承载和 adapter 参数,不能改变 Process truth 是否成立。
- 配置可以选择 fake / in-memory / configured adapter,不能把 fake success 伪装成 production success。
- 配置可以设置 timeout / retry / batch,不能让 publish / handoff failure 回滚 committed truth。
- 配置不能允许保存外部正文或 raw secret。

### 3.5 禁止配置化项如需改变应走什么流程?

如需改变禁止配置化项,必须回到对应上游设计:

- 需求 / 架构边界变化: 回到 `00/01`。
- 对象 / 协议 / 状态 / 函数流变化: 回到 `03` 对应 Step。
- 生产运维策略变化但不改变代码契约: 后续运维 / 配置变更流程。

## 4. 结构化中间产物

### 4.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| 启动配置 | 决定 runtime graph 如何装配 | `runtime.profile`、config path、entry enablement | 否 | 运行中替换依赖图 |
| 运行装配配置 | 绑定 store、resolver、publisher、handoff、clock / id 接缝 | store / resolver / publisher / handoff profile | 否 | 外部接缝漂移污染 evidence |
| 入口配置 | 控制 api / worker / jobs 入口形态 | command body、page limit、event subscription、job action | 否 | 入口绕过 runtime builder |
| 运行参数配置 | 控制 batch、retry、timeout、retention 和 run policy | batch limit、retry policy、timeout、retention | 否;run 开始读取 | 幂等和报告归档漂移 |
| 策略配置 | 选择已定义安全和横切策略 | stale threshold、feature switches | 否 | 策略变成绕过边界开关 |
| 敏感引用配置 | 只保存 secret / credential 引用 | endpoint ref、credential ref | 否 | raw secret 泄露 |
| 报告 / 证据配置 | 控制 artifacts 和 reports 输出 | report ref、run output root | 否;run 开始读取 | 证据不可复核 |
| 测试 / fixture 配置 | 支撑 local / CI 可复现 | fake resolver、fake publisher、fixed clock | 否 | fake 被误认成 production |
| 诊断 / 调试配置 | 支撑 local / CI 排障 | redacted diagnostics | local / test 有限允许 | 敏感数据泄露 |
| P1/P2 扩展配置 | 后续 production 和 remote config 能力 | durable store、real bus、config center | 后续专项定义 | 虚构字段和范围膨胀 |

### 4.2 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| Process truth 归属 | 防止本仓退化为 method-library、work、runtime、workspace、observability 或 archive 副本 | 回到 00 / 01 / 02 重校准 |
| 外部正文排除 | 防止 method definition body、Work truth 正文、decision 正文、artifact body、runtime log、conversation body、archive package body 入仓 | 回到数据归属和对象契约重校准 |
| 唯一编译期依赖纪律 | 防止非 `core-contracts` sibling repo 成为 Cargo dependency | 回到架构依赖裁剪和实施计划门禁重校准 |
| profile adoption / tailoring 显式边界 | 防止 method definition change 自动切换 profile 或移除强制 gate | 回到概要处理流和详细状态矩阵重校准 |
| ProcessInstance 显式变化 | 防止 query、projection、workspace view 或 inbound event 隐式启动、完成、取消或恢复实例 | 回到概要接口和详细处理流重校准 |
| Activity feedback 正式绑定边界 | 防止 runtime feedback event 直接完成 Activity 或保存 runtime 正文 | 回到概要处理流和详细 consumer flow 重校准 |
| waiting gate / governance decision 边界 | 防止 governance event 后台静默恢复 gate,也不能让 Process 自造 decision truth | 回到概要 / 详细 gate flow 重校准 |
| recovery 不分叉 | 防止 checkpoint / recovery 生成第二份 ProcessInstance 或覆盖 checkpoint truth | 回到需求规则、概要状态机和详细恢复契约重审 |
| 状态机红线 | 防止终态普通恢复、Retired 普通恢复 Active 或 illegal transition 伪成功 | 回到状态矩阵重校准 |
| 审计链与追溯要求 | 防止关键变化不可复盘或不可传播 | 回到追溯、审计、outbox 和验收门禁重校准 |
| 派生不反写 | 防止 projection、timeline、summary、reconciliation 或 report 修业务 truth | 回到架构和概要派生边界重校准 |
| 安全 / 可见门禁 | 防止绕过 actor context、work context、capability、visibility 或 governance evidence | 回到安全设计 / identity / governance 协作重校准 |
| outbox / handoff 不决定 truth | 防止下游 publish / handoff ack 成为主真相成立前置,也防止失败回滚 truth | 回到一致性和恢复设计重校准 |
| raw secret / raw token 写入配置或证据 | 防止敏感凭据泄露 | 回到配置 Step 8 和安全门禁重校准 |
| fake success 伪装 production success | 防止 local / CI 假能力污染正式证据 | 回到测试、验收和 adapter 设计重校准 |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 不支持核心配置热更新 | 否 | 配置生效语义,不改变代码契约 | 无 | 无回写 |
| 禁止配置化边界承接 01 / 02 / 03 已有红线 | 否 | 无代码契约变化 | 无 | 无回写 |
| 违反 forbidden boundary 的配置必须 reject | 否 | 承接 03 validation rules | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §4 应写明配置设计允许定义运行装配、入口、批处理、外部接缝、敏感引用和报告证据等控制面,但不得把领域不变量、架构红线、安全下限和 truth ownership 变成可由配置绕过的开关。P0 不支持核心配置热更新;startup 或 job-run-start 是正式生效时机。

## 7. 待确认事项

- 无阻塞 Step 5 的待确认事项。
- Step 5 需在禁止配置化基础上定义来源优先级与冲突处理。

## 8. 进入下一步条件

- 配置类别和禁止配置化边界已明确。
- 热 / 冷更新口径已明确。
- 详细设计影响判定为无回写。
