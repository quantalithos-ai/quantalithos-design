# L1-conversation 07 实施计划 Step 9: Spike、风险与待确认事项

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §9 Spike、风险与待确认事项
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义 Spike、风险与待确认事项 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_09_spikes_risks.md` |

本步把实施中可能导致返工、暂停或验收失败的不确定性提前分类。本步不改变 PH-01~PH-08 顺序，不改变提交边界，不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承输入边界、目标仓不存在、design commit 未固定等风险 |
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 P0 / P0-supporting / 非范围边界 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承阶段和 commit boundary，作为风险影响范围 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 P0 gate、VETO、EV 和失败处理 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 继承外部依赖、配置、fake / controlled seam 边界 |
| `03-详细设计.md` §16~§17 | 已完成 | 提取实现前处理规则和风险表 |
| `04-配置设计.md` §14 | 已完成 | 提取配置 P1 / P2 候选和待确认事项 |
| `05-测试方案.md` §11 / §14 | 已完成 | 提取缺陷分级、复验和残余风险 |
| `06-验收标准.md` §11~§14 | 已完成 | 提取 VETO、风险接受、最终结论和签署口径 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些技术点需要先做 Spike | 需要对目标仓建仓模板、core contracts 编译、scripts path shape、fake adapter failure semantics、report generator 输入输出做短 Spike。 |
| 2. 哪些风险会阻塞某个阶段 | design commit 未固定、core contracts 不可用、目标仓目录冲突、字段 / DTO / 状态冲突、P0 gate / VETO 失败会阻塞对应阶段。 |
| 3. 哪些待确认事项会影响提交边界或验收门禁 | P1 production adapter、real event bus、real resolver、real handoff、capacity numbers 不影响 P0 boundary；若被要求进入 P0，则必须回写设计并重排计划。 |
| 4. 每个 Spike 的输出是什么 | Spike 必须输出可审查文件、命令结果、fixture、script dry-run 或 report sample，不能只输出口头结论。 |
| 5. 每个风险的处理方式和截止点是什么 | 见 §7.2 风险表和 §7.4 待确认事项表；每项都绑定 PH 或交接截止点。 |
| 6. 哪些风险需要回写上游设计 | 字段缺失、DTO 无法构造、状态名冲突、phase boundary 越界、验收口径冲突、P1/P2 进入 P0 均需要回写设计。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 风险散落在 `03/04/05/06` | 详细设计、配置、测试、验收各自有风险表 | 实施者不知道哪个阻塞当前 phase | 本步按 PH 和处理方式归并 |
| P1 / P2 风险容易误作 P0 缺口 | production DB / MQ / real resolver / runbook 等未覆盖 | 错误扩大实施范围 | 本步明确作为风险接受或后续专项 |
| design baseline 未固定 | 当前设计仓有未提交改动 | 实现 agent 依据浮动工作树开发 | 列为交接前 blocker |
| Spike 容易无限探索 | production-like 和真实跨仓集成都可无限延伸 | 阻塞 P0 | 每个 Spike 固定输出和截止点 |
| 风险接受边界容易不清 | S0/S1 不可接受，S2/S3 可条件接受 | 错把 VETO 风险接受 | 本步单列不可接受风险 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| Spike | 未集中定义 | 每个 Spike 有阶段、输出、截止点 | 防止无限探索 |
| 风险 | 分散在多文档 | 统一编号、绑定阶段和处理方式 | 实施时可直接判断 |
| blocker | 与普通风险混杂 | 单列阻塞事项 | 方便 Step 10 暂停规则承接 |
| 待确认事项 | 容易长期悬空 | 每项有截止点和推荐方案 | 不拖到实现中临场判断 |
| 风险接受 | 验收标准中定义 | 转入实施计划前置口径 | 防止不可接受风险被放行 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有不确定项都变成 Spike | 看起来谨慎 | 会拖慢 P0，且很多 P1/P2 不影响当前实现 | 不采用 |
| 只对会影响 PH-01~PH-08 落码或证据的点做 Spike | 聚焦当前实现 | 需要明确后续专项 | 采用 |
| 真实外部服务缺失直接阻塞 P0 | 接近生产 | 与 P0 truth center 范围冲突 | 不采用 |
| 真实外部服务缺失进入风险接受 / open issues | 保持 P0 可独立验收 | 不能宣称 production-ready | 采用 |
| 实现中遇到设计冲突由 agent 自行取舍 | 速度快 | 破坏 1:1 落码和可追溯性 | 不采用 |
| 设计冲突暂停并回写 design repo | 保持真相源一致 | 需要额外回写提交 | 采用 |

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-CONV-001 | spike | 验证目标仓 scaffold、workspace member、package / crate / binary 命名可按规范创建 | PH-01 | `cargo metadata` 或 `cargo check` 输出；workspace tree summary | commit-01-a 前 |
| SP-CONV-002 | spike | 验证 `core-contracts` 本地 path dependency 与当前 Rust edition / feature 可编译 | PH-01 | `cargo check` 日志；固定 core commit hash | commit-01-a 前 |
| SP-CONV-003 | spike | 验证 gate / report / redaction scripts 的参数和 path shape | PH-01 / PH-08 | dry-run artifact tree；report sample；path check result | commit-01-b 前先 skeleton；commit-08-a 前完成 |
| SP-CONV-004 | spike | 验证 fake publisher、resolver、handoff adapter 的 failure semantics 可驱动 retry / failed / unresolved / quarantine | PH-05~PH-07 | fake script fixtures；failure case test list | 对应 phase 开工前 |
| SP-CONV-005 | spike | 验证 report generator 能从 partial phase artifacts 生成 EV 页面和最终 evidence index | PH-07 / PH-08 | sample `reports/runs/<run_id>`；missing evidence failure sample | commit-08-a 前 |

### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-CONV-001 | risk | design repo 未提交固定 L1-conversation `00~07` 基线 | 实现交接 | 交给实现 agent 前提交 design repo 并提供完整 commit hash | 实现交接前 |
| R-CONV-002 | risk | 目标实现仓不存在，首个 agent 需要建仓 | PH-01 | PH-01 纳入 scaffold；若目录冲突则暂停 | commit-01-a 前 |
| R-CONV-003 | blocker | `core-contracts` path dependency 缺失、不可编译或类型不匹配 | PH-01+ | 暂停；修复 core 或设计依赖，不复制 core 类型 | 首次 `cargo check` 前 |
| R-CONV-004 | blocker | 正式文档与 calibration 在字段、DTO、状态、事务或 phase boundary 上冲突 | 任意 PH | 暂停当前 boundary，回写 design repo | 发现时立即 |
| R-CONV-005 | risk | 实现 agent 未阅读对应 phase 的 `design-calibration` 文件 | 任意 PH | Step 3 阅读矩阵作为开工前检查；缺阅读则不得开工 | 每个 boundary 开工前 |
| R-CONV-006 | risk | 真实 DB / broker / resolver / handoff 产品行为未验证 | PH-05~PH-08 / acceptance | P0 使用 fake / controlled seam；进入 P1 risk acceptance | PH-08 acceptance |
| R-CONV-007 | risk | 真实跨仓端到端联调未完成 | PH-08 / P1 | 不阻塞 P0；写入 `risk-acceptance.md` 或后续专项 | PH-08 acceptance |
| R-CONV-008 | blocker | forbidden body、raw secret、source body、platform body 或 raw payload 进入 truth / event / log / report | PH-03+ | 阻断；修复并重跑 redaction、direct TC、release redline | 发现时立即 |
| R-CONV-009 | blocker | query、projection、cursor、report 或 consistency validation 反写真相 | PH-04 / PH-07 | 阻断；回写设计或修复实现，重跑 derived / query suite | 发现时立即 |
| R-CONV-010 | blocker | fake / controlled adapter 被标记为 production success | PH-05~PH-08 | 阻断；修正 config marker、report 和 acceptance handoff | PH-08 前必须关闭 |
| R-CONV-011 | risk | production-like capacity、SLO、runbook、dashboard 未覆盖 | PH-08 / P2 | 不阻塞 P0；进入 open issues 或 P2 operations 专项 | PH-08 acceptance |
| R-CONV-012 | risk | config center、hot reload、admin override、auto repair truth 被误加入 P0 | PH-01+ | P0 unsupported / fail-fast；如需加入必须回写 `00~04` 和重排计划 | 进入配置前 |

### 7.3 阻塞事项表

| blocker | 触发条件 | 阻塞阶段 | 立即动作 | 恢复条件 |
|---|---|---|---|---|
| BLK-CONV-001 | design commit 未固定却要求实现 agent 开工 | 实现交接 | 暂停交接 | design repo 提交完成并给出完整 hash |
| BLK-CONV-002 | `core-contracts` 不可读 / 不可编译 | PH-01+ | 暂停当前 boundary | core contracts 修复或设计改为不依赖该类型 |
| BLK-CONV-003 | 字段 / DTO / 状态 / flow / AC 无法 1:1 落码 | 任意 PH | 暂停并记录 blocker | design repo 修正并提交新 baseline |
| BLK-CONV-004 | P0-blocking TC 或 release redline 失败 | PH-02~PH-08 | 阻断下一阶段 | 修复并重跑直接 TC、同组 TC、相关 suite |
| BLK-CONV-005 | 命中 `VETO-CONV-*` 或 S0 / S1 | PH-02~PH-08 | 不得风险接受 | 修复、补防回归、重新生成 evidence |
| BLK-CONV-006 | artifact / report 路径错误或 EV 缺失 | PH-01 / PH-08 | 阻断 acceptance | path 修复、报告重生成、evidence index 完整 |

### 7.4 待确认事项表

| 编号 | 事项 | 当前影响 | 方案 | 推荐 | 截止点 |
|---|---|---|---|---|---|
| Q-CONV-001 | real event bus endpoint / topic / credential 字段是否进入 P0 | 不影响 P0 | A: 纳入 P0；B: 作为 P1 event integration 专项 | 推荐 B，P0 只证明 outbox / publisher failure semantics | PH-08 risk acceptance |
| Q-CONV-002 | durable store 产品字段全集是否进入 P0 | 不影响 P0 | A: P0 定义 DB 字段全集；B: P0 in-memory，durable adapter 后续专项 | 推荐 B，避免生产化范围膨胀 | PH-08 open issues |
| Q-CONV-003 | real identity / work / governance / artifact resolver 参数是否进入 P0 | 不影响 P0 | A: 各仓真实 adapter P0 必填；B: fake / controlled resolver P0，真实 adapter P1 | 推荐 B，来源仓 truth lifecycle 不归 conversation | PH-05 开工前确认 fake schema |
| Q-CONV-004 | observability / archive production handoff 字段是否进入 P0 | 不影响 P0 | A: 真实 handoff endpoint 必填；B: fake handoff + package ref / safe diagnostic P0 | 推荐 B，P0 裁决 handoff 语义，不裁决产品 endpoint | PH-06 开工前确认 fake contract |
| Q-CONV-005 | production capacity / SLO 是否进入验收通过条件 | 不影响 P0 | A: 写入 P0 阈值；B: P2 capacity 专项 | 推荐 B，当前没有稳定数字来源 | PH-08 risk acceptance |
| Q-CONV-006 | integration-like failure 是否阻断最终通过 | 影响 readiness | A: 全部阻断；B: 非 P0 / 非 VETO 的 S2 可条件接受 | 推荐 B，必须证明 P0 truth / redaction / evidence 不受影响 | PH-08 acceptance |

### 7.5 风险接受边界

| 风险类型 | 是否可接受 | 处理 |
|---|---|---|
| `VETO-CONV-*` | 否 | 修复后重验，不得进入 `risk-acceptance.md` |
| S0 / S1 | 否 | 阻断，通过直接 TC、同组 TC、release redline 或 redaction 复验后关闭 |
| redaction violation | 否 | 修复泄漏源，清理 artifact / report，重跑 redaction |
| source truth isolation 失败 | 否 | 修复 resolver / manifestation / consumer，重跑 `TC-CONV-MAN-*` / `TC-CONV-CONSUMER-*` |
| P0 evidence 缺失 | 否 | 重新生成 artifact、report、EV、gate results 和 evidence index |
| S2 boundary / readiness | 有条件 | 必须记录影响、owner、临时规避、复验计划和截止时间 |
| S3 非阻断 | 是 | 写入 open issues 或 backlog，不得掩盖 P0 问题 |
| P1 / P2 非范围缺口 | 是 | 写入 risk acceptance 或后续专项，不得作为 P0 通过声明 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §9。正式文档生成时应从本文件摘录，不新增长期悬空待确认项。

````markdown
## 9. Spike、风险与待确认事项

> 校准来源：
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“阻塞事项表”“待确认事项表”和“风险接受边界”小节，了解哪些不确定性需要先验证、哪些会阻塞实施、哪些只能作为 P1/P2 或 S2/S3 风险接受。

正式 §9 应摘录：

1. §7.1 Spike 表。
2. §7.2 风险表。
3. §7.3 阻塞事项表。
4. §7.4 待确认事项表。
5. §7.5 风险接受边界。

正式 §9 必须明确：字段 / DTO / 状态 / flow / AC 冲突是 blocker，不是实现者可自行取舍的风险。真实 DB / broker / resolver / handoff、production capacity、runbook 和 config center 不阻塞 P0，但不得被写成 P0 已通过。
````

## 9. 本步待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否把 Q-CONV-001~006 都保留到正式 §9 | A: 全部保留；B: 只保留 P0 会遇到的 Q-CONV-003 / 004 / 006 | 推荐 A | 它们会影响验收交接和后续专项，即使不阻塞 P0，也需要固定截止点 |
| 是否把 R-CONV-006 / 007 视为 blocker | A: 视为 blocker；B: 视为 P1 readiness risk | 推荐 B | 真实外部服务未验证不破坏本仓 P0 truth center，但必须写清不代表 production-ready |
| 是否允许实现 agent 跳过 Spike | A: 允许，只要能编码；B: 不允许跳过影响当前 boundary 的 Spike | 推荐 B | Spike 是为了提前暴露 scaffold、dependency、script 和 fake semantics 风险 |

建议接受上述推荐。原因是它们能把 P0 必须阻断的问题与 P1/P2 可接受缺口分开，避免实施阶段扩大范围或误放行。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 风险、Spike 和待确认事项均已分类 | 已满足 |
| 会阻塞实施的事项已明确为 blocker | 已满足 |
| 每个 Spike 都有明确输出和截止点 | 已满足 |
| 每个风险都绑定影响阶段和处理方式 | 已满足 |
| 每个待确认事项都有推荐方案和截止点 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 9 可以进入 Step 10。Step 10 应继续严格单 Step 执行，专门定义暂停、回退与变更控制，不重写风险表。
