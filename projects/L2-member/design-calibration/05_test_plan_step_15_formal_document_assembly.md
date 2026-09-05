# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填位置：`projects/L2-member/05-测试方案.md` 全文
> 书写依据：`standards/document/测试方案书写规范.md`
> 执行纪律：`standards/document/设计文档讨论中间产物规范.md`
> 组装方式：full-restart；旧正式 `05-测试方案.md` 只作为 historical material，不在其结构上追加。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15：整理正式测试方案文档 |
| 当前状态 | `completed / pass_with_upstream_and_design_blockers / stop_review` |
| 项目级门禁 | `pass`：项目台账允许在 `05` Step 15 组装；不允许实现、测试执行或 commit |
| 文档级门禁 | `pass`：Step 1～14 均已完成并停审，本 Step 获用户“继续完成全部 05”授权 |
| Step / 模块门禁 | `pass`：输入、来源映射、污染审计、正文回填和静态审计均已完成 |
| 正式回填门禁 | `completed`：正式 05 已按 15 章主链重建 |
| 测试执行 | `false`：仅定义 planned suite / gate / evidence schema，不运行测试 |
| 实现仓写入 | `false`：不创建脚本、fixture、实现代码或实现台账 |
| commit | `false`：本轮不提交 commit |

## 2. Step 内计划

| 顺序 | 模块 | 必须产出 | 门禁 |
|---:|---|---|---|
| 1 | 输入恢复 | 重读项目台账、05 flow、Step 1～14、测试 SOP 与书写规范 | 当前文档 / Step / 模块一致 |
| 2 | 章节映射 | 15 章与具体 calibration source 的一一映射 | 每章至少一个具体文件路径 |
| 3 | 正文骨架 | full-restart 元信息与 15 章标题 | 不继承旧章节结构 |
| 4 | 正文回填 | 范围、对象、策略、矩阵、用例、数据、环境、门禁、专项、缺陷、进出、证据、回归 | 只写收口结论，不写讨论过程 |
| 5 | 静态审计 | 来源、命名、phase、依赖、blocker、非伪造和路径审计 | 所有高风险项可判定 |
| 6 | 台账收口 | 更新 flow 与 project ledger，记录停审 | 下一动作只能等待用户确认进入 06 |

## 3. 本步输入

| 输入 | 用途 | 事实等级 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | §1 输入边界、历史隔离、测试不能回答的问题 | 已校准设计输入 |
| `05_test_plan_step_02_scope.md` | §2 目标、范围、非范围、P0/P1/P2 | 已校准设计输入 |
| `05_test_plan_step_03_test_objects_cuts.md` | §3 七模块、CP、协议分母、状态 / 一致性切口 | 已校准 planned cut |
| `05_test_plan_step_04_strategy_layers.md` | §4 分层图、层级、P1 资格 | 已校准 planned strategy |
| `05_test_plan_step_05_traceability_coverage.md` | §5 C/FR/BR/NFR/AC/VF 双向覆盖 | 已校准 planned matrix |
| `05_test_plan_step_06_cases.md` | §6 TC-L2M 用例矩阵和 phase 约束 | planned cases |
| `05_test_plan_step_07_test_data.md` | §7 DS-L2M 数据集、隔离、清理和替身 | planned data |
| `05_test_plan_step_08_environment_config.md` | §8 profile、依赖分类、不可用策略 | planned environment |
| `05_test_plan_step_09_automation_gates.md` | §9 suite、gate、script、输出路径 | planned automation |
| `05_test_plan_step_10_nonfunctional.md` | §10 性能样本、安全、一致性、恢复、观测 | planned special tests |
| `05_test_plan_step_11_defects_retest.md` | §11 S/A/B、复验和关闭证据 | planned defect process |
| `05_test_plan_step_12_entry_exit.md` | §12 进入、退出、暂停与阻断 | planned criteria |
| `05_test_plan_step_13_evidence.md` | §13 EV 族、schema、目录和报告映射 | planned evidence schema |
| `05_test_plan_step_14_regression_risks.md` | §14 回归触发、全量集、残余风险 | planned regression |
| 当前正式 `00~04` | 正式需求、架构、概要、详细设计和配置真相源 | normative project input |
| 历史 `README`、旧 `05/06` | 识别旧协议、状态、路径和编号污染 | historical only |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织？ | 是。严格使用书写规范规定的 1～15 章名称，不把 Step 讨论栏目直接复制进正文。 |
| 是否保留全部 P0 测试对象、场景、数据、环境、门禁和证据？ | 是。七模块、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、UoW/CAS/replay、配置、redaction、dependency 和 report integrity 均有正式章节落点。 |
| 是否删除 SOP 问题原文和讨论语气？ | 是。正文只保留测试方案结论、约束和可执行矩阵；问题回答、诊断、取舍、停审记录留在 calibration。 |
| 未确认项如何处理？ | 进入 §14 残余风险和 §1 / §8 / §9 的 blocked-aware 规则；不把 pending、fake、blocked 或 not-run 写成通过。 |
| P0 用例如何回指详细设计？ | §6 用例按 `03` 的正式对象、协议、状态、错误、UoW 和 phase 断言编排；TC 只作为 planned 用例标识，证据实例留给后续真实运行。 |
| 如何防止旧状态、旧字段或 phase 越界？ | 以当前 `03` 和 Step 6～10 的正式名称为唯一测试断言来源；排除旧 persona / endpoint、CloudEvents 具体 type、AG-UI、UDS、launch token、旧 P95 和旧 status。 |
| 能否直接被 `06-验收标准.md` 消费？ | 能作为 planned 输入：§5 的 AC/VF 覆盖、§6 的 TC、§9 的 gate、§13 的 EV schema 和 §14 的 residual 可供 06 引用；不在 05 做验收 verdict / signoff。 |

## 5. 历史材料与污染诊断

| 历史内容 | 处理结论 |
|---|---|
| 旧 persona / endpoint 测试主线 | 丢弃；当前以 CP01～CP07、正式 34 对象和 10/16/14/5 协议分母为准 |
| CloudEvents / W3C 具体 member type、source、route | 只承接 Core 当前共享 envelope 类别；member-specific schema / route 由 `L2M-UP-005` 保持 pending |
| AG-UI、UDS、launch token、固定端口和 supervisord | 不进入正文；没有当前正式 authority |
| 旧 P95、SLA、吞吐数字 | 删除；`NFR-L2M-001~003` 只保留阶段分解 sample / trend |
| 旧“事件已发布 / delivered / observed / accepted”断言 | 删除；当前只允许 local decision、attempt、gap、blocked 或 unknown |
| 旧 `TC-001`、静态 EV、latest 路径 | 不继承；TC 使用 planned `TC-L2M-*`，正式 EV 只能由真实 artifact/report 推导 |
| 旧 fake / staging 默认成功 | 删除；profile、slot 和 disposition 必须显式，外部 positive 未闭合时 blocked / not_run |

## 6. 设计取舍

| 议题 | 正式 05 取舍 |
|---|---|
| 正文详细到何种粒度 | 达到 `L1-governance` 的矩阵粒度；保留可执行断言，但不复制 03 的全部字段卡和函数签名 |
| TC / EV 是否冻结为执行事实 | 否。TC 是 planned 设计标识；EV 只定义族和 schema，实例必须由真实 suite artifact/report 生成 |
| 24 candidate 如何表达 | 只列 non-materialization / dependency boundary；不创建 envelope、publisher、outbox、topic、route、retry、DLQ 或 delivery 测试 |
| 外部 seam 如何表达 | 用 local attempt / gap、controlled / fake、blocked / waiting / unknown；不以 fake success 替代 host、Runtime、Bus、resolver、image 或 durable Store truth |
| 性能如何表达 | 记录阶段 duration / dependency posture / item count sample；无来源硬阈值，不阻塞当前 P0 退出 |
| 证据如何表达 | 固定规范路径和最小 schema，占位 `<run_id>` / `<computed-digest>`；不生成真实运行、报告或 verdict |

## 7. 正式章节与校准来源映射

| 正式章节 | 主要校准来源 | 章节必须保留的结论 |
|---:|---|---|
| §1 | `05_test_plan_step_01_input_boundary.md` | 输入权威层级、历史隔离、blocker 传递 |
| §2 | `05_test_plan_step_02_scope.md` | 测试目标、范围 / 非范围、P0/P1/P2 和一票否决关联 |
| §3 | `05_test_plan_step_03_test_objects_cuts.md` | 七模块、CP、协议分母、24 candidate、28 状态和一致性切口 |
| §4 | `05_test_plan_step_04_strategy_layers.md` | 六层策略、首要发现层、P1 selected-run 资格 |
| §5 | `05_test_plan_step_05_traceability_coverage.md` | C/FR/BR/NFR/AC/VF ↔ 设计 ↔ cut ↔ TC/EV 候选 |
| §6 | `05_test_plan_step_06_cases.md` | 10 Command、16 Query、14 Consumer、5 Job、共用边界用例 |
| §7 | `05_test_plan_step_07_test_data.md` | DS-L2M 数据集、builder、隔离、清理、替身 |
| §8 | `05_test_plan_step_08_environment_config.md` | profile、拓扑、配置组、compile/runtime/event/ref 分类 |
| §9 | `05_test_plan_step_09_automation_gates.md` | suites、gate、脚本目录、artifact/report root 和阻断 |
| §10 | `05_test_plan_step_10_nonfunctional.md` | 性能 sample、安全、一致性、恢复、观测和配置专项 |
| §11 | `05_test_plan_step_11_defects_retest.md` | S/A/B、复验矩阵、缺陷 disposition 分离 |
| §12 | `05_test_plan_step_12_entry_exit.md` | 可判定进入 / 退出、暂停和 blocked 规则 |
| §13 | `05_test_plan_step_13_evidence.md` | EV 族、最小 schema、归档目录、报告生成和真实性 |
| §14 | `05_test_plan_step_14_regression_risks.md` | 变更触发、全量 P0、残余风险和接受人 |
| §15 | 本 Step；规范参考 | 参考、权威顺序和读者入口，不新增测试结论 |

## 8. 正式文档写入前检查

```text
本次写入类型: 正式正文回填 + 静态自检
目标文件: projects/L2-member/05-测试方案.md
对应模块: formal-document-assembly
项目级门禁: pass
文档级门禁: pass
Step / 模块级门禁: pass
思考记录状态: done（Step 1～14 已完成）
正文污染检查: no（不写 SOP 问题回答、诊断、过程性停审记录）
批次规则误用: no（正文分批写入；100～300 行只约束单批次）
测试执行 / implementation / commit: prohibited
```

## 9. 组装后静态审计清单

| 审计项 | 判定口径 | 结果 |
|---|---|---|
| 15 章完整 | §1～§15 标题与规范一致 | `pass` |
| 章节来源 | 每章列出具体 `design-calibration/05_test_plan_step_*.md` | `pass` |
| P0 分母 | 7 模块、10/16/14/24/5、28 状态均出现 | `pass` |
| 设计闭环 | TC 回指 `03` 对象 / 协议 / 状态 / 错误 / flow | `pass` |
| 历史污染 | 无旧 persona / endpoint 作为当前测试对象、无旧状态 / 协议 / 端口 / P95 断言；历史词仅出现在隔离说明 | `pass` |
| phase 边界 | 无 host accepted、Runtime executed、Bus delivered、downstream accepted、observed、evidence、readiness 断言 | `pass` |
| Query / Job 红线 | Query no-write；Job no-source-truth-repair | `pass` |
| 24 candidate | 仅 non-materialization；无事件设施物化 | `pass` |
| 依赖分类 | 仅 `core-contracts` 为 planned compile candidate；其余分类明确 | `pass` |
| 证据真实性 | 无真实 run_id、artifact、report、EV、verdict、signoff、readiness；无 `latest` 证据引用（仅保留禁止规则） | `pass` |
| fake / blocked | 未伪装 positive integration 或 evidence | `pass` |
| blocker 保留 | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-005` 保持开放 | `pass` |

## 10. 章节级回填自检

| 章节 | 自检结果 |
|---:|---|
| §1 | 输入权威、测试不回答项和 blocker 影响已写；不新增需求 |
| §2 | P0 只测 member-local truth / fail-closed / safety；P1/P2 边界明确 |
| §3 | 七模块、CP、协议、状态、事务、配置、观测对象可反查 |
| §4 | Unit → service → fake integration → entry → release 的发现层级明确 |
| §5 | C/FR/BR/NFR/AC/VF 双向矩阵无孤儿；性能阈值标记 pending |
| §6 | 每个 P0 用例有前置、操作、正式断言、自动化候选和证据候选 |
| §7 | 数据集、构造、隔离、清理和替身边界可重复 |
| §8 | profile、配置组、依赖类型和不可用姿态可定位 |
| §9 | suite、触发器、阻断级别、脚本 / 输出路径和 blocked 处理完整 |
| §10 | 专项方法不越权到外部 truth；硬性能数字未写入 |
| §11 | S/A/B 与 disposition 分离；复验触发可判定 |
| §12 | 进入 / 退出 / 暂停条件无模糊通过语句 |
| §13 | EV 只从真实 artifact/report 推导；初稿不写 verdict |
| §14 | 回归与 residual 有 owner / 待确认项；P0 红线不可接受 |
| §15 | 参考入口不新增设计真相源 |

## 11. 待确认事项与持续 blocker

| 项目 | 影响 | 正式 05 处理 |
|---|---|---|
| `L2M-UP-001` host / IPC / credential | host positive qualification | local boundary + blocked lane；待 owner exact contract |
| `L2M-UP-002` image release / compatibility | image / assembly selected run | opaque ref / availability；不测镜像 truth |
| `L2M-UP-003` Runtime entry mapping | positive Runtime admission | missing mapping refusal / blocked |
| `L2M-UP-004` Runtime handoff / feedback | outcome / publication qualification | attempt / gap / unknown fence |
| `L2M-UP-005` Core / Bus member-specific schema / route | 24 candidate event qualification | zero configuration / non-materialization |
| `L2M-UP-006` credential / identity anchor shape | admission positive | opaque ref / fail-closed |
| `L2M-UP-007` screening taxonomy | positive screening allow lane | unknown / stale / conflict conservative |
| `L2M-UP-008` non-project subject | future subject support | reject / blocked |
| `L2M-DDD-001~007`、`scope_supersede_gap` | repo / Store / receipt / helper / transition | logical / fake / refusal / reserved；不伪补 |
| workload / SLO authority | NFR hard threshold | stage sample / trend；转后续验收确认 |

## 12. 进入下一步条件

- [x] 正式 05 已按规范 15 章主链重建。
- [x] 每章拥有具体 calibration source 和延伸阅读入口。
- [x] 所有 P0 对象、切口、用例、数据、环境、门禁、专项、证据和回归均有正文落点。
- [x] 历史污染、phase 越界、依赖分类、24 candidate non-materialization 和 fake / blocked 伪通过均已审计。
- [x] 没有创建实现脚本、fixture、artifact、report、EV 实例或测试执行结果。
- [x] 没有修改 sibling 或其他项目文档。

下一正式动作必须是：等待用户审查并明确确认后，才允许创建 `06-验收标准.md` Step 1。当前不进入 06。

## 13. 停审结论

本 Step 结论：`completed / pass_with_upstream_and_design_blockers / stop_review`。

正式 `05-测试方案.md` 是可供后续 `06` / `07` 消费的 planned 测试设计输入，但不代表任何测试已经执行、任何 EV 已产生、任何验收已通过或任何 readiness 已成立。所有上游与设计 blocker 原样保留，用户未确认前不得进入下一正式文档。
