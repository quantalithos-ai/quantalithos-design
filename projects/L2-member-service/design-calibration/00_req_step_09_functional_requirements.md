# Step 09. 功能需求

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 9
- 回填章节：`00-需求文档.md` §9（书写规范 4.9）
- 范围基线：当前版只支持以 `ProjectMemberRef` 为执行主语的项目型宿主；非项目型 launch fail closed

### 1.1 Step 内计划

- [x] 读取 Step 9 SOP、书写规范 4.9、Step 07 / 08 直接输入
- [x] 复核 Step 02 / 04 / 06 的边界、非目标、依赖与 fail-closed 口径
- [x] 核对 runtime / sandbox / tools 正式边界及并行兄弟当前停审状态
- [x] 按 `C-MS-1 -> C-MS-2 -> C-MS-3 -> C-MS-4 -> C-MS-5` 逐节点归并业务能力并停审
- [x] 为每项功能补齐能力级输入、输出、触发、失败、优先级与依赖
- [x] 区分核心功能、外围增强、owner pending 与边界外功能
- [x] 在独立结论形成后审计旧 `F-001~010`
- [x] 完成功能与故事双重映射、孤儿与跨节点串线审计

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 9 / 书写规范 4.9 | current_standard | 固定业务能力粒度、双重映射和逐节点停审门禁 |
| `00_req_step_07_core_capability_loop.md` | pass | 固定 C-MS-1~5 和核心 / 外围 / 边界外能力层级 |
| `00_req_step_08_user_stories.md` | pass | 提供 US-MS-001~015 与 US-MS-E01~E04；功能必须从故事归并 |
| Step 02 / 04 / 06 | pass | 保护 owner、非目标、依赖类型和 fail-closed 边界 |
| `L2-runtime` 当前正式 00~02 | current_formal | runtime 拒绝拥有 member host lifecycle；本仓不接管 run / checkpoint 内容 |
| `L4-sandbox` 当前正式 00~03 / `L2-tools` 当前正式 00~02 | current_formal | 本仓只拥有宿主级 binding 关联；逐动作 execute / ToolInvocation 外置 |
| `L2-member` 项目台账与正式 00 | requirement_boundary_formally_stopped；detailed_contract_pending | 需求级 owner 分工可正式消费；launch / register / heartbeat exact 合同仍 pending |
| `L2-member-images` 项目台账与正式 00 | requirement_boundary_formally_stopped；detailed_contract_pending | pinned entry 供给方向可正式消费；exact manifest / variant / ref / confirmation 合同仍 pending |
| 旧 `00-需求文档.md` §6 | historical_material | 只在新功能形成后做污染审计，不继承旧 F 编号、P0 / P1 或技术产品 |
| draft/03~04 | discussion_input | 只用于检查功能覆盖和未来分层交接，不反向定义正式功能 |

## 3. SOP 问题回答

1. 系统必须提供哪些业务能力？

   回答：当前版需要 12 项核心业务能力：项目型宿主意图受理、编排决定控制、正式装配条件形成、承载与隔离装配协调、装配就绪判定、可信注册、接入与会话可用性、健康与失败分层、恢复与终止控制、下线清理、残留孤儿对账、宿主事实安全交接。4 项外围增强单列。

2. 每项能力的输入、输出、触发与失败是否明确？

   回答：见 §6。只写能力级语义，不写 DTO、API、Command、事件、存储或内部流程；正向合同未闭口时输出必须停在 waiting / blocked / degraded / unknown / gap，不能声明 ready。

3. 哪些故事支撑同一功能？

   回答：意图与主语故事归并为 FR-MS-001；意图重试 / 冲突归并为 FR-MS-002；装配安全故事共同支撑 FR-MS-004 / 005；注册消费与调查故事归并为 FR-MS-006 / 007；健康调查故事归并为 FR-MS-008 / 009。完整映射见 §5 与 §9。

4. 哪些是核心，哪些只是外围增强？

   回答：FR-MS-001~012 是当前范围闭环必需；FR-MS-E01~E04 只优化容量、预热、调查材料和只读消费，不决定宿主闭环成立。

5. 哪些看似功能但不应进入本仓？

   回答：Policy 传递 owner、launch credential 签发 owner 尚未闭口，不预建功能；Role -> image 解析、run / checkpoint、逐动作工具执行、镜像构建、isolation truth、L1 truth、observability backend 和编排平台产品管理均不进入功能表。

## 4. 能力节点执行与停审

| 顺序 | 节点 | 功能范围 | gate_status | 停审结论 |
|---:|---|---|---|---|
| 1 | C-MS-1 | FR-MS-001~002 | pass | 意图 / 主语范围与稳定决定分开；无业务 truth 或非项目宿主进入 |
| 2 | C-MS-2 | FR-MS-003~005 | pass | 正式条件、装配协调、就绪判定分开；部分成功不冒充 ready |
| 3 | C-MS-3 | FR-MS-006~007 | pass | 可信注册与接入 / 会话可用性归并；不拥有 member / runtime 内部 |
| 4 | C-MS-4 | FR-MS-008~009 | pass | 健康 / 失败判定与恢复 / 终止决定分开；不接管 checkpoint |
| 5 | C-MS-5 | FR-MS-010~012 | pass | 清理、对账、安全交接分开；不冒充外部 cleanup / delivered / observed |
| 6 | 外围 / 边界审计 | FR-MS-E01~E04 + 裁剪表 | pass | 外围不成为核心前置，owner pending 与边界外功能未偷渡 |

## 5. 核心功能需求

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| `FR-MS-001` | 项目型宿主意图受理与范围判定 | 核心闭环能力 | 系统必须确认宿主意图具有正式来源、当前版支持的项目执行主语和可验证身份锚，并形成受理、拒绝或等待结论；不得因输入出现而隐式创建宿主。 | C-MS-1 | US-MS-001；US-MS-003 |
| `FR-MS-002` | 宿主编排决定与重复冲突控制 | 核心闭环能力 | 系统必须基于已受理意图和既有宿主事实形成显式编排决定，对重试、重复、并发冲突和无动作情况返回稳定且可追溯的结论。 | C-MS-1 | US-MS-001；US-MS-002 |
| `FR-MS-003` | 正式宿主装配条件形成 | 核心闭环能力 | 系统必须从正式 owner 提供的引用、允许摘要、新鲜度和运行环境需求形成可归责的装配条件，显式表达缺失、陈旧或冲突，不直接解析 Role -> image 映射。 | C-MS-2 | US-MS-004；US-MS-005 |
| `FR-MS-004` | 宿主承载与隔离装配协调 | 核心闭环能力 | 系统必须围绕已确认装配条件协调唯一宿主承载、正式镜像资产、所需挂载、宿主凭据与适用的宿主级隔离绑定，并保存各自归属清晰的装配结果。 | C-MS-2 | US-MS-005；US-MS-006 |
| `FR-MS-005` | 宿主装配就绪与安全降级判定 | 核心闭环能力 | 系统必须综合装配结果判定宿主是否达到装配就绪；任何必要前置缺失、部分成功、陈旧或未知都不得通过默认值或后端降级冒充就绪。 | C-MS-2 | US-MS-005；US-MS-006 |
| `FR-MS-006` | 可信注册与宿主实例关联 | 核心闭环能力 | 系统必须验证宿主内注册来源与当前宿主实例的关联，阻止凭据冒用、重放和冲突注册，并保留注册建立、替换或拒绝的可追溯结论。 | C-MS-3 | US-MS-007；US-MS-009 |
| `FR-MS-007` | 宿主接入与会话可用性维护 | 核心闭环能力 | 系统必须维护当前宿主接入位置、宿主会话关联及其可用、失效、陈旧或未知语义，使消费者不会依赖过期实例；会话壳不得取得 runtime run truth。 | C-MS-3 | US-MS-008；US-MS-009 |
| `FR-MS-008` | 宿主健康与失败分层判定 | 核心闭环能力 | 系统必须从允许的宿主、会话和后端信号形成分层健康结论，区分 host、session、backend 和 unknown 失败，不把进程存活等同业务成功或 runtime 进度。 | C-MS-4 | US-MS-010；US-MS-012 |
| `FR-MS-009` | 宿主恢复、重启与终止控制 | 核心闭环能力 | 系统必须基于正式意图、已提交宿主事实和失败分类形成恢复、重启、停止、终止或保持等待决定；新宿主必须关联旧实例而不改写旧历史。 | C-MS-4 | US-MS-011；US-MS-012 |
| `FR-MS-010` | 宿主下线清理与关联失效 | 核心闭环能力 | 系统必须在宿主结束或被替代后收束本地注册、会话和宿主级绑定关联，记录资源清理与释放的本地结论、尝试或缺口，不冒充外部 cleanup truth。 | C-MS-5 | US-MS-013 |
| `FR-MS-011` | 残留与孤儿宿主对账处置 | 核心闭环能力 | 系统必须识别控制面事实与承载 / 绑定反馈之间的残留、孤儿和漂移，形成修复、保持、升级或未知结论，且不得为消除差异而删除既有历史。 | C-MS-5 | US-MS-014 |
| `FR-MS-012` | 宿主事实安全表达与交接分层 | 核心闭环能力 | 系统必须从已提交宿主事实形成 body-free、可关联的安全消费材料，并区分本地结论、交接尝试、缺口与外部 delivered / observed / accepted 状态。 | C-MS-5 | US-MS-015 |

## 6. 核心功能的输入、输出、触发与失败

| 功能 | 能力级输入 | 能力级输出 | 触发条件 | 失败与 fail-closed 语义 |
|---|---|---|---|---|
| FR-MS-001 | 正式宿主意图、ProjectMember 执行主语、GlobalMember 身份锚、调用方语境 | 受理 / 拒绝 / 等待及原因 | 分配 / 回收事实变化或正式运维意图 | 来源缺失、主语无效、非项目型范围、授权不可证或事实陈旧 -> rejected / waiting；零隐式宿主 |
| FR-MS-002 | 已受理意图、当前宿主事实、既有决定与重复相关语境 | 新决定、稳定重放、冲突或 no-action 结论 | 首次、重复、并发或补偿性宿主意图 | 历史不可用、冲突无法裁定或提交结果未知 -> blocked / unknown；不执行第二套决定 |
| FR-MS-003 | 身份 / 项目引用、正式镜像引用与允许清单、环境需求、策略摘要、隔离需求 | 来源清晰的装配条件或显式条件缺口 | 需要建立新宿主的已提交决定 | owner / ref / freshness 不可验证、合同 pending 或输入冲突 -> waiting / blocked；不本地补正文 |
| FR-MS-004 | 已确认装配条件、承载后端能力、镜像资产可用性、凭据与宿主级 binding 能力 | 唯一宿主实例关联及分项装配结果 | launch / restart / relocate 决定要求新宿主 | 后端不可用、拉取失败、绑定失败、超时、部分或结果未知 -> partial / blocked / unknown；禁止安全降级 |
| FR-MS-005 | 分项装配结果及其验证 / 新鲜度状态 | ready / blocked / degraded / unknown 的装配就绪结论 | 装配结果建立或任一必要前置变化 | 任一必需结果缺失、失效、矛盾或不可验证 -> 非 ready；不得用单一后端成功覆盖缺口 |
| FR-MS-006 | 宿主实例、注册来源证明、项目型主语关联、当前注册事实 | 注册建立 / 替换 / 拒绝结论与实例关联 | 宿主内来源首次注册或重新注册 | 凭据无效 / 重放、实例或主语不匹配、活动注册冲突、对端合同未闭口 -> rejected / blocked |
| FR-MS-007 | 已提交注册、宿主接入与会话关联、生命周期变化和允许的 runtime refs | 当前可用性语义及连续变更历史 | 注册建立 / 替换 / 失效、宿主变化或安全读取 | 接入材料陈旧、迟到 / 冲突、对端不可用 -> stale / unavailable / unknown；不创建或推进 run |
| FR-MS-008 | 心跳、宿主 / 会话状态、承载与绑定反馈及其来源状态 | 分层健康结论、失败类别和未知原因 | 信号到达 / 缺失、周期性判定或后端变化 | 来源不可用、时序冲突、证据不足 -> unknown / degraded；不推断业务成功、runtime 失败或 observed truth |
| FR-MS-009 | 正式控制意图、已提交宿主事实、健康 / 失败结论、适用外部前置 | recover / restart / stop / terminate / hold 决定及实例世代关联 | 显式停止 / 恢复意图或宿主异常 | 前置合同不可用、冲突决定、外部副作用未知 -> hold / blocked / escalation；不承诺 runtime checkpoint 恢复 |
| FR-MS-010 | 终止 / 替代决定、注册 / 会话 / binding 关联和承载引用 | 本地失效、清理 / release 尝试、完成或 gap 结论 | 宿主终止、被替代或清理重试 | 外部清理失败 / 超时 / unknown -> residual / gap；不把 attempt 写成 external cleanup completed |
| FR-MS-011 | 本地宿主 truth 安全摘要、承载 / binding 反馈及已有清理结论 | 漂移分类、对账结论和修复 / 保持 / 升级决定 | 定期 / 人工对账、故障后检查或 gap 复核 | 外部视图不可用、不完整或相互冲突 -> unknown；不删除历史、不盲清理 |
| FR-MS-012 | 已提交决定、实例、注册、会话、健康、恢复、清理和对账事实 | safe material、本地 handoff attempt / gap 与关联状态 | 相关本地事实提交或授权消费 | Bus / observability / 下游不可用 -> gap；本地 truth 不回滚，不声明 delivered / observed / accepted |

## 7. 需求级优先级与功能依赖

P0 / P1 没有当前 release authority，旧优先级不继承。本 Step 使用需求级优先结论：`current_scope_must` 表示当前核心闭环缺一不可；`enhancement_after_core` 表示不阻塞当前闭环。

| 功能范围 | 优先结论 | 逻辑前置 / 功能依赖 | 说明 |
|---|---|---|---|
| FR-MS-001~002 | current_scope_must | 正式 identity / work 输入；FR-MS-002 依赖 FR-MS-001 的范围结论 | 依赖是能力成立关系，不是调用顺序 |
| FR-MS-003~005 | current_scope_must | 已提交编排决定；FR-MS-004 依赖 FR-MS-003，FR-MS-005 依赖分项装配结果 | 镜像、binding、凭据正向合同未闭口时 fail closed |
| FR-MS-006~007 | current_scope_must | FR-MS-005；FR-MS-007 依赖已提交注册 | member / runtime 对端合同 pending 不得伪造可用 |
| FR-MS-008~009 | current_scope_must | FR-MS-006 / 007；FR-MS-009 依赖健康结论或正式控制意图 | 宿主恢复与 runtime 内容恢复严格分离 |
| FR-MS-010~012 | current_scope_must | 已提交终止 / 替代及生命周期事实；FR-MS-011 消费允许反馈，FR-MS-012 只消费已提交本地事实 | 外部清理 / 交付 / 观测不反写本地 truth |
| FR-MS-E01~E04 | enhancement_after_core | 各自依赖对应核心 truth 和 safe material | 不成为核心功能前置 |

## 8. 外围增强功能

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| `FR-MS-E01` | 跨宿主容量与放置优化建议 | 外围增强能力 | 基于安全的宿主容量与状态摘要提供放置或资源优化建议，不直接改变宿主 truth 或基础设施策略。 | C-MS-1 / 2 的外围优化 | US-MS-E01 |
| `FR-MS-E02` | 正式宿主资产预热 | 外围增强能力 | 在不改变正式镜像引用和就绪语义的前提下预先准备宿主资产，降低后续装配等待。 | C-MS-2 的外围优化 | US-MS-E02 |
| `FR-MS-E03` | Forensic 关联材料增强 | 外围增强能力 | 为复杂调查形成更多 body-free 关联和材料交接，不保存归档 / 观测正文或形成外部 verdict。 | C-MS-4 / 5 的外围增强 | US-MS-E03 |
| `FR-MS-E04` | 聚合宿主安全视图 | 外围增强能力 | 从本仓 truth 派生经过裁剪、可延迟重建的聚合视图，服务安全浏览且不成为写源。 | C-MS-3~5 的外围消费 | US-MS-E04 |

| 外围功能 | 能力级触发与输出 | 失败边界 |
|---|---|---|
| FR-MS-E01 | 容量评估时输出建议 / 无建议 / 数据不足 | 输入陈旧或不足只返回 unavailable / stale，不直接调度 |
| FR-MS-E02 | 正式资产候选确定后输出预热结果或缺口 | 预热失败不改变后续正式装配结果，不冒充 ready |
| FR-MS-E03 | 调查请求或故障闭合时输出安全关联材料 / gap | 外部材料不可用不伪造 forensic completeness |
| FR-MS-E04 | 授权读取或派生重建时输出 safe / stale / unavailable view | 投影失败不反写真相，不暴露 secret 或敏感接入正文 |

## 9. Pending、边界外与旧材料审计

### 9.1 正向 pending 对功能的影响

| Pending | 影响功能 | 当前约束 |
|---|---|---|
| MSVC-UP-001 runtime entry / session surface | FR-MS-007 / 009 / 012 | 只定义宿主侧关联与 handoff；不定义 runtime entry 或恢复成功 |
| MSVC-UP-002 member launch / register / heartbeat 合同 | FR-MS-006~008 | 需求级 owner 分工已正式停审；exact 合同和正向联调 pending |
| MSVC-UP-003 member-images pinned ref / manifest 合同 | FR-MS-003~005 | 需求级 pinned entry 方向已正式停审；exact 合同 pending，引用不可验证则 blocked |
| MSVC-UP-004 SandboxBinding / release 字段 | FR-MS-004 / 005 / 010 / 011 | 只锁宿主级语义；逐动作 execute 明确排除 |
| MSVC-UP-005 policy 传递 owner | 不进入当前功能表 | owner 闭口后判断是否重开 Step 04 / 07~09 |
| MSVC-UP-006 launch credential owner | FR-MS-003~006 | 只消费可撤销、不复用、可审计的正式结果；不拥有签发功能 |
| MSVC-UP-007 Core schema / event family | FR-MS-001~012 | 只写能力类别，字段 / schema 后移且不得本地 shadow |
| MSVC-UP-008 SDK dependency target | 不改变需求功能 | 只影响后续编译 / Server 自测试边界 |
| MSVC-UP-009 非项目型宿主 | resolved_for_current_scope | 当前版 fail closed；未来纳入须重开 C-MS-1、Step 08 / 09 |

### 9.2 边界外功能裁剪

| 候选功能 | 裁剪原因 | 正确 owner / 处理 |
|---|---|---|
| run / goal / plan / checkpoint 恢复 | 属于运行内容 | `L2-runtime`；本仓只决定宿主恢复并关联 refs |
| ToolInvocation 与逐动作 Sandbox execute | 属于工具执行 / 隔离 handoff | `L2-tools` / `L2-runtime` / `L4-sandbox` |
| Role -> image variant 解析 | 会形成第二定义路径 | `L3-method-library -> L2-member-images`；本仓只消费正式 pinned ref |
| 镜像构建、签名、BOM、扫描和发布 | 属于镜像资产 truth | `L2-member-images` |
| Policy 内容、裁决和宿主传递 | truth 外置且传递 owner 未决 | `L1-governance`；MSVC-UP-005 闭口前不预建 |
| launch credential 签发 / 撤销体系 | owner 未决且身份 / 安全 truth 外置 | MSVC-UP-006；本仓只消费正式结果 |
| identity / work / member 主体 truth | 本仓只持引用 / 允许摘要 | `L1-identity` / `L1-work` / `L2-member` |
| isolation / cleanup truth | 本仓只持宿主级 binding / release 关联 | `L4-sandbox` |
| delivery / observed / evidence / archive truth | 本仓只拥有 attempt / gap | Bus / Observability / Artifact / Archive owner |
| Docker / Kubernetes / registry 产品管理 | 载体不得反向定义业务功能 | 基础设施 adapter / SRE 平台 |

### 9.3 旧 `F-001~010` 后置污染审计

| 旧功能 | 问题 | 当前处理 |
|---|---|---|
| F-001 Orchestrator 抽象 | 架构抽象和具体产品混入需求 | 不继承；业务语义由 FR-MS-002 / 004 / 009 承接，adapter 后移 01 / 03 |
| F-002 Endpoint Registry | 以实现组件 / 对象映射代替能力 | 不继承；归并为 FR-MS-006 / 007 |
| F-003 Heartbeat Monitor | 带固定 `30s x 3` 规则 | 不继承；能力进入 FR-MS-008，阈值后移 Step 10 / 04 |
| F-004 Policy Proxy | owner 未闭口且承诺动态下发 | 不进入当前功能表；保留 MSVC-UP-005 |
| F-005 Identity Cache | 实现缓存反向定义功能 | 不继承；owner-safe 条件进入 FR-MS-001 / 003 |
| F-006 Role -> image_variant 查询 | 违反间接 `method-library -> member-images` 路径 | 删除；FR-MS-003 只消费正式 pinned ref / manifest |
| F-007 Container Launcher | 具体 adapter 动作代替业务能力 | 不继承；归并为 FR-MS-004，产品 API 后移 |
| F-008 Graceful Lifecycle | 启停 / 迁移 / 清理混成宽泛动作 | 拆入 FR-MS-002 / 009 / 010 |
| F-009 ResolveMemberForContainer | 内部函数名且暗示拉取外部正文 | 删除；允许的正式引用 / 摘要归 FR-MS-003 |
| F-010 Crash restart + checkpoint 恢复 | 把 host 重启和 runtime checkpoint 混层 | host 处置归 FR-MS-009；checkpoint 恢复继续归 `L2-runtime` |

旧 F 编号、P0 / P1、Docker / Kubernetes、cache、固定阈值与函数名一律不进入当前正式功能编号体系。

## 10. 功能映射与跨节点审计

| 节点 | 核心功能 | 核心故事 | 能力级停审结论 |
|---|---|---|---|
| C-MS-1 | FR-MS-001~002 | US-MS-001~003 | 主语 / 意图 / 决定完整，无非项目范围污染 |
| C-MS-2 | FR-MS-003~005 | US-MS-004~006 | 条件 / 装配 / 就绪完整，无 role 解析或 isolation truth 串线 |
| C-MS-3 | FR-MS-006~007 | US-MS-007~009 | 注册 / 接入 / 会话历史完整，无 member / runtime 内部串线 |
| C-MS-4 | FR-MS-008~009 | US-MS-010~012 | 健康失败与恢复决定完整，无阈值或 checkpoint 串线 |
| C-MS-5 | FR-MS-010~012 | US-MS-013~015 | 清理 / 对账 / 交接完整，无外部 truth 反写 |
| 外围增强 | FR-MS-E01~E04 | US-MS-E01~E04 | 每项有故事来源，均不成为核心前置 |

| 审计项 | 结论 |
|---|---|
| 无功能承接的已确认故事 | 0；19 条故事均至少映射一项功能 |
| 无故事来源的功能 | 0；12 核心 + 4 外围均有明确故事来源 |
| 一条故事机械改写成一项功能 | 否；C-MS-1~4 均存在多故事归并，功能按业务能力拆分 |
| CRUD / API / Command / 对象 / 内部函数清单 | 无 |
| 功能跨节点重复 | 无；每项核心功能只有一个主节点，跨节点依赖在 §7 表达 |
| 边界外 / owner pending 偷渡 | 无；Policy 传递和凭据签发未进入功能表 |
| sibling readiness 伪造 | 无；member / member-images 只消费已停审需求级边界，exact contract 与正向 readiness 继续 pending |
| historical pollution | 无；旧编号、优先级、技术产品和固定数字未继承 |

## 11. 回填草稿与进入下一步条件

### 11.1 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_09_functional_requirements.md`

正式装配时采用：§5 核心功能表、§8 外围增强功能表、§7 的需求级优先结论和 §10 的节点映射摘要。§6 的能力级输入 / 输出 / 触发 / 失败作为 §9 子节保留；过程诊断、旧材料审计和 pending 明细留在校准材料，正式风险表由 Step 15 承接。

### 11.2 待确认事项

- MSVC-UP-001~008 不阻止需求级功能成立，但继续阻止相关字段、协议、owner、adapter、实现依赖和真实 readiness 被宣称闭口。
- Policy 传递与 launch credential 签发若确认归本仓，必须重开受影响 Step，不能直接追加实现功能。
- 非项目型宿主未来纳入时必须重开 C-MS-1、Step 08 和本 Step。

### 11.3 门禁自检

- [x] 每项功能有编号、能力类型、说明、核心节点和故事双重映射
- [x] 12 项核心功能、4 项外围功能均有能力级输入 / 输出 / 触发 / 失败或外围失败边界
- [x] 已给出需求级优先级和功能逻辑依赖，未伪造 P0 / P1 release authority
- [x] 五个能力节点逐一停审，无故事孤儿或功能孤儿
- [x] 未按 CRUD、API、Command、对象、组件或内部函数拆分
- [x] pending 与边界外功能均已裁剪；兄弟项目当时未停审内容未当正式 truth，终审刷新后只消费其正式需求级边界
- [x] 未写业务规则、字段 schema、数据归属、接口协议、NFR、验收或实现方案

结论：`gate_status = pass`。核心功能 12 项，外围增强功能 4 项，孤儿故事 0，孤儿功能 0；允许在用户再次确认后进入 Step 10，正式 `00-需求文档.md` 仍禁止提前写入。
