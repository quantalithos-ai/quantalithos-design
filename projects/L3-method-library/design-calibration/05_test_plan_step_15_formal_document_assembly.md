# Step 15. 整理正式测试方案文档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填章节: 完整 `05-测试方案.md`
> 创建日期: 2026-06-28
> 当前模式: full-restart / step15-formal-document-assembly
> 当前状态: completed
> 当前模块: `R15.2 formal document assembly:再写入`
> 当前门禁: `R15.2` completed_wait_user_confirm_to_06;正式 `05-测试方案.md` 已完成 full-restart 装配,等待用户确认是否启动 `06-验收标准.md`

---

## R15.1 formal document assembly:先思考

### 1. 当前模块目标

`R15.1` 只思考正式 `05-测试方案.md` 的装配边界、必读文档、SOP 七问、正式 15 章主链、Step 1~14 来源映射、旧正式 05 污染隔离、章节装配顺序、校准来源 / 延伸阅读写法、R15.2 写入边界和装配停审。

当前模块不写正式 `05-测试方案.md` 正文,不替换旧正式 05,不执行测试,不填写真实 run_id / pass / fail / defect status,不写验收标准、实施计划、CI YAML、脚本实现或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R15.2 |
| 用户确认 | 已确认从 Step 14 completed 推进到 Step 15 `R15.1`。 |
| 当前允许 | 思考正式 05 装配边界、来源映射、污染隔离、分批写入计划、正式章节校准来源和 R15.2 写入边界。 |
| 当前禁止 | 直接写正式 `05-测试方案.md`;写验收标准、实施计划、执行结果、真实证据、CI YAML、脚本实现或 implementation code。 |

### 2. Step 15 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进和正式 05 不得跳写。 | 跳过 R15.1 直接替换正式 `05`。 |
| `05_test_plan_calibration_flow.md` | Step 1~14 completed,Step 15 blocked_by_wait_user_confirm_to_R15.1。 | 未经确认进入 R15.2。 |
| `05_test_plan_step_01_input_boundary.md` ~ `05_test_plan_step_14_regression_risks.md` | 正式 05 的全部装配来源。 | 从旧 `05/06/07` 或实现侧假设直接生成正文。 |
| `00-需求文档.md` | 仓定位、FR / BR / NFR、验收红线和方法资产定义边界。 | 在正式 05 中重定义需求。 |
| `01-架构设计.md` | truth owner、Definition vs Use、依赖方向和跨仓边界。 | 重画架构或引入旧 publish/outbox 主线。 |
| `02-概要设计.md` | 八个组成部分、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 引入旧 `MethodContent` 总对象、旧 snapshot/fingerprint 主线。 |
| `03-详细设计.md` | 对象、port、protocol、flow、state、transaction、error、config、observability、test cut。 | 新增未闭口 schema、port、mapper、marker、state 或 phase。 |
| `04-配置设计.md` | profile、config source、validation、secret/redaction、adapter availability、failure/degradation。 | 把配置测试、验收或实施门禁写成配置契约。 |
| SOP Step 15 | 固定七问、正式文档、自审结果和不得原样粘贴中间产物。 | 把 SOP 问题原文留在正式文档。 |
| 书写规范 §3 / §5.15 / §6 / 模板 | 固定 15 章主链、校准来源块和评审清单。 | 改章节名或漏校准来源。 |
| 中间产物规范 | 正式章节必须可追溯,不得新增中间产物未确认结论。 | 在正式正文里补新测试结论。 |

### 3. SOP Step 15 七问思考边界

| SOP 问题 | R15.1 初判 | R15.2 写入提醒 |
|---|---|---|
| 正式文档是否按 15 章主链组织? | 必须使用书写规范固定 §1~§15,章节名不得随意改。 | R15.2 先替换为完整 15 章结构。 |
| 是否保留所有 P0 测试对象、场景、数据、环境、门禁和证据? | 需从 Step 3~14 装配,不能压缩成摘要。 | 每章以结论正文呈现,展开细节引回中间产物。 |
| 是否删除 SOP 问题原文和讨论语气? | 正式文档只保留收口结论、表格、图和清单。 | 不复制“应问的问题 / 当前模块”等过程话术。 |
| 是否所有未确认项都进入残余风险? | Step 14 已收 residual 和转入 `06` 事项。 | §14 装配 residual,§15 引用待重启 `06`。 |
| P0 用例是否回指详细设计对象、协议、状态或错误契约? | Step 6 / Step 5 / Step 13 已建立追溯方向。 | §5 / §6 / §13 需要保留设计依据和证据引用。 |
| 是否存在旧状态名、旧字段名、口语名或 phase 越界断言? | 当前旧正式 05 存在大量旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway 口径。 | R15.2 应整体替换旧正文,不做局部修补。 |
| 是否能被 `06-验收标准.md` 直接消费? | Step 13 / 14 已给 EV / residual / transfer-to-06 方向。 | 正式 §13 / §14 必须明确 `06` 消费入口,但不裁决验收。 |

### 4. 旧正式 05 污染隔离思考

当前 `projects/L3-method-library/05-测试方案.md` 是旧方向材料,不能作为本轮测试真相源。R15.2 应整体替换正式正文,避免旧主线残留。

| 旧口径 | 当前问题 | R15.2 处理 |
|---|---|---|
| 7 类 P0 `MethodContent` | 与 current `00/01/02/03` 的方法资产定义 / catalog / formalization / consumption / traceability / distribution / external summary / maintenance / peripheral 主线不一致。 | 删除旧主线,按 Step 1~14 新口径装配。 |
| `publish` / `published` / snapshot / fingerprint / old outbox | 已被 current 03 判定为旧主线,不得作为测试对象正向来源。 | 只保留 current 03 已确认的 event candidate / handoff / report / stored replay 等新口径。 |
| PostgreSQL / gateway / object storage stub 等产品化环境 | 当前测试方案应保持 product-neutral / controlled seam,不锁定具体产品。 | 用 Step 8 的 profile / dependency matrix 替代。 |
| `EV-001` / `TC-CMD-*` 等旧编号 | 与当前 `TC-ML-*` / `EV-ML-*` 不一致。 | 全量替换为 `TC-ML-*` / `EV-ML-*` 族。 |
| 性能硬阈值 `<50ms` / `<500ms` | 当前 Step 10/14 只允许 sample/trend,硬阈值需新版 `06` 闭口。 | 删除硬阈值,保留 sample/trend 和 transfer-to-06。 |

### 5. 正式章节来源映射思考

| 正式章节 | 装配来源 | R15.2 装配重点 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 当前 `00/01/02/03/04` 输入边界、旧 05/06/07 隔离、测试方案职责。 |
| §2 本次测试目标与范围 | Step 2 | P0/P1/P2、非范围、测试目标和不重定义需求 / 设计。 |
| §3 测试对象与测试切口 | Step 3 | 测试对象、切口、设计依据、覆盖批次。 |
| §4 测试策略与分层 | Step 4 | 测试层级、执行分层、controlled seam 和 release smoke 边界。 |
| §5 需求追溯与覆盖矩阵 | Step 5 | FR / BR / NFR / design / TC / EV 追溯方向。 |
| §6 测试场景与用例设计 | Step 6 | `TC-ML-*` 用例族和跨批审计,正式正文可摘要族,细表引回 Step 6。 |
| §7 测试数据设计 | Step 7 | fixture / builder / fault injection / seed / sensitive data 边界。 |
| §8 测试环境与配置矩阵 | Step 8 | profile、依赖类型、环境拓扑、P1/P2 selected-run。 |
| §9 自动化与 CI/CD 门禁 | Step 9 | suite family、gate layering、artifact/report direction、no CI YAML。 |
| §10 专项测试与非功能验证 | Step 10 | redaction、dependency、observability、sample/trend、source gap。 |
| §11 缺陷管理与复验规则 | Step 11 | S/A/B/R、复验矩阵、风险接受、防回归触发。 |
| §12 进入准则与退出准则 | Step 12 | entry / exit、阻断项、no latest、no static pass。 |
| §13 测试报告与证据归档 | Step 13 | `EV-ML-*`、artifact/report root、report generation、audit。 |
| §14 回归策略与残余风险 | Step 14 | 回归触发表、全量 P0、residual、transfer-to-06。 |
| §15 参考 | Step 1~14 + standards | 正式上游、规范、校准 flow、Step 中间产物和旧材料定位。 |

### 6. R15.2 写入策略思考

R15.2 应采用整体替换正式 `05-测试方案.md`,而不是在旧正文上局部 patch。原因是旧正文从标题、目标、测试对象、用例、证据、环境到回归风险均含旧主线,局部修补会产生新旧口径混杂。

| 批次 | 写入范围 | 目的 | 单批约束 |
|---|---|---|---|
| R15.2-a | 文档元信息、§1~§3 | 建立新版正式头部、输入边界、测试目标和测试对象。 | 约 100~300 行。 |
| R15.2-b | §4~§6 | 装配策略分层、追溯矩阵、用例族。 | 约 100~300 行。 |
| R15.2-c | §7~§10 | 装配数据、环境、自动化门禁、专项测试。 | 约 100~300 行。 |
| R15.2-d | §11~§15 | 装配缺陷、进出准则、证据、回归风险和参考。 | 约 100~300 行。 |
| R15.2-e | final self-check | 校准来源、旧口径清理、格式、正式 05 diff 和台账推进。 | 不写新结论。 |

### 7. 校准来源 / 延伸阅读写法思考

正式每章必须在正文前写校准来源块。固定方向:

```md
> 校准来源:
> - `design-calibration/05_test_plan_step_XX_*.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”“stop-review”和“待确认事项”小节,了解本章测试方案结论如何从讨论收敛而来。
```

§15 参考章节可引用 Step 1~14、flow、SOP、书写规范、中间产物规范和正式 `00`~`04`,但不应把旧 `05/06/07` 作为当前测试真相源。

### 8. R15.2 写入边界思考

`R15.2 formal document assembly:再写入` 可以写入:

1. 正式 `projects/L3-method-library/05-测试方案.md` 的完整新版正文。
2. 每章校准来源和延伸阅读块。
3. 从 Step 1~14 中间产物装配出的范围、对象、策略、追溯、用例族、数据、环境、suite/gate、专项、缺陷、进出准则、证据、回归和参考。
4. Step 15 自审记录和 completed stop-review。
5. flow 和 project ledger 推进到 `05-测试方案.md` completed_wait_user_confirm_to_06。

`R15.2` 禁止写入:

1. 未在 Step 1~14 或正式 `00`~`04` 中确认的新 TC、EV、suite、profile、config key、schema、port、mapper、state、marker source 或 phase boundary。
2. 实际测试执行结果、真实 run_id、真实 pass/fail、缺陷状态、验收 verdict 或 release sign-off。
3. 新版 `06-验收标准.md` 内容、`07-实施计划.md` 内容、CI YAML、脚本实现或 implementation code。
4. 旧 `MethodContent` / publish / snapshot / fingerprint / old outbox / PostgreSQL / gateway 等历史主线正向内容。

### 9. R15.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 15 正式文档装配边界 | pass |
| 是否确认 Step 1~14 均 completed | pass |
| 是否读取并对照 SOP Step 15、书写规范和中间产物规范 | pass |
| 是否识别旧正式 05 污染并决定整体替换 | pass |
| 是否形成正式 15 章来源映射 | pass |
| 是否形成 R15.2 分批写入计划和写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.2 formal document assembly:再写入`;只允许按 R15.1 的分批策略整体替换正式 `05-测试方案.md`,装配 Step 1~14 已确认中间产物,写入每章校准来源 / 延伸阅读、Step 15 自审记录,并推进 flow / project ledger 到 `05-测试方案.md` completed;不得写验收标准、实施计划、CI YAML、脚本实现、真实执行结论或 implementation code。

---

## R15.2 formal document assembly:再写入

### 1. 当前模块目标

`R15.2` 根据用户确认,整体替换正式 `projects/L3-method-library/05-测试方案.md`,只从 Step 1~14 已确认中间产物和当前正式 `00`~`04` 装配测试方案正文,并完成 Step 15 自审、flow 恢复点和项目台账推进。

当前模块不启动 `06-验收标准.md`,不写 `07-实施计划.md`,不生成真实测试执行结果,不填写真实 run_id / pass / fail / defect status,不写 CI YAML、脚本实现或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_06 |
| 用户确认 | 已确认从 R15.1 推进到 R15.2。 |
| 本次写入 | 正式 `05-测试方案.md`;本 Step 15 记录;`05_test_plan_calibration_flow.md`;`project_execution_ledger.md`。 |
| 当前禁止 | 直接进入 `06`;写验收裁决、实施计划、执行结果、真实证据、CI YAML、脚本实现或 implementation code。 |

### 2. 正式文档装配结果

| 装配项 | 结果 |
|---|---|
| 正式文档 | `projects/L3-method-library/05-测试方案.md` 已整体替换为 `v1.0.0-full-restart`。 |
| 文档状态 | Draft;作为新版 `06-验收标准.md` 的测试方案输入。 |
| 章节结构 | 保留测试方案书写规范固定 15 章主链。 |
| 校准来源 | §1~§14 分别回指 Step 1~14;§15 汇总 Step 1~14、正式 `00`~`04` 和相关 standards。 |
| 测试 ID | 使用当前 `TC-ML-*` 用例族和 `EV-ML-*` 证据族。 |
| 证据口径 | 只定义 artifact/report 方向和 evidence family,不声明真实 run 结果。 |
| 下游入口 | §13 提供新版 `06` 可消费的 `EV-ML-*` 证据族;§14 提供 residual / transfer-to-06 事项。 |

### 3. 来源映射核对

| 正式章节 | 已装配来源 |
|---|---|
| §1 与上游文档的关系声明 | Step 1 input boundary。 |
| §2 本次测试目标与范围 | Step 2 scope。 |
| §3 测试对象与测试切口 | Step 3 test objects / cuts。 |
| §4 测试策略与分层 | Step 4 strategy / layers。 |
| §5 需求追溯与覆盖矩阵 | Step 5 traceability / coverage。 |
| §6 测试场景与用例设计 | Step 6 cases。 |
| §7 测试数据设计 | Step 7 test data。 |
| §8 测试环境与配置矩阵 | Step 8 environment / config。 |
| §9 自动化与 CI/CD 门禁 | Step 9 automation / gates。 |
| §10 专项测试与非功能验证 | Step 10 nonfunctional。 |
| §11 缺陷管理与复验规则 | Step 11 defects / retest。 |
| §12 进入准则与退出准则 | Step 12 entry / exit。 |
| §13 测试报告与证据归档 | Step 13 evidence。 |
| §14 回归策略与残余风险 | Step 14 regression / risks。 |
| §15 参考 | Step 1~14、正式 `00`~`04`、SOP、书写规范、中间产物规范、可落码性标准。 |

### 4. 旧口径清理核对

| 旧口径 | R15.2 处理 |
|---|---|
| 旧 `MethodContent` 主线 | 未作为当前测试对象、用例或证据来源。 |
| 旧 `publish` / `published` / snapshot / fingerprint / old outbox | 未作为当前正向测试主线。 |
| PostgreSQL / gateway / object storage stub 产品绑定 | 替换为 product-neutral profile、fake / controlled seam 和 selected-run 口径。 |
| `EV-001` / `TC-CMD-*` 等旧编号 | 替换为 `EV-ML-*` / `TC-ML-*`。 |
| 性能硬阈值 | 保留 sample / trend,硬阈值转入新版 `06` 或后续基线闭口。 |

### 5. R15.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只装配正式 `05-测试方案.md` | pass |
| 是否未启动 `06-验收标准.md` | pass |
| 是否未修改 `07-实施计划.md` | pass |
| 是否保留固定 15 章主链 | pass |
| 是否每章有校准来源和延伸阅读 | pass |
| 是否使用 Step 1~14 已确认中间产物 | pass |
| 是否未写真实 run_id / pass / fail / acceptance verdict | pass |
| 是否推进 flow 和 project ledger 到 `05` completed | pass |

next_allowed_action: `05-测试方案.md` full-restart completed;等待用户确认是否启动 `06-验收标准.md` full-restart Step 1;在用户确认前不得直接修改 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论或 implementation code。
