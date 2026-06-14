# Step 12. 横切关注点

> 对应正式章节: `01-架构设计.md` §13
> 本步状态: 已完成
> 前序依赖: Step 11 已完成
> 当前结论: `L1-identity` 的横切关注点不是通用质量词清单,而是长期压在身份 truth、外部承接、只读消费、事件传播、追溯、投影和对账主线上的正式约束。当前横切主线包括安全 / 隐私边界、visibility / read safety、审计与可追溯、可观测性、韧性 / 恢复、性能 / 容量判断口径、配置与变更控制,并且必须按八个架构单元逐项停审。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确哪些横切要求会持续作用于本仓主线,分别作用于哪些结构面,要求架构满足什么,以及它们保护什么。
- 复杂度判断: 本步必须按架构单元判断横切适用性。当前采用一个主控 Step 文件承载横切类别、架构单元适用表、停审记录和跨横切审计,不拆附录。
- 粒度约束: 本步不写监控实现、告警规则、日志字段、密钥脚本、压测脚本、配置 schema、阈值数字、部署参数、具体库或运维手册。
- 判断约束: 不能量化的横切项必须给出可审查口径;不能用“高可用、安全、可扩展、可维护”这类口号替代约束。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 13。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 2 / 5 / 6 / 8 / 9 / 10 / 11 与非功能输入 | 本步输入表 | 已完成 |
| 回答横切关注点问题 | SOP 问题回答表 | 已完成 |
| 诊断旧横切材料模板化和实现化问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 判断哪些横切项进入架构层,哪些后移实现 / 运维 | 设计取舍表 | 已完成 |
| 输出横切关注点约束表 | 结构化中间产物 | 已完成 |
| 按架构单元输出横切适用表 | 结构化中间产物 | 已完成 |
| 输出横切影响说明、主线映射、停审和跨横切审计 | 结构化中间产物 | 已完成 |
| 形成正式 §13 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_02_goals_constraints.md` | 提供身份 truth、生命周期、角色能力、生涯记忆、消费追溯、依赖裁剪和不可变约束 |
| `01_arch_step_05_bounded_context_subdomains.md` | 提供八个架构单元,用于逐单元判断横切适用性 |
| `01_arch_step_06_container_deployment.md` | 提供同步入口、异步 / 后台承接、维护 / 对账、正式存储、trace / audit / outbox 等运行承载角色 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 truth / projection / reference / forbidden body、一致性、挂起、降级和 report-only 口径 |
| `01_arch_step_09_interactions_communication.md` | 提供同步、异步、后台 / 延后承接、handoff 和失败降级边界 |
| `01_arch_step_10_technology_choices.md` | 提供 identity truth center、承接层、typed refs、只读投影、事件最终一致、append-only trace、显式降级 marker 等机制 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 提供当前主线和不采用路径,约束横切项不得回头改变方案主线 |
| `00_req_step_13_non_functional_requirements.md` | 提供性能、可用性、安全、审计、幂等、一致性和可观测需求判断口径 |
| `架构设计讨论流程_SOP.md` Step 12 | 约束本步按横切类别与架构单元停审 |
| `架构设计书写规范.md` §4.13 | 约束横切关注点约束表、影响说明和主线映射小表 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 安全边界如何处理? | 外部输入、外部来源、下游消费、维护任务和配置变更都不能直接触达或改写 identity core truth;外部正文、credential、secret、runtime body、observability body 不得进入 truth、projection、event、report 或 diagnostic。 |
| 可观测性需要覆盖哪些正式对象和关键链路? | 必须能看见身份建档 / lifecycle / role capability / career / memory ref accepted 状态,外部来源 pending / stale / unavailable,projection / event delivery / handoff / reconciliation 的状态与失败原因。 |
| 可用性和韧性需要守住什么底线? | 基础身份读取和生命周期读取不应因 method / work / memory / archive / observability 等外围来源不可用而整体失效;可恢复失败必须进入 pending、stale、unavailable、degraded、handoff failed 或 report failed 等显式状态。 |
| 性能预算是否需要给出口径? | 当前不继承旧 P95 / 容量硬数字,但必须给出结构口径:核心读取不得被外部来源同步 fan-out 放大,写入 accepted path 不得等待下游消费,投影 / 对账 / handoff 延后承接。 |
| 配置如何管理,哪些配置不应散落? | 配置只能选择正式允许的 adapter、source、profile、timeout、retry、handoff、visibility / redaction 策略边界,不得通过配置改变 truth ownership、正文排除、query no-write、report-only 或依赖裁剪。 |
| 审计与可追溯性如何被正式保证? | 身份建档、lifecycle、role capability summary、career append、memory ref relation、外部来源接收、投影 / 对账发现和传播 / handoff 结果都必须保留安全可见的 actor、reason、source、basis、marker 或 trace reference。 |
| 哪些横切项与本仓无关,不应机械照抄模板? | 密钥轮换制度、值班手册、具体监控平台、具体告警阈值、数据库分片策略、缓存 key 策略、压测脚本、K8s/云资源规格都不进入本步;它们可能在 `04/05/06/07` 承接,但不是架构横切结论。 |
| 每个架构单元适用哪些安全、可观测性、可用性、性能、配置和审计约束? | §7.3 已按八个架构单元列出安全 / 隐私、审计 / 追溯、可观测性、韧性 / 降级、性能 / 容量和配置边界。 |
| 每个横切项完成后是否通过停审? | §7.5 已给出横切关注点停审记录;当前整体等待用户审核。 |
| 所有横切项完成后,是否存在模板化空话、适用性缺失、审计追溯缺口或配置边界遗漏? | §7.6 审计未发现 unresolved 冲突;字段级 visibility / redaction、性能阈值、诊断 report schema、配置 schema 后移,不在本步闭口。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 12 写成横切类别短表 | 安全、审计、可观测等只像 NFR 清单,缺少作用范围、保护目标和架构约束力 | 按 §4.13 固定表重写为正式横切约束 |
| 把实现细节写进横切架构 | 监控告警、日志字段、配置 schema、压测脚本、密钥脚本会提前锁死后续实现 | 本步只写架构约束和判断口径,实现细节后移 |
| visibility / read safety 未单独横切 | 查询可能只被当作普通读取,忽略 not visible、stale、degraded 和 query no-write | 将 visibility / read safety 作为正式横切项,保护消费面 |
| 安全与数据 ownership 脱节 | 安全只写“权限控制”,没有覆盖 forbidden body、source boundary 和 diagnostic 泄漏 | 将正文排除、secret 排除和边界不可穿透写成架构约束 |
| 可观测性可能包含外部正文 | 为定位问题复制 method / memory / runtime / observability body | 可观测性只允许 safe marker、state、issue ref、handoff ref 和 redacted summary |
| 韧性被写成自动恢复 | 后台任务可能补造外部事实或修复相邻仓 truth | 韧性只允许挂起、重试、重建本仓派生状态或 report-only |
| 性能被写成旧硬阈值 | 未经新版测试 / 验收基线的 P95 和容量数字会形成伪验收 | 本步只给结构性性能口径,硬阈值后移 `05/06` |
| 配置边界缺失 | profile / adapter / retry / timeout 可能改变 truth ownership 或阶段边界 | 配置不得改变主线判断、ownership、query no-write、report-only 和依赖裁剪 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 横切表达 | 横切类别清单 | 作用范围 + 约束要求 + 保护目标 |
| 安全 | 通用权限 / 密钥要求 | 身份 truth、外部正文、source boundary、diagnostic 和配置变更边界 |
| 审计 | 普通日志留存 | accepted truth、关键判断、来源承接、handoff 和 report-only 均需可追溯 |
| 可观测 | 监控平台或日志字段 | 状态成立、传播送达、source stale、projection / handoff / report 失败可见 |
| 韧性 | 自动恢复或重试 | 显式挂起、延后收敛、可重建和 report-only,不得伪成功 |
| 性能 | 旧指标继承 | 不设硬数字,但禁止同步 fan-out 放大和下游消费阻塞 accepted path |
| 配置 | 配置清单或 profile 名 | 配置与变更不得绕开架构主线 |
| 架构单元 | 未逐单元判断 | 八个架构单元逐项适用和停审 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把横切关注点写成通用非功能清单 | 不采用 | 不能说明它们如何持续作用于身份 truth、数据 ownership、交互和维护主线。 |
| 按本仓主线定义横切约束 | 采用 | 可以把安全、追溯、可观测、韧性、性能和配置绑定到真实架构边界。 |
| 在本步给出监控、告警、日志、配置和压测实现方案 | 不采用 | 这些属于 `03/04/05/06/07`,提前写会制造虚假实施边界。 |
| 将 visibility / read safety 并入普通安全 | 不采用 | 读取可见性、not visible、stale、degraded 和 query no-write 横切 query、projection、trace、event report,需要单独约束。 |
| 直接继承旧 P95 / 容量数字 | 不采用 | 新版需求已明确不能继承旧硬指标;当前只能给结构性性能判断口径。 |
| 允许配置改变 adapter 行为但不改变业务边界 | 采用 | 运行 profile / adapter / timeout / retry 可以是配置,但不能改变 truth ownership 或正文排除。 |
| 用后台恢复修复外部 truth | 不采用 | 韧性不能越过 Step 8 / 9 的 ownership 和 report-only 边界。 |

---

## 7. 结构化中间产物

### 7.1 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全 / 隐私边界 | 外部输入边界、外部来源接缝、identity truth、projection、event、trace / audit、diagnostic、配置变更 | 外部能力必须通过正式承接层进入;credential、secret、external body、runtime body、observability body 不得进入本仓正式材料 | 保护平台级成员身份 truth、正文排除、隐私与跨仓 ownership | 该要求横切 Step 3 / 7 / 8 / 9 / 10,不是单个接口鉴权细则。 |
| Visibility / read safety | query、projection、trace view、consumer event、report view、SDK / 产品消费边界 | 读取必须返回可见摘要、not found、not visible、stale、degraded 或 unavailable 等正式状态;query / projection / report 不得写 truth | 保护 query no-write、字段裁剪、不可见信息不泄漏和消费可解释性 | visibility 不只是安全字段,它同时约束读取、投影、追溯和下游消费。 |
| 审计与可追溯 | 身份建档、lifecycle、role capability summary、career append、memory ref relation、source acceptance、event / handoff、reconciliation finding | 关键状态变化和关键判断必须保留安全可见 actor、reason、source、basis、marker、trace ref 或 issue ref | 保护治理复盘、身份 accountability、边界争议审查和实现验收证据 | 这不是普通日志;它必须绑定 accepted truth 和正式承接结果。 |
| 可观测性 | 同步入口、异步 / 后台承接、维护 / 对账、projection、source state、event delivery、handoff、report-only finding | 必须能看见关键状态是否成立、传播是否送达、来源是否 stale / unavailable、projection / handoff / report 失败如何暴露 | 保护主线是否真实成立的可见性,避免 placeholder 或静态证据冒充通过 | 可观测性不等于监控产品配置,而是架构层要求状态和失败可定位。 |
| 韧性 / 恢复能力 | 外部来源不可用、projection stale、event publish failed、handoff failed、reconciliation failed、high-risk pending | 可恢复失败必须显式挂起、延后收敛、重建派生状态或生成 report-only finding;不得伪成功或修复外部 truth | 保护 accepted truth 不被外围失败回滚,也保护 failure 不被润色成成功 | 韧性横切一致性、交互和维护主线,不是重试脚本。 |
| 性能 / 容量判断口径 | identity summary read、lifecycle read / write、source refresh、projection rebuild、event propagation、reconciliation | 当前不继承旧硬阈值;结构上禁止核心读取同步 fan-out 外部正文,禁止 accepted path 等待下游消费,禁止维护任务无限放大核心路径 | 保护核心身份能力在规模增长下仍可设基线、可评审、可验收 | 本步只给结构约束;数值基线后移 `05/06`。 |
| 配置与变更控制 | runtime profile、adapter / resolver、source enablement、handoff、visibility / redaction、timeout / retry、maintenance scope | 配置只能选择正式允许的运行行为;不得改变 truth ownership、正文排除、query no-write、report-only、依赖裁剪或 phase boundary | 保护已收稳架构主线不被配置或运维变更绕开 | 这不是配置项清单,而是对配置变更边界的架构约束。 |
| 幂等 / 重放安全 | 成员创建来源、source delivery、career append、memory ref update、event replay、maintenance job、reconciliation run | 重复处理不得产生重复身份、重复生涯、重复 ref relation 或重复 report fact;冲突必须显式暴露或 no-op | 保护身份 ref 不复用、append-only 语义和事件 / job 最终一致传播 | 幂等不只是实现技巧,它横切事件、后台和维护主线。 |

### 7.2 横切影响说明

这些横切要求必须进入架构层,因为它们会持续作用于 identity truth、外部来源承接、只读消费、事件传播、追溯、投影和对账,不是某个接口或某个运行脚本的局部约束。安全、visibility、审计、可观测、韧性、性能和配置如果留到实现层再补,实现 agent 会在缺少正式口径时自行选择 source marker、failure state、redaction、retry 和 report semantics。本章不展开制度、手册、监控配置或压测脚本,只定义这些要求在架构主线上的作用范围和不可越过的边界。字段级 visibility、诊断 report schema、性能阈值和配置 schema 后移 `03/04/05/06/07`,但不得反向改写本步约束。

### 7.3 按架构单元组织的横切适用表

| 架构单元 | 安全 / 隐私 | 审计 / 追溯 | 可观测性 | 韧性 / 降级 | 性能 / 容量 | 配置边界 |
|---|---|---|---|---|---|---|
| 平台级成员身份真相 | 必须保护身份 ref 不复用、credential 不入仓、外部输入不能直写 core truth | 建档、冲突、墓碑语义和拒绝原因必须可追溯 | 能看见 identity anchor 是否成立、冲突或 rejected | 建档失败不得伪成功;读取可 not found / stale | 核心读取不得同步 fan-out 外部来源 | 配置不得改变身份 ref 生成 / 不复用语义 |
| 成员生命周期边界 | 高风险动作必须有 actor 和 basis boundary;runtime 状态不能替代 lifecycle | lifecycle change、basis ref、拒绝 / 待审原因必须可追溯 | 能看见 pending / rejected / accepted / unavailable basis 状态 | 缺 basis 拒绝或待审;外部 basis 不可用不伪通过 | lifecycle read 不应被 governance 详情读取整体拖垮 | 配置不得绕过治理依据或高风险处置边界 |
| 角色能力摘要 | method body、评估算法、绩效评分不得入仓 | summary adoption、source ref、evidence ref 和 stale reason 必须可追溯 | 能看见 source fresh / stale / unavailable / superseded | method 来源不可用时 stale / pending,不得复制定义正文 | 摘要读取不得同步拉取 method body | 配置不得允许复制 method body 或改变 source ownership |
| 身份生涯与记忆引用 | project truth、memory body、embedding、archive package 不得入仓 | career append、memory ref change、handoff marker 必须可追溯 | 能看见 append result、handoff pending / failed / unavailable | 来源不可确认则 pending 或不追加;handoff failed 可重试或报告 | 生涯读取不得加载 memory body | 配置不得允许历史原地改写或保存 memory body |
| 身份事实消费与追溯 | 消费方不得反写 truth;trace / audit view 不泄漏 forbidden body | identity facts、trace views、consumer-visible changes 必须可追溯 | 能看见 event delivery、trace view stale、not visible / degraded | event / trace handoff failed 不回滚 truth | 消费读取不得绑定核心写模型或同步等待全部下游 | 配置不得隐藏 public marker 或放松 redaction |
| 外部来源引用 | source ref 必须 typed / body-free;外部 private id 不得字符串猜测 | source accepted / rejected / stale / unavailable 必须可追溯 | 能看见每类 source state 和 resolver / adapter failure | source refresh 失败保持 marker,不得猜测外部状态 | refresh 应延后承接,不得阻塞无关核心读取 | 配置不得启用未正式定义的 source 或绕过 adapter boundary |
| 消费投影与对账 | projection / report 不得写 truth;report 不含外部正文 | projection rebuild、stale marker、reconciliation finding 必须可追溯 | 能看见 projection cursor / state、report-only finding、failed report | rebuild failed 保留 stale;reconciliation 只 report-only | rebuild / reconciliation 不得无限放大核心路径 | 配置不得允许对账修复相邻仓 truth |
| 事件协作影子 | event payload / shadow 不得包含 forbidden body 或定义 current truth | publish、consume、replay、duplicate result 必须可追溯 | 能看见 pending publish、published、failed、replayable、duplicate / no-op | publish failed 不回滚 accepted truth;replay 不重复写 truth | 传播最终一致,不得成为 accepted path 同步条件 | 配置不得把 `L0-bus` 变成业务源码依赖或 truth owner |

### 7.4 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 | 必须保护的判断 |
|---|---|---|
| 安全 / 隐私边界 | Step 3 职责边界,Step 8 数据所有权,Step 9 交互 | 外部正文、credential、secret、runtime body 不入仓 |
| Visibility / read safety | Step 8 数据所有权,Step 9 交互,Step 10 只读投影 | query no-write,not visible / stale / degraded 可解释 |
| 审计与可追溯 | Step 8 正式真相与追溯,Step 10 append-only trace / career | accepted truth 和关键判断可追溯 |
| 可观测性 | Step 6 运行承载,Step 9 异步 / 后台 / handoff | 状态、传播、失败和报告可见 |
| 韧性 / 恢复能力 | Step 8 一致性,Step 9 失败降级,Step 11 当前主线 | 失败显式挂起 / 延后收敛,不伪成功 |
| 性能 / 容量判断口径 | Step 9 通信方式,Step 11 不采用同步 fan-out | 核心路径不被外部来源和下游消费放大 |
| 配置与变更控制 | Step 6 运行角色,Step 7 依赖方向,Step 10 机制边界 | 配置不得改变 ownership、依赖裁剪或阶段边界 |
| 幂等 / 重放安全 | Step 9 event / maintenance,Step 10 event 最终一致 | 重放不重复写 truth,冲突显式暴露 |

### 7.5 横切关注点停审记录

| 横切项 | 适用原因清楚 | 判断口径可审查 | 未下沉实现脚本 | 覆盖相关架构单元 | 结论 |
|---|---|---|---|---|---|
| 安全 / 隐私边界 | 是 | 是 | 是 | 是 | 已通过 |
| Visibility / read safety | 是 | 是 | 是 | 是 | 已通过 |
| 审计与可追溯 | 是 | 是 | 是 | 是 | 已通过 |
| 可观测性 | 是 | 是 | 是 | 是 | 已通过 |
| 韧性 / 恢复能力 | 是 | 是 | 是 | 是 | 已通过 |
| 性能 / 容量判断口径 | 是 | 是 | 是 | 是 | 已通过 |
| 配置与变更控制 | 是 | 是 | 是 | 是 | 已通过 |
| 幂等 / 重放安全 | 是 | 是 | 是 | 是 | 已通过 |

### 7.6 跨横切约束审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在模板化空话 | 未发现 | 每项均绑定 identity truth、source、projection、event、handoff 或 report 主线。 |
| 是否存在适用性遗漏 | 未发现 unresolved 缺口 | 八个架构单元均完成横切适用判断。 |
| 是否存在审计追溯缺口 | 未发现 unresolved 缺口 | accepted truth、source acceptance、projection / report、event / handoff 均覆盖。 |
| 是否存在配置边界遗漏 | 未发现 unresolved 缺口 | profile / adapter / retry / timeout / source enablement 不得改变业务边界。 |
| 是否与 Step 8 数据语义冲突 | 未发现 | forbidden body、query no-write、report-only 和 projection 可重建保持一致。 |
| 是否与 Step 9 通信语义冲突 | 未发现 | 同步 accepted truth、异步传播、后台承接和失败降级保持一致。 |
| 是否与 Step 11 方案取舍冲突 | 未发现 | 横切项保护当前主线,未重新打开 projection-first、synchronous fan-out 或 full ES 主线。 |
| 是否误入实现 / 运维手册 | 未发现 | 未写具体监控平台、日志字段、密钥轮换、告警阈值、压测脚本或部署参数。 |
| 后移事项是否保留 | 是 | 字段级 redaction / visibility、diagnostic schema、性能基线、配置 schema 后移,但不得改写本步约束。 |

---

## 8. 回填草稿

````md
## 13. 横切关注点

> 校准来源:
> - `design-calibration/01_arch_step_12_cross_cutting_concerns.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“横切关注点约束表”“按架构单元组织的横切适用表”“主线映射小表”和“跨横切约束审计表”小节,了解横切要求如何作用于 identity truth、外部承接、只读消费、事件传播、追溯、投影和对账主线。

`L1-identity` 的横切关注点不是通用非功能清单,而是长期约束身份 truth、外部来源承接、只读消费、事件传播、追溯、投影和对账主线的架构要求。安全、visibility、审计、可观测、韧性、性能和配置都必须保护同一个核心判断:identity truth 不得被外部来源、派生视图、事件协作、配置变更或下游消费反向定义。

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全 / 隐私边界 | 外部输入边界、外部来源接缝、identity truth、projection、event、trace / audit、diagnostic、配置变更 | 外部能力必须通过正式承接层进入;credential、secret、external body、runtime body、observability body 不得进入本仓正式材料 | 保护平台级成员身份 truth、正文排除、隐私与跨仓 ownership | 该要求横切职责、依赖、数据、交互和技术机制,不是单个接口鉴权细则。 |
| Visibility / read safety | query、projection、trace view、consumer event、report view、SDK / 产品消费边界 | 读取必须返回可见摘要、not found、not visible、stale、degraded 或 unavailable 等正式状态;query / projection / report 不得写 truth | 保护 query no-write、字段裁剪、不可见信息不泄漏和消费可解释性 | visibility 不只是安全字段,它同时约束读取、投影、追溯和下游消费。 |
| 审计与可追溯 | 身份建档、lifecycle、role capability summary、career append、memory ref relation、source acceptance、event / handoff、reconciliation finding | 关键状态变化和关键判断必须保留安全可见 actor、reason、source、basis、marker、trace ref 或 issue ref | 保护治理复盘、身份 accountability、边界争议审查和实现验收证据 | 这不是普通日志;它必须绑定 accepted truth 和正式承接结果。 |
| 可观测性 | 同步入口、异步 / 后台承接、维护 / 对账、projection、source state、event delivery、handoff、report-only finding | 必须能看见关键状态是否成立、传播是否送达、来源是否 stale / unavailable、projection / handoff / report 失败如何暴露 | 保护主线是否真实成立的可见性,避免 placeholder 或静态证据冒充通过 | 可观测性不等于监控产品配置,而是架构层要求状态和失败可定位。 |
| 韧性 / 恢复能力 | 外部来源不可用、projection stale、event publish failed、handoff failed、reconciliation failed、high-risk pending | 可恢复失败必须显式挂起、延后收敛、重建派生状态或生成 report-only finding;不得伪成功或修复外部 truth | 保护 accepted truth 不被外围失败回滚,也保护 failure 不被润色成成功 | 韧性横切一致性、交互和维护主线,不是重试脚本。 |
| 性能 / 容量判断口径 | identity summary read、lifecycle read / write、source refresh、projection rebuild、event propagation、reconciliation | 当前不继承旧硬阈值;结构上禁止核心读取同步 fan-out 外部正文,禁止 accepted path 等待下游消费,禁止维护任务无限放大核心路径 | 保护核心身份能力在规模增长下仍可设基线、可评审、可验收 | 本章只给结构约束;数值基线后移 `05/06`。 |
| 配置与变更控制 | runtime profile、adapter / resolver、source enablement、handoff、visibility / redaction、timeout / retry、maintenance scope | 配置只能选择正式允许的运行行为;不得改变 truth ownership、正文排除、query no-write、report-only、依赖裁剪或 phase boundary | 保护已收稳架构主线不被配置或运维变更绕开 | 这不是配置项清单,而是对配置变更边界的架构约束。 |
| 幂等 / 重放安全 | 成员创建来源、source delivery、career append、memory ref update、event replay、maintenance job、reconciliation run | 重复处理不得产生重复身份、重复生涯、重复 ref relation 或重复 report fact;冲突必须显式暴露或 no-op | 保护身份 ref 不复用、append-only 语义和事件 / job 最终一致传播 | 幂等不只是实现技巧,它横切事件、后台和维护主线。 |

### 13.1 横切主线映射

| 横切关注点 | 主要作用章节 / 主线 | 必须保护的判断 |
|---|---|---|
| 安全 / 隐私边界 | 职责边界、数据所有权、关键交互 | 外部正文、credential、secret、runtime body 不入仓 |
| Visibility / read safety | 数据所有权、关键交互、只读投影 | query no-write,not visible / stale / degraded 可解释 |
| 审计与可追溯 | 正式真相与追溯、append-only trace / career | accepted truth 和关键判断可追溯 |
| 可观测性 | 运行承载、异步 / 后台 / handoff | 状态、传播、失败和报告可见 |
| 韧性 / 恢复能力 | 一致性、失败降级、当前主线 | 失败显式挂起 / 延后收敛,不伪成功 |
| 性能 / 容量判断口径 | 通信方式、不采用同步 fan-out | 核心路径不被外部来源和下游消费放大 |
| 配置与变更控制 | 运行角色、依赖方向、机制边界 | 配置不得改变 ownership、依赖裁剪或阶段边界 |
| 幂等 / 重放安全 | event / maintenance、event 最终一致 | 重放不重复写 truth,冲突显式暴露 |
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只规定 source boundary、安全 / 观测 / 韧性 / 配置约束;具体协议后移 `03/05/07`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只规定 basis、审计、韧性和配置不得绕过;具体动作枚举后移。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只规定 body 不入仓、handoff 可观测 / 可恢复;具体 surface 后移。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步规定 visibility / read safety 横切口径;字段级 redaction 后移 `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步只给结构性性能 / 可用性判断口径;硬阈值后移 `05/06`。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步规定配置与变更控制边界;具体配置 schema 后移新版 `04`。 |

---

## 10. 进入下一步条件

Step 12 已完成。进入 Step 13 前必须满足:

- 用户已通过“同意”确认本步横切关注点。
- `01_architecture_calibration_flow.md` 已将 Step 12 状态更新为 `已完成`。
- Step 13 只能承接当前横切约束去讨论演进路线、阶段边界、设计债务和触发条件,不得回头新增横切项或实现细节。
- 若审核发现本步出现模板化空话、横切项无作用范围、判断口径不可审查、下沉监控 / 配置 / 运维脚本、或与 Step 8 / 9 / 11 冲突,必须先修正本 Step,不能进入 Step 13。
