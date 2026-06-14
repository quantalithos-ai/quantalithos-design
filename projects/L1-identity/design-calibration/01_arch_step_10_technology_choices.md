# Step 10. 关键技术选型

> 对应正式章节: `01-架构设计.md` §11
> 本步状态: 已完成
> 前序依赖: Step 9 已完成
> 当前结论: `L1-identity` 当前只确认架构层技术机制,不确认具体产品栈。正式采用的机制包括 identity truth center、正式承接层隔离、typed reference / source marker、只读投影、事件最终一致传播、后台 projection / reference / reconciliation 承接、append-only trace / career、显式降级 marker、reference-only external content boundary 和 dependency inversion。它们共同保护身份真相、数据 ownership、跨仓依赖裁剪和可追溯消费边界。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确哪些技术机制已经上升为架构层决定,说明它们解决的架构问题、采用理由、代价 / 约束和不采用口径。
- 复杂度判断: 本步机制数量较多,但可用一个主控 Step 文件完成;完整替代路径比较留给 Step 11,本步不拆附录。
- 粒度约束: 本步不写语言、数据库、框架、消息产品、缓存产品、API 路径、event name、topic、DTO、schema、repository、worker、retry、部署参数或代码目录。
- 判定约束: 只有影响系统结构、边界保护方式、一致性方式或关键交互承接方式的机制才进入本步;局部实现便利不进入。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 11。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 2 / Step 7 / Step 8 / Step 9 与非功能输入 | 本步输入表 | 已完成 |
| 回答关键技术选型问题 | SOP 问题回答表 | 已完成 |
| 诊断旧技术栈 / 产品 / 实现混写问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录机制级选型取舍 | 设计取舍表 | 已完成 |
| 输出关键技术机制表 | 结构化中间产物 | 已完成 |
| 输出不采用口径和简化对照表 | 结构化中间产物 | 已完成 |
| 输出机制边界说明和后续承接 | 结构化中间产物 | 已完成 |
| 形成正式 §11 回填草稿 | 回填草稿 | 已完成 |
| 自检并决定是否进入 Step 11 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_02_goals_constraints.md` | 提供平台级身份 truth、生命周期、角色能力摘要、生涯记忆引用、消费追溯和依赖裁剪等架构目标与不可变约束 |
| `01_arch_step_07_dependency_direction.md` | 提供 `L0-core` 唯一编译期候选、`L0-bus` 事件协作、外部来源倒置和禁止源码依赖规则 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 truth / snapshot / reference / forbidden body 分类和强一致 / 最终一致 / report-only 口径 |
| `01_arch_step_09_interactions_communication.md` | 提供同步、异步、后台 / 延后承接的通信方式边界 |
| `00-需求文档.md` §13 | 提供性能、可用性、安全、追溯、幂等、一致性和可观测判断口径 |
| `00_req_step_13_non_functional_requirements.md` | 提供不可继承旧性能数字、正文泄漏 0 容忍、查询不写入和对账不反修相邻 truth 的非功能底线 |
| `架构设计讨论流程_SOP.md` Step 10 | 约束本步只收稳“当前选什么、为何成立、代价是什么” |
| `架构设计书写规范.md` §4.11 | 约束关键技术机制表、技术边界说明和正反例 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前采用哪些关键架构机制? | 采用 identity truth center、正式承接层隔离、typed reference / source marker、truth / snapshot / reference / forbidden body separation、只读投影、事件最终一致传播、后台 projection / reference / reconciliation 承接、append-only trace / career、显式降级 marker、reference-only external content boundary、dependency inversion for external sources。 |
| 每个机制解决什么问题? | 它们分别解决身份真相中心化、外部输入隔离、隐式字符串依赖、数据 ownership 混层、下游直接绑定核心 truth、同步 fan-out、派生状态维护、追溯不可审计、失败口径不清、外部正文泄漏和相邻仓 implementation 入侵的问题。 |
| 为什么不用其他方案? | 不采用 auth-centered identity、work-owned member identity、method-owned profile、full external body replication、query/projection as write source、synchronous fan-out、full event sourcing as P0 mandatory pattern、hardcoded old technology stack,因为这些方案会打穿 identity 的 truth、依赖、数据或交互边界。 |
| 每个选型带来什么代价或新风险? | 代价包括承接层复杂度、typed refs 和 marker schema 需要后续闭口、projection / event / reconciliation 的延迟与失败状态、trace / audit 的可见性裁剪、adapter / resolver contract 复杂度、测试矩阵扩大和后续实现边界必须严格对齐。 |
| 哪些选型是当前阶段必要的,哪些暂不引入? | 必要的是保护 identity truth 和跨仓边界的结构机制;暂不引入具体数据库、消息产品、API 协议、完整事件溯源主体范式、旧性能硬阈值、外部正文同步缓存和产品级展示技术栈。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 10 只列机制短表 | 缺少采用理由、代价 / 约束和为什么属于架构层决定 | 按规范补全“解决的问题、采用理由、代价 / 约束、说明” |
| 把 Rust、PostgreSQL、Redis、Kafka、axum、sqlx 等写成架构锁定 | 新版 `00/01` 未确认这些为硬约束,会制造虚假实施边界 | 本步只锁定机制,不锁产品或框架 |
| 把 outbox、projection、retry、worker 写成实现方案 | 会下沉到详细设计或实施计划,替代架构机制判断 | 本步只保留事件最终一致、只读投影、后台承接等架构机制 |
| 把性能 P95 或容量写成技术选型理由 | 旧指标未通过新版测试 / 验收复核 | 本步只保留“可设基线”和“后续补基线”的机制约束 |
| 把 role catalog / memory ref 对象名当技术机制 | 旧对象名会反向驱动新版架构 | 本步使用 data ownership 和 reference-only 机制表达边界 |
| 只写“解耦、扩展性、可维护性”优点 | 没有代价和约束,不可审查 | 每项机制都写明代价 / 约束 |
| 把备选方案比较提前写完 | Step 10 会膨胀成方案取舍章节 | 本步只给不采用口径,完整替代路径比较留给 Step 11 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 技术表达 | 技术栈 / 产品 / 实现清单 | 架构层技术机制 / 架构手段 |
| 采用理由 | 默认实践或工程熟悉度 | 明确服务于 truth、依赖、数据、交互、非功能边界 |
| 代价 | 只写优点或弱化代价 | 每项机制写承接层、schema、延迟、测试、可见性或实现复杂度 |
| 数据边界 | 外部正文可能通过技术实现进入 | reference-only 和 forbidden body boundary 作为机制锁定 |
| 传播边界 | 同步 fan-out 或 event catalog 先行 | 事件最终一致作为机制,具体 event schema 后移 |
| 维护边界 | 对账 / rebuild 可能成为修复器 | 后台承接限定为 projection / reference / report-only |
| 后续承接 | 容易直接生成代码或配置 | 只为 `02/03/04/05/06/07` 提供机制约束 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 锁定具体语言、数据库、消息、框架产品 | 不采用 | 当前架构层只需要机制;产品栈需结合后续详细设计、配置设计和验收基线确定。 |
| 采用 identity truth center | 采用 | 平台级成员身份必须独立于 auth、work、runtime、UI 和外部正文。 |
| 采用正式承接层隔离外部输入与核心语义 | 采用 | method / work / governance / memory 等外部来源必须先被收束为 ref / summary / marker / basis。 |
| 采用 typed reference / source marker,禁止字符串猜测 | 采用 | 防止隐式依赖和第二真相,为后续 port / contract 提供边界。 |
| 采用只读投影和 query 不写原则 | 采用 | 下游消费需要稳定读取,但不能绑定或修改核心 truth。 |
| 采用事件最终一致传播 accepted facts | 采用 | 避免同步 fan-out 和跨仓事务,同时支撑下游消费。 |
| 采用后台 projection / reference / reconciliation 承接 | 采用 | 派生状态和对账不应阻塞核心 truth,也不得修复相邻仓。 |
| 将 full event sourcing 作为 P0 主体范式 | 不采用 | 当前需求要求追溯和事件协作,未要求所有 truth 以完整事件溯源作为主体。 |
| 复制外部正文或建立外部正文缓存 | 不采用 | 违反数据 ownership、正文排除和安全底线。 |

---

## 7. 结构化中间产物

### 7.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| Identity truth center | 防止平台级成员身份被认证账号、ProjectMember、runtime instance、UI profile 或外部来源替代 | `C-ID-1`~`C-ID-5` 都需要稳定成员身份主语作为中心;没有 truth center,生命周期、角色摘要、生涯和消费都会漂移 | 后续对象、数据、交互和测试必须持续证明只有 identity 拥有成员身份 truth | 这是本仓成立的结构性技术机制,不是对象命名或表设计。 |
| 正式承接层隔离外部输入与核心语义 | 防止 method / work / governance / memory / archive 来源直接打穿身份核心语义 | 外部来源必须先收束为 ref、snapshot、basis、marker 或拒绝结果,核心语义只接受本仓可解释材料 | 增加承接层、adapter / resolver contract 和错误映射复杂度 | 该机制改变外部输入进入核心边界的方式,影响依赖和交互主链。 |
| Typed reference / source marker 机制 | 防止通过字符串拼接、外部 private id 或隐式约定推导身份、scope、source 或 visibility | Step 7 已禁止字符串猜测;typed ref / marker 能让后续 contracts、ports 和测试形成可落码边界 | 需要后续 `03` 明确 ref、marker、source state 和错误口径,并要求跨仓 ref 稳定 | 这是保护跨仓依赖裁剪和数据 ownership 的机制,不是字段实现细节。 |
| Truth / snapshot / reference / forbidden body separation | 防止外部正文、派生状态和 identity truth 混层 | Step 8 已将正式真相、快照 / 投影、引用关系和明确不拥有正文分离;该机制是后续对象和协议的硬边界 | 所有 command、query、event、report 和 diagnostic surface 都必须持续分类,测试矩阵扩大 | 该机制影响数据模型、交互、验收和红线,够格进入架构层。 |
| 只读投影 / query 不写机制 | 防止下游读取、projection、report 或 trace view 成为第二写源 | identity 需要稳定消费面,但查询不得隐式创建成员或修复 truth | 需要 projection stale / degraded / not visible surface,并承担投影延迟与重建成本 | 该机制同时影响数据 ownership 和关键交互,不是局部查询优化。 |
| 事件最终一致传播 accepted facts | 防止把身份变化传播压进同步 fan-out 或跨仓事务 | 下游消费需要获得身份变化,但下游失败不能回滚 accepted identity truth | 需要 delivery state、idempotency、replay、traceability 和延迟可见性说明 | 这是跨边界状态传播的主机制,具体 event schema 后移。 |
| 后台 projection / reference / reconciliation 承接 | 支撑投影重建、来源刷新、引用状态更新和漂移发现,同时防止维护路径写 truth | Step 8 / 9 已将 projection、reference refresh 和 reconciliation 定为最终一致 / report-only | 需要维护入口、失败报告、stale marker 和防越权测试;维护链路可能增加运维复杂度 | 该机制保护核心 truth 不被派生路径反写,属于架构层决定。 |
| Append-only trace / career 机制 | 防止生命周期、生涯记录和来源变化缺少可审计历史,或通过原地改写掩盖事实 | `BR-ID-010` / `BR-ID-014` 要求生涯只能追加,身份变化可追溯 | 需要可见性裁剪、长期留存边界、纠错追加语义和追溯读取降级口径 | 该机制影响身份 accountability 和验收,不是单表追加实现。 |
| 显式降级 marker 机制 | 防止来源不可用、投影 stale、not visible、pending、unavailable、handoff failed 等状态被润色成成功或普通失败 | Step 8 / 9 已区分 rejected、pending、stale、unavailable、degraded、report-only 等口径 | 需要正式 public / internal marker schema、测试断言和用户可理解的状态映射 | 该机制支撑可用性、安全和一致性,不等于错误码细节。 |
| Reference-only external content boundary | 防止 RoleDefinition、ProjectMember、memory body、artifact body、runtime context、observability log body 等正文进入 identity | 需求和 Step 8 均要求 forbidden body 不得进入 truth、projection、event、report 或 diagnostic | 调试和诊断不能依赖正文复制,需要 safe summary、issue ref、handoff ref 或 redacted marker | 这是数据 ownership 和安全底线机制,不是存储裁剪优化。 |
| Dependency inversion for external sources | 防止 method / work / governance / archive / observability implementation 侵入本仓核心 | Step 7 已裁定除 `L0-core` 外不得成为业务源码依赖;外部协作必须经正式边界 | 需要 adapter / resolver / publisher / handoff port 的后续闭口,并增加 fake / test 维护成本 | 该机制决定本仓源码依赖和运行协作边界,属于架构层决定。 |

### 7.2 简化对照表

| 当前采用的机制 | 当前不采用的相邻思路 | 不采用原因 |
|---|---|---|
| Identity truth center | Auth-centered identity architecture | 认证账号、credential、token、session 不等同平台成员 identity truth。 |
| Identity truth center | Work-owned member identity | ProjectMember 归 `L1-work`,不能替代 GlobalMember。 |
| 正式承接层 + dependency inversion | 直接依赖 method / work / governance implementation | 会形成 L1 循环、truth 混层和外部正文泄漏。 |
| Typed reference / source marker | 字符串拼接 external ref / private id 推导 | 会形成隐式依赖和第二真相。 |
| 只读投影 / query 不写 | Query / projection as write source | 会让派生视图成为第二 truth。 |
| 事件最终一致传播 | 同步 fan-out / 跨仓事务 | 会把下游消费失败反向影响 identity accepted truth。 |
| 后台 report-only reconciliation | 自动修复相邻仓 truth | 违反 `BR-ID-015` 和 ownership。 |
| Reference-only external content boundary | Full external body replication | 违反正文排除、安全和跨仓 ownership。 |
| Append-only trace / career | 原地改写 history | 破坏审计和长期身份叙事。 |
| 机制级选型 | Hardcoded old product / performance stack | 新版需求未确认旧产品、P95 或容量为架构约束。 |

### 7.3 技术边界说明

本步中的“技术选型”不是技术栈或产品清单,而是已经影响 `L1-identity` 结构、边界、一致性和交互方式的架构机制。数据库、消息产品、HTTP/RPC 协议、event payload、DTO、repository、worker 和部署参数都不在本步定型,因为它们是既定机制下的实现载体。当前被锁定的是机制边界:identity truth 只能由本仓接受路径形成,外部来源必须经正式承接层,下游只能通过投影 / query / event / report 消费,后台只能重建、刷新或报告,不能修复相邻仓 truth。采用这些机制会增加后续详细设计和测试的复杂度,但换来的是 identity truth 不被外部来源、派生视图、事件协作或技术承载反向定义。

### 7.4 后续文档承接表

| 后续文档 | 需要承接的机制 | 不得反向改写 |
|---|---|---|
| `02-概要设计.md` | 将 truth center、承接层、投影、引用和后台维护转成模块 / 组件抽象 | 不得把技术栈、旧对象名或实现目录反向塞回 Step 10 |
| `03-详细设计.md` | 明确 typed refs、marker schema、accepted path、trace、event、projection、adapter / resolver / handoff ports | 不得让协议或 port 发明新 ownership |
| `04-配置设计.md` | 承接 adapter / resolver / publisher / handoff 的配置边界 | 不得把 adapter mode 写成 profile 或业务 truth |
| `05-测试方案.md` | 为 query 不写、forbidden body、event eventual consistency、reconciliation report-only、marker surface 建测试 | 不得用通用 cargo count 代替业务闭环证据 |
| `06-验收标准.md` | 把机制红线转成 veto / AC / evidence | 不得用 sample、placeholder 或静态映射冒充 pass 证据 |
| `07-实施计划.md` | 按 commit boundary 复核每项机制是否可 1:1 落码 | 不得把后续 schema 或 port 留给实现 agent 自行发明 |

---

## 8. 回填草稿

````md
## 11. 关键技术选型

> 校准来源:
> - `design-calibration/01_arch_step_10_technology_choices.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键技术机制表”“简化对照表”“技术边界说明”和“后续文档承接表”小节,了解本章为何只锁定架构机制,不锁定具体产品栈。

`L1-identity` 的关键技术选型是机制级选型,不是技术栈清单。当前正式采用的机制服务于同一个目标:保护平台级成员身份真相不被认证、work、method、memory、runtime、projection、event 或下游消费反向定义,同时让跨仓协作、可见消费、追溯和对账具备可继续落码的边界。

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| Identity truth center | 防止平台级成员身份被认证账号、ProjectMember、runtime instance、UI profile 或外部来源替代 | `C-ID-1`~`C-ID-5` 都需要稳定成员身份主语作为中心 | 后续对象、数据、交互和测试必须持续证明只有 identity 拥有成员身份 truth | 这是本仓成立的结构性技术机制,不是对象命名或表设计。 |
| 正式承接层隔离外部输入与核心语义 | 防止 method / work / governance / memory / archive 来源直接打穿身份核心语义 | 外部来源必须先收束为 ref、snapshot、basis、marker 或拒绝结果 | 增加承接层、adapter / resolver contract 和错误映射复杂度 | 该机制改变外部输入进入核心边界的方式。 |
| Typed reference / source marker 机制 | 防止通过字符串拼接或外部 private id 推导身份、scope、source 或 visibility | typed ref / marker 能让后续 contracts、ports 和测试形成可落码边界 | 需要后续 `03` 明确 ref、marker、source state 和错误口径 | 这是保护跨仓依赖裁剪和数据 ownership 的机制。 |
| Truth / snapshot / reference / forbidden body separation | 防止外部正文、派生状态和 identity truth 混层 | Step 8 已将正式真相、快照 / 投影、引用关系和明确不拥有正文分离 | 所有 command、query、event、report 和 diagnostic surface 都必须持续分类 | 该机制影响数据模型、交互、验收和红线。 |
| 只读投影 / query 不写机制 | 防止下游读取、projection、report 或 trace view 成为第二写源 | identity 需要稳定消费面,但查询不得隐式创建成员或修复 truth | 需要 projection stale / degraded / not visible surface,并承担投影延迟与重建成本 | 该机制同时影响数据 ownership 和关键交互。 |
| 事件最终一致传播 accepted facts | 防止把身份变化传播压进同步 fan-out 或跨仓事务 | 下游消费需要获得身份变化,但下游失败不能回滚 accepted identity truth | 需要 delivery state、idempotency、replay、traceability 和延迟可见性说明 | 这是跨边界状态传播的主机制,具体 event schema 后移。 |
| 后台 projection / reference / reconciliation 承接 | 支撑投影重建、来源刷新、引用状态更新和漂移发现,同时防止维护路径写 truth | projection、reference refresh 和 reconciliation 属于最终一致 / report-only | 需要维护入口、失败报告、stale marker 和防越权测试 | 该机制保护核心 truth 不被派生路径反写。 |
| Append-only trace / career 机制 | 防止生命周期、生涯记录和来源变化缺少可审计历史,或通过原地改写掩盖事实 | 生涯只能追加,身份变化必须可追溯 | 需要可见性裁剪、长期留存边界、纠错追加语义和追溯读取降级口径 | 该机制影响身份 accountability 和验收。 |
| 显式降级 marker 机制 | 防止来源不可用、projection stale、not visible、pending、unavailable、handoff failed 等状态被润色成成功 | Step 8 / 9 已区分 rejected、pending、stale、unavailable、degraded、report-only 等口径 | 需要正式 marker schema、测试断言和用户可理解的状态映射 | 该机制支撑可用性、安全和一致性。 |
| Reference-only external content boundary | 防止外部正文进入 identity | 需求和 Step 8 均要求 forbidden body 不得进入 truth、projection、event、report 或 diagnostic | 调试和诊断不能依赖正文复制,需要 safe summary、issue ref、handoff ref 或 redacted marker | 这是数据 ownership 和安全底线机制。 |
| Dependency inversion for external sources | 防止 method / work / governance / archive / observability implementation 侵入本仓核心 | 除 `L0-core` 外不得成为业务源码依赖;外部协作必须经正式边界 | 需要 adapter / resolver / publisher / handoff port 的后续闭口,并增加 fake / test 维护成本 | 该机制决定本仓源码依赖和运行协作边界。 |

### 11.1 当前不采用的相邻思路

| 当前采用的机制 | 当前不采用的相邻思路 | 不采用原因 |
|---|---|---|
| Identity truth center | Auth-centered identity architecture | 认证账号、credential、token、session 不等同平台成员 identity truth。 |
| Identity truth center | Work-owned member identity | ProjectMember 归 `L1-work`,不能替代 GlobalMember。 |
| 正式承接层 + dependency inversion | 直接依赖 method / work / governance implementation | 会形成 L1 循环、truth 混层和外部正文泄漏。 |
| Typed reference / source marker | 字符串拼接 external ref / private id 推导 | 会形成隐式依赖和第二真相。 |
| 只读投影 / query 不写 | Query / projection as write source | 会让派生视图成为第二 truth。 |
| 事件最终一致传播 | 同步 fan-out / 跨仓事务 | 会把下游消费失败反向影响 identity accepted truth。 |
| 后台 report-only reconciliation | 自动修复相邻仓 truth | 违反 `BR-ID-015` 和 ownership。 |
| Reference-only external content boundary | Full external body replication | 违反正文排除、安全和跨仓 ownership。 |
| 机制级选型 | Hardcoded old product / performance stack | 新版需求未确认旧产品、P95 或容量为架构约束。 |

本章只锁定机制边界,不选择数据库、消息产品、HTTP/RPC 协议、event payload、DTO、repository、worker 或部署参数。这些实现载体必须在后续 `02/03/04/05/06/07` 中承接本章机制,不得反向改写 identity truth、数据 ownership、通信方式或依赖裁剪。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只锁定正式承接层、typed refs 和 dependency inversion;具体来源协议后移 `03/05/07`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只锁定 basis / marker 和 accepted truth 机制;具体动作枚举后移 `03/06`。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只锁定 reference-only 和 handoff / background 承接机制;具体 surface 后移 `03/05/07`。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只锁定只读投影、显式降级 marker 和 forbidden body boundary;字段级 visibility 后移 Step 12 / `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不设置技术产品或硬阈值;性能与可用性基线后移 `05/06`。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;配置技术机制承接后续随新版 `04` 复核。 |

---

## 10. 进入下一步条件

Step 10 已完成。进入 Step 11 前必须满足:

- 用户已通过“同意”确认本步关键技术选型。
- `01_architecture_calibration_flow.md` 中 Step 10 状态已更新为 `已完成`。
- Step 11 只能承接本步机制去做替代架构路径比较,不得把产品横评、局部实现变体或未来愿望池写成备选方案。
- 若审核发现技术栈清单化、产品锁定、实现细节下沉、只写优点不写代价或机制与 Step 7 / 8 / 9 冲突,必须先回到本 Step 修正,不能带着冲突进入 Step 11。
