# Step 18. 风险与待确认事项

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 回填章节: `projects/L3-method-library/03-详细设计.md` §17 风险与待确认事项
> 创建日期: 2026-06-24
> 当前模式: full-restart / step18-risks-open-questions
> 当前状态: completed_wait_user_confirm
> 当前模块: `R18.14 formal §17 candidate stop-review:再写入`
> 当前门禁: `R18.14` completed_wait_user_confirm;Step 18 completed;等待确认进入 Step 19 `R19.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_18_risks_open_questions.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、P0 / P1、`ViewProfile`、snapshot、fingerprint、outbox、governance gate、旧 Query audit、旧配置和旧测试口径展开。该 completed 状态和旧风险 / 待确认结论全部失效。

当前 Step 18 不继承旧风险表、旧待确认事项表、旧 P0 / P1 分级、旧默认原则、旧回填草稿或旧“可进入 Step 19”判断。旧内容只能作为 historical material 和污染审计输入,不得作为当前 L3-method-library 风险与待确认事项的正向来源。

当前 Step 18 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~17 中间产物。
- 特别是 Step 17 的 implementation handoff source matrix、preread / gate candidate、cross-document closure pre-audit、downstream ownership、Step 18 entry gate 和 Step 19 assembly boundary。
- `详细设计讨论流程_SOP.md` Step 18 与 `详细设计书写规范.md` §5.17。
- L1-governance Step 18 只作为框架深度参考,不得复制 governance 领域语义。

---

## R18.1 开工与必读文档:先思考

### 1. 当前模块目标

`R18.1` 只思考 Step 18 的开工边界、必读文档、Step 17 handoff、旧 Step 18 historical material 隔离、风险 / 待确认事项分类框架和 `R18.2` 写入计划。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 Step 17 completed 推进到 Step 18 `R18.1`。 |
| 当前允许 | 思考 Step 18 开工边界、必读文档、Step 17 handoff、旧材料隔离、风险分类框架、待确认事项分类框架和 R18.2 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. Step 18 开工边界思考

Step 18 的目标是记录“详细设计阶段仍未关闭、会影响实现的风险和待确认事项”。它不是补设计的步骤,也不是替 04/05/06/07 写下游文档的步骤。

| 边界项 | R18.1 裁决 |
|---|---|
| Step 18 的定位 | 风险与待确认事项收口,服务于 Step 19 formal `03` 装配和后续 04/05/06/07 下游文档。 |
| 输出责任 | 后续写风险表、待确认事项表、未确认前处理规则、Step 19 进入门禁。 |
| 不负责事项 | 不新增对象、字段、DTO、port、state、mapper、config key、test case、evidence schema、phase / commit boundary。 |
| blocker 判断 | 只判断事项是否阻塞 formal §17 装配、正式 03 完成、下游 04/05/06/07、implementation start 或 production adapter。 |
| 正常 pending 处理 | 04/05/06/07 尚未生成或需要后续承接,不自动等同于设计 blocker;必须说明 owner 和未确认前处理方式。 |
| 真 blocker 处理 | 若 Step 1~17 自身留下 schema / port / state / marker / mapper / source 缺口,必须标为 blocker 并回 owning Step 闭口。 |

### 3. 必读文档思考

| 文档 | Step 18 用途 | R18.1 口径 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点、单模块推进规则和 Step 18 当前门禁。 | 每次用户确认只推进一个 `R18.x` 模块。 |
| `03_ddd_calibration_flow.md` | 确认 Step 17 completed、Step 18 pending / in_progress、Step 19 blocked。 | R18.1 完成后只能等待 R18.2。 |
| `03_ddd_step_18_risks_open_questions.md` | 当前文件本身。 | 旧 completed 状态作废,从 R18.1 重启。 |
| `03_ddd_step_17_implementation_handoff.md` | 提供 Step 18 entry gate、Step 19 assembly boundary、downstream ownership 和 blocker watch。 | Step 18 必须承接,但不得把 R17 候选表升级成正式实施计划。 |
| `00-需求文档.md` | 固定业务范围、非范围、依赖裁剪、验收红线。 | 识别范围膨胀风险和误交付风险。 |
| `01-架构设计.md` | 固定系统上下文、依赖方向、数据所有权、一致性和横切关注点。 | 识别架构边界、依赖和生产化风险。 |
| `02-概要设计.md` | 固定八组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 识别概要到详细设计是否仍有未关闭缺口。 |
| Step 1~16 中间产物 | 提供已确认详细设计契约。 | 后续风险分类必须区分“已关闭风险”和“仍未关闭风险”。 |
| `详细设计讨论流程_SOP.md` Step 18 | 固定目标、输入、输出、四个应问问题和执行约束。 | 不确定项必须显式记录,不得主观脑补。 |
| `详细设计书写规范.md` §5.17 | 固定风险表和待确认事项表格式。 | R18 后续表格必须符合规范。 |
| `设计文档讨论中间产物规范.md` | 固定中间产物、状态台账、待确认事项和分批写入纪律。 | 不得因控制单批行数删减风险或 blocker。 |
| `设计真相源闭环与可落码性标准.md` | 固定不得把缺 schema / port / DTO / state / mapper / config / evidence / phase 的事项交给实现自行补。 | 风险表必须标注 blocking owner。 |
| L1-governance Step 18 | 参考目标、输入、诊断、取舍、风险分层、已关闭风险不再列入表、未确认前处理规则。 | 只参考框架,不得复制 governance 风险事实。 |

### 4. Step 17 handoff 承接思考

Step 17 已完成详细设计到实施计划的承接清单,但它明确不是实施计划本体。Step 18 需要把 Step 17 暴露出的“仍需风险化或待确认化”的事项收口。

| Step 17 handoff | Step 18 承接方式 |
|---|---|
| R17 候选表不是正式实施计划 | Step 18 风险表不得把候选 required_reads、gate 或 source matrix 写成实现已可开工。 |
| implementation starts only after 07 and ledger gates | 若正式 07、implementation ledger 或 boundary gate 未生成,后续应标为 implementation start blocker / downstream pending,不能由 03 代替。 |
| 04/05/06/07 downstream ownership | Step 18 要区分下游文档正常待生成与 Step 3~17 自身设计缺口。 |
| cross-document closure pre-audit | 后续 R18 要检查预复核中是否仍有未关闭的 field / marker / protocol / query / persistence / replay / naming risk。 |
| historical pollution 禁入 | 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay 等如仍可能污染 Step 19,应作为风险或已关闭污染项记录。 |
| Step 19 assembly boundary | 若 Step 18 有 blocker 未关闭,Step 19 不得把正式 `03` 装配为 completed。 |

### 5. 旧 Step 18 historical material 隔离思考

| 旧内容 | 当前处理 |
|---|---|
| 旧 `[x] 已确认` 状态 | invalid;当前 Step 18 从 R18.1 重新执行。 |
| 旧 P0 / P1 风险分级 | 不继承;当前分类必须来自本轮 Step 1~17。 |
| 旧 `MethodContent`、publish、retire、supersede | historical pollution;不得进入当前风险事实。 |
| 旧 `ViewProfile`、snapshot、fingerprint、outbox、gateway、PostgreSQL、object storage | 不作为当前 L3 事实;如当前设计有相似能力,必须回指本轮 Step。 |
| 旧 governance validation / Query audit / CI / fixture 风险 | 不继承;只有本轮 Step 14~16 或 Step 17 仍暴露的问题才能进入风险表。 |
| 旧回填草稿 | invalid;formal §17 candidate 必须由当前 R18 confirmed modules 重新生成。 |

### 6. 风险分类框架思考

R18 后续应先分类,再写表。分类目的不是制造更多 blocker,而是让 Step 19 和下游 04/05/06/07 知道哪些事项必须先闭口、哪些是正常下游承接、哪些只是生产化后续。

| 分类 | 判断标准 | 后续写法 |
|---|---|---|
| formal 03 assembly blocker | 阻塞 Step 19 装配正式 `03`,或会让 formal §17 把不确定项写成已确认契约。 | 必须在 Step 19 前闭口或明确不能进入 completed。 |
| design truth-source blocker | Step 1~17 缺字段来源、DTO/port/mapper/state/schema/source/ref/marker 闭环。 | 标明 owning Step,不得交给实现者补。 |
| downstream document pending | 04/05/06/07 尚未生成或需按新版 03 重写。 | 标明 downstream owner 和未确认前不得实现 / 不得验收。 |
| implementation start blocker | 没有正式 07、implementation ledger、boundary gate、目标实现仓或 required_reads。 | 标明实施开工前置,不由 03 直接放行。 |
| production adapter / operations follow-up | fake / in-memory / contract 层可继续,但 durable product、bus、metrics、DLQ、integration evidence 未定。 | 标明不阻塞 design completion,阻塞 production / acceptance。 |
| historical pollution watch | 旧 03 / 旧 Step 中的旧名、旧对象、旧流程仍可能被误用。 | 写作污染 watch 或已关闭风险,防止 Step 19 误装配。 |
| already closed risk | 已由 Step 6~17 明确闭口,不应重复列为 active risk。 | 后续可单列“已关闭风险不再列入表”。 |

### 7. 待确认事项分类框架思考

待确认事项必须写清“当前影响、需要谁确认、未确认前处理方式”。不得只写“待确认”。

| 分类 | 典型确认方 | 未确认前处理方式 |
|---|---|---|
| formal 03 装配确认 | 详细设计维护者 / 用户 | Step 19 不得装配为 completed。 |
| downstream document ownership | 04/05/06/07 文档维护者 | 不把下游文档缺口交给实现 agent。 |
| implementation gate ownership | 实施计划维护者 / implementation agent | 不创建代码、不拆 phase、不提交实现仓。 |
| upstream typed dependency | 对应上游仓负责人 | 缺 shared type / contract 时暂停对应实现。 |
| production integration | 架构 / SRE / adapter owner | 使用 fake / fixture / unavailable 语义,不得写死产品。 |
| historical material disposition | 详细设计维护者 | Step 19 必须显式排除或重命名后再引用。 |

### 8. R18.2 写入计划思考

`R18.2 开工与必读文档:再写入` 应把本模块思考落成可恢复记录,但仍不写最终风险表和待确认事项表:

1. 写 Step 18 必读文档表与读取状态。
2. 写输入基线和旧 Step 18 historical material 隔离规则。
3. 写 Step 17 handoff 承接表。
4. 写 SOP 四问的初步回答口径。
5. 写风险分类框架和待确认事项分类框架。
6. 写 Step 18 模块计划,至少覆盖 L1-governance 框架对齐、closed vs active risk 分类、风险表候选、待确认事项候选、未确认前处理规则、formal §17 candidate stop-review。
7. 写 `R18.3 L1-governance 框架对齐与风险分层:先思考` 进入门禁。
8. 不写最终风险表、最终待确认事项表,不修改正式 `03-详细设计.md`。

### 9. R18.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 18 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 17 handoff、旧材料隔离和分类框架 | pass |
| 是否区分 downstream pending 与真正 blocker | pass |
| 是否形成风险分类框架 | pass |
| 是否形成待确认事项分类框架 | pass |
| 是否形成 R18.2 写入计划 | pass |
| 是否未写最终风险表或最终待确认事项表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.2 开工与必读文档:再写入`;只允许写入 Step 18 必读文档表、读取状态、输入基线、旧 Step 18 historical material 隔离规则、Step 17 handoff 承接、SOP 四问初步回答口径、风险分类框架、待确认事项分类框架、Step 18 模块计划和 `R18.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.1` 推进到 `R18.2`。 |
| 本模块写入范围 | Step 18 必读文档表、读取状态、输入基线、旧 Step 18 historical material 隔离规则、Step 17 handoff 承接、SOP 四问初步回答口径、风险分类框架、待确认事项分类框架、Step 18 模块计划和 `R18.3` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 18 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进规则和 Step 18 当前门禁。 | 每次用户确认只推进一个 `R18.x` 模块。 |
| `03_ddd_calibration_flow.md` | 已读取并承接 | 确认 Step 18 in_progress、R18.2 当前边界、Step 19 blocked。 | `R18.2` 完成后只能等待 `R18.3`。 |
| `03_ddd_step_18_risks_open_questions.md` | 已读取并重置 | 当前 Step 18 中间产物。 | 旧 completed 状态作废,只承接当前 R18.1/R18.2。 |
| `03_ddd_step_17_implementation_handoff.md` | 已读取 handoff tail | 提供 Step 18 entry gate、Step 19 assembly boundary、downstream ownership、blocker watch。 | Step 18 不把 R17 候选表升级成正式实施计划。 |
| `00-需求文档.md` | 作为正式上游基线 | 固定范围、非范围、依赖裁剪、业务规则和验收红线。 | 后续风险不能恢复旧 P0/P1 或旧 MethodContent 范围。 |
| `01-架构设计.md` | 作为正式上游基线 | 固定系统上下文、依赖方向、数据所有权、一致性和横切关注点。 | 后续风险按当前架构边界判断,不复制 L1-governance 领域事实。 |
| `02-概要设计.md` | 作为直接输入基线 | 固定八组成部分、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 只识别当前概要到详细设计仍未关闭的缺口。 |
| Step 1~5 中间产物 | 已完成并列入必读 | 输入边界、范围、runtime、布局、模块主轴。 | 后续用于判断范围膨胀、仓库约束和旧布局污染风险。 |
| Step 6~10 中间产物 | 已完成并列入必读 | object、port、protocol、flow、state。 | 后续用于判断 truth-source blocker 与已关闭设计风险。 |
| Step 11~13 中间产物 | 已完成并列入必读 | persistence、transaction、error/recovery、concurrency/idempotency。 | 后续用于判断 replay、rollback、race、stored surface 风险是否已闭口。 |
| Step 14~16 中间产物 | 已完成并列入必读 | config/dependency、observability/audit、test cut。 | 后续用于区分 detailed design 已闭口与 04/05/06 downstream pending。 |
| `详细设计讨论流程_SOP.md` Step 18 | 已读取并承接 | 固定 Step 18 目标、输入、输出、四问和执行约束。 | 不确定项必须显式记录,不得主观脑补。 |
| `详细设计书写规范.md` §5.17 | 已读取并承接 | 固定风险表和待确认事项表格式。 | 最终表格后续 R18.7~R18.10 再写。 |
| `设计文档讨论中间产物规范.md` | 已列入约束 | 固定中间产物可恢复性和待确认事项处理。 | 不因单批行数控制删减风险或 blocker。 |
| `设计真相源闭环与可落码性标准.md` | 已列入约束 | 固定不得把 schema / port / DTO / state / mapper / config / evidence / phase 缺口交给实现。 | 若发现真相源缺口,后续必须标 blocker 并回 owning Step。 |
| L1-governance Step 18 | 已读取框架 | 参考风险分层、已关闭风险不重复列入、未确认前处理规则。 | 只参考组织深度,不得复制 governance 风险事实。 |

### 3. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 正向基线 | 当前 `00/01/02` 和本轮 Step 1~17 中间产物。 |
| 当前 Step 18 | 从 `R18.1` 起重启,旧 `[x] 已确认` 状态失效。 |
| 旧正式 `03-详细设计.md` | historical material;只用于识别旧主线残留和旧章节污染。 |
| 旧 Step 18 | historical pollution;旧风险表、旧待确认事项、旧 P0/P1 分层和旧回填草稿不继承。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery | 不进入当前风险事实;如 Step 19 仍发现旧名,作为 historical pollution watch 处理。 |
| 正式 `03-详细设计.md` | 本模块不修改;formal §17 candidate 后续 R18.13/R18.14 只提供候选,正式装配由 Step 19 执行。 |
| 04/05/06/07 | 作为 downstream owner;未生成或待重写不自动等同于 Step 18 设计 blocker,但可成为 downstream pending 或 implementation start blocker。 |

### 4. Step 17 handoff 承接表

| Step 17 输出 | Step 18 承接写法 | 本模块裁决 |
|---|---|---|
| formal §16 source map candidate | 后续识别哪些 handoff 风险会影响 Step 19 formal §16 / §17 装配。 | 不复制 source map 为实施计划。 |
| formal §16 assemblable / forbidden content table | 后续作为 Step 19 误装配风险输入。 | 旧 MethodContent、P0/P1、CI/evidence/phase 继续禁入。 |
| Step 17 completion checklist | 后续判断 Step 1~17 是否存在未关闭 detailed design source 缺口。 | 已 pass 项不重复列 active risk。 |
| Step 18 entry gate | 当前已满足;Step 18 必须区分 downstream pending 与真 blocker。 | R18.2 已写入分类框架。 |
| Step 19 assembly boundary | 后续若发现 formal 03 assembly blocker,Step 19 不得装配为 completed。 | R18.11/R18.12 处理。 |
| implementation starts only after 07 and ledger gates | 后续写为 implementation start rule 或待确认事项。 | 不在 Step 18 创建 implementation ledger。 |

### 5. SOP 四问初步回答口径

| SOP 问题 | 当前回答口径 | 后续模块 |
|---|---|---|
| 哪些问题仍可能影响代码实现? | 只记录仍未关闭且会影响 formal 03、04/05/06/07、implementation gate、production adapter 或 historical pollution 的事项。已由 Step 6~17 闭口的字段、DTO、state、flow、persistence、error、idempotency、config binding、observability、test cut 不重复列为 active risk。 | R18.5~R18.10 |
| 哪些问题会阻塞实现,哪些只影响后续优化? | 分为 formal 03 assembly blocker、design truth-source blocker、downstream document pending、implementation start blocker、production adapter / operations follow-up、historical pollution watch、already closed risk。 | R18.3/R18.4 |
| 每个待确认事项需要谁确认? | 逐项标 owner: detailed design maintainer、04/05/06/07 owner、implementation plan owner、upstream typed dependency owner、adapter / SRE owner、historical material disposition owner。 | R18.9/R18.10 |
| 未确认前实现者应该如何处理? | 不得按旧 `03` 开工,不得自行补 schema/port/DTO/state/mapper/config/evidence/phase,不得把 downstream pending 伪装成已确认契约,不得绕过 07 与 implementation ledger gate。 | R18.11/R18.12 |

### 6. 风险分类框架

| 分类 | 判断标准 | 后续处理 |
|---|---|---|
| formal 03 assembly blocker | 阻塞 Step 19 装配正式 `03`,或导致不确定项被写成正式契约。 | 必须先闭口或在 Step 19 前停止装配。 |
| design truth-source blocker | Step 1~17 内部仍缺字段来源、DTO / port / state / marker / mapper / schema / source ref 闭环。 | 回 owning Step 修复,不得交给实现 agent。 |
| downstream document pending | 04/05/06/07 尚未生成、需要重写或需要复核新版 03。 | 标 downstream owner 和未确认前处理方式。 |
| implementation start blocker | 缺正式 07、implementation ledger、boundary ledger、target repo、required_reads 或 commit gate。 | 阻塞代码开工,不阻塞 Step 18 记录。 |
| production adapter / operations follow-up | 详细设计 contract 可闭合,但 durable product、broker、metrics、DLQ、integration evidence 未选型。 | 不阻塞 design completion;阻塞 production / acceptance。 |
| historical pollution watch | 旧正式 03 或旧 Step 中旧名、旧对象、旧流程仍可能被误装配。 | Step 19 必须排除或显式重命名后引用。 |
| already closed risk | 已由 Step 6~17 明确闭口。 | 后续单列“已关闭风险不再列入表”,不进入 active 风险表。 |

### 7. 待确认事项分类框架

| 分类 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|
| formal 03 装配确认 | 详细设计维护者 / 用户 | Step 19 不得把 unresolved blocker 装配为 completed。 |
| downstream document ownership | 04/05/06/07 文档维护者 | 不把下游文档缺口交给实现 agent 补口。 |
| implementation gate ownership | 实施计划维护者 / implementation agent | 不创建代码、不拆 phase、不提交实现仓。 |
| upstream typed dependency | 对应上游仓负责人 | 缺 shared type / contract 时暂停对应实现。 |
| production integration | 架构 / SRE / adapter owner | 仅允许 fake / fixture / unavailable / degraded 语义,不得写死产品。 |
| historical material disposition | 详细设计维护者 | Step 19 明确排除旧材料,或经当前 Step 重新命名后引用。 |

### 8. Step 18 模块计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R18.1/R18.2 | 开工与必读文档 | 重置旧 Step 18、写必读文档、输入基线、Step 17 handoff、分类框架和模块计划。 |
| R18.3/R18.4 | L1-governance 框架对齐与风险分层 | 写 L1 Step 18 框架映射、L3 风险分层图、downstream pending vs true blocker 判断法。 |
| R18.5/R18.6 | closed vs active risk classification | 写已关闭风险不再列入表、active risk candidate source audit。 |
| R18.7/R18.8 | risk table candidates | 写风险表候选,含影响、阻塞范围、缓解方式、owner。 |
| R18.9/R18.10 | open question table candidates | 写待确认事项候选,含当前影响、确认方、未确认前处理方式。 |
| R18.11/R18.12 | unresolved handling and Step 19 gate | 写未确认前实现处理规则、Step 19 进入门禁、回 owning Step 规则。 |
| R18.13/R18.14 | formal §17 candidate stop-review | 写 formal §17 source map candidate、可装配 / 禁入内容、Step 18 completion checklist 和 Step 19 entry gate。 |

### 9. R18.3 进入门禁

`R18.3 L1-governance 框架对齐与风险分层:先思考` 只允许思考:

1. L1-governance Step 18 的框架如何映射到 L3-method-library。
2. L3 风险分层图应如何表达 formal 03、truth-source、downstream、implementation、production 和 historical pollution。
3. 如何判断 normal downstream pending 与 true implementation-blocking blocker。
4. 哪些已关闭风险后续不应重复列入 active 风险表。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 10. R18.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 18 必读文档表与读取状态 | pass |
| 是否写入输入基线与旧材料隔离规则 | pass |
| 是否写入 Step 17 handoff 承接表 | pass |
| 是否写入 SOP 四问初步回答口径 | pass |
| 是否写入风险分类框架和待确认事项分类框架 | pass |
| 是否写入 Step 18 模块计划 | pass |
| 是否形成 R18.3 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.3 L1-governance 框架对齐与风险分层:先思考`;只允许思考 L1-governance Step 18 框架到 L3-method-library 的映射、L3 风险分层图、normal downstream pending vs true blocker 判断法、已关闭风险不再列入 active 风险表的初步分类和 R18.4 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.3 L1-governance 框架对齐与风险分层:先思考

### 1. 当前模块目标

`R18.3` 只思考 L1-governance Step 18 的框架如何映射到 L3-method-library,并形成 L3 风险分层图、normal downstream pending vs true blocker 判断法、已关闭风险不再列入 active 风险表的初步分类和 `R18.4` 写入计划。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.2` 推进到 `R18.3`。 |
| 当前允许 | 思考 L1-governance Step 18 框架映射、L3 风险分层图、downstream pending 与 true blocker 判断法、已关闭风险初步分类和 R18.4 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. L1-governance Step 18 框架映射思考

L1-governance Step 18 的可复用价值在组织框架:先声明 Step 18 只记录风险和待确认事项,再把 Step 1~17 的完成状态、正式文档链风险、实现开工风险、生产化风险和旧材料污染风险分层。L3-method-library 应采用同样的风险治理结构,但所有风险事实必须来自 L3 当前 `00/01/02` 与本轮 Step 1~17。

| L1-governance 框架块 | L3-method-library 采用思路 |
|---|---|
| 本步目标 | 写清 Step 18 只记录风险、影响、确认方和未确认前处理方式,不补对象 / DTO / 状态 / 配置 / 测试 / 实施计划。 |
| 本步输入 | 输入覆盖当前 00/01/02、Step 1~17、Step 17 handoff、SOP 和书写规范。 |
| SOP 四问 | L3 保留四问,但答案必须围绕 formal 03、truth-source、downstream docs、implementation gate、production adapter 和 historical pollution。 |
| 当前文档问题诊断 | L3 重点诊断旧 03 / 旧 Step 18 污染、Step 19 尚未装配、04/05/06/07 downstream pending。 |
| 设计取舍 | 采用“只列仍未关闭且影响移交的问题;已由 Step 6~17 闭口的风险不重复列 active risk”。 |
| 风险分层图 | L3 需要画出 formal assembly、truth-source、downstream、implementation、production、historical pollution、closed risk 的分层。 |
| 已关闭风险不再列入表 | L3 后续应把对象、port、protocol、flow、state、persistence、error、idempotency、config binding、observability、test cut 的已闭口项单独列出。 |
| 未确认前处理规则 | L3 后续必须写清实现者不得自行补 schema / port / DTO / state / mapper / config / evidence / phase。 |

### 3. L3 风险分层图思考

L3 的风险分层不应使用旧 P0/P1,也不应照搬 L1-governance 的对象名。候选分层如下:

```text
L3-method-library Step 18 risk layers
  |
  +-- Formal 03 assembly blockers
  |     +-- unresolved item would make Step 19 write uncertainty as contract
  |     +-- formal §16 / §17 source map cannot be assembled honestly
  |
  +-- Design truth-source blockers
  |     +-- object field / ref / marker source missing
  |     +-- DTO / port / mapper / state / schema closure missing
  |
  +-- Downstream document pending
  |     +-- 04 config design not restarted
  |     +-- 05 test plan not restarted against new 03
  |     +-- 06 acceptance not restarted against new 03
  |     +-- 07 implementation plan not restarted against new 03
  |
  +-- Implementation start blockers
  |     +-- formal 07 absent or not audited
  |     +-- implementation ledger / boundary gate absent
  |     +-- target repo / required_reads / commit gate absent
  |
  +-- Production / operations follow-up
  |     +-- durable products and real adapters not selected
  |     +-- integration evidence and operations backend not fixed
  |
  +-- Historical pollution watch
  |     +-- old MethodContent / P0-P1 / publish / snapshot / outbox vocabulary
  |     +-- old completed Step files accidentally reused
  |
  +-- Already closed design risks
        +-- Step 6-17 closed contracts should not re-enter active risk table
```

### 4. normal downstream pending vs true blocker 判断法思考

Step 18 需要避免两个错误:一是把所有下游文档未生成都写成详细设计自身 blocker;二是把真正缺 schema / port / state / mapper 的问题交给后续实现。

| 场景 | 判断 | R18 后续写法 |
|---|---|---|
| 04/05/06/07 尚未重启 | normal downstream pending,除非缺口反向证明 Step 3~17 设计不闭合。 | 写 downstream owner、未确认前不得 implementation / acceptance。 |
| formal `03` 尚未 Step 19 装配 | formal assembly pending,是正式移交前置。 | 写 formal 03 assembly blocker / gate,不让实现按旧 03 开工。 |
| Step 6 字段来源缺失 | true design truth-source blocker。 | 回 Step 6 或 owning Step 闭口。 |
| Step 7 port / mapper 缺失 | true design truth-source blocker。 | 回 Step 7 或 owning Step 闭口。 |
| Step 8 DTO / protocol shell 双口径 | true design truth-source blocker 或 formal assembly blocker。 | 不让 Step 19 写成双真相源。 |
| Step 9 flow 只写意图但无正式输入来源 | true design truth-source blocker。 | 回 Step 9 / Step 6 / Step 7 补口。 |
| production DB / broker / metrics backend 未选型 | production follow-up,不阻塞 detailed design contract。 | 标阻塞 production adapter / acceptance,不阻塞 Step 19。 |
| old `MethodContent` 词汇仍在旧 03 | historical pollution watch。 | Step 19 排除旧材料,不作为 active design gap。 |

### 5. 已关闭风险初步分类思考

已关闭风险应在 R18.5/R18.6 单独列出,防止实现者误以为仍可自由发挥。初步分组如下:

| closed risk family | 关闭依据 | R18 后续处理 |
|---|---|---|
| scope / historical material reset | Step 1~2 | 不再按旧 P0/P1 或旧 MethodContent 判定风险。 |
| runtime / layout / module axis | Step 3~5 | 不再恢复旧 crate / module / repo path。 |
| object / ref / marker / body-free shell | Step 6 | 只查是否仍有未关闭字段来源,不重复列已闭口对象为 active risk。 |
| port / adapter / protocol shell | Step 7~8 | 不重复列已闭合 DTO / port 为待确认事项。 |
| flow / state / persistence | Step 9~11 | 不把已闭合 flow、state transition、repository key 重写成风险。 |
| error / idempotency / concurrency | Step 12~13 | 不重复列 duplicate replay、race、retry 等已闭口语义。 |
| config / observability / test cut | Step 14~16 | 区分 design binding 已闭口与 04/05/06 下游文档待生成。 |
| implementation handoff ownership | Step 17 | Step 17 不等于 07,但其 ownership rule 已闭口。 |

### 6. R18.4 写入计划思考

`R18.4 L1-governance 框架对齐与风险分层:再写入` 应把本模块思考落成可恢复记录:

1. 写 L1-governance Step 18 框架到 L3 的映射表。
2. 写 L3 风险分层图。
3. 写 normal downstream pending vs true blocker 判断表。
4. 写已关闭风险初步分类表。
5. 写 `R18.5 closed vs active risk classification:先思考` 进入门禁。
6. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 7. R18.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 L1-governance 框架映射与 L3 风险分层 | pass |
| 是否形成 normal downstream pending vs true blocker 判断法 | pass |
| 是否形成已关闭风险初步分类 | pass |
| 是否形成 R18.4 写入计划 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.4 L1-governance 框架对齐与风险分层:再写入`;只允许写入 L1-governance Step 18 框架到 L3 的映射表、L3 风险分层图、normal downstream pending vs true blocker 判断表、已关闭风险初步分类表和 `R18.5` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.4 L1-governance 框架对齐与风险分层:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.3` 推进到 `R18.4`。 |
| 本模块写入范围 | L1-governance Step 18 框架到 L3 的映射表、L3 风险分层图、normal downstream pending vs true blocker 判断表、已关闭风险初步分类表和 `R18.5` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. L1-governance Step 18 框架到 L3 的映射表

| L1-governance 框架块 | L3-method-library 写入结果 | 当前边界 |
|---|---|---|
| 本步目标 | Step 18 只记录风险、影响、确认方和未确认前处理方式。 | 不新增对象、字段、DTO、状态、配置、测试、验收或实施计划。 |
| 本步输入 | 当前 00/01/02、Step 1~17、Step 17 handoff、SOP 和书写规范作为输入。 | 旧 `03` 和旧 Step 18 只作 historical material。 |
| SOP 四问 | 四问围绕 formal 03、truth-source、downstream docs、implementation gate、production adapter、historical pollution。 | 不把已闭口设计点重新写成待确认事项。 |
| 当前文档问题诊断 | 诊断旧 03 / 旧 Step 18 污染、Step 19 尚未装配、04/05/06/07 downstream pending。 | 不直接判定所有 downstream pending 都是 detailed design blocker。 |
| 设计取舍 | 只列仍未关闭且影响移交的问题;已由 Step 6~17 闭口的风险不重复列 active risk。 | 不用旧 P0/P1 分层。 |
| 风险分层图 | 使用 formal assembly、truth-source、downstream、implementation、production、historical pollution、closed risk 七层。 | 不复制 L1-governance 领域对象。 |
| 已关闭风险不再列入表 | 后续 R18.5/R18.6 单列 closed risk family。 | 不进入最终 active 风险表。 |
| 未确认前处理规则 | 后续 R18.11/R18.12 写实现者处理规则。 | 不提前放行实现。 |

### 3. L3 风险分层图

```text
L3-method-library Step 18 risk layers
  |
  +-- Formal 03 assembly blockers
  |     +-- unresolved item would make Step 19 write uncertainty as contract
  |     +-- formal §16 / §17 source map cannot be assembled honestly
  |
  +-- Design truth-source blockers
  |     +-- object field / ref / marker source missing
  |     +-- DTO / port / mapper / state / schema closure missing
  |
  +-- Downstream document pending
  |     +-- 04 config design not restarted
  |     +-- 05 test plan not restarted against new 03
  |     +-- 06 acceptance not restarted against new 03
  |     +-- 07 implementation plan not restarted against new 03
  |
  +-- Implementation start blockers
  |     +-- formal 07 absent or not audited
  |     +-- implementation ledger / boundary gate absent
  |     +-- target repo / required_reads / commit gate absent
  |
  +-- Production / operations follow-up
  |     +-- durable products and real adapters not selected
  |     +-- integration evidence and operations backend not fixed
  |
  +-- Historical pollution watch
  |     +-- old MethodContent / P0-P1 / publish / snapshot / outbox vocabulary
  |     +-- old completed Step files accidentally reused
  |
  +-- Already closed design risks
        +-- Step 6-17 closed contracts should not re-enter active risk table
```

图后说明:

- `Formal 03 assembly blockers` 与 `Design truth-source blockers` 需要在 Step 19 前闭口或明确停止装配。
- `Downstream document pending` 是正式移交前的下游责任,不自动证明详细设计 Step 6~17 不闭合。
- `Implementation start blockers` 阻塞代码开工,但不阻塞 Step 18 如实记录风险。
- `Production / operations follow-up` 阻塞真实 adapter / acceptance,不阻塞 contract-level detailed design completion。
- `Historical pollution watch` 必须在 Step 19 装配时排除。
- `Already closed design risks` 后续只进入 closed list,不进入 active risk table。

### 4. normal downstream pending vs true blocker 判断表

| 场景 | 判断 | 后续写法 |
|---|---|---|
| 04/05/06/07 尚未重启 | normal downstream pending,除非缺口反向证明 Step 3~17 设计不闭合。 | 写 downstream owner 和未确认前不得 implementation / acceptance。 |
| formal `03` 尚未 Step 19 装配 | formal assembly pending,是正式移交前置。 | 写 formal 03 assembly blocker / gate,不让实现按旧 03 开工。 |
| Step 6 字段来源缺失 | true design truth-source blocker。 | 回 Step 6 或 owning Step 闭口。 |
| Step 7 port / mapper 缺失 | true design truth-source blocker。 | 回 Step 7 或 owning Step 闭口。 |
| Step 8 DTO / protocol shell 双口径 | true design truth-source blocker 或 formal assembly blocker。 | 不让 Step 19 写成双真相源。 |
| Step 9 flow 只写意图但无正式输入来源 | true design truth-source blocker。 | 回 Step 9 / Step 6 / Step 7 补口。 |
| production DB / broker / metrics backend 未选型 | production follow-up,不阻塞 detailed design contract。 | 标阻塞 production adapter / acceptance,不阻塞 Step 19。 |
| old `MethodContent` 词汇仍在旧 03 | historical pollution watch。 | Step 19 排除旧材料,不作为 active design gap。 |

### 5. 已关闭风险初步分类表

| closed risk family | 关闭依据 | R18 后续处理 |
|---|---|---|
| scope / historical material reset | Step 1~2 | 不再按旧 P0/P1 或旧 MethodContent 判定风险。 |
| runtime / layout / module axis | Step 3~5 | 不再恢复旧 crate / module / repo path。 |
| object / ref / marker / body-free shell | Step 6 | 只查是否仍有未关闭字段来源,不重复列已闭口对象为 active risk。 |
| port / adapter / protocol shell | Step 7~8 | 不重复列已闭合 DTO / port 为待确认事项。 |
| flow / state / persistence | Step 9~11 | 不把已闭合 flow、state transition、repository key 重写成风险。 |
| error / idempotency / concurrency | Step 12~13 | 不重复列 duplicate replay、race、retry 等已闭口语义。 |
| config / observability / test cut | Step 14~16 | 区分 design binding 已闭口与 04/05/06 下游文档待生成。 |
| implementation handoff ownership | Step 17 | Step 17 不等于 07,但其 ownership rule 已闭口。 |

### 6. R18.5 进入门禁

`R18.5 closed vs active risk classification:先思考` 只允许思考:

1. 哪些 Step 1~17 风险已经关闭,不应重复进入 active 风险表。
2. 哪些 source family 仍需要审计 active risk candidate。
3. 如何把 closed risk、active risk candidate、downstream pending、implementation start blocker 分开。
4. `R18.6` 应如何写入 closed risk list 和 active risk candidate source audit。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 7. R18.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 L1-governance Step 18 框架到 L3 的映射表 | pass |
| 是否写入 L3 风险分层图 | pass |
| 是否写入 normal downstream pending vs true blocker 判断表 | pass |
| 是否写入已关闭风险初步分类表 | pass |
| 是否形成 R18.5 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.5 closed vs active risk classification:先思考`;只允许思考 Step 1~17 已关闭风险、active risk candidate source family、closed risk / active risk / downstream pending / implementation start blocker 的分类方式和 R18.6 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.5 closed vs active risk classification:先思考

### 1. 当前模块目标

`R18.5` 只思考 Step 1~17 哪些风险已经关闭、哪些 source family 仍需要审计 active risk candidate,以及如何把 closed risk、active risk candidate、downstream pending、implementation start blocker 分开。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.4` 推进到 `R18.5`。 |
| 当前允许 | 思考 Step 1~17 已关闭风险、active risk candidate source family、分类方式和 R18.6 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. closed risk 判定思考

closed risk 的判定标准不是“没有后续工作”,而是“当前详细设计 Step 1~17 已经给出可追溯的真相源闭口,实现者不需要自行补口”。这些项后续可写入“已关闭风险不再列入表”,但不得再进入 active risk table。

| closed risk family | 判定标准 | 思考结论 |
|---|---|---|
| historical material reset | Step 1~2 已明确旧 `03` 和旧 Step completed 状态只作 historical material。 | 旧 P0/P1、旧 MethodContent、旧 publish/snapshot/outbox 主线不再作为 active risk,只保留 pollution watch。 |
| implementation shape | Step 3~5 已收稳 runtime、仓库约束、布局、七实现单元和依赖方向。 | 不再把旧 crate/module/path 或模块主轴作为待确认项。 |
| object contract closure | Step 6 已给出对象、ref、marker、state owner、body-free shell 和字段来源主轴。 | 已闭口对象不再列 active risk;只审计是否仍有个别字段来源缺口。 |
| port / protocol closure | Step 7~8 已给出 port、adapter、repository、resolver、public protocol shell。 | 已闭口 port/DTO 不再列 active risk;只审计双口径或缺 marker source。 |
| flow / state / persistence closure | Step 9~11 已给出函数流、状态机、持久化、事务和 consistency 口径。 | 已闭口 flow/state/key 不再列 active risk;只审计 source 缺口或回放面缺口。 |
| error / idempotency closure | Step 12~13 已给出 safe error、recovery、duplicate replay、race 和 reentry 口径。 | 不重复列 retry / duplicate / race 为待确认项,除非 source 与 protocol 冲突。 |
| config / observability / test cut closure | Step 14~16 已给出 binding 点、观测审计边界和最小测试切口。 | design binding 已闭口;具体 04/05/06 内容属于 downstream pending。 |
| implementation handoff ownership | Step 17 已给出 03 -> 07 承接输入和 redline。 | Step 17 不替代 07,但“实现只能经 07 与台账开工”的 ownership 已闭口。 |

### 3. active risk candidate source family 思考

active risk candidate 不是最终风险表,而是后续 R18.6/R18.7 需要审计的来源族。候选只在仍可能影响 formal 03 装配、truth-source 闭口、downstream 移交或 implementation gate 时保留。

| candidate source family | 需要审计的问题 | 可能分类 |
|---|---|---|
| formal assembly source | Step 19 是否能从 Step 1~18 诚实装配正式 `03`,并排除旧 03 / 旧 Step 污染。 | formal 03 assembly blocker / historical pollution watch |
| truth-source closure source | Step 6~13 是否仍有字段来源、DTO/port/mapper/state/schema/ref/marker source 未闭口。 | design truth-source blocker |
| downstream doc source | 04/05/06/07 是否尚未按新版 03 重启或复核。 | downstream document pending |
| implementation gate source | 是否缺正式 07、implementation ledger、boundary ledger、target repo、required_reads、commit gate。 | implementation start blocker |
| production adapter source | durable store、broker、metrics、DLQ、integration evidence、真实相邻仓 adapter 是否尚未选型。 | production / operations follow-up |
| historical pollution source | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox 等旧词是否可能被 Step 19 误装配。 | historical pollution watch |

### 4. 四类分类方式思考

R18.6 应优先给出分类方法,避免 R18.7 写最终风险表时把不同性质的问题混在一起。

| 分类 | 判断问题 | 处理原则 |
|---|---|---|
| closed risk | 当前 Step 1~17 是否已经提供正式来源和禁止推断规则? | 写入 closed list,不进入 active risk table。 |
| active risk candidate | 是否仍可能阻塞 formal 03、truth-source 闭口、下游移交或实现开工? | 进入 R18.6 source audit,后续 R18.7/R18.8 再决定是否进最终风险表。 |
| downstream pending | 问题是否属于 04/05/06/07 正常生成 / 复核职责,而非 Step 3~17 自身不闭合? | 标 owner 和未确认前不得实现 / 验收,不回写当前 Step 补设计。 |
| implementation start blocker | 是否阻塞代码开工,但不阻塞 Step 18 如实记录? | 作为开工门禁风险,后续交 07 / implementation ledger。 |

### 5. R18.6 写入计划思考

`R18.6 closed vs active risk classification:再写入` 应把本模块思考落成可恢复记录:

1. 写 closed risk list,按 Step 1~17 source family 列出“已关闭风险不再列入表”。
2. 写 active risk candidate source audit,只列候选来源族和需要审计的问题。
3. 写 closed risk / active risk candidate / downstream pending / implementation start blocker 分类规则表。
4. 写 `R18.7 risk table candidates:先思考` 进入门禁。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 6. R18.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 closed vs active risk classification | pass |
| 是否形成 closed risk 判定思考 | pass |
| 是否形成 active risk candidate source family 思考 | pass |
| 是否形成四类分类方式思考 | pass |
| 是否形成 R18.6 写入计划 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.6 closed vs active risk classification:再写入`;只允许写入 closed risk list、active risk candidate source audit、closed risk / active risk candidate / downstream pending / implementation start blocker 分类规则表和 `R18.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.6 closed vs active risk classification:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.5` 推进到 `R18.6`。 |
| 本模块写入范围 | closed risk list、active risk candidate source audit、closed risk / active risk candidate / downstream pending / implementation start blocker 分类规则表和 `R18.7` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. closed risk list

| closed risk family | 关闭依据 | 不再列入 active 风险表的原因 |
|---|---|---|
| historical material reset | Step 1~2 | 旧 `03`、旧 Step completed、旧 P0/P1、旧 `MethodContent`、旧 publish/snapshot/outbox 主线已被降级为 historical material。 |
| implementation shape | Step 3~5 | runtime、仓库约束、实现布局、七实现单元和依赖方向已收稳,不再恢复旧 crate / module / path。 |
| object contract closure | Step 6 | 对象、ref、marker、state owner、body-free shell 和字段来源主轴已建立,已闭口对象不再作为 active risk。 |
| port / adapter / protocol closure | Step 7~8 | port、adapter、repository、resolver、public protocol shell 已建立,已闭合 DTO / port 不再作为待确认事项。 |
| flow / state / persistence closure | Step 9~11 | 函数级 flow、状态机、持久化、事务、repository key 和 consistency 口径已建立。 |
| error / idempotency / concurrency closure | Step 12~13 | safe error、recovery、duplicate replay、race、commit unknown 和 reentry 口径已收敛。 |
| config / observability / test cut closure | Step 14~16 | config/dependency binding、observability/audit/redaction 和最小测试切口已有 detailed design 输入。 |
| implementation handoff ownership | Step 17 | Step 17 已明确 implementation 只能经正式 `07` 和 implementation ledger / boundary gate 开工。 |

### 3. active risk candidate source audit

| candidate source family | 需要继续审计的问题 | 候选分类 | 后续落点 |
|---|---|---|---|
| formal assembly source | Step 19 是否能从 Step 1~18 诚实装配正式 `03`,并排除旧 03 / 旧 Step 污染。 | formal 03 assembly blocker / historical pollution watch | R18.7/R18.8 risk candidate;R18.11/R18.12 Step 19 gate |
| truth-source closure source | Step 6~13 是否仍有字段来源、DTO / port / mapper / state / schema / ref / marker source 未闭口。 | design truth-source blocker | R18.7/R18.8 risk candidate;必要时回 owning Step |
| downstream doc source | 04/05/06/07 是否尚未按新版 03 重启、生成或复核。 | downstream document pending | R18.7/R18.10 risk / open question candidate |
| implementation gate source | 是否缺正式 07、implementation ledger、boundary ledger、target repo、required_reads 或 commit gate。 | implementation start blocker | R18.7/R18.10 risk / open question candidate |
| production adapter source | durable store、broker、metrics、DLQ、integration evidence、真实相邻仓 adapter 是否尚未选型。 | production / operations follow-up | R18.7/R18.10 candidate,不阻塞 detailed design completion |
| historical pollution source | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox 等旧词是否可能被 Step 19 误装配。 | historical pollution watch | R18.7/R18.8 risk candidate;Step 19 exclusion rule |

### 4. 分类规则表

| 分类 | 判定问题 | 处理规则 | 不得做的事 |
|---|---|---|---|
| closed risk | Step 1~17 是否已经提供正式来源、禁止推断规则和 owner。 | 进入 closed list,不进入 active risk table。 | 不得把已闭口对象、DTO、flow、state、error、test cut 重复写成待确认。 |
| active risk candidate | 是否仍可能阻塞 formal 03、truth-source 闭口、下游移交或实现开工。 | 进入 source audit,后续 R18.7/R18.8 再决定是否进入最终风险表。 | 不得在 R18.6 直接写最终风险表结论。 |
| downstream pending | 是否属于 04/05/06/07 正常生成 / 复核职责,而非 Step 3~17 自身不闭合。 | 标 downstream owner 和未确认前不得实现 / 验收。 | 不得在 Step 18 代写 config、TC、acceptance 或 implementation plan。 |
| implementation start blocker | 是否阻塞代码开工,但不阻塞 Step 18 如实记录。 | 后续交给 `07` 和 implementation ledger / boundary gate。 | 不得在 Step 18 创建 phase / commit boundary、allowed_scope 或 required_checks。 |
| design truth-source blocker | 是否缺 schema / port / DTO / state / mapper / config / evidence / phase 的正式来源。 | 标 owning Step,必要时回写设计闭口。 | 不得交给实现 agent 自行补口。 |

### 5. R18.7 进入门禁

`R18.7 risk table candidates:先思考` 只允许思考:

1. 哪些 active risk candidate 应进入风险表候选。
2. 风险表候选的列结构:风险、影响、阻塞范围、缓解方式、负责人 / 待确认方。
3. 哪些 candidate 只属于待确认事项表,不应进入风险表。
4. 哪些 closed risk 只在 closed list 保留,不再重复出现。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 6. R18.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 closed risk list | pass |
| 是否写入 active risk candidate source audit | pass |
| 是否写入分类规则表 | pass |
| 是否形成 R18.7 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.7 risk table candidates:先思考`;只允许思考 active risk candidate 到风险表候选的筛选、风险表候选列结构、risk candidate vs open question candidate 分界、closed risk 不重复出现规则和 R18.8 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.7 risk table candidates:先思考

### 1. 当前模块目标

`R18.7` 只思考哪些 active risk candidate 应进入风险表候选、候选表需要哪些列、risk candidate 与 open question candidate 如何分界、closed risk 如何避免重复出现,并形成 `R18.8` 写入计划。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.6` 推进到 `R18.7`。 |
| 当前允许 | 思考 active risk candidate 到风险表候选的筛选、候选列结构、risk vs open question 分界、closed risk 不重复出现规则和 R18.8 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. risk table candidate 筛选原则

风险表候选必须满足“仍可能影响移交或实现”的条件。仅仅是后续文档尚未生成,不自动升级为 detailed design blocker;但如果缺口会让实现者在开工前自行决定 schema、port、DTO、state、mapper、config、test evidence 或 phase boundary,则必须进入候选。

| 筛选问题 | 进入 risk table candidate 的条件 | 不进入 risk table candidate 的条件 |
|---|---|---|
| 是否影响 formal `03` 装配 | 会导致 Step 19 把旧材料、未确认表格或不闭口契约装配成正式正文。 | 只是 Step 19 正常装配任务,且来源已经明确。 |
| 是否影响 truth-source closure | Step 6~13 若发现字段来源、public marker、mapper、state 或 replay surface 不闭口。 | Step 6~13 已有正式来源,只是后续实现需要按文档编写代码。 |
| 是否影响 downstream handoff | 04/05/06/07 缺失会让配置、测试、验收或实施边界被实现侧补口。 | 只是下游文档按新版 `03` 正常生成,不改变当前 detailed design 契约。 |
| 是否影响 implementation start | 缺正式 `07`、implementation ledger、boundary ledger、allowed_scope 或 required_checks。 | 只是实施计划后续排期或任务组织,不影响开工门禁。 |
| 是否影响 production / acceptance | durable adapter、broker、metrics、DLQ、真实 integration evidence 未确定。 | fake / fixture / unavailable 语义已足够支撑 design completion。 |
| 是否有 historical pollution | 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox 等旧词可能被 Step 19 误装配。 | 旧材料只作为 historical material,且 Step 19 明确排除。 |

### 3. 候选风险池思考

下表不是最终风险表,只表达 R18.8 应写入的候选方向。R18.8 写入时仍需标明候选状态,并避免把 open question 或 closed risk 重复写成风险。

| source family | 候选风险方向 | 为什么可能是风险 | 初步阻塞范围 |
|---|---|---|---|
| formal assembly source | 正式 `03-详细设计.md` 尚未由 Step 19 从本轮 Step 1~18 装配。 | 旧正式 `03` 仍是 historical material,若被直接移交会污染实现真相源。 | 阻塞正式 `03` 移交和 implementation source baseline。 |
| historical pollution source | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 旧主线可能进入 Step 19。 | 这些词来自旧材料,不是当前 L3-method-library 的正向设计结论。 | 阻塞 formal 03 assembly pass。 |
| downstream doc source | `04/05/06/07` 尚未按新版 `03` 生成或复核。 | 若缺下游文档,实现者可能自行补 config schema、TC/evidence、acceptance gate 或 phase boundary。 | 阻塞配置 / 测试 / 验收 / 实施移交,不自动阻塞 Step 18 完成。 |
| implementation gate source | 正式 `07`、implementation ledger、boundary ledger、current boundary gate 尚未形成。 | 没有 per-boundary required_reads、allowed_scope、forbidden_scope 和 required_checks,代码开工会失去边界。 | 阻塞 implementation start。 |
| production adapter source | durable store、broker、metrics、DLQ、真实相邻仓 adapter、integration evidence 未选型。 | 详细设计可定义 port / adapter 语义,但真实产品和运维证据需要下游配置、测试、实施或运维文档承接。 | 不阻塞 design completion;阻塞 production adapter / acceptance。 |
| truth-source closure source | 若 R18.8 或 Step 19 发现 Step 6~13 仍有具体 schema / port / marker / mapper / state source 缺口。 | 这类缺口不能交给实现 agent 推断。 | 阻塞对应 owning Step 闭口和 formal assembly;当前仅保留 watch,不预设已有缺口。 |

### 4. risk candidate vs open question candidate 分界

同一来源可能同时产生风险和待确认事项,但二者不能混写。风险表描述“如果不处理会造成什么系统性影响”,待确认事项描述“需要谁确认什么决定,未确认前怎么处理”。

| 来源 | 更适合进入风险候选的表达 | 更适合进入待确认候选的表达 |
|---|---|---|
| formal `03` 未装配 | 旧 `03` 被误当作实现真相源。 | Step 19 由谁确认正式 `03` 装配完成。 |
| historical pollution | 旧对象 / 旧主线误入 formal assembly。 | Step 19 如何处置旧章节、旧术语和旧回填草稿。 |
| 04/05/06/07 downstream | 下游缺口导致实现侧补 config / test / acceptance / boundary。 | 04/05/06/07 何时按新版 `03` 生成或复核,由谁确认。 |
| implementation gate | 缺 boundary ledger 使实现无法合法开工。 | 当前实现仓、git config、current boundary、required_reads 由谁确认。 |
| production adapter | fake 可闭环但真实产品证据不可验收。 | durable store、broker、metrics、DLQ、相邻仓 adapter 选择由谁确认。 |
| truth-source gap watch | 若发现具体 Step 6~13 缺口,实现侧会被迫补口。 | 该缺口由哪个 owning Step / 维护者闭口。 |

### 5. closed risk 不重复出现规则

R18.8 写风险表候选时,不得为了显得完整而重复列 Step 1~17 已关闭的风险。closed risk 只能作为“已关闭风险不再列入表”的上下文,不能再次变成 active risk。

| closed family | R18.8 处理规则 |
|---|---|
| Step 1~2 historical material reset | 不再写“旧 03 是否可信”为待确认;只写“Step 19 不得误装配旧材料”的污染风险。 |
| Step 3~5 implementation shape | 不再确认 runtime、布局、七实现单元和依赖方向。 |
| Step 6 object contract closure | 不重复列已定义对象字段、ref、marker 和 state owner。 |
| Step 7~8 port / protocol closure | 不重复列已定义 port、adapter、DTO、event、job shell。 |
| Step 9~11 flow / state / persistence closure | 不重复列已闭合 flow、state transition、repository key、transaction consistency。 |
| Step 12~13 error / idempotency closure | 不重复列 duplicate replay、commit unknown、retry、race 和 reentry 为待确认。 |
| Step 14~16 config / observability / test cut closure | 不重复列 detailed design binding 点;只把正式 04/05/06 生成或复核作为下游 pending。 |
| Step 17 implementation handoff ownership | 不重复争论 Step 17 是否能替代 07;已裁决不能替代。 |

### 6. R18.8 写入计划思考

`R18.8 risk table candidates:再写入` 应把本模块思考落成候选表,但仍不写最终 formal §17 正文:

1. 写 risk table candidate selection rule。
2. 写候选风险表,建议包含 `候选风险`、`影响`、`阻塞范围`、`缓解方式`、`负责人 / 待确认方`、`候选状态`。
3. 对 `truth-source closure source` 只写 watch candidate;若没有具体缺口,不得伪造 blocker。
4. 写 excluded closed risk table,说明哪些已关闭项不进入风险表。
5. 写 `R18.9 open question table candidates:先思考` 进入门禁。
6. 不写最终风险表、不写待确认事项表、不修改正式 `03-详细设计.md`。

### 7. R18.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 risk table candidates | pass |
| 是否形成筛选原则 | pass |
| 是否形成候选风险池思考 | pass |
| 是否区分 risk candidate 与 open question candidate | pass |
| 是否形成 closed risk 不重复出现规则 | pass |
| 是否形成 R18.8 写入计划 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.8 risk table candidates:再写入`;只允许写入 risk table candidate selection rule、候选风险表、excluded closed risk table 和 `R18.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.8 risk table candidates:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.7` 推进到 `R18.8`。 |
| 本模块写入范围 | risk table candidate selection rule、候选风险表、excluded closed risk table 和 `R18.9` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. risk table candidate selection rule

R18.8 的候选风险表只用于后续收敛,不是正式 §17 风险表。候选风险必须描述“若不处理会造成的系统性影响”;具体“谁确认什么决定”后续进入 R18.9/R18.10 待确认事项候选。

| 规则 | R18.8 写法 |
|---|---|
| 候选状态必须显式 | 每一项都写 `candidate`、`watch candidate` 或 `downstream candidate`,不得写成 completed / final。 |
| 阻塞范围必须显式 | 会阻塞 formal assembly、downstream handoff、implementation start、production adapter 或 acceptance 的事项必须写清。 |
| owner 必须显式 | 每一项都要有负责人 / 待确认方,避免交给 implementation agent 自行补口。 |
| closed risk 不重复 | Step 1~17 已闭口的对象、port、protocol、flow、state、persistence、error、idempotency、config binding、observability、test cut 不再重复进候选风险。 |
| truth-source gap 不脑补 | 若当前没有发现具体 Step 6~13 缺口,只写 watch candidate,不得伪造 blocker。 |
| 下游 pending 不越界 | 04/05/06/07 未生成可以进入风险候选,但 R18.8 不替它们写 schema、TC、验收门禁或 commit boundary。 |

### 3. 候选风险表

| 候选风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 | 候选状态 |
|---|---|---|---|---|---|
| 正式 `03-详细设计.md` 尚未由 Step 19 从本轮 Step 1~18 装配 | 旧正式 `03` 仍是 historical material,若被直接移交会污染实现真相源。 | 阻塞 formal `03` 移交和 implementation source baseline。 | Step 19 只能从已确认的 Step 1~18 中间产物装配正式 `03`,并执行来源映射和禁入项检查。 | 详细设计维护者 / 用户 | candidate |
| Step 19 误装配旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 旧主线 | 实现者可能按旧对象、旧流程或旧章节结构还原代码。 | 阻塞 formal assembly pass。 | Step 19 使用 Step 1~2 reset 规则、Step 17 禁入项和本 Step pollution watch 排除旧材料。 | 详细设计维护者 | candidate |
| `04-配置设计.md` 尚未按新版 `03` 重启或生成 | 具体 config schema、profile、env、secret、adapter binding 可能被实现侧补口。 | 阻塞 production config handoff;不阻塞当前 detailed design 记录完成。 | 后续 `04` 从 Step 14、Step 17 和正式 `03` 生成,不得由实现仓补配置真相源。 | 配置设计维护者 | downstream candidate |
| `05-测试方案.md` 尚未按新版 `03` 重启或复核 | TC、suite、fixture、run artifact、report schema 可能继承旧对象或被实现侧发明。 | 阻塞正式 test handoff 和 evidence 口径。 | 后续 `05` 从 Step 16、Step 17 和正式 `03` 生成 / 复核。 | 测试方案维护者 | downstream candidate |
| `06-验收标准.md` 尚未按新版 `03` 重启或复核 | release gate、veto、验收 evidence、禁止 synthetic marker / raw body 等红线可能不闭合。 | 阻塞 acceptance / release gate 口径。 | 后续 `06` 从需求验收红线、Step 16、Step 17 和正式 `03` 生成 / 复核。 | 验收标准维护者 | downstream candidate |
| `07-实施计划.md`、implementation ledger 和 boundary ledger 尚未形成 | 没有 current boundary、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate 和 Handoff Gate,实现无法合法开工。 | 阻塞 implementation start。 | 后续 `07` 按正式 `03/05/06/07` 审计后创建实施计划、项目级台账和 boundary 台账。 | 实施计划维护者 / implementation agent | candidate |
| durable store、broker、metrics、DLQ、真实相邻仓 adapter 和 integration evidence 未选型 | fake / fixture / unavailable 语义可闭环,但真实 adapter、运维证据和生产验收无法完成。 | 不阻塞 design completion;阻塞 production adapter / acceptance。 | 保持 domain / application 只依赖正式 port 和 safe marker;产品选择交 04/07/运维或 adapter design。 | 架构 / 配置 / 运维 / 相邻仓负责人 | downstream candidate |
| Step 6~13 truth-source closure 仍需在 Step 19 前保持 watch | 若 Step 19 发现具体字段来源、public marker、mapper、state、schema、stored surface 或 replay source 缺口,实现侧不能补口。 | 当前不预设 blocker;若发现具体缺口,阻塞 owning Step 闭口和 formal assembly。 | Step 19 装配前用 Step 17 pre-audit 维度复核;发现具体缺口则回 owning Step,不得交给实现者。 | 详细设计维护者 / owning Step 维护者 | watch candidate |

### 4. excluded closed risk table

| 已关闭风险族 | 排除原因 | 后续若再次出现的处理 |
|---|---|---|
| 输入边界和旧材料 reset | Step 1~2 已裁决旧正式 `03` 和旧 Step completed 状态只作 historical material。 | 作为 historical pollution watch,不重新打开输入边界。 |
| runtime / 仓库 / 布局 / 模块主轴 | Step 3~5 已收稳实现约束、文件布局、七实现单元和依赖方向。 | 若 Step 19 发现旧 crate/path 进入正文,按污染处理。 |
| object / ref / marker / state owner | Step 6 已给出对象契约和字段来源主轴。 | 只有发现具体字段来源缺口时,回 Step 6/9/11 闭口。 |
| port / adapter / protocol shell | Step 7~8 已给出 port、adapter、repository、resolver、public DTO / command / query / event / job shell。 | 只有发现具体 public surface 或 mapper source 缺口时,回 Step 7/8 闭口。 |
| function flow / state / persistence | Step 9~11 已给出函数流、状态机、repository key、事务和 consistency 口径。 | 只有发现 flow 要求与 persistence surface 冲突时,回 owning Step。 |
| error / recovery / concurrency / idempotency | Step 12~13 已收敛 safe error、duplicate replay、commit unknown、race 和 reentry 规则。 | 不把 retry / replay / race 重新写成待确认,除非出现新 source 冲突。 |
| config binding / observability / test cut | Step 14~16 已定义详细设计层绑定点、审计埋点和最小测试切口。 | 下游 04/05/06 负责正式 schema、case、acceptance,不由当前 Step 重写。 |
| implementation handoff ownership | Step 17 已裁决 implementation 只能经正式 `07` 和 ledger gate 开工。 | 不再争论 Step 17 是否可替代 `07`;只记录 `07` 未生成的开工风险。 |

### 5. R18.9 进入门禁

`R18.9 open question table candidates:先思考` 只允许思考:

1. 哪些 risk candidates 需要拆成待确认事项。
2. 待确认事项表的候选列结构:事项、当前影响、需要谁确认、未确认前的处理方式。
3. 哪些风险只需保留在风险表候选,不必进入待确认事项。
4. downstream owner、implementation gate owner、production adapter owner 和 detailed design maintainer 如何分配。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 6. R18.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 risk table candidate selection rule | pass |
| 是否写入候选风险表 | pass |
| 是否显式保留候选状态而非最终风险表 | pass |
| 是否写入 excluded closed risk table | pass |
| 是否形成 R18.9 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.9 open question table candidates:先思考`;只允许思考哪些 risk candidates 需要拆成待确认事项、待确认事项表候选列结构、风险表候选与待确认事项候选的分界、owner 分配和 R18.10 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.9 open question table candidates:先思考

### 1. 当前模块目标

`R18.9` 只思考哪些 risk candidates 需要拆成待确认事项、待确认事项表候选列结构、风险表候选与待确认事项候选的分界、owner 分配和 `R18.10` 写入计划。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.8` 推进到 `R18.9`。 |
| 当前允许 | 思考 risk candidates 如何拆成待确认事项候选、候选列结构、risk-only 与 question candidate 分界、owner 分配和 R18.10 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. open question candidate 筛选思考

待确认事项候选必须回答“需要谁确认什么,未确认前怎么处理”。它不重复描述系统性影响;系统性影响已经在 R18.8 风险候选中表达。若一个事项只需要持续 watch,但当前没有具体确认动作,则不进入 R18.10 的候选待确认事项表。

| 筛选问题 | 进入 open question candidate 的条件 | 不进入 open question candidate 的条件 |
|---|---|---|
| 是否有明确待确认动作 | 需要确认是否生成、复核、装配、排除、推进或选型。 | 只有抽象风险,没有具体确认动作。 |
| 是否有明确确认方 | 能指向 detailed design maintainer、04/05/06/07 owner、implementation agent、adapter owner 或用户。 | 只能笼统写“待确认”,没有 owner。 |
| 是否有未确认前处理方式 | 可以写出暂停、不得开工、不得装配、不得补口、只能 fake / unavailable 等处理。 | 未确认前处理方式无法落到行动约束。 |
| 是否与风险表重复 | 待确认事项写“决策 / 确认动作”,不重复风险影响全文。 | 已由风险表候选表达且没有额外确认动作。 |
| 是否属于已关闭风险 | closed risk 已有正式来源和禁止推断规则。 | 不进入待确认事项表。 |

### 3. risk candidates 到待确认事项候选的拆分思考

| R18.8 风险候选 | 是否需要拆成待确认事项 | 待确认动作方向 |
|---|---|---|
| 正式 `03-详细设计.md` 尚未由 Step 19 装配 | 需要 | 确认 Step 19 何时从本轮 Step 1~18 装配正式 `03`,以及谁确认装配完成。 |
| Step 19 误装配旧主线污染 | 需要 | 确认 Step 19 如何排除旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 等旧材料。 |
| `04-配置设计.md` 尚未按新版 `03` 重启或生成 | 需要 | 确认 `04` 何时按 Step 14、Step 17 和正式 `03` 生成,未生成前不得由实现补配置真相源。 |
| `05-测试方案.md` 尚未按新版 `03` 重启或复核 | 需要 | 确认 `05` 何时按 Step 16 和正式 `03` 重启 / 复核,未确认前不得声称测试覆盖或 evidence schema 已定。 |
| `06-验收标准.md` 尚未按新版 `03` 重启或复核 | 需要 | 确认 `06` 何时按新版 `03` 固定 acceptance gate、veto 和 release evidence。 |
| `07-实施计划.md`、implementation ledger 和 boundary ledger 尚未形成 | 需要 | 确认 `07` 何时生成 phase / boundary gate、current boundary、required_reads 和 implementation ledger。 |
| durable store、broker、metrics、DLQ、真实 adapter 和 integration evidence 未选型 | 需要 | 确认生产 adapter / 运维 / 相邻仓 owner 如何选择产品和真实 evidence 范围。 |
| Step 6~13 truth-source closure watch | 暂不进入具体 open question,除非 Step 19 发现具体缺口 | 当前只保留 watch;若出现具体 schema / port / marker / mapper / state source 缺口,再生成 owning Step 待确认项。 |

### 4. 待确认事项表候选列结构思考

正式书写规范要求待确认事项表使用四列:`事项`、`当前影响`、`需要谁确认`、`未确认前的处理方式`。R18.10 可以在中间产物中补充候选状态,但 formal §17 候选后续应回到规范四列或显式说明状态列只属于 calibration。

| 列 | R18.10 写法要求 |
|---|---|
| 事项 | 写成具体确认动作,例如“Step 19 正式 `03` 装配确认”,不要写抽象风险名。 |
| 当前影响 | 写未确认对 formal assembly、downstream handoff、implementation start、production adapter 或 acceptance 的影响。 |
| 需要谁确认 | 写具体 owner / confirmer,不得只写“待确认”。 |
| 未确认前的处理方式 | 写实现者和文档维护者的限制,例如不得装配、不得开工、不得补口、只能 fake / unavailable。 |
| 候选状态 | 若 R18.10 增加该列,只能写 candidate / downstream candidate / watch,不得写 final。 |

### 5. owner 分配思考

| owner family | 适用事项 | 未确认前原则 |
|---|---|---|
| 详细设计维护者 / 用户 | Step 19 formal `03` 装配、旧材料排除、formal §17 候选收敛。 | 不得把旧正式 `03` 或未确认候选交给实现。 |
| `04-配置设计.md` owner | config schema、profile、env、secret、adapter binding、concrete product binding。 | 实现仓不得发明 config key、default、topic、URL 或 secret source。 |
| `05-测试方案.md` owner | TC、suite、fixture、run artifact、report schema、script evidence。 | 实现者不得自行声明 case coverage 或 evidence schema。 |
| `06-验收标准.md` owner | acceptance gate、release veto、coverage / evidence threshold、manual approval。 | 不得把测试通过等同于正式验收通过。 |
| `07-实施计划.md` owner / implementation agent | phase、commit boundary、implementation ledger、allowed_scope、required_checks、target repo / git config。 | 缺 current boundary ledger 时不得改实现仓。 |
| 架构 / 配置 / 运维 / adapter owner | durable store、broker、metrics、DLQ、真实相邻仓 adapter、integration evidence。 | detailed design 只能保留 port / fake / unavailable 语义。 |
| owning Step 维护者 | Step 19 若发现具体 Step 6~13 truth-source 缺口。 | 回 owning Step 闭口,不得实现侧补 schema / port / marker / mapper。 |

### 6. risk-only 与 question candidate 分界思考

| 类型 | R18.10 处理 |
|---|---|
| 有明确确认动作的风险 | 拆成待确认事项候选。 |
| 只有系统性影响但无确认动作的风险 | 保留在风险候选,不进入待确认事项候选。 |
| downstream document pending | 进入待确认事项候选,因为需要文档 owner 确认生成 / 复核。 |
| production adapter pending | 进入待确认事项候选,因为需要 adapter / 运维 owner 确认产品和 evidence。 |
| truth-source closure watch | 暂不进入待确认事项候选;只有发现具体缺口时才建立 owning Step 待确认项。 |
| closed risk | 不进入待确认事项候选。 |

### 7. R18.10 写入计划思考

`R18.10 open question table candidates:再写入` 应把本模块思考落成候选表,但仍不写最终 formal §17 正文:

1. 写 open question candidate selection rule。
2. 写候选待确认事项表,建议包含 `候选事项`、`当前影响`、`需要谁确认`、`未确认前的处理方式`、`候选状态`。
3. 写 risk-only / excluded question table,说明哪些风险不进入待确认事项表。
4. 写 owner assignment table 或将 owner 写入候选表。
5. 写 `R18.11 unresolved handling and Step 19 gate:先思考` 进入门禁。
6. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 8. R18.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 open question table candidates | pass |
| 是否形成 open question candidate 筛选思考 | pass |
| 是否形成 risk candidates 到待确认事项候选的拆分思考 | pass |
| 是否形成待确认事项表候选列结构 | pass |
| 是否形成 owner 分配思考 | pass |
| 是否形成 risk-only 与 question candidate 分界 | pass |
| 是否形成 R18.10 写入计划 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.10 open question table candidates:再写入`;只允许写入 open question candidate selection rule、候选待确认事项表、risk-only / excluded question table、owner assignment 和 `R18.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.10 open question table candidates:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.9` 推进到 `R18.10`。 |
| 本模块写入范围 | open question candidate selection rule、候选待确认事项表、risk-only / excluded question table、owner assignment 和 `R18.11` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. open question candidate selection rule

R18.10 的待确认事项表仍是候选表,不是正式 §17 终稿。候选事项必须写清“确认动作、当前影响、确认方、未确认前处理方式”。只描述抽象风险而没有确认动作的项,继续保留在 R18.8 风险候选或 watch 里。

| 规则 | R18.10 写法 |
|---|---|
| 确认动作必须具体 | 写“装配确认、排除确认、生成确认、复核确认、开工门禁确认、产品 / evidence 选型确认”,不写空泛“待确认”。 |
| 确认方必须具体 | 指向详细设计维护者、04/05/06/07 owner、implementation agent、架构 / 运维 / adapter owner 或用户。 |
| 未确认前处理必须可执行 | 写不得装配、不得开工、不得补 schema / config / evidence / phase、只能 fake / unavailable 等限制。 |
| 候选状态必须保留 | 当前只写 candidate / downstream candidate / production candidate / watch handling,不得写 final。 |
| formal 格式后续收敛 | formal §17 候选后续应回到规范四列;本表额外的 `候选状态` 只属于 calibration。 |

### 3. 候选待确认事项表

| 候选事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 | 候选状态 |
|---|---|---|---|---|
| Step 19 正式 `03-详细设计.md` 装配确认 | 未确认前,旧正式 `03` 仍不能作为新版实现真相源。 | 详细设计维护者 / 用户 | 不按旧 `03` 开工;不把 Step 1~18 中间产物直接当正式移交文档。 | candidate |
| Step 19 旧材料排除确认 | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 等旧主线可能污染 formal assembly。 | 详细设计维护者 | Step 19 装配时必须显式排除旧材料;若需保留事实,必须回指当前 `00/01/02` 或本轮 Step。 | candidate |
| `04-配置设计.md` 按新版 `03` 生成确认 | config schema、profile、env、secret、adapter binding 和 concrete product binding 缺正式下游真相源。 | 配置设计维护者 | 实现仓不得发明 config key、default、topic、URL、secret source 或产品绑定。 | downstream candidate |
| `05-测试方案.md` 按新版 `03` 重启 / 复核确认 | TC、suite、fixture、run artifact、report schema 可能继承旧口径或被实现侧补口。 | 测试方案维护者 | 不声称正式测试覆盖;不由实现 agent 自行定义 evidence schema 或 case mapping。 | downstream candidate |
| `06-验收标准.md` 按新版 `03` 重启 / 复核确认 | acceptance gate、release veto、coverage / evidence threshold 和 manual approval 口径未正式收敛。 | 验收标准维护者 | 不把 cargo / unit test 通过等同于正式验收通过;不自行写 release gate。 | downstream candidate |
| `07-实施计划.md` 与 implementation ledger / boundary ledger 生成确认 | 缺 current boundary、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate 和 Handoff Gate。 | 实施计划维护者 / implementation agent | 不写实现仓代码、不拆 phase / commit boundary、不提交实现仓。 | candidate |
| 目标实现仓、git config 和 current boundary 开工确认 | 即使正式 `07` 存在,仍需每个 boundary 开工前确认目标仓、git user、clean status 和 required reads。 | implementation agent / 实施计划维护者 | 缺当前 boundary 台账或 gate 未通过时不得改代码。 | candidate |
| durable store / broker / metrics / DLQ / diagnostic /真实 adapter 选型确认 | fake / fixture / unavailable 语义可支撑设计闭环,但生产 adapter 和 integration evidence 不可验收。 | 架构 / 配置 / 运维 / adapter owner / 相邻仓负责人 | domain / application 只保留正式 port、safe marker 和 fake / unavailable 语义;不得写死产品。 | production candidate |
| Step 19 truth-source watch 处理确认 | 若 Step 19 发现具体 schema / port / marker / mapper / state / stored surface / replay source 缺口,需要明确回哪个 owning Step。 | 详细设计维护者 / owning Step 维护者 | 当前不伪造 blocker;一旦发现具体缺口,暂停 formal assembly 并回 owning Step 闭口。 | watch handling |

### 4. risk-only / excluded question table

| 来源 | 不进入候选待确认事项表的原因 | 保留位置 |
|---|---|---|
| Step 6~13 已闭合对象、port、protocol、flow、state、persistence、error、idempotency | 已有正式设计来源,没有新的确认动作。 | closed risk list / excluded closed risk table |
| Step 14~16 已定义 detailed design binding / observability / test cut | 当前详细设计层已闭口;完整配置、测试、验收进入 04/05/06 待确认。 | closed risk list;下游文档候选事项 |
| 抽象 truth-source closure watch | 当前未发现具体缺口,不能写成“待确认某缺口”。 | R18.8 watch candidate;Step 19 gate watch |
| 旧 `03` 是否可信 | Step 1~2 已裁决旧 `03` 不是当前真相源,不再待确认。 | historical pollution rule |
| Step 17 是否可替代 `07` | Step 17 已裁决不能替代正式 `07`。 | excluded closed risk table |

### 5. owner assignment

| owner | 候选事项 | 当前责任 |
|---|---|---|
| 详细设计维护者 / 用户 | Step 19 formal `03` 装配、旧材料排除、truth-source watch 处理。 | 决定是否可进入 Step 19 装配;发现具体缺口时回 owning Step。 |
| 配置设计维护者 | `04-配置设计.md` 生成。 | 按 Step 14、Step 17 和正式 `03` 生成配置真相源。 |
| 测试方案维护者 | `05-测试方案.md` 重启 / 复核。 | 按 Step 16、Step 17 和正式 `03` 生成 TC / suite / evidence schema。 |
| 验收标准维护者 | `06-验收标准.md` 重启 / 复核。 | 固定 acceptance gate、release veto 和 evidence 口径。 |
| 实施计划维护者 / implementation agent | `07`、implementation ledger、boundary ledger、目标仓、git config、current boundary。 | 未形成正式 gate 前不得开工;每个 boundary 按台账执行。 |
| 架构 / 配置 / 运维 / adapter owner / 相邻仓负责人 | durable products、broker、metrics、DLQ、diagnostic、真实 adapter 和 integration evidence。 | 后续生产化或 adapter design 中确认具体产品与证据范围。 |

### 6. R18.11 进入门禁

`R18.11 unresolved handling and Step 19 gate:先思考` 只允许思考:

1. R18.8/R18.10 候选项未确认前,实现者和 Step 19 装配者应该如何处理。
2. 哪些事项阻塞 Step 19 formal assembly,哪些只阻塞 downstream handoff、implementation start、production adapter 或 acceptance。
3. 发现具体 truth-source 缺口时如何回 owning Step,而不是交给实现 agent。
4. Step 19 entry gate 应包含哪些 pass / stop 条件。
5. 不写最终风险表、不写最终待确认事项表、不修改正式 `03-详细设计.md`。

### 7. R18.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 open question candidate selection rule | pass |
| 是否写入候选待确认事项表 | pass |
| 是否显式保留候选状态而非最终待确认事项表 | pass |
| 是否写入 risk-only / excluded question table | pass |
| 是否写入 owner assignment | pass |
| 是否形成 R18.11 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.11 unresolved handling and Step 19 gate:先思考`;只允许思考候选项未确认前处理规则、阻塞范围分层、truth-source 缺口回 owning Step 规则、Step 19 entry gate pass / stop 条件和 R18.12 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.11 unresolved handling and Step 19 gate:先思考

### 1. 当前模块目标

`R18.11` 只思考 R18.8/R18.10 候选项未确认前如何处理、阻塞范围如何分层、发现具体 truth-source 缺口时如何回 owning Step、Step 19 entry gate 应有哪些 pass / stop 条件,并形成 `R18.12` 写入计划。当前模块不写最终风险表、不写最终待确认事项表、不写 formal §17 candidate、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.10` 推进到 `R18.11`。 |
| 当前允许 | 思考候选项未确认前处理规则、阻塞范围分层、truth-source 缺口回 owning Step 规则、Step 19 entry gate pass / stop 条件和 R18.12 写入计划。 |
| 当前禁止 | 写最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. unresolved handling 原则思考

未确认事项不能被写成已确认契约,也不能被转嫁给 implementation agent。R18.12 应把处理规则写成“未确认前怎么做”,而不是“将来大概解决”。

| 原则 | 思考口径 |
|---|---|
| 不把候选表当 final | R18.8/R18.10 仍是候选,Step 19 只能装配经 Step 18 收口确认后的内容。 |
| 不把下游 pending 当详细设计缺口 | 04/05/06/07 未生成是 downstream pending;除非反向暴露 Step 3~17 不闭口,否则不阻塞 Step 18 完成。 |
| 不把 truth-source 缺口交给实现 | 若发现具体 schema / port / DTO / state / mapper / marker / evidence / phase source 缺口,必须回 owning Step 或下游正式文档闭口。 |
| 不用生产选型污染 core design | durable store、broker、metrics、DLQ、真实 adapter 未选型时,详细设计只保留 port / fake / unavailable / safe marker 语义。 |
| 不让旧材料回流 | Step 19 若看到旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 主线,必须按污染处理。 |

### 3. 阻塞范围分层思考

同一个候选项不能一律标成“阻塞全部”。R18.12 应写清每类事项阻塞哪里、未确认前谁停手。

| 候选类别 | 是否阻塞 Step 19 formal assembly | 是否阻塞 downstream handoff | 是否阻塞 implementation start | 是否阻塞 production / acceptance |
|---|---|---|---|---|
| 正式 `03` 尚未装配 | 是 | 是 | 是 | 间接阻塞 |
| 旧材料可能误装配 | 是 | 是 | 是 | 间接阻塞 |
| 04 未生成 | 否,但 Step 19 应标 downstream owner | 是,阻塞配置移交 | 是,若实现 boundary 需要 config 真相源 | 是 |
| 05 / 06 未重启或复核 | 否,但 Step 19 应标 downstream owner | 是,阻塞测试 / 验收移交 | 是,若 commit gate 依赖正式 test / acceptance | 是 |
| 07 / implementation ledger 缺失 | 否,但 Step 19 应标 implementation start rule | 是,阻塞实施移交 | 是 | 间接阻塞 |
| production adapter / product 未选型 | 否 | 否,除非 04/07 声称 production ready | 否,可做 fake / contract slice | 是 |
| 具体 truth-source 缺口 | 是,必须回 owning Step | 是 | 是 | 是 |

### 4. truth-source 缺口回 owning Step 思考

truth-source watch 不能一直停留在抽象层。R18.12 应写清一旦 Step 19 发现具体缺口,如何定位回对应 Step,并禁止实现侧 workaround。

| 缺口类型 | owning Step / 文档 | 未闭口前处理 |
|---|---|---|
| 对象字段来源、required field、state owner 不闭合 | Step 6 / Step 9 / Step 11 | 暂停 Step 19 对应章节装配;回 owning Step 补来源。 |
| port、repository、mapper、resolver、builder surface 不闭合 | Step 7 / Step 11 | 不让实现侧私加 trait、fake map 或反查规则。 |
| public DTO、command/query/event/job shell、marker source 不闭合 | Step 8 / Step 12 / Step 13 | 不合成 public marker;回 protocol / recovery / replay owning Step。 |
| flow 要求与 state / persistence / replay surface 冲突 | Step 9 / Step 10 / Step 11 / Step 13 | 不重排 flow 或在代码中重跑 duplicate;回设计闭口。 |
| config key、profile、env、secret、product binding 不闭合 | Step 14 / `04-配置设计.md` | 不在实现仓发明配置真相源。 |
| TC、suite、fixture、artifact schema、report path 不闭合 | Step 16 / `05-测试方案.md` | 不生成伪 evidence 或声称覆盖。 |
| acceptance gate、release veto、manual approval 不闭合 | `06-验收标准.md` | 不把测试通过当验收通过。 |
| phase、commit boundary、required_reads、allowed_scope 不闭合 | `07-实施计划.md` / implementation ledger | 不开工、不提交实现仓。 |

### 5. Step 19 entry gate 思考

Step 19 的入口不是“没有待确认项”,而是“待确认项不妨碍诚实装配正式 `03`,且阻塞范围、owner、未确认前处理方式已经写清”。R18.12 应将 pass / stop / defer 条件分开。

| gate 结果 | 判断条件 | Step 19 动作 |
|---|---|---|
| pass_to_step19 | R18.8/R18.10 候选项已分类;没有具体 Step 6~13 truth-source blocker;旧材料禁入清楚;downstream owner 清楚。 | 可进入 Step 19,只装配 confirmed source 和候选收口结论。 |
| stop_before_step19 | 发现具体 schema / port / DTO / state / mapper / marker / replay / persistence 缺口,或旧材料无法排除。 | 不进入 Step 19;回 owning Step 闭口。 |
| defer_to_downstream | 04/05/06/07 尚未生成,但当前 detailed design 真相源已闭口。 | Step 19 可记录 downstream pending,不得替下游写正文。 |
| defer_to_production | durable product / adapter / integration evidence 未选型,但 port / fake / unavailable 语义已闭口。 | Step 19 可记录 production follow-up,不得写死产品。 |
| block_implementation_start | `07`、implementation ledger 或 current boundary gate 不存在。 | Step 19 可完成正式 03,但实现不得开工。 |

### 6. R18.12 写入计划思考

`R18.12 unresolved handling and Step 19 gate:再写入` 应把本模块思考落成可恢复规则:

1. 写 unresolved handling rule table。
2. 写 blocking scope matrix,区分 formal assembly、downstream handoff、implementation start、production / acceptance。
3. 写 truth-source gap return route table。
4. 写 Step 19 entry gate pass / stop / defer table。
5. 写 `R18.13 formal §17 candidate stop-review:先思考` 进入门禁。
6. 不写最终风险表、最终待确认事项表、不修改正式 `03-详细设计.md`。

### 7. R18.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 unresolved handling and Step 19 gate | pass |
| 是否形成未确认前处理原则 | pass |
| 是否形成阻塞范围分层思考 | pass |
| 是否形成 truth-source 缺口回 owning Step 思考 | pass |
| 是否形成 Step 19 entry gate pass / stop / defer 思考 | pass |
| 是否形成 R18.12 写入计划 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.12 unresolved handling and Step 19 gate:再写入`;只允许写入 unresolved handling rule table、blocking scope matrix、truth-source gap return route table、Step 19 entry gate pass / stop / defer table 和 `R18.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终风险表、最终待确认事项表、formal §17 candidate、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.12 unresolved handling and Step 19 gate:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.11` 推进到 `R18.12`。 |
| 本模块写入范围 | unresolved handling rule table、blocking scope matrix、truth-source gap return route table、Step 19 entry gate pass / stop / defer table 和 `R18.13` 进入门禁。 |
| 本模块禁止范围 | 最终风险表、最终待确认事项表、formal §17 candidate、正式 `03-详细设计.md`、Step 19 装配、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. unresolved handling rule table

| 场景 | 未确认前处理规则 | 不得做的事 |
|---|---|---|
| R18.8/R18.10 仍是候选状态 | Step 19 只能引用经 Step 18 收口后的 confirmed candidate 结论。 | 不得把候选风险表 / 候选待确认事项表原样写成 final。 |
| 正式 `03` 未装配 | 不按旧正式 `03` 开工;继续 Step 19 装配流程。 | 不得把旧正式 `03` 或旧 Step completed 状态作为实现真相源。 |
| 旧材料可能回流 | Step 19 必须显式排除旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 旧主线。 | 不得把旧材料重命名后直接进入 formal `03`。 |
| 04/05/06/07 尚未生成或复核 | 在 Step 19 记录 downstream owner 和未确认前限制。 | 不得在 Step 18 / Step 19 代写 config schema、TC、acceptance gate 或 commit boundary。 |
| implementation gate 缺失 | 正式 `03` 可以继续诚实装配,但实现不得开工。 | 不得自行拆 phase、创建 boundary、补 implementation ledger 或提交实现仓。 |
| production adapter 未选型 | 保留 port / fake / unavailable / safe marker 语义,将产品选型交下游。 | 不得把 durable product、broker、metrics、DLQ 或真实 adapter 写死到 core design。 |
| 发现具体 truth-source 缺口 | 暂停相关 formal assembly,回 owning Step 或下游正式文档闭口。 | 不得交给 implementation agent 通过默认值、private map、synthetic marker 或 fake-only workaround 补口。 |

### 3. blocking scope matrix

| 候选类别 | formal assembly | downstream handoff | implementation start | production / acceptance | 当前处理 |
|---|---|---|---|---|---|
| 正式 `03` 尚未装配 | blocked | blocked | blocked | indirect_blocked | Step 19 必须完成 formal assembly 后才能移交。 |
| 旧材料可能误装配 | blocked | blocked | blocked | indirect_blocked | Step 19 必须执行 historical pollution exclusion。 |
| 04 未生成 | not_blocked_if_owner_marked | config_handoff_blocked | blocked_if_boundary_needs_config | blocked | Step 19 可记录 downstream pending,不得代写 04。 |
| 05 / 06 未重启或复核 | not_blocked_if_owner_marked | test_acceptance_handoff_blocked | blocked_if_commit_gate_needs_05_06 | blocked | Step 19 可记录 downstream pending,不得代写 05/06。 |
| 07 / implementation ledger 缺失 | not_blocked_if_rule_marked | implementation_handoff_blocked | blocked | indirect_blocked | Step 19 可写 implementation start rule,但不得开工。 |
| production adapter / product 未选型 | not_blocked | not_blocked | not_blocked_for_fake_contract_slice | blocked | 作为 production follow-up,不得污染 core design。 |
| 具体 truth-source 缺口 | blocked | blocked | blocked | blocked | 回 owning Step 闭口后再继续。 |

### 4. truth-source gap return route table

| 缺口类型 | return route | 未闭口前停在哪里 |
|---|---|---|
| 对象字段来源、required field、state owner 不闭合 | Step 6 / Step 9 / Step 11 | 停止装配相关对象、flow、persistence 正文。 |
| port、repository、mapper、resolver、builder surface 不闭合 | Step 7 / Step 11 | 停止装配相关 port / adapter / persistence 正文。 |
| public DTO、command、query、event、job shell 或 marker source 不闭合 | Step 8 / Step 12 / Step 13 | 停止装配相关 protocol / recovery / replay 正文。 |
| flow 要求与 state / persistence / replay surface 冲突 | Step 9 / Step 10 / Step 11 / Step 13 | 停止装配 flow、state、persistence、idempotency 相关正文。 |
| config key、profile、env、secret、product binding 不闭合 | Step 14 / `04-配置设计.md` | 不阻塞已闭合 detailed design 正文,但阻塞 production config handoff。 |
| TC、suite、fixture、artifact schema、report path 不闭合 | Step 16 / `05-测试方案.md` | 不阻塞 detailed design 装配,但阻塞正式测试移交。 |
| acceptance gate、release veto、manual approval 不闭合 | `06-验收标准.md` | 不阻塞 detailed design 装配,但阻塞验收移交。 |
| phase、commit boundary、required_reads、allowed_scope 不闭合 | `07-实施计划.md` / implementation ledger | 不阻塞 formal `03`,但阻塞 implementation start。 |

### 5. Step 19 entry gate pass / stop / defer table

| gate 结果 | 判断条件 | 允许动作 | 禁止动作 |
|---|---|---|---|
| pass_to_step19 | R18.8/R18.10 候选项已分类;无具体 Step 6~13 truth-source blocker;旧材料禁入清楚;downstream owner 清楚。 | 进入 Step 19,只装配 confirmed source、候选收口结论和明确的 owner / 未确认前处理规则。 | 不装配旧材料、不写下游文档正文、不放行实现开工。 |
| stop_before_step19 | 发现具体 schema / port / DTO / state / mapper / marker / replay / persistence 缺口,或旧材料无法排除。 | 暂停 Step 19,回 owning Step 闭口。 | 不把缺口写成风险后继续装配为 completed。 |
| defer_to_downstream | 04/05/06/07 尚未生成,但当前 detailed design 真相源已闭口。 | Step 19 可记录 downstream pending、owner 和未确认前处理方式。 | 不代写 config、TC、acceptance、implementation boundary。 |
| defer_to_production | durable product / adapter / integration evidence 未选型,但 port / fake / unavailable 语义已闭口。 | Step 19 可记录 production follow-up。 | 不写死 durable product、topic、metric backend、DLQ、adapter format。 |
| block_implementation_start | `07`、implementation ledger 或 current boundary gate 不存在。 | Step 19 可完成 formal `03`,并写明 implementation starts only after 07 and ledger gates。 | 不创建 phase / commit boundary,不修改实现仓。 |

### 6. R18.13 进入门禁

`R18.13 formal §17 candidate stop-review:先思考` 只允许思考:

1. formal §17 candidate 应从 R18.1~R18.12 哪些 confirmed sections 取材。
2. 哪些内容可进入 formal §17,哪些只留在 calibration。
3. 风险表和待确认事项表如何从候选表收敛为正式候选。
4. Step 18 completion checklist 和 Step 19 entry gate 如何表达。
5. 不修改正式 `03-详细设计.md`;不进入 Step 19。

### 7. R18.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 unresolved handling rule table | pass |
| 是否写入 blocking scope matrix | pass |
| 是否写入 truth-source gap return route table | pass |
| 是否写入 Step 19 entry gate pass / stop / defer table | pass |
| 是否形成 R18.13 进入门禁 | pass |
| 是否未写最终风险表、最终待确认事项表或 formal §17 candidate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.13 formal §17 candidate stop-review:先思考`;只允许思考 formal §17 candidate source map、可装配 / 禁入内容、风险表与待确认事项表如何从候选收敛、Step 18 completion checklist、Step 19 entry gate 和 R18.14 写入计划;不得直接修改正式 `03-详细设计.md`;不得进入 Step 19;不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.13 formal §17 candidate stop-review:先思考

### 1. 当前模块目标

`R18.13` 只思考 formal `03-详细设计.md` §17 候选应如何从 R18.1~R18.12 取材、哪些内容可装配、哪些内容必须禁入、风险表与待确认事项表如何从候选收敛、Step 18 completion checklist 和 Step 19 entry gate 如何表达,并形成 `R18.14` 写入计划。当前模块不写 formal §17 candidate 正文终稿、不修改正式 `03-详细设计.md`,也不进入 Step 19。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.12` 推进到 `R18.13`。 |
| 当前允许 | 思考 formal §17 candidate source map、可装配 / 禁入内容、风险表与待确认事项表从候选收敛的方式、Step 18 completion checklist、Step 19 entry gate 和 R18.14 写入计划。 |
| 当前禁止 | 写 formal §17 candidate 正文终稿、修改正式 `03-详细设计.md`、进入 Step 19、写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. formal §17 candidate source map 思考

formal §17 不应复制 Step 18 的所有过程材料。它应只装配已经收口的风险判断基线、已关闭风险不再列入表、风险表、待确认事项表、未确认前处理规则和 Step 19 / implementation gate 边界。

| formal §17 候选小节 | 来源模块 | 装配思路 |
|---|---|---|
| §17.1 风险判断基线 | R18.1/R18.2/R18.3/R18.4 | 说明 Step 18 只记录仍未关闭、会影响实现或移交的事项,不补设计、不代写 04/05/06/07。 |
| §17.2 已关闭风险不再列入表 | R18.5/R18.6/R18.8 | 从 closed risk list 和 excluded closed risk table 取材,避免重复列已闭口对象、port、flow、state、error、config binding、test cut。 |
| §17.3 风险表 | R18.7/R18.8/R18.11/R18.12 | 从候选风险表收敛,保留风险、影响、阻塞范围、缓解方式、负责人 / 待确认方。 |
| §17.4 待确认事项表 | R18.9/R18.10 | 从候选待确认事项表收敛,回到规范列:事项、当前影响、需要谁确认、未确认前的处理方式。 |
| §17.5 未确认前处理规则 | R18.11/R18.12 | 装配 unresolved handling、blocking scope、truth-source return route 和 Step 19 pass / stop / defer 规则的正式摘要。 |
| §17.6 Step 19 entry note | R18.12/R18.13/R18.14 | 写明可进入 Step 19 的条件和不得在 Step 19 越界的事项。 |

### 3. 可装配 / 禁入内容思考

| 内容类型 | 是否可进入 formal §17 candidate | 处理方式 |
|---|---|---|
| 风险判断基线 | 可进入 | 写成正式摘要,不保留所有过程推理。 |
| 已关闭风险不再列入表 | 可进入 | 保留 Step 1~17 已闭口风险族和关闭依据。 |
| 风险表候选 | 可进入,但需收敛 | 去掉 `候选状态` 列,保留阻塞范围或在影响/缓解方式中显式说明。 |
| 待确认事项候选 | 可进入,但需收敛 | 去掉 `候选状态` 列,回到规范四列。 |
| 未确认前处理规则 | 可进入 | 写成实现者 / Step 19 装配者必须遵守的规则。 |
| Step 19 pass / stop / defer gate | 可进入摘要 | 作为 Step 19 入口说明,不替 Step 19 执行装配。 |
| R18.1~R18.13 的全部过程文字 | 不进入 | 留在 calibration,formal §17 只装配结论。 |
| 旧 Step 18 风险表 / 待确认事项 | 禁入 | 旧内容 invalid,不得复用。 |
| 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery | 禁入 | 只作为 historical pollution exclusion。 |
| 04/05/06/07 正文、phase / commit boundary、implementation ledger、evidence schema、CI command | 禁入 | 归属下游文档或实施台账,不得写进 detailed design §17。 |

### 4. 风险表与待确认事项表收敛思考

R18.14 应把 R18.8/R18.10 的候选表收敛为 formal §17 candidate,但仍不修改正式 `03-详细设计.md`。中间产物可以保留“formal candidate”标识,避免误认为已完成 Step 19 装配。

| 候选来源 | formal candidate 收敛方式 |
|---|---|
| R18.8 候选风险表 | 删除 `候选状态`;保留 `风险`、`影响`、`阻塞范围`、`缓解方式`、`负责人 / 待确认方`。 |
| R18.8 watch candidate | 若只是 Step 19 truth-source watch,写入风险表为“具体缺口发现时必须回 owning Step”,不伪造成当前已存在 blocker。 |
| R18.10 候选待确认事项表 | 删除 `候选状态`;回到规范四列。 |
| production candidate | 在风险表和待确认事项表中标明不阻塞 design completion,阻塞 production / acceptance。 |
| downstream candidate | 标明 downstream owner,不得写成当前 detailed design 未完成。 |
| implementation start candidate | 标明 formal `03` 可完成但实现不得绕过 `07` 和 ledger gate。 |

### 5. Step 18 completion checklist 思考

R18.14 应写一个 completion checklist,用于判断 Step 18 是否可以完成并进入 Step 19。该 checklist 不等于 Step 19 已完成。

| checklist item | 预期判断 |
|---|---|
| old Step 18 reset | 旧 completed 状态、旧风险表、旧待确认事项、旧 P0/P1 风险分级已作废。 |
| input baseline clear | 当前风险与待确认事项只来自当前 `00/01/02` 和 Step 1~17。 |
| closed risk separated | 已关闭风险不重复列入 active 风险表。 |
| active risk candidates classified | formal assembly、downstream、implementation、production、truth-source watch 已分层。 |
| open question candidates have owners | 待确认事项候选都有确认方和未确认前处理方式。 |
| unresolved handling clear | 未确认前不得交给实现者补口。 |
| Step 19 gate clear | pass / stop / defer / block_implementation_start 条件清楚。 |
| formal `03` unchanged | Step 18 未直接修改正式 `03-详细设计.md`。 |

### 6. Step 19 entry gate 思考

R18.14 的 Step 19 entry gate 应表达“可以进入 formal document assembly”,而不是“可以实现”。进入 Step 19 后仍必须由 Step 19 装配正式 `03` 并保持下游边界。

| gate point | R18.14 应写法 |
|---|---|
| 可以进入 Step 19 | Step 18 已完成风险 / 待确认事项候选收口,没有发现具体 truth-source blocker。 |
| Step 19 不得做 | 不得补对象、port、protocol、flow、state、config、test、acceptance、phase 或 code。 |
| Step 19 应做 | 只从 Step 1~18 confirmed 中间产物装配 formal `03`。 |
| 下游 pending 处理 | 在 formal §17 标明 owner 和未确认前处理方式,不代写下游文档。 |
| implementation start | 必须等正式 `07` 和 implementation ledger / boundary gate。 |

### 7. R18.14 写入计划思考

`R18.14 formal §17 candidate stop-review:再写入` 应把本模块思考落成 Step 18 收口记录:

1. 写 formal §17 source map candidate table。
2. 写 formal §17 assemblable / forbidden content table。
3. 写 formal §17 candidate tables,包括风险表候选和待确认事项表候选的收敛版本。
4. 写 Step 18 completion checklist。
5. 写 Step 19 entry gate。
6. 写 Step 18 final stop-review,并将 flow / ledger 推进到 Step 18 completed / waiting Step 19。
7. 不直接修改正式 `03-详细设计.md`,不进入 Step 19,不写下游正式文档或 implementation artifacts。

### 8. R18.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 formal §17 candidate stop-review | pass |
| 是否形成 formal §17 candidate source map 思考 | pass |
| 是否形成可装配 / 禁入内容思考 | pass |
| 是否形成风险表与待确认事项表收敛思考 | pass |
| 是否形成 Step 18 completion checklist 思考 | pass |
| 是否形成 Step 19 entry gate 思考 | pass |
| 是否形成 R18.14 写入计划 | pass |
| 是否未写 formal §17 candidate 正文终稿 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 或写正式实施计划 / phase / commit / evidence / CI / code | pass |

next_allowed_action: 等待用户确认后进入 Step 18 `R18.14 formal §17 candidate stop-review:再写入`;只允许写入 formal §17 source map candidate table、formal §17 assemblable / forbidden content table、formal §17 candidate tables、Step 18 completion checklist、Step 19 entry gate 和 Step 18 final stop-review;不得直接修改正式 `03-详细设计.md`;不得进入 Step 19;不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R18.14 formal §17 candidate stop-review:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R18.13` 推进到 `R18.14`。 |
| 本模块写入范围 | formal §17 source map candidate table、formal §17 assemblable / forbidden content table、formal §17 candidate tables、Step 18 completion checklist、Step 19 entry gate 和 Step 18 final stop-review。 |
| 本模块禁止范围 | 直接修改正式 `03-详细设计.md`、进入 Step 19、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. formal §17 source map candidate table

| formal §17 候选小节 | calibration 来源 | 装配口径 |
|---|---|---|
| §17.1 风险判断基线 | R18.1~R18.4 | Step 18 只记录仍未关闭且会影响实现或移交的事项;不补设计、不代写 04/05/06/07。 |
| §17.2 已关闭风险不再列入表 | R18.5/R18.6/R18.8 | Step 1~17 已闭口的对象、port、flow、state、persistence、error、idempotency、config binding、observability、test cut 不重复列 active risk。 |
| §17.3 风险表 | R18.7/R18.8/R18.11/R18.12 | 从候选风险表收敛;显式标注阻塞范围、缓解方式和 owner。 |
| §17.4 待确认事项表 | R18.9/R18.10 | 从候选待确认事项表收敛;回到规范列:事项、当前影响、需要谁确认、未确认前的处理方式。 |
| §17.5 未确认前处理规则 | R18.11/R18.12 | 装配 unresolved handling、truth-source return route 和 Step 19 pass / stop / defer 摘要。 |
| §17.6 Step 19 entry note | R18.12/R18.13/R18.14 | 写明 Step 19 可以做 formal assembly,不能放行 implementation start。 |

### 3. formal §17 assemblable / forbidden content table

| 内容 | formal §17 candidate 处理 |
|---|---|
| 风险判断基线 | 可装配为正式摘要。 |
| 已关闭风险不再列入表 | 可装配为正式表,用于防止重复打开已闭口风险。 |
| 风险表 | 可装配为 formal candidate 风险表;阻塞范围必须保留。 |
| 待确认事项表 | 可装配为 formal candidate 待确认事项表;必须有确认方和未确认前处理方式。 |
| 未确认前实现处理规则 | 可装配为正式摘要;禁止实现侧补 schema / port / state / mapper / config / evidence / phase。 |
| Step 19 pass / stop / defer gate | 可装配为 Step 19 entry note;不替 Step 19 执行装配。 |
| R18 全部过程推理 | 不装配;留在 calibration。 |
| 旧 Step 18 风险表 / 待确认事项 | 禁入;旧 completed 状态 invalid。 |
| 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery | 禁入;只作为 historical pollution exclusion。 |
| 04/05/06/07 正文、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate | 禁入;归属下游文档或实施台账。 |

### 4. formal §17 candidate: 风险判断基线

formal §17 候选正文应声明:

- 当前风险与待确认事项只来自本轮 `00/01/02` 和 `03-详细设计` Step 1~17。
- 旧正式 `03-详细设计.md`、旧 Step 18 和旧 `03_ddd_*` completed 状态只作为 historical material。
- Step 18 不新增对象、字段、DTO、port、state、mapper、config key、test evidence schema、phase boundary 或 code。
- 04/05/06/07 尚未生成或待复核属于 downstream pending;除非反向暴露 Step 3~17 不闭口,否则不自动阻塞 detailed design completion。
- implementation 只能在正式 `07` 和 implementation ledger / boundary gate 存在后开工。

### 5. formal §17 candidate: 已关闭风险不再列入表

| 已关闭风险族 | 关闭依据 | formal §17 处理 |
|---|---|---|
| historical material reset | Step 1~2 | 旧正式 `03`、旧 Step completed、旧 MethodContent / P0/P1 主线不作为 active risk。 |
| implementation shape | Step 3~5 | runtime、仓库约束、布局、七实现单元和依赖方向不再待确认。 |
| object contract closure | Step 6 | 已闭口对象、ref、marker、state owner 和字段来源主轴不重复列风险。 |
| port / protocol closure | Step 7~8 | 已闭口 port、adapter、DTO、command、query、event、job shell 不重复列风险。 |
| flow / state / persistence closure | Step 9~11 | 已闭口函数流、状态机、repository key、transaction consistency 不重复列风险。 |
| error / idempotency / concurrency closure | Step 12~13 | duplicate replay、commit unknown、retry、race、reentry 不重复列风险。 |
| config / observability / test cut closure | Step 14~16 | detailed design 级 binding、审计、redaction、最小测试切口已闭口;正式 schema / TC / acceptance 交下游。 |
| implementation handoff ownership | Step 17 | Step 17 不替代 07;implementation starts only after 07 and ledger gates 已闭口为规则。 |

### 6. formal §17 candidate: 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| 正式 `03-详细设计.md` 尚未由 Step 19 装配 | 旧正式 `03` 仍是 historical material,不能作为新版实现真相源。 | 阻塞 formal `03` 移交和 implementation source baseline。 | Step 19 只能从已确认的 Step 1~18 中间产物装配正式 `03`,并执行来源映射和禁入项检查。 | 详细设计维护者 / 用户 |
| Step 19 误装配旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 主线 | 实现者可能按旧对象、旧流程或旧章节结构还原代码。 | 阻塞 formal assembly pass。 | Step 19 使用 Step 1~2 reset 规则、Step 17 禁入项和 Step 18 pollution watch 排除旧材料。 | 详细设计维护者 |
| `04-配置设计.md` 尚未按新版 `03` 重启或生成 | config schema、profile、env、secret、adapter binding 可能被实现侧补口。 | 阻塞 production config handoff;不阻塞 Step 19 诚实装配。 | 后续 `04` 从 Step 14、Step 17 和正式 `03` 生成,不得由实现仓补配置真相源。 | 配置设计维护者 |
| `05-测试方案.md` 尚未按新版 `03` 重启或复核 | TC、suite、fixture、run artifact、report schema 可能继承旧对象或被实现侧发明。 | 阻塞正式 test handoff 和 evidence 口径。 | 后续 `05` 从 Step 16、Step 17 和正式 `03` 生成 / 复核。 | 测试方案维护者 |
| `06-验收标准.md` 尚未按新版 `03` 重启或复核 | acceptance gate、release veto、验收 evidence、禁止 synthetic marker / raw body 等红线可能不闭合。 | 阻塞 acceptance / release gate 口径。 | 后续 `06` 从需求验收红线、Step 16、Step 17 和正式 `03` 生成 / 复核。 | 验收标准维护者 |
| `07-实施计划.md`、implementation ledger 和 boundary ledger 尚未形成 | 没有 current boundary、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate 和 Handoff Gate。 | 阻塞 implementation start。 | 后续 `07` 按正式 `03/05/06/07` 审计后创建实施计划、项目级台账和 boundary 台账。 | 实施计划维护者 / implementation agent |
| durable store、broker、metrics、DLQ、真实 adapter 和 integration evidence 未选型 | fake / fixture / unavailable 语义可闭环,但真实 adapter、运维证据和生产验收无法完成。 | 不阻塞 design completion;阻塞 production adapter / acceptance。 | domain / application 只依赖正式 port、safe marker 和 fake / unavailable 语义;产品选择交 04/07/运维或 adapter design。 | 架构 / 配置 / 运维 / adapter owner / 相邻仓负责人 |
| Step 19 truth-source watch 发现具体 Step 6~13 缺口 | 若出现字段来源、public marker、mapper、state、schema、stored surface 或 replay source 缺口,实现侧不能补口。 | 若发现具体缺口,阻塞 owning Step 闭口和 formal assembly。 | Step 19 装配前用 Step 17 pre-audit 维度复核;发现具体缺口即回 owning Step。 | 详细设计维护者 / owning Step 维护者 |

### 7. formal §17 candidate: 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 正式 `03-详细设计.md` 装配 | 未确认前,旧正式 `03` 不能作为新版实现真相源。 | 详细设计维护者 / 用户 | 不按旧 `03` 开工;不把 Step 1~18 中间产物直接当正式移交文档。 |
| Step 19 旧材料排除 | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox / delivery 等旧主线可能污染 formal assembly。 | 详细设计维护者 | Step 19 装配时必须显式排除旧材料;若需保留事实,必须回指当前 `00/01/02` 或本轮 Step。 |
| `04-配置设计.md` 按新版 `03` 生成 | config schema、profile、env、secret、adapter binding 和 concrete product binding 缺正式下游真相源。 | 配置设计维护者 | 实现仓不得发明 config key、default、topic、URL、secret source 或产品绑定。 |
| `05-测试方案.md` 按新版 `03` 重启 / 复核 | TC、suite、fixture、run artifact、report schema 可能继承旧口径或被实现侧补口。 | 测试方案维护者 | 不声称正式测试覆盖;不由实现 agent 自行定义 evidence schema 或 case mapping。 |
| `06-验收标准.md` 按新版 `03` 重启 / 复核 | acceptance gate、release veto、coverage / evidence threshold 和 manual approval 口径未正式收敛。 | 验收标准维护者 | 不把 cargo / unit test 通过等同于正式验收通过;不自行写 release gate。 |
| `07-实施计划.md` 与 implementation ledger / boundary ledger 生成 | 缺 current boundary、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate 和 Handoff Gate。 | 实施计划维护者 / implementation agent | 不写实现仓代码、不拆 phase / commit boundary、不提交实现仓。 |
| 目标实现仓、git config 和 current boundary 开工确认 | 即使正式 `07` 存在,仍需每个 boundary 开工前确认目标仓、git user、clean status 和 required reads。 | implementation agent / 实施计划维护者 | 缺当前 boundary 台账或 gate 未通过时不得改代码。 |
| durable store / broker / metrics / DLQ / diagnostic / 真实 adapter 选型 | fake / fixture / unavailable 语义可支撑设计闭环,但生产 adapter 和 integration evidence 不可验收。 | 架构 / 配置 / 运维 / adapter owner / 相邻仓负责人 | domain / application 只保留正式 port、safe marker 和 fake / unavailable 语义;不得写死产品。 |
| Step 19 truth-source watch 处理 | 若 Step 19 发现具体 schema / port / marker / mapper / state / stored surface / replay source 缺口,需要明确回哪个 owning Step。 | 详细设计维护者 / owning Step 维护者 | 当前不伪造 blocker;一旦发现具体缺口,暂停 formal assembly 并回 owning Step 闭口。 |

### 8. formal §17 candidate: 未确认前处理规则

| 场景 | 处理规则 |
|---|---|
| 正式 `03` 未装配 | 不恢复旧 `03`;不正式移交实现;继续 Step 19。 |
| 04/05/06/07 未同步 | 不把旧测试、验收、配置或 phase 口径交给实现者。 |
| implementation ledger / boundary gate 缺失 | 不写代码、不提交实现仓 commit。 |
| phase / commit boundary 不清楚 | 不自行拆分;等待正式 `07`。 |
| 字段 / DTO / 状态 / port / mapper / marker / flow 缺口 | 暂停并回 owning design Step;不得在代码中补 placeholder、private map 或 synthetic marker。 |
| 配置、测试、验收 schema 缺口 | 回 04/05/06 闭口;不得由实现仓补真相源。 |
| 运行期依赖或生产产品未定 | 使用 fake / fixture / unavailable 语义,不得写死 durable product 或 adapter 格式。 |
| Step 19 装配发现旧材料污染 | 停止装配相关内容,按 historical pollution exclusion 处理。 |

### 9. Step 18 completion checklist

| 检查项 | 结果 | 说明 |
|---|---|---|
| old Step 18 reset | pass | 旧 completed 状态、旧风险表、旧待确认事项、旧 P0/P1 风险分级已作废。 |
| input baseline clear | pass | 当前风险与待确认事项只来自当前 `00/01/02` 和 Step 1~17。 |
| closed risk separated | pass | 已关闭风险不重复列入 active 风险表。 |
| active risk candidates classified | pass | formal assembly、downstream、implementation、production、truth-source watch 已分层。 |
| open question candidates have owners | pass | 待确认事项候选都有确认方和未确认前处理方式。 |
| unresolved handling clear | pass | 未确认前不得交给实现者补口。 |
| Step 19 gate clear | pass | pass / stop / defer / block_implementation_start 条件清楚。 |
| formal `03` unchanged | pass | Step 18 未直接修改正式 `03-详细设计.md`。 |
| implementation artifacts absent | pass | 未写 phase、commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 code。 |

### 10. Step 19 entry gate

| gate item | 状态 | Step 19 处理 |
|---|---|---|
| Step 18 风险与待确认事项已收口 | pass | 可进入 Step 19 formal document assembly。 |
| 具体 Step 6~13 truth-source blocker | not_found_in_step18 | Step 19 若发现具体缺口,必须 stop 并回 owning Step。 |
| old material exclusion | pass | Step 19 不得继承旧 Step 18、旧 `03`、旧 MethodContent / P0/P1 / outbox 主线。 |
| downstream owner | pass | 04/05/06/07 由对应文档维护者生成或复核。 |
| implementation start rule | pass | implementation starts only after formal `07` and implementation ledger / boundary gates。 |
| Step 19 allowed action | ready | 只从 Step 1~18 confirmed 中间产物装配 formal `03`。 |

### 11. Step 18 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 formal §17 source map candidate table | pass |
| 是否写入 formal §17 assemblable / forbidden content table | pass |
| 是否写入 formal §17 candidate 风险表 | pass |
| 是否写入 formal §17 candidate 待确认事项表 | pass |
| 是否写入未确认前处理规则 | pass |
| 是否写入 Step 18 completion checklist | pass |
| 是否写入 Step 19 entry gate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 19 | pass |
| 是否未写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 code | pass |

next_allowed_action: Step 18 completed;等待用户确认后进入 Step 19 `R19.1 开工与必读文档:先思考`;只允许思考 Step 19 formal document assembly 的开工边界、必读文档、Step 1~18 confirmed source map、旧正式 `03` historical material 隔离和 R19.2 写入计划;不得直接跳过 Step 19;不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
