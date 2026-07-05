# Step 12. 定义进入准则与退出准则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义进入准则与退出准则 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 测试数据;Step 8 环境配置;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_12_entry_exit.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

定义 Artifact 本轮测试什么时候允许启动、什么时候允许退出、什么时候必须暂停或阻断退出。

本 Step 只回答:

- 开始执行 Artifact P0 测试前,哪些设计基线、数据集、环境 profile、依赖替身和门禁脚本必须可用。
- 退出当前测试轮次前,哪些 P0 用例、`VF-ART-001~004`、suite、checks、缺陷状态和 run report 必须满足。
- 哪些情形必须暂停测试并回流设计或实现,不能通过“先记风险再继续”绕过。
- 哪些 P1/P2、future selected-run、性能 sample / trend 和 residual risk 不阻断当前 P0 退出,但必须记录接受人和影响范围。
- 为什么当前不要求正式 EV 编号和 `06-验收标准.md` 裁决也能完成测试退出判断。

本 Step 不生成正式 evidence ID,不生成 `reports/acceptance` 结构,不裁决最终验收 pass。Step 13 负责测试报告与证据归档,新版 `06-验收标准.md` 负责验收裁决。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供 `DS-ART-*` 数据集、run namespace、隔离与清理规则 |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供 `local-dev` / `ci-test` / `integration-like` / `operations-replay` profile 语义和依赖边界 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 blocking suites、release checks、artifact/report roots 和失败语义 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 truth ownership、cross-repo consumption、redaction、安全、恢复、observability、dependency 边界专项 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供 `S/A/B/R` 缺陷分级、复验和风险接受规则 |
| `projects/L1-artifact/00-需求文档.md` §14 | 正式输入 | 提供五类验收方向与 `VF-ART-001~004` 一票否决来源 |
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供第 14 章、`VF-ART`、`TC-ART-*` 和候选证据族的追溯 |
| `projects/L1-governance/design-calibration/05_test_plan_step_12_entry_exit.md` | 已读取 | 只作为 Step 12 粒度框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档和设计基线必须冻结? | 新版正式 `00/01/02/03/04` 必须是当前真相源;`05` 的 Step 1~12 中间产物必须完成到当前恢复点。若 `03/04` 在当前轮测试前发生影响 DTO、state、flow、config、redaction、dependency、query no-write 或 job no-truth-repair 的变更,必须重审受影响 Step 后再进入测试。 |
| 开始测试前哪些环境和数据必须可用? | `ci-test`、`integration-like`、`operations-replay` 必须可运行并可生成正式 P0 机器证据;`local-dev` 必须可用于本地 sanity,但不是退出证据前置。`DS-ART-*` 中覆盖 truth/support/view/report/relay/handoff/idempotency/config/redaction/dependency 等 P0 数据集必须可构造、隔离和清理。 |
| 哪些自动化和 checks 必须在退出前通过? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit` 必须通过。`check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 必须通过。 |
| 退出时哪些 P0 红线必须为零缺陷状态? | `VF-ART-001~004` 必须全部关闭;query no-write、public job no-truth-repair、truth ownership、cross-repo consumption boundary、redaction、dependency boundary、report integrity、duplicate replay no-recompute、commit unknown no-second-write 必须无未关闭 S 级缺陷。 |
| 哪些情形可以不阻断当前 P0 退出? | `p1-real-like-selected-run` unavailable、future `staging-like` / `production-like` 未执行、旧 P95/P99/SLA 候选数字未达、非阻断可读性/维护性问题,都可以不阻断 P0 退出,但必须记录 residual risk、接受人和后续触发条件。 |
| 为什么当前退出不要求正式 EV? | 当前 Step 只判断“是否具备真实 run 证据链并满足 P0 阻断条件”。正式 EV 编号、evidence index 和 acceptance handoff 由 Step 13 和后续 `06-验收标准.md` 收口。当前只要求 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `EV-CAND-ART-*` 候选证据面完整可追溯。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 | 已定义数据集,但还没有“哪些数据集就绪后才允许开跑”的总体门禁 | 本 Step 形成 entry checklist |
| Step 8 | 已定义四个环境 profile,但还没有“哪些 profile 只用于 sanity,哪些用于正式退出证据”的区分 | 本 Step 固定 local-dev 与 P0 机器证据链的职责 |
| Step 9 | 已定义 suites / checks,但还缺“退出必须全部通过哪些,哪些只是 nightly/selected-run 扩展”的总表 | 本 Step 汇总 release-facing blocker |
| Step 10 | 已定义专项与 sample/trend 规则,但还缺“性能样本必须存在但不构成硬失败”的退出口径 | 本 Step 固定性能只要求 sample presence |
| Step 11 | 已定义缺陷分级,但还缺“当前测试轮次是否允许带着 A/B/R 离场”的明确准则 | 本 Step 固定 blocker / accepted residual 的退出条件 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入测试门禁 | 分散在 Step 7~11 | 汇总成 entry checklist | 测试开始条件可判定 |
| 退出测试门禁 | 分散在 suite、专项、缺陷表 | 汇总成 exit checklist | 测试结束条件可判定 |
| local-dev 定位 | 容易被误当作正式证据环境 | 明确只用于本地 sanity,不作为退出主证据 | 防止伪 pass |
| 性能口径 | 容易被误写成硬阻断 | 明确只要求 sample/trend 存在 | 避免无来源阈值污染 |
| 正式 EV | 容易被提前要求 | 明确当前只要求 run evidence + candidate evidence | 与 Step 13 分工一致 |

## 7. 进入 / 退出设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 进入测试是否必须等正式 `05-测试方案.md` 组装完成 | A. 必须等 Step 15;B. 允许以当前 Step 中间产物作为测试基线 | 采用 B。Step 15 是文档装配,不是测试门禁前置。 |
| 退出测试是否必须已有正式 EV 编号 | A. 必须;B. 当前只要求真实 run evidence 和 `EV-CAND-ART-*` 可追溯 | 采用 B。正式 EV 留 Step 13。 |
| `local-dev` 是否算 P0 退出环境 | A. 算;B. 只算开发 sanity | 采用 B。P0 退出证据来自 `ci-test`、`integration-like`、`operations-replay` 和 release gate。 |
| A 级缺陷是否一律阻断退出 | A. 一律阻断;B. 只有影响当前 P0 truth/release 主链的 A 级阻断,其余需显式接受人 | 采用 B。与 Step 11 风险接受规则一致。 |
| performance sample 缺失是否阻断 | A. 不阻断;B. 阻断 sample 缺失,但不阻断旧数字未达 | 采用 B。样本本身是证据面的一部分。 |

## 8. 结构化中间产物

### 8.1 进入准则清单

- [ ] 当前测试真相源固定为正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`。
- [ ] `05_test_plan_step_01_input_boundary.md` 到 `05_test_plan_step_12_entry_exit.md` 已完成到当前恢复点,且与项目台账一致。
- [ ] 若 `03/04` 在当前测试轮启动前发生影响 `TC-ART-*`、`VF-ART-*`、P0 profile、blocking checks 的变更,受影响 Step 已重新审查。
- [ ] `DS-ART-RUN-001` run namespace 可用,且能提供 deterministic `test_run_ref`、clock 和 id 段。
- [ ] `DS-ART-*` 中支撑 truth/support/view/report/relay/handoff/idempotency/config/redaction/dependency 的 P0 数据集均可构造、隔离、清理。
- [ ] `ci-test` profile 可运行 `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`。
- [ ] `integration-like` profile 可运行 controlled unavailable/degraded/failure mapping,且不依赖真实 sibling repo 或真实外部产品。
- [ ] `operations-replay` profile 可装配 replay-backed state/report/outbox fixtures,且 replay root 已去标识化。
- [ ] `local-dev` profile 可用于开发者本地 sanity,但不被当作正式退出证据主链。
- [ ] 只有 `L0-core/core-contracts` 允许 compile-time upstream;其他 sibling 只通过 runtime/event/handoff/replay seam 协作。
- [ ] `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 目录契约可用,且不使用 `latest`。
- [ ] Step 11 的 `S/A/B/R` 分级、复验规则、风险接受边界和自动化防回归规则已确认。

### 8.2 退出准则清单

- [ ] 所有 P0 `TC-ART-*` 用例家族已通过,或明确属于 P1/P2/future 范围且不影响 P0 truth。
- [ ] 第 14 章五类验收方向对应的 P0 测试承接面已全部有真实 run 证据。
- [ ] `VF-ART-001~004` 对应的主线、负向、blocking suite 和 checks 全部通过。
- [ ] `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit` 全部通过。
- [ ] `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 全部通过。
- [ ] `release-main-smoke` 输出的是业务场景级闭环断言,而不是通用测试计数或单个总结果。
- [ ] 所有 blocking suites 均生成 raw artifacts、suite reports、gate summary,并可回指同一 `run_id`。
- [ ] 当前没有未关闭的 S 级缺陷。
- [ ] 当前没有未接受且影响 P0 truth / release 主链的 A 级缺陷。
- [ ] B 级缺陷、R 级 residual risk、P1/P2 unavailable 均已记录接受人、影响面和后续触发条件。
- [ ] 性能结构性 sample / trend 已生成并可追溯;旧 P95/P99/SLA 候选数字未达不构成当前 P0 退出失败。
- [ ] 未发现静态手写 evidence、缺 raw artifact 的 report、或通过 `latest` 引用伪造测试结论。

### 8.3 暂停 / 阻断准则

| 触发条件 | 处理 |
|---|---|
| 发现 `03/04` 闭口缺失,导致 `TC-ART-*` 无法稳定构造或断言 | 暂停测试,回流设计并重审受影响 Step |
| P0 profile 装配失败 | 阻断进入和退出;不得 silent fallback |
| fake / controlled / replay-backed adapter 缺失 required parity | 阻断相关测试执行,先补测试替身或回流实现 |
| query no-write 或 job no-truth-repair 断言失败 | 直接按 S 级处理,阻断退出 |
| redaction / dependency / report integrity check failed | 直接阻断退出 |
| raw artifact / report pairing 缺失 | 阻断退出,不得仅保留人工结论 |
| `p1-real-like-selected-run` unavailable | 不阻断 P0,记录 unavailable / residual |
| 旧性能候选数字未达但 sample/trend 存在 | 不阻断 P0,记录残余风险 |

### 8.4 进入准则来源追溯表

| 进入准则组 | 来源 | Artifact 口径 |
|---|---|---|
| 设计输入基线 | 正式 `00/01/02/03/04`;Step 1~6 | 真相源、测试范围、用例矩阵已稳定 |
| 测试数据就绪 | Step 7 | `DS-ART-*` 可构造、隔离、清理 |
| 环境与配置就绪 | Step 8 | 四个 profile 职责、compile/runtime/event/handoff/replay 边界清楚 |
| 自动化门禁就绪 | Step 9 | suites、checks、run roots、报告 roots 可用 |
| 专项边界就绪 | Step 10 | truth ownership、cross-repo consumption、redaction、dependency、replay 边界已固化 |
| 缺陷与复验规则就绪 | Step 11 | `S/A/B/R` 与 blocker / residual 规则明确 |

### 8.5 退出准则来源追溯表

| 退出准则组 | 来源 | Artifact 口径 |
|---|---|---|
| P0 用例通过 | Step 6 / Step 9 | `TC-ART-*` 全部进入 suites/checks |
| 五类验收方向与 `VF-ART` 通过 | `00` §14;Step 5;Step 10 | 第 14 章五类验收方向和一票否决全部可回指 |
| blocking suites/checks 通过 | Step 9 | release-facing blocking chain 完整 |
| blocker 缺陷清零 | Step 11 | S=0,影响 P0 的 A 级已修复或明确接受 |
| run evidence 可追溯 | Step 9 | `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 完整 |
| formal EV 延后 | Step 13 | 当前只要求 `EV-CAND-ART-*` + run evidence |

### 8.6 环境与证据职责矩阵

| 环境 / 证据面 | 是否进入当前退出判断 | 职责 | 备注 |
|---|---|---|---|
| `local-dev` | 否 | 开发 sanity、本地 smoke | 不作为正式退出主证据 |
| `ci-test` | 是 | contract/domain/service/config/dependency 主证据 | 必须 deterministic |
| `integration-like` | 是 | controlled seam / unavailable / degraded / failure mapping 主证据 | 不为真实产品背书 |
| `operations-replay` | 是 | replay/recovery/report/no-truth-repair 主证据 | replay root 必须去标识化 |
| `release-main-smoke` | 是 | 五能力最小闭环退出主证据 | 不是通用冒烟计数 |
| `p1-real-like-selected-run` | 否 | selected-run / residual 输入 | unavailable 不阻断 P0 |
| `EV-CAND-ART-*` | 是 | 当前证据候选追溯面 | 正式 EV 仍留 Step 13 |
| 正式 EV 编号 | 否 | 后续归档 / 验收使用 | 当前 Step 不要求 |

### 8.7 进入 / 退出停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 进入准则是否全部可判定 | 通过 | 全部是 checklist 或明确 blocker |
| 退出准则是否全部可判定 | 通过 | 全部可由 suite/check/defect/report 判断 |
| 是否区分 local-dev 与正式退出主证据 | 通过 | 见 §8.6 |
| 是否避免提前要求正式 EV | 通过 | 当前只要求 run evidence + candidate evidence |
| 是否防止 P1/P2 selected-run 误阻断 P0 | 通过 | 见 §8.3 / §8.6 |
| 是否承接 query no-write / job no-truth-repair 的 veto 语义 | 通过 | 见 §8.2 / §8.3 |

### 8.8 跨准则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档、数据、环境、自动化、专项、缺陷规则是否全部进入 entry | 通过 | 见 §8.1 / §8.4 |
| P0 用例、五类验收方向、`VF-ART`、suite/check、缺陷、run evidence 是否全部进入 exit | 通过 | 见 §8.2 / §8.5 |
| 是否存在“环境不可用但仍可算 pass”的路径 | 否 | P0 profile fail-fast |
| 是否存在“只有人工结论没有 raw artifact”也能退出的路径 | 否 | raw artifact/report pairing 是硬门禁 |
| 是否把无来源性能数字写成 exit 前置 | 否 | 只要求 sample/trend presence |
| 是否把 `PublishPendingArtifactRelays` 混入 public jobs 退出统计 | 否 | 保持 relay facade 独立口径 |

## 9. 对上游设计的影响判定

| 准则结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 测试可以基于当前 Step 中间产物启动,不要求先组装正式 `05` | 否 | SOP 执行细化 | 与 Step 15 分工一致 |
| 当前退出不要求正式 EV 编号 | 否 | 证据编排分工 | 由 Step 13 继续收口 |
| `local-dev` 不进入退出主证据链 | 否 | 环境职责细化 | 与 Step 8 一致 |
| 若 future 要求 real-like selected-run 成为 release 硬门禁 | 是 | 测试范围和退出规则变更 | 需回写 Step 2 / 8 / 9 / 12 / 14 |
| 若 future 要求性能数值阈值成为退出门禁 | 是 | 验收基线变更 | 需回写 `00/05/06` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_12_entry_exit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“进入准则清单”“退出准则清单”“暂停 / 阻断准则”“进入准则来源追溯表”“退出准则来源追溯表”和“环境与证据职责矩阵”小节。

正式 `05-测试方案.md` §12 应回填:

- 进入测试前必须确认正式 `00/01/02/03/04` 基线、`DS-ART-*` 数据集、`ci-test` / `integration-like` / `operations-replay` 环境、blocking suites/checks 和 Step 11 缺陷规则均可用。
- `local-dev` 只用于本地 sanity,不作为当前退出主证据链。
- 退出测试前必须确认 P0 `TC-ART-*` 用例、五类验收方向、`VF-ART-001~004`、blocking suites/checks、run evidence 和 blocker 缺陷状态全部满足。
- query no-write、public job no-truth-repair、truth ownership、cross-repo consumption、redaction、dependency boundary、report integrity 和 duplicate replay no-recompute 失败都会阻断退出。
- `p1-real-like-selected-run` unavailable、旧性能候选数字未达、future production-like / capacity 风险不阻断当前 P0,但必须记录 residual risk 和接受人。
- 正式 EV 编号和 acceptance handoff 由 Step 13 和后续 `06-验收标准.md` 继续收口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future 是否要求 `p1-real-like-selected-run` 升级为 release 前置 | 影响 Step 14 和新版 `06` | 当前不升级 |
| future 是否把 numeric performance threshold 升格为退出门禁 | 影响 Step 14 和新版 `06` | 当前不升格 |
| A 级缺陷的最终批准角色是否需要在新版 `06` 进一步固定 | 影响验收裁决 | 当前只要求明确接受人 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| entry / exit 准则均可判定 | 通过 | 见 §8.1 / §8.2 |
| blocker / residual 边界明确 | 通过 | 见 §8.3 |
| 环境与证据职责没有混淆 | 通过 | 见 §8.6 |
| 未提前固定正式 EV 或 acceptance 裁决 | 通过 | Step 13 / `06` 承接 |
| 可进入 Step 13 | 通过 | 下一步定义测试报告与证据归档;进入前等待用户审查 |
