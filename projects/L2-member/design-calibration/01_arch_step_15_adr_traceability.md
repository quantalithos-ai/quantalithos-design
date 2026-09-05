# Step 15. ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.16 / §4.17
> 回填位置: 正式 `01-架构设计.md` §16 / §17
> 日期: 2026-08-23
> 当前状态: `pass`;D-L2M-01~09、需求追溯矩阵、漏项检查与跨审计全部通过
> 串行门禁: Step 15 已通过;下一允许动作仅为创建 Step 16 并先完成正式装配前审计

## 1. Step 内计划

| 阶段 | 动作 | 状态 |
|---|---|---|
| 输入与候选 | 读取正式 00、Step 1~14、现有 ADR 与规范 | completed |
| 决策停审 | 按 D-L2M-01~09 逐项判断长期性、来源与边界 | completed:D01~09 pass |
| 需求追溯 | 映射 FR / BR / NFR / AC / VF 到具体架构结果 | completed:103 个正式编号逐项覆盖 |
| 漏项检查 | 检查未承接需求、缺来源决定和未闭环关系 | completed:pass |
| 跨审计 | 检查孤儿决定 /需求、实现偏好、历史污染和新增结论 | completed:pass |
| 回填草稿 | 形成正式 §16 / §17 固定结构表 | completed:ready_for_step_16 |

## 2. 本步输入与 ADR 进入标准

| 输入 | 本步用途 |
|---|---|
| 正式 `00-需求文档.md` | FR-L2M-001~012 / E01~E03、BR-001~030、NFR-001~016、AC-001~033、VF-001~009。 |
| Step 1~14 | 已停审的边界、单元、依赖、数据、通信、机制、取舍、横切、演进和风险。 |
| `architecture/adr/0004-global-vs-project-member.md` | 项目执行主语与 Global / Project Member 分层 authority;物理容器表述需裁剪。 |
| `architecture/adr/0005-member-image-per-role.md` | role-derived pinned image supply authority;旧实现 / 数字需按当前 formal 00 裁剪。 |
| sibling formal 00 | member-service owner 与 member-images static supply 的当前正式需求边界。 |
| sibling latest ledgers | 截至 2026-08-23 最新刷新:member-service 正式 01 Step 16 allowed、尚未停审;member-images 正式 01 stop_review。后者只经 drift check 消费已停审 owner / supply 结论,exact contract / readiness 仍 pending。 |

进入索引的决定必须同时满足:是架构层决定、长期影响 owner / dependency / data / consistency / interaction / evolution、值得后续单独理解、可回指已停审架构单元和正式需求 / 风险 / 取舍。语言、框架、数据库、transport 产品、字段、schema、配置值、测试步骤和实施动作不得进入。

## 3. 关键决策停审计划

| 顺序 | ID | 决策主题 | 索引形态 | 状态 | 下一动作 |
|---:|---|---|---|---|---|
| 1 | D-L2M-01 | ProjectMember 执行主语 + GlobalMember 身份锚 | accepted upstream ADR-0004 applicability | pass | D02 |
| 2 | D-L2M-02 | role-derived pinned image 只作为静态 supply | accepted upstream ADR-0005 applicability | pass | D03 |
| 3 | D-L2M-03 | 独立 member interaction-boundary truth + BC01~07 | local ADR candidate | pass | D04 |
| 4 | D-L2M-04 | Core-only compile + inward / transport-neutral seams | local ADR candidate | pass | D05 |
| 5 | D-L2M-05 | truth / snapshot / projection / ref / forbidden-body 分离 | local ADR candidate | pass | D06 |
| 6 | D-L2M-06 | local-truth-first + append history + unknown fence | local ADR candidate | pass | D07 |
| 7 | D-L2M-07 | sync admission / async fact / background continuation 分离 | local ADR candidate | pass | D08 |
| 8 | D-L2M-08 | Interaction Trace 是 body-free core semantics | local ADR candidate | pass | D09 |
| 9 | D-L2M-09 | anti-corruption Mirror + isolated Read Model / optional outlet | local ADR candidate | pass | trace matrix |
| 10 | cross ADR / requirements audit | trace matrix + orphan / gap audit | Step gate | pass | Step 16 |

## 4. SOP 总体问题回答

- 需要长期索引的是会持续决定主语、member 独立性、依赖方向、正文边界、一致性、通信、追溯和派生消费的决定。
- 所有决定必须能回指正式 00 和 Step 3~14;Step 15 不补造新方案。
- 现有 ADR-0004 / 0005 只按当前正式需求适用,旧细节不因 `Accepted` 自动整包继承。
- 本仓暂无专项正式 ADR 文件;D03~09 只能标 `candidate / 未建立`,不得伪装成正式 ADR 已评审。
- Q / UP / AQ pending 只进入漏项检查,不提前升格为 ADR 决定。

## 5. D-L2M-01 停审:项目型执行主语与身份锚

### 5.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | 当前正向运行态成员只以 ProjectMemberRef 为执行主语,并关联 GlobalMemberRef 身份锚和可验证启动语境。 |
| 解决问题 | 防止全局身份、Workspace view、匿名进程或错项目语境代替项目执行主体,使 presence / screening / outbound / trace 失去归属。 |
| 关联单元 | BC01 为主;BC02~05 / BC07 消费同一 subject / identity correlation。 |
| 上游 ADR | ADR-0004 Accepted;只承接 GlobalMember / ProjectMember 双层分离和项目执行归属。 |
| 不继承 | 不因 ADR-0004 的历史文字锁定一个 ProjectMember 对应固定物理容器;不把 Workspace view 变成 truth;不吸收 host lifecycle。 |
| 开放范围 | 非项目型 / personal 第三种主语继续 L2M-UP-008 / Q-L2M-009 fail closed。 |

### 5.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-001~003;BR-L2M-001~006 / 029 | 双锚、在场和 host owner 分层。 |
| 验收 / 否决 | AC-L2M-001 / 006~008 / 019 / 023 / 029;VF-L2M-002 / 005 | 错主语、host truth 吸收或 fail-open 直接否决。 |
| 架构单元 | Step 5 BC01;Step 7 / 8 / 9 / 12 BC01 | 职责、依赖、数据、通信和横切已逐项停审。 |
| 取舍 / 风险 | ALT-L2M-A;Step 13 subject-scope evolution;RA-L2M-009 / 012 | 当前 project-only 换取唯一归属,未来由正式第三种主语触发重开。 |

### 5.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期架构决定而非字段 / token / transport 选择 | pass |
| 是否回指正式需求、已停审单元和风险 / 取舍 | pass |
| 是否处理 ADR-0004 容器粒度文字张力 | pass:只承接主语,物理 topology pending |
| 是否新增非项目型主语或 host truth | pass:未新增 |
| 是否值得正式索引 | pass:ADR-0004 upstream applicability |

`D-L2M-01 gate = pass`。下一允许决定仅为 D-L2M-02。

## 6. D-L2M-02 停审:静态 pinned image supply

### 6.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | role-derived、可验证且 pinned 的 member image / component 只作为 build-time static supply,由 member-service / host 装配边界消费;不进入 member 运行语义或 package 依赖。 |
| 解决问题 | 防止镜像构建、manifest、registry、compatibility、availability 或容器实例状态被混入 member presence / Runtime / interaction truth。 |
| 关联单元 | Step 6 deployment supply edge;BC01 只消费 host context,BC01~07 不消费 image truth。 |
| 上游 ADR | ADR-0005 Accepted;结合 member-images / member-service 正式 00 只承接 role mapping 来源受控、static pinned supply 与生产禁 mutable selector。 |
| 不继承 | 不继承固定 Role 数 /工具清单、Rust / Python、supervisord、镜像大小、冷启动数字、registry / CI 产品或容器已启动结论。 |
| 开放范围 | manifest / variant / ref、member component compatibility、handoff / confirmation 继续 L2M-UP-002 pending。 |

### 6.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 正式边界 | BR-L2M-027 / 028 / 029;DB-L2M-009;member-images / member-service 正式 00 | build supply 与运行 truth / lifecycle 分离。 |
| 验收 / 否决 | AC-L2M-022 / 026 / 033;VF-L2M-007 / 008 | image / sibling / pending 不得进入 package 或 readiness。 |
| 架构 Step | Step 4 static supply relation;Step 6 deployment boundary;Step 7 dependency crop;Step 13 trigger | supply 只影响部署输入,不定义核心语义。 |
| 风险 | L2M-UP-002;RA-L2M-010 / 011 / 012 | 防止 ADR 历史细节、sibling drift 与 positive claim 回流。 |

### 6.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期部署 / owner 边界而非镜像实现清单 | pass |
| 是否回指 ADR-0005 与当前 sibling formal 00 | pass |
| 是否保持 member-images truth / host lifecycle 外置 | pass |
| 是否误写 image ref 为 runtime / compile dependency | pass:未误写 |
| 是否继承旧 Role / stack / process /性能细节 | pass:未继承 |
| 是否值得正式索引 | pass:ADR-0005 upstream applicability |

`D-L2M-02 gate = pass`。下一允许决定仅为 D-L2M-03。

## 7. D-L2M-03 停审:独立 member interaction-boundary truth

### 7.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | L2-member 作为独立 member interaction-boundary truth owner,采用 BC01~05 core semantics、BC06 supporting Mirror 和 BC07 local projection;不退化为透明 Event / IPC pipe。 |
| 解决问题 | 让 presence、screening / delivery、Runtime mediation local facts、outbound 和 trace 可归责,同时避免 Runtime / host / Bus / downstream 接管或被接管。 |
| 核心边界 | BC01~05 各自拥有本地决定 / history;BC06 / 07 不产生核心业务决定。 |
| 外置 truth | Runtime loop / plan / outcome、host lifecycle / health、Bus delivery、Policy、Conversation、Tools、image、Sandbox、Observability backend。 |
| 替代方案 | ALT-L2M-B~D 的透明 pipe、并入 Runtime 或并入 host 均不采用。 |
| 索引形态 | 本仓专项 ADR 尚未建立;作为 local candidate 长期索引。 |

### 7.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能闭环 | FR-L2M-001~012;C-L2M-1~5 | 七个上下文承接完整成员门面能力而不吸收外部 owner。 |
| 规则 / 数据 | BR-L2M-005 / 010 / 012 / 014 / 016 / 022 / 025 / 027;正式 §11 数据归属 | 决定与 external truth 分层。 |
| 验收 / 否决 | AC-L2M-001~005 / 019~026;VF-L2M-001 / 003 / 005 | 透明 pipe、第二 owner 或派生反写直接否决。 |
| 架构 Step | Step 3 / 4 / 5 / 11;BC01~07 全套单元停审 | 职责、上下文分类和替代路径已闭合。 |
| 风险 | RA-L2M-001 / 003 / 007 / 008 | 持续防止 owner、状态、trace 和派生边界回流。 |

### 7.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期 owner / context 决策 | pass |
| BC01~05 / BC06 / BC07 分类是否来自已停审 Step 5 | pass |
| 是否吸收 Runtime / host / Bus / downstream truth | pass:未吸收 |
| 是否把逻辑上下文写成源码模块 / 物理部署 | pass:未写 |
| 是否新增未确认能力 | pass:未新增 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-03 gate = pass`。下一允许决定仅为 D-L2M-04。

## 8. D-L2M-04 停审:inward dependency 与 Core-only compile

### 8.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | Member Core Semantics、Use-case Coordination、External Boundary Seams、Derived Consumption、Technical Carriers 服从 inward dependency;只有 L0-core 是 compile dependency candidate。 |
| 解决问题 | 防止 sibling SDK / private schema、Bus / host / Runtime implementation、projection 或 provider adapter 反向定义 member core。 |
| runtime / event | Runtime、member-service、Work、Identity、Governance、Tools / method 为 runtime seam;Bus、Governance、Conversation、Observability 为 event collaboration。 |
| ref / adapter / fake | ref 是交互材料形态;adapter 是倒置实现位置;fake 只用于测试替身,都不是额外依赖类型或 positive integration。 |
| transport | host / Runtime / Bus seam 先锁 acceptance / result / handoff 语义,不锁 UDS / TCP / gRPC / pipe、client / server 或 route。 |
| schema authority | shared ID / ref / envelope / trace / error 类别只从 Core authority 承接;member-specific schema pending。 |

### 8.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 规则 | BR-L2M-019 / 027~029;DB-L2M-001~009 | 正式外联、owner 排除和依赖分类。 |
| 验收 / 否决 | AC-L2M-022 / 026 / 029 / 033;VF-L2M-006~008 | 任意外联、非 Core package 或 fake readiness 均否决。 |
| 架构 Step | Step 7 全单元 + cross crop;TM-L2M-001 / 002 / 004 / 011;ALT-L2M-A | 层次、倒置、裁剪和 transport neutrality 已收敛。 |
| 风险 | RA-L2M-005 / 010~012 | 持续防止 schema shadow、历史 transport 和 sibling drift。 |

### 8.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期依赖方向决定 | pass |
| 是否有全局裁剪与正式需求来源 | pass |
| runtime / event 是否未写成 package dependency | pass |
| ref / adapter / fake 是否未伪装依赖类型 / integration | pass |
| 是否锁定 transport、private schema 或准确 Core symbol | pass:未锁定 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-04 gate = pass`。下一允许决定仅为 D-L2M-05。

## 9. D-L2M-05 停审:数据类别与 forbidden-body 分离

### 9.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | member-owned truth、external safe snapshot、derived projection、typed reference 与 forbidden body 分开;每类数据有唯一 owner、freshness / scope 与写入边界。 |
| 解决问题 | 防止一个 MemberState / event log 同时保存本地决定、外部 truth、正文和派生视图,形成双真相、正文泄漏和 read-path 反写。 |
| truth | BC01~05 只拥有 member 本地决定、attempt / gap、trace link 与本地 history。 |
| snapshot / ref | BC06 只拥有 consumption state;external business truth、body 与 lifecycle 保持外置。 |
| projection | BC07 只拥有可重建 summary / outlet / diagnostic / explanation 与 freshness。 |
| forbidden body | 入站正文仅可在正式授权范围瞬时检查;raw input / output、Runtime / Conversation / Artifact / Evidence / tool / method body、hidden reasoning 与 secret 不进入持久化、handoff、trace 或 projection。 |

### 9.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-005~012;BR-L2M-011 / 015 / 021 / 024~026 / 030 | 正文检查、safe material、trace 与只读派生边界。 |
| 非功能 | NFR-L2M-006 / 007 / 009 / 014 / 015 | fail-closed、body-free、source-correlated 与低敏材料。 |
| 验收 / 否决 | AC-L2M-002~005 / 010~017 / 024 / 025 / 029 / 032;VF-L2M-003~005 | 正文入仓、external truth 或 projection 反写均否决。 |
| 架构 Step | Step 8 七单元 + cross audit;TM-L2M-003 / 004 / 012;CC-L2M-002 / 004 / 015 | 数据类别、一致性与 lifecycle 已逐项停审。 |
| 风险 | RA-L2M-004 / 007 / 008 | 持续防止 debug / retention / trace / outlet 扩张。 |

### 9.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期数据 ownership 决策 | pass |
| truth / snapshot / projection / ref 是否逐类有 owner / write boundary | pass |
| 授权瞬时检查是否未转化为持久化例外 | pass |
| external body / hidden reasoning / secret / definition 是否保持禁止 | pass |
| 是否新增 store、schema、retention 数字或 caching 产品 | pass:未新增 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-05 gate = pass`。下一允许决定仅为 D-L2M-06。

## 10. D-L2M-06 停审:local-truth-first、追加历史与 unknown fence

### 10.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | member 本地决定先独立提交,跨 owner 提交 / 反馈只做最终关联;状态变化、修正、迟到结果以 append / supersede 保留历史;物理 commit 或外部副作用 unknown 时进入 fence,无正式 resolution / idempotency 依据不得盲重放。 |
| 解决问题 | 防止 host / Runtime / Bus / downstream 失败回滚本地事实,防止迟到反馈覆盖新状态,也防止 timeout 被当成“未发生”而重复制造不可逆副作用。 |
| 本地一致性 | subject / source / scope / correlation / reason 与本地决定保持逻辑一致;不完整或冲突时 reject / blocked,物理 commit 是否发生不明时显式 unknown。 |
| 跨 owner 一致性 | decision、attempt、delivery、observed、accepted、health 等按 owner 分层最终关联,不要求共享数据库、跨仓事务或即时全局一致。 |
| 历史 / 修正 | presence、screening、delivery、outbound、trace 的后续变化形成新事实或 superseding relation;旧记录不原地抹写,projection / feedback 不反写 source truth。 |
| 后移范围 | store、transaction、durability、outbox、lock / version、idempotency carrier、resolution / recovery workflow 与 retention 进入后续设计;本决定不声称这些机制已存在。 |

### 10.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-002 / 003 / 006 / 008 / 009;BR-L2M-003 / 004 / 006 / 012 / 017 / 020 / 023 / 026 / 029 | 显式状态、外部反馈不逆写、关联历史与开放 seam 保守处置。 |
| 非功能 | NFR-L2M-010~013 | 本地 / 外部状态分层,duplicate / late / out-of-order 无 truth 分叉,subject 冲突不静默合并。 |
| 验收 / 否决 | AC-L2M-008 / 014 / 021 / 028 / 030;VF-L2M-003 / 005 | history 保留、external truth 外置、失败不回滚本地事实。 |
| 架构 Step | Step 8 §11 / §12;Step 9 §12 / §13;CC-L2M-005 / 006 / 009 / 010 / 015 | logical local strong、external eventual、immutable history、qualified continuation 和 fence 已逐项停审。 |
| 取舍 / 风险 | ALT-L2M-A / G;RA-L2M-003 / 006;AQ-L2M-001 | 接受显式 gap 与后续 resolution 复杂度,拒绝共享状态和 unknown 自动 replay。 |

### 10.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期一致性 / 恢复边界而非存储实现选择 | pass |
| local commit、external feedback 与各 owner 状态是否分层 | pass |
| correction / duplicate / late / out-of-order 是否只追加或 supersede | pass |
| commit / side-effect unknown 是否 fenced 且无盲重放 | pass |
| 是否假定 shared DB、分布式事务、outbox、retry 或 recovery 已实现 | pass:未假定 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-06 gate = pass`。下一允许决定仅为 D-L2M-07。

## 11. D-L2M-07 停审:同步受理、异步事实与后台 continuation 分离

### 11.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | 需要调用方立即获知 accept / reject / blocked 或当前 safe view 的边界采用同步语义;已提交事实、结果、反馈与 handoff 采用异步语义;refresh、rebuild、reconciliation 和有正式前提的 continuation 采用后台语义。 |
| 同步上限 | startup / screening / outbound safety 等本地 admission 只提交当前决定;Runtime entry 同步成功只表示 entry accepted,不等待 run / outcome;safe read 不触发 source write。 |
| 异步上限 | host signal、Bus fact、committed Runtime material、publication、external feedback、trace / projection propagation 只传播已提交事实或 attempt;传递不重新裁决 source truth。 |
| 后台上限 | periodic signal、snapshot refresh、projection / trace rebuild 与 gap reconciliation 可延后;unknown side effect 只有在正式 resolution / idempotency 前提成立时才可继续。 |
| 隔离要求 | trace、observation、Mirror refresh、Read Model 更新 / 查询 / 重建不成为 BC01~04 本地核心决定的外部同步前置;单一路径失败只降级对应能力。 |
| 后移范围 | transport、client / server direction、API / event / topic、ack / ordering guarantee、queue / scheduler、backpressure、timeout 与 retry algorithm 均待后续正式合同。 |

### 11.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-001~012;BR-L2M-003 / 006 / 012 / 013 / 017 / 018 / 023 / 026 / 029 | admission、已提交事实传播、外部反馈和显式 gap 的时间边界。 |
| 非功能 | NFR-L2M-001~005 / 010~012 / 016 | external wait 分 stage,派生不阻塞核心,unknown / duplicate / late 与 readiness 分层。 |
| 验收 / 否决 | AC-L2M-006~017 / 021 / 027 / 028 / 030;VF-L2M-005 / 007 / 008 | entry accepted 不等于 run complete,attempt 不等于 delivery,planned carrier 不等于集成。 |
| 架构 Step | Step 9 七单元及 §10~13;TM-L2M-010 / 011 / 013;CC-L2M-009~012 / 014 | sync / async / background 按 interaction kind 分离并保持 transport neutral。 |
| 取舍 / 风险 | ALT-L2M-A / F;RA-L2M-003 / 006 / 010 / 011 | 接受多路径 correlation 与 failure handling,拒绝全同步长链、全异步 admission 和历史 transport 回流。 |

### 11.3 单项停审

| 检查项 | 结果 |
|---|---|
| 是否为长期 interaction semantics 而非协议 / 线程选择 | pass |
| sync admission 是否只回答即时边界且 Runtime acceptance 未伪装 run complete | pass |
| async 路径是否只传播 committed fact / feedback / attempt 并保持 owner | pass |
| background continuation 是否受 resolution / idempotency 与 unknown fence 约束 | pass |
| 派生 / refresh / rebuild 是否不阻塞核心 local commit | pass |
| 是否锁定 UDS / gRPC / CloudEvents route、ack、scheduler 或 retry | pass:未锁定 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-07 gate = pass`。下一允许决定仅为 D-L2M-08。

## 12. D-L2M-08 停审:Interaction Trace 是 body-free core semantics

### 12.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | Interaction Trace 是 member 核心交互语义:连接 BC01~04 已提交事实的稳定 ref,形成有来源的 trace link、correlation gap、body-free 安全材料及 observation handoff local attempt / gap。 |
| 核心性 | 它让 presence、screening、Runtime mediation、outbound 的来源、目的、决定与结果分类可在同一成员语境回链;若退化为可选日志,C1~C3 的误拦截、重复、未送达和 owner 分界无法审计。 |
| source 边界 | 核心决定仍由 BC01~04 拥有;Trace 只追加有来源的关联,关联缺失时报告 gap,不得靠日志、时间邻近或 projection 猜测补齐,也不得通过 reconciliation 修改 source fact。 |
| material 边界 | trace record / handoff material 必须最小必要、body-free、redacted、low-cardinality;raw body、hidden reasoning、secret 和高基数用户内容禁止进入。 |
| external truth | handoff attempt 不等于 ingest / stored / observed;完整日志、Conversation history、Evidence / report / verdict 与 observability backend / observed truth 均在本仓之外。 |
| 后移范围 | trace / telemetry schema、carrier / route、backend、retention / archive、reconciliation schedule 和告警实现待后续合同;无 route 时只记录 attempt / gap。 |

### 12.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-009 / 010;BR-L2M-020~023 / 027 / 030 | 关联追溯、安全材料、attempt / observed 分层和 backend owner 外置。 |
| 非功能 | NFR-L2M-003 / 009 / 010 / 014 / 015 / 016 | 追溯不阻塞核心,材料低敏低基数,不依赖 backend ready。 |
| 验收 / 否决 | AC-L2M-004 / 014 / 015 / 021 / 025 / 030 / 032;VF-L2M-003~005 | body-free、gap 显式、外部 truth 不反写、完整日志与正文禁止。 |
| 架构 Step | Step 5 BC05;Step 8 / 9 / 12 BC05;TM-L2M-005~009 / 012 | core classification、link / gap owner、异步传播、append history 与安全材料门禁均已停审。 |
| 风险 | RA-L2M-004 / 008 / 011;L2M-UP-004 | 防止 Trace 膨胀为日志 / Evidence / backend,并保持 pending route 不伪装 observed / readiness。 |

### 12.3 单项停审

| 检查项 | 结果 |
|---|---|
| Trace 是否因核心可归责能力而成立,而非仅因技术日志需要 | pass |
| 是否只拥有 link / gap / safe material / local attempt,不复制 source truth | pass |
| correlation 缺失是否显式且禁止猜测 / reconciliation 反写 | pass |
| trace record / handoff 是否 body-free、最小必要、低敏低基数 | pass |
| 是否吸收 complete log、Conversation、Evidence / verdict 或 observability backend truth | pass:未吸收 |
| 是否伪造 route、backend、ingest / observed 或 retention 已就绪 | pass:未伪造 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-08 gate = pass`。下一允许决定仅为 D-L2M-09。

## 13. D-L2M-09 停审:反腐 Mirror 与隔离 Read Model / 可裁剪出口

### 13.1 决策及适用边界

| 维度 | 结论 |
|---|---|
| 架构决策 | External Context Mirror 作为 supporting anti-corruption boundary,只把正式 external ref / safe snapshot 翻译为带 owner / scope / freshness 的中性消费状态;Member Read Model 作为独立 local projection,只从已提交事实和上述 marker 派生 body-free 可重建只读视图。 |
| Mirror 上限 | 只拥有 resolution / receipt / freshness / conflict / gap 等“本仓如何消费”的支撑事实;resolved 不等于 authorized / healthy / accepted / available,不得形成第二 registry、schema authority、external model 或 adapter hub。 |
| Read Model 上限 | 只拥有 Member Summary、projection freshness / rebuild / gap 与可选 diagnostic / explanation / capability outlet projection;query、rebuild、reconciliation 不得写回 source 或产生业务决定。 |
| 分离理由 | source resolution 与 consumer-facing projection 的 owner、失败和更新节奏不同;合并会让展示 freshness 反向影响核心消费,或让 projection 演变为外部 truth / registry。 |
| capability outlet | BC07 架构结构保留但正向激活可裁剪;只从 Tools / method 正式 ref / safe view 派生可见范围,未激活或 source / consumer contract 未闭口时显式 `not_available` / `gap`,不影响 C1~C4 与 Member Summary。 |
| 禁止提升 | summary / outlet / diagnostic / explanation 不授予 configuration write、registry membership、invocation permission 或 execution availability;definition / method body、secret 和 external truth 不进入投影。 |
| 后移范围 | source-specific adapter、ref / snapshot schema、freshness 数值、store / cache / index、read API / SDK binding、rebuild job 与 outlet consumer contract 待后续设计。 |

### 13.2 来源与长期性

| 来源类别 | 具体来源 | 承接关系 |
|---|---|---|
| 功能 / 规则 | FR-L2M-011 / 012 / E01~E03;BR-L2M-024~027 / 029 | body-free 可重建视图、可裁剪出口、freshness / gap 与外部 owner 排除。 |
| 非功能 | NFR-L2M-004 / 005 / 012 / 016 | source / projection 失效可判别,派生不拖垮核心,late update 不反写,planned 不等于 ready。 |
| 验收 / 否决 | AC-L2M-005 / 016~018 / 024 / 025 / 028 / 033;VF-L2M-003 / 006~008 | ref / snapshot 非第二 truth,视图只读可重建,无任意 adapter、package 直边或假 readiness。 |
| 架构 Step | Step 5 / 8 / 9 / 12 BC06~07;TM-L2M-004 / 013 / 014;Step 13 outlet scope decision | anti-corruption、projection isolation、三类通信与“结构保留、激活可裁剪”均已停审。 |
| 风险 / 开放项 | RA-L2M-005 / 007 / 011;AQ-L2M-003;Q-L2M-006 closed | 防止 shadow schema / registry / authorization / write-back;详细 consumer contract 后移且不阻塞正式 01。 |

### 13.3 单项停审

| 检查项 | 结果 |
|---|---|
| Mirror 是否只做 anti-corruption / consumption state,不拥有 external truth | pass |
| Read Model 是否可重建、只读、与核心提交及 Mirror resolution 分离 | pass |
| resolved / visible 是否未提升为 authorization / health / acceptance / availability | pass |
| capability outlet 是否结构保留、激活可裁剪且未激活显式 not_available / gap | pass |
| C1~C4 与 Member Summary 是否不依赖 outlet 激活 | pass |
| 是否形成第二 registry、schema authority、adapter hub、configuration truth 或 write-back | pass:未形成 |
| 是否锁定 adapter / schema / freshness 数值 / store / read API / SDK | pass:未锁定 |
| 是否值得正式索引 | pass:local ADR candidate |

`D-L2M-09 gate = pass`。D01~09 均已逐项停审;下一允许动作仅为建立需求追溯矩阵,不得提前做漏项审计或 Step 16。

## 14. 需求到架构结果追溯矩阵

> 本节只证明正式需求在架构层有明确承接点,不表示 schema、adapter、integration、test、evidence 或 readiness 已存在。`D-L2M-03~09` 均为 local ADR candidate / 未建立;表中引用不把它们伪装成已接受 ADR。

### 14.1 FR / E 逐项追溯

| 需求 | 主要架构单元 | 关键决定 | 已停审架构结果 | 当前限制 |
|---|---|---|---|---|
| FR-L2M-001 | BC01 / BC06 | D01 / D03~07 / D09 | Step 3 / 5 / 7~9 / 12 的 project-scoped subject、startup admission、ref resolution 与 fail-closed | project-only;credential / host contract pending |
| FR-L2M-002 | BC01 / BC05 | D03 / D05~08 | presence state owner、append change、unknown fence 与 trace link | physical transition / store pending |
| FR-L2M-003 | BC01 / BC06 | D01 / D03~07 / D09 | host local request / signal / report、async collaboration、acceptance / session / health 外置 | member-service detail pending |
| FR-L2M-004 | BC02 / BC06 | D03~07 / D09 | source-anchored scope decision、neutral resolution、unverifiable change reject | subscription schema / source mapping pending |
| FR-L2M-005 | BC02 / BC06 | D03 / D05~07 / D09 | four-state screening、authorized transient inspection、external rule source 与 conservative unknown | rule / snapshot contract pending |
| FR-L2M-006 | BC02 / BC03 / BC06 | D03~07 / D09 | controlled context、Runtime delivery decision、sync entry acceptance、unknown fence | Core / Entry mapping pending |
| FR-L2M-007 | BC03 / BC04 / BC06 | D03~09 | committed material reception、source validation、body-free outbound decision | Runtime handoff / target mapping pending |
| FR-L2M-008 | BC04 / BC05 | D03~08 | decision / attempt / delivery / observed / accepted 分层、local-truth-first、append feedback | member event family / route pending |
| FR-L2M-009 | BC05,BC01~04 为 source | D03 / D05~08 | minimal anchor、body-free link / gap、append / reconcile 不反写 | trace schema / carrier pending |
| FR-L2M-010 | BC05 | D03~08 | safe observation material、handoff attempt / gap、observed truth 外置 | observation producer / route pending |
| FR-L2M-011 | BC06 / BC07 | D03 / D05 / D07 / D09 | body-free summary、freshness、async projection、sync read、background rebuild | read carrier / source contract pending |
| FR-L2M-012 | BC06 / BC07 | D03~05 / D07 / D09 | ref-derived capability outlet、非 registry / authorization、结构保留 / 激活可裁剪 | source / consumer contract pending;未激活为 not_available / gap |
| FR-L2M-E01 | BC07,BC02 为 source | D03 / D05 / D07 / D09 | screening diagnostic 只读派生、可独立裁剪 | optional / planned only |
| FR-L2M-E02 | BC05 / BC07 | D03 / D05~09 | body-free history summary、不替代 Conversation / Observability | optional / planned only |
| FR-L2M-E03 | BC06 / BC07 | D03 / D05 / D07 / D09 | effective boundary explanation 只读且非 configuration truth | optional / planned only |

### 14.2 BR 逐项追溯

| 规则 | 主要架构单元 | 关键决定 | 架构承接 / 审计点 |
|---|---|---|---|
| BR-L2M-001 | BC01 | D01 / D03 / D05~07 | Step 3 / 5 / 8 / 9 / 12:ProjectMember 执行主语 + GlobalMember 身份锚。 |
| BR-L2M-002 | BC01 / BC06 | D01 / D03 / D05~07 / D09 | startup / credential ref unverifiable 即 reject,不降级放行。 |
| BR-L2M-003 | BC01 / BC05 | D03 / D06~08 | presence change 显式追加并可回链,host / process signal 不隐式改写。 |
| BR-L2M-004 | BC01 | D03 / D05 / D06 | presence 六态与 unknown fence,不压平。 |
| BR-L2M-005 | BC01 / BC06 | D01 / D03~07 / D09 | member local host facts 与 host acceptance / registry / session / health owner 分离。 |
| BR-L2M-006 | BC01 / BC05 | D03 / D05~08 | host unavailable 仅 degraded / unknown + history,不伪装成功或 terminated。 |
| BR-L2M-007 | BC02 / BC06 | D01 / D03~05 / D09 | subscription scope 绑定正式 identity / role source,Mirror 不猜私有配置。 |
| BR-L2M-008 | BC02 / BC05 | D03 / D05 / D08 | screening 四态结论和 rule source link 是本地 core truth。 |
| BR-L2M-009 | BC02 / BC06 | D03 / D05 / D06 / D09 | Policy truth 外置;unknown / stale / conflict conservative,无 local allowlist。 |
| BR-L2M-010 | BC02 / BC06 | D03~05 / D09 | screening、governance policy truth 与 Bus delivery truth 三层 owner 分开。 |
| BR-L2M-011 | BC02 / BC03 | D03~05 / D07 | transient inspection 与 typed ref / safe snapshot 投递分离,forbidden-body 持久化为零。 |
| BR-L2M-012 | BC03 | D03 / D06 / D07 | Runtime reject / unavailable / timeout 不代答;unknown side effect fenced。 |
| BR-L2M-013 | BC03 / BC05 | D03 / D06~08 | delivery decision 与 Runtime result ref 关联;duplicate / late 只追加。 |
| BR-L2M-014 | BC03 / BC04 / BC06 | D03 / D05 / D07 / D09 | outbound 只承接 source-valid committed safe material ref,不改 Runtime semantics。 |
| BR-L2M-015 | BC04 / BC05 | D03 / D05 / D08 | body-free material gate;raw / secret / hidden reasoning 拒绝。 |
| BR-L2M-016 | BC03~05 | D03 / D05~08 | outcome / decision / attempt / delivery / accepted 五层状态及 trace 关联。 |
| BR-L2M-017 | BC04 / BC05 | D03 / D06 / D08 | external feedback append-only,不回滚 / 重裁本地 outbound decision。 |
| BR-L2M-018 | BC04 / BC05 | D03 / D06~08 | publication attempt / degraded / gap 显式,后续 attempt 为新事实。 |
| BR-L2M-019 | BC01 / BC03 / BC04 | D03 / D04 / D07 | 只经 host / Runtime / Bus formal seam;无通用监听或 provider / MCP / A2A / API 直边。 |
| BR-L2M-020 | BC05,BC01~04 为 source | D03 / D05 / D06 / D08 | source / purpose / result category 进入统一 body-free correlation。 |
| BR-L2M-021 | BC05 | D05 / D08 | trace 最小暴露,明确不是 complete log。 |
| BR-L2M-022 | BC05 | D03 / D05~08 | observation attempt / delivery / observed 分层,observed owner 外置。 |
| BR-L2M-023 | BC05 | D03 / D06~08 | observation failure / unavailable / duplicate 显式,不改 source interaction truth。 |
| BR-L2M-024 | BC06 / BC07 | D05 / D07 / D09 | summary / outlet 只从 committed fact 与正式 ref / safe view 派生,可重建。 |
| BR-L2M-025 | BC07 | D05 / D09 | projection 无 write-back、definition body 或第二 registry。 |
| BR-L2M-026 | BC06 / BC07 | D05~07 / D09 | source / projection freshness、stale / conflict / gap 显式,不静默续期。 |
| BR-L2M-027 | BC01~07 | D01~09 | Step 3 / 4 / 5 / 7 / 8 / 12 owner 排除表覆盖所有边界外 truth。 |
| BR-L2M-028 | BC01~07 dependency boundary | D02 / D04 | Core-only compile;runtime / event / ref / adapter / fake 分类真实,sibling pending 不升格。 |
| BR-L2M-029 | BC01~07 | D01~09 | Step 13 / 14 触发器与 pending lane:未闭口 seam 只 blocked / waiting / degraded / fail-closed。 |
| BR-L2M-030 | BC02~07 | D05 / D06 / D08 / D09 | typed ref / safe snapshot / conclusion / redacted marker;无 external / hidden body 持久化。 |

### 14.3 NFR 逐项追溯

| 非功能需求 | 主要架构单元 | 关键决定 / 横切项 | 可验证架构口径 |
|---|---|---|---|
| NFR-L2M-001 | BC02 / BC03 / BC07 | D07 / D09;CC-011 / 012 | local screening / submission、external wait、projection 分 stage;无数值。 |
| NFR-L2M-002 | BC04 / BC05 | D06~08;CC-011 | outbound local gate / attempt 与 delivery / downstream wait 分开。 |
| NFR-L2M-003 | BC05 | D07 / D08;CC-012 | minimal anchor 外的 linking / observation handoff 不作核心外部同步前置。 |
| NFR-L2M-004 | BC01~06 | D06 / D07 / D09;CC-009 / 010 | seam failure 局部归因,local history 保留,unknown fenced。 |
| NFR-L2M-005 | BC07 | D03 / D07 / D09;CC-009 / 012 | projection / outlet /外围失败与 BC01~05 隔离。 |
| NFR-L2M-006 | BC01 / BC02 / BC04 / BC06 | D01 / D03 / D05 / D06 / D09;CC-001 | subject / rule / material unverifiable 即 fail closed / conservative。 |
| NFR-L2M-007 | BC02~05 / BC07 | D05 / D08 / D09;CC-002 / 015 | transient inspection 不产生持久化例外;全 handoff / trace / view body-free。 |
| NFR-L2M-008 | BC01~04 / BC06 | D03 / D04 / D07 / D09;CC-003 | formal seam 与禁止直边可区分;Mirror 非 adapter hub。 |
| NFR-L2M-009 | BC05,BC01~04 为 source | D03 / D05 / D08;CC-005 / 006 | 每个关键事实可回链 source / purpose / category,无需正文。 |
| NFR-L2M-010 | BC04 / BC05 | D05 / D06 / D08;CC-006 / 008 | local decision / attempt 与 external delivery / observed / accepted 分层。 |
| NFR-L2M-011 | BC02~04 / BC06 | D06 / D07 / D09;CC-010 | duplicate 幂等关联,unknown 不自动 replay。 |
| NFR-L2M-012 | BC03~07 | D06 / D07 / D09;CC-006 / 010 | late / out-of-order 形成新关联或 source-specific marker,不覆盖。 |
| NFR-L2M-013 | BC01 / BC06 | D01 / D05 / D06 / D09;CC-001 / 010 | project subject 双锚唯一,host view conflict 不静默合并。 |
| NFR-L2M-014 | BC05 / BC07 | D05 / D08 / D09;CC-007 / 008 | local attempt / gap 可形成低敏低基数材料,不依赖 backend ready。 |
| NFR-L2M-015 | BC05 / BC07 | D05 / D08 / D09;CC-002 / 008 | observation / projection 无正文、hidden reasoning、secret、高基数内容。 |
| NFR-L2M-016 | BC01~07 | D02 / D04 / D07~09;CC-016 | planned / fake / blocked / local attempt 与 positive integration / readiness 分开。 |

### 14.4 AC 逐项追溯

| 验收条件 | 架构承接 | 关键决定 | 设计检查入口 |
|---|---|---|---|
| AC-L2M-001 | BC01 / BC06 | D01 / D03 / D05 / D06 / D09 | Step 5 / 8 / 12 BC01 |
| AC-L2M-002 | BC02 / BC03 / BC06 | D03~07 / D09 | Step 5 / 8 / 9 / 12 BC02~03 |
| AC-L2M-003 | BC03 / BC04 / BC05 | D03 / D05~08 | Step 5 / 8 / 9 / 12 BC03~05 |
| AC-L2M-004 | BC05 | D03 / D05~08 | Step 5 / 8 / 9 / 12 BC05 |
| AC-L2M-005 | BC06 / BC07 | D03 / D05 / D07 / D09 | Step 5 / 8 / 9 / 12 BC06~07 |
| AC-L2M-006 | BC01 / BC06 | D01 / D03 / D05~07 / D09 | FR-001 row + Step 14 subject fence |
| AC-L2M-007 | BC01 / BC05 | D03 / D05~08 | FR-002 row + state / trace audits |
| AC-L2M-008 | BC01 / BC06 | D01 / D03~07 / D09 | FR-003 row + host owner audit |
| AC-L2M-009 | BC02 / BC06 | D03~05 / D09 | FR-004 row + source resolution audit |
| AC-L2M-010 | BC02 / BC06 | D03 / D05~07 / D09 | FR-005 row + transient body / conservative rule audit |
| AC-L2M-011 | BC02 / BC03 / BC06 | D03~07 / D09 | FR-006 row + Runtime entry audit |
| AC-L2M-012 | BC03 / BC04 / BC06 | D03 / D05 / D07 / D09 | FR-007 row + committed source / material gate audit |
| AC-L2M-013 | BC04 / BC05 | D03 / D05~08 | FR-008 row + local / external state audit |
| AC-L2M-014 | BC05 | D03 / D05 / D06 / D08 | FR-009 row + trace source / body audit |
| AC-L2M-015 | BC05 | D03 / D05~08 | FR-010 row + observation handoff audit |
| AC-L2M-016 | BC06 / BC07 | D03 / D05 / D07 / D09 | FR-011 row + projection freshness / rebuild audit |
| AC-L2M-017 | BC06 / BC07 | D03~05 / D07 / D09 | FR-012 row + outlet crop / registry audit |
| AC-L2M-018 | BC07 | D03 / D05 / D07 / D09 | E01~E03 rows + optional isolation audit |
| AC-L2M-019 | BC01~07 | D01 / D03 / D05 / D06 / D09 | Step 10 invariants -> Step 12 cross-cutting |
| AC-L2M-020 | BC01~07 | D01 / D03~09 | Step 3 forbidden boundary + Step 12 / 14 audit |
| AC-L2M-021 | BC01~07 | D03 / D06 / D08 / D09 | Step 8 append / explicit state + projection gap |
| AC-L2M-022 | BC01~07 system boundary | D02~05 / D08 / D09 | Step 3 / 4 / 7 owner and dependency crop |
| AC-L2M-023 | BC01~05 / BC06 | D01 / D03 / D05 / D06 / D09 | Step 8 truth / external snapshot ownership table |
| AC-L2M-024 | BC06 / BC07 | D05 / D09 | Step 8 BC06~07 ref / snapshot / freshness audit |
| AC-L2M-025 | BC02~05 / BC07 | D05 / D08 / D09 | Step 8 / 12 forbidden-body lifecycle audit |
| AC-L2M-026 | BC01~07 dependency boundary | D02 / D04 | Step 7 dependency classification / cross crop |
| AC-L2M-027 | BC01~07 | D07 / D09 | Step 9 stage split + CC-011 / 012;无数值目标 |
| AC-L2M-028 | BC01~07 | D06 / D07 / D09 | Step 8 / 9 failure + Step 12 isolation audit |
| AC-L2M-029 | BC01 / BC02 / BC04 / BC06 | D01 / D03~05 / D07 / D09 | CC-001~004 formal seam / fail-closed audit |
| AC-L2M-030 | BC04 / BC05 | D05 / D06 / D08 | Step 8 append history + Step 12 state layering |
| AC-L2M-031 | BC01~04 / BC06 | D01 / D06 / D07 / D09 | idempotency / ordering / subject association audit |
| AC-L2M-032 | BC05 / BC07 | D05 / D08 / D09 | CC-002 / 007 / 008 material sensitivity audit |
| AC-L2M-033 | BC01~07 | D02 / D04 / D07~09 | CC-016 evidence discipline + pending lane audit |

### 14.5 VF 逐项追溯

| 否决项 | 防护单元 | 关键决定 | 架构否决点 |
|---|---|---|---|
| VF-L2M-001 | BC01~05 | D01 / D03 / D08 | 任一 core context 缺失、透明 pipe 或第二 Runtime owner 即否决。 |
| VF-L2M-002 | BC01 / BC02 / BC06 | D01 / D05 / D06 / D09 | invalid / non-project / unknown subject 或 rule fail-open 即否决。 |
| VF-L2M-003 | BC01~07 | D03 / D05 / D06 / D08 / D09 | local policy / external truth / projection write-back 即否决。 |
| VF-L2M-004 | BC02~05 / BC07 | D05 / D08 / D09 | forbidden body 持久化、raw handoff 或 body 进入 trace / view 即否决。 |
| VF-L2M-005 | BC01 / BC03~05 | D03 / D05 / D06 / D08 | external success 成为 local truth 或回滚 local fact 即否决。 |
| VF-L2M-006 | BC01 / BC03 / BC04 / BC06 | D03 / D04 / D07 / D09 | 通用监听、任意 provider / MCP / A2A / API 直连或 Mirror hub 即否决。 |
| VF-L2M-007 | BC01~07 dependency boundary | D02 / D04 / D07 / D09 | non-Core package 或 pending seam 伪闭口即否决。 |
| VF-L2M-008 | BC01~07 | D02 / D04 / D07~09 | fake / planned / blocked / not_run 冒充 integration / evidence / readiness 即否决。 |
| VF-L2M-009 | BC01~07,BC05 为关联中心 | D01~09 | 任一 source / conclusion / change 无正式 requirement / owner / correlation 回链即否决。 |

### 14.6 矩阵写入检查点

| 集合 | 正式基线数量 | 矩阵预期数量 | 静态集合比对 |
|---|---:|---:|---|
| FR-L2M-001~012 | 12 | 12 | pass:no missing / extra / duplicate row |
| FR-L2M-E01~E03 | 3 | 3 | pass:no missing / extra / duplicate row |
| BR-L2M-001~030 | 30 | 30 | pass:no missing / extra / duplicate row |
| NFR-L2M-001~016 | 16 | 16 | pass:no missing / extra / duplicate row |
| AC-L2M-001~033 | 33 | 33 | pass:no missing / extra / duplicate row |
| VF-L2M-001~009 | 9 | 9 | pass:no missing / extra / duplicate row |

`requirements traceability matrix gate = pass`。正式 00 定义行与本节矩阵行已做唯一集合比对:核心 FR 12、增强 FR 3、BR 30、NFR 16、AC 33、VF 9 均完整且无额外 / 重复矩阵行。该结果仅证明设计追溯覆盖,不构成实现或验收证据;下一允许动作仅为漏项检查。

## 15. 漏项检查

### 15.1 孤儿需求检查

| 检查集合 | 追溯下限 | 草稿检查结果 |
|---|---|---|
| FR-L2M-001~012 | 每项至少映射一个 BC、一个长期决定和已停审 Step | pass:12 / 12 |
| FR-L2M-E01~E03 | 每项映射 BC07 或其 source context,并保持 optional / read-only | pass:3 / 3 |
| BR-L2M-001~030 | 每项映射 owner / dependency / data / communication / projection 中至少一类架构约束 | pass:30 / 30 |
| NFR-L2M-001~016 | 每项映射具体 BC、D 与 CC,不能只写“全局适用” | pass:16 / 16 |
| AC-L2M-001~033 | 每项指向可检查的 BC / D / Step,但不填写验收结果 | pass:33 / 33 |
| VF-L2M-001~009 | 每项转化为明确架构否决点 | pass:9 / 9 |

矩阵共覆盖 103 个正式编号。没有功能只停留在需求文字而未进入 bounded context,也没有 NFR / veto 只靠通用口号承接。外围 E01~E03 明确挂在 BC07 只读派生面,未膨胀为核心写能力。

### 15.2 孤儿架构决定检查

| 决定 | 正式需求 / 规则来源 | 已停审结构来源 | 后续约束对象 | 草稿结论 |
|---|---|---|---|---|
| D-L2M-01 | FR-L2M-001 / FR-L2M-003;BR-L2M-001~006 / BR-L2M-029;VF-L2M-002 | ADR-0004 applicability;BC01;Step 3 / 5 / 8 / 9 / 12 | subject、presence、host seam | pass:no orphan |
| D-L2M-02 | BR-L2M-027~029;AC-L2M-022 / AC-L2M-026 / AC-L2M-033;VF-L2M-007 / VF-L2M-008 | ADR-0005 applicability;Step 4 / 6 / 7 / 13 / 14 | deployment static supply / dependency crop | pass:no orphan |
| D-L2M-03 | FR-L2M-001~012;BR-L2M-027;VF-L2M-001 / VF-L2M-003 | Step 3~5 / 11 / 12 | member owner 与 BC01~07 | pass:no orphan |
| D-L2M-04 | BR-L2M-019 / BR-L2M-027~029;NFR-L2M-008 / NFR-L2M-016;VF-L2M-006~008 | Step 7;TM-L2M-001 / TM-L2M-002 / TM-L2M-004 / TM-L2M-011 | inward dependency / formal seams | pass:no orphan |
| D-L2M-05 | FR-L2M-005~012;BR-L2M-011 / BR-L2M-015 / BR-L2M-021 / BR-L2M-024~026 / BR-L2M-030;VF-L2M-003~005 | Step 8;TM-L2M-003 / TM-L2M-012;CC-L2M-002 / CC-L2M-004 / CC-L2M-015 | data ownership / forbidden body | pass:no orphan |
| D-L2M-06 | FR-L2M-002 / FR-L2M-003 / FR-L2M-006 / FR-L2M-008 / FR-L2M-009;NFR-L2M-010~013 | Step 8 / 9 / 11 / 12 | consistency、history、recovery fence | pass:no orphan |
| D-L2M-07 | FR-L2M-001~012;NFR-L2M-001~005 / NFR-L2M-011 / NFR-L2M-012 | Step 9;TM-L2M-010 / TM-L2M-011 / TM-L2M-013;CC-L2M-009~012 | sync / async / background contracts | pass:no orphan |
| D-L2M-08 | FR-L2M-009 / FR-L2M-010;BR-L2M-020~023 / BR-L2M-030;NFR-L2M-003 / NFR-L2M-009 / NFR-L2M-010 / NFR-L2M-014 / NFR-L2M-015 | BC05;Step 5 / 8 / 9 / 12 | trace / observation boundary | pass:no orphan |
| D-L2M-09 | FR-L2M-011 / FR-L2M-012 / FR-L2M-E01~E03;BR-L2M-024~027 | BC06~07;Step 5 / 8 / 9 / 12 / 13 | external translation / read consumption / outlet crop | pass:no orphan |

D01~09 均同时具备正式需求来源、已停审架构来源和下游约束对象。D01 / D02 只引用 accepted upstream ADR 的适用部分;D03~09 继续标为 local candidate / 未建立,没有因进入索引而伪装成已接受专项 ADR。

### 15.3 pending / blocker 未伪闭口检查

| 开放项 | 当前架构允许声明 | 仍禁止声明 | 阻塞层级 |
|---|---|---|---|
| L2M-UP-001 / L2M-UP-006;Q-L2M-001 | host owner 分层、startup / host transport-neutral seam | 字段、IPC、credential issue / revoke / verify 形态与正向联调 ready | 02~05 受影响 host contract / integration |
| L2M-UP-003;Q-L2M-002 | Runtime EntryAuthority admission / committed handoff 语义 | typed mapping、carrier、backpressure、acceptance resolution 已闭口 | 02 / 03 / 05 Runtime positive lane |
| L2M-UP-007;Q-L2M-003 | screening 四态、source-anchored conservative handling | rule source matrix / taxonomy 已闭口或 local allowlist 可用 | 04 / 05 screening positive cases |
| L2M-UP-004 / L2M-UP-005;Q-L2M-004 / Q-L2M-005 | body-free outbound / observation material + local attempt / gap | member event family、schema、route、delivered / observed ready | 02~05 event / observation positive lane |
| L2M-UP-008;Q-L2M-009 | project-scoped 正向主语 | non-project / personal 主语可入场 | 非项目型全部正向 lane |
| L2M-UP-002 | ADR-0005 + member-images formal 00 / 01 的 static pinned supply 与 component release-ref direction | exact release shape / manifest / version / compatibility / handoff / confirmation / readiness | deployment detailed contract / integration |
| Q-L2M-007;AQ-L2M-001 | immutable body-free history、logical local consistency、append / fence | store / transaction / durability / recovery / retention / archive 已选或已验证 | 03~05 data / recovery lane |
| AQ-L2M-002 | stage / dependency / outcome 可测 | workload、SLO、capacity、backpressure、timeout / heartbeat / retry 数字成立 | 04~06 quantified config / test lane |
| AQ-L2M-003 | Member Summary 保留;capability outlet 结构保留 / 激活可裁剪 | read carrier / SDK / consumer contract 或 outlet ready | 02~05 read / outlet positive lane |

已关闭项保持关闭但未扩大授权:Q-L2M-006 只关闭为“BC07 结构保留、激活可裁剪”;Q-L2M-008 只表示当前范围无 outbound governance prerequisite,正式场景出现时必须回开相关 Step。上述开放项均不阻塞 Step 15 / 16 / 正式 01 成文,但继续有条件阻塞具体 schema、配置、测试、联调和 readiness。

### 15.4 实现选择误入检查

| 类别 | Step 15 允许内容 | 禁止 / 后移内容 | 草稿结果 |
|---|---|---|---|
| language / framework / process | 无选择 | Rust / Go / Python、framework、supervisord、进程数 / topology | pass:none selected |
| transport / protocol | sync / async / background 与 acceptance / handoff semantics | UDS / TCP / pipe / gRPC、client / server、API path、topic、ack guarantee | pass:all deferred / historical |
| schema / shared contract | Core authority + member-specific gap | private DTO、event family / route、exact symbol、payload field | pass:none invented |
| storage / consistency carrier | logical local strong、external eventual、append、unknown fence | database、transaction product、outbox、lock、idempotency key、durability / recovery product | pass:none selected |
| scheduling / retry | qualified continuation + fence | scheduler / queue、retry algorithm / library、heartbeat interval、automatic replay | pass:none selected |
| configuration / performance | owner / source / scope / effective state 与 stage 可测 | key / default、timeout / SLO / P95、capacity 数值 | pass:none selected |
| trace / read implementation | link / gap / safe material / projection semantics | backend、telemetry schema、retention number、cache / store、read API / SDK / rebuild job | pass:none selected |
| ADR / evidence | upstream applicability + local candidates | 伪造专项 ADR、implementation、test、run、artifact、evidence、verdict、signoff、readiness | pass:none claimed |

### 15.5 历史污染逐项检查

| 历史材料 | 当前有效最小结论 | 未继承内容 | 草稿结果 |
|---|---|---|---|
| CloudEvents / W3C trace | 只有 Core 当前正式承接的 shared envelope / trace 类别可按 authority 消费 | 旧 member-specific event name / source / route / payload、统一 delivery guarantee | pass:未整包继承 |
| AG-UI | 无当前 authority 进入 member core | AG-UI event family、前端 / 对话 transport 与展示模型 | pass:historical only |
| UDS / gRPC / server direction | 只保留 host / Runtime sync admission + async committed handoff 语义 | UDS path、gRPC service、client / server 方向、双进程假设 | pass:historical / deferred |
| launch token | 只保留可验证 startup credential / context ref 与 fail-closed | token 名称、字段、签发 / 轮换 / 撤销方案 | pass:historical;credential contract pending |
| Rust / Python / supervisord | 无当前语言 / manager 选择 | role stack、进程管理、组件数与 lifecycle 实现 | pass:未继承 |
| ADR-0004 固定容器文字 | ProjectMember 执行主语 + GlobalMember 身份锚 | 一个 ProjectMember 固定等于一个物理容器 | pass:裁剪引用 |
| ADR-0005 旧 role / image 细节 | role-derived verified pinned static supply | 固定 Role 数、工具清单、stack、image size、cold start、registry / CI 与 ready | pass:裁剪引用 |
| 旧固定指标 | 只保留 stage / dependency / outcome 可测 | P95、SLA、heartbeat / retry、镜像大小与启动数字 | pass:无来源数字未恢复 |

### 15.6 漏项检查写入检查点

| 检查项 | 草稿结果 |
|---|---|
| 是否存在 formal requirement 无 BC / D / Step 承接 | pass:none |
| 是否存在 D01~09 无 requirement / Step / downstream constraint | pass:none;9 / 9 均三向回链 |
| 是否存在 pending / closed question 被扩大为 positive claim | pass:none;UP 8 / 8、Q 9 / 9、AQ 3 / 3 保持边界 |
| 是否存在实现选择、字段、协议、产品或指标误入 | pass:none selected / invented |
| 是否存在历史材料整包继承 | pass:none;8 类逐项裁剪 |
| 是否存在专项 ADR、实现或 evidence / readiness 伪造 | pass:none |

`ADR / requirements gap audit gate = pass`。静态复核确认 D01~09 共 9 项均有正式来源、已停审结构来源和下游约束;正式 00 的 UP 8 / 8、Q 9 / 9 与架构 AQ 3 / 3 均保留正确状态;技术 / 历史关键字只出现在未选择、后移、禁止或裁剪语境;无专项 ADR、实现、集成、测试、run、artifact、evidence、verdict、signoff 或 readiness 正向声明。下一允许动作仅为最终跨 ADR / requirements 审计。

## 16. 最终跨 ADR / requirements 审计

### 16.1 sibling 现场刷新与 authority 上限

| sibling | 2026-08-23 现场 | 当前可消费结论 | 不可消费内容 | 审计结论 |
|---|---|---|---|---|
| L2-member-service | 正式 00 已停审;正式 01 Step 16 allowed,尚未停审 | member request / signal / report 与 host acceptance / registry / session / health 的需求级 owner 分工 | 未停审正式 01、字段、IPC、credential 形态、联调结果 | pass:no drift;L2M-UP-001 / 006 保留 |
| L2-member-images | 正式 00 + 正式 01 stop_review | image asset / supply truth 外置;未来从 L2-member 消费 pinned component release ref;向 member-service 提供 pinned entry / gap | exact release shape、manifest / version、compatibility、handoff / confirmation、readiness | pass:no drift;L2M-UP-002 精化后保留 |

member-images 新停审架构没有要求 image truth 进入本仓运行主链,也没有改变 host / member owner;它只把 future pinned member component release -> image supply -> pinned consumer entry 的非 package 边界表达得更清楚。member-service 尚未停审正式 01。两者均不阻塞 Step 16 / 正式 01 成文;若后续正式内容要求 host 接管 member core decision、image truth 进入运行主链或改变逻辑运行单元,必须按 Step 13 trigger 回开受影响 Step。

### 16.2 九项决定之间的一致性

| 关系 | 必须同时成立的决定 | 交叉判断 | 审计结果 |
|---|---|---|---|
| 执行主语 vs 物理承载 | D01 / D02 / D03 | ProjectMemberRef 决定运行归属;image supply 只决定 build-time 输入;二者都不锁容器 / 进程 topology。 | pass |
| 独立 owner vs 外部协作 | D03 / D04 | member core 独立拥有本地决定,但通过 inward runtime / event seams 消费外部能力;独立不等于直连或复制 sibling package。 | pass |
| owner vs 数据形态 | D03 / D05 / D09 | BC01~05 truth、BC06 support truth、BC07 projection 与 external truth 分开;Mirror / Read 不成为第二 owner。 | pass |
| 数据一致性 vs communication | D05 / D06 / D07 | 本地决定逻辑一致并先提交;外部反馈异步最终关联;qualified background continuation 不绕 unknown fence。 | pass |
| core Trace vs 核心提交隔离 | D03 / D07 / D08 | BC05 的可归责语义是核心,但 source context 只同步形成 minimal anchor;异步 linking / observation handoff 不成为 BC01~04 外部同步前置。 | pass |
| C5 核心需求 vs projection 分类 | D03 / D07 / D09 | Member Summary 是必需的需求闭环输出,由隔离、可重建 projection 承载;projection 分类不表示可删。只有 capability outlet 正向激活可裁剪。 | pass |
| Trace vs Read Model | D05 / D08 / D09 | Trace 拥有 body-free link / gap;Read Model 只投影 trace summary,query / rebuild / reconciliation 无反写权。 | pass |
| visibility vs authority | D05 / D09 | resolved / fresh / visible 只表达消费或展示状态,不授予 authorization、health、acceptance、registry membership、invocation permission 或 availability。 | pass |
| static supply vs runtime dependency | D02 / D04 | images 侧可用 runtime/ref 消费 future pinned member component release,再形成 build / deployment supply;该关系不是本仓 compile / event 或运行 truth 依赖,host 负责消费 pinned entry 并承载 lifecycle。 | pass |
| history vs external outcome | D06 / D08 / D09 | external feedback、observed state 与 projection 只追加关联或派生,不回滚、覆盖或重裁本地决定。 | pass |

### 16.3 正式 00 基线未被架构改写

| 基线主题 | 正式 00 下限 | Step 15 决定结果 | 审计判断 |
|---|---|---|---|
| C1 项目型在场 | ProjectMemberRef 主语 + GlobalMemberRef 身份锚;host truth 外置 | D01 / D03 / D05~07 / D09 保持 project-only 和 fail-closed | pass:no scope expansion |
| C2 入站与投递 | source-anchored screening、transient inspection、controlled delivery | D03~07 / D09 保持四态、body-free handoff、Runtime acceptance 外置 | pass:no local policy / raw path |
| C3 出站 | committed safe material、local decision / attempt 与 external result 分层 | D03 / D05~08 保持 material gate、local truth first 与 append feedback | pass:no downstream truth absorption |
| C4 追溯 | 同一语境 body-free trace + safe observation attempt / gap | D08 将其确认为 core semantics,但不扩大为 complete log / Evidence / backend | pass:no body / backend expansion |
| C5 摘要 / 出口 | summary 必需;outlet 可裁剪;全部可重建不反写 | D09 保留 Member Summary,只裁剪 outlet 激活并显式 not_available / gap | pass:no core summary removal |
| owner / dependency | Runtime / Tools / host / Bus / Governance / downstream truth 外置;Core-only compile | D03 / D04 / D09 保持 inward seams 和无 sibling package | pass:no owner / compile expansion |
| failures / NFR | fail-closed、分层、idempotent、late append、派生隔离、低敏材料 | D05~09 与 CC-L2M-001~016 一致 | pass:no NFR relaxation |
| acceptance / veto | 只定义可检查条件,不填 positive evidence | 矩阵只映射 AC / VF 到设计检查点,未宣告执行通过 | pass:no acceptance fabrication |

### 16.4 ADR 正式索引收口

正式 §17 只允许使用已正式编号并 Accepted 的 ADR。当前可进入正式索引的只有下列两项裁剪适用关系:

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 索引说明 |
|---|---|---|---|---|
| ADR-0004 | 运行态执行以 ProjectMemberRef 为主语并关联 GlobalMemberRef 身份锚 | 防止全局身份、Workspace view 或匿名进程替代项目执行归属 | 职责边界 / 上下文 / 数据归属 / 关键交互 | 只索引双层主体分离的当前适用部分;固定物理容器文字不继承。 |
| ADR-0005 | role-derived、verified、pinned member image / component 只作为 build-time static supply | 防止运行时安装 / mutable selector 与 image truth 侵入 member 运行语义 | 系统上下文 / 部署视图 / 依赖方向 / 演进 | 只索引静态供给与 pinned 约束;旧 Role 清单、stack、进程、指标和 readiness 不继承。 |

| 本地决定集合 | 长期性判断 | 当前 ADR 状态 | 正式 §17 处置 |
|---|---|---|---|
| D-L2M-03~09 | owner、dependency、data、consistency、communication、trace 与 projection 均长期影响主线,值得未来单独保留 | local ADR candidate / 未建立;本仓无专项正式 ADR 文件 | 不伪造 ADR 编号或文件,不进入正式 ADR 索引主表;决定本身由正式 §4~16 承载,未来正式建立 ADR 后再更新索引。 |

D01 / D02 是本仓对 upstream ADR 的 applicability 判断,不是新 ADR;D03~09 是 candidate,也不是已接受 ADR。该区分满足“长期决定不丢失”与“正式索引不伪造”两条约束。

### 16.5 正式 §16 追溯装配边界

| 正式输出 | Step 15 来源 | 装配要求 | 结论 |
|---|---|---|---|
| 需求追溯主矩阵 | §14.1~14.5 的 103 项逐项覆盖 | 转为规范固定列:需求来源、需求结论 / 约束、架构承接结果、承接位置、说明;只写已成立映射。 | ready_for_step_16 |
| 漏项检查 | §15.1~15.5 | 正式表只表达架构层追溯缺口;本轮无孤儿需求 / 决定。详细合同 pending 保留在正式 §15,不伪装追溯缺口或补齐计划。 | ready_for_step_16 |
| 追溯范围说明 | §14 / §15 | 用 3~5 句说明粒度、103 项校准覆盖和正式矩阵压缩原则;不写状态汇报。 | ready_for_step_16 |

正式 §16 不直接复制本文件的过程状态、`pass` 统计、blocker 处置或技术污染审计;这些用于证明装配输入合格。正式矩阵必须说明“为什么承接成立”,不能退化为章节编号清单。

### 16.6 最终跨审计表

| SOP 审计项 | 审计对象 | 审计结果 | 说明 |
|---|---|---|---|
| 需要长期保留的决定是否识别 | D01~09 | pass | D01 / D02 进入 upstream ADR applicability;D03~09 保持 candidate。 |
| 每个决定是否完成单项停审 | §5~13 | pass:9 / 9 | 均检查长期性、来源、边界、非新增和索引资格。 |
| 需求追溯是否完整 | §14 | pass:103 / 103 | FR / E 15、BR 30、NFR 16、AC 33、VF 9 无缺 / 额外 / 重复行。 |
| 是否存在孤儿核心需求 / 关键约束 | §14 / §15.1 | pass:none | 每项有具体 BC / D / Step,外围增强保持只读。 |
| 是否存在孤儿架构决定 / 取舍缺来源 | §15.2 | pass:none | D01~09 均有 requirement、停审 Step 与 downstream constraint。 |
| 决定之间是否冲突 | §16.2 | pass:none | core / async、C5 / projection 等表面张力已去歧义。 |
| 是否改写正式需求范围 | §16.3 | pass:none | 无非项目型放行、无 outlet / trace / owner 扩张或核心摘要删除。 |
| 普通实现选择是否误入 ADR | §15.4 / §16.4 | pass:none | 产品、协议、字段、存储、指标均未选择;candidate 未伪正式 ADR。 |
| 是否新增未确认结论 | §15.3 / §16.1 | pass:none | UP / Q / AQ 与进行中 sibling 仍按 pending / trigger 处理。 |
| 历史污染是否回流 | §15.5 | pass:none | CloudEvents / AG-UI / UDS / launch token / stack /指标均逐项裁剪。 |
| 是否伪造实现 / evidence / readiness | 全文件 | pass:none | 仅设计 gate;无 positive implementation / test / integration claim。 |
| 是否存在 unresolved 跨 ADR / requirements 冲突 | §16.1~16.5 | pass:none | 写后引用、状态、术语、表结构与 sibling authority 复核均通过。 |

### 16.7 Step 15 写入检查点

| 检查项 | 当前结果 |
|---|---|
| ADR 索引结论是否与正式编号规则一致 | pass:正式主表仅 ADR-0004 / 0005;D03~09 不伪编号 |
| 需求追溯、漏项与决定停审记录是否齐全 | pass:D 9 / 9;正式编号 103 / 103 |
| 九项决定、七个上下文、五类数据 / 三类通信是否互相一致 | pass |
| sibling refresh 是否遵守 authority | pass:service Step 16 allowed 仍不升格;images 正式 01 stop_review 经 drift check 后只精化 pending supply / release 边界 |
| 是否无 unresolved 冲突、新增未确认项或普通实现选择 | pass:none |
| 是否可进入 Step 16 | pass:只允许先创建 Step 16 并完成 pre-assembly audit |

`Step 15 gate = pass`。D01~09 单项停审、103 项需求追溯、漏项检查、ADR 正式编号边界、跨决定一致性、sibling 漂移与历史污染审计均通过,没有 unresolved 冲突或新增未确认结论。下一允许动作仅为创建 `01_arch_step_16_formal_document_assembly.md` 并先完成正式装配前审计;该前置门禁通过前仍不得修改旧正式 `01-架构设计.md`。
