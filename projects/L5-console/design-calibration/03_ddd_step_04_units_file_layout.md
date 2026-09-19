## Step 4. 收稳实现单元与文件布局

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节：`详细设计书写规范` §5.4 实现单元与文件布局
- 当前模块：`units-file-layout`
- Step 门禁：`pass / self_reviewed / stop_after_step_04`
- 正式回填：未执行；正式 `03-详细设计.md` 仍为历史材料，本轮不修改。

#### 1.1 Step 内计划

- [x] 读取输入和前序结论：已读取 Step 2、Step 3、`02` §4/5/12、目录与代码组织规范、目标仓存在性和 SDK package 事实。
- [x] SOP 问题回答：已逐项回答实现单元、路径、命名、依赖和 Rust 字段适用性问题。
- [x] 当前材料 / 旧文档诊断：已审计旧 `03` 的 Rust/API/repository/projection 目录以及 framework-specific draft 目录。
- [x] 设计取舍：已比较 Rust 单 crate、Rust workspace、框架先行和框架中立 TypeScript feature-oriented 布局。
- [x] 结构化中间产物：已形成规则来源、实现仓判定、布局决策、实现单元表、package/module 映射、文件树、职责表、命名检查和依赖表。
- [x] 复杂度判断 / 是否拆模块或附录：按五个主要组成部分和跨层 seam 组织计划文件；对象/port/protocol 文件的精确拆分留给 Step 5～8。
- [x] 回填草稿：已形成未来正式 §4 的回填草稿；不创建目标仓、不创建 package 或源码。
- [x] 自检与进入下一步条件：已通过 Step / 文档 / 项目级自检；按用户授权在 Step 4 后停止，不进入 Step 5。

### 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 五个客户端主要组成部分、跨层支撑和明确非范围 | 决定计划模块边界，不新增 owner 业务单元。 |
| `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript/ESM 方向、strict/JSDoc 规则、SDK-only、Rust/Cargo 不适用边界、依赖裁剪 | 决定文件语言、模块语义和 dependency 表达方式。 |
| `projects/L5-console/02-概要设计.md` §4/5/12 | 代码主体框架、五个主要组成部分、03 承接白名单和回退规则 | 将概要主语映射到 planned source modules。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓路径、职责命名、Rust 布局要求及非 Rust 不定义说明 | 采用实现仓身份规则；不机械生成 Cargo/crate 表。 |
| `standards/document/详细设计书写规范.md` §5.4 | 实现单元、布局决策、文件树、职责表和命名检查要求 | 定义本步结构化输出。 |
| `/home/aris/Projects/quantalithos-sdk/packages/typescript` | 已存在官方 SDK TypeScript package 及源文件 skeleton | 作为 planned SDK package boundary 的真实路径事实。 |
| `/home/aris/Projects/quantalithos-console` | 当前不存在 | 确保所有目录、文件和 package 只标 `planned / not_created`。 |

依赖的前序 Step：

```text
Step 2、Step 3 已通过。本步只收稳计划实现单元和文件布局；不定义对象字段、port 方法、协议 schema、函数流或状态转换。
```

### 3. SOP 问题回答

#### 3.1 本轮实现包含哪些 crate / package / binary / library？

本轮计划的是一个浏览器 TypeScript package，不是 Rust service、Cargo workspace 或多进程仓。实现仓目前不存在，以下均为计划单元：

| 计划实现单元 | 形态 | 当前状态 | 责任 |
|---|---|---|---|
| `/` | TypeScript browser client package | `planned / not_created` | 包元数据、严格类型边界和浏览器入口承载；具体 package name/manager pending。 |
| `src/entry` | TypeScript entry module | `planned` | 浏览器 bootstrap、session shell 启动和宿主注入点。 |
| `src/access`、`src/navigation` | feature modules | `planned` | context、visibility、navigation 和 disclosure tightening。 |
| `src/views`、`src/intent` | feature modules | `planned` | owner-safe view、source axes、draft、request/result presentation。 |
| `src/recovery`、`src/diagnostics` | cross-cutting client modules | `planned` | local degradation/recovery/a11y 和 safe diagnostic context。 |
| `src/adapters` | formal-boundary adapters | `planned` | SDK access、owner query/command、reconciliation、可选 invalidation。 |
| `src/state` | bounded client-state module | `planned` | 仅承载 Console interaction truth 和可失效安全影子。 |
| `src/features` | owner-partitioned topic modules | `planned` | 八类管理主题的 view/activation seam，不承载 owner truth。 |
| `tests/` | planned test layout | `planned / not_created` | 未来按 module/contract/flow/a11y 切口承接测试；本轮不创建测试。 |

不包含：Rust library/binary、server API、BFF、worker、repository、database、projection、outbox、私有 event bus 或独立 operations job。

#### 3.2 每个实现单元对应概要设计中的哪个代码主体？

| 计划单元 | 对应 `02` 代码主体 | 边界 |
|---|---|---|
| `src/entry` | Inbound / Operations 的 browser entry、session shell | 只接收浏览器入口、正式 SDK 提示和显式用户意图；不授权。 |
| `src/access` | `AccessContextService`、`AccessContext`、`DisclosureGuard` | 传递和收紧正式语境；不创建 actor/credential/scope truth。 |
| `src/navigation` | `NavigationService`、`NavigationState`、`TopicVisibility` | route/entry selection 和可见性呈现；不把 route 当权限。 |
| `src/views` | `OwnerViewCompositionService`、`OwnerViewSnapshot`、`SourceStatusAxes`、`OwnerViewModel`、`ReferenceSet` | 组织安全结果/ref；不生成 projection/current truth。 |
| `src/intent` | `IntentReviewService`、`DraftIntent`、`RequestPresentation`、`ResultReference`、completion/unknown guards | 分离本地草稿/请求经历与 owner 正式结果。 |
| `src/features` | `TopicCompositionService`、`TopicViewModel`、`TopicActivationState`、owner-specific seam | 每个主题独立门控；不合成跨 owner health/readiness。 |
| `src/recovery` | `DegradationRecoveryService`、`DegradationState`、`RecoveryPlan`、`AccessibilityState` | 只改变本地呈现、重查/重验/回查/退出路径。 |
| `src/adapters` | `SdkAccessPort`、`OwnerQueryPort`、`OwnerCommandPort`、`ResultReconciliationPort`、optional invalidation seam | 只消费 SDK/正式服务；exact contract pending。 |
| `src/state` | bounded state carrier | 保存 interaction truth、view shadow 和失效标记；不保存 forbidden body 或授权证明。 |
| `src/diagnostics` | `DiagnosticContext`、safe diagnostic sink seam | 最小客户端诊断；不生成 audit/evidence/report。 |

#### 3.3 文件路径应该如何组织，才能体现模块边界？

采用 feature-oriented、framework-neutral 的 `src/<responsibility>/<file>.ts` 计划布局。路径按 `02` 的五个主要组成部分及跨层 seam 分组，不按旧文档的服务端 `api/domain/infra/projection` 或未来未确认的 `components/router/store` 分组。

依赖方向计划为：

```text
browser entry / feature entry
            │
            ▼
application composition in feature modules
            │
            ├── client guards / state carrier / view model
            │
            └── SDK and formal-boundary adapters
                         │
                         ▼
                  @quantalithos/sdk
                  formal owner surfaces
```

关键说明：

- `views`、`intent`、`features` 不直接 import owner service、数据库或 SDK transport internals；它们依赖 adapter 的安全结果类型。
- `state` 不反向定义 owner result、Policy/Gate 或 readiness；`diagnostics` 不能成为业务主链前置。
- `features` 是主题组合 seam，不是八个 owner domain 的本地副本；跨主题共享只限于已在 `02` 收稳的安全交互语义。
- 目录树是计划布局，不表示任何文件已经存在。

> Step 19 审查回写：Step 7 已收敛的窄 Port / mapper / facade 文件现已补入本 Step 的最小计划集合、文件树与职责表。这是对同一十模块布局的细化，不新增实现单元或框架目录。

#### 3.4 哪些文件必须创建，哪些文件只是后续可能扩展？

因为实现仓不存在，本步不创建任何文件。下表只表达未来实施时的最小计划集合与延后扩展：

| 类别 | 最小计划文件/目录 | 状态 | 延后扩展 |
|---|---|---|---|
| 包元数据 | `package.json`、`tsconfig.json` | planned | package manager lockfile、bundler config、framework config；均待 authority。 |
| 浏览器入口 | `src/entry/{browser_entry,host_lifecycle,presentation,reference_source}.ts` | planned | 宿主部署/manifest 文件；不在本步决定。 |
| 访问/导航 | `src/access/{access_context,disclosure_guard,context_port,visibility_port,disclosure_port}.ts`、`src/navigation/{navigation_state,topic_visibility,host_route,selection,visibility,cleanup,history}.ts` | planned | router-specific files、visual components；framework pending。 |
| 视图 | `src/views/{owner_view_model,source_status_axes,safe_reference_set,owner_query,material_mapper,source_status,safe_link,owner_view}.ts` | planned | owner-specific concrete mapper；需 exact safe-field 后再拆。 |
| 意图/结果 | `src/intent/{draft_intent,request_presentation,result_reference,qualification,owner_command,command_observation,reconciliation}.ts` | planned | command form/confirmation presentation；不提前锁组件。 |
| 恢复/a11y | `src/recovery/{degradation_state,recovery_plan,accessibility_state,recovery_guard,recovery_execution,accessibility_mapper,focus_announcement}.ts` | planned | concrete host adapter；需支持矩阵/contract。 |
| 适配器 | `src/adapters/{sdk_access_adapter,owner_query_adapter,owner_command_adapter,reconciliation_adapter,topic_activation_adapter,safe_link_adapter,invalidation_adapter,adapter_registry}.ts` | planned | 具体 owner adapter split、SDK event consumer；exact surface/activation 后再拆。 |
| 状态/诊断 | `src/state/{client_state_carrier,state_scope}.ts`、`src/diagnostics/{diagnostic_context,redaction_gate,diagnostic_sink,diagnostic_emission}.ts` | planned | medium-specific persistence、migration、concrete telemetry sink；留给后续 Step/04。 |
| 主题 | `src/features/{topic_activation,topic_view,topic_page,action_entry,member_management,project_workspace,method_assets,governance_controls,observability,capability_hub,archive,sandbox}.ts` | planned | 主题内部 concrete adapter/component；仅在 owner contract/framework 激活后扩展。 |
| 测试布局 | `tests/unit/`、`tests/contract/`、`tests/flow/`、`tests/accessibility/` | planned / not_created | 测试 runner、fixture、planned `scripts/gates|checks|reports` 边界和 report/artifact 输出；不在本步创建或运行。 |

#### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试？

本仓是 TypeScript browser client，因此使用 `type`/`interface`/`class`/具名函数和 adapter object；不定义 Rust trait、HTTP handler、repository 或后台 job。计划文件责任如下：

| 文件/目录 | 计划定义内容 | 明确不定义 |
|---|---|---|
| `entry/browser_entry.ts` | bootstrap、依赖注入入口、宿主 session shell 启动 | 认证、授权、owner query、路由规则真相。 |
| `access/*` | context view carrier、disclosure tightening 函数/guard | credential 签发、scope hierarchy、Policy/Gate。 |
| `navigation/*` | navigation state、topic visibility presentation、选择清理 | router implementation、permission decision。 |
| `views/*` | owner-safe view model、source axes、safe ref 集合和组合函数 | raw response、owner aggregate、跨域 verdict/readiness。 |
| `intent/*` | draft/request/result presentation 类型和本地转换 | owner command、业务校验、幂等或终态推进。 |
| `adapters/*` | SDK/formal-boundary query/command/reconciliation/invalidation adapter interface and mapping seam | DB、repository、private bus、服务源码规则。 |
| `state/*` | bounded client state carrier interface、scope/cleanup/invalidation seam | credential、owner正文、永久授权缓存。 |
| `recovery/*` | local degradation/recovery/a11y state and safe action mapping | 自动 replay、全局 health、业务补偿/后台任务。 |
| `diagnostics/*` | body-free diagnostic context and sink boundary | audit/evidence/report、敏感正文。 |
| `features/*` | 每个主题的 owner-partitioned view/activation composition | member/project/governance/method/capability/archive/sandbox domain objects。 |
| `tests/*` | 未来测试切口和 deterministic fakes 的目录归属 | 本轮实际测试结果、baseline 或 readiness。 |

#### 3.6 当前仓的 project slug 是什么？

实现仓计划路径为 `/home/aris/Projects/quantalithos-console`，project slug 为 `console`。设计仓路径 `projects/L5-console` 仅用于设计导航，不能直接当作源码目录。

#### 3.7 workspace member 目录是否使用 `crates/<role>`？

不适用。当前 Console 不是已选择的 Rust workspace；不会计划 `crates/`、workspace member 或 Rust crate。若未来架构正式改成 Rust，必须回退 `01/02` 并重跑语言、依赖和布局门禁，不能在实施时自行转译。

#### 3.8 Cargo package 是否使用 `<project>-<role>`？

不适用。目标实现是 TypeScript package，Cargo package 不存在。TypeScript package 的实际 name、package manager、workspace protocol 和发布边界尚未由目标仓或实施计划确认，因此本步不发明 `@quantalithos/console` 或其他名称。

#### 3.9 Rust library crate 是否使用 `<project>_<role>`？

不适用。没有计划 Rust library crate；TypeScript module 名称遵循 `standards/coding/typescript.md` 的 lowerCamelCase 文件/导入习惯和 UpperCamelCase 类型命名，具体导出类型留给 Step 5/6。

#### 3.10 binary 名是否表达用户入口或具体动作？

不适用。Console 是浏览器同步交互客户端，不计划 CLI、worker、operations job 或 binary。`src/entry/browser_entry.ts` 是计划的浏览器 bootstrap 模块，不是已存在 binary。

#### 3.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？

计划命名检查结果为通过：

- 实现仓使用 `quantalithos-console`，不使用 `L5-console` 或 `quantalithos-l5-console`；
- 计划模块名使用 `access`、`navigation`、`views`、`intent`、`recovery`、`adapters`、`state`、`diagnostics`、`features`；
- 文件名使用描述性 `snake_case.ts`，不含 `L0`/`L1`/`L5`、层级前缀或项目重复前缀；
- 不使用 `utils`、`common`、`helper` 作为顶层职责目录；
- 不使用旧 `ConsoleWorkspace`、`PanelState` 等历史对象名创建服务端目录或 truth 模块。

#### 3.12 如果本仓存在已确认的编译期依赖，package dependency 应写在哪里？

当前只有官方 SDK TypeScript package 边界可被讨论，目标仓尚不存在，因此本步不写实际 `package.json` 或版本/path 语法。未来应在目标仓包元数据的 dependency 区声明 SDK package（方式由 package manager/workspace authority 决定），并通过 adapter 消费；不得直接引用 `/home/aris/Projects/quantalithos-sdk/packages/typescript/src` 的私有文件。

`L0-core` 只有在正式提供可消费 JS/TS package 后才可成为 package dependency；当前不能把 Rust crate、Cargo path 或源码目录转换为 TypeScript 依赖。

#### 3.13 哪些运行期依赖或事件协作依赖只能在 adapter/event/projection 章节表达，不能进入 package dependency？

| 关系 | 类型 | 文件布局中的表达 | 禁止表达 |
|---|---|---|---|
| L1/L2/L3/L4 owner | runtime | `src/adapters/owner_query_adapter.ts`、`owner_command_adapter.ts` 和后续 feature seam | `package.json` owner repo path、数据库 client、服务源码。 |
| `L0-bus` | event collaboration，仅经 SDK | `src/adapters/invalidation_adapter.ts`（合同激活后） | broker client、直连 topic、cursor/replay/projection。 |
| SDK/formal service endpoint | runtime boundary | `sdk_access_adapter.ts` 与配置/依赖绑定（后续 Step 14） | BFF、私有 HTTP client、内部 API path。 |
| 未停审 L5/L6 | future link/ref | feature safe-link seam | 私有页面/API/事件/状态 package。 |

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧正式 `03-详细设计.md` §3/目录树 | 以 `src/api`、`application/*_service.rs`、`infra/repo`、`projection` 和 publisher 组织服务端实现 | 将浏览器产品误写为 Rust 后端，并引入不存在的 repository/projection 事实。 |
| 旧正式 §6～§15 | 文件、数据库表、API、事件、错误码和测试按旧工作台 truth 展开 | 与当前五部分客户端边界、SDK-only 和无 DB/worker 约束冲突。 |
| 本仓 `draft/03_模块划分与分层.md` | 混合 framework components、router/store、test seams 和 owner 管理模块 | 可作粒度参考，不能直接成为 package、组件树或源码布局。 |
| 当前实现环境 | `/home/aris/Projects/quantalithos-console` 不存在 | 任何“已有目录/package/文件/baseline”表述都会伪造事实，必须标 planned/not_created。 |
| 目录规范模板 | 主要面向 Rust Cargo/workspace | 本步必须显式说明 Cargo/package/crate/binary 不适用，并仍输出可审查的 TypeScript package/module 映射。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实现仓 | 旧 `03` 隐含仓内 `src/` 已存在 | `/home/aris/Projects/quantalithos-console`，状态 `planned / not_created` | 反映真实文件系统事实。 |
| 布局形态 | Rust API/application/domain/infra/repository/projection | framework-neutral TypeScript feature-oriented browser package | 对齐 `01` 的同步客户端和 TypeScript SDK 消费事实。 |
| 主模块 | workspace/panel/action/summary/assist 服务端对象 | access/navigation、views、intent、features、recovery、adapters、state、diagnostics | 直接映射 `02` 五个主要组成部分及跨层 seam。 |
| 外部依赖 | 旧文隐含 owner repo、DB、publisher、private bus | `@quantalithos/sdk` package boundary + runtime owner adapters | 防止源码穿透和第二 truth。 |
| 框架目录 | 旧候选可能出现 router/store/components | 不生成 framework-specific 目录 | framework/bundler 尚无 authority。 |
| 测试目录 | 旧文将测试/报告与实现事实混排 | 只列 planned `tests/unit|contract|flow|accessibility` | 便于未来切口映射，不伪造测试结果或脚本。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A：Rust 单 crate 模块分层 | 可套用现有 Rust 目录规范 | 与浏览器 TypeScript 客户端不符，会引入 Cargo/服务端假设 | 不采用；Rust 字段标记为不适用。 |
| B：Rust workspace 多 crate | 编译边界强 | Console 没有 Rust 多入口或 Rust 公共契约，且目标仓不存在 | 不采用。 |
| C：先选 React/Vue/Svelte 并按组件/router/store 建树 | 便于快速列 UI 文件 | 无架构 authority，历史候选会变成不可逆实现约束 | 不采用。 |
| D：framework-neutral TypeScript package，按 feature/responsibility 组织模块 | 直接承接五个主要组成部分，保持载体可替换并能表达 SDK adapter/state seam | 具体 framework/build/package manager 仍需后续确认 | 采用。 |
| E：按八个 owner 建本地 domain 目录 | 页面主题直观 | 复制 owner truth、规则和状态，形成第二真相 | 不采用。 |

### 7. 结构化中间产物

#### 7.1 规则来源

- `standards/document/子项目目录与代码文件组织规范.md`：实现仓身份、职责命名和 Rust 专属布局规则。
- `standards/document/详细设计讨论流程_SOP.md` Step 4：实现单元、映射表、文件树、职责和命名检查要求。
- `standards/document/详细设计书写规范.md` §5.4：正式详细设计的布局输出形态。
- `standards/coding/typescript.md`：TypeScript 文件/模块/类型命名、JSDoc、具名导出和严格类型规则。
- `03_ddd_step_03_coding_runtime_constraints.md`：本项目语言、runtime、依赖裁剪及 Rust/Cargo 不适用结论。

#### 7.2 实现仓目录判定

| 项 | 结论 | 说明 |
|---|---|---|
| 设计仓目录 | `projects/L5-console` | 只用于设计文档和校准中间产物导航。 |
| 实现仓目录 | `/home/aris/Projects/quantalithos-console` | 按全局规范计划；当前文件系统检查结果为不存在。 |
| project slug | `console` | 来自实现仓计划名；不含 `L5`。 |
| 实现仓状态 | `planned / not_created` | 本轮不创建目录、源码、package 或 lockfile。 |

#### 7.3 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| Rust 单 crate 模块分层 | 否 / 不适用 | 当前产品是计划中的 TypeScript 浏览器客户端，不是 Rust 服务 | 不生成 `Cargo.toml`、`src/*.rs` 或 Rust module。 |
| Rust workspace 多 crate | 否 / 不适用 | 没有 Rust 公共契约、多运行入口或 Rust domain 编译边界 | 不生成 `crates/`、Cargo package、crate 或 binary 映射。 |
| framework-neutral TypeScript package | 是（planned） | 与浏览器客户端边界和官方 SDK TS package 消费事实一致；framework/bundler 留 pending | 以 `src/<responsibility>/<file>.ts` 组织，保留载体可替换。 |
| 按 feature/responsibility 的模块布局 | 是（planned） | 承接 `02` 五个主要组成部分和跨层 adapter/state seam | 不引入 `components/router/store` 等未授权 framework 目录。 |

#### 7.4 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 | 状态 |
|---|---|---|---|---|
| package root `/` | TypeScript browser package | 包元数据、严格编译边界、浏览器入口承载 | §4、§7 | planned/not_created |
| `src/entry` | entry module | browser bootstrap、session shell start | §4.2 | planned |
| `src/access` + `src/navigation` | access/navigation modules | context、visibility、navigation、disclosure tightening | §4.1、§5.4 | planned |
| `src/views` | owner-safe view module | snapshot、source axes、view model、safe refs、no-write view composition | §4.1、§5.5 | planned |
| `src/intent` | intent/result module | draft、request presentation、formal result ref、completion/unknown seam | §4.1、§5.6 | planned |
| `src/features` | owner-partitioned topic modules | 八类主题入口、view、activation 和安全链接 seam | §4.1、§5.7 | planned |
| `src/recovery` | recovery/accessibility module | degradation、recovery、a11y semantic state | §4.1、§5.8 | planned |
| `src/adapters` | SDK/formal-boundary adapter module | SDK access、owner query/command、reconciliation、optional invalidation | §4.2、§7 | planned |
| `src/state` | bounded state carrier module | interaction truth、safe shadow、cleanup/invalidation boundary | §4.2、§9 | planned |
| `src/diagnostics` | safe diagnostic module | body-free diagnostic context and sink seam | §5.8、§10 | planned |
| `tests/` | test layout | future unit/contract/flow/a11y test seams | §12 handoff; future Step 16 | planned/not_created |

#### 7.5 目录 / package / crate / binary 映射表

> 适配说明：规范要求的 Cargo package / Rust crate / binary 列对当前 TypeScript browser client 不适用，统一写 `N/A (non-Rust)`；这不是已创建 package 的证明。TypeScript package name 和 package manager 仍是 pending。

| 实现单元目录 | 类型 | TypeScript package | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|---|
| `/` | browser package (planned) | `name: pending` | N/A (non-Rust) | N/A (non-Rust) | 元数据和入口宿主 | package boundary pending |
| `src/entry` | entry module | same planned package | N/A | N/A | 浏览器 bootstrap | host-facing |
| `src/access` | feature module | same planned package | N/A | N/A | context/disclosure | internal |
| `src/navigation` | feature module | same planned package | N/A | N/A | navigation/visibility | internal |
| `src/views` | feature module | same planned package | N/A | N/A | safe view/ref composition | internal seam |
| `src/intent` | feature module | same planned package | N/A | N/A | draft/request/result presentation | internal seam |
| `src/features` | feature module family | same planned package | N/A | N/A | topic-specific composition | conditional topic seam |
| `src/recovery` | cross-cutting module | same planned package | N/A | N/A | recovery/a11y | internal seam |
| `src/adapters` | boundary adapter module | same planned package | N/A | N/A | SDK/owner access | formal boundary only |
| `src/state` | state module | same planned package | N/A | N/A | bounded client state | internal |
| `src/diagnostics` | diagnostic module | same planned package | N/A | N/A | safe diagnostic | conditional sink |
| `tests` | test layout | same planned package | N/A | N/A | future verification seams | no runtime exposure |

#### 7.6 文件布局树（计划，不代表现存）

```text
quantalithos-console/                         # planned implementation repo; not created
  package.json                                # planned package metadata; name/manager pending
  tsconfig.json                                # planned strict TypeScript boundary
  src/
    entry/
      browser_entry.ts                         # browser bootstrap and session-shell start
      host_lifecycle.ts                        # host session attach/close port
      presentation.ts                          # safe shell/page presentation port
      reference_source.ts                      # Console-owned local ref allocation port
    access/
      access_context.ts                        # formal-context presentation carrier
      disclosure_guard.ts                      # client-side tightening only
      context_port.ts                          # formal context resolve/revalidate port
      visibility_port.ts                       # formal visibility/qualification port
      disclosure_port.ts                       # local disclosure evaluation facade
    navigation/
      navigation_state.ts                      # entry selection; not authorization
      topic_visibility.ts                      # visibility/qualification presentation
      host_route.ts                            # framework-neutral host route port
      selection.ts                             # guarded local selection port
      visibility.ts                            # local visibility tightening port
      cleanup.ts                               # sensitive navigation cleanup port
      history.ts                               # local-entry-only host history port
    views/
      owner_view_model.ts                      # owner-partitioned safe view composition
      source_status_axes.ts                    # source/freshness/coverage/availability/consistency
      safe_reference_set.ts                    # body-free safe references
      owner_query.ts                           # sole owner-safe formal Query port
      material_mapper.ts                       # formal-safe material mapper
      source_status.ts                         # source-axis validation/tightening mapper
      safe_link.ts                             # formal safe-link revalidation port
      owner_view.ts                            # local owner-partition composition port
    intent/
      draft_intent.ts                          # local draft only
      request_presentation.ts                  # submitted/accepted/pending/terminal/unknown presentation
      result_reference.ts                      # formal result/ref presentation
      qualification.ts                         # local same-source command qualification
      owner_command.ts                         # sole owner delegate-write port
      command_observation.ts                   # receipt/result/ambiguous mapper
      reconciliation.ts                        # formal result read-back port
    recovery/
      degradation_state.ts                     # local degradation axes
      recovery_plan.ts                         # explicit requery/revalidate/reconcile/exit choices
      accessibility_state.ts                   # focus/announcement semantic state
      recovery_guard.ts                        # plan/action/context/request guard
      recovery_execution.ts                    # five-action orchestration port
      accessibility_mapper.ts                  # page-to-channel semantic mapper
      focus_announcement.ts                    # host focus/announcement port
    adapters/
      sdk_access_adapter.ts                    # official SDK boundary wiring
      owner_query_adapter.ts                   # owner-safe query mapping seam
      owner_command_adapter.ts                 # controlled command delegation seam
      reconciliation_adapter.ts                # formal result reconciliation seam
      topic_activation_adapter.ts              # per-owner capability/facet observation
      safe_link_adapter.ts                     # formal typed-link adapter
      invalidation_adapter.ts                  # optional SDK invalidation seam
      adapter_registry.ts                      # typed formal slot availability
    state/
      client_state_carrier.ts                  # bounded interaction state and invalidation
      state_scope.ts                           # exact session/context scope guard
    diagnostics/
      diagnostic_context.ts                    # body-free client diagnostic context
      redaction_gate.ts                        # diagnostic field/body guard
      diagnostic_sink.ts                       # optional typed sink and availability
      diagnostic_emission.ts                   # failure-isolating emission facade
    features/
      topic_activation.ts                      # formal observation mapping and tightening
      topic_view.ts                            # owner-partitioned topic composition
      topic_page.ts                            # semantic page composition
      action_entry.ts                          # controlled action qualification
      member_management.ts                     # identity/member topic seam
      project_workspace.ts                     # work/process/workspace topic seam
      method_assets.ts                         # method topic seam
      governance_controls.ts                   # governance/artifact topic seam
      observability.ts                         # observability topic seam
      capability_hub.ts                        # capability topic seam
      archive.ts                               # archive topic seam
      sandbox.ts                               # sandbox topic seam
  tests/
    unit/                                      # planned local type/guard tests
    contract/                                  # planned SDK/owner boundary tests
    flow/                                      # planned query/command/recovery flow tests
    accessibility/                             # planned semantic-equivalence tests
```

关键说明：

- 文件树表达 planned package、feature module、adapter seam 和测试布局，不表达已创建文件、实现完成度、构建结果或 package lock。
- 未出现 `components/`、`router/`、`store/`、`repository/`、`projection/`、`worker/`、`api/` 或 `crates/`，因为这些边界没有当前 authority或已被架构排除。
- `features/*` 只组织安全消费面；任何 owner truth、Policy/Gate、审计/evidence/report、归档执行或 sandbox enforcement 必须留在外部 owner。

#### 7.7 文件职责表

| 文件路径 | 所属实现单元 | 计划定义内容 | 主要责任 |
|---|---|---|---|
| `src/entry/browser_entry.ts` | entry | bootstrap function and host seam | 创建客户端组合根；不读取数据库或签发权限。 |
| `src/entry/{host_lifecycle,presentation,reference_source}.ts` | entry | host lifecycle/presentation/local-ref Ports | 宿主副作用与 local ref 来源；不承载业务规则。 |
| `src/access/access_context.ts` | access | context presentation type/mapper | 保存正式语境安全引用和生命周期姿态。 |
| `src/access/disclosure_guard.ts` | access | disclosure guard function/object | 只收紧披露，不生成 allow/deny。 |
| `src/navigation/navigation_state.ts` | navigation | navigation interaction state | 保存入口选择和敏感选择清理。 |
| `src/navigation/topic_visibility.ts` | navigation | topic visibility presentation | 呈现 formal visibility/qualification 上限。 |
| `src/access/*_port.ts`、`src/navigation/{host_route,selection,visibility,cleanup,history}.ts` | access/navigation | Step 7 窄 formal/local/host Ports | 调用方、实现方和错误语义以 Step 7 为准。 |
| `src/views/owner_view_model.ts` | views | owner-partitioned view model | 组合安全 snapshot/ref，保留 owner 边界。 |
| `src/views/source_status_axes.ts` | views | multi-axis status carrier | 保留来源、时效、覆盖、可用性和一致性，不压平。 |
| `src/views/safe_reference_set.ts` | views | body-free reference set | 保存可披露 ref，不保存正文或权限证明。 |
| `src/views/{owner_query,material_mapper,source_status,safe_link,owner_view}.ts` | views | Query/mapping/link/composition Ports | Query no-write；formal 与 local mapping 分离。 |
| `src/intent/draft_intent.ts` | intent | local draft carrier | 只保存未提交交互意图和本地验证姿态。 |
| `src/intent/request_presentation.ts` | intent | request-phase presentation | 区分 submitted/accepted/pending/confirmed/rejected/unknown。 |
| `src/intent/result_reference.ts` | intent | formal result reference presentation | 只接受 owner formal result/ref。 |
| `src/intent/{qualification,owner_command,command_observation,reconciliation}.ts` | intent | qualification、delegate-write、result mapping/read-back Ports | submit 与 reconciliation 分离；unknown 不 replay。 |
| `src/adapters/sdk_access_adapter.ts` | adapters | SDK context and access seam | 消费官方 SDK package，不暴露内部 source。 |
| `src/adapters/owner_query_adapter.ts` | adapters | query mapping seam | 将 owner-safe Query 映射成 view input；no-write。 |
| `src/adapters/owner_command_adapter.ts` | adapters | controlled command seam | 委托正式 owner command；不推进本地 owner truth。 |
| `src/adapters/reconciliation_adapter.ts` | adapters | result reconciliation seam | 按正式 ref 回查；无依据保持 unknown/blocked。 |
| `src/adapters/invalidation_adapter.ts` | adapters | optional SDK hint seam | 只触发 stale/revalidate；不直连 bus。 |
| `src/adapters/{topic_activation_adapter,safe_link_adapter,adapter_registry}.ts` | adapters | contract/link/typed-slot formal binding | 缺合同返回 pending/blocked/disabled。 |
| `src/recovery/degradation_state.ts` | recovery | local degradation state | 只隔离相关 owner/topic 区域。 |
| `src/recovery/recovery_plan.ts` | recovery | explicit recovery choice | 映射 requery/revalidate/reconcile/keep-draft/exit。 |
| `src/recovery/accessibility_state.ts` | recovery | semantic focus/announcement state | 与视觉路径共享正式语义和安全上限。 |
| `src/recovery/{recovery_guard,recovery_execution,accessibility_mapper,focus_announcement}.ts` | recovery | 显式 action 编排与 host a11y Ports | 一次一个动作；辅助路径不改变业务结果。 |
| `src/state/client_state_carrier.ts` | state | bounded state carrier seam | 管理本地交互事实、scope binding、清理和失效。 |
| `src/state/state_scope.ts` | state | exact scope guard | 不迁移或解析 opaque refs。 |
| `src/diagnostics/diagnostic_context.ts` | diagnostics | safe diagnostic envelope placeholder | 只允许 body-free client context；具体 envelope pending。 |
| `src/diagnostics/{redaction_gate,diagnostic_sink,diagnostic_emission}.ts` | diagnostics | gate、optional sink 和隔离 facade | sink 失败不改变业务结果。 |
| `src/features/{topic_activation,topic_view,topic_page,action_entry}.ts` | features | activation、topic/page、action 组合 Ports | 不复制 owner truth 或从页面推 activation。 |
| `src/features/*.ts` | features | topic-specific composition | 按 owner 独立激活和局部降级；不复制业务对象。 |
| `tests/*` | tests | future deterministic test seams | 只规划测试归属；不声明测试已运行或通过。 |

#### 7.8 测试门禁边界与命名检查表

> 05 Step 9 回写：测试脚本、报告和检查路径只作为 planned boundary，不代表目标仓或脚本已创建。正式路径约束为 `scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*`；未来 raw artifact 使用 `artifacts/test/<run_id>/`，run report 使用 `reports/runs/<run_id>/`，验收交接使用 `reports/acceptance/`。不得在 `reports/` 输出目录内放置生成脚本，不得引用 `latest`，不得把脚本边界解释为执行结果。

| planned boundary | 责任 | 当前状态 | 禁止事项 |
|---|---|---|---|
| `scripts/gates/*` | 未来按 gate/suite 编排 P0 planned tests，接收显式 `run_id`、artifact root、config profile | planned / not_created | 不创建脚本、不声明 gate 已运行或通过 |
| `scripts/checks/*` | 未来执行 dependency/redaction/artifact-report/static-evidence checks | planned / not_created | 不把静态映射当 evidence、不输出真实 verdict |
| `scripts/reports/*` | 未来从 raw artifact 生成 run reports/evidence candidates | planned / not_created | 不从手写 JSON 直接宣告 coverage/pass |
| `artifacts/test/<run_id>/` | future machine evidence root | planned path only | 不创建 run_id、artifact 或 evidence |
| `reports/runs/<run_id>/` | future human-readable run report root | planned path only | 不创建 report 或引用 `latest` |
| `reports/acceptance/` | future human/Agent review handoff | planned path only | 不写验收 signoff/readiness |

#### 7.9 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-console`，不带 `L5` | 通过（planned；当前不存在） |
| project slug | `console` | 通过 |
| 语言文件命名 | 描述性 `snake_case.ts` | 通过（planned） |
| TypeScript 类型/函数命名 | 类型 UpperCamelCase；函数/属性 lowerCamelCase；具名导出 | 通过（由 Step 3 约束，具体符号留后续 Step） |
| 架构层级泄漏 | 文件/package/type/function 名不出现 `L0`/`L1`/`L5`/`l0_`/`l1_` | 通过 |
| 项目前缀重复 | 不使用 `src/console_*` 或 `features/console_*` | 通过 |
| 顶层职责名 | 不使用 `utils`、`common`、`helper` | 通过 |
| Rust Cargo 映射 | 仅在适用时填写；本项目明确 N/A | 通过 |
| framework-specific 目录 | 未未经 authority 创建 `components/router/store` | 通过 |
| 目标仓事实 | planned tree 不被描述为已存在 | 通过 |

#### 7.10 依赖绑定表

| 依赖仓库/包 | 全局依赖类型 | 目标文件位置（计划） | 当前引用方式 | 中期引用方式 | 说明 |
|---|---|---|---|---|---|
| `@quantalithos/sdk` / `/home/aris/Projects/quantalithos-sdk/packages/typescript` | TypeScript compile/runtime boundary | `package.json` + `src/adapters/sdk_access_adapter.ts` | `planned / not linked`；消费 package boundary，不引用 `src/*` 私有文件 | package manager workspace/registry/private git tag/rev，待实施 authority | SDK package 存在；exact exports/owner contracts 仍 pending。 |
| `L0-core` | conditional compile semantic dependency | 无当前文件 | N/A；无可消费 JS/TS package 事实 | 正式 JS/TS package 后再决定 | 不写 Rust Cargo path dependency。 |
| L1/L2/L3/L4 owners | runtime | `src/adapters/*` + `src/features/*` | 经 SDK/formal service，按主题 pending/partial | 由正式 contract/activation 决定 | 不进入 package dependency。 |
| `L0-bus` | event collaboration | `src/adapters/invalidation_adapter.ts` | 不直接引用；仅可消费 SDK hint | SDK event contract 激活后再绑定 | 不维护 broker/cursor/replay/projection。 |
| 未停审 L5/L6 | future link/ref | `src/features/*` safe-link seam（未来） | pending | 正式 link/ref 合同后再决定 | 不消费私有状态。 |

### 8. 回填草稿

以下内容是未来正式 `03-详细设计.md` §4 的回填草稿；本轮不写入正式文件，也不创建目标实现仓。

目标实现仓计划为 `/home/aris/Projects/quantalithos-console`，project slug 为 `console`，当前状态 `planned / not_created`。本项目采用 framework-neutral TypeScript/ESM browser package 的 feature-oriented 计划布局，按 `src/<responsibility>/<file>.ts` 承接访问语境与导航、来源保真视图、受控意图与结果、管理主题组织、韧性与可访问交互，以及 SDK/formal-boundary adapters、bounded state carrier 和 safe diagnostics。

计划 package root 包含 `package.json` 与 `tsconfig.json`，但 package name、package manager、bundler、framework、browser target 和 lockfile 尚未由目标仓/实施 authority 确认。`src/entry/browser_entry.ts` 是计划浏览器 bootstrap；`src/access`、`navigation`、`views`、`intent`、`recovery`、`adapters`、`state`、`diagnostics` 和 `features` 的文件责任见本 Step §7.6～§7.7。测试目录仅列 planned `unit/contract/flow/accessibility`，本轮未创建或运行测试。

Rust Cargo package、crate、binary 和 path dependency 对当前客户端不适用，映射表明确标为 `N/A (non-Rust)`。官方 `@quantalithos/sdk` 只作为 package boundary 计划依赖；L1～L4 owner 是运行期 adapter 依赖，`L0-bus` 仅可经 SDK 的条件化 invalidation seam，未停审 L5/L6 仅作未来 link/ref。不存在 repository、database、BFF、worker、projection、outbox、private bus 或 owner domain 目录。

### 9. 待确认事项

- 目标实现仓尚不存在；`package.json`、`tsconfig.json`、源文件和测试目录均为计划，不得当作现存事实。
- package name、package manager/workspace、bundler、framework、browser target/support matrix 和宿主集成方式仍 pending。
- `@quantalithos/sdk` 的 exact exports、owner query/command/result/ref schema、safe-field、scope/visibility、reconciliation 和 activation 仍 pending；adapter 文件只能作为 seam，不能提前实现。
- state carrier 介质、缓存/失效策略、TTL、diagnostic envelope 和测试 runner 需在后续 Step/04/05/06/07 由正式 authority 闭口。
- 若未来要求 Rust crate/workspace 或 server/API 运行单元，必须回退 `01/02` 和本 Step，不能由实施者自行改写布局。

### 10. 进入下一步条件

- [x] 已确定 planned 实现仓路径和 project slug，并明确目标仓不存在。
- [x] 已输出实现单元总表、TypeScript package/module 映射、planned 文件树、文件职责表和命名检查表。
- [x] 已解释 Cargo package/crate/binary 对当前非 Rust 客户端不适用，未伪造 Rust layout 或 path dependency。
- [x] 已区分 SDK package boundary、runtime owner、event collaboration 和 future link/ref 依赖。
- [x] 未创建目标实现仓、package、源码、测试或构建产物；未运行测试，未生成 baseline/run/artifact/report/evidence/verdict/signoff/readiness。
- [x] 未修改正式 `03-详细设计.md`；本轮用户授权到 Step 4，完成后必须停审，不得进入 Step 5。
