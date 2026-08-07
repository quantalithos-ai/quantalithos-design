# L2-tools 03 详细设计 Step 3: 收稳编码、runtime、仓库与依赖约束

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §3、§16
> 当前写入许可: 只允许本 Step 中间产物与 flow / ledger；正式 03 仍禁止写入。

---

## 1. Step 开工与输入

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 2 `completed / pass`;`next_allowed_action=create_step_03_constraints`。 |
| 必读标准 | `standards/coding/rust.md`;详细设计 SOP Step 3；详细设计书写规范 §5.3；`子项目目录与代码文件组织规范.md`;`全局项目依赖关系与裁剪规则.md`。 |
| 正式输入 | 正式 01 §3 / §8 / §11 / §13；正式 02 §3 / §12。 |
| 当前 repo 检查 | 目标实现仓 `/home/aris/Projects/quantalithos-tools` 不存在；不得声称已有 Cargo、branch、git identity、build 或 tests。 |
| sibling 检查 | `/home/aris/Projects/quantalithos-core` 存在；`core-contracts` / `core_contracts` / `crates/contracts` 可检索。 |
| historical material | 旧正式 03 的 RPC / HTTP、PostgreSQL、Redis、NATS、registry / executor 技术栈不提供 authority。 |

## 2. SOP 问题回答

### 2.1 语言、runtime、framework 与主要依赖

- 实现语言固定为 Rust，源码、标识符、注释、rustdoc 和测试名使用英文。
- Planned workspace baseline 固定为 Rust edition 2024、minimum supported Rust version 1.93，以便与当前真实 `core-contracts` package 的 edition / rust-version 对齐；实现仓创建时必须重新验证实际 toolchain 和 Core manifest，当前不能声称本机 build 已通过。
- Runtime 形态只固定为同步 Command / Query entry、异步 inbound consumer entry、one-shot operations job entry 三种逻辑角色；可以早期同部署，不能在 03 锁定 process supervisor、web framework、async runtime、transport 或 scheduler 产品。
- Framework、transport、serialization library、database、broker、scheduler、search engine、telemetry backend 与 deployment platform 均未获得产品 authority。Step 7 / 11 / 14 通过 ports、repositories、codecs 和 builder seam 保持 backend-neutral。
- 唯一已确认 compile dependency family 是 `L0-core`。当前可检索实现候选为 package `core-contracts`、crate `core_contracts`、path `../quantalithos-core/crates/contracts`；具体 Tools shared types 缺失，`L2T-UP-008` 持续开放。

### 2.2 Rust 规范如何影响契约

| 主题 | 实现约束 |
|---|---|
| Naming | Module / type / function / variable / test 使用英文、语义明确且统一词序；不用架构层级前缀或无边界 `common / utils / manager`。 |
| Struct / enum | Public type 与 public field 有 rustdoc；public enum 的每个 variant 都有 `///`，载荷语义和禁止状态明确。 |
| Error | Domain / application / protocol / infra errors 分层；closed enums 优先于自由字符串；公开错误不暴露 raw body、secret 或 backend detail。 |
| Trait | Trait 由调用方拥有，方法表达 capability 而非具体 backend；object safety / `Send + Sync` 需求在 Step 7 按 seam 决定。 |
| Async | 只有真实 I/O boundary 的 port / entry 可以是 async；domain function 保持同步纯逻辑；不为统一风格把所有函数 async 化。 |
| Ownership | Domain value 默认 owned / immutable；borrow 只用于函数局部输入，不能将 adapter lifetime 渗入 public protocol。 |
| Serialization | 只对 protocol / persistence carrier 派生；domain invariant 不能靠反序列化绕过 constructor / validation。 |
| Unsafe | 本轮无使用理由；若实现发现必须使用，必须先形成 ADR / safety invariant，不得自行加入。 |
| Tests | Test 名英文且描述 observable behavior；fake 与 durable adapter 服从相同 contract。 |
| Formatting / lint | `rustfmt` / `clippy` 是 gate 候选，不替代语义规范；实际命令由 05 / 07 定稿。 |

### 2.3 Rustdoc 纪律

- Crate / module 用 `//!` 说明职责、owner、non-goal 与 dependency direction。
- Public struct / enum / trait / function 用 `///` 先写一句行为摘要，再写 invariant、errors、side effects 和必要示例。
- Public field 说明 authority / source / unit / optionality；typed ref 明确只定位而不证明外部事实。
- Public enum 每个 variant 都必须有 `///`；状态 variant 说明是否初始 / 终态、合法触发和禁止反推。
- Fallible public function 必须说明 `# Errors`；若可能 panic，必须说明 `# Panics`，本设计原则上不允许业务输入触发 panic。
- Rust code block 中不得出现中文 doc comment；正式设计正文仍使用中文解释。

### 2.4 提交规范与 git identity 前置

未来实施者开工前必须读取 `projects/README.md` §8.2、`standards/document/代码实施台账与门禁规范.md` 与届时正式 `07-实施计划.md`。目标实现仓创建后必须设置并验证 repo-local：

```text
user.name = quantalithos-labs
user.email = quantalithos.ai@gmail.com
```

实现仓 commit message 使用英文 `type(scope): subject`，一笔 commit 对应 07 的一个 boundary。上述为后续实施约束，不授权本轮创建仓、修改 git config 或提交。当前设计仓配置可检索为相同 identity，但不能推断未来目标仓已配置。

### 2.5 安全、鉴权与外部边界

- L2 不实现 effective authorization / approval / policy / risk taxonomy；只消费 invocation-bound result，无法验证时 fail closed。
- L2 不执行 Sandbox run、不拥有 environment / capture / receipt / cleanup / recovery，不允许 host fallback。
- L2 不实现 Runtime plan / loop / retry / recovery / checkpoint，也不根据 observation 触发 Runtime action。
- L2 不拥有 Hub registry / provider / exposure / applicability truth，不用本地 inventory 或 name lookup 补 source。
- L2 不拥有 Bus delivery / retry / DLQ / replay 或 Observability store / retention / observed truth。
- Raw request / prompt / capture / provider response / external document / secret / evidence body 不得进入 contract、truth、audit、event、log、metric 或 trace attribute。

### 2.6 多仓依赖判断

| 关系 | 分类 | Cargo dependency | 实现表达 |
|---|---|---|---|
| L2-tools -> L0-core | compile | 允许，但只引用真实 formal types | `core-contracts` local path candidate；缺失 Tools type 保持 blocked。 |
| L2-tools -> L3-capability-hub | runtime | 禁止 | Application-owned source port、ref / safe summary、adapter / fake。 |
| L2-tools -> L4-sandbox | runtime | 禁止 | Handoff / source ports、blocked mapping、adapter / fake。 |
| L2-runtime -> L2-tools | runtime consumer | 禁止反向依赖 | L2 server / logical invocation contract；Runtime adapter 在 consumer 侧。 |
| L2-tools -> L0-bus | event | 禁止 | Safe event collaboration port、local attempt、route binding。 |
| L4-observability <- L0-bus material | event collaboration | 禁止 direct package / producer inference | Body-free material / observation ref seam；route blocked。 |
| L0-sdk -> L2-tools | future consumer | 禁止 L2 反向依赖 | Server contract 和 guidance only。 |

## 3. 当前材料问题诊断

| 问题 | 诊断 | 处理 |
|---|---|---|
| `projects/README.md` 对 L2-tools 仍写“混合”语言建议 | 这是旧总览建议，不是当前正式 00/01/02 或编码标准的 implementation authority。 | 当前详细设计基于 Rust 标准定稿为 Rust；README 差异记 historical，不恢复 Python / mixed layout。 |
| 目标实现仓缺失 | 无法检查 existing code、branch、manifest、dependency 或 toolchain。 | Step 4 仅定义 planned tree；Step 17 / 07 设置 repository preflight。 |
| Core package 存在但 Tools schema 不存在 | 可复用 generic types与可编译 Tools contract 不是同一事实。 | 只允许 exact inspection 后逐 type 复用；`L2T-UP-008` 阻塞 Tools-specific compile contract。 |
| 全局矩阵旧行含“按需 L0-sdk” | 当前正式 L2 架构已明确 SDK future / excluded。 | 以当前项目裁剪为准，禁止 L2 -> SDK package。 |
| 旧 03 固定 backend | 没有当前 ADR / authority。 | 采用 backend-neutral ports / stores / codecs / builder。 |
| Async / transport 未定 | 若提前定框架会影响 signatures 和 error mapping。 | Domain sync；I/O port 的并发语义在 Step 7 定义，具体 runtime / transport 后置 binding。 |

## 4. 改动前后与设计取舍

| 主题 | Step 2 后 | Step 3 收口 |
|---|---|---|
| Language | 要求可形成 Rust workspace。 | Rust 2024 / MSRV 1.93 planned baseline；英文源码 / rustdoc。 |
| Runtime | 三种入口尚未工程化约束。 | 同步、异步 consumer、one-shot job 为逻辑角色，deployment 可合并。 |
| Compile dependency | Core-only 语义成立。 | 真实 `core-contracts` path 候选收稳；Tools schema 未闭口。 |
| External relation | Blocked seam 进入范围。 | Runtime / event 只能由 ports / event material 表达，禁止 sibling Cargo dependency。 |
| Product selection | 旧材料含固定产品。 | 全部后移，03 只定义 backend-neutral contract。 |
| Repository fact | 目标仓状态未知。 | 明确 absent，planned 与 existing 术语隔离。 |

采用“与真实 Core baseline 对齐的 Rust workspace + backend-neutral boundaries”。不采用 mixed-language 旧 README、旧 03 产品栈、所有 sibling path dependency，也不采用无 Core compile authority 的本地复制类型。

## 5. 结构化中间产物

### 5.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 英文 identifier / comment / rustdoc / test；semantic naming；public API rustdoc；每个 public enum variant 有文档。 | Step 4~17 的 planned Rust surface 按此命名和说明。 |
| `详细设计书写规范.md` | Object / DTO / Query view / state / metadata / idempotency / projection closure。 | 不能只列 type name，必须给 field source、callable 和 test cut。 |
| `设计真相源闭环与可落码性标准.md` | Single authority、construction、phase / side-effect closure。 | Step 6~17 做跨表 1:1 audit。 |
| `子项目目录与代码文件组织规范.md` | Project slug、workspace member、package / crate / binary / file mapping。 | Step 4 定稿 `tools` planned layout，禁止 `L2` 泄漏进源码名。 |
| `projects/README.md` §8.2 | Design / implementation commit language boundary 与 identity checklist。 | Step 17 / 07 承接；本轮不提交。 |
| `代码实施台账与门禁规范.md` | Commit gate、staged scope、required checks、post-commit ledger。 | 只作为 07 输入，03 不创建 implementation ledger。 |

### 5.2 实现约束表

| ID | 约束 | 说明 | 影响 |
|---|---|---|---|
| `IC-L2T-001` | Rust planned baseline | edition 2024、rust-version 1.93；实施前验证。 | 全 workspace。 |
| `IC-L2T-002` | English source | Identifier、comment、rustdoc、test、implementation commit 全英文。 | 全源码 / tests。 |
| `IC-L2T-003` | Rustdoc completeness | Public item / field / enum variant / error behavior 必须文档化。 | Contracts / domain / application。 |
| `IC-L2T-004` | Domain sync and pure | Domain 不依赖 async runtime、I/O、clock implementation 或 config。 | Domain。 |
| `IC-L2T-005` | Caller-owned ports | Application 定义 ports；infra 实现；entry 不直连 store / adapter。 | Application / infra / entries。 |
| `IC-L2T-006` | Core-only compile | 非 Core sibling repo 不进入 Cargo dependency。 | Cargo / crate graph。 |
| `IC-L2T-007` | Exact Core reuse | 只复用实际可检索且语义一致的 Core type；不复制 / alias 缺失 Tools schema。 | Contracts / application。 |
| `IC-L2T-008` | Backend neutrality | 未授权 framework / protocol / DB / broker / scheduler / search / telemetry product。 | Infra / api / worker / jobs。 |
| `IC-L2T-009` | No unsafe by default | 无 approved ADR 不使用 unsafe。 | 全源码。 |
| `IC-L2T-010` | Forbidden-body by construction | Public / stored / observed types 无 raw body / secret slot；不是运行时 redaction 补救。 | Contracts / stores / telemetry。 |
| `IC-L2T-011` | Blocked seam honesty | Fake 只验证 L2 behavior，不证明 provider、route、mapping 或 readiness。 | External adapters / tests。 |
| `IC-L2T-012` | Target repo fact boundary | 只写 planned path；无 existing code / build / git / test claim。 | §4 / §16 / §17。 |
| `IC-L2T-013` | No layer prefix | `L2` 只在设计导航；package / crate / module / file / type 不含层级。 | Naming。 |
| `IC-L2T-014` | Config cannot change truth | Config 只绑定实现；不能改 owner、semantic、safety、dependency class。 | Infra config / builder。 |

### 5.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile | `/home/aris/Projects/quantalithos-core` | Planned local path `../quantalithos-core/crates/contracts`;真实 package `core-contracts` / crate `core_contracts`;逐 type 验证 | Private git tag / rev，切换由 07 / release 决定 | `contracts` 为主；其他 crate 通过本仓 contracts 间接使用，除非 Step 4 显式列出。 |

### 5.4 非 package 依赖表

| 仓 / owner | 类型 | 本仓表达 | 失效语义 |
|---|---|---|---|
| `L3-capability-hub` | runtime | `HubControlledSourcePort` | Source unavailable / stale / conflict；不补 registry。 |
| Authorization owner | runtime pending | `AuthorizationConsumptionPort` | Unverifiable -> fail closed。 |
| `L4-sandbox` | runtime | `SandboxExecutionPort`;`ExecutionSourceIntakePort` | Mapping / carrier / source blocked；no host fallback。 |
| `L2-runtime` | runtime consumer | Logical server contract | Caller failure不改变 L2 truth；不反向依赖。 |
| `L0-bus` | event | `SafeEventCollaborationPort` | Local route / submission degraded；不回滚 outcome。 |
| `L4-observability` | event consumer | Observation material / status refs | Route blocked / unknown；不声明 observed。 |
| `L0-sdk` | future consumer | Server schema / guidance | No client-ready claim。 |

### 5.5 Core 实况与复用门禁

| 项 | 当前可检索事实 | 设计含义 |
|---|---|---|
| Workspace | edition `2024`;rust-version `1.93` | L2 planned baseline 对齐，不等于 build evidence。 |
| Package / crate | `core-contracts` / `core_contracts` | 唯一 compile candidate。 |
| Path | `/home/aris/Projects/quantalithos-core/crates/contracts` | Step 4 可写 planned sibling path。 |
| Generic types | `ActorContext`;`ActorRef`;`CommandMetadata`;`QueryMetadata`;`PageRequest`;`ErrorResponse`;`CloudEventEnvelope<T>` 等可检索 | Step 6 / 8 逐字段语义核查后才能引用。 |
| Tools-specific types | 未发现 formal package / module / schema | `L2T-UP-008` 保持 open；不得私造为 Core type。 |
| Baseline identity | 当前 workspace 未冻结 commit | `L2T-UP-007` 保持 open；只引用 file / section，不写 immutable rev。 |

## 6. 回填草稿

正式 §3 应收口 Rust 2024 / 1.93 planned baseline、英文源码 / rustdoc、public enum variant 注释、七工程层单向依赖前提、Core-only compile、真实 `core-contracts` candidate、runtime/event seam 非 package 纪律、target repo absent 和 backend-neutral redlines。提交 / git 只列为实施前置，不记录本轮执行事实。

## 7. 门禁

| 条件 | 结果 |
|---|---|
| 语言 / edition / MSRV 是否明确且区分 planned / verified | pass |
| Rustdoc 与 public enum variant 规则是否明确 | pass |
| 提交规范 / git identity 是否列入后续前置且未伪造目标仓状态 | pass |
| Core package / crate / path 是否真实核查 | pass |
| Runtime / event seam 是否排除 Cargo dependency | pass |
| 外部 owner 与 forbidden-body 边界是否保持 | pass |
| 未选 framework / backend 是否未从旧 03 恢复 | pass |
| 是否未修改正式 03 | pass |

```text
step_status = completed
gate_status = pass
gate_reason = Rust 2024/MSRV 1.93 planned constraints, English rustdoc discipline, target-repository absence, real core-contracts candidate and compile/runtime/event dependency boundaries are explicit without selecting unsupported products or inventing Tools-specific Core schemas
next_allowed_action = create_step_04_file_layout
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
