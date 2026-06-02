# L1-conversation 05 测试方案 Step 15: 整理正式测试方案文档

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` 全文
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 15 |
| 主题 | 整理正式测试方案文档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 是 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_15_formal_document_assembly.md` |
| 正式文档 | `projects/L1-conversation/05-测试方案.md` |

本步已删除旧版 `05-测试方案.md`,并按新文件标准重建正式测试方案。正式文档不再沿用旧稿的 Conversation / Turn / StreamEvents / projection 主线,改为承接新版 `00~04` 和 Step 1~14 中间产物。

## 2. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | §1 与上游文档关系 | 已使用 |
| `05_test_plan_step_02_scope.md` | §2 测试目标与范围 | 已使用 |
| `05_test_plan_step_03_test_objects_slices.md` | §3 测试对象与切口 | 已使用 |
| `05_test_plan_step_04_strategy_layers.md` | §4 测试策略与分层 | 已使用 |
| `05_test_plan_step_05_traceability_matrix.md` | §5 需求追溯与覆盖 | 已使用 |
| `05_test_plan_step_06_cases.md` | §6 测试场景与用例 | 已使用 |
| `05_test_plan_step_07_test_data.md` | §7 测试数据 | 已使用 |
| `05_test_plan_step_08_environment_config.md` | §8 测试环境与配置 | 已使用 |
| `05_test_plan_step_09_automation_ci_gates.md` | §9 自动化与门禁 | 已使用 |
| `05_test_plan_step_10_special_nonfunctional.md` | §10 专项与非功能验证 | 已使用 |
| `05_test_plan_step_11_defects_retest.md` | §11 缺陷与复验 | 已使用 |
| `05_test_plan_step_12_entry_exit_criteria.md` | §12 进入 / 退出准则 | 已使用 |
| `05_test_plan_step_13_reports_evidence.md` | §13 报告与证据归档 | 已使用 |
| `05_test_plan_step_14_regression_risks.md` | §14 回归与残余风险 | 已使用 |
| `standards/document/测试方案书写规范.md` | 15 章主链和评审清单 | 已使用 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 正式文档是否按 15 章主链组织? | 是,正式 `05-测试方案.md` 使用 §1~§15 固定主链 | `测试方案书写规范.md` §3 |
| 是否保留所有 P0 测试对象、场景、数据、环境、门禁和证据? | 是,§3~§13 分别承接对象、场景、数据、环境、门禁和 EV | Step 3~13 |
| 是否删除 SOP 问题原文和讨论语气? | 是,正式文档只保留结论、表格、清单和引用入口 | Step 15 执行约束 |
| 是否所有未确认项都进入残余风险? | 是,P1/P2 和量化指标缺口进入 §14 | Step 14 |
| P0 用例是否回指详细设计对象、协议、状态或错误契约? | 是,§6 用例断言使用正式状态、错误、event 和 path 口径 | Step 6; `03-详细设计.md` |
| 是否存在旧状态名、旧字段名、口语名或 phase 越界断言? | 未发现;正式文档未使用旧 Turn / stream 主线作为测试 truth | Step 6 防提前写入检查 |
| 是否能被 `06-验收标准.md` 直接消费? | 是,§13 EV、reports / artifacts 路径和 §14 风险规则可供 06 建 AC | Step 13~14 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧 `05-测试方案.md` 只有 12 章,不符合当前 15 章主链 | 无法被新版验收标准和实施计划直接消费 | 已删除旧文件并重建 |
| 旧稿围绕 Turn / stream / projection 旧主线 | 与新版 conversation truth center 不一致 | 已改为 space / scope、fact append、authorized consumption、manifestation、handoff、outbox、jobs、reports 主线 |
| 旧稿缺少 design-calibration 来源入口 | 无法追溯讨论结论 | 每个正式章节均增加具体中间产物来源和延伸阅读 |
| 旧稿缺少 run-scoped artifacts / reports 口径 | 证据不可验收 | 已固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 文档结构 | 12 章旧结构 | 15 章标准主链 | 对齐 `测试方案书写规范.md` |
| 测试目标 | Turn / stream / projection 旧主线 | Conversation truth center P0 主链 | 对齐新版 `00~04` |
| 用例矩阵 | 泛化测试描述 | `TC-CONV-*` 用例矩阵 | 可执行、可断言、可留证 |
| 证据编号 | 未成体系 | `EV-CONV-*` 证据族 | 可供 `06-验收标准.md` 回指 |
| 报告路径 | 未固定 run-scoped 结构 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 对齐目录和证据规范 |
| 风险 | 泛化残余风险 | S0/S1 不可接受,P1/P2 风险有 owner | 避免红线被风险接受绕过 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 正式文档是否原样粘贴中间产物 | 全量复制 Step 1~14 | 摘录核心结论并保留延伸阅读入口 | B | 正式文档应可读,细节由中间产物承接 |
| 用例矩阵是否完整展开前置条件 | 完全复制 Step 6 大表 | 保留输入 / 操作、预期结果、断言、自动化和 EV | B | 正式文档保持可执行,细节可回读 Step 6 |
| AC 是否在 05 中生成 | 在 05 生成 AC | 05 只生成 EV,AC 留给 06 | B | 测试方案提供证据,验收标准做裁决 |
| 残余风险是否写 S0/S1 | 可写入并接受 | 只允许 S2/S3 或 P1/P2 | B | S0/S1 必须修复,不能风险接受 |

## 7. 结构化中间产物

### 7.1 正式文档装配检查

| 章节 | 校准来源 | 装配状态 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 已装配 |
| §2 本次测试目标与范围 | Step 2 | 已装配 |
| §3 测试对象与测试切口 | Step 3 | 已装配 |
| §4 测试策略与分层 | Step 4 | 已装配 |
| §5 需求追溯与覆盖矩阵 | Step 5 | 已装配 |
| §6 测试场景与用例设计 | Step 6 | 已装配 |
| §7 测试数据设计 | Step 7 | 已装配 |
| §8 测试环境与配置矩阵 | Step 8 | 已装配 |
| §9 自动化与 CI/CD 门禁 | Step 9 | 已装配 |
| §10 专项测试与非功能验证 | Step 10 | 已装配 |
| §11 缺陷管理与复验规则 | Step 11 | 已装配 |
| §12 进入准则与退出准则 | Step 12 | 已装配 |
| §13 测试报告与证据归档 | Step 13 | 已装配 |
| §14 回归策略与残余风险 | Step 14 | 已装配 |
| §15 参考 | Step 15 | 已装配 |

### 7.2 自审结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 上游承接 | 通过 | §1 明确 00~04 和 06 的关系 |
| 范围清晰 | 通过 | §2 明确 P0 / P1 / P2 和非范围 |
| 切口完整 | 通过 | §3 覆盖对象、协议、状态、事务、恢复、配置、观测 |
| 字段状态闭环 | 通过 | §6 使用正式状态、错误、event 和 path |
| 分层合理 | 通过 | §4 将风险分配到 unit、service、contract、worker、job、release gate |
| 追溯完整 | 通过 | §5 建立需求 / 规则 / NFR 到 TC / EV 追溯 |
| 校准来源完整 | 通过 | 每章均有具体 `design-calibration` 来源和延伸阅读 |
| 用例可执行 | 通过 | §6 每个 P0 用例有输入、预期、断言和自动化候选 |
| 数据可复现 | 通过 | §7 使用 deterministic seed、builder、fake script 和 `TestRunId` |
| 环境可用 | 通过 | §8 定义 local-dev、ci-test、integration-like、operations-replay |
| 自动化门禁 | 通过 | §9 定义 PR、main CI、nightly、release gate |
| 证据可审计 | 通过 | §13 定义 EV、reports 和 artifacts 路径 |
| 验收可消费 | 通过 | §13 / §14 可被 06 建 AC 时消费 |
| 风险不隐藏 | 通过 | §14 将 P1/P2 和 S2/S3 风险显式列出 |

## 8. 回填草稿

本步已直接回填完整正式 `projects/L1-conversation/05-测试方案.md`,不再提供额外章节草稿。

## 9. 待确认事项

无阻塞进入 `06-验收标准.md` 的待确认事项。

后续必须继续收口:

- `06-验收标准.md` 需要从本文 §5、§6、§12、§13、§14 生成 AC 与 EV 映射。
- `07-实施计划.md` 需要引用本文 §9、§12、§13、§14 的 gate、证据和回归策略。
- 实现仓 agent 需要按本文固定路径创建 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式测试方案可作为验收标准输入 | 通过 | TC、EV、退出准则、风险均已定义 |
| 正式测试方案可作为实施计划输入 | 通过 | gate、scripts、artifacts / reports、回归集已定义 |
| 旧文件已删除并重建 | 通过 | `05-测试方案.md` 已按新文件标准重建 |
| Step 15 可关闭 | 通过 | 下一步可进入 `06-验收标准.md` 校准 |
