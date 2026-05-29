## Step 12. 横切关注点

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-bus/01-架构设计.md` §13 横切关注点

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.13 横切关注点
  - `standards/document/架构设计讨论流程_SOP.md` Step 12
  - `projects/L0-bus/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-bus/design-calibration/01_arch_step_08_data_ownership_consistency.md`
  - `projects/L0-bus/design-calibration/01_arch_step_09_interactions_communication.md`
  - `projects/L0-bus/design-calibration/01_arch_step_10_technology_choices.md`
- 已确认结论：
  - tap、DLQ、replay 和 failure material 需要授权边界。
  - bus audit / delivery history 必须可追溯。
  - 只读输出失败不能阻塞 bus truth。

### 3. SOP 问题回答

1. 安全边界如何处理？

   回答：发布接入、tap、DLQ read、replay preparation、failure material 和 operator 控制都必须有授权边界；bus 不保存 raw secret，不把安全入口职责内聚到本仓。

2. 可观测性需要覆盖哪些正式对象和关键链路？

   回答：需要覆盖 publication acceptance、delivery progression、ack / fail / timeout、retry、dead-letter、replay preparation、read output 派生和 backend health，但 bus 只输出材料，不承载观测产品。

3. 可用性和韧性需要守住什么底线？

   回答：Bus store 不可用时不形成不可追溯状态；MQ backend 不可用时挂起或进入失败恢复；只读消费方不可用时不阻塞主链；默认可验证路径必须能闭合核心链路。

4. 性能预算是否需要给出口径？

   回答：架构层不给具体数值，但要求测试方案为默认可验证路径补发布接入、delivery 推进、结果反馈、失败恢复和只读派生的基准。

5. 配置如何管理，哪些配置不应散落？

   回答：后端 profile、store profile、retry / DLQ 策略、read output 开关、授权策略引用和运行限额应集中进入配置设计，不应散落在 worker 或 adapter 私有逻辑中。

6. 审计与可追溯性如何被正式保证？

   回答：关键状态变化必须进入 bus audit / delivery history；replay preparation 必须关联 dead-letter、history 和 audit chain；adapter 能力变化必须可追溯。

7. 哪些横切项与本仓无关，不应机械照抄模板？

   回答：登录认证、用户权限系统、业务数据加密策略、UI 可访问性、长期日志报表、业务补偿策略不属于 bus 架构横切主线。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §12 / §14 | 可观测、性能、告警和 runbook 混写 | 架构横切、测试指标和运维细节层次不清 |
| §2 / §8 | tap-all、DLQ、replay 的授权边界不够集中 | privileged operation 容易被普通接口化 |
| §9 / §10 | 性能数字和后端指标提前写死 | 架构层应给判断口径，数值进入测试方案 |
| 全文 | 配置项未单独收束 | retry、DLQ、backend、projection 等配置容易散落 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 安全 | tap-all、DLQ 操作散落 | privileged operation 集中授权约束 | 防止无边界访问 |
| 可观测 | 指标和告警明细提前写 | 只定义需覆盖的链路和材料 | 具体指标进入测试 / 运维 |
| 可用性 | 后端 SLA 为主 | store 不可用、backend 不可用、只读消费失败的架构口径 | 更贴合 bus truth |
| 配置 | 无集中口径 | backend、store、retry、DLQ、read output、授权引用集中配置 | 防止配置散落 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：写完整监控指标和告警阈值 | 可操作 | 提前进入测试和运维实现 | 不采用 |
| 方案 B：写横切约束和判断口径 | 符合架构层职责 | 后续需测试 / 运维补数值 | 采用 |
| 方案 C：不单独写配置横切 | 文档更短 | 后续 backend / retry / projection 配置容易散落 | 不采用 |

### 7. 结构化中间产物

#### 7.1 横切关注点表

| 类别 | 架构约束 | 判断口径 |
|---|---|---|
| 安全 / 授权 | tap、DLQ read、replay preparation、failure material、operator control 必须有授权边界。 | 不得作为普通无约束读写面暴露。 |
| 禁止正文 | bus 不保存 raw secret、payload body、governance decision body、observability long-term log body。 | 禁止正文不得进入 truth、snapshot 或 tap output。 |
| 审计 / 可追溯 | acceptance、delivery、feedback、retry、DLQ、replay preparation 必须可追溯。 | 关键状态变化必须关联 audit 或 history。 |
| 可观测性 | bus 输出传递、失败、重试、死信、后端状态和只读派生材料。 | bus 输出材料，不承载长期报表产品。 |
| 可用性 / 韧性 | store 不可用时拒绝新状态；backend 不可用时挂起或失败恢复；只读消费失败不阻塞。 | 不生成不可追溯状态。 |
| 幂等 | bus 处理 delivery / feedback 幂等锚点。 | 不承接业务副作用幂等。 |
| 性能预算 | 架构层要求后续测试给默认路径基准。 | 本文不虚构 P95 / QPS。 |
| 配置管理 | backend、store、retry、DLQ、read output、授权引用、运行限额进入集中配置。 | 不允许散落在 adapter 或 worker 私有逻辑中。 |
| 标准对齐 | 消费 `L0-core` 的 CloudEvents / TraceContext 等契约口径。 | bus 不重新定义标准正文。 |

#### 7.2 不适用横切项

| 不适用项 | 原因 |
|---|---|
| 登录认证架构 | 属于安全入口层，不属于 bus。 |
| 用户权限系统 | bus 只要求授权边界，不定义完整权限系统。 |
| UI 可访问性 | 属于 `L5-console` 或其他产品层。 |
| 长期日志报表 | 属于 `L4-observability`。 |
| 业务补偿策略 | 属于发布方 / 订阅方或业务域。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §13 “横切关注点”直接摘录并润色本文件 §7.1、§7.2。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否在架构文档写具体 P95 / QPS | A. 写具体数字；B. 只写测试方案必须补基准；C. 完全不提性能 | B | 当前无已确认数字，架构应保留判断口径 | 已确认采用 B |
| 授权承接方是否现在定死 | A. gateway；B. governance；C. 架构层只确认授权边界，承接方后续决定 | C | 承接方会影响系统集成，当前先守红线 | 已确认采用 C |
| 配置是否独立成配置设计输入 | A. 是；B. 否，散落各章节；C. 只在实施计划写 | A | 后端、store、retry、DLQ、projection 等都需要统一配置口径 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 13 的待确认事项。
- 具体指标名、告警阈值、配置 schema、授权实现和密钥方案后移。

### 10. 进入下一步条件

- 已按横切类别收敛正式约束和判断口径。
- 已明确不适用横切项，避免机械照抄模板。
- 可以进入 Step 13 演进路线。
