# Step 01 · 与上游文档的关系声明

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 01 · 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取通用规范 | yes，设计通则、中间产物规范、真相源闭环与可落码性标准、全局依赖规则 |
| 已读取 SOP / 书写规范 | yes，需求 SOP Step 1、需求书写规范 §4.1 |
| 已读取项目输入 | yes，项目台账、三篇 draft、Workspace draft 参考审计、产品/架构来源、专项上游正式文档和必要台账 |
| 历史材料读取时机 | 已先从权威上游独立收敛来源，再用旧 README / 旧正式文档做后置差异审计 |
| 用户授权 | yes，用户已明确认可并授权完成整个正式 00 |
| 进入条件 | `pass` |

## 2. Step 内计划

| 计划项 | 状态 | 可审查产物 / 门禁 |
|---|---|---|
| 读取当前项目台账和需求 flow | done | 当前只允许 Step 1，正式 00 尚不可写 |
| 读取 Step 1 SOP 与书写规范 §4.1 | done | 本 Step 只收束来源、承接主题和短收束说明 |
| 从产品、架构和全局依赖基线识别直接来源 | done | 见 §7.1 来源映射表 |
| 从专项上游正式文档识别主题来源与真相边界 | done | 见 §7.2 专项来源分层 |
| 逐项回答 SOP 问题 | done | 见 §4 |
| 后置审计旧 README / 旧 00~06 与预校准 draft | done | 见 §5、§7.3 |
| 比较方案并形成取舍 | done | 见 §6 |
| 形成结构化产物 | done | 见 §7 |
| 判断复杂度与是否拆附录 | done | 不拆；Step 1 只需一份来源主表和分层审计 |
| 生成正式第 1 章回填草稿 | done | 见 §9，严格采用固定三列表 + 2~3 句收束说明 |
| 自检并更新 flow / 项目台账 | done | 见 §11~12 |

## 3. 本步输入

### 3.1 规范与全局来源

| 输入 | 本步使用方式 |
|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 固定 Step 1 的四个问题和进入 Step 2 条件。 |
| `standards/document/需求文档书写规范.md` | 固定正式第 1 章为“来源文档 / 上游章节或模块 / 承接内容”三列表和一段短收束说明。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 确认 `L5-console` 位于 L5 产品/分发并行窗口，编译期依赖 `L0-core / L0-sdk`，运行期只经 SDK 消费 L1/L2/L3/L4 管理能力。 |
| `product/最终目的.md` | 承接“用户是管理者”“过程始终可观察”“管理与治理能力族”的产品承诺。 |
| `product/产品矩阵.md` | 承接 Console 作为独立管理者产品、组织级治理入口和 SDK 统一接入原则。 |
| `architecture/仓库拆分方案.md` | 承接 `quantalithos-console` 是 L5 管理后台独立产品仓的架构位置。 |

### 3.2 专项上游正式来源

| 上游 | 本步只承接的主题 | 本步不做的事 |
|---|---|---|
| `L0-sdk` | 端侧产品经官方客户端接入正式服务能力 | 不假设尚未闭合的具体 client、路径或 DTO |
| `L1-identity` | 平台级成员身份与生命周期真相 | 不把成员真相、认证或授权裁决转为 Console 真相 |
| `L1-work` / `L1-process` | 项目、成员参与、工作和过程事实 | 不从页面状态推导项目/过程状态 |
| `L1-governance` | Policy、Gate、SoA、AIIA、Control 等治理决定真相 | 不重新计算审批、合规或 Gate 结论 |
| `L1-artifact` | 制品、版本、血缘、baseline 与 evidence truth | 不复制正文或签署 evidence verdict |
| `L1-workspace` | 跨域安全视图与局部投影边界 | 不迁移 projection、cursor、rebuild 或 Inbox truth |
| `L2-member-service` | 成员宿主编排与运行会话状态边界 | 不把容器/session/credential 状态归 Console |
| `L3-method-library` | 方法、Role、Template、Policy、ViewProfile 定义与版本真相 | 不把表单草稿当方法资产正式版本 |
| `L3-capability-hub` | 能力注册、暴露、适配与访问治理真相 | 不发明 Provider Contract 或推导 readiness |
| `L4-observability` | 观测、审计、指标、lineage 与 report 的正式读取/交接语境 | 不自建哈希链、指标定义、报告或 evidence |
| `L4-sandbox` | 隔离执行状态与安全红线真相 | 不执行隔离、不推导运行 readiness |
| `L4-archive` | 归档/恢复材料、完整性、兼容性与 handoff 状态 | 不拥有 Bundle 或推导 owner committed |

### 3.3 参考与历史输入

| 输入 | 定位 | 使用限制 |
|---|---|---|
| `draft/01_项目作用与交互对象.md` | `pre-calibration_input` | 只提供候选来源关系和边界线索，须由本 Step 重验 |
| `draft/02_功能推演.md` | `pre-calibration_input` | 不在 Step 1 继承功能编号或能力节点 |
| `draft/03_模块划分与分层.md` | `pre-calibration_input` | 不在 Step 1 继承模块、对象或状态机候选 |
| `console_workspace_draft_reference_audit.md` | `reference_audit` | 只承接 Workspace draft 的讨论粒度与污染结论 |
| 旧 `README.md`、旧 `00/01/02/03/05/06` | `historical_material` | 只用于识别旧技术栈、固定数字、Provider Contract、API/数据库/服务端聚合等污染 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本文承接哪些上游文档？ | 直接承接 `product/最终目的.md`、`product/产品矩阵.md`、`architecture/仓库拆分方案.md` 和全局依赖规则；专项承接 `L0-sdk` 以及列定 L1/L2/L3/L4 owner 的当前正式文档和必要台账。 |
| 承接的是上游哪一部分主题？ | 承接“管理者需要组织治理入口”“L5-console 是独立管理后台”“端侧经 SDK 访问正式服务”和“各业务/治理/制品/视图/能力/观测/归档/隔离真相各归其 owner”的主题。 |
| 本文为什么不是重新定义该主题？ | 产品与架构文档已经确定 Console 的上位目的和层级，各专项上游已确定真相 owner。本文只把这些来源转译为 Console 的仓级外部可见需求，不改变上游领域语义、控制项集合、指标定义、审批规则或执行结果。 |
| 本文在当前仓里承担什么细化作用？ | 把上位产品承诺和 owner 边界收束成可追溯、可验收的管理操作台需求，并显式挂起未闭合的 SDK/服务合同；后续 01~07 必须从新版 00 继续推导。 |

## 5. 当前材料与旧文档问题诊断

| 旧材料位置 | 旧口径 | 当前判断 | 理由 | 回填影响 |
|---|---|---|---|---|
| `README.md` 仓定位 / 关键依赖 | 固定 TypeScript + React/Svelte、ECharts/D3、Tailwind 和目录树 | 后移 | 属技术选型与实现组织，不是 Step 1 来源主题 | 不进入正式第 1 章 |
| `README.md` 核心交互模块 / 维护纪律 | 固定 38 控制项、Provider Contract、哈希链一键验证与报告 | 废弃为权威；保留为污染线索 | 当前 owner 文档未授权 Console 固定这些业务数字和对象 | 不进入来源结论；Step 15 记录风险 |
| 旧 `00` §1 | 只以产品叙事直推，把治理/观测/能力池旧文档当已成立 UI 合同 | 修改 | 缺 SDK 边界、truth owner 分层和 pending 传递 | 新来源表逐主题列产品、架构、依赖与专项 owner |
| 旧 `00` §2~13 | 将旧指标、API、SLA、技术问题和实现假设倒灌为需求 | 废弃 / 后移 | 超出 Step 1 且包含无 authority 结论 | 后续各 Step 独立重验，不在本步继承 |
| 旧 `01/02/03/05/06` | ConsoleWorkspace、PanelState、Provider Contract、RPC/MQ/数据库/repository 等 | historical only | 后续设计不能反向定义新需求 | 仅在对应 Step 的后置差异审计中出现 |
| 三篇 Console draft | 已提出 owner-safe、pending、错误/过期/部分数据等候选 | 保留为 pre-calibration 线索 | draft 明示非正式，不能跳过 SOP 收敛 | 只辅助检查遗漏，不替代结构化结论 |

旧材料最大问题不是缺少页面，而是把“上游产品愿景”“owner 正式事实”“Console 展示/交互状态”“未闭合合同”和“历史技术方案”放在同一权威层。若不先分层，后续会把页面入口错误升级为治理能力，或把固定数字、HTTP 成功和 UI 状态误当成正式结果。

## 6. 改动前后对比与设计取舍

### 6.1 改动前后对比

| 主题 | 旧口径 | 本步收敛后 |
|---|---|---|
| 来源主轴 | Console 产品叙事 + 少量旧上游 | 产品/架构/全局依赖 + SDK + 各专项 owner 正式边界 |
| 权威层级 | 产品、旧 README、旧服务文档并列 | 正式上游优先；draft 与旧材料明确降级 |
| 服务接入 | 直接列 Server API/RPC 候选 | 只承接“经 SDK 或正式服务边界”，exact surface pending |
| 管理对象 | 旧页面对象看似由 Console 定义 | 对象 truth 仍归 identity/work/process/governance/artifact/workspace/method/capability/observability/archive/sandbox |
| 固定结论 | 38 控制项、8 指标、Provider Contract、性能阈值 | 无当前 authority 一律不进入新版来源结论 |

### 6.2 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| A. 仅列三篇产品/架构来源 | 正式第 1 章简短 | 无法解释为什么多域面板不能拥有多域 truth | 不采用 |
| B. 把所有专项上游逐主题列入来源映射，正式正文保持主题级 | 能建立完整 truth-owner 追溯且符合 §4.1 粒度 | 来源表较长 | 采用 |
| C. 把旧 README 和旧正式文档列为平级来源 | 容易保留历史信息 | 会把技术框架、固定数字和旧接口升格为当前基线 | 不采用 |
| D. 直接沿用 draft 的候选能力与功能编号 | 推进快 | 绕过 Step 2~9 的独立门禁 | 不采用 |

## 7. 结构化中间产物

### 7.1 来源映射表

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `product/最终目的.md` | `§3.1 用户是管理者，不是开发者` | 管理者表达意图、做关键决定和查看结果的产品主题 |
| `product/最终目的.md` | `§3.6 过程始终可观察` | 过程、决定和责任链对授权用户可查的产品主题 |
| `product/最终目的.md` | `§6.6 管理与治理能力族` | 员工、方法、组织审计和指标管理的产品范围主题 |
| `product/产品矩阵.md` | `§2.3 五个共同产品原则` | 端侧产品经 SDK 统一接入、交互能力与可观察性原则 |
| `product/产品矩阵.md` | `§4.1 Console — 组织治理中心` | Console 作为独立管理者产品和组织级治理入口的定位 |
| `architecture/仓库拆分方案.md` | `§8.3 quantalithos-console` | L5 管理后台独立产品仓的架构位置 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4 总依赖矩阵 / L5-console` | 编译期、运行期和事件协作依赖的全局裁剪基线 |
| `projects/L0-sdk/00-需求文档.md` | `§2 本仓定位与边界；§6 使用方与依赖` | 官方客户端接入层与 L5 产品统一访问边界 |
| `projects/L1-identity/00-需求文档.md` | `§2 本仓定位与边界` | 平台级成员身份与生命周期真相主题 |
| `projects/L1-work/00-需求文档.md` | `§2 本仓定位与边界` | 项目、ProjectMember、WorkItem 等工作真相主题 |
| `projects/L1-process/00-需求文档.md` | `§2 本仓定位与边界` | 过程定义消费、过程实例与活动进展真相主题 |
| `projects/L1-governance/00-需求文档.md` | `§2 本仓定位与边界` | Policy、Gate、SoA、AIIA、Control 等治理真相主题 |
| `projects/L1-artifact/00-需求文档.md` | `§2 本仓定位与边界` | 制品、版本、血缘、baseline 与 evidence 真相主题 |
| `projects/L1-workspace/00-需求文档.md` | `§2 本仓定位与边界` | 跨域安全视图及 workspace 局部状态主题 |
| `projects/L2-member-service/00-需求文档.md` | `§2 本仓定位与边界` | 成员宿主生命周期编排与运行会话边界主题 |
| `projects/L3-method-library/00-需求文档.md` | `§2 本仓定位与边界` | 方法资产定义、版本与发布真相主题 |
| `projects/L3-capability-hub/00-需求文档.md` | `§2 本仓定位与边界` | 能力注册、正式暴露、适配与访问治理真相主题 |
| `projects/L4-observability/00-需求文档.md` | `§2 本仓定位与边界` | 观测、审计投影、指标与报告交接真相主题 |
| `projects/L4-sandbox/00-需求文档.md` | `§2 本仓定位与边界` | 隔离执行环境、限制、捕获、失败与清理真相主题 |
| `projects/L4-archive/00-需求文档.md` | `§2 本仓定位与边界` | 归档/恢复材料、完整性、兼容性与 owner handoff 真相主题 |

### 7.2 来源权威分层

```text
当前用户授权 + 当前适用标准
  -> 产品 / 架构 / 全局依赖正式来源
  -> 已停审专项上游正式文档与台账
  -> 本轮 L5-console Step 中间产物
  -> 新版 L5-console 正式 00（仅 Step 17 装配）

pre-calibration draft ---------> 仅作线索，不跨越 Step 门禁
旧 README / 旧正式 00~06 -----> historical_material / 污染审计
其他未停审 L5/L6 项目 -------> pending，不成为本仓真相
```

该图只表达来源权威和收束方向，不表达依赖调用、页面流程、API、事件或实现结构。

### 7.3 不重新定义清单

| 不重新定义的主题 | 正式 owner / 来源 |
|---|---|
| 身份、项目、工作、过程、治理、制品与 workspace truth | 对应 L1 正式 owner |
| 成员宿主和运行会话 truth | `L2-member-service` |
| 方法资产、能力注册/访问治理 truth | `L3-method-library`、`L3-capability-hub` |
| 观测/审计/指标/report truth | `L4-observability` |
| 归档/恢复材料与隔离执行 truth | `L4-archive`、`L4-sandbox` |
| SDK 公共接入语义与服务暴露合同 | `L0-sdk` 及各正式服务 owner |
| 控制项数量、指标集合、阈值、Provider/adapter 业务对象 | 对应正式 owner；没有 authority 时保持 pending |

### 7.4 blocker 判断

| 判断项 | 结论 |
|---|---|
| 是否具备支撑 Step 1 的产品/架构来源 | yes |
| 是否具备支撑 truth-owner 分层的专项正式来源 | yes |
| exact SDK / owner query-command surface 是否全部闭口 | no；但不阻塞 Step 1，后续作为能力级 pending 传递 |
| 其他 Layer 5 项目是否可成为本仓来源 | no；未停审内容只记 pending |
| 旧材料污染是否阻塞推进 | no；已通过 historical 降级和后置审计隔离 |

## 8. 复杂度判断

本 Step 来源数量多，但结构单一，只涉及“来源 → 主题 → 权威限制”。不拆分模块或附录，避免把专项 owner 的详细边界提前写进 Step 1；具体仓际依赖留给 Step 6，接口能力留给 Step 12。正式第 1 章必须比本中间产物更精炼，只保留固定来源表和 2~3 句收束说明。

## 9. 回填草稿

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议阅读上述文件的“来源映射表”“来源权威分层”“旧文档问题诊断”和“不重新定义清单”小节。

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `product/最终目的.md` | `§3.1 用户是管理者，不是开发者` | 管理者表达意图、作关键决定和查看结果的产品主题 |
| `product/最终目的.md` | `§3.6 过程始终可观察` | 过程、决定和责任链对授权用户可查的产品主题 |
| `product/最终目的.md` | `§6.6 管理与治理能力族` | 员工、方法、组织审计和指标管理的产品范围主题 |
| `product/产品矩阵.md` | `§2.3 五个共同产品原则` | 端侧经 SDK 统一接入、交互能力与可观察性原则 |
| `product/产品矩阵.md` | `§4.1 Console — 组织治理中心` | Console 作为独立管理者产品与组织级治理入口的定位 |
| `architecture/仓库拆分方案.md` | `§8.3 quantalithos-console` | L5 管理后台独立产品仓的架构位置 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4 总依赖矩阵 / L5-console` | 本仓编译期、运行期和事件协作依赖基线 |
| `projects/L0-sdk/00-需求文档.md` | `§2 本仓定位与边界；§6 使用方与依赖` | L5 产品统一客户端接入主题 |
| `projects/L1-identity/00-需求文档.md` | `§2 本仓定位与边界` | 平台成员身份真相主题 |
| `projects/L1-work/00-需求文档.md` | `§2 本仓定位与边界` | 项目与工作真相主题 |
| `projects/L1-process/00-需求文档.md` | `§2 本仓定位与边界` | 过程实例与进展真相主题 |
| `projects/L1-governance/00-需求文档.md` | `§2 本仓定位与边界` | 治理决定真相主题 |
| `projects/L1-artifact/00-需求文档.md` | `§2 本仓定位与边界` | 制品、血缘、baseline 与 evidence 真相主题 |
| `projects/L1-workspace/00-需求文档.md` | `§2 本仓定位与边界` | 跨域安全视图与 workspace 局部状态主题 |
| `projects/L2-member-service/00-需求文档.md` | `§2 本仓定位与边界` | 成员宿主编排与运行会话边界主题 |
| `projects/L3-method-library/00-需求文档.md` | `§2 本仓定位与边界` | 方法资产定义与版本真相主题 |
| `projects/L3-capability-hub/00-需求文档.md` | `§2 本仓定位与边界` | 能力注册、暴露与访问治理真相主题 |
| `projects/L4-observability/00-需求文档.md` | `§2 本仓定位与边界` | 观测、审计、指标和报告真相主题 |
| `projects/L4-sandbox/00-需求文档.md` | `§2 本仓定位与边界` | 隔离执行状态与安全红线真相主题 |
| `projects/L4-archive/00-需求文档.md` | `§2 本仓定位与边界` | 归档/恢复材料、完整性与 handoff 真相主题 |

本文讨论的是上述产品承诺和正式 owner 边界在 `L5-console` 的需求收束方式。本文不重新定义任何业务、治理、制品、视图、能力、观测、归档或隔离真相，只细化组织治理与管理操作台的外部可见行为；未闭合的 SDK/服务合同继续保持 pending。
```

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-001` | 各 owner 面向 Console 的 exact query/command 与统一可见性/降级合同尚未全部闭口 | Step 1 只承接 owner 与访问原则；Step 6/12 再逐项登记依赖，不发明路径、字段或错误码 | `open / non_blocking_for_step_2` |
| `CON-Q-002` | tenant / organization scope 的正式 owner 与消费合同尚未完全闭口 | 只承接“管理者语境”产品主题，不在 Step 1 定义 scope 模型 | `open / non_blocking_for_step_2` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 四个 SOP 问题是否逐项回答 | pass |
| 正式回填是否采用书写规范 §4.1 固定三列表 | pass |
| 正式收束说明是否只回答主题、非重定义和细化层级 | pass |
| 是否未提前展开本仓定位、功能、数据、接口或状态机 | pass |
| 是否逐行拆开同一来源中的不同语义单元 | pass |
| 是否先依据正式上游收敛，再做旧材料后置审计 | pass |
| 是否把 draft 与旧正式文档降级 | pass |
| 是否未继承固定控制项、指标数量、阈值、Provider Contract 或技术框架 | pass |
| 是否未把上游 pending 写为 ready / integrated | pass |
| 是否发现阻塞 Step 2 的上游 blocker | no |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 问题回答、诊断、取舍、结构化、复杂度、回填和自检均完成 | 更新文档级 flow，激活 Step 2 | 本文件；需求 SOP Step 1；书写规范 §4.1 |
| 文档级 | `pass_to_step_02` | 来源、承接主题、权威分层和 historical 降级已收束 | 只创建并完成 `00_req_step_02_position_boundary.md` | 本文件；`00_requirements_calibration_flow.md` |
| 项目级 | `pass_with_open_upstream_pending` | 当前 pending 不阻塞需求边界讨论，但禁止形成正向集成结论 | 进入 Step 2；正式 00 仍禁止写入 | `project_execution_ledger.md`；本文件 |
