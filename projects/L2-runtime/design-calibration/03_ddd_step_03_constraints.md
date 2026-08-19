# L2-runtime 03 详细设计 Step 3: 收稳编码、runtime、仓库与依赖约束

> 创建日期: 2026-08-08
> 状态: done
> 当前模式: controlled_reopen
> 回填位置: 正式 `03-详细设计.md` 第 3 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1/2 已完成边界与范围、`L0-core` 当前真实 workspace manifest、`standards/coding/rust.md`、目录组织规范、`L1-governance` / `L2-tools` Step 3/4 粒度参考 |
| 重开原因 | 用户要求实现 agent 可直接参照 Step 5~10 落码；原 `L2R-LANG-001=not_selected` 使 crate、async、error、serialization、ownership 契约不足 |
| 目标 | 收稳语言、编译基线、同步/异步边界、源码注释、依赖裁剪、target repo 与产品选择边界 |
| 禁止 | 选择 web framework、DB、queue、scheduler、provider、sandbox transport、observability backend；声明目标仓或 build readiness |

## 1. SOP 问题回答

| 问题 | 结论 |
|---|---|
| 使用什么语言 | Rust。源码标识符、文件名、Rustdoc、测试名使用英文；设计正文使用中文。 |
| workspace 基线 | Rust workspace，edition `2024`、`rust-version = 1.93` planned baseline，与当前 `L0-core` manifest 对齐；实现前仍需在目标仓 manifest 中重新验证。 |
| runtime 形态 | 同步 Command/Query 入口、异步 inbound event consumer、one-shot operations job 三类逻辑入口；不锁定 process supervisor、web framework、async runtime 或 transport 产品。 |
| sync/async 边界 | domain/value object/policy/状态转换保持同步纯函数；application service、repository、resolver、publisher、handoff、projection store 的 I/O trait 使用异步契约候选；入口将异步结果映射为 protocol result。 |
| 基础 crate | `core-contracts` 是唯一 sibling compile candidate；`serde`/`serde_json`/`thiserror` 等基础 crate 仅为 planned dependency candidate，版本和实际 manifest 由实现前确认。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-runtime` 当前不存在；不创建实现仓，记为 `L2R-IMPL-001=target_repo_absent`，阻塞实现开工而不阻塞设计。 |
| 外部协作 | Tools/Hub/Method/Governance/Sandbox/Artifact/Model/Memory 走 runtime/ref/adapter；Bus/Observability 走 event；SDK/Member/Product 为下游 consumer；不得进入 Cargo dependency。 |

## 2. 编码约束

### 2.1 命名、注释和错误

- public struct/enum/enum variant/field/trait/function 使用英文 Rustdoc，说明语义、owner、不变量、输入、写权和禁止推断。
- 类型使用 UpperCamelCase，函数/字段/文件使用 snake_case；文件名必须表达职责，禁止 `utils.rs`、`manager.rs`、`helper.rs` 顶层桶。
- domain error、application error、protocol error 分层；错误必须能映射 stable class/code、safe message、retry posture、correlation 和 typed ref。
- 所有带载荷 enum variant 说明载荷语义；所有 `Option` 字段说明缺失时行为。

### 2.2 Rust 语义边界

| 语义 | 约束 |
|---|---|
| ownership | domain 对象拥有本地 truth；外部对象只以 typed ref/snapshot/candidate；不可借用外部 owner 的 mutable body |
| async | domain 不使用 async runtime；I/O boundary 的 future/async trait 由 application port 定义；不得把 async transport 类型泄露进 domain |
| serialization | contracts 负责 wire-compatible DTO candidate；domain 类型不直接承担外部序列化 schema；forbidden body 在 serde 映射前拒绝 |
| errors | domain 使用可判定业务错误；application 包装 port/transaction 错误；api/worker/jobs 只做安全映射 |
| concurrency | expected version、stable identity、idempotency、ordering 是协议字段；具体 lock/queue 产品不选 |
| tests | planned unit/contract/flow/state/negative tests；fake 必须模拟正式错误和状态，不证明 production readiness |

## 3. 依赖裁剪矩阵

| 依赖 | 类别 | 允许位置 | 禁止 |
|---|---|---|---|
| `L0-core` `core-contracts` | compile candidate | contracts/domain/application/infra/entry | 本地 shadow core types |
| `L0-bus` | event | application/worker/infra publisher | Cargo/package dependency、delivery truth |
| `L0-sdk` | downstream consumer | 外部 API consumer seam | runtime 反向 package dependency |
| `L2-tools` | runtime/ref/adapter | application ports、infra adapter、contracts refs/events | tools executor、tool audit truth、Cargo dependency |
| `L3-capability-hub` | runtime/ref | capability resolver port/adapter | registry/descriptor truth |
| `L3-method-library` | runtime/ref | definition resolver port/adapter | method/role/process body |
| `L1-governance` | runtime/ref/event | formal decision consumer port | approval/policy truth |
| `L4-sandbox` | runtime/adapter | isolation handoff port | sandbox execution/capture/cleanup truth |
| `L4-observability` | event | safe material publisher | observed/audit backend truth |
| `L1-artifact` | ref/handoff | result/evidence/artifact ref port | body/verdict/lineage truth |
| model/memory owner | adapter/ref | semantic model and memory candidate ports | route/secret/quota/cost/durable body |
| fake | test seam | infra/tests | positive readiness claim |

## 4. 不选择项与 blocker

| 项目 | 当前状态 | 影响 |
|---|---|---|
| Tokio/async-std 等 async runtime | `not_selected` | 只能定义 async boundary，不定义 executor |
| Axum/Actix/HTTP/gRPC/UDS | `not_selected` | API handler 只能定义 protocol mapping |
| PostgreSQL/SQLite/Redis/vector DB/object store | `not_selected` | repository/projection port backend-neutral |
| NATS/Kafka/Bus broker/topic | `not_selected` | Event envelope/Publisher port only |
| scheduler/process supervisor | `not_selected` | worker/job lease/cursor semantic only |
| provider SDK/route/secret/quota/cost | `blocked` by `L2R-UP-004` | Model adapter positive path blocked |
| durable memory owner/index/retention | `blocked` by `L2R-UP-005` | working-only/ref-only |
| Tools/Sandbox receipt/feedback/cleanup | `blocked` by `L2R-UP-001` | no-execution/unknown fence |
| target implementation repo | `absent` (`L2R-IMPL-001`) | blocks implementation preflight |

## 5. 设计取舍

采用“Rust workspace + backend-neutral ports + domain sync / I/O async”作为 03 的可落码基线。这样实现者可以确定 crate boundary、trait async shape、error layering、ownership 和 test seams，同时不会因为设计文档替外部 owner 选择 transport、DB、scheduler 或 provider 产品。

不采用旧 Python/mixed-language、单一同步脚本、直接把 async transport 写进 domain、或把所有 sibling repo 作为 path dependency。

## 6. 回填草稿

正式第 3 章应收录 Rust workspace、edition/MSRV planned baseline、英文源码/Rustdoc、domain sync/I/O async、Core-only compile、runtime/event/ref/adapter/fake 分类和未选择产品清单。Step 4 应使用本 Step 的 member、target repo 和语言约束。

## 7. Step 3 反查与门禁

| 检查 | 结果 |
|---|---|
| Rust 语言与 workspace baseline 明确 | pass |
| sync/async、error、serialization、ownership 约束明确 | pass |
| Core compile 与 sibling seam 分类明确 | pass |
| 未选择 framework/DB/transport/scheduler/provider | pass |
| target repo 不存在且未被伪造 | pass |
| `L2R-LANG-001` 已关闭为 planned baseline，其他 blocker 保留 | pass |

```text
gate_status = done
next_allowed_action = create_03_ddd_step_04_file_layout
formal_03_write_allowed = false
```
