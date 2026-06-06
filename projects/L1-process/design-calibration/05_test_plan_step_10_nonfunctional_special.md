# Step 10. 设计专项测试与非功能验证

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 10 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。非功能测试不继承旧版硬编码 P95 阈值;当前只定义方法、环境、通过条件和证据,量化阈值等待新版 `06` 或性能基线。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 6 用例矩阵 | 提供专项用例 | safety、recovery、performance sample、redaction、observability |
| `03` §14 | 观测和审计字段 | logs / metrics / audit / trace 安全字段测试 |
| `03` §15 | forbidden body、script contract | redaction checker 是 P0 |
| `04` §8 / §11 | sensitive config 与 failure modes | raw secret、configured adapter failure 和 config drift 进入专项 |

---

## 3. SOP 问题回答

1. 性能如何验证?

   回答:以 benchmark / load sample 方式收集 command、query、job、projection rebuild 和 report generation 样本,仅作为趋势和回归证据;正式阈值待 `06` 或性能基线。

2. 安全如何验证?

   回答:通过 raw secret config negative、forbidden body fixture、logs / artifacts / reports redaction scan、non-core Cargo dependency scan 和 low-cardinality metric check 验证。

3. 一致性如何验证?

   回答:通过 UoW failure injection、version conflict、outbox save failure、operation result missing、idempotency complete failure、projection race 和 job partial failure 验证。

4. 可恢复性如何验证?

   回答:通过 commit unknown retry、source unavailable、consumer delayed、publisher / handoff retryable / permanent failure、operations-replay、reconciliation no auto repair 验证。

5. 可观测性和审计如何验证?

   回答:检查 structured logs、metrics label、trace span、audit event 和 reports 只包含允许字段,且失败路径能定位 result ref、report ref 或 marker ref。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 写有旧 P95 阈值,无新版来源 | 删除硬阈值,改为样本 / 待 `06` |
| `03` §14 | 观测字段有设计,缺专项测试组织 | 本 Step 加入 logs / metrics / audit / trace 专项 |
| `04` §8 / §11 | 配置安全场景多 | 本 Step 合入安全 / redaction 专项 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 性能 | 固定 P95 阈值 | benchmark sample + 待 `06` 阈值 |
| 安全 | timing signal 不写真相 | raw secret、forbidden body、dependency discipline、redaction scan |
| 可恢复 | suspend / resume | commit unknown、rollback failure、partial failure、replay、handoff |
| 观测 | 日志存在 | low-cardinality、refs-only audit、no forbidden body |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否写性能放行阈值 | 不写。没有新版正式来源时只写采样和证据 |
| redaction 是否只扫报告 | 否。必须覆盖 artifacts 和 reports |
| reconciliation 是否可自动修复 | 否。专项测试断言 no auto repair |

---

## 7. 结构化中间产物

### 7.1 专项测试表

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 性能样本 | command / query / job / report latency 趋势 | benchmark / load sample | ci-test / integration-like | 生成样本报告;硬阈值待 `06` | EV-INTEGRATION-003 |
| 并发一致性 | version conflict、single winner、projection cursor regression | fake concurrent runner | ci-test | 无 silent overwrite;older cursor 不覆盖 newer | EV-INTEGRATION-001 |
| 幂等重放 | duplicate replay、conflict、result missing | idempotency fake + operation result store | ci-test | duplicate 不重放 domain / adapter;missing 不重算 | EV-SERVICE-004 |
| 事务回滚 | result save / complete / outbox save / rollback failure | fake UoW failure injection | ci-test | 无 partial committed truth;rollback failure 可定位 | EV-SERVICE-003 |
| 恢复 / 重跑 | commit unknown、operations-replay、partial failure | replay suite | operations-replay | 不产生第二 truth;成功项保留;失败项报告 | EV-JOB-001 |
| 外部依赖失败 | resolver / publisher / handoff unavailable | fake / configured adapter failure injection | ci-test / integration-like | delayed / retry / failed / partial surface 正确 | EV-INTEGRATION-002 |
| 安全 redaction | raw secret、raw body、archive package body 泄露 | config negative + redaction checker | ci-test | checker 非 0 且报告命中;正常样本无泄露 | EV-SCRIPT-001 |
| 依赖纪律 | 非 core sibling path dependency | dependency scan | ci-test | 发现即 fail | EV-SCRIPT-002 |
| 可观测性 | low-cardinality metrics and refs-only audit | log / metric / audit scan | ci-test | 无 high-cardinality metric label;审计无正文 | EV-SCRIPT-002 |
| 报告证据 | report generation and evidence index | script contract test | ci-test / release gate | 固定 run_id 可追溯;失败也有 report | EV-SCRIPT-003 |

### 7.2 一票否决专项候选

| 项 | 失败含义 |
|---|---|
| forbidden body or raw secret appears in artifact / report | 安全红线失败 |
| Query writes truth / projection / audit / outbox | 读写边界失败 |
| Duplicate replay re-executes domain transition | 幂等红线失败 |
| Operation result missing is recomputed from current truth | 证据 / 幂等红线失败 |
| Configured adapter falls back to fake success | 配置与验收证据污染 |
| Outbox publish failure rolls back committed truth | 一致性红线失败 |
| Reconciliation job repairs truth | 运行维护越权 |

---

## 8. 回填草稿

`05-测试方案.md` §10 应输出专项测试表和一票否决专项候选。性能专项只写采样方法和报告证据,不得继承旧版硬阈值。安全、redaction、no-write、幂等和配置红线必须作为 P0。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP10-OPEN-001 | 性能阈值 | 待新版 `06` 或性能基线 |
| TP10-OPEN-002 | redaction checker 具体扫描模式 | `03` 已固定失败语义,扫描规则由实现阶段补 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 专项测试覆盖性能、安全、一致性、恢复、观测 | 通过 |
| 无未来源硬阈值 | 通过 |
| 一票否决候选已识别 | 通过 |

