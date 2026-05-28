## Step 6. 拆分阶段任务、编写顺序与提交边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6
- 回填章节：`07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/03-详细设计.md` §4 / §5 / §7 / §8 / §10 / §12 / §13 / §15
  - `projects/L0-core/05-测试方案.md` §6 / §9
  - `standards/document/实施计划书写规范.md` §4.6 / §4.7 / §4.7.1 / §4.8 / §4.9
- 已确认结论：
  - 阶段顺序为 PH-01~PH-06。
  - 代码批次不是 commit 的同义词；commit 必须对应一个可独立验证的边界。
  - 单批 100~300 行为宜，超过 300 行应拆分，超过 500 行必须拆分。
  - 状态机、事务、并发、幂等、安全、审计、错误恢复和跨仓同步必须单独批次实现和验证。
- 依赖的前序 Step：
  - `07_implementation_plan_step_05_phases_dependencies.md`

### 3. SOP 问题回答

1. 每个阶段内有哪些实施动作。

   回答：每阶段动作按可验证能力拆分：PH-01 建骨架、DTO、配置和 fake；PH-02 打通草稿写路径；PH-03 扩展评审、发布和生命周期；PH-04 扩展查询、投影、追溯和消费视图；PH-05 扩展 jobs、snapshot、fact 和 relay；PH-06 执行最小闭环、证据和红线收口。

2. 每个任务的输入、输出和完成判定是什么。

   回答：输入来自 03 的实现契约、05 的测试切口和前序批次；输出必须是代码、测试、fixture 或证据；完成判定必须绑定 fmt/lint/test suite、TC 或 EV，不能只写“代码完成”。

3. 阶段内代码应该按什么顺序写，为什么。

   回答：每阶段都先锁定外部契约和测试切口，再实现 domain/application/infra，最后接入口、错误、审计、证据和提交边界。原因是 L0-core 的核心风险在协议稳定、状态/事务/幂等和跨仓边界，不能先横向堆完对象再补验证。

4. 是否先锁定外部契约和测试切口，再填内部实现。

   回答：是。PH-01 必须先锁 DTO、config、test harness 和 fake adapter；后续每阶段必须先补对应 command/query/job/event 测试切口，再填内部实现。

5. 哪些任务必须同提交，哪些任务必须分开提交。

   回答：同一可验证纵切内的 DTO、service、repository fake 和测试可以同提交；高风险的事务/幂等、发布生命周期、projection、relay、redline scan 必须单独提交边界。无关格式化、文档同步和跨阶段功能不得混入同一提交。

6. 哪些时机可以 commit，哪些时机不能 commit。

   回答：可以在一个 commit boundary 对应的批次全部通过门禁后 commit；不能在代码不可编译、测试失败、半个对象完成、设计偏离未回写或只是保存 WIP 时 commit。

7. 哪些测试必须在提交前执行。

   回答：每笔提交至少执行 fmt/lint 和该边界相关 unit/service/config/contract/integration/job/e2e suite。PH-06 的提交必须执行 release gate 相关 E2E、redline 和 evidence 检查。

8. 是否存在提交边界过大或过小的问题。

   回答：存在两个风险：按 crate 提交会过大，按单个 struct/function 提交会过小。本方案以可验证纵切和风险隔离点为边界，保留 11 个 commit boundary。

9. 是否存在把无关修改混入同一提交的风险。

   回答：存在，尤其是格式化、测试 fixture、文档同步和功能实现混入。本方案要求每个 commit boundary 写明“不包含内容”，提交前对照 diff 范围检查。

10. 每个提交边界能否用一句话描述。

   回答：能。每个提交边界都以一个可验证能力命名，例如“establish draft command vertical slice”或“add release baseline lifecycle gate”。

11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退。

   回答：可以。每个边界都绑定批次、门禁和不包含内容；回退某个边界不会要求回退无关阶段。

12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作。

   回答：PH-02、PH-03、PH-04、PH-05 均存在超过 300 行风险，因此拆成多个批次；任何预计超过 500 行的动作必须在实施时继续拆分，不能一次性落地。

13. 哪些实现动作必须拆成多个代码批次。

   回答：draft 写路径、publish baseline、query/projection、job/snapshot/relay、E2E/evidence 均必须拆成多个批次。

14. 哪些状态机、事务、并发、幂等、安全、审计、错误恢复或跨仓同步逻辑必须单独批次实现。

   回答：draft/update 幂等与 expected version、publish gate fail、lifecycle terminal guard、projection stale/rebuild、outbox relay failed/pending、安全红线 scan、audit/outbox 原子边界必须单独批次。

15. 每个代码批次完成后应该执行哪些编译、格式化、lint、单测、集成测试或验收门禁。

   回答：每批至少执行 `cargo fmt`、`cargo clippy`、`cargo test` 或目标仓等价命令；高风险批次必须加跑对应 TC / suite；PH-06 批次必须产生 EV 和 release gate 证据。

16. 每个代码批次与提交边界是什么关系。

   回答：一个 commit boundary 可包含一个或少数强相关批次；批次通过后才允许合并为对应 commit。不得为每个文件单独提交，也不得把多个无关边界合成一笔。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 5 阶段表 | 已有阶段顺序，但没有阶段内任务和提交边界 | 实施者仍可能按 crate / object 随意编码 |
| Step 4 交付物表 | 交付物可判定，但没有代码批次 | 大交付物可能一次写入超过 500 行 |
| `03-详细设计.md` | 实现契约足够细 | 若 07 直接重写细节，会污染详细设计 |
| `05-测试方案.md` | suite 和 TC 明确 | 需要映射到提交前门禁，而不是最后执行 |
| Commit 规范 | 英文实现仓 commit 规则已存在 | 需要在 §6 中先定义 commit boundary，Step 11 再展开 message 纪律 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段内部 | 只有阶段名和门禁 | 每阶段有任务、批次和提交边界 | 让其他 agent 可按顺序实施 |
| 编写顺序 | 未定义 | 先契约/测试，再核心逻辑，再 adapter/入口，再证据 | 避免无验证铺代码 |
| 批次规模 | 未约束 | 每批 100~300 行为宜，>300 拆，>500 禁止 | 降低 review 和返工成本 |
| 提交边界 | 未定义 | 11 个可验证 commit boundary | 支持独立 review、验证和回退 |
| 高风险逻辑 | 可能混在普通实现中 | 单独批次和门禁 | 保护状态、事务、幂等、审计和跨仓边界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 crate 一笔提交 | 与文件结构一致 | 过大且不可验证，容易把测试后置 | 不采用 |
| 每个文件 / struct 一笔提交 | 粒度极细 | review 噪音大，git log 不可读 | 不采用 |
| 每个可验证功能增量一笔提交 | 可一句话描述，可验证，可回退 | 需要阶段内跨模块组织代码 | 采用 |
| 所有测试最后统一提交 | 编码初期快 | 阶段完成不可判定 | 不采用 |
| 测试与功能边界同批次或同提交边界 | 证据紧贴实现 | 单笔提交稍大 | 采用 |

### 7. 结构化中间产物

#### 7.1 每阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 建立 workspace、crate、asset root 和基础 CI/test harness | DD §4 / Step 5 PH-01 | `Cargo.toml`、`crates/*`、fixture root | workspace 可构建 |
| IMPL-01-02 | 2 | 锁定 DTO / metadata / error schema 和 roundtrip 测试 | DD §7 / TC-DTO-001 | contracts crate + schema tests | dto suite 通过 |
| IMPL-01-03 | 3 | 建立 JSON config、runtime wiring skeleton、fake ports | 04 §7 / DD §13 | config fixture、fake adapters | config smoke 通过 |
| IMPL-02-01 | 1 | 实现 draft aggregate、scope / boundary policy 与 unit tests | DD §5 / §9 | domain draft objects | scope / lifecycle unit 通过 |
| IMPL-02-02 | 2 | 实现 create/update draft service、idempotency 和错误映射 | DD §8 / §12 | command service | TC-CMD-001~002 / TC-IDEM 通过 |
| IMPL-02-03 | 3 | 接入 file repo、audit、outbox 原子边界 | DD §10 | repository + stores | TC-OUTBOX-001 / TC-TXN-001 通过 |
| IMPL-03-01 | 1 | 实现 submit review、publish baseline 和 gate fail | DD §7 / §8 | review / publish command | TC-CMD-003~005 通过 |
| IMPL-03-02 | 2 | 实现 lifecycle terminal guard、compatibility status、events | DD §9 / §7.4 | lifecycle command + events | TC-CMD-006 / event tests 通过 |
| IMPL-04-01 | 1 | 实现 read model query 和 stale 标记 | DD §7.3 / §10 | query services + projection store | TC-QUERY-001~002 通过 |
| IMPL-04-02 | 2 | 实现 trace、compatibility trace、package/sample view | DD §7.3 / §8 | trace / view queries | TC-QUERY-003 / 007 / 008 通过 |
| IMPL-05-01 | 1 | 实现 validate/recalculate/rebuild job shell 和 fake runner | DD §7.5 / §13 | job binaries + receipts | TC-JOB-001 / 003 / 004 通过 |
| IMPL-05-02 | 2 | 实现 snapshot derive、fact publish 和 relay boundary | DD §10 / §13 | snapshot / fact / relay | TC-JOB-002 / 005 / TC-OUTBOX-002 通过 |
| IMPL-06-01 | 1 | 实现最小 E2E fixture 和 release gate runner | 05 §9 / 06 §5 | E2E test harness | TC-E2E-001 通过 |
| IMPL-06-02 | 2 | 补齐 evidence index、redline scan 和 handoff note | 06 §10 / §11 | evidence + scans + notes | EV 可定位且无 blocker |

#### 7.2 每阶段代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | workspace 和 test harness 可构建 | IMPL-01-01 | workspace skeleton | 100~300 行 | fmt/lint/check | commit-01-a |
| BATCH-01-02 | DTO / metadata / error roundtrip | IMPL-01-02 | contracts crate + tests | 100~300 行；>300 拆 schema 子批次 | dto_schema_contract_suite | commit-01-b |
| BATCH-01-03 | config + fake ports skeleton | IMPL-01-03 | config fixture + runtime shell | 100~300 行 | config_smoke_suite | commit-01-b |
| BATCH-02-01 | draft domain policy 和状态测试 | IMPL-02-01 | domain draft objects/tests | 100~300 行 | unit_domain_suite | commit-02-a |
| BATCH-02-02 | create/update command + idempotency | IMPL-02-02 | command service/tests | 100~300 行；幂等单独批 | service_command_query_suite | commit-02-b |
| BATCH-02-03 | repo/audit/outbox 原子边界 | IMPL-02-03 | stores + transaction tests | 100~300 行；事务单独批 | integration_persistence_suite | commit-02-b |
| BATCH-03-01 | review/publish/gate fail | IMPL-03-01 | publish service/tests | 100~300 行 | service_command_query_suite | commit-03-a |
| BATCH-03-02 | lifecycle terminal + events | IMPL-03-02 | lifecycle/event tests | 100~300 行 | unit + event contract | commit-03-b |
| BATCH-04-01 | read model 和 stale query | IMPL-04-01 | query services/tests | 100~300 行 | service_command_query_suite | commit-04-a |
| BATCH-04-02 | trace/package/sample view | IMPL-04-02 | trace/view tests | 100~300 行；>300 拆 view 子批次 | query / trace tests | commit-04-b |
| BATCH-05-01 | validate/rebuild/recalculate jobs | IMPL-05-01 | job binaries/tests | 100~300 行；job 过大则拆 | worker_job_suite | commit-05-a |
| BATCH-05-02 | snapshot/fact/relay boundary | IMPL-05-02 | snapshot + relay tests | 100~300 行；relay 单独批 | worker + outbox relay suite | commit-05-b |
| BATCH-06-01 | E2E minimal loop | IMPL-06-01 | release gate E2E | 100~300 行 | e2e_minimal_loop_suite | commit-06-a |
| BATCH-06-02 | evidence/redline/handoff | IMPL-06-02 | evidence index + scans | 100~300 行 | evidence / redline checks | commit-06-a |

#### 7.3 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace 可构建后 | workspace、crate skeleton、test harness | DTO 细节、业务逻辑 | fmt/lint/check |
| commit-01-b | DTO/config/fake 基础门禁通过后 | contracts DTO、config fixture、fake ports | draft 业务写路径 | dto + config smoke |
| commit-02-a | draft domain unit 通过后 | domain draft、scope、boundary policy | repository / outbox | unit_domain_suite |
| commit-02-b | draft 纵切通过后 | create/update service、idempotency、repo/audit/outbox | review / publish | service + integration |
| commit-03-a | publish 主线通过后 | submit/review/publish/gate fail | query / jobs | command service tests |
| commit-03-b | lifecycle/event 通过后 | lifecycle terminal guard、events | projection / relay | lifecycle + event tests |
| commit-04-a | basic query 和 stale 通过后 | read model、get/list query | trace / package / sample | query tests |
| commit-04-b | trace / consumer views 通过后 | trace、compatibility trace、package/sample | jobs / relay | trace + view tests |
| commit-05-a | job shell 和 runner 通过后 | validate/rebuild/recalculate jobs | snapshot/fact/relay | worker_job_suite |
| commit-05-b | snapshot/fact/relay 通过后 | derive snapshot、publish fact、outbox relay | E2E release gate | worker + relay boundary |
| commit-06-a | release gate 和 evidence 通过后 | E2E、evidence index、redline scan、handoff | 新功能范围扩展 | E2E + evidence + redline |

#### 7.4 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留；DTO 过大时先拆批次不拆边界 |
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 偏大但合理 | 是 | 是 | 保留；幂等/事务超 300 行时拆批次 |
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 适中 | 是 | 是 | 保留 |
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 偏大但合理 | 是 | 是 | 保留；view 实现过大时拆批次 |
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 偏大但合理 | 是 | 是 | 保留；relay 单独批次验证 |
| commit-06-a | 适中 | 是 | 是 | 保留；只做收口不加新功能 |

#### 7.5 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | `git config user.name` / `user.email` 符合 Step 3 |
| diff 范围 | 只覆盖一个 commit boundary，不混入无关格式化或跨阶段功能 |
| 编译格式 | `cargo fmt`、`cargo clippy`、`cargo test` 或等价命令通过 |
| 边界门禁 | 本提交边界声明的 suite / TC / EV 已通过或记录 |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 |
| 文档同步 | 设计偏离已回写 design 文档或登记风险 |
| Commit message | 英文 `type(scope): subject`，body 按子功能分组，footer 符合规范 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §6。

````md
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源：
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“每阶段任务表”“每阶段代码实现批次”“提交边界”“提交粒度判断”和“提交前检查清单”小节，了解实施任务如何按可验证功能增量和提交边界收敛。

本轮实施按 PH-01~PH-06 推进。每阶段先锁定外部契约和测试切口，再实现核心领域 / 应用逻辑，再接入 port / adapter / repository / entry，最后补齐错误、状态、事务、幂等、审计、证据和提交边界。

| 阶段 | 关键任务 | 关键批次 | 提交边界 | 提交前门禁 |
|---|---|---|---|---|
| PH-01 | workspace、DTO、config、fake ports | BATCH-01-01~03 | commit-01-a / commit-01-b | fmt/lint/check、DTO、config smoke |
| PH-02 | draft domain、create/update、idempotency、repo/audit/outbox | BATCH-02-01~03 | commit-02-a / commit-02-b | unit、service、integration |
| PH-03 | review、publish、gate fail、lifecycle、events | BATCH-03-01~02 | commit-03-a / commit-03-b | command、lifecycle、event tests |
| PH-04 | query、projection stale、trace、package/sample | BATCH-04-01~02 | commit-04-a / commit-04-b | query、trace、view tests |
| PH-05 | jobs、snapshot、fact、relay boundary | BATCH-05-01~02 | commit-05-a / commit-05-b | worker job、outbox relay |
| PH-06 | E2E、evidence、redline、handoff | BATCH-06-01~02 | commit-06-a | release gate、evidence、redline |

代码批次以 100~300 行为宜；预计超过 300 行应拆分；预计超过 500 行必须拆分。状态机、事务、并发、幂等、安全、审计、错误恢复和跨仓同步逻辑必须单独批次实现、单独验证。

每个 commit boundary 必须能用一句话描述、能独立验证、能必要时独立回退。禁止按单个文件、单个 struct、单个函数或当天工作量提交；禁止把无关格式化、功能、测试和文档混成一笔。
````

### 9. 待确认事项

- 目标实现仓真实 CI 命令和 job 名称仍需 Step 7 / Step 11 对齐。
- 如果实施时某批次预计超过 300 行，需要在不改变阶段目标的前提下继续拆子批次。
- commit message 正式模板和示例在 Step 11 展开；本 Step 只定义提交边界和提交时机。

建议方案：接受当前 11 个 commit boundary。原因是它们按可验证功能增量和风险隔离点划分，能支撑 review、回退和证据审查。

### 10. 进入下一步条件

- 每个阶段都有任务表、编写顺序和提交边界。
- 每个阶段都有代码实现批次表，且批次规模、验证门禁和提交关系清楚。
- 每个提交边界都有提交前门禁。
- 可以进入 Step 7，继续嵌入测试与验收门禁。
