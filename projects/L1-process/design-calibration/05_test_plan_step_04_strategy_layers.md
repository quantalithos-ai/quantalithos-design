# Step 4. 制定测试策略与分层

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 4 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节: `05-测试方案.md` §4 测试策略与分层
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。测试分层目标是让领域规则、协议漂移、事务错误、外部接缝失败和证据缺失在合适层级被发现,避免所有风险堆到 E2E。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 3 测试对象与切口 | 决定每类风险发现位置 | 分为 contract、domain、service、integration、API / worker / job、script、E2E / release gate |
| `03-详细设计.md` §3~§15 | 模块边界、函数流、状态矩阵和脚本契约 | 每层测试必须回指具体设计契约 |
| `04-配置设计.md` §3~§12 | config loader、runtime builder、adapter binding | config test 归属 integration / script / gate |

---

## 3. SOP 问题回答

1. 哪些问题必须在 unit 层发现?

   回答:DTO required field、enum variant、operation digest、value object validation、domain object invariant、policy accept / reject、state matrix legal / illegal transition 必须在 contract / domain unit 层发现。

2. 哪些问题必须在 service 层验证编排?

   回答:command validate -> reserve -> load -> domain -> save truth / trace / outbox / result -> complete idempotency -> commit 顺序,query no-write,consumer dedup / marker,job per-item transaction、duplicate receipt 和 error mapping 必须在 service 层验证。

3. 哪些问题必须依赖 DB / adapter / worker 集成测试?

   回答:repository optimistic version、UoW rollback、operation result store、projection store、idempotency store、source resolver / publisher / handoff failure injection、runtime builder 装配和 worker event intake 必须用 fake / in-memory integration 测试。

4. 哪些问题需要 API / contract test?

   回答:Command / Query handler required fields、metadata validation、actor context、public error mapping、inbound / outbound event JSON roundtrip、job DTO roundtrip 和 protocol compatibility 必须进入 API / contract tests。

5. 哪些场景才需要 E2E 或 release gate?

   回答:E2E / release gate 只覆盖最小主链和跨入口证据闭环,例如 shape sync -> profile adoption -> instance start -> activity advance -> waiting gate -> checkpoint -> recovery -> outbox -> projection -> report evidence。它不替代 unit / service / integration 层的细节断言。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 分层较粗,把 event chain、recovery、projection 混入大类 | 新分层按风险发现位置拆分 |
| Step 3 切口 | 切口多,需要防止全部压到 E2E | 本 Step 给每类切口推荐层级和失败处理 |
| `04` 配置 | 配置测试可能散落在 integration / script | 本 Step 明确 config loader / validator / runtime builder / redaction 的层级 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 单元层 | 泛称 domain rules | contracts、domain、policy、state matrix 明确拆分 |
| 集成层 | service + repo 粗略描述 | service orchestration、repository / UoW、adapter fake、worker / job 分开 |
| E2E | 主线完整跑通 | 只覆盖最小闭环和证据链,不承载全部细节 |
| script 测试 | 未成体系 | gate / report / redaction script 单列 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| unit 与 service 的边界 | 对象不变量和状态迁移放 unit;跨 repository / outbox / operation result 顺序放 service |
| integration 与 E2E 的边界 | fake / in-memory integration 验证端口语义;E2E 只做最小业务和证据闭环 |
| worker / job 是否算 API 层 | 单列为 entry contract 层,因为它们有独立 metadata、receipt 和 failure surface |
| script 是否进入测试层级 | 是。证据路径和 redaction 是验收前置能力 |

---

## 7. 结构化中间产物

### 7.1 测试分层图

#### 测试分层图: L1-process 测试金字塔

```text
[Contract unit]
  - DTO / metadata / enum / digest / protocol roundtrip
        |
        v
[Domain unit]
  - object invariant / policy / state matrix
        |
        v
[Service tests]
  - command / query / consumer / job orchestration with fake ports
        |
        v
[Integration tests]
  - repository / UoW / idempotency / projection / adapter / runtime builder
        |
        v
[API / Worker / Job contract tests]
  - handler / event intake / outbox publisher / job runner public surface
        |
        v
[Script and evidence tests]
  - gate / report / redaction checker outputs
        |
        v
[E2E / Release gate]
  - minimum process closure and acceptance evidence handoff
```

关键说明:

- 领域规则、状态机和 DTO 漂移必须在低层先失败。
- service / integration 层验证事务、幂等、外部接缝和配置装配。
- E2E 只验证最小闭环和证据交接,不承担字段级 exhaustive 断言。

### 7.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Contract unit | 验证 public protocol 稳定 | Command / Query / Event / Job DTO roundtrip、metadata、digest、required fields | PR | 阻断 |
| Domain unit | 验证对象不变量和状态矩阵 | object constructor、policy、16 状态机 legal / illegal transition | PR | 阻断 |
| Service tests | 验证应用编排和事务顺序 | Command / Query / Consumer / Job flow、duplicate replay、operation result、error mapping | PR / CI | 阻断 |
| Integration tests | 验证 store / adapter / runtime builder 语义 | repository fake、UoW rollback、idempotency store、projection store、source resolver、publisher、handoff、config loader | CI | 阻断 |
| API / Worker / Job contract tests | 验证入口协议和 receipt surface | handler validation、event intake、outbox publisher、job runner partial failure | CI | 阻断 |
| Script and evidence tests | 验证门禁和证据生成 | `run_ci_gate.sh`、`generate_reports.sh`、`check_redaction.sh` | CI / release candidate | 阻断 P0 |
| E2E / Release gate | 验证最小业务闭环和验收交接 | shape -> profile -> instance -> activity -> gate -> checkpoint -> recovery -> outbox -> projection -> report | staging / release | 阻断发布 |

### 7.3 切口到层级映射

| 切口 | 主发现层 | 辅助层 |
|---|---|---|
| DTO / required field / enum variant 漂移 | Contract unit | API / Worker / Job contract |
| domain invariant / illegal transition | Domain unit | Service tests |
| command duplicate replay / result missing | Service tests | Integration tests |
| query no-write | Service tests | API contract |
| repository version conflict / rollback | Integration tests | Service tests |
| inbound quarantine / delayed | API / Worker contract | Service tests |
| outbound publish retry / permanent failure | API / Worker contract | Integration tests |
| operations job partial failure | API / Worker / Job contract | Integration tests |
| config validation / runtime builder | Integration tests | Script and evidence tests |
| redaction / forbidden body | Script and evidence tests | Service / worker / job |
| minimum process closure | E2E / Release gate | All lower layers |

---

## 8. 回填草稿

`05-测试方案.md` §4 应输出测试分层图和分层表,说明 `L1-process` 的高风险问题分别由 contract unit、domain unit、service、integration、API / worker / job contract、script evidence 和 E2E / release gate 发现。E2E 不替代 lower-layer 测试。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP04-OPEN-001 | release gate 是否要求 real-like broker / durable DB | 当前 release gate 只定义最小闭环;真实依赖级别进入 Step 8 / Step 14 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 测试分层覆盖 Step 3 P0 切口 | 通过 |
| 每层失败处理明确 | 通过 |
| E2E 不承担全部风险 | 通过 |

