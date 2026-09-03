# 01 架构校准 Step 16：正式文档装配

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 15 completed / pass
> 本步目的：只从 Step 1~15 的已停审结论重建正式 `01-架构设计.md`，统一术语、图表、追溯和 pending 状态，不新增分析结论

## 1. Step 内计划

- [x] 读取 flow、项目台账、Step 1~15、Step 16 SOP、架构书写规范和三层门禁规范。
- [x] 核对项目级、文档级、Step 级门禁允许正式 01 装配。
- [x] 确认 Step 5 / 7 / 8 / 9 / 12 / 15 的架构单元和关键决定均已停审。
- [x] 建立 18 章来源映射、回填范围和禁止新增项。
- [x] 固定正式术语、编号、图表和交叉引用口径。
- [x] 完成装配前跨单元总审计与旧正式 01 污染排除表。
- [x] 删除旧正式 01，并按 100~300 行单批规则串行重建 18 章。
- [x] 执行章节来源、主链、职责、依赖、数据、交互、横切、ADR、追溯、pending 和非伪造终审。
- [x] 更新本文件、flow 与项目台账为正式 01 完成停审；不得进入 02。

## 2. 三层写入前门禁

| 门禁层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| 项目级 | pass | 正式 00 已获用户批准，台账当前明确允许 Step 16 装配正式 01 | 创建 Step 16 后重建正式 01 | `project_execution_ledger.md` |
| 文档级 | pass | Step 1~15 均 completed / pass，flow 当前只允许 Step 16 | 按 18 章来源映射装配 | `01_architecture_calibration_flow.md` |
| Step 级 | pass | 关键单元、依赖、数据、交互、横切与 ADR / 追溯均已停审且无 unresolved 冲突 | 删除 historical 01 并从 calibration 重建 | `01_arch_step_01~15` |

```text
gate_status = pass
gate_reason = three_layer_gate_pass_and_all_architecture_units_stopped
next_allowed_action = delete_historical_formal_01_then_rebuild_18_chapters
formal_01_write_allowed = true
formal_02_write_allowed = false
```

## 3. 18 章来源与回填映射

| 正式章 | 主来源 | 允许回填 | 禁止新增 |
|---|---|---|---|
| 1 与上游关系 | Step 1；Step 16 | 正式需求、稳定上游、全局裁剪与粒度参考 | 阅读流水账、draft / historical 来源 |
| 2 背景与驱动力 | Step 1 / 2 | 项目作用、问题、AG-MS-001~008 | 实现方案、产品与指标 |
| 3 约束条件 | Step 1 / 2 / 14 | HC-MS-001~009、阶段取舍、非目标 | pending 合同定论、协议 / 数字 |
| 4 职责边界 | Step 3 | 做 / 不做、易混淆职责、BL-MS-001~008 | 系统上下文、内部模块或接口 |
| 5 系统上下文 | Step 4 | 正式上下文对象、关系、失败上限 | 文档、角色、接口名或 sibling WIP truth |
| 6 限界上下文 | Step 5 | A1~A5、S1~S3、P1~P3、统一语言 | 代码模块、服务拆分或对象字段 |
| 7 容器 / 部署 | Step 6 | 三运行角色、状态承载和外部设施关系 | Kubernetes / Docker / 节点数 / 资源参数 |
| 8 依赖方向 | Step 7 | 责任层、类型分类、裁剪、禁止边 | 调用顺序、package 路径或伪 compile 边 |
| 9 数据 / 一致性 | Step 8 | truth / shadow / ref / forbidden、强 / 最终一致 | 表、字段、repository、outbox 产品结论 |
| 10 交互 / 通信 | Step 9 | 场景、同步 / 异步 / 后台、失败语义 | API / event / DTO / route / 时序细节 |
| 11 技术选型 | Step 10 | 十项机制、代价、状态与 deferred | 语言、框架、DB、消息、RPC、平台产品 |
| 12 备选 / 取舍 | Step 11 | 四路径比较与采用 / 不采用理由 | 产品横评、未来愿望池 |
| 13 横切关注 | Step 12 | 11 类横切、单元适用性和保护目标 | 旧 SLA / P95 / heartbeat / retention 数字 |
| 14 演进路线 | Step 13 | E0~E4、债务与触发条件 | 排期、任务、release promise |
| 15 风险 / Q | Step 14 | AR-MS-001~010、Q-MS-001~011、处理口径 | TODO、最终方案或伪闭口 |
| 16 需求追溯 | Step 15 | 五列追溯矩阵和五列漏项表 | 章节目录对照、状态汇报、新结论 |
| 17 ADR 索引 | Step 15 | ADR-0004 / 0005 限定适用、九项未建立候选 | fake ADR ID / file / Accepted 状态 |
| 18 参考 | Step 1 / 15 / 16 | 克制的正式参考材料表 | draft、historical、资料仓或导读 |

## 4. 装配批次

| 批次 | 正式范围 | 预计单批 | 装配门禁 |
|---|---|---|---|
| A | 标题 / 元信息 / §1~4 | 100~300 行 | 来源块齐全，背景 / 约束 / 职责不混章 |
| B | §5~8 | 100~300 行 | 3 张架构图有标题、图后说明，系统 / 内部 / 部署 / 依赖主语不混用 |
| C | §9~12 | 100~300 行 | owner 先于一致性，交互无 schema，机制 / 路径取舍分开 |
| D | §13~15 | 100~300 行 | 横切非空话，演进无排期，风险与 Q 分表且 pending 不伪闭口 |
| E | §16~18 | 100~300 行 | 追溯无孤儿，ADR 状态诚实，参考不重复前三章职责 |
| F | 终审与状态同步 | 校准材料 | 18 章、来源、术语、图表、污染、非伪造和 stop-review 全部 pass |

## 5. 统一术语与编号

| 统一术语 | 正式含义 | 禁止混用 |
|---|---|---|
| 宿主控制面 | 受理正式意图并形成宿主决定的 authority | Runtime “大脑”、Work 分配、基础设施调度 truth |
| Host Truth Center | A1~A5 / S3 共同形成的本仓唯一宿主真相边界 | 第六核心、单体代码模块、backend resource state |
| ProjectMemberRef / GlobalMemberRef | 当前执行主语 / 身份锚双锚引用 | GlobalMember 或 Workspace view 直接作为执行主语 |
| Host Session | 宿主与外部运行协作对象的关联壳 | Runtime run / checkpoint / session body |
| Host Readiness | 宿主装配 required qualification 的本仓结论 | Runtime readiness、进程存活或单后端成功 |
| Local cleanup / handoff | 本仓决定、attempt、gap、residual 或 material | external completed / delivered / observed / accepted |
| A1~A5 / S1~S3 / P1~P3 | 核心 / 支撑 / 本地影子语义单元 | 代码 module、crate、进程或部署服务 |
| compile / runtime / event / ref / adapter / fake | 跨边界接缝分类 | 将运行协作、替身或引用写成源码依赖 |
| AR-MS / Q-MS / MSVC-UP | 架构风险 / 待确认 / 跨项目 pending | 任务 ID、实现状态或 readiness 证明 |

章节使用 §1~18；需求编号沿用正式 00；架构目标 / 约束 / 风险使用 AG-MS / HC-MS / AR-MS；不创建实现对象、API、event 或配置编号。

## 6. 装配前跨架构单元总审计

| 审计维度 | 来源门禁 | 结果 | 说明 |
|---|---|---|---|
| 11 个架构单元停审 | Step 5 | pass | A1~A5、S1~S3、P1~P3 职责、非职责和影子边界均无 unresolved 冲突。 |
| 职责重叠 | Step 3 / 5 | pass | 五核心分别承载决定、装配、注册 / session、健康 / 恢复、收束 / 对账；支撑不取得核心 truth。 |
| 依赖方向 | Step 7 | pass | Core / SDK compile 基线与所有 runtime / event / ref / adapter / fake 边分类完整，无 sibling package 边。 |
| 数据所有权 | Step 8 | pass | truth single writer；P1~P3 不反写；forbidden body 无输入边；强一致不跨 owner。 |
| 通信方式 | Step 9 | pass | 同步权威接受、异步反馈、后台推进匹配 ownership；exact contracts 保持 pending。 |
| 技术与取舍 | Step 10 / 11 | pass | 十项机制与主路径均有来源、代价和相邻替代；产品 deferred。 |
| 横切约束 | Step 12 | pass | 11 类约束覆盖全部单元，安全 / 可用、审计 / 最小化、性能 / 一致性无冲突。 |
| 风险 / pending | Step 14 | pass | 风险与 Q 分离，owner、关闭条件、positive ceiling 和 blocker 分层完整。 |
| ADR / 追溯 | Step 15 | pass | 关键决定逐项停审，编号族双向覆盖，无孤儿结论；candidate 状态诚实。 |

## 7. 旧正式 01 污染排除

| 旧内容 | 排除原因 | 当前合法承接 |
|---|---|---|
| Rust / Axum / Tokio、PostgreSQL / Redis、Kafka / NATS | 技术产品无当前 authority | 只保留机制级 ports、正式状态承载、event seam 和 deferred 状态。 |
| REST / gRPC / WebSocket、API / DTO / topic | 协议与 schema 未闭口 | 只保留同步 / 异步 / 后台通信类别。 |
| Docker / Kubernetes、Deployment / StatefulSet、节点和副本 | 部署实现污染架构承载 | 只保留三运行角色、状态承载和外部设施关系。 |
| Role -> image_variant 查询、launch_token、镜像 tag / 工具清单 | 侵入 Images / credential truth 且合同过时 | pinned supply / credential safe ref 经 S1 / S2 qualification，exact contract pending。 |
| checkpoint 恢复、Runtime 失败与业务结果 | 侵入 Runtime / Process truth | Host Session ref 与宿主恢复决定分层，ADR-0007 不入索引。 |
| 单一 Host 状态机、对象 / repository / outbox / retry 实现 | 把概要 / 详细设计和产品机制提前 | 五类语义、local-first、generation fence、gap / reconciliation。 |
| 旧 P95、QPS、SLA、heartbeat、容量、镜像大小 / 启动时延 | 无 workload、环境和 measurement authority | 只保留结构性性能口径和 Q-MS-011。 |
| ADR-0005 全量流程与 ADR-0007 | 适用范围与当前仓边界不符 | ADR-0005 仅限定 pinned prebuilt supply；ADR-0007 排除。 |

## 8. 当前装配状态

```text
assembly_status = completed
completed_batches = A_title_metadata_sections_1_to_4;B_sections_5_to_8;C_sections_9_to_12;D_sections_13_to_15;E_sections_16_to_18;F_final_audit_and_status_sync
next_batch = none_stop_review
final_audit_status = pass
formal_01_stop_review = true
formal_02_write_allowed = false_until_explicit_user_confirmation
```

## 9. 装配批次与章节来源终审

### 9.1 串行装配记录

| 批次 | 写入范围 | 行数口径 | 结果 | 校验 |
|---|---|---|---|---|
| A | 标题 / 元信息 / §1~4 | 约 159 行 | pass | 需求来源、背景、约束和职责分章成立；无历史技术结论回流。 |
| B | §5~8 | 约 273 行 | pass | 系统上下文、语义上下文、运行承载和依赖方向主语分离；4 张图均符合格式。 |
| C | §9~12 | 约 175 行 | pass | owner 先于一致性，关键交互无协议 / schema，机制和路径取舍分离。 |
| D | §13~15 | 约 124 行 | pass | 横切约束可判定，演进无排期承诺，AR 与 Q 分表且状态诚实。 |
| E | §16~18 | 约 98 行 | pass | 追溯、ADR 和参考材料完整；内容已闭合，未为凑行数加入重复文字。 |
| F | 终审与状态同步 | calibration only | pass | 执行 SOP 评审、污染与非伪造审计，并同步正式文档、flow 和项目台账。 |

各批次严格按 A -> B -> C -> D -> E -> F 串行执行；没有并行写入同一正式文档，也没有在 Step 16 新增未停审架构判断。

### 9.2 十八章来源覆盖

| 正式章节 | 实际校准来源 | 来源状态 | 审计结果 |
|---|---|---|---|
| §1 与上游关系 | Step 1 | completed / pass | 来源效力、承接范围与排除项明确。 |
| §2 背景与驱动力 | Step 1 / 2 | completed / pass | 只表达问题、作用和 AG-MS-001~008。 |
| §3 约束条件 | Step 1 / 2 / 14 | completed / pass | HC、阶段取舍、非目标与 pending ceiling 分层。 |
| §4 职责边界 | Step 3 | completed / pass | 做 / 不做、易混淆职责与 BL-MS-001~008 齐全。 |
| §5 系统上下文 | Step 4 | completed / pass | 只出现正式上下文对象，输入 / 输出与失效上限明确。 |
| §6 限界上下文 | Step 5 | completed / pass | A1~A5、S1~S3、P1~P3 及统一语言完整。 |
| §7 容器 / 部署 | Step 6 | completed / pass | 只表达逻辑运行承载和状态角色，不锁部署产品 / 参数。 |
| §8 依赖方向 | Step 7 | completed / pass | 内向依赖、跨仓裁剪、seam typing 与禁止转换齐全。 |
| §9 数据 / 一致性 | Step 8 | completed / pass | truth / shadow / ref / forbidden body 和强 / 最终一致分层。 |
| §10 交互 / 通信 | Step 9 | completed / pass | 场景、同步 / 异步 / 后台选择及失败上限明确。 |
| §11 技术选型 | Step 10 | completed / pass | 只锁十项机制，产品、协议、字段和数字保持 deferred。 |
| §12 备选 / 取舍 | Step 11 | completed / pass | 四条路径有采用理由、代价和不采用原因。 |
| §13 横切关注 | Step 12 | completed / pass | 11 类横切约束与 11 个语义单元适用性可判定。 |
| §14 演进路线 | Step 13 | completed / pass | E0~E4 是条件性结构演进，不是排期或 readiness。 |
| §15 风险 / 待确认 | Step 14 / 项目台账 | completed / pass | AR-MS-001~010 与 Q-MS-001~011 分表，owner 与 ceiling 保留。 |
| §16 需求追溯 | Step 15 | completed / pass | 五列主矩阵与五列漏项表完整，无孤儿核心需求或架构决定。 |
| §17 ADR 索引 | Step 15 | completed / pass | 2 项 accepted upstream 与 9 项未建立候选状态诚实。 |
| §18 参考 | Step 1 / 15 / 16 | completed / pass | 只列正式材料、用途和适用限制，排除 draft / historical / sibling WIP。 |

十八个主章节均有具体 `design-calibration` 来源块和延伸阅读入口；来源文件均存在。Step 是生成过程，正式章节是结果结构，二者没有被机械一一复制。

## 10. 正式文档总审计

| 评审维度 | 终审结果 | 说明 |
|---|---|---|
| 上游承接 | pass | 当前正式 00 是直接基线；稳定上游、已停审兄弟需求边界、全局裁剪与 accepted ADR 均注明适用限制。 |
| 职责边界 | pass | 宿主 control plane / Host Truth 与 L1、Member、Runtime、Images、Tools、Sandbox、Governance、Observability truth 无重叠。 |
| 系统上下文 | pass | 主图只含本仓及 6 个关键正式上下文对象；基础设施和外围对象由关系表承接，未混入角色、协议或文档来源。 |
| 限界上下文 | pass | 5 个核心、3 个支撑和 3 个本地影子是语义单元，不被写成代码 module、服务或独立 truth。 |
| 运行承载 | pass | 三运行角色和状态承载逻辑分离，可同部署；没有容器平台、节点、副本或资源参数。 |
| 依赖方向 | pass | Core / 受限 SDK compile 基线与 runtime / event / ref / adapter / fake seam 分类完整；没有 sibling 源码边。 |
| 数据与一致性 | pass | 本仓 single writer、外部 owner、typed ref / safe snapshot、forbidden body、local strong / external eventual 边界一致。 |
| 交互与通信 | pass | 同步权威接受、后台推进和异步反馈分离；没有 API / DTO / event schema、route 或时序实现。 |
| 机制与取舍 | pass | 十项机制均说明问题、理由、代价和状态；四条备选为路径级比较，未锁语言、数据库、RPC、消息或容器产品。 |
| 横切与演进 | pass | 约束具备作用范围、判断口径和保护目标；演进由正式触发条件驱动，不是 TODO、排期或 release promise。 |
| 风险与 pending | pass | AR-MS-001~010、Q-MS-001~011 和 MSVC-UP 状态没有被正文叙事掩盖；positive ceiling 保持 fail closed。 |
| 追溯与 ADR | pass | 全部正式编号族双向覆盖；2 项 accepted upstream ADR 限定采用，9 项候选均标为未建立，ADR-0007 排除。 |
| 参考材料 | pass | 四列表说明材料类别、用途和适用限制；不与来源声明、追溯或 ADR 索引混写。 |
| 图表一致性 | pass | 5 张图均有图类型标题、`text` ASCII 代码块和 4 条图后说明；无 Mermaid / PlantUML / Graphviz / Emoji。 |
| 正式主链 | pass | 18 个主章节顺序完整，章节职责无串章；每章都有校准来源和定向延伸阅读。 |

## 11. 开放边界、污染与非伪造审计

### 11.1 开放边界保留

| 对象 | 当前状态 | 对正式 01 的影响 | 对后续的阻塞 |
|---|---|---|---|
| `MSVC-UP-001~008` | open / pending / waiting，与 Q-MS-001~011 共同承接双侧合同、基础设施、传播和数值 authority 缺口 | 不阻塞 owner、分层、依赖、数据和失败上限成文 | 阻塞相应 exact contract、字段 / schema、正向集成、真实测试、验收和 readiness。 |
| `MSVC-UP-009` | resolved_for_current_scope | 当前项目型双锚范围成立 | 非项目型能力未承诺；未来纳入必须重开正式需求。 |
| 本项目专项 ADR 文件 | 9 项 candidate_not_established | 不阻塞已停审架构决定进入索引 | 阻止把候选宣称为 Accepted 或已有 ADR 文件。 |
| 性能 / 容量 / 健康数字 | authority pending | 结构性 guard 与测量维度成立 | 阻塞 04~06 的具体数值、测试结论和 readiness。 |

### 11.2 污染与非伪造检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 旧技术栈 / 产品 | pass | Rust / Axum / Tokio、数据库、缓存、消息、RPC、容器平台均未作为采用结论回流；产品词只在排除、风险或 deferred 语境出现。 |
| 旧协议 / 对象 / 状态 | pass | 未出现 API 目录、DTO、event schema、route、repository、outbox、单一 Host 状态机或旧 Role 查询流程的正向定义。 |
| 旧数字 / 指标 | pass | 未继承 P95、QPS、SLA、heartbeat、容量、镜像大小或启动时延数字；只保留 measurement authority 缺口。 |
| sibling WIP truth | pass | Member / Member Images 只消费已停审正式 00；进行中 01 明确不构成 exact contract 或参考来源。 |
| 相邻 truth 合并 | pass | LLM loop、goal / plan、memory / checkpoint、Tool execution、capability、Member、Images、Sandbox、Governance、Observability 和 L1 truth 均保持外置。 |
| 伪实现 / 伪证据 | pass | 未声明实现仓、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、集成通过或 readiness。 |
| 文档静态质量 | pass | `git diff --check` 无错误；18 章、36 个来源 / 延伸阅读标记、5 张 ASCII 图、11 个语义单元、10 项 AR、11 项 Q 和 11 项 ADR 索引行已核对。 |

## 12. Step 16 Gate 结论

全部已停审结论已经按 18 章正式结构落位，术语、编号、图表和交叉引用一致。跨架构单元总审计没有 unresolved 冲突；开放上游合同仍按 pending / blocked / waiting / fail closed 保留，未被包装为 ready。正式 `01-架构设计.md` 因此完成并立即停审，等待用户评审；本结论不允许启动 02。

```text
gate_status = pass
unresolved_architecture_conflicts = none
open_upstream_boundaries = MSVC-UP-001_to_008
formal_01_status = completed_stop_review_pending_user_approval
next_allowed_action = wait_for_user_review_and_explicit_confirmation
formal_02_write_allowed = false_until_explicit_user_confirmation
implementation_or_commit_authorized = false
```
