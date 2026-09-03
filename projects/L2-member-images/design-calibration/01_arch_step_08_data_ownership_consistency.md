# Step 8. 数据所有权与一致性策略

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `data_ownership_consistency` | pass | 5 个架构单元的 truth / snapshot / projection / reference / forbidden body 已逐项停审;强一致、最终一致和失败挂起口径无冲突 | 进入 Step 9 关键交互与通信方式 | `01_arch_step_03_responsibility_boundary.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_07_dependency_direction.md`;正式 00 §11 |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 3 / 5 / 7、架构 SOP Step 8 与书写规范 §4.9。
- [x] 先按正式 00 D-MI-001~030 确认归属,再讨论一致性。
- [x] 按 BC-MI-01~05 逐个划分 truth、snapshot / projection、reference 和 forbidden body / write。
- [x] 每个架构单元完成后执行数据所有权停审。
- [x] 区分本仓派生 truth 与外部 safe conclusion / snapshot。
- [x] 为强一致、最终一致、引用有效性和边界一致分别定义失败上限。
- [x] 形成补偿 / 挂起原则,不写事务、outbox、重试算法或 schema。
- [x] 执行双真相、projection 反写、正文入仓、强弱一致误用和 pending 审计。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 3 | 哪些语义由本仓正式拥有、哪些明确排除 |
| Step 5 | BC-MI-01~05 和 LS-MI-01~04 的数据语义位置 |
| Step 7 | 外部数据必须经过 ref / runtime / event / adapter / fake seam 的依赖规则 |
| 正式 00 §11 | D-MI-001~030 与 D-MI-E01~E04 的四类需求归属 |
| 正式 00 BR-MI-001~025 | Pin、history、candidate、gate、availability 的不变量 |
| MI-UP / Q register | Snapshot / ref 可成立的 exact contract 与 current scope 上限 |

## 3. SOP 问题回答

1. 哪些数据由本仓拥有正式真相?

   回答:镜像域 definition / source binding conclusion、assembly baseline / revision / derivation、build intent / attempt / local outcome、candidate / digest / provenance binding、gate evaluation / image eligibility、availability history、instantiable entry binding 与 local handoff / consumer gap 均由本仓拥有。

2. 哪些只是快照、投影或引用?

   回答:Mapping consumption、attempt input、policy / gate applicability、evidence safe conclusion、consumer confirmation 是 snapshot;source trace / read model / maintenance summary 是 projection;Role / component / seed / execution / registry / evidence / Artifact / trigger authority 是 reference。

3. 哪些正文 / truth 明确不拥有?

   回答:Role / mapping body、component source / contract、seed semantic body、secret / live state、scheduler / builder / registry job / log、policy / evidence / key / vulnerability data body、Artifact version / lineage / baseline / body、container / health / observed consumption 均不拥有。

4. 哪些关系必须强一致?

   回答:Definition 与 source validity、revision 与完整 assembly baseline、attempt 与 intent / immutable snapshot、candidate 与 digest / provenance、eligibility 与 candidate / applicable gates、availability 与 pinned entry 在各自本地决策语境中必须同时成立或明确失败,不得留下 partial positive state。

5. 哪些关系可以最终一致?

   回答:外部 source snapshot 更新、registry / evidence / Artifact / consumer 状态承接、派生 trace / projection / maintenance summary 可最终一致;但旧值必须携带来源 / 时效 / gap 语义,不能被当成新 positive decision 的默认依据。

6. 失败时如何约束、补偿或挂起?

   回答:核心不变量失败则不形成 positive state;外部 relation 失配则进入 stale / invalid / pending / blocked / unknown / gap;恢复通过新 revision、attempt、evaluation 或 availability transition 显式推进,不删除或改写旧历史;projection 可重建但不得补写 truth。

7. 每个单元和跨边界是否已停审?

   回答:BC-MI-01~05 均已通过 truth 唯一、projection 不反写、body 不保存和 consistency 清晰检查;跨边界未发现双真相或一致性策略冲突。

## 4. 当前材料问题诊断

| 候选数据口径 | 问题 | 当前处理 |
|---|---|---|
| Manifest 同时保存 Role / component / policy / memory 正文 | 本地便利变成多域正文副本 | 只保存本仓 binding、ref、snapshot 和 placement 语义 |
| Registry catalog 作为 image availability truth | Backend projection 和 mutable tag 反写领域 | Registry 只提供 immutable ref / outcome;availability 归本仓 |
| Build success 同时写 candidate / eligible / available | 三个成立条件被压成单一状态 | 分属 BC-MI-02 / 03 / 04 的独立本地决策语境 |
| Artifact ref 缺失时本地生成一个 | 形成 Artifact 第二 truth | 保留 MI-UP-007 gap,不伪造 ref |
| Consumer launch 失败将镜像标为 unavailable | 下游环境故障反写 local supply | 记录 consumer gap,availability 单独判断 |
| Projection / cache 最新值用于补齐 missing source | 最终一致影子成为业务 fallback | Source 不可验证时新 positive path fail closed |
| Retry 覆盖旧 attempt | 丢失失败与不确定性历史 | 新 attempt 追加,旧 outcome 不改写 |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前结论 |
|---|---|---|
| 数据分类 | “manifest / metadata / logs”技术分类 | 正式 truth / snapshot-projection / reference / forbidden body |
| Candidate | 外部 job 或 registry record | 本仓 outcome + digest / provenance binding,外部对象只 ref |
| Gate | 复制 reports 或布尔 pass | 本仓 evaluation truth + external safe conclusion snapshot / ref |
| Artifact | 镜像 release 的同义词 | 独立 owner 的 formal ref / gap |
| Consumer | 供给状态的一部分 | 外部 truth snapshot / gap,不反写 availability |
| 一致性 | 全链“最终一致” | 本地不变量强一致,跨 owner 与派生关系有界最终一致 |
| 恢复 | 覆盖旧状态 | 显式新语境,history-preserving |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将外部正文复制为本仓完整快照 | 离线读取方便 | 形成第二 truth、泄露 live / sensitive body | 不采用 |
| 全链单一强一致 | 语义简单 | 跨多个 owner / backend 不现实且会形成共享事务假设 | 不采用 |
| 所有关系最终一致 | 可用性高 | Candidate / eligibility / availability 会出现 partial positive | 不采用 |
| 本地决策强一致 + 跨域 ref / snapshot 有界最终一致 | 守住不变量且隔离外部失败 | 需要显式 stale / gap 语义 | 采用 |
| 以回滚删除历史恢复 | 表面干净 | 破坏审计与 provenance | 不采用;使用新 transition / superseding context |

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 镜像域 definition 与 mapping source validity conclusion | 正式真相数据 | 对应 D-MI-001/002,由 BC-MI-01 拥有。 | Mapping 正文和 source truth 不因本地 conclusion 转移。 |
| Assembly baseline、variant revision、derivation / diff rationale | 正式真相数据 | 对应 D-MI-006~008,由 BC-MI-01 拥有。 | 外部 component / template 内容物理进入镜像不转移语义 owner。 |
| Build intent、attempt 与 local outcome | 正式真相数据 | 对应 D-MI-013/014,由 BC-MI-02 拥有。 | External job success 只是输入,不直接成为 local candidate。 |
| Candidate digest / provenance binding | 正式真相数据 | 对应 D-MI-019,由 BC-MI-03 拥有来源连续性语义。 | Physical image layers / registry storage 由技术边界承载,不替代 binding truth。 |
| Applicable gate evaluation / image eligibility | 正式真相数据 | 对应 D-MI-020,由 BC-MI-03 拥有派生结论。 | Policy / evidence truth 仍在外部 owner。 |
| Supply availability / history、instantiable entry、handoff gap | 正式真相数据 | 对应 D-MI-026~028,由 BC-MI-04 拥有。 | Entry / gap 不表达 container / consumer / product readiness。 |
| Mapping stable consumption snapshot | 快照 / 投影数据 | 对应 D-MI-003,由 BC-MI-05 承接。 | 不得编辑、补齐或枚举上游 mapping。 |
| Immutable build input snapshot | 快照 / 投影数据 | 对应 D-MI-015,由 BC-MI-02 在 attempt 语境固定。 | Snapshot 后不随外部 source 更新;新输入产生新 attempt context。 |
| Gate applicability / evidence conclusion snapshots | 快照 / 投影数据 | 对应 D-MI-021/022,由 BC-MI-05 承接并服务 BC-MI-03。 | Safe conclusion 本地存在不等于拥有 policy / evidence truth。 |
| Consumer confirmation snapshot | 快照 / 投影数据 | 对应 D-MI-029,仅在正式合同允许时由 BC-MI-05 承接。 | MI-UP-001 未闭口时不形成 positive confirmation snapshot。 |
| Derived source trace / read view / maintenance summary | 快照 / 投影数据 | 从本仓 truth 与受控 refs 派生,由 BC-MI-05 维护。 | 可重建、可滞后,不得成为核心写源。 |
| Role / mapping source refs | 引用关系数据 | 对应 D-MI-004,只保存正式来源 binding。 | 不包含 RoleDefinition / mapping body。 |
| Component / base / extras / seed template refs | 引用关系数据 | 对应 D-MI-009/010,只保存 pin / identity / placement binding。 | 不包含 source、tool contract、template semantic body。 |
| Builder / registry / trigger authority refs | 引用关系数据 | 对应 D-MI-016/017,只保存外部执行 / storage / authority 关联。 | 不拥有 scheduler / builder / registry lifecycle。 |
| Evidence / Artifact refs 与 handoff relation | 引用关系数据 | 对应 D-MI-023/024,只保存正式引用或 gap。 | Q-MI-004 / MI-UP-007 未闭口时不生成伪 ref。 |
| Role / mapping body | 明确不拥有的正文 / 真相 | 对应 D-MI-005,归 Method Library。 | 禁止保存或以本地缓存改成 source truth。 |
| Secret、live memory、checkpoint、workspace live content | 明确不拥有的正文 / 真相 | 对应 D-MI-011,归运行 / 安全 owner。 | 不得进入 definition、snapshot、candidate 或 entry。 |
| Component source / contract / seed semantic body | 明确不拥有的正文 / 真相 | 对应 D-MI-012,归各语义 owner。 | Materialization 只产生镜像内容,不产生 semantic ownership。 |
| Scheduler / builder / registry job / log / backend body | 明确不拥有的正文 / 真相 | 对应 D-MI-018,归 external infrastructure。 | 本仓只持 ref 和 conservative outcome。 |
| Policy / evidence / key / vulnerability / Artifact body / lifecycle | 明确不拥有的正文 / 真相 | 对应 D-MI-025,归正式 authority / backend / Artifact owner。 | 本仓 eligibility 不能成为这些外部事实的第二写源。 |
| Container lifecycle、runtime live state、health / observed consumption | 明确不拥有的正文 / 真相 | 对应 D-MI-030,归 Member Service / Runtime / Observability。 | 下游状态不得成为 availability 变更依据的隐式 truth。 |

### 7.2 按架构单元的数据所有权

| 架构单元 | 拥有的 truth | Snapshot / projection / reference | Forbidden body / write |
|---|---|---|---|
| BC-MI-01 | Definition、source validity、assembly baseline、revision / derivation | Mapping snapshot / ref、component / seed refs | Role / mapping / component / seed body;live input;mutable fallback |
| BC-MI-02 | Intent、attempt、local outcome、candidate formation relation | Immutable input snapshot、builder / registry / trigger refs | Job / log body;incomplete snapshot;adapter success as candidate |
| BC-MI-03 | Digest / provenance binding、gate evaluation、image eligibility | Policy / evidence snapshots、evidence / Artifact refs | Policy / approval / evidence / Artifact body;missing gate as pass |
| BC-MI-04 | Availability history、entry binding、local handoff / consumer gap | Immutable registry / Artifact refs、consumer snapshot | Container / health / observed body;consumer failure as local truth |
| BC-MI-05 | Ref / snapshot intake validity 与 derived gap / trace conclusion | 全部 LS-MI-01~04 影子结构 | 创建 core positive state;projection / fake / cached default 反写 |

### 7.3 一致性策略

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Definition 与 source validity 建立 | 正式真相 ↔ snapshot / ref | 本地决策强一致 | 不形成 resolved definition,保留 missing / stale / conflict / gap | Source binding 是定义成立前提。 |
| Variant revision 与完整 assembly baseline | 正式真相 ↔ reference | 本地决策强一致 | Revision 不进入 buildable 语境,保持 incomplete / blocked | 所有必要 pin 必须共同成立。 |
| Intent、attempt 与 immutable snapshot | 正式真相 ↔ snapshot | 本地决策强一致 | 不交接 execution;保留 rejected / pending / blocked | Attempt 不能脱离唯一输入语境。 |
| External execution outcome 到 candidate | Reference ↔ 正式真相 | 引用有效性 + 本地决策强一致 | Failed / unknown / invalid ref 时无 candidate / digest | Adapter success 不是 candidate。 |
| Candidate 与 digest / provenance | 正式真相 ↔ 正式真相 | 本地决策强一致 | Candidate 不进入 eligibility;记录 provenance gap | 输出和来源链不可分离。 |
| Eligibility 与 applicable gates | 正式真相 ↔ snapshots / refs | 本地决策强一致 | 任一 applicable input missing / failed / unverifiable 即 blocked / pending | 不允许静默绕 gate。 |
| Eligibility 与 Artifact handoff | 正式真相 ↔ reference | 分域最终一致 | 保留 image eligibility 与 Artifact gap 两个状态,不互相伪写 | 两域各有 owner。 |
| Availability transition 与 pinned entry | 正式真相 ↔ 正式真相 / ref | 本地决策强一致 | 不产生 partial available / mutable entry;变化失败显式 | Supply 和可消费入口必须一致。 |
| Local availability 与 consumer confirmation | 正式真相 ↔ external snapshot | 分域最终一致 | 记录 handoff / consumer gap,不回滚或提升 local truth | Consumer 生命周期独立。 |
| External source snapshot 更新 | External truth ↔ snapshot | 有来源的最终一致 | 标记 stale / unavailable,新 positive decision 挂起 | 旧历史仍可追,新语境不能用默认值。 |
| Core truth 到 derived trace / view | 正式真相 ↔ projection | 最终一致 | Projection 可重建 / 保留滞后标记,不得反写 truth | Read / maintenance failure 不破坏 core truth。 |
| Revision / attempt / evaluation / availability 历史 | 正式真相 ↔ 正式真相 | 历史连续性约束 | 以新语境 supersede / rollback,不删除或覆盖旧事实 | 审计与恢复需要完整历史。 |

### 7.4 失败约束与补偿原则

| 失败类别 | 架构处理 | 禁止补偿 |
|---|---|---|
| External source unavailable / stale | 保留既有可追历史;阻断受影响新 decision | Hardcode / latest / copied body / cached default |
| Partial local invariant | 整个 positive decision 不成立,显式 failed / blocked | 写 partial candidate / eligibility / available |
| Adapter timeout / unknown | 保留 attempt 和 unknown,后续新 attempt 解释恢复 | 推断成功、复用无来源 digest |
| Ref invalid / revoked | 标记引用失效,挂起依赖路径并保留原 binding history | 把 ref body 复制到本仓成为永久 truth |
| Projection lag / rebuild failure | 继续保护 truth,标记 view lag / unavailable | 从 projection 回填核心状态 |
| Artifact / consumer gap | 分层记录 gap,等待 owner-side formal result | 自造 formal ref、launch、confirmation 或 readiness |
| Rollback / retire | 追加显式 availability transition 并指向既有 eligible entry | 删除 candidate、重写 digest 或抹去旧 availability |

### 7.5 数据所有权停审

| 单元 | Truth 唯一 | Projection 禁止反写 | External body 禁止保存 | 一致性清楚 | gate_status |
|---|---|---|---|---|---|
| BC-MI-01 | pass | pass | pass | pass | pass |
| BC-MI-02 | pass | pass | pass | pass | pass |
| BC-MI-03 | pass | pass | pass | pass | pass |
| BC-MI-04 | pass | pass | pass | pass | pass |
| BC-MI-05 | pass | pass | pass | pass | pass |

### 7.6 跨数据边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 双真相 | pass | Mapping、component、policy / evidence、Artifact、consumer truth 均外置。 |
| Projection 反写 | pass | Derived trace / view / cache 只能读取 / 重建。 |
| Ref 正文入仓 | pass | 所有 ref 都有 body / lifecycle 禁止项。 |
| Strong consistency 误用 | pass | 只约束单一本地 decision context,不要求跨仓共享事务。 |
| Eventual consistency 误用 | pass | Candidate / eligibility / availability 不允许 partial eventual positive。 |
| 补偿冲突 | pass | 恢复通过新语境 / transition,不覆盖历史。 |
| Static / live | pass | Live / secret / observed body 全部 forbidden。 |
| Pending / fabricated fact | pass | 无伪 Artifact ref、evidence、consumer confirmation 或 readiness。 |

### 7.7 数据边界说明

本仓物理构建和存储镜像内容,并不因此获得 component、template、policy、evidence 或 Artifact 的语义 truth。Snapshot 用于固定一次判断语境,reference 用于跨 owner 回链,projection 用于只读解释;三者都不能替代 external truth。强一致只适用于本仓单个正式 decision 的不变量,不推导跨仓共享事务。Exact schema、事务机制、存储、缓存、outbox、retention 和重试算法留给后续设计。

## 8. 回填草稿

正式 01 §9 回填 §7.1 数据归属、§7.2 单元 owner、§7.3 一致性策略、§7.4 失败上限和 §7.7 边界说明。正式章以架构数据类别为主,不展开 D-MI-001~030 的字段或存储实现。

## 9. 待确认事项

- MI-UP-001~007 分别限制 consumer snapshot、member ref、mapping snapshot、Core schema、event source、seed refs 与 Artifact refs 的 exact shape。
- MI-UP-008 / Q-MI-001~003 对应 enhancement 数据未激活,不进入 current truth set。
- Q-MI-004 限制 gate / evidence snapshot 的具体 kind / priority,但不改变 fail-closed 一致性。
- MI-UP-009 继续排除 outbound event / outbox truth。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 四类正式数据归属是否完整 | pass |
| BC-MI-01~05 是否逐个停审 | pass |
| 强一致 / 最终一致是否绑定具体关系和失败上限 | pass |
| 是否无双真相、projection 反写或正文入仓 | pass |
| 是否未写表、字段、事务、outbox、cache 或算法 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 9,不得跳到 Step 10 或修改正式 01。
