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

### R1.1 开工与必读文档:先思考

#### R1.1.1 当前恢复点判断

当前允许进入 Step 10 的依据:

| 来源 | 当前结论 | 对 Step 10 的影响 |
|---|---|---|
| `02_hld_calibration_flow.md` | Step 9 已由 `R1.31` 记录正式 §9 回填。 | Step 10 可以开工,但必须先做必读和框架思考。 |
| `project_execution_ledger.md` | 当前恢复点为 Step 10 `开工与必读文档:先思考`。 | 不得直接写异常场景表、异常影响图或正式 §10 草稿。 |
| 正式 `02-概要设计.md` §5~§9 | 已改为当前八个主要组成部分、关键对象、接口、处理流和多状态组结构。 | Step 10 的异常主语、阻断点、降级面和传播边界必须从当前正式 §5~§9 推导。 |
| 正式 `02-概要设计.md` §10 | 仍是旧 `MethodContentLifecycle`、outbox、snapshot、fingerprint 和 P1 plugin/configuration 主线。 | 只作污染检查和差异审计,不得继承。 |
| 本文件既有内容 | 仍是旧异常表和旧异常影响图。 | 只作 historical material,不得作为本轮 Step 10 第一来源。 |
| `02_hld_step_11_configuration_impact.md` | 已是 completed_pending_recheck,且多处默认 Step 10 已收稳。 | 只能作为下游依赖提醒,不得反推当前 Step 10 结论。 |

#### R1.1.2 旧 Step 10 初步诊断

旧 Step 10 不符合本轮输入基线:

| 旧主线 | 当前问题 | 本轮处理 |
|---|---|---|
| `MethodContentLifecycle` 异常主线 | 当前正式 §5~§9 已不再以 `MethodContent` 作为核心对象或状态 owner。 | 不继承;后续只在旧材料差异审计中记录。 |
| outbox relay / dead letter 作为概要异常中心 | 当前正式 §8 / §9 只保留 event candidate,不以 delivery / relay / retry 作为概要主线。 | 不作为 Step 10 主轴;如需发布投递细节,后续 03 / 04 重新闭口。 |
| snapshot schema / fingerprint drift 主线 | 当前正式 §8 / §9 已排除 snapshot / fingerprint 主线。 | 不继承;freshness / drift 只能从 read material、external summary、maintenance progress 或 peripheral view 重新推导。 |
| P1 plugin / configuration 失败 | 当前外围组织已改为 package / method set / composition / peripheral view 主线。 | 不继承旧 P1 异常语义;如需外围异常,从当前外围对象重推。 |
| marketplace listing / transaction 写入异常 | 当前外围能力以 discovery / composition / package view 为主,旧写法混入交易与安装语义。 | 仅保留“不得越界写入本仓”边界,不把交易 / 安装当本仓异常主线。 |
| 旧 Step 10 已完成结论 | 当前 Step 10 必须承接新的 Step 8 处理流和 Step 9 状态组。 | 既有结论全部降级为 historical material,本轮从开工模块重开。 |

#### R1.1.3 Step 10 必读文档候选

本轮 Step 10 开工必须读取以下文档,并在下一批写入状态:

| 类别 | 文档 | 用途 | 下一批状态 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | 确认恢复点和不得跳步。 | 写入 read。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | 确认 Step 9 completed / Step 10 opening。 | 写入 read。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 10 | 固定异常与边界场景表、按需影响图和禁止下沉内容。 | 写入 read。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.9 / §10 | 固定正式 §10 的表格、ASCII 图和异常表达深度。 | 写入 read。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 固定先思考后写入、台账和门禁要求。 | 写入 read。 |
| 当前正式概要 | `projects/L3-method-library/02-概要设计.md` §5~§10 | §5~§9 是当前输入;§10 是旧异常主线污染对象。 | 写入 read。 |
| 需求边界 | `00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` | 提供必须阻断、必须拒绝和不得越界的需求红线。 | 写入 read。 |
| 架构边界 | `01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_14_risks_open_questions.md` | 提供 truth / projection / reference / consistency、上下游通信和已知跨界风险。 | 写入 read。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | 提供八个主要组成部分、职责边界和“不由谁处理”。 | 写入 read。 |
| Step 6 | `02_hld_step_06_key_objects.md` | 提供异常主语归属、truth / view / material / task / history / lineage / progress 来源。 | 写入 read。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | 提供 Command、Query、Inbound、Outbound、Job 的异常落点分类。 | 写入 read。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | 提供处理流主线、失败不得下沉细节的约束和 Step 9 状态来源提示。 | 写入 read。 |
| Step 9 | `02_hld_step_09_state_machine.md` `R1.30`~`R1.31` | 提供当前状态组、传播红线、Step 10 承接判断和正式 §9 回填记录。 | 写入 read。 |
| 下游依赖 | `02_hld_step_11_configuration_impact.md` | 确认 Step 11 只能承接重开的 Step 10,不得反推。 | 写入 read。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考异常章节骨架、异常族切分、影响图和审计收尾方式。 | 写入 read。 |

#### R1.1.4 本轮 Step 10 应回答的问题

按 SOP 和本仓当前状态,本轮 Step 10 至少回答:

1. 哪些关键异常路径必须在概要设计层先点名,否则会改写当前 Step 5~§9 主线理解。
2. 哪些异常会阻断 core truth 写入,哪些只会降级为 view / material / diagnostic / progress / peripheral surface。
3. 哪些异常会改变主要组成部分、接口类别、状态传播方向或跨部分协作关系。
4. 哪些失败必须明确“不得回滚 truth / 不得反写 truth / 不得由 Query 或 Job 私补”。
5. 哪些内容仍属于详细设计的错误码、重试、补偿、并发、恢复作业或传输协议细节。
6. 当前 Step 10 是否需要补异常影响图,以及图里只允许表达什么。
7. 哪些旧异常主线必须禁止回流。

#### R1.1.5 异常 owner / 影响面初筛框架

下一批只搭框架,不写最终异常表。建议先按以下异常来源池筛选:

| 来源组 | 候选异常 owner / 影响面 | 初步判断 |
|---|---|---|
| core truth 写路径阻断 | definition / catalog、formalization / version、consumption boundary、relation / composition truth。 | 可能存在 gate / basis / boundary / reference / expected version / illegal transition 异常。 |
| Query / view / material 读取降级 | catalog view、availability view、trace material、distribution material、external summary view、maintenance progress、peripheral view。 | 可能存在 stale / unavailable / partial / not visible / invalid member or boundary 异常。 |
| external / inbound / body-free 边界 | external summary、source ref、archive ref、body boundary、inbound intake。 | 可能存在 unresolved / unavailable / rejected / invalid / forbidden body 异常。 |
| publication / handoff / collaboration 边界 | event candidate、handoff hint、report/export surface、downstream discovery signal。 | 只允许作为传播或交付失败异常,不得回滚 core truth。 |
| maintenance / refresh / reconciliation / progress | maintenance request、refresh task、recovery convergence、progress / run history。 | 可能存在 blocked / partial / stale / unavailable / formal intervention required 异常。 |
| peripheral organization / discovery | package、method set、composition、marketplace context、peripheral availability。 | 可能存在 unavailable / rejected / invalid composition 异常,但不得污染 core truth。 |

#### R1.1.6 Step 内执行框架候选

本轮 Step 10 不应一次性写全仓异常总表。建议按以下模块推进:

| 序号 | 模块 | 目标 |
|---:|---|---|
| 1 | 开工与必读文档 | 确认输入基线、旧材料边界和 Step 内框架。 |
| 2 | L1-governance 框架对齐 | 只借异常章节粒度、影响图条件和停审结构。 |
| 3 | 异常 owner / 影响面候选池 | 从 Step 5~9 当前结论筛选异常落点和影响面。 |
| 4 | core truth 写路径阻断异常 | 讨论阻断写入、拒绝写入和不得越权继续的异常。 |
| 5 | Query / view / material 降级异常 | 讨论 stale / unavailable / partial / visibility 相关异常。 |
| 6 | external / inbound / body-free 边界异常 | 讨论 external summary、typed ref、body boundary 和 intake 相关异常。 |
| 7 | publication / handoff / collaboration 异常 | 讨论 event candidate、交付、handoff、report/export 相关异常。 |
| 8 | maintenance / refresh / reconciliation 异常 | 讨论 refresh、recovery、progress 和 maintenance intervention 相关异常。 |
| 9 | peripheral package / method set / discovery 异常 | 讨论外围组织与 discovery 的异常边界。 |
| 10 | 跨异常一致性审计 | 审计阻断 / 降级 / 不回滚 / 不反写 truth / 不由 Query 或 Job 私补。 |
| 11 | 旧材料差异审计 | 审计旧正式 §10 和本文件既有内容污染。 |
| 12 | 正式 §10 回填草稿 | 形成可回填草稿,不直接改正式文档。 |
| 13 | 自检与停审 | 判断 Step 10 是否完成、是否可正式回填、是否影响 Step 11。 |

#### R1.1.7 下一写入批次边界

下一批 `R1.2 开工与必读文档:再写入` 只允许写:

1. 必读文档表和读取状态。
2. 当前输入基线确认。
3. 旧 Step 10 降级声明。
4. 本轮 Step 10 模块执行计划。
5. 下一模块停审记录和 `next_allowed_action`。

不得写异常与边界场景表、异常影响图、正式 §10 草稿、Step 11 配置影响结论或正式 `02-概要设计.md`;不得进入 Step 11。

#### R1.1.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只做开工诊断、必读清单和 Step 内框架思考。 |
| 是否直接写异常正文 | no | 未写正式异常表、异常影响图或正式 §10 草稿。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否继承旧 Step 10 | no | 已明确旧内容降级为 historical material。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 开工。 |

next_allowed_action: 等待用户确认后进入 Step 10 `开工与必读文档:再写入`;只写必读文档表、输入基线、旧 Step 10 降级声明、Step 内模块计划和停审记录,不得写异常与边界场景表、异常影响图或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.2 开工与必读文档:再写入

#### R1.2.1 当前有效文件头

| 项 | 当前口径 |
|---|---|
| 当前 Step | Step 10 异常与边界场景轮廓 |
| 当前模式 | full-restart / R1 重审 |
| 第一来源 | 当前正式 §5~§9、Step 5~9 当前结论和项目级 / 文档级台账 |
| 正式文档目标 | `projects/L3-method-library/02-概要设计.md` §10 |
| 当前禁止 | 不写异常与边界场景总表、不写异常影响图、不写正式 §10 草稿、不改正式 `02-概要设计.md`、不进入 Step 11 |
| 旧材料处理 | 本文件上方既有 Step 10 内容、正式 §10 旧正文和历史 03 相关异常材料均为 historical material |

#### R1.2.2 必读文档表

| 类别 | 文档 | 读取状态 | 本步用途 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | read | 确认当前只允许完成 Step 10 `开工与必读文档:再写入`,不得跳到异常正文或 Step 11。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | read | 确认 Step 9 已正式回填,Step 10 当前为 opening loop。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 10 | read | 固定 Step 10 目标、应问问题、输出边界和按需异常影响图约束。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.9 / §10 | read | 固定正式 §10 的表格结构、说明粒度和禁止下沉内容。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | read | 固定先思考后写入、历史材料后置差异审计、项目级 / 文档级 / Step 级门禁。 |
| 当前正式概要 | `projects/L3-method-library/02-概要设计.md` §5~§10 | read | §5~§9 是当前输入;§10 仍是旧异常主线污染对象。 |
| 需求边界 | `00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` | read | 提供必须阻断、必须拒绝、不得越界写入和不得由下游倒灌的红线。 |
| 架构边界 | `01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_14_risks_open_questions.md` | read | 提供 truth / view / reference / consistency 分层、交互边界和已知跨边界风险。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | read | 提供八个主要组成部分、职责边界和“不由谁处理”。 |
| Step 6 | `02_hld_step_06_key_objects.md` | read | 提供异常主语归属、truth / view / material / task / history / lineage / progress 来源。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | read | 提供 Command、Query、Inbound、Outbound、Job 的异常落点分类。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | read | 提供处理流主线、失败红线和 Step 9 承接提示。 |
| Step 9 | `02_hld_step_09_state_machine.md` `R1.29`~`R1.31` | read | 提供当前状态组、传播红线、Step 10 承接判断和正式 §9 回填记录。 |
| 下游依赖 | `02_hld_step_11_configuration_impact.md` | read | 只用于确认 Step 11 必须承接当前重开的 Step 10,不得反推本步结论。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | read | 只参考模块粒度、异常分族、影响图使用条件和审计收尾方式,不得复制 governance 领域语义。 |

#### R1.2.3 输入基线确认

| 输入 | 当前可用结论 | Step 10 使用方式 |
|---|---|---|
| Step 5 八个主要组成部分 | 已完成并回填正式 §5。 | 作为异常 owner 分组、边界归属和后续逐模块小循环顺序。 |
| Step 6 关键对象 | 已完成并回填正式 §6;`8.45` 已关闭。 | 异常必须回指 truth / view / material / task / history / lineage / progress / peripheral 等正式对象。 |
| Step 7 接口骨架 | 已完成并回填正式 §7;`R1.45` 已记录。 | 异常必须回指 Command、Query、Inbound、Outbound 或 Job 的正式入口类别。 |
| Step 8 处理流 | 已完成并回填正式 §8;`R1.33` 已记录。 | 异常必须回指处理流中的阻断点、降级点、传播点和不得私补红线。 |
| Step 9 状态机 | 已完成并回填正式 §9;`R1.31` 已记录。 | 异常必须回指当前状态组、传播方向和“不回滚 truth / 不反写 truth”的状态边界。 |
| 正式 §10 | 仍为旧 `MethodContentLifecycle` / outbox / snapshot / fingerprint / P1 主线。 | 仅作差异审计对象,不得作为本轮异常与边界场景来源。 |

#### R1.2.4 旧 Step 10 降级声明

本文件上方既有内容和正式 §10 旧正文全部降级为 historical material。具体裁决如下:

| 旧异常主线 | 本轮裁决 | 说明 |
|---|---|---|
| `MethodContentLifecycle` 异常主线 | 不继承 | 当前异常主语必须来自 `MethodAssetDefinition`、formalization、availability、trace、relation、external summary、maintenance、peripheral 等当前对象。 |
| outbox relay / dead letter 中心化异常 | 不作为概要主线 | 当前 Step 8 / Step 9 只保留 event candidate 与传播红线,不在 Step 10 恢复 delivery / retry / relay 细节。 |
| snapshot schema / fingerprint drift 主线 | 不继承 | 当前 freshness / stale / drift 只能从 read material、external summary、maintenance progress 或 peripheral view 重新推导。 |
| plugin / configuration P1 异常主线 | 不继承 | 当前外围主线是 package / method set / composition / peripheral view,不得回流旧 P1 语义。 |
| marketplace listing / transaction / install 异常 | 只保留边界警戒 | 仅保留“不得越界写入本仓 truth / view”的边界,不把交易 / 安装作为本仓异常族。 |
| 旧 Step 10 已完成结论 | 全部降级 | 本轮 Step 10 必须承接新的 Step 5~9,旧完成状态不具继承资格。 |

#### R1.2.5 Step 内模块计划

| 序号 | 模块 | 状态 | 输出 | next_allowed_action |
|---:|---|---|---|---|
| 1 | 开工与必读文档:先思考 | done | `R1.1` 已固定恢复点、旧材料降级、必读候选、异常来源池和 Step 内执行框架。 | 进入再写入。 |
| 2 | 开工与必读文档:再写入 | done | `R1.2` 已写当前文件头、必读表、输入基线、旧材料降级声明和模块计划。 | 等待进入 L1-governance 框架对齐:先思考。 |
| 3 | L1-governance 框架对齐:先思考 / 再写入 | done | `R1.3` / `R1.4` 已固定可借框架、不可借语义和 Step 10 当前章节骨架。 | 进入异常 owner / 影响面候选池:先思考。 |
| 4 | 异常 owner / 影响面候选池:先思考 / 再写入 | done | `R1.5` / `R1.6` 已收稳六个异常族的 owner、影响面和排除项。 | 进入 core truth 写路径阻断异常:先思考。 |
| 5 | core truth 写路径阻断异常:先思考 / 再写入 | done | `R1.7` / `R1.8` 已完成 truth 写路径阻断、拒绝和非法推进口径。 | 进入 Query / view / material 降级异常:先思考。 |
| 6 | Query / view / material 降级异常:先思考 / 再写入 | done | `R1.9` / `R1.10` 已完成 stale / unavailable / partial / not visible / degraded 口径。 | 进入 external / inbound / body-free 边界异常:先思考。 |
| 7 | external / inbound / body-free 边界异常:先思考 / 再写入 | done | `R1.11` / `R1.12` 已完成 external summary、typed ref、body-free 和 intake rejection 边界。 | 进入 publication / handoff / collaboration 异常:先思考。 |
| 8 | publication / handoff / collaboration 异常:先思考 / 再写入 | done | `R1.13` / `R1.14` 已完成 handoff、协作阻断和 candidate 不等于 delivery 的口径。 | 进入 maintenance / refresh / reconciliation 异常:先思考。 |
| 9 | maintenance / refresh / reconciliation 异常:先思考 / 再写入 | done | `R1.15` / `R1.16` 已完成 refresh、recovery、progress 和 drift 边界。 | 进入 peripheral package / method set / discovery 异常:先思考。 |
| 10 | peripheral package / method set / discovery 异常:先思考 / 再写入 | done | `R1.17` / `R1.18` 已完成外围 package / method set / discovery 的异常边界。 | 进入跨异常一致性审计:先思考。 |
| 11 | 跨异常一致性审计:先思考 / 再写入 | done | `R1.19` / `R1.20` 已完成阻断 / 降级 / 不回滚 truth / 不反写 truth / 不由 Query 或 Job 私补 的统一审计。 | 进入旧材料差异审计:先思考。 |
| 12 | 旧材料差异审计:先思考 / 再写入 | done | `R1.21` / `R1.22` 已完成旧正式 §10 与 historical Step 10 的污染范围、保留事实、替换策略和回退判定。 | 进入正式 §10 回填草稿:先思考。 |
| 13 | 正式 §10 回填草稿:先思考 / 再写入 | done | `R1.23` / `R1.24` 已完成正式 §10 的章节骨架、段落压缩顺序、摘录映射、摘要化规则和可回填草稿。 | 进入自检与停审:先思考。 |
| 14 | 自检与停审:先思考 / 再写入 | done | `R1.25` / `R1.26` 已完成 Step 10 完成门禁自检、正式 §10 可回填性检查、Step 11 重审判断、停审裁决和 flow / 台账推进建议。 | 进入正式 §10 回填记录。 |
| 15 | 正式 §10 回填记录:再写入 | done | `R1.27` 已完成正式 §10 回填动作记录、回填后检查、后续风险保留和最终裁决。 | 等待用户确认进入 Step 11 开工与必读文档:先思考。 |

#### R1.2.6 下一模块边界

当前 `R1.2` 完成后,下一动作必须等待用户确认再进入 Step 10 `L1-governance 框架对齐:先思考`。

下一模块只允许回答:

1. L1-governance 的 Step 10 框架里,哪些章节粒度和模块顺序可以复用。
2. 哪些异常分族和影响图触发条件值得借用。
3. 哪些 governance 领域语义、治理审批、policy / control 语义必须明确排除。
4. L3-method-library 的 Step 10 后续模块,哪些地方需要比 governance 更强调 body-free、external summary、maintenance 和 peripheral 边界。

下一模块不得写:

- 本仓异常与边界场景总表正文
- 异常影响图正文
- 正式 §10 回填草稿
- Step 11 配置影响结论
- 正式 `02-概要设计.md`

#### R1.2.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入必读文档表 | pass | 已记录项目台账、flow、SOP、书写规范、中间产物规范、当前正式文档、需求 / 架构边界、Step 5~9 和参考框架。 |
| 是否确认输入基线 | pass | 已明确 Step 5~9 和正式 §5~§9 为当前来源,正式 §10 只作污染审计对象。 |
| 是否降级旧 Step 10 | pass | 已明确旧 lifecycle / outbox / snapshot / fingerprint / P1 / marketplace 异常主线不继承。 |
| 是否搭好 Step 内模块计划 | pass | 已把 Step 10 拆成 14 个受控模块,并固定后续顺序。 |
| 是否写异常正文 | no | 本模块未写异常总表、异常影响图或正式 §10 草稿。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍停在 Step 10 开工模块之后。 |

next_allowed_action: 等待用户确认后进入 Step 10 `L1-governance 框架对齐:先思考`;只参考 L1-governance 的 Step 10 框架、异常分族方式、影响图触发条件和停审结构,不得复制 governance 领域语义,不得写本仓异常与边界场景总表、异常影响图或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.3 L1-governance 框架对齐:先思考

#### R1.3.1 本模块问题

本模块只抽象 L1-governance Step 10 的写作框架,用于约束 L3-method-library 后续异常与边界场景模块的深度、顺序和收尾方式。它不复制 governance 的异常名、状态名、审批语义、control / policy 语义或外部协作语义。

需要回答:

1. L1-governance 的 Step 10 为什么比当前 L3 旧 Step 10 更适合作为框架参照。
2. 哪些章节结构、异常分族方式和影响图触发条件可以迁移到 L3。
3. 哪些内容不能迁移,避免把 governance 领域语义污染 method-library。
4. L3 Step 10 后续模块应按什么结构写“先思考 / 再写入”。

#### R1.3.2 governance Step 10 框架观察

L1-governance 的 Step 10 不是只列一张异常表。它形成了完整的“异常轮廓收敛链”,这一点比当前 L3 旧 Step 10 更适合作为框架参照:

| 框架元素 | governance 做法 | L3 可借鉴点 |
|---|---|---|
| SOP 问题先回答 | 先回答哪些异常必须点名、哪些会改写协作关系、哪些不能留到详细设计、哪些内容不展开。 | L3 也应先回答异常是否阻断 truth、是否只降级读取面、是否会改写传播边界。 |
| 异常总览表 | 先汇总场景、处理落点和概要口径。 | L3 后续也应有一张总览表,但前提是先完成异常族逐模块讨论。 |
| 按处理流族归类 | governance 按 Command / Query / Consumer / Operations Job 分类。 | L3 可借“按异常族分段”的方式,但分类要改写为 core truth、query/material、external/inbound、publication/handoff、maintenance、peripheral。 |
| 异常影响图 | 只有当异常会改变跨部分协作关系时,才补 1 张极简图。 | L3 也应按需补图,只表达阻断 / 降级 / 传播 / 不回滚边界。 |
| 状态机影响清单 | 单独列异常会把哪些状态推到 pending / stale / failed / unavailable,以及哪些状态禁止进入。 | L3 后续也要回指 Step 9 的状态组,说明异常对正式化、availability、trace、maintenance 和 peripheral 的影响。 |
| 当前文档问题诊断 | 明确旧文档为什么不够用。 | L3 也必须保留对旧 `MethodContentLifecycle` / outbox / snapshot / fingerprint / P1 主线的污染诊断。 |
| 改动前后对比 | 用结构化方式解释重写收益。 | L3 可用来说明从旧生命周期异常主线转向当前多边界异常主线。 |
| 设计取舍 | 集中说明为什么不写错误码、不逐接口展开、不下沉重试补偿。 | L3 也必须在收尾前把“不写什么”讲清楚。 |

#### R1.3.3 可迁移到 L3 的章节骨架

建议 L3 Step 10 后续整体采用以下骨架,但内容按 method-library 当前边界重写:

| 顺序 | 章节 / 模块 | L3 用途 |
|---:|---|---|
| 1 | SOP 问题回答 | 回答哪些异常必须点名、哪些会阻断 truth、哪些只会形成 degraded / unavailable / rejected surface。 |
| 2 | 异常 owner / 影响面候选池 | 先按正式对象、接口类别、处理流和状态边界筛选异常落点。 |
| 3 | 异常分族小循环 | 按 core truth、query/material、external/inbound、publication/handoff、maintenance、peripheral 六族逐项先思考、再写入。 |
| 4 | 异常总览表 | 在各异常族收稳后再压缩成总览,而不是开头直接拍一张表。 |
| 5 | 按需异常影响图 | 只在异常确实改写跨部分协作时补 1 张图。 |
| 6 | 状态影响清单 | 回指 Step 9 的状态组,说明异常把哪些对象推入 blocked / unavailable / stale / rejected / pending intervention。 |
| 7 | 当前文档问题诊断 | 解释旧 Step 10 为什么不能继承。 |
| 8 | 改动前后对比 | 说明重写后异常主线如何从旧生命周期中心转为多边界中心。 |
| 9 | 设计取舍 | 说明为什么不在概要层写错误码、重试、补偿、队列、worker、DLQ。 |
| 10 | 旧材料差异审计 / 正式回填草稿 / 自检停审 | 在总览、影响和取舍稳定后再做后置审计与回填。 |

#### R1.3.4 禁止复制的 governance 语义

以下 governance 语义不得迁入 L3 Step 10:

| governance 语义 | L3 禁止原因 | L3 替代口径 |
|---|---|---|
| gate / decision / approval 失败主线 | 本仓不拥有治理审批或裁决 truth。 | 改为 definition、formalization、consumption、relation、external summary 等边界异常。 |
| policy / control / compliance / nonconformity 异常 | 属于 governance 特有闭环。 | 改为 basis、boundary、acceptance、consistency protection、maintenance intervention。 |
| outbox publish failed / dead-letter 作为异常中心 | 当前 L3 只保留 event candidate,不闭口 outbox delivery 状态。 | 只保留 publication / handoff 失败不回滚 truth 的边界。 |
| snapshot / external GRC / dashboard 异常语义 | L3 当前不恢复 snapshot 主线,也不以外部治理可视化为主输出面。 | 改为 read material、external summary、maintenance progress、peripheral view。 |
| governance consumer 直接围绕治理事实同步 | L3 更强调 body-free basis、external summary、安全引用和 intake 边界。 | 外部 / inbound 异常应围绕 summary/ref/boundary disposition 重写。 |
| report / conclusion 作为核心异常主语 | L3 当前核心不是治理结论。 | 只保留 trace / diagnostic / progress / discovery 相关异常。 |

#### R1.3.5 L3 Step 10 后续整体骨架适配

L3 不应照搬 governance 的四段式流族,而应按本仓当前边界改写:

| governance 框架位 | L3 对应模块 | 适配原因 |
|---|---|---|
| Command 写路径异常 | core truth 写路径阻断异常 | L3 的核心是 definition / formalization / relation / consumption boundary 等 truth 或 truth-adjacent gate。 |
| Query 只读异常 | Query / view / material 降级异常 | L3 需要把 stale / unavailable / partial / visibility / degraded surface 单独收稳。 |
| Consumer 异常 | external / inbound / body-free 边界异常 | L3 的重点不是消息消费技术面,而是 external summary、typed ref、archive ref 和正文越界边界。 |
| Outbound / handoff 类失败 | publication / handoff / collaboration 异常 | L3 需要点名传播失败、handoff 失败和下游协作失败,但不能回滚 truth。 |
| Operations Job 异常 | maintenance / refresh / reconciliation 异常 | L3 要把 refresh、recovery、progress 和 intervention 边界独立成族。 |
| governance 无独立外围异常族 | peripheral package / method set / discovery 异常 | 这是 L3 特有模块,必须单独处理外围组织与 discovery 不得污染核心的问题。 |

#### R1.3.6 异常影响图触发条件

L1-governance 的做法说明:只有异常确实改写跨部分协作关系,才值得补图。对 L3 而言,后续只有在以下条件同时成立时才需要图:

1. 异常不仅是单点拒绝,而是会改写 core truth、read material、external boundary、maintenance progress 或 peripheral discovery 之间的传播关系。
2. 纯表格难以说明“哪些失败只降级 surface、哪些失败阻断写入、哪些失败不得回滚 truth”。
3. 图可以保持极简,不需要写错误码、retry、queue、worker、topic、payload 或恢复脚本。

如果后续补图,图里只允许表达:

- truth write blocked
- query / material degraded
- external / inbound rejected or isolated
- maintenance / reconciliation writes progress or diagnostic only
- peripheral unavailable does not mutate core truth

#### R1.3.7 当前取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否照搬 governance 的异常分族 | no | L3 的核心边界是 body-free、external summary、material freshness、maintenance 和 peripheral,不能回到治理语义。 |
| 是否复用 governance 的章节顺序 | yes_with_adaptation | 问题回答、分族收敛、按需影响图、状态影响、诊断、对比、取舍、审计和停审的顺序可复用。 |
| 是否现在就写异常总览表 | no | 当前只做框架对齐,总览表必须等六个异常族收稳后再压缩。 |
| 是否先按 Step 7 接口类别直接展开 | partial_no | L3 需要接口类别和边界主语混合组织,否则 external / body-free / peripheral 边界会被压扁。 |
| 是否默认补异常影响图 | no | 必须等后续异常族证明确有跨部分传播改写才补图。 |

#### R1.3.8 下一写入批次边界

下一批 `L1-governance 框架对齐:再写入` 只允许写:

1. governance 可复用框架清单。
2. L3 禁止复制的 governance 语义清单。
3. L3 Step 10 后续整体骨架。
4. 单异常族模块模板。
5. 异常影响图触发门禁。
6. 停审记录和下一模块边界。

不得写本仓异常与边界场景总表、异常影响图正文、状态影响清单正文或正式 §10 回填草稿;不得修改正式 `02-概要设计.md`;不得进入 Step 11。

#### R1.3.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做框架先思考 | pass | 只抽象 governance 的写作结构和 L3 适配方式。 |
| 是否复制 governance 领域语义 | no | 未把 gate / decision / policy / control / nonconformity 等语义迁入 L3。 |
| 是否写 L3 具体异常正文 | no | 未写 L3 异常总览表、异常影响图或状态影响清单正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 框架对齐。 |

next_allowed_action: 等待用户确认后进入 Step 10 `L1-governance 框架对齐:再写入`;只写可复用框架清单、禁止复制语义清单、L3 后续整体骨架、单异常族模块模板、异常影响图触发门禁和停审记录,不得写本仓异常与边界场景总表、异常影响图正文、状态影响清单正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.4 L1-governance 框架对齐:再写入

#### R1.4.1 可复用框架清单

L1-governance Step 10 中可复用于本仓的是“异常轮廓的收敛结构”,不是治理领域内容。

| 可复用框架 | L3 当前采用方式 |
|---|---|
| SOP 问题先回答 | 后续异常模块先回答是否阻断 truth、是否只降级读取面、是否改写传播边界、哪些内容不展开。 |
| 异常先分族再汇总 | 先按六个异常族逐模块收稳,最后再压缩异常总览表。 |
| 场景 / 落点 / 口径表 | 后续每个异常族都用结构化表说明场景、落点、当前概要口径和边界。 |
| 按需异常影响图 | 只有当异常确实改写跨部分协作关系时才补 1 张极简图。 |
| 状态影响清单 | 后续异常收稳后回指 Step 9,说明异常把哪些对象推到 blocked / stale / unavailable / rejected / pending intervention。 |
| 旧材料问题诊断 | 在异常正文之前先说明旧 Step 10 的污染主线为什么不能继续继承。 |
| 改动前后对比 | 收尾时对比“旧生命周期中心异常”与“当前多边界异常”之间的结构变化。 |
| 设计取舍 | 集中声明为什么不写错误码、重试、补偿、worker、queue、DLQ、payload。 |
| 自检与停审 | 每个模块结束都留停审记录,正式 §10 回填前必须再做总停审。 |

#### R1.4.2 禁止复制的 governance 语义清单

以下语义只属于 governance,不得进入 L3 Step 10:

| governance 语义 | L3 禁止原因 | L3 替代口径 |
|---|---|---|
| gate / decision / approval 失败链 | 本仓不拥有治理裁决 truth。 | 改为 definition、formalization、consumption、relation、external summary 的边界异常。 |
| policy / control / compliance / nonconformity 异常 | 属于治理专属闭环。 | 改为 basis 缺失、boundary block、acceptance rejection、consistency protection、maintenance intervention。 |
| outbox publication failure 作为异常中心 | 当前 L3 只保留 event candidate,不闭口 delivery / dead-letter。 | 只保留 publication / handoff / collaboration 失败不回滚 truth 的边界。 |
| snapshot / external GRC / dashboard 主输出面 | L3 当前不恢复 snapshot 主线,也不以 GRC 可视化为主目标。 | 改为 read material、external summary、maintenance progress、peripheral view。 |
| 直接围绕治理事实同步的 consumer 语义 | L3 更强调 body-free summary/ref 和正文越界边界。 | 改为 external / inbound / body-free 边界异常。 |
| report / conclusion 作为核心异常主语 | L3 当前核心不是治理结论。 | 改为 trace / diagnostic / progress / discovery 的附属异常。 |

#### R1.4.3 L3 Step 10 后续整体骨架

本轮 Step 10 后续按以下整体骨架推进:

| 顺序 | 模块 | 输出 |
|---:|---|---|
| 1 | 异常 owner / 影响面候选池 | owner 筛选规则、异常来源池、影响面分类、排除项。 |
| 2 | core truth 写路径阻断异常 | 阻断写入、拒绝写入、basis 缺失、非法推进和不得越权继续的概要口径。 |
| 3 | Query / view / material 降级异常 | stale / unavailable / partial / visibility / degraded surface 的概要口径。 |
| 4 | external / inbound / body-free 边界异常 | external summary、typed ref、archive ref、body boundary、intake rejection 的概要口径。 |
| 5 | publication / handoff / collaboration 异常 | event candidate、传播失败、handoff / report / export 失败和下游协作失败的概要口径。 |
| 6 | maintenance / refresh / reconciliation 异常 | refresh、recovery、progress、intervention 和 reconciliation drift 的概要口径。 |
| 7 | peripheral package / method set / discovery 异常 | package、method set、composition、discovery 和 peripheral view 的概要边界。 |
| 8 | 跨异常一致性审计 | 阻断 / 降级 / 不回滚 truth / 不反写 truth / 不由 Query 或 Job 私补 的统一审计。 |
| 9 | 旧材料差异审计 | 旧正式 §10 和 historical Step 10 的污染审计。 |
| 10 | 正式 §10 回填草稿 | 形成可回填草稿,不直接改正式文档。 |
| 11 | 自检与停审 | 判断 Step 10 是否可关闭、是否可回填、是否影响 Step 11。 |

#### R1.4.4 单异常族模块模板

后续每个异常族按同一模板执行:

| 子段 | 固定输出 | 必须避免 |
|---|---|---|
| 先思考 | 异常主语范围、影响面、触发来源、边界红线、排除项。 | 直接写总览表正文或影响图。 |
| 再写入:异常落点表 | 场景、落在哪个部分处理、当前概要口径、为什么要在概要层点名。 | 写错误码、payload、topic、worker、脚本。 |
| 再写入:状态影响提示 | 回指 Step 9 哪些状态会受影响、哪些状态禁止进入。 | 发明新的详细状态机或实现态。 |
| 再写入:传播边界 | 说明哪些失败只降级 surface、哪些失败阻断写入、哪些失败不得回滚 truth。 | 写具体重试、补偿、事务和并发策略。 |
| 再写入:红线清单 | Query no-write、Job 不修 truth、external 缺失不回滚 truth、peripheral 不污染核心等。 | 漏掉本仓关键边界或把实现细节混进来。 |
| 停审 | 越界检查、旧材料污染检查、下一模块边界。 | 直接修改正式 `02-概要设计.md`。 |

#### R1.4.5 异常影响图触发门禁

后续是否补异常影响图,必须同时满足以下门禁:

| 门禁 | 要求 |
|---|---|
| 跨部分改写 | 异常会改写 core truth、read material、external boundary、maintenance progress 或 peripheral discovery 之间的传播关系。 |
| 表格不足 | 只靠表格无法清楚说明“阻断写入 / 降级 surface / 不回滚 truth / 不反写 truth”的边界。 |
| 图可极简 | 图能保持在概要层,不需要写错误码、retry、queue、worker、topic、payload 或恢复脚本。 |
| 边界清楚 | 图中只表达落点、传播和禁止动作,不表达详细时序或实现策略。 |

如果门禁未同时满足,Step 10 默认不画图,只保留表格和短文说明。

#### R1.4.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成框架清单 | pass | 已定稿可复用的异常收敛结构。 |
| 是否明确禁止复制语义 | pass | 已排除 governance 的审批、policy、control、outbox publication 和 snapshot / GRC 语义。 |
| 是否给出 L3 后续整体骨架 | pass | 已把 Step 10 后续拆成 11 个受控模块。 |
| 是否给出单异常族模板 | pass | 已固定先思考、落点表、状态影响、传播边界、红线清单和停审结构。 |
| 是否写本仓异常正文 | no | 未写异常总览表、异常影响图正文或状态影响清单正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍停在 Step 10 框架对齐之后。 |

#### R1.4.7 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `异常 owner / 影响面候选池:先思考`。

下一模块只允许回答:

1. 当前 Step 5~9 下,哪些正式对象 / 入口 / 处理流 / 状态边界会成为异常主语。
2. 这些异常主语分别属于阻断写入、降级读取、外部边界、传播失败、维护失败还是外围异常。
3. 哪些候选只属于详细设计、实现态、运维态或旧材料污染,不得进入概要 Step 10。

下一模块不得写:

- 本仓异常与边界场景总表正文
- 异常影响图正文
- 状态影响清单正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `异常 owner / 影响面候选池:先思考`;只思考异常主语范围、影响面分类、异常来源池、排除项和后续模块映射,不得写本仓异常与边界场景总表、异常影响图正文、状态影响清单正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.5 异常 owner / 影响面候选池:先思考

#### R1.5.1 本模块问题

本模块只回答“哪些正式对象 / 入口 / 处理流 / 状态边界有资格成为 Step 10 的异常主语或影响面”。它不回答具体异常总表、异常影响图、状态影响清单正文或正式 §10 草稿。

需要先把异常 owner 池筛清楚,原因有三点:

1. 当前 Step 6 已经点名大量 truth、material、boundary、task、history 和 peripheral 对象,但并非所有带有失败、stale、unavailable 或 blocked 语义的对象都应升级为 Step 10 异常主语。
2. 当前 Step 8 已经给出 Command / Query / Inbound / Job 的正式处理流边界,但 Step 10 不能把每个读写分支、每个 safe reason 或每个刷新 hint 都升级成异常家族。
3. 旧 Step 10 的 `MethodContentLifecycle` / outbox / snapshot / fingerprint / P1 主线会把 definition、formalization、consumption、trace、external、maintenance 和 peripheral 的边界重新压扁,这正是本轮需要避免的污染。

#### R1.5.2 异常 owner 筛选规则

候选进入 Step 10 异常 owner / 影响面池,至少需要同时满足以下条件:

| 规则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 有 Step 6 主语归属 | 能回指 truth、state object、view/material、boundary、history/lineage、task/progress 或 peripheral 对象。 | 只作为局部 safe reason、实现分支或详细设计内部状态。 |
| 有 Step 7 / Step 8 触发来源 | 能回指 Command、边界 Query、Inbound intake、Outbound candidate 产生点或 Operations Job / refresh / recovery flow。 | 不进入 Step 10 异常讨论。 |
| 会改写概要层理解 | 会阻断 truth、降级读取面、拒绝外部承接、隔离传播失败、触发维护介入或强调外围隔离边界。 | 降级为普通结果分支或测试细节。 |
| 不属于实现机制 | 不表达 worker、queue、retry、lock、cache、outbox relay、topic、payload schema、checkpoint 或运维脚本。 | 后置到 03 / 04 / 07。 |
| 不复制外部或下游 truth | 不保存外部正文、治理执行生命周期、marketplace 交易 / 安装 / 履约或下游 runtime 状态。 | 只能以 summary/ref/boundary disposition / degraded marker 表达。 |

#### R1.5.3 影响面分类框架

本轮 Step 10 的异常影响面先按六类筛选,后续再逐族展开:

| 影响面分类 | 典型结果 | 当前判断重点 |
|---|---|---|
| core truth 写入阻断 | rejected / blocked / basis missing / illegal transition | 是否必须阻断 definition、formalization、relation、boundary truth 或 truth-adjacent gate 继续成立。 |
| Query / view / material 降级 | stale / unavailable / partial / not visible / degraded | 是否只影响读取面和可见性,且明确不得反写 truth。 |
| external / inbound / body-free 边界 | rejected intake / unresolved ref / forbidden body / acceptance pending | 是否只承接 summary/ref/digest/marker,并守住正文禁止边界。 |
| publication / handoff / collaboration | candidate produced but handoff failed / downstream unavailable / collaboration blocked | 是否只影响传播、handoff、report/export surface,且不得回滚 truth。 |
| maintenance / refresh / reconciliation | refresh blocked / recovery pending / progress stalled / drift detected | 是否只推动派生材料与收敛进度,不得修 core truth。 |
| peripheral isolation | package / set / discovery unavailable / invalid composition | 是否只影响外围增强和发现,不得让外围失败污染核心闭环。 |

#### R1.5.4 初步异常主语池判断

以下只是异常主语候选池,不是异常总览表。

| 组成部分 | 强候选异常主语 | 主要影响面 | 弱候选 / 待后续判断 | 当前排除 |
|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`ResolveMethodAssetDefinitionRef` 边界 | core truth 写入阻断;Query / view / material 降级 | `MethodAssetCatalogView` stale / unavailable | 搜索索引错误、UI 分类状态、旧 draft/publish 生命周期。 |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | core truth 写入阻断;external/body-free 边界 | formal read material unavailable | governance 执行失败、fingerprint drift、发布流水线状态。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | Query / material 降级;core truth-adjacent boundary block | downstream diagnostic summary | 下游运行状态、授权实现细节、snapshot export。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | Query / material 降级;maintenance / reconciliation;collaboration hint | trace lineage completeness / audit view stale | raw log、report body、telemetry runtime 状态。 |
| 关系与分发语义 | `MethodAssetRelation`;`RelationIntegrityRule`;`DistributionReadMaterial`;distribution / handoff hint | core truth 写入阻断;Query / material 降级;publication / collaboration | relation view freshness / distribution availability | runtime dependency、call graph、marketplace listing/install。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalInboundIntakeFlow` | external / inbound / body-free 边界;Query / material 降级 | external summary view freshness / ref availability | 外部文档生命周期、artifact body/archive package 状态。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | maintenance / refresh / reconciliation | maintenance run history visibility | worker、scheduler、queue、retry、lock、dead letter。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;peripheral discovery view | peripheral isolation;Query / material 降级 | package / set view availability | marketplace order、installation、organization runtime config、console UI 状态。 |

#### R1.5.5 触发来源与影响面交叉判断

后续异常候选池必须同时看主语和触发来源,避免把只读提示误写成写入异常,或把 maintenance / peripheral 问题误写成 truth 回滚:

| 触发来源 | 可能产生的异常族 | 必须避免 |
|---|---|---|
| Command 写路径 | core truth 写入阻断;boundary block;acceptance rejection | 不把 Query stale / unavailable 或 job progress 失败写成 Command truth rollback。 |
| Query 只读路径 | Query / view / material 降级;typed ref resolution failure;not visible / unavailable | Query 不创建、不刷新、不修复,因此不得拥有 truth 修复异常。 |
| Inbound / external intake | external / inbound / body-free 边界;summary/ref acceptance rejection;forbidden body | 不把 inbound 到达等同于 formalization 通过、relation 成立或 package 可用。 |
| Outbound candidate / handoff | publication / handoff / collaboration | 不恢复旧 outbox / relay / retry / DLQ 主线。 |
| Operations Job / refresh / recovery | maintenance / refresh / reconciliation;drift / recovery needed | Job 不修 definition、formal version、relation、external summary 或 package truth。 |
| Peripheral read / discovery | peripheral isolation;read degraded | 外围不可用不得反向阻断定义、正式化、受控消费或追溯核心闭环。 |

#### R1.5.6 当前取舍诊断

本轮不应把所有“失败”“stale”“unavailable”都写成同等强度的异常主线。建议后续按以下取舍推进:

| 取舍 | 当前判断 | 后续写入要求 |
|---|---|---|
| `FormalizationState` / `FormalMethodAssetVersion` 应作为强异常主语 | yes | 后续必须单独写 basis 缺失、非法推进、退出语境和不得隐式正式化。 |
| definition / catalog 应进入异常池 | yes_limited | 只写建立 / 调整 / typed ref boundary / stale view 相关异常,不恢复旧 lifecycle。 |
| availability / freshness 是否统一成一个大异常族 | no | 只能共享降级语义框架,owner 必须分别回指 catalog / consumption / trace / distribution / external / peripheral material。 |
| maintenance 是否等于实现 job 失败 | no | 只写 refresh / recovery / progress / reconciliation 语义,不得落成 worker / queue / retry 失败表。 |
| publication / collaboration 是否恢复 delivery 主线 | no | 只保留 candidate / handoff / downstream collaboration 的概要边界。 |
| peripheral 异常是否可阻塞核心闭环 | no | 只能表达外围隔离和 discovery 不可用,不得污染核心 truth 或 formalization / consumption 边界。 |

#### R1.5.7 排除口径

以下候选不得进入当前 Step 10 异常 owner / 影响面池:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| `OutboxEventStatus` / relay / dead-letter | 当前 §8 只有 event candidate,不定义 outbox / delivery 机制。 | 若需要,后置 03 / 04 / 07。 |
| worker / queue / scheduler / retry / lock / cache | 属于执行机制或运维机制,不是概要异常主语。 | 后置详细设计、配置设计或实施计划。 |
| snapshot export / fingerprint drift | 当前消费、版本和读取主线已不以 snapshot / fingerprint 为核心。 | 如需一致性提示,从 material freshness 重新讨论。 |
| governance execution / approval lifecycle | 本仓只承接 body-free basis summary/ref,不执行治理流程。 | 留在 governance 或外部系统。 |
| marketplace transaction / order / install / fulfillment | 本仓只表达外围上下文和 discovery,不拥有交易履约 truth。 | 留给 marketplace / 下游系统。 |
| UI / console / SDK session state | 展示或客户端状态不属于方法资产异常主线。 | 留给 console / SDK。 |
| adapter private cache / fake runtime state | 无 Step 6 owner 和 Step 8 正式触发来源。 | 不作为设计真相源。 |

#### R1.5.8 下一写入批次边界

下一批 `异常 owner / 影响面候选池:再写入` 只允许把本模块思考收敛为:

1. 异常 owner 筛选规则定稿。
2. 影响面分类定稿。
3. 异常主语候选池表。
4. 排除清单定稿。
5. 后续异常族模块分配。
6. 停审记录和下一模块边界。

不得写:

1. 本仓异常与边界场景总表正文。
2. 异常影响图正文。
3. 状态影响清单正文。
4. 正式 §10 回填草稿。
5. 正式 `02-概要设计.md`。

#### R1.5.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只定义异常 owner 筛选规则、影响面分类和排除口径。 |
| 是否写异常总览表 | no | 未写正式异常场景总表。 |
| 是否写异常影响图 | no | 未写图正文,只写后续触发思路。 |
| 是否恢复旧异常主线 | no | 已继续排除 `MethodContentLifecycle`、outbox、snapshot、fingerprint、P1 和 marketplace 交易主线。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 候选池模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `异常 owner / 影响面候选池:再写入`;只写 owner 筛选规则、影响面分类、候选池表、排除清单、后续模块分配和停审记录,不得写本仓异常与边界场景总表、异常影响图正文、状态影响清单正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.6 异常 owner / 影响面候选池:再写入

#### R1.6.1 异常 owner 筛选规则定稿

Step 10 异常 owner / 影响面候选必须同时满足以下规则,否则不得进入后续异常族小循环:

| 规则 | 定稿口径 | 后续检查 |
|---|---|---|
| 来源闭合 | 必须能回指 Step 6 当前 truth、state object、view/material、boundary、history/lineage、task/progress 或 peripheral 对象。 | 后续每个异常族模块必须写 `异常主语 -> Step 6 来源`。 |
| 触发闭合 | 必须能回指 Step 7 / Step 8 的 Command、边界 Query、Inbound intake、Outbound candidate 产生点或 Operations Job / refresh / recovery flow。 | 不得从自由推理、实现细节或运维动作补主语。 |
| 概要可见 | 必须会阻断 truth、降级读取面、拒绝外部承接、隔离传播失败、触发维护介入或强调外围隔离边界。 | 只影响错误消息文案、实现分支或测试断言的内容不得进入 Step 10。 |
| 非机制态 | 不得表达 worker、queue、retry、cache、outbox relay、topic、payload schema、checkpoint 或脚本机制。 | 这些内容后置到 03 / 04 / 07。 |
| 边界安全 | 不复制外部正文、治理执行生命周期、marketplace 交易 / 安装 / 履约或下游 runtime truth。 | 只能以 summary/ref/boundary disposition / degraded marker 表达。 |

#### R1.6.2 影响面分类定稿

后续异常讨论按以下六类影响面展开,不得混写为单一生命周期异常:

| 影响面分类 | 典型结果 | 写入要求 |
|---|---|---|
| core truth 写入阻断 | rejected / blocked / basis missing / illegal transition | 只讨论必须阻断 definition、formalization、relation、boundary truth 或 truth-adjacent gate 的异常。 |
| Query / view / material 降级 | stale / unavailable / partial / not visible / degraded | 只讨论读取面降级,并明确不得反写 truth。 |
| external / inbound / body-free 边界 | rejected intake / unresolved ref / forbidden body / acceptance pending | 只讨论 summary/ref/digest/marker 承接边界和正文禁止边界。 |
| publication / handoff / collaboration | candidate produced but handoff failed / downstream unavailable / collaboration blocked | 只讨论传播、handoff、report/export surface 失败,不得回滚 truth。 |
| maintenance / refresh / reconciliation | refresh blocked / recovery pending / progress stalled / drift detected | 只讨论派生材料、恢复收敛和 progress,不得修 core truth。 |
| peripheral isolation | package / set / discovery unavailable / invalid composition | 只讨论外围增强和 discovery 隔离,不得污染核心闭环。 |

#### R1.6.3 异常主语候选池

本表只确定 Step 10 异常候选池和后续讨论位置,不定义具体异常总表。

| 组成部分 | 异常主语候选 | 主要影响面 | 典型触发来源 | 后续模块 |
|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`ResolveMethodAssetDefinitionRef`;`MethodAssetCatalogView` | core truth 写入阻断;Query / view / material 降级 | definition / catalog Command;typed ref Query;catalog read material refresh | core truth 写路径阻断异常;Query / view / material 降级异常 |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | core truth 写入阻断;external / body-free 边界 | formalization / version Command;basis summary intake / read | core truth 写路径阻断异常;external / inbound / body-free 边界异常 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | Query / material 降级;core truth-adjacent boundary block | consumption Command;availability Query;material refresh | core truth 写路径阻断异常;Query / view / material 降级异常 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | Query / material 降级;maintenance / reconciliation;collaboration hint | trace / impact / protection Command;trace read;refresh / recovery | Query / view / material 降级异常;maintenance / refresh / reconciliation 异常;publication / collaboration 异常 |
| 关系与分发语义 | `MethodAssetRelation`;`RelationIntegrityRule`;`DistributionReadMaterial`;distribution / handoff hint | core truth 写入阻断;Query / material 降级;publication / collaboration | relation Command;distribution read;handoff candidate / refresh | core truth 写路径阻断异常;publication / handoff / collaboration 异常;Query / view / material 降级异常 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalInboundIntakeFlow` | external / inbound / body-free 边界;Query / material 降级 | external summary Command;Inbound intake;ref resolution / validation | external / inbound / body-free 边界异常;Query / view / material 降级异常 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | maintenance / refresh / reconciliation | maintenance Command;8 个 Operations Job;progress Query | maintenance / refresh / reconciliation 异常 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;peripheral discovery view | peripheral isolation;Query / material 降级 | package / set Command;peripheral read / refresh | peripheral package / method set / discovery 异常;Query / view / material 降级异常 |

#### R1.6.4 排除清单定稿

以下内容在 Step 10 当前范围内排除:

| 排除项 | 定稿处理 |
|---|---|
| `MethodContentLifecycle` 旧异常主线 | 不继承;definition、formalization、consumption、trace、relation、external、maintenance、peripheral 必须分族讨论。 |
| `OutboxEventStatus` / relay / dead-letter | 不进入概要异常主线;当前 event 只作为 candidate,不定义 delivery 机制。 |
| snapshot export / fingerprint drift | 不作为异常主语;如需一致性提示,只能从 material freshness / unavailable 重新讨论。 |
| worker / scheduler / queue / retry / lock / cache | 后置到详细设计、配置设计或实施计划。 |
| governance execution / approval lifecycle | 不属于本仓;本仓只承接 body-free basis summary/ref。 |
| marketplace transaction / order / install / fulfillment | 不属于本仓;外围只保留 context/ref/discovery 语义。 |
| external document / artifact body lifecycle | 不属于本仓;只保留 summary/ref/boundary disposition。 |
| UI / console / SDK session state | 不属于方法资产业务异常主线。 |
| adapter private cache / fake runtime state | 不是设计真相源,不得进入异常候选池。 |

#### R1.6.5 后续异常族模块分配

候选池确认后,Step 10 后续按以下顺序推进:

| 顺序 | 后续模块 | 使用本候选池的方式 |
|---:|---|---|
| 1 | core truth 写路径阻断异常 | 使用 definition、catalog、formalization、formal version、relation、boundary truth-adjacent 主语。 |
| 2 | Query / view / material 降级异常 | 使用 catalog view、availability view、trace material、distribution material、external summary view、peripheral view 等读取主语。 |
| 3 | external / inbound / body-free 边界异常 | 使用 external summary、basis acceptance、artifact ref、body boundary、inbound intake 主语。 |
| 4 | publication / handoff / collaboration 异常 | 使用 event candidate、distribution / handoff hint、impact / collaboration hint 主语。 |
| 5 | maintenance / refresh / reconciliation 异常 | 使用 refresh task、recovery task、progress view 和 drift / recovery 主语。 |
| 6 | peripheral package / method set / discovery 异常 | 使用 package、method set、composition rule、discovery view 主语。 |

#### R1.6.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 owner 筛选规则 | pass | 已固定来源闭合、触发闭合、概要可见、非机制态和边界安全五条规则。 |
| 是否完成影响面分类 | pass | 已定稿六类影响面,后续逐族展开。 |
| 是否完成候选池 | pass | 已按八个主要组成部分列出异常主语候选、影响面、触发来源和后续模块。 |
| 是否排除旧异常主线 | pass | 已定稿排除 `MethodContentLifecycle`、outbox、snapshot、fingerprint、worker 和 marketplace 交易主线。 |
| 是否写异常总表正文 | no | 本模块只写候选池,未写正式异常总览表。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 候选池模块。 |

#### R1.6.7 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `core truth 写路径阻断异常:先思考`。

下一模块只允许回答:

1. 哪些写路径异常必须阻断 definition、formalization、relation 或 boundary truth 继续成立。
2. 哪些异常只允许 rejected / blocked / basis missing / illegal transition 等概要口径。
3. 哪些失败不得被 Query、Job、external intake 或 peripheral path 私补。

下一模块不得写:

- Query / view / material 降级异常正文
- external / inbound / body-free 边界异常正文
- publication / handoff / collaboration 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `core truth 写路径阻断异常:先思考`;只思考阻断写入主语、basis / boundary / illegal transition 族、不得越权继续的红线和后续排除项,不得写本仓异常与边界场景总表、异常影响图正文、状态影响清单正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.7 core truth 写路径阻断异常:先思考

#### R1.7.1 本模块问题

本模块只回答“哪些写路径异常必须在概要层先点名,否则会让 core truth、truth-adjacent boundary 或 formalization / relation 主线被错误继续”。它不直接写异常总览表、异常影响图、Query 降级正文或正式 §10 草稿。

本模块需要先想清楚的核心问题有四个:

1. 哪些主语一旦命中 basis 缺失、boundary 不满足、illegal transition 或 ref resolution 失败,必须阻断 definition、formalization、formal version、relation 或 boundary truth 继续成立。
2. 哪些失败只允许返回 rejected / blocked / pending basis / illegal transition 等概要口径,而不能靠 Query、Job、Inbound 或 peripheral path 私补。
3. 哪些失败只影响写路径成立边界,暂时不属于 Query / material 降级或 maintenance / collaboration 异常。
4. 哪些旧 publish / snapshot / outbox / fingerprint 异常主线必须继续排除。

#### R1.7.2 当前来源判断

当前 core truth 写路径阻断异常的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 主要组成部分边界 | 核心闭环由定义与目录、正式化与版本、受控消费、追溯与一致性保护构成;维护和外围不得改核心 truth。 | 判断哪些异常属于 core truth 写路径,哪些属于后续维护 / 外围边界。 |
| Step 6 关键对象 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` 等已成立。 | 锁定 truth / truth-adjacent blocking 主语。 |
| Step 8 处理流 | Command 只改写本仓 truth、summary、boundary、history hint;Query no-write;Job 不修 core truth;Inbound 只承接 body-free summary/ref。 | 固定“哪些路径能阻断写入、哪些路径不能私补写入”。 |
| Step 9 状态机 | Query no-write、Job 不修 core truth、外部缺失不回滚 truth、peripheral 不阻塞核心。 | 固定阻断后的状态边界和红线。 |
| governance Step 10 | Command 写路径异常应先点名 actor / metadata / idempotency 缺失、policy guard 不通过、expected current state 不匹配。 | 只借“阻断写入先点名”的框架,不复制治理裁决语义。 |

#### R1.7.3 写路径阻断异常主语范围

本模块先只锁定“必须阻断写入”的主语范围,不写正式异常表:

| 主语范围 | 当前判断 | 典型阻断原因 |
|---|---|---|
| `MethodAssetDefinition` | yes | definition basis 不足、typed ref / context 不成立、非法调整、试图把外部正文写入 definition。 |
| `MethodAssetCatalogEntry` | yes | catalog scope 不成立、definition ref 不可用、重分类越界、试图把 catalog truth 当读取修复结果写入。 |
| `FormalizationState` | yes | basis summary 缺失、formalization input 不闭合、非法推进、隐式正式化。 |
| `FormalMethodAssetVersion` | yes | formalization 未成立、basis 不足、version write 越权、非法退出 / 替换语境。 |
| `MethodAssetRelation` / `RelationIntegrityRule` | yes | relation endpoint 不成立、integrity 不满足、分发语义越界。 |
| `DownstreamConsumptionBoundary` / `DefinitionUseBoundaryGuard` | yes_as_truth_adjacent_gate | consumption context 不成立、definition-use guard 触发、boundary 不允许当前语境。 |
| `ExternalSourceSummary` / `ArtifactArchiveRef` | no_for_this_module | 更适合 external / inbound / body-free 边界异常。 |
| `ReadMaterialRefreshTask` / `ConsistencyRecoveryTask` | no_for_this_module | 更适合 maintenance / refresh / reconciliation 异常。 |
| `MethodPackage` / `MethodSetAssembly` | no_for_this_module | 更适合 peripheral isolation 异常。 |

#### R1.7.4 阻断异常族框架

core truth 写路径阻断异常在本仓当前更适合先按以下四族思考:

| 异常族 | 当前含义 | 典型主语 |
|---|---|---|
| basis 缺失 / 输入不闭合 | 成立 truth 所需 basis summary、typed ref、scope 或 prerequisite 不足。 | definition、formalization、formal version、relation。 |
| boundary / guard block | body-free、consumption boundary、definition-use guard、catalog scope 或 relation integrity 不允许继续。 | catalog entry、consumption boundary、relation integrity、definition-use guard。 |
| illegal transition / illegal advancement | 试图跨过当前允许的状态边界推进 truth。 | formalization state、formal version、definition / relation lifecycle。 |
| write-path overreach | 试图由 Query、Job、Inbound、external body 或 peripheral path 越权形成核心 truth。 | 所有 core truth / truth-adjacent gate 主语。 |

#### R1.7.5 触发来源与阻断红线

后续写入时必须把阻断异常和触发来源绑定,避免把“谁不能继续”写模糊:

| 触发来源 | 可触发的阻断异常 | 红线 |
|---|---|---|
| Command 写路径 | basis 缺失、boundary block、illegal transition、write-path overreach | 只有 Command 可以尝试成立这些 truth;命中阻断后不得写 accepted truth。 |
| Query 只读路径 | typed ref resolution failure 的读取表现 | Query 不能把 resolution failure 反写成 definition / formalization / relation 修复。 |
| Inbound / external intake | basis summary 不足、forbidden body、acceptance 未成立 | Inbound 不得直接创建 formal version、relation 或 package truth。 |
| Operations Job / refresh / recovery | 不适用为 truth 成立触发 | Job 不得把 refresh / recovery 结果写成 definition、formal version、relation 或 boundary truth。 |
| Peripheral path | 不适用为核心 truth 成立触发 | package / set / discovery 不可作为 definition、formalization、consumption boundary 的补口来源。 |

#### R1.7.6 不得越权继续的红线

本模块需要后续继续继承以下红线:

| 红线 | 当前口径 |
|---|---|
| Query no-write | Query 命中 typed ref / availability / visibility 问题时只能报告,不得顺手建立或修复 truth。 |
| Job 不修 core truth | refresh / recovery / reconciliation 只能写派生材料、progress 或 diagnostic,不得补 definition、formal version、relation 或 boundary truth。 |
| Inbound 只承接 body-free | external summary / basis accepted 到达不等于 formalization 通过或 version 成立。 |
| 外部缺失不回滚已成立 truth | 外部 basis 缺失只能阻断新写入或形成 unavailable / pending,不得回滚既有 truth。 |
| peripheral 不补核心 | package / set / discovery 上下文不能替代 definition / formalization / relation / consumption boundary 的成立条件。 |

#### R1.7.7 当前排除项

以下内容不在本模块展开:

| 排除项 | 原因 |
|---|---|
| Query / view / material stale / unavailable / partial | 属于下一族读取降级异常,不是写路径阻断正文。 |
| external / inbound / body-free 的全文边界 | 这一族会单独展开,当前只借其阻断写入的部分红线。 |
| publication / handoff / collaboration failure | 属于 truth 已成立之后的传播失败,不能和写路径阻断混写。 |
| maintenance / refresh / reconciliation drift | 属于 truth 已成立后的派生材料与收敛问题。 |
| snapshot export / outbox relay / fingerprint mismatch | 旧主线污染,当前继续排除。 |

#### R1.7.8 下一写入批次边界

下一批 `core truth 写路径阻断异常:再写入` 只允许写:

1. 阻断异常主语表。
2. basis / boundary / illegal transition / overreach 四族阻断异常表。
3. 写路径阻断红线表。
4. 后续需要交给 Query / external / maintenance 模块的分流记录。
5. 停审记录和下一模块边界。

不得写:

1. Query / view / material 降级异常正文。
2. external / inbound / body-free 边界异常正文。
3. publication / handoff / collaboration 异常正文。
4. maintenance / refresh / reconciliation 异常正文。
5. 异常影响图正文。
6. 正式 §10 回填草稿。
7. 正式 `02-概要设计.md`。

#### R1.7.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只锁定写路径阻断主语、异常族和红线。 |
| 是否写异常总表正文 | no | 未写正式异常总览表。 |
| 是否混入 Query / maintenance / peripheral 正文 | no | 这些只作为分流边界被点名。 |
| 是否恢复旧 publish / outbox / snapshot 主线 | no | 已继续排除旧主线污染。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 core truth 阻断模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `core truth 写路径阻断异常:再写入`;只写阻断异常主语表、basis / boundary / illegal transition / overreach 四族阻断异常表、写路径阻断红线表、分流记录和停审记录,不得写 Query / external / publication / maintenance 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.8 core truth 写路径阻断异常:再写入

#### R1.8.1 阻断异常主语表

本表只确定本族异常的核心主语和阻断关注点,不代替后续异常总览表。

| 阻断主语 | 主要写路径 | 典型阻断关注点 | 不允许继续 |
|---|---|---|---|
| `MethodAssetDefinition` | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition` | definition basis 不足、typed ref/context 不成立、试图写入外部正文 | 不得形成 accepted definition truth、event candidate 或 refresh hint 冒充成功事实。 |
| `MethodAssetCatalogEntry` | `RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry` | catalog scope 越界、definition ref 不可用、目录 truth 与 view 修复混写 | 不得在目录 truth 未成立时登记 / 重分类成功。 |
| `FormalizationState` | `EvaluateMethodAssetFormalization`;相关 formalization command | basis summary 缺失、formalization prerequisite 未闭合、隐式正式化 | 不得把 evaluation 缺口写成通过或继续推进 version 成立。 |
| `FormalMethodAssetVersion` | `EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`RetireFormalMethodAssetVersion` | formalization 未成立、basis 不足、版本推进越界 | 不得建立、变更或退出正式版本语境。 |
| `MethodAssetRelation` | `MethodAssetRelationLifecycleFlow` 相关 command | endpoint 不成立、relation basis 不足、relation truth 被读取面或外围上下文替代 | 不得形成 relation accepted truth。 |
| `RelationIntegrityRule` | `RelationIntegrityFlow` 相关 command | integrity check 不通过、分发语义越界 | 不得把 integrity failed 当作 relation 已成立后的可忽略告警。 |
| `DownstreamConsumptionBoundary` | `DownstreamConsumptionBoundaryFlow` | consumption context 不成立、boundary 不允许当前 use context | 不得让消费边界写路径继续 accepted。 |
| `DefinitionUseBoundaryGuard` | `DefinitionUseBoundaryViolationFlow` / boundary-related command | definition-use guard 触发、试图绕过受控消费边界 | 不得把 violation 记录成“已消费成功”的变体事实。 |

#### R1.8.2 basis 缺失 / 输入不闭合阻断异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| definition 建立 / 调整缺少必要 basis summary、typed ref 或合法 context | `MethodAssetDefinition` | command 被拒绝或保持原 truth;不得先落 truth 后补 basis。 |
| formalization 输入未闭合,缺少 basis summary、definition / catalog prerequisite 或 formalization prerequisite | `FormalizationState` | 只能返回 blocked / basis missing / pending basis surface;不得隐式通过 formalization。 |
| formal version 建立时 formalization 未成立或 version basis 不足 | `FormalMethodAssetVersion` | 不得创建正式版本 truth;版本成立必须显式阻断。 |
| relation 建立 / 调整缺少 endpoint、basis 或 distribution context | `MethodAssetRelation` | 不得形成 relation accepted truth;后续如需补 basis,由新的合法写路径重试。 |
| consumption boundary 建立缺少 use context、definition ref 或 boundary prerequisite | `DownstreamConsumptionBoundary` | 不得 accepted boundary truth;只能 rejected / blocked。 |

#### R1.8.3 boundary / guard block 阻断异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| catalog registration / reclassification 越过 catalog scope 或目录适用语境 | `MethodAssetCatalogEntry` | catalog truth 保持原状态;不得把 scope 错误降级成 view stale。 |
| consumption use context 触发 boundary disallow | `DownstreamConsumptionBoundary` | command 被阻断;不得以“先 accepted 后标不可用”的方式绕过边界。 |
| definition-use guard 触发 violation | `DefinitionUseBoundaryGuard` | 只能形成 blocked / violation summary;不得继续写消费成功事实。 |
| relation integrity rule 不满足 | `RelationIntegrityRule` | relation / distribution truth 不得继续推进;不能把 integrity failure 当成后置修复提示。 |
| body-free / safe summary 边界被触碰并企图直接进入 core truth 写路径 | `MethodAssetDefinition`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation` | 写路径必须拒绝;外部正文和 unsafe body 不得穿透到核心 truth。 |

#### R1.8.4 illegal transition / illegal advancement 阻断异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| 未经过合法 formalization 评估就直接建立 formal version | `FormalMethodAssetVersion` | 视为 illegal advancement;不得 accepted。 |
| formalization 尚未满足 prerequisite 就推进到可消费 / 可版本化语境 | `FormalizationState` | 视为 illegal transition;保持原状态或 blocked surface。 |
| relation / definition / catalog 试图跨过当前允许语境直接进入下一阶段 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetRelation` | 不得私自跨状态;概要层只要求阻断,详细设计再定义并发或状态错误码。 |
| boundary truth 在 prerequisite 未满足时被写成“已允许” | `DownstreamConsumptionBoundary` | 视为 illegal advancement;不得 accepted。 |

#### R1.8.5 write-path overreach 阻断异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| Query 命中 typed ref / availability / visibility 问题后顺手建立或修复 truth | 所有 core truth / boundary 主语 | 明确禁止;Query 只能报告,不得补写 truth。 |
| Operations Job / refresh / recovery 试图修 definition、formal version、relation 或 boundary truth | 所有 core truth / boundary 主语 | 明确禁止;Job 只刷新派生材料、progress 或 diagnostic。 |
| Inbound intake 到达 body-free summary/ref 后直接视为 formalization 通过、version 成立或 relation 成立 | `FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation` | 明确禁止;Inbound 只能形成 summary/ref/marker linkage。 |
| peripheral package / set / discovery path 反向补核心 prerequisite | `MethodAssetDefinition`;`FormalizationState`;`FormalMethodAssetVersion`;`DownstreamConsumptionBoundary` | 明确禁止;外围上下文不能替代核心成立条件。 |
| accepted truth 尚未闭合却提前写 trace / event candidate / refresh hint 冒充成功事实 | 所有 core truth 写路径 | 明确禁止;truth、history hint、candidate 必须以同一 accepted boundary 为前提。 |

#### R1.8.6 写路径阻断红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| Query no-write | 所有 core truth / boundary 主语 | Query 只能读取 summary、view、material、diagnostic 或 safe absence,不得创建或修复 truth。 |
| Job 不修 core truth | definition、formal version、relation、boundary truth | refresh / recovery / reconciliation 只能写派生材料、progress 或 diagnostic。 |
| Inbound 只承接 body-free | formalization、version、relation、external basis 相关写路径 | body-free summary/ref 到达不等于核心 truth 成立。 |
| basis 缺失先阻断 | definition、formalization、version、relation、boundary | basis 不足时只能 blocked / rejected / pending basis,不得先 accepted 再补 basis。 |
| boundary 不满足先阻断 | catalog scope、consumption boundary、definition-use guard、relation integrity | boundary / guard failure 不能降级成可忽略 warning。 |
| 外部缺失不回滚既有 truth | 所有已成立 truth | 外部 basis / ref 缺失只能阻断新写入或形成 unavailable / pending,不得回滚旧 truth。 |
| peripheral 不补核心 | package、set、discovery 与核心写路径接缝 | 外围增强不能成为 definition / formalization / relation / consumption boundary 的补口来源。 |

#### R1.8.7 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| typed ref resolution failure 的读取表现 | Query / view / material 降级异常 | 当前只保留其不得反写 truth 的阻断红线。 |
| forbidden body / unsafe external summary 的完整承接边界 | external / inbound / body-free 边界异常 | 当前只讨论其阻断 core truth 写路径的部分。 |
| candidate 已产生后的 handoff / downstream collaboration failure | publication / handoff / collaboration 异常 | 属于 truth 已成立后的传播失败。 |
| refresh blocked / recovery stalled / drift detected | maintenance / refresh / reconciliation 异常 | 属于 truth 已成立后的派生材料与收敛问题。 |
| package / method set / discovery unavailable | peripheral package / method set / discovery 异常 | 当前只保留“不得反向补核心 prerequisite”的红线。 |

#### R1.8.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成阻断主语表 | pass | 已固定 definition、catalog、formalization、formal version、relation、boundary / guard 主语。 |
| 是否完成四族阻断异常表 | pass | 已定稿 basis、boundary、illegal transition、overreach 四族。 |
| 是否完成写路径红线 | pass | 已明确 Query no-write、Job 不修 truth、Inbound body-free、basis / boundary 先阻断等红线。 |
| 是否完成分流记录 | pass | 已把 Query / external / publication / maintenance / peripheral 异常分流到后续模块。 |
| 是否写其他异常族正文 | no | 未写 Query / external / publication / maintenance 正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 异常族模块。 |

#### R1.8.9 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `Query / view / material 降级异常:先思考`。

下一模块只允许回答:

1. 哪些读取主语会产生 stale / unavailable / partial / not visible / degraded surface。
2. 哪些降级只影响读取面,不得反写 truth。
3. 哪些降级需要与 external / maintenance / peripheral 模块分流。

下一模块不得写:

- external / inbound / body-free 边界异常正文
- publication / handoff / collaboration 异常正文
- maintenance / refresh / reconciliation 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `Query / view / material 降级异常:先思考`;只思考读取降级主语、stale / unavailable / partial / not visible / degraded 分类、不得反写 truth 的红线和后续分流项,不得写 external / publication / maintenance 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.9 Query / view / material 降级异常:先思考

#### R1.9.1 本模块必读文档

本模块先读以下输入,只借 `L1-governance` 的结构深度,不得复制治理语义:

| 文档 | 本模块用途 | 当前用法 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md#R1.6~R1.8` | 继承异常 owner 候选池、写路径阻断红线和后续分流边界。 | read |
| `design-calibration/02_hld_step_09_state_machine.md` | 回指当前 view / material / availability / progress 状态 owner 和 `Query no-write` 红线。 | read |
| `design-calibration/02_hld_step_08_processing_flows.md` | 回指 Query 只读骨架、读取来源、not found / stale / unavailable / unknown 只读返回面。 | read |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 回指各组成部分 Query API、读取主语和禁止事项。 | read |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考 Step 10 异常模块编排深度和“先按异常族收稳边界、再写总表”的框架。 | structure_only |
| 正式 `projects/L3-method-library/02-概要设计.md` §5~§9 | 只核对当前正式主链已回填的组成部分、接口、处理流和状态边界。 | read |

#### R1.9.2 本模块问题

本模块只回答“哪些 Query / view / material 失败必须在概要层先点名,否则读取面会错误越权、错误补口或错误反写 truth”。它不直接写异常总览表、异常影响图、external / maintenance / publication 正文或正式 §10 草稿。

本模块需要先想清楚的核心问题有五个:

1. 哪些读取主语会出现 `stale / unavailable / partial / not visible / degraded` surface,且这些 surface 只影响读取面。
2. 哪些降级来自 view / material freshness 落后、external summary / ref 不可用、trace / audit / lineage 不完整、boundary / guard 限制或 peripheral unavailable。
3. 哪些读取失败只能返回 safe absence、freshness marker、diagnostic hint 或 safe degraded surface,不得顺手修 truth、补 ref、刷新 material 或启动 job。
4. 哪些降级属于当前 Query / view / material 异常主线,哪些应分流给 external / inbound、maintenance / recovery、peripheral isolation 或 publication / handoff 模块。
5. 哪些旧 snapshot / fingerprint / outbox / publish 主线必须继续排除,避免把读取降级重写成旧同步机制故障。

#### R1.9.3 当前来源判断

当前 Query / view / material 降级异常的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 主要组成部分边界 | 读取面分散在定义目录、正式化版本、受控消费、追溯保护、关系分发、外部摘要、维护进度和外围组织;它们都不是第二 truth。 | 判断哪些异常属于读取降级,哪些属于外部承接、维护收敛或外围隔离。 |
| Step 6 关键对象 | `MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`MethodAssetTraceMaterial`、`MethodAssetAuditTrail`、`DistributionReadMaterial`、`ExternalSourceSummary`、`MaintenanceProgressView` 等 owner 已成立。 | 锁定 Query / view / material 异常主语。 |
| Step 7 Query API 骨架 | Query 只读取 summary、view、material、availability、diagnostic、history、lineage 或 progress,不得 repair truth、刷新 material、补写外部摘要或创建对象。 | 固定“哪些 surface 可降级,哪些动作不能发生”。 |
| Step 8 Query 只读骨架 | `found -> safe summary`;`not found / stale / unavailable / unknown -> safe absence / freshness marker / diagnostic hint` 已固定。 | 固定读取降级时的概要输出形态。 |
| Step 9 状态机 | freshness / availability / pending convergence / partial completeness 只属于 view / material / progress 层,不得反写 truth;`Query no-write` 已固定。 | 固定 stale / unavailable / partial / degraded 的状态边界和传播红线。 |
| governance Step 10 框架 | Query 异常应先点名读取主语、降级分类、状态影响和不得越权修复的边界。 | 只借模块组织方式,不复制治理 query、projection、handoff 语义。 |

#### R1.9.4 读取降级主语范围

本模块先只锁定“会产生读取降级”的主语范围,不写正式异常总表:

| 读取主语范围 | 当前判断 | 典型降级形态 |
|---|---|---|
| `MethodAssetCatalogView`;definition / catalog safe summary | yes | catalog view stale / unavailable、definition ref resolution safe absence、目录页 partial。 |
| `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` 读取面 | yes_as_read_surface | basis stale / insufficient / rejected surface、version read unavailable、formalization status degraded。 |
| `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` diagnostic | yes | material stale / blocked / unavailable、availability stale / unavailable / pending convergence、boundary-limited not available。 |
| `MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetAuditTrail` | yes | trace stale / incomplete / unavailable、impact partial、audit partial / stale / unavailable。 |
| `MethodAssetRelation` read surface;`DistributionReadMaterial`;relation integrity read | yes_as_read_surface | relation view stale、distribution unavailable、integrity diagnostic degraded。 |
| `ExternalSourceSummary`;`ArtifactArchiveRef`;external acceptance / lineage read surface | yes | external summary stale / unavailable、artifact ref unresolved、body boundary diagnostic degraded。 |
| `MaintenanceProgressView` | yes_limited | progress view unavailable / stale / partial,但 task / recovery 本体异常后置到 maintenance 模块。 |
| `MethodPackage`;`MethodSetAssembly`;peripheral discovery / package / set view` | yes_as_peripheral_read | package / set view unavailable、composition partial、discovery degraded。 |
| publication candidate / handoff report | no_for_this_module | 更适合 publication / handoff / collaboration 异常。 |
| refresh task / recovery convergence 本体 | no_for_this_module | 更适合 maintenance / refresh / reconciliation 异常。 |

#### R1.9.5 降级分类框架

Query / view / material 降级异常在本仓当前更适合先按以下五类思考:

| 降级分类 | 当前含义 | 典型主语 |
|---|---|---|
| stale / freshness lag | 来源 truth 已变化或外部摘要语境已变化,view / material / summary 仍落后。 | catalog view、availability view、trace material、distribution material、external summary view、peripheral view。 |
| unavailable / missing read surface | 读取材料、safe summary、ref 或 progress 当前不可读、缺失或 unresolved。 | basis summary、consumption material、artifact archive ref、maintenance progress、package / set view。 |
| partial / incomplete | 读取面只具备安全子集,trace / audit / lineage / impact / page 列表不完整。 | trace material、audit trail、impact view、catalog page、peripheral discovery page。 |
| not visible / context-limited | 当前 actor、scope、boundary 或 use context 只允许返回受限 / 不可见 / 不可用 surface。 | availability view、boundary diagnostic、catalog scope、external acceptance scope、peripheral discovery scope。 |
| degraded / diagnostic fallback | 读取面无法给出 current safe material,但必须返回安全诊断、freshness marker 或 safe absence。 | formalization read、relation integrity read、external summary read、maintenance progress read。 |

#### R1.9.6 触发来源与读取红线

后续写入时必须把读取降级和触发来源绑定,避免把“谁只能报告”写模糊:

| 触发来源 | 可触发的读取降级 | 红线 |
|---|---|---|
| Query selector / typed ref resolution | safe absence、unavailable、degraded diagnostic、not visible。 | Query 不能因为 ref miss 去注册 ref、建 truth、修 view 或补外部 summary。 |
| 已成立 truth 后的 read material lag | stale、pending convergence、partial freshness。 | Query 只能暴露 freshness / diagnostic,不得自行 refresh material 或修改 truth。 |
| external summary / artifact ref / lineage 不可用 | unavailable、partial、degraded。 | Query 不得拉取外部正文、archive 包、证据正文或对象存储路径补口。 |
| trace / audit / impact / relation read completeness 不足 | partial、degraded、safe absence。 | Query 不得补造 trace、audit、impact summary、relation 或 distribution truth。 |
| boundary / guard / scope / visibility 限制 | not visible、not available、scope-limited degraded。 | Query 不得把 boundary failure 改写成 truth 调整、消费放开或 relation 激活。 |
| maintenance progress 尚未收敛 | stale、pending convergence、progress unavailable。 | Query 只能暴露 progress / hint,不得启动 job、重试 worker 或伪造“已收敛”。 |
| peripheral package / set / discovery 不可用 | unavailable、partial、degraded。 | peripheral 降级不得反向阻断 definition、formalization、version、relation 或 consumption truth。 |

#### R1.9.7 当前排除项

以下内容不在本模块展开:

| 排除项 | 原因 |
|---|---|
| external / inbound / body-free 正文边界全文 | 属于下一族 external / inbound / body-free 边界异常,当前只借其 unavailable / rejected 读取表现。 |
| publication / handoff / collaboration failure | 属于 truth 已成立后的传播失败,不是 Query / material 降级正文。 |
| maintenance task / recovery / refresh job 本体异常 | 属于 maintenance / refresh / reconciliation 异常,当前只读取 progress / freshness surface。 |
| core truth rejected / blocked / illegal transition | 已由 `R1.7` / `R1.8` 承接,当前不重写写路径阻断。 |
| snapshot export / fingerprint drift / outbox relay | 旧主线污染,当前继续排除。 |
| cache、worker、queue、retry、search index 或 console UI 状态 | 属于实现 / 运维 / 展现细节,不属于概要读取降级主线。 |

#### R1.9.8 下一写入批次边界

下一批 `Query / view / material 降级异常:再写入` 只允许写:

1. 读取降级主语表。
2. stale / unavailable / partial / not visible / degraded 五类降级异常表。
3. Query no-write、不得拉正文、不得启动 job、不得补 trace / relation / truth 的读取红线表。
4. 交给 external / maintenance / peripheral / publication 模块的分流记录。
5. 停审记录和下一模块边界。

不得写:

1. external / inbound / body-free 边界异常正文。
2. publication / handoff / collaboration 异常正文。
3. maintenance / refresh / reconciliation 异常正文。
4. 异常影响图正文。
5. 正式 §10 回填草稿。
6. 正式 `02-概要设计.md`。

#### R1.9.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只锁定读取降级主语、分类框架、触发来源和红线。 |
| 是否写异常总表正文 | no | 未写正式读取降级异常总览表。 |
| 是否混入 external / maintenance / publication 正文 | no | 这些只作为分流边界被点名。 |
| 是否恢复旧 snapshot / fingerprint / outbox 主线 | no | 已继续排除旧主线污染。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 Query / view / material 模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `Query / view / material 降级异常:再写入`;只写读取降级主语表、stale / unavailable / partial / not visible / degraded 五类降级异常表、读取红线表、分流记录和停审记录,不得写 external / publication / maintenance 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.10 Query / view / material 降级异常:再写入

#### R1.10.1 读取降级主语表

本表只确定本族异常的读取主语和降级关注点,不代替后续异常总览表。

| 读取主语 | 主要读取入口 | 典型降级关注点 | 不允许继续 |
|---|---|---|---|
| `MethodAssetCatalogView`;definition / catalog safe summary | `ListMethodAssetCatalog`;`GetMethodAssetCatalogEntryView`;`GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef` | catalog view stale / unavailable、definition ref safe absence、目录页 partial | 不得在 Query 中登记 catalog entry、修 catalog truth 或刷新 view。 |
| `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` 读取面 | `GetFormalizationState`;`GetFormalMethodAssetVersion`;`ListConsumableFormalVersions`;`GetFormalizationBasisSummary` | basis stale / insufficient / rejected、formal version unavailable、formalization degraded diagnostic | 不得隐式推进 formalization、创建 formal version 或补 basis summary。 |
| `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` diagnostic | `GetMethodAssetConsumptionMaterial`;`ResolveConsumptionMaterialForVersion`;`GetMethodAssetAvailability`;`GetDownstreamConsumptionBoundary` | material stale / blocked / unavailable、availability pending convergence / stale / unavailable、scope-limited not available | 不得放开 boundary、补材料、扩大 use context 或声明“已可消费”。 |
| `MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetAuditTrail` | `GetMethodAssetTraceMaterial`;`ListConsumptionImpactSummaries`;`GetMethodAssetAuditTrail`;相关 trace / impact Query | trace stale / incomplete / unavailable、impact partial、audit partial / stale / unavailable | 不得补造 trace、impact summary、audit trail 或 evidence lineage。 |
| `MethodAssetRelation` read surface;`DistributionReadMaterial`;relation integrity read | `GetMethodAssetRelation`;`ListMethodAssetRelations`;`GetMethodAssetDistributionRef`;`CheckRelationIntegrity` | relation view stale、distribution unavailable、integrity degraded diagnostic | 不得激活 relation、重建 distribution ref 或调整 integrity rule。 |
| `ExternalSourceSummary`;`ArtifactArchiveRef`;external acceptance / lineage read surface | external summary / ref / artifact read Queries | external summary stale / unavailable、artifact ref unresolved、lineage partial、boundary diagnostic degraded | 不得拉外部正文、archive 包、evidence body 或对象存储路径补口。 |
| `MaintenanceProgressView` | maintenance progress / diagnostic Query | progress stale / unavailable / partial、pending convergence hint | 不得启动 refresh / recovery job、伪造已收敛状态或隐藏未完成维护。 |
| `MethodPackage`;`MethodSetAssembly`;peripheral discovery / package / set view | package / set / peripheral read Queries | package / set view unavailable、composition partial、discovery degraded | 不得以外围读取降级反向阻断 core truth 或补核心 prerequisite。 |

#### R1.10.2 stale / freshness lag 降级异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| definition / catalog truth 已调整,但 `MethodAssetCatalogView` 尚未收敛 | `MethodAssetCatalogView` | Query 只能返回 stale / freshness marker 或 safe catalog summary,不得刷新 view 或修改 catalog truth。 |
| formal version、boundary 或 context 已变化,但 availability / consumption material 仍落后 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView` | 只能返回 stale / pending convergence surface;不得把旧材料伪装成当前可消费事实。 |
| trace / impact / audit 来源已变化,但 trace material / impact view / audit read material 未同步 | `MethodAssetTraceMaterial`;`ConsumptionImpactView`;`MethodAssetAuditTrail` | 只能返回 stale / incomplete surface 和 safe hint;不得补写 trace 或 audit。 |
| relation / distribution 来源 truth 已变化,但 distribution read material 或 relation view 未刷新 | `MethodAssetRelation` read surface;`DistributionReadMaterial` | 只能暴露 stale / freshness lag,不得在 Query 中重建 relation 或 distribution ref。 |
| external source context 已变化,但 external summary / artifact read surface 仍落后 | `ExternalSourceSummary`;`ArtifactArchiveRef` | 只能返回 stale / recheck needed surface;不得重新抓取外部正文。 |
| package / method set 组合或 core refs 已变化,但 peripheral discovery view 未收敛 | peripheral package / set / discovery view | 只能返回 degraded / stale peripheral surface;不得反写 core definition、formal version 或 relation。 |

#### R1.10.3 unavailable / missing read surface 降级异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| typed ref resolution miss、definition safe summary 缺失或 catalog read surface 当前不可读 | `MethodAssetCatalogView`;definition / catalog safe summary | 只能返回 safe absence / unavailable;不得自动建 ref、建 definition 或补 catalog entry。 |
| basis summary 当前缺失、formal version read surface 不可读、formalization state 无法安全返回 | `FormalizationBasisSummary`;`FormalMethodAssetVersion`;`FormalizationState` | 只能返回 unavailable / insufficient / rejected read surface;不得隐式通过 formalization。 |
| consumption material 缺失、availability view 缺失或 boundary diagnostic 当前不可读 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` | 只能返回 unavailable / not available / pending convergence;不得临时造 material 或放宽 boundary。 |
| trace material、impact summary page、audit trail page 当前缺失或不可读 | `MethodAssetTraceMaterial`;`ConsumptionImpactView`;`MethodAssetAuditTrail` | 只能返回 unavailable / safe absence;不得即时扫下游系统或补造审计线索。 |
| distribution read material 或 external artifact ref unresolved / missing | `DistributionReadMaterial`;`ArtifactArchiveRef` | 只能返回 unavailable / unresolved surface;不得访问 archive 正文或 provider payload。 |
| maintenance progress read surface 暂不可用 | `MaintenanceProgressView` | 只能返回 progress unavailable / unknown;不得假设维护已完成。 |
| package / set view 或 peripheral discovery page 当前缺失 | peripheral package / set / discovery view | 只能返回 unavailable / safe absence;不得因此宣告核心对象不存在。 |

#### R1.10.4 partial / incomplete 降级异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| catalog page 只有部分条目可安全返回,其余条目处于 safe absence / context-limited | `MethodAssetCatalogView` page | 允许返回 partial page,但必须显式保留 safe partial 语义;不得补齐不可见或缺失项。 |
| trace material 缺少部分 lineage / evidence marker / subject linkage | `MethodAssetTraceMaterial`;`MethodAssetTraceView` | 只能返回 incomplete / partial trace surface;不得编造 lineage 或 evidence body。 |
| impact summary 只具备安全子集,无法得出完整 downstream impact | `ConsumptionImpactView`;`ConsumptionImpactSummary` read surface | 只能返回 partial impact surface;不得扫描下游运行 truth 补齐。 |
| audit trail 只有安全条目子集或部分追溯线索不可读 | `MethodAssetAuditTrail` | 只能返回 partial / stale audit surface;不得回填 raw audit log。 |
| external acceptance / lineage 只有部分 ref / marker 可安全返回 | `ExternalSourceSummary`;external lineage read surface | 只能返回 partial external surface;不得抓取正文或 archive。 |
| package / set composition 或 discovery list 只有部分结果可安全表达 | peripheral package / set / discovery view | 只能返回 partial peripheral surface;不得把未展开部分伪装为完整 discoverability。 |

#### R1.10.5 not visible / context-limited 降级异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| actor / scope 只允许安全目录或定义读取子集 | definition / catalog safe summary;`MethodAssetCatalogView` | 返回 not visible / scope-limited surface;不得泄露 full summary、存在性细节或目录全量。 |
| 当前 consumption context 不满足 boundary / guard,只能返回受限读取结果 | `MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`MethodAssetConsumptionMaterial` | 返回 not available for context / blocked / scope-limited surface;不得放开 use context。 |
| trace / audit / impact 读取只允许安全摘要,不允许暴露 full lineage | `MethodAssetTraceMaterial`;`MethodAssetAuditTrail`;`ConsumptionImpactView` | 返回 redacted / limited trace surface;不得泄露 evidence、raw log 或下游运行细节。 |
| external acceptance scope 或 body boundary 限制当前读取语境 | `ExternalSourceSummary`;external acceptance diagnostic | 返回 safe boundary-limited / not visible surface;不得透传外部正文。 |
| peripheral discovery 只允许部分 audience / context 可见 | peripheral discovery / package / set view | 返回 context-limited discovery surface;不得把不可见外围项当作核心 truth 缺失。 |

#### R1.10.6 degraded / diagnostic fallback 降级异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| formalization / basis / version 读取无法形成 current safe material,但需要给出安全诊断 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | 只能返回 degraded / diagnostic hint / safe reason ref,不得隐式补 basis 或推进状态。 |
| relation integrity 读取只能返回安全判断摘要,无法给出完整 relation material | relation integrity read;`DistributionReadMaterial` | 只能返回 degraded integrity diagnostic;不得激活 relation 或补 distribution truth。 |
| external summary / artifact / lineage 只能返回安全提示,无法给出 current readable summary | `ExternalSourceSummary`;`ArtifactArchiveRef`;external lineage read surface | 只能返回 degraded external diagnostic;不得抓取外部正文或 archive。 |
| maintenance progress 暂时只有 safe hint,无法给出完整 progress view | `MaintenanceProgressView` | 只能返回 degraded / pending convergence / unknown progress;不得伪造已收敛结果。 |
| peripheral discovery 只能返回 safe fallback,无法给出完整 package / set 可见面 | peripheral package / set / discovery view | 只能返回 degraded peripheral surface;不得将外围缺失解释为核心对象非法。 |

#### R1.10.7 读取降级红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| Query no-write | 所有读取降级主语 | Query 只能读取 summary、view、material、availability、diagnostic、history、lineage、progress 或 safe absence,不得创建、刷新或修复 truth。 |
| 不得拉正文补口 | external summary、artifact archive、evidence lineage、trace / audit 相关读取面 | Query 不得拉外部正文、archive 包、证据正文、provider payload 或对象存储路径。 |
| 不得启动 job / retry | maintenance progress、stale / pending convergence 读取面 | Query 只能暴露 progress / hint,不得启动 refresh / recovery、重试 worker 或伪造收敛结果。 |
| 不得补 trace / impact / audit / relation | trace、impact、audit、relation、distribution 读取面 | partial / degraded 只可安全表达,不得补造 trace、impact summary、audit trail、relation 或 distribution truth。 |
| 不得因读取降级反写 truth | definition、formalization、formal version、boundary、relation、package 等来源 truth | stale / unavailable / not visible 只影响读取面,不得把来源 truth 改写为 rejected / retired / unavailable。 |
| boundary / scope 不得被 Query 绕过 | consumption boundary、definition-use guard、catalog scope、external boundary、peripheral audience | not visible / not available 只能受限返回,不得在 Query 中放开 boundary。 |
| peripheral 不反向阻断核心 | package / set / discovery 读取面 | 外围 unavailable / partial 只能影响外围读取,不得反向否定 definition、formalization、version、relation 或 consumption truth。 |

#### R1.10.8 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| external summary rejected、body boundary violation、artifact / archive 承接失败的完整边界 | external / inbound / body-free 边界异常 | 当前只写这些失败在 Query 面呈现出的 unavailable / degraded。 |
| maintenance task blocked、refresh failed、recovery stalled 的任务 / 收敛主线 | maintenance / refresh / reconciliation 异常 | 当前只读取 progress / freshness / pending convergence surface。 |
| package / set / composition / discovery 失效的外围隔离主线 | peripheral package / method set / discovery 异常 | 当前只保留其读取 unavailable / partial / degraded 表现。 |
| candidate 已产生后的 export / handoff / downstream collaboration 失败 | publication / handoff / collaboration 异常 | 当前只处理 Query 可见面,不处理传播失败主线。 |
| external body / unsafe body / raw payload 的承接拒绝机制 | external / inbound / body-free 边界异常 | 当前不讨论 Inbound owner、body boundary rule 和拒绝处置流。 |

#### R1.10.9 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成读取降级主语表 | pass | 已固定目录、正式化版本、消费、追溯、关系、外部、维护进度和外围读取主语。 |
| 是否完成五类降级异常表 | pass | 已定稿 stale、unavailable、partial、not visible、degraded 五类。 |
| 是否完成读取红线 | pass | 已明确 Query no-write、不得拉正文、不得启动 job、不得补 trace / relation / truth 等红线。 |
| 是否完成分流记录 | pass | 已把 external、maintenance、peripheral、publication 异常分流到后续模块。 |
| 是否写其他异常族正文 | no | 未写 external / maintenance / publication 正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 Query / view / material 模块。 |

#### R1.10.10 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `external / inbound / body-free 边界异常:先思考`。

下一模块只允许回答:

1. 哪些 external summary / ref / artifact / intake 失败必须按 body-free 边界单独点名。
2. 哪些失败属于 intake rejected / unresolved ref / forbidden body / acceptance pending。
3. 哪些 external 失败只影响承接边界,不得直接成立 core truth 或回滚既有 truth。

下一模块不得写:

- publication / handoff / collaboration 异常正文
- maintenance / refresh / reconciliation 异常正文
- peripheral package / method set / discovery 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `external / inbound / body-free 边界异常:先思考`;只思考 body-free 承接主语、intake rejected / unresolved ref / forbidden body / acceptance pending 分类、不得直接成立 core truth 的红线和后续分流项,不得写 publication / maintenance / peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.11 external / inbound / body-free 边界异常:先思考

#### R1.11.1 本模块必读文档

本模块先读以下输入,只借 `L1-governance` 的结构深度,不得复制治理语义:

| 文档 | 本模块用途 | 当前用法 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md#R1.6~R1.10` | 继承异常 owner 候选池、写路径阻断红线、Query 降级分流边界。 | read |
| `design-calibration/02_hld_step_09_state_machine.md` | 回指 external summary、acceptance history、artifact/archive ref、body boundary disposition 和“外部缺失不回滚 truth”红线。 | read |
| `design-calibration/02_hld_step_08_processing_flows.md` | 回指 external summary lifecycle、artifact ref flow、body boundary flow、external inbound intake 和 Query no-write / Inbound no truth 的处理边界。 | read |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 回指唯一 Inbound owner、body-free consumer 总表、external Query / Command 骨架和禁止事项。 | read |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考 Step 10 异常模块编排深度和“先按异常族收稳边界、再写总表”的框架。 | structure_only |
| 正式 `projects/L3-method-library/02-概要设计.md` §5~§9 | 只核对当前正式主链已回填的 external / inbound / body-free 边界前提。 | read |

#### R1.11.2 本模块问题

本模块只回答“哪些 external / inbound / body-free 失败必须在概要层先点名,否则本仓会错误承接外部正文、错误扩大 inbound owner 或错误把外部线索写成 core truth”。它不直接写异常总览表、异常影响图、publication / maintenance / peripheral 正文或正式 §10 草稿。

本模块需要先想清楚的核心问题有五个:

1. 哪些承接主语会命中 `intake rejected / unresolved ref / forbidden body / acceptance pending` 四类边界异常。
2. 哪些失败发生在唯一 Inbound owner `外部摘要与引用` 内部,哪些只允许以 summary / ref / digest hint / marker / safe reason ref 表达。
3. 哪些 external 失败只能阻断 summary / ref / acceptance / lineage 承接,不得直接建立 definition、formalization、formal version、relation、package 或 maintenance truth。
4. 哪些外部不可用或边界拒绝只影响承接边界或读取面,不得回滚既有 truth,也不得触发 Query / Job 私补。
5. 哪些旧 webhook payload、governance gate consumer、snapshot export、artifact body / archive body 主线必须继续排除。

#### R1.11.3 当前来源判断

当前 external / inbound / body-free 边界异常的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 主要组成部分边界 | `外部摘要与引用` 是本仓唯一 Inbound owner,只承接 body-free summary / ref / artifact / violation 事实。 | 判断哪些异常属于 external 边界,哪些应后置到 publication / maintenance / peripheral。 |
| Step 6 关键对象 | `ExternalSourceSummary`、`ExternalBasisAcceptanceHistory`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、external evidence lineage owner 已成立。 | 锁定承接边界异常主语。 |
| Step 7 Inbound / Query / Command 骨架 | Inbound 只接收 safe summary、typed ref、digest hint、marker、safe reason ref;不接收 raw body、artifact 包体、provider payload 或治理执行正文。 | 固定“哪些输入允许进入、哪些输入必须拒绝”。 |
| Step 8 external 处理流 | `ExternalSourceSummaryLifecycleFlow`、`ExternalSourceArtifactRefFlow`、`ExternalBodyBoundaryFlow`、`ExternalInboundIntakeFlow` 已固定;Inbound 只形成 intake summary / handoff hint,不得直接建立 core truth。 | 固定 intake rejected / unresolved ref / forbidden body / acceptance pending 的处理位置。 |
| Step 9 external 状态机 | external summary acceptance、artifact/archive ref validity、body boundary disposition、summary view freshness、basis accepted / rejected 已固定;外部缺失不回滚 truth 已固定。 | 固定 external 异常的状态边界和传播红线。 |
| governance Step 10 框架 | 外部 / inbound 异常应先点名 owner、body boundary、reference resolution、pending acceptance 和 no direct truth 的红线。 | 只借模块组织方式,不复制 governance gate、projection、handoff 语义。 |

#### R1.11.4 承接边界主语范围

本模块先只锁定“会命中 external / inbound / body-free 边界异常”的主语范围,不写正式异常总表:

| 承接边界主语范围 | 当前判断 | 典型边界异常 |
|---|---|---|
| `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | yes | summary intake rejected、acceptance pending、summary stale / superseded、safe basis insufficient。 |
| `ExternalSourceRef`;`ArtifactArchiveRef` | yes | unresolved ref、invalid / duplicate ref、archive ref unavailable、digest hint 不闭合。 |
| `ExternalBodyBoundaryRule` | yes | forbidden body、unsafe payload、body boundary violation noticed、candidate rejected。 |
| `ExternalInboundIntake` / body-free consumer result | yes_as_intake_surface | schema accepted but summary rejected、dedup / ignored、intake rejected、safe intake pending。 |
| external evidence lineage / trace handoff hints | yes_limited | lineage link pending、safe marker missing、body candidate rejected。 |
| basis summary into formalization read surface | yes_as_downstream_boundary | basis accepted pending、insufficient / rejected basis 只可作为输入边界结果。 |
| external summary read / diagnostic surface | no_for_this_module_as_primary | 读取面 degraded 已由 Query 模块点名;本模块只讨论其承接根因。 |
| downstream collaboration / export / handoff result | no_for_this_module | 更适合 publication / handoff / collaboration 异常。 |
| refresh / reconciliation / external recheck job 本体 | no_for_this_module | 更适合 maintenance / refresh / reconciliation 异常。 |

#### R1.11.5 边界异常分类框架

external / inbound / body-free 边界异常在本仓当前更适合先按以下四类思考:

| 异常分类 | 当前含义 | 典型主语 |
|---|---|---|
| intake rejected | inbound envelope、summary candidate、artifact ref candidate 或 violation candidate 虽到达,但不满足本仓安全承接边界。 | `ExternalSourceSummary`;body-free consumer result;`ExternalBodyBoundaryRule`。 |
| unresolved ref / invalid reference | external source ref、artifact/archive ref、digest hint、lineage ref 缺失、不可解析、重复或不合法。 | `ExternalSourceRef`;`ArtifactArchiveRef`;external lineage hint。 |
| forbidden body / unsafe payload | 到达的是 raw body、artifact 包体、archive 内容、provider payload、governance 执行正文或证据正文。 | `ExternalBodyBoundaryRule`;body candidate intake。 |
| acceptance pending / safe basis pending | body-free summary / ref 已到达,但 acceptance、basis sufficiency、lineage closure 或 safe reason 仍未闭合。 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;basis summary input。 |

#### R1.11.6 触发来源与外部边界红线

后续写入时必须把边界异常和触发来源绑定,避免把“谁只能承接安全线索”写模糊:

| 触发来源 | 可触发的 external 边界异常 | 红线 |
|---|---|---|
| Inbound consumer envelope / schema / dedup check | intake rejected、acceptance pending、ignored intake | Inbound 只能产生 intake result / safe summary / ref hint,不得直接建立 core truth。 |
| external summary candidate / basis summary candidate | intake rejected、acceptance pending、basis insufficient / rejected | summary 到达不等于 formalization 通过、formal version 成立或 relation 可写。 |
| external source ref / artifact archive ref resolution | unresolved ref、invalid ref、archive unavailable | 不得从 URL、路径、payload 文本或 provider id 私造正式 ref。 |
| body boundary assertion / violation signal | forbidden body、candidate rejected、safe violation noticed | 不得保存 raw document、artifact 包体、archive 内容、provider payload、governance 正文或 evidence body。 |
| lineage / digest / marker linkage | unresolved ref、acceptance pending、partial lineage | 不得以 lineage 缺口补写 summary truth、audit truth 或 trace truth。 |
| downstream read / command 想消费外部 basis | acceptance pending、basis insufficient、summary stale | Query / Command 不得绕过 external boundary 直接拉正文或把 pending basis 写成 accepted truth。 |
| maintenance / refresh 想修 external gap | not_primary_here | Job 只能刷新 read material / progress,不得代替 external intake 建立 summary / ref truth。 |

#### R1.11.7 当前排除项

以下内容不在本模块展开:

| 排除项 | 原因 |
|---|---|
| external summary / artifact read surface 的 stale / unavailable / degraded 表现 | 已由 `R1.9` / `R1.10` Query 降级异常承接,当前只讨论其承接根因。 |
| export / handoff / downstream collaboration 失败 | 属于 publication / handoff / collaboration 异常。 |
| refresh external summary read materials、external recheck、recovery convergence 的任务主线 | 属于 maintenance / refresh / reconciliation 异常。 |
| core truth rejected / blocked / illegal transition | 已由 `R1.7` / `R1.8` 承接,当前不重写写路径阻断。 |
| governance gate consumer、snapshot export、fingerprint drift、webhook payload 主线 | 旧主线污染,当前继续排除。 |
| external document lifecycle、artifact/archive body lifecycle、marketplace transaction / install / fulfillment | 不属于本仓拥有的业务 truth,只能以 summary/ref/boundary disposition 表达。 |

#### R1.11.8 下一写入批次边界

下一批 `external / inbound / body-free 边界异常:再写入` 只允许写:

1. 承接边界主语表。
2. intake rejected / unresolved ref / forbidden body / acceptance pending 四类边界异常表。
3. Inbound only body-free、不得直建 core truth、不得存正文 / 包体、外部缺失不回滚 truth 的红线表。
4. 交给 publication / maintenance / peripheral / Query 模块的分流记录。
5. 停审记录和下一模块边界。

不得写:

1. publication / handoff / collaboration 异常正文。
2. maintenance / refresh / reconciliation 异常正文。
3. peripheral package / method set / discovery 异常正文。
4. 异常影响图正文。
5. 正式 §10 回填草稿。
6. 正式 `02-概要设计.md`。

#### R1.11.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只锁定承接边界主语、四类边界异常、触发来源和红线。 |
| 是否写异常总表正文 | no | 未写正式 external / inbound 异常总览表。 |
| 是否混入 publication / maintenance / peripheral 正文 | no | 这些只作为分流边界被点名。 |
| 是否恢复旧 webhook / snapshot / governance gate 主线 | no | 已继续排除旧主线污染。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 external / inbound 模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `external / inbound / body-free 边界异常:再写入`;只写承接边界主语表、intake rejected / unresolved ref / forbidden body / acceptance pending 四类边界异常表、外部边界红线表、分流记录和停审记录,不得写 publication / maintenance / peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.12 external / inbound / body-free 边界异常:再写入

#### R1.12.1 承接边界主语表

本表只确定本族异常的承接主语和边界关注点,不代替后续异常总览表。

| 承接主语 | 主要承接入口 | 典型边界关注点 | 不允许继续 |
|---|---|---|---|
| `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | `CaptureExternalSourceSummary`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`ConsumeBodyFreeExternalSummaryAccepted` | summary intake rejected、acceptance pending、basis insufficient / rejected、summary superseded | 不得把 summary 到达直接写成 formalization 通过、formal version 成立或 relation 可写。 |
| `ExternalSourceRef` | `RegisterExternalSourceRef`;`ResolveExternalSourceRef`;`ConsumeExternalSourceRefRegistered` | unresolved ref、invalid ref、duplicate / reused、typed boundary 不闭合 | 不得从 URL、path、route param、provider id 或 payload 文本私造正式 ref。 |
| `ArtifactArchiveRef` | `RegisterArtifactArchiveRef`;`GetArtifactArchiveRef`;`ConsumeArtifactArchiveRefRegistered` | archive ref unavailable、invalid / unresolved、digest hint 不闭合 | 不得保存 archive 包、文件内容、对象存储路径、signed URL 或 retention policy。 |
| `ExternalBodyBoundaryRule` | `AssertExternalBodyBoundary`;`RejectExternalBodyCandidate`;`ConsumeExternalBodyBoundaryViolation` | forbidden body、unsafe payload、candidate rejected、violation noticed | 不得保存 raw document、artifact 包体、archive 内容、provider payload、governance 执行正文或 evidence body。 |
| body-free inbound consumer result | `ConsumeBodyFreeExternalSummaryAccepted`;`ConsumeExternalSourceRefRegistered`;`ConsumeArtifactArchiveRefRegistered`;`ConsumeExternalBodyBoundaryViolation` | accepted / ignored / rejected intake disposition、schema accepted but business boundary rejected | 不得让 consumer result 直接建立 definition、formal version、relation、package 或 maintenance truth。 |
| external evidence lineage / trace handoff hint | `LinkExternalEvidenceLineage`;相关 external lineage consumer / command | lineage pending、safe marker missing、body candidate rejected | 不得用 lineage 补 summary truth、audit truth、trace truth 或 archive 正文。 |

#### R1.12.2 intake rejected 边界异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| inbound envelope、schema、dedup 或 body-free marker 虽通过部分校验,但 summary candidate 不满足本仓承接边界 | body-free inbound consumer result;`ExternalSourceSummary` | 只能返回 rejected / ignored intake summary;不得把失败 intake 写成 accepted external summary truth。 |
| external summary candidate 缺少必要 safe summary / digest / marker,无法进入 captured / accepted 语境 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | 只能 rejected intake 或 pending acceptance,不得进入 basis accepted。 |
| artifact / archive ref candidate 不满足本仓 body-free 引用边界 | `ArtifactArchiveRef`;body-free inbound consumer result | 只能 rejected intake / invalid ref surface;不得登记 archive ref truth。 |
| body boundary violation signal 到达但 safe reason 或 candidate ref 不闭合 | `ExternalBodyBoundaryRule`;body-free inbound consumer result | 只能 rejected / noticed pending surface;不得保存被拒正文或推断 violation truth。 |

#### R1.12.3 unresolved ref / invalid reference 边界异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| external source ref 暂不可解析、命名空间不闭合、typed boundary 不成立 | `ExternalSourceRef` | 只能进入 unresolved / invalid / duplicate-reused 边界语义;不得拼接 ref 或落外部来源正文。 |
| artifact / archive ref 缺失 digest hint、来源锚点或无法安全判断有效性 | `ArtifactArchiveRef` | 只能返回 unavailable / invalid / unresolved ref,不得访问 archive 内容补口。 |
| lineage / basis summary 只给出 free-form id、URL、path 或 provider payload 片段 | `ExternalSourceRef`;external lineage hint | 只能拒绝或保持 unresolved,不得把自由文本升格为 typed ref。 |
| duplicate / reused ref 到达时试图建立第二套外部来源 truth | `ExternalSourceRef`;`ArtifactArchiveRef` | 只能复用既有 ref 或返回 duplicate / reused,不得复制新的 truth 主语。 |

#### R1.12.4 forbidden body / unsafe payload 边界异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| 到达的是 raw external document、标准全文、ADR 正文、governance 执行正文 | `ExternalBodyBoundaryRule`;`ExternalSourceSummary` candidate | 必须 rejected / body boundary violation noticed;不得保存正文或把正文摘要化后强行入仓。 |
| 到达的是 artifact 包体、archive 内容、对象存储内容、证据文件正文 | `ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | 只能保留 body-free ref / digest hint 或直接拒绝;不得保存包体或文件内容。 |
| 到达的是 provider payload、webhook payload、认证信息或外部 API 原始响应 | `ExternalBodyBoundaryRule`;body-free inbound consumer result | 必须 rejected / ignored intake;不得让 consumer 自行解析 payload 成业务 truth。 |
| 到达的是下游运行状态正文、marketplace 交易 / 安装 / 履约正文 | `ExternalBodyBoundaryRule`;external lineage hint | 必须拒绝承接;这些不属于本仓 external body-free 边界。 |

#### R1.12.5 acceptance pending / safe basis pending 边界异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| body-free summary 已到达,但 acceptance marker、safe reason 或 basis sufficiency 尚未闭合 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | 只能 pending acceptance / basis pending;不得被 formalization 或 Query 当成 accepted basis。 |
| basis summary 虽被捕获,但 formalization 语境仍判断 insufficient / rejected | `ExternalBasisAcceptanceHistory`;basis input surface | 只能保留 insufficient / rejected input 边界结果;不得推进 formal version。 |
| external lineage / artifact link 已部分到达,但 trace / audit 所需安全线索尚未齐备 | external evidence lineage / trace handoff hint | 只能 pending lineage / partial linkage;不得补写 audit trail 或 trace truth。 |
| superseded external summary 已存在,但新 summary acceptance 尚未完成 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | 只能保持 superseded / pending coexistence 线索;不得回滚旧 truth 或提前切换为新 accepted basis。 |

#### R1.12.6 外部边界红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| Inbound only body-free | 所有 inbound consumer 和 external intake 主语 | Inbound 只承接 safe summary、typed ref、digest hint、marker、safe reason ref,不接收 raw body、artifact 包体、provider payload 或治理执行正文。 |
| 不得直建 core truth | external intake 与 consumer result | intake accepted / ignored / rejected 只形成 intake summary、summary/ref/boundary线索或后续 command handoff hint,不得直接建立 definition、formalization、version、relation、package 或 maintenance truth。 |
| 不得存正文 / 包体 | external summary、artifact archive、body boundary、lineage 相关主语 | 不保存标准全文、ADR 正文、artifact body、archive 内容、证据正文、report body、provider payload 或对象存储路径。 |
| unresolved ref 不得私补 | `ExternalSourceRef`;`ArtifactArchiveRef`;lineage refs | ref 缺口只能 unresolved / invalid / duplicate-reused,不得从 URL、path、payload 文本或 provider id 私补。 |
| 外部缺失不回滚 truth | 所有已成立的 definition / version / relation / boundary / package truth | 外部 summary 不可用、artifact ref 失效或 basis pending 只能阻断新承接或形成 unavailable / pending,不得回滚既有 truth。 |
| basis 到达不等于业务裁决 | basis summary、acceptance history、formalization 下游接缝 | body-free basis 到达只是输入边界,不等于 formalization 通过、formal version 成立或 consumption automatically available。 |
| Query / Job 不得绕过 external 边界 | Query、maintenance / refresh / recovery 相关路径 | Query 不得拉正文补口;Job 不得代替 intake 建立 summary / ref truth。 |

#### R1.12.7 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| external summary / artifact read surface 的 stale / unavailable / degraded 呈现 | Query / view / material 降级异常 | 当前只写承接根因和边界拒绝 / pending。 |
| refresh external summary read materials、external recheck、recovery convergence | maintenance / refresh / reconciliation 异常 | 当前不讨论任务 / run / progress 主线。 |
| external summary accepted 后的 downstream export / handoff / collaboration failure | publication / handoff / collaboration 异常 | 当前只处理承接边界,不处理传播失败。 |
| package / method set 引用 external context 后的外围 discovery 问题 | peripheral package / method set / discovery 异常 | 当前不处理外围 discoverability 主线。 |
| intake 成功后如何形成 event candidate / 维护 hint | publication / maintenance 相关模块 | 当前只到 body-free intake / summary / ref / boundary 级别。 |

#### R1.12.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成承接边界主语表 | pass | 已固定 external summary、source ref、artifact ref、body boundary、consumer result 和 lineage hint 主语。 |
| 是否完成四类边界异常表 | pass | 已定稿 intake rejected、unresolved ref、forbidden body、acceptance pending 四类。 |
| 是否完成外部边界红线 | pass | 已明确 Inbound only body-free、不得直建 core truth、不得存正文 / 包体、外部缺失不回滚 truth 等红线。 |
| 是否完成分流记录 | pass | 已把 Query、maintenance、publication、peripheral 分流到后续模块。 |
| 是否写其他异常族正文 | no | 未写 publication / maintenance / peripheral 正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 external / inbound 模块。 |

#### R1.12.9 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `publication / handoff / collaboration 异常:先思考`。

下一模块只允许回答:

1. 哪些 candidate produced but handoff failed / downstream unavailable / collaboration blocked 场景必须在概要层点名。
2. 哪些失败属于 truth 已成立后的传播失败,不得回滚既有 truth。
3. 哪些 publication / collaboration 失败只允许写 failed marker、diagnostic、safe report hint 或 downstream unavailable 口径。

下一模块不得写:

- maintenance / refresh / reconciliation 异常正文
- peripheral package / method set / discovery 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `publication / handoff / collaboration 异常:先思考`;只思考 candidate produced but handoff failed / downstream unavailable / collaboration blocked 分类、不得回滚既有 truth 的红线和后续分流项,不得写 maintenance / peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.13 publication / handoff / collaboration 异常:先思考

#### R1.13.1 本模块必读文档

本模块先读以下输入,只借 `L1-governance` 的结构深度,不得复制治理语义:

| 文档 | 本模块用途 | 当前用法 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md#R1.6~R1.12` | 继承异常 owner 候选池、写路径阻断红线、Query 降级边界和 external 边界分流。 | read |
| `design-calibration/02_hld_step_09_state_machine.md` | 回指 event candidate 传播、safe handoff、外部缺失不回滚 truth、event candidate 不等于 delivery 等红线。 | read |
| `design-calibration/02_hld_step_08_processing_flows.md` | 回指 event candidate、maintenance hint、audit / trace handoff、Inbound handoff hint 和 “当前只到 candidate 不到 delivery” 的处理边界。 | read |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 回指 34 个 Outbound Event 候选、验收 / 审计 handoff 相关接口和禁止事项。 | read |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考 Step 10 异常模块编排深度和“truth 已成立后的传播失败不得回滚 truth”的框架。 | structure_only |
| 正式 `projects/L3-method-library/02-概要设计.md` §5~§9 | 只核对当前正式主链中 event candidate、trace / audit handoff、maintenance hint 和外围感知前提。 | read |

#### R1.13.2 本模块问题

本模块只回答“哪些 publication / handoff / collaboration 失败必须在概要层先点名,否则本仓会把传播失败误写成 truth 失败,或把尚未闭口的 delivery 机制误当成当前已存在能力”。它不直接写异常总览表、异常影响图、maintenance / peripheral 正文或正式 §10 草稿。

本模块需要先想清楚的核心问题有五个:

1. 哪些 event candidate、audit / evidence handoff hint、maintenance hint 或 downstream collaboration hint 在 truth 已成立后仍可能失败或阻塞。
2. 哪些失败只属于 `candidate produced but handoff failed / downstream unavailable / collaboration blocked`,不得回滚 definition、formal version、relation、external summary 或 package truth。
3. 哪些传播失败当前只能以 failed marker、safe reason、diagnostic、pending handoff 或 downstream unavailable 口径表达。
4. 哪些交付 / 导出 / publish 机制在本轮概要中尚未正式闭口,因此不能伪装成已有 outbox、topic、receipt、relay 或 archive export 状态。
5. 哪些旧 publish / outbox / snapshot / governance handoff 主线必须继续排除。

#### R1.13.3 当前来源判断

当前 publication / handoff / collaboration 异常的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 主要组成部分边界 | 各组成部分都可产生 event candidate、trace / audit handoff hint、maintenance hint 或外围感知线索,但当前不闭口 delivery 机制。 | 判断哪些异常属于传播失败,哪些应后置到 maintenance / peripheral 或详细设计。 |
| Step 6 关键对象 | `MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MaintenanceProgressView`、外围 view / history 等可承接 safe handoff / collaboration 线索。 | 锁定传播失败主语和协作面。 |
| Step 7 Outbound / Query / Job 骨架 | Outbound 只定义 34 个 event candidate;不定义 topic、payload schema、outbox、relay、receipt、retry 或 archive handoff job。 | 固定“当前已闭口的是 candidate,不是 delivery”。 |
| Step 8 处理流 | Command 只在 accepted boundary 后产生 event candidate 或 maintenance hint;Inbound 只形成 intake summary 或 handoff hint;Job 只推进 body-free material / progress。 | 固定传播失败发生在 truth 已成立之后,且不得回写 truth。 |
| Step 9 状态机 | `event candidate 不等于 delivery`、`外部缺失不回滚 truth`、`DefinitionUseViolationHandedOff`、audit / evidence lineage handoff、maintenance progress 等边界已固定。 | 固定传播失败、协作阻塞和 safe handoff 的状态红线。 |
| governance Step 10 框架 | truth 已成立后的 publish / handoff / downstream failure 只能写 failed marker / report / unavailable,不得回滚核心事实。 | 只借模块组织方式,不复制 governance 的 outbox publication、GRC export 或 archive handoff 语义。 |

#### R1.13.4 传播失败主语范围

本模块先只锁定“会命中 publication / handoff / collaboration 异常”的主语范围,不写正式异常总表:

| 传播失败主语范围 | 当前判断 | 典型异常 |
|---|---|---|
| 各组成部分 `event candidate` | yes | candidate produced but downstream unavailable、candidate 无法继续 handoff、safe reason required。 |
| `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;trace / audit handoff hints | yes | 验收 / 审计 handoff blocked、lineage collaboration pending、safe handoff failed。 |
| `ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;formal intervention / maintenance hint | yes_as_collaboration_surface | downstream summary 未到达、protection collaboration blocked、formal intervention pending。 |
| `DefinitionUseBoundaryGuard` / violation handoff | yes_limited | violation handed off but unresolved、collaboration blocked、safe reason pending。 |
| `MaintenanceProgressView`;maintenance event candidate | yes_limited | maintenance attention raised but downstream unavailable、recovery collaboration blocked。 |
| peripheral view / history / event candidate | yes_as_peripheral_signal | peripheral discovery / package / assembly changed 产生协作线索但 downstream unavailable。 |
| outbox delivery / publish receipt / relay state | no_for_this_module | 当前概要未闭口 delivery 机制,不能当作已存在状态 owner。 |
| archive export / marketplace delivery / external GRC export | no_for_this_module | 当前概要未闭口这些交付边界,后续如需要必须另行讨论。 |

#### R1.13.5 异常分类框架

publication / handoff / collaboration 异常在本仓当前更适合先按以下三类思考:

| 异常分类 | 当前含义 | 典型主语 |
|---|---|---|
| candidate produced but handoff failed | truth / material / boundary 已成立并产出 event candidate 或 safe handoff hint,但后续交接未闭口或被安全边界阻断。 | 各组成部分 event candidate;audit / lineage handoff hint;maintenance hint。 |
| downstream unavailable | 本仓要通知、解释、协作的下游 / 相邻读取面当前不可用、不可达或只允许 unavailable surface。 | maintenance progress collaboration;外围感知;external summary follow-up;consumption impact downstream summary。 |
| collaboration blocked | 需要人工 / 正式流程 / 安全摘要协作的后续动作未满足前提,只能保持 blocked / pending handoff / formal intervention required。 | `ConsistencyProtectionPolicy`;`ConsumptionImpactSummary`;`DefinitionUseBoundaryGuard`;audit / evidence lineage collaboration。 |

#### R1.13.6 触发来源与传播红线

后续写入时必须把传播失败和触发来源绑定,避免把“谁只是候选 / hint”写模糊:

| 触发来源 | 可触发的 publication / handoff / collaboration 异常 | 红线 |
|---|---|---|
| accepted command 产出 event candidate | candidate produced but handoff failed、downstream unavailable | event candidate 只表达事实变化候选,不得假装已 delivery 或已被下游接收。 |
| trace / audit / evidence lineage 产出 handoff hint | handoff failed、collaboration blocked | safe handoff 失败不得回滚 audit / lineage truth,也不得补写正文。 |
| protection decision / impact summary 需要后续承接 | collaboration blocked、downstream unavailable | protection / impact 只可形成 required / pending / blocked collaboration surface,不得自动执行恢复。 |
| maintenance attention / recovery hint | downstream unavailable、collaboration blocked | maintenance hint 不等于 job 已排队 / 已执行 / 已完成。 |
| peripheral / consumption / relation 感知面变化 | candidate produced but handoff failed、downstream unavailable | 不得把外围或下游不可用解释为 core truth 失败。 |
| 旧 publish / outbox / relay 词汇诱导 | false_publication_semantics | 当前不能引入 topic、receipt、relay、dead letter、archive export 或 snapshot handoff 语义补口。 |

#### R1.13.7 当前排除项

以下内容不在本模块展开:

| 排除项 | 原因 |
|---|---|
| outbox delivery、topic、payload schema、relay、receipt、retry、dead letter | 当前概要只闭口 event candidate,不闭口 delivery 机制。 |
| maintenance task / run / recovery 本体异常 | 属于 maintenance / refresh / reconciliation 异常。 |
| package / method set / discovery 主线异常 | 属于 peripheral package / method set / discovery 异常。 |
| external summary 承接失败根因 | 已由 `R1.11` / `R1.12` external / inbound 模块承接。 |
| Query stale / unavailable / degraded 表现 | 已由 `R1.9` / `R1.10` Query 降级异常承接。 |
| 旧 `MethodContent` publish、snapshot export、fingerprint changed、governance handoff、external GRC export | 旧主线污染,当前继续排除。 |

#### R1.13.8 下一写入批次边界

下一批 `publication / handoff / collaboration 异常:再写入` 只允许写:

1. 传播失败主语表。
2. candidate produced but handoff failed / downstream unavailable / collaboration blocked 三类异常表。
3. event candidate 不等于 delivery、失败不得回滚 truth、只能写 failed marker / pending handoff / downstream unavailable 的红线表。
4. 交给 maintenance / peripheral / detailed design delivery closure 的分流记录。
5. 停审记录和下一模块边界。

不得写:

1. maintenance / refresh / reconciliation 异常正文。
2. peripheral package / method set / discovery 异常正文。
3. 异常影响图正文。
4. 正式 §10 回填草稿。
5. 正式 `02-概要设计.md`。

#### R1.13.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只锁定传播失败主语、三类异常、触发来源和红线。 |
| 是否写异常总表正文 | no | 未写正式 publication / handoff / collaboration 异常总览表。 |
| 是否混入 maintenance / peripheral 正文 | no | 这些只作为分流边界被点名。 |
| 是否发明 delivery / receipt / relay 机制 | no | 已明确当前只到 event candidate / handoff hint,不闭口 outbox / delivery。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 publication / handoff / collaboration 模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `publication / handoff / collaboration 异常:再写入`;只写传播失败主语表、candidate produced but handoff failed / downstream unavailable / collaboration blocked 三类异常表、传播红线表、分流记录和停审记录,不得写 maintenance / peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.14 publication / handoff / collaboration 异常:再写入

#### R1.14.1 传播失败主语表

本表只确定本族异常的传播主语和协作关注点,不代替后续异常总览表。

| 传播主语 | 主要产生入口 | 典型传播关注点 | 不允许继续 |
|---|---|---|---|
| 各组成部分 `event candidate` | accepted Command、state changed、read material / maintenance changed 后的 event candidate | candidate produced、handoff failed、downstream unavailable、safe reason required | 不得把 event candidate 当成已 delivery、已消费、已同步或已安装事实。 |
| `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;audit / evidence handoff hints | `MethodAssetAuditTrailChanged`;`MethodAssetEvidenceLineageChanged`;trace / audit 组织流 | 验收 / 审计 handoff blocked、lineage collaboration pending、safe handoff failed | 不得回滚 audit / lineage truth,也不得补写 evidence body、report body 或 archive 正文。 |
| `ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;formal intervention / maintenance hint | `ConsumptionImpactSummaryChanged`;`ConsistencyProtectionDecisionChanged`;`MethodAssetConsistencyRecoveryChanged`;formal intervention markers | downstream summary missing、collaboration blocked、formal intervention pending | 不得把协作阻塞解释为 protection 已满足、recovery 已完成或下游已承接。 |
| `DefinitionUseBoundaryGuard` / violation handoff | `DefinitionUseBoundaryViolationNoticed`;safe violation handoff | violation 已交接但未闭口、后续协作阻塞、safe reason pending | 不得把 violation handoff 写成边界已调整或问题已解决。 |
| `MaintenanceProgressView`;maintenance event candidate | `MethodAssetMaintenanceRequested`;`MethodAssetMaintenanceProgressChanged`;`MethodAssetConsistencyRecoveryChanged` | maintenance attention raised、recovery collaboration blocked、downstream unavailable | 不得把 hint 当成 job 已排队 / 已执行 / 已收敛。 |
| peripheral view / history / event candidate | `MethodPackageChanged`;`MethodSetAssemblyChanged`;`PackageCompositionResultChanged`;`PeripheralViewAvailabilityChanged` | peripheral collaboration blocked、consumer unavailable、safe downstream hint only | 不得把外围协作失败反向改写 core truth。 |

#### R1.14.2 candidate produced but handoff failed 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| accepted truth / material / boundary 已产生 event candidate,但后续 handoff 目标未闭口或未满足安全交接前提 | 各组成部分 `event candidate` | 只能保留 candidate produced / handoff failed / safe reason surface;不得撤销已成立 truth。 |
| audit trail 或 evidence lineage 已组织完成,但验收 / 审计 handoff 不能继续 | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | 只能记录 handoff blocked / pending handoff / safe audit hint;不得回滚 audit / lineage。 |
| maintenance / recovery 已形成 formal intervention 或 pending acknowledgement hint,但正式承接未发生 | `ConsistencyProtectionPolicy`;`ConsistencyRecoveryTask` hint;`MaintenanceProgressView` | 只能保留 formal intervention required / pending acknowledgement / handoff failed;不得伪装成已处理。 |
| external summary / artifact / violation 已形成后续 event candidate,但 downstream follow-up 无法继续 | external summary / lineage / violation 相关 event candidate | 只能记录 follow-up failed / handoff blocked;不得回滚 external summary truth 或删除历史线索。 |

#### R1.14.3 downstream unavailable 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| 下游消费方 / 相邻读取面当前不可用,无法消费 event candidate 或 safe hint | 各组成部分 `event candidate`;consumption / relation / peripheral 感知线索 | 只能写 downstream unavailable / safe unavailable surface;不得把下游不可用解释为本仓 truth 无效。 |
| 需要等待下游 impact summary、人工确认或正式流程反馈,但当前只得到 unavailable / missing feedback | `ConsumptionImpactSummary`;`ConsistencyProtectionPolicy` | 只能保持 pending downstream summary / unavailable feedback / protection unknown。 |
| 维护进度、外围发现或审计读取面当前不可继续承接 collaboration hint | `MaintenanceProgressView`;peripheral view / history;audit handoff hint | 只能返回 downstream unavailable / pending collaboration,不得伪造“已可见”或“已解释”。 |
| artifact / archive / evidence handoff 需要的下游解释面不可用 | `MethodAssetEvidenceLineage`;`ArtifactArchiveRef` collaboration hint | 只能保留 unavailable handoff / pending explanation;不得复制包体或证据正文补口。 |

#### R1.14.4 collaboration blocked 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| protection decision 需要人工 / 正式流程 / 边界裁定承接,但协作前提未满足 | `ConsistencyProtectionPolicy`;formal intervention hint | 只能写 collaboration blocked / formal intervention required;不得自动执行恢复或修改 truth。 |
| definition-use violation 已 handoff 到 trace / audit / protection,但后续协作仍未闭口 | `DefinitionUseBoundaryGuard`;violation handoff hint | 只能 blocked / pending handoff / safe violation diagnostic;不得自动放开 boundary。 |
| audit / evidence / lineage 需要后续解释或验收承接,但当前只能形成安全提示 | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | 只能 blocked / pending explanation / audit handoff required;不得落 report body 或 raw evidence。 |
| maintenance recovery 进入 suspended / formal intervention required,无法由后台维护单独闭合 | `ConsistencyRecoveryTask`;`MaintenanceProgressView` | 只能 blocked / suspended / formal intervention required;不得把挂起解释为 truth 失败或自动已修复。 |
| peripheral / downstream 协作只拿到 safe reason,没有形成正式承接闭环 | peripheral collaboration hint;package / set / discovery event candidate | 只能 blocked / unavailable collaboration surface;不得影响核心闭环成立。 |

#### R1.14.5 传播红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| event candidate 不等于 delivery | 所有 `event candidate` 主语 | 当前概要只定义 candidate 来源,不定义 topic、payload schema、outbox、relay、receipt、retry 或 dead letter。 |
| 传播失败不得回滚 truth | definition、formal version、relation、external summary、boundary、package 等已成立 truth | handoff failed / downstream unavailable / collaboration blocked 只影响传播面,不得回滚既有 truth。 |
| 只能写 failed marker / pending handoff / downstream unavailable | 所有 publication / handoff / collaboration 异常主语 | 当前只允许安全失败口径、pending handoff、formal intervention hint、safe reason ref 或 downstream unavailable surface。 |
| 不得发明 delivery 机制 | publish / handoff / collaboration 语义 | 不得自行补 topic、subscriber、receipt、archive export、relay、external GRC export 或 marketplace delivery。 |
| 不得以传播失败触发自动修复 | maintenance / protection / collaboration 接缝 | 协作阻塞只能形成 maintenance hint / formal intervention / blocked surface,不得自动修 core truth。 |
| 下游不可用不等于本仓无效 | 下游消费、外围发现、验收 / 审计 handoff | downstream unavailable 只表达对方当前不可承接,不得解释为 definition / version / relation / package 无效。 |
| handoff 仍保持 body-free | audit、evidence、external、maintenance、peripheral 协作线索 | 传播 / 协作失败时仍不得带入 raw log、report body、evidence body、artifact body、archive 内容或 provider payload。 |

#### R1.14.6 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| maintenance task blocked、refresh failed、recovery suspended / rejected 的任务主线 | maintenance / refresh / reconciliation 异常 | 当前只写传播失败和 formal intervention / progress hint,不写维护任务主线。 |
| package / method set / discovery 自身 unavailable / partial / invalid 语义 | peripheral package / method set / discovery 异常 | 当前只写外围协作失败,不写外围主线异常。 |
| outbox delivery、topic、payload schema、relay、receipt、dead letter | detailed design / config / implementation later | 当前概要未闭口 delivery 机制。 |
| archive export、marketplace delivery、external GRC export、正式 handoff adapter | later dedicated design | 当前本仓概要没有这些正式交付边界。 |
| external 承接失败根因、Query degraded 呈现 | external / inbound 模块、Query / view 模块 | 当前只承接 truth 已成立后的传播失败。 |

#### R1.14.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成传播失败主语表 | pass | 已固定 event candidate、audit / lineage handoff、impact / protection、violation handoff、maintenance hint 和外围协作主语。 |
| 是否完成三类异常表 | pass | 已定稿 candidate produced but handoff failed、downstream unavailable、collaboration blocked 三类。 |
| 是否完成传播红线 | pass | 已明确 event candidate 不等于 delivery、传播失败不得回滚 truth、不得发明 delivery 机制等红线。 |
| 是否完成分流记录 | pass | 已把 maintenance、peripheral 和 delivery 机制闭口后置到后续模块。 |
| 是否写其他异常族正文 | no | 未写 maintenance / peripheral 正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 publication / handoff / collaboration 模块。 |

#### R1.14.8 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `maintenance / refresh / reconciliation 异常:先思考`。

下一模块只允许回答:

1. 哪些 refresh blocked / recovery pending / progress stalled / drift detected 场景必须在概要层点名。
2. 哪些 maintenance 失败只影响派生材料、progress 或收敛判断,不得修 core truth。
3. 哪些 maintenance 失败只允许写 pending / partial / unavailable / formal intervention required 口径。

下一模块不得写:

- peripheral package / method set / discovery 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `maintenance / refresh / reconciliation 异常:先思考`;只思考 refresh blocked / recovery pending / progress stalled / drift detected 分类、不得修 core truth 的红线和后续分流项,不得写 peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.15 maintenance / refresh / reconciliation 异常:先思考

#### R1.15.1 本模块必读文档

本模块只思考 `maintenance / refresh / reconciliation` 异常家族的主语范围、分类框架和红线,不直接写异常正文表。

| 文档 | 本模块使用方式 | 当前读取结论 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md` `R1.14` | 承接上一模块已收稳的传播失败边界,避免把 handoff failure 混入 maintenance 主线。 | 已确认 publication / handoff / collaboration 失败只停留在 candidate / handoff / downstream surface。 |
| `design-calibration/02_hld_step_09_state_machine.md` `R1.19`~`R1.20` | 提供 maintenance task、recovery task、progress view 的正式 owner、状态组和红线。 | 已确认 task truth 与 progress view 分离,且 `job 不修 truth` 已在状态层闭口。 |
| `design-calibration/02_hld_step_08_processing_flows.md` `R1.21`~`R1.22` | 提供 maintenance request/control、8 个 job、progress read 和 maintenance event candidate 的处理流来源。 | 已确认 refresh / recovery 只刷新派生材料、推进收敛、记录 progress / issue,不修 core truth。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` `R1.24`~`R1.45` | 校对 maintenance Command / Query / Job / Event 的正式入口,避免回流旧 job 命名。 | 已确认维护异常必须回指当前 task / run / scope / progress 接口骨架。 |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考异常模块组织方式、停审结构和“先收紧红线,再写正文”的深度。 | 只借框架,不复制 governance 的 projection rebuild / snapshot / handoff 语义。 |

#### R1.15.2 本模块问题

当前需要先回答的不是“每个 maintenance 异常怎么写成总表”,而是以下四个前置问题:

1. 哪些对象有资格成为 maintenance / refresh / reconciliation 异常主语,哪些只能作为 task 的输入材料或读取结果。
2. refresh blocked、recovery pending、progress stalled、drift detected 四类异常分别对应哪组正式对象和处理流。
3. 哪些 maintenance 失败只允许形成 pending / partial / unavailable / formal intervention required,而不能升级成 core truth 失效或自动修复。
4. 哪些旧主线或实现态词汇最容易污染本模块,必须在再写入前先排除。

#### R1.15.3 当前来源判断

从当前 Step 7~9 的正式输入看,maintenance 异常必须按“task / recovery / progress”三层来源收口:

| 来源层 | 当前判断 | 对本模块的约束 |
|---|---|---|
| task / recovery truth | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` 是正式任务 / 收敛真相源。 | refresh blocked / recovery pending 必须优先回指 task truth,不得拿 progress view 或 worker 结果替代。 |
| progress / history read surface | `MaintenanceProgressView` 提供 run / scope 维度下的可见进度;`MaintenanceRunHistory` 只提供历史解释。 | progress stalled 只能表达可见进度落后、不可读或待收敛,不得把 progress 当作新的任务真相源。 |
| material freshness / drift hint | stale / unavailable / partial / recovery needed 来自各读取材料、external summary 和 recovery convergence 的当前结果。 | drift detected 只能表达派生材料或收敛判断的漂移 / 落后,不得回写为 definition、formal version、relation 或 package truth 失效。 |

补充判断:

- 当前 `formal intervention required` 属于 recovery 收敛结果,不是自动治理执行或自动版本替代。
- 当前 `superseded / suspended / rejected` 属于 maintenance control / convergence 语义,不是业务 truth rollback。
- 当前 `drift` 若需要点名,只能从 read material、external summary、maintenance progress 重新推导,不得恢复 snapshot / fingerprint 主线。

#### R1.15.4 维护异常主语范围

本模块当前接受的 maintenance 异常主语范围如下:

| 主语 | 当前角色 | 允许承载的异常 | 当前不允许承载 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | read material refresh truth owner | pending、in progress、partial、converged、stale、unavailable、blocked by source / scope。 | definition / catalog / formal version / relation / external summary truth repair。 |
| `TraceMaterialRefreshTask` | trace / audit / impact / lineage refresh truth owner | partial、blocked by body boundary、converged、unavailable、subject-scope blocked。 | raw log repair、evidence body 补齐、report body 复制。 |
| `ConsistencyRecoveryTask` | recovery convergence truth owner | recovery needed、pending acknowledgement、suspended、rejected、formal intervention required、converged。 | 自动修 core truth、重做正式化、扩大消费边界、复制外部正文。 |
| `MaintenanceProgressView` | maintenance 可见进度 read model | pending、converging、recovery needed、stale、unavailable、converged 的可见摘要。 | 替代 task truth、从 worker / queue / cron 反推真实状态。 |
| `MaintenanceRunHistory` | run outcome 历史解释面 | superseded、intervention hint、manual follow-up hint、historical unavailable。 | 当前 task owner、重试控制面、incident 正文。 |

当前范围判断:

- `ReadMaterialRefreshTask` 是 refresh blocked / drift detected 的主异常 owner。
- `TraceMaterialRefreshTask` 是 body-free 刷新受阻、partial / unavailable 的主异常 owner。
- `ConsistencyRecoveryTask` 是 recovery pending / suspended / rejected / formal intervention required 的主异常 owner。
- `MaintenanceProgressView` 只作为 progress stalled / visible degraded 的异常读取面,不是第一 truth owner。
- `MaintenanceRunHistory` 当前只作为辅助解释面,再写入时如需出现,也只能落在分流记录或历史提示中。

#### R1.15.5 分类框架

本模块后续异常正文建议固定为以下四类:

| 分类 | 主 owner | 典型触发 | 当前概要口径 |
|---|---|---|---|
| refresh blocked | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask` | source safe read unavailable、body boundary blocked、scope invalid、task superseded、required material missing。 | 只形成 blocked / partial / unavailable / superseded / stale 结果,不修 core truth。 |
| recovery pending | `ConsistencyRecoveryTask` | recovery needed、pending acknowledgement、suspended、rejected、formal intervention required。 | 只形成 recovery summary、pending follow-up 或 intervention hint,不自动宣布已修复。 |
| progress stalled | `MaintenanceProgressView` | progress stale、run / scope progress unavailable、pending issue 长时间未收敛、task truth 已变化但 progress 未跟上。 | 只暴露 pending / stale / unavailable / recovery needed 的可见面,不得把 stalled 折叠成 missing。 |
| drift detected | read material freshness + recovery convergence 交叉判断 | truth / boundary / external summary 已变化,material / progress / consistency 仍落后。 | 只写 stale / invalidation / follow-up / recovery needed,不得把 drift 写成 formal truth 自动失效。 |

当前不建议扩成更多类别,原因如下:

| 候选扩展 | 当前处理 |
|---|---|
| worker failed / queue stuck / retry exhausted | 排除,属于实现 / 运维机制。 |
| external polling failed | 排除,属于外部摘要与引用的后置维护实现。 |
| package / set refresh unavailable | 后置到 peripheral isolation 模块。 |
| handoff / downstream sync failed | 已留在上一模块 `publication / handoff / collaboration`。 |

#### R1.15.6 触发来源与 maintenance 红线

maintenance 异常必须同时回指当前触发来源和固定红线:

| 触发来源 | 允许导向的 maintenance 异常 | 红线 |
|---|---|---|
| `RequestReadMaterialRefresh` / 6 个 read material refresh jobs / `RefreshPeripheralReadMaterials` | refresh blocked、progress stalled、drift detected。 | 不得把 refresh 写成 definition、formal version、relation、external summary 或 package truth 的第二写入口。 |
| `RequestTraceMaterialRefresh` / `RefreshTraceAuditImpactMaterials` | refresh blocked、partial、unavailable、progress stalled。 | 不得读取 raw log、证据正文、report body,不得补造 trace / audit 真相。 |
| `RequestConsistencyRecovery` / `RunConsistencyRecoveryConvergence` | recovery pending、formal intervention required、drift detected。 | 不得自动修复 truth、重做正式化、绕过消费边界或复制外部正文。 |
| `GetMaintenanceProgress*` / `ListPendingMaintenanceScopes` | progress stalled、visible unavailable、recovery needed visible surface。 | Query 只读,不得触发 refresh、确认 issue 或隐式清除 stalled。 |
| `MarkMaintenanceSuspended` / `RequireMaintenanceFormalIntervention` / `SupersedeMaintenanceRequest` | recovery pending、refresh blocked、manual follow-up 分流。 | 不得把 suspended / superseded / intervention required 写成问题已解决。 |

本模块当前 maintenance 红线固定如下:

| 红线 | 当前口径 |
|---|---|
| `Job 不修 core truth` | 所有 refresh / recovery 只刷新派生材料、推进收敛或记录 progress / issue,不得修 definition、formal version、relation、external summary 或 package truth。 |
| `Progress 不替代 task truth` | `MaintenanceProgressView` 只能复制 / 摘要 task 与 recovery 结果,不得倒过来定义任务状态。 |
| `Formal intervention != automatic execution` | `formal intervention required` 只表示需要正式承接,不得自动触发治理审批、版本替代、边界扩权或外部回填。 |
| `Drift 不等于 truth invalid` | stale / drift / recovery needed 只表示派生材料或收敛语义落后,不得直接宣布 core truth 失效。 |
| `Maintenance 不恢复旧主线` | 不恢复 snapshot export、fingerprint recalculation、projection rebuild、outbox replay、report body 或 worker queue 主线。 |

#### R1.15.7 当前排除项

以下内容在本模块先思考阶段明确排除:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| worker / scheduler / queue / retry / lock / cron / cache | 属于执行机制,不是维护异常主语。 | 03 / 04 / 07 或运行态。 |
| raw log / metrics body / incident body / report body | 当前 maintenance 只允许 body-free progress / issue / summary。 | 03 / 运维文档。 |
| snapshot export / fingerprint recalculation / replay checkpoint | 当前 drift / freshness 已改由 material / progress 语义承接。 | historical material only。 |
| handoff failed / downstream unavailable | 属于上一模块传播失败边界。 | `R1.13` / `R1.14`。 |
| package / method set / discovery refresh unavailable | 属于外围隔离模块。 | peripheral package / method set / discovery 异常。 |
| automatic remediation script / governance execution | 当前 maintenance 只收敛、提示或升级 intervention。 | 详细设计或外部系统。 |

#### R1.15.8 下一写入批次边界

下一批 `maintenance / refresh / reconciliation 异常:再写入` 只允许写:

1. maintenance 异常主语表。
2. `refresh blocked` 异常表。
3. `recovery pending` 异常表。
4. `progress stalled` 异常表。
5. `drift detected` 异常表。
6. maintenance 红线表。
7. 分流记录。
8. 本模块停审记录和下一模块边界。

下一批不得写:

- peripheral package / method set / discovery 异常正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

#### R1.15.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只收稳必读文档、主语范围、分类框架、红线和排除项。 |
| 是否把 maintenance 写成实现机制问题 | no | 已排除 worker / queue / retry / lock / raw diagnostic。 |
| 是否把 drift 写成 truth 失效 | no | drift 只保留为 material / progress / recovery 语义。 |
| 是否把 progress 当作 task truth | no | 已固定 `MaintenanceProgressView` 只是 read model。 |
| 是否越过到 peripheral | no | peripheral 异常仍留给下一模块。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 maintenance 模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `maintenance / refresh / reconciliation 异常:再写入`;只写 maintenance 异常主语表、refresh blocked / recovery pending / progress stalled / drift detected 四类异常表、maintenance 红线表、分流记录和停审记录,不得写 peripheral 异常正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.16 maintenance / refresh / reconciliation 异常:再写入

#### R1.16.1 maintenance 异常主语表

本表只确定 maintenance 异常的正式主语和异常承载边界,不代替后续 Step 10 总览表。

| maintenance 主语 | 主要产生入口 | 典型异常关注点 | 不允许继续 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | `RequestReadMaterialRefresh`;6 个 read material refresh jobs;`MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest` | source unavailable、scope blocked、refresh stale、partial converged、superseded / suspended | 不得把 read refresh 写成 definition、formal version、relation、external summary 或 package truth 修复。 |
| `TraceMaterialRefreshTask` | `RequestTraceMaterialRefresh`;`RefreshTraceAuditImpactMaterials`;maintenance control | body boundary blocked、partial trace / audit / impact refresh、subject unavailable、refresh suspended | 不得补造 raw log、evidence body、report body 或 trace / audit 真相。 |
| `ConsistencyRecoveryTask` | `RequestConsistencyRecovery`;`RunConsistencyRecoveryConvergence`;`RequireMaintenanceFormalIntervention`;`MarkMaintenanceSuspended`;`SupersedeMaintenanceRequest` | recovery needed、pending acknowledgement、rejected、suspended、formal intervention required、recovery blocked by boundary | 不得自动修 core truth、重做正式化、扩大消费边界或复制外部正文。 |
| `MaintenanceProgressView` | `GetMaintenanceProgress*`;`ListPendingMaintenanceScopes`;task / recovery changed | progress stale、progress unavailable、recovery needed visible surface、converging 未闭口 | 不得替代 task truth,不得从 worker / queue / cron 反推真实 run 状态。 |
| `MaintenanceRunHistory` | maintenance request accepted;refresh / recovery outcome changed | superseded hint、intervention hint、historical unavailable、manual follow-up explanation | 不得变成当前 task owner、重试控制面或 incident 正文。 |

#### R1.16.2 `refresh blocked` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| read material refresh 依赖的 safe read source、typed ref 或 target material 当前不可读 / 缺失 | `ReadMaterialRefreshTask` | 只能形成 unavailable / stale / issue ref / follow-up required;不得回写 definition、formal version、relation 或 external summary truth。 |
| refresh 期间来源 truth、boundary 或 external summary 已变化,当前 task 与 scope 不再对齐 | `ReadMaterialRefreshTask` | 只能形成 stale / superseded / re-request needed surface;不得把旧 refresh 结果伪装成 current。 |
| trace / audit / impact refresh 命中 body boundary 或 required body-free material 不完整 | `TraceMaterialRefreshTask` | 只能形成 partial / blocked by body boundary / unavailable;不得复制 evidence body、report body 或 raw log 补口。 |
| refresh scope、subject set 或 affected material set 当前不满足 formal scope 前提 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask` | 只能 blocked / scope invalid / pending follow-up;不得合成 scope、跳过 formal scope 校验或私补 target set。 |
| maintenance request 已被 supersede / suspend,原 refresh 不再允许继续闭口 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`MaintenanceRunHistory` | 只能形成 superseded / suspended / historical hint;不得把被替代或挂起的 refresh 写成成功收敛。 |

#### R1.16.3 `recovery pending` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| consistency recovery 已识别到 unresolved issue,当前只能进入 pending acknowledgement | `ConsistencyRecoveryTask` | 只能形成 recovery needed / pending acknowledgement / safe issue refs;不得自动宣布已修复。 |
| recovery convergence 发现需要正式流程或人工承接才能继续 | `ConsistencyRecoveryTask` | 只能形成 formal intervention required / manual follow-up hint;不得自动触发治理执行、版本替代或边界调整。 |
| recovery 路径被显式 suspend / reject | `ConsistencyRecoveryTask`;`MaintenanceRunHistory` | 只能形成 suspended / rejected / blocked surface 和历史解释;不得把 rejected 解释为 no issue。 |
| recovery 所需依据仍处于 unavailable / unknown / blocked by boundary | `ConsistencyRecoveryTask`;`MaintenanceProgressView` | 只能维持 recovery needed / pending / unavailable visible surface;不得跳过缺口继续收敛。 |
| 旧 recovery run 已被后续 run supersede,但当前问题仍未正式闭口 | `ConsistencyRecoveryTask`;`MaintenanceRunHistory` | 只能形成 superseded hint + pending current follow-up;不得用历史 run 冒充当前闭环结果。 |

#### R1.16.4 `progress stalled` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| task / recovery truth 已更新,但 progress view 仍停留在旧状态 | `MaintenanceProgressView` | 只能形成 `ProgressStale` / stale progress surface;不得从 progress 反推 task truth 未变。 |
| run / scope progress 当前不可读或缺少必要安全摘要 | `MaintenanceProgressView` | 只能形成 `ProgressUnavailable` / safe unavailable surface;不得折叠成空结果或 success。 |
| pending scope / issue 持续未闭口,progress 只能保持 pending 或 recovery needed 可见面 | `MaintenanceProgressView` | 只能暴露 pending / recovery needed / converging;不得伪装成已收敛。 |
| refresh / recovery 已发生 partial / blocked / intervention,但 progress 读取面尚未给出对应解释 | `MaintenanceProgressView`;`MaintenanceRunHistory` | 只能补足 stale / intervention hint / follow-up visible surface;不得用 worker 细节补全。 |
| 同一 scope 被多个后续 request 替代,当前 progress 只能提供 superseded / historical explanation | `MaintenanceProgressView`;`MaintenanceRunHistory` | 只能保留 superseded hint、current run redirect 或 historical explanation;不得把多个 run 混成单一成功态。 |

#### R1.16.5 `drift detected` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| 上游 truth、boundary 或 external summary 已变化,既有 read material 仍停在旧版本 | `ReadMaterialRefreshTask`;相关 freshness surface | 只能形成 stale / invalidation / refresh needed;不得把 drift 解释为上游 truth 自动失效。 |
| trace / audit / impact / lineage 材料与当前 subject / boundary 不再对齐 | `TraceMaterialRefreshTask`;trace / audit / impact 读取面 | 只能形成 partial / stale / unavailable / follow-up required;不得回写 trace truth 或补正文。 |
| consistency recovery 发现当前 material / diagnostic 与既有保护判断仍未收敛 | `ConsistencyRecoveryTask`;`MaintenanceProgressView` | 只能形成 recovery needed / pending acknowledgement / intervention hint;不得自动覆盖原 protection / formalization 结果。 |
| progress view 显示 converging 或 stale,说明任务收敛面落后于最新 refresh / recovery truth | `MaintenanceProgressView` | 只能表达可见漂移和 follow-up,不得把 progress drift 写成 worker 故障或 truth rollback。 |
| 历史 run 已记录 superseded / intervention,当前 scope 仍可见旧漂移线索 | `MaintenanceRunHistory`;`MaintenanceProgressView` | 只能保留 historical drift explanation / superseded hint;不得把旧 run 结果升级为当前闭口结论。 |

#### R1.16.6 maintenance 红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| `Job 不修 core truth` | 所有 refresh / recovery job | job 只刷新派生材料、推进收敛、写 progress / issue / history,不得修 definition、formal version、relation、external summary 或 package truth。 |
| `Progress 不替代 task truth` | `MaintenanceProgressView`;pending scope read | progress 只复制 task / recovery 可见结果,不得倒推出 task 已成功、已失败或已 supersede。 |
| `Formal intervention != automatic execution` | `ConsistencyRecoveryTask`;`MaintenanceRunHistory` | formal intervention required 只表示需要正式承接,不得自动执行治理、版本替代、边界调整或外部修复。 |
| `Drift 不等于 truth invalid` | stale / drift / recovery needed 相关主语 | drift 只表达派生材料、诊断或进度落后,不得回滚已成立 truth。 |
| `Maintenance 仍保持 body-free` | trace / audit / impact / external / history 相关 refresh | refresh / recovery 不能复制 raw log、evidence body、report body、artifact body、archive 内容或 provider payload。 |
| `Maintenance 不恢复旧主线` | 全部 maintenance 异常 | 不得恢复 snapshot export、fingerprint recalculation、projection rebuild、outbox replay、worker queue / retry / scheduler 主线。 |
| `Superseded / suspended / rejected 不等于已解决` | maintenance control / recovery 收敛 | 被替代、挂起或拒绝只表示当前路径不能继续,不得伪装成问题已闭口。 |

#### R1.16.7 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| package / method set / discovery 自身 unavailable / invalid composition / partial availability | peripheral package / method set / discovery 异常 | 当前只写 maintenance 任务、收敛与 progress 边界,不写外围主线异常。 |
| handoff failed、downstream unavailable、collaboration blocked | publication / handoff / collaboration 异常 | 当前只写维护刷新与恢复收敛,不重复传播失败主线。 |
| external intake rejected、forbidden body、unresolved ref | external / inbound / body-free 边界异常 | 当前只承接 maintenance 对外部摘要既有结果的 follow-up,不重写 intake 边界。 |
| raw diagnostic、worker log、queue state、retry policy、scheduler config | detailed design / config / implementation later | 属于实现和运维机制,不是概要异常主语。 |
| snapshot export、fingerprint recalculation、replay checkpoint、outbox replay | historical material only / later dedicated design | 当前 maintenance 主线已改由 material freshness、progress 和 recovery 承接。 |
| automatic remediation script、governance execution、manual runbook 正文 | later dedicated design / external system | 当前只允许 body-free intervention hint 和 follow-up。 |

#### R1.16.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 maintenance 异常主语表 | pass | 已固定 refresh task、trace refresh task、recovery task、progress view 和 run history 的异常主语边界。 |
| 是否完成四类异常表 | pass | 已定稿 refresh blocked、recovery pending、progress stalled、drift detected 四类。 |
| 是否完成 maintenance 红线 | pass | 已明确 job 不修 truth、progress 不替代 task truth、formal intervention 不自动执行等红线。 |
| 是否完成分流记录 | pass | 已把 peripheral、publication、external intake 和机制态问题分流到后续模块或后置文档。 |
| 是否写其他异常族正文 | no | 未写 peripheral 主线异常正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 maintenance 模块。 |

#### R1.16.9 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `peripheral package / method set / discovery 异常:先思考`。

下一模块只允许回答:

1. 哪些 package unavailable / assembly stale-invalid / composition rejected / discovery context unavailable 场景必须在概要层点名。
2. 哪些外围失败只影响 package、method set、composition 和 discovery,不得污染核心闭环。
3. 哪些外围失败只允许写 unavailable / invalid composition / partial availability / context unavailable 口径。

下一模块不得写:

- 跨异常一致性审计正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `peripheral package / method set / discovery 异常:先思考`;只思考 package unavailable / assembly stale-invalid / composition rejected / discovery context unavailable 分类、不得污染核心闭环的红线和后续分流项,不得写跨异常一致性审计正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.17 peripheral package / method set / discovery 异常:先思考

#### R1.17.1 本模块必读文档

本模块只思考 `peripheral package / method set / discovery` 异常家族的主语范围、分类框架和红线,不直接写异常正文表。

| 文档 | 本模块使用方式 | 当前读取结论 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md` `R1.16` | 承接上一模块已收稳的 maintenance 红线,避免把外围 unavailable 混成 maintenance task failure。 | 已确认维护异常只承接 refresh / recovery / progress,外围主线需单独成族。 |
| `design-calibration/02_hld_step_09_state_machine.md` `R1.21`~`R1.22` | 提供 package、assembly、composition、view availability 和 history / discovery context 的正式 owner 与状态边界。 | 已确认外围 truth、composition disposition 与外围 view 分层成立,且 `外围不可用不污染核心` 已在状态层闭口。 |
| `design-calibration/02_hld_step_08_processing_flows.md` `R1.23`~`R1.24` | 提供 package lifecycle、assembly lifecycle、composition evaluation、peripheral read 和 event candidate 的处理流来源。 | 已确认外围 flow 只承接 package / method set / discovery 语义,不进入 marketplace 交易 / 安装 / 履约。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` `R1.24`~`R1.45` | 校对外围 Command / Query / Event 的正式入口,避免回流旧 P1 plugin / configuration 接口。 | 已确认外围异常必须回指 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、view / discovery Query 和外围 event candidate。 |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 只参考异常模块组织方式、停审结构和“先收红线,再写正文”的深度。 | governance 无同名外围异常族,这里只借结构,不借任何治理语义。 |

#### R1.17.2 本模块问题

当前需要先回答的不是“外围异常总表怎么排版”,而是以下四个前置问题:

1. 哪些对象有资格成为外围异常主语,哪些只能作为 discovery context、history 或 maintenance hint 的辅助传播面。
2. package unavailable、assembly stale-invalid、composition rejected、discovery context unavailable 四类异常分别对应哪组正式对象和处理流。
3. 哪些外围失败只允许影响 package、method set、composition 和 discovery,不得污染 definition、formalization、consumption、trace 或 relation 核心闭环。
4. 哪些旧 P1 / marketplace / runtime 语义最容易污染本模块,必须在再写入前先排除。

#### R1.17.3 当前来源判断

从当前 Step 7~9 的正式输入看,外围异常必须按“peripheral truth / composition disposition / discovery-view surface”三层来源收口:

| 来源层 | 当前判断 | 对本模块的约束 |
|---|---|---|
| peripheral truth | `MethodPackage`;`MethodSetAssembly` 是外围组织真相源。 | package unavailable、assembly stale-invalid 必须优先回指外围 truth,不得拿 view、Query 结果或 maintenance hint 替代。 |
| composition / boundary disposition | `PackageCompositionRule` 是外围组合与边界裁决来源。 | composition rejected 只能从 rule / diagnostic 输出推导,不得私补成员 truth 修复或 boundary 自动扩权。 |
| discovery / view / history surface | `MethodPackageView`;`MethodSetAssemblyView`;`PackageAssemblyHistory` / discovery context 只提供外围读取、发现和历史解释。 | discovery context unavailable、partial availability、invalid composition 只能停留在外围 view / discovery surface,不得反写 package / assembly truth。 |

补充判断:

- 当前 `PackageReady` / `AssemblyReady` 只表示外围对象在本层可用,不是“已安装 / 已采用 / 已履约 / 已运行成功”。
- 当前 `PackageViewMarketplaceContextUnavailable` 只表示发现上下文不可用,不是 listing、order、purchase、install truth。
- 当前 `AssemblyViewPartiallyAvailable` 只表示部分外围材料可读,不是整体 assembly ready 或核心闭环失败。
- 当前 `RefreshPeripheralReadMaterials` 只刷新外围 read material / view,不拥有外围 truth repair 资格。

#### R1.17.4 外围异常主语范围

本模块当前接受的外围异常主语范围如下:

| 主语 | 当前角色 | 允许承载的异常 | 当前不允许承载 |
|---|---|---|---|
| `MethodPackage` | peripheral package truth owner | draft / ready / retired / unavailable;member / context unavailable;package 退役或隔离。 | definition truth、formal version、relation、consumption boundary 或 trace truth 失效。 |
| `MethodSetAssembly` | method set assembly truth owner | draft / ready / stale / retired / unavailable;依赖 package / member / context 变化后的复核。 | 组织运行成功事实、下游采用成功事实、核心闭环失败。 |
| `PackageCompositionRule` | composition / boundary disposition owner | accepted、rejected、invalid member or boundary、context unavailable。 | 成员 truth 自动修复、正式版本替代、consumption boundary 自动调整。 |
| `MethodPackageView` | package read / discovery view owner | fresh、stale、invalid member、marketplace context unavailable、view unavailable。 | package truth 替代、package body、listing payload、交易 / 安装状态。 |
| `MethodSetAssemblyView` | assembly read / discovery view owner | fresh、stale、invalid composition、partially available、view unavailable。 | assembly truth 替代、组织配置正文、UI / SDK / AI override、runtime state。 |
| `PackageAssemblyHistory` / discovery context | 历史解释与外围发现辅助面 | superseded history、retired / unavailable explanation、context unavailable、safe discovery summary。 | 当前 truth owner、商业排序、交易履约、安装成功事实。 |

当前范围判断:

- `MethodPackage` 是 package unavailable 的主异常 owner。
- `MethodSetAssembly` 是 assembly stale / unavailable 的主异常 owner。
- `PackageCompositionRule` 是 composition rejected / invalid / context unavailable 的主异常 owner。
- `MethodPackageView`、`MethodSetAssemblyView` 是 discovery 可见性、partial / stale / unavailable 的外围读取面 owner。
- `PackageAssemblyHistory` / discovery context 当前只作为辅助解释面,再写入时如需出现,也只能落在分流记录、历史提示或外围发现上下文说明。

#### R1.17.5 分类框架

本模块后续异常正文建议固定为以下四类:

| 分类 | 主 owner | 典型触发 | 当前概要口径 |
|---|---|---|---|
| package unavailable | `MethodPackage`;`MethodPackageView` | member ref unavailable、context unavailable、composition 前提失效、package 显式隔离。 | 只形成 unavailable / retired / view unavailable / refresh needed surface,不得让核心闭环失败。 |
| assembly stale-invalid | `MethodSetAssembly`;`MethodSetAssemblyView` | package / member / boundary / adoption context changed、assembly stale、view invalid / partial。 | 只形成 stale / invalid composition / partially available / unavailable,不得扩大消费授权或声明下游采用成功。 |
| composition rejected | `PackageCompositionRule` | rule rejected、invalid member or boundary、context unavailable。 | 只形成 accepted / rejected / invalid / unavailable diagnostic,不得自动修成员 truth 或 package / assembly truth。 |
| discovery context unavailable | `MethodPackageView`;`MethodSetAssemblyView`;discovery context | marketplace / distribution / ecosystem context unavailable、view source unavailable、外围发现上下文缺失。 | 只形成 context unavailable / stale / safe discovery absence,不得进入 listing、价格、订单、安装、履约语义。 |

当前不建议扩成更多类别,原因如下:

| 候选扩展 | 当前处理 |
|---|---|
| marketplace listing / order / purchase / install / fulfillment failed | 排除,属于边界外商业与履约系统。 |
| package binary / artifact archive / archive export failure | 排除,不属于外围 organization truth。 |
| UI preset / SDK profile / AI override unavailable | 排除,属于客户端或运行态配置。 |
| peripheral refresh job failed | 后置到 maintenance / refresh / reconciliation 模块,当前这里只承接外围 truth / view / discovery 异常。 |

#### R1.17.6 触发来源与 peripheral 红线

外围异常必须同时回指当前触发来源和固定红线:

| 触发来源 | 允许导向的外围异常 | 红线 |
|---|---|---|
| `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable` | package unavailable、package retired、package context unavailable、package view stale hint。 | 不得创建核心定义、正式版本或 relation truth,不得把 package 不可用写成核心闭环失败。 |
| `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable` | assembly stale-invalid、assembly unavailable、assembly retired、partial availability hint。 | 不得扩大 consumption boundary、替代正式消费材料或表示组织运行成功。 |
| `EvaluatePackageComposition` | composition rejected、invalid member or boundary、context unavailable。 | 不得自动修成员 truth、自动放开边界或把 composition 规则变成 policy engine / algorithm 主线。 |
| `GetMethodPackage*`;`GetMethodSetAssembly*`;`GetPeripheralDiscoveryContext` | discovery context unavailable、view stale / unavailable、partial / invalid composition 可见面。 | Query 只读,不得创建 / 修复 package / assembly,不得做 ranking、推荐、交易或安装判断。 |
| `RefreshPeripheralReadMaterials`;`PeripheralViewAvailabilityChanged` | stale / unavailable / partial 的外围 view 可见面。 | 只刷新 view / material,不得回写 package / assembly truth,不得让外围维护越过核心边界。 |

本模块当前 peripheral 红线固定如下:

| 红线 | 当前口径 |
|---|---|
| `外围不可用不污染核心` | package / assembly / discovery context unavailable 只影响外围读取、history、discovery 和 event candidate,不得让 definition、formalization、consumption、trace 或 relation 失效。 |
| `composition 不修核心` | `PackageCompositionRule` 只输出 accepted / rejected / invalid / unavailable 诊断,不得自动修成员 truth、正式版本、boundary 或 external summary。 |
| `discovery 不等于商业履约` | discovery context 只返回 body-free refs 和 safe summary,不得进入 listing、价格、订单、安装、履约或授权成功事实。 |
| `view 不替代 truth` | `MethodPackageView`、`MethodSetAssemblyView` 只表达 fresh / stale / unavailable / partial 的读取面,不得替代 package / assembly truth。 |
| `外围保持 body-free` | package / assembly / discovery 异常仍不得带入 package body、artifact/archive body、listing payload、runtime config 或 UI / SDK 正文。 |
| `外围不恢复旧 P1 主线` | 不得恢复 `MethodPlugin`、`MethodConfiguration`、旧 P1 发布 / 激活 / marketplace 语义。 |
| `stale / partial / unavailable 不是 adoption success/failure` | 外围读取面术语只在当前 owner 层成立,不得跨层解释为“组织已采用”或“采用失败导致核心无效”。 |

#### R1.17.7 当前排除项

以下内容在本模块先思考阶段明确排除:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| marketplace listing、price、order、purchase、install、fulfillment | 属于边界外商业 / 履约 truth。 | 外部系统或后置设计。 |
| package body、artifact body、archive 内容、listing payload | 当前外围只允许 body-free package / assembly / discovery 语义。 | 03 / 外部系统。 |
| organization runtime config、UI preset、SDK profile、AI override | 属于运行态或客户端配置,不是外围组织异常主语。 | 客户端 / 运行时设计。 |
| ranking / recommendation / search algorithm | discovery 只返回 safe refs / summary,不做商业排序或推荐。 | marketplace / search 系统。 |
| maintenance task / progress / recovery pending | 属于上一模块 maintenance / refresh / reconciliation 异常。 | `R1.15` / `R1.16`。 |
| handoff failed、downstream unavailable、collaboration blocked | 属于传播失败主线。 | `R1.13` / `R1.14`。 |

#### R1.17.8 下一写入批次边界

下一批 `peripheral package / method set / discovery 异常:再写入` 只允许写:

1. peripheral 异常主语表。
2. `package unavailable` 异常表。
3. `assembly stale-invalid` 异常表。
4. `composition rejected` 异常表。
5. `discovery context unavailable` 异常表。
6. peripheral 红线表。
7. 分流记录。
8. 本模块停审记录和下一模块边界。

下一批不得写:

- 跨异常一致性审计正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

#### R1.17.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只收稳必读文档、主语范围、分类框架、红线和排除项。 |
| 是否把外围写成核心前置 | no | 已固定 `外围不可用不污染核心`。 |
| 是否把 discovery 写成商业履约 | no | discovery 只保留 body-free context / summary / refs。 |
| 是否把 view 当 truth | no | 已固定 package / assembly view 只是读取面。 |
| 是否回流旧 P1 主线 | no | 已继续排除 plugin / configuration / listing / install 语义。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 peripheral 模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `peripheral package / method set / discovery 异常:再写入`;只写 peripheral 异常主语表、package unavailable / assembly stale-invalid / composition rejected / discovery context unavailable 四类异常表、peripheral 红线表、分流记录和停审记录,不得写跨异常一致性审计正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.18 peripheral package / method set / discovery 异常:再写入

#### R1.18.1 peripheral 异常主语表

本表只确定外围异常的正式主语和异常承载边界,不代替后续 Step 10 总览表。

| peripheral 主语 | 主要产生入口 | 典型异常关注点 | 不允许继续 |
|---|---|---|---|
| `MethodPackage` | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable` | member / context unavailable、package retired、package isolated、外围组织不可用 | 不得把 package unavailable 写成 definition、formal version、relation、consumption 或 trace truth 失效。 |
| `MethodSetAssembly` | `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable` | dependency changed、assembly stale、assembly unavailable、retired / revalidation needed | 不得扩大 consumption boundary、替代正式消费材料或表示组织运行成功。 |
| `PackageCompositionRule` | `EvaluatePackageComposition`;package / assembly lifecycle 内 composition check | composition rejected、invalid member or boundary、context unavailable、safe diagnostic needed | 不得自动修成员 truth、正式版本、boundary、external summary 或 package / assembly truth。 |
| `MethodPackageView` | `GetMethodPackageView`;`ListMethodPackages`;`PeripheralViewAvailabilityChanged`;外围 read refresh hint | package view stale、invalid member、marketplace context unavailable、view unavailable | 不得替代 package truth,不得带入 package body、listing payload、交易 / 安装状态。 |
| `MethodSetAssemblyView` | `GetMethodSetAssemblyView`;`ListMethodSetAssemblies`;`PeripheralViewAvailabilityChanged`;外围 read refresh hint | assembly view stale、invalid composition、partially available、view unavailable | 不得替代 assembly truth,不得带入组织配置正文、UI / SDK / runtime 状态。 |
| `PackageAssemblyHistory` / discovery context | `GetPackageAssemblyHistory`;`GetPeripheralDiscoveryContext`;package / assembly changed | historical supersede / retire / unavailable explanation、discovery context unavailable、safe absence | 不得变成当前 truth owner、marketplace ranking / 履约 / 安装成功事实。 |

#### R1.18.2 `package unavailable` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| package 成员引用、distribution / marketplace context 或 composition 前提当前不可用 | `MethodPackage` | 只能形成 `PackageUnavailable` / safe reason / follow-up hint;不得让核心方法资产、正式版本或关系 truth 失效。 |
| package 已被显式 retire 或 unavailable,外围读取面仍需保留安全历史解释 | `MethodPackage`;`PackageAssemblyHistory` | 只能形成 retired / unavailable / historical explanation;不得硬删除 package 历史或旧引用。 |
| package truth 已变化但 package view / discovery 仍未跟上 | `MethodPackageView`;`MethodPackage` | 只能形成 stale / refresh needed / unavailable surface;不得把旧 view 伪装成 current truth。 |
| package view 命中 invalid member 或 context unavailable | `MethodPackageView`;`PackageCompositionRule` | 只能形成 invalid member / marketplace context unavailable / safe diagnostic;不得自动修成员或补商业上下文。 |
| 外围 refresh 只能标记 package view / discovery 不可用,但不拥有 package truth 修复权 | `MethodPackageView`;maintenance hint | 只能形成 view unavailable / maintenance follow-up;不得由 refresh job 回写 `MethodPackage` truth。 |

#### R1.18.3 `assembly stale-invalid` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| 依赖的 package、member、boundary 或 adoption context 变化,assembly 进入待复核状态 | `MethodSetAssembly` | 只能形成 `AssemblyStale` / revalidation needed / safe history hint;不得扩大消费授权或声明核心闭环失败。 |
| assembly 被显式标记 unavailable,但核心 definition / formalization / consumption 仍独立成立 | `MethodSetAssembly` | 只能形成 `AssemblyUnavailable` / isolated peripheral surface;不得把外围不可用升级为核心不可用。 |
| assembly view 发现 invalid composition 或 only partial members/packages currently readable | `MethodSetAssemblyView`;`PackageCompositionRule` | 只能形成 invalid composition / partially available / unavailable;不得把 partial 写成整体 ready。 |
| assembly retire / supersede 后,外围读取仍需保留历史线索和安全解释 | `MethodSetAssembly`;`PackageAssemblyHistory` | 只能形成 retired / superseded explanation / discovery warning;不得删除历史或冒充当前 assembly。 |
| assembly stale / unavailable 只允许推动外围 refresh hint,不能触发核心 truth 自动修复 | `MethodSetAssembly`;maintenance hint | 只能形成 stale / refresh needed / unavailable surface;不得引发 relation、formal version 或 external summary truth 改写。 |

#### R1.18.4 `composition rejected` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| package / assembly 组合结果不满足当前外围规则 | `PackageCompositionRule` | 只能形成 `CompositionRejected` / safe reason refs / diagnostic surface;不得自动修成员 truth 或 package / assembly truth。 |
| 发现 invalid member ref 或 boundary mismatch | `PackageCompositionRule` | 只能形成 `CompositionInvalidMemberOrBoundary`;不得自动补成员、改 boundary 或放宽消费边界。 |
| distribution / marketplace / adoption context 当前不可用 | `PackageCompositionRule`;discovery context | 只能形成 `CompositionContextUnavailable` / safe unavailable;不得发明商业上下文或安装前提。 |
| composition diagnostic 已给出 rejected / invalid,外围 view 只能反映诊断结果 | `MethodPackageView`;`MethodSetAssemblyView` | 只能形成 invalid member / invalid composition / unavailable view;不得回写 truth 或把拒绝折叠成 not found。 |
| 组合结果变化只应传播到外围 history、discovery 和 event candidate | `PackageCompositionRule`;`PackageAssemblyHistory` | 只能形成 diagnostic change / history explanation / event candidate;不得触发核心 truth repair。 |

#### R1.18.5 `discovery context unavailable` 异常表

| 场景 | 影响主语 | 概要口径 |
|---|---|---|
| marketplace / distribution / ecosystem context 当前不可用 | `MethodPackageView`;`MethodSetAssemblyView`;discovery context | 只能形成 context unavailable / safe discovery absence;不得进入 listing、price、order、install、fulfillment 语义。 |
| discovery 依赖的外围 view source 暂不可读或 freshness 落后 | `MethodPackageView`;`MethodSetAssemblyView` | 只能形成 stale / unavailable / refresh needed;不得把发现上下文缺失解释为 package / assembly truth 失效。 |
| 只能读取到部分 package / assembly / member discovery material | `MethodSetAssemblyView`;discovery context | 只能形成 partially available / safe subset readable;不得把 partial 写成 adopted / installed success。 |
| history / discovery Query 只能返回 body-free refs 与 safe summaries | discovery context;`PackageAssemblyHistory` | 只能保留 safe context summary、history page、absence / unavailable hint;不得返回 package body、runtime config、marketplace payload。 |
| discovery unavailable 只应影响外围发现与可见性,不得反向阻断核心流程 | `MethodPackageView`;`MethodSetAssemblyView`;event candidate | 只能形成 discovery warning / view unavailable / candidate follow-up;不得反向令核心闭环失败。 |

#### R1.18.6 peripheral 红线表

| 红线 | 适用范围 | 当前口径 |
|---|---|---|
| `外围不可用不污染核心` | package / assembly / discovery context 相关异常 | unavailable / stale / invalid 只影响外围读取、history、discovery 和 event candidate,不得让 definition、formalization、consumption、trace 或 relation 失效。 |
| `composition 不修核心` | `PackageCompositionRule`;composition diagnostic | 组合规则只输出 accepted / rejected / invalid / unavailable 诊断,不得自动修成员 truth、正式版本、boundary 或 external summary。 |
| `discovery 不等于商业履约` | discovery context / peripheral Query | discovery 只返回 body-free refs 和 safe summaries,不得进入 listing、价格、订单、购买、安装、履约或授权成功事实。 |
| `view 不替代 truth` | `MethodPackageView`;`MethodSetAssemblyView` | view 只表达 fresh / stale / unavailable / partial / invalid 的读取面,不得替代 package / assembly truth。 |
| `外围保持 body-free` | package / assembly / discovery 异常主语 | 不得带入 package body、artifact/archive body、listing payload、runtime config、UI preset、SDK profile 或 AI override 正文。 |
| `外围不恢复旧 P1 主线` | 全部 peripheral 异常 | 不得恢复 `MethodPlugin`、`MethodConfiguration`、旧 P1 发布 / 激活 / marketplace 主线。 |
| `partial / stale / unavailable 不是 adoption success/failure` | assembly view / discovery context / history | 这些术语只在当前 owner 层成立,不得跨层解释为“组织已采用”或“采用失败导致核心无效”。 |
| `Query no-write` | peripheral read / discovery Query | Query 只读 package、assembly、view、diagnostic、history 和 context,不得创建 / 修复 package / assembly truth,不得做 ranking、推荐或商业筛选。 |

#### R1.18.7 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| 阻断 / 降级 / 外部边界 / 传播失败 / maintenance 红线之间是否互相冲突 | 跨异常一致性审计 | 当前只写外围主线异常,不做全 Step 10 统一审计。 |
| marketplace listing、price、order、purchase、install、fulfillment | 外部系统或后置设计 | 属于边界外商业 / 履约 truth。 |
| package body、artifact body、archive 内容、runtime config | detailed design / external system later | 当前外围只允许 body-free 组织与发现语义。 |
| maintenance task / progress / refresh / recovery 问题 | maintenance / refresh / reconciliation 异常 | 当前不重写维护主线。 |
| handoff failed、downstream unavailable、collaboration blocked | publication / handoff / collaboration 异常 | 当前不重写传播失败主线。 |
| 旧 P1 plugin / configuration / marketplace 主线污染 | 旧材料差异审计 | 当前只承接当前外围语义,历史污染后置统一审计。 |

#### R1.18.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 peripheral 异常主语表 | pass | 已固定 package、assembly、composition、view、history / discovery context 的异常主语边界。 |
| 是否完成四类异常表 | pass | 已定稿 package unavailable、assembly stale-invalid、composition rejected、discovery context unavailable 四类。 |
| 是否完成 peripheral 红线 | pass | 已明确外围不可用不污染核心、composition 不修核心、discovery 不等于商业履约等红线。 |
| 是否完成分流记录 | pass | 已把跨异常审计、商业 / 履约、maintenance、传播失败和旧主线污染分流到后续模块。 |
| 是否写跨异常一致性审计正文 | no | 未写全 Step 10 统一审计正文。 |
| 是否写异常影响图 | no | 未写图正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 peripheral 模块。 |

#### R1.18.9 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `跨异常一致性审计:先思考`。

下一模块只允许回答:

1. 当前六个异常族之间,哪些红线必须做统一一致性审计。
2. 哪些地方最容易出现“阻断 / 降级 / 不回滚 truth / 不反写 truth / 不由 Query 或 Job 私补”口径冲突。
3. 旧主线污染、读取降级、外围隔离、maintenance 红线和传播失败之间,哪些要在正式 §10 前统一复核。

下一模块不得写:

- 旧材料差异审计正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 10 `跨异常一致性审计:先思考`;只思考阻断 / 降级 / 不回滚 truth / 不反写 truth / 不由 Query 或 Job 私补 的统一审计维度、冲突点和复核范围,不得写旧材料差异审计正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.19 跨异常一致性审计:先思考

#### R1.19.1 本模块必读文档

本模块只思考 Step 10 六个异常族之间需要统一复核的审计维度、冲突点和复核范围,不直接写统一审计正文表。

| 文档 | 本模块使用方式 | 当前读取结论 |
|---|---|---|
| `design-calibration/02_hld_step_10_exceptions_boundaries.md` `R1.8`;`R1.10`;`R1.12`;`R1.14`;`R1.16`;`R1.18` | 汇总六个异常族各自已经定稿的主语、红线和分流记录。 | 已确认六族都已闭合本族红线,当前缺的是跨族一致性复核。 |
| `design-calibration/02_hld_step_09_state_machine.md` `R1.24.5`;`R1.31` | 提供全局 Query / Job / propagation 红线和单向传播主线。 | 已确认 `Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery`、`外部缺失不回滚 truth`、`外围不可用不污染核心`、`maintenance progress 不替代 task truth` 已在状态层闭口。 |
| `design-calibration/02_hld_step_08_processing_flows.md` `R1.3.4`;`R1.6.7`;`R1.26` | 提供五类处理流骨架和跨处理流审计中已经固定的 no-write / no-truth-repair 口径。 | 已确认 Command / Query / Inbound / Job / Outbound candidate 的边界在处理流层也已闭口。 |
| `design-calibration/02_hld_calibration_flow.md` | 确认当前只允许进行跨异常一致性审计:先思考。 | 当前不得提前进入旧材料差异审计、正式 §10 回填草稿或 Step 11。 |
| `design-calibration/project_execution_ledger.md` | 确认恢复点和不得跳步。 | 当前恢复点只允许完成 `R1.19`。 |

#### R1.19.2 本模块问题

当前需要先回答的不是“统一审计表怎么排版”,而是以下四个前置问题:

1. 六个异常族之间,哪些红线必须提升为 Step 10 统一审计轴。
2. 哪些局部口径最容易发生冲突,例如同一个 `stale / unavailable / pending` 被误写成不同层级的事实。
3. 哪些地方最容易滑向 `Query 私补`、`Job 私补`、`传播失败回滚 truth` 或 `外围失败污染核心`。
4. 哪些问题属于统一审计范围,哪些应继续留给旧材料差异审计或正式 §10 回填阶段处理。

#### R1.19.3 当前统一审计输入判断

从当前 Step 8~10 的正式输入看,跨异常一致性审计应以“三层输入”收口:

| 输入层 | 当前判断 | 对本模块的约束 |
|---|---|---|
| 全局传播与读写红线 | Step 9 已锁定 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery` 的单向传播主线。 | 统一审计不得发明反向传播,不得把 view / progress / history 画成 truth owner。 |
| 五类接口边界 | Step 8 已锁定 Command、Query、Inbound、Operations Job、Outbound Event candidate 的职责边界。 | 统一审计必须优先检查是否有异常族偷偷让 Query / Job / Outbound 越权。 |
| 六个异常族局部定稿 | Step 10 的 core truth、read degradation、external boundary、publication、maintenance、peripheral 六族都已写完本族主语和红线。 | 当前只审“六族之间是否冲突”,不重写各族正文。 |

补充判断:

- 当前统一审计不是在新增第七类异常,而是在复核六类异常是否共享同一套真相源和传播红线。
- 当前统一审计不能替代旧材料差异审计;凡涉及旧 `MethodContent` / outbox / snapshot / P1 主线污染的内容,应在下一模块处理。
- 当前统一审计也不直接进入正式 §10 回填,因为还没有完成跨族口径复核。

#### R1.19.4 统一审计维度候选

本模块后续统一审计建议固定为以下六个维度:

| 审计维度 | 统一问题 | 主要对照来源 |
|---|---|---|
| 阻断与降级分层 | 哪些失败必须阻断 truth 写路径,哪些只能降级为 view / material / diagnostic / discovery surface。 | `R1.8`;`R1.10`;`R1.12`;`R1.18` |
| `Query no-write` 一致性 | 是否任何异常族把 Query、history read、discovery read 或 progress read 写成了 create / refresh / repair / confirm。 | Step 9 `R1.24.5`;`R1.10`;`R1.18` |
| `Job 不修 core truth` 一致性 | 是否任何 maintenance / refresh / peripheral read refresh hint 被写成 truth repair。 | Step 8 `R1.26`;`R1.16`;`R1.18` |
| truth 不回滚一致性 | 是否任何 external unavailable、publication failure、drift、peripheral unavailable 被写成已成立 truth 失效或回滚。 | `R1.12`;`R1.14`;`R1.16`;`R1.18` |
| 传播与协作边界一致性 | 是否任何 event candidate、handoff、history、progress 或 discovery 被误写成 delivery、adoption success 或 closed-loop completion。 | Step 9 `R1.24.5`;`R1.14`;`R1.16`;`R1.18` |
| truth / view / progress / history owner 分层一致性 | 是否任何异常主语把 truth、view、progress、history、diagnostic 的 owner 混层。 | Step 9 `R1.31`;`R1.10`;`R1.16`;`R1.18` |

当前不建议继续扩维,原因如下:

| 候选扩展 | 当前处理 |
|---|---|
| 错误码、HTTP/RPC 状态、DTO schema 审计 | 排除,属于详细设计。 |
| retry / dead letter / queue / scheduler 一致性 | 排除,属于实现 / 运维机制。 |
| 正式文档章节编排审计 | 后置到正式 §10 回填草稿与自检停审。 |

#### R1.19.5 高风险冲突点池

当前最需要在 `再写入` 中统一复核的冲突点如下:

| 冲突点 | 当前风险 | 需要统一确认的口径 |
|---|---|---|
| 写路径阻断 vs 读取降级 | 容易把应该 rejected / blocked 的 truth 写入问题,误写成 stale / unavailable 读取问题。 | truth 未成立时必须阻断;只有已成立 truth 的读取面才允许 degraded / stale / unavailable。 |
| external / inbound 边界 vs core truth | 容易把 body-free / unresolved ref / forbidden body 的问题,误补成 formalization / relation / package 可继续推进。 | external 缺口只能 blocked / pending / rejected,不得绕过 body-free 边界进入 truth。 |
| publication failure vs truth rollback | 容易把 handoff failed / downstream unavailable 写成 event source 或上游 truth 无效。 | candidate / handoff 失败只影响传播面,不得回滚既有 truth。 |
| maintenance drift vs truth invalid | 容易把 stale / recovery needed / progress stalled 写成 definition、formal version 或 relation 失效。 | drift 只表达派生材料 / progress / recovery 落后,不得回滚 truth。 |
| peripheral unavailable vs core failure | 容易把 package / assembly / discovery 不可用写成核心闭环失败。 | peripheral 只影响外围 view / history / discovery / candidate,不得污染核心。 |
| `partial` / `pending` / `unavailable` 术语混层 | 同一个词可能在 trace、maintenance、peripheral 中被误读为同一个层级。 | 必须按 owner 解释术语,不能跨层互借语义。 |
| history / progress / event candidate 冒充 current truth | 传播、维护和外围模块最容易把解释面写成真相源。 | history 只解释,progress 只可见,candidate 只候选,都不得替代 current truth。 |

#### R1.19.6 复核范围与排除项

本模块统一审计应覆盖以下范围:

| 复核范围 | 当前判断 |
|---|---|
| 六个异常族的主语、红线、分流记录是否互相兼容 | yes |
| `Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery` 等全局红线是否在六族中持续成立 | yes |
| truth / view / progress / history / diagnostic / discovery 的 owner 分层是否被某个异常族打破 | yes |
| `stale / unavailable / pending / partial / rejected / blocked` 这些高频词是否在跨族使用时滑义 | yes |

以下内容当前不进入统一审计:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| 旧 `MethodContent` / outbox / snapshot / fingerprint / P1 主线污染明细 | 属于历史污染审计,不是当前跨族一致性本体。 | 旧材料差异审计。 |
| 正式 §10 章节结构、回填文案长短、是否要画图 | 属于文档装配问题。 | 正式 §10 回填草稿 / 自检停审。 |
| 实现态 queue / retry / dead letter / scheduler / cache | 属于机制态,非概要异常统一审计。 | 03 / 04 / 07。 |

#### R1.19.7 下一写入批次边界

下一批 `跨异常一致性审计:再写入` 只允许写:

1. 审计输入声明。
2. 统一审计维度表。
3. 高风险冲突点审计表。
4. 六个异常族交叉一致性检查表。
5. 全局红线复核表。
6. 分流记录。
7. 本模块停审记录和下一模块边界。

下一批不得写:

- 旧材料差异审计正文
- 异常影响图正文
- 正式 §10 回填草稿
- 正式 `02-概要设计.md`

#### R1.19.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只收稳必读文档、统一审计维度、冲突点和复核范围。 |
| 是否重写六个异常族正文 | no | 当前只做跨族一致性准备。 |
| 是否把历史污染审计提前写入 | no | 旧主线污染后置到下一模块。 |
| 是否把正式 §10 回填提前写入 | no | 当前未进入正式回填阶段。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 跨异常一致性审计模块。 |

next_allowed_action: 等待用户确认后进入 Step 10 `跨异常一致性审计:再写入`;只写审计输入声明、统一审计维度表、高风险冲突点审计表、六个异常族交叉一致性检查表、全局红线复核表、分流记录和停审记录,不得写旧材料差异审计正文、异常影响图正文或正式 §10 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.20 跨异常一致性审计:再写入

#### R1.20.1 审计输入声明

本模块只做 Step 10 六个异常族的交叉一致性审计,不新增第七类异常,不重写各族正文,也不进入旧材料差异审计或正式 §10 回填。

本轮统一审计输入限定为:

| 输入 | 使用方式 |
|---|---|
| `R1.8` core truth 写路径阻断异常 | 检查哪些失败必须停在 blocked / rejected,不得被后续模块降级或私补。 |
| `R1.10` Query / view / material 降级异常 | 检查哪些 stale / unavailable / partial / degraded 只属于读取面。 |
| `R1.12` external / inbound / body-free 边界异常 | 检查外部缺口是否被误写成 truth 已成立或可被 maintenance / peripheral 补口。 |
| `R1.14` publication / handoff / collaboration 异常 | 检查传播失败是否被误写成上游 truth 回滚或当前闭口。 |
| `R1.16` maintenance / refresh / reconciliation 异常 | 检查 drift / progress / recovery 是否被误写成 truth invalid 或 truth repair。 |
| `R1.18` peripheral package / method set / discovery 异常 | 检查外围 unavailable / invalid / partial 是否被误写成核心失败。 |
| Step 9 `R1.24.5`;`R1.31` | 作为全局红线和单向传播主线的统一判定基线。 |
| Step 8 `R1.26` | 作为 Query no-write、Job 不修 core truth、event candidate 不等于 delivery 的处理流审计基线。 |

当前审计方法固定为:

- 先看异常所属层: truth / boundary / view / material / diagnostic / progress / history / discovery。
- 再看接口类别: Command / Query / Inbound / Job / Outbound candidate。
- 最后看传播方向: 是否仍符合 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。

#### R1.20.2 统一审计维度表

| 审计维度 | 统一判断问题 | 当前审计结论 |
|---|---|---|
| 阻断 vs 降级 分层 | 哪些失败必须阻断写路径,哪些只能降级到读取 / 诊断 / 发现 surface。 | pass_with_guard: truth 未成立时必须 blocked / rejected;已成立 truth 才允许 stale / unavailable / partial / degraded。 |
| `Query no-write` | Query、history read、discovery read、progress read 是否有 create / refresh / repair / confirm 副作用。 | pass:六族都未要求 Query 建立 truth、刷新 view、确认 issue 或启动 job。 |
| `Job 不修 core truth` | refresh / recovery / peripheral read refresh 是否有 truth repair。 | pass:Job 只刷新派生材料、推进收敛、记录 progress / history,未要求修 definition、formal version、relation、external summary、package truth。 |
| truth 不回滚 | external unavailable、publication failure、maintenance drift、peripheral unavailable 是否回滚已成立 truth。 | pass_with_guard:当前六族都未要求回滚 truth,但正式 §10 回填时要继续防止“失效”文案滑义。 |
| 传播边界 | event candidate、handoff、history、progress、discovery 是否被写成 delivery、adoption success 或 closure。 | pass_with_guard:当前都停留在 candidate / hint / explanation / safe surface,不得升级为 delivery 或 adopted success。 |
| owner 分层 | truth / view / progress / history / diagnostic / discovery 是否混层。 | pass_with_guard:`MaintenanceProgressView`、`PackageAssemblyHistory`、`MethodPackageView` 等解释面未替代 truth,但后续回填需继续强调。 |

#### R1.20.3 高风险冲突点审计表

| 冲突点 | 涉及异常族 | 当前复核结论 |
|---|---|---|
| blocked 被误写成 degraded | `R1.8`;`R1.10`;`R1.12` | pass_with_guard:core truth / boundary 缺口只能 blocked / rejected;读取面才允许 degraded / stale / unavailable。 |
| external 缺口被 maintenance / peripheral 私补 | `R1.12`;`R1.16`;`R1.18` | pass:external 只允许 pending / rejected / unresolved ref;maintenance / peripheral 只能 follow-up,不能绕过 body-free 边界。 |
| publication failure 被解释为 truth 回滚 | `R1.14`;`R1.8`;`R1.16` | pass:handoff failed / downstream unavailable 只影响传播面,不得撤销既有 truth。 |
| drift / stale 被写成 truth invalid | `R1.10`;`R1.16`;`R1.18` | pass_with_guard:stale / drift 只表示读取面、progress、recovery 或外围 view 落后,不表示上游 truth 自动失效。 |
| peripheral unavailable 被解释为核心失败 | `R1.18`;`R1.10`;`R1.16` | pass:package / assembly / discovery 不可用只影响外围发现和读取,不污染核心闭环。 |
| history / progress / candidate 冒充 current truth | `R1.14`;`R1.16`;`R1.18` | pass_with_guard:`history` 只解释,`progress` 只可见,`candidate` 只候选,都未被写成 current truth owner。 |
| partial / pending / unavailable 术语混层 | `R1.10`;`R1.16`;`R1.18` | pass_with_guard:三组术语仍需按 owner 解读,不能跨模块复用成单一业务语义。 |
| Query / Job 私补缺口 | `R1.10`;`R1.12`;`R1.16`;`R1.18` | pass:Query 未刷新 material 或创建 truth;Job 未修 core truth。 |

#### R1.20.4 六个异常族交叉一致性检查表

| 异常族 | 关键红线 | 与其他异常族的兼容性复核 | 结论 |
|---|---|---|---|
| core truth 写路径阻断 | truth 未成立时不得 accepted、不得越权继续 | 与 external / maintenance / peripheral 兼容:后续族都没有把 blocked 写成 accepted 或 deferred success。 | pass |
| Query / view / material 降级 | Query no-write,降级只在读取面成立 | 与 core truth / peripheral / maintenance 兼容:stale / unavailable 未被回写成 truth repair。 | pass |
| external / inbound / body-free 边界 | body-free only,外部缺失不回滚 truth | 与 core truth / maintenance / publication 兼容:未出现 external 缺口被传播成功或 maintenance 自动补正文。 | pass |
| publication / handoff / collaboration | event candidate 不等于 delivery,传播失败不得回滚 truth | 与 core truth / maintenance / peripheral 兼容:传播失败只留在 candidate / handoff / unavailable surface。 | pass |
| maintenance / refresh / reconciliation | Job 不修 core truth,progress 不替代 task truth | 与 Query / external / peripheral 兼容:drift / recovery / progress 只形成 follow-up 和 visible surface。 | pass |
| peripheral package / method set / discovery | 外围不可用不污染核心,discovery 不等于商业履约 | 与 core truth / Query / maintenance / publication 兼容:外围失败未升级为核心失败或 delivery / adoption success。 | pass |

#### R1.20.5 全局红线复核表

| 全局红线 | 本轮复核范围 | 复核结论 |
|---|---|---|
| `Query no-write` | `R1.10`;`R1.12`;`R1.16`;`R1.18` 及对应 Step 9 / Step 8 基线 | pass:未出现 Query 建立 truth、刷新 view、确认 issue、做 ranking 或拉正文。 |
| `Job 不修 core truth` | `R1.16`;`R1.18` 与 Step 8 / Step 9 基线 | pass:read refresh、trace refresh、recovery、peripheral refresh 都只停在派生层。 |
| `event candidate 不等于 delivery` | `R1.14`;`R1.18` 与 Step 9 基线 | pass:current Step 10 仍只讨论 candidate / handoff / availability,未进入 topic、relay、retry、receipt。 |
| `外部缺失不回滚 truth` | `R1.12`;`R1.16` | pass:external unavailable、artifact/ref invalid、forbidden body 都未被写成 truth rollback。 |
| `外围不可用不污染核心` | `R1.18`;`R1.10`;`R1.16` | pass:package / assembly / discovery unavailable 只影响外围读取与发现。 |
| `maintenance progress 不替代 task truth` | `R1.16` | pass:`MaintenanceProgressView` 仍只作为 read model 和可见面。 |
| 单向传播主线不反转 | 六族整体 | pass:当前没有任何 view / history / progress / candidate 反向充当 truth。 |

#### R1.20.6 分流记录

| 内容 | 交给后续模块 | 当前不展开原因 |
|---|---|---|
| 旧 `MethodContent` / outbox / snapshot / fingerprint / P1 主线如何污染当前 Step 10 | 旧材料差异审计 | 属于历史污染核对,不是当前跨族一致性本体。 |
| 正式 §10 最终章节如何压缩、是否要图、如何回填 | 正式 §10 回填草稿 / 自检停审 | 当前只做异常口径一致性,不做正文装配。 |
| 实现态 queue / retry / dead letter / scheduler / adapter cache | detailed design / config / implementation later | 属于机制态,不属于概要异常一致性审计。 |
| 术语长表、反例长表是否需要正式入正文 | 正式 §10 回填草稿 | 当前先判断口径一致,再决定正文摘要化程度。 |

#### R1.20.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成审计输入声明 | pass | 已锁定只使用六个异常族 + Step 8/9 全局基线。 |
| 是否完成统一审计维度表 | pass | 已固定六个统一维度。 |
| 是否完成高风险冲突点审计表 | pass | 已点名 blocked/degraded、truth rollback、Query/Job 私补、外围污染核心等高风险冲突。 |
| 是否完成六族交叉一致性检查 | pass | 已逐族复核与其他异常族的兼容性。 |
| 是否完成全局红线复核 | pass | 已复核 Query / Job / candidate / truth rollback / peripheral / progress 六类全局红线。 |
| 是否写旧材料差异审计正文 | no | 当前未进入 historical pollution 审计。 |
| 是否写正式 §10 回填草稿 | no | 当前未进入正式文档装配。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10 跨异常一致性审计模块。 |

#### R1.20.8 下一模块边界

下一动作必须等待用户确认后进入 Step 10 `旧材料差异审计:先思考`。

下一模块只允许回答:

1. 旧正式 §10 与本文件 historical 内容里,哪些仍带着 `MethodContent` / outbox / snapshot / fingerprint / P1 主线污染。
2. 哪些历史结论还能作为“保留事实”,哪些只能视为污染样本。
3. 当前 Step 10 六个异常族完成后,哪些旧材料必须被显式替换、降级或删除。

下一模块不得写:

- 正式 §10 回填草稿
- 异常影响图正文
- 正式 `02-概要设计.md`
- Step 11 配置影响正文

next_allowed_action: 等待用户确认后进入 Step 10 `旧材料差异审计:先思考`;只思考旧正式 §10 与 historical Step 10 的污染范围、保留事实和替换策略,不得写正式 §10 回填草稿、异常影响图正文或正式 `02-概要设计.md`,不得进入 Step 11。

### R1.21 旧材料差异审计:先思考

#### R1.21.1 本模块目标与输入边界

本模块只为下一批 `旧材料差异审计:再写入` 固定审计方法,不直接写差异正文,也不进入正式 §10 回填草稿。

本轮审计对象只包括两类:

1. 正式 `02-概要设计.md` 当前旧 `§10`,即 `10.1 异常与边界场景表` 和 `10.2 异常影响图`。
2. 本文件顶部 historical material 中仍残留的旧异常主线,尤其是 `MethodContent` / `MethodContentLifecycle`、outbox / relay / dead-letter、snapshot / fingerprint、旧 P1 plugin / configuration 和 marketplace 交易 / 安装语义。

本模块输入来源如下:

| 输入来源 | 本模块用途 | 使用限制 |
|---|---|---|
| 当前 Step 5~9 和 Step 10 `R1.7`~`R1.20` | 作为“当前真相源”,判断旧异常主语、旧影响图和旧传播语义是否仍污染当前 Step 10。 | 不回退到旧主线取结论。 |
| 正式 `02-概要设计.md` §10 | 作为正式旧材料污染对象。 | 只审计,不在本模块修改。 |
| 本文件顶部 historical 段落 | 作为 historical Step 10 污染对象。 | 只审计,不恢复其语义。 |
| Step 8 `R1.26` 和 Step 9 `R1.24.5`;`R1.31` | 提供 `Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery` 和单向传播主线的红线。 | 只作当前清污判定基线。 |
| L1-governance Step 10 和 Step 9 的差异审计框架 | 只参考章节骨架、记录方式和停审结构。 | 不复制 governance 领域语义。 |

本模块不做的事:

- 不直接逐条写正式旧 `§10` 的污染结论。
- 不直接输出正式 `§10` 回填草稿。
- 不直接重写当前六个异常族正文。
- 不修改正式 `02-概要设计.md`。
- 不进入 Step 11 配置影响。

#### R1.21.2 差异审计顺序

旧材料差异审计不能按“看到旧词就删”的方式进行,否则会把仍有价值的边界事实一起抹掉。下一批写入必须按以下顺序:

| 顺序 | 审计层 | 先看什么 | 为什么先看 |
|---:|---|---|---|
| 1 | 异常主语污染 | 旧 `MethodContent`、`MethodContentLifecycle`、`OutboxEvent`、旧 P1 plugin/config 是否仍被当作当前异常 owner。 | owner 一旦错,后面的阻断、降级和传播方向都会一起错。 |
| 2 | 异常分族污染 | 旧“发布阻断 / outbox 失败 / snapshot 恢复 / P1 后置”是否仍覆盖当前六个异常族。 | 必须先拆掉旧单主线,才能判断当前六族是否被压扁。 |
| 3 | 传播与交付污染 | 旧 relay / dead-letter / replay / snapshot query / sync 恢复是否仍被写成当前主传播链。 | 当前只允许 candidate / handoff hint / unavailable / follow-up,不能回到 delivery 主线。 |
| 4 | 读取与维护污染 | 旧 projection rebuild、cache 回源、fingerprint drift、snapshot export 是否仍被写成当前 Query / maintenance 主语。 | 当前这些只能回落到 read material、freshness、maintenance progress 或 recovery hint。 |
| 5 | 外围与商业语义污染 | 旧 P1 plugin / configuration、marketplace listing / transaction / install 是否仍写进当前外围异常。 | 当前外围只允许 package / method set / composition / discovery 语义。 |
| 6 | 图示与正文形态污染 | 旧异常表、影响图、关键说明是否仍把被排除主线画成当前主链。 | 即使文字清理了,图示残留也会反向污染正式文档。 |
| 7 | 保留事实提取 | 哪些旧说法虽然主语错,但仍表达了稳定边界事实。 | 需要把“可保留事实”和“必须删除样本”分开,为下一步回填做准备。 |

顺序裁决:

- 先审主语和分族,再审传播、读取与外围。
- 先判“它是不是污染”,再判“能否萃取为保留事实”。
- 正式旧 `§10` 和 historical Step 10 必须并行比对,但记录时必须分栏,不能混写。

#### R1.21.3 保留事实与污染样本判定维度

下一批再写入时,每条旧材料都要按固定维度审计,避免只做术语替换。

| 维度 | 审计问题 | 当前判定标准 |
|---|---|---|
| owner 维度 | 旧异常是否仍把 `MethodContent`、`OutboxEvent`、plugin/config 当成当前异常 owner。 | 当前 owner 必须来自 Step 5~10 已闭合对象和六个异常族主语。 |
| family 维度 | 旧异常是否仍把当前六族压回“发布 / relay / snapshot / P1”单主线。 | 当前异常必须回到 core truth、Query/material、external/inbound、publication/handoff、maintenance、peripheral 六族。 |
| propagation 维度 | 旧异常是否仍要求 relay、delivery、replay、snapshot recovery 驱动主传播。 | 当前传播只允许 `truth / rule / boundary -> view / material / diagnostic -> maintenance hint / event candidate / peripheral discovery`。 |
| read/write 维度 | 旧 projection/cache/replay 语义是否暗含 Query 写入或 Job 修 core truth。 | 当前必须保持 `Query no-write`、`Job 不修 core truth`。 |
| boundary 维度 | 旧异常是否越过 body-free、cross-project truth、peripheral / marketplace 边界。 | 外部正文、交易履约、下游 runtime 和商业上下文不得进入本仓异常主线。 |
| retained-fact 维度 | 旧说法是否表达了仍稳定成立的边界事实,例如“传播失败不回滚上游 truth”“越界写入必须拒绝”。 | 可保留的只能保留事实方向,必须更换为当前主语和当前异常族语言。 |
| formal-shape 维度 | 旧表格、旧 ASCII 图和关键说明是否仍展示被排除主线。 | 图表也必须按当前对象和六族重建,不能只改正文。 |
| downstream 维度 | 旧语义是否把下游同步结果、marketplace 结果或外部执行结果写成本仓事实。 | 当前只允许 summary/ref/boundary disposition / degraded marker。 |

高优先级污染维度:

1. `owner + family`
2. `propagation + read/write`
3. `boundary + downstream`
4. `retained-fact + formal-shape`

如果某条旧材料在 `owner / family / propagation` 任一高优先级维度冲突,则不能直接继承原句,最多只抽取保留事实后重写。

#### R1.21.4 差异记录格式

下一批 `旧材料差异审计:再写入` 不做散文式描述,而是固定四张记录表:

| 记录表 | 用途 | 每条最少字段 |
|---|---|---|
| 正式旧 `§10` 污染审计表 | 审计正式文档旧 `10.1` / `10.2` 每个主段落和图示元素。 | `旧位置`;`旧主语/旧图示元素`;`冲突类型`;`当前所属异常族`;`保留事实判定`;`替换策略`;`风险级别` |
| historical Step 10 污染审计表 | 审计本文件顶部历史主线内容。 | `旧位置`;`旧主语/旧语义`;`冲突类型`;`当前所属异常族`;`保留事实判定`;`替换策略`;`风险级别` |
| 保留事实提取表 | 抽取仍稳定成立的边界事实,供正式 §10 回填使用。 | `旧来源`;`可保留事实`;`当前应落异常族`;`当前应换用主语`;`禁止保留的旧词` |
| 审计结论汇总表 | 汇总哪些只需清污,哪些要求回退当前 Step 10 乃至上游。 | `污染族`;`影响范围`;`当前可直接清理`;`需回退到哪一步`;`原因` |

固定冲突类型枚举:

- `owner_conflict`
- `family_conflict`
- `propagation_conflict`
- `read_write_conflict`
- `boundary_conflict`
- `historical_only_but_formal_residual`
- `shape_conflict`
- `downstream_truth_conflict`

固定替换策略枚举:

- `drop_old_semantics`
- `rewrite_with_current_owner`
- `downgrade_to_global_redline`
- `extract_fact_then_rewrite`
- `move_to_later_design`

固定风险级别口径:

- `L1-cleanup`: 只需在差异审计中记录,正式回填时可直接清理。
- `L2-rewrite-section`: 说明正式 `§10` 某段必须整体重写,不能局部修补。
- `L3-rollback-current-step`: 说明当前 Step 10 六族中仍有一族没有承接旧材料暴露出的必要边界事实。
- `L4-rollback-upstream-step`: 说明 Step 5~9 的当前结论本身缺对象、接口、处理流或状态来源,导致 Step 10 不能闭口。

#### R1.21.5 回退判定门槛

旧材料差异审计不是默认触发回退。只有满足下面门槛,才允许宣布必须回退:

| 触发条件 | 回退级别 | 判定口径 |
|---|---|---|
| 旧材料只是正式 `§10` 或 historical 段落残留,当前 Step 10 六族已经有明确替代 owner、红线和传播边界。 | 不回退,只做 `L1-cleanup` 或 `L2-rewrite-section` | 属于文档清污,不是当前异常模型缺口。 |
| 旧材料暴露出某条仍稳定成立的边界事实,但当前 Step 10 六族找不到承接位置。 | 回退当前 Step 10 对应异常族 | 说明异常分族或主语映射仍未闭口。 |
| 旧材料暴露出当前 Step 10 某条红线其实依赖 Step 9 状态定义,而当前状态 owner 无法支撑。 | 回退 Step 9 对应状态模块 | state / exception 断裂。 |
| 旧材料暴露出当前 Step 10 某条传播边界其实依赖 Step 8 处理流,而当前 flow 无法支撑。 | 回退 Step 8 对应处理流模块 | flow / exception 断裂。 |
| 旧材料暴露出当前 Step 10 某条异常主语没有 Step 7 接口入口或 Step 6 对象 owner。 | 回退 Step 7 或 Step 6 对应模块 | interface / object / exception 断裂。 |
| 旧材料试图把已明确排除的 `MethodContentLifecycle`、outbox delivery、snapshot export、plugin/configuration、marketplace transaction 重新拉回当前主线,且当前 Step 5 边界无法容纳替代解释。 | 回退到 Step 5 对应组成部分 | 组成部分边界错误。 |

当前预判:

- 大概率仍以 `L1-cleanup` 和 `L2-rewrite-section` 为主。
- 只有发现“当前六个异常族里有某一族实际上仍靠旧 publish / snapshot / P1 主线撑着”,才进入 `L3/L4` 回退。
- 旧影响图残留通常判为 `L2-rewrite-section`,不直接构成上游回退。

#### R1.21.6 停审边界

下一批 `旧材料差异审计:再写入` 写到下面边界就必须停:

1. 已完成正式旧 `§10` 污染审计表。
2. 已完成 historical Step 10 污染审计表。
3. 已完成保留事实提取表。
4. 已完成审计结论汇总表。
5. 已明确是否需要回退,以及若回退应回到哪一层。
6. 已写本模块停审记录。

下一批仍不得提前进入的内容:

- 不写正式 `§10` 回填草稿。
- 不修改正式 `02-概要设计.md`。
- 不直接开始 Step 11。
- 不把差异审计表替换成最终正式图表或正式异常总表。

#### R1.21.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做旧材料差异审计的先思考 | pass | 只固定顺序、维度、记录格式、保留事实判定和回退门槛。 |
| 是否把正式旧 `§10` 和 historical Step 10 区分开 | pass | 已要求分表记录,不得混写。 |
| 是否明确保留事实判定标准 | pass | 已区分“可抽取事实”与“必须删除的旧主线语义”。 |
| 是否明确替换策略和风险级别 | pass | 已固定替换策略枚举和 `L1`~`L4` 风险级别。 |
| 是否直接写了差异明细正文 | no | 本模块未写逐条污染结论。 |
| 是否写正式 §10 回填草稿 | no | 当前未进入正式正文装配。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10。 |

next_allowed_action: 等待用户确认后进入 Step 10 `旧材料差异审计:再写入`;可写正式旧 `§10` 污染审计表、historical Step 10 污染审计表、保留事实提取表、审计结论汇总表和停审记录,明确哪些属于 `L1-cleanup` / `L2-rewrite-section` / `L3-rollback-current-step` / `L4-rollback-upstream-step`,不得直接写正式 `§10` 回填草稿、不得修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.22 旧材料差异审计:再写入

#### R1.22.1 本模块写入说明

本模块按 `R1.21` 已固定的方法,正式记录旧正式 `§10` 和 historical Step 10 的污染审计结果。当前只输出:

1. 正式旧 `§10` 污染审计表。
2. historical Step 10 污染审计表。
3. 保留事实提取表。
4. 审计结论汇总表。
5. 本模块停审记录。

本模块不直接修改正式 `02-概要设计.md`,不写正式 `§10` 回填草稿,不进入 Step 11。

#### R1.22.2 正式旧 `§10` 污染审计表

| 旧位置 | 旧主语/旧图示元素 | 冲突类型 | 当前所属异常族 | 保留事实判定 | 替换策略 | 风险级别 |
|---|---|---|---|---|---|---|
| 正式 `02-概要设计.md` `10.1` 前 4 行 | `approved_gate_ref`、`expected_version`、非法 lifecycle、published 核心字段修改 都围绕 `PublishMethodContent` / `MethodContentLifecycle` / `published` 旧主语展开。 | `owner_conflict`;`family_conflict` | core truth 写路径阻断异常 | 可保留“前置条件缺失或并发冲突必须阻断写入”“已成立 truth 不得原地改写”这两类事实,但不得保留旧 publish / lifecycle 主语。 | `extract_fact_then_rewrite` | `L2-rewrite-section` |
| 正式 `02-概要设计.md` `10.1` 中间 2 行 | “引用不存在、未发布或跨 kind 引用错误”“下游 Use truth 写入定义仓”仍以旧 publish / configuration 激活边界描述。 | `owner_conflict`;`boundary_conflict` | core truth 写路径阻断异常;external / inbound / body-free 边界异常 | 可保留“typed ref 非法必须拒绝”“下游不得反向写本仓 truth”这两类边界事实。 | `rewrite_with_current_owner` | `L1-cleanup` |
| 正式 `02-概要设计.md` `10.1` outbox / downstream 三行 | outbox relay failed / dead_letter / missed event 仍把 delivery、replay、snapshot query 写成当前主传播链。 | `propagation_conflict`;`read_write_conflict` | publication / handoff / collaboration 异常 | 仅可保留“传播失败不回滚 truth”“下游失败只形成 follow-up / unavailable surface”这两类事实。 | `downgrade_to_global_redline` | `L2-rewrite-section` |
| 正式 `02-概要设计.md` `10.1` snapshot / projection / view profile 三行 | `snapshot schema`、`projection / cache`、`ResolveViewProfile` 被混放在旧同步 / 查询语义里,且暗示可用 replay / 回源补足。 | `family_conflict`;`read_write_conflict`;`shape_conflict` | Query / view / material 降级异常;maintenance / refresh / reconciliation 异常 | 可保留“读取面可 stale / unavailable / deny”“projection 不是 truth”“缺口只能降级不可反写 truth”的事实。 | `extract_fact_then_rewrite` | `L2-rewrite-section` |
| 正式 `02-概要设计.md` `10.1` P1 / marketplace 两行 | `MethodPlugin` / `MethodConfiguration` 失败与 marketplace listing / transaction / install 被写成当前外围异常主语。 | `owner_conflict`;`boundary_conflict`;`downstream_truth_conflict` | peripheral package / method set / discovery 异常 | 可保留“外围失败不阻塞核心”“交易 / 安装 / 履约不属于本仓 truth”“越界写入必须拒绝”的事实。 | `rewrite_with_current_owner` | `L1-cleanup` |
| 正式 `02-概要设计.md` `10.2` 异常影响图主链 | `PublishMethodContent -> MethodContent lifecycle change -> audit + fingerprint + outbox pending -> L0-bus / snapshot / downstream sync` 仍把旧 publish/outbox/snapshot/fingerprint 画成当前主链。 | `owner_conflict`;`propagation_conflict`;`shape_conflict` | 跨异常一致性审计;publication / handoff / collaboration 异常 | 仅可保留“写前校验与写后传播必须分层”“传播失败不等于 truth 回滚”的事实。 | `extract_fact_then_rewrite` | `L2-rewrite-section` |
| 正式 `02-概要设计.md` `10.2` 关键说明 | “下游失败通过 replay / snapshot 恢复”“本节不写 retry 参数”将有效边界事实与旧恢复主线混写。 | `propagation_conflict`;`historical_only_but_formal_residual` | publication / handoff / collaboration 异常;maintenance / refresh / reconciliation 异常 | 可保留“概要层不下沉错误码 / retry / 补偿”这一写作边界,但 `replay / snapshot` 恢复主线不得原样保留。 | `extract_fact_then_rewrite` | `L1-cleanup` |

正式旧 `§10` 裁决:

- 正式旧 `§10` 的表和图都不是“改几个词”能继续使用的状态,而是章节级重写对象。
- 污染主要集中在旧 owner、旧传播链和旧外围语义,因此以 `L2-rewrite-section` 为主。
- 但其中若干边界事实仍可萃取,应进入下一步 `正式 §10 回填草稿` 的红线和说明段落。

#### R1.22.3 historical Step 10 污染审计表

| 旧位置 | 旧主语/旧语义 | 冲突类型 | 当前所属异常族 | 保留事实判定 | 替换策略 | 风险级别 |
|---|---|---|---|---|---|---|
| historical Step 10 `§2 本步输入` | 直接把 `PublishMethodContent`、`Downstream Sync`、`ResolveViewProfile`、`Operations / Recovery`、`P1 Plugin / Configuration` 和 `MethodContentLifecycle`、`OutboxEventStatus` 当成当前 Step 10 输入基线。 | `owner_conflict`;`family_conflict`;`historical_only_but_formal_residual` | 六个异常族整体 | 仅可保留“Step 10 应承接处理流与状态边界”这一框架事实,不能保留旧输入主语。 | `extract_fact_then_rewrite` | `L1-cleanup` |
| historical Step 10 `§3.1`~`§3.4 SOP 回答` | 关键异常被组织为 publish gate、outbox、snapshot、fingerprint、P1 五条主线,并以 `MethodContentLifecycle` 作为判断中心。 | `family_conflict`;`propagation_conflict` | 六个异常族整体 | 可保留“概要层必须提前点名关键异常,不下沉错误码 / 脚本”这一框架事实,其余主线不可保留。 | `extract_fact_then_rewrite` | `L1-cleanup` |
| historical Step 10 `§4 当前文档问题诊断` + `§5 改动前后对比` | 诊断和对比都建立在“旧 publish/outbox/snapshot/P1 主线应被集中化”这个旧方案上。 | `historical_only_but_formal_residual`;`shape_conflict` | 跨异常一致性审计 | 可保留“异常不应分散在多个章节里”这一文档结构事实,但不能保留旧集中化对象。 | `extract_fact_then_rewrite` | `L1-cleanup` |
| historical Step 10 `§7.1 异常与边界场景表` | 旧表把核心 truth、传播、读取降级和外围异常都压进 `MethodContent` / outbox / snapshot / P1 语义。 | `owner_conflict`;`family_conflict`;`shape_conflict` | 六个异常族整体 | 仅可保留个别边界事实,旧表整体只能作为污染样本保留。 | `drop_old_semantics` | `L1-cleanup` |
| historical Step 10 `§7.2 异常影响图` + `§8 回填草稿` | 旧图和旧回填草稿把 outbox relay、snapshot query、fingerprint、P1 plugin/config 和 marketplace metadata 画成当前正式章节主链。 | `propagation_conflict`;`shape_conflict`;`downstream_truth_conflict` | publication / handoff / collaboration 异常;peripheral package / method set / discovery 异常 | 仅可保留“传播失败不回滚 truth”“外围失败不阻塞核心”两类事实,其余旧图示元素不得保留。 | `drop_old_semantics` | `L1-cleanup` |
| historical Step 10 `§9 待确认事项` + `§10 进入下一步条件` | 待确认项仍以 `outbox failed / dead_letter`、marketplace 写入和旧异常组织法为阻塞中心。 | `historical_only_but_formal_residual`;`boundary_conflict` | publication / handoff / collaboration 异常;peripheral package / method set / discovery 异常 | 可保留“传播失败不回滚 truth”“越界写入必须拒绝”的事实,但待确认项本身要换成当前六族语言。 | `extract_fact_then_rewrite` | `L1-cleanup` |

historical Step 10 裁决:

- historical 段落当前只构成“误继承风险”,不再构成当前真相源。
- 它们的价值在于提供反例和可萃取事实,不在于提供现成章节。
- 因此处置以 `L1-cleanup` 为主,不触发上游回退。

#### R1.22.4 保留事实提取表

| 旧来源 | 可保留事实 | 当前应落异常族 | 当前应换用主语 | 禁止保留的旧词 |
|---|---|---|---|---|
| 正式旧 `10.1` gate / version / lifecycle / published 相关行 + historical `§3.1` | truth 成立前的前置条件缺口、并发冲突或非法推进必须阻断写入;已成立 truth 不得原地改写。 | core truth 写路径阻断异常 | `MethodAssetDefinition`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation`;`DownstreamConsumptionBoundary` | `PublishMethodContent`;`MethodContentLifecycle`;`published` |
| 正式旧 `10.1` 引用错误 / 下游反写相关行 + historical `§3.2` | typed ref 非法、跨边界反写和 body-free 边界违例必须拒绝,不得伪装成已接受事实。 | core truth 写路径阻断异常;external / inbound / body-free 边界异常 | `ResolveMethodAssetDefinitionRef`;`RelationIntegrityRule`;`DefinitionUseBoundaryGuard`;`ExternalBodyBoundaryRule` | `publish`;`配置激活`;`Use truth 写入定义仓` 的旧实现化措辞 |
| 正式旧 `10.1` outbox / downstream 相关行 + `10.2` 关键说明 | 传播失败、下游不可用或协作受阻不得回滚已成立 truth,只能形成 candidate / unavailable / follow-up surface。 | publication / handoff / collaboration 异常 | `event candidate`;distribution / handoff hint;`ConsumptionImpactSummary` | `outbox relay`;`dead_letter`;`replay`;`snapshot query` |
| 正式旧 `10.1` projection / cache / view profile 相关行 + historical `§3.2` / `§7.2` | 读取面、视图面和发现面可 stale / unavailable / deny,但不得反写 truth。 | Query / view / material 降级异常 | `MethodAssetAvailabilityView`;`DistributionReadMaterial`;`MethodAssetTraceMaterial`;`MethodPackageView`;`MethodSetAssemblyView` | `projection rebuild`;`cache 回源`;`ResolveViewProfile` 旧主线 |
| 正式旧 `10.1` snapshot schema / fingerprint 相关行 + historical `§3.1` / `§3.3` | 概要层只需保留“一致性缺口只能表现为 degraded / follow-up / maintenance hint”,不保留旧 snapshot / fingerprint 主线。 | maintenance / refresh / reconciliation 异常;Query / view / material 降级异常 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | `snapshot export`;`fingerprint drift`;`canonical fingerprint` |
| 正式旧 `10.1` P1 / marketplace 相关行 + historical `§3.4` / `§9` | 外围增强失败不阻塞核心;交易 / 安装 / 履约不属于本仓 truth;越界写入必须拒绝。 | peripheral package / method set / discovery 异常 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MarketplaceContextRef` | `MethodPlugin`;`MethodConfiguration`;`listing`;`transaction`;`install` |
| historical `§3.5` + 正式旧 `10.2` 尾部说明 | 概要层只固定边界与处理口径,不下沉错误码、retry、补偿脚本、SQL 事务和恢复实现。 | 跨异常一致性审计 | Step 10 总章写作边界说明 | `retry / replay / snapshot` 的旧恢复主线措辞 |

保留事实裁决:

- 可保留的是“边界方向”和“红线结论”,不是旧异常主语或旧章节结构。
- 任何保留事实一旦仍依赖 `MethodContent`、outbox delivery、snapshot/fingerprint、plugin/configuration 或 marketplace 交易语义,就必须继续降级为污染样本。

#### R1.22.5 审计结论汇总表

| 污染族 | 影响范围 | 当前可直接清理 | 需回退到哪一步 | 原因 |
|---|---|---|---|---|
| 旧 `MethodContent` / `MethodContentLifecycle` 主线 | 正式旧 `10.1`;historical `§2`、`§3.1`~`§3.4`、`§7`、`§8` | 否,正式章节需整体重写 | 无 | 当前 Step 5~10 已形成新的对象群和六个异常族,旧单主语只是残留。 |
| outbox delivery / relay / dead-letter / replay 主线 | 正式旧 `10.1` / `10.2`;historical `§3.2`、`§7.2`、`§8`、`§9` | 否,需整体移出当前正式 `§10` | 无 | 当前概要只保留 candidate / handoff / unavailable / follow-up,delivery 机制已后置。 |
| snapshot / fingerprint / projection rebuild 主线 | 正式旧 `10.1` / `10.2`;historical `§3.1`、`§3.2`、`§7.2`、`§8` | 否,只能萃取部分一致性红线 | 无 | 当前读取降级和维护收敛已由 material / freshness / progress 语义承接。 |
| 旧 P1 plugin / configuration 主线 | 正式旧 `10.1`;historical `§2`、`§3.4`、`§7.1`、`§8` | 部分可清理,但正式段落仍需整体改写 | 无 | 当前外围 owner 已切换为 package / method set / composition / discovery。 |
| marketplace listing / transaction / install 语义 | 正式旧 `10.1`;historical `§3.2`、`§3.4`、`§9` | 部分可萃取为“越界拒绝”红线,其余需移除 | 无 | 当前本仓只保留 peripheral context / discovery,不拥有交易履约 truth。 |
| 图示与回填草稿形态残留 | 正式旧 `10.2`;historical `§7.2`、`§8` | 否,不能局部 patch | 无 | 图示和草稿本身承载旧主线,必须按当前六族重建。 |
| 当前 Step 10 模型回退评估 | Step 10 当前六个异常族 + Step 5~9 当前结论 | 是 | 无 | 本轮未发现当前异常族缺 owner、缺接口、缺状态或缺处理流承接,因此不触发 `L3` / `L4` 回退。 |

总裁决:

1. 本轮旧材料污染已锁定为“正式 `§10` 需整体重写,historical 内容继续降级保留”的问题类型。
2. 当前没有证据表明 Step 5~9 或 Step 10 当前六个异常族本身仍靠旧 publish / outbox / snapshot / P1 主线支撑。
3. 因此下一步不回退,而是进入 `正式 §10 回填草稿:先思考`。

#### R1.22.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成正式旧 `§10` 污染审计表 | pass | 已逐类审计 `10.1` 和 `10.2` 的旧主语、旧传播链和旧图示。 |
| 是否完成 historical Step 10 污染审计表 | pass | 已审计顶部旧输入、旧 SOP 回答、旧中间产物、旧回填草稿和旧待确认项。 |
| 是否完成保留事实提取表 | pass | 已把可保留事实与必须删除的旧主线语义分开。 |
| 是否完成审计结论汇总表 | pass | 已汇总污染族、影响范围、是否可直接清理和是否需回退。 |
| 是否发现必须回退当前 Step 10 的缺口 | no | 当前问题属于旧材料残留,不是当前六个异常族未闭口。 |
| 是否发现必须回退 Step 5~9 的缺口 | no | 未发现对象 / 接口 / 处理流 / 状态来源支撑断裂。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10。 |

next_allowed_action: 等待用户确认后进入 Step 10 `正式 §10 回填草稿:先思考`;只思考正式 `§10` 的当前章节骨架、段落压缩顺序、哪些异常族总览 / 红线 / 说明需要摘入正式文档以及如何避免把审计表原样搬进正文,不得直接写正式 `02-概要设计.md`,不得进入 Step 11。

### R1.23 正式 §10 回填草稿:先思考

#### R1.23.1 本模块目标与输入边界

本模块只为下一批 `正式 §10 回填草稿:再写入` 固定正式章节骨架和摘录规则,不直接改正式 `02-概要设计.md`。当前输入只来自:

| 输入来源 | 本模块用途 | 使用限制 |
|---|---|---|
| `R1.8`;`R1.10`;`R1.12`;`R1.14`;`R1.16`;`R1.18` 六个异常族再写入 | 作为正式 `§10` 的主体内容来源。 | 只摘概要口径、压缩表和关键边界说明,不整表照搬。 |
| `R1.20` 跨异常一致性审计 | 提供正式 `§10` 的全局红线、统一传播方向和跨族收束语句。 | 不把审计维度表和冲突点表原样搬进正文。 |
| `R1.21`;`R1.22` 旧材料差异审计 | 提供“哪些旧主线必须排除”“哪些事实可以保留”的清污口径。 | 只压缩成正式正文中的排除声明和保留事实说明,不保留风险级别 / 回退列。 |
| `L1-governance` Step 10 框架对齐结论 | 参考“总览 -> 分族 -> 红线 -> 图示按需”的正式压缩顺序。 | 不复制 governance 的领域语义和章节命名。 |
| 正式 `02-概要设计.md` 当前旧 `§10` 结构 | 作为被替换对象,帮助判断新 `§10` 如何重排章节。 | 不延续旧 `10.1 表 + 10.2 图` 的旧 publish/outbox/snapshot 编排。 |

本模块不做的事:

- 不直接写正式 `02-概要设计.md`。
- 不直接复制 `R1.20` / `R1.22` 的审计表。
- 不展开 Step 11 配置影响。
- 不把详细设计层的错误码、schema、port、worker / retry / relay 语义带入回填草稿。

#### R1.23.2 正式 `§10` 当前章节骨架

正式 `02-概要设计.md` 的新 `§10` 不应继续沿用旧“异常表 + outbox 传播图”二段式结构,而应按当前六个异常族和全局红线重排。建议骨架如下:

| 正式章节 | 目标 | 主要来源 |
|---|---|---|
| `10.1 异常与边界总览` | 先声明本章按六个异常族组织,并说明本节不再采用旧 `MethodContent` / outbox / snapshot / fingerprint / plugin-config / marketplace 交易主线。 | `R1.3`;`R1.4`;`R1.6`;`R1.20`;`R1.22` |
| `10.2 core truth 写路径阻断` | 摘录 truth 成立前必须 blocked / rejected 的典型场景和边界。 | `R1.7`;`R1.8` |
| `10.3 Query / view / material 降级` | 摘录 stale / unavailable / partial / deny / degraded 的读取面边界。 | `R1.9`;`R1.10` |
| `10.4 external / inbound / body-free 边界` | 摘录 typed ref、external summary、body boundary、acceptance / rejection 的边界。 | `R1.11`;`R1.12` |
| `10.5 publication / handoff / collaboration` | 摘录 event candidate、handoff、downstream unavailable、collaboration blocked 的口径。 | `R1.13`;`R1.14` |
| `10.6 maintenance / refresh / reconciliation` | 摘录 refresh blocked、recovery pending、progress stalled、drift follow-up 的口径。 | `R1.15`;`R1.16` |
| `10.7 peripheral package / method set / discovery` | 摘录 package / set / composition / discovery unavailable 与外围隔离口径。 | `R1.17`;`R1.18` |
| `10.8 全局红线与传播边界` | 用一张极简传播图和一组红线收束本章。 | `R1.20`;`R1.22` |

骨架裁决:

- 新 `§10` 必须从“总览 + 排除旧主线”开头,而不是从旧异常表开头。
- 六个异常族各占一个子节,不再把 outbox、snapshot、P1 或 marketplace 交易独立列为正式章节。
- 全局传播和红线统一放到收尾 `10.8`,避免在各子节重复讲 `Query no-write`、`Job 不修 truth`、`candidate != delivery`。

#### R1.23.3 段落压缩顺序

正式 `§10` 的写入顺序不能按旧 `10.1` 表格逐行修修补补,必须按当前异常主线重新装配。建议下一批再写入时使用以下顺序:

| 顺序 | 正式段落 | 压缩目标 |
|---:|---|---|
| 1 | `10.1 异常与边界总览` | 用一张总览表和一段排除声明,先拆掉旧 publish / outbox / snapshot / P1 错觉。 |
| 2 | `10.2`~`10.4` | 先写 truth、读取面、external / inbound 三类最基础边界。 |
| 3 | `10.5`~`10.7` | 再写传播协作、maintenance 收敛和外围隔离。 |
| 4 | `10.8 全局红线与传播边界` | 用极简图和红线清单收束,承接后续 Step 11 / Step 12。 |

压缩原则:

- 先写“哪些异常主语成立”,再写“遇到什么异常时如何处理”,最后写“哪些动作绝对不能发生”。
- 每个正式子节只保留一张压缩表和 2~4 条关键说明;只有 `10.8` 可以按需保留一张极简传播图。
- `10.8` 负责吸收 `R1.20` 的跨族一致性结论,各局部子节不重复整张审计表。

#### R1.23.4 中间产物到正式 `§10` 的摘录映射

下一批再写入时,需要明确“摘什么”和“怎么摘”。建议映射如下:

| 中间产物来源 | 正式节 | 建议摘录形态 | 不应直接搬运的内容 |
|---|---|---|---|
| `R1.8` | `10.2` | 一张 core truth 阻断场景压缩表 + 一小段“truth 未成立不得 accepted”说明。 | 候选池细表、排除项长表、停审记录。 |
| `R1.10` | `10.3` | 一张读取降级场景压缩表 + 一小段“降级只在读取面成立”说明。 | owner 候选池、术语长清单、细分反例表。 |
| `R1.12` | `10.4` | 一张 external / inbound / body-free 边界表 + 一小段“只承接 summary/ref/marker”说明。 | 正文反例长表、body boundary 全量排除项。 |
| `R1.14` | `10.5` | 一张 publication / handoff / collaboration 压缩表 + 一小段“传播失败不回滚 truth”说明。 | 旧 delivery 反例、详细 report/export 分流表。 |
| `R1.16` | `10.6` | 一张 maintenance / refresh / reconciliation 压缩表 + 一小段“Job 不修 truth”说明。 | worker / scheduler / retry / queue 反例长表。 |
| `R1.18` | `10.7` | 一张 peripheral 异常压缩表 + 一小段“外围不可用不污染核心”说明。 | marketplace 交易 / 安装 / 履约反例长表。 |
| `R1.20` | `10.1`;`10.8` | `10.1` 摘一段全局导语;`10.8` 摘一张极简传播图 + 红线清单。 | 统一审计维度表、高风险冲突点表、六族交叉复核表。 |
| `R1.22` | `10.1`;`10.8` | `10.1` 用一句“本节不再采用旧主线”;`10.8` 用一句“candidate 不等于 delivery / 红线只保留当前语义”。 | 污染审计表、保留事实提取表、风险级别、回退过程。 |

摘录裁决:

- 正式正文摘的是“稳定口径”,不是“推导过程”。
- 一个中间产物进入正式正文时,最多保留:压缩场景表、关键说明、极简图。
- 审计表只服务于筛选和清污,不直接成为正式章节主体。

#### R1.23.5 避免把审计表原样搬进正文的规则

`R1.20` 和 `R1.22` 都很长,下一批必须主动压缩,否则正式 `§10` 会变成中间产物转存。压缩规则固定如下:

| 审计来源 | 正文压缩方式 | 禁止做法 |
|---|---|---|
| `R1.20` 统一审计维度 / 冲突点 / 六族交叉表 | 在 `10.8` 压成 5~7 条全局红线 + 1 张极简传播图。 | 把整张统一维度表、冲突点表或交叉复核表贴入正文。 |
| `R1.22` 正式旧 `§10` 污染审计表 | 在 `10.1` 用一句排除声明,说明不再采用旧 `MethodContent` / outbox / snapshot / P1 / marketplace 交易主线。 | 复制 `旧位置 / 冲突类型 / 风险级别 / 替换策略` 等列。 |
| `R1.22` 保留事实提取表 | 在各对应子节只保留 1~2 句边界结论。 | 复制“旧来源 / 禁止保留的旧词”整表。 |
| `R1.22` historical 审计 | 不直接入正文,只作为回填时的排除检查。 | 在正式正文里大段讨论 historical Step 10。 |

固定压缩口径:

1. 正文可以保留结论句,不能保留审计过程列。
2. 正文可以保留红线清单,不能保留 `L1/L2/L3/L4` 风险标签。
3. 正文可以声明“哪些旧主线被排除”,不能继续以旧章节名或旧异常主语组织内容。

#### R1.23.6 下一写入批次边界

下一批 `正式 §10 回填草稿:再写入` 只允许在本文件中形成可回填草稿,可写:

1. 新 `10.1`~`10.8` 的正式章节草稿。
2. 一张异常与边界总览表。
3. 六个异常族的压缩场景表与关键说明。
4. 一张极简传播关系图。
5. 一组全局红线说明。
6. 停审记录。

下一批仍不得做的事:

- 不直接修改正式 `02-概要设计.md`。
- 不回贴 `R1.20` / `R1.22` 原始审计表。
- 不展开 Step 11 配置影响。
- 不写详细设计层错误码、schema、port、worker / retry / relay 细节。

#### R1.23.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做正式 §10 回填草稿的先思考 | pass | 只固定章节骨架、压缩顺序和摘录规则。 |
| 是否明确新 §10 章节切法 | pass | 已改为 `10.1 总览 + 六个异常族 + 10.8 红线`。 |
| 是否明确哪些中间产物进入正文 | pass | 已给出从 `R1.8`~`R1.22` 到正式节的摘录映射。 |
| 是否明确避免审计表原样入正文 | pass | 已固定压缩规则和禁止做法。 |
| 是否直接写正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10。 |

next_allowed_action: 等待用户确认后进入 Step 10 `正式 §10 回填草稿:再写入`;可在本文件内写新 `10.1`~`10.8` 的正式回填草稿、异常总览表、六族压缩表、极简传播图和全局红线说明,不得直接修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.24 正式 §10 回填草稿:再写入

#### R1.24.1 回填说明

本草稿用于后续整体替换正式 `02-概要设计.md` 的 `§10`。它只依据当前 Step 10 的 `R1.8`~`R1.23` 中间产物生成,不继承旧正式 `§10` 的 `MethodContent` / outbox / snapshot / fingerprint / P1 plugin-config / marketplace 交易主线。

本草稿采用摘要化写法:

- 正式正文只保留总览表、六个异常族的压缩场景表、关键边界说明和一张极简传播图。
- `R1.20` 的统一审计维度、冲突点和交叉复核表,以及 `R1.22` 的污染审计表、保留事实提取表和回退判定过程继续保留在本中间产物。
- 正式正文不下沉到错误码、字段、DTO / schema、port / repository、topic / relay、worker / retry / scheduler 或运维细节。

#### R1.24.2 `§10.1 异常与边界总览` 草稿

本章按六个异常族组织异常与边界场景,不再采用旧 `MethodContent`、outbox delivery、snapshot / fingerprint、`MethodPlugin` / `MethodConfiguration` 或 marketplace 交易 / 安装主线。

| 异常族 | 典型结果 | 当前边界重点 |
|---|---|---|
| core truth 写路径阻断 | `blocked`;`rejected`;`basis missing`;`illegal advancement` | truth 未成立前,definition、formalization、formal version、relation 和 consumption boundary 不得越权继续。 |
| Query / view / material 降级 | `stale`;`unavailable`;`partial`;`not visible`;`degraded` | 降级只在读取面成立,不得反写 truth。 |
| external / inbound / body-free 边界 | `intake rejected`;`unresolved ref`;`forbidden body`;`acceptance pending` | 本仓只承接 body-free summary / ref / marker,不接收正文或包体。 |
| publication / handoff / collaboration | `candidate produced but handoff failed`;`downstream unavailable`;`collaboration blocked` | truth 已成立后的传播失败不得回滚 truth。 |
| maintenance / refresh / reconciliation | `refresh blocked`;`recovery pending`;`progress stalled`;`drift detected` | maintenance 只刷新派生材料与 progress,不修 core truth。 |
| peripheral package / method set / discovery | `package unavailable`;`assembly stale-invalid`;`composition rejected`;`discovery context unavailable` | 外围失败只影响 package / set / discovery,不得污染核心闭环。 |

总览说明:

- 本章只固定“应阻断、应降级、应拒绝、应提示 follow-up”的口径,不展开错误码、补偿、重试或调度策略。
- 旧主线中仍可保留的事实只有边界方向,例如“传播失败不回滚 truth”“越界写入必须拒绝”;这些事实已全部改写为当前六个异常族语言。

#### R1.24.3 `§10.2 core truth 写路径阻断` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| basis summary、typed ref、合法 context 或 prerequisite 不闭合 | `MethodAssetDefinition`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation`;`DownstreamConsumptionBoundary` | 写路径必须 `blocked / rejected`;不得先 accepted 后补 basis。 |
| catalog scope、consumption boundary、definition-use guard 或 relation integrity 当前不满足 | `MethodAssetCatalogEntry`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`RelationIntegrityRule` | 只能阻断或拒绝;不得把 boundary / guard failure 降级成可忽略 warning。 |
| formalization 未完成却直接建立 formal version,或 relation / boundary truth 越权推进 | `FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetRelation`;`DownstreamConsumptionBoundary` | 视为 illegal advancement / illegal transition,不得继续 accepted。 |
| Query、Job、Inbound 或 peripheral path 试图补写 core truth | 所有 core truth / boundary 主语 | 明确禁止;Query no-write、Job 不修 truth、Inbound 只承接 body-free、peripheral 不补核心。 |

关键边界:

- truth 未成立前,不得提前写 history hint、event candidate 或 refresh hint 冒充成功事实。
- external 缺失只会阻断新写入或形成 pending / unavailable,不得回滚既有 truth。

#### R1.24.4 `§10.3 Query / view / material 降级` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| truth 已调整但 catalog / availability / trace / distribution / external / peripheral view 尚未收敛 | `MethodAssetCatalogView`;`MethodAssetAvailabilityView`;`MethodAssetTraceMaterial`;`DistributionReadMaterial`;`ExternalSourceSummary`;外围 view | 只能返回 `stale` / freshness lag / refresh needed surface。 |
| read surface、typed ref、basis summary、material 或 progress 当前缺失 / 不可读 | 目录、正式化、消费、追溯、关系、外部、维护、外围读取主语 | 只能返回 `unavailable` / safe absence / unknown,不得临时造数据补口。 |
| 只有部分条目、部分 lineage、部分 impact、部分 discovery material 可安全返回 | trace / audit / impact / external / peripheral page 主语 | 允许返回 `partial / incomplete` surface,但必须显式保留安全子集语义。 |
| actor / scope / audience / boundary 当前只允许安全子集 | consumption、trace / audit、external、peripheral 读取主语 | 返回 `not visible / context-limited / blocked for context`,不得在 Query 中放开 boundary。 |
| 当前只能提供安全诊断而无法提供完整可读材料 | formalization、integrity、external、maintenance progress、peripheral 读取面 | 只能返回 `degraded` / safe reason / diagnostic hint。 |

关键边界:

- Query 只读不写,不得创建、刷新或修复 truth。
- stale / unavailable / partial 只影响读取面,不得被解释为来源 truth 自动失效。

#### R1.24.5 `§10.4 external / inbound / body-free 边界` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| inbound intake 到达但 summary candidate 不满足本仓承接边界 | `ExternalSourceSummary`;body-free inbound consumer result | 只能 `rejected / ignored / pending acceptance`;不得把 intake 到达写成 accepted truth。 |
| typed ref、archive ref 或 lineage ref 无法安全解析 | `ExternalSourceRef`;`ArtifactArchiveRef`;external lineage hint | 只能 `unresolved / invalid / duplicate-reused`;不得从 URL、path 或 payload 文本私补 ref。 |
| 到达的是 raw document、artifact body、archive 内容、provider payload、evidence body 或外部执行正文 | `ExternalBodyBoundaryRule`;相关 summary / archive candidate | 必须 `forbidden body / rejected intake`;不得保存正文、包体或 provider payload。 |
| body-free summary 已到达,但 acceptance marker、safe reason 或 basis sufficiency 尚未闭合 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | 只能 `acceptance pending / basis pending`;不得推进 formalization、version 或 relation truth。 |

关键边界:

- Inbound only body-free: 只承接 safe summary、typed ref、digest hint、marker 和 safe reason ref。
- external 缺失不回滚 truth,只是阻断新的承接或形成 pending / unavailable。

#### R1.24.6 `§10.5 publication / handoff / collaboration` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| accepted truth / material / boundary 已产生 `event candidate`,但 handoff 目标未闭口 | 各组成部分 `event candidate`;audit / lineage / violation / maintenance hint | 只能 `candidate produced / handoff failed / pending handoff`;不得撤销已成立 truth。 |
| 下游消费方、相邻读取面或协作侧当前不可用 | `event candidate`;`ConsumptionImpactSummary`;`MaintenanceProgressView`;peripheral collaboration hint | 只能 `downstream unavailable / pending feedback / safe unavailable`。 |
| 需要 formal intervention、人工承接或后续协作,但当前前提不满足 | `ConsistencyProtectionPolicy`;`DefinitionUseBoundaryGuard`;`ConsistencyRecoveryTask`;audit / lineage handoff | 只能 `collaboration blocked / formal intervention required / pending explanation`;不得自动执行修复。 |

关键边界:

- `event candidate` 不等于 delivery,本章不定义 topic、relay、receipt、retry 或 dead letter。
- 传播失败只影响传播面,不得回滚 definition、formal version、relation、external summary、boundary 或 package truth。

#### R1.24.7 `§10.6 maintenance / refresh / reconciliation` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| read refresh、trace refresh 命中 source unavailable、scope blocked、body boundary 或 target material 缺失 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask` | 只能 `refresh blocked / partial / unavailable / superseded / suspended`;不得修 core truth。 |
| recovery 已识别 issue,但只能 pending acknowledgement、suspended、rejected 或 formal intervention required | `ConsistencyRecoveryTask`;`MaintenanceRunHistory` | 只能 `recovery pending / suspended / rejected / intervention required`;不得伪装成已修复。 |
| task / recovery truth 已变化,但 progress view 仍停留旧状态或当前不可读 | `MaintenanceProgressView` | 只能 `progress stalled / stale / unavailable / recovery needed`;progress 不替代 task truth。 |
| 上游 truth、boundary 或 external summary 已变化,既有 material / diagnostic 仍落后 | refresh / recovery 主语 + freshness surface | 只能 `drift detected / refresh needed / follow-up required`;drift 不等于 truth invalid。 |

关键边界:

- Job 不修 core truth,只刷新派生材料、推进收敛、写 progress / history / issue。
- maintenance 保持 body-free,不得复制 raw log、evidence body、report body、artifact body 或 provider payload。

#### R1.24.8 `§10.7 peripheral package / method set / discovery` 草稿

| 场景 | 影响主语 | 当前概要口径 |
|---|---|---|
| package 成员、context 或组合前提当前不可用 | `MethodPackage`;`MethodPackageView` | 只能 `package unavailable / stale / invalid member / history explanation`;不得让核心 truth 失效。 |
| assembly 依赖变化、当前不可用或只能部分可读 | `MethodSetAssembly`;`MethodSetAssemblyView` | 只能 `assembly stale / unavailable / partially available / invalid composition`;不得扩大消费授权。 |
| composition 结果不满足外围规则或 context 当前不可用 | `PackageCompositionRule` | 只能 `composition rejected / invalid member or boundary / context unavailable`;不得自动修成员或 boundary。 |
| discovery 依赖的外围 view source 暂不可读,或只允许 safe subset | `MethodPackageView`;`MethodSetAssemblyView`;discovery context | 只能 `discovery context unavailable / stale / safe absence`;不得进入 listing、价格、安装、履约语义。 |

关键边界:

- 外围不可用不污染核心。
- discovery 不等于商业履约,Query 不做 ranking、推荐或商业筛选。

#### R1.24.9 `§10.8 全局红线与传播边界` 草稿

异常传播关系:

```text
core truth / rule / boundary
        |
        v
view / material / diagnostic
   |         |           |
   |         |           +--> maintenance hint / progress / history
   |         +--------------> event candidate / handoff hint
   +------------------------> peripheral discovery / safe visible surface
```

全局红线:

| 红线 | 当前口径 |
|---|---|
| `Query no-write` | Query 只能读取 summary、view、material、diagnostic、history、lineage、progress 或 safe absence,不得创建、刷新或修复 truth。 |
| `Job 不修 core truth` | refresh / recovery / reconciliation 只刷新派生材料、推进收敛、写 progress / history / issue,不得修 definition、formal version、relation、external summary 或 package truth。 |
| `event candidate 不等于 delivery` | 概要层只定义 candidate 与 handoff hint,不定义 topic、relay、receipt、retry 或 dead letter。 |
| `外部缺失不回滚 truth` | external summary、artifact ref、basis pending 或 lineage 缺口只能阻断新承接或形成 pending / unavailable,不得回滚已成立 truth。 |
| `外围不可用不污染核心` | package、assembly、composition、discovery unavailable 只影响外围读取与发现,不得反向令核心闭环失败。 |
| `progress 不替代 task truth` | `MaintenanceProgressView` 只复制可见结果,不得倒推出 task 已成功、已 supersede 或已闭口。 |
| `body-free 边界不可绕过` | inbound、Query、maintenance、publication 和 peripheral 路径都不得引入 raw body、archive 内容、provider payload 或交易履约正文补口。 |

#### R1.24.10 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成新 `10.1`~`10.8` 草稿 | pass | 已形成总览、六个异常族和全局红线的可回填草稿。 |
| 是否完成异常总览表 | pass | 已在 `10.1` 固定六族总览。 |
| 是否完成六族压缩表 | pass | 已在 `10.2`~`10.7` 各自压缩为一张场景表。 |
| 是否完成极简传播图和全局红线 | pass | 已在 `10.8` 固定单向传播图与红线清单。 |
| 是否把审计表原样搬进正文 | no | `R1.20` / `R1.22` 只被压成摘要导语、排除声明和红线说明。 |
| 是否直接修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 11 | no | 当前仍在 Step 10。 |

next_allowed_action: 等待用户确认后进入 Step 10 `自检与停审:先思考`;只思考 Step 10 是否已覆盖六个异常族、是否可正式回填、是否仍有旧主线污染残留以及是否影响 Step 11 配置影响重审,不得直接修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.25 自检与停审:先思考

#### R1.25.1 本模块边界

本模块只思考 Step 10 自检与停审口径,不写最终停审结论,不修改正式 `02-概要设计.md`,不进入 Step 11 重审正文。

本模块目标是判断下一批 `R1.26 自检与停审:再写入` 应如何检查:

1. Step 10 中间产物是否已经完成到可停审状态。
2. `R1.24` 的正式 `§10` 草稿是否具备后续正式回填条件。
3. Step 11 配置影响轮廓是否必须按当前 Step 10 红线执行重审。
4. flow / 项目台账应在 `R1.26` 后推进到“等待用户决定正式 §10 回填或进入 Step 11 重审”的哪种状态。

#### R1.25.2 自检输入盘点

| 输入 | 用途 | 当前判断 |
|---|---|---|
| `R1.1`~`R1.2` 开工与必读文档 | 检查 Step 10 启动基线、旧正式 `§10` 降级和本轮输入边界。 | 已完成,可作为门禁依据。 |
| `R1.3`~`R1.4` L1-governance 框架对齐 | 检查是否只参考框架深度、异常分族方式和停审结构,未复制治理语义。 | 已完成,需在自检中确认只借框架不借语义。 |
| `R1.5`~`R1.18` 六个异常族循环 | 检查六个异常族是否都按“先思考、再写入”完成,且落点仍受 Step 5~9 当前结论约束。 | 已完成,是 Step 10 完成门禁主依据。 |
| `R1.19`~`R1.20` 跨异常一致性审计 | 检查全局传播方向、truth 不回滚、Query no-write、Job 不修 truth、candidate 不等于 delivery 等红线是否闭合。 | 已完成,需转入停审表。 |
| `R1.21`~`R1.22` 旧材料差异审计 | 检查旧 `MethodContent` / outbox / snapshot / fingerprint / plugin / marketplace 主线是否被排除。 | 已完成,正式 §10 回填前必须继续保留该红线。 |
| `R1.23`~`R1.24` 正式 §10 回填草稿 | 检查正式 `10.1`~`10.8` 草稿是否已覆盖六族、传播图和全局红线。 | 已完成草稿,但尚未修改正式文档。 |
| Step 5 / Step 6 / Step 7 / Step 8 / Step 9 当前结论 | 检查异常 owner、对象边界、入口触发、处理流和状态传播来源是否可追溯。 | 已完成,Step 10 可引用其当前结论。 |
| 当前正式 `02-概要设计.md` §10 | 只用于后置污染比对,判断旧异常主线是否仍残留。 | 已完成审计,不得作为 Step 10 第一来源。 |
| `02_hld_calibration_flow.md` 与 `project_execution_ledger.md` | 检查当前门禁、恢复点和下一步是否仍只允许停审。 | 已完成,当前只允许进入 `R1.26`。 |
| `02_hld_step_11_configuration_impact.md` | 判断 Step 11 是否仍可视为已闭合,还是必须按新红线重审。 | 已读取,当前应视为 `completed_pending_recheck`,不能当作最终闭合。 |

#### R1.25.3 Step 10 完成门禁候选

下一批应写入以下完成门禁表:

| 门禁 | 应检查内容 | 预期结论 |
|---|---|---|
| 必读与开工基线完成 | 是否列明 Step 10 必读文档、输入基线、旧材料只作后置审计。 | 预计 pass。 |
| L1-governance 框架参考正确 | 是否只参考章节粒度、异常分族方式和停审结构,未复制治理领域语义。 | 预计 pass。 |
| 异常 owner / 影响面候选池完成 | 是否已以 Step 5~9 当前结论收稳六个异常族主语与影响面。 | 预计 pass。 |
| 六个异常族逐个完成 | 是否每个异常族均完成先思考、再写入和停审。 | 预计 pass。 |
| 跨异常一致性审计完成 | 是否审计 truth 不回滚、Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过。 | 预计 pass。 |
| 旧材料差异审计完成 | 是否排除旧 `MethodContent` / outbox relay / snapshot / fingerprint / plugin / marketplace 主线。 | 预计 pass。 |
| 正式 §10 草稿完成 | 是否形成可回填草稿,且来源只来自当前 `R1.5`~`R1.24` 与 Step 5~9 当前结论。 | 预计 pass。 |
| 全局传播方向与红线明确 | 是否锁定 `core truth / rule / boundary -> view / material / diagnostic -> maintenance hint / progress / history / event candidate / peripheral discovery`。 | 预计 pass。 |
| Step 11 重审影响已判断 | 是否明确 Step 11 只能在 Step 10 闭合后按新红线复核,不能直接沿用旧闭合假设。 | 预计 pass。 |
| 未下沉详细设计 / 实现 | 是否未写错误码、schema、port、repository、topic、payload、worker、retry、config key 或 test 细节。 | 预计 pass。 |
| 未直接修改正式文档 / 未进入 Step 11 | 是否仍停留在中间产物停审层。 | 预计 pass。 |

#### R1.25.4 正式 `§10` 可回填性判断口径

正式 `§10` 回填应采用当前 Step 10 的两段式裁决:

1. `R1.26` 只判断 `R1.24` 草稿是否可回填,并提出 flow / 台账推进建议。
2. 只有在用户明确确认后,才允许实际替换正式 `02-概要设计.md` 的 `## 10` 到 `## 11` 之间内容。

可回填性检查应覆盖:

| 检查项 | 判断标准 |
|---|---|
| 章节覆盖 | `R1.24` 已覆盖 `10.1`~`10.8`,能替换正式 `§10` 主体。 |
| 来源可追溯 | 每个草稿段落能回指 `R1.8`~`R1.24` 与 Step 5 / Step 6 / Step 7 / Step 8 / Step 9 当前结论。 |
| 摘要化适度 | 正式文档只保留异常总览、六族压缩表、极简传播图和全局红线;完整审计留在中间产物。 |
| 旧主线禁入 | 不恢复旧正式 `§10` 的 `MethodContent`、outbox delivery、snapshot / fingerprint、plugin / configuration 或 marketplace 交易主线。 |
| 详细设计隔离 | 不写 schema、port、repository、topic、payload、worker、scheduler、retry、storage、config key 或 test 细节。 |
| 正式文档状态 | 当前仍为 pending_rewrite;实际回填必须等用户确认。 |

#### R1.25.5 Step 11 配置影响重审判断口径

Step 11 当前不能视为 finally closed。下一批自检若通过,只应把 Step 11 维持为 `completed_pending_recheck`,并要求后续按当前 Step 10 红线重审。

Step 11 重审应至少检查:

| 重审点 | 来源 | 判断口径 |
|---|---|---|
| Query no-write 是否被配置化绕过 | Step 10 `R1.20` / `R1.24` | 配置只能影响运行装配与接缝,不能让 Query 变成补写 truth 的入口。 |
| Job 不修 core truth 是否被配置化绕过 | Step 10 `R1.16` / `R1.20` / `R1.24` | 维护 / refresh / recovery 配置不能把 job 变成核心 truth 修复器。 |
| `event candidate` 是否被误当 delivery 主线 | Step 10 `R1.14` / `R1.20` / `R1.24` | Step 11 不得把 topic、relay、receipt、retry、dead letter 提升为 Step 10 主轴。 |
| body-free 边界是否被配置化放宽 | Step 10 `R1.12` / `R1.20` / `R1.24` | 配置不能允许 raw body、archive 内容、provider payload 或 evidence body 越界入仓。 |
| 外围失败是否被配置成污染核心 | Step 10 `R1.18` / `R1.20` / `R1.24` | package / method set / discovery 的配置只能影响外围能力,不能让外围成为核心闭环前提。 |
| 旧异常主线是否借配置章节回流 | Step 10 `R1.22` / `R1.24`;Step 11 当前文件 | 不得恢复旧 outbox / snapshot / fingerprint / plugin / marketplace 配置主线。 |

裁决边界:

1. 若 `R1.26` 判断 Step 10 仍有缺口,必须先留在 Step 10 修补,不得提前重开 Step 11。
2. 若 `R1.26` 通过,Step 11 只进入“待重审”状态,不得直接沿用当前 Step 11 已完成结论。

#### R1.25.6 flow / 台账推进策略候选

若 `R1.26` 自检通过,建议状态如下:

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_10_exceptions_boundaries.md` | Step 10 self_check_completed | 等待用户决定:正式回填 `§10`,或按当前红线重开 Step 11。 |
| `02_hld_calibration_flow.md` | Step 10 intermediate_completed / wait_user_decision | 不自动进入 Step 11;等待用户确认正式 `§10` 回填或继续。 |
| `project_execution_ledger.md` | Step 10 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 `§10` 回填或 Step 11 重审开工”。 |
| `02_hld_step_11_configuration_impact.md` | completed_pending_recheck | 只在 Step 10 停审通过后,按当前红线执行重审。 |
| `02-概要设计.md` | formal `§10` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.24` 草稿整体替换 `§10`。 |

若 `R1.26` 自检不通过,flow / 台账必须留在 Step 10,并明确回到缺口所在模块修补。

#### R1.25.7 下一写入批次结构

下一批 `R1.26 自检与停审:再写入` 只写:

1. `Step 10 完成门禁自检表`。
2. `正式 §10 草稿可回填性检查`。
3. `Step 11 重审判断与后续风险保留`。
4. `停审裁决`。
5. `flow / 台账推进建议`。
6. `next_allowed_action`。
7. `本模块停审记录`。

#### R1.25.8 禁止事项

下一批不得直接修改正式 `02-概要设计.md`,不得直接重开 Step 11 正文,不得写错误码、schema、port、repository、topic、payload、worker、scheduler、retry、config key、部署或测试方案。

若自检发现 Step 10 中间产物缺口,必须留在 Step 10 修补,不得通过正式回填或 Step 11 补口。

#### R1.25.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义 Step 10 停审口径和下一写入结构。 |
| 是否写最终停审结论 | no | 最终 pass / fail 留给 `R1.26`。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否直接进入 Step 11 | no | 只定义 Step 11 重审判断口径。 |
| 是否允许进入自检与停审:再写入 | pass | 自检口径、可回填判断、Step 11 重审判断和 flow / 台账推进策略已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 10 `自检与停审:再写入`;只写 Step 10 完成门禁自检、正式 §10 草稿可回填性检查、Step 11 重审判断与后续风险保留、停审裁决和 flow / 台账推进建议,不得直接修改正式 `02-概要设计.md`,不得直接重开 Step 11。

### R1.26 自检与停审:再写入

#### R1.26.1 Step 10 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 必读与开工基线完成 | pass | `R1.1`;`R1.2` | 已列明 Step 10 必读文档、输入基线和旧正式 `§10` / historical Step 10 只作后置审计的使用边界。 |
| L1-governance 框架参考正确 | pass | `R1.3`;`R1.4` | 仅参考异常章节粒度、分族方式和停审结构,未复制 governance 领域语义。 |
| 异常 owner / 影响面候选池完成 | pass | `R1.5`;`R1.6`;Step 5~9 | 六个异常族主语和影响面已回指当前组成部分、对象、处理流和状态传播边界。 |
| 六个异常族逐个完成 | pass | `R1.7`~`R1.18` | 六个异常族均完成先思考、再写入和停审记录。 |
| 跨异常一致性审计完成 | pass | `R1.19`;`R1.20` | 已审计 truth 不回滚、Query no-write、Job 不修 truth、candidate 不等于 delivery 和 body-free 不可绕过等全局红线。 |
| 旧材料差异审计完成 | pass | `R1.21`;`R1.22` | 已排除旧 `MethodContent`、outbox relay / dead letter、snapshot / fingerprint、plugin / configuration 和 marketplace 主线。 |
| 正式 §10 草稿完成 | pass | `R1.23`;`R1.24` | 已形成覆盖 `10.1`~`10.8` 的可回填草稿,来源限定为当前 Step 10 中间产物和 Step 5~9 当前结论。 |
| 全局传播方向与红线明确 | pass | `R1.20`;`R1.24` | 已锁定 `core truth / rule / boundary -> view / material / diagnostic -> maintenance hint / progress / history / event candidate / peripheral discovery`。 |
| Step 11 重审影响已判断 | pass | `R1.25`;`02_hld_step_11_configuration_impact.md` | 已明确 Step 11 只能在 Step 10 闭合后按新红线复核,不能直接沿用旧闭合假设。 |
| 未下沉详细设计 / 实现 | pass | `R1.7`~`R1.25` | 未写错误码、schema、port、repository、topic、payload、worker、retry、config key 或 test 细节。 |
| 未直接修改正式文档 / 未进入 Step 11 | pass | `R1.25`;`R1.26` | 当前只完成中间产物停审,未修改正式 `02-概要设计.md`,也未重开 Step 11 正文。 |

#### R1.26.2 正式 §10 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.24` 已覆盖 `10.1` 异常与边界总览、`10.2`~`10.7` 六个异常族和 `10.8` 全局红线与传播边界。 |
| 来源可追溯 | pass | 草稿来源可回指 `R1.8`~`R1.24`、Step 5 当前组成部分、Step 6 当前对象、Step 7 当前接口、Step 8 当前处理流和 Step 9 当前状态传播结论。 |
| 摘要化适度 | pass | 正式草稿只保留异常总览、六族压缩表、极简传播图和全局红线;完整 cross-audit、旧材料污染审计和停审过程继续留在中间产物。 |
| 旧主线禁入 | pass | 草稿未恢复旧 `MethodContent`、outbox delivery、snapshot / fingerprint、plugin / configuration 或 marketplace 交易 / 安装主线。 |
| 详细设计隔离 | pass | 草稿未写 schema、port、repository、topic、payload、worker、scheduler、retry、storage、config key、部署或测试切口。 |
| 正式文档状态 | not_written | 当前只完成中间产物草稿;正式 `02-概要设计.md` 的 `§10` 尚未由本模块回填。 |
| 回填前置动作 | wait_user_decision | 需要用户明确确认是否按 `R1.24` 草稿整体替换正式 `§10`。 |

#### R1.26.3 Step 11 重审判断与后续风险保留

| 承接 / 风险 | 状态 | 后续要求 |
|---|---|---|
| Step 11 当前文件 | ready_for_recheck | `02_hld_step_11_configuration_impact.md` 只能视为 `completed_pending_recheck`;若用户继续,必须从 Step 11 `开工与必读文档:先思考` 重新核对。 |
| Query no-write 红线 | ready_for_step11_recheck | Step 11 不得把 Query 补写 truth、刷新 truth 或私补 missing truth 写成配置能力。 |
| Job 不修 core truth 红线 | ready_for_step11_recheck | Step 11 不得把 maintenance / refresh / recovery 配置写成核心 truth 修复开关。 |
| `event candidate` 不等于 delivery | ready_for_step11_recheck | Step 11 不得把 topic、relay、receipt、retry、dead letter 提升为 Step 10 的业务主轴。 |
| body-free 边界不可绕过 | ready_for_step11_recheck | Step 11 不得允许 raw body、archive 内容、provider payload、evidence body 越界进入本仓。 |
| 外围失败不污染核心 | ready_for_step11_recheck | Step 11 只能把 package / method set / discovery 相关配置写成外围能力影响,不得把外围变成核心闭环前提。 |
| 旧异常主线经配置章节回流 | blocked_by_rule | Step 11 不得恢复旧 outbox、snapshot、fingerprint、plugin 或 marketplace 配置主线。 |
| 正式 §10 尚未回填 | open_formal_doc_risk | 若用户先进入 Step 11,必须以 Step 10 当前中间产物为第一来源,不得回读旧正式 `§10`。 |
| Step 12 详细设计承接清单 | blocked_by_step11_recheck | Step 12 仍需等待 Step 11 按当前 Step 10 红线完成重审后再讨论。 |

#### R1.26.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 10 中间产物是否完成 | completed | 异常与边界场景轮廓已按当前 Step 5~9 全量重审并完成总停审。 |
| 正式 §10 是否已回填 | no | 当前只完成 `R1.24` 可回填草稿,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 10 blocker | no_blocker_for_current_step | 未发现异常 owner、传播方向、旧材料污染、Step 11 承接口径或详细设计下沉 blocker。 |
| 是否允许正式 §10 回填 | ready_when_user_confirms | 可按 `R1.24` 草稿整体替换正式 `§10`,但必须等待用户明确确认。 |
| 是否允许进入 Step 11 | ready_after_user_decision | 若用户选择继续 Step 11,下一动作只能是 Step 11 `开工与必读文档:先思考`,不得直接沿用旧 Step 11 completed 结论。 |

#### R1.26.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_10_exceptions_boundaries.md` | Step 10 intermediate_completed | 等待用户决定:正式回填 `§10`,或进入 Step 11 `开工与必读文档:先思考`。 |
| `02_hld_calibration_flow.md` | Step 10 intermediate_completed / wait_user_decision | 不自动进入 Step 11;等待用户确认正式 `§10` 回填或继续。 |
| `project_execution_ledger.md` | Step 10 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 `§10` 回填或 Step 11 重审开工”。 |
| `02_hld_step_11_configuration_impact.md` | historical completed_pending_recheck / ready_to_reopen | 若用户选择继续,必须从 `开工与必读文档:先思考` 重开并承接 Step 10 当前红线。 |
| `02-概要设计.md` | formal `§10` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.24` 草稿整体替换 `§10`。 |

#### R1.26.6 next_allowed_action

```text
等待用户决定下一动作:
1. 若用户要求正式回填 §10,则按 R1.24 草稿整体替换 projects/L3-method-library/02-概要设计.md 的 §10,并同步 flow / 台账。
2. 若用户要求继续 Step 11,则先进入 Step 11 `开工与必读文档:先思考`;Step 11 必须以 Step 10 `R1.1`~`R1.26`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入,不得沿用旧正式 §10 或旧 Step 11 作为第一来源。
3. 在用户明确前,不得直接修改正式 02-概要设计.md,不得进入 Step 11。
```

#### R1.26.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 10 完成门禁自检。 |
| 是否判断正式 §10 草稿可回填 | pass | `R1.24` 可作为正式 `§10` 回填草稿,但尚未实际修改正式文档。 |
| 是否保留 Step 11 重审风险 | pass | 已保留 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 和旧异常主线回流风险。 |
| 是否明确停审裁决 | pass | Step 10 中间产物 completed;下一步等待用户决定。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 11 | no | 未写 Step 11 重审正文。 |

next_allowed_action: 等待用户决定下一动作:正式回填 `§10`,或进入 Step 11 `开工与必读文档:先思考`;在用户明确前不得直接修改正式 `02-概要设计.md`,不得进入 Step 11。

### R1.27 正式 §10 回填记录:再写入

#### R1.27.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 §10 回填。 |
| 回填来源 | `R1.24 正式 §10 回填草稿:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 10. 异常与边界场景轮廓`。 |
| 回填范围 | 仅整体替换正式 `## 10` 到 `## 11` 之前的内容。 |
| 未修改范围 | 未修改正式 `§11` 或后续章节。 |
| 回填方式 | 摘要化回填:保留异常总览、六个异常族压缩表、关键边界说明、极简传播图和全局红线;完整跨异常审计、旧材料差异审计和总停审过程仍以本文件 `R1.1`~`R1.26` 为准。 |

#### R1.27.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 §10 是否已回填 | pass | 正式 `02-概要设计.md` 的 `§10` 已按 `R1.24` 草稿整体替换。 |
| 是否只修改 §10 | pass | 本次回填目标限定在 `## 10` 到 `## 11` 之前。 |
| 是否恢复旧异常主线 | pass | `§10` 正文未恢复旧 `MethodContent`、outbox delivery、snapshot / fingerprint、plugin / configuration 或 marketplace 交易 / 安装主线。 |
| 是否保持六个异常族结构 | pass | `§10` 已改为 `10.1` 总览、`10.2`~`10.7` 六个异常族和 `10.8` 全局红线结构。 |
| 是否下沉 Step 11 | pass | `§10` 只写异常边界和传播红线,未把配置影响重审正文混入本章。 |
| 是否下沉详细设计 / 实现 | pass | `§10` 未写错误码、schema、port、repository、topic、payload、worker、scheduler、retry、storage、配置或测试方案。 |

#### R1.27.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| Step 11 仍是 historical completed_pending_recheck | open_for_step11_reopen | Step 11 必须从 `开工与必读文档:先思考` 重开,按当前 Step 10 红线重审。 |
| 旧 Step 10 异常主线回流 | open_for_step11_recheck | Step 11 不得借配置影响章节恢复旧 outbox、snapshot、fingerprint、plugin 或 marketplace 主线。 |
| Step 10 全局红线被后续配置讨论削弱 | open_for_step11_recheck | Step 11 必须继续遵守 Query no-write、Job 不修 truth、candidate 不等于 delivery、外围不污染核心和 body-free 不可绕过。 |
| Step 12 提前开工 | blocked_by_step11_recheck | 详细设计承接清单必须等待 Step 11 重审完成后再进入。 |

#### R1.27.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 10 中间产物 | completed | `R1.1`~`R1.26` 已闭合六个异常族、跨异常审计、旧材料审计、草稿和总停审。 |
| 正式 §10 | backfilled | 正式 `§10` 已按 `R1.24` 回填。 |
| Step 10 blocker | none | 当前 Step 10 无遗留 blocker。 |
| 下一步 | ready_for_step11_opening | 下一步只能进入 Step 11 `开工与必读文档:先思考`,不得直接沿用旧 Step 11 completed 结论。 |

next_allowed_action: 等待用户确认后进入 Step 11 `开工与必读文档:先思考`;Step 11 必须以正式 §10 回填后文本、Step 10 `R1.1`~`R1.27`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 `§10` 或 historical Step 11 作为第一来源。
