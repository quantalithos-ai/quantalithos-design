# Step 18. 风险与待确认事项

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 18
- 回填章节:`03-详细设计.md` §17 风险与待确认事项

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1~17 中间产物 | 上游边界、范围、约束、对象、协议、flow、状态、事务、错误、幂等、配置、观测、测试、实施承接 | 汇总仍未关闭的风险和待确认事项 |
| `03_ddd_step_10_state_matrix.md` §10 | `BlockerState`、`PromoteResultState` 的 P0 协议面待确认 | 判断是否可能诱导实现者自创 command |
| `03_ddd_step_11_persistence_transaction_consistency.md` §11 | durable store、owner 唯一性、row lock、projection atomic scope、commit unknown recovery | 识别 infra / durable adapter 风险 |
| `03_ddd_step_12_error_recovery.md` §10 | error enum code block、DLQ 形态、job report failed refs 拆分 | 识别错误和 report DTO 后续闭合项 |
| `03_ddd_step_13_concurrency_idempotency.md` §11 | retention、durable lock、owner 唯一性、自动修复、job report 拆分 | 识别幂等 / 并发后续配置项 |
| `03_ddd_step_14_config_external_binding.md` §11 | 配置绑定、产品选择、advanced search | 识别配置设计和产品绑定风险 |
| `03_ddd_step_15_observability_audit.md` §11 | metric backend、SLO、safe diagnostic ref store | 识别观测 / 运维后续风险 |
| `03_ddd_step_16_test_cuts.md` §11 | 真实集成测试环境、redaction check 规则 | 识别测试方案后续风险 |
| `03_ddd_step_17_implementation_handoff.md` §10 | 正式 `03` 到 `07` 已生成、目标实现仓待确认 | 固定正式移交前的阻塞项 |
| `standards/document/详细设计讨论流程_SOP.md` Step 18 | 风险表和待确认事项表 | 固定本文件输出格式 |
| `standards/document/详细设计书写规范.md` §3 | 正式详细设计 §17 结构 | 固定回填章节 |

本步判断基线:

```text
Step 6~17 已经收稳详细设计内部的对象、trait、协议、flow、状态、事务、错误、幂等、配置绑定、观测和测试切口。
本 Step 只记录仍未关闭的不确定项、阻塞范围、确认方和未确认前处理方式。
不确定项不得在本 Step 中被改写成对象字段、协议字段、状态转换、配置默认值、实现 phase 或 commit boundary。
```

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 18.1 | 文件骨架、输入、SOP 问题回答 | [x] |
| 18.2 | 风险分层、风险表、待确认事项表 | [x] |
| 18.3 | 未确认前处理规则、回填草稿、进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 哪些问题仍可能影响代码实现?

   回答:仍可能影响代码实现的问题分为三类。第一类是目标实现仓和上游编译期依赖未确认,包括 `/home/aris/Projects/quantalithos-work` 当前未发现、`core-contracts` 必须存在且类型匹配。第二类是产品和真实集成未锁定,包括 durable DB / bus / external adapter、真实集成测试环境、metric backend / log sink、DLQ、safe diagnostic store。第三类是少数 P0 之外的协议面 / report 面仍待后续确认,包括 `BlockerState::Mitigating / Closed`、`PromoteResultState::Superseded` 是否进入 P0 command,以及 job report 是否拆分 retryable / terminal failed refs。正式 `04`、`05`、`06`、`07` 已生成,不再作为文档链缺失 blocker。

2. 哪些问题会阻塞实现,哪些只影响后续优化?

   回答:正式 `03` 到 `07` 已完成审核收口;目标实现仓缺失会阻塞代码写入;`core-contracts` 缺失或不匹配会阻塞依赖 core typed ref / metadata 的代码。durable store、bus、metric backend、SLO、DLQ、真实 integration 环境和具体产品选择不阻塞 P0 fake / in-memory 默认实现,但阻塞生产化 adapter 和真实集成验收。P0 协议面未确认的状态或 report 拆分不得由实现者自行扩展。

3. 每个待确认事项需要谁确认?

   回答:正式 `03` 到 `07` 已由对应设计维护者和用户审核收口;目标实现仓、git config、提交规范由实施计划编写者和实现 agent 在 PH-01 确认;上游 typed contracts 由对应上游仓负责人和实现 agent 确认;产品选择、真实 adapter、metric backend、DLQ、集成环境由架构 / 实施计划 / 对应相邻仓负责人确认。

4. 未确认前实现者应该如何处理?

   回答:未确认前实现者不得自行补设计。正式 `00` 到 `07` 已生成,实现时必须以固定 design baseline 为准;上游类型缺失时暂停对应代码,不得复制上游 type;运行期依赖不可用时使用 fake / fixture / stub,并保留 failure / unresolved / retry 语义;P0 协议面未确认时只实现 Step 8 / Step 9 已正式列出的入口,不得新增 command 或 response 字段。

### 5. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 正式 `03-详细设计.md` 已审核收口 | 实现者需要唯一正式详细设计真相源 | 本轮已确认正式 03 与 calibration 来源一致,后续 `07` 可引用 |
| `04` / `05` / `06` / `07` 已按新版生成 | 配置、测试、验收、phase / commit boundary 已有正式口径 | 从下游文档缺失风险中移除,只保留 P1/P2 产品化风险 |
| 实现仓 `/home/aris/Projects/quantalithos-work` 当前未发现 | 实现 agent 无法直接落代码 | 列为 PH-01 前置门禁 |
| 部分运行期产品和真实 adapter 未锁定 | 容易把 fake 当真实集成通过,或把产品选择写死进 core layers | 列为 P0 fake / production adapter 分层风险 |
| 少量状态 / report 口径仍待确认 P0 暴露面 | 实现者可能自行新增 command 或 response 字段 | 列为协议面待确认,未确认前只实现现有入口 |

### 6. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把所有历史 open item 都列入风险 | A. 全部列入;B. 只列仍未关闭且会影响移交 / 实现边界的事项 | 采用 B。已由后续 Step 回填关闭的事项不重复列为风险 |
| 是否在 Step 18 继续保留 `04` / `05` / `06` / `07` 缺失风险 | A. 保留;B. 移除并引用正式文档 | 采用 B。正式下游文档已经生成,缺失风险关闭 |
| 是否在 Step 18 补充生产化产品选择 | A. 现在补;B. 保持为 P1/P2 待确认 | 采用 B。本 Step 不产生生产化产品契约 |
| 是否把未确认 P0 状态入口直接写成 command | A. 写入;B. 保持 domain 状态,不新增协议入口 | 采用 B。Step 8 / Step 9 未定义的 command 不得由实现者发明 |
| 真实相邻仓不可用时是否暂停全部实现 | A. 全部暂停;B. 编译期依赖暂停,运行期依赖可 fake | 采用 B。唯一编译期依赖是 core contracts;运行期依赖用 fake / fixture / stub 保持 P0 闭环 |

### 7. 结构化输出

#### 7.1 风险分层图

```text
L1-work implementation risk
  |
  +-- Code start risks
  |     +-- target implementation repo not confirmed
  |     +-- core-contracts path dependency unavailable or mismatched
  |
  +-- Implementation boundary risks
  |     +-- protocol exposure for domain-only state not confirmed
  |     +-- job report retryable vs terminal failed refs not confirmed
  |
  +-- Runtime and production risks
        +-- durable store / bus / external products not selected
        +-- metric backend / DLQ / diagnostic store not selected
        +-- real integration test environment not defined
```

关键说明:

- 正式 `03` 到 `07` 已生成,不再作为文档链缺失风险。
- Code start risks 只阻塞对应代码写入或 typed dependency 使用。
- Implementation boundary risks 必须通过 `07` 或后续设计收口,实现阶段不得自行扩展协议面。
- Runtime and production risks 可用 fake / in-memory default 缓解,但不得报告为真实集成通过。

#### 7.2 已关闭风险不再列入表

| 已关闭项 | 关闭依据 | 不再列入原因 |
|---|---|---|
| Domain 字段来源不闭合 | Step 17 §7.5 | 关键字段已能回指 DTO、event、派生规则、查表规则或系统生成规则 |
| Command / Event / Job 构造不闭合 | Step 17 §7.6 | 构造入口和缺失处理已由 Step 8 / Step 9 / Step 12 收稳 |
| Query response / page / marker 不闭合 | Step 17 §7.6 | Query response view、projection marker、empty / stale / failed / not visible 口径已复核 |
| 状态名漂移 | Step 17 §7.7 / §7.9 | 状态集合与 Step 6 / Step 10 / Step 16 对齐 |
| 处理流缺入口或副作用 | Step 9 / Step 17 §7.6 | 48 个 flow 已有入口、事务、错误和副作用说明 |
| metadata / idempotency 双真相 | Step 8 / Step 13 / Step 17 | idempotency key、request digest、result ref 和 commit unknown 审计口径已收敛 |
| `04` / `05` / `06` / `07` 缺失 | 正式 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | 下游文档链已按新版生成,不再阻塞 P0 设计移交 |

#### 7.3 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| 目标实现仓当前未确认存在 | 无法在目标路径建立 Rust workspace 和提交代码 | 阻塞代码写入 | PH-01 确认或创建 `/home/aris/Projects/quantalithos-work` | 实施计划编写者 / 实现 agent |
| `core-contracts` path dependency 缺失或类型不匹配 | typed ref、metadata、idempotency metadata 无法编译对齐 | 阻塞依赖 core 类型的代码 | 暂停对应实现,修复 sibling repo 或 path dependency,不得复制上游类型 | 实现 agent / core 负责人 |
| `BlockerState::Mitigating / Closed` 未确认是否进入 P0 协议面 | 实现者可能自创 start mitigation / close blocker command | 阻塞新增协议入口,不阻塞 domain enum / method | P0 只实现 Step 8 / Step 9 已列出的 open / resolve;新增 command 需后续设计 | 实施计划编写者 / 详细设计维护者 |
| `PromoteResultState::Superseded` 未确认触发入口 | 实现者可能自创 supersede promote command 或 event | 阻塞新增协议入口,不阻塞 enum 定义 | P0 不新增 supersede 入口;若需要,由 `07` 或后续详细设计明确 boundary | 实施计划编写者 / 详细设计维护者 |
| job report 是否拆分 retryable / terminal failed refs 未确认 | JobReport DTO 和测试断言可能出现双口径 | 阻塞新增 report 字段 | 当前只使用已定义 failed refs 最小面;拆分需后续详细设计修订或测试方案明确 | 详细设计维护者 / 测试方案编写者 |
| durable store / migration script 未选型 | DDL、migration、row lock、batch write 细节无法固定 | 不阻塞 P0 fake,阻塞 durable adapter | P0 使用 in-memory / fake;durable adapter 在实施计划或后续 adapter design 中展开 | 架构 / 实施计划编写者 |
| owner ref 唯一性、row lock、projection atomic scope 的 durable 产品实现未落地 | repository conflict、lock 策略和 batch granularity 可能实现分歧 | 不阻塞 P0 fake,阻塞 durable adapter | P0 使用正式 `04` 的 in-memory / fake 默认;durable 产品化前补 adapter design | 配置设计编写者 / infra 负责人 |
| metric backend / log sink / alert SLO 未选定 | 观测落地和运维告警无法完整实现 | 不阻塞埋点契约,阻塞运维集成 | 代码只按 Step 15 输出低基数指标和安全日志字段;backend / SLO 进运维或实施文档 | 运维 / 实施计划编写者 |
| safe diagnostic ref 持久化位置未定义 | 安全诊断引用无法持久追溯 | 不阻塞禁止字段规则,阻塞 durable diagnostic store | 仅保留 safe diagnostic ref 口径;如需 store,回 Step 7 / 11 或后续设计补 port | 详细设计维护者 / 运维负责人 |
| dead-letter storage / DLQ adapter 形态未选定 | event failure 的实际存储和重放方式未落地 | 不阻塞 disposition 语义,阻塞真实 worker adapter | P0 fake 标记 dead-letter;真实 DLQ 由 bus / worker adapter 设计确定 | bus / worker 负责人 |
| redaction check 扫描规则未定义 | 脚本只能有契约,不能稳定判断全部 forbidden field | 阻塞完整脚本验收 | Step 16 保留脚本命令契约;具体扫描规则进入 `05` 或实施脚本设计 | 测试方案编写者 / 实现 agent |
| advanced search P0 是否打开未最终确认 | search projection / query backend 范围可能扩大 | 阻塞高级搜索能力开启 | 默认 false unless P0 search contract exists;不得在实现中自行打开 | 实施计划编写者 |
| 真实相邻仓 runtime adapter 未全部可用 | identity、conversation、method、process、governance、artifact、runtime、observability、archive 集成不可验证 | 不阻塞 P0 truth center,阻塞真实集成验收 | P0 使用 fake / fixture / stub,并保留 unresolved / failed / retry / handoff failed 行为 | 对应相邻仓负责人 / 实现 agent |

#### 7.4 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 目标实现仓路径是否确认为 `/home/aris/Projects/quantalithos-work` | 影响 workspace 创建和 path dependency 相对路径 | 实施计划编写者 / 实现 agent | PH-01 前暂停代码写入 |
| `BlockerState::Mitigating / Closed` 是否进入 P0 command 面 | 影响是否需要 mitigation / close blocker request、flow、test | 详细设计维护者 / 实施计划编写者 | 不新增协议入口;只实现 open / resolve |
| `PromoteResultState::Superseded` 是否进入 P0 command / event 面 | 影响 promote result lifecycle 的外部触发方式 | 详细设计维护者 / 实施计划编写者 | 不新增 supersede 入口 |
| job report 是否拆分 retryable / terminal failed refs | 影响 JobReport DTO、测试断言和恢复策略 | 详细设计维护者 / 测试方案编写者 | 沿用已定义 failed refs 最小面 |
| durable DB / bus / HTTP / search 产品是否在 P0 选型 | 影响 adapter、migration、integration test 和部署 | 架构 / 实施计划编写者 | P0 使用 in-memory / fake / handler boundary |
| durable owner uniqueness、row lock、durable retention 清理实现 | 影响 durable repository config 和清理策略 | 配置设计编写者 / infra 负责人 | P0 使用正式 `04` 的 fake / in-memory 默认;durable 实现前补 adapter design |
| metric backend、log sink、alert SLO、DLQ、diagnostic store | 影响观测和恢复真实落地 | 运维 / worker / bus / 实施计划编写者 | 代码只实现安全字段、低基数指标和 fake disposition |
| redaction check 具体扫描规则 | 影响脚本验收完整性 | 测试方案编写者 / 实现 agent | 只保留脚本命令契约和 forbidden field 清单 |
| 首批真实相邻仓 adapter 接入范围 | 影响 integration test 和验收范围 | 对应相邻仓负责人 / 实施计划编写者 | 使用 fake / fixture,真实 adapter 进入后续 phase |

#### 7.5 未确认前实现处理规则

| 场景 | 处理规则 |
|---|---|
| 正式 `03~07` 已生成 | 实现时读取正式 `00~07` 和对应 calibration 来源;若正式文档与 calibration 冲突,暂停回设计修正 |
| `07` phase / commit boundary 不清楚 | 不自行拆 phase、commit boundary、永久记忆或提交计划;回读正式 `07` 或暂停回设计修正 |
| 配置 schema / 默认值不清楚 | 不发明完整配置 schema 和默认值;回读正式 `04` 与 Step 6 / Step 14 / `04_config_*` calibration |
| 测试 / 验收证据不清楚 | 不发明 AC-ID、报告证据 ID 或验收红线;回读正式 `05` / `06` 和对应 calibration |
| 上游 typed contract 不存在 | 暂停对应代码;不得复制、改名或本仓重造上游类型 |
| 运行期上游不可用 | 使用 fake / fixture / stub;fake 名称、测试和报告必须显式标明 |
| 状态有 domain method 但无协议入口 | 只实现 domain method 和已定义 flow;不得新增 command / query / event / job |
| report / page / view 字段未确认 | 不新增字段;按已确认 DTO 最小面实现 |
| durable 产品未定 | 使用 port / adapter 抽象和 in-memory default;不得把产品选择写死进 domain / application |
| observability 后端未定 | 输出安全日志字段和低基数指标;不得保存 forbidden body 或长期外部正文 |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_18_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“风险表”“待确认事项表”和“未确认前实现处理规则”小节。

#### 17. 风险与待确认事项

正式 `03-详细设计.md` §17 应采用以下结构:

```text
17. 风险与待确认事项
  17.1 风险判断基线
  17.2 已关闭风险不再列入
  17.3 风险表
  17.4 待确认事项表
  17.5 未确认前实现处理规则
```

回填要求:

- 正式 §17 必须说明旧 `03` 只作为诊断输入,不得作为实现真相源。
- 正式 §17 必须区分已关闭文档链风险、代码启动风险、实现边界风险和生产化风险。
- 正式 §17 不得新增对象字段、协议字段、状态转换、配置默认值、技术产品或 commit boundary。
- 已关闭的字段 / DTO / 状态 / flow / metadata / idempotency 风险不得重复写成待确认事项。
- P0 协议面未确认的状态入口必须写明“不得由实现者自行新增 command”。

### 9. 待确认事项

| 编号 | 待确认项 | 当前口径 | 影响 |
|---|---|---|---|
| DDD18-OPEN-001 | 目标实现仓未确认存在 | `/home/aris/Projects/quantalithos-work` 为当前目标路径;由正式 `07` PH-01 创建或确认 | 阻塞代码写入 |
| DDD18-OPEN-002 | P0 协议面是否覆盖 mitigation / close blocker、supersede promote | 当前不新增协议入口 | 影响后续 phase / command 设计 |
| DDD18-OPEN-003 | durable / runtime / observability / DLQ / diagnostic store 产品与真实集成环境 | P0 使用 fake / in-memory default | 阻塞真实集成和生产化 |

### 10. 进入下一步条件

- [x] 所有未关闭事项均有记录、影响、确认方和未确认前处理方式。
- [x] 区分已关闭文档链风险、代码启动风险、实现边界风险和生产化风险。
- [x] 未把不确定项写成对象字段、协议字段、状态转换、配置默认值、产品选择或 commit boundary。
- [x] 已说明已关闭的字段 / DTO / 状态 / flow / metadata / idempotency 风险不再重复列入。
- [x] 明确正式 `03-详细设计.md` 审核前不得正式移交实现。
