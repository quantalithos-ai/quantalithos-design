# Step 14. 风险与待确认事项

> 对应正式章节: `01-架构设计.md` §15
> 本步状态: 已完成
> 前序依赖: Step 13 已完成
> 当前结论: `L1-identity` 当前没有阻塞 `01-架构设计.md` 收口的风险,但存在会阻塞后续 `03/04/05/06/07` 1:1 落码或验收闭口的未关闭风险。风险与待确认事项必须拆开表达:风险是已识别且会影响主线的未关闭问题;待确认事项是仍缺关键裁决、不能被写成已知风险或已定结论的问题。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 显式收纳尚未关闭的架构风险和待确认问题,说明它们分别影响什么、当前如何处理,以及是否阻塞后续推进。
- 复杂度判断: 本步不拆附录,但必须分成风险表、待确认事项表、处理口径说明和状态结论,不得合并成 TODO 清单。
- 粒度约束: 本步不写最终解决方案、实施步骤、负责人、时间安排、任务拆分、优化清单或空泛风险词。
- 判定约束: 已在前文收稳的边界不重复当风险;普通后续任务不自动成为风险;可接受债务只有在仍会影响主线判断时才进入本章。
- 停审要求: 本步已按用户“继续 identity”进入 Step 15。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1~13 的后移事项、风险和债务 | 本步输入表 | 已完成 |
| 回答风险与待确认事项问题 | SOP 问题回答表 | 已完成 |
| 诊断旧风险页混写和任务化问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 判断风险 / 待确认事项 / 可接受债务的边界 | 设计取舍表 | 已完成 |
| 输出风险表 | 结构化中间产物 | 已完成 |
| 输出待确认事项表 | 结构化中间产物 | 已完成 |
| 输出当前处理口径说明和状态结论 | 结构化中间产物 | 已完成 |
| 形成正式 §15 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供旧材料降级、后移事项和不得脑补规则 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供 forbidden body、query no-write、report-only、projection 可重建等边界,用于判断风险是否打穿主线 |
| `01_arch_step_09_interactions_communication.md` | 提供同步 / 异步 / 后台承接和失败降级口径,用于判断交互风险 |
| `01_arch_step_10_technology_choices.md` | 提供机制级选型和后续文档承接边界 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 提供不采用路径和不进入候选方向,用于排除伪风险 |
| `01_arch_step_12_cross_cutting_concerns.md` | 提供安全、visibility、审计、可观测、韧性、性能和配置横切约束 |
| `01_arch_step_13_evolution_path.md` | 提供可接受债务、触发条件和不演进项 |
| `00_req_step_15_risks_open_questions.md` | 提供需求层 `OQ-ID-*` 和旧材料一致性风险来源 |
| `架构设计讨论流程_SOP.md` Step 14 | 约束风险与待确认事项必须拆开表达 |
| `架构设计书写规范.md` §4.15 | 约束风险表、待确认事项表和当前处理口径说明 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前还有哪些尚未关闭的架构风险? | 主要风险包括旧 `01/02/04` 或旧性能数字回流、source 协议未闭口导致后续实现自造规则、high-risk lifecycle basis 未闭口、memory / archive handoff surface 未闭口、visibility / redaction 未闭口、性能 / 可用性基线未闭口、配置 profile / adapter 边界未复核。 |
| 这些风险会影响哪一层架构结构? | 它们分别影响需求到架构真相源链路、外部来源承接、生命周期状态 / flow、数据 ownership、query / projection / trace view、测试 / 验收基线和运行配置边界。 |
| 当前还有哪些待确认事项? | method source 模式、high-risk lifecycle 动作枚举和 basis shape、memory / archive carrier 与 handoff result surface、field-level visibility / privacy marker、P0 performance / availability baseline、既有 `04` 是否保留、full event-sourcing 是否由明确压力触发评估。 |
| 哪些待确认项会影响前文结论是否成立? | 它们不会推翻当前 `01` 的主线,但会影响后续 `03/04/05/06/07` 是否能 1:1 落码。若它们被错误闭口,可能反向打穿 source ownership、forbidden body、query no-write、report-only 或配置变更边界。 |
| 哪些风险是当前阶段可接受的,哪些会阻塞后续推进? | 当前风险不阻塞 `01` 完成,因为 `01` 已给出保守边界和挂起口径;但它们会阻塞对应后续 surface 的正式落码或验收 pass,直到相关文档闭口。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 14 风险和待确认事项混写 | 既有风险、缺失确认和后续落点都在一张表里,无法判断阻塞性 | 拆成风险表与待确认事项表 |
| 待确认事项只写“挂起” | 没有说明缺什么确认,容易形成假挂起 | 每项写明缺失确认和当前挂起口径 |
| 风险只写影响范围,不写阻塞性 | 后续 agent 不知道是否能继续推进 | 每项写明是否阻塞 `01` 或后续文档 / 实现 |
| 旧材料回流风险没有精确处理 | 旧 `02/04` 和旧性能指标可能继续污染新版架构 | 作为正式风险列出,当前按“旧材料只作历史诊断”约束 |
| 可接受债务可能被误作已闭口 | Step 13 中可接受债务若被正文润色,后续实现会自造 schema / port | 本步将会影响 1:1 落码的债务转入风险或待确认事项 |
| 不演进项可能被未来化 | auth、ProjectMember、method body、memory body 等已排除方向可能被包装为未来能力 | 不作为风险或待确认事项,因为前文已明确排除 |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 风险定义 | 宽泛列问题 | 只收纳已识别、未关闭、会影响主线判断的问题 |
| 待确认定义 | 简单“挂起” | 写清影响范围、缺失确认和当前挂起口径 |
| 阻塞性 | 未区分 | 区分不阻塞 `01`、阻塞后续对应文档 / 实现、条件触发 |
| 后续落点 | 写成任务位置 | 写成影响范围和挂起口径,不写任务拆分 |
| 旧材料 | 容易继续作为输入 | 明确旧材料回流是风险,当前降级为历史诊断 |
| 已排除事项 | 可能再次进入未来讨论 | 不进入本章,因为已被前文定为不演进项 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把所有后续工作都列为风险 | 不采用 | 普通后续工作不等于影响主线判断的未关闭风险。 |
| 把风险和待确认事项合并 | 不采用 | 已识别风险和缺失确认问题的处理口径不同,合并会误导后续文档。 |
| 对当前未闭口项直接给最终解决方案 | 不采用 | Step 14 只说明当前如何约束 / 暂存 / 挂起,不越权闭口 `03/04/05/06/07`。 |
| 标记“当前不阻塞 `01`,但阻塞后续对应落码” | 采用 | 这能同时保证架构文档可收口,又防止实现 agent 自行补 schema / port / baseline。 |
| 把边界外能力列为待确认事项 | 不采用 | 认证、work truth、method body、memory body、runtime 和 UI 已被前文排除,不是待确认事项。 |

---

## 7. 结构化中间产物

### 7.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 旧 `01/02/04`、旧 API / table / event 名或旧 P95 / 容量指标回流 | 新版 `01~07` 真相源链路、后续实施边界和验收证据 | 旧材料只作为历史诊断输入;新版 `01` 只承接新版 `00` 和当前 `01_arch_step_*` | 不阻塞 `01`;阻塞旧口径直接进入后续文档 | 该风险已经发生过多次相似问题,必须在架构层持续显式压住。 |
| method / work / governance / memory / archive source 协议未闭口导致实现自造规则 | 外部来源承接、typed refs / source marker、Step 9 交互和 `03` protocol / port | 当前只允许 ref / safe summary / marker / basis 的保守边界;协议细节不得在 `01` 脑补 | 不阻塞 `01`;阻塞后续对应 source surface 1:1 落码 | 该问题会影响实现是否能稳定映射 source state、subject、basis 和 stale marker。 |
| high-risk lifecycle basis 和动作口径未闭口 | 生命周期状态、治理 / authorization basis、状态矩阵、测试验收 | 当前只规定高风险动作必须有 actor / basis boundary,缺 basis 不得 accepted | 不阻塞 `01`;阻塞 `03/05/06` 中 high-risk lifecycle 细化 | 风险已经明确影响生命周期 accepted path,但当前 `01` 可用保守边界收口。 |
| memory / archive carrier、handoff 和 migration result surface 未闭口 | memory ref relation、handoff、archive / observability 交接、jobs / 配置 | 当前只允许 refs / relation / handoff marker;memory body、embedding、archive package 不入仓 | 不阻塞 `01`;阻塞 `03/04/07` 中 handoff / job / config 细化 | 若不闭口,后续实现会自造 handoff target、record 和 result state。 |
| field-level visibility / privacy / redaction 未闭口 | query、projection、trace view、consumer event、report view | 当前只规定 query no-write、not visible / stale / degraded 和 forbidden body 不泄漏 | 不阻塞 `01`;阻塞 `03/05/06` 中 view / protocol / test 细化 | 该风险影响字段级消费正确性,但不推翻当前只读消费主线。 |
| performance / availability baseline 未闭口 | 性能 / 可用性测试、验收 pass / conditional pass、运行演进触发 | 当前不继承旧数字;只保留结构口径,硬基线后移 `05/06` | 不阻塞 `01`;阻塞正式 pass 阈值和 release evidence | 若后续没有 baseline,验收可能只能停在 sample / trend,不能宣告 pass。 |
| 配置 profile / adapter / source enablement 与新版主线未复核 | `04-配置设计.md`、runtime builder、profile / adapter / retry / timeout、实施计划 | 当前规定配置不得改变 truth ownership、正文排除、query no-write、report-only、依赖裁剪和 phase boundary | 不阻塞 `01`;阻塞新版 `04` 保留或重写裁决 | 旧配置若反向进入架构,会重复引发 1:1 落码 blocker。 |
| full event-sourcing-first 压力未出现前被提前升级为主线 | truth model、trace / audit、event shadow、projection rebuild、实施复杂度 | 当前不采用 full ES 为主体范式;只在 replay / audit / temporal query 压力明确时评估 | 不阻塞 `01`;条件触发后阻塞对应演进裁决 | 该风险来自 Step 11 取舍,提前升级会改变当前主线复杂度。 |

### 7.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| method-library 到 identity 的 role / capability 来源方式 | 外部来源承接、role capability summary、source refresh、event / query 交互 | 缺正式裁决:来源采用 query、event、snapshot 还是组合;缺 source state / version / stale 语义 | 当前不把任何来源方式写成定论,只保留 ref / safe summary / marker 边界 | 该事项尚未形成路径裁决,不能被升级成已知实现风险或已定协议。 |
| high-risk lifecycle 的动作枚举和 governance / authorization basis shape | lifecycle 状态矩阵、accepted path、basis validation、测试验收 | 缺正式动作集合、basis 类型、summary / marker shape 和缺失 basis 时的 public surface | 当前只挂起为“高风险动作必须有 basis,缺 basis 不 accepted” | 当前已知必须有依据,但依据形状仍缺确认。 |
| memory / archive refs 的 carrier、handoff target 和 migration result surface | memory ref relation、archive handoff、jobs、配置和验收 | 缺 carrier 归属、handoff target 类型、result marker、failed / retryable / completed state | 当前只挂起为 ref-only + handoff marker,正文 / package 不入仓 | 该事项影响后续 handoff 可落码性,但当前不能预设 target schema。 |
| 成员摘要 visibility / privacy 的字段级 marker 和 redaction 规则 | query / projection / trace view / consumer event / SDK | 缺字段级可见性分类、not visible vs redacted vs stale 的正式映射 | 当前只挂起为 visibility / read safety 横切口径,不定义字段 | 该事项影响后续 view schema,但当前不能脑补字段级策略。 |
| P0 performance / availability baseline 与 pass 裁决规则 | `05` 测试方案、`06` 验收标准、release evidence | 缺负载模型、sample-to-threshold 规则、P0 baseline 或人工评审裁决规则 | 当前只挂起为“不继承旧阈值,后续必须建立 baseline / sample / review 口径” | 该事项不是当前架构风险本身,但会直接影响验收能否 pass。 |
| 既有 `04-配置设计.md` 是否保留、修订或重写 | 配置 profile、adapter mode、runtime builder、实施计划 | 缺新版 `03` 稳定后的配置复核结论;缺 profile / adapter / source / handoff / retry 的新版映射 | 当前不让旧 `04` 作为新版 `01` 上游,只作为后续复核对象 | 该事项必须挂起到 `03` 之后,否则配置会反向决定架构。 |
| full event-sourcing / stronger CQRS 是否进入后续主线 | truth model、trace / audit、projection / replay、实施复杂度 | 缺明确 replay / audit / temporal query 压力和成本收益裁决 | 当前不纳入主线,只在触发条件出现后评估 | 该事项不是当前未决方案,而是条件触发后的演进裁决。 |

### 7.3 当前处理口径说明

本章把“已识别、未关闭、会影响主线判断”的内容列为风险,把“缺少关键裁决、尚不能定论”的内容列为待确认事项。当前这些风险不阻塞 `01-架构设计.md` 收口,因为前文已经给出保守边界、禁止项和后移口径;但它们会阻塞后续对应 `03/04/05/06/07` 的 1:1 落码或验收 pass。待确认事项当前只能挂起,不能为了让文档完整而提前写成 protocol、schema、baseline 或配置结论。本章不提供最终解决方案,只防止不确定项被润色成已定架构。

### 7.4 当前状态结论

| 判断项 | 当前结论 | 说明 |
|---|---|---|
| 是否阻塞 `01-架构设计.md` 完成 | 不阻塞 | 当前主线、边界、取舍、横切和演进口径已经成立。 |
| 是否阻塞后续 `02-概要设计.md` | 不直接阻塞 | `02` 可承接架构单元和主线边界,但不得提前闭口待确认 protocol / schema。 |
| 是否阻塞后续 `03-详细设计.md` | 有条件阻塞 | source、basis、handoff、visibility 等 surface 必须在 `03` 闭口后才能 1:1 落码。 |
| 是否阻塞新版 `04-配置设计.md` | 有条件阻塞 | 旧 `04` 必须在新版 `03` 后复核,不能反向决定 `01`。 |
| 是否阻塞 `05/06` 测试与验收 | 有条件阻塞 | 性能 / 可用性 baseline、visibility、forbidden body、report-only 等必须形成可执行证据。 |
| 是否允许实现 agent 自行补 schema / port / threshold | 不允许 | 任何无法从正式设计 1:1 推导的 surface 必须回写设计。 |

---

## 8. 回填草稿

````md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险表”“待确认事项表”“当前处理口径说明”和“当前状态结论”小节,了解哪些问题不阻塞当前架构收口,但会阻塞后续详细设计、配置、测试、验收或实施的 1:1 闭口。

当前 `L1-identity` 没有阻塞 `01-架构设计.md` 收口的风险。未关闭问题的当前处理原则是:在 `01` 中保持保守边界和挂起口径,不把未确认协议、schema、baseline 或配置写成定论;在后续 `03/04/05/06/07` 中逐项闭口,不得由实现 agent 自行发明。

### 15.1 风险

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 旧 `01/02/04`、旧 API / table / event 名或旧 P95 / 容量指标回流 | 新版 `01~07` 真相源链路、后续实施边界和验收证据 | 旧材料只作为历史诊断输入;新版 `01` 只承接新版 `00` 和当前 `01_arch_step_*` | 不阻塞 `01`;阻塞旧口径直接进入后续文档 | 该风险必须在架构层持续显式压住。 |
| 外部来源协议未闭口导致实现自造规则 | 外部来源承接、typed refs / source marker、Step 9 交互和 `03` protocol / port | 当前只允许 ref / safe summary / marker / basis 的保守边界 | 不阻塞 `01`;阻塞后续对应 source surface 1:1 落码 | 该问题会影响实现是否能稳定映射 source state、subject、basis 和 stale marker。 |
| high-risk lifecycle basis 和动作口径未闭口 | 生命周期状态、治理 / authorization basis、状态矩阵、测试验收 | 当前只规定高风险动作必须有 actor / basis boundary,缺 basis 不得 accepted | 不阻塞 `01`;阻塞 `03/05/06` 中 high-risk lifecycle 细化 | 风险已经明确影响 lifecycle accepted path,但当前 `01` 可用保守边界收口。 |
| memory / archive handoff surface 未闭口 | memory ref relation、handoff、archive / observability 交接、jobs / 配置 | 当前只允许 refs / relation / handoff marker;memory body、embedding、archive package 不入仓 | 不阻塞 `01`;阻塞 `03/04/07` 中 handoff / job / config 细化 | 后续实现不得自造 handoff target、record 和 result state。 |
| field-level visibility / privacy / redaction 未闭口 | query、projection、trace view、consumer event、report view | 当前只规定 query no-write、not visible / stale / degraded 和 forbidden body 不泄漏 | 不阻塞 `01`;阻塞 `03/05/06` 中 view / protocol / test 细化 | 该风险影响字段级消费正确性,但不推翻当前只读消费主线。 |
| performance / availability baseline 未闭口 | 性能 / 可用性测试、验收 pass / conditional pass、运行演进触发 | 当前不继承旧数字;只保留结构口径,硬基线后移 `05/06` | 不阻塞 `01`;阻塞正式 pass 阈值和 release evidence | 若后续没有 baseline,验收不能宣告 pass。 |
| 配置 profile / adapter / source enablement 与新版主线未复核 | `04-配置设计.md`、runtime builder、profile / adapter / retry / timeout、实施计划 | 当前规定配置不得改变 truth ownership、正文排除、query no-write、report-only、依赖裁剪和 phase boundary | 不阻塞 `01`;阻塞新版 `04` 保留或重写裁决 | 旧配置若反向进入架构,会重复引发 1:1 落码 blocker。 |

### 15.2 待确认事项

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| method-library 到 identity 的 role / capability 来源方式 | 外部来源承接、role capability summary、source refresh、event / query 交互 | 缺正式裁决:来源采用 query、event、snapshot 还是组合;缺 source state / version / stale 语义 | 当前不把任何来源方式写成定论,只保留 ref / safe summary / marker 边界 | 不能被提前写成已定协议。 |
| high-risk lifecycle 的动作枚举和 governance / authorization basis shape | lifecycle 状态矩阵、accepted path、basis validation、测试验收 | 缺正式动作集合、basis 类型、summary / marker shape 和缺失 basis 时的 public surface | 当前只挂起为“高风险动作必须有 basis,缺 basis 不 accepted” | 当前已知必须有依据,但依据形状仍缺确认。 |
| memory / archive refs 的 carrier、handoff target 和 migration result surface | memory ref relation、archive handoff、jobs、配置和验收 | 缺 carrier 归属、handoff target 类型、result marker、failed / retryable / completed state | 当前只挂起为 ref-only + handoff marker,正文 / package 不入仓 | 当前不能预设 target schema。 |
| 成员摘要 visibility / privacy 的字段级 marker 和 redaction 规则 | query / projection / trace view / consumer event / SDK | 缺字段级可见性分类、not visible vs redacted vs stale 的正式映射 | 当前只挂起为 visibility / read safety 横切口径,不定义字段 | 字段级策略后移 `03`。 |
| P0 performance / availability baseline 与 pass 裁决规则 | `05` 测试方案、`06` 验收标准、release evidence | 缺负载模型、sample-to-threshold 规则、P0 baseline 或人工评审裁决规则 | 当前只挂起为“不继承旧阈值,后续必须建立 baseline / sample / review 口径” | 该事项会直接影响验收能否 pass。 |
| 既有 `04-配置设计.md` 是否保留、修订或重写 | 配置 profile、adapter mode、runtime builder、实施计划 | 缺新版 `03` 稳定后的配置复核结论 | 当前不让旧 `04` 作为新版 `01` 上游,只作为后续复核对象 | 必须挂起到 `03` 之后。 |
| full event-sourcing / stronger CQRS 是否进入后续主线 | truth model、trace / audit、projection / replay、实施复杂度 | 缺明确 replay / audit / temporal query 压力和成本收益裁决 | 当前不纳入主线,只在触发条件出现后评估 | 不是当前未决方案,而是条件触发后的演进裁决。 |
````

---

## 9. 待确认事项

本步本身不新增额外待确认事项。上文 §7.2 已收纳当前架构层待确认事项。

---

## 10. 进入下一步条件

Step 14 已完成。进入 Step 15 前必须满足:

- 用户通过“继续 identity”确认本步风险与待确认事项拆分。
- `01_architecture_calibration_flow.md` 已将 Step 14 状态更新为 `已完成`。
- Step 15 只能把已经确认的架构决定、风险和待确认事项做 ADR / 需求追溯索引,不得新增未确认结论。
- 若审核发现本步把风险写成任务 backlog、把待确认事项写成假挂起、把后续方案写成最终解决方案,或遗漏阻塞后续 1:1 落码的缺口,必须先修正本 Step,不能进入 Step 15。
