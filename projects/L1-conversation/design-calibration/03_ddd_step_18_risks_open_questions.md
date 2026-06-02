# Step 18. 风险与待确认事项

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
- 回填章节: `projects/L1-conversation/03-详细设计.md` §17 风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 §7.4 / §9 | 输入不足风险和后续收口项 | 判断哪些风险已由 Step 6~17 关闭,哪些仍需进入正式 §17 |
| Step 2 §9 | 本轮实现范围和非范围后续输入 | 区分 P0 实现风险与 P1 / 后续能力 |
| Step 3 §9 | 实现仓、path dependency、源码语言和跨仓依赖约束 | 识别仓库创建、依赖缺失和实现仓提交规范风险 |
| Step 4 §9 | 目标仓库、crate、入口和技术框架待确认项 | 识别仓库骨架、CLI、HTTP / RPC 绑定风险 |
| Step 5 ~ Step 13 待确认章节 | 模块、对象、port、协议、flow、状态、持久化、错误和幂等后续承接项 | 判断是否存在实现者需要自行选边的冲突 |
| Step 14 §8 | 配置和外部依赖绑定待确认项 | 识别 `04-配置设计.md`、具体产品和 fake / adapter 风险 |
| Step 15 §9 / Step 16 §9 | 可观测性、审计和测试切口边界 | 识别完整测试方案、验收证据和报告策略待生成风险 |
| Step 17 §7.10 / §7.11 / §9 | 跨文档闭环复核和未进入实施的待确认项 | 作为本步风险清单的主要来源 |
| `standards/document/详细设计讨论流程_SOP.md` Step 18 | 风险表和待确认事项表格式 | 约束本文件输出 |

本步判断基线:

```text
Step 6~17 已经关闭字段、DTO、状态、处理流、命名和详细设计内部 phase boundary 的 1:1 落码冲突。
当前剩余风险主要来自正式文档链尚未补齐、实现计划尚未分 phase、真实相邻仓 adapter 与具体基础设施尚未确定。
这些风险不得写成已经确定的代码契约,也不得交给实现 agent 自行选边。
```

## 3. SOP 问题回答

### 3.1 哪些问题仍可能影响代码实现？

仍可能影响代码实现的问题包括:

- 正式 `03-详细设计.md` 尚未重建,旧 `03` 不能作为实现真相源。
- `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 尚未按新版详细设计生成。
- 目标实现仓 `/home/aris/Projects/quantalithos-conversation` 当前尚未创建。
- 唯一编译期依赖 `core-contracts` 如果缺失或版本不匹配,会阻塞依赖真实上游类型的实现。
- 真实相邻仓 runtime adapter 尚未全部可用,必须用 fake / fixture / stub 维持 P0 语义。
- 具体 DB、MQ、HTTP / RPC、search 产品未锁定,实现阶段只能按 port / adapter 和 in-memory default 推进。

### 3.2 哪些问题会阻塞实现，哪些只影响后续优化？

| 类型 | 问题 | 阻塞范围 |
|---|---|---|
| 阻塞正式移交 | 正式 `03` 未重建、`07` 未生成 | 阻塞把详细设计交给实现 agent 直接开工 |
| 阻塞对应文档 | `04` / `05` / `06` 未生成 | 阻塞配置、测试、验收文档口径;不阻塞详细设计 Step 19 |
| 阻塞特定代码 | `core-contracts` 缺失或不匹配 | 阻塞依赖 core typed ref / metadata 的代码 |
| 不阻塞 P0 truth center | 真实相邻仓 adapter 未完成 | 可用 fake / fixture / stub,但不能伪装真实集成完成 |
| 不阻塞 P0 默认实现 | 具体 DB / MQ / HTTP 产品未选 | P0 使用 in-memory / fake / adapter contract,产品选择后续 phase 再定 |

### 3.3 每个待确认事项需要谁确认？

见 §7.4 待确认事项表。确认方按文档职责划分:

- 正式 `03`: 详细设计维护者。
- `04`: 配置设计编写者。
- `05`: 测试方案编写者。
- `06`: 验收标准编写者。
- `07`: 实施计划编写者。
- 实现仓创建、git config、提交规范: 实现 agent 和实施计划编写者共同确认。
- 真实相邻仓 adapter: 对应相邻仓负责人和 L1-conversation 实现负责人确认。

### 3.4 未确认前实现者应该如何处理？

未确认前必须按以下规则处理:

| 未确认类型 | 处理方式 |
|---|---|
| 正式 `03` 未生成 | 不以旧 `03` 开工;只可阅读 Step 1~18 中间产物做准备 |
| `07` 未生成 | 不自行拆 phase / commit boundary |
| 配置未生成 | 只实现 Step 14 的 loader / validator / builder binding point,不发明完整 JSON 字段 |
| 测试 / 验收未生成 | 只按 Step 16 最小切口准备测试,不发明 AC-ID 或报告证据 ID |
| 编译期上游缺失 | 暂停对应 typed dependency 实现,不得复制上游类型 |
| 运行期上游不可用 | 使用 fake / fixture / stub,并保留 failure / unresolved / retry 行为 |
| 具体技术产品未定 | 使用 port / adapter 抽象和 in-memory default,不得把产品选择写死进 domain / application |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 1~14 中多处“后续承接”如果不集中收口,容易被实现者理解成可自行选择 | 实现阶段可能出现自创配置、状态别名、技术产品或 adapter 语义 | 本步把仍未关闭事项集中列入风险与待确认事项 |
| Step 17 已证明详细设计内部字段 / DTO / 状态闭环通过,但正式测试、验收和实施计划还没有落地 | 代码 agent 可能只看详细设计而跳过后续文档链 | 本步明确正式移交前必须完成 Step 19、`04`、`05`、`06`、`07` |
| 旧 `03` 仍存在于目录中 | 实现者可能误读旧 Turn / StreamEvents / AG-UI 主线 | 本步再次声明旧 `03` 只作诊断材料,Step 19 必须删除旧文件后重建 |
| 相邻仓真实 adapter 与具体基础设施还未锁定 | 实现阶段可能把 fake 当成真实成功,或把产品选择写入核心层 | 本步把 fake / adapter 和产品中立作为风险缓解规则 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把所有历史“后续承接”都列为风险 | A. 全列;B. 只列仍影响实现移交的事项 | 采用 B。已由 Step 6~17 关闭的对象、协议、状态、错误和幂等问题不重复制造风险 |
| 是否把 `04` / `05` / `06` / `07` 缺失视为详细设计失败 | A. 是;B. 否,但列为正式移交风险 | 采用 B。详细设计可以完成,但不能直接交给实现开工 |
| 是否现在指定 DB / MQ / HTTP 产品 | A. 立即指定;B. 保持 port / adapter 和 in-memory default | 采用 B。当前没有产品约束输入,过早锁定会污染 domain / application |
| 真实相邻仓不可用时是否暂停全部实现 | A. 全部暂停;B. 编译期依赖暂停,运行期依赖可 fake | 采用 B。P0 truth center 可先闭环,但 fake 必须暴露失败 / unresolved / retry 语义 |

## 6. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 风险位置 | 分散在 Step 1~17 的待确认章节中 | Step 18 集中收口,正式 §17 可直接引用 |
| 阻塞判断 | “后续承接”与“实现阻塞”容易混用 | 区分正式移交阻塞、特定代码阻塞、非阻塞 P0 风险 |
| 已关闭问题 | 可能被重复写成风险 | 字段、DTO、状态、处理流、命名、phase boundary 闭环不再重复列入 |
| 实现者处理方式 | 需要自行理解未确认项 | 每个待确认事项给出未确认前处理方式 |

## 7. 结构化输出

### 7.1 风险分层图

```text
L1-conversation implementation risk
  |
  +-- Formal handoff risks
  |     +-- old 03 not replaced
  |     +-- 07 implementation plan missing
  |
  +-- Document chain risks
  |     +-- 04 configuration design missing
  |     +-- 05 test plan missing
  |     +-- 06 acceptance criteria missing
  |
  +-- Code dependency risks
  |     +-- core-contracts path dependency unavailable
  |     +-- target implementation repo not created
  |
  +-- Runtime integration risks
        +-- adjacent repo adapters unavailable
        +-- concrete DB / MQ / HTTP / search products not selected
```

关键说明:

- 正式移交风险会阻塞实现 agent 直接开工。
- 文档链风险不代表详细设计失败,但会阻塞对应后续文档或门禁口径。
- 代码依赖风险只阻塞对应 typed dependency 或仓库骨架动作。
- 运行期集成风险可用 fake / fixture / stub 缓解,但必须保留失败语义。

### 7.2 已关闭风险不再列入表

| 已关闭项 | 关闭依据 | 不再列入原因 |
|---|---|---|
| Domain 字段来源不闭合 | Step 17 §7.5 | 每个关键字段已能回指 DTO、event、派生规则、查表规则或系统生成规则 |
| Command / Event / Job 构造不闭合 | Step 17 §7.6 | 构造闭环和缺失处理已经集中复核 |
| 状态名漂移 | Step 17 §7.7 / §7.9 | 状态集合与 Step 6 / Step 10 / Step 16 对齐 |
| 处理流缺口 | Step 9 / Step 17 §7.10 | 45 个 flow 已有入口、事务、错误和副作用说明 |
| 详细设计内部 phase boundary 冲突 | Step 17 §7.8 | 详细设计不定义实施 phase;后续由 `07` 继续拆分 |

### 7.3 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| 正式 `03-详细设计.md` 尚未重建 | 旧 `03` 会误导实现者回到 Turn / StreamEvents / AG-UI 旧主线 | 阻塞正式移交实现 | Step 19 删除旧 `03` 后按新文件标准重建,并逐章引用 Step 1~18 | 详细设计维护者 |
| `07-实施计划.md` 尚未创建 | phase、commit boundary、门禁和提交规范无法落到实现顺序 | 阻塞实现开工 | 按实施计划 SOP 生成 `07`,每个 boundary 引用 `03` 和 calibration 来源 | 实施计划编写者 |
| `04-配置设计.md` 尚未创建 | JSON 示例、默认值、字段说明和加载顺序未落地 | 阻塞配置实现细节 | 详细设计只保留 Step 14 binding point;配置设计独立生成后再给实现者 | 配置设计编写者 |
| `05-测试方案.md` / `06-验收标准.md` 尚未重建 | 测试矩阵、报告路径、AC-ID 和一票否决项未落地 | 阻塞完整测试 / 验收门禁 | 先按 Step 16 最小切口准备,后续 `05` / `06` 必须沿用 Step 10 / Step 16 状态名 | 测试方案 / 验收标准编写者 |
| 目标实现仓尚未创建 | 实现 agent 无法直接在目标目录落代码 | 阻塞代码写入 | `07` 或实现 agent 在 `/home/aris/Projects/quantalithos-conversation` 创建 workspace | 实施计划编写者 / 实现 agent |
| `core-contracts` path dependency 缺失或类型不匹配 | typed ref、metadata 和基础 contract 无法编译对齐 | 阻塞依赖 core 类型的代码 | 暂停对应实现,不得复制上游类型;先修复本地 sibling repo 或 path dependency | 实现 agent / core 负责人 |
| 真实相邻仓 runtime adapter 未完成 | identity、work、governance、artifact、runtime、bridges、observability、archive 等真实集成不可验证 | 不阻塞 P0 truth center,阻塞真实集成验收 | P0 使用 fake / fixture / stub,并保留 failure、unresolved、retry、handoff failed 行为 | 对应相邻仓负责人 / 实现 agent |
| 具体 DB / MQ / HTTP / search 产品未选 | durable store、transport、query backend 和 deployment 细节无法固定 | 不阻塞 P0 默认实现,阻塞生产化设计 | 使用 port / adapter 和 in-memory default;产品选择进入实施计划或后续 phase | 架构 / 实施计划编写者 |
| 旧名或旧能力回流 | 实现可能重新引入 `Turn`、`StreamEvents`、`AG-UI` 作为主线对象 | 阻塞一致性 review,不阻塞当前 Step | `03` / `05` / `06` / `07` 必须引用 Step 17 命名一致性表 | 文档维护者 / 实现 reviewer |

### 7.4 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 何时删除旧 `03` 并重建正式详细设计 | 没有正式 `03` 时不能把文档交给实现 agent 当唯一真相源 | 详细设计维护者 | 继续只读 Step 1~18 中间产物,不得引用旧 `03` 开工 |
| `04-配置设计.md` 是否在进入实现前完成 | 配置 demo、字段默认值和加载 profile 未闭合 | 配置设计编写者 | 只实现 config binding interface,不发明 JSON 字段 |
| `05-测试方案.md` 和 `06-验收标准.md` 是否在实现前完成 | 测试报告、验收证据和失败门禁无法最终确认 | 测试方案 / 验收标准编写者 | 只按 Step 16 最小测试切口准备,不编造 AC-ID |
| `07-实施计划.md` 的 phase / commit boundary 如何拆分 | 实现顺序、提交边界和每批门禁未确定 | 实施计划编写者 | 不拆 commit,不开始编码 |
| P0 是否只使用 in-memory / fake default | 影响 repository、publisher、resolver、handoff adapter 的默认实现 | 架构 / 实施计划编写者 | 默认采用 in-memory / fake,并保留真实失败语义 |
| 是否在 P0 指定 HTTP / RPC 产品 | 影响 `api` crate 的 adapter 和测试方式 | 架构 / 实施计划编写者 | `api` 只定义 handler / route adapter boundary,不绑定产品 |
| 相邻仓真实 adapter 首批接入哪些 | 影响 integration test 和验收范围 | 对应相邻仓负责人 / 实施计划编写者 | 使用 fake / fixture,真实 adapter 进入后续 phase |

### 7.5 实现前处理规则

| 场景 | 实现前规则 |
|---|---|
| 文档未生成 | 暂停正式移交,不得要求实现 agent 自行补设计 |
| 上游类型不存在 | 暂停对应代码,不得复制或改名上游类型 |
| 协议字段与对象字段冲突 | 回到对应 Step 修文档,不得在代码中选边 |
| 状态名或 enum 变体冲突 | 以 Step 6 + Step 10 为真相源,并修正式文档 / 测试 / 验收 |
| phase boundary 不清 | 回到 `07-实施计划.md`,不得按文件或模块随意提交 |
| fake adapter 覆盖真实依赖 | fake 名称、fixture、测试和报告必须显式标明,不得写成真实集成通过 |

## 8. 回填草稿

> 本节不重复粘贴 §7 的完整表。正式 `03-详细设计.md` §17 应从本文件 §7 摘录。

正式文档 §17 建议采用以下结构:

```text
17. 风险与待确认事项
  17.1 风险判断基线
  17.2 已关闭风险不再列入
  17.3 风险表
  17.4 待确认事项表
  17.5 实现前处理规则
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §17.1 | `design-calibration/03_ddd_step_18_risks_open_questions.md` §2 / §3 |
| §17.2 | `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.2 |
| §17.3 | `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.3 |
| §17.4 | `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.4 |
| §17.5 | `design-calibration/03_ddd_step_18_risks_open_questions.md` §7.5 |

回填要求:

- 正式 §17 必须提示读者继续阅读本文件 §7 的风险表和待确认事项表。
- 不得把 `04`、`05`、`06`、`07` 缺失写成详细设计内部对象或协议缺失。
- 不得在 §17 新增对象字段、状态名、协议字段、配置字段或 commit boundary。
- 已关闭的字段 / DTO / 状态 / flow / 命名风险不得重复写成待确认事项。

## 9. 待确认事项

无字段、DTO、状态、处理流、命名或详细设计内部 phase boundary 冲突。

当前待确认事项均已列入 §7.4,属于正式文档链、实施计划、配置 / 测试 / 验收、实现仓创建和运行期集成范围。

## 10. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| SOP 应问问题已回答 | 通过 | §3 覆盖 4 个问题 |
| 风险表已输出 | 通过 | §7.3 |
| 待确认事项表已输出 | 通过 | §7.4 |
| 每个风险都有影响、阻塞范围、缓解方式和负责人 | 通过 | §7.3 |
| 每个待确认事项都有当前影响、确认方和未确认前处理方式 | 通过 | §7.4 |
| 没有用主观判断替代待确认事实 | 通过 | 按 Step 1~17 来源列出 |
| 没有把待确认内容写成实现契约 | 通过 | §7.5 明确暂停 / 回退规则 |
| 可进入 Step 19 正式详细设计整理 | 通过 | 下一步删除旧 `03` 并重建正式文档 |
