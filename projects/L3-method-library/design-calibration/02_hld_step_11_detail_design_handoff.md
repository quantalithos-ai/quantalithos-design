# Step 11. 详细设计承接清单

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L3-method-library/02-概要设计.md` §11 详细设计承接清单

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 代码主体框架 | 已收稳业务主要组成部分 + 实现分层两条轴 |
| Step 5 主要组成部分 | 已收稳 7 个业务主要组成部分、职责、代码主体和边界 |
| Step 6 关键对象 | 已收稳 MethodContent、7 类 definition、Lifecycle、Fingerprint、AuditRecord、OutboxEvent、Snapshot、Projection、P1 对象 |
| Step 7 API / 接口骨架 | 已收稳 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 骨架 |
| Step 8 关键处理流 | 已收稳 P0 Command、关键 Query、可选 Gate Consumer、Operations Job 的处理流覆盖规则 |
| Step 9 状态机 | 已收稳 MethodContentLifecycle、OutboxEventStatus、P1 状态边界 |
| Step 10 异常与边界 | 已收稳发布阻断、传播失败、下游恢复、边界拒绝、P1 后置异常口径 |

已确认结论：

```text
Step 11 不新增对象、接口、流程或状态。
本步只把 Step 4~10 已确认的概要设计结论整理为详细设计输入。
```

依赖的前序 Step：

```text
Step 1~10 已确认上游边界、范围、约束、代码主体、主要组成部分、对象、接口、处理流、状态机和异常边界。
```

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳，详细设计不能重新发明？

回答：

| 已收稳代码主体框架 | 详细设计不能重新发明的内容 |
|---|---|
| 业务主要组成部分 + 实现分层两条轴 | 不能重新把 Inbound、Repository、Adapter 当成业务主要组成部分 |
| 7 个业务主要组成部分 | 不能回退到旧 A-H,也不能按 7 类 MethodContent 直接当主要部分 |
| Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters | 可以展开目录和 trait,但不能改写它们与业务部分的关系 |
| P0 / P1 分离 | 不能让 MethodPlugin / MethodConfiguration 阻塞 P0 MethodContent 发布闭环 |

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入？

回答：

| 类别 | 已成为详细设计输入 |
|---|---|
| 关键对象 | MethodContent、7 类 MethodContent subtype、MethodContentLifecycle、DefinitionVersion、Fingerprint、AuditRecord、DefinitionReference、BoundaryViolation、OutboxEvent、DefinitionSnapshot、DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection、MethodPlugin(P1)、MethodConfiguration(P1) |
| API / 接口 | Create / Update / Submit / Publish / Deprecate / Retire / Supersede、Get / List / Version / ExportSnapshot / ResolveViewProfile / Trace / CompareFingerprint、GovernanceGateApprovedConsumer(可选)、Outbound Events、Operations Jobs |
| 处理流 | P0 Command 独立处理流、普通 Query 通用读路径、Snapshot / Trace / Resolve / Compare 独立读路径、Gate Consumer、Seed / Replay / Rebuild / Recalculate Job |
| 状态机 | MethodContentLifecycle、OutboxEventStatus、P1 MethodPlugin / MethodConfiguration 状态边界 |
| 异常口径 | 发布前校验失败不改状态、outbox 失败不回滚真相、下游失败通过 replay / snapshot 恢复、Use truth 反写拒绝、P1 失败不阻塞 P0 |

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容？

回答：

| 方向 | 详细设计继续展开 |
|---|---|
| 字段 | Rust struct / enum / value object 字段全集、类型、rustdoc 中文注释、序列化边界 |
| 协议 | HTTP / RPC / event / job schema、请求响应 JSON 或 proto、错误返回结构 |
| 函数 | service、domain object、policy、repository、port、worker、job 的函数签名、参数类型、返回类型、错误类型 |
| 事务 | UnitOfWork 边界、expected_version 并发控制、audit / outbox 同事务、projection 更新策略 |
| 异常 | ErrorCode 枚举、错误映射、retry 参数、dead_letter 阈值、恢复作业参数 |
| 测试 | domain unit test、application service test、repository contract test、API contract test、outbox / snapshot integration test、boundary test |

### 3.4 如果详细设计发现主语需要变更，应回退到哪里修正？

回答：

| 发现的问题 | 应回退到 |
|---|---|
| 主要组成部分需要增加、删除或重命名 | 回退 Step 5 / 正式 §5 |
| 关键对象主语需要增加、删除或改名 | 回退 Step 6 / 正式 §6 |
| 接口类别、API 名称或输入输出骨架需要变更 | 回退 Step 7 / 正式 §7 |
| 处理流覆盖规则或关键服务主语需要变更 | 回退 Step 8 / 正式 §8 |
| 状态集合、允许迁移或传播状态需要变更 | 回退 Step 9 / 正式 §9 |
| 异常口径改变 MethodContent 状态或 outbox 语义 | 回退 Step 10 / 正式 §10 |

详细设计可以细化,但不能在 03 中暗改概要设计主语。

### 3.5 哪些未闭环内容不能写入承接清单，而应进入风险与待确认事项？

回答：

| 未闭环内容 | 不进入承接清单的原因 | 应进入 |
|---|---|---|
| `TaskDefinition` 是否 P1 直接供 `work` 消费 | 当前仍待 `L1-work` 校准 | Step 12 待确认事项 |
| P1 Plugin dependency DAG / Variability 完整算法 | P1 后置,本轮只保留位置 | Step 12 风险或待确认 |
| ViewProfile 默认 deny 的精确产品语义 | 需要 UI / console 校准 | Step 12 待确认事项 |
| snapshot schema version 兼容策略细节 | 属于详细设计和下游契约继续展开 | Step 11 只写继续展开,不写定论 |
| Operations Job 的执行权限、批量参数和运维门禁 | 属于详细设计 / 运维设计 | Step 11 只写继续展开 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 当前 02 末尾 | 没有独立的详细设计承接清单 | 03 详细设计可能重新发明对象、接口、流程和状态机 |
| §6 / §11 / §12 / §13 | 已有大量可承接内容,但分散在不同章节 | 开发者不知道哪些是稳定输入,哪些只是解释背景 |
| P1 相关段落 | 多处提到 P1 后置,但没有承接清单统一约束 | 详细设计可能误把 P1 写成 P0 前置 |
| 异常与状态口径 | 已经收稳,但没有明确交付给详细设计 | 错误码和事务设计可能偏离概要口径 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 分散在各章节 | 单独形成承接清单 | 防止 03 重新发明主语 |
| 主语稳定性 | 需要从 Step 4~10 自行推断 | 明确哪些不能暗改 | 形成概要到详细的门禁 |
| 详细设计职责 | 只隐含在“留给详细设计”句子里 | 明确字段、协议、函数、事务、异常、测试继续展开 | 让 03 可直接按清单展开 |
| 回退规则 | 没有显式说明 | 发现主语变更必须回退概要设计 | 防止在 03 中绕过概要设计 |
| 未闭环项 | 可能混入承接清单 | 未闭环项进入 Step 12 风险 / 待确认 | 保持承接清单只收稳定结论 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 不写承接清单,让详细设计自行阅读全文 | 文档少一章 | 03 容易重新发明主语,也难判断是否偏离 | 不采用 |
| 承接清单写成开发任务列表 | 方便排期 | 会把概要设计变成实施计划 | 不采用 |
| 承接清单只写已收稳主语与详细设计继续展开方向 | 边界清楚,符合规范 | 需要 Step 12 再收风险和待确认 | 采用 |

---

## 7. 结构化中间产物

### 7.1 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 代码主体框架: 业务主要组成部分 + 实现分层两条轴 | 目录结构、crate / module 组织、service / domain / port / adapter 的具体落位 |
| 7 个业务主要组成部分: 生命周期治理、定义真相、边界保护、同步快照、查询追溯、恢复运维、P1 组装 | 每个部分对应的应用服务、领域对象、策略、端口、持久化和测试分组 |
| 实现分层: Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters | handler、service、policy、repository、worker、job、adapter 的完整函数签名和调用边界 |
| MethodContent 与 7 类 P0 subtype | Rust struct / enum、字段全集、字段类型、rustdoc 中文注释、序列化和校验规则 |
| MethodContentLifecycle / DefinitionVersion / Fingerprint / DefinitionReference | value object 类型、状态枚举、转换函数、比较函数、校验错误 |
| AuditRecord / BoundaryViolation / OutboxEvent / DefinitionSnapshot | record / DTO 字段、构造函数、持久化映射、event / snapshot schema |
| DefinitionReadModel / DefinitionTraceProjection / ViewProfileProjection | projection schema、重建规则、查询索引、缓存失效和 fallback 策略 |
| P1 MethodPlugin / MethodConfiguration 位置与边界 | P1 对象字段、状态、package metadata、configuration activation 的后续详细设计,不得阻塞 P0 |
| Command API 骨架 | HTTP / RPC path、请求响应 schema、错误映射、幂等、expected_version、actor / metadata 传递 |
| Query API 骨架 | 查询参数、分页、过滤、返回视图、projection fallback、默认 deny 结果结构 |
| Inbound Event Consumer 骨架 | event envelope、幂等键、gate projection、ack / retry 语义 |
| Outbound Event 骨架 | topic / event kind、payload schema、snapshot_ref、idempotency、consumer contract |
| Operations Job 骨架 | job input / output、游标、批量参数、审计、权限边界、重试和恢复策略 |
| P0 Command 处理流 | application service 函数、domain function、repository / unit_of_work、audit / outbox 同事务细节 |
| Snapshot / Trace / Resolve / Compare 读路径 | query service、projection / truth fallback、schema_version、trace 聚合、drift 分类 |
| Seed / Replay / Rebuild / Recalculate 运维流 | job 函数、幂等、批处理、失败恢复、审计记录和测试 |
| MethodContentLifecycle 状态机 | enum 定义、允许 / 禁止迁移函数、状态迁移错误、状态迁移测试 |
| OutboxEventStatus 状态机 | retry / dead_letter 策略、relay worker 函数、event publish ack / failure 处理 |
| 异常与边界场景口径 | ErrorCode、HTTP / RPC status 映射、retry 参数、补偿策略、恢复作业、边界测试 |
| Definition / Use 边界红线 | contract test、schema lint、禁止字段清单、跨仓边界测试 |

### 7.2 回退规则

```text
如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。
```

### 7.3 不能写入承接清单的内容

| 内容 | 处理方式 |
|---|---|
| 尚未确认的跨仓消费方关系 | 进入 Step 12 待确认事项 |
| P1 算法和配置复杂度 | 进入 Step 12 风险或待确认事项 |
| 具体开发排期和任务拆分 | 留给实施计划,不进入概要设计 |
| 测试用例全集 | 留给测试方案或详细设计测试章节 |
| 完整运维脚本和部署参数 | 留给实施计划 / 运维设计 |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §11。

````md
## 11. 详细设计承接清单

### 11.1 承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 代码主体框架: 业务主要组成部分 + 实现分层两条轴 | 目录结构、crate / module 组织、service / domain / port / adapter 的具体落位 |
| 7 个业务主要组成部分: 生命周期治理、定义真相、边界保护、同步快照、查询追溯、恢复运维、P1 组装 | 每个部分对应的应用服务、领域对象、策略、端口、持久化和测试分组 |
| MethodContent 与 7 类 P0 subtype | Rust struct / enum、字段全集、字段类型、rustdoc 中文注释、序列化和校验规则 |
| MethodContentLifecycle / DefinitionVersion / Fingerprint / DefinitionReference | value object 类型、状态枚举、转换函数、比较函数、校验错误 |
| AuditRecord / BoundaryViolation / OutboxEvent / DefinitionSnapshot | record / DTO 字段、构造函数、持久化映射、event / snapshot schema |
| DefinitionReadModel / DefinitionTraceProjection / ViewProfileProjection | projection schema、重建规则、查询索引、缓存失效和 fallback 策略 |
| Command / Query / Inbound Event / Outbound Event / Operations Job 骨架 | 协议路径、请求响应 schema、错误映射、幂等、actor / metadata、event envelope、job input / output |
| P0 Command、关键 Query、Gate Consumer、Operations Job 处理流 | service 函数、domain 函数、repository / unit_of_work、事务边界、audit / outbox 同事务细节 |
| MethodContentLifecycle 与 OutboxEventStatus 状态机 | enum 定义、允许 / 禁止迁移函数、状态迁移错误、retry / dead_letter 策略和测试 |
| 异常与边界场景口径 | ErrorCode、HTTP / RPC status 映射、retry 参数、补偿策略、恢复作业和边界测试 |
| P1 MethodPlugin / MethodConfiguration 位置与边界 | P1 对象字段、状态、package metadata、configuration activation 的后续详细设计,不得阻塞 P0 |

### 11.2 回退规则

```text
如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。
```
````

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 11 |
|---|---|---|
| 是否同意 Step 11 只承接 Step 4~10 已确认结论,不新增设计主语 | 建议同意 | 阻塞 |
| 是否同意详细设计必须按承接清单继续展开字段、协议、函数、事务、异常和测试 | 建议同意 | 阻塞 |
| 是否同意详细设计发现主语变更时必须回退概要设计 | 建议同意 | 阻塞 |
| 是否同意未闭环问题进入 Step 12,不混入承接清单 | 建议同意 | 阻塞 |

---

## 10. 进入下一步条件

进入 Step 12 前需要确认：

- [x] 是否同意本步的详细设计承接清单
- [x] 是否同意本步的详细设计继续展开方向
- [x] 是否同意详细设计主语变更必须回退概要设计
- [x] 是否同意 Step 12 再收设计风险和待确认事项
