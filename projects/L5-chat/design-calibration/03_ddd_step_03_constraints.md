# L5-chat 03 · Step 3 编码、运行与仓库约束

> Step 状态：`done`；gate_status：`pass_with_upstream_blockers`
> 日期：2026-10-01重审；模式：`regression-review + single-agent-serial`；2026-09-29选择/纠错记录保留。
> 生成依据：详细设计 SOP Step 3、详细设计书写规范 §5.3/§5.16、中间产物规范、真相源闭环标准与全局依赖规则。
> 输入：正式 00～02、02 Step 12 承接清单、03 Step 1/2、`standards/coding/typescript.md`、`standards/coding/rust.md`、目录组织规范、代码实施台账与门禁规范。
> 授权依据：用户已认可跨平台技术方案，要求 V1 Desktop-first，并授权完成 03 到 Step 4；本次“先修正”要求修复误判及未完成产物。
> 本产物确定计划实现约束；不表示代码、构建、接口集成、测试或 readiness 已成立。

## 1. 开工与 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 门禁 |
|---|---|---|---|
| 恢复文件与授权 | 已认可方案、01/02 后置选型说明 | done | 架构候选是留给后续设计收敛，不是禁止选型 |
| 回答 SOP 十项问题 | §2 问题回答 | done | 覆盖 TS/Rust、runtime、源码规范、提交与依赖 |
| 诊断和比较 | §3 差异、§4 方案取舍 | done | 不用缺少实现证据阻塞计划结构 |
| 定义实现约束 | §5 技术矩阵、§6 规范、§7 依赖 | done | 自有类型与上游真相分开 |
| 区分 blocker | §8 关闭/开放记录 | done | 不把 SDK skeleton 当正式业务集成 |
| 回填与自检 | §9/§10 | done | Step 3 pass 后才重建 Step 4 |

## 2. SOP 问题回答

### 2.1 语言、runtime、框架和依赖

本次将架构阶段后置的实现载体收敛为 React + TypeScript shared UI/core、Tauri 2 Desktop shell；Rust 仅用于 Tauri 宿主桥。Web 用同一 UI 作为开发/预览面，Mobile 继续以 Capacitor 为暂定候选，不建立移动应用。Vite 作为 UI 构建/开发工具，npm 作为 V1 单前端 package 管理器，Node 只用于工具链；运行期 UI 在 Tauri WebView 中执行。精确版本和最低 OS/WebView/Node/Rust 兼容集合在 04/05/07 闭合，不以未验证版本数字作运行承诺。

### 2.2 Rust 规范影响

`standards/coding/rust.md` 适用于 `src-tauri/src/`：英文标识符和源码注释、snake_case 文件/函数、公开项 rustdoc、enum variant 注释、明确 Result 错误与异步边界。共享 TS core 不套用 Rust crate/trait 语法。Rust 宿主不得导入业务 owner crates，不执行 Runtime/Tools，也不实现 SDK transport。

### 2.3 注释与类型规范

TS 适用 `standards/coding/typescript.md`：导出项 JSDoc、UpperCamelCase 类型/React 组件、lowerCamelCase 成员/函数、snake_case `.ts/.tsx` 文件、具名 ES 模块导出、readonly 与类型守卫、禁止以 any/断言/ts-ignore 绕过不完整输入。后续设计片段逐字段/状态分支说明语义，不能因 TS 表达形式省略来源和不变量。Rust 公开类型、字段、enum/variant、函数使用 rustdoc；设计说明可中文，实际 Rust 源码按 Rust 规范使用英文。

### 2.4 提交与 git config

实施者进入实现前必须阅读 `standards/document/代码实施台账与门禁规范.md` §7 Commit Gate、未来正式 07 当前 boundary，以及目标仓存在时的 AGENTS/提交约束；核对 `git config user.name/user.email`，无用户授权不替用户设置身份。默认提交格式遵循该门禁规范。当前不创建仓、不提交、不修改 git config；提交身份不是计划文件布局的 blocker。

### 2.5 安全、鉴权和外部边界

SDK 提供认证/actor/session、安全查询/命令/变化/引用/恢复与通用错误/重试语义。Chat 只消费正式安全语境，不能签发凭证、裁决权限、直连 owner/bus/数据库或从 ACK 推断提交。原生 IPC 仅承载最小宿主能力；不提供任意 shell/SQL/URL/文件路径调用，不向 WebView 暴露 credential。宿主能力合同未知时 disabled/unavailable；授权未知时 fail-closed。

### 2.6 是否依赖其他 Quantalithos 实现仓？

是：SDK 公共 TS package 为编译期消费目标，owner 能力为经 SDK 的运行期依赖。真实 SDK 仓已存在，不代表所需 Chat contract 已具备。

### 2.7 哪些是编译期依赖？

`@quantalithos/sdk` 是唯一已定位的业务 package；`L0-core` 类型只经 SDK 正式 exports 消费，不直接建立 Rust/core import。React、Vite、Tauri 是客户端工程依赖，不是业务 truth owner。L1/L2/L4 owner 与 L0-bus 不成为 Chat source dependency。

### 2.8 本地路径是否存在？

只读核验 `/home/aris/Projects/quantalithos-sdk/packages/typescript/package.json` 存在，声明 `@quantalithos/sdk@0.1.0` 私有 skeleton；其源码 exports 有 SdkClient/ServiceClient/EventClient/ClientContext/SdkClientError。EventClient 方法接受 unknown 并抛出 host wiring 错误，不能认定 formal change/resume 已实现。目标 `/home/aris/Projects/quantalithos-chat` 当前不存在；目录规范确定该计划仓名与 `chat` slug，无需先创建仓才能设计。

### 2.9 当前与中期引用

计划在 Chat 根 `package.json` 使用 `@quantalithos/sdk: file:../quantalithos-sdk/packages/typescript`，实际消费前须检查 SDK dist/exports、typed contract、浏览器兼容性和允许的 wiring。中期改为受控 private package/version 或 git tag/rev，不以公共 npm/crates.io 发布为前置。此为准确路径的计划引用，不是已修改 manifest 或安装成功事实。

### 2.10 运行期和事件关系

Conversation/Identity/Work/Process/Governance/Artifact/Workspace/Member/Runtime/Observability及待确认关系/目录provider均只通过SDK正式运行期能力；Process不成为npm/Cargo source依赖。SDK generic subscription名称不授权内部bus/topic/offset，skeleton不证明formal change/resume。

## 3. 问题诊断与改动前后

| 旧判断 | 错误原因 | 修正 |
|---|---|---|
| 架构没固定 React/Tauri，所以 03 不能选 | 架构明确把载体后置，详细设计 SOP 要求此步收敛语言/runtime | 按已认可方向完成实现选择，保持架构机制/ownership |
| 缺 TS 编码规范 | 未搜索完整标准目录 | 使用现有 `standards/coding/typescript.md` |
| 无法定位 SDK package | 未检查 sibling 仓 | manifest/source 已定位；实际 Chat capability 仍开放 |
| 目标仓不存在，不能列目录 | 将设计计划与执行事实混淆 | 计划路径可设计；仍禁止创建仓 |
| 非 Rust 目录标准不覆盖前端，所以必须暂停 | 规范声明不定义框架专属布局，并非禁止项目自行定义 | 此 Step 确定混合 TS/Rust 工程规则，Step 4 定准确文件 |
| Step 3 blocked 仍写 Step 4 | 违反逐 Step gate | 本次先重建 Step 3 并通过，再删除重建 Step 4；历史错误不抹除 |

## 4. 设计取舍

| 方案 | 判断 | 理由/代价 |
|---|---|---|
| React/TS + Tauri 2 | adopted_for_design | 承接用户已认可的 shared UI + desktop host；Rust 桥限宿主能力，WebView/IPC 安全与 OS 兼容需后续验证 |
| 自研渲染/桌面 runtime | rejected | 与正式 01 成熟开源承载路径不符，增加基础设施范围 |
| Electron/原生多套 UI | deferred_alternative | 当前授权方向已能承载职责，不引入第二套 shell/业务状态；如后续宿主约束失败再回流选型 |
| 多 TS package monorepo | not_selected_v1 | V1 一个产品 app 无独立共享包发布需求，模块目录已可隔离，避免无依据拆包 |
| 单 npm app + 内嵌 Tauri crate | selected | shared core 是仓内纯 TS 模块，host 一 crate；不增加 domain/api/worker crates |
| 状态/路由/存储库一并定型 | deferred_to_contract_steps | Step 4 可依据职责安排文件；库绑定只在相关对象/port/持久化契约定义时决定 |

复杂度：混合 TS/Rust 与 SDK/host 两种边界用表格足以收稳；不画调用图，准确树与依赖图由 Step 4 输出。

## 5. 技术与实现约束

| 项目 | 计划基线 | 限制/后续落点 |
|---|---|---|
| UI/core | React + TypeScript，TS strict，ES modules | 七个主要部分按功能模块组织；SDK wire 类型不复制 |
| 工具链 | npm + Vite；Node 仅 build/dev | 版本/lock 与兼容组合由 04/07 固定，当前不安装 |
| Desktop | Tauri 2；WebView UI + Rust 宿主桥 | 不把所有 OS 都视作已验证支持；capability allowlist 未闭合则关闭相关功能 |
| core 状态 | Chat-local immutable snapshot + 显式 reducer/selector | state store 与 React binding 分开，库不得绕过结果/可见性 gate |
| local persistence | port + Desktop adapter | raw owner body/credential禁存；durable driver/crypto/清理原子性后续 Step 11/14，未闭合则 memory-only |
| 安全/可访问性 | fail-closed、最小披露、keyboard/focus/announcement、reduced motion | 操作按钮、通知、连接、缓存均不能产生 owner confirmation |
| 分层流程viewer | 成熟只读图库优先，具体library待输入格式/许可/AT/兼容校准 | 正式授权BPMN才评估bpmn-js viewer；结构化安全节点/边可用通用图库，禁止从ref/Work/日志/原型坐标生成XML或推join |
| 项目/目录消费 | 五标签及基础目录搜索/分页，SDK required capability，source-local版本 | Process与Governance Gate独立；关系/目录与目标访问分验，ClientConsumptionContext防迟到/撤销复活 |
| TS名称承接 | 文件snake_case，字段/成员/参数/函数lowerCamelCase | 02 snake_case只是概要语义字段，不是SDK JSON；Step6/7需映射为TS命名，正式外部字段仅adapter按上游合同转译 |
| Mobile | Capacitor temporary candidate | 无移动 app/package、push/后台支持承诺 |
| 证据 | 所有路径/manifest/脚本为 planned | 不声称 build/run/test/evidence/verdict/readiness |

## 6. 编码规范承接

| 来源 | 约束 | 实现范围 |
|---|---|---|
| `standards/coding/typescript.md` §1/§2/§4/§5 | snake_case 文件、具名导出、JSDoc、readonly、interface、unknown/guard，按功能组织 | `src/` 与 TS 测试 |
| `standards/coding/rust.md` | Rust 命名、英文源码注释、rustdoc/variant文档、格式和错误 | `src-tauri/src/`；不覆盖 TS |
| `子项目目录与代码文件组织规范.md` | repo `quantalithos-chat`，slug chat，无 L5 命名泄漏，不创建无职责 common/utils | 混合工程；单 host Cargo package `chat-desktop`、lib `chat_desktop`、binary `chat` |
| 详细设计 SOP/书写规范 | TS/Rust契约分语言，字段/函数/状态闭环 | 完整03覆盖Step5～19；当前仅修复已完成Step1～6及Step7已写前缀，不继续未来Step |
| 真相源闭环标准 | SDK/owner schema 唯一来源，构造/状态/错误/持久化闭环 | 业务接入未闭合不私造类型 |
| 代码实施台账与门禁规范 §7 | 实现/提交前按 scope、identity、checks 和证据 gate | 07 才创建 planned实施台账，本轮不提交 |

## 7. 本地多仓依赖与禁止表

| 仓/能力 | 类型 | 本地位置 | 当前计划 | 中期计划 |
|---|---|---|---|---|
| L0-sdk public TS package | compile | `/home/aris/Projects/quantalithos-sdk/packages/typescript`（已存在） | 根 package.json 的 file sibling reference；激活受 CHAT-UP-001 阻塞 | private version/tag/rev，经兼容核验 |
| L0-core shared types | conditional compile via SDK exports | 不建立直接 path | SDK导出的稳定类型；未导出不影射 schema | 同 SDK 合同版本 |
| L1 owners/L2 member/runtime/L4 observability | runtime via SDK | 不适用 Cargo/npm path | capability adapter，blocked/unavailable 分支 | 正式 endpoint/profile 注入 SDK |
| 内部 bus/Bridges | forbidden direct dependency | 不适用 | 无 package、topic、offset、external platform adapter | 仅 SDK正式能力；Bridges不进依赖主链 |

Host Cargo.toml 不写任何 Quantalithos sibling path dependency；只配置 Tauri 宿主依赖。TS package source 存在不代表所有 owner consumer contract 已完成。

## 8. blocker 与关闭记录

| ID | 状态 | 判断 |
|---|---|---|
| CHAT-DDD-003-TECH-001 | resolved_for_design | 本 Step 按已授权方向收敛 React/TS + Tauri 2，不声明实现验证 |
| CHAT-DDD-003-CODE-001 | resolved | 现有 TS/Rust 规范均已定位，分别适用 |
| CHAT-DDD-003-COMMIT-001 | implementation_preflight | 有门禁规范来源；目标仓身份和用户提交授权在执行期检查，不阻塞布局 |
| CHAT-DDD-003-DEP-001 | open_integration | SDK包/源码已定位；exact Chat exports、typed mapping、wiring仍待确认 |
| CHAT-UP-001～009、WS-UP-001～008 | inherited_open | Process/关系/目录/SDK能力阻塞对应正向业务集成，不阻塞客户端结构设计 |
| CHAT-BASE-001 | open | 00验收编号缺口；不把NFR编号改称AC，不修改停审00 |
| OPEN-CHAT-* 平台/持久化/质量子项 | scoped_open | 宿主 capability、durable crypto、兼容和质量证据后续逐项闭合，缺失路径 fail-closed |

## 9. 正式回填草稿

L5-chat 的 V1 计划采用 React/TypeScript shared UI/core 与 Tauri 2 Desktop shell，构建采用 npm/Vite，Rust只提供受限宿主能力。业务接入仅消费 SDK public TS package及其正式 exports。实现仓计划为 `/home/aris/Projects/quantalithos-chat`，单 TS app package与一个内嵌桌面 crate；非 Desktop 平台不是 V1交付前置。适用 TS与Rust 编码规范分别约束对应文件。SDK exact contract、host授权、安全存储与兼容资格仍为受影响路径的 blocker，不能由 UI/IPC/缓存补造。

## 10. 自检、门禁与恢复

- 已回答 SOP 十项问题，给出语言/runtime、coding、提交、路径、依赖类型与安全约束。
- 01/02 的架构机制与七个概要主语不变；本 Step 承接其后置载体决策，未重定义 owner。
- 已定位 SDK真实路径/package；仅记录其 skeleton现状，不把 stub 可调用当业务可用。
- 没有强迫建新 TS规范、先建实现仓或重复要求用户批准已认可技术方案。
- Step 3 `pass_with_upstream_blockers`，允许重建 Step 4 计划布局；formal 03仍禁止装配，代码/测试/提交权限为false。
- 先前跨 blocked gate 写 Step 4 的流程错误保留在 §3；此次仅在本步通过后修复后一步。

## 2026-10-01 重审收口

计划/输入：Step3 SOP/规范5.3、修复后Step1/2、既有Step3全文、TS/Rust规范及SDK manifest/EventClient只读核验。SDK仍为private0.1 skeleton，read/resume等未具业务资格；原技术/编码/布局假blocker不重开。诊断：缺Process/目录/viewer/context及TS代码命名与规范不一致；补来源/配置不可越权/命名映射约束。Rust桥不扩大职责，TS包可以在Desktop内运行，远端owner在外。

复杂度表足够，无图。自检保留React/TS+Tauri2设计选择、不声明host/存储/许可/兼容测试通过。Step3 done pass_with_upstream_blockers，进入Step4重审；不改SDK，不实现/测试/提交。
