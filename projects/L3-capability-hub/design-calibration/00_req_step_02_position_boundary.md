# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-07-06
> 当前状态: `completed_stop_review`
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_02_position_boundary.md`

---

## 0. 当前 Step 状态

| 项 | 记录 |
|---|---|
| 文档 | `projects/L3-capability-hub/00-需求文档.md` |
| Step | Step 2 本仓定位与边界 |
| 当前入口 | `Step 2 已完成,等待是否进入 Step 3` |
| gate_status | pass |
| next_allowed_action | `wait_user_review_to_step_03` |
| 正式文档写入 | blocked: 当前只写 Step 2 中间产物,不修改正式 `00-需求文档.md` |
| 当前策略 | 从头开始;每完成一个 Step 停审;不自动跨 Step |

### 0.1 Step 内计划

| 序号 | 动作 | 状态 | 结果 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow 和 Step 1 | done | 确认当前只允许进入 Step 2,不得越过停审门禁。 |
| 2 | 读取需求 SOP、书写规范、讨论中间产物规范和真相源标准中的 Step 2 约束 | done | 确认 Step 2 只能回答定位、非职责、混淆边界和单独成仓原因。 |
| 3 | 读取目标 README、旧 `00/01/02/03/05/06` | done | 识别旧材料中 runtime execution、Provider Contract、secret、cost、marketplace、Policy 执行混写。 |
| 4 | 读取 `L3-method-library`、`L1-governance`、`L0-sdk` 的边界结论 | done | 确认 method asset body、governance approval truth、SDK client truth 不归本仓。 |
| 5 | 回答 Step 2 四个 SOP 问题 | done | 形成一句话定义、非职责、最易混淆对象和单独成仓原因。 |
| 6 | 诊断旧材料冲突并记录取舍 | done | 旧 `Provider Contract / CostRecord / QueryCapabilities / marketplace metadata` 不作为 Step 2 正式定位。 |
| 7 | 结构化边界声明表与短文字 | done | 生成正式 §2 可回填候选。 |
| 8 | 判定 blocker 并停审 | done | 未发现阻塞 Step 2 的上游 blocker,等待用户确认是否进入 Step 3。 |

---

## 1. 本步目标

先建立 `L3-capability-hub` 的仓级心智:它是外部 MCP / A2A / API 能力接入真相仓,先收束 capability identity、capability registry 和 adapter descriptor 的归属,并明确它与 governance approval seam、method-library asset relation、SDK exposure boundary 的接缝方向。

Step 2 只回答仓级定位与边界,不提前写:

- 使用方与依赖
- 核心能力闭环
- 功能需求
- 业务规则
- 数据归属
- 接口清单
- 非功能指标

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 作为 Step 2 的来源基线,确认本仓只承接“能力注册 / 外部 MCP / A2A / API 集成中心”主题。 |
| `standards/document/需求文档讨论流程_SOP.md` | 已读 | 约束 Step 2 只回答一句话定义、单独成仓原因、非职责和混淆边界。 |
| `standards/document/需求文档书写规范.md` | 已读 | 约束正式 §2 只能输出固定结构边界声明表和一段短文字。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读 | 约束 Step 文件必须记录计划、诊断、取舍、结构化产物和停审门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读 | 约束 Step 2 不脑补对象、字段、接口、状态机或实现结构。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读 | 提供 `L3-capability-hub` 在全局中的 L3 方法能力层位置和运行期主题。 |
| `projects/L3-capability-hub/README.md` | 已读 | 作为旧仓定位材料和越界口径诊断输入。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 已读 | 作为旧需求边界污染诊断输入,不作为新版正式基线。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` ~ `06-验收标准.md` | 已读 | 作为旧下游文档和边界越界样本输入。 |
| `projects/L3-method-library/00-需求文档.md` | 已读 | 固定 method asset definition truth 归 `L3-method-library`,本仓后续只讨论 relation。 |
| `projects/L1-governance/00-需求文档.md` | 已读 | 固定 governance approval / policy effective fact 归 `L1-governance`,本仓后续只讨论 seam。 |
| `projects/L0-sdk/00-需求文档.md` | 已读 | 固定 SDK client / package / 三语言接入 truth 归 `L0-sdk`,本仓后续只讨论 exposure boundary。 |
| `projects/L1-governance/design-calibration/00_req_step_02_position_boundary.md` | 已读 | 仅作为 Step 2 粒度和组织方式参考,不作为领域来源。 |

---

## 3. SOP 问题回答

### 3.1 本仓一句话定义是什么？

`L3-capability-hub` 是 L3 方法能力层中负责外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。

这句话包含四个限制:

- “能力接入真相”指外部能力如何被识别、登记和描述,不是外部能力如何被执行。
- “capability identity / registry / adapter descriptor”是本仓当前应先闭合的核心边界,不是功能清单或对象清单。
- “外部 MCP / A2A / API”表示本仓服务于外部能力接入语境,不是方法资产正文、治理裁决正文或 SDK 客户端正文。
- “L3 方法能力层”表示本仓与 `L3-method-library` 同层但职责不同:一个负责外部能力接入,一个负责方法资产定义。

### 3.2 为什么它需要单独成仓？

因为外部能力接入事实会同时被 runtime、tools、governance、method-library、SDK 和生态入口引用。如果没有独立的 capability-hub 真相仓,外部能力 identity、registry 和接入描述会散落到 runtime 本地配置、tools 本地适配、method-library 资产正文、governance allowlist 结果、SDK 包装层或 marketplace listing 中,后续无法稳定回答:

- 平台当前承认哪些外部能力主体
- 这些能力主体如何被正式登记
- 它们通过什么 adapter descriptor 被消费方识别
- 哪些接缝是本仓引用的治理 / 方法 / SDK 边界,哪些不属于本仓 truth

单独成仓的理由不是“集成点很多”,而是接入事实边界独立:

- capability identity 不能退化为 runtime / tools 的本地执行配置
- capability registry 不能退化为 marketplace listing 或方法资产目录
- adapter descriptor 不能退化为 provider runtime client、secret 平台或 SDK client 封装
- governance approval seam 不能退化为 governance approval truth
- method-library asset relation 不能退化为 method asset body
- SDK exposure boundary 不能退化为 SDK package / client truth

### 3.3 本仓不是什么？

`L3-capability-hub` 不是以下对象:

- 不是 `L2-runtime` 的运行执行仓:不拥有 LLM loop、agent plan、runtime execution truth 或外部调用执行状态
- 不是 `L2-tools` 的工具执行仓:不拥有 tool execution truth、tool invocation lifecycle 或工具结果正文
- 不是 `L3-method-library` 的方法资产定义仓:不拥有 method asset body、method package、role / process / work-product 定义正文
- 不是 `L1-governance` 的治理审批仓:不拥有 governance approval truth、policy effective fact 或审批结论正文
- 不是 `L0-sdk` 的客户端接入仓:不拥有 SDK package、语言 client、默认错误 / trace / redaction 行为 truth
- 不是 provider runtime 仓:不拥有 provider 真实调用链、provider client 行为或 provider 原始状态
- 不是 secret / KMS / Vault 平台:不拥有密钥托管系统 truth、密钥生命周期平台语义或安全基础设施真相
- 不是 finance / billing 仓:不拥有 provider raw billing、平台计费 truth 或成本结算真相
- 不是 `L6-marketplace` 的 listing / transaction 仓:不拥有 listing truth、交易、购买、定价、履约或安装记录
- 不是 LLM routing 服务:不拥有模型选路、执行调度或运行时路由 truth

### 3.4 最容易与哪些相邻仓或概念混淆？

最容易混淆的对象如下:

| 类型 | 对象 | 混淆点 |
|---|---|---|
| 仓 | `L2-runtime` | capability access truth 与 runtime execution truth |
| 仓 | `L2-tools` | capability access truth 与 tool execution truth |
| 仓 | `L3-method-library` | method asset definition 与 capability relation |
| 仓 | `L1-governance` | governance approval / policy effective fact 与 approval seam / policy seam |
| 仓 | `L0-sdk` | 服务端 capability exposure 与 SDK client / package |
| 仓 | `L6-marketplace` | capability registry / descriptor 与 listing / transaction |
| 概念 | capability identity | 平台承认的外部能力主体,不是方法资产 ID 或运行态实例 ID |
| 概念 | capability registry | 外部能力登记真相,不是工具执行清单或 marketplace 目录 |
| 概念 | adapter descriptor | 外部能力接入描述语义,不是 provider runtime client 或 SDK client |
| 概念 | governance approval seam | 只表示治理接缝,不是审批 truth 本体 |
| 概念 | method-library asset relation | 只表示资产关系,不是方法资产正文 |
| 概念 | SDK exposure boundary | 只表示服务端暴露接缝,不是 SDK 客户端实现 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` | 把 MCP 白名单、A2A 身份验证、Provider Contract、API key / 配额、成本记账、LLM routing、Policy 下发和 marketplace 注册并列为核心职责 | 旧定位把能力接入、执行控制、安全平台、成本平台和生态 listing 混成一仓 | 只保留“外部能力接入中心”线索,其余降级为冲突线索 |
| 旧 `00-需求文档.md` | 直接把 `Provider Contract / QueryCapabilities / Cost Accounting / Policy refresh / marketplace metadata` 写成功能主线 | 功能清单倒灌仓定位,导致本仓像执行控制面和成本中心 | 整体降级为 historical material,本步不承接其功能命名 |
| 旧 `01-架构设计.md` | 把 registry / directory / provider contract / accounting 设成固定子域 | 旧子域划分提前冻结了 capability-hub 应该拥有什么 truth | 本步不承接旧子域结论,后续 Step 7 再判断核心能力节点 |
| 旧 `02-概要设计.md` | 继续把 ProviderContract、CapabilityDecision、CostRecord、metadata 分发、secret 托管并入主线 | 旧概要把 descriptor、decision、cost、secret 和下游 exposure 混成一条业务主线 | 本步只保留 access vs execution 易混淆提醒,不继承对象名 |
| 旧 `03-详细设计.md` | 已提前落入对象、service、repository、projection、DTO、事件和状态 | 详细设计口径倒灌需求边界 | 本步不承接任何实现组织结论 |
| 旧 `05/06` | 测试与验收默认 secret、cost、provider contract、metadata 分发是 P0 主线 | 下游文件反向锁死仓定位 | 只保留历史风险语言,不作为当前需求基线 |
| 相邻仓正式文档 | `L3-method-library`、`L1-governance`、`L0-sdk` 已明确各自 truth 不被相邻仓接管 | 如果 Step 2 不先尊重这些边界,后续会再次混写 method、governance 和 SDK | 作为当前边界基线强制保留 |

---

## 5. 改动前后对比

| 项 | restart 前活跃口径 | 当前 Step 2 口径 | 原因 |
|---|---|---|---|
| 一句话定位 | “能力池 = MCP + A2A + Provider Contract + 白名单 / 成本记账” | “capability identity、capability registry 与 adapter descriptor 的能力接入真相仓” | 先闭合接入 truth,不把执行、成本和安全平台混入仓定位 |
| runtime / tools 关系 | runtime / tools 调外部能力必经 hub 执行 | 本仓只拥有 capability access truth,不拥有 execution truth | 用户明确要求不能把 runtime execution、tools execution 并入本仓 |
| governance 关系 | Policy 下发更新白名单,像是本仓拥有 policy truth | 本仓后续只讨论 approval seam / policy seam,不拥有治理 truth | governance approval / policy effective fact 归 `L1-governance` |
| method-library 关系 | 外部能力与方法语义混在能力池叙事里 | 本仓只讨论 capability 与 method asset 的 relation,不拥有资产正文 | method asset body 归 `L3-method-library` |
| SDK 关系 | 被动暗示 hub 兼做客户端能力入口 | 本仓只提供服务端 exposure boundary,不拥有 SDK client truth | SDK client / package 归 `L0-sdk` |
| marketplace 关系 | capability metadata / 注册像是 hub 主职责 | Step 2 排除 listing / transaction truth | listing / transaction 归 `L6-marketplace` |
| secret / cost 关系 | API key / KMS / 成本记账进入仓使命 | Step 2 不把 secret 平台或 cost / billing truth 写成本仓定义 | 这些只可能在后续作为接缝、约束或派生输出被审计 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“外部能力执行与控制中心” | 容易顺手承接 runtime / tools 的旧执行叙事 | 直接打穿 runtime / tools 边界,把 execution truth 并入本仓 | 不采用 |
| 方案 B: 定位为“MCP / A2A / provider 能力池” | 贴近旧 README 和旧需求词汇 | `能力池` 口径天然吸入 Provider Contract、成本、secret、routing、metadata 等杂项 | 不采用 |
| 方案 C: 定位为“capability identity、capability registry 与 adapter descriptor 的能力接入真相仓” | 精确突出本仓应该先闭合的真相范围,同时保留后续 seam 收束空间 | 需要后续 Step 解释 descriptor、relation、seam 与旧术语的映射 | 采用 |
| 方案 D: 定位为“外部集成基础设施中台” | 听起来覆盖 MCP / A2A / API 很自然 | 会把 secret、KMS、provider runtime、cost 平台等基础设施真相误并入本仓 | 不采用 |

### 6.1 是否把 governance / method / SDK 接缝写进 Step 2

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写,留到依赖或接口章节 | Step 2 会丢掉最关键的混淆边界,后续容易再次串线 |
| 方案 B | 在 Step 2 只把它们写成边界对象与接缝方向,不展开为功能或接口 | 能先保护真相边界,又不会提前滑入 Step 6 / Step 12 |

推荐方案 B。原因是用户已经明确要求先闭合 `policy / governance approval seam`、`method-library asset relation`、`SDK exposure boundary`,但 Step 2 只能把它们当边界对象,不能把它们写成功能或接口。

### 6.2 是否把 secret / cost / marketplace 写进仓级定义

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 继续沿用旧材料,把 secret、cost、marketplace metadata 当仓级使命 | 会让本仓重新退化成执行 / 安全 / 计费 / listing 混合中心 |
| 方案 B | 在 Step 2 明确排出 secret platform、cost / billing truth、marketplace listing / transaction truth | 先守住仓级定位,后续若确有需要也只能作为接缝或派生输出进入审计 |

推荐方案 B。原因是这些主题即使后续进入需求主链,也只能以约束、引用、只读 exposure 或事件接缝形式出现,不能成为本仓存在理由。

---

## 7. 结构化中间产物

### 7.1 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L3-capability-hub` 是 L3 方法能力层中负责外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 |
| 本仓不是什么 | 它不是 runtime 执行仓、tools 执行仓、方法资产定义仓、治理审批仓、SDK 客户端仓、provider runtime 仓、secret / KMS 平台、cost / billing 仓、marketplace listing / transaction 仓或 LLM routing 服务。 |
| 边界对象列表 | 仓:`L2-runtime`;仓:`L2-tools`;仓:`L3-method-library`;仓:`L1-governance`;仓:`L0-sdk`;仓:`L6-marketplace`;概念:`capability identity`;概念:`capability registry`;概念:`adapter descriptor`;概念:`governance approval seam`;概念:`method-library asset relation`;概念:`SDK exposure boundary`。 |
| 单独成仓原因 | 平台需要一处独立于运行执行、方法资产定义、治理裁决、客户端封装、marketplace listing 和基础安全 / 计费平台的外部能力接入事实来源。 |

### 7.2 边界说明短文字

`L3-capability-hub` 需要单独存在,因为外部能力的 identity、registry 与 adapter descriptor 会被 runtime、tools、governance、method-library、SDK 和生态入口共同引用,若散落在执行层、方法定义层或客户端封装层,平台会出现多套能力接入真相。它最容易与 `L2-runtime` / `L2-tools` 的执行、`L3-method-library` 的方法资产定义、`L1-governance` 的审批与 Policy truth、`L0-sdk` 的客户端接入以及 `L6-marketplace` 的 listing / 交易混淆;这些边界必须分开,否则后续需求会把能力接入事实误写成执行状态、治理裁决或交易展示。

### 7.3 非职责结论

| 非职责对象 | 结论 |
|---|---|
| `L2-runtime` | `L3-capability-hub` 不拥有 runtime execution truth、运行步骤或外部调用执行状态 |
| `L2-tools` | `L3-capability-hub` 不拥有 tool execution truth、工具结果正文或执行生命周期 |
| `L3-method-library` | `L3-capability-hub` 不拥有 method asset body、方法包或定义正文 |
| `L1-governance` | `L3-capability-hub` 不拥有 governance approval truth、policy effective fact 或审批结论正文 |
| `L0-sdk` | `L3-capability-hub` 不拥有 SDK client、package、三语言封装或默认 client 行为 truth |
| provider runtime | `L3-capability-hub` 不拥有 provider 实际调用链、provider client 行为或 provider 原始状态 |
| secret / KMS / Vault | `L3-capability-hub` 不拥有密钥平台 truth 或安全基础设施生命周期 |
| finance / billing | `L3-capability-hub` 不拥有 provider raw billing、平台计费 truth 或成本结算真相 |
| `L6-marketplace` | `L3-capability-hub` 不拥有 listing truth、交易、购买、定价、履约或安装记录 |
| LLM routing | `L3-capability-hub` 不拥有模型选路、执行调度或运行时路由 truth |

### 7.4 边界对象结论

| 边界对象 | 本步结论 |
|---|---|
| capability identity | 属于本仓当前应先闭合的核心接入语义,不是方法资产 ID 或执行态实例 ID |
| capability registry | 属于本仓当前应先闭合的登记真相,不是工具执行清单或 marketplace 目录 |
| adapter descriptor | 属于本仓当前应先闭合的接入描述语义,不是 provider runtime client 或 SDK client |
| governance approval seam | 属于本仓与 `L1-governance` 的接缝方向,不是治理 truth 本体 |
| method-library asset relation | 属于本仓与 `L3-method-library` 的关系方向,不是方法资产正文 |
| SDK exposure boundary | 属于本仓与 `L0-sdk` 的暴露方向,不是 SDK 客户端实现 |

---

## 8. 回填草稿

以下内容供 Step 17 组装正式 `00-需求文档.md` 时回填到 §2:

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/00_req_step_02_position_boundary.md` 的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本章边界如何收敛。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L3-capability-hub` 是 L3 方法能力层中负责外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 |
| 本仓不是什么 | 它不是 runtime 执行仓、tools 执行仓、方法资产定义仓、治理审批仓、SDK 客户端仓、provider runtime 仓、secret / KMS 平台、cost / billing 仓、marketplace listing / transaction 仓或 LLM routing 服务。 |
| 边界对象列表 | 仓:`L2-runtime`;仓:`L2-tools`;仓:`L3-method-library`;仓:`L1-governance`;仓:`L0-sdk`;仓:`L6-marketplace`;概念:`capability identity`;概念:`capability registry`;概念:`adapter descriptor`;概念:`governance approval seam`;概念:`method-library asset relation`;概念:`SDK exposure boundary`。 |
| 单独成仓原因 | 平台需要一处独立于运行执行、方法资产定义、治理裁决、客户端封装、marketplace listing 和基础安全 / 计费平台的外部能力接入事实来源。 |

`L3-capability-hub` 需要单独存在,因为外部能力的 identity、registry 与 adapter descriptor 会被 runtime、tools、governance、method-library、SDK 和生态入口共同引用,若散落在执行层、方法定义层或客户端封装层,平台会出现多套能力接入真相。它最容易与 `L2-runtime` / `L2-tools` 的执行、`L3-method-library` 的方法资产定义、`L1-governance` 的审批与 Policy truth、`L0-sdk` 的客户端接入以及 `L6-marketplace` 的 listing / 交易混淆;这些边界必须分开,否则后续需求会把能力接入事实误写成执行状态、治理裁决或交易展示。
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 2 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-005` | `adapter descriptor` 是否整体替代旧 `Provider Contract`,还是只覆盖其中一部分外部能力接入语义 | pending | 否 | Step 7 / Step 11 / Step 12 |
| `OQ-CH-006` | governance seam 的最小引用范围是 approval ref、policy effective ref、scope summary 还是更窄的 boundary marker | pending | 否 | Step 6 / Step 10 / Step 11 |
| `OQ-CH-007` | capability 与 method asset 的 relation 是否只允许 body-free ref / relation,还是允许更强摘要 | pending | 否 | Step 7 / Step 11 / Step 12 |
| `OQ-CH-008` | SDK exposure boundary 应在 Step 7 作为核心能力节点出现,还是仅在 Step 12 作为接口边界收口 | pending | 否 | Step 7 / Step 12 |
| `OQ-CH-009` | secret / cost / metadata 在后续是否只允许作为接缝、派生输出或外围增强进入,还是存在进入当前主链的最小必要面 | pending | 否 | Step 4 / Step 10 / Step 13 / Step 14 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 README / 旧 `00~06` 把 execution、secret、cost、marketplace、governance 执行写进本仓 | `historical_conflict_not_blocker` | 这些冲突足以禁止直接继承旧材料,但不阻止 Step 2 收束仓级定位 | 记录为 historical material 冲突,后续各 Step 按当前标准重建 |
| capability identity / registry / adapter descriptor 的具体对象字段未闭合 | `not_blocker_for_step_02` | Step 2 只需要仓级定位,字段和能力节点后移 | Step 7 / Step 11 / Step 12 再闭口 |
| governance seam、method relation、SDK exposure 的具体契约未闭合 | `not_blocker_for_step_02` | Step 2 只需确认接缝方向和非职责 | Step 6 / Step 7 / Step 12 再闭口 |

结论: 未发现阻塞 `00-需求文档.md` Step 2 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 只写仓级定位与边界 | pass | 未提前写使用方与依赖、核心能力闭环、功能、规则、数据、接口或非功能指标 |
| 已给出一句话定义 | pass | 定义为 capability identity、capability registry 与 adapter descriptor 的能力接入真相仓 |
| 已明确本仓不是什么 | pass | 已排除 runtime / tools execution、method body、governance truth、SDK client、marketplace、secret、cost 和 routing |
| 已列出至少 2 个最易混淆边界 | pass | 列出 runtime、tools、method-library、governance、SDK、marketplace 等对象 |
| 旧材料冲突已降级 | pass | README、旧 `00~06` 仍只作为 historical material 和差异审计输入 |
| 是否可进入 Step 3 | `blocked_until_user_confirm` | 必须等待用户确认后才能继续 |
