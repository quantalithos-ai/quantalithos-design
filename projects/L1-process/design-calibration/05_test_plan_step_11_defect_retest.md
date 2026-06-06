# Step 11. 定义缺陷管理与复验规则

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 11 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节: `05-测试方案.md` §11 缺陷管理与复验规则
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。缺陷分级以设计红线、P0 用例、证据可审计和验收可消费为主,不替代实现仓 issue 流程。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 10 一票否决候选 | 定义 S 级缺陷 | 安全、truth、idempotency、no-write、configured fake fallback 等为 S |
| Step 6 用例矩阵 | 定义复验集 | 修复必须回归关联用例和相邻切口 |
| `03` §11 / §12 | 错误和恢复 | 错误 surface 漂移为 P0 缺陷 |
| `04` §11 | 配置失败策略 | invalid config silent fallback 为 S |

---

## 3. SOP 问题回答

1. 缺陷如何分级?

   回答:S 级表示破坏 truth、边界、安全、幂等、事务、证据或配置红线;A 级表示 P0 主线或重要恢复路径失败但未造成安全 / truth 污染;B 级表示非阻断的报告质量、P1 smoke、性能样本波动或低风险文档 / fixture 问题。

2. 修复后必须回归哪些用例?

   回答:至少回归直接失败用例、同一 suite 的相邻负向用例、相关 contract / state / idempotency / redaction gate。S 级必须回归 release gate 相关证据。

3. 是否需要新增自动化?

   回答:P0 缺陷必须新增或补强自动化。只有文案 / 报告解释类 B 级缺陷可不新增测试,但需记录原因。

4. 是否影响验收证据?

   回答:凡影响 EV 生成、evidence index、redaction-check 或 P0 suite report 的缺陷,必须重新生成固定 run_id 的证据,不得复用失败前证据。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 缺陷级别粗略,S/A/B 与新版红线不匹配 | 重建分级表 |
| Step 10 | 一票否决候选未转成缺陷管理 | 本 Step 映射为 S 级 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| S 级定义 | 恢复链 / projection / external truth | 加入 DTO、idempotency、config、redaction、evidence |
| 复验 | 泛化“修复后再放行” | 绑定用例、suite、证据重新生成 |
| 自动化 | 未明确 | P0 缺陷必须补自动化 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否用缺陷流程替代验收 | 不替代。缺陷复验产生证据,验收由 `06` 裁决 |
| B 级是否可带风险 | 可以,但必须进入 residual risk 并有接受人 |
| 失败证据是否可覆盖 | 不覆盖。失败和修复后的证据都按 run_id 保留 |

---

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 破坏 truth、状态、事务、幂等、安全、配置红线或证据可审计 | Query 写 truth;duplicate 重放 domain;raw secret 入报告;configured adapter fallback fake;outbox failure rollback truth | 必须修复,补自动化,重跑相关 P0 suite 和 evidence scripts | 是 |
| A | P0 主线或重要恢复路径失败,但未造成安全 / truth 污染 | 某 Command success 失败;consumer delayed mapping 错误;job partial receipt count 错误 | 修复或明确风险接受;通常阻断合并 / release | 视 gate |
| B | 非阻断质量问题、P1 smoke、报告解释不足或性能样本波动 | report 文案不清;P1 real-like endpoint 不稳定;benchmark trend warning | 排期处理或风险接受,不得影响 P0 pass | 否 |

### 7.2 复验规则

| 缺陷类型 | 最小复验集 | 是否新增自动化 | 证据要求 |
|---|---|---|---|
| DTO / protocol | `contract` + affected entry-contract | 是 | EV-CONTRACT 重新生成 |
| domain state / policy | `domain` + affected service smoke | 是 | EV-DOMAIN 重新生成 |
| command / transaction / idempotency | `service` + `integration` + affected E2E if release | 是 | EV-SERVICE / EV-INTEGRATION |
| query no-write | affected query + no-write scan | 是 | EV-SERVICE |
| inbound / outbound event | `entry-contract` + worker publish / consume suite | 是 | EV-WORKER |
| job / recovery / replay | `job` + `recovery-replay` | 是 | EV-JOB |
| config / dependency / adapter | `config-security` + relevant integration suite | 是 | EV-INTEGRATION |
| redaction / forbidden body | `config-security` + `evidence-scripts` + full redaction check | 是 | EV-SCRIPT |
| report / evidence | `evidence-scripts` + affected suite report | 视缺陷 | EV-SCRIPT |
| P1 real-like smoke | `p1-real-like-smoke` | 视缺陷 | EV-E2E or residual risk |

---

## 8. 回填草稿

`05-测试方案.md` §11 应输出缺陷分级表和复验规则。S 级缺陷必须阻断,修复后必须新增或补强自动化,并重新生成固定 run_id 证据。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP11-OPEN-001 | 实现仓 issue / tracker 字段 | 留给实现仓协作流程 |
| TP11-OPEN-002 | 风险接受人名单 | Step 14 以角色占位,待项目治理指定 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 缺陷分级可判定 | 通过 |
| 复验用例和证据要求明确 | 通过 |
| S 级阻断规则明确 | 通过 |

