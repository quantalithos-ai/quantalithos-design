# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-06-06

---

## 1. 本步目标

从 Step 2 的边界和 Step 3 的问题主线中收束 `L1-governance` 本次需求要达成的状态、边界和能力范围,并明确哪些相关事项不纳入当前仓或当前需求范围。本步不写核心能力闭环、用户故事、功能需求、业务规则、接口、数据归属、事务、表结构、结构体或代码目录。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-governance` 是治理决策与治理控制真相仓,非 process / work / artifact / conversation / identity / method-library / runtime / observability / UI |
| `design-calibration/00_req_step_03_problem_context.md` | Step 3 已完成 | 固定问题主线:治理事实未统一、治理结论与相邻仓状态混淆、合规对象正文 / 标准语义 / 治理结论混写 |
| `projects/L1-governance/00-需求文档.md` §3 / §6 / §7 | 旧版目标、功能和非功能 | 提取 Gate、Policy、Control、AIIA、SoA、Nonconformity、shared_rules 和 autonomy_level 等目标线索 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 Gate / Policy / Control / AIIA / SoA / Nonconformity / Approval 边界线索,但不继承字段、状态机、RPC 和事件名 |
| `methodology/standards-discussion/ISO-42001.md`、`ISO-9001.md`、`ISO-IEC-IEEE-24748-2.md` | 标准讨论输入 | 固定治理、控制、纠正和 Decision Gate 的语义线索,不直接生成对象字段或验收数字 |
| `projects/L1-process` / `projects/L1-work` / `projects/L1-conversation` / `projects/L3-method-library` 正式文档 | 已完成深度校准 | 固定相邻 truth 不归 governance,用于非目标和范围收束 |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后,应成立哪些状态、边界或能力？

本次需求结束后,应成立以下目标:

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立治理事实主题的需求边界 | 明确 `L1-governance` 承载的是治理决策与治理控制事实,不是泛合规平台、审计存储、UI 审批页或策略执行引擎 | 后续章节不再把 process、work、artifact、conversation、identity、method-library、runtime、observability 或 UI 真相写入 Governance 范围 |
| 收束 Gate / Approval / Decision 边界 | 明确 Gate、Approval 和 Decision 是关键节点治理裁决事实,不等同 process waiting state、work lifecycle、conversation turn 或 UI 卡片 | 后续用户故事、功能需求、规则和数据归属能稳定区分等待状态、业务状态、显化状态和治理裁决 |
| 收束 Policy 生效与授权边界 | 明确 Policy 是治理策略生效、授权、优先级和范围事实,不等同 method-library 的策略定义来源、runtime cache、capability-hub 工具白名单或 DSL 引擎 | 后续章节能区分 policy source definition、governance policy truth 和 runtime enforcement / cache |
| 收束 Control / AIIA / SoA 治理结论边界 | 明确 Control、AIIA 和 SoA 是治理适用性、覆盖、生命周期和批准结论,不拥有标准原文、artifact 正文或 evidence body | 后续章节不把标准条款、AIIA / SoA 文档正文或证据正文保存成 governance truth |
| 收束 Nonconformity 纠正闭环边界 | 明确 Nonconformity 是不符合与纠正闭环治理事实,不等同普通 bug、work blocker、process incident 或 observability alert | 后续功能、规则和验收能围绕治理纠正事实展开,不把普通工作项或告警误写成本仓真相 |
| 收束相邻仓协作边界 | 明确 governance 与相邻仓是引用、事件、查询、摘要或显化协作,不转移来源 truth | 后续依赖、接口、规则、数据和验收章节都能验证 governance 不反写或接管相邻仓 truth |

### 3.2 这些目标如何被验证？

这些目标的验证方式不是立即写测试用例或接口,而是在后续需求章节中持续检查:

- Step 5 用户与角色不把相邻仓使用方误写成本仓拥有角色。
- Step 6 使用方与依赖能从全局依赖关系中裁剪出 Governance 自己的部分。
- Step 7 核心能力闭环围绕治理事实成立,不是审批 UI、标准方法论、runtime cache 或审计存储。
- Step 9 功能需求不出现 process waiting state 管理、WorkItem 维护、artifact body 持久化、method definition 管理、runtime enforcement 执行、observability log store 或 workspace UI state。
- Step 10 / Step 11 / Step 12 能分别守住规则、数据归属和接口边界。
- Step 13 再判断旧 P95、Policy 下发时延、容量、可用性和覆盖率是否成为非功能指标。
- Step 14 再判断合规覆盖、治理闭环和边界不串线如何被验收。

### 3.3 哪些事项虽然相关,但明确不纳入当前范围？

| 非目标 | 不做原因 |
|---|---|
| process waiting state / Activity / ProcessInstance / checkpoint | 属于 `L1-process`;governance 只拥有 Gate / Policy / decision truth 和必要引用 |
| Project / Backlog / WorkItem / Iteration / blocker / dependency truth | 属于 `L1-work`;governance 只引用或约束工作对象 |
| Artifact / Evidence / Baseline / AIIA / SoA 文档正文 | 属于 `L1-artifact`;governance 只保存治理结论、适用性、覆盖、引用和必要摘要 |
| conversation truth / Gate UI turn / review display | 属于 `L1-conversation` 或上层产品入口;governance 只提供可显化治理事实 |
| GlobalMember / actor lifecycle / role definition | 成员生命周期属于 `L1-identity`,角色 / 方法定义属于 `L3-method-library`;governance 只引用 actor / role ref |
| Method Content / AIPolicyDef / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library`;governance 不拥有定义正文 |
| runtime execution / policy cache / autonomy enforcement / tool loop | 属于 `L2-runtime`、`L2-member-service` 或执行边界;governance 只拥有 Policy 生效和治理授权事实 |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub`;governance 不拥有工具能力注册或调用结果 |
| audit log store / metrics / trace storage / alert stream | 属于 `L4-observability`;governance 只拥有可被审计的业务治理事实 |
| workspace / console approval UI state | 属于 `L1-workspace`、`L5-console` 或上层产品入口 |
| 外部 GRC 套件、法律咨询系统或标准原文管理 | 超出本仓范围;本仓只承载平台内部治理事实 |
| 当前性能 / 容量 / 可用性 / 覆盖率指标定稿 | `RaiseGate P95`、`DecideGate P95`、Policy 下发时延、记录规模和覆盖率后移 Step 13 / Step 14 |
| 具体 Gate kind、Policy DSL、状态机、RPC、事件名、字段和持久化 | 后移功能、规则、接口、数据归属、架构和详细设计阶段 |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

必须交给相邻仓的事项:

- 流程等待、Activity、checkpoint 和恢复交给 `L1-process`。
- 项目、工作项、blocker、dependency 和迭代交给 `L1-work`。
- Artifact、Evidence、AIIA / SoA 文档正文、版本和 baseline 交给 `L1-artifact`。
- 对话事实、Gate 显化、review display 和可见性交给 `L1-conversation` 或上层产品入口。
- GlobalMember、Actor、Role 生命周期交给 `L1-identity`。
- 方法定义、AIPolicyDef source truth、ViewProfile 和模板定义交给 `L3-method-library`。
- runtime 执行、policy cache、autonomy enforcement 和工具调用交给 `L2-runtime` / `L2-member-service`。
- 能力注册、工具适配和外部能力目录交给 `L3-capability-hub`。
- 审计日志、指标、trace storage 和告警交给 `L4-observability`。
- UI 状态、工作台视图和控制台页面交给 `L1-workspace` / `L5-console`。

必须后续阶段处理的事项:

- 核心能力闭环后移 Step 7。
- 用户故事后移 Step 8。
- 功能需求清单后移 Step 9。
- 业务规则和状态约束后移 Step 10。
- 数据归属后移 Step 11。
- 接口与依赖后移 Step 12。
- 性能、容量、可用性、安全、审计和覆盖率等非功能指标后移 Step 13。
- 验收标准后移 Step 14。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §3.1 | 目标写 Gate 六段式、autonomy_level、shared_rules、SoA 38 控制项、P95 和 Policy 下发时延 | 部分目标有效,但混入功能、规则、数据、非功能指标和测试方向 | Step 4 只保留状态 / 边界 / 能力范围,细节后移 |
| `00-需求文档.md` §3.2 | 非目标列 Activity 执行、Artifact 正文、UI 卡片、外部 GRC、全自动 AIIA | 方向正确,但缺少 process / work / conversation / identity / method-library / runtime / observability / capability-hub 等最新边界 | 正式 §4 补齐相邻仓非目标 |
| `00-需求文档.md` §6 | 功能清单 F-001~F-014 直接写 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity、事件扇出 | 这些是后续功能需求候选,不应反向进入目标表 | 后移 Step 9 按核心闭环裁剪 |
| `00-需求文档.md` §7 | 非功能指标直接写 P95、Policy 传播、可用性、记录规模 | 这些是 Step 13 非功能候选 | Step 4 只标记“当前性能 / 容量指标不定稿” |
| `domain/governance/README.md` | 已有字段、状态机、RPC、事件名和不变量 | 对后续设计有参考价值,但目标层不能写实现路径 | 只抽取边界目标,不继承实现结构 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标数量 | 旧目标混合 Gate、Policy、SoA、P95、传播时延 | 6 个目标,按治理事实边界、Gate / Decision、Policy、Control / AIIA / SoA、Nonconformity、相邻仓协作边界收束 | 避免 Step 4 写成规则、功能、验收或非功能 |
| 目标主轴 | ISO 42001、Gate 六段式、autonomy_level、shared_rules、SoA 38 控制项、性能 | 治理决策与治理控制事实边界 | 对齐 Step 2 / Step 3 的问题主线 |
| 非目标范围 | Activity、Artifact、UI、外部 GRC、全自动 AIIA | 补齐 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console、外部系统、非功能和详细设计项 | 对齐已完成上游和当前相邻仓边界 |
| 验证方式 | 单元、集成、benchmark | 后续章节是否越界、是否能映射到功能 / 规则 / 数据 / 验收 | Step 4 不直接定义测试方案 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 保留旧 G-1~G-7 目标表 | 内容完整,接近实现验收 | 混入功能、规则、非功能、容量和测试方式,不符合 Step 4 粒度 | 不采用 |
| 方案 B: 按治理事实边界重写目标 | 对齐 Step 2 / Step 3,可防止后续串线 | 需要在后续 Step 7~14 再展开闭环、功能、规则和验收 | 采用 |
| 方案 C: 只写一个总目标“统一治理事实” | 简洁 | 不足以约束 Gate、Policy、Control、AIIA、SoA 和 Nonconformity 等关键边界 | 不采用 |
| 方案 D: 把 ISO 42001 / SoA 38 控制项作为目标主轴 | 能保留旧合规承诺 | 会把标准映射、控制项覆盖和具体验收提前写成目标,并可能压过边界问题 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 Gate 六段式写入 Step 4 目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成目标:“Gate 六段式完整” | 看起来可验证,但属于功能 / 规则层细节 |
| 方案 B | 在 Step 4 只写“收束 Gate / Approval / Decision 边界”,六段式后移 Step 9 / Step 10 | 目标层更干净,后续规则可展开 |

推荐方案 B。原因是 Gate 六段式会涉及字段、校验和状态规则,不适合在目标层定死。

#### 是否把 SoA 38 控制项写入 Step 4 目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成目标:“SoA 覆盖 38 控制项” | 贴近旧文档,但属于具体规则 / 验收 |
| 方案 B | 在 Step 4 只写“收束 Control / AIIA / SoA 治理结论边界”,覆盖规则后移 Step 10 / Step 14 | 保留合规主线,不提前写规则和验收 |

推荐方案 B。原因是控制项覆盖属于规则和验收方向,需要后续和数据归属一起收敛。

#### 是否把 P95 / Policy 下发时延 / 覆盖率写入 Step 4 目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入目标 | 过早给出非功能和测试指标,且来源未重新校准 |
| 方案 B | 后移 Step 13 / Step 14 | 避免伪量化,保留后续评估空间 |

推荐方案 B。原因是 Step 3 已确认旧性能和覆盖率数字不作为当前问题量化,Step 4 也不应提前写非功能和验收指标。

---

## 7. 结构化中间产物

### 7.1 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立治理事实主题的需求边界 | 明确 Governance 承载治理决策与治理控制事实,不承载泛合规平台、审计存储、UI 审批页或策略执行引擎 | 后续章节不把相邻仓真相写入 Governance |
| 收束 Gate / Approval / Decision 边界 | 明确关键节点治理裁决事实与等待状态、业务状态、显化状态分离 | 后续章节能稳定区分 process / work / conversation 与 governance |
| 收束 Policy 生效与授权边界 | 明确 Policy truth 与定义来源、runtime cache、capability whitelist 和 DSL 引擎分离 | 后续章节能区分 definition、governance truth 和 runtime enforcement |
| 收束 Control / AIIA / SoA 治理结论边界 | 明确适用性、覆盖、生命周期和批准结论归 governance,正文和标准原文不归 governance | 后续章节不保存第二份 artifact / evidence / standard body |
| 收束 Nonconformity 纠正闭环边界 | 明确不符合与纠正闭环是治理事实,不是普通 bug、work blocker 或 alert | 后续章节围绕治理纠正事实展开 |
| 收束相邻仓协作边界 | 明确 governance 与相邻仓是引用、事件、查询、摘要或显化协作,不转移来源 truth | 后续依赖、接口、规则和验收章节可验证不反写相邻仓 truth |

### 7.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| process waiting state / Activity / ProcessInstance / checkpoint | 属于 `L1-process` |
| Project / Backlog / WorkItem / Iteration / blocker / dependency truth | 属于 `L1-work` |
| Artifact / Evidence / Baseline / AIIA / SoA 文档正文 | 属于 `L1-artifact` |
| conversation truth / Gate UI turn / review display | 属于 `L1-conversation` 或上层产品入口 |
| GlobalMember / actor lifecycle / role definition | 属于 `L1-identity` 和 `L3-method-library` |
| Method Content / AIPolicyDef / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library` |
| runtime execution / policy cache / autonomy enforcement / tool loop | 属于 `L2-runtime` 或 `L2-member-service` |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub` |
| audit log store / metrics / trace storage / alert stream | 属于 `L4-observability` |
| workspace / console approval UI state | 属于 `L1-workspace`、`L5-console` 或上层产品入口 |
| 外部 GRC 套件、法律咨询系统或标准原文管理 | 超出本仓范围 |
| 当前性能 / 容量 / 可用性 / 覆盖率指标定稿 | 后移 Step 13 / Step 14 |
| 具体 Gate kind、Policy DSL、状态机、RPC、事件名、字段和持久化 | 后移后续需求 Step 或设计阶段 |

### 7.3 范围收束结论

本次需求的范围是治理决策与治理控制事实主题的需求收束,而不是完整合规产品、审批 UI、标准方法论系统、runtime 策略执行系统、审计存储系统或外部 GRC 套件。后续章节必须围绕 Gate / Approval / Decision、Policy、Control / AIIA / SoA、Nonconformity 和相邻仓协作边界展开。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §4。

```md
## 4. 目标与非目标

> 校准来源:
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“设计取舍”和“结构化中间产物”小节,了解本章如何从旧目标表收敛为当前需求边界。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立治理事实主题的需求边界 | 明确 Governance 承载治理决策与治理控制事实,不承载泛合规平台、审计存储、UI 审批页或策略执行引擎 | 后续章节不把相邻仓真相写入 Governance |
| 收束 Gate / Approval / Decision 边界 | 明确关键节点治理裁决事实与等待状态、业务状态、显化状态分离 | 后续章节能稳定区分 process / work / conversation 与 governance |
| 收束 Policy 生效与授权边界 | 明确 Policy truth 与定义来源、runtime cache、capability whitelist 和 DSL 引擎分离 | 后续章节能区分 definition、governance truth 和 runtime enforcement |
| 收束 Control / AIIA / SoA 治理结论边界 | 明确适用性、覆盖、生命周期和批准结论归 governance,正文和标准原文不归 governance | 后续章节不保存第二份 artifact / evidence / standard body |
| 收束 Nonconformity 纠正闭环边界 | 明确不符合与纠正闭环是治理事实,不是普通 bug、work blocker 或 alert | 后续章节围绕治理纠正事实展开 |
| 收束相邻仓协作边界 | 明确 governance 与相邻仓是引用、事件、查询、摘要或显化协作,不转移来源 truth | 后续依赖、接口、规则和验收章节可验证不反写相邻仓 truth |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| process waiting state / Activity / ProcessInstance / checkpoint | 属于 `L1-process` |
| Project / Backlog / WorkItem / Iteration / blocker / dependency truth | 属于 `L1-work` |
| Artifact / Evidence / Baseline / AIIA / SoA 文档正文 | 属于 `L1-artifact` |
| conversation truth / Gate UI turn / review display | 属于 `L1-conversation` 或上层产品入口 |
| GlobalMember / actor lifecycle / role definition | 属于 `L1-identity` 和 `L3-method-library` |
| Method Content / AIPolicyDef / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library` |
| runtime execution / policy cache / autonomy enforcement / tool loop | 属于 `L2-runtime` 或 `L2-member-service` |
| capability registration / tool adapter / whitelist runtime decision | 属于 `L3-capability-hub` |
| audit log store / metrics / trace storage / alert stream | 属于 `L4-observability` |
| workspace / console approval UI state | 属于 `L1-workspace`、`L5-console` 或上层产品入口 |
| 外部 GRC 套件、法律咨询系统或标准原文管理 | 超出本仓范围 |
| 当前性能 / 容量 / 可用性 / 覆盖率指标定稿 | 后移到非功能和验收阶段评估,不在目标层定死 |
| 具体 Gate kind、Policy DSL、状态机、RPC、事件名、字段和持久化 | 后移后续需求 Step 或设计阶段 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧 G-1~G-7 目标表 | 原样保留 | 按治理事实边界重写 | 推荐 B。原因是旧目标混入功能、规则、测试和非功能指标 |
| Q-002 | 是否把 Gate 六段式作为目标 | 写成目标 | 后移 Step 9 / Step 10 | 推荐 B。原因是它属于功能 / 规则层细节 |
| Q-003 | 是否把 SoA 38 控制项作为目标 | 写成目标 | 后移 Step 10 / Step 14 | 推荐 B。原因是它属于规则和验收方向 |
| Q-004 | 是否把 P95 / Policy 下发 / 容量 / 覆盖率写入目标 | 写入目标 | 后移 Step 13 / Step 14 | 推荐 B。原因是它们属于非功能和测试候选 |

当前建议:接受上述推荐后进入 Step 5。

---

## 10. 进入下一步条件

- 每个目标都可通过后续章节是否越界、是否可映射到功能 / 规则 / 数据 / 验收来验证。
- 每个非目标都具体指向相邻仓或后续阶段。
- 未把功能、接口、业务规则、实现路径或空洞口号写进目标。
- 已明确 Gate 六段式、SoA 38 控制项、Policy DSL、P95、容量、覆盖率、具体状态机细节后移到后续 Step。
