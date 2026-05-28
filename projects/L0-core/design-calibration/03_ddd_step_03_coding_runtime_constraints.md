# Step 3. 收稳编码规范、语言 / runtime、仓库约束

> 本版本是 L0-core 详细设计校准的 Step 3 中间产物。
> 本步只收稳会影响代码形态的语言、编码、注释、仓库、提交、runtime、依赖和安全边界约束。
> 本步不决定 crate / module / file tree,不展开对象字段、协议 schema、数据库表或函数级调用链。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节: `projects/L0-core/03-详细设计.md` §3 实现约束与编码规范承接

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 2 本轮范围 | 本轮覆盖 L0-core P0 主链完整实现契约 | 限定本步只讨论会影响 P0 实现契约的工程约束 |
| `standards/coding/rust.md` | Rust 命名、格式、源码语言、rustdoc、rustfmt / clippy 边界 | 作为实现仓编码规范来源 |
| `standards/document/详细设计书写规范.md` | 详细设计 Rust 契约片段、Rustdoc 中文注释、函数签名、伪代码调用和图表规则 | 作为设计文档输出格式约束 |
| `standards/document/实施计划书写规范.md` | 实施前置阅读、git config、commit message、design 仓 / 实现仓语言边界 | 作为实施交接约束来源 |
| `projects/README.md` §8.2 | 当前 design 文档仓提交规范与实现仓英文提交口径 | 作为后续实施计划提交纪律输入 |
| 当前 git config | `user.name=quantalithos-labs`, `user.email=quantalithos.ai@gmail.com` | 作为当前 design 仓配置事实;目标实现仓仍需单独确认 |
| `00-需求文档.md` §4 / §13 | L0-core 不做登录认证与权限裁决,不得保存凭据和外部正文 | 作为安全边界输入 |
| `01-架构设计.md` §3 / §11 / §13 | 不设计事件投递、SDK 客户端、认证授权;采用结构化契约源码、发布基线、只读快照、后台承接、外部正文引用 | 作为 runtime 与外部依赖边界输入 |
| `02-概要设计.md` §4 / §5 / §11 | 代码主体框架、6 个业务组成部分、技术支撑集合和详细设计承接清单 | 作为后续 Step 4~18 的约束输入 |

已确认结论:

```text
详细设计继续以 Rust 可实现契约表达 L0-core P0 主链。
详细设计中的 Rust 契约片段使用 Rustdoc 风格中文注释,用于设计审查和 1:1 转写。
真实实现仓源码必须遵守 standards/coding/rust.md 的源码语言约束:标识符、普通注释、rustdoc 和测试名默认使用英文。
L0-core 不实现认证、授权、事件总线投递、SDK 客户端封装或 L1 业务真相。
```

依赖的前序 Step:

```text
Step 1 已确认概要设计输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
```

---

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖?

回答:

本轮详细设计以 Rust 表达实现契约。L0-core 的主语是跨仓共享契约来源仓,不是在线业务服务、事件总线实现或 SDK 客户端中心,因此 Step 3 不提前锁定 Axum、Tonic、SQLx、PostgreSQL 等具体框架或适配库。

本步只收稳以下 runtime 约束:

| 类别 | 当前结论 | 说明 |
|---|---|---|
| 语言 | Rust | 详细设计中的对象、trait、DTO、event、job 和处理流均按 Rust 可实现形态表达 |
| 运行主体 | API / command handler、query handler、operations job、outbox relay worker 等实现单元 | 具体 crate / binary / module / file tree 在 Step 4 收稳 |
| 异步边界 | 外部 I/O、repository、event publisher、reference resolver、blob ref、gate decision 等通过 port / adapter 承接 | 是否使用 `async_trait`、trait associated future 或具体 runtime 库在 Step 4 / Step 7 继续细化 |
| 契约真相承载 | 结构化契约源码、发布基线、只读发布快照和可追溯记录 | 不把在线数据库或下游实现反向写成契约真相来源 |
| 外部传播 | 只通过 outbox / `EventPublisherPort` 把已提交事实交给 `L0-bus` 边界 | 不实现 publish / subscribe / ack / retry / dead-letter 运行时投递能力 |
| 安全入口 | 外层 gateway / nginx-like 层负责认证、授权和入口安全 | 本仓只接收可信入口传入的 actor / metadata / gate 引用并做审计 |

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

回答:

| 影响面 | 必须遵守的约束 | 对详细设计的影响 |
|---|---|---|
| 命名 | crate / module / function / method / variable 使用 `snake_case`; type / trait / enum variant 使用 `UpperCamelCase` | Step 4~8 中所有模块、类型、函数、trait、DTO、event、job 命名必须符合 Rust 习惯 |
| 源码语言 | 真实实现仓标识符、普通注释、rustdoc、测试名默认使用英文 | 设计文档中的中文 rustdoc 是设计契约说明,实现时应转写为英文源码注释 |
| 结构体 | 公开 struct 必须说明对象作用、不变量;字段必须说明类型、含义和约束 | Step 6 对象契约必须逐对象列出字段类型、字段作用、成员函数和工厂函数 |
| 枚举 | enum 本身说明分类边界;每个 variant 必须单独注释;带载荷 variant 必须说明载荷语义 | Step 6 / Step 10 状态类 enum、错误 enum、event enum 不得省略 variant 注释 |
| 错误 | 可恢复业务失败必须通过错误类型表达,不得用 `panic` 表达普通业务分支 | Step 12 必须定义错误 enum、错误映射、恢复口径和禁止 panic 的边界 |
| trait / port | port 必须表达依赖方向和所有权边界,不能让 domain 依赖 HTTP、DB、bus 或外部系统 | Step 7 必须逐 port 定义 trait 签名、参数类型、返回类型和实现方 |
| async | 外部 I/O 允许异步;领域对象函数应优先保持同步、纯粹和可测试 | Step 9 处理流必须区分 domain method 与 I/O port 调用 |
| 测试 | 真实实现仓测试名默认英文,测试切口必须围绕状态、错误、幂等、事务和边界 | Step 16 只给最小验证清单,完整测试策略留给 `05-测试方案.md` |
| 工具 | `rustfmt` / `clippy` 是检查工具,不能替代设计契约 | 详细设计必须明确字段、函数、错误和边界,不能只写“交给工具检查” |

### 3.3 是否必须遵守 rustdoc 风格注释? struct、字段、enum、enum variant、函数分别如何注释?

回答:

必须遵守,但要区分设计文档和真实实现仓。

| 场景 | 注释语言 | 约束 |
|---|---|---|
| `quantalithos-design` 中的详细设计契约片段 | 中文 | 使用 Rustdoc 风格 `///` / `//!`,用于让审查者理解对象作用、字段含义、函数边界和错误语义 |
| 目标实现代码仓源码 | 英文 | 遵守 `standards/coding/rust.md`:标识符、普通注释、rustdoc、测试名默认英文 |

详细设计中的 Rustdoc 写法约束:

| 项 | 必须说明 | 禁止写法 |
|---|---|---|
| struct | 这个对象代表什么、维护什么不变量、不属于它的内容 | 只写“数据结构” |
| 字段 | 字段类型、业务含义、约束、是否可为空或是否由系统生成 | 只写字段名不解释 |
| enum | 这个枚举表达的状态 / 分类 / 错误集合边界 | 把状态迁移规则只藏在注释里 |
| enum variant | 该取值的业务语义、使用场景;带载荷时说明载荷承载的数据或上下文 | 省略 variant 注释 |
| trait | 端口代表的外部依赖、调用方向、实现方和禁止事项 | 把基础设施细节写进 domain trait |
| public function | 函数做什么、改变什么、不改变什么、参数类型、返回类型、错误语义 | `activate(actor)` 这类裸参数 |

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

回答:

实施者开始前必须阅读提交规范并在目标实现仓确认项目级 git 配置。

| 项 | 要求 | 说明 |
|---|---|---|
| 提交规范来源 | `projects/README.md` §8.2、`standards/document/实施计划书写规范.md` §4.9 | 后续 `07-实施计划.md` 必须继续展开提交纪律 |
| 当前 design 文档仓 commit | `type` 英文,subject / body 中文,固定 footer `Co-Authored-By: Codex <noreply@openai.com>` | 仅适用于 `quantalithos-design` |
| 其他实现仓 commit | commit message 使用英文;若目标仓有更严格规范,取更严格者 | 不得继承 design 仓中文 commit 口径 |
| 当前 design 仓 git user | `quantalithos-labs` / `quantalithos.ai@gmail.com` | 当前仓事实 |
| 目标实现仓 git user | 必须在目标目录执行 `git config user.name` 和 `git config user.email` 检查 | 不使用 `--global` 污染全局配置 |

目标实现仓前置检查命令:

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

回答:

| 不应实现的边界 | 原因 | L0-core 只做什么 |
|---|---|---|
| 登录认证 / token 校验 | 属于安全入口或身份认证层 | 接收外层可信入口传入的 actor / request metadata |
| 授权裁决 / policy enforce | 属于 governance 或安全策略执行层 | 保存 approved gate / policy reference,不保存执行结果正文 |
| gateway / nginx-like 入口层 | 属于部署入口和安全边界 | 不直接处理凭据、session、token 或入口路由安全 |
| `L0-bus` 投递运行时 | 投递、订阅、ack、retry、dead-letter 属于 `L0-bus` | 写 outbox 并通过 `EventPublisherPort` 交给 bus 适配器 |
| `L0-sdk` 高层客户端 | SDK 重试、凭据封装、开发者体验属于 `L0-sdk` | 提供可消费契约快照和引用入口 |
| L1 业务真相 / 业务状态机 | L1 仓拥有业务语义和状态正文 | 只表达共享契约边界和契约引用 |
| 外部正文托管 | 标准、ADR、业务、运行、观测和凭据正文不属于本仓数据所有权 | 只保存引用关系、fingerprint、摘要或追溯锚点 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档头 | 仍引用旧版 15 节结构和旧概要设计版本 | 与新版 18 章主链和 v0.2.0 上游输入不一致 |
| 旧版 `03-详细设计.md` §1~§3 | 以 shared primitive、ID / Ref / DTO 为主线 | 与新版契约来源、发布基线、只读快照和后台承接主线不一致 |
| 旧版 `03-详细设计.md` 目录树 | 提前给出旧目录结构,且按 primitive 类型拆分 | 会误导 Step 4 的实现单元与文件布局 |
| 当前正式 `03` 缺少 §3 | 未明确 Rust 编码规范、rustdoc、源码语言、commit、git config 和安全边界 | 后续对象、trait、接口和处理流可能风格不一致 |
| 后续对象 / enum 章节风险 | 如果不先声明 enum variant 注释要求,状态和错误枚举容易只列名称 | 实现者无法判断每个取值的业务语义 |
| 后续安全章节风险 | 如果不先声明 gateway / auth 边界,Command / Query 可能混入认证授权逻辑 | 与需求和架构边界冲突 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言约束 | 旧文隐含 Rust,但未绑定编码规范 | 明确承接 `standards/coding/rust.md` 和详细设计 Rust 契约规则 | 保证后续代码契约可 1:1 转写 |
| 注释语言 | 容易误以为中文 rustdoc 可直接复制到实现仓 | 明确设计文档中文注释,真实源码英文注释 | 对齐 design 仓与实现仓语言边界 |
| enum variant | 旧文没有强制逐 variant 注释 | 明确每个 enum variant 必须说明业务语义 | 避免状态和错误枚举不可审查 |
| 函数签名 | 旧文可写自然语言或裸参数 | 必须写完整参数类型、返回类型和错误类型 | 避免实现者猜测 DTO / value object |
| runtime 框架 | 旧文提前给出实现目录和隐含技术路径 | 本步只固定 Rust、port、worker、outbox、gateway 边界,具体框架留 Step 4 / 7 / 11 | 避免未确认工具选型污染详细设计 |
| 安全边界 | 容易混入认证、授权、token 或 gateway 实现 | 明确本仓不实现认证授权,只接收审计上下文和正式引用 | 对齐需求和架构非目标 |
| 提交前置 | 旧文未要求实现者检查目标仓 git config 和提交规范 | 明确后续实施计划必须列出提交规范和项目级 git 配置检查 | 防止跨目录实现时提交身份和语言口径错误 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: Step 3 直接锁定 Axum / Tonic / SQLx / PostgreSQL 等具体库 | 后续实现路径更快 | 当前 L0-core 架构尚未把这些工具确认为架构真相,会越过 Step 4 / Step 11 | 不采用 |
| 方案 B: 只写“遵守 Rust 编码规范” | 简短 | 无法约束 rustdoc、enum variant、源码语言、提交和安全边界 | 不采用 |
| 方案 C: 固定 Rust 契约写法、源码语言边界、port / worker / outbox / gateway 边界,具体库后续收稳 | 与 SOP 粒度一致,能保护后续章节不跑偏 | 需要 Step 4 / 7 / 11 继续补 crate、trait 和持久化细节 | 采用 |
| 方案 D: 设计文档和实现仓都使用中文 Rustdoc | 读中文文档更顺 | 违反 `standards/coding/rust.md` 对真实源码语言的约束 | 不采用 |
| 方案 E: 设计文档用中文 Rustdoc 风格,实现仓转写为英文 rustdoc | 设计审查清楚,源码规范一致 | 实现者需要做一次英文转写 | 采用 |

---

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 真实实现仓标识符、模块名、类型名、函数名、变量名、测试名必须使用英文 | 后续对象、模块和接口命名使用领域英文名,不使用拼音或 Unicode 标识符 |
| `standards/coding/rust.md` | 真实实现仓普通注释、rustdoc 和错误说明注释默认使用英文 | 详细设计中文 Rustdoc 片段是设计说明,实现时必须转写为英文 |
| `standards/coding/rust.md` | crate / module / function / method / local variable 使用 `snake_case`;type / trait / enum variant 使用 `UpperCamelCase` | Step 4~8 的文件、模块、函数、trait、DTO、event、job 命名必须符合 Rust 习惯 |
| `standards/coding/rust.md` | 公开函数、结构体、枚举、枚举变体、trait、type alias 和公开模块成员优先使用文档注释 | Step 6 / Step 7 必须给 struct、字段、enum、variant、trait 和 public function 写 Rustdoc 风格说明 |
| `standards/coding/rust.md` | rustfmt / clippy 不能替代编码规范和设计契约 | 本文必须明确字段、类型、函数、错误、边界和测试切口 |
| `standards/document/详细设计书写规范.md` | 详细设计中的 struct、字段、enum、enum variant、trait、public function 必须有 Rustdoc 风格中文注释 | 后续 Step 5~8 的回填草稿必须保持中文说明完整 |
| `standards/document/详细设计书写规范.md` | 函数参数必须写类型,禁止 `activate(actor, reason)` 这类裸参数 | 函数表、trait 表和处理流伪代码必须写 `Type 参数名` |
| `standards/document/详细设计书写规范.md` | 伪代码调用必须写 `对象.函数(Type 参数名)` 或 `Type::函数(Type 参数名)` 并说明用途 | Step 9 每个接口处理流必须可 1:1 还原调用链 |
| `standards/document/实施计划书写规范.md` | 实施前必须确认阅读清单、编码规范、提交规范和项目级 git 配置 | Step 17 / `07-实施计划.md` 必须承接阅读和提交纪律 |
| `projects/README.md` §8.2 | 当前 design 仓 commit 使用英文 type + 中文 subject / body;其他实现仓 commit message 使用英文;footer 固定为 Codex | 后续实施交接必须区分 design 仓和实现仓提交语言 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 详细设计以 Rust 契约表达 | 对象、trait、DTO、event、job、错误和伪代码按 Rust 可实现形态描述 | 全文 |
| 真实源码默认英文 | 实现仓源码标识符、rustdoc、普通注释和测试名默认英文 | Step 6 对象契约 / Step 7 trait / Step 16 测试切口 |
| 具体 framework 不在 Step 3 决定 | HTTP / RPC 框架、SQL / storage 库、crate 名、目录树留给 Step 4 / Step 7 / Step 11 | Step 4 实现单元与文件布局 |
| 契约真相不由在线服务反向定义 | 结构化契约源码、发布基线、只读快照和演进记录是本仓主线 | domain / release / snapshot / trace |
| Domain 不依赖基础设施 | 领域对象和 policy 不依赖 HTTP、DB、bus、blob、gateway 或下游系统 | domain / policy modules |
| 外部 I/O 必须走 port | repository、audit、outbox、gate、reference、blob、event publisher、clock、id generator 通过 trait / adapter 承接 | support ports / infra adapters |
| 本仓不实现认证授权 | gateway / nginx-like 层负责入口认证、授权和凭据处理 | all command / query handlers |
| 本仓不保存凭据正文 | token、session、credential secret 不进入 L0-core 数据模型 | API DTO / persistence / audit |
| 本仓不吸收外部正文 | 标准、ADR、业务、运行、观测、归档正文只保存引用、fingerprint、摘要或追溯锚点 | ExternalReference / trace / snapshot |
| 本仓不实现 `L0-bus` 运行时 | publish / subscribe / ack / retry / dead-letter 属于 `L0-bus` | outbox relay / EventPublisherPort |
| 本仓不实现 `L0-sdk` 客户端 | SDK 高层封装、重试、凭据注入和开发者体验属于 `L0-sdk` | release snapshot / package export |
| 本仓不拥有 L1 业务真相 | WorkItem、ProcessInstance、ProjectMember、Artifact instance 等不得成为本仓真相 | DefinitionUseBoundaryGuard / API schema / persistence |

### 7.3 实施前置阅读清单

| 阅读项 | 阅读目的 | 是否阻塞实现 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` | 理解 L0-core 的需求定位、非目标、数据归属和安全边界 | 是 |
| `projects/L0-core/01-架构设计.md` | 理解契约来源仓、发布基线、只读快照、后台承接和外部正文引用机制 | 是 |
| `projects/L0-core/02-概要设计.md` | 理解代码主体框架、主要组成部分、关键对象、接口骨架、处理流和状态集合 | 是 |
| `standards/coding/rust.md` | 理解 Rust 命名、格式、源码语言、rustdoc 和 rustfmt / clippy 边界 | 是 |
| `standards/document/详细设计书写规范.md` | 理解详细设计的 Rust 契约片段、函数签名、伪代码调用和图表写法 | 是 |
| `standards/document/实施计划书写规范.md` | 理解实施前置阅读、git config、commit message 和 design / 实现仓语言边界 | 是 |
| `projects/README.md` §8.2 | 理解当前 design 仓和其他实现仓提交语言规则 | 是 |
| 目标实现仓 `git config user.name/user.email` | 避免在其他目录实现时使用错误提交身份 | 是 |

### 7.4 本步不画图说明

本步不画图。原因是 `详细设计书写规范.md` §5.3 明确规定“实现约束与编码规范承接”章节禁止画图。本步使用表格收稳编码、runtime、仓库和安全边界约束。

---

## 8. 回填草稿

可直接回填到正式 `03-详细设计.md` §3 的草稿结构:

```md
## 3. 实现约束与编码规范承接

> 校准来源:
> - `design-calibration/03_ddd_step_03_coding_runtime_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_03_coding_runtime_constraints.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本章如何收稳 Rust 编码、runtime、仓库、提交和安全边界约束。

### 3.1 编码规范承接

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 真实实现仓标识符、模块名、类型名、函数名、变量名、测试名必须使用英文 | 后续对象、模块和接口命名使用领域英文名,不使用拼音或 Unicode 标识符 |
| `standards/coding/rust.md` | 真实实现仓普通注释、rustdoc 和错误说明注释默认使用英文 | 详细设计中文 Rustdoc 片段是设计说明,实现时必须转写为英文 |
| `standards/coding/rust.md` | crate / module / function / method / local variable 使用 `snake_case`;type / trait / enum variant 使用 `UpperCamelCase` | Step 4~8 的文件、模块、函数、trait、DTO、event、job 命名必须符合 Rust 习惯 |
| `standards/document/详细设计书写规范.md` | 详细设计中的 struct、字段、enum、enum variant、trait、public function 必须有 Rustdoc 风格中文注释 | 后续模块和对象契约必须写清对象作用、字段含义、variant 语义和函数边界 |
| `standards/document/详细设计书写规范.md` | 函数参数必须写类型,伪代码调用必须写 `对象.函数(Type 参数名)` 或 `Type::函数(Type 参数名)` | 逐接口处理流必须可 1:1 还原调用链 |
| `projects/README.md` §8.2 | 当前 design 仓 commit 使用英文 type + 中文 subject / body;其他实现仓 commit message 使用英文;footer 固定为 Codex | 后续实施计划必须区分 design 仓和实现仓提交语言 |

### 3.2 实现约束

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 详细设计以 Rust 契约表达 | 对象、trait、DTO、event、job、错误和伪代码按 Rust 可实现形态描述 | 全文 |
| 具体 framework 不在本章决定 | HTTP / RPC 框架、SQL / storage 库、crate 名、目录树留给实现单元、port 和持久化章节收稳 | §4 / §7 / §10 |
| 契约真相不由在线服务反向定义 | 结构化契约源码、发布基线、只读快照和演进记录是本仓主线 | domain / release / snapshot / trace |
| Domain 不依赖基础设施 | 领域对象和 policy 不依赖 HTTP、DB、bus、blob、gateway 或下游系统 | domain / policy modules |
| 外部 I/O 必须走 port | repository、audit、outbox、gate、reference、blob、event publisher、clock、id generator 通过 trait / adapter 承接 | support ports / infra adapters |
| 本仓不实现认证授权 | gateway / nginx-like 层负责入口认证、授权和凭据处理 | all command / query handlers |
| 本仓不保存凭据或外部正文 | token、session、标准正文、ADR 正文、业务正文、运行正文和观测正文不进入 L0-core 真相 | API DTO / persistence / audit / trace |
| 本仓不实现 `L0-bus` 或 `L0-sdk` | bus 投递和 SDK 高层客户端分别属于相邻仓 | outbox relay / snapshot export |
| 本仓不拥有 L1 业务真相 | WorkItem、ProcessInstance、ProjectMember、Artifact instance 等不得成为本仓真相 | DefinitionUseBoundaryGuard / API schema / persistence |

### 3.3 实施前置阅读

实现者进入目标代码仓前必须阅读:

| 阅读项 | 目的 |
|---|---|
| `projects/L0-core/00-需求文档.md` | 理解需求定位、非目标、数据归属和安全边界 |
| `projects/L0-core/01-架构设计.md` | 理解契约来源仓、发布基线、只读快照、后台承接和外部正文引用机制 |
| `projects/L0-core/02-概要设计.md` | 理解代码主体框架、主要组成部分、关键对象、接口骨架、处理流和状态集合 |
| `standards/coding/rust.md` | 理解 Rust 命名、格式、源码语言、rustdoc 和工具边界 |
| `standards/document/实施计划书写规范.md` | 理解 git config、commit message 和 design / 实现仓语言边界 |
| `projects/README.md` §8.2 | 理解当前 design 仓和其他实现仓提交语言规则 |

若实现发生在其他目录,实施者必须在目标仓重新确认 `git config user.name` 与 `git config user.email`,并使用项目级配置而不是 `--global`。
```

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否在 Step 3 锁定具体 HTTP / RPC / SQL / storage 框架 | A. 现在锁定; B. Step 4 / Step 7 / Step 11 再锁定; C. 完全不写 | B | 当前上游只收稳架构机制和 port 边界,过早锁定库会把未确认工具写成契约真相 | 已自动确认采用 B |
| 设计文档 Rustdoc 与实现仓 Rustdoc 使用什么语言 | A. 全中文; B. 全英文; C. 设计文档中文、实现源码英文 | C | 设计仓便于中文审查,实现仓遵守 Rust 编码规范和跨仓源码可维护性 | 已自动确认采用 C |
| 是否把 gateway 认证授权写进 L0-core | A. 写入; B. 不写入,只接收可信 metadata; C. 留空 | B | 需求和架构已明确认证授权属于安全入口、治理或授权能力,不属于 L0-core | 已自动确认采用 B |

---

## 10. 进入下一步条件

- 已明确 L0-core 详细设计以 Rust 实现契约表达。
- 已明确设计文档中文 Rustdoc 与真实源码英文 rustdoc 的边界。
- 已明确 struct、字段、enum、enum variant、trait、public function 的注释和签名约束。
- 已明确具体 framework、crate、目录树和持久化细节不在 Step 3 直接锁死。
- 已明确认证授权、`L0-bus` 运行时、`L0-sdk` 客户端、L1 业务真相和外部正文不进入本仓实现范围。
- 已把提交规范、git config 和编码规范阅读要求放入实施前置约束。
- 可以进入 Step 4 “收稳实现单元与文件布局”。
