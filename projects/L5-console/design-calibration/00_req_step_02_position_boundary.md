# Step 02 · 本仓定位与边界

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 02 · 本仓定位与边界 |
| 输出文件 | `design-calibration/00_req_step_02_position_boundary.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取通用规范 | yes |
| 已读取 SOP / 书写规范 | yes，需求 SOP Step 2、需求书写规范 §4.2 |
| 已读取前序输入 | yes，项目台账、需求 flow、Step 1、产品/架构来源、专项上游边界、draft 01（仅线索） |
| 模块骨架 | done：一句话定义 / 非职责 / 边界对象 / 单独成仓原因 / historical 差异 |
| 进入条件 | `pass`，Step 1 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 1 来源结论和 §4.2 固定格式 | done | 后续不重写来源关系 |
| 回答定位、独立成仓、非职责、易混淆对象四问 | done | 见 §4 |
| 诊断旧 Console “组织治理中心”是否越权 | done | 见 §5 |
| 比较产品壳、治理域、服务聚合层三种定位 | done | 见 §6 |
| 收束边界声明表与边界说明 | done | 见 §7 |
| 判断是否需拆附录 | done | 不拆；正式 §2 只保留固定边界表和短文 |
| 形成回填草稿 | done | 见 §9 |
| 自检并同步门禁 | done | 见 §11~12 |

## 3. 本步输入

| 输入 | 承接结论 |
|---|---|
| Step 1 | Console 来源于管理者产品叙事与 L5 管理后台位置，但不能重定义任何上游 truth。 |
| `product/产品矩阵.md` §4.1 | Console 是组织管理者、合规官、方法论制定者使用的独立管理者产品。 |
| `architecture/仓库拆分方案.md` §8.3 | Console 是 L5 UI/产品层的管理后台，不是 L1~L4 服务。 |
| 全局依赖规则 | Console 编译期只依赖共享契约/SDK，运行期经 SDK 消费正式管理能力。 |
| 专项上游 §2 边界 | identity/work/process/governance/artifact/workspace/member-service/method/capability/observability/archive/sandbox 各自拥有正式 truth。 |
| draft 01 | 提供“页面/会话/草稿/筛选/布局/view model”候选所有权，需在本 Step 重新核验。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓一句话定义是什么？ | `L5-console` 是组织治理与管理操作台的产品边界，负责把正式服务提供的管理查询和受控操作组织为可导航、可理解、可恢复且可访问的客户端体验。 |
| 为什么它需要单独成仓？ | 管理者需要跨多个 truth owner 的统一操作入口，而页面导航、客户端会话、草稿、筛选、布局、view model 和交互韧性有独立的产品生命周期；把它并入任一领域仓会使领域 truth 与 UI 状态混层，把它并入 Chat 又会混淆协作入口与组织治理入口。 |
| 本仓不是什么？ | 不是成员/项目/过程/治理/制品/workspace/方法/能力/观测/归档/sandbox 真相仓，不是服务端聚合或授权裁决层，不是业务运行器、审计系统或证据签署方。 |
| 最容易与哪些相邻仓或概念混淆？ | 与 `L1-governance` 混淆治理决定，与 `L1-workspace` 混淆跨域视图 truth，与 `L0-sdk` 混淆访问封装，与 `L4-observability` 混淆审计/指标 truth，与其他 owner 的管理命令混淆业务操作本体；还容易把 UI session、缓存、toast、feature flag 或 route 当作授权/业务事实。 |

## 5. 当前材料与旧文档问题诊断

| 旧材料位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| 旧 `README.md` 仓使命 | 称 Console 为“组织治理中心” | “中心”易被理解为治理 truth owner，而产品矩阵实际说明其是组织级治理入口 | 改称“组织治理与管理操作台的产品边界” |
| 旧 `README.md` 核心模块 | 把员工、方法、审计、能力池、权限配置作为 Console 自有模块 | 页面入口与上游业务所有权未分开 | 只保留入口/交互责任，业务 truth 逐项归 owner |
| 旧 `00` 定位和功能 | 写“只消费与操作六域真相”，同时又定义 RBAC、哈希验证、Provider Contract、固定治理规则 | “操作”没有区分意图提交与 owner committed，形成二次授权/治理真相 | 明确 Console 只拥有客户端意图、适配和结果呈现 |
| 旧 `02/03` | 把 ConsoleWorkspace、PanelState、ActionEntry 做成服务端聚合和持久化业务对象 | UI/local state 被升级为服务端正式真相 | 降级为后续设计可核验的客户端状态类别线索 |
| draft 01 | 边界已较清晰，但列出大量交互方和拥有/消费细项 | 若直接回填会超过 §4.2 粒度并提前进入数据/依赖章节 | 本 Step 只抽取最小边界声明，细项后移至 Step 6/11/12 |

## 6. 改动前后对比与设计取舍

### 6.1 改动前后对比

| 主题 | 旧口径 | 当前结论 |
|---|---|---|
| 仓定位 | 组织治理中心 / 管理后台 | 组织治理与管理操作台的 L5 产品边界 |
| 自有职责 | 员工/治理/审计/能力等管理能力本体 | 页面导航、客户端会话、草稿、筛选、布局、view model、查询/命令适配和前端受控状态 |
| 外部事实 | “消费与操作六域真相”但缺清晰上限 | 只读取正式结果或提交意图；owner 决定业务结果 |
| 与 Workspace | ConsoleWorkspace 服务端聚合 | Workspace projection 不迁移；Console 只持有客户端选择与呈现状态 |
| 与 Governance | Console 可发布/裁决治理对象的感觉 | Console 只呈现正式决定与提交已获授权的请求 |

### 6.2 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| A. 将 Console 定位为所有管理 API 的服务端聚合层 | 页面取数看似统一 | 形成跨域第二真相、共享数据库/规则复制和授权绕过风险 | 不采用 |
| B. 将 Console 定位为纯静态 dashboard | 边界保守 | 无法承接正式管理意图、草稿、结果确认和错误恢复 | 不采用 |
| C. 定位为客户端产品边界，拥有交互状态并经 SDK/正式边界编排 owner 能力 | 既能提供完整管理体验，又保持 truth owner 单一 | 必须认真呈现 partial/stale/unknown 和上游合同缺口 | 采用 |
| D. 合并进 Chat | 减少一个产品入口 | 日常协作与组织治理的信息架构、角色和操作风险不同 | 不采用 |

## 7. 结构化中间产物

### 7.1 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L5-console` 是组织治理与管理操作台的产品边界，负责将正式服务的管理查询和受控操作组织成可导航、可理解、可恢复且可访问的客户端体验。 |
| 本仓不是什么 | 它不是任何业务、治理、制品、workspace、能力、观测、归档或隔离真相仓，不是服务端聚合层、授权/审批/合规裁决层，也不是运行或证据签署系统。 |
| 边界对象列表 | 层：L1/L2/L3/L4 正式服务；仓：`L0-sdk`；仓：`L1-governance`；仓：`L1-workspace`；仓：`L4-observability`；产品：`L5-chat`；概念：客户端会话/缓存/草稿/路由/布局；概念：Policy/Gate/visibility/readiness |
| 单独成仓原因 | 跨域管理入口的页面导航、客户端会话、草稿、筛选布局、view model 和交互韧性具有独立产品生命周期，必须与各 owner 的正式业务 truth 及 Chat 的日常协作体验分离。 |

### 7.2 拥有 / 只呈现 / 禁止拥有摘要

此表用于验证边界声明，不直接回填正式 §2 的固定表。

| 分类 | 内容 |
|---|---|
| Console 可拥有 | 页面导航与选择、客户端会话壳、表单草稿、筛选/排序/布局、view model、请求生命周期、焦点与可访问性呈现、有限且可失效的客户端缓存 |
| Console 只呈现/编排 | 正式 actor/scope/visibility、owner query result、owner command receipt/result、source/version/freshness/coverage、治理/审计/指标/能力/归档/sandbox 状态 |
| Console 禁止拥有/推导 | 成员/项目/过程/治理/制品/workspace/方法/能力/观测/归档/sandbox truth，授权/审批/合规/evidence/readiness 结论，跨域强一致快照 |

### 7.3 关键边界反例

| 反例 | 为什么越界 |
|---|---|
| 按前端 role 字符串决定按钮可用并提交 | 本地字符串不是正式 visibility/authorization 决定 |
| 用页面刷新或 toast 成功宣布成员已退休 / 方法已发布 | transport/UI 状态不是 owner committed result |
| 把多个 dashboard 卡片拼成统一“组织健康/合规通过”结论 | 各 source 的定义、覆盖和时效不同，Console 无裁决权 |
| 将 Workspace cursor、页面更新时间或本地 cache 当项目进度 | view/local state 不能替代 work/process/workspace truth |
| 自建哈希链验证、Provider Contract 或 sandbox readiness | 侵入 observability/capability/sandbox owner 边界 |

### 7.4 blocker 判断

| blocker | 判断 |
|---|---|
| 上位产品定位是否冲突 | no，产品矩阵和架构拆分均支持独立 Console |
| 多个专项 owner 是否存在所有权冲突 | no，Console 统一作为产品消费/交互边界即可 |
| tenant/org scope 未闭口是否阻塞定位 | no，只阻塞后续 exact scope/接口设计，不阻塞仓级边界 |
| exact SDK/服务合同未闭口是否阻塞定位 | no，定位明确要求经正式边界且不宣称已集成 |

## 8. 复杂度判断

边界对象多，但正式 §2 只需固定四行边界表与一段短文。本 Step 不拆模块；详细 owner 分工、客户端数据分类、依赖和接口分别留给 Step 6、11、12，避免在定位章节过早展开。

## 9. 回填草稿

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议阅读上述文件的“边界声明表”“拥有 / 只呈现 / 禁止拥有摘要”“设计取舍”和“关键边界反例”小节。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L5-console` 是组织治理与管理操作台的产品边界，负责将正式服务的管理查询和受控操作组织成可导航、可理解、可恢复且可访问的客户端体验。 |
| 本仓不是什么 | 它不是任何业务、治理、制品、workspace、能力、观测、归档或隔离真相仓，不是服务端聚合层、授权/审批/合规裁决层，也不是运行或证据签署系统。 |
| 边界对象列表 | 层：L1/L2/L3/L4 正式服务；仓：`L0-sdk`；仓：`L1-governance`；仓：`L1-workspace`；仓：`L4-observability`；产品：`L5-chat`；概念：客户端会话/缓存/草稿/路由/布局；概念：Policy/Gate/visibility/readiness |
| 单独成仓原因 | 跨域管理入口的页面导航、客户端会话、草稿、筛选布局、view model 和交互韧性具有独立产品生命周期，必须与各 owner 的正式业务 truth 及 Chat 的日常协作体验分离。 |

`L5-console` 需要单独存在，因为跨域管理信息架构和高风险操作反馈具有独立的产品职责。它最容易与 Governance 的决定真相、Workspace 的跨域视图、SDK 的访问封装和 Observability 的审计/指标真相混淆；这些边界必须分离，才能让 Console 改进管理体验而不制造第二套业务、授权或合规事实。
```

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-002` | tenant / organization scope 的正式 owner 和语义 | 边界层只承认其为正式外部语境；不由 Console 建模或推导 | `open / non_blocking_for_step_3` |
| `CON-Q-003` | Console 与 Chat 将来是否共享壳、组件或导航链接 | 当前只确立产品职责分离；共享实现后移到架构/概要设计 | `open / non_blocking_for_requirements` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否能用 3~5 句话说明定位 | pass |
| 是否明确本仓不是什么 | pass |
| 是否列出至少两个易混淆边界 | pass |
| 是否区分 UI-owned state 与 owner truth | pass |
| 是否未展开依赖关系、核心能力、功能、规则、数据或接口 | pass |
| 是否未写 API、DTO、数据库、repository、handler、代码目录或技术框架 | pass |
| 是否没有把待确认 scope / SDK 合同写成已成立 | pass |
| 是否发现阻塞 Step 3 的上游 blocker | no |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 定位四问、诊断、取舍、固定边界表、回填和自检完整 | 更新 flow，激活 Step 3 | 本文件；Step 1；书写规范 §4.2 |
| 文档级 | `pass_to_step_03` | Console-owned client/product boundary 与所有外部 truth owner 已分开 | 创建并完成 `00_req_step_03_problem_context.md` | Step 1；本文件 |
| 项目级 | `pass_with_open_upstream_pending` | 上游 pending 不影响背景/问题讨论；正式 00 仍不可写 | 进入 Step 3 | 项目台账；需求 flow |
