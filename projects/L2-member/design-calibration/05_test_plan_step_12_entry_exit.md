# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节：`projects/L2-member/05-测试方案.md` §12「进入准则与退出准则」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_12_entry_exit.md`
> 状态口径：以下是未来测试执行的可判定门禁，不是当前执行结果或验收 verdict。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12：定义进入准则与退出准则 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 7 数据；Step 8 环境 / 配置；Step 9 suite / gate；Step 10 专项；Step 11 缺陷 / 复验 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_12_entry_exit.md` |
| 回填位置 | 正式 `05-测试方案.md` §12（Step 15） |
| 停审方式 | 进入 / 退出 checklist、阻断条件和 residual 处理完成后停审 |

## 2. 本步目标

将测试开始和结束条件写成可判定的 checklist，避免“基本完成”“环境差不多”“外部可用”等模糊谓词。进入条件只要求设计、数据、P0 local 环境和 gate 可执行；退出条件要求 P0 用例、VF 红线、artifact/report pairing 和缺陷处理满足规则，P1/P2 residual 必须显式记录。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_07_test_data.md` | DS-L2M 数据、隔离和清理 |
| `05_test_plan_step_08_environment_config.md` | profile、依赖、不可用策略 |
| `05_test_plan_step_09_automation_gates.md` | blocking suite、脚本、artifact / report |
| `05_test_plan_step_10_nonfunctional.md` | P0 专项红线和性能 sample |
| `05_test_plan_step_11_defects_retest.md` | S/A/B、复验和风险接受 |
| `测试方案书写规范.md` §5.12 | checklist 格式要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档必须冻结？ | 当前正式 `00/01/02/03/04`、经审查的 Step 1~11 相关输入、测试对象 / 用例 / 数据 / 环境 / gate 版本必须固定。若 `03/04` 改动 P0 DTO、state、flow、Port、config、redaction 或 gate，必须回开受影响 Step。 |
| 哪些环境和数据必须可用？ | `ci-test`、`local-dev`（若运行手工/探索）、`operations-replay`（若运行 replay）必须按 Step 8 可定位；对应 `DS-L2M-*` 数据可构造、隔离、清理；fake / controlled / disabled slot posture 有明确状态。外部 positive 环境不可用不得伪装可用。 |
| 哪些自动化必须可运行？ | 对应测试阶段的 P0 blocking suite、redaction / dependency / artifact-report pairing check 必须可启动并产出失败也可读的 report；缺脚本或输出目录错误即不满足进入。 |
| 退出时哪些用例必须通过？ | 所有 P0 `TC-L2M-*` 及 `VF-L2M-001~009` 负向断言对应的 blocking suite 必须有真实结果；blocked / not_run 只可用于受 blocker 的外部 positive lane，并写入 residual，不得当作通过。 |
| 哪些缺陷和风险会阻断退出？ | 任一 S 级缺陷、P0 redaction / dependency / replay / no-write / no-repair 失败、缺 raw artifact / report pairing、静态伪证据、P0 环境 / 数据不可用、未接受且影响 P0 的 A 级缺陷都会阻断退出。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧准则要求“环境准备好” | 改为 profile、依赖 slot、数据集和脚本逐项可判定 |
| 外部 blocked lane 易被误当失败或通过 | 单独列 blocked / not_run / residual，不改变 P0 local oracle |
| 性能 candidate 易成为硬退出阈值 | 只要求阶段 sample；硬阈值须有后续 authority |
| evidence 可能静态生成 | 退出要求 raw artifact/report pairing 和 provenance check，正式 EV 由 Step 13 定义 |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| 进入 | 模糊环境准备 | 文档、数据、profile、suite、checks 逐项勾选 | 可执行 |
| 退出 | 主线成功 + 无严重缺陷 | P0 用例、VF、artifact/report、S/A/B、残余风险联合门禁 | 可审计 |
| blocked | 混同 failed / passed | 独立 disposition + blocker ID | 保持事实等级 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否要求正式 `05` 已装配后才能执行 | 不要求；Step 1~14 已冻结即可 | 正式 05 在 Step 15 装配 |
| P1 selected-run unavailable 是否阻断 P0 | 不阻断 P0，但不得产生 selected-run verdict | P1 非当前核心前置 |
| 性能数字未达是否阻断 | 无正式阈值时不以数字阻断；sample 缺失仍阻断对应证据完整性 | 不能自行硬化目标 |
| A 级是否全部阻断 | 影响 P0 / release 的阻断；其余必须角色接受或进入 residual | 风险分层 |

## 8. 进入准则

- [ ] 当前正式 `00/01/02/03/04` 版本和来源入口已固定，且没有未评估的 P0 设计变更。
- [ ] Step 1~11 中间产物已完成并通过各自停审；`TC-L2M-*`、`DS-L2M-*`、suite / gate 版本可追溯。
- [ ] 选定执行 profile（`ci-test`、`local-dev` 或 `operations-replay`）与测试目的匹配；profile 校验无未处理 error。
- [ ] `DS-L2M-*` 所需的双锚、typed ref、状态、版本、replay carrier、invalid / fault corpus 可重复构造，隔离键已分配。
- [ ] 相关 P0 blocking suite 和 `scripts/checks/*` 可启动；预期输出 root 为 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。
- [ ] strict redaction、low-cardinality、dependency classification、no-write / no-repair spy 已启用。
- [ ] 运行前已确认 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 的当前 disposition；受影响 external positive lane 不被误列为可执行。

## 9. 退出准则

- [ ] 每个 P0 测试切口至少有一个真实执行结果或明确的 blocked / not_run 原因；不得只有静态映射。
- [ ] 所有 P0 blocking suite 已完成，或失败已按 Step 11 形成 S/A 缺陷；没有未处理的 P0 失败。
- [ ] `VF-L2M-001~009` 对应的负向测试和 dependency / redaction / evidence integrity checks 没有未解释失败。
- [ ] Command / Consumer / Job duplicate、conflict、in-flight、commit-unknown、CAS、rollback、partial isolation 和 Query no-write 结果可回指 raw artifact / report。
- [ ] 未出现 raw body、secret、hidden reasoning、foreign body、full stack trace、高基数 label 或外部 success 伪装。
- [ ] 每个 suite 都有 `report.json`、stdout / stderr 和 failure reason（即使失败）；artifact / report root 配对且不使用 `latest`。
- [ ] S 级缺陷为零；影响 P0 的 A 级缺陷已修复并复验，或测试不能退出。
- [ ] P1/P2 与 `L2M-UP-*` / `L2M-DDD-*` residual 均有 owner 角色、接受人或待确认项，并交给 Step 13 / 14 / 06。
- [ ] 没有将 fake、blocked、not_run、planned 或 report 初稿写成 integration pass、evidence、verdict、signoff 或 readiness。

## 10. 进入 / 退出审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| checklist 是否可判定 | `defined` | 每项是可检查的文档、数据、环境、结果或缺陷条件 |
| P0 外部 blocker | `explicit` | blocked / not_run 不伪造通过 |
| evidence 真实性 | `required` | raw artifact/report pairing 是退出前置 |
| 性能阈值 | `not_hardened` | 只要求 sample / trend |
| residual 接受 | `required` | 无接受人则不能关闭 residual |

## 11. 回填草稿（供正式 §12）

进入测试前，正式 `00~04`、Step 1~11 输入、P0 数据集、选定 profile、blocking suite、strict redaction / dependency checks 和输出 root 必须可判定且可追溯。外部合同未闭合的正向 lane 只能记录 blocked / not_run。

退出测试时，P0 用例和 `VF-L2M-001~009` 负向断言必须有真实结果；P0 blocking suite、artifact/report pairing、redaction、dependency、replay、no-write、no-source-repair 和 S/A 缺陷门禁必须满足。P1/P2 与上游 / 设计 blocker 作为 residual 交给后续验收和实施，不得伪造通过。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 实际测试 runner / artifact store | 执行实现 | Step 9 / 13 / 07 承接 |
| 角色级风险接受人 | P1/P2 residual | Step 14 / 06 确认 |
| 性能硬阈值 | NFR-001~003 | 后续 workload authority；当前不阻断 sample |

- [x] 进入 / 退出条件无“基本完成”等模糊谓词。
- [x] 外部 blocker、P1/P2 residual 和证据完整性均有明确处理。
- [x] 未填写真实执行结果或 verdict。

**Step 12 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 13。
