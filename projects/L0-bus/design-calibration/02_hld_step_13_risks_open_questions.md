# Step 13. 设计风险与待确认事项

## 1. Step 状态

- 状态：[x] 已创建
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-bus/02-概要设计.md` §13 设计风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 ~ Step 12 已确认结论 | 代码主体、主要组成部分、对象、接口、处理流、状态机、异常、配置影响和详细设计承接清单 |
| Step 7 待确认项 | query 粒度、rejected event、publication acceptance query、backend capability flow 等接口粒度问题 |
| Step 8 待确认项 | outbox relay 与 consumer 是否拆图、query / outbound event 是否逐个画流 |
| Step 9 待确认项 | retry 是否改 delivery 状态、backend capability 是否定义独立状态、replay preparation 是否一步到 ready |
| Step 10 待确认项 | late ack、projection missing、backend capability 变化的处理口径 |
| Step 11 待确认项 | JSON 示例是否进入概要设计、domain policy 是否直读配置、capability 变化是否重调度 |
| Step 12 承接约束 | 待确认项不进入详细设计承接清单，必须在本步集中收纳 |

已确认结论：

```text
Step 13 不写任务清单。
它只收纳概要设计层仍需提醒详细设计注意的风险和待确认问题。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些？

回答：

主要风险集中在五类：状态时序风险、只读输出边界风险、后端能力边界风险、配置绕过边界风险、详细设计暗改概要主语风险。它们不一定阻塞 Step 14，但必须在正式概要设计中提示详细设计按保守口径展开。

### 3.2 当前还有哪些问题尚未形成定论，只能作为待确认事项挂起？

回答：

仍需挂起的问题包括：late ack 是否允许改变已失败或已死信 delivery、projection missing 是否由 Query 自动触发 rebuild、backend capability 变化是否自动重调度 delivery、`RequestRetry` 是否直接让 `DeliveryStatus.failed -> scheduled`、`PrepareReplay` 是否一步进入 ready、是否定义 `BackendCapabilityStatus`。当前均有推荐口径，但尚未作为不可变详细设计输入。

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓？

回答：

late ack 影响反馈、幂等、delivery 状态机和异常处理；projection missing 影响 query、projection job 和配置影响；backend capability 变化影响后端适配、capability event 和 delivery truth 边界；retry 状态口径影响 `RetryPlan`、`DeliveryStatus` 和 `RunRetryCycle`；replay ready 口径影响 `ReplayPreparation` 状态机；backend capability status 会影响 Step 6 是否新增对象状态。

### 3.4 哪些问题若不先收纳，后续详细设计会被误导？

回答：

最容易误导详细设计的是：把待确认项当作稳定输入、把配置开关当作绕过红线的机制、把 projection / Query 当作写入口、把 backend capability check 当作 delivery 状态触发器、把 failure material 当作 governance decision、把业务幂等当作 bus 幂等。

### 3.5 哪些内容只是任务或优化项，不应被包装成设计风险或待确认事项？

回答：

Rust 模块拆分、具体 DTO 字段、错误码编号、配置 JSON 示例、测试用例全集、开发排期、性能基准数字、worker 参数、publisher retry 参数属于详细设计、测试方案、配置说明或实施计划，不应在本步包装成概要设计风险。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 ~ Step 12 | 每一步都有局部待确认项 | 如果不集中收纳，Step 14 正式文档容易遗漏或重复 |
| Step 12 | 明确待确认项不进入承接清单 | 需要 Step 13 作为正式挂起位置 |
| 前序中间产物 | 多数待确认项已有推荐方案 | 需要区分“当前按推荐推进”和“已成为稳定结论” |
| 正式概要设计生成前 | 风险尚未归类 | 需要把设计风险和待确认事项拆开，避免混写 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险位置 | 分散在各 Step 待确认事项 | 集中形成设计风险表 | 便于正式概要设计收口 |
| 待确认项 | 每步各自说明 | 统一列影响范围和当前挂起口径 | 防止详细设计误读 |
| 稳定输入 | 与待确认项容易混淆 | 明确待确认项不进入 Step 12 承接清单 | 保持 03 输入稳定 |
| 任务与风险 | 可能混写 | 排除开发任务、排期和测试全集 | 对齐 SOP |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把前序所有待确认项都写成风险 | 不会遗漏 | 风险泛化，无法区分真正影响概要成立性的事项 | 不采用 |
| 方案 B：把前序推荐方案都转为稳定结论 | 正式文档更短 | 可能把未正式确认的方案写死 | 不采用 |
| 方案 C：设计风险和待确认事项分表，待确认项给当前挂起口径 | 边界清楚，可进入 Step 14 | 正式文档仍需保留少量未闭环项 | 采用 |

---

## 7. 结构化中间产物

### 7.1 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 详细设计暗改概要主语 | 会影响对象、接口、处理流、状态机和配置实现契约 | 详细设计发现主语变化时必须回退对应概要 Step，不得在 03 中暗改 |
| late feedback 破坏状态机 | 影响 `FeedbackResult`、`DeliveryStatus`、幂等和 recovery | 当前按保守口径处理：late ack 不直接把 failed / DLQ 改回 completed |
| projection / Query 被实现成写入口 | 影响 `ProjectionStatus`、Query API、read output 和 truth repository | 当前规定 Query 只返回 consistency marker 或 rebuild 建议，不自动修写真相 |
| backend capability check 越界改写 delivery truth | 影响 `BackendCapabilityPolicy`、`CheckBackendCapability` 和 `DeliveryStatus` | 当前规定 capability check 只更新能力视图、audit 和 event，不重调度 delivery |
| 配置开关绕过领域红线 | 影响 payload boundary、audit chain、trusted replay、read-only output 和 secret boundary | 当前规定禁止配置化边界必须由 `ConfigValidator` 和 runtime builder 限制 |
| failure material 被误当 governance decision | 影响 failure summary、governance 消费方和 recovery 边界 | 当前规定 failure material 只表达 bus 失败事实，治理决策由 governance 仓承担 |
| bus 幂等与业务幂等混淆 | 影响 `IdempotencyAnchor`、feedback、delivery 和订阅方边界 | 当前规定 bus 只处理 delivery / feedback 幂等，不接管业务副作用幂等 |
| replay preparation 被误解为 replay executor | 影响 `ReplayPreparationStatus`、DLQ、audit chain 和 operator 流程 | 当前规定 preparation ready 只代表前置材料满足，不代表 replay 已执行 |
| adapter 产品语义泄漏进 platform transport semantic | 影响 `TransportSemantic`、`BackendCapabilityRef` 和后端适配边界 | 当前规定后端 raw status / 私有响应必须归一化，不能直接写入 bus truth |

### 7.2 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| late ack 是否允许把 failed 改回 completed | `RecordDeliveryFeedback`、`FeedbackResult`、`DeliveryStatus`、异常处理 | 按“不允许直接改回”推进；详细设计只定义冲突 / duplicate / ignore 等保守响应 |
| projection missing 是否自动触发 rebuild | Query API、`ReadProjectionRepository`、`RebuildReadProjection`、配置影响 | 按“Query 返回 consistency marker，由 job / operator 触发 rebuild”推进 |
| backend capability 变化是否自动重新调度 delivery | `CheckBackendCapability`、`BackendCapabilityPolicy`、`DeliveryStatus` | 按“只发能力变化事件和审计，不自动重调度 delivery”推进 |
| `RequestRetry` 是否直接让 `DeliveryStatus.failed -> scheduled` | `RequestRetry`、`RunRetryCycle`、`RetryPlanStatus`、`DeliveryStatus` | 当前按推荐 A 推进，但详细设计若发现并发或语义问题，应回退 Step 9 |
| `PrepareReplay` 是否一步到 ready | `PrepareReplay`、`ReplayPreparationStatus`、replay trusted chain | 当前按“前置条件满足时可 draft -> ready”推进，但 ready 不代表 replay 执行 |
| 是否定义 `BackendCapabilityStatus` | `BackendCapabilityRef`、`BackendCapabilityPolicy`、`CheckBackendCapability`、状态机 | 当前按“不新增 bus truth 状态集合”推进；若要新增需回退 Step 6 / Step 9 |
| `PublicationRejectedEvent` 是否正式对外传播 | Outbound Event、publisher / observability 消费方 | 当前按“传播 rejected fact”推进；详细 schema 和消费者边界由 03 定义 |
| `GetPublicationAcceptance` 是否保留独立 Query | Query API、publication acceptance view | 当前按“保留独立 Query”推进；03 定义 view DTO 和 not-found 行为 |

### 7.3 不应列为风险或待确认的事项

| 事项 | 不进入本步的原因 | 后续位置 |
|---|---|---|
| Rust crate / module / file tree | 属于详细设计或实施计划 | `03-详细设计.md` / `07-实施计划.md` |
| HTTP path、JSON / proto schema、CloudEvent 字段 | 属于协议详细设计 | `03-详细设计.md` |
| 配置 JSON 示例、默认值、环境变量 | 属于配置说明 | `04-配置说明.md` |
| 错误码编号、adapter exception mapping | 属于详细设计错误契约 | `03-详细设计.md` |
| retry interval、batch size、checkpoint 参数 | 属于详细设计 / 配置说明 | `03-详细设计.md` / `04-配置说明.md` |
| 测试用例全集和验收脚本 | 属于测试方案和验收标准 | `05-测试方案.md` / `06-验收标准.md` |
| 开发任务、commit boundary、排期 | 属于实施计划 | `07-实施计划.md` |

### 7.4 进入 Step 14 的收口口径

| 类型 | Step 14 处理方式 |
|---|---|
| 设计风险 | 写入正式 §13 设计风险表，保持当前处理口径 |
| 待确认事项 | 写入正式 §13 待确认事项表，保持当前挂起口径 |
| 不进入本步的任务项 | 不写入正式 §13，交给后续 03~07 文档 |
| 若用户在 Step 14 前确认某项 | 从待确认事项移入对应稳定章节或详细设计承接清单 |

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §13 “设计风险与待确认事项”应从本文件摘录并整理以下内容：

- §13.1 “设计风险表”
- §13.2 “待确认事项表”
- §13.3 “不应列为风险或待确认的事项”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| Step 13 是否保留待确认项 | A：全部转稳定结论；B：保留待确认表并给当前挂起口径 | 建议 B | 用户尚未逐项确认，不能伪装成稳定输入 |
| 是否把实施任务写入风险表 | A：写；B：不写，交给实施计划 | 建议 B | 本步只收纳设计层未闭环项 |
| 是否画风险矩阵图 | A：画；B：不画 | 建议 B | 书写规范明确本章禁止画图 |

以上待确认项不阻塞进入 Step 14。除非后续讨论明确改变，否则 Step 14 按“建议方案”整理正式文档。

---

## 10. 进入下一步条件

- 已明确概要设计层哪些问题构成设计风险。
- 已明确哪些问题仍待确认，并给出当前挂起口径。
- 已说明这些问题会影响哪些对象、接口、处理流、状态机、配置影响或下游边界。
- 已排除项目任务、TODO、开发排期、测试用例全集和实施指令。
- 已足以进入 Step 14 “整理正式概要设计文档”。
