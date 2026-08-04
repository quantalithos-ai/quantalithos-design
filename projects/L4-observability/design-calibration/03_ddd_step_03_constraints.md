# L4-observability 03-详细设计 Step 03 · 实现约束与编码规范承接

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 03
> 回填章节: `03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单
> 当前模式: full-restart
> 当前门禁: Step 03 完成后停审,等待用户确认后才进入 Step 04

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 03 `收稳编码规范、语言 / runtime、仓库约束` |
| 输出文件 | `design-calibration/03_ddd_step_03_constraints.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | done |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_04 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 03 | 已读取 | 约束本步必须回答语言、runtime、编码、注释、提交、仓库和依赖裁剪问题 |
| `standards/document/详细设计书写规范.md` 5.3 | 已读取 | 约束本步必须输出编码规范承接表、实现约束表和本地多仓依赖约束表 |
| `standards/coding/rust.md` | 已读取 | 提供源码英文、rustdoc、public enum variant 注释和命名约束 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供目标实现仓路径、workspace / single crate 组织和 package / crate 命名规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 确认 `L4-observability` 只有 `L0-core` 是编译期依赖,`L0-bus` 是事件协作边界 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已作为门禁生效 | 约束后续 Step 不得让实现者私补字段、状态、DTO、port 或 phase boundary |
| `projects/README.md` §1.1 / §8.2 | 已读取 | 提供设计仓 / 实现仓目录约定、design 仓提交规范和实现仓英文 commit 边界 |
| `standards/document/实施计划书写规范.md` 4.9 / git config 相关章节 | 已读取 | 只作为实施前阅读与提交纪律输入,不在本步创建 commit boundary |
| `design-calibration/03_ddd_step_02_scope.md` | 已完成 | 提供本轮 `03` 的覆盖范围、非范围和实现者应能完成的代码范围 |
| `projects/L4-observability/01-架构设计.md` §8 / §10 / §11 / §13 / §14 / §15 | 已读取 | 提供依赖裁剪、产品中立、truth 边界、配置不可越界和风险口径 |
| `projects/L4-observability/02-概要设计.md` §3 / §4 / §11 / §12 | 已读取 | 提供 `L0-core` 唯一编译期依赖、主要组成部分、配置影响和详细设计承接清单 |
| 旧 `03_ddd_step_03_constraints.md` | historical material | 旧文件仅 81 行,把 schema 先行和自动下一步门禁混入 Step 03;本步全量替换 |
| `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md` | 已读取 | 作为 Step 03 结构和粒度参考,不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_03_constraints.md` | 已读取 | 作为依赖裁剪、源码语言和本地 path dependency 表粒度参考,不复制 Artifact truth |
| `/home/aris/Projects` sibling repo 检查 | 已执行 | 确认本地存在 / 不存在状态,防止把不存在仓或非编译期仓写成 path dependency |
| `/home/aris/Projects/quantalithos-core/Cargo.toml` 与 `crates/contracts/Cargo.toml` | 已读取 | 确认 `core-contracts` package、`core_contracts` lib 和当前 core workspace 现实基线 |

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖?

目标实现仓 `quantalithos-observability` 使用 Rust。当前阶段只收稳语言、运行形态和依赖裁剪,不提前锁定 Web framework、数据库、消息后端、metrics store、trace backend、dashboard、alert sink、object store、GRC / external audit 产品或 scheduler 产品。

当前确认的代码形态约束:

- 语言: Rust。
- 运行形态: 同步 command / query entry、异步 material consumer、后台 operations job、只读 handoff / export preparation 并存。
- 工程目录: 目标实现仓默认位于 `/home/aris/Projects/quantalithos-observability`;当前本地未发现该仓,不阻塞 design,但必须进入 Step 17 / `07-实施计划.md` 的实施前置 gate。
- 工程形态: workspace 多 crate 与 single crate 模块分层的正式决策留给 Step 04;Step 03 只固定命名和依赖规则。
- 已确认编译期 sibling 依赖: 只有 `L0-core`。
- 当前可核实共享契约 crate: `core-contracts` package / `core_contracts` lib,路径 `/home/aris/Projects/quantalithos-core/crates/contracts`。
- 当前不锁定的基础 crate: `serde`、`serde_json`、`thiserror`、async helper、HTTP / RPC crate、storage driver、OTel SDK 等均只作为后续实现候选,不得在本步写成正式依赖。

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

后续 Step 04~17 的 Rust-facing 契约必须承接 `standards/coding/rust.md`:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文,不得使用拼音。
- Rust 源码中的普通注释、rustdoc 文档注释、错误说明注释必须使用英文。
- 公开 struct、enum、enum variant、trait、function、field 必须有 rustdoc。
- 公开 enum 的每个 variant 都必须有 `///` 注释;带载荷 variant 必须说明载荷承载的数据、错误或上下文语义。
- 错误模型必须使用明确 error enum / typed error surface,不得用随意 string error 代替 admission、redaction、forbidden body、no-write、conflict、stale、quarantine 或 degraded 分类。
- Step 07 定义 trait / port / adapter 时必须写清 async / sync 语义;是否使用 `async_trait` 或其他实现技巧留给实现仓,但契约层不能含糊。
- Step 08 的 DTO、event payload、job report、view 和 receipt 必须可由 Step 06 对象和 Step 07 port 构造,不得出现未解释占位类型。
- Step 16 测试名使用英文,并能回指状态矩阵、错误分支、接口族、query no-write 或 forbidden body negative cut。

### 3.3 是否必须遵守 rustdoc 风格注释? struct、字段、enum、enum variant、函数分别如何注释?

必须遵守。为同时满足中文设计文档和英文实现源码约束,本轮确定以下规则:

- 设计正文、表格说明、流程解释使用中文。
- 设计中的 Rust code block 使用英文 rustdoc,以便实现者直接转写。
- crate / module 顶部说明使用 `//!`。
- public struct / enum / trait / type alias 使用 `///` 单句摘要,必要时补行为边界。
- public field 使用 `///` 说明来源、含义、可见性和禁止承载的内容。
- enum variant 使用 `///` 说明业务语义;带载荷 variant 说明载荷语义。
- public factory / transition / service function 使用 `///` 说明输入语义、输出、错误、幂等和副作用。
- 设计表格中的中文语义说明不是可复制到源码的注释模板。

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

实施者开始前必须阅读:

- `standards/coding/rust.md`
- `standards/document/子项目目录与代码文件组织规范.md`
- `projects/README.md` §1.1 / §8.2
- `standards/document/实施计划书写规范.md` 的实现仓 commit / git config 规则
- 后续正式 `07-实施计划.md` 的阶段阅读矩阵、提交规范和 implementation ledger 规则

当前 design 仓本地 git config 已核实为:

- `user.name=quantalithos-labs`
- `user.email=quantalithos.ai@gmail.com`

本步不创建实现 commit,也不伪造目标实现仓 git config。目标实现仓开工前必须在该仓内再次执行 git identity 检查。除当前 design 文档仓外,其他实现代码仓 commit message 默认使用英文,标题格式固定为 `type(scope): subject`,并在 AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` footer。

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

`L4-observability` 不实现以下边界:

- 全局身份认证、授权策略 truth、API gateway、Console UI 状态或用户管理。
- Governance decision truth、Artifact / evidence body、Identity lifecycle truth、Runtime / Sandbox execution truth、Archive package truth、L0-bus 主干 truth。
- source cleanup、source repair、kill / retry / recovery 控制命令、自动 remediation 或业务 truth reconciliation。
- OTel、Prometheus、Grafana、TimescaleDB、对象存储、search、alert sink、GRC / external audit 等产品的 truth source 语义。
- raw log body、metric raw payload、trace provider body、source audit body、evidence body、artifact body、governance decision body、identity body、runtime body、archive package body。

本仓只能写 observation-owned fact、audit projection、body-free evidence linkage、safe signal、read / diagnostic surface、report handoff marker、retention marker、no-write violation、history、outbox 和派生维护状态。

### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库?

是,但必须按依赖类型裁剪。

本地已发现的相关 sibling repo:

- `/home/aris/Projects/quantalithos-core`
- `/home/aris/Projects/quantalithos-bus`
- `/home/aris/Projects/quantalithos-governance`
- `/home/aris/Projects/quantalithos-artifact` 当前未发现
- `/home/aris/Projects/quantalithos-identity`
- `/home/aris/Projects/quantalithos-process`
- `/home/aris/Projects/quantalithos-work`
- `/home/aris/Projects/quantalithos-conversation`
- `/home/aris/Projects/quantalithos-method-library`
- `/home/aris/Projects/quantalithos-sdk`
- `/home/aris/Projects/quantalithos-runtime` 当前未发现
- `/home/aris/Projects/quantalithos-sandbox` 当前未发现
- `/home/aris/Projects/quantalithos-archive` 当前未发现
- `/home/aris/Projects/quantalithos-observability` 当前未发现

存在不等于可依赖。只有需求 / 架构 / 概要已裁剪为编译期依赖的仓才允许进入 Cargo dependency。

### 3.7 这些依赖中哪些是已确认的编译期依赖?

只有 `L0-core`。

当前已核实的默认共享契约 crate:

- package: `core-contracts`
- lib crate: `core_contracts`
- 本地路径: `/home/aris/Projects/quantalithos-core/crates/contracts`
- 当前 core workspace 现实基线: `edition = "2024"`, `rust-version = "1.93"`

`L4-observability` 当前默认引用方式:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

本步不把 `core-domain`、`core-application`、`core-infra`、`core-jobs` 或 `core-cli` 写成默认业务依赖。除非后续 Step 07 / Step 14 证明必须引用并回写设计真相源,否则不得预支。

### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在?

`quantalithos-core` 已存在,并且 `core-contracts` 的 package / lib 名已核实。`quantalithos-bus`、`quantalithos-governance`、`quantalithos-identity` 等若本地存在,也只能按运行期 / 事件协作 /引用边界处理,不得因为存在就进入 Cargo dependency。

目标实现仓 `quantalithos-observability` 当前未发现。这不阻塞设计文档继续推进,但 Step 17 和 `07-实施计划.md` 必须把“创建或确认目标实现仓路径、Cargo workspace、edition / rust-version 和本地 path dependency 可用性”列为实施前置门禁。

### 3.9 对已确认的编译期依赖,当前是否采用本地 path dependency? 中期是否记录 private git tag / rev 方案?

是。当前阶段已确认 Rust 编译期 sibling 依赖默认采用本地 path dependency,不默认要求发布到 public crates.io,也不默认要求从 GitHub 引用。

中期可以切换为 private git tag / rev,但必须由 `07-实施计划.md` 或目标实现仓 README 记录:

- 切换时机。
- 固定 tag / rev 的方式。
- 回滚口径。
- 对 implementation boundary 和 required checks 的影响。

### 3.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

以下关系不能写成 Cargo path dependency:

- `L0-bus`: 事件协作边界,用于 tap / audit material / replay 协作语境,通过 event envelope、consumer / publisher adapter、outbox relay 和 fake 承接。
- `L1-governance`: governance truth / audit context 来源,通过 safe ref、summary、gap、runtime adapter 或 event material 承接。
- `L1-artifact`: Artifact / evidence ownership 来源,通过 body-free evidence ref、digest、visibility、gap 和 handoff material 承接。
- `L1-identity`: actor / subject safe ref 来源,通过 ref / snapshot / visibility adapter 承接。
- `L2-runtime` 与 `L4-sandbox`: runtime / sandbox signal 来源,通过 safe signal summary、diagnostic context 和 event material 承接。
- `L4-archive`: archive package / recovery truth 来源,通过 report handoff、archive eligibility 和 handoff feedback 承接。
- `L0-sdk`、`L5-console`、dashboard、alert、external audit / GRC: 下游只读消费或导出目标,通过 API / SDK / adapter / export preparation / fake 承接。
- OTel、Prometheus、Grafana、TimescaleDB、object store、search、alert sink: 产品中立候选,只能进入 adapter、config、ops 或测试 fake 设计,不是本仓 truth source。

## 4. 当前文档问题诊断

| 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03_ddd_step_03_constraints.md` | 只有 81 行,把 log / metric / trace / audit schema 摘要写成 Step 03,缺少编码规范、runtime、提交、仓库和依赖裁剪表 | 全量替换为当前 Step 03 产物 |
| 旧 Step 03 门禁 | 使用旧自动顺推门禁,不符合用户要求的逐 Step 停审 | 改为 `wait_user_confirmation_before_step_04` |
| 旧 README / 旧正式 `03` | 混入 TimescaleDB、Grafana、P95、147 events、hash chain、冷存天数和产品栈假设 | 作为 historical material,不进入当前正式约束 |
| 当前正式 `02` | 已确认 `L0-core` 唯一编译期依赖,但没有固定 package / lib / path dependency 现实基线 | 本步核实 `core-contracts` 并写入默认 path dependency |
| 本地 sibling repo | 多个相邻仓存在,容易被误写成 path dependency | 本步明确只有 `L0-core` 可进入 Cargo dependency |
| 目标实现仓 | `/home/aris/Projects/quantalithos-observability` 当前未发现 | 不阻塞 design;后续 Step 17 / `07` 作为实施前置 gate |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Step 03 主语 | schema 摘要和观测主线说明 | 编码规范、语言 / runtime、仓库、提交和依赖裁剪约束 | 对齐 SOP Step 03 和书写规范 5.3 |
| 源码语言 | 未区分中文设计与英文源码 | 明确正文中文、Rust code block / 源码注释 / rustdoc / 测试名英文 | 避免后续 Step 可转写性冲突 |
| rustdoc 要求 | 未明确 public enum variant 注释 | 明确 public API rustdoc 和 enum variant 注释不可省略 | 支撑 Step 06~08 可落码契约 |
| 编译期依赖 | 只知道 `L0-core` 语义约束 | 固定到 `core-contracts` package / lib / path dependency 默认写法 | 防止 Step 04 / 07 凭空发明依赖 |
| runtime / event 依赖 | 可能因本地存在被误当源码依赖 | 全部转为 adapter、event、projection、handoff、API 或 fake | 保持依赖裁剪和 truth 边界 |
| 提交纪律 | 未进入 `03` Step 03 | 记录实施前必须读提交规范和检查 git identity;本轮不提交 | 给 Step 17 / `07` 承接 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 把所有本地存在的 sibling repo 都写成 Cargo path dependency | 类型复用直接 | 破坏全局依赖裁剪,让相邻 truth 反向塑造 Observability | 不采用 |
| B. 只允许 `L0-core` 进入编译期依赖,其他通过 runtime / event / handoff / fake 协作 | 与 `00/01/02` 和全局依赖规则一致 | 后续 Step 07 / 08 / 14 需要补足 adapter 和 DTO mapping | 采用 |
| C. 当前连 `L0-core` 也不固定 | 避免过早绑定 | shared id、safe ref、metadata、correlation、error、safety marker 无法稳定落码 | 不采用 |
| D. 在 Step 03 锁定 OTel / Prometheus / Grafana / TimescaleDB / object store 等产品 | 看起来便于实现 | 产品会反向定义 truth、配置和测试,越过当前 Step 职责 | 不采用 |
| E. 将目标仓不存在视为上游 blocker | 能避免实施误开工 | design 文档仍可继续;目标仓路径应在实施计划前置 gate 闭口 | 不采用 |

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码标识符、注释、rustdoc、错误说明和测试名默认英文;公开 API 必须有 rustdoc;public enum variant 必须注释 | Step 06~08 的 Rust 契约 code block 使用英文 doc comment,并逐 variant 写明语义 |
| `standards/document/详细设计书写规范.md` | 详细设计必须能 1:1 转为代码文件、类型、函数、schema、测试和实现检查项 | Step 04~17 必须按实现单元、对象、trait、protocol、flow、state、persistence、error、idempotency 和 test cut 展开 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓默认 `/home/aris/Projects/quantalithos-observability`;仓内目录用短 role;不得把 `L4` 或 `quantalithos` 前缀带入默认内部 crate 名 | Step 04 文件布局必须基于 `quantalithos-observability` 和规范 role 名收口 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写入 Cargo dependency;运行期 / 事件协作依赖不得写成本地 path dependency | Step 07 / 08 / 14 必须通过 port、event、adapter、projection、handoff 或 fake 承接非 core 关系 |
| `standards/document/设计真相源闭环与可落码性标准.md` | ref、reason、DTO、state、metadata、idempotency、event、job、query view、projection 和 phase boundary 必须闭环 | Step 06~17 若发现缺字段 / 状态 / port / boundary,必须回写设计,不得交给实现者私补 |
| `projects/README.md` §8.2 与 `实施计划书写规范.md` 4.9 | design 仓中文 commit;实现仓英文 commit;AI footer 固定;提交前检查项目级 git config | Step 17 / `07` 需要把提交规范、git identity 和 implementation ledger 写入实施前阅读 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 语言固定为 Rust | 目标实现仓使用 Rust;edition / rust-version 在目标 Cargo workspace 创建或核实时正式落盘 | 全部实现单元 |
| 源码英文,正文中文 | 设计说明中文;Rust code block、源码注释、rustdoc、错误说明和测试名英文 | Step 06 object;Step 07 trait;Step 08 protocol;Step 16 tests |
| 运行形态分离 | 同步 command / query、异步 consumer、后台 jobs、只读 handoff / export preparation 分开表达 | entry、consumer、jobs、application flow、ports |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` 可进入 Cargo dependency,默认引用 `core-contracts` | contracts、domain、application、infra |
| Runtime / event 依赖隔离 | `L0-bus`、`L1-*`、`L2-runtime`、`L4-sandbox`、`L4-archive`、SDK、Console 和外部产品不得成为 Cargo dependency | Step 07 ports;Step 08 consumers / events;Step 14 external binding |
| forbidden body 永不入仓 | 原始正文、secret、provider body、source audit body、evidence body、artifact body、identity body、runtime body 和 archive package body 不得出现在持久化模型中 | intake、audit projection、evidence linkage、read model、handoff、persistence |
| no-write 边界不可突破 | query、diagnostic、projection rebuild、replay、handoff、export、retention scan 和 job 不反写 source truth | protocol、flow、transaction、job、test cut |
| 配置不可改写边界 | 配置只能影响参数和 adapter binding,不能改变 truth ownership、redaction、body-free、同步 / 异步 / 后台分工、no-write 或依赖类型 | state matrix、config binding、external adapter |
| 产品中立 | OTel / metrics / trace / dashboard / alert / GRC 等只能作为 adapter / config 候选,不是 truth source | infra adapter、external binding、tests |
| 目标实现仓缺失后移 | `/home/aris/Projects/quantalithos-observability` 当前未发现 | Step 17 / `07` 实施前置 gate |

### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | shared id、safe ref、correlation、metadata、error、safety marker、typed ref |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不允许 Cargo path dependency | event envelope / consumer / publisher adapter | tap / audit material consumer、outbox publish、replay coordination |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | 不允许 Cargo path dependency | runtime adapter / audit material / safe ref | audit projection、report handoff、gap context |
| `quantalithos-artifact` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | evidence reference adapter / handoff material | body-free evidence linkage、evidence index input |
| `quantalithos-identity` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-identity` | 不允许 Cargo path dependency | actor / subject reference adapter | actor safe ref、subject visibility、audit context |
| `quantalithos-runtime` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | runtime signal adapter / event material | safe signal、diagnostic summary、degraded output |
| `quantalithos-sandbox` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | sandbox signal adapter / event material | sandbox observation ref、diagnostic scope |
| `quantalithos-archive` | 运行期 / handoff 依赖 | 当前未发现 | 不允许 Cargo path dependency | archive handoff adapter / feedback event | retention marker、archive eligibility、report handoff feedback |
| `quantalithos-sdk` / `quantalithos-console` | 下游消费 / runtime API | SDK 已发现;Console 当前未发现 | 不允许 Cargo path dependency | SDK / API contract consumer | read query、diagnostic、dashboard / admin consumption |
| OTel / Prometheus / Grafana / TimescaleDB / object store / search / alert / GRC | 外部产品运行期依赖 | 不适用 | 不允许 Cargo dependency 作为 truth source | adapter config / product binding / fake | metrics / trace / log export、dashboard、alert、external audit export |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读本文件 §7 的三张结构化表,了解 Rust 编码、注释、提交、仓库和本地多仓依赖约束如何收敛。

## 3. 实现约束与编码规范承接

`L4-observability` 目标实现仓使用 Rust。设计正文使用中文说明,但 Rust 源码和设计中的 Rust code block 必须使用英文标识符、英文普通注释、英文 rustdoc、英文错误说明和英文测试名。公开 struct、enum、trait、function、field 和 public enum variant 必须有 rustdoc;带载荷 variant 必须说明载荷语义。

当前唯一允许的编译期 sibling 依赖是 `L0-core`,默认通过 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 引用共享 id、safe ref、correlation、metadata、error 和 safety marker 语义。`L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime`、`L4-sandbox`、`L4-archive`、SDK、Console 和外部观测 / 审计产品只能通过 port、adapter、event、projection、handoff、API 或 fake 协作,不得写成 Cargo path dependency。

配置、产品适配和运行参数不能改写 truth ownership、redaction-first、body-free evidence linkage、query no-write、consumer non-truth-write、job no-source-repair、同步 / 异步 / 后台分工或依赖类型。目标实现仓 `/home/aris/Projects/quantalithos-observability` 当前未发现,不阻塞详细设计,但必须进入 Step 17 和 `07-实施计划.md` 的实施前置 gate。

## 9. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 04 |
|---|---|---|
| 目标实现仓当前未发现 | 后移到 Step 17 / `07` 实施前置 gate;Step 04 仍可按规范定义目标布局 | 否 |
| workspace 多 crate 还是 single crate 模块分层 | Step 04 正式决策 | 否 |
| 目标仓 Rust edition / rust-version | 创建或核实目标 Cargo workspace 时落盘;不得把 core 现实基线直接伪造成目标仓事实 | 否 |
| OTel / metrics / trace / dashboard / alert / storage 产品选型 | 留给 Step 14、`04`、ADR 或 `07`;本步只保留产品中立 adapter 边界 | 否 |
| implementation ledger 与 planned boundary skeleton | 只能在重新完成 `07-实施计划.md` 时创建 | 否 |

## 10. 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 是否回答 SOP Step 03 的语言、runtime、编码、注释、提交、仓库和依赖问题 | pass |
| 是否输出编码规范承接表、实现约束表和本地多仓依赖约束表 | pass |
| 是否点名 Rust 编码规范来源和 rustdoc / enum variant 注释要求 | pass |
| 是否只把 `L0-core` 写成编译期 path dependency | pass |
| 是否把 runtime / event / handoff / export 关系排除出 Cargo dependency | pass |
| 是否把旧 Step 03 和旧产品 / 性能 / hash chain 线索降级为 historical material | pass |
| 是否保持正式 `03-详细设计.md` 到 Step 19 才装配 | pass |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_04 |
