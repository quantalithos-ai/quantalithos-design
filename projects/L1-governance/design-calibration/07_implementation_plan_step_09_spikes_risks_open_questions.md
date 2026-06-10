# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填章节: `07-实施计划.md` §9 Spike、风险与待确认事项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义 Spike、风险与待确认事项 |
| 当前状态 | 进行中;按风险类型分批写入 |
| 输入基线 | Step 1 输入风险;Step 5 phase;Step 6 boundary;Step 7 gate;Step 8 外部依赖准备 |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 10 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成 | 识别正式 `00`~`06`、calibration、standards 的输入风险 |
| Step 5 phase | 已完成 | 绑定风险影响阶段 |
| Step 6 commit boundary | 已完成 | 绑定风险截止点和开工前复核点 |
| Step 7 门禁矩阵 | 已完成 | 绑定风险与测试 / 验收门禁 |
| Step 8 依赖准备 | 已完成 | 绑定外部依赖、配置、环境和 fake seam 风险 |
| `03/04/05/06` | 已存在 | 提供复杂点、配置 profile、suite、VETO 和风险接受边界 |

## 3. SOP 问题回答

1. 哪些技术点需要先做 Spike。

   回答: 需要 Spike 的点集中在 release report/evidence generator dry-run、job report duplicate replay result surface、projection/reference scope expansion dry-run、redaction/dependency/report audit script dry-run、target repo skeleton bootstrap。Spike 必须产出可执行 demo、审计记录或设计闭口清单。

2. 哪些风险会阻塞某个阶段。

   回答: 目标实现仓不存在阻塞 PH-01;core dependency 不可用阻塞 PH-01;字段/DTO/状态/port/version/outbox/job/report/evidence 闭环缺失阻塞对应 commit boundary;redaction/dependency/report audit 失败阻塞 PH-08;VETO 命中阻塞最终通过。

3. 哪些待确认事项会影响提交边界或验收门禁。

   回答: 每个 boundary 的设计者经验复核、release run_id、target repo 创建、config CLI/env key、artifact/report script 参数、acceptance report 审查责任会影响提交和验收门禁。

4. 每个 Spike 的输出是什么。

   回答: 每个 Spike 输出必须是 demo script、dry-run report、设计闭口 patch list、或可执行检查记录,不能只输出口头结论。

5. 每个风险的处理方式和截止点是什么。

   回答: 表 7.2 风险表逐项列出处理方式和截止点。截止点使用 PH / commit boundary / release gate 前,不使用无限期“后续确认”。

6. 哪些风险需要回写上游设计。

   回答: 凡涉及字段、DTO、状态、port、scope expansion、version source、outbox source identity、job report result surface、query marker、projection stale、evidence source、config binding 的缺口,均回写 `03/04/05/06/07` 中对应真相源。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 8 | 目标实现仓不存在 | PH-01 无法实施 | 标为 blocker,截止 PH-01 开工前 |
| Step 6 | boundary 多且复杂 | 设计缺口可能实现时才发现 | 设置 boundary 级设计者复核风险 |
| Step 7 | release evidence 严格 | 静态证据会导致 VETO | 设置 evidence generator Spike and risk |
| `04` config | CLI/env key 可能需要实现前再次核对 | entry 参数不闭合会阻塞 PH-01/PH-07 | 设置 config binding open question |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险 | 分散在各 Step | 统一绑定 phase、处理方式和截止点 | 防止悬空 |
| Spike | 未集中列出 | 只保留需要提前证明的技术点 | 避免把 Spike 当实现 |
| 待确认 | 可能使用“后续确认” | 每项都有截止点 | 符合 SOP |
| 设计回写 | 分散在复核规则中 | 明确哪些风险必须回写设计真相源 | 防止实现侧补 schema |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有不确定项都列为 Spike | 保守 | Spike 过多会替代实施 | 不采用 |
| 只对会影响 boundary / gate / evidence 的不确定项列 Spike | 聚焦 | 需要执行期严格复核 | 采用 |
| 允许长期待确认 | 文档轻 | 会把 blocker 留给实现者 | 不采用 |
| 每个待确认项绑定截止点 | 可执行 | 需要维护 | 采用 |

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-GOV-001 | spike | 目标实现仓 bootstrap dry-run:确认 workspace、core dependency、七 crate skeleton 能按 `03` 布局生成 | PH-01 | bootstrap 命令记录、`cargo check` 记录、dependency graph 记录 | commit-01-a 开工前 |
| SP-GOV-002 | spike | Config profile and runtime builder smoke:验证 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 可解析 | PH-01 | config parse smoke report and invalid profile negative case | commit-01-b 提交前 |
| SP-GOV-003 | spike | Query visibility decision surface dry-run:确认 not-visible / degraded / stale marker 有可实现 result surface | PH-05 | design closure checklist 或小型 compile spike | commit-05-a 开工前 |
| SP-GOV-004 | spike | Consumer affected projection stale dry-run:确认各 inbound event 能定位 affected public views | PH-06 | affected view mapping review and test fixture list | commit-06-b 开工前 |
| SP-GOV-005 | spike | Outbox payload snapshot and source identity dry-run:确认 12 outbound event payload 均能从 committed source object 构造 | PH-06 | payload source matrix and builder test fixture list | commit-06-c 开工前 |
| SP-GOV-006 | spike | Job stored report duplicate replay dry-run:确认 public job duplicate 能返回 stored report surface | PH-07 | stored report schema review and duplicate replay test demo | commit-07-a 开工前 |
| SP-GOV-007 | spike | Handoff / export failed item and artifact materialization dry-run | PH-07 | handoff/export target mapping and report artifact demo | commit-07-c 开工前 |
| SP-GOV-008 | spike | Release evidence generator dry-run:确认 evidence index / VETO checklist 不依赖静态 pass 表 | PH-08 | report-generation-audit dry-run and static evidence negative fixture | commit-08-a 提交前 |

### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-GOV-001 | blocker | 目标实现仓 `/home/aris/Projects/quantalithos-governance` 当前未发现 | PH-01 | 创建或确认目标仓,再开始 commit-01-a | PH-01 开工前 |
| R-GOV-002 | blocker | `core-contracts` path dependency 不可用或 package 名不一致 | PH-01 | 暂停,修复 core repo/path 或回写 `03/07` | commit-01-a 开工前 |
| R-GOV-003 | risk | 设计 baseline 在实现期间变化导致 Step 6 boundary 失效 | PH-01~PH-08 | 每个 boundary 开工前记录 design commit and repeat closure review | 每个 commit boundary 开工前 |
| R-GOV-004 | blocker | 字段 / DTO / state / port / version / outbox / job report 闭环缺失 | PH-02~PH-07 | 暂停当前 boundary,回写 `03/04/05/06/07`,固定新 baseline 后重复核 | 受影响 boundary 开工前 |
| R-GOV-005 | risk | fake adapter 跳过正式 version/UoW/idempotency/outbox/report 语义 | PH-02~PH-07 | fake tests 强制覆盖正式语义;redline fake shortcut | 对应 fake boundary 提交前 |
| R-GOV-006 | blocker | Query / projection / reconciliation / handoff / export job 反写 core truth | PH-05~PH-07 | no-write / no-truth-repair tests;命中则 VETO | 对应 boundary 提交前 |
| R-GOV-007 | blocker | raw body / secret / full sensitive ref 进入 truth、outbox、trace、report 或 artifact | PH-04~PH-08 | redaction targeted and release redaction check;命中不可风险接受 | PH-04 起每个相关 boundary |
| R-GOV-008 | blocker | non-core sibling repo 被加入 Cargo compile dependency | PH-01~PH-08 | dependency-boundary check;移除依赖或回写架构 | commit-01-a 起每个 manifest 改动 |
| R-GOV-009 | blocker | release evidence index / VETO checklist 由静态 JSON 或手写 pass 生成 | PH-08 | report-generation-audit and no static evidence guard | commit-08-a / commit-08-b |
| R-GOV-010 | risk | P1 real-like / production-like unavailable 被误记为 P0 pass | PH-08 | selected-run unavailable 只记录 residual,不计 P0 pass | PH-08 release handoff |
| R-GOV-011 | risk | 旧性能 P95/SLA 候选被误写为 P0 硬阈值 | PH-08 | 只记录 duration/count sample;阈值进入 future baseline | PH-08 report review |
| R-GOV-012 | risk | Config CLI/env key 与 entry implementation 不一致 | PH-01/PH-07 | PH-01 前复核 `04` entry-local 参数;缺口回写配置设计 | commit-01-b 开工前 |

### 7.3 待确认事项表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| OQ-GOV-001 | open-question | 目标实现仓由谁创建、是否从模板初始化 | PH-01 | 实施前确认仓存在;若不存在由 PH-01 bootstrap 创建 | commit-01-a 开工前 |
| OQ-GOV-002 | open-question | `git config user.name/user.email` 是否已在目标实现仓设置 | PH-01 | Step 11 提交纪律检查 | 首次提交前 |
| OQ-GOV-003 | open-question | Release run_id 命名和 candidate baseline | PH-08 | release gate 调用时固定,写入 report context | commit-08-b 开工前 |
| OQ-GOV-004 | open-question | Acceptance reports 的审查责任人 / Agent | PH-08 | PH-08 生成 handoff/veto/risk 后指定审查记录 | PH-08 release handoff 前 |
| OQ-GOV-005 | open-question | Config CLI/env key 是否已经满足 api/worker/jobs entry 最小参数面 | PH-01/PH-07 | 复核 `04-配置设计.md`;缺口回写配置设计 | commit-01-b 开工前 |
| OQ-GOV-006 | open-question | P1 selected-run 是否在本轮执行 | PH-08 | 不作为 P0;若未执行记录 residual/unavailable | PH-08 handoff |
| OQ-GOV-007 | open-question | 真实 DB/bus/search/object storage/external GRC 产品是否需要提前选型 | PH-08 | 当前不需要;记录 P1/P2 residual | PH-08 risk acceptance |
| OQ-GOV-008 | open-question | 每个 commit boundary 的设计者经验复核记录存放位置 | PH-02~PH-08 | 正式 §6 引用;执行期可放在 commit note / handoff note / report | 对应 boundary 开工前 |

### 7.4 需要回写上游设计的风险触发

| 触发 | 回写目标 | 不允许的处理 |
|---|---|---|
| command request 无法构造 domain factory / transition | `03-详细设计.md` Step 6/8/9/10 | 实现侧新增字段或默认值 |
| query response marker 无正式来源 | `03-详细设计.md` Step 7/8/9/10 | service 直接返回临时 marker |
| reference/project/scope expansion 无 port / schema | `03-详细设计.md` Step 7/9/11 | fake 全表扫描或凭 ref 字符串推断 |
| optimistic version 无读取面 | `03-详细设计.md` Step 7/9/11 | 使用常量 version 或 `None` 覆盖 |
| outbox record 无 source identity / payload snapshot | `03-详细设计.md` Step 6/7/8/9/11 | publisher 从 current truth 重构 |
| public job duplicate 无 stored report surface | `03-详细设计.md` Step 7/8/9/13 | duplicate 重新执行 job |
| handoff/export failed item 类型不闭合 | `03-详细设计.md` Step 6/8/9 | report 填错误 ref 类型 |
| release evidence 无真实 artifact/report source | `05-测试方案.md`;`06-验收标准.md` | 静态 JSON 或手写 pass |
| config profile / CLI/env key 不闭合 | `04-配置设计.md`;必要时 `03` | entry 自行发明 flag/env |

### 7.5 风险 / Spike 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Spike 是否都有明确输出 | 通过 | 输出为 dry-run/report/checklist/demo |
| 风险是否绑定 phase | 通过 | R-GOV-001~012 均有影响阶段 |
| blocker 是否明确 | 通过 | 目标仓、core dependency、设计闭环、redaction、dependency、static evidence 均标 blocker |
| 待确认事项是否有截止点 | 通过 | OQ-GOV-001~008 均有截止点 |
| 回写上游设计触发是否明确 | 通过 | 表 7.4 |
| 是否存在长期悬空的“后续确认” | 未发现 | P1/P2 均转 residual or future trigger |

### 7.6 跨风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖目标仓 / core dependency 前置风险 | 通过 | R-GOV-001/002 |
| 是否覆盖设计闭环可落码风险 | 通过 | R-GOV-003/004 and 表 7.4 |
| 是否覆盖 fake shortcut 风险 | 通过 | R-GOV-005 |
| 是否覆盖 query/job truth repair 风险 | 通过 | R-GOV-006 |
| 是否覆盖 redaction/dependency/evidence VETO 风险 | 通过 | R-GOV-007/008/009 |
| 是否覆盖 P1/P2 伪 pass 风险 | 通过 | R-GOV-010/011 |
| 是否覆盖 config entry 风险 | 通过 | R-GOV-012/OQ-GOV-005 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §9。正式装配时可压缩说明文字,但必须保留编号、影响阶段、处理方式和截止点。

### 9.1 Spike

本轮只允许对会影响 boundary、gate、evidence 或 design closure 的事项做 Spike。Spike 必须输出 demo、dry-run report、closure checklist 或可执行检查记录。

| 编号 | 描述 | 输出 | 截止点 |
|---|---|---|---|
| SP-GOV-001 | target repo bootstrap dry-run | workspace/core dependency check | commit-01-a 开工前 |
| SP-GOV-002 | config profile/runtime smoke | config parse and negative report | commit-01-b 提交前 |
| SP-GOV-003 | query visibility decision surface dry-run | design closure checklist | commit-05-a 开工前 |
| SP-GOV-004 | consumer affected projection stale dry-run | mapping review and fixture list | commit-06-b 开工前 |
| SP-GOV-005 | outbox payload snapshot source dry-run | payload source matrix | commit-06-c 开工前 |
| SP-GOV-006 | job stored report duplicate replay dry-run | stored report schema review | commit-07-a 开工前 |
| SP-GOV-007 | handoff/export artifact materialization dry-run | target mapping and report demo | commit-07-c 开工前 |
| SP-GOV-008 | release evidence generator dry-run | no static evidence report audit | commit-08-a 提交前 |

### 9.2 Blocker and Risk

目标实现仓不存在、core dependency 不可用、设计闭环缺失、redaction leak、non-core compile dependency、static evidence / VETO passed、query/job truth repair 均为 blocker。触发后不得继续当前 boundary,必须修复、回写设计或调整实施计划后再恢复。

P1 real-like / production-like unavailable、真实产品未锁定、旧性能阈值未硬化属于 residual/future 风险,不得计入 P0 pass。

### 9.3 Open Questions

所有待确认事项必须在对应 boundary 开工前关闭。没有关闭的事项按 blocker 处理,不得以“后续确认”继续实现。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标仓创建 | PH-01 开工前确认 | commit-01-a |
| release run_id | PH-08 固定 | commit-08-b |
| acceptance report 审查责任 | PH-08 指定 | release handoff |
| P1 selected-run | 不进入 P0 pass | risk acceptance |
| 真实产品选型 | P1/P2 | future ADR / deployment |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike 表已完成 | 通过 | SP-GOV-001~008 |
| 风险表已完成 | 通过 | R-GOV-001~012 |
| 待确认事项表已完成 | 通过 | OQ-GOV-001~008 |
| blocker 已明确 | 通过 | 目标仓/core/design/redaction/dependency/evidence |
| 回写设计触发已明确 | 通过 | 表 7.4 |
| 无长期悬空事项 | 通过 | 每项均有截止点 |
| 可进入 Step 10 | 通过 | 下一步定义回退、暂停与变更控制 |
