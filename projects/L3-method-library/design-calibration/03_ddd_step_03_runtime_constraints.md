# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节：`03-详细设计.md` §3 实现约束与编码规范承接

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 2 本轮范围 | P0 方法定义发布同步闭环完整展开,P1 只保留边界 |
| `standards/coding/rust.md` | Rust 命名、格式、注释、rustdoc、rustfmt / clippy 关系 |
| `standards/document/详细设计书写规范.md` | Rust 契约片段、ASCII 图、函数签名、伪代码调用标注规则 |
| `projects/README.md` §8.2 | 提交规范: type 英文,主题正文中文,Co-Authored-By 固定 |
| `git config user.name / user.email` | 当前仓配置为 `quantalithos-labs` / `quantalithos.ai@gmail.com` |
| `00-需求文档.md` §7.5 | 本仓不负责统一身份认证,但接口必须携带可审计 actor_ref 和 gate_ref |
| `01-架构设计.md` §6 / §11 | API / outbox-relay / PostgreSQL / L0-bus / gateway 安全边界 |
| `02-概要设计.md` §4 / §11 | Domain 不依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统 |

已确认结论：

```text
本轮详细设计必须以 Rust 实现契约表达,并强制使用 Rustdoc 风格中文注释、完整参数类型、模块级契约和函数级伪代码调用标注。
本仓不做统一身份认证;安全入口由 gateway / nginx-like 层负责,本仓只接收并审计 actor_ref、gate_ref 和 request metadata。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 / P1 范围。
```

---

## 3. SOP 问题回答

1. 本仓使用什么语言、runtime、框架和主要依赖？

   回答：详细设计按 Rust 编写实现契约。架构层已经确认 P0 运行主体包括 `method-library-api`、`outbox-relay`、snapshot / query 相关服务和 operations job;存储依赖 PostgreSQL,事件依赖 L0-bus,可选依赖 object storage / cache / governance gate。具体 HTTP / RPC 框架、crate 名和文件布局在 Step 4 再收稳,本步不提前指定 Axum、Tonic、SQLx 等实现库。

2. Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

   回答：命名必须遵守 Rust 习惯:crate / module / function / method / local variable 使用 `snake_case`,type / trait / enum variant 使用 `UpperCamelCase`;标识符使用英文,不使用拼音和 Unicode 标识符。公开 struct / enum / trait / function 必须使用 Rustdoc 中文注释。详细设计中的对象、字段、函数、trait 和错误类型必须给出可翻译成 Rust 的契约片段、完整参数类型、返回类型和错误类型。格式必须能被 rustfmt 处理,但不能把 rustfmt / clippy 当成替代设计契约的工具。

3. 是否必须遵守 rustdoc 中文注释？

   回答：必须。公开类型、字段、enum、trait、DTO、port 和公开函数都必须使用 `///` 或 `//!` 风格中文注释。注释必须说明对象作用、不变量、字段业务含义、函数做什么、改变什么、不改变什么、错误语义和关键边界。

4. 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

   回答：实施者开始前必须阅读 `projects/README.md` §8.2 的提交规范,并确认目标代码仓的 `git config user.name` / `user.email` 是否符合项目要求。本设计仓当前配置为 `quantalithos-labs` / `quantalithos.ai@gmail.com`;若实现发生在别的目录,实施者必须在目标目录单独确认。提交信息格式为 `type` 英文、主题正文中文,注脚按项目约定统一处理。

5. 哪些安全、鉴权、网关或外部边界不应在本仓实现？

   回答：本仓不实现统一身份认证、登录态校验、网关鉴权、policy enforce 执行、governance 裁决、下游 Use truth、运行实例真相或 marketplace 交易安装逻辑。本仓接口只接收外层可信入口传入的 `ActorContext`、`CommandMetadata`、`ApprovedGateRef` 等审计上下文,并在发布、查询、job、event consumer 中记录可追溯证据。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §3 | 尚未明确 Rust 编码规范来源和详细设计内的 Rust 契约写法 | 后续对象和 trait 可能只写自然语言,无法 1:1 实现 |
| `03-详细设计.md` 全文 | 旧内容容易把对象、函数、trait 分散成全局清单 | 与新版“按模块展开实现契约”的规则冲突 |
| `03-详细设计.md` 处理流章节 | 若不先约束伪代码格式,后续流程可能只有步骤说明 | 实现者无法确认调用对象、参数类型、事务位置和副作用 |
| `03-详细设计.md` 安全边界 | 若不先声明本仓不做统一认证,接口设计可能混入登录 / 鉴权逻辑 | 与需求和架构的 gateway 安全边界冲突 |
| `03-详细设计.md` 实施前置 | 未提醒实施者检查提交规范和目标仓 git config | 后续代码仓提交可能不符合项目约定 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 编码规范 | 只知道项目使用 Rust,但未绑定具体规范 | 明确承接 `standards/coding/rust.md` 与详细设计 Rustdoc / 签名规则 | 保证实现契约可落地 |
| 注释要求 | 可能只写普通说明 | 公开类型、字段、trait、函数必须使用 Rustdoc 风格中文注释 | 支撑代码文档和一致表达 |
| 函数签名 | 可能写 `activate(actor)` 这类裸参数 | 必须写 `activate(ActorContext actor)` 或 Rust 风格完整签名 | 避免实现歧义 |
| 伪代码 | 可能只写自然语言步骤 | 必须写 `对象.函数(Type 参数名)` / `Type::函数(Type 参数名)` 并说明用途 | 让函数级处理流可还原 |
| runtime 依赖 | 可能提前指定未确认框架 | 只确认 Rust、PostgreSQL、L0-bus、gateway 边界,框架与 crate 在 Step 4 收稳 | 避免越过当前 Step |
| 安全边界 | 可能把认证鉴权写入本仓 | 明确认证鉴权在外层 gateway,本仓只承接 actor / gate / metadata 审计上下文 | 符合需求和架构边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Step 3 同时决定 Axum / Tonic / SQLx 等具体库 | 后续文件布局更快 | 当前仓尚未进入实现目录设计,容易把未确认技术选型写死 | 不采用 |
| 只引用 Rust 编码规范,不写本文约束 | 简洁 | 后续 agent 仍可能不知道如何写对象、函数和伪代码 | 不采用 |
| 固定 Rust + 文档契约写法 + 安全边界,具体框架留 Step 4 | 与 SOP 粒度一致,能约束后续章节 | 需要 Step 4 继续补 crate / module / framework 选择 | 采用 |

---

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 标识符命名遵守 Rust 习惯:crate / module / function / method / variable 用 `snake_case`;type / trait / enum variant 用 `UpperCamelCase` | Step 5~8 中所有 Rust 类型、函数、trait、DTO、event、job 命名必须符合该规则 |
| `standards/coding/rust.md` | 标识符使用英文,不使用拼音、无意义缩写或 Unicode 标识符 | 字段、函数、模块名使用领域英文名,中文只进入注释和正文说明 |
| `standards/coding/rust.md` | 公开函数、结构体、枚举、trait、type alias 和公开模块成员优先使用 Rustdoc 文档注释 | Step 5 / Step 7 中所有公开类型和函数都必须给出 `///` 中文注释 |
| `standards/coding/rust.md` | `rustfmt` 和 `clippy` 是检查工具,不能替代编码规范和设计契约 | 详细设计必须写出字段、类型、函数、错误和边界,不能只写“交给 clippy 检查” |
| `standards/coding/rust.md` | 函数参数超过五个时应换行,导入模块按 std / external / crate 分组 | 详细设计中的 Rust 片段需要按可读格式展示,长签名必须换行 |
| `standards/document/详细设计书写规范.md` | 参数必须写类型,禁止裸参数 | 函数表和协议表必须写 `CommandName command`、`ActorContext actor`、`CommandMetadata metadata` 等 |
| `standards/document/详细设计书写规范.md` | 伪代码调用必须写 `对象.函数(Type 参数名)` 或 `Type::函数(Type 参数名)` | Step 8 每个处理流必须标注调用对象、函数、参数类型和用途 |
| `standards/document/详细设计书写规范.md` | ASCII 图必须使用 `text` 代码块,节点名与正文一致,箭头旁标注交互类型 | Step 4~15 的所有图必须统一风格 |
| `projects/README.md` §8.2 | Commit 信息格式为 type 英文、主题正文中文,Co-Authored-By 固定 | 实施计划需提醒实现者提交前阅读提交规范 |
| 当前 git config | 本设计仓当前 `user.name=quantalithos-labs`,`user.email=quantalithos.ai@gmail.com` | 若实现目录不同,实现者必须在目标仓重新确认 git config |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 语言以 Rust 契约表达 | 本轮 03 中所有对象、trait、DTO、schema 和伪代码以 Rust 可实现形态描述 | 全文 |
| 具体 framework 不在 Step 3 决定 | HTTP / RPC 框架、SQL 库、crate 名、目录树留到 Step 4 / 后续实现约束中收稳 | Step 4 实现单元与文件布局 |
| PostgreSQL 是 definition truth 主存储 | 架构已确认 definition truth、version、fingerprint、audit、outbox 保存在 PostgreSQL | persistence / repository / unit_of_work / outbox |
| L0-bus 是定义事件传播目标 | outbox-relay 通过事件总线传播已提交定义事实 | outbox relay / event publisher / replay job |
| Domain 不依赖外部基础设施 | Domain model / policies 不依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统 | domain / policy modules |
| 本仓不实现统一认证 | 安全入口由外层 gateway / nginx-like 层负责 | all API handlers |
| 本仓必须保存审计上下文 | Command / Query / Job / Event Consumer 必须传递并记录 `ActorContext`、`CommandMetadata`、`ApprovedGateRef` 等 | command / query / job / audit |
| policy enforce 不在本仓 | 本仓只保存 `AIPolicyDef` definition,不保存 governance enforce result | AIPolicyDef / governance port |
| 下游 Use truth 不进入本仓 | QualificationProfile、QualificationBinding、ProcessInstance、WorkItem、Artifact instance 等不得成为本仓对象或表 | boundary guard / API schema / persistence |
| outbox 发布失败不回滚定义真相 | 发布事实提交后,事件传播失败进入 outbox retry / replay | publish flow / outbox relay / operations job |

### 7.3 实施前置阅读清单

| 阅读项 | 目的 | 是否阻塞实现 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 理解 P0 / P1、目标、非目标和跨仓边界 | 是 |
| `projects/L3-method-library/01-架构设计.md` | 理解 Definition / Use、通信方式、数据所有权和安全边界 | 是 |
| `projects/L3-method-library/02-概要设计.md` | 理解代码主体框架、主要组成部分、关键对象和处理流 | 是 |
| `standards/coding/rust.md` | 理解 Rust 命名、格式、注释和 rustdoc 要求 | 是 |
| `standards/document/详细设计书写规范.md` | 理解模块实现契约、函数签名、伪代码和图表写法 | 是 |
| `projects/README.md` §8.2 | 理解提交信息和协作约定 | 是 |
| 目标实现仓 `git config user.name/user.email` | 避免在别的目录中使用错误提交身份 | 是 |

### 7.4 本步不画图说明

本步禁止画图。原因是 `详细设计书写规范.md` §5.3 明确规定“实现约束与编码规范承接”章节禁止画图。本步产物使用表格收稳约束。

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草文字：

```md
## 3. 实现约束与编码规范承接

### 3.1 编码规范承接

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 标识符命名遵守 Rust 习惯:crate / module / function / method / variable 用 `snake_case`;type / trait / enum variant 用 `UpperCamelCase` | Step 5~8 中所有 Rust 类型、函数、trait、DTO、event、job 命名必须符合该规则 |
| `standards/coding/rust.md` | 标识符使用英文,不使用拼音、无意义缩写或 Unicode 标识符 | 字段、函数、模块名使用领域英文名,中文只进入注释和正文说明 |
| `standards/coding/rust.md` | 公开函数、结构体、枚举、trait、type alias 和公开模块成员优先使用 Rustdoc 文档注释 | Step 5 / Step 7 中所有公开类型和函数都必须给出 `///` 中文注释 |
| `standards/document/详细设计书写规范.md` | 参数必须写类型,禁止裸参数 | 函数表和协议表必须写 `CommandName command`、`ActorContext actor`、`CommandMetadata metadata` 等 |
| `standards/document/详细设计书写规范.md` | 伪代码调用必须写 `对象.函数(Type 参数名)` 或 `Type::函数(Type 参数名)` | Step 8 每个处理流必须标注调用对象、函数、参数类型和用途 |
| `projects/README.md` §8.2 | Commit 信息格式为 type 英文、主题正文中文,Co-Authored-By 固定 | 实施计划需提醒实现者提交前阅读提交规范 |

### 3.2 实现约束

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 语言以 Rust 契约表达 | 本轮 03 中所有对象、trait、DTO、schema 和伪代码以 Rust 可实现形态描述 | 全文 |
| 具体 framework 不在本章决定 | HTTP / RPC 框架、SQL 库、crate 名、目录树留到实现单元与文件布局中收稳 | §4 实现单元与文件布局 |
| PostgreSQL 是 definition truth 主存储 | definition truth、version、fingerprint、audit、outbox 保存在 PostgreSQL | persistence / repository / unit_of_work / outbox |
| L0-bus 是定义事件传播目标 | outbox-relay 通过事件总线传播已提交定义事实 | outbox relay / event publisher / replay job |
| Domain 不依赖外部基础设施 | Domain model / policies 不依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统 | domain / policy modules |
| 本仓不实现统一认证 | 安全入口由外层 gateway / nginx-like 层负责 | all API handlers |
| 本仓必须保存审计上下文 | Command / Query / Job / Event Consumer 必须传递并记录 `ActorContext`、`CommandMetadata`、`ApprovedGateRef` 等 | command / query / job / audit |
| 下游 Use truth 不进入本仓 | QualificationProfile、QualificationBinding、ProcessInstance、WorkItem、Artifact instance 等不得成为本仓对象或表 | boundary guard / API schema / persistence |

### 3.3 实施前置阅读

实现者在进入代码仓前必须阅读:

| 阅读项 | 目的 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` | 理解 P0 / P1、目标、非目标和跨仓边界 |
| `projects/L3-method-library/01-架构设计.md` | 理解 Definition / Use、通信方式、数据所有权和安全边界 |
| `projects/L3-method-library/02-概要设计.md` | 理解代码主体框架、主要组成部分、关键对象和处理流 |
| `standards/coding/rust.md` | 理解 Rust 命名、格式、注释和 rustdoc 要求 |
| `projects/README.md` §8.2 | 理解提交信息和协作约定 |

若实现发生在其他目录,实施者必须在目标仓重新确认 `git config user.name` 与 `git config user.email`。
```

---

## 9. 待确认事项

无。

---

## 10. 进入下一步条件

- Rust 编码规范来源已经固定。
- Rustdoc 中文注释、完整参数类型、伪代码调用标注规则已经确认。
- runtime / 外部依赖 / 安全边界没有与需求和架构冲突。
- 提交规范和目标仓 git config 检查已经进入实施前置阅读。
- 用户已确认 Step 3,可以进入 Step 4 收稳实现单元与文件布局。
