# Step 1. 确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节：`05-测试方案.md` §1
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_01_input_boundary.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 确认 05 应从哪些已停审需求和设计契约抽取测试输入、哪些问题不得在测试方案重答、哪些开放事项只能形成 blocked/conditional 测试切口。本 Step 不定义用例、suite、脚本或证据结果，也不把旧 05/06 当作当前 authority。

目标实现仓 `/home/aris/Projects/quantalithos-console` 尚未建立；因此本轮只能设计 planned verification contract，不能声称测试文件、runner、CI、环境、run_id、artifact、report、evidence 或 verdict 已存在。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| 正式 `00-需求文档.md` | `formal_stop_review` | C1～C6、FR/BR/DR/IF/DEP/NFR/AC/VETO 与主追溯矩阵 |
| 正式 `01-架构设计.md` | `formal_stop_review` | SDK-only、owner truth、数据/依赖/通信、降级与横切边界 |
| 正式 `02-概要设计.md` | `formal_stop_review` | 五组成部分、对象、接口、九组 flow、状态、异常和配置影响 |
| 正式 `03-详细设计.md` | `formal_stop_review` | 十模块、对象/Port、5 Command、16 Query、1 conditional consumer、状态/一致性/错误/并发/config/diagnostic/a11y |
| `03_ddd_step_16_test_slices.md` | `done` | 测试对象与最小切口直达输入 |
| `03_ddd_step_17_implementation_handoff.md` / Step 18 | `done` | 实施暂停条件、blocker 与事实诚实边界 |
| 正式 `04-配置设计.md` | `formal_stop_review` | 四项配置、profile/source、strict validation、zero-secret、startup-only、failure/rollback |
| `04_config_step_12_downstream_handoff.md` / Step 14 / Step 15 | `done` | 配置测试主题、验收门禁输入、风险与停审事实 |
| 旧 `05-测试方案.md` / `06-验收标准.md` / README | historical only | 污染审计；不得继承 TC、阈值、框架或旧对象 |
| `L1-governance` 05 calibration | 粒度参考 | 15-Step、小循环、矩阵、门禁和证据框架；不迁移领域语义 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 承接哪些需求、规则和非功能目标？ | 承接 `C-CON-1～6`、`FR-CON-001～018`、`BR-CON-001～033`、`DR-CON-001～030`、`IF-CON-001～013`、`DEP-CON-001～014`、`NFR-CON-001～021`、`AC-*` 与 `VETO-CON-001～007`；外围 `E*` 只作 conditional coverage。 |
| 哪些概要/详细设计章节直接影响测试对象？ | 02 §5～§11；03 §5～§15，尤其十模块、协议索引、逐 flow、状态矩阵、carrier/一致性、typed error、并发幂等、binding、diagnostic/a11y 和最小测试切口。 |
| 哪些验收项需要 05 提供证据？ | 00 §14 的 `AC-CON-001～007`、`AC-FR-001～013`、`AC-BR/DR/NFR` 与七项 VETO；新版 06 将引用 05 的 future EV 槽做裁决。 |
| 哪些内容不得重定义？ | owner/SDK DTO、状态/错误/函数名、truth ownership、Policy/Gate、safe-field、profile/schema/default、browser support、性能阈值、readiness、验收 verdict。 |
| 当前是否有阻塞测试设计的上游缺口？ | 无阻塞安全骨架与负向方案的缺口；`CON-Q-034～047` 按项阻塞 positive owner contract、invalidation observed、configured durability、production diagnostics、具体 browser/a11y compatibility 与量化 pass threshold。 |

## 4. 当前旧文档问题诊断

| 历史表达 | 问题 | 本轮处理 |
|---|---|---|
| `ConsoleWorkspace`、`PanelState`、`CrossPanelContext` 为正式对象 | 与 current 03 十模块/对象体系冲突 | 不继承；以 `ConsoleSessionShell`、`NavigationState`、`OwnerViewModel` 等正式名为准 |
| service + repo + projection + publisher | Console 无 DB/repository/projection/outbox/worker | 作为污染拒绝；静态测试反向证明这些 surface 不存在 |
| workspace store / action history | 形成未授权持久化与业务历史 | 替换为 exact-scope session-volatile `ClientStateCarrierPort` 与 body-free interaction record |
| `OpenWorkspace`、`OpenPanel`、`TriggerQuickAction` 等旧 flow | 不属于 03 的 5 Command/16 Query | 不迁移 TC；按 current protocol 重新编号 |
| P95 `<200ms`、`100%` 样本链等固定阈值 | 无场景/环境/窗口/owner authority | 不作为 pass/fail；性能只定义结构性方法和 pending authority |
| `reports/console-test` | 违反当前固定证据路径 | 使用 future `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| old `TC-001...` 无设计/EV 闭环 | 不能被新版 06 稳定引用 | 全量重建稳定 family ID 与 EV 槽 |

## 5. 改动前后对比

| 维度 | 旧材料 | 新输入边界 | 理由 |
|---|---|---|---|
| 测试主语 | workspace/panel/store 服务端式模型 | TypeScript browser client 十模块与窄 Port | 对齐正式 03 |
| 协议 | 旧自造 workspace/action flow | 5 Command、8 Core Query、8 Topic Query、1 conditional consumer | 使用正式协议名 |
| 持久化 | repository/projection/store | session-volatile exact-scope carrier | 对齐真相与一致性边界 |
| 集成 | 直接假定 source dispatch 和投影 | SDK/formal narrow adapters + deterministic fake parity | exact contract 未闭口时不伪造 |
| 非功能 | 固定阈值 | 结构性不变量 + pending quantitative authority | 避免无来源数字 |
| 证据 | 模糊日志/截图路径 | future EV→真实 suite artifact→run report→06 AC/VETO | 可追溯且不静态造证 |

## 6. 测试输入映射表

| 来源文档 | 测试输入 | 正式 05 回填章节 |
|---|---|---|
| 00 §7～§10 | 六能力、18 核心功能、33 核心规则 | §2、§5、§6、§10 |
| 00 §11～§13 | 数据归属、forbidden body、接口/依赖、21 NFR | §3、§7、§8、§10 |
| 00 §14～§16 | AC/VETO 与需求追溯 | §5、§12～§14 |
| 01 §4～§10 | 职责、SDK-only、owner partition、一致性、通信红线 | §3、§4、§8、§10 |
| 01 §13～§15 | 安全/a11y/diagnostic 横切、演进与风险 | §10、§14 |
| 02 §5～§10 | 五组成部分、对象、接口、flow/state/异常 | §3～§7 |
| 03 §5～§8 | 十模块、对象/Port、5+16+1 协议 | §3～§6 |
| 03 §9～§12 | flow、状态、一致性、错误、并发/幂等 | §3～§7、§10 |
| 03 §13～§15 | binding、diagnostic/audit、最小测试切口 | §3、§8～§10、§13 |
| 04 §5～§11 | source/profile/items/secret/loading/change/failure | §6～§10 |
| 04 §12～§14 | 05 handoff、future evolution、risk | §1、§8～§10、§14 |

## 7. 不再回答与必须回答的问题

| 不在 05 重答 | 05 必须回答 |
|---|---|
| 需求目标、owner truth 和架构选型 | 哪些正式契约在何层、用什么数据与断言验证 |
| DTO/Port/状态/error 的定义 | 每个 P0 用例如何逐字使用正式名称并负向验证 |
| exact owner surface 或浏览器支持清单 | 当前可执行 safety/fake cut 与 blocked positive cut 如何分开 |
| 配置 key/default/profile | 如何验证 strict schema、profile isolation、startup/failure/rollback |
| 验收通过、风险接受或 release readiness | 未来证据如何交给 06 做裁决 |
| 实现排期、runner/tool/package 选型 | planned suite/gate/script contract 与实现暂停条件 |

## 8. 上游缺口到测试姿态

| 缺口 | 可立即设计的验证 | 当前不可声称 |
|---|---|---|
| exact owner Query/Command/Result/Ref | blocked/read-only/partial、mapper reject、fake/formal parity contract | positive production integration 通过 |
| visibility/qualification/safe-field | missing/unknown fail-closed、minimum disclosure、forbidden reject | 真实 allow surface 完整覆盖 |
| reconciliation/idempotency | unknown/no-replay、surface missing blocked | successful reconciliation 或 safe replay |
| SDK invalidation envelope | disabled/pending-contract、zero-write | observed/apply/order/dedup 通过 |
| state medium/TTL/migration | session-volatile、scope/whole-record/cleanup | durable/cross-session/migration 通过 |
| browser/a11y matrix | semantic equivalence、shared guard/action key、fallback | 具体浏览器/AT compatibility 通过 |
| quantitative authority | boundedness、isolation、no unbounded fan-out | latency/load/SLO 数字通过 |

## 9. 上游设计影响判定

| 测试输入结论 | 是否影响 00～04 | 处理状态 |
|---|---|---|
| 测试只转译现有正式契约 | 否 | 无回写 |
| positive blockers 保持 conditional/blocked | 否 | 与正式风险一致 |
| 旧对象/阈值/路径全部拒绝 | 否 | historical contamination isolated |
| 后续如发现正式字段/状态无法形成断言 | 可能 | 暂停并回写对应 03/04；不得在 05 发明 |

## 10. 回填草稿

正式 §1 应写入上游输入映射、文档边界、blocked/conditional test posture 和旧材料拒绝结论；明确测试方案只定义未来验证合同，不表示测试已存在或执行。

## 11. 待确认事项

| 事项 | 当前影响 | 处理 |
|---|---|---|
| 目标实现仓与 runner/tooling | 无实际执行条件 | 07/实现阶段确认；05 使用 planned 名称，不写真实命令 |
| formal 06 尚未重建 | AC/VETO 最终裁决结构未定 | EV 先映射 00 AC/VETO；06 full-restart 时消费 |
| exact positive integration 与量化 authority | 部分 P0/P1 case 当前 blocked | 显式标记，不从 safety case 推导 readiness |

## 12. 进入 Step 2 条件

| 条件 | 结论 |
|---|---|
| 权威输入与用途明确 | pass |
| 不重定义问题与必须回答问题明确 | pass |
| 历史污染隔离 | pass |
| blocker 可转为明确测试姿态 | pass |

Step 1 `done / pass / self_reviewed`；允许串行进入 Step 2。
