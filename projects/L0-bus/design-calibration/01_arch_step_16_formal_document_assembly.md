## Step 16. 整理正式文档

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 16
- 回填章节：`projects/L0-bus/01-架构设计.md` 全文

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md`
  - `standards/document/架构设计讨论流程_SOP.md` Step 16
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/design-calibration/01_arch_step_01_requirements_baseline.md` ~ `01_arch_step_15_adr_traceability.md`
- 已确认结论：
  - Step 1~15 均已重新执行。
  - 正式文档只吸收稳定结论，不复制 SOP 问题过程。
  - 旧 `01-架构设计.md` 需要删除后按新文件标准重建。

### 3. SOP 问题回答

1. 哪些已确认结论应分别回填到哪些正式章节？

   回答：Step 1 回填 §1 / §3 / §16；Step 2 回填 §2 / §3；Step 3 回填 §4；Step 4 回填 §5；Step 5 回填 §6；Step 6 回填 §7；Step 7 回填 §8；Step 8 回填 §9；Step 9 回填 §10；Step 10 回填 §11；Step 11 回填 §12；Step 12 回填 §13；Step 13 回填 §14；Step 14 回填 §15；Step 15 回填 §16 / §17。

2. 哪些结论需要拆分吸收到多个章节，而不是机械复制？

   回答：默认可验证路径同时影响 §7、§11、§12、§14、§15；禁止正文同时影响 §3、§4、§9、§13；只读输出同时影响 §4、§5、§9、§10、§13；依赖类型同时影响 §5、§8、§16。

3. 哪些术语、编号或交叉引用需要统一？

   回答：统一使用 `L0-bus`、`L0-core`、`bus truth`、`transport semantic`、`delivery history`、`failure material`、`in-memory default path`、`durable bus store`、`read-only output`、`P0 / P1 / P2`；需求编号使用 F-001~F-008、BR-001~BR-012。

4. 哪些内容仍应继续保留为风险或待确认，而不能润色成定论？

   回答：生产 MQ adapter 优先级、durable store 产品、授权承接方、Outbox relay 形态、配置 schema、性能基准、DLQ UI 时间点、effectively-once 专项均保留为待确认。

5. 参考项应如何收口，不与 ADR 或追溯重复？

   回答：参考章节只列正式来源文档；ADR 章节只列架构决定索引；追溯章节只列需求与架构章节映射。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 处理 |
|---|---|---|
| 全文 | 旧架构文档未按新版 SOP 校准 | 删除后重建 |
| 文档头部 | 旧作者、日期、关联 ADR 和旧草案输入 | 按新版元信息重写 |
| §1~§16 | 旧四后端、NATS 默认、147 事件真相、tap-all 等旧口径残留 | 全部替换为 Step 1~15 结论 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档主线 | 旧 2026-05-11 draft | 新版 Step 1~15 校准结果 | 对齐当前需求和架构 SOP |
| P0 范围 | 四后端 / NATS / tap-all 倾向 | 核心闭环 + in-memory default path + durable bus store | 防止 P0 膨胀 |
| 引用方式 | 大量旧草案和后端资料 | 每章明确 design-calibration 来源 | 支撑追溯 |
| 风险表达 | 运维和风险混写 | 风险、待确认、一票否决分开 | 防止脑补 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在旧文件上小修小补 | 改动少 | 旧结构和旧口径残留风险高 | 不采用 |
| 方案 B：删除旧文件后按新标准重建 | 边界干净，便于追溯 | 改动较大 | 采用 |
| 方案 C：只保留中间产物，不生成正式文档 | 省时 | 不能作为实现输入 | 不采用 |

### 7. 结构化中间产物

#### 7.1 正式章节回填表

| 正式章节 | 主要来源 |
|---|---|
| §1 与上游文档的关系声明 | Step 1 |
| §2 业务背景与驱动力 | Step 2 |
| §3 约束条件 | Step 1 / Step 2 |
| §4 职责边界 | Step 3 |
| §5 系统边界与上下文 | Step 4 |
| §6 限界上下文与子域划分 | Step 5 |
| §7 容器 / 部署架构 | Step 6 |
| §8 依赖方向与层间约束 | Step 7 |
| §9 数据所有权与一致性策略 | Step 8 |
| §10 关键交互与通信方式 | Step 9 |
| §11 关键技术选型 | Step 10 |
| §12 备选方案与取舍 | Step 11 |
| §13 横切关注点 | Step 12 |
| §14 演进路线 | Step 13 |
| §15 风险与待确认事项 | Step 14 |
| §16 需求追溯矩阵 | Step 15 |
| §17 ADR 索引 | Step 15 |
| §18 参考 | Step 1 / 全局来源 |

#### 7.2 术语统一表

| 统一术语 | 禁止替代表述 |
|---|---|
| in-memory default path | 默认 NATS |
| durable bus store | PostgreSQL 默认 |
| read-only output | tap-all 无边界输出 |
| failure material | governance decision |
| transport semantic | MQ 后端参数 |
| bus truth | 业务 payload truth |

### 8. 回填草稿

本 Step 已直接生成正式 `projects/L0-bus/01-架构设计.md`，不再重复粘贴完整正文。

### 9. 待确认事项

- 无阻塞正式文档生成的待确认事项。
- 生产后端、store 产品、授权承接方、配置 schema 和性能基准已保留在正式文档风险章节。

### 10. 进入下一步条件

- 已删除旧 `01-架构设计.md`。
- 已按新文件标准重建正式文档。
- 已更新工作台 Step 16 状态。
