# Step 13. 定义风险接受与遗留项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填章节: `06-验收标准.md` §13 风险接受与遗留项
> 创建日期: 2026-06-28
> 当前模式: full-restart / step13-risk-acceptance
> 当前状态: completed_wait_user_confirm_to_R14.1
> 当前模块: `R13.2 risk acceptance:再写入`
> 当前门禁: `R13.2` completed_wait_user_confirm_to_R14.1;等待确认进入 Step 14 `R14.1 final decision signoff:先思考`

---

## R13.1 risk acceptance:先思考

### 1. 当前模块目标

`R13.1` 只思考新版 `06-验收标准.md` 中风险接受与遗留项如何从 Step 9 非功能 residual、Step 10 证据门禁、Step 11 VETO、Step 12 缺陷放行规则和正式 `05-测试方案.md` §14 收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终风险接受表,不填写真实接受人、真实截止日期、真实 issue、真实 verdict 或 sign-off,不生成真实 `reports/acceptance/risk-acceptance.md`,不进入 Step 14。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.2 |
| 用户确认 | 已确认从 Step 12 completed 推进到 Step 13 `R13.1 risk acceptance:先思考`。 |
| 当前允许 | 思考可接受 residual、不可风险接受项、接受人字段、后续动作、截止条件、同步到实施计划 / issue / 运维文档的方向和 R13.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实 risk acceptance 状态;填写真实接受人;宣告有条件通过;补 artifact/report schema、CI、implementation boundary 或 `07-实施计划.md`。 |

### 2. 本模块输入承接

| 输入 | R13.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 13 | 哪些风险支持有条件通过、哪些不能接受、接受人、后续动作、截止时间和同步方向。 | 没有接受人仍允许有条件通过。 |
| 书写规范 §5.13 | 必须输出风险 / 遗留项、影响、接受理由、后续动作、责任人、接受人、截止时间。 | 写泛化风险列表但缺 owner / acceptor / deadline。 |
| Step 9 nonfunctional | sample/trend、P1/P2、capacity/SLO/dashboard/retention 等 residual 候选。 | 把无来源 P95/SLO 写成硬 fail 或硬 pass。 |
| Step 10 evidence | `reports/acceptance/risk-acceptance.md` 是有条件通过入口,但不能替代 raw artifact / suite report。 | 用 risk acceptance 覆盖 evidence integrity 缺失。 |
| Step 11 VETO | `VETO-ML-001~014` 不可风险接受。 | 将 VETO 写入 risk acceptance。 |
| Step 12 defects | S/VETO 不可接受;A 严格条件候选;B/R 可 residual。 | 批量接受 A 级缺陷或接受 S 级缺陷。 |
| `05-测试方案.md` §14.2 / §14.3 | residual risk 表与不可风险接受清单。 | 把待确认接受人当作真实签署。 |
| L1-governance Step 13 | framework_reference:参考风险接受表、不可接受项、文件字段和 stop-review 深度。 | 复制外部项目 ID、证据编号、领域对象或结论。 |

### 3. SOP Step 13 问题思考

| SOP 问题 | R13.1 初判 | R13.2 写入提醒 |
|---|---|---|
| 哪些风险可以支持有条件通过? | B/R residual、P1 selected-run unavailable、real-like / product adapter 未锁定、production-like capacity / long-run 未覆盖、performance hard threshold 未定义、advanced marketplace/dashboard/future capability、evidence retention 未固定等可作为候选,前提是不影响 P0 truth、VETO、S 级和 evidence integrity。 | R13.2 写风险接受候选表,但不填写真实接受人。 |
| 哪些风险不能接受? | `VETO-ML-*`、S 级缺陷、P0 truth / boundary / security / evidence integrity 破坏、redaction leak、dependency boundary failed、source-missing stop 被私补、query/job/observability 反写真相、P0 config silent fallback、artifact/report pairing 缺失不能接受。 | 写不可风险接受项表,并回指 Step 11/12。 |
| 每个风险的接受人是谁? | 当前只固定必填字段和角色方向;真实接受人由正式验收阶段 `reports/acceptance/risk-acceptance.md` 填写。缺接受人不得有条件通过。 | R13.2 写 `acceptor` 必填,不写真实姓名。 |
| 后续动作和截止时间是什么? | 每项 residual 必须有后续动作、owner、deadline_or_trigger 和 follow_up_ref。 | 可写字段要求和示例方向,不写真实日期。 |
| 风险是否需要同步到实施计划或问题记录? | 影响实现、测试、运维、产品或下一 release 的 residual 必须同步到 issue / implementation plan / ops doc / ADR 方向。 | 只写同步原则,不得修改 `07-实施计划.md`。 |

### 4. L1-governance Step 13 框架参考思考

L1-governance Step 13 可借鉴的是“可接受 residual 表 + 不可接受项 + risk acceptance 文件字段 + 停审记录”的结构。L3 采用该框架,但全部风险主语、VETO、证据和 residual 必须使用 method-library 当前口径。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 风险接受表 | L3 使用 `RISK-ML-*` 候选,覆盖 P1/P2、future、capacity、threshold、retention 等 residual。 | 复制外部项目风险 ID 或领域对象。 |
| 不可接受项 | L3 回指 `VETO-ML-*`、S 级和 P0 hard gate。 | 将 redaction/dependency/evidence integrity failure 写成可接受。 |
| 文件字段 | 固定 risk_id、impact、acceptance_reason、evidence_refs、owner、acceptor、deadline_or_trigger、follow_up_ref。 | 写无 owner / acceptor / deadline 的风险。 |
| 同步机制 | 风险需要进入 issue、实施计划或运维文档方向。 | 在本 Step 直接修改 `07-实施计划.md`。 |
| stop-review | 审计 residual 是否越权、是否缺接受人、是否覆盖 VETO。 | 默认风险已接受或默认有条件通过。 |

### 5. 可接受 residual 候选

| 候选 ID | 风险 / 遗留项 | 可接受前提 | 后续承接 |
|---|---|---|---|
| RISK-ML-001 | P1 real-like selected-run 不作为 P0 阻断 | P0 fake / controlled seam 已证明;selected-run 不计入 P0 passed。 | 产品 / 环境可用后补 selected-run。 |
| RISK-ML-002 | durable storage / bus / external resolver 产品行为未覆盖 | 当前 P0 只验 port / repository / seam 语义;产品选型未锁定。 | 产品基线确定后补 P1/P2 adapter tests。 |
| RISK-ML-003 | production-like capacity / long-run 未覆盖 | 当前无正式容量模型、负载模型和部署基线。 | 建立容量模型后补验收 gate。 |
| RISK-ML-004 | performance hard threshold 未定义 | 当前只有 sample/trend,无 P95/SLO 硬阈值来源。 | 基于 sample 建立 baseline 后决定是否升级。 |
| RISK-ML-005 | advanced package / marketplace / dashboard 未覆盖 | 当前为 peripheral / future,不阻断 core P0。 | 产品需求确定后另行验收。 |
| RISK-ML-006 | evidence retention period 未固定 | 当前只要求验收和复验期间可追溯。 | 运维标准定义保留周期和归档介质。 |
| RISK-ML-007 | B 级报告可读性或非阻断维护性问题 | raw artifact、report pairing、P0 断言完整。 | open issues / report review。 |
| RISK-ML-008 | 严格限制的 A 级缺陷候选 | 不触发 VETO/S、不破坏 P0 truth、证据完整、acceptor 和 deadline 明确。 | Step 13/14 逐项审查,不得批量接受。 |

### 6. 不可风险接受候选

| 不可接受项 | 来源 | R13.1 判断 |
|---|---|---|
| `VETO-ML-001~014` 任一命中 | Step 11 | 不得风险接受。 |
| S 级缺陷未关闭 | Step 12 | 不得有条件通过。 |
| truth 不归属本仓、下游替代定义、正式版本语义静默覆盖 | `00` §14.2;Step 11 | 核心红线,不可接受。 |
| source-missing stop 被私补 | `05` §14.3;Step 12 | 必须回 owning design source。 |
| query/job/observability 反写真相 | Step 8/10/11/12 | 破坏 truth boundary。 |
| raw body、secret、provider response 或 full sensitive ref 泄露 | Step 9/10/11/12 | 安全 / body-free 红线失败。 |
| non-core sibling compile dependency 或反向依赖 | Step 6/9/11/12 | 架构依赖红线失败。 |
| artifact/report pairing 缺失、`latest`、static evidence、orphan EV | Step 10/11/12 | evidence integrity 失败,验收不可裁决。 |
| P0 profile unavailable 却标记 passed | Step 4/9/11/12 | runtime/config 基线不可信。 |

### 7. Risk acceptance 文件结构思考

| 字段 | R13.1 判断 | R13.2 写入提醒 |
|---|---|---|
| risk_id | 必填,稳定编号,建议 `RISK-ML-*`。 | 不使用临时自然语言编号。 |
| scope | 必填,说明 P1/P2/future/operations/B/R/A-candidate。 | 不得写 P0 VETO / S。 |
| impact | 必填,说明对本轮验收、下一阶段或生产的影响。 | 不能只写“影响较小”。 |
| acceptance_reason | 必填,说明为什么不阻断 P0。 | 必须回指 P0 已证明范围。 |
| evidence_refs | 必填,引用 EV/report/defect/open issue,证明其为 residual。 | 不得替代 raw artifact。 |
| owner | 必填,负责后续动作。 | 不等同于 acceptor。 |
| acceptor | 必填,负责接受风险。 | 缺失则不得有条件通过。 |
| deadline_or_trigger | 必填,可以是日期或触发条件。 | 不得无限期。 |
| follow_up_ref | 必填,issue / implementation plan / ops doc / ADR 方向。 | 本 Step 不创建真实 issue。 |

### 8. 同步与裁决边界思考

| 同步对象 | 触发 | 当前处理 |
|---|---|---|
| `reports/acceptance/risk-acceptance.md` | 有条件通过或存在 residual。 | Step 13 固定字段和语义,不生成真实文件。 |
| `reports/acceptance/open-issues.md` | 未关闭 B/R、不可裁决项、后续闭口入口。 | Step 13 定义方向,不填真实 issue。 |
| `07-实施计划.md` | residual 影响实现、测试、CI、phase 或后续 release。 | 本 Step 只要求同步方向,不得修改实施计划。 |
| 运维标准 / runbook | capacity、retention、production-like、long-run、SLO。 | 作为后续 owner。 |
| ADR / design source | 风险升级为 P0 或发现设计闭口缺失。 | 必须回 owning source,不得由 risk acceptance 补口。 |

### 9. R13.2 写入策略思考

`R13.2 risk acceptance:再写入` 可以写入:

1. Step 13 模块状态、输入表和 SOP 问题回答。
2. 可接受 residual 表,使用 `RISK-ML-*` 候选。
3. 不可风险接受项表,回指 `VETO-ML-*`、S 级和 P0 hard gate。
4. risk acceptance 文件字段要求。
5. 同步到 issue / implementation plan / ops doc / ADR 的方向。
6. 风险接受停审记录、回填草稿、待确认事项和进入 Step 14 条件。

`R13.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. 真实接受人、真实截止日期、真实 issue、真实 risk status、真实有条件通过结论或 sign-off。
3. 将 VETO/S/P0 hard gate 写成可接受风险。
4. 修改 `07-实施计划.md`、CI YAML、script、implementation boundary 或代码。
5. 发明 artifact/report JSON schema、defect system schema 或机器 evidence 字段。

### 10. R13.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 13 R13.1 | pass |
| 是否读取 SOP Step 13、书写规范 §5.13、`05` §14、Step 10/11/12 和 L1-governance Step 13 框架 | pass |
| 是否形成 L3-local `RISK-ML-*` residual 候选 | pass |
| 是否明确 `VETO-ML-*` / S 级 / P0 hard gate 不可风险接受 | pass |
| 是否明确缺接受人不得有条件通过 | pass |
| 是否未写真实接受人、真实 risk status、真实 verdict、CI 或 implementation 内容 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.2 risk acceptance:再写入`;只允许写入风险接受表、不可风险接受项、risk acceptance 文件字段、同步方向、风险接受停审记录、回填草稿、待确认事项和进入 Step 14 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R13.2 risk acceptance:再写入

### 11. R13.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R14.1 |
| 用户确认 | 已确认从 Step 13 `R13.1 risk acceptance:先思考` 推进到 `R13.2 risk acceptance:再写入`。 |
| 当前写入 | SOP 问题回答、可接受 residual 表、不可风险接受项表、risk acceptance 文件字段、同步方向、风险接受停审记录、回填草稿、待确认事项和进入 Step 14 条件。 |
| 当前禁止 | 修改正式 `06`;写真实接受人、真实截止日期、真实 issue、真实 risk status、真实有条件通过结论、sign-off、CI、script、implementation boundary 或 `07-实施计划.md`。 |

### 12. R13.2 输入承接表

| 输入 | 当前承接 | 裁决 |
|---|---|---|
| SOP Step 13 | 固定风险接受表、不可接受边界、接受人、后续动作、截止时间和同步方向。 | 已承接。 |
| 书写规范 §5.13 | 风险接受必须包含影响、接受理由、后续动作、责任人、接受人和截止时间。 | 已承接。 |
| Step 10 evidence | 有条件通过必须能追溯到 `reports/acceptance/risk-acceptance.md`,但不得替代 raw artifact。 | 已承接。 |
| Step 11 VETO | `VETO-ML-*` 不可被 risk acceptance 覆盖。 | 已承接。 |
| Step 12 defects | S/VETO 不可接受;A 严格条件候选;B/R 可 residual。 | 已承接。 |
| `05-测试方案.md` §14 | 提供 residual risk 与不可风险接受项。 | 已转为验收风险接受结构。 |
| L1-governance Step 13 | 只参考表格密度、字段结构和停审方法。 | 未复制外部项目 ID 或领域事实。 |

### 13. SOP 问题回答

| SOP 问题 | R13.2 回答 |
|---|---|
| 哪些风险可以支持有条件通过? | 仅 B/R residual、P1 selected-run unavailable、真实产品 adapter 未锁定、production-like capacity / long-run 未覆盖、performance hard threshold 未定义、future / peripheral capability、evidence retention 未固定和经逐项审查的 A 级候选可支持有条件通过。前提是 P0 truth 成立、VETO 未触发、S=0、evidence integrity 完整。 |
| 哪些风险不能接受? | `VETO-ML-001~014`、S 级缺陷、P0 truth / boundary / security / evidence integrity 破坏、redaction leak、dependency boundary failed、source-missing stop 被私补、query/job/observability 反写真相、P0 config silent fallback、artifact/report pairing 缺失、`latest` 正式引用和 static evidence 伪 pass 均不可接受。 |
| 每个风险的接受人是谁? | 本 Step 只固定 `acceptor` 为必填字段和角色方向;真实接受人在正式验收阶段的 `reports/acceptance/risk-acceptance.md` 中填写。缺接受人时,该风险不得支撑有条件通过。 |
| 后续动作和截止时间是什么? | 每个 residual 必须写 `follow_up_action`、`owner`、`deadline_or_trigger` 和 `follow_up_ref`;不得无限期搁置。 |
| 风险是否需要同步到实施计划或问题记录? | 是。影响实现、测试、运维、产品或下一 release 的 residual 必须同步到 issue / implementation plan / ops doc / ADR 方向;本 Step 只固定同步要求,不修改下游文件。 |

### 14. 风险接受表

| 风险 ID | 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|---|
| RISK-ML-001 | P1 real-like selected-run 不作为 P0 阻断 | 不能证明真实 adapter / 外部产品端到端行为。 | P0 已由 fake / controlled seam 证明;selected-run 不计入 P0 passed。 | 产品 / 环境可用后执行 selected-run,结果进入下一轮验收。 | 测试负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ML-002 | durable storage / bus / external resolver 产品行为未覆盖 | 不能证明具体产品性能、故障模式和部署差异。 | 当前 P0 只验 port / repository / seam 语义;产品选型未锁定。 | 产品基线确定后补 P1/P2 adapter and failure tests。 | 架构负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ML-003 | production-like capacity / long-run 未覆盖 | 不能证明长时间运行、容量和负载稳定性。 | 当前无正式容量模型、负载模型和部署基线。 | 建立容量模型、profile 和 runbook 后补验收 gate。 | 运维负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ML-004 | performance hard threshold 未定义 | 不能按 P95/SLO numeric threshold 裁决。 | 当前只有 sample/trend,无硬阈值来源。 | 基于 sample 建立 performance baseline 后决定是否升级为硬门禁。 | 测试负责人待填 | 产品负责人待填 | `<date-or-trigger>` |
| RISK-ML-005 | advanced package / marketplace / dashboard 未覆盖 | 不能证明 peripheral / future 能力。 | 当前不属于 core P0 闭环前置。 | 产品需求确定后回写设计、测试和验收范围。 | 产品负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ML-006 | evidence retention period 未固定 | 不能证明长期审计保留策略。 | 当前只要求验收和复验期间可追溯。 | 运维标准定义保留周期、归档介质和清理策略。 | 运维负责人待填 | 合规负责人待填 | `<date-or-trigger>` |
| RISK-ML-007 | B 级报告可读性或非阻断维护性问题 | 可能影响审阅效率,不影响 P0 artifact/report truth。 | raw artifact、report pairing 和 P0 断言完整。 | 进入 open issues 或 report review backlog。 | 工具负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| RISK-ML-008 | 严格限制的 A 级缺陷候选 | 可能影响主线体验或证明效率。 | 不触发 VETO/S、不破坏 P0 truth、证据完整,且逐项接受。 | 修复计划、复验范围和升级触发条件必须记录。 | 缺陷 owner 待填 | 验收负责人待填 | `<date-or-trigger>` |

### 15. 不可风险接受项

| 项 | 来源 | 禁止原因 |
|---|---|---|
| `VETO-ML-001~014` 任一命中 | Step 11 | 一票否决项不得被接受覆盖。 |
| S 级缺陷未关闭 | Step 12 | 破坏 P0 truth、安全、证据或架构红线。 |
| truth 不归属本仓、下游替代定义、正式版本语义静默覆盖 | `00` §14.2;Step 11 | 核心闭环和 Definition vs Use 不成立。 |
| source-missing stop 被实现、测试、fixture 或报告私补 | `05` §14.3;Step 12 | 必须回 owning design source 闭口。 |
| query/job/observability 反写真相 | Step 8/10/11/12 | 破坏 truth boundary 和 no truth repair。 |
| raw body、secret、provider response 或 full sensitive ref 泄露 | Step 9/10/11/12 | body-free / security 红线失败。 |
| non-core sibling compile dependency 或反向依赖 | Step 6/9/11/12 | 架构依赖红线失败。 |
| artifact/report pairing 缺失、`latest`、static evidence、orphan EV | Step 10/11/12 | evidence integrity 失败,验收不可裁决。 |
| P0 profile unavailable 却标记 passed | Step 4/9/11/12 | runtime/config 基线不可信。 |
| `reports/acceptance/risk-acceptance.md` 缺接受人 | 书写规范 §5.13 | 无接受人的风险不得支撑有条件通过。 |

### 16. Risk acceptance 文件字段要求

| 字段 | 必填 | 说明 | 缺失影响 |
|---|---|---|---|
| `risk_id` | 是 | 稳定 ID,建议 `RISK-ML-*`。 | 不得作为正式 residual。 |
| `scope` | 是 | P1/P2/future/operations/B/R/A-candidate。 | 无法判断是否越权。 |
| `impact` | 是 | 对本轮验收、下一阶段或生产的影响。 | 无法评估有条件通过风险。 |
| `acceptance_reason` | 是 | 为什么不阻断 P0。 | 不得有条件通过。 |
| `evidence_refs` | 是 | EV/report/defect/open issue,证明其为 residual。 | 不得替代或跳过 raw artifact。 |
| `owner` | 是 | 后续动作责任人。 | 风险不可闭环。 |
| `acceptor` | 是 | 风险接受人。 | 不得作为有条件通过依据。 |
| `deadline_or_trigger` | 是 | 日期或触发条件。 | 不得无限期接受。 |
| `follow_up_action` | 是 | 后续处理动作。 | 不得关闭风险。 |
| `follow_up_ref` | 是 | issue / implementation plan / ops doc / ADR 方向。 | 无法跨文档闭环。 |

### 17. 同步方向表

| 同步对象 | 触发 | 必须记录 |
|---|---|---|
| `reports/acceptance/risk-acceptance.md` | 有条件通过或存在 accepted residual。 | risk_id、impact、reason、evidence_refs、owner、acceptor、deadline_or_trigger、follow_up_ref。 |
| `reports/acceptance/open-issues.md` | 未关闭 B/R、不可裁决项或后续闭口入口。 | issue summary、severity、owner、next action。 |
| `07-实施计划.md` | residual 影响实现、测试、CI、phase 或后续 release。 | 同步方向和 follow-up ref;本 Step 不直接修改。 |
| 运维标准 / runbook | capacity、retention、production-like、long-run、SLO。 | 运维 owner、触发条件、验收补充方向。 |
| ADR / design source | 风险升级为 P0 或发现设计闭口缺失。 | 回 owning source;不得由 risk acceptance 补口。 |

### 18. 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 可接受 residual 是否限定在 B/R、P1/P2、future 或严格 A 候选 | 通过 | 不影响 P0 truth、VETO、S 级和 evidence integrity。 |
| 不可接受项是否覆盖 VETO/S/P0 hard gate | 通过 | `VETO-ML-*`、S、redaction、dependency、evidence integrity、config silent fallback 均禁止。 |
| 是否要求接受人 | 通过 | `acceptor` 必填,缺失不得有条件通过。 |
| 是否要求后续动作和截止 | 通过 | `follow_up_action`、`deadline_or_trigger`、`follow_up_ref` 必填。 |
| 是否防止 risk acceptance 替代 raw artifact / report | 通过 | `evidence_refs` 只能引用证据,不能替代证据。 |
| 是否未写真实接受状态 | 通过 | 当前只定义结构和裁决口径。 |

### 19. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险接受表”“不可风险接受项”“Risk acceptance 文件字段要求”“同步方向表”和“风险接受停审记录”小节,了解有条件通过所需的 residual 结构和不可接受边界。

正式 `06-验收标准.md` §13 应回填:

- 风险接受只适用于 B/R residual、P1/P2 selected-run unavailable、future capability、无硬阈值 sample/trend、evidence retention 未固定或经逐项审查的 A 级候选。
- `VETO-ML-*`、S 级缺陷、redaction leak、dependency boundary failed、evidence integrity failure、source-missing stop 被私补、query/job/observability 反写真相和 P0 config silent fallback 不得风险接受。
- `reports/acceptance/risk-acceptance.md` 必须包含 `risk_id`、`scope`、`impact`、`acceptance_reason`、`evidence_refs`、`owner`、`acceptor`、`deadline_or_trigger`、`follow_up_action` 和 `follow_up_ref`。
- 缺接受人、缺后续动作、缺截止条件或缺证据引用的风险不能作为有条件通过依据。
- 影响实现、测试、运维或下一 release 的 residual 必须同步到 issue / implementation plan / ops doc / ADR 方向。

### 20. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实接受人名单 | 影响有条件通过 | 正式验收时在 `reports/acceptance/risk-acceptance.md` 填写,本 Step 不假填。 |
| evidence retention 具体天数 | 影响合规 / 运维 | 当前作为 `RISK-ML-006`;后续进入运维标准或验收补充。 |
| 哪些 A 级缺陷可接受 | 影响放行 | 必须逐项审查,不得批量接受。 |
| residual 是否进入 `07-实施计划.md` | 影响实施闭环 | 本 Step 只固定同步方向;`07` 重启时承接。 |

### 21. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| SOP Step 13 问题已回答 | 通过 | 见 §13。 |
| 所有 residual 都有处理口径 | 通过 | 见 §14 / §17。 |
| 不可接受风险已明确 | 通过 | 见 §15。 |
| 风险接受结构完整 | 通过 | 见 §16。 |
| 缺接受人不得有条件通过 | 通过 | 见 §15 / §16。 |
| 可进入 Step 14 | 通过 | 下一步定义最终结论与签署口径;进入前等待用户确认。 |

### 22. R13.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 13 R13.2 | pass |
| 是否完成 SOP Step 13 期望产出 | pass |
| 是否输出风险接受表 | pass |
| 是否明确不可风险接受项 | pass |
| 是否要求接受人、后续动作、截止条件和 follow-up ref | pass |
| 是否防止 risk acceptance 覆盖 VETO/S/P0 hard gate | pass |
| 是否未写真实接受人、真实 risk status、真实 verdict、CI 或 implementation boundary | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.1 final decision signoff:先思考`;只允许思考最终结论三值口径、签署前置、签署角色、签署不代表风险接受、最终裁决审计和 R14.2 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
