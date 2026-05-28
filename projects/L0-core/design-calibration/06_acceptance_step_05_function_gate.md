# Step 5. 定义功能验收门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-core/06-验收标准.md` §5

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §9 / §16 | F-001~F-007、核心闭环 / 外围增强能力、需求追溯矩阵 | 定义功能验收项来源 |
| `05-测试方案.md` §5 | 需求追溯与覆盖矩阵 | 将功能需求映射到 TC / EV 证据 |
| `05-测试方案.md` §6 | P0 测试用例设计 | 定义功能门禁的通过 / 失败判定依据 |
| `05-测试方案.md` §13 | EV 证据归档表 | 定义每条功能验收项必须引用的证据 |
| Step 2 验收范围 | P0/P1/P2 范围和下游只验接缝结论 | 控制本步不越界到 L0-bus、L0-sdk 或 L1 业务实现 |
| Step 4 进入 / 退出条件 | P0 证据齐备、一票否决、S/A 缺陷和三值结论要求 | 定义功能门禁失败对最终结论的影响 |

依赖的前序 Step：Step 1~4 已确认。

## 3. SOP 问题回答

1. 每个 P0 功能的通过条件是什么?

   回答：每个 P0 功能必须同时满足三个条件：对应功能需求的业务语义成立，`05-测试方案.md` 中映射的 P0 用例全部通过，关联 EV 证据可定位且字段完整。只写“功能可用”不构成通过。

2. 每个 P0 功能的失败条件是什么?

   回答：任一关联 P0 用例失败、P0 EV 证据缺失、功能结果与 F-001~F-007 语义不一致、成功路径缺少必要 audit / outbox / trace / snapshot 副作用，或失败路径伪成功，均视为该功能门禁失败。

3. 证据来自哪些测试用例或报告?

   回答：证据来自 `05-测试方案.md` 的 TC 与 EV，不在验收标准中重新定义测试用例。主要包括 `TC-SCOPE-*`、`TC-DTO-001`、`TC-CMD-*`、`TC-QUERY-*`、`TC-EVENT-001`、`TC-OUTBOX-*`、`TC-JOB-*`、`TC-AUDIT-001`、`TC-E2E-001`，以及 EV-UNIT-001、EV-SVC-001、EV-CONTRACT-001、EV-CONTRACT-002、EV-WORKER-001、EV-AUDIT-001、EV-TRACE-001、EV-E2E-001。

4. 哪些 P1 功能只做后置边界验收?

   回答：多语言 binding、样例仓、可视化、高级兼容报告、自动发布体验、完整 SDK developer experience、真实 L0-bus runtime、真实下游仓库联调都只做后置边界或风险记录。F-005~F-007 在需求层属于外围增强，但 `05-测试方案.md` 已把其最小实现切口纳入 P0，因此本步只验这些最小切口，不验高级增强体验。

5. 哪些功能失败会导致总体不通过?

   回答：F-001~F-004 任一失败直接导致总体“不通过”。F-005~F-007 的最小 P0 切口失败也会导致总体“不通过”，因为测试方案已将其作为 P0 证据输入。高级增强部分若未完成且不影响 P0 最小切口，可进入 Step 13 风险接受，不直接判定“不通过”。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §4 | 功能门禁仍围绕 `RegisterSharedRef`、primitive admission、bus/sdk consume base | 与新版 F-001~F-007 和共享契约来源仓闭环不一致 |
| `06-验收标准.md` §4 | 没有引用 `05-测试方案.md` 的 TC / EV ID | 验收裁决无法追溯到测试证据 |
| `06-验收标准.md` §4 | 没有区分核心闭环能力、外围增强最小切口和后置增强 | 容易把 P1/P2 高级体验误判为 P0 失败,或漏验已纳入 P0 的最小切口 |
| `06-验收标准.md` §4 | 只有“门禁条件 / 证据 / 结论”,缺少明确失败条件 | 无法支持“通过 / 有条件通过 / 不通过”三值裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能主轴 | shared primitive admission 场景 | F-001~F-007 功能需求 | 对齐新版需求文档 |
| 证据来源 | registry / trace / compare 等泛化描述 | 明确 TC ID 与 EV ID | 支撑可审计裁决 |
| 通过条件 | 功能成立的描述 | 需求语义 + P0 用例 + EV 证据三者同时成立 | 避免“功能可用”式验收 |
| 失败条件 | 未显式列出 | P0 用例失败、证据缺失、伪成功、副作用缺失均失败 | 支撑明确不通过 |
| P1/P2 处理 | 未区分 | 最小切口纳入 P0,高级增强进入风险接受 | 避免验收范围膨胀 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 按旧 primitive 场景继续验收 | 改动少 | 与新版 00~05 主链不一致 | 不采用 |
| B. 只按 F-001~F-004 验核心闭环,F-005~F-007 全部后移 | 核心范围更窄 | 与 05 已纳入 P0 的测试切口冲突 | 不采用 |
| C. F-001~F-004 作为核心 P0,F-005~F-007 的最小设计切口作为 P0,高级增强后移 | 既守住核心闭环,又尊重 05 证据设计 | 需要在文档中明确最小切口边界 | 采用 |
| D. 把真实 L0-bus / L0-sdk / L1 联调全部纳入功能验收 | 平台信心更强 | 越过 L0-core 仓边界,阻塞独立验收 | 不采用 |

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-FUNC-001 | F-001 共享契约范围管理 | P0 | 合法跨仓契约可进入 L0-core 范围;单仓私有实现和边界外职责被拒绝;拒绝不产生成功 truth / audit / outbox | `TC-SCOPE-001` 或 `TC-SCOPE-002` 失败;边界外对象被接受;拒绝路径留下成功副作用;EV 缺失 | `TC-SCOPE-001`、`TC-SCOPE-002`;EV-UNIT-001、EV-SVC-001、EV-SCOPE-001 |
| AC-FUNC-002 | F-002 跨仓契约语义表达 | P0 | Command / Query / Event / Job schema 可 roundtrip;必填字段、schema version、CloudEvent 基础字段和 trace context 稳定 | DTO / event / job schema 漂移;required 字段丢失;CloudEvent 字段不满足约束;EV 缺失 | `TC-DTO-001`、`TC-EVENT-001`、`TC-JOB-001`;EV-UNIT-001、EV-CONTRACT-001、EV-CONTRACT-002 |
| AC-FUNC-003 | F-003 契约演进兼容与追溯 | P0 | Draft -> InReview -> Published / Released 主线成立;gate fail 不发布;终态保护成立;兼容性、audit 和 trace 可追溯 | 非法发布成功;gate fail 被发布;Retired 被修改成功;兼容性或审计追溯缺失;EV 缺失 | `TC-CMD-003`、`TC-CMD-004`、`TC-CMD-005`、`TC-CMD-006`、`TC-AUDIT-001`;EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-AUDIT-001、EV-TRACE-001 |
| AC-FUNC-004 | F-004 下游消费与派生基础 | P0 | release snapshot 可派生且重跑幂等;定义查询与 package view 可用;outbox 事实边界可追溯且可恢复 | snapshot 重复或 fingerprint 不稳定;查询返回 stale 却不显式标记;outbox 缺失或不可恢复;EV 缺失 | `TC-JOB-002`、`TC-QUERY-001`、`TC-QUERY-002`、`TC-QUERY-007`、`TC-OUTBOX-001`、`TC-OUTBOX-002`;EV-WORKER-001、EV-SVC-001、EV-INT-001、EV-CONTRACT-002 |
| AC-FUNC-005 | F-005 契约检查与派生辅助的最小切口 | P0-min | validate、derive snapshot、rebuild index、recalculate fingerprint、publish fact job 的 P0 job 行为成立;失败保留可诊断证据 | job 成功 / 失败状态错误;重复执行不幂等;source missing 被伪成功;fact 未进入 outbox;EV 缺失 | `TC-JOB-001`、`TC-JOB-002`、`TC-JOB-003`、`TC-JOB-004`、`TC-JOB-005`;EV-WORKER-001、EV-CONTRACT-002 |
| AC-FUNC-006 | F-006 契约追溯查看的最小切口 | P0-min | trace query 能还原契约演进;projection stale 显式暴露;rebuild 后 watermark 前进;审计记录字段完整 | trace 与 audit / evolution 不一致;stale projection 被当作 current;rebuild 后 watermark 倒退;EV 缺失 | `TC-QUERY-002`、`TC-QUERY-003`、`TC-JOB-003`、`TC-AUDIT-001`;EV-SVC-001、EV-WORKER-001、EV-AUDIT-001、EV-TRACE-001 |
| AC-FUNC-007 | F-007 契约接入说明与示例的最小切口 | P0-min | contract package view 和 guide sample 查询可用;返回内容能表达消费入口;不得包含业务正文或外部正文全文 | package / sample view 缺失;字段不足以指导消费;返回禁止正文;EV 缺失 | `TC-QUERY-007`、`TC-QUERY-008`;EV-SVC-001、EV-CONTRACT-001、EV-SEC-001 |
| AC-FUNC-008 | 最小功能闭环 | P0 | draft -> review -> publish -> snapshot -> query -> fact -> relay boundary 的最小闭环成立,且 evidence artifact 可定位 | 任一主链步骤失败;receipt、snapshot、trace 或 outbox evidence 缺失;release gate 失败 | `TC-E2E-001`;EV-E2E-001、EV-TRACE-001、EV-CONTRACT-002 |

### 7.2 P1 / P2 后置边界表

| 后置项 | 当前验收口径 | 失败对本轮结论的影响 |
|---|---|---|
| 多语言 binding | 只验 schema / DTO 稳定和可派生来源,不验完整语言生成体验 | 不直接导致 P0 不通过;进入风险接受 |
| 样例仓 / 可视化 | 只验 guide sample / package view 最小查询切口 | 高级体验缺失不直接导致 P0 不通过 |
| 高级兼容报告 | 只验 P0 compatibility / audit / trace 证据 | 高级报告后移到风险或后续增强 |
| 自动发布体验 | 只验 release baseline、snapshot、outbox boundary | 不验外部包发布中心 |
| 真实 L0-bus runtime | 只验 CloudEvent / outbox / relay boundary | 真实投递能力进入相邻仓验收或残余风险 |
| 真实 L0-sdk developer experience | 只验可消费契约来源和 schema 稳定 | SDK 高层封装体验进入 L0-sdk 验收 |
| 真实下游仓业务联调 | 只验 L0-core 不吸收业务语义且输出基线可消费 | L1 业务状态机进入对应 L1 仓验收 |

### 7.3 功能失败对最终结论的影响

| 情况 | 结论影响 |
|---|---|
| AC-FUNC-001~AC-FUNC-004 任一失败 | 不通过 |
| AC-FUNC-005~AC-FUNC-007 的最小 P0 切口任一失败 | 不通过 |
| AC-FUNC-008 最小闭环失败 | 不通过 |
| P0 用例通过但关联 EV 证据缺失 | 不通过或送验不成立 |
| P0 通过,高级增强未完成但风险可接受 | 有条件通过 |
| P0 通过,无阻断缺陷且风险均关闭 / 接受 | 可通过 |

## 8. 回填草稿

```md
## 5. 功能验收门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“功能验收门禁表”“P1 / P2 后置边界表”和“功能失败对最终结论的影响”小节,了解功能验收如何从 F-001~F-007 与 05 的 TC / EV 证据收敛。

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-FUNC-001 | F-001 共享契约范围管理 | P0 | 合法跨仓契约可进入 L0-core 范围;边界外对象被拒绝 | 边界外对象被接受;拒绝路径留下成功副作用;EV 缺失 | `TC-SCOPE-001`、`TC-SCOPE-002`;EV-UNIT-001、EV-SVC-001、EV-SCOPE-001 |
| AC-FUNC-002 | F-002 跨仓契约语义表达 | P0 | Command / Query / Event / Job schema 与 CloudEvent 基础字段稳定 | schema 漂移;required 字段丢失;CloudEvent 字段不满足约束;EV 缺失 | `TC-DTO-001`、`TC-EVENT-001`、`TC-JOB-001`;EV-UNIT-001、EV-CONTRACT-001、EV-CONTRACT-002 |
| AC-FUNC-003 | F-003 契约演进兼容与追溯 | P0 | 发布主线、gate fail、终态保护、兼容性和 audit trace 成立 | 非法发布成功;终态被修改;兼容性或追溯缺失;EV 缺失 | `TC-CMD-003`~`TC-CMD-006`、`TC-AUDIT-001`;EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-AUDIT-001 |
| AC-FUNC-004 | F-004 下游消费与派生基础 | P0 | snapshot、查询、package view 和 outbox 边界成立 | snapshot 不稳定;stale 不显式;outbox 不可恢复;EV 缺失 | `TC-JOB-002`、`TC-QUERY-001`、`TC-QUERY-002`、`TC-QUERY-007`、`TC-OUTBOX-*`;EV-WORKER-001、EV-SVC-001、EV-CONTRACT-002 |
| AC-FUNC-005 | F-005 契约检查与派生辅助的最小切口 | P0-min | P0 job 行为成立,失败保留可诊断证据 | job 状态错误;不幂等;source missing 伪成功;EV 缺失 | `TC-JOB-001`~`TC-JOB-005`;EV-WORKER-001 |
| AC-FUNC-006 | F-006 契约追溯查看的最小切口 | P0-min | trace query、stale projection、rebuild、audit 字段成立 | trace 不一致;stale 被当作 current;watermark 倒退;EV 缺失 | `TC-QUERY-002`、`TC-QUERY-003`、`TC-JOB-003`、`TC-AUDIT-001`;EV-SVC-001、EV-AUDIT-001、EV-TRACE-001 |
| AC-FUNC-007 | F-007 契约接入说明与示例的最小切口 | P0-min | package view 和 guide sample 查询可用,且不含禁止正文 | view 缺失;字段不足;返回禁止正文;EV 缺失 | `TC-QUERY-007`、`TC-QUERY-008`;EV-SVC-001、EV-CONTRACT-001、EV-SEC-001 |
| AC-FUNC-008 | 最小功能闭环 | P0 | draft -> review -> publish -> snapshot -> query -> fact -> relay boundary 成立 | 任一主链步骤失败或 evidence artifact 缺失 | `TC-E2E-001`;EV-E2E-001 |
```

## 9. 待确认事项

- 是否接受 F-005~F-007 的“最小设计切口”作为 P0-min,高级增强体验后移到风险接受。
- 是否接受 AC-FUNC-008 作为功能闭环总门禁,而不是只依赖单项 AC-FUNC-001~007。
- 是否接受功能验收只引用 `05-测试方案.md` 的 TC / EV,不在 06 中重新定义测试用例。

## 10. 进入下一步条件

- [x] P0 功能都有可裁决门禁。
- [x] 每条功能门禁都有通过条件、失败条件和证据来源。
- [x] F-005~F-007 的最小 P0 切口与高级增强边界已区分。
- [x] 可以进入 Step 6 定义数据边界与架构红线验收。
