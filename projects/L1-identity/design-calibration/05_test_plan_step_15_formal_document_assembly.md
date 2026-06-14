# Step 15. 整理正式测试方案文档

> 回填章节: `projects/L1-identity/05-测试方案.md` 全文
> 当前文件职责: 记录 Step 15 的正式装配计划、自审结果和跨文档一致性复核。

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式测试方案文档 |
| 执行日期 | 2026-06-14 |
| 输入基线 | Step 1~14 已审核通过的测试方案校准中间产物 |
| 正式输出 | `projects/L1-identity/05-测试方案.md` |
| 当前状态 | 正式 `05-测试方案.md` 已装配、通过本地自检并经用户审核通过 |

---

## 2. 本步目标

把 Step 1~14 的校准结论装配为正式 `05-测试方案.md`,并确保正式文档:

- 使用 `测试方案书写规范.md` 规定的 15 章主链。
- 每个正式章节都能回指具体 `design-calibration/05_test_plan_step_*.md`。
- 保留 P0 测试对象、切口、用例族、数据、环境、门禁、证据、缺陷、进入 / 退出、回归和残余风险。
- 删除旧版 identity 测试方案中的旧对象、旧入口、旧用例编号、旧环境和旧证据口径。
- 不新增 Step 1~14 未确认的 schema、port、state、error、DTO、config key、fixture、CI、artifact、evidence 或验收裁决。

---

## 3. 本步输入

| 输入 | 状态 | 使用方式 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已审核通过 | 正式 §1 来源 |
| `05_test_plan_step_02_scope.md` | 已审核通过 | 正式 §2 / §14 来源 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已审核通过 | 正式 §3 来源 |
| `05_test_plan_step_04_strategy_layers.md` | 已审核通过 | 正式 §4 来源 |
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 正式 §5 来源 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 正式 §6 来源 |
| `05_test_plan_step_07_test_data.md` | 已审核通过 | 正式 §7 来源 |
| `05_test_plan_step_08_environment_config.md` | 已审核通过 | 正式 §8 来源 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 正式 §9 来源 |
| `05_test_plan_step_10_nonfunctional.md` | 已审核通过 | 正式 §10 来源 |
| `05_test_plan_step_11_defects_retest.md` | 已审核通过 | 正式 §11 来源 |
| `05_test_plan_step_12_entry_exit.md` | 已审核通过 | 正式 §12 来源 |
| `05_test_plan_step_13_evidence.md` | 已审核通过 | 正式 §13 来源 |
| `05_test_plan_step_14_regression_risks.md` | 已审核通过 | 正式 §14 来源 |
| `测试方案讨论流程_SOP.md` Step 15 | 标准输入 | 装配纪律 |
| `测试方案书写规范.md` | 标准输入 | 正式文档结构、编号、证据和章节规则 |
| `设计文档讨论中间产物规范.md` §3.6 / §5.10 | 标准输入 | Step 内计划与跨文档一致性复核 |

---

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是。正式 `05` 使用规范规定的 1~15 章标题,不沿用旧版章节。 |
| 是否保留所有 P0 测试对象、场景、数据、环境、门禁和证据? | 是。正式文档保留 6 Command、14 Query、5 Consumer/Callback、10 Outbound Material、6 Operations Job、P0 suite、DS-ID、TC-ID 和 EV-ID 族。 |
| 是否删除 SOP 问题原文和讨论语气? | 是。正式文档只保留结论、矩阵和规则;讨论细节留在本中间产物和 Step 1~14。 |
| 是否所有未确认项都进入残余风险? | 是。P1/P2 real-like、production-like、容量、硬 SLO、外部 HR / IdP 和证据保留期进入正式 §14。 |
| P0 用例是否回指详细设计对象、协议、状态或错误契约? | 是。正式 §3 / §5 / §6 使用 Step 3~6 的设计真相源映射。 |
| 是否存在旧状态名、旧字段名、口语名或 phase 越界断言? | 自审要求为否;最终以残留扫描和人工复核为准。 |
| 是否能被 `06-验收标准.md` 直接消费? | 是。正式 §5 / §12 / §13 / §14 输出 AC / VETO / EV / residual 可供新版 `06` 裁决矩阵消费。 |

---

## 5. 当前文档问题诊断

| 旧文档问题 | 处理 |
|---|---|
| 旧 `05` 使用旧入口、旧命令、旧事件、旧 job 和旧章节链 | Step 15 整文重建,不增量修补 |
| 旧 `05` 缺少每章校准来源入口 | 正式每章开头补具体 Step 文件引用 |
| 旧 `05` 不能承接新版 `00/01/02/03/04` | 正式文档只从 Step 1~14 已确认结论装配 |
| 旧 `05` 缺少 run-scoped artifact/report/evidence 防伪口径 | 正式 §9 / §13 固定 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |
| 旧 `05` 将 P1/P2 和 P0 混写 | 正式 §2 / §8 / §10 / §14 区分 P0 blocking、P1 selected-run 和 P2 future |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 正式结构 | 旧测试方案章节 | 规范 15 章主链 |
| 来源追溯 | 无稳定 Step 来源 | 每章引用具体 Step 中间产物 |
| 用例编号 | 旧 CMD / EVT 风格 | `TC-ID-*` 家族 |
| 数据编号 | 分散 fixture 描述 | `DS-ID-*` 家族 |
| 证据编号 | 旧 evidence 方向 | `EV-ID-*` 家族 |
| 自动化 | 旧 CI / smoke 描述 | P0 suite、gate、check、artifact/report 明确 |
| 非范围 | 混入测试目标 | P1/P2 / future / residual 明确分离 |

---

## 7. 测试设计取舍

| 议题 | 选择 | 理由 |
|---|---|---|
| 大文件写入方式 | 先搭建框架,再逐章节写入 | 降低整文替换风险,便于按章节审查和残留扫描 |
| 是否复制 Step 1~14 全量表 | 不复制 | 正式文档保持可消费;详细推导保留在校准文件 |
| 是否新增 report-only TC | 不新增 | Step 9 / Step 13 已固定 `EV-ID-REPORT-001` 绑定已有 blocking suite case refs |
| 是否把 P1 selected-run 写为 P0 pass | 不写 | P1 unavailable 只进入 residual,不得伪造 P0 通过 |
| 是否补设计缺口 | 不补 | 测试方案只验证正式设计,发现缺口回写上游 |

---

## 8. 结构化中间产物

### 8.1 正式章节装配表

| 正式章节 | 来源 Step | 装配方式 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 收敛上游 truth source、旧文档降级和不补设计缺口规则 |
| §2 本次测试目标与范围 | Step 2 | 收敛 P0 / P1 / P2、非范围和 VETO 承接 |
| §3 测试对象与测试切口 | Step 3 | 收敛 P0 object / protocol / flow / job / config / redaction cuts |
| §4 测试策略与分层 | Step 4 | 收敛测试金字塔、主发现层级和 release gate 边界 |
| §5 需求追溯与覆盖矩阵 | Step 5 | 精简 C / FR / BR / NFR / AC / VETO 覆盖矩阵 |
| §6 测试场景与用例设计 | Step 6 | 按 TC family 保留核心用例矩阵和断言方向 |
| §7 测试数据设计 | Step 7 | 保留 DS-ID 数据集、构造、隔离、清理和映射 |
| §8 测试环境与配置矩阵 | Step 8 | 保留 profile、依赖类型、配置项和不可用处理 |
| §9 自动化与 CI/CD 门禁 | Step 9 | 保留 suite、gate scripts、artifact/report、report audit |
| §10 专项测试与非功能验证 | Step 10 | 保留 NFR、VETO、redaction、fault injection 和 fake parity |
| §11 缺陷管理与复验规则 | Step 11 | 保留 S/A/B/R、复验矩阵和风险接受边界 |
| §12 进入准则与退出准则 | Step 12 | 保留 entry / exit / pause criteria |
| §13 测试报告与证据归档 | Step 13 | 保留 EV-ID、artifact schema、reports、失败证据规则 |
| §14 回归策略与残余风险 | Step 14 | 保留回归触发、全量回归、残余风险和不可接受项 |
| §15 参考 | Step 1~14 + 标准 | 列正式上游、校准产物和标准 |

### 8.2 Step 内计划

| 计划项 | 状态 | 产物 |
|---|---|---|
| 读取输入和前序结论 | 已完成 | 本文件 §3 |
| SOP 问题回答 | 已完成 | 本文件 §4 |
| 当前材料 / 旧文档诊断 | 已完成 | 本文件 §5 |
| 设计取舍 | 已完成 | 本文件 §7 |
| 结构化中间产物 | 已完成 | 本文件 §8 |
| 复杂度判断 / 是否拆模块或附录 | 已完成 | 采用框架先行、逐章节写入;不拆附录 |
| 回填草稿 | 已完成 | 正式 `05-测试方案.md` |
| 自检与进入下一步条件 | 进行中 | 本文件 §12 |

### 8.3 跨文档一致性复核表

| 复核项 | 判定 | 处理 |
|---|---|---|
| 正式 `05` 是否只承接新版 `00/01/02/03/04` | 通过 | 旧 `05/06` 只作历史诊断 |
| P0 / P1 / P2 是否未混淆 | 通过 | P1/P2 写入 residual 或 future |
| 用例、数据、证据编号是否来自 Step 6 / 7 / 13 | 通过 | 正式文档不新增编号体系 |
| artifact/report 路径是否符合规范 | 通过 | 使用 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` |
| VETO / AC 是否可被新版 `06` 消费 | 通过 | §5 / §12 / §13 / §14 保留映射 |
| 是否出现治理仓编号或旧 identity 残留 | 通过 | 残留扫描未命中 |
| 是否出现 secret / raw body 示例 | 通过 | 敏感信息扫描未命中 |

---

## 9. 对上游设计的影响判定

| 事项 | 是否需要回写上游 | 理由 |
|---|---|---|
| Step 15 装配正式测试方案 | 否 | 只装配已审核 Step 1~14 |
| 删除旧 `05` 口径 | 否 | 旧文档已在 Step 1 降级为历史诊断 |
| 保留 P1/P2 residual | 否 | 符合 Step 2 / Step 14 范围边界 |
| 若实现阶段发现 TC / EV 无法产证 | 是 | 需回写 `03/04/05/06/07` 对应闭口 |

---

## 10. 回填草稿

正式回填目标为 `projects/L1-identity/05-测试方案.md`。本 Step 不在中间产物中复制正式全文,只记录装配规则和自审结果。

---

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 新版 `06-验收标准.md` 何时重建 | 影响 AC / VETO 最终裁决矩阵 | `05` 只提供可消费 evidence 和 residual |
| P1 selected-run 是否未来升级为 release 前置 | 影响 P0 exit gate | 当前不升级,写入 §14 residual |
| 性能硬阈值是否未来硬化 | 影响 NFR 裁决 | 当前只要求 sample/trend,写入 §10 / §14 |
| 证据保留天数 | 影响归档运维策略 | 当前要求保留到验收和复验关闭,具体天数待新版 `06` 或运维标准固定 |

---

## 12. 进入下一步条件

| 门禁 | 状态 | 说明 |
|---|---|---|
| 正式 `05` 使用 15 章主链 | 通过 | heading scan 确认 §1~§15 唯一存在 |
| 每章有具体校准来源 | 通过 | §1~§14 均有具体 `05_test_plan_step_*` 来源 |
| 无治理仓 / 旧 identity 残留 | 通过 | residual scan 未命中治理仓编号或旧 identity 入口 |
| 无 secret / raw endpoint 示例 | 通过 | secret scan 未命中 |
| `git diff --check` 通过 | 通过 | 已执行并通过 |
| 可作为新版 `06` 和实施计划输入 | 通过 | 用户已确认 Step 15 |
