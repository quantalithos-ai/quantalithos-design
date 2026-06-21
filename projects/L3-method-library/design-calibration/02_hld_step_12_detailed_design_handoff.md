# Step 12. 详细设计承接清单

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L3-method-library/02-概要设计.md` §12 详细设计承接清单
- 当前模块：Step 12 已完成,等待进入 Step 13 设计风险与待确认事项

historical material:

- `projects/L3-method-library/design-calibration/02_hld_step_11_detail_design_handoff.md`
- `projects/L3-method-library/design-calibration/02_hld_step_12_risks_open_questions.md`
- `projects/L3-method-library/design-calibration/02_hld_step_13_formal_document_assembly.md`
- 当前正式 `projects/L3-method-library/02-概要设计.md` `§12`

---

### R1.19 正式 §12 回填草稿:先思考

#### R1.19.1 本模块问题

本模块只回答两类问题:

1. 如何把 Step 4 ~ Step 11 已收稳的主线压缩为正式 `§12` 的可回填草稿框架。
2. 当前正式 `§12` 中哪些壳层可以延续,哪些旧污染必须在草稿阶段明确替换或删去。

本模块不写正式 `§12` 最终正文,不进入 Step 13,也不回写 `02-概要设计.md`。

#### R1.19.2 当前稳定来源

| 来源 | 当前稳定结论 | 对本模块的影响 |
|---|---|---|
| Step 4 `代码主体框架映射` | 已明确实现分层、业务主语和总框架。 | 作为正式 `§12` 的最外层骨架来源。 |
| Step 5 `主要组成部分、职责与边界` | 已明确主要组成部分与边界。 | 作为承接清单主表的主体来源。 |
| Step 6 `关键对象轮廓` | 已明确关键对象和对象附录。 | 作为对象承接段的来源。 |
| Step 7 `API / 接口骨架` | 已明确 Command / Query / Event / Job 主语。 | 作为接口承接段的来源。 |
| Step 8 `关键处理流 / 重要函数数据流` | 已明确处理流族和关键调用链。 | 作为继续展开方向的来源。 |
| Step 9 `状态机与状态流转` | 已明确状态主线和传播关系。 | 作为状态与回退规则的来源。 |
| Step 10 `异常与边界场景轮廓` | 已明确异常分层和边界红线。 | 作为排除项与风险说明的来源。 |
| Step 11 `配置影响轮廓` | 已明确配置影响和禁止配置化边界。 | 作为 formal `§12` 中配置承接边界的来源。 |
| R1.17 / R1.18 污染审计 | 已明确旧 Step 11 / 12 / 13 和旧污染主线只可作为历史样本。 | 作为草稿阶段的排除项与替换清单。 |

#### R1.19.3 回填壳层

正式 `§12` 在草稿阶段只保留以下壳层:

| 壳层 | 保留方式 | 写入口径 |
|---|---|---|
| 承接清单主表 | 保留章节骨架和行列结构 | 行内容只写 Step 4~11 的稳定承接,不引入新主语。 |
| 继续展开方向 | 保留压缩式说明位置 | 只说明详细设计继续展开的方向,不展开实现细节。 |
| 回退规则与排除项 | 保留独立分段 | 只列需要回退或排除的旧污染与越界内容。 |
| 差异审计与回填记录 | 保留追溯壳 | 记录本轮草稿从哪些 Step 与审计结论压缩而来。 |

#### R1.19.4 替换与排除

草稿阶段必须明确替换或排除的旧内容:

| 旧内容 | 处理方式 | 说明 |
|---|---|---|
| 旧 Step 11 / 12 / 13 编号顺序 | 替换 | 改为当前 full-restart 的 Step 12 结构,不继承旧编号语义。 |
| `publish` / `snapshot` / `fingerprint` / `outbox` / `delivery` 污染主线 | 排除 | 这些只保留为历史污染审计对象,不进入正式 `§12` 主文。 |
| 脱离 Step 4~11 的旧主语与旧取舍 | 排除 | 只允许回填当前稳定输入,不得借旧正文回推。 |
| 旧 `§12`~`§14` 的旧承接顺序 | 替换 | 必须按当前 13 章主链重新组织。 |

#### R1.19.5 下一写入边界

下一批 `正式 §12 回填草稿:再写入` 只允许写:

1. formal `§12` 的承接清单主表压缩正文。
2. formal `§12` 的继续展开方向压缩正文。
3. formal `§12` 的回退规则与排除项压缩正文。
4. formal `§12` 的差异审计和回填记录压缩正文。

下一批不得写:

1. `02-概要设计.md`。
2. Step 13 风险正文。
3. 任何详细设计级 schema、trait、DDL 或测试用例。

#### R1.19.6 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 formal `§12` 的草稿框架与排除项。 |
| 是否回指到 Step 4~11 | pass | 已明确草稿只能从当前稳定输入压缩而来。 |
| 是否保持 §12 壳层可重用 | pass | 已保留承接清单、继续展开、回退排除与回填记录四层壳。 |
| 是否把旧污染写成正式内容 | pass | 旧 Step 11 / 12 / 13 与旧污染主线只作排除项。 |
| 是否提前写正式 `02-概要设计.md` | no | 正式文档仍留到下一写入批次。 |
| 是否进入 Step 13 | no | 当前仍停在 Step 12。 |

next_allowed_action: 等待用户确认后进入 Step 12 `正式 §12 回填草稿:再写入`;只写 formal `§12` 草稿正文、来源映射压缩结论和停审记录,不得修改正式 `02-概要设计.md`,不得进入 Step 13。

### R1.20 正式 §12 回填草稿:再写入

#### R1.20.1 formal `§12` 草稿正文

建议正式 `02-概要设计.md` 的 `§12` 在本轮按以下结构回填:

##### 12.1 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| `§4` 代码主体框架总览 | 继续展开 crate / module / service / port / adapter 的正式分层边界,但不改写当前业务主语。 |
| `§5` 八个主要组成部分、职责与边界 | 为每个组成部分补正式 owner、application service、domain boundary、support material 和 peripheral / operation 落点。 |
| `§6` 关键对象轮廓 | 继续展开 truth、summary、view、typed ref、history、lineage、maintenance / peripheral 对象的字段、状态、工厂和不变量。 |
| `§7` API / 接口骨架 | 继续展开 Command / Query / Inbound Consumer / Outbound Event / Operations Job 的正式 contract、输入输出、拒绝面和只读边界。 |
| `§8` 关键处理流 / 重要函数数据流 | 继续展开 application flow、service 编排、transaction boundary、side effect 形成、refresh / recovery 承接和边界拒绝分支。 |
| `§9` 状态定义与状态流转 | 继续展开状态 owner、允许 / 禁止迁移、状态传播、degraded / unavailable 语义和并发保护边界。 |
| `§10` 异常与边界场景轮廓 | 继续展开错误分类、异常映射、恢复路径、拒绝面和不可越界的 safe failure 语义。 |
| `§11` 配置影响轮廓 | 在 `03-详细设计.md` 继续展开 typed config / runtime contract,在 `04-配置设计.md` 继续展开配置说明、填写方式和校验口径。 |

##### 12.2 详细设计继续展开方向

详细设计应继续展开以下方向:

1. 把方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护四条 core 主线补成正式对象、接口和函数边界。
2. 把关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织补成 support / operation / peripheral 的正式 contract。
3. 把 `§6` 的关键对象补成正式 struct / enum / value object / typed ref / summary / view / history / lineage。
4. 把 `§7` 的接口骨架补成正式 request / response / result / rejection / intake / job report 合同。
5. 把 `§8` 的处理流补成 application service 编排、side effect 顺序、禁止副作用和恢复收敛边界。
6. 把 `§9` 的状态与传播规则补成状态矩阵、guard、非法迁移、防回流和 freshness / degradation 语义。
7. 把 `§10` 与 `§11` 的异常边界、禁止配置化边界补成正式错误面、runtime contract 和 config validation gate。

##### 12.3 回退规则与排除项

| 发现的问题 | 回退位置 | 当前处理口径 |
|---|---|---|
| 需要改写代码主体框架、分层主语或业务主线 | 回退 `§4` / Step 4 | 不允许在 `03-详细设计.md` 中暗改主语。 |
| 需要新增、删除或合并主要组成部分 | 回退 `§5` / Step 5 | 组成部分边界必须先在概要层闭口。 |
| 需要新增关键对象家族或重定义对象 owner | 回退 `§6` / Step 6 | 不允许在详细设计阶段私补对象来源。 |
| 需要新增接口族、改写接口 owner 或恢复旧 publish / snapshot / outbox 机制 | 回退 `§7` / Step 7 | 接口分类必须先回到概要层重审。 |
| 需要改写主处理流、状态主线或异常红线 | 回退 `§8`~`§10` / Step 8~10 | 不允许用详细设计补口替代概要设计闭口。 |
| 需要让配置绕过边界、越权改写 truth 或恢复旧 plugin / marketplace 前置语义 | 回退 `§11` / Step 11 | 禁止配置化边界必须保持稳定。 |

以下内容不进入当前承接清单:

- 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线。
- 旧 `§12`~`§14` 的编号顺序和正文结构。
- 详细设计级 schema、trait、DDL、topic、worker、retry、queue、部署参数和测试用例。
- marketplace listing / transaction / install / fulfillment 等外部仓 truth。

##### 12.4 差异审计与回填记录

本轮 `§12` 草稿只承接当前 full-restart 的 `Step 4 ~ Step 11` 稳定结论。

旧 `Step 11 / Step 12 / Step 13` 以及当前正式 `§12`~`§14` 只作为污染审计和重组样本使用,不再作为本轮正文来源。当前 `§12` 的正式重组只保留以下壳层:

1. 承接清单主表。
2. 详细设计继续展开方向。
3. 回退规则与排除项。
4. 差异审计与回填记录。

#### R1.20.2 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否已写出 formal `§12` 草稿正文 | pass | 已写出承接清单、继续展开方向、回退规则与差异审计四段草稿。 |
| 是否只承接 Step 4~11 稳定输入 | pass | 草稿只回指当前正式 `§5`~`§11` 与对应中间产物。 |
| 是否把旧污染挡在草稿外 | pass | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线已留在排除项。 |
| 是否提前修改正式 `02-概要设计.md` | no | 当前只在 Step 12 中间产物内写草稿。 |
| 是否提前进入 Step 13 | no | 风险与待确认仍留在后续 Step 13。 |

next_allowed_action: 等待用户确认后进入 Step 12 `自检与停审:先思考`;只检查 formal `§12` 草稿是否完整承接 Step 4~11、是否混入旧污染、是否提前下沉到详细设计级内容,不得修改正式 `02-概要设计.md`,不得进入 Step 13。

### R1.21 自检与停审:先思考

#### R1.21.1 本模块边界

本模块目标是判断下一批 `R1.22 自检与停审:再写入` 应如何检查:

1. Step 12 当前草稿是否已经完整承接 `Step 4 ~ Step 11` 的稳定结论。
2. formal `§12` 草稿是否仍保持概要层粒度,没有提前下沉到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 或 `07-实施计划.md`。
3. 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 污染是否已经全部被挡在草稿外。
4. flow / 项目台账在 `R1.22` 后应推进到“等待用户确认正式 `§12` 回填记录”还是“仍需回到 Step 12 草稿修补”的哪种状态。

本模块不写最终停审结论,不修改正式 `02-概要设计.md`,也不进入 Step 13。

#### R1.21.2 自检输入盘点

| 输入 | 当前用途 | 读取状态 |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` `R1.19` / `R1.20` | 检查 formal `§12` 草稿框架、草稿正文、回退规则和差异审计是否成套。 | read |
| 正式 `02-概要设计.md` `§5`~`§11` | 检查草稿是否完整回指当前正式主链。 | read |
| `02_hld_step_05_components_boundary.md` ~ `02_hld_step_11_configuration_impact.md` | 检查承接项是否都有来源,是否遗漏主要组成部分、对象、接口、处理流、状态、异常或配置边界。 | read |
| `02_hld_calibration_flow.md` 与 `project_execution_ledger.md` | 检查当前门禁、恢复点和下一步是否仍只允许停审。 | read |
| `standards/document/概要设计讨论流程_SOP.md` | 检查 Step 12 完成后是否还需正式回填记录才能进入 Step 13。 | read |
| `standards/document/概要设计书写规范.md` 与 `设计文档讨论中间产物规范.md` | 检查 formal `§12` 草稿是否越界到详细设计 / 配置 / 测试 / 实施层。 | read |

#### R1.21.3 Step 12 完成门禁候选

`R1.22` 应重点检查以下完成门禁:

| 门禁项 | 检查重点 | 当前初判 |
|---|---|---|
| 承接来源完整 | `§4`~`§11` 是否都进入了 formal `§12` 草稿,且没有孤立缺口。 | ready_to_check |
| 主语未漂移 | 草稿是否仍使用当前 full-restart 主语,没有回流旧 `MethodContent` / publish 主线。 | ready_to_check |
| 粒度未下沉 | 草稿是否只写承接、展开方向、回退规则和差异审计,未写 schema、trait、DDL、key、topic、worker、测试用例。 | ready_to_check |
| 回退规则有效 | 若后续 `03-详细设计.md` 发现主语变化,草稿是否已把回退位置写清楚。 | ready_to_check |
| 正式回填可执行 | 草稿是否已经具备进入“正式 `§12` 回填记录”的前提。 | ready_to_check |
| Step 13 放行判断 | Step 13 是否仍需等待正式 `§12` 回填记录完成。 | ready_to_check |

#### R1.21.4 formal `§12` 可回填性判断口径

`R1.22` 的判断口径固定如下:

1. 只判断 `R1.20` 草稿是否已经达到“可正式回填”的状态,不在本模块直接修改正式 `02-概要设计.md`。
2. 只有在用户明确确认后,才允许实际替换正式 `02-概要设计.md` 的 `§12` 文本,并补写正式回填记录。
3. 若草稿仍缺少 `§4`~`§11` 某一类承接项,或混入旧污染、详细设计级细节、测试 / 实施内容,必须回到 Step 12 修补,不得假装可回填。

#### R1.21.5 Step 13 放行判断口径

Step 13 当前不能直接放行。下一批自检若通过,也只能把 Step 13 维持为 `blocked_by_step12_formal_backfill`,直到正式 `§12` 回填记录完成。

原因如下:

1. 当前完成的是中间产物草稿,不是正式文档回填。
2. Step 13 风险与待确认事项必须建立在正式 `§12` 与 Step 12 中间产物已经一致的前提上。
3. 若正式 `§12` 尚未更新,后续 agent 仍可能从旧 `§12` 出发误读主线。

#### R1.21.6 flow / 台账推进策略候选

若 `R1.22` 自检通过,建议状态如下:

| 文档 | 建议状态 | 说明 |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` | Step 12 self_check_completed / ready_for_formal_backfill_record | 等待用户确认后进入正式 `§12` 回填记录。 |
| `02_hld_calibration_flow.md` | Step 12 intermediate_completed / wait_user_confirm_formal_backfill | 不自动进入 Step 13;等待用户确认正式 `§12` 回填记录。 |
| `project_execution_ledger.md` | Step 12 intermediate_completed / wait_user_confirm_formal_backfill | 恢复点指向“等待用户确认正式 `§12` 回填记录”。 |
| `02_hld_step_13_risks_open_questions.md` | blocked_by_step12_formal_backfill | 继续阻断,直到正式 `§12` 回填记录完成。 |
| 正式 `02-概要设计.md` | formal `§12` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.20` / `R1.22` 整体替换 `§12`。 |

若 `R1.22` 自检不通过,flow / 台账必须留在 Step 12,并明确回到缺口所在模块修补。

#### R1.21.7 下一写入批次结构

下一批 `R1.22 自检与停审:再写入` 只写:

1. Step 12 完成门禁自检表。
2. formal `§12` 草稿可回填性检查。
3. Step 13 放行判断与后续风险保留。
4. 停审裁决与 flow / 台账推进建议。
5. `next_allowed_action` 和本模块停审记录。

下一批不得写:

1. 正式 `02-概要设计.md`。
2. Step 13 正文。
3. 新的详细设计级 contract、配置 key 或测试用例。

#### R1.21.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定自检口径、门禁项和推进策略候选。 |
| 是否提前写最终停审结论 | no | 最终 pass / fail 留给 `R1.22`。 |
| 是否提前修改正式文档 | no | 正式 `02-概要设计.md` 仍未修改。 |
| 是否提前放行 Step 13 | no | Step 13 仍保持阻断判断。 |

next_allowed_action: 等待用户确认后进入 Step 12 `自检与停审:再写入`;只写 Step 12 完成门禁自检、formal `§12` 草稿可回填性判断、Step 13 放行判断、停审裁决和 flow / 台账推进建议,不得修改正式 `02-概要设计.md`,不得进入 Step 13。

### R1.22 自检与停审:再写入

#### R1.22.1 Step 12 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 必读与开工基线完成 | pass | `R1.19`;`R1.20`;`R1.21` | 已完成 Step 12 的来源基线、草稿写入和停审口径整理。 |
| 承接来源完整 | pass | `R1.20`;正式 `§5`~`§11` | formal `§12` 草稿已覆盖代码主体框架、组成部分、对象、接口、处理流、状态、异常和配置承接。 |
| 主语未漂移 | pass | `R1.17`;`R1.18`;`R1.20` | 草稿仍使用当前 full-restart 主语,未回流旧 `MethodContent` / publish 主线。 |
| 回退规则有效 | pass | `R1.20` | 已写明主语变化时必须回退 `§4`~`§11` 的对应 Step。 |
| 差异审计保留 | pass | `R1.17`;`R1.18`;`R1.20` | 旧 Step 11 / 12 / 13 和旧 `§12`~`§14` 只保留为污染审计样本。 |
| 粒度未下沉 | pass | `R1.20`;`R1.21` | 草稿未写 schema、trait、DDL、topic、worker、配置 key、测试用例或实施边界。 |
| 未修改正式文档 / 未进入 Step 13 | pass | `R1.20`;`R1.21`;`R1.22` | 当前只完成中间产物停审,尚未修改正式 `02-概要设计.md`,也未进入 Step 13。 |

#### R1.22.2 formal `§12` 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.20` 已覆盖 `12.1` 承接清单、`12.2` 继续展开方向、`12.3` 回退规则与排除项、`12.4` 差异审计与回填记录。 |
| 来源可追溯 | pass | 草稿可回指正式 `§5`~`§11` 和对应 Step 5~11 中间产物。 |
| 摘要化适度 | pass | formal `§12` 草稿只保留概要层索引和承接方向,完整推导继续留在中间产物。 |
| 旧污染禁入 | pass | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线已明确留在排除项。 |
| Step 13 未被提前吸入 | pass | 风险与待确认事项仍未写入本草稿。 |
| 正式文档状态 | pending_rewrite | 当前正式 `02-概要设计.md` 的 `§12` 仍是旧承接清单 / 回退规则结构,尚未按本轮结论替换。 |
| 回填前置动作 | ready_when_user_confirms | 下一动作可以进入 `正式 §12 回填记录:再写入`,按 `R1.20` / `R1.22` 替换正式 `§12` 并记录回填后检查。 |

#### R1.22.3 Step 13 放行判断与后续风险保留

| 承接 / 风险 | 状态 | 后续要求 |
|---|---|---|
| Step 12 草稿已收稳 | ready_after_formal_backfill | Step 13 只能承接正式 `§12` 回填后的版本,不得直接从中间产物跳转。 |
| 旧 `§12` 仍未替换 | blocked_by_formal_backfill_pending | 在正式回填前,Step 13 不得以当前正式 `§12` 为第一来源。 |
| 回退规则已固定 | active_gate | Step 13 不得借风险讨论回改 Step 12 已写明的回退边界。 |
| 概要层粒度保持 | active_gate | Step 13 仍只能写风险与待确认,不能补详细设计级 contract。 |

#### R1.22.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 12 中间产物是否完成 | completed | 已完成草稿框架、草稿正文和停审自检。 |
| 正式 `§12` 是否已回填 | no | 当前只完成 `R1.20` 草稿与 `R1.22` 停审裁决,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 12 blocker | no_blocker_for_current_step | 未发现承接来源、主语、粒度或污染隔离上的未闭口缺口。 |
| 是否允许正式 `§12` 回填 | ready_when_user_confirms | 可按 `R1.20` / `R1.22` 整体替换正式 `§12`,但必须等待用户明确确认。 |
| 是否允许进入 Step 13 | blocked_until_formal_backfill_record_completed | Step 13 仍需等待正式 `§12` 回填记录完成。 |

#### R1.22.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` | Step 12 self_check_completed / ready_for_formal_backfill_record | 等待用户确认后进入 `正式 §12 回填记录:再写入`。 |
| `02_hld_calibration_flow.md` | Step 12 intermediate_completed / wait_user_confirm_formal_backfill | 不自动进入 Step 13;等待用户确认正式 `§12` 回填记录。 |
| `project_execution_ledger.md` | Step 12 intermediate_completed / wait_user_confirm_formal_backfill | 恢复点指向“等待用户确认正式 `§12` 回填记录”。 |
| `02_hld_step_13_risks_open_questions.md` | blocked_by_step12_formal_backfill | 继续阻断,直到正式 `§12` 回填记录完成。 |
| `02-概要设计.md` | formal `§12` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.20` / `R1.22` 整体替换 `§12`。 |

#### R1.22.6 next_allowed_action

```text
等待用户确认后进入 Step 12 `正式 §12 回填记录:再写入`:
1. 只允许按 `R1.20` / `R1.22` 替换 projects/L3-method-library/02-概要设计.md 的 `§12`,并记录回填动作、回填后检查和 Step 13 门禁。
2. 在正式 `§12` 回填记录完成前,不得进入 Step 13。
3. 在用户明确前,不得直接修改正式 `02-概要设计.md`,不得进入 Step 13。
```

#### R1.22.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 12 完成门禁自检。 |
| 是否判断 formal `§12` 草稿可回填 | pass | `R1.20` / `R1.22` 可作为正式 `§12` 回填依据,但尚未实际修改正式文档。 |
| 是否保留 Step 13 放行风险 | pass | 已保留 formal backfill pending 和旧正式 `§12` 未替换的门禁。 |
| 是否明确停审裁决 | pass | Step 12 中间产物 completed;下一步等待用户确认正式 `§12` 回填记录。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 13 | no | 未写 Step 13 正文。 |

next_allowed_action: 等待用户确认后进入 Step 12 `正式 §12 回填记录:再写入`;只允许按 `R1.20` / `R1.22` 替换正式 `02-概要设计.md` 的 `§12`,并记录回填动作、回填后检查和 Step 13 门禁,在用户明确前不得直接修改正式文档,不得进入 Step 13。

### R1.23 正式 `§12` 回填记录:再写入

#### R1.23.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 `§12` 回填。 |
| 回填来源 | `R1.20 正式 §12 回填草稿:再写入`;`R1.22 自检与停审:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 12. 详细设计承接清单`。 |
| 回填范围 | 仅整体替换正式 `## 12` 到 `## 13` 之前的内容。 |
| 未修改范围 | 未修改正式 `§13` 或后续章节。 |
| 回填方式 | 摘要化回填:保留 `12.1` 承接清单、`12.2` 继续展开方向、`12.3` 回退规则与排除项、`12.4` 差异审计与回填记录四段结构;完整来源池、污染审计、取舍和停审过程仍以本文件 `R1.1`~`R1.22` 为准。 |

#### R1.23.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 `§12` 是否已回填 | pass | 正式 `02-概要设计.md` 的 `§12` 已按 `R1.20` / `R1.22` 整体替换。 |
| 是否只修改 `§12` | pass | 本次回填目标限定在 `## 12` 到 `## 13` 之前。 |
| 是否替换旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线 | pass | 正式 `§12` 已移除旧承接清单中的旧主语和旧承接顺序。 |
| 是否保持 `12.1`~`12.4` 结构 | pass | 正式 `§12` 保持承接清单、继续展开方向、回退规则与排除项、差异审计与回填记录四段结构。 |
| 是否保持概要层粒度 | pass | `§12` 只写承接边界与展开方向,未下沉到 schema、trait、DDL、topic、worker、配置 key、测试用例或实施边界。 |
| 是否显式保留 Step 11 的 `03 / 04` 承接分工 | pass | 正式 `§12` 已继续保持 `03-详细设计.md` 与 `04-配置设计.md` 的职责分离。 |
| 是否提前进入 Step 13 | pass | 本次只完成正式 `§12` 回填,未写 Step 13 正文。 |

#### R1.23.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| Step 13 当前文件和正式 `§13` 仍是 historical pending_recheck | open_for_step13_reopen | Step 13 必须从 `开工与必读文档:先思考` 重开,按正式 `§12` 回填后文本和当前 Step 5~12 结论重审。 |
| 旧 `§13` 风险条目借机回流旧 `MethodContent` / publish / outbox 主线 | open_for_step13_recheck | Step 13 只允许承接当前 full-restart 主线下的真实风险与待确认事项。 |
| Step 12 回退规则在后续风险讨论中被削弱 | active_gate | Step 13 不得用风险讨论回改 `§12` 已写明的回退位置与排除项。 |
| `03 / 04` 职责被 Step 13 重新分配 | blocked_by_rule | Step 13 只能承接 `§12` 已固定的 `03-详细设计.md` / `04-配置设计.md` 分工,不得重新分配。 |

#### R1.23.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 12 中间产物 | completed | `R1.1`~`R1.22` 已闭合来源基线、承接草稿、污染审计和停审裁决。 |
| 正式 `§12` | backfilled | 正式 `§12` 已按 `R1.20` / `R1.22` 回填。 |
| Step 12 blocker | none | 当前 Step 12 无遗留 blocker。 |
| 下一步 | ready_for_step13_opening | 下一步只能进入 Step 13 `开工与必读文档:先思考`,不得沿用旧正式 `§13` 或 historical Step 13 结论。 |

next_allowed_action: 等待用户确认后进入 Step 13 `开工与必读文档:先思考`;Step 13 必须以正式 `§12` 回填后文本、Step 12 `R1.1`~`R1.23`、Step 11 `R1.25`、Step 10 `R1.27`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 `§13` 或 historical Step 13 作为第一来源。
