## Step 3. 收稳编码规范、语言 / runtime、仓库约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节：`详细设计书写规范` §5.3 实现约束与编码规范承接、§5.16 详细设计到实施计划的承接清单
- 当前模块：`coding-runtime-constraints`
- Step 门禁：`pass / self_reviewed`

#### 1.1 Step 内计划

- [x] 读取输入和前序结论：已读取 Step 2、`01` 技术边界/依赖裁剪、`standards/coding/typescript.md`、Rust/目录规范、SDK TypeScript package 及源码事实、git config。
- [x] SOP 问题回答：已逐项回答语言/runtime、注释、提交、边界安全和依赖分类问题。
- [x] 当前材料 / 旧文档诊断：已标记旧 `03` 的 Rust/Cargo/API/数据库假设与 framework/Provider/固定参数污染。
- [x] 设计取舍：已比较 TypeScript 浏览器客户端、Rust 客户端和框架先行三种方案。
- [x] 结构化中间产物：已形成编码规范承接表、实现约束表、本地多仓依赖裁剪表、依赖分类图和 pending 清单。
- [x] 复杂度判断 / 是否拆模块或附录：编码和依赖可以在一个约束产物中闭合；具体文件拆分留给 Step 4，类型/port 拆分留给 Step 5～8。
- [x] 回填草稿：已形成正式 §3 和实施前置阅读清单草稿；正式 03 仍不可写。
- [x] 自检与进入下一步条件：已通过 Step / 文档 / 项目级自检；允许进入 Step 4。

### 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 本轮覆盖五个客户端组成部分，排除 owner truth/DB/BFF/worker/完整下游文档 | 约束编码/runtime 选择只服务于浏览器客户端。 |
| `01-架构设计.md` §3/7/8/10/11/13 | 浏览器同步交互客户端、有界状态、SDK-only、无框架/协议/存储产品锁定 | 作为语言/runtime 和安全边界 authority。 |
| `standards/coding/typescript.md` | TypeScript 命名、JSDoc、readonly、导出、类型和模块书写规则 | 作为计划客户端代码的编码规范。 |
| `standards/coding/rust.md` | Rustdoc、Rust 命名和 Cargo 规则 | 记录为 Rust 专属规范；当前 Console 不采用 Rust 实现。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓命名、Rust workspace/module 规则 | Step 4 继续使用；本步确认 Rust Cargo 映射不适用。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | compile/runtime/event 分类与 L5-console 总矩阵 | 形成只保留必要依赖的本仓裁剪表。 |
| `/home/aris/Projects/quantalithos-sdk/packages/typescript/package.json` | `@quantalithos/sdk`、private、ESM、ES2022/NodeNext/strict/declaration | 证明官方 TypeScript SDK 包边界存在；不证明具体 owner surface。 |
| `/home/aris/Projects/quantalithos-sdk/packages/typescript/src/*.ts` | 当前导出 `SdkClient`、`ClientContext`、`ServiceClient`、`EventClient` 等最小 skeleton，service/event 方法参数为 `unknown` | 只作为消费面事实和缺口证据；不复制内部实现或把 unknown 当正式 schema。 |
| git config | `quantalithos-labs <quantalithos.ai@gmail.com>` | 实施计划未来需列前置阅读/提交身份；本轮不提交。 |

依赖的前序 Step：

```text
Step 1、Step 2 已通过。本步只收稳技术和依赖约束，不创建目标实现仓、不写 package 文件、不锁 framework/bundler。
```

### 3. SOP 问题回答

#### 3.1 本仓使用什么语言、runtime、框架和主要依赖？

当前可收稳的语言/runtime 是：

- 语言：TypeScript；模块系统：ESM。
- 运行形态：浏览器中的同步交互客户端，依赖浏览器/辅助技术入口和官方 SDK/正式服务边界。
- 编译器基线：官方 SDK TypeScript package 当前使用 ES2022 target、NodeNext module/moduleResolution、`strict: true`、declaration output；Console 可把这些作为消费侧兼容事实和候选基线，但目标仓尚不存在，最终 tsconfig 仍需在 Step 4/未来实施阶段确认。
- 框架、bundler、router、组件库、状态库、通信协议、缓存/存储产品：当前没有 `01` authority，保持 `pending`，不得从旧 `03` 或 draft 推断。
- 主要依赖：官方 `@quantalithos/sdk` TypeScript package 是唯一已核实的客户端访问边界；L1～L4 owner 只通过 SDK/正式服务运行期消费；浏览器平台 API 是运行环境，不是业务 package 依赖。

#### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

Rust 规范对本项目的直接适用性为“不适用”：Console 当前是计划中的 TypeScript 浏览器客户端，不创建 Rust struct/trait/Cargo crate。其可迁移的设计纪律仅作为概念要求保留：公开类型/函数要有可读文档，异步边界明确 `Promise` 返回，错误类型不依赖字符串猜测，测试 seam 必须有明确输入/输出和禁止事项。

不得把 Rust 专属的 `Rustdoc`、`Cargo.toml`、workspace member、crate 或 `async fn` 签名伪装成 Console 已采用的实现形态。若未来架构正式改为 Rust，必须回退 01/02 并重新执行本 Step。

#### 3.3 是否必须遵守 rustdoc 风格注释？TypeScript 如何处理公开符号？

不要求 Rustdoc，因为当前实现候选不是 Rust。TypeScript 计划代码必须遵守 `standards/coding/typescript.md`：

- 导出的顶层 class/interface/type/function/constant 使用 JSDoc，说明安全语义、输入边界、返回和禁止事项；
- 类型、参数、返回值显式声明，优先 `readonly` 表达不可变客户端快照；
- 采用 UpperCamelCase 类型名、lowerCamelCase 函数/参数/属性名、具名导出；不使用 `I` 前缀、下划线前后缀或默认导出作为公共契约；
- ESM import/export 使用明确的模块路径；不把 `any`、字符串 status 或 UI label 当正式契约替代；
- 具体 enum/union label、schema 和函数签名待 Step 5～10，不能在本步先行发明。

#### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

实施者未来必须读取：

1. 本项目正式 `03`～`07` 及其列出的 calibration 来源；
2. `standards/coding/typescript.md`，以及若实现仓采用其他语言时对应正式规范；
3. `standards/document/子项目目录与代码文件组织规范.md` 中适用于非 Rust 项目的实现仓目录边界（Rust Cargo 表不机械套用）；
4. 项目正式提交规范（当前仓未发现独立提交规范文件，需在 07 的阅读清单中标为待确认而非臆造）；
5. 当前 git identity：`quantalithos-labs` / `quantalithos.ai@gmail.com`。本设计轮次不提交 commit。

#### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现？

- credential 签发、身份认证、scope hierarchy、Policy/Gate 决策、成员/项目/治理资格判定；
- owner 领域校验、幂等 authority、正式 result/receipt/reconciliation、审计/evidence/report/readiness；
- 数据库、repository、BFF、服务端聚合、owner projection/cursor/replay/rebuild、私有 bus 连接；
- 将 UI route/menu/button/feature flag/cache 命中解释为 allow，或把 SDK transport/receipt 解释为 committed；
- 将 forbidden body、raw/hidden payload、credential/secret 或治理依据写入状态、缓存、错误、日志、诊断或导出。

Console 的代码只能在正式 SDK/服务 boundary 上做安全 context 传递、最小披露映射、客户端收紧和局部恢复。

#### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库？

是，运行时依赖官方 `L0-sdk` TypeScript package；全局依赖矩阵还把 `L0-core` 标为编译期共享契约来源，但当前已核实的客户端消费面是 SDK package，而不是 Rust crate。L1～L4 项目是按主题经 SDK/正式服务的运行期 owner，不作为本地源代码依赖。

#### 3.7 这些依赖中哪些是已确认的编译期依赖？

对计划中的 TypeScript 浏览器客户端，已确认可作为 package 编译/类型依赖讨论的只有 `@quantalithos/sdk` package boundary（实际 owner exports 仍不完整）。`L0-core` Rust crate 不应被直接写入 Console 的 TypeScript `package.json`，除非未来正式提供并批准可消费的 JS/TS package；当前不能把 Rust path dependency 迁移为 TS 依赖。

#### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在？

已确认：

```text
/home/aris/Projects/quantalithos-sdk                    存在
/home/aris/Projects/quantalithos-sdk/packages/typescript 存在
/home/aris/Projects/quantalithos-console                不存在（目标实现仓尚未创建）
```

未将目标仓不存在解释为实现 blocker；它只决定 Step 4 必须输出 planned 布局，不得报告已有文件或 package。

#### 3.9 对已确认的编译期依赖，当前采用本地 path dependency 吗？中期是否记录 private git tag/rev？

不采用 Rust Cargo path dependency，因为 Console 是计划中的 TypeScript package，且目标实现仓尚不存在。未来若 `quantalithos-console` 建立 package workspace，应按实施阶段的 package manager/workspace 方案引用官方 SDK（具体 workspace protocol、registry 或 private git tag/rev 待实施 authority）；本步不发明 package manager、lockfile 或版本约束。

#### 3.10 哪些关系只是运行期依赖或事件协作依赖，不能进入 package dependency？

| 关系 | 依赖类型 | 正确落点 | 禁止落点 |
|---|---|---|---|
| `L0-sdk` 官方 TypeScript client surface | 编译/运行期边界（以 package 事实为准） | SDK adapter、query/command mapper、context 传递 | 复制 SDK 内部实现或直接依赖 owner 源码。 |
| `L1-identity`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact` | 运行期 | owner query/command adapter，经 SDK/正式服务 | `package.json` 指向 owner repo、数据库或服务源码。 |
| `L1-workspace`、`L2-member-service`、`L3-method-library`、`L3-capability-hub` | 运行期、合同条件化 | topic adapter、activation metadata、safe view/ref | 本地复制 projection、宿主规则或私有 API。 |
| `L4-observability`、`L4-sandbox`、`L4-archive` | 运行期 | read/diagnostic/archive/sandbox adapter seam | 直接调用内部存储、执行器或 archive/sandbox 真相。 |
| `L0-bus` | 事件协作；仅可经正式 SDK 提示 | 可选 invalidation adapter/consumer（合同激活后） | 直连 broker、维护 cursor/replay/projection、写 package dependency。 |
| 未停审 L5/L6 | pending runtime/link/ref | SafeLink/future link seam | 消费私有页面/API/事件/状态。 |

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧正式 `03-详细设计.md` §3/目录 | 假定 Rust API、Cargo crate、repository、projection、publisher 和数据库 | 与当前浏览器客户端架构冲突，易造成错误实现仓。 |
| 旧正式 `03-详细设计.md` API/错误/存储章节 | 把服务端规则、固定错误码、持久化和事件发布写成既定事实 | 违反 SDK-only、owner truth 和详细设计边界。 |
| README / draft | React/Vue/Svelte/Tailwind、Provider Contract、固定组件/指标/控制项和缓存参数以候选或旧事实出现 | 无当前 authority，不能作为语言/framework/runtime 选择。 |
| `@quantalithos/sdk` 当前 skeleton | `ServiceClient.call/read`、`EventClient.publish/openSubscription` 参数仍是 `unknown`，运行 wiring 由 host 提供 | 只能证明 package boundary 存在，不能把 unknown 当 exact owner contract；后续需保留 pending seam。 |
| 规范模板 | 详细设计 SOP 和目录规范大量以 Rust/Cargo 为例 | 当前需明确 TypeScript 适配及“不适用”字段，避免机械生成 Cargo 表。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言/runtime | 旧 `03` 隐含 Rust 服务端/同步 API | TypeScript + ESM browser client；具体 framework/bundler pending | 与 `01` 同步交互客户端和官方 TS SDK 事实一致。 |
| 公共注释 | Rustdoc/结构体注释作为默认 | TypeScript 导出顶层符号用 JSDoc；Rustdoc 仅记录为不适用 | 避免把语言规范错套到客户端。 |
| 依赖 | 旧文可能引入 DB、owner repo、private bus 或服务源码 | SDK/package boundary + runtime owner adapters；L0-bus 只经 SDK 提示 | 遵守 compile/runtime/event 分类和真相边界。 |
| 框架 | 旧材料中的 React/Vue/Svelte/Tailwind 候选 | 不选择框架，保留 pending | `01` 没有 authority，防止实现者被历史材料绑定。 |
| SDK 事实 | “已完整集成”或自造 Provider Contract | 仅确认 `@quantalithos/sdk` package 存在，exact surface pending | 事实诚实，保留合同缺口。 |
| 提交 | 可能沿用历史作者/commit 语气 | 记录当前 git config，仅作实施前置；本轮不提交 | 用户明确未要求 commit。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A：沿用旧 Rust/Cargo 服务布局 | 可直接套既有详细设计模板 | 把浏览器客户端误写成服务端，产生 DB/repository/worker 等越界实现 | 不采用。 |
| B：TypeScript + ESM 浏览器客户端，消费官方 SDK，框架和 bundler pending | 尊重当前架构和实际 SDK package，保留实现载体可替换性 | Step 4/实施阶段还需补 package manager、browser build 和组件承载决策 | 采用。 |
| C：现在直接选 React/Vue/Svelte 与固定 store/router | 便于立即列组件和目录 | 无正式 authority，会把历史污染变成架构事实 | 不采用。 |
| D：把 L1～L4 源码或 `L0-bus` 作为本地依赖 | 表面减少 adapter 工作 | 破坏 owner 边界、绕过 SDK/Policy/Gate，并复制规则 | 不采用。 |

### 7. 结构化中间产物

#### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/typescript.md` | 类型/函数命名、JSDoc、readonly、具名导出、严格类型、避免 `any`/字符串 status | Step 4 文件名与 Step 5+ 类型/函数契约必须按 TypeScript 规范表达。 |
| `standards/document/详细设计书写规范.md` | 模块主轴、实现契约、闭环复核、校准来源 | 正式 03 不能只写页面/组件清单，必须能 1:1 还原模块契约。 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 3/4 的语言、依赖、目录讨论及 Rust 模板适配 | Rust/Cargo 专属输出在本项目标为不适用；仍保留依赖分类和文件职责要求。 |
| `standards/document/设计文档讨论中间产物规范.md` | 十段式产物、事实诚实、依赖裁剪和目录/文件类产物 | Step 4 必须写 planned 目录，不能伪造已存在仓。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 单一 schema/status/ref 来源、support carrier 闭环、禁止私造 ref | 后续 Step 不得用本地 alias、字符串、UI label 或 raw payload 补合同。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓默认命名；Rust workspace/member 规则 | 对 TypeScript 项目只采用实现仓路径和职责命名原则；Cargo 表不适用。 |
| `standards/coding/rust.md` | Rustdoc、Cargo、Rust 命名 | 当前不适用；若未来改语言需回退架构并重跑。 |

#### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| TypeScript strict boundary | 计划客户端类型不得依赖 `any`/字符串推断；正式 owner unknown 保持显式 unknown/blocked | 全部 view/adapter/state/protocol seam。 |
| ESM + named exports | 采用 ESM 模块语义和具名导出；不锁 bundler 或 package manager | browser entry、feature modules、adapter modules。 |
| JSDoc for exported symbols | 导出顶层类型/函数必须说明安全边界和输入输出 | 所有未来 public module/type/adapter entry。 |
| Browser client only | 不创建 server handler、repository、worker、database 或 Rust binary | entry、application、state、diagnostic。 |
| SDK/formal-boundary only | 业务 query/command/result/ref 只能从 `@quantalithos/sdk` 或正式服务 seam 进入 | owner query/command/reconciliation/invalidation adapters。 |
| Client can tighten only | 本地 guard、route、cache、flag 和 preference 只能收紧，不能授权或提升状态 | access/navigation/topic/submit/recovery。 |
| Forbidden-body zero entry | credential/secret/raw/hidden/governance/evidence/audit/report body 不进入 client state/cache/error/log/diagnostic/export | view/state/diagnostic/recovery。 |
| Formal result semantics | receipt/transport/toast 不得生成 confirmed/rejected；unknown 无正式依据不 replay | intent/result/reconciliation。 |
| Owner partition and local degradation | 每个 owner 保留来源五轴和独立故障姿态；不合成 readiness | topic/view/degradation。 |
| A11y semantic equivalence | 键盘/辅助技术路径共享正式资格、状态、结果和恢复上限 | accessibility/recovery/view presentation。 |
| No premature framework contract | framework/router/component/store/cache/TTL/browser matrix 均 pending | Step 4 planned file layout must stay framework-neutral。 |

#### 7.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L5-console 的共享底层契约关系 | 共享语义潜在来源 | 编译期（仅若提供可消费 JS/TS package） | 条件 | 当前无可核实 TS package，不写 Rust path dependency；只承接正式语义。 |
| `L0-sdk` | 官方客户端边界 | 主要访问依赖 | TypeScript package 编译/运行期 | 是 | 所有业务 query/command/result/ref 通过 SDK；exact exports pending。 |
| `L1-identity`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact` | L5-console 运行期 owner | safe query/command/result/ref 来源 | 运行期 | 是（按主题条件化） | 不引入 owner 源码；contract 未闭口保持 pending/partial。 |
| `L1-workspace`、`L2-member-service` | 运行期条件 owner | workspace/member-safe view/ref | 运行期 | 条件 | safe read/export/宿主合同未闭口，不能作为唯一来源。 |
| `L3-method-library`、`L3-capability-hub` | 运行期能力 owner | method/capability view/ref | 运行期 | 条件 | exact surface/activation pending；不复制 Provider/registration/readiness。 |
| `L4-observability`、`L4-sandbox`、`L4-archive` | 运行期 owner | read-only 状态/ref、诊断/链接 | 运行期 | 条件 | 不执行 archive/sandbox，不生成 audit/evidence/report。 |
| `L0-bus` | 事件协作主干 | 只经 SDK 的可选提示来源 | 事件协作 | 否（直接边界） | 不直连 bus、不维护 cursor/replay/projection；正式 SDK hint 激活后才消费。 |
| 未停审 `L5-chat`、`L5-runner`、`L5-sync`、`L6-marketplace`、`L6-bridges` | Layer 5/6 并行候选 | future link/ref | 运行期/待定 | 否 | 不消费私有 API、页面、事件或状态。 |

#### 7.4 依赖分类与方向图

#### 依赖裁剪图: L5-console

```text
                         [compile/runtime package]
        L0-sdk  ─────────────────────────────────────►  L5-console
          │                                              │
          │ [optional event hint via SDK]                │ [runtime via SDK/formal boundary]
          ▼                                              ▼
       L0-bus                                      L1/L2/L3/L4 owners
   (not direct dependency)                         (independent truth)

  L0-core ──[conditional compile semantic package]──► SDK/client boundary
  L5/L6 pending projects ──[future link/ref only]──► Console navigation seam
```

关键说明：

- 图表达 compile/runtime/event/link-ref 的依赖类型和方向，不表达调用时序、事件传播时序或文件布局。
- `L0-bus` 只能通过正式 SDK hint 进入失效协作；不存在直接 broker、cursor、replay 或 projection 依赖。
- L1～L4 是独立 truth owner；运行期消费不能写成本地 package/path dependency。

#### 7.5 未决技术选择表

| 选择项 | 当前结论 | 依据 | 关闭条件 |
|---|---|---|---|
| TypeScript | 采用为计划客户端语言 | 官方 SDK TS package 事实、浏览器客户端边界 | 实现仓建立并确认 package/build authority。 |
| ESM | 采用为模块语义 | 官方 SDK `type: module` | 目标构建链确认。 |
| ES target/moduleResolution | 参考 ES2022/NodeNext，暂不宣称 Console 已锁定 | SDK `tsconfig.json` | Step 4/实施阶段确认浏览器编译 target。 |
| 前端 framework | pending | `01` 未选择；旧候选无 authority | 正式架构/实施 ADR 或目标仓事实。 |
| bundler/package manager | pending | 目标仓不存在 | 实现仓创建和实施计划。 |
| browser/a11y support matrix | pending | `CON-Q-046` | 05/06 authority。 |
| state carrier/cache medium、TTL | pending | `CON-Q-044` | 03 后续 Step 与 04/05 authority。 |

### 8. 回填草稿

以下内容是未来正式 `03-详细设计.md` §3 的回填草稿；本轮不写入正式文件。

本项目是计划中的 TypeScript/ESM 浏览器交互客户端。代码必须遵守 `standards/coding/typescript.md` 的严格类型、命名、具名导出、readonly 和导出符号 JSDoc 规则。官方 `@quantalithos/sdk` 当前是 private ESM TypeScript package，采用 ES2022/NodeNext/strict/declaration 事实；Console 以 SDK/正式服务 boundary 消费业务能力，但 exact owner surface 仍为 pending。框架、bundler、router、组件库、状态库、通信协议、缓存/存储产品、TTL、浏览器支持矩阵和诊断 envelope 未由当前架构锁定，不能从旧文档或草案继承。

Rust/Cargo/Rustdoc 规范只适用于 Rust 实现；当前 Console 不采用 Rust crate、Cargo workspace、binary 或 Rust path dependency，因此相应表格在本仓标记为不适用。L1～L4 owner 只能作为运行期 SDK/formal-boundary 依赖，`L0-bus` 只能经官方 SDK 的可选失效提示；不得直连数据库、repository、私有 bus、owner 源码或复制 Policy/Gate/业务规则。实施者开始前须读取本项目正式设计链、TypeScript/目录规范和可确认的提交规范；当前 git identity 为 `quantalithos-labs <quantalithos.ai@gmail.com>`，本轮不提交。

### 9. 待确认事项

- 前端 framework、bundler、package manager、browser target/support matrix、state carrier/cache medium、TTL 和 diagnostic envelope 仍 pending。
- `@quantalithos/sdk` 的 `ServiceClient`/`EventClient` 当前 skeleton 使用 `unknown`，owner exact query/command/result/ref 需由正式合同闭口后才能进入 Step 7/8；不得在本步补字段。
- `L0-core` 是否未来提供可直接消费的 JS/TS package 未确认；在此之前不得把 Rust crate 或 path 写入 Console package dependency。
- 项目独立提交规范文件当前未发现；07 必须把“待确认提交规范”列入实施前置阅读，不得编造格式。
- 目标实现仓不存在；本步不创建 `package.json`、`tsconfig.json`、lockfile 或源码文件。

### 10. 进入下一步条件

- [x] 语言、模块语义、浏览器运行形态和官方 SDK 消费事实已区分“采用 / 参考 / pending”。
- [x] TypeScript 编码规则和 Rust/Cargo 不适用边界已明确；没有把 Rust 专属字段强套到客户端。
- [x] 安全、鉴权、owner truth、DB/BFF/worker/private bus 和 forbidden-body 边界已列为实现约束。
- [x] 编译期、运行期、事件协作和 future link/ref 依赖已按全局规则裁剪。
- [x] 未从旧框架、Provider Contract、固定参数或 SDK skeleton 的 `unknown` 发明正式契约。
- [x] 未创建实现仓、未修改正式 `03-详细设计.md`、未运行测试、未提交 commit；下一步允许进入 Step 4。
