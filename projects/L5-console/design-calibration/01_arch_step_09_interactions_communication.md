# 01 架构 Step 9：关键交互与通信方式

> 对应正式章节：`01-架构设计.md` §10 关键交互与通信方式  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 8 已通过门禁。本步只判断关键交互适合“同步请求 / 响应”“异步事件 / 回调”还是“后台任务 / 延后承接”，并说明正式边界、选择理由和失败姿态；不写接口路径、方法名、事件名、topic、DTO、schema、协议、中间件、重试参数、时序步骤或运行实现。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 4、6、8、正式 `00` §12、架构 SOP Step 9 与书写规范 §4.10 | done | §2 |
| 回答同步、异步、后台、正式边界和降级问题 | done | §3 |
| 诊断旧 API/event/poll/optimistic/export helper 与后台职责污染 | done | §4 |
| 比较全同步、事件投影、客户端后台编排和分类型正式边界方案 | done | §5 |
| 输出关键交互场景表与通信方式判断表 | done | §6.1~§6.2 |
| 输出简化交互图、边界红线和失败降级表 | done | §6.3~§6.5 |
| 按九个架构单元逐项停审 | done | §6.6 |
| 完成交互组停审、跨交互审计、回填草稿与三层门禁 | done | §6.7~§10 |

本步的“同步”只表示当前正式交互边界需要即时给出可判别结果或明确失败，不承诺业务副作用已经完成；“异步”只表示正式事实变化或提示的延后送达，不授予 Console 事件真相；“后台”只表示工作由正式 owner 延后承接，不表示 Console 新增 worker、consumer 或 job。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_04_system_context.md` | 提供入口环境、L0 正式访问边界、各 L1~L4 owner 和条件化诊断边界。 |
| `01_arch_step_06_container_deployment.md` | 提供浏览器侧交互客户端、有界客户端状态承载，以及“无 Console worker/consumer/BFF”的运行上限。 |
| `01_arch_step_08_data_ownership_consistency.md` | 提供安全即时约束、只读影子最终收敛、owner-confirmed 结果和 unknown 挂起口径。 |
| `00-需求文档.md` §12 | 提供能力级 query、受控意图、结果回查、可选 SDK 状态提示、owner 异步工作和无业务事件输出结论。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 9 | 规定先识别场景，再判断通信类型，并按架构单元停审。 |
| `standards/document/架构设计书写规范.md` §4.10 | 规定关键交互场景表、通信方式判断表、简化图及禁止协议化粒度。 |
| 旧 `01-架构设计.md`、README、draft | 只审计 API/事件/轮询/optimistic/后台 helper 等历史假设，不作为当前交互真相。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些交互适合同步能力边界？ | 当前正式访问语境确认、visibility/资格判断、owner-safe 查询/分页/下钻、受控意图提交的即时受理姿态、正式结果回查，以及安全引用重新解析适合同步请求 / 响应，因为用户必须在当前交互边界获得可判别结果或明确失败。 |
| 哪些交互适合异步事件？ | 仅当 `L0-sdk` 正式封装时，owner 状态变化、快照失效或结果可重新获取的提示适合异步事件 / 回调。提示只触发失效、重验或重查，不直接改变业务结果，也不形成 Console projection/cursor/replay。 |
| 哪些交互适合后台任务或补偿路径？ | owner 的长时审批、归档/恢复、报告/导出、验证、能力或 sandbox 工作可由对应 owner 后台 / 延后承接；Console 只呈现正式 receipt/task/result/ref。客户端自身只有重查、重验、回查、撤除影子、保留草稿或挂起 unknown 等恢复语义，没有独立业务后台任务。 |
| 哪些交互必须经过总线或正式边界，不能直接穿透？ | 所有业务查询、资格判断、受控意图和结果回查必须经 `L0-sdk` 或正式服务边界。Console 不直连 `L0-bus`；异步提示只能经 SDK 正式封装，不得穿透到 owner 数据库、repository、内部事件、服务源码或私有协议。 |
| 关键依赖失效时如何降级或挂起？ | actor/scope/资格不可验证时 fail-closed；单一 owner 查询失败时区域化呈现 partial/stale/unavailable；受控意图无法明确受理时保持 rejected/blocked/unknown；unknown 只有正式 reconciliation 才回查，无依据不重放；异步提示和诊断缺失不改变同步安全主链。 |
| 哪些通信口径最容易误入协议细节？ | query 容易被写成路径/方法目录，状态提示容易被写成事件 catalog，结果回查容易被写成固定轮询算法，owner 后台工作容易被写成 Console job，诊断容易被写成日志 schema，跨 owner 组合容易被写成聚合服务时序。本步只保留交互类别和边界语义。 |
| 每个架构单元的同步、异步、后台和补偿是什么？ | §6.6 对 Step 5 的六个语义单元和三个本地影子逐项列出；没有异步或后台职责的单元明确标记 `none / not-owned`，不为表格完整性伪造交互。 |
| 每个交互是否通过停审？ | §6.7 按语境/资格、查询、意图/结果、状态提示、owner 延后工作、诊断/链接六组停审，均与 Step 8 数据所有权一致且未下沉协议。 |
| 是否存在同步/异步冲突、直接穿透或降级缺口？ | §6.8 未发现 unresolved 冲突。exact surface、状态提示、reconciliation、诊断和 owner activation 仍 pending，只限制正向深度，不改变交互类型和安全上限。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料 | 问题 | 本步处置 |
|---|---|---|
| 旧文档枚举多个 Server API、RPC 或固定调用路径 | 把未核验协议当正式合同，并可能绕过 SDK。 | 只写经 `L0-sdk`/正式服务边界的同步能力类别；exact surface 保持 pending。 |
| 旧状态事件/订阅直接驱动页面投影 | 暗示 Console 订阅私有 bus、维护 cursor/replay 并把事件当业务结果。 | 异步只保留 SDK 封装的可选失效提示；提示后必须重查/重验。 |
| 固定 polling、自动刷新或全局 fan-out | 可能无界放大 owner 负载，并把刷新成功当业务完成。 | 只保留有界、可归因的显式 query/reconciliation；具体触发和预算后移。 |
| optimistic state、toast 或 receipt 表示成功 | 混淆 transport/accepted 与 owner committed result。 | 同步提交只收口即时受理姿态；正式结果必须由 owner result/ref 确认。 |
| export/report/validation helper 或 Console 后台 job | 将 owner 长时工作、报告/证据正文和重试职责迁入客户端。 | 后台工作只由对应 owner 延后承接；Console 只呈现正式状态与引用。 |
| 客户端诊断同步阻断业务交互 | 让外围 sink 变成业务依赖，甚至把诊断当 audit/evidence。 | 诊断是条件化异步/延后旁路；失败不影响业务结果或安全恢复。 |
| 跨 owner 聚合采用一个同步事务或统一事件投影 | 伪造跨域原子一致、统一健康或 readiness。 | 各 owner 独立有界读取与局部降级；联合视图只组织结果，不产生新 truth。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 原因 |
|---|---|---|---|
| 查询 | 多服务直连或固定 API 清单 | 经正式边界的同步可判别读取 | 保留即时用户反馈，不锁协议或绕过 SDK。 |
| 资格 | 页面 guard/缓存决定 | 提交或披露前同步取得/重验正式姿态 | 安全前置不能依赖旧 UI 状态。 |
| 提交 | transport 成功即完成 | 同步返回受理姿态，owner 正式结果另行确认 | 保护副作用和幂等边界。 |
| 状态变化 | 直接事件更新本地业务投影 | SDK 可选异步提示，仅触发失效/重查 | Console 不拥有事件或投影 truth。 |
| 长时工作 | Console 轮询/worker 承接业务完成 | owner 后台延后承接，Console 只回查/呈现正式状态 | 业务执行和终态留在 owner。 |
| 多域视图 | 单一聚合事务或统一 readiness | 分 owner 有界同步读取与局部降级 | 不伪造跨域原子性和结论。 |
| 诊断 | 与业务请求同步绑定 | 条件化非阻塞旁路 | 诊断失败不得改变业务语义。 |

### 5.2 设计取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 所有交互都同步收口 | 心智简单 | 长时 owner 工作会被伪装成即时完成，跨域耦合和等待扩大 | 不采用 |
| B. 所有状态都由事件驱动并在 Console 投影 | 页面可能及时更新 | 引入直接 bus、cursor/replay/projection 和第二 truth | 不采用 |
| C. 查询/资格/提交反馈同步，SDK 提示可选异步，长时工作由 owner 延后承接 | 匹配数据所有权，能区分即时反馈与正式终态 | 页面必须显式处理 pending/unknown/partial | 采用 |
| D. 新增 Console BFF/worker 统一聚合、轮询和补偿 | 可隐藏 owner 差异 | 新增运行单元、业务规则和第二 truth，无当前 authority | 不采用 |
| E. 不使用任何异步提示，只靠显式查询 | 最小依赖 | 失效感知可能较慢 | 可作为基础成立路径；提示仅是条件增强 |

## 6. 结构化中间产物

### 6.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 当前访问语境确认与重验 | Console 交互边界 ↔ 正式身份/语境边界 | 在受保护内容或动作前取得可判别 actor/scope 姿态。 | session 壳只维持体验连续性，不能代替正式语境。 |
| 入口可见性与动作资格判断 | Console 交互边界 ↔ 正式 visibility/资格/Policy/Gate 边界 | 判断入口/动作当前可呈现和可提交的安全上限。 | 菜单、route、角色字符串或 feature flag 不能独立给出 allow。 |
| Owner-safe 管理读取与探索 | Console 交互边界 ↔ 各正式 owner 查询边界 | 取得带来源、多轴状态和安全引用的列表、详情或下钻结果。 | 读取不得创造或改变 owner truth，也不承诺跨 owner 原子一致。 |
| 客户端筛选、布局与草稿编辑 | 交互编排边界 ↔ 有界客户端状态承载 | 即时保持 Console-owned 探索意图、呈现选择和未提交意图。 | 本地状态不授予权限、不触发业务副作用、不成为正式对象。 |
| 受控管理意图提交 | Console 交互边界 ↔ 正式 owner 受理边界 | 在当前语境、资格和用户确认成立时提交意图，并取得即时受理姿态。 | 即时响应可以是 rejected/accepted/pending/unknown，不等于业务完成。 |
| 正式结果确认与 reconciliation | Console 交互边界 ↔ 正式 owner 结果边界 | 按 owner 正式能力确认 submitted 意图的 confirmed/rejected/unknown 结果。 | 无正式回查或幂等依据时不能自动重放潜在副作用。 |
| Owner 状态变化或快照失效提示 | SDK 正式提示边界 ↔ Console 失效/重验边界 | 提醒相关安全影子需要失效、重验或重新查询。 | 提示不是业务事实正文、结果证明或本地 projection 输入。 |
| Owner 长时工作状态承接 | Console 结果呈现边界 ↔ owner 延后工作边界 | 呈现审批、验证、报告/导出、归档/恢复或 sandbox 等正式延后状态与结果引用。 | 工作由 owner 推进；Console 不执行 job、不决定终态。 |
| 跨 owner 联合监督视图 | 管理主题组织边界 ↔ 多个独立 owner 边界 | 在同一页面组织多个来源的安全结果并保留各自状态。 | 联合呈现不建立共享事务、统一时间点或 readiness。 |
| 安全诊断上送 | Console 外围输出接缝 ↔ 正式诊断接收边界 | 条件化传递最小、无 forbidden body 的交互诊断。 | 诊断不是 audit/evidence/业务历史，接收失败不改变业务。 |
| 外部安全链接或回链 | Console 导航边界 ↔ 正式对象/相邻产品链接边界 | 在合同允许时导航到正式引用指向的目标或返回入口。 | 未停审 L5/L6 只保留 pending，不传递私有状态。 |

### 6.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 当前访问语境确认与重验 | 同步请求 / 响应类交互 | 不宜只依赖异步提示或后台最终收敛 | 无法判别、过期、撤销、冲突或 unknown 时 fail-closed。 | 受保护披露/提交要求当前边界即时获得安全姿态。 |
| 入口可见性与动作资格判断 | 同步请求 / 响应类交互 | 不宜由本地缓存、事件影子或后台任务授予资格 | 结果不可得时 restricted/unknown/blocked，客户端只可进一步收紧。 | 资格判断必须来自正式决定源。 |
| Owner-safe 管理读取与探索 | 同步请求 / 响应类交互 | 不宜共享存储、后台补造或直接事件投影作为唯一来源 | 按 owner 显示 loading/partial/stale/unavailable/unknown，允许有界重查。 | 用户当前需要可判别结果，读取本身无业务写入。 |
| 客户端筛选、布局与草稿编辑 | 同步请求 / 响应类交互（客户端内部） | 不宜通过 owner 命令或事件传播每次本地变化 | 本地冲突或失效时保守清除、要求复核或保留可安全草稿。 | 这些是 Console-owned 交互事实，不应制造外部副作用。 |
| 受控管理意图提交 | 同步请求 / 响应类交互 | 不宜以异步事件发出即视为成功，亦不宜后台静默提交 | 无正式 surface/资格/确认时 blocked；中断或不可判别时 unknown。 | 当前边界必须给出受理姿态，但受理不等于正式终态。 |
| 正式结果确认与 reconciliation | 同步请求 / 响应类交互；仅在 owner 正式支持时成立 | 不宜用客户端推导、固定轮询或无依据重放替代 | 可回查则取得正式结果；不可回查则保持 unknown/blocked。 | 结果确认依赖 owner 正式查询/ref，不由本地状态结束。 |
| Owner 状态变化或快照失效提示 | 异步事件 / 回调类交互（可选、SDK 封装） | 不宜作为同步查询的替代或直接改写结果 | 提示缺失时继续显式重验；收到后仅失效/重查，解析失败则保守忽略并收紧。 | 提示改善及时性，但不承担 truth 或完成语义。 |
| Owner 长时工作状态承接 | 后台任务 / 延后承接类交互（由 owner 拥有） | 不宜把当前同步响应伪装为已完成，也不宜由 Console worker 推进 | 保留 accepted/pending/unknown/failed 等 owner 正式姿态，并按正式能力回查。 | 长时业务过程、补偿和终态归 owner。 |
| 跨 owner 联合监督视图 | 多个独立的同步请求 / 响应类交互；不要求统一收口 | 不宜单一跨域事务、同步全局 fan-out 门禁或事件投影合成 truth | 每个 owner 独立成功/失败；缺项明确 coverage，不阻断无关已授权区域。 | 页面组合不能改变 owner 独立性。 |
| 安全诊断上送 | 异步事件 / 回调类交互或后台 / 延后承接类交互（条件化外围） | 不宜同步阻断业务，也不宜携带请求/响应正文 | sink 失败、拒绝或不可用时诊断独立降级；业务结果保持不变。 | 诊断尽力承接，不是正式 audit/evidence。 |
| 外部安全链接或回链 | 同步请求 / 响应类交互（当前导航确认）；合同未闭口时不启用 | 不宜通过私有状态同步或未停审回调建立耦合 | 引用不可见、无效或目标合同缺失时保持 unavailable/blocked。 | 只传正式安全引用，不传 Console 内部状态。 |

### 6.3 简化交互示意图

#### 关键交互边界示意图：L5-console

```text
 +----------------------+        +--------------------------+
 | browser / assistive |        | L0-sdk / formal owners   |
 | entry boundary       |        | access and result boundary|
 +----------+-----------+        +------------+-------------+
            | [local/sync interaction]         ^
            v                                  | [sync query /
 +----------+----------------------------------+  intent / result]
 |               L5-console client boundary   |
 |                                             |
 |  context / qualification / owner-safe view |
 |  controlled intent / result presentation   |
 +----------+----------------------+-----------+
            ^                      |
            | [optional async      | [conditional async /
            |  invalidation hint]  |  delayed diagnostics]
 +----------+-----------+   +------+-----------------------+
 | SDK formal hint      |   | safe diagnostics receiver  |
 | boundary             |   | external optional boundary |
 +----------------------+   +-----------------------------+

 Formal owner delayed work remains outside Console:
 owner pending / delayed work -> formal result or ref -> Console presentation
```

图示说明：

- 同步请求 / 响应用于当前语境、资格、查询、意图受理和正式结果回查，不表示所有业务工作即时完成。
- 可选异步提示只触发本地影子失效、重验或重查；Console 不直接订阅内部总线，也不维护业务投影。
- 长时工作始终由正式 owner 延后承接，Console 只呈现其正式状态或引用，不新增后台运行单元。
- 诊断是条件化外围旁路，失败不得影响权限、业务结果或安全恢复。

### 6.4 交互边界红线

| 红线 | 保护目标 |
|---|---|
| 业务 query、资格、受控意图和结果必须经 `L0-sdk` 或正式服务边界。 | 防止数据库、repository、服务源码、私有协议或 Policy/Gate 旁路。 |
| 同步 response/receipt/accepted 不得直接解释为 owner committed。 | 保持受理、处理中、正式完成与 unknown 的语义分离。 |
| 异步提示不得直接生成业务状态、权限、verdict 或 readiness。 | 防止提示和本地 projection 成为第二 truth。 |
| Console 不直连 `L0-bus`，不维护事件 cursor/replay/rebuild。 | 保持 L5 产品边界和 SDK 统一接入。 |
| Owner 后台工作不得迁入 Console worker/job。 | 保持审批、报告、归档、sandbox 等执行及终态的 owner 归属。 |
| 跨 owner 页面不得要求共享事务或将局部结果合成统一结论。 | 保持 owner 独立一致性、coverage 和局部降级。 |
| 任何通信材料不得把 forbidden body 带入状态、错误、诊断、日志或导出。 | 保护最小披露与正文所有权。 |
| 诊断和外部链接不得成为核心同步前置或私有状态通道。 | 防止外围能力阻断业务或形成跨产品反向依赖。 |

### 6.5 失败降级与挂起结论

| 失败类别 | 架构处理口径 | 明确不得发生 |
|---|---|---|
| 同步语境/资格无法判别 | 受保护内容和动作 fail-closed，保留最小退出、重验或重新选择路径。 | 用旧 session、菜单、URL、缓存或偏好继续放行。 |
| 同步 owner 查询失败或部分返回 | 按 owner 区域呈现 partial/stale/unavailable/unknown，并保留来源与 coverage。 | 归一为空/成功，或因一个 owner 失败拖垮/掩盖其他区域。 |
| 受控意图提交被拒绝、未开放或中断 | 保持 rejected/blocked/unknown，保留可安全复核的草稿；只按正式边界继续。 | 通过私有接口提交、静默后台提交或以 transport success 宣布完成。 |
| 正式结果暂不可回查 | 保持 pending/unknown/blocked，等待正式能力或用户安全处置。 | 无幂等/reconciliation 依据自动重放潜在副作用。 |
| 异步提示缺失、重复、延迟或不可解析 | 不依赖提示形成权限/业务结论；显式重验或保守失效影子。 | 把提示缺失解释为没有变化，或把重复提示当重复业务事实。 |
| Owner 延后工作失败或状态不明 | 忠实呈现 owner 正式失败/unknown/ref；不执行本地补偿业务动作。 | Console 自行推进、回滚、重建或宣布 owner 终态。 |
| 诊断/链接边界失败 | 外围区域独立 unavailable/blocked；核心交互与安全恢复不变。 | 把诊断故障当 owner 故障、放宽权限或泄露私有状态。 |

### 6.6 按架构单元的交互方式与停审

| 架构单元 | 同步请求 / 响应 | 异步事件 / 回调 | 后台 / 延后承接 | 补偿与降级 | 停审结论 |
|---|---|---|---|---|---|
| 可信管理交互编排 | 在当前输入材料上同步判定安全呈现、受理姿态和恢复上限；不直接调用具体 owner。 | `none owned`；只消费承接层已规范化的可选提示语义。 | `none owned`；不执行业务后台工作。 | 冲突/unknown 选择更保守姿态，保持 owner 结果优先。 | `pass`：核心不穿透外部边界、不拥有事件/后台职责。 |
| 访问语境与导航 | 经正式边界确认 actor/scope/visibility/资格；本地导航即时响应。 | 可选 SDK 提示触发语境/资格失效与重验。 | `none owned`；语境刷新不建立后台授权。 | 无法判别即 fail-closed，保留安全退出/重选。 | `pass`：通信方式匹配安全即时约束。 |
| 来源保真视图 | 各 owner 独立有界查询、分页、下钻和引用解析。 | 可选提示只标脏/失效相关安全影子。 | Owner 自有延后工作只通过正式状态/ref 被读取；Console 不承接。 | partial/stale/unavailable/unknown 分区呈现并显式重查。 | `pass`：查询不写 truth，异步不建投影。 |
| 受控意图与结果 | 同步提交获即时受理姿态；正式支持时同步回查 result/ref。 | 可选结果可获取提示只触发回查，不能直接结束业务状态。 | 业务处理、审批、报告、归档等由对应 owner 延后承接。 | unknown 只正式回查或挂起；无依据不重放。 | `pass`：受理、延后工作和正式结果分离。 |
| 管理主题组织 | 各主题按 owner 独立同步取得安全结果/资格；不建立跨域同步事务。 | 各主题只可接收 SDK 封装的可选失效提示。 | 各 owner 的长时管理工作保持在 owner；无 Console 主题 worker。 | 单一 owner 失败只降级相关区域，不合成 readiness。 | `pass`：主题组织未成为聚合服务或事件投影。 |
| 韧性与可访问交互 | 本地恢复选择、焦点和播报即时响应；重验/重查经正式边界。 | 状态提示和诊断送达均为可选，不取代可访问同步路径。 | 诊断可条件延后；不承接业务补偿。 | 无法分类标 unknown；诊断失败不影响等价恢复。 | `pass`：a11y 与视觉路径共享正式语义上限。 |
| 正式语境与资格引用 | 使用引用前经正式边界同步确认当前可用上限。 | 可选失效提示促使引用撤除或重验。 | `none owned`；不得后台延续授权。 | 过期/撤销/冲突/unknown 即 invalid/restricted。 | `pass`：引用不能通过延后收敛继续放行。 |
| owner-safe 视图影子 | 显式 query/revalidation 形成或更新可见影子。 | 可选提示只触发失效/重查，不携带或落地业务正文。 | `none owned`；不维护 cursor/replay/rebuild。 | 影子 stale/partial/unavailable 时保真标记或撤除，不反写。 | `pass`：最终收敛不等于事件投影职责。 |
| 正式请求与结果引用 | 经正式 submit/result/reconciliation 边界建立或确认引用。 | 可选结果提示只引导回查；不能自制 result/ref。 | Owner 延后工作产生的正式引用由 owner 管理。 | 引用不可确认时保持 unknown/blocked，不从本地经历推导完成。 | `pass`：请求经历与正式结果通信边界清晰。 |

逐单元停审结论：九个架构单元均明确了同步、异步、后台/延后和补偿姿态；不存在为了填表而虚构的 Console 事件输出、consumer、worker 或后台 job。每项通信方式均服从 Step 8 的数据所有权和一致性，不携带 forbidden body，也未下沉协议或 schema。

### 6.7 交互方式停审记录

| 交互组 | 通信方式匹配所有权 / 一致性 | 经过正式边界 | 未下沉协议 / schema | 失败口径完整 | 结论 |
|---|---|---|---|---|---|
| 语境、visibility 与资格 | yes：安全边界即时约束 | yes | yes | yes：fail-closed | `pass` |
| Owner-safe 查询与跨 owner 视图 | yes：只读影子最终收敛、分 owner 独立 | yes | yes | yes：partial/stale/unavailable | `pass` |
| 客户端状态与草稿 | yes：Console-owned 交互真相 | local bounded boundary | yes | yes：复核/保守清除 | `pass` |
| 受控意图与正式结果 | yes：请求经历和 owner 终态分离 | yes | yes | yes：rejected/blocked/unknown | `pass` |
| SDK 状态/失效提示 | yes：可选提示，不是 truth | yes，SDK-only | yes | yes：缺失时显式重验 | `pass` |
| Owner 延后工作 | yes：业务执行与终态归 owner | yes | yes | yes：pending/failed/unknown/ref | `pass` |
| 诊断与外部链接 | yes：外围快照/ref，不是业务历史 | conditional formal boundary | yes | yes：独立 unavailable/blocked | `pass_conditional` |

### 6.8 跨交互边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | pass | 安全判断/查询/提交反馈同步；状态提示可选异步；长时业务由 owner 延后承接。 |
| 是否把同步受理伪装成业务完成 | pass | accepted/receipt/pending/unknown 与 confirmed/rejected 明确分离。 |
| 是否把异步提示当作 truth 或同步成功条件 | pass | 提示只触发失效/重查；缺失不改变同步安全主链。 |
| 是否存在 Console 自有业务事件输出 | pass | none；UI state、草稿、缓存和诊断均不作为下游业务 truth。 |
| 是否新增 Console worker/consumer/BFF | pass | none；owner 后台工作保持外部，Console 只有客户端恢复语义。 |
| 是否直接穿透 SDK/正式服务边界 | pass | DB、repository、服务源码、私有 API/bus 均未进入主链。 |
| 是否存在跨 owner 原子事务或统一 readiness | pass | 多 owner 独立请求和局部降级，不合成正式结论。 |
| 是否出现 API、event、topic、DTO、schema、固定 polling 或重试实现 | pass | none；只使用规范的三类通信方式。 |
| 是否存在 forbidden body 通信旁路 | pass | 查询、提示、诊断和链接均受 owner-safe/ref 上限约束。 |
| 是否存在失败降级缺口 | pass | 语境、查询、提交、回查、提示、后台、诊断/链接均有保守姿态。 |
| pending 是否被写成已激活或 ready | pass | exact surface、通知、reconciliation、诊断和 owner 正向能力继续 pending/conditional。 |
| 对 Step 10 的承接是否清晰 | pass | Step 10 只可选择支撑这些通信边界的架构机制，不得反向锁协议或技术栈。 |

## 7. 复杂度判断

本步识别 11 个关键交互场景，并在九个架构单元上分别审查同步、异步、后台与降级。虽然 owner 数量多，通信语义可收束为四条主线：安全判断与当前读取同步、受控提交只即时收口受理姿态、SDK 状态提示可选异步、长时业务由 owner 延后承接。无需为每个管理主题重复定义协议或时序，也无依据新增 Console BFF、worker、consumer、私有 bus 或业务事件输出；具体 query/command adapter、状态机和触发策略必须待 `02/03` 且受 exact owner contract 约束。

## 8. 正式 §10 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_04_system_context.md`
> - `design-calibration/01_arch_step_06_container_deployment.md`
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
> - `design-calibration/01_arch_step_09_interactions_communication.md`
> - `projects/L5-console/00-需求文档.md` §12

正式 §10 应承接 §6.1 的关键交互场景表、§6.2 的通信方式判断表、§6.3 的简化示意图和 §6.4~§6.5 的红线/失败口径，并保留以下不可删减结论：

1. 正式语境、visibility/资格、owner-safe 查询、受控意图的即时受理姿态和正式结果回查采用同步请求 / 响应类交互。
2. 同步 receipt/accepted/pending/unknown 不等于业务完成；只有 owner confirmed/rejected result/ref 收口正式结果。
3. 状态变化/失效提示只在 `L0-sdk` 正式封装时作为可选异步交互，且只触发失效、重验或重查。
4. 长时审批、报告/导出、归档/恢复、验证、能力和 sandbox 工作由正式 owner 后台 / 延后承接，Console 不新增 worker、consumer 或 job。
5. 多 owner 视图独立读取、局部降级，不承诺原子一致或 readiness；诊断/链接为条件化外围，失败不影响核心业务语义。

正式正文不得加入 API path、方法/事件/topic 名、DTO/schema、HTTP/RPC/MQ 产品、固定 polling、重试次数、时序流程、Console BFF/worker 或实现完成声明。

## 9. 待确认事项

| 待确认项 | 本步处理 | 当前状态 |
|---|---|---|
| `CON-Q-034~043` owner exact query/command/result/ref、scope/visibility、safe-field 与 activation | 只确认同步能力边界和保守姿态；未闭口正向面保持 read-only/blocked/unknown。 | `open / blocks exact interaction surface` |
| 正式 reconciliation / 幂等依据 | 有正式能力才回查；无依据时 unknown 挂起且不得重放。 | `open / blocks automatic recovery` |
| `L0-sdk` 正式状态/失效提示 | 定位为可选异步增强；无提示仍以显式 query/revalidation 成立。 | `open / non-blocking` |
| `CON-Q-044` 客户端状态生命周期与失效触发 | 本步只定义恢复语义，不锁定介质、TTL、刷新或轮询策略。 | `open / blocks exact state mechanics` |
| `CON-Q-045` 性能、负载和可用率 authority | 固定有界、可归因、按 owner 隔离的交互原则；不写请求预算、并发、延迟或频率。 | `open / blocks quantified communication budget` |
| `CON-Q-046` 诊断 envelope 与浏览器/a11y 支持矩阵 | 诊断保持条件化非阻塞，a11y 共享相同正式边界；具体合同 pending。 | `open / blocks exact diagnostics` |
| `CON-Q-047` 相邻 L5/L6 link/ref 合同 | 只保留同步安全导航候选；无正式合同时不启用、不传私有状态。 | `open / pending` |

本步没有阻塞 Step 10 的新问题；待确认项只限制具体 surface、触发、预算与正向能力，不改变同步/异步/owner 延后承接的架构分类。

## 10. 自检、三层门禁与进入 Step 10 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否先识别关键场景再判断通信方式 | pass | §6.1 与 §6.2 使用规范固定表结构。 |
| 是否覆盖同步、异步、后台/延后和补偿 | pass | 三类正式通信方式及客户端恢复语义均明确。 |
| 是否按九个架构单元逐项停审 | pass | §6.6 每项均有同步、异步、后台、补偿和结论。 |
| 是否匹配 Step 8 数据所有权和一致性 | pass | 安全即时约束、只读最终收敛、owner-confirmed 结果一致。 |
| 是否所有业务交互经过 SDK/正式服务边界 | pass | 无数据库、repository、服务源码或私有 bus 穿透。 |
| 是否伪造 Console 事件输出、worker、consumer 或 BFF | pass | none；owner 延后工作保持外部。 |
| 是否区分受理、pending/unknown 与正式结果 | pass | 同步受理不等于终态，unknown 无依据不重放。 |
| 是否覆盖局部降级、提示缺失和诊断故障 | pass | §6.5 按类别给出保守处理。 |
| 是否写入 API/event/topic/DTO/schema/协议/时序或实现参数 | pass | none。 |
| 是否保留 owner activation 和 exact contract pending | pass | 未声明 integrated、available 或 ready。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建 Step 9 calibration。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 关键场景、三类通信方式、失败姿态、九单元停审与跨交互审计完成，无 unresolved 选择冲突或直接穿透。 | 更新 flow 与项目台账，激活 Step 10。 |
| 文档级 | `pass_to_step_10` | 正式 §10 回填基础已形成，且未下沉协议、事件目录或时序实现；正式 `01` 继续等待 Step 16。 | 创建并完成 `01_arch_step_10_technology_choices.md`。 |
| 项目级 | `pass_with_open_contracts` | exact surface、状态提示、reconciliation、诊断、性能和相邻产品链接仍 pending，但不阻塞架构级技术机制选择。 | 进入 Step 10；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
