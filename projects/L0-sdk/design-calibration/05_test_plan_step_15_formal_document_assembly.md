# L0-sdk 05 测试方案 Step 15:整理正式测试方案文档

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` 全文
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 15 |
| 主题 | 整理正式测试方案文档 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 是 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_15_formal_document_assembly.md` |

本步删除旧版 `05-测试方案.md`,并按 `测试方案书写规范.md` 的 15 章主链重建正式文档。正式文档不直接粘贴 Step 1~14 的问题回答,而是摘录已确认的结构化结论。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 回填 §1 |
| `05_test_plan_step_02_scope.md` | 回填 §2 |
| `05_test_plan_step_03_test_objects_slices.md` | 回填 §3 |
| `05_test_plan_step_04_strategy_layers.md` | 回填 §4 |
| `05_test_plan_step_05_traceability_matrix.md` | 回填 §5 |
| `05_test_plan_step_06_cases.md` | 回填 §6 |
| `05_test_plan_step_07_test_data.md` | 回填 §7 |
| `05_test_plan_step_08_environment_config.md` | 回填 §8 |
| `05_test_plan_step_09_automation_ci_gates.md` | 回填 §9 |
| `05_test_plan_step_10_special_nonfunctional.md` | 回填 §10 |
| `05_test_plan_step_11_defects_retest.md` | 回填 §11 |
| `05_test_plan_step_12_entry_exit_criteria.md` | 回填 §12 |
| `05_test_plan_step_13_reports_evidence.md` | 回填 §13 |
| `05_test_plan_step_14_regression_risks.md` | 回填 §14 |
| `standards/document/测试方案书写规范.md` | 校验正式文档主链和输出格式 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是,章节为 §1~§15,未新增额外主章。 |
| 是否保留所有 P0 测试对象、场景、数据、环境、门禁和证据? | 是,§3~§13 分别承接对象、分层、追溯、用例、数据、环境、门禁、专项、缺陷、准则和证据。 |
| 是否删除 SOP 问题原文和讨论语气? | 是,正式文档只保留方案结论和可执行矩阵。 |
| 是否所有未确认项都进入残余风险? | 是,§14 汇总 public registry、production endpoint、credential provider、remote config、gateway、性能阈值和全量服务覆盖风险。 |
| P0 用例是否都回指详细设计对象、协议、状态或错误契约? | 是,§3 和 §6 明确以 `03-详细设计.md` 正式对象、协议、状态和错误为断言源。 |
| 是否存在旧状态名、旧字段名、口语名或 phase 越界断言? | 已按 `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState` 收敛。 |
| 是否能被 `06-验收标准.md` 直接消费? | 是,§5、§10、§12、§13、§14 提供验收所需用例、专项、退出准则、证据和残余风险。 |

## 4. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧版 `05-测试方案.md` 仍围绕 binding / wrapper / subscription / release manifest 旧主线 | 已删除旧文件并重建 |
| 旧文档缺少 `design-calibration` 校准来源 | 每章已补校准来源和延伸阅读 |
| 旧文档无法承接新版 `04-配置设计.md` | 已新增测试环境与配置矩阵、配置专项和准入准则 |
| 旧文档未约束 artifacts / reports 路径 | 已在 §9、§12、§13 固定路径 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试主线 | binding、wrapper、subscription、release manifest | official client access layer、semantic baseline、derived view、runtime boundary、candidate evidence、compatibility、configuration |
| 文档结构 | 旧版自由结构 | 新版 15 章主链 |
| 证据路径 | 不稳定 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 用例编号 | 旧 `TC-*` 口径 | `TC-SDK-*`、`TS-SDK-*`、`EV-SDK-*` |
| 配置承接 | 缺失 | 承接 `04-配置设计.md` |
| 验收输入 | 不足 | 可直接输入 `06-验收标准.md` |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否保留旧版描述 | 不保留 | 旧版主线与新版 `00~04` 不一致 |
| 是否把中间产物完整复制进正式文档 | 不复制 | 正式文档需要结论化、可执行、可审查 |
| 是否填写执行结果 | 不填写 | 测试方案定义如何测试,执行结果由 reports 产出 |
| 是否把 P1/P2 纳入 P0 出口 | 不纳入 | 只记录残余风险和验收承接 |

## 7. 结构化中间产物

### 7.1 正式文档自审结果

| 检查项 | 结果 |
|---|---|
| 15 章主链完整 | 通过 |
| 每章含校准来源 | 通过 |
| P0 范围、对象、用例、数据、环境、门禁、证据齐全 | 通过 |
| 未写实际执行结果 | 通过 |
| artifact / report 路径符合规范 | 通过 |
| 残余风险有接受人或责任角色 | 通过 |
| 可作为 `06-验收标准.md` 输入 | 通过 |

### 7.2 后续输入关系

```text
05-测试方案.md
  |
  +--> 06-验收标准.md
  |      - 使用 P0 用例、证据 ID、退出准则、风险接受
  |
  +--> 07-实施计划.md
         - 使用 gate、script、artifact/report、回归触发
```

## 8. 回填草稿

本步已直接重建正式 `projects/L0-sdk/05-测试方案.md`,无额外回填草稿。

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否进入 `06-验收标准.md` 校准 | 是 | `05` 已提供验收所需证据、退出准则和风险口径 |
| 是否提交当前 L0-sdk 测试方案改动 | 等用户确认 | 当前仅完成文档写入与校验 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 正式测试方案已重建 | 已满足 |
| 自审结果已记录 | 已满足 |
| 测试方案可作为验收标准和实施计划输入 | 已满足 |
