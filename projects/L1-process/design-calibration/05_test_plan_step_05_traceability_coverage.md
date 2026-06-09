# Step 5. 建立需求追溯与覆盖矩阵

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 5 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。覆盖矩阵使用 `REQ-PROC-*` / `BR-PROC-*` / `NFR-PROC-*` 作为测试方案内部追溯标签,不替代 `00-需求文档.md` 的正式需求表述;验收引用暂写为“待 `06` 回填”。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1 输入边界 | 确定追溯来源 | 覆盖矩阵必须能反查 `00/01/02/03/04` |
| Step 2 范围 | 确定 P0/P1/P2 | P0 不允许空覆盖 |
| Step 3 测试对象 | 确定测试场景 | 每个 P0 切口至少有一个场景和证据 |
| Step 4 分层 | 确定自动化候选 | P0 以自动化为默认,人工只做审查 |
| `03-详细设计.md` §15 | 最小验证清单 | 覆盖 7 模块、13 Command、11 Query、7 inbound event、10 outbound event、7 job、16 状态机 |

---

## 3. SOP 问题回答

1. 每个 P0 需求对应哪些设计章节?

   回答:Process truth、protocol、state、transaction、idempotency、error recovery、config、observability 和 evidence 均能回指 `03` §5~§15 与 `04` §6~§12。

2. 每个 P0 需求至少有哪些测试场景?

   回答:每个 P0 需求至少绑定一个 `TC-PROC-*` 场景,覆盖正向、负向、duplicate / conflict、no-write、failure injection、redaction 或 report evidence。

3. 哪些场景必须自动化?

   回答:P0 场景默认自动化。字段 / DTO / 状态 / 事务 / 幂等 / 配置 / redaction / script gate 必须自动化;人工审查只用于报告解释、残余风险接受和后续 `06` 验收裁决。

4. 每个场景的证据如何编号?

   回答:采用 `EV-CONTRACT-*`、`EV-DOMAIN-*`、`EV-SERVICE-*`、`EV-INTEGRATION-*`、`EV-WORKER-*`、`EV-JOB-*`、`EV-SCRIPT-*`、`EV-E2E-*` 编号,保存到 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`。

5. 哪些需求暂未覆盖,原因是什么?

   回答:production-like real adapter、remote config 和 full production runbook 暂未 P0 覆盖,原因是当前设计将其列为 P1/P2 或待 `06/07` / 运维手册收口。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 无稳定需求 / 设计 / TC / EV 追溯链 | 新建覆盖矩阵 |
| 新版 `06` | 尚未重建,无正式 AC 编号 | 证据 ID 先稳定,AC 后续回填 |
| `03` §15 | 给出最小验证入口,未绑定证据 ID | 本 Step 加入用例和证据映射 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 用例追溯 | 场景直接罗列 | 需求 / 规则 -> 设计依据 -> 用例 -> 证据 |
| 证据编号 | 无稳定编号 | `EV-*` 分层编号 |
| 未覆盖项 | 未系统表达 | P1/P2 和待确认明确进入风险 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否发明正式需求编号 | 不发明。`REQ-PROC-*` 是 05 内部追溯标签,不替代 `00` |
| 是否发明 AC 编号 | 不发明。等待 `06-验收标准.md` 重建 |
| P0 自动化 | 默认自动化,人工只做报告审查和风险接受 |
| 覆盖粒度 | 按设计风险主线聚合,不把 13+11+7+10+7 全部在本 Step 展开为单行;Step 6 展开用例矩阵 |

---

## 7. 结构化中间产物

### 7.1 需求追溯与覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| REQ-PROC-TRUTH-001 Process truth center | `03` §5 / §6 / §8 / §10 | 核心 truth command 写入、trace / outbox / result 同事务提交 | TC-PROC-CMD-001~013 | 是 | EV-SERVICE-001 | 已覆盖 |
| REQ-PROC-PROTOCOL-001 Public protocol stable | `03` §7 | Command / Query / Event / Job DTO roundtrip 与 required field | TC-PROC-CONTRACT-001 | 是 | EV-CONTRACT-001 | 已覆盖 |
| REQ-PROC-QUERY-001 Query no-write | `03` §7 / §8 / §10 | 11 Query hit / missing / degraded / no-write | TC-PROC-QUERY-001~011 | 是 | EV-SERVICE-002 | 已覆盖 |
| REQ-PROC-CONSUMER-001 Inbound event safe intake | `03` §7 / §8 / §11 / §12 | accepted、duplicate、quarantine、delayed、noop | TC-PROC-EVENT-001~007 | 是 | EV-WORKER-001 | 已覆盖 |
| REQ-PROC-OUTBOX-001 Outbound event publication | `03` §6 / §7 / §8 / §10 | truth change -> outbox -> payload -> publish marker | TC-PROC-PUB-001 | 是 | EV-WORKER-002 | 已覆盖 |
| REQ-PROC-JOB-001 Operations job safety | `03` §7 / §8 / §11 / §12 | 7 job validation、duplicate receipt、partial failure、no auto repair | TC-PROC-JOB-001~007 | 是 | EV-JOB-001 | 已覆盖 |
| BR-PROC-STATE-001 Formal state transitions | `03` §9 | 16 状态机 legal / illegal transition | TC-PROC-STATE-001~016 | 是 | EV-DOMAIN-001 | 已覆盖 |
| BR-PROC-TX-001 Transaction consistency | `03` §10 | save truth / trace / outbox / result / idempotency 顺序与 rollback | TC-PROC-TX-001 | 是 | EV-SERVICE-003 | 已覆盖 |
| BR-PROC-IDEMP-001 Duplicate replay | `03` §10 / §12 | same key same digest replay stored result;different digest conflict | TC-PROC-IDEMP-001~003 | 是 | EV-SERVICE-004 | 已覆盖 |
| BR-PROC-RECOVERY-001 Error recovery | `03` §11 | result missing、commit unknown、source unavailable、rollback failure | TC-PROC-RECOVERY-001~004 | 是 | EV-INTEGRATION-001 | 已覆盖 |
| BR-PROC-BOUNDARY-001 No external body persistence | `00` / `01` / `03` §11 / §14 | method / work / governance / artifact / runtime / conversation body rejected | TC-PROC-SEC-001 | 是 | EV-SCRIPT-001 | 已覆盖 |
| BR-PROC-CONFIG-001 Config fail-fast and no fake fallback | `04` §5~§12 | invalid JSON、duplicate key、bad duration、topic missing、configured adapter unavailable | TC-PROC-CONFIG-001~009 | 是 | EV-INTEGRATION-002 | 已覆盖 |
| NFR-PROC-OBS-001 Observability and audit safe | `03` §14 / §15 | low cardinality metrics、refs-only audit、redaction scan | TC-PROC-OBS-001~002 | 是 | EV-SCRIPT-002 | 已覆盖 |
| NFR-PROC-EVID-001 Evidence and reports | `03` §15 / `04` §12 | gate artifacts、reports、evidence index、redaction-check | TC-PROC-SCRIPT-001~003 | 是 | EV-SCRIPT-003 | 已覆盖 |
| NFR-PROC-PERF-001 Performance sample | `00` 非功能方向 / `05` Step 10 / `06` §9 | benchmark / sample;`06` §9 以样本报告和“无明显主链阻塞”作为正式 P0 门禁,不继承旧版硬阈值 | TC-PROC-NFR-001 | 是 | EV-INTEGRATION-003 | 已由 `06` §9 固定为性能样本门禁 |
| REQ-PROC-P1-001 Production-like real adapter | `04` §6 / §14 | real-like adapter smoke / dry-run | TC-PROC-P1-001 | 待定 | EV-E2E-002 | P1 风险 |

### 7.2 未覆盖项清单

| 未覆盖项 | 原因 | 处理 |
|---|---|---|
| production-like full DB / broker / secret provider | 当前 `04` 将 production-like 列为 P1/P2 | Step 14 残余风险,由 `07` / 运维手册安排 |
| remote config / admin override | 当前不进入 P0 配置项 | Step 14 残余风险 |
| 正式 AC 编号 | `06-验收标准.md` 未新版同步 | Step 13 保留验收引用占位,后续 `06` 消费 |

---

## 8. 回填草稿

`05-测试方案.md` §5 应输出覆盖矩阵,把测试方案内部需求 / 规则标签、设计依据、用例 ID、自动化候选、证据 ID 和覆盖状态连起来。P0 不得出现无用例或无证据的空洞;P1/P2 和待 `06` 回填项必须明示。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP05-OPEN-001 | 正式 AC 编号 | 待 `06-验收标准.md` 重建后引用 |
| TP05-OPEN-002 | P1 real-like adapter 是否 release gate 必跑 | Step 14 标风险,Step 8 先定义环境 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 覆盖矩阵无空洞 | 通过 |
| 未覆盖项进入风险 | 通过 |
| 证据 ID 有分层口径 | 通过 |
