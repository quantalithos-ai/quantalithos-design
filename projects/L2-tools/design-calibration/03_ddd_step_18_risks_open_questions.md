# L2-tools 03 详细设计 Step 18: 风险与待确认事项

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 对应正式章节: `03-详细设计.md` §17
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 说明: 本文件只记录仍未关闭的风险、影响、owner、未确认前处理与 reopen 条件，不新增 schema、状态、配置、产品或实施 boundary。

## 0. Step 开工确认

| 项目 | 结论 |
|---|---|
| 前序门禁 | Step 17 `completed / pass`; 本地字段、DTO、Query、state、metadata/idempotency、side-effect 和 07 审计输入已闭合。 |
| 直接输入 | Step 1~17；正式 00 §15；正式 01/02 风险与 blocker；项目级 ledger 与 03 flow。 |
| 现有 blocker | `L2T-UP-001~009` 全部保持 open；本 Step 未发现新的上游 blocker。 |
| 本地设计缺口 | Step 6~17 未发现尚需实现者选边的 local schema/callable/state/UoW/test-cut 缺口。 |
| 正式文档状态 | Step 19 尚未装配正式 03；旧正式 03 仍是 historical material。 |
| 下游状态 | 正式 04/07 尚不存在；旧 05/06 不作为当前测试/验收基线。 |

## 1. 本步目标与边界

本 Step 回答四个问题：仍有哪些事实不确定、各自影响哪段实现、由谁确认、未确认前如何安全继续或暂停。风险记录不能被实现者当作“可选方案菜单”，也不能把一个 negative/blocked path 的可实现性误写成 external positive readiness。

本 Step 不做以下事项：

- 不重新打开已经通过的 41 对象、37 flow、六状态族和七 Store 契约。
- 不为 Authorization、Sandbox、Bus、Observability、Core 或 SDK 猜 owner/schema/route/client。
- 不选 HTTP/RPC、database、broker、scheduler、search 或 telemetry 产品。
- 不生成测试结果、run_id、evidence alias、验收签署、实现 commit 或 readiness 结论。
- 不提前写 04/05/06/07 的正式内容。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题仍可能影响实现？ | 目标实现仓和正式下游文档链尚未建立；`L2T-UP-001~009` 阻塞对应 external positive adapter/schema/route/client/readiness；concrete backend/transport 和真实 test/evidence authority 尚未由 04~07 固定。 |
| 哪些阻塞实现，哪些只影响后续？ | Step 19 未完成、04~07 未按新链完成、目标仓/07 ledger 未建立会阻塞正式实现移交。Core exact shared type 缺失会阻塞依赖该类型的 boundary。其余 `UP-*` 不阻塞本地 contracts/domain/application、negative path、fake/blocked adapter 和 no-write tests，但阻塞相应 production positive integration。SDK seam 只阻塞 future client 联调。 |
| 谁来确认？ | 详细设计维护者完成 Step 19；04/05/06/07 各文档维护者关闭下游门禁；Authorization、Sandbox、Bus/Observability、Core、SDK 各正式 owner 提供可引用合同；实施计划维护者确认目标仓、phase、ledger 和 boundary。 |
| 未确认前如何处理？ | 只实现已闭合的 L2 local truth、pure policy、typed blocked/unavailable/unknown surface、fake parity 和 test cuts；受影响 positive adapter boundary 标记 wait/blocker。不得用本地 allowlist、host fallback、string mapping、fake success、current truth replay 或 raw provider body绕过。 |

## 3. 风险分层

| 层级 | 定义 | 当前事项 | 默认动作 |
|---|---|---|---|
| `D0-local` | L2 local design schema/callable/state 未闭合 | 当前无 | 若出现，回开 owning Step，正式 03 不装配通过。 |
| `D1-formal` | 设计结论已闭合但正式链尚未装配 | Step 19、后续 04~07 | 按正式顺序继续文档，不移交实现。 |
| `I0-preflight` | 目标仓、git/Cargo、ledger/boundary 未建立 | target repo + 07 | 不修改代码。 |
| `I1-local` | 本地契约/negative/fake 可独立实现 | Step 5~16 closed cuts | 07 可在依赖闭合后规划，但不得声称 production integration。 |
| `I2-positive` | 需要其他 owner 的正向 schema/provider/route | `L2T-UP-001~006/008` | 受影响 boundary wait；fail closed/blocked adapter。 |
| `I3-consumer` | future downstream client/integration | `L2T-UP-009` | 保持 server contract；不承诺 client。 |
| `E-evidence` | 需要真实执行、artifact、report、签署 | 05/06/07 与 `UP-007` | 不生成或引用虚构证据。 |

## 4. 已关闭问题不再作为风险

| 已关闭项 | 关闭依据 | 结论 |
|---|---|---|
| 七模块与文件 owner | Step 4~5 | `contracts/domain/application/infra/api/worker/jobs` 和依赖方向唯一。 |
| 41 对象字段/factory/member | Step 6 + R-6 | 所有必填字段、secondary carrier、状态和来源可回指。 |
| Store/Port/UoW callable | Step 7 + R-7 | 七 Store、七 external Port、foundation 与 entry callable 已闭合。 |
| Public protocol inventory/schema | Step 8 + R-8 | 正式数量为 `13/11/5/4/4`，metadata、view、receipt、report、error/replay 闭合。 |
| 37 条函数流 | Step 9 + R-9 | exact callable、UoW/phase、state/effect、error/replay/test 回指闭合。 |
| 六状态族 | Step 10 | 合法/非法转换、terminal fence、触发函数和测试名一致。 |
| 持久化/错误/并发 | Step 11~13 | CAS、semantic uniqueness、rollback/unknown、replay/late material 已闭合。 |
| 配置代码绑定点 | Step 14 | typed candidates、builder seam 和 25 条 config redline 已闭合；具体值留给 04。 |
| 观测/审计契约 | Step 15 | body-free log/metric/trace/audit 与原子 pair 已闭合；backend 留后续。 |
| 最小测试入口 | Step 16 | 七模块、全部协议、状态、事务、并发、错误、配置、观测均有切口。 |
| 实施承接输入 | Step 17 | 字段/DTO/Query/state/side-effect 与 07 boundary pre-audit 已通过。 |

以上 closed 项若实现时出现真正 schema/callable 矛盾，必须以新 blocker 回流 owning Step；不能因为本表写“closed”而在代码中猜补。

## 5. 详细设计风险表

| ID | 风险 | 影响与阻塞范围 | 缓解/未确认前处理 | Owner / 待确认方 |
|---|---|---|---|---|
| `L2T-DDD-R01` | Step 19 尚未重建正式 03 | 阻塞正式详细设计入口和实现移交；不阻塞本 Step。 | Step 19 删除旧 03，依据 Step 1~18 按 18 章重建并审计。 | 详细设计维护者 |
| `L2T-DDD-R02` | 正式 04/05/06/07 尚未按新 03 完成 | 阻塞 config/test/acceptance/phase/commit/evidence/ledger 真相源和正式实现开工。 | 严格按正式顺序逐文档 full-restart；旧 05/06 只作 historical material。 | 各文档维护者 / 用户 review gate |
| `L2T-DDD-R03` | 目标仓 `/home/aris/Projects/quantalithos-tools` 当前不存在 | 阻塞 Cargo/git/build/test/commit 和 implementation ledger 的真实检查。 | 07 首个 preflight boundary 明确创建/接管方式并验证 workspace、git identity、Core path；03 不创建仓。 | 实施计划维护者 / 实现 agent |
| `L2T-DDD-R04` | Concrete transport/runtime/backend 未选择 | 阻塞 production API/worker/jobs adapter、migration和部署；不阻塞 backend-neutral contracts/domain/application/fake。 | 04/ADR/07 仅在保持 Store/Port 语义下绑定产品；不得渗入 domain。 | 架构 / 配置 / 实施计划维护者 |
| `L2T-DDD-R05` | 测试脚本、fixture、artifact/report/evidence schema 尚未正式定义 | 阻塞真实 test gate、验收 evidence 和 release claim；不阻塞 Step 16 planned cuts。 | 05/06/07 定义并真实运行；之前不创建 run_id/evidence alias或“通过”记录。 | 测试 / 验收 / 实施计划维护者 |
| `L2T-DDD-R06` | Fake 被误当 production readiness | 可让 blocked upstream seam 被错误宣称 ready。 | Fake 只验证 L2 mapping/error/redaction parity；所有报告显式标注 local/fake，不能替代 provider/route evidence。 | 实现 / 测试 / 评审者 |
| `L2T-DDD-R07` | 旧 README/03/05/06 污染回流 | 可能恢复 Python/mixed、MCP inventory、registry/policy/executor、固定技术栈、旧测试结果。 | Step 19 做旧词扫描；正式章节只承接 current upstream + Step 1~18。 | 详细设计维护者 / reviewer |
| `L2T-DDD-R08` | 正式摘要与字段级 calibration 发生冲突 | 实现者可能选边形成第二 schema。 | 正式文档优先；不清楚时读精确 source；仍冲突则暂停回 owning Step，不能自行选择。 | 设计维护者 / 实现 agent |

## 6. 上游 blocker 与 reopen 证据矩阵

关闭 blocker 不能只靠口头“已有接口”或 fake success。每项必须有正式 owner、可引用版本、字段/状态/错误、消费/恢复语义和受影响文档回填。

| Blocker | 当前影响 | 当前安全实现 | Reopen/关闭所需正式证据 | 需要回开的设计位置 |
|---|---|---|---|---|
| `L2T-UP-001` Authorization owner/source | CF-09、IF-02、JF-02 positive consumption | `Unverifiable/Missing/Conflicting`、fail closed、gap；不自授权 | owner identity、invocation-bound request/result schema、authority/revision/freshness/error/ownership matrix | 正式 00/01/02；Step 6 precondition、Step 7 Port、Step 8/9/10/12/14/16 |
| `L2T-UP-002` policy/high-risk taxonomy | requirement classification 与测试分类 positive path | L2 只声明 execution requirement；unknown/unsupported fail closed | formal taxonomy owner/version、tool-definition-to-requirement mapping、conflict/unknown rules；证明不把 L2 statement 当 allow/deny | 正式 00~02；Step 6/8/9/10/12/16；04/05 |
| `L2T-UP-003` Sandbox generic mapping | CF-10/11、IF-03 positive request/source mapping | MappingBlocked/Unverifiable、no host fallback、no outcome from unverified source | canonical handoff request、source/result/error carrier、correlation/version mapping、forbidden body、exact adapter operations | Step 6 handoff/outcome；Step 7 Sandbox/Source Port；Step 8/9/10/12/14/16 |
| `L2T-UP-004` Sandbox receipt/feedback/DLQ/cleanup | execution handoff result、recovery与生产 worker | local attempt only、CarrierUnavailable/CallOutcomeUnknown、manual owner；不造 receipt/DLQ | Sandbox receipt/status authority、call ambiguity/recovery ownership、feedback/dead-letter/cleanup handoff contract | 正式 01/02；Step 7/9/10/12/13/14/16；04/05/07 |
| `L2T-UP-005` Observability producer/source/route | OF-03、IF-05、JF-04 positive observation integration | body-free material、RouteBlocked/Unknown、local attempt；不建 store | producer/source family、event/material schema、route binding、accepted/blocked/error contract、owner | Step 6 safe handoff；Step 7 collaboration Port；Step 8/9/10/12/14/15/16；04/05 |
| `L2T-UP-006` Observability formal-chain/status conflict | readiness、status feedback与 evidence attribution | current workspace input only；Unknown/Unverifiable；不声称 ready | consistent current formal 00~07 status、formal observation status schema与 readiness authority，冲突消解记录 | 正式 dependencies；Step 1/3/14/15/18；后续 04~07 |
| `L2T-UP-007` workspace baseline not frozen | immutable source attribution、reproducibility、evidence | 只引用 file/section；不写 commit baseline、run 或 signoff | project-recognized immutable design/upstream baseline，真实 commit/source attribution，由 07 ledger记录 | Step 1/3/17/18；正式 03 refs；07 baseline/ledger |
| `L2T-UP-008` Core tools-specific shared contract authority | compile reuse和跨仓 shared type exactness | 只复用逐 type 核查的 generic Core types；Tools-specific 保持 CandidateOnly/Unverifiable | package/crate/type path、exact schema/version/compatibility、ownership、local path/revision authority | 正式 01/02；Step 3/6/7/8/9/10/12/14/16；04/07 |
| `L2T-UP-009` SDK tools client seam | future typed client/wrapper/compatibility/coverage | 提供 server protocol/guidance；SDK future/excluded | SDK owner 的 tools client contract、language/package/version、error/page mapping、compatibility/test boundary | 正式 dependency docs；Step 1/2/8/17/18；SDK design/05/07 |

## 7. 待确认事项表

| ID | 事项 | 当前影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|---|
| `L2T-DDD-Q01` | Step 19 正式 03 装配和全链审计 | 尚无新版正式 03 入口 | 详细设计维护者 / 用户 review | 本轮继续 Step 19；不按旧 03 开工。 |
| `L2T-DDD-Q02` | 正式 04/05/06/07 的生成/重建 | config/test/acceptance/implementation 未定 | 对应文档维护者 / 用户逐文档确认 | 03 完成后停审；未经确认不自动进入 04。 |
| `L2T-DDD-Q03` | 目标仓创建方式、真实 Rust/Cargo/git baseline | 无法开始代码实施或真实验证 | 实施计划维护者 / 实现 agent | 等正式 07 preflight；不创建或假设仓状态。 |
| `L2T-DDD-Q04` | 第一批 production Store/transport/runtime adapter 选择 | production integration/deployment 未定 | 架构/配置/实施维护者 | 保持 backend-neutral/fake；不在 local truth schema写产品字段。 |
| `L2T-DDD-Q05` | `L2T-UP-001~009` 各正式合同何时闭口 | 影响对应 external positive boundary | 上表各 owner | 保持 blocked/fail-closed/future；按证据矩阵回开。 |
| `L2T-DDD-Q06` | 测试/验收 artifact、report、redaction scan 与 evidence authority | 无法形成真实通过/签署 | 05/06/07 维护者 | 只保留 planned cuts；不生成真实 alias/result。 |

## 8. 未确认前的统一处理规则

| 场景 | 强制处理 |
|---|---|
| 正式 03 未装配 | 不使用旧 03；只继续设计 Step 19。 |
| 正式 04~07 未完成 | 不正式移交代码实现；不自行补 config/test/evidence/phase/commit。 |
| 目标仓/ledger/boundary 不存在 | 不修改实现代码；由 07 预创建全部 planned skeleton 后再开工。 |
| local field/DTO/state/callable 缺口 | 停止受影响 boundary，记录 design blocker，回 owning Step；禁止 local alias/string/default。 |
| compile Core type 缺失/冲突 | 停止依赖该 type 的 boundary；不复制 Core schema到 L2。 |
| runtime/event Port unavailable | 允许 typed blocked/unavailable/fake path；禁止假 positive、host fallback或 sibling Cargo dependency。 |
| external call outcome unknown | 保留 Prepared/Unknown marker和 manual owner；禁止自动二次调用。 |
| product/backend 未定 | 保留 Store/Port/builder abstraction；禁止把产品选择写入 domain/application protocol。 |
| 测试/evidence 未执行 | 只写 planned test cut；不写 pass、coverage、run_id、artifact或签署。 |
| 正式文档与 calibration 冲突 | 以正式文档为入口，读取精确 source；仍冲突则暂停回设计，不自行选边。 |

## 9. 正式 §17 回填草稿

正式 `03-详细设计.md` §17 应回填：

1. 风险分层和“本地设计闭合不等于 external readiness”。
2. `L2T-DDD-R01~R08` 的影响、阻塞范围和缓解方式。
3. `L2T-UP-001~009` 的当前行为、关闭证据和 reopen 位置。
4. `L2T-DDD-Q01~Q06` 与未确认前处理规则。
5. 明确没有新增上游 blocker，也没有把 open blocker 写成 resolved。

正式 §17 不得把未来 owner、provider、route、SDK、product、test/evidence 或实现状态写成已确认事实。

## 10. Stop review 与进入下一步条件

| Gate | 结论 |
|---|---|
| 所有未关闭 local/formal/preflight/external/evidence 风险均有记录 | pass |
| `L2T-UP-001~009` 均有影响、safe default、关闭证据和 reopen 位置 | pass |
| 阻塞全部实现与只阻塞 positive adapter/future client 已区分 | pass |
| 未确认前处理规则禁止实现者自行补设计 | pass |
| 已关闭 local schema/callable/state/test 不重复伪装成 open | pass |
| 未新增 schema/state/config/product/phase/commit/evidence | pass |
| 新增上游 blocker | 无 |
| 下一步 | Step 19 创建装配中间产物并重建正式 `03-详细设计.md`。 |

```text
step_status = completed
gate_status = pass
gate_reason = every unresolved formal-chain, preflight, upstream-positive, downstream-consumer and evidence risk has an impact scope, owner, safe pre-confirmation behavior and evidence-based reopen condition; no new upstream blocker was found
next_allowed_action = create_step_19_formal_document_assembly.md_then_rebuild_formal_03.md
formal_03_write_allowed = only_after_step_19_intermediate_is_created
commit_required = false
```
