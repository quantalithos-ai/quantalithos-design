# Step 11. 定义一票否决项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节: `06-验收标准.md` §11 一票否决项
> 创建日期: 2026-06-28
> 当前模式: full-restart / step11-veto
> 当前状态: completed_wait_user_confirm_to_R12.1
> 当前模块: `R11.2 veto:再写入`
> 当前门禁: `R11.2` completed_wait_user_confirm_to_R12.1;等待确认进入 Step 12 `R12.1 defects retest release:先思考`

---

## R11.1 veto:先思考

### 1. 当前模块目标

`R11.1` 只思考新版 `06-验收标准.md` 的一票否决项如何从正式 `00` §14.2、Step 2 潜在 VETO、Step 4 进出准则、Step 6~10 已确认门禁和 SOP Step 11 收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终一票否决项表,不填写真实 VETO 结果,不默认 passed,不替代 `reports/acceptance/veto-checklist.md`,不裁决 Step 12 缺陷分级、Step 13 风险接受或 Step 14 最终签署。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.2 |
| 用户确认 | 已确认从 Step 10 completed 推进到 Step 11 `R11.1 veto:先思考`。 |
| 当前允许 | 思考 VETO 来源、候选项、证据依赖、不可风险接受边界、P1/P2 非 VETO、跨 VETO 审计和 R11.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写最终 VETO 表;写真实 checklist 结果;新增需求红线;补 artifact schema / report schema / CI / implementation boundary。 |

### 2. 本模块输入承接

| 输入 | R11.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 11 | 哪些失败直接导致不通过、来源是什么、如何检查、是否允许风险接受、是否覆盖所有 P0 红线。 | 把普通 A/B/R 缺陷或 P1 residual 扩大成 VETO。 |
| 书写规范 §5.11 | VETO 必须来自需求红线、架构红线、详细设计关键不变量或安全/合规要求,失败时总体不通过。 | 无来源新增否决项或只写“严重问题”。 |
| `00-需求文档.md` §14.2 | 9 条需求层一票否决项。 | 恢复旧 MethodContent / publish / snapshot / outbox 否决主语。 |
| Step 2 scope | 潜在 VETO 来源:truth 归属、下游替代、正式语义静默覆盖、未正式资产消费、相邻仓 truth ingress、source-missing patch、query/job/observability write truth、raw leak、dependency/evidence/config 伪 pass。 | 在 Step 11 改写 P0/P1/P2 范围。 |
| Step 4 entry / exit | S 级、VETO、evidence integrity、redaction/dependency/report audit 不可风险接受。 | 用条件通过覆盖 VETO。 |
| Step 6~8 | 数据边界、架构红线、接口同步、状态/事务一致性已形成 P0 红线候选。 | 重新定义 AC 或新增测试用例。 |
| Step 9 | redaction、dependency、config、truth repair、evidence integrity 等失败裁决。 | 把无来源 P95/SLO/capacity 写成 VETO。 |
| Step 10 | VETO checklist、EV/report 追溯、no latest、no static evidence、artifact/report pairing。 | 在 Step 11 发明机器 artifact 字段。 |
| `05-测试方案.md` §11 / §14 | S 级缺陷与不可风险接受项。 | 把缺陷系统字段、复验命令或真实执行结果写入 VETO。 |
| L1-governance Step 11 | framework_reference:参考 VETO 表、闭环矩阵、停审和跨 VETO 审计深度。 | 复制 governance ID、EV 编号或治理领域事实。 |

### 3. SOP Step 11 问题思考

| SOP 问题 | R11.1 初判 | R11.2 写入提醒 |
|---|---|---|
| 哪些失败会直接导致不通过? | 需求层 truth / formal version / downstream replacement / unstable formal consumption / foreign body ingress / traceability break / source dependency ownership / peripheral prerequisite / observability-as-truth 均应进入 VETO 候选;证据、redaction、dependency、config 伪 pass 也应作为验收过程 VETO 候选。 | R11.2 固定 `VETO-ML-*` 表,并保持每项可检查。 |
| 否决项来自哪个需求或设计红线? | 主要来自 `00` §14.2、`01` truth owner / dependency direction、`03` no truth repair / body-free / observability boundary、`04` config fail-fast、`05`不可风险接受、Step 6~10 门禁。 | 每个 VETO 必须写红线来源,不能只写风险描述。 |
| 否决项如何检查? | 通过 `EV-ML-*`、fixed report path、redaction/dependency/report audit、veto checklist 和 defect state direction。 | 不填写真实 checklist status。 |
| 否决项是否允许风险接受? | 不允许。命中 VETO 时总体结论只能是不通过或暂停验收,不能有条件通过。 | Step 13 只能承接非 VETO residual。 |
| 否决项是否覆盖所有 P0 红线? | 需要覆盖需求 9 条、Step 2 潜在 VETO、Step 4 不可接受、Step 9/10 硬门禁。 | R11.2 做覆盖矩阵。 |
| 每个 VETO 能否回指红线、检查证据和 report path? | R11.1 初判可以;证据依赖主要来自 `EV-ML-CONTRACT/SERVICE/INFRA/ENTRY/REPLAY/CONFIG/DEPENDENCY/REDACTION/OBSERVABILITY/REPORT/RELEASE-*`。 | R11.2 写 report path,不写 artifact schema。 |
| 每个 VETO 完成后是否通过停审? | R11.2 需要逐项停审:来源正式、证据固定、不可风险接受、检查可执行。 | 本模块只设计停审项。 |
| 是否存在 P0 红线未覆盖、VETO 与风险接受冲突或检查方式不可执行? | 当前未发现必须回上游补口的缺口;但需防止 P1 selected-run unavailable、旧 P95 未达、retention 未固定被误设 VETO。 | R11.2 写跨 VETO 审计。 |

### 4. L1-governance Step 11 框架参考思考

L1-governance Step 11 的可借鉴点是“正式需求 VETO + 验收过程硬红线”的双层结构。L3 采用框架,但所有 ID、红线、证据和 report path 必须使用 method-library 语义。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| VETO 表 | L3 使用 `VETO-ML-*`,覆盖需求 §14.2 与证据/配置过程红线。 | 复制 governance ID。 |
| VETO 闭环矩阵 | 每个 VETO 写红线来源、检查证据、report path、触发裁决。 | 只写“严重问题不通过”。 |
| 验收过程 VETO | evidence integrity、redaction/dependency hard gate、config silent fallback 作为过程硬红线候选。 | 把 P1 unavailable 或无来源性能阈值设成 VETO。 |
| 停审记录 | 每个 VETO 检查来源、证据、不可风险接受和重复覆盖。 | 直接默认 VETO passed。 |
| 跨 VETO 审计 | 查 P0 红线未覆盖、重复、风险接受冲突、证据不可执行。 | 把冲突留给 Step 13。 |

### 5. VETO 候选池思考

| 候选 ID | 候选否决项 | 来源 | 证据 / 检查候选 |
|---|---|---|---|
| VETO-ML-001 | 方法资产定义真相不能明确归属本仓 | `00` §14.2;`01` truth owner;Step 6 | `EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001`;contract / dependency reports |
| VETO-ML-002 | 方法资产正式版本语义被静默覆盖 | `00` §14.2;FR/BR formal version;Step 5 / 8 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001`;contract / service reports |
| VETO-ML-003 | 下游消费仓创建、修改或替代方法资产定义真相 | `00` §14.2;Step 2 / 6 / 7 | `EV-ML-SERVICE-001`;`EV-ML-DEPENDENCY-001`;service / dependency reports |
| VETO-ML-004 | 未正式化或不稳定的方法资产作为正式消费依据 | `00` §14.2;FR-ML-003~005;Step 5 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| VETO-ML-005 | process/identity/governance/capability-hub/marketplace/UI/artifact/archive/auth 正文进入本仓真相范围 | `00` §14.2;`01` data ownership;Step 6 | `EV-ML-REDACTION-001`;`EV-ML-DEPENDENCY-001`;redaction / dependency reports |
| VETO-ML-006 | 正式化、版本语义变化、消费影响变化或证据线索不可追溯 | `00` §14.2;FR-ML-007~009;Step 8 / 10 | `EV-ML-ENTRY-001`;`EV-ML-REPLAY-001`;`EV-ML-REPORT-001` |
| VETO-ML-007 | 运行期依赖或事件协作依赖被写成本仓与消费仓源码级拥有关系 | `00` §14.2;BR-ML dependency;Step 6 / 7 | `EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| VETO-ML-008 | 外围增强能力被作为核心闭环成立前置 | `00` §14.2;Step 2 P0/P1/P2;Step 9 | `EV-ML-RELEASE-001`;`EV-ML-RISK-001`;gate summary / risk report direction |
| VETO-ML-009 | 可观测材料被作为方法资产定义真相替代存储 | `00` §14.2;`03` §14;Step 10 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REPORT-001` |
| VETO-ML-010 | source-missing stop 被私补、query/job/observability 反写真相 | Step 2;Step 8;Step 9 | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001`;`EV-ML-OBSERVABILITY-001` |
| VETO-ML-011 | raw body、secret、provider response、full sensitive ref 泄露 | Step 9;Step 10;`05` §14.3 | `EV-ML-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` |
| VETO-ML-012 | non-core sibling compile dependency 或反向依赖进入本仓 | Step 6;Step 9;`05` §14.3 | `EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| VETO-ML-013 | evidence index / report / VETO checklist 由静态 JSON、手写表、`latest` 或默认 passed 伪造 | Step 3;Step 10;`05` §14.3 | `EV-ML-REPORT-001`;`reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md` |
| VETO-ML-014 | invalid P0 config silent fallback、partial facade 或 P0 profile unavailable marked passed | Step 4;Step 9;`04` config redline | `EV-ML-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` |

### 6. 非 VETO 边界思考

| 项 | R11.1 判断 | 后续承接 |
|---|---|---|
| P1 selected-run unavailable | 不作为 VETO,但不得伪装成 P0 pass。 | Step 13 residual / risk acceptance。 |
| production-like capacity / long-run 未覆盖 | 当前无容量模型和部署基线,不作为 VETO。 | Step 13 residual。 |
| 性能 sample 高于旧 P95/SLO 候选 | 当前无硬阈值来源,不作为 VETO。 | Step 9/13 trend risk。 |
| evidence retention 天数未固定 | 不作为当前 VETO。 | Step 13 residual 或后续运维标准。 |
| marketplace / console / SDK 深层行为未覆盖 | peripheral / future,不作为 core P0 VETO。 | Step 13 residual。 |
| acceptance review 签署人未最终固定 | 不作为 VETO,但 Step 14 必须闭口。 | Step 14 sign-off。 |

### 7. R11.2 写入策略思考

`R11.2 veto:再写入` 可以写入:

1. Step 11 模块状态、输入表和 SOP 问题回答。
2. 一票否决项表,使用 `VETO-ML-*`。
3. VETO 闭环矩阵:红线来源、检查证据、report path、触发后裁决。
4. 非 VETO 边界表:明确 P1 selected-run、capacity、旧 P95、retention 等不作为 VETO。
5. 一票否决项停审记录。
6. 跨 VETO 覆盖审计表。
7. 回填草稿、待确认事项和进入 Step 12 条件。

`R11.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. 真实 VETO checklist status、真实 defects、真实 run_id、验收 verdict 或 release sign-off。
3. 新增需求红线、修改 P0/P1/P2 范围或改写 Step 5~10 的 AC / EV / suite。
4. artifact/report JSON schema、CI YAML、脚本实现、implementation boundary 或 `07-实施计划.md`。
5. 把 P1 unavailable、无来源 P95/SLO/capacity、retention 未固定或 peripheral 未覆盖误写成 VETO。

### 8. R11.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 11 R11.1 | pass |
| 是否读取 SOP Step 11、书写规范、`00` §14.2、Step 2/4/9/10 和 L1-governance Step 11 框架 | pass |
| 是否形成 L3-local `VETO-ML-*` 候选池 | pass |
| 是否区分需求层 VETO 与验收过程 VETO | pass |
| 是否明确非 VETO 边界,避免 P1/P2 或无来源阈值污染 | pass |
| 是否未写最终 VETO 表、真实 checklist 状态、真实 verdict 或 implementation 内容 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.2 veto:再写入`;只允许写入一票否决项表、VETO 闭环矩阵、非 VETO 边界表、停审记录、跨 VETO 覆盖审计、回填草稿、待确认事项和进入 Step 12 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R11.2 veto:再写入

### 9. R11.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R12.1 |
| 用户确认 | 已确认从 Step 11 `R11.1 veto:先思考` 推进到 `R11.2 veto:再写入`。 |
| 当前写入 | SOP 问题回答、一票否决项表、VETO 闭环矩阵、非 VETO 边界表、一票否决项停审记录、跨 VETO 覆盖审计、回填草稿、待确认事项和进入 Step 12 条件。 |
| 当前禁止 | 修改正式 `06`;写真实 VETO checklist status、真实 defects、真实 run_id、验收 verdict、release sign-off、CI、script、implementation boundary 或 `07-实施计划.md`。 |

### 10. SOP 问题回答

| SOP 问题 | R11.2 回答 |
|---|---|
| 哪些失败会直接导致不通过? | 方法资产定义真相不归属本仓、正式版本语义静默覆盖、下游替代定义真相、未正式/不稳定资产被正式消费、边界外正文进入本仓、正式化/版本/消费影响/证据线索不可追溯、运行期协作被写成源码级拥有关系、外围增强成为核心前置、observability 替代 truth、source-missing / query / job / observability 反写真相、redaction leak、non-core sibling compile dependency、evidence 伪造和 P0 config silent fallback 均直接导致不通过。 |
| 否决项来自哪个需求或设计红线? | 来源包括 `00` §14.2、`01` truth owner / data ownership / dependency direction、`03` no truth repair / body-free / observability boundary、`04` config fail-fast、`05` §14.3 不可风险接受项和 Step 2/4/6/7/8/9/10 的已确认门禁。 |
| 否决项如何检查? | 通过 `EV-ML-*`、fixed report path、redaction/dependency/report audit、`reports/acceptance/veto-checklist.md` 和 defect state direction 检查;本 Step 不填写真实状态。 |
| 否决项是否允许风险接受? | 不允许。任一 VETO 命中时最终结论不得为“通过”或“有条件通过”;只能不通过或暂停验收。 |
| 否决项是否覆盖所有 P0 红线? | 覆盖需求 §14.2 的 9 条否决项,并补充 source-missing / no truth repair、redaction、dependency、evidence integrity 和 config fail-fast 等验收过程红线。 |
| 每个 VETO 能否回指需求 / 架构 / 详细设计红线、检查证据和 report path? | 可以。见 §12 VETO 闭环矩阵。 |
| 每个 VETO 完成后是否通过停审? | 已按来源正式性、证据固定性、不可风险接受、检查可执行和 P1/P2 污染风险停审。见 §14。 |
| 是否存在 P0 红线未覆盖、VETO 与风险接受冲突或检查方式不可执行? | 未发现 unresolved 冲突。Step 13 必须继续保留 VETO 不可风险接受约束。 |

### 11. 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-ML-001 | 方法资产定义真相不能明确归属本仓 | 命中 `00` §14.2 和 truth owner 红线,核心闭环不成立。 | `EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001`;contract-domain / dependency-boundary reports。 |
| VETO-ML-002 | 方法资产正式版本语义被静默覆盖 | 正式版本稳定边界被破坏,消费方无法信任正式语义。 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001`;contract-domain / service-flow reports。 |
| VETO-ML-003 | 下游消费仓创建、修改或替代方法资产定义真相 | 破坏 Definition vs Use 和本仓 truth ownership。 | `EV-ML-SERVICE-001`;`EV-ML-DEPENDENCY-001`;service-flow / dependency-boundary reports。 |
| VETO-ML-004 | 未正式化或不稳定的方法资产作为正式消费依据 | 破坏正式/非正式区分和受控消费前提。 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001`;evidence index。 |
| VETO-ML-005 | process/identity/governance/capability-hub/marketplace/UI/artifact/archive/auth 正文进入本仓真相范围 | 边界外正文进入本仓会形成第二真相源或越权所有权。 | `EV-ML-REDACTION-001`;`EV-ML-DEPENDENCY-001`;redaction-check / dependency-boundary reports。 |
| VETO-ML-006 | 正式化、版本语义变化、消费影响变化或证据线索不可追溯 | 追溯链断裂时无法审计正式版本与消费影响。 | `EV-ML-ENTRY-001`;`EV-ML-REPLAY-001`;`EV-ML-REPORT-001`;entry / replay / report-audit reports。 |
| VETO-ML-007 | 运行期依赖或事件协作依赖被写成本仓与消费仓源码级拥有关系 | 把 runtime/event collaboration 误写为 compile ownership,破坏依赖裁剪。 | `EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/dependency-boundary.md`。 |
| VETO-ML-008 | 外围增强能力被作为核心闭环成立前置 | peripheral/future 能力阻塞 core P0,破坏范围裁决。 | `EV-ML-RELEASE-001`;`EV-ML-RISK-001`;gate-summary / risk-acceptance direction。 |
| VETO-ML-009 | 可观测材料被作为方法资产定义真相替代存储 | Observability 只能诊断和追溯,不能成为 truth / recovery source。 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REPORT-001`;observability-boundary / report-audit reports。 |
| VETO-ML-010 | source-missing stop 被私补、query/job/observability 反写真相 | 违反 no truth repair、query no-write 和 source-missing stop。 | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001`;`EV-ML-OBSERVABILITY-001`;service / replay / observability reports。 |
| VETO-ML-011 | raw body、secret、provider response 或 full sensitive ref 泄露 | 安全与 body-free 红线失败,不得风险接受。 | `EV-ML-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md`。 |
| VETO-ML-012 | non-core sibling compile dependency 或反向依赖进入本仓 | 架构依赖红线失败。 | `EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/dependency-boundary.md`。 |
| VETO-ML-013 | evidence index / report / VETO checklist 由静态 JSON、手写表、`latest` 或默认 passed 伪造 | 证据不真实时验收裁决本身不成立。 | `EV-ML-REPORT-001`;`reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md`。 |
| VETO-ML-014 | invalid P0 config silent fallback、partial facade 或 P0 profile unavailable marked passed | 配置绕过设计不变量和 profile isolation。 | `EV-ML-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md`。 |

### 12. VETO 闭环矩阵

| 否决项 ID | 红线来源 | 检查证据 | report path | 触发后裁决 |
|---|---|---|---|---|
| VETO-ML-001 | `00` §14.2;`01` truth owner;Step 6 | `EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001` | contract-domain / dependency reports | 不通过 |
| VETO-ML-002 | `00` §14.2;FR/BR formal version;Step 5/8 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | contract-domain / service-flow reports | 不通过 |
| VETO-ML-003 | `00` §14.2;Definition vs Use;Step 2/6/7 | `EV-ML-SERVICE-001`;`EV-ML-DEPENDENCY-001` | service-flow / dependency reports | 不通过 |
| VETO-ML-004 | `00` §14.2;FR-ML-003~005;Step 5 | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | contract / service reports | 不通过 |
| VETO-ML-005 | `00` §14.2;`01` data ownership;Step 6 | `EV-ML-REDACTION-001`;`EV-ML-DEPENDENCY-001` | redaction-check / dependency-boundary | 不通过 |
| VETO-ML-006 | `00` §14.2;FR-ML-007~009;Step 8/10 | `EV-ML-ENTRY-001`;`EV-ML-REPLAY-001`;`EV-ML-REPORT-001` | entry / replay / report-audit | 不通过 |
| VETO-ML-007 | `00` §14.2;dependency boundary;Step 6/7 | `EV-ML-DEPENDENCY-001` | `reports/runs/<run_id>/dependency-boundary.md` | 不通过 |
| VETO-ML-008 | `00` §14.2;Step 2 P0/P1/P2;Step 9 | `EV-ML-RELEASE-001`;`EV-ML-RISK-001` | gate-summary / risk direction | 不通过 |
| VETO-ML-009 | `00` §14.2;`03` §14;Step 10 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REPORT-001` | observability / report-audit | 不通过 |
| VETO-ML-010 | Step 2;Step 8;Step 9 | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001`;`EV-ML-OBSERVABILITY-001` | service / replay / observability reports | 不通过 |
| VETO-ML-011 | Step 9/10 redaction hard gate;`05` §14.3 | `EV-ML-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | 不通过 |
| VETO-ML-012 | Step 6/9 dependency hard gate;`05` §14.3 | `EV-ML-DEPENDENCY-001` | `reports/runs/<run_id>/dependency-boundary.md` | 不通过 |
| VETO-ML-013 | Step 3/10 evidence integrity;`05` §14.3 | `EV-ML-REPORT-001`;veto checklist | `reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md` | 不通过或暂停验收 |
| VETO-ML-014 | `04` config redline;Step 4/9 | `EV-ML-CONFIG-001` | `reports/runs/<run_id>/suites/config-redline.md` | 不通过 |

### 13. 非 VETO 边界表

| 项 | 当前裁决 | 后续处理 |
|---|---|---|
| P1 selected-run unavailable | 不作为 VETO,但不得伪装成 P0 pass。 | Step 13 residual / risk acceptance。 |
| production-like capacity / long-run 未覆盖 | 不作为 VETO,当前无容量模型和部署基线。 | Step 13 residual。 |
| 性能 sample 高于旧 P95/SLO 候选 | 不作为 VETO,当前无硬阈值来源。 | Step 9 trend risk / Step 13 residual。 |
| evidence retention 天数未固定 | 不作为当前 VETO。 | Step 13 residual 或后续运维标准。 |
| marketplace / console / SDK 深层行为未覆盖 | 不作为 core P0 VETO。 | Step 13 residual。 |
| acceptance review 签署人未最终固定 | 不作为 VETO,但不得跳过 Step 14。 | Step 14 sign-off。 |

### 14. 一票否决项停审记录

| 否决项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| VETO-ML-001~009 | 是否覆盖 `00` §14.2 需求层 VETO | 通过 | 9 条需求层否决均有对应项。 |
| VETO-ML-010~014 | 是否属于验收过程硬红线 | 通过 | source-missing/no truth repair、redaction、dependency、evidence integrity、config fail-fast 均影响裁决成立。 |
| 全部 VETO | 是否有正式红线来源 | 通过 | 来源分别回指 `00`、`01`、`03`、`04`、`05` 和 Step 2/4/6~10。 |
| 全部 VETO | 是否有 EV / report path direction | 通过 | 实际执行时必须由 evidence index 和 veto-checklist 引用。 |
| 全部 VETO | 是否允许风险接受 | 不允许 | Step 13 必须保留该约束。 |
| 非 VETO 项 | 是否误把 P1/P2 或无来源阈值设为 VETO | 通过 | 见 §13。 |

### 15. 跨 VETO 覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 红线未覆盖 | 未发现 | 需求 §14.2、Step 2、Step 4、Step 9、Step 10 硬红线均覆盖。 |
| VETO 重复 | 可接受 | redaction/body-free、dependency、evidence integrity 在多处来源交叉,但检查证据一致。 |
| VETO 与风险接受冲突 | 未发现 | 全部 VETO 禁止风险接受;Step 13 只能处理 residual。 |
| 检查方式不可执行 | 未发现 | 每项均绑定 `EV-ML-*`、suite/report 或 acceptance checklist direction。 |
| P1/P2 污染 VETO | 未发现 | P1 selected-run、capacity、old P95、retention 和 peripheral 未覆盖均未设 VETO。 |
| 旧材料污染 | 未发现 | 未继承旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway VETO 主语。 |

### 16. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“一票否决项表”“VETO 闭环矩阵”“非 VETO 边界表”“一票否决项停审记录”和“跨 VETO 覆盖审计表”小节,了解一票否决项如何从需求红线、架构红线、详细设计不变量和证据真实性门禁收敛。

正式 `06-验收标准.md` §11 应回填:

- 一票否决项固定为 `VETO-ML-001~014`。
- `VETO-ML-001~009` 对应需求 §14.2 的 9 条一票否决项;`VETO-ML-010~014` 覆盖 source-missing/no truth repair、redaction、dependency、evidence integrity 和 config fail-fast 等验收过程硬红线。
- 任一 VETO 命中时,最终结论不得为“通过”或“有条件通过”。
- VETO 不得被风险接受、P1 selected-run、residual、人工口头确认或后续补证据覆盖。
- `reports/acceptance/veto-checklist.md` 必须逐项引用真实 `EV-ML-*`、suite report、audit report 或 defect state direction,不得默认全部 passed。

### 17. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否要把 `VETO-ML-010~014` 回写需求文档 | 影响上游编号 | 当前作为验收过程硬红线,不修改需求编号。 |
| `reports/acceptance/veto-checklist.md` 机器字段 | 影响实现 report script | Step 10/11 只固定语义和路径方向;字段级 schema 若需要,回 `05` / schema owner 闭口。 |
| P1 selected-run 是否在某 release 强制执行 | 影响 Step 13 risk acceptance | 不作为 VETO,后续记录 residual。 |

### 18. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| SOP Step 11 问题已回答 | 通过 | 见 §10。 |
| 一票否决项清楚且可检查 | 通过 | 见 §11 / §12。 |
| 非 VETO 边界明确 | 通过 | 见 §13。 |
| 一票否决项已停审 | 通过 | 见 §14。 |
| 跨 VETO 覆盖审计无 unresolved 冲突 | 通过 | 见 §15。 |
| 可进入 Step 12 | 通过 | 下一步定义缺陷分级、复验与放行规则;进入前等待用户确认。 |

### 19. R11.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 11 R11.2 | pass |
| 是否完成 SOP Step 11 期望产出 | pass |
| 是否使用 L3-local `VETO-ML-*` 而非 governance ID | pass |
| 是否覆盖需求层 VETO 与验收过程硬红线 | pass |
| 是否明确全部 VETO 不可风险接受 | pass |
| 是否避免 P1/P2、无来源 P95/SLO/capacity、retention 或 peripheral 未覆盖被误设 VETO | pass |
| 是否未写真实 checklist status、真实 defects、真实 verdict、CI 或 implementation boundary | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.1 defects retest release:先思考`;只允许思考缺陷分级、复验、放行规则、VETO/S/A/B/R 对最终结论的影响和 R12.2 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
