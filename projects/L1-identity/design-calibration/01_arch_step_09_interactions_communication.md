# Step 9. 关键交互与通信方式

> 对应正式章节: `01-架构设计.md` §10
> 本步状态: 已完成
> 前序依赖: Step 8 已完成
> 当前结论: `L1-identity` 的同步交互只用于即时判断 identity truth、可见读取或受控管理意图是否成立;异步交互用于 accepted identity fact 传播和外部来源结果送达;后台 / 延后承接用于 projection、reference refresh、reconciliation、handoff 和 report-only 维护。任何交互方式都不得直接穿透外部 truth、复制 forbidden body、把异步传播当同步成功条件,或让后台维护反写相邻仓 truth。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确本仓关键交互分别采用同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接中的哪一类,并说明边界理由和失败降级口径。
- 复杂度判断: 本步必须按架构单元逐个定义同步、异步、后台 / 补偿和失败降级;当前采用一个主控 Step 文件承载全部交互判断,不拆附录。
- 粒度约束: 本步只讨论通信方式类别和边界理由,不写 API path、接口名、command / query / event / job 名、topic、DTO、schema、具体协议、中间件、重试机制、时序图或内部处理步骤。
- 来源约束: 本步只承接 Step 4 上下文边界、Step 6 运行承载角色、Step 8 数据 ownership 和需求层能力接口;不反向读取旧 `02/03/04` 或实现仓。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 10。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 4 / Step 6 / Step 8 与需求接口输入 | 本步输入表 | 已完成 |
| 回答关键交互与通信方式问题 | SOP 问题回答表 | 已完成 |
| 诊断旧交互材料中协议化 / 时序化问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录同步 / 异步 / 后台承接取舍 | 设计取舍表 | 已完成 |
| 输出关键交互场景表 | 结构化中间产物 | 已完成 |
| 输出通信方式判断表 | 结构化中间产物 | 已完成 |
| 按架构单元输出交互方式表 | 结构化中间产物 | 已完成 |
| 输出失败降级、边界红线、停审和跨边界审计 | 结构化中间产物 | 已完成 |
| 形成正式 §10 回填草稿 | 回填草稿 | 已完成 |
| 自检并决定是否进入 Step 10 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_04_system_context.md` | 提供 `L0-core`、`L0-bus`、method-library、work、governance、memory / archive、identity consumers 等正式上下文边界 |
| `01_arch_step_06_container_deployment.md` | 提供同步入口、异步 / 后台承接、维护 / 对账承接、正式存储和 trace / audit / outbox 承载等运行角色 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 truth、snapshot / projection、reference、forbidden body 和强一致 / 最终一致 / report-only 口径 |
| `00-需求文档.md` §12 | 提供 `IF-ID-*` 能力接口和 `DEP-ID-*` 外部依赖边界 |
| `00_req_step_12_interfaces_dependencies.md` | 提供需求层能力接口、依赖边界和禁止提前定义 API / DTO 的约束 |
| `架构设计讨论流程_SOP.md` Step 9 | 约束本步先识别关键交互场景,再判断通信方式,并按架构单元停审 |
| `架构设计书写规范.md` §4.10 | 约束关键交互场景表、通信方式判断表、图示和完成标准 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些交互适合同步能力边界? | 成员身份建档、成员摘要读取、生命周期管理、角色能力摘要受控维护、memory ref 受控管理、身份变化追溯读取和受控维护触发适合同步请求 / 响应,因为它们需要在当前边界即时判断 identity truth、可见读取或受控意图是否成立。 |
| 哪些交互适合异步事件? | accepted identity fact 对下游传播、method / work / governance / memory / archive 来源变化送达、身份变化结果对观测 / 归档 / consumer group 的事实传播适合异步事件 / 回调,因为这些交互传播的是已经成立或外部已送达的事实,不应变成同步 fan-out。 |
| 哪些交互适合后台任务或补偿路径? | projection rebuild、reference refresh、source stale check、identity 自身投影 / 引用对账、memory / archive handoff follow-up、trace / report handoff 和 report-only finding 生成适合后台任务 / 延后承接,因为它们不应阻塞核心同步 truth,也不能伪装成当前同步成功。 |
| 哪些交互必须经过总线或正式边界,不能直接穿透? | 跨仓 fact propagation、外部来源变化输入、高风险治理依据送达、work participation 来源、method source summary、memory / archive handoff、observability / archive handoff 和下游身份事实消费都必须经过正式事件协作、运行期 adapter、query / projection boundary 或 handoff boundary,不得直接写 identity core truth。 |
| 关键依赖失效时,本仓如何降级或挂起? | 同步写入失败时拒绝、待审或返回暂不可处理;同步读取失败时返回不可见、缺失、stale 或 degraded;异步传播失败时保留待发布 / 待消费 / handoff failed / replayable 状态;后台失败时保留 stale、pending、unavailable 或 failed report,不得补造外部事实。 |
| 哪些通信口径若不先写清,后续最容易误入协议细节? | 成员建档容易被写成 API 路径;身份变化传播容易被写成事件目录;method / work / governance 来源容易被写成具体 callback schema;handoff 容易被写成任务流程;projection rebuild 容易被写成重试实现。本步只定通信类别和边界原因。 |
| 每个架构单元对外同步调用、异步事件、后台任务和补偿路径分别是什么? | §7.4 已按八个架构单元列出同步交互、异步交互、后台 / 延后承接和降级口径。 |
| 每个交互完成后是否通过停审? | §7.7 已给出逐组停审记录;当前整体等待用户审核。 |
| 所有交互完成后是否存在同步 / 异步选择冲突、直接穿透边界、协议细节下沉或失败降级缺口? | §7.8 审计未发现 unresolved 冲突;method 来源协议、handoff surface、visibility 字段级返回和具体 event/job schema 后移,不在本步闭口。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 9 写成通信结论短表 | 缺少场景识别、边界理由、取舍和按架构单元停审 | 按新版 SOP 重写,先识别关键交互场景,再判断通信方式 |
| 把接口能力写成 API / command / query 清单 | 过早锁定协议和 DTO,后续详细设计容易出现 1:1 blocker | 本步只写“交互场景”和“通信方式类型” |
| 把身份变化传播写成同步 fan-out | 下游消费失败会反向影响 identity accepted truth | 明确 accepted truth 与传播最终一致,传播失败只影响 delivery / replay 状态 |
| 把外部来源读取写成同步成功条件 | method / work / governance / memory 不可用时会阻断无关核心读取 | 区分 accepted 写入前必须有的依据、可 stale 的来源摘要和后台 refresh |
| 把对账维护写成自动修复流程 | 后台任务可能修改相邻仓 truth | 明确 reconciliation report-only,只能处理本仓 projection / reference state |
| 把 handoff 写成内部流程细节 | 归档 / 观测交接可能提前下沉 job schema | 本步只定义 handoff 是异步 / 延后承接边界,具体 record / job 后移 |
| 把读取失败统一写成系统失败 | visibility、not found、stale、degraded、source unavailable 混为一类 | 本步按 Step 8 失败口径区分读取 / 写入 / 异步 / 后台降级 |
| 把 L0-bus 当作业务 package dependency | 事件协作被误写成源码依赖 | 本步只将 bus 作为事件协作边界,不定义业务编译期依赖 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 交互表达 | 使用接口、事件、处理步骤或运行单元清单 | 使用正式交互场景和通信方式类别 |
| 同步边界 | 管理、查询、外部同步、下游传播都可能同步化 | 只有需要即时判断 truth / visibility / acceptance 的场景同步 |
| 异步边界 | 事件被当作附属实现 | accepted fact propagation 和外部结果送达是正式异步边界 |
| 后台承接 | 维护任务可能伪装成同步成功 | projection / reference / reconciliation / handoff follow-up 明确延后承接 |
| 失败处理 | 统一写重试或失败 | 同步拒绝 / 待审,异步待发布 / replayable,后台 stale / pending / report failed |
| 数据边界 | payload 可能携带外部正文 | forbidden body 不得通过任何通信方式进入本仓 |
| 后续承接 | 直接进入协议和 event catalog | 具体 API / event / job / DTO 后移 `03` 和实施计划 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 全部管理和来源交互都做同步闭环 | 不采用 | 会把外部来源可用性变成 identity truth 成立条件,并扩大跨仓耦合。 |
| 核心写入和可见读取走同步请求 / 响应 | 采用 | 这些场景需要即时判断 accepted truth、visibility、拒绝或待审状态。 |
| 所有状态变化都通过异步事件完成 | 不采用 | 成员建档、生命周期等核心 truth 接受不能伪装成延后成功。 |
| accepted identity fact 和外部来源结果走异步事件 / 回调 | 采用 | 这些场景本质是事实传播或结果送达,适合最终一致。 |
| projection / reference / reconciliation 走后台延后承接 | 采用 | 它们可重建、可标脏或 report-only,不应阻塞核心 truth。 |
| 让后台维护直接修复相邻仓 truth | 不采用 | 违反数据 ownership 和 `BR-ID-015` / `VETO-ID-005`。 |
| 在本步定 API、event、topic、job、schema、retry | 不采用 | 本步只判断通信方式,实现 surface 留给 `03/07`。 |
| 为了排查问题在交互中传外部正文 | 不采用 | forbidden body 不得进入 truth、projection、event、report 或诊断正文。 |

---

## 7. 结构化中间产物

### 7.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 成员身份建档 / 身份锚定 | 管理入口 / 受控系统入口 ↔ identity truth boundary | 即时判断平台级成员身份是否可建立,并形成稳定 identity anchor | 这是核心 truth 建立,不能由异步事件伪成功。 |
| 成员身份摘要读取 | consumer / SDK / 产品入口 ↔ query / visibility boundary | 即时读取可见身份摘要、缺失、不可见或 stale 状态 | 读取不得隐式创建成员,也不得绕过 visibility。 |
| 生命周期管理 | 管理入口 / 受控系统入口 ↔ lifecycle truth boundary | 即时判断 lifecycle change 是否可接受、拒绝或待审 | 高风险处置需要 basis;不能由后台静默执行。 |
| 高风险处置依据送达 | governance / authorization boundary ↔ lifecycle basis boundary | 将外部依据正式送达或作为 accepted 前置引用 | governance truth 不归 identity,只能以 basis ref / summary 进入。 |
| 角色能力摘要维护 | 管理入口 / method source boundary ↔ role capability summary boundary | 维护 identity-side 摘要采用状态或接收来源变化 | 摘要归 identity,定义正文归 method-library。 |
| method 来源变化送达 | method-library boundary ↔ external source reference boundary | 通知来源版本、摘要或失效状态变化 | 这是外部来源结果送达,不应变成 method-library 源码依赖。 |
| 生涯记录追加 | work participation source ↔ career boundary | 将可追溯项目参与来源转成身份侧追加历史 | identity 追加身份侧历史,不定义 project / ProjectMember truth。 |
| work 来源变化送达 | work boundary ↔ external source reference boundary | 送达项目参与、ProjectMember ref 或来源失效状态 | work truth 不进入 identity,只进入 ref / safe summary。 |
| memory ref 管理 | 管理入口 / memory-archive boundary ↔ memory ref relation boundary | 维护成员与 memory / archive refs 的身份侧关系 | ref relation 可由 identity 拥有,正文不得进入。 |
| memory / archive 状态送达或 handoff | memory / archive boundary ↔ handoff / reference boundary | 送达迁移、冷存、handoff 或不可用状态 | 这是外部承载结果送达,不复制正文或 package。 |
| 身份事实消费 | identity query / projection / event boundary ↔ identity consumers group | 向 work、process、conversation、governance、workspace、runtime、SDK / 产品层提供身份事实 | 消费方只能读 / 订阅 / 展示,不能反写 identity truth。 |
| 身份变化传播 | identity truth boundary ↔ L0-bus / event collaboration boundary | 传播 accepted identity fact 或 safe summary | 传播失败不回滚 accepted truth,也不产生第二 truth。 |
| 身份变化追溯读取 | audit / governance / observability consumer ↔ trace / audit view boundary | 即时读取安全可见追溯摘要 | 追溯 view 不暴露 forbidden body。 |
| trace / audit / archive handoff | identity trace / audit material ↔ observability / archive boundary | 将安全追溯或归档材料交接给外部承载方 | handoff 是边界交接,不是直接共享存储。 |
| projection rebuild | maintenance boundary ↔ projection boundary | 重建或标脏消费投影、查询视图和 trace view | projection 可重建,不得写 truth。 |
| reference refresh | maintenance boundary ↔ external source reference boundary | 刷新来源状态、stale marker、pending / unavailable 状态 | refresh 不读取外部正文,也不修复外部 truth。 |
| reconciliation report | maintenance / operations boundary ↔ report-only boundary | 发现 identity 自身投影、引用或消费边界漂移 | report-only,不得修复相邻仓 truth。 |

### 7.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 成员身份建档 / 身份锚定 | 同步请求 / 响应类交互 | 不宜异步伪成功 | 无法建立稳定身份时明确失败,不产生成员 | 核心 identity anchor 必须即时判断是否成立。 |
| 成员身份摘要读取 | 同步请求 / 响应类交互 | 不宜后台补写或异步创建 | 返回可见结果、not found、not visible、stale 或 degraded | 读取是消费边界,不能产生 truth。 |
| 生命周期管理 | 同步请求 / 响应类交互 | 不宜后台静默执行 | 非法变化、缺原因、缺 actor 或缺 basis 时拒绝 / 待审 | lifecycle 是本仓核心 truth。 |
| 高风险处置依据送达 | 异步事件 / 回调类交互,或同步前置引用校验 | 不宜复制 governance truth | 未送达或不匹配时 high-risk change 不 accepted | identity 只消费 basis ref / summary。 |
| 角色能力摘要维护 | 同步请求 / 响应类交互,并可由异步来源送达触发 | 不宜直接同步读取 method body 作为主路径 | 来源不可用时 stale / pending,不能保存定义正文 | identity 拥有成员视角摘要采用状态。 |
| method 来源变化送达 | 异步事件 / 回调类交互 | 不宜写成源码依赖或同步强耦合 | 保留待解析、stale 或 unavailable state | method-library 拥有定义 truth。 |
| 生涯记录追加 | 异步事件 / 回调类交互,或受控同步写入 | 不宜直接写入项目 truth | 来源不可确认则不追加或 pending reconciliation | career 是身份侧追加历史。 |
| work 来源变化送达 | 异步事件 / 回调类交互 | 不宜共享 work storage | 保留待解析 / stale / rejected source | work 拥有 ProjectMember truth。 |
| memory ref 管理 | 同步请求 / 响应类交互,并可后台刷新状态 | 不宜同步拉取 memory body | ref 不可用时 pending / unavailable | identity 只拥有 ref relation。 |
| memory / archive 状态送达或 handoff | 异步事件 / 回调类交互,或后台 / 延后承接类交互 | 不宜把 package body 带入 identity | 保留 handoff pending / failed / unavailable | 外部承载方拥有正文和 package。 |
| 身份事实消费 | 同步请求 / 响应类交互或异步事件 / 回调类交互 | 不宜共享数据库或反向写 truth | 同步返回 stale / degraded;异步保留待消费 / replayable | 消费方式取决于读即时性和传播需求。 |
| 身份变化传播 | 异步事件 / 回调类交互 | 不宜同步 fan-out 作为 accepted 条件 | 保留待发布、待消费或可重放状态 | accepted truth 与传播最终一致。 |
| 身份变化追溯读取 | 同步请求 / 响应类交互 | 不宜后台补造追溯 | 返回可见追溯、not visible、stale 或 degraded | 审计读取需要即时答复边界状态。 |
| trace / audit / archive handoff | 异步事件 / 回调类交互或后台 / 延后承接类交互 | 不宜共享 observability / archive storage | 保留 handoff pending / failed / retryable marker | handoff 是交接边界,不是存储 ownership 合并。 |
| projection rebuild | 后台任务 / 延后承接类交互 | 不宜在 query path 同步修复 truth | 保留旧 view、stale marker 或 rebuild failed | projection 是可重建派生结构。 |
| reference refresh | 后台任务 / 延后承接类交互 | 不宜同步阻塞核心读取 | 保留 pending / stale / unavailable marker | 外部来源状态可最终一致。 |
| reconciliation report | 后台任务 / 延后承接类交互 | 不宜自动修复相邻仓 truth | 生成 report-only finding 或 failed report | 对账只发现漂移,不修复外部 truth。 |

### 7.3 失败降级结论

| 失败类别 | 架构口径 | 不允许的处理 |
|---|---|---|
| 同步写入无法成立 | 返回 rejected、pending review、temporarily unavailable 或 equivalent failure surface | 先返回 success,后台再补齐核心 truth |
| 同步读取无法完整返回 | 返回 not found、not visible、stale、degraded 或 unavailable | 隐式创建成员或读取 forbidden body 补视图 |
| 外部依据未送达 | 阻塞对应 high-risk accepted change 或标 pending | 伪造 basis、默认通过、复制 governance truth |
| 异步传播失败 | 保留 pending publish、pending consume、handoff failed 或 replayable 状态 | 回滚 accepted truth 或让 event shadow 成为 truth |
| 后台 refresh 失败 | 保留 stale / pending / unavailable marker | 同步阻断无关核心读取或猜测外部状态 |
| reconciliation 发现漂移 | 生成 report-only finding | 自动修改 work / method-library / governance / archive truth |
| forbidden body 出现在交互材料中 | 阻断进入正式材料并标记边界违规 | 以诊断便利为由保留正文 |

### 7.4 按架构单元组织的交互方式表

| 架构单元 | 同步交互 | 异步交互 | 后台 / 延后承接 | 降级口径 |
|---|---|---|---|---|
| 平台级成员身份真相 | 成员建档、身份摘要读取、identity anchor 检查 | accepted member fact propagation | duplicate source check、projection rebuild | 不创建、不复用、不伪成功;读取可 not found / stale |
| 成员生命周期边界 | lifecycle command / read、高风险依据前置判断 | lifecycle changed propagation、basis delivered | pending high-risk review check、source stale check | 缺 basis 拒绝 / 待审;runtime 状态不可替代 lifecycle |
| 角色能力摘要 | role / capability summary update / read | method source changed、summary invalidated | source refresh、summary reconciliation | method 来源 unavailable 时 stale / pending,不得复制定义正文 |
| 身份生涯与记忆引用 | career read、memory ref update / read | work participation changed、memory/archive state delivered | reference refresh、handoff follow-up、duplicate check | 来源不可确认则不追加 / pending;正文不可用不补存 |
| 身份事实消费与追溯 | identity summary query、trace / audit read | identity fact propagation、trace handoff delivered | trace view rebuild、archive handoff follow-up | not visible / stale / degraded;handoff failed 可重试或报告 |
| 外部来源引用 | 受控来源接受判断 | method / work / governance / archive source update delivered | source refresh、stale / unavailable detection | 不可信来源 rejected;不可用标 stale / unavailable |
| 消费投影与对账 | maintenance trigger read / control surface if formally exposed later | report delivered / projection invalidated | projection rebuild、reconciliation report | old view / stale marker / failed report;不得写 truth |
| 事件协作影子 | 无核心同步写入;只可读取传播状态 if formally exposed later | accepted fact published / consumed | replay / delivery status reconciliation | pending publish / replayable / failed delivery,不得定义 truth |

### 7.5 简化交互示意图

```text
+------------------------------------------------------------------+
|                    L1-identity interaction boundary              |
|                                                                  |
|  +----------------------+       [async delivery]                  |
|  | external sources     |----------------------------------+      |
|  | method/work/gov/etc  |                                  |      |
|  +----------+-----------+                                  v      |
|             | [sync basis/ref when required]       +--------------+|
|             v                                      | async/back-  ||
|  +----------------------+    [accepted facts]      | ground       ||
|  | sync entry / query   |------------------------->| handoff      ||
|  | management/consumer  |                          +------+-------+|
|  +----------+-----------+                                 |        |
|             | [sync decision/read]                         |        |
|             v                                              |        |
|  +----------------------+                                  |        |
|  | identity truth       |                                  |        |
|  | boundary             |                                  |        |
|  +----------+-----------+                                  |        |
|             | [async fact propagation]                     |        |
|             v                                              v        |
|  +----------------------+                       +----------------+ |
|  | downstream consumers |                       | projections /  | |
|  | event/query boundary |                       | reports        | |
|  +----------------------+                       +----------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

图示说明:

- 同步交互用于在当前边界内判断 identity truth、可见读取、受控管理意图或 required basis 是否成立。
- 异步交互用于 accepted fact propagation、外部来源结果送达和 handoff delivery。
- 后台 / 延后承接用于 projection、reference refresh、reconciliation 和 handoff follow-up。
- 该图不表达 API、event、topic、时序步骤、运行进程或具体中间件。

### 7.6 交互边界红线

| 红线 | 违反后果 | 来源 |
|---|---|---|
| 同步 accepted truth 不得伪装成后台后补 | 核心状态可能显示成功但实际未成立 | Step 8 强一致口径 |
| 异步传播不得作为 accepted truth 的成立条件 | 下游消费失败会反向影响 identity truth | Step 8 最终一致口径 |
| 外部来源交互不得携带 forbidden body | 外部正文进入 truth、event、projection 或 report | `BR-ID-007`, `BR-ID-012`, `VETO-ID-003` |
| 高风险 lifecycle 不得绕过 governance / authorization basis | 身份处置失去责任边界 | `BR-ID-005`, `VETO-ID-004` |
| query / projection / report 不得写 truth | 读模型或维护路径成为第二写源 | `BR-ID-002`, `BR-ID-015` |
| 后台 reconciliation 不得修复相邻仓 truth | 维护任务越过 ownership | `BR-ID-015`, `VETO-ID-005` |
| `L0-bus` 不得成为业务源码依赖 | 事件协作变成编译期耦合 | Step 7 依赖裁剪 |

### 7.7 交互方式停审记录

| 交互组 | 通信方式匹配数据所有权 | 经过正式边界 | 未下沉协议 schema | 失败降级口径清楚 | 结论 |
|---|---|---|---|---|---|
| 同步 command / query | 是 | 是 | 是 | 是 | 已通过 |
| external source delivery | 是 | 是 | 是 | 是 | 已通过 |
| event propagation / handoff | 是 | 是 | 是 | 是 | 已通过 |
| maintenance / projection / reconciliation | 是 | 是 | 是 | 是 | 已通过 |
| downstream consumption | 是 | 是 | 是 | 是 | 已通过 |

### 7.8 跨交互边界审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | 未发现 | 核心 accepted truth 同步收口;传播和来源送达异步;projection / reconciliation 后台承接。 |
| 是否把异步传播当成同步成功条件 | 未允许 | 下游传播失败只影响 delivery 状态,不回滚 accepted truth。 |
| 是否直接穿透外部 truth | 未允许 | method / work / governance / memory / archive 均通过正式边界和 ref / summary / marker 进入。 |
| 是否下沉接口、事件、job 或 schema | 未出现 | 本步不写 API path、event name、topic、DTO、job record 或 retry 实现。 |
| 是否存在失败降级缺口 | 未发现 | rejected、pending、not visible、stale、unavailable、handoff failed、report-only 已区分。 |
| 是否存在 forbidden body 泄漏路径 | 未允许 | 通信材料不得携带外部正文、credential、secret、runtime body 或 observability log body。 |
| 是否存在后台反写相邻仓 truth | 未允许 | reconciliation report-only,维护只处理本仓 projection / reference state。 |
| 是否存在后续详细设计承接风险 | 有后移项但非本步阻塞 | method source 协议、handoff surface、visibility 字段和 event / job schema 后移 `03/05/07`。 |

---

## 8. 回填草稿

````md
## 10. 关键交互与通信方式

> 校准来源:
> - `design-calibration/01_arch_step_09_interactions_communication.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键交互场景表”“通信方式判断表”“按架构单元组织的交互方式表”和“跨交互边界审计表”小节,了解本章通信方式如何从上下文边界、运行承载和数据 ownership 收束。

`L1-identity` 的关键交互按边界语义分为三类:同步请求 / 响应用于即时判断 identity truth、可见读取或受控管理意图是否成立;异步事件 / 回调用于 accepted identity fact 传播和外部来源结果送达;后台任务 / 延后承接用于 projection、reference refresh、reconciliation、handoff follow-up 和 report-only 维护。本章只判断通信方式类别和边界理由,不定义 API、event、topic、DTO、job schema 或具体中间件。

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 成员身份建档 / 身份锚定 | 管理入口 / 受控系统入口 ↔ identity truth boundary | 即时判断平台级成员身份是否可建立,并形成稳定 identity anchor | 这是核心 truth 建立,不能由异步事件伪成功。 |
| 成员身份摘要读取 | consumer / SDK / 产品入口 ↔ query / visibility boundary | 即时读取可见身份摘要、缺失、不可见或 stale 状态 | 读取不得隐式创建成员,也不得绕过 visibility。 |
| 生命周期管理 | 管理入口 / 受控系统入口 ↔ lifecycle truth boundary | 即时判断 lifecycle change 是否可接受、拒绝或待审 | 高风险处置需要 basis;不能由后台静默执行。 |
| 角色能力摘要维护 | 管理入口 / method source boundary ↔ role capability summary boundary | 维护 identity-side 摘要采用状态或接收来源变化 | 摘要归 identity,定义正文归 method-library。 |
| 生涯记录追加 | work participation source ↔ career boundary | 将可追溯项目参与来源转成身份侧追加历史 | identity 追加身份侧历史,不定义 project / ProjectMember truth。 |
| memory ref 管理 | 管理入口 / memory-archive boundary ↔ memory ref relation boundary | 维护成员与 memory / archive refs 的身份侧关系 | ref relation 可由 identity 拥有,正文不得进入。 |
| 身份事实消费 | identity query / projection / event boundary ↔ identity consumers group | 向下游提供身份事实、摘要、追溯或变化传播 | 消费方只能读 / 订阅 / 展示,不能反写 identity truth。 |
| projection rebuild / reference refresh / reconciliation report | maintenance boundary ↔ projection / reference / report-only boundary | 重建派生视图、刷新引用状态或报告漂移 | projection 可重建;对账 report-only,不得修复相邻仓 truth。 |

### 10.1 通信方式判断

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 成员身份建档 / 身份锚定 | 同步请求 / 响应类交互 | 不宜异步伪成功 | 无法建立稳定身份时明确失败,不产生成员 | 核心 identity anchor 必须即时判断是否成立。 |
| 成员身份摘要读取 | 同步请求 / 响应类交互 | 不宜后台补写或异步创建 | 返回可见结果、not found、not visible、stale 或 degraded | 读取是消费边界,不能产生 truth。 |
| 生命周期管理 | 同步请求 / 响应类交互 | 不宜后台静默执行 | 非法变化、缺原因、缺 actor 或缺 basis 时拒绝 / 待审 | lifecycle 是本仓核心 truth。 |
| 外部来源结果送达 | 异步事件 / 回调类交互 | 不宜写成源码依赖或同步强耦合 | 保留待解析、stale、pending 或 unavailable state | 外部来源拥有自身 truth,identity 只消费 ref / summary / marker。 |
| 身份变化传播 | 异步事件 / 回调类交互 | 不宜同步 fan-out 作为 accepted 条件 | 保留待发布、待消费或可重放状态 | accepted truth 与传播最终一致。 |
| trace / audit / archive handoff | 异步事件 / 回调类交互或后台 / 延后承接类交互 | 不宜共享 observability / archive storage | 保留 handoff pending / failed / retryable marker | handoff 是交接边界,不是存储 ownership 合并。 |
| projection rebuild / reference refresh | 后台任务 / 延后承接类交互 | 不宜在 query path 同步修复 truth | 保留旧 view、stale marker、pending 或 unavailable | projection 和 source status 可最终一致。 |
| reconciliation report | 后台任务 / 延后承接类交互 | 不宜自动修复相邻仓 truth | 生成 report-only finding 或 failed report | 对账只发现漂移,不修复外部 truth。 |

### 10.2 交互示意图

```text
+------------------------------------------------------------------+
|                    L1-identity interaction boundary              |
|                                                                  |
|  +----------------------+       [async delivery]                  |
|  | external sources     |----------------------------------+      |
|  | method/work/gov/etc  |                                  |      |
|  +----------+-----------+                                  v      |
|             | [sync basis/ref when required]       +--------------+|
|             v                                      | async/back-  ||
|  +----------------------+    [accepted facts]      | ground       ||
|  | sync entry / query   |------------------------->| handoff      ||
|  | management/consumer  |                          +------+-------+|
|  +----------+-----------+                                 |        |
|             | [sync decision/read]                         |        |
|             v                                              |        |
|  +----------------------+                                  |        |
|  | identity truth       |                                  |        |
|  | boundary             |                                  |        |
|  +----------+-----------+                                  |        |
|             | [async fact propagation]                     |        |
|             v                                              v        |
|  +----------------------+                       +----------------+ |
|  | downstream consumers |                       | projections /  | |
|  | event/query boundary |                       | reports        | |
|  +----------------------+                       +----------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

同步交互用于在当前边界内判断 identity truth、可见读取、受控管理意图或 required basis 是否成立。异步交互用于 accepted fact propagation、外部来源结果送达和 handoff delivery。后台 / 延后承接用于 projection、reference refresh、reconciliation 和 handoff follow-up。该图不表达 API、event、topic、时序步骤、运行进程或具体中间件。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只确认 method source 既可由异步送达也可由正式来源边界承接;具体协议、schema 和 freshness rule 后移 `03/05/07`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只确认 high-risk lifecycle 需要同步 accepted 判断和 basis;具体动作枚举后移 `03/06`。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只确认 memory / archive 状态送达和 handoff 属于异步 / 延后承接;具体 surface 后移 `03/05/07`。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只确认 query / trace read 需要返回 visible / not visible / stale / degraded 等边界结果;字段级返回后移 Step 12 / `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不设置通信性能阈值;后移 `05/06`。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;配置入口和运行绑定后移新版 `04` 复核。 |

---

## 10. 进入下一步条件

Step 9 已完成。进入 Step 10 前必须满足:

- 用户已通过“同意”确认本步关键交互与通信方式。
- `01_architecture_calibration_flow.md` 中 Step 9 状态已更新为 `已完成`。
- Step 10 只能承接本步通信方式去讨论架构层技术机制,不得把具体协议 / 中间件 / DTO 反向塞回本步。
- 若审核发现同步 / 异步选择冲突、直接穿透边界、协议细节下沉、失败降级缺口或后台反写相邻仓 truth,必须先回到本 Step 修正,不能带着冲突进入 Step 10。
