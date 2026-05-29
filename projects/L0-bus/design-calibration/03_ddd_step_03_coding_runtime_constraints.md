# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-bus/03-详细设计.md` §3 实现约束与编码规范承接 / §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 本轮 P0 实现范围、非范围、P1 后移能力和实现者可完成代码范围 | 限定本步只讨论会影响代码形态的约束 |
| `standards/coding/rust.md` | Rust 命名、格式、源码语言、rustdoc、rustfmt / clippy 边界 | 作为真实实现仓编码规范来源 |
| `standards/document/详细设计书写规范.md` | Rust 契约片段、Rustdoc 中文注释、函数参数类型、伪代码调用、目录与依赖约束 | 作为正式 `03` 输出格式约束 |
| `standards/document/实施计划书写规范.md` | 实施前置阅读、git config、commit message、提交时机和代码批次规则 | 作为 Step 17 和 `07-实施计划.md` 的承接输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L0-bus 的编译期、运行期、事件协作依赖裁剪口径 | 判断哪些依赖可以进入 Cargo path dependency |
| `standards/document/子项目目录与代码文件组织规范.md` | `/home/aris/Projects` 实现仓位置、workspace / package / crate / binary 命名规则 | 作为 Step 4 文件布局输入 |
| `projects/L0-bus/01-架构设计.md` §8 / §11 / §13 | L0-core 编译期依赖、MQ / store 运行期依赖、发布方 / 订阅方事件协作依赖、ports and adapters、in-memory default path、安全边界 | 作为 runtime、依赖和安全边界输入 |
| `/home/aris/Projects/quantalithos-core` | 已存在的 L0-core 实现仓，当前为 workspace 多 crate 结构 | 作为本地 path dependency 的实际 sibling repo 输入 |

已确认结论：

```text
L0-bus 详细设计使用 Rust 可实现契约表达。
正式详细设计中的 Rust 契约片段使用中文 Rustdoc 风格注释。
真实实现仓源码必须遵守 standards/coding/rust.md: 标识符、普通注释、rustdoc、测试名默认使用英文。
L0-bus 唯一已确认编译期依赖是 L0-core; 当前通过 /home/aris/Projects/quantalithos-core 的本地 path dependency 引用。
MQ backend、store、发布方、订阅方、observability、governance、SDK 都不是本仓 Cargo path dependency。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮实现范围和非范围。
```

---

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖？

回答：

本仓使用 Rust。实现形态按 ports and adapters 组织，领域层保持纯 Rust，对外 I/O 通过 port / adapter 承接。

| 项 | 当前结论 | 说明 |
|---|---|---|
| 语言 | Rust | 对象、trait、DTO、event、job、error、处理流都按 Rust 可实现契约表达 |
| Edition / toolchain | 对齐已实现的 `quantalithos-core`，当前参考 Rust 2024 edition / rust-version 1.93 | 若目标实现仓 toolchain 变更，必须在实施计划记录 |
| Runtime | 外部 I/O 和后台 job 允许 async；领域对象和 policy 优先同步、纯粹、可测试 | `tokio` 等具体 runtime 库不在 Step 3 写死，Step 4 / Step 14 根据实现单元和 adapter 决定 |
| 框架 | P0 不固定 HTTP / RPC / MQ / DB 框架 | API、worker、job、store、publisher 的具体框架由后续 Step 4 / 7 / 8 / 11 / 14 裁剪 |
| 编译期依赖 | `L0-core` | 消费 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents / outbox 相关共享契约 |
| 运行期依赖 | MQ backend、bus store / persistence、clock / id generator source、secret reference resolver | 通过 adapter、repository、port、config 绑定，不进入 Cargo path dependency |
| 事件协作依赖 | 发布方仓、订阅方仓、下游观测 / 治理 / SDK 消费方 | 通过 event / projection / read-only output 协作，不直接依赖业务仓源码 |

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

回答：

| 影响面 | 必须遵守的约束 | 对详细设计的影响 |
|---|---|---|
| 命名 | crate / module / function / method / variable 使用 `snake_case`；type / trait / enum variant 使用 `UpperCamelCase` | Step 4~8 的模块、对象、trait、DTO、event、job 命名必须符合 Rust 习惯 |
| 源码语言 | 真实实现仓标识符、普通注释、rustdoc、测试名默认使用英文 | 设计文档中文注释不能无脑复制进源码，实施时应转写为英文 |
| struct | 公开 struct 必须说明对象作用、不变量；字段必须说明类型、业务含义和约束 | Step 6 对象契约必须逐字段给出类型、作用、约束和 Rustdoc 风格说明 |
| enum | enum 本身说明分类边界；每个 enum variant 必须单独注释；带载荷 variant 必须说明载荷语义 | Step 6 / Step 10 的状态 enum、错误 enum、事件 enum 不得省略 variant 注释 |
| error | 普通业务失败、非法状态迁移、幂等冲突、配置错误、端口失败必须通过错误类型表达 | Step 12 必须定义错误模型、错误映射、恢复口径和禁止 panic 边界 |
| trait / port | port 表达依赖方向和所有权边界，domain 不依赖 HTTP、DB、MQ、SDK 或外部服务 | Step 7 必须逐 port 定义 trait、参数类型、返回类型、错误类型和实现方 |
| async | 外部 I/O 可以 async；领域对象函数优先同步；事务和端口调用必须显式标注 await 边界 | Step 9 处理流必须区分 domain method 与 repository / adapter / publisher 调用 |
| test | 测试名默认英文，测试围绕状态机、幂等、事务、错误、边界和 contract 展开 | Step 16 只定义最小测试切口，完整矩阵留给 `05-测试方案.md` |
| tool | rustfmt / clippy 是检查工具，不能替代设计契约 | 详细设计必须明确字段、函数、错误、状态、事务和边界，不写“交给工具处理” |

### 3.3 是否必须遵守 rustdoc 风格注释？struct、字段、enum、enum variant、函数分别如何注释？

回答：

必须遵守，但要区分设计文档和真实源码。

| 场景 | 注释语言 | 规则 |
|---|---|---|
| `quantalithos-design` 正式详细设计 | 中文 | Rust 契约片段使用 `///` / `//!` 风格中文注释，用于审查对象、字段、函数和状态语义 |
| `/home/aris/Projects/quantalithos-bus` 真实源码 | 英文 | 遵守 `standards/coding/rust.md`，源码注释、rustdoc、测试名默认英文 |

注释粒度：

| 项 | 必须说明 | 禁止写法 |
|---|---|---|
| struct | 代表什么、维护什么不变量、不保存什么 | 只写“Bus record” |
| 字段 | 字段类型、业务含义、约束、来源、是否系统生成 | 只列字段名和类型 |
| enum | 表达的状态 / 分类 / 错误集合边界 | 把状态迁移只藏在注释里 |
| enum variant | 该取值的业务语义、使用场景；带载荷时说明载荷语义 | 省略 variant 注释 |
| trait | 端口代表的外部依赖、调用方向、实现方、禁止事项 | 把 MQ / DB 私有细节写入 domain trait |
| public function | 函数做什么、改变什么、不改变什么、参数类型、返回类型、错误语义 | `record_feedback(actor, result)` 这类裸参数 |

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

回答：

| 项 | 要求 | 说明 |
|---|---|---|
| 提交规范来源 | `standards/document/实施计划书写规范.md` §4.8 / §4.9 | `07-实施计划.md` 必须继续展开提交时机、提交粒度和 message 模板 |
| 当前设计仓 commit | `quantalithos-design` 可以使用中文 subject / body，并保留 `Co-Authored-By: Codex <noreply@openai.com>` | 仅适用于当前设计仓 |
| 目标实现仓 commit | 除设计仓外，其他实现仓 commit message 必须使用英文 | `quantalithos-bus` 属于实现仓，应使用英文 commit |
| 目标实现仓 git config | 实施者必须在 `/home/aris/Projects/quantalithos-bus` 内检查 `git config user.name` 和 `git config user.email` | 不使用全局配置替代项目级检查 |
| 提交前置 | 编译、测试、格式化、clippy、报告产物和设计偏离回写必须按实施计划门禁执行 | 本 Step 只登记为约束，具体门禁由 `07-实施计划.md` 定义 |

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现？

回答：

| 不应实现的边界 | 原因 | L0-bus 只做什么 |
|---|---|---|
| 登录认证 / token 校验 | 属于 gateway / identity / 安全入口 | 接收可信入口传入的 actor、metadata、trace 和 authorization reference |
| 网关 / nginx-like 入口层 | 属于部署入口和安全边界 | 不处理 session、token、TLS、路由安全或凭据解析 |
| 通用授权策略引擎 | 属于 governance / security / gateway | 对 replay、DLQ read、tap output、operator command 要求带正式授权引用或 actor context |
| 业务 payload 正文存储 | payload truth 属于发布方或 artifact /业务仓 | 只保存 payload reference、fingerprint、size / type metadata 和禁止正文校验结果 |
| raw secret / credential value | 破坏安全边界和审计材料 | 只保存 secret reference 或 backend capability reference |
| L1 / L2 / L3 业务仓模型 | 会形成循环依赖和真相污染 | 只通过 event、reference、projection 或 SDK 边界协作 |
| `L0-sdk` client ergonomics | SDK 封装、重试、开发者体验属于 SDK 仓 | 提供 query / event / read-only output 契约 |
| observability 长期存储和 dashboard | 横切观测平台不是 bus truth | 输出 audit、metric、log、trace marker 和 tap material |

### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库？

回答：

是。`L0-bus` 依赖已经存在的 `/home/aris/Projects/quantalithos-core`。

当前检查结果：

| 路径 | 当前状态 | 说明 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | 已存在 | 当前为 workspace 多 crate 结构 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | 已存在 | package `core-contracts`，lib crate `core_contracts` |
| `/home/aris/Projects/quantalithos-bus` | 当前未在目录清单中发现 | 实施阶段应创建或进入该目标实现仓 |

### 3.7 这些依赖中哪些是已确认的编译期依赖？

回答：

| 依赖 | 类型 | 是否允许 Cargo path dependency | 说明 |
|---|---|---|---|
| `L0-core` / `quantalithos-core` | 编译期依赖 | 是 | 消费共享契约、错误、trace、metadata、actor/ref、CloudEvents / outbox 边界 |
| MQ backend | 运行期依赖 | 否 | 通过 `TransportBackendPort` 和 adapter config 绑定 |
| Bus store / persistence | 运行期依赖 | 否 | 通过 repository / UnitOfWork / store adapter 绑定 |
| 发布方仓 | 事件协作依赖 | 否 | 通过 accepted publication 或 committed outbox fact 引用协作 |
| 订阅方仓 | 事件协作依赖 | 否 | 通过 delivery、feedback、callback / signal 边界协作 |
| observability / governance / SDK | 运行期或事件协作依赖 | 否 | 消费 read-only output、audit material、event，不依赖源码 |

### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在？

回答：

存在 `quantalithos-core`，未发现 `quantalithos-bus` 目标实现仓。

| 仓库 | 默认路径 | 当前检查结论 | 本轮处理 |
|---|---|---|---|
| `quantalithos-core` | `/home/aris/Projects/quantalithos-core` | 已存在 | Step 4 / Step 14 使用其真实 crate 布局写 path dependency |
| `quantalithos-bus` | `/home/aris/Projects/quantalithos-bus` | 当前未发现 | `07-实施计划.md` 应要求实施者创建或确认目标仓 |

### 3.9 对已确认的编译期依赖，当前是否采用本地 path dependency？中期是否记录 private git tag / rev 方案？

回答：

是。当前阶段采用本地 sibling repo path dependency；中期可切换 private git tag / rev，但不作为 P0 默认前置。

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | 本地 path dependency | private git tag / rev | contracts、domain、application、api、worker、jobs、infra |

当前可预期 Cargo 引用：

```toml
[dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

约束：

- 上述路径来自已检查的 `quantalithos-core` 当前 workspace 布局。
- 是否还需要 `core-domain`、`core-application` 等 crate，必须由 Step 4 / Step 7 / Step 14 根据真实使用点确认，不在本步扩大依赖。
- 不默认发布到公共 crates.io，不默认引用 GitHub。

### 3.10 哪些关系只是运行期依赖或事件协作依赖，不能写成 Cargo path dependency？

回答：

| 关系 | 类型 | 正确表达 | 错误表达 |
|---|---|---|---|
| `L0-bus` -> MQ backend | 运行期依赖 | `TransportBackendPort` + adapter config + fake / in-memory adapter | `nats` / `kafka` 直接进入 domain 或 application |
| `L0-bus` -> bus store | 运行期依赖 | repository trait + UnitOfWork + store adapter | domain 直接依赖数据库 SDK |
| 发布方 -> `L0-bus` | 事件协作依赖 | committed outbox fact、publish command、reference | bus 直接依赖发布方源码 |
| `L0-bus` -> 订阅方 | 事件协作依赖 | delivery target ref、feedback result、backend signal | bus 直接依赖订阅方业务模型 |
| observability / governance / SDK 消费 bus | 运行期或事件协作依赖 | query、projection、audit material、outbound event | bus 直接依赖下游仓 DTO 或 UI model |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 未按新版 Step 3 明确 Rust 编码、注释、依赖、runtime 和安全边界 | 后续对象、trait、API、状态机和处理流可能口径不一致 |
| 旧版 `03-详细设计.md` | 旧口径容易把 envelope / routing / callback schema 当成本仓契约真相 | 会重新定义 `L0-core` 已拥有的共享契约 |
| 旧版 `03-详细设计.md` | 未区分设计文档中文 Rustdoc 与实现仓英文源码注释 | 实施者可能把中文注释直接复制进代码仓 |
| 旧版 `03-详细设计.md` | 未明确只有 `L0-core` 是编译期依赖 | 容易把 MQ、store、发布方、订阅方或 SDK 错写成 Cargo path dependency |
| 当前详细设计流程 | 尚未记录 `/home/aris/Projects/quantalithos-core` 的真实 crate 路径 | Step 4 / Step 14 可能凭空填写 dependency path |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 编码规范来源 | 旧文没有稳定承接 | 明确承接 `standards/coding/rust.md` 和详细设计书写规范 | 保证后续实现契约一致 |
| 注释语言 | 设计文档与实现源码边界不清 | 设计文档中文 Rustdoc，真实源码英文 Rustdoc | 对齐 design 仓和实现仓语言边界 |
| 编译期依赖 | 旧文可能隐含多个旧对象依赖 | 仅 `L0-core` 可作为编译期依赖 | 防止跨仓循环和真相污染 |
| 本地依赖方式 | 未说明 sibling repo 路径 | 当前采用 `/home/aris/Projects/quantalithos-core` 本地 path dependency | 符合当前不发公共 crates 的共识 |
| runtime 框架 | 容易提前写死 MQ / HTTP / DB 框架 | Step 3 只固定 Rust + ports and adapters + in-memory default path 边界 | 具体实现单元留给 Step 4 / 14 |
| 安全边界 | 认证授权可能混入 bus handler | 本仓不实现认证、token、gateway、通用授权策略 | 对齐架构横切关注点 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：Step 3 直接锁定 HTTP / MQ / DB 框架 | 后续实现更快 | 当前生产后端和入口框架未收稳，容易把架构待确认项写死 | 不采用 |
| 方案 B：只写“使用 Rust，遵守规范” | 简短 | 无法约束注释语言、enum variant、依赖类型、path dependency 和安全边界 | 不采用 |
| 方案 C：固定 Rust、ports and adapters、本地 core path dependency、源码语言、安全边界；具体 crate / framework 后续 Step 再定 | 能保护后续实现不跑偏，又不提前锁死技术细节 | 需要 Step 4 / 7 / 11 / 14 继续补足 | 采用 |
| 方案 D：设计文档和源码都使用中文注释 | 中文审查直观 | 违反真实实现仓源码语言约束 | 不采用 |
| 方案 E：设计文档中文 Rustdoc，源码实施时转写英文 Rustdoc | 设计审查清楚，源码规范一致 | 实施者需要翻译注释 | 采用 |

---

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 真实实现仓标识符、模块名、类型名、函数名、变量名、测试名必须使用英文 | 后续对象、模块和接口命名使用领域英文名 |
| `standards/coding/rust.md` | 真实实现仓普通注释、rustdoc 和错误说明注释默认使用英文 | 正式 `03` 的中文 Rustdoc 是设计说明，实施时转写为英文 |
| `standards/coding/rust.md` | 公开函数、结构体、枚举、枚举变体、trait、type alias 和公开模块成员优先使用文档注释 | Step 6 / 7 / 8 / 10 / 12 不得省略 Rustdoc 风格说明 |
| `standards/document/详细设计书写规范.md` | 详细设计中 struct、字段、enum、enum variant、trait、public function 必须有 Rustdoc 风格中文注释 | 正式 `03` 必须能让审查者理解每个对象和取值语义 |
| `standards/document/详细设计书写规范.md` | 函数参数必须写类型，伪代码调用必须写 `对象.函数(Type 参数名)` 或 `Type::函数(Type 参数名)` | Step 8 / 9 的协议和处理流不能出现裸参数 |
| `standards/document/实施计划书写规范.md` | 实施前必须阅读编码规范、提交规范、git config 用户要求和代码批次规则 | Step 17 / `07-实施计划.md` 必须承接 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可以进入 Cargo path dependency | `L0-core` 可 path dependency；MQ / store / 发布方 / 订阅方 / SDK 不可 |
| `standards/document/子项目目录与代码文件组织规范.md` | 新项目默认在 `/home/aris/Projects/quantalithos-<project>`，仓内目录不得带 `L0` 或重复项目前缀 | Step 4 文件布局必须按该规范展开 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 以 Rust 可实现契约表达 | 正式 `03` 的对象、trait、DTO、event、job、error、伪代码都按 Rust 形态写 | 全文 |
| 设计中文注释、源码英文注释 | 设计仓便于中文审查，真实代码仓遵守英文源码规范 | Step 6 / 7 / 8 / 10 / 12 / 16 |
| Domain 不依赖基础设施 | 领域对象和 policy 不依赖 HTTP、DB、MQ、SDK、gateway 或下游系统 | domain / policies |
| 外部 I/O 走 port / adapter | repository、transport backend、outbox publisher、projection、clock、id generator 都通过 trait 承接 | application / infra / worker / jobs |
| 本仓不实现认证网关 | 只接收 actor、metadata、trace、authorization reference，不解析 token / session | command / query / operations API |
| 禁止保存 payload body 和 raw secret | bus 只保存引用、fingerprint、metadata 和审计材料 | persistence / audit / projection |
| 运行期依赖不得写成 Cargo dependency | MQ backend、store、发布方、订阅方、observability、governance、SDK 都通过 adapter / event / query 协作 | Step 7 / 8 / 11 / 14 |
| 不默认公共 crates 发布 | 当前阶段优先本地 path dependency，中期记录 private git tag / rev | Cargo dependency / implementation plan |

### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | 本地 path dependency，优先引用 `../quantalithos-core/crates/contracts` | private git tag / rev | contracts、domain、application、api、worker、jobs、infra |

### 7.4 本步不画图说明

本步不画图。`standards/document/详细设计书写规范.md` §5.3 明确规定“实现约束与编码规范承接”章节禁止画图。本步只用表格收稳编码规范、实现约束和本地多仓依赖。

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §3 应从本文件摘录并收敛为以下结构：

```md
## 3. 实现约束与编码规范承接

### 3.1 编码规范承接

从 `design-calibration/03_ddd_step_03_coding_runtime_constraints.md` §7.1 摘录。

### 3.2 实现约束

从 `design-calibration/03_ddd_step_03_coding_runtime_constraints.md` §7.2 摘录。

### 3.3 本地多仓依赖约束

从 `design-calibration/03_ddd_step_03_coding_runtime_constraints.md` §7.3 摘录，并在 Step 4 / Step 14 补充实际使用的 core crate。

### 3.4 实施前置阅读提示

说明实施者必须阅读 Rust 编码规范、实施计划提交规范、目录组织规范，并在目标实现仓确认项目级 git config。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| `L0-bus` 是否直接依赖 `core-domain` / `core-application` | A. 只依赖 `core-contracts`；B. 依赖多个 core crate；C. 临时复制类型 | 推荐 A | bus 主要消费共享契约，扩大 core 依赖会提高耦合；若 Step 7 发现必要再补 |
| Runtime 是否立即锁定 `tokio` | A. Step 3 锁定；B. Step 4 / Step 14 根据 api / worker / job 再定；C. 不使用 async runtime | 推荐 B | 当前只需确认 async 边界，具体 runtime 应跟实现单元和 adapter 绑定 |
| 目标实现仓是否已存在 | A. 立即要求存在；B. 详细设计记录默认路径，实施计划再创建 / 确认；C. 改到 design 仓内实现 | 推荐 B | 当前是设计阶段，`/home/aris/Projects/quantalithos-bus` 可由实施者按计划创建 |
| 源码注释是否使用中文 | A. 中文；B. 英文；C. 中英混写 | 推荐 B | `standards/coding/rust.md` 已规定真实实现仓源码默认英文 |

---

## 10. 进入下一步条件

```text
语言、编码、注释、提交、仓库、runtime、依赖和安全边界约束已经收稳。
L0-core 已确认为唯一编译期依赖,当前默认使用本地 path dependency。
运行期依赖和事件协作依赖不会被写成 Cargo path dependency。
可以进入 Step 4,继续收稳实现单元与文件布局。
```
