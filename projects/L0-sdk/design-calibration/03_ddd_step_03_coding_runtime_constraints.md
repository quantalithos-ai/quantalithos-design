## Step 3. 收稳编码规范、语言 / runtime、仓库约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-sdk/03-详细设计.md` §3 实现约束与编码规范承接 / §16 详细设计到实施计划的承接清单

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 本轮 P0 实现范围、非范围、P1 后移能力和实现者可完成代码范围 | 限定本步只讨论会影响代码形态的约束 |
| `standards/coding/rust.md` | Rust 命名、格式、源码语言、rustdoc、rustfmt / clippy 边界 | 作为真实实现仓编码规范来源 |
| `standards/document/详细设计书写规范.md` | Rust 契约片段、Rustdoc 中文注释、函数参数类型、伪代码调用、目录与依赖约束 | 作为正式 `03` 输出格式约束 |
| `standards/document/实施计划书写规范.md` | 实施前置阅读、git config、commit message、提交时机和代码批次规则 | 作为 Step 17 和 `07-实施计划.md` 的承接输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L0-sdk 的编译期、运行期、事件协作依赖裁剪口径 | 判断哪些依赖可以进入 Cargo path dependency |
| `standards/document/子项目目录与代码文件组织规范.md` | `/home/aris/Projects` 实现仓位置、workspace / package / crate / binary 命名规则 | 作为 Step 4 文件布局输入 |
| `projects/L0-sdk/01-架构设计.md` §8 / §11 / §13 | L0-core / L0-bus 编译期上游、formal API / fake endpoint 运行期边界、ports and adapters、横切默认和安全边界 | 作为 runtime、依赖和安全边界输入 |
| `/home/aris/Projects/quantalithos-core` | 已存在的 L0-core 实现仓，当前为 workspace 多 crate 结构 | 作为本地 path dependency 的实际 sibling repo 输入 |
| `/home/aris/Projects/quantalithos-bus` | 已存在的 L0-bus 实现仓，当前为 workspace 多 crate 结构 | 作为本地 path dependency 的实际 sibling repo 输入 |

已确认结论：

```text
L0-sdk 详细设计使用 Rust 可实现契约表达,同时必须覆盖 Rust / Python / TypeScript 三语言官方 SDK 产物。
正式详细设计中的 Rust 契约片段使用中文 Rustdoc 风格注释。
真实实现仓源码必须遵守 standards/coding/rust.md: 标识符、普通注释、rustdoc、测试名默认使用英文。
L0-sdk 已确认编译期依赖是 L0-core contracts 和 L0-bus contracts; 当前通过 /home/aris/Projects 下的 sibling repo 本地 path dependency 引用。
formal API、fake / fixture endpoint、服务仓、gateway、identity、governance、UI、runtime、public registry 都不是本仓 Cargo path dependency。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮实现范围和非范围。
```

### 3. SOP 问题回答

1. 本仓使用什么语言、runtime、框架和主要依赖？

   回答：本仓以 Rust 作为实现契约和本地维护 / 生成 / 验证主实现语言，同时交付 Rust / Python / TypeScript 三语言 SDK 产物。Rust 侧按 ports and adapters 组织，领域对象和 policy 优先同步、纯粹、可测试；source / adapter / runner / package builder / bus boundary 等外部 I/O 可以 async。P0 不固定 HTTP / RPC / DB / MQ 框架，具体 adapter 和 runner 由后续 Step 7 / Step 8 / Step 14 收口。

2. Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

   回答：命名规则影响 crate、module、type、trait、function、test 命名；源码语言约束要求真实实现仓的标识符、普通注释、rustdoc 和测试名默认英文；rustdoc 规则要求公开 struct、enum、enum variant、trait、function 都有文档注释；错误处理、trait / port、async 边界、测试命名和 rustfmt / clippy 检查必须在详细设计中转化为明确契约，不能只写“交给工具处理”。

3. 是否必须遵守 rustdoc 风格注释？struct、字段、enum、enum variant、函数分别如何注释？

   回答：必须遵守。`quantalithos-design` 中的正式详细设计使用中文 Rustdoc 风格注释，用于审查对象、字段、函数和状态语义；真实实现仓 `/home/aris/Projects/quantalithos-sdk` 中的源码注释、rustdoc、测试名必须使用英文。struct 说明对象责任和不变量；字段说明类型、业务含义、约束和来源；enum 说明分类边界；每个 enum variant 必须单独注释；函数说明行为、副作用、参数、返回和错误语义。

4. 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

   回答：实施者必须阅读 `standards/document/实施计划书写规范.md` 中的提交规范、git config 用户检查、提交时机和代码批次规则。当前设计仓允许中文 commit；除设计仓外的实现仓 commit message 必须使用英文。实施者进入 `/home/aris/Projects/quantalithos-sdk` 后必须检查项目级 `git config user.name` 和 `git config user.email`，不能只依赖全局配置。

5. 哪些安全、鉴权、网关或外部边界不应在本仓实现？

   回答：SDK 不实现登录认证、token 校验、权限裁决、治理审批、gateway / nginx-like 安全入口、服务端业务逻辑、bus runtime truth、UI / runtime state、observability 长期存储或 public registry 发布运营。SDK 只保护 credential material、传播 actor / trace / metadata、封装 formal API / fake boundary、提供 bus event client view、记录本地 evidence 和 compatibility truth。

6. 本仓是否依赖已经实现的 Quantalithos 仓库？

   回答：是。当前已存在 `/home/aris/Projects/quantalithos-core` 和 `/home/aris/Projects/quantalithos-bus`，分别提供 core contracts 和 bus contracts。未发现 `/home/aris/Projects/quantalithos-sdk` 目标实现仓，实施计划需要要求创建或确认该目标仓。

7. 这些依赖中哪些是已确认的编译期依赖？

   回答：已确认编译期依赖是 `core-contracts` 和 `bus-contracts`。`core-contracts` 提供共享契约、错误、trace、metadata、CloudEvents 等基础类型；`bus-contracts` 提供 bus 语义、event client view、publish / subscribe 边界可引用的契约类型。formal API、fake endpoint、服务仓、gateway、identity、governance、UI、runtime 和 public registry 都不是编译期依赖。

8. 依赖仓库在 `/home/aris/Projects` 下是否存在？

   回答：`quantalithos-core` 和 `quantalithos-bus` 已存在；`quantalithos-sdk` 未发现。当前已检查到 `quantalithos-core/crates/contracts/Cargo.toml` 的 package 名为 `core-contracts`，lib crate 为 `core_contracts`；`quantalithos-bus/crates/contracts/Cargo.toml` 的 package 名为 `bus-contracts`，lib crate 为 `bus_contracts`。

9. 对已确认的编译期依赖，当前是否采用本地 path dependency？中期是否记录 private git tag / rev 方案？

   回答：是。当前阶段采用本地 sibling repo path dependency；中期可切换 private git tag / rev，但不作为 P0 默认前置。当前不默认发布到公共 crates.io，不默认引用 GitHub。

10. 哪些关系只是运行期依赖或事件协作依赖，不能写成 Cargo path dependency？

   回答：formal API / fake endpoint、L1/L2/L3/L4 服务仓、bus runtime store、gateway、identity、governance、observability、UI、runtime、public registry 和下游 SDK 消费方都是运行期或事件协作依赖，不得写成 Cargo path dependency。它们应通过 adapter、port、event、projection、configuration、fake target 或 read-only view 表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 未按新版 Step 3 明确 Rust 编码、注释、依赖、runtime 和安全边界 | 后续对象、trait、API、状态机和处理流可能口径不一致 |
| 旧版 `03-详细设计.md` | 旧口径容易把 generated binding / wrapper / subscription helper 当成本仓全部实现主线 | 会遗漏 semantic baseline、freshness、candidate evidence 和 compatibility 代码契约 |
| 旧版 `03-详细设计.md` | 未区分设计文档中文 Rustdoc 与实现仓英文源码注释 | 实施者可能把中文注释直接复制进代码仓 |
| 旧版 `03-详细设计.md` | 未明确只有 core / bus contracts 是编译期依赖 | 容易把服务仓、gateway、runtime、public registry 或 UI 错写成 Cargo path dependency |
| 当前详细设计流程 | 尚未记录 `/home/aris/Projects` 下真实上游仓和 crate 路径 | Step 4 / Step 14 可能凭空填写 dependency path |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 编码规范来源 | 旧文没有稳定承接 | 明确承接 `standards/coding/rust.md` 和详细设计书写规范 | 保证后续实现契约一致 |
| 注释语言 | 设计文档与实现源码边界不清 | 设计文档中文 Rustdoc，真实源码英文 Rustdoc | 对齐 design 仓和实现仓语言边界 |
| 编译期依赖 | 旧文可能隐含 codegen / wrapper / service 依赖 | 仅 `core-contracts` 和 `bus-contracts` 可作为已确认编译期依赖 | 防止跨仓循环和真相污染 |
| 本地依赖方式 | 未说明 sibling repo 路径 | 当前采用 `/home/aris/Projects/quantalithos-core` 与 `/home/aris/Projects/quantalithos-bus` 本地 path dependency | 符合当前不发公共 crates 的共识 |
| 外部边界 | auth、gateway、service、bus runtime、registry 可能混入 SDK | 明确均为非 Cargo path dependency | 保持 SDK 职责边界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只按 Rust crate 写 SDK，不显式处理 Python / TypeScript | 实现范围更窄 | 违背三语言官方 SDK 定位，无法证明 cross-language consistency | 不采用 |
| 方案 B：Rust 作为实现契约和生成 / 验证主线，三语言 SDK 产物通过模块、runner、builder、artifact 和 evidence 契约覆盖 | 能保持详细设计可实现，同时覆盖三语言 P0 闭环 | 需要 Step 4~8 明确 module / package / artifact 边界 | 采用 |
| 方案 C：把 Rust / Python / TypeScript 三套源码都在详细设计中完全展开 | 看似完整 | 详细设计过重，且 Python / TypeScript idiomatic surface 需要后续 package 设计细化 | 不采用 |

推荐方案：方案 B。

原因：

- 详细设计规范以 Rust 实现契约为主，适合定义 truth、policy、repository、job、runner、builder 和 evidence。
- SDK 的 P0 验证必须覆盖三语言产物，但不需要在本轮把三套语言源码全部展开成等量细节。
- 方案 B 可以让实现者先完成可编译、可测试、可验证的本地维护与生成闭环。

### 7. 结构化中间产物

#### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` 源码语言约束 | 真实实现仓标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 默认使用英文 | 正式详细设计可用中文 Rustdoc 契约，实施时必须转写为英文源码注释 |
| `standards/coding/rust.md` rustdoc | 公开函数、结构体、枚举、枚举变体、trait、模块应使用文档注释；公开枚举每个 variant 必须有 `///` | Step 6 / Step 7 / Step 10 / Step 12 不得省略 struct、enum、variant、trait、函数注释 |
| `standards/coding/rust.md` 命名 | crate / module / function / method / variable 使用 `snake_case`；type / trait / enum variant 使用 `UpperCamelCase` | Step 4~8 的模块、对象、trait、DTO、event、job 命名必须符合 Rust 习惯 |
| `standards/coding/rust.md` rustfmt / clippy 边界 | rustfmt / clippy 不能替代编码规范和设计契约 | 详细设计必须写清字段、函数、错误、状态和边界，不能只写“由 clippy 检查” |
| `详细设计书写规范.md` Rust 契约 | Rust 代码块必须可作为实现契约，字段、函数和注释足够具体 | Step 6~12 必须输出可实现的 Rust 契约片段 |
| `详细设计讨论流程_SOP.md` 跨文档闭环 | Step 6 -> Step 8 -> Step 9 -> Step 10 -> Step 16 -> Step 17 必须一致 | 状态名、DTO 字段、对象构造、phase boundary 不得互相冲突 |
| `实施计划书写规范.md` commit / git config | 实施者必须阅读提交规范和检查项目级 git config | Step 17 / `07-实施计划.md` 必须继续承接 |

#### 7.2 Rust 注释约束表

| 项 | 设计文档必须说明 | 真实源码必须说明 |
|---|---|---|
| crate / module | 模块职责、边界和不承担事项 | English `//!` module docs with responsibility and boundary |
| struct | 对象代表什么、维护什么不变量、不保存什么 | English `///` summary, invariants and sensitive-data boundary |
| 字段 | 字段类型、业务含义、约束、来源、是否系统生成 | English field docs when public or contract-bearing |
| enum | 状态 / 分类 / 错误集合边界 | English `///` docs for enum purpose |
| enum variant | 业务语义、使用场景；带载荷时说明载荷语义 | English `///` docs for every public variant |
| trait / port | 外部依赖、调用方向、实现方、禁止事项 | English `///` docs for dependency direction and error contract |
| public function | 函数做什么、改变什么、不改变什么、参数、返回和错误语义 | English docs with behavior, errors and side effects |

#### 7.3 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 是本轮实现契约主语言 | 03 使用 Rust struct / enum / trait / function signature 表达实现契约 | 全文 |
| 三语言 SDK 产物必须进入 P0 闭环 | Rust / Python / TypeScript 不能只在文档中出现，必须通过 package builder、runner、artifact 和 evidence 进入验证链 | language binding、package candidate、smoke、docs validation |
| Domain / policy 优先同步纯函数 | 领域对象不直接 await、不直接读配置、不直接调用外部服务 | domain model、policy、state machine |
| 外部 I/O 经 port / adapter | source、formal API、fake endpoint、bus boundary、runner、builder、repository 通过 trait 表达 | ports、application services、jobs |
| SDK 不做 auth / governance | 只传递 actor、client call context、credential ref，不做认证和审批 | command / query / service call / event publish |
| 禁止正文和 secret 进入 truth / evidence | raw request / response / payload / secret 不得进入对象、event、report、error body | boundary guard、redaction、credential policy、evidence |
| Query 和 projection rebuild 不反写真相 | 只读接口不得触发状态迁移 | query、projection、read model |
| public registry 不是 P0 前置 | `Stable` 只表示本地稳定基线 | package candidate、compatibility、implementation handoff |

#### 7.4 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、api、jobs、tests |
| `quantalithos-bus` / `bus-contracts` | 编译期依赖 | `/home/aris/Projects/quantalithos-bus/crates/contracts` | `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }` | private git tag / rev | event client view、publish / subscribe boundary、bus semantic mapping、tests |
| formal API / service endpoints | 运行期依赖 | 不适用 | adapter config + fake / formal boundary port | service-specific endpoint config | service client adapter、runtime command / query |
| fake / fixture endpoint | 运行期验证依赖 | 不适用 | fake boundary adapter + test config | controlled validation target | smoke、docs validation、boundary verification |
| gateway / identity / governance | 外部安全 /治理依赖 | 不适用 | actor / context / credential ref pass-through | external integration contract | command / query / event context |
| UI / runtime / public registry | 下游或后续阶段 | 不适用 | 不作为本轮依赖 | 后续重新裁剪 | 不进入 P0 implementation |

当前可预期 Cargo 引用：

```toml
[dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
bus-contracts = { path = "../quantalithos-bus/crates/contracts" }
```

约束：

- 上述路径来自已检查的本机 sibling repo 当前 workspace 布局。
- 是否还需要 `core-domain`、`bus-domain` 等 crate，必须由 Step 4 / Step 7 / Step 14 根据真实使用点确认，不在本步扩大依赖。
- 不默认发布到公共 crates.io，不默认引用 GitHub。

#### 7.5 本机仓库检查结论

| 仓库 | 默认路径 | 当前检查结论 | 本轮处理 |
|---|---|---|---|
| `quantalithos-core` | `/home/aris/Projects/quantalithos-core` | 已存在；`crates/contracts` package 为 `core-contracts`，lib crate 为 `core_contracts` | 当前作为编译期 path dependency |
| `quantalithos-bus` | `/home/aris/Projects/quantalithos-bus` | 已存在；`crates/contracts` package 为 `bus-contracts`，lib crate 为 `bus_contracts` | 当前作为编译期 path dependency |
| `quantalithos-sdk` | `/home/aris/Projects/quantalithos-sdk` | 当前未发现 | `07-实施计划.md` 应要求实施者创建或确认目标仓 |

#### 7.6 不能写成 Cargo path dependency 的关系

| 关系 | 类型 | 正确表达 | 错误表达 |
|---|---|---|---|
| SDK -> formal API / service endpoint | 运行期依赖 | `FormalApiBoundaryPort` + adapter config + fake / formal target | SDK 直接依赖 L1/L2/L3/L4 服务仓源码 |
| SDK -> fake / fixture endpoint | 运行期验证依赖 | `FakeBoundaryAdapter` + validation config | fake target 写成 domain truth |
| SDK -> gateway / identity / governance | 外部安全 / 治理依赖 | context / credential ref pass-through | SDK 实现认证、授权或审批 |
| SDK -> UI / runtime | 下游消费或运行调用方 | package / query / event client boundary | SDK 保存 UI state 或 runtime loop state |
| SDK -> public registry | 后续发布运营依赖 | artifact ref / local stable baseline | `Stable` 直接等于 public release |
| SDK -> observability platform | 运行期消费依赖 | trace / metric / audit marker | SDK 写入观测平台长期存储 |

### 8. 回填草稿

正式 `03-详细设计.md` §3 “实现约束与编码规范承接”应摘录并整理：

- 本文件 `7.1` 编码规范承接表
- 本文件 `7.2` Rust 注释约束表
- 本文件 `7.3` 实现约束表
- 本文件 `7.4` 本地多仓依赖约束表
- 本文件 `7.5` 本机仓库检查结论
- 本文件 `7.6` 不能写成 Cargo path dependency 的关系

正式 `03-详细设计.md` §16 “详细设计到实施计划的承接清单”应提醒实施者：

- 进入实现仓前阅读 Rust 编码规范、提交规范和实施计划。
- 检查 `/home/aris/Projects/quantalithos-sdk` 是否存在，不存在则创建或确认目标仓。
- 检查项目级 `git config user.name` / `git config user.email`。
- 实现仓 commit message 必须使用英文。

### 9. 待确认事项

- 无阻塞进入 Step 4 的待确认事项。
- `/home/aris/Projects/quantalithos-sdk` 当前未发现，实施计划需要明确创建或确认目标仓。
- 是否需要除 `core-contracts`、`bus-contracts` 之外的额外 core / bus crate，留给 Step 4 / Step 7 / Step 14 根据真实模块和 trait 使用点确认。

### 10. 进入下一步条件

- [x] 已明确语言、runtime、框架和主要依赖口径。
- [x] 已承接 Rust 编码规范和 rustdoc 注释要求。
- [x] 已明确设计文档中文注释与实现仓英文注释边界。
- [x] 已点名实施者需要阅读提交规范和检查 git config。
- [x] 已确认已存在的 sibling repo 和本地 path dependency 口径。
- [x] 已明确运行期依赖和事件协作依赖不得写成 Cargo path dependency。
