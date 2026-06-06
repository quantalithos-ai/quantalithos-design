# L1-process 07 实施计划 Step 10: 回退、暂停与变更控制

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §10 回退、暂停与变更控制
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 回退、暂停与变更控制 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_10_rollback_change_control.md` |

本步定义实施过程中什么时候暂停、什么时候回退、什么时候回写设计、什么时候恢复。本步不改变阶段和 commit boundary。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些情况必须暂停 | 设计真相源不闭合、core contracts 不可用、phase boundary 越界、P0 / VF / redaction / evidence blocker、fake-as-production、dependency 红线失败。 |
| 哪些情况允许回退 | 当前未验证 boundary 的局部错误、脚本路径错误、fake adapter 语义错误或未提交试探性实现可回退或重写。 |
| 哪些情况必须回写设计 | 字段缺失、DTO 构造不完整、状态 / flow / AC 冲突、P1/P2 被要求进入 P0、测试与详细设计口径冲突。 |
| 门禁失败后如何处理 | 保留 failure artifact,修复当前 boundary,重跑直接 TC、同组 TC、相关 suite 和必要 report。 |
| 外部依赖不可用如何处理 | `core-contracts` 不可用阻塞;运行期 / 事件协作依赖可用 fake / controlled seam,但不能伪装 production success。 |
| 恢复条件是什么 | 新 design baseline 或实现修复完成;当前 boundary 开工前复核重过;相关门禁和证据重跑通过。 |

## 3. 结构化中间产物

### 3.1 暂停规则表

| 触发条件 | 动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| design baseline 未固定 | 暂停实现交接 | design status、缺失 hash 说明 | design repo 提交并给出完整 hash |
| `core-contracts` 不可读 / 不可编译 | 暂停当前 boundary | `cargo check` 失败日志、core path | core 修复或设计改口径;重跑 `cargo check` |
| 字段 / DTO / 状态 / flow / AC 无法 1:1 落码 | 暂停当前 boundary,回写 design repo | 冲突文件、行号、影响 phase / commit、建议口径 | `03/05/06/07` 和 calibration 收敛并提交 |
| phase boundary 依赖后续对象 / result / evidence | 暂停当前 boundary | 当前 boundary、被提前依赖的对象、影响测试 | 设计前移对象或调整 boundary |
| P0 TC、redaction、VF、EV 或 path check 失败 | 暂停进入下一阶段 | failure artifact、redaction report、gate output | 修复并重跑相关 TC / suite / report |
| fake / controlled seam 被标记为 production success | 暂停 PH-07~PH-10 | config、report、fake marker diff | 修正 marker、report 和 acceptance handoff |
| 非 core sibling path dependency 出现 | 暂停当前 dependency boundary | Cargo diff、dependency graph | 移除依赖,改为 port / adapter / event seam |

### 3.2 回退规则表

| 触发条件 | 动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| 当前 boundary 未提交且方向错误 | 清理或重写当前 boundary 局部改动 | diff 摘要、失败测试 | 当前 boundary 重新通过复核和门禁 |
| 当前 boundary 已提交但门禁漏跑或失败 | 按用户要求 amend 或追加同 boundary 修复提交 | 原 commit、失败 gate、修复说明 | 同 boundary 门禁通过 |
| 脚本 / report path 错误 | 修复或回退当前脚本批次 | 错误路径树、script 参数 | path check、report generation、redaction 通过 |
| fake adapter failure semantics 错误 | 回退或修复 adapter 当前批次 | failure fixture、adapter diff | fake marker 和相关 TC 通过 |
| 已验证早期 phase 与当前 phase 冲突 | 不默认回退早期 phase;先诊断当前 phase 或设计真相源 | 两阶段 EV、冲突说明 | 当前实现修复或 design 回写后重验 |

### 3.3 变更控制表

| 触发条件 | 动作 | 恢复条件 |
|---|---|---|
| 详细设计对象 / DTO / state 缺口 | 更新 `03-详细设计.md` 和对应 calibration | 新 design commit 固定,实现 agent 重读 |
| 测试方案与详细设计冲突 | 更新 `05-测试方案.md`,必要时同步 `03/06/07` | TC / EV / phase 门禁重新映射 |
| 验收 AC / VF 与范围冲突 | 更新 `06-验收标准.md` 或回写范围文档 | AC / VF / risk acceptance 一致 |
| P1 / P2 被要求进入 P0 | 回到 `00~07` 重排范围、测试和实施计划 | 新 P0 范围全部收敛 |
| core contracts breaking change | 暂停受影响 boundary,评估 design 同步 | core / design / implementation 新 baseline 一致 |
| artifact / report 规范变化 | 更新 standards、`05/06/07` 和 scripts | path check / report tests 通过 |

### 3.4 恢复条件表

| 暂停来源 | 恢复前必须完成 | 恢复后第一步 |
|---|---|---|
| design baseline 未固定 | design repo 提交固定 hash | 实现 agent 重新读取 `00~07` 和对应 calibration |
| 字段 / DTO / 状态 / boundary 冲突 | 正式文档和 calibration 同步修正 | 重跑当前 boundary 开工前复核 |
| core contracts 不可用 | core 修复或设计移除依赖 | 重跑 `cargo check` 和 affected contract tests |
| P0 TC / suite failure | 修复当前 boundary | 重跑直接 TC、同组 TC、相关 suite |
| redaction / forbidden body failure | 修复泄漏源,重生成受影响 artifact / report | 重跑 redaction 和直接 TC |
| path / evidence failure | 修复 script、config 或 output root | 重跑 path check、report generator、evidence index |

### 3.5 证据保留规则

| 证据类型 | 保留方式 | 用途 |
|---|---|---|
| blocker 记录 | trigger、phase、commit boundary、冲突文件 / 行号、影响范围 | 交给 design repo 修正 |
| failure artifact | 保留在 `artifacts/test/<run_id>` 的 run-scoped 路径 | 支持复验和 failure summary |
| report failure | 生成或保留 `reports/runs/<run_id>/gate-results.md` | 说明未进入下一阶段原因 |
| design fix baseline | 提供完整 design commit hash | 恢复前真相源锚点 |
| rerun evidence | 新 run id 或明确 rerun marker | 证明恢复后已复验 |
| risk acceptance | 仅用于 S2/S3、P1/P2 非范围缺口 | 不得覆盖 VF、S0/S1、redaction、P0 EV 缺失 |

## 4. 回填草稿

```markdown
## 10. 回退、暂停与变更控制

> 校准来源:
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“恢复条件表”和“证据保留规则”小节。

字段、DTO、状态、flow、AC 或 phase boundary 冲突时,实现者必须暂停并回写 design repo。回退只用于修正当前未验证 boundary,不得破坏已验证阶段和证据。
```

## 5. 进入下一步条件

- 暂停、回退、变更、恢复和证据保留规则已闭合。
- 后续 Step 11 可以定义提交、评审与交付纪律。
