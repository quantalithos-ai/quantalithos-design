# L5-console 启动前参考整理：L1-workspace draft 审计

> 状态：`pre-calibration / reference-audit-complete`  
> 日期：2026-09-15  
> 目的：把 `projects/L1-workspace/draft/` 整理成 L5-console 需求校准可安全引用的边界与粒度输入。本文不是 L5-console 正式需求、架构或接口真相源。

## 1. 读取范围与权威顺序

已读取：

| 输入 | 当前定位 | 可引用范围 |
|---|---|---|
| `projects/L1-workspace/draft/01_项目作用与交互对象.md` | `historical_reference` | 只读跨域视图、scope/visibility 分层、依赖裁剪表、pending 记录方式。 |
| `projects/L1-workspace/draft/02_功能推演.md` | `historical_reference` | 能力闭环、失败/降级姿态、cursor 分离和 no-write 讨论方式。 |
| `projects/L1-workspace/draft/03_模块划分与分层.md` | `historical_reference` | 组件×分层表达、对象类别与边界自检粒度。 |
| `projects/L1-workspace/00~02-*.md` | `upstream_formal_reference` | 只用于确认 Workspace 已有正式边界与 blocker；不把其对象/协议迁移到 Console。 |

权威顺序固定为：

```text
L5-console 当前用户指令
  > L5-console 本轮确认的 design-calibration 产物
  > L5-console 后续正式文档
  > 已停审上游正式文档
  > L1-workspace draft（仅参考）
  > L5-console 旧 README / 旧正式文档（仅污染审计）
```

## 2. 可复用的边界与粒度

### 2.1 可复用原则

| Workspace draft 原则 | 对 Console 的安全转译 |
|---|---|
| source truth 与 view/local state 分离 | Console 的页面、筛选、草稿、会话和展示状态不得成为领域真相。 |
| query no-write | Console 的业务读取不能因渲染、预取、筛选或刷新而改变源域或正式审计状态。 |
| visibility first、unknown fail-closed | 无权限、撤销、冲突、不可验证和过期数据必须有明确受限姿态，不用 UI 默认值放行。 |
| 多轴状态不压成单一“成功/失败” | 页面 view model 应区分可见性、完整性、时效、可用性和动作结果，具体字段待需求/后续设计收口。 |
| source cursor、view revision、用户 read cursor 分离 | Console 不应把服务端投影游标、页面刷新时间、筛选状态或本地会话标记解释为业务进度/审批结果。 |
| 依赖按 compile/runtime/event/ref/adapter/fake 分类 | Console 通过 `L0-sdk` 或正式服务边界消费能力；不把运行期服务、事件或 UI adapter 写成源码真相。 |
| pending/blocker 原样传递 | 上游合同不完整时，需求只能声明依赖、可见行为和上限，不能假定 ready/integrated。 |

### 2.2 可复用的讨论粒度

后续 Console 需求 Step 应采用以下小循环，而不是一次生成页面大表：

```text
治理能力节点
  -> 目标角色与用户故事
  -> 外部可见功能
  -> 业务/权限边界
  -> 数据归属与允许展示粒度
  -> SDK/service 依赖类别
  -> 错误、部分数据、过期数据姿态
  -> NFR 与验收条件
```

该粒度可借鉴 Workspace draft 的“能力节点→边界→失败姿态”写法，但 Console 的对象是 UI 入口与展示编排，不是 Workspace 的 projection aggregate、source cursor 或 rebuild generation。

## 3. 明确不可迁移的 Workspace 结论

| Workspace draft 内容 | Console 处置 | 原因 |
|---|---|---|
| `WorkspacePartition`、`WorkspaceProjection`、`ProjectionGeneration` | 不纳入 Console-owned object。 | 这些是 Workspace 服务侧投影局部状态。 |
| `SourceCursorState`、event dedupe、rebuild/cutover | 不纳入 Console 需求 truth。 | Console 不能拥有跨域事件消费和投影维护。 |
| `InboxItemProjection`、`ReadCursor`、unread projection | 不复制为 Console 业务对象。 | 如页面需要展示，消费 Workspace/Conversation 正式 read surface；页面筛选和会话状态仍是客户端局部状态。 |
| Personal/Project Workspace scope | 不把它改写成 Console 的组织/项目权限 scope。 | Console 的访问范围须由正式 identity/work/governance 决定；Workspace scope 不是授权来源。 |
| Workspace `refresh/rebuild` | 不在 Console 中承诺服务侧 rebuild。 | Console 可提供受控入口或状态查看，但执行权与结果归正式 owner。 |
| Workspace local `pin/mute/read/focus` | 不作为 Console 的治理、审批或合规状态。 | 局部体验状态不能改变业务事实。 |
| Workspace 的 candidate event names / API / DTO / storage | 全部保持 historical/pending。 | 未形成 L5-console 当前正式消费合同。 |

## 4. 对 L5-console 需求主线的启发

### 4.1 Console 的候选能力节点（待需求 Step 7 收口）

| 候选节点 | 目标 | 明确不拥有 |
|---|---|---|
| `C-CON-1 导航与组织语境` | 让授权用户进入员工、项目/workspace、方法、治理、审计/指标、能力、Archive 等管理入口。 | 不创建 scope、成员资格或业务项目。 |
| `C-CON-2 组织与项目只读监控` | 汇总正式服务返回的成员、项目、workspace、process 状态和安全摘要。 | 不把页面状态当 work/process/workspace truth。 |
| `C-CON-3 方法资产管理入口` | 通过正式边界浏览、编辑草稿、提交/发布请求并显示服务端结果。 | 不拥有 Role/Template/Policy/ViewProfile 正文、版本或发布决定。 |
| `C-CON-4 治理与合规面板` | 展示 Governance 的 SoA/AIIA/Control/Gate/Policy/Nonconformity 视图、证据引用和阻断姿态。 | 不计算合规结论、不批准 Gate、不重定义控制项数量。 |
| `C-CON-5 审计与指标只读视图` | 通过 Observability 正式读取面展示审计、指标、lineage、retention 和 report 状态。 | 不写审计事实、不自建哈希链真相、不把指标阈值硬编码成治理结论。 |
| `C-CON-6 Capability Hub 与 Archive 管理入口` | 提供能力注册/访问治理和归档管理的受控入口、状态和错误解释。 | 不拥有 capability registry、provider secret、archive bundle、恢复成功或 readiness。 |
| `C-CON-7 权限、降级与可访问性` | 对每个入口表达授权范围、部分数据、过期数据、错误和键盘/读屏可操作性。 | 不自行授权、推导审批/合规/审计完整性或运行 readiness。 |

这些只是启动前候选，不是已确认的正式能力清单；必须在需求 Step 1~7 中重新验证并登记来源。

### 4.2 Console 视角的失败姿态

| 输入状态 | 页面允许表达 | 页面禁止表达 |
|---|---|---|
| `NotVisible` / 无权限 | 受限入口、通用原因和安全导航（依正式安全合同） | 通过空列表暗示不存在，或展示缓存正文。 |
| `Degraded` / 部分来源不可用 | 已验证部分、缺失/过期标记、重试或 owner 入口 | 把部分数据拼成完整治理结论。 |
| `ConsistencyDefect` / 冲突 | 明确冲突、暂停危险操作、回到正式 owner | 以最后一次 UI 状态覆盖冲突。 |
| command 结果未知 | 显示“结果未确认/请查询正式结果”，保留幂等上下文 | 把请求发送成功当业务成功或审批完成。 |
| stale / expired | 标明时间与来源，按敏感度裁剪 | 以 stale 数据推导当前权限、合规或 readiness。 |
| 上游 unavailable | 保留导航与安全壳，局部禁用依赖动作 | 伪造 fresh、accepted、verified 或 ready。 |

## 5. 与 L5-console 旧文档的差异整理

| 旧口径 | 新整理处置 |
|---|---|
| “React/Svelte + ECharts/D3 + Tailwind”已确定 | 仅作 historical candidate；需求阶段不锁技术栈。 |
| 固定 Provider Contract、MCP/Provider 业务对象 | 不能在 Console 自定义；只消费 Capability Hub 正式面。 |
| SoA 固定 38 控制项、DORA/EBM 固定 8 指标 | 需由当前 Governance/Observability 正式来源核验；在核验前不写硬编码数量/阈值。 |
| P95、首屏、99.9% 等性能数值 | 仅保留为待确认 NFR 候选；无 authority 不写成验收事实。 |
| 前端“哈希链验证并生成报告” | 改为受控调用 Observability 的验证/报告能力，Console 只展示结果和状态。 |
| ConsoleWorkspace / PanelState 作为治理真相 | 仅可作为客户端导航/布局/会话候选，不得承担业务状态。 |
| 直接 Server API、数据库/实现目录假设 | 改为 SDK/正式服务边界依赖，具体接口留待后续文档和已闭口合同。 |

## 6. 当前 pending / blocker 传递表

| ID | 来源/主题 | 对 Console 的当前上限 |
|---|---|---|
| `CON-UP-001` | L0-sdk 只保证最小正式/fake/fixture boundary，具体服务 client surface 未全部稳定。 | 需求只写“经 SDK/正式边界访问”，不伪造方法名、版本或 transport。 |
| `CON-UP-002` | L1 identity/work/process/governance/artifact 的 exact consumer query/command 与 visibility/degraded 字段需逐项核对。 | 各页面先写能力和结果姿态；字段、错误码、分页和权限矩阵留待后续收口。 |
| `CON-UP-003` | L1-workspace 的 safe read/export、跨域版本/coverage 仍有开放项。 | Console 可消费 Workspace 作为候选摘要来源，但不能依赖其未闭合 projection/cursor/rebuild 合同。 |
| `CON-UP-004` | L3-method-library 当前实现/消费合同处于进行中，不能推导生产可用。 | 方法页保持 draft/pending/blocked 语义，不承诺发布成功。 |
| `CON-UP-005` | L3-capability-hub fixed access-review reason anchor 尚未冻结。 | 能力管理入口必须区分 NotVisible/Degraded/ConsistencyDefect，不能声明 access review ready。 |
| `CON-UP-006` | L4-observability I05、H13/J06 及 inherited affected 仍开放。 | 审计/指标页不能承诺完整证据、实时性或报告成功。 |
| `CON-UP-007` | L4-sandbox 设计完成但 baseline、目标仓和 activation blocked。 | Console 只能显示受控状态/入口，不把 sandbox readiness 当可执行事实。 |
| `CON-UP-008` | L4-archive 正式文档停审但实现为 0/16，且多类恢复/完整性姿态必须保留。 | Archive 页面必须保留 partial/stale/missing/conflicting/unsupported-version/integrity-failed/commit-unknown/compensation-required 等结果，不把 sealed/verified/eligible/material-ready 推导为成功。 |
| `CON-UP-009` | 其他 Layer 5 项目尚未停审。 | 仅记 pending；不得复制其页面/API/指标结论。 |

## 7. 整理结论与下一动作

整理已完成，结论如下：

1. `L1-workspace/draft` 可作为 Console 的边界表达和失败姿态参考。
2. Workspace 的 projection、cursor、rebuild、Inbox local truth 不迁移到 Console。
3. Console 需求应以“治理入口/展示编排/受控命令与查询反馈”为主轴，逐能力完成故事→功能→规则→数据归属→依赖→NFR→验收闭环。
4. 旧 Console 文档中的 Provider Contract、固定控制项数量、固定指标/阈值、框架和哈希链承诺全部进入 historical audit，待正式上游重新核验。
5. 下一动作是创建 `00_requirements_calibration_flow.md`，从需求 Step 1 开始；在 flow 与 Step 1 产物完成前，不写新版正式 `00-需求文档.md`。
