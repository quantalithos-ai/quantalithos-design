# L0-sdk 07 实施计划 Step 10: 回退、暂停与变更控制

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 10 中间产物。
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
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 13 个 commit boundary、代码批次、开工前设计闭环复核矩阵 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段门禁、失败处理、VETO-SDK 前置规避和证据归档规则 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承配置、环境、外部依赖、fake / fixture 和 Cargo path dependency 边界 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、风险、待确认事项、上游回写触发条件和 blocker 分类 |
| `05-测试方案.md` §11~§14 | 已完成 | 提取缺陷分级、复验、退出准则和回归触发 |
| `06-验收标准.md` §11~§14 | 已完成 | 提取 VETO、S0 / S1 / S2 / S3、风险接受和最终裁决口径 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些情况必须暂停当前阶段 | 目标仓未完成 PH-01 初始化、`core-contracts` / `bus-contracts` 不可编译、字段缺失、状态冲突、DTO 构造不完整、phase boundary 越界、P0 gate 失败、VETO-SDK 命中、S0 / S1 缺陷、redaction 命中、fake-only success 支撑 stable、三语言语义漂移、证据路径非法或正式引用 `latest` 时必须暂停。 |
| 2. 哪些情况允许回退到上一个提交边界 | 当前 boundary 无法在局部修复后通过门禁、混入无关改动、实现方向违反阶段目标、或修复会破坏已验证前序 boundary 时,允许回退当前未验证 boundary。已验证的前序 boundary 默认保护。 |
| 3. 哪些情况必须回写详细设计或测试方案 | core / bus contracts 与设计不一致、DTO 字段无法构造对象、状态 enum 与测试 / 验收冲突、config schema 不能表达安全红线、redaction 覆盖不足、evidence 路径规则冲突、或 production / registry 被迫进入 P0 时,必须回写上游文档。 |
| 4. 门禁失败后如何处理 | 保留失败 artifact、report、stdout / stderr、failure reason 和影响分析;按 S0 / S1 / S2 / S3 分级;S0、S1、VETO 不得风险接受;修复后用新的 fixed `run_id` 重跑受影响 suite 和最小回归。 |
| 5. 外部依赖不可用时是否允许继续局部实施 | 编译期 `core-contracts` / `bus-contracts` 不可用不允许继续相关实现;Python / TypeScript 不可用会阻断 PH-04 / PH-05;formal API、bus runtime、public registry、real credential provider 不可用时允许继续 fake / fixture / local candidate 路径。 |
| 6. 恢复实施的条件是什么 | 上游已回写或缺陷已修复,受影响测试、redaction、path、link、candidate、smoke 或 compatibility gate 已重跑,证据固定到新的 `run_id`,commit boundary 恢复清晰,无未关闭 S0 / S1 / VETO。 |
| 7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理 | 暂停当前 boundary,记录 blocker,回到 `03` / `05` / `06` 或对应中间产物统一真相源。不得由实现者在代码里临时补字段、改状态或扩大 phase scope。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 门禁失败处理分散 | Step 7、`05`、`06` 都有失败口径 | 实施者可能继续推进失败阶段 | 汇总暂停规则和门禁失败处理表 |
| 回退粒度需要绑定 commit boundary | Step 6 定义了 boundary,但未写失败时如何保护前序成果 | 可能大范围回退或破坏已验证阶段 | 定义只回退当前未验证 boundary |
| 设计真相源冲突需要明确处理 | Step 9 已列上游回写触发条件 | 实现者可能自行选边 | 本步定义 change request 路径 |
| 外部依赖不可用容易误判 | contracts 是硬依赖,formal API / registry 等不是 P0 硬依赖 | 可能错误暂停或错误继续 | 定义依赖失败处理表 |
| 失败证据容易被覆盖 | 修复后可能只保留成功 run | 无法复验或审计失败原因 | 要求失败 run 保留,修复 run 使用新 `run_id` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 暂停规则 | 分散在测试、验收和风险表中 | 形成阶段暂停触发表 | 实施者知道何时必须停 |
| 回退规则 | 只知道 commit boundary 可回退 | 明确只回退当前未验证 boundary,保护已验证阶段 | 降低破坏范围 |
| 变更控制 | Step 9 有回写触发条件 | 形成设计回写和恢复流程 | 防止实现与文档分叉 |
| 失败证据 | 只在测试方案中要求 | 明确失败也要保留 artifact / report | 支撑复验和审计 |
| 外部依赖 | Step 8 列依赖 | 定义不可用时 pause / continue / substitute | 避免临场判断 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 门禁失败后继续做后续阶段 | 表面推进快 | 污染后续证据,最终返工更大 | 不采用 |
| P0 gate、S0 / S1、VETO 失败即暂停当前阶段 | 证据链干净 | 需要及时修复 | 采用 |
| 用大回退回到很早阶段 | 简单粗暴 | 破坏已验证成果和证据链 | 不采用 |
| 只回退当前未验证 commit boundary | 保护已验证阶段 | 要求 boundary 清晰 | 采用 |
| 设计偏离时直接在代码里调整 | 快 | 文档与实现分叉,后续 agent 无法 1:1 复现 | 不采用 |
| 设计偏离先回写上游再恢复实现 | 可审计、可复现 | 多一个文档同步动作 | 采用 |
| 失败证据删除后重跑 | 报告更干净 | 失去故障定位和复验依据 | 不采用 |
| 失败证据保留,新 run 证明修复 | 可审计 | artifact 数量增加 | 采用 |

---

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 目标仓不是 `/home/aris/Projects/quantalithos-sdk` 或源码写入 design 仓 | pause + rollback | 实施者 | git diff、错误路径清单 | 错误改动移除,目标仓路径确认,PH-01 重新执行 |
| 目标仓仅有 git shell 且 workspace 未初始化 | pause | 实施者 | repo snapshot、初始化缺口清单 | workspace、packages、scripts、artifacts、reports 和 git config 已补齐 |
| `core-contracts` / `bus-contracts` path dependency 不存在、不可编译或 API 与设计不一致 | pause + change | 实施者 / 设计维护者 | dependency snapshot、compile error、diff 说明 | 依赖恢复或 `03` / `02` 已回写并通过 compile smoke |
| 字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界 | pause + change | 实施者 / 设计维护者 | blocker note、相关 `03` / `05` / `06` 引用、失败 fixture | 真相源回写完成,受影响测试切口更新 |
| P0 gate、S0 / S1 缺陷或 VETO-SDK 命中 | pause + fix 或 rollback | 实施者 / 测试负责人 | suite artifact、report、failure reason、VETO checklist | 缺陷修复,受影响 suite、candidate / redaction / veto gate 重跑通过 |
| redaction 命中 raw secret、credential value、request / response / payload body | pause + rollback 或 fix | 实施者 / 安全审查人 | redaction report、命中位置、受影响 artifact / report | 泄漏源修复,redaction + 受影响 suite 重跑通过 |
| fake-only success 污染 production supported、Verified 或 Stable | pause + rollback | 实施者 / reviewer | fake marker evidence、candidate state diff、gate failure | fake marker 保留,stable gate negative tests 通过 |
| 三语言 package 缺失或 Rust / Python / TypeScript 语义漂移 | pause | 实施者 / SDK maintainer | language compare、smoke artifact、drift report | package surface 补齐,cross-language smoke 通过 |
| Query、projection rebuild 或 runtime boundary call 写 SDK truth | pause + rollback | 实施者 | no-write 测试失败、UoW 调用记录 | no-write、projection stale 和 boundary tests 通过 |
| artifact / report 路径带 `<project>` 层、跨 run 拼接或正式引用 `latest` | pause | 实施者 / 测试负责人 | path / link / no-latest check 报告 | 路径修正,link check 和 no-latest check 通过 |
| commit boundary 混入无关改动或出现中文源码注释 / 测试名 / commit message | pause + rollback 或 split | 实施者 / reviewer | git diff、commit message draft、语言检查结果 | boundary 重整,实现仓英文规则通过,门禁重跑 |

### 7.2 回退规则表

| 场景 | 回退范围 | 允许动作 | 禁止动作 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary 尚未提交且门禁失败 | 当前 working diff | 修改实现或手动撤销当前 boundary 的未验证改动 | 破坏前一已验证 boundary;删除失败证据 | 当前 boundary 重新通过门禁 |
| 当前 boundary 已提交但未通过 review / gate | 当前 commit boundary | 新提交修复或对当前 boundary 做受控 revert,保留失败证据 | 用大范围 reset 破坏历史;混入下一阶段功能 | 修复提交或重做 boundary 后门禁通过 |
| 已验证 boundary 后发现局部缺陷 | 最小受影响 boundary | 新增修复 boundary 或在当前阶段内修复并重跑回归 | 直接改写已交付证据结论 | 缺陷复验和最小回归通过 |
| VETO-SDK 或 S0 命中 | 命中源所在 boundary 及其受影响下游 | 回退命中源或重做实现;必要时回写设计 | 风险接受;继续推进后续阶段 | VETO / S0 解除,全量受影响门禁通过 |
| 上游设计必须变更 | 当前阶段暂停 | 回写 `00~06` 对应文档,再更新实施计划受影响章节 | 代码先行绕过设计 | 上游文档和中间产物更新完成,重新确认影响范围 |
| 外部依赖临时不可用但 P0 有 fake / fixture 路径 | 不回退 | 切到 fake / fixture 默认路径并记录风险 | 把真实依赖失败写成 P0 失败 | fake / fixture 路径门禁通过,真实依赖记录为 P1 / P2 风险 |

### 7.3 变更控制表

| 变更类型 | 触发条件 | 动作 | 必须更新 | 恢复条件 |
|---|---|---|---|---|
| 设计契约变更 | struct、enum、trait、API、event、job、状态机或事务语义与 `03` 不一致 | pause + change request | `03-详细设计.md`,必要时 `02-概要设计.md` | 设计回写后重跑受影响测试 |
| 配置语义变更 | JSON profile、secret ref、runtime graph、fail-fast / fail-closed 与 `04` 不一致 | pause + change request | `04-配置设计.md`,必要时 `03` §13 | config smoke 和相关 gate 通过 |
| 测试门禁变更 | 新增或删除 P0 gate、redaction 范围、artifact / report 结构 | pause + change request | `05-测试方案.md`、`06-验收标准.md` | 测试方案和验收标准同步后执行 |
| 验收红线变更 | VETO-SDK、S0 / S1、风险接受口径变化 | pause + change request | `06-验收标准.md` | 验收门禁重新确认 |
| 范围变更 | public registry、production endpoint、real credential provider、full service client coverage 等 P1 / P2 能力进入 P0 | pause + scope review | `00-需求文档.md`、`01-架构设计.md`、`03-详细设计.md` | 范围重新确认后重排阶段 |
| 依赖方式变更 | 从本地 path dependency 改为 Git / registry,或新增编译期依赖 | pause + dependency review | `03-详细设计.md`、`07-实施计划.md` §8 | dependency snapshot 和 compile smoke 通过 |

### 7.4 门禁失败处理表

| 失败类型 | 分级 | 动作 | 是否可风险接受 | 复验要求 |
|---|---|---|---|---|
| P0 主闭环失败 | S0 / S1 | pause + fix 或 rollback | 否 | 受影响 suite + PR / main / candidate gate |
| VETO-SDK 命中 | S0 / VETO | pause + fix 或 rollback | 否 | 关联用例、专项、candidate / redaction / veto gate |
| raw secret / body 泄漏 | S0 / VETO | pause + fix 或 rollback | 否 | redaction + 受影响 suite + report scan |
| fake-only success 支撑 Stable | S0 / VETO | pause + rollback | 否 | fake marker、candidate gate、boundary tests |
| Query / projection / runtime 写 truth | S0 / VETO | pause + rollback | 否 | no-write、projection、boundary tests |
| 三语言 smoke 漂移 | S0 / S1 | pause + fix | 否 | cross-language smoke + semantic compare |
| S1 功能缺陷 | S1 | pause + fix | 否 | 受影响 suite + 最小回归 |
| S2 非主链质量问题 | S2 | 可进入有条件通过输入 | 是,但必须有 owner、deadline、retest plan | 对应 suite 或 report check |
| S3 文档 / 报告展示问题 | S3 | 修复或记录后续 | 可接受 | report review 或抽样复验 |

### 7.5 外部依赖不可用处理表

| 依赖 | 不可用时动作 | 是否允许继续 | 恢复条件 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-core/crates/contracts` | pause | 否 | path 恢复、package / lib name 确认、compile smoke 通过 |
| `/home/aris/Projects/quantalithos-bus/crates/contracts` | pause | 否 | path 恢复、package / lib name 确认、compile smoke 通过 |
| `/home/aris/Projects/quantalithos-sdk` workspace | pause PH-01 | 否 | workspace、packages、scripts、artifacts、reports 初始化完成 |
| Rust toolchain | pause PH-01 | 否 | `rustc`、`cargo`、fmt / check / test 可运行 |
| Python / TypeScript toolchain | pause PH-04 / PH-05 或 Spike | 不允许通过三语言 P0 | toolchain 和 package / smoke 命令通过 |
| formal API service | 使用 fixture / fake boundary | 是 | P0 fake / fixture boundary evidence 通过 |
| bus runtime | 使用 fake bus boundary | 是 | event semantic mapping、pending / failed evidence 通过 |
| public package registry | 不作为 P0 前置 | 是 | local candidate 和 artifact metadata 通过 |
| real credential provider | 使用 credential ref-only 和 fake refs | 是 | raw secret 不进入 config / logs / reports |
| report / redaction / path check scripts | pause 当前阶段 | 否 | scripts 恢复,对应 check 通过 |

### 7.6 恢复实施检查清单

| 检查项 | 要求 |
|---|---|
| 缺陷状态 | S0 / S1 / VETO 均已关闭或对应阶段判定不通过 |
| 上游文档 | 需要回写的 `00~06` 已更新,并明确影响范围 |
| 测试证据 | 失败 run 保留,修复 run 使用新的固定 `run_id` |
| 回归范围 | 受影响 suite、redaction、path、link、candidate、smoke 和最小回归已重跑 |
| 提交边界 | 当前改动重新落回一个 §6 commit boundary |
| 证据链接 | report 能回链 artifact,无 `latest`,无 `<project>` 层级 |
| 范围控制 | P1 / P2 能力未污染 P0 完成结论 |
| 风险接受 | 仅 S2 / S3 / P1 / P2 risk 可接受,且 owner、deadline、retest plan 完整 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §10。

````markdown
## 10. 回退、暂停与变更控制

> 校准来源:
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“暂停规则表”“回退规则表”“变更控制表”“门禁失败处理表”“外部依赖不可用处理表”和“恢复实施检查清单”小节,了解实施中何时必须停下、回退或回写上游设计。

实施过程中优先保护已验证阶段和已验证 commit boundary。P0 gate 失败、VETO-SDK 命中、S0 / S1 缺陷、redaction 命中、`core-contracts` / `bus-contracts` 不可编译、字段缺失、状态冲突、DTO 构造不完整、phase boundary 越界、证据路径非法或设计契约偏离时,必须暂停当前阶段。

正式内容从 `design-calibration/07_implementation_plan_step_10_rollback_change_control.md` §7.1~§7.6 摘录。
````

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 是否允许 S0 / VETO 风险接受 | 不允许 | 影响最终验收 | 保持 `06` 口径 |
| 是否允许回退已验证前序 boundary | 默认不允许 | 保护证据链 | 只在上游设计整体变更时重新评估 |
| 是否删除失败 artifact / report | 不删除 | 支撑复验和审计 | 新 run 证明修复 |
| 真实外部依赖不可用时是否暂停 P0 | 除 contracts、toolchain 和证据工具外不暂停 | 保持 fake / fixture / local candidate 默认路径 | 真实依赖记录为 P1 / P2 风险 |
| Python / TypeScript 工具链不可用是否降级 | 不降级 | 三语言是 P0 | 暂停 PH-04 / PH-05 或进入 Spike |

建议方案: 接受当前回退、暂停与变更控制规则。原因是它保护已验证边界,又能在设计偏离、门禁失败和依赖不可用时给出明确动作。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 暂停、回退、变更和恢复条件明确 | 已满足 |
| 规则与 Step 6 commit boundary、Step 7 gate、Step 8 dependency、Step 9 risk 一致 | 已满足 |
| P0 gate、S0 / S1、VETO-SDK 和 redaction 的处理口径不冲突 | 已满足 |
| 字段缺失、状态冲突、DTO 构造不完整和 phase boundary 越界处理明确 | 已满足 |

结论: 可以进入 Step 11,继续定义提交、评审与交付纪律。
