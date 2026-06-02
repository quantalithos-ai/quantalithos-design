# L1-conversation 05 测试方案 Step 10: 设计专项测试与非功能验证

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §10 专项测试与非功能验证
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 设计专项测试与非功能验证 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_10_special_nonfunctional.md` |

本步定义性能、安全、一致性、恢复、观测和审计专项。缺陷分级、复验规则、进入 / 退出准则、证据编号和正式报告归档分别留给 Step 11~Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | `NFR-CONV-001~012`、非功能验收和一票否决项 | 作为专项风险和通过条件来源 |
| `05_test_plan_step_05_traceability_matrix.md` | NFR 覆盖矩阵、P0/P1 挂起项 | 作为专项优先级来源 |
| `05_test_plan_step_06_cases.md` | P0 用例和负向场景 | 作为专项测试入口 |
| `05_test_plan_step_08_environment_config.md` | `ci-test`、`integration-like`、`operations-replay` 环境 | 作为专项执行环境来源 |
| `05_test_plan_step_09_automation_ci_gates.md` | PR / main CI / nightly / release gate suite | 作为专项进入门禁的位置 |
| `03_ddd_step_12_error_recovery.md` | 错误分类、retry / reject / manual 口径 | 作为恢复专项来源 |
| `03_ddd_step_13_concurrency_idempotency.md` | 并发、幂等、重入保护 | 作为一致性专项来源 |
| `03_ddd_step_15_observability_audit.md` | 日志、指标、审计事件和字段边界 | 作为观测和审计专项来源 |
| `04_config_step_11_failure_modes.md` | fail-fast、fail-closed、degraded marker 和配置红线 | 作为配置 / 安全专项来源 |

## 3. SOP 问题回答

### 3.1 哪些性能指标必须验证?

本轮不编造吞吐、p95 latency 或容量数字。必须验证的是需求已经明确的性能判断口径:

- 核心追加、授权读取和追溯在长历史或相邻仓正文不可解析时仍能成立。
- projection、search、cursor、report 等外围增强不可用时,核心 space、fact append、authorized query 和 trace / handoff 判断仍能成立。
- operations job、projection rebuild、cursor maintenance 和 consistency validation 可以通过 bounded batch、timeout 和 run-scoped report 暴露完成或失败。

量化阈值缺口来自 `00-需求文档.md` §15.2 的待确认事项,本步只定义基线和趋势验证,不把未确认数字写成验收阈值。

### 3.2 哪些安全和边界红线必须负向测试?

必须负向测试授权视野失效、相邻仓正文进入 truth、runtime reasoning body / bridge platform body / artifact body 被保存、raw secret 或 raw token 出现在配置 / artifact / report、fake adapter 标记 production success、source truth 被补造、query / projection / report 反写真相、`security.redaction_policy` 非 strict 和 path shape 违规。

这些红线均属于 P0-blocking 或一票否决,必须进入 main CI 或 release gate。

### 3.3 哪些一致性和恢复场景必须故障注入?

必须故障注入 transaction rollback、idempotency duplicate / conflict、same key different digest、consumer duplicate / quarantine、outbox publish failure、publish success 后状态写失败、resolver unresolved、digest mismatch、projection rebuild failure、cursor sequence gap、trace / archive handoff failure 和 consistency validation no auto repair。

故障注入必须使用 deterministic fake、in-memory failure injection、controlled adapter 或 operations-replay,不得依赖真实网络抖动。

### 3.4 哪些日志、指标和审计证据必须存在?

必须验证 command、query、consumer、outbox publish、resolver、projection、handoff、job、repository / UnitOfWork 和 boundary / redaction 的日志、指标和审计材料。观测材料必须包含 stable refs、operation、state、error code、duration、audit / evidence ref,且不得包含 forbidden body、secret、raw payload、外部 source body 或高基数 record id 标签。

### 3.5 阈值来自哪里?

阈值分三类:

| 阈值类型 | 来源 | 本步处理 |
|---|---|---|
| 行为阈值 | `00` §14 一票否决、`03` 状态 / 错误 / 幂等、`04` 失效模式 | 作为 P0 pass / fail 条件 |
| 配置阈值 | `04` 配置项、batch、retry、timeout、redaction、path shape | 按配置设计验证,不在 05 重新定义字段 |
| 量化性能阈值 | 当前需求未锁定 | 不编造数字;只做 baseline / trend / no-regression evidence |

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿把性能、集成和恢复混写,缺少 NFR 来源和红线验证 | 不继承旧专项 |
| `00` §13 | NFR 有判断口径但没有具体测试方法 | 本步转成专项矩阵 |
| `00` §15 | 明确量化指标未定 | 本步不写虚假 p95 / TPS 数字 |
| Step 6 | 已有 P0 用例,但专项维度还未聚合 | 本步按性能、安全、恢复、观测聚合 |
| `03` Step 12 / 13 / 15 | 错误、幂等和观测契约很完整 | 本步承接为专项测试,不新增对象 / 字段 |
| `04` Step 11 | 失效模式已定义 | 本步把配置红线纳入非功能专项 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 性能专项 | 容易写成无来源数字 | 只验证核心路径不被历史规模 / 外围增强阻断 |
| 安全专项 | 分散在用例和配置 | 集中为授权、正文、secret、redaction、fake-as-production 红线 |
| 恢复专项 | 散落在错误和 job 用例 | 故障注入矩阵明确环境和通过条件 |
| 可观测性 | 只说要有日志 / 指标 | 明确哪些 operation、字段和禁止字段必须被验证 |
| 阈值来源 | 不清楚 | 分为行为阈值、配置阈值和未确认量化阈值 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 性能是否写具体 p95 / TPS | 直接给默认数字 | 等需求或验收确认数字后再写,当前做 baseline / no-regression | B | `00` 已明确量化目标待确认 |
| 安全测试是否只靠 redaction 脚本 | 只跑脚本 | 用用例拒绝 + redaction check + report 检查三层验证 | B | forbidden body 不能先进入 truth 再靠报告发现 |
| 恢复测试是否依赖真实故障 | 依赖真实网络和 broker | deterministic fake / controlled adapter 故障注入 | B | 可重复、可复核 |
| 观测验证是否要求 dashboard | 要求 dashboard / alert | 只验证日志、指标、审计材料和 report 可生成 | B | dashboard / runbook 属于运维后续 |
| P1 staging 是否阻断 P0 | staging-like 必过 | staging smoke 只阻断 P1 readiness | B | 当前 P0 不依赖生产 endpoint |

## 7. 结构化中间产物

### 7.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据 |
|---|---|---|---|---|---|
| 核心追加 baseline | append fact、trace、outbox 同事务在历史规模增长下仍成立 | 使用长历史 fixture 执行 `TC-CONV-FACT-001`、`TC-CONV-TX-001` | `ci-test`; nightly trend | 不因历史 fixture 或外部正文不可解析而无法 append;无未确认数字 | test result; failure summary |
| 授权读取 baseline | authorized read / query no-write / stale marker | 执行 `TC-CONV-QUERY-001~004` 和 long history read fixture | `ci-test`; nightly trend | 只返回 authorized view;query 不写 truth;stale / failed marker 可见 | query test result; report |
| 外围增强降级 | projection / search / cursor failure 不阻断核心 truth | 注入 rebuild failure、search failure、cursor gap | `ci-test`; `operations-replay` | 核心 space / fact / authorized query 仍成立;派生状态为 `Stale` / `Failed` | job result; failed marker |
| 授权红线 | 未授权消费、sealed visibility 扩张 | 负向执行 `TC-CONV-SCOPE-002`、`TC-CONV-QUERY-002` | `ci-test`; release gate | unauthorized 不返回 hidden fact;sealed 不被 query 或 projection 打开 | veto evidence; redaction report |
| 数据归属红线 | 相邻仓正文、runtime reasoning body、bridge platform body、artifact body 泄露 | forbidden body sentinel + consumer / command negative | `ci-test`; release gate | forbidden body 不进 truth、log、event、audit、report | redaction-check; boundary violation result |
| secret / config 红线 | raw secret、non-strict redaction、fake-as-production | config negative + report / check script | `ci-test`; release gate | fail-fast 或一票否决;不得 silent fallback | config failure summary; redaction-check |
| source truth isolation | resolver unresolved、digest mismatch、不补造来源 truth | fake resolver 返回 unresolved / mismatch | `integration-like`; `operations-replay` | 只写 unresolved / mismatch marker;不生成 source body | resolver evidence; job report |
| transaction rollback | outbox enqueue / repository failure | in-memory failure injection | `ci-test` | truth、trace、receipt、outbox、idempotency complete 同事务回滚 | service test result |
| 幂等与重入 | duplicate command / event / job、same key conflict | fixed `IdempotencyKey`、event id、job run id 重放 | `ci-test`; `operations-replay` | same key same digest 返回 existing;different digest conflict;duplicate event skip | idempotency result; conflict summary |
| outbox recovery | publish failure、publish success 后状态写失败、rerun | fake publisher success / failure / state write failure once | `ci-test`; nightly | truth 不回滚;outbox `RetryPending` / `Failed` / `Published`;不重复 publish | outbox job result |
| handoff recovery | trace / archive handoff retry / failed | fake handoff transient / permanent failure | `ci-test`; `operations-replay` | handoff 进入 retry / failed;fact / trace truth 不变 | handoff job result |
| consistency diagnostic | consistency validation 不自动修写真相 | 构造 read model 缺失和 projection drift | `operations-replay` | 输出 issue / report ref;不自动 repair truth | consistency report |
| observability fields | 日志、指标、审计字段存在且安全 | 检查 generated artifacts / reports / redaction output | `ci-test`; release gate | stable refs、operation、status、error_code 存在;禁止字段不存在 | log / metric / audit check |
| report path / evidence shape | artifacts / reports 层级错误 | path shape negative + report generation | release gate | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`;无 `<project>` / `latest` | path check; report output |

### 7.2 非功能专项覆盖表

| NFR | 专项覆盖 | 阻断级别 |
|---|---|---|
| `NFR-CONV-001` | 核心追加 baseline;授权读取 baseline | P0-blocking baseline,量化数字待后续 |
| `NFR-CONV-002` | 外围增强降级;consistency diagnostic | P0-blocking negative |
| `NFR-CONV-003` | outbox recovery;handoff recovery | P0-blocking |
| `NFR-CONV-004` | source truth isolation | P0-blocking |
| `NFR-CONV-005` | 授权红线 | P0-blocking / 一票否决 |
| `NFR-CONV-006` | 数据归属红线;secret / config 红线 | P0-blocking / 一票否决 |
| `NFR-CONV-007` | observability fields;核心追加 audit | P0-blocking |
| `NFR-CONV-008` | source truth isolation;consistency diagnostic | P0-blocking |
| `NFR-CONV-009` | 幂等与重入 | P0-blocking |
| `NFR-CONV-010` | 外围增强降级;consistency diagnostic | P0-blocking negative |
| `NFR-CONV-011` | observability fields;report path / evidence shape | P0-blocking |
| `NFR-CONV-012` | secret / config 红线;dependency degraded;boundary violation | P0-blocking / 一票否决 |

### 7.3 阈值来源表

| 通过条件 | 来源 | 是否量化 | 处理口径 |
|---|---|---|---|
| 核心闭环任一必要节点缺失即失败 | `00` §14.2 | 否 | 一票否决 |
| 授权视野失效即失败 | `00` §14.2; `03` query / visibility contract | 否 | 一票否决 |
| forbidden body / secret 进入 truth、log、event、report 即失败 | `00` §13; `03` Step 15; `04` Step 11 | 否 | 一票否决 |
| duplicate command / event / job 不得形成冲突 truth | `03` Step 13 | 否 | P0-blocking |
| publish / handoff failure 不得回滚 truth | `03` Step 12; Step 13 | 否 | P0-blocking |
| reports / artifacts 路径固定 | `03` §15.4; `04` reports config; Step 9 | 否 | P0-blocking |
| batch、retry、timeout、redaction、path 可配置范围 | `04` 配置项和失效模式 | 部分量化 | 由 `04` 提供,05 不重定义 |
| p95 / TPS / storage capacity | `00` §15.2 标记待确认 | 否 | 不写验收阈值,仅记录 baseline / trend |

### 7.4 专项测试执行位置表

| 专项族 | PR | main CI | nightly | release gate |
|---|---|---|---|---|
| 核心追加 / 授权读取 baseline | smoke | full | trend | smoke |
| 授权 / 数据归属 / redaction 红线 | smoke | full | optional replay | full |
| transaction / idempotency / concurrency | smoke | full | replay subset | smoke |
| resolver / source truth isolation | no | controlled subset | full | redline subset |
| outbox / handoff recovery | no | fake failure matrix | replay full | redline subset |
| projection / cursor / consistency | no | core negative | operations-replay full | report package |
| observability / audit fields | smoke | full | report trend | full |
| path / report / acceptance extract | no | report generation | report generation | full |

### 7.5 观测材料检查表

| 材料类型 | 必须检查 | 禁止内容 |
|---|---|---|
| 日志 | `trace_ref`、`request_id`、`operation`、`status`、`error_code`、`duration_ms` | payload body、runtime reasoning body、bridge body、artifact body、secret |
| 指标 | operation、result、error_category、source_kind、projection_kind、job_kind | record id、payload digest 全量、actor profile、free text |
| 审计 / evidence | audit / evidence ref、actor ref、subject ref、from / to state、reason code | raw source body、archive package body、credential |
| Diagnostic | safe summary、supporting refs、stable error code | debug dump、HTTP body、private profile |
| Reports | run id、profile、suite、failure category、redaction-check | `<project>` 层级、`latest`、raw secret、forbidden body |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §10 时摘录。

```markdown
## 10. 专项测试与非功能验证

> 校准来源：
> - `design-calibration/05_test_plan_step_10_special_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“专项测试矩阵”“非功能专项覆盖表”“阈值来源表”和“观测材料检查表”小节，了解 P0 非功能、红线、一致性恢复和可观测性如何被验证。

本轮专项测试覆盖性能 baseline、安全与数据归属红线、一致性与恢复、配置 fail-fast、观测和审计材料。性能专项不写未确认的 p95、TPS 或容量数字,只验证核心追加、授权读取和追溯不会因历史规模、相邻仓正文不可解析或外围增强失败而无法成立。量化性能目标仍按需求文档待确认事项处理。

安全和边界红线必须进入 main CI 或 release gate。任何授权视野失效、forbidden body / raw secret 进入 truth / log / event / report、fake adapter 被标记为 production success、source truth 被补造、query / projection / report 反写真相,均不得通过 P0。
```

## 9. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续 Step 必须继续收口:

- Step 11 定义上述专项失败后的缺陷分级和复验规则。
- Step 12 定义这些专项进入测试的进入准则和退出准则。
- Step 13 给专项矩阵中的 evidence placeholder 生成正式证据编号和归档索引。
- 量化性能指标仍是 `00` §15.2 的待确认项,不得在正式 05 中擅自补数字。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能均有验证方式 | 通过 | NFR-CONV-001~012 均映射到专项 |
| 安全和边界红线均有负向测试 | 通过 | 授权、正文、secret、fake-as-production、source truth 均覆盖 |
| 一致性和恢复场景有故障注入方式 | 通过 | transaction、idempotency、outbox、handoff、projection、cursor 均覆盖 |
| 可观测性可通过证据验证 | 通过 | 日志、指标、审计、diagnostic、report 字段检查已定义 |
| 可以进入 Step 11 | 通过 | 下一步定义缺陷管理与复验规则 |
