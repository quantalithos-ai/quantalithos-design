# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节：`05-测试方案.md` §10
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_10_nonfunctional.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 把 Console 的非功能需求和详细设计红线转为可验证专项：本地交互与 fan-out 的结构性性能、安全/最小披露、Query no-write 与 single-flight、一致性/恢复、body-free diagnostics、语义可访问性、配置失效和 SDK-only 依赖边界。专项只定义未来方法、环境、通过条件和 candidate evidence；不执行测试、不生成 EV、不把旧阈值或 UI 状态升级为验收事实。

Console 不拥有 owner truth、Policy/Gate、audit/evidence/report、readiness、持久化或后台 job。因此本 Step 不复制 Governance 的 UoW、repository、outbox、worker、job、GRC 或服务端性能指标；对应项在 Console 中按 `not-applicable` 或客户端边界专项处理。

## 2. 输入与来源

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §13～§14 | NFR-CON-001～021、AC 与 VETO 的正式边界 |
| `03-详细设计.md` §8～§15 | flow、state、错误/恢复、并发、配置、diagnostic/a11y 与最小切口 |
| `04-配置设计.md` §5～§12 | strict JSON、profile isolation、startup-only、zero-secret、fail-fast/disabled/partial |
| Step 6 | 96 TC 中的 security, consistency, recovery, config, a11y 和 architecture cases |
| Step 8～9 | 环境角色、profiles、suite/gate/check/report planned contracts |
| `L1-governance` Step 10 | 矩阵、故障注入、阈值来源审计的粒度参考；不迁移领域语义 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些性能指标必须验证？ | P0 验证本地交互不被无关 owner 阻塞、必要 fan-out 有界、重复查询/unknown replay 不放大负载、页面组合按 canonical partitions 完成。记录 duration/count sample 与结构性断言；旧首屏/P95/SLA 数字没有 authority，不设 pass 阈值。 |
| 哪些安全红线必须负向测试？ | context/visibility/qualification 无效仍披露或 submit、route/flag/cache 授权、raw body/secret/full ref 进入 state/diagnostic/report、Query 写入、unknown replay、partial success 推导 active/readiness、sibling source/private bus/DB 依赖、diagnostic 冒充 audit/evidence，均为 P0 blocking negative。 |
| 哪些一致性/恢复必须故障注入？ | late result、scope mismatch、ambiguous carrier write、cancel before/after dispatch、double semantic action、partition failure、stale recovery plan、sink failure、invalid config、binding unavailable、disabled invalidation。不存在的 owner/UoW/repository/outbox 故障不创建 fake truth。 |
| 哪些日志/指标/审计证据必须存在？ | Console 只要求 body-free diagnostic candidate、safe phase/outcome/owner/topic/facet 低基数维度、redaction/dependency/report-pairing scan 输入。正式 audit/evidence/report 必须由 owner/测试归档边界提供；Console sink receipt 不是证明。 |
| 阈值来自哪里？ | 通过条件来自 00 NFR/AC/VETO、03/04 typed contracts 和 Step 6/9 可判定断言。没有正式量化 authority（`CON-Q-045`）时只产 sample/trend，不写旧阈值。 |

## 4. 专项测试矩阵

| 专项 | 指标/风险 | 方法 | 环境 | 通过条件（planned） | Candidate |
|---|---|---|---|---|---|
| 本地交互性能 | navigation/filter/draft/focus 不等待无关 owner | deterministic scheduler + duration/count sample；注入慢/不可用 sibling | `local-fake` CI | 本地 action 有明确 pending/结果；无重复无界 dispatch；无 numeric threshold | `EV-CAND-FLOW-001` |
| fan-out boundedness | topic query 只访问 descriptor owner partitions | call ledger + canonical order/permutation；重复 trigger/single-flight | CI `local-fake` / `integration-pending` | call 数由 formal descriptor/用户动作界定；completion order 不改变 posture | `EV-CAND-INTEGRATION-001` |
| availability/degradation | 单 owner failure 不扩散或被掩盖 | per-owner unavailable/stale/conflict/unknown injection | CI/main/nightly | partition-local posture；shell/无关 safe partition 保持；不造 normal/ready | `EV-CAND-INTEGRATION-001` |
| access/security | invalid context/visibility/qualification 与 direct entry | route/menu/button/cache/flag/role/URL synthetic negatives | PR/main/release | 零受保护披露、selection、submit；minimum disclosure | `EV-CAND-SECURITY-001` |
| forbidden material/redaction | raw body/secret/full ref/stack/free text 泄露 | isolated synthetic leak corpus + artifact/report scans | main/release | whole reject 或 body-free；拒绝值不 echo；scan clean | `EV-CAND-SECURITY-001` |
| query no-write | 16 Query 不写 carrier、command、reconcile 或 event store | recording Port/carrier ledger around all Query branches | PR/main | write count=0；diagnostic disabled/failed 不改返回 | `EV-CAND-FLOW-001` |
| command ambiguity | possible dispatch timeout 不 replay | controlled adapter cancel/timeout boundary + reload/reconcile | main/nightly | before dispatch cancelled/blocked；after possible dispatch unknown；submit 不自动重发 | `EV-CAND-FLOW-001`、`EV-CAND-INTEGRATION-001` |
| scoped state | whole-record/exact-scope/terminal cleanup | malformed/duplicate/mismatch/ambiguous carrier fixtures | PR/main | whole reject；scope mismatch zero mutation；session-volatile only | `EV-CAND-UNIT-001`、`EV-CAND-CONTRACT-001` |
| recovery | typed error 与 subject-specific action ceiling | stale/mismatch plan、host failure、one-action guard | main/nightly | 只能执行批准 action；action completion 不等 recovered；无 retry-all | `EV-CAND-FLOW-001` |
| diagnostics | optional sink failure isolated | enabled/disabled/failed/cancelled sink and recursion probe | main/release | body-free candidate；业务 response/state 完全不变；无 recursive emit | `EV-CAND-SECURITY-001`、`EV-CAND-INTEGRATION-001` |
| semantic accessibility | visual/keyboard/AT semantic equivalence | shared action binding table + focus/announce failure | CI semantic; browser selected pending | same action key/guard/input/outcome/recovery ceiling；非颜色语义 | `EV-CAND-ACCESSIBILITY-001` |
| config failure | no default profile, strict whole doc, no hot patch | config negative/mutation, profile/binding matrix, rollback simulation | PR/main/release | fail-fast/reject whole; no silent fallback/partial runtime; startup-only | `EV-CAND-CONTRACT-001`、`EV-CAND-SECURITY-001`、`EV-CAND-RELEASE-001` |
| architecture/dependency | no DB/repo/private bus/sibling source/BFF/worker/job | generated graph/export/protocol registry static scan | PR/main/release | SDK/formal boundary only；5+16+1；0 Event/Job；唯一 owner write | `EV-CAND-ARCH-001` |

## 5. 性能与容量口径

| 项 | 当前验证 | 是否 P0 数值门槛 | 后续条件 |
|---|---|---|---|
| local navigation/filter/draft/focus | duration sample + no-unbounded-wait structural assertion | 否 | 若需数字，先定义 host/browser/window authority |
| owner topic fan-out | descriptor-bounded call ledger、single-flight、completion order | 否 | exact owner contract 和负载模型闭合后再采样 |
| query/command/recovery | phase transition and bounded dispatch counts | 否 | 不以 receipt/toast/diagnostic 推断 latency SLA |
| availability/long-run/load | 不执行 production-like load | 否 | `CON-Q-045` authority、环境与 retention 先闭口 |
| 旧 `<2s`、P95、99.9/99.95% 等数字 | historical pollution only | 否 | 不回流 05/06，除非重新有来源并审查 |

## 6. 安全与 VETO 专项

| 红线 | 负向场景 | blocking 断言 | Suite/gate |
|---|---|---|---|
| owner truth 不可被 Console 合成 | page count/partial success/cache/threshold/flag 伪造 normal/active/ready/verdict | no positive elevation；axes/posture 保真 | `console-module-flow`;`console-release-safety-smoke` |
| context/visibility/qualification fail-closed | revoked/expired/conflict/unknown/direct URL/role string | zero protected body/selection/submit；minimum disclosure | `console-pure-contract`;`console-redaction-boundary` |
| no forbidden body | synthetic credential/policy rationale/evidence/report/object body | whole material/config/report rejection；no echo | `console-redaction-boundary` |
| Query/diagnostic no write | all 16 Query + sink enabled/failed | carrier/owner command/reconcile/event writes remain zero | `console-pure-contract`;`console-redaction-boundary` |
| unknown no replay | dispatch uncertain, old request/result, stale plan | unknown/blocked and explicit requery only; replay=0 | `console-module-flow`;`console-concurrency-race` |
| no private dependency | graph mutation DB/repo/private bus/BFF/sibling source/worker/job | architecture gate fails; no planned positive | `console-architecture-static`;release dependency |
| formal audit/evidence boundary | diagnostic receipt/report candidate/owner traceRef | never interpreted as audit/evidence/signoff/readiness | `console-redaction-boundary`;report audit |
| semantic a11y equivalence | visual/keyboard/AT and focus/announce failure | same guard/action/outcome; safe fallback or explicit exit | `console-semantic-a11y` |

## 7. 一致性、并发与恢复故障注入

| 故障 | 注入 seam | 预期姿态 | Suite |
|---|---|---|---|
| late Query after context switch | deferred Query + captured session/context refs | old result rejected; new scope unchanged | `console-concurrency-race` |
| owner partition unavailable/conflict | per-owner recording Port | local partial/unavailable; sibling result preserved | `console-controlled-composition` |
| duplicate semantic action | visual/keyboard/AT same action key | one shared single-flight; extra blocked | `console-concurrency-race`;a11y |
| cancel before dispatch | command adapter before dispatch marker | cancelled/blocked; no owner call | `console-module-flow` |
| timeout after possible dispatch | command adapter ambiguous marker | unknown; formal reconcile only; no replay | `console-concurrency-race` |
| carrier write ambiguous | volatile carrier fake | reload/minimal posture; no owner command retry | `console-controlled-composition` |
| older pending after newer formal terminal | reconciliation scheduler | older result cannot overwrite newer exact correlation | `console-concurrency-race` |
| invalidation/query order unknown | disabled/pending consumer or future contract slot | retain stale/unknown/conservative; no local clock/LWW elevation | `console-concurrency-race` |
| stale/mismatched recovery plan | recovery plan fixture | blocked/invalid-state; zero action or one approved action | `console-recovery-matrix` |
| diagnostic sink failure/recursion | sink fake | business result unchanged; no retry/recursive emission | `console-redaction-boundary` |
| config invalid/changed | strict document loader | whole reject; running runtime unchanged; new runtime revalidated | `console-config-redline` |

## 8. 观测、诊断与证据边界

| 对象 | 允许验证 | 禁止解释 | 方式 |
|---|---|---|---|
| diagnostic candidate | approved enum/ref/phase/outcome/facet、低基数 marker | audit/evidence/owner history/readiness | factory + redaction check |
| diagnostic sink | emitted/disabled/failed/cancelled isolation | owner failure、业务 verdict | sink fake + response equality |
| metric sample | operation kind、safe outcome、topic/facet/posture、duration/count | opaque user/object/request/trace IDs、free text、secret | low-cardinality static scan |
| artifact/report scan | raw body/secret/full ref absence、run pairing | test pass 或 acceptance signoff | Step 9 planned checks；Step 13 archive |
| owner audit/evidence/report ref | safe link/reference display only | Console-owned proof or verdict | adapter boundary and architecture scan |

## 9. 专项到 suite / gate 映射与停审

| 专项 | Primary suite | Release check | P0 blocking |
|---|---|---|---|
| structural performance/fan-out | `console-module-flow` / `console-controlled-composition` | release safety smoke | 缺结构性断言或无界 dispatch 是；数字阈值否 |
| security/redaction | `console-redaction-boundary` | `console-release-redaction` | 是 |
| consistency/recovery | `console-concurrency-race` / `console-recovery-matrix` | release safety smoke | 是 |
| diagnostics/a11y | `console-semantic-a11y` / redaction | release redaction/report audit | semantic 是；concrete browser/sink authority pending |
| config/dependency | `console-config-redline` / architecture | release config/dependency | 是 |
| quantitative/browser selected | selected suites | none until authority | 否，residual |

跨专项审计结论：所有 P0 redline 有负向方法、环境和阻断 suite；没有无来源硬阈值；没有把 Governance service fault model、真实 DB/bus 或 owner audit 当 Console 事实；P1/P2/authority 缺口均显式 blocked/conditional。

## 10. 待确认与残余输入

| 待确认项 | 影响 | 当前处理 |
|---|---|---|
| `CON-Q-034～044` exact owner/SDK/activation/invalidation | positive adapter、observed consumer | safety/no-call/disabled branch P0；positive selected blocked |
| `CON-Q-045` performance/availability authority | numeric threshold、load/long-run | sample/trend only；不进入当前 pass |
| `CON-Q-046` browser/AT/diagnostic matrix | concrete compatibility/sink evidence | semantic tests planned；selected unavailable/residual |
| `CON-Q-047` other L5/L6 links | deep-link positive | not mainline；safe disabled |
| state medium/TTL/framework/runner | durability and execution details | session-volatile / framework-neutral / planned paths |

## 11. 回填草稿与门禁

正式 §10 应回填专项矩阵、性能结构性口径、安全/VETO 负向、一致性/恢复故障注入、诊断/证据边界、suite 映射和 residual blockers。

> 校准来源：`design-calibration/05_test_plan_step_10_nonfunctional.md`
>
> 延伸阅读：建议继续阅读本文件的“专项测试矩阵”“安全与 VETO 专项”“一致性、并发与恢复故障注入”“观测、诊断与证据边界”和“专项到 suite / gate 映射与停审”。

| 进入 Step 11 条件 | 结论 |
|---|---|
| P0 非功能和安全红线均有方法与阻断姿态 | pass |
| 指标/阈值均有来源或明确 candidate/residual | pass |
| 故障注入不引入服务端假真相 | pass |
| 观测/证据边界可验证且不冒充 audit/readiness | pass |
| 跨专项审计无 unresolved 冲突 | pass |

Step 10 `done / pass / self_reviewed`；未执行测试，未生成 artifact/report/evidence/verdict/signoff/readiness。
