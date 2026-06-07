# Step 6. 设计测试场景与用例矩阵

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 6 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。用例矩阵按测试主线聚合,并在 protocol 类用例中明确覆盖全量 Command / Query / Event / Job;实现阶段可在各 crate 测试文件中拆成更细的函数名。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 5 覆盖矩阵 | 提供 TC / EV 骨架 | 用例 ID 与证据 ID 保持一致 |
| `03_ddd_step_16_test_cuts.md` §6.2~§6.10 | 提供最小测试切口 | 逐类转为用例矩阵 |
| `03-详细设计.md` §7~§12 | 提供 protocol、flow、state、error 和幂等断言 | 断言必须使用正式名称 |
| `04_config_step_12_downstream_handoff.md` | 提供配置场景 | config 用例进入本矩阵 |

---

## 3. SOP 问题回答

1. 每个 P0 正向主线怎么执行?

   回答:通过 contract roundtrip、domain state transition、command service success、query hit、consumer accepted、outbox publish success、job completed、script success 和 E2E minimum closure 执行。

2. 每个关键反向和边界场景如何触发?

   回答:通过 required field missing、invalid enum、domain illegal transition、same key different digest、result missing、version conflict、source unavailable、digest mismatch、body rejected、invalid config、redaction fail 等方式触发。

3. 每个状态非法迁移如何断言?

   回答:按 `03_ddd_step_10_state_matrix.md` 的正式状态和错误断言,非法迁移不得写 success trace、outbox、projection marker 或 operation result。

4. 每个事务回滚和副作用如何验证?

   回答:通过 fake UoW 注入 save result failure、idempotency complete failure、outbox save failure、rollback failure 和 expected version conflict,断言 truth / trace / outbox / result / idempotency 可见性。

5. 每个恢复场景如何复现?

   回答:通过 source unavailable、commit unknown、operation result missing、publisher permanent failure、handoff permanent failure、job partial failure 和 recovery maintenance rerun 复现。

6. 每个用例预期结果引用了哪些正式字段、状态、错误或事件?

   回答:用例中的状态、错误、event、job 和 receipt 名称均来自 `03-详细设计.md` 与 Step 8 / 10 / 12 / 13。

7. 是否存在把后续 phase 状态或证据提前写入当前用例的问题?

   回答:当前用例不写 production-like、remote config 或正式 AC 通过结论;这些作为 P1/P2 或后续 `06/07` 输入。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 用例编号 `TC-001` 不稳定,断言口径旧 | 改为 `TC-PROC-*` |
| `03` §15 | 切口多但未变成可执行用例 | 本 Step 提供前置、输入、预期和断言 |
| `04` §12 | 配置测试场景未编号 | 本 Step 编入 `TC-PROC-CONFIG-*` |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 用例结构 | 场景 + 步骤摘要 | 用例 ID、优先级、前置、输入、预期、断言、自动化 |
| 覆盖对象 | 少量业务主线 | protocol、state、transaction、idempotency、event、job、config、script |
| 负向测试 | checkpoint missing 等少量 | required field、illegal transition、conflict、rollback、body rejected、config fail |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 用例是否逐接口全部展开 | Command / Query / Event / Job 列出全量 ID 组,正式 05 保持可读;实现测试函数可继续细分 |
| 性能用例是否写硬阈值 | 不写硬阈值,待 `06` 或性能基线提供 |
| E2E 用例数量 | 只保留最小闭环和 P1 real-like smoke,细节由 lower layers 覆盖 |

---

## 7. 结构化中间产物

### 7.1 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| TC-PROC-CONTRACT-001 | Public protocol roundtrip | P0 | contracts crate 可编译 | 构造 13 Command、11 Query、7 inbound event、10 outbound event、7 job DTO | roundtrip 成功,required field / enum variant 稳定 | metadata、receipt、error、view、job schema 不漂移 | 是 |
| TC-PROC-CONTRACT-002 | Required field / metadata negative | P0 | DTO fixture 可构造 | 缺 Command idempotency key、Event dedup key、Job idempotency key、非法 enum | validation reject | Query 不携带 idempotency;invalid request 不 begin UoW | 是 |
| TC-PROC-STATE-001~016 | 16 状态机 legal / illegal transition | P0 | domain object fixture | 对每组状态机执行一条主线合法转换、一条边界合法转换、一条非法转换 | 合法转换保存目标状态;非法转换返回正式 DomainError | terminal guard、derived-only guard、no success side effect | 是 |
| TC-PROC-CMD-001~013 | 13 Command success / reject / duplicate / conflict | P0 | fake repositories、fake idempotency、fake resolvers;waiting gate fixture 可注入 missing pause context | 调用每个 command flow 的 success、domain reject、duplicate、same key different digest;`ResumeWaitingGate` missing pause context | success 写 truth / trace / outbox / result;duplicate 返回 stored result;conflict 不进 domain;missing sidecar truth reject 且不写 success side effects | UoW 顺序、operation result save-before-complete、receipt.duplicate、sidecar truth 读取面 | 是 |
| TC-PROC-QUERY-001~011 | 11 Query hit / missing / degraded / no-write | P0 | projection / view fixture;waiting gate fixture 可注入 missing pause context | 调用每个 query 的 available、missing、not visible、degraded;`GetWaitingGate` missing pause context | 返回正式 view / status / marker;不写 truth;missing pause context -> `ProcessViewStatus::Degraded` | no write UoW、no resolver refresh、no projection repair、sidecar missing 不升级成 command reject 口径 | 是 |
| TC-PROC-EVENT-001~007 | Inbound event accepted / duplicate / quarantine / delayed / noop | P0 | event fixture、dedup store、fake resolver | 消费 7 inbound event 的成功、重复、digest mismatch、source unavailable、noop | accepted 写 marker / stale state;duplicate replay receipt;invalid quarantine;unavailable delayed | ConsumerDisposition、ConsumerReceipt、no external body | 是 |
| TC-PROC-PUB-001 | Outbox publish success / retry / failed | P0 | outbox pending records、fake publisher | publish 10 outbound event payload;注入 retryable / permanent failure | success mark published;retryable mark retry;permanent mark failed | truth 不回滚;payload forbidden body absent;topic map complete | 是 |
| TC-PROC-JOB-001~007 | Operations job completed / duplicate / invalid / partial | P0 | job fixture、fake store / adapter | 执行 7 operations job,含 invalid input、duplicate key、per-item failure | JobRunReceipt 正确;partial failure 保留成功项;duplicate 不重跑 item loop | JobDisposition、report refs、no auto repair truth | 是 |
| TC-PROC-TX-001 | UoW ordering and rollback | P0 | fake UoW 可注入失败 | 注入 result save failure、idempotency complete failure、outbox save failure、rollback failure | 失败时无 partial committed truth;rollback failure surface manual intervention | truth / trace / outbox / result / idempotency 可见性 | 是 |
| TC-PROC-IDEMP-001 | Same key same digest duplicate replay | P0 | completed idempotency + stored result | 重放相同 command / event / job key 和 digest | 返回 stored result / receipt,不调用 domain / resolver / publisher / handoff | no second truth / marker / adapter call | 是 |
| TC-PROC-IDEMP-002 | Same key different digest conflict | P0 | existing idempotency key | 用相同 key 不同 canonical digest 调用 | 返回 idempotency conflict / quarantine / job conflict | 不进入 domain transition | 是 |
| TC-PROC-IDEMP-003 | Operation namespace isolation | P0 | 多 operation namespace | 同 raw key 用于不同 command / event / job operation | 不互相判 duplicate | namespace 参与 digest / reservation | 是 |
| TC-PROC-RECOVERY-001 | Result missing no recompute | P0 | idempotency completed 指向缺失 result | duplicate 请求触发 load duplicate result | 返回 result missing surface | 不从 current truth 重算 | 是 |
| TC-PROC-RECOVERY-002 | Commit unknown retry | P0 | fake commit unknown | retry same key | 先读 idempotency / result store,不盲写第二次 truth | no duplicate truth | 是 |
| TC-PROC-RECOVERY-003 | Source unavailable mapping | P0 | fake resolver unavailable | command / consumer / job 触发 source unavailable | command temporary unavailable;consumer delayed;job partial / dependency unavailable | 不写 resolved marker | 是 |
| TC-PROC-RECOVERY-004 | Permanent publisher / handoff failure | P0 | fake publisher / handoff permanent failure | outbox publish / handoff job | failed marker、partial report、manual intervention evidence | committed truth 不回滚,无 external body | 是 |
| TC-PROC-CONFIG-001 | Defaults only runtime builder | P0 | 无外部 config | 使用 code defaults 构造 local-dev / ci-test runtime | runtime 可构造, fake / in-memory marker 明确 | 不需要真实外部服务 | 是 |
| TC-PROC-CONFIG-002 | Valid JSON + env override | P0 | valid JSON fixture | 加载 JSON 后用 env 覆盖普通值 | 高优先级覆盖成功,validation 通过 | source priority | 是 |
| TC-PROC-CONFIG-003 | Invalid JSON / duplicate key / alias key | P0 | invalid config fixture | 加载非法配置 | fail-fast | 不回退低优先级 | 是 |
| TC-PROC-CONFIG-004 | Bad duration / page limit / retention conflict | P0 | invalid field fixture | validator 校验 | fail-fast | boundary.max_page_limit >= 1;retention cross-field | 是 |
| TC-PROC-CONFIG-005 | Missing endpoint / credential ref | P0 | configured adapter 缺 ref | runtime builder | fail-fast / fail-closed | configured adapter 不 fallback fake | 是 |
| TC-PROC-CONFIG-006 | Topic map missing | P0 | 缺少某 outbound event topic | publisher config validation | fail-fast | 10 outbound event topic complete | 是 |
| TC-PROC-CONFIG-007 | Raw secret rejected | P0 | raw token / password config | config load / redaction scan | reject config 或 gate fail | raw secret 不进入 artifacts / reports | 是 |
| TC-PROC-CONFIG-008 | Fake marker and configured unavailable | P0 | local fake / integration configured | fake success 与 configured unavailable 分别执行 | fake marker 明确;configured unavailable 不伪成功 | no fake fallback | 是 |
| TC-PROC-CONFIG-009 | Config digest and drift warning | P0 | job run + report generation | 修改 job config 后生成 report | report 记录 config digest / drift warning | evidence 可复核 | 是 |
| TC-PROC-SEC-001 | Forbidden external body rejected | P0 | method / work / governance / artifact / runtime / conversation body fixture | 将 forbidden body 放入 snapshot、event、handoff 或 report fixture | validation / redaction gate reject,不保存正文 | 只允许 ref / digest / marker / summary | 是 |
| TC-PROC-OBS-001 | Logs / metrics forbidden field check | P0 | 运行成功 / 失败样本 | 扫描 structured logs and metrics | 无 raw body、secret、高基数 label | actor / request / subject ref 不做 metric label | 是 |
| TC-PROC-OBS-002 | Audit refs-only | P0 | accepted command / event / job | 检查 audit / trace | 只含 ref、count、state、error kind | 无 external body | 是 |
| TC-PROC-SCRIPT-001 | Gate script contract | P0 | test workspace | `scripts/gates/run_ci_gate.sh --run-id --artifact-root --config-profile` | 输出 `artifacts/test/<run_id>`,失败非 0 且保留 failure report | artifact path 固定 | 是 |
| TC-PROC-SCRIPT-002 | Report script contract | P0 | existing artifacts | `scripts/reports/generate_reports.sh --run-id --artifact-root --report-root` | 输出 `reports/runs/<run_id>`,缺 artifact 非 0 | 不引用 latest | 是 |
| TC-PROC-SCRIPT-003 | Redaction checker contract | P0 | artifacts + reports | `scripts/checks/check_redaction.sh --artifact-root --report-root` | 输出 redaction-check,发现 raw secret / body / package body 失败 | 覆盖 artifacts 和 reports | 是 |
| TC-PROC-NFR-001 | Performance / scalability sample | P1 | deterministic fixture | benchmark command / query / job sample | 生成样本报告,不写硬阈值 | 待 `06` 设阈值 | 部分 |
| TC-PROC-E2E-001 | Minimum process closure | P0 | local-dev / ci-test runtime | shape sync -> profile adoption -> instance start -> activity advance -> gate -> checkpoint -> recovery -> outbox -> projection -> report | 最小闭环成功,证据可索引 | 不验证 production capacity | 是 |
| TC-PROC-P1-001 | Real-like adapter smoke | P1 | integration-like profile | configured resolver / publisher / handoff dry-run | 接缝成功或明确 unavailable,不 fallback fake | no raw secret / no external body | 待定 |

### 7.2 测试用例闭环表

| 测试用例 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据 ID |
|---|---|---|---|---|
| TC-PROC-CONTRACT-001 | `03` §7 Protocol contracts | DTO / metadata / receipt / enum roundtrip | missing field / invalid enum | EV-CONTRACT-001 |
| TC-PROC-STATE-001~016 | `03` §9 State matrix | formal enum variant | illegal transition | EV-DOMAIN-001 |
| TC-PROC-CMD-001~013 | `03` §8 Command flow / §10 UoW / §12 Idempotency | result_ref、receipt、truth / trace / outbox | duplicate / conflict / rollback | EV-SERVICE-001 |
| TC-PROC-QUERY-001~011 | `03` §8 Query flow | ProcessQueryResponse、view status、marker | no-write violation | EV-SERVICE-002 |
| TC-PROC-EVENT-001~007 | `03` §7 Inbound event / §8 Consumer flow | ConsumerReceipt / disposition | digest mismatch / source unavailable | EV-WORKER-001 |
| TC-PROC-PUB-001 | `03` §6 Outbox / §7 Outbound event | OutboxPublicationState | publish retryable / permanent failure | EV-WORKER-002 |
| TC-PROC-JOB-001~007 | `03` §7 Job protocols / §8 Job flows | JobRunReceipt / partial report | invalid input / duplicate | EV-JOB-001 |
| TC-PROC-CONFIG-001~009 | `04` §5~§12 Config design | config profile、ref-only sensitive、fail-fast | raw secret / missing topic / no fake fallback | EV-INTEGRATION-002 |
| TC-PROC-SEC-001 | `00` / `01` / `03` §11 / §14 forbidden body boundary | external body 不得进入 snapshot、outbox、handoff、report | method / work / governance / artifact / runtime / conversation raw body | EV-SCRIPT-001 |
| TC-PROC-SCRIPT-001~003 | `03` §15 Script contracts | artifact / report path | missing artifact / redaction fail | EV-SCRIPT-003 |

---

## 8. 回填草稿

`05-测试方案.md` §6 应输出用例矩阵和闭环表。每个 P0 用例必须有前置条件、输入 / 操作、预期结果、断言点和自动化候选。断言点必须使用 `03` 的正式字段、状态、错误、event、job 和 receipt 名称。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP06-OPEN-001 | 每个用例最终落到哪个测试文件 | 留给 `07-实施计划.md` 和实现仓 test layout |
| TP06-OPEN-002 | `TC-PROC-NFR-001` 的硬阈值 | 待新版 `06` 或性能基线 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 用例可执行、可断言、可留证 | 通过 |
| 负向 / 边界 / 幂等 / 恢复均有用例 | 通过 |
| 未提前写后续 phase 状态 | 通过 |
