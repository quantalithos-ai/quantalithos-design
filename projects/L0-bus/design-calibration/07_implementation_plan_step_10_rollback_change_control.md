# L0-bus 07 实施计划 Step 10: 回退、暂停与变更控制

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 10 中间产物。
> 本步定义实施过程中遇到设计缺口、门禁失败、外部依赖不可用、提交边界失控或范围变化时如何暂停、回退、变更和恢复。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义回退、暂停与变更控制 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §10 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 16 个 commit boundary、可独立 review / 验证 / 回退的约束 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段门禁、失败处理、VETO 前置规避和证据路径 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承配置、环境、外部依赖和 fake / in-memory 边界 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、风险、待确认事项、上游回写触发条件和 blocker 分类 |
| `05-测试方案.md` §10~§14 | 已完成 | 提取缺陷分级、回归触发、证据归档和残余风险处理 |
| `06-验收标准.md` §11~§15 | 已完成 | 提取 S0 / S1 / S2、VETO、风险接受、签署和不通过口径 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些情况必须暂停当前阶段 | VETO 命中、S0 / S1 缺陷、P0 / P0-min 门禁失败、redaction 命中、`core-contracts` 不可编译、实现偏离 `03`、配置红线失效、证据路径非法、commit boundary 混乱、目标仓不在 `/home/aris/Projects/quantalithos-bus`。 |
| 2. 哪些情况允许回退到上一个提交边界 | 当前 boundary 无法在合理修复后通过门禁、实现方向违反阶段目标、提交混入无关改动、或局部修复会破坏已验证边界时,允许回退当前未验证 boundary。已验证的前序 boundary 优先保护。 |
| 3. 哪些情况必须回写详细设计或测试方案 | core contracts 与设计不一致、配置 schema 不能支持 runtime graph、redaction 覆盖范围不足、production adapter 被迫进入 P0、replay / DLQ / approval ref 语义无法实现、artifact / report 规则与 standards 冲突。 |
| 4. 门禁失败后如何处理 | 保留失败 artifact / report / log,分级为 S0 / S1 / S2 / S3,阻断或允许条件推进按 `05` / `06` 执行。S0、S1、VETO 不得风险接受。 |
| 5. 外部依赖不可用时是否允许继续局部实施 | `core-contracts` 不可用不允许继续编译期实施;真实 MQ / durable store / publisher / SDK / observability / governance 不可用时允许继续 fake / in-memory P0 路径;report / redaction 工具不可用会阻断对应阶段。 |
| 6. 恢复实施的条件是什么 | 缺陷已修复或上游已回写,受影响 suite / redaction / path / link check 已重跑,证据已固定到 `<run_id>`,commit boundary 恢复清晰,无未处理 S0 / S1 / VETO。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 门禁失败处理分散 | Step 7、`05`、`06` 都有失败口径 | 实施者可能继续推进失败阶段 | 汇总暂停规则 |
| 回退粒度需要绑定 commit boundary | Step 6 定义了 boundary,但未写失败时怎么保护前序成果 | 可能用大回滚破坏已验证阶段 | 定义只回退当前未验证 boundary |
| 上游回写触发条件需要落入变更控制 | Step 9 已列触发条件 | 实施中可能直接改代码绕过设计 | 本步定义 change request 路径 |
| 外部依赖不可用容易误判 | 有些依赖硬阻塞,有些可 fake | 可能错误暂停或错误继续 | 定义依赖失败处理表 |
| 证据保留规则需要明确 | 失败 run 也有价值 | 回退时可能删除失败证据 | 要求保留失败证据和整改记录 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 暂停规则 | 分散在测试和验收文档 | 阶段暂停触发表 | 实施者知道何时必须停 |
| 回退规则 | 只知道 commit boundary 可回退 | 明确只回退当前未验证 boundary,保护已验证阶段 | 降低破坏范围 |
| 变更控制 | Step 9 有回写触发 | 形成设计回写和恢复流程 | 防止实现与文档分叉 |
| 失败证据 | 只在测试方案中要求 | 明确失败也要保留 artifact / report | 支撑复盘和复验 |
| 外部依赖 | Step 8 列依赖 | 定义不可用时 pause / continue / substitute | 避免临场判断 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 门禁失败后继续做后续阶段 | 看似不阻塞速度 | 会污染后续证据,最终返工更大 | 不采用 |
| P0 / P0-min 门禁失败即暂停当前阶段 | 证据链干净 | 需要及时修复 | 采用 |
| 用大回退回到很早阶段 | 简单粗暴 | 破坏已验证成果和证据链 | 不采用 |
| 只回退当前未验证 commit boundary | 保护已验证阶段 | 需要 boundary 足够清晰 | 采用 |
| 设计偏离时直接在代码里调整 | 快 | 文档与实现分叉,后续 agent 无法 1:1 复现 | 不采用 |
| 设计偏离先回写上游再恢复实现 | 可审计、可复现 | 多一个文档同步动作 | 采用 |
| 失败证据删除后重跑 | 报告更干净 | 失去故障定位和复验依据 | 不采用 |
| 失败证据保留,新 run 证明修复 | 可审计 | artifact 数量增加 | 采用 |

---

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| `core-contracts` path dependency 不存在、不可编译或 API 与设计不一致 | pause + change | 实施者 / 设计维护者 | dependency snapshot、compile error、diff 说明 | 依赖恢复或 `03` / `02` 已回写并通过 compile smoke |
| 目标代码写入 design 仓或非 `/home/aris/Projects/quantalithos-bus` | pause + rollback | 实施者 | git diff、错误路径清单 | 错误改动移除或转移,目标仓创建并重新执行 PH-01 |
| P0 / P0-min 阶段门禁失败 | pause | 实施者 / 测试负责人 | suite artifact、stdout / stderr、failure reason、report 草稿 | 缺陷修复,受影响 suite 和最小回归通过 |
| VETO-BUS 命中 | pause + rollback 或 change | 实施者 / 验收负责人 | VETO checklist、redaction / evidence 报告、失败 run | 修复或回写设计后重跑 release / affected gate,VETO 解除 |
| redaction 命中 forbidden body / raw secret | pause + rollback 或 fix | 实施者 / 安全审查人 | redaction report、命中位置、受影响 artifact / report | 泄漏源修复,redaction + 受影响 suite 重跑通过 |
| source ack / duplicate 破坏幂等 | pause | 实施者 | duplicate / replay artifact、source fixture、state diff | PH-04 幂等测试和 ack failure replay 通过 |
| feedback / timeout / retry / DLQ 并发出现双终态或孤儿事实 | pause | 实施者 | 并发测试 artifact、history / audit 输出 | 并发冲突按 expected conflict 表达,无孤儿事实 |
| Query / projection / tap 反写 truth | pause + rollback | 实施者 | Query no-write 测试失败证据、UoW 调用记录 | Query no-write 测试和 projection stale 测试通过 |
| artifact / report 路径带 `<project>` 层或正式引用 `latest` | pause | 实施者 / 测试负责人 | path check 报告、错误路径列表 | 路径修正,link check 和 no-latest check 通过 |
| commit boundary 混入无关改动 | pause + rollback 或 split | 实施者 / reviewer | git diff、commit plan diff | boundary 重新整理,门禁重跑,commit message 合规 |

### 7.2 回退规则表

| 场景 | 回退范围 | 允许动作 | 禁止动作 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary 尚未提交且门禁失败 | 当前 working diff | 修改实现或手动撤销当前 boundary 的未验证改动 | 破坏前一已验证 boundary;删除失败证据 | 当前 boundary 重新通过门禁 |
| 当前 boundary 已提交但未通过 review / gate | 当前 commit boundary | 新提交修复或对当前 boundary 做受控 revert,保留失败证据 | 用大范围 reset 破坏历史;混入下一阶段功能 | 修复提交或重做 boundary 后门禁通过 |
| 已验证 boundary 后发现局部缺陷 | 最小受影响 boundary | 新增修复 boundary 或在当前阶段内修复并重跑回归 | 直接改写已交付证据结论 | 缺陷复验和最小回归通过 |
| VETO 或 S0 命中 | 命中源所在 boundary 及其受影响下游 | 回退命中源或重做实现;必要时回写设计 | 风险接受;继续推进后续阶段 | VETO / S0 解除,全量受影响门禁通过 |
| 上游设计必须变更 | 当前阶段暂停 | 回写 `00~06` 对应文档,再更新实施计划受影响章节 | 代码先行绕过设计 | 上游文档和中间产物更新完成,重新确认影响范围 |
| 外部依赖临时不可用但 P0 有 fake 路径 | 不回退 | 切到 fake / in-memory 默认路径并记录风险 | 把真实依赖失败写成 P0 失败 | fake 路径门禁通过,真实依赖记录为 P1 / P2 风险 |

### 7.3 变更控制表

| 变更类型 | 触发条件 | 动作 | 必须更新 | 恢复条件 |
|---|---|---|---|---|
| 设计契约变更 | struct、enum、trait、API、event、job、状态机或事务语义与 `03` 不一致 | pause + change request | `03-详细设计.md`,必要时 `02-概要设计.md` | 设计回写后重跑受影响测试 |
| 配置语义变更 | JSON profile、secret ref、runtime graph、fail-fast / fail-closed 与 `04` 不一致 | pause + change request | `04-配置设计.md`,必要时 `03` §13 | config smoke 和相关 gate 通过 |
| 测试门禁变更 | 新增或删除 P0 gate、redaction 范围、artifact / report 结构 | pause + change request | `05-测试方案.md`、`06-验收标准.md` | 测试方案和验收标准同步后执行 |
| 验收红线变更 | VETO、S0 / S1、风险接受口径变化 | pause + change request | `06-验收标准.md` | 验收门禁重新确认 |
| 范围变更 | production adapter、SDK high-level client、dashboard、config center 等 P1 / P2 能力进入 P0 | pause + scope review | `00-需求文档.md`、`01-架构设计.md`、`03-详细设计.md` | 范围重新确认后重排阶段 |
| 依赖方式变更 | 从本地 path dependency 改为 Git / registry,或新增编译期依赖 | pause + dependency review | `03-详细设计.md`、`07-实施计划.md` §8 | dependency snapshot 和 compile smoke 通过 |

### 7.4 门禁失败处理表

| 失败类型 | 分级 | 动作 | 是否可风险接受 | 复验要求 |
|---|---|---|---|---|
| P0 主闭环失败 | S0 / VETO | pause + fix 或 rollback | 否 | 受影响 suite + release gate |
| forbidden body / raw secret 泄漏 | S0 / VETO | pause + fix 或 rollback | 否 | redaction + 受影响 suite + report scan |
| Query 写 truth | S0 / VETO | pause + rollback | 否 | Query no-write + projection tests |
| replay 绕过 audit chain / approval ref | S0 / VETO | pause + fix 或 rollback | 否 | recovery suite + VETO check |
| S1 功能缺陷 | S1 | pause + fix | 否 | 受影响 suite + 最小回归 |
| S2 非主链质量问题 | S2 | 可继续或有条件通过输入 | 是,但必须有 owner、deadline、retest plan | 对应 suite 或 report check |
| report 字段小缺陷 | S2 / S3 | 修复或风险接受 | 可接受,不得影响 evidence chain | report link check |
| 脚本易用性问题 | S3 | 记录并修复 | 可接受 | script smoke |

### 7.5 外部依赖不可用处理表

| 依赖 | 不可用时动作 | 是否允许继续 | 恢复条件 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-core/crates/contracts` | pause | 否 | path 恢复、package / lib name 确认、compile smoke 通过 |
| `/home/aris/Projects/quantalithos-bus` | PH-01 创建 | 允许继续文档,不允许开始业务编码 | 目标仓存在且 workspace 初始化完成 |
| 真实 MQ / transport backend | 使用 fake backend | 是 | P0 fake backend 门禁通过;真实 backend 后置 |
| durable store | 使用 in-memory store | 是 | in-memory store 与 port 语义通过;durable store 后置 |
| outbound publisher | 使用 in-memory sink | 是 | schema / publish failure evidence 通过 |
| governance / observability / SDK | 使用 ref、projection、fake consumer 或 report evidence | 是 | P0 输出可消费且无 forbidden body |
| redaction / path / report scripts | pause 当前阶段 | 否 | 脚本恢复,对应 check 通过 |

### 7.6 恢复实施检查清单

| 检查项 | 要求 |
|---|---|
| 缺陷状态 | S0 / S1 / VETO 均已关闭或对应阶段判定不通过 |
| 上游文档 | 需要回写的 `00~06` 已更新,并明确影响范围 |
| 测试证据 | 失败 run 保留,修复 run 使用新的固定 `<run_id>` |
| 回归范围 | 受影响 suite、redaction、path、link 和最小回归已重跑 |
| 提交边界 | 当前改动重新落回一个 §6 commit boundary |
| 证据链接 | report 能回链 artifact,无 `latest`,无 `<project>` 层级 |
| 范围控制 | P1 / P2 能力未污染 P0 完成结论 |
| 风险接受 | 仅 S2 / S3 / P1-risk 可接受,且 owner、deadline、retest plan 完整 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §10。

```markdown
## 10. 回退、暂停与变更控制

> 校准来源：
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“门禁失败处理表”“外部依赖不可用处理表”和“恢复实施检查清单”小节,了解实施中何时必须停下、回退或回写上游设计。

实施过程中优先保护已验证阶段和已验证 commit boundary。P0 / P0-min 门禁失败、VETO 命中、S0 / S1 缺陷、redaction 命中、`core-contracts` 不可编译、Query 写 truth、replay 绕过材料链、证据路径非法或设计契约偏离时,必须暂停当前阶段。

正式内容从 `design-calibration/07_implementation_plan_step_10_rollback_change_control.md` §7.1~§7.6 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 是否允许 S0 / VETO 风险接受 | 不允许 | 影响最终验收 | 保持 `06` 口径 |
| 是否允许回退已验证前序 boundary | 默认不允许 | 保护证据链 | 只在上游设计整体变更时重新评估 |
| 是否删除失败 artifact / report | 不删除 | 支撑复验和审计 | 新 run 证明修复 |
| 真实外部依赖不可用时是否暂停 P0 | 不暂停,除 `core-contracts` 和证据工具外 | 保持 fake / in-memory 默认路径 | 真实依赖记录为 P1 / P2 风险 |

建议方案: 接受当前回退、暂停与变更控制规则。原因是它保护已验证边界,又能在设计偏离、门禁失败和依赖不可用时给出明确动作。

---

## 10. 进入下一步条件

- 暂停、回退、变更和恢复条件明确。
- 规则与 Step 6 commit boundary、Step 7 gate、Step 8 dependency、Step 9 risk 一致。
- P0 / P0-min、S0 / S1、VETO 和 redaction 的处理口径不冲突。
- 可以进入 Step 11,继续定义提交、评审与交付纪律。
