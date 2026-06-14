# Step 3. 收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
> 回填章节: `03-详细设计.md` §3 实现约束与编码规范承接,以及 §16 详细设计到实施计划的承接清单
> 生成日期: 2026-06-11
> 状态: Step 3 已完成,已审核通过

---

## 1. Step 状态 + Step 内计划

本 Step 只收稳会影响代码形态的语言、runtime、编码、注释、仓库、提交、依赖和安全边界约束,不决定最终 crate / module / file layout,不定义对象字段、trait 签名、DTO schema 或事务细节。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 2 范围和 `01/02` 依赖 / 机制约束 | 已完成 | §2 |
| 读取 Rust 编码规范、目录组织规范和依赖裁剪规则 | 已完成 | §2 |
| 检查 `/home/aris/Projects` sibling repo reality | 已完成 | §3.8 / §7.4 |
| 检查当前 `quantalithos-identity` 实现仓 baseline | 已完成 | §3.1 / §7.3 |
| 检查 `quantalithos-core` 可用 crate baseline | 已完成 | §3.6~§3.9 / §7.4 |
| 回答 Step 3 SOP 问题 | 已完成 | §3 |
| 诊断当前材料的约束风险 | 已完成 | §4 |
| 形成改动前后对比 | 已完成 | §5 |
| 明确设计取舍 | 已完成 | §6 |
| 输出编码规范承接表、实现约束表、本地多仓依赖约束表 | 已完成 | §7 |
| 形成正式 `03` §3 / §16 回填草稿 | 已完成 | §9 |
| 更新 `03_ddd_calibration_flow.md` 状态 | 已完成 | `03_ddd_calibration_flow.md` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 已审核通过 | 确认本轮 `03` 覆盖 P0 identity 实现契约全链路 |
| `projects/L1-identity/01-架构设计.md` §5 / §8 / §11 | 已收稳 | 提供系统上下文、依赖裁剪、禁止依赖和技术机制 |
| `projects/L1-identity/02-概要设计.md` §11~§13 | 已收稳 | 提供配置影响、详细设计承接清单和实现阻塞条件 |
| `standards/coding/rust.md` | 已读取 | Rust 命名、格式、注释、rustdoc 和英文源码要求 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 编译期 / 运行期 / 事件协作依赖分类和 path dependency 规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 实现仓、workspace、package、crate、binary 和文件命名规则 |
| `standards/document/实施计划书写规范.md` §5.11 | 已读取 | git config、commit message、源码语言和提交前检查约束 |
| `/home/aris/Projects/quantalithos-identity` | 已存在 | 当前实现仓 reality check,不等于最终 Step 4 结论 |
| `/home/aris/Projects/quantalithos-core` | 已存在 | 当前唯一编译期依赖候选的 sibling repo reality check |

---

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖?

当前详细设计按 Rust 实现仓约束继续展开。当前本地实现仓 `/home/aris/Projects/quantalithos-identity` 的 reality check 是:

- Cargo package: `quantalithos-identity`。
- 当前形态: 单 crate skeleton。
- Rust edition: `2024`。
- 当前依赖: `axum`, `tokio`, `serde`, `serde_json`, `sqlx`, `thiserror`, `time`, `tower`。

本 Step 只确认这些是当前实现仓约束输入,不在此裁定最终是否保持单 crate、是否改为 workspace、多 crate 如何命名、哪些依赖放在哪个 crate。这些留给 Step 4。

语言 / runtime 约束:

- 默认语言: Rust。
- 默认 async runtime: Tokio,仅能在入口、infra、worker、jobs 等外层使用;domain 不依赖 runtime。
- HTTP / inbound 框架: 当前仓已有 Axum 依赖,具体 handler / route 是否进入本轮以及如何放置由 Step 4 / Step 8 决定。
- Durable persistence 候选: 当前仓已有 SQLx + PostgreSQL feature,只能进入 infra / persistence adapter;domain 和 public contracts 不依赖 SQLx。
- Serialization: `serde` / `serde_json` 可用于 public DTO / marker / evidence,但不能成为保存 forbidden body 的理由。
- Error helper: `thiserror` 可用于内部错误类型;public rejection / error DTO 仍必须由 Step 8 / Step 12 定义。

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

必须承接的 Rust 编码规范包括:

- 标识符、模块名、类型名、函数名、变量名、测试名必须使用英文。
- 同一 crate 内词序一致,避免拼音、Unicode 标识符、双重否定和无意义缩写。
- Cargo feature 不得使用无意义占位词或负向 `no-*` 语义。
- 公开 API 优先使用 rustdoc 文档注释。
- `rustfmt` / `clippy` 是门禁工具,但不能替代命名、注释和语义审查。
- 默认不使用 `unsafe`;若后续确需 `unsafe`,必须在详细设计中明确安全不变量、封装边界和测试切口。
- domain 层对象、policy 和状态迁移应优先保持同步纯逻辑;async 边界放在 application / infra / handler / jobs,避免把 runtime 泄漏进核心语义。
- 测试名、测试夹具中的 Rust 标识符和注释默认英文;中文只能作为业务数据、协议样例、国际化资源或明确测试输入存在。

### 3.3 是否必须遵守 rustdoc 风格注释?struct、字段、enum、enum variant、函数分别如何注释?

必须遵守。详细设计后续 Step 6~8 中出现的 Rust 契约片段应按以下注释口径写:

| 代码元素 | 注释要求 |
|---|---|
| crate / module | 公开 crate 或模块使用 `//!` 说明职责、边界和禁止事项 |
| public struct | 使用 `///` 单句摘要,必要时说明不变量和 ownership 边界 |
| public struct field | public field 必须有 `///` 说明字段来源、语义和 forbidden body 边界;private field 可在对象契约表说明 |
| public enum | 使用 `///` 说明分类边界 |
| enum variant | 每个公开 variant 都必须写 `///`;带载荷 variant 必须说明载荷语义 |
| trait | 使用 `///` 说明 port 语义、调用方、事务 / runtime 边界和 fake 等价要求 |
| function / method | 使用 `///` 说明行为、参数语义、返回、错误、panic 条件和重要 side effect |
| test function | 测试名英文,必要时用普通注释说明场景;不得用中文测试名替代 case id |

正式设计文档可以中文说明这些注释要求,但实现仓源码里的 rustdoc 和普通注释默认英文。

### 3.4 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

实施者开始前至少必须阅读:

- `standards/coding/rust.md`。
- `standards/document/实施计划书写规范.md` §5.11。
- 当前项目完成后的 `07-实施计划.md` 对提交边界、门禁和 commit message 的具体要求。
- 目标实现仓近期合格提交记录。

项目级 git config 要求:

```text
user.name  = quantalithos-labs
user.email = quantalithos.ai@gmail.com
```

要求使用项目级 `git config`,不得用 `--global` 污染全局配置。实现仓 commit message 默认英文标题格式 `type(scope): subject`;design 文档仓可以使用中文 subject / body,但仍需遵循当前项目提交规范。具体提交时机和 commit boundary 不在 `03` 决定,归 `07`。

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现?

本仓不实现:

- 认证、账号、token、session、credential、secret truth。
- 授权 / 治理裁决 truth。
- API gateway、全局安全入口、secret manager。
- Project / WorkItem / ProjectMember truth。
- RoleDefinition / CapabilityDefinition body。
- memory body、embedding、archive package、artifact body、conversation body、runtime body、raw log。
- 外部来源正文复制、共享数据库事务、跨仓 truth 修复。

本仓只能消费 actor context、basis ref、source ref、safe summary、visibility marker、receipt marker 或 resolver 返回结果。缺来源时必须进入 rejected、pending、stale、unavailable、degraded 或 report-only surface,不得用默认值伪造成功。

### 3.6 本仓是否依赖已经实现的 Quantalithos 仓库?

是。当前本地 `/home/aris/Projects` 下已存在:

- `quantalithos-core`
- `quantalithos-bus`
- `quantalithos-method-library`
- `quantalithos-work`
- `quantalithos-governance`
- `quantalithos-identity`
- 以及 conversation、process、sdk 等消费侧仓库。

但“存在”不等于“可写为编译期依赖”。按架构和全局依赖裁剪规则,`L1-identity` 当前唯一编译期依赖候选是 `L0-core`;其余关联仓只能通过运行期 adapter、事件协作、publisher / subscriber、projection 或 handoff port 表达。

### 3.7 这些依赖中哪些是已确认的编译期依赖?

已确认的编译期依赖候选只有 `L0-core` 的 shared contracts crate。

当前实际可用 crate:

```text
/home/aris/Projects/quantalithos-core/crates/contracts
Cargo package: core-contracts
Rust lib crate: core_contracts
```

当前实际存在的基础类型包括 `ActorContext`, `ActorRef`, `ActorKind`, `RequestOrigin`, `RequestMetadata`, `CommandMetadata`, `QueryMetadata`, `RequestId`, `TraceId`, `IdempotencyKey`, `PageRequest`, `PageToken`, `ResourceRef`, `ErrorResponse`, `ErrorCode`, `CloudEventEnvelope` 等。

注意: Step 3 只确认这些类型当前存在。后续 Step 不得把未检索到的 core 类型写成已存在契约;如果 `03` 需要新的 shared type,必须标为上游 contracts 缺口或在相应 Step 回写设计。

### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在?

存在。reality check:

| 仓库 | 路径 | 当前发现 |
|---|---|---|
| `quantalithos-identity` | `/home/aris/Projects/quantalithos-identity` | 单 crate skeleton,`Cargo.toml` 存在,`src/lib.rs` 已有 module skeleton |
| `quantalithos-core` | `/home/aris/Projects/quantalithos-core` | workspace,包含 `crates/contracts`、`domain`、`application`、`infra`、`cli`、`jobs` |
| `quantalithos-bus` | `/home/aris/Projects/quantalithos-bus` | 存在,但本仓不把 bus 写成业务源码依赖 |
| `quantalithos-method-library` | `/home/aris/Projects/quantalithos-method-library` | 存在,但只作为运行期 / 事件协作来源 |
| `quantalithos-work` | `/home/aris/Projects/quantalithos-work` | 存在,但只作为运行期 / 事件协作来源和消费方 |
| `quantalithos-governance` | `/home/aris/Projects/quantalithos-governance` | 存在,但只作为运行期 / 事件协作 basis / consumer 边界 |

### 3.9 对已确认的编译期依赖,当前是否采用本地 path dependency?中期是否记录 private git tag / rev 方案?

当前 `quantalithos-identity` 的 `Cargo.toml` 尚未声明 `core-contracts` path dependency。Step 3 的正式约束是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

该写法只适用于需要直接引用 shared actor / metadata / error / envelope 基础契约的 crate。具体写在哪个 `Cargo.toml`,由 Step 4 的 crate / workspace 布局决定。

中期方案:当 private git tag / rev 基线建立后,可把本地 path dependency 切换为 private git dependency;切换时必须固定 tag / rev,不得使用未固定 branch 作为可复现实现基线。

### 3.10 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

不能写成 Cargo path dependency 的关系:

- `L0-bus`: 事件协作主干;本仓可以定义 event payload / publisher port / subscriber port,但不直接把 bus implementation 写入 business crate。
- `L3-method-library`: 角色 / 能力来源;通过 resolver、source snapshot、event consumer 或 adapter 消费,不依赖 implementation。
- `L1-work`: 项目参与来源和 identity consumer;通过 source marker、event consumer、query adapter 或 outbound event 协作,不依赖 implementation。
- `L1-governance`: high-risk lifecycle basis 来源和 consumer;通过 basis resolver / governance ref / event 协作,不依赖 implementation。
- memory / archive / observability / runtime / downstream consumers: 全部通过 adapter、handoff、event、trace / audit export 或 query boundary 协作。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `03` 或旧实现可能直接继承当前单 crate 布局 | 当前实现仓是 skeleton,不等于新版详细设计最终布局 | Step 3 只记录 reality;Step 4 决定布局 |
| 架构写 `L0-core` 提供基础契约 | 若不查实际 crate,容易引用不存在的 shared type | 已确认 `core-contracts` 存在,并列出当前真实可用类型 |
| 架构同时提到 `L0-bus`、method、work、governance | 容易把运行期 / 事件协作误写成 Cargo path dependency | Step 3 明确只有编译期依赖可进入 Cargo |
| Rust 编码规范正文是中文 | 容易把中文注释带入实现仓 | Step 3 明确源码标识符、rustdoc、普通注释和测试名默认英文 |
| 当前实现仓已有 Axum / SQLx / Tokio | 容易让 domain / contracts 泄漏框架和存储依赖 | Step 3 限定框架依赖只能在外层 / infra / entry 使用 |
| `04/05/06/07` 早于新版 `03` | 旧 profile、测试阈值和 commit boundary 不能作为 Step 3 约束来源 | Step 3 只承接标准和新版 `00/01/02` |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 编码语言 | 旧稿 / 旧实现可能隐含 Rust,未形成 Step 级约束 | 明确 Rust、Rust 2024、英文源码、rustdoc 和 no unsafe by default |
| runtime / framework | 当前仓已有依赖但边界未写清 | Tokio / Axum / SQLx 只作为当前实现 reality 和外层约束,不进入 domain |
| 注释语言 | 文档中文和源码注释边界未分 | 设计文档中文,实现仓源码注释 / rustdoc / 测试名默认英文 |
| 编译期依赖 | 容易泛化为多个 sibling repo path dependency | 只有 `core-contracts` 是当前编译期依赖候选 |
| 运行期 / 事件协作 | 容易变成源码依赖 | 统一转为 port / adapter / event / handoff / projection |
| git / commit | 详细设计未承接实施前置约束 | Step 3 记录 git config 和实施前阅读要求,具体 boundary 留给 `07` |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 直接沿用当前 `quantalithos-identity` 单 crate skeleton | 暂不采用为正式结论 | 当前 skeleton 是 reality,但本轮 `03` 覆盖 contracts/domain/application/infra/jobs 等全链路,需 Step 4 正式判断 |
| 在 Step 3 直接宣布 workspace 多 crate | 暂不采用 | crate / file layout 是 Step 4 任务;Step 3 只给约束 |
| 把所有已存在 sibling repo 都设为 path dependency | 不采用 | 违反依赖裁剪规则,会形成 L1 业务仓源码耦合 |
| 只允许 `core-contracts` 作为编译期依赖候选 | 采用 | 与架构 `L0-core only compile dependency` 和实际 crate baseline 一致 |
| 允许中文源码注释以贴近中文设计 | 不采用 | Rust 编码规范要求实现仓源码默认英文 |
| 默认禁止 `unsafe` | 采用 | 当前 identity 业务契约无必须 unsafe 的输入;后续若需要必须单独设计和测试 |
| 让 domain 直接使用 Axum / SQLx / Tokio | 不采用 | 会打穿依赖倒置和核心语义边界 |

---

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` 源码语言约束 | 实现仓标识符、模块名、类型名、函数名、变量名、测试名、普通注释和 rustdoc 默认英文 | Step 6~8 的 Rust 契约片段必须使用英文代码和英文注释 |
| `standards/coding/rust.md` rustdoc | public struct、enum、enum variant、trait、function、module 使用 rustdoc;公开 enum variant 不得省略注释 | Step 6~8 必须写足注释要求,不能用裸 enum variant |
| `standards/coding/rust.md` 命名 | 统一词序、英文阅读习惯、避免拼音 / Unicode / 双重否定 / 无意义缩写 | Step 4~8 的 module、type、function、test naming 需要一致 |
| `standards/coding/rust.md` Cargo feature | feature 命名不能用无意义占位或负向 `no-*` | Step 14 若定义 feature / profile 需遵守 |
| `standards/coding/rust.md` rustfmt / clippy 边界 | 工具不能替代语义审查和注释审查 | Step 16 / 17 需把 fmt / clippy 作为门禁之一,但仍保留 review |
| `standards/document/子项目目录与代码文件组织规范.md` | 设计目录用 `Lx-`,实现仓用 `quantalithos-<project>`,代码内部不用 `L1` / `quantalithos` 前缀 | Step 4 命名不得写 `l1_identity_domain` 或 `crates/identity_domain` |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可写 Cargo path dependency;runtime / event 不能写入 Cargo | Step 4 / 7 / 14 必须区分 Cargo dependency 与 adapter / event |
| `standards/document/实施计划书写规范.md` §5.11 | git config、commit message、英文源码、提交边界和提交前检查 | Step 17 需把这些交给 `07`;Step 3 只固化前置阅读 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 2024 | 当前实现仓和 core workspace 均使用 edition 2024 | 全仓 |
| 源码英文 | 标识符、rustdoc、普通注释、测试名默认英文 | contracts、domain、application、infra、tests |
| Domain no runtime dependency | domain 不依赖 Axum、Tokio、SQLx、bus、adapter implementation | domain objects、policy、state matrix |
| Public contracts no infra dependency | contracts 只能依赖 serde / core shared contracts 等基础契约,不得依赖 infra、SQLx、Axum | DTO、event、view、error surface |
| Application owns ports | repository、resolver、publisher、handoff、clock、id、metadata provider trait 由 application 边界承接 | Step 7 ports、Step 9 flows |
| Infra owns adapters | SQLx store、HTTP client、publisher、handoff、runtime wiring、fake / controlled adapter 进入 infra | Step 7 / 11 / 14 |
| Query no-write | query handler / service 不创建、刷新、修复、publish、deliver 或 rebuild truth | Query API、projection、visibility |
| Forbidden body guard | method body、ProjectMember truth、memory body、archive package、runtime body、secret 不进入 truth / projection / event / report / diagnostic | 全部 write / read / event / job |
| `unsafe` default deny | 当前不设计 unsafe;若后续必须使用,需单独记录安全不变量和测试切口 | 全仓 |
| `core-contracts` reality check | 只能引用实际存在的 shared type;不存在的上游类型必须回写设计或上游 contracts | Step 6~8 / Step 13 |
| Existing implementation is not final layout | 当前 `quantalithos-identity` 单 crate skeleton 只作为输入,不提前决定 Step 4 | Step 4 |

### 7.3 当前实现仓 reality check

| 项 | 当前发现 | Step 3 结论 |
|---|---|---|
| 实现仓路径 | `/home/aris/Projects/quantalithos-identity` | 正式目标实现仓存在 |
| 当前 Cargo package | `quantalithos-identity` | 仅作为当前 reality;Step 4 可调整 |
| 当前 crate 形态 | 单 crate,`src/lib.rs` 暴露 `config/error/application/domain/inbound/operations/outbound/persistence` | 不直接继承为最终布局 |
| 当前 edition | `2024` | 本轮详细设计按 Rust 2024 继续 |
| 当前主要依赖 | `axum`, `tokio`, `serde`, `serde_json`, `sqlx`, `thiserror`, `time`, `tower` | 只能按层使用;domain 不泄漏框架 / persistence |
| 当前缺失 | 尚未声明 `core-contracts` path dependency | Step 4 根据 crate 布局决定写入位置 |

### 7.4 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `L0-core` / `core-contracts` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 候选;具体写入位置待 Step 4 | private git tag / rev,必须固定版本 | contracts、domain、application 可按需引用 shared actor / metadata / error |
| `L0-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不写 Cargo path dependency | event adapter / publisher / subscriber binding | outbox、event consumer、publisher |
| `L3-method-library` | 运行期 / 事件协作 | `/home/aris/Projects/quantalithos-method-library` | 不写 Cargo path dependency | resolver adapter / source event binding | role capability source |
| `L1-work` | 运行期 / 事件协作 | `/home/aris/Projects/quantalithos-work` | 不写 Cargo path dependency | work source resolver / event consumer / outbound identity event | career records、member anchor consumption |
| `L1-governance` | 运行期 / 事件协作 | `/home/aris/Projects/quantalithos-governance` | 不写 Cargo path dependency | governance basis resolver / event or query adapter | high-risk lifecycle basis |
| memory / archive / observability / runtime / downstream consumers | 运行期 / handoff / event / query consumption | 多个后续仓或外部边界 | 不写 Cargo path dependency | adapter、handoff target、trace export、query consumer | memory refs、handoff、audit、outbox |

#### 依赖裁剪图: L1-identity

```text
+---------------------+
| L1-identity         |
+----------+----------+
           |
           | [compile]
           v
     L0-core / core-contracts

L1-identity <--> [event]   L0-bus
L1-identity <--> [runtime/event] L3-method-library
L1-identity <--> [runtime/event] L1-work
L1-identity <--> [runtime/event] L1-governance
L1-identity  --> [runtime/handoff/event] memory / archive / observability / downstream consumers
```

图示说明:
- 本图只展示 `L1-identity` 相关依赖边,不复制全 27 仓。
- `[compile]` 才允许进入 Cargo dependency;当前只有 `core-contracts`。
- `[runtime]`、`[event]` 和 `[handoff]` 必须通过 Step 7 / Step 8 / Step 14 的 port、adapter、event、handoff 或 config binding 表达。
- 图不表达函数调用时序、事件传播顺序或实施顺序。

### 7.5 实施前置阅读表

| 阅读项 | 阅读目的 | 后续落点 |
|---|---|---|
| `standards/coding/rust.md` | 确认 Rust 命名、注释、rustdoc、源码英文和 no unsafe by default | `07` 前置阅读 / implementation handoff |
| `standards/document/子项目目录与代码文件组织规范.md` | 确认 workspace、package、crate、binary、file 命名 | Step 4 / `07` |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 确认 compile / runtime / event 依赖区分 | Step 4 / 7 / 14 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认 shared type reality、field source、cursor、subject mapper、projection lookup 等闭环 | Step 6~17 |
| `standards/document/实施计划书写规范.md` §5.11 | 确认 git config、commit message、提交前检查和源码语言 | Step 17 / `07` |
| 目标实现仓近期合格提交 | 对齐目标仓 commit 风格和门禁习惯 | `07` |

---

## 8. 复杂度判断 / 是否拆分

本 Step 不需要拆子文件。复杂点在于 dependency reality check,已通过结构化表收口。

进入 Step 4 时必须额外注意:

- 当前 identity 实现仓是单 crate skeleton,但 `02` 的实现契约范围较大;Step 4 必须正式比较单 crate 模块分层与 workspace 多 crate 方案。
- 如果选择 workspace,必须按目录组织规范输出 member 目录、Cargo package、Rust lib crate、binary 名,不能凭当前 skeleton 直接改名。
- `core-contracts` path dependency 的写入位置必须由 Step 4 的 crate 图决定。
- 运行期 / 事件协作仓库不得出现在 path dependency 表中。

当前不创建 Step 4~19 的未来文件。

---

## 9. 回填草稿

正式 `03-详细设计.md` §3 后续应回填:

### 3.1 编码规范承接

本仓按 Rust 2024 展开详细设计。实现仓源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释和 rustdoc 默认使用英文;中文仅允许出现在明确业务数据、协议样例、国际化资源或测试夹具中。public struct、field、enum、enum variant、trait、function 和 module 必须按 rustdoc 风格注释,公开 enum variant 不得省略注释。

### 3.2 语言、runtime 与框架边界

当前实现仓存在 Axum、Tokio、SQLx、Serde、Thiserror、Time、Tower 等依赖。详细设计约束为:domain 不依赖 runtime、HTTP、SQLx、bus 或 adapter implementation;contracts 不依赖 infra;application 定义 ports 并编排用例;infra 承接 durable store、adapter、publisher、handoff、runtime wiring 和 fake / controlled runtime。当前单 crate skeleton 不作为最终布局结论,Step 4 决定实现单元与文件布局。

### 3.3 本地多仓依赖约束

`L1-identity` 当前唯一编译期依赖候选是 `L0-core` 的 `core-contracts` crate:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

具体写入哪个 `Cargo.toml` 由 Step 4 决定。`L0-bus`、`L3-method-library`、`L1-work`、`L1-governance`、memory / archive / observability / runtime 和 downstream consumers 只能作为运行期、事件协作、handoff 或消费边界,不得写成 Cargo path dependency。

### 3.4 实施前置约束

实施者必须使用项目级 git config:

```text
user.name  = quantalithos-labs
user.email = quantalithos.ai@gmail.com
```

提交规范、commit boundary、门禁命令和 commit message 细则由 `07-实施计划.md` 收口;`03` 只把编码规范、源码语言、依赖裁剪和前置阅读交给 `07`。

正式正文要等 Step 19 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| `quantalithos-identity` 是否保持单 crate 或改为 workspace | 影响 Step 4 文件布局和 `core-contracts` path dependency 写入位置 | 留给 Step 4 正式比较和裁定 |
| 当前 Axum / SQLx / Tokio 依赖是否全部保留 | 影响 Step 4 / Step 11 / Step 14 | 当前只作为 reality check,后续按层裁剪 |
| `core-contracts` 是否已包含 `03` 后续需要的所有 shared type | 影响 Step 6~8 | 只确认当前实际存在类型;缺失时回写设计或上游 contracts |
| 实现仓 commit footer 使用 codex 还是其他固定 footer | 影响 `07` 提交规范 | Step 3 只记录 git config;footer 留给 `07` |

---

## 11. 进入 Step 4 的条件

进入 Step 4 前必须满足:

- 用户审核通过本 Step 的语言、runtime、编码和 rustdoc 约束。
- 用户确认当前唯一编译期依赖候选为 `core-contracts`。
- 用户确认 `L0-bus`、method-library、work、governance、memory / archive / observability / runtime 等关系不得写成 Cargo path dependency。
- 用户确认当前 `quantalithos-identity` 单 crate skeleton 只是 reality check,不是 Step 4 之前的最终布局结论。
