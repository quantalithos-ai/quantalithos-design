# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节：`05-测试方案.md` §4
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_04_strategy_layers.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与边界

本 Step 决定每类 Console 风险最早应在哪一层被发现，使状态、权限、来源保真、唯一提交、局部降级、配置与 forbidden-body 等高风险断言不被推迟到 E2E。分层名称以浏览器客户端和正式 03 的十模块为主语，不套用 Governance 的 repository、UoW、outbox、worker 或 job 结构。

本 Step 只定义 planned 测试职责与失败阻断关系，不定义具体 TC/EV、runner、脚本、CI 产品、环境、run_id、artifact、report 或当前测试结果。目标实现仓尚未建立，所有 suite 均为未来合同。

## 2. 输入

| 输入 | 本 Step 用途 |
|---|---|
| Step 3 的 19 个 cut | 建立 cut→主发现层→辅助层映射 |
| 03 §5～§8 | 固定十模块、5 Command、16 Query、conditional consumer 与 0 Event/Job |
| 03 §9～§12 | 固定状态、carrier、一致性、错误、恢复、并发与 no-replay 断言 |
| 03 §13～§15 | 固定 binding、diagnostic/a11y 和最小测试入口 |
| 04 §5～§12 | 固定 strict JSON、四项配置、三 profile、startup-only 与 failure posture |
| Step 2 P0/P1/P2 | 区分当前 safety gate、合同到达后的 selected integration 与 authority-required 专项 |

## 3. SOP 问题回答

| 问题 | Console 收口回答 |
|---|---|
| 哪些问题必须在 unit 层发现？ | typed ref/factory、AccessContext 与 guards、五轴状态、draft/request/result phase、TopicActivation、recovery ceiling、whole-record scope、config parser/validator、redaction/low-cardinality 规则。 |
| 哪些问题必须在 service 层验证编排？ | Console 不设 service 层，等价责任由 module/flow 层承担：5 Command、16 Query、context switch、single submit、formal reconcile、late-result drop、owner-partition composition、Query no-write。 |
| 哪些问题依赖 DB/adapter/worker 集成？ | DB/repository/worker/job 均不适用且应由静态检查禁止；只有 narrow Port、fake/formal parity、safe mapper、carrier、host、sink、runtime builder 和 owner partition failure injection 进入 adapter/controlled composition 层。 |
| 哪些问题需要 API/contract test？ | 03 的 Protocol union、Port callable surface、required/safe fields、typed error/cancel/unknown mapping、fake/formal parity、conditional consumer disabled contract；不猜 owner 私有 transport 或 exact pending DTO。 |
| 哪些场景才需要 E2E/release gate？ | 仅最小客户端闭环、profile 装配、跨页面安全姿态、redaction/static/traceability 汇总；不替代底层断言，也不证明 owner 内部、真实生产或 blocked positive surface。 |

## 4. 当前问题诊断与取舍

| 议题 | 不采用 | 本轮采用 | 理由 |
|---|---|---|---|
| 分层主语 | 旧文档的 service/repository/event-chain | 客户端 module/Port/composition/semantic/static | 与正式十模块及 0 Event/Job 对齐 |
| 高风险发现位置 | 用最终页面/E2E 兜底 | 纯规则和 flow 前置 | 能精确定位授权提升、写副作用与 phase 漂移 |
| integration 条件 | 假定真实 owner/SDK DTO | deterministic fake + formal parity contract；positive blocked 保真 | exact contracts 尚未闭口 |
| a11y | 只做截图或人工浏览 | semantic model + shared action/guard + host fake | 视觉、键盘、AT 必须同一语义路径 |
| release gate | 作为 readiness 总判定器 | 只汇总 suite/report/redaction/traceability | 05 不拥有 verdict/readiness |
| 性能 | 继承旧 P95/SLA | 有界性/无放大结构断言；数字 pending | 无量化 authority |

## 5. 测试分层图：L5-console 风险发现栈

```text
[Release gate / future evidence assembly]
  - minimal client smoke / profile smoke
  - suite-report completeness / redaction / traceability summary
                    ^
                    |
[Architecture / static checks]
  - SDK-only / no DB-repository-private bus-BFF-worker
  - 0 outbound Event / 0 Operations Job / no forbidden import
                    ^
                    |
[Semantic accessibility / presentation contract]
  - visual-keyboard-AT same guard/action/outcome
  - focus / announcement / recovery fallback
                    ^
                    |
[Composition / controlled integration]
  - runtime builder / profile isolation / owner partition fan-out
  - partial dependency / host-carrier-sink failure injection
                    ^
                    |
[Port / adapter contract]
  - narrow callable surface / fake-formal parity / safe mapper
  - typed error-cancel-unknown / carrier-host-sink contracts
                    ^
                    |
[Module / flow]
  - 5 Command / 16 Query / disabled consumer
  - single submit / no-write / late-result / recovery
                    ^
                    |
[Unit / pure contract]
  - factories / guards / state matrix / config / redaction
```

关键纪律：

- 箭头表示由局部断言向组合证明累积，不表示上层可替代下层。
- P0 的授权收紧、Query no-write、unknown no-replay、forbidden-body 和局部隔离必须在 release gate 之前失败。
- formal positive adapter、observed invalidation、production diagnostics、具体 browser/AT 与量化专项在 authority 缺失时保持 blocked/conditional。
- DB/repository/UoW/outbox/worker/job 不是缺失的集成层，而是本仓应被静态否决的越界实现。

## 6. 测试分层表

| 层级 | 目标 | 典型内容 | future 执行时机 | P0 失败处理 |
|---|---|---|---|---|
| Unit / pure contract | 最早发现纯对象、状态与安全规则错误 | factory/guard、typed ref、五轴、phase/state matrix、strict config、redaction | local/PR fast suite | 阻断；不得进入组合验证 |
| Module / flow | 验证正式函数级编排和副作用上限 | 5 Command、16 Query、consumer disabled、single-flight、late drop、formal reconcile | PR/CI flow suite | 阻断；定位到 module/protocol |
| Port / adapter contract | 验证边界 callable surface 与映射保真 | fake/formal parity、safe mapper、typed error/cancel/unknown、carrier/host/sink | PR/CI contract suite | 阻断；positive contract 未到则该 case 明确 blocked |
| Composition / controlled integration | 验证装配、分区与故障隔离 | runtime builder、profile matrix、owner fan-out、partial dependency、failure injection | CI controlled-integration suite | P0 safety 失败阻断；P1 positive 缺口留风险 |
| Semantic accessibility / presentation | 验证各呈现通道使用同一 guard/action 与恢复上限 | semantic regions、keyboard/AT、focus、announcement、error/recovery presentation | CI semantic suite + future selected compatibility | P0 语义不等价阻断；具体兼容缺 authority 时 blocked |
| Architecture / static | 防止边界与依赖结构漂移 | SDK-only、forbidden imports/units、0 Event/Job、no raw body/static secret | PR/CI static suite | 任一 VETO 候选阻断 |
| Release gate / evidence assembly | 汇总最小闭环和未来证据链完整性 | client/profile smoke、redaction scan、suite/report manifest、AC/VETO traceability | release candidate | P0 缺失/失败阻断送验；不自行签发 verdict |

## 7. 19 个 Cut 到层级映射

| Cut ID | 主发现层 | 辅助层 | 最早 P0 断言 | Positive blocker 姿态 |
|---|---|---|---|---|
| `CUT-CON-ENTRY` | Unit + Composition | Semantic | bootstrap/replacement/closed terminal；state load 不产生 presentable | exact host/framework 与真实 runtime blocked |
| `CUT-CON-ACCESS` | Unit / pure contract | Port contract | formal-only positive、local-only tightening、minimum disclosure | scope/visibility exact surface blocked |
| `CUT-CON-NAV` | Module / flow | Semantic + Composition | route/menu/history 不授权；direct link 同 guard；旧 scope cleanup | concrete router/host integration blocked |
| `CUT-CON-VIEW` | Unit + Module | Port contract | 五轴不压平、safe-map-before-filter、formal empty、Query no-write | owner safe-field/formal positive blocked |
| `CUT-CON-INTENT` | Unit + Module | Port + Composition | phase 分离、single submit、receipt≠result、unknown no replay | exact owner Command/Result positive blocked |
| `CUT-CON-TOPIC` | Module / flow | Composition | canonical owner order、partial isolation、strict empty、six-facet activation | per-owner positive material conditional |
| `CUT-CON-RECOVERY` | Unit + Module | Semantic | subject ceiling、immutable plan、one action、stale rejection | real host/requery contract selected cases conditional |
| `CUT-CON-ADAPTER` | Port / adapter contract | Composition + Static | narrow surface、safe mapper、typed failure、fake parity | formal adapter selected tests blocked |
| `CUT-CON-STATE` | Port contract | Module + Composition | exact-scope whole-record、replace/invalidate/clear、ambiguous reload | configured durable medium excluded/P2 |
| `CUT-CON-DIAG` | Unit + Port contract | Static + Release scan | whitelist、redaction、low cardinality、sink isolation、not audit | production envelope/sink blocked |
| `CUT-CON-A11Y` | Semantic contract | Module + host fake | visual/keyboard/AT same action/guard；focus/announce failure isolated | concrete browser/AT matrix blocked |
| `CUT-CON-COMMAND` | Module / flow | Port contract | five named flows；only submit may call owner write；cancel/unknown boundaries | delegated submit positive blocked by exact contract |
| `CUT-CON-QUERY` | Module / flow | Port spies + Composition | sixteen named union paths、zero owner/carrier/command write | positive owner value fixtures conditional |
| `CUT-CON-CONSUMER` | Module + Static | Future Port contract | disabled/pending-contract、zero-write、explicit Query remains core | observed body/scope/order/dedup blocked |
| `CUT-CON-STATE-MATRIX` | Unit / pure contract | Module | legal tightening、illegal elevation、formal-only recovery、terminal closure | none for negative matrix；positive facts may need formal fixture |
| `CUT-CON-CONSISTENCY` | Module / flow | Controlled integration | deterministic order、late drop、single-flight、no replay、conservative race | multi-tab/CAS/durability out of P0 |
| `CUT-CON-ERROR` | Unit + Module | Semantic + Port | typed construction→port→protocol→page、redaction、recovery ceiling | exact formal error mapping conditional |
| `CUT-CON-CONFIG` | Unit + Composition | Static + Release smoke | whole-document strict、required/default、zero-secret、profile isolation/failure | production-ready profile and real bindings blocked |
| `CUT-CON-ARCH` | Architecture / static | Release summary | SDK-only、forbidden units/imports、0 Event/Job | 无；属于可完整设计的 P0 negative gate |

## 8. 高风险断言的最早发现层

| 高风险断言 | 最早层 | 不得只依赖 | 原因 |
|---|---|---|---|
| 缺失/撤销语境仍披露或提交 | Unit guard + Module flow | E2E 截图 | 必须穷举状态并验证零调用 |
| Query 偷写 carrier/owner 或触发 command | Module flow + Port spy | 页面结果 | “无写”需要可观察调用账本 |
| transport/toast/receipt 冒充 confirmed | Unit phase + Module flow | 人工页面检查 | phase 转移可表驱动穷举 |
| ambiguous command 自动 replay | Module deterministic flow | release smoke | 需控制 dispatch boundary 与调用次数 |
| owner 局部失败被扩散或掩盖 | Composition | 单模块 unit | 需控制多 partition 完成顺序与失败组合 |
| forbidden body 进入 state/error/diagnostic/report | Unit redaction + Static/Release scan | 最终人工抽样 | 规则与实际输出面均需自动检查 |
| UI/config/阈值产生 active/verdict/readiness | Unit activation + Composition | E2E 文案 | 六 facet 与 authority source 必须可精确断言 |
| a11y 使用不同 guard/action 或无恢复 | Semantic contract + Module | 视觉 smoke | 核心等价性是行为契约，不是样式检查 |
| 越界引入 DB/repository/private bus/BFF/worker | Architecture/static | code review | 必须形成可重复阻断的结构检查 |

## 9. E2E / Release Gate 边界

| 场景 | 是否进入 future gate | gate 证明什么 | gate 不证明什么 |
|---|---|---|---|
| restricted bootstrap→safe navigation→owner-safe query | 是，P0 minimal smoke | 客户端组成可保持 fail-closed 与来源姿态 | 不证明 owner 内部、production readiness |
| draft→review→conditional submit→receipt/result/unknown | 有条件 | exact command fixture 可用时证明最小 phase 闭环；否则验证 blocked/no-submit | 不以 fake success 代替 formal positive |
| eight-topic partial composition | 是，controlled smoke | canonical composition 与局部降级 | 不证明八 owner 全部 ready |
| three-profile assembly | 是，P0/P1 分态 | local-fake 可控装配；pending profiles 保持 pending/fail-closed | profile 名不构成可发布证明 |
| redaction/forbidden dependency scan | 是 | 实际 future artifact/report/source tree 无禁止材料/结构 | 不替代 unit mapper/redaction 断言 |
| concrete browser/AT compatibility | authority 到达后 selected gate | 指定组合上的核心路径兼容性 | 当前不能声称覆盖或通过 |
| performance/load sample | authority 到达后专项 | 指定环境、窗口和样本的测量事实 | 无阈值时不判 pass/readiness |
| full cross-repo E2E | P1/P2 selected | 正式合同消费差异 | 不作为 Console P0 safety plan 的默认前置 |

## 10. 跨层覆盖审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 19/19 cut 是否有主发现层 | pass | §7 全量映射 |
| 10 模块、5 Command、16 Query、consumer 是否可定位 | pass | Unit/Module/Port/Composition 层共同承接 |
| Event/Job absence 是否受保护 | pass | Architecture/static 明确 0 surface |
| 是否误引入 service/repository/worker/job | pass | 分层使用客户端主语，越界项只作 negative static gate |
| P0 高风险是否被推给 E2E | pass | §8 均有更早主发现层 |
| Query no-write 是否可精确断言 | pass | Module flow + recording Port spies |
| a11y 是否被降为人工 UI 检查 | pass | 独立 semantic contract 层 |
| blocked positive 是否被伪装为可执行 | pass | §7/§9 显式 conditional/blocked |
| release gate 是否越权签发 readiness | pass | 只汇总 future evidence，裁决留给 06 |
| 数字阈值/真实环境是否被发明 | pass | 未定义数值、runner 或产品 |

## 11. 对上游设计的影响

| 结论 | 是否回写 00～04 | 处理 |
|---|---|---|
| Console 需要七层客户端测试策略 | 否 | 是现有十模块和横切切口的测试组织方式 |
| Query no-write 需要 recording spies | 否 | 属于 future 测试工具边界，Step 9 收口 |
| source/dependency/redaction 需要 static scans | 否 | 属于 future gate，Step 9/13 收口 |
| scripts/gates/checks/reports 将成为正式 planned layout | 待 Step 9 | 到 Step 9 受控回写 03 Step 4/16 与正式 §4 |
| exact positive/compatibility/quantitative case blocked | 否 | 与 `CON-Q-034～047` 一致 |

## 12. 正式回填草稿

正式 §4 应回填：

- 七层风险发现栈与分层表；
- 19 cut 到主发现层/辅助层的映射；
- 高风险最早发现层与 P0 阻断语义；
- E2E/release gate 的有限职责及 blocked positive posture；
- DB/repository/worker/job 不适用且属于架构静态否决项。

> 校准来源：`design-calibration/05_test_plan_step_04_strategy_layers.md`
>
> 延伸阅读：建议继续阅读本文件的“测试分层图”“19 个 Cut 到层级映射”“高风险断言的最早发现层”和“E2E / Release Gate 边界”。

## 13. 进入 Step 5 条件

| 条件 | 结论 |
|---|---|
| 分层覆盖全部 19 个 P0 cut | pass |
| 高风险均有 release gate 之前的发现层 | pass |
| 每层失败阻断与 blocked posture 明确 | pass |
| 未引入本仓不存在的服务端层 | pass |
| 可进入 Step 5 | pass |

Step 4 `done / pass / self_reviewed`；下一步建立需求/规则→设计→cut→TC 候选→future EV 的双向追溯与覆盖矩阵。
