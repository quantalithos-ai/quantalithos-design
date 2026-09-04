# Step 14. 定义最终结论与签署口径 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14
> 回填章节：`06-验收标准.md` §14 最终结论与签署

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 最终结论与签署口径 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1~13；`验收标准书写规范.md` §4.2、§5.14；`05` 缺陷 / 退出规则 |
| 输出文件 | `design-calibration/06_acceptance_step_14_final_decision_signoff.md` |
| 真实执行状态 | 未执行；不填写实际 verdict、signoff、日期、run 或 readiness |
| gate_status | `pass_with_upstream_blockers` |
| gate_reason | 三值结论、进入下一阶段条件、签署角色、风险接受边界和未执行占位已固定；真实结论必须由固定基线和 evidence 产生 |
| next_allowed_action | 进入 Step 15，装配正式 `06-验收标准.md` |

### 1.1 Step 内计划

- [x] 对齐验收标准书写规范三值结论。
- [x] 将 P0 AC、VETO、S/A/B/R、证据和 residual 连接到结论矩阵。
- [x] 固定“通过 / 有条件通过 / 不通过”的进入下一阶段含义。
- [x] 固定签署角色、职责和风险接受边界。
- [x] 保留设计阶段未执行占位并完成最终结论停审。

## 2. 本步目标

本步定义最终验收结果的唯一表达方式以及签署责任。验收标准本身只规定判定规则，不填写某次交付的实际结果；真实验收必须在 `run_id`、交付版本、环境、数据、artifact、report 和 acceptance review 均固定后执行。

结论只允许“通过”“有条件通过”“不通过”。`not_evaluable` 是门禁状态，不是第四种结论；当它影响 P0、VETO 或 hard gate 时，最终结论为不通过或暂停验收，不能填写有条件通过。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 验收范围与 P0 AC | Step 2、Step 5~9 | 确定结论分母 |
| 证据与 VETO | Step 10~11 | 确定硬阻断和证据完整性 |
| 缺陷 / 复验 | Step 12 | 确定 S/A/B/R 对结论的影响 |
| 风险接受 | Step 13 | 确定有条件通过的必要条件 |
| 三值规则 | `验收标准书写规范.md` §4.2、§5.14 | 固定合法结论和签署含义 |

## 4. SOP 问题回答

| 问题 | 回答 | 裁决依据 |
|---|---|---|
| 结论只能有哪些取值？ | 只能是“通过”“有条件通过”“不通过”。禁止“基本通过”“原则上通过”“大体没问题”等模糊表达。 | 书写规范 §4.2 |
| 何时允许进入下一阶段？ | 全部 P0 AC 真实通过、9 个 VF 均经证据判定未触发、S=0、hard evidence gate 完整；有条件进入只允许存在已接受的 eligible residual。 | Step 12~13 |
| 何时允许发布准备？ | 通过或有条件通过，且条件不影响 Host Truth、项目主语、required seam、安全、依赖、证据和 Query/Job no-truth-repair。 | Step 13；`00` VF |
| 哪些情况必须不通过？ | 任一 P0 AC 失败或 `not_evaluable`、VETO triggered / 无法核验、S 未关闭、redaction/dependency/report audit failed、证据伪造或必需 blocker 未闭合。 | Step 10~12 |
| 有条件通过需要什么？ | P0 主线全部真实通过、VETO 未触发、S=0、证据完整，且每个 residual / A 级项有 impact、reason、EV/report/defect、owner、acceptor、deadline/trigger 和 follow-up。 | Step 13 |
| 哪些角色必须签署？ | 至少 Owner / 业务负责人、架构负责人、测试负责人、实施负责人、运维 / 安全 / 合规负责人和验收负责人；按职责确认对应范围。 | 书写规范 §5.14 |
| 签署是否自动接受风险？ | 不自动。风险必须在 `reports/acceptance/risk-acceptance.md` 逐项由有权 acceptor 确认；最终签署只确认结论和已列风险。 | Step 13 |
| 上游 positive blocked 如何影响结论？ | 若明确不属于本轮 P0，则可作为 residual；若是 P0 必需前置或导致 evidence `not_evaluable`，不得通过或有条件通过。 | Step 4、Step 10、Step 13 |
| P1/P2 未完成能否阻断通过？ | 不必然。只要不影响 P0 且被明确列入 residual；不得把 P1/P2 unavailable 写成 P0 passed。 | Step 2、Step 13 |
| 是否需要真实执行结果才能在当前文件填写结论？ | 需要。当前设计阶段仅写判定矩阵和 `<final_decision>` 占位，不填写实际结果。 | `05` §13；VF-MS-009 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 `06` | 使用“待评审 / 基本通过”等模糊状态，未连接 VETO、缺陷和风险。 | 固定三值结论矩阵。 |
| Step 11 | VETO 命中与最终结论的关系未写成硬规则。 | VETO / S 只能“不通过”，不可风险接受。 |
| Step 12 | 缺陷关闭与放行关系分散。 | 统一 P0、VETO、S/A/B/R、evidence 的结论条件。 |
| Step 13 | 风险接受可能被理解为最终签署。 | 明确逐项 risk acceptance 与最终 signoff 分离。 |
| 当前设计阶段 | 真实 run / artifact / report 不存在。 | 只保留占位，不伪造 verdict 或 readiness。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 结论值 | 模糊 / 待评审 | 通过 / 有条件通过 / 不通过 | 可裁决 |
| evidence gap | 可能被当成风险 | P0 evidence gap 为 `not_evaluable`，阻断结论 | 保证证据诚实 |
| risk acceptance | 与 signoff 混合 | 独立文件、逐项 acceptor、期限和 follow-up | 责任清晰 |
| 当前状态 | 容易误填执行结果 | 设计合同完成、执行未开始、保留占位 | 不伪造事实 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否允许“基本通过”？ | A. 允许；B. 禁止 | 采用 B。 |
| VETO 是否可有条件通过？ | A. 可以；B. 不可以 | 采用 B。 |
| `not_evaluable` 是否可作为条件通过？ | A. 可以；B. P0 影响时不可以 | 采用 B。 |
| P1/P2 unavailable 是否自动不通过？ | A. 自动；B. 只在升级为 P0 或伪装通过时阻断 | 采用 B。 |
| 签署是否自动接受全部 residual？ | A. 是；B. 否，逐项 risk acceptance | 采用 B。 |
| 设计阶段能否填写“通过”？ | A. 可以；B. 只写规则和占位 | 采用 B。 |

## 8. 结构化中间产物

### 8.1 最终结论表

| 维度 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| P0 功能 AC-MS-001~039 | 全部有真实 `passed` 证据 | 全部有真实 `passed` 证据 | 任一 failed / partial / not_evaluable |
| P0 同步入口 | 10 Command、6 Query、5 Consumer、1 Material helper、7 Job 的必需切口有结论 | 同上，未纳入本轮的正向 sibling seam 已明示 residual | 缺入口、write boundary 失败或 evidence gap |
| VF / VETO | VF-MS-001~009 均由真实 evidence 判定未触发 | 同上 | 任一 triggered 或无法核验 |
| S 级缺陷 | 0 | 0 | >0 或未复验 |
| A 级缺陷 | 0 | 逐项接受且不影响硬边界 | 未接受或影响 P0 |
| B/R residual | 无或无影响 | 有 owner、acceptor、reason、action、deadline/trigger | 未记录、影响 P0 或伪装为 pass |
| evidence integrity | raw/report/index/audit 完整 | 同上 | 缺失、orphan、静态造证据、redaction/dependency/report audit failed |
| 结论 | 可进入下一阶段 / 发布准备 | 按条件进入，持续跟踪 | 修复、重新基线和复验 |

### 8.2 结论判定矩阵

| 条件 | 结果 |
|---|---|
| P0 AC 全通过；VETO 未触发；S=0；证据完整；无未接受 A | 通过 |
| P0 AC 全通过；VETO 未触发；S=0；证据完整；存在已接受且不影响硬边界的 A/B/R | 有条件通过 |
| 任一 P0 AC 失败或 `not_evaluable` | 不通过 / 暂停验收 |
| 任一 VETO triggered 或无法核验 | 不通过 |
| S 级未关闭 | 不通过 |
| redaction、dependency、report audit 或 evidence index failed | 不通过 |
| P1/P2 / sibling positive blocked，且已明确不属于本轮 P0、无伪装 | 可作为 residual；是否条件通过由其余条件决定 |
| 缺 acceptor、deadline/trigger 或 follow-up | 不得有条件通过 |

### 8.3 进入下一阶段 / 发布准备条件

| 目标 | 必须满足 | 禁止情况 |
|---|---|---|
| 进入实施下一阶段 | 06 规则完整；真实验收尚未执行也必须保持 `implementation_allowed` 由项目台账另行控制 | 以设计文档“通过”替代实现准备 |
| 进入发布准备 | 通过或有条件通过；P0 truth、安全、证据、依赖和配置 hard gate 全部满足 | VETO/S、P0 `not_evaluable`、必需 seam blocked |
| 正式上线 | 还需实施 / 部署 / 运维文档和真实 release evidence；06 不替代 runbook | 用 P1 residual、口头确认或 fake run 代替 |

### 8.4 签署表（真实验收时填写）

| 角色 | 责任范围 | 签署值 | 日期 |
|---|---|---|---|
| Owner / 业务负责人 | 确认目标、范围、业务影响和 residual | `<signoff>` | `<date>` |
| 架构负责人 | 确认 Host Truth owner、边界、依赖裁剪和 VETO | `<signoff>` | `<date>` |
| 测试负责人 | 确认 P0 suite、TC、EV、report、缺陷和复验 | `<signoff>` | `<date>` |
| 实施负责人 | 确认送验 commit、build、配置和实现范围 | `<signoff>` | `<date>` |
| 运维 / 安全 / 合规负责人 | 确认 redaction、dependency、retention、handoff 和合规 residual | `<signoff>` | `<date>` |
| 验收负责人 | 确认最终结论与 risk acceptance 一致 | `<signoff>` | `<date>` |

### 8.5 签署含义表

| 签署对象 | 表示 | 不表示 |
|---|---|---|
| 通过签署 | 本轮 P0 门禁和真实证据满足进入下一阶段条件 | 不代表 P1/P2/future 或外部产品已完成 |
| 有条件通过签署 | P0 主线成立，列明 residual 已逐项接受且有期限 / trigger | 不代表 VETO/S 或 evidence gap 可接受 |
| 不通过签署 | 存在阻断或证据不可裁决，需要修复 / 重基线 / 复验 | 不代表项目终止 |
| 风险接受签署 | 接受指定 residual 的影响和 follow-up | 不接受未列风险、VETO 或其他角色职责 |

### 8.6 最终结论停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 只使用三值结论 | 通过 | 禁止模糊结论 |
| VETO / S 不可条件通过 | 通过 | 命中只能不通过 |
| `not_evaluable` 不被当作未触发 | 通过 | P0 影响时暂停 / 不通过 |
| 风险接受有 acceptor / 期限 / follow-up | 通过（规则层） | 真实姓名 / 日期待执行填写 |
| 签署角色覆盖业务、架构、测试、实施、运维安全 | 通过 | 见 §8.4 |
| 当前未填写真实 verdict / signoff | 通过 | 设计期只保留占位 |

### 8.7 跨结论审计表

| 审计项 | 结论 | 后续要求 |
|---|---|---|
| P0 AC → EV/report | 已覆盖 | Step 15 装配时逐章保留来源 |
| VETO → evidence / defect | 已覆盖 | `veto-checklist.md` 不得默认 passed |
| defect → risk acceptance | 已覆盖 | S/VETO 不得进入 risk acceptance |
| risk acceptance → signoff | 已隔离 | 逐项 acceptor，不能由总签署隐式接受 |
| 当前设计结论 → 执行结果 | 已隔离 | 不能把 `pass_with_upstream_blockers` 误读为实际验收通过 |

## 9. 回填草稿

正式 §14 应固定三值结论：全部 P0 AC 真实通过、VETO 未触发、S=0、证据完整且无未接受 A 级缺陷时为“通过”；P0 主线满足且 residual / 受限 A 逐项有接受人、理由、期限和 follow-up 时为“有条件通过”；任一 P0 失败或 `not_evaluable`、VETO / S、证据硬门禁失败或必需 blocker 未闭合时为“不通过”。签署不自动接受风险，风险必须在 `reports/acceptance/risk-acceptance.md` 中逐项确认。当前设计阶段不填写真实结论、run、缺陷或日期。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实签署人姓名和日期 | 影响最终归档 | 执行时填写，当前保留占位 |
| 某次 release 是否允许有条件通过 | 影响发布准备 | 按 Step 13 逐项风险接受和本矩阵决定 |
| 外部合规签署是否必需 | 影响合规流程 | 当前保留运维 / 安全 / 合规角色，具体由组织规则确定 |
| 实施 / 部署阶段门禁 | 影响上线 | 由 `07-实施计划.md` 和运维 runbook 承接 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 三值结论和判定矩阵完整 | 通过 | 见 §8.1~§8.3 |
| 签署角色和含义完整 | 通过 | 见 §8.4~§8.5 |
| 风险接受与最终签署边界清楚 | 通过 | 见 §8.6~§8.7 |
| 未填写真实执行结果 | 通过 | 保持证据诚实 |
| 可进入 Step 15 | 允许 | 装配正式 `06-验收标准.md` |
