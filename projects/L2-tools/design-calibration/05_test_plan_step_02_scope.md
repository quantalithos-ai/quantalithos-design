# L2-tools 05 测试方案 · Step 2 目标、范围与非范围

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 2「明确测试目标、范围和非范围」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §2
>
> 输入来源：`05_test_plan_step_01_input_boundary.md`、当前正式 `00~04`

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 2 / 明确测试目标、范围和非范围 |
| 状态 | `accepted_for_step_02 / proceed_to_step_03` |
| 当前模块 | `goals_scope_priority_veto` |
| 正式文档写入 | 未允许；仅形成回填草稿 |
| 本步结论 | P0 证明本地工具契约、受理/拒绝、状态/事务/安全红线和配置装配闭环；P1 只测已定义接缝和 blocked-aware provider seam；P2/future 不进入当前通过分母 |
| 下一步 | Step 3：抽取测试对象与测试切口 |

## 2. 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 五个核心能力闭环 | `00` §7、§14 | current formal |
| 核心/外围 FR、BR、DR、NFR、AC、VF | `00` §9~§15 | current formal |
| 七模块和协议/flow/state最小切口 | `03` §4~§15 | current formal |
| 配置目标、P0 profiles、CFG测试族 | `04` §2、§6、§9、§12 | current formal |
| 上游 blocker | ledger `L2T-UP-001~009` | open |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| P0 必须通过哪些测试才能证明主链成立？ | 五个核心能力节点均须有本地正向/保守路径：identity/definition 建立与演进；binding bound/unbound 和缺口；canonical invocation/admission/no-execution；precondition/auth consumption/sandbox handoff fail-closed；source normalization、outcome/audit atomic pair、safe handoff local attempt。另需覆盖七模块最小切口、所有 CF/QF/IF/OF/JF 最小入口、六状态族、事务/幂等/并发/错误、NC redlines 与 P0 config parse/builder/redaction。 | `03` §15.1~§15.8；`00` AC-L2T-001~005/024~033 |
| P1 做什么？ | 对已定义但依赖外部 owner 的接缝做 contract/adapter negative 和 blocked-aware tests；在 owner/schema/mapping/route/client 闭合后再启用 positive integration-like profile。 | `L2T-UP-001~009`；`04` §6、§11、§14 |
| P2 是否进入当前分母？ | 不进入。production-like、hot reload/config center/admin override、真实 provider readiness、Bus delivery/Observability observed、SDK client、marketplace/inventory、量化性能阈值和跨仓 release evidence 均保留 future/reopen 条件。 | `04` §4、§6、§13；`00` NFR 无 measurement authority |
| 哪些下游能力只测接缝？ | L3-capability-hub、L4-sandbox、L4-observability、L0-bus、L2-runtime、L0-sdk 只测本仓输入/输出 carrier、source attribution、blocked/unavailable、no-write、独立 status/ref 和 local attempt，不测对方内部 truth。 | `01` 系统边界与依赖裁剪；`03` §13~§15 |
| 哪些非范围有残余风险？ | 正向 authorization provider、Sandbox generic mapping/receipt/cleanup/DLQ、Bus/Observability producer/route/status、Core tools-specific shared schema、SDK client、真实部署、量化 NFR 和 evidence authority。每项进入 Step 14 风险登记并作为 Step 12/13 阻断或待确认项。 | `L2T-UP-001~009`；`00` §17 |
| 哪些是一票否决相关？ | 任何第二 truth owner、raw/secret/body 泄露、未知授权放行、Sandbox-required 旁路、outcome/audit 半对、terminal overwrite、Query/Job 反写真相、unknown 自动重调、NC redline 被配置绕过、fake/ref/health marker 被升级为 readiness。 | `NC-L2T-001~025`；`00` `VF-L2T-*` |

## 4. 测试目标表

| 目标 ID | 测试目标 | 必须证明 | 不得借此证明 | 优先级 |
|---|---|---|---|---|
| `TG-L2T-001` | 工具 identity/definition 真相 | 稳定本地身份、完整定义、显式 revision/evolution、duplicate/retire guard | provider inventory、implementation readiness | P0 |
| `TG-L2T-002` | Capability binding 真相分层 | bound/unbound、body-free relation、snapshot/assessment/gap、stale/conflict/invalidated | Hub registry 或 applicability=authorization | P0 |
| `TG-L2T-003` | Canonical invocation/admission | caller/carrier一致、metadata/context校验、受理/等待/拒绝/不可用、no-execution pair | Runtime plan/loop/orchestration | P0 |
| `TG-L2T-004` | 执行前置与隔离交接 | requirement分类、auth consumption fail-closed、Sandbox-required no-bypass、Prepared/phase-2/unknown fence | auth decision、Sandbox run/receipt/capture truth | P0 |
| `TG-L2T-005` | Outcome/error/audit | source assessment、六类 terminal outcome、result/error XOR、ToolAuditEntry atomic pair、late material append | raw capture、delivery、observed 或 evidence truth | P0 |
| `TG-L2T-006` | Safe handoff | 四项合取 gate、body-free/redacted/correlated material、local submission attempt 与独立 status | delivered/observed/accepted 外部事实 | P0 |
| `TG-L2T-007` | 七模块与协议闭环 | contracts/domain/application/infra/api/worker/jobs 的公开 seam 可映射和隔离 | 具体HTTP/RPC/broker/scheduler产品 | P0 |
| `TG-L2T-008` | 状态/事务/幂等/并发 | 合法迁移、终态守卫、UoW/CAS/atomicity、replay/unknown/late material | 未定义的全局状态或后台恢复 owner | P0 |
| `TG-L2T-009` | 配置装配与安全 | strict parse、source priority/conflict、profile isolation、V0~V8/B0~B8、no-output/no-partial graph | 配置已部署或生产 ready | P0 |
| `TG-L2T-010` | 观测与审计可解释性 | low-cardinality safe logs/metrics/trace、owner/error/status 分层、redaction | Observability store/route/readiness | P0 |
| `TG-L2T-011` | 外部接缝 qualification | blocked/unavailable/unsupported/conflicting/unverifiable 与 source/route/client 版本隔离 | 外部 owner positive closure | P1 |
| `TG-L2T-012` | 量化性能/真实跨仓发布 | 在 authority/测量模型成立后运行 benchmark/staging/release smoke | 当前设计阶段的通过结论 | P2/future |

## 5. 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---:|---|---|
| `contracts` typed refs/metadata/protocol/errors/views | contract | P0 | required fields、版本、closed variants、body-free、unknown/invalid reject | 不测 transport/backend |
| `domain` 41对象、factory、policy、state transition | domain | P0 | owner/invariant、合法/非法迁移、terminal/immutable、四门安全判定 | 不调用 Store/Port |
| `application` Command facade `CF-01~13` | service/flow | P0 | 顺序、UoW、CAS、idempotency、stored result、error mapping | 不测真实 scheduler/provider |
| `application` Query facade `QF-01~11` | read/no-write | P0 | visibility/freshness/degraded、零写/零refresh/零Port | 不重建 projection、不修 truth |
| Inbound `IF-01~05` | worker/consumer | P0 | envelope claim、source isolation、dedup、receipt、IF-03 CF-11 re-entry | 不测 broker ack/DLQ |
| Outbound `OF-01~04` | continuation | P0 | material->event->Prepared->one call->local disposition、unknown fence | 不断言 delivered/observed |
| Jobs `JF-01~04` | bounded jobs | P0 | bounded scope、cursor/watermark、per-target UoW、partial report/replay、no-repair | 不测 scheduler/evidence/signoff |
| 六状态族 | state | P0 | exact enum labels、legal/illegal transitions、late/terminal guards | 不新增全局状态 |
| TX/CAS/idempotency/concurrency/error/recovery cuts | consistency | P0 | atomic pair、rollback/commit unknown、same/different digest、stale CAS、manual unknown | 不声明吞吐/恢复SLA |
| `NC-L2T-001~025` | security/boundary | P0 | forbidden behavior always rejected/blocked/no-write | 不依赖人工审查替代自动化 |
| 04 config tests `CFG-T/A/F/X` | config | P0 | strict schema/source/profile/sensitive/failure/builder gates | 不写真实 secret/env/deploy |
| Hub/Auth/Sandbox/Core/Bus/Obs/SDK seam negative | integration contract | P1 | typed blocked/unavailable/unknown/version mismatch/no fallback | positive owner closure pending |
| external positive provider and real-like integration | integration | P1 conditional | owner closed后验证正向 mapping/status | 当前不进入通过分母 |
| staging/release E2E、真实部署和量化NFR | release/NFR | P2/future | 在环境、测量和evidence authority成立后验证 | 当前不伪造阈值、run或readiness |
| agent loop、LLM planning、Runtime orchestration/retry/recovery | non-scope | excluded | 由L2-runtime负责 | L2只验证消费 seam |
| capability registry/inventory/provider control/marketplace | non-scope | excluded | 由Hub/外部/分发 owner负责 | L2只消费ref/summary |
| authorization decision/policy taxonomy、Sandbox isolation/run/capture/cleanup、Bus delivery/DLQ、Observability store | non-scope | excluded | 各自owner负责 | L2只验证输入/输出接缝 |
| SDK client/UI/member-images/builtin/MCP具体工具库存 | non-scope | excluded | 下游/产品/适配 owner负责 | 不扩大当前范围 |

## 6. P0/P1/P2 优先级与阻断口径

| 级别 | 纳入条件 | 通过/阻断口径 | 当前状态 |
|---|---|---|---|
| P0 | 当前03/04已闭合、可用本地 fixture/fake 断言，且失败破坏核心truth或安全红线 | P0 case 缺失、失败、unverifiable、artifact/report缺失或redaction失败均阻断设计交付/未来release gate；不是当前执行结果 | 设计中 |
| P1 | 依赖外部owner但本地 seam 已有 typed contract；可测试 blocked/unavailable/unknown | blocker 未闭时只能报告 blocked/unavailable，不得算正向通过；owner闭合后才可提升 | 条件纳入 |
| P2/future | 生产/真实provider/量化测量/SDK/marketplace等未具备 authority | 不进入当前P0分母；记录 reopen trigger 与残余风险 | 暂不纳入 |

## 7. 一票否决关联表

| Veto 主题 | 关联设计契约 | 计划测试方向 | 影响 |
|---|---|---|---|
| 第二 truth owner / schema fork | `NC-L2T-001~007`、`HC-L2T-001~005` | dependency/schema/model negative、caller/carrier parity | S / 阻断 |
| raw body/secret/credential 入表或外发 | `NC-L2T-008`、`NC-L2T-017`、`DR-*` | forbidden-field construction、redaction scan、safe material four-gate | S / 阻断 |
| 未知/缺失/冲突授权放行 | `NC-L2T-009~011`、`L2T-UP-001~002` | fail-closed auth cases、no execution/no accepted | S / 阻断 |
| Sandbox-required 旁路 | `NC-L2T-012`、`L2T-UP-003~004` | no-host/direct fallback negative、mapping blocked | S / 阻断 |
| local marker/status 推断 external accepted/delivered/observed | `NC-L2T-013`、`NC-L2T-018~019` | status independence、one-call/unknown fence | S / 阻断 |
| outcome/audit half-pair或terminal overwrite | `NC-L2T-015~016`、状态/事务矩阵 | atomic UoW、duplicate/late/terminal conflict | S / 阻断 |
| Query/Consumer/Job反写真相 | `NC-L2T-020~022` | no-write spy、no-repair/job bounded tests | S / 阻断 |
| unknown自动重试/重建当前truth | `NC-L2T-023~025`、phase matrix | commit/call/submission unknown manual fence | S / 阻断 |
| 配置绕过安全红线或暴露partial graph | `CFG-A-03/04/06/07/08/09`、`CFG-X-06~12` | strict negative config/builder injection | S / 阻断 |

## 8. 对 03 的影响判定

| 判定 | 说明 |
|---|---|
| 当前无需回写03 | 本Step只选择测试范围和优先级，未新增字段、状态、错误、Port、flow或配置项。 |
| 未来回写触发器 | 若后续Step发现某P0用例无法形成字段/状态/错误 oracle，必须暂停该切口并回写03；05不得私造替代契约。 |
| 当前 blocker | `L2T-UP-001~009`影响P1 positive provider/readiness，不改变P0本地范围。 |

## 9. 回填草稿（正式05 §2）

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“目标表”“范围/非范围表”“P0/P1/P2优先级与阻断口径”和“一票否决关联表”。

本轮测试目标是证明 `L2-tools` 的工具 identity/definition、Capability Binding、canonical invocation/admission、执行前置与条件化 Sandbox handoff、normalized outcome/error、Tool-domain audit、safe handoff、七模块/五类协议族、六状态族、事务/幂等/并发/错误、配置装配与观测红线在当前边界内成立。P0 覆盖可由当前正式03/04与确定性 fixture/fake 直接构造和断言的核心契约及负向安全门禁；P1 覆盖外部 owner 的 typed seam 和 blocked/unavailable/unknown 行为，正向 provider/readiness 仅在 blocker 闭合后条件启用；P2/future 保留生产-like、真实跨仓发布、量化NFR、SDK client、marketplace和部署 readiness，不进入当前P0分母。

不在本方案重新定义 agent loop、LLM planning、Runtime orchestration/retry/recovery、Capability Hub registry/provider control、authorization decision/taxonomy、Sandbox isolation/run/capture/cleanup/DLQ、Bus delivery/retry/DLQ、Observability store/route、SDK client、具体工具库存、marketplace或实施/验收签署。每项非范围均有对应 owner 或后续文档；若非范围依赖未闭合，按 blocked/unavailable 和残余风险处理。

## 10. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| `L2T-UP-001~009`是否在本测试轮闭口 | 决定P1正向provider suite能否启用 | Step 8/9/12/13 |
| 量化NFR的measurement authority与阈值 | 决定P2 benchmark是否可进入release gate | Step 10/14 |
| 未来06的正式veto/evidence编号 | 只影响EV到AC/VF的最终消费，不影响当前planned映射 | Step 13/15 |

## 11. Step 内停审记录

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| P0主链可测试 | 通过 | 七模块、协议、状态、事务、配置和红线均有后续切口入口。 |
| 非范围owner明确 | 通过 | 各非范围均回指L2-runtime/Hub/Auth/Sandbox/Bus/Obs/SDK或后续文档。 |
| blocker未被误升为ready | 通过 | P1正向provider保持条件启用，当前只设计负向/blocked。 |
| 一票否决项可验证 | 通过 | Step 3/6/9/10将提供具体对象、用例、门禁和证据。 |
| 设计编号未漂移 | 通过 | 只使用当前00~04正式ID，不沿用旧TC/旧状态。 |

## 12. 进入下一步条件

- [x] 测试目标已定义且可回指当前正式需求/设计。
- [x] P0/P1/P2、非范围和veto口径已明确。
- [x] P0范围可直接导出测试对象和切口。
- [x] 无新增03契约变化，Step 3可开始抽取对象与切口。
