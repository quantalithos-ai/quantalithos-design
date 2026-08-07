# L2-tools 05 测试方案校准流程

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md`
>
> 书写规范：`standards/document/测试方案书写规范.md`
>
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
>
> 目标正式文档：`projects/L2-tools/05-测试方案.md`
>
> 当前模式：`full-restart / single-agent-serial`
>
> 当前状态：`05_completed_stop_review`

## 1. 本轮目标

把当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md` 转译为一份可执行、可追溯、可留证但不伪造执行事实的测试方案。正式 `05-测试方案.md` 只能在 Step 15 由 Step 1~14 的中间产物装配；Step 1~14 期间正式正文保持锁定。

测试方案的直接真相源是当前正式 00~04，尤其是：

- `00` 的 `C-L2T-*`、`FR-L2T-*`、`BR-L2T-*`、`DR-L2T-*`、`NFR-L2T-*`、`AC-L2T-*`、`VF-L2T-*` 与 `L2T-UP-*`。
- `01` 的 owner、依赖类型、系统接缝、数据写权和架构硬约束。
- `02` 的六个主要组成部分、代码主体、公共接口骨架、关键处理流和状态轮廓。
- `03` 的七模块、对象/trait/store/port 契约、`CF-01~CF-13`、`QF-01~QF-11`、`IF-01~IF-05`、`OF-01~OF-04`、`JF-01~JF-04`、六状态族、事务/幂等/并发/错误/配置/观测契约，以及 §15 最小验证清单。
- `04` 的配置 root、配置来源/冲突、profile、敏感/ref-only、fail-fast/no-output 与 `CFG-T-*`、`CFG-A-*`、`CFG-F-*`、`CFG-X-*` 测试输入。

## 2. 权威输入与历史材料

| 输入 | 权威级别 | 用途 | 当前处理 |
|---|---|---|---|
| `00-需求文档.md` | 正式上游 | 需求、规则、数据归属、NFR、验收方向和 veto 方向 | 直接承接，不改写需求编号 |
| `01-架构设计.md` | 正式上游 | owner、依赖裁剪、交互、写权和架构红线 | 转成边界/接缝测试，不重选架构 |
| `02-概要设计.md` | 正式上游 | 组成部分、对象轮廓、接口骨架、处理流和状态 | 转成测试对象和层级 |
| `03-详细设计.md` | 直接设计真相源 | 函数级契约、字段、状态、错误、事务、幂等、并发、配置、观测、最小测试切口 | 作为用例 oracle 的唯一实现契约来源 |
| `04-配置设计.md` | 直接设计真相源 | 配置 schema、profile、来源、敏感性、加载/校验/生效和失败族 | 作为配置、环境和门禁设计输入 |
| 旧 `README.md` | `historical_material` | 识别旧定位污染 | 不产生当前测试事实、用例或证据 |
| 旧 `05-测试方案.md` | `historical_material` | 识别旧用例、阈值、路径和结果叙事 | Step 15 前不读取为 oracle，不追加旧编号 |
| 旧 `06-验收标准.md` | `historical_material` | 识别旧验收、签署和证据叙事 | 不继承旧结论；当前验收方向来自 `00`，正式06后续重建 |
| `L2T-UP-001~009` | open upstream boundary | 表示外部 owner/schema/mapping/route/client/measurement 缺口 | 设计 blocked/unavailable/unknown/negative cases，不写 positive closure |

## 3. Step 状态表

| Step | 主题 | 中间产物 | 回填章节 | 状态 |
|---|---|---|---|---|
| Step 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | §1 | `[x]` |
| Step 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | §2 | `[x]` |
| Step 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | §3 | `[x]` |
| Step 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | §4 | `[x]` |
| Step 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | §5 | `[x]` |
| Step 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | §6 | `[x]` |
| Step 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | §7 | `[x]` |
| Step 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | §8 | `[x]` |
| Step 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | §9 | `[x]` |
| Step 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | §10 | `[x]` |
| Step 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | §11 | `[x]` |
| Step 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | §12 | `[x]` |
| Step 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | §13 | `[x]` |
| Step 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | §14 | `[x]` |
| Step 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | 全文 | `[x] completed / pass; stop review` |

## 4. 全局测试设计纪律

| 纪律 | 当前口径 |
|---|---|
| 文档顺序 | 只在当前 `05` 完成前推进 Step 1~15；Step 15 后停审，不进入06。 |
| 正式正文时机 | Step 15 前不修改正式 `05-测试方案.md`；旧正文保持历史材料定位。 |
| 设计来源 | P0 测试切口必须回指 03 的具体模块、对象、协议、flow、状态、事务、错误、配置或观测契约。 |
| 状态命名 | 只使用 03 正式状态族和 enum label；禁止旧口语状态或自行同义化。 |
| 阶段边界 | 不把后续 phase 的 external delivery、observed、receipt、evidence、readiness 或 acceptance 结果写入当前用例 oracle。 |
| 阻塞语义 | `blocked`、`unavailable`、`unverifiable`、`unknown` 和 `fail-closed` 是计划测试结果类别，不是已执行结果。 |
| 证据纪律 | 只定义 planned evidence family、schema、artifact/report 路径和验收引用方向；不创建 run、alias、报告或通过结论。 |
| 依赖纪律 | 只有 `L0-core` 为 compile-time 依赖；Hub/Sandbox/Runtime 为 runtime seam；Bus/Observability 为 event collaboration；测试替身不能升级为 authority。 |
| 配置纪律 | 继承 04 的 canonical item、source priority、profile isolation、ref-only 和 no-output；不在05新增配置 key。 |
| 旧材料 | 旧 README/05/06 只用于差异和污染审计；若冲突，记录 `historical_material` 或 blocker，按当前00~04重建。 |

## 5. 总体门禁与停止点

### 5.1 项目级门禁

- [x] 用户已授权完整完成 `05-测试方案.md`。
- [x] 当前 `04-配置设计.md` 已完成停审，可作为正式上游输入。
- [x] 旧 `05/06` 已标记为 historical material，不作为当前真相源。
- [x] `L2T-UP-001~009` 已登记，后续只以显式 blocked/unavailable/unknown 方式承接。
- [x] Step 1~14 中间产物全部完成并通过跨 Step 追溯审计。
- [x] Step 15 通过 15 章来源、TC/EV、脚本路径、artifact/report schema、两阶段 evidence、gate-check 闭集、release 单 run/profile、acceptance manifest 生命周期和事实性审计。

### 5.2 文档完成停止点

Step 15 已完成；本 flow 与项目台账已更新为 `05_completed_stop_review`，正式05写入关闭。当前停在用户审阅门，不自动创建或读取 `06` 校准文件。正式06的输入只在用户下一次明确授权后重新读取对应 SOP、书写规范和当前正式00~05。

## 6. 当前恢复点

```text
current_document = 05-测试方案.md
document_status = 05_completed_stop_review
current_step = Step 15 completed / pass; stop review
current_module = formal_document_assembly:completed_stop_review
gate_status = completed / pass; stop review
formal_document_write = locked
next_allowed_action = wait_user_authorization_before_06
next_formal_document = 06-验收标准.md awaiting_user_authorization
upstream_blockers = L2T-UP-001~009 open
commit_required = false
```

## 7. Step 15 最终审计与停止记录

| 审计维度 | 结果 |
|---|---|
| 正式结构 | 15 章按规范顺序完成，每章有具体 Step 来源入口。 |
| 用例与数据 | 234 个 concrete TC 与 Step 6 集合差分为空；18 canonical dataset + 6 negative/recovery corpus。 |
| 自动化设计 | 13 suite、7 gate、11 mandatory check、7 report generator。 |
| 证据设计 | pre-check index / final seal 两阶段；固定 schema/version/digest/canonicalization、writer/reader 和 failure retention；candidate EV 不冒充实例。 |
| Gate/check | semantic suite 与 root check namespace 分离；formal check 闭集为 main/nightly/release 11、PR 10、integration/conditional-provider 9；single-suite 不生成 seal。 |
| Release | 单一 `ci-test` run/profile、11 P0 suite、scripted local controlled seam、same-run smoke；禁止跨 run/profile 拼证。 |
| Acceptance/review | pre-seal run staging、checks/redaction、single locked publisher、manifest-last、release seal 单向绑定；review post-seal append-only，不假设多文件原子替换。 |
| 回归与风险 | P0 full regression、S trigger、`L2T-RR-001~016` 和 06 handoff 完整。 |
| 事实纪律 | 无真实 run、commit、artifact、digest、结果、签署、evidence alias 或 readiness。 |
| Blocker | 无新增；`L2T-UP-001~009` 保持 open。 |
| 停止门 | 正式05锁定；06等待用户明确授权。 |

终审刷新日期：2026-08-07（设计文档审计日期，不是测试运行时间）。
