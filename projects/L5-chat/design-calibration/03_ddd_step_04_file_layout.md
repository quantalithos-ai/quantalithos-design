# L5-chat 03 · Step 4 实现单元与文件布局

> Step 状态：`done`；gate_status：`pass_with_upstream_blockers`
> 日期：2026-10-01重审；前轮2026-09-29纠错历史保留。生成依据：详细设计SOP Step4、书写规范5.4、目录及TS/Rust规范。
> 前置门禁：`03_ddd_step_03_constraints.md` 为 `done/pass_with_upstream_blockers`。
> 输入：正式 02 §4～§12、03 Step 2/3；目标实现仓为计划路径，不创建任何实现文件。
> 本文所有目录、package、crate、组件与测试位置是 planned；不表示实现/构建/验证事实。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 主体到实现单元映射 | §3/§4 | done | 七个概要组成部分均有责任目录 |
| 计划树与文件职责 | §5/§6 | done | 路径可直接用于未来建仓，不用 TBD替代布局 |
| 依赖与命名审查 | §7 | done | 无架构层级泄漏/owner path import |
| 差异、取舍、回填与自检 | §8～§11 | done | 上游 blocker 与目录 gate 分开；到 Step 4停审 |

## 2. SOP 问题回答

### 2.1～2.3 实现单元、概要对应与组织方式

一个私有前端 npm application package `chat`，一个 Tauri Rust host package `chat-desktop`，library `chat_desktop`、desktop binary `chat`。无 TS monorepo workspace、无独立服务端 api/worker/domain crates。共享 semantic core 是 app内按功能组织的纯 TS模块；React binding/UI 与 host bridge在相应目录隔离。七个概要组成部分映射见 §3，不修改其职责。

### 2.4～2.5 必建文件与职责

§5/§6列出 V1计划文件。每个文件有概要来源与职责，不逐对象制造文件；例如受控 intent协调器与 result gate分别承载流程与策略，其详细字段/函数在 Step 5+校准。Mobile app、通知/托盘插件、durable driver/crypto、测试运行脚本和报告 writer没有合同的部分不提前设文件。

### 2.6～2.11 命名

slug为 `chat`，目标仓 `/home/aris/Projects/quantalithos-chat`。TS单package不适用 Rust `crates/<role>`；Tauri原生集成目录采用 `src-tauri`，其单crate遵守 `chat-desktop` / `chat_desktop` / `chat` 命名。源码目录与 `.ts/.tsx/.rs` 文件snake_case；React导出符号UpperCamelCase，TS函数lowerCamelCase，Rust函数snake_case。源码路径/package无 L0～L6架构标号，不设置顶层 common/utils/helper。

### 2.12～2.13 依赖

根 package.json计划消费真实 sibling SDK TS package路径。Host Cargo.toml没有Quantalithos业务crate依赖，也不复制SDK。运行期owner能力只通过 `src/sdk/` 正式adapter消费，pages/components不直连owner/private API/internal bus。具体package映射与激活gate见 §7。

## 3. 实现单元与概要映射

| 实现单元 | 类型 | 主要责任 | 对应正式02 |
|---|---|---|---|
| 根 app / `src/app` | React应用装配 | ClientApplicationShell、页面注册、route binding、依赖装配 | §4、§6、§8 |
| `src/collaboration` | TS + React功能模块 | CollaborationSurfaceCoordinator、页面view model、选择、Turn展示 | §5.4、§6 |
| `src/collaboration`（项目/流程/目录） | 既有模块内TS + React | ProjectContextCoordinator/ProcessDrilldownCoordinator/DirectoryCoordinator，六新增对象及页面/只读图 | §5.4、§6.28～33、§7/8；不是新owner模块 |
| `src/intents` | TS + React功能模块 | UserIntentCoordinator、DraftCoordinator、CommandResultGate、composer/feedback | §5.5、§6、§8/§9 |
| `src/navigation` | TS安全导航模块 | RouteContextCoordinator、VisibilityGuard、ScopeEntryGuard | §5.6、§8 |
| `src/continuity` | TS变化/恢复模块 | ChangeReducer、ResumeCoordinator、RecoveryCoordinator | §5.7、§8/§9 |
| `src/platform` + `src-tauri` | TS host ports + Rust宿主 | PlatformCapabilityAdapter、AccessibilitySemanticAdapter、ShellLifecycleCoordinator | §5.8、§8 |
| `src/materials` | TS安全材料模块 | SafeMaterialComposer、ProvenanceMapper、FreshnessInterpreter、PreviewBoundary | §5.9、§6 |
| `src/local_state` | TS局部store与repository ports | ClientStateStore、DraftStore、LocalProjectionRepository、PersistenceSafetyGuard、CacheEvictionCoordinator | §5.10、§8 |
| `src/sdk` | TS integration模块 | SdkQueryAdapter、SdkCommandAdapter、SdkChangeAdapter、SdkReferenceAdapter、DiagnosticHandoffAdapter | §4/§7/§8 |
| `src/config` | TS运行装配输入 | 受限profile装配与校验，不配置truth/权限/result gate | §11/§12 |

SDK、app/config是实现支撑目录，不能被误写为新业务组成部分。

## 4. 目录 / package / crate / binary 映射

| 目录 | 类型 | npm / Cargo package | library / binary | 是否对外暴露 |
|---|---|---|---|---|
| `.` | private前端应用 | npm `chat` | WebView bundle；非公共SDK | 产品入口，不发布共享domain包 |
| `src/` | 仓内TS/TSX模块 | 属于 `chat` | 非独立package | 只通过app内模块边界消费 |
| `src-tauri/` | Tauri单crate | Cargo `chat-desktop` | lib `chat_desktop`；bin `chat` | 产品宿主与最小IPC，不开放业务API |
| `tests/` | 客户端测试源 | 属于 `chat` | runner由05/07绑定 | 非产品公开surface |
| `src-tauri/tests/` | host contract测试源 | 属于 `chat-desktop` | Rust测试入口 | 非业务集成证据 |

前端package与native crate是同一Desktop产品的两个实现单元，不是跨域后台服务。

## 5. 计划文件树

#### 文件布局图: V1 Desktop 客户端计划布局

```text
quantalithos-chat/
  package.json                       [private app and SDK source binding]
  package-lock.json                  [future resolved dependency lock]
  tsconfig.json                      [strict TypeScript constraints]
  vite.config.ts                     [UI build and development entry]
  index.html                         [WebView application document]
  src/
    main.tsx                         [React mount]
    app/
      client_application_shell.tsx   [application layout and lifecycle binding]
      application_composition.ts     [SDK, core and platform dependency wiring]
      page_registry.tsx             [page registration]
      client_routes.ts               [route declarations]
      client_state_binding.ts        [React subscription to local store]
      client_styles.css             [layout, focus, contrast and motion rules]
    navigation/
      route_context.ts               [local route context and safe reference types]
      route_context_coordinator.ts   [entry, back and context switch]
      entry_guards.ts                [VisibilityGuard and ScopeEntryGuard]
      client_consumption_context.ts  [current source/request context isolation]
    collaboration/
      collaboration_surface_coordinator.ts [safe surface orchestration]
      page_view_model_assembler.ts   [page models and selection projection]
      conversation_surface_view_model.ts [canonical ConversationSurfaceViewModel]
      project_context_coordinator.ts [project and associated conversation navigation]
      process_drilldown_coordinator.ts [read-only overall/stage/node queries]
      directory_coordinator.ts       [formal directory and separate member scopes]
      project_detail_view_model.ts   [one project with five tabs]
      project_navigation_state.ts    [local tab/stage/node/viewport/return state]
      process_flow_view_model.ts     [authorized topology and source state versions]
      process_node_detail_view_model.ts [independently authorized node sections]
      project_conversation_link_view_model.ts [formal relationship projection]
      company_directory_view_model.ts [provider coverage and safe directory pages]
      turn_presentation_model.ts     [owner-safe Turn presentation mapping]
      selection_state.ts             [selection, focus and expansion]
      pages/
        collaboration_entry_page.tsx [entry navigation]
        conversation_page.tsx        [group, channel and dm surface]
        thread_page.tsx              [thread context surface]
        project_list_page.tsx        [authorized Work project list]
        project_detail_page.tsx      [overview/progress/chats/work/evidence tabs]
        company_directory_page.tsx   [safe directory search and member entry]
      components/
        conversation_navigation.tsx  [conversation entry list]
        turn_renderer.tsx            [safe Turn variant dispatch]
        turn_list.tsx                [timeline/list presentation]
        gate_card.tsx                [controlled governance entry]
        artifact_reference.tsx       [safe reference presentation]
        artifact_preview.tsx         [authorized preview or unavailable]
        member_status_panel.tsx      [identity/member summaries kept distinct]
        project_progress_panel.tsx   [Work summary; Process graph uses read_only_process_renderer]
        project_conversation_links.tsx [separately authorized related targets]
        read_only_process_renderer.tsx [authorized graph and equivalent list]
        process_node_detail_panel.tsx [safe owner sections for current node]
        runtime_status_panel.tsx     [owner-provided runtime safe summary]
        workspace_summary_panel.tsx  [formal safe Workspace view only]
        material_status.tsx          [source/freshness/access posture]
    intents/
      user_intent_coordinator.ts     [conversation and governance intent dispatch]
      draft_coordinator.ts           [edit, preserve and clear local drafts]
      command_result_gate.ts         [formal result authority guard]
      command_attempt_state.ts       [local intent/attempt posture]
      intent_feedback_view_model.ts  [optimistic, waiting, failed and unknown feedback]
      message_composer.tsx           [local draft editing and submit affordance]
      intent_feedback.tsx            [result posture rendering]
    continuity/
      continuity_state.ts            [gap, resume and recovery-local models]
      change_reducer.ts              [formal change acceptance and local reduction]
      resume_coordinator.ts          [formal resume and requery coordination]
      recovery_coordinator.ts        [restart and unknown probe orchestration]
      recovery_view_model.ts         [safe recovery feedback]
      recovery_status.tsx            [offline, gap and restart surface]
    materials/
      safe_material_snapshot.ts      [safe display material and source refs]
      safe_material_composer.ts      [display-only composition]
      provenance_mapper.ts           [source mapping]
      freshness_interpreter.ts       [formal freshness interpretation]
      preview_boundary.ts            [preview authorization and availability]
    local_state/
      client_state_store.ts          [Chat-local state storage and subscriptions]
      draft_store.ts                 [local draft lifecycle]
      local_projection_repository.ts [restricted projection storage port]
      persistence_safety_guard.ts    [hold/persist/restore eligibility]
      cache_eviction_coordinator.ts  [logout, revoke, expiry and scope cleanup]
      memory_projection_repository.ts [safe fallback without durable claim]
    sdk/
      sdk_capability_binding.ts      [formal export/capability binding gate]
      sdk_query_adapter.ts           [formal safe reads]
      sdk_command_adapter.ts         [formal command and result mapping]
      sdk_change_adapter.ts          [formal changes and resume only]
      sdk_reference_adapter.ts       [formal reference and preview access]
      diagnostic_handoff_adapter.ts  [optional low-sensitivity handoff]
    platform/
      platform_ports.ts              [least-authority host interfaces]
      platform_capability_adapter.ts [availability interpretation]
      shell_lifecycle_coordinator.ts [window/background/restart signals]
      accessibility_semantic_adapter.ts [focus and semantic announcements]
      status_announcement.tsx        [accessible status expression]
      desktop_platform_adapter.ts    [Tauri host binding]
      web_preview_platform_adapter.ts [preview capability with explicit absences]
    config/
      client_config.ts               [typed configuration input]
      config_loader.ts               [load and validate before wiring]
  src-tauri/
    Cargo.toml                       [single host crate and product binary]
    Cargo.lock                       [future native dependency lock]
    build.rs                         [Tauri build integration]
    tauri.conf.json                  [Desktop window and bundle policy]
    capabilities/
      main.json                      [deny-by-default approved host capability scope]
    src/
      main.rs                        [Desktop binary entry]
      lib.rs                         [host composition]
      platform.rs                    [bounded host capability and lifecycle boundary]
    tests/
      platform_boundary_tests.rs     [native least-authority test cut]
  tests/
    navigation_boundary_tests.ts     [scope/visibility/navigation cut]
    intent_result_tests.ts           [ACK, unknown, retry and formal result cut]
    continuity_recovery_tests.ts     [duplicate/gap/resume/restart cut]
    persistence_boundary_tests.ts    [safe hold/clear/restore cut]
    presentation_accessibility_tests.tsx [UI/keyboard/focus/status cut]
    sdk_binding_tests.ts             [unavailable or formally bound capability cut]
    project_process_boundary_tests.tsx [hierarchy/parallel/source/context cut]
    directory_relationship_boundary_tests.tsx [directory/relationship access cut]
```

关键说明：

- 以上是未来实现仓的计划文件，当前不创建代码或lock；package-lock/Cargo.lock由获授权的依赖解析生成，不能手写伪造。
- 页面的 route/context只持客户端语境；SDK adapters承接owner truth，host不承担业务transport。
- 七个组成部分按功能组织，页面/组件和对象文件各有明确职责；测试文件只标切口，不是已执行用例。
- durable数据库/crypto driver、Mobile包、bus/BFF/backend、未知通知/托盘插件不在本树，待合同与授权闭合后再登记。

## 6. 文件职责与边界

下表路径均相对计划实现仓，文件组中的成员已在 §5 逐一列出。一个路径只属于一个职责组；此表不定义尚未校准的函数签名、协议schema或state字段。

| 文件/文件组 | 所属主体 | 定义内容与责任 | 后续闭合 |
|---|---|---|---|
| `package.json`、`package-lock.json` | frontend package | private `chat`、npm工具链、React/Vite依赖、SDK file引用与未来锁定 | 04/07 固定版本与命令；lock实际生成 |
| `tsconfig.json`、`vite.config.ts`、`index.html`、`src/main.tsx` | UI启动 | strict/ES modules、build入口、宿主document、React挂载 | 编译/安全配置04；不注入credential |
| `src/app/client_application_shell.tsx`、`application_composition.ts` | ClientApplicationShell | 页面布局/生命周期订阅、注入正式SDK adapter与local core/platform实现 | Step5/7/14 |
| `src/app/page_registry.tsx`、`client_routes.ts` | 路由装配 | 顶层对话/项目/成员；项目列表/详情五标签/流程下钻由同project路由context管理，不新增独立顶层进度；不透明ref不推owner scope | Step5/6；完整协议/流留后续Step8/9 |
| `src/app/client_state_binding.ts`、`client_styles.css` | React binding/视觉规则 | 只读取store selector、响应local变化；焦点/对比度/reduced-motion布局 | Step5/16 |
| `src/navigation/route_context.ts` | RouteContext | Chat-local route/access context，正式actor/scope/visibility只引用SDK源 | Step6/8 |
| `src/navigation/route_context_coordinator.ts`、`entry_guards.ts` | 安全导航 | 语境进入/切换/返回、VisibilityGuard/ScopeEntryGuard、撤销清理联动 | Step7/9/10 |
| `src/collaboration/collaboration_surface_coordinator.ts`、`page_view_model_assembler.ts` | 页面编排 | SDK安全读取到页面view model/selector，单处装配避免组件直接业务IO | Step5/7/9 |
| `src/collaboration/conversation_surface_view_model.ts`、`turn_presentation_model.ts`、`selection_state.ts` | 客户端展示对象 | 统一ConversationSurfaceViewModel、Turn呈现、选择/焦点；非owner DTO | Step6唯一命名与构造来源 |
| `src/collaboration/pages/collaboration_entry_page.tsx`、`conversation_page.tsx`、`thread_page.tsx` | 页面 | 协作入口、group/channel/dm页面和thread语境；共同消费view model | Step5路由/组件责任契约 |
| `src/collaboration/components/conversation_navigation.tsx`、`turn_renderer.tsx`、`turn_list.tsx` | 对话组件 | entry、列表、Turn类型分派；未知类型安全fallback，不猜业务类型 | Step5/8/16 |
| `src/collaboration/components/gate_card.tsx` | GateCard | Gate safe material与受控审批入口；只交intent coordinator，不本地确认Decision | Step5/8/9；CHAT-UP-003 |
| `src/collaboration/components/artifact_reference.tsx`、`artifact_preview.tsx` | Artifact展示 | body-free ref和经过正式授权的preview或unavailable | Step5/7/8；CHAT-UP-004 |
| `src/collaboration/components/member_status_panel.tsx`、`project_progress_panel.tsx`、`runtime_status_panel.tsx` | 摘要面 | 分owner展示identity/member、project和runtime；不统一推断生命周期/完成 | Step5/6/8；CHAT-UP-006 |
| `src/collaboration/components/workspace_summary_panel.tsx`、`material_status.tsx` | Workspace/source展示 | 正式Workspace safe view、source/freshness/access显化；无Inbox自行聚合 | Step5/8；CHAT-UP-005、WS-UP-* |
| `src/intents/user_intent_coordinator.ts`、`draft_coordinator.ts` | intent/draft用例 | 草稿、用户提交意图、正式command消费与受控重试/探测 | Step5/7/9/13 |
| `src/intents/command_result_gate.ts`、`command_attempt_state.ts`、`intent_feedback_view_model.ts` | attempt/result契约 | local optimistic与formal confirmed/failed/unknown的多轴映射；ACK不升级 | Step6/8/10 |
| `src/intents/message_composer.tsx`、`intent_feedback.tsx` | 编辑与反馈UI | 草稿输入、发送/重试affordance和正式结果呈现，无offline自动提交 | Step5/16 |
| `src/continuity/continuity_state.ts`、`recovery_view_model.ts` | 连续性对象 | ContinuityState/ResumeContext/ChangeAcceptanceRecord与恢复view model的定义位置 | Step6/10 |
| `src/continuity/change_reducer.ts` | ChangeReducer | SDK formal输入的验证/去重/顺序/可见性资格后更新local store | Step7～10/13；不直订bus |
| `src/continuity/resume_coordinator.ts`、`recovery_coordinator.ts`、`recovery_status.tsx` | 恢复编排与反馈 | resume/requery/unknown probe/重启恢复；缺口/离线提示和安全禁用 | Step7/9/12；CHAT-UP-002 |
| `src/materials/safe_material_snapshot.ts` | safe材料对象组 | SafeMaterialSnapshot、OwnerReference、ProvenanceMetadata、FreshnessMarker、PreviewReference唯一local定义点 | Step6/8；owner类型引用SDK |
| `src/materials/safe_material_composer.ts`、`provenance_mapper.ts`、`freshness_interpreter.ts`、`preview_boundary.ts` | safe材料策略 | 显示组合、来源映射、freshness解释和preview资格 | Step5/7/9 |
| `src/local_state/client_state_store.ts`、`draft_store.ts` | local stores | Chat-local状态、不可变snapshot/subscription和局部草稿生命周期 | Step6/10/11 |
| `src/local_state/local_projection_repository.ts`、`memory_projection_repository.ts` | repository port/fallback | LocalProjectionEntry/CacheLifecycleRecord与受限读写边界，memory不声称durable | Step6/7/11 |
| `src/local_state/persistence_safety_guard.ts`、`cache_eviction_coordinator.ts` | 持有/清理 | PersistenceSafetyGuard、logout/revoke/expiry/scope-change清理；失败不称cleared | Step9/11/12 |
| `src/sdk/sdk_capability_binding.ts` | SDK装配guard | 明确正式exports/capability可用性；未闭合即blocked/unavailable | Step7/8；CHAT-UP-001 |
| `src/sdk/sdk_query_adapter.ts`、`sdk_command_adapter.ts`、`sdk_change_adapter.ts`、`sdk_reference_adapter.ts` | SDK adapters | owner业务query/command/change/resume/ref的正式public mapping | Step7/8；无本地wire DTO/私有HTTP/bus |
| `src/sdk/diagnostic_handoff_adapter.ts` | optional安全handoff | 低敏类别和正式correlation/ref交接；缺能力不发raw日志 | Step7/15；CHAT-UP-007 |
| `src/platform/platform_ports.ts`、`platform_capability_adapter.ts` | host interface/能力 | 最小host接口、PlatformCapabilityState、explicit unavailable，不授予权限 | Step6/7/14 |
| `src/platform/shell_lifecycle_coordinator.ts`、`accessibility_semantic_adapter.ts`、`status_announcement.tsx` | platform/AT | 生命周期、AccessibilityState/StatusAnnouncement、focus/键盘/live-region语义 | Step6/9/16 |
| `src/platform/desktop_platform_adapter.ts`、`web_preview_platform_adapter.ts` | platform实现 | Tauri宿主binding与预览明确缺失能力；不含业务transport或持久化驱动 | Step7/14 |
| `src/config/client_config.ts`、`config_loader.ts` | 配置 | typed受限profile和启动校验/注入；不能覆盖hard invariant | Step14与04 |
| `src-tauri/Cargo.toml`、`Cargo.lock`、`build.rs`、`tauri.conf.json` | host工程 | package/bin/build、最小window/bundle/security配置 | 04/07；不伪造lock/证书/分发结果 |
| `src-tauri/capabilities/main.json` | host capability | 默认关闭，仅放行已闭合最小功能；不开放任意文件/shell/URL/网络 | Step7/14、04；权限未定保持blocked |
| `src-tauri/src/main.rs`、`lib.rs`、`platform.rs` | Rust host | bin启动、宿主装配与有限platform能力；不建立SDK/backend/domain实现 | Step5/7/14 |
| `tests/navigation_boundary_tests.ts`、`intent_result_tests.ts`、`continuity_recovery_tests.ts` | 核心测试切口 | route fail-closed、ACK/unknown/retry、duplicate/gap/resume恢复 | Step16/05；无真实结果 |
| `tests/persistence_boundary_tests.ts`、`presentation_accessibility_tests.tsx`、`sdk_binding_tests.ts` | 客户端测试切口 | 安全持有/清理、组件键盘状态、SDK未绑定安全失败 | Step16/05 |
| `src-tauri/tests/platform_boundary_tests.rs` | 原生测试切口 | IPC least-authority、未知capability不放行、无业务IO | Step16/05 |
| `src/navigation/client_consumption_context.ts` | ClientConsumptionContext | actor/scope/project/target/source/本地请求代次及失效姿态；不赋权 | Step6；已完成部分修复 |
| `src/collaboration/project_context_coordinator.ts` | ProjectContextCoordinator | 项目列表/详情五标签及双向群聊正式读取/局部导航编排 | Step5；typed port留未完成Step7 |
| `src/collaboration/process_drilldown_coordinator.ts` | ProcessDrilldownCoordinator | 整体→阶段→节点，Process只读query/版本与节点关联 | Step5/6；正式adapter受CHAT-UP008 |
| `src/collaboration/directory_coordinator.ts` | DirectoryCoordinator | 正式目录provider基础搜索/分页、人员详情/DM独立访问 | Step5/6；正式adapter受CHAT-UP009 |
| `src/collaboration/project_detail_view_model.ts` | ProjectDetailViewModel | Work安全概览/工作项/证据与五标签同project上下文 | Step6 |
| `src/collaboration/project_navigation_state.ts` | ProjectNavigationState | tab/stage/node/viewport/return局部状态，不证明正式关系 | Step6 |
| `src/collaboration/process_flow_view_model.ts` | ProcessFlowViewModel | 正式授权整体/阶段拓扑与状态版本/source/access分立 | Step6 |
| `src/collaboration/process_node_detail_view_model.ts` | ProcessNodeDetailViewModel | 正式节点关联及各owner独立安全section | Step6 |
| `src/collaboration/project_conversation_link_view_model.ts` | ProjectConversationLinkViewModel | 正式绑定/解绑/撤销及目标access投影，不创建关系 | Step6 |
| `src/collaboration/company_directory_view_model.ts` | CompanyDirectoryViewModel | 正式provider safe页/覆盖/搜索/页代次，不混成员集合 | Step6 |
| `src/collaboration/pages/project_list_page.tsx` | ProjectListPage | Work授权项目列表与选择详情入口 | Step5/6 |
| `src/collaboration/pages/project_detail_page.tsx` | ProjectDetailPage | 五标签容器；项目进度非顶级路由 | Step5/6 |
| `src/collaboration/pages/company_directory_page.tsx` | CompanyDirectoryPage | 公司目录搜索/分页/人员详情及获准DM入口 | Step5/6 |
| `src/collaboration/components/project_conversation_links.tsx` | ProjectConversationLinks | 项目/群聊双向入口与安全返回 | Step5/6 |
| `src/collaboration/components/read_only_process_renderer.tsx` | ReadOnlyProcessRenderer | 成熟只读viewer adapter；图/列表/焦点/缩放，与Gate分立 | Step5/6；实际库未绑定 |
| `src/collaboration/components/process_node_detail_panel.tsx` | ProcessNodeDetailPanel | 节点Work/Gate/Artifact/Runtime/诊断安全section | Step5/6 |
| `tests/project_process_boundary_tests.tsx` | planned测试切口 | 五标签/分层/并行Gateway与独立Gate、父图变更/受限图/迟到响应 | 未来Step16/05，不执行 |
| `tests/directory_relationship_boundary_tests.tsx` | planned测试切口 | 绑定目标独立访问/解绑/目录覆盖/成员集合分立/搜索迟到 | 未来Step16/05，不执行 |

## 7. 依赖与命名检查

| 依赖 | 类型 | manifest位置 | 计划引用 | 门禁 |
|---|---|---|---|---|
| SDK public TS | compile | 根 `package.json` | `@quantalithos/sdk: file:../quantalithos-sdk/packages/typescript` | 真路径存在；dist/exports、Chat typed能力和兼容未核验前不集成 |
| React/Vite/TypeScript/Tauri工具 | frontend/build | 根 `package.json` | 版本由04/07闭合并lock | 无安装/build事实 |
| Tauri Rust host | compile | `src-tauri/Cargo.toml` | Tauri 2 host依赖；无Quantalithos sibling Cargo路径 | 宿主权限/插件按合同逐项批准 |
| L0-core | conditional via SDK exports | 不另列直接manifest | 仅SDK正式导出的ref/error/metadata | 未导出不得建local schema |
| owner services | runtime via SDK | 不进source manifest | SDK注入正式profile/capability | CHAT-UP/WS-UP保持开放 |
| bus/Bridges/backend | forbidden direct | 无 | 无 | 不写topic/broker/private endpoint/外部平台映射 |

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug/repo | `chat` / `quantalithos-chat`，计划与存在性分开 | pass |
| 包布局 | 一个TS app与一个native host；无无理由monorepo/crates | pass |
| 原生命名 | chat-desktop / chat_desktop / chat | pass |
| 文件规范 | TS/TSX/Rust snake_case；路径按功能，无L5或重复项目名前缀 | pass |
| 业务依赖 | 仅SDK public TS；owner无Cargo/npm path | pass |
| 概要映射 | 七个组成部分与主体均能反查到责任文件组 | pass |
| 文件树/职责表 | 所列源码/测试文件逐项或显式组覆盖，无TBD占位路径 | pass |
| 事实边界 | 所有仓/文件/配置/测试planned，未安装/执行/产证据 | pass |

## 8. 诊断与改动前后

| 原产物缺陷 | 修正 | 不变的真实限制 |
|---|---|---|
| 无目录树，只用TBD标记 | 提供可用于未来建仓的文件树与package/native映射 | 当前不创建目标仓/文件 |
| 把缺框架专属全局标准视为禁止设计 | 使用已适用规范的命名规则，项目内明确Tauri与功能目录 | 不修改全局标准 |
| 把SDK skeleton存在性与public业务能力混为一谈 | 引用真实source/manifest，adapter binding独立blocked | typed query/change/resume/receipt仍须正式合同 |
| 将所有OS/IPC/持久化缺口扩大成布局blocker | 目录责任可完成；正向driver/capability资格局部阻塞 | 无正式安全合同不启用durable/任意host权限 |
| Step3 blocked时写Step4 | 本次在Step3完成后删除重建Step4 | 历史错误记录不伪称原先已按序通过 |

## 9. 设计取舍与复杂度

采用按功能组织的单前端package与Tauri标准宿主目录；纯TS语义和React/host binding分别落文件。避免将每个对象都拆一个package，也不引入后端/domain truth crates。七个主要部分以职责文件组组织，SDK与config只做支撑。

布局树是本步必须的结构图；对象字段、函数签名、event schema、精确route参数、reducer action和幂等算法留给Step5～13，不在本步抢先定义。测试源路径仅安排切口，runner/cases/evidence由Step16/05～07继续闭合。

## 10. 回填草稿

实现仓计划位于 `/home/aris/Projects/quantalithos-chat`，V1采用私有TS/React应用package `chat`及Tauri原生单crate `chat-desktop`。功能目录承载正式概要七个组成部分，业务IO集中在SDK adapters，原生桥仅提供最小宿主能力。共享core以纯TS模块实现，组件通过view model和store binding显示局部状态。SDKpublic package按已核对sibling路径计划引用，owner/bus不进入源码依赖。所有文件和测试位置为计划，正向SDK/host/storage资格保持独立blocked。

## 11. 待确认事项、自检与停审

| ID | 状态 | 影响/下一步阅读 |
|---|---|---|
| CHAT-DDD-004-LAYOUT-001 | resolved_for_design | 本树/package/责任表闭合布局，非实现许可 |
| CHAT-DDD-003-DEP-001 / CHAT-UP-001～009 | open_integration | 后续Step7/8读SDK正式exports及Process/绑定/目录/owner来源；本轮不推进未完成Step |
| WS-UP-001～008 | inherited_open | Workspace只消费已闭合safe view，不自行拼Inbox |
| CHAT-DDD-004-PLAT-001 | scoped_open | 宿主capability、存储crypto/清理原子性、深链通知和兼容证据；Step7/11/14逐项闭合 |
| 版本/工具链与测试框架 | later_design_binding | 04/05/07固定；不阻塞职责目录，未绑定不能称可build |

自检：SOP13项问题、映射表、目录树、逐文件责任、命名和path分类均完成；七个概要部分没有新增/合并/重命名；无owner truth、内部bus、SDK通用实现、Runtime/Tools/Bridges/backend；无Mobile package或不明持久化driver。Step4 `pass_with_upstream_blockers`，该pass仅为设计布局完整性。

前轮Step4停审已发生，后续Step5/6现已存在；本轮按授权重审Step1～6及Step7已写前缀，formal03仍不装配。implementation ledger/boundary skeleton仅在正式07完成时创建；当前路径全部planned，未实现、安装、构建、运行测试或提交。

## 2026-10-01 重审收口

计划/输入：读取Step4 SOP/规范5.4、当前Step2/3、既有布局全文及修复后02代码主体/对象/查询。诊断：布局只有摘要panel，缺项目五标签/整体阶段节点/关系/公司目录/context责任文件；ConversationPage别名需统一。原位补18个准确planned源码/测试路径及职责表，沿七模块，不建新package/backend/同步服务。SDK包路径只读存在，正式消费资格仍blocked。

布局形态：单private TS app+嵌入单Tauri crate沿用；Rust多crate不适合当前产品，core/adapter依赖倒置由模块约束。树与职责表逐项配对，无未知driver/library占位；成熟viewer具体依赖需后续合同选型，当前只设真实职责adapter。复杂度需已有布局图，不重复新图。

自检：新文件对应02七新增对象与coordinator/页面，命名snake_case，函数/字段TS camelCase；所有路径planned，没有创建实现仓/代码/lock。Step4 done pass_with_upstream_blockers，进入已完成Step5重审；不提交。

### Step16测试交付脚本职责补充（planned）

| planned路径 | 责任 | 承接 |
|---|---|---|
| scripts/gates/run_ci_gate.sh | 按run-id/config-profile执行正式suite，真实材料仅artifacts/test/<run_id> | Step16 §7.5；05/07定义runner与门禁后实现 |
| scripts/reports/generate_reports.sh | 读取同run真实machineartifact，输出reports/runs/<run_id>允许成熟度报告 | Step16 §7.5；不得模板生成fake通过或验收 |
| scripts/checks/check_redaction.sh | 同run artifacts/reports redaction检查，失败不输出secret正文 | Step16 §7.5；当前不创建/执行脚本 |

以上只补planned文件职责，未创建实现仓、代码、lock、run或report；原layout责任不变。
