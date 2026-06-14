# Step 1. 确认实施输入边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节: `07-实施计划.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认实施输入边界 |
| 当前状态 | 待用户审核 |
| 输入基线 | 新版 `00/01/02/03/04/05/06`;旧 `07` 仅作历史诊断输入 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 用户确认后进入 Step 2 |

## 2. 本步目标

确认新版 `L1-identity` 实施计划依赖的需求、架构、概要、详细、配置、测试和验收输入是否足以开始制定实施路径,并识别不能交给实现者自行处理的输入风险。

本 Step 只回答:

- 本轮实施计划依据哪些正式文档和校准产物。
- 旧 `07-实施计划.md` 在本轮中的地位是什么。
- 哪些上游状态、版本或闭环风险会影响后续 phase / commit boundary 规划。
- 当前是否允许继续讨论实施目标、范围和非范围。

本 Step 不定义实施范围、phase、commit boundary、BATCH、GATE、测试命令、证据 run、提交 message 或正式 `07` 章节正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | Draft / 新版重写输入 | 提供 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID、数据归属和禁止事项 |
| `01-架构设计.md` | 已完成 | 提供 identity truth boundary、dependency direction、运行 / 事件协作、data ownership 和架构红线 |
| `02-概要设计.md` | Draft / 等待审核 | 提供主要组成部分、接口骨架、处理流、状态轮廓和详细设计承接输入 |
| `03-详细设计.md` | Step 19 final self-check 已完成 | 提供 object、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts |
| `04-配置设计.md` | Draft / Step 15 已审核通过 | 提供 profile、adapter mode、strict config、runtime builder、redaction、failure/degraded 和 downstream handoff |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 TC、EV、suite、artifact/report、entry/exit、defect/retest 和 evidence gate |
| `06-验收标准.md` | 已审核通过 | 提供 AC/VETO 裁决、P0 blocking suite、证据入口、风险接受和最终验收口径 |
| `07-实施计划.md` | 旧草案 | 只作为历史诊断输入,识别旧口径残留风险 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 提供详细设计到实施计划的承接清单和开工前复核输入 |
| `实施计划讨论流程_SOP.md` | 流程标准 | 决定 Step 1~13 的讨论顺序和中间产物要求 |
| `实施计划书写规范.md` | 书写标准 | 决定正式 `07` 13 章主链、phase / commit boundary、门禁和提交纪律 |
| `设计真相源闭环与可落码性标准.md` | 开工门禁标准 | 决定 boundary 经验复核、blocker 暂停和实现者二次校验口径 |
| `设计文档讨论中间产物规范.md` | 中间产物标准 | 决定 Step 文件结构、追溯、停审和长文档分批写作 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前仓是否具备完整的 `00/01/02/03/05/06` 文档? | 具备。当前还额外具备新版 `04-配置设计.md`,实施计划应把 `04` 也纳入输入。 |
| 哪些上游文档版本是本轮实施计划基线? | 以当前新版 `00/01/02/03/04/05/06` 和对应 `design-calibration` 产物为讨论基线。旧 `07` 不作为实施基线。 |
| 详细设计是否足以支持 1:1 实现? | `03` 正文已完成 final self-check,并明确字段级契约、trait 签名、DTO schema、flow、state 和 persistence 语义保留在对应校准文件中。它足以启动实施计划讨论,但后续 Step 6 仍必须按 phase / commit boundary 逐项做可落码经验复核。 |
| 测试方案和验收标准是否足以定义阶段门禁? | `05` 已装配 TC / EV / suite / artifact/report 结构,`06` 已审核通过并固定 P0 blocking suite、AC/VETO 和 evidence 入口。它们足以支撑 Step 7 的测试与验收门禁设计。 |
| 是否存在上游文档之间的冲突? | 当前未发现阻塞 Step 2 的冲突。已知风险是若正式文档摘要与字段级校准产物冲突,必须回到对应 Step 修正,不得由实现者自行选择。 |
| 详细设计是否完成字段、DTO、状态和 phase boundary 复核? | 字段、DTO、状态和 transaction 等契约已在 `03` 各 Step 中形成;phase / commit boundary 尚未定义,因此必须留给 `07` Step 5~6 逐 boundary 审计。 |
| 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称? | `05/06` 均按新版 `03/04` 重新装配。Step 7 仍需验证每个 boundary 的测试 / 验收门禁是否回指正式 TC、EV、suite 和 AC/VETO。 |
| 哪些缺口会阻塞实施计划,哪些可记录为风险继续推进? | 没有阻塞进入 Step 2 的缺口。`00/02/04/05` 的 Draft / assembled 状态、正式实现仓状态、送验 `<run_id>` 和 boundary 经验复核尚未完成,应记录为后续 Step 风险或门禁。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `07-实施计划.md` | 旧草案早于新版 `03/04/05/06`,包含旧阶段结构、旧入口族、旧版本和旧技术假设 | 降级为历史诊断输入;Step 13 前不修改正式 `07` |
| `07-实施计划.md` | 旧草案按大阶段和阅读确认展开,未按新版 phase / commit boundary 小循环组织 | Step 5~6 重新设计 phase、boundary、代码批次和经验复核 |
| `07-实施计划.md` | 旧草案未逐 boundary 执行 `设计真相源闭环与可落码性标准.md` §九经验复核 | Step 6 必须逐 boundary 落表,blocker 必须先回写设计 |
| `03-详细设计.md` | 正文摘要要求继续阅读字段级校准文件,不能单靠正式摘要实现 | Step 3 必须建立阶段实施前阅读矩阵 |
| `00/02/04/05` 元信息 | 仍标注 Draft、等待审核或 assembled | 记录为实现移交前 baseline 固定风险;不阻塞 `07` 讨论 |
| 送验 / 实现仓材料 | 当前没有固定实现仓 commit、artifact run 或 report run | 不属于 Step 1;后续 Step 3 / Step 7 / Step 12 处理 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施计划生成方式 | 旧 `07` 直接作为草案阅读 | 建立 `07_implementation_plan_calibration_flow.md` 与 Step 1 输入边界 | 符合实施计划 SOP 的中间产物先行 |
| 上游权威顺序 | 旧 `07` 与新版 `00~06` 可能混读 | 明确新版 `00~06` 为输入基线,旧 `07` 只作历史诊断 | 防止旧入口、旧阶段和旧版本回流 |
| phase / commit boundary | 旧草案没有按 boundary 小循环做设计闭环复核 | 后续 Step 5~6 必须按 phase / boundary 重建 | 满足 SOP v0.15~v0.17 |
| 可落码经验复核 | 旧草案只写泛化实施纪律 | 后续每个 boundary 必须选择适用经验项并给出结论 | 避免实现阶段再次被迫补 schema / port / 状态 |
| 正式文档改写 | 可能直接修改正式 `07` | Step 13 前不改正式 `07` | 长文档先建框架、逐 Step 确认后装配 |

## 7. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否直接重写正式 `07` | A. 直接替换正式文档;B. 先走 `07_implementation_plan_*` 中间产物 | 采用 B。正式文档必须由 Step 1~12 已审核产物在 Step 13 装配 |
| 是否继承旧 `07` 的阶段 | A. 继承并局部修补;B. 只作历史诊断 | 采用 B。旧阶段与新版 protocol、test/evidence 和 boundary 纪律不一致 |
| 是否现在定义 phase / commit boundary | A. Step 1 直接定义;B. Step 5~6 再定义 | 采用 B。Step 1 只确认输入边界,phase / boundary 需要先经过范围、前置条件和交付物抽取 |
| 是否把 Draft 状态当 blocker | A. 阻塞全部 `07` 讨论;B. 记录为移交实现前 baseline 风险 | 采用 B。当前输入足以继续规划,但最终移交实现前必须固定 design baseline |
| 是否让实现者现场补缺口 | A. 允许实现时补;B. 发现缺口先回设计 | 采用 B。可落码标准和实施 SOP 明确禁止实现者自行补 schema、port、状态或 boundary |

## 8. 结构化中间产物

### 8.1 实施输入边界表

| 上游文档 | 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| 需求文档 | `projects/L1-identity/00-需求文档.md` | 定义能力、规则、AC、VETO、数据边界和非范围 | 可用于规划 | 元信息仍为 Draft,移交实现前需固定 baseline |
| 架构设计 | `projects/L1-identity/01-架构设计.md` | 定义 truth boundary、dependency direction 和架构红线 | 可用于规划 | 当前无 Step 1 blocker |
| 概要设计 | `projects/L1-identity/02-概要设计.md` | 定义组件、关键对象、接口骨架、处理流和状态轮廓 | 可用于规划 | 元信息仍为 Draft / 等待审核 |
| 详细设计 | `projects/L1-identity/03-详细设计.md` | 定义 object、protocol、flow、state、transaction、error 和 test cuts | 可用于规划 | 实现者必须继续读具体 `03_ddd_step_*` 校准文件 |
| 配置设计 | `projects/L1-identity/04-配置设计.md` | 定义 profile、adapter mode、runtime builder、redaction 和 config failure | 可用于规划 | 元信息仍为 Draft |
| 测试方案 | `projects/L1-identity/05-测试方案.md` | 定义 TC、EV、suite、artifact/report 和 defect/retest | 可用于规划 | 元信息仍为 Draft / assembled |
| 验收标准 | `projects/L1-identity/06-验收标准.md` | 定义 AC/VETO、P0 evidence、risk acceptance 和 release decision | 已审核通过 | 当前无 Step 1 blocker |
| 旧实施计划 | `projects/L1-identity/07-实施计划.md` | 历史诊断,识别旧口径残留 | 不可作为基线 | Step 13 需重建 |

### 8.2 闭环复核项初筛

| 闭环复核项 | 来源 | 状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03_ddd_step_06_object_contracts.md`、`03` 正文说明 | 待 Step 6 按 boundary 复核 | 不阻塞 Step 2 | Step 6 逐 boundary 落表 |
| DTO 构造闭环 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_09_function_flows.md` | 待 Step 6 按 boundary 复核 | 不阻塞 Step 2 | Step 6 逐 command / query / event / job boundary 检查 |
| 状态闭环 | `03_ddd_step_10_state_matrix.md`、`05/06` | 待 Step 6 / Step 7 复核 | 不阻塞 Step 2 | 状态名、迁移和测试 / 验收裁决必须同源 |
| 持久化 / UoW / 幂等闭环 | `03_ddd_step_11_*`、`03_ddd_step_13_*` | 待 Step 6 复核 | 不阻塞 Step 2 | boundary 若涉及 write / replay 必须检查 expected version 和 stored result |
| Query / projection 闭环 | `03_ddd_step_07_*`、`03_ddd_step_09_*`、`03_ddd_step_11_*` | 待 Step 6 / Step 7 复核 | 不阻塞 Step 2 | query boundary 必须验证 no-write、visibility、lookup 和 degraded surface |
| Evidence / artifact 闭环 | `05`、`06`、可落码标准 §七 | 待 Step 7 复核 | 不阻塞 Step 2 | 每个 evidence-producing boundary 必须有正式 writer / report path |
| phase boundary 闭环 | `07` 待生成 | 未定义 | 阻塞实现移交,不阻塞 Step 2 | Step 5~6 定义并审计 |

### 8.3 历史 `07` 诊断表

| 诊断项 | 结论 | 后续处理 |
|---|---|---|
| 章节结构 | 不符合新版 13 章主链 | Step 13 按书写规范重建 |
| 输入版本 | 引用旧文档版本和旧 ADR / 技术假设 | Step 3 重新建立阅读清单和前置检查 |
| 实施主轴 | 偏大阶段和个人执行清单,不是 phase / commit boundary 小循环 | Step 5~6 重建 |
| 测试 / 证据 | 未按新版 TC / EV / artifact/report / acceptance gate 嵌入 boundary | Step 7 重建 |
| 经验复核 | 未逐 boundary 选择可落码标准 §九适用项 | Step 6 必须补齐 |
| 旧口径残留 | 存在旧入口族和旧流程描述 | Step 13 清理,当前不直接继承 |

### 8.4 当前可继续 / 不可继续判定

| 判定 | 结论 | 说明 |
|---|---|---|
| 是否可进入 Step 2 | 可以 | 输入文档齐全,旧 `07` 已降级为历史诊断 |
| 是否可直接改正式 `07` | 不可以 | 必须先完成 Step 1~12 并经用户确认 |
| 是否可移交实现 agent | 不可以 | phase / commit boundary、经验复核、阅读矩阵、测试验收门禁和 baseline 固定尚未完成 |
| 是否允许实施计划补设计缺口 | 不允许 | 发现 design gap 时必须回写对应 `03/04/05/06` 或校准产物 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 新版 `00~06` 足够启动 Step 2 | 否 | 实施计划 SOP 进入条件 | 无需回写 |
| 旧 `07` 不能作为当前实施真相源 | 否 | 下游文档权威级别 | Step 13 重建正式 `07` |
| `00/02/04/05` 元信息仍带 Draft / assembled | 是 | 实现移交 baseline 风险 | Step 12 前必须固定或明确基线口径 |
| `03` 字段级契约在校准文件中 | 是 | 阶段阅读矩阵要求 | Step 3 必须转译为按 boundary 的阅读门禁 |
| phase / commit boundary 尚未定义 | 是 | 实施计划核心缺口 | Step 5~6 闭合 |
| 若后续 boundary 找不到正式设计契约 | 是 | 可落码 blocker | 回写 `03` 或暂停该 boundary |
| 若后续 boundary 找不到测试 / 验收证据入口 | 是 | 门禁 blocker | 回写 `05/06` 或调整 boundary |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游 / 下游文档的影响判定”和“待确认事项”小节,了解实施计划输入边界如何从新版 `00/01/02/03/04/05/06` 收敛。

正式 `07-实施计划.md` §1 应回填:

- 本实施计划承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。
- `03-详细设计.md` 是实现契约直接来源;字段级对象契约、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts 需要继续读取对应 `design-calibration/03_ddd_step_*` 文件。
- `05-测试方案.md` 和 `06-验收标准.md` 是阶段测试、证据、AC/VETO 和 release readiness 门禁来源。
- 旧版 `07-实施计划.md` 只作为历史诊断输入,不得直接继承旧阶段、旧入口、旧版本和旧提交边界。
- 本计划不重新定义需求、架构、对象、DTO、状态、port、测试用例、evidence schema 或验收结论;若后续 phase / commit boundary 找不到正式真相源,必须暂停并回写设计。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `00/02/04/05` 的 Draft / assembled 元信息是否需要在正式 `07` 定稿前同步为已审核状态 | 影响实现移交 baseline 信号 | Step 12 前复核 |
| 目标实现仓路径和当前代码基线尚未确认 | 影响 Step 3 前置条件和 Step 12 移交实现判定 | Step 3 处理 |
| phase / commit boundary 尚未定义 | 影响实施主轴和可落码审计 | Step 5~6 处理 |
| 每个 boundary 的经验复核尚未执行 | 影响实现移交门禁 | Step 6 处理 |
| 测试 / 验收门禁尚未嵌入 boundary | 影响可验证增量和证据闭环 | Step 7 处理 |
| 正式 `07` 仍是旧草案 | 读者可能误用旧实施路径 | Step 13 统一重建;当前工作台标识状态 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 旧 `07` 地位已明确 | 通过 | 仅历史诊断,不作为实施基线 |
| 实施计划必须回答 / 不再回答的问题明确 | 通过 | 见 §2 / §10 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| 正式 `07` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 2 | 待用户确认 | 用户确认后进入 Step 2: 明确实施目标、范围和非范围 |
