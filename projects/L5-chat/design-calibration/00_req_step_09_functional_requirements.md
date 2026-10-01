# Step 9 · 功能需求

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §9「功能需求」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 9  
> 直接输入：`00_req_step_07_core_capability_loop.md`、`00_req_step_08_user_stories.md`。  
> 本步按 N1～N4 能力节点归并外部可见功能；功能写成能力主题，不写 CRUD、API、Command、内部流程或代码组织。具体 SDK surface 继续受 `CHAT-UP-001~007` 约束。

## 1. Step 状态与执行计划

- 状态：`[x] 已完成`
- 当前模块：`functional-requirements-by-capability`
- 思考记录：`[x]`
- 结构化写入：`[x]`
- 自检：`[x]`
- gate_status：`pass`
- 回填位置：正式 `00-需求文档.md` §9「功能需求」

### 1.1 Step 内计划

- [x] 按 N1→N4 读取核心故事并归并能力主题。
- [x] 为每项功能写明能力说明、输入、输出、触发条件和失败语义。
- [x] 区分核心闭环能力和外围增强能力。
- [x] 诊断旧文档中的 CRUD/API/transport 功能泄漏。
- [x] 建立功能与核心能力、用户故事的双重映射。
- [x] 完成每个能力节点的功能停审与跨能力孤儿审计。
- [x] 形成正式 §9 回填草稿和 Step 9 门禁结论。

## 2. 本步输入与功能粒度边界

| 输入 | 本步使用方式 | 不直接写入的内容 |
|---|---|---|
| Step 7 N1～N4 | 作为功能分组和闭环映射锚点。 | 不把 N1→N4 逻辑链写成调用时序。 |
| Step 8 `US-CHAT-001~018` | 每项核心功能必须回指至少一条核心故事。 | 不原样重复故事句式。 |
| Step 8 `US-CHAT-E01~E04` | 形成独立外围增强功能，不阻塞核心闭环。 | 不让外围功能压过核心功能。 |
| Step 6 SDK/owner gaps | 为功能输入/失败姿态设置 `pending/blocked/unknown` 边界。 | 不写具体方法名、topic、DTO 或服务私有 API。 |
| Desktop-first 决策 | 仅约束首版平台切片和恢复场景。 | 不把 Tauri/React/Capacitor 写成功能需求本体。 |

## 3. SOP 问题回答

### 3.1 N1 当前必须提供哪些能力？

N1 必须提供“安全进入和保持协作语境”的能力主题：让用户可以从一个正式可见的入口进入对话/线程/项目等语境，知道入口是可见、只读、过期、受限还是暂不可用，并在刷新、深链、Desktop 重启、scope 变化或撤销后安全恢复或清理。

### 3.2 N2 当前必须提供哪些能力？

N2 必须提供“正式协作事实安全显化”的能力主题：把 Conversation/Turn、成员/项目/运行摘要、Gate/Decision 语境和 Artifact 引用/预览组织成可理解的 view，同时保留来源、可见性、版本/新鲜度和部分/不可用状态。

### 3.3 N3 当前必须提供哪些能力？

N3 必须提供“用户意图受控发起与结果反馈”的能力主题：保存草稿与选择，发起普通协作或治理意图，显示提交中、等待、确认、拒绝、失败和未知，并为不确定的副作用提供查询/探测或人工决策入口。

### 3.4 N4 当前必须提供哪些能力？

N4 必须提供“变化、失败、离线与恢复连续性”的能力主题：接收 SDK formal change，处理重复、乱序、缺口、cursor 过期、可见性撤销、断线、缓存过期和 Desktop 重启，恢复到有来源、有降级标记的页面状态。

### 3.5 哪些能力属于外围增强或边界外？

- 搜索、过滤、富文本增强、复杂附件、通知偏好、多窗口布局、托盘和 Mobile 原生体验是外围增强；
- 创建/修改 owner truth、权限裁决、内部 bus、服务私有 API、Runtime/Tools 执行、Artifact 正文/版本/血缘、Workspace projection 和 Observability backend 是边界外能力。

## 4. 核心功能需求表

### 4.1 N1：安全协作语境进入与保持

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-CHAT-001` 安全协作入口与语境选择 | 核心闭环能力 | 系统必须让用户从正式可见的入口进入目标对话、线程、项目或相关协作语境，并明确当前选择。 | N1 安全协作语境进入与保持 | `US-CHAT-001`、`US-CHAT-002` |
| `F-CHAT-002` 入口可见性与可用性表达 | 核心闭环能力 | 系统必须区分可见、只读、受限、过期、等待、不可用和需要重新连接的入口状态。 | N1 | `US-CHAT-003` |
| `F-CHAT-003` 语境恢复与撤销清理 | 核心闭环能力 | 系统必须在刷新、深链、Desktop 重启、scope 改变、登出或可见性撤销后恢复、降级或清理客户端语境。 | N1 | `US-CHAT-002`、`US-CHAT-004` |

### 4.2 N2：正式协作事实安全显化

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-CHAT-004` Conversation/Turn 可理解展示 | 核心闭环能力 | 系统必须根据 owner safe view 显示 Turn 表现、线程关系、来源和仍待确认的状态，不把体验对象当作 Turn truth。 | N2 正式协作事实安全显化 | `US-CHAT-005` |
| `F-CHAT-005` 跨 owner 协作摘要展示 | 核心闭环能力 | 系统必须在授权范围内显示成员、项目和运行安全摘要，并标记来源、范围和降级状态。 | N2 | `US-CHAT-006` |
| `F-CHAT-006` Gate/Decision 语境卡片 | 核心闭环能力 | 系统必须显示 Gate/Decision 的正式语境、责任/状态引用和可用下一步，不本地计算治理结论。 | N2 | `US-CHAT-007` |
| `F-CHAT-007` Artifact 引用与安全预览 | 核心闭环能力 | 系统必须显示 Artifact safe ref、摘要、版本语境、预览结果或不可预览原因，不复制正文。 | N2 | `US-CHAT-007`、`US-CHAT-009` |
| `F-CHAT-008` 来源、新鲜度与降级状态表达 | 核心闭环能力 | 系统必须将来源、可见性、fresh/stale/partial/unavailable/blocked 等信息转化为可理解的页面状态。 | N2 | `US-CHAT-008`、`US-CHAT-009` |

### 4.3 N3：用户意图受控发起与结果反馈

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-CHAT-009` 草稿、回复目标与选择状态 | 核心闭环能力 | 系统必须保存当前语境下的草稿、回复目标、引用/附件 ref 和选择状态，并能明确区分未提交。 | N3 用户意图受控发起与结果反馈 | `US-CHAT-010` |
| `F-CHAT-010` 普通协作意图受控发起 | 核心闭环能力 | 系统必须为用户提供发送或重试普通协作意图的入口，并把其交给正式 owner 处理。 | N3 | `US-CHAT-011` |
| `F-CHAT-011` 治理意图受控发起 | 核心闭环能力 | 系统必须为被授权的审批者提供提交治理意图的入口，并将治理结果留给 Governance owner。 | N3 | `US-CHAT-012` |
| `F-CHAT-012` 命令结果与不确定性反馈 | 核心闭环能力 | 系统必须区分 local intent、submitted/pending、confirmed、rejected、failed 和 unknown，并提供查询/探测或人工决策提示。 | N3 | `US-CHAT-011`、`US-CHAT-012`、`US-CHAT-013` |

### 4.4 N4：变化、失败、离线与恢复连续性

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-CHAT-013` 正式变化消费与页面更新 | 核心闭环能力 | 系统必须消费 SDK 暴露的正式变化并更新相关页面，同时保持来源、可见性和版本语境。 | N4 变化/失败/离线/恢复连续性 | `US-CHAT-014` |
| `F-CHAT-014` 重复、乱序、缺口与 cursor 失效处理 | 核心闭环能力 | 系统必须显式处理 duplicate、out-of-order、gap、expired 或 revoked 输入，不重复渲染或越权续读。 | N4 | `US-CHAT-014`、`US-CHAT-017` |
| `F-CHAT-015` 断线、Desktop 重启与恢复 | 核心闭环能力 | 系统必须在连接丢失、应用重启或变化恢复后保留可解释历史、恢复上下文和下一步提示。 | N4 | `US-CHAT-015`、`US-CHAT-016` |
| `F-CHAT-016` 离线展示与安全缓存 | 核心闭环能力 | 系统必须支持带版本/可见性语境的安全展示缓存和草稿恢复，但不得离线确认业务成功或继续授权。 | N4 | `US-CHAT-010`、`US-CHAT-015` |
| `F-CHAT-017` 低敏客户端诊断入口 | 核心闭环能力 | 系统必须让支持人员看到连接、缓存、恢复和错误类别等低敏状态，并提供正式诊断/重试提示。 | N4 | `US-CHAT-018` |

## 5. 外围增强功能需求

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-CHAT-E01` 历史搜索与高级过滤 | 外围增强能力 | 系统可提供跨语境搜索、过滤和定位能力，但结果仍需遵守 owner visibility 和 freshness。 | 外围增强；不决定 N1～N4 | `US-CHAT-E01` |
| `F-CHAT-E02` Desktop 通知、托盘与快捷入口 | 外围增强能力 | 系统可提供通知、托盘和快捷入口以缩短返回协作语境的路径，但平台通知不代表业务提交。 | 外围增强；依附 N1/N4 | `US-CHAT-E02` |
| `F-CHAT-E03` 富文本与复杂附件体验 | 外围增强能力 | 系统可增强编辑和附件组织能力，但附件仍只保存安全 ref，提交结果仍由 owner 确认。 | 外围增强；依附 N3 | `US-CHAT-E03` |
| `F-CHAT-E04` Mobile 便捷体验 | 外围增强能力 | 系统未来可提供 Capacitor/mobile 推送、后台恢复、手势和分享体验，不作为 V1 Desktop 前置。 | 外围增强；依附 N1/N4 | `US-CHAT-E04` |

## 6. 功能能力卡片

### 6.1 N1 功能卡片

| 功能 | 输入语境 | 用户可见输出 | 触发条件 | 失败/降级 |
|---|---|---|---|---|
| `F-CHAT-001` | actor、scope、owner safe ref、visibility | 当前入口、scope 选择、受限/不可用提示 | 用户打开入口、深链或切换语境 | restricted / unavailable / blocked，不从缓存猜测。 |
| `F-CHAT-002` | owner visibility/availability 结果、freshness | 可见、只读、过期、等待、需重连状态 | 查询返回或语境变化 | fail-closed，避免泄露对象存在性。 |
| `F-CHAT-003` | 当前 route、scope、撤销/登出/重启语境 | 恢复、清理、重新进入或安全退出 | 刷新、重启、scope 变更、撤销 | 清除敏感 view，显示 needs-action。 |

### 6.2 N2 功能卡片

| 功能 | 输入语境 | 用户可见输出 | 触发条件 | 失败/降级 |
|---|---|---|---|---|
| `F-CHAT-004` | Conversation/Turn safe view、线程关系、来源 | 可理解的 Turn/线程展示、来源和状态 | 进入语境或正式变化 | partial/stale/unavailable，不补正文。 |
| `F-CHAT-005` | Identity/Work/Member/Runtime safe summary | 成员、项目、运行摘要和来源 | 页面打开或 owner change | opaque / stale / blocked，不推断生命周期。 |
| `F-CHAT-006` | Governance safe view、当前授权语境 | GateCard、责任/状态引用、受控下一步 | Gate/Decision 可见 | read-only/pending/blocked，不本地批准。 |
| `F-CHAT-007` | Artifact ref、summary、preview/visibility 结果 | 引用、摘要、预览或不可预览说明 | 对话引用或用户打开 | unavailable/not-visible，绝不读取 raw body。 |
| `F-CHAT-008` | provenance、version/watermark、visibility、freshness | 来源标签、过期/部分/不可用/受限说明 | 每次 view 组装和变化 | unknown/blocked，不把缺失当 fresh。 |

### 6.3 N3 功能卡片

| 功能 | 输入语境 | 用户可见输出 | 触发条件 | 失败/降级 |
|---|---|---|---|---|
| `F-CHAT-009` | 当前 scope、draft、reply/attachment ref、selection | 草稿、未提交标记、恢复和清理入口 | 输入、选择、离开/恢复 | draft-only，不写 owner truth。 |
| `F-CHAT-010` | 已验证 scope、用户意图、幂等语境 | submitting/pending/confirmed/rejected/failed/unknown | 用户发送/重试 | unknown 时查询/待决策，不盲重放。 |
| `F-CHAT-011` | 已验证治理语境、授权结果、用户选择 | 受控 Gate 操作入口和正式结果状态 | 审批者明确提交 | blocked/rejected/unknown，不显示虚假成功。 |
| `F-CHAT-012` | transport outcome、receipt/result、后续 owner view | 可区分的结果状态和下一步 | 请求返回、查询或变化 | 不能从 ACK 推导 confirmed。 |

### 6.4 N4 功能卡片

| 功能 | 输入语境 | 用户可见输出 | 触发条件 | 失败/降级 |
|---|---|---|---|---|
| `F-CHAT-013` | SDK formal change、当前 view provenance | 更新后的 view、来源和变化提示 | owner change/resume | stale/reconnecting/blocked，不直订内部 bus。 |
| `F-CHAT-014` | change identity、cursor/resume、visibility | 去重、缺口、过期和重新查询提示 | duplicate/gap/expired/revoked | fail-closed，不猜顺序。 |
| `F-CHAT-015` | route、recovery context、SDK resume/query result | Desktop 重启/断线后的恢复状态 | 连接中断、应用重启 | reconnecting/needs-action/unknown。 |
| `F-CHAT-016` | safe cache、source version、visibility expiry、draft | 离线阅读、过期标记、草稿恢复 | 网络不可用或离线启动 | cache-only/unavailable，不离线确认业务。 |
| `F-CHAT-017` | 低敏错误、连接、缓存和恢复状态 | 支持入口、重试提示和 correlation | 用户求助或客户端异常 | 不展示 raw log、secret 或业务正文。 |

## 7. 功能依赖与闭环映射

```text
F-CHAT-001~003  安全协作语境
        |
        v
F-CHAT-004~008  正式事实显化
        |
        v
F-CHAT-009~012  受控意图与结果
        |
        v
F-CHAT-013~017  变化/失败/恢复连续性
```

该图是功能对能力的逻辑依赖，不是 API 调用、事件时序或实施顺序。每个功能仍必须经后续规则、数据、接口、非功能和验收章节进一步约束。

## 8. 故事承接与孤儿审计

| 检查项 | 结论 |
|---|---|
| `US-CHAT-001~004` 是否有 N1 功能承接？ | 是，`F-CHAT-001~003`。 |
| `US-CHAT-005~009` 是否有 N2 功能承接？ | 是，`F-CHAT-004~008`。 |
| `US-CHAT-010~013` 是否有 N3 功能承接？ | 是，`F-CHAT-009~012`。 |
| `US-CHAT-014~018` 是否有 N4 功能承接？ | 是，`F-CHAT-013~017`。 |
| `US-CHAT-E01~E04` 是否有外围功能承接？ | 是，`F-CHAT-E01~E04`。 |
| 是否存在功能没有故事来源？ | 否；每项功能表均回指故事或明确外围故事。 |
| 是否存在边界外功能进入正式功能表？ | 否；owner truth、SDK 通用实现、内部 bus、Runtime/Tools、Artifact body、Workspace projection 和 Observability backend 均排除。 |
| 是否按对象/CRUD/API 拆分功能？ | 否；功能按用户可见业务能力主题拆分。 |

## 9. 能力级功能停审

### N1 停审

- `F-CHAT-001~003` 覆盖入口、可见性、恢复和撤销清理；
- 每项都回指 `US-CHAT-001~004`；
- 没有把路由库、SDK method 或缓存实现写成功能；
- N1 可以进入规则讨论，其他节点不在本小节混写。

### N2 停审

- `F-CHAT-004~008` 覆盖 Turn、跨 owner 摘要、Gate、Artifact、来源/新鲜度/降级；
- 每项都回指 `US-CHAT-005~009`；
- 没有把正文、Policy、Decision、Project、Member、Runtime 或 Workspace truth 收入 Chat；
- N2 可以进入规则讨论。

### N3 停审

- `F-CHAT-009~012` 覆盖草稿、普通意图、治理意图和结果不确定性；
- 每项都回指 `US-CHAT-010~013`；
- 未将 ACK、toast、optimistic state 写成 confirmed；
- N3 可以进入规则讨论。

### N4 停审

- `F-CHAT-013~017` 覆盖 formal change、去重/缺口、断线/重启、缓存/离线和低敏诊断；
- 每项都回指 `US-CHAT-014~018`；
- 未将内部 bus、cursor implementation、cache store 或 Observability backend 写成功能本体；
- N4 可以进入规则讨论。

## 10. 复杂度判断与设计取舍

| 复杂度来源 | 判断 | 控制方式 |
|---|---|---|
| 跨 owner safe view | 高 | 功能只规定展示能力，来源/visibility/freshness 后续由接口与规则约束。 |
| 命令结果和 unknown | 高 | 将用户意图、transport、receipt、confirmed 和 probe 分离。 |
| Desktop-first 交付 | 中 | 先覆盖 Desktop 重启/通知/窗口/文件选择，Mobile 功能标为外围。 |
| 功能数量 | 中 | 17 项核心功能覆盖 N1～N4，4 项外围单独列出，不把每个对象拆成 CRUD。 |
| SDK gaps | 高 | 所有精确 surface 保持 `pending/blocked`，不在功能需求中伪造方法或事件。 |

采用“能力节点→功能主题→输入/输出/失败→故事映射”的结构，不采用按页面、对象、API 或仓库模块生成的全局功能表。

## 11. 正式文档回填草稿

正式 `00-需求文档.md` §9 可回填为：

> L5-chat 的核心功能需求按四个闭环节点组织。N1 包括安全协作入口与语境选择、入口可见性/可用性表达、语境恢复与撤销清理；N2 包括 Conversation/Turn 可理解展示、跨 owner 协作摘要、Gate/Decision 语境卡片、Artifact 引用与安全预览、来源/新鲜度/降级表达；N3 包括草稿/回复目标/选择状态、普通协作意图、治理意图和命令结果/不确定性反馈；N4 包括正式变化消费、重复/乱序/缺口/cursor 失效处理、断线/Desktop 重启恢复、离线展示/安全缓存和低敏客户端诊断入口。
>
> 搜索/过滤、Desktop 通知与托盘、富文本/附件增强和 Mobile 便捷体验属于外围增强。每项核心功能都能回指 Step 8 用户故事和 Step 7 能力节点；Chat 不提供 owner truth 创建/修改、权限裁决、SDK 通用实现、内部 bus、Runtime/Tools 执行、Artifact 正文/版本/血缘、Workspace projection 或 Observability backend。

## 12. Step 9 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按 N1～N4 能力节点组织功能？ | 是 | 未先生成全仓大表再贴标签。 |
| 每项功能是否回指用户故事？ | 是 | 核心 `F-CHAT-001~017` 和外围 `F-CHAT-E01~E04` 均有故事映射。 |
| 功能是否按业务能力而非 CRUD/API/Command 拆分？ | 是 | 使用能力主题和用户可见输出。 |
| 是否写明输入、输出、触发和失败？ | 是 | 已形成四个能力卡片表。 |
| 是否区分核心与外围？ | 是 | 17 项核心、4 项外围独立列出。 |
| 是否混入边界外能力？ | 否 | 边界外能力仅在审计中列出。 |
| 每个节点是否完成停审？ | 是 | N1～N4 均有停审结论。 |
| 是否完成故事孤儿和功能孤儿审计？ | 是 | 已形成承接与孤儿审计表。 |

### 12.1 进入 Step 10 条件

- 每项功能都有能力节点和用户故事来源；
- 输入、外部可见输出、触发和失败/降级语义已明确到需求层；
- 核心、外围和边界外能力已分离；
- 功能未写成接口、事件、代码模块或内部流程；
- 允许创建并完成 `00_req_step_10_rules_boundary_constraints.md`，为 N1～N4 功能逐项补硬规则。

## 13. 本步结论

Step 9 将四个核心能力节点归并为 17 项核心功能和 4 项外围增强功能。功能需求覆盖安全入口、事实显化、草稿/意图、结果反馈、变化消费、恢复和低敏诊断，并且每项都能回指故事与闭环节点。所有精确 SDK/owner surface、接口时序和实现组织继续后移，下一步只讨论约束这些功能成立所需的业务规则与边界。
## 14. 原型修复回写

新增功能需求覆盖项目详情/进度一体化、整体 BPMN 与阶段子流程下钻、并行分支与汇聚展示、项目/群聊双向入口、关联群聊列表和公司成员目录入口；每项只定义用户可见能力和降级姿态。

- 新增编号：`F-CHAT-018~021`。
- 自检：未把流程引擎、绑定写入、成员同步或审批提交实现写成功能事实。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

项目详情与流程下钻、项目与群聊双向入口、BPMN 并行结构和公司成员目录作为核心展示功能，必须经正式 owner projection；缺少 projection 时只能呈现 unavailable、restricted 或 blocked。


### 9.1 核心功能

| 功能需求 | 必须提供的外部可见能力 | 节点 / 故事 |
|---|---|---|
| `F-CHAT-001` 安全协作入口与语境选择 | 从正式可见入口进入对话、线程、项目或相关协作语境，并明确当前选择。 | N1；`US-CHAT-001~002` |
| `F-CHAT-002` 入口可见性与可用性表达 | 区分可见、只读、受限、过期、等待、不可用和需重连的入口姿态。 | N1；`US-CHAT-003` |
| `F-CHAT-003` 语境恢复与撤销清理 | 刷新、深链、Desktop 重启、scope 改变、登出或撤销后恢复、降级或清理本地语境。 | N1；`US-CHAT-002/004` |
| `F-CHAT-004` Conversation/Turn 可理解展示 | 根据 owner safe view 显示 Turn 类型表现、线程关系、来源和待确认状态。 | N2；`US-CHAT-005` |
| `F-CHAT-005` 跨 owner 协作摘要展示 | 在授权范围显示成员、项目和运行安全摘要及其来源、范围与降级。 | N2；`US-CHAT-006` |
| `F-CHAT-006` Gate/Decision 语境卡片 | 显示 Gate/Decision 的正式语境、责任/状态引用和可用下一步，不本地计算结论。 | N2；`US-CHAT-007` |
| `F-CHAT-007` Artifact 引用与安全预览 | 显示 safe ref、摘要、版本语境、正式预览结果或不可预览原因，不复制正文。 | N2；`US-CHAT-007/009` |
| `F-CHAT-008` 来源、新鲜度与降级状态表达 | 将来源、visibility、fresh/stale/partial/unavailable/blocked 等结果转成可理解页面状态。 | N2；`US-CHAT-008/009` |
| `F-CHAT-009` 草稿、回复目标与选择状态 | 保存当前语境的未提交草稿、回复目标、安全引用和选择状态。 | N3；`US-CHAT-010` |
| `F-CHAT-010` 普通协作意图受控发起 | 提供发送与受控重试入口，经 SDK 交给 Conversation owner。 | N3；`US-CHAT-011` |
| `F-CHAT-011` 治理意图受控发起 | 仅为被正式授权者提供 Gate/Decision 意图入口，经 SDK 交给 Governance owner。 | N3；`US-CHAT-012` |
| `F-CHAT-012` 命令结果与不确定性反馈 | 区分 local intent、submitted/pending、confirmed、rejected、failed、unknown，并提示查询或人工下一步。 | N3；`US-CHAT-011~013` |
| `F-CHAT-013` 正式变化消费与页面更新 | 消费 SDK 暴露的正式变化，更新相关页面并保留来源、visibility 和版本语境。 | N4；`US-CHAT-014` |
| `F-CHAT-014` 重复、乱序、缺口与 cursor 失效处理 | 显式处理 duplicate、out-of-order、gap、expired、revoked，不重复渲染或越权续读。 | N4；`US-CHAT-014/017` |
| `F-CHAT-015` 断线、Desktop 重启与恢复 | 连接丢失、应用重启或变化恢复后保留可解释历史、恢复语境和下一步提示。 | N4；`US-CHAT-015/016` |
| `F-CHAT-016` 离线展示与安全缓存 | 以带版本/可见性语境的安全缓存支持离线阅读和草稿恢复，不离线确认业务成功。 | N4；`US-CHAT-010/015` |
| `F-CHAT-017` 低敏客户端诊断入口 | 让支持人员理解连接、缓存、恢复和错误类别，提供正式诊断/重试提示。 | N4；`US-CHAT-018` |

| `F-CHAT-018` 项目详情与流程下钻 | 在项目详情中提供概览、项目进度、关联群聊、工作项和证据标签；项目进度支持整体流程、阶段子流程和节点详情。 | N1/N2；`US-CHAT-019` |
| `F-CHAT-019` 项目与群聊双向入口 | 显示正式项目绑定摘要；从群聊进入项目，从项目进入多个可见关联群聊；不从成员集合推断可见性。 | N1/N2；`US-CHAT-020` |
| `F-CHAT-020` BPMN 并行结构显化 | 显示独立并行分叉、并行分支、并行汇聚和后续 Governance Gate；不由客户端计算完成或批准。 | N2/N4；`US-CHAT-021` |
| `F-CHAT-021` 公司成员目录与成员范围区分 | 提供公司级人员安全目录和直接对话入口，区分 Identity、项目成员和当前群聊成员来源。 | N1/N2；`US-CHAT-022` |

### 9.2 外围增强功能

| 功能需求 | 条件化能力 | 故事 |
|---|---|---|
| `F-CHAT-E01` 历史搜索与高级过滤 | 仅在已授权范围内搜索、过滤和定位；不能从空结果推断不可见对象。 | `US-CHAT-E01` |
| `F-CHAT-E02` Desktop 通知、托盘与快捷入口 | 缩短返回协作语境的路径；通知/托盘不代表业务提交。 | `US-CHAT-E02` |
| `F-CHAT-E03` 富文本与复杂附件体验 | 增强编辑和安全 ref 组织；Artifact 正文与提交结果仍归 owner。 | `US-CHAT-E03` |
| `F-CHAT-E04` Mobile 便捷体验 | 后续在正式平台范围内提供推送、后台恢复、手势和分享，不作为 V1 Desktop 前置。 | `US-CHAT-E04` |


功能输入、输出和失败姿态由 `design-calibration/00_req_step_09_functional_requirements.md` 的能力卡片限定。所有正向 owner surface 未闭合时保持 read-only、blocked、unavailable、stale 或 unknown，不用假数据补全。
