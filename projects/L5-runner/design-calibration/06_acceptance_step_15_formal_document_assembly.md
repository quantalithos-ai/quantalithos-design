# Step 15. 正式验收标准装配

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15  
> 回填范围：正式 `06-验收标准.md` 全文（§1～§15）  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与装配边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 15 |
| current_module | `formal_assembly:full_restart_chapter_traceability_cross_gate_audit` |
| gate_status | `completed / pass / formal_stop_review_required` |
| formal_06_write_allowed | `true_for_step_15_only` |
| formal_06_source | Step 1～14 calibration artifacts；旧正式 06 仅作 historical pollution input |
| actual_acceptance_lifecycle | `not_entered / blocked_by_missing_baseline` |
| actual_verdict / signoff / readiness | `none / 0 / not_asserted` |
| next_allowed_action | 完成正式 06 审查后，按用户既有授权建立并完成 07 |

本 Step 只允许删除旧正式文件并按固定 15 章主链 full-restart 装配。装配完成代表验收合同文档完成，不代表任何实际交付、测试、证据、风险接受、verdict、signoff 或 readiness 已发生。

## 2. 输入与正式章节映射

正式正文只能承载对应中间产物已经收口的结论。每章正文开头必须引用具体 calibration 文件，并给出结构化中间产物/回填草稿/待确认事项的延伸阅读入口。

| 正式章节 | 唯一/主要校准来源 | 可承载结论 |
|---|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` | 输入边界、文档职责、历史材料限制、实际验收事实边界 |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` | 目标、P0/P1/P2、非范围、conditional positive 与 target-tier |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` | design/test/delivery/environment/dependency/config/data/slot/review 基线和固定路径 |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | lifecycle、entry/暂停/送验无效、exit checklist |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | 11 `AC-RUN-*`、TC/slot/EV/report、通过/失败与 tier 影响 |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` | `AR-RUN-001~015`、owner/禁止数据/依赖和零副作用 |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` | 11 Command、12 Query、4 Consumer、0 outbound Event、5 Job |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | 21 状态主语、四组不等式、`TX-RUN-*`、RecoveryCase |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | 9 项 NFR、阈值纪律、measurement/residual 和 tier 分母 |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | 四层证据边界、18 EV、report/check/handoff/review |
| §11 一票否决项 | `06_acceptance_step_11_veto.md` | 12 `VETO-RUN-*`、覆盖审计、不可风险接受 |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` | S/A/B/R、生命周期、复验、全量触发、放行 |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | eligibility、字段、角色、候选 blocker、失效/重开 |
| §14 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` | lifecycle/verdict 分离、三值矩阵、tier 上限、签署/归档 |
| §15 参考与事实边界 | 本 Step + 全部正式上游/标准 | 可追溯参考、当前停审状态、未生成事实清单 |

## 3. Full-restart 装配规则

1. 旧 `06-验收标准.md` 在装配前删除；不得在旧文件上局部替换或保留旧验收主语。
2. 新正文严格使用验收标准书写规范的 15 章主链，章节不得改名或合并。
3. 正式正文只写收口结论；SOP 问题原文、历史冲突诊断、方案取舍和逐项停审记录留在 calibration。
4. 每个正式章节开头列出具体 `design-calibration/06_acceptance_step_*.md`，不得只写目录或“详见前文”。
5. 任何 `run_id`、digest、artifact、report、EV、defect、risk acceptance、verdict、signoff 或 readiness 只可作为未来字段/路径合同，不得填虚构实例。
6. `ESLOT-RUN-*`、`EV-RUN-*`、TC range 和 gate ID 是计划分母/别名模式；不等于 executed/pass。
7. 所有路径使用 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`、`reports/review/`；禁止 `latest`、项目子目录和跨 run 拼接。

## 4. 跨门禁裁决总审计

| 审计面 | 结论 | 处理/正式正文要求 |
|---|---|---|
| 需求→AC | pass | §2/§5 只使用 `AC-RUN-001~011`；`FR-RUN-014~016` 不进入当前 P0 分母 |
| 设计契约→验收 | pass | §5～§8 使用 03 正式对象、协议、状态、UoW 和红线名称 |
| 测试→证据 | pass | §5/§10 回指 18 CUT、108 planned TC、12 suite、18 slot 和 fixed-run pair |
| NFR→阈值 | pass | 无 authority 的性能/SLO/容量仅 measurement/residual；不继承旧数字 |
| 状态/事务一致性 | pass | §8 保留 21 主语、四组不等式、expected version/generation/idempotency/Unknown 规则 |
| VETO→风险接受 | pass | §11 12 项 VETO 与 §13 明确互斥；任何命中总体不通过 |
| 缺陷→复验→放行 | pass | §12 的 S/A/B/R、new run、影响面和全量 P0 触发闭合 |
| 风险→签署 | pass | §13 先逐项授权；§14 签署只确认 package，不隐式接受风险 |
| local record→formal audit | pass | Runner local telemetry、测试 evidence、L4 formal audit 三层不越权 |
| blocked/not-entered→verdict | pass | 当前保持 `not_entered / blocked_by_missing_baseline`，不生成实际“不通过” |
| 文档→实施计划 | pass | §14/§15 不提前创建 07 implementation task；07 在 06 正式停审后启动 |

## 5. 编号、路径与污染审计

### 5.1 固定分母与编号

| 类别 | 正式分母/编号 | 审计结论 |
|---|---|---|
| Acceptance | `AC-RUN-001~011` | 11/11，稳定且无旧 UI 门禁混入 |
| CUT / TC | 18 CUT / 108 planned TC | 由 05 提供；06 不新增实例 |
| Protocol | 11 Command / 12 Query / 4 Consumer / 0 Event / 5 Job | 与 03/05 一致 |
| Architecture redline | `AR-RUN-001~015` | 15/15 被 §6 和 VETO 反查 |
| Transaction | `TX-RUN-*`（10 项） | 由 §8 统一承接，不扩充分母 |
| NFR | `NFA-RUN-001~009` | 9/9，性能项仅 measurement/residual |
| Evidence | `ESLOT-RUN-001~018` / canonical EV 18 项 | 18/18；alias 不表示 instance |
| VETO | `VETO-RUN-001~012` | 12/12，不可风险接受 |

### 5.2 固定路径

| 路径 | 用途 | 禁止 |
|---|---|---|
| `artifacts/test/<run_id>/` | machine raw、suite、check、evidence index | `latest`、跨 run、手写补洞 |
| `reports/runs/<run_id>/` | summary、gate、EV detail、integrity reports | 无 raw source 的静态 report |
| `reports/acceptance/` | handoff、veto、risk、open issues | 自动 verdict/signoff |
| `reports/review/` | 独立审查记录 | 修改 raw/index/status/digest |

### 5.3 历史污染处置

以下旧内容不进入新正文：旧 RunnerRun/UI 验收主语、`<200ms`、`<1s`、`100%` 等无 authority 数字、API/DB 泛证据、profile/ACK/PID/端口推导 readiness、Docker/Tauri/gVisor/Firecracker 技术假定、空签字模板和模糊“基本通过”。

## 6. 事实诚实与 blocker 审计

| 事实类别 | 当前值 | 正式正文处理 |
|---|---|---|
| implementation repo/source | 不存在/未核验（`RUN-DDD-001~003`） | 只写 future contract 与 blocked，不写实现路径/语言/commit |
| upstream public seams | `RUN-UP-001~008` 未闭合 | 只写 conditional/blocked positive 和安全负向要求 |
| baseline/fixed run | 未创建 | 使用占位路径模板，不填实例 |
| artifact/report/evidence | 未生成 | `actual` 保持 `not_evaluated`；planned 不计 pass |
| defect/retest | 未发生 | 不写 zero defects、关闭、修复或复验结果 |
| risk acceptance | 0，候选 blocker 未接受 | 不填 acceptor、日期、期限或签署 |
| verdict/signoff/readiness | none / 0 / not_asserted | §14 只定义规则，不给实际结论 |

## 7. 正式正文自审清单

- [x] 15 章主链与章节名称符合验收标准书写规范。
- [x] 每章有具体 calibration 来源与延伸阅读入口。
- [x] 每条 P0 门禁都有设计契约、TC/EV/report、通过条件、失败条件和裁决影响。
- [x] 所有 18 EV、12 VETO、15 AR、10 TX 和 9 NFR 可反查且无孤儿编号。
- [x] `latest`、跨 run、静态 evidence、无 raw/report pair、scanner unavailable 和未审查 handoff 均被阻断。
- [x] blocked/not_run/not_entered 与实际“不通过”分离；无伪造事实。
- [x] 旧技术选择、旧阈值、旧 UI 主语和空签字模板不再成为正式结论。
- [x] 正式正文不包含实现代码、测试执行、baseline、run_id、artifact、report、verdict、signoff 或 readiness 实例。
- [x] `git diff --check -- projects/L5-runner` 通过。

## 8. 回填与停审结论

正式 `06-验收标准.md` 将按 §1～§15 装配；本 Step 的审计表不复制进正文，只保留收口后的门禁与参考。装配成功后：

1. `RUN-DOC-002` 仅关闭“新版正式 06 缺失”的部分；其他 blocker 继续开放。
2. 项目实际验收仍为 `not_entered / blocked_by_missing_baseline`，没有 verdict/signoff/readiness。
3. 正式 06 进入 `formal_stop_review_required`；按用户已明确的“完成全部 07”授权，下一文档为 07。
4. 进入 07 前必须读取 `实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`代码实施台账与门禁规范.md`，并新建 07 calibration flow；不提前创建实现代码或真实仓。

## 9. 持续 blocker 与下一步

| blocker | 影响 | 处理 |
|---|---|---|
| `RUN-UP-001~008` | T2～T4 正向集成与 owner authority 未闭合 | 保持 blocked/conditional，待上游正式合同 |
| `RUN-DDD-001~003` | 无实现仓、技术和 durable store | 07 只建 planned boundary skeleton，不实现 |
| `RUN-OPS-001~002` | SLO/GRC/真实环境未定 | 不造阈值、环境、release 结论 |
| `RUN-DOC-003` | 07/implementation ledger/skeleton 尚未建立 | 06 装配后按授权启动 07 |

- [x] Step 1～14 的回填来源和正式章节完整映射。
- [x] 跨门禁、编号、路径、污染与事实诚实审计通过。
- [x] 允许删除旧正式 06 并 full-restart 装配。
- [x] 装配后正式 06 停审，再进入 07。
