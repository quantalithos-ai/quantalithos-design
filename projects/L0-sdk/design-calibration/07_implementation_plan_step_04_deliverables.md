# L0-sdk 07 实施计划 Step 4: 实施对象与交付物

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 4 中间产物。
> 本步从详细设计、配置设计、测试方案和验收标准中抽取本轮实际交付的代码、接口、事件、job、adapter、配置、测试、脚本、证据和报告产物。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 抽取实施对象与交付物 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §4 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 F-001~F-010、P0 official SDK 闭环、三语言 surface、local candidate 和非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、core / bus path dependency、命名、scripts、artifacts、reports 前置规则 |
| `03-详细设计.md` §4~§16 | 已完成 | 抽取 workspace、crate、package、对象、trait、协议、处理流、状态、配置、观测和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 抽取 JSON config、profile、runtime graph、contracts path、artifact / report root、failure mode 和 forbidden config |
| `05-测试方案.md` §4~§14 | 已完成 | 抽取测试分层、TC / EV、gate scripts、artifact、report、candidate 和 smoke 要求 |
| `06-验收标准.md` §4~§14 | 已完成 | 抽取 AC-FUNC、AC-BOUND、AC-RED、AC-IF、AC-STATE、AC-NFR、AC-EV 和 VETO |

---

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块?

本轮会在 `/home/aris/Projects/quantalithos-sdk` 新增 Rust workspace 和 Python / TypeScript package surface。Rust 代码模块包括 `contracts`、`domain`、`application`、`infra`、`client`、`cli` 和 `jobs`。语言包目录包括 `packages/python` 和 `packages/typescript`。这些模块来自 `03-详细设计.md` §4 / §5,但实施对象不按对象逐个拆任务,而是按能证明 P0 official client access layer 闭环的交付物组织。

### 3.2 本轮会新增或修改哪些接口、事件、job 或 adapter?

本轮会交付 6 个 Command API、12 个 Query API、4 个 inbound event consumer、6 个 outbound event payload、8 个 operations job、Rust `ServiceClient` / `EventClient` facade、repository / UoW / source / boundary / runner / artifact / outbox / projection / config port,以及 local / in-memory / fake / filesystem 默认 adapter。真实 production endpoint 全量覆盖、真实 bus runtime、真实 credential provider 和 public registry 发布不在本轮交付范围。

### 3.3 本轮会新增哪些测试?

本轮会新增 unit、contract、service、config、integration、event replay、report check、candidate build、docs、cross-language smoke、compatibility、concurrency 和 redaction 分层测试。suite 以 `SUITE-SDK-PR-*`、`SUITE-SDK-MAIN-*`、`SUITE-SDK-NIGHTLY-*` 和 `SUITE-SDK-CANDIDATE-*` 为主,覆盖 `TC-SDK-CONTRACT-*`、`TC-SDK-SEMANTIC-*`、`TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*`、`TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*`、`TC-SDK-CANDIDATE-*`、`TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*` 和 `TC-SDK-COMPAT-*`。

### 3.4 本轮会产生哪些配置、迁移、种子数据或文档同步?

本轮会产生严格 JSON 配置 demo、local-dev / ci-test / integration-test / candidate-validation profile fixture、core / bus contracts path 配置、fake / fixture boundary 配置、language package 配置、artifact / report 配置、test data fixture、package candidate metadata、evidence index 和 acceptance handoff。当前 P0 不要求数据库 migration;如果实现中存在状态初始化,应作为 in-memory / filesystem store、fixture 或 local state root 初始化处理。

### 3.5 哪些上游设计对象本轮不交付?

不交付 public registry publish、production formal API endpoint 全量覆盖、real credential provider、remote config、hot reload、admin override、MCP / REST / GraphQL / REPL / offline cache、full L1/L2/L3/L4 client coverage、真实 bus delivery / retry / DLQ / replay runtime、服务端业务 truth、auth / governance decision truth、长期 observability dashboard 和 production deployment / operations runbook。

### 3.6 哪些交付物跨仓或依赖外部模块?

编译期跨仓依赖只有 L0-core `core-contracts` 和 L0-bus `bus-contracts` 本地 path dependency。运行期外部依赖通过 formal API / fake / fixture boundary、bus event boundary、local runner、filesystem artifact store、in-memory / local repository 和 report generator 表达。L1/L2/L3/L4 服务仓可以作为人工查阅位置,但不得作为 Cargo path dependency 或 P0 开工前置。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物尚未集中列出 | `03` 写实现契约,`05` 写测试证据,`06` 写验收门禁 | 后续阶段拆分缺少清晰交付边界 | 统一抽成实施对象、交付物、非交付物和跨仓依赖清单 |
| SDK 设计横跨三语言 | Rust workspace、Python package、TypeScript package 同时存在 | 若只列 Rust crate,会漏掉 P0 三语言验收 | 把 language package surface 和 smoke 列为交付物 |
| 详细设计对象很多 | `03` §6~§8 对象、trait、协议完整 | 直接搬运会导致按对象实施 | 只抽取支撑 F-001~F-010 闭环的可判定交付物 |
| candidate / reports 易后补 | `05` / `06` 均要求 candidate、artifacts、reports、handoff | 最终证据不可审计 | 作为正式交付物列入 |
| 真实外部能力易膨胀 | public registry、真实 endpoint、真实 credential 容易被误纳入 P0 | 延误第一批实现并破坏范围 | 写入非交付物清单,本轮只交付 local / fake / fixture / ref-only |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 交付物口径 | 分散在 `03/04/05/06` | 按 code / client / package / event / job / adapter / config / test / evidence / report 分组 | 让实施对象可检查、可验收 |
| 实施对象来源 | 容易等同于对象索引 | 只抽取 P0 闭环需要交付的对象和模块 | 防止按对象排任务 |
| 三语言范围 | 可能被误读为 Rust 先行、其他语言后补 | Python / TypeScript package surface、docs、smoke 是 P0 交付物 | 满足 VETO-SDK-003 |
| 测试交付 | 可能被视为后置动作 | 测试 suite、gate、artifact、report 作为交付物 | 符合可验证增量原则 |
| 外部依赖 | 可能被误写成真实 endpoint / registry 前置 | 编译期只依赖 core / bus contracts;运行期用 fake / fixture / boundary | 保持 P0 可独立实现 |
| 非范围 | 散落在上游章节 | 集中列为非交付物 | 防止 P1 / P2 能力污染 P0 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 列交付物 | 易对应文件布局 | 容易忽视 Python / TypeScript、client facade、scripts 和 reports | 不单独采用 |
| 按 P0 功能闭环列交付物 | 能对应需求和验收 | 需要额外标注预计落点 | 采用为主组织方式 |
| 把 public registry 发布作为交付物 | 发布体验完整 | 依赖外部账号、凭据和 release ops,超出 P0 | 不采用 |
| 交付 local package candidate | 可证明安装、docs、smoke 和 compatibility | 后续仍需 public release 专项 | 采用 |
| 把真实 endpoint / real credential provider 作为交付物 | 接近生产 | 与 fake / fixture 默认可验证路径冲突 | 不采用 |
| 交付 formal / fake / fixture boundary 和 ref-only result | 可独立测试和验收 | 真实联调风险后置 | 采用 |
| 只交付代码,测试和报告后补 | 编码启动快 | 无法通过 `06` 证据和验收门禁 | 不采用 |
| 测试、脚本、artifact、report 同列交付物 | 每阶段可验证 | 初始交付物清单更长 | 采用 |

---

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 本轮口径 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 Rust workspace | code | `03` §4 | 建立 `contracts / domain / application / infra / client / cli / jobs` 边界 | workspace 可编译,依赖方向不反转 |
| `sdk_contracts` | code | `03` §7 | Command、Query、Event、Job、View、Receipt、Error 和 context DTO | DTO roundtrip、schema、错误 DTO 测试通过 |
| `sdk_domain` | code | `03` §5 / §6 / §10 | semantic baseline、derived view、service / event view、policy、candidate、evidence、compatibility、deprecated 状态 | domain unit、状态机和 boundary policy tests 通过 |
| `sdk_application` | code | `03` §5 / §8 / §11~§13 | use case service、query service、port trait、UoW、幂等、错误组合 | service tests 验证事务顺序、幂等和副作用 |
| `sdk_infra` | code | `03` §5 / §11 / §14 / §15 | repository、source adapter、boundary adapter、generator、package builder、runner、artifact store、config、projection、outbox | integration、config、redaction 和 adapter tests 通过 |
| `sdk_client` | code | `03` §5 / §7 / §8 | Rust developer-facing `ServiceClient`、`EventClient` 和 capability query entry | client facade 不绕过 boundary guard,返回 ref-only result |
| `sdk_cli` | binary | `03` §7 / §8 | 本地维护命令入口: semantic、views、candidate、compatibility、reports | CLI smoke、错误码和 config selector tests 通过 |
| `sdk_jobs` | code / binary | `03` §7 / §8 | 8 个 operations job binary | job_run_id、item key、partial success、evidence output 和幂等可审计 |
| Python package surface | package | `03` §4 / §5、`05` §9 | Python official SDK package surface、docs / smoke 可引用源码 | Python package build / smoke 和 semantic compare 通过 |
| TypeScript package surface | package | `03` §4 / §5、`05` §9 | TypeScript official SDK package surface、docs / smoke 可引用源码 | TypeScript package build / smoke 和 semantic compare 通过 |
| P0 JSON 配置与 profile fixture | config | `04` §3~§12 | local-dev / ci-test / integration-test / candidate-validation profile、forbidden config tests | config parse / validate / builder tests 通过 |
| P0 测试、artifact、report、acceptance handoff | test / evidence / report | `05` §4~§14、`06` §10~§14 | automated suites、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | EV / AC / VETO 可回链固定 run_id |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §4、Step 3 | `/home/aris/Projects/quantalithos-sdk`、`Cargo.toml`、`crates/*` | 目标仓存在,workspace 可编译 |
| core / bus path dependency | code / dependency | `03` §13、`06` AC-IF-007 / AC-IF-008 | root `Cargo.toml` / crate `Cargo.toml` | `core-contracts` 与 `bus-contracts` 本地 path dependency 可编译 |
| Command DTO 与 application service | code / API | `03` §7 / §8、`06` AC-IF-001 | `crates/contracts/src/commands.rs`、`crates/application/src/services/*` | 6 个 Command API 的 validation、idempotency、UoW、outbox、error mapping tests 通过 |
| Query DTO 与 read service | code / API | `03` §7 / §8、`06` AC-IF-002 | `crates/contracts/src/queries.rs`、`crates/application/src/query.rs` | 12 个 Query 不写 truth,stale / missing / unsupported marker tests 通过 |
| Rust client facade | code / client | `03` §5 / §7、`06` AC-IF-003 | `crates/client/src/*` | `ServiceClient` / `EventClient` 不绕过 guard,返回 ref-only result / diagnostic ref |
| Inbound event consumer | code / event | `03` §7 / §8、`06` AC-IF-004 | `crates/application/src/consumers/*`、`crates/infra/src/event/*` | duplicate 不重复写 truth,unredacted event 被拒绝 |
| Outbound event payload 与 SDK outbox | code / event | `03` §7 / §8 / §11、`06` AC-IF-005 | `crates/contracts/src/events.rs`、`crates/application` outbox service、`crates/infra` sink | 6 个 event schema、forbidden body absent、publish failure evidence tests 通过 |
| Operations job runners | code / binary | `03` §7 / §8、`06` AC-IF-006 | `crates/jobs/src/*` | 8 个 job 的 job_run_id、item UoW、partial success、summary tests 通过 |
| Domain 状态机与 policy guard | code | `03` §6 / §10、`06` AC-STATE-* / AC-RED-* | `crates/domain/src/*` | freshness、support、candidate、evidence、redaction、compatibility、deprecated 状态 tests 通过 |
| Repository、UoW、idempotency 和 store | code | `03` §11 / §13、`06` AC-TX-* / AC-IDEM-* | `crates/application/src/ports/*`、`crates/infra/src/store/*` | expected version、same key same digest / different digest tests 通过 |
| Runtime config loader 与 runtime builder | code / config | `03` §14、`04` §3~§12、`06` AC-RED-008 | `crates/infra/src/config.rs`、`runtime_builder.rs`、config fixtures | valid profile 可启动,invalid / raw secret / reload request 稳定失败 |
| Boundary、source、runner、artifact fake adapters | code / adapter | `03` §13、`04` §6 / §7、`06` AC-BOUND-* | `crates/infra/src/adapters/*` | local / fake / fixture 默认路径能证明 P0-min |
| Python official package surface | package / docs | `03` §4 / §5、`05` §9、`06` AC-FUNC-002 / 009 | `packages/python`、`examples/python` | package layout、docs example、smoke 和 concept compare 通过 |
| TypeScript official package surface | package / docs | `03` §4 / §5、`05` §9、`06` AC-FUNC-002 / 009 | `packages/typescript`、`examples/typescript` | package layout、docs example、smoke 和 concept compare 通过 |
| Local package candidate 与 artifact metadata | code / evidence | `03` §6 / §8 / §10、`06` AC-FUNC-007 | candidate service、artifact store、`artifacts/test/<run_id>` | candidate `Draft -> NotVerified -> Verified -> Stable` 条件可验证 |
| Quickstart、docstring 与 examples runner | docs / test | `03` §8、`05` §9、`06` AC-FUNC-008 | `examples/`、docs validation runner | docs example 可运行,docs failure 阻断 stable |
| Compatibility、deprecated 与 migration ref | code / evidence | `03` §6 / §8 / §10、`06` AC-FUNC-010 | `crates/domain/src/compatibility.rs`、`deprecated.rs`、application service | breaking / migration / deprecated lifecycle tests 通过 |
| 自动化测试 suite | test | `05` §4~§12 | crate unit tests、`tests/`、package smoke tests | PR / main / nightly / candidate suite 可运行 |
| Gate scripts | script | `03` §15、`05` §9 / §13 | `scripts/gates/run_pr_gate.sh`、`run_main_gate.sh`、`run_nightly_gate.sh`、`run_candidate_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile`,输出固定 run artifact |
| Report scripts | script / report | `05` §13、`06` AC-EV-* | `scripts/reports/generate_reports.sh`、`generate_acceptance_handoff.sh` | 输出 `reports/runs/<run_id>` 与 `reports/acceptance` |
| Check scripts | script | `05` §13、`06` AC-EV / VETO | `scripts/checks/check_artifacts.sh`、`check_redaction.sh`、`check_report_links.sh`、`check_package_layout.sh` | artifact 完整性、脱敏、report links 和 package layout checks 通过 |
| Artifact 与 report 目录结构 | evidence / report | `05` §13、`06` §10 | `artifacts/test/<run_id>`、`reports/` | 无 `<project>` 层级,正式引用不使用 `latest` |

### 7.3 非交付物清单

| 非交付物 | 不交付原因 | 本轮替代表达 |
|---|---|---|
| public registry publish | P1/P2 release / operations 专项 | local package candidate、artifact metadata、install / smoke |
| production formal API endpoint 全量覆盖 | 依赖服务 API 稳定度和真实环境 | minimal formal / fake / fixture boundary |
| real credential provider | security / operations 专项 | credential ref-only、raw secret forbidden、fake credential ref |
| remote config、hot reload、admin override | P2 config / ops | 启动期 / job-startup JSON config,unsupported profile fail-fast |
| MCP / REST / GraphQL / REPL / offline cache | ecosystem enhancement | Rust DTO、Rust client facade、CLI 和 language package surface |
| full L1/L2/L3/L4 client coverage | 各服务 API stable 后裁剪 | 最小 service capability view 和 formal / fake boundary |
| 真实 bus delivery / retry / DLQ / replay runtime | L0-bus 职责 | bus event client view、publish boundary ref、event semantic mapping |
| 服务端业务 truth | 下游服务仓职责 | ref-only result、diagnostic ref、projection / snapshot marker |
| auth / governance decision truth | gateway / governance 边界 | actor / trace / credential ref 传播,不裁决权限 |
| 长期 observability dashboard | L4 / ops 职责 | trace、audit、evidence、reports 和 redaction check |
| production deployment / operations runbook | 部署与运维文档职责 | gate scripts、report scripts、acceptance handoff |

### 7.4 跨仓 / 外部依赖清单

| 依赖对象 | 依赖类型 | 本轮交付内容 | 不交付内容 | 验证方式 |
|---|---|---|---|---|
| L0-core `core-contracts` | 编译期依赖 | Cargo path dependency、shared error / trace / metadata / contract refs 使用 | 复制 core shared contracts | dependency snapshot、`TC-SDK-CONTRACT-*` |
| L0-bus `bus-contracts` | 编译期依赖 + 事件协作依赖 | Cargo path dependency、event semantic mapping、bus boundary ref | bus delivery / retry / DLQ / replay truth | dependency snapshot、`TC-SDK-EVENT-*` |
| formal API source | 运行期依赖 | `FormalApiSourcePort`、snapshot / ref / digest、fake / fixture source | production endpoint 全量 matrix | `TC-SDK-BOUNDARY-*` |
| formal API boundary | 运行期依赖 | boundary adapter、ref-only result、diagnostic ref | 保存生产请求 / 响应正文 | boundary tests、redaction checks |
| fake / fixture endpoint | 运行期测试依赖 | fake marker、fixture runner、candidate not stable 规则 | fake success 作为 production support | `TC-SDK-BOUNDARY-003`、candidate gate |
| language generator / package builder | 本地工具依赖 | local runner、artifact metadata、package layout check | public registry publish | candidate build suite |
| L1/L2/L3/L4 service repos | 运行期依赖 / 人工查阅位置 | service capability view、formal API / fake / fixture boundary | Cargo path dependency、full service client coverage | unsupported / pending marker、risk acceptance |
| reports / artifacts consumers | 验收与审查依赖 | evidence index、handoff、veto checklist、risk acceptance | 使用 `latest` 或跨 run 拼接 | report links check、acceptance review |

### 7.5 交付物边界图

图类型: 交付物边界图

图标题: L0-sdk P0 交付物与依赖边界

```text
core-contracts ----[compile]----+
                                v
bus-contracts -----[compile]--> sdk-contracts
                                |
                                v
sdk-domain -> sdk-application -> sdk-infra
     |              |              |
     |              v              v
     |          sdk-client      sdk-cli / sdk-jobs
     |              |              |
     +--------------+--------------+
                    |
                    v
packages/python + packages/typescript
                    |
                    v
tests + scripts + artifacts/test/<run_id> + reports/
```

关键说明:

- 图表达本轮交付物之间的依赖边界,不表达完整函数调用链。
- `sdk-infra` 本轮以 local / in-memory / fake / filesystem 默认路径交付,不代表真实 production adapter 完成。
- `packages/python` 和 `packages/typescript` 是 P0 交付物,但不拥有第二套 protocol truth。
- `tests + scripts + artifacts + reports` 是正式交付物,不是实现完成后的附属动作。

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §4。

```markdown
## 4. 实施对象与交付物清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖清单”小节,了解本轮交付物如何从详细设计、配置设计、测试方案和验收标准收敛。

本轮实施对象围绕 L0-sdk P0 official client access layer 闭环组织,不按对象索引机械拆分。交付物必须可构建、可测试、可验收,并能追溯到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §4 | `/home/aris/Projects/quantalithos-sdk`、`Cargo.toml`、`crates/*` | 目标仓存在,workspace 可编译 |
| core / bus path dependency | code / dependency | `03` §13、`06` AC-IF-007 / AC-IF-008 | root / crate `Cargo.toml` | `core-contracts` 与 `bus-contracts` 本地 path dependency 可编译 |
| Command / Query / Event / Job DTO | code | `03` §7 | `crates/contracts/src/*.rs` | schema、roundtrip、错误 DTO tests 通过 |
| Domain 状态机与 policy guard | code | `03` §6 / §10 | `crates/domain/src/*` | freshness、support、candidate、evidence、redaction、compatibility、deprecated 状态 tests 通过 |
| Application service、port、UoW 和幂等 | code | `03` §8 / §11~§13 | `crates/application/src/*` | service、transaction、idempotency tests 通过 |
| Infra adapter、config 和 runtime builder | code / adapter | `03` §13 / §14 / §15、`04` | `crates/infra/src/*` | integration、config、redaction tests 通过 |
| Rust client facade、CLI 和 operations jobs | code / binary | `03` §5 / §7 / §8 | `crates/client`、`crates/cli`、`crates/jobs` | client、CLI、job runner tests 通过 |
| Python / TypeScript official package surface | package / docs | `03` §4 / §5、`05` §9、`06` AC-FUNC-002 / 009 | `packages/python`、`packages/typescript`、`examples/` | package build、docs example、smoke 和 concept compare 通过 |
| P0 自动化测试、gate scripts、reports 和 artifacts | test / script / evidence | `03` §15、`05`、`06` | `tests/`、`scripts/`、`artifacts/test/<run_id>`、`reports/` | P0 EV、redaction、report links 和 acceptance index 可验证 |

本轮不交付 public registry publish、production endpoint 全量覆盖、real credential provider、remote config、hot reload、admin override、MCP / REST / GraphQL / REPL / offline cache、full L1/L2/L3/L4 client coverage、真实 bus runtime、服务端业务 truth、auth / governance decision truth、长期 observability dashboard 和 production deployment / operations runbook。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 目标仓仅有 git shell | Step 3 已确认 `/home/aris/Projects/quantalithos-sdk` 已存在但未初始化 workspace | 初始阶段必须包含 workspace、packages、scripts 和 evidence 目录初始化 | 接受,在 Step 5 / Step 6 转为早期阶段和提交边界 |
| Python / TypeScript 工具链是否已固定 | 当前仅确认 P0 必须覆盖 package surface 和 smoke | 影响 candidate build、docs 和 smoke job | 接受,在 Step 8 / Step 9 固定环境或 Spike |
| production endpoint 和 public registry 是否提前做 | 当前非 P0 | 若提前做会放大范围 | 不做,仅保留 boundary / local candidate |
| artifact / report 具体生成细节 | `05` / `06` 已定义结构,实现命令待 Step 7 / Step 11 固定 | 影响 gate 和提交前检查 | 接受,后续写入测试门禁和交付纪律 |
| 目标仓首批提交历史 | 目标仓当前无有效实现提交可参考 | 首批提交必须完全依照实施计划规范 | 接受,Step 11 再固定提交纪律 |

建议方案: 接受上述待确认事项并进入 Step 5。原因是 Step 4 已明确本轮交付物与非交付物,剩余事项属于阶段顺序、测试门禁、环境准备和提交纪律的后续收束内容。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮交付物与非交付物明确 | 已满足 |
| 交付物均能追溯到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 或 `06-验收标准.md` | 已满足 |
| 跨仓依赖已区分编译期依赖、运行期依赖和事件协作依赖 | 已满足 |
| P0 三语言 package surface、candidate、scripts、artifacts 和 reports 已作为交付物列入 | 已满足 |

结论: 可以进入 Step 5,继续设计实施阶段与依赖顺序。
