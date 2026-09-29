# Step 2. 明确验收目标与范围

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2\
> 正式回填：`06-验收标准.md` §2\
> 日期：2026-09-13\
> 状态：`completed / p0_scope_fixed_required_formal_lanes_retained / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 2：明确验收目标与范围 |
| 目标 | 将 A1～A9、F/BR/NFR、设计边界和 05 测试范围分成 P0/P1/P2 与明确非范围 |
| gate_status | `completed / p0_scope_fixed_required_formal_lanes_retained` |
| gate_reason | 核心能力、所有权、正式接缝、状态/一致性、安全和证据真实性均保留 P0；P1/P2 不替代 P0，非范围不隐藏裁决影响 |
| next_allowed_action | 按连续授权创建并完成 Step 3 |
| source_files | Step 1；正式 00 §4/7/9～15；01 §3～10；02 §4～10；03 §2/5～15；04 §6～14；05 §2～5/10/12/14 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 2A | 核心裁决目标 | done | 文档完成与实际验收分离 |
| 2B | P0/P1/P2 范围矩阵 | done | required formal lane 不被降级 |
| 2C | 接缝与非范围 | done | 只验 Archive 一侧和正式协作合同 |
| 2D | VETO 候选与总体影响 | done | 所有 P0 红线有后续落点 |
| 2E | 跨范围污染审计 | done | historical 主语/阈值未进入范围 |

## 2. 本步输入与裁决语义

| 术语 | 本文含义 | 不表示 |
|---|---|---|
| P0 | 完整验收必须真实满足的能力、红线、接缝或证据 | 当前已满足 |
| P1 | 产品/provider/consumer 组合的选定验证；仅在被某 release 明确纳入时升级 | 可以覆盖 P0 缺口 |
| P2 | workload、容量、长稳、RTO/RPO、跨区或长期运维验证 | 可凭样本宣告 readiness |
| blocked P0 | requiredness 保留，但合同/实现/环境/证据前置尚缺 | skipped、waived、failed 或 passed |
| 非范围 | 不由本项目 06 裁决其内部正确性 | 没有边界验收或没有风险 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心裁决目标是什么？ | 判断固定交付是否实现 Archive 自有归档/恢复闭环、保持 source authority 与 owner write boundary、在未知/partial/commit-unknown 下 fail-closed，并有真实可审证据。 |
| P0/P1/P2 如何划分？ | A1～A9、F1～F9、BR1～BR12、30/32 协议、18 状态、UoW/幂等/effect、55-key P0、formal owner/provider/receiver seam、安全和证据真实性为 P0；选定产品/provider/SDK 组合为 P1；量化/长稳/跨区为 P2。 |
| 哪些下游只验接缝？ | L1 truth owners、governance、artifact、workspace、observability、Bus、storage/integrity/KMS/compression、restore receivers、SDK/product 均只验正式合同与 Archive 一侧行为，不验其内部实现。 |
| 哪些非范围影响最终结论？ | required formal seam 虽不验 owner 内部，却仍是 P0 前置；缺失即 blocked。产品 UX、跨区灾备和无 authority 数值默认 P1/P2 residual，不得伪装 P0 pass。 |
| 哪些可能一票否决？ | 跨域写、状态/phase 越级、fail-open、Auxiliary/ref/fake 冒真相、盲重放/造证据、敏感泄漏、依赖偷渡/production fake、未授权 outbound。 |
| 哪些必须用正式名称？ | 26 对象、3C/5Q/5E/17J、18 状态主语、typed error/outcome、12 配置域/55 keys、102 TC、19 EV 全部按正式 03～05 名称；不得复用 ArchivedSnapshot/index/ticket。 |

## 4. Historical material 诊断

| 旧范围 | 污染 | 处置 |
|---|---|---|
| snapshot/index/timeline/RCA 五段主链 | 不是正式六 CP/A1～A9 | 排除 |
| 固定 hot/warm/cold 和对象存储本体 | provider/tier 未选 | 只保留 adapter/finality 接缝 P0；组合为 P1 |
| cold query 性能 `<3s`、100% 成功 | 无 workload/method/authority | 转为结构性 P0 + measured P2 |
| restore ticket/approval 即成功 | 忽略 owner-specific receiver/finality | 改为 plan/material/handoff/outcome/compensation 多轴裁决 |
| historical review/RCA | 当前明确非目标 | 留产品/观测消费方，不进入 Archive P0 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 核心能力 | 旧五段历史功能 | A1～A9/F1～F9 | 对齐正式 00 |
| 外部接缝 | “下游不在范围”后隐式放行 | 内部实现非范围，但 required seam verification 为 P0 | 防止 fake closure |
| 非功能 | 无来源固定阈值 | 结构性 P0、量化 P2/pending | 可判定且不造数字 |
| 恢复 | ticket/export/package | request/plan/item/material/handoff/outcome/compensation | 对齐正式 CP6 |
| 完成 | 文档勾选 | 规则设计完成 ≠ 验收进入/退出 | 不伪造 verdict |

## 6. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| formal seam requiredness | 全部保持 P0，缺前置为 blocked | 改 P1 或只验 fake | authority/finality 是归档成立条件 |
| P0 功能组织 | 后续按九个 F 主项，每项可拆边界断言 | 按 26 对象逐项建功能 AC | 功能 AC 对应用户价值，对象在一致性/边界 AC 覆盖 |
| 非范围 | 明确 owner 与 Archive seam 裁决 | 仅写“不验” | 非范围仍可能阻断本仓完整验收 |
| 当前裁决 | `not_entered` 作为过程姿态，不属于三值结论 | 预填“不通过” | 尚无送验基线，不能做实际裁决 |

## 7. 结构化中间产物

### 7.1 验收目标

1. 九条核心能力均能在固定交付、配置、数据和 run 下由正式 TC/EV 证明。
2. Archive 只拥有 request/job、Bundle/manifest/capture/assessment/placement/lifecycle、restore plan/handoff/outcome/compensation 真相。
3. 八类 source 的 authority、material/ref、version/fence/coverage 可区分，workspace 永远 `Auxiliary`。
4. `Accepted`、`Sealed`、`Verified`、item `Succeeded` 不传播为 owner/project/global success。
5. partial、stale、missing、conflicting、unsupported-version、integrity-failed、commit-unknown 与 compensation/retry 可判别且 fail-closed。
6. 真实证据从 fixed run raw 单向生成 report/EV/acceptance handoff；静态材料不能造 pass。

### 7.2 范围矩阵

| 验收范围项 | 类型 / 来源 | 优先级 | 裁决目标 | 非范围 / 当前姿态 |
|---|---|---:|---|---|
| A1 / F-AR-001 request admission | 功能 | P0 | scope/authority/idempotency 可解释；阻断不造 Accepted | owner 项目状态决定非范围；local planned |
| A2 / F-AR-002 source capture | 功能 + formal seam | P0 | 八 source 逐项 authority/version/fence/coverage 与 partial | owner exporter 内部非范围；formal blocked |
| A3 / F-AR-003 Bundle closure | 功能/一致性 | P0 | declared/actual exact closure；incomplete/overfull 不 Sealed | provider 格式非范围；source positive blocked |
| A4 / F-AR-004 integrity/compatibility | 功能 + external seam | P0 | verified/unknown/unsupported/integrity-failed 分离 | 算法/KMS/provider 内部非范围；formal blocked |
| A5 / F-AR-005 placement/lifecycle | 功能 + governance/storage | P0 | intent/ACK/commit/probe、decision/hold 分离 | tier/provider/policy engine 非范围；formal blocked |
| A6 / F-AR-006 safe read | 功能/安全 | P0 | provenance/coverage/status/current visibility；Query strict no-write | 产品 UI/cache 非范围；cursor binding pending |
| A7 / F-AR-007 restore plan | 功能/authority | P0 | frozen owner/item set、eligibility、compatibility、basis | owner 恢复政策非范围；formal blocked |
| A8 / F-AR-008 material/handoff | 功能 + receiver seam | P0 | 最小 owner-specific material/ref、zero owner DB write | receiver 内部实现非范围；formal blocked |
| A9 / F-AR-009 outcome/recovery | 功能/一致性 | P0 | per-item result、probe、partial resume、compensation | owner project restored 判断非范围；formal blocked |
| ownership/source authority | 架构/数据红线 | P0 | canonical/Auxiliary/ref/material 和自有 truth 不混同 | owner 内部 schema 非范围 |
| 30 logical / 32 method surfaces | 协议 | P0 | 3C/5Q/5E/17J 全覆盖；E04/J12 路由不混淆 | transport route/framework 非范围 |
| 18 states + UoW/idempotency/effect | 一致性 | P0 | 正式 edge、原子性、CAS/fence、replay/unknown | DB/provider 选择非范围 |
| 12 config domains / 55 keys | 配置/安全 | P0 | exact requiredness、source priority、binding、fail-closed | secret/provider 真值非范围 |
| 19 EV + report/acceptance package | 证据 | P0 | same-run raw/report/EV、redaction、pairing、review | 当前全 absent |
| selected provider/storage/KMS/SDK/product | 组合兼容 | P1 | 选定组合的 conformance/consumer compatibility | 不替代任一 P0 formal seam |
| workload/capacity/latency/RTO/RPO/long-run | measured NFR | P2 | 有 authority 后按固定方法/阈值裁决 | 当前 pending `AR-HLD-Q-002` |
| cross-region DR、产品 UI、跨包搜索/RCA | 产品/运维能力 | P2 / future | 需求正式纳入后另行校准 | 当前不参与总体验收 |

### 7.3 明确非范围与边界验收

| 非范围 | owning project / role | 本仓仍需验收的边界 |
|---|---|---|
| identity/conversation/work/process/governance/artifact truth | 各 L1 owner | input authority、typed failure、ref/material、zero write、receiver handoff |
| workspace canonical truth | 不存在；workspace owner 仅投影 | `Auxiliary` 标签、不可补 canonical 缺口 |
| observability backend/audit chain | L4-observability | safe material/ref、telemetry non-interference、不得宣称完整链 |
| retention/hold/delete/risk decision | governance/明确 owner | exact current decision prerequisite、冲突/缺失零 dispatch |
| storage/integrity/KMS/compression provider truth | infra/security owner | adapter outcome、commit/probe、unknown、redaction |
| SDK/client/cache/UI/runtime/tools/sandbox/marketplace | 对应 owner | 无反向 compile/写权；必要只读消费兼容 |

### 7.4 VETO 候选主线

| 候选 | 红线 | 后续正式化 |
|---|---|---|
| V1 | 跨域写或 Archive 决定 owner/governance truth | Step 6/11 |
| V2 | 局部状态越级为 owner/project/global success | Step 5/8/11 |
| V3 | 缺 authority/integrity/storage/receiver/schema 仍成功 | Step 5/7/9/11 |
| V4 | workspace/ref/summary/fake 冒 canonical/material/formal | Step 6/7/11 |
| V5 | result/history/effect/raw 链缺失仍 complete、盲重放或静态造证据 | Step 8/10/11 |
| V6 | raw secret/body/key/provider response/敏感 ref 泄漏 | Step 6/9/10/11 |
| V7 | sibling/provider/SDK compile 偷渡或 production fake fallback | Step 6/7/11 |
| V8 | 无正式 outbox/topic/publisher/delivery 仍宣称 outbound ready/published | Step 7/11 |

## 8. 跨范围审计

| 审计项 | 结论 |
|---|---|
| A1～A9 / F1～F9 是否全覆盖 | 是，9/9 |
| BR1～BR12 与五类原始 VETO 是否有落点 | 是；边界/一致性/证据与 V1～V5 |
| 外部 required lane 是否被降级 | 否；全部 P0 blocked |
| workspace 是否冒 canonical | 否；固定 Auxiliary |
| owner 内部实现是否被纳入 | 否；只验 seam |
| historical 对象/数字是否污染 | 无 |
| 当前是否产生裁决 | 否；`not_entered`，verdict=0 |

## 9. 复杂度判断

Step 2 以能力、红线、接缝、证据和非功能五类范围收敛即可；具体 AC 编号留 Step 5～10，VETO 编号留 Step 11，避免提前制造跨 Step 真相。

## 10. 回填草稿

正式 §2 应列出六项目标、P0/P1/P2 范围表、非范围 owner 与本仓边界。必须明确 formal seam 是 P0 required-but-blocked，P1/P2 不替代；当前无送验实例，范围确认不是验收通过。

## 11. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；范围完全承接现有正式主线 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部保留；影响相应 P0 formal lane |
| 待 Step 3 | fixed delivery/env/data/run/handoff 字段与变更规则 |

## 12. 进入 Step 3 条件

- [x] P0/P1/P2 与非范围明确。
- [x] 九条核心能力和所有权/一致性/证据红线未遗漏。
- [x] required formal seam 未降级或被 fake 替代。
- [x] VETO 候选有后续 Step 落点。
- [x] 无旧对象、固定 provider 或无来源阈值污染。

当前 `gate_status`：`completed / p0_scope_fixed_required_formal_lanes_retained`。

`next_allowed_action`：按连续授权创建并完成 Step 3。
