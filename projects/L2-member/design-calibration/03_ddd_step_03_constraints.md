# L2-member 03 详细设计 Step 3：收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3
> 对应正式回填章节：未来 `03-详细设计.md` §3“实现约束与编码规范承接”；§16“详细设计到实施计划的承接清单”
> 生成日期：2026-08-26
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`；本文件只形成未来回填草稿，不创建实现仓、源文件、依赖或 commit。

## 1. Step 状态

- 状态：`[x] 已确认`
- 当前模块：`constraints`
- 本步目标：在不改变已停审的 owner、业务组成部分和 external seam 边界的前提下，收稳会直接改变代码形态的语言、编码、仓库、编译期依赖、运行时隔离和安全约束；把“计划中的实现形态”与“已经存在、可编译或已集成的事实”严格分开。
- 本步边界：本 Step 可以选择计划语言与其代码组织约束，但不选择 framework、DB、queue、scheduler、IPC transport、event route、container process topology、credential shape、retry 数值或外部 adapter activation。

### 1.1 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| Step 2 与正式输入复核 | §2 输入表、Step 2 范围 / 非范围反查 | done | 仅为 CP01~CP07 的 local / support / derived-read contract 选实现约束，不扩大到相邻 owner。 |
| 语言来源冲突审计 | §3.1、§3.4 | done | 已区分权威拆分方案、项目总览的语言建议、项目正式 01 的后移决定和 historical Rust 材料。 |
| 编码与安全约束承接 | §3.2、§5 | done | Rust source、rustdoc、命名、文档、未发布规范章节与 body / external boundary 的处理口径均明确。 |
| 多仓依赖与目标仓核验 | §3.3、§6 | done | 已核验目标实现仓不存在、Core 的真实 crate 路径存在；compile / runtime / event / ref / adapter / fake / persistence 未混写。 |
| 回填草稿与自检 | §9、§11 | done | 未来正式 §3 的三张必需表已准备，允许进入 Step 4。 |

### 1.2 Step 开工与写入前确认

| 项目 | 记录 |
|---|---|
| 项目级门禁 | pass：`project_execution_ledger.md` 已记录 Step 2 `completed / pass_with_upstream_blockers`，且用户授权本轮顺序推进到 Step 4。 |
| 文档级门禁 | pass：`03_ddd_calibration_flow.md` 已将 Step 3 设为当前唯一可写 Step；正式 03 仍禁止写入。 |
| Step 级输入 | pass：已读取 Step 2、正式 `00/01/02`、02 Step 12、详细设计 SOP Step 3、详细设计书写规范 §5.3、目录组织规范、全局依赖规则、`projects/README.md`、权威拆分方案、Core 实际 manifest / contracts crate。 |
| sibling 与上游纪律 | pass_with_upstream_blockers：只读取已允许材料；`L2M-UP-001~008` 不因语言或仓库布局而关闭。 |
| 历史污染检查 | pass：旧 README / 旧 03 的 Rust、UDS、gRPC、supervisord、launch token、CloudEvents family、AG-UI 与指标均未直接继承。 |
| 本次写入类型 | Step 3 中间产物与两层设计状态台账；不写正式正文、实现代码、实现台账、测试结果或提交记录。 |

## 2. 本步输入

| 输入 | 本 Step 承接内容 | 作用上限 |
|---|---|---|
| `03_ddd_step_02_scope.md` | CP01~CP07、9 个 Application Service、34 个对象、`10 / 16 / 14 / 24 / 5` 的实现范围与非范围。 | 不把范围分母自动变为 crate、进程、schema 或外部 integration。 |
| 正式 `01-架构设计.md` §3、§8、§11、§13~15 | Core-only compile、inward dependency、transport-neutral seam、body-free、local-truth-first、未锁定技术选择。 | 语言选择不得反向改变 owner、data、seam 或状态红线。 |
| 正式 `02-概要设计.md` §3~4、§7、§11~13 | 七个业务主体 × 六层承载、Port / Store 类别、configuration 后移与详细设计承接清单。 | 不把 outline 误写成已有实现、物理 runtime 或已闭口 carrier。 |
| `02_hld_step_12_detailed_design_handoff.md` | planned module / trait / constructor / DI / UoW / adapter 外侧翻译方向，以及不允许的外部合同补造。 | 不提前定义 field、transport、DB、queue、schema 或 activation。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 3；`详细设计书写规范.md` §5.3 | 必须产出编码规范承接表、实现约束表和本地多仓依赖约束表。 | 不用泛化工程口号代替可检查约束。 |
| `standards/coding/rust.md` | 源码语言、英文标识符 / 注释、rustdoc、命名与格式规则；其未发布章节状态。 | 只使用已发布或明确说明的规则；不臆造尚未发布的 Trait / error / async / unsafe 细则。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓默认路径、Rust workspace / package / crate 命名与 role 目录规则。 | 目标仓尚不存在时仅形成 planned layout。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 唯一编译期依赖类型；其他关系必须保持 runtime / event。 | runtime、event、ref、adapter、fake 不进入 Cargo path dependency。 |
| `projects/README.md` §1.1、27 仓清单、§8.2 | 实现仓命名、`member-Go` 语言建议、实施前 git config / 英文 commit message 规则。 | 语言建议不是 project-specific accepted ADR；本仓当前不提交。 |
| `architecture/仓库拆分方案.md` §5.1；`architecture/adr/0003-identity-rust-stack.md` §6 | 权威 A 方案把 `quantalithos-member` 列为 Rust；ADR-0003 明确只约束 identity，不可作为 L2 的直接技术栈授权。 | 只把该仓条目与当前直接基线共同用于本 Step 的语言裁决；不继承其旧六模块、UDS、端口、token、supervisord 或指标。 |
| `/home/aris/Projects/quantalithos-core/Cargo.toml` 与 `crates/contracts/Cargo.toml` | 真实 workspace 形态、`core-contracts` package / `core_contracts` crate、`../quantalithos-core/crates/contracts` 路径、edition 2024、`rust-version` 1.93。 | 仅证明 Core 当前 Rust 编译期契约入口存在；不证明 member-specific schema / route 已闭口。 |

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖？

本 Step 将 Rust 收稳为 **planned implementation language**，而不是对已有实现的描述。选择只解决本仓内部实现和唯一已确认编译期 Core contract 的可落码性；它不改变 `L2-runtime` 的 Python owner、`L2-tools` 的行动 contract、host lifecycle、image supply，或任何 host / Runtime / Bus 的物理载体。

| 项 | Step 3 结论 | 依据 | 明确不推出 |
|---|---|---|---|
| 实现语言 | planned Rust。 | 权威 `architecture/仓库拆分方案.md` §5.1 明确列 Rust；当前 Core 的唯一可用编译期入口是 Rust `core-contracts`；当前仓已有 Rust 编码与目录规范输入。 | 目标仓已创建、toolchain 已安装、已编译或外部仓必须以 Rust 协作。 |
| edition / MSRV 下限 | planned Rust 2024；`rust-version` 不低于 Core 当前 contracts crate 的 1.93。 | Core workspace manifest 当前为 edition 2024 / rust-version 1.93；直接使用该 crate 时必须满足其最低版本。 | 已验证本机或 CI 的具体工具链版本。 |
| 容器内 runtime 形态 | planned library + explicit entry assembly；物理常驻进程数、binary、supervisor、sidecar 与启动顺序未锁定。 | 正式 01 的 transport-neutral / lifecycle-owner boundary。 | single / dual process、supervisord、容器 readiness、host health 或 image compatibility。 |
| framework | 不选择。 | 当前没有 framework authority，且 host / Runtime entry mapping 仍被 `L2M-UP-001/003/004` 限制。 | HTTP、gRPC、UDS、TCP、pipe、shared memory 或外部 listener。 |
| storage / queue / scheduler | 不选择。 | `L2M-DDD-002` 与正式 01 的 physical persistence / workload 未定。 | DB schema、durability、outbox carrier、retry / retention 参数。 |
| Quantalithos 编译期依赖 | planned only: `core-contracts`。 | 全局依赖裁剪 + Core 真实 manifest。 | `L0-bus`、SDK、Runtime、member-service、identity 或任何 sibling 的 Cargo dependency。 |
| 第三方依赖 | 未选择。 | 本 Step 不以实施便利性预设 serde、async runtime、web framework、ORM、message client 或 error crate。 | 它们不存在、被禁止，或未来不能按受控决定引入。 |

#### 语言来源冲突裁决

`projects/README.md` 将 `member-Go` 标为“语言建议”，而权威拆分方案 §5.1 记载 Rust；正式 `01-架构设计.md` 则有意将 Rust / Go / Python 后移给 03 及后续受控决定。这三者不应被简化为“最新文件自动覆盖一切”：项目总览的建议没有 project-specific ADR 效力，正式 01 也没有选择 Go，而是允许本 Step 在不违反边界的前提下完成语言决策。

| 来源 | 原始效力 | 对本 Step 的判断 | 裁决 |
|---|---|---|---|
| `architecture/仓库拆分方案.md` §5.1 | A 方案权威拆分文档；`quantalithos-member` 明确为 Rust。 | 是当前可验证的项目级语言方向，但其旧模块和 transport 细节已被 full-restart 降级。 | 作为 Rust 计划语言的主要正向依据。 |
| `projects/README.md` 27 仓清单 | 项目文档体系总览；字段名是“语言建议”。 | `member-Go` 与权威拆分文档冲突，且没有 Go 语言规范、Go Core binding 或 project-specific ADR 支持。 | 不足以单独覆盖；记录为已裁决的文档不一致。 |
| 正式 `01-架构设计.md` §11.2 | 当前本仓正式架构基线。 | 语言尚未在 01 锁定，但明确允许在后续受控阶段选择；没有排除 Rust。 | 本 Step 选择 Rust 不构成回写 01，也不复活旧 carrier。 |
| `architecture/adr/0003-identity-rust-stack.md` | 已接受 ADR，但 §6 明确只约束 identity。 | 不能把“与 L2 Rust 栈一致”的旧理由当成 member 的直接 ADR。 | 不作为直接授权，仅作“不得误用”的反向审计证据。 |
| 旧 README / 旧正式链 / ADR-0005 中 Rust 静态二进制叙述 | historical material 或仅供 image 角色供给裁剪。 | 其中的技术载体曾被明令不得直接继承。 | 不作为本次选择依据。 |

因此关闭文档校准问题 `L2M-DOC-002`：Rust 是此 detailed-design Step 的 planned language；若出现明确的项目级 Go ADR、Go Core binding / contract、或正式 00 / 01 回开为 Go，本 Step 与 Step 4 必须一起回开，不能通过 adapter、build script 或双语言目录静默漂移。

### 3.2 Rust 编码规范中哪些内容会影响结构体、错误、Trait、async、测试和注释？

| 规范来源 | 必须遵守的内容 | 对本文及后续 Step 的影响 |
|---|---|---|
| `standards/coding/rust.md` “源码语言约束” | 标识符、模块、类型、函数、变量、测试名，以及普通 / rustdoc / error 注释默认英文；中文只可作为有理由的业务数据、协议样例、i18n 或 fixture。 | Step 4 的目录 / 文件 / package / crate 命名使用英文；未来 Step 6~9 的 Rust snippet 以英文 source names 表达。设计正文可继续用中文解释，不能把中文示例注释复制进源码。 |
| `standards/coding/rust.md` “Rust 文档注释与 rustdoc” | public module、trait、type、struct、enum、enum variant、function 优先使用 `///`；crate / module overview 使用 `//!`；公开 enum 每个 variant 必须有文档注释，载荷语义必须说明。 | Step 6 的每个 public type / variant / function 必须给出 source-English rustdoc 草案；Step 7 的 public Port / adapter contract 与 Step 8 的 public DTO 同样必须有 docs。 |
| `standards/coding/rust.md` 命名与格式已发布部分 | crate 内词序一致、英文语义清晰、避免无意义 feature 名、遵循标准所有权命名；格式与 import grouping 接受 rustfmt / lint 辅助。 | 不得把 `L2`、`member_runtime_persona`、`common`、`utils`、含糊 `manager` 等设计导航或泛化名带入实施命名；未来实施计划再定义实际 `cargo fmt` / clippy command。 |
| `standards/coding/rust.md` 文档状态 | Trait、错误处理、内存、并发、Unsafe、安全等章节明确仍未发布。 | 不把缺失章节伪装成已存在规范。Step 6~13 仍必须依据详细设计 SOP、正式 00~02 的 owner / state / error 红线和正式 trait / flow 契约逐项落码；若需要新增一般性 Rust 规则，应先补标准或获得受控决定。 |
| 详细设计 SOP §2.5、Step 6~10 | 详细设计本身必须给 type / field / function / enum variant、trait、flow、state 足够的可实现信息。 | 设计中的 Rustdoc 样式注释可用中文说明业务含义；真正源码必须将等义文档改为英文，而不能因编码规范未覆盖 error / async 而省略契约。 |

对尚未展开的实现领域，本 Step 采用以下最小、可检验的约束，而不假设库或 runtime：

| 领域 | 当前约束 | 后续收口位置 |
|---|---|---|
| struct / enum / error | public DTO、value / ref、error、state enum 的 source-English docs、字段 / variant / payload 语义必须完整；业务失败通过已定义的 typed result / error surface 表达。 | Step 6 对象、Step 8 protocol、Step 12 error model。 |
| Trait / Port | Trait 只表达 inward boundary；Domain 不 import adapter / transport；具体 async trait shape 必须先由 logical Port 的 I/O 需求和 owner contract 证明。 | Step 7。 |
| async / concurrency | Domain policy、state transition、Query no-write 不因 future / task 而绕过本地 transaction、unknown fence 或 append history；没有 I/O 需要或正式 carrier 时不强行 async。 | Step 7、9、11、13。 |
| test | source test names英文；fake 必须实现同一 formal Port semantics，不能把 fake private map、planned adapter 或 local receipt 伪装成 external acceptance。 | Step 16 与 `05-测试方案.md`。 |
| unsafe / panic | 当前设计没有任何需要 `unsafe` 的 boundary；若实施者发现需要，必须暂停并回开 Step 3 / 相应对象或 adapter contract。公开 API 的 panic 条件不能被隐去。 | Step 6~12 与实施前审计。 |

### 3.3 实施者开始前必须阅读哪些提交规范和 git config 用户要求？

本任务不授权提交。未来独立实施开始前，实施者必须阅读本仓正式 `00~07`（其中 `07` 尚未生成）、当前语言编码规范、目录组织规范与 `projects/README.md` §8.2，并在目标实现仓内核验：

```text
git repository initialized
git config user.name = quantalithos-labs
git config user.email = quantalithos.ai@gmail.com
implementation commit message = English
```

这些是实施前检查，不是本轮已执行的命令或已配置的事实。当前设计仓的提交同样未获用户授权，`commit_required = false`。

### 3.4 哪些安全、鉴权、网关或外部边界不应在本仓实现？

| 约束 | 说明 | 影响的 planned 实现单元 / 接口 |
|---|---|---|
| owner 不越界 | 不实现 LLM reasoning / plan / memory / checkpoint / tool execution、capability registry、host lifecycle、image supply、sandbox truth、Governance approval、Conversation / Artifact body、Bus delivery 或 observability backend。 | 所有 domain / application / infra；外部能力只能是 inward Port、typed ref、safe snapshot、attempt / gap。 |
| external boundary 不自行补齐 | 不实现 generic listener、provider、MCP / A2A / API adapter；不因 Rust 选择而选择 UDS、gRPC、HTTP、port 或 external RPC server。 | future `api` / `worker` / `infra` entry assembly 只能承接正式 host / Runtime / Bus / owner seam。 |
| body-free | raw body、hidden reasoning、secret、definition body、complete log、evidence body 不进入 struct、store、event、trace、view、fake 或 diagnostic。 | contracts、domain、application、infra、tests。 |
| subject / credential fail-closed | 正向仅 `ProjectMemberRef + GlobalMemberRef`；不可验证 credential、unknown subject / rule / source / external side effect 均不默认放行。 | presence / inbound / runtime mediation 的 Domain guard、Port result、entry adapter。 |
| local truth first | external feedback 只形成 link / successor / gap，不能回滚或覆盖 local decision / history；Query 不触发 write / refresh / replay。 | application UoW、local store、projection、job、Query handler。 |
| no direct sibling code | Runtime、Tools、Bus、SDK、member-service、member-images、Work / Identity / Governance / Conversation / Artifact 等均不能被 import 为 package。 | Cargo manifests、application Ports、infra adapter boundary、test fakes。 |
| no hidden physical choice | Rust 不是 DB、queue、scheduler、transaction product、transport、process manager、secret store 或 SLO 的代名词。 | `infra` / runtime builder / config binding only；具体选择留给后续 authority。 |

### 3.5 本仓是否依赖已经实现的 Quantalithos 仓库？

目标实现仓当前不存在：

```text
/home/aris/Projects/quantalithos-member  -> missing
```

已核验的直接 compile candidate 只有：

```text
/home/aris/Projects/quantalithos-core
  Cargo.toml
  crates/contracts/Cargo.toml
    package = core-contracts
    lib     = core_contracts
```

Core workspace 当前使用 edition 2024、`rust-version = 1.93`。这只支持 planned Rust 编译期关系；当前 `core-contracts` 中并没有由本 Step 擅自认定为 member-specific 的 event family、subject、payload 或 route，`L2M-UP-005` 继续开放。

其余已核验路径状态如下：

| 路径 | 当前状态 | 对本 Step 的含义 |
|---|---|---|
| `/home/aris/Projects/quantalithos-runtime` | missing | 不能用本地源码、Cargo 或 private path 推导 Runtime integration。 |
| `/home/aris/Projects/quantalithos-tools` | missing | 不能把 Tools action contract 变成 package dependency。 |
| `/home/aris/Projects/quantalithos-member-service` | missing | 不影响 host owner boundary；仅说明不能预设本地 client crate。 |
| `/home/aris/Projects/quantalithos-member-images` | missing | image supply 不是 package dependency，也不由 member 建立。 |
| `/home/aris/Projects/quantalithos-bus`、`quantalithos-sdk`、`quantalithos-identity`、`quantalithos-conversation` | exists | 存在不改变其 runtime / event / downstream 分类；禁止因存在而添加 Cargo path dependency。 |

## 4. 依赖分类与本地多仓约束

### 4.1 本仓依赖分类表

| 关联项目 / 类型 | 全局依赖类型 | 本仓实现方式 | Cargo / package 口径 | 当前限制 |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile | planned shared primitive、metadata、error / envelope category 的 Rust crate 引用。 | 唯一允许进入 planned Cargo workspace dependency 的 sibling。 | 只能使用已经正式存在的 shared surface；member-specific schema / route 仍是 `L2M-UP-005`。 |
| `L0-bus` | event | inbound Consumer、semantic event candidate、publication intent / local attempt、feedback re-entry。 | 不是 Cargo dependency。 | delivery、redelivery、topic / route 与 external acceptance 外置。 |
| `L2-runtime` | runtime | `RuntimeEntryPort`、`RuntimeMaterialSourcePort`、blocked-aware adapter / fake seam。 | 不是 Cargo dependency。 | `L2M-UP-003/004` 未闭口；不创建 run 或 Runtime client contract。 |
| `L2-member-service` | runtime | `HostCollaborationPort`、startup / host feedback logical seam。 | 不是 Cargo dependency。 | `L2M-UP-001/006` 未闭口；不选择 IPC、credential 或 health carrier。 |
| `L2-member-images` | ref / supply | pinned component release / entry availability 的 local blocked or waiting interpretation。 | 不是 Cargo dependency。 | `L2M-UP-002` 未闭口；image / manifest / compatibility 不进入 member model。 |
| Work / Identity | runtime(ref) | project execution subject、global identity anchor 的 resolver / safe view Port。 | 不是 Cargo dependency。 | 不复制 lifecycle，不以 GlobalMember 替代 ProjectMember。 |
| Governance | runtime + event(ref) | rule safe-result resolution；CP06 作为唯一 member-side source update Consumer owner。 | 不是 Cargo dependency。 | `L2M-UP-007` 未闭口；不自建 policy / allowlist。 |
| Tools / Method | runtime(ref, optional) | CP06 resolution 与 CP07 ref-derived outlet source。 | 不是 Cargo dependency。 | 不复制 definition / registry / authorization / invocation / execution。 |
| Conversation / Artifact / Observability | event / handoff(ref) | body-free outbound / observation material、trace relation、local attempt / gap。 | 不是 Cargo dependency。 | 不拥有 append、body、evidence、observed 或 backend truth。 |
| SDK | downstream API wrapper boundary | member 暴露正式 edge 后由 SDK 封装。 | 明确禁止反向 Cargo dependency。 | 不将 SDK 当 member transport 或 handler framework。 |
| adapter | local infra implementation category | 把 formal carrier 翻译到 inward Port；exact carrier pending 时仅有 blocked-aware shape。 | 不是 dependency 类型。 | adapter existence 不表示 integration、delivery、acceptance 或 readiness。 |
| fake | local test implementation category | 同一 Port 的 deterministic test double。 | 不是 runtime / event / compile dependency。 | fake 不获取 external truth，不补造 schema，不作为 evidence。 |
| persistence | local technical carrier category | local truth / support / projection Store 的 future implementation。 | 不是 sibling dependency。 | DB / transaction product 尚未选择；不得共享外部 DB。 |

### 4.2 本地多仓编译期依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的 planned 实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile | `/home/aris/Projects/quantalithos-core` | planned local path dependency，仅 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。 | private git tag / rev；是否切换由未来 `07-实施计划.md` / release 阶段决定。 | contracts、domain、application、infra，以及最终确有 shared type 需要的 entry crate。 |

下列写法只是未来目标仓 root `Cargo.toml` 的计划草图，不是已创建文件：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

它不授权为 `L0-bus`、Runtime、member-service、member-images、SDK、Identity、Governance、Conversation、Tools、Method 或任何外部系统增加 path dependency。若 future Core 把 contract 形态改为 published binding、private tag / rev、或非 Rust binding，本 Step 与 Step 4 的对应条目必须回开。

## 5. 实现约束表

| ID | 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|---|
| `DDD-C-L2M-001` | Rust 仅是 planned implementation language | 使用 Rust 2024，并满足 Core contracts 当前 rust-version 下限；不把计划语言写成现有实现。 | workspace root、全部 planned crate；Step 4 layout。 |
| `DDD-C-L2M-002` | `core-contracts` 是唯一 planned sibling compile dependency | 所有其它协作必须保持 runtime / event / ref / adapter / fake / persistence 分类。 | Cargo manifest、contracts、application Ports、infra adapter。 |
| `DDD-C-L2M-003` | code direction must remain inward | entry / worker / job 调 application；application 调 domain / Port；infra 实现 Port；domain 不读 transport、config 或 external code。 | future API / worker / jobs / application / domain / infra crates。 |
| `DDD-C-L2M-004` | framework、transport、store、scheduler、process topology 不锁定 | 不可因为已经选 Rust 而引入 axum、tonic、tokio、ORM、NATS client、UDS、supervisor 或具体 binary topology。 | infra runtime builder、api / worker assembly、configuration。 |
| `DDD-C-L2M-005` | source-English plus rustdoc | source identifier / comment / test name English；public item / enum variant docs complete；design comment and source comment language must not be confused. | all planned crates；future Step 6~8 source snippets。 |
| `DDD-C-L2M-006` | body-free and fail-closed are code constraints | no raw body / secret / reasoning in type, store, fake, event, trace, view; unknown never becomes success by default. | contracts, domain, application, infra, tests. |
| `DDD-C-L2M-007` | source-specific external seam only | no generic provider / listener / MCP / A2A / API adapter; unclosed seam returns blocked / waiting / stale / gap or reject. | application Ports、infra seam modules、entry adapters。 |
| `DDD-C-L2M-008` | query and projection write boundary | Query no-write；CP06 receives rule / capability source updates；CP07 only consumes committed resolution / gap and cannot backwrite. | application query service、mirror / read-model domain and store / jobs。 |
| `DDD-C-L2M-009` | target repository is absent | every Cargo path, directory and crate name is planned only; no compile / test / CI / artifact implication. | Step 4、future 07 PH-01 precondition。 |
| `DDD-C-L2M-010` | implementation and commit are separately gated | implementation starts only after formal 03~07 and independent authorization; this design task has no commit authority. | future implementation ledger / commit gate; current task no-op. |

## 6. 当前文档问题诊断

| 观察 | 若误用的后果 | 本 Step 处置 |
|---|---|---|
| 01 有意不锁语言，旧 README 却把 Rust facade 当既成事实。 | 可能把 full-restart 的技术去污染倒退为旧 implementation copy。 | 不使用旧 README；以 Step 3 的 authority audit 重新选择 planned Rust，且不继承 UDS / gRPC / supervisor / token。 |
| `projects/README.md` 的 `member-Go` 建议与权威拆分方案 Rust 记录冲突。 | 随意选 Go 会没有当前编码规范、Core direct compile shape 与 binding authority；随意选 Rust 又会忽略冲突。 | 明确记录 `L2M-DOC-002`、按来源效力裁决并给出 reopen trigger。 |
| Core 实现仓存在，但仅 contracts crate 是本仓可用 compile candidate。 | 很容易把 Bus、SDK、Identity 或 sibling “仓存在”偷换成 path dependency。 | 使用真实 package / crate / path 仅为 `core-contracts` 建 planned relation；其余逐项降回正确分类。 |
| Rust 编码规范的 Trait / error / concurrency / unsafe 章节尚未发布。 | 可能编造所谓团队规则，或以规范缺口为由省略 detailed contract。 | 不编造；保留 SOP / formal design 对 type、Port、flow、state、error 的强制具体性，并把 source-level general rule 缺口列为后续受控检查。 |
| 目标实现仓不存在。 | planned workspace 容易被错误叙述为已存在并可运行。 | 将所有路径、Cargo 与 file layout 标为 `planned`，不运行构建或测试。 |

## 7. 改动前后对比

| 项 | 改动前 / 未裁决口径 | Step 3 后口径 | 原因 |
|---|---|---|---|
| 语言 | 01 只说未锁定；旧材料则暗示 Rust；总览另给 Go 建议。 | planned Rust 2024，附 authority audit 与 reopen trigger。 | 为 Step 4 形成可审查代码形态，同时不把旧技术载体整体继承。 |
| Rust coding input | 仅被 flow 列为待读，容易被误当完整标准。 | 已发布命名 / source-English / rustdoc 规则可用；未发布章节明确不伪造。 | 防止 source comments、trait、error、async 规则被模糊处理。 |
| Core relation | “Core only compile”停在抽象分类。 | 当前真实路径为 `../quantalithos-core/crates/contracts` / package `core-contracts`。 | path 不能凭空假设，且不等于 member-specific event schema 已闭口。 |
| sibling relation | 可能把本地目录或 planned adapter 当作 source dependency。 | compile / runtime / event / ref / adapter / fake / persistence 分别落表。 | 遵守全局裁剪与 owner separation。 |
| runtime shape | 容易由 Rust 推出 UDS、gRPC、process manager 或多 binary。 | library / entry assembly 可规划，物理 process / transport 继续 pending。 | `L2M-UP-001~004` 与 host lifecycle 仍未闭口。 |
| commit | 历史标准和当前任务混杂。 | 只记录未来实施预检；当前不提交。 | 用户未授权 commit，且 07 未生成。 |

## 8. 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| A. 继续把语言推迟到 07。 | 避免现在选择。 | Step 4 无法给出真实 package / crate / compile path，违背 Step 3 的目标。 | 不采用。 |
| B. 直接采用 `member-Go` 建议。 | 与项目总览一行文字一致。 | 该字段只是建议；没有 Go 编码规范、Core Go binding 或 project-specific ADR，且会让已确认的 Core compile relation失去当前可落码路径。 | 不采用。 |
| C. 采用 Rust 作为 planned language，使用当前 Core contracts crate，但不选择 framework / carrier。 | 具有权威拆分依据、实际 compile path 和代码规范；能支撑 Step 4。 | 仍须严防旧 Rust transport / supervisor 假设回流。 | 采用。 |
| D. 复活旧 Rust facade + UDS / gRPC / supervisor / token。 | 看似快速具体。 | 违反 full-restart、formal 01 的未锁定项和 `L2M-UP-001~006`。 | 不采用。 |
| E. 将所有 sibling 加入 workspace 以获得“统一类型”。 | 表面上调用方便。 | 违反 Core-only compile，吞并 external truth 并形成循环。 | 不采用。 |

## 9. 结构化中间产物

### 9.1 编码规范承接表（未来正式 §3）

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust source identifiers / comments / tests English；public API / enum variant rustdoc complete；published naming / format rules。 | future crate / file / type naming，Step 6~8 的 source-English Rust contract。 |
| `standards/document/详细设计讨论流程_SOP.md` | type、field、function、enum / variant、Port、flow、state 必须 1:1 可实现。 | 未发布的 Rust general rule 不得成为省略 schema / error / async contract 的理由。 |
| `standards/document/子项目目录与代码文件组织规范.md` | implementation repo、workspace role、Cargo package / crate / binary 命名规则。 | Step 4 采用 planned Rust workspace，禁止架构层级与项目名前缀泄漏。 |
| `projects/README.md` §8.2 | future implementation repo git identity and English commit message requirement。 | 只作为未来实施预检；当前不提交。 |

### 9.2 实现约束表（未来正式 §3）

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| planned Rust 2024 + Core MSRV compatibility | Rust 是本仓 detailed-design 的计划语言；Core contracts 当前要求 rust-version 1.93。 | workspace root and all crates。 |
| Core-only compile | only `core-contracts` may be a sibling Cargo dependency。 | contracts / domain / application / infra。 |
| external seam remains transport-neutral | no framework / UDS / gRPC / HTTP / process topology / carrier selection。 | api / worker / jobs / infra assembly。 |
| owner, body-free, local-truth-first, unknown fence | 语言 / runtime 不能改变已停审 domain red lines。 | all modules and test fakes。 |
| target repo absent | layout and Cargo relation are planned, not implementation facts。 | Step 4 and future implementation plan。 |

### 9.3 本地多仓依赖约束表（未来正式 §3）

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile | `/home/aris/Projects/quantalithos-core` | planned `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | private git tag / rev | contracts / domain / application / infra，按后续 crate dependency matrix 裁剪。 |

所有 runtime、event、ref、adapter、fake 与 persistence 关系必须在后续 Port / adapter / event / projection / fake 章节表达，不进入该表。

## 10. 回填草稿

### 10.1 未来正式 §3“实现约束与编码规范承接”草稿

未来正式正文应说明：`L2-member` 的计划实现语言为 Rust 2024；这一选择来自权威拆分方案的成员仓条目，并通过当前 `L0-core` `core-contracts` crate 的真实 package / path / MSRV 形态复核。它只确定本仓内部实现的语言和 compile contract 入口，不代表目标实现仓已存在，也不锁定 framework、DB、queue、scheduler、IPC、HTTP / gRPC / UDS、process topology、credential、event route 或 external adapter。

正式 §3 应保留 §9.1~§9.3 三张表，并明确：源码 identifier、comment、rustdoc、error comment 与 test name 使用英文；public enum variant 不得省略 rustdoc；`core-contracts` 是唯一 sibling Cargo dependency；其余协作只能经 runtime / event / ref / adapter / fake / persistence boundary。它还应写明 external positive lane 仍受 `L2M-UP-001~008` 限制，`core-contracts` 的存在不闭合 member-specific Core schema / route。

正式 §3 不应写语言冲突的工作过程、历史 Rust / Go 争论、已检查的本机路径、actual toolchain、commit、CI、test result 或 implementation status；这些内容仅留在本 Step 和未来实施计划。

## 11. 待确认事项

- `L2M-UP-001~008` 全部保持开放；Rust 语言与 workspace 布局不会关闭 host / image / Runtime / Core event / credential / rule taxonomy / third-subject contract。
- `L2M-DDD-001`（目标实现仓不存在）保持开放，限制所有布局为 planned；它不阻塞 Step 4 的文件契约讨论，但阻塞真实实现开工。
- `L2M-DDD-002`（physical persistence、UoW、durability、idempotency carrier、workload / measurement）保持开放，限制后续 Step 11~16 不得早选 DB、queue、scheduler 或数字指标。
- `standards/coding/rust.md` 尚未发布 Trait / error / concurrency / Unsafe 等专项章节；这不是允许漏写契约的例外。若后续需要超出 SOP、正式设计和已发布编码规则的通用语言策略，必须停下补充标准或回开此 Step。
- `L2M-DOC-002` 已在本 Step 关闭：若出现明确的 member Go ADR、正式 Go binding / Core contract 或项目正式基线回开，必须重开 Step 3 / 4；在此之前不得并置 Go layout 或 dual-stack 作为“暂时兼容”。

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 语言来源冲突已显式处理 | pass | Rust 为 planned language；Go 建议未被无证据继承；reopen trigger 已写明。 |
| 已点名编码规范与 rustdoc / variant 约束 | pass | source-English、public docs 与未发布章节边界均明确。 |
| 实现约束未越过架构边界 | pass_with_upstream_blockers | framework、transport、store、process topology、external contract 继续未锁定。 |
| 多仓依赖分类真实 | pass | 只有 Core contracts 进入 planned Cargo path；其余不伪装为 package dependency。 |
| Core path 来自真实 layout | pass | `/home/aris/Projects/quantalithos-core/crates/contracts`、`core-contracts` / `core_contracts` 已核验。 |
| 目标仓状态诚实 | pass | `/home/aris/Projects/quantalithos-member` 缺失；无编译、测试、CI 或 implementation claim。 |
| 未创建 future Step 文件或正式正文 | pass | 仅创建当前 Step 3 中间产物；Step 4 尚未创建。 |
| Step 4 内容门禁 | pass | planned language、source naming、dependency path、runtime non-choice、目录规范与 layout guard 已足够进入文件布局讨论。 |

```text
step_03_status = completed
step_03_gate = pass_with_upstream_blockers
next_allowed_action = read_step_04_file_layout_inputs_then_create_and_complete_03_ddd_step_04_file_layout.md
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
