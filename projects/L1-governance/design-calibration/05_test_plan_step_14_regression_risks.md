# Step 14. 定义回归策略与残余风险

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节: `05-测试方案.md` §14 回归策略与残余风险

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义回归策略与残余风险 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验;Step 12 进出准则;Step 13 证据归档 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

定义 L1-governance 在设计、实现、配置、测试和证据发生变化时应触发哪些最小回归、何时必须全量回归,以及哪些暂不覆盖的 P1/P2 / future / candidate 风险必须进入残余风险记录。

本 Step 只回答:

- 哪些变更触发最小回归。
- 哪些变更触发全量回归。
- 哪些 residual 可以不阻断 P0,但必须记录接受人或待确认项。
- 哪些风险必须转入新版 `06-验收标准.md`。
- 回归结果如何与 Step 13 的 artifact/report/evidence 归档衔接。

本 Step 不执行回归,不填写真实缺陷状态,不裁决 release pass / fail,不替代新版 `06-验收标准.md` 的风险接受流程。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-* 用例族和自动化候选 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 PR / main / nightly / release suite 和 blocking 级别 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 redaction、dependency、performance sample、P1/P2 边界 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供缺陷复验矩阵和防回归新增规则 |
| `05_test_plan_step_12_entry_exit.md` | 已完成 | 提供进入 / 退出阻断准则和 residual 处理 |
| `05_test_plan_step_13_evidence.md` | 已完成 | 提供 EV-GOV 证据族、artifact/report 归档和 review 报告 |
| `测试方案书写规范.md` §5.14 | 标准输入 | 提供回归触发表和残余风险表格式 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些变更触发最小回归? | contract/domain/application/query/consumer/outbox/job/config/redaction/dependency/report 任一局部变更,至少触发对应 suite、相邻 suite 和相关 check。见 §8.1。 |
| 哪些变更触发全量回归? | 修改 truth object、public protocol、state matrix、UoW/idempotency/outbox/report 语义、redaction/dependency gate、P0 profile、release evidence 结构或任何 S 级缺陷修复时,必须触发全量 P0 regression。 |
| 哪些风险暂不覆盖? | P1 real-like selected-run、真实 DB/bus/search/object storage/external GRC vendor 行为、production-like capacity、硬性能 P95/SLO、高级 DSL / simulation / dashboard、长期归档保留天数等暂不作为 P0 阻断。 |
| 谁接受残余风险? | P0 不可接受风险必须修复;P1/P2 residual 由验收负责人、架构负责人或测试负责人在新版 `06` / `reports/acceptance/risk-acceptance.md` 中确认。当前若未定具体人,列为待确认项。 |
| 哪些风险必须转入验收标准? | P1 selected-run 是否强制、性能阈值是否硬化、VETO 正式 ID、证据保留期、真实 adapter 验收边界、production-like/capacity 验收条件必须转入新版 `06` 或后续基线。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 用例族完整,但变更后回归触发未定义 | 本 Step 按变更类型映射 suite |
| Step 9 | suite/gate 已定义,但何时重跑未定义 | 本 Step 固定最小 / 全量回归条件 |
| Step 10 | P1/P2 和性能 candidate 已说明,但 residual 表未汇总 | 本 Step 汇总残余风险 |
| Step 11 | 缺陷复验有矩阵,但未覆盖非缺陷变更回归 | 本 Step 补设计 / 配置 / 证据变更回归 |
| Step 13 | 证据归档已定义,但回归证据留存未说明 | 本 Step 要求每次回归 run 都按 Step 13 归档 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 回归触发 | 只有 suite 和缺陷复验 | 变更类型到最小 / 全量回归矩阵 | 实施计划可直接引用 |
| 残余风险 | 分散在 scope、nonfunctional、entry/exit、evidence | 统一 residual 表 | 便于新版 `06` 消费 |
| P1/P2 | 不阻断 P0,但缺接受路径 | 指定接受人角色或待确认项 | 防止风险被隐藏 |
| 证据 | 只定义归档结构 | 回归 run 也必须按 Step 13 归档 | 缺陷复验和回归可审计 |
| 性能 | candidate only | 明确是否转入验收标准 | 避免实现侧自行硬化阈值 |

## 7. 回归策略设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否所有变更都全量回归 | A. 全量;B. 风险分层最小回归 + 触发全量 | 采用 B。保持效率,但红线变更强制全量 |
| 回归是否只跑失败用例 | A. 只跑失败用例;B. 失败用例 + family + suite + check | 采用 B。P0 语义常跨模块 |
| P1 unavailable 是否算失败 | A. 算 P0 failed;B. 记录 residual | 采用 B。P1 不阻断 P0 |
| 性能 candidate 是否入回归阈值 | A. 入阈值;B. 只保留 sample/trend | 采用 B。当前无正式基线 |
| 证据结构变更是否触发业务回归 | A. 不触发;B. 触发 report audit + affected suite sample | 采用 B。证据真实性是 P0 红线 |

## 8. 结构化中间产物

### 8.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| requirements / AC / VF 变更 | 受影响 TC family + `release-main-smoke` + traceability review | 任一 C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV 语义变更 | 设计负责人 + 测试负责人 |
| architecture / dependency boundary 变更 | `dependency-boundary`;affected suite;`report-generation-audit` | 编译依赖方向、sibling boundary、data ownership、truth boundary 变化 | 架构负责人 |
| public contracts / DTO / ref / reason 变更 | `contract-domain-fast`;affected handler/worker/job suite | public protocol schema、operation digest、metadata、schema version 变更 | contracts 负责人 |
| domain object invariant / policy 变更 | `contract-domain-fast`;affected service family | truth object field、factory、policy、formal state enum 变化 | domain 负责人 |
| state matrix 变更 | `contract-domain-fast`;`service-flow-fast`;affected illegal transition tests | terminal / legal / illegal transition 变化 | domain 负责人 |
| command accepted flow 变更 | affected TC-GOV-CMD-*;`service-flow-fast`;outbox/stale/result assertions | UoW order、trace/audit/history/outbox/result/idempotency 语义变化 | application 负责人 |
| query read model 变更 | affected TC-GOV-QUERY-*;`service-flow-fast`;write-audit | query visibility/degraded/no-write 语义变化 | application 负责人 |
| inbound consumer 变更 | affected TC-GOV-CONSUMER-*;`entry-worker-job`;redaction if payload/log changed | event dedup、unsupported、snapshot/reference/stale/receipt 语义变化 | worker 负责人 |
| outbound event / publisher 变更 | affected TC-GOV-OUTBOX-*;`operations-replay-core`;topic map check | payload snapshot、topic map、publication state、failure marker 变化 | worker 负责人 |
| operations job 变更 | affected TC-GOV-JOB-*;`operations-replay-core`;`report-generation-audit` | job idempotency/report replay/no truth repair/handoff/export marker 变化 | jobs 负责人 |
| idempotency / UoW / repository 变更 | affected TC-GOV-IDEMP-*;`infra-runtime-fake`;`service-flow-fast`;`operations-replay-core` | commit unknown、rollback、version、stored result/report、race guard 变化 | infra 负责人 |
| config schema / profile 变更 | `config-redline`;affected runtime builder suite;release config check | P0 profile、source priority、adapter kind、topic completeness、fail-fast 变化 | config 负责人 |
| redaction / observability 变更 | `redaction-boundary`;affected suite;release redaction check | forbidden fields、log/metric/audit/report scan scope 变化 | observability 负责人 |
| report / evidence scripts 变更 | `report-generation-audit`;affected suite sample;`check_no_static_evidence.sh` | evidence index schema、acceptance draft、artifact/report pairing 变化 | test tooling 负责人 |
| release gate script 变更 | changed release suite + all release checks | `run_release_gate.sh` 业务 smoke 或 blocking 分类变化 | release 负责人 |
| S 级缺陷修复 | 原失败 TC + same family + related suite + release check | 任一 VF / redaction / dependency / evidence integrity / truth boundary 修复 | 缺陷 owner + 测试负责人 |

### 8.2 全量 P0 回归集

全量 P0 regression 至少包含:

- `contract-domain-fast`
- `service-flow-fast`
- `config-redline`
- `dependency-boundary`
- `infra-runtime-fake`
- `entry-worker-job`
- `operations-replay-core`
- `redaction-boundary`
- `report-generation-audit`
- `release-main-smoke`
- release config / redaction / dependency / report audit checks
- Step 13 evidence index generation and review-ready acceptance draft

触发全量 P0 regression 的条件:

- 任何 VF-GOV-001~010 相关修复或变更。
- `03-详细设计.md` 对 truth object、protocol、flow、state matrix、UoW、idempotency、outbox、job report、redaction、config、observability 的正式口径变更。
- `04-配置设计.md` 对 P0 profile、adapter availability、source priority、topic map、fail-fast / degraded 规则变更。
- 任一 S 级缺陷修复。
- 任一 release gate、evidence index、VETO checklist 初稿、artifact/report pairing 逻辑变更。

### 8.3 最小回归选择规则

| 规则 | 说明 |
|---|---|
| 原失败 TC 必跑 | 缺陷修复或设计变更影响的原始用例必须回归 |
| 同 family 必跑 | 同一 TC-GOV family 下的正向、负向、duplicate、no-write 或 partial case 必须覆盖代表项 |
| 相邻 suite 必跑 | contract/domain 变更要带 service;service 变更要带 outbox/report;job 变更要带 report audit |
| 红线 check 必跑 | redaction、dependency、evidence integrity、config fail-fast 相关变更必须跑对应 release check |
| 证据必须归档 | 每次回归 run 必须按 Step 13 产出 raw artifact、run report 和 evidence index |
| 不能用 P1 代替 P0 | P1 selected-run 不能替代 P0 fake/controlled regression |

### 8.4 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| P1 real-like selected-run 不作为 P0 阻断 | 真实产品 / 环境未锁定 | 不能证明真实 adapter 端到端行为 | P0 使用 fake/controlled;P1 available 时 selected-run;unavailable 进入 residual | 验收负责人待确认 |
| 真实 DB / bus / search / object storage 行为未覆盖 | 产品选型未锁定 | 不能证明具体产品性能和故障模式 | P0 证明 repository/port 语义;产品绑定后补 P1/P2 | 架构负责人待确认 |
| external GRC vendor 深度行为未覆盖 | 外部系统非 P0 依赖 | 不能证明 vendor API 兼容性 | P0 disabled/controlled export;真实 vendor 走 P1 selected-run | 验收负责人待确认 |
| production-like capacity 未覆盖 | 无正式容量模型和部署基线 | 不能证明高并发 / 长时间运行容量 | 只保留 duration/count sample;容量基线后补 P2 | 架构负责人待确认 |
| 旧 P95 / SLA 数字未硬化 | 当前需求声明为候选目标 | 不能按 numeric threshold 裁决 pass | Step 10/13 保留 sample/trend;若硬化需新版 `06` 定义 | 验收负责人待确认 |
| 高级 Policy DSL / simulation 未覆盖 | 当前 P0 只证明基础治理语义 | 不能证明复杂策略表达能力 | 作为 future capability;不得阻断核心 command/query/job | 产品负责人待确认 |
| 高级 dashboard / analytics 未覆盖 | 当前 P0 只证明基础 read model / query | 不能证明复杂看板体验 | 基础 query/dashboard projection P0;高级报表 P2 | 产品负责人待确认 |
| 证据保留天数未固定 | 属于归档运维策略 | 不能证明长期审计保留满足外部要求 | Step 13 要求保留到验收和复验关闭;具体天数进新版 `06` 或运维标准 | 验收负责人待确认 |
| acceptance VETO 正式编号未固定 | 新版 `06` 尚未重建 | 当前只能回指 AC/VF 和 evidence integrity | Step 13 预留 VETO refs;新版 `06` 固定 | 验收负责人待确认 |
| P2 production security / compliance certification 未覆盖 | 非当前 L1 P0 范围 | 不能证明外部认证要求 | 记录为后续认证 / 审计项目输入 | 合规负责人待确认 |

### 8.5 不可风险接受项

| 项 | 处理 |
|---|---|
| VF-GOV-001~010 命中 | 必须修复并全量 P0 regression |
| redaction leak | 必须修复;复跑 redaction-boundary and release redaction check |
| non-core sibling compile dependency | 必须修复;复跑 dependency-boundary |
| query/job 反写真相 | 必须修复;复跑 affected suite + operations replay |
| accepted truth 缺 trace/audit/outbox/result | 必须修复;复跑 service-flow and release smoke |
| evidence index 静态造证据 | 必须修复;复跑 report-generation-audit |
| raw artifact/report pairing 缺失 | 必须修复;不得送验 |
| P0 profile unavailable but marked passed | 必须修复;不得风险接受 |

### 8.6 必须转入新版 `06-验收标准.md` 的事项

| 事项 | 转入原因 | 建议 `06` 收口 |
|---|---|---|
| VETO 正式 ID 和通过 / 不通过裁决 | `05` 只定义测试证据 | 建立 EV / AC / VETO 裁决矩阵 |
| P1 selected-run 是否强制 | 当前非 P0 | 明确 release candidate 是否需要 selected-run |
| performance hard threshold | 当前只有 sample/trend | 若要 pass/fail,定义负载模型、阈值和环境 |
| evidence retention period | 当前不固定天数 | 定义保留天数、归档介质和责任人 |
| risk acceptance approval role | 当前用角色待确认 | 固定接受人角色和签署条件 |
| production-like / capacity gate | 当前 P2 | 明确何时升级为 P0/P1/P2 gate |
| real adapter certification | 当前 product-neutral | 明确产品绑定后的验收追加项 |

### 8.7 回归证据归档规则

| 回归类型 | 证据要求 |
|---|---|
| 最小回归 | 按 Step 13 产出 run artifact、suite report、evidence index;必须标记 regression scope |
| 全量 P0 回归 | 产出完整 `reports/runs/<run_id>`、acceptance draft、redaction/dependency/report audit |
| 缺陷复验 | 记录 failed run、fixed run、原 TC、复验 suite、是否新增防回归测试 |
| residual review | 产出 `reports/acceptance/risk-acceptance.md` 和 `reports/review/*` 补充 |
| P1 selected-run unavailable | 产出 unavailable marker,不得计入 P0 passed evidence |

### 8.8 回归停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 变更类型是否均有最小回归集 | 通过 | §8.1 |
| 全量 P0 回归触发是否明确 | 通过 | §8.2 |
| P0 红线是否不可风险接受 | 通过 | §8.5 |
| residual 是否有接受人或待确认项 | 通过 | §8.4 |
| 需要进入 `06` 的事项是否列出 | 通过 | §8.6 |
| 回归证据是否承接 Step 13 | 通过 | §8.7 |

### 8.9 跨回归 / 残余风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在无回归触发的 P0 变更 | 通过 | 所有 P0 面已映射 |
| 是否把 P1/P2 unavailable 写成 P0 pass | 通过 | 只作为 residual |
| 是否把性能 candidate 写成硬阈值 | 通过 | 只保留 sample/trend |
| 是否有 residual 无接受人 | 通过 | 当前均列角色待确认 |
| 是否存在可接受 P0 redline | 通过 | §8.5 全部不可接受 |
| 是否可被实施计划引用 | 通过 | §8.1 / §8.2 可直接转为 regression gates |
| 是否可被新版 `06` 引用 | 通过 | §8.4 / §8.6 明确转入事项 |

## 9. 对上游设计的影响判定

| 回归 / 风险结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 最小 / 全量回归策略 | 否 | 测试方案执行策略 | 可回填 `05` |
| P0 redline 不可风险接受 | 否 | 承接 `00` VF 和 Step 11 | 可回填 `05` |
| P1/P2 residual 不阻断 P0 | 否 | 范围边界 | Step 2 / 10 已一致 |
| 验收角色和 VETO 编号未固定 | 是 | 验收标准闭口 | 新版 `06` 必须收口 |
| 若性能 candidate 升级为 hard threshold | 是 | 范围 / 验收基线变更 | 需回写 `05/06/07` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“回归触发表”“全量 P0 回归集”“最小回归选择规则”“残余风险表”“不可风险接受项”和“必须转入新版 `06-验收标准.md` 的事项”小节,了解变更如何触发回归以及 P1/P2 风险如何进入验收风险接受。

正式 `05-测试方案.md` §14 应回填:

- 回归策略按变更风险分层。局部变更触发最小回归集;truth、protocol、state、UoW/idempotency、outbox/job、config、redaction、dependency、evidence 或 S 级缺陷修复触发全量 P0 回归。
- 全量 P0 回归至少包含 contract-domain-fast、service-flow-fast、config-redline、dependency-boundary、infra-runtime-fake、entry-worker-job、operations-replay-core、redaction-boundary、report-generation-audit、release-main-smoke 和 release checks。
- 每次回归都必须按 Step 13 产出 raw artifact、run report 和 evidence index。
- VF-GOV、redaction、dependency、query/job no truth repair、accepted trace/audit/outbox/result、evidence integrity、P0 profile unavailable 等 P0 红线不得风险接受。
- P1 real-like selected-run、真实产品 adapter、production-like capacity、旧 P95/SLA、advanced DSL/dashboard 和长期归档策略属于 residual,不阻断 P0,但必须在新版 `06` 或 `reports/acceptance/risk-acceptance.md` 中明确接受人和触发条件。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 各 residual 的实际接受人姓名 | 影响风险接受签署 | 当前按角色列为待确认 |
| 新版 `06` 的 VETO ID 和裁决矩阵 | 影响验收引用 | Step 14 只列转入事项 |
| performance threshold 是否硬化 | 影响 P0/P1/P2 范围 | 当前不硬化 |
| P1 selected-run 是否在某 release 强制 | 影响退出准则和 gate | 当前不阻断 P0 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 回归触发表可被实施计划引用 | 通过 | §8.1 / §8.2 |
| 残余风险均有接受人或待确认项 | 通过 | §8.4 |
| 不可接受 P0 红线明确 | 通过 | §8.5 |
| 转入新版 `06` 的事项明确 | 通过 | §8.6 |
| 可进入 Step 15 | 通过 | 下一步装配正式 `05-测试方案.md`;进入前等待用户审查 |
