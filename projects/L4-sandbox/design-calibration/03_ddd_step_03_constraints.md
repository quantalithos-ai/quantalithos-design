# Step 3. 收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
> 回填章节: `03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 收稳会影响后续文件布局、模块契约、对象契约、port / adapter、协议和测试切口的语言、编码、仓库、依赖和安全边界约束。本步不决定 crate / module / file layout,不锁定 Docker / gVisor / Firecracker / k8s / DB / message bus / observability 产品,不创建实现代码。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 3 | 是。Step 2 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 3 | 是。`project_execution_ledger.md` 已将恢复点停在 `03-详细设计.md` Step 2,用户确认后允许进入 Step 3。 |
| 文档级 flow 是否允许进入 Step 3 | 是。`03_ddd_calibration_flow.md` 已记录 Step 2 `pass_wait_review`,进入 Step 3 的门禁已满足。 |
| 是否已读取 Step 2 中间产物 | 是。Step 2 已明确本轮详细设计覆盖范围、非范围和实现者可完成代码范围。 |
| 是否已读取详细设计 SOP Step 3 | 是。Step 3 只收稳语言、runtime、编码、仓库、提交、依赖和安全边界约束。 |
| 是否已读取 Rust / 目录 / 依赖标准 | 是。已读取 `standards/coding/rust.md`、`子项目目录与代码文件组织规范.md` 和 `全局项目依赖关系与裁剪规则.md`。 |
| 是否发现阻塞 Step 3 的上游 blocker | 否。旧 README / 旧 `03` 的 Docker/gVisor、旧目录和旧 bridge 线索已作为 historical material 隔离;目标实现仓暂未发现属于实施前置检查,不阻塞设计。 |

---

## 2. 本步目标

本步要把后续 `03` 的工程前提收稳,防止 Step 4 以后在写对象、接口、状态和事务时临时发明技术约束。

本步要收稳:

- Rust 语言、源码语言、rustdoc、错误、trait、async、测试和注释约束。
- 目标实现仓默认路径、目标仓是否已存在、当前可确认的 sibling repo 状态。
- `L0-core` 作为唯一编译期依赖的 Cargo path dependency 口径。
- 运行期依赖、事件协作依赖、基础设施依赖和材料交接依赖不得写成 Cargo dependency 的口径。
- 实施前必须阅读的提交规范、git config 用户要求和后续 `07` 承接事项。
- sandbox 不应实现的安全、鉴权、网关、policy、artifact、observability、runtime、member-service 和 backend 产品边界。

本步不处理:

- workspace 多 crate 与单 crate 模块分层的最终选择。
- crate / package / module / file / binary 命名。
- DTO、event envelope、job report、port trait、repository trait、adapter 签名。
- 数据库、对象存储、message bus、isolation backend、observability、secret、GRC 或 deployment 产品选型。
- phase / commit boundary、实现排期、真实 evidence、run_id 或验收签署。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 已完成且用户确认继续 | 提供本轮 `03` 覆盖范围、非范围和实现者可完成代码范围。 |
| `standards/coding/rust.md` | 已读取 | 提供 Rust 源码英文、命名、注释、rustdoc 和公开 API 文档约束。 |
| `standards/document/详细设计书写规范.md` | 已读取 | 提供正式 §3 的表格格式、Rustdoc 写法和本地多仓依赖约束。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供实现仓路径、workspace / single crate、package / crate / binary 和文件命名规则。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供编译期 / 运行期 / 事件协作依赖分类和 Cargo path dependency 裁剪规则。 |
| `projects/README.md` §8.2 | 已读取 | 提供设计仓 commit message、实现仓 commit message、body 和 `Co-Authored-By` footer 约束。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供运行隔离主轴、非职责、依赖、NFR 和验收红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供 `L0-core` 唯一编译期依赖、运行期 / 事件协作裁剪、安全红线和技术产品挂起项。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前直接上游 | 提供 4 个运行单元、6 个主要组成部分、接口骨架、配置影响和详细设计承接清单。 |
| `projects/L4-sandbox/README.md` | historical_material | 只用于识别旧 Docker/gVisor、旧目录和旧指标污染风险。 |
| `projects/L4-sandbox/03-详细设计.md` | historical_material | 只用于识别旧目录树、旧 bridge、旧 evidence / replay / audit 混层风险。 |
| `/home/aris/Projects` sibling repo 检查 | 已执行 | 确认已存在 / 未发现的实现仓,避免把不存在仓写成默认 path dependency。 |
| `/home/aris/Projects/quantalithos-core/Cargo.toml` 与 `crates/contracts/Cargo.toml` | 已读取 | 确认 `core-contracts` package、`core_contracts` lib、path、edition / rust-version 的现实基线。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`03` flow、Step 2、详细设计 SOP Step 3 和相关标准。 | done | 确认当前允许进入 Step 3。 |
| 2 | 从正式 `00/01/02` 提取语言、runtime、依赖、安全和配置不可越界约束。 | done | 形成工程约束候选池。 |
| 3 | 检查 `/home/aris/Projects` sibling repo 和 `quantalithos-core` crate 现实布局。 | done | 确认 `core-contracts` path dependency 与目标实现仓暂未发现。 |
| 4 | 回答 SOP Step 3 十个问题。 | done | 明确编译期 / 运行期 / 事件协作、提交规范、rustdoc 和安全边界。 |
| 5 | 输出编码规范承接表、实现约束表、本地多仓依赖约束表和前置检查表。 | done | 满足正式 §3 回填输入要求。 |
| 6 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 3 审查点,不跨到 Step 4。 |
| 7 | 自检未修改正式 `03-详细设计.md`,未创建实现代码或提交 commit。 | done | 进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 本仓使用什么语言、runtime、框架和主要依赖?

`L4-sandbox` 目标实现语言确定为 Rust。当前详细设计只收稳语言、运行形态和依赖裁剪,不提前锁定具体 Web framework、数据库、消息后端、对象存储、observability、secret、GRC、scheduler 或 isolation backend 产品。

本轮确认的代码形态约束如下:

- 语言:
  Rust。
- 目标实现仓默认路径:
  `/home/aris/Projects/quantalithos-sandbox`。
- 当前目标仓状态:
  本次检查未在 `/home/aris/Projects` 下发现 `quantalithos-sandbox`;这不阻塞设计,但必须进入 Step 17 / `07-实施计划.md` 的实施前置检查。
- 运行形态:
  `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit` 四类运行单元并存。
- 工程形态:
  workspace 多 crate 与单 crate 模块分层的最终选择留到 Step 4。鉴于本仓存在公共契约、多个运行入口、infra / backend 接缝和下游消费方,Step 4 需要重点评估 workspace 多 crate。
- 已确认的编译期 sibling 依赖:
  只有 `L0-core`。
- 已确认的默认共享契约 crate:
  `core-contracts` package / `core_contracts` lib,路径为 `/home/aris/Projects/quantalithos-core/crates/contracts`。
- 尚不锁定的内容:
  HTTP / RPC framework、DB、message bus、outbox 产品、object store、audit store、OTel、secret backend、Docker / gVisor / Firecracker / k8s / local_process 组合、seccomp / AppArmor / cap-drop profile、SLO / timeout / retry / lease / retention 数字。

`quantalithos-core` 当前 workspace 使用 Rust 2024 和 rust-version `1.93`,这是已存在 sibling 的现实基线。由于 `quantalithos-sandbox` 目标实现仓尚未发现,本 Step 不把 edition / rust-version 写成本仓已落盘事实;Step 4 / Step 17 / `07` 必须在目标仓创建或确认后正式落盘。

### 5.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

后续 Step 4~17 必须按 `standards/coding/rust.md` 和详细设计书写规范展开 Rust-facing 契约:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文,不得使用拼音或架构层级前缀。
- 实现仓 Rust 源码中的普通注释、rustdoc 文档注释和错误说明注释必须使用英文。
- public struct、enum、enum variant、trait、type alias、field 和 function 必须有 rustdoc。
- enum 本身必须说明分类边界;每个 variant 必须说明业务语义;带载荷 variant 必须说明载荷语义。
- 错误模型必须以正式 typed error surface 表达,不得退化为泛化 string error。
- Step 7 定义 repository / port / adapter / backend trait 时必须明确 async 语义、错误返回和取消 / timeout / unsupported 口径;是否使用具体 async 宏或运行时机制留给实现仓和 Step 7 / Step 14 决策。
- Step 16 的测试名必须使用英文,并能回指 interface、state matrix、failure branch、redline 或 gate。
- 设计中的 Rust code block 应尽量可转写,不得包含未解释占位类型、中文源码注释或与依赖裁剪冲突的外部类型。

### 5.3 是否必须遵守 rustdoc 风格注释? struct、字段、enum、enum variant、函数分别如何注释?

必须遵守,并且要处理好“详细设计正文中文”和“真实源码英文”的边界。

`详细设计书写规范.md` 要求对象、字段、enum、enum variant、trait 和公开函数使用 Rustdoc 风格中文注释;`standards/coding/rust.md` 明确实际实现仓 Rust 源码必须默认使用英文注释。为保证设计契约可直接转写到源码,本轮采用以下规则:

- 设计正文、表格说明、流程解释和诊断材料使用中文。
- Rust code block 中的 rustdoc 使用英文。
- crate / module 顶部说明使用 `//!`。
- public struct / enum / trait / type alias 使用 `///` 单句摘要,必要时补充行为边界。
- public 字段使用 `///` 说明字段来源、含义、边界和不得承载的外部正文。
- enum variant 使用 `///` 说明业务语义和使用场景;带载荷 variant 说明载荷承载什么错误、数据或上下文。
- public factory / transition / service function 使用 `///` 说明行为、输入语义、错误语义和副作用。

### 5.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

实施者开始前必须阅读:

- `standards/coding/rust.md`
- `standards/document/子项目目录与代码文件组织规范.md`
- `projects/README.md` §8.2
- 后续正式 `07-实施计划.md` 的实现前阅读矩阵、提交规范章节和 boundary skeleton

当前已确认的提交与 git 身份约束:

- 设计仓 commit:
  `type(scope): 中文 subject`。
- 实现仓 commit:
  默认使用英文 subject / body;若目标仓或 `07` 定义更严格规范,以更严格者为准。
- 非微小提交:
  必须写 body,说明本次边界闭合内容、关键文件和改动目的。
- 固定 footer:
  `Co-Authored-By: Codex <noreply@openai.com>`。
- 当前设计仓 git config 检查结果:
  `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com`。
- 当前 Step 不提交 commit;未来若用户要求提交,必须先检查工作树并避免混入无关文件。

### 5.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

`L4-sandbox` 不应实现以下边界:

- 全局身份认证、credential、GlobalMember 生命周期、role / capability identity truth。
- API gateway、workspace UI / console / operator UI、Runner 产品体验或 CLI / dashboard 状态。
- `L2-tools` 的 ToolDefinition、ToolPolicy、ToolInvocationRequest / Result、工具语义执行和工具审计正文。
- `L2-runtime` 的 ExecutionInstance、agent loop、checkpoint / recover、runtime result backflow truth。
- `L2-member-service` 的 MemberExecutionHost、session、worker、health、SandboxBinding 装配 truth 和 member lifecycle orchestration。
- governance / capability / tools policy definition、approval、allowlist、capability truth、policy DSL。
- `L1-artifact` 的 formal Artifact、baseline、formal evidence、retention 和 archive truth。
- `L4-observability` 的 telemetry / metric / trace / audit store、retention、alert stream 和 query truth。
- isolation backend 产品生命周期、host / cluster / k8s / node pool lifecycle、backend product config truth。
- investigation lifecycle、operator remediation workflow、正式事故流程和 UI 控制面。

本仓只能通过以下正式边界消费或输出外部语义:

- `ActorContext` / `SystemActorContext`
- `CommandMetadata` / `QueryMetadata`
- typed ref、safe summary、snapshot、marker
- event envelope、source event id、dedup key、trace context
- port / adapter、handoff material、receipt、status summary
- fake adapter / contract test seam

### 5.6 本仓是否依赖已经实现的 Quantalithos 仓库?

是,但依赖必须按类型裁剪。

本次 `/home/aris/Projects` 检查结果:

- 已存在:
  `quantalithos-core`、`quantalithos-bus`、`quantalithos-sdk`、`quantalithos-conversation`、`quantalithos-work`、`quantalithos-process`、`quantalithos-governance`、`quantalithos-method-library`、`quantalithos-identity`。
- 当前未发现:
  `quantalithos-sandbox`、`quantalithos-tools`、`quantalithos-runtime`、`quantalithos-member-service`、`quantalithos-artifact`、`quantalithos-observability`、`quantalithos-runner`。

从正式 `00/01/02` 看,只有 `L0-core` 可进入编译期依赖讨论。其他已存在或未发现的仓,即使未来存在 sibling repo,也只能作为运行期、事件协作、refs、snapshot、safe summary、handoff、adapter 或测试 fake 参与。

### 5.7 这些依赖中哪些是已确认的编译期依赖?

只有 `L0-core`。

当前已核实的共享契约 crate:

- package:
  `core-contracts`
- lib crate:
  `core_contracts`
- 本地路径:
  `/home/aris/Projects/quantalithos-core/crates/contracts`

当前不把 `core-domain`、`core-application`、`core-infra`、`core-jobs`、`core-cli` 写成 `L4-sandbox` 的默认业务依赖。除非后续 Step 7 / Step 14 证明必须引用并回写设计真相源,否则不得预支。

### 5.8 依赖仓库在 `/home/aris/Projects` 下是否存在?

已确认 `/home/aris/Projects/quantalithos-core` 存在,且 `core-contracts` 的真实 Cargo 布局存在。

目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现。这意味着:

- 设计可以继续。
- Step 4 可以继续定义目标仓布局。
- Step 17 / `07-实施计划.md` 必须把“创建或确认目标实现仓路径”记录为实施前置检查。
- 不能把 `quantalithos-sandbox` 的 edition、rust-version、Cargo members 或 crate 名写成已落盘事实。

### 5.9 对已确认的编译期依赖,当前是否采用本地 path dependency? 中期是否记录 private git tag / rev 方案?

是。当前默认采用 sibling repo 本地 path dependency。

针对 `core-contracts` 的默认写法是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

中期切换到 private git tag / rev 是允许的,但必须在后续 `07-实施计划.md` 或目标实现仓 README 中记录:

- 切换时机。
- tag / rev 固定方式。
- 回滚口径。
- 本地多仓开发与 CI / release 环境的差异处理。

本轮明确不把 public crates.io 发布作为实现前置条件。

### 5.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

以下关系不能写成 `L4-sandbox` 的 Cargo path dependency:

- `L0-bus`:
  事件协作主干,用于发布 / 消费 sandbox 状态、失败、控制、cleanup、redline 和材料交接信号;bus 不承载 sandbox truth。
- `L1-identity`、`L1-work`:
  运行期 refs、safe summary、identity / work anchor 和 responsibility context;正文不入仓。
- `L1-governance`、`L3-capability-hub`、`L2-tools` policy sources:
  policy / authorization / approval / capability summary 来源;policy truth 外部拥有。
- `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`:
  调用方 / 消费方 / 编排方;不得把工具语义、runtime loop、member lifecycle 或 runner product truth 编译进 sandbox。
- `L1-artifact`、`L4-observability`、安全交接 / investigation 边界:
  material / observability / investigation handoff 或 status summary;下游 truth 外部拥有。
- container / k8s / Docker / gVisor / Firecracker / local process / host / cluster / storage / OTel / secrets / GRC:
  运行期基础设施或产品候选;不得作为业务语义依赖进入 core path dependency。
- `L0-sdk`、`L5-console`、`L5-chat`、`L5-sync`、`L4-archive`:
  下游访问包装、产品消费或后续协作线索;当前不进入核心依赖主链。

这些关系在后续 Step 7 / Step 8 / Step 14 中只能通过 port、adapter、event、consumer、projection、handoff、safe summary、fake adapter 或 contract test seam 表达。

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `README.md` | 把 Rust、Docker + gVisor、旧目录树、backends、audit、seccomp / AppArmor、旧性能数字写成仓级事实。 | 本步只确认 Rust 语言;后端产品、profile、目录和指标全部作为 historical material,不进入 Step 3 结论。 |
| 旧 `03-详细设计.md` | 旧目录树混入 command / tool / provider bridge、artifact / observability / operators、stdout / audit evidence、replay / cleanup 旧主线。 | 本步仅把旧材料记录为污染风险;新版约束从正式 `00/01/02` 与标准重建。 |
| 正式 `01-架构设计.md` | 已确认 `L0-core` 唯一编译期依赖,但尚未落到真实 Cargo path。 | 本步核实 `core-contracts` package / lib / path dependency 默认写法。 |
| 正式 `02-概要设计.md` | 已说明文件布局后移,接口骨架不得形成编译期 sibling 依赖。 | 本步把该口径收敛为 Step 4~14 的实现约束。 |
| `详细设计书写规范.md` 与 `standards/coding/rust.md` | 前者示例为中文 Rustdoc,后者要求真实 Rust 源码英文注释。 | 本步明确设计正文中文,但 Rust code block 的 rustdoc 使用英文。 |
| `/home/aris/Projects/quantalithos-sandbox` | 当前未发现目标实现仓。 | 不阻塞设计;进入 Step 17 / `07` 的实施前置检查,不得伪造成已存在。 |
| sibling repo 状态 | 多个相邻仓已存在,容易被误写成 Cargo dependency。 | 本步明确只有 `quantalithos-core` / `core-contracts` 可以作为 path dependency;其他均为运行期 / 事件 / handoff / fake。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言与 runtime | 只知道后续要写 Rust 契约和 4 类运行单元。 | 明确语言为 Rust,运行形态承接 sync entry / async consumer / controlled fulfillment / maintenance jobs。 | 为 Step 4~8 提供统一前提。 |
| 编译期依赖 | 只有语义上的 `L0-core` 唯一依赖。 | 固定到 `core-contracts` package / `core_contracts` lib / path dependency 默认写法。 | 防止 Step 4 凭空发明依赖。 |
| 目标实现仓 | 尚未显式确认是否存在。 | 记录 `/home/aris/Projects/quantalithos-sandbox` 当前未发现,后移 `07` 前置检查。 | 不伪造实现仓状态。 |
| 注释语言 | 详细设计中文 Rustdoc 示例与源码英文规则存在潜在冲突。 | 明确正文中文,Rust code block 注释英文。 | 让设计契约可直接转写。 |
| 后端产品 | 旧 README 暗示 Docker + gVisor 至少两后端。 | 当前只保留抽象 isolation backend 和 capability summary;产品组合后移 ADR / `04/07/05`。 | 防止旧技术方案反向定义边界。 |
| 相邻仓关系 | 运行期 / 事件 / handoff 边界分散在 `00/01/02`。 | 明确不得进入 Cargo path dependency。 | 保护全局依赖裁剪。 |
| 提交规范 | 未在 `03` 中间产物承接。 | 明确实施前阅读、git config 检查和当前不提交。 | 为 Step 17 / `07` 提供前置输入。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 继承旧 README 的 Docker + gVisor / seccomp / AppArmor / 性能数字 | 看起来工程方案具体。 | 会把 historical material 写成当前事实,并绕过正式 `01` 的“抽象 isolation backend”口径。 | 不采用。 |
| B. 只固定 Rust + 抽象 isolation backend + `core-contracts` 编译期依赖 | 符合正式 `00/01/02` 和依赖裁剪,给 Step 4~14 留出可落码但不越级的空间。 | 后续 Step 7 / Step 14 / `04/07` 需要继续闭合 adapter 和配置。 | 采用。 |
| C. 把 `L0-bus`、identity、work、tools、runtime、member-service、artifact、observability 全部作为 Rust path dependency | 类型复用方便。 | 破坏 L4 基础设施边界,把外部 truth 和循环依赖带入 sandbox。 | 不采用。 |
| D. 当前不指定任何 Cargo dependency | 可以避免过早绑定。 | Actor / trace / metadata / typed ref / error 等共享契约无法稳定落码。 | 不采用。 |
| E. 把 public crates.io 发布作为依赖前置 | 长期版本治理清晰。 | 当前本地多仓开发会被无谓阻塞。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码使用英文标识符、英文注释和英文 rustdoc;public API 必须有 rustdoc;enum variant 必须注释 | Step 6~8 的 Rust 契约 code block 使用英文 doc comment,字段 / variant / function 不省略注释 |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码;对象、trait、protocol、flow、state、persistence、error、idempotency 和 test cut 必须闭环 | 本轮 Step 4~17 全部按实现契约组织,不写泛化工程口号 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录为 `/home/aris/Projects/quantalithos-<project>`;workspace member 使用 `crates/<role>`;package / crate / binary 遵守命名规则 | Step 4 文件布局必须使用 `quantalithos-sandbox`,且不得把 `L4` 或 `quantalithos` 前缀带入内部 crate / module |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写 Cargo path dependency;运行期 / 事件协作不得写成 package dependency | `core-contracts` 是唯一当前 path dependency;其他关系进入 port / adapter / event / handoff |
| `standards/document/设计真相源闭环与可落码性标准.md` | metadata、idempotency、projection rebuild、artifact materialization、event、job 和 phase boundary 必须闭环 | Step 6~17 发现字段 / DTO / 状态 / receipt / job 缺口时必须回设计闭口,不得交给实现侧私补 |
| `projects/README.md` §8.2 | design 仓中文 commit;实现仓英文 commit;footer 固定;非微小提交必须写 body | Step 17 和 `07` 需要回填实现前置阅读和 commit boundary 审计输入 |

### 9.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 语言 | 目标实现使用 Rust;edition / rust-version 待目标仓创建或确认后落盘 | Step 4 文件布局;所有 crate / module |
| 源码英文 | Rust 标识符、注释、rustdoc、测试名默认英文;设计正文中文 | Step 6 对象契约;Step 8 DTO / event;Step 16 测试切口 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` / `core-contracts` 可进入 Cargo dependency | contracts / domain / application / infra 中需要 core shared contracts 的部分 |
| 运行期 / 事件依赖隔离 | `L0-bus`、identity、work、policy sources、tools、runtime、member-service、runner、artifact、observability、backend 等不得成为 Cargo dependency | Step 7 port / adapter;Step 8 event / consumer;Step 14 external binding |
| 抽象 isolation backend | 后端产品只通过 backend capability、launch request、boundary establishment 和 lifecycle handle 接缝进入 | boundary、carrier、cleanup、reaper、config binding |
| policy fail-closed 不可越界 | policy 缺失、冲突、不支持、不可解析或未授权不得继续执行 | policy command、high-risk decision、run start、failure mapping |
| 外部正文禁止入仓 | identity / work / tool / runtime / artifact / observability / policy / investigation 正文不得保存为 sandbox truth | object fields、persistence、query view、projection |
| capture / handoff 分层 | captured output、candidate material、observability material 和 downstream ack 不得静默升级为 formal truth | capture service、handoff port、cleanup guard、event relay |
| query / projection no-write | Query、inspect、preview、trend、projection rebuild、reconciliation 不反写 core truth | read service、derived maintenance job、reconciliation job |
| cleanup / redline 保守收束 | cleanup / reaper 不得先删材料;redline 不得 advisory-only 或脱管运行 | cleanup job、lease repository、redline containment service |
| 配置不得改写依赖裁剪 | config 只能影响承载、节奏、接缝 enablement 和 degraded surface,不能把 sibling repo 或 backend SDK 变成 core compile dependency | Step 14 config external binding;future `04` |
| 当前不提交 | 本 Step 只改设计仓文档,不生成实现 commit、run_id、evidence 或验收签署 | Step 17 / `07`;当前工作流 |

### 9.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、infra 中需要 actor / trace / metadata / typed ref / error / shared contract 的部分 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不允许 Cargo path dependency | event publisher / subscriber adapter | outbound event、inbound consumer、outbox relay |
| `quantalithos-identity` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-identity` | 不允许 Cargo path dependency | identity summary / actor anchor adapter | execution environment identity、responsibility chain |
| `quantalithos-work` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-work` | 不允许 Cargo path dependency | work context summary adapter | context reference resolution、caller summary |
| `quantalithos-governance` / `quantalithos-method-library` / policy sources | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance`;`/home/aris/Projects/quantalithos-method-library` | 不允许 Cargo path dependency | policy / capability / approval summary adapter | policy applicability、high-risk action decision |
| `quantalithos-tools` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | tool request / result boundary adapter | controlled execution request and feedback |
| `quantalithos-runtime` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | runtime request / control / feedback adapter | run start、failure / control material |
| `quantalithos-member-service` | 运行期 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | member host sandbox binding adapter | host-bound execution and control material |
| `quantalithos-artifact` | 材料交接 / 运行期依赖 | 当前未发现 | 不允许 Cargo path dependency | material handoff adapter | candidate material / artifact handoff |
| `quantalithos-observability` | 材料交接 / 事件协作依赖 | 当前未发现 | 不允许 Cargo path dependency | observability material handoff adapter | audit / trace / metric / usage material |
| `quantalithos-runner` | 运行期消费依赖 | 当前未发现 | 不允许 Cargo path dependency | runner request / result adapter | runner app controlled execution |
| Docker / gVisor / Firecracker / k8s / host backend | 运行期 / 基础设施依赖 | 不适用 | 不允许作为业务 Cargo path dependency | backend adapter / profile binding | boundary establishment、carrier run、cleanup / reaper |

### 9.4 实施前置阅读与检查表

| 前置项 | 当前结论 | 后续承接 |
|---|---|---|
| Rust 编码规范 | 已确认必须阅读 `standards/coding/rust.md` | Step 17 / `07` 实现前阅读矩阵 |
| 子项目目录规范 | 已确认必须阅读 `子项目目录与代码文件组织规范.md` | Step 4 文件布局和 `07` boundary skeleton |
| 提交规范 | 已读取 `projects/README.md` §8.2 | Step 17 / `07` commit boundary 审计输入 |
| git config | 当前设计仓为 `quantalithos-labs <quantalithos.ai@gmail.com>` | 若未来提交,提交前复核 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | Step 17 / `07` PH-01 前置检查 |
| core path dependency | `core-contracts` path 已确认 | Step 4 Cargo dependency 位置和 Step 7 / Step 14 使用范围 |

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“待确认事项”小节,了解 Rust 编码、注释、提交和本地多仓依赖约束如何收敛。

## 3. 实现约束与编码规范承接

本仓目标实现使用 Rust。源码标识符、注释、rustdoc 和测试名默认使用英文;详细设计正文使用中文说明。当前唯一允许的编译期 sibling 依赖是 `L0-core`,默认通过 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 `core-contracts` path dependency 引用共享契约。其他 Quantalithos 仓、policy 来源、isolation backend、artifact / observability / investigation 交接边界只能通过运行期 port、event、snapshot、safe summary、external ref、handoff、API、backend adapter 或测试 fake 协作,不得写成 Cargo dependency。

### 3.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码使用英文标识符和英文注释;public API 必须有 rustdoc;enum variant 必须注释 | Rust 契约 code block 使用英文 doc comment |
| `standards/document/详细设计书写规范.md` | 详细设计必须可 1:1 落码 | Step 4~17 按实现契约组织 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录、workspace member、package、crate 和 binary 命名规则 | Step 4 文件布局使用 `quantalithos-sandbox` 和短 role 目录 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写 Cargo path dependency | 只有 `core-contracts` 进入当前 path dependency |
| `projects/README.md` §8.2 | design 仓中文 commit;实现仓英文 commit;footer 固定 | Step 17 和实施计划回填实现前置阅读 |

### 3.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 语言 | 目标实现使用 Rust;edition / rust-version 待目标仓创建或确认后落盘 | 所有 crate / module |
| 源码英文 | Rust 标识符、注释、rustdoc、测试名默认英文 | 对象、DTO、event、测试切口 |
| 唯一编译期 sibling 依赖 | 只有 `L0-core` / `core-contracts` 可进入 Cargo dependency | contracts / domain / application / infra |
| 运行期 / 事件依赖隔离 | 其他仓、bus、SDK、policy sources、backend 和 handoff target 不得成为 Cargo dependency | port / adapter / event / handoff |
| 抽象 isolation backend | Docker / gVisor / Firecracker / k8s 等只通过 backend adapter 和 capability summary 进入 | boundary、carrier、cleanup、config |
| 外部正文排除 | 不保存相邻仓或外部系统正文 | snapshot / ref / persistence |
| query / projection 不反写 | Query、projection rebuild、inspect / preview / trend、reconciliation 不写 core truth | query / job / transaction |
| policy / cleanup / redline 红线 | fail-closed、cleanup guard 和 redline containment 不得被配置或后端 silent degrade | policy、cleanup、redline、config |

### 3.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、infra |

运行期依赖、事件协作依赖、基础设施依赖、下游消费和 handoff 依赖不得写入 Cargo path dependency。它们在 Step 7 / Step 8 / Step 14 中通过 port、adapter、event、snapshot、safe summary、handoff、backend binding 和 fake 策略定义。

---

## 11. 待确认事项

| 待确认项 | 当前状态 | 是否阻塞 Step 4 | 处理口径 |
|---|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 尚未发现 | open_for_07 | 否 | Step 4 仍可定义目标布局;Step 17 / `07` 必须列为实施前置检查。 |
| workspace 多 crate vs 单 crate 模块分层 | open_for_step_4 | 否 | Step 4 按目录组织规范正式决策。 |
| 本仓 edition / rust-version | open_for_step_4_or_07 | 否 | 不能从 `quantalithos-core` 直接复制为已落盘事实;目标仓创建后确认。 |
| isolation backend 组合和正式 / 测试承载边界 | open_for_step_7_14_and_04_07 | 否 | 当前只固定抽象 backend contract、capability summary 和 no silent degrade。 |
| policy / authorization 来源矩阵与 high-risk action taxonomy | open_for_step_7_8_14 | 否 | 当前固定给定 policy / authorization + fail-closed。 |
| DB / object store / bus / audit store / OTel / secrets / GRC 产品 | open_for_04_07_adr | 否 | 当前只固定承载角色和 ownership boundary。 |

---

## 12. 进入下一步条件

- 已明确 Rust 语言、源码英文、rustdoc 和 enum variant 注释要求。
- 已明确目标实现仓默认路径以及当前未发现的实施前置检查口径。
- 已明确 `L0-core` / `core-contracts` 是唯一当前编译期 sibling 依赖。
- 已明确其他仓、policy sources、backend、artifact、observability、investigation 和产品候选不得进入 Cargo path dependency。
- 已明确提交规范、git config 和 Rust 编码规范需要进入实施前置阅读。
- 已明确旧 README / 旧 `03` 的 Docker/gVisor、旧目录、旧 bridge、旧指标只作为 historical material。
- 用户审查通过后,可以进入 Step 4 “收稳实现单元与文件布局”。
