# Step 16 · 需求追溯矩阵

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §16「需求追溯矩阵」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 16  
> 对应书写规范：`standards/document/需求文档书写规范.md` §4.16  
> 直接输入：Step 7～15 已停审的核心能力、故事、功能、规则、数据、接口、NFR、验收、风险与待确认事项。  
> 主矩阵以功能需求为中心，只做映射，不在矩阵中新增需求或关闭 pending。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 16 · 需求追溯矩阵 |
| 输出文件 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes；需求 SOP Step 16、书写规范 §4.16 与中间产物规范 |
| 已读取前序输入 | yes；Step 7～15 全部文件及 N1～N4 能力级停审记录 |
| 模块骨架 | done：功能中心主矩阵、能力小循环覆盖、接口/NFR 审计、孤儿检查、重复/串线审计 |
| 进入条件 | `pass`；Step 15 已完成并通过门禁 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 以功能需求为主轴建立六列主矩阵 | done | 见 §7.1 |
| 核对 N1～N4 的故事→功能→规则→数据→接口→NFR→验收小循环 | done | 见 §7.2 |
| 检查故事、功能、规则、数据、接口、NFR 和验收孤儿 | done | 见 §7.3 |
| 检查重复定义、跨能力串线和依赖类型冲突 | done | 见 §7.4 |
| 核对外围增强与 pending 不被误写为核心 ready | done | 见 §7.1、§7.4 |
| 不新增前文未确认项 | done | 见 §5、§7.5 |
| 形成正式回填草稿、自检和门禁 | done | 见 §9、§11、§12 |

## 3. 本步输入与矩阵边界

| 输入 | 本步使用方式 | 不直接写入的内容 |
|---|---|---|
| Step 7 | 使用 N1～N4 既定顺序和停审结果；不把能力逻辑关系改写成实施顺序。 | 新能力节点、页面清单或执行排期。 |
| Step 8 | 使用 `US-CHAT-001~018`、`US-CHAT-E01~E04` 的既有映射。 | 新故事或故事正文重写。 |
| Step 9 | 使用 `F-CHAT-001~017`、`F-CHAT-E01~E04` 作为主矩阵行。 | 新功能、CRUD/API 主轴或实现任务。 |
| Step 10～14 | 分别承接 `BR-CHAT-*`、Step 11 数据分类、Step 12 接口主题、`NFR-CHAT-*`、`AC-*`。 | 新规则、新数据类别、新接口、新 NFR 或新验收项。 |
| Step 15 | 只引用风险与待确认事项作为状态背景，不把它们转成功能或关闭条件。 | 新的解决方案、owner 结论或 readiness。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个核心能力节点是否完成故事、功能、规则、数据、接口、NFR 和验收小循环？ | 是。N1～N4 均有对应范围和停审结论；N2/N3/N4 的正向 owner surface pending 已显式保留。 |
| 每个核心能力节点对应哪些故事和功能？ | N1=`US-CHAT-001~004` / `F-CHAT-001~003`；N2=`US-CHAT-005~009` / `F-CHAT-004~008`；N3=`US-CHAT-010~013` / `F-CHAT-009~012`；N4=`US-CHAT-014~018` / `F-CHAT-013~017`；外围为 `US-CHAT-E01~E04` / `F-CHAT-E01~E04`。 |
| 每个功能是否有规则、数据、接口/NFR 和验收承接？ | 是。主矩阵逐行连接故事、规则、数据和验收；§7.2 另列接口/依赖和 NFR 主题，保证六层小循环闭合。 |
| 是否存在没有来源的功能、没有保护的规则、没有归属的数据或没有验收的功能？ | 未发现。漏项结论见 §7.3、§7.5。 |
| 是否存在跨能力重复、边界串线或依赖口径冲突？ | 未发现改变语义的冲突。N1 是语境前置，N2 是事实显化，N3 是意图/结果，N4 是变化/恢复；owner truth 仍只由正式 owner 提供。 |
| 是否为了补齐矩阵新增了未确认项？ | 否。矩阵只引用 Step 7～15 已存在的 ID、范围引用和 pending 状态。 |

## 5. 当前材料问题诊断

| 历史或错误矩阵方式 | 问题 | 当前处理 |
|---|---|---|
| 以页面、旧对象名、API 或 transport 事件为主轴 | 会把 UI 组件、传输机制或 shadow object 当成业务需求。 | 主轴固定为 `F-CHAT-*`，页面/组件只在前文能力和未来设计中承接。 |
| 只连接故事和功能 | 无法发现规则、数据、接口、NFR 或验收孤儿。 | 主矩阵连接故事、规则、数据和验收，§7.2 补接口/NFR，§7.3/§7.4 做完整审计。 |
| 用空白或新占位 ID 补齐缺口 | 会把未确认项伪装成正式需求。 | 缺口沿用 `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*` 和 Step 15 open 状态。 |
| 把 pending owner surface 记为 ready | 会让正式装配和后续实现越过安全边界。 | N2/N3/N4 和外围保留 `pass_with_*_contract_pending` / `pass_conditional`。 |
| 以历史首屏、P95、SLA、AG-UI 或固定规模作为矩阵条件 | 没有当前 authority 和场景边界。 | 仅引用 Step 13 的行为级 NFR；历史数值仍是 rejected/pending。 |

## 6. 设计取舍

| 主题 | 不采用的做法 | 当前取舍 |
|---|---|---|
| 主轴 | 按故事、能力节点、页面或接口平铺。 | 以功能需求为主轴，符合 §4.16 固定六列结构。 |
| 接口映射 | 在主矩阵新增实现协议列或 API 名称。 | 在能力小循环覆盖表列出 Step 12 的能力级接口/依赖主题，不引入协议细节。 |
| pending | 为了矩阵闭合而创造新项。 | 只映射已有需求和 open item；pending 是状态，不是新功能。 |
| 跨 owner 事实 | 把联合 view 归为 Chat truth。 | 数据列保留 local truth、safe snapshot、external ref、forbidden body 四类边界。 |
| 审计 | 只做格式检查。 | 检查孤儿故事/功能/规则/数据/接口/NFR/验收、重复定义、边界串线和依赖类型冲突。 |

## 7. 结构化中间产物

### 7.1 主追溯矩阵（以功能需求为中心）

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| `F-CHAT-001` 安全协作入口与语境选择 | N1 | `US-CHAT-001~002` | `BR-CHAT-001~002`, `004` | route/context、scope/selection；owner actor/scope/visibility safe ref | `AC-CHAT-001`; `AC-FR-CHAT-001`; `AC-BR-CHAT-001`; `AC-DR-CHAT-001/003`; `AC-NFR-CHAT-002~004`, `007` |
| `F-CHAT-002` 入口可见性与可用性表达 | N1 | `US-CHAT-003` | `BR-CHAT-001~002`, `006` | owner visibility/availability/freshness snapshot；最小披露状态 | `AC-CHAT-001`; `AC-FR-CHAT-001`; `AC-BR-CHAT-001`; `AC-DR-CHAT-002/005`; `AC-NFR-CHAT-002~004`, `007` |
| `F-CHAT-003` 语境恢复与撤销清理 | N1 | `US-CHAT-002`, `US-CHAT-004` | `BR-CHAT-003~005` | route/context、recovery context、cache metadata；撤销后清理 | `AC-CHAT-001`; `AC-FR-CHAT-001`; `AC-BR-CHAT-001`; `AC-DR-CHAT-001/002/004`; `AC-NFR-CHAT-002`, `004`, `007` |
| `F-CHAT-004` Conversation/Turn 可理解展示 | N2 | `US-CHAT-005` | `BR-CHAT-007~010` | Conversation/Turn safe display view、source/version/freshness marker、external ref | `AC-CHAT-002`; `AC-FR-CHAT-002`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002~005`; `AC-NFR-CHAT-001~004`, `006~007` |
| `F-CHAT-005` 跨 owner 协作摘要展示 | N2 | `US-CHAT-006` | `BR-CHAT-007~010`, `012` | Identity/Work/Member/Runtime safe summary、来源和可见性快照 | `AC-CHAT-002`; `AC-FR-CHAT-002`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002/003/005`; `AC-NFR-CHAT-002~006` |
| `F-CHAT-006` Gate/Decision 语境卡片 | N2 | `US-CHAT-007` | `BR-CHAT-007`, `011~012` | Governance safe view、Gate/Decision ref、授权语境快照 | `AC-CHAT-002`; `AC-FR-CHAT-003`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002~004`; `AC-NFR-CHAT-003~006` |
| `F-CHAT-007` Artifact 引用与安全预览 | N2 | `US-CHAT-007`, `US-CHAT-009` | `BR-CHAT-007~013` | Artifact safe ref、summary、preview metadata、version/visibility；正文禁止 | `AC-CHAT-002`; `AC-FR-CHAT-003`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002~004`; `AC-NFR-CHAT-003~005` |
| `F-CHAT-008` 来源、新鲜度与降级状态表达 | N2 | `US-CHAT-008~009` | `BR-CHAT-007`, `009~013` | source/version/freshness/visibility marker、partial/stale/unavailable/blocked snapshot | `AC-CHAT-002`; `AC-FR-CHAT-004`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002/005`; `AC-NFR-CHAT-001~006` |
| `F-CHAT-009` 草稿、回复目标与选择状态 | N3 | `US-CHAT-010` | `BR-CHAT-014`, `016`, `018` | draft、reply target、selection/focus、attachment ref；local truth | `AC-CHAT-003`; `AC-FR-CHAT-005`; `AC-BR-CHAT-003`; `AC-DR-CHAT-001/003`; `AC-NFR-CHAT-001`, `005`, `007` |
| `F-CHAT-010` 普通协作意图受控发起 | N3 | `US-CHAT-011` | `BR-CHAT-014~016`, `018`, `020` | local intent/attempt、command receipt/result ref；owner command truth 外置 | `AC-CHAT-003`; `AC-FR-CHAT-005`; `AC-BR-CHAT-003`; `AC-DR-CHAT-001/003`; `AC-NFR-CHAT-003~006` |
| `F-CHAT-011` 治理意图受控发起 | N3 | `US-CHAT-012` | `BR-CHAT-014~016`, `018~020` | governance authorization context、intent/attempt、receipt/result ref | `AC-CHAT-003`; `AC-FR-CHAT-005`; `AC-BR-CHAT-003`; `AC-DR-CHAT-003/004`; `AC-NFR-CHAT-003~006` |
| `F-CHAT-012` 命令结果与不确定性反馈 | N3 | `US-CHAT-011~013` | `BR-CHAT-014~020` | submitted/pending/confirmed/rejected/failed/unknown local state、receipt/result ref | `AC-CHAT-003`; `AC-FR-CHAT-006`; `AC-BR-CHAT-003`; `AC-DR-CHAT-001/003`; `AC-NFR-CHAT-003~006` |
| `F-CHAT-013` 正式变化消费与页面更新 | N4 | `US-CHAT-014` | `BR-CHAT-021~024` | formal change、source/version/visibility、owner snapshot/ref | `AC-CHAT-004`; `AC-FR-CHAT-007`; `AC-BR-CHAT-004`; `AC-DR-CHAT-002/003`; `AC-NFR-CHAT-001~003`, `014`, `017~019` |
| `F-CHAT-014` 重复、乱序、缺口与 cursor 失效处理 | N4 | `US-CHAT-014`, `US-CHAT-017` | `BR-CHAT-021~024` | cursor/resume metadata、change identity、recovery context；不保存内部 payload | `AC-CHAT-004`; `AC-FR-CHAT-007`; `AC-BR-CHAT-004`; `AC-DR-CHAT-001/002/004`; `AC-NFR-CHAT-003`, `014`, `017~021` |
| `F-CHAT-015` 断线、Desktop 重启与恢复 | N4 | `US-CHAT-015~016` | `BR-CHAT-023~026` | recovery context、reconnect/needs-action、safe cache metadata、draft | `AC-CHAT-004`; `AC-FR-CHAT-008`; `AC-BR-CHAT-004`; `AC-DR-CHAT-001/002/004`; `AC-NFR-CHAT-001~007`, `016~024` |
| `F-CHAT-016` 离线展示与安全缓存 | N4 | `US-CHAT-010`, `US-CHAT-015` | `BR-CHAT-025~026` | versioned/visibility-bounded safe snapshot、cache metadata、draft；禁止延长授权 | `AC-CHAT-004`; `AC-FR-CHAT-008`; `AC-BR-CHAT-004`; `AC-DR-CHAT-001/002/004`; `AC-NFR-CHAT-004~005`, `007`, `009~011`, `015~018` |
| `F-CHAT-017` 低敏客户端诊断入口 | N4 | `US-CHAT-018` | `BR-CHAT-027~028` | low-sensitivity diagnostic state、correlation/ref（若正式提供）；raw log/secret 禁止 | `AC-CHAT-004`; `AC-FR-CHAT-009`; `AC-BR-CHAT-004~005`; `AC-DR-CHAT-004`; `AC-NFR-CHAT-009`, `014`, `019~024` |
| `F-CHAT-E01` 历史搜索与高级过滤 | 外围增强 | `US-CHAT-E01` | `BR-CHAT-E01` | 已授权范围内的本地过滤状态和安全结果 ref | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001/002`; `AC-NFR-CHAT-001~003`, `008~011` |
| `F-CHAT-E02` Desktop 通知、托盘与快捷入口 | 外围增强 | `US-CHAT-E02` | `BR-CHAT-E02` | platform shell state、notification preference、safe deep-link ref | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001/003`; `AC-NFR-CHAT-011`, `018`, `022~024` |
| `F-CHAT-E03` 富文本与复杂附件体验 | 外围增强 | `US-CHAT-E03` | `BR-CHAT-E03` | draft、attachment ref/metadata；Artifact 正文禁止 | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001/003/004`; `AC-NFR-CHAT-008~011`, `015~016` |
| `F-CHAT-E04` Mobile 便捷体验 | 外围增强 | `US-CHAT-E04` | `BR-CHAT-E04` | platform shell state、recovery metadata、safe notification/deep-link ref | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001/002`; `AC-NFR-CHAT-011`, `018`, `022~024` |

主矩阵只列映射 ID 和已确认范围，不重写前文章节。`pending`、`blocked`、`read-only`、`pass_with_*_contract_pending` 和 `pass_conditional` 继续沿用 Step 12～15 的状态，不在矩阵中升级为 ready。

### 7.2 能力节点小循环覆盖表

| 能力节点 | 故事范围 | 功能范围 | 规则范围 | 数据范围 | 接口 / 依赖主题 | NFR 范围 | 验收范围 | 小循环结论 |
|---|---|---|---|---|---|---|---|---|
| N1 安全协作语境进入与保持 | `US-CHAT-001~004` | `F-CHAT-001~003` | `BR-CHAT-001~006` | route/context、scope/selection、actor/scope/visibility safe ref、recovery context | 安全协作语境读取；Identity/Conversation/Work safe ref；Desktop/Web/Mobile route/deep-link shell | `NFR-CHAT-001`, `004`, `008~011`, `015`, `019`, `022~024` | `AC-CHAT-001`; `AC-FR-CHAT-001`; `AC-BR-CHAT-001`; `AC-DR-CHAT-001~005` 相关项; `AC-NFR-CHAT-001~007` 相关项 | `pass` |
| N2 正式协作事实安全显化 | `US-CHAT-005~009` | `F-CHAT-004~008` | `BR-CHAT-007~013` | owner safe view/summary/preview metadata、source/version/freshness/visibility、external ref、forbidden body 上限 | 正式协作事实展示；来源与状态解释；Governance visibility/result；Artifact preview/ref；Work/Member/Runtime/Workspace summary | `NFR-CHAT-001~002`, `005`, `008~012`, `015`, `019`, `022~024` | `AC-CHAT-002`; `AC-FR-CHAT-002~004`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002~005`; `AC-NFR-CHAT-001~007` 相关项 | `pass_with_preview_contract_pending` |
| N3 用户意图受控发起与结果反馈 | `US-CHAT-010~013` | `F-CHAT-009~012` | `BR-CHAT-014~020` | draft、intent/attempt、selection/focus、receipt/result ref、local result posture | 普通协作意图入口；受控治理意图入口；命令结果与未知状态读取；SDK command/receipt surface | `NFR-CHAT-001`, `003`, `006`, `008~009`, `011`, `013`, `015~016`, `019~021`, `022~024` | `AC-CHAT-003`; `AC-FR-CHAT-005~006`; `AC-BR-CHAT-003`; `AC-DR-CHAT-001/003/004`; `AC-NFR-CHAT-001~007` 相关项 | `pass_with_governance_contract_pending` |
| N4 变化、失败、离线与恢复连续性 | `US-CHAT-014~018` | `F-CHAT-013~017` | `BR-CHAT-021~028` | formal change/cursor/resume、cache/recovery metadata、safe snapshot/ref、low-sensitivity diagnostic | 正式协作变化消费；恢复与安全缓存读取；本地恢复与过期清理；Workspace/Conversation cursor/resume；低敏诊断/handoff | `NFR-CHAT-001~007`, `009~011`, `014`, `016~024` | `AC-CHAT-004`; `AC-FR-CHAT-007~009`; `AC-BR-CHAT-004~005`; `AC-DR-CHAT-001~005` 相关项; `AC-NFR-CHAT-001~007` 相关项 | `pass_with_resume_contract_pending` |
| 外围增强 | `US-CHAT-E01~E04` | `F-CHAT-E01~E04` | `BR-CHAT-E01~E04` | search/filter state、notification preference、attachment ref、platform/recovery metadata | 搜索/过滤；Desktop 通知/托盘；富文本/附件意图；Mobile shell 适配 | 适用 `NFR-CHAT-001~003`, `008~011`, `018`, `022~024` | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001~004` 相关项; `AC-NFR-CHAT-001~007` 相关项 | `pass_conditional` |

### 7.3 孤儿项检查

| 检查项 | 结果 | 审计依据 |
|---|---|---|
| 是否存在没有故事来源的功能需求 | 否 | 主矩阵每行均列既有 `US-CHAT-*`；核心/外围范围来自 Step 8。 |
| 是否存在没有闭环映射的功能需求 | 否 | 每行均列 N1～N4 或外围增强。 |
| 是否存在没有规则保护的核心功能 | 否 | `F-CHAT-001~017` 均至少挂一组 `BR-CHAT-*`；外围挂 `BR-CHAT-E01~E04`。 |
| 是否存在没有数据归属要求的功能需求 | 否 | 每行均挂 Chat-owned、safe snapshot、external ref 或禁止正文边界。 |
| 是否存在没有接口/依赖承接的功能需求 | 否 | §7.2 的接口/依赖主题覆盖 N1～N4；exact surface pending 仍有 blocked/read-only 姿态。 |
| 是否存在没有 NFR 承接的功能需求 | 否 | 每行均列 `NFR-CHAT-*` 或外围适用 NFR。 |
| 是否存在没有验收标准的功能需求 | 否 | 每行均列 `AC-CHAT-*`、`AC-FR-CHAT-*`、`AC-BR-CHAT-*`、`AC-DR-CHAT-*` 或 `AC-NFR-CHAT-*`。 |
| 是否存在没有功能来源的规则 | 否 | Step 10 的规则映射与主矩阵功能范围可互相反查。 |
| 是否存在没有功能/边界来源的数据 | 否 | Step 11 的四类数据与主矩阵功能范围可互相反查。 |
| 是否存在没有能力/功能来源的接口或依赖 | 否 | Step 12 每个接口/依赖主题均挂 N1～N4、功能或外围范围。 |
| 是否存在没有能力/功能来源的 NFR | 否 | Step 13 §7.2 和主矩阵逐行映射；全仓 NFR 在每个相关节点覆盖。 |
| 是否存在没有来源的验收项 | 否 | Step 14 §7.8 已通过；本矩阵只引用既有 `AC-*`。 |
| 是否存在矩阵中新增加的需求 ID | 否 | 未创建新的 US/F/BR/数据/NFR/AC/接口/依赖 ID。 |

### 7.4 跨能力追溯审计

| 审计主题 | 结果 | 说明 |
|---|---|---|
| N1 语境与 N2 事实显化是否重复定义权限 | pass | N1 只负责 actor/scope/visibility 和 route 前置；N2 只消费 owner safe view/ref，不重新裁决权限。 |
| N2 事实显化与 N3 命令入口是否越界 | pass | N2 显化 Gate/Decision/Artifact 语境；N3 只发起受控意图和显示 owner result，不本地批准或生成正文。 |
| N3 命令与 N4 恢复是否冲突 | pass | N3 的 unknown/receipt 进入 N4 的 requery/reconnect；N4 不把恢复后的连接或缓存改写为 confirmed。 |
| N4 横向变化/恢复是否成为无主业务功能 | pass | N4 由 `F-CHAT-013~017`、故事、规则、数据和验收共同承接，不作为孤儿基础设施。 |
| Conversation、Governance、Artifact、Workspace、Runtime、Member 和 Observability truth 是否被重复声明 | pass | Chat 只消费 safe view/ref/result；owner truth 只在 Step 1/2/11/12 作为外部正式来源。 |
| 同一用户故事是否被拆成语义重复功能 | pass | 故事按四个能力节点归并；功能列按外部能力结果划分，不是故事原句复制。 |
| 规则是否互相冲突 | pass | owner result、fail-closed、客户端只能收紧、unknown 保守规则没有相反许可。 |
| 数据 truth/snapshot/ref/forbidden 是否冲突 | pass | Step 11 四类数据和 `AC-DR-CHAT-005` 保持一致。 |
| 接口/依赖类型是否与 Step 6 冲突 | pass | `L0-sdk` 是唯一应用边界；owner 为运行期/事件/ref 依赖；无 DB、私有 API、内部 bus 依赖。 |
| NFR 是否把无 authority 数值变成硬门槛 | pass | 历史 P95、首屏、SLA、固定规模只作为 rejected/pending，行为底线仍可验收。 |
| pending 是否被矩阵误写成 ready | pass | N2/N3/N4/外围保留 contract pending 或 conditional，风险和 open question 仍可反查。 |

### 7.5 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否 |
| 是否存在没有闭环映射的功能需求 | 否 |
| 是否存在没有规则保护的核心功能 | 否 |
| 是否存在没有数据归属要求的功能需求 | 否 |
| 是否存在没有接口/依赖承接的功能需求 | 否 |
| 是否存在没有 NFR 承接的功能需求 | 否 |
| 是否存在没有验收标准的功能需求 | 否 |
| 是否存在孤儿故事、规则、数据、接口、NFR 或验收项 | 否 |
| 是否存在重复定义、边界串线或依赖口径冲突 | 否 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否 |

## 8. 复杂度判断

主矩阵 21 行（17 项核心、4 项外围）覆盖六层映射；附加覆盖表连接 N1～N4 的接口/依赖与 NFR，审计表检查孤儿、重复、串线和 pending。矩阵规模来自追溯需要，不是测试用例或实施任务；使用范围引用避免复制正文。单文件可审查，无需附录。

## 9. 正式文档回填草稿

正式 `00-需求文档.md` §16 可回填 §7.1 主追溯矩阵与 §7.5 漏项检查表，并在正文说明：N2/N3/N4 的 exact owner contract、性能 authority、兼容矩阵和诊断 envelope 仍保持 pending；详细接口/NFR/风险审计留在 calibration，不新增 ID、测试步骤、工具或执行证据。

## 10. 待确认事项

本步不新增待确认项，沿用 Step 15 的 `OPEN-CHAT-001~012`、`RISK-CHAT-001~010` 及其引用的 `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`。矩阵只映射这些事项影响的既有结构，不改变其当前状态。

## 11. Step 16 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 主矩阵是否以功能需求为中心并具备书写规范要求的六列？ | pass | §7.1 行主轴固定为 `F-CHAT-*`。 |
| 每行是否连接能力、故事、规则、数据和验收？ | pass | 六列均有既有 ID 或已确认范围引用。 |
| 接口/依赖和 NFR 是否在能力小循环中覆盖？ | pass | §7.2 单列接口/依赖主题与 NFR 范围，不引入协议细节。 |
| 是否覆盖所有核心和外围功能 ID？ | pass | `F-CHAT-001~017`、`F-CHAT-E01~E04` 全部进入主矩阵。 |
| 是否完成孤儿、重复、跨能力串线与依赖冲突审计？ | pass | §7.3～§7.5 有显式结论。 |
| 是否没有在矩阵中新增需求或待确认项？ | pass | 只使用 Step 7～15 已存在结构和状态。 |
| 是否伪造 baseline、run、report、evidence、verdict、signoff、readiness 或 commit？ | no | 只写映射和审计结论，不声称执行事实。 |
| 是否发现阻塞 Step 17 的需求级问题？ | no | 上游合同、authority 和兼容矩阵沿用既有 pending，不阻塞正式装配前的差异审计。 |

## 12. Step 16 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 主矩阵、能力小循环覆盖、孤儿检查、跨能力审计和不新增项检查完成。 | 更新 flow 与项目台账，进入 Step 17。 |
| 文档级 | `pass_to_step_17` | 所有核心/外围功能均连接能力、故事、规则、数据、接口/NFR 和验收；pending 未被升级。 | 创建并完成 `00_req_step_17_formal_document_assembly.md`。 |
| 项目级 | `pass_with_open_contracts` | exact owner surface、数值 authority、兼容矩阵和诊断 envelope 仍待确认，但不阻塞正式 `00` 装配的差异审计。 | 只进入 Step 17；完成正式 `00` 后停审，不开始 `01`。 |

## 13. 本步结论

Step 16 已用功能需求为主轴连接 L5-chat 的能力、故事、规则、数据、接口主题、非功能要求和验收标准。`F-CHAT-001~017` 与外围 `F-CHAT-E01~E04` 均有来源和下游承接；N1～N4 的小循环、owner truth 边界、SDK-only 依赖、safe snapshot/ref、禁止正文、unknown/恢复语义和可访问性要求均完成跨能力审计。没有发现孤儿需求、重复定义、边界串线或新增未确认项。下一步可进入 Step 17，执行旧正式 `00` 的后置差异审计、逐章修复现有正式文档，然后在正式 `00` 门禁处停审。
## 14. 原型修复回写

追溯矩阵补充确认：`US-CHAT-019~022` → `F-CHAT-018~021` → 对应流程/群聊/成员边界规则 → `AC-FR-CHAT-011~014`，并由 `RISK-CHAT-011~012`、`OPEN-CHAT-013~015` 保留未闭合 owner/authority。原型文件只作为来源证据，不作为需求编号或接口合同来源。

- 自检：新增行已接入既有主轴，未新增孤立需求或反向关闭 pending。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

新增功能 `F-CHAT-018~021` 分别追溯到 `US-CHAT-019~022`、流程/绑定/成员规则、safe projection/ref 数据、SDK capability 和 `AC-FR-CHAT-011~014`。


| 功能需求 | 核心能力 | 用户故事 | 业务规则 | 数据归属 | 验收标准 |
|---|---|---|---|---|---|
| `F-CHAT-001~003` | N1 | `US-CHAT-001~004` | `BR-CHAT-001~006` | route/context、scope/selection、recovery、visibility snapshot | `AC-CHAT-001`; `AC-FR-CHAT-001`; `AC-BR-CHAT-001`; `AC-DR-CHAT-001~005`; `AC-NFR-CHAT-001~007` 适用项 |
| `F-CHAT-004~008` | N2 | `US-CHAT-005~009` | `BR-CHAT-007~013` | owner safe view/summary/preview、source/version/freshness/visibility、external ref、forbidden body 上限 | `AC-CHAT-002`; `AC-FR-CHAT-002~004`; `AC-BR-CHAT-002`; `AC-DR-CHAT-002~005`; `AC-NFR-CHAT-001~007` 适用项 |
| `F-CHAT-009~012` | N3 | `US-CHAT-010~013` | `BR-CHAT-014~020` | draft、local intent/attempt、receipt/result ref、local result posture | `AC-CHAT-003`; `AC-FR-CHAT-005~006`; `AC-BR-CHAT-003`; `AC-DR-CHAT-001/003/004`; `AC-NFR-CHAT-001~007` 适用项 |
| `F-CHAT-013~017` | N4 | `US-CHAT-014~018` | `BR-CHAT-021~028` | formal change/cursor/resume、cache/recovery metadata、safe snapshot/ref、low-sensitivity diagnostic | `AC-CHAT-004`; `AC-FR-CHAT-007~009`; `AC-BR-CHAT-004~005`; `AC-DR-CHAT-001~005`; `AC-NFR-CHAT-001~007` 适用项 |
| `F-CHAT-018` | N2 | `US-CHAT-019` | 项目详情与流程下钻规则 | project/stage/node safe projection、关联 ref | `AC-FR-CHAT-011`; `AC-BR-CHAT-001~002`; `AC-DR-CHAT-002~005`; `AC-NFR-CHAT-015~024` 适用项 |
| `F-CHAT-019` | N1/N2 | `US-CHAT-020` | Project / Conversation 绑定与独立成员可见性 | project ref、conversation ref、membership safe summary | `AC-FR-CHAT-012`; `AC-BR-CHAT-001~002`; `AC-DR-CHAT-001~003`; `AC-NFR-CHAT-004~018` 适用项 |
| `F-CHAT-020` | N2/N4 | `US-CHAT-021` | 并行分叉、汇聚和 Governance Gate 分离 | BPMN node/edge projection、branch status、Gate ref | `AC-FR-CHAT-013`; `AC-BR-CHAT-002/004`; `AC-DR-CHAT-002~005`; `AC-NFR-CHAT-012~018` 适用项 |
| `F-CHAT-021` | N1/N2 | `US-CHAT-022` | Identity / Work / Conversation 成员边界 | company member safe summary、project member summary、conversation participant summary | `AC-FR-CHAT-014`; `AC-BR-CHAT-001~002`; `AC-DR-CHAT-001~003`; `AC-NFR-CHAT-004~014` 适用项 |
| `F-CHAT-E01~E04` | 外围增强 | `US-CHAT-E01~E04` | `BR-CHAT-E01~E04` | filter/preference、attachment ref、platform/recovery metadata | `AC-FR-CHAT-010`; `AC-BR-CHAT-005`; `AC-DR-CHAT-001~004`; `AC-NFR-CHAT-001~007` 适用项 |

主矩阵的逐功能细行、接口/依赖主题和详细跨能力审计保留在 Step 16 calibration；本表只回填收口映射。审计结论：不存在无故事来源、无闭环、无规则、无数据、无接口/NFR、无验收的功能，也不存在孤儿项、重复定义、边界串线或矩阵新增 ID。

---
