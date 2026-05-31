# Step 8. 数据所有权与一致性策略

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-sdk/01-架构设计.md` §9 数据所有权与一致性策略

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.9 数据所有权与一致性策略
  - `standards/document/架构设计讨论流程_SOP.md` Step 8
  - `projects/L0-sdk/00-需求文档.md` §11 数据需求与数据归属 / §12 接口与依赖
  - `projects/L0-sdk/design-calibration/01_arch_step_03_responsibility_boundary.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_05_bounded_context.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_06_container_deployment.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_07_dependency_direction.md`
- 已确认结论：
  - `L0-sdk` 拥有官方客户端语义、语言映射、package candidate、默认横切行为、文档示例、兼容演进和验证证据的 truth。
  - `L0-core` / `L0-bus` / L1/L2/L3/L4 formal APIs 的正式 truth 不归 SDK；SDK 只能保留快照、投影或引用。
  - SDK 不保存业务正文、事件 payload 正文、生产请求响应正文、观测正文、UI / runtime 状态正文或凭据正文。
  - 本 Step 只讨论架构层数据归属和一致性口径，不写数据库、缓存、文件结构、schema 字段、同步实现或测试脚本。

### 3. SOP 问题回答

1. 哪些数据由本仓拥有真相？

   回答：本仓拥有官方客户端公共概念与语言映射口径、SDK package candidate 状态、默认错误 / trace / redaction 行为口径、版本兼容与 deprecated 结论、quickstart / docstring / 示例内容，以及跨语言验证证据的正式真相。

2. 哪些数据只是快照、投影或引用？

   回答：`L0-core` 契约派生类型视图、`L0-bus` 事件语义客户端视图、L1/L2/L3/L4 服务边界客户端视图、ErrorCode / TraceContext / metadata 消费视图属于快照 / 投影；上游版本、ADR / 标准 / 设计文档、fake / fixture endpoint、reports / artifacts 位置属于引用关系。

3. 哪些关系必须强一致？

   回答：官方客户端语义与语言映射、同一 package candidate 的三语言横切默认、candidate 状态与验证结论、兼容 / deprecated 结论与文档迁移说明，在候选发布或验收边界内必须强一致；不一致时不能标记为已验证或稳定。

4. 哪些关系可以最终一致？

   回答：上游 core / bus / formal API truth 到 SDK 快照、服务边界视图到文档示例、下游反馈到 SDK 变更、reports / artifacts 引用刷新，都可以最终一致，但必须可标记为 stale、pending、failed 或 unsupported。

5. 失败时靠什么口径约束、补偿或挂起？

   回答：SDK truth 内部不一致时阻断 candidate 或稳定结论；上游快照不一致时标记 stale / pending，不伪造上游 truth；引用失效时保持引用失效态，不补造正文；禁止正文进入时必须拒绝、脱敏或让验证失败。

6. 哪些数据边界如果不写清，后续最容易串仓？

   回答：最容易串仓的是把 generated binding 当成 SDK 自有契约 truth、把 bus 事件 client 视图当 bus runtime truth、把服务边界 client 视图当服务端业务 truth、把示例 / reports 正文当生产数据证据、把凭据材料或请求响应正文写入 SDK 日志和验证报告。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §8.1 数据所有权矩阵 | 旧文档以 `proto-ref.toml`、`versions.toml`、generated binding、examples 为数据项 | 偏文件和工具链视角，没有表达 SDK truth / 上游快照 / 引用 / 禁止正文四类边界 |
| §8.2 一致性层次 | 旧文档写同语言 wrapper 与 binding、三语言概念、发版一致性 | 方向有价值，但缺少候选验证、上游快照、引用失效和禁止正文处理 |
| §8.3 补偿机制设计 | 旧文档聚焦发版失败、codegen 不一致、示例过时 | 更像实施和 CI 处置，不足以覆盖架构层数据归属 |
| 全文 | 公共注册表和 release workflow 容易被写成当前 truth 载体 | 与当前本地 package candidate 先行、公共发布后移的口径冲突 |
| 全文 | 缺少生产请求响应正文、事件 payload 正文和凭据正文的一票否决边界 | 后续实现可能在日志、示例或 evidence 中泄露敏感正文 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | 文件、生成物、examples | SDK truth、上游快照 / 投影、引用关系、明确不拥有正文 | 对齐架构规范 4.9 |
| SDK truth | 隐含在 wrapper / examples 中 | 明确为官方 client 语义、语言映射、candidate、横切默认、兼容和验证证据 | SDK 不是 binding-only 仓 |
| 上游数据 | core proto 和 bus API 容易被 SDK 吸收 | 只能作为派生快照或客户端视图 | 保护 core / bus / 服务仓真相 |
| 一致性 | release / CI 层描述 | 候选边界强一致、上游快照最终一致、引用有效性一致、禁止正文边界一致 | 用架构口径指导后续设计 |
| 失败处理 | 重试发版或阻断 merge | 阻断 stable、标记 stale / pending、引用失效、拒绝正文进入 | 更符合数据归属边界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续用 proto-ref / versions / generated binding / examples 作为数据所有权主表 | 接近旧实现 | 会把文件和生成物当成 truth，难以保护上游边界 | 不采用 |
| 方案 B：按正式真相、快照 / 投影、引用关系、明确不拥有正文划分 | 边界清晰，能承接需求 §11 | 后续概要 / 详细设计需要再落到具体结构 | 采用 |
| 方案 C：只写“SDK 不保存业务数据” | 简短 | 无法说明 SDK 自己真正拥有的官方客户端 truth | 不采用 |
| 方案 D：把 reports / artifacts 原文都归 SDK truth | 证据集中 | 会让外部证据正文和运行输出污染 SDK truth | 不采用，仅保留证据结论和引用 |

### 7. 结构化中间产物

#### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 官方客户端公共概念与语言映射口径 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | 这是 SDK 作为官方三语言 client 的核心语义，不等同于任一语言目录。 |
| SDK package candidate 状态 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | 当前 P0 以本地 candidate 为正式承载，不等同于公共注册表发布状态。 |
| SDK 默认错误 / trace / redaction 行为口径 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | 上游提供 Error / Trace 基础契约，SDK 拥有客户端默认使用口径。 |
| SDK 版本兼容与 deprecated 结论 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | 兼容结论必须能追溯上游版本和 SDK 变更，不由下游消费方直接决定。 |
| SDK quickstart、docstring 与示例内容 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | 示例是真实 SDK 使用口径，不是生产业务正文样本库。 |
| SDK 跨语言验证证据结论 | 正式真相数据 | 由 `L0-sdk` 拥有正式真相。 | SDK 拥有 pass / fail / stale 等结论，不拥有外部运行正文。 |
| `L0-core` 契约派生类型视图 | 快照 / 投影数据 | SDK 可保留语言消费快照。 | `L0-core` 契约正式 truth 仍归 `L0-core`。 |
| `L0-bus` 事件语义客户端视图 | 快照 / 投影数据 | SDK 可保留事件 client 消费视图。 | delivery、retry、DLQ、replay、tap truth 不归 SDK。 |
| L1/L2/L3/L4 服务边界客户端视图 | 快照 / 投影数据 | SDK 可保留运行期客户端视图。 | 服务端业务事实和领域规则仍归对应服务仓。 |
| ErrorCode / TraceContext / metadata 消费视图 | 快照 / 投影数据 | SDK 可保留三语言消费视图。 | 基础契约 truth 仍由 `L0-core` 拥有。 |
| 上游版本引用 | 引用关系数据 | SDK 保存对 core、bus 和 formal API 版本的引用。 | 引用有效不等于拥有上游正文。 |
| ADR / 标准 / 设计文档引用 | 引用关系数据 | SDK 保存对设计来源和标准来源的引用。 | 正文 truth 仍归原文档或标准来源。 |
| fake / fixture endpoint 引用 | 引用关系数据 | SDK 保存受控验证目标引用。 | endpoint 实现 truth 不归 SDK。 |
| reports / artifacts / 发布证据引用 | 引用关系数据 | SDK 保存证据入口和验证结论引用。 | 外部执行产物正文不自动成为 SDK truth。 |
| 业务对象正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | 业务 truth 属于对应 L1/L2/L3/L4 仓。 |
| 事件实例 payload 正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | 事件实例正文不属于事件 client 语义。 |
| 生产请求 / 响应正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | 可用于运行期传输，不进入 SDK 持久 truth、示例或报告正文。 |
| 观测日志正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | SDK 可传播 trace context，不拥有观测系统日志 truth。 |
| UI / runtime 状态正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | 产品状态和 runtime 执行状态不属于 SDK。 |
| 凭据和密钥正文 | 明确不拥有的正文 / 真相 | SDK 不保存、不拥有。 | SDK 只能承接调用方提供的凭据材料保护口径，不拥有 credential truth。 |

#### 7.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 官方客户端语义与语言映射 | 正式真相数据 ↔ 正式真相数据 | 候选边界强一致 | 阻断 candidate 稳定结论。 | 三语言可以 idiomatic，但平台语义不能漂移。 |
| package candidate 状态与验证证据结论 | 正式真相数据 ↔ 正式真相数据 | 验证门禁一致 | 不得标记 verified / stable，保持 rejected、failed 或 pending。 | candidate 状态必须由证据结论支撑。 |
| 横切默认行为在三语言之间 | 正式真相数据 ↔ 正式真相数据 | 发布候选强一致 | 阻断候选发布或标记对应语言 unsupported。 | error、trace、redaction 是 SDK 安全和观测边界。 |
| 兼容 / deprecated 结论与迁移文档 | 正式真相数据 ↔ 正式真相数据 | 变更门禁一致 | 阻断兼容结论或迁移说明进入 stable。 | breaking change 不能没有迁移口径。 |
| 上游 core / bus truth 到 SDK 快照 | 快照 / 投影数据 ↔ 引用关系数据 | 最终一致 + 版本引用一致 | 标记 stale / pending，不伪造上游 truth。 | 快照可以落后，但必须能追溯上游版本。 |
| formal API 到 SDK client 视图 | 快照 / 投影数据 ↔ 引用关系数据 | 最终一致 | 标记 unsupported / stale，不进入 P0 stable 证明链。 | 服务端业务 truth 不归 SDK。 |
| quickstart / docstring / 示例到 candidate | 正式真相数据 ↔ 正式真相数据 | 验证边界一致 | 示例标记 failed / stale，不能作为可运行示例发布。 | 文档示例必须跟当前 candidate 可验证地匹配。 |
| reports / artifacts 引用到验证结论 | 引用关系数据 ↔ 正式真相数据 | 引用有效性一致 | 标记 evidence missing / invalid，不补造证据正文。 | SDK 拥有结论和入口，不拥有外部执行正文。 |
| 下游消费反馈到 SDK 变更 | 引用关系数据 ↔ 正式真相数据 | 接缝审查一致 | 未经审查不得改写 SDK truth。 | 下游反馈是输入，不是 SDK truth 来源。 |
| 禁止正文进入 SDK 材料 | 明确不拥有的正文 / 真相 ↔ 任意 SDK 数据 | 边界约束一致 | 拒绝、脱敏或使验证失败。 | 业务正文、payload、凭据正文进入 SDK 是一票否决风险。 |

#### 7.3 简化关系示意图

```text
+------------------------------+
|        L0-sdk truth          |
| client semantics / mapping   |
| candidate / docs / defaults  |
| compatibility / evidence     |
+--------------+---------------+
               |
     +---------+----------+
     |                    |
     v                    v
+------------+     +-------------+
| snapshots  |     | references  |
| core/bus   |     | versions    |
| api views  |     | ADR/evidence|
+-----+------+     +------+------+
      |                   |
      | no ownership      | no body copy
      v                   v
+-------------------------------+
| explicitly not owned bodies   |
| payload / req-res / logs      |
| UI-runtime state / secrets    |
+-------------------------------+
```

图示说明：

- SDK truth 位于中心，快照和引用都不能反向定义 SDK truth。
- core、bus 和服务端能力只能以快照、投影或引用进入 SDK。
- 禁止正文可以在运行期被调用方使用，但不得进入 SDK truth、示例正文或验证报告正文。

#### 7.4 数据边界说明短文

`L0-sdk` 的数据所有权围绕“官方客户端接入体验”成立，而不是围绕上游契约正文、服务端业务正文或运行期生产正文成立。SDK 可以拥有语言映射、candidate、默认横切行为、兼容和文档示例的 truth，但对 core / bus / formal API 只能保留快照、投影或引用。一致性策略必须保护这条边界：SDK truth 内部在候选和发布边界强一致，上游快照最终一致，引用失效显式表达，禁止正文一律拒绝或脱敏。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §9 “数据所有权与一致性策略”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| generated binding 是否属于 SDK 正式真相 | A. 是，binding 即 truth;B. 否，是上游契约派生快照 / 语言消费视图;C. 按语言决定 | B | `L0-core` 才拥有契约 truth，SDK 只拥有官方 client 语义和语言映射口径 | 已确认采用 B |
| reports / artifacts 原文是否归 SDK truth | A. 全部归 SDK;B. SDK 拥有验证结论和引用，外部执行正文不自动归 SDK;C. 完全不记录 | B | SDK 需要可追溯证据，但不能把外部运行正文吸入 truth | 已确认采用 B |
| docs / examples 是否允许落后 candidate | A. 允许且不标记;B. draft 阶段可落后，但 stable / verified 边界必须一致;C. 永远强同步 | B | 兼顾编写过程与发布候选质量门禁 | 已确认采用 B |
| production request / response 是否可进入示例和报告正文 | A. 可以;B. 不可以，只能使用脱敏样本或引用;C. 由调用方决定 | B | 这是 SDK 数据安全和 redaction 边界的一票否决项 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 9 的待确认事项。
- 具体数据结构、文件目录、验证报告格式、artifact 命名、缓存策略和同步机制后移到概要设计、测试方案和实施计划。

### 10. 进入下一步条件

- 已明确 SDK truth、上游快照 / 投影、引用关系和明确不拥有正文四类数据边界。
- 已明确候选边界强一致、上游快照最终一致、引用有效性一致和禁止正文边界一致。
- 已确认不把 generated binding、公共注册表、服务端业务事实、payload body 或凭据正文写成 SDK truth。
- 可以进入 Step 9 关键交互与通信方式。
