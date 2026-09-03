# Step 10. 业务规则与边界约束

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_rule_audit` | pass | BR-MI-001~025 已按 C-MI-1~5 逐节点停审,3 条外围规则单列;类型、来源、功能挂载、历史污染与 pending 边界审计均通过 | 进入 Step 11 数据需求与数据归属 | `00_req_step_02_position_boundary.md`;`00_req_step_09_functional_requirements.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 10 和书写规范 §4.10。
- [x] 固定规则类型为不变量 / 禁止行为 / 显式变化 / 边界约束,按需使用治理 / 审计约束。
- [x] 按 C-MI-1 -> C-MI-5 逐节点回答必须成立、必须禁止、必须显式和不可打穿事项。
- [x] 为每条规则标出约束对象、来源目标和受保护功能。
- [x] 单列外围增强规则,不把 future 功能写成当前核心前置。
- [x] 后置审计旧 BR-001~007 与 draft 失败语义,拒绝数字 / 产品 / schema 污染。
- [x] 完成重复、冲突、孤儿、串仓和实现泄漏审计。
- [x] 形成正式 00 §10 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | 本仓拥有 / 消费 / 禁止拥有的 truth 边界 |
| Step 4 | G-MI-001~007、NG-MI-001~015 和 current / conditional / future 分层 |
| Step 7 | C-MI-1~5 核心能力及各节点 owner 边界 |
| Step 9 | F-MI-001~015、F-MI-E01~E05 及输入 / 输出 / 失败上限 |
| ADR-0005 | nightly、一 Role 一镜像、mapping owner、全部版本 pinned、生产禁 `latest` |
| pending register | MI-UP-001~009、Q-MI-001~004 不得被规则文本强行闭口 |

## 3. SOP 问题回答

1. 当前讨论哪个核心能力节点?

   回答:按 C-MI-1 到 C-MI-5 串行讨论。每个节点只写保护该节点功能成立的硬规则,完成挂载和实现泄漏检查后立即记录能力级停审。

2. 哪些不变量必须始终成立?

   回答:定义必须有唯一可验证来源;装配输入必须完整且 pinned;构建 attempt 必须绑定意图与输入快照;候选 digest 必须绑定 provenance;可供给入口必须 eligible、pinned、可验证且与 availability 一致。

3. 哪些行为必须禁止?

   回答:禁止本地 hardcode / fallback Role mapping,禁止把 live state / secret 装入镜像,禁止在失败 / unknown 时伪造候选,禁止绕过正式适用门禁,禁止本地复制 Artifact truth,禁止生产使用 `latest`,禁止把本地供给事实写成容器启动或下游确认。

4. 哪些变化必须显式发生?

   回答:mapping source 变化、variant revision / derivation、构建结果、eligibility / Artifact handoff 分层、availability 的 publish / replace / rollback / retire 与 handoff gap 均必须显式,不得原地覆盖或由相邻动作隐式推导。

5. 哪些边界不能被打穿?

   回答:method mapping、component release、seed 正文、builder / registry、evidence body、Artifact 通用生命周期、member-service 容器生命周期、governance approval 和 observed truth 都保持外部 owner;本仓只保存自身 truth、必要 ref / snapshot / derived conclusion。

6. 哪些操作需要治理、审计或引用条件?

   回答:非 nightly 构建来源必须有当前 authority;适用 evidence 集合来自正式 policy / authority;高风险供给变化只承接外部治理结论而不拥有 approval;定义、revision、attempt、provenance、eligibility 与 availability 关键变化必须可追溯。

7. 是否存在无法挂载的规则?

   回答:不存在。BR-MI-001~025 均回指 C-MI-1~5 与 F-MI-001~015;三条外围规则回指 F-MI-E01~E05。旧固定 Critical 阈值、IPC schema、归档 1 年和具体 evidence kind 因无当前来源,不进入正式规则。

## 4. 当前文档问题诊断

| historical / 候选规则 | 问题 | 当前处理 |
|---|---|---|
| 镜像名固定为 `ai-member-<role>:<semver>` | 把命名格式、semver 和 Role 枚举锁进需求规则 | 只保留一 Role 一镜像、受控 mapping 与 pinned / immutable 语义;命名后移设计 |
| Critical 漏洞一律阻断 | threshold、scanner 与 policy authority 未闭合 | 改为“所有正式适用 evidence gate 失败均阻断”;具体 kind / threshold pending |
| 签名或 BOM 缺失即发布失败 | 把候选 evidence kind 当已适用 | 同上;不预判 BOM / signature 当前适用性 |
| IPC schema 不兼容拒绝发布 | compatibility 定义和 owner pending | 不建立独立规则;若被正式纳入适用门禁,受通用 gate 规则保护 |
| retired Role 镜像归档至少 1 年 | 无 retention authority | 只保留退役必须显式且历史不可被无声覆盖;期限后移 04 / policy |
| tag 变化自动触发构建 | tag 不等于获准来源,也可能是 mutable input | 改为获准且可验证输入变化;nightly 单独继承 ADR |
| 构建 / 发布后通知 member-service | 无 outbound event authority | 只规定 pinned entry 与 handoff gap 分层,禁止伪报通知 / 实例化 |

## 5. 改动前后对比

| 维度 | 旧规则倾向 | 当前规则结构 |
|---|---|---|
| 来源 | README / 工具惯例 | Step 2 / 4 / 7 / 9、ADR 与已核验 owner |
| 类型 | 条件 -> 结果混排 | 六类正式规则类型,核心四类优先 |
| 对象 | 镜像名、CI gate、工具输出 | 定义来源、装配基线、attempt、provenance、eligibility、availability |
| 安全 | 固定 scanner / threshold / signer | authority 决定适用 gate,适用后不可绕过 |
| 生命周期 | built -> scanned -> signed -> published 固定流程 | 只规定关键变化必须显式,不预设状态机实现 |
| 下游 | 发布即通知 / 可启动 | local supply、handoff 与 consumer observed truth 分层 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每项功能写一条综合规则 | 数量少 | 不变量、禁令和边界难以独立审计 | 不采用 |
| 把所有失败语义写成状态枚举 | 看似精确 | 过早进入对象 / schema 设计 | 不采用 |
| 按能力节点使用正式规则类型并逐条挂载 | 来源与保护对象清晰 | 规则数量较多 | 采用 |
| 将 pending seam 从规则中删除 | 避免条件文本 | 失去 fail-closed 边界保护 | 不采用;写保守规则但不闭合正向合同 |

## 7. 结构化中间产物

### 7.1 编号与规则类型口径

| 口径 | 定义 |
|---|---|
| `BR-MI-001~025` | 当前核心闭环规则,按 C-MI-1 -> C-MI-5 排列 |
| `BR-MI-E01~E03` | 外围增强启用时适用的边界规则,不进入核心规则分母 |
| 不变量 | 在对象整个有效语境内必须成立 |
| 禁止行为 | 无论 adapter / 配置如何均不得发生 |
| 显式变化 | 变化必须有正式业务语义和可追溯依据,不得隐式推导 |
| 边界约束 | 相邻 owner truth 不得被本仓复制、改写或宣称 |
| 治理 / 审计约束 | 只承接正式治理前置或追溯要求,不建立 approval / backend truth |

### 7.2 C-MI-1 受控定义规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-001` | 不变量 | 每个有效 image family / variant / persona 装配身份必须回指唯一、可验证的正式 mapping 来源;Role 集合不得由本仓枚举补齐。 | 镜像域定义及来源关联 | ADR-0005;G-MI-002 | F-MI-001、003 |
| `BR-MI-002` | 禁止行为 | 不得在 mapping 缺失、陈旧、冲突或不可验证时使用 hardcode、缓存默认值、`latest` 或其他本地 fallback 继续装配。 | mapping 消费与异常处置 | G-MI-002、007;NG-MI-001 | F-MI-002 |
| `BR-MI-003` | 显式变化 | mapping 来源或其有效性变化必须形成新的来源关联与重新判定,不得原地改写既有来源记录或隐式改变 variant 含义。 | 定义来源变化 | G-MI-002;US-MI-003 | F-MI-001~003 |
| `BR-MI-004` | 边界约束 | RoleDefinition 正文和 Role -> variant 映射定义 truth 始终归方法资产 owner;本仓不得编辑、复制或建立第二映射路径。 | member-images / method-library 边界 | NG-MI-001;MI-UP-003 | F-MI-001~003 |
| `BR-MI-005` | 审计约束 | 镜像定义来源解释必须保持 body-free,且能够区分来源一致、异常与合同 gap;不得以缺少 exact consumer surface 为由伪报一致。 | 定义来源审计 | G-MI-007;MI-UP-003 | F-MI-002、003 |

节点停审:C-MI-1 的唯一来源、不 fallback、显式修订、mapping owner 和 body-free 审计均已覆盖;规则未写查询 API、snapshot 字段或缓存算法。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-006` | 不变量 | 每个可构建 variant revision 的 member、runtime、tools、角色 extras、base 与 seed template 输入必须完整、来源可验证且固定版本;生产装配不得依赖 `latest` 或其他 mutable ref。 | 静态装配基线 | ADR-0005;G-MI-003 | F-MI-004 |
| `BR-MI-007` | 禁止行为 | 凭据、live memory、checkpoint、workspace live content、运行时 observed state 及其他 live body 不得作为 seed、模板或构建输入进入镜像。 | 静态 / live state 边界 | G-MI-003;NG-MI-003/005/010 | F-MI-005 |
| `BR-MI-008` | 不变量 | 装配完整性不得由猜测版本、复制外部正文或把未知来源标记为可用来补齐;任一必要输入不成立时受影响基线必须 fail closed。 | 装配完整性判定 | G-MI-003、007 | F-MI-004、005 |
| `BR-MI-009` | 显式变化 | base -> variant 派生、装配差异和 revision 变化必须创建可区分的新修订依据;既有基线和派生历史不得被原地覆盖。 | 派生与 revision 历史 | G-MI-003;US-MI-006 | F-MI-006 |
| `BR-MI-010` | 边界约束 | component release、tool contract、seed 语义正文、Artifact version / lineage / baseline 均保持外部 owner;本仓只拥有 pin、placement、派生与镜像域绑定事实。 | 装配输入 owner 边界 | NG-MI-002/004/008/009;MI-UP-002/006/007 | F-MI-004~006 |

节点停审:C-MI-2 的完整 pin、live-state 红线、fail-closed、不可原地改写和输入 owner 边界均已覆盖;未定义文件布局、包格式、secret 检测算法或 revision 字段。`gate_status = pass`。

### 7.4 C-MI-3 构建候选规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-011` | 治理约束 | nightly 构建意图必须按 ADR-0005 保留;除此之外的变化 / 事件来源只有在具有当前 authority 且可验证时才能形成有效构建意图。 | 构建意图来源 | ADR-0005;G-MI-004;MI-UP-005 | F-MI-007 |
| `BR-MI-012` | 不变量 | 每个有效 build attempt 必须唯一关联一个 build intent、一个确定的 variant revision 和一份完整且不可漂移的输入快照。 | 构建 attempt 与输入快照 | G-MI-004;US-MI-007 | F-MI-008 |
| `BR-MI-013` | 禁止行为 | 意图被拒绝 / 挂起、输入不完整、builder 未确认、构建失败或结果 unknown 时,不得生成或宣称候选 digest / ref。 | 候选输出成立条件 | G-MI-004、007;US-MI-009 | F-MI-007~009 |
| `BR-MI-014` | 显式变化 | candidate、failed、blocked、unknown 与后续重新尝试必须保持可区分且可追溯;新结果不得覆盖原 attempt 的既有事实。 | 构建结果与恢复历史 | G-MI-004;US-MI-009 | F-MI-008、009 |
| `BR-MI-015` | 边界约束 | scheduler、builder、registry 与 Bus carrier truth 不属于本仓;执行交接、请求成功或事件到达均不得被解释为构建成功,未知 event schema 必须 fail closed。 | 构建 adapter / event 边界 | NG-MI-012/015;MI-UP-005 | F-MI-007~009 |

节点停审:C-MI-3 的受控来源、attempt / snapshot 唯一绑定、无输出伪造、结果历史和 adapter / event owner 边界均已覆盖;未写调度配置、重试次数、超时值、事件字段或 registry API。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-016` | 不变量 | 每个进入资格判断的候选 digest 必须与其 build intent、input snapshot、variant revision 和全部受控来源形成完整且一致的 provenance 绑定。 | 候选 digest / provenance | G-MI-005;US-MI-010 | F-MI-010 |
| `BR-MI-017` | 治理约束 | 资格判断使用的适用 evidence gate 集合只能来自正式 authority / effective policy;本仓配置、adapter 能力或历史工具清单不得自行增加、取消或标记通过。 | 适用 evidence 集合 | G-MI-005、007;NG-MI-009;Q-MI-004 | F-MI-011 |
| `BR-MI-018` | 禁止行为 | provenance 不完整或任一正式适用 evidence 缺失、失败、陈旧、冲突、不可验证时,候选不得获得 positive eligibility,也不得通过降级配置绕过。 | eligibility 判定 | G-MI-005;US-MI-011 | F-MI-010~012 |
| `BR-MI-019` | 显式变化 | 镜像域 eligibility 与 Artifact handoff / formal consumer ref 状态必须分别形成、分别解释;任一方成立不得隐式推导另一方成立。 | eligibility / Artifact handoff 分层 | G-MI-005、007;US-MI-012 | F-MI-012 |
| `BR-MI-020` | 边界约束 | evidence body、scanner / signer / key truth、Artifact 正文、`ArtifactVersion`、lineage 与 baseline 不属于本仓;本仓不得复制这些 truth 或自造 formal Artifact ref。 | evidence / Artifact owner 边界 | NG-MI-008/009/012;MI-UP-007;Q-MI-004 | F-MI-010~012 |

节点停审:C-MI-4 的 provenance 完整性、适用 gate authority、fail-closed eligibility、双状态显式分层和外部 truth 边界均已覆盖;未锁定 BOM / scan / signature、阈值、工具或 Artifact schema。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-021` | 不变量 | 只有 eligibility 满足当前供给条件且 digest / ref 可验证的 pinned 镜像版本才能进入可用供给;生产入口不得使用 `latest` 或其他 mutable selector。 | availability 与可供给版本 | ADR-0005;G-MI-006 | F-MI-013、014 |
| `BR-MI-022` | 显式变化 | publish、replace / supersede、rollback 与 retire 必须作为显式 availability 变化发生并保留历史;回滚不得重写旧版本或伪装为从未发生的发布。 | 供给 availability 生命周期 | G-MI-006;US-MI-014 | F-MI-013 |
| `BR-MI-023` | 边界约束 | 本仓提供的 manifest / variant / ref 入口只表达镜像供给事实;容器创建、启动、停止、健康、升级决定和 observed consumption 始终归 member-service 等下游 owner。 | member-images / member-service 边界 | NG-MI-006/010;MI-UP-001 | F-MI-014、015 |
| `BR-MI-024` | 禁止行为 | 在 exact consumer contract 或出站 event authority 未闭口时,不得把入口可用写成通知成功、下游已确认、已升级或已实例化;不得私造构建 / 发布出站事件。 | 供给交接与事件边界 | G-MI-007;NG-MI-015;MI-UP-001/009 | F-MI-014、015 |
| `BR-MI-025` | 审计约束 | availability 变化、入口解析结果、handoff attempt 与 consumer gap 必须保持可区分且可追溯;外部拒绝、pending 或 unknown 不得反向改写既有镜像域 truth。 | 供给 / handoff 审计 | G-MI-006、007;US-MI-015 | F-MI-013~015 |

节点停审:C-MI-5 的 eligible pinned 入口、显式 availability、容器 owner、无 authority 不伪报交接和 gap 审计均已覆盖;未写 manifest 字段、查询 route、outbound event 或下游状态机。`gate_status = pass`。

### 7.7 外围增强规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 来源 | 保护功能 |
|---|---|---|---|---|---|
| `BR-MI-E01` | 治理约束 | 多架构、特殊收缩 variant、快速安全重建和加固基础镜像只有在各自 authority / scope 正式启用后才能进入供给,且不得绕过 BR-MI-001~025。 | 外围增强启用 | Q-MI-001/002;MI-UP-008 | F-MI-E01~E04 |
| `BR-MI-E02` | 边界约束 | 架构适配、收缩装配和加固基础镜像不得改写 Role、governance、Sandbox 或 component release truth;本仓仍只拥有镜像域派生 / 供给事实。 | 外围 variant owner 边界 | NG-MI-001/007/009 | F-MI-E01、E02、E04 |
| `BR-MI-E03` | 禁止行为 | 供给使用摘要不得成为下游 live / observed truth 的第二写源,也不得反向自动改变 eligibility 或 availability。 | 使用摘要增强 | NG-MI-010;US-MI-E05 | F-MI-E05 |

外围停审:三条条件规则只在增强启用时保护核心门禁和相邻 owner,未把 future 功能变成当前核心前置。`gate_status = pass`。

### 7.8 正式业务规则表

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MI-001` | 不变量 | 每个有效镜像域定义必须回指唯一、可验证的正式 mapping 来源;Role 集合不得由本仓枚举补齐。 | 镜像域定义及来源关联 |
| `BR-MI-002` | 禁止行为 | mapping 异常时不得使用 hardcode、缓存默认值、`latest` 或其他本地 fallback 继续装配。 | mapping 消费与异常处置 |
| `BR-MI-003` | 显式变化 | mapping 来源或有效性变化必须形成新的来源关联与重新判定,不得隐式改写 variant 含义。 | 定义来源变化 |
| `BR-MI-004` | 边界约束 | RoleDefinition 与 Role -> variant mapping truth 归方法资产 owner,本仓不得复制或编辑。 | member-images / method-library 边界 |
| `BR-MI-005` | 审计约束 | 镜像定义来源解释必须 body-free 且能区分一致、异常和合同 gap。 | 定义来源审计 |
| `BR-MI-006` | 不变量 | 可构建 variant revision 的全部静态输入必须完整、来源可验证且 pinned。 | 静态装配基线 |
| `BR-MI-007` | 禁止行为 | secret、live memory、checkpoint、workspace live content 和 observed state 不得进入镜像。 | 静态 / live state 边界 |
| `BR-MI-008` | 不变量 | 装配完整性不得通过猜版本、复制外部正文或把未知来源标为可用来补齐。 | 装配完整性判定 |
| `BR-MI-009` | 显式变化 | 派生、装配差异和 revision 变化必须形成可区分新修订,不得覆盖历史。 | 派生与 revision 历史 |
| `BR-MI-010` | 边界约束 | component、tool contract、seed 正文和 Artifact 通用 truth 保持外部 owner。 | 装配输入 owner 边界 |
| `BR-MI-011` | 治理约束 | nightly 必须保留;其他变化 / 事件只有具有 authority 且可验证时才能形成有效构建意图。 | 构建意图来源 |
| `BR-MI-012` | 不变量 | 每个有效 attempt 必须唯一关联 intent、variant revision 和完整 immutable input snapshot。 | 构建 attempt 与输入快照 |
| `BR-MI-013` | 禁止行为 | 拒绝、挂起、blocked、failed 或 unknown 时不得生成或宣称候选 digest / ref。 | 候选输出成立条件 |
| `BR-MI-014` | 显式变化 | candidate、failed、blocked、unknown 与重新尝试必须可区分,新结果不得覆盖既有 attempt。 | 构建结果与恢复历史 |
| `BR-MI-015` | 边界约束 | scheduler、builder、registry 与 Bus carrier truth 不属于本仓;交接成功不等于构建成功。 | 构建 adapter / event 边界 |
| `BR-MI-016` | 不变量 | 候选 digest 必须与 intent、snapshot、revision 和全部来源形成完整一致的 provenance。 | 候选 digest / provenance |
| `BR-MI-017` | 治理约束 | 适用 evidence gate 集合只能来自正式 authority / effective policy。 | 适用 evidence 集合 |
| `BR-MI-018` | 禁止行为 | provenance 不完整或任一适用 evidence 异常时不得获得 positive eligibility 或降级绕过。 | eligibility 判定 |
| `BR-MI-019` | 显式变化 | 镜像 eligibility 与 Artifact handoff / formal ref 状态必须分别形成、分别解释。 | eligibility / Artifact handoff 分层 |
| `BR-MI-020` | 边界约束 | evidence body、供应链工具 / key truth 与 Artifact 通用 truth 不属于本仓。 | evidence / Artifact owner 边界 |
| `BR-MI-021` | 不变量 | 只有满足供给条件且 digest / ref 可验证的 pinned 版本才能进入供给;生产禁用 mutable selector。 | availability 与可供给版本 |
| `BR-MI-022` | 显式变化 | publish、replace、rollback 与 retire 必须显式发生并保留历史。 | 供给 availability 生命周期 |
| `BR-MI-023` | 边界约束 | 镜像入口不表达容器创建、启动、健康、升级决定或 observed consumption。 | member-images / member-service 边界 |
| `BR-MI-024` | 禁止行为 | 合同 / authority 未闭口时不得伪报通知、确认、升级或实例化,也不得私造出站事件。 | 供给交接与事件边界 |
| `BR-MI-025` | 审计约束 | availability、entry、handoff attempt 与 consumer gap 必须可区分且可追溯。 | 供给 / handoff 审计 |
| `BR-MI-E01` | 治理约束 | 外围增强正式启用后仍不得绕过核心规则。 | 外围增强启用 |
| `BR-MI-E02` | 边界约束 | 外围 variant 不得改写 Role、governance、Sandbox 或 component truth。 | 外围 variant owner 边界 |
| `BR-MI-E03` | 禁止行为 | 使用摘要不得成为 observed truth 第二写源或自动改变资格 / 可用性。 | 使用摘要增强 |

### 7.9 规则挂载与跨节点审计

| 能力节点 | 核心功能 | 保护规则 | 类型覆盖 | 结果 |
|---|---|---|---|---|
| C-MI-1 | F-MI-001~003 | BR-MI-001~005 | 不变量 / 禁止 / 显式 / 边界 / 审计 | 全覆盖 |
| C-MI-2 | F-MI-004~006 | BR-MI-006~010 | 不变量 / 禁止 / 显式 / 边界 | 全覆盖 |
| C-MI-3 | F-MI-007~009 | BR-MI-011~015 | 治理 / 不变量 / 禁止 / 显式 / 边界 | 全覆盖 |
| C-MI-4 | F-MI-010~012 | BR-MI-016~020 | 不变量 / 治理 / 禁止 / 显式 / 边界 | 全覆盖 |
| C-MI-5 | F-MI-013~015 | BR-MI-021~025 | 不变量 / 显式 / 边界 / 禁止 / 审计 | 全覆盖 |
| 外围 | F-MI-E01~E05 | BR-MI-E01~E03 | 治理 / 边界 / 禁止 | 条件覆盖 |

| 跨节点检查 | 结果 |
|---|---|
| 是否存在无法回指能力 / 功能 / 边界目标的孤儿规则 | 否 |
| 是否存在同义重复规则 | 否;各节点只保护本节点 truth,跨节点通过逻辑前置衔接 |
| 是否存在规则冲突 | 否;fail-closed、immutable history 和 owner 唯一口径一致 |
| 是否覆盖核心四类规则 | 是;全仓合计均有不变量、禁止行为、显式变化和边界约束 |
| 是否把 pending 正向合同强制闭口 | 否;规则只保护 conservative lane |
| 是否出现数据库、事务、API、event schema、错误码或实现校验 | 否 |
| 是否使用旧固定 Role 数、工具、阈值、SLA 或 retention 数字 | 否 |

### 7.10 历史规则差异审计

| 旧规则 | 判定 | 当前落点 |
|---|---|---|
| 一 Role 一镜像 + 固定命名 | 原则保留,命名 / 枚举废弃 | BR-MI-001、004 |
| 生产禁止 `latest` | 保留 ADR 裁决并推广为 mutable ref 红线 | BR-MI-002、006、021 |
| Critical 漏洞阻断 | 固定阈值废弃;正式适用门禁 fail-closed 保留 | BR-MI-017~018;Q-MI-004 |
| mapping 变化必须生成新 variant | 改为来源重新判定与显式 revision,不预设命令 / event | BR-MI-003、009、011 |
| IPC schema 不兼容拒绝发布 | 无 owner,不进入当前正式规则 | MI-UP-002;未来若适用由 BR-MI-017~018 保护 |
| 签名 / BOM 缺失视为未发布 | 具体 kind 未确权,不继承 | BR-MI-017~018;Q-MI-004 |
| retired 镜像归档至少 1 年 | 数字废弃,显式 retire / history 保留 | BR-MI-022、025 |

## 8. 回填草稿

正式 00 §10 使用 §7.8 四列表,按 C-MI-1~5 分组列出 BR-MI-001~025,再单列三条外围规则。正式正文需保留规则与能力 / 功能的简表映射,但不回填逐节点停审、历史差异、来源推演或实现反例。

规则正文必须附带两项总说明:

1. 规则约束的是需求层 truth 和边界,不规定状态机、字段、事务、API、CI 或 adapter 实现。
2. pending seam 只适用保守规则;规则存在不表示 mapping、component、event、Artifact、member-service 或 evidence adapter 已 ready。

## 9. 待确认事项

| ID | 受影响规则 | 当前规则上限 |
|---|---|---|
| `MI-UP-001` | BR-MI-023~025 | 保护 owner / gap;不定义 exact consumer success 条件 |
| `MI-UP-002` | BR-MI-006/010/017~018 | component / compatibility owner 未闭口,只允许缺失时 blocked |
| `MI-UP-003` | BR-MI-001~005 | mapping owner 已定;exact consumer surface 仍 pending |
| `MI-UP-004` | 所有跨仓边界规则 | 不定义 Core image schema 或 error code |
| `MI-UP-005` | BR-MI-011/015 | event lane 无 schema 时 unavailable;nightly 保留 |
| `MI-UP-006` | BR-MI-006~010 | seed 来源未闭口,只固定 ref / placement 和 no-live-state 红线 |
| `MI-UP-007` | BR-MI-010/019~020/021 | Artifact owner 已定,image handoff exact 条件 pending |
| `MI-UP-008` | BR-MI-E01~E02 | future only |
| `MI-UP-009` | BR-MI-024 | 禁止私造出站事件 |
| `Q-MI-001~002` | BR-MI-E01~E02 | 外围启用条件 pending |
| `Q-MI-003` | BR-MI-015/017/020/021 | 产品配置不得改变 domain rule |
| `Q-MI-004` | BR-MI-017~020 | evidence kind / threshold / priority pending;通用 fail-closed 规则 current |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每条规则是否有编号、正式类型、内容和约束对象 | pass |
| 每条核心规则是否能回指能力节点、功能或边界目标 | pass |
| C-MI-1~5 是否逐节点完成规则停审 | pass |
| 核心四类规则和按需治理 / 审计规则是否完整 | pass |
| 是否存在重复、冲突、孤儿或挂载错误 | no |
| 是否越过需求层进入实现校验、接口协议或对象字段 | no |
| historical 污染与 pending readiness 是否受控 | pass |

`gate_status = pass`;允许创建 Step 11,不得跳到 Step 12 或修改正式 00。
