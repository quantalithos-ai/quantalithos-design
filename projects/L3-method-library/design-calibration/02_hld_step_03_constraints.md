# Step 3. 收稳约束条件

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L3-method-library/02-概要设计.md` §3 约束条件

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 上游边界 | 02 只承接 `00-需求文档.md` 和 `01-架构设计.md`,不重写需求、架构选型和 ADR 取舍 |
| Step 1 必须回答 | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态流转和详细设计承接 |
| Step 2 设计目标 | 本轮概要设计停在代码主体骨架层,为 `03-详细设计.md` 提供可展开输入 |
| Step 2 非范围 | 完整 Rust 类型、协议 schema、DDL、错误码、测试、验收、实施计划不在本章展开 |
| 当前 02 §4 | 已有大量约束,但混合了技术约束、资源约束、时间约束、容量假设和一致性策略 |
| 需求业务规则 | BR-LC、BR-PUB、BR-QUAL、BR-REL、BR-SYNC、BR-VIEW、BR-P1 |
| 架构约束 | Definition / Use 分离、P0 / P1 分离、下游同步最终一致、发布链可审计、边界红线可验证 |

已确认结论：

```text
本步只收敛会影响概要设计结构的硬约束。
不把上游架构全文复述为约束。
不把数据库、部署、索引和完整协议实现提前写入本章。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标、非范围和当前设计深度。
```

---

## 3. SOP 问题回答

### 3.1 哪些约束会直接影响本仓对象、接口、处理流或状态机设计？

回答：

会直接影响概要设计结构的约束主要有 12 类。

| 约束 | 影响对象 / 接口 / 处理流 / 状态机的方式 |
|---|---|
| Definition / Use 必须分离 | 对象只能承载定义真相,不能把 QualificationProfile、QualificationBinding、ProcessInstance、WorkItem、Artifact instance 放入本仓模型 |
| P0 / P1 必须分离 | 主要组成部分必须先围绕 7 类 P0 MethodContent 发布同步闭环组织,Plugin / Configuration 只能作为后置边界出现 |
| P0 MethodContent 固定为 7 类 | 关键对象和接口骨架必须覆盖 Qualification / RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef |
| published 核心字段不可原地修改 | 状态机必须支持 supersede / deprecated / retired;处理流必须保留 version、fingerprint 和 audit trace |
| publish 必须经过 approved gate | Publish 处理流必须接收 approved_gate_ref,不能出现绕过治理的直接发布路径 |
| fingerprint 必须由 canonical 内容生成 | 发布、重算、漂移对比和事件输出都必须围绕 fingerprint 设计 |
| 发布成功必须写 audit 与 outbox | 发布主流程必须包含 audit record 和 outbox event,不能只改内容状态 |
| 下游同步最终一致 | 接口骨架必须包含 event、snapshot query、replay / resync 入口 |
| 下游不得反向改写定义真相 | 对外接口只能提供消费、查询、同步和新增定义请求入口,不能提供下游直接写定义正文的入口 |
| ViewProfile 必须服务端解析 | 必须保留 ResolveViewProfile 查询接口和匹配状态,不能把长期视图规则下放给 UI 本地拼装 |
| 关系引用必须指向已发布定义 | 发布校验必须覆盖 Qualification、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 等定义间引用 |
| P1 不得污染 P0 | MethodPlugin、MethodConfiguration、marketplace metadata 不得成为 P0 发布同步闭环的前置条件 |

### 3.2 哪些约束来自需求文档，哪些约束来自架构设计或全局设计？

回答：

| 来源 | 约束来源示例 | 本步吸收方式 |
|---|---|---|
| 需求文档 | G-1 / G-8、P0 最小闭环、NG-6~NG-8、BR-LC、BR-PUB、BR-QUAL、BR-REL、BR-SYNC、BR-VIEW、BR-P1 | 转成对象、接口、处理流和状态机必须遵守的结构性约束 |
| 架构设计 | Definition / Use 分离、P0 / P1 分离、Qualification 三仓边界、发布一致性、outbox + L0-bus、snapshot 兜底、ViewProfile 归属 | 作为概要设计的边界输入,不在 02 中重新论证 |
| 全局设计 / 标准对齐 | SPEM Definition / Use 口径、ISO/IEC/IEEE 24748、ISO/IEC 29110、ISO/IEC 42001 的责任与审计线索 | 只保留影响命名、职责边界、审计和裁剪性的约束 |

### 3.3 哪些边界如果不先写清，后续最容易串到相邻仓或详细设计？

回答：

最容易串仓的边界如下。

| 边界 | 如果不写清会怎样 |
|---|---|
| Qualification vs QualificationProfile vs QualificationBinding | 会把定义、个人画像、工具绑定混成一个对象,导致 method-library、identity、capability-hub 三仓职责污染 |
| TaskDefinition vs WorkItem | 会把方法任务定义误认为项目协作任务,导致 method-library 过早绑定 work |
| ProcessTemplateDef vs ProcessInstance | 会把模板定义误认为运行流程实例,导致 method-library 保存 process runtime 真相 |
| WorkProductDefinition vs Artifact instance | 会把制品定义误认为实际制品正文或证据文件,导致 artifact 数据归属错误 |
| AIPolicyDef vs policy enforce result | 会把 policy source 和治理执行结果混淆,导致 governance runtime 被塞进 method-library |
| ViewProfile vs UI session state | 会把长期视图策略和前端临时状态混淆 |
| MethodPlugin / MethodConfiguration vs P0 MethodContent | 会让 P1 打包和组织级组装能力反向拖慢 P0 定义发布闭环 |

最容易提前写进详细设计的边界如下。

| 边界 | 本步处理方式 |
|---|---|
| 数据库表、索引、事务实现 | 只保留“发布链必须一致”和“event / snapshot 必须可恢复”的约束,不写 DDL |
| 完整协议 schema | 只保留 Command / Query / Event / Job 的接口骨架约束,不写 JSON / proto 细节 |
| 错误码和重试算法 | 只保留必须有拒绝、重放、补偿、默认 deny 等结构位置,不写完整错误表 |
| 容量规划数值 | 不作为概要设计主约束,只作为后续非功能或风险输入 |

### 3.4 哪些约束只是泛化工程原则，不应进入本章？

回答：

以下内容不应进入新版 §3 主约束表。

| 不进入本章的内容 | 原因 |
|---|---|
| “要高可用”“要高性能”“要可扩展”这类泛化原则 | 不能直接指导对象、接口、处理流或状态机设计 |
| 具体数据库索引、分区、锁策略 | 属于详细设计实现契约 |
| 具体缓存、搜索引擎、读模型选型 | 属于详细设计或架构可变实现策略 |
| 具体 QPS / 记录数容量目标 | 当前不是 P0 首批实现承诺,可放非功能、风险或详细设计容量假设 |
| 完整部署拓扑和资源配额 | 属于部署 / 实施计划 |
| P1 plugin dependency DAG 算法 | P1 后置,不应影响 P0 约束主表 |

### 3.5 每条约束是否能指导后续章节的设计判断？

回答：

可以。保留下来的约束必须能至少影响下列一类后续章节。

| 约束类型 | 后续影响 |
|---|---|
| 定义归属约束 | 影响 §4 代码主体框架、§5 主要组成部分、§6 关键对象 |
| 生命周期与发布约束 | 影响 §6 关键对象、§8 处理流、§9 状态机 |
| 同步与一致性约束 | 影响 §7 接口骨架、§8 处理流、§10 边界场景 |
| 查询与视图约束 | 影响 §7 Query、§8 ResolveViewProfile 流程、§9 ViewProfile active 状态 |
| P0 / P1 边界约束 | 影响 §2 范围、§5 组成部分、§11 详细设计承接 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.1 技术约束 | 多数约束有效,但有些是架构结论复述 | 新版 §3 应转成“对概要设计的影响”,而不是重新论证架构 |
| §4.2 资源约束 | 混入资源增长、object storage、查询读取、同步补偿等不同层次 | 其中一部分是结构约束,一部分应下沉到详细设计或风险 |
| §4.3 时间约束 | P0 / P1 节奏表达有效,但章节名偏项目计划 | 新版 §3 应表达“阶段边界约束”,不是实施计划 |
| §4.4 合规与审计约束 | publish gate、actor_ref、audit trace 有效 | 应并入发布一致性和审计链约束,避免单独拉大章节 |
| §4.5 一致性与降级约束 | 方向正确,但部分内容已经接近详细设计策略 | 新版 §3 只保留强一致 / 最终一致 / 可重放 / snapshot 兜底这些结构判断 |
| §4.6 容量规划假设 | 对未来架构有参考,但不是当前概要设计主约束 | 建议不放入新版 §3 主表,转入风险、非功能承接或详细设计容量假设 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 章节位置 | 旧 §4 约束条件 | 新 §3 约束条件 | 按新版概要设计主链,约束应在目标范围后、代码主体框架前收稳 |
| 表达方式 | 技术 / 资源 / 时间 / 合规 / 一致性 / 容量六类分散展开 | 收敛成结构性约束表 | 概要设计约束应服务后续对象、接口、处理流和状态机判断 |
| 架构结论 | 部分重复说明 Definition / Use、P0 / P1、outbox 等架构判断 | 只继承结论并说明设计影响 | 02 不应重新论证 01 的架构取舍 |
| 容量规划 | 独立列出 2000w、QPS 等假设 | 不放入主约束表,转为后续非功能或风险输入 | 容量数值不能直接决定当前概要对象与接口骨架 |
| P1 表达 | P1 Plugin / Configuration 出现在多处约束 | 只表达“P1 不得污染 P0” | 避免 P1 看起来是 P0 首批完成门槛 |
| 输出格式 | 多张不同列名的表 | 统一为“约束 / 说明”主表,另保留来源与影响追踪 | 便于正式文档阅读和后续 Step 引用 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保留旧 §4 六类约束结构 | 信息完整,迁移成本低 | 层次混杂,容易把概要设计写成架构复述或详细设计预案 | 不采用 |
| 只保留最短约束表 | 正式文档简洁 | 难以追踪来源,后续 Step 容易误解为什么有这些约束 | 不单独采用 |
| 正式文档用“约束 / 说明”主表,中间产物保留来源与影响追踪 | 正式文档清爽,中间产物可审计 | 需要维护两层表达 | 采用 |

---

## 7. 结构化中间产物

### 7.1 约束条件主表

| 约束 | 说明 |
|---|---|
| Definition / Use 必须分离 | 本仓只拥有方法定义真相,不得保存下游使用真相或运行实例真相 |
| P0 / P1 必须分离 | P0 先完成 7 类 MethodContent 的发布、版本、fingerprint、audit、outbox、snapshot 和下游同步闭环;P1 不得成为 P0 前置条件 |
| P0 MethodContent 固定为 7 类 | 概要设计对象、接口和流程必须覆盖 Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef |
| Qualification 三仓边界必须稳定 | method-library 拥有 Qualification 定义;identity 拥有 QualificationProfile;capability-hub 拥有 QualificationBinding |
| 下游 Use truth 不得写入本仓 | ProcessInstance、WorkItem、Artifact instance、policy enforce result、UI session state 等只能由对应下游仓拥有 |
| published 核心字段不可原地修改 | 已发布内容变更必须通过新版本、supersede、version、fingerprint 和 audit trace 表达 |
| publish 必须经过 approved gate | Publish 处理流必须携带 approved_gate_ref,并记录 actor_ref、时间、原因和 gate 结果 |
| fingerprint 必须由 canonical 内容生成 | fingerprint 是 drift、幂等、snapshot 和事件消费的核心语义标识,不得由下游猜测或自然语言描述替代 |
| 发布成功必须写 audit 与 outbox | content state、version、fingerprint、audit record、outbox event 必须在发布主链中一起成立 |
| 跨仓同步采用最终一致 | 下游通过 event、snapshot query、replay / resync 恢复索引,不得要求跨仓强事务 |
| Snapshot 是下游恢复兜底入口 | 下游错过事件、重建索引或校验 fingerprint 时,必须能拉取 Definition Snapshot |
| ViewProfile 必须服务端解析 | UI / console 通过 ResolveViewProfile 获取 active ViewProfile 和 fingerprint,生产环境未匹配默认 deny |
| 定义间引用必须可校验 | RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 等引用关系在发布前必须指向允许引用的定义版本 |
| P1 能力不得污染 P0 主链 | MethodPlugin、MethodConfiguration、marketplace metadata、variability、dependency DAG 只保留位置和边界,不展开为 P0 核心对象和主流程 |

### 7.2 来源与影响追踪表

| 约束 | 主要来源 | 影响章节 |
|---|---|---|
| Definition / Use 必须分离 | 需求 NG-6~NG-8、架构 §2、SPEM Definition / Use 口径 | §4 / §5 / §6 / §7 |
| P0 / P1 必须分离 | 需求 §3.1.1、架构 §2.0 / §2.2 | §2 / §4 / §5 / §11 |
| P0 MethodContent 固定为 7 类 | 需求 G-1 / G-8、P0 覆盖清单 | §4 / §5 / §6 / §7 |
| Qualification 三仓边界必须稳定 | 需求 BR-QUAL、架构 §2.1 | §5 / §6 / §7 / §10 |
| 下游 Use truth 不得写入本仓 | 需求 NG-6~NG-8、BR-SYNC-007、架构边界红线 | §5 / §7 / §10 |
| published 核心字段不可原地修改 | BR-LC-004、INV-ML-3、架构 §2.1 | §6 / §8 / §9 |
| publish 必须经过 approved gate | BR-LC-003、BR-PUB-003、架构 §2.1 | §7 / §8 / §9 |
| fingerprint 必须由 canonical 内容生成 | G-7、BR-PUB-001~002、架构 §2.1 | §6 / §7 / §8 |
| 发布成功必须写 audit 与 outbox | BR-PUB-001~003、NFR 一致性、架构 §2.3 | §7 / §8 / §10 |
| 跨仓同步采用最终一致 | BR-SYNC、架构 §2.3 | §7 / §8 / §10 |
| Snapshot 是下游恢复兜底入口 | BR-PUB-004、BR-SYNC-008、架构 §2.3 | §7 / §8 / §10 |
| ViewProfile 必须服务端解析 | G-4、F-007、BR-VIEW | §6 / §7 / §8 / §9 |
| 定义间引用必须可校验 | F-003、BR-REL | §6 / §8 / §10 |
| P1 能力不得污染 P0 主链 | 需求 P1 后置、BR-P1、架构 §2.2 | §5 / §6 / §11 |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §3。

```md
## 3. 约束条件

本章只收录会直接影响本仓代码主体、主要组成部分、对象、接口、处理流或状态机设计的硬约束。

| 约束 | 说明 |
|---|---|
| Definition / Use 必须分离 | 本仓只拥有方法定义真相,不得保存下游使用真相或运行实例真相 |
| P0 / P1 必须分离 | P0 先完成 7 类 MethodContent 的发布、版本、fingerprint、audit、outbox、snapshot 和下游同步闭环;P1 不得成为 P0 前置条件 |
| P0 MethodContent 固定为 7 类 | 概要设计对象、接口和流程必须覆盖 Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef |
| Qualification 三仓边界必须稳定 | method-library 拥有 Qualification 定义;identity 拥有 QualificationProfile;capability-hub 拥有 QualificationBinding |
| 下游 Use truth 不得写入本仓 | ProcessInstance、WorkItem、Artifact instance、policy enforce result、UI session state 等只能由对应下游仓拥有 |
| published 核心字段不可原地修改 | 已发布内容变更必须通过新版本、supersede、version、fingerprint 和 audit trace 表达 |
| publish 必须经过 approved gate | Publish 处理流必须携带 approved_gate_ref,并记录 actor_ref、时间、原因和 gate 结果 |
| fingerprint 必须由 canonical 内容生成 | fingerprint 是 drift、幂等、snapshot 和事件消费的核心语义标识,不得由下游猜测或自然语言描述替代 |
| 发布成功必须写 audit 与 outbox | content state、version、fingerprint、audit record、outbox event 必须在发布主链中一起成立 |
| 跨仓同步采用最终一致 | 下游通过 event、snapshot query、replay / resync 恢复索引,不得要求跨仓强事务 |
| Snapshot 是下游恢复兜底入口 | 下游错过事件、重建索引或校验 fingerprint 时,必须能拉取 Definition Snapshot |
| ViewProfile 必须服务端解析 | UI / console 通过 ResolveViewProfile 获取 active ViewProfile 和 fingerprint,生产环境未匹配默认 deny |
| 定义间引用必须可校验 | RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 等引用关系在发布前必须指向允许引用的定义版本 |
| P1 能力不得污染 P0 主链 | MethodPlugin、MethodConfiguration、marketplace metadata、variability、dependency DAG 只保留位置和边界,不展开为 P0 核心对象和主流程 |
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 3 |
|---|---|---|
| 是否同意新版 §3 只保留结构性硬约束 | 同意后删除旧 §4 的技术 / 资源 / 时间 / 合规 / 一致性 / 容量多分组结构 | 阻塞 |
| 容量规划假设是否移出 §3 主约束表 | 建议移入后续风险、非功能承接或详细设计容量假设 | 不阻塞 |
| P1 Plugin / Configuration 是否只表达“不污染 P0” | 建议只保留边界,不在 §3 展开算法和完整状态 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 4 前需要确认：

- [x] 是否同意新版 §3 只保留会影响概要设计结构的硬约束
- [x] 是否同意旧 §4.2 / §4.6 中资源和容量类内容不进入新版 §3 主表
- [x] 是否同意 P1 约束只表达边界,不展开 Plugin / Configuration 的实现细节
- [x] 是否同意以上约束足以作为 Step 4 代码主体框架映射的输入
