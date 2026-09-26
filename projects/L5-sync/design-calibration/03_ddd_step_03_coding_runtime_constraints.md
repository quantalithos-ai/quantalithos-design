# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3（按本仓 TypeScript 实际情况转译 Rust 专属问题）
- 回填章节：正式 `03-详细设计.md` §3 实现约束与编码规范承接、§16 实施承接
- 前序门禁：Step 1～2 已完成；`SYNC-UP-001~010` 均保持 `pending/blocked`。
- 正式 `03-详细设计.md` 写入：`false`

### Step 内计划完成情况

1. [x] 回读正式 01 技术机制、Step 2 范围、TypeScript/目录/项目提交规范和全局依赖裁剪。
2. [x] 只读核验目标实现仓、SDK TypeScript package、package metadata/source 和设计仓 git identity。
3. [x] 区分 stable language constraints、SDK compile/runtime seam 与未决工具选择。
4. [x] 将 Rust 专属 SOP 项标记为本仓不适用并用 TypeScript/JSDoc 对应约束替代。
5. [x] 完成依赖真实性、源码风格、安全边界、回填草稿和静态自检。

## 2. 本步输入与事实核验

| 输入/检查 | 核验结果 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 单 TypeScript package、CLI + library、五部分 P0 契约 | 限定语言/runtime 讨论范围 |
| 正式 01 §8/§11/§13 | ports/adapters、SDK formal seam、Git/fs/store isolation、安全横切 | 约束依赖与设施边界 |
| `standards/coding/typescript.md` | 命名、JSDoc、ES modules、named exports、strict typing practices | 作为源码规范 authority |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓为 `quantalithos-sync`；非 Rust 目录无专属强制模板 | Step 4 需作 TypeScript 适配，不套 Cargo 规则 |
| `projects/README.md`、`architecture/仓库拆分方案.md` | L5 项目语言建议为 TypeScript；拆分方案旧条目称 Rust CLI+library | 当前总项目分类优先，旧 Rust 条目作为历史冲突，不直接采用 |
| `/home/aris/Projects/quantalithos-sdk/packages/typescript/package.json` | `@quantalithos/sdk` v0.1.0、private、ESM、build=`tsc` | 可确认的编译期 package candidate |
| SDK `tsconfig.json` | target ES2022、NodeNext、declaration、strict | 兼容方向参考，不代表 Sync 已锁精确 Node 版本 |
| SDK TypeScript source | `SdkClient`、`ServiceClient`、`EventClient`、`ClientContext`; call/read/publish/openSubscription 使用 `unknown` | 不存在可直接引用的 Sync 专用 DTO/surface |
| `/home/aris/Projects/quantalithos-sync` | `NOT_CREATED` | 所有 package/path/file 仅可写 `planned/not_created` |
| 设计仓 `git config --local` | `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com` | 只读记录；未修改 git config，不构成实现仓设置 |

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖？

- 语言：TypeScript。
- 模块形态：ES modules；采用 strict typing。
- runtime：Node-compatible CLI runtime，精确 Node 版本仍为 `local_pending`；不能把 SDK 的 ES2022/NodeNext 编译设置等同 Sync 的最终版本合同。
- package 形态：单 TypeScript package，同时提供 CLI entry 与 embeddable library surface；不采用 Rust workspace。
- framework/parser：当前不锁 CLI parser、dependency injection/framework、test runner、schema/validation library 或 Git library。
- 已核验 dependency candidate：`@quantalithos/sdk`，用于正式平台 capability seam；其当前 Sync surface 不完整，必须由 inward-defined ports 隔离。

### 3.2 TypeScript 规范中哪些内容影响对象、错误、ports、async、测试和注释？

1. UpperCamelCase 用于 class/interface/type/enum，lowerCamelCase 用于函数/变量/成员，常量使用 CONSTANT_CASE，文件名使用 snake_case。
2. ES modules + named exports；不得使用 namespace、CommonJS `require`、默认导出或可变导出。
3. 对象 shape 优先 interface；复杂输入先以 `unknown` 接收并通过 validator/type guard 收窄，禁止用 `any` 或 assertion 绕过边界。
4. 所有导出的顶层 symbol 使用 JSDoc；正文设计阶段以中文解释实现语义，未来源代码注释语言须遵循项目实现约定，不能从旧 Rustdoc 模板机械复制。
5. `readonly` 表达 immutable selection/plan/candidate/view；不可变规则不能只依赖约定。
6. async port 返回 `Promise<TypedResult>`；不得把 transport exception、ACK 或 rejected promise 直接解释成业务 Decision。
7. 禁止 `@ts-ignore`、`@ts-expect-error`、`@ts-nocheck`、`eval`、动态 `Function`、任意 shell 拼接和非标准运行时特性。

### 3.3 是否必须遵守 rustdoc 风格注释？

Rustdoc/Cargo 专属格式对本仓不适用。对应门禁为：所有 exported interface/class/type/enum/function/port/adapter 和每个 enum member 都必须有有意义的 JSDoc；字段语义若不能从类型清楚推断，也必须有 JSDoc。不得用注释重复类型名，也不得遗漏带载荷 union/member 的业务语义。

详细设计后续若提供 TypeScript 契约代码块，应使用 `typescript` fence，并保持英文 identifier + 可审查说明；不能用 Rust 代码块或 Cargo 名称伪装实现。

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 要求？

- 必读 `projects/README.md`、TypeScript 编码规范、目录组织规范和最终 `07-实施计划.md`。
- 在目标实现仓存在后只读检查 repository-local `git config user.name/user.email`，不得假设设计仓 identity 自动继承。
- commit message 使用英文；本轮没有提交授权，`commit_required=false`。
- 当前只读核验设计仓 identity 为 `quantalithos-labs / quantalithos.ai@gmail.com`，未执行任何 config 写入。

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现？

- Identity authentication、Work authorization/project posture、Artifact/Workspace source authority、Governance Gate/Decision、Archive lifecycle 与 Observability evidence truth。
- Git remote/server truth、credential storage、token/private key management、平台数据库、private endpoint 或 direct bus subscription。
- SDK/Git/fs adapter 只翻译和执行 inward-defined minimal port，不得裁决 domain rule、缓存授权、自动 Git、保存 provider body 或把 diagnostics 当 success。

### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库？

当前可确认 `@quantalithos/sdk` TypeScript package 存在，可作为编译期 package candidate 和运行期 capability client seam。`L0-core` 的当前实现以 Rust contracts 为主，本轮没有核验到可供 Sync TypeScript 直接依赖的 `L0-core` package，因此不能把 Rust crate 或文档类型写入 npm dependency。

Identity/Work/Artifact/Workspace/Governance/Archive/Observability 是运行期 owner/collaboration 关系，默认经 SDK/adapter，不得直接依赖 sibling service 源码。

### 3.7 哪些是已确认编译期依赖，采用什么本地与中期引用方式？

| 依赖 | 当前分类 | 当前本地方式 | 中期方式 | 限制 |
|---|---|---|---|---|
| `@quantalithos/sdk` | 编译期 package candidate + 运行期 client seam | sibling package `/home/aris/Projects/quantalithos-sdk/packages/typescript` 可作为计划 local workspace/file reference；具体 package manager syntax 未锁 | private registry 或 private git/tag/rev 需后续 ADR/实施计划 | 当前 methods 使用 `unknown`，不能视为 Sync schema 已发布 |
| `L0-core` | 全局规则为 compile candidate，但 TS package 未核验 | 无可写的 TypeScript path dependency | 等正式 TS/shared-contract package | 不引用 Rust crate，不复制 proto/DTO |
| L1/L4 owners | 运行期（经 SDK） | 无源码依赖 | SDK formal capability | 禁止 service repo path dependency |
| Git/filesystem | 本地 runtime/tool boundary | adapter port；具体 library/child process 未定 | 按实际 tool compatibility 决定 | no arbitrary shell/remote truth |

### 3.8 运行期/事件协作为何不能写成 package dependency？

运行期 owner 调用只经 SDK formal seam；conditional inbound events 当前均 `planned/blocked`，未建立直接 `L0-bus` 依赖。把服务仓源码、owner internal DTO 或 bus implementation 加为 package dependency 会违反全局依赖裁剪并复制 truth。

## 4. 当前文档问题诊断

旧正式 03 和 README/draft 以 Rust/Tauri、Cargo 风格目录、固定 metadata 与 Git 工具能力为前提；仓库拆分方案中也有历史 Rust 描述，而项目总 README 将 L5 语言建议列为 TypeScript。当前正式 01 已明确 Rust/Tauri 不作架构结论，本轮又核验到可消费的官方 SDK TypeScript skeleton，因此 Step 3 采用 TypeScript + ESM + Node CLI planned 方向，并将旧 Rust 口径登记为 historical conflict，而不是拼接两套运行时。

另一个风险是误把 `@quantalithos/sdk` 已存在解读为 Sync capability 已可用。当前 SDK 的 service/event methods 仍收发 `unknown` 并抛出 host-wiring error；它证明 package seam 存在，不证明 owner-specific DTO、错误、compatibility 或 runtime wiring 可用。

## 5. 改动前后对比

| 项 | 历史/易误读口径 | 当前约束 |
|---|---|---|
| 语言/构建 | Rust/Cargo/Tauri | TypeScript + ESM + Node-compatible CLI；精确版本/工具待定 |
| 仓形态 | Rust binary + crate/library | 单 TypeScript package，CLI + library exports |
| SDK | 旧 RPC 名或 private endpoint | `@quantalithos/sdk` formal seam + inward ports；Sync surface blocked |
| L0-core | 默认 crate/path dependency | 无已核验 TS package，不形成当前 dependency |
| 类型安全 | provider DTO/opaque JSON 可直穿 | local typed DTO + `unknown` validation at adapter edge；avoid `any` |
| 注释 | Rustdoc 模板 | exported TypeScript symbols 和 enum members 使用 JSDoc |
| Git 调用 | 任意命令或脚本 | typed whitelist port；具体 library/process 后置 |
| 仓事实 | 目录树被写成现状 | 目标仓不存在，全部路径标 `planned/not_created` |

## 6. 设计取舍

1. 采用 TypeScript + ESM + Node-compatible CLI，原因是 L5 总体语言约定与可核验 SDK package；不采用历史 Rust/Tauri 主线。
2. 采用单 package + 双入口，保持 CLI 与 library 共用 domain/application core，避免多包过早拆分和规则复制。
3. `@quantalithos/sdk` 只进入 outer adapter；local domain/ports 不 import concrete SDK client/provider DTO。
4. 未确认的版本、package manager、CLI/test/schema/Git library 不做占位选择；在 Step 4 仅预留明确职责文件，不添加虚假 dependency。
5. TypeScript 规范中的“不要使用 `import type`”与当前 SDK skeleton 的写法存在差异；本项目以仓级 TypeScript 规范为设计基线，未来若工具链要求冲突须通过正式规范/ADR 解决，不能静默例外。

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文/后续实现的影响 |
|---|---|---|
| TypeScript §1 | UpperCamelCase/lowerCamelCase/CONSTANT_CASE、文件 snake_case、描述性名称 | Step 4 目录/文件/类型命名；禁止 `I` 前缀和架构层级前缀 |
| TypeScript §2 | UTF-8、exported top-level JSDoc、有意义注释 | Step 6～8 每个 public type/member/function 有说明 |
| TypeScript §3 | readonly、const/let、strict control flow、no ignore/eval/debugger | immutable models、adapter validation、no unsafe bypass |
| TypeScript §4 | ES modules、named exports、no namespace/default/mutable export | package/library public surface 和 barrel 规则 |
| TypeScript §5 | object interface、optional fields、avoid any、runtime narrowing | DTO/result/error、metadata decode、SDK/provider mapping |
| 目录规范 | 仓名 `quantalithos-sync`、无 `L5`/`quantalithos` 内部前缀、职责明确 | Step 4 计划布局；Rust/Cargo 章节不适用 |
| 项目 README | L5 TypeScript、英文 commit、00～07 串行 | 语言和实施交接，不授权 commit |

### 7.2 TypeScript 注释与契约约束

| 元素 | 要求 | 禁止 |
|---|---|---|
| exported interface/class/type | JSDoc 描述业务职责、truth owner 和关键边界 | 只重复 symbol 名、遗漏 ownership |
| field/property | 类型明确；immutable 用 `readonly`；敏感/owner/body 字段说明禁入 | `any`、隐含 null、raw provider body |
| enum/discriminated union member | 每个 member 说明语义和允许用途；带载荷成员说明 payload | 单一 `Success/Failed` 压平多轴状态 |
| exported function/method | typed parameters/result/error/effect；异步边界明确 `Promise` | 未标副作用、throw unknown raw error |
| adapter decode | 输入先 `unknown`，runtime validation/type guard 后映射 local type | assertion、`@ts-ignore`、opaque map 直穿 core |
| source language | identifiers/paths 使用英文；正式设计说明可中文 | 中英混杂 identifier、层级前缀 |

### 7.3 实现约束表

| ID | 约束 | 影响模块/接口 |
|---|---|---|
| `TS-SYNC-01` | TypeScript strict + ESM；Node-compatible runtime | 全仓、CLI/library entry |
| `TS-SYNC-02` | named exports；无 default export/namespace/CommonJS | public library surface、composition |
| `TS-SYNC-03` | provider/fs/metadata decode 从 `unknown` 收窄 | SDK/Git/fs/metadata adapters |
| `TS-SYNC-04` | domain/application 不依赖 concrete SDK/Git/fs/store | dependency direction、Step 4 layout |
| `TS-SYNC-05` | exported contracts 和 enum members 均有 JSDoc | Step 6～8 objects/ports/protocols |
| `TS-SYNC-06` | no `any`/ignore/eval/arbitrary shell | adapter、安全、test doubles |
| `TS-SYNC-07` | immutable input/plan/candidate/view 用 readonly | CP1/CP3/CP5 objects |
| `TS-SYNC-08` | query path 不得获得 mutation ports | status/query modules、composition |
| `TS-SYNC-09` | secret/raw body/raw output 不进入 domain/result/log/metadata | SDK/Git/fs/diagnostics |
| `TS-SYNC-10` | 精确 runtime/package/tool choice 缺 authority 时保持 `local_pending` | package metadata、CLI/config/testing |

### 7.4 本地多仓依赖约束表

| 依赖仓/设施 | 全局依赖类型 | 本地存在性/路径 | 当前引用方式 | 中期引用方式 | 影响实现单元 |
|---|---|---|---|---|---|
| `quantalithos-sdk` TS package | compile candidate + runtime seam | exists: `packages/typescript` | planned local package reference，语法待 package manager 决定 | private registry/git tag/rev，待 ADR | `adapters/sdk`、composition |
| `quantalithos-core` | compile candidate | repo exists，但 TS package 未核验 | none | 等正式 TS shared contract | contracts/adapters only if published |
| identity/work/artifact/workspace/governance/archive | runtime via SDK | design/implementation independently owned | no path dependency | formal SDK capability | SDK adapters |
| observability | runtime/telemetry collaboration | external owner | diagnostics port | formal SDK/sink adapter | diagnostics adapter |
| Git/filesystem | local runtime facility | host tool/OS | inward ports；implementation choice pending | capability/version matrix | local adapters |

### 7.5 已核验 SDK surface 与使用上限

| SDK symbol | 当前事实 | L5-sync 可假定 | 不得假定 |
|---|---|---|---|
| `SdkClient` | 组合 `ServiceClient` 与 `EventClient` | package 提供统一 client skeleton | 已有 Sync-specific client/method |
| `ClientContext` | actorRef/traceId/credentialRef?/targetProfile | adapter 可传正式 context ref | 它完成 owner authorization |
| `ServiceClient.call/read` | `unknown -> Promise<unknown>`，host wiring error | 可作为未来 transport seam 证据 | request/result/error schema 已闭合 |
| `EventClient.publish/openSubscription` | `unknown -> Promise<unknown>` | event package skeleton 存在 | 当前 consumers/topic/schema 可启用 |
| `SdkClientError` | 单一 message error | 存在 SDK error base | owner error taxonomy/unknown outcome mapping 已发布 |

### 7.6 本地待决项登记

| ID | 待决项 | 当前状态 | Step 4 处理上限 |
|---|---|---|---|
| `SYNC-LOCAL-001` | 精确 Node.js 版本 | `local_pending` | 写 Node-compatible/ES2022-compatible planned runtime，不填数字 |
| `SYNC-LOCAL-002` | npm/pnpm/yarn/bun | `local_pending` | 不创建 lockfile，不写 install command |
| `SYNC-LOCAL-003` | package/binary 名 | `local_pending` | 使用 `<package-name-tbd>` / `<binary-name-tbd>` 说明，不把 `qs-sync` 当事实 |
| `SYNC-LOCAL-004` | CLI parser/schema validator/test runner/Git library | `local_pending` | 只定义 adapter/parser/test responsibilities |
| `SYNC-LOCAL-005` | SDK local dependency syntax与版本范围 | `local_pending` | 只写 dependency candidate/path fact，不写 package.json 条目 |

## 8. 回填草稿

正式 §3 应摘录 §7.1～§7.5：声明 TypeScript + ESM + strict + Node-compatible CLI、JSDoc/named export/type safety、ports/adapters dependency rule，以及 `@quantalithos/sdk` 的真实 surface 上限。

正式 §16 应提醒实施者：目标仓创建后复核 repository-local git identity、选定 Node/package manager/toolchain ADR、验证 SDK version/surface，且不得以 `unknown` SDK methods 或 fake 关闭 `SYNC-UP-001~010`。

延伸阅读入口指向本文件“编码规范承接表”“TypeScript 注释与契约约束”“本地多仓依赖约束表”“已核验 SDK surface 与使用上限”“本地待决项登记”。

## 9. 待确认事项

- `SYNC-UP-001~010` 仍为 `pending/blocked`；本步只增加 `SYNC-LOCAL-001~005`，不改变上游状态。
- `@quantalithos/sdk` 的具体 version range、package manager 和 local workspace/file syntax需待目标仓工具链确定。
- TypeScript 规范与现有 SDK skeleton 的 `import type` 差异需要未来统一规范或 ADR；本轮不改 SDK，不以现状覆盖规范。

## 10. 进入下一步条件与自检

- [x] 已明确 TypeScript、ESM、strict、Node-compatible runtime 和单 package 双 surface。
- [x] 已将 Rustdoc/Cargo 专属问题诚实转译为 TypeScript/JSDoc/package 规则。
- [x] 已只读核验目标仓不存在、SDK package/source 和 git identity，未修改外部仓或 git config。
- [x] 已区分 `@quantalithos/sdk` 的存在与 Sync-specific capability 可用性。
- [x] 编译期 package、运行期 owner、event collaboration 和 local tool 边界未混淆。
- [x] 精确版本/package/parser/test/Git 工具保持 `local_pending`，无脑补。

结论：`gate_status=pass_with_upstream_blockers`；允许创建并完成 Step 4。该结论不授权创建实现仓、修改 SDK、实现代码、测试或提交。
