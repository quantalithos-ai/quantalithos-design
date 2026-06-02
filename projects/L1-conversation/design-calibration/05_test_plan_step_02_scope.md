# L1-conversation 05 测试方案 Step 2: 明确测试目标、范围和非范围

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §2 本次测试目标与范围
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确测试目标、范围和非范围 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_02_scope.md` |

本步只定义本轮测试要证明什么、覆盖什么、不覆盖什么和哪些范围项属于一票否决。具体测试对象、用例、数据、环境、门禁和证据编号留给后续 Step。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 提供测试输入源、旧稿处理口径和必须回答的问题清单 | 作为本步直接前置 |
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 | 提供核心闭环、FR、BR、NFR、验收项和一票否决项 | 作为测试目标与否决项来源 |
| `01-架构设计.md` §3 ~ §5 | 提供架构硬约束、职责边界、上下游依赖和降级口径 | 作为范围 / 非范围和接缝测试依据 |
| `02-概要设计.md` §2 ~ §6 | 提供概要设计目标、范围、非范围、组成部分和关键对象轮廓 | 作为测试范围聚类依据 |
| `03-详细设计.md` §2 / §15 | 提供 P0 展开范围、最小测试切口、脚本契约和 artifacts / reports 路径 | 作为 P0 验证下限 |
| `04-配置设计.md` §2 / §6 / §7 / §12 | 提供 P0/P1/P2 配置口径、profile、配置项和下游承接规则 | 作为环境、配置和证据范围依据 |

## 3. SOP 问题回答

### 3.1 P0 必须通过哪些测试才能证明主链成立?

| P0 主链 | 必须证明 | 失败后结论 |
|---|---|---|
| Conversation space / scope | 对话空间、参与范围、可见范围可显式建立、更新、关闭，并形成 trace / audit / outbox 证据 | 核心闭环不成立 |
| Conversation fact append | 人类、AI member、系统结果性事实可追加为正式 fact，重复输入幂等，冲突输入拒绝，forbidden body 不落库 | Conversation 退化为消息缓存或临时上下文 |
| Authorized consumption | Query、read model、cursor、search refs 和 trace read 均受 visibility scope 约束，越权读取失败 | 授权视野失效，一票否决 |
| Cross-domain manifestation | Work / governance / artifact / runtime / bridge / identity 相关事实只能以 ref / safe snapshot / manifestation 进入本仓 | 来源 truth 漂移，一票否决 |
| History trace / review / handoff | review anchor、trace context、trace handoff、archive handoff 能保留追溯证据，交接失败不回滚业务 truth | 历史追溯与复盘能力不足 |
| Outbox / event collaboration | 已成立 truth 能形成 outbound event / outbox record，publish retry / failed 只改变 outbox 状态 | 变化无法被下游稳定感知 |
| Operations jobs | projection rebuild、search rebuild、cursor maintenance、snapshot refresh、handoff delivery、consistency validation、cursor cleanup 可重跑、可留证、不修写真相 | 外围维护不可审计或污染 truth |
| Configuration / reports / redaction | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的 P0 profile 可验证；证据固定输出到 `artifacts/test/<run_id>` 和 `reports/`；raw secret / forbidden body 扫描失败即失败 | 测试证据不可验收 |

### 3.2 P1/P2 是否只做边界验证或延后?

| 层级 | 当前测试口径 | 是否进入 P0 门禁 |
|---|---|---|
| P0 | 使用 in-memory store、fake / controlled resolver、fake publisher、fake handoff、deterministic fixture 完成本仓 truth center 闭环 | 是 |
| P0 / P1 边界 | `integration-like` 只验证 configured adapter 接缝、credential ref、unresolved / retry / failed / quarantine 语义 | 是，但不要求真实生产 endpoint |
| P1 | durable store、real event bus、real resolver、real handoff endpoint、staging-like 跨仓演练 | 不进入当前 P0 通过条件，只保留接缝和后续风险 |
| P2 | config center、admin override、hot reload、auto repair consistency job、advanced observability dashboard、production runbook | 不测试；若 P0 中启用应按 unsupported / fail-fast 验证 |

### 3.3 哪些下游能力只测接缝,不测对方完整实现?

| 对方 / 下游能力 | 本轮只测的接缝 | 不测内容 |
|---|---|---|
| `L0-core` | shared ID、ActorRef、TraceContext、metadata、error 类型引用与 DTO roundtrip | core 内部实现和所有 core 测试矩阵 |
| `L0-bus` | outbox event schema、fake publisher、publish retry / failed、event id 幂等 | bus 真实投递、死信、replay 和 broker 产品 |
| `L1-identity` | actor / member / AI member ref、safe snapshot、unresolved actor 行为 | 成员生命周期、认证授权裁决和身份后台 |
| `L1-work` / `L1-governance` / `L1-artifact` | external fact ref、safe snapshot、manifestation、digest mismatch / unresolved | 项目、治理裁决、artifact 正文 / 版本 / 证据链真相 |
| `L2-runtime` | runtime result committed 事件只转为结果性 conversation fact；reasoning / tool body 拒绝 | LLM 推理、agent loop、tool call 和 memory |
| `L6-bridges` | mapped fact received ref-only 输入、外部平台 body 拒绝 | Mattermost / Slack / Telegram 等外部协议生命周期 |
| `L4-observability` / `L4-archive` | trace / archive handoff port、payload ref、失败重试和 redaction | 全局 trace store、长期归档包正文和恢复主体 |
| `L0-sdk` / `L5-chat` / `L1-workspace` | authorized query、event / cursor / projection 消费面不反写真相 | SDK facade 全量、UI 展示状态、workspace 聚合逻辑 |

### 3.4 哪些非范围有残余风险?

| 非范围 | 残余风险 | 风险归属 / 后续处理 |
|---|---|---|
| 真实 DB / MQ / HTTP / search 产品 | P0 in-memory / fake 通过不能证明生产产品行为 | P1 adapter / 部署 / 运维专项 |
| 真实跨仓端到端联调 | 接缝通过不能证明上游仓真实部署可用 | 对应仓实现完成后进入 integration / staging-like 专项 |
| Chat UI / Workspace 聚合 / Bridges 外部平台体验 | Conversation truth 通过不代表产品体验完整 | 下游子项目测试方案 |
| Runtime 推理质量和工具调用正确性 | Conversation 只验证结果事实引用和 forbidden body 防护 | `L2-runtime` / `L2-tools` |
| Governance / Artifact / Identity 真相生命周期 | Conversation 不拥有这些真相 | 对应来源仓测试方案 |
| 生产级性能容量数字 | 当前需求未锁定吞吐 / 延迟目标 | 后续非功能专项或验收标准补量化 |
| config center / hot reload / auto repair | 若误引入会破坏冷更新、审计和 truth 边界 | P0 必须验证 unsupported / rejected |

### 3.5 哪些范围项是一票否决相关?

| 一票否决范围 | 触发条件 |
|---|---|
| 核心能力闭环 | space / scope、fact append、authorized consumption、manifestation、history trace 任一必要节点缺失 |
| 授权视野 | 未授权 actor、consumer、query、cursor、search、trace read 取得不可见事实 |
| 数据归属 | 相邻仓正文、runtime reasoning body、bridge platform body、artifact body、raw secret 进入 truth、projection、event、log、report 或 artifact |
| Append-only truth | 已成立 fact、scope change、manifestation、trace 被覆盖、抹除或被 query / projection 隐式改写 |
| Source truth isolation | Conversation 自行推断 governance、artifact、work、identity、runtime 或 bridge 来源真相 |
| Derived read-only | projection、search、cursor、reports、consistency job 生成新业务 fact 或修写真相 |
| 配置红线 | 配置关闭 visibility、redaction、idempotency、state machine、audit chain 或启用 P0 unsupported 能力 |
| 证据路径 | gate / job 无法生成 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、redaction check 或 evidence index |
| fake-as-production | fake / fixture / controlled adapter 被标记为真实集成通过 |

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧范围仍围绕 Turn / stream / projection，未区分 P0/P1/P2 和新版一票否决项 | 不继承旧范围，Step 15 删除重建 |
| 旧 `06-验收标准.md` | 旧验收不能直接裁决新版 evidence | 本步只承接 `00` §14 的验收方向 |
| `03` §15 | 已有最小测试切口，但未形成 P0/P1/P2 范围层级 | 本步把最小切口提升为 P0 范围下限 |
| `04` §6 / §7 / §12 | 已定义 profile、reports / artifacts 和配置红线 | 本步纳入 P0 范围和一票否决项 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试目标 | 旧稿按“消息 / turn / stream”理解测试目标 | 以 Conversation truth center 五段闭环为目标 |
| 范围层级 | P0 / P1 / P2 不清 | P0 必须通过，P1 只测接缝或后续专项，P2 延后且 P0 中启用即拒绝 |
| 下游能力 | 容易把 Chat、Workspace、Runtime、Bridge 作为共同测试对象 | 只测 Conversation 对这些仓的输入 / 输出接缝 |
| 非范围 | 旧稿未说明 residual risk | 每个非范围绑定风险归属和后续处理 |
| 一票否决 | 旧稿缺少统一红线 | 以授权、数据归属、append-only、source truth isolation、redaction、证据路径为红线 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| P0 是否要求真实外部依赖 | 要求真实 DB / bus / resolver / handoff | 使用 in-memory / fake / controlled adapter 证明本仓语义 | B | 详细设计明确 P0 可本地闭环，真实外部依赖属于 P1 |
| 外围增强是否阻塞核心通过 | search / stream / projection 全量通过才算核心通过 | 外围增强必须不污染 truth，不可用时核心仍能判断成立 | B | 需求把 FR-CONV-006~008 定为外围增强 |
| 下游产品是否纳入本轮 E2E | Chat / Workspace / Bridge / Runtime 全链路联测 | 只测试 Conversation 接缝和授权输出 | B | 本仓不拥有下游实现，避免范围膨胀 |
| P1/P2 配置如何处理 | 暂时忽略 | P1 保留接缝，P2 unsupported / fail-fast | B | 能防止未来配置误入 P0 |
| 一票否决是否等到验收再定义 | 等 `06` 再定义 | 在测试范围阶段先标记否决相关范围 | B | 后续用例、门禁和证据必须优先覆盖否决项 |

## 7. 结构化中间产物

### 7.1 测试目标总表

| 测试目标 | 来源 | 优先级 | 证明方式 |
|---|---|---|---|
| 证明 Conversation truth center 不退化为 UI 消息、runtime 临时上下文或外部平台副本 | `00` §7 / §14、`01` §2 / §3 | P0 | space / scope + fact append + authorized read + trace evidence 全链路 |
| 证明核心业务事实追加、读取、显化和追溯均可在本仓独立闭环 | `00` FR-CONV-001~005、`03` §2 / §15 | P0 | command / query / consumer / job / state / transaction 测试 |
| 证明外围增强只从 truth 派生且不可反写真相 | `00` FR-CONV-006~008、`02` §3、`03` §15 | P0 | projection / search / cursor / reports / job negative tests |
| 证明配置、脚本、artifacts、reports 和 redaction 能形成可验收证据 | `03` §15、`04` §6 / §7 / §12 | P0 | gate、report、redaction check、path shape tests |
| 证明 P1/P2 能力未被误当成 P0 通过条件 | `04` §2 / §6 / §14 | P0 | unsupported / fake-as-production / profile boundary tests |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Conversation space / scope | 核心功能 | P0 | 建立、更新、关闭和 visibility guard | 不测 identity 生命周期 |
| Conversation fact append | 核心功能 | P0 | append-only、receipt、idempotency、forbidden body reject | 不测 runtime 推理过程 |
| Authorized query / projection | 核心功能 + 派生消费 | P0 | 授权读取、stale / failed marker、query 不写入 | 不测 Chat UI / Workspace 展示 |
| Cross-domain manifestation | 核心功能 | P0 | ref-only、safe snapshot、unresolved / digest mismatch | 不测来源仓业务真相 |
| Trace / review / handoff | 核心功能 + 追溯 | P0 | audit、review anchor、handoff retry / failed、payload ref | 不测全局归档恢复 |
| Outbox / events / worker | 事件协作 | P0 | event schema、retry、duplicate、publish failure | 不测真实 broker |
| Operations jobs | 维护与恢复 | P0 | rebuild、refresh、cleanup、consistency report、rerun | 不做自动修写真相 |
| Configuration / reports / redaction | 配置与证据 | P0 | profile、config validation、path shape、redaction failure | 不定义生产 runbook |
| Durable store / real bus / real resolver / real handoff | 外部集成 | P1 | 保留 adapter 接缝和 failure semantics | 当前不要求真实 endpoint |
| Config center / hot reload / auto repair | 远期能力 | P2 | P0 中启用必须 reject / unsupported | 当前不设计、不测试功能通过 |

### 7.3 优先级口径

| 优先级 | 定义 | 进入条件 | 失败处理 |
|---|---|---|---|
| P0-blocking | 核心闭环、红线、安全、事务、幂等、证据路径和配置下限 | 必须进入 CI / release gate | 不得验收通过 |
| P0-supporting | 外围增强但必须证明不反写真相的能力 | 进入 CI 或 nightly，关键负向进 gate | 视影响阻塞对应能力通过 |
| P0/P1-boundary | configured adapter / integration-like 接缝 | 进入 integration-like 或 nightly | 不代表真实生产集成通过 |
| P1 | 真实产品 / 真实跨仓 / staging-like 能力 | 后续专项 | 不阻塞 P0 |
| P2 | 远期治理、热更新、生产运维和高级观测 | 后续专项 | 当前启用即 unsupported |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §2 时摘录。

```markdown
## 2. 本次测试目标与范围

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“测试设计取舍”和“待确认事项”小节，了解本章测试目标、范围、非范围和一票否决范围如何从需求、架构、详细设计和配置设计收敛而来。

本轮测试目标是证明 `L1-conversation` 作为 Conversation truth center 的 P0 主链成立：对话空间与参与范围能够被独立确立，多来源协作事实能够追加沉淀，对话事实能够按授权视野被稳定消费，关键跨域事实只能以引用 / safe snapshot / manifestation 进入对话视野，对话历史能够被追溯并交接给观测 / 归档接缝。

本轮 P0 范围包括 space / scope、fact append、authorized query / projection、cross-domain manifestation、trace / review / handoff、outbox / event collaboration、operations jobs、configuration / reports / redaction。P1 真实外部依赖只验证接缝与失败语义，不作为 P0 通过条件。P2 的 config center、hot reload、auto repair、生产运维和高级观测不进入当前功能通过范围；若在 P0 profile 中启用，应按 unsupported / fail-fast 处理。

一票否决范围包括核心闭环缺失、授权视野失效、相邻仓正文或 forbidden body 进入本仓、已成立 fact 被覆盖或查询 / 投影反写真相、Conversation 自行推断来源仓真相、配置绕过 redaction / idempotency / audit / state machine，以及测试无法形成固定 artifacts / reports 证据。
```

## 9. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续 Step 必须继续收口:

- Step 3 从本步 P0 范围中抽取测试对象与测试切口，不提前设计用例。
- Step 4 把 P0-blocking、P0-supporting、P0/P1-boundary 分配到测试层级。
- Step 6 生成用例时必须优先覆盖一票否决范围。
- Step 8 必须承接 `04` profile，不重新定义配置项。
- Step 13 必须让 P0 证据可被新版 `06-验收标准.md` 引用。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 / P1 / P2 口径明确 | 通过 | P0 必测，P1 接缝 / 后续专项，P2 延后且 P0 中启用即拒绝 |
| 范围 / 非范围明确 | 通过 | 本仓测 Conversation truth center，不测下游完整实现 |
| 一票否决范围明确 | 通过 | 授权、数据归属、append-only、source truth isolation、redaction 和证据路径已列入 |
| 可以进入 Step 3 | 通过 | 下一步抽取测试对象与测试切口 |
