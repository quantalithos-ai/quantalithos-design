# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态与开工确认

- 状态：`completed / pass_with_upstream_blockers`；`current_part = closed`。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 3；未来回填正式 03 §3/§16。
- 开工依据：[Step 2](03_ddd_step_02_scope.md) 已通过；项目 ledger 与 03 flow 允许进入 Step 3。
- 写入边界：本步只固定会影响代码形态的 planned 语言/runtime/仓库/依赖约束，不创建目标仓或修改 git config。

### 1.1 本 Step 串行计划

1. 读取 Rust 编码规范、目录组织规范、提交规范及正式 01/02 技术边界。
2. 只读检查目标实现仓、Core sibling、Cargo workspace/crate 路径和共享符号。
3. 回答语言/runtime、Rustdoc、提交、安全边界和十项 sibling dependency 问题。
4. 形成规范、实现约束和多仓依赖表；审计旧技术选择并同步门禁。

## 2. 本步输入与事实核验

- [Step 2 范围](03_ddd_step_02_scope.md)；[正式 01](../01-架构设计.md) §7/§8/§10~§13；[正式 02](../02-概要设计.md) §3/§7/§11~§13。
- `standards/coding/rust.md`、`standards/document/详细设计书写规范.md`、`standards/document/子项目目录与代码文件组织规范.md`、`standards/document/设计真相源闭环与可落码性标准.md`。
- `projects/README.md` §8.2 的提交规则；当前设计仓 git identity 只读结果为 `quantalithos-labs <quantalithos.ai@gmail.com>`，本轮未修改。
- `L1-workspace`、`L1-governance`、`L1-artifact` Step 3 仅作决策粒度样本，不继承其业务依赖。

| 只读观察 | 事实 | 本步允许结论 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-archive` 不存在 | 只能写 planned Rust workspace；目标仓 git/Cargo/baseline 均未验证 |
| Core sibling | `/home/aris/Projects/quantalithos-core` 存在 | 可核验真实路径，不能由“存在”推导所有 Core 类型可复用 |
| Core workspace | edition=`2024`、rust-version=`1.93` | 可作为本仓 planned toolchain 基线；实施前必须重新核验 |
| Core shared crate | `/home/aris/Projects/quantalithos-core/crates/contracts`；package=`core-contracts`；crate=`core_contracts` | 允许成为唯一 sibling compile dependency |
| 已核验 shared symbols | `ActorContext`、`ActorRef`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`RequestId`、`TraceId`、`Timestamp` 在 formal 03 与实际 exports 可定位 | 后续按 Archive 字段语义选择；不能导入 Core domain/application/infra |
| 本地 sibling 存在性 | core/bus/sdk/identity/conversation/work/process/governance 存在；artifact/workspace/observability/archive 不存在 | 除 Core contracts 外，存在或不存在均不改变 runtime/event/ref/adapter 分类 |

## 3. SOP 问题回答

1. **本仓使用什么语言、runtime、框架和主要依赖？** 选择 planned Rust workspace、Rust 2024 edition、MSRV 1.93；同步纯领域逻辑不依赖 executor，异步入口/adapter/worker 使用 Tokio 1 系列。唯一确认的 sibling compile dependency 是 `core-contracts`。传输框架、DB driver、Bus client、object storage、KMS、compression、signature/schema client 均未选择；`serde`/`thiserror` 等只在后续协议/错误契约证明需要时收口版本与 feature。
2. **Rust 规范怎样影响 struct/error/trait/async/test/comment？** 类型与 trait 用 `UpperCamelCase`，module/file/function/method/variable/test 用 `snake_case`，package 用规范要求的 kebab-case、lib crate 用 snake_case；错误须是有边界的 typed error，不以任意字符串吞并 unknown/conflict；domain 保持同步无 I/O；异步 trait 的 object-safety/`Send`/取消语义留 Step 7/9 逐 port 明确；测试名和源码注释使用英文。
3. **Rustdoc 是否强制，怎样注释？** 强制。crate/module 用 `//!`；公开 struct/enum/trait/type/function 与公开字段、每个 enum variant 用 `///`；带载荷 variant 说明载荷，函数说明行为、错误、副作用和必要的 panic 条件。设计正文用中文，Rust code block 内注释用英文。
4. **实施者开始前阅读什么提交/git 要求？** 必须阅读 Rust 规范、目录组织规范、`projects/README.md` §8.2 和未来正式 07 的阅读/提交章节；目标实现仓代码 commit 使用英文，若目标仓有更严格规则则从严；实施前在目标仓本地核验项目级 git identity。当前没有目标仓，不能把设计仓 git identity 当目标仓已配置证明。
5. **哪些安全/鉴权/网关/外部边界不在本仓？** 不实现 credential/KMS/secret truth、全局认证、owner authorization/policy engine、API gateway、observability backend、SDK client/cache、provider truth 或跨域恢复写入。入口只消费可信 `ActorContext`/metadata 和正式 decision/material/ref；adapter 不获得业务 authority。
6. **是否依赖已实现 Quantalithos 仓？** 依赖图涉及多个仓，但只有 `L0-core` 是 compile candidate；Bus/L1/workspace/artifact/observability/SDK 等均保持 runtime/event/ref/adapter。
7. **哪些是已确认 compile dependency？** 仅 `core-contracts`。不引入 `core-domain`、`core-application`、`core-infra`、`core-jobs`、`core-cli`；也不引入任何 L1/L4 sibling 或 SDK crate。
8. **依赖仓路径是否存在？** Core 真实路径存在且 manifest 已核验；目标 Archive 仓不存在。实施前需重新检查路径、版本和导出，失败即阻塞 compile wiring。
9. **当前和中期引用方式？** 当前 planned 写法为 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；中期可切 private git tag/rev，但只能由 07/版本发布阶段固定，不能默认为 public crates.io。
10. **哪些关系不能成为 Cargo path dependency？** `L0-bus`、所有 L1 owners、`L1-workspace`、`L4-observability`、`L0-sdk`、外部 storage/integrity/KMS/compression/schema capability、restore receivers 与产品 consumer；它们只在 port/adapter/event/ref/fake 或下游协议中表达。

## 4. 当前文档与规范问题诊断

| 位置 | 问题 / 风险 | 本步处理 |
|---|---|---|
| 正式 01 §11.2 | 架构阶段明确不固定语言/数据库/provider | 本步基于 Rust 专项标准、Core compile 生态和 03 可落码要求选择 planned Rust；不继承旧 README |
| 详细设计 SOP/书写规范 | 要求“中文 Rustdoc” | 与更具体的 `standards/coding/rust.md` 源码英文规则冲突；正文中文、可转写 Rust code block 注释英文 |
| 正式 02 `WorkerContext` | 只是语义槽位，Core contracts 无同名已核验 symbol | 后续定义 Archive-local worker context 或核验新的 shared contract，不伪称 Core import |
| Core generic refs/version | 类型存在不代表适合 Archive 的 owner-specific/version/fence 语义 | 只列最小 shared metadata 候选；Archive typed refs/version 后续闭口 |
| sibling repo | 多个本地仓存在，容易被误写成 compile dependency | 只允许 Core contracts；其他路径不进 Cargo graph |
| 旧 README/03 | 固定 PostgreSQL、S3/MinIO/Glacier、AES/SHA、provider/参数 | 全部不继承；相应能力保留 port/config blocker |
| async runtime | 正式架构要求后台与异步消费，但未选择 executor | planned Tokio 1 只进入 runtime/infra/worker；不进入 domain/application contract semantics |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言/toolchain | 正式架构未固定；旧材料固定 Rust 不可信 | planned Rust 2024 / MSRV 1.93，实施前复核 | 与当前专项标准及 Core compile 基线一致 |
| executor | 有后台/异步角色，无具体 runtime | Tokio 1 系列仅用于 I/O runtime；domain 同步 | 支撑 worker/adapter 且保持核心纯净 |
| shared dependency | `L0-core` 是 compile candidate | 精确到 `core-contracts` 真实 path 与最小符号核验 | 防止把整个 Core 或 sibling 实现纳入 |
| 注释语言 | SOP 中文与编码规范英文冲突 | 中文设计说明 + 英文源码/rustdoc | 设计片段可直接落码且遵守源码规范 |
| provider/framework | 旧材料含固定产品 | transport/storage/security/schema products 全部未选择 | 缺 authority 时保持可替换和 fail-closed |
| git/commit | 当前设计仓配置可读，目标仓不存在 | 只记录未来实施前置检查，不修改或伪造目标仓配置 | 本轮无提交/实现权限 |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| Rust 2024 + sync domain + async boundary on Tokio 1 | typed contract、与 Core 工具链兼容、适合长时 worker | 后续需闭合 async trait、取消、阻塞 I/O 隔离与 feature pin | 采用为 planned 约束 |
| 继续不选择语言/runtime | 不提前绑定 | Step 4 以后无法给出可转写文件/签名约束 | 不采用 |
| 直接继承旧 README 的 Rust/provider/DB 全套 | 决策快速 | 混入无 authority 的 provider、算法与参数 | 禁止 |
| 编译依赖所有 sibling DTO | 映射代码少 | 打穿 truth 边界并伪装 runtime/event 关系 | 禁止 |
| 只依赖核验 Core contracts，其他定义 local required seam | 依赖方向清晰，外部缺口可显式阻塞 | adapter mapping 成本更高 | 采用 |

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 英文标识符/源码注释/rustdoc/test 名；标准命名、rustfmt、清晰 imports；公开 API 与 enum variant 有文档注释 | Step 5~8 的模块、类型、字段、trait、protocol code block 采用可直接转写的英文命名/注释 |
| `standards/document/详细设计书写规范.md` | 按 module/file/object/function/protocol/state/UoW/error/test seam 形成 1:1 实现契约 | 后续不能用总表省略逐模块/逐入口细节 |
| `standards/document/子项目目录与代码文件组织规范.md` | 仓名、member、package、crate、binary、file 规则；worker/jobs 不重复 | Step 4 必须输出标准映射表、文件树、职责表和命名审计 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段来源、metadata/idempotency、DTO construction、状态、projection、artifact/evidence 和 phase boundary 闭环 | 缺口不能交给实现者猜；必要时回退 02/01/owning project |
| `projects/README.md` §8.2 | design commit 中文、实现仓代码 commit 英文、非微小变更有 body、固定 co-author footer | 未来 Step 17/07 纳入实施前置；本轮不提交 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的实现单元 / 后续 Step |
|---|---|---|
| planned Rust workspace | edition 2024、MSRV 1.93；目标仓创建时正式写入并重新核验 Core 兼容 | 全仓；Step 4/17/07 |
| 同步 domain | domain object/policy/closure assessment 不执行 I/O、不依赖 Tokio/provider | domain；Step 5/6/10 |
| 异步 I/O 边界 | application 可表达异步 port/use case，但不绑定 Tokio；executor 只在 infra/api/worker wiring | application/infra/api/worker；Step 7/9/13/14 |
| Tokio 1 系列 | 只承载异步 runtime、consumer loop、background jobs、shutdown/cancellation；精确 pin/features 后续闭合 | infra/worker；Step 13/14/07 |
| transport-neutral API | 先定义 library handler/use-case surface；HTTP/gRPC framework 未选，不创建伪 routes/server contract | contracts/application/api；Step 4/7/8 |
| provider-neutral infra | store/bus/storage/integrity/KMS/compression/schema/receiver driver 未选 | infra adapters；Step 7/11/14 |
| typed errors | domain/application/adapter/protocol error 分层；unknown/conflict/unsupported/integrity-failed 不压成 string/success | 全层；Step 6/7/8/12 |
| 英文源码与 Rustdoc | 公开类型、字段、variant、trait、function 完整 `///`；module/crate `//!` | Step 5~8、实现/测试 |
| query no-write | query handler 只获得 read capabilities，不以方便注入全写 store/runtime | application/api/infra；Step 7/9/11 |
| authority/secret 隔离 | credential、raw secret、KMS key、owner/private/provider payload 不进入 domain/protocol/history | contracts/domain/infra；Step 6/8/11/15 |
| fake 无生产权威 | fake 只进入 test support，不作为 production fallback 或 readiness 证据 | tests；Step 7/16 |

### 7.3 Core compile dependency 与符号上限

| 依赖 / symbol | 核验状态 | 当前引用口径 | 禁止推导 |
|---|---|---|---|
| `core-contracts` / `core_contracts` | formal 03 与真实 Cargo/export 已核验 | 唯一 sibling compile dependency；根相对 path 见 §7.4 | 不导入 Core domain/application/infra/jobs/cli |
| `actor::ActorContext` / `ActorRef` | 实际源码与正式 03 可定位 | 入口 actor/context shared candidate | 不代表 Archive 自行认证或授权 |
| `metadata::CommandMetadata` / `QueryMetadata` | 实际源码与正式 03 可定位 | command/query metadata shared candidate | 字段适配和 idempotency 单一来源留 Step 8 闭合 |
| `metadata::IdempotencyKey` | 实际源码可定位 | 通用 request key candidate | external action/handoff typed keys 不自动复用 |
| `metadata::RequestId` / `TraceId` / `Timestamp` | 实际源码可定位 | metadata/time shared candidate | `Timestamp` 字符串本身不证明时钟、fence 或可比版本 |
| `Version` / `ResourceRef` / `ExternalReferenceRef` 等 generic types | 虽存在，Archive 适配性未核验 | 不作为本步确认依赖 surface | 不替代 Archive typed version/owner/material/decision refs |

### 7.4 本地多仓依赖约束表

| 依赖仓库 / 能力 | 全局关系 | 本地默认路径 | 当前引用方式 | 中期方式 | 影响单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile candidate | `/home/aris/Projects/quantalithos-core` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；仅核验 symbol | private git tag/rev，须 07/发布阶段固定 | contracts 及确需 shared metadata 的入口 |
| `quantalithos-bus` | event + adapter | `/home/aris/Projects/quantalithos-bus` | 禁止 Cargo path dependency | event/subscription adapter；exact contract blocked | worker/infra |
| identity/conversation/work/process/governance | runtime + event + ref + adapter | `/home/aris/Projects/quantalithos-<owner>`（存在性不等合同） | 禁止 Cargo path dependency | owner-specific export/decision/receiver adapters | application/infra/worker |
| `quantalithos-artifact` | runtime + event + ref + adapter | 当前 sibling 不存在 | 禁止 Cargo path dependency | approved artifact material/ref adapter | infra/worker |
| `quantalithos-workspace` | runtime + ref + adapter；Auxiliary | 当前 sibling 不存在 | 禁止 Cargo path dependency | explicitly labelled projection adapter | infra |
| `quantalithos-observability` | runtime + event + ref + adapter | 当前 sibling 不存在 | 禁止 Cargo path dependency | redacted audit/evidence material adapter | infra/worker |
| `quantalithos-sdk` | downstream client；compile disputed | `/home/aris/Projects/quantalithos-sdk` | Archive 禁止依赖；`AR-ARCH-001` | SDK 消费 Archive public contract | 无 server 单元 |
| storage/integrity/KMS/compression/schema/receiver | runtime + adapter + ref | 非统一 sibling path | 禁止核心 Cargo 直依赖 provider | 经 local port + provider adapter，合同/产品未闭合 | infra/worker |

planned 根 manifest 中，只有在实施时 Core 路径与 symbol 复核通过后才能写：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

这是设计契约，不表示目标 `Cargo.toml` 已存在或 dependency 已解析成功。

### 7.5 Runtime 与依赖方向

```text
contracts  ---> verified core_contracts symbols only
    ^
    |
domain      (sync, pure, no executor/provider)
    ^
    |
application (use cases + local required ports; async semantics allowed)
    ^
    |
infra / api / worker (Tokio runtime + adapters + wiring)
    |
    +-- runtime/event/ref --> owners / bus / storage / capabilities / receivers
```

关键说明：

- 箭头只表示允许的 compile dependency 方向；外部一行表示 runtime/event/ref，不是 Cargo dependency。
- domain 不依赖 `core_domain` 或任何 provider；Core shared metadata 进入 contracts/入口，是否传到 domain 必须按对象字段来源审计。
- 不画部署图，因为 Step 3 固定代码约束而不选择物理部署；运行角色已由正式 01 定义。

## 8. 后置历史材料审计

| 历史材料 | 旧口径 | 当前结论 |
|---|---|---|
| README / 旧 03 | Rust + PostgreSQL + S3/MinIO/Glacier + AES/SHA 等被写成整体已选 | 只保留 Rust；其依据来自本 Step 当前标准/Core 生态，而非历史继承；其他选择全部开放 |
| 旧 03 | provider/domain 类型混放、治理/hold 本地化 | provider 只能 infra adapter，governance 只以 decision ref/port 进入 |
| draft | framework/runtime 名称或目录候选 | 只有满足本步依赖方向和 Step 4 目录规则的部分才可重推 |

## 9. 回填草稿

### 9.1 实现约束与编码规范承接

目标实现采用 planned Rust workspace（edition 2024、MSRV 1.93）；同步 domain 不依赖 I/O executor，异步入口、adapter 与 worker 使用 Tokio 1 系列，精确版本/feature 在后续依赖闭包中固定。API 保持 transport-neutral，数据库、Bus、storage、integrity、KMS、compression、schema 与 receiver provider 均未选择。

Rust 源码标识符、注释、rustdoc 和测试名使用英文，设计正文使用中文。唯一允许的 sibling compile dependency 是真实 `core-contracts` crate，并且只复用已核验且语义适合 Archive 的 shared symbols；其他关系一律通过 runtime/event/ref/adapter/fake 表达。

## 10. 待确认、门禁与进入下一步条件

| 待确认 / blocker | 当前处置 | 关闭位置 |
|---|---|---|
| exact Tokio/serde/error crate pin 与 features | 仅锁主系列/用途，不写 lock 已完成 | Step 7/8/12/14 与 07 |
| transport、DB、Bus、storage、安全/schema provider | port-first、产品未选、受外部 blocker 影响 | Step 7/11/14、04/07、owning authority |
| Core shared metadata 对每个 Archive DTO 的字段适配 | 只允许已核验候选，不自动全量复用 | Step 6/8 逐 schema 闭合 |
| target repo/git config | 仓不存在，不伪造 | 07 实施前置门禁 |

| 门禁检查 | 结论 |
|---|---|
| 语言/runtime | planned Rust 2024/MSRV 1.93；sync domain；Tokio 1 仅 I/O runtime |
| 注释/命名 | 中文正文、英文源码/rustdoc；variant 与 public field/function 不省略 |
| compile graph | 仅 `core-contracts`，真实 path 已核验；其他关系分类未漂移 |
| 外部产品 | 无 framework/DB/provider/key/algorithm/schema 产品被伪选 |
| 仓库事实 | 目标仓不存在；未创建、未修改 git config、未运行 compile/test |

`gate_status = pass_with_upstream_blockers`。语言、runtime、编码、注释、仓库、提交、安全与依赖约束已经收稳，满足进入 Step 4 的条件。
