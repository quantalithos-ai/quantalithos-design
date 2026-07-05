# Step 3. 收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
> 回填章节: `03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_02_scope.md` | 已完成 | 提供本轮 `03` 的覆盖范围、非范围和实现者可直接承接的代码范围 |
| `standards/coding/rust.md` | 已读取 | 提供 Rust 源码语言、命名、注释、rustdoc 和公开 API 约束 |
| `standards/document/详细设计书写规范.md` | 已读取 | 提供详细设计正式章节组织方式和实现契约写法 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供实现仓目录、workspace member、package / crate 命名和文件组织规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供编译期 / 运行期 / 事件协作依赖分类和 path dependency 裁剪规则 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已作为当前 `03` 的门禁规范生效 | 提供后续 Step 6~17 的真相源闭环与暂停实现规则 |
| `projects/README.md` §1.1 / §8.2 | 已读取 | 提供实现仓路径约定、提交规范和 `Co-Authored-By` 固定 footer |
| `projects/L1-artifact/00-需求文档.md` §6 | 已读取 | 提供 `L1-artifact` 的依赖裁剪表和禁止依赖口径 |
| `projects/L1-artifact/01-架构设计.md` §8 / §11 / §15 | 已读取 | 提供唯一编译期依赖、非 core sibling 禁止源码依赖和横切边界 |
| `projects/L1-artifact/02-概要设计.md` §3 / §11 / §12 / §13 | 已读取 | 提供禁止配置化边界、详细设计承接清单和实现期不得私补规则 |
| `/home/aris/Projects` 本地 sibling repo 检查 | 已执行 | 确认当前本地已存在与未存在的实现仓,防止把不存在仓写成默认 path dependency |
| `/home/aris/Projects/quantalithos-core/Cargo.toml` 与 `crates/contracts/Cargo.toml` | 已读取 | 确认 `core-contracts` package 名、`core_contracts` lib 名、edition 和 rust-version 现实基线 |

---

## 2. SOP 问题回答

### 2.1 本仓使用什么语言、runtime、框架和主要依赖?

`L1-artifact` 的目标实现仓使用 Rust。当前阶段只收稳语言、运行形态和依赖裁剪,不提前锁定具体 Web framework、数据库、消息后端、对象存储、搜索、归档后端、观测后端或 scheduler 产品。

本轮确认的代码形态约束如下:

- 语言:
  Rust。
- 运行形态:
  同步入口、异步 consumer 和后台 jobs 三类路径并存,分别承接 `Artifact Sync Entry`、`Artifact Async Intake` 和 `Artifact Operations Jobs`。
- 工程形态:
  目标实现仓位于 `/home/aris/Projects/quantalithos-artifact`。是否采用 workspace 多 crate 还是单 crate 模块分层,留到 Step 4 正式决策。
- 已确认的编译期 sibling 依赖:
  只有 `L0-core`。
- 已确认的默认共享契约 crate:
  `core-contracts` (`core_contracts`)。
- 尚不锁定的内容:
  framework、storage engine、message backend、HTTP / RPC 技术栈、scheduler、cache、search、对象存储、archive / observability 产品。

当前不把 `quantalithos-core` 的 `edition = "2024"` 和 `rust-version = "1.93"` 直接写成 `L1-artifact` 的已确认仓级事实,但它们是当前 org 内已存在 Rust sibling 的现实基线。Step 4 / Step 17 和未来 `07-实施计划.md` 应把目标实现仓的 Cargo workspace edition / rust-version 正式落盘。

### 2.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

以下 Rust 编码规范会直接影响后续 Step 4~17 的设计写法:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文,不得使用拼音。
- Rust 源码中的普通注释、rustdoc 文档注释、错误说明注释必须使用英文。
- 公开 struct、enum、enum variant、trait、函数、字段必须有 rustdoc。
- 带载荷的 enum variant 必须说明载荷语义。
- 错误模型必须以正式 error enum / typed error surface 表达,不得退化成随意 string。
- Step 7 定义 trait / port / adapter 签名时,必须把 async 语义写清楚;是否使用具体宏或语言技巧留给实现仓决定,但契约层不能含糊。
- Step 16 的测试名必须用英文,并能回指状态矩阵、错误分支、接口族或 gate。
- 设计中的 Rust code block 应尽量保持可直接转写,不能混入未解释占位类型或中文源码注释。

### 2.3 是否必须遵守 rustdoc 风格注释? struct、字段、enum、enum variant、函数分别如何注释?

必须遵守,并且要处理好“设计正文中文”和“实现源码英文”的边界。

本轮确定以下写法:

- 设计正文、表格说明、流程解释使用中文。
- 设计中的 Rust code block 采用英文 rustdoc。
- crate / module 顶部说明使用 `//!`。
- public struct / enum / trait / type alias 使用 `///` 单句摘要。
- public 字段使用 `///` 说明字段来源、含义和边界。
- enum variant 使用 `///` 说明业务语义。
- 带载荷 variant 必须在 `///` 中说明载荷承载什么上下文。
- public factory / transition / service function 使用 `///` 说明行为、输入语义、错误和副作用。

### 2.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

实施者开始前必须阅读:

- `standards/coding/rust.md`
- `standards/document/子项目目录与代码文件组织规范.md`
- `projects/README.md` §1.1
- `projects/README.md` §8.2
- 后续正式 `07-实施计划.md` 的实现前阅读矩阵和提交规范章节

当前已确认的提交与 git 身份约束:

- 设计仓 commit:
  `type(scope): 中文 subject`。
- 实现仓 commit:
  默认使用英文 subject / body。
- 非微小提交:
  必须带 body,说明本次边界闭合内容。
- 固定 footer:
  `Co-Authored-By: Codex <noreply@openai.com>`。
- 实施前置 git 身份检查:
  `user.name=quantalithos-labs`
  `user.email=quantalithos.ai@gmail.com`
- 实施 agent 不得把详细设计正文或当前对话自由总结成永久规则;永久记忆只能来自后续 `07-实施计划.md` 的种子表。

### 2.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

`L1-artifact` 不应实现以下边界:

- 全局身份认证凭据、`GlobalMember` 生命周期、role truth。
- API gateway、workspace UI 状态、console 展示状态。
- runtime tool sandbox、agent loop、capability registry。
- governance decision truth、work truth、process truth、conversation truth。
- archive package body、observability body、sync private copy。
- method definition / standard 正文。
- 外部内容存储后端正文、search / graph / object store / Git / S3 产品级实现语义。
- external audit 或其他外部系统 truth。

本仓只能通过以下正式边界消费或输出外部语义:

- `ActorContext`
- `CommandMetadata` / `QueryMetadata`
- typed ref、snapshot、safe summary
- event envelope
- port / adapter
- handoff material / receipt / marker

### 2.6 本仓是否依赖已经实现的 Quantalithos 仓库?

是,但依赖必须按类型裁剪。

从正式需求 / 架构基线看,与 `L1-artifact` 有关的仓包括:

- `L0-core`
- `L0-bus`
- `L1-governance`
- `L1-work`
- `L1-process`
- `L1-conversation`
- `L1-workspace`
- `L3-method-library`
- `L2-runtime`
- `L4-observability`
- `L4-archive`
- `L0-sdk`

其中只有 `L0-core` 可进入编译期依赖讨论。其余都属于运行期或事件协作依赖。

### 2.7 这些依赖中哪些是已确认的编译期依赖?

只有 `L0-core`。

当前已核实的共享契约 crate:

- package:
  `core-contracts`
- lib crate:
  `core_contracts`
- 本地路径:
  `/home/aris/Projects/quantalithos-core/crates/contracts`

当前不把 `core-domain`、`core-application`、`core-infra`、`core-jobs`、`core-cli` 写成 `L1-artifact` 的默认业务依赖。除非后续 Step 7 / Step 14 证明必须引用,并且正式回写设计真相源,否则不得预支。

### 2.8 依赖仓库在 `/home/aris/Projects` 下是否存在?

本轮实际检查结果如下:

- 已存在:
  `/home/aris/Projects/quantalithos-core`
  `/home/aris/Projects/quantalithos-bus`
  `/home/aris/Projects/quantalithos-identity`
  `/home/aris/Projects/quantalithos-process`
  `/home/aris/Projects/quantalithos-work`
  `/home/aris/Projects/quantalithos-governance`
  `/home/aris/Projects/quantalithos-method-library`
  `/home/aris/Projects/quantalithos-conversation`
  `/home/aris/Projects/quantalithos-sdk`
- 当前未发现:
  `/home/aris/Projects/quantalithos-artifact`
  `/home/aris/Projects/quantalithos-runtime`
  `/home/aris/Projects/quantalithos-observability`
  `/home/aris/Projects/quantalithos-archive`

这意味着:

- design 可以继续。
- Step 4 可以继续定义仓内布局。
- Step 17 / `07-实施计划.md` 必须把“目标实现仓尚未落地”记录为实施前置检查。
- 不能把当前未存在的 sibling repo 写成默认可直接引用的 path dependency。

### 2.9 对已确认的编译期依赖,当前是否采用本地 path dependency? 中期是否记录 private git tag / rev 方案?

是。当前默认采用 sibling repo 本地 path dependency。

针对 `core-contracts` 的默认写法是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

中期切换到 private git tag / rev 是允许的,但必须在后续 `07-实施计划.md` 或目标实现仓 README 中记录:

- 切换时机
- 版本固定方式
- 回滚口径

本轮明确不把 public crates.io 发布作为实现前置条件。

### 2.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

以下关系不能写成 Cargo path dependency:

- `L0-bus`
- `L1-governance`
- `L1-work`
- `L1-process`
- `L1-conversation`
- `L1-workspace`
- `L3-method-library`
- `L2-runtime`
- `L4-observability`
- `L4-archive`
- `L0-sdk`
- 外部内容系统 / external audit / archive target / observability target

它们只能在后续 Step 7 / Step 8 / Step 14 中通过以下形式承接:

- runtime adapter
- event publish / subscribe
- snapshot / safe summary resolver
- handoff target / receipt
- SDK / API client
- fake adapter / contract test seam

---

## 3. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 正式 `02-概要设计.md` | 只固定“唯一编译期依赖是 `L0-core`”,尚未固定真实 crate 路径和 package 名 | 本步核实并固定 `core-contracts` 的默认 path dependency 写法 |
| 正式 `01-架构设计.md` | 已固定非 core sibling 不得成为编译期依赖,但还没转成 Step 3 的仓级实现约束 | 本步把它收敛为实现约束表和多仓依赖约束表 |
| `详细设计书写规范.md` 与 `standards/coding/rust.md` | 前者允许中文说明,后者要求实现源码注释英文 | 本步明确“正文中文, Rust code block 注释英文” |
| 旧 `03-详细设计.md` | 没有新版 workspace / sibling repo / 提交规范承接 | 本轮不继承旧口径,由 Step 3 重新建立实现约束 |
| `/home/aris/Projects/quantalithos-artifact` | 当前未发现目标实现仓 | 不阻塞 design,但必须进入 Step 17 / `07` 的实施前置检查 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言与工程形态 | 只知道后续要写 Rust 契约 | 明确语言为 Rust,运行形态为 sync entry / async intake / jobs,仓级形态待 Step 4 决策 | 为 Step 4~8 提供统一前提 |
| 编译期依赖 | 只有语义上的 `L0-core` 唯一依赖 | 固定到 `core-contracts` package / lib / path dependency 默认写法 | 防止 Step 4 凭空发明依赖 |
| sibling repo 关系 | 运行期 / 事件协作依赖尚未转成仓级写作约束 | 明确哪些仓绝不能进 Cargo dependency | 保护依赖裁剪 |
| 注释语言 | 中文设计文与英文源码规范存在潜在冲突 | 明确“正文中文, Rust code block 英文 doc comment” | 避免后续 Step 6~8 写法摇摆 |
| 提交与 git 身份 | 未在 `03` 的中间产物里收稳 | 明确实施前必须阅读提交规范和确认 git identity | 为 `07-实施计划.md` 提供前置输入 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 把所有已存在的 sibling repo 都视为可编译期 path dependency | 共享类型看起来方便 | 直接破坏依赖裁剪、truth 边界和 L1 平权 | 不采用 |
| B. 只允许 `L0-core` 进入编译期依赖,其余一律通过 runtime / event / handoff 接缝协作 | 与需求 / 架构 / 概要三层基线一致 | 需要后续 Step 7 / 8 / 14 写更多 adapter / DTO mapping | 采用 |
| C. 当前连 `L0-core` 也不固定,完全留给实现仓决定 | 避免过早绑定 | `ActorContext`、typed ref、trace、shared error 等共享契约无法稳定落码 | 不采用 |
| D. 当前就锁定 DB / message / object store / search / archive / observability 产品 | 便于实现仓开工 | 越过 Step 3 职责,会把技术选型伪装成已确认事实 | 不采用 |

---

## 6. 结构化中间产物

### 6.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码标识符、注释、rustdoc、测试名默认英文;公开 API 必须有 rustdoc;enum variant 不得省略注释 | Step 6~8 的 Rust 契约 code block 使用英文 doc comment |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码;模块、对象、协议、流程、状态、事务、错误和测试切口必须收稳 | Step 4~17 全部按实现契约组织 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓默认位于 `/home/aris/Projects/quantalithos-artifact`;workspace member 使用 `crates/<role>`;Cargo package 与 Rust crate 命名有固定规则 | Step 4 文件布局必须承接这一命名规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写入 Cargo dependency;运行期和事件协作依赖不得写成本地 path dependency | Step 7 / Step 14 不得把 runtime / event 协作写成源码依赖 |
| `standards/document/设计真相源闭环与可落码性标准.md` | ref、reason、DTO、state、metadata、idempotency、event、job、query view 和 phase boundary 必须闭环 | 后续 Step 6~17 发现缺口必须回设计闭口,不得让实现仓私补 |
| `projects/README.md` §8.2 | 设计仓 commit 中文,实现仓 commit 英文,非微小提交写 body,固定 `Co-Authored-By` footer | Step 17 和 `07-实施计划.md` 需要回填实施前阅读和提交要求 |

### 6.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 语言固定为 Rust | `L1-artifact` 的目标实现仓使用 Rust | Step 4 以后的全部实现单元 |
| 源码英文,正文中文 | 设计正文用中文;Rust 源码和 Rust code block 注释用英文 | Step 6 对象契约;Step 7 trait;Step 8 protocol;Step 16 tests |
| 运行形态固定为三类路径 | 同步入口、异步 consumer、后台 jobs 分离 | entry / consumer / jobs / application flow |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 可进入 Cargo dependency | contracts / domain / application / infra |
| 非 core sibling 只允许 runtime / event / handoff 协作 | governance、work、process、conversation、workspace、method-library、runtime、observability、archive、sdk 不得写成源码依赖 | Step 7 port / adapter;Step 8 event / consumer;Step 14 external binding |
| 外部正文禁止入仓 | 正文只能以 ref、summary、snapshot、mirror state 或 degraded surface 承接 | Step 6 object fields;Step 11 persistence |
| Query / Consumer / Job 红线不可突破 | Query no-write、Consumer 不写核心 truth、Job 不修复核心 truth | Step 8 interfaces;Step 9 flows;Step 11 transaction |
| 禁止配置化边界不可改写 | truth ownership、formal anchors、candidate-only、正文排除、事务成立边界不能被配置改变 | Step 10 state matrix;Step 14 config binding |
| 目标实现仓当前未落地 | `/home/aris/Projects/quantalithos-artifact` 当前未发现 | Step 17 / `07-实施计划.md` 必须加入实施前置检查 |

### 6.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、infra 中共享 typed ref / actor / trace / error 契约 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不允许 Cargo path dependency | event publisher / subscriber adapter | outbound event、inbound consumer、outbox relay |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | 不允许 Cargo path dependency | runtime adapter / event seam | governance context ref、baseline / evidence 协作 |
| `quantalithos-work` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-work` | 不允许 Cargo path dependency | runtime adapter / event seam | work context ref、consumption / baseline 协作 |
| `quantalithos-process` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-process` | 不允许 Cargo path dependency | runtime adapter / event seam | process context ref、activity / output 协作 |
| `quantalithos-conversation` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-conversation` | 不允许 Cargo path dependency | runtime adapter / event seam | downstream read surface / preview consumer |
| `quantalithos-method-library` | 运行期依赖 | `/home/aris/Projects/quantalithos-method-library` | 不允许 Cargo path dependency | runtime adapter / snapshot seam | definition ref、work product / method source 协作 |
| `quantalithos-sdk` | 运行期依赖 | `/home/aris/Projects/quantalithos-sdk` | 不允许 Cargo path dependency | SDK / API contract consumer | external consumer / sync / console access path |
| `quantalithos-runtime` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-runtime` | 不允许 Cargo path dependency | runtime signal adapter | automation candidate-only input |
| `quantalithos-observability` | 事件协作 / handoff 依赖 | `/home/aris/Projects/quantalithos-observability` | 不允许 Cargo path dependency | handoff / audit adapter | observability handoff |
| `quantalithos-archive` | 运行期 / handoff 依赖 | `/home/aris/Projects/quantalithos-archive` | 不允许 Cargo path dependency | handoff / receipt adapter | archive handoff |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“待确认事项”小节,了解 Rust 编码、提交和本地多仓依赖约束如何收敛。

## 3. 实现约束与编码规范承接

本仓目标实现采用 Rust。设计正文使用中文,但 Rust 源码与设计中的 Rust code block 注释默认使用英文 rustdoc。当前唯一允许的编译期 sibling 依赖是 `L0-core`,默认通过 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 引用共享 typed ref、actor、trace 和基础错误契约。其余 sibling repo 与外部系统只能通过 runtime adapter、event、snapshot、safe summary、handoff、SDK 或 fake 策略协作,不得写成 Cargo path dependency。

### 3.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 英文标识符、英文注释、公开 API rustdoc、enum variant 注释强制性 | Rust 契约 code block 使用英文 doc comment |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码 | Step 4~17 按实现契约组织 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓路径、workspace member、package / crate 命名 | Step 4 文件布局和命名检查 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖类型裁剪和 path dependency 约束 | Step 7 / 14 不得越界写编译期依赖 |
| `projects/README.md` §8.2 | 提交规范和固定 footer | Step 17 / `07-实施计划.md` 的实施前置阅读 |

### 3.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 语言固定为 Rust | 目标实现仓使用 Rust | 所有实现单元 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 可进入 Cargo dependency | contracts / domain / application / infra |
| runtime / event 依赖隔离 | 非 core sibling 只能通过运行期或事件接缝协作 | port / adapter / event / handoff |
| 外部正文禁止入仓 | 外部正文只以 ref / summary / snapshot / mirror 承接 | object / persistence / config |
| Query / Consumer / Job 红线保持 | Query no-write、Consumer 不写 truth、Job 不修复 truth | protocol / flow / tx consistency |
| 配置不可越界 | 配置不能改 truth ownership、formal anchors 或路径分离 | state matrix / config binding |

### 3.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | shared contracts |

运行期依赖、事件协作依赖、handoff 依赖和下游消费依赖不得写入 Cargo path dependency。它们在 Step 7 / Step 8 / Step 14 中通过 port、adapter、event、snapshot、safe summary、handoff target 和 fake 策略定义。

---

## 8. 待确认事项

- 当前没有阻塞 Step 4 的待确认事项。
- Step 4 需要在 workspace 多 crate 与单 crate 模块分层之间作正式布局决策。
- Step 4 需要把 `quantalithos-artifact` 的 Cargo workspace 顶层文件和 member 目录结构正式落盘。
- Step 17 / `07-实施计划.md` 需要把“目标实现仓当前未发现”写成实施前置 gate。

---

## 9. 进入下一步条件

- 已明确本仓使用 Rust,并明确设计正文与源码注释的语言边界。
- 已明确 `L0-core` 是唯一编译期 sibling 依赖,且固定了默认 `core-contracts` path dependency 写法。
- 已明确 runtime / event / handoff 协作依赖不得进入 Cargo path dependency。
- 已明确提交规范、git identity 和实施前阅读要求。
- 可以进入 Step 4 “收稳实现单元与文件布局”。
