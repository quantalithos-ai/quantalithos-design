# 01 架构校准 Step 15：ADR 与需求追溯

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 14 completed / pass
> 本步目的：把已停审架构决定连接到正式需求、约束、风险和取舍来源，逐项停审 ADR 候选并证明不存在孤儿结论

## 1. Step 内计划

- [x] 读取 flow、台账、Step 1~14、正式 00 §2~16 和架构规范 4.16 / 4.17。
- [x] 盘点 C / US / FR / BR / D / IB / NFR / AC / VF / R / Q 编号族及其架构承接位置。
- [x] 核对现有 ADR-0004 / 0005 / 0007 的状态、适用范围和污染风险。
- [x] 按长期影响、架构层级和独立理解价值筛选 ADR；排除产品、协议、schema、数字和 pending 合同。
- [x] 对每个关键架构决定执行“值得长期保留 / 来源明确 / 未新增结论”停审。
- [x] 建立正式需求结论到具体架构结果和正式章节位置的追溯矩阵。
- [x] 执行需求孤儿、架构来源孤儿、ADR 误入、取舍缺来源和开放合同伪闭口审计。
- [x] 形成正式 §16 / §17 回填草稿和 gate 自检。

## 2. 输入效力与 ADR 来源审计

| 输入 | 效力 | 本步结论 |
|---|---|---|
| 正式 `00-需求文档.md` | direct baseline | 所有追溯从当前正式需求编号族出发，不从旧 01 反推来源。 |
| Step 1~14 | stopped architecture results | 只有已停审结论可进入矩阵和 ADR 索引。 |
| `architecture/adr/0004-global-vs-project-member.md` | accepted upstream ADR | 可索引双层 Member 和 ProjectMember 执行粒度；本仓只持双锚，不取得 L1 truth。 |
| `architecture/adr/0005-member-image-per-role.md` | accepted upstream ADR with narrowed applicability | 只承接预构建供给与 pinned 资产原则；Role 查询流程、Docker、tag、工具清单和旧性能数字被当前正式 00 / Images 边界裁剪。 |
| `architecture/adr/0007-checkpoint-persistence-in-process.md` | accepted but out of scope | 证明 checkpoint truth 不归本仓；不进入本项目 ADR 索引。 |
| sibling 进行中 01 | pending | 不作为 ADR 或追溯来源；只有双方正式停审合同才能关闭 Q-MS。 |
| 旧正式 01 / README / draft | historical / discussion | 只用于污染审计，不提供 ADR 状态、追溯来源或已完成证据。 |

## 3. SOP 问题回答

### 3.1 哪些决定值得沉淀为 ADR

进入标准是：决定长期约束 host truth owner、语义边界、跨仓依赖、数据归属、一致性或关键交互；后续读者需要单独理解其问题与代价。项目型双锚、独立 Host Truth Center、五类语义分离、ports / seam typing、ref / snapshot 边界、fail-closed qualification、不可变世代、local-first 一致性、三类交互和安全消费分层均满足。数据库、消息、RPC、语言、容器产品、字段、状态枚举、配置数字和开放合同不满足或尚未闭口，不能进入。

### 3.2 是否存在无需求来源的架构设计

没有。A1~A5 分别回指 C-MS-1~5；S1~S3 与 P1~P3 回指外部 owner、数据归属、接口依赖、NFR 和外围消费要求；十项机制均回指 HC-MS、BR-MS、NFR-MS、VF-MS 或 Step 11 取舍。部署三角色是同步受理、后台推进、信号维护和核心 / 外围隔离的架构承载结果，不是无来源实现拆分。

### 3.3 是否存在未被架构承接的核心需求

没有。C-MS-1~5、US-MS-001~015、FR-MS-001~012、BR-MS-001~050、D-MS-001~037、IB-MS-001~017、NFR-MS-001~020、AC-MS-001~039 和 VF-MS-001~009 均被主矩阵或反向覆盖审计承接。FR / US / D / IB 的 E01~E04 被演进、P3 / S3 和外围边界承接，不升级为核心前置。

### 3.4 哪些关系仍未闭环

Q-MS-001~011 对应的字段、协议、schema、route、adapter qualification、SDK target 和指标 authority 仍未闭环；它们已经被 §15 风险 / 待确认和 placeholder / fail-closed ceiling 承接，因此不是需求孤儿。候选架构决定尚无本项目专项 ADR 文件，正式 §17 只能标为“未建立”，不得伪造 Accepted 或文件路径。

## 4. ADR 进入与排除判定

| 候选类别 | 是否进入 | 判定 |
|---|---|---|
| Host truth owner、语义分层、依赖、数据、一致性、交互 | 是 | 长期影响多个章节，替换会改变架构主线。 |
| 现有 ADR-0004 / 0005 的当前适用决定 | 是，按当前正式边界限定 | 有 accepted 来源且持续约束项目型主语与 pinned supply。 |
| ADR-0007 checkpoint persistence | 否 | 属 Process / Runtime truth；本仓只保留禁止拥有边界。 |
| Rust、PostgreSQL、Redis、Kafka、HTTP / gRPC、Docker / Kubernetes | 否 | deferred 产品 / 实现选择，无当前 authority。 |
| 具体 API、event、DTO、schema、route、receipt、配置 key / 数值 | 否 | Q-MS 未闭口或属于 02~04，不得提前升格。 |
| policy、非项目型宿主、warm pool、复杂调度、forensic backend | 否 | 无当前 FR、外围增强或必须重开需求。 |
| placeholder、fake、计划、测试或 readiness 状态 | 否 | 它们是边界 / 证据状态，不是长期架构决定。 |

## 5. ADR 索引结论

当前只有两个可关联的 accepted 上游 ADR；其余均是“值得建立专项 ADR”的已停审架构决定，没有对应 ADR 文件或 Accepted 状态。`未建立` 是非伪造状态，不是 ADR 编号，也不代表必须在本轮创建文件。

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| `ADR-0004` | GlobalMember 与 ProjectMember truth 分离，当前宿主以 ProjectMemberRef 为执行主语并以 GlobalMemberRef 为身份锚 | 防止身份锚、Workspace view 或未定义主语绕过项目执行边界 | 范围 / 职责 / 数据 owner / C-MS-1 | 已有 accepted 来源；本仓只关联双锚，不拥有或修改任一 L1 truth。 |
| `ADR-0005` | 镜像由专门供给方预构建并以 pinned 资产供给宿主装配 | 防止运行期安装和 member-service 取得镜像内容 / build truth | C-MS-2 / Images 边界 / qualification | 只索引当前正式边界仍承接的决定；旧 Role 查询流程、产品和数字不适用。 |
| 未建立 | 采用显式决定驱动的独立 Host Truth Center，并与 Runtime / Member / Work / backend truth 分离 | 防止宿主生命周期分散、多写源或由 observed / desired state 反向定义 | 职责 / 数据 owner / 备选方案 / 风险 | 决定仓的存在理由与写入 authority，值得未来专项 ADR 长期保留。 |
| 未建立 | A1~A5 五类宿主语义分离但共享同一 Host Truth Center | 防止决定、readiness、registration、health、cleanup 与 handoff 压成单一状态 | 限界上下文 / 一致性 / 关键交互 | 是语义边界决定，不表示五个服务或五套 truth。 |
| 未建立 | 非 Core / SDK 协作采用 Ports and Adapters，并保持 compile / runtime / event / ref / adapter / fake 分类 | 防止 sibling 源码依赖、共享模型和基础设施产品侵入核心 | 依赖方向 / 技术机制 / 演进 | 长期约束所有跨仓与后端接入，不能由局部 SDK 便利替换。 |
| 未建立 | 外部 truth 只经 typed ref、safe snapshot 与 freshness 承接，forbidden body 不入仓 | 防止外部正文复制、陈旧输入隐式放行和本地第二 truth | 数据所有权 / 安全 / qualification | 同时约束存储、查询、日志、handoff 和后续 schema。 |
| 未建立 | required 主语、supply、credential、binding 与 carrier 采用 fail-closed qualification | 防止 partial、unknown、pending 或 fallback 冒充 host ready | 装配 / 安全 / 风险 / 验收红线 | 该决定以安全边界优先于依赖故障时可用性，具有长期取舍价值。 |
| 未建立 | 宿主实例采用不可变世代、single-active fence 和迟到结果不覆盖 | 防止 restart 抹写历史、并发实例和旧反馈污染当前关联 | 生命周期 / 幂等 / 恢复 / 对账 | 持续影响实例、注册、session、健康与不可逆副作用。 |
| 未建立 | 本仓 truth 内部强一致，跨 owner 副作用与传播最终一致并以 gap / residual / reconciliation 收敛 | 防止跨 owner 伪原子和外围失败反写本地事实 | 数据一致性 / 交互 / 韧性 | 不锁定数据库、outbox 或消息产品，只锁正式完成边界。 |
| 未建立 | 同步权威接受、后台副作用推进和异步结果反馈三类交互分离 | 防止全同步伪完成或全事件化丢失即时拒绝与冲突判断 | 部署承载 / 关键交互 / 技术机制 | 决定运行职责和完成语义，不等于固定进程拓扑。 |
| 未建立 | safe projection 只读可重建，handoff 采用 body-free material 与 local / external outcome 分层 | 防止消费面成为第二写源以及 attempt 冒充 delivered / observed / accepted | 数据 / S3-P3 / 可观测 / 验收 | 长期保护消费隔离、数据最小化和证据诚实。 |

## 6. 架构决定逐项停审

| 架构决定 | 值得长期保留 | 来源明确 | 未新增未确认结论 | ADR 状态诚实 | 停审结论 |
|---|---|---|---|---|---|
| ADR-0004 双层 Member / 项目型双锚 | 是 | ADR-0004；C-MS-1；BR-MS-001~007 | 是 | accepted upstream | pass |
| ADR-0005 预构建 pinned supply（限定适用） | 是 | ADR-0005；FR-MS-003~005；Images 正式 00 | 是 | accepted upstream，适用范围已注明 | pass |
| 显式决定驱动的独立 Host Truth Center | 是 | AG-MS-001；C-MS-1~5；Step 3 / 11 | 是 | candidate_not_established | pass |
| 五类宿主语义分离 | 是 | RB-MS-001~005；Step 5 / 8 / 11 | 是 | candidate_not_established | pass |
| Ports / Adapters 与 seam typing | 是 | HC-MS-008；BR-MS-048；Step 7 / 10 | 是 | candidate_not_established | pass |
| typed ref / safe snapshot / forbidden body | 是 | D-MS-001~037；NFR-MS-008；Step 8 / 12 | 是 | candidate_not_established | pass |
| fail-closed qualification | 是 | BR-MS-008~017 / 046；NFR-MS-005 / 009；VF-MS-004 | 是 | candidate_not_established | pass |
| immutable generation / single-active fence | 是 | BR-MS-005 / 019~021 / 033~034；NFR-MS-013~016 | 是 | candidate_not_established | pass |
| local strong / external eventual consistency | 是 | BR-MS-037~045；NFR-MS-004 / 011 / 019；Step 8 | 是 | candidate_not_established | pass |
| sync / async / background separation | 是 | IB-MS 分类；NFR-MS-001~003；Step 6 / 9 / 10 | 是 | candidate_not_established | pass |
| read-only projection / body-free outcome layering | 是 | FR-MS-012 / E03~E04；NFR-MS-008 / 011 / 017~019 | 是 | candidate_not_established | pass |

## 7. 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 正式 00 §2~6；NG-MS-001~012 | 本仓是项目型成员执行宿主控制面，不拥有 L1、Member、Runtime、Images、Tools、Sandbox、Governance 或观测 truth | AG-MS-001~008、职责做 / 不做、BL-MS-001~008 和四语义层固定仓级边界 | §2~5 | 架构把需求范围转译为 owner、禁止边和上下文关系，而不是重复非目标。 |
| C-MS-1；US-MS-001~003；FR-MS-001~002；BR-MS-001~007；D-MS-001~007；IB-MS-001~003 | 项目型双锚、正式意图、显式决定、重复 / 冲突稳定且零隐式宿主 | A1、ADR-0004 约束、Host Truth Center、同步权威受理和本仓强一致决定 | §3~6；§9~13 | 同一承接链同时保护范围、决定唯一性和可追溯历史。 |
| C-MS-2；US-MS-004~006；FR-MS-003~005；BR-MS-008~017；D-MS-008~017；IB-MS-004~006 | 正式供给、承载、挂载、credential 与 binding 分项归责，required qualification 共同成立才 ready | A2 + S1 / S2 + P1 / P2、fail-closed qualification 和世代关联 | §4~11；§13 | 装配 owner、分项结果和整体 readiness 被分层，外部 truth 不转移。 |
| C-MS-3；US-MS-007~009；FR-MS-006~007；BR-MS-018~026；D-MS-018~024；IB-MS-007~009 | 可信注册、endpoint 与 Host Session 当前关联唯一，Member / Runtime truth 外置 | A3、single-active、Member / Runtime placeholder ports 和连续历史 | §4~10；§13 / 15 | 架构承接 acceptance 与外部请求 / run 的 owner 分离，exact 合同继续挂起。 |
| C-MS-4；US-MS-010~012；FR-MS-008~009；BR-MS-027~036；D-MS-025~030；IB-MS-010~012 | host / session / backend / unknown 健康分层，恢复 / 终止由显式决定驱动且新世代不抹旧史 | A4、generation fence、来源时点判断、hold / reconciliation | §4~10；§13 | 宿主恢复与 Runtime checkpoint / outcome 恢复保持两条 truth 链。 |
| C-MS-5；US-MS-013~015；FR-MS-010~012；BR-MS-037~045；D-MS-031~037；IB-MS-013~017 | 本地收束、cleanup / release、残留对账与事实交接可追溯，attempt / gap 不冒充外部完成 | A5 + S3 / P3、local-first 一致性、body-free handoff 和 outcome layering | §4~14 | 本地完成边界和 external cleanup / delivery / observed / accepted owner 被明确分开。 |
| US / FR / D / IB-MS-E01~E04；BR-MS-050 | 容量建议、预热、forensic 材料和聚合视图只能作为外围增强 | P3 / S3 只读派生、E3~E4 条件性演进和核心非前置约束 | §6；§9~15 | 外围需求已承接但不升级为当前核心能力或写源。 |
| BR-MS-046~050；正式 00 §12.3~12.5 | pending fail closed、owner 不迁移、依赖类型不转换、外围不反写 | Ports and Adapters、seam typing、禁止依赖表、placeholder 状态和 AR-MS 风险 | §5；§8；§11~15 | 跨节点规则被转译为依赖方向和正向 ceiling，而非具体协议。 |
| D-MS-001~037 / E01~E04；AC-MS-028~033 | truth、snapshot / projection、reference 与 forbidden body 必须分开且 owner 唯一 | A1~A5 / S3 truth、P1~P3 影子、十二类数据关系与一致性策略 | §6；§8~9；§11 / 13 | 每个数据类别都有写 owner、允许消费和禁止正文口径。 |
| NFR-MS-001~003；AC-MS-034 | 同步核心不能被长时副作用 / 外围任务无限阻塞，性能必须按阶段和 authority 测量 | 三运行角色、sync / async / background 分离和无伪数字性能口径 | §7；§10；§13~15 | 当前只形成可测结构，不虚构延迟、吞吐或容量目标。 |
| NFR-MS-004~006；AC-MS-035 | 依赖失效、迟到与 unknown 不回滚本地 truth、不丢历史、不生成竞争宿主 | local-first、degraded / gap / residual、generation fence 与 reconciliation | §9~14 | 可用性由明确非成功语义承接，不用 fail-open 换取表面成功。 |
| NFR-MS-007~009；AC-MS-036；VF-MS-002~005 | 项目 scope、授权、forbidden body 和 required qualification 不得绕过 | 双锚、S1 / S2 qualification、body-free 数据边界与 no-fallback 红线 | §3~5；§8~13；§15 | 安全要求直接成为结构禁止边和阻塞条件。 |
| NFR-MS-010~012；AC-MS-037 | 全生命周期结论、世代、替代、cleanup 与 handoff 必须连续可追溯 | 决定 / 事实来源关联、历史不覆盖、local / external outcome 分层 | §9~13；§15 | 追溯依靠安全 ref / marker，不以外部正文换取完整性。 |
| NFR-MS-013~016；AC-MS-038；VF-MS-006~007 | duplicate / concurrent / late / unknown 不形成第二 truth 或盲重放 | idempotent correlation、single-active、generation fence、hold / reconciliation | §9~13；§15 / 17 | 一致性与幂等被落实为跨五核心的长期机制。 |
| NFR-MS-017~019；AC-MS-039 | 关键状态与失败形成 body-free 材料；Observability 不可用不破坏本地判断 | S3 / P3、safe material、handoff gap、只读可重建 projection | §9~14 | 可观测材料与 observed truth 分层，消费失败不反写核心。 |
| NFR-MS-020；VF-MS-001 / 008 / 009 | planned / blocked / fake 与真实 readiness、依赖分类和核心闭环不得混写 | 机制状态表、风险 / Q blocker 分层、E0~E4 和非伪造门禁 | §8；§11；§14~17 | 架构只形成设计结论，不生成实现、测试或验收事实。 |
| AC-MS-001~039；VF-MS-001~009 | 核心、边界、数据和 NFR 均须可判定，硬边界破坏一票否决 | 风险表、追溯漏项审计、ADR 长期红线和 Step 16 总装配审计 | §15~17 | AC / VF 在架构中提供保护口径，不表示验收已执行。 |
| R-MS-001~013；Q-MS-001~011；MSVC-UP-001~009 | 开放合同、历史污染和范围变化必须持续显式 | AR-MS-001~010、Q owner / ceiling、blocker 分层和重开条件 | §14~16 | 风险被承接但未伪关闭；resolved 的 MSVC-UP-009 不生成非项目合同。 |

## 8. 编号族反向覆盖与孤儿审计

| 编号族 | 完整范围 | 架构承接主线 | 孤儿结果 |
|---|---|---|---|
| 核心闭环 / 故事 / 功能 | C-MS-1~5；US-MS-001~015；FR-MS-001~012 | A1~A5、S1~S3、§4~13 | none |
| 外围故事 / 功能 / 数据 / 接口 | US / FR / D / IB-MS-E01~E04 | P3 / S3、§14 演进、核心非前置 | none；enhancement only |
| 业务规则 | BR-MS-001~050 | BL / HC、数据 / 依赖 / 交互 / 横切 / 风险 | none |
| 数据 | D-MS-001~037 | Step 8 的 truth / shadow / ref / forbidden 与一致性表 | none |
| 能力接口 | IB-MS-001~017 | Step 4 / 7 / 9 的能力面与交互类别 | none；exact contracts pending |
| 非功能 | NFR-MS-001~020 | 部署角色、机制、横切和风险门禁 | none；数字 authority pending |
| 验收 / 否决 | AC-MS-001~039；VF-MS-001~009 | 架构保护与未来验证入口 | none；not executed |
| 风险 / 问题 / 上游 | R-MS-001~013；Q-MS-001~011；MSVC-UP-001~009 | Step 14 风险、owner、ceiling 和 blocker | none；open states preserved |
| 架构目标 / 约束 / 单元 / 风险 | AG-MS-001~008；HC-MS-001~009；A1~A5 / S1~S3 / P1~P3；AR-MS-001~010 | 正式 01 §2~17 | no source orphan |

## 9. 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | C / US / FR / BR / D / IB / NFR / AC / VF 正式编号族 | 全部架构主线 | 无缺口 | §7 / §8 已给出正向与反向覆盖，外围能力保持外围。 |
| 架构判断缺来源 | AG / HC、A1~A5、S1~S3、P1~P3、十项机制与 AR 风险 | 正式 §2~15 | 无缺口 | 均能回指正式 00 编号族、全局裁剪规则、accepted ADR 或已停审取舍。 |
| 承接关系未闭环 | Q-MS-001~010 的 exact API / DTO / event / schema / route / receipt / adapter qualification | §5 / 8~11 / 15；后续 02~07 | pending / positive blocked | 能力与边界已承接，精确合同仍须双侧 owner 正式闭口，不能在矩阵补齐。 |
| 承接关系未闭环 | Q-MS-011 的 workload、健康窗口、容量和性能数字 | §7 / 13 / 15；后续 04~07 | authority pending | 结构性性能口径成立，数值缺口保持显式。 |
| ADR 文件缺口 | 本项目九项专项候选决定 | 长期决策评审 | candidate_not_established | 候选已停审，但没有 ADR 文件或 Accepted 状态；§17 必须如实写“未建立”。 |
| 来源适用范围 | ADR-0005 中旧 Role 查询流程、产品、tag、工具清单和性能数字 | Images / 装配 / 历史污染 | 已裁剪，非当前来源 | 当前正式 00 与 Images 正式 00 只承接预构建 pinned supply；旧细节不构成追溯缺口。 |
| 来源越界 | ADR-0007 checkpoint persistence | Runtime / Process 与宿主恢复边界 | 已排除，非缺口 | 它证明 checkpoint truth 外置，不是本仓架构决定。 |

## 10. 跨 ADR / 追溯审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 孤儿核心需求 | pass | C-MS-1~5 及全部核心编号族均有具体架构结果和章节位置。 |
| 孤儿架构决定 | pass | 每个 ADR / candidate 均有需求、约束、风险或取舍来源。 |
| 普通实现选择误入 ADR | pass | 产品、协议、schema、字段、数字和部署参数均排除。 |
| pending 升格为 ADR | pass | exact contracts 与 policy / 非项目范围继续留在 Q / risk。 |
| accepted ADR 适用范围误读 | pass | ADR-0004 / 0005 仅按当前正式边界采用；ADR-0007 排除。 |
| 取舍缺来源 | pass | 主路径可回指 Step 11 四方案比较和 HC / NFR / VF。 |
| 追溯矩阵新增结论 | pass | 矩阵只连接 Step 1~14 已停审结论。 |
| 开放关系被“已覆盖”掩盖 | pass | exact contract、数字和专项 ADR 文件缺口均在 §9 明示。 |

## 11. 回填草稿

- 正式 §16 使用 §7 的五列需求追溯矩阵和 §9 的五列漏项检查表，并用 4 句短文说明分组粒度与 open gap。
- 正式 §17 使用 §5 的五列 ADR 表，明确 ADR-0004 / 0005 是 accepted upstream，九项 `未建立` 只是候选，不伪造文件或状态。
- §6 逐决策停审、§8 编号族反向覆盖和 §10 跨项审计保留在 calibration，正式正文通过延伸阅读回链。
- 正式正文不得把 AC / VF 写成已执行，不得把 candidate 写成 Accepted，不得把 pending contract 写成追溯已闭口。

## 12. Gate 自检

| 检查项 | 结果 |
|---|---|
| ADR 进入标准是否只保留长期架构决定 | pass |
| 每个关键决定是否逐项停审且状态诚实 | pass |
| 需求来源、具体结论、架构结果、章节位置和成立理由是否完整 | pass |
| 是否完成正向矩阵与编号族反向覆盖 | pass |
| 是否无孤儿核心需求、孤儿架构决定或无来源取舍 | pass |
| ADR-0005 / 0007 适用性污染是否已裁剪 | pass |
| exact contracts、数字和 candidate ADR 缺口是否仍显式 | pass |
| 跨 ADR / 追溯是否无 unresolved 冲突 | pass |
| 是否允许进入 Step 16 正式装配 | pass；须先同步 flow 与项目台账 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_enter_step_16
formal_01_write_allowed = false_until_step_16_gate_sync
```
