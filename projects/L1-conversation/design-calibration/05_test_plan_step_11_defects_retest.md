# L1-conversation 05 测试方案 Step 11: 定义缺陷管理与复验规则

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §11 缺陷管理与复验规则
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义缺陷管理与复验规则 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_11_defects_retest.md` |

本步定义测试缺陷如何分级、升级、修复、复验和关闭。进入 / 退出准则、证据编号、报告归档和正式 `05-测试方案.md` 重建分别留给 Step 12、Step 13 和 Step 15。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §14 | 验收项和一票否决项 | 作为 S0 缺陷来源 |
| `05_test_plan_step_06_cases.md` | P0 用例矩阵 | 作为缺陷影响面和回归用例来源 |
| `05_test_plan_step_09_automation_ci_gates.md` | suite、阻断级别、flaky / timeout / dependency failure 处理 | 作为门禁失败处理来源 |
| `05_test_plan_step_10_special_nonfunctional.md` | 非功能专项、红线、故障注入和观测检查 | 作为专项缺陷分级来源 |
| `03_ddd_step_12_error_recovery.md` | 错误、恢复、manual intervention 口径 | 作为恢复类缺陷复验来源 |
| `03_ddd_step_13_concurrency_idempotency.md` | 幂等、并发、重入保护 | 作为一致性类缺陷复验来源 |
| `04_config_step_11_failure_modes.md` | 配置 fail-fast / fail-closed / degraded 边界 | 作为配置类缺陷分级来源 |

## 3. SOP 问题回答

### 3.1 哪些缺陷属于 S 级阻断?

S0 是一票否决缺陷,包括核心能力闭环任一必要节点缺失、Conversation 退化为消息缓存、事实可被覆盖或脱离 space / scope / visibility 存在、授权视野失效、跨域显化接管来源 truth、相邻仓正文或 secret 进入本仓 truth / log / event / report、关键变化不可追溯。

S1 是 P0-blocking 缺陷,包括 command / consumer / job 幂等冲突、transaction rollback 失败、outbox / handoff failure 回滚 truth、query 反写真相、projection / search / cursor 替代原始 fact、artifact / report 路径错误、release gate 或 main CI P0 suite 稳定失败。

### 3.2 哪些缺陷可以风险接受?

S0 和 S1 不允许风险接受。可条件接受的只有:

- S2: P0-supporting 或 P1 readiness 缺陷,例如 staging-like smoke、longer trend、未量化 performance baseline 的趋势偏差。
- S3: 文档描述、非阻断报告美观、后续 P1/P2 专项中的不完整项。

风险接受必须有影响范围、失效模式、临时规避、后续修复 owner、目标时间和不影响 P0 红线的证据。不能用风险接受绕过 redaction、授权、source truth isolation 或 path shape。

### 3.3 修复后必须回归哪些用例?

修复后至少回归该缺陷命中的直接 TC、同场景组 TC、对应 suite 和 release redline subset。若缺陷涉及公共契约、状态机、幂等、配置或观测字段,还必须回归 contract、service、worker / job、config 或 redaction 相关 suite。

### 3.4 缺陷关闭需要哪些证据?

关闭必须提供同一修复基线下的 test result、failure summary 消失、必要的 redaction-check、run report、复验说明和关联设计来源。证据路径必须使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。正式证据 ID 留给 Step 13,本步不生成 EV 编号。

### 3.5 是否需要新增自动化防回归?

是。任何 S0 / S1 缺陷关闭前必须新增或更新自动化防回归,除非已有 P0 suite 能稳定复现并已补充断言。S2 缺陷若来自 nightly / operations-replay,需要进入对应 suite 或形成明确的后续 P1 自动化项。S3 可只更新文档或 checklist,但不得覆盖 P0 风险。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 缺陷处理仍是泛化 QA 规则,没有承接新版一票否决和 gate | 不继承旧缺陷规则 |
| Step 6 | 用例有优先级,但缺少缺陷分级和回归范围 | 本步映射 TC 到缺陷复验范围 |
| Step 9 | 已有 flaky / timeout / dependency failure 处理,但缺少缺陷关闭条件 | 本步补分级、复验和关闭证据 |
| Step 10 | 已有专项红线,但缺陷是否可接受未定义 | 本步明确 S0 / S1 不可风险接受 |
| `04` Step 11 | 配置失效模式已明确 | 本步纳入配置缺陷分级和复验 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 缺陷分级 | 只有泛化严重程度 | S0 一票否决、S1 P0-blocking、S2 boundary / P1 readiness、S3 非阻断 |
| 风险接受 | 不清楚 | S0 / S1 禁止;S2 / S3 有条件接受 |
| 复验范围 | 按失败用例复跑 | 按直接 TC、同组 TC、suite、redline 和专项矩阵回归 |
| 关闭证据 | 可能只看测试通过 | 必须有 run-scoped artifact / report / redaction / closure note |
| 防回归 | 未定义 | S0 / S1 必须新增或更新自动化断言 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 缺陷分级数量 | 只用 blocker / non-blocker | S0~S3 四级 | B | 能区分一票否决、P0 阻断、P1 readiness 和非阻断项 |
| S0 是否允许风险接受 | 可以签字通过 | 不允许 | B | 一票否决项不得降级为普通风险 |
| flaky 是否降级 | 视为偶发现象 | P0 flaky 必须留证并按缺陷处理 | B | 不稳定证据不能支撑验收 |
| 修复后是否只跑失败 TC | 只跑失败用例 | 跑直接 TC + 相邻场景 + gate subset | B | 防止修复局部导致相关状态 / 红线漂移 |
| 证据 ID 是否本步生成 | 本步生成 | Step 13 统一生成 | B | 证据编号依赖归档结构 |

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S0 一票否决 | 命中 `00` §14.2 一票否决或 Step 10 红线,会破坏 Conversation truth / authorization / data ownership / traceability | 授权视野失效;相邻仓正文进入 truth / log / report;fact 可被覆盖;关键变化不可追溯;fake-as-production | 立即阻断 PR / main / release;必须修复;不得风险接受;必须新增 / 更新自动化防回归 | 是 |
| S1 P0-blocking | P0 用例、P0 suite 或核心非功能专项失败,但未直接命中 S0 | transaction rollback 失败;idempotency conflict 处理错误;outbox failure 回滚 truth;path shape 错误;P0 suite timeout | 阻断对应 gate;修复后回归直接 TC、同组 TC 和相关 suite;必须保留失败与复验 artifact | 是 |
| S2 Boundary / readiness | P0/P1 boundary、nightly、operations-replay 或 P0-supporting 失败,不破坏 P0 红线 | staging-like smoke 失败;long history trend 退化但无正式阈值;controlled adapter 接缝失败 | 可条件风险接受;必须记录影响、临时规避、owner、目标修复时间;release readiness 可被阻断 | 视范围 |
| S3 非阻断 | 文档、报告呈现、非关键统计或后续专项缺口 | report 文案不清;非验收字段排序错误;P2 production-like 场景未覆盖 | 不阻断 P0;进入 backlog;不得掩盖 S0 / S1 | 否 |

### 7.2 缺陷类型到回归范围表

| 缺陷类型 | 直接回归 | 扩展回归 | 必须检查 |
|---|---|---|---|
| Space / scope truth | `TC-CONV-SPACE-*`; `TC-CONV-SCOPE-*` | `SUITE-CONV-MAIN-SERVICE`; release redline | state、scope bundle、outbox、audit |
| Fact append / retract | `TC-CONV-FACT-*`; `TC-CONV-TX-001` | service、domain、outbox suite | append-only、rollback、receipt、trace |
| Authorization / query | `TC-CONV-QUERY-*`; `TC-CONV-SEARCH-001` | query suite、contract suite、release redline | visibility filter、query no-write、forbidden body absent |
| Cross-domain manifestation | `TC-CONV-MAN-*`; `TC-CONV-CONSUMER-*` | integration-like、worker suite、redaction check | source truth isolation、safe snapshot、unresolved / mismatch |
| Outbox / event collaboration | `TC-CONV-OUTBOX-*`; consumer duplicate tests | worker / job suite、nightly replay | no duplicate publish、retry / failed、truth not rollback |
| Trace / archive handoff | `TC-CONV-HANDOFF-*`; `TC-CONV-TRACE-001` | job suite、operations-replay | handoff state、payload ref-only、audit refs |
| Projection / cursor / consistency | `TC-CONV-DERIVED-*`; `TC-CONV-CURSOR-001`; `TC-CONV-CONSISTENCY-001` | operations-replay、query marker tests | no auto repair、stale / failed marker、sequence no regress |
| Config / path / report | `TC-CONV-CONFIG-001`; `TC-CONV-REPORT-001` | `SUITE-CONV-MAIN-CONFIG`; release report | fail-fast、path shape、run id、no `<project>` / `latest` |
| Redaction / forbidden body | `TC-CONV-REDACTION-001`; forbidden body negative | release redline、redaction check | truth / log / event / audit / report all clean |
| Observability / audit | Step 10 observability checks | report generation、redaction check | required fields present; forbidden fields absent |

### 7.3 复验规则表

| 场景 | 复验规则 | 不足以关闭的情况 |
|---|---|---|
| S0 修复 | 必须重跑命中红线的直接 TC、release redline、redaction check 和相关 main CI suite | 只提供手工说明;只跑单个 unit;未生成 redaction report |
| S1 修复 | 必须重跑直接 TC、同场景组 TC、相关 P0 suite 和失败前同类 negative case | 只跑失败用例;未覆盖同组状态 / 幂等 / path |
| S2 修复 | 必须重跑对应 nightly / operations-replay / staging smoke,并说明是否影响 P0 | 只更新文档;未证明不影响 P0 红线 |
| flaky 修复 | 必须使用同一复现 seed 或 failure mode 重跑,记录 first failure 和 fixed run | 只因本次没复现就关闭 |
| timeout 修复 | 必须记录 timeout case、profile、seed、duration 和修复后 duration;无量化阈值时只写 no-regression | 删除 timeout 测试或放宽为无限等待 |
| dependency failure 修复 | 必须证明 fake / controlled failure 不回退 fake success,且保留 retry / failed / unresolved marker | 直接跳过依赖场景或把失败当成功 |
| config failure 修复 | 必须重跑 parse、unknown key、unsupported profile、path unwritable、redaction lower bound 相关 negative | 只验证 happy path config |

### 7.4 关闭证据要求表

| 缺陷级别 | 关闭证据 | 路径约束 |
|---|---|---|
| S0 | 修复说明、设计来源、失败 run、复验 run、release redline、redaction-check、run report、自动化防回归说明 | `artifacts/test/<run_id>`; `reports/runs/<run_id>`; `reports/acceptance` |
| S1 | 修复说明、失败 suite、复验 suite、直接 TC 与同组 TC 结果、failure summary 消失 | `artifacts/test/<run_id>`; `reports/runs/<run_id>` |
| S2 | 影响评估、风险接受记录或修复 run、nightly / operations / staging 结果、P0 不受影响说明 | `artifacts/test/<run_id>`; `reports/runs/<run_id>` |
| S3 | backlog item、文档或报告修正记录、必要时局部检查结果 | 按实际生成,不得伪造 P0 evidence |

### 7.5 风险接受规则表

| 可接受对象 | 条件 | 禁止事项 |
|---|---|---|
| S2 P1 readiness | 不影响 P0 红线;有 owner、修复时间、临时规避和 replay / staging 记录 | 不得宣称 production-like 通过 |
| S2 performance trend | 无正式量化阈值;核心闭环仍成立;记录 baseline drift | 不得补写虚假 p95 / TPS 数字 |
| S3 文档 / 报告呈现 | 不影响验收裁决和证据路径 | 不得影响 redaction / path / evidence index |
| S0 / S1 | 不可接受 | 不得通过签字、延期或手工说明降级 |

### 7.6 新增自动化防回归规则表

| 缺陷来源 | 防回归要求 | 进入 suite |
|---|---|---|
| 新红线漏洞 | 新增 negative TC 或扩展现有 TC 断言 | release redline + main CI |
| 新状态机非法迁移 | 新增 domain / service 状态断言 | PR unit + main service |
| 新幂等 / 重入漏洞 | 新增 same key / duplicate / rerun 用例 | main service / worker / job |
| 新配置失效模式 | 新增 config negative fixture | main config + release gate |
| 新观测泄露 | 新增 redaction / forbidden field check | release redline |
| 新 path / report 问题 | 新增 path shape / report generation check | release report |
| 新 P1 boundary 问题 | 新增 nightly / staging smoke subset | nightly / staging smoke |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §11 时摘录。

```markdown
## 11. 缺陷管理与复验规则

> 校准来源：
> - `design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“缺陷分级表”“缺陷类型到回归范围表”“复验规则表”“关闭证据要求表”和“新增自动化防回归规则表”小节，了解 P0 缺陷如何分级、复验和关闭。

缺陷分为 S0 一票否决、S1 P0-blocking、S2 boundary / readiness 和 S3 非阻断四级。S0 和 S1 不允许风险接受。任何命中授权、数据归属、append-only、source truth isolation、redaction、fake-as-production、关键变化不可追溯或 evidence path 的缺陷,不得通过手工说明降级。

修复后必须回归直接失败用例、同场景组用例、相关 P0 suite 和必要的 release redline / redaction check。关闭缺陷必须提供 run-scoped artifact 和 report,路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和必要的 `reports/acceptance`。正式证据编号由 Step 13 统一生成。
```

## 9. 待确认事项

无阻塞进入 Step 12 的待确认事项。

后续 Step 必须继续收口:

- Step 12 将本步 S0 / S1 / S2 / S3 分级纳入进入准则和退出准则。
- Step 13 为关闭证据生成正式 evidence ID 和归档索引。
- Step 14 定义回归策略与残余风险时必须使用本步风险接受规则。
- Step 15 汇总正式 `05-测试方案.md` 时不得把 S0 / S1 写成可延期风险。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷分级可执行 | 通过 | S0~S3 定义、示例和阻断关系已明确 |
| 风险接受边界清晰 | 通过 | S0 / S1 不可接受,S2 / S3 有条件 |
| 复验规则可执行 | 通过 | 直接 TC、同组 TC、suite、redline 和专项回归已定义 |
| 关闭证据要求明确 | 通过 | run-scoped artifact / report / redaction / closure note 已定义 |
| 可以进入 Step 12 | 通过 | 下一步定义进入准则与退出准则 |
