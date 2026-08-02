# L4-sandbox 00 需求 Step 5: 用户与角色

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 4,允许进入 Step 5;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 5 章“用户与角色”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 用户与角色 |
| 输出文件 | `design-calibration/00_req_step_05_users_roles.md` |
| 前置确认 | pass:用户在 Step 4 停审后回复“同意 / 继续”,允许进入 Step 5 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 5;`需求文档书写规范.md` §4.5 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00/01/02/03/05/06` 中角色、权限、Security、SRE、Runner、Runtime 和审计线索 |
| 已读取参考粒度 | yes:`projects/L1-governance/design-calibration/00_req_step_05_users_roles.md`;`projects/L1-artifact/design-calibration/00_req_step_05_users_roles.md` |
| 历史材料口径 | 旧角色表和旧权限矩阵只作角色线索与污染审计输入,不继承为当前结论 |
| 禁写范围 | 不写仓际依赖、用户故事、核心能力闭环、功能、业务规则、数据归属、接口、NFR、验收、schema、API path、event payload、port、repository、配置 key、后端选型或实施边界 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_6 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~4、SOP、书写规范和旧角色材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 主要角色、人类 / 系统分类、接触场景、管理 / 审计 / 维护角色、权限矩阵必要性 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 旧角色表污染、旧权限矩阵污染、相邻仓误写为角色、实现者角色误写为需求角色诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 角色主轴、系统角色抽象、Runner / AI member 处理、权限矩阵处理取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 角色说明表、角色分类表、非角色排除表、权限差异口径、后续 Step 保护线 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录 / 是否生成权限矩阵判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 5 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 5 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 6。 |

---

## 2. 必读摘要

| 文档 | Step 5 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 5 | 本步明确谁以什么身份接触本仓,区分人类角色与系统角色;输出角色结论、系统角色结论、使用场景结论和必要时的权限差异结论。 | 不把仓际依赖写成角色,不把用户故事写成角色说明,不把接口动作写进使用场景。 |
| `需求文档书写规范.md` §4.5 | 正式第 5 章推荐“角色 / 类型 / 使用场景”表;权限矩阵仅按需,且操作类型只能是能力级动作。 | 本 Step 必须形成角色说明表;若权限矩阵会滑入 API、Command、事件或配置,则不生成正式矩阵。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,负责受控执行环境的身份、限制、捕获、观测、失败和清理边界。 | 角色必须围绕受控执行环境的接触场景,不能围绕工具语义、runtime 主线、member 宿主或后端产品。 |
| `00_req_step_04_goals_non_goals.md` | 目标覆盖统一受控执行边界、隔离执行环境主轴、输出 / 观测 / 失败 / 清理分层;非目标排除相邻仓 truth 和后端选型。 | 角色表必须保护 tools/runtime/member/identity/work/artifact/observability/governance/runner 边界。 |
| 旧 `README.md` | 旧材料强调 Runtime Tool 调用、Runner App、安全沙箱、资源限制、默认无出网、审计事件和 Runner/Member 共用接口。 | 只保留“受控执行、Runner、SRE/Security、审计和共享隔离底座”的角色线索;不继承后端、接口和事件名。 |
| 旧 `00-需求文档.md` §4 | 旧角色表列 `runtime / tools 开发者`、`runner 开发者`、`SRE / Security`、`governance / capability-hub`,并有 Runtime / Runner / Admin / Security / 系统权限矩阵。 | 旧表混入实现者、仓际依赖和接口操作;必须重建为身份角色和接触场景。 |
| 旧 `02/05/06` | 旧文档反复出现 Security、operators、SRE、audit、cleanup、replay、control history 等线索。 | 可吸收安全审查、运维维护和审计查看角色;不继承测试 case、验收项、对象名或 evidence 口径。 |
| `L1-governance` / `L1-artifact` Step 5 参考 | 参考项目均先回答 SOP 问题,再审计旧角色表和权限矩阵,最后形成角色表和不写权限矩阵或仅写能力级差异的取舍。 | L4-sandbox 需保持同等粒度,但不能复制其他项目角色。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本仓有哪些主要角色? | 主要角色是以身份接触受控执行环境的人类、平台成员或系统 actor,包括受控执行请求方 / 系统调用方、AI member / 自动化执行者、Runner 操作者 / 运行触发者、安全审查者、运维 / SRE / 平台维护者、审计者 / 合规查看者、Sandbox 后台维护 actor / reaper。 |
| 哪些是人类角色,哪些是系统角色? | Runner 操作者、安全审查者、运维 / SRE / 平台维护者、审计者 / 合规查看者是人类角色;受控执行请求方 / 系统调用方和 Sandbox 后台维护 actor / reaper 是系统角色;AI member / 自动化执行者是平台成员 / 自动化来源角色,其身份 truth 仍归 `L1-identity`,执行主线 truth 仍归 runtime / member-service。 |
| 这些角色分别在什么场景下接触本仓? | 受控执行请求方在需要运行代码、工具、构建、测试或 Runner 应用时请求受控执行环境;AI member 的真实动作被放入隔离边界;Runner 操作者通过上层产品触发需要隔离运行的应用;安全审查者审查高风险边界和安全红线;运维 / SRE 处理资源、失败、清理和后端健康语境;审计者查看执行材料和责任链;后台维护 actor 执行 lease、cleanup、orphan reaper 和维护信号。 |
| 是否存在管理、审计或维护类角色? | 存在。安全审查者承担安全边界审查;运维 / SRE / 平台维护者承担运行维护语境;审计者 / 合规查看者承担追溯查看;Sandbox 后台维护 actor / reaper 承担系统维护动作。它们均不能通过角色身份创造业务 truth、artifact truth、observability store truth 或治理裁决。 |
| 是否需要进一步补权限矩阵? | 当前不补正式权限矩阵。旧矩阵的“请求执行沙箱、配置 backend/policy、查看审计链、销毁沙箱”等操作已经滑入功能、规则、配置、接口或运维控制;本步只记录能力级差异方向,留到 Step 8~12 和后续设计展开。 |

---

## 4. 当前材料诊断

### 4.1 旧角色表污染诊断

| 旧表达 | 可保留线索 | 当前问题 | Step 5 处理 |
|---|---|---|---|
| `runtime / tools 开发者` | 有“系统调用方需要受控执行环境”的线索。 | 这是实现者 / 相邻仓开发者口径,且把仓名当角色。 | 转译为“受控执行请求方 / 系统调用方”;相邻仓名称留到 Step 6。 |
| `runner 开发者` | 有 Runner 触发隔离运行的线索。 | “开发者”是实现读者,不是需求角色;Runner 产品语义不归 sandbox。 | 转译为“Runner 操作者 / 运行触发者”;Runner 仓依赖留到 Step 6。 |
| `SRE / Security` | 有运维、安全审查和事故排查线索。 | 旧表把配置、安全、资源和审计混在一个角色里。 | 拆为安全审查者、运维 / SRE / 平台维护者、审计者 / 合规查看者。 |
| `governance / capability-hub` | 有策略输入和 allow/deny 语境线索。 | 这是相邻仓 / 策略来源,不是角色;且策略决策不归 sandbox。 | 不进入角色表;后移 Step 6 使用方与依赖、Step 10 规则边界。 |
| `Runtime`、`Runner`、`Admin / Security`、`系统` 权限矩阵列 | 有发起、维护、审计和系统维护差异线索。 | 矩阵直接写接口式操作和配置动作,越过 Step 5 粒度。 | 不继承矩阵;只保留角色差异方向。 |

### 4.2 相邻仓误写为角色诊断

`L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work`、`L1-artifact`、`L4-observability`、governance / capability 和 `L5-runner` 都可能与 sandbox 接触,但它们在 Step 5 不应被写成角色。Step 5 只能写“谁以什么身份接触本仓”;仓际关系、运行期依赖、事件协作和禁止依赖必须留到 Step 6 / Step 12。

### 4.3 角色与职责层级诊断

| 角色候选 | 容易写错的方向 | 当前边界 |
|---|---|---|
| 受控执行请求方 / 系统调用方 | 写成 `L2-runtime`、`L2-tools` 或具体接口调用。 | 只表达系统以受控方式请求隔离执行;不命名接口、事件或仓依赖。 |
| AI member / 自动化执行者 | 写成 identity、runtime 或 member-service truth。 | 只表达真实动作需要被隔离承载;身份和执行主线 truth 外部拥有。 |
| Runner 操作者 / 运行触发者 | 写成 Runner 产品流程、CLI 或 UI。 | 只表达上层触发需要隔离运行的产物或应用;Runner 产品语义外部拥有。 |
| 安全审查者 | 写成策略决策或 allowlist truth。 | 只审查 sandbox 边界和安全红线是否落实;策略决策外部拥有。 |
| 运维 / SRE / 平台维护者 | 写成容器平台 owner 或后端产品选型。 | 只处理运行维护、失败定位、资源压力和清理语境;后端选型后置。 |
| 审计者 / 合规查看者 | 写成 observability store 或 artifact evidence truth。 | 只查看执行材料和责任链;不拥有观测存储或正式制品证据 truth。 |
| Sandbox 后台维护 actor / reaper | 写成业务裁决、runtime recover 或 artifact 入库。 | 只执行 lease、cleanup、orphan reaper、维护信号;不创造业务结论。 |

---

## 5. 设计取舍

### 5.1 角色主轴取舍

| 方案 | 内容 | 优点 | 问题 | 决策 |
|---|---|---|---|---|
| 方案 A | 沿用旧 `runtime/tools 开发者`、`runner 开发者`、`SRE/Security`、`governance/capability-hub`。 | 保留旧文本多。 | 把实现者、仓际依赖和角色混写。 | 不采用。 |
| 方案 B | 按受控执行接触方式拆:请求、被隔离执行、Runner 触发、安全审查、运维维护、审计查看、后台 reaper。 | 能回指 Step 2/4 边界,也不提前写依赖或功能。 | 后续 Step 6 仍需把具体仓际关系补齐。 | 采用。 |
| 方案 C | 只写“系统调用方、安全、运维”三类。 | 简短。 | 漏掉 AI member、Runner 触发、审计查看和后台维护角色。 | 不采用。 |
| 方案 D | 按容器后端或运行平台角色拆。 | 贴近运维实现。 | 把后端产品和配置提前写进需求角色。 | 不采用。 |

### 5.2 AI member 与 Runner 的处理取舍

AI member 和 Runner 都必须出现在角色语境中,但表达方式不同:

- AI member / 自动化执行者是被隔离承载的行动来源,不是 sandbox 内部身份 truth。
- Runner 操作者 / 运行触发者是上层产品入口或人类触发语境,不是 Runner 仓、CLI、UI 或一键运行产品语义。
- 两者都不能让 sandbox 反向拥有 runtime agent loop、member lifecycle、Runner 工作流或 identity truth。

### 5.3 权限矩阵取舍

| 方案 | 内容 | 影响 | 当前取舍 |
|---|---|---|---|
| 方案 A | 保留旧角色权限矩阵。 | 会把请求执行、配置 backend/policy、销毁沙箱、查看审计链等操作提前写成 Step 5 结论。 | 不采用。 |
| 方案 B | 新建能力级矩阵。 | 仍可能提前进入功能、规则、接口、配置和运维控制,且角色差异可由后续 Step 承接。 | 当前不采用。 |
| 方案 C | 不形成正式权限矩阵,只记录能力级差异方向。 | Step 5 粒度稳定;后续故事、功能、规则、数据、接口再展开。 | 采用。 |

---

## 6. 结构化中间产物

### 6.1 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 受控执行请求方 / 系统调用方 | 系统角色 | 在平台内部需要运行代码、工具、构建、测试或 Runner 应用时,以受控方式请求 sandbox 建立隔离执行环境。 |
| AI member / 自动化执行者 | 平台成员 / 自动化来源角色 | 其真实动作需要被放入隔离边界执行;身份、推理、计划推进和宿主生命周期不归 sandbox。 |
| Runner 操作者 / 运行触发者 | 人类或产品入口角色 | 通过上层 Runner 或产品入口触发需要隔离运行的产物或应用,并消费隔离执行后的结果语境。 |
| 安全审查者 | 人类安全角色 | 审查高风险执行边界、策略落实结果、deny / fail-closed 行为和安全红线是否成立。 |
| 运维 / SRE / 平台维护者 | 人类运维角色 | 处理资源压力、执行失败、环境异常、cleanup / reaper 观察和隔离后端健康语境。 |
| 审计者 / 合规查看者 | 人类审计角色 | 查看执行输出、候选材料、失败分类、清理记录和可追溯材料,用于责任链与合规复核。 |
| Sandbox 后台维护 actor / reaper | 系统维护角色 | 执行租约检查、orphan 环境发现、清理触发、维护信号和安全保守回收动作,不创造业务结论。 |

### 6.2 角色分类结论

| 分类 | 包含角色 | 说明 |
|---|---|---|
| 受控执行触发类 | 受控执行请求方 / 系统调用方;Runner 操作者 / 运行触发者 | 表达“谁触发需要隔离的执行”,不写具体调用方仓名、API 或产品流程。 |
| 被隔离执行来源类 | AI member / 自动化执行者 | 表达真实动作来源,但不拥有身份、runtime、member-service 或工具 truth。 |
| 安全与审计类 | 安全审查者;审计者 / 合规查看者 | 表达安全红线审查与责任链查看,不拥有策略决策、observability store 或 artifact truth。 |
| 运维维护类 | 运维 / SRE / 平台维护者;Sandbox 后台维护 actor / reaper | 表达运行维护、失败定位、租约清理和 reaper 语境,不拥有后端产品或业务裁决 truth。 |

### 6.3 非角色排除表

| 对象 | 不作为 Step 5 角色的原因 | 后续落点 |
|---|---|---|
| `L2-tools` | 工具定义、工具策略和工具结果 truth 归 tools;仓名不是角色。 | Step 6 使用方与依赖;Step 12 接口与依赖。 |
| `L2-runtime` | ExecutionInstance、agent loop、checkpoint / recover 和结果回流归 runtime。 | Step 6 / Step 12。 |
| `L2-member-service` | MemberExecutionHost、SandboxBinding 装配和宿主生命周期归 member-service。 | Step 6 / Step 10 / Step 12。 |
| `L1-identity` / `L1-work` | 身份和工作事实只作为执行上下文引用,不是 sandbox 角色。 | Step 6 / Step 11。 |
| `L1-artifact` / `L4-observability` | 正式制品 truth 和观测存储 truth 不归 sandbox。 | Step 6 / Step 11 / Step 12。 |
| governance / capability / policy 来源 | 策略决策、授权审批、allowlist truth 不归 sandbox。 | Step 6 / Step 10 / Step 12。 |
| container / k8s / isolation backend | 后端产品和部署拓扑不是需求角色。 | 01 架构;04 配置;07 实施计划。 |

### 6.4 权限差异口径

本 Step 不形成正式权限矩阵,只记录后续必须承接的能力级差异方向:

- 受控执行请求方关注能否以正式边界请求隔离执行。
- AI member / 自动化执行者关注其动作是否被隔离承载,而不是直接操作 sandbox。
- Runner 操作者关注上层触发后的隔离运行结果语境,不直接拥有 sandbox 控制权。
- 安全审查者关注安全红线、deny / fail-closed 和策略落实结果。
- 运维 / SRE 关注资源、失败、清理、后端健康和故障定位。
- 审计者关注执行材料、失败分类、清理记录和责任链查看。
- 后台维护 actor / reaper 只能执行系统维护动作,不得推进业务 truth、runtime truth 或 artifact truth。

### 6.5 后续 Step 保护线

| 后续 Step | Step 5 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 6 使用方与依赖 | 把具体 `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner` 等放回依赖裁剪,而不是角色表。 | 不把角色说明重复写成依赖关系。 |
| Step 7 核心能力闭环 | 能力节点需覆盖触发、隔离执行、策略落实、安全审查、审计查看和维护清理语境。 | 不把角色表直接变成能力清单。 |
| Step 8 用户故事 | 故事可使用本 Step 角色作为主语,但必须围绕 Step 7 能力节点组织。 | 不把角色场景原文复制成故事。 |
| Step 9~12 | 功能、规则、数据、接口需回指角色差异,同时保护非角色排除表。 | 不写 API path、DTO schema、事件 payload 或后端配置。 |
| Step 13~14 | NFR 和验收可覆盖安全、审计、运维维护和 reaper 角色关注点。 | 不继承旧测试结果、证据 alias 或验收签署。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | Step 5 只输出角色、场景和权限差异口径,不需要单独依赖或接口附录。 |
| 是否生成权限矩阵 | no | 当前角色差异明显,但旧矩阵已混入接口、配置、功能和运维控制;后续 Step 再按能力展开。 |
| 是否生成依赖类中间产物 | no | 相邻仓只进入非角色排除表;依赖裁剪属于 Step 6。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 5 的上游冲突;旧材料冲突已作为 historical_material 处理。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 5 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 5. 用户与角色

> 校准来源：
> - `design-calibration/00_req_step_05_users_roles.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何把旧角色表、旧权限矩阵和相邻仓线索收束为当前角色边界。

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 受控执行请求方 / 系统调用方 | 系统角色 | 在平台内部需要运行代码、工具、构建、测试或 Runner 应用时,以受控方式请求 sandbox 建立隔离执行环境。 |
| AI member / 自动化执行者 | 平台成员 / 自动化来源角色 | 其真实动作需要被放入隔离边界执行;身份、推理、计划推进和宿主生命周期不归 sandbox。 |
| Runner 操作者 / 运行触发者 | 人类或产品入口角色 | 通过上层 Runner 或产品入口触发需要隔离运行的产物或应用,并消费隔离执行后的结果语境。 |
| 安全审查者 | 人类安全角色 | 审查高风险执行边界、策略落实结果、deny / fail-closed 行为和安全红线是否成立。 |
| 运维 / SRE / 平台维护者 | 人类运维角色 | 处理资源压力、执行失败、环境异常、cleanup / reaper 观察和隔离后端健康语境。 |
| 审计者 / 合规查看者 | 人类审计角色 | 查看执行输出、候选材料、失败分类、清理记录和可追溯材料,用于责任链与合规复核。 |
| Sandbox 后台维护 actor / reaper | 系统维护角色 | 执行租约检查、orphan 环境发现、清理触发、维护信号和安全保守回收动作,不创造业务结论。 |

本章不形成正式权限矩阵。受控执行请求、安全红线审查、运维维护、审计查看和后台 reaper 的差异,将在用户故事、功能需求、业务规则、数据归属、接口和验收章节继续展开。
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确主要角色及其接触场景 | pass | 已形成 7 类角色和使用场景。 |
| 是否区分人类角色与系统角色 | pass | 已区分人类、系统、平台成员 / 自动化来源和系统维护角色。 |
| 是否覆盖管理、审计或维护类角色 | pass | 已覆盖安全审查、运维 / SRE、审计 / 合规查看和后台 reaper。 |
| 是否没有把仓际依赖写成角色 | pass | `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-artifact`、`L4-observability`、governance / capability 和后端产品均进入非角色排除表。 |
| 是否没有把用户故事写成角色说明 | pass | 未使用“作为...我希望...”故事句式。 |
| 是否没有把接口动作写进使用场景 | pass | 未写 API path、Command 名、event kind、schema、配置 key 或后端调用。 |
| 是否处理权限矩阵必要性 | pass | 已决定当前不生成正式矩阵,只保留能力级差异方向。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现或验收证据。 |
| 是否允许进入 Step 6 | pass_wait_review | 技术上 Step 5 已完成;按用户要求等待审查确认后再进入 Step 6。 |

next_allowed_action: `wait_user_confirm_step_6`
