# 03-详细设计 Step 3：编码规范、语言 / runtime、仓库约束

> 项目：`L2-member-service`
> 对应 SOP：`详细设计讨论流程_SOP.md` Step 3
> 状态：completed
> Gate：pass_with_upstream_blockers
> 日期：2026-08-25

## 1. 本步输入

| 输入 | 读取结论 |
|---|---|
| Step 2 scope | 本轮只展开 Host Truth 控制面契约，不引入 sibling truth |
| `standards/coding/rust.md` | Rust 标识符、格式、rustdoc、英文源码注释和安全实践 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、workspace、crate、module、file 和依赖命名 |
| `standards/document/实施计划书写规范.md` | 实施前阅读、提交、git identity 和交付前闭环要求 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | compile / runtime / event / ref / adapter / fake 分类 |
| 当前 `/home/aris/Projects` sibling Cargo workspace | Core、Bus、SDK 真实布局；L2-member-service 实现仓尚不存在 |
| `01-架构设计.md` 与 `02` 承接清单 | Core / SDK 受限 compile 方向，其他跨仓关系不写成源码依赖 |

## 2. 语言、runtime 与产品选择

| 项目 | 当前裁决 | 详细设计影响 | 未闭口项 |
|---|---|---|---|
| 实现语言 | Rust | 类型、trait、enum、`Result`、所有权和 rustdoc 作为实现契约表达方式 | 具体实现仓尚不存在 |
| edition / toolchain | planned Rust 2024；MSRV 参考现有 workspace 的 1.93 | 03 可使用 Rust 2024 语法级假设；07 需把实际 toolchain 作为开工门禁 | `MSVC-UP-008` 的准确 SDK / server target |
| async model | 异步能力由 application / operations role 需要；以 `AsyncRuntimePort` / `TaskSpawnerPort` 表达 | Domain 不依赖 runtime；Job / Consumer 通过 port 注入取消、lease、并发和等待语义 | 具体 async 产品 deferred |
| web / RPC framework | 不在本轮锁定 | Inbound 只定义 handler mapping 和 transport-neutral error | API 产品 / wire protocol pending |
| persistence product | 不在本轮锁定 | repository / UoW / version / unique key 契约先行 | 数据库和 DDL 留后续实现决策 |
| message product | 不在本轮锁定 | publisher / consumer / projection 以 event seam 表达 | `MSVC-UP-007` route / envelope / receipt pending |
| container / orchestrator | 不在本轮锁定 | carrier / registry / Sandbox adapter neutral | `MSVC-UP-004` 与承载能力 pending |

关键原则：Rust 是实现契约语言，不代表已创建实现仓或已通过编译；具体框架、数据库、消息和容器产品只能在不改变 owner / state / no-fallback 的前提下由后续实现 / 配置决策绑定。

## 3. Rust 编码与注释约束

| 约束 | 详细设计必须体现的结果 |
|---|---|
| 标识符语言 | 类型、trait、函数、变量、模块、测试名使用英文；不得把中文业务标题直接作为 Rust 标识符 |
| rustdoc | 公开 module、struct、field、enum、每个 variant、trait、函数和 type alias 都有 `///` 英文说明 |
| enum variant | 每个 variant 都写业务语义；带载荷 variant 写明载荷来源、敏感性和错误 / reason 含义 |
| 函数契约 | 03 为每个公开 / port 函数给出参数类型、返回类型、错误类型和副作用 |
| ownership | Domain 对象不持有外部产品 client；跨边界使用 typed ref、safe summary 或 owned neutral result |
| error | 使用显式模块错误 enum；禁止以字符串比较或 `bool` 隐藏 blocked / unknown / conflict |
| async | `async` 只出现在 application / port / adapter / job surface；Domain transition 保持同步、可测试和无 IO |
| unsafe | 本仓详细设计不预设 `unsafe`；如实现需要，必须单独 ADR / 安全审查，不得在 03 默许 |
| 格式与 lint | 实施阶段以 `rustfmt`、`clippy` 和项目实际检查命令验证；03 不伪造检查结果 |
| 普通注释 | 使用英文，只解释非显然的不变量、外部边界或安全原因；不写空泛叙述 |
| 测试命名 | 英文、表达场景和期望，必须引用正式状态 / error 名称 |

正式 03 的字段表和函数表会以 Rust-facing 类型写出，但不直接写实现代码；伪代码只用于说明调用顺序，不能成为未审的源码片段。

## 4. 仓库、提交与实现前置约束

### 4.1 实现仓状态

当前已存在的实现仓包括 `quantalithos-core`、`quantalithos-bus`、`quantalithos-sdk` 等；未发现 `/home/aris/Projects/quantalithos-member-service`。因此本步和后续 Step 只能写 planned implementation layout，不得声称 package、crate、binary、源码或测试已创建。

### 4.2 提交与身份

| 项目 | 当前约束 |
|---|---|
| design 仓当前动作 | 只写设计文档；未经用户明确要求不提交 commit |
| 实现仓 commit | 实施者必须先读 `实施计划书写规范.md` 与目标仓历史提交；一笔提交对应明确 boundary |
| git user.name | 当前 design 仓读取值为 `quantalithos-labs` |
| git user.email | 当前 design 仓读取值为 `quantalithos.ai@gmail.com` |
| AI footer | 由目标实现仓提交规范和 07 决定；本步不伪造 commit message 或 footer |
| 工作区安全 | 实施前只暂存当前 boundary 文件，不能覆盖用户已有未提交改动 |

`git config` 的当前值只作为实施前检查记录，不表示已授权提交，也不产生 implementation evidence。

## 5. 依赖类型与真实路径审计

| 依赖 / 仓库 | 全局类型 | 当前可记录的真实路径 | 03 绑定方式 | 当前状态 / 禁止事项 |
|---|---|---|---|---|
| `L0-core` contracts | compile | `/home/aris/Projects/quantalithos-core/crates/contracts` | planned Cargo path dependency `core-contracts`；只消费正式 shared category | compile baseline；member-service schema 不可 shadow |
| `L0-bus` | event | `/home/aris/Projects/quantalithos-bus/crates/contracts` | `HostFactPublicationPort` / consumer adapter；不写 Cargo path dependency | delivery / route / receipt pending |
| `L0-sdk` | limited compile / fake support | `/home/aris/Projects/quantalithos-sdk/crates/contracts` | 仅在 `MSVC-UP-008` 关闭后评估 `sdk-contracts` path；当前写 placeholder / fake seam | target、Server surface、自测试 pending；不进 Host Truth runtime 主链 |
| `L1-identity` | runtime + event + ref | 无当前实现路径可作为本仓源码依赖 | `GlobalMemberQualificationResolverPort`、typed ref、safe summary | 不复制主体、授权或事件正文 |
| `L1-work` | runtime + event + ref | 无当前实现路径可作为本仓源码依赖 | `ProjectMemberQualificationResolverPort`、scope guard | 不复制 Project / Work truth |
| `L2-member` | runtime + event / signal | 当前无已确认实现仓 | registration / signal placeholder adapter | `MSVC-UP-002` pending |
| `L2-member-images` | runtime + ref | 当前无已确认实现仓 | pinned supply resolver placeholder | `MSVC-UP-003` pending |
| `L2-runtime` | runtime + ref | 当前无已确认实现仓 | Host Session / handoff ports | `MSVC-UP-001` pending |
| `L4-sandbox` | runtime + ref | 当前无已确认实现仓 | binding / release / cleanup ports | `MSVC-UP-004` pending |
| carrier / registry / host backend | adapter | 产品路径未知 | neutral adapter trait | 不将 backend state 变成 Host Truth |
| Observability | event + ref / material | 产品路径未知 | body-free material / audit port | observed truth 外置 |

只有 `compile` 类别可以进入未来 `Cargo.toml` path dependency 表；runtime、event、ref、adapter、fake 不得伪装为 package dependency。即使 sibling 目录存在，也不能据此推导合同 ready。

## 6. 运行期执行约束

```text
Inbound / Operations
  -> Application service
  -> Domain / Policy / Guard
  -> declared Port
  -> Adapter / Persistence / Projection
```

- Domain 只能依赖本仓类型和值对象；不能导入数据库、消息、容器、registry、Sandbox 或 sibling client。
- Application 通过 port 读取外部 safe qualification、提交本地 UoW 或发起 external attempt；不直接持有产品 client。
- Adapter 吸收产品协议和错误，向内返回 neutral result；adapter result 不是 Host Truth。
- Consumer / Job 的 runtime scheduling、lease、cancellation、batch 和 concurrency 通过运行时 port 注入；不把 scheduler 当业务状态。
- Query 只能读 source / projection / history，不能调用 resolver、刷新 projection、创建 decision 或修复 gap。
- Fake 只能验证本地边界、失败分类和幂等；不证明真实 owner、协议、后端、route、delivery、observation 或 readiness。

## 7. 安全与正文边界

| 数据类别 | 允许进入本仓 | 禁止进入本仓 |
|---|---|---|
| Identity / Work | typed ref、safe qualification、freshness、source revision | 成员正文、授权策略正文、Work 全量复制 |
| Credential | opaque safe ref、instance binding、revocation marker | secret、token body、可复用凭据 |
| Endpoint | redacted / safe endpoint material、visibility marker | raw endpoint、credential、连接正文 |
| Image | pinned ref、verification summary、supply freshness | image body、manifest 私有正文、BOM / provenance truth |
| Signal / outcome | source ref、sequence、captured time、safe summary、classification | provider raw body、诊断正文、observability backend record |
| Material / history | committed change ref、body-free reason / summary、correlation | 外部报告正文、secret、UI label、搜索片段 |

安全违规由 validator 拒绝或裁剪，并形成明确 error / gap；不能以配置开关放宽。

## 8. 改动前后对比

| 维度 | 历史 / 未收稳口径 | 当前 Step 3 口径 |
|---|---|---|
| 语言 | 可能混合实现产品假设 | Rust-facing 契约，产品 runtime deferred |
| runtime | 可能直接依赖具体 server / container client | `AsyncRuntimePort`、adapter-neutral result、planned wiring |
| Cargo 依赖 | sibling / SDK 容易被写成源码依赖 | 只有 Core；SDK 受限且 pending；其余按 seam 分类 |
| 注释 | 可能省略 field / variant | 公开类型和每个 variant 都要求英文 rustdoc |
| secret / body | 可能回流 callback / endpoint / credential | opaque ref、safe summary、body-free material |
| 提交 | 设计修改可能误写 commit / evidence | 本步不提交；实施者另按 07 和提交规范操作 |

## 9. 回填草稿与 Gate

正式 §3 应写入本文件 §2~§7 的语言、注释、仓库、依赖 seam、运行时和安全约束；不写具体框架、数据库、消息产品或已存在的实现。正式 §16 / §17 应引用提交规范、git identity、Rust coding guideline 和依赖分类作为实施前阅读与 phase gate 输入。

| 检查项 | 结果 | 说明 |
|---|---|---|
| 语言 / runtime 已能约束代码形态 | pass | Rust-facing；async / product 保持 port / deferred |
| rustdoc、variant、函数签名规则明确 | pass | §3 |
| 实现仓存在性未伪造 | pass | §4.1 明确 member-service 仓不存在 |
| compile / runtime / event / ref / adapter / fake 分类正确 | pass_with_upstream_blockers | §5；`MSVC-UP-001~008` 未关闭 |
| path dependency 只给 compile 类别 | pass | 只记录 Core，SDK 为 pending candidate |
| 提交与安全边界明确 | pass | §4、§7 |
| 可进入 Step 4 | pass | 进入实现单元与文件布局 |

```text
step_03_status = completed
step_03_gate = pass_with_upstream_blockers
next_allowed_step = Step 4 module_layout
formal_03_write_allowed = false_until_step_19
```
