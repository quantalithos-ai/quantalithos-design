# Step 14. 验收标准

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 14
- 回填章节：`00-需求文档.md` §14（书写规范 4.14）
- 证据纪律：本 Step 定义未来验收合同，不记录当前测试结果、run、artifact、report、verdict、signoff 或 readiness

### 1.1 Step 内计划

- [x] 读取 Step 14 SOP、书写规范 4.14、Step 07 / 09 / 10 / 11 / 13
- [x] 按 C-MS-1~5 逐节点收敛验收项并停审
- [x] 分别覆盖核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类
- [x] 覆盖 12 项核心功能、4 项外围功能、50 条规则、41 项数据和 20 项 NFR
- [x] 建立仅针对核心闭环和硬边界破坏的一票否决项
- [x] 标明 pending seam 对正向验收的阻塞，不伪造 ready
- [x] 审计重复、遗漏、无来源、过宽否决项和历史污染
- [x] 检查测试步骤、工具、CI、调用过程与结果事实泄漏

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 14 / 书写规范 4.14 | current_standard | 固定五类验收、三列表和一票否决结构 |
| `00_req_step_07_core_capability_loop.md` | pass | 为 AC-MS-001~005 提供五节点闭环来源 |
| `00_req_step_09_functional_requirements.md` | pass | 为 AC-MS-006~021 提供 12 核心 + 4 外围功能来源 |
| `00_req_step_10_business_rules_boundaries.md` | pass | 为 AC-MS-022~027 与一票否决提供 50 条规则来源 |
| `00_req_step_11_data_ownership.md` | pass | 为 AC-MS-028~033 提供 41 项四类数据归属来源 |
| `00_req_step_13_non_functional_requirements.md` | pass | 为 AC-MS-034~039 提供 20 项六类质量来源 |
| Step 01~06 / 08 / 12 | pass | 校验上游 authority、用户故事和接口依赖均有承接 |
| 兄弟 / 上游当前 formal 与 ledger | mixed_authority | 正式 owner 边界可用；未停审或未闭口合同只能阻塞正向验收 |
| 旧正式 00 / 06 及 README | historical_material | 仅作遗漏和伪量化审计，不继承旧通过结论 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心闭环何时成立？ | 五个能力节点均能基于正式 owner 输入形成本仓拥有的显式结论；必要正向 seam 不可用时准确 fail closed；清理、对账和事实交接不抹写历史。 |
| 功能何时完成？ | FR-MS-001~012 各自的能力级输入、输出、失败分层和 owner 边界均可判断；FR-MS-E01~E04 不反写核心 truth 且不成为核心前置。 |
| 如何判断无边界串线？ | L1、Member、Runtime、Images、Tools、Sandbox、Governance、Observability 和基础设施 truth 均不迁入本仓；compile / runtime / event / ref / adapter / fake 分类不变。 |
| 如何判断数据归属正确？ | 19 项 truth 只覆盖本仓控制面与 host truth；7 项 snapshot、8 项 ref 不成第二 truth；7 类 forbidden body 不入仓。 |
| 如何判断质量达标？ | 六类 NFR 的判断口径均成立；无 authority 的性能指标只验收测量边界完整，不伪造数字达标。 |
| 哪些是一票否决？ | 核心闭环缺失、非法 / 隐式宿主、owner 反转、安全前置旁路、正文泄漏、truth 分叉、结果层级压平或 fake / planned 伪装为 readiness。 |

## 4. 能力节点验收与停审

| 顺序 | 能力节点 | 核心 / 功能验收 | 规则 / 数据 / NFR 验收 | gate_status | 停审结论 |
|---:|---|---|---|---|---|
| 1 | C-MS-1 意图与决定 | AC-MS-001 / 006~007 | AC-MS-022 / 028 / 034~038 | pass | 项目型主语、显式决定、重复稳定和来源追溯均有承接 |
| 2 | C-MS-2 装配与就绪 | AC-MS-002 / 008~010 | AC-MS-023 / 029 / 034~039 | pass | pinned / binding / credential / partial-ready 硬边界均可判断 |
| 3 | C-MS-3 注册与会话 | AC-MS-003 / 011~012 | AC-MS-024 / 030 / 034~039 | pass | 注册、endpoint、host session 唯一性与兄弟 owner 分层有承接 |
| 4 | C-MS-4 健康与处置 | AC-MS-004 / 013~014 | AC-MS-025 / 031 / 034~039 | pass | 四层失败、显式处置、unknown fence 和实例世代有承接 |
| 5 | C-MS-5 清理与交接 | AC-MS-005 / 015~017 | AC-MS-026 / 032 / 034~039 | pass | cleanup / handoff 分层、对账、历史和安全材料有承接 |
| 6 | 外围 / 全局 | AC-MS-018~021 | AC-MS-027 / 033~039；VF-MS-001~009 | pass | 外围不阻塞核心；否决项仅覆盖整体或硬边界破坏 |

## 5. 验收标准表

### 5.1 核心能力闭环验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | `AC-MS-001` 意图与决定闭环 | 正式宿主意图能够以 ProjectMemberRef 为执行主语、GlobalMemberRef 为身份锚被受理，形成显式、稳定、可追溯的决定；不支持或不可证输入 fail closed。 |
| 核心能力闭环验收 | `AC-MS-002` 装配与就绪闭环 | 正式装配条件、唯一宿主实例、分项装配结果和整体 readiness 可分别判定；必要 pinned 资产、凭据、承载或 binding 缺失时不得 ready。 |
| 核心能力闭环验收 | `AC-MS-003` 注册与会话闭环 | 可信注册、当前 endpoint、活动注册和 host session 关联唯一可判定、可失效、可追溯，且不取得 Member 主体或 Runtime run truth。 |
| 核心能力闭环验收 | `AC-MS-004` 健康与处置闭环 | 宿主健康能区分 host、session、backend 和 unknown，恢复 / 重启 / 停止 / 终止 / hold 由显式决定触发，新实例不改写旧实例。 |
| 核心能力闭环验收 | `AC-MS-005` 清理、对账与事实交接闭环 | 本地关联收束、cleanup / release、残留 / 孤儿处置和 body-free handoff 分层可判定；外部完成状态不反写本地 truth。 |

### 5.2 功能能力验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 功能能力验收 | `AC-MS-006` 宿主意图受理与范围判定 | 正式来源、项目执行主语、身份锚和调用语境均可判定；无效、非项目、越权或陈旧输入只产生拒绝 / 等待，不隐式创建宿主。 |
| 功能能力验收 | `AC-MS-007` 宿主编排决定与重复冲突控制 | 首次、重复、并发和补偿性意图均形成稳定决定、冲突、unknown 或 no-action，未裁定冲突不产生第二套生效决定。 |
| 功能能力验收 | `AC-MS-008` 正式宿主装配条件形成 | 装配条件的 owner、ref、scope、新鲜度和缺口均可判定，Role -> image 不由本仓解析，policy / credential owner pending 不被本地补造。 |
| 功能能力验收 | `AC-MS-009` 宿主承载与隔离装配协调 | 承载、正式镜像、挂载、凭据和适用 binding 分项结果均与唯一宿主实例关联；失败、partial 和 unknown 不被压平。 |
| 功能能力验收 | `AC-MS-010` 装配就绪与安全降级判定 | 所有必要前置共同成立时才可 ready；任一缺失、陈旧、冲突、partial、pending 或 unknown 均保持非 ready。 |
| 功能能力验收 | `AC-MS-011` 可信注册与宿主实例关联 | 注册来源与当前实例、项目主语、身份锚和正式凭据语境一致；冒用、重放、跨实例、迟到或冲突注册不能覆盖当前关联。 |
| 功能能力验收 | `AC-MS-012` 宿主接入与会话可用性维护 | endpoint、活动注册和 host session 的当前 / 历史关系可查询、可失效；陈旧实例不可继续作为当前接入，且不创建 Runtime run。 |
| 功能能力验收 | `AC-MS-013` 宿主健康与失败分层判定 | 允许信号保留来源、适用时点与新鲜度；心跳缺失或进程存活不直接推导 crashed、业务成功、Runtime 进度或隔离有效。 |
| 功能能力验收 | `AC-MS-014` 宿主恢复、重启与终止控制 | 正式意图、已提交宿主事实、失败分类和外部前置共同支撑处置决定；副作用 unknown 时保持 hold / blocked，不盲重试。 |
| 功能能力验收 | `AC-MS-015` 宿主下线清理与关联失效 | 宿主终结 / 替代后本地注册、endpoint、host session 和 binding 关联显式失效；cleanup 本地决定、attempt、gap 和 residual 可区分。 |
| 功能能力验收 | `AC-MS-016` 残留与孤儿宿主对账处置 | 控制面与承载 / binding 反馈差异能够形成残留、孤儿、漂移或 unknown 分类及 repair / hold / escalate 结论，不删除历史。 |
| 功能能力验收 | `AC-MS-017` 宿主事实安全表达与交接分层 | 已提交宿主事实能够形成 body-free 安全材料；local truth、handoff attempt、gap、delivered、observed 和 accepted 分层可判定。 |
| 功能能力验收 | `AC-MS-018` 容量与放置建议 | 建议仅由允许的安全摘要派生且不改变宿主 / 基础设施 truth；能力缺失不影响核心闭环。 |
| 功能能力验收 | `AC-MS-019` 正式宿主资产预热 | 预热本地尝试与结果不改变 pinned 引用、分项装配结果或 readiness；预热失败不阻塞未依赖预热的核心路径。 |
| 功能能力验收 | `AC-MS-020` forensic 安全关联材料 | 材料保持 body-free、最小且可回链宿主事实，不保存或宣称 evidence、report、verdict、signoff 正文或完整性。 |
| 功能能力验收 | `AC-MS-021` 聚合宿主安全视图 | 视图只读、可失效、可重建且不成为写源；授权消费方或视图不可用不反向改变核心 truth。 |

### 5.3 规则 / 边界验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 规则 / 边界验收 | `AC-MS-022` 项目执行主语与编排决定边界 | BR-MS-001~007 全部成立：L1 truth 不转移、零隐式宿主、非项目 fail closed、决定显式稳定且可追溯。 |
| 规则 / 边界验收 | `AC-MS-023` 装配 owner 与安全就绪边界 | BR-MS-008~017 全部成立：只消费正式 pinned 供给和凭据结果，required binding 无 fallback，partial 不等于 ready。 |
| 规则 / 边界验收 | `AC-MS-024` Member / host session / Runtime 边界 | BR-MS-018~026 全部成立：Member 输入与本仓接受 / registry / session owner 分开，Runtime run / checkpoint 不入仓。 |
| 规则 / 边界验收 | `AC-MS-025` 健康、恢复与实例世代边界 | BR-MS-027~036 全部成立：四层失败、显式处置、unknown fence 与历史不可抹写均可判断。 |
| 规则 / 边界验收 | `AC-MS-026` 清理、外部完成与交接边界 | BR-MS-037~045 全部成立：本地 attempt / gap、外部 cleanup / delivery / observed / accepted 不混写，迟到反馈不逆写。 |
| 规则 / 边界验收 | `AC-MS-027` 正向 seam、owner 与外围总边界 | BR-MS-046~050 全部成立：pending fail closed，依赖类型不转换，边界外 truth 不并入，外围不成写源。 |

### 5.4 数据归属验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 数据归属验收 | `AC-MS-028` 意图与决定数据归属 | D-MS-001~007 中本仓只拥有受理 / 决定 / 冲突本地 truth，ProjectMember / GlobalMember / authorization 只以 ref / snapshot 表达，L1 正文不入仓。 |
| 数据归属验收 | `AC-MS-029` 装配与就绪数据归属 | D-MS-008~017 中宿主实例、分项结果与 readiness 归本仓；镜像、凭据、承载和 binding 只作 ref / snapshot，其正文禁止保存。 |
| 数据归属验收 | `AC-MS-030` 注册与会话数据归属 | D-MS-018~024 中注册接受、endpoint 和 host session 归本仓；Member 输入只作摘要，Runtime 对象只作 ref，双方原始正文禁止保存。 |
| 数据归属验收 | `AC-MS-031` 健康与处置数据归属 | D-MS-025~030 中宿主健康、失败分类和处置决定归本仓；外部信号与结果只作 snapshot / ref，运行、后端和隔离正文禁止保存。 |
| 数据归属验收 | `AC-MS-032` 清理、对账与交接数据归属 | D-MS-031~037 中本地收束、attempt / gap、对账和 safe material 归本仓；外部完成只作 snapshot / ref，report / receipt / evidence 正文禁止保存。 |
| 数据归属验收 | `AC-MS-033` 外围数据与跨节点复用 | D-MS-E01~E04 不成为核心写源；D-MS-009 / 019 / 020 / 025 跨节点只复用同一 truth，不建立第二实例、registry、session 或健康真相。 |

### 5.5 非功能验收

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 非功能验收 | `AC-MS-034` 性能边界 | 在具有 authority 的固定 workload / 环境 / 依赖 profile 下能够分解本地与外部等待；外围任务不无界挤占核心，且未使用无来源数字宣告达标。 |
| 非功能验收 | `AC-MS-035` 可用性与恢复完整性 | 依赖失效、中断、迟到和 unknown 场景均有明确非成功语义，既有宿主历史和安全查询保持；下游 / 外围失败不回滚核心 truth。 |
| 非功能验收 | `AC-MS-036` 安全与 no-bypass | 项目型 scope、授权、forbidden-body、secret、pinned / credential / binding 正向资格全部满足；任一缺失不得默认放行或以 fake 代替。 |
| 非功能验收 | `AC-MS-037` 全生命周期追溯与证据诚实 | 意图至清理 / handoff 均可安全回链；planned、blocked、not_run、fake-qualified 与真实 readiness / evidence 状态可区分。 |
| 非功能验收 | `AC-MS-038` 幂等与一致性 | duplicate、concurrent、replay、late、out-of-order 和 unknown 不产生 truth 分叉、竞争宿主、第二活动关联或不可逆动作盲重放。 |
| 非功能验收 | `AC-MS-039` 可观测性与结果分层 | 关键状态、失败层级、dependency gap 和 handoff 状态有最小安全材料；Observability 不可用不破坏本地可判断性，observed 不被伪造。 |

## 6. 一票否决项

| ID | 一票否决条件 | 来源 |
|---|---|---|
| `VF-MS-001` | C-MS-1~5 任一核心节点没有成立且仍宣告当前核心闭环或正式实现 ready。 | C-MS-1~5；AC-MS-001~005 |
| `VF-MS-002` | 非项目型、无正式主语、越权或仅因查询 / 信号出现而创建、启动、停止、重启或迁移宿主。 | BR-MS-001~006；NFR-MS-007 |
| `VF-MS-003` | 本仓创建、修改或反推 Identity、Work、Member、Runtime、Images、Tools、Sandbox、Governance、Observability 或基础设施 owner truth。 | BR-MS-002 / 009 / 013 / 022 / 024 / 029 / 042 / 047 / 049 |
| `VF-MS-004` | required pinned 资产、凭据、binding、授权或其他正向 seam 缺失 / unknown 时仍 default allow、host fallback 或声明 ready。 | BR-MS-010~016 / 046；NFR-MS-005 / 009 |
| `VF-MS-005` | secret、credential、L1 / Runtime / Tool / Sandbox / backend / evidence / report 等 forbidden body 进入本仓 truth、输出或证据材料。 | D-MS-007 / 016~017 / 023~024 / 030 / 037；NFR-MS-008 |
| `VF-MS-006` | 重复、并发、迟到、重放或 unknown 形成竞争当前宿主、第二活动注册 / host session、盲重放不可逆动作或历史抹写。 | BR-MS-005 / 019~021 / 025 / 030 / 033~034 / 044；NFR-MS-013~016 |
| `VF-MS-007` | partial、attempt、receipt、timeout、snapshot 或 local association 被写成整体 ready、external cleanup completed、delivered、observed 或 accepted。 | BR-MS-015~016 / 038~044；NFR-MS-011 / 015 / 019 |
| `VF-MS-008` | 非 Core / SDK sibling 以源码依赖接入，或 runtime / event / ref / adapter 被伪装成 compile seam。 | BR-MS-048；Step 06 / Step 12 |
| `VF-MS-009` | pending、planned、waiting、blocked、not_run、placeholder 或 fake-qualified 被伪装成真实集成、artifact、report、evidence、verdict、signoff、readiness 或验收通过。 | BR-MS-046 / 048；NFR-MS-020 |

否决项边界：外围建议质量、报表样式、未量化性能候选或可后续修复的一般缺陷不得单独触发整体否决；只有上表所列核心闭环缺失或硬边界破坏才适用。

## 7. 全量映射与覆盖审计

### 7.1 需求结构映射

| 来源范围 | 验收承接 | 覆盖结论 |
|---|---|---|
| C-MS-1~5 | AC-MS-001~005 | 五节点各一项闭环验收，无遗漏 |
| FR-MS-001~012 | AC-MS-006~017 | 每项核心功能独立承接 |
| FR-MS-E01~E04 | AC-MS-018~021 | 每项外围功能独立承接且不阻塞核心 |
| BR-MS-001~050 | AC-MS-022~027；VF-MS-002~009 | 按五节点和跨节点完整分组 |
| D-MS-001~037 / E01~E04 | AC-MS-028~033；VF-MS-005 | 四类数据、外围与复用均承接 |
| NFR-MS-001~020 | AC-MS-034~039；VF-MS-002~009 | 六类 NFR 和 evidence honesty 均承接 |

### 7.2 Pending 对正向验收的影响

| Pending | 可当前定义 / 未来可负向验收 | 正向验收限制 |
|---|---|---|
| MSVC-UP-001 Runtime surface | host session / Runtime truth 分层、缺口 fail closed | AC-MS-003 / 012 / 014 / 017 的 Runtime 正向联调 blocked |
| MSVC-UP-002 Member 详细合同 | owner 分工、非法 / 迟到 / 重放拒绝语义 | AC-MS-011~013 的字段、IPC、凭据和真实联调 waiting |
| MSVC-UP-003 Member Images handoff | 不直解 Role、不可验证 ref 不 ready | AC-MS-008~010 / 019 的正式资产正向资格 blocked |
| MSVC-UP-004 SandboxBinding / release | required binding no-fallback、attempt / completion 分层 | AC-MS-009~010 / 014~016 的正向 bind / release / cleanup blocked |
| MSVC-UP-005 policy 传递 owner | 无当前验收项，不预建通过口径 | owner 与 FR 未闭口，不得补 policy 正向验收 |
| MSVC-UP-006 launch credential owner | 不保存、不复用、实例绑定和不可证拒绝 | AC-MS-008~011 的真实签发 / 撤销 / qualification blocked |
| MSVC-UP-007 Core schema / event family | 能力 / owner / body-free 语义 | shared schema、route、receipt 正向互操作 blocked |
| MSVC-UP-008 SDK target / Server 自测试 | compile / runtime 分类与非伪造证据 | 准确 target 和真实自测试通过不可声明 |

本 Step 的 `gate_status = pass` 只表示验收合同完整，不表示上述正向验收已经执行或通过。

### 7.3 跨能力审计

| 审计项 | 结论 |
|---|---|
| 核心功能遗漏 | 0；FR-MS-001~012 各有独立 AC |
| 外围功能遗漏 | 0；E01~E04 各有独立 AC，且无一成为核心前置 |
| 硬规则遗漏 | 0；50 条规则按节点 / 跨节点分组并由否决项覆盖硬破坏 |
| 数据归属遗漏 | 0；41 项数据、四类归属及跨节点复用完整承接 |
| NFR 遗漏 | 0；20 项 NFR 由六类 AC 与否决项承接 |
| 无来源验收 | 0；AC-MS-001~039 与 VF-MS-001~009 均可回指正式来源 |
| 重复验收 | 无语义重复；同一硬边界同时作为普通 AC 与 veto，是“通过条件 / 整体否决”两种用途 |
| 否决项过宽 | 无；外围缺口、未量化候选和一般缺陷明确排除 |

## 8. 旧材料后置污染审计

| 历史内容 | 问题 | 当前处理 |
|---|---|---|
| 旧 06 的“功能测试全部通过”“性能达到 P95 / 容量目标” | 把未来结果和无来源数字写成当前事实 | 不继承；只形成 AC-MS-006~021 / 034 的未来条件 |
| C1~C9、API / WebSocket / event topic 逐项测试 | 基于旧模块和协议方案，不能回指当前五节点 | 全部删除，按 C-MS-1~5 和五类验收重建 |
| Docker / Kubernetes、数据库、缓存、队列与 CI 命令 | 测试工具和实现选型泄漏 | 不进入需求验收合同 |
| 心跳 30 秒乘 3、P95 5 秒、500 容器、99.9% SLA | 无当前 authority | 不进入验收条件，保留未来量化门禁 |
| checkpoint 恢复成功 | 把 Runtime 内容恢复并入宿主恢复 | 排除；AC-MS-014 只验宿主处置和结果分层 |
| evidence、report、verdict、signoff 或 readiness 模板值 | 容易伪造已执行事实 | 当前不创建或声称；由 VF-MS-009 硬性禁止 |

## 9. 回填草稿与门禁

### 9.1 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_14_acceptance_criteria.md`

正式装配时采用 §5 的五类三列表和 §6 一票否决表，并保留“这是未来验收合同、不是当前验收结果”及影响正向验收的 blocker 摘要。节点停审、全量审计、历史污染和测试后续提示留在校准材料。

### 9.2 门禁自检

- [x] AC-MS-001~039 覆盖五类验收，每项均有可判断条件
- [x] 五个能力节点、16 项功能、50 条规则、41 项数据、20 项 NFR 均有承接
- [x] VF-MS-001~009 只覆盖核心闭环或硬边界破坏，并有明确来源
- [x] pending seam 只定义负向 / 分层验收，未伪造正向结果
- [x] 未记录测试步骤、脚本、工具、CI、接口调用、run、artifact、report、evidence、verdict 或 signoff
- [x] 本 Step pass 不等于系统已验收或 ready

结论：`gate_status = pass`，`current_state = stop_review`。用户已授权完成整份 00，下一动作是先更新 flow / ledger，再读取 Step 15 SOP、书写规范 4.15 和全部未闭口项。
