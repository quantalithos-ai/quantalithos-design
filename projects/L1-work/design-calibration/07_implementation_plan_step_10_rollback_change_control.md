# L1-work 07 实施计划 Step 10: 回退、暂停与变更控制

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §10 回退、暂停与变更控制
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义回退、暂停与变更控制 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_10_rollback_change_control.md` |

本步定义 L1-work 实施过程中遇到设计缺口、门禁失败、外部依赖不可用、范围变化或提交边界越界时的暂停、回退、变更和恢复规则。本步不新增阶段、不改变 commit boundary、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 commit boundary、开工前设计闭环复核、提交边界和提交前检查清单 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段门禁、commit 门禁、artifact / report、失败处理和 VETO 前置规避 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承外部依赖不可用处理、fake / configured 边界和 profile failure 规则 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、P0 risk、P1/P2 risk、open item、blocker 和上游回写触发矩阵 |
| `05-测试方案.md` §11 / §14 | 已完成 | 提取缺陷分级、修复后回归、残余风险和不得进入残余风险项 |
| `06-验收标准.md` §10~§13 | 已完成 | 提取证据门禁、VETO、缺陷放行、风险接受和失败证据保留 |
| `standards/document/实施计划讨论流程_SOP.md` Step 10 | 已读取 | 约束暂停规则、回退规则、变更控制和恢复条件 |

校准来源:

- `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
- `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
- `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
- `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
- `design-calibration/05_test_plan_step_11_defects_retest.md`
- `design-calibration/05_test_plan_step_14_regression_risks.md`
- `design-calibration/06_acceptance_step_12_defect_retest_release.md`
- `design-calibration/06_acceptance_step_13_risk_acceptance.md`

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些情况必须暂停当前阶段 | 设计真相源缺口、字段 / DTO / 状态冲突、phase boundary 越界、P0 gate / redaction / no-write / dependency / VETO 失败、core path 缺失、configured fake fallback、重复 truth、证据路径错误和用户未审核的 Step 完成状态都必须暂停。 |
| 2. 哪些情况允许回退到上一个提交边界 | 当前 boundary 尚未提交且改动无法通过门禁、误混入跨 boundary 改动、实现路径被上游修正替代时,允许回退当前 boundary 的未提交改动。已验证的上一提交边界优先保留;已提交内容需要通过新修复提交或受控 revert 处理。 |
| 3. 哪些情况必须回写详细设计或测试方案 | 字段 schema、DTO 构造、状态矩阵、flow、repository key、config default、runtime dependency、TC / EV / AC / VETO、artifact / report 路径或 phase boundary 需要改变时必须回写对应上游文档。 |
| 4. 门禁失败后如何处理 | 保留失败 artifact 和 failure reason,分类 S / A / B / C,修复后跑 direct failed test、impacted family、必要 release redline 和 evidence check。P0 阻断失败不得继续下一阶段。 |
| 5. 外部依赖不可用时是否允许继续局部实施 | `core-contracts` 不可用不允许继续;运行期 / 事件协作 sibling 或真实生产服务不可用时可继续 fake / fixture P0 路径;selected configured seam 不可用时该 selected gate fail-fast,不得 fallback fake success。 |
| 6. 恢复实施的条件是什么 | blocker 原因已解除、上游 design / config / test / acceptance 文档已回写并提交或明确不需要回写、当前 boundary 重新通过开工复核、失败门禁已重跑通过、证据已保留且报告已更新。 |
| 7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理 | 立即暂停当前 boundary,记录缺口和涉及文档位置,不在代码中自行补占位或选边;设计修正后重新读取基线并从当前 boundary 重新评估。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 失败处理分散 | Step 7/8/9 均有失败处理,但尚无统一动作语言 | 实施 agent 可能不清楚何时 pause / rollback / change | 本步统一成 pause、rollback、change、resume |
| 回退边界未与提交边界绑定 | Step 6 有 commit boundary,但没有回退优先级 | 可能误回退已验证阶段或用户改动 | 本步规定优先保护上一已验证 boundary 和用户未提交改动 |
| 上游回写触发需要执行化 | Step 9 已列回写触发 | 实现时仍可能临时补设计 | 本步把回写触发转成暂停 / 恢复条件 |
| 外部依赖不可用处理需一致 | Step 8 已列不可用矩阵 | selected seam 可能被误标通过 | 本步规定 fake / configured 不可互相冒充 |
| 证据失败需要保留 | `05/06` 要求 failure evidence | 失败证据可能被成功 run 覆盖 | 本步规定失败 artifact 必须保留并进入缺陷 / 复验链 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 暂停规则 | 分散在风险和门禁表 | 形成触发条件、动作、责任方、证据和恢复条件 | 实施时可直接执行 |
| 回退规则 | 只知道按 commit boundary 提交 | 明确未提交当前 boundary 可回退,已验证边界优先保护 | 避免破坏已验证成果 |
| 变更控制 | 只知道需要回写上游 | 明确变更类型、回写目标和重启门禁 | 避免代码侧第二真相 |
| 外部依赖 | fake / configured 边界已定义 | 补暂停 / fail-fast / not_applicable 规则 | 防止假成功 |
| 恢复条件 | 未集中 | 必须重读基线、重跑门禁、更新证据 | 防止修一处漏一处 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 失败后继续实现后续文件 | 表面推进快 | 扩散错误,增加回退成本 | 不采用 |
| 任何失败都重置到 phase 起点 | 干净 | 破坏已验证提交边界,成本高 | 不采用 |
| 暂停当前 boundary,保护上一已验证 boundary | 控制影响范围 | 需要清楚证据和恢复条件 | 采用 |
| 设计缺口由实现者临时落码 | 少一次文档回写 | 形成第二真相 | 不采用 |
| 设计缺口回写上游后恢复 | 可追溯、可复核 | 需要等待文档更新 | 采用 |
| 真实外部依赖不可用时阻塞全部 P0 | 保守 | 与 fake / in-memory P0 冲突 | 不采用 |
| 真实外部依赖不可用时只阻塞 selected seam | 保持 P0 独立 | 需要 fake marker 和 not_applicable 证据 | 采用 |

## 7. 结构化中间产物

### 7.1 动作定义

| 动作 | 定义 | 适用场景 |
|---|---|---|
| pause | 停止当前 phase / commit boundary 的继续实现,保留现场和证据 | 设计缺口、门禁失败、外部 selected seam fail-fast、用户审核点 |
| local-fix | 不改变上游设计和 boundary,在当前 boundary 内修复实现或测试 | 普通 compile / unit / service failure,fixture 小错 |
| rollback-current | 回退当前 boundary 未提交改动,回到上一已验证状态 | 当前实现方向错误、跨 boundary 混入、未提交改动无法安全修复 |
| change-upstream | 回写 `03/04/05/06/07` 或标准文档,形成新的设计 / 测试 / 验收基线 | 字段、DTO、状态、config、gate、scope 或 boundary 变化 |
| controlled-revert | 对已提交实现使用显式 revert / 修复提交恢复行为 | 已提交内容被确认错误且不能用小修复解决 |
| resume | blocker 解除后重新读取基线、重跑门禁并继续当前 boundary | pause / change / rollback 后恢复 |

### 7.2 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 字段、DTO、state、result、receipt 或 ref schema 缺失 | pause + change-upstream | 实现 agent / 设计负责人 | blocker 描述、文件路径、行号、当前 boundary | 上游文档补齐并固定新基线;重新开工复核 |
| flow 与 protocol schema 冲突 | pause + change-upstream | 实现 agent / 设计负责人 | 冲突两侧引用、无法落码说明 | 上游统一口径;相关 tests / gates 同步 |
| phase / commit boundary 需要后续 phase 才能闭合 | pause + change-upstream | 实现 agent / 实施计划负责人 | boundary 冲突说明、影响文件 | 调整 boundary 或补当前 boundary 依赖口径 |
| P0 suite、release gate 或 selected blocking gate 失败 | pause + local-fix | 实现 agent / 测试负责人 | suite artifact、stdout / stderr、failure reason | direct failed test 和 impacted gate 通过 |
| redaction / forbidden output 命中 | pause + local-fix | 实现 agent / 安全 / 测试负责人 | redaction artifact、sanitized location、defect ref | 泄露面移除,redaction 和相关 family gate 通过 |
| query / projection / report no-write 失败 | pause + local-fix 或 change-upstream | 实现 agent / 设计负责人 | before / after digest、write trace、no-write report | side effect 修复或设计回写;no-write gate 通过 |
| duplicate / dedup / version conflict 产生重复 truth | pause + local-fix | 实现 agent / 应用负责人 | idempotency artifact、state digest、defect ref | direct + family + selected stress 通过 |
| 非 core sibling repo 进入 Cargo dependency | pause + local-fix | 实现 agent | Cargo metadata、dependency report | 移除依赖,dependency check 通过 |
| `core-contracts` path 缺失或 baseline 不可编译 | pause | 实现 agent / core 负责人 | path / compile failure | core path 恢复并编译通过 |
| configured adapter 缺 ref 后 fallback fake success | pause + local-fix | 实现 agent / 配置负责人 | config artifact、fake marker report | fail-fast / fail-closed 行为通过 |
| evidence index、gate results、veto checklist 或 report path 缺失 | pause + local-fix | 实现 agent / 测试负责人 | evidence check artifact | release-evidence-pack 通过 |
| 用户要求每个 Step 完成后审核 | pause | 当前文档 agent / 用户 | Step 中间产物和检查结果 | 用户明确同意继续 |

### 7.3 回退规则表

| 触发条件 | 允许回退范围 | 不允许回退 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary 未提交且实现方向错误 | 当前 boundary 未提交改动 | 上一已验证 boundary、用户已有未提交改动 | 当前 diff、失败原因、相关 gate artifact | 回到上一已验证状态,重新读取 boundary |
| 当前 boundary 混入跨阶段功能 | 当前 boundary 中越界文件或越界代码 | 同 boundary 已通过且仍有效的代码,除非无法分离 | diff 分类、越界说明 | 拆分或移除越界改动后重跑门禁 |
| 当前 boundary 设计基线被上游修正替代 | 与旧口径相关的未提交实现 | 用户改动、无关文件、已验证提交 | 新旧基线差异、受影响文件 | 重新按新基线实现并重跑 gates |
| 已提交 boundary 被后续发现有 P0 缺陷 | 优先新修复提交;必要时 controlled-revert 该提交 | 不得重写公共历史或破坏后续已验证提交 | defect、gate artifact、revert reason | 修复提交或 revert 后 full impacted regression 通过 |
| release evidence 生成错误但代码行为正确 | report / artifact 生成脚本和错误报告 | 已验证业务代码 | 错误报告、path check artifact | 重新生成固定 run report 并 review |
| artifact 含 forbidden output | 泄露 artifact / report 不作为正式证据;修复生成逻辑 | 不删除缺陷记录和 sanitized failure summary | sanitized failure summary、defect ref | 新 run redaction passed;旧失败记录保留 |

### 7.4 变更控制表

| 变更类型 | 触发条件 | 回写位置 | 评审门禁 | 恢复条件 |
|---|---|---|---|---|
| design schema 变更 | 字段 / DTO / state / ref / result / receipt 不闭合 | `03-详细设计.md` 和对应 `03_ddd_*` | 设计闭环复核、相关 contract tests 更新 | 新 design commit 固定;boundary 重读 |
| function flow 变更 | flow 与对象 / port / protocol 不一致 | `03-详细设计.md` Step 8 / Step 9 / Step 11 | service / UoW / rollback tests 更新 | affected gate 通过 |
| config 变更 | 新增或改变 `WorkRuntimeConfig` 字段、默认值、来源、校验、failure mode | `03-详细设计.md` §13;`04-配置设计.md` | config-fast、config-redaction、runtime fixture | config gates 通过 |
| test / evidence 变更 | 新增 / 修改 `TC-WORK-*`、`EV-WORK-*`、suite、artifact、report | `05-测试方案.md`;`07-实施计划.md` | direct + impacted suite + evidence index | evidence index 和 gate results 更新 |
| acceptance / VETO 变更 | `AC-WORK-*`、VETO、risk acceptance、release redline 改变 | `06-验收标准.md`;`07-实施计划.md` | 验收负责人 review、release gate selected | VETO checklist 更新 |
| phase / commit boundary 变更 | 当前 boundary 过大、依赖后续 phase 或无法独立验证 | `07-实施计划.md` §5 / §6 / §7 | 实施计划 review、门禁矩阵同步 | 新 boundary 表确认 |
| dependency type 变更 | 想把运行期 / 事件协作依赖改成编译期依赖 | `01-架构设计.md`;`03-详细设计.md`;`07-实施计划.md` | 架构依赖裁剪 review | 正式允许前不得落码 |
| production integration 变更 | durable store、real bus、secret provider、config center 进入范围 | `00/01/03/04/05/06/07/09` 视影响 | P1/P2 专项设计和运维 review | 不影响 P0,专项另行开工 |

### 7.5 外部依赖不可用处理表

| 不可用对象 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| `core-contracts` | pause | 实现 agent / core 负责人 | path check、compile output | core path 存在且 `cargo check` 通过 |
| 目标实现仓不存在 | local-fix | 实现 agent | 初始化记录 | PH-01 创建并通过 workspace gate |
| Rust / Cargo / fmt 不可用 | pause | 实现 agent / 环境负责人 | toolchain failure | 工具可用,fmt / check 通过 |
| sibling repo 不存在 | continue with fake / fixture | 实现 agent | not_applicable 或 fake marker | 不需要恢复;selected seam 再检查 |
| configured adapter ref 缺失 | pause selected seam | 实现 agent / 配置负责人 | sanitized config error | ref 补齐或 selected seam 标明 not_applicable |
| provider unavailable | fail-closed / marker | 实现 agent / 依赖方 | failed marker、resolver / handoff report | provider 恢复或 fake P0 path 明确 |
| real bus / durable DB / secret provider 未定义 | no P0 action | 架构 / 运维负责人 | P1/P2 risk | 专项设计完成 |

### 7.6 恢复实施检查清单

| 检查项 | 通过条件 |
|---|---|
| blocker 状态 | blocker 已关闭、降级为 P1/P2 risk 或明确 not_applicable,且有证据 |
| 上游文档 | 需要回写时,`03/04/05/06/07` 已更新并形成新设计基线 |
| 当前 boundary | 已重新读取当前 phase / commit boundary 的正式章节和校准来源 |
| 工作区 | 只保留当前 boundary 相关改动;用户已有未提交改动未被改写 |
| 门禁 | direct failed test、impacted family、redaction / no-write / dependency / evidence check 已通过 |
| 证据 | 失败 artifact 已保留;新 run artifact / report 使用固定 `<run_id>` |
| 风险 | B / C 或 P1/P2 风险有 owner、动作和截止点;S / VETO / P0 A 不在风险接受中 |

### 7.7 不得风险接受清单

| 项目 | 处理 |
|---|---|
| 任一 `VETO-WORK-*` failed | 必须暂停并修复 |
| S 级缺陷 | 必须修复并复验 |
| 影响 P0 gate / release gate / P0 evidence 的 A 级缺陷 | 必须修复,除非上游正式降级 P0 范围 |
| redaction failed 或 forbidden output 命中 | 必须修复并重跑 redaction |
| duplicate / dedup / version conflict 产生重复 truth | 必须修复并补回归 |
| query / projection / report 反写真相 | 必须修复并补 no-write 回归 |
| configured adapter fake fallback success | 必须修复为 fail-fast / fail-closed |
| evidence index 缺 P0 EV 或正式证据引用 `latest` | 必须修复 release evidence pack |
| 非 core sibling repo 进入 Cargo dependency | 必须移除并重跑 dependency check |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §10。

````markdown
## 10. 回退、暂停与变更控制

> 校准来源:
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“外部依赖不可用处理表”“恢复实施检查清单”和“不得风险接受清单”小节,了解实施过程中遇到设计缺口、门禁失败或依赖不可用时如何处理。

实施过程中禁止用“视情况处理”替代明确动作。所有异常必须归入 `pause`、`local-fix`、`rollback-current`、`change-upstream`、`controlled-revert` 或 `resume`。

| 触发条件 | 动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| 字段、DTO、state、result、receipt 或 ref schema 缺失 | pause + change-upstream | blocker 描述、文件路径、行号、当前 boundary | 上游文档补齐并固定新基线 |
| flow 与 protocol schema 冲突 | pause + change-upstream | 冲突两侧引用、无法落码说明 | 上游统一口径,相关 tests / gates 同步 |
| P0 suite、release gate 或 selected blocking gate 失败 | pause + local-fix | suite artifact、stdout / stderr、failure reason | direct failed test 和 impacted gate 通过 |
| redaction / forbidden output 命中 | pause + local-fix | redaction artifact、sanitized location、defect ref | 泄露面移除,redaction 和相关 family gate 通过 |
| query / projection / report no-write 失败 | pause + local-fix 或 change-upstream | before / after digest、write trace、no-write report | side effect 修复或设计回写,no-write gate 通过 |
| duplicate / dedup / version conflict 产生重复 truth | pause + local-fix | idempotency artifact、state digest、defect ref | direct + family + selected stress 通过 |
| 非 core sibling repo 进入 Cargo dependency | pause + local-fix | Cargo metadata、dependency report | 移除依赖,dependency check 通过 |
| configured adapter 缺 ref 后 fallback fake success | pause + local-fix | config artifact、fake marker report | fail-fast / fail-closed 行为通过 |

回退优先保护上一已验证提交边界。当前 boundary 尚未提交且实现方向错误时,只回退当前 boundary 未提交改动;不得改写用户已有未提交改动。已提交内容如果被确认错误,优先使用新修复提交;必要时使用受控 revert,并保留缺陷、证据和回归结果。

恢复实施前必须满足:

- blocker 已关闭或明确 not_applicable。
- 需要回写时,上游文档已更新并形成新基线。
- 当前 boundary 已重新读取正式章节和校准来源。
- direct failed test、impacted family、redaction / no-write / dependency / evidence check 已通过。
- 失败 artifact 已保留,新 run 使用固定 `<run_id>`。
- S / VETO / P0 A、redaction failed、重复 truth、`latest` 证据路径和 fake fallback success 不进入风险接受。
````

## 9. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续必须继续收口:

- Step 11 将本步动作规则转成提交、评审、暂存区、commit message、证据提交和交付纪律。
- Step 12 将本步恢复检查、不得风险接受清单和 release evidence gate 写入实施完成判定。
- Step 13 装配正式 `07-实施计划.md` 时,必须保留本步对用户未提交改动和上一已验证 boundary 的保护规则。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 暂停、回退、变更和恢复条件明确 | 已满足 |
| 规则与提交边界一致 | 已满足 |
| 规则与门禁矩阵一致 | 已满足 |
| 设计偏离必须回写上游文档 | 已满足 |
| 设计真相源冲突必须暂停当前 phase / boundary | 已满足 |
| 回退规则优先保护已验证阶段 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

用户审核确认后,可以进入 Step 11: 定义提交、评审与交付纪律。
