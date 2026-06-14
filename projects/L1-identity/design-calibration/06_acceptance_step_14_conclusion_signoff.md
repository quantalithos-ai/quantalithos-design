# Step 14. 定义最终结论与签署口径

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 14
> 回填章节: `06-验收标准.md` §14 最终结论与签署

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义最终结论与签署口径 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~13 已审核通过;全部验收门禁、缺陷规则、风险接受口径已收敛 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_14_conclusion_signoff.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

定义 L1-identity 验收最终结论如何表达、如何触发“进入下一阶段 / 发布准备”、哪些角色必须签署,以及签署与风险接受之间的关系。

本 Step 只定义:

- 最终结论的三值口径:通过、有条件通过、不通过。
- 功能验收、非功能验收、发布准备、总体结论和下一阶段许可的判定表。
- 签署角色、签署责任、签署结论和日期字段。
- 风险接受、缺陷关闭、VETO、evidence integrity 对最终签署的约束。

本 Step 不实际填写真实人名,不替代 `risk-acceptance.md` 的风险签收,不重新定义测试证据,不修改正式 `06-验收标准.md`。正式文档装配留 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供 P0 功能门禁结论来源 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供数据边界、架构红线和 forbidden material 裁决来源 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已审核通过 | 提供接口、事件、job、跨仓同步裁决来源 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | 提供状态、事务、幂等和一致性裁决来源 |
| `06_acceptance_step_09_nonfunctional.md` | 已审核通过 | 提供非功能、config、redaction、dependency、observability 裁决来源 |
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | 提供 evidence index、raw artifact、report audit 和 handoff 裁决来源 |
| `06_acceptance_step_11_blockers.md` | 已审核通过 | 提供 `VETO-ID-001~006` 一票否决裁决来源 |
| `06_acceptance_step_12_defects_release.md` | 已审核通过 | 提供 S/A/B、复验和放行规则 |
| `06_acceptance_step_13_risk_acceptance.md` | 已审核通过 | 提供风险接受、residual 和有条件通过必要条件 |
| 验收 SOP Step 14 / 书写规范 §4.2 / §5.14 | 当前标准 | 提供三值结论、结论表和签署表写法 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 结论只能有哪些取值? | 只能是通过、有条件通过、不通过。禁止“基本通过”“原则上通过”“暂定通过”“观察通过”等模糊结论。 |
| 何时允许进入下一阶段? | 全部 P0 门禁可裁决且通过、无 VETO、无未关闭 S、evidence integrity 完整时允许进入;若仅存在已接受 A/B/R residual,则可有条件进入;任一 P0/VETO/S/evidence 阻断未闭合则不允许进入。 |
| 何时允许发布准备? | 进入下一阶段条件满足,且 release smoke、acceptance handoff、veto checklist、risk/open issue 记录完整时允许发布准备;有条件通过时发布准备必须绑定条件、owner 和截止时间。 |
| 哪些角色必须签署? | 至少包括验收负责人、架构负责人、测试负责人、产品负责人、合规 / 安全负责人、实施 / 运维负责人。若某 residual 由特定能力 owner 承担,该 owner 也必须签署对应风险。 |
| 签署是否代表风险接受? | 否。签署总体结论不自动接受风险。风险接受必须在 Step 13 定义的风险接受表中单独具备接受人、理由、后续动作、责任人和截止时间。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06` 结论口径 | 可能存在泛化通过语句,缺少三值裁决结构 | 本 Step 固定三值结论表 |
| Step 5~10 | 已定义门禁,但没有汇总到最终签署表 | 本 Step 汇总为维度结论 |
| Step 11 | VETO 已闭合,但最终结论需强绑定 VETO | 本 Step 明确任一 VETO 命中即总体不通过 |
| Step 12 | 缺陷分级已闭合,但签署时如何处理 A/B/R 需明确 | 本 Step 把 S/A/B/R 与三值结论绑定 |
| Step 13 | 风险接受已闭合,但签署不应自动替代风险接受 | 本 Step 区分签署与风险接受 |
| 发布准备 | 容易被误写成“验收通过后自然发布” | 本 Step 单独给发布准备维度 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 最终结论 | 分散在各门禁 | 汇总为功能、非功能、发布准备、总体结论、下一阶段许可 | 可签署 |
| 结论取值 | 可能出现模糊语 | 只允许通过 / 有条件通过 / 不通过 | 符合书写规范 |
| 风险接受 | 可能与签署混淆 | 风险接受独立于最终签署 | 防止隐性放行 |
| 签署角色 | 未统一 | 固定关键角色和责任 | 可追责 |
| 发布准备 | 未独立裁决 | 单独作为最终结论维度 | 避免验收通过被误当作发布自动许可 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否允许“基本通过”等非三值结论 | A. 允许;B. 禁止 | 采用 B。正式验收只允许三值。 |
| 总体结论是否取各门禁最差结论 | A. 是;B. 允许人工覆盖 | 采用 A。人工签署只能解释,不能覆盖 VETO/S/P0/evidence 阻断。 |
| 有条件通过是否允许未接受风险 | A. 允许;B. 不允许 | 采用 B。没有风险接受闭环不能有条件通过。 |
| 发布准备是否与进入下一阶段合并 | A. 合并;B. 分开 | 采用 B。发布准备还依赖 handoff、open issue 和 risk 记录完整性。 |
| 签署是否自动接受所有风险 | A. 是;B. 否 | 采用 B。风险接受必须逐项签收。 |

## 8. 结构化中间产物

### 8.1 三值结论定义表

| 结论 | 定义 | 最低条件 | 禁止场景 |
|---|---|---|---|
| 通过 | 全部 P0 门禁通过,无阻断缺陷,证据完整 | Step 5~10 P0 全部通过;Step 11 无 VETO;Step 12 无未关闭 S/A;Step 13 无需风险接受或仅有非阻断记录 | 任一 VETO/S/P0/evidence 阻断未闭合 |
| 有条件通过 | P0 主线成立,存在已接受遗留项 | Step 5~10 P0 成立;无 VETO/S;A/B/R 风险已按 Step 13 完整接受;后续动作、责任人、接受人、截止时间明确 | 风险无接受人;风险覆盖 P0/VETO/S/redaction/dependency/evidence |
| 不通过 | P0 门禁失败或出现一票否决 / 阻断缺陷 | 任一 P0 gate fail、VETO 命中、未关闭 S、evidence integrity fail、风险接受缺失且影响放行 | 不得通过人工说明降级 |

### 8.2 最终结论表模板

| 维度 | 结论 | 说明 |
|---|---|---|
| 功能验收 | 通过 / 有条件通过 / 不通过 | 基于 Step 5、Step 7、Step 8 的 P0 function / interface / state verdict |
| 非功能验收 | 通过 / 有条件通过 / 不通过 | 基于 Step 6、Step 9、Step 10 的 boundary / NFR / evidence verdict |
| 发布准备 | 通过 / 有条件通过 / 不通过 | 基于 release smoke、handoff、veto checklist、risk/open issue completeness |
| 总体结论 | 通过 / 有条件通过 / 不通过 | 取所有门禁、VETO、缺陷、风险和证据的最终裁决 |
| 是否允许进入下一阶段 | 是 / 否 / 有条件 | 通过则是;有条件通过则有条件;不通过则否 |

### 8.3 维度结论来源表

| 维度 | 来源 Step | 必查材料 | 结论规则 |
|---|---|---|---|
| 功能验收 | Step 5 / 7 / 8 | P0 功能 gate、interface / event / job gate、state / transaction / idempotency gate | 全部 P0 通过才可通过;仅非阻断 accepted risk 可有条件通过 |
| 非功能验收 | Step 6 / 9 / 10 | data boundary、redaction、dependency、config、observability、evidence index、report audit | redaction/dependency/evidence integrity 任一失败即不通过 |
| 发布准备 | Step 10 / 11 / 12 / 13 | acceptance handoff、veto checklist、open issues、risk acceptance、defect closure | handoff 与风险记录完整才可发布准备 |
| 总体结论 | Step 5~13 | 全部门禁和风险 / 缺陷记录 | 按最差阻断项裁决,不得人工覆盖 |
| 下一阶段许可 | Step 14 | 总体结论 + 发布准备 | 通过=是;有条件通过=有条件;不通过=否 |

### 8.4 总体结论裁决矩阵

| 条件组合 | 总体结论 | 下一阶段 | 发布准备 |
|---|---|---|---|
| P0 全部通过;无 VETO;无未关闭 S/A;证据完整;无必须接受 residual | 通过 | 是 | 通过 |
| P0 全部通过;无 VETO/S;存在已接受 A/B/R residual;证据完整 | 有条件通过 | 有条件 | 有条件 |
| P0 全部通过;无 VETO/S;存在未接受 A 或风险接受缺字段 | 不通过 | 否 | 不通过 |
| 任一 P0 门禁失败且不能证明为测试工具缺陷 | 不通过 | 否 | 不通过 |
| 任一 `VETO-ID-001~006` 命中 | 不通过 | 否 | 不通过 |
| 任一未关闭 S | 不通过 | 否 | 不通过 |
| evidence index / raw artifact / report audit 缺失或不可裁决 | 不通过 | 否 | 不通过 |
| redaction / dependency / config fail-fast / query no-write / job no-repair / stored replay 红线失败 | 不通过 | 否 | 不通过 |

### 8.5 下一阶段许可规则

| 许可项 | 通过时 | 有条件通过时 | 不通过时 |
|---|---|---|---|
| 进入下一阶段设计 / 实施 | 允许 | 允许,但必须携带 risk / open issue 条件 | 不允许 |
| release preparation | 允许 | 允许准备,但不得删除条件和复验动作 | 不允许 |
| 对外声明 P0 验收通过 | 允许 | 只能声明有条件通过并列出条件 | 不允许 |
| 关闭验收 run | 允许归档 | 允许归档,但 risk acceptance / open issues 必须随附 | 不允许关闭为 passed |
| 后续 scope 升级 | 按新基线处理 | residual 升级时必须重开相关 Step / gate | 修复后重新送验 |

### 8.6 签署表模板

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| 验收负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 架构负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 测试负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 产品负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 合规 / 安全负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 实施 / 运维负责人 | `<name or role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| residual owner | `<按风险项补充>` | 通过 / 有条件通过 / 不通过 | `<date>` |

签署规则:

- 签署表必须填具体姓名或明确责任主体,不得只写“待定”。
- 任一关键角色签署“不通过”时,总体结论不得高于有条件通过;若其理由命中 P0/VETO/S/evidence 阻断,总体结论必须为不通过。
- residual owner 签署只说明其负责风险项对总体结论的影响,不替代 Step 13 的逐项风险接受,也不替代总体验收负责人签署。
- 签署日期必须与固定 `<run_id>` 的验收材料一致,不得引用浮动 `latest`。

### 8.7 风险接受与签署关系表

| 场景 | 是否可签总体通过 | 是否可签有条件通过 | 说明 |
|---|---|---|---|
| 无 residual,全部门禁通过 | 是 | 不需要 | 可直接通过 |
| 仅 B/R residual,且全部有接受人和截止时间 | 否 | 是 | 条件必须随结论归档 |
| A 级未关闭但已证明不影响 P0 且有替代 evidence / 接受人 / 复验动作 | 否 | 是 | 必须回指 Step 13 风险接受 |
| A/B/R residual 缺接受人或截止时间 | 否 | 否 | 不满足有条件通过 |
| 任一 residual 覆盖 VETO/S/P0/evidence/redaction/dependency | 否 | 否 | 必须不通过 |

### 8.8 发布准备裁决表

| 审查项 | 通过条件 | 失败影响 |
|---|---|---|
| acceptance handoff | `reports/acceptance/handoff.md` 完整,绑定固定 run_id | 发布准备不通过 |
| veto checklist | `VETO-ID-001~006` 全部有证据且未触发 | 总体不通过 |
| risk acceptance | 所有条件通过风险均有接受人、动作和截止时间 | 有条件通过不成立 |
| open issues | A/B/R 均记录影响、owner、复验或后续动作 | 发布准备不通过或有条件 |
| evidence index | EV / TC / AC / VETO / artifact / report 回指完整 | 总体不通过 |
| release smoke | release-main-smoke 或正式 release gate 可裁决 | 发布准备不通过 |

### 8.9 最终签署停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 结论是否只使用三值 | 通过 | 见 §8.1 |
| 是否定义进入下一阶段条件 | 通过 | 见 §8.5 |
| 是否定义发布准备条件 | 通过 | 见 §8.8 |
| 是否定义必须签署角色 | 通过 | 见 §8.6 |
| 签署是否不替代风险接受 | 通过 | 见 §8.7 |
| 是否与 VETO / 缺陷 / evidence gate 一致 | 通过 | 见 §8.3 / §8.4 |
| 是否提前修改正式 `06` | 否 | Step 15 才装配正式文档 |

### 8.10 跨门禁总审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 5~10 的 P0 门禁是否能汇总到最终结论 | 通过 | 通过维度结论来源表汇总 |
| VETO 是否强制总体不通过 | 通过 | 任一 VETO 命中即不通过 |
| S 级是否强制总体不通过 | 通过 | 任一未关闭 S 即不通过 |
| A/B/R 是否只通过 Step 13 支撑有条件通过 | 通过 | 无接受人不得有条件通过 |
| evidence integrity 是否不可风险接受 | 通过 | 缺失或失败即不通过 |
| 发布准备是否独立于总体通过 | 通过 | 单独维度裁决 |
| 是否存在模糊结论 | 否 | 禁止非三值结论 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 三值结论与书写规范一致 | 否 | 验收表达收敛 | Step 15 回填 |
| 发布准备单独成维度 | 否 | 验收裁决细化 | Step 15 回填 |
| 风险接受不等于签署 | 否 | 风险 / 签署边界 | 与 Step 13 一致 |
| 若签署角色缺失 | 是 | 不能最终归档 | formal handoff 前必须补齐 |
| 若总体结论需要放宽 P0/VETO/S | 是 | 上游验收标准冲突 | 不允许;必须回写设计 / 测试并重审 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_14_conclusion_signoff.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“三值结论定义表”“最终结论表模板”“总体结论裁决矩阵”“签署表模板”“风险接受与签署关系表”和“发布准备裁决表”小节,了解最终验收结论如何由全部门禁、风险和缺陷收敛。

正式 `06-验收标准.md` §14 应回填:

- 最终结论只允许通过、有条件通过、不通过。
- 功能验收、非功能验收、发布准备、总体结论和是否允许进入下一阶段必须分别裁决。
- 任一 `VETO-ID-001~006`、未关闭 S、P0 门禁失败、redaction / dependency / evidence integrity / config / query no-write / job no-repair / stored replay 红线失败,总体结论必须为不通过。
- 有条件通过只能建立在 P0 主线成立且风险接受完整的前提上。
- 签署表必须包含验收负责人、架构负责人、测试负责人、产品负责人、合规 / 安全负责人、实施 / 运维负责人;必要时补 residual owner。
- 总体签署不自动替代风险接受;风险接受必须逐项签收。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 最终签署人真实姓名 | 影响正式归档 | Step 15 formal assembly 或 actual handoff 填写 |
| 最终 `<run_id>` 与送验版本 | 影响签署日期和证据绑定 | Step 3 已定义基线口径;正式签署时填真实值 |
| 是否存在真实未关闭 A/B/R | 影响总体结论 | Step 13 风险接受与实际 `open-issues.md` 判定 |
| 发布准备是否与具体 release gate 绑定 | 影响发布准备维度 | Step 15 按正式 report path 回填 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 三值结论定义完成 | 通过 | 见 §8.1 |
| 最终结论表模板完成 | 通过 | 见 §8.2 |
| 维度结论来源完成 | 通过 | 见 §8.3 |
| 总体裁决矩阵完成 | 通过 | 见 §8.4 |
| 下一阶段许可规则完成 | 通过 | 见 §8.5 |
| 签署表和签署规则完成 | 通过 | 见 §8.6 |
| 风险接受与签署关系完成 | 通过 | 见 §8.7 |
| 发布准备裁决完成 | 通过 | 见 §8.8 |
| 未提前修改正式 `06` | 通过 | Step 15 才装配正式文档 |
| 可进入 Step 15 | 通过 | 用户已确认,进入 Step 15: 整理正式验收标准文档 |
