# Step 11. 数据需求与数据归属

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 11
- 回填章节：`00-需求文档.md` §11（书写规范 4.11）
- 范围基线：当前版只支持以 `ProjectMemberRef` 为执行主语、以 `GlobalMemberRef` 为身份锚的项目型宿主
- 停审约束：本文件完成后停审；未经用户再次明确确认，不得创建 Step 12 或修改正式 `00-需求文档.md`

### 1.1 Step 内计划

- [x] 读取 SOP Step 11、书写规范 4.11、Step 02 / 09 / 10
- [x] 复核 Runtime、Member、Images、Sandbox、Tools、Identity、Work 的数据 owner 边界
- [x] 按 `C-MS-1 -> C-MS-2 -> C-MS-3 -> C-MS-4 -> C-MS-5` 串行判定真相、快照、引用和禁止保存正文
- [x] 每项补齐一句归属说明、需求级生命周期及功能 / 规则来源
- [x] 补充外围增强数据，确保派生数据不成为新写源
- [x] 后置审计旧 00 的 `ActiveMember` 数据树及旧 01~03 对象 / 存储污染
- [x] 完成跨节点重复 owner、分类冲突、禁止正文遗漏、孤儿数据和实现泄漏审计

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 11 / 书写规范 4.11 | current_standard | 固定四类数据、四列表结构、逐节点停审与跨能力审计门禁 |
| `00_req_step_02_position_boundary.md` | pass | 固定 control plane、host truth、runtime session、execution handoff 四层数据边界 |
| `00_req_step_09_functional_requirements.md` | pass | 提供 FR-MS-001~012 与 FR-MS-E01~E04；每项数据必须承接功能 |
| `00_req_step_10_business_rules_boundaries.md` | pass | 固定 BR-MS-001~050、owner 不转移、body-free 与 fail-closed 约束 |
| `L2-runtime` 正式 00~07 | current_formal_stopped | run / goal / plan / memory / checkpoint / outcome 正文不进入宿主 truth |
| `L2-member/00-需求文档.md` | current_formal_stopped | Member 拥有请求 / 信号 / 报告及本地尝试；本仓拥有接受、registry、host session 与健康判定 |
| `L2-member-images` 正式 00 与当前台账 | requirement_boundary_formally_stopped；detailed_contract_pending | 正式消费 pinned entry 供给方向；exact manifest / evidence 数据形态仍 pending |
| `L4-sandbox`、`L2-tools` 当前正式边界 | current_formal | binding / feedback 只作引用或安全摘要；隔离与工具执行正文保持外置 |
| `L1-identity`、`L1-work` 当前正式边界 | current_formal | ProjectMember / GlobalMember 为外部 truth，本仓只持引用与必要安全摘要 |
| 旧 README、旧正式 00 / 01 / 02 / 03 / 05 / 06 | historical_material | 只在独立分类完成后做污染审计，不继承对象、字段、状态、ER、表或保留策略 |

## 3. SOP 问题回答

| 问题 | 收敛结论 |
|---|---|
| 哪些数据由本仓拥有真相？ | 宿主意图受理与编排决定、宿主实例与装配结论、注册 / endpoint / host session、宿主健康与处置、清理 / 对账 / 本地交接事实。 |
| 哪些只是快照？ | Identity / Work 适用性、镜像 / 后端 / binding 可用性、Member 请求 / 信号 / 报告、健康来源和外部 cleanup / delivery / observed / accepted 的时点安全摘要。 |
| 哪些只是引用？ | ProjectMember、GlobalMember、pinned image、credential、承载 / 挂载 / binding、Runtime、Sandbox / backend、Bus / Observability 与下游对象引用。 |
| 哪些正文绝不能保存？ | L1 主体正文、镜像与供应链证据正文、secret / credential / mount 内容、Member 内部正文、Runtime / Tool / Sandbox / backend 正文、外部观测 / 归档 / evidence 正文。 |
| 生命周期口径是什么？ | 本仓真相随正式业务变化建立并保留历史；快照随 owner truth 变化且 freshness 显式；引用随关联变化；禁止正文不进入本仓生命周期。 |

## 4. 能力节点串行执行与停审

| 顺序 | 节点 | 数据范围 | gate_status | 停审结论 |
|---:|---|---|---|---|
| 1 | C-MS-1 宿主意图与执行主语 | D-MS-001~007 | pass | 意图 / 决定 truth 与 Identity / Work ref、snapshot、正文边界分开 |
| 2 | C-MS-2 宿主装配与隔离就绪 | D-MS-008~017 | pass | 宿主实例 / 装配 truth 与 image / credential / binding 外部数据分开 |
| 3 | C-MS-3 注册与运行会话 | D-MS-018~024 | pass | 宿主接受 / registry / session truth 与 Member / Runtime 数据分开 |
| 4 | C-MS-4 健康、恢复与终止 | D-MS-025~030 | pass | 宿主健康 / 处置 truth 与外部信号、运行 / 隔离正文分开 |
| 5 | C-MS-5 清理、对账与事实交接 | D-MS-031~037 | pass | 本地 cleanup / reconcile / handoff truth 与外部完成状态分开 |
| 6 | 外围与跨节点审计 | D-MS-E01~E04 + 复用 / 禁止正文审计 | pass | 外围只形成本地增强事实或派生快照，不新增外部 truth owner |

## 5. C-MS-1 数据：宿主意图与执行主语

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-001` 宿主意图受理结论 | 真相数据 | 宿主意图的受理、拒绝或等待结论由本仓拥有正式真相。 | 每次正式意图受理显式形成；后续重试或变化形成关联事实，不覆盖既有结论。 |
| `D-MS-002` 宿主编排决定与重复 / 冲突结论 | 真相数据 | launch、stop、restart、relocate、无动作及重复 / 冲突处置决定由本仓拥有正式真相。 | 随正式编排决定建立、替代或终结而变化；历史决定持续可追溯。 |
| `D-MS-003` 编排决定追溯关联 | 真相数据 | 本仓拥有关键决定与其来源、主语、既有宿主事实之间的最小追溯真相。 | 随决定形成并保留；外部反馈不得改写当时关联。 |
| `D-MS-004` 项目执行主语引用 | 引用数据 | 本仓只保存对正式 `ProjectMember` 执行主语的引用，不拥有 ProjectMember 正文真相。 | 随宿主语境关联建立、变化或失效而变化；本仓不负责主体正文生命周期。 |
| `D-MS-005` 全局身份锚引用 | 引用数据 | 本仓只保存与执行主语一致的 `GlobalMember` 身份锚引用，不拥有身份正文真相。 | 随身份关联建立、变化或失效而变化；本仓不负责身份正文生命周期。 |
| `D-MS-006` 主语、身份、意图来源与适用性安全摘要 | 快照数据 | Identity / Work / authorization 的正式真相不属于本仓，但本仓可保留受理所需的时点安全摘要。 | 随上游正式真相变化而更新；scope、freshness 与冲突显式，不形成独立真相生命周期。 |
| `D-MS-007` Identity / Work / authorization / 正式意图正文 | 禁止保存正文 | 成员、项目工作、授权和意图来源正文不属于本仓真相范围，本仓不得保存其正文。 | 不进入本仓生命周期。 |

节点停审：7 项覆盖 FR-MS-001~002、BR-MS-001~007 / 046~049；未把 ID / ref 展开为字段，也未把外部主体升级为本仓 truth。`gate_status = pass`。

## 6. C-MS-2 数据：宿主装配与隔离就绪

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-008` 宿主装配条件结论 | 真相数据 | 本仓拥有基于正式来源形成的装配条件、缺口、陈旧与冲突结论。 | 随已提交编排决定建立；来源变化形成新结论，不改写旧决定依据。 |
| `D-MS-009` 宿主实例事实与世代关联 | 真相数据 | 宿主实例身份、当前归属及新旧实例关联由本仓拥有正式真相。 | 从正式建立到被替代或终结形成完整宿主生命周期；历史实例保留。 |
| `D-MS-010` 分项装配协调结果 | 真相数据 | 本仓拥有承载、镜像、挂载、凭据与 binding 装配的本地结果分类，不拥有外部资源真相。 | 随每次装配协调显式形成；迟到或补充结果形成新关联事实。 |
| `D-MS-011` 宿主装配就绪结论 | 真相数据 | ready、blocked、degraded、unknown 等宿主就绪语义由本仓拥有正式真相。 | 随必要前置和分项结果显式变化；部分成功不得覆盖缺口历史。 |
| `D-MS-012` 正式 pinned 镜像供给引用 | 引用数据 | 本仓只保存对正式镜像供给对象的 pinned 引用，不拥有镜像内容、构建或发布真相。 | 随宿主装配关联建立、替代或失效而变化；准确 handoff 形态在合同闭口前 pending。 |
| `D-MS-013` launch credential 引用 | 引用数据 | 本仓只保存当前宿主实例所消费凭据结果的安全引用，不拥有签发、撤销或正文真相。 | 随实例装配关联建立、失效或替代而变化；本仓不负责凭据正文生命周期。 |
| `D-MS-014` 承载、挂载与宿主级 binding 引用 | 引用数据 | 本仓只保存对承载资源、运行环境挂载和 `SandboxBinding` 的关联引用，不拥有外部正文或 enforcement truth。 | 随装配关联建立、变化、释放或失效而变化；外部资源生命周期归各 owner。 |
| `D-MS-015` 镜像、后端与 binding 可用性 / 验证摘要 | 快照数据 | 外部供给与隔离真相不属于本仓，但本仓可保留装配判断所需的时点安全摘要。 | 随外部 owner truth 变化而更新；stale、conflict 或 unknown 显式，不形成独立真相。 |
| `D-MS-016` 镜像内容、构建日志与供应链证据正文 | 禁止保存正文 | 镜像层、构建材料、BOM、扫描、签名和 provenance evidence 正文不属于本仓真相范围。 | 不进入本仓生命周期。 |
| `D-MS-017` credential / secret、挂载内容、Sandbox / Tool 执行正文 | 禁止保存正文 | 凭据秘密、运行环境内容、隔离策略 / capture / enforcement 和工具执行正文不属于宿主控制面真相。 | 不进入本仓生命周期。 |

节点停审：10 项覆盖 FR-MS-003~005、BR-MS-008~017 / 046~049；`L2-member-images` 与 credential / Sandbox schema pending 只影响引用形态，不改变四类归属。`gate_status = pass`。

## 7. C-MS-3 数据：注册与运行会话

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-018` 注册受理、替换与拒绝结论 | 真相数据 | 宿主注册的接受、替换、拒绝及其实例关联由本仓拥有正式真相。 | 随注册受理显式形成；重复、冲突或迟到输入只形成新关联事实。 |
| `D-MS-019` 活动注册与 endpoint 关联历史 | 真相数据 | 当前活动注册、宿主接入位置及其连续历史由本仓拥有正式真相。 | 从注册建立到替换、失效或宿主终结而变化；旧 endpoint 关联保留。 |
| `D-MS-020` host session 壳与接入可用性 | 真相数据 | host session 壳、宿主关联及接入可用 / 陈旧 / unknown 语义由本仓拥有正式真相。 | 随注册和宿主生命周期显式建立、变化或失效；不承接 Runtime run 生命周期。 |
| `D-MS-021` Member 注册请求、存活信号与状态报告安全摘要 | 快照数据 | 请求 / 信号 / 报告的来源真相归 `L2-member`，本仓只保留受理和健康判断所需安全摘要。 | 随输入到达形成时点摘要；迟到、重复、stale 与冲突显式，不形成 Member 第二真相。 |
| `D-MS-022` Runtime 执行 / 会话关联引用 | 引用数据 | 本仓只保存 host session 与 Runtime 外部对象的关联引用，不拥有运行正文或 entry truth。 | 随会话关联建立、变化或失效而变化；Runtime 正文生命周期归 Runtime。 |
| `D-MS-023` Member 内部在场、交互与请求 / 信号原始正文 | 禁止保存正文 | Member presence、入站 / 出站交互及请求 / 信号原始正文不属于本仓真相范围。 | 不进入本仓生命周期。 |
| `D-MS-024` Runtime run / turn / goal / plan / memory / checkpoint / entry 正文 | 禁止保存正文 | Runtime 运行循环和恢复内容不属于本仓真相范围，本仓不得保存其正文。 | 不进入本仓生命周期。 |

节点停审：7 项覆盖 FR-MS-006~007、BR-MS-018~026 / 046~049；正式采用 `L2-member` 的需求级 owner 分工，详细 IPC、DTO、凭据形态仍 pending。`gate_status = pass`。

## 8. C-MS-4 数据：健康、恢复与终止

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-025` 宿主健康结论与失败分类 | 真相数据 | host、session、backend、unknown 分层的宿主健康与失败结论由本仓拥有正式真相。 | 随允许信号与正式判断显式变化；迟到信号不得覆盖当前或历史结论。 |
| `D-MS-026` 宿主恢复、重启、停止、终止与 hold 决定 | 真相数据 | 宿主侧处置决定由本仓拥有正式真相。 | 每次正式处置形成新决定并回链宿主实例；替代决定不抹写历史。 |
| `D-MS-027` 宿主处置 unknown 与外部前置缺口结论 | 真相数据 | 外部副作用未知、合同缺口和保持等待语义由本仓拥有本地正式结论。 | 随未知被确认、消除或升级形成新结论；不得原地升格为成功。 |
| `D-MS-028` Member、host session、承载后端与 binding 健康信号摘要 | 快照数据 | 各来源原始 truth 不属于本仓，但本仓可保留宿主判断所需的时点安全摘要。 | 随来源变化而更新；source、freshness、conflict 和 unavailable 显式。 |
| `D-MS-029` Runtime checkpoint / progress 与 Sandbox / backend 反馈引用 | 引用数据 | 本仓只保存宿主处置所需的外部运行、隔离和后端反馈关联，不拥有其内容真相。 | 随处置语境关联建立、变化或失效而变化；正文生命周期归外部 owner。 |
| `D-MS-030` Runtime 结果 / checkpoint、backend 日志、容器文件 / 转储与 Sandbox capture 正文 | 禁止保存正文 | 运行内容、承载底层材料和隔离 capture 不属于本仓真相范围。 | 不进入本仓生命周期。 |

节点停审：6 项并复用 D-MS-009，覆盖 FR-MS-008~009、BR-MS-027~036 / 046~049；未继承固定心跳阈值、checkpoint 内容或 backend 日志。`gate_status = pass`。

## 9. C-MS-5 数据：清理、对账与事实交接

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-031` 宿主下线收束结论 | 真相数据 | 宿主终结 / 替代后的本地关联收束与未闭合缺口由本仓拥有正式真相。 | 随下线或替代决定形成；关联失效复用 D-MS-019 / 020 的既有生命周期。 |
| `D-MS-032` cleanup / release 本地决定、尝试、gap 与 residual | 真相数据 | 本仓拥有清理和 release 的本地决定、尝试及已知缺口，不拥有外部完成 truth。 | 每次尝试形成新事实；外部反馈不覆盖既有尝试或缺口历史。 |
| `D-MS-033` 残留、孤儿、漂移分类与对账处置 | 真相数据 | 控制面差异分类和 repair、hold、escalate、unknown 处置由本仓拥有正式真相。 | 随对账显式形成并回链宿主实例；差异消除不删除历史。 |
| `D-MS-034` 宿主安全材料与本地 handoff attempt / gap | 真相数据 | 从已提交宿主事实形成的 body-free 材料及本地交接尝试 / 缺口由本仓拥有正式真相。 | 随本地事实提交或授权消费形成；新尝试不回滚或改写源 truth。 |
| `D-MS-035` 外部 cleanup、delivered、observed 与 accepted 状态摘要 | 快照数据 | 外部完成与消费 truth 不属于本仓，但本仓可保留与本地尝试关联的时点安全摘要。 | 随外部 owner truth 变化形成新摘要；不得反写本地事实。 |
| `D-MS-036` 外部资源、binding、cleanup、Bus、Observability 与下游消费引用 | 引用数据 | 本仓只保存清理、对账和交接所需的外部关联引用，不拥有外部正文。 | 随关联建立、变化或失效而变化；本仓不负责外部正文生命周期。 |
| `D-MS-037` 外部 cleanup / backend、Bus receipt、Observability、Artifact / Archive / Evidence / forensic report 正文 | 禁止保存正文 | 外部资源处置、传递、观测、制品、归档、证据和调查报告正文不属于本仓真相范围。 | 不进入本仓生命周期。 |

节点停审：7 项并复用 D-MS-009 / 019 / 020 / 025，覆盖 FR-MS-010~012、BR-MS-037~049；attempt / snapshot / ref 均未升格为 external completed / observed / accepted。`gate_status = pass`。

## 10. 外围增强数据

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MS-E01` 容量与放置建议视图 | 快照数据 | 该视图从本仓 truth 和允许的外部摘要派生，不形成调度或基础设施新真相。 | 随来源变化而更新，可失效；不形成独立业务真相生命周期。 |
| `D-MS-E02` 宿主资产预热本地尝试与结果 | 真相数据 | 预热的本地决定、尝试、结果和缺口由本仓拥有正式真相，但不改变正式装配结果。 | 每次预热形成独立事实；失败或过期不改写 pinned 引用和 readiness。 |
| `D-MS-E03` forensic body-free 关联材料 | 真相数据 | 本仓拥有调查用安全关联材料的形成与交接事实，不拥有报告、证据或 verdict 正文。 | 随调查语境形成并回链既有宿主事实；外部缺口保持显式。 |
| `D-MS-E04` 聚合宿主安全视图 | 快照数据 | 聚合视图由本仓已提交 truth 派生，不成为写源。 | 随源 truth 变化而更新，可延迟、失效或重建，不形成独立真相生命周期。 |

外围停审：4 项分别承接 FR-MS-E01~E04 和 BR-MS-050；外围不新增外部 owner truth，也不成为核心闭环前置。`gate_status = pass`。

## 11. 数据分类、映射与复用审计

### 11.1 四类数据结论

| 数据类型 | 数量 | 数据项 |
|---|---:|---|
| 真相数据 | 19 | D-MS-001~003、008~011、018~020、025~027、031~034、E02~E03 |
| 快照数据 | 7 | D-MS-006、015、021、028、035、E01、E04 |
| 引用数据 | 8 | D-MS-004~005、012~014、022、029、036 |
| 禁止保存正文 | 7 | D-MS-007、016~017、023~024、030、037 |

所有快照必须保持 owner、scope、消费时点与 freshness 语义，所有引用由对应 owner 解析；解析失败、stale、conflict、unknown 或合同 pending 不得由本仓补造第二 truth。禁止正文只说明需求边界，不预设过滤器、存储或加密实现。

### 11.2 数据与功能 / 规则映射

| 数据范围 | 能力节点 | 功能来源 | 规则来源 |
|---|---|---|---|
| D-MS-001~007 | C-MS-1 | FR-MS-001~002 | BR-MS-001~007、046~049 |
| D-MS-008~017 | C-MS-2 | FR-MS-003~005 | BR-MS-008~017、046~049 |
| D-MS-018~024 | C-MS-3 | FR-MS-006~007 | BR-MS-018~026、046~049 |
| D-MS-025~030；复用 D-MS-009 | C-MS-4 | FR-MS-008~009 | BR-MS-027~036、046~049 |
| D-MS-031~037；复用 D-MS-009 / 019 / 020 / 025 | C-MS-5 | FR-MS-010~012 | BR-MS-037~049 |
| D-MS-E01 | 外围增强 | FR-MS-E01 | BR-MS-046~050 |
| D-MS-E02 | 外围增强 | FR-MS-E02 | BR-MS-009~017、046~050 |
| D-MS-E03 | 外围增强 | FR-MS-E03 | BR-MS-036 / 045~050 |
| D-MS-E04 | 外围增强 | FR-MS-E04 | BR-MS-043 / 047 / 050 |

映射审计：41 项数据全部至少回指一项功能和规则；FR-MS-001~012、FR-MS-E01~E04 均有数据承接，孤儿数据与无数据功能均为 0。

### 11.3 跨节点复用口径

| 数据项 | 首次归属节点 | 后续消费节点 | 复用边界 |
|---|---|---|---|
| D-MS-009 宿主实例事实与世代关联 | C-MS-2 | C-MS-3~5 | 后续节点只关联和推进同一宿主 truth，不另建第二实例真相。 |
| D-MS-019 / 020 注册、endpoint 与 host session | C-MS-3 | C-MS-4~5 | 健康和下线只形成变化 / 失效，不复制 registry 或 session truth。 |
| D-MS-025 宿主健康与失败分类 | C-MS-4 | C-MS-5 | 对账只消费已提交分类，不反向改写健康历史。 |
| D-MS-028 / 029 外部信号摘要与引用 | C-MS-4 | C-MS-5 | 对账可复用允许反馈，不取得外部 owner truth。 |

## 12. Pending 对数据归属的影响

| Pending | 影响数据 | 当前口径 |
|---|---|---|
| MSVC-UP-001 Runtime entry / session surface | D-MS-022 / 024 / 029 / 030 | 只确定引用与禁止正文类别；对象名、mapping、schema 和恢复成功仍 pending |
| MSVC-UP-002 Member launch / register / heartbeat / status | D-MS-018~023 | 需求级 owner 分工已正式停审；请求 / 信号 / 报告准确载荷、凭据和 IPC 仍 pending |
| MSVC-UP-003 member-images handoff | D-MS-012 / 015 / 016 | 对端正式 00 已停审并确认 pinned entry 供给方向；exact ref / snapshot schema 仍 pending，forbidden evidence body 边界不变 |
| MSVC-UP-004 SandboxBinding / release | D-MS-014~017 / 028~030 / 035~037 | 只确定本地关联与外部 ref / snapshot / forbidden body；字段和动作 caller pending |
| MSVC-UP-005 policy 到宿主传递 owner | 无当前数据项 | 不继承旧 `PolicySnapshot`；owner 闭口并进入本仓时必须重开受影响 Step |
| MSVC-UP-006 launch credential owner | D-MS-013 / 017 | 只允许安全引用并禁止 credential 正文；签发、撤销和准确形态 pending |
| MSVC-UP-007 Core schema / event family | 全部跨仓 ref / snapshot | 数据类别成立，不代表共享 ID、ref、event 或 payload schema 已闭口 |
| MSVC-UP-008 SDK compile target | 无需求级归属变化 | 后移架构 / 详细设计，不新增 SDK truth 数据 |
| MSVC-UP-009 非项目型执行主语 | D-MS-004~007 | 当前项目型-only 已闭合；未来纳入须先定义第三种主语并重开数据范围 |

## 13. 旧材料后置污染审计

| 旧数据 / 设计 | 问题 | 当前处理 |
|---|---|---|
| `ActiveMember` 及 starting / active / paused / crashed / retired | 把成员主体、宿主实例和旧状态机混为单一记录 | 不继承对象或枚举；宿主 truth 由 D-MS-009 承接，ProjectMember / GlobalMember 只作 D-MS-004 / 005 引用 |
| `EndpointRecord` 的 create / update / delete | 用 CRUD 对象代替接入语义 | 不继承对象与 CRUD；当前活动关联和历史由 D-MS-019 / 020 承接 |
| `HeartbeatRecord` 的 append / update | 把 Member 信号、原始时序记录和宿主健康结论混层 | Member 输入只作 D-MS-021 / 028 安全摘要，宿主健康 truth 由 D-MS-025 承接；无固定时序存储结论 |
| `PolicySnapshot` active / superseded | Policy 传递 owner 尚未闭口，却预建缓存对象和生命周期 | 删除；MSVC-UP-005 闭口前无当前数据项 |
| `Role / image_variant` 挂在 `ActiveMember` | 让本仓拥有 Role 映射并复制镜像供给语义 | 删除；只保留 D-MS-012 正式 pinned 镜像引用，mapping / image truth 外置 |
| GlobalMemberId / ProjectMemberId 作为本地实体字段 | 容易把外部主体 ref 误写成本仓正文 truth | 只保留 D-MS-004 / 005 引用类别；字段形态后移且不得改变 owner |
| 旧 02 / 03 的 WorkerSlot、CapabilityMount、ExecutionHandle、Tool / Sandbox handle | 把内部对象方案、工具执行和隔离执行并入宿主 truth | 不继承；宿主装配只保留 D-MS-010 / 014，Tool / Sandbox 执行正文进入 D-MS-017 / 030 禁止范围 |
| 旧 03 的 ExecutionFeedbackEnvelope / RuntimeCallbackMaterial / raw host result | 把 Runtime 消费结构和原始执行正文升格为本仓输出 truth | 不继承；当前只保留 D-MS-034 本地 body-free handoff 与 D-MS-022 / 029 外部引用 |
| 热状态、Observability / Archive 归档、表 / 索引 / append-only 建议 | 混入存储、保留、归档和投影实现 | 全部后移；本步只锁需求级生命周期，外部正文按 D-MS-037 禁止保存 |

## 14. 跨节点审计、回填与门禁

### 14.1 跨节点审计

| 审计项 | 结论 |
|---|---|
| 四类覆盖 | 真相 19、快照 7、引用 8、禁止正文 7，共 41 项，均为规范允许类型 |
| 重复 truth owner | 0；跨节点共享通过 §11.3 复用首次归属数据，不重复建真相 |
| 快照 / 引用冲突 | 0；摘要表达消费时点，ref 表达外部对象关联，两者未混写 |
| 禁止正文遗漏 | 未发现；L1、Member、Runtime、Images、Tools、Sandbox、backend、Bus、Observability、Artifact / Archive / Evidence 均覆盖 |
| 孤儿数据 / 无数据功能 | 0 / 0 |
| sibling readiness 伪造 | 无；Member Images / Member 均只采用已停审需求级边界，exact contract 与正向 readiness 继续 pending |
| 实现泄漏 | 无字段清单、表结构、索引、数据库、缓存策略、TTL、事务、outbox、projection、rebuild、repository、port 或 DDL |
| historical pollution | 无；旧对象名、状态枚举、ER、CRUD、callback body 和归档 / 存储策略均未继承为当前结论 |

### 14.2 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_11_data_ownership.md`

正式装配时采用 D-MS-001~037 与 D-MS-E01~E04 的四列数据归属表，并保留 §11.1 四类摘要和“snapshot / ref 不成为第二 truth”的总则。过程停审、pending、历史污染与自检留在校准材料；不得在装配时补字段、对象关系或存储方案。

### 14.3 门禁自检

- [x] 41 项数据均使用真相数据、快照数据、引用数据或禁止保存正文之一
- [x] 每项均有数据项、数据类型、一句归属说明和需求级生命周期口径
- [x] 五个能力节点已按顺序停审，外围与跨节点复用已审计
- [x] 每项均有功能与规则来源，核心和外围功能的数据承接均完整
- [x] 外部正文、secret、Runtime / Tool / Sandbox 执行内容和观测 / 归档正文明确禁止
- [x] 未修改正式 `00-需求文档.md`，未创建 Step 12

结论：`gate_status = pass`，`current_state = stop_review`。下一步仅可在用户再次明确确认后读取 Step 12 SOP / 书写规范并创建 `00_req_step_12_interfaces_dependencies.md`。
