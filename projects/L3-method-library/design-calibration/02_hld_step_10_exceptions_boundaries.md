# Step 10. 异常与边界场景轮廓

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L3-method-library/02-概要设计.md` §10 异常与边界场景轮廓

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 8 关键处理流 | PublishMethodContent、Downstream Sync、ResolveViewProfile、Operations / Recovery、P1 Plugin / Configuration 路径 |
| Step 9 状态机 | MethodContentLifecycle、OutboxEventStatus、P1 MethodPlugin / MethodConfiguration 状态边界 |
| 需求业务规则 | publish gate、Definition / Use 分离、fingerprint、snapshot、outbox、P0 / P1 分离 |
| 当前 02 异常线索 | 异常分散在处理流、接口边界、数据所有权和失败降级段落中 |

已确认结论：

```text
Step 10 只点名概要设计层必须提前收稳的关键异常与边界场景。
本步不展开完整错误码、重试参数、补偿脚本、恢复作业实现或数据库事务细节。
```

依赖的前序 Step：

```text
Step 1~9 已确认上游边界、范围、约束、代码主体、主要组成部分、对象、接口、处理流和状态机。
```

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名？

回答：

| 异常路径 | 必须提前点名的原因 |
|---|---|
| `approved_gate_ref` 缺失或无效 | 会决定 PublishMethodContent 是否能进入 `published`,不能留到详细设计才发现 |
| `expected_version` 冲突 | 会影响所有写 Command 的并发语义和调用方重读策略 |
| 非法生命周期迁移 | 会影响 MethodContentLifecycle 的有效性 |
| published 核心字段直接修改 | 会破坏 version / fingerprint / supersede 规则 |
| 引用不存在、引用未发布或跨 kind 引用错误 | 会影响发布前关系校验和 snapshot 可用性 |
| 下游 Use truth 反向写入定义仓 | 会破坏 Definition / Use 边界 |
| L0-bus 不可用或 outbox relay 失败 | 会影响定义传播,但不能回滚 MethodContent 真相 |
| snapshot 版本不兼容或 snapshot 不可生成 | 会影响下游兜底同步和重建索引 |
| ResolveViewProfile 无匹配结果 | 会影响 UI / console 的视图解析默认行为 |
| fingerprint drift 或 canonical 结果不一致 | 会影响审计、对账和下游同步可信度 |
| P1 Plugin / Configuration 失败 | 必须明确不阻塞 P0 MethodContent 发布主链 |

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系？

回答：

| 边界场景 | 会影响的协作关系 |
|---|---|
| governance gate 不可用 | Command 入口仍可处理 draft / query,但 PublishMethodContent 必须阻断 |
| outbox 进入 failed / dead_letter | MethodContentLifecycle 不回退,事件与快照同步部分需要暴露 replay / recovery 入口 |
| 下游错过事件 | 下游不能反向改写定义,只能通过 event replay 或 ExportDefinitionSnapshot 恢复 |
| projection / cache 不可用 | 查询解析部分应可降级到 truth 读取或受控失败,projection 不得成为真相 |
| object storage 关键 blob 缺失 | 若 blob 是发布必需内容,应阻断 publish;非关键 blob 只能形成 degraded 读取 |
| marketplace 请求写 listing / transaction 到本仓 | 入口和边界保护部分必须拒绝,只允许 P1 package metadata 输出 |

### 3.3 哪些失败不能留到详细设计才发现？

回答：

| 失败 | 不能后置的原因 |
|---|---|
| publish 缺 gate 仍进入 published | 会直接违反发布治理和审计约束 |
| outbox 失败导致发布事务回滚或状态回退 | 会混淆业务状态与传播状态 |
| 下游 Use truth 写入 MethodContent | 会破坏仓边界,影响 identity / capability-hub / process / artifact / governance |
| published 内容原地修改 | 会破坏版本链、fingerprint 和审计追溯 |
| snapshot 与 event 语义不一致 | 会导致下游同步到错误定义 |
| P1 failure 阻塞 P0 publish | 会破坏 P0 / P1 分离原则 |

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够？

回答：

概要设计层需要讲清：

```text
异常场景是什么
由哪个主要组成部分处理
会阻断、降级、排队、重放还是拒绝
是否影响 MethodContentLifecycle
是否影响 outbox、snapshot、projection 或下游感知
哪些细节留给详细设计
```

概要设计层不需要写：

```text
完整错误码
HTTP / RPC 状态码映射
具体 retry 次数和退避参数
补偿脚本
SQL 事务语句
完整监控阈值
恢复作业实现代码
```

### 3.5 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节，不应在本步展开？

回答：

| 内容 | 留给详细设计的原因 |
|---|---|
| `ErrorCode` 枚举全集 | 属于接口协议细化 |
| retry 次数、退避、dead letter 阈值 | 属于 outbox relay 实现策略 |
| `ReplayOutboxEvents` 参数与游标格式 | 属于 Operations Job 详细契约 |
| snapshot schema 完整字段 | 属于 DTO / schema 设计 |
| 并发冲突错误返回结构 | 属于 Command API 详细协议 |
| recovery SQL / migration / admin script | 属于运维与实现细节 |
| monitoring 指标阈值 | 属于运维设计或 SLO 文档 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.5 一致性与降级约束 | 已提 L0-bus、snapshot、outbox,但没有汇总成异常处理口径 | 开发者需要跨章节拼装异常边界 |
| §11 接口骨架 | 接口约束提到 gate、expected_version、outbox,但异常影响不集中 | 详细设计容易重复定义错误路径 |
| §12 关键处理流 | Publish / Sync / Query 的失败点已有线索,但和状态机关系未统一 | 容易把传播失败误解为 MethodContent 发布失败 |
| §13 数据所有权 | Definition / Use 边界红线存在,但边界违例未作为关键异常列出 | 下游反写风险不够醒目 |
| P1 相关段落 | 写了 P1 不阻塞 P0,但未作为异常原则固定 | 后续实现可能把 Plugin / Configuration 失败挂到 P0 主链 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 异常表达位置 | 分散在约束、接口、处理流和数据边界 | 单独形成异常与边界场景表 | 让详细设计能直接承接关键失败口径 |
| publish 异常 | 只在处理流失败点中出现 | 明确 gate、version、lifecycle、reference、boundary 都会阻断 publish | publish 是 P0 主链,异常必须前置 |
| outbox 异常 | 容易和发布失败混读 | 明确 outbox failed / dead_letter 不回滚 MethodContentLifecycle | 区分业务状态与传播状态 |
| 下游异常 | 分散在各交互模块 | 统一为 replay / snapshot 恢复,下游不可反写定义 | 保护 Definition / Use 边界 |
| P1 异常 | 只写后置能力 | 明确 P1 Plugin / Configuration 失败不阻塞 P0 | 保护 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在每个处理流里零散写失败点 | 和主流程距离近 | 异常口径分散,状态影响不统一 | 不采用 |
| 在概要设计中写完整错误码和补偿流程 | 开发看起来更完整 | 下沉过深,会替代详细设计 | 不采用 |
| 单独收敛关键异常与边界场景,只写影响和处理口径 | 能保护主线边界,又不下沉实现细节 | 仍需详细设计补全协议和恢复参数 | 采用 |

---

## 7. 结构化中间产物

### 7.1 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| `approved_gate_ref` 缺失、无效或不可追溯 | 应用编排与发布治理部分 | 阻断 PublishMethodContent,MethodContent 状态不变,不写 published outbox event |
| governance gate 服务不可用 | 应用编排与发布治理部分 / 对外入口与访问部分 | draft / query 可继续,publish 阻断,不得绕过 gate 直接 published |
| `expected_version` 冲突 | 应用编排与发布治理部分 | 阻断写入,要求调用方重新读取当前版本后重试 |
| 非法生命周期迁移 | 方法定义真相与规则部分 | 由 MethodContentLifecycle / PublishPolicy 拒绝,不改变状态 |
| published 核心字段直接修改 | 方法定义真相与规则部分 | 禁止原地修改,必须通过新版本和 supersede |
| 引用不存在、未发布或跨 kind 引用错误 | 关系校验与边界保护部分 | 阻断 publish 或配置激活,要求修正引用 |
| 下游 Use truth 写入定义仓 | 关系校验与边界保护部分 / 对外入口与访问部分 | 拒绝请求,记录 boundary violation,不得生成 MethodContent 变化 |
| object storage 关键 blob 缺失 | 方法定义真相与规则部分 / 基础设施适配部分 | 若是发布必需内容则阻断 publish;非关键 blob 只允许 degraded 读取 |
| canonical fingerprint 计算失败或结果不一致 | 方法定义真相与规则部分 / 查询解析与审计追溯部分 | 阻断发布或标记 drift,不得用更新时间戳替代 fingerprint |
| outbox relay 发布失败 | 定义同步与快照供给部分 / 基础设施适配部分 | OutboxEvent 进入 failed,MethodContentLifecycle 不回退,等待 retry / replay |
| outbox 进入 dead_letter | 定义同步与快照供给部分 / 基线初始化与恢复运维部分 | 保留事件源,需要恢复作业或人工处理,不自动修改定义状态 |
| 下游不可用或错过事件 | 定义同步与快照供给部分 | 不阻断本仓发布,下游通过 event replay / snapshot query 恢复 |
| snapshot schema 版本不兼容 | 定义同步与快照供给部分 / 查询解析与审计追溯部分 | 通过 schema_version 和 consumer contract 处理,禁止下游直接查库绕过 |
| projection / cache 不可用 | 查询解析与审计追溯部分 / 基础设施适配部分 | projection 可重建,可按规则回源或受控失败,不得反写真相 |
| ResolveViewProfile 无匹配结果 | 查询解析与审计追溯部分 | 返回受控空视图或默认 deny,并保留匹配 trace |
| P1 MethodPlugin 发布失败 | P1 资产打包与配置组装部分 | 不影响 P0 MethodContent 发布,只影响 package metadata 分发 |
| P1 MethodConfiguration 激活失败 | P1 资产打包与配置组装部分 | 不影响 P0 定义真相,不得反向修改 MethodContent |
| marketplace 试图写 listing / transaction / install record | 对外入口与访问部分 / 关系校验与边界保护部分 | 拒绝进入 method-library,marketplace 只消费 package metadata |

### 7.2 异常影响图

```text
PublishMethodContent
  |
  | verify gate / version / lifecycle / reference / boundary
  v
+--------------------+
| validation result  |
+---------+----------+
          |
          | success
          v
  MethodContent lifecycle change
          |
          v
  audit + fingerprint + outbox pending
          |
          v
  L0-bus / snapshot / downstream sync

validation result
  |
  | failure
  v
Reject command
  - MethodContent state unchanged
  - no published event
  - boundary / audit trace if needed

outbox relay
  |
  | failure
  v
OutboxEvent failed / dead_letter
  - MethodContent state not rolled back
  - recovery uses retry / replay / snapshot
```

关键说明：

- gate、version、lifecycle、reference、boundary 失败都发生在 MethodContent 状态变化前。
- outbox relay 失败发生在 MethodContent 真相提交后,只影响传播状态。
- 下游不可用不回滚本仓发布,通过 replay / snapshot 恢复。
- 图中不表达错误码、retry 次数、补偿脚本、SQL 事务或监控阈值。

### 7.3 不在概要设计层展开的内容

| 不展开内容 | 归属 |
|---|---|
| 完整错误码表 | 03-详细设计 API / error contract |
| HTTP / RPC status 映射 | 03-详细设计接口协议 |
| retry 次数、退避、dead letter 阈值 | 03-详细设计 outbox relay |
| 恢复作业参数、游标和批大小 | 03-详细设计 Operations Job |
| snapshot DTO 字段全集 | 03-详细设计 schema / DTO |
| 数据库锁、事务隔离级别和 SQL | 03-详细设计持久化设计 |
| 监控指标和告警阈值 | 运维设计 / SLO 文档 |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §10。

````md
## 10. 异常与边界场景轮廓

### 10.1 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| `approved_gate_ref` 缺失、无效或不可追溯 | 应用编排与发布治理部分 | 阻断 PublishMethodContent,MethodContent 状态不变,不写 published outbox event |
| `expected_version` 冲突 | 应用编排与发布治理部分 | 阻断写入,要求调用方重新读取当前版本后重试 |
| 非法生命周期迁移 | 方法定义真相与规则部分 | 由 MethodContentLifecycle / PublishPolicy 拒绝,不改变状态 |
| published 核心字段直接修改 | 方法定义真相与规则部分 | 禁止原地修改,必须通过新版本和 supersede |
| 引用不存在、未发布或跨 kind 引用错误 | 关系校验与边界保护部分 | 阻断 publish 或配置激活,要求修正引用 |
| 下游 Use truth 写入定义仓 | 关系校验与边界保护部分 / 对外入口与访问部分 | 拒绝请求,记录 boundary violation,不得生成 MethodContent 变化 |
| outbox relay 发布失败 | 定义同步与快照供给部分 / 基础设施适配部分 | OutboxEvent 进入 failed,MethodContentLifecycle 不回退,等待 retry / replay |
| outbox 进入 dead_letter | 定义同步与快照供给部分 / 基线初始化与恢复运维部分 | 保留事件源,需要恢复作业或人工处理,不自动修改定义状态 |
| 下游不可用或错过事件 | 定义同步与快照供给部分 | 不阻断本仓发布,下游通过 event replay / snapshot query 恢复 |
| snapshot schema 版本不兼容 | 定义同步与快照供给部分 / 查询解析与审计追溯部分 | 通过 schema_version 和 consumer contract 处理,禁止下游直接查库绕过 |
| projection / cache 不可用 | 查询解析与审计追溯部分 / 基础设施适配部分 | projection 可重建,可按规则回源或受控失败,不得反写真相 |
| ResolveViewProfile 无匹配结果 | 查询解析与审计追溯部分 | 返回受控空视图或默认 deny,并保留匹配 trace |
| P1 MethodPlugin / MethodConfiguration 失败 | P1 资产打包与配置组装部分 | 不影响 P0 MethodContent 发布,不得反向修改 MethodContent |
| marketplace 试图写 listing / transaction / install record | 对外入口与访问部分 / 关系校验与边界保护部分 | 拒绝进入 method-library,marketplace 只消费 package metadata |

### 10.2 异常影响图

```text
PublishMethodContent
  |
  | verify gate / version / lifecycle / reference / boundary
  v
validation result
  |\
  | \ failure
  |  v
  | Reject command
  | - MethodContent state unchanged
  | - no published event
  |
  | success
  v
MethodContent lifecycle change
  |
  v
audit + fingerprint + outbox pending
  |
  v
L0-bus / snapshot / downstream sync

outbox relay failure
  |
  v
OutboxEvent failed / dead_letter
  - MethodContent state not rolled back
  - recovery uses retry / replay / snapshot
```

关键说明：

- 发布前校验失败不改变 MethodContent 状态。
- outbox 失败只改变传播状态,不回滚定义真相。
- 下游失败不阻断本仓发布,通过 replay / snapshot 恢复。
- 本节不写错误码、重试参数、补偿脚本或事务实现。
````

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 10 |
|---|---|---|
| 是否同意异常场景按“发布阻断、传播失败、下游恢复、边界拒绝、P1 后置”组织 | 建议同意 | 阻塞 |
| 是否同意 outbox failed / dead_letter 不回滚 MethodContentLifecycle | 建议同意,延续 Step 9 结论 | 阻塞 |
| 是否同意 marketplace listing / transaction / install record 写入视为边界违例 | 建议同意 | 阻塞 |
| 是否同意本步不展开错误码、retry 参数、补偿脚本和恢复实现 | 建议同意 | 阻塞 |

---

## 10. 进入下一步条件

进入 Step 11 前需要确认：

- [x] 是否同意本步列出的关键异常与边界场景
- [x] 是否同意各异常对应的主要处理部分
- [x] 是否同意异常影响图中“发布前失败不改状态、传播失败不回滚真相”的口径
- [x] 是否同意详细设计再展开错误码、重试、补偿、恢复作业和协议字段
