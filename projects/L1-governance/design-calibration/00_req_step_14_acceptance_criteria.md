# Step 14. 验收标准

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 14
> 回填章节: `00-需求文档.md` §14 验收标准
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 Step 7 的核心能力闭环、Step 9 的功能需求、Step 10 的规则边界、Step 11 的数据归属和 Step 13 的非功能要求,统一收口成需求层可判断的验收条件。本步不写测试步骤、接口调用、脚本、测试数据准备、监控实现、CI 配置、证据文件格式或验收执行流程。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心能力闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定 FR-GOV-001~FR-GOV-010 与外围增强能力 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定 BR-GOV-001~BR-GOV-040 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相 / 快照 / 引用 / 禁止正文边界 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | Step 13 已完成 | 固定六类非功能判断口径 |
| 旧 `projects/L1-governance/06-验收标准.md` | 旧版验收标准 | 作为旧验收线索和问题诊断输入,不直接继承测试门禁、证据列或硬指标 |

---

## 3. SOP 问题回答

### 3.1 哪些条件满足后,核心能力闭环算成立?

核心能力闭环验收必须证明 `L1-governance` 不是审批页面、runtime policy cache、artifact 合规文档副本、conversation 显化卡片、observability audit store 或外部 GRC 适配层,而是稳定的治理决策与治理控制事实真相仓。

| 闭环节点 | 验收判断 |
|---|---|
| C-GOV-1 治理语境与适用对象成立 | actor、scope、适用对象、治理目的和责任语境能够形成可裁决、可策略化、可控制适用的治理上下文。 |
| C-GOV-2 关键节点治理裁决成立 | 关键节点能够形成正式、可追溯、可消费的治理裁决结论,且不由 process waiting state、work lifecycle、conversation UI 或 runtime cache 替代。 |
| C-GOV-3 治理策略与控制适用成立 | Policy 生效、授权、范围、优先级、shared rules 和 Control 适用 / 复核责任能够作为 Governance truth 成立。 |
| C-GOV-4 合规 / 纠正治理闭环成立 | AIIA、SoA、Control 和 Nonconformity 能形成治理评审、适用性、覆盖、纠正、复验和关闭结论,但不保存正文。 |
| C-GOV-5 治理事实消费与追溯成立 | 治理语境、裁决、策略、控制、评审和纠正事实能够被相邻仓授权消费、解释和追溯。 |

### 3.2 哪些功能能力满足后,本次需求算完成?

本次需求的功能能力验收只覆盖核心闭环能力。外围增强能力可以作为后续需求线索,但不得成为当前需求通过的硬前置。

| 功能需求 | 验收判断 |
|---|---|
| FR-GOV-001 | 治理语境与适用对象能够正式建立或调整,并防止相邻仓状态隐式创造 Governance truth。 |
| FR-GOV-002 | 系统触发、周期复核、风险信号和相邻仓请求能够收束为可解释治理输入,但自动化不能绕过裁决。 |
| FR-GOV-003 | 关键节点能够形成正式治理裁决,并被相邻仓围绕同一结论消费。 |
| FR-GOV-004 | AI member 和自动化执行者的治理授权、停止自动推进和升级裁决边界能够被表达。 |
| FR-GOV-005 | Policy 生效、授权、范围、优先级、冲突和 shared rules 约束能够成为治理事实。 |
| FR-GOV-006 | Control 适用、实施、复核责任和违反 / 整改关联能够成为治理事实。 |
| FR-GOV-007 | AIIA / SoA 能形成治理评审、适用性、覆盖和批准结论,且只引用 artifact / evidence 正文。 |
| FR-GOV-008 | Nonconformity 能围绕不符合、原因、纠正、复验和关闭形成正式治理闭环。 |
| FR-GOV-009 | 审计者、项目负责人、自动化执行者和相邻仓能够授权消费并追溯治理事实。 |
| FR-GOV-010 | 维护、对账、报告和归档准备能够基于 Governance truth 进行,且不改变业务治理结论。 |

### 3.3 哪些规则 / 边界被满足后,才算没有串线?

规则 / 边界验收重点不在于对象字段或状态机细节,而在于相邻仓真相、执行缓存、文档正文、UI 显化和维护面不能反向污染 Governance。

| 规则组 | 验收判断 |
|---|---|
| 不变量 | 治理语境、正式裁决、Approval、Policy、shared rules、Control、AIIA / SoA、Nonconformity 和消费维护面不变量成立。 |
| 禁止行为 | process、work、artifact、conversation、runtime、capability、method-library、observability、维护和查询动作不得越界写 Governance truth。 |
| 显式变化 | 治理语境、Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity 的关键变化必须显式发生。 |
| 边界约束 | process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 和 external GRC 边界不被打穿。 |
| 治理 / 审计约束 | 高影响裁决、shared rules、Control 基线、高严重不符合、消费和维护动作必须满足正式治理或审计追溯要求。 |

### 3.4 哪些数据边界被满足后,才算数据归属正确?

数据归属验收必须证明 Governance 只拥有治理决策与治理控制事实,不保存相邻仓正文。

| 数据类型 | 验收判断 |
|---|---|
| 真相数据 | governance context、Gate / Decision、Approval、Policy、shared rules、Control、AIIA / SoA 结论、Nonconformity 和治理追溯记录由 Governance 拥有。 |
| 快照数据 | 外部摘要和 governance read model 只服务判断、裁决、解释和消费,不形成独立业务真相。 |
| 引用数据 | process、work、artifact、conversation、identity、method-library、runtime、capability、observability、archive 等对象只作为引用进入。 |
| 禁止保存正文 | process、work、artifact / evidence / AIIA / SoA、conversation、identity、method-library、runtime、capability、observability、workspace、console、external GRC 正文不得进入 Governance。 |

### 3.5 哪些非功能要求被满足后,才算质量达标?

非功能验收采用 Step 13 的六类判断口径,当前不把旧 `150ms / 200ms / 50ms / 30s / 99.95%` 写成需求层硬指标。

| 非功能类别 | 验收判断 |
|---|---|
| 性能 | 治理语境形成、关键节点裁决、Policy / Control 适用、基础查询和追溯不应成为主链瓶颈。 |
| 可用性 | 外围增强失效时核心闭环仍应成立;外部依赖延迟时不得篡改 Governance truth。 |
| 安全 | 正文边界、授权边界、高影响裁决、shared rules 和执行边界必须成立。 |
| 审计 / 可追溯 | 治理语境、裁决、Policy / Control、AIIA / SoA、Nonconformity、消费和维护均可解释。 |
| 幂等 / 一致性 | 重复输入不产生重复事实或分叉结论;正式裁决不可原地改写;多下游消费同一 Governance truth。 |
| 可观测性 | 核心变化、边界越界、依赖延迟、消费状态和维护状态必须可发现。 |

### 3.6 哪些失败情形属于一票否决?

一票否决项只覆盖会使 `L1-governance` 仓定位失效、核心闭环断裂或相邻仓边界被打穿的严重情况。外围增强缺失、旧候选性能指标未定稿、展示体验不足、外部 GRC 集成缺失不属于一票否决。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `06-验收标准.md` §4 | 以功能门禁、接口式流程和证据列组织 | 已滑入测试方案和实施验收 | 改为需求层核心闭环和功能能力验收 |
| 旧 `06-验收标准.md` §5 | 写决策链留痕率、可回放率、无 drift、非授权拦截率 | 线索有价值,但需要承接 Step 13 和 Step 14 分类 | 转成非功能验收判断和一票否决 |
| 旧 `06-验收标准.md` §6 | 三红线可审计性、可追溯性、可裁剪性 | 有价值,但混入证据格式和执行检查 | 转成审计 / 追溯 / 边界一票否决 |
| 旧 `00-需求文档.md` §11 | Given-When-Then、benchmark、集成测试和静态校验直接写入需求 | 混入测试步骤和硬指标 | 本步只写验收条件,测试方案后续细化 |
| 旧 `00-需求文档.md` §11.2 | 旧 P95、Policy 下发、audit_trail 覆盖率作为硬验收 | Step 13 已收敛为候选目标或判断口径 | 不作为当前需求层硬验收 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收组织 | 按旧功能 / 测试门禁 / 红线组织 | 按核心闭环、功能、规则、数据、非功能组织 | 对齐需求规范 4.14 |
| 验收粒度 | 接口、Given-When-Then、证据和执行方式混入 | 只写“验什么”和“怎样算通过” | 防止 Step 14 变成测试方案 |
| 一票否决 | 分散在红线和风险中 | 独立列出核心失败条件 | 让仓边界失效问题不被普通缺陷淹没 |
| 旧硬指标 | 作为性能门禁 | 作为候选目标,不进入需求层硬验收 | 避免伪量化 |
| 外围增强 | 容易与核心功能同等验收 | 明确不阻塞核心需求通过 | 保持核心闭环优先 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 `06-验收标准.md` 门禁 | 接近测试执行 | 混入接口、证据、测试步骤和旧硬指标 | 不采用 |
| 方案 B: 按需求规范 4.14 分类重写 | 能追溯 Step 7 / 9 / 10 / 11 / 13,适合 Step 16 | 后续测试方案还要再细化执行证据 | 采用 |
| 方案 C: 只列一票否决项 | 简洁 | 功能和数据归属验收覆盖不足 | 不采用 |
| 方案 D: 把所有外围增强也纳入验收 | 覆盖面更大 | 会让增强能力阻塞核心需求通过 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把旧性能数字作为一票否决?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 未达到旧 P95 / 30s / SLA 数字即一票否决 | 会把未验证候选指标误升级为硬需求 |
| 方案 B | 只要求核心主链不成为协作瓶颈,数字后续测试阶段验证 | 保留性能方向,避免伪量化 |

推荐方案 B。原因是 Step 13 已明确旧数字只是候选目标。

#### 是否把外部 GRC 集成缺失列为验收失败?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为当前验收失败 | 外围增强会压过核心闭环 |
| 方案 B | 不作为核心需求失败;平台内部 Governance truth 必须成立 | 对齐 Step 7 / Step 9 |

推荐方案 B。原因是外部 GRC 集成是外围增强,不是当前核心闭环条件。

#### 是否把测试证据路径写入本步?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 14 写测试脚本、报告路径和证据格式 | 会与测试方案、验收标准专项文档混淆 |
| 方案 B | 只写需求层验收条件,执行证据后移 | 保持需求文档粒度清晰 |

推荐方案 B。原因是 SOP 明确本步不写测试步骤、脚本和接口调用细节。

---

## 7. 结构化中间产物

### 7.1 验收类别结论

| 验收类别 | 对应输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | C-GOV-1~C-GOV-5 是否共同成立 |
| 功能能力验收 | Step 9 | FR-GOV-001~FR-GOV-010 是否完成 |
| 规则 / 边界验收 | Step 10 | BR-GOV-001~BR-GOV-040 是否防止串线 |
| 数据归属验收 | Step 11 | 真相、快照、引用、禁止正文边界是否成立 |
| 非功能验收 | Step 13 | 六类质量要求是否达到需求层判断口径 |

### 7.2 验收标准表

| 验收类别 | ID | 验收项 | 验收条件 |
|---|---|---|---|
| 核心能力闭环验收 | AC-GOV-001 | 治理语境与适用对象成立 | actor、scope、适用对象、治理目的和责任语境能够形成可裁决、可策略化、可控制适用的治理上下文。 |
| 核心能力闭环验收 | AC-GOV-002 | 关键节点治理裁决成立 | 关键节点能够形成正式、可追溯、可消费的治理裁决结论,且不由相邻仓状态或 UI 替代。 |
| 核心能力闭环验收 | AC-GOV-003 | 治理策略与控制适用成立 | Policy 生效、授权、范围、优先级、shared rules 和 Control 适用 / 复核责任能够作为 Governance truth 成立。 |
| 核心能力闭环验收 | AC-GOV-004 | 合规 / 纠正治理闭环成立 | AIIA、SoA、Control 和 Nonconformity 能形成治理评审、适用性、覆盖、纠正、复验和关闭结论,且不保存正文。 |
| 核心能力闭环验收 | AC-GOV-005 | 治理事实消费与追溯成立 | 治理语境、裁决、策略、控制、评审和纠正事实能够被相邻仓授权消费、解释和追溯。 |
| 功能能力验收 | AC-GOV-006 | 治理语境与适用对象确定能力 | FR-GOV-001 的正式建立或调整能力成立,且相邻仓状态不能隐式创造 Governance truth。 |
| 功能能力验收 | AC-GOV-007 | 治理输入收束与可裁决语境形成能力 | FR-GOV-002 的系统触发、周期复核、风险信号和相邻仓请求收束能力成立,且自动化不能绕过裁决。 |
| 功能能力验收 | AC-GOV-008 | 关键节点正式治理裁决能力 | FR-GOV-003 的正式裁决能力成立,且相邻仓围绕同一结论消费。 |
| 功能能力验收 | AC-GOV-009 | 自动化治理边界表达能力 | FR-GOV-004 能表达 AI member 和自动化执行者的治理授权、停止自动推进和升级裁决边界。 |
| 功能能力验收 | AC-GOV-010 | Policy 生效与授权约束能力 | FR-GOV-005 的 Policy 生效、授权、范围、优先级、冲突和 shared rules 约束成立。 |
| 功能能力验收 | AC-GOV-011 | Control 适用与复核责任能力 | FR-GOV-006 的 Control 适用、实施、复核责任和违反 / 整改关联成立。 |
| 功能能力验收 | AC-GOV-012 | AIIA / SoA 治理评审结论能力 | FR-GOV-007 的治理评审、适用性、覆盖和批准结论成立,且只引用 artifact / evidence 正文。 |
| 功能能力验收 | AC-GOV-013 | Nonconformity 纠正闭环能力 | FR-GOV-008 的不符合、原因、纠正、复验和关闭治理闭环成立。 |
| 功能能力验收 | AC-GOV-014 | 治理事实消费与追溯能力 | FR-GOV-009 能支持授权消费和追溯治理事实。 |
| 功能能力验收 | AC-GOV-015 | 治理事实维护、对账、报告和归档准备能力 | FR-GOV-010 能基于 Governance truth 维护派生结果,且不改变业务治理结论。 |
| 规则 / 边界验收 | AC-GOV-016 | 不变量成立 | BR-GOV-001~BR-GOV-011 的治理事实不变量成立。 |
| 规则 / 边界验收 | AC-GOV-017 | 禁止行为被阻断 | BR-GOV-012~BR-GOV-020 的越界写入、绕过裁决和维护反写真相被禁止。 |
| 规则 / 边界验收 | AC-GOV-018 | 显式变化成立 | BR-GOV-021~BR-GOV-027 的正式变化必须显式发生。 |
| 规则 / 边界验收 | AC-GOV-019 | 相邻仓边界成立 | BR-GOV-028~BR-GOV-035 的 process、work、artifact、conversation、identity、method-library、runtime、capability、observability 等边界不被打穿。 |
| 规则 / 边界验收 | AC-GOV-020 | 治理约束成立 | BR-GOV-036~BR-GOV-038 的高影响裁决、shared rules、Control 基线和高严重不符合治理约束成立。 |
| 规则 / 边界验收 | AC-GOV-021 | 审计约束成立 | BR-GOV-039~BR-GOV-040 的关键变化、消费、报告、对账和归档准备可追溯可解释。 |
| 数据归属验收 | AC-GOV-022 | Governance 真相数据归属正确 | governance context、Gate / Decision、Approval、Policy、shared rules、Control、AIIA / SoA 结论、Nonconformity 和追溯记录归 Governance。 |
| 数据归属验收 | AC-GOV-023 | 外部快照不成真相 | 外部摘要和 governance read model 只服务判断、裁决、解释和消费,不形成独立业务真相。 |
| 数据归属验收 | AC-GOV-024 | 外部引用不接管正文 | process、work、artifact、conversation、identity、method-library、runtime、capability、observability、archive 等对象只作为引用进入。 |
| 数据归属验收 | AC-GOV-025 | 外部正文禁止入仓 | 相邻仓正文、运行时执行正文、观测正文、UI 显化正文和外部 GRC 正文不得保存为 Governance 数据。 |
| 非功能验收 | AC-GOV-026 | 性能判断口径成立 | 治理语境形成、关键节点裁决、Policy / Control 适用、基础查询和追溯不成为主链瓶颈;旧量化指标仅作候选目标。 |
| 非功能验收 | AC-GOV-027 | 可用性判断口径成立 | 外围增强失效不影响核心闭环;外部依赖延迟不导致 Governance 造真相。 |
| 非功能验收 | AC-GOV-028 | 安全判断口径成立 | 正文边界、授权边界、高影响裁决、shared rules 和执行边界成立。 |
| 非功能验收 | AC-GOV-029 | 审计 / 可追溯判断口径成立 | 治理语境、裁决、Policy / Control、AIIA / SoA、Nonconformity、消费和维护均可解释。 |
| 非功能验收 | AC-GOV-030 | 幂等 / 一致性判断口径成立 | 重复输入不产生重复事实或分叉结论,正式裁决不可原地改写,多下游消费同一 Governance truth。 |
| 非功能验收 | AC-GOV-031 | 可观测性判断口径成立 | 核心变化、边界越界、依赖延迟、消费状态和维护状态可发现。 |

### 7.3 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| VF-GOV-001 | C-GOV-1~C-GOV-5 任一核心闭环节点无法成立。 | Governance 仓失去治理决策与治理控制事实真相仓定位。 |
| VF-GOV-002 | process waiting state、Activity、checkpoint、work lifecycle、conversation UI 或 runtime cache 能替代 Gate / Decision truth。 | 治理裁决真相被相邻仓状态污染。 |
| VF-GOV-003 | Governance 保存 artifact、evidence、AIIA / SoA、method definition、runtime execution、observability audit store、workspace / console 或外部 GRC 正文。 | 数据归属边界被打穿。 |
| VF-GOV-004 | Policy effective fact 被 runtime cache、capability whitelist、tool execution 或 method definition 反向定义。 | Policy truth 边界失效。 |
| VF-GOV-005 | shared rules 或组织级硬约束能被 project、role、member 或低层 scope 覆盖。 | 治理安全边界失效。 |
| VF-GOV-006 | 正式裁决结论形成后可被原地改写,且没有新的可追溯治理事实。 | 决策可追溯性和一致性失效。 |
| VF-GOV-007 | AIIA / SoA 治理结论与 artifact 正文脱锚,或 Governance 保存第二份正文。 | 合规正文和治理结论边界失效。 |
| VF-GOV-008 | Nonconformity 被当作普通 bug、work blocker、observability alert 或备注关闭。 | 不符合纠正治理闭环失效。 |
| VF-GOV-009 | 查询、报表、投影重建、对账、归档准备或维护任务能隐式创建、修改、批准或关闭治理事实。 | 消费面或维护面反写真相。 |
| VF-GOV-010 | `L1-governance` 的唯一编译期上游不再限定为 `L0-core`,把 bus 或其他 L1 / L2 / L3 / L4 仓写成 package dependency。 | 全局依赖裁剪规则被破坏。 |

### 7.4 验收与功能 / 规则映射结论

| 范围 | 对应验收项 |
|---|---|
| C-GOV-1~C-GOV-5 核心能力闭环 | AC-GOV-001~AC-GOV-005;VF-GOV-001 |
| FR-GOV-001~FR-GOV-010 | AC-GOV-006~AC-GOV-015 |
| BR-GOV-001~BR-GOV-040 | AC-GOV-016~AC-GOV-021;VF-GOV-002~VF-GOV-009 |
| Step 11 数据归属 | AC-GOV-022~AC-GOV-025;VF-GOV-003;VF-GOV-007 |
| Step 13 非功能要求 | AC-GOV-026~AC-GOV-031 |
| Step 6 / Step 12 依赖裁剪 | VF-GOV-010 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §14。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 14. 验收标准

> 校准来源:
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“一票否决项”小节,了解本章如何从核心闭环、功能需求、规则边界、数据归属和非功能要求收敛验收条件。

本文采用 `design-calibration/00_req_step_14_acceptance_criteria.md` §7 的验收标准结论。验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织;一票否决项只覆盖核心闭环断裂、治理事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效。

正式验收章节应摘录:

- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.1 验收类别结论。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.2 验收标准表。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.3 一票否决项。
- `design-calibration/00_req_step_14_acceptance_criteria.md` §7.4 验收与功能 / 规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把旧性能数字作为一票否决 | 是 | 只作为候选目标,后续测试验证 | 推荐 B。原因是当前缺稳定测量来源 |
| Q-002 | 是否把外部 GRC 集成缺失列为验收失败 | 是 | 不作为核心需求失败 | 推荐 B。原因是外部 GRC 是外围增强 |
| Q-003 | 是否把测试证据路径写入本步 | 写入 | 后移测试方案 / 验收专项 | 推荐 B。原因是本步只写需求层验收条件 |
| Q-004 | 是否把高级治理看板、Policy DSL、复杂 Gate 编排作为当前验收硬前置 | 是 | 作为外围增强,不阻塞核心验收 | 推荐 B。原因是这些能力不决定 Governance truth 是否成立 |

当前建议:接受上述推荐后进入 Step 15。

---

## 10. 进入下一步条件

- 所有关键约束都已映射为验收条件。
- 已按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能分类。
- 一票否决项已经明确列出。
- 未把测试步骤、接口调用、脚本、证据文件格式、执行方式或旧候选性能指标写成需求层硬验收。
