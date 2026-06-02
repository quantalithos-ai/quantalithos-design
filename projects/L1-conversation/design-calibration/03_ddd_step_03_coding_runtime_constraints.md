# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节: `projects/L1-conversation/03-详细设计.md` §3 实现约束与编码规范承接 / §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 本轮实现范围和非范围 | 确认语言、仓库和依赖约束只服务 P0 Conversation truth center 闭环 |
| `standards/coding/rust.md` | Rust 编码规范、英文源码约束、rustdoc 注释要求 | 作为详细设计对象、trait、错误、测试和注释的实现约束 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖矩阵、依赖类型、单仓裁剪输出格式 | 确认哪些关系可以进入 Cargo dependency |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录、workspace member、Cargo package、crate、binary 命名规则 | 作为 Step 4 文件布局的前置约束 |
| `standards/document/实施计划书写规范.md` | 实现仓 commit message、git user、Co-Authored-By 和源码语言边界 | 作为后续实施承接约束,本步只收稳前置阅读和原则 |
| `01-架构设计.md` §8 | 本仓依赖裁剪、禁止依赖和依赖倒置结论 | 确认 `L0-core` 是唯一编译期依赖 |
| `/home/aris/Projects` 本地目录 | 已存在的 sibling repo | 检查可用本地 path dependency 来源 |

已确认结论:

```text
L1-conversation 实现仓默认位于 `/home/aris/Projects/quantalithos-conversation`。
当前本机尚未发现该实现仓;后续实施时应在该目录创建。
本仓实现语言为 Rust,默认采用 Rust 2024 edition。
源码标识符、模块名、普通注释、rustdoc、测试名和 commit message 默认使用英文。
设计仓中文文档规则不得带入实现代码仓。
当前唯一已确认编译期依赖是 L0-core 的 `core-contracts` crate。
其他仓关系只能通过运行期 port / adapter、事件协作或下游消费边界表达。
```

依赖的前序 Step:

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮实现范围和非范围。
```

---

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖？

本仓实现语言使用 Rust。默认实现形态是 Rust service / worker / job / library 组合,具体 workspace member、binary 和模块布局由 Step 4 收稳。

当前必须提前固定的语言与 runtime 约束:

- Rust edition 使用 `2024`。
- Rust toolchain / rust-version 后续应与已实现的 `L0-core` 保持兼容;当前 `quantalithos-core` workspace 标注 `rust-version = "1.93"`。
- serde / serde_json / thiserror / tracing / async runtime 等常规依赖只能在 Step 4~Step 14 随模块、adapter、worker 和 config 需要逐项确认,不得在 Step 3 泛化锁死。
- `L0-core` 的 `core-contracts` 是当前唯一可写入 Cargo path dependency 的上游 crate。

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释？

会直接影响详细设计的规则包括:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文。
- 普通注释、rustdoc 文档注释、错误说明注释必须使用英文。
- 公开 struct、enum、enum variant、trait、type alias、public function 和公开模块成员必须使用 rustdoc `///` 或 `//!`。
- 公共 API 的文档注释应说明单句摘要、行为、边界、错误语义、panic 条件和必要示例。
- 错误类型命名应遵循 Rust 习惯和同 crate 词序一致性。
- Cargo feature 命名不得使用无意义占位词或负向 feature。
- 测试名必须英文,并能表达行为、条件和期望结果。
- rustfmt / clippy 是辅助工具,不能替代本详细设计对类型、函数和注释的明确契约。

### 3.3 是否必须遵守 rustdoc 风格注释？

必须遵守。详细设计中所有需要落码的公开对象必须在契约层说明注释要求。

| 代码项 | 注释要求 |
|---|---|
| crate / module | 使用 `//!` 说明模块职责、边界和禁止事项 |
| struct | 使用 `///` 说明结构体职责和不变量 |
| struct field | 使用 `///` 说明字段类型的业务作用、来源和约束 |
| enum | 使用 `///` 说明状态集合或分类边界 |
| enum variant | 每个 variant 必须使用 `///` 说明业务语义;带载荷 variant 必须说明载荷语义 |
| value object | 使用 `///` 说明被封装的业务含义和校验规则 |
| trait | 使用 `///` 说明 port / repository / adapter 的职责和调用边界 |
| public function | 使用 `///` 说明作用、参数语义、返回值、错误语义和副作用 |
| test | 测试名用英文描述条件与期望,必要时用英文注释说明 fixture 目的 |

注意:本设计仓文档可用中文描述设计,但实现仓源码注释必须使用英文。中文只能出现在明确的业务数据、协议样例、国际化资源或测试夹具中。

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

实施者开始编码前必须阅读:

- `standards/coding/rust.md`
- `standards/document/子项目目录与代码文件组织规范.md`
- `standards/document/实施计划书写规范.md` 的 commit message、git user、Co-Authored-By 和实现仓语言边界规则
- 本仓 `03-详细设计.md` 的校准来源章节和 `design-calibration/03_ddd_*` 中间产物

实现仓提交约束:

- 除 `quantalithos-design` 文档仓外,其他实现代码仓 commit message 必须使用英文。
- 标题格式固定为 `type(scope): subject`。
- body 使用英文,按子功能分组,文件条目只写文件名并标注大致改动量。
- `Co-Authored-By: Codex <noreply@openai.com>` 默认保留,且前面必须有空行。
- 需要精确控制格式时,使用完整 message 文件执行 `git commit -F` 或 `git commit --amend -F`。
- git user 默认应按实施计划规范检查: `quantalithos-labs <quantalithos.ai@gmail.com>`;若目标仓有更严格规则,只能叠加不能放宽。

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现？

不应在本仓实现的边界包括:

- Identity 认证、授权裁决、成员生命周期和角色定义。
- Governance policy / gate / approval 决策真相。
- Artifact 正文、版本、证据链和生命周期真相。
- Runtime LLM 推理、agent loop、tool 调用、memory 写入和运行时上下文。
- Bridges 外部平台协议生命周期、外部 channel / account 管理和外部消息正文存储。
- Chat UI / Workspace 聚合视图 / SDK facade 的展示或产品交互状态。
- 全局 Observability trace store、metrics store、archive package 正文和恢复主体。
- API gateway、auth provider、production endpoint matrix 和部署 / 运维策略。

本仓只能通过 port、adapter、event、reference、snapshot、handoff 或 authorized query 与这些边界协作。

### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库？

是。当前 `/home/aris/Projects` 下已经存在:

| 实现仓 | 是否存在 | 本仓关系 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | 是 | 唯一编译期依赖来源 |
| `/home/aris/Projects/quantalithos-bus` | 是 | 事件协作主干,不作为 Cargo path dependency |
| `/home/aris/Projects/quantalithos-sdk` | 是 | 下游 / 默认 client access,不作为本仓 Cargo path dependency |
| `/home/aris/Projects/quantalithos-identity` | 是 | actor / participant 引用来源,运行期边界,不作为 Cargo path dependency |
| `/home/aris/Projects/quantalithos-method-library` | 是 | 当前非本仓主链依赖 |
| `/home/aris/Projects/quantalithos-conversation` | 否 | 后续实施时创建目标仓 |

### 3.7 这些依赖中哪些是已确认的编译期依赖？

当前只有 `L0-core` 是已确认编译期依赖。更具体地说,本仓默认只依赖 `quantalithos-core/crates/contracts` 提供的 `core-contracts` package / `core_contracts` crate。

不应依赖:

- `core-domain`
- `core-application`
- `core-infra`
- `core-cli`
- `core-jobs`
- `bus-*`
- `identity-*`
- 其他 L1 / L2 / L4 / L5 / L6 仓源码 crate

如后续详细设计发现需要新增编译期依赖,必须回退 Step 1 / Step 3 / 架构设计,不能在 Step 4 或实现中自行加入。

### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在？

`quantalithos-core` 已存在,且当前布局为 workspace:

```text
/home/aris/Projects/quantalithos-core/
  Cargo.toml
  crates/
    contracts/      # package: core-contracts, lib crate: core_contracts
    domain/         # package: core-domain
    application/    # package: core-application
    infra/          # package: core-infra
    cli/            # package: core-cli
    jobs/           # package: core-jobs
```

因此后续 `quantalithos-conversation` 中应使用 sibling repo path dependency 指向:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

该写法只说明当前本地开发方案。中期可以切换到 private git tag / rev,但当前不要求发布到公共 crates.io。

### 3.9 对已确认的编译期依赖,当前是否采用本地 path dependency？

是。当前阶段采用本地 sibling repo path dependency:

| 依赖仓库 | package | lib crate | 本地默认路径 | 当前引用方式 | 中期引用方式 |
|---|---|---|---|---|---|
| `quantalithos-core` | `core-contracts` | `core_contracts` | `../quantalithos-core/crates/contracts` | Cargo path dependency | private git tag / rev |

不得把公共 crates.io 发布作为当前默认前置条件。

### 3.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency？

| 关联项目 | 依赖类型 | 正确表达 | 禁止表达 |
|---|---|---|---|
| `L0-bus` | 事件协作 | outbox publisher port、event consumer、event envelope adapter、test double | `bus-*` Cargo path dependency |
| `L1-identity` | 运行期 | actor resolver port、identity snapshot consumer、participant display snapshot adapter | `identity-*` Cargo path dependency |
| `L1-work` | 运行期 / 事件协作 | project / work reference resolver、work context changed consumer | `work-*` Cargo path dependency |
| `L1-governance` | 运行期 / 事件协作 | governance fact resolver、governance fact committed consumer | `governance-*` Cargo path dependency |
| `L1-artifact` | 运行期 / 事件协作 | artifact fact resolver、artifact fact committed consumer | `artifact-*` Cargo path dependency |
| `L0-sdk` | 下游 runtime access | SDK consumer boundary / client surface reference in docs | `sdk-*` Cargo path dependency |
| `L5-chat` | 下游 consumer | authorized query / projection / downstream event boundary | `chat-*` Cargo path dependency |
| `L1-workspace` | 下游 consumer / event collaboration | read model / projection / workspace event consumer | `workspace-*` Cargo path dependency |
| `L2-runtime` | 运行期 | runtime result committed consumer、authorized read boundary | `runtime-*` Cargo path dependency |
| `L6-bridges` | 运行期 | bridge mapped fact received consumer、bridge output adapter | `bridges-*` Cargo path dependency |
| `L4-observability` | event / handoff | trace handoff port、audit material handoff | `observability-*` Cargo path dependency |
| `L4-archive` | runtime / event / handoff | archive handoff port、archive ref result | `archive-*` Cargo path dependency |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 未明确源码注释必须英文,且大量中文伪代码容易被误当作源码注释模板 | 实现仓可能复制中文注释,违反当前编码规范 |
| 旧版对象 / enum 片段 | 部分对象有注释,但没有系统约束 enum variant 必须逐项注释 | 会导致状态 enum 和错误 enum 落码时缺少语义说明 |
| 旧版依赖表达 | 把 Chat、Bridges、Governance、Artifact、Process 等外部关系混入实现结构 | 后续可能误写成 Cargo dependency |
| 旧版目录示例 | 未按最新 `quantalithos-<project>` / `crates/<role>` 规则约束 | Step 4 可能泄漏 `L1` 或重复项目前缀 |
| 当前设计链路 | `quantalithos-conversation` 实现仓尚未存在 | Step 4 只能设计目标布局,实施时创建 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 源码语言 | 旧设计文档中文注释与伪代码混杂 | 实现仓标识符、注释、rustdoc、测试名和 commit message 必须英文 | 区分 design 仓与实现仓 |
| Rustdoc 要求 | 只零散要求对象说明 | struct、field、enum、variant、trait、public function 均有注释规则 | 支撑 1:1 落码 |
| 编译期依赖 | 外部仓关系容易泛化 | 只有 `core-contracts` 可作为 path dependency | 遵守全局依赖裁剪 |
| 运行期 / 事件协作依赖 | 容易写成源码依赖 | 统一落到 port、adapter、event、handoff、projection | 防止跨仓耦合 |
| crates.io 策略 | 未说明 | 当前不以前置公共发布为默认方案 | 支持本地多仓开发 |
| 提交规范 | 旧详细设计不约束 | 实现仓英文 commit、固定 footer 和 git user 检查后移实施计划但本步点名 | 防止交付时格式漂移 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A:让 `L1-conversation` 直接依赖所有相关仓源码 | 初期类型调用方便 | 破坏依赖裁剪,会把来源 truth 和下游消费方拉进核心 | 不采用 |
| 方案 B:只把 `core-contracts` 作为编译期依赖,其他关系全部通过 port / adapter / event / handoff 表达 | 边界清晰,符合架构和全局依赖规则 | 需要在 Step 7 / Step 8 定义更多端口和 DTO | 采用 |
| 方案 C:先不依赖任何本地仓,全部复制基础类型 | 实现仓可独立启动 | 会复制 ID、ActorRef、TraceContext、Error 和 metadata 真相,破坏 L0-core 统一契约 | 不采用 |
| 方案 D:等待所有依赖发布到公共 crates.io 后再实现 | 依赖形态稳定 | 拖慢当前本地多仓开发,且用户明确不希望当前以公共 crates 为前置 | 不采用 |

推荐方案:方案 B。

原因:

- `L1-conversation` 的核心语义只需要共享契约,不应直接依赖来源仓和下游仓业务实现。
- `core-contracts` 已在本地实现仓存在,可以满足共享 ID、ActorRef、TraceContext、Error、metadata 等基础契约。
- port / adapter / event / handoff 能让未实现或未稳定的相邻仓先以 fake / test double / contract stub 进入测试,不阻塞 Conversation truth 实现。

---

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 实现仓源码标识符、模块名、类型名、函数名、变量名、测试名必须英文 | Step 4~Step 16 输出的代码契约必须使用英文命名 |
| `standards/coding/rust.md` | 普通注释、rustdoc、错误说明注释必须英文 | 正式 `03` 的 Rust 片段应使用英文 rustdoc,中文说明只能在文档正文中 |
| `standards/coding/rust.md` | 公开 struct、enum、enum variant、trait、public function 使用 rustdoc | Step 6 / Step 7 / Step 8 必须逐项输出注释 |
| `standards/coding/rust.md` | enum variant 不得省略注释;带载荷 variant 必须说明载荷语义 | Step 6 / Step 10 的所有状态和错误 enum 必须有 variant 注释 |
| `standards/coding/rust.md` | 命名词序、feature 命名、测试命名必须清晰一致 | Step 4 / Step 6 / Step 16 检查命名一致性 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓使用 `/home/aris/Projects/quantalithos-<project>`,仓内不泄漏 `L0` / `L1` 层级 | Step 4 文件布局必须使用 `quantalithos-conversation` 和职责目录 |
| `standards/document/实施计划书写规范.md` | 实现代码仓 commit message 必须英文,标题 `type(scope): subject`,保留 `Co-Authored-By: Codex <noreply@openai.com>` | Step 17 / 实施计划承接时必须要求实施者阅读提交规范 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 2024 edition | 新实现仓默认使用 Rust 2024;rust-version 与 `L0-core` 兼容 | 全仓 |
| 源码英文 | 标识符、注释、rustdoc、测试名、commit message 默认英文 | 全仓 |
| 设计文档中文不等于源码注释模板 | 本文件可用中文说明设计,但 Rust 代码片段中的注释应使用英文 | Step 6~Step 10 |
| rustdoc 覆盖公开契约 | struct、field、enum、variant、trait、public function 必须有文档注释 | domain / contracts / application / ports |
| 仅 `core-contracts` 编译期依赖 | 只允许直接引用 `L0-core` 共享契约 | contracts / domain / application |
| 运行期依赖全部倒置 | identity、work、governance、artifact、runtime、bridges、observability、archive 全部经 port / adapter / event / handoff | ports / adapters / consumers / jobs |
| 事件协作不等于 bus 源码依赖 | outbox / consumer 通过正式边界和 adapter 表达 | outbox / worker / jobs |
| 不复制上游基础类型 | ID、ActorRef、TraceContext、Error、metadata 等必须来自 `core-contracts` 或本仓明确封装 | 全仓 |
| 不以前置公共 crates 为默认方案 | 当前采用本地 sibling repo path dependency;中期可 private git tag / rev | Cargo / implementation plan |
| 不实现外部 truth owner | 本仓只实现 Conversation truth,不实现 identity / governance / artifact / runtime / bridge truth | domain / application / adapters |

### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期 | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts、domain、application、errors、metadata、trace、actor refs |
| `quantalithos-bus` | 事件协作 | `/home/aris/Projects/quantalithos-bus` | 不写 Cargo dependency;通过 outbox publisher port / event consumer adapter 协作 | SDK / event contract / private integration boundary | outbox、worker、consumer、jobs |
| `quantalithos-identity` | 运行期 | `/home/aris/Projects/quantalithos-identity` | 不写 Cargo dependency;通过 actor resolver port / identity event consumer 协作 | SDK / service boundary / private integration boundary | participant scope、fact source、reference projection |
| `quantalithos-sdk` | 下游运行期 | `/home/aris/Projects/quantalithos-sdk` | 不写 Cargo dependency;作为下游消费边界参考 | SDK package / client integration | query / downstream contract |
| `quantalithos-work` | 运行期 / 事件协作 | 当前未发现 | 不写 Cargo dependency;通过 project / work reference resolver port 预留 | service boundary / event contract | space anchor、manifestation、reference |
| `quantalithos-governance` | 运行期 / 事件协作 | 当前未发现 | 不写 Cargo dependency;通过 governance fact resolver / consumer 预留 | service boundary / event contract | manifestation、trace、reference |
| `quantalithos-artifact` | 运行期 / 事件协作 | 当前未发现 | 不写 Cargo dependency;通过 artifact fact resolver / consumer 预留 | service boundary / event contract | manifestation、snapshot、reference |
| `quantalithos-observability` | 事件 / handoff | 当前未发现 | 不写 Cargo dependency;通过 trace handoff port 预留 | handoff protocol / SDK | trace handoff |
| `quantalithos-archive` | 运行期 / 事件 / handoff | 当前未发现 | 不写 Cargo dependency;通过 archive handoff port 预留 | handoff protocol / SDK | archive handoff |

### 7.4 禁止 Cargo 依赖表

| 禁止写法 | 原因 | 正确做法 |
|---|---|---|
| `bus-* = { path = "../quantalithos-bus/..." }` | `L0-bus` 是事件协作主干,不是本仓业务类型来源 | 定义 outbox publisher port 和 event consumer adapter |
| `identity-* = { path = "../quantalithos-identity/..." }` | Identity 生命周期和成员 truth 不归 Conversation | 定义 actor resolver port 和 identity changed consumer |
| `work-*` / `governance-*` / `artifact-*` path dependency | 来源仓 truth 不应进入本仓源码依赖 | 使用 external fact ref、snapshot resolver、source event consumer |
| `sdk-*` path dependency | SDK 是下游访问封装,不能反向定义本仓 | 只在测试 / 验收或下游集成中使用 |
| `chat-*` / `workspace-*` path dependency | UI / 聚合视图不能反向定义 Conversation truth | 提供 authorized query / projection / event boundary |
| `runtime-*` / `bridges-*` path dependency | runtime loop 和外部平台协议不归本仓 | 通过 result fact consumer 和 bridge mapped fact consumer |
| `observability-*` / `archive-*` path dependency | 全局观测和归档不拥有 Conversation 当前 truth | 通过 handoff port 和 event collaboration |

### 7.5 实现仓前置阅读清单

| 阅读项 | 必读原因 | 后续落点 |
|---|---|---|
| `standards/coding/rust.md` | 确认源码英文、rustdoc、命名、格式和测试规则 | 详细设计 §3 / 实施计划前置阅读 |
| `standards/document/子项目目录与代码文件组织规范.md` | 确认实现仓、workspace member、package、crate、binary 和文件命名 | Step 4 / 实施计划 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 确认只有编译期依赖可写入 Cargo dependency | Step 3 / Step 4 / Step 14 |
| `standards/document/实施计划书写规范.md` | 确认实现仓英文 commit、git user、footer 和 commit boundary 规则 | Step 17 / `07-实施计划.md` |
| `projects/L1-conversation/design-calibration/03_ddd_*` | 确认详细设计每章来源 | 实施计划阶段阅读矩阵 |

### 7.6 依赖裁剪图

#### 依赖裁剪图: L1-conversation 详细设计依赖约束

```text
/home/aris/Projects/quantalithos-conversation
  |
  | [compile] path dependency
  v
/home/aris/Projects/quantalithos-core/crates/contracts

/home/aris/Projects/quantalithos-conversation
  |
  | [event] outbox / consumer adapter
  v
/home/aris/Projects/quantalithos-bus

/home/aris/Projects/quantalithos-conversation
  |
  | [runtime] resolver / boundary port
  v
identity / work / governance / artifact / runtime / bridges / observability / archive
```

图示说明:

- `[compile]` 是唯一允许进入 Cargo dependency 的关系,当前只指向 `core-contracts`。
- `[event]` 和 `[runtime]` 都必须通过 port / adapter / consumer / handoff 表达,不能写成 Cargo path dependency。
- 图中未出现的下游 UI、workspace 和 SDK 只能消费本仓授权输出,不得反向定义本仓核心对象。

---

## 8. 回填草稿

正式 `03-详细设计.md` §3 “实现约束与编码规范承接”应摘录并整理:

- 本文件 §7.1 编码规范承接表。
- 本文件 §7.2 实现约束表。
- 本文件 §7.3 本地多仓依赖约束表。
- 本文件 §7.4 禁止 Cargo 依赖表。
- 本文件 §7.5 实现仓前置阅读清单。
- 本文件 §7.6 依赖裁剪图。

正式 `03-详细设计.md` §16 “详细设计到实施计划的承接清单”应提示:

- 实施计划必须继续约束英文 commit message、git user、Co-Authored-By footer 和 commit boundary。
- 实施计划必须在阶段实施前阅读矩阵中列出相关 `design-calibration/03_ddd_*` 文件。

---

## 9. 待确认事项

- 无阻塞进入 Step 4 的待确认事项。
- `quantalithos-conversation` 实现仓当前尚未存在,Step 4 只设计目标布局;实施时由 agent 在 `/home/aris/Projects/quantalithos-conversation` 创建。
- 如果未来要让 `L1-conversation` 直接依赖 `L0-bus`、`L1-identity` 或其他业务仓源码,必须回退 Step 3 和架构依赖裁剪重新确认。

---

## 10. 进入下一步条件

- [x] 已明确本仓语言、runtime 和主要依赖约束。
- [x] 已明确 Rust 编码规范如何影响对象、错误、trait、async、测试和注释。
- [x] 已明确 rustdoc 风格注释要求,并确认 enum variant 不得省略注释。
- [x] 已明确实施者开始前必须阅读的提交规范和 git config 用户要求。
- [x] 已明确不应在本仓实现的安全、鉴权、网关和外部边界。
- [x] 已确认当前唯一编译期依赖是 `core-contracts`。
- [x] 已检查 `/home/aris/Projects` 下相关 sibling repo 状态。
- [x] 已确认本地 path dependency 与中期 private git tag / rev 方案。
- [x] 已明确运行期和事件协作依赖不得写成 Cargo path dependency。
- [x] 已足以进入 Step 4 “收稳实现单元与文件布局”。
