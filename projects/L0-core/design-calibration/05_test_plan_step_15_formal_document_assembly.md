# Step 15. 整理正式测试方案文档

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
- 回填章节：完整 `projects/L0-core/05-测试方案.md`

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 1~14 中间产物 | 输入边界、范围、对象、分层、追溯、用例、数据、环境、门禁、专项、缺陷、准则、证据、回归风险 | 整理正式测试方案 |
| `standards/document/测试方案书写规范.md` | 15 章主链、校准来源、图表和清单规则 | 校验正式文档结构 |
| 旧 `05-测试方案.md` | shared primitive / admission 旧口径 | 作为替换对象,不继承旧测试事实 |

依赖的前序 Step：Step 1~14 已确认。

## 3. SOP 问题回答

1. 正式文档是否按 15 章主链组织?

   回答：是。正式 `05-测试方案.md` 已按“与上游文档的关系声明”到“参考”的 15 章主链组织,未沿用旧文档章节结构。

2. 是否保留了所有 P0 测试对象、场景、数据、环境、门禁和证据?

   回答：是。正式文档保留了 Command / Query / Event / Job、domain、application、ports、runtime config、状态机、事务、幂等、outbox、job、audit、trace、配置、P0 用例、数据集、环境矩阵、自动化门禁和证据归档。

3. 是否删除了 SOP 问题原文和讨论语气?

   回答：是。正式文档没有保留每步“应问的问题”原文,只保留正式正文、表格、ASCII 图、清单和风险结论。

4. 是否所有未确认项都进入残余风险?

   回答：是。真实 L0-bus、真实下游仓库、真实 secret provider、完整性能容量压测、CI artifact 物理存储和旧 `06-验收标准.md` 均进入残余风险。

5. 是否能被 `06-验收标准.md` 直接消费?

   回答：可以。正式文档提供了稳定的 TC 用例 ID、EV 证据 ID、进入 / 退出准则、一票否决专项和转入验收标准清单。`06-验收标准.md` 后续应引用这些 ID 和门禁,不要重新定义测试用例。

## 4. 当前文档问题诊断

| 位置 | 问题 | 处理 |
|---|---|---|
| 旧 `05-测试方案.md` 全文 | 仍是 shared primitive / admission 旧口径 | 已全量替换为新版 L0-core 测试方案 |
| 旧 `05-测试方案.md` 章节 | 不符合新版 15 章主链 | 已按书写规范重排 |
| 旧 `05-测试方案.md` 测试对象 | 不覆盖当前 03 / 04 | 已改为 contract definition、release、snapshot、outbox、job、config 等对象 |
| 旧 `05-测试方案.md` 证据 | 缺少 TC / EV 稳定追溯 | 已建立用例和证据编号 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档口径 | shared primitive admission | 跨仓共享契约来源仓 P0 能力闭环 | 对齐新版 00~04 |
| 章节结构 | 旧自定义结构 | 测试方案书写规范 15 章主链 | 便于后续仓复用 |
| 校准来源 | 无逐章来源 | 每章引用具体 `design-calibration` 文件 | 保留讨论链路 |
| 测试对象 | CoreId / Ref / DTO / enum / registry | Command / Query / Event / Job、状态机、事务、配置、outbox、audit | 对齐 03 详细设计 |
| 证据 | 报告路径待定 | EV 证据 ID + 逻辑归档结构 | 可被验收消费 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧文档上局部替换术语 | 改动少 | 旧主线残留风险高 | 不采用 |
| B. 原样拼接 Step 1~14 回填草稿 | 速度快 | 会重复、冗长,不符合正式文档边界 | 不采用 |
| C. 以 Step 1~14 为依据重写正式文档 | 结构清晰,可读性和追溯性更好 | 需要单独校验 | 采用 |

## 7. 结构化中间产物

### 7.1 正式文档回填索引

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `05_test_plan_step_01_input_boundary.md` |
| §2 本次测试目标与范围 | `05_test_plan_step_02_scope.md` |
| §3 测试对象与测试切口 | `05_test_plan_step_03_test_targets.md` |
| §4 测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` |
| §5 需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability.md` |
| §6 测试场景与用例设计 | `05_test_plan_step_06_cases.md` |
| §7 测试数据设计 | `05_test_plan_step_07_test_data.md` |
| §8 测试环境与配置矩阵 | `05_test_plan_step_08_env_config.md` |
| §9 自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gate.md` |
| §10 专项测试与非功能验证 | `05_test_plan_step_10_special_nonfunctional.md` |
| §11 缺陷管理与复验规则 | `05_test_plan_step_11_defect_retest.md` |
| §12 进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` |
| §13 测试报告与证据归档 | `05_test_plan_step_13_evidence_report.md` |
| §14 回归策略与残余风险 | `05_test_plan_step_14_regression_risk.md` |
| §15 参考 | Step 1 / Step 14 |

### 7.2 自审清单

- [x] 正式文档按 15 章主链组织。
- [x] 每章标注具体校准来源。
- [x] 旧 shared primitive / admission 测试事实未继续作为新版事实沿用。
- [x] P0 用例具备稳定 TC ID。
- [x] P0 证据具备稳定 EV ID。
- [x] 配置设计已进入环境、数据、门禁、专项和证据章节。
- [x] 正式文档不填写测试执行结论。
- [x] 残余风险可被 `06-验收标准.md` 和 `07-实施计划.md` 消费。

## 8. 回填草稿

正式文档已写入：

```text
projects/L0-core/05-测试方案.md
```

## 9. 待确认事项

- `06-验收标准.md` 仍需在下一轮按新版 05 的 TC / EV / 门禁重写。
- 具体 CI artifact 物理存储路径仍需在 `07-实施计划.md` 或实现仓 CI 中固定。

## 10. 进入下一步条件

- [x] 测试方案可作为验收标准和实施计划输入。
- [x] 正式文档已替换旧口径。
- [x] 可以进入 `06-验收标准.md` 校准。
