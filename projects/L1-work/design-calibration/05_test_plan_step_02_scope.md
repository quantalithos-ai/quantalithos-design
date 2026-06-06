# Step 2. 明确测试目标、范围和非范围

> 本步定义本轮 `L1-work` 测试方案要证明什么、覆盖什么、不覆盖什么,并收敛 P0 / P1 / P2 测试优先级口径。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 2 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §2 本次测试目标与范围 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 确认新版 `00/01/02/03/04` 为主输入,旧 `05/06` 只作诊断和方向参考 |
| `00-需求文档.md` §4 / §7 / §9 / §14 / §15 | 测试目标、非目标、核心闭环、功能需求、验收方向和挂起风险 |
| `01-架构设计.md` §3 / §8 / §9 / §13 / §15 | 依赖方向、数据所有权、横切关注点、架构红线和风险 |
| `02-概要设计.md` §2 / §5 / §8 / §9 / §10 / §11 | 概要范围、组成部分、处理流、状态、异常和配置影响 |
| `03-详细设计.md` §2 / §15 / §17 | 详细设计目标、非范围、最小验证清单和风险承接 |
| `04-配置设计.md` §6 / §12 / §14 | P0 profile、配置测试承接、P1/P2 配置风险 |
| `测试方案讨论流程_SOP.md` Step 2 | 本步问题、期望产出和进入下一步条件 |

## 3. SOP 问题回答

### 3.1 P0 必须通过哪些测试才能证明主链成立?

P0 测试必须证明 `L1-work` 的五个核心能力闭环成立,并覆盖 `03-详细设计.md` §15 的最小验证清单。

| P0 证明目标 | 必须验证的结果 | 关联验收方向 |
|---|---|---|
| 项目主语成立 | Project 可作为正式工作对象建立、引用和追溯,不退化为 conversation topic、process instance、runtime context 或 workspace view | `AC-WORK-001` / `AC-WORK-006` |
| 项目内成员承担成立 | ProjectMember 只表达 GlobalMember 在项目内的承担事实,不接管 identity 生命周期或正文 | `AC-WORK-002` / `AC-WORK-007` |
| 正式工作全集成立 | Backlog、WorkItem、child WorkItem 形成正式协作工作全集,并拒绝 conversation suggestion、个人步骤、runtime 局部计划项直接污染 | `AC-WORK-003` / `AC-WORK-008` / `AC-WORK-009` |
| 依赖、阻塞和完成依据可解释 | 正式工作依赖、阻塞、解除依据和完成依据可追溯,外部正文不入仓 | `AC-WORK-010` / `AC-WORK-019` / `AC-WORK-020`~`AC-WORK-023` |
| Iteration 承诺子集成立 | Iteration 从正式工作全集形成承诺范围,不等同于 Backlog 全集或 process planning | `AC-WORK-004` / `AC-WORK-011` |
| 项目工作事实可消费可追溯 | Query / projection / snapshot / report / audit 能授权消费和追溯,但不得反写真相 | `AC-WORK-005` / `AC-WORK-012` / `AC-WORK-013` |
| 详细设计最小验证清单成立 | 七模块、18 Command、8 Query、7 Inbound Event、10 Outbound Event、6 Job、12 组状态机、事务、幂等、并发、错误恢复、配置边界和观测字段边界均有测试切口 | `03` §15 |
| 配置默认可验证路径成立 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 的配置加载、失败、敏感输出和证据边界可测试 | `04` §6 / §12 |

### 3.2 P1/P2 是否只做边界验证或延后?

是。P1/P2 能力不得写成当前 P0 硬测试范围。

| 优先级 | 测试口径 | 当前处理 |
|---|---|---|
| P0 | 核心 truth、协议、状态、事务、幂等、配置、观测和证据闭环 | 必须完整形成用例、数据、环境、门禁和证据 |
| P1 | controlled integration-like / staging-like 接缝、真实依赖 dry-run、configured adapter ref、未来 advanced search backend 的条件验证 | 只写边界、风险和后续承接;不要求真实生产依赖 |
| P2 | production-like durable DB / MQ / endpoint / KMS、config center、admin override、hot reload、last-known-good、完整容量模型、完整生产 runbook | 不进入当前测试用例矩阵;只在风险与演进中记录 |

### 3.3 哪些下游能力只测接缝,不测对方完整实现?

| 下游 / 相邻能力 | P0 测试范围 | 非范围 |
|---|---|---|
| `L1-identity` | GlobalMemberRef / ActorRef / ProjectMember 承担边界、resolver fake / snapshot / not found / unavailable | identity 生命周期、角色正文、身份存储实现 |
| `L1-conversation` | conversation suggestion / fact 只能作为引用、事件或快照输入,不得直接创建 Work truth | conversation fact 正文、chat UI、conversation trace / handoff 正文 |
| `L3-method-library` | method / task / work product / process template / view profile 只作为定义引用或 snapshot | method definition 正文、ViewProfile 定义管理 |
| `L1-process` | planning timing、review / checkpoint 只作为时机或引用,不得维护 Backlog truth | Activity、ProcessInstance、checkpoint 和流程推进状态 |
| `L1-governance` | 高风险变化、promote、工具能力调整只引用正式治理约束 | Gate、Policy、Control、Approval 决策 truth |
| `L1-artifact` | approved evidence / artifact ref / ImplementationPlanRef 只作为完成依据或 promote 来源引用 | artifact / evidence / baseline / ImplementationPlan 正文 |
| `L2-runtime` | plan item promote 请求、runtime step 禁止直接入 Backlog、幂等和来源追溯 | agent loop、tool invocation、plan item progress、执行步骤推进 |
| `L1-workspace` | workspace / board / dashboard 只消费 Work 派生视图 | PersonalWorkspace / ProjectWorkspace 聚合真相 |
| `L0-bus` / `L4-observability` / `L4-archive` | outbox、trace / archive handoff、low-cardinality metric 和 evidence ref 交接 | bus 产品实现、观测平台 dashboard、长期归档产品细节 |

### 3.4 哪些非范围有残余风险?

| 非范围 | 残余风险 | 当前处理方式 |
|---|---|---|
| 真实 production DB / MQ / endpoint / KMS 产品测试 | P1/P2 生产化前仍需专项配置、环境和验收门禁 | 在 Step 14 风险记录;P0 使用 fake / in-memory / controlled adapter |
| config center / admin override / hot reload | 未来远程配置可能影响测试环境和回滚策略 | P0 启用视为 unsupported;后续专项重开 04 / 05 |
| 旧性能 / 容量数字是否升级为硬阈值 | 旧 `100ms / 300ms / 500w` 被误写成当前验收硬门禁 | Step 10 只作为候选专项目标评估,不在 Step 2 固定 |
| advanced search backend | 若启用会导致 query 能力虚构 | 默认 disabled;缺 backend 时配置 fail-fast |
| UI / workspace 视觉体验 | 可能影响最终产品体验但不影响仓级 truth 成立 | 留给 workspace / UI / product-level 测试 |
| 相邻仓真实实现联调 | 跨仓接口真实实现可能存在兼容漂移 | P0 只测 port / event / snapshot / fake / controlled contract;真实联调后续专项 |
| 真实运维部署和告警 | 无法直接证明生产运行 | 留给 09 部署与运维手册和 P1/P2 验收 |

### 3.5 哪些范围项是一票否决相关?

测试方案必须为需求层一票否决项提供证据。当前 Step 2 只收敛范围,具体用例和证据编号留给 Step 5 / Step 6 / Step 13。

| 一票否决方向 | 测试范围要求 |
|---|---|
| C-1~C-5 任一核心闭环无法成立 | P0 覆盖项目主语、成员承担、正式工作全集、Iteration 承诺和可消费可追溯 |
| Backlog / WorkItem / child WorkItem 混入个人步骤、对话建议或 runtime 局部计划项 | P0 负向测试覆盖 conversation / runtime / process / artifact 等越界输入 |
| ProjectMember 接管 identity 生命周期或正文 | P0 覆盖 ProjectMember 与 GlobalMemberRef / ActorRef 的引用边界 |
| 相邻仓正文或运行时执行正文进入 Work | P0 覆盖 forbidden body / external body exclusion / ref-only 断言 |
| 关键变化不可追溯 | P0 覆盖 audit、trace、outbox、result / receipt 和 evidence ref |
| 查询、投影、对账、报告反写真相 | P0 覆盖 query no-write、projection no-write、maintenance no-write |
| 非 core sibling repo 成为编译期依赖 | P0 实施阶段需由 07 承接 dependency gate;测试方案记录为验证范围输入 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1 | 测试目标仍是旧草案主线,缺少新版七模块、协议、状态、配置和观测最小验证口径 | 本步重建范围口径,旧 §1 不再作为正式范围 |
| 旧 `05-测试方案.md` §4 | 环境只写 dev / test / staging,未承接 `04` 的 P0 profile | 本步把 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 纳入 P0 测试范围 |
| 旧 `05-测试方案.md` §9 | 旧性能数字直接写成阈值 | 本步明确旧数字只作候选,Step 10 再判断是否升级 |
| `03-详细设计.md` §15 | 已定义最小验证清单,但尚未展开完整测试对象和用例 | 本步作为 P0 范围输入;Step 3~6 继续展开 |
| `04-配置设计.md` §12 | 已定义配置测试承接,但旧 `05` 未反映 | 本步将配置 profile、加载、失败、敏感输出纳入范围 |

## 5. 改动前后对比

| 维度 | Step 1 后 | Step 2 收敛后 |
|---|---|---|
| 输入边界 | 明确新版 `00/01/02/03/04` 为主输入 | 明确这些输入如何转成测试目标和范围 |
| P0 范围 | 尚未分层 | P0 覆盖核心闭环、详细设计最小验证、配置 P0 profile 和一票否决相关范围 |
| P1/P2 范围 | 只知道旧 `05/06` 不作事实源 | P1/P2 只保留接缝、专项和风险,不进入当前硬用例矩阵 |
| 非范围 | 尚未集中表达 | 明确 production、remote config、hot reload、旧性能阈值、UI、真实跨仓联调等非范围 |
| 下游接缝 | 尚未裁剪测试深度 | 明确只测引用、事件、snapshot、fake / controlled adapter 和边界,不测相邻仓完整实现 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: P0 覆盖所有旧 `05` 用例和旧 `06` 门禁 | 看似完整 | 会把旧草案、旧性能数字和未重校准验收项带入新版测试 | 不采用 |
| 方案 B: P0 聚焦核心闭环 + 详细设计最小验证 + 配置 P0 profile,P1/P2 只记录接缝和风险 | 与新版 `00~04` 一致,测试范围可执行可追溯 | 后续需要在 Step 3~6 展开大量对象 / 用例矩阵 | 采用 |
| 方案 C: 只测 command / query happy path | 成本低 | 无法证明状态、幂等、事务、配置、观测和边界红线 | 不采用 |
| 方案 D: 直接要求真实生产依赖联调 | 接近生产 | P0 没有 production DB / MQ / KMS / endpoint 字段全集,会造成虚构测试环境 | 不采用 |

推荐方案 B。

原因:

- P0 必须证明 Work truth 成立,而不是证明所有未来生产部署能力成立。
- 详细设计已经给出最小验证清单,测试方案应展开而不是另造范围。
- 配置设计已经把 production-like、config center、secret provider、hot reload 和 last-known-good 后移,测试方案必须同步裁剪。

## 7. 结构化中间产物

### 7.1 测试目标表

| 测试目标 | 说明 | 下游输出 |
|---|---|---|
| 证明核心能力闭环成立 | C-1~C-5 均有正向和关键负向测试证据 | `06` 可据此裁决核心能力闭环验收 |
| 证明正式工作事实不被污染 | 边界外输入、外部正文、runtime step、conversation suggestion、query / projection / maintenance 反写被拒绝 | `06` 可据此裁决一票否决项 |
| 证明详细设计契约可实现 | 七模块、协议、状态、事务、幂等、错误、配置和观测均有测试切口 | `07` 可据此安排测试门禁 |
| 证明配置 P0 profile 可验证 | local-dev、ci-test、integration-like、operations-replay 的配置成功 / 失败路径可测试 | `05` Step 8 / Step 9 继续展开环境和自动化 |
| 证明证据可交给验收 | 每个 P0 范围项后续都有用例和 evidence ID | `06` 可据此做通过 / 失败裁决 |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Project / ProjectMember truth | 核心对象 | P0 | 项目主语和项目内承担成立 | 不测 identity 生命周期 |
| Backlog / WorkItem / child WorkItem truth | 核心对象 | P0 | 正式工作全集、拆分、升级和拒绝边界成立 | 不接收个人步骤、对话建议或 runtime step 直写 |
| Work dependency / blocker / done evidence | 核心关系 | P0 | 依赖、阻塞、解除依据和完成依据可解释 | 不保存 artifact / evidence 正文 |
| Iteration commitment | 核心对象 | P0 | 承诺子集从正式工作全集中形成并保持边界 | 不测 process planning 内部实现 |
| Promote boundary | 跨仓接缝 | P0 | plan item 符合条件时显式升级,不符合时拒绝 | 不拥有 ImplementationPlan 正文 |
| Command / Query / Event / Job protocol | 协议 | P0 | success、reject / error、duplicate / conflict、no-write、rerun / duplicate 成立 | 不新增未定义协议 |
| 状态机 / 事务 / 幂等 / 并发 / 恢复 | 一致性 | P0 | 合法 / 非法转换、UoW、outbox、projection、commit unknown 成立 | 不测真实 DB 产品行为 |
| Projection / query / maintenance no-write | 派生 / 维护 | P0 | 查询、投影、对账、报告不反写真相 | 不测 workspace UI |
| 配置加载 / 失败 / 敏感输出 | 配置 | P0 | P0 profile、strict JSON、env、sensitive、adapter ref、outbox / handoff / replay 可验证 | 不测 config center / hot reload |
| Observability / audit / evidence | 证据 | P0 | low-cardinality metric、safe log、audit / trace / outbox / report 证据成立 | 不测真实 observability dashboard |
| Controlled integration seams | 集成接缝 | P1 | controlled resolver / publisher / handoff / staging-like dry-run | 不要求真实生产 endpoint |
| Production-like deployment | 生产化 | P2 | 后续专项验证 | 当前不进入 P0 |

### 7.3 P0 / P1 / P2 测试口径

| 优先级 | 必须形成什么 | 不得写成什么 |
|---|---|---|
| P0 | 可执行用例、断言点、测试数据、环境配置、自动化候选和证据 ID | 不得依赖真实生产 DB / MQ / KMS / config center |
| P1 | 接缝验证、dry-run、contract / compatibility test、风险记录 | 不得阻塞 P0 正式测试方案定稿 |
| P2 | 生产化专项、容量模型、remote config、hot reload、full runbook | 不得进入当前 P0 用例矩阵或验收硬门禁 |

### 7.4 测试范围图

#### 测试分层图: L1-work 测试范围边界

```text
P0 Test Scope
|
+-- Core truth closure
|   +-- Project / ProjectMember
|   +-- Backlog / WorkItem / child WorkItem
|   +-- Dependency / blocker / done evidence
|   +-- Iteration / promote
|
+-- Design contract closure
|   +-- Command / Query / Event / Job
|   +-- state matrix / transaction / idempotency / recovery
|   +-- projection / outbox / audit / observability
|
+-- Configuration closure
|   +-- local-dev / ci-test / integration-like / operations-replay
|   +-- strict JSON / env / sensitive / adapter ref / failure modes
|
+-- Explicitly out of P0
    +-- production DB / MQ / KMS / endpoint
    +-- config center / admin override / hot reload
    +-- workspace UI and visual acceptance
    +-- full sibling repo implementation tests
```

关键说明:

- 图表达测试范围优先级,不表达测试执行顺序。
- P0 必须能在 fake / in-memory / controlled adapter 下形成证据。
- P1/P2 不被删除,但不得写成当前硬测试范围。
- 任何新增 P0 对象、字段、状态或错误都必须先回写上游设计。

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 测试聚焦核心能力闭环、详细设计最小验证清单和配置 P0 profile | 否 | 测试范围裁剪,无设计契约变化 | 无 | 无回写 |
| P1/P2 生产化、remote config、hot reload、真实依赖和容量模型只作后续专项 | 否 | 范围裁剪,与 `00` / `04` 风险口径一致 | 无 | 无回写 |
| 旧性能数字只作为候选专项目标,不在 Step 2 升级为硬阈值 | 否 | 测试目标裁剪,不改变需求或验收 | 无 | 无回写 |
| 下游 / 相邻仓只测接缝和边界,不测对方完整实现 | 否 | 测试边界规则,无代码契约变化 | 无 | 无回写 |

说明:

```text
本步没有改变需求、架构、概要、详细设计或配置设计。
如果 Step 3~6 发现 P0 范围无法映射到正式对象、协议、状态、错误或配置契约,必须记录为上游待回写或阻塞待确认。
```

## 9. 回填草稿

正式 `05-测试方案.md` §2 建议采用以下结构:

```text
2. 本次测试目标与范围
  2.1 测试目标
  2.2 范围 / 非范围
  2.3 P0 / P1 / P2 测试口径
  2.4 下游 / 相邻仓接缝测试边界
  2.5 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §2.1 | `design-calibration/05_test_plan_step_02_scope.md` §7.1 |
| §2.2 | `design-calibration/05_test_plan_step_02_scope.md` §7.2 |
| §2.3 | `design-calibration/05_test_plan_step_02_scope.md` §7.3 |
| §2.4 | `design-calibration/05_test_plan_step_02_scope.md` §3.3 |
| §2.5 | `design-calibration/05_test_plan_step_02_scope.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续 Step 必须继续收口:

- Step 3 按本步 P0 范围抽取测试对象与测试切口。
- Step 5 / Step 6 为 P0 范围项分配稳定用例 ID 和 evidence ID。
- Step 10 判断旧性能候选数字是否进入专项测试目标,不得在此前写成硬阈值。
- Step 14 汇总 P1/P2 生产化、真实依赖、remote config 和容量模型风险。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0/P1/P2 和非范围已收稳 | 通过 | §7.2 / §7.3 |
| P0 必须证明的主链已明确 | 通过 | §3.1 / §7.1 |
| 下游接缝测试深度已裁剪 | 通过 | §3.3 |
| 不存在阻塞 Step 3 的上游缺口 | 通过 | §10 |
