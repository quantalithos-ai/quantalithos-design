# L1-conversation 05 测试方案 Step 5: 建立需求追溯与覆盖矩阵

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §5 需求追溯与覆盖矩阵
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 建立需求追溯与覆盖矩阵 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_05_traceability_matrix.md` |

本步只建立需求、设计依据、测试场景族、测试层级和证据类别之间的追溯关系。具体用例 ID 留给 Step 6，测试数据留给 Step 7，环境矩阵留给 Step 8，自动化门禁留给 Step 9，证据 ID 留给 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §9 / §10 / §13 / §14 / §16 | FR、BR、NFR、验收项、一票否决和需求追溯矩阵 | 作为覆盖矩阵主来源 |
| `05_test_plan_step_02_scope.md` | P0-blocking、P0-supporting、P0/P1-boundary 和一票否决范围 | 作为覆盖优先级来源 |
| `05_test_plan_step_03_test_objects_slices.md` | 六组测试对象与测试切口 | 作为场景族来源 |
| `05_test_plan_step_04_strategy_layers.md` | Unit / Service / Integration / API / Gate 五层策略 | 作为自动化和门禁层级来源 |
| `03-详细设计.md` §15 | 最小测试切口和脚本契约 | 作为测试覆盖下限 |
| `04-配置设计.md` §6 / §7 / §11 / §12 | profile、配置项、失效模式、reports / artifacts 和 redaction | 作为配置与证据覆盖来源 |

## 3. SOP 问题回答

### 3.1 每个 P0 需求对应哪些设计章节?

P0 核心需求对应 `03` 的对象契约、协议契约、处理流、状态矩阵、事务一致性、错误恢复、幂等并发和观测脱敏章节，同时对应 `04` 的 profile、配置项、失效模式和证据路径章节。外围增强需求 `FR-CONV-006~008` 不作为核心闭环必要节点，但必须证明它们不反写真相、不越权消费、不破坏 P0 证据。

### 3.2 每个 P0 需求至少有哪些测试场景?

每个 P0 核心需求至少覆盖正向主线、关键负向、事务 / 幂等、状态机或边界隔离、证据输出五类场景。外围增强需求至少覆盖派生只读、失败 marker、重跑 / 重建和授权过滤场景。

### 3.3 哪些场景必须自动化?

所有 P0-blocking 场景必须自动化进入 CI 或 release gate。P0-supporting 场景可以进入 CI、nightly 或 operations-replay，但其中涉及授权、数据归属、append-only、source truth isolation、redaction、证据路径的负向场景必须进入 gate。

### 3.4 每个场景的证据如何编号?

本步不生成最终证据 ID。证据编号规则在 Step 13 落地；本步只标注证据类别:

| 证据类别 | 后续编号来源 | 用途 |
|---|---|---|
| test result evidence | Step 13 | 单元、服务、集成、契约和 gate 测试结果 |
| artifact path evidence | Step 13 | `artifacts/test/<run_id>` 下的测试产物 |
| report evidence | Step 13 | `reports/runs/<run_id>`、redaction check 和 evidence index |
| failure / veto evidence | Step 13 | 一票否决、配置失败、quarantine、conflict、redaction violation |
| trace / audit evidence | Step 13 | 关键变化、handoff、archive、consistency validation 的可追溯材料 |

### 3.5 哪些需求暂未覆盖,原因是什么?

当前没有 P0 需求空洞。需要挂起的是量化性能目标、真实生产 endpoint、真实 DB / broker / resolver / handoff 和全局归档恢复，它们不是当前 P0 通过条件，已在 Step 2 作为 P1/P2 或后续专项处理。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿缺少新版 FR / BR / NFR 到测试切口的追溯 | 不继承旧矩阵 |
| `00` §16 | 已有需求级追溯，但没有映射到测试层级、自动化和证据类别 | 本步转换为测试追溯矩阵 |
| Step 3 | 已抽取测试对象，但未说明哪些需求由哪些对象覆盖 | 本步将对象切口反连到 FR / BR / NFR |
| Step 4 | 已定义分层策略，但未说明哪些需求必须进入 gate | 本步按 P0-blocking / supporting 标注自动化口径 |
| `04` | 配置和证据路径已清晰，但还未进入测试追溯主表 | 本步纳入 NFR、BR 和一票否决覆盖 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 追溯主轴 | 需求追溯停留在需求文档内部 | FR / BR / NFR 均映射到设计章节、测试切口、层级和证据类别 |
| 用例编号 | 容易在追溯阶段提前固化 | 明确用例 ID 留给 Step 6 |
| 证据编号 | 容易提前生成 EV 编号 | 本步只标注证据类别，最终 ID 留给 Step 13 |
| 覆盖空洞 | 旧稿未显式列出 | 本步列出无 P0 空洞，并标明 P1/P2 挂起项 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否每条 BR 都生成独立用例 | 逐条立即生成 TC | 先分组映射，Step 6 再拆用例 | B | Step 5 负责追溯，不负责完整用例设计 |
| 是否提前生成证据 ID | 本步生成 EV | Step 13 统一编号 | B | 证据编号依赖报告结构和归档规则 |
| 外围增强是否进入核心闭环通过条件 | FR006~008 全部 P0-blocking | 标为 P0-supporting，但红线负向进 gate | B | 需求已将其定义为外围增强 |
| 是否接受人工确认覆盖 P0 | 可以人工确认 | P0 必须有自动化或 gate 证据 | B | SOP 明确 P0 不得只写人工确认 |

## 7. 结构化中间产物

### 7.1 FR 覆盖矩阵

| 需求 ID | 设计依据 | 测试场景族 | 用例 ID | 自动化 | 证据类别 | 覆盖状态 |
|---|---|---|---|---|---|---|
| FR-CONV-001 | `00` §16; `03` Step 6 / 8 / 9 / 10 / 11 / 15; `04` §6 / §7 | space / participant scope / visibility scope 建立、更新、关闭、状态非法迁移、outbox rollback、audit trace | 待 Step 6 | CI unit + service + API gate | test result; trace / audit; failure evidence | 已覆盖 |
| FR-CONV-002 | `00` §16; `03` Step 6 / 8 / 9 / 10 / 11 / 13 / 15 | append fact、retract fact、append-only、idempotency、same key conflict、forbidden body reject | 待 Step 6 | CI unit + service + API gate | test result; failure / veto; trace evidence | 已覆盖 |
| FR-CONV-003 | `00` §16; `03` Step 6 / 8 / 9 / 10 / 15; `04` §11 | authorized read model、fact list、cursor、search、trace read、visibility denied、query no-write | 待 Step 6 | CI query + contract + gate | test result; veto evidence; redaction report | 已覆盖 |
| FR-CONV-004 | `00` §16; `03` Step 6 / 8 / 9 / 12 / 15; `04` §11 | external ref、safe snapshot、manifestation、digest mismatch、unresolved、source body absent | 待 Step 6 | CI service + consumer + integration | test result; quarantine / failure; trace evidence | 已覆盖 |
| FR-CONV-005 | `00` §16; `03` Step 6 / 8 / 9 / 10 / 12 / 15; `04` §12 | review anchor、trace context、trace handoff、archive handoff、retention guard、handoff retry / failed | 待 Step 6 | CI service + job + release gate | test result; report evidence; trace / audit evidence | 已覆盖 |
| FR-CONV-006 | `00` §16; `03` Step 6 / 8 / 9 / 10 / 11; `04` §6 / §11 | projection rebuild、read model maintenance、search index refs-only、consistency validation no auto-repair | 待 Step 6 | CI / nightly / operations-replay; 红线负向进 gate | test result; report evidence; failure evidence | 已覆盖 |
| FR-CONV-007 | `00` §16; `03` Step 8 / 9 / 10 / 15 | authorized search、long history page、stale index marker、visibility filter、forbidden body absent | 待 Step 6 | CI query + gate negative | test result; redaction report | 已覆盖 |
| FR-CONV-008 | `00` §16; `03` Step 8 / 9 / 10 / 11 / 13 | change cursor、poll changes、outbox event、duplicate publish、cursor invalid / expired | 待 Step 6 | CI contract + worker + job | test result; artifact path; failure evidence | 已覆盖 |

### 7.2 BR 覆盖矩阵

| 规则 ID | 设计依据 | 测试场景族 | 用例 ID | 自动化 | 证据类别 | 覆盖状态 |
|---|---|---|---|---|---|---|
| BR-CONV-001, BR-CONV-013 | `03` Step 6 / 9 / 10 | space / scope 必须显式建立和变更; read / display 不得隐式改变范围 | 待 Step 6 | CI unit + service | test result; trace evidence | 已覆盖 |
| BR-CONV-002, BR-CONV-014 | `03` Step 6 / 9 / 10 / 11 / 13 | fact append-only、query / projection 不生成业务 fact、rollback 和 conflict | 待 Step 6 | CI unit + service + gate | test result; failure / veto evidence | 已覆盖 |
| BR-CONV-003, BR-CONV-018 | `03` Step 6 / 8 / 9 / 15 | authorized consumer、query visibility、downstream cannot define truth | 待 Step 6 | CI query + contract + gate | test result; veto evidence | 已覆盖 |
| BR-CONV-004, BR-CONV-015, BR-CONV-017, BR-CONV-019 | `03` Step 6 / 8 / 9 / 12 / 15 | manifestation ref-only、safe snapshot、governance / artifact / work source truth isolation | 待 Step 6 | CI service + consumer + redaction gate | failure / veto; trace evidence | 已覆盖 |
| BR-CONV-005, BR-CONV-020 | `03` Step 6 / 8 / 9 / 10 / 15 | trace context、review anchor、audit event、handoff / archive evidence | 待 Step 6 | CI service + job + release gate | trace / audit; report evidence | 已覆盖 |
| BR-CONV-006, BR-CONV-007, BR-CONV-008 | `01` boundary; `03` Step 8 / 9 / 15 | Chat / Workspace / Bridges 只消费或映射,不得成为 truth source | 待 Step 6 | contract + integration-like negative | failure / veto evidence | 已覆盖 |
| BR-CONV-009, BR-CONV-010, BR-CONV-011, BR-CONV-012 | `01` boundary; `03` Step 8 / 9 / 15 | Runtime / Governance / Artifact / Identity 正文和生命周期不归本仓 | 待 Step 6 | consumer + redaction gate | failure / veto; redaction report | 已覆盖 |
| BR-CONV-016, BR-CONV-021 | `03` Step 9 / 10 / 11 / 13; `04` §11 | projection / search / cursor / reports / consistency job 只派生和诊断,不自动修写真相 | 待 Step 6 | CI job + operations-replay | report evidence; failure evidence | 已覆盖 |

### 7.3 NFR 覆盖矩阵

| NFR ID | 设计依据 | 测试场景族 | 用例 ID | 自动化 | 证据类别 | 覆盖状态 |
|---|---|---|---|---|---|---|
| NFR-CONV-001 | `03` Step 9 / 11; `04` §6 | core append / authorized read / trace 在 local / CI fixture 下可持续成立 | 待 Step 6 | CI service + query smoke | test result; report evidence | 已覆盖; 量化目标后续专项 |
| NFR-CONV-002 | `03` Step 11 / 12; `04` §11 | projection / search / timely change 不可用时核心 truth 仍成立 | 待 Step 6 | job failure + service gate | failure evidence | 已覆盖 |
| NFR-CONV-003 | `03` Step 11 / 12 / 13 | downstream unavailable、publish retry / failed 不回滚 truth | 待 Step 6 | worker + job CI | failure evidence; trace evidence | 已覆盖 |
| NFR-CONV-004 | `03` Step 12 / 15 | resolver unresolved、digest mismatch 不补造来源正文 | 待 Step 6 | integration + redaction gate | veto evidence; redaction report | 已覆盖 |
| NFR-CONV-005 | `03` Step 6 / 8 / 9 / 15 | visibility guard、consumer context、search / cursor / trace read authorized | 待 Step 6 | query + API gate | test result; veto evidence | 已覆盖 |
| NFR-CONV-006 | `03` Step 15; `04` §8 / §11 | raw secret、runtime reasoning body、bridge / artifact body 不进 truth / log / reports | 待 Step 6 | redaction gate | redaction report; veto evidence | 已覆盖 |
| NFR-CONV-007 | `03` Step 9 / 15 | space、scope、visibility、fact append 关键变化有 actor / trace / time / source | 待 Step 6 | service + audit test | trace / audit evidence | 已覆盖 |
| NFR-CONV-008 | `03` Step 9 / 12 / 15 | manifestation 和 maintenance action 可追溯,并说明来源和既有 fact 范围 | 待 Step 6 | service + job test | trace / audit; report evidence | 已覆盖 |
| NFR-CONV-009 | `03` Step 11 / 13 | duplicate command / consumer / job rerun 不形成冲突 truth | 待 Step 6 | CI idempotency tests | test result; failure evidence | 已覆盖 |
| NFR-CONV-010 | `03` Step 10 / 11 / 13 | projection、search、cursor、reports、archive refs 不替代原始 fact | 待 Step 6 | CI job + query negative | failure / veto evidence | 已覆盖 |
| NFR-CONV-011 | `03` Step 15; `04` §12 | core ability success / failure 可在 reports 和 metrics 中观察 | 待 Step 6 | release gate | report evidence | 已覆盖 |
| NFR-CONV-012 | `03` Step 12 / 15; `04` §11 | dependency degraded、unauthorized read、redaction violation、conflict 有安全 evidence | 待 Step 6 | gate + operations-replay | failure / veto; report evidence | 已覆盖 |

### 7.4 覆盖状态汇总

| 覆盖对象 | 数量 | 覆盖状态 | 说明 |
|---|---:|---|---|
| 功能需求 | 8 | 全部覆盖 | FR001~005 为核心闭环; FR006~008 为外围增强但负向红线进 gate |
| 业务规则 | 21 | 全部覆盖 | 按不变量、禁止行为、显式变化、边界、治理和审计分组覆盖 |
| 非功能需求 | 12 | 全部覆盖 | 量化性能目标和真实生产依赖不作为 P0 空洞 |
| 一票否决项 | 8 | 全部覆盖 | 对应授权、数据归属、append-only、source isolation、redaction、证据路径和 fake-as-production |
| P1/P2 专项 | 若干 | 已挂起 | 真实 DB / broker / resolver / handoff、production-like 和 hot reload 不进入 P0 通过条件 |

### 7.5 未覆盖项清单

| 项 | 是否 P0 空洞 | 原因 | 后续处理 |
|---|---|---|---|
| 真实 DB / broker / resolver / handoff 产品行为 | 否 | 当前 P0 使用 in-memory / fake / controlled adapter 证明本仓语义 | P1 integration / staging-like 专项 |
| 生产级吞吐、延迟、容量数字 | 否 | 需求未锁定量化目标 | 后续非功能专项或验收补量化 |
| Chat UI、Workspace 聚合、Bridges 外部协议体验 | 否 | 属于下游子项目完整测试 | 对应子项目测试方案 |
| Runtime 推理质量、工具调用和 memory | 否 | Conversation 只消费结果性事实和拒绝 forbidden body | `L2-runtime` 测试方案 |
| 全局 trace store 和长期归档恢复主体 | 否 | 本仓只提供 trace / archive handoff ref 和 evidence | `L4-observability` / `L4-archive` |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §5 时摘录。

```markdown
## 5. 需求追溯与覆盖矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_05_traceability_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“FR 覆盖矩阵”“BR 覆盖矩阵”“NFR 覆盖矩阵”和“未覆盖项清单”小节，了解需求、规则、非功能要求如何追溯到设计章节、测试切口、自动化层级和证据类别。

本轮测试追溯覆盖 `FR-CONV-001~008`、`BR-CONV-001~021` 和 `NFR-CONV-001~012`。`FR-CONV-001~005` 是核心闭环能力，必须进入 P0-blocking 自动化覆盖；`FR-CONV-006~008` 是外围增强能力，但涉及授权、数据归属、derived read-only、redaction 和证据路径的负向场景必须进入 gate。所有 P0 需求均不得只依赖人工确认。

用例 ID 由 Step 6 生成，证据 ID 由 Step 13 生成。本章只固定追溯关系和证据类别，避免提前生成与后续用例矩阵、报告结构不一致的编号。
```

## 9. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续 Step 必须继续收口:

- Step 6 生成用例时必须逐项回指本步 FR / BR / NFR 追溯关系。
- Step 6 不得把 P1/P2 专项伪装为 P0 必须通过条件。
- Step 9 定义自动化门禁时必须确保所有 P0-blocking 和一票否决负向场景进入 gate。
- Step 13 生成证据编号时必须回填本步证据类别，且路径必须符合 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 覆盖矩阵无空洞 | 通过 | FR / BR / NFR 均已映射 |
| 未覆盖项已显式说明 | 通过 | 只剩 P1/P2 或后续专项，不影响 P0 |
| 用例 ID 未提前生成 | 通过 | 留给 Step 6 |
| 证据 ID 未提前生成 | 通过 | 留给 Step 13 |
| 可以进入 Step 6 | 通过 | 下一步设计测试场景与用例矩阵 |
