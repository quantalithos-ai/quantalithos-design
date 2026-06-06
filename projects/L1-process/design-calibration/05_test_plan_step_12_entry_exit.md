# Step 12. 定义进入准则与退出准则

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 12 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。进入 / 退出准则定义测试可开始和可结束的条件,不等同于 `06-验收标准.md` 的最终验收裁决。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1~11 | 汇总测试前置和通过条件 | 准则必须可判定 |
| `03` §15 | 最小验证清单 | 退出必须覆盖 P0 最小验证 |
| `04` §12 | 配置门禁 | invalid config / redaction / no fake fallback 必须通过 |
| Step 11 缺陷规则 | 阻断缺陷口径 | S 级为 0 |

---

## 3. SOP 问题回答

1. 什么时候可以开始测试?

   回答:当 `03/04` 基线已确认、用例和数据可构造、ci-test profile 可启动、gate 脚本可执行、artifact / report root 可写、redaction 基础检查可运行时可以开始 P0 测试。

2. 什么时候可以结束测试?

   回答:P0 suite 全部通过,S 级缺陷为 0,A 级阻断缺陷修复或风险接受,证据归档完整,redaction-check 通过,残余风险有接受人时可以结束测试。

3. 什么条件阻断测试开始?

   回答:正式 `03/04` 缺席、P0 DTO / config schema 不可构造、ci-test runtime 无法启动、artifact / report root 不可写、脚本契约缺失会阻断。

4. 什么条件阻断测试退出?

   回答:任何 S 级缺陷、P0 用例失败、证据缺失、redaction failure、duplicate replay / no-write / config fail-fast 红线失败、未接受残余风险都会阻断退出。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 进入 / 退出准则过粗 | 按新版 P0 suite、证据和 redaction 重建 |
| `06` 未同步 | 验收裁决未定 | 本 Step 只定义测试退出,不代表验收通过 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 进入准则 | 02/03 冻结和基础数据 | 加入 `03/04` 基线、ci-test runtime、scripts、artifact/report root |
| 退出准则 | P0 全过、S 缺陷为 0 | 加入 evidence index、redaction-check、config gate、residual risk |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 测试退出是否等于验收通过 | 不等于。测试退出提供证据,`06` 裁决 |
| P1 未跑是否阻断 P0 退出 | 不阻断,但必须进入残余风险 |
| redaction failure 是否可风险接受 | P0 不可风险接受,属于 S 级 |

---

## 7. 结构化中间产物

### 7.1 进入准则

- [ ] `00/01/02/03/04` 当前基线已确认,旧 `05` 不再作为测试事实源。
- [ ] `03` §15 的 P0 最小验证清单已转成 Step 6 用例矩阵。
- [ ] `04` 的 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 已转成 Step 8 环境矩阵。
- [ ] P0 contract / domain / service / integration / entry / script fixture 可构造。
- [ ] `ci-test` runtime 可使用 defaults / test JSON / CI env 启动。
- [ ] fake resolver、fake publisher、fake handoff、fixed clock、sequence id 和 in-memory store 可用。
- [ ] `scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh` 的契约已进入实施计划。
- [ ] `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 输出根可写。
- [ ] raw secret / raw body / forbidden package body 的基础 redaction fixture 可构造。

### 7.2 退出准则

- [ ] P0 `contract`、`domain`、`service`、`integration`、`entry-contract`、`config-security`、`evidence-scripts`、`minimum-e2e` suite 全部通过。
- [ ] 13 Command、11 Query、7 inbound event、10 outbound event、7 job 和 16 状态机均有通过证据。
- [ ] duplicate replay、idempotency conflict、result missing、version conflict、commit unknown、rollback failure 均有通过证据。
- [ ] Query no-write、outbox consistency、job no auto repair、configured adapter no fake fallback 均有通过证据。
- [ ] config validation、topic map completeness、raw secret reject、forbidden body reject、non-core dependency scan 均通过。
- [ ] `scripts/gates/run_ci_gate.sh` 输出 `artifacts/test/<run_id>`;失败样本有 failure report。
- [ ] `scripts/reports/generate_reports.sh` 输出 `reports/runs/<run_id>`,且不引用 `latest` 作为正式证据。
- [ ] `scripts/checks/check_redaction.sh` 输出 `reports/runs/<run_id>/redaction-check.md`,且 P0 run 通过。
- [ ] S 级缺陷为 0;A 级阻断缺陷已修复或有正式风险接受。
- [ ] 残余风险表已更新,每项有缓解方式和接受人角色。
- [ ] 证据可被后续 `06-验收标准.md` 引用。

---

## 8. 回填草稿

`05-测试方案.md` §12 应输出可勾选的进入和退出准则。退出准则不得写成验收通过,只能说明测试证据已达到可交给 `06` 裁决的状态。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP12-OPEN-001 | `06` 的正式一票否决和 AC 编号 | 待 `06` 重建后消费本章证据 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 进入准则可判定 | 通过 |
| 退出准则可判定 | 通过 |
| 测试退出与验收裁决边界明确 | 通过 |

