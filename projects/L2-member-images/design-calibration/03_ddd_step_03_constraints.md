# L2-member-images 03 详细设计 Step 3：收稳编码规范、语言 / runtime、仓库约束

> 创建日期：2026-08-25  
> 状态：`completed_pass`  
> 文档模式：`full-restart`  
> 回填位置：正式 `03-详细设计.md` 第 3 章与第 16 章的实施前置阅读（仅形成回填草稿，当前不得装配正式文档）  
> 前置：`03_ddd_step_01_upstream_boundary.md`、`03_ddd_step_02_scope.md` 已通过。  
> 当前授权：用户允许继续至 Step 5；本 Step 完成后只可进入 Step 4，不得实现、创建目标实现仓或提交。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 范围、01 的依赖方向与技术边界、02 的代码主体 / 配置影响、`standards/coding/rust.md`、目录组织规范、项目实施 / 提交规范。 |
| 现场核查 | 目标实现仓 `/home/aris/Projects/quantalithos-member-images` 未发现；`/home/aris/Projects/quantalithos-core` 存在，且当前有 `crates/contracts`（package `core-contracts` / lib `core_contracts`）等实际 member。物理存在不改变 `MI-UP-004` 的语义限制。 |
| 本步目标 | 为 planned implementation 的语言、源码书写、模块命名、仓库前置条件和多仓依赖分类建立可执行约束。 |
| 本步禁止 | 不把 Shell catalog suggestion、Core 物理路径或 sibling 仓存在性误写成已获准 source dependency；不选择 builder、registry、DB、queue、HTTP/RPC、scheduler、telemetry 或 secret 产品。 |

## 1. Step 内计划与模块级门禁

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 规范盘点 | Rust、目录、实施 / 提交约束清单 | `done` | 源码语言、rustdoc、命名、目录和 future commit 前置条件均有来源。 |
| 语言 / runtime 判定 | §4 的候选比较与 §5.1 决议 | `done` | 选定 planned code baseline，同时未选择未授权框架 / backend。 |
| 依赖裁剪 | §5.3 多仓约束表 | `done` | compile 与 runtime/event/ref/adapter/fake 已分离；没有虚构 Cargo path。 |
| 回填与自检 | §6、§8 | `done` | 正式回填仍关闭，Step 4 可据此讨论 planned layout。 |

| 模块 / 范围 | 问题回答 | 诊断 | 改动前后 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|---|
| `implementation_constraints` | done | done | done | done | done | done | done | `pass` | 进入 Step 4，收稳 planned crate / module / file layout。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本仓使用什么语言、runtime、框架和主要依赖？ | 采用 **Rust workspace** 作为成员镜像资产 / 构建产物供给控制面的 planned language baseline；edition `2024`、`rust-version = 1.93` 均为 planned baseline，不是已存在 manifest 或 build 事实。async runtime、Web/RPC framework、DB、broker、scheduler、builder、registry、scanner/signer、telemetry、secret platform和 serde 等具体依赖当前均未选定。 |
| 2. Rust 规范中哪些内容影响结构体、错误、trait、async、测试和注释？ | 类型、函数、变量、module、file 和测试名必须英文且遵循 Rust naming；公开 API 使用 rustdoc；公开 enum 的每个 variant（尤其带载荷 variant）必须有说明；domain 不携带 I/O / transport / backend 类型；async 只在 application / port / adapter 等 I/O 边界讨论，不能把 runtime-specific type 引入 domain。错误、状态、typed ref 不用裸字符串偷渡跨边界语义。 |
| 3. 是否必须遵守 rustdoc 风格注释？ | 必须。设计��档中的 Rust 契约片段按详细设计 SOP 使用中文 rustdoc 风格说明字段、variant、函数和不变量；实际实现源码依 `standards/coding/rust.md` 一律用英文 rustdoc / 普通注释 / error text。翻译只能改变自然语言，不得改变契约语义或省略 variant 说明。 |
| 4. 实施者开始前必须阅读哪些提交规范和 git config 用户要求？ | 未来 07 开工前必须读取实施计划中的当前 boundary 阅读矩阵、`实施计划书写规范.md` 与 `代码实施台账与门禁规范.md`；仅在目标实现仓以项目级（非 `--global`）方式核查 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`。实现仓提交默认英文、标题为 `type(scope): subject`；当前未获实施 / commit 授权，未执行该检查或产生提交。 |
| 5. 哪些安全、鉴权、网关或外部边界不应在本仓实现？ | 不实现 Role / mapping、member、runtime loop、tool execution、live memory/checkpoint、secret、Sandbox / governance / Artifact / observability truth、container lifecycle、consumer health、外部 MCP/A2A/API adapter truth或任何产品 gateway。外部值只能经 typed ref、snapshot、safe conclusion、neutral adapter 或 gap 进入。 |
| 6~10. 已实现 sibling 与编译期依赖如何处理？ | 当前只有 L0-core 是条件性的 compile authority；`MI-UP-004` 尚未确认 image-specific shared contract，因此 **当前没有 active sibling Cargo dependency**。Method Library、Runtime、Tools、Member、Member Service、Artifact、Bus、builder / registry / evidence 等分别继续是 runtime、event、ref、adapter 或 fake seam，绝不能因本地目录或消费关系写入 Cargo path dependency。未来仅在正式契约批准、目标仓路径和 package / lib 名核对后，才能在正确 member 的 `Cargo.toml` 使用 local path，并记录 private tag / rev 的中期切换方案。 |

## 3. 当前材料诊断与改动前后对比

| 维度 | 改动前 / 输入状态 | 本 Step 收稳后 | 不代表 |
|---|---|---|---|
| 语言 | 00~02 有意不锁定语言；项目目录 catalog 仅给出 `Shell` 建议 | Rust workspace 成为 planned control-plane baseline；image recipe / builder backend 仍可由 adapter 承接 | 已创建 Rust 仓、选定 shell script、Dockerfile、runtime 或通过构建。 |
| Rust 版本 | Core 当前 manifest 为 edition 2024 / rust-version 1.93；本仓无 manifest | 本仓 planned baseline 对齐该受控 Core toolchain line | Core image contract 已适用，或本仓已能编译。 |
| Core 路径 | Core `crates/contracts` 物理存在 | 可作为将来获准后的路径核对候选 | `MI-UP-004` 已关闭、`core-contracts` 已被本仓依赖。 |
| sibling 关系 | 多个仓提供 / 消费 image ref 的方向已知 | 所有关系保持 runtime/event/ref/adapter/fake，不升格 source / Cargo | 对端 release、manifest、confirmation 或 event schema 已闭合。 |
| 源码注释 | 详细设计规范示例为中文，Rust 规范要求源码英文 | 文档契约与源码语言分层，保持语义 1:1 | 可以向源码拷贝中文注释或省略 public variant rustdoc。 |
| 提交 | 当前只在设计仓编写 calibration，用户禁止 commit | 记录 future preflight 与提交纪律 | 已检查 git identity、已创建 implementation ledger 或允许提交。 |

## 4. 设计取舍

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| A. 将 global catalog 的 Shell 建议直接作为控制面实现语言 | 可快速关联 image build 表象 | 无法自然承接 typed staged decisions、transaction / idempotency、guard、projection 与多个 bounded seam；也会把 build recipe 与本仓 truth 混同 | 不采用。Shell 只能是未来 builder adapter 或 asset materialization 的外部实现细节。 |
| B. 采用 Rust workspace 作为 planned control-plane baseline，保持 builder / recipe / registry 产品中立 | 能用编译边界保护 domain / port / infra 分离，并与详细设计的类型 / Rustdoc 契约一致 | 目标仓、具体 runtime 与依赖尚未落地，需要在 07 前置核验 | 采用。 |
| C. 因 external contract 未闭合而不选择任何语言 / layout | 避免早期技术承诺 | 无法进入 Step 4/5 的文件与模块契约，且不会减少 external blocker | 不采用；语言与 product / external schema 分别裁剪。 |
| D. 直接依赖现有 Core 或 sibling source | 可复用现有代码表象 | 违反 compile 裁剪并可能引入 owner / package 循环 | 不采用；只有获正式确认的 Core shared contract 才能进入 future compile lane。 |

## 5. 结构化中间产物

### 5.1 语言 / runtime 决议

| 项 | 决议 | 约束 |
|---|---|---|
| 实现语言 | Rust workspace（planned） | 用于 image asset / supply control-plane，不拥有镜像内容、component body 或外部 builder truth。 |
| edition / MSRV | edition `2024` / `rust-version = 1.93`（planned） | 目标仓 root manifest 在 07 activation 前必须落盘并真实核验；当前没有 manifest、build 或 test 事实。 |
| async runtime | 未选定 | domain 纯同步；I/O shape 由 Step 7 定义，不在 domain 引入 Tokio / runtime-specific type。 |
| framework / transport | 未选定 | `api` 若被采用只表达 logical command/query boundary，不表示 HTTP/RPC route 或 server。 |
| durable store / queue / cache | 未选定 | repository、UoW、projection 和 idempotency 先收契约；实现产品与 migration 留给 04 / 07。 |
| build / registry / evidence backend | 未选定，product-neutral | 只经 adapter port 提供 safe outcome；ACK / presence 不能成为 local candidate / eligibility / availability。 |
| image recipe / shell | 外部 materialization concern | 不能承载本仓 truth、状态机或 release contract；如后续需要，必须由 builder adapter 的受控输入 / 输出契约承接。 |

### 5.2 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 标识符、module、file、函数、变量、测试、rustdoc、普通注释和 error text 默认英文；type 使用 `UpperCamelCase`，function / module / file 使用 `snake_case`；避免不清楚、拼音、负向布尔和裸语义命名 | Step 4/5 的 planned package、crate、module、file、type 和 function 名均按英文职责命名。 |
| `standards/coding/rust.md` | public struct / enum / enum variant / trait / function 优先 rustdoc；带载荷 variant 必须说明载荷业务语义 | Step 6~8 的每个公开类型、字段、variant、trait 与函数都需能够生成完整 rustdoc；设计片段中文、源码实现英文。 |
| `standards/coding/rust.md` | rustfmt / Clippy 不替代语义审查；类型和 ownership 语义必须清晰 | 07 为每个 boundary 列 fmt / lint / test gate；本 Step 不伪造任何命令或结果。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓为 `quantalithos-<project>`；workspace member 用 `crates/<role>`；package 用 `<project>-<role>`；lib crate 用 `<project>_<role>`；代码命名不得携带 L2 | Step 4 必须使用 project slug `member-images`，并避免 `L2`、`quantalithos` 或重复项目名前缀泄漏到内部目录。 |
| `详细设计书写规范.md` 与 SOP | 详细设计按模块主轴，逐对象 / trait / flow / state 收敛；正文和中间产物必须可追溯 | Step 4/5 只建立 planned implementation boundary，Step 6 后才展开完整对象 / port / protocol。 |
| `设计真相源闭环与可落码性标准.md` | owner、字段、DTO、状态、metadata、idempotency、projection、artifact 与 phase boundary 必须闭环 | 不允许用 generic string / opaque map / external body 绕过 typed ref、history、gap 或 fail-closed。 |

### 5.3 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Domain purity | domain 只持有本仓语义、值对象、state、guard 和纯规则；不依赖 external DTO、SDK、storage、clock、runtime、config 或 async executor | future `domain`；所有 staged decision / guard。 |
| Explicit boundary type | role / component / seed / Artifact / consumer 等 external value 仅以 typed ref、snapshot、safe conclusion、contract status 或 gap 进入 | contracts、application ports、infra adapters、reference-derived。 |
| Staged truth | candidate、eligibility、availability、Artifact handoff、consumer/container state 不共享 ready enum 或 write path | build、qualification、supply 模块和所有 command / query carrier。 |
| Fail-closed | missing、stale、conflict、failed、unknown、unavailable、gap 必须在 type / error / state / result carrier 中保留 | guards、ports、handlers、projection / query。 |
| Append / supersede | revision、attempt、evaluation、transition、refresh/rebuild recovery 生成新语境，不覆盖历史 | repositories、UoW、application flow、jobs。 |
| Projection read-only | projection / cache / fake 从 committed local truth 重建，不能成为 core write source | projection、infra fake、query、jobs。 |
| No product binding | 不能在 type、module、Cargo dependency 或 config name 中锁定 builder / registry / evidence / DB / transport 产品 | infra / config / adapter 的所有 future code。 |
| No live / secret body | secret、credential、live memory/checkpoint/workspace、raw log/report、container observed state 不得进入 DTO、store、audit、trace、error 或 test fixture | contracts、domain、infra、observability / test seam。 |
| Conditional event only | inbound event 直到 `MI-UP-005` 闭口前只能 fail closed；当前无 outbound event | future worker / adapter / event protocol；不得建立 active topic/outbox delivery。 |
| Config cannot rewrite truth | config 只能装配 source / adapter / job / projection profile；改变核心判断要形成新的 revision / evaluation / transition context | config binding、application、infra。 |

### 5.4 本地多仓依赖约束表

| 依赖仓 / 边界 | 全局依赖类型 | 本地默认路径 / 已核查信息 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `L0-core` | conditional `compile` | `/home/aris/Projects/quantalithos-core`; actual candidate `crates/contracts` = `core-contracts` / `core_contracts` | **无 active dependency**；`MI-UP-004` 未闭口，任何 image-specific shared type 保持本仓私有 | 只有正式接受 image-specific shared contract 后，才在被确认的 member `Cargo.toml` 使用本地 path；再由 07 记录 private tag / rev 切换 | contracts / domain / application（仅届时受正式 shared contract 影响的部分）。 |
| `L3-method-library` | `runtime + ref` | sibling path 不构成 Cargo target | mapping source identity / safe snapshot / contract gap | owner 闭口后仍以 runtime/ref 或 approved adapter 承接，除非全局依赖分类正式变化 | reference intake、definition assembly。 |
| `L2-runtime`、`L2-tools`、`L2-member` | `ref`（及适用 runtime） | component / release 物理内容不在本仓 | opaque pinned component release ref；缺失 / incompatible 走 blocked | exact owner contract 闭口后消费 ref / safe conclusion，不写 path dependency | definition baseline、pin validator。 |
| `L2-member-service` | `runtime + ref` | consumer/host path 不构成 Cargo target | pinned entry direction、`ConsumerHandoffGap`；`MI-UP-001` pending | 双方正式校准 neutral/positive contract 后重开受影响 port / protocol / flow | supply entry、consumer handoff seam。 |
| `L1-artifact` | `ref + adapter` | Artifact owner 不是 library dependency | handoff record、owner ref 或 gap；`MI-UP-007` pending | owner contract 闭口后适配正式 consumable ref，不 mint Artifact type | qualification、supply handoff。 |
| `L0-bus` / external sources | conditional `event` / `adapter` | event source / broker 产品未选 | verified inbound event only；`MI-UP-005` pending | authority / schema 闭口后通过 adapter，不建立 sibling source dependency | conditional intake、operations reconciliation。 |
| builder / registry / evidence / seed owner | `adapter` / `ref` | no product or package authority | product-neutral port、safe outcome、gap / blocked | 04 / 07 才绑定获准产品；fake 仅测试 | infra adapter、qualification、reference-derived。 |
| test doubles | `fake` | not an external dependency | 未来只实现 parity fake / fixture | 不发布、不写 production composition、不产 readiness | infra test seam。 |

### 5.5 仓库与提交前置约束

| 项 | 当前状态 | 未来实现前必须满足 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-member-images` 未发现 | 由正式 `07` 的第一个 activation boundary 明确确认或创建；当前不得创建。 |
| Workspace root | planned | root manifest 固定 member、edition / rust-version 与 approved dependency；真实 manifest 才能成为 build authority。 |
| Git identity | 未检查，且当前禁止 commit | 在目标仓项目级检查 `user.name` / `user.email`，不使用 `--global`。 |
| Commit discipline | 未激活 | 每笔实现提交对应 07 的一个 boundary，英文 `type(scope): subject`、required checks 和固定 footer 按当时正式 07 / 项目规范执行。 |
| Implementation ledger | 未创建 | 只能在完成 07 时随 planned boundary skeleton 创建；当前提前创建会伪造实施启动。 |

## 6. 正式文档回填草稿（暂不写入）

### 6.1 第 3 章《实现约束与编码规范承接》草稿

正式 03 应以 §5.1、§5.2、§5.3 和 §5.4 的精简表格说明：本仓的 planned control-plane 使用 Rust workspace（edition 2024 / rust-version 1.93 为 planned baseline），源码英文且 public API 必须完整 rustdoc；domain 保持产品与 I/O 无关；compile 目前没有 active sibling dependency，只有在 `MI-UP-004` 关闭后才可能消费经核对的 `core-contracts`。所有 runtime/event/ref/adapter/fake 关系保持非 Cargo seam。目标实现仓缺失、git identity、Cargo manifest 和实际检查均留给正式 07 activation。

### 6.2 第 16 章《详细设计到实施计划的承接》草稿

07 的每个 implementation boundary 必须要求读取 Rust、目录、提交和实施台账规范，先核验目标仓、toolchain、approved Cargo dependency 与项目级 git identity；在完成设计 / scope gate 前不得修改代码或创建 external compatibility claim。

## 7. 待确认事项

- `MI-UP-004` 未关闭：真实 Core shared contract 的使用范围、package / module / type 仍不能写入 active manifest。
- `Q-MI-003` 未关闭：async runtime、transport、store、builder、registry、evidence backend 和 deployment product均不得在本设计绑定。
- global catalog 的 Shell 建议已被解释为 image materialization 层的建议，不是本仓控制面语言 authority；若用户或正式 implementation owner 指定非 Rust实现，必须重开本 Step、Step 4/5 与受影响的对象 / port 签名。
- 目标实现仓尚不存在，故 edition / rust-version、Cargo members、git identity和任何 fmt/lint/test 只为 planned requirement，不是已验证事实。

## 8. 完成审计与下一步门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| Rust 与源码语言边界已明确 | `pass` | planned Rust control-plane 与英文源码规则未混同为实现事实。 |
| rustdoc、命名、目录和 future commit 前置均有规范来源 | `pass` | 文档中文契约 / 源码英文的转换规则已明确。 |
| 未选定 framework、DB、broker、builder、registry、evidence 或 transport 产品 | `pass` | `Q-MI-003` 与 product-neutral adapter 不被绕过。 |
| compile/runtime/event/ref/adapter/fake 已分离 | `pass` | 当前没有 active sibling Cargo dependency；Core 仅为 conditional candidate。 |
| 目标仓不存在和 implementation gate 已显式保留 | `pass` | 未创建实现仓、manifest、ledger、代码或 commit。 |
| 未进入 Step 4 或创建未来 Step 文件 | `pass` | Step 4 仅在本 Step flow / ledger 更新后可创建。 |

```text
step_status = completed
gate_status = pass
gate_reason = language_source_and_dependency_constraints_are_explicit
next_allowed_action = create_and_complete_step_04_file_layout
formal_03_write_allowed = false
implementation_allowed = false
commit_required = false
```
