# L4-observability 05-测试方案 Step 15 · 正式文档装配

> 对应标准：`standards/document/测试方案讨论流程_SOP.md` Step 15、
> `standards/document/测试方案书写规范.md` §5.15，以及
> `standards/document/设计文档讨论中间产物规范.md` 的正式回填门禁。
> 本文件记录装配判断，不记录测试执行、真实 run、evidence alias 或验收签署。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `05-测试方案.md` |
| step | `15 / 正式文档装配` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `formal_test_plan_assembly_and_cross_chapter_gate` |
| formal_document_write | `completed_current_full_restart` |
| implementation / test execution | `not_started` / `not_run` |
| artifact / report / evidence | `absent_by_design`; only future run-scoped contracts exist |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，不由测试方案关闭 |
| gate_status | `pass_current_05_full_document_gate_with_inherited_affected_open` |
| next_allowed_action | `start_current_06_step_01_full_restart` |
| commit | 不需要；用户未要求提交 |

本 Step 只允许从 current Step 01~14 装配正式正文。旧 `05-测试方案.md`、旧 README 和旧 Step 15
均标记为 `historical_material`，不通过追加、局部替换或旧编号兼容成为 current truth。

## 1. 装配输入与权威顺序

| 优先级 | 输入 | 装配用途 |
|---:|---|---|
| 1 | `standards/document/测试方案讨论流程_SOP.md`、`测试方案书写规范.md` | 固定 15 章顺序、来源块、可执行性和评审清单 |
| 2 | `standards/document/设计文档编写通则.md`、`设计文档讨论中间产物规范.md` | 固定三层台账、full-restart、历史材料和真实性边界 |
| 3 | current `00-需求文档.md` through `04-配置设计.md` | 测试对象、字段、状态、依赖、配置和 truth owner |
| 4 | current Step 01~14 | 章节唯一设计来源和测试索引 |
| 5 | `projects/L1-governance/05-测试方案.md`、`projects/L1-artifact/05-测试方案.md` | 仅参考粒度、矩阵深度和证据组织方式 |
| 6 | 旧正式文档、README、旧 Step | 仅作 historical discrepancy，不提供 current 结论 |

装配规则：正式正文可以压缩讨论过程，但不能压缩掉可执行字段、状态、测试 ID、数据集、lane、suite、
脚本、artifact/report 路径、失败语义、VETO 和 residual 的裁决条件。

## 2. 旧材料与冲突处理

| 历史材料 | 冲突 | current 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 仅有少量旧 TC、旧 profile 和旧 suite，未覆盖 current 99-row manifest | 全文替换；旧文件只作 historical material |
| 旧 `06-验收标准.md` | 可能引用旧 evidence、旧验收状态和未固定的路径 | 05 只提供 planned input；新版 06 full-restart 后独立裁决 |
| 旧 README / 旧性能数字 | 混入 TimescaleDB、Grafana、P95、事件数量和生产假设 | 不进入 P0；性能只保留 sample/trend 设计 |
| 旧 Step 09 脚本表 | 含未被 `03` current contract 预留的脚本 | 只保留五个 current script contract |
| 旧 `EV-*` / passed 文本 | 可能看起来像执行事实 | 全部不继承；current 只允许 `EV-CAND-OBS-*` planned linkage |

## 3. 正式章节来源映射

| 正式章节 | current 校准来源 | 装配内容 |
|---|---|---|
| §1 上游关系 | `05_test_plan_step_01_input_boundary.md` | 输入边界、上游依赖、truth owner、历史材料处理 |
| §2 目标与范围 | `05_test_plan_step_02_scope.md` | P0/P1/P2、非范围、接缝和 VETO 关系 |
| §3 测试对象与切口 | `05_test_plan_step_03_test_objects_cuts.md`、`03_ddd_step_16_test_cuts.md` | 七模块、60 exact protocol、27 formal state owners + 1 technical coordination state、16 canonical cuts |
| §4 策略与分层 | `05_test_plan_step_04_strategy_layers.md` | unit/service/integration/API-worker/release 的风险分层 |
| §5 追溯与覆盖 | `05_test_plan_step_05_traceability_coverage.md` | FR/BR/DO/NFR/AC/VF 双向追溯和 orphan audit |
| §6 场景与用例 | `05_test_plan_step_06_cases.md` | 99 个 exact `TC-OBS-*` 及其断言、affected disposition |
| §7 测试数据 | `05_test_plan_step_07_test_data.md` | 82 个 exact `DS-OBS-*`、构造、隔离、清理和禁止数据 |
| §8 环境与配置 | `05_test_plan_step_08_environment_config.md`、`04-配置设计.md` | 6 lane、3 profile class、依赖类型和失败承载 |
| §9 自动化门禁 | `05_test_plan_step_09_automation_gates.md` | 9 primary suite、5 scripts、gate context 和产物路径 |
| §10 专项与非功能 | `05_test_plan_step_10_nonfunctional.md` | 12 专项主轴、fault injection、telemetry/evidence safety |
| §11 缺陷与复验 | `05_test_plan_step_11_defects_retest.md` | S/A/B/R、VETO、复验范围和关闭证据 |
| §12 进入与退出 | `05_test_plan_step_12_entry_exit.md` | design/test entry、exit、blocked/not_run/conditional |
| §13 报告与证据 | `05_test_plan_step_13_evidence.md` | run-scoped raw/report、99-row join、review/acceptance handoff |
| §14 回归与残余风险 | `05_test_plan_step_14_regression_risks.md` | 变更触发表、全量 P0、不可接受项和 residual |
| §15 参考 | 本文件 §3 及通用标准 | 可追溯参考，不新增测试结论 |

每个正式章节必须在正文开始处保留具体 `design-calibration/...` 校准来源块。不得写“详见
design-calibration”或“由前序讨论得出”这类不可定位引用。

## 4. Current 索引完整性

| 索引 | current 数量 /约束 | 装配门禁 |
|---|---:|---|
| canonical test cuts | 16 | 每个切口至少有正向、负向或边界断言，并能回指 `03` |
| exact protocols | `16 + 14 + 9 + 12 + 9 = 60` | 不得用 family 记录代替 exact protocol 入口 |
| formal state owners | 27 | 另有 1 个 technical coordination state，不升格为业务 truth |
| exact test cases | 99 | 每个 `TC-OBS-*` 只拥有一个 primary suite |
| exact datasets | 82 | 每个 required TC 至少有一个合法 dataset anchor |
| primary suites | 9 | 只能使用 `S-OBS-*` current suite 名称 |
| environment lanes | 6 | ISO、INT、RT、disabled/controlled 语境不得互相升级 |
| current scripts | 5 | 只能使用 §9 中列出的五个路径 |
| candidate evidence linkage | 99 | `EV-CAND-OBS-*` 仅为 planned linkage，不是正式 evidence alias |

装配前 join 结论：Step 07 与 Step 09 均提供 99 行索引；缺失 dataset=`0`、candidate EV 错配=`0`、
重复 primary=`0`。该结论是设计期结构校验，不是测试运行结果。

记录修正：此前的 `28 state corpus` 是把技术协调状态与业务 truth owner 合并后的历史计数，现统一写为
`27 formal state owners + 1 technical coordination state`。Step 04 中的旧 gate 名称同样只保留为
`historical_layer_mapping`，current automation 以 `S-OBS-*` 为唯一 suite 词汇。

## 5. 正式文本真实性门禁

正式 05 中允许出现的状态词：`planned`、`not_started`、`not_run`、`blocked`、`conditional`、
`not_evaluated`、`historical_material`、`inherited_affected`。以下词只可作为未来执行规则描述，
不得被写成当前事实：`passed`、`green`、`accepted`、真实 `run_id`、真实 `EV-OBS-*`、`signoff`。

以下边界必须在 §§1、2、6、9、10、13、14 重复保持一致：

1. Observability 只拥有观测/审计投影、telemetry、evidence linkage、retention marker 和 report handoff。
2. Query、diagnostic、rebuild、report、export、telemetry sink 不得反写任何 source truth。
3. raw body、secret、credential、evidence/artifact body 和 full sensitive ref 不进入输出。
4. `latest`、静态表、旧 run、手工 summary 不能生成 passed evidence 或 final verdict。
5. I05/H13 等 inherited affected 只能生成 fail-closed、controlled blocked 或 conditional 设计分支。

## 6. 正式文档自审矩阵

| 检查项 | 结论 | 证据入口 |
|---|---|---|
| 15 章主链和章节名称符合规范 | `pass` | 正式 `05` §1~§15 |
| 每章都有具体校准来源 | `pass` | 正式各章节来源块；本文件 §3 |
| P0 用例、数据、suite、lane、脚本可追溯 | `pass_design` | current Step 06~09；正式 §§6~9 |
| 99 TC 与 99 candidate EV 同号 | `pass_design` | Step 09/13 exact join |
| 失败/blocked/not_run/indeterminate 未折叠为 pass | `pass` | Step 11~14；正式 §§11~14 |
| no-write、redaction、dependency 和 retention 红线明确 | `pass` | Step 10、Step 14；正式 §§10、13、14 |
| 旧字段、旧 suite、旧 profile 未作为 current truth | `pass` | 本文件 §2；正式全文扫描 |
| 真实测试、run、artifact、report、evidence、签署 | `not_run_by_design` | 无真实目标实现仓或运行环境 |
| inherited blocker / affected | `open` | 项目台账和正式 §14 |

## 7. 装配结果与下游承接

正式 `05-测试方案.md` 已按 §3 来源映射从 Step 01~14 current 产物重建。它可以作为新版 `06` 的测试裁决输入，
也可以作为新版 `07` 的测试/证据/门禁输入，但不替代两者的独立 full-restart。

新版 `06` 必须重新定义：固定验收基线、P0 AC、VETO、三值裁决、风险接受和签署口径；不得把本文件中的
`planned` 或 `EV-CAND-OBS-*` 直接写成验收通过。新版 `07` 必须重新定义：phase、task、boundary、实施前置、
commit gate 和 implementation ledger；不得把本文件的 suite 设计当作实现完成。

## 8. 进入下一正式文档条件

| 条件 | 状态 |
|---|---|
| current Step 01~14 均有独立中间产物 | `pass` |
| Step 14 已完成回归/残余风险闭口 | `pass_with_inherited_affected_open` |
| 正式 05 仅由 current Step 装配 | `pass` |
| 正式 05 不含真实执行或验收事实 | `pass` |
| 99/82/9/6/5 关键索引可回指 | `pass_design` |
| 新上游 blocker | `none` |
| next allowed | `start_current_06_step_01_full_restart` |
| commit | 不需要；用户未要求提交 |

## 9. 参考

- `standards/document/测试方案讨论流程_SOP.md`
- `standards/document/测试方案书写规范.md`
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/01-架构设计.md`
- `projects/L4-observability/02-概要设计.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L1-governance/05-测试方案.md`
- `projects/L1-artifact/05-测试方案.md`
