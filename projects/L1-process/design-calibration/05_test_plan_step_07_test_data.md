# Step 7. 设计测试数据

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 7 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节: `05-测试方案.md` §7 测试数据设计
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。测试数据设计只定义 fixture / builder / seed 口径,不新增对象字段或 DTO schema。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 6 用例矩阵 | 确定需要的数据集 | 数据集按 protocol、domain、state、transaction、config、script 分类 |
| `03` §6 / §7 | 字段与 schema 来源 | 数据构造必须使用正式 ref / metadata / state |
| `04` §6~§11 | 配置 profile 和 failure mode | config fixture 必须覆盖 local-dev、ci-test、integration-like、operations-replay 和非法配置 |

---

## 3. SOP 问题回答

1. 测试数据如何构造?

   回答:优先使用 contract fixture builder、domain object builder、fake repository seed、event fixture、job fixture、config fixture 和 artifact / report fixture。不得通过字符串拼接构造不闭合 DTO。

2. 测试数据如何隔离?

   回答:所有数据使用 `run_id`、operation namespace、idempotency key、event dedup key、job idempotency key、space / work / process ref 等隔离键。CI 使用 deterministic id / fixed clock。

3. 哪些数据可以复用?

   回答:只读 DTO fixture、valid config fixture、state matrix base fixture 可复用;会被 mutation 的 truth、idempotency、outbox、projection、report fixture 必须每用例隔离。

4. 如何清理数据?

   回答:in-memory / fake store 每用例重建;durable / real-like P1 使用 run-scoped namespace 并在 suite teardown 清理;失败时保留 artifacts。

5. 外部系统如何 mock / fake / stub?

   回答:P0 使用 deterministic fake resolver、fake publisher、fake handoff、fake clock、fake id generator 和 in-memory store;integration-like 使用 configured local / controlled adapter,不得 fake fallback production success。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 数据表只有粗略样本,无隔离和清理 | 新增 data set / isolation / cleanup |
| Step 6 | 用例覆盖广,需要明确 fixture 类型 | 本 Step 按用例组定义数据集 |
| `04` | 配置 profile / failure modes 多 | 本 Step 单列 config fixture |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 数据来源 | fixture / builder 粗略描述 | contract fixture、domain builder、fake repo seed、event / job / config / report fixture |
| 隔离 | 按 id 隔离 | run_id + namespace + idempotency / dedup key + store reset |
| 外部依赖 | event fixture | deterministic fake / controlled adapter 明确区分 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否定义真实生产数据 | 不定义。真实 production 数据和脱敏流程由运维 / P1 专项承接 |
| 是否允许随机 fixture | P0 禁止不可复现随机。可使用 seeded deterministic generator |
| 是否保存失败数据 | 失败 artifacts 必须保留,但经过 redaction scan |

---

## 7. 结构化中间产物

### 7.1 测试数据设计表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `contract_protocol_valid_set` | DTO roundtrip | contract fixture builder | DTO type + schema version | 无状态 | TC-PROC-CONTRACT-001 |
| `contract_protocol_invalid_set` | required field / enum negative | invalid DTO fixture | case id | 无状态 | TC-PROC-CONTRACT-002 |
| `domain_state_base_set` | 16 状态机 | domain builder per object | object ref + case id | 每用例重建 | TC-PROC-STATE-001~016 |
| `command_success_seed` | 13 Command success | fake repo seed + resolver fixture | operation namespace + idempotency key | fake store reset | TC-PROC-CMD-001~013 |
| `command_duplicate_seed` | duplicate replay / conflict | completed idempotency + stored operation result | operation namespace + canonical digest | fake store reset | TC-PROC-CMD-001~013 / TC-PROC-IDEMP-* |
| `query_view_seed` | Query hit / missing / degraded | projection / view fixture | query subject ref + visibility marker | fake store reset | TC-PROC-QUERY-001~011 |
| `inbound_event_seed` | 7 event consumer | inbound envelope fixture + resolver response | event dedup key + source event ref | fake store reset | TC-PROC-EVENT-001~007 |
| `outbox_publish_seed` | outbound publish | pending outbox records for 10 event kinds | outbox ref + publication batch id | fake store reset | TC-PROC-PUB-001 |
| `job_scope_seed` | 7 job runner | job DTO fixture + pending items | job idempotency key + job scope | fake store reset | TC-PROC-JOB-001~007 |
| `uow_failure_seed` | transaction / rollback | fake UoW failure injection | failure point id | fake store reset | TC-PROC-TX-001 |
| `recovery_failure_seed` | result missing / commit unknown | idempotency + missing result / commit unknown flag | idempotency key + result ref | fake store reset | TC-PROC-RECOVERY-* |
| `config_valid_profiles` | profile validation | JSON fixture + env override fixture | config profile + run_id | temp dir cleanup | TC-PROC-CONFIG-001~002 |
| `config_invalid_set` | invalid config | invalid JSON / duplicate key / bad duration / missing ref / topic missing | config file name + case id | temp dir cleanup | TC-PROC-CONFIG-003~007 |
| `adapter_failure_seed` | resolver / publisher / handoff failure | fake adapter scripted responses | adapter kind + case id | fake reset | TC-PROC-CONFIG-008 / TC-PROC-RECOVERY-003~004 |
| `observability_sample_set` | logs / metrics / audit scan | run command / worker / job sample | run_id | artifacts retained on failure | TC-PROC-OBS-* |
| `script_artifact_set` | gate / report / redaction script | minimal artifacts and reports fixture | run_id | retained on failure | TC-PROC-SCRIPT-* |
| `e2e_minimum_closure_seed` | minimum process closure | combined shape / profile / instance / event / job fixture | run_id + process instance ref | run-scoped cleanup | TC-PROC-E2E-001 |

### 7.2 数据隔离规则

| 规则 | 说明 |
|---|---|
| `run_id` 必填 | 所有 artifacts、reports、temporary stores 和 config digest 均绑定固定 run id |
| operation namespace 必填 | Command / Event / Job 不共享 duplicate key space |
| deterministic clock | CI 使用 fixed clock,避免时间漂移导致 digest 不稳定 |
| no raw body fixture | method / work / governance / artifact / runtime / conversation 正文不得进入 fixture |
| failure artifacts retained | 失败时保留 redacted artifact 和 failure report |
| fake marker required | fake resolver / publisher / handoff 成功必须输出 fake marker,不得伪装 configured success |

---

## 8. 回填草稿

`05-测试方案.md` §7 应输出测试数据表和隔离规则,说明 P0 使用 deterministic fixture、fake / in-memory store、fixed clock 和 run-scoped artifacts。外部正文、raw secret 和 production credential material 不得进入测试数据。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP07-OPEN-001 | durable / real-like 数据清理机制 | P1 环境后续由 Step 8 / 实施计划定义 |
| TP07-OPEN-002 | 具体 fixture 文件路径 | 留给实现仓 test layout 和 `07` |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 用例均有数据集 | 通过 |
| 数据隔离和清理策略明确 | 通过 |
| 外部依赖 fake / configured 区分明确 | 通过 |

