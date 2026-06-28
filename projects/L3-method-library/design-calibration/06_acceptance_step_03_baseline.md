# Step 3. 固定验收基线

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节: `06-验收标准.md` §3 验收基线
> 创建日期: 2026-06-28
> 当前模式: full-restart / step3-baseline
> 当前状态: completed
> 当前模块: `R3.2 baseline:再写入`
> 当前门禁: `R3.2` completed_wait_user_confirm_to_R4.1;等待确认进入 Step 4 `R4.1 entry exit:先思考`

---

## R3.1 baseline:先思考

### 1. 当前模块目标

`R3.1` 只思考新版 `06-验收标准.md` 的验收基线如何固定:需求 / 架构 / 概要 / 详细 / 配置 / 测试方案 source refs、送验实现版本、P0 profile、config digest、test data、run_id、artifact root、report root、acceptance handoff 和 review supplement。

当前模块不修改正式 `06-验收标准.md`,不生成真实 `run_id`,不填写真实 implementation commit / build id / image digest,不裁决测试通过 / 失败,不进入 Step 4。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.2 |
| 用户确认 | 已确认从 Step 2 completed 推进到 Step 3 `R3.1 baseline:先思考`。 |
| 当前允许 | 思考验收基线类型、证据入口、P0 环境 / 配置、基线变更规则和 R3.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实 run_id / commit / verdict;伪造 evidence;进入 Step 4。 |

### 2. 本模块输入承接

| 输入 | R3.1 关注点 | 禁止外推 |
|---|---|---|
| Step 1 输入映射 | `06` 只承接当前正式 `00`~`05`,旧 `06/07` 只作 historical / old direction input。 | 从旧 `06` 的泛化 test / staging 或旧 EV 编号生成基线。 |
| Step 2 范围表 | P0/P1/P2、只验接缝、潜在 VETO 和详细设计名称使用规则。 | 把 P1/P2 selected-run 当成 P0 必过基线。 |
| `05-测试方案.md` §13 | `EV-ML-*`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/...`、`reports/review/...`。 | 使用 `latest`、`reports/<project>` 或 `artifacts/test/<project>/<run_id>`。 |
| `05-测试方案.md` §14 | residual、不可风险接受、回归触发和不得退出情况。 | 用 residual 覆盖 P0 evidence 缺口或 VETO。 |
| `04-配置设计.md` | profile、config validation、adapter binding、secret/redaction、availability/degraded。 | 伪造 config digest 或把 production-like 写成当前 P0。 |
| L1-governance Step 3 | framework_reference | 参考基线表、证据入口表、变更规则和不可接受引用粒度。 | 复制 governance 领域基线内容或 EV-GOV 编号。 |

### 3. SOP Step 3 问题思考

| SOP 问题 | R3.1 初判 | R3.2 写入提醒 |
|---|---|---|
| 按哪一版需求和设计验收? | 按当前正式 `projects/L3-method-library/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`。正式验收前必须记录 design commit 或 source refs。 | 写基线表,版本 / 标识先写“待固定”,不得假填。 |
| 按哪一版测试方案和测试结果裁决? | 测试方案按当前 `05-测试方案.md`;测试结果必须绑定唯一非 `latest` 的 `run_id`,由 `EV-ML-*`、suite reports、raw artifact、run summary 和 acceptance handoff 支撑。 | 区分“测试方案基线已存在”和“真实测试结果待送验固定”。 |
| 送验 build / commit / image 是什么? | 当前设计阶段没有送验实现版本。正式验收前必须固定 implementation commit / build id / image digest 或等价交付标识。 | 记录为送验前置缺口,不得自行推断。 |
| 环境、配置、数据和依赖是什么? | P0 应固定 profile、config digest、fixture/seed/replay root、adapter mode、dependency boundary evidence。P1/P2 selected-run 单独标识。 | 不把 staging-like / production-like 写成 P0 pass 前置。 |
| 基线变更如何处理? | `00`~`05`、implementation commit、profile、config digest、suite/report/evidence schema 或 artifact root 影响 P0 时必须触发回归并生成新 `run_id`。 | 写出变更处理规则,不写具体执行结果。 |
| 本轮验收固定的 `run_id` 是什么? | 当前不能填写。正式裁决前必须固定到 raw artifact、run report、evidence index、acceptance handoff 和 review notes。 | 明确 `<run_id>` 是待固定占位,不是正式值。 |
| 原始机器证据是否位于 `artifacts/test/<run_id>`? | 必须是。该路径是正式 raw artifact root。 | 禁止 `artifacts/test/<project>/<run_id>`、临时目录和 `latest`。 |
| 人类可读报告是否位于 `reports/runs/<run_id>`? | 必须是。suite report、summary、evidence index、redaction/dependency/report audit 都应绑定同一 `run_id`。 | run report 不得替代 raw artifact。 |
| 验收交接文件是否位于 `reports/acceptance/`? | 必须是。`handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 是后续 Step 10~14 的输入。 | 如果尚未生成,记录为正式验收前置缺口。 |
| 是否存在不可作为正式基线的引用? | `latest`、无 digest artifact、无 report pair、静态 evidence / VETO passed、泛化 test/staging 环境、P1 unavailable 计入 P0 passed 均不可接受。 | 在 R3.2 写不可接受基线引用表。 |

### 4. 基线候选抽取思考

#### 4.1 文档 / 设计基线候选

| 基线候选 | 来源 | R3.1 判断 |
|---|---|---|
| 需求基线 | `00-需求文档.md` | 必须固定 source ref;提供 FR-ML / BR-ML / NFR-ML、验收方向和 VETO 输入。 |
| 架构基线 | `01-架构设计.md` | 必须固定 source ref;提供 truth owner、Definition vs Use、依赖方向和架构红线。 |
| 概要基线 | `02-概要设计.md` | 必须固定 source ref;提供组成部分、对象轮廓、接口骨架、状态和异常轮廓。 |
| 详细设计基线 | `03-详细设计.md` | 必须固定 source ref;提供后续 AC 使用的正式字段、状态、port、protocol、flow、error。 |
| 配置基线 | `04-配置设计.md` | 必须固定 source ref 和 config digest;提供 profile、validation、adapter、redaction、dependency。 |
| 测试方案基线 | `05-测试方案.md` | 必须固定 source ref;提供 `TC-ML-*`、`EV-ML-*`、suite、artifact/report path、residual。 |
| standards 基线 | 验收 SOP、书写规范、中间产物规范、可落码性标准 | 需固定 standards source ref;控制 `06` 生成方式和裁决闭环。 |

#### 4.2 交付 / 执行基线候选

| 基线候选 | R3.1 判断 | 当前状态 |
|---|---|---|
| implementation commit | 正式验收前必须固定。 | 当前未提供,不得伪造。 |
| build id / image digest / package digest | 如存在交付物,必须固定到可复验标识。 | 当前未提供。 |
| core upstream / shared contract 版本 | 若实现依赖 `L0-core` 或等价 core package,必须固定版本。 | 当前待后续实施计划 / 送验说明提供。 |
| `run_id` | 必须唯一、非 `latest`,并贯穿 artifact/report/acceptance/review。 | 当前未提供。 |
| fixture / seed / replay root | P0 suite 使用的数据集必须可复现、可清理、脱敏。 | 当前待测试执行固定。 |

#### 4.3 证据入口候选

| 证据入口 | 正式路径方向 | R3.1 判断 |
|---|---|---|
| raw artifact | `artifacts/test/<run_id>/...` | 唯一机器原始证据入口,后续 report 必须可回指。 |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | 人类可读,必须由 raw artifact 推导。 |
| run summary | `reports/runs/<run_id>/summary.md` | 汇总入口,不得替代 suite report 或 raw artifact。 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 将 `EV-ML-*` 绑定 TC、suite、artifact、report、AC/VETO。 |
| acceptance handoff | `reports/acceptance/handoff.md` | 送验说明和验收交接入口。 |
| veto checklist | `reports/acceptance/veto-checklist.md` | Step 11 输入,不得静态全部 passed。 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | Step 13 / Step 14 输入,只支撑可接受 residual。 |
| review supplement | `reports/review/...` | 记录人 / Agent 审查补充,不得替代 P0 evidence。 |

### 5. 旧正式 06 污染思考

| 旧基线口径 | R3.1 判断 | R3.2 处理 |
|---|---|---|
| 泛化 test / staging 环境 | 不可作为正式验收基线。 | 写入不可接受引用表。 |
| 旧 EV-001 / TC-CMD / GATE-T | 与当前 `EV-ML-*` / `TC-ML-*` 不兼容。 | 禁止进入新版基线。 |
| PostgreSQL / object storage / fake bus / gateway | 旧产品假设,不是当前 P0 profile truth。 | 只保留 controlled seam / P1 selected-run 口径。 |
| P95 / SLO 硬阈值 | 当前无正式环境、负载和阈值基线。 | Step 9 再裁决,Step 3 只记录阈值基线待固定。 |

### 6. R3.2 写入策略思考

R3.2 应写入 Step 3 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 验收基线表 | 固定 `00`~`05`、standards、implementation、profile、config、data、run 的基线类型。 |
| 证据入口表 | 固定 raw artifact、run report、acceptance handoff、veto checklist、risk acceptance、review supplement 路径。 |
| P0 环境 / 配置基线 | 明确 P0 profile 和 config digest 必须固定,P1/P2 不替代 P0。 |
| 基线变更规则 | 定义 source refs / implementation / config / suite / schema 变化后的回归和新 `run_id` 规则。 |
| 不可接受基线引用 | 显式拒绝 `latest`、无 digest、静态 evidence、泛化环境、P1 污染 P0。 |
| 回填草稿 | 提供未来 `06` §3 草稿,不写正式文档。 |

### 7. R3.2 写入边界思考

`R3.2 baseline:再写入` 可以写入:

1. `06_acceptance_step_03_baseline.md` 的 SOP 问题回答、基线表、证据入口表、P0 环境 / 配置基线、变更规则、不可接受引用、回填草稿和进入 Step 4 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 3 completed_wait_user_confirm_to_R4.1。
3. `project_execution_ledger.md` 推进到 `06` Step 3 completed_wait_user_confirm_to_R4.1。

`R3.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. 真实 `run_id`、真实 implementation commit、真实 build/image digest 或真实 pass/fail。
3. Step 4 进入 / 退出条件正文。
4. 新 evidence schema、artifact schema、report schema、config key、CI YAML、implementation boundary 或 release sign-off。

### 8. R3.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 3 R3.1 | pass |
| 是否承接 Step 2 范围和 `05` §13 / §14 | pass |
| 是否识别 baseline / evidence / acceptance path | pass |
| 是否禁止 `latest` 和静态证据 | pass |
| 是否未填写真实 run_id / commit / verdict | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R3.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.2 baseline:再写入`;只允许写入 Step 3 的 SOP 问题回答、验收基线表、证据入口表、P0 环境 / 配置基线、基线变更规则、不可接受基线引用、回填草稿、待确认事项和进入 Step 4 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R3.2 baseline:再写入

### 1. 当前模块目标

`R3.2` 根据用户确认,完成 Step 3 的正式中间产物:明确新版 `06-验收标准.md` 验收时必须固定哪些文档、设计、标准、交付、环境、配置、数据、artifact、report 和 acceptance handoff 基线,并定义不可接受的基线引用和基线变更处理规则。

当前模块不修改正式 `06-验收标准.md`,不填写真实 `run_id`、implementation commit、build id、image digest、config digest、测试结果或验收 verdict。所有尚未实际生成的执行值均记录为送验前置缺口。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R4.1 |
| 用户确认 | 已确认从 R3.1 推进到 R3.2。 |
| 当前允许 | 写入 Step 3 的 SOP 问题回答、基线表、证据入口表、P0 环境 / 配置基线、变更规则、回填草稿和进入 Step 4 条件。 |
| 当前禁止 | 修改正式 `06`;写真实执行值;写 pass/fail;进入 Step 4。 |

### 2. 本步目标

本 Step 定义正式验收裁决时必须固定的需求、设计、测试、交付、环境、配置、数据、artifact、report、acceptance handoff 和 review 基线。

本 Step 只回答:

- 按哪些正式文档、标准和 source refs 验收。
- 送验 implementation commit / build id / image digest / package digest 应如何固定。
- P0 profile、config digest、adapter mode、fixture / seed / replay root 如何成为验收基线。
- raw artifact、run report、acceptance handoff、VETO checklist、risk acceptance 和 review supplement 的固定路径是什么。
- 基线变更如何处理。
- 当前哪些真实执行值尚未存在,必须作为送验前置缺口保留。

本 Step 不生成真实 `run_id`,不填写真实 commit,不读取实现仓执行结果,不裁决通过 / 有条件通过 / 不通过。

### 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | completed | 提供验收输入边界和旧材料隔离策略。 |
| `06_acceptance_step_02_scope.md` | completed | 提供 P0/P1/P2 范围、只验接缝项和潜在 VETO 输入。 |
| `05-测试方案.md` §13 | formal completed | 提供 `EV-ML-*`、raw artifact、suite report、run summary、acceptance handoff 和 review supplement 路径方向。 |
| `05-测试方案.md` §14 | formal completed | 提供回归触发、residual、不可风险接受和不得退出条件。 |
| `04-配置设计.md` | formal completed | 提供 P0 profile、config validation、adapter binding、secret/redaction 和 dependency boundary。 |
| 验收 SOP / 书写规范 / 中间产物规范 | standards input | 提供 Step 3 期望产物、禁止 `latest`、证据路径和正式装配约束。 |
| L1-governance Step 3 | framework_reference | 只参考基线表、证据入口表、变更规则和不可接受引用的表达粒度。 |

### 4. SOP 问题回答

| SOP 问题 | 回答 |
|---|---|
| 按哪一版需求和设计验收? | 按当前正式 `projects/L3-method-library/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。正式送验时必须记录这些文档所在 design commit 或等价 source ref。 |
| 按哪一版测试方案和测试结果裁决? | 测试方案按当前 `05-测试方案.md`。测试结果必须绑定一个固定且非 `latest` 的 `run_id`,并由 `reports/runs/<run_id>/evidence-index.md`、suite reports、run summary、raw artifact、redaction/dependency/report audit 和 `reports/acceptance/*` 支撑。 |
| 送验 build / commit / image 是什么? | 当前设计阶段没有送验 build。正式验收前必须固定 implementation commit、build id、image digest、package digest 或等价交付标识。没有固定交付物时不得裁决通过。 |
| 环境、配置、数据和依赖是什么? | P0 验收必须固定 profile、config digest、fixture / seed / replay root、adapter mode、run namespace、dependency boundary evidence 和 redaction configuration。P1/P2 selected-run 必须单独标记,不得替代 P0 controlled suite。 |
| 基线变更如何处理? | 基线固定后,若 `00`~`05`、standards、implementation commit、profile、config digest、suite set、artifact/report schema、evidence index 或 acceptance handoff 发生影响 P0 的变化,必须按 `05` §14 触发最小或全量 P0 regression,并生成新的 `run_id`。 |
| 本轮验收固定的 `run_id` 是什么? | 当前不填真实值。正式裁决前必须固定为唯一非 `latest` 值,并同时出现在 raw artifact、run report、evidence index、acceptance handoff 和 review 记录中。 |
| 原始机器证据是否位于 `artifacts/test/<run_id>`? | 必须是。任何 `artifacts/test/<project>/<run_id>`、临时目录、`latest`、无 digest artifact 或无 report pair 的路径都不能作为正式验收基线。 |
| 人类可读报告是否位于 `reports/runs/<run_id>`? | 必须是。suite report、run summary、evidence index、redaction check、dependency boundary、report audit 均必须绑定同一 `<run_id>`。 |
| 验收交接文件是否位于 `reports/acceptance/`? | 必须是。至少包括 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`。它们不能静态宣告通过,必须引用真实 evidence。 |
| 是否存在不可作为正式基线的引用? | 是。`latest`、泛化 test/staging 环境、无 source refs、无 config digest、无 digest artifact、无 report pair、静态 JSON EV/VETO、P1 unavailable 被写成 P0 pass 均不可作为正式基线。 |

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧基线包含 MethodContent、publish、snapshot、outbox、PostgreSQL、gateway、P95 等口径。 | 新版基线只承接当前 `00`~`05`、`EV-ML-*` 和 current artifact/report path。 |
| 旧 `06-验收标准.md` | 使用泛化 test / staging 环境和旧执行口径。 | 本 Step 要求 profile、config digest、run_id 和 source refs 全部固定。 |
| 当前 `05-测试方案.md` | 已定义证据族和路径,但没有真实 run。 | 记录为正式验收前置缺口,不得伪造。 |
| 当前 `04-配置设计.md` | 已定义 profile / config / adapter 方向,但无本轮 config digest。 | 记录为送验前必须固定的基线字段。 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档基线 | 旧 `06` 中旧方向局部引用。 | 当前正式 `00`~`05` + standards source refs。 | 验收必须可追溯到 full-restart 后真相源。 |
| 交付基线 | 未固定。 | implementation commit / build id / image digest / package digest 待固定。 | 无固定交付物不得裁决通过。 |
| 证据基线 | 旧 EV / 泛化报告。 | `EV-ML-*` + `artifacts/test/<run_id>` + `reports/runs/<run_id>` + `reports/acceptance/*`。 | 防止不可复验或静态造证据。 |
| 环境基线 | test / staging 泛化环境。 | P0 profile + config digest + controlled seam;P1/P2 单独标记。 | 防止真实产品或 selected-run 污染 P0。 |
| 基线变更 | 未定义。 | 影响 P0 的变化触发回归和新 `run_id`。 | 防止旧证据支撑新基线。 |

### 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否在设计阶段填真实 commit / run_id | A. 填占位真实值;B. 记录为待固定。 | 采用 B。没有执行证据时不得伪造基线。 |
| 是否允许 `latest` | A. 允许;B. 禁止。 | 采用 B。正式验收基线必须可定位、可复查、可重放。 |
| 是否允许 `reports/acceptance/*` 默认 passed | A. 允许;B. 必须由 evidence 推导。 | 采用 B。VETO 和风险接受必须可审计。 |
| 是否允许 P1 staging-like 替代 P0 evidence | A. 允许;B. 禁止。 | 采用 B。P1/P2 只能 residual / selected-run,不可替代 P0 blocking suite。 |

### 8. 结构化中间产物

#### 8.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L3-method-library/00-需求文档.md` | design commit / source ref 待固定 | 提供 FR-ML、BR-ML、NFR-ML、验收方向和 VETO 输入。 |
| 架构基线 | `projects/L3-method-library/01-架构设计.md` | design commit / source ref 待固定 | 提供 truth owner、Definition vs Use、依赖方向和架构红线。 |
| 概要基线 | `projects/L3-method-library/02-概要设计.md` | design commit / source ref 待固定 | 提供组成部分、对象轮廓、接口骨架、状态和异常轮廓。 |
| 详细设计基线 | `projects/L3-method-library/03-详细设计.md` | design commit / source ref 待固定 | 提供对象、port、protocol、flow、state、transaction、error、observability 和 test cut。 |
| 配置基线 | `projects/L3-method-library/04-配置设计.md` | design commit / source ref + config digest 待固定 | 提供 P0 profile、strict validation、adapter binding、secret/redaction 和 dependency boundary。 |
| 测试方案基线 | `projects/L3-method-library/05-测试方案.md` | design commit / source ref 待固定 | 提供 `TC-ML-*`、`EV-ML-*`、suite、artifact/report path、regression 和 residual。 |
| 标准基线 | 验收 SOP、验收书写规范、中间产物规范、可落码性标准 | standards commit / source ref 待固定 | 控制 `06` 生成、证据引用、schema 闭口和裁决闭环。 |
| 交付基线 | implementation commit / build id / image digest / package digest | 待固定 | 无固定交付物不得裁决通过。 |
| core upstream 基线 | `L0-core` 或等价 core contract / package version | 待固定 | 作为允许的 compile-time upstream 和 typed ref / base contract 来源。 |
| 环境基线 | P0 profile、adapter mode、dependency mode | profile ref + config digest 待固定 | P0 controlled seam;P1/P2 selected-run 另行标记。 |
| 数据基线 | fixture / seed / replay root | data set ref / run namespace 待固定 | 必须可复现、可清理、脱敏,并可回指 `TC-ML-*`。 |
| 证据基线 | `EV-ML-*` evidence families | `<run_id>` + evidence index 待固定 | 必须能绑定 TC、suite、artifact、report、AC/VETO。 |

#### 8.2 证据入口基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` 待固定 | 复核机器原始证据、suite result、case JSON、stdout/stderr、artifact digest。 | 送验前置 |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | `<run_id>` 待固定 | 阅读单 suite 结论;必须由 raw artifact 推导。 | 送验前置 |
| run summary | `reports/runs/<run_id>/summary.md` | `<run_id>` 待固定 | 汇总 run 状态,不得替代 suite report 或 raw artifact。 | 送验前置 |
| Evidence index | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` 待固定 | 将 `EV-ML-*` 绑定 TC、suite、artifact、report、AC/VETO。 | 送验前置 |
| 验收交接 | `reports/acceptance/handoff.md` | review version 待固定 | 记录送验范围、source refs、P0/P1/P2 边界、缺口和 residual。 | 送验前置 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | review version 待固定 | 判断 VETO 是否触发;不得默认全部 passed。 | 送验前置 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | review version 待固定 | 支撑有条件通过和 residual 接受;不得覆盖 P0 红线。 | 条件前置 |
| 开放问题 | `reports/acceptance/open-issues.md` | review version 待固定 | 支撑不通过 / 有条件通过 / 待修复结论。 | 送验前置 |
| 人工 / Agent 审查 | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | review version 待固定 | 补充边界、争议点和复核说明;不得替代 P0 evidence。 | 送验前置 |

#### 8.3 P0 环境 / 配置基线

| Profile / 模式 | 验收用途 | 依赖方式 | 必须固定 |
|---|---|---|---|
| `local-dev` | 手动 sanity 和设计复核辅助,不作为 release 唯一 evidence。 | in-memory / fake / disabled。 | profile ref、config digest if used。 |
| `ci-test` | deterministic contract / domain / service / fake integration 自动化。 | in-memory stores、deterministic fake adapters、fixed clock/id。 | profile ref、config digest、fixture set ref。 |
| `integration-like` | 跨入口、adapter unavailable/degraded、handoff/export failure mapping。 | controlled seam、fake / controlled failure injection、no sibling compile dependency。 | profile ref、config digest、adapter refs。 |
| `operations-replay` | replay、job report、report audit、no truth repair、idempotency。 | replay fixtures + fake / controlled adapters。 | profile ref、config digest、replay root ref。 |
| `staging-like` | P1 selected-run only。 | real-like / dry-run。 | 不作为 P0 前置;若执行则单独标记 P1。 |
| `production-like` | P2 / future operations readiness。 | approved real products。 | 当前不作为验收通过基线。 |

#### 8.4 `EV-ML-*` 证据基线

| Evidence ID | 来源 suite / check | 基线要求 |
|---|---|---|
| `EV-ML-CONTRACT-001` | `contract-domain-fast` | 必须绑定 truth / formal version / state 相关 TC 和 suite report。 |
| `EV-ML-SERVICE-001` | `service-flow-fast` | 必须绑定 command/query/flow/controlled consumption 相关 TC。 |
| `EV-ML-INFRA-001` | `infra-runtime-fake` | 必须绑定 runtime seam、UoW、dependency、marker source 相关 TC。 |
| `EV-ML-ENTRY-001` | `entry-worker-job` | 必须绑定 entry、trace、audit、job、report surface 相关 TC。 |
| `EV-ML-REPLAY-001` | `operations-replay-core`;`operations-replay-extended` | core subset 是 P0;extended 只能按标记进入 nightly / residual。 |
| `EV-ML-CONFIG-001` | `config-redline` | 必须绑定 profile、config digest、invalid config fail-fast 和 marker 相关 TC。 |
| `EV-ML-DEPENDENCY-001` | `dependency-boundary` | 必须证明 non-core sibling compile dependency 不存在。 |
| `EV-ML-REDACTION-001` | `redaction-boundary` | 必须证明 raw body、secret、provider response 不进入 observable outputs。 |
| `EV-ML-OBSERVABILITY-001` | `observability-boundary` | 必须证明 metric / trace / audit / diagnostic 不反写真相且 body-free。 |
| `EV-ML-REPORT-001` | `report-generation-audit` | 必须证明 artifact/report pairing、failed artifact retention 和 no static evidence。 |
| `EV-ML-RELEASE-001` | `release-main-smoke` | 只作 release readiness representative,不得替代底层 suite。 |
| `EV-ML-RISK-001` | P1 selected-run / residual report | residual only,不得作为 P0 pass 证据。 |

#### 8.5 基线变更处理规则

| 变更 | 处理 |
|---|---|
| `00`~`05` 任一 P0 需求 / 设计 / 测试范围变化 | 重新执行受影响验收 Step,并按 `05` §14 触发相关 P0 regression。 |
| standards 中验收、证据、schema、台账或可落码性规则变化 | 复核 Step 1~当前 Step 受影响内容,必要时重写中间产物并重新确认。 |
| implementation commit / build / image 变化 | 必须生成新 run 或证明变更不影响 P0;默认不得复用旧 evidence。 |
| core upstream / shared contract 版本变化 | 至少重跑 contract-domain-fast、dependency-boundary 和 affected suites。 |
| config digest / profile 变化 | 重跑 config-redline、runtime builder、affected suite 和 release config check。 |
| suite set / gate script / report script 变化 | 重跑 report-generation-audit 和受影响 suite;不得复用旧 evidence index。 |
| artifact/report schema 变化 | 生成新 `run_id`;重建 evidence index 和 acceptance handoff。 |
| P1 selected-run 变化 | 不影响 P0 通过前置,但必须更新 residual / risk acceptance。 |

#### 8.6 不可接受基线引用

| 引用 | 原因 | 处理 |
|---|---|---|
| `latest` | 不可复验、不可审计。 | 拒绝作为正式验收基线。 |
| `artifacts/test/<project>/<run_id>` | 路径不符合 `05` §13。 | 迁移到 `artifacts/test/<run_id>` 或重跑。 |
| `reports/<project>/...` | 路径不符合 `05` §13。 | 迁移到 `reports/runs/<run_id>` 或重跑。 |
| 无 artifact digest 的 report | 无法证明 raw evidence 来源。 | 阻断验收。 |
| 无 report pair 的 raw artifact | 人类不可复核。 | 阻断验收或重建 report。 |
| 静态 JSON 直接生成 EV / VETO passed | 证据真实性不足。 | 阻断验收。 |
| 泛化 test / staging 环境 | 无 profile、config digest、run_id 和 source refs。 | 不可作为正式基线。 |
| P1 unavailable 被计入 P0 passed | 污染 P0 裁决。 | 阻断或改为 residual。 |
| source-missing stop 被默认值绕过 | 违反不可风险接受项。 | 阻断验收并回写缺口。 |

### 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收基线表”“证据入口基线表”“P0 环境 / 配置基线”“EV-ML 证据基线”“基线变更处理规则”和“不可接受基线引用”小节,了解验收基线如何固定。

正式 `06-验收标准.md` §3 应回填:

本轮验收基线必须固定需求、架构、概要、详细、配置、测试方案、标准、交付、core upstream、环境、配置、数据和证据。正式裁决前必须记录 design commit / source refs、standards source refs、implementation commit、build id / image digest / package digest、profile、config digest、fixture / seed / replay root、adapter mode 和唯一非 `latest` 的 `run_id`。

raw artifact 固定为 `artifacts/test/<run_id>/...`;suite report 固定为 `reports/runs/<run_id>/suites/<suite>.md`;run summary 固定为 `reports/runs/<run_id>/summary.md`;evidence index 固定为 `reports/runs/<run_id>/evidence-index.md`;acceptance handoff 固定为 `reports/acceptance/handoff.md`;一票否决检查、风险接受和开放问题分别固定在 `reports/acceptance/veto-checklist.md`、`reports/acceptance/risk-acceptance.md`、`reports/acceptance/open-issues.md`;review supplement 固定在 `reports/review/...`。

当前设计阶段不填写真实 `run_id`、implementation commit、build id、image digest 或 config digest。若这些基线缺失,正式验收只能停在未进入 / 不可裁决状态。

基线固定后,任何影响 P0 的需求、设计、标准、实现、配置、suite、artifact/report schema、evidence index 或 acceptance handoff 变化,都必须触发回归并生成新的 evidence。`latest`、无 digest artifact、无 report pair、静态 EV/VETO passed、泛化 test / staging 环境、P1 unavailable 被计入 P0 passed、source-missing stop 被默认值绕过,均不可作为正式验收基线。

### 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式送验 implementation commit / build id / image digest | 影响是否可进入验收裁决。 | 当前未提供,记录为送验前置缺口。 |
| 正式 `run_id` | 影响所有 evidence / report / acceptance path。 | 当前未提供,不得伪造。 |
| config digest 和 profile | 影响 config-redline、runtime builder 和 P0 profile 证据。 | 当前未提供,后续执行阶段固定。 |
| fixture / seed / replay root | 影响 P0 suite 可复现性。 | 当前未提供,后续执行阶段固定。 |
| `reports/acceptance/*` 是否生成 | 影响 Step 10 / Step 11 / Step 13 / Step 14。 | 当前未提供,正式裁决前必须生成或记录为阻断。 |

### 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 基线类型已完整列出 | pass | 见 §8.1。 |
| artifact / report / acceptance handoff 路径已固定 | pass | 见 §8.2。 |
| P0 环境和配置基线已明确 | pass | 见 §8.3。 |
| `EV-ML-*` 证据基线已承接 | pass | 见 §8.4。 |
| 基线变更规则已定义 | pass | 见 §8.5。 |
| 不可接受基线引用已列出 | pass | 见 §8.6。 |
| 当前缺失真实执行值未被伪造 | pass | 均列为送验前置缺口。 |
| 可进入 Step 4 | pass | 下一步定义进入条件与退出条件;进入前等待用户确认。 |

### 12. R3.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R3.1 写入边界执行 | pass |
| 是否参考 L1-governance Step 3 框架但未复制领域事实 | pass |
| 是否完成 SOP Step 3 问题回答 | pass |
| 是否形成验收基线表和证据入口基线表 | pass |
| 是否显式禁止 `latest`、静态证据和路径错位 | pass |
| 是否未填写真实 run_id / commit / verdict | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.1 entry exit:先思考`;只允许思考验收进入条件、退出条件、送验前置缺口、阻断缺陷、风险接受前置和退出不可用条件;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
