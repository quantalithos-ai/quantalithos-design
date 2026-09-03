# Step 9. 功能需求

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_function_audit` | pass | F-MI-001~015 已按 C-MI-1~5 逐节点停审,5 项外围功能单列;故事、优先级、依赖、历史污染和 pending 边界审计均通过 | 进入 Step 10 业务规则与边界约束 | `00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 9 和书写规范 §4.9。
- [x] 固定 C-MI-1 -> C-MI-5 串行顺序,不先生成全仓功能大表。
- [x] 按能力节点回答输入、输出、触发、失败、故事承接和功能依赖问题。
- [x] 逐节点形成核心功能需求并执行能力级停审。
- [x] 单列外围增强功能,不进入核心完成分母。
- [x] 后置读取旧正式 00 和 draft 功能清单,完成历史污染差异审计。
- [x] 完成功能编号、双重映射、优先级、依赖和跨节点孤儿审计。
- [x] 形成正式 00 §9 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 7 | C-MI-1~5 的能力成立描述、逻辑顺序、进入 / 退出条件和 owner 边界 |
| Step 8 | US-MI-001~015 核心故事和 US-MI-E01~E05 外围故事 |
| Step 4 | G-MI-001~007、current / conditional / future 范围与 NG-MI-001~015 |
| Step 6 | compile / runtime / event / ref / adapter / fake 分类和依赖失效上限 |
| pending register | MI-UP-001~009、Q-MI-001~004 对正向功能的限制 |
| historical material | draft/03 与旧正式 00 只在独立功能结构形成后用于污染审计 |

## 3. SOP 问题回答

1. 当前讨论哪些核心能力节点?

   回答:严格按 C-MI-1 受控定义、C-MI-2 装配与派生基线、C-MI-3 构建候选、C-MI-4 provenance / eligibility、C-MI-5 供给与可实例化入口推进。每个节点先完成功能表和故事覆盖检查,再记录节点停审。

2. 根据已确认故事,系统必须提供哪些业务能力?

   回答:核心功能共 15 项,分别承接受控定义及来源判定、静态装配及派生、构建意图及候选结果、digest / provenance 及资格分层、availability 及 pinned 入口。外围 5 项只保留方向,不改变核心能力成立条件。

3. 每项能力如何表达输入、输出、触发和失败?

   回答:输入只写业务语境和受控 ref / snapshot / safe conclusion;输出只写本仓可拥有的可判断结果;触发只写 nightly、获准输入变化或能力前置成立;失败至少区分 missing、stale、conflict、blocked、failed、pending、unknown 和 unavailable 的适用语义,不预设字段枚举或协议。

4. 哪些共同构成核心,哪些只是外围增强?

   回答:F-MI-001~015 是五节点闭环不可缺失的核心功能。F-MI-E01~E05 分别对应多架构、特殊收缩 variant、快速安全补丁、加固基础镜像和只读使用摘要,只属 future / conditional enhancement。

5. 哪些看似功能但不属于本仓?

   回答:Role mapping 编辑、member / runtime live behavior、tool execution、Artifact 通用生命周期、容器生命周期、Sandbox、governance approval、外部 adapter 产品、observability backend、marketplace 和产品入口均不进入功能表。

6. 当前功能是否都能回指故事,故事是否都有功能承接?

   回答:核心 15 项与核心 15 条故事形成完整覆盖;部分功能承接多个同节点故事,但不存在跨节点贴标。外围 5 项与外围 5 条故事一一对应。映射详见 §7.9。

7. 是否足以进入规则讨论?

   回答:是。每项核心功能都有唯一能力节点、外部可见结果、失败上限和依赖关系,可作为 Step 10 规则挂载锚点;pending seam 只允许规则保护 fail-closed,不得推导正向 readiness。

## 4. 当前文档问题诊断

| 旧 / 候选口径 | 问题 | 当前处理 |
|---|---|---|
| 按 build / scan / sign / push 流水线列功能 | 把基础设施动作和未确权 evidence kind 当业务能力 | 改为构建候选、provenance、适用门禁和供给结果;具体产品与证据种类后移 |
| 把 Role -> variant 查询和修改都写入本仓 | 形成第二 mapping truth | 只保留映射来源承接、有效性判定和 body-free 追溯 |
| 把 member / runtime / tools 写成源码或包依赖 | 镜像消费关系不等于 compile dependency | 功能只消费 pinned component ref,不定义 sibling 源码调用 |
| 把 persona、policy、memory、workspace 混成运行状态 | 静态装配会吸收 live behavior、凭据、记忆或 checkpoint | 只承接 persona 装配身份、seed template ref 和 placement,live state 一律拒绝 |
| 直接声明 Artifact publish / lineage / baseline | 侵入 `L1-artifact` truth | 只解释镜像域 eligibility 与正式 handoff / ref 状态,positive handoff 保持 pending |
| “通知 member-service 并启动镜像” | 私造出站事件且吞并容器生命周期 | 只提供 pinned 可实例化入口与交接 gap;下游启动 / 升级决定外置 |
| 将兼容性、BOM、扫描、签名全部设为固定 P0 gate | owner、适用 policy 和 evidence kind 尚未闭合 | 只要求所有正式适用门禁不可绕过;具体 kind 进入 Q-MI-004 / pending |
| 固定 Role 数量、工具清单、性能数字或 CI / registry 产品 | 无当前 authority 或 measurement evidence | 不进入功能需求;后续配置和 NFR 也不得继承无来源事实 |

## 5. 改动前后对比

| 维度 | historical / draft 倾向 | 当前 Step 9 结论 |
|---|---|---|
| 组织主轴 | 6 节点资产流水线或 CI 动作 | 5 个已停审核心能力节点 |
| 功能粒度 | 对象操作、adapter 动作和状态混排 | 可判断的业务能力主题 |
| mapping | 本地目录与查询动作易吞并映射 truth | 来源承接、有效性判定和追溯,不编辑正文 |
| 构建 | trigger / build / registry 动作堆叠 | 构建意图、输入快照、交接结果和不确定性分层 |
| 证据 | 默认 scan / sign / BOM 已适用 | digest / provenance 为主线;其他 kind 仅在正式适用时进入门禁 |
| 发布 | Artifact、registry、member-service 成功被压成一个结果 | 镜像 availability、Artifact handoff 和下游 observed truth 分层 |
| readiness | 功能存在被误读为依赖就绪 | requirement priority 与 integration readiness 明确分离 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按旧流水线动作列 20~40 项功能 | 容易对应脚本 | implementation leakage 严重,产生孤儿功能 | 不采用 |
| 每条故事机械改写成一条功能 | 映射简单 | 角色目标与系统能力重复,无法归并 | 不采用 |
| 每节点先定义外部行为,再证明故事覆盖 | 能稳定驱动规则、数据、接口和验收 | 需要显式维护功能依赖 | 采用 |
| pending seam 不进入功能表 | 文本看似更确定 | 会丢失完整闭环所需的失败边界 | 不采用;保留核心功能,但正向结果标为 conditional / blocked |

## 7. 结构化中间产物

### 7.1 编号、类型与优先级口径

| 口径 | 定义 |
|---|---|
| `F-MI-001~015` | 当前需求主线的核心闭环功能;编号按 C-MI-1 -> C-MI-5 排列 |
| `F-MI-E01~E05` | 外围增强功能;不进入核心完成分母 |
| `P0-core` | 能力闭环成立不可缺失的需求优先级,不表示实现、依赖或 integration 已 ready |
| `P2-enhancement` | future / conditional 增强优先级,后续需重开范围或满足前置 authority |
| 功能依赖 | 表达业务能力逻辑前置,不等于源码、进程、调用或部署依赖 |

### 7.2 C-MI-1 受控定义功能

| ID | 功能需求 | 外部可见行为 | 输入语境 | 输出 / 可判断结果 | 触发 / 成立条件 | 失败 / 不确定情况 | 对应故事 | 功能依赖 |
|---|---|---|---|---|---|---|---|---|
| `F-MI-001` | Variant 与 persona 镜像定义承接 | 系统必须为正式 mapping 涉及的镜像资产形成受控 image family、variant 和 persona 装配身份,且不复制 Role 业务定义。 | 正式 RoleDefinition / mapping 的可验证 ref 或 pinned snapshot | 可识别的镜像域定义及其来源关联;未固定 Role 枚举 | 新增或修订正式 mapping 来源,或对现有目录做一致性校准 | 来源不存在或不可验证时不创建本地默认定义;受影响项 blocked / pending | US-MI-001、US-MI-003 | 无 |
| `F-MI-002` | Mapping 来源有效性判定 | 系统必须区分来源可接受、缺失、陈旧、冲突和不可验证,并阻止异常来源进入后续装配。 | mapping 来源 ref / snapshot 及可核验的新鲜度、唯一性语境 | accepted 或保守的 blocked / pending 结论,并能定位受影响 variant | F-MI-001 承接映射来源,或来源状态发生获准变化 | 不允许以缓存默认值、硬编码或 `latest` 掩盖异常;exact surface 未闭口时不得伪报 accepted | US-MI-002 | F-MI-001 |
| `F-MI-003` | 镜像定义来源追溯 | 系统必须说明一个 variant / persona 装配身份采用了哪份正式定义来源,而不保存方法资产正文。 | 已承接的镜像定义与 mapping 来源关联 | body-free 来源解释和一致 / gap 结论 | 资产审阅、构建前校验或事故复盘 | 来源关联缺失、冲突或已失效时返回 gap / blocked,不得补造来源 | US-MI-003、US-MI-002 | F-MI-001、F-MI-002 |

节点停审:C-MI-1 的定义承接、异常判定和审计追溯均有功能承接;三项功能只消费 mapping,不编辑 RoleDefinition / mapping truth,未预设查询接口或 schema。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线功能

| ID | 功能需求 | 外部可见行为 | 输入语境 | 输出 / 可判断结果 | 触发 / 成立条件 | 失败 / 不确定情况 | 对应故事 | 功能依赖 |
|---|---|---|---|---|---|---|---|---|
| `F-MI-004` | Pinned 静态装配基线形成 | 系统必须把 member、runtime、tools、角色 extras 和 policy / memory / workspace seed template 的获准引用及 placement 收束为完整、固定版本的 variant 装配基线。 | 有效 variant;各组件 release ref;角色 extras ref;seed template ref 与 placement 语境 | 完整 pinned assembly baseline,或明确 incomplete 结果 | 新 variant、获准组件 / extras / seed 变化,或基线校准 | 任一输入缺失、mutable、不可验证或 owner 未明时受影响基线 blocked / pending;不得猜版本 | US-MI-004 | F-MI-002 |
| `F-MI-005` | 静态输入与 live state 边界判定 | 系统必须识别装配候选是否仅含获准静态模板、种子和构建输入,并拒绝运行时凭据、live memory、checkpoint、workspace live content 或 observed state。 | F-MI-004 的候选输入集合及其来源类别 | static-input-safe 或 rejected / blocked 结论;不吸收 live body | 每次装配基线形成或修订前 | 类别未知、正文越界或混入 live state 时 fail closed;不得通过本地复制“冻结”为合法静态输入 | US-MI-005、US-MI-004 | F-MI-004 |
| `F-MI-006` | Base 到 variant 派生与修订追溯 | 系统必须让 base 到 variant 的派生依据、装配差异和历次 revision 可解释,且不得原地覆盖既有基线。 | 已通过静态边界的装配基线、上一个 revision 及获准变更依据 | 新的不可混淆 revision / derivation 关系,或 unchanged / blocked 结论 | 有效装配差异或受控修订请求 | 前置 revision、变更依据或差异不可验证时不得派生;历史关联不得被后续版本重写 | US-MI-006、US-MI-004 | F-MI-004、F-MI-005 |

节点停审:C-MI-2 的完整 pin、静态边界和派生历史均有功能承接;component release、seed 正文与 Artifact truth 仍由外部 owner 持有,MI-UP-002/006/007 不被改写为 positive readiness。`gate_status = pass`。

### 7.4 C-MI-3 构建候选功能

| ID | 功能需求 | 外部可见行为 | 输入语境 | 输出 / 可判断结果 | 触发 / 成立条件 | 失败 / 不确定情况 | 对应故事 | 功能依赖 |
|---|---|---|---|---|---|---|---|---|
| `F-MI-007` | 受控构建意图形成 | 系统必须把 ADR-0005 的 nightly 要求以及其他获准输入变化收束为可归责的构建意图,并分别表达接受、拒绝或挂起。 | 可构建的 variant revision;nightly 语境;经 authority 认可的变化 / 事件语境 | 唯一且可解释的 build intent,或 rejected / pending 结论 | nightly 到期;获准变化被识别;已验证事件输入到达 | 重复、未知、无 authority 或不可验证输入不得形成有效意图;MI-UP-005 未闭口时 event lane unavailable | US-MI-007、US-MI-008 | F-MI-006 |
| `F-MI-008` | 构建输入快照与执行交接 | 系统必须为每个有效构建意图固定完整输入快照,并在不拥有 builder truth 的前提下形成可追溯执行交接。 | build intent;对应 variant revision;全部 pinned component / extras / seed / base refs 和构建约束 | 与意图唯一关联的 immutable input snapshot 及交接 attempt,或 blocked 结论 | F-MI-007 接受意图且 C-MI-2 基线完整 | 任一输入漂移、缺失或不可验证时不得交接;builder 未就绪 / 拒绝时只记录 blocked / failed,不得伪造执行 | US-MI-007、US-MI-009 | F-MI-004~007 |
| `F-MI-009` | 构建候选结果与不确定性分层 | 系统必须区分候选输出、明确失败、前置阻断和结果未知,并使结果与 attempt / input snapshot 保持关联。 | builder adapter 返回的安全结果或无法确认结果;对应 attempt | candidate digest / ref binding,或 failed / blocked / unknown 结果;不存在输出时不生成候选 | F-MI-008 已形成执行交接并收到可判定或超出确认边界的结果 | adapter / registry 不一致、超时或结果不可核验时保持 unknown / unavailable;不得把请求已发出等同构建成功 | US-MI-009、US-MI-007 | F-MI-008 |

节点停审:C-MI-3 的 nightly / 条件触发、输入快照 / 执行交接、候选 / 失败 / blocked / unknown 分层均有功能承接;未定义 CI 产品、事件 family/schema、重试算法或 registry 协议。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 功能

| ID | 功能需求 | 外部可见行为 | 输入语境 | 输出 / 可判断结果 | 触发 / 成立条件 | 失败 / 不确定情况 | 对应故事 | 功能依赖 |
|---|---|---|---|---|---|---|---|---|
| `F-MI-010` | 候选 digest 与 provenance 绑定 | 系统必须使候选输出 digest 回指 build intent、input snapshot、variant revision 和全部受控来源,以便声明与内容可交叉核验。 | F-MI-009 的候选 digest / ref;构建意图与输入快照;来源关联 | 完整、body-free 的 image provenance binding,或 provenance incomplete / conflict | 产生可验证候选输出 | digest 缺失、与 ref 不一致、输入链断裂或来源冲突时不得形成可用 provenance,候选资格 blocked | US-MI-010、US-MI-012 | F-MI-003、F-MI-006、F-MI-009 |
| `F-MI-011` | 正式适用证据门禁承接 | 系统必须只承接由正式 authority 声明为适用的 evidence ref / safe conclusion,并保证缺失、失败或不可验证的适用门禁不能被静默绕过。 | 候选 provenance;适用门禁集合;外部 evidence ref / safe conclusion | 每个适用门禁的 satisfied / blocked / pending 可解释结论;未适用项不伪报 passed | provenance 完整且正式 policy / authority 给出适用要求 | authority 或 kind 未闭口时保持 pending;适用 evidence missing / failed / unverifiable 时 fail closed;不得自造 BOM / scan / signature 结果 | US-MI-011 | F-MI-010 |
| `F-MI-012` | 镜像资格与 Artifact handoff 分层 | 系统必须基于 provenance 和正式适用门禁形成镜像域 eligibility,并与 `L1-artifact` 的正式 handoff / consumer ref 状态分层解释。 | F-MI-010~011 的结果;外部 Artifact handoff safe conclusion 或正式消费引用(若已成立) | 镜像域 eligible / blocked / pending 结论,以及独立的 Artifact handoff confirmed / gap 语义;不复制 Artifact version / lineage | provenance 完整且所有适用门禁可判定;需要正式 Artifact 交接时检查其外部状态 | 门禁未满足或 Artifact 条件未闭口时不得宣称 formal Artifact ref / eligibility positive;MI-UP-007 期间只允许 pending / gap | US-MI-012、US-MI-011 | F-MI-010、F-MI-011 |

节点停审:C-MI-4 的 digest / provenance、正式适用 evidence 和镜像资格 / Artifact handoff 分层均有功能承接;Q-MI-004 未被解析成固定 evidence 清单,MI-UP-007 未被写成 handoff 成功。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口功能

| ID | 功能需求 | 外部可见行为 | 输入语境 | 输出 / 可判断结果 | 触发 / 成立条件 | 失败 / 不确定情况 | 对应故事 | 功能依赖 |
|---|---|---|---|---|---|---|---|---|
| `F-MI-013` | 镜像供给 availability 管理 | 系统必须显式表达合格镜像何时进入供给、被替代、作为回滚目标或退役,且不得依赖生产 `latest` 或原地改写历史供给。 | eligibility 结论;既有供给历史;获准 publish / rollback / retire 意图 | 可解释的 availability 变化与历史;只有满足门禁的 pinned 版本可进入可用集合 | F-MI-012 满足当前供给条件,或发生获准回滚 / 退役处置 | eligibility blocked / pending、registry ref 不可验证或目标不明确时供给变化 blocked;不得用 mutable tag 补口 | US-MI-014、US-MI-015 | F-MI-012 |
| `F-MI-014` | Pinned 可实例化镜像入口供给 | 系统必须向获准消费者提供与 availability 一致、固定版本且可验证的 manifest / variant / ref 入口语义,使其无需直接解析 Role mapping。 | 可用 variant revision;候选 digest / ref;provenance / eligibility 摘要;正式消费引用(若适用且成立) | resolvable pinned image entry,或 unavailable / pending / contract-gap 结论 | F-MI-013 表明版本可供给,且 consumer seam 足以表达安全入口 | exact contract 未闭口、ref 不可验证或 availability 不成立时不得给出正向可实例化结论;MI-UP-001 持续限制 positive lane | US-MI-013、US-MI-015 | F-MI-003、F-MI-010、F-MI-013 |
| `F-MI-015` | 供给交接与消费 gap 分层 | 系统必须区分本仓 availability、入口交接结果和下游是否确认 / 实例化,使外部消费缺口不反写已成立的镜像域事实。 | 本仓 availability / entry;允许获得的 handoff safe conclusion;下游确认若有 | local supply、handoff confirmed / rejected / pending / unknown 和 consumer gap 的分层解释 | 入口被请求、交接被尝试或事故 / 回滚复盘 | 无出站事件 authority 时不得补发或声称通知成功;下游未确认不得等同镜像不可用,也不得声称容器已启动 | US-MI-015、US-MI-014 | F-MI-013、F-MI-014 |

节点停审:C-MI-5 的 availability 生命周期、pinned 入口与 handoff / consumer gap 均有功能承接;未写 exact manifest 字段、outbound event、容器启动 / 升级或 observed readiness。MI-UP-001/009 继续限制正向交接。`gate_status = pass`。

### 7.7 外围增强功能

| ID | 功能需求 | 外部可见结果 | 能力类型 / 优先级 | 对应故事 | 当前边界 |
|---|---|---|---|---|---|
| `F-MI-E01` | 多架构供给增强 | 同一受控 variant 可在获准架构维度下形成彼此可区分的 pinned 入口 | 外围增强 / `P2-enhancement` | US-MI-E01 | Q-MI-002 未裁定前不进入核心模型或验收分母 |
| `F-MI-E02` | 特殊收缩 variant 增强 | 高约束职责可采用显式收缩且不改写 Role 定义的装配 variant | 外围增强 / `P2-enhancement` | US-MI-E02 | Q-MI-001 未裁定;不得由本仓定义治理权限 |
| `F-MI-E03` | 安全变化快速重建增强 | 获准高风险安全变化可缩短进入重建 / 供给语境的路径,但仍经过全部正式适用门禁 | 外围增强 / `P2-enhancement` | US-MI-E03 | 不形成 emergency bypass;调度、审批与阈值 owner 外置 |
| `F-MI-E04` | 加固基础镜像承接增强 | 未来获准的加固基础镜像可作为 pinned 静态输入被承接,而不吸收 Sandbox policy / backend truth | 外围增强 / `P2-enhancement` | US-MI-E04 | MI-UP-008;不进入当前核心主链 |
| `F-MI-E05` | 只读供给使用摘要增强 | 可消费不反写 truth 的下游安全摘要,用于识别供给资产使用趋势 | 外围增强 / `P2-enhancement` | US-MI-E05 | 不保存下游 live / observed body,不形成 observability backend |

外围停审:五项功能均依赖核心 truth 且各有外围故事来源;数量未压过核心功能,也不改变 C-MI-1~5 的成立条件。`gate_status = pass`。

### 7.8 正式功能需求摘要

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-MI-001` Variant 与 persona 镜像定义承接 | 核心闭环能力 | 从正式 mapping 来源形成受控镜像域身份,不复制 Role 正文。 | C-MI-1 受控定义 | US-MI-001、003 |
| `F-MI-002` Mapping 来源有效性判定 | 核心闭环能力 | 来源异常必须显式且阻断受影响装配,不得本地 fallback。 | C-MI-1 受控定义 | US-MI-002 |
| `F-MI-003` 镜像定义来源追溯 | 核心闭环能力 | 提供 body-free 定义来源解释和 gap 结果。 | C-MI-1 受控定义 | US-MI-002、003 |
| `F-MI-004` Pinned 静态装配基线形成 | 核心闭环能力 | 固定组件、extras 与 seed template ref / placement,形成完整装配基线。 | C-MI-2 装配与派生基线 | US-MI-004 |
| `F-MI-005` 静态输入与 live state 边界判定 | 核心闭环能力 | 拒绝凭据、live memory、checkpoint 和 workspace live content 进入装配。 | C-MI-2 装配与派生基线 | US-MI-004、005 |
| `F-MI-006` Base 到 variant 派生与修订追溯 | 核心闭环能力 | 解释派生差异和历次 revision,不原地覆盖历史。 | C-MI-2 装配与派生基线 | US-MI-004、006 |
| `F-MI-007` 受控构建意图形成 | 核心闭环能力 | 承接 nightly 和获准输入,区分接受、拒绝与挂起。 | C-MI-3 构建候选 | US-MI-007、008 |
| `F-MI-008` 构建输入快照与执行交接 | 核心闭环能力 | 为有效意图固定完整输入快照并形成 builder 交接边界。 | C-MI-3 构建候选 | US-MI-007、009 |
| `F-MI-009` 构建候选结果与不确定性分层 | 核心闭环能力 | 区分候选、failed、blocked 与 unknown,不伪造输出。 | C-MI-3 构建候选 | US-MI-007、009 |
| `F-MI-010` 候选 digest 与 provenance 绑定 | 核心闭环能力 | 将候选 digest 与意图、输入快照、revision 和来源链绑定。 | C-MI-4 provenance 与 eligibility | US-MI-010、012 |
| `F-MI-011` 正式适用证据门禁承接 | 核心闭环能力 | 所有正式适用 evidence gate 均不可静默绕过。 | C-MI-4 provenance 与 eligibility | US-MI-011 |
| `F-MI-012` 镜像资格与 Artifact handoff 分层 | 核心闭环能力 | 镜像域 eligibility 与 Artifact 正式引用 / handoff 状态分层。 | C-MI-4 provenance 与 eligibility | US-MI-011、012 |
| `F-MI-013` 镜像供给 availability 管理 | 核心闭环能力 | 显式表达供给、替代、回滚和退役,禁止 mutable latest 补口。 | C-MI-5 供给与可实例化入口 | US-MI-014、015 |
| `F-MI-014` Pinned 可实例化镜像入口供给 | 核心闭环能力 | 提供与 availability 一致的 manifest / variant / ref 入口语义。 | C-MI-5 供给与可实例化入口 | US-MI-013、015 |
| `F-MI-015` 供给交接与消费 gap 分层 | 核心闭环能力 | 区分本仓 supply、handoff 与下游确认 / 实例化事实。 | C-MI-5 供给与可实例化入口 | US-MI-014、015 |
| `F-MI-E01` 多架构供给增强 | 外围增强能力 | 面向获准运行架构形成可区分供给。 | C-MI-5 的外围扩展 | US-MI-E01 |
| `F-MI-E02` 特殊收缩 variant 增强 | 外围增强能力 | 提供显式收缩装配方向,不改写 Role / governance truth。 | C-MI-1~2 的外围扩展 | US-MI-E02 |
| `F-MI-E03` 安全变化快速重建增强 | 外围增强能力 | 缩短获准安全变化进入重建的路径且不绕门禁。 | C-MI-3~5 的外围扩展 | US-MI-E03 |
| `F-MI-E04` 加固基础镜像承接增强 | 外围增强能力 | 未来承接加固基础镜像 ref,不拥有 Sandbox truth。 | C-MI-2 的外围扩展 | US-MI-E04 |
| `F-MI-E05` 只读供给使用摘要增强 | 外围增强能力 | 使用安全摘要辅助资产维护,不拥有 observed truth。 | C-MI-5 的外围扩展 | US-MI-E05 |

### 7.9 故事覆盖与功能依赖审计

| 能力节点 | 用户故事 | 承接功能 | 功能逻辑链 | 结果 |
|---|---|---|---|---|
| C-MI-1 | US-MI-001~003 | F-MI-001~003 | 定义承接 -> 来源判定 -> 来源追溯 | 全覆盖,无 mapping truth 越界 |
| C-MI-2 | US-MI-004~006 | F-MI-004~006 | pinned baseline -> 静态边界 -> 派生修订 | 全覆盖,无 live state / Artifact 串线 |
| C-MI-3 | US-MI-007~009 | F-MI-007~009 | intent -> snapshot / handoff -> candidate / uncertainty | 全覆盖,无 CI / event schema 泄漏 |
| C-MI-4 | US-MI-010~012 | F-MI-010~012 | digest / provenance -> applicable gate -> eligibility / Artifact 分层 | 全覆盖,无 evidence / handoff readiness 伪造 |
| C-MI-5 | US-MI-013~015 | F-MI-013~015 | availability -> pinned entry -> handoff / consumer gap | 全覆盖,无 container lifecycle / outbound event 越界 |
| 外围 | US-MI-E01~E05 | F-MI-E01~E05 | 各自依赖相关核心功能 | 全覆盖,不进入核心完成分母 |

| 跨节点检查 | 结果 |
|---|---|
| 是否存在没有故事来源的核心功能 | 否 |
| 是否存在没有功能承接的核心故事 | 否 |
| 是否存在功能跨多个核心节点贴标 | 否;跨节点关系只写逻辑前置 |
| 是否把 CRUD / API / Command / 内部函数当功能 | 否 |
| 是否把 compile/runtime/event/ref/adapter/fake 混为源码依赖 | 否 |
| 是否把外围功能写成核心完成前置 | 否 |
| 是否把 pending seam 写成 positive readiness | 否 |
| 是否出现实现、run、digest、report、evidence、测试或 signoff 事实 | 否;本文只定义未来可判断语义 |

### 7.10 历史功能差异审计

| historical item | 当前处置 | 对应当前功能 / 边界 |
|---|---|---|
| 固定 `ai-member-base` 与 9 个 Role 镜像 | 废弃固定名称、数量和 Role 清单;保留一 Role 一镜像的受控映射原则 | F-MI-001~006;Role 集合来自 method-library |
| supervisord 组合启动 | 后移且不作为 00 功能 | 组件装配可进入 F-MI-004;进程组织后续设计,运行 loop 不归本仓 |
| nightly 构建 | 保留 ADR-0005 裁决,移除固定 CI / 并行步骤 | F-MI-007~009 |
| tag 触发重建 | 修改为“获准输入变化”;具体 event/schema pending | F-MI-007;MI-UP-005 |
| 漏洞扫描 / cosign / BOM 固定 P0 | 不继承具体 kind;仅正式适用门禁不可绕过 | F-MI-011;Q-MI-004 |
| 多架构 amd64 + arm64 | 降为未裁定增强,不继承固定架构枚举 | F-MI-E01;Q-MI-002 |
| Role extras | 保留装配方向,工具合同与发布 truth 外置 | F-MI-004 |
| IPC schema 兼容检查 | 不建立本仓自有检查定义;若未来被 owner 确权,只承接适用 safe conclusion | MI-UP-002;当前不新增独立功能 |
| 发布通知 member-service | 废弃出站通知假设;改为 pinned entry 与 handoff gap | F-MI-014~015;MI-UP-001/009 |
| 100%、99.9%、保留期和构建耗时 | 无 authority,全部拒绝回流 | 后续 Step 13~14 也不得据此伪量化 |

### 7.11 优先级与 readiness 分离

| 范围 | 需求优先级 | 当前设计状态 | 正向集成上限 |
|---|---|---|---|
| F-MI-001~015 | `P0-core` | requirement accepted in Step 9 | 受各自 MI-UP blocker 限制;P0 不等于 adapter / upstream ready |
| F-MI-E01~E05 | `P2-enhancement` | future / conditional | 不进入当前核心设计 / 验收完成分母 |

## 8. 回填草稿

正式 00 §9 使用 §7.8 的固定五列表作为主表,并补一段优先级说明:`F-MI-001~015` 均为 `P0-core`,但需求优先级不构成依赖 readiness;`F-MI-E01~E05` 为外围增强。正式正文应保留五节点分组或节点列,但不回填输入 / 输出长表、停审过程、历史差异或产品级实现。

功能依赖只保留以下业务逻辑摘要:

```text
受控定义
  -> pinned 装配与派生基线
  -> 构建意图、输入快照与候选结果
  -> digest / provenance、适用门禁与 eligibility
  -> availability、pinned 入口与 handoff gap
```

该箭头只表示能力逻辑前置,不表示同步调用、代码依赖、进程部署或 CI 执行步骤。

## 9. 待确认事项

| ID | 影响功能 | 当前功能上限 |
|---|---|---|
| `MI-UP-001` | F-MI-014~015 | 可定义本仓入口 / gap;不得声明 member-service 可消费或实例化成功 |
| `MI-UP-002` | F-MI-004~006 | member component shape / compatibility owner 未闭口时受影响装配 blocked |
| `MI-UP-003` | F-MI-001~003 | mapping owner 已定;exact consumer surface pending,不得声明正向 adapter ready |
| `MI-UP-004` | 全部跨仓 ref / error seam | Core image-specific schema 未认定,需求层不私造 shared type |
| `MI-UP-005` | F-MI-007 | event lane 只保留接受 / 拒绝 / pending 语义;nightly 不受影响 |
| `MI-UP-006` | F-MI-004~005 | seed source owner 未闭口时只承接候选 ref / placement,不得复制正文 |
| `MI-UP-007` | F-MI-004、010~014 | Artifact owner 已定,但 image handoff 条件 / schema pending;不得自造 formal ref |
| `MI-UP-008` | F-MI-E04 | future only |
| `MI-UP-009` | F-MI-015 | 无出站 event authority;不得把 handoff 写成事件通知 |
| `Q-MI-001~002` | F-MI-E01~E02 | 保持 enhancement,不进入核心 variant 完成条件 |
| `Q-MI-003` | F-MI-008~011、013~014 | builder / registry / evidence 产品后移 04,不进入需求功能名 |
| `Q-MI-004` | F-MI-011~012 | 只固定“正式适用门禁不可绕过”;evidence kinds / priority pending |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每项核心功能是否有编号、类型、说明、优先级和双重映射 | pass |
| C-MI-1~5 是否按顺序逐节点完成停审 | pass |
| 是否存在无功能承接故事或无故事来源功能 | no |
| 是否记录输入、输出、触发、失败与功能依赖 | pass |
| 核心 / 外围 / 边界外是否分层 | pass |
| 是否混入 CRUD、API、Command、schema、实现组件或产品 | no |
| historical 污染是否完成后置审计 | pass |
| pending / blocker 是否保持 fail-closed 且无 readiness 伪造 | pass |

`gate_status = pass`;允许创建 Step 10,不得跳到 Step 11 或修改正式 00。
