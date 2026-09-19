# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节：`05-测试方案.md` §2
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_02_scope.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标

固定本轮测试方案要证明什么、P0/P1/P2 如何划分、哪些 external surface 只测 Console 接缝、哪些事项不在当前通过口径内。本 Step 不展开具体 TC/EV、数据、环境、脚本或执行结果。

## 2. 输入

| 输入 | 用途 |
|---|---|
| Step 1 输入边界 | 固定 authority、历史污染与 blocker posture |
| 00 §7～§16 | 六能力、核心/外围功能、规则、数据、NFR、AC/VETO、追溯 |
| 01 §3～§15 | 架构红线、owner boundary、依赖、通信、横切和风险 |
| 02 §5～§13 | 组成部分、对象、接口、flow/state/exception/config 与风险 |
| 03 §5～§17 / Step 16 | 十模块、5+16+1、状态/一致性/错误/并发/config/diagnostic/a11y 最小切口 |
| 04 §2～§14 | 四项配置、profile/source、strict validation、failure/rollback 与下游输入 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| P0 必须证明什么？ | 证明 C1～C6 的客户端安全闭环可按正式设计实现：context/visibility fail-closed，Query no-write 与多轴保真，草稿/receipt/result/unknown 分层，owner-partitioned topic 局部降级，明确 recovery 与 a11y 语义等价，四项配置 strict/startup-only/zero-secret。 |
| P1/P2 如何处理？ | P1 是 formal contract 到达后的 selected integration/compatibility；P2 是 configured durability、production profile/sink、真实浏览器/AT 矩阵、量化性能与外围增强。它们不得成为当前 P0 safety plan 的虚假通过项。 |
| 哪些下游只测接缝？ | L0 SDK 与 identity/work/process/governance/artifact/workspace/member/method/capability/observability/archive/sandbox 只测 narrow Port、safe mapper、owner partition、failure isolation 与 truth boundary，不测试其内部实现。 |
| 哪些非范围有残余风险？ | exact positive contract、真实 host/browser/AT、durable medium、invalidation order/dedup、production diagnostic、实际性能/负载与未停审 L5/L6 link；均进入 Step 14。 |
| 哪些是一票否决？ | 00 §14.4 七项 VETO：私有旁路/第二 truth、失效语境仍披露/提交、UI/transport 冒充完成或 unknown replay、forbidden body 泄露、UI/阈值推导 verdict/readiness、a11y 核心路径不等价、局部故障扩散或被掩盖。 |

## 4. 测试目标

| 目标 ID | 测试目标 | 成立条件 |
|---|---|---|
| `TGOAL-CON-01` | 证明客户端只拥有交互 truth 与安全影子 | local state、view、draft、request、diagnostic 均不能升级为 owner truth/authority |
| `TGOAL-CON-02` | 证明所有受保护路径 fail-closed 且只可收紧 | context/visibility/qualification 缺失、撤销、冲突、unknown 时不披露、不提交 |
| `TGOAL-CON-03` | 证明读取保真且无写副作用 | 16 Query 保留 owner/source axes，零 carrier/command/owner write |
| `TGOAL-CON-04` | 证明受控意图仅在正式前置下恰好提交一次 | 草稿/资格/合同/结果分层；ambiguous→unknown；无 replay |
| `TGOAL-CON-05` | 证明八主题按 owner 分区、局部降级且不合成 readiness | canonical order、partial isolation、严格 empty、无跨 owner truth |
| `TGOAL-CON-06` | 证明恢复、安全诊断与 a11y 不改变业务语义 | subject-specific action、三通道同 guard、sink/host failure isolation |
| `TGOAL-CON-07` | 证明 scoped carrier 与并发边界保守成立 | whole-record、exact scope、single writer、late result/drop、ambiguous reload |
| `TGOAL-CON-08` | 证明配置控制面严格且不能授予能力 | required profile、safe defaults、strict schema、zero-secret、startup-only、fail-fast/fail-closed |
| `TGOAL-CON-09` | 形成可由 06 消费但不预造的证据合同 | 每个 P0 case 绑定未来 suite/artifact/report/EV/AC/VETO |

## 5. 范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 当前上限 |
|---|---|---|---|---|
| `entry` safe bootstrap/shell/host | composition | P0 | restricted/minimal/presentable/closed 与 host failure isolation | 不证明 browser host ready |
| `access` context/qualification/disclosure | security | P0 | formal-only positive、local tightening、minimum disclosure | 不定义身份/scope/Policy |
| `navigation` route/selection/history cleanup | client state | P0 | guard 与 context 同源、direct-link 安全、cleanup | 不把 route 当 authorization |
| `views` safe mapper/source axes/query | read model | P0 | owner/source 五轴保真、strict empty、filter-after-map、no-write | 不验证 owner DB/projection |
| `intent` draft/request/result | controlled write | P0 | lifecycle、eligibility、single submit、receipt/result/unknown/no-replay | positive owner DTO 当前 conditional |
| `features` eight topics | composition | P0 safety / P1 positive | owner sets/order/activation/partial/read-only/blocked | exact positive surfaces 按 owner blocked |
| `recovery` + a11y semantics | resilience | P0 semantic | subject ceiling、one action、三通道等价、fallback | 具体 browser/AT compatibility 为 P1/P2 |
| `adapters` narrow surface/parity | boundary | P0 safety / P1 formal | no raw body/error、fake/formal union parity、per-owner isolation | 不直连 owner private transport |
| `state` carrier/invalidation | consistency | P0 session | exact scope、whole-record、single writer、monotonic tightening | configured durable/cross-session 为 P2 |
| `diagnostics` | observability/security | P0 disabled/fake | whitelist、low-cardinality、sink isolation、not audit | production sink/envelope 为 P1/P2 |
| 5 Command | protocol/flow | P0 | 各自正向本地分支、blocked/cancel/error；submit conditional positive | 不发明 owner command contract |
| 8 Core Query | protocol/flow | P0 | value/empty/blocked/unavailable/unknown 与 no-write | 不修复/安装 owner truth |
| 8 Topic Query | protocol/flow | P0 safety / P1 positive | 参数化 owner partitions、canonical composition、local failure | positive formal material 按 owner contract |
| conditional invalidation consumer | event seam | P0 disabled / P1 observed | disabled/pending-contract zero-write；future contract gates | 当前不测试 applied positive |
| Outbound Event / Job absence | architecture | P0 | 静态证明 surface 数量为 0 | 不新增 outbox/worker/scheduler |
| state/error/concurrency | cross-cutting | P0 | 全状态合法/非法、typed mapping、single-flight/race/no replay | 不声称 multi-tab CAS |
| four-item configuration | control plane | P0 | schema/source/profile/security/load/change/failure/migration | 不选择 parser/tool/deployment product |
| actual formal owner integration | runtime integration | P1 blocked | selected facet contract tests after authority | 不作为当前 P0 safety evidence |
| browser/AT compatibility matrix | compatibility | P1/P2 blocked | authority 到达后的 concrete matrix | 当前仅语义模型测试 |
| performance/load/SLO | nonfunctional | P2 authority-required | boundedness 与 isolation 先测；数字后定 | 不继承旧 P95/SLA/100% 数字 |
| peripheral enhancements `E*` | product enhancement | P2 conditional | disabled/blocked 不破坏核心闭环 | 不承诺 dashboard/batch/export/trend 正向实现 |

## 6. 外部依赖只测接缝

| 依赖族 | 本仓测试内容 | 不测试内容 |
|---|---|---|
| `L0-core` / `L0-sdk` | public type/package boundary、narrow adapter contract、error/result mapping | SDK 私有 transport 与 owner 内部实现 |
| identity / Policy / Gate | context/visibility/qualification safe observation、撤销与 fail-closed | credential、角色目录、规则正文、授权引擎 |
| work/process/workspace | 三分区 safe view、partial isolation、no readiness | projection/cursor/rebuild、领域 lifecycle |
| governance/artifact | safe ref/status、no verdict/evidence body | decision/evidence 正文与内部审批 |
| method/member/capability | safe view/ref、read-only/blocked activation | 正式对象、注册/发布/成员 lifecycle |
| observability | owner-safe audit/metric/report ref 与 optional diagnostic seam | audit/evidence truth、物理日志/指标 backend |
| archive/sandbox | safe posture/ref、blocked positive actions | archive/restore/run/cleanup 执行 truth |
| browser/host/a11y | host Port/focus/announce failure isolation 与语义 binding | 未获 authority 的具体产品兼容结论 |

## 7. VETO 到范围的映射

| VETO | P0 承接范围 | 核心否决断言 |
|---|---|---|
| `VETO-CON-001` | adapter/dependency/static/no-write | 无 DB/repository/private bus/BFF/worker/owner source import；Query 零写 |
| `VETO-CON-002` | access/navigation/view/intent | non-current context 不披露、不选择敏感入口、不 submit |
| `VETO-CON-003` | intent/request/concurrency | toast/transport/receipt/cache 不 confirmed；ambiguous unknown/no replay |
| `VETO-CON-004` | mapper/state/diagnostic/config/evidence | forbidden material whole reject；零输出、零存储 |
| `VETO-CON-005` | features/source axes/config/nonfunctional | UI/flag/threshold/partial view 不产生 verdict/active/readiness |
| `VETO-CON-006` | recovery/page/a11y | visual/keyboard/AT 同 action/guard；关键路径无死路 |
| `VETO-CON-007` | topic composition/error isolation | 单 owner 失败仅影响对应 partition，且不被其他成功掩盖 |

## 8. 非范围与风险归属

| 非范围 | 原因 | 风险归属 / 触发条件 |
|---|---|---|
| owner 内部完整业务测试 | 不归 Console 拥有 | owner 仓；只消费正式合同 |
| 实际实现与 runner/tool 选型 | 目标仓不存在，属于 07/实施 | 07 planned boundary 与实现门禁 |
| 真正测试执行和验收裁决 | 05 是方案，不是报告/06 | future run 与 06 |
| production readiness | formal contracts/env/threshold 未齐 | 06/09/release authority |
| fixed coverage/latency/load numbers | 无 authority | `CON-Q-045`；后续正式场景与窗口 |
| concrete browser/AT support | 无 matrix authority | `CON-Q-046`；兼容设计/测试 |
| hot reload/remote config/durable state | 04 明确 design-change-required | 先回 03/04 再增测试 |

## 9. 测试设计取舍

| 议题 | 采用方案 | 否决方案及原因 |
|---|---|---|
| P0 主轴 | safety + client-contract completeness | 只测页面 happy path，无法验证 VETO |
| formal contract 缺失 | blocked positive + executable negative/fake parity | 自造 DTO/endpoint 伪造 integration |
| integration | deterministic narrow Port fake，future selected formal | 真实 owner 全量 E2E 作为 P0 前置 |
| a11y | P0 semantic equivalence；concrete matrix conditional | 以视觉快照代替非视觉目标 |
| performance | structural boundedness；数字 pending | 继承旧 `<200ms`、SLA 或 100% |
| evidence | planned EV slot，运行时由 artifact 推导 | 静态 JSON/手写表冒充 evidence |

## 10. 上游影响与门禁

| 结论 | 是否回写 00～04 | 状态 |
|---|---|---|
| P0/P1/P2 只是测试优先级 | 否 | 无回写 |
| blocked positive 与现有风险一致 | 否 | 无回写 |
| 当前未发现不可测试的 P0 safety contract | 否 | 无回写 |
| future 若要求 blocked positive 成为 release 必过 | 是（future） | 先闭合 owner/SDK/03/04，再重开 05/06 |

## 11. 回填、待确认与进入 Step 3

正式 §2 应回填九项目标、范围表、VETO 映射和非范围；不得把 P1/P2 或 planned suite 写成已具备。

| 待确认 | 当前处理 |
|---|---|
| P1 selected formal facets 的名单/版本 | 按 `CON-Q-034～043` blocked |
| browser/AT 与量化矩阵 | 按 `CON-Q-045～046` blocked |
| actual runner/tooling | 07/实现阶段；不影响方案结构 |

Step 2 `done / pass / self_reviewed`；P0/P1/P2、非范围、接缝与 VETO 范围明确，允许进入 Step 3。
