# Step 12. 定义进入准则与退出准则

> 本步定义 `05-测试方案.md` §12 的测试进入准则与退出准则。本步只定义可判定门禁,不执行测试、不生成报告、不做验收裁决;报告结构留给 Step 13,残余风险留给 Step 14,正式验收裁决留给新版 `06-验收标准.md`。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 12 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §12 进入准则与退出准则 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 确认新版 `00/01/02/03/04` 为测试事实源,旧 `05/06` 不作为事实源 |
| `05_test_plan_step_05_traceability_coverage.md` | 确认 P0 `FR / BR / AC` 均有 `TC / EV` 覆盖 |
| `05_test_plan_step_06_cases_matrix.md` | 确认可执行 P0 用例矩阵和状态 / 事务 / 幂等 / 恢复断言 |
| `05_test_plan_step_07_test_data.md` | 确认 P0 数据集、fixture、fake seed、隔离和 cleanup 准备条件 |
| `05_test_plan_step_08_environment_config.md` | 确认 local-dev / ci-test / integration-like / operations-replay 环境准入 |
| `05_test_plan_step_09_automation_gates.md` | 确认 PR / main / nightly / release gate、suite、script 和路径约束 |
| `05_test_plan_step_10_special_non_functional.md` | 确认 NFR、redline、故障注入和观测证据条件 |
| `05_test_plan_step_11_defects_retest.md` | 确认 S / A / B / C 缺陷分级、风险接受边界和复验关闭规则 |
| `测试方案讨论流程_SOP.md` Step 12 | 本步问题、期望 checklist 和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 开始测试前哪些文档必须冻结? | 新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 必须有可引用 baseline;正式 `05-测试方案.md` 完成 Step 15 后才可作为测试执行事实源。旧 `05/06` 不能作为新版测试进入依据。 |
| 哪些环境和数据必须可用? | `ci-test` 是 P0 自动化主环境,必须具备 run-scoped temp root、deterministic fake adapter、P0 `DS-WORK-*` 数据集、strict config fixture 和 cleanup。`integration-like` 与 `operations-replay` 只在对应 suite 需要时准入。 |
| 哪些自动化必须可运行? | PR / main / release 阻断 suite 对应的 `scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*` 契约必须可执行或已有实现计划;正式测试执行前至少 `unit-contract-domain`、`service-core`、`api-contract-fast`、`config-fast`、`service-all`、`integration-p0`、`worker-job-contract`、`consumer-outbox`、`config-redaction` 可运行。 |
| 退出时哪些用例必须通过? | P0 `TC-WORK-*` 中 CORE、MEMBER、FORMAL、PROMOTE、DEP、ITER、QUERY、OPS、CFG、NFR 全部阻断用例必须通过;release gate 的 `release-main-smoke`、`release-config-redline`、`release-evidence-pack` 必须通过。 |
| 哪些缺陷和风险会阻断退出? | S 级缺陷必须为 0;影响 P0 gate 的 A 级缺陷必须为 0;redaction、path、evidence index、fake marker、idempotency duplicate truth、query no-write、truth pollution 任一失败均阻断退出。B / C 级和 P1/P2 风险只能在 Step 14 残余风险中记录,不得掩盖 P0 阻断项。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 9 | 已定义自动化 gate,但没有说明哪些 gate 是进入 / 退出硬条件 | 本步定义 PR / main / release gate 在进入和退出中的作用 |
| Step 10 | 已定义非功能红线,但没有转成退出准则 | 本步将 redaction、forbidden output、path、fake marker、NFR evidence 纳入退出阻断 |
| Step 11 | 已定义缺陷分级,但没有关联测试是否可结束 | 本步将 S / A / B / C 缺陷状态纳入退出准则 |
| 旧 `05-测试方案.md` | 旧进入 / 退出条件无法对应新版 `TC / EV / gate` | 本步重建正式 §12 回填草稿 |
| 旧 `06-验收标准.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式 `06` | 历史风险已关闭;风险接受和退出裁决以正式 `06` 为准 |

## 5. 改动前后对比

| 维度 | Step 11 后 | Step 12 收敛后 |
|---|---|---|
| 测试启动条件 | 有环境、数据、自动化和缺陷规则 | 可判定进入准则 checklist |
| 测试结束条件 | 有缺陷关闭规则 | 可判定退出准则 checklist |
| 文档 baseline | 分散在输入边界 | 明确 `00/01/02/03/04` 和正式 `05` 的准入关系 |
| 自动化门禁 | suite 阻断规则已定义 | 明确哪些 suite 必须可运行和通过 |
| 风险 / 缺陷 | S / A / B / C 已定义 | 明确 S / A 阻断退出,B / C 进入 Step 14 |
| 上游影响 | 无 | 无;不新增用例、证据、脚本或验收裁决 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 进入准则只要求代码可编译 | 简单 | 不能保证数据、环境、配置和证据可用 | 不采用 |
| 方案 B: 进入准则覆盖文档 baseline、P0 覆盖矩阵、数据、环境、自动化和缺陷规则 | 可执行且能避免测试中途补事实源 | 条件较多 | 采用 |
| 方案 C: 退出准则要求所有 nightly / staging-like / P1/P2 全通过 | 覆盖广 | 会把当前 P0 和未来生产化专项混淆 | 不采用 |
| 方案 D: 退出准则只看 release smoke | 快 | 会漏掉 redline、evidence、NFR 和缺陷关闭 | 不采用 |

采用方案 B,退出准则按 P0 阻断门禁和 Step 11 缺陷规则收口。

原因:

- `L1-work` 的 P0 测试不是单一 smoke,而是 Work truth、边界、配置、幂等、恢复和证据的闭环验证。
- 进入准则必须先保证正式测试事实源和执行资源可用,否则缺陷会混入设计缺口、fixture 缺口或环境缺口。
- 退出准则不应预支 P1/P2 staging-like / production-like,也不能绕过 S / A 缺陷和 redline。

## 7. 结构化中间产物

### 7.1 进入准则

```md
### 进入准则

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已有可引用 baseline。
- [ ] 正式 `05-测试方案.md` 已由 Step 15 装配完成,且不再引用旧版 `05/06` 作为事实源。
- [ ] `FR-WORK-001`~`008`、`BR-WORK-001`~`027`、`AC-WORK-001`~`029` 均已映射到 `TC-WORK-*` 和 `EV-WORK-*`。
- [ ] P0 用例矩阵已覆盖 Command、Query、Consumer、Outbound Event、Operations Job、状态机、事务、幂等、配置、观测和 NFR 红线。
- [ ] P0 `DS-WORK-*` 测试数据集、fixture builder、fake adapter seed、run-scoped isolation 和 cleanup 规则已可执行。
- [ ] `ci-test` profile 可启动,strict config、env override、redaction fixture、fake marker 和 temp root 可用。
- [ ] `integration-like` 和 `operations-replay` 所需 controlled adapter / replay bundle 在对应 suite 进入前可用,或明确不进入当前 run。
- [ ] PR / main / release 阻断 suite 对应 gate / check / report 脚本契约已实现或被当前实施计划列为本 run 前置任务。
- [ ] `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 输出路径可创建,且不会使用 `latest`。
- [ ] 缺陷分级、复验、自动化防回归和关闭证据规则已确认。
- [ ] 当前没有阻塞测试开始的上游设计缺口、字段缺失、状态冲突、配置缺失或环境不可用项。
```

### 7.2 进入准则判定表

| 准则类别 | 判定方式 | 失败处理 |
|---|---|---|
| 文档 baseline | 查看 design repo commit / formal docs 是否齐全 | 暂停测试,回到对应文档 Step 修复 |
| 覆盖矩阵 | 检查 Step 5 / Step 6 中 `FR / BR / AC -> TC / EV` 无空洞 | 补测试方案中间产物,不得直接进入执行 |
| 测试数据 | fixture / seed / cleanup dry-run | 缺数据则修 Step 7 或实现 fixture |
| 环境配置 | `ci-test` config load / validate dry-run | 配置失败按 `CFG-*` 修复 |
| 自动化可运行 | gate script dry-run 或实施计划前置检查 | 脚本未实现则进入 07 实施计划前置任务 |
| 证据路径 | path check dry-run | 修路径规则,禁止 `latest` |
| 缺陷规则 | Step 11 已完成且无未确认项 | 暂停,补缺陷规则 |

### 7.3 退出准则

```md
### 退出准则

- [ ] `unit-contract-domain`、`service-core`、`api-contract-fast`、`config-fast` 阻断 suite 通过。
- [ ] `service-all`、`integration-p0`、`worker-job-contract`、`consumer-outbox`、`config-redaction` 主线 suite 通过。
- [ ] `release-main-smoke`、`release-config-redline`、`release-evidence-pack` 通过。
- [ ] P0 `TC-WORK-*` 阻断用例全部通过,包括 CORE、MEMBER、FORMAL、PROMOTE、DEP、ITER、QUERY、OPS、CFG、NFR。
- [ ] 一票否决项和 S 级触发项全部为通过状态。
- [ ] S 级缺陷为 0。
- [ ] 影响 P0 gate、release gate 或 P0 evidence 的 A 级缺陷为 0。
- [ ] B / C 级缺陷已记录影响范围、处理计划和是否进入 Step 14 残余风险。
- [ ] redaction、forbidden output、fake marker、report path、evidence index 检查全部通过。
- [ ] duplicate / conflict / version conflict / commit unknown、query no-write、projection no-write、reconciliation read-only 和 outbox / handoff failure recovery 关键断言全部通过。
- [ ] `EV-WORK-*` 证据已生成并能从 `reports/runs/<run_id>/evidence-index.md` 追溯到 `TC-WORK-*` 和 `AC-WORK-*`。
- [ ] 测试报告和证据按 Step 13 定义归档到 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。
- [ ] 残余风险、P1/P2 未覆盖项和非阻断 nightly / staging-like 结果已进入 Step 14。
```

### 7.4 退出阻断项表

| 阻断项 | 来源 | 处理 |
|---|---|---|
| 任一 S 级缺陷未关闭 | Step 11 | 阻断退出,必须修复并复验 |
| P0 A 级缺陷未关闭 | Step 11 | 阻断退出,除非上游正式降级 P0 范围 |
| release redline 失败 | Step 9 / Step 10 | 阻断退出,不得风险接受 |
| raw secret / token / payload / source body 命中 | Step 10 | 阻断退出,修复后重跑 redaction |
| Work truth 被 query / projection / report / adjacent input 反写 | Step 6 / Step 10 / Step 11 | 阻断退出,修复并补自动化 |
| duplicate 产生重复 truth | Step 6 / Step 10 | 阻断退出,修复幂等并回归 |
| evidence index 缺 P0 `EV-WORK-*` | Step 9 / Step 13 | 阻断退出,补证据生成和索引 |
| `latest` 或错误 artifact/report 路径 | Step 9 | 阻断退出,修正路径后重跑 |
| configured adapter 自动 fake success | Step 8 / Step 10 | 阻断退出,修复 fake marker 和 adapter unavailable 处理 |

### 7.5 进入 / 退出准则与 gate 映射

| Gate / suite | 进入前要求 | 退出要求 |
|---|---|---|
| `unit-contract-domain` | contracts / domain test target 可运行 | 通过 |
| `service-core` | service fixture 和 in-memory UoW 可用 | 通过 |
| `api-contract-fast` | command / query DTO roundtrip fixture 可用 | 通过 |
| `config-fast` | config fixture 和 env override harness 可用 | 通过 |
| `service-all` | P0 service data set 全量可用 | 通过 |
| `integration-p0` | repository / runtime builder / fake adapter 可用 | 通过 |
| `worker-job-contract` | consumer envelope、job input、receipt fixture 可用 | 通过 |
| `consumer-outbox` | outbox publisher fake 和 event fixture 可用 | 通过 |
| `config-redaction` | forbidden output sentinel 和 scanner 可用 | 通过 |
| `operations-replay` | replay bundle 和 baseline digest 可用 | release selected 时通过;否则进入 Step 14 |
| `concurrency-idempotency-stress` | nightly 环境可用 | 非 release 默认不阻断;release 前相关 blocker 必须关闭 |
| `release-main-smoke` | release candidate baseline 可运行 | 通过 |
| `release-config-redline` | redline check fixture 可运行 | 通过 |
| `release-evidence-pack` | report / evidence generator 可运行 | 通过 |

### 7.6 文档与风险边界表

| 项 | 进入时口径 | 退出时口径 |
|---|---|---|
| 新版 `05-测试方案.md` | Step 15 完成后才能作为执行事实源 | 退出报告必须引用正式 `05` baseline |
| 新版 `06-验收标准.md` | 不是测试进入硬前置;当前旧版只作方向参考 | 正式验收裁决由新版 `06` 承接,测试只提供证据 |
| P1/P2 staging-like / production-like | 不阻塞 P0 进入 | 未完成不阻塞 P0 退出,但必须进入 Step 14 风险 |
| 旧性能数字 | 不作为进入条件 | 不作为 P0 release 硬退出条件,只作为观察报告 |
| 残余风险 | 不允许隐藏 S / P0 A | 只能记录非阻断 B / C 或 P1/P2 风险 |

### 7.7 准则流程图

图类型: 测试进入 / 退出门禁图

图标题: L1-work 测试进入与退出门禁

```text
[Design baseline 00-04]
  |
  v
[Formal 05 ready]
  |
  v
[Data + env + automation ready]
  |
  v
[Run P0 suites]
  |
  +-- failed --> [Classify defect S/A/B/C]
  |                 |
  |                 +-- S or P0 A --> [Fix + retest]
  |                 |
  |                 +-- B/C --> [Record residual risk]
  |
  v
[Run release redline + evidence pack]
  |
  +-- failed --> [Fix + retest]
  |
  v
[Exit test with evidence + residual risk handoff]
```

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 进入准则要求新版 `00/01/02/03/04` 和正式 `05` baseline 可引用 | 否 | 测试执行前置规则,无设计契约变化 | 无 | 无回写 |
| 退出准则要求 P0 suite、release redline 和 evidence pack 通过 | 否 | 测试门禁规则,承接 Step 9~11 | 无 | 无回写 |
| S 级和影响 P0 的 A 级缺陷阻断退出 | 否 | 缺陷规则承接,不改变验收裁决 | 无 | 无回写 |
| P1/P2 未覆盖项不阻断 P0 退出,但必须进入 Step 14 残余风险 | 否 | 范围裁剪,承接需求和配置设计 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续实际测试执行需要新增字段、状态、配置项、测试用例编号或 evidence 编号,必须先回写对应设计或测试方案中间产物。
```

## 9. 回填草稿

正式 `05-测试方案.md` §12 建议采用以下结构:

```text
12. 进入准则与退出准则
  12.1 进入准则
  12.2 进入准则判定表
  12.3 退出准则
  12.4 退出阻断项表
  12.5 进入 / 退出准则与 gate 映射
  12.6 文档与风险边界表
  12.7 准则流程图
  12.8 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §12.1 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.1 |
| §12.2 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.2 |
| §12.3 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.3 |
| §12.4 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.4 |
| §12.5 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.5 |
| §12.6 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.6 |
| §12.7 | `design-calibration/05_test_plan_step_12_entry_exit.md` §7.7 |
| §12.8 | `design-calibration/05_test_plan_step_12_entry_exit.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 13 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| 进入准则 | 是否接受正式 `05` Step 15 完成后才作为测试执行事实源 |
| 退出准则 | 是否接受 release redline / evidence pack 与 P0 suite 同为退出硬条件 |
| 风险边界 | 是否确认 P1/P2 未覆盖项不阻断 P0 退出,但必须进入 Step 14 |
| 缺陷阻断 | 是否确认 S 级和影响 P0 的 A 级缺陷必须为 0 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入准则可判定 | 通过 | §7.1 / §7.2 |
| 退出准则可判定 | 通过 | §7.3 / §7.4 |
| gate / suite 映射明确 | 通过 | §7.5 |
| 风险边界明确 | 通过 | §7.6 |
| 对上游设计影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 13 | 通过 | 下一步定义测试报告与证据归档 |
