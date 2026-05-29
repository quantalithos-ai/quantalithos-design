## Step 1. 确认需求基线

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-bus/01-架构设计.md` §1 / §3 / §16

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.1 与上游文档的关系声明
  - `standards/document/架构设计讨论流程_SOP.md` Step 1
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/01-架构设计.md`
  - `projects/L0-bus/design-calibration/00_requirements_calibration_flow.md`
- 已确认需求结论：
  - `L0-bus` 是基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。
  - `L0-bus` 不重新定义 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 或事件目录正文。
  - 当前 P0 主闭环是契约化输入、统一传递语义、delivery 推进、结果留痕、失败恢复和只读输出。
  - 当前 P0-min 需要 Outbox relay 边界和至少一条默认可验证 delivery path。
  - bus truth 只包含总线级传递事实，不包含业务 payload 正文、secret、治理决策正文或观测长期日志正文。

### 3. SOP 问题回答

1. 当前架构设计依赖哪些需求结论？

   回答：依赖新版 `00-需求文档.md` 中已经收稳的仓级定位、目标与非目标、核心能力闭环、功能需求 F-001~F-008、业务规则 BR-001~BR-012、数据归属、接口依赖、非功能要求、验收标准、风险清单和需求追溯矩阵。

2. 这些需求结论里，哪些已经稳定？

   回答：稳定结论包括 `L0-bus` 主干定位、`L0-core` 契约来源边界、P0 主闭环、P0-min 支撑边界、bus truth 数据归属、只读输出边界、禁止正文边界、at-least-once + subscriber idempotency 口径，以及旧四后端全量 P0、三语言 client、147 事件目录真相等旧口径不再作为 P0 需求。

3. 哪些需求结论仍然待确认？

   回答：默认可验证后端路径、Outbox relay 运行形态、tap / DLQ / replay / failure material 授权承接方、性能容量初始目标、Redis / Kafka 完整生产 adapter 版本、multi-tenant isolation 和 exactly-once / effectively-once 仍待后续 Step 决策，但不阻塞架构目标和边界讨论。

4. 哪些需求会直接影响架构边界？

   回答：不定义共享契约、不保存业务正文、不替 SDK 封装 client、不替 observability 做长期存储、不替 governance 做决策、不替部署层运维 MQ 集群，直接决定本仓职责边界、系统上下文和非目标。

5. 哪些需求会直接影响数据所有权？

   回答：publication acceptance、delivery record、ack / fail result、idempotency anchor、retry / dead-letter / replay material、bus audit trail 属于 bus truth；transport view、tap / trace / metrics material、failure summary 是只读快照；core contract、payload、outbox fact、backend capability 是引用；business payload body、raw secret、governance decision body、observability long-term log body 禁止进入 bus truth。

6. 哪些需求会直接影响依赖方向或一致性策略？

   回答：`L0-bus` 编译期只依赖 `L0-core`，运行期依赖消息后端和持久化能力，事件协作上服务全平台发布 / 订阅。当前一致性策略是 at-least-once、bus 级 delivery / feedback 幂等锚点、订阅方业务幂等、retry / DLQ / replay preparation 和 append-only audit / history。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 文档头部 | 旧架构把 bus-draft 和 147 事件目录作为强关联输入，但没有声明新版 `00-需求文档.md` 是直接基线 | 容易让历史草案覆盖新版需求 |
| §1.1 / §1.2 | 使用“唯一主干”“tap-all”“archive”等扩张叙事 | 容易把只读输出、观测和归档消费误写成 bus 自身职责 |
| §1.3 | 把四后端、NATS P95、DLQ 100%、后端切换 0 行写成成功标准 | 与当前 P0-min 收口冲突 |
| §2.1 / §2.2 | 将 CloudEvents、W3C、tap-all、默认 NATS、DLQ 保留期混写为约束 | 缺少 core / bus / sdk / observability / governance 边界分层 |
| §2.3 | 使用 147 事件、26 仓、QPS、lag、outbox backlog 等旧假设 | 与当前 27 仓和需求层不虚构性能数字原则冲突 |
| §3 | 提前选择 Port/Adapter + per-backend crate + shared EventBus trait | 技术选型应在 Step 10 决策 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构基线 | 旧 `01-架构设计.md` 直接承接 bus-draft、event-catalog 和四后端设想 | 以新版 `00-需求文档.md` v0.2.0 为直接需求基线 | 架构必须承接已收稳需求 |
| 仓定位 | 事件编织唯一主干，覆盖大量下游消费场景 | 基于 `L0-core` 契约的事件传递、订阅推进、失败恢复和总线留痕主干 | 收窄到本仓不可替代职责 |
| P0 范围 | 四后端、tap-all、CLI、完整 outbox / DLQ 混入 P0 | F-001~F-006 是 P0 主闭环，F-007 / F-008 是 P0-min 支撑边界 | 避免外围增强提前写死 |
| 契约来源 | CloudEvents / W3C / event-catalog / bus-draft 混合 | 共享契约只来自 `L0-core` | 守住 core / bus 单一真相 |
| 数据归属 | DLQ、outbox、tap、backend record 散列 | 按 bus truth、只读快照、外部引用、禁止正文组织 | 支撑后续数据所有权推导 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续沿用旧架构基线，只局部修正文案 | 改动小 | 旧 P0 范围、旧依赖和旧指标会持续污染后续设计 | 不采用 |
| 方案 B：以新版 `00-需求文档.md` 为唯一需求基线，旧架构只作诊断 | 边界清晰，能与需求追溯矩阵对齐 | 需要重建架构文档 | 采用 |
| 方案 C：保留四后端全量 P0 | 后端替换叙事完整 | 与默认可验证路径收口冲突，实现和验收负担过重 | 不采用 |

### 7. 结构化中间产物

#### 7.1 架构需求基线清单

| 需求结论 | 来源章节 | 架构影响 | 稳定性 |
|---|---|---|---|
| `L0-bus` 是基于 `L0-core` 契约的跨仓事件传递主干 | 需求 §2 / §4 | 决定系统边界、职责边界和依赖方向 | 稳定 |
| `L0-bus` 不重新定义共享契约 | 需求 §1 / §2 / §10 / §14 | 决定 core / bus 边界和一票否决项 | 稳定 |
| 核心能力闭环为契约化输入、传递语义、delivery、结果留痕、失败恢复、只读输出 | 需求 §7 / §9 / §16 | 决定架构目标、主要结构和数据流主线 | 稳定 |
| F-001~F-006 是当前 P0 主闭环 | 需求 §9 / §14 / §16 | 决定架构必须优先支撑的能力边界 | 稳定 |
| F-007 Outbox relay 和 F-008 backend adapter 是 P0-min 支撑边界 | 需求 §9 / §14 / §15 | 决定默认可验证路径和后续选型讨论 | 稳定但形态待定 |
| bus truth、只读快照、外部引用、禁止正文四类数据归属已收稳 | 需求 §11 / §14 | 决定数据所有权、一致性和审计策略 | 稳定 |
| tap、DLQ、replay、failure material 必须具备授权边界 | 需求 §10 / §13 / §14 / §15 | 决定横切安全和 privileged operation | 稳定但承接方待定 |
| Redis / Kafka 完整适配、Filter DSL、DLQ UI、多租户、effectively-once 后移 | 需求 §4 / §7 / §9 / §15 | 决定当前架构不把这些写成 P0 主线 | 稳定 |

#### 7.2 架构硬约束清单

| 硬约束 | 约束影响 |
|---|---|
| 不得重新定义 `L0-core` 已拥有的共享契约 | 职责边界、系统上下文、接口和技术选型必须把 core 作为契约来源 |
| 不得保存或解释业务 payload 正文真相 | 数据所有权、持久化和 tap 输出只能保存引用或总线传递事实 |
| 不得让只读输出反写 bus truth | SDK、observability、governance 和 operator 输出必须保持只读边界 |
| 不得把 failure material 直接设计成 governance decision | governance 消费失败事实，但决策归 `L1-governance` |
| 不得在缺少 dead-letter、delivery history 和 audit chain 时 replay | replay 必须是受控恢复路径 |
| 不得让 backend adapter 差异泄漏为上层 transport semantic | adapter 边界必须吸收后端差异 |
| 不得把运行期依赖或事件协作依赖错误写成 Cargo path dependency | 后续详细设计和实施计划必须遵守全局依赖裁剪规则 |

#### 7.3 未关闭需求风险清单

| 风险 / 待确认项 | 架构处理口径 | 是否阻塞 Step 2 |
|---|---|---|
| 默认可验证后端路径具体形态未定 | Step 10 技术选型决策；Step 6 / Step 9 先保留默认可验证路径结构要求 | 否 |
| Outbox relay 运行形态未定 | Step 6 / Step 9 / Step 11 比较部署和交互形态 | 否 |
| tap、DLQ、replay、failure material 授权承接方未定 | Step 12 明确横切授权边界 | 否 |
| 性能、容量、延迟和恢复时间没有初始数字 | Step 14 保留风险，测试方案补默认路径基准 | 否 |
| Redis / Kafka 完整生产 adapter 版本未定 | Step 13 演进路线处理 | 否 |
| 旧架构仍有四后端全量 P0、26 仓、147 事件真相、tap-all 等旧口径 | 本轮逐 Step 重建，Step 16 删除旧文件并重建正式架构文档 | 否 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §1 “与上游文档的关系声明”摘录本文件 §7.1 中与上游来源相关的结论，并结合 `00-需求文档.md` §1 补来源表。
- §3 “约束条件”摘录本文件 §7.2 和 §7.3。
- §16 “需求追溯矩阵”在 Step 15 统一生成，本 Step 仅提供追溯基线。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 架构基线是否以新版 `00-需求文档.md` 为直接基线 | A. 以新版需求为唯一需求基线；B. 新旧架构混用；C. 继续沿用旧架构 | A | 新版需求已明确替换旧 P0、旧依赖和旧边界口径 | 已确认采用 A |
| 旧四后端全量适配是否继续作为当前 P0 | A. 保留四后端全量 P0；B. 当前只保留 adapter boundary + default verifiable path；C. 完全不讨论后端 | B | 既能保证可验证闭环，又避免把外围增强提前写死 | 已确认采用 B |
| 147 事件目录是否作为 bus schema truth | A. 作为 schema truth；B. 只作为事件规模和消费样本；C. 完全删除 | B | schema truth 属于 `L0-core`，但规模和样本仍有参考价值 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 2 的待确认事项。
- 默认可验证后端路径、Outbox relay 形态、授权承接方、性能容量目标、Redis / Kafka 版本、多租户和 effectively-once 均挂入风险或后续 Step。

### 10. 进入下一步条件

- 已明确新版 `00-需求文档.md` v0.2.0 是直接需求基线。
- 已明确旧 `01-架构设计.md` 只能作为问题诊断和可迁移事实来源。
- 已形成架构需求基线清单、架构硬约束清单和未关闭需求风险清单。
- 可以进入 Step 2 明确架构目标与约束。
