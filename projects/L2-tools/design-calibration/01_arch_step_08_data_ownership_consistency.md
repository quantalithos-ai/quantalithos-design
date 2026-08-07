# L2-tools 01 架构 Step 8: 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 创建日期: 2026-08-04
> 状态: `completed`
> 当前模式: full-restart
> 本轮口径: 从正式 `00-需求文档.md`、架构 Step 3 / 5 / 7 独立推导数据 owner 与一致性;旧正式 01 仅作 historical material 差异审计。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 8 数据所有权与一致性策略 |
| 三层恢复门禁 | 已先读取项目 ledger、架构 flow 和 Step 3 / 5 / 7;Step 7 gate 为 pass。 |
| 已读取标准 | `架构设计讨论流程_SOP.md` Step 8;`架构设计书写规范.md` §4.9;四份通用标准。 |
| 已读取需求输入 | 正式 00 §10~15;`DR-L2T-001~034`;`NFR-L2T-014~016`;`AC-L2T-030~033`。 |
| 已读取上游输入 | Hub、Sandbox、Observability、Core、Bus、SDK 当前正式边界;只把已闭口内容作为输入。 |
| 历史材料 | README、旧正式 01 及旧 02/03/05/06 只用于污染检查。 |
| 本步禁止下沉 | 字段、表、DDL、缓存、事务、outbox、API、DTO、event/topic、重试实现和保留期限。 |

## 1. Step 内计划

- [x] 读取职责边界、架构单元、依赖方向和需求数据归属。
- [x] 逐项回答 truth、snapshot / projection、reference、forbidden body 和 forbidden write。
- [x] 诊断旧 registry、executor、provider、delivery / observation 数据混层。
- [x] 先完成数据归属取舍,再推导一致性与失败口径。
- [x] 按 `A1~A5`、`S1~S3`、`P1~P6` 逐单元收敛并停审。
- [x] 完成双真相、影子反写、正文入仓、时点覆盖和一致性误用审计。
- [x] 形成正式 01 §9 回填草稿和下一步门禁。

---

## 2. 问题回答与输入诊断

### 2.1 哪些数据由本仓拥有正式真相

- `A1` 拥有稳定 tool identity、当前 formal definition 和合同锚点;当前定义不能由历史解释、实现库存或 provider descriptor 反写。
- `A2` 拥有 bound / unbound 分类、body-free binding relation,以及影响调用的本地可用性、失效、冲突和 gap 判断。
- `A3` 拥有 canonical invocation、合同锚定、受理、拒绝和 no-execution 的执行前事实。
- `A4` 拥有 execution requirement、authorization 来源可验证性与消费判断、Sandbox handoff eligibility / context,以及面向 Sandbox 的本地执行交接尝试 / gap;这些都不等于 authorization decision 或 Sandbox accepted / receipt / run。
- `A5` 拥有 normalized result / error / no-execution、Tool-domain audit、安全资格与准备,以及 outcome 成立后面向 Bus / Observability 协作的本地提交尝试 / 降级 / gap;这些都不等于外部 delivered / observed。
- `S1` 拥有显式演进历史与兼容影响解释,但当前 definition 的更正、替换和退役必须重入 `A1`。
- `S2` 只拥有检测、对账、stale / conflict / gap 报告和追溯辅助事实;正式 binding 或外部 truth 的判断仍回到相应核心边界。
- `S3` 不建立核心业务 truth,只形成可丢弃重建的读取、搜索、diff、诊断和安全材料派生视图。

### 2.2 哪些只允许是快照、投影或引用

- 快照 / 投影:Hub controlled view、caller 安全语境、正式来源存在时的 authorization safe summary、Sandbox readiness / execution-source summary、分离的 Bus delivery 与 Observability observation summary,以及本地搜索、诊断、索引和 safe-material 只读派生。
- 引用关系:Core authority / version、Hub capability / exposure、authorization result / source、Sandbox request / run / capture / failure / handoff source、actor / work / trace / correlation、Bus delivery material 与 Observability material 引用。
- `P3` 在正式 authorization owner / source 未成立时只有逻辑位置和显式 gap,不得伪称已有 snapshot 或 ref。
- `P4` 的 readiness 只是消费时点摘要,不得命名为 Sandbox ready、accepted、receipt 或 run truth。
- `P5` 中 caller、actor、work、trace 等引用各自保留正式 owner,不能统一归 Runtime。
- `P6` 必须分别承接 Bus delivery 与 Observability observation;不得合并为端到端 delivered / observed 状态。

### 2.3 哪些正文和真相明确不拥有

Raw prompt、caller / transport request body、合同外输入、secret / credential、实现源码与 inventory、SDK / provider 正文、Hub registry / descriptor / exposure / applicability 正文、policy / approval / authorization 正文、Sandbox environment / run / capture / cleanup 正文、Runtime plan / loop / checkpoint / recovery 正文、Bus history、Observability store、真实 evidence / signoff 正文均不得进入本仓。

归一化、摘要化、加密或本地缓存都不会改变禁止结论。只有先通过正式合同归一化和最小必要边界后形成的本地工具语义,才可能成为另行受约束的 L2 truth 或派生材料。

### 2.4 一致性应如何分层

- 核心本地不变量要求强一致或明确失败,不得留下 identity / definition、binding、admission、outcome / audit 的半完成状态。
- 外部 snapshot / ref 采用消费时点锚定与引用有效性一致;stale、conflict、missing、unverifiable 必须显式失败、挂起或 fail closed。
- 本地 truth 到派生视图、safe material 和外部协作状态采用最终一致;外围失败不回滚 `A5` 已成立的 outcome / audit。
- 迟到外部材料只能形成新判断、新快照、新引用或 gap,不能原地改写既有 invocation、执行前事实或 outcome。

### 2.5 旧材料诊断

| 旧数据口径 | 冲突 | 当前处理 |
|---|---|---|
| Tool Registry 同时保存 builtin / MCP / provider / allowlist | 将 tool contract、Hub registry、inventory 和 provider control 合成多真相。 | 由 `A1/A2/P2` 分层;旧对象仅 historical material。 |
| Executor 三态和本地 run / receipt | 把 handoff context 当 Sandbox execution truth。 | `A4/P4` 只保存本地判断、尝试和允许 source ref;mapping / receipt 继续开放。 |
| Raw result / capture 作为 ToolResult | 外部执行正文直接成为工具终态。 | `A5` 只拥有 normalized outcome;raw body 明确禁止。 |
| Audit Emitter / delivery status 合并 | 将 Tool-domain audit、Bus delivery 与 observation 合成一个 owner。 | `A5/P6` 分层,外部状态分别按消费时点承接。 |
| Policy cache / local allowlist | 本地伪造 authorization truth 或用 capability exposure 代替授权。 | `P3` owner-pending;无正式来源时 `A4` fail closed。 |
| Search index、diagnostic report 反写 registry | 派生维护形成第二合同 truth。 | `S2/S3` 只检测 / 派生,正式变化重入核心单元。 |
| 共享数据库事务保证跨仓一致 | 以存储共享替代 owner 边界。 | 采用 ref / snapshot / local truth 分层,不设计跨仓共享事务。 |

---

## 3. 设计取舍

### 3.1 采用的归属模型

采用规范固定的四类数据:正式真相数据、快照 / 投影数据、引用关系数据、明确不拥有的正文 / 真相。数据是否在本地出现不决定 owner;只有本仓是否定义其状态边界、生命周期和正式判断权才决定 truth 归属。

### 3.2 不采用的模型

- 不采用“所有核心数据强一致、其他最终一致”的口号,因为外部引用需要引用有效性和消费时点语义。
- 不采用共享数据库、外部正文复制或 last-known-good 默认放行,因为它们会制造第二 truth 或绕过 fail-closed。
- 不把修复能力放入 `S2/S3`;检测与派生不能替代正式写边界。
- 不把 Sandbox 执行交接尝试和 post-outcome 外部安全材料提交尝试合为一个事实。

两类 attempt 的来源不同:`A4` 的 Sandbox execution handoff attempt 是 `FR-L2T-013` 对 `DR-L2T-021` handoff 语境和 `BR-L2T-029` 交接追溯要求的架构细化;`A5` 的 post-outcome safe-material submission attempt 直接承接 `FR-L2T-017`、`DR-L2T-030` 与 `NFR-L2T-013`。前者只说明 L2 是否尝试把 canonical invocation 交给正式 execution boundary,后者只说明已成立本地 truth 的安全材料是否尝试进入 Bus / Observability event collaboration;二者不得共用 owner 判断或互相推导成功。

### 3.3 不画简化关系图的原因

本步不补简化图。`P1~P6` 同时包含多 owner、条件性快照、引用和 owner-pending 空位,线性“truth -> snapshot -> ref”图会误导为固定数据流;两张主表与逐单元表能更准确表达边界。

---

## 4. 结构化中间产物

### 4.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Tool identity、当前 formal definition 与合同锚点 | 正式真相数据 | 由 `A1` 拥有状态和当前语义。 | 实现、inventory、provider、SDK 和历史解释不能成为定义源。 |
| 定义演进历史与兼容影响解释 | 正式真相数据 | 由 `S1` 保存显式变化和影响解释。 | 历史不能直接反写当前 definition;正式更正重入 `A1`。 |
| Bound / unbound 与 body-free binding relation | 正式真相数据 | 由 `A2` 拥有本地关系和影响调用的有效性 / gap 判断。 | 不拥有 capability identity、registry、exposure 或 applicability truth。 |
| Canonical invocation、合同锚定与 admission | 正式真相数据 | 由 `A3` 拥有调用归一化语义和受理 / 拒绝事实。 | Raw request、prompt、transport body 与 Runtime orchestration 不属于该 truth。 |
| Execution requirement 与 authorization consumption judgment | 正式真相数据 | 由 `A4` 拥有工具域要求、来源可验证性和前置满足判断。 | 不拥有 authorization decision 实质或 policy 生命周期。 |
| Sandbox handoff eligibility / context / local attempt / gap | 正式真相数据 | 由 `A4` 拥有面向执行承载的本地判断和尝试事实。 | 不等于 Sandbox accepted、receipt、run、capture 或 cleanup。 |
| Normalized result / error / no-execution | 正式真相数据 | 由 `A5` 拥有工具语义终态。 | 外部 capture、provider response、delivery 或 observation 不能直接充当 outcome。 |
| Tool-domain audit | 正式真相数据 | 由 `A5` 拥有合同、调用、判断、终态和允许 source refs 的追溯。 | 不等于 Bus delivery audit、Observability store 或 Runtime checkpoint。 |
| Safe eligibility / preparation 与 post-outcome local submission attempt / gap | 正式真相数据 | 由 `A5` 拥有最小化 / 脱敏判断和面向事件协作的本地尝试事实。 | 不拥有 Bus delivered 或 Observability observed 结果。 |
| 检测、对账和一致性报告 | 正式真相数据 | `S2` 只拥有自身检测发生、结果和 gap 报告事实。 | 报告不得创建 / 修正 binding、outcome 或外部 truth。 |
| 搜索、浏览、diff、诊断、索引与 safe-material 只读视图 | 快照 / 投影数据 | `S3` 及派生承载可按核心 truth 形成可重建视图。 | 可 stale / rebuilding / unavailable,不得反写核心。 |
| Hub controlled view 与 caller context summary | 快照 / 投影数据 | `P2/P5` 为特定判断保留安全摘要。 | 按消费时点锚定,不拥有 Hub 或 caller 正文。 |
| Authorization safe summary | 快照 / 投影数据 | 仅在正式 owner/source 存在时由 `P3` 承接。 | 当前 owner-pending 时只能有 missing / unverifiable gap。 |
| Sandbox readiness / execution-source summary | 快照 / 投影数据 | `P4` 为执行前判断或特定 outcome 解释保留最小摘要。 | Readiness 非 ready/accepted;source summary 非 capture truth。 |
| Bus delivery 与 Observability observation summary | 快照 / 投影数据 | `P6` 分别按外部状态消费时点承接。 | 两类 owner 和状态不得合并,也不证明 direct route ready。 |
| Core、Hub、authorization、Sandbox、caller / work / trace、Bus / Obs refs | 引用关系数据 | `P1~P6` 只保存正式 authority、对象或材料的关联引用。 | 引用成立不转移正文和生命周期;不同 owner 不统一归 Runtime。 |
| Raw / secret / external-owner bodies | 明确不拥有的正文 / 真相 | 本仓任何 A/S/P 单元均不得吸收这些正文或生命周期。 | 摘要化、归一化、加密、缓存和审计需要都不能解除禁令。 |

### 4.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Tool identity、当前 definition 与合同锚点变化 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败,不形成部分建立、替换或退役。 | `A1` 当前定义必须只有一个正式解释。 |
| 当前 definition 与演进历史 / 影响解释 | 正式真相数据 ↔ 正式真相数据 | 当前定义优先的边界内一致 | 历史写入失败时变化不得伪装完整;历史也不得反写当前定义。 | `A1` 与 `S1` 分权但保持可追溯。 |
| Binding 建立、替换、失效与本地可用性判断 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或受影响路径 fail closed,不保留半关系。 | `A2` 不靠派生对账修复正式关系。 |
| Invocation、合同锚定与 admission / no-execution 前置 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 不受理或形成明确无执行事实,不得伪造已执行。 | 调用语义不能因 caller / carrier 分叉。 |
| Outcome 与 Tool-domain audit | 正式真相数据 ↔ 正式真相数据 | 强一致或明确缺口 | 终态不得静默缺少可解释审计;缺口必须成为正式 gap。 | 不以外部观察材料倒推终态。 |
| Core shared authority / version ref | 正式真相数据 ↔ 引用关系数据 | 引用有效性一致 | Authority 未闭口或引用不可验证时阻塞具体 package / type 声明。 | Compile 关系成立不等于 Tools-specific contract 已存在。 |
| Hub controlled snapshot / ref 与 binding 判断 | 快照 / 投影数据 / 引用关系数据 ↔ 正式真相数据 | 消费时点锚定 + 引用有效性一致 | Stale、conflict、missing 或 unverifiable 时 `A2` fail closed。 | 后到 Hub 变化形成新判断,不改写旧调用。 |
| Authorization summary / ref 与消费前置判断 | 快照 / 投影数据 / 引用关系数据 ↔ 正式真相数据 | 消费时点锚定 + 来源有效性一致 | Owner/source 缺失时 `A4` fail closed,不得伪造 snapshot。 | L2 只判断可消费性,不裁决 decision 实质。 |
| Sandbox readiness/source 与 handoff / outcome | 快照 / 投影数据 / 引用关系数据 ↔ 正式真相数据 | 消费时点锚定 + 来源有效性一致 | Mapping / carrier / receipt 缺口显式挂起或失败;不得原地改写既有 outcome。 | Readiness、handoff attempt、Sandbox receipt 分层。 |
| Caller / actor / work / trace refs 与 invocation / audit | 引用关系数据 ↔ 正式真相数据 | 引用有效性一致 | 引用失效时保留失效 / gap,不复制正文补齐。 | 各引用继续服从各自 owner。 |
| Local outcome / audit 到 safe material 与本地外部提交尝试 | 正式真相数据 ↔ 快照 / 投影数据 / 正式真相数据 | Local-truth-first | 派生或提交失败不回滚 outcome / audit;形成新 attempt / gap。 | Safe material 必须先满足最小必要、body-free、脱敏、可关联。 |
| 本地提交尝试到 Bus delivery / Observability observation | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致,owner 分离 | 外部状态未知或失败时保留本地尝试和 gap,不伪装 delivered / observed。 | Observability positive route 仍未闭口。 |
| 核心 truth 到搜索、诊断、索引和只读材料 | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | 允许 stale / rebuilding / unavailable,不得反写或阻塞核心终态。 | 派生视图是外围承接,不是第二 truth。 |
| 外部正文与本仓允许摘要 / ref | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 / 引用关系数据 | 边界约束一致 | 无法安全摘要或验证引用时拒绝、挂起或保留 gap,不得复制正文。 | Forbidden body 没有降级例外。 |
| 迟到的外部结果、delivery 或 observation | 外部 truth ↔ 已锚定本地 truth / snapshot / ref | 不可原地覆盖 | 只形成新判断、新快照、新引用或显式 gap。 | 保护历史调用和 outcome 的时点解释。 |

### 4.3 按架构单元的数据所有权表

| 架构单元 | 拥有的正式 truth | 可持有的快照 / 投影 | 可持有的引用关系 | 明确不拥有的正文 / truth | Forbidden write |
|---|---|---|---|---|---|
| `A1` 工具合同身份与定义 | Identity、当前 definition、合同锚点。 | 受控读取摘要。 | `P1` authority/version 与正式来源 / 评审 ref。 | 实现、inventory、provider、SDK 正文。 | 历史、派生或外部 descriptor 不得反写当前定义。 |
| `A2` Capability Binding | Bound/unbound、body-free relation、本地有效性 / gap。 | Hub controlled summary。 | Capability / exposure refs。 | Registry、descriptor、applicability、provider control 正文。 | `S2/P2` 不得自动修正 binding 或创建本地 allowlist。 |
| `A3` 规范调用与受理 | Canonical invocation、合同锚定、admission / rejection 前置事实。 | Caller 安全语境。 | Actor/work/trace/correlation refs。 | Raw request/prompt/transport、plan/loop/checkpoint/recovery。 | Caller、carrier 或外部执行材料不得反推受理事实。 |
| `A4` 执行前置与条件交接 | Execution requirement、auth consumption judgment、Sandbox handoff eligibility/context/attempt/gap。 | Auth summary 仅来源存在时;Sandbox readiness summary。 | Auth result/source 与 Sandbox handoff source refs。 | Policy/approval/taxonomy、Sandbox run/capture/cleanup 正文。 | 不自授权,不将 handoff attempt 写成 accepted / receipt / run。 |
| `A5` Outcome、审计与安全交接 | Normalized outcome、Tool audit、safe eligibility/preparation、post-outcome external submission attempt/gap。 | Outcome source、Bus delivery、Obs observation summary。 | Sandbox source、Bus delivery material、Obs material refs。 | Raw capture/provider response、Bus history、Obs store、evidence/signoff。 | 外部状态不改写 outcome/audit;S3 不裁决资格或记录尝试。 |
| `S1` 合同演进与影响解释 | 演进历史、兼容影响解释。 | Diff / impact 派生摘要。 | 定义来源和相关调用 / outcome refs。 | 当前 definition 的第二副本、实现正文。 | 更正、替换、退役必须重入 `A1`,不能由 S1 直接改写。 |
| `S2` 引用有效性与一致性维护 | 检测执行、stale/conflict/gap 报告和追溯辅助事实。 | 对账视图、一致性报告。 | `P1~P6` 允许 refs。 | 外部 truth、核心对象正文。 | 只能检测 / 对账 / 报告,不得修复 `A2/A5` 或外部状态。 |
| `S3` 受控读取与外围消费辅助 | 不建立核心业务 truth。 | 搜索、浏览、diff、诊断、索引、safe-material 只读派生。 | 允许的核心 / handoff refs。 | Forbidden body、delivery / observation truth。 | 不写核心、不裁决 safe eligibility、不记录 local attempt。 |
| `P1` Core 引用边界 | 不拥有外部 truth。 | 仅允许的 authority summary。 | Core authority/version ref。 | Core 正文副本、私造 Tools-specific package/type。 | 不从 compile 候选反写本地合同。 |
| `P2` Hub 影子边界 | 不拥有外部 truth。 | Controlled view / safe summary。 | Capability / exposure refs。 | Registry/descriptor/exposure/applicability 正文。 | 不将可见性解释为 authorization 或 binding 自动成立。 |
| `P3` Authorization 影子边界 | 不拥有 decision truth;当前可拥有缺口记录。 | 正式来源存在时的 safe summary。 | 正式 result/source ref。 | Policy、approval、decision、taxonomy 正文。 | Owner-pending 时不得伪造 snapshot/ref 或 allow/deny。 |
| `P4` Sandbox 影子边界 | 不拥有 execution truth。 | Consumption-time readiness/source summary。 | Request/run/capture/failure/handoff source refs。 | Run/capture/cleanup/receipt 正文和生命周期。 | Readiness 不得升级为 ready/accepted/receipt;来源不改写 outcome。 |
| `P5` Caller / work / trace 引用边界 | 不拥有外部主体 / 工作 truth。 | Caller context safe summary。 | Caller/actor/work/trace/correlation refs。 | Runtime orchestration 与各 owner 正文。 | 不将不同 refs 统一归 Runtime 或保存其正文。 |
| `P6` Bus / Observability 影子边界 | 不拥有 delivery / observation truth。 | 两类状态分别形成的 safe summary。 | Bus delivery material 与 Obs material refs。 | Bus history、Obs store、route / evidence 正文。 | 不合并 delivered/observed,不伪造 direct route 或 readiness。 |

### 4.4 架构单元数据所有权停审

| 单元 | Truth 唯一 | Projection 不反写 | External body 禁止 | 一致性 / 时点口径 | 停审 |
|---|---|---|---|---|---|
| `A1` | 是 | 是 | 是 | 当前定义强一致;S1 不反写 | pass |
| `A2` | 是 | 是 | 是 | Binding 强一致;Hub 消费时点锚定 | pass |
| `A3` | 是 | 是 | 是 | Invocation / admission 强一致 | pass |
| `A4` | 是 | 是 | 是 | Auth/Sandbox 来源有效性;缺失 fail closed | pass |
| `A5` | 是 | 是 | 是 | Outcome/audit local-truth-first;外部状态最终一致 | pass |
| `S1` | 是 | 是 | 是 | 历史与当前 definition owner 已分离 | pass |
| `S2` | 是 | 是 | 是 | 报告不修正 truth | pass |
| `S3` | 不建立核心 truth | 是 | 是 | 派生最终一致 / 可重建 | pass |
| `P1` | 外部 owner 保留 | 是 | 是 | 引用有效性 | pass |
| `P2` | 外部 owner 保留 | 是 | 是 | 消费时点锚定 | pass |
| `P3` | Owner-pending 保留 | 是 | 是 | 无来源即 gap / fail closed | pass |
| `P4` | Sandbox owner 保留 | 是 | 是 | Readiness/source 时点锚定 | pass |
| `P5` | 多 owner 分离 | 是 | 是 | 引用有效性 | pass |
| `P6` | Bus/Obs owner 分离 | 是 | 是 | 外部状态最终一致且分离 | pass |

### 4.5 跨数据边界审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 双真相 | 无 unresolved 冲突 | Tool、Hub、authorization、Sandbox、Runtime、Bus、Observability owner 已分离。 |
| S1 当前定义反写 | 禁止且已区分 | S1 只拥有历史 / 影响解释,正式变化重入 A1。 |
| A4 / A5 local attempt 重叠 | 无 | A4 是 Sandbox execution handoff attempt;A5 是 post-outcome safe material external submission attempt。 |
| 投影 / 检测反写 | 禁止 | S2/S3/P1~P6 均无核心写权限。 |
| 引用正文入仓 | 无允许入口 | 所有 external body 仅可 ref / safe summary 或明确排除。 |
| P3 伪 snapshot | 无 | Owner/source 未成立时只保存 gap,不声明存在 summary/ref。 |
| P4 readiness 误升格 | 无 | 未写 ready、accepted、receipt 或 run truth。 |
| P5 owner 合并 | 无 | Actor/work/trace/correlation 各保留正式 owner。 |
| P6 owner 合并 | 无 | Bus delivery 与 Observability observation 分开承接。 |
| 强一致误用 | 无 | 强一致仅用于本地核心不变量;跨 owner 使用引用 / 时点 / 最终一致。 |
| 最终一致回滚本地 truth | 禁止 | 外围或外部失败形成新 attempt / gap,不回滚 outcome/audit。 |
| 迟到材料覆盖 | 禁止 | 只能形成新判断、snapshot、ref 或 gap。 |
| 实现细节下沉 | 无 | 未写字段、表、事务、cache、event schema 或重试机制。 |
| 开放 blocker 伪闭口 | 无 | `L2T-UP-001~009` 全部保持当前状态。 |

---

## 5. 回填草稿

正式 01 第 9 章使用 §4.1 数据归属表和 §4.2 一致性策略表,并以短文明确以下四条边界:

1. 本地存在不等于本仓拥有;外部 owner 数据只允许受控 snapshot / ref。
2. `A4` execution handoff attempt 与 `A5` post-outcome external submission attempt 是两类独立本地 truth。
3. P3 在 owner/source 未成立时只有 gap;P4 readiness 不等于 Sandbox ready;P6 的 delivery / observation 必须分离。
4. 迟到外部事实不原地改写 invocation 或 outcome,派生 / 外部协作失败不回滚核心 truth。

正式章的校准来源必须指向本文件,不得把 §2 过程诊断或 §4.4~4.5 停审表复制成正式正文。

---

## 6. 待确认事项

本步未发现新的上游 blocker。以下开放项不阻塞数据 owner 和逻辑一致性成立,但继续阻塞具体 contract、mapping、carrier、receipt、route、package 和 client 的定稿:

- `L2T-UP-001~002`:authorization owner / source / taxonomy。
- `L2T-UP-003~004`:Sandbox mapping、receipt / feedback / cleanup seam。
- `L2T-UP-005~007`:Observability producer / source / route / readiness 和可冻结 workspace baseline。
- `L2T-UP-008`:Core Tools-specific shared contract authority。
- `L2T-UP-009`:SDK tools-specific client seam。

## 7. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否使用规范四类数据 | pass |
| 是否先归属后一致性 | pass |
| 是否覆盖 14 个架构单元并逐项停审 | pass |
| 是否区分 A4 / A5 两类 local attempt | pass |
| 是否保护 P1~P6 多 owner / pending 边界 | pass |
| 是否完成跨数据边界审计 | pass |
| 是否避免实现细节和固定协议 | pass |
| 是否保留全部 blocker | pass |

```text
current_step = Step 8 data_ownership_consistency completed
gate_status = pass
gate_reason = four data classes, per-unit ownership, consumption-time consistency and forbidden-write boundaries passed cross-data audit
next_allowed_action = create_and_complete_01_arch_step_09_interactions_communication
formal_document_write_allowed = false
commit_required = false
```
