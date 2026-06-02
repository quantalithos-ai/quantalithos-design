# L1-conversation 06 验收标准 Step 9: 定义非功能验收门禁

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §9 非功能验收门禁
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义非功能验收门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_09_nonfunctional_gate.md` |

本步把 `NFR-CONV-001~012`、专项测试、配置失效模式和风险挂起项转成非功能验收门禁。可观测性、审计字段、证据文件完整性和 acceptance handoff 明细留给 Step 10。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §13 / §14 / §15 | `NFR-CONV-001~012`、非功能验收项和待确认量化指标 | 作为非功能门禁来源 |
| `01-架构设计.md` §14 / §15 | 可接受债务、不可接受债务和演进触发 | 作为未量化性能数字处理口径 |
| `03-详细设计.md` §10 / §11 / §12 / §15 | 事务、一致性、错误恢复、幂等、观测和审计 | 作为行为阈值来源 |
| `04-配置设计.md` §6 / §11 / §12 | profile、fail-fast、fail-closed、degraded marker、reports / artifacts 路径 | 作为配置和环境阈值来源 |
| `05-测试方案.md` §9 / §10 / §13 / §14 | suite、专项测试、EV、风险和残余风险 | 作为证据和 P0 / P1 边界来源 |
| `05_test_plan_step_10_special_nonfunctional.md` | 专项测试矩阵、NFR 覆盖表和阈值来源表 | 作为 Step 9 主测试输入 |
| `06_acceptance_step_08_state_tx_consistency.md` | 状态、事务、幂等和一致性验收 | 作为非功能一致性门禁承接来源 |

## 3. SOP 问题回答

### 3.1 哪些非功能指标是 P0?

P0 非功能指标不是生产吞吐或容量数字,而是结构性质量底线:核心追加和授权读取不被历史规模、外围增强或相邻仓不可用阻断;已提交 truth 不因下游不可用丢失或改写;授权视野、数据归属、redaction、幂等、一致性、配置 fail-fast 和 evidence path 必须成立。`NFR-CONV-001~012` 均需要有对应验收门禁,其中安全、数据归属、授权、幂等冲突和证据路径错误属于 P0-blocking 或一票否决候选。

### 3.2 阈值来自需求、设计还是运行基线?

阈值分三类。行为阈值来自 `00` 的 NFR / 一票否决、`03` 的状态 / 事务 / 错误 / 幂等契约和 `04` 的配置失效模式。配置阈值来自 `04` 的 profile、path、redaction、batch、retry 和 timeout 设计。量化性能阈值当前未由需求锁定,不得临时写入 p95、TPS、连接数、月度事实容量或重建窗口。

### 3.3 哪些专项未覆盖,是否影响验收?

真实 DB / broker / resolver / handoff 产品行为、staging-like、production-like、生产级容量数字、下游 UI / bridge 体验、runtime 推理质量、长期归档恢复手册和完整 dashboard 不作为本轮 P0 空洞。若 P0 使用 controlled seam 通过,这些缺口进入 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md`;若本仓核心边界或证据路径本身无法证明,则不允许风险接受。

### 3.4 哪些非功能失败会阻断发布?

授权视野失效、forbidden body / raw secret 进入 truth / log / event / audit / report、source truth 被补造、query / projection / report 反写真相、duplicate 形成冲突 truth、配置 silent fallback、fake-as-production、report path shape 错误、P0 suite 或 release redline 失败均阻断发布。外围增强失败本身不阻断,但必须表现为 stale / failed / unresolved / retry / diagnostic marker。

### 3.5 证据来自哪里?

非功能证据来自 `SUITE-CONV-MAIN-*`、`SUITE-CONV-NIGHTLY-*`、`SUITE-CONV-RELEASE-REDLINE`、`SUITE-CONV-RELEASE-REPORT` 以及 `EV-CONV-*`。正式路径必须是 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`,不得使用 `latest` 或 `<project>` 层级。Step 10 将进一步拆成 evidence index、gate results、redaction check、handoff、veto checklist 和 risk acceptance。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 容易继承旧性能数字或旧实时协议 | 不继承旧 p95、连接数、Turn 数字或 AG-UI 主线 |
| `00-需求文档.md` §13 | NFR 是质量底线,不是执行证据格式 | 本步转成 AC-NFR 门禁 |
| `01-架构设计.md` §14 / §15 | 量化性能数字被列为可接受债务 | 本步明确不得写成 P0 阈值 |
| `05-测试方案.md` §10 | 专项测试矩阵完整,但仍是测试视角 | 本步改写为验收裁决视角 |
| `04-配置设计.md` §11 | 配置失效模式已有 fail-fast / degraded 口径 | 本步纳入配置非功能门禁 |
| Step 8 产物 | 状态、事务、幂等已裁决 | 本步只承接非功能一致性影响,不重复展开状态矩阵 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 性能门禁 | 容易写成无来源数字 | 只验核心路径 baseline / no-regression / trend |
| 可用性门禁 | 容易把下游真实可用性作为 P0 | 区分本仓 truth 成立与下游 readiness |
| 安全门禁 | 分散在功能、配置和 redaction | 统一为授权、数据归属、secret、fake-as-production 门禁 |
| 恢复门禁 | 分散在事务和 job 用例 | 以 degraded marker、retry、failed、diagnostic 裁决 |
| 证据门禁 | 容易泛写测试报告 | 绑定 EV、suite 和固定 report path,细节留给 Step 10 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否写生产级 p95 / TPS | 写临时数字 | 不写未确认数字,只做 baseline / trend | B | 需求和架构均标记正式负载模型待确认 |
| 真实下游不可用是否阻断 P0 | 阻断 | controlled seam 通过即可,真实下游进入风险 | B | 本轮验本仓非功能底线,不验所有下游生产能力 |
| redaction 是否只放 Step 10 | 只放证据门禁 | Step 9 定义安全非功能失败,Step 10 定义证据文件 | B | 安全失败本身是非功能裁决,证据细节另行展开 |
| 外围增强失败是否不通过 | 不通过 | 只要核心 truth 成立且 marker 正确,可通过 P0 | B | NFR-CONV-002 要求外围不得反向阻塞核心 |
| production-like 未验证是否 P0 空洞 | 是 | 否,进入风险接受 / open issues | B | `05` 已明确当前 P0 使用 in-memory / fake / controlled adapter |

## 7. 结构化中间产物

### 7.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-NFR-001 | 性能 baseline | 核心追加、授权读取和追溯在长历史 fixture、相邻仓正文不可解析和外围增强故障下仍能成立 | 不写 p95 / TPS;P0 要求 TC 通过且无核心 truth 阻塞 | `TC-CONV-FACT-001`;`TC-CONV-TX-001`;`TC-CONV-QUERY-*`;`EV-CONV-FACT-001`;`EV-CONV-AUTH-001` | 失败则不通过;量化数字缺失只进入风险 |
| AC-NFR-002 | 外围增强降级 | projection、search、cursor、report failure 不阻断 space、fact append、authorized query 和 trace / handoff truth | 核心 truth 成立;外围状态为 `Stale` / `Failed` / diagnostic marker | `TC-CONV-DERIVED-*`;`TC-CONV-CURSOR-001`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-DERIVED-001` | 核心被阻断则不通过;只有外围 degraded 可风险接受 |
| AC-NFR-003 | 可用性 / 下游降级 | Chat、Workspace、Runtime、Bridges、Observability、Archive 降级不得丢失或改写已提交 truth | truth 不回滚;outbox / handoff / resolver 进入 retry、failed、unresolved 或 stale | `TC-CONV-MAN-*`;`TC-CONV-OUTBOX-*`;`TC-CONV-HANDOFF-*`;`EV-CONV-MAN-001`;`EV-CONV-OUTBOX-001`;`EV-CONV-HANDOFF-001` | truth 被下游失败回滚或改写则不通过 |
| AC-NFR-004 | 来源不可用安全降级 | Identity、Work、Governance、Artifact 不可解析时不得补造来源正文或生命周期 truth | 只保存 ref / safe snapshot / unresolved / mismatch marker | `TC-CONV-MAN-002`;`TC-CONV-MAN-003`;`TC-CONV-CONSUMER-*`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` | 补造 source truth 或保存 source body 则一票否决候选 |
| AC-NFR-005 | 授权视野安全 | 任一消费路径只返回授权范围内 fact、snapshot、ref、cursor 或 marker | hidden fact 不可见;sealed visibility 不可扩张 | `TC-CONV-SCOPE-002`;`TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`EV-CONV-AUTH-001` | 授权失效不允许风险接受 |
| AC-NFR-006 | 数据归属 / redaction | forbidden body、raw secret、raw token、runtime reasoning body、bridge platform body 不得进入 truth、event、log、audit、report | redaction check 必须通过;配置 raw secret / non-strict redaction fail-fast | `TC-CONV-FACT-004`;`TC-CONV-CONSUMER-003`;`TC-CONV-REDACTION-001`;`EV-CONV-REDACTION-001` | 命中即不通过,Step 11 汇总一票否决 |
| AC-NFR-007 | 审计 / 追溯底线 | space、scope、visibility、fact append / retract、manifestation、handoff、outbox、job 关键变化可复盘 | 必须能定位 actor / source / time / state / evidence ref;禁止正文 | `EV-CONV-TRUTH-001`;`EV-CONV-FACT-001`;`EV-CONV-HANDOFF-001`;`EV-CONV-GATE-001` | 关键变化不可追溯则不通过;字段细节由 Step 10 验 |
| AC-NFR-008 | 幂等 / 一致性 | 重复 command、event、outbox publish 和 job rerun 不形成冲突 truth | duplicate 返回 existing / skip;different digest conflict;job rerun existing receipt | `TC-CONV-FACT-002`;`TC-CONV-FACT-003`;`TC-CONV-OUTBOX-003`;`EV-CONV-FACT-001`;`EV-CONV-OUTBOX-001` | 冲突 truth 或重复外部副作用则不通过 |
| AC-NFR-009 | 配置 fail-fast / fail-closed | unsupported profile、重复 key、raw secret、non-strict redaction、fake-as-production、path shape 错误必须 fail-fast 或 fail-closed | 不允许 silent fallback;P0 profile 为 local-dev、ci-test、integration-like、operations-replay | `TC-CONV-CONFIG-001`;`TC-CONV-REPORT-001`;`EV-CONV-CONFIG-001`;`EV-CONV-REDACTION-001` | silent fallback 或 fake-as-production 不允许风险接受 |
| AC-NFR-010 | 证据路径兼容性 | artifacts / reports / acceptance 输出路径符合固定基线 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`;无 `<project>` / `latest` | `SUITE-CONV-RELEASE-REPORT`;`EV-CONV-CONFIG-001`;`EV-CONV-GATE-001`;`EV-CONV-ACCEPT-001` | 路径错误导致送验不成立 |
| AC-NFR-011 | 可观测性风险可见 | 核心能力成功 / 异常、依赖降级、边界违规、重复冲突、job partial failure 可观察 | 至少有 safe log / metric / audit / report marker;禁止高风险字段 | `EV-CONV-GATE-001`;`EV-CONV-REDACTION-001`;`reports/runs/<run_id>/gate-results.md` | 完全不可观察则不通过;字段完整性由 Step 10 细化 |
| AC-NFR-012 | P1 / P2 缺口隔离 | production-like、真实 DB / broker / resolver / handoff、下游 UI / bridge 体验和生产容量数字不得伪装 P0 通过 | controlled seam 通过且风险记录完整;不得宣称 production readiness | `reports/acceptance/risk-acceptance.md`;`reports/acceptance/open-issues.md`;`EV-CONV-ACCEPT-001` | 伪装 production-like 或风险未记录则不通过 |

### 7.2 NFR 到验收项映射表

| NFR | 对应 AC | 阻断口径 |
|---|---|---|
| `NFR-CONV-001` | AC-NFR-001 | 核心追加 / 读取 baseline 失败阻断 |
| `NFR-CONV-002` | AC-NFR-002 | 外围失败阻断核心 truth 则阻断 |
| `NFR-CONV-003` | AC-NFR-003 | 下游失败改写 truth 阻断 |
| `NFR-CONV-004` | AC-NFR-004 | 补造 source truth 阻断 |
| `NFR-CONV-005` | AC-NFR-005 | 授权视野失效阻断 |
| `NFR-CONV-006` | AC-NFR-006 | 正文 / secret 泄漏阻断 |
| `NFR-CONV-007` | AC-NFR-007 | 关键变化不可追溯阻断 |
| `NFR-CONV-008` | AC-NFR-004;AC-NFR-007 | 显化来源不可追溯或补造 truth 阻断 |
| `NFR-CONV-009` | AC-NFR-008 | 重复输入形成冲突 truth 阻断 |
| `NFR-CONV-010` | AC-NFR-002;AC-NFR-008 | 派生 / 辅助结果反写真相阻断 |
| `NFR-CONV-011` | AC-NFR-011 | 核心能力完全不可观察阻断 |
| `NFR-CONV-012` | AC-NFR-004;AC-NFR-006;AC-NFR-011 | 依赖降级或边界风险不可观察阻断 |

### 7.3 阈值与缺口处理表

| 阈值 / 缺口 | 当前口径 | 进入正式 06 的方式 |
|---|---|---|
| p95、TPS、连接数、月度事实容量、重建窗口 | 当前缺正式负载模型 | 不作为 P0 通过阈值;进入风险 / 待确认 |
| long history baseline | 只证明结构性不阻塞 | 作为 AC-NFR-001 证据,不宣称生产容量 |
| fake / controlled adapter | 可用于 P0 seam 验证 | 必须带 fake marker,不得宣称 production success |
| staging-like / production-like | P1/P2 | 不阻塞 P0,但必须进入 risk acceptance / open issues |
| dashboard / alert / runbook | 运维后续 | Step 10 只要求 safe log / metric / audit / report marker |
| config center / hot reload | P1/P2 unsupported | P0 中启用即 fail-fast |

### 7.4 非功能门禁裁决图

```text
[P0 Functional Truth]
  | must stay valid under
  v
[History / Dependency / Projection / Handoff / Config Failure]
  | accepted only as
  v
[Retry / Failed / Stale / Unresolved / Diagnostic / Risk Record]

[Security / Authorization / Redaction / Path Shape Failure]
  | not risk-acceptable
  v
[Release Blocked]
```

关键说明:

- 非功能门禁保护的是核心 truth、授权、安全、恢复和证据可信度。
- 外围增强失败可接受的前提是核心 truth 不回滚、不补造、不反写。
- 未确认的量化数字不得临时变成 P0 阈值。
- 安全、授权、redaction、fake-as-production 和 path shape 错误不得风险接受。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §9 时摘录。

```markdown
## 9. 非功能验收门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_09_nonfunctional_gate.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_09_nonfunctional_gate.md` 的“非功能验收表”“NFR 到验收项映射表”“阈值与缺口处理表”和“非功能门禁裁决图”小节，了解性能 baseline、可用性降级、安全红线、幂等一致性、配置 fail-fast 和证据路径如何进入验收裁决。

本轮非功能验收以 `AC-NFR-001~AC-NFR-012` 为裁决入口。`NFR-CONV-001~012` 均必须至少映射到一条验收项。当前不写未确认的 p95、TPS、连接数、月度事实容量或重建窗口数字；性能验收只证明核心追加、授权读取和追溯在长历史、相邻依赖不可用或外围增强故障下仍能成立。

授权视野失效、forbidden body / raw secret 泄漏、source truth 被补造、query / projection / report 反写真相、duplicate 形成冲突 truth、配置 silent fallback、fake-as-production 和证据路径错误不得风险接受。真实 production-like、真实 broker / resolver / handoff、下游 UI / bridge 体验和生产级容量数字缺口必须进入 `reports/acceptance/risk-acceptance.md` 或 `reports/acceptance/open-issues.md`,不得伪装为 P0 production readiness。
```

## 9. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续必须继续收口:

- Step 10 将把 AC-NFR-007、AC-NFR-010、AC-NFR-011 和 AC-NFR-012 依赖的 evidence、audit、redaction、gate 和 acceptance report 展开。
- Step 11 将把授权失效、redaction 泄漏、fake-as-production、path shape 错误和 query / projection 反写汇总为一票否决项。
- Step 13 将把 production-like、真实下游、生产容量数字和 dashboard / runbook 缺口纳入风险接受。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能项有门禁 | 通过 | `AC-NFR-001~012` 覆盖性能、可用性、安全、恢复、配置和证据路径 |
| 阈值来源明确 | 通过 | 行为阈值、配置阈值和未确认量化阈值已区分 |
| 未覆盖专项影响清楚 | 通过 | production-like、真实下游和生产容量进入风险 / open issues |
| 阻断发布的非功能失败清楚 | 通过 | 授权、redaction、fake-as-production、path shape 等已标阻断 |
| 证据来源可追溯 | 通过 | 绑定 TC、EV、suite 和 report path |
| 可以进入 Step 10 | 通过 | 下一步定义可观测性、审计与证据门禁 |
