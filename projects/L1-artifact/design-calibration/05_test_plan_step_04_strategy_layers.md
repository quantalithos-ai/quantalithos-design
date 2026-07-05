# Step 4. 制定测试策略与分层

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节: `05-测试方案.md` §4 测试策略与分层

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 制定测试策略与分层 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 测试对象与测试切口;`01-架构设计.md` 依赖与数据边界;`03-详细设计.md` 模块 / flow / 状态 / 一致性;`04-配置设计.md` profile 与配置测试承接 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_04_strategy_layers.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 5 |

## 2. 本步目标

决定每类测试风险应该在哪一层被发现,避免把所有高风险问题推给跨入口 smoke 或 release gate。

本 Step 只回答:

- 哪些问题必须在 contract / unit 层发现。
- 哪些问题必须在 application service 层验证编排。
- 哪些问题必须依赖 repository / adapter / runtime builder / replay 语义验证。
- 哪些问题必须在 API / worker / job runner 入口层验证。
- 哪些场景才进入 release gate / evidence summary。
- 四个 P0 profile 如何映射到这些层级。

本 Step 不定义具体 TC 编号、测试数据、脚本名、artifact 路径、evidence ID 或 release verdict。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_03_test_objects_cuts.md` | 已完成 | 提供测试对象、协议盘点、切口和负向入口 |
| `01-架构设计.md` §8 / §9 / §13 | 正式输入 | 固定依赖裁剪、truth ownership、只读消费和外围 seam 边界 |
| `03-详细设计.md` §5 | 正式输入 | 固定 7 模块职责与入口边界 |
| `03-详细设计.md` §7 / §8 | 正式输入 | 固定五类 public protocol、worker-only relay publication 和 flow 编排 |
| `03-详细设计.md` §9~§12 | 正式输入 | 固定状态机、事务、一致性、错误、幂等、重入保护 |
| `03-详细设计.md` §13~§15 | 正式输入 | 固定 config binding、redaction、observability、test cut 输入 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | 正式输入 | 固定四个 P0 profile、builder fail-fast、degraded no-write、operations-replay 和配置证据 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供最小切口与建议测试类型 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题必须在 contract / unit 层发现? | public DTO / typed ref / metadata / digest schema、domain object factory、不变量、policy accept / reject、正式状态矩阵合法 / 非法转换、config parser / validator、source priority negative、redaction helper 和 low-cardinality label 规则必须在 contract / unit 层发现。这些风险不依赖 repository 或外部 adapter,越晚发现越难定位。 |
| 哪些问题必须在 application service 层验证编排? | 16 个 Command 的 accepted / rejected / duplicate 编排、13 个 Query 的 no-write 和 degraded surface、6 个 Consumer 的 dedup / snapshot / stale / receipt、6 个 public job 的 stored report replay / partial failure / no-truth-repair、stored result / report / receipt、commit unknown recovery、error mapping、UoW rollback 和 same-key-different-digest conflict 都必须在 application service 或 job orchestration 层验证。 |
| 哪些问题必须依赖 repository / adapter / runtime builder / replay 集成测试? | repository version / page / unique / rollback、projection dependency index、reference scope index、outbox payload snapshot、publisher single-winner、handoff marker persistence、runtime builder assembly、fake / controlled adapter failure injection、profile assembly、operations-replay replay root 规则和 partial failure 保留都必须用 fake / controlled / replay-backed integration 验证。P0 不要求真实 DB / bus / object storage / search 产品。 |
| 哪些问题需要 API / worker / job runner 入口测试? | Command / Query handler required-field validation、protocol error mapping、query surface 映射、6 个 inbound consumer 的 envelope / schema version / disposition、worker-only `PublishPendingArtifactRelays` loop、6 个 public job runner 的 input validation / duplicate replay / report surface 都需要入口层测试。 |
| 哪些场景才进入 release gate / evidence summary? | release gate 只用于证明最小跨入口闭环、四个 P0 profile 装配、config validation 报告、redaction scan、dependency boundary check、operations-replay report 和一票否决扫描。它不能替代 contract / unit / service / integration 对具体风险的定位。 |
| 四个 P0 profile 如何参与分层? | `local-dev` 只用于本地 smoke 与入口联调,不直接作为 release pass 证据主层;`ci-test` 承载 contract / unit / service / deterministic fake integration;`integration-like` 承载 controlled seam、topic completeness、handoff / publisher failure mapping;`operations-replay` 承载 replay、partial failure、stored report replay、no-truth-repair 和恢复证据。四个 profile 都要进入 profile matrix evidence,但不同层级承担不同风险。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 单元、集成、恢复、E2E 并列罗列,没有回答“风险最早应在哪层失败” | 本 Step 建立风险发现层级 |
| Step 3 切口 | 已抽出测试对象,但还没有执行层级 | 本 Step 把每个 P0 切口映射到主发现层级和辅助层级 |
| `03_ddd_step_16_test_cuts.md` | 给了建议测试类型,但 `05` 仍需形成测试金字塔与 release gate 边界 | 本 Step 把 test cuts 转译成 Artifact 语义的分层策略 |
| worker-only relay publication | 容易被误并入 public job 层 | 本 Step 单独给它定义 worker / repository / release evidence 层级 |
| 配置测试 | `04` 已固定四个 P0 profile 和证据,但旧 `05` 没把它们放进测试层级 | 本 Step 将 profile 与 layer 一起收稳 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 分层口径 | 以测试类型粗分 | 改为按风险发现位置分层 | 更利于定位失败责任 |
| contract / unit 层 | 只泛称 DTO 或 domain rule | 明确涵盖 schema、state、config parser、source priority、redaction helper | 这些是最早可判定错误 |
| service 层 | 未突出 transaction 编排 | 明确 UoW、stored result、duplicate replay、query no-write、job no-truth-repair | P0 主要风险集中在编排顺序 |
| integration 层 | 容易被理解成真实基础设施联调 | 明确 P0 只要求 fake / controlled / replay-backed seam | 产品未锁定不阻塞 P0 |
| release gate | 容易承担过多语义 | 限定为最小闭环、profile 证据、redaction、dependency 与 veto 汇总 | 防止用总门禁替代底层断言 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 高风险是否推给跨入口 smoke | A. 大量 smoke / pseudo-E2E;B. 分层前置发现 | 采用 B。状态、事务、幂等和 redaction 必须更早失败 |
| P0 integration 是否要求真实产品 | A. 真实 DB / bus / object source;B. fake / controlled / replay-backed seam | 采用 B。真实产品属于 P1/P2 |
| `Query no-write` 放在哪层 | A. 只做 API smoke;B. service + repository write audit | 采用 B。必须能精确证明“没有写” |
| `Job no-truth-repair` 放在哪层 | A. release gate 抽样;B. job orchestration + repository write audit | 采用 B。需要区分 report / marker 与 truth write |
| profile matrix 是否只做配置层 | A. 只校验 parser / builder;B. 同时映射到 contract / integration / replay / gate | 采用 B。四个 profile 的价值不同,不能只用一个 builder smoke 代替 |

## 8. 结构化中间产物

#### 测试分层图: L1-artifact P0 测试金字塔

```text
[Release gate / evidence summary]
  - minimal cross-entry smoke
  - profile matrix evidence
  - redaction / dependency / veto scan
  - operations-replay report summary
         ^
         |
[API / Worker / Job entry]
  - command/query handler mapping
  - inbound consumer disposition
  - relay publish loop
  - public job runner input/report surface
         ^
         |
[Integration with fake / controlled / replay-backed adapters]
  - repository version / rollback / index
  - runtime builder / profile assembly
  - publisher / handoff / resolver failure injection
  - operations-replay persistence and recovery
         ^
         |
[Application service / orchestration]
  - command UoW ordering
  - query no-write and degraded surface
  - consumer dedup / receipt / stale marker
  - public job duplicate replay / no-truth-repair
         ^
         |
[Contract / Unit]
  - DTO / typed ref / metadata / digest schema
  - domain invariants / policy / state matrix
  - config parser / validator / source priority
  - redaction helper / metric label rules
```

关键说明:

- 高风险状态、事务、幂等和 redaction 不等待 release gate 才发现。
- P0 integration 明确使用 fake / controlled / replay-backed adapters,不要求真实产品。
- `PublishPendingArtifactRelays` 虽然叫 publish loop,但它是 worker-only internal facade,不计入 6 个 public job。
- `Query no-write` 和 `Job no-truth-repair` 需要 write-audit 或等价测试工具配合,不能只靠最终结果判断。

### 8.2 测试分层策略表

| 层级 | 目标 | 典型内容 | 主要 profile | 失败处理 |
|---|---|---|---|---|
| Contract / Unit | 尽早发现 schema、状态、不变量、纯函数和配置规则错误 | DTO roundtrip、metadata required、digest profile、domain factory、policy reject、state matrix、strict JSON parser、source priority negative、redaction helper | `ci-test` | 阻断提交;不进入更高层 |
| Application service / orchestration | 验证正式 flow 编排、幂等、错误映射和副作用顺序 | command accepted transaction、query no-write、consumer receipt / stale、stored result / report、same key different digest、commit unknown recovery | `ci-test` | 阻断提交;定位到 service / port contract |
| Integration with fake / controlled / replay-backed adapters | 验证 repository / adapter 语义、runtime builder、failure injection 和 replay 保真 | version conflict、rollback、dependency index、reference scope、outbox snapshot、publisher / handoff failure、builder `Ready/Failed`、replay root rules | `ci-test`、`integration-like`、`operations-replay` | 阻断合并;P1 real-like 单独记录 |
| API / Worker / Job entry | 验证入口 DTO 解析、surface 映射、worker disposition 和 runner report | handler required fields、query surface、consumer unsupported / delayed、relay loop、job input validation / duplicate replay | `ci-test`、`integration-like` | P0 阻断合并 |
| Release gate / evidence summary | 验证最小闭环、profile 证据、redaction、dependency 和 veto 汇总 | main smoke、profile matrix、config validation report、redaction scan、dependency check、operations-replay summary | release candidate summary over P0 profiles | P0 失败阻断送验 |

### 8.3 Step 3 切口到测试层级映射

| 测试切口 | 主发现层级 | 辅助层级 | 是否阻断 P0 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | Contract / Unit | API / Worker / Job entry | 是 |
| `contracts_metadata_validation` | Contract / Unit | API / Worker / Job entry | 是 |
| `contracts_operation_digest_profile` | Contract / Unit | Application service | 是 |
| `domain_object_invariants` | Contract / Unit | Application service | 是 |
| `domain_policy_accept_reject` | Contract / Unit | Application service | 是 |
| `domain_state_matrix_transitions` | Contract / Unit | Application service | 是 |
| `application_command_orchestration` | Application service / orchestration | API entry;integration | 是 |
| `application_query_no_write` | Application service / orchestration | integration write audit;query entry | 是 |
| `application_consumer_orchestration` | Application service / orchestration | worker entry;integration | 是 |
| outbound event schema cuts | Contract / Unit | relay worker;publisher integration | 是 |
| public job cuts | API / Worker / Job entry | application job orchestration;integration | 是 |
| `PublishPendingArtifactRelays_job` | API / Worker / Job entry | integration with publisher / repository | 是 |
| consistency / idempotency cuts | Application service / orchestration | repository fake / UoW integration | 是 |
| config / replay / redaction cuts | Contract / Unit | builder integration;replay integration;release gate | 是 |
| dependency boundary cut | Contract / Unit static check | release gate summary | 是 |
| P1 durable-like / real-like seam | controlled / real-like integration | release candidate selected-run | 否,除非正式升级为 P0 |
| P2 capacity / production-like | future performance / operations suite | release review | 否 |

### 8.4 高风险断言最早发现层级表

| 高风险断言 | 最早发现层级 | 不应只靠哪层 | 原因 |
|---|---|---|---|
| 非法状态转换被接受 | Contract / Unit | release gate smoke | domain state matrix 可直接判定 |
| accepted command 漏 stored result / relay / trace | Application service | API smoke | 需要检查 UoW 内副作用顺序 |
| query 在 degraded 路径顺手 refresh / rebuild / repair | Application service + write audit | query surface smoke | smoke 很难证明“没有写” |
| duplicate replay 从 current truth 重算 | Application service | final response snapshot | 需要操控 stored result missing / wrong kind |
| consumer 绕过 command 入口直写真相 | Application service / worker entry | cross-entry smoke | 必须看 worker 写入面 |
| public job 反写 core truth | job orchestration + write audit | replay summary | 需要区分 derived / report 与 truth store |
| relay publish failure 回滚 accepted truth | adapter integration | release gate | 需要注入 publisher failure |
| external body / secret 进入 outbox / audit / report / log | contract redaction + artifact scan | manual review | 必须自动检查输出面 |
| runtime builder 在 invalid config 下暴露 partial facade | builder integration | config file review | 需要验证 `Failed` no facade |
| non-core sibling 编译期依赖打穿 | static architecture check | manual review | 依赖裁剪必须可重复检查 |

### 8.5 P0 profile 到测试层级映射

| Profile | 在分层中的角色 | 必做层级 | 不承担内容 |
|---|---|---|---|
| `local-dev` | 本地功能开发与入口联调 profile | local smoke、manual sanity、builder boot check | 不作为主要 release 证据来源 |
| `ci-test` | P0 主验证 profile | contract / unit、service、deterministic fake integration、API / worker / job entry | 不证明 controlled seam / replay 恢复 |
| `integration-like` | P0 seam 和 failure mapping profile | controlled integration、entry mapping、topic completeness、handoff / publisher failure | 不要求真实生产 endpoint |
| `operations-replay` | P0 恢复与维护证据 profile | replay-backed integration、public job recovery、operations-replay report、release summary evidence | 不承担 command / query 全量业务覆盖 |
| future `staging-like` / `production-like` | future hardening profile | P1/P2 selected-run | 不得伪装成当前 P0 门禁 |

### 8.6 Release gate 使用边界

| 场景 | 是否进入 release gate | 进入原因 | 不承担内容 |
|---|---|---|---|
| minimal sync-entry -> query -> relay smoke | 是 | 证明最小主链可运行并可留证 | 不替代 16 个 Command 的 service coverage |
| profile matrix evidence | 是 | 证明四个 P0 profile 可装配且边界清楚 | 不替代 config parser / validator unit |
| redaction artifact scan | 是 | 证明实际 report / output 无 forbidden body / secret | 不替代 redaction helper unit |
| dependency boundary check | 是 | 证明依赖裁剪可留证 | 不替代架构文档审查 |
| operations-replay summary | 是 | 证明 replay root、partial failure、no-truth-repair 可留证 | 不替代 public job 细粒度用例 |
| full cross-repo E2E | 否,属于 P1/P2 | 真实相邻仓差异验证 | 不作为 Artifact P0 truth center 成立前置 |
| capacity / hard SLO | 否,属于 P2 | 当前没有正式阈值 | 不能据此判定 P0 pass/fail |

### 8.7 分层覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 3 全部 P0 切口是否有主发现层级 | 通过 | 见 §8.3 |
| 是否把高风险全部推给 release gate | 通过 | 高风险已前置到 contract / service / integration |
| Contract / Unit 是否覆盖 schema、state、config、redaction | 通过 | 见 §8.2 / §8.4 |
| Service 是否覆盖 UoW、duplicate、query no-write、consumer receipt、job no-truth-repair | 通过 | 见 §8.2 / §8.4 |
| Integration 是否限定为 fake / controlled / replay-backed seam | 通过 | P0 不要求真实产品 |
| Entry 层是否覆盖 API / worker / public job runner / relay loop | 通过 | `PublishPendingArtifactRelays` 已单列 |
| 四个 P0 profile 是否都被分层承接 | 通过 | 见 §8.5 |
| Release gate 是否没有伪造 P1/P2 pass | 通过 | 见 §8.6 |
| 是否存在未分层的 P0 测试对象 | 通过 | 当前未发现 |

## 9. 对上游设计的影响判定

| 分层结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 integration 使用 fake / controlled / replay-backed seam | 否 | 测试策略 | 符合 `04` profile 口径 |
| `Query no-write` / `Job no-truth-repair` 需要 write-audit | 否 | 测试工具需求 | Step 9 再定义自动化或 manual gate |
| worker-only relay publication 不计入 6 public jobs | 否 | 口径澄清 | 符合 `03` Step 8 正式协议总表 |
| future real-like / capacity 不作为 P0 | 否 | release gate 边界 | 符合 Step 2 P1/P2 范围 |
| 若后续要求 real-like seam 或 capacity 升级为 P0 | 是 | 验收基线变更 | 需要回写 `05/06/07` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试分层图”“测试分层策略表”“Step 3 切口到测试层级映射”“P0 profile 到测试层级映射”和“Release gate 使用边界”小节。

正式 `05-测试方案.md` §4 应回填:

- 测试分层按风险发现位置组织:Contract / Unit、Application service / orchestration、Integration with fake / controlled / replay-backed adapters、API / Worker / Job entry、Release gate / evidence summary。
- DTO / typed ref / metadata / digest、domain invariants / state、config parser / validator、source priority 和 redaction helper 必须在 contract / unit 层发现。
- UoW、stored result / report、duplicate replay、query no-write、consumer dedup / receipt 和 job no-truth-repair 必须在 service / orchestration 层发现。
- repository version / rollback / index、publisher / handoff failure、runtime builder、profile assembly 和 operations-replay 语义必须在 fake / controlled / replay-backed integration 层发现。
- 16 Command、13 Query、6 Consumer、8 Outbound Event、6 public jobs 和 worker-only relay publication 都要有明确入口层或辅助层承接。
- release gate 只做最小闭环、四个 P0 profile 证据、redaction scan、dependency check、operations-replay summary 和 veto 汇总,不得替代底层断言。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| repository write-audit helper 如何实现 | 影响 query no-write / job no-truth-repair 自动化 | Step 9 收口 |
| dependency boundary check 用脚本还是 manual gate | 影响架构边界 evidence | Step 9 / Step 13 再定义 |
| minimal release gate smoke 具体包含哪些 protocol family | 影响 Step 9 / Step 13 evidence 颗粒度 | 先在 Step 6 确定最小闭环用例 |
| P1 real-like seam 是否后续升级 | 影响 pass gate | 当前不升级;若升级需回写设计与验收标准 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 测试分层覆盖 Step 3 全部 P0 切口 | 通过 | 见 §8.3 / §8.7 |
| 高风险未全部推给 release gate | 通过 | 见 §8.4 |
| 四个 P0 profile 已映射到测试层级 | 通过 | 见 §8.5 |
| release gate 边界已明确 | 通过 | 见 §8.6 |
| 可进入 Step 5 | 通过 | 下一步建立需求追溯与覆盖矩阵 |
