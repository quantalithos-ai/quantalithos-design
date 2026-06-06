# Step 3. 收稳编码规范、语言 / runtime、仓库约束

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节:`03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_02_scope.md`
- 规范输入:
  - `standards/coding/rust.md`
  - `standards/document/详细设计书写规范.md`
  - `standards/document/子项目目录与代码文件组织规范.md`
  - `standards/document/legacy/实施计划书写规范.md`
  - `standards/子项目遵循规范清单.md`
- 上游边界:
  - `projects/L1-process/00-需求文档.md` §6 / §12
  - `projects/L1-process/01-架构设计.md` §8
  - `projects/L1-process/02-概要设计.md` §3 / §11 / §12 / §13
- 本地 sibling repo 检查:
  - `/home/aris/Projects/quantalithos-core` 已存在
  - `/home/aris/Projects/quantalithos-process` 当前未发现

### 3. SOP 问题回答

1. 本仓使用什么语言、runtime、框架和主要依赖?

   回答:目标实现仓 `quantalithos-process` 使用 Rust workspace,edition 采用 Rust 2024,并沿用 Quantalithos 已有 Rust workspace 形态。当前阶段不锁定 Web framework、数据库产品、搜索产品、消息队列产品、缓存产品或调度产品。核心编译期依赖只允许 `L0-core` 的共享契约 crate,优先使用 `core-contracts`,用于 Actor、Trace、Metadata、shared ref、error、event envelope 等共享契约。`serde`、`serde_json`、`thiserror` 等基础 crate 只作为实现层候选,最终版本由目标仓 Cargo workspace 固定。

2. Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

   回答:详细设计必须按 `standards/coding/rust.md` 展开 Rust 契约。影响本轮设计的规则包括:
   - 类型、函数、变量、模块、测试名使用英文,不得使用拼音。
   - 实现仓 Rust 源码中的普通注释、rustdoc 文档注释、错误说明注释必须使用英文。
   - public struct、enum、enum variant、trait、function、field 必须有 rustdoc 风格注释。
   - enum variant 不得省略注释;带载荷 variant 必须说明载荷语义。
   - 错误类型必须表达语义边界,不得用泛化 string error 替代正式错误 enum。
   - async trait / repository / adapter 签名必须在 Step 7 明确;是否使用 `async_trait` 或其他技术机制留给实现仓,但 trait 语义不可含糊。
   - 测试名使用英文,并能回指设计中的 TC / gate / state matrix。

3. 是否必须遵守 rustdoc 风格注释?struct、字段、enum、enum variant、函数分别如何注释?

   回答:必须遵守。`详细设计书写规范.md` 的正文示例使用中文 Rustdoc,但 `standards/coding/rust.md` 明确目标实现仓源码注释必须英文。为保证设计契约可以直接转写到源码,本轮详细设计采用以下规则:
   - 设计正文、表格说明和字段语义解释可以使用中文。
   - Rust code block 中的 doc comment 使用英文。
   - crate / module 级说明使用 `//!`。
   - public struct / enum / trait / type alias 使用 `///` 单句摘要。
   - public 字段使用 `///` 说明来源、含义和边界。
   - enum variant 使用 `///` 说明业务语义;带载荷 variant 说明载荷。
   - public function / factory / transition method 使用 `///` 说明行为、错误和副作用。

4. 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

   回答:实施者必须阅读 `standards/coding/rust.md`、`standards/document/子项目目录与代码文件组织规范.md`、`standards/document/legacy/实施计划书写规范.md` 的 commit / git config 部分,以及后续正式 `07-实施计划.md` 的提交规范章节。当前 design 文档仓 commit 使用项目已确认的中文主题和固定 AI footer。目标实现仓代码 commit message 以目标仓实施计划为准;若无更具体规则,使用 Conventional Commits 结构。实施者开始前还必须确认 git author / committer 与项目约束一致,并在每个 commit boundary 前确认工作树不混入无关文件。

5. 哪些安全、鉴权、网关或外部边界不应在本仓实现?

   回答:L1-process 不实现全局身份认证、GlobalMember 生命周期、平台 role truth、API gateway、workspace 聚合授权、global observability、archive 长期存储、method definition body、work truth、governance decision truth、artifact evidence body、runtime execution body 或 conversation body。L1-process 只通过 `ActorContext`、`CommandMetadata`、`QueryMetadata`、external ref、snapshot、event envelope、port / adapter 和 handoff marker 消费这些边界。

6. 本仓是否依赖已经实现的 Quantalithos 仓库?

   回答:是。当前本地已经存在 `/home/aris/Projects/quantalithos-core`。但 L1-process 只有 `quantalithos-core` 是已确认编译期依赖;其他仓即使本地存在,也不能写成 Cargo dependency。

7. 这些依赖中哪些是已确认的编译期依赖?

   回答:只有 `L0-core`。已确认可用的 core crate 包括:
   - `core-contracts`: `/home/aris/Projects/quantalithos-core/crates/contracts`,package 名 `core-contracts`,lib 名 `core_contracts`。
   - `core-domain`、`core-application`、`core-infra`、`core-jobs`、`core-cli` 当前不作为 L1-process 默认业务依赖;除非后续 Step 7/14 证明必须引用并回写设计真相源,否则不得引入。

   目标实现仓默认引用方式为:

   ```toml
   core-contracts = { path = "../quantalithos-core/crates/contracts" }
   ```

8. 依赖仓库在 `/home/aris/Projects` 下是否存在?

   回答:`/home/aris/Projects/quantalithos-core` 已存在,workspace edition 为 Rust 2024,rust-version 为 1.93。目标实现仓 `/home/aris/Projects/quantalithos-process` 当前在本次检查中未发现;这不阻塞 design,但实施计划需要把创建目标实现仓或确认目标仓路径作为 PH-01 前置门禁。

9. 对已确认的编译期依赖,当前是否采用本地 path dependency?中期是否记录 private git tag / rev 方案?

   回答:当前采用 sibling repo 本地 path dependency。中期切换为 private git tag / rev,但必须在 `07-实施计划.md` 或目标实现仓 README 中记录切换时机、版本固定方式和回滚口径。设计文档不得要求发布到 public crates.io 作为实现前置条件。

10. 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

    回答:`L0-bus`、`L1-identity`、`L1-conversation`、`L1-work`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service`、`L1-workspace`、`L0-sdk`、`L3-method-library`、`L4-observability`、`L4-archive` 都不能成为 L1-process 当前编译期依赖。它们只能通过 event、port、adapter、snapshot、external ref、handoff、API 或 fake 测试边界表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` | 已说明唯一编译期依赖是 `L0-core`,但没有落到具体 Cargo path 和 crate 名 | 本 Step 固定默认引用 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |
| `03-详细设计.md` 旧版 | 没有按新版 Rust workspace / multi crate / local sibling 依赖约束展开 | 后续 Step 4 重建 file layout,不得继承旧目录 |
| `详细设计书写规范.md` 与 `standards/coding/rust.md` | 前者示例要求中文 Rustdoc,后者要求实现源码注释英文 | 本 Step 明确设计正文中文、Rust code block 注释英文 |
| 本地 sibling repo | 多个相邻仓可能存在或后续存在,容易被误写成 path dependency | 本 Step 明确只有 `L0-core` 可进 Cargo dependency |
| `quantalithos-process` 实现仓 | 当前未在 `/home/aris/Projects` 下发现 | 不阻塞 design;实施计划 PH-01 前置检查确认创建或路径 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言 / runtime | 概要只说明后续写 Rust 契约 | 明确 Rust workspace、Rust 2024、源码英文和 rustdoc 要求 | 支撑 Step 4~8 code block |
| 编译期依赖 | `L0-core` 语义级约束 | 具体到 `core-contracts` package / lib / local path | 支撑 Cargo layout |
| 相邻仓关系 | 运行期 / 事件 / 下游消费分类 | 明确不得进入 Cargo dependency | 防止依赖方向越界 |
| 提交规范 | 未在 03 校准中承接 | 指向项目 commit / git config 规范和后续实施计划 | 支撑实施计划承接 |
| 安全 / 鉴权边界 | 分散在需求 / 架构 | 明确本仓不实现全局身份、gateway、observability、archive 等外部边界 | 防止模块越界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. L1-process 直接依赖所有本地 sibling repo | 使用 typed DTO 方便 | 破坏 L1 平权和依赖裁剪,形成循环风险 | 不采用 |
| B. 只编译期依赖 `L0-core`,其他通过 port / event / snapshot / fake | 符合架构和需求红线 | 需要在 Step 7 / 8 补更多 adapter / DTO mapping | 采用 |
| C. 当前不指定任何 Cargo dependency | 可避免过早绑定 | 共享 metadata / actor / trace / event envelope 无法落码 | 不采用 |
| D. 把 public crates.io 发布作为依赖前置 | 版本治理清晰 | 当前阶段不现实且会阻塞本地多仓开发 | 不采用 |

### 7. 结构化中间产物

#### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码使用英文标识符和英文注释;public API 必须有 rustdoc;enum variant 必须注释 | Step 6~8 的 Rust 契约 code block 使用英文 doc comment |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码;对象、trait、protocol、flow、state、persistence、error、idempotency、test cut 必须闭环 | 本轮 Step 4~17 全部按实现契约组织 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录为 `/home/aris/Projects/quantalithos-<project>`;workspace member 使用 `crates/<role>` | Step 4 文件布局必须使用 `quantalithos-process` 和短 role 目录 |
| `standards/document/legacy/实施计划书写规范.md` | 实施者需确认 git config、提交粒度、commit message 和 AI footer | Step 17 和 `07-实施计划.md` 需要回填实现前置阅读 |
| `standards/子项目遵循规范清单.md` | 每次提交遵循项目 commit 规范并带 AI footer | 当前设计仓提交和后续实现仓提交都要遵守对应项目口径 |

#### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust workspace | 目标仓采用 Rust workspace;edition Rust 2024;rust-version 跟随目标仓 Cargo workspace | Step 4 文件布局;所有 crate |
| 源码英文 | Rust 源码标识符、注释、rustdoc、测试名默认英文 | Step 6 对象契约;Step 8 DTO;Step 16 测试切口 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 可进入 Cargo dependency | contracts / domain / application / infra |
| 运行期 / 事件依赖隔离 | method、work、identity、governance、artifact、runtime、conversation、workspace、observability、archive 不得成为 Cargo dependency | Step 7 port / adapter;Step 8 event / consumer;Step 14 external binding |
| 正文排除 | 不保存 method / work / governance / artifact / runtime / identity / conversation / workspace / observability / archive 正文 | Step 6 snapshot/ref 字段;Step 11 persistence |
| 状态机红线不可配置化 | 配置只能注入参数,不能改变 truth 边界和合法迁移 | Step 10 state matrix;Step 14 config |
| query / projection 不反写 | Query、projection rebuild、reconciliation、handoff 不写 core truth | Step 8 query/job;Step 9 flows;Step 11 transaction |
| recovery 不分叉 | checkpoint / recovery 只能沿同一 ProcessInstance 继续 | Step 6 recovery objects;Step 10 state matrix |

#### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、infra 中需要 core shared contracts 的部分 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不允许 Cargo path dependency | event publisher / subscriber adapter | outbound event、inbound consumer、outbox publish |
| `quantalithos-method-library` | 运行期依赖 | `/home/aris/Projects/quantalithos-method-library` | 不允许 Cargo path dependency | method definition source adapter | runtime shape sync、method snapshot refresh |
| `quantalithos-work` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-work` | 不允许 Cargo path dependency | work context adapter / inbound event | work context snapshot、timebox binding |
| `quantalithos-identity` | 运行期依赖 | `/home/aris/Projects/quantalithos-identity` | 不允许 Cargo path dependency | actor / capability adapter | actor capability snapshot、visibility / audit input |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | 不允许 Cargo path dependency | governance decision adapter / event consumer | waiting gate resume evidence |
| `quantalithos-artifact` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-artifact` | 不允许 Cargo path dependency | artifact evidence adapter / event consumer | activity evidence and snapshot markers |
| `quantalithos-runtime` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-runtime` | 不允许 Cargo path dependency | runtime feedback adapter / event consumer | activity feedback marker |
| `quantalithos-conversation` | 事件协作 / 运行期依赖 | `/home/aris/Projects/quantalithos-conversation` | 不允许 Cargo path dependency | conversation context adapter / event consumer | conversation context marker and timeline |
| `quantalithos-workspace` | 下游消费 / 运行期提供 | `/home/aris/Projects/quantalithos-workspace` | 不允许 Cargo path dependency | query / event consumption | process progress consumption |
| `quantalithos-observability` | 事件协作 / trace handoff | `/home/aris/Projects/quantalithos-observability` | 不允许 Cargo path dependency | observability handoff adapter | trace handoff |
| `quantalithos-archive` | 下游消费 / trace handoff | `/home/aris/Projects/quantalithos-archive` | 不允许 Cargo path dependency | archive handoff adapter | archive handoff |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“待确认事项”小节,了解 Rust 编码、注释、提交和本地多仓依赖约束如何收敛。

## 3. 实现约束与编码规范承接

本仓目标实现采用 Rust workspace。源码标识符、注释、rustdoc 和测试名默认使用英文;设计正文使用中文说明。当前唯一允许的编译期 sibling 依赖是 `L0-core`,默认通过 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 `core-contracts` path dependency 引用共享契约。其他 Quantalithos 仓只能通过运行期 port、event、snapshot、external ref、handoff、API 或测试 fake 协作,不得写成 Cargo dependency。

### 3.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码使用英文标识符和英文注释;public API 必须有 rustdoc;enum variant 必须注释 | Rust 契约 code block 使用英文 doc comment |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码 | Step 4~17 按实现契约组织 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录、workspace member、package、crate 和 binary 命名规则 | Step 4 文件布局使用 `quantalithos-process` 和 `crates/<role>` |
| `standards/document/legacy/实施计划书写规范.md` | git config、提交粒度、commit message 和 AI footer | Step 17 和实施计划回填实现前置阅读 |

### 3.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust workspace | 目标仓采用 Rust workspace;edition Rust 2024 | 所有 crate |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 可进入 Cargo dependency | contracts / domain / application / infra |
| 运行期 / 事件依赖隔离 | 相邻仓不得成为 Cargo dependency | port / adapter / event / handoff |
| 正文排除 | 不保存相邻仓正文 | snapshot / ref / persistence |
| 状态机红线不可配置化 | 配置不能改变 truth 边界和合法迁移 | state matrix / config |
| query / projection 不反写 | Query、projection rebuild、reconciliation、handoff 不写 core truth | query / job / transaction |

### 3.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、infra |

运行期依赖、事件协作依赖、下游消费和 handoff 依赖不得写入 Cargo path dependency。它们在 Step 7 / Step 8 / Step 14 中通过 port、adapter、event、snapshot、handoff 和 fake 策略定义。

### 9. 待确认事项

- 无阻塞 Step 4 的待确认事项。
- Step 4 需要在 workspace 多 crate 与单 crate 模块分层之间作正式布局决策。
- Step 4 需要根据 `quantalithos-core` 的真实 crate layout 写清本仓 Cargo dependency 位置,不得凭空引用不存在的 core crate。
- 实施计划需要把 `/home/aris/Projects/quantalithos-process` 是否存在作为 PH-01 前置检查。

### 10. 进入下一步条件

- 已明确 Rust workspace、Rust 2024 和源码英文注释约束。
- 已明确 `L0-core` 是唯一编译期 sibling 依赖。
- 已明确运行期 / 事件 / handoff / 下游消费依赖不得进入 Cargo path dependency。
- 已明确提交规范、git config 和 Rust 编码规范需要进入实施前置阅读。
- 可以进入 Step 4 “收稳实现单元与文件布局”。
