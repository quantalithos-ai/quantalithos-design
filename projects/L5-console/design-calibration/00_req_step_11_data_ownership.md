# Step 11 · 数据需求与数据归属

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 11 · 数据需求与数据归属 |
| 输出文件 | `design-calibration/00_req_step_11_data_ownership.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 11、书写规范 §4.11 与通用规范 |
| 已读取前序输入 | yes，Step 2 边界、Step 9 功能、Step 10 规则 |
| 模块骨架 | done：逐能力 truth / snapshot / ref / forbidden body、生命周期、映射与停审 |
| 进入条件 | `pass`，Step 10 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 先按四类判断每个能力节点的数据 | done | 见 §7.1~§7.6 |
| 限定 Console 自有真相为客户端交互事实 | done | 见 §7.1~§7.6、§7.7 |
| 为所有上游结果区分快照与引用 | done | 见 §7.1~§7.6 |
| 明确绝不能保存的正文与敏感载荷 | done | 见 §7.1~§7.6、§7.8 |
| 写明需求级生命周期且不写存储实现/TTL | done | 见各数据表 |
| 检查数据与功能/规则映射、遗漏和重复归属 | done | 见 §7.7~§7.9 |
| 形成正式回填草稿、自检和三层门禁 | done | 见 §9、§11~§12 |

## 3. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| Step 2 | Console 只拥有页面导航、客户端会话、草稿、筛选/排序/布局、view model 与受控前端状态。 |
| Step 9 | 为 `FR-CON-001~018` 与条件化外围功能识别所需数据，不凭空增加对象。 |
| Step 10 | 落实 owner truth、最小披露、query no-write、草稿/正式结果分离与 forbidden-body 规则。 |
| owner 正式边界 | 业务/治理/证据/workspace/能力/观测/归档/sandbox 状态均由对应 owner 管理生命周期。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据由本仓拥有真相？ | 仅客户端交互事实：会话壳和当前选择、导航/视图偏好、筛选排序分页、表单草稿与确认、请求呈现状态、错误恢复、焦点/播报以及用户明确保存的布局偏好。它们不是业务或授权 truth。 |
| 哪些只是快照？ | owner 允许显示的 actor/scope 摘要、visibility/资格姿态、安全查询结果、管理主题摘要、正式结果摘要及经过裁剪的客户端诊断上下文。 |
| 哪些只是引用？ | 正式 actor/scope、业务对象/版本、receipt/result、governance decision、artifact/evidence、audit/metric/report、capability、archive、sandbox 等安全引用。 |
| 哪些绝不能保存正文？ | credential/secret、身份与授权证明、Policy/Gate 内部依据、隐藏/受限字段、原始服务载荷、业务/治理/制品/审计/报告/能力注册/归档包/sandbox 运行正文，以及可能泄露上述内容的诊断载荷。 |
| 生命周期口径是什么？ | 客户端真相随会话、草稿、请求或用户偏好显式建立/变化/终止；快照随 owner 变化或安全失效而更新/撤除，不形成独立生命周期；引用随可见关系变化；禁止正文不进入 Console 生命周期。 |
| 是否有功能所需数据缺少归属？ | 否；§7.9 覆盖核心与外围功能。exact safe-field 合同 pending 只限制可保存快照的内容，不改变归属。 |
| 是否有无来源数据项？ | 否；每项均回指能力、功能和/或规则。 |

## 5. 当前材料与旧文档问题诊断

| 材料 | 问题 | 当前处理 |
|---|---|---|
| 旧 `ConsoleWorkspace` / 服务端 PanelState | 把跨域页面聚合、游标和面板状态升级为服务端业务对象 | 取消服务端 truth 假设；只保留有限客户端选择/布局，Workspace truth 归 owner |
| 旧 Provider Contract 镜像 | 复制能力注册或适配正文并可能漂移 | 只允许 owner-safe snapshot/ref；能力注册正文禁止保存 |
| 旧审计、指标、控制矩阵缓存 | 可能保存原始审计/evidence 正文和固定阈值 | 只保留 owner-safe 摘要/引用及状态语境；正文和自定义裁决禁止 |
| 旧“当前页面数据” | 未区分空、过期、裁剪、局部失败和来源 | 快照必须随 source/freshness/coverage/availability/consistency 一起解释 |
| 旧错误日志 | 可能直接记录请求/响应正文 | 客户端诊断只允许安全裁剪的交互上下文；敏感正文明确 forbidden |

## 6. 改动前后对比与设计取舍

| 主题 | 旧口径 | 当前口径 |
|---|---|---|
| Console 自有数据 | 混合 UI 状态与跨域业务聚合 | 只把客户端交互事实认定为本仓真相 |
| owner 结果 | 缓存即当前数据 | 仅安全快照，随 owner/语境变化失效，不形成独立 truth |
| 跨域对象 | 复制对象或正文 | 优先保存安全引用；正文由 owner 管理 |
| 草稿 | 容易与正式对象混用 | 本地意图真相，必须显式标记且不代表已提交/完成 |
| 日志/诊断 | 未定义内容上限 | 仅安全交互诊断；credential、业务正文和证明材料不进入 |

采用“客户端事实真相 + owner-safe 快照 + 外部引用 + forbidden body”模型。完全不保留客户端状态无法支持草稿、布局与恢复；把所有页面数据都叫本仓状态则会制造第二套业务 truth，二者均不采用。

## 7. 结构化中间产物

### 7.1 `C-CON-1` 数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-001` 客户端会话壳与当前交互选择 | 真相数据 | 客户端会话连续性和当前交互选择由 Console 拥有正式交互真相，但不构成认证或授权真相。 | 随客户端会话显式建立、变化和结束；语境失效时受保护交互停止。 | `FR-CON-001~002`; `BR-CON-001~004` |
| `DR-CON-002` 正式 actor/session/scope 安全摘要 | 快照数据 | 正式语境真相不属于 Console，本仓只可保留 owner 允许的显示级快照。 | 随正式语境变化而更新或撤除，不形成独立真相生命周期。 | `FR-CON-001~002`; `BR-CON-001`, `BR-CON-003` |
| `DR-CON-003` actor/scope/语境版本安全引用 | 引用数据 | Console 只保存对正式访问语境的安全引用，不拥有其正文或生命周期。 | 随引用关系和可见性建立、变化或失效而变化。 | `FR-CON-001~002`; `BR-CON-001`, `BR-CON-004` |
| `DR-CON-004` credential、secret、身份/角色/scope 定义与授权证明正文 | 禁止保存正文 | 认证、身份和授权证明正文不属于 Console 真相范围，本仓不得将其作为自有或可复用正文保存。 | 不进入 Console 数据生命周期。 | `BR-CON-002`, `BR-CON-004` |

能力级数据停审：C1 的正向语境、失效保护和身份边界均有数据承接；客户端会话壳与正式上下文清楚分离，无字段/存储机制，`pass_to_interfaces`。

### 7.2 `C-CON-2` 数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-005` 导航展开、当前入口与客户端可见布局状态 | 真相数据 | 页面导航与当前呈现选择由 Console 拥有交互真相，但不承担正式可见性决定。 | 随用户导航和当前会话变化；正式语境变化时重新约束。 | `FR-CON-003`; `BR-CON-005~007` |
| `DR-CON-006` 入口可见性与动作资格安全姿态 | 快照数据 | visibility、资格和 availability 的正式真相不属于 Console，本仓只保留当前展示所需安全快照。 | 随 owner 决定、语境或对象状态变化而更新/失效，不形成独立生命周期。 | `FR-CON-003~004`; `BR-CON-005~008` |
| `DR-CON-007` Policy/Gate/资格决定安全引用 | 引用数据 | Console 只保存正式允许暴露的决定引用，不拥有策略、裁决或证明正文。 | 随引用可见性和正式决定变化或失效而变化。 | `FR-CON-004`; `BR-CON-007~008`, `BR-CON-018` |
| `DR-CON-008` Policy/Gate 内部依据、角色目录、资格证明与受限对象正文 | 禁止保存正文 | 上述正文不属于 Console 真相范围，且保存会形成规则复制或信息泄露。 | 不进入 Console 数据生命周期。 | `BR-CON-006`, `BR-CON-008`, `BR-CON-018` |

能力级数据停审：本地导航与正式资格姿态分离，安全 reason 仅属于 owner-safe 快照/引用；无 RBAC 复制，`pass_to_interfaces`。

### 7.3 `C-CON-3` 数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-009` 筛选、排序、分页意图、当前下钻与视图布局 | 真相数据 | 用户的客户端探索意图和呈现布局由 Console 拥有交互真相，不改变来源对象。 | 随用户操作、当前语境和页面生命周期变化；失效时显式重置或重选。 | `FR-CON-005~006`; `BR-CON-010~011` |
| `DR-CON-010` owner-safe 查询结果与 view model | 快照数据 | 业务结果真相不属于 Console，本仓只可保留 owner 允许的安全结果及其来源/状态语境快照。 | 随 owner 结果、语境或可见性变化更新或撤除，不形成独立 truth。 | `FR-CON-005~006`; `BR-CON-009~012` |
| `DR-CON-011` 业务对象、版本、lineage 与安全下钻引用 | 引用数据 | Console 只保存对外部对象及正式版本/关联的安全引用，不拥有其正文。 | 随引用关系、版本和可见性变化或失效而变化。 | `FR-CON-005~006`; `BR-CON-009~012` |
| `DR-CON-012` 原始服务载荷、隐藏/被裁剪字段、跨域完整对象与服务内部存储正文 | 禁止保存正文 | 非 owner-safe 正文不属于 Console 真相范围，本仓不得为了聚合、缓存或诊断复制。 | 不进入 Console 数据生命周期。 | `BR-CON-010~012` |

能力级数据停审：探索意图、owner-safe snapshot、external ref 与 raw/hidden body 四类完整；没有写缓存策略、游标字段或表结构，`pass_to_interfaces`。

### 7.4 `C-CON-4` 数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-013` 未提交表单草稿、提交前复核与危险确认状态 | 真相数据 | 尚未提交的用户意图和客户端确认经历由 Console 拥有交互真相，不是正式业务对象或治理批准。 | 随用户显式创建、编辑、放弃或提交而变化；退出时依明确产品策略处理，不自动成为正式对象。 | `FR-CON-007`; `BR-CON-013`, `BR-CON-016~018` |
| `DR-CON-014` 客户端请求生命周期呈现状态 | 真相数据 | Console 可拥有“本客户端已尝试/正等待/需回查”的交互事实，但不得将其提升为 owner 业务结果。 | 随一次用户意图提交、反馈和恢复经历显式变化；以 owner 正式结果或安全终止结束当前交互。 | `FR-CON-008~009`; `BR-CON-013~017` |
| `DR-CON-015` owner receipt/result/reconciliation/audit/evidence 安全引用 | 引用数据 | Console 只保存正式提供的请求、结果、回查与追溯引用，不拥有所指正文。 | 随请求关系建立、正式结果变化、可见性撤销或引用失效而变化。 | `FR-CON-008~009`; `BR-CON-013~019` |
| `DR-CON-016` owner 正式业务对象、领域校验、幂等依据、审批/审计/evidence 正文 | 禁止保存正文 | 业务副作用和正式证明正文不属于 Console 真相范围，本仓不得复制为本地完成依据。 | 不进入 Console 数据生命周期。 | `BR-CON-014~019` |

能力级数据停审：本地意图/请求经历与 owner receipt/result 清楚分层；未闭口 reconciliation 只留下引用能力上限，无业务正文复制，`pass_to_interfaces`。

### 7.5 `C-CON-5` 数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-017` 员工、成员宿主关系安全摘要 | 快照数据 | identity/member-service 拥有正式真相，Console 只保留其允许的管理视图快照。 | 随正式成员/宿主关系和可见性变化而更新或撤除。 | `FR-CON-010`; `BR-CON-020~023` |
| `DR-CON-018` 项目、工作、过程与 Workspace 安全摘要 | 快照数据 | work/process/workspace 拥有各自正式真相，Console 只保留分 owner 且带 coverage 的视图快照。 | 随各 owner 结果独立变化或失效，不形成跨域统一生命周期。 | `FR-CON-011`; `BR-CON-020~023`, `BR-CON-025` |
| `DR-CON-019` 方法资产目录与版本安全摘要 | 快照数据 | Method Library 拥有正式资产真相，Console 只保留获准浏览的目录/版本视图快照。 | 随正式资产版本和可见性变化更新或撤除；本地草稿另按 `DR-CON-013` 管理。 | `FR-CON-012`; `BR-CON-020~023` |
| `DR-CON-020` 治理决定、SoA/AIIA/Control/Gate 与 evidence 关系安全摘要 | 快照数据 | governance/artifact 拥有正式状态与正文，Console 只保留 owner-safe 审阅快照。 | 随正式决定、引用和可见性变化更新或撤除，不形成 verdict 生命周期。 | `FR-CON-013`; `BR-CON-020~024`, `BR-CON-026` |
| `DR-CON-021` 审计记录与指标定义/结果安全摘要 | 快照数据 | Observability 拥有审计和指标真相，Console 只保留带 coverage/freshness 的只读视图快照。 | 随正式结果和可见性变化更新或撤除，不形成客户端指标生命周期。 | `FR-CON-014`; `BR-CON-020~023`, `BR-CON-025~027` |
| `DR-CON-022` Capability Hub、Archive 与 Sandbox 分 owner 状态摘要 | 快照数据 | 三个 owner 分别拥有能力、归档和隔离运行真相，Console 只保留各自安全状态快照。 | 随各 owner 独立变化或失效，不合并为单一 readiness 生命周期。 | `FR-CON-015`; `BR-CON-020~023`, `BR-CON-025~027` |
| `DR-CON-023` 管理对象、决定、artifact/evidence、audit/metric/report、capability、archive、sandbox 安全引用 | 引用数据 | Console 只保存正式允许的外部对象与结果引用，不拥有所指正文。 | 随引用关系、版本与可见性建立、变化或失效而变化。 | `FR-CON-010~015`; `BR-CON-020~027` |
| `DR-CON-024` 成员/项目/过程/workspace/方法/治理/制品/观测/能力/归档/sandbox 原始或完整正文 | 禁止保存正文 | 所列业务与证明正文不属于 Console 真相范围，本仓不得复制为本地业务仓、聚合 truth 或执行依据。 | 不进入 Console 数据生命周期。 | `BR-CON-021~027` |

能力级数据停审：八个主题均有 owner-safe snapshot/ref 与 forbidden body 上限；无跨域第二真相、固定控制/指标模型或 readiness 数据，`pass_to_interfaces`。

### 7.6 `C-CON-6` 与外围增强数据归属

| ID / 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|
| `DR-CON-025` 错误、降级、恢复选择、焦点与播报状态 | 真相数据 | 当前客户端如何呈现问题、恢复和辅助技术交互由 Console 拥有交互真相，不是 owner 业务状态。 | 随当前交互和来源状态显式变化；恢复或退出后结束当前呈现生命周期。 | `FR-CON-016~018`; `BR-CON-028~033` |
| `DR-CON-026` 用户明确保存的布局、视图与入口偏好 | 真相数据 | 个性化呈现偏好由 Console 拥有产品真相，但不得改变权限、优先级或 owner 结果。 | 随用户明确建立、修改、清除或产品不再支持而变化。 | `FR-CON-E01`; `BR-CON-E01` |
| `DR-CON-027` 安全裁剪的客户端诊断上下文 | 快照数据 | 客户端交互诊断可保留最小安全快照，但不形成业务审计、evidence 或 owner 历史。 | 随交互问题产生并按正式诊断边界退出，不形成业务对象生命周期。 | `FR-CON-016~018`; `BR-CON-027~031` |
| `DR-CON-028` 可比较来源与逐项批量结果安全快照 | 快照数据 | 趋势/批量真相仍归 owner，外围功能只保留 owner 声明可比较或逐项可判别的安全快照。 | 随正式来源、coverage 和逐项结果变化更新或失效；合同缺失时不建立。 | `FR-CON-E02~E03`; `BR-CON-E02~E03` |
| `DR-CON-029` 报告、评审、批量结果与导出 artifact 安全引用 | 引用数据 | Console 只保存正式结果或 artifact 的安全引用，不拥有报告、导出或证据正文。 | 随正式引用建立、变化或失效而变化。 | `FR-CON-E02~E03`; `BR-CON-E02~E03` |
| `DR-CON-030` 含 credential、受限字段、业务正文、审批依据或 evidence 的日志/诊断/错误/导出正文 | 禁止保存正文 | 敏感或 owner 正文不得因诊断、错误处理、批量或导出进入 Console 自有数据。 | 不进入 Console 数据生命周期。 | `BR-CON-027~033`, `BR-CON-E02~E03` |

能力级数据停审：降级/恢复/a11y 的客户端状态、诊断上限与外围数据条件完整；无日志 schema、保留期、缓存 TTL 或报告格式，`pass_to_interfaces`。

### 7.7 Console 自有真相总表

Console 的“真相数据”仅表示本产品对自身交互事实负责，不赋予业务正式性。

| 自有类别 | 数据 ID | 明确不代表 |
|---|---|---|
| 客户端会话与选择 | `DR-CON-001` | 认证、身份、授权或正式 scope truth |
| 导航与当前布局 | `DR-CON-005` | visibility、资格或资源存在性 |
| 筛选/排序/分页/下钻意图 | `DR-CON-009` | owner 查询事实、进度或跨域一致性 |
| 未提交草稿与复核 | `DR-CON-013` | 正式对象、审批或已提交请求 |
| 客户端请求呈现 | `DR-CON-014` | owner accepted/committed 业务结果 |
| 错误/恢复/焦点/播报 | `DR-CON-025` | 业务错误真相、审计记录或 readiness |
| 用户呈现偏好 | `DR-CON-026` | 权限、治理优先级或 owner truth |

### 7.8 Forbidden-body 总边界

```text
credential / secret / identity-authority proof
Policy / Gate internal rule or authorization proof
hidden, redacted, or raw service payload
member / project / work / process / workspace / method body
governance decision internals / artifact or evidence body
audit event body / metric computation body / report body
capability registration body / archive package / sandbox execution body
diagnostic, error, export, or log payload containing any of the above
```

“禁止保存正文”不禁止在 owner-safe 查询合同允许时临时呈现获准内容；它禁止 Console 把正文复制为自身持久 truth、离线替身、诊断载荷或第二业务仓。exact safe-field 范围由 owner 合同决定，未闭口时采用更小上限。

### 7.9 功能覆盖与跨能力数据审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 核心功能是否都有数据承接 | pass | `FR-CON-001~018` 均至少有 client truth、snapshot/ref 或 forbidden 上限。 |
| 外围功能是否都有条件化数据承接 | pass | `FR-CON-E01~E03` 对应 `DR-CON-026`, `DR-CON-028~029`，合同缺失时不建立。 |
| 是否存在无功能/规则/边界来源的数据 | pass | none。 |
| 同一数据是否被重复定义为 truth 与 snapshot/ref | pass | 客户端交互事实与 owner 业务事实通过 §7.7 明确分离。 |
| 快照是否形成独立生命周期 | pass | 所有快照随 owner/语境/可见性变化更新或撤除。 |
| 引用是否被误写为正文 | pass | 所有引用只承担关系与回链，不拥有所指正文。 |
| forbidden body 是否覆盖日志/错误/导出旁路 | pass | `DR-CON-030` 显式覆盖旁路。 |
| 是否写入字段、表、索引、TTL、事务或缓存实现 | pass | none。 |

## 8. 复杂度判断

30 类需求级数据项覆盖六个节点和外围增强，其中 7 类是严格限定的 Console 客户端真相。数量来自不同归属/生命周期，而不是对象字段；单文件可完成归属审查。Step 12 必须以这些类别推导能力级 query/command/reference/export/diagnostic 边界，不能据此发明 DTO 或持久模型。

## 9. 回填草稿

正式 §11 回填 §7.1~§7.6 的数据表，并保留 §7.7 的 Console 自有真相限定和 §7.8 的 forbidden-body 总边界。正式正文可合并同类 owner snapshot 行，但不得丢失八个管理主题的 owner、生命周期或禁止正文结论。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-022` | 各 owner 允许 Console 展示、短暂保留或引用的 safe-field 与 redaction 合同 | 未闭口时只保留最小安全摘要/引用，不允许 raw body | `open / blocks_exact_view_model_design` |
| `CON-Q-023` | 客户端草稿和用户偏好的产品生命周期/跨设备范围 | 需求仅确认它们是 Console 交互 truth；保留、同步与清理策略后移 | `open / blocks_exact_lifecycle_design` |
| `CON-Q-024` | 客户端诊断可进入 Observability 的安全 envelope 与保留边界 | 当前只允许无 forbidden body 的最小诊断上下文，不能冒充 audit/evidence | `open / blocks_exact_diagnostic_contract` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否明确真相、快照、引用和禁止保存正文四类 | pass |
| 是否把 Console truth 严格限制为客户端交互事实 | pass |
| 每项是否有短句归属、生命周期和功能/规则来源 | pass |
| 六个能力节点是否逐项完成数据停审 | pass |
| 所有核心/外围功能是否有数据归属承接 | pass |
| 是否无重复 truth、无 owner 正文复制、无日志/错误旁路 | pass |
| 是否未写字段、表、索引、事务、TTL、缓存、projection/rebuild 或 repository | pass |
| 是否发现阻塞 Step 12 的 blocker | no；safe-field 与诊断 exact 合同作为能力边界 pending 传递 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 30 类数据完成四类归属、生命周期、映射和跨能力审计 | 更新 flow，激活 Step 12 | 本文件；Step 2/9/10；书写规范 §4.11 |
| 文档级 | `pass_to_step_12` | 功能所需数据无遗漏，owner truth 与 Console 客户端状态无混淆 | 创建并完成 `00_req_step_12_interfaces_dependencies.md` | 本文件；Step 6/9 |
| 项目级 | `pass_with_open_upstream_pending` | safe-field、草稿生命周期和诊断合同 pending，不阻塞能力级接口/依赖收敛 | 进入 Step 12；正式 00 仍不可写 | 项目台账；需求 flow |
