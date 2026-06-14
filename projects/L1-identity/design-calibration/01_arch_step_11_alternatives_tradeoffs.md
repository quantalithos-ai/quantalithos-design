# Step 11. 备选方案与取舍

> 对应正式章节: `01-架构设计.md` §12
> 本步状态: 已完成
> 前序依赖: Step 10 已完成
> 当前结论: `L1-identity` 当前采用“独立 identity truth center + 正式承接层 + reference-only external boundary + 只读派生消费 + accepted fact 最终一致传播 + 后台 report-only 维护”的主线。该主线比目录型、外部输入直达核心、直接暴露核心 truth、同步 fan-out、projection-first 和 full event-sourcing-first 更能守住身份 truth、跨仓 ownership、依赖裁剪和可追溯消费边界。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 把当前主线方案与相邻替代路径放在同一判断框架下比较,说明当前采用什么、为什么采用、放弃路径有什么收益但为什么仍不采用。
- 复杂度判断: 本步只比较路径级替代关系,不按架构单元拆附录;已经被 Step 2 / 3 / 8 明确排除的边界外事项只在边界说明中列为“不进入正式候选”,不再包装成备选方案。
- 粒度约束: 本步不做产品横评、框架横评、局部实现对比、API / DTO / event / job / repository 方案比较,也不重新论证 Step 10 的单项机制。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 12。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 2 / 7 / 8 / 9 / 10 与规范输入 | 本步输入表 | 已完成 |
| 回答备选方案与取舍问题 | SOP 问题回答表 | 已完成 |
| 诊断旧方案比较粒度问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 确认哪些路径可进入正式比较,哪些已被前文排除 | 设计取舍表 | 已完成 |
| 输出方案路径比较表 | 结构化中间产物 | 已完成 |
| 输出方案边界说明和轻量取舍对照表 | 结构化中间产物 | 已完成 |
| 形成正式 §12 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_02_goals_constraints.md` | 提供平台级成员身份 truth、生命周期、角色能力摘要、生涯记忆引用、消费追溯和依赖裁剪目标 |
| `01_arch_step_03_responsibility_boundary.md` | 提供认证、ProjectMember、method body、memory body、runtime body、治理裁决 truth 和 UI 展示等边界外职责 |
| `01_arch_step_07_dependency_direction.md` | 提供 `L0-core` 唯一编译期依赖候选、外部来源倒置和禁止业务仓源码依赖规则 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 truth / snapshot / projection / reference / forbidden body 与一致性口径 |
| `01_arch_step_09_interactions_communication.md` | 提供同步、异步、后台 / 延后承接的通信方式边界 |
| `01_arch_step_10_technology_choices.md` | 提供当前采用的机制级主线,包括 truth center、正式承接层、typed refs、只读投影、事件最终一致和后台 report-only 维护 |
| `架构设计讨论流程_SOP.md` Step 11 | 约束本步比较架构层有效替代路径,不写琐碎实现变体 |
| `架构设计书写规范.md` §4.12 | 约束方案路径比较表、方案边界说明、轻量取舍表和完成标准 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前架构主线方案是什么? | 当前主线是独立 identity truth center,外部输入先经过正式承接层,外部内容只以 ref / snapshot / safe summary / marker / basis 进入,下游通过只读 projection / query / event / report 消费,accepted fact 通过最终一致事件传播,projection / reference / reconciliation 由后台延后承接且 report-only。 |
| 哪些相邻替代路径值得进入本章比较? | 值得比较的是 directory-style member catalog、无正式承接层的外部输入直达核心、直接暴露核心 truth 供下游消费、同步 fan-out / 跨仓事务传播、projection-first read model、full event-sourcing-first 作为 P0 主体范式。 |
| 每条路径分别在解决什么问题? | 它们分别试图降低成员目录复杂度、减少承接层、降低消费接入成本、获得即时跨仓一致、优化读取体验、提升审计 / replay 能力。 |
| 为什么当前采用主线方案? | 因为它能同时守住平台级成员身份 truth、外部正文排除、跨仓 ownership、依赖裁剪、读写分离、可追溯传播和后台 report-only 维护,且与 Step 7 / 8 / 9 / 10 已收敛边界一致。 |
| 为什么不采用其他路径? | 其他路径虽然在单一维度更简单或更直接,但会削弱身份 truth 独立性、让外部输入或投影成为第二 truth、引入同步耦合、复制外部正文,或把 P0 复杂度推高到当前需求未要求的程度。 |
| 当前选择牺牲了什么,换来了什么? | 牺牲的是承接层、typed refs、projection、event delivery、stale marker 和 report-only 维护的设计复杂度;换来的是身份 truth 不被认证、work、method、memory、projection、event 或下游消费反向定义。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 11 只有短方案表 | 缺少 SOP 问题回答、诊断、正式候选判定、方案边界说明和回填草稿 | 按新版模板重写为完整中间产物 |
| 把 auth-centered、work-owned、method-owned、memory-body 等已排除方向当备选方案 | 会把前文已经裁掉的边界外职责重新包装成可选路径 | 这些方向只在 §7.2 说明“不进入正式候选”,不进入主比较表 |
| 把产品或框架当备选方案 | 会滑入 Kafka / RabbitMQ、HTTP / gRPC、Postgres / MySQL 等产品横评 | 本步只比较架构路径,不比较产品 |
| 把当前还未闭口的实现细节当备选方案 | 会把 event schema、repository、worker、retry、DTO 等后续事项提前裁决 | 本步只讨论边界、依赖、数据、一致性和交互承接 |
| 只写当前方案优点 | 不能说明为什么不采用相邻路径,也不能体现真实取舍 | 每条路径都写解决的问题、收益、代价、当前结论和说明 |
| 把 full event sourcing 写成未来愿望池 | 容易让本章变成脑暴清单 | 本步只判断它是否适合作为 P0 主体范式,不展开未来产品化可能性 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 备选方案范围 | 把边界外职责、产品选择和未来可能性混在一起 | 只纳入与当前主线形成结构性替代的相邻路径 |
| 当前主线表达 | 简写成 identity truth center + ref-only | 明确包含正式承接层、派生消费、事件最终一致和后台 report-only 维护 |
| 不采用理由 | 用“破坏边界”笼统概括 | 分别说明对 truth、ownership、依赖、一致性、交互和复杂度的影响 |
| 已排除事项 | 重新作为候选方案参与比较 | 明确不进入正式候选,避免重复争论已收敛边界 |
| 后续承接 | 容易直接推实现方案 | 输出给 Step 12 / 13 / 15 的取舍来源,不生成实现细节 |

---

## 6. 设计取舍

| 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 采用独立 identity truth center 作为主线核心 | 采用 | 这是 `C-ID-1`~`C-ID-5` 能同时成立的前提。 |
| 将正式承接层作为主线一部分 | 采用 | 外部来源必须先被转译为 ref / snapshot / marker / basis / safe summary,不能直接进入核心语义。 |
| 将下游消费从核心 truth 分离为只读投影 / query / event / report | 采用 | 下游需要稳定消费面,但不能绑定或反写核心 truth。 |
| 将跨仓状态传播压进同步 fan-out 或跨仓事务 | 不采用 | 这会把下游和外部来源可用性反向变成 identity accepted truth 的条件。 |
| 将 projection-first 作为主线 | 不采用 | 读模型会成为事实中心,容易形成第二 truth。 |
| 将 full event-sourcing-first 作为 P0 主体范式 | 不采用为当前主线 | 当前需求要求追溯、event collaboration 和 append-only career,但未要求所有 identity truth 以完整事件溯源作为主体范式。 |
| 将 auth / work / method / memory 正文主导身份 | 不纳入候选 | 这些方向已被职责边界和数据 ownership 排除,不是可比较的相邻替代路径。 |

---

## 7. 结构化中间产物

### 7.1 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 identity truth center + 正式承接层 + reference-only external boundary + 只读派生消费 + accepted fact 最终一致传播 + 后台 report-only 维护 | 同时保护平台级成员身份 truth、外部来源隔离、下游消费、追溯和对账边界 | 身份主语稳定;外部正文不入仓;下游消费可演进;event / projection / report 均不能反写真相;跨仓依赖可裁剪 | 增加承接层、typed refs、marker、projection、event delivery、handoff 和 report-only 维护复杂度 | 采用 | 这是 Step 2 / 7 / 8 / 9 / 10 汇合后的当前主线。 |
| Directory-style member catalog | 降低身份仓复杂度,把成员当作可查询目录管理 | 初期心智简单;读取和展示路径短;对象边界少 | 无法承载 lifecycle、role capability、career / memory refs、消费追溯和对账;容易退化为普通目录 | 不采用 | 该路径与当前主线构成结构性替代,但不能覆盖 `C-ID-2`~`C-ID-5`。 |
| 无正式承接层,外部输入直接进入核心处理 | 减少外部来源到核心语义之间的中间层 | 接入路径更短;早期实现看似更快 | 外部来源会反向统治核心语义;source state、basis、visibility、stale 和 forbidden body 难以隔离 | 不采用 | identity 的外部来源多且 ownership 分散,没有承接层会直接破坏边界。 |
| 直接暴露核心 truth 给下游消费 | 省去 projection / query / report 承接层 | 下游接入快;读到的结构接近写模型;派生延迟少 | 下游会反向绑定核心模型;visibility / privacy / stale / redaction 难以隔离;演进空间小 | 不采用 | 下游消费必须稳定,但不能成为核心 truth 的结构约束来源。 |
| 同步 fan-out / 跨仓事务传播身份变化 | 追求一次写入后所有下游即时一致 | 结果感强;下游短时间内更容易看到一致状态 | 下游失败会阻塞或影响 accepted truth;跨仓耦合强;容易形成伪一致和共享事务 | 不采用 | Step 9 已收敛 accepted truth 与传播最终一致,该路径与主线冲突。 |
| Projection-first read model 作为身份事实中心 | 优先满足读取、搜索、展示和消费便利 | 查询体验好;多来源聚合直观;适合读密集场景 | 投影容易成为第二 truth;query / projection 可能隐式修复或创建事实;ownership 难以审计 | 不采用 | projection 可以存在,但只能只读、可重建、可 stale,不能成为主线中心。 |
| Full event-sourcing-first 作为 P0 主体范式 | 最大化审计、replay、temporal query 和状态重建能力 | 追溯强;状态历史天然完整;对审计场景友好 | P0 建模、存储、replay、迁移、投影一致性和测试复杂度显著上升;当前需求未要求所有 truth 事件溯源化 | 不采用为当前主线 | 当前采用 append-only trace / career 与 accepted fact event collaboration,但不把 full ES 作为 P0 identity truth 主体范式。 |

### 7.2 不进入正式候选的已排除方向

| 方向 | 不进入候选的原因 | 前序来源 |
|---|---|---|
| Auth-centered identity | 认证账号、credential、token、session 已明确不是 GlobalMember truth | Step 2 / Step 3 |
| Work-owned member identity | ProjectMember 和项目事实归 `L1-work`,不能替代平台级成员身份 | Step 3 / Step 8 |
| Method-owned role capability profile | RoleDefinition / CapabilityDefinition 正文归 method-library,identity 只拥有身份侧摘要与来源 | Step 3 / Step 8 |
| Memory / archive-centered member history | memory body、embedding、archive package 不归 identity,identity 只保存 refs / relation / marker | Step 3 / Step 8 |
| Runtime-owned identity availability | runtime availability 不等同全局 lifecycle,不能反向定义成员身份状态 | Step 3 / Step 7 |
| 外部正文复制入仓 | forbidden body 不得进入 truth、projection、event、report 或 diagnostic | Step 8 / Step 10 |

### 7.3 方案边界说明

本章只比较仍然可能作为 `L1-identity` 主线结构的相邻替代路径,不把已被职责边界和数据 ownership 排除的方向重新包装成备选方案。auth、work、method、memory、runtime 等方向都与成员身份有关,但它们已被前序 Step 明确限定为外部来源、消费方、正文承载方或运行承载方,不是当前可选主线。产品、框架、协议、event schema、repository 和 worker 差异属于后续概要 / 详细 / 实施计划,不进入本章。full event-sourcing-first 进入比较,只是因为它确实会改变 identity truth 的主体范式,当前结论是不采用为 P0 主线,而不是否认后续局部追溯或 replay 能力。

### 7.4 轻量取舍对照表

| 当前主线得到什么 | 当前主线失去 / 增加什么 |
|---|---|
| 稳定的平台级成员身份 truth | 承接层和 typed ref / marker 复杂度 |
| 外部正文与外部 truth 不入仓 | 外部来源不可用时需要 pending / stale / unavailable / degraded 表达 |
| 下游消费不绑定核心写模型 | 需要 projection / query / event / report 的派生边界 |
| accepted truth 不受下游传播失败回滚 | 需要 event delivery、replay、trace 和失败状态管理 |
| 对账只 report-only,不跨仓修复 | 需要把漂移处理交回 owning warehouse 的正式能力 |
| P0 复杂度低于 full event sourcing 主体范式 | 需要在后续 `03/05/06/07` 明确哪些追溯能力足够支撑验收 |

### 7.5 后续文档承接表

| 后续文档 / Step | 必须承接 | 不得反向改写 |
|---|---|---|
| Step 12 横切关注点 | 承接当前主线的 security、audit、visibility、observability、resilience、configuration 横切约束 | 不得用横切能力放松 forbidden body、query 不写或 report-only 边界 |
| Step 13 演进路线 | 把 full event-sourcing-first、stronger search、richer projection 等作为触发条件讨论 | 不得把未来可能性写成当前主线 |
| Step 15 ADR 与追溯 | 将当前主线和不采用路径转成 ADR 来源 | 不得新增未经 Step 11 确认的方案判断 |
| `02-概要设计.md` | 将主线拆成模块和组件边界 | 不得把 directory-only、projection-first 或直接暴露核心 truth 反向带入 |
| `03-详细设计.md` | 明确承接层、refs、markers、projection、event、trace、handoff 和 report-only 的正式 schema / port | 不得让实现 agent 自行发明 source / subject / marker 规则 |
| `05/06/07` | 用方案取舍转成测试、验收和 commit boundary 的 veto / gate | 不得用通用测试计数或占位报告证明方案成立 |

---

## 8. 回填草稿

````md
## 12. 备选方案与取舍

> 校准来源:
> - `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“方案路径比较表”“不进入正式候选的已排除方向”“方案边界说明”和“轻量取舍对照表”小节,了解当前主线为什么成立,以及哪些相邻路径被正式放弃。

`L1-identity` 当前采用的主线是:独立 identity truth center + 正式承接层 + reference-only external boundary + 只读派生消费 + accepted fact 最终一致传播 + 后台 report-only 维护。该主线牺牲了部分承接层、marker、projection、event delivery 和对账维护复杂度,换来的是平台级成员身份 truth 不被认证、work、method、memory、runtime、projection、event 或下游消费反向定义。

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 identity truth center + 正式承接层 + reference-only external boundary + 只读派生消费 + accepted fact 最终一致传播 + 后台 report-only 维护 | 同时保护平台级成员身份 truth、外部来源隔离、下游消费、追溯和对账边界 | 身份主语稳定;外部正文不入仓;下游消费可演进;event / projection / report 均不能反写真相;跨仓依赖可裁剪 | 增加承接层、typed refs、marker、projection、event delivery、handoff 和 report-only 维护复杂度 | 采用 | 这是 Step 2 / 7 / 8 / 9 / 10 汇合后的当前主线。 |
| Directory-style member catalog | 降低身份仓复杂度,把成员当作可查询目录管理 | 初期心智简单;读取和展示路径短;对象边界少 | 无法承载 lifecycle、role capability、career / memory refs、消费追溯和对账;容易退化为普通目录 | 不采用 | 该路径不能覆盖 `C-ID-2`~`C-ID-5`。 |
| 无正式承接层,外部输入直接进入核心处理 | 减少外部来源到核心语义之间的中间层 | 接入路径更短;早期实现看似更快 | 外部来源会反向统治核心语义;source state、basis、visibility、stale 和 forbidden body 难以隔离 | 不采用 | identity 的外部来源多且 ownership 分散,没有承接层会直接破坏边界。 |
| 直接暴露核心 truth 给下游消费 | 省去 projection / query / report 承接层 | 下游接入快;读到的结构接近写模型;派生延迟少 | 下游会反向绑定核心模型;visibility / privacy / stale / redaction 难以隔离;演进空间小 | 不采用 | 下游消费必须稳定,但不能成为核心 truth 的结构约束来源。 |
| 同步 fan-out / 跨仓事务传播身份变化 | 追求一次写入后所有下游即时一致 | 结果感强;下游短时间内更容易看到一致状态 | 下游失败会阻塞或影响 accepted truth;跨仓耦合强;容易形成伪一致和共享事务 | 不采用 | accepted truth 与传播必须保持最终一致。 |
| Projection-first read model 作为身份事实中心 | 优先满足读取、搜索、展示和消费便利 | 查询体验好;多来源聚合直观;适合读密集场景 | 投影容易成为第二 truth;query / projection 可能隐式修复或创建事实;ownership 难以审计 | 不采用 | projection 可以存在,但只能只读、可重建、可 stale。 |
| Full event-sourcing-first 作为 P0 主体范式 | 最大化审计、replay、temporal query 和状态重建能力 | 追溯强;状态历史天然完整;对审计场景友好 | P0 建模、存储、replay、迁移、投影一致性和测试复杂度显著上升;当前需求未要求所有 truth 事件溯源化 | 不采用为当前主线 | 当前采用 append-only trace / career 与 accepted fact event collaboration,但不把 full ES 作为 P0 identity truth 主体范式。 |

本章不把 auth-centered identity、work-owned member identity、method-owned role capability profile、memory / archive-centered member history、runtime-owned identity availability 或外部正文复制入仓重新作为正式候选方案。这些方向已在职责边界和数据 ownership 中被排除,它们与 identity 有关系,但不是当前可比较的主线替代路径。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只确认“无正式承接层”不采用;具体来源协议后移 `03/05/07`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只确认 basis / marker / governance 边界属于主线;具体动作枚举后移。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只确认 memory / archive 正文主导身份不进入候选;handoff surface 后移。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只确认直接暴露核心 truth 不采用;字段级裁剪后移 Step 12 / `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不设置性能阈值;只说明不为性能便利采用 projection-first truth。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;后续配置设计必须承接当前主线。 |

---

## 10. 进入下一步条件

Step 11 已完成。进入 Step 12 前必须满足:

- 用户已通过“同意”确认本步备选方案与取舍。
- `01_architecture_calibration_flow.md` 已将 Step 11 状态更新为 `已完成`。
- Step 12 只能承接当前主线去讨论安全、审计、可观测、韧性、配置、隐私和运维等横切约束,不得回头新增方案路径。
- 若审核发现本步把边界外事项重新包装为候选方案、滑入产品横评、局部实现对比、愿望池或单边赞美,必须先修正本 Step,不能进入 Step 12。
