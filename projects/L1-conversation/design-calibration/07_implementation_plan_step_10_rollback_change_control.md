# L1-conversation 07 实施计划 Step 10: 回退、暂停与变更控制

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §10 回退、暂停与变更控制
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义回退、暂停与变更控制 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_10_rollback_change_control.md` |

本步把实施过程中“什么时候暂停、什么时候回退、什么时候必须回写设计、什么时候可以恢复”固定为规则。本步不改变 PH-01~PH-08 顺序，不改变 Step 6 提交边界，不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 commit-01-a 到 commit-08-b、代码批次、提交前检查清单和开工前设计闭环复核矩阵 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段门禁矩阵、门禁失败处理、一票否决和证据归档规则 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承编译期依赖、运行期依赖、fake / controlled seam 和配置失败处理 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、风险、blocker、待确认事项和风险接受边界 |
| `03-详细设计.md` | 已完成 | 作为字段、DTO、状态、事务、幂等、phase boundary 和实现对象真相源 |
| `05-测试方案.md` | 已完成 | 作为 TC、suite、artifact 和复验范围真相源 |
| `06-验收标准.md` | 已完成 | 作为 AC、VETO、EV、风险接受和最终放行真相源 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些情况必须暂停当前阶段 | 设计真相源冲突、字段 / DTO / 状态无法 1:1 落码、phase boundary 越界、core contracts 不可用、目录 / 命名偏离、P0 / VETO / redaction / path / EV blocker 均必须暂停。 |
| 2. 哪些情况允许回退到上一个提交边界 | 当前 boundary 未通过门禁、局部实现方向错误、脚本或 fake adapter 引入错误、未提交工作可清理时，允许回退到上一个已验证提交边界；不得回退或改写已验证阶段来掩盖当前问题。 |
| 3. 哪些情况必须回写详细设计或测试方案 | 字段缺失、DTO 构造不完整、enum / state 名冲突、flow 与对象契约冲突、AC / TC 口径冲突、phase scope 依赖后续对象、P1/P2 被要求进入 P0 时，必须回写对应设计 / 测试 / 验收文档。 |
| 4. 门禁失败后如何处理 | 按 Step 7 失败类型阻断推进，保留 failure artifact，修复当前 boundary，重跑直接 TC、同组 TC、相关 suite；release redline、VETO 或 redaction 失败不得风险接受。 |
| 5. 外部依赖不可用时是否允许继续局部实施 | `core-contracts` 不可用必须暂停；运行期 / 事件协作依赖不可用时，可在 P0 范围内使用 fake、fixture、unresolved、retry、failed、quarantine 或 risk，但必须保留 fake marker。 |
| 6. 恢复实施的条件是什么 | design repo 已提交新 baseline 或实现修复已完成，当前 boundary 的开工前复核重新通过，相关门禁和证据重跑通过，实施 agent 重新读取受影响正式章节和 calibration 文件。 |
| 7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理 | 立即暂停当前 boundary，记录 blocker，列出冲突文档和影响范围，回到 design repo 修正并提交；实现者不得在代码中临时补字段、改名或自行选边。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 暂停和风险容易混淆 | Step 9 已列风险，但实现时可能把 blocker 当可接受风险 | 实现 agent 继续自行取舍 | 本步把 blocker 与可接受风险拆成不同动作 |
| 回退容易破坏已验证阶段 | 如果只说“回退到上一版”，可能误改 PH-02~PH-04 已验证内容 | 证据和 commit boundary 失效 | 本步要求只回退当前未通过 boundary 或未提交局部改动 |
| 设计冲突可能被实现侧补丁掩盖 | 字段、DTO、状态缺口经常能靠临时字段跑通 | 真相源漂移，后续 agent 继续被卡 | 本步要求回写 design repo 并给新 commit baseline |
| 外部依赖不可用处理不一致 | core、bus、identity、resolver、handoff 的依赖类型不同 | 错把运行期协作当 Cargo 依赖，或错把 core 缺失当 fake | 本步按 Step 8 类型分别处理 |
| 门禁失败后重跑范围不清 | 只重跑单个失败测试可能漏掉同组回归 | false green | 本步固定直接 TC、同组 TC、相关 suite 和证据重生成 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 暂停规则 | 分散在 Step 6~9 | 统一暂停规则表 | 实现 agent 可直接判断何时停手 |
| 回退规则 | 只有 commit boundary 可回退的原则 | 明确允许和禁止回退范围 | 保护已验证阶段 |
| 变更控制 | 只说设计冲突需回写 | 规定回写对象、责任方、证据和恢复条件 | 降低跨 agent 协作误差 |
| 门禁失败 | Step 7 有失败处理 | 本步把失败处理接到 pause / rollback / recovery | 执行链闭环 |
| 外部依赖 | Step 8 有依赖类型 | 本步把依赖不可用转成暂停或局部继续规则 | 避免错误阻塞或错误放行 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 设计冲突由实现 agent 自行选择最合理口径 | 实现推进快 | 真相源漂移，后续测试和验收不可追溯 | 不采用 |
| 设计冲突暂停并回写 design repo | 牺牲短期速度 | 保持 1:1 落码和跨 agent 一致 | 采用 |
| 所有失败都回退到上一提交 | 简单 | 会丢失有价值 failure evidence，也可能破坏已验证阶段 | 不采用 |
| 先保留 failure evidence，再只回退当前 boundary 的错误实现 | 便于复盘和重验 | 需要严格记录 | 采用 |
| 外部仓不可用一律阻塞 | 谨慎 | 会把非 P0 运行期协作变成 P0 阻塞 | 不采用 |
| 编译期 core 阻塞，运行期协作使用受控替身 | 符合依赖裁剪和 P0 范围 | 必须严禁 fake-as-production | 采用 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| `BLK-CONV-001` design commit 未固定 | 暂停实现交接 | design repo 负责人 | 当前 design status、缺失 commit 说明 | design repo 提交完成并给实现 agent 完整 hash |
| `BLK-CONV-002` `core-contracts` 不可读、不可编译或类型不匹配 | 暂停当前 boundary | 实现 agent 记录，design / core 负责人修正 | `cargo check` 失败日志、core path、core commit | core 修复或设计改为不依赖该类型；重跑 `cargo check` |
| `BLK-CONV-003` 字段 / DTO / 状态 / flow / AC 无法 1:1 落码 | 暂停当前 boundary，回写 design repo | 实现 agent 提 blocker，design repo 修正 | 冲突文件、行号、影响 phase / commit、建议口径 | `03/05/06` 和 calibration 收敛并提交新 baseline |
| phase boundary 越界，需要后续 PH 对象 / port / 证据才能实现当前 boundary | 暂停当前 boundary，回写实施计划或详细设计 | 实现 agent 提 blocker，design repo 修正 | 当前 boundary、被提前依赖的后续对象、影响测试 | 设计明确前移对象或调整 commit boundary，并提交 |
| 目录、crate、package、binary 命名偏离规范 | 暂停当前 boundary | 实现 agent | workspace tree、Cargo metadata、命名 diff | 目录与命名修正后重跑命名检查和 `cargo check` |
| P0-blocking TC、release redline、VETO、redaction 或 EV 缺失 | 暂停进入下一阶段 | 实现 agent | failure artifact、suite output、redaction report、EV index | 修复、重跑直接 TC / 同组 TC / 相关 suite，重新生成 evidence |
| fake / controlled seam 被写成 production success | 暂停 PH-05~PH-08 或 acceptance | 实现 agent / 验收审查者 | config、report、handoff、fake marker diff | 修正 marker 和报告，必要时回写验收风险，重跑 PH-08 |
| artifact / report path 出现 `<project>` 层级或 `latest` | 暂停当前 script / report boundary | 实现 agent | 错误路径树、script 参数、report 输出 | 修正为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 并重跑 |

### 7.2 回退规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary 未提交且实现方向错误 | 清理或重写当前 boundary 的局部改动 | 实现 agent | 失败测试、diff 摘要、错误原因 | 当前 boundary 重新通过开工前复核和本 boundary 门禁 |
| 当前 boundary 已提交但未通过提交前门禁 | 通过新修复提交或按用户要求 amend 当前 boundary | 实现 agent | 原 commit hash、失败 gate、修复说明 | 修复后同 boundary 门禁通过，commit message 仍对应同一 boundary |
| 脚本 / report generator 输出路径错误 | 回退或修复脚本到当前 boundary 内 | 实现 agent | 错误 artifact tree、report diff | path check、report generation、redaction check 通过 |
| fake adapter 语义错误但未影响已验证 truth 阶段 | 回退 fake adapter 当前批次 | 实现 agent | failure fixture、adapter diff | fake marker、failure semantics、相关 TC 通过 |
| 已验证早期 PH 与当前 PH 发生证据冲突 | 不回退早期 PH；暂停并诊断当前 PH 或设计真相源 | 实现 agent / design repo | 两阶段 EV、冲突说明 | 确认是当前实现错误则修复当前 PH；若是设计冲突则回写 design |
| VETO / redaction / source truth violation 影响已提交证据 | 不做风险接受；修复泄漏源并重新生成受影响证据 | 实现 agent | 泄漏样本、安全处置记录、受影响报告列表 | redaction clean，受影响 TC / EV / report 全部重跑 |

### 7.3 变更控制表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 详细设计对象契约缺字段或字段来源不闭合 | 更新 `03-详细设计.md` 和对应 `design-calibration/03_*` | design repo 负责人 | blocker 说明、修正 diff、新旧口径对比 | design commit 固定，实现 agent 重读 Step 3 必读清单 |
| 测试方案和详细设计状态名 / 期望结果冲突 | 更新 `05-测试方案.md`，必要时同步 `03` 和 `06` | design repo 负责人 | 冲突 TC、状态矩阵、验收 AC | 新 baseline 提交，相关测试切口重新映射到 phase |
| 验收 AC / VETO 与实现范围冲突 | 更新 `06-验收标准.md` 或回写范围文档 | design repo 负责人 / 用户确认 | AC、VETO、风险接受说明 | 新 baseline 提交，Step 7 / Step 9 必要时重校准 |
| P1 / P2 能力被要求进入 P0 | 不在实现仓临时加；回到 `00~07` 重排范围和计划 | 用户 / design repo 负责人 | 用户决策、影响 phase、影响 commit boundary | 新 P0 范围、测试、验收和实施计划全部重写相关 Step |
| 上游 core contract 发生 breaking change | 暂停依赖当前 core 类型的 boundary，评估设计同步 | core / design / implementation | core commit、breaking diff、受影响 DTO | design 同步并提交，implementation 更新 path dependency 后重跑 |
| 报告 / artifact 规范变化 | 更新 standards、`05`、`06` 和 Step 7 / 8 / 10 中间产物 | design repo 负责人 | standards diff、旧路径影响列表 | 所有关联文档口径一致，script path check 通过 |

### 7.4 恢复条件表

| 暂停来源 | 恢复前必须完成 | 恢复后第一步 |
|---|---|---|
| design baseline 未固定 | design repo 提交固定 hash | 实现 agent 重新读取 `00~07` 和对应 calibration |
| 字段 / DTO / 状态 / phase boundary 冲突 | 上游正式文档和 calibration 同步修正并提交 | 重跑当前 boundary 开工前设计闭环复核矩阵 |
| core contracts 不可用 | core repo 修复或设计移除该编译期依赖 | 重跑 `cargo check` 和 affected contract tests |
| P0 TC / suite failure | 修复当前 boundary，保留 failure artifact | 重跑直接 TC、同组 TC、相关 suite |
| redaction / forbidden body failure | 修复泄漏源，清理或重生成受影响 artifact / report | 重跑 redaction、直接 TC 和 release redline |
| artifact / report path failure | 修复 script、config 或 output root | 重跑 path check、report generator 和 evidence index |
| fake-as-production | 修正 config marker、report wording 和 acceptance handoff | 重跑相关 fake seam TC 和 PH-08 handoff check |

### 7.5 证据保留规则

| 证据类型 | 保留方式 | 用途 |
|---|---|---|
| blocker 记录 | 写明 trigger、phase、commit boundary、冲突文件 / 行号、影响范围 | 交给 design repo 修正文档 |
| failure artifact | 保留在当前 `artifacts/test/<run_id>/<suite>`，不得改成 `latest` | 支持复验和 report failure summary |
| report failure | 生成或保留 `reports/runs/<run_id>/gate-results.md` / failure summary | 说明为何未进入下一阶段 |
| design fix baseline | 提供完整 design commit hash | 实现 agent 恢复前的真相源锚点 |
| rerun evidence | 新 run id 或明确 rerun marker，更新 evidence index | 证明恢复后已复验 |
| risk acceptance | 仅用于 S2/S3、P1/P2 非范围缺口 | 不得用于 VETO、S0/S1、redaction、P0 evidence 缺失 |

### 7.6 与提交边界的关系

| 规则 | 说明 |
|---|---|
| 一个暂停点必须归属到一个 commit boundary | 例如 `commit-05-b` consumer schema 冲突，不能泛称“PH-05 有问题”。 |
| 回退只针对当前未验证 boundary | 早期已验证提交和证据不是当前问题的默认回退对象。 |
| 变更后必须重新执行受影响 boundary 的开工前复核 | 新 design baseline 不自动代表实现可继续。 |
| 提交前门禁失败不能通过拆小提交绕过 | 拆分只能用于代码批次和 review，不能绕过同一功能边界的验证。 |
| 证据提交必须对应固定 implementation commit 和 run id | PH-08 的 reports / acceptance 不得引用浮动工作树或 `latest`。 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §10。正式文档生成时应从本文件摘录，不重新发明暂停或回退规则。

````markdown
## 10. 回退、暂停与变更控制

> 校准来源：
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“恢复条件表”“证据保留规则”和“与提交边界的关系”小节，了解实现 agent 遇到设计缺口、门禁失败、依赖不可用或验收冲突时应如何停手、回写和恢复。

正式 §10 应摘录：

1. §7.1 暂停规则表。
2. §7.2 回退规则表。
3. §7.3 变更控制表。
4. §7.4 恢复条件表。
5. §7.5 证据保留规则。
6. §7.6 与提交边界的关系。

正式 §10 必须明确：字段 / DTO / 状态 / flow / AC / phase boundary 冲突时，实施者必须暂停并回写 design repo，不得在实现仓临时补设计。回退只能保护和修正当前未验证 boundary，不得破坏已验证阶段。
````

## 9. 本步待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| design 冲突修复后是否自动继续实现 | A: 自动继续；B: 先重新执行当前 boundary 开工前复核 | 推荐 B | design commit 只是新真相源，仍需确认字段、DTO、状态、证据和 phase boundary 已闭环 |
| 当前 boundary 已提交但 gate 失败时如何处理 | A: 总是回退提交；B: 按用户要求 amend 或追加同 boundary 修复提交 | 推荐 B | 有时保留失败提交再修复更利于审查；但最终交付时仍需整理为合规 boundary |
| 运行期依赖缺失是否阻断 PH-05~PH-07 | A: 全部阻断；B: P0 使用 fake / controlled seam，真实外部服务进入风险 | 推荐 B | P0 裁决 conversation truth center 和接缝语义，不裁决真实跨仓生产集成 |

建议接受上述推荐。它们延续 Step 6~9 的结论，确保实现时不会自行补设计，也不会把非 P0 真实外部服务缺失误当成 P0 blocker。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 暂停规则已覆盖 design baseline、core dependency、字段 / DTO / 状态、phase boundary、P0 gate、redaction、path 和 fake-as-production | 已满足 |
| 回退规则已明确只保护和修正当前未验证 boundary | 已满足 |
| 变更控制已明确哪些情况必须回写 `03/05/06` 或重新校准 | 已满足 |
| 恢复条件已绑定新 design baseline、开工前复核、重跑门禁和证据重生成 | 已满足 |
| 规则与 Step 6 提交边界、Step 7 门禁、Step 8 依赖、Step 9 blocker 一致 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 10 可以进入 Step 11。Step 11 应继续严格单 Step 执行，专门定义提交、评审与交付纪律，不重写暂停、回退和变更控制规则。
