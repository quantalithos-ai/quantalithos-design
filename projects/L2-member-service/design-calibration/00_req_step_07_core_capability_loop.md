# Step 07. 核心能力闭环

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-21）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 7
- 回填章节：`00-需求文档.md` §7（书写规范 4.7）

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 02 / 04 / 06；draft/03；ADR-0004 / 0005；runtime / tools / sandbox 正式边界
- [x] SOP 问题回答：见 §3
- [x] 旧材料与前版 Step 07 诊断：见 §4
- [x] 设计取舍：见 §6
- [x] 结构化中间产物：五节点表、闭环图、层级表与停审清单，见 §7
- [x] 复杂度判断：五个能力节点；后续 Step 按节点独立小循环
- [x] 回填草稿：见 §8
- [x] 自检：见 §10
- [x] MSVC-UP-009 authority 二次复核：Accepted ADR 已排除 `GlobalMember` / `PersonalWorkspace` 作为运行时容器粒度，但未定义 DM-only 宿主的第三种执行主语
- [x] 范围 blocker 处置：用户明确同意 §9.1 选项 A，当前版仅支持项目型宿主

## 2. 本步输入

- 前序产物：Step 02 / 04 / 06。
- 当前 authority：`architecture/adr/0004-global-vs-project-member.md`；`architecture/adr/0005-member-image-per-role.md`；`L1-identity/00~01`；`L1-work/00~01`；`L2-tools/00~02`；`L2-runtime/00~02`；`L4-sandbox/00~03`。
- MSVC-UP-009 补充核对：ADR-0004 §2.1 明确 `GlobalMember` 不是运行时容器、`PersonalWorkspace / ProjectWorkspace` 是 view / context / projection、`ProjectMember` 是项目执行容器粒度；ADR-0005 §2.2 的 member-service 启动输入也是 `ProjectMember`。`L1-workspace/README.md` 仍是未完成 00/01 校准的占位材料，`architecture/adr/drafts/0015-member-workspace-view.md` 仍是 draft，二者只作缺口审计，不能补写第三种执行主语。
- 讨论输入：draft/03 六能力候选；2026-08-21 用户同意审计结论与修复方向，不构成对候选节点的逐条签署。
- 前序门禁：Step 06 `pass`（字段与实现形态仍有 pending contracts）。

## 3. SOP 问题回答

1. 如果没有这个仓，系统会缺什么不可替代能力？

   回答：缺少把正式成员 / 项目事实转化为受控执行宿主的唯一控制面与 host truth owner。宿主是否应建立、是否真实就绪、是否仍健康、失败后如何恢复或终止以及历史如何闭合都将无人负责。

2. 哪些能力必须共同成立？

   回答：五项能力缺一不可：宿主意图与执行主语可受理；宿主装配与隔离就绪可判定；注册与运行会话可用；健康、恢复与终止受控；生命周期事实、清理与对账闭合。

3. 哪些只是外围增强或边界外能力？

   回答：safe view、容量 / 放置优化、镜像预热、策略传递和 forensic 材料交接属于外围增强或 owner pending。run / turn / checkpoint、工具执行、逐动作 Sandbox execute、镜像构建、隔离 truth、治理裁决及 L1 领域 truth 均在边界外。

4. 宿主以什么业务主语运行？

   回答：当前可被正式证明的主线是项目型宿主：`ProjectMemberRef` 是项目执行主语，`GlobalMemberRef` 只是身份锚，不能单独提供项目执行上下文。ADR-0004 §2.1 已明确 `GlobalMember` 不是运行时容器、`PersonalWorkspace` 不是新的业务真相，`ProjectMember` 是项目执行容器粒度；ADR-0005 §2.2 也只给出 `ProjectMember` 启动输入。由此可以正式排除“直接以 `GlobalMemberRef` 或 `PersonalWorkspaceRef` 充当非项目宿主执行主语”，也不能从“DM 可读取 PersonalWorkspace”推导出“DM 必然有一种独立宿主”。用户已选择当前版只支持项目型宿主；其他 launch fail closed，未来扩展须先定义第三种正式主语并重开 C-MS-1。

5. Sandbox 交接在闭环中的位置是什么？

   回答：本仓拥有宿主级 `SandboxBinding` 装配结果、bind / release 关联与允许的反馈 refs，它们属于宿主装配就绪与生命周期闭合。逐动作 execute 的调用、ToolInvocation 和 run progression 不归本仓；相应 caller 已由 tools / runtime 正式边界拥有或仍待正向合同闭口。

## 4. 当前材料问题诊断

| 位置 | 问题 | 修复 |
|---|---|---|
| draft/03 与前版 Step 07 | 六个节点且 C-MS-5 横向连入多个节点，超过规范建议的 3~5 个节点并形成非单向链 | 合并为五节点单向能力链，宿主级隔离绑定归入装配就绪 |
| 前版闭环图 | 出现外部仓名、bind / execute / release 和“执行顺序”清单 | 图中只保留能力成立描述；外部 owner 与协议动作移到表格和边界说明 |
| 前版 C-MS-5 | 暗示本仓承接逐动作 Sandbox execute | 明确逐动作 execute 归 tools / runtime 正式边界，本仓不提交 ToolInvocation、不推进 run |
| 前版宿主锚定 | 把 ADR 内部张力直接裁成“一切宿主 1:1 ProjectMember”，并把非项目型宿主判为不阻塞 | 只确认项目型宿主执行主语；非项目型宿主升级为 MSVC-UP-009 范围 blocker |
| MSVC-UP-009 初次表述 | 把“非项目型主语是否存在”和“哪些候选已被排除”混在一个开放问题里 | 已正式排除 `GlobalMember` / `PersonalWorkspace` 容器粒度；仅保留“本版是否要求第三种宿主主语”的范围决定 |
| 前版功能映射 | 回指旧 F-001~010，让 historical_material 反向组织新闭环 | 删除旧功能编号映射；Step 09 只能从新故事与五节点生成需求 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心节点 | 六节点 + 横向 C5 | 五节点单向闭环 | 符合需求规范 4.7，能力逻辑更清晰 |
| 隔离交接 | 独立 C5 含 execute | 装配就绪内的宿主 binding；逐动作 execute 排除 | 保护 tools / runtime / sandbox owner 边界 |
| 宿主主语 | 全局宣称 1:1 ProjectMember | 项目型宿主以 ProjectMemberRef 执行；GlobalMemberRef 仅身份锚 | authority 只足以支持当前项目型能力切片 |
| 非项目型宿主 | 非阻塞待确认 | 先升级为范围 blocker；用户随后选择当前版项目型-only，未来扩展保持 fail closed | 避免平台 Assistant / DM 场景被无依据纳入或伪造 ready |
| historical 功能 | 旧 F 编号映射新闭环 | 不继承旧编号 | full-restart 禁止旧材料成为组织基线 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保留六节点和独立 Sandbox handoff 节点 | 接近 draft | 节点过多；把宿主绑定与逐动作执行混层 | 不采用 |
| 五节点，宿主 binding 并入装配就绪，清理 / 对账 / handoff 并入生命周期闭合 | 单向能力链；owner 清晰 | C-MS-2 / C-MS-5 各自内容较密 | 采用，后续功能层再拆行为 |
| 全局锁定一宿主 1:1 ProjectMember | 项目场景简单 | 无法解释 ADR 张力和非项目 Assistant | 不采用为全局规则 |
| 用 `GlobalMemberRef` 或 `PersonalWorkspaceRef` 作为 DM-only 宿主主语 | 看似能快速覆盖私聊场景 | 违反 ADR-0004 的身份 truth / view / runtime container 分层；会把视图或身份锚误当执行主语 | 不采用 |
| 当前项目型切片锁 ProjectMemberRef，非项目型 fail closed | 能推进有 authority 的范围且不脑补 | 非项目能力需要未来重开 | 采用；用户已确认当前版范围 |

## 7. 结构化中间产物

### 7.1 闭环定义

`L2-member-service` 的核心闭环是：正式宿主意图和执行主语能够被安全受理，宿主能够按正式镜像引用与运行环境约束装配到可判定的隔离就绪状态，宿主内进程能够注册并建立可用运行会话，宿主健康与失败能够触发显式恢复或终止决定，最后清理、对账与已提交宿主事实能够闭合。任何一项缺失都会分别产生无来源宿主、伪就绪实例、不可连接实例、静默故障或无法收尾的残留宿主。

### 7.2 核心能力节点表

| 节点 | 能力成立描述 | 本仓拥有 | 外部 owner / pending 边界 |
|---|---|---|---|
| `C-MS-1` 宿主意图与执行主语可受理 | 正式来源的 launch / stop / restart / relocate / no-action 意图可验证、去重并形成显式决定；项目型宿主具备 ProjectMember 执行主语和 GlobalMember 身份锚 | 受理判断、编排决定及历史 | identity / work truth 不归本仓；当前版非项目型 launch fail closed，未来扩展须重开 MSVC-UP-009 |
| `C-MS-2` 宿主装配与隔离就绪可判定 | 正式 pinned image ref、运行环境需求、宿主凭据和适用的宿主级 SandboxBinding 装配结果共同成立；部分成功不得伪装 ready | 宿主实例身份、装配结果、host readiness | image manifest 合同、credential owner、SandboxBinding 字段 pending；镜像内容和 isolation truth 外置 |
| `C-MS-3` 注册与运行会话可用 | 宿主内进程凭正式凭据注册，endpoint 与 host session 关联唯一、可查询、可失效；runtime run 只以 ref 关联 | 注册受理、endpoint 登记、会话壳与关联历史 | member 合同和 runtime entry pending；member 内部与 run truth 外置 |
| `C-MS-4` 健康、恢复与终止受控 | 心跳与宿主健康可判定；host / session / backend / unknown 失败分层；恢复、重启、停止或 hold 均由显式决定触发，新实例不改写旧历史 | 健康判定、宿主失败分类、恢复 / 终止决定 | runtime failure / checkpoint、业务影响、observed truth 外置 |
| `C-MS-5` 生命周期事实、清理与对账闭合 | 注册失效、宿主停止、宿主级 binding release、残留 / 孤儿对账和已提交事实交接均可追溯；attempt / gap 不冒充 delivered / observed | 清理事实、对账结果、本地 handoff attempt / gap、safe view 来源 | sandbox cleanup truth、bus delivery、observability observed 与下游接受外置 |

### 7.3 核心能力闭环图

```text
宿主意图与执行主语可被安全受理
  -> 宿主装配与隔离就绪可被可靠判定
  -> 注册与运行会话能够稳定可用
  -> 健康、恢复与终止能够受控
  -> 生命周期事实、清理与对账能够闭合
  -> 新的正式意图可以基于已闭合历史再次受理
```

图只表达能力成立的逻辑依赖，不表达调用、事件、协议、运行时顺序或实施步骤。

### 7.4 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | C-MS-1 宿主意图与执行主语；C-MS-2 装配与隔离就绪；C-MS-3 注册与会话；C-MS-4 健康、恢复与终止；C-MS-5 清理、对账与事实闭合 |
| 外围增强能力 | 宿主状态 safe view；容量 / 放置 / 批量启停优化；forensic 保留与诊断材料交接；镜像预热；policy 到宿主的传递路径（owner pending） |
| 边界外能力 | run / turn / checkpoint；tool execution / ToolInvocation；逐动作 Sandbox execute；member 内部门面；镜像构建 / 签名 / BOM；isolation truth；治理裁决；identity / work truth；observability backend；产品 UI；编排平台产品本体 |

### 7.5 节点停审清单

| 节点 | 停审必须证明 |
|---|---|
| C-MS-1 | 意图来源、去重和决定语义成立；项目型执行主语可验证；非项目型路径保持 blocked |
| C-MS-2 | pinned image ref、凭据与宿主级 binding 边界成立；部分成功不伪装 ready |
| C-MS-3 | 注册、endpoint、会话唯一性与失效语义成立；pending 对端不被伪造 |
| C-MS-4 | 健康与四类失败分层成立；恢复 / 终止显式且不改写旧实例 |
| C-MS-5 | 清理、release 关联、残留 / 孤儿对账和 handoff 状态分层成立 |

任一正向合同未闭口时，对应节点只能进入 `pending`、`waiting`、`blocked`、`degraded` 或 `unknown`，不得声明 ready。

## 8. 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_07_core_capability_loop.md`

正式装配时只回填 §7.1~§7.4；诊断、取舍、停审过程与 blocker 留在本文件。

## 9. 待确认事项 / blocker

| ID | 问题 | 影响 | 当前处置 |
|---|---|---|---|
| `MSVC-UP-009` | 本版是否必须支持非 ProjectMember-scoped 宿主（例如仅处理 DM / PersonalWorkspace 的平台 Assistant）；若必须支持，其第三种正式执行主语是什么 | 决定 C-MS-1 的完整输入空间、宿主唯一性与故事范围 | resolved_for_current_scope；用户于 2026-08-21 明确同意选项 A。当前版只支持项目型宿主；其他 launch fail closed；未来扩展必须由正式 ADR / 上游合同先定义第三种主语并重开 C-MS-1 |
| `MSVC-UP-006` | launch credential 的签发 / 撤销 owner | 影响 C-MS-2 readiness | owner_pending；只锁定可撤销、不复用、可审计语义 |
| `MSVC-UP-004` | 宿主级 binding / release 字段和非工具维护动作 caller | 影响 C-MS-2 / C-MS-5 字段与协议 | contract_pending；逐动作工具 execute 明确排除 |

### 9.1 待签署范围口径

| 选项 | 当前版口径 | 后果 |
|---|---|---|
| A（已选择，2026-08-21） | 当前版只支持 `ProjectMemberRef` 执行主语的项目型宿主；DM / PersonalWorkspace 只作为外部上下文消费场景，不在本版生成独立宿主。未来若需要非项目型宿主，必须先由正式 ADR / 上游合同定义第三种执行主语，再重开 C-MS-1。 | Step 07 通过；Step 08 只编写项目型宿主故事；不伪造平台 Assistant 宿主能力。 |
| B | 当前版必须覆盖 DM-only / 平台 Assistant 宿主。 | Step 07 继续 blocked，直到上游正式定义第三种执行主语、生命周期和唯一性；本仓不能代定义。 |

用户于 2026-08-21 在收到 A / B 明确选项后回复“同意”，按唯一推荐项 A 记录；该确认只闭合 MSVC-UP-009 当前版本范围，不关闭其他跨项目 pending contracts。

## 10. 进入下一步条件

- [x] 核心节点已收敛为五节点能力链，图中无接口、外部仓、实现动作或实施顺序
- [x] 核心 / 外围 / 边界外能力已分层
- [x] Sandbox 宿主 binding 与逐动作 execute 已分开
- [x] 项目型宿主的双锚边界成立（ProjectMember 执行主语 + GlobalMember 身份锚）
- [x] 已确认 `GlobalMember` / `PersonalWorkspace` 不能充当非项目型宿主执行主语
- [x] MSVC-UP-009 已明确选择 A；非项目型宿主作为未来扩展且保持 fail closed

结论：gate_status = pass。Step 07 已完成；允许按 SOP 进入 Step 08，但不得把非项目型宿主写入当前版用户故事。
