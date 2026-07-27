# L3-capability-hub 03 详细设计 Step 3: 收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 状态: completed_wait_user_review
> 本轮口径: 只收稳语言、编码规范、注释规范、仓库纪律、runtime 分类、跨仓依赖和安全边界约束;不修改正式 `03-详细设计.md`,不写文件布局、对象字段、trait 签名、DTO schema、配置 key、测试结果、run_id、evidence alias、验收签署、implementation ledger 或 planned boundary skeleton。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 3 `收稳编码规范、语言 / runtime、仓库约束` |
| 用户确认 | 用户已回复“同意”,允许从 Step 2 进入 Step 3 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游基线 | `03_ddd_step_01_upstream_boundary.md`;`03_ddd_step_02_scope.md`;新版 `00-需求文档.md`;新版 `01-架构设计.md`;新版 `02-概要设计.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md`;`projects/L1-artifact/design-calibration/03_ddd_step_03_constraints.md`;`projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` |
| 旧材料处理 | README、旧 `03-详细设计.md` 和旧 provider / decision / cost / KMS / QueryCapabilities / policy refresh / execution gateway 口径只作 historical material / pollution audit |

---

## 1. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | read | 确认项目级恢复点停在 `03` Step 2,用户确认后允许进入 Step 3。 |
| `design-calibration/03_ddd_calibration_flow.md` | read | 确认文档级 flow、Step 3 产物路径和正式 `03` 后置装配规则。 |
| `design-calibration/03_ddd_step_01_upstream_boundary.md` | completed | 提供 `03` 上游输入边界、旧 `03` 禁入主线、本文必须回答 / 不再回答和回退规则。 |
| `design-calibration/03_ddd_step_02_scope.md` | completed | 提供本轮详细设计覆盖范围、非范围、后续 Step 分派和实现者可完成代码范围。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 3 必须回答语言、runtime、框架、依赖、rustdoc、提交、git config 和安全边界问题。 |
| `standards/document/详细设计书写规范.md` | read | §5.3 要求输出编码规范承接表、实现约束表和本地多仓依赖约束表;本章禁止画图。 |
| `standards/document/设计文档讨论中间产物规范.md` | active process rule | 要求先形成中间产物、再等待停审,不得直接修改正式文档。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | active design gate | 后续若缺字段、DTO、state、port、mapper、config 或 test cut,必须回设计闭口,不得交给实现端私补。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | read | 确认 `L3-capability-hub` 的编译期依赖为 `L0-core`,运行期依赖为外部 MCP / A2A / API 集成,事件协作为通过 `L0-bus` 发布能力事件。 |
| `standards/coding/rust.md` | read | 提供 Rust 源码英文、命名、注释、rustdoc、公开 enum variant 注释和 rustfmt / clippy 关系。 |
| `projects/README.md` §1.1 / §8.2 | read | 提供实现仓路径、package / crate 命名约束、设计仓 / 实现仓 commit message 语言边界和固定 footer。 |
| `/home/aris/Projects/quantalithos-core/Cargo.toml` | read | 确认当前 org 内已存在 Rust workspace 的 edition、rust-version 和 workspace dependency 基线。 |
| `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml` | read | 确认 `core-contracts` package 名、`core_contracts` lib 名和真实本地路径。 |
| `/home/aris/Projects` sibling repo 检查 | executed | 确认哪些相邻仓当前存在,哪些不存在,防止把运行期 / 事件依赖误写成 Cargo path dependency。 |

### 1.1 本地 sibling repo 检查结果

| 仓库 | 当前本地状态 | 本 Step 用途 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | exists | 唯一已确认编译期 sibling 依赖来源;已核实 `core-contracts`。 |
| `/home/aris/Projects/quantalithos-bus` | exists | 事件协作基础设施,不得因此成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-governance` | exists | governance seam / result ref 的运行期或事件协作边界,不得成为 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-method-library` | exists | method asset ref / body-free relation 的运行期或事件协作边界,不得成为 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-sdk` | exists | SDK exposure consumer 边界,不得实现 SDK client 或成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-identity` | exists | actor / member 语义只能经 `L0-core` shared contract 或运行期 ref 承接,不得成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-work` | exists | 下游或相邻运行期协作边界,不得成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-process` | exists | 相邻运行期协作边界,不得成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-conversation` | exists | 相邻运行期协作边界,不得成为本仓 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-capability-hub` | not found | 目标实现仓当前未发现;不阻塞 design,但 Step 17 / `07` 必须作为实施前置检查。 |
| `/home/aris/Projects/quantalithos-runtime` | not found | runtime execution 不归本仓;即使后续存在也不得成为当前 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-tools` | not found | tools execution 不归本仓;不得成为当前 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-marketplace` | not found | marketplace listing / transaction 不归本仓;不得成为当前 Cargo path dependency。 |

---

## 2. SOP 问题回答

### 2.1 本仓使用什么语言、runtime、框架和主要依赖?

`L3-capability-hub` 的目标实现语言为 Rust。目标实现仓默认位于 `/home/aris/Projects/quantalithos-capability-hub`,但本轮检查尚未发现该目录,因此当前只固定设计约束,不伪造目标仓 Cargo 事实。

本 Step 收稳的运行和工程口径如下:

- 语言:
  Rust。
- 工程形态:
  后续 Step 4 需要在 Rust workspace / crate / package / module / file layout 中正式落盘;本 Step 不提前写目录树。
- edition / rust-version:
  当前已存在的 `quantalithos-core` workspace 使用 `edition = "2024"` 和 `rust-version = "1.93"`。目标实现仓创建时应优先对齐该 org baseline;若实施计划发现目标仓已有更具体基线,必须在 Step 17 / `07` 中记录差异和处理口径。
- runtime 分类:
  本仓只实现 capability access truth 的同步 Command / Query、body-free inbound consumer、operations job、outbound event candidate、projection / handoff / reference refresh 等服务端路径。这里的 runtime 是代码运行形态,不是 `L2-runtime` 执行域。
- 框架 / 产品:
  当前不锁定 Web framework、RPC framework、数据库、message backend、scheduler、cache、search、object storage、secret 平台、observability backend、API gateway 或 provider gateway。
- 已确认编译期 sibling 依赖:
  只有 `L0-core` 的 `core-contracts` crate,用于 shared ref、metadata、trace / actor context、error / result / event envelope 等跨仓共享契约。
- 基础 third-party crate:
  `serde`、`serde_json`、`thiserror` 等只作为当前 org Rust workspace 的现实基线和候选,最终依赖版本由目标实现仓 Cargo workspace 在 Step 4 / `07` 中固定。

### 2.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

`standards/coding/rust.md` 直接影响后续 Step 4~17 的 Rust 契约写法:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文,不得使用拼音或 Unicode 标识符。
- Rust 源码中的普通注释、rustdoc 文档注释、错误说明注释必须默认使用英文。
- public struct、enum、enum variant、trait、type alias、function、field 必须具备 rustdoc 语义说明。
- public enum 的每个 variant 都必须写 `///` 文档注释;带载荷 variant 必须说明载荷承载的数据、错误或上下文语义。
- 错误模型必须用 typed error enum / typed error surface 表达,不得用自由 `String` 或泛化错误吞掉 domain / protocol / infra 边界。
- Step 7 定义 trait / port / adapter 时必须写清 async 语义、返回类型、错误类型和 fake parity。是否使用 `async_trait`、boxed future 或其他实现技巧,只能在契约明确后由实现仓 / 实施计划裁剪,不得在设计中含糊。
- Step 8 的 DTO / event / job / receipt / report schema 必须使用可转写的英文 Rust 名称,并能回指 Step 6 对象和 Step 9 flow。
- Step 16 的测试名必须使用英文,并能回指接口、状态矩阵、错误分支、幂等或配置门禁。
- rustfmt / clippy 可作为工具,但不能替代本 Step 的命名、注释、边界和错误模型设计判断。

### 2.3 是否必须遵守 rustdoc 风格注释? struct、字段、enum、enum variant、函数分别如何注释?

必须遵守 rustdoc 风格注释。`详细设计书写规范.md` 要求 struct / enum / enum variant / value object 有 Rustdoc 风格注释,而 `standards/coding/rust.md` 明确实现仓 Rust 源码注释必须英文。为保证设计中的 Rust code block 能直接转写到实现仓,本轮采用以下边界:

| 设计位置 | 写法 |
|---|---|
| 正式文档正文、表格、取舍说明 | 使用中文说明语义和边界。 |
| Rust code block 中的 rustdoc | 使用英文。 |
| crate / module 级说明 | 使用 `//!`。 |
| public struct | 使用 `///` 写单句摘要,必要时说明 owned truth / snapshot / ref / derived material 边界。 |
| public 字段 | 使用 `///` 说明字段来源、含义、可否为空、是否为 ref / safe summary / forbidden body guard。 |
| public enum | 使用 `///` 说明分类边界和状态族。 |
| enum variant | 每个 variant 都使用 `///` 说明业务语义;带载荷 variant 说明载荷承载的上下文。 |
| public trait | 使用 `///` 说明 port / repository / adapter 责任、读写性质和不允许的副作用。 |
| public function / factory / transition method | 使用 `///` 说明行为、输入语义、返回语义、错误和副作用。 |
| test function | 名称英文,测试意图可在测试注释中用英文补充。 |

### 2.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

实施者开始前必须阅读:

- `standards/coding/rust.md`
- `standards/document/子项目目录与代码文件组织规范.md`
- `standards/document/代码实施台账与门禁规范.md`
- `projects/README.md` §1.1 和 §8.2
- 后续正式 `07-实施计划.md` 的实现前阅读矩阵、提交规范、phase / commit boundary 和 implementation ledger 规则

当前确认的提交和 git 身份约束:

| 约束 | 当前结论 |
|---|---|
| 设计仓 commit message | `type(scope): 中文 subject`,非微小提交必须写 body。 |
| 实现仓 commit message | 使用英文,标题固定为 `type(scope): subject`;若目标仓有更严格规范,只能叠加不能放宽。 |
| 固定 footer | `Co-Authored-By: Codex <noreply@openai.com>`。 |
| design repo 当前 `user.name` | `quantalithos-labs`。 |
| design repo 当前 `user.email` | `quantalithos.ai@gmail.com`。 |
| 目标实现仓 git config | 当前目标实现仓未发现,尚未检查;Step 17 / `07` 必须作为实施前置门禁。 |
| 提交时机 | 当前任务未要求 commit;本轮不得提交。 |
| 永久记忆 | 实现 agent 的永久规则只能来自 `07-实施计划.md` 种子表,不得把当前对话或详细设计正文自由总结成永久规则。 |

### 2.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

Capability Hub 只拥有 capability access truth。本仓不实现以下边界:

- 全局身份认证、成员生命周期、role truth、API gateway 或 UI / console 权限系统。
- runtime execution、tools execution、agent loop、tool invocation、provider runtime、LLM routing、provider health probing。
- provider route、quota、failover、retry policy、cost / billing ledger、provider raw billing source。
- secret / KMS / Vault 平台、secret value、token、API key、secret rotation workflow。
- governance approval、Policy truth、shared_rules truth、自动审批编排、policy simulation 或治理规则引擎。
- method body、method lifecycle、method definition source truth、method version body 或 method package 发布。
- SDK client、SDK package、language binding、client cache、client-side retry / fallback。
- marketplace listing、transaction、pricing、fulfillment、ranking、recommendation 或运营流程。
- observability / audit store 正文、raw log、metric backend、trace backend、真实 evidence alias。
- external document body、完整 protocol document repository 和外部系统 truth。

本仓只能通过 Actor / Command / Query metadata、typed ref、external ref、safe summary、body-free relation、controlled consumer view、event candidate、handoff marker、diagnostic surface、port / adapter 和 fake 测试边界消费或输出这些语义。

### 2.6 本仓是否依赖已经实现的 Quantalithos 仓库?

是,但依赖必须按类型裁剪。

已存在的 `quantalithos-core` 是唯一已确认编译期 sibling 依赖。`quantalithos-bus`、`quantalithos-governance`、`quantalithos-method-library`、`quantalithos-sdk`、`quantalithos-identity`、`quantalithos-work`、`quantalithos-process`、`quantalithos-conversation` 等即使本地存在,也不能直接写成 `L3-capability-hub` 的 Cargo dependency。它们只能通过运行期 port / adapter、event collaboration、ref、safe summary、snapshot、handoff、controlled consumer view 或 fake seam 协作。

目标实现仓 `/home/aris/Projects/quantalithos-capability-hub` 当前未发现,因此 design 可以继续,但实施计划必须先检查并创建或确认目标仓路径。

### 2.7 这些依赖中哪些是已确认的编译期依赖?

只有 `L0-core`。

当前已核实的 core crate:

| 项 | 值 |
|---|---|
| package | `core-contracts` |
| lib crate | `core_contracts` |
| 本地路径 | `/home/aris/Projects/quantalithos-core/crates/contracts` |
| 默认 dependency 写法 | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |

当前不把 `core-domain`、`core-application`、`core-infra`、`core-jobs` 或 `core-cli` 写成 `L3-capability-hub` 默认业务依赖。除非后续 Step 7 / Step 14 / Step 17 证明必须引用并回写设计真相源,否则不得预支。

### 2.8 依赖仓库在 `/home/aris/Projects` 下是否存在?

已检查。`quantalithos-core`、`quantalithos-bus`、`quantalithos-governance`、`quantalithos-method-library`、`quantalithos-sdk`、`quantalithos-identity`、`quantalithos-work`、`quantalithos-process` 和 `quantalithos-conversation` 当前存在。`quantalithos-capability-hub`、`quantalithos-runtime`、`quantalithos-tools` 和 `quantalithos-marketplace` 当前未发现。

本检查只说明本地目录是否存在,不改变依赖类型。存在的运行期或事件协作仓也不能进入 Cargo path dependency。

### 2.9 对已确认的编译期依赖,当前是否采用本地 path dependency?中期是否记录 private git tag / rev 方案?

是。当前阶段对已确认的编译期 sibling 依赖默认使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

中期可以切换到 private git tag / rev,但必须由后续 `07-实施计划.md` 或目标实现仓 README 记录切换时机、版本固定方式、回滚口径和私有仓访问约束。本轮不把 public crates.io 发布或 GitHub 公开依赖作为实现前置条件。

### 2.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

以下关系不能写成 Cargo path dependency:

- `L0-bus`:只作为事件协作主干和 event publisher / subscriber 绑定候选。
- `L1-governance`:只通过 governance result ref、policy result ref、safe summary、seam relation、consumer event 或 adapter 协作。
- `L3-method-library`:只通过 method asset ref、body-free relation、safe summary、consumer event 或 adapter 协作。
- `L0-sdk`:只作为下游 SDK exposure / consumer 边界,本仓不实现 SDK client / cache。
- `L2-runtime` / `L2-tools`:只消费 formal exposure / controlled consumer view,不得反写 truth,也不得被本仓编译期依赖。
- marketplace / product / console:只作为 read-only ecosystem discovery、external ref 或 future enhancement 边界。
- observability / audit / archive:只作为 ref、handoff marker、audit material ref 或 downstream consumer,不得保存正文。
- external MCP / A2A / API provider:运行期集成对象只能经 adapter descriptor、external source ref、safe summary 和 external port 表达,不得变成 provider runtime / secret / route / cost truth。

---

## 3. 当前文档问题诊断

| 位置 / 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 正式 `02-概要设计.md` | 已固定 `L0-core` 之外不得形成 sibling 编译期依赖,但未落到具体 package / lib / path 写法。 | 本步核实并固定 `core-contracts` / `core_contracts` / `../quantalithos-core/crates/contracts`。 |
| 旧 `03-详细设计.md` | 旧文件布局和实现主线围绕 provider service、access decision、cost accounting、KMS / Vault、QueryCapabilities、policy refresh 和 execution gateway。 | 降级为 historical material;后续 Step 4~17 不继承旧目录、旧依赖或旧 service 主线。 |
| `详细设计书写规范.md` 与 `standards/coding/rust.md` | 前者允许中文说明,后者要求实现源码注释英文,容易导致 Rust code block 混入中文 doc comment。 | 本步明确正文中文、Rust code block 和实现源码 rustdoc 英文。 |
| 本地 sibling repo | 多个相邻仓当前存在,容易被误写成 path dependency。 | 本步明确只有 `quantalithos-core` 可作为已确认编译期依赖;其余存在状态不改变依赖类型。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-capability-hub` 当前未发现。 | 不阻塞 design;Step 17 / `07` 必须作为实施前置检查。 |
| framework / 产品选型 | 当前 `00/01/02` 未锁定 DB、queue、scheduler、gateway、secret platform、observability backend 或 provider gateway。 | 本步不提前选型;Step 7 / 11 / 14 定义抽象 port、repository、adapter、config owner 和 fake parity。 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言 / 工程口径 | Step 2 只说明实现者应能完成 Rust workspace / crate / module skeleton。 | 明确目标语言为 Rust,目标仓默认 `quantalithos-capability-hub`,具体 layout 交给 Step 4。 | 支撑后续 Rust 契约写法,同时避免提前写目录。 |
| rustdoc 规则 | Rust 注释语言和详细设计中文表达存在潜在冲突。 | 明确正文中文、Rust code block 英文 rustdoc;public enum variant 不得省略注释。 | 保证设计可转写到源码。 |
| 编译期依赖 | 只有语义上的 `L0-core` 唯一依赖。 | 固定到 `core-contracts` package / `core_contracts` lib / path dependency 默认写法。 | 防止 Step 4 凭空发明 core crate。 |
| runtime / event 依赖 | 下游和相邻仓关系分散在 `00/01/02`。 | 明确 L0-bus、governance、method-library、SDK、runtime、tools、marketplace、observability 等不得成为 Cargo path dependency。 | 保护全局依赖裁剪。 |
| 安全 / 外部边界 | 需求 / 架构中已有禁区,但尚未变成实现约束。 | 明确 auth、gateway、runtime execution、tools execution、secret、cost、governance truth、method body、SDK client、marketplace、observability store 等不在本仓实现。 | 防止后续模块越界。 |
| 提交 / git 前置阅读 | 未在 `03` 中间产物内收稳。 | 指向 `projects/README.md`、实施台账规范和后续 `07`,并记录当前 design repo git identity。 | 为 Step 17 / `07` 承接准备输入。 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接依赖 governance / method-library / SDK / bus 等本地 sibling repo | 可以复用相邻仓 DTO 或 client,初期写起来省事。 | 破坏全局依赖裁剪,让相邻仓 truth 反向塑造 Capability Hub,且运行期 / 事件依赖会变成源码耦合。 | 不采用。 |
| B. 只把 `L0-core` 的 `core-contracts` 作为编译期 sibling 依赖,其他关系用 port / adapter / ref / event / fake 表达 | 符合 `00/01/02` 和全局依赖矩阵,便于保持 capability access truth 独立。 | 后续 Step 7 / 8 / 14 需要补更多 adapter、DTO mapping 和 fake parity。 | 采用。 |
| C. 当前不指定任何 Cargo dependency | 避免过早绑定真实路径。 | actor / trace / metadata / event envelope / shared ref 等跨仓共享契约无法可落码。 | 不采用。 |
| D. 把 public crates.io 或公开 GitHub 发布作为实现前置 | 版本来源清晰。 | 与当前本地多仓开发阶段不符,会阻塞实现仓创建和本地联调。 | 不采用。 |
| E. 在本 Step 直接决定完整 Web framework / DB / queue / gateway / secret 平台 | 可让后续配置更具体。 | 当前上游未授权,会把 ADR / `04` / `07` 的职责提前塞入 `03` Step 3。 | 不采用。 |

---

## 6. 结构化中间产物

### 6.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码标识符、模块名、类型名、函数名、变量名、测试名必须英文;普通注释、rustdoc 和错误说明注释必须英文。 | Step 4~17 的 Rust code block 使用英文名称和英文 doc comment;中文只用于设计正文。 |
| `standards/coding/rust.md` | public API 应使用 rustdoc;public enum 每个 variant 必须有 `///`;带载荷 variant 必须说明载荷语义。 | Step 6 对象契约、Step 8 schema、Step 10 状态 enum 和 Step 12 error enum 不得省略 variant 注释。 |
| `standards/coding/rust.md` | rustfmt / clippy 不能替代编码规范,注释和语义命名必须由设计明确。 | 后续不能只写“按 rustfmt / clippy”,必须给出对象、字段、函数、错误和状态语义。 |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码,§3 必须输出编码规范承接表、实现约束表和本地多仓依赖约束表。 | 本 Step 提供正式 §3 回填草稿;Step 4~17 在此约束下继续展开。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓位于 `/home/aris/Projects/quantalithos-<project>`;Rust workspace member 使用 `crates/<role>`;L 层编号不得进入代码命名。 | Step 4 文件布局必须使用 `quantalithos-capability-hub` 和短 role 目录,不得出现 `L3` 代码命名。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 类型、DTO、state、metadata、idempotency、projection、event、job、config、evidence schema 和 phase boundary 必须闭环。 | 后续 Step 6~17 遇到缺口必须回设计闭口,不得由实现端补造 truth。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写成本地 path dependency;运行期依赖和事件协作依赖不得写成 Cargo dependency。 | 本 Step 只允许 `L0-core` 进入 path dependency 讨论,其他 sibling 进入 port / adapter / event / fake。 |
| `projects/README.md` §1.1 / §8.2 | 设计仓 commit 使用中文 subject;实现仓 commit 使用英文;固定 `Co-Authored-By`;实现仓路径与 package / crate 命名受目录规范约束。 | Step 17 和 `07` 需要回填实现前阅读、git config 检查和 commit message 纪律。 |
| `standards/document/代码实施台账与门禁规范.md` | 实现进入 commit boundary 后必须记录 implementation ledger、staged scope、测试证据、commit message 和 blocker。 | 本 Step 不创建 implementation ledger;仅把该规范列入后续实施前置阅读。 |

### 6.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 语言 | 目标实现语言为 Rust;目标实现仓未发现前不得伪造 Cargo 事实。 | Step 4 文件布局;Step 6~12 Rust 契约;Step 16 测试切口。 |
| 目标仓路径 | 默认目标实现仓为 `/home/aris/Projects/quantalithos-capability-hub`;当前未发现。 | Step 17 / `07` 实施前置检查;Step 4 只写设计 layout。 |
| Rust workspace baseline | 已存在 core 仓使用 Rust 2024 / rust-version 1.93;目标仓创建时优先对齐,已有目标仓则以实际 baseline 加设计审计为准。 | Step 4 Cargo layout;Step 17 实施承接。 |
| 源码英文 | 标识符、rustdoc、普通注释、错误说明和测试名默认英文。 | 所有 Rust code block、对象、trait、DTO、state、error、test cut。 |
| rustdoc 必填 | public struct、field、enum、enum variant、trait、function 必须有 rustdoc;enum variant 不得省略。 | Step 6 对象;Step 7 trait;Step 8 schema;Step 10 state;Step 12 error。 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 的 `core-contracts` 可进入 Cargo path dependency。 | contracts / domain / application / ports 中需要 core shared contract 的位置。 |
| 非 core sibling 隔离 | governance、method-library、SDK、runtime、tools、bus、marketplace、observability、archive、identity、work、process、conversation 不得成为当前 Cargo dependency。 | Step 7 port / adapter;Step 8 consumer / event;Step 14 external binding。 |
| runtime / tools 不入仓 | 不实现 execution、tool invocation、provider runtime、route / quota / failover / retry / health probing。 | adapter descriptor、formal exposure、consumer view、external port。 |
| governance truth 不入仓 | 不实现 approval、Policy truth、shared_rules truth、policy simulation 或治理规则引擎。 | governance seam relation、safe summary adapter、inbound governance consumer。 |
| method body 不入仓 | 不保存 method body、method lifecycle、method version body 或 package 发布。 | capability-method body-free relation、method asset ref resolver。 |
| SDK client 不入仓 | 不实现 SDK package、language binding、client cache 或 client-side retry / fallback。 | SDK exposure consumer ref、formal exposure handoff。 |
| forbidden body 永不入仓 | secret 正文、governance 正文、method 正文、runtime execution payload、observability raw body、marketplace transaction、cost ledger、external document body 均禁止保存。 | 对象字段、DTO、repository、projection、event、handoff、test negative cases。 |
| Query no-write | Query 只能读取 truth / projection / safe summary / controlled view,不得写 core truth。 | Query API、projection store、read service、test cut。 |
| Consumer no direct core truth write | Inbound consumer 只能写 ref、safe summary、impact summary、reference state 或派生 refresh signal,不得直接修补核心 truth。 | Inbound event consumer、application service、UoW、error handling。 |
| Job no core truth repair | operations job 可重建 projection、刷新 ref、修复 event collaboration 状态,不得修补 identity / registry / descriptor / exposure truth。 | Operations job、reconciliation、projection rebuild、repair flow。 |
| Event failure no rollback | event publish / collaboration failure 不能回滚已提交 truth,只能记录 event collaboration state / repair candidate。 | Outbound event candidate、publisher adapter、transaction boundary、retry / repair job。 |
| 配置不可越界 | 配置只能选择 adapter、profile、timeout category、job runner 和 publisher / handoff binding,不能改变 truth owner、状态红线或 forbidden body 边界。 | Step 14 config owner;Step 10 state;Step 11 persistence。 |
| 实施前阅读 | 实现前必须阅读 Rust 编码规范、目录组织规范、项目 README 提交规范、代码实施台账规范和 `07`。 | Step 17 handoff;`07` implementation boundary。 |

### 6.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、ports 中需要 shared ref、metadata、trace / actor context、error / result / event envelope 的部分 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不允许 Cargo path dependency | event publisher / subscriber adapter 或 private protocol binding | outbound event candidate、event collaboration port、repair job |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | 不允许 Cargo path dependency | governance result adapter / event consumer | governance seam relation、policy result ref、safe summary |
| `quantalithos-method-library` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-method-library` | 不允许 Cargo path dependency | method asset ref adapter / event consumer | capability-method body-free relation、method asset ref resolver |
| `quantalithos-sdk` | 下游消费 / exposure boundary | `/home/aris/Projects/quantalithos-sdk` | 不允许 Cargo path dependency | SDK exposure contract / generated client handoff | SDK exposure consumer ref、formal exposure handoff |
| `quantalithos-runtime` | 下游运行期消费 | `/home/aris/Projects/quantalithos-runtime` 当前未发现 | 不允许 Cargo path dependency | runtime consumer adapter / controlled view API | runtime / tools consumer ref、controlled consumer view |
| `quantalithos-tools` | 下游运行期消费 | `/home/aris/Projects/quantalithos-tools` 当前未发现 | 不允许 Cargo path dependency | tools consumer adapter / controlled view API | tools consumer ref、controlled consumer view |
| `quantalithos-marketplace` | future / ecosystem dependency | `/home/aris/Projects/quantalithos-marketplace` 当前未发现 | 不允许 Cargo path dependency | read-only ecosystem discovery adapter | ecosystem discovery summary,不得形成 listing truth |
| external MCP / A2A / API provider | 外部运行期集成对象 | 不适用 | 不允许 Cargo dependency | adapter descriptor / external port / safe summary | external source ref、adapter descriptor、reference resolution |
| observability / audit system | handoff / ref / downstream | 不适用或后续 sibling | 不允许 Cargo path dependency | audit handoff adapter / observability ref resolver | trace / audit seam、handoff marker、diagnostic surface |
| secret / KMS / Vault platform | 外部安全平台 | 不适用 | 不允许 Cargo dependency | secret ref / safe summary adapter | secret ref、secret handling safe summary,不得保存 secret 正文 |

### 6.4 历史材料差异审计

| 历史材料口径 | 当前裁决 | 原因 |
|---|---|---|
| 旧 `ProviderContract` 作为核心依赖和对象主线 | 禁入,仅可拆为 `AdapterDescriptor`、external source ref、risk / constraint summary 和 secret safe summary。 | 旧口径混入 provider runtime、secret、route、quota、cost 和 failover。 |
| 旧 `CapabilityDecision` / allow-deny / policy refresh | 禁入,仅保留 governance seam relation、formal exposure 和 controlled consumer view 分层。 | 本仓不拥有 governance approval / Policy truth 或 runtime enforcement。 |
| 旧 `QueryCapabilities` 高频执行查询 | 禁入旧主线,后续改为 controlled consumer view Query / projection read。 | Query 不得反写真相,也不得成为 runtime cache 或 allow / deny source。 |
| 旧 `CostRecord` / accounting service | 禁入。 | cost / billing ledger 不归 Capability Hub。 |
| 旧 KMS / Vault / secret envelope | 禁入正文,仅保留 secret ref / safe summary。 | secret 平台和 secret value 不归本仓。 |
| 旧 outbox relay / retry 产品口径 | 不继承产品实现;后续只可定义 event candidate、publisher port、collaboration state 和 repair job。 | event failure 不回滚 truth,但具体 bus / outbox 产品后移。 |
| 旧 runtime / tools execution gateway | 禁入。 | execution、tool invocation 和 provider runtime 不归本仓。 |
| 旧 marketplace metadata / listing | 禁入核心,只可作为 read-only ecosystem discovery 边界。 | marketplace listing / transaction / pricing / fulfillment 不归本仓。 |

---

## 7. 回填草稿

> 注意: 本节只是 Step 19 装配正式 `03-详细设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 3. 实现约束与编码规范承接

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“历史材料差异审计”和“待确认事项”小节,了解 Rust 编码、rustdoc、仓库、依赖裁剪和安全边界约束如何收敛。

本仓目标实现语言为 Rust。正式实现仓默认位于 `/home/aris/Projects/quantalithos-capability-hub`,当前本轮检查尚未发现该目录,因此 `07-实施计划.md` 必须把目标实现仓创建或路径确认作为实施前置门禁。当前唯一允许的编译期 sibling 依赖是 `L0-core` 的 `core-contracts` crate;其他相邻仓、下游、事件协作、外部 provider 和安全 / 观测 / marketplace 系统只能通过 port、adapter、ref、safe summary、event、handoff、controlled view 或 fake seam 协作,不得写成 Cargo path dependency。

### 3.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 和错误说明注释必须英文。 | 后续 Rust code block 使用英文名称和英文 doc comment;中文只用于设计正文。 |
| `standards/coding/rust.md` | public API 应使用 rustdoc;public enum 每个 variant 必须有 `///`;带载荷 variant 必须说明载荷语义。 | 对象、schema、state enum 和 error enum 不得省略 variant 注释。 |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码,并输出编码规范、实现约束和本地多仓依赖约束。 | Step 4~17 必须继续补齐 layout、对象、trait、DTO、flow、state、persistence、error、idempotency、config 和 test cut。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写成本地 path dependency;运行期依赖和事件协作依赖不得写成 Cargo dependency。 | 本仓只允许 `L0-core` 进入 path dependency。 |
| `projects/README.md` §1.1 / §8.2 | 实现仓路径、package / crate 命名、design 仓中文 commit、实现仓英文 commit 和固定 footer。 | Step 17 / `07` 必须承接实现前阅读、git config 和 commit message 纪律。 |

### 3.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 语言 | 目标实现语言为 Rust;目标仓未发现前不得伪造 Cargo 事实。 | 所有 crate / module / Rust 契约。 |
| 源码英文 | 标识符、rustdoc、普通注释、错误说明和测试名默认英文。 | 对象、trait、DTO、state、error、test cut。 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 的 `core-contracts` 可进入 Cargo path dependency。 | contracts、domain、application、ports。 |
| 运行期 / 事件依赖隔离 | governance、method-library、SDK、runtime、tools、bus、marketplace、observability 等不得成为 Cargo dependency。 | port、adapter、event、handoff、fake。 |
| forbidden body 永不入仓 | secret、governance、method、runtime execution、observability raw body、marketplace transaction、cost ledger、external document body 均禁止保存。 | 对象字段、DTO、repository、projection、event、handoff。 |
| Query no-write | Query 不能写 core truth。 | Query API、read service、projection store。 |
| Consumer no direct core truth write | Inbound consumer 不能直接修补核心 truth。 | consumer service、UoW、event handling。 |
| Job no core truth repair | operations job 不能修补 identity / registry / descriptor / exposure truth。 | reconciliation、projection rebuild、repair job。 |
| Event failure no rollback | event collaboration failure 不能回滚已提交 truth。 | event candidate、publisher adapter、repair state。 |
| 配置不可越界 | 配置不能改变 truth owner、状态红线或 forbidden body 边界。 | config owner、state matrix、domain policy。 |

### 3.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | shared ref、metadata、trace / actor context、error / result / event envelope |

运行期依赖、事件协作依赖、下游消费和 handoff / export 依赖不得写入 Cargo path dependency。它们在 Step 7 / Step 8 / Step 14 中通过 port、adapter、event、snapshot、safe summary、handoff、external binding 和 fake 策略定义。
```

---

## 8. 待确认事项

| 事项 | 是否阻塞 Step 4 | 当前处理 |
|---|---|---|
| `/home/aris/Projects/quantalithos-capability-hub` 当前未发现。 | 不阻塞 Step 4。 | Step 4 可继续定义设计布局;Step 17 / `07` 必须作为实施前置检查。 |
| 目标仓 edition / rust-version 尚无真实 Cargo 基线。 | 不阻塞 Step 4。 | 以 `quantalithos-core` Rust 2024 / 1.93 作为优先对齐基线;若实施发现目标仓已有基线,需回写差异。 |
| 具体 Web / RPC / DB / message / scheduler / secret / observability 产品未选型。 | 不阻塞 Step 4。 | 后续 Step 7 / 11 / 14 定义抽象 port、repository、config owner 和 fake parity;产品选型后移 ADR / `04` / `07`。 |
| `core-contracts` 以外的 core crate 是否需要依赖。 | 不阻塞 Step 4。 | 当前默认不依赖;若 Step 7 / 14 发现必要,必须回本 Step 或正式 §3 修订。 |
| 运行期 / 事件依赖的具体 protocol schema 未闭口。 | 不阻塞 Step 4。 | Step 8 / 14 继续定义 DTO / event / adapter binding;不得借此引入 sibling Cargo dependency。 |

当前未发现阻塞 Step 4 的上游 blocker。上述事项均为后续 Step 或 `07` 实施前置检查,不是当前 `03` Step 3 的停止条件。

---

## 9. 进入下一步条件

| 条件 | 当前结果 |
|---|---|
| 已明确本仓实现语言和目标仓路径口径。 | pass |
| 已明确 Rust 源码英文、rustdoc、enum variant 注释、错误模型、trait / async 和测试命名约束。 | pass |
| 已明确提交规范、git config 和实施前阅读要求。 | pass |
| 已核实 `core-contracts` package / lib / path。 | pass |
| 已明确只有 `L0-core` 可作为编译期 sibling 依赖。 | pass |
| 已明确运行期 / 事件 / downstream / external 关系不得写成 Cargo path dependency。 | pass |
| 已明确安全、鉴权、网关、secret、runtime、tools、governance、method、SDK、marketplace、cost 和 observability 边界不归本仓。 | pass |
| 已记录目标实现仓未发现但不阻塞 design。 | pass |
| 已确认本 Step 不修改正式 `03-详细设计.md`。 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `收稳实现单元与文件布局`;Step 4 必须先读取 `standards/document/子项目目录与代码文件组织规范.md`、详细设计 SOP Step 4、详细设计书写规范 §5.4、`03_ddd_step_03_constraints.md`、新版 `02-概要设计.md` 代码主体框架和参考项目 Step 4;不得跳到对象契约、trait 契约或正式 `03` 装配。
