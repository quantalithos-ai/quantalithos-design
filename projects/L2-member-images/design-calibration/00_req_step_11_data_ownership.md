# Step 11. 数据需求与数据归属

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_node_data_audit` | pass | D-MI-001~030 已按 C-MI-1~5 逐节点停审,4 项外围数据单列;四类归属、功能 / 规则来源、历史污染和 pending 边界审计均通过 | 进入 Step 12 接口与依赖 | `00_req_step_02_position_boundary.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 11 和书写规范 §4.11。
- [x] 固定正式数据类型为真相数据 / 快照数据 / 引用数据 / 禁止保存正文。
- [x] 明确本仓派生结论仍属于真相数据,不另造第五类数据类型。
- [x] 按 C-MI-1 -> C-MI-5 逐节点识别数据项、归属和生命周期口径。
- [x] 为每个数据项标出功能 / 规则来源并执行能力级停审。
- [x] 单列外围增强数据,不提前固化 future 模型。
- [x] 后置审计旧实体 / 生命周期与 draft 候选对象,拒绝字段和状态机污染。
- [x] 完成重复 truth、分类冲突、孤儿数据、正文越界和实现泄漏审计。
- [x] 形成正式 00 §11 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | 镜像域 truth、外部 ref / snapshot 与禁止 truth 边界 |
| Step 9 | F-MI-001~015、F-MI-E01~E05 的业务输入 / 输出语境 |
| Step 10 | BR-MI-001~025 和外围规则对 immutable、fail-closed、owner 的约束 |
| 上游正式边界 | method mapping、component、Artifact、runtime / live state、member-service lifecycle 的 owner |
| pending register | exact schema / body / ref 未闭口时只能定义分类和 conservative lifecycle |

## 3. SOP 问题回答

1. 当前讨论哪个核心能力节点?

   回答:按 C-MI-1 到 C-MI-5 串行讨论。每个节点先列本仓 truth,再列稳定消费快照、外部引用和禁止正文,最后检查该节点功能 / 规则是否都有数据承接。

2. 哪些数据由本仓拥有真相?

   回答:镜像域定义及来源判定、装配基线 / revision / derivation、build intent / attempt / outcome、digest / provenance / eligibility、availability / entry / handoff gap 由本仓拥有。基于外部 ref / safe conclusion 形成的 mapping validation、eligibility 和 gap 仍是本仓派生真相,不是外部 truth 副本。

3. 哪些数据只是快照?

   回答:Role-image mapping 的稳定消费目录、build input snapshot、适用 policy / evidence safe conclusion 以及下游确认摘要只能作为快照。快照不获得上游 truth owner;构建输入快照一经 attempt 固定便不可被后续上游变化改写。

4. 哪些数据只是引用?

   回答:RoleDefinition / mapping source、component release、base、seed template、builder / registry candidate、evidence、`ConsumableArtifactReference`、pinned image 与 consumer handoff 对象只保存引用关系,正文和外部生命周期仍归各 owner。

5. 哪些内容绝不能保存正文?

   回答:Role / mapping 正文、component source / contract 正文、seed 语义源正文、secret、live memory / checkpoint / workspace live content、builder / registry / evidence backend body、key / vulnerability database、Artifact body / version / lineage / baseline、container / observed truth 均不得成为本仓领域正文。

6. 生命周期口径是什么?

   回答:本仓 truth 通过显式建立 / revision / attempt / eligibility / availability 变化形成自己的生命周期且历史不可原地覆盖;快照随消费语境形成或更新但不成为第二 truth;ref 随绑定关系建立 / 失效而变化;禁止正文不进入本仓领域生命周期。具体 retention、存储和归档机制后移。

7. 是否存在功能所需数据无归属或数据无来源?

   回答:不存在。D-MI-001~030 覆盖 F-MI-001~015 与 BR-MI-001~025;外围数据 D-MI-E01~E04 只在增强启用时适用。映射详见 §7.9。

## 4. 当前文档问题诊断

| historical / draft 数据口径 | 问题 | 当前处理 |
|---|---|---|
| `BaseImageRelease` / `RoleImageRelease` + built -> scanned -> signed -> published | 把固定 CI 状态机、Role 枚举和 Artifact release 语义混在一个实体 | 拆为镜像定义 / revision、attempt / outcome、eligibility 与 availability 等需求数据项 |
| `ImageBOM` 作为本仓 append-only 真相 | BOM kind / owner / policy 尚未确权 | 降为条件型 evidence ref / safe conclusion;正文不成为本仓 truth |
| `CompatibilityReport` 作为本仓构建报告 | compatibility 定义和 owner pending | 若未来正式适用,只承接 ref / safe conclusion;当前不建立 report truth |
| `semver / digest / extras` 字段清单 | 进入对象字段设计且可能与 Artifact version 冲突 | 只写数据项类别和归属;字段 / version scheme 后移 02/03 |
| BOM / scan / sign 长期、retired 一年、nightly 短期 | 无 retention authority | 移除全部时长与存储策略;只保留需求层进入 / 变化 / 退出语义 |
| draft 的 `ArtifactBinding` / `ImageOutboxRecord` 候选 | 前者容易自造 formal ref,后者依赖未授权出站事件 | 改为正式 Artifact ref 关系;outbox 不进入需求数据项 |
| seed template identity 与 seed body 混排 | 会把外部语义正文变成本仓 truth | 本仓拥有 placement / pin 绑定,只引用模板;source body 外置 |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前 Step 11 结论 |
|---|---|---|
| 分类 | 实体 / 工件 / 报告混排 | 真相 / 快照 / 引用 / 禁止正文四类 |
| 派生结论 | 与外部报告混为一体 | 本仓 eligibility / gap 是本仓派生真相,来源仍外置 |
| 构建输入 | tag / 包字段 | attempt 级 input snapshot + 外部 refs |
| Artifact | 本地 release / binding 候选 | 只保存正式消费引用和 handoff 关系,不拥有通用 truth |
| seed | 本地内容 / 目录倾向 | placement / pin truth + 外部 template ref;live state 禁止 |
| 生命周期 | 固定状态机 / retention 数字 | 需求层建立、修订、失效与不可覆盖语义 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 draft 对象名直接列实体 | 便于后续编码 | 过早固化 object / schema 且可能复制上游类型 | 不采用 |
| 所有外部输入都只列 ref | owner 清晰 | 无法表达 stable mapping / build snapshot 和 safe conclusion | 不采用 |
| 按四类数据逐节点分类,本仓派生结论归 truth | 与规范一致且 owner 可审计 | 后续设计还需细化对象 | 采用 |
| 把镜像层内 materialized template / component 当本仓正文 truth | 与构建物理内容直觉一致 | 物理包含不等于语义 / 发布 truth 所有权 | 不采用;只拥有装配绑定和构建结果 |

## 7. 结构化中间产物

### 7.1 分类与生命周期口径

| 正式数据类型 | 本项目判断口径 | 生命周期口径 |
|---|---|---|
| 真相数据 | 镜像域定义、绑定、attempt、派生结论和供给变化由本仓正式拥有 | 通过正式建立 / 修订 / 变化形成本仓生命周期;历史不得原地覆盖 |
| 快照数据 | 上游 truth 不属于本仓,但为稳定消费或 attempt 固定其安全目录 / 摘要 | 随稳定消费语境形成或更新;不形成独立上游 truth 生命周期 |
| 引用数据 | 只保存与外部对象的绑定关系 | 随引用建立、变化或失效而变化;正文生命周期不归本仓 |
| 禁止保存正文 | 外部语义正文、live state、secret、backend / Artifact / container truth | 不进入本仓领域 truth 生命周期 |

说明:“本仓派生真相”只是对真相数据来源方式的补充,不是第五种正式数据类型。构建产物中物理包含一个 pinned component / template,不把该 component / template 的语义或发布 truth 转移给本仓。

### 7.2 C-MI-1 受控定义数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-001` | Image family / variant / persona 镜像定义 | 真相数据 | 镜像域定义由本仓拥有正式真相,但不包含 Role 业务正文。 | 从正式建立到被显式修订 / 退役形成本仓生命周期,历史定义不被原地覆盖。 | F-MI-001;BR-MI-001/003 |
| `D-MI-002` | Mapping 来源关联与有效性结论 | 真相数据 | 来源关联及 accepted / gap 类本仓判断由本仓拥有派生真相。 | 随来源重新判定显式形成新结论,既有判断保留其当时语境。 | F-MI-002/003;BR-MI-002/003/005 |
| `D-MI-003` | Role-image mapping 稳定消费快照 | 快照数据 | mapping 正式 truth 不属于本仓,但可为稳定消费保留目录级快照。 | 随正式来源变化形成新快照;不反写或替代上游 mapping 生命周期。 | F-MI-001/002;BR-MI-001~004 |
| `D-MI-004` | RoleDefinition / mapping source ref | 引用数据 | 本仓只保存对正式 Role / mapping 来源的引用关系。 | 随来源绑定建立、变化或失效而变化,不负责来源正文生命周期。 | F-MI-001~003;BR-MI-001~005 |
| `D-MI-005` | RoleDefinition、Role 业务定义与 mapping 正文 | 禁止保存正文 | 方法资产正文不属于本仓 truth,本仓不得保存为本地领域正文。 | 不进入本仓领域 truth 生命周期。 | NG-MI-001;BR-MI-004 |

节点停审:C-MI-1 的本地定义 truth、派生判断、消费快照、source ref 与禁止 mapping body 均已分类;未定义 Role 字段、snapshot schema、cache 或索引。`gate_status = pass`。

### 7.3 C-MI-2 装配与派生基线数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-006` | Pinned assembly baseline | 真相数据 | variant 的 component / extras / seed placement 与 pin 绑定由本仓拥有正式真相。 | 随正式装配 revision 建立和被替代,既有基线不被后续输入改写。 | F-MI-004/005;BR-MI-006/008 |
| `D-MI-007` | Variant revision | 真相数据 | 镜像定义 / 装配的 revision 身份与当前关系由本仓拥有正式真相。 | 通过显式修订新增;被 supersede / retire 不等于删除历史。 | F-MI-006;BR-MI-009 |
| `D-MI-008` | Base -> variant derivation 关系与差异依据 | 真相数据 | 镜像域派生关系和装配差异依据由本仓拥有正式真相。 | 随新 revision 建立,不因 base 或上游后续变化被原地重算覆盖。 | F-MI-006;BR-MI-009 |
| `D-MI-009` | Component / base / extras release refs | 引用数据 | 本仓只保存对 member、runtime、tools、extras 和 base 正式发布对象的引用关系。 | 随 assembly baseline 的 pin 建立、替代或失效而变化;不负责外部 release 生命周期。 | F-MI-004;BR-MI-006/010 |
| `D-MI-010` | Policy / memory / workspace seed template refs | 引用数据 | 本仓只保存 seed template 来源、版本身份与 placement 所需引用,不拥有其语义正文。 | 随装配绑定建立、修订或失效而变化;模板正文生命周期归来源 owner。 | F-MI-004/005;BR-MI-006/010 |
| `D-MI-011` | Secret、live memory、checkpoint 与 workspace live content 正文 | 禁止保存正文 | 运行期 live / sensitive body 不属于镜像资产 truth,不得作为模板或构建输入保存。 | 不进入本仓领域 truth 生命周期。 | F-MI-005;BR-MI-007 |
| `D-MI-012` | Component source / tool contract / seed 语义源正文 | 禁止保存正文 | 外部 source / contract / semantic truth 不得成为本仓领域正文。 | 不进入本仓领域 truth 生命周期;物理构建消费不转移 owner。 | F-MI-004~006;BR-MI-008/010 |

节点停审:C-MI-2 的 baseline / revision / derivation truth、component / seed refs 和两类 forbidden body 均已分类;模板 / 种子 / 构建输入与 live state 红线明确,未写文件路径、版本字段或存储结构。`gate_status = pass`。

### 7.4 C-MI-3 构建候选数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-013` | Build intent 与来源关联 | 真相数据 | 获准构建意图及其 nightly / authority 来源关联由本仓拥有正式真相。 | 从意图被接受、拒绝或挂起形成一次可追溯结论;后续尝试不改写原意图。 | F-MI-007;BR-MI-011/013 |
| `D-MI-014` | Build attempt 与 outcome | 真相数据 | 构建交接 attempt 及 candidate / failed / blocked / unknown 本仓结果由本仓拥有正式真相。 | 每次交接形成独立 attempt / outcome;重新尝试新增记录而不覆盖既有结果。 | F-MI-008/009;BR-MI-012~014 |
| `D-MI-015` | Build input snapshot | 快照数据 | 上游组件、模板和约束 truth 不属于本仓,本仓为一次 attempt 固定其安全输入快照。 | 在 attempt 形成时固定;上游后续变化不改写旧快照,新语境形成新快照。 | F-MI-008;BR-MI-012 |
| `D-MI-016` | Builder execution / registry candidate refs | 引用数据 | 本仓只保存对外部执行对象和候选镜像存储对象的引用关系。 | 随 attempt 交接、候选形成或外部 ref 失效而变化;不负责 backend 对象生命周期。 | F-MI-008/009;BR-MI-013/015 |
| `D-MI-017` | Trigger authority / inbound event source refs | 引用数据 | 本仓只保存对构建来源 authority 或已验证 event source 的引用,不拥有 event family / carrier truth。 | 随来源获准、撤销或失效而变化;MI-UP-005 未闭口时 event ref 不形成 positive lane。 | F-MI-007;BR-MI-011/015 |
| `D-MI-018` | Scheduler、builder、registry job / log / backend 正文 | 禁止保存正文 | 外部基础设施执行与存储正文不属于本仓领域 truth。 | 不进入本仓领域 truth 生命周期;必要安全引用不转移 owner。 | NG-MI-012;BR-MI-015 |

节点停审:C-MI-3 的 intent / attempt / outcome truth、attempt 级输入快照、外部执行 / trigger refs 和 backend forbidden body 均已分类;“请求已发出”与“候选已形成”不再混成同一数据事实。`gate_status = pass`。

### 7.5 C-MI-4 Provenance 与 eligibility 数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-019` | Image digest / provenance binding | 真相数据 | 候选 digest 与 intent、snapshot、revision 和来源链的绑定由本仓拥有正式真相。 | 随候选形成建立;后续资格或供给变化不得改写其原始绑定。 | F-MI-010;BR-MI-016 |
| `D-MI-020` | Applicable gate evaluation 与 image eligibility | 真相数据 | 基于正式适用输入形成的 gate evaluation 和镜像资格结论由本仓拥有派生真相。 | 随候选和适用语境形成明确结论;重新评估形成新语境,不伪改旧结论。 | F-MI-011/012;BR-MI-017~019 |
| `D-MI-021` | Effective policy / gate applicability 安全快照 | 快照数据 | policy / authority truth 不属于本仓,本仓只为一次资格判断保留适用性安全快照。 | 随正式 authority 变化形成新快照;Q-MI-004 未闭口时保持 pending 语境。 | F-MI-011;BR-MI-017 |
| `D-MI-022` | External evidence safe conclusion 快照 | 快照数据 | 外部 evidence 结论 truth 不属于本仓,本仓只保留资格判断所需的安全结论快照。 | 随正式 evidence conclusion 被替代 / 失效形成新快照;不反写外部 evidence。 | F-MI-011/012;BR-MI-018 |
| `D-MI-023` | Evidence refs | 引用数据 | 本仓只保存对正式适用 evidence 对象的引用关系,不拥有其正文。 | 随适用 gate 绑定、替代或失效而变化;具体 kind 未确权时不建立伪 ref。 | F-MI-011;BR-MI-017/020 |
| `D-MI-024` | Artifact handoff / `ConsumableArtifactReference` | 引用数据 | 本仓只保存 `L1-artifact` 正式签发的消费引用及 handoff 关系,不自造通用 Artifact ref。 | 随正式 handoff 建立、拒绝或失效而变化;Artifact 正文生命周期不归本仓。 | F-MI-012;BR-MI-019/020 |
| `D-MI-025` | Evidence body、key / vulnerability database 与 Artifact body / version / lineage / baseline 正文 | 禁止保存正文 | 供应链后端与通用 Artifact truth 不属于本仓,不得保存为本地领域正文。 | 不进入本仓领域 truth 生命周期。 | NG-MI-008/009/012;BR-MI-020 |

节点停审:C-MI-4 的 provenance / eligibility truth、policy / evidence snapshots、evidence / Artifact refs 和禁止正文均已分类;具体 BOM / scan / signature kind、Artifact schema 和真实 evidence 均未伪造。`gate_status = pass`。

### 7.6 C-MI-5 供给与可实例化入口数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-026` | Image supply availability 与变化历史 | 真相数据 | 镜像供给的 publish / replace / rollback / retire / availability 事实由本仓拥有正式真相。 | 通过显式供给变化形成完整历史;rollback / retire 不删除或改写旧事实。 | F-MI-013;BR-MI-021/022/025 |
| `D-MI-027` | Instantiable entry binding | 真相数据 | variant、pinned digest / ref 与供给入口语义的绑定由本仓拥有正式真相。 | 随可用版本建立、替代、回滚或退役而显式变化;不等同下游实例生命周期。 | F-MI-014;BR-MI-021~023 |
| `D-MI-028` | Handoff attempt 与 consumer gap | 真相数据 | 本仓发起 / 响应的入口交接 attempt 及 contract / confirmation gap 由本仓拥有派生真相。 | 随交接尝试形成 confirmed / rejected / pending / unknown 类语境;外部结果不反写 availability。 | F-MI-015;BR-MI-024/025 |
| `D-MI-029` | External consumer confirmation 安全快照 | 快照数据 | 下游 confirmation / consumption truth 不属于本仓,若合同允许只保留安全摘要快照。 | 随下游正式结论形成或更新,不形成容器 / observed truth 的第二生命周期。 | F-MI-015;BR-MI-023~025 |
| `D-MI-030` | Container lifecycle、runtime live state、health / observed consumption 正文 | 禁止保存正文 | 实例化、运行和 observed body 不属于镜像供给 truth,本仓不得保存为领域正文。 | 不进入本仓领域 truth 生命周期。 | NG-MI-003/006/010;BR-MI-023/025 |

本节点复用 D-MI-016 的 pinned registry candidate ref 和 D-MI-024 的正式 Artifact ref,不在 C-MI-5 重复定义第二份引用数据。

节点停审:C-MI-5 的 availability、entry、handoff gap truth、consumer snapshot 和 container / live body 红线均已分类;local supply、handoff 与 observed consumption 保持三层分离。`gate_status = pass`。

### 7.7 外围增强数据

| ID | 数据项 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| `D-MI-E01` | 获准架构 / 收缩 variant 派生事实 | 真相数据 | 仅在增强正式启用后,对应镜像域派生和供给差异由本仓拥有真相。 | 随显式 variant revision 建立 / 退出;未启用时不形成当前数据。 | F-MI-E01/E02;BR-MI-E01/E02 |
| `D-MI-E02` | Hardened base image ref | 引用数据 | 本仓只保存对未来获准加固基础镜像的 pinned 引用。 | 随外部 ref 获准、替代或失效而变化;不拥有 Sandbox truth。 | F-MI-E04;BR-MI-E01/E02 |
| `D-MI-E03` | Supply usage summary | 快照数据 | 下游使用 truth 不属于本仓,增强启用后只可保留不反写的安全摘要。 | 随获准摘要更新,不形成 observed truth 或自动改变本仓供给。 | F-MI-E05;BR-MI-E03 |
| `D-MI-E04` | Architecture platform、governance / Sandbox 与 usage observed body | 禁止保存正文 | 外围增强涉及的外部平台 / policy / observed 正文仍不属于本仓。 | 不进入本仓领域 truth 生命周期。 | F-MI-E01~E05;BR-MI-E01~E03 |

外围停审:四类数据只在增强启用时形成,未提前固定架构枚举、特殊 Role、Sandbox 对象或 observed schema。`gate_status = pass`。

### 7.8 正式数据归属表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `D-MI-001` 镜像域定义 | 真相数据 | Image family / variant / persona 镜像定义由本仓拥有真相。 | 显式建立、修订或退役,历史不原地覆盖。 |
| `D-MI-002` Mapping 来源关联与有效性结论 | 真相数据 | 来源关联和本仓有效性判断由本仓拥有派生真相。 | 重新判定形成新结论,保留原语境。 |
| `D-MI-003` Role-image mapping 稳定消费快照 | 快照数据 | mapping truth 外置,本仓只保留稳定消费快照。 | 随正式来源变化形成新快照,不反写上游。 |
| `D-MI-004` Role / mapping source ref | 引用数据 | 本仓只保存正式来源引用关系。 | 随绑定建立、变化或失效而变化。 |
| `D-MI-005` Role / mapping 正文 | 禁止保存正文 | 方法资产正文不属于本仓。 | 不进入本仓领域生命周期。 |
| `D-MI-006` Pinned assembly baseline | 真相数据 | 组件、extras 与 seed placement / pin 绑定由本仓拥有真相。 | 随 revision 建立和替代,旧基线不被改写。 |
| `D-MI-007` Variant revision | 真相数据 | 镜像域 revision 由本仓拥有真相。 | 显式新增、替代或退役,历史保留。 |
| `D-MI-008` Derivation 关系与差异依据 | 真相数据 | Base -> variant 派生事实由本仓拥有真相。 | 随 revision 建立,不原地重算覆盖。 |
| `D-MI-009` Component / base / extras release refs | 引用数据 | 本仓只保存正式 release 引用。 | 随 pin 绑定建立、替代或失效而变化。 |
| `D-MI-010` Seed template refs | 引用数据 | 本仓只保存模板身份 / placement 所需引用。 | 随装配绑定变化,正文生命周期外置。 |
| `D-MI-011` Secret 与 runtime live input body | 禁止保存正文 | live / sensitive build input 不属于镜像资产 truth。 | 不进入本仓领域生命周期。 |
| `D-MI-012` Component source / contract / seed 外部正文 | 禁止保存正文 | 外部 source / contract / semantic truth 不属于本仓。 | 不进入本仓领域生命周期。 |
| `D-MI-013` Build intent | 真相数据 | 构建意图及来源关联由本仓拥有真相。 | 接受、拒绝或挂起形成独立结论。 |
| `D-MI-014` Build attempt / outcome | 真相数据 | attempt 与本仓结果分层由本仓拥有真相。 | 每次尝试独立形成,不覆盖旧结果。 |
| `D-MI-015` Build input snapshot | 快照数据 | 上游 truth 外置,本仓为一次 attempt 固定输入快照。 | attempt 时固定,上游后续变化不改写。 |
| `D-MI-016` Builder / registry candidate refs | 引用数据 | 本仓只保存外部执行 / 存储对象引用。 | 随交接、候选形成或 ref 失效而变化。 |
| `D-MI-017` Trigger authority / event source refs | 引用数据 | 本仓只保存构建来源引用,不拥有 event truth。 | 随 authority / source 获准或失效而变化。 |
| `D-MI-018` Build infrastructure body | 禁止保存正文 | scheduler / builder / registry 正文不属于本仓。 | 不进入本仓领域生命周期。 |
| `D-MI-019` Image digest / provenance binding | 真相数据 | 候选 digest 与完整来源链绑定由本仓拥有真相。 | 候选形成时建立,后续不改写原绑定。 |
| `D-MI-020` Gate evaluation / image eligibility | 真相数据 | 资格判断由本仓拥有派生真相。 | 随候选 / 适用语境形成可区分结论。 |
| `D-MI-021` Policy / gate applicability snapshot | 快照数据 | policy truth 外置,本仓只保留适用性安全快照。 | 随 authority 变化形成新快照。 |
| `D-MI-022` Evidence safe conclusion snapshot | 快照数据 | evidence truth 外置,本仓只保留安全结论快照。 | 随正式结论变化形成新快照。 |
| `D-MI-023` Evidence refs | 引用数据 | 本仓只保存正式适用 evidence 引用。 | 随 gate 绑定、替代或失效而变化。 |
| `D-MI-024` Artifact handoff / consumer ref | 引用数据 | 本仓只保存 `L1-artifact` 正式引用及 handoff 关系。 | 随正式 handoff 建立、拒绝或失效而变化。 |
| `D-MI-025` Evidence / key / vulnerability / Artifact body | 禁止保存正文 | 供应链后端和通用 Artifact truth 不属于本仓。 | 不进入本仓领域生命周期。 |
| `D-MI-026` Image supply availability / history | 真相数据 | 镜像供给可用性及变化历史由本仓拥有真相。 | 显式 publish / replace / rollback / retire,历史保留。 |
| `D-MI-027` Instantiable entry binding | 真相数据 | variant / pinned ref 与供给入口绑定由本仓拥有真相。 | 随 availability 显式变化,不等同实例生命周期。 |
| `D-MI-028` Handoff attempt / consumer gap | 真相数据 | 本仓交接 attempt 与 gap 由本仓拥有派生真相。 | 随交接形成独立语境,不反写 availability。 |
| `D-MI-029` Consumer confirmation snapshot | 快照数据 | 下游 confirmation truth 外置,本仓只保留获准安全摘要。 | 随下游正式结论更新,不形成第二 truth。 |
| `D-MI-030` Container / runtime / observed body | 禁止保存正文 | 实例化、运行和 observed 正文不属于本仓。 | 不进入本仓领域生命周期。 |
| `D-MI-E01` 架构 / 收缩 variant 派生事实 | 真相数据 | 增强启用后由本仓拥有相应镜像域派生 truth。 | 随显式 revision 变化;未启用时不存在。 |
| `D-MI-E02` Hardened base ref | 引用数据 | 本仓只保存获准加固基础镜像引用。 | 随 ref 获准、替代或失效而变化。 |
| `D-MI-E03` Supply usage summary | 快照数据 | 下游 usage truth 外置,本仓只保留安全摘要。 | 随获准摘要更新,不反写供给。 |
| `D-MI-E04` 外围 external / observed body | 禁止保存正文 | 外围平台、policy、Sandbox 和 observed 正文不属于本仓。 | 不进入本仓领域生命周期。 |

### 7.9 数据覆盖与跨节点审计

| 能力节点 | 核心功能 | 主要数据项 | 四类覆盖 | 结果 |
|---|---|---|---|---|
| C-MI-1 | F-MI-001~003 | D-MI-001~005 | truth / snapshot / ref / forbidden | 全覆盖 |
| C-MI-2 | F-MI-004~006 | D-MI-006~012 | truth / ref / forbidden | 全覆盖;不强造无需要的 snapshot |
| C-MI-3 | F-MI-007~009 | D-MI-013~018 | truth / snapshot / ref / forbidden | 全覆盖 |
| C-MI-4 | F-MI-010~012 | D-MI-019~025 | truth / snapshot / ref / forbidden | 全覆盖 |
| C-MI-5 | F-MI-013~015 | D-MI-026~030 + 复用 D-MI-016/024 | truth / snapshot / ref / forbidden | 全覆盖且无重复 ref truth |
| 外围 | F-MI-E01~E05 | D-MI-E01~E04 | 四类均有 | 条件覆盖 |

| 跨节点检查 | 结果 |
|---|---|
| 是否存在功能 / 规则所需数据没有归属 | 否 |
| 是否存在无功能、规则或边界来源的数据项 | 否 |
| 同一数据是否被多个节点重复定义 truth | 否;C-MI-5 显式复用 candidate / Artifact refs |
| snapshot 是否被误写成上游 truth | 否 |
| ref 是否被误写成正文或正式上游类型 | 否 |
| 本仓派生结论是否误设为第五种正式数据类型 | 否;全部归真相数据 |
| template / seed / build output 是否与 live state 混写 | 否 |
| 是否出现字段、表、索引、事务、缓存、outbox 或存储产品 | 否 |
| 是否伪造 Artifact / evidence / consumer 正向事实 | 否 |

### 7.10 历史数据差异审计

| historical item | 判定 | 当前落点 |
|---|---|---|
| `BaseImageRelease` / `RoleImageRelease` | 废弃旧对象和固定状态机,保留被校准后的业务概念 | D-MI-001/006~008/026~027 |
| `ImageBOM` | 不作为当前本仓 truth | 条件型 D-MI-022/023/025;Q-MI-004 |
| `CompatibilityReport` | owner / applicability pending,不建立本地 report truth | 若正式适用只进入 D-MI-022/023;MI-UP-002 |
| `role / semver / digest / extras bundle` 字段图 | 字段级污染,不继承 | 需求层只保留对应数据项;字段后移 02/03 |
| built -> scanned -> signed -> published / retired | 固定实现状态机废弃 | D-MI-014/020/026 分域表达结果,不预设转移图 |
| retention / archive 时长 | 无 authority,废弃 | 正式表只写生命周期口径,无时长 |
| draft `ArtifactBinding` | 修改为正式外部 ref 关系,不自造类型 | D-MI-024;MI-UP-007 |
| draft `ImageOutboxRecord` | 无 outbound event authority,不进入数据项 | MI-UP-009;后续不得从本 Step 推导 |

## 8. 回填草稿

正式 00 §11 使用 §7.8 四列表,按 C-MI-1~5 分组呈现 D-MI-001~030,外围 D-MI-E01~E04 单列。正式正文应保留分类判断说明和“物理 materialization 不转移语义 truth owner”的短注,但不回填逐节点停审、旧对象差异或候选对象名推演。

正式章节必须明确:

1. 正式数据类型只有真相 / 快照 / 引用 / 禁止保存正文四类。
2. eligibility、mapping validation、handoff gap 是本仓派生真相;其外部输入仍只是 snapshot / ref。
3. build input snapshot 在 attempt 时固定,不会随上游后续变化更新。
4. retention、字段、schema、表结构、缓存与归档实现不在需求层决定。

## 9. 待确认事项

| ID | 受影响数据 | 当前归属上限 |
|---|---|---|
| `MI-UP-001` | D-MI-027~029 | exact entry / confirmation schema pending;只定义 truth / snapshot / gap 分类 |
| `MI-UP-002` | D-MI-009/012/022/023 | member release / compatibility owner pending;不建立 report truth |
| `MI-UP-003` | D-MI-002~004 | mapping exact snapshot / ref surface pending |
| `MI-UP-004` | 所有 shared ref / conclusion | 不自造 Core image-specific type |
| `MI-UP-005` | D-MI-013/017 | event family / schema pending;nightly intent truth不受影响 |
| `MI-UP-006` | D-MI-006/010/012 | seed owner pending;placement / ref current,semantic body external |
| `MI-UP-007` | D-MI-024~027 | image handoff schema pending;不得自造 Artifact ref / version / lineage |
| `MI-UP-008` | D-MI-E02/E04 | future only |
| `MI-UP-009` | 数据项排除 | 无 outbox / outbound event data authority |
| `Q-MI-001~002` | D-MI-E01 | enhancement data not active |
| `Q-MI-003` | D-MI-016/018/023/025 | 产品 backend body 不进入 domain truth |
| `Q-MI-004` | D-MI-020~025 | evidence kind / body owner pending;通用分类 current |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否完整覆盖真相 / 快照 / 引用 / 禁止保存正文四类 | pass |
| 每条数据是否有归属判断和需求层生命周期口径 | pass |
| 每条核心数据是否可回指能力、功能或规则 | pass |
| C-MI-1~5 是否逐节点完成数据停审 | pass |
| 是否存在重复 truth、分类冲突、孤儿或正文越界 | no |
| 是否严格区分 template / seed / build output 与 live state | pass |
| 是否滑入字段、表结构、索引、事务、缓存或存储实现 | no |
| historical / pending / readiness 污染是否受控 | pass |

`gate_status = pass`;允许创建 Step 12,不得跳到 Step 13 或修改正式 00。
