# Step 13. 定义风险接受与遗留项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填章节: `06-验收标准.md` §13 风险接受与遗留项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义风险接受与遗留项 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~12 已审核通过;新版 `05` residual risk;`reports/acceptance/risk-acceptance.md` 结构 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

定义哪些风险 / 遗留项可以支撑“有条件通过”,以及必须具备哪些接受理由、责任人、接受人、后续动作和截止时间。

本 Step 只定义:

- 可风险接受项、不可风险接受项和 residual 输入范围。
- 风险接受表的正式字段和最低信息要求。
- P1/P2 selected-run、真实产品、capacity、hard SLO、future capability 等 residual 的处理口径。
- `risk-acceptance.md`、`open-issues.md` 与 Step 12 缺陷分级 / Step 14 最终结论的关系。

本 Step 不实际签署风险,不填真实人名,不裁决最终结论,不把任何 S/VETO/P0 红线降级为风险。最终结论和签署留 Step 14。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_12_defects_release.md` | 已审核通过 | 提供 S/A/B、R residual 输入和风险接受进入条件 |
| `06_acceptance_step_11_blockers.md` | 已审核通过 | 提供 VETO 不可风险接受边界 |
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | 提供 `risk-acceptance.md`、`open-issues.md` 和 evidence integrity 阻断 |
| `05-测试方案.md` §2 / §11 / §12 / §14 | 正式输入 | 提供 P1/P2、residual、不可接受项和退出准则 |
| `05_test_plan_step_14_regression_risks.md` | 已审核通过 | 提供残余风险表、不可风险接受项和必须转入新版 `06` 的事项 |
| 验收 SOP Step 13 / 书写规范 §5.13 | 当前标准 | 提供风险接受表字段和“无接受人不得有条件通过”规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可以支持有条件通过? | 仅 A 级中已证明不影响 P0 truth / VETO / evidence 的主线风险、B 级非阻断问题、R 类 residual、P1/P2 selected-run unavailable、真实产品 adapter 深度行为、production-like capacity、hard SLO 未硬化、报告可读性问题等可以进入风险接受。 |
| 哪些风险不能接受? | S 级、`VETO-ID-001~006`、P0 truth 破坏、AC-ID-014 zero tolerance、redaction / dependency / evidence integrity fail、query write、job truth repair、stored replay rerun、config silent fallback、disabled adapter fake success、P0 suite 无证据失败均不能接受。 |
| 每个风险的接受人是谁? | 当前不填真实人名,但必须固定接受人角色:验收负责人、架构负责人、产品负责人、测试负责人、合规 / 安全负责人或对应能力 owner。没有接受人或接受人角色待定,不能支撑有条件通过。 |
| 后续动作和截止时间是什么? | 每项风险必须有后续动作、责任人、触发条件、截止时间或下一基线条件。若无法给出,不得作为有条件通过依据。 |
| 风险是否需要同步到实施计划或问题记录? | 是。A/B/R 风险都必须同步到 `reports/acceptance/risk-acceptance.md`、`reports/acceptance/open-issues.md` 或实施问题记录。涉及 future scope 或 P1/P2 升级的风险还必须回写后续测试 / 实施计划。 |
| 风险接受是否代表最终通过? | 否。风险接受只是 Step 14 “有条件通过”的输入。最终结论仍取决于全部 P0 门禁、证据、VETO、缺陷和签署。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05` §14 residual | 接受人多为角色待确认 | 本 Step 要求正式验收时必须填真实接受人或明确角色责任 |
| Step 12 | 已定义哪些可进入风险接受,但未给表结构 | 本 Step 固定风险接受字段 |
| Step 10 | `risk-acceptance.md` 只是支撑路径 | 本 Step 定义其内容要求和阻断关系 |
| 旧性能数字 | 可能被误认为 P0 阈值 | 本 Step 明确 hard SLO / 旧 P95 未硬化只能 residual |
| P1/P2 | 容易伪装成 P0 evidence | 本 Step 明确 selected-run unavailable 不计 P0 pass |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 风险接受 | 泛写“可接受” | 必须有影响、理由、动作、责任人、接受人、截止时间 | 可审计 |
| P0 红线 | 可能被 residual 覆盖 | 明确不可接受 | 保护 VETO / P0 |
| P1/P2 | 分散在测试方案 | 汇总为 residual 候选 | 支撑有条件通过 |
| 接受人 | 角色待确认 | 正式验收必须填接受人;待确认不能支持通过 | 符合书写规范 |
| 后续动作 | 未统一 | 每项必须有 action / trigger / deadline | 防止风险隐藏 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否允许角色待确认支撑有条件通过 | A. 允许;B. 不允许 | 采用 B。没有接受人的风险不能支撑有条件通过。 |
| 是否把 P1 selected-run unavailable 作为 P0 失败 | A. 是;B. 否,记录 residual | 采用 B。当前 P0 用 fake / controlled / replay 证明语义。 |
| 是否接受旧 P95 / SLA 未达 | A. 不接受;B. 在无正式阈值时作为 residual | 采用 B。阈值必须有来源。 |
| 是否允许 A 级缺陷直接风险接受 | A. 允许;B. 仅证明不影响 P0 且有替代 evidence 时允许 | 采用 B。保护 P0 裁决。 |
| 是否把风险接受等同最终结论 | A. 是;B. 否 | 采用 B。Step 14 才签署最终结论。 |

## 8. 结构化中间产物

### 8.1 风险接受表模板

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| `<risk-id or title>` | `<具体影响,必须说明是否影响 P0>` | `<为什么可接受,必须回指证据>` | `<修复、补测、基线或决策动作>` | `<执行 owner>` | `<接受人,不得为空>` | `<日期或下一基线触发条件>` |

字段规则:

- `风险 / 遗留项` 必须能回指 `open-issues.md`、缺陷记录、residual entry 或 evidence item。
- `影响` 必须说明是否影响 P0、是否关联 VETO、是否影响证据完整性。
- `接受理由` 必须引用 Step 12 的可接受条件,不得只写“后续处理”。
- `后续动作` 必须是可验证动作,例如补 P1 selected-run、建立 capacity baseline、修复报告文案、补真实 adapter smoke。
- `责任人` 是执行动作 owner;`接受人` 是承担验收风险的角色 / 人。
- `截止时间` 可以是日期、下一 release baseline、P1/P2 scope change 或正式 design reopen 条件,不得为空。

### 8.2 可风险接受项表

| 风险类别 | 可接受条件 | 需要的证据 / 记录 | 不得用于 |
|---|---|---|---|
| A 级未关闭缺陷 | 不命中 S/VETO;不影响 P0 truth / evidence;有替代 evidence | `open-issues.md`;affected suite artifact;替代 evidence;风险接受记录 | 绕过 P0 failure |
| B 级非阻断问题 | 不影响 P0 EV、VETO、redaction、dependency、evidence integrity | `open-issues.md`;review notes | 降级 S/A |
| P1 real-like selected-run unavailable | P0 fake/controlled/replay 已通过;selected-run 非 P0 | unavailable marker;residual entry;后续 selected-run plan | 证明 P0 pass |
| 真实 DB / bus / archive / metric / secret provider 产品行为未覆盖 | 产品未锁定;P0 port/adapter seam 已验证 | architecture / implementation follow-up | 替代 P0 repository/adapter semantics |
| external HR / IdP 深度集成未覆盖 | 当前非 P0,且不得反向定义 identity truth | product follow-up;integration plan | 改写 identity truth owner |
| production-like capacity 未覆盖 | 无正式容量模型;P0 有 duration/count sample | capacity baseline action | 声称满足 hard SLO |
| 旧 P95 / SLA 未硬化 | `00/05/09/12` 均不作为当前 P0 阈值 | sample/trend report;baseline decision action | 作为 pass/fail 阈值 |
| advanced employee homepage / dashboard / analytics 未覆盖 | 当前 P0 只证明基础 query/read model | product roadmap item | 替代 P0 query evidence |
| full event-sourcing-first 未覆盖 | 当前 design 使用 truth + trace + replay 口径 | architecture evolution note | 否定当前 accepted design |
| report 文案 / reviewer note 清晰度问题 | raw artifact、EV、gate、redaction 均完整 | review notes;open issue | 隐藏证据缺失 |

### 8.3 不可风险接受项表

| 不可接受项 | 来源 | 处理 |
|---|---|---|
| 任一 `VETO-ID-001~006` 命中 | Step 11 | 不通过;必须修复 |
| S 级缺陷未关闭 | Step 12 | 不通过;必须修复和复验 |
| P0 evidence index / raw artifact / report pairing 缺失 | Step 10 / Step 12 | 不通过;重新生成证据 |
| static evidence pass / static VETO pass | Step 10 | 不通过;修 report tooling |
| redaction / forbidden material leak | `VETO-ID-003`;Step 9/10 | 不通过;修复后复扫 |
| dependency boundary fail | `VETO-ID-006`;Step 9/10 | 不通过;修依赖后复扫 |
| query write / implicit create | `VETO-ID-002`;Step 6/8/12 | 不通过;修 query path |
| job truth repair / reconciliation repair truth | `VETO-ID-005` or Step 12 S | 不通过;修 job/report-only path |
| duplicate rerun mutation / stored replay reconstruction | Step 8/12 | 不通过;修 idempotency / stored replay |
| invalid config silent fallback / disabled adapter fake success | Step 9/12 | 不通过;修 config / runtime |
| P0 profile unavailable but marked passed | `05` §14.5 | 不通过;不得 fallback |
| accepted mutation lacks required trace/audit/outbox/stored result | Step 8/10/12 | 不通过;修 accepted flow |

### 8.4 当前 residual 候选表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| P1 real-like selected-run 不作为 P0 阻断 | 不能证明真实 adapter 端到端行为 | P0 已由 fake/controlled/replay 验证 formal semantics;P1 非当前 P0 | P1 环境可用后执行 selected-run 并归档 unavailable/结果 | 测试负责人 | 验收负责人待确认 | 下一次 P1 selected-run 基线 |
| 真实 DB / bus / archive / metric / secret provider 产品行为未覆盖 | 不能证明具体产品性能和故障模式 | 产品未锁定;P0 只验 port / adapter seam | 产品绑定后补 P1/P2 adapter smoke / failure tests | 架构负责人 | 架构负责人待确认 | 产品选型冻结后 |
| external HR / IdP 深度集成未覆盖 | 不能证明 vendor identity semantics | 外部身份系统非 P0 依赖,且不得定义 identity truth | 建立 P2 integration design and tests | 产品负责人 | 产品负责人待确认 | P2 scope baseline |
| production-like capacity 未覆盖 | 不能证明高并发 / 长时间运行容量 | 当前无容量模型;P0 只要求 duration/count sample | 建立容量模型和 capacity gate | 架构负责人 | 架构负责人待确认 | capacity baseline 创建时 |
| 旧 P95 / SLA 数字未硬化 | 不能按 numeric threshold 裁决 pass | `00/05/09/12` 均明确旧数字无来源 | 评审 sample/trend,决定是否硬化新阈值 | 验收负责人 | 验收负责人待确认 | 下一轮性能基线评审 |
| advanced employee homepage / dashboard / analytics 未覆盖 | 不能证明复杂消费体验 | 当前 P0 只证明基础 query/read model | 产品体验进入 P2 测试计划 | 产品负责人 | 产品负责人待确认 | P2 product milestone |
| full event-sourcing-first 未覆盖 | 不能证明全量事件溯源架构 | 当前 accepted design 为 truth + trace + replay | 若架构演进,重开 01/03/05/06 | 架构负责人 | 架构负责人待确认 | 架构演进决策时 |

### 8.5 有条件通过必要条件表

| 条件 | 必须满足 |
|---|---|
| P0 门禁 | Step 5~10 P0 门禁通过 |
| VETO | `VETO-ID-001~006` 均未触发 |
| S 级 | 无未关闭 S |
| A 级 | 未关闭 A 已证明不影响 P0,并有接受人、替代 evidence、后续复验动作 |
| B/R | 已记录影响、接受理由、责任人、接受人和截止时间 |
| 证据 | `risk-acceptance.md`、`open-issues.md`、review notes 与 `<run_id>` evidence 一致 |
| 红线 | 风险接受不得覆盖 redaction、dependency、evidence integrity、query no-write、job no-repair、stored replay、config fail-fast |

### 8.6 风险同步与复查规则

| 触发 | 同步位置 | 复查要求 |
|---|---|---|
| A 级风险接受 | `reports/acceptance/risk-acceptance.md`;`reports/acceptance/open-issues.md` | 下一次 release 或修复 run 必须复验 |
| B 级遗留 | `open-issues.md` 或项目问题记录 | 截止时间前关闭或升级 |
| R 类 residual | `risk-acceptance.md`;实施 / 产品 / 架构 backlog | scope 升级时重开验收门禁 |
| P1 selected-run unavailable | selected-run artifact / unavailable marker | 环境可用后执行 selected-run |
| 性能阈值硬化 | 新 baseline / `06` 修订 | 回写 Step 9 / Step 12 / Step 14 |
| 风险触发 P0 影响 | Step 5~12 相关门禁 | 立即升级 A/S 并阻断 |

### 8.7 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 风险接受表字段是否完整 | 通过 | 见 §8.1 |
| 可接受项是否限于 A/B/R / P1/P2 residual | 通过 | 见 §8.2 |
| 不可接受 P0 红线是否明确 | 通过 | 见 §8.3 |
| 当前 residual 是否列出接受人角色 | 通过 | 真实接受人待 Step 14 / actual handoff |
| 没有接受人是否可有条件通过 | 否 | 必须补齐 |
| 是否提前签署最终结论 | 否 | Step 14 处理 |

### 8.8 跨风险裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在可风险接受的 VETO | 否 | VETO 全部不可接受 |
| 是否存在可风险接受的 S 级 | 否 | S 全部不可接受 |
| 是否存在 P0 evidence/redaction/dependency 被 residual 覆盖 | 否 | 明确禁止 |
| P1/P2 是否未误作 P0 pass | 通过 | residual 不能证明 P0 |
| residual 是否都有后续动作 | 通过 | 见 §8.4 |
| residual 是否都有责任人 / 接受人角色 | 通过 | 待正式签署填真实人 |
| 是否满足“无接受人不得有条件通过” | 通过 | 已写入必要条件 |
| 是否提前给最终结论 | 否 | Step 14 处理 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 residual 候选来自正式 `05` | 否 | 风险接受细化 | 无需回写 |
| 接受人待确认不能支撑有条件通过 | 否 | 验收签署要求 | Step 14 处理 |
| P1/P2 selected-run 不计 P0 pass | 否 | 范围边界 | 与 Step 2 / 9 / 12 一致 |
| 若某 residual 升级为 P0 | 是 | 范围、测试、证据门禁变更 | 回写 Step 2/3/9/10/12 |
| 若新增硬性能阈值 | 是 | baseline 变更 | 回写 `00/05/06` 和测试 gate |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险接受表模板”“可风险接受项表”“不可风险接受项表”“当前 residual 候选表”“有条件通过必要条件表”和“跨风险裁决审计表”小节,了解哪些遗留项可以支持有条件通过,哪些红线必须阻断。

正式 `06-验收标准.md` §13 应回填:

- 风险接受必须包含风险 / 遗留项、影响、接受理由、后续动作、责任人、接受人和截止时间。
- 没有接受人或截止时间的风险不能支撑有条件通过。
- `VETO-ID-001~006`、S 级缺陷、P0 truth / redaction / dependency / evidence integrity / config / query no-write / job no-repair / stored replay 红线不得风险接受。
- P1/P2 selected-run、真实产品行为、production-like capacity、旧 P95/SLA 未硬化、advanced dashboard 和 full event-sourcing-first 可作为 residual,但不得作为 P0 pass 证据。
- Step 13 不给最终结论,只为 Step 14 提供有条件通过的风险接受输入。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 各 residual 的真实接受人姓名 | 影响有条件通过 | Step 14 / actual handoff 必须填写 |
| 风险接受截止日期是否按日期还是下一基线 | 影响跟踪 | 本 Step 允许二者,正式签署需固定 |
| A 级未关闭缺陷是否存在 | 影响最终结论 | Step 14 使用真实 `open-issues.md` 判定 |
| P1 selected-run 是否某 release 强制 | 影响 P0/P1 边界 | 当前非 P0;强制需回写 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 风险接受表模板完成 | 通过 | 见 §8.1 |
| 可风险接受项完成 | 通过 | 见 §8.2 |
| 不可风险接受项完成 | 通过 | 见 §8.3 |
| 当前 residual 候选表完成 | 通过 | 见 §8.4 |
| 有条件通过必要条件完成 | 通过 | 见 §8.5 |
| 跨风险裁决审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 未提前替代 Step 14 | 通过 | 最终结论和签署留 Step 14 |
| 可进入 Step 14 | 通过 | 用户已确认,进入 Step 14: 定义最终结论与签署口径 |
