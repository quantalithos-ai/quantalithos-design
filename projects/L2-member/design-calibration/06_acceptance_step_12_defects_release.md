# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 12
> 回填章节：06-验收标准.md §12
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义缺陷分级、复验与放行规则 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | 05 §11~§12；Step 8、Step 10、Step 11；00 VF-L2M-001~009 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_12_defects_release.md |

## 2. 本步目标

定义 S / A / B 缺陷、测试 disposition、修复后复验和放行规则，并保证缺陷规则与 VETO、风险接受和三值结论一致。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 05 §11 | 缺陷分级、状态与复验基础 |
| Step 8 | 状态 / 事务 / replay 失败影响 |
| Step 10 | evidence / report integrity 失败影响 |
| Step 11 | VETO 不可覆盖规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B 如何定义？ | S 命中 VF 或 P0 truth / safety / consistency / evidence integrity；A 影响 P0 编排或 selected seam 但未直接命中 VF；B 不影响 P0 的外围、文档或可读性问题。 |
| 每级如何影响结论？ | S 必须不通过且不得风险接受；影响 P0 的 A 必须修复 / 复验；不影响 P0 的 A 或 B 只有在 owner / acceptor / deadline 完整时才可有条件通过。 |
| 修复后如何复验？ | 失败 case + 受影响 family + 必要的 full P0 / redline suite；每次复验使用新固定 run，保留 failed / fixed pair。 |
| 哪些缺陷可风险接受？ | 仅不触发 VETO、S、P0 truth、安全、依赖或 evidence integrity 的 residual；上游 blocker 本身不是“已修复缺陷”。 |
| 哪些阻断下一阶段？ | S、未修复的 P0 A、证据不可裁决、redaction / dependency / report audit 失败、或把 blocked / not_run 写成 pass。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 只有 S/A/B 粗略表 | 增加 disposition 分离、复验矩阵、关闭证据和 VETO 关系 |
| 缺陷与 blocker 混同 | 明确 blocked / not_run 是测试事实，不等于 open defect fixed 或 risk accepted |
| 复验没有路径 | 固定 failed / fixed run 的 artifact、report、EV 和 reviewer note |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| S 级 | 泛化严重问题 | 命中 VF / P0 红线且不可接受 |
| 复验 | “修复后再测” | 失败用例、suite、run pair、artifact/report、redline 和审查 |
| 放行 | 视情况 | 三值结论 + VETO / risk acceptance 矩阵 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| S 是否可有条件通过 | 可以 / 不可以 | 不可以 |
| blocked 是否等于 defect fixed | 是 / 否 | 否；保留 blocked disposition |
| A 级是否批量接受 | 可以 / 逐项接受 | 逐项，必须有证据、责任人、接受人和期限 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 级别 | 定义 | 典型 L2-member 示例 | 对结论的影响 | 复验要求 |
|---|---|---|---|---|
| S | 命中 VF-L2M-001~009 或 P0 truth / security / consistency / evidence integrity | 错主语放行、raw body / secret 泄露、foreign truth 反写、Query 写入、duplicate 分叉、非 Core package、静态伪 EV | 立即不通过；不可风险接受 | 修复后全量 P0 + redline + report audit |
| A | 影响 P0 功能 / 跨层编排，或 selected seam 合同失败但未命中 VF | local successor 丢失、CAS 未回滚、Job partial 误吞、required slot posture 错误 | P0 A 必须修复；非 P0 A 可条件接受 | 失败 case + 同 family；必要时全量 P0 |
| B | 不影响 P0 truth / safety 的外围、文档或可读性问题 | 非关键 diagnostics、P2 view、sample 格式 | 可记录 / 排期；不改变 P0 结论 | 受影响 cut |

### 8.2 缺陷状态与测试 disposition 分离

| 维度 | 允许值 | 说明 |
|---|---|---|
| 缺陷状态 | open、triaged、fix-planned、fixed-awaiting-retest、verified、accepted-risk、deferred | 流程状态，不代表测试通过 |
| 测试 disposition | passed、failed、blocked、not_run、unknown | 只能由真实执行或正式 blocker 记录产生 |
| 风险处理 | must_fix、owner_acceptance_required、pending_confirmation | S 不得进入 accepted-risk |

### 8.3 复验规则矩阵

| 失败类型 | 最小复验集 | 全量 P0 触发 | 关闭证据 |
|---|---|---|---|
| contract / DTO / enum / state | 失败 case + contract-domain-fast + 受影响 entry | public protocol / state matrix 变更 | fixed run artifact/report + schema diff + review |
| Command / Query flow | 失败 case + operation family + service-flow-fast | UoW / replay / Query no-write 变更 | fixed run + no-write / replay evidence |
| Consumer / Job | 失败 case + source / receipt / report family + api-worker-entry / job-continuation | receipt、dedup、partial isolation 或 source gate 变更 | receipt / report pairing |
| Store / CAS / rollback | 失败 case + infra-fake-parity + replay-recovery | version / UoW / commit-unknown 变更 | ordering / rollback trace |
| config / builder | 失败 profile + config-redline + dependency-boundary | required slot / redaction / invariant 可配置性变更 | profile diff + redacted issue |
| security / redaction | 失败 corpus + redaction-boundary + release-redline | deny list / serializer / output surface 变更 | clean scan + reviewer note；S 不可接受 |
| dependency / evidence | failed check + report-generation-audit + release-redline | package / artifact / report schema 变更 | raw pair + provenance check |
| P1 external seam | failed selected-run + local blocked posture | owner contract / schema / route 变更 | owner evidence；未闭合则仍 blocked |

### 8.4 放行规则

| 条件 | 允许结果 |
|---|---|
| 全部 P0 AC 通过、VETO 未命中、S=0、证据完整 | 通过 |
| P0 主线通过、VETO 未命中、S=0，且 residual 已逐项接受 | 有条件通过 |
| 任一 P0 失败、VETO 命中、S 未关闭、证据不可裁决或 hard gate failed | 不通过 |

### 8.5 缺陷关闭证据

关闭至少需要：原始失败 run 的 artifact / report、修复后 run 的 artifact / report、复验 TC / suite、变更关联、差异说明、redaction / dependency check 和 reviewer note。不能用“代码已修复”、静态截图、planned、blocked 或 not_run 代替。

### 8.6 停审与一致性审计

| 审计项 | 结论 |
|---|---|
| S 级不可降级 | 通过 |
| A 级复验可判定 | 通过 |
| B 级排期不污染 P0 | 通过 |
| blocked / not_run 与 defect 分离 | 通过 |
| 关闭证据可回指 run pair | 通过（规划） |
| 放行规则与 VETO / risk acceptance 一致 | 通过 |

## 9. 回填草稿

正式 §12 应写入 S/A/B、disposition、复验矩阵、关闭证据和三值放行规则；明确 S / VETO 不可风险接受。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 defect tracker | 关闭证据 | 后续实施 / QA 确定 |
| A 级接受人 | 有条件通过 | 必须逐项填写 |
| full P0 suite 版本 | 复验范围 | 送验时固定 |

## 11. 进入下一步条件

- [x] 缺陷级别、状态和测试 disposition 分离。
- [x] 修复后复验和关闭证据可判定。
- [x] 放行规则与 VETO、风险接受和三值结论一致。
