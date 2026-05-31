# L0-sdk 07 实施计划 Step 6: 阶段任务、编写顺序与提交边界

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 6 中间产物。
> 本步把 PH-01~PH-07 拆成阶段任务、代码实现批次和 commit boundary。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 拆分阶段任务、编写顺序与提交边界 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §6 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-07 阶段顺序和阶段门禁 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承交付物、非交付物和跨仓依赖边界 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取实现契约、处理流、状态机、事务、幂等、配置和测试切口 |
| `05-测试方案.md` §4~§14 | 已完成 | 提取每阶段测试切口、用例族、artifact 和 report 证据 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取每阶段验收门禁、VETO 和证据完整性要求 |
| `standards/document/实施计划书写规范.md` | 已完成 | 约束代码批次、提交时机、commit message 和分批规模 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段内有哪些实施动作 | 每个阶段拆成契约 / 测试切口、domain / application、infra / client / package wiring、证据门禁四类动作。 |
| 2. 每个任务的输入、输出和完成判定是什么 | 任务表逐项列出输入、输出和可验证完成判定,不使用“完善相关代码”。 |
| 3. 阶段内代码应该按什么顺序写,为什么 | 先锁定协议和测试切口,再写 domain / application,再接 infra / client / package,最后跑 gate 和证据。 |
| 4. 是否先锁定外部契约和测试切口,再填内部实现 | 是。Command / Query / Event / Job DTO、fixture 和失败用例先落骨架,防止实现漂移。 |
| 5. 哪些任务必须同提交,哪些任务必须分开提交 | 同一可验证纵切内的 DTO、domain、service、adapter、test 可同提交;不同阶段、不同状态链、最终 reports 不混提交。 |
| 6. 哪些时机可以 commit,哪些时机不能 commit | 一个 commit boundary 对应的批次和门禁全部通过后可以 commit;未编译、未测试、缺证据或混入无关功能时不能 commit。 |
| 7. 哪些测试必须在提交前执行 | 至少执行本 boundary 声明的 fmt / check / unit / contract / service / integration / smoke / report check。 |
| 8. 是否存在提交边界过大或过小的问题 | 有。按文件或单 struct 提交过小;把 package、smoke、compatibility、reports 混成一笔过大。本文按功能纵切和风险隔离点拆分。 |
| 9. 是否存在把无关修改混入同一提交的风险 | 有。language package layout、scripts、reports 容易混入业务阶段;production endpoint / registry 容易混入 P0。本文明确“不包含内容”。 |
| 10. 每个提交边界能否用一句话描述 | 必须能。一句话说不清的 boundary 需要拆分或重排。 |
| 11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退 | 必须可以。每个 boundary 都绑定门禁和不包含内容。 |
| 12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作 | PH-02~PH-07 都可能超过 300 行,因此拆成多个 100~300 行批次;预计超过 500 行的动作不得单批实现。 |
| 13. 哪些实现动作必须拆成多个代码批次 | semantic baseline、boundary policy、candidate build、smoke evidence、compatibility、report generation 必须拆批次。 |
| 14. 哪些高风险逻辑必须单独批次实现 | 状态机、事务、幂等、安全 / redaction、审计、错误恢复、跨仓同步、package stable gate 和 evidence handoff 单独批次或单独门禁。 |
| 15. 每个代码批次完成后应该执行哪些门禁 | 每批至少执行 fmt / check / 相关 unit 或 contract;阶段边界执行对应 gate script 和 evidence check。 |
| 16. 每个代码批次与提交边界是什么关系 | 一个 commit boundary 可包含一个或少数几个强相关批次;批次通过后再判断是否达到 commit boundary。 |
| 17. 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary | 见 §7.10 的开工前设计闭环复核矩阵。 |
| 18. 发现详细设计、测试方案、验收标准之间冲突时如何处理 | 暂停当前 boundary,记录 blocker,回写 design repo;不得自行选边继续实现。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 5 只有阶段级顺序 | 没有阶段内任务和提交边界 | 实施者仍可能按 crate / package 随意编码 | 本步为每个 PH 定义任务、批次、boundary |
| 高风险逻辑容易混在大提交中 | redaction、credential、candidate stable、evidence、compatibility 均跨模块 | review 和回退成本过高 | 高风险逻辑单独批次,并绑定测试 |
| 三语言 package 容易后补 | Python / TypeScript 是 P0 但可能被实现者放到最后 | 触发 VETO-SDK-003 | PH-04 / PH-05 明确 package、docs、smoke boundary |
| scripts / reports 容易散落提交 | 证据骨架和最终 handoff 都需要脚本支持 | 提交边界混乱 | PH-01 建骨架,PH-07 做最终报告收口 |
| P1/P2 能力容易混入 P0 | public registry、real credential、production endpoint 与 SDK 实现位置接近 | 范围膨胀 | 每个 boundary 明确不包含内容 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段任务 | 只有 PH-01~PH-07 名称 | 每阶段有 IMPL 任务表 | 实施动作可执行 |
| 编写顺序 | 只有阶段依赖 | 每阶段按 contract/test -> domain/service -> adapter/client/package -> gate 编排 | 降低返工 |
| 代码批次 | 未定义 | 每阶段有 BATCH 表和规模判断 | 防止超大批次 |
| 提交边界 | 未定义 | 13 个可验证 commit boundary | 支持独立 review、验证和回退 |
| 设计复核 | 未落到 boundary | 每个阶段开工前复核字段、DTO、状态、证据和 phase boundary | 防止 1:1 实现时自行补设 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 crate / package 一笔提交 | 与文件结构一致 | 过大且不可验证,容易把测试后置 | 不采用 |
| 每个文件 / struct 一笔提交 | 粒度极细 | review 噪音大,git log 不可读 | 不采用 |
| 每个可验证功能增量一笔提交 | 可一句话描述,可验证,可回退 | 需要阶段内跨模块组织代码 | 采用 |
| 先 Rust 后 Python / TypeScript | 初期快 | 破坏三语言 P0 | 不采用 |
| package / smoke 与 Rust SDK 同阶段推进 | 三语言一致性早暴露 | 工具链前置成本更高 | 采用 |
| 测试与功能边界同批次或同提交边界 | 证据紧贴实现 | 单笔提交稍大 | 采用 |

---

## 7. 结构化中间产物

### 7.1 全局编写顺序规则

| 顺序 | 动作 | 原因 |
|---:|---|---|
| 1 | 阅读本阶段正式章节和对应 `design-calibration` | 确认本阶段输入边界 |
| 2 | 先写或更新测试切口、fixture、DTO / protocol skeleton | 先锁定外部行为和失败场景 |
| 3 | 写 domain 状态 / policy / value object | 保证不变量独立可测 |
| 4 | 写 application service、port、UoW / idempotency 编排 | 把事务、幂等和副作用集中在 application |
| 5 | 写 infra fake / local adapter、Rust client、CLI / job 或 package wiring | 支撑 P0 可验证路径 |
| 6 | 跑本批次门禁并生成 artifact | 确认批次可验证 |
| 7 | 达到 commit boundary 后提交 | 只提交已验证的可 review 增量 |

### 7.2 PH-01 仓初始化与证据骨架

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 创建目标仓、workspace、crate 和 package skeleton | `03` §4、Step 3 | `/home/aris/Projects/quantalithos-sdk`、`crates/*`、`packages/*` | workspace 可执行 check |
| IMPL-01-02 | 2 | 接入 `core-contracts` / `bus-contracts` path dependency | `03` §13 | root Cargo dependencies | compile 能解析上游 contracts |
| IMPL-01-03 | 3 | 创建基础 JSON config、runtime builder skeleton 和 fixture root | `04` §6~§11 | config fixtures、runtime shell | config smoke skeleton 可运行 |
| IMPL-01-04 | 4 | 创建 gate / report / check scripts 与 evidence root | `03` §15、`05` §9 / §13 | `scripts/*`、`artifacts/test/<run_id>`、`reports/` | scripts 支持 required args |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | 可编译 workspace + path deps | `03` §4 / §13 | workspace、empty crates、path deps | 100~300 行 | cargo check、命名检查 | commit-01-a |
| BATCH-01-02 | package skeleton + config/scripts/evidence root | `04`、`05` §13 | packages、config fixtures、scripts、reports root | 100~300 行 | script `--help`、path grep | commit-01-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace、crate skeleton 和 path dependency 可编译后 | root workspace、`crates/*` skeleton、core / bus path deps | 业务 DTO、domain 状态、package build | cargo check、命名检查 |
| commit-01-b | package skeleton、config 和脚本证据路径可检查后 | packages skeleton、config fixtures、gate/report/check scripts | semantic baseline、candidate、smoke | script `--help`、artifact/report path check |

### 7.3 PH-02 上游契约承接与语义基线

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 定义 contracts DTO、semantic baseline DTO 和 contract fixtures | `03` §7、`05` TS-SDK-001 / 002 | DTO、fixtures、contract tests | roundtrip / validation 通过 |
| IMPL-02-02 | 2 | 实现 semantic baseline、concept map 和 capability model | `03` §6 / §10 | domain objects、state tests | baseline 覆盖三语言 |
| IMPL-02-03 | 3 | 实现 derived binding view、freshness state 和 PH-02 owned consumer | `03` §8 / §10 / §13 | view service、core contract changed consumer、freshness query | contract / semantic / query tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | 锁定 upstream / semantic 协议和 fixture | `03` §7、`05` TS-SDK-001 | DTO、fixtures、contract tests | 100~300 行 | `TC-SDK-CONTRACT-*` subset | commit-02-a |
| BATCH-02-02 | 实现 semantic baseline 和 concept map | `03` §6 / §10 | domain state、semantic tests | 100~300 行 | `TC-SDK-SEMANTIC-*` subset | commit-02-a |
| BATCH-02-03 | 实现 derived view、language view、freshness query 和 core contract changed consumer | `03` §8 / §13 | service、query、core consumer、tests；只读 semantic baseline / concept map | 需拆分;每批不超过 300 行 | `TC-SDK-CONTRACT-*`、freshness query | commit-02-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-02-a | contracts DTO、semantic baseline 和 concept map 单测通过后 | DTO、fixtures、baseline、concept map、capability model | derived view consumer、service boundary、package candidate | fmt/check、contract + semantic unit tests |
| commit-02-b | derived view、language view、freshness query 和 PH-02 owned consumer 通过后 | derived view、language view、freshness state、query、core contract changed consumer；只读 semantic baseline / concept map | service view、event view、bus semantic changed consumer、formal API changed consumer、service call、event publish、candidate；semantic baseline / concept map 改写 | `TC-SDK-CONTRACT-*`、freshness query tests |

### 7.4 PH-03 服务 / 事件边界与安全策略

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 定义 service capability 和 bus event command / query fixture | `03` §7、`05` TS-SDK-003 / 004 | command/query DTO、boundary fixtures | validation / schema tests 通过 |
| IMPL-03-02 | 2 | 实现 service / event client view、client view consumers、boundary guard 和 support state | `03` §6 / §10 | domain view、bus / formal changed consumers、support state、policy | unsupported / fake marker tests 通过 |
| IMPL-03-03 | 3 | 实现 Rust `ServiceClient` / `EventClient` facade 与 fake boundary adapters | `03` §5 / §8 / §13 | client facade、fake adapter、diagnostic ref | boundary / event tests 通过 |
| IMPL-03-04 | 4 | 实现 error / trace / redaction / credential protection | `03` §12 / §15、`04` §8 / §11 | error mapping、trace propagation、redaction guard | security tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | 锁定 service / event boundary 协议 | `03` §7、`05` TS-SDK-003 / 004 | DTO、fixtures、contract tests | 100~300 行 | contract tests | commit-03-a |
| BATCH-03-02 | 实现 boundary view、client view consumers、client facade 和 fake adapters | `03` §6 / §8 / §13 | domain view、bus / formal changed consumers、Rust client、fake adapters | 需拆分;每批不超过 300 行 | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` | commit-03-a |
| BATCH-03-03 | 实现 error / trace / redaction / credential guard | `03` §12 / §15、`04` §8 | policy guard、error mapper、trace tests | 100~300 行 | `TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*` | commit-03-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-03-a | service / event boundary、client view consumers 和 Rust client facade tests 通过后 | service view、event view、bus semantic changed consumer、formal API changed consumer、Rust client facade、fake adapters | package candidate、docs smoke、real endpoint | boundary / event tests |
| commit-03-b | error / trace / redaction / credential tests 通过后 | error mapping、trace propagation、redaction policy、credential ref-only guard | real credential provider、public registry | trace + security tests、redaction check |

### 7.5 PH-04 本地 package candidate 与三语言产物

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 定义 candidate job input、language artifact metadata 和 package layout fixture；metadata 必须包含来源 `language_view_id` | `03` §7 / §8、`05` TS-SDK-007 | job DTO、artifact metadata、fixtures | schema / layout tests 通过 |
| IMPL-04-02 | 2 | 实现 package candidate 状态机和 stable gate | `03` §6 / §10、`06` AC-FUNC-007 | candidate domain、status tests | invalid freshness / missing evidence rejected |
| IMPL-04-03 | 3 | 实现 language generator、package builder 和 local artifact store | `03` §13、`04` §7 | local builders、artifact refs | package build tests 通过 |
| IMPL-04-04 | 4 | 接入 Rust / Python / TypeScript package surface layout | `03` §4 / §5 | package source skeleton、exports | layout check 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | 锁定 candidate 协议和状态机 | `03` §7 / §10 | job DTO、candidate domain、state tests | 100~300 行 | `TC-SDK-CANDIDATE-*` subset | commit-04-a |
| BATCH-04-02 | 实现 generator / builder / artifact metadata | `03` §13、`04` §7 | builders、artifact store、metadata tests | 需拆分;每批不超过 300 行 | candidate build tests | commit-04-b |
| BATCH-04-03 | 实现三语言 package layout 和 checks | `03` §4 / §5、`05` §9 | package source layout、layout script | 100~300 行 | package layout check | commit-04-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-04-a | candidate 状态机和 stable gate 单测通过后 | candidate job DTO、candidate domain、status transitions | language builder、docs、smoke | candidate state tests |
| commit-04-b | local candidate、三语言 package artifact 和 layout checks 通过后 | generator、builder、artifact store、Python / TypeScript package layout | public registry publish、docs smoke | candidate build + package layout check |

### 7.6 PH-05 文档示例、跨语言 smoke 与验证证据

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 定义 docs / smoke / validation evidence job input 和 fixtures | `03` §7 / §8、`05` TS-SDK-008 / 009 | job DTO、fixtures | schema tests 通过 |
| IMPL-05-02 | 2 | 实现 quickstart、docs example runner 和 docs evidence | `03` §8、`05` §9 | examples、docs runner、evidence | docs tests 通过 |
| IMPL-05-03 | 3 | 实现 cross-language smoke runner 和 validation finished consumer | `03` §8 / §13 | smoke runner、consumer、evidence append | smoke tests 通过 |
| IMPL-05-04 | 4 | 实现 verification evidence、redaction status 和 boundary verification job | `03` §6 / §10 / §15 | evidence domain、redaction status、job | evidence passed + redacted tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | 锁定 docs / smoke / evidence 协议和 examples | `03` §7、`05` TS-SDK-008 | job DTO、examples、fixtures | 100~300 行 | docs contract tests | commit-05-a |
| BATCH-05-02 | 实现 docs runner 和 quickstart evidence | `03` §8 | docs runner、docs evidence tests | 100~300 行 | `TC-SDK-DOCS-*` | commit-05-a |
| BATCH-05-03 | 实现 cross-language smoke 和 validation evidence | `03` §8 / §13 / §15 | smoke runner、consumer、evidence domain | 需拆分;每批不超过 300 行 | `TC-SDK-SMOKE-*`、security evidence | commit-05-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-05-a | docs examples 和 docs runner 通过后 | quickstart、docs examples、docs validation runner | smoke,compatibility,public docs site | `TC-SDK-DOCS-*` |
| commit-05-b | cross-language smoke、validation evidence 和 redaction evidence 通过后 | smoke runner、validation consumer、evidence domain、boundary verification job | compatibility decision、release report | `TC-SDK-SMOKE-*`、`TC-SDK-SECURITY-003~004` |

### 7.7 PH-06 兼容性、deprecated 与迁移治理

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 定义 compatibility / deprecated / migration DTO 和 fixtures | `03` §7、`05` TS-SDK-010 | DTO、fixtures | schema tests 通过 |
| IMPL-06-02 | 2 | 实现 compatibility decision、deprecated lifecycle 和 migration guide ref policy | `03` §6 / §10 | domain objects、state tests | breaking / migration tests 通过 |
| IMPL-06-03 | 3 | 实现 compatibility service、query 和 job runner | `03` §8 / §13 | service、query、job | `TC-SDK-COMPAT-*` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | 锁定 compatibility 协议和 lifecycle 状态 | `03` §7 / §10 | DTO、domain、state tests | 100~300 行 | compatibility unit tests | commit-06-a |
| BATCH-06-02 | 实现 compatibility service、query 和 job | `03` §8 / §13 | service、query、job、tests | 100~300 行 | `TC-SDK-COMPAT-*` | commit-06-a |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-06-a | compatibility、deprecated、migration ref 主链通过后 | DTO、domain、service、query、job、tests | release reports、public registry migration page | `TC-SDK-COMPAT-*`、AC-FUNC-010 |

### 7.8 PH-07 Reports / projections / acceptance handoff 收口

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 实现 projection rebuild job 和 report data source | `03` §8 / §15、`05` §13 | projection rebuild、report input | report data tests 通过 |
| IMPL-07-02 | 2 | 实现 report generator、evidence index 和 report links check | `05` §13、`06` AC-EV-* | `reports/runs/<run_id>`、evidence index | report links check 通过 |
| IMPL-07-03 | 3 | 实现 acceptance handoff、veto checklist、risk acceptance 和 open issues | `06` §10~§14 | `reports/acceptance/*` | handoff review 通过 |
| IMPL-07-04 | 4 | 执行最终 redaction、path 和 no-latest 检查 | `06` VETO-SDK-* | final check report | 无 forbidden body、无正式 `latest` |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | 完成 projection rebuild 和 report source | `03` §8 / §15 | projection job、report source tests | 100~300 行 | projection / report source tests | commit-07-a |
| BATCH-07-02 | 完成 report generation 和 evidence index | `05` §13 | report generator、evidence index、checks | 100~300 行 | report links / artifact checks | commit-07-a |
| BATCH-07-03 | 完成 acceptance handoff、VETO 和 final redaction | `06` §10~§14 | handoff、veto、risk files、final checks | 100~300 行 | acceptance handoff review | commit-07-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-07-a | projection rebuild、report generator 和 evidence index 可生成固定 run 输出后 | projection rebuild、report generator、evidence / artifact index | 新业务能力、registry publish | report links / artifact checks |
| commit-07-b | handoff、VETO、risk acceptance 和 redaction final checks 通过后 | acceptance handoff、veto checklist、risk acceptance、final redaction / no-latest checks | 新功能范围扩展 | AC-EV-*、VETO-SDK-*、redaction check |

### 7.9 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留 |
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 适中 | 是 | 是 | 保留;只包含 derived view / language view / freshness / core contract changed consumer,可只读 semantic baseline / concept map,不得读写 service / event view,不得改写 semantic baseline / concept map |
| commit-03-a | 偏大但合理 | 是 | 是 | 保留;client view consumers、client facade 和 adapters 分批实现 |
| commit-03-b | 适中 | 是 | 是 | 保留 |
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 偏大但合理 | 是 | 是 | 保留;language packages 分批实现;artifact metadata 必须写入来源 `language_view_id` |
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 偏大但合理 | 是 | 是 | 保留;evidence / smoke 分批实现 |
| commit-06-a | 适中 | 是 | 是 | 保留 |
| commit-07-a | 适中 | 是 | 是 | 保留 |
| commit-07-b | 适中 | 是 | 是 | 保留;只做收口不加新功能 |

### 7.10 开工前设计闭环复核矩阵

| 阶段 / boundary | 字段闭环 | DTO 构造闭环 | 状态 / 证据闭环 | phase boundary 失败处理 |
|---|---|---|---|---|
| PH-01 / commit-01-a~b | Cargo package、crate、package surface、artifact root 来自 `03` / `04` | 不新增业务 DTO | evidence root、config profile、path dependency 可定位 | 目标仓或 path dependency 不一致时暂停 |
| PH-02 / commit-02-a~b | baseline、concept、upstream refs、freshness 字段来源完整 | Command / Event 能构造 baseline 和 derived view | `SnapshotFreshnessState` 与 `03` §10 一致 | core / bus truth 字段不清时暂停回写 |
| PH-03 / commit-03-a~b | service result ref、diagnostic ref、event payload ref / digest 齐全 | service call / publish command 能构造 boundary request | support state、redaction status、error class 一致 | real endpoint / credential 需求不得临时加入 |
| PH-04 / commit-04-a~b | candidate id、version、language artifact metadata、digest、来源 `language_view_id` 齐全 | candidate job input 能构造 `PackageCandidate` | candidate status 不出现 `Built` 等旧状态 | registry publish 需求后移,不改 P0 |
| PH-05 / commit-05-a~b | evidence id、runner result、redaction marker、artifact ref 齐全 | validation event / job input 能构造 `VerificationEvidence` | `Passed + Redacted` 才能支撑 verified / stable | smoke skipped 不得当 passed |
| PH-06 / commit-06-a | compatibility decision、deprecated record、migration ref 齐全 | command / job input 能构造 decision 和 record | breaking / migration / deprecated lifecycle 与 `03` 一致 | migration ref 缺失时暂停实现 |
| PH-07 / commit-07-a~b | report run id、artifact path、AC / TC / EV ref 齐全 | report input 能构造 evidence index 和 handoff | VETO、risk acceptance、redaction final check 可判定 | 缺 run_id 或 latest 引用时不得送验 |

### 7.11 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `git config user.name` / `user.email` 符合 Step 3 |
| diff 范围 | 只覆盖一个 commit boundary,不混入无关格式化或跨阶段功能 |
| 编译格式 | `cargo fmt`、`cargo clippy`、`cargo test` 或目标仓等价命令通过 |
| 多语言检查 | 相关 boundary 涉及 Python / TypeScript 时,对应 package build / smoke 命令通过 |
| 边界门禁 | 本提交边界声明的 suite / TC / EV 已通过或记录 |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 |
| 文档同步 | 设计偏离已回写 design 文档或登记风险 |
| Commit message | 英文 `type(scope): subject`,body 按子功能分组,footer 符合规范 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §6。

````markdown
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段任务表”“代码实现批次”“提交边界”“提交粒度判断”“开工前设计闭环复核矩阵”和“提交前检查清单”小节,了解实施任务如何按可验证功能增量和提交边界收敛。

本轮实施按 PH-01~PH-07 推进。每阶段先锁定外部契约和测试切口,再实现核心领域 / 应用逻辑,再接入 port / adapter / client / package / job,最后补齐错误、状态、事务、幂等、安全、证据和提交边界。

| 阶段 | 关键任务 | 关键批次 | 提交边界 | 提交前门禁 |
|---|---|---|---|---|
| PH-01 | workspace、path deps、package skeleton、config、scripts | BATCH-01-01~02 | commit-01-a / commit-01-b | check、命名、script help、path check |
| PH-02 | contracts consumption、semantic baseline、concept map、derived view、language view、freshness query | BATCH-02-01~03 | commit-02-a / commit-02-b | contract、semantic、freshness tests |
| PH-03 | service / event boundary、client view consumers、Rust client facade、redaction、error / trace | BATCH-03-01~03 | commit-03-a / commit-03-b | boundary、event、trace、security tests |
| PH-04 | package candidate、language artifacts、三语言 package layout | BATCH-04-01~03 | commit-04-a / commit-04-b | candidate、package layout checks |
| PH-05 | docs examples、cross-language smoke、verification evidence | BATCH-05-01~03 | commit-05-a / commit-05-b | docs、smoke、security evidence |
| PH-06 | compatibility、deprecated、migration ref | BATCH-06-01~02 | commit-06-a | compatibility tests |
| PH-07 | projection、reports、evidence index、handoff、VETO | BATCH-07-01~03 | commit-07-a / commit-07-b | report links、AC-EV、VETO、redaction |

代码批次以 100~300 行为宜；预计超过 300 行应拆分；预计超过 500 行必须拆分。状态机、事务、并发、幂等、安全、审计、错误恢复、跨仓同步、package stable gate 和 evidence handoff 必须单独批次实现、单独验证。

每个 commit boundary 必须能用一句话描述、能独立验证、能必要时独立回退。禁止按单个文件、单个 struct、单个函数或当天工作量提交；禁止把无关格式化、功能、测试和文档混成一笔。
````

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| Python / TypeScript 真实工具命令 | 目标仓仅有 git shell,命令未实际确认 | 影响 PH-04 / PH-05 门禁命令 | Step 8 / Step 9 固定或 Spike,但不改变三语言 P0 |
| commit boundary 数量 | 当前为 13 个 | 比单阶段提交多,但可 review / 可回退 | 接受 |
| PH-03 和 PH-04 是否过大 | 二者都跨 client、adapter、package | 实施时可能超过 300 行 | 保持 boundary,阶段内继续拆批次 |
| Step 11 commit message 模板 | 本步只定义 boundary,不展开完整 message 模板 | 影响最终提交纪律 | Step 11 展开 |

建议方案: 接受当前 13 个 commit boundary。原因是它们按可验证功能增量和风险隔离点划分,能支撑 review、回退和证据审查。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个阶段都有任务表、编写顺序和提交边界 | 已满足 |
| 每个阶段都有代码实现批次表,且批次规模、验证门禁和提交关系清楚 | 已满足 |
| 每个阶段或 commit boundary 都有字段、DTO、状态和 phase boundary 开工前复核口径 | 已满足 |
| 每个提交边界都有提交前门禁 | 已满足 |
| 发现设计冲突时暂停并回写 design repo 的规则已明确 | 已满足 |

结论: 可以进入 Step 7,继续嵌入测试与验收门禁。
