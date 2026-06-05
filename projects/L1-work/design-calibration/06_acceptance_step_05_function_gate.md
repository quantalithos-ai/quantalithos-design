# Step 5. 定义功能验收门禁

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 5 中间产物。
> 本步只把 P0 核心闭环和功能需求转成可裁决门禁。
> 数据边界、架构红线、接口事件、状态一致性、非功能、证据红线和一票否决分别留到后续 Step。

## 1. Step 状态

- 状态: `[~] 已生成,待用户审核`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
- 回填章节: `projects/L1-work/06-验收标准.md` §5 功能验收门禁
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §7 | C-1~C-5 核心能力闭环 | 形成功能门禁的最高层目标 |
| `00-需求文档.md` §9 | `FR-WORK-001`~`008` 和外围增强 `FR-WORK-E01`~`E05` | 定义 P0 / P1 / P2 功能范围 |
| `00-需求文档.md` §14 | `AC-WORK-001`~`013` | 功能验收项来源 |
| `02-概要设计.md` §5~§8 | 主要组成部分、关键对象、接口骨架和处理流 | 功能通过 / 失败条件的概要依据 |
| `03-详细设计.md` §6~§9 / §15 | 对象契约、协议契约、函数流和最小验证清单 | 功能门禁必须使用的正式设计契约 |
| `05-测试方案.md` §5 / §6 / §13 | `TC-WORK-*`、`EV-WORK-*`、证据路径 | 功能门禁证据来源 |

已确认结论:

```text
功能验收只裁决核心能力闭环和 FR-WORK-001~008。
AC-WORK-001~005 是核心闭环门禁,AC-WORK-006~013 是功能能力门禁。
FR-WORK-E01~E05 是外围增强,只做后置边界验收,不进入 P0 功能硬门禁。
```

## 3. SOP 问题回答

### 3.1 每个 P0 功能的通过条件是什么?

每个 P0 功能必须同时满足三类通过条件:

1. 对应核心能力或功能需求在正式设计契约中有可实现入口。
2. 正向和关键负向测试证据均存在。
3. 证据能从 `reports/runs/<run_id>/evidence-index.md` 回指 `TC-WORK-*`、`AC-WORK-*` 和设计契约。

| P0 功能 | 对应 AC | 通过条件摘要 |
|---|---|---|
| 项目主语成立 | `AC-WORK-001` / `006` | Project 能显式创建、引用、追溯,并与初始 Backlog / trace / audit / outbox 在正式写边界成立 |
| 项目内成员承担表达 | `AC-WORK-002` / `007` | ProjectMember 能表达 GlobalMember 在项目内承担,保存安全 snapshot / ref,不接管 identity truth |
| 正式工作全集收束 | `AC-WORK-003` / `008` | Backlog / WorkItem / child WorkItem 能形成正式工作全集,并拒绝边界外输入直接污染 |
| 正式拆分与升级边界 | `AC-WORK-003` / `009` | 协作级 child WorkItem 和 promote accept / reject 显式发生,不吸收 runtime / ImplementationPlan 正文 |
| 依赖与阻塞表达 | `AC-WORK-010` | dependency / blocker 能连接正式 Work 对象,表达解除依据和影响解释 |
| Iteration 承诺子集形成 | `AC-WORK-004` / `011` | Iteration 能从正式工作全集形成承诺子集,并保持与 Backlog / process planning 边界 |
| 项目工作事实消费与追溯 | `AC-WORK-005` / `012` | 授权 query 能读取事实、trace、projection surface,且 query no-write |
| 项目工作事实维护与对账 | `AC-WORK-013` | operations job 能维护派生 / outbox / reference / handoff / reconciliation,且不改变业务 truth |

### 3.2 每个 P0 功能的失败条件是什么?

任一 P0 功能出现以下情况即视为该功能门禁失败:

| 失败类型 | 说明 |
|---|---|
| 主线不可用 | 对应 command / query / job happy path 无法形成正式结果 |
| 关键负向缺失 | 隐式创建、越界输入、非法 parent、cycle、missing evidence、query no-write 等负向无法证明 |
| 证据缺失 | 缺少对应 `TC-WORK-*` 或 `EV-WORK-*`,或 evidence index 不可追溯 |
| 设计契约偏离 | 使用旧对象名、旧状态名、临时 DTO 或未确认字段通过测试 |
| 副作用错误 | accepted path 缺 trace / audit / outbox / projection marker,或 reject path 写入 truth |
| 外围增强污染 P0 | 高级看板、自动建议、容量趋势等非 P0 能力反向改变核心 truth |

### 3.3 证据来自哪些测试用例或报告?

功能门禁主要使用 `05-测试方案.md` §5 / §6 / §13 中的用例和证据。

| 功能域 | 用例族 | 证据族 | 报告入口 |
|---|---|---|---|
| Project / core | `TC-WORK-CORE-001`~`004` | `EV-WORK-CORE-001`~`004` | `reports/runs/<run_id>/evidence-index.md` |
| ProjectMember | `TC-WORK-MEMBER-001`~`004` | `EV-WORK-MEMBER-001`~`004` | `reports/runs/<run_id>/evidence-index.md` |
| Formal work | `TC-WORK-FORMAL-001`~`005` | `EV-WORK-FORMAL-001`~`005` | `reports/runs/<run_id>/evidence-index.md` |
| Promote | `TC-WORK-PROMOTE-001`~`005` | `EV-WORK-PROMOTE-001`~`005` | `reports/runs/<run_id>/evidence-index.md` |
| Dependency / blocker | `TC-WORK-DEP-001`~`005` | `EV-WORK-DEP-001`~`005` | `reports/runs/<run_id>/evidence-index.md` |
| Iteration | `TC-WORK-ITER-001`~`005` | `EV-WORK-ITER-001`~`005` | `reports/runs/<run_id>/evidence-index.md` |
| Query / trace / projection surface | `TC-WORK-QUERY-001`~`008` | `EV-WORK-QUERY-001`~`008` | `reports/runs/<run_id>/evidence-index.md` |
| Operations maintenance | `TC-WORK-OPS-001`~`006` | `EV-WORK-OPS-001`~`006` | `reports/runs/<run_id>/evidence-index.md` |

### 3.4 哪些 P1 功能只做后置边界验收?

以下外围增强不进入 P0 功能硬门禁,只在后续风险 / 演进中验证不污染 P0 truth。

| 功能 | 当前口径 | 后置边界 |
|---|---|---|
| `FR-WORK-E01` 高级看板与多视图消费 | P1/P2 | 只能消费 Work truth 派生结果,不得形成新 truth |
| `FR-WORK-E02` 自动化维护建议 | P1/P2 | 只能建议,不得直接修改业务 truth |
| `FR-WORK-E03` 容量趋势与负载风险提示 | P1/P2 | 只作分析,不得改变 ProjectMember / Iteration truth |
| `FR-WORK-E04` 项目内工具能力调整协同 | P1/P2 | 只引用 governance / method 定义,不得由 Work 拥有决策正文 |
| `FR-WORK-E05` 跨项目依赖理解 | P1/P2 | 不阻塞单项目 Work 闭环,不得污染单项目 truth |

### 3.5 哪些功能失败会导致总体不通过?

以下功能失败会导致总体不通过;若同时触发 `VF-WORK-*` 或 release redline,则在 Step 11 进入一票否决。

| 功能失败 | 总体影响 |
|---|---|
| C-1~C-5 任一核心闭环不能成立 | 不通过;可能触发 `VF-WORK-001` |
| Project / ProjectMember / Backlog / WorkItem / Iteration happy path 无法成立 | 不通过 |
| Formal work 被个人步骤、对话建议或 runtime step 污染 | 不通过;可能触发 `VF-WORK-002` / `VF-WORK-005` |
| Query / projection / maintenance 反写真相 | 不通过;可能触发 `VF-WORK-006` |
| 关键功能缺少 P0 `EV-WORK-*` 证据 | 不通过或无法裁决 |
| 功能测试通过但使用未确认设计字段 / 状态 / DTO | 不通过;需回到设计或实现修正 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` §4 | 功能门禁按旧场景写,没有稳定 `AC-WORK-*` / `TC-WORK-*` / `EV-WORK-*` 映射 | 无法复核功能裁决 | 重建功能门禁表 |
| 旧 `06-验收标准.md` §4 | CreateProject、CreateWorkItem、Promote 等混在单表里,未区分核心闭环和功能能力 | 无法判断失败影响 | 按 `AC-WORK-001`~`013` 拆门禁 |
| 旧 `06-验收标准.md` §4 | 证据写成 API 响应 / DB 记录 / 测试报告等泛化入口 | 无法定位具体 run 证据 | 改为 `EV-WORK-*` 和 report path |
| 旧 `06-验收标准.md` | 外围增强和功能主线边界不清 | 容易把高级看板、容量趋势、自动建议写成 P0 | 本步明确 P1/P2 后置边界 |
| 当前正式 `05` | 已有用例和证据族 | 可作为功能门禁证据来源 | 本步引用,不重写用例 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能验收对象 | 旧功能场景表 | `AC-WORK-001`~`013` + `FR-WORK-001`~`008` | 对齐需求验收项 |
| 证据来源 | 泛化测试报告 | `TC-WORK-*` / `EV-WORK-*` / `reports/runs/<run_id>/evidence-index.md` | 支撑复核 |
| 失败条件 | 未系统定义 | 明确主线不可用、负向缺失、证据缺失、契约偏离、副作用错误 | 支持不通过裁决 |
| 外围增强 | 未明确 | `FR-WORK-E01`~`E05` 只做 P1/P2 后置边界 | 防止范围膨胀 |
| 与后续 Step 边界 | 功能、红线、非功能混写 | 本步只写功能门禁,红线 / 非功能 / 一票否决后续收口 | 保持 Step 边界 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 `05` 用例族直接写功能门禁 | 证据映射直接 | 用例族包含规则、红线和非功能,容易混淆 Step 边界 | 不采用 |
| 方案 B: 按 `AC-WORK-001`~`013` 写功能门禁,再绑定 `TC / EV` | 裁决对象稳定,证据可复核 | 部分用例会在后续红线 / 非功能 Step 复用 | 采用 |
| 方案 C: 按旧 `06` 场景表继续改 | 改动少 | 缺少新版 AC / EV 映射,旧性能和旧主线残留 | 不采用 |

推荐方案 B。

原因:

- 验收标准应以验收项为主轴,测试用例只是证据。
- `AC-WORK-001`~`013` 已覆盖核心闭环和 P0 功能能力,适合本步范围。
- 同一个证据可以服务多个 Step,但本步只解释其功能裁决含义。

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| `AC-WORK-001` | 项目主语成立 | P0 | Project 显式创建、引用和追溯成立;不退化为 conversation topic、ProcessInstance、workspace view 或 runtime context | Project 不能创建 / 引用 / 追溯,或由查询 / 外部引用隐式创建 | `TC-WORK-CORE-001`~`004`;`EV-WORK-CORE-001`~`004` |
| `AC-WORK-002` | 项目内成员承担成立 | P0 | ProjectMember 表达 GlobalMember 在项目内承担,使用安全 ref / snapshot,不接管 identity 生命周期 | 保存 identity body、接管 role / actor 生命周期、resolver failure 后写 accepted member truth | `TC-WORK-MEMBER-001`~`004`;`EV-WORK-MEMBER-001`~`004` |
| `AC-WORK-003` | 正式工作全集成立 | P0 | Backlog、WorkItem、child WorkItem 形成协作级正式工作全集,外部步骤不能直接污染 | Backlog 混入 personal checklist、conversation suggestion、runtime step、ImplementationPlan body | `TC-WORK-FORMAL-001`~`005`;`TC-WORK-PROMOTE-001`~`005`;`EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*` |
| `AC-WORK-004` | Iteration 承诺子集成立 | P0 | Iteration 从正式工作全集形成承诺范围,不等同于 Backlog 全集或 process planning | 非 formal work 被 commit,process timing 直接打开 / 关闭 Iteration,非法 reopen 成功 | `TC-WORK-ITER-001`~`005`;`EV-WORK-ITER-001`~`005` |
| `AC-WORK-005` | 项目工作事实可消费可追溯 | P0 | 授权 query 能读取项目、成员、工作、承诺、完成依据和维护结果;query no-write | 查询不可见时泄露 truth,或 query / projection / trace page 反写真相 | `TC-WORK-QUERY-001`~`008`;`TC-WORK-OPS-*`;`EV-WORK-QUERY-*`;`EV-WORK-OPS-*` |
| `AC-WORK-006` | 项目工作主语成立能力 | P0 | `FR-WORK-001` 的 Project 建立、生命周期、trace / audit / outbox 和 duplicate 口径成立 | CreateProject 主线失败,duplicate 产生第二 Project / Backlog,或 reject path 写 trace / outbox | `TC-WORK-CORE-001`~`004`;`EV-WORK-CORE-001`~`004` |
| `AC-WORK-007` | 项目内成员承担表达能力 | P0 | `FR-WORK-002` 的 ProjectMember 分配、责任状态、identity boundary 和 snapshot 口径成立 | ProjectMember 不能分配 / 释放,或 unresolved identity 被写成 accepted truth | `TC-WORK-MEMBER-001`~`004`;`EV-WORK-MEMBER-001`~`004` |
| `AC-WORK-008` | 正式工作全集收束能力 | P0 | `FR-WORK-003` 能创建正式 WorkItem / child WorkItem,拒绝边界外输入和 forbidden body | 外部事件直接创建 Work truth,maintenance lock 失效,forbidden body 入仓 | `TC-WORK-FORMAL-001`~`005`;`EV-WORK-FORMAL-001`~`005` |
| `AC-WORK-009` | 正式拆分与升级边界能力 | P0 | `FR-WORK-004` 能 request / review promote,accept 创建或绑定 WorkItem,reject 不创建 WorkItem | promote 绕过 review,runtime / ImplementationPlan 正文入仓,并发 review 多赢家 | `TC-WORK-PROMOTE-001`~`005`;`EV-WORK-PROMOTE-001`~`005` |
| `AC-WORK-010` | 依赖与阻塞表达能力 | P0 | `FR-WORK-005` 能 link dependency、拒绝 cycle、open / resolve blocker,并使用 evidence ref 解释 | dependency cycle 成功,missing / rejected evidence 仍 resolve,或保存 evidence body | `TC-WORK-DEP-001`~`005`;`EV-WORK-DEP-001`~`005` |
| `AC-WORK-011` | Iteration 承诺能力 | P0 | `FR-WORK-006` 能 open、commit、change、close / cancel Iteration,并保持 Work / commitment 状态一致 | 非 formal candidate 进入 commitment,Iteration 非法 reopen,process truth 被 Work 改写 | `TC-WORK-ITER-001`~`005`;`EV-WORK-ITER-001`~`005` |
| `AC-WORK-012` | 消费与追溯能力 | P0 | `FR-WORK-007` 的 8 Query、authorized read、not visible、stale / failed surface 和 trace page 成立 | Query 缺授权、不可见泄露、projection failed 无 surface,query 触发 rebuild / 写入 | `TC-WORK-QUERY-001`~`008`;`EV-WORK-QUERY-001`~`008` |
| `AC-WORK-013` | 维护与对账能力 | P0 | `FR-WORK-008` 的 outbox publish、projection rebuild、reference refresh、reconciliation、trace / archive handoff 成立且 no-write | Job 反写真相、failed marker 不可见、rerun 非幂等、report / handoff 保存正文 | `TC-WORK-OPS-001`~`006`;`EV-WORK-OPS-001`~`006` |

### 7.2 P1/P2 功能后置边界表

| 功能 | 优先级 | 当前验收方式 | 失败处理 |
|---|---|---|---|
| `FR-WORK-E01` 高级看板与多视图消费 | P1/P2 | 只确认不污染 P0 truth | 进入风险 / 后续专项 |
| `FR-WORK-E02` 自动化维护建议 | P1/P2 | 只确认建议不直接修改业务 truth | 进入风险 / 后续专项 |
| `FR-WORK-E03` 容量趋势与负载风险提示 | P1/P2 | 只确认容量分析不改变成员承担或 Iteration truth | 进入风险 / 后续专项 |
| `FR-WORK-E04` 项目内工具能力调整协同 | P1/P2 | 只确认 Work 不拥有治理 / 方法定义正文 | 进入风险 / 后续专项 |
| `FR-WORK-E05` 跨项目依赖理解 | P1/P2 | 只确认不阻塞单项目 Work 闭环 | 进入风险 / 后续专项 |

### 7.3 功能门禁证据图

#### 功能证据图: AC 到 TC / EV

```text
AC-WORK-001..005
  -> core loop gates
  -> CORE / MEMBER / FORMAL / ITER / QUERY / OPS evidence

AC-WORK-006..013
  -> FR-WORK-001..008 functional gates
  -> CORE / MEMBER / FORMAL / PROMOTE / DEP / ITER / QUERY / OPS evidence

Evidence review
  -> reports/runs/<run_id>/evidence-index.md
  -> reports/runs/<run_id>/gate-results.md
```

关键说明:

- `AC-WORK-001`~`013` 是本步 P0 功能门禁。
- 功能证据必须绑定固定 `<run_id>`,不得使用 `latest`。
- 同一证据可以被 Step 6~10 复用,但本步只裁决功能成立。
- 外围增强不得成为当前 P0 功能通过前置。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 `AC-WORK-001`~`013` 作为 P0 功能验收门禁 | 否 | 功能门禁承接 | 无 | 无回写 |
| 确认 `FR-WORK-001`~`008` 均有 `TC-WORK-*` / `EV-WORK-*` 证据入口 | 否 | 证据映射承接 | 无 | 无回写 |
| 确认 `FR-WORK-E01`~`E05` 不进入当前 P0 功能硬验收 | 否 | 范围裁剪承接 | 无 | 无回写 |
| 确认功能门禁不新增测试用例、协议字段或对象字段 | 否 | 文档边界 | 无 | 无回写 |

说明:

```text
本步没有改变需求、设计或测试方案。
本步只把已确认的功能需求、验收项和测试证据转成可裁决门禁。
```

## 9. 回填草稿

正式 `06-验收标准.md` §5 建议采用以下结构:

```text
5. 功能验收门禁
  5.1 核心能力闭环门禁
  5.2 P0 功能能力门禁
  5.3 P1/P2 功能后置边界
  5.4 功能失败对最终结论的影响
```

正文草稿:

```text
本章功能验收门禁覆盖 `AC-WORK-001`~`013`。`AC-WORK-001`~`005` 用于裁决核心能力闭环是否成立;`AC-WORK-006`~`013` 用于裁决 `FR-WORK-001`~`008` 的 P0 功能能力是否成立。

所有 P0 功能门禁都必须绑定固定 `<run_id>` 下的 `TC-WORK-*`、`EV-WORK-*` 和 `reports/runs/<run_id>/evidence-index.md`。外围增强 `FR-WORK-E01`~`E05` 不进入当前 P0 功能硬验收,只作为后续专项或风险输入。
```

## 10. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续 Step 必须继续收口:

- Step 6 将数据边界和架构红线转成验收项。
- Step 7 将接口、事件和跨仓同步转成验收项。
- Step 8 将状态机、事务和一致性转成验收项。
- Step 9 / Step 10 将非功能、可观测性、审计和证据门禁转成验收项。
- Step 11 判定哪些功能失败触发一票否决。

## 11. 进入下一步条件

- [x] P0 核心闭环门禁已经覆盖。
- [x] `FR-WORK-001`~`008` 功能门禁已经覆盖。
- [x] 每个功能门禁都有通过条件、失败条件和证据来源。
- [x] P1/P2 外围增强后置边界已经列明。
- [x] 功能失败对总体结论的影响已经列明。
- [ ] 用户审核并确认本 Step。
