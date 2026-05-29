## Step 15. ADR 与需求追溯

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 15
- 回填章节：`projects/L0-bus/01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.16 需求追溯矩阵
  - `standards/document/架构设计书写规范.md` §4.17 ADR 索引
  - `standards/document/架构设计讨论流程_SOP.md` Step 15
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/design-calibration/01_arch_step_01_requirements_baseline.md` ~ `01_arch_step_14_risks_open_questions.md`
- 已确认结论：
  - 本 Step 只追溯前文已确认结论，不新增新架构决定。

### 3. SOP 问题回答

1. 哪些架构决定需要沉淀为 ADR？

   回答：需要沉淀的决定包括以新版需求为基线、不重新定义 `L0-core` 契约、采用 ports and adapters、采用 in-memory default path、采用 at-least-once + idempotency anchor、禁止保存业务正文、只读输出不反写、生产后端后移。

2. 每个关键架构决定对应哪些需求、约束或风险来源？

   回答：这些决定分别对应需求 §2 / §4 / §7 / §9 / §10 / §11 / §14 / §15 / §16，以及 Step 1~14 的结构化结论。

3. 是否存在没有需求来源的架构设计？

   回答：当前未发现没有需求来源的架构设计。in-memory default path 是对“默认可验证路径”风险的架构决策，来源于需求 §9 / §14 / §15。

4. 是否存在没有架构承接的核心需求或关键约束？

   回答：当前未发现未承接的 P0 核心需求；F-001~F-008、BR-001~BR-012、数据归属、验收否决项均有架构章节承接。

5. 哪些取舍和红线必须长期可追溯？

   回答：core / bus 边界、后端默认路径、at-least-once、禁止正文、只读输出、replay 链、依赖类型裁剪、生产后端后移必须长期可追溯。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §16 | 旧追溯表仍引用旧 US / F 编号和 bus-draft 口径 | 与新版需求文档不一致 |
| §16 | ADR 索引和需求追溯混杂 | 难以判断每个决定的来源 |
| 全文 | NATS、四后端、147 事件等旧决定缺少替换记录 | 后续可能误以为仍是正式架构决定 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯来源 | 旧 bus-draft、event-catalog、旧 US / F | 新版 `00-需求文档.md` F-001~F-008、BR-001~BR-012、Step 1~14 | 对齐新版需求 |
| ADR 内容 | 旧 ADR 索引不区分决定类型 | 按关键架构决定列 ADR 候选 | 便于长期追溯 |
| 漏项检查 | 缺少系统性检查 | 增加无孤儿设计、无漏承接检查 | 防止新增无来源结论 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列章节引用 | 简短 | 无法追溯架构决定来源 | 不采用 |
| 方案 B：ADR 索引 + 需求追溯矩阵 + 漏项检查 | 完整可审计 | 文档稍长 | 采用 |
| 方案 C：把所有技术选型都写 ADR | 完整 | ADR 噪音过大 | 不采用 |

### 7. 结构化中间产物

#### 7.1 ADR 索引结论

| ADR 候选 | 决定 | 来源 | 状态 |
|---|---|---|---|
| ADR-bus-001 | 以新版 `00-需求文档.md` 作为架构直接基线，旧架构只作诊断材料。 | Step 1 | 建议沉淀 |
| ADR-bus-002 | `L0-bus` 只消费 `L0-core` 契约，不重新定义共享契约。 | 需求 §1 / §2 / §10 / Step 1 | 建议沉淀 |
| ADR-bus-003 | 采用 ports and adapters 隔离核心语义、入口、后端和存储。 | Step 7 / Step 10 / Step 11 | 建议沉淀 |
| ADR-bus-004 | 当前 P0 默认采用 in-memory transport default path 验证核心闭环。 | Step 10 / Step 11 / Step 13 | 建议沉淀 |
| ADR-bus-005 | 默认投递语义采用 at-least-once + bus idempotency anchor + subscriber idempotency。 | 需求 §4 / §10 / §13 / Step 8 / Step 10 | 建议沉淀 |
| ADR-bus-006 | 禁止保存业务正文、secret、治理决策正文和观测长期日志正文。 | 需求 §11 / Step 8 / Step 12 | 建议沉淀 |
| ADR-bus-007 | 只读输出不得反写 bus truth。 | 需求 §10 / Step 3 / Step 8 / Step 12 | 建议沉淀 |
| ADR-bus-008 | Redis / Kafka 完整生产 adapter、Filter DSL、多租户、effectively-once 后移。 | 需求 §4 / Step 10 / Step 13 | 建议沉淀 |

#### 7.2 需求追溯矩阵

| 需求 / 约束 | 架构承接章节 | 关键决定 |
|---|---|---|
| F-001 契约绑定的发布材料接入 | §5 / §7 / §10 | 发布接入同步边界、core 契约引用、bus acceptance truth |
| F-002 统一传递语义形成 | §6 / §8 / §11 | 传递语义核心、ports and adapters、unified transport semantic |
| F-003 订阅与 delivery 推进 | §7 / §10 / §11 | Delivery worker、异步 delivery、at-least-once |
| F-004 delivery 结果与幂等锚点记录 | §9 / §10 / §11 | bus truth、feedback 边界、idempotency anchor |
| F-005 失败恢复与死信 / replay 准备 | §9 / §10 / §13 | retry / DLQ / replay preparation、audit chain |
| F-006 总线级审计、tap 和只读输出 | §9 / §10 / §13 | read-only projection、tap / audit material、只读不反写 |
| F-007 Outbox relay 边界承接 | §4 / §7 / §10 | Outbox relay boundary，不拥有业务 outbox truth |
| F-008 后端适配边界与默认可验证路径 | §8 / §11 / §12 / §14 | adapter boundary、in-memory default path、生产 adapter 后移 |
| BR-001 core 契约边界 | §1 / §3 / §4 | 不重新定义共享契约 |
| BR-002 payload 边界 | §3 / §9 / §13 | 不保存或解释业务 payload body |
| BR-003 后端差异边界 | §8 / §11 / §12 | backend adapter 差异不泄漏 |
| BR-004 显式留痕 | §9 / §13 | delivery history 和 bus audit |
| BR-005 replay 边界 | §9 / §13 / §15 | 无完整历史链不得 replay |
| BR-006 幂等边界 | §9 / §11 | bus 级幂等锚点，不承接业务副作用 |
| BR-007 只读输出边界 | §4 / §9 / §13 | SDK / tap / failure material 不反写 truth |
| BR-008 授权边界 | §13 / §15 | privileged operation 必须授权 |
| BR-009 governance 边界 | §4 / §9 / §13 | failure material 不等于 governance decision |
| BR-010 outbox 边界 | §4 / §10 | 只承接已提交 outbox fact |
| BR-011 审计约束 | §9 / §13 | audit / history append-only 或可追溯 |
| BR-012 adapter 变化约束 | §8 / §11 / §15 | adapter 能力变化不得静默改变语义 |

#### 7.3 漏项检查结论

| 检查项 | 结果 |
|---|---|
| 是否存在没有需求来源的架构设计 | 否 |
| 是否存在没有架构承接的 P0 功能需求 | 否 |
| 是否存在没有边界保护的关键业务规则 | 否 |
| 是否存在旧四后端 P0 口径残留为正式决定 | 否 |
| 是否存在未确认风险被写成确定结论 | 否 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §16 “需求追溯矩阵”直接摘录并润色本文件 §7.2、§7.3。
- §17 “ADR 索引”直接摘录并润色本文件 §7.1。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| ADR 是否现在创建正式 ADR 文件 | A. 创建；B. 只在架构设计中列索引，后续统一建 ADR；C. 不记录 | B | 当前任务是架构文档校准，不扩展到 ADR 文件体系 | 已确认采用 B |
| 是否把所有技术名词都列为 ADR | A. 是；B. 只列关键架构决定；C. 不列技术决定 | B | ADR 应保留长期架构决策，不记录普通实现选择 | 已确认采用 B |
| 是否追溯到旧 bus-draft | A. 作为主追溯；B. 作为历史参考，不做主追溯；C. 删除 | B | 新版需求是直接基线，旧草案只作候选事实来源 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 16 的待确认事项。
- 正式 ADR 文件是否创建，后续单独决策。

### 10. 进入下一步条件

- 已建立 ADR 索引、需求追溯矩阵和漏项检查结论。
- 未新增前文未确认的新架构结论。
- 可以进入 Step 16 整理正式文档。
