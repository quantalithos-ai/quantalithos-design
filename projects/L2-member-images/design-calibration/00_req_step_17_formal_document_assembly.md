# Step 17. 正式文档装配

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `formal_00_stop_review` | stop_review | 旧正文已删除并从空骨架重建;16 章、16 个具体来源块、全部正式编号、20 行主矩阵、owner / seam / pending 和 historical 污染审计均通过 | 等待用户再次明确确认;不得创建 01 flow、修改正式 01 或进入任何 01 Step | `00-需求文档.md`;`project_execution_ledger.md`;`00_requirements_calibration_flow.md`;`00_req_step_01_upstream_relation.md`~`00_req_step_16_traceability_matrix.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、Step 1~16 和需求 SOP Step 17。
- [x] 读取需求书写规范的正式 16 章结构、校准来源块和长文档分批纪律。
- [x] 确认 Step 1~16 均为 `pass`,且 Step 16 无孤儿、串线或新增需求。
- [x] 固定 16 章来源 / 输出映射和跨章一致性约束。
- [x] 固定旧 README / 旧正式 00~06 的污染排除清单。
- [x] 删除旧正式 00,从空文件创建 16 章骨架。
- [x] 按 §7.3 六个批次只重组 Step 1~16 已闭合结论。
- [x] 每批完成章节、编号、来源、pending、owner 和依赖类型局部审计。
- [x] 完成全局静态审计,更新本文件、flow 和 ledger 为 `stop_review`。

## 2. 本步输入

| 输入 | 状态 | 本步使用方式 |
|---|---|---|
| Step 1~6 | pass | 装配上游关系、定位、问题、范围、角色和依赖裁剪 |
| Step 7~14 | pass | 装配能力、故事、功能、规则、数据、接口、NFR 与验收 |
| Step 15 | pass | 原样保持风险、MI-UP 和 Q 的性质与正向上限 |
| Step 16 | pass | 装配主追溯矩阵、漏项检查和追溯结论 |
| 项目 ledger / 00 flow | allow Step 17 | 作为三层写入门禁和唯一恢复点 |
| 旧 README / 旧正式 00~06 | historical_material | 只用于确认污染不回流,不得作为正文来源 |

## 3. SOP 问题回答

1. 正式文档采用什么结构?

   回答:采用需求书写规范固定的 16 章结构,不沿用旧 13 章结构,不把 Step 诊断、取舍、停审记录或实施建议写入正文。

2. 哪些内容允许在 Step 17 改写?

   回答:只允许重组、摘录、统一术语、统一编号、压缩重复描述和补齐已存在的交叉引用;不得新增目标、功能、规则、数据、接口、NFR、AC、风险、blocker 或 decision。

3. 如何处理未闭口 seam?

   回答:MI-UP-001~009 与 Q-MI-001~004 原样保持 pending / blocked / future 上限。正文可以写产品中立能力和 fail-closed 结果,不得写 positive contract、integration、测试或 readiness 已成立。

4. 如何区分正式正文与校准材料?

   回答:每章开头列出具体 `design-calibration/...` 来源并指出延伸阅读小节;正文只保留收口结论,诊断、方案比较、historical 差异和门禁记录留在校准文件。

5. 如何防止旧正文残留?

   回答:先删除旧 `00-需求文档.md`,再创建空骨架并分批写入。审计以 Step 1~16 编号集合为白名单,旧 `G-1`、`F-001`、`BR-001`、`US-001` 和无 authority 数字 / 产品不得出现。

6. 正式 00 装配完成后能否进入 01?

   回答:不能。完成后只把正式 00 和台账置为 `stop_review / review_pending`,立即停审;只有用户再次明确确认才允许创建 01 flow 或改写正式 01。

## 4. 旧正式文档问题诊断

| 旧正文问题 | 装配风险 | Step 17 防线 |
|---|---|---|
| 使用旧 13 章结构和错误下游顺序 | 缺失使用方、能力闭环、规则 / 数据边界,并跳过 04~07 | 从空文件使用正式 16 章结构 |
| 固定 9 Role、具体 Role / tool 清单 | 本仓形成第二 mapping truth | 只使用 C/F/BR 中的正式 mapping 来源与 no-enumeration 规则 |
| 继承 9/9、100%、99.9%、P95、时长、大小、retention | 形成无 evidence 的量化合同 | 只使用 NFR-MI-001~022 的离散判断口径 |
| 固定 buildx、Trivy、Grype、cosign、CI / registry 产品 | 产品进入需求 domain truth | 只保留 adapter-neutral builder / registry / applicable evidence seam |
| 把 scan / BOM / signature 作为已适用 gate | Q-MI-004 被伪关闭 | 只写“正式适用 gate 不可绕过”,具体 kind / priority pending |
| 把 member-service 解析、通知和启动写成已闭合 | 私造 exact contract、event output 和容器结果 | 只写 pinned entry / handoff gap;MI-UP-001/009 持续限制 positive lane |
| 本仓拥有 Artifact release / version / lineage | 形成通用 Artifact 第二 truth | 只持正式 `ConsumableArtifactReference` 与 pending handoff 关系 |
| 将 member/runtime/tools 写成源码或包依赖 | 消费关系被误写为 compile dependency | 只允许 component release ref;Core 仍是唯一 conditional compile candidate |
| 写入真实构建、digest、report、evidence 或验收结果 | 伪造尚未发生的事实 | 只定义未来可判断条件,文档状态固定为 review pending |

## 5. 装配取舍

| 方案 | 结果 | 结论 |
|---|---|---|
| 在旧正文上逐段替换 | 难以证明没有旧数字、产品、编号和结构残留 | 不采用 |
| 将 Step 1~16 全文拼接 | 诊断、取舍、停审和重复表进入正式正文 | 不采用 |
| 从空骨架按 16 章摘录结构化结论 | 来源、边界、编号和污染均可逐批审计 | 采用 |

## 6. 正式写入前门禁

```text
本次写入类型: 正式正文重建
目标文件: 00-需求文档.md
对应模块: formal_00_batches_01_to_06
项目级门禁: pass;project_execution_ledger 允许 Step 17
文档级门禁: pass;00 flow 允许正式 00 装配
Step / 模块级门禁: pass;Step 1~16 均允许回填,Step 17 precheck 已完成
思考记录状态: done
正式正文污染: no;只摘录结构化结论
批次规则误用: no;最终完整性不受单批行数限制
```

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 主校准来源 | 正文允许承载 | 正文不得承载 |
|---|---|---|---|
| §1 上游关系 | `00_req_step_01_upstream_relation.md` | authority 分层、正式承接、pending 与 historical 声明 | dirty workspace readiness、旧来源结论 |
| §2 定位与边界 | `00_req_step_02_position_boundary.md` | 一句话定义、非职责、truth 摘要、静态 / live 红线 | 详细数据模型或接口 |
| §3 背景与问题 | `00_req_step_03_problem_context.md` | 背景和 P-MI-001~009 | 方案、产品和旧量化指标 |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` | G-MI-001~007、NG-MI-001~015、范围层级 | 功能动作或 readiness |
| §5 用户与角色 | `00_req_step_05_users_roles.md` | HR-MI-001~005、SR-MI-001~008、角色边界 | 私造 RBAC / approval truth |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` | 裁剪表、类型表、禁止表、ASCII 图、失效后果 | API / schema / 产品 / out event |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` | C-MI-1~5、能力图、进入 / 退出和层级 | CI 步骤或实施顺序 |
| §8 用户故事 | `00_req_step_08_user_stories.md` | US-MI-001~015、US-MI-E01~E05、边界外摘要 | 停审过程和接口细节 |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` | F-MI-001~015、F-MI-E01~E05、逻辑链 | 输入输出长推演、产品和 readiness |
| §10 业务规则 | `00_req_step_10_business_rules_boundaries.md` | BR-MI-001~025、BR-MI-E01~E03、挂载摘要 | 状态机、字段、实现校验 |
| §11 数据归属 | `00_req_step_11_data_ownership.md` | D-MI-001~030、D-MI-E01~E04、四类口径 | schema、表、retention、外部正文 |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` | IF-MI-001~014、IF-MI-E01~E03、DEP-MI-001~016、seam | route、DTO、event schema、transport |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` | NFR-MI-001~022 和无 baseline 说明 | 旧 SLA / SLO、产品和已测结果 |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` | AC-MI-001~030、VETO-MI-001~007 | 测试步骤、工具、真实 verdict |
| §15 风险与待确认 | `00_req_step_15_risks_open_questions.md` | R-MI-001~010、MI-UP-001~009、Q-MI-001~004 | closure 承诺、TODO 或新方案 |
| §16 追溯矩阵 | `00_req_step_16_traceability_matrix.md` | 20 行主矩阵、漏项检查、追溯结论 | 新编号或 readiness 推导 |

### 7.2 分批写入计划

| 批次 | 正式范围 | 局部审计 |
|---|---|---|
| skeleton | 文档元信息、§1~16 标题和来源块 | 16 章齐全;每章有具体来源和延伸阅读 |
| batch 01 | §1~4 | authority、边界、P/G/NG 编号与旧数字 |
| batch 02 | §5~8 | HR/SR/C/US 编号、依赖图与 owner |
| batch 03 | §9~10 | F/BR 全量编号、逻辑映射和 pending |
| batch 04 | §11~12 | D/IF/DEP 全量编号、四类数据和 seam 类型 |
| batch 05 | §13~14 | NFR/AC/VETO 全量编号、无伪量化 / 结果 |
| batch 06 | §15~16 | R/MI-UP/Q 与 20 行主矩阵、漏项和 stop-review 语义 |

### 7.3 跨章一致性约束

- ID 白名单:只允许 Step 1~16 已存在的 `P/G/NG/HR/SR/C/US/F/BR/D/IF/DEP/NFR/AC/VETO/R/MI-UP/Q-MI-*`。
- Owner 一致:method mapping、component release、seed 正文、Artifact、container、Sandbox、governance、observability 和 external adapter truth 不得转入本仓。
- 状态一致:本仓 local truth、external snapshot / ref、adapter outcome 和 consumer confirmation 必须分层。
- 依赖一致:`compile/runtime/event/ref/adapter/fake` 必须显式;runtime / event / ref / adapter / fake 不得推导 package dependency。
- 静态一致:template / seed / pinned input / candidate output 不得与 secret、live memory、checkpoint、workspace live content、container / observed state 混写。
- Pending 一致:MI-UP-001~009、Q-MI-001~004 只能限制 positive lane,不得被润色为 closed / ready。
- 事实一致:不得出现真实 implementation、commit、run_id、artifact digest、report、evidence alias、test result、verdict、signoff 或 readiness。

### 7.4 装配后审计结果

| 审计项 | 结果 | 审计证据 |
|---|---|---|
| 16 章结构与来源块 | pass | §1~16 连续;16 个 `校准来源`、16 个 `延伸阅读` 和 16 个唯一 Step source 一一对应 |
| 正式 ID 覆盖 | pass | P/G/NG/HR/SR/C/US/F/BR/D/IF/DEP/NFR/AC/VETO/R/MI-UP/Q 共 18 组编号均无 missing / extra |
| Historical 污染 | pass | 旧固定 Role 数、旧比例 / SLA、固定架构、retention、工具产品、旧编号和旧状态机均未进入正式 00 |
| Owner / live-state | pass | 无第二 mapping / Artifact / container / runtime / policy / observed truth;static / live redline 全章一致 |
| 依赖类型 | pass | Core conditional compile;method / member-service runtime;Bus event input;ref / adapter / fake 分层一致 |
| Pending / readiness | pass | MI-UP-001~009、Q-MI-001~004 全部显式;无 positive integration、测试、evidence 或 readiness 事实 |
| 追溯完整性 | pass | 15 条核心与 5 条外围 F 均有 C / US / BR / D / AC;漏项检查无孤儿 |
| Markdown 静态结构 | pass | 所有表格列数一致,code fence 成对,`git diff --check` 无 whitespace error |
| 文档切换 | pass | 当前唯一动作是 `stop_review`;01 仍 blocked by explicit user confirmation |

## 8. 正式正文回填口径

正式 `00-需求文档.md` 以 Step 1~16 的“结构化中间产物”和“回填草稿”为唯一装配来源。表格可以压缩描述,但不得省略正式编号、owner 上限、pending 条件、四类数据、六类 NFR、五类 AC、VETO 或主追溯关系。每章来源块必须使用相对本项目路径。

## 9. 待确认事项

本 Step 不新增待确认事项。MI-UP-001~009 和 Q-MI-001~004 继续使用 Step 15 的性质与状态;装配过程中如发现缺口必须回退对应 Step,不得现场补结论。

## 10. 完成条件

| 检查项 | 当前结果 |
|---|---|
| 16 章来源 / 内容 / 排除映射是否固定 | pass |
| 三层正式写入门禁是否通过 | pass |
| 旧正文是否已删除并从空骨架重建 | pass |
| 六批正文是否已完成局部审计 | pass |
| 全量编号、来源、owner、依赖、pending 和污染审计是否通过 | pass |
| flow / ledger 是否已切换为正式 00 `stop_review` | pass |

当前 `gate_status = stop_review`;正式 00 已完成装配与审计。未经用户再次明确确认,不得创建 01 校准材料、修改 `01-架构设计.md` 或进入下一正式文档。
