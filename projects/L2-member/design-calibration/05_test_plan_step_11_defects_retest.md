# Step 11. 定义缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填章节：`projects/L2-member/05-测试方案.md` §11「缺陷管理与复验规则」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_11_defects_retest.md`
> 状态口径：本文定义 planned 缺陷分级和复验要求，不填写真实缺陷、修复状态、证据实例或验收结论。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11：定义缺陷管理与复验规则 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 6 用例；Step 9 blocking suite；Step 10 专项矩阵；`00` VF；`03` error / recovery / consistency |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_11_defects_retest.md` |
| 回填位置 | 正式 `05-测试方案.md` §11（Step 15） |
| 停审方式 | S/A/B 定义、升级规则、复验矩阵和 evidence 要求完成后停审 |

## 2. 本步目标

把测试失败映射为可执行的缺陷等级和复验动作，保证一票否决、P0 blocking suite、数据安全、依赖边界和 evidence integrity 不能被降级成普通风险。缺陷记录只描述事实、影响、来源和复验要求，不伪造修复完成或验收通过。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §14.2 | `VF-L2M-001~009` 一票否决 |
| `05_test_plan_step_06_cases.md` | TC-L2M 用例、断言和候选证据 |
| `05_test_plan_step_09_automation_gates.md` | P0 suite、gate、artifact/report 规则 |
| `05_test_plan_step_10_nonfunctional.md` | 安全、一致性、恢复、观测和性能专项 |
| `03-详细设计.md` §9~§15 | 状态、事务、错误、幂等、配置、观测边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些缺陷属于 S 级阻断？ | 任一 `VF-L2M-001~009` 命中；P0 blocking suite 失败且非测试工具自身误报；raw body / secret / hidden reasoning 泄漏；foreign truth 反写；Query / Job 违反 no-write / no-repair；duplicate replay 分叉、same-key 绕过、CAS 覆盖；非 Core package dependency；静态伪 evidence、缺 raw artifact/report pairing；均为 S。 |
| 哪些缺陷可以风险接受？ | 只允许不影响 P0 truth / safety / evidence 的 P1/P2：real-like adapter 尚未启用、生产容量和硬性能阈值未定、外围摘要增强、长期保留策略等；必须有角色接受人或待确认项，不能掩盖 blocker。 |
| 修复后必须回归哪些用例？ | 至少重跑失败 TC、同切口 family、受影响 suite 和对应 redline check；若改动 state / protocol / UoW / replay / redaction / dependency / report schema，则触发全量 P0 回归。 |
| 缺陷关闭需要哪些证据？ | 原始失败 run 的 artifact / report、修复后 run 的 artifact / report、复验用例 / suite、变更关联、差异说明、redaction / dependency check 和 reviewer note；Step 13 再定义固定 EV 归档。 |
| 何时新增自动化防回归？ | 重复出现、影响 VF/P0、曾由手工漏检、跨层边界回归、或涉及 blocker 解锁时，必须把复验转为相应 suite 的自动化候选；不能只依赖人工记忆。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 只有 S/A/B 粗粒度且无 VF 映射 | 固定 VF、suite、cut、artifact/report 和复验关系 |
| blocked / not-run 可能被记录为缺陷已修复 | 明确 disposition 与缺陷状态分离，blocked 不能等于 pass |
| 复验只跑原失败用例 | 增加 family、redline、跨层和全量触发规则 |
| P1 residual 没有接受路径 | 指定验收 / 架构 / 测试角色或待确认项 |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| S 级定义 | 业务主线失败 | VF + 安全 + 证据 + 依赖 + replay 红线 | 一票否决不可降级 |
| 复验 | 只重跑单 case | case + family + suite + check，必要时全量 | 覆盖跨模块回归 |
| 关闭证据 | 日志方向 | failed/fixed run artifact/report + review | 可审计 |
| residual | 不明确 | P1/P2 角色接受或待确认 | 风险透明 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 所有 A 级是否都阻断 | 影响 P0 / release 的 A 级阻断；不影响者需接受 | 保持风险分层 |
| blocked external lane 是否记 S | 未违反 member-local contract 时记 blocker / residual，不伪造成失败或通过 | 上游合同未闭合是设计状态 |
| 是否允许人工复验关闭 P0 | 仅在脚本自身故障等特殊情况；必须有人 / Agent 审查并保留证据 | P0 红线原则上自动化 |
| 是否用“已修复”替代重新执行 | 不允许 | 修复状态不是测试结果 |

## 8. 缺陷分级表

| 级别 | 定义 | 典型示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 命中 VF 或 P0 安全 / truth / consistency / evidence integrity 红线 | 错主语放行、raw body 泄漏、foreign truth 反写、Query 写入、duplicate 分叉、非 Core package、静态伪 EV | 立即阻断受影响 gate；修复后全量 P0 + redline 复验；不得风险接受 | 是 |
| A | 影响 P0 功能或跨层编排，但未直接命中 VF，或 P1 selected-run contract 失败 | local successor 丢失、CAS 冲突未回滚、Job partial 误吞、required slot posture 错误、real-like seam incompatibility | P0 影响需修复；P1 需 owner / 验收角色明确接受或转 blocker | 通常是 |
| B | 不影响 P0 truth / safety 的外围、文档或可读性问题 | 非关键 diagnostic 字段、P2 view、未硬化性能样本格式 | 记录并排期；修复后按影响切口复验 | 否 |

### 8.1 缺陷状态与 disposition 分离

| 维度 | 允许值 | 说明 |
|---|---|---|
| 缺陷状态 | `open`、`triaged`、`fix-planned`、`fixed-awaiting-retest`、`verified`、`accepted-risk`、`deferred` | 记录流程，不代表 suite 通过 |
| 测试 disposition | `passed`、`failed`、`blocked`、`not_run`、`unknown` | 由真实执行产生；本设计阶段不填写实例 |
| 风险处理 | `must_fix`、`owner_acceptance_required`、`pending_confirmation` | S 不得进入 accepted-risk |

## 9. 复验规则矩阵

| 失败类型 | 最小复验集 | 全量触发条件 | 关闭要求 |
|---|---|---|---|
| contract / DTO / enum / state | 失败 case + contract-domain-fast + 受影响 entry | public protocol / state matrix 变更 | fixed run artifact/report + schema diff + review |
| Command / Query flow | 失败 case + 同 operation family + service-flow-fast | UoW / replay / Query no-write 语义变更 | fixed run + no-write / replay check |
| Consumer / Job | 失败 case + source / receipt / report family + api-worker-entry / job suite | receipt kind、dedup、partial isolation 或 source gate 变更 | fixed run + receipt/report pairing |
| Store / CAS / rollback | 失败 case + infra-fake-parity + replay-recovery | Store version / UoW / commit-unknown 变更 | fixed run + ordering / rollback trace |
| config / builder | 失败 profile + config-redline + dependency-boundary | required slot / redaction / non-configurable invariant 变更 | fixed run + redacted issue + profile diff |
| security / redaction | 失败 corpus + redaction-boundary + release-redline | deny list / serializer / output surface 变更 | no forbidden field + reviewer note；S 不可接受 |
| dependency / evidence | failed check + report-generation-audit + release-redline | package / script / artifact/report schema 变更 | raw artifact/report pair + provenance check |
| P1 external seam | failed selected-run + local blocked posture | owner contract / schema / route 变更 | owner qualification evidence；未闭合则保留 blocked |

## 10. 复验与防回归停审记录

| 项 | 结果 | 说明 |
|---|---|---|
| S 级不可降级 | `defined` | VF、redline、证据和依赖完整性均阻断 |
| A 级复验 | `defined` | 失败 case + family + suite；影响 P0 时阻断 |
| B 级处理 | `defined` | 可延后但需记录 |
| blocked / not_run 与缺陷分离 | `defined` | 不把环境阻塞写成测试 pass / fix |
| 关闭证据 | `defined` | failed/fixed run pair，Step 13 固定 EV |

## 11. 回填草稿（供正式 §11）

缺陷分为 S、A、B 三级。命中 `VF-L2M-001~009`、P0 安全 / truth / consistency / evidence 红线的 S 级缺陷必须阻断；A 级按是否影响 P0 或 selected-run 决定修复或角色接受；B 级可记录后排期。blocked、not-run、unknown 是测试 disposition，不等于缺陷已修复或通过。

修复后至少复验失败用例、同切口 family、受影响 suite 和 redline check；修改 public protocol、state、UoW / replay、redaction、dependency 或 report schema 时触发全量 P0 回归。关闭必须保留原始失败与修复后 artifact/report、复验关联、redaction / dependency check 和审查记录。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 缺陷系统字段 / 工单平台 | 实施流程 | 不在 05 固定产品；由 07 / 运维承接 |
| 具体验收负责人姓名 | P1/P2 risk acceptance | 当前写角色，姓名待 06 确认 |
| 实际 artifact / report schema | 关闭证据 | Step 13 固定 |

- [x] S/A/B 分级、VF 关联、复验范围和关闭证据可判定。
- [x] blocked / not-run / unknown 与缺陷状态分离。
- [x] 防回归自动化触发规则已定义。

**Step 11 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 12。
