# L3-capability-hub 07 实施计划 Step 4：实施对象与交付物

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/实施计划书写规范.md` §3
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §4
> 输入: Step 2 范围、Step 3 前置条件、正式 `03/04/05/06`
> 参考粒度: `projects/L1-governance` 和 `projects/L3-method-library` 对应 Step 4
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 抽取实施对象与交付物 |
| 当前状态 | completed_continuous_execution |
| 输入基线 | Step 2 P0/P1/P2 范围；Step 3 mandatory-reading、仓库、依赖和证据门禁 |
| 正式输入 | `03-详细设计.md` §4~§16；`04-配置设计.md`；`05-测试方案.md`；`06-验收标准.md` |
| 目标实现仓 | `/home/aris/Projects/quantalithos-capability-hub`；设计期未发现 |
| unresolved upstream blocker | `0` |
| implementation prerequisite | `CH-PREREQ-TARGET-REPO-001` 仍开放，不能写成已交付 |
| 下一动作 | 进入 Step 5，按可验证功能增量设计 phase 与依赖顺序 |

## 2. 本步输入与 SOP 问题回答

| 输入 | 读取目的 | 结果 |
|---|---|---|
| Step 2 scope artifact | 固定 P0、P1、P2 和非范围 | 不扩大 capability-hub 责任 |
| Step 3 prerequisites artifact | 固定七 member、依赖和证据根路径 | 交付物必须落到可检查的仓库/边界 |
| `03-详细设计.md` §4~§16 | 抽取模块、对象、Port、协议、flow、state、TX、binding、observation | 采用 exact source，Step 4 只做聚合 |
| `04-配置设计.md` | 抽取 profile、source、activation、failure 和 external slots | 配置交付与代码交付分离 |
| `05-测试方案.md` | 抽取 TC/DS/EV、suite、gate、check、report builder | 测试和证据是一等交付物 |
| `06-验收标准.md` | 抽取 AC/VF/VETO、handoff 和 release 输入 | 不伪造最终裁决 |

本步必须回答的问题：

1. 本轮实施会修改哪些代码单元？
2. 哪些协议、flow、state、Port、adapter、配置和测试面属于交付物池？
3. 哪些脚本、artifact、report、ledger 和文档同步必须交付？
4. 哪些对象明确不交付？
5. 哪些交付物依赖 sibling 或外部模块，依赖以何种形式存在？
6. 如何保证对象池不会替代 Step 5/6 的 phase 与 commit boundary？

## 3. 当前材料诊断

| 材料 | 问题 | 当前处置 |
|---|---|---|
| 旧 README / 旧正式方向 | 把 Hub 写成 runtime、provider、cost、approval 执行中心 | historical material；不进入交付物池 |
| 缺失正式 `07` | 没有可执行的交付物闭环 | 本 Step 建立 code/test/config/evidence/ledger 交付面 |
| `03` 的 43 个 HLD object、250 public types、83 protocols | 直接逐项复制会把 Step 4 变成详细设计 | 按 member、协议族、可验证 surface 聚合；exact schema仍以 `03` 为准 |
| `05/06` 的证据合同 | 可能被误当成测试完成事实 | 只列 planned deliverable 和判定方向，不创建 run/evidence |
| 目标实现仓未发现 | 没有实际代码落点 | 保留为 implementation prerequisite，PH-01 开工门禁 |

## 4. 设计取舍

| 方案 | 取舍 | 结论 |
|---|---|---|
| 按 43 个对象逐项形成实施任务 | 细，但无法表达阶段纵切、测试和证据关系 | 不采用 |
| 按七 member + 协议族 + 测试/证据面聚合 | 可映射 phase、boundary 和 gate，仍可回指 exact source | 采用 |
| 把真实 DB、bus、provider、governance approval adapter列为 P0 | 看似接近生产，但会越过所有权和 product-neutral 红线 | 不采用 |
| 把 fake、controlled、disabled seam 与 report/check 脚本列为 P0 | 可验证本仓语义，又不伪造外部产品存在 | 采用 |
| 在本 Step 创建 implementation ledger 实例 | boundary id 尚未由 Step 6 收稳 | 不采用；T068/T069 创建 |

## 5. 结构化中间产物

### 5.1 实施对象池

| 对象池 | 类型 | 正式来源 | 预计实现落点 | 完成判定方向 |
|---|---|---|---|---|
| Workspace 与命名布局 | code structure | `03` §4；Step 3 | 根 `Cargo.toml`、`crates/<role>` | 七 member、package/lib/binary 命名和 dependency boundary 通过；旧命名不再作为 authority |
| Contracts surface | code | `03` §5~§8 | `crates/contracts/src` | 250 public types、typed refs、metadata、errors、26 Command、33 Query、6 Inbound、10 Outbound、8 Job 可被 exact source 覆盖；所有声明/字段/variant/payload 有英文 `///` |
| Domain truth and policy | code | `03` §6、§10 | `crates/domain/src` | 43 HLD objects、7 application helpers对应的状态/关系/策略/invariant 可测试；不拥有 approval truth、method body 或 runtime truth |
| Application orchestration | code | `03` §7、§9、§11~§13 | `crates/application/src` | 36 Ports、22 repository traits/110 methods、83 exact flows、22 TX、idempotency/UoW/recovery surface 可落码；Query 保持 no-write |
| Infra stores/adapters/builder | code/config | `03` §10、§14；`04` | `crates/infra/src` | repository/fake/controlled/disabled adapter、profile loading、runtime builder 和 failure mapping 有 exact owner；不把 sibling 产品变成 Cargo edge |
| API entry | code | `03` §4、§8 | `crates/api/src` | 26 Command + 33 Query route/service mapping 只进入 application facade，不直接拥有 domain truth |
| Worker entry | code | `03` §4、§8~§9、§14 | `crates/worker/src` | 6 Inbound、10 Outbound collaboration/capture seam 和 owned background lifecycle 成立；不执行 tools/runtime truth |
| Jobs entry | code | `03` §4、§8~§13 | `crates/jobs/src` | 8 Operations Job dispatch、typed journal/report/replay/terminalization 成立；不修复 core truth或重跑 mutation |
| Configuration surfaces | config | `04` §3~§15 | implementation repo `config/` and loaders | `18/27/21` inventory、3 profiles、9/6/10 bindings及failure semantics可被校验；不猜 key/default |
| Test and fixture surfaces | test | `05` §3~§14 | crate tests、`tests/`、fixture builders | 189 TC、189 DS、189 EV contract、638 state pairs和22 TX等均有 planned coverage；未执行不标 pass |
| Gate/report/check surfaces | script/evidence | `05` §9、§13；`06` §10~§14 | `scripts/gates`、`scripts/reports`、`scripts/checks` | 10 suites、5 gates、9 checks、4 builders按显式 run id 生成派生报告 |
| Implementation ledgers | design artifact | code ledger standard、Step 3 | design-calibration ledgers | T068/T069 创建 project ledger 和每个 planned boundary skeleton；当前 Step 4 不预填 execution facts |

### 5.2 Protocol / flow 交付物池

| Family | 数量 | 交付面 | 必须验证的边界 |
|---|---:|---|---|
| Command | 26 | contracts DTO、application command flow、API handler、stored result | identity/registry/descriptor/seam/relation/exposure writes、duplicate/conflict/UoW、zero-effect |
| Query | 33 | contracts query/view、application resolver、API handler、read material | no-write、visible/empty/stale/degraded/unavailable、body-free safe surface |
| Inbound Event Consumer | 6 | inbound envelope、worker intake、receipt/dedup、controlled source adapter | caller/reference resolution、receipt、unsupported/replay、不得反向写外部 truth |
| Outbound Event | 10 | immutable snapshot/capture、mapper、collaboration facade、worker delivery seam | local capture 与 external collaboration 分离、source snapshot 对称、失败不回滚已提交 truth |
| Operations Job | 8 | typed input/result、handler/runner、journal、stored report、jobs entry | checkpoint、partial、replay、safe terminalization、control-plane defect 不被伪装成业务失败 |

合计为 `26 + 33 + 6 + 10 + 8 = 83` 条独立 protocol/flow surface。数量是设计库存，不是已实现或已执行结果。Step 6 必须把每一条分配到唯一 boundary，不能在实现仓自行新增 generic protocol。

### 5.3 代码与运行辅助交付物

| 交付物 | 预计落点 | 完成判定方向 |
|---|---|---|
| `capability-hub-contracts` | `crates/contracts` | public wire/typed carrier 与 codec source 闭合 |
| `capability-hub-domain` | `crates/domain` | truth owner、state guard、policy/invariant 与纯领域测试闭合 |
| `capability-hub-application` | `crates/application` | service、Port、UoW、idempotency、stored result 和 flow orchestration 闭合 |
| `capability-hub-infra` | `crates/infra` | stores、fake/controlled/disabled adapters、config binding、runtime builder 闭合 |
| `capability-hub-api` | `crates/api` | Command/Query entry 与 application facade 映射闭合 |
| `capability-hub-worker` | `crates/worker` | Inbound/Outbound seam、supervision、capture/ref continuation闭合 |
| `capability-hub-jobs` | `crates/jobs` | 8 Job action、runner、journal/report/replay 闭合 |
| Workspace/test support | 根 `Cargo.toml`、`tests/` | edition、dependency、fake builder、deterministic clock/id 和 fixture 组织通过 |

### 5.4 测试、证据与报告交付物

| 交付物 | 正式来源 | 预计落点 | 完成判定方向 |
|---|---|---|---|
| Canonical test contract set | `05` §6~§8 | tests/fixtures/builders | `TC-CH-*`、`DS-CH-*`、`EV-CH-*` 189/189/189 可逐项定位 |
| State/TX/config coverage | `05` §6、§8、§10 | unit/service/contract suites | 638 pairs、22 TX、`CFG-F-*` failure family 不缩小分母 |
| Primary suites | `05` §9 | suite runners | 10 个互斥 suite 都有 owner、input、raw output 和失败语义 |
| Gate/check builders | `05` §9；`06` §10/§11 | scripts/gates、scripts/checks、scripts/reports | 5 gates、9 checks、4 builders只消费真实同 run raw/report |
| Raw artifacts | `05` §13；`06` §3 | `artifacts/test/<run_id>/` | 每个执行 run 独立、不可覆盖、带来源和 digest |
| Run reports | `05` §13；`06` §10 | `reports/runs/<run_id>/` | 由 raw artifact 派生，不手写 passed |
| Acceptance/review material | `06` §10~§14 | `reports/acceptance/`、`reports/review/` | evidence index、handoff、VETO、open issues、risk/review shell具备输入字段；无真实 verdict/signoff |

### 5.5 明确非交付物

| 非交付物 | 所属 authority | 处置 |
|---|---|---|
| runtime execution、tools execution | `00/01/02` non-scope | 不进入代码、protocol、job 或 evidence claim |
| governance approval / Policy truth | `00/01/03` ownership | Hub 只保存 approval seam/ref/summary，不生成或执行 approval |
| method body/source | `00/03` body-free boundary | 只交付 typed relation/ref，不保存正文 |
| provider route/quota/cost/secret truth | `00/03/04` boundary | 只交付 adapter descriptor、safe summary、secret handling marker；不拥有 provider truth |
| marketplace listing/transaction | `00/02` adjacent boundary | 不作为 P0 phase 或 release prerequisite |
| SDK client/cache/deep UX | `00/03` adjacent boundary | 仅交付 SDK server exposure boundary/ref |
| observability backend truth | `03/04/06` boundary | 交付 Hub-owned observation projection seam，不交付 backend product |
| concrete DB/bus/search/object-store product | `03/04` product-neutral rule | 使用 fake/controlled/disabled seam，后续 selected integration 另行受控 |
| final acceptance verdict/signoff | `06` | 只定义可生成的 handoff 输入，不伪造结论 |

### 5.6 跨仓和外部依赖交付物

| 交付物/协作面 | 依赖 | 类型 | 本轮交付形态 | 失败处理 |
|---|---|---|---|---|
| Core contract reuse | `quantalithos-core/crates/contracts` | 唯一 compile-time sibling | `core-contracts` path dependency candidate | preflight 不匹配即阻断，不复制或猜测 |
| Bus/event collaboration | `quantalithos-bus` | runtime/event | event/capture/adapter/fake seam | unavailable/invalid contract按 typed failure 处理 |
| Governance/policy seam | governance project | runtime/ref | approval/result ref、safe summary、controlled fake | approval truth 缺失不由 Hub 补写 |
| Method-library asset relation | method-library project | runtime/ref | body-free asset ref/relation、controlled adapter | body source 不入仓；relation contract不等于 body owner |
| Runtime/tools boundary | runtime/tools project | runtime/adapter | exposure/visibility/availability marker | 不引入 execution path |
| SDK server exposure | SDK project | runtime/contract | server exposure descriptor/ref | SDK client/cache不进入本仓 |
| External MCP/A2A/API | external product/service | external adapter | adapter descriptor、normalized metadata、safe summary、fake/controlled binding | concrete product未选时保持 Disabled/Controlled |
| Observability backend | observability project | report/observation | backend-neutral event/metric/span/durable carrier seam | sink failure不能改业务 truth |

## 6. 交付物完整性审计

| 审计维度 | 结果 | 说明 |
|---|---|---|
| 七 workspace member | pass-designed | 与正式 `03` §4 一致 |
| 43 HLD object + 7 helper | pass-designed | 作为 exact source inventory，未新增对象 |
| 36 Port / 22 repository / 110 methods | pass-designed | Step 6 需逐 boundary 分配 |
| 83 protocol/flow | pass-designed | `26/33/6/10/8` 五族完整 |
| 24/111/638 state inventory | pass-designed | 不把状态摘要改写为实现事实 |
| 22 transaction | pass-designed | 与测试/验收交付面相连 |
| 189 TC/DS/EV | pass-designed | 合同分母保持完整 |
| 10 suite / 5 gate / 9 check / 4 builder | pass-designed | 具体命令在 Step 7 收稳 |
| 配置 `18/27/21`、3 profile、9/6/10 binding | pass-designed | 具体 source/default/failure以 `04` 为准 |
| 非交付物与责任边界 | pass-designed | 无 runtime/approval/body/provider/marketplace 合并 |
| 实现仓和真实证据 | prerequisite | 目标仓、run、artifact、report、verdict、commit均未建立 |

## 7. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_04_objects_deliverables.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“实施对象池”“Protocol / flow 交付物池”“测试、证据与报告交付物”“明确非交付物”和“跨仓和外部依赖交付物”小节。

正式 `07-实施计划.md` §4 应说明：本轮交付按七个正式 workspace member、五类 protocol/flow、配置与 adapter seam、测试/证据/报告链和 implementation ledger 组织。实现对象来自正式 `03/04/05/06` 的现有契约，Step 4 不重新定义字段、状态、Port 或协议；Step 5/6 再把这些聚合对象拆成 phase 和 commit boundary。目标实现仓仍是实现前置条件，所有真实执行事实保持未建立。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓未发现 | 所有码、测试和脚本交付物尚无实际落点 | PH-01 开工前检查；不得使用设计仓替代 |
| 具体外部 MCP/A2A/API 产品未选定 | 只能定义 adapter descriptor 和 controlled/disabled seam | 由 Step 8/9 记录，不阻塞 P0 设计 |
| boundary 数量和 ID 尚未确定 | implementation ledger 实例不能提前生成 | Step 6 收稳后由 T068/T069 创建 |
| selected integration 环境未建立 | 不能声称 P1/selected evidence | 由 `05/06` 的 future prerequisite 处理 |

## 9. 进入下一步条件

| 条件 | 状态 | 依据 |
|---|---|---|
| 实施对象已从 active `03/04/05/06` 抽取 | pass-designed | 七 member、协议族、配置、测试、证据和台账面已列出 |
| 非交付物已独立列出 | pass-designed | runtime/tools、approval、body、provider、marketplace 等未混入 |
| 跨仓依赖已裁剪 | pass-designed | 只有 `core-contracts` 为 compile-time candidate |
| 交付物有判定方向 | pass-designed | 每类有预计落点、source 和完成口径 |
| 未产生实现/测试/证据事实 | pass-designed | 无 target repo、commit、run、artifact、report、verdict |
| 下一步 | allowed | `enter_07_step_05_phases_dependencies` |
