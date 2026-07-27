# L3-capability-hub 03 详细设计 Step 18：风险与待确认事项

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18
> 书写规范：`standards/document/详细设计书写规范.md` §5.17
> 回填章节：`projects/L3-capability-hub/03-详细设计.md` §17
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`03_step_18_completed_continuous_execution`

---

## 1. 本步目标与裁决边界

本 Step 只收口 Step 1~17 仍会影响正式装配、下游设计或未来实现的事项。它不新增对象、字段、Port、协议、状态、配置键、产品选择、测试结果、验收结论、实施 phase 或 commit boundary。

本步采用以下闭集分类；任何事项必须且只能落入其中一类：

| 分类 | 精确定义 | 是否是当前上游 blocker |
|---|---|---|
| `resolved` | 已由当前正式上游或 Step 1~17 的受控回开闭合，仅保留历史诊断 | 否 |
| `non_blocking_debt` | 当前有明确、可执行的项目内契约，但跨仓正式设计尚未同步 | 否；触发语义变化时回开 |
| `implementation_prerequisite` | 设计可继续，未来实现开工或指定实现边界前必须满足 | 否；只阻塞标明的实现范围 |
| `controlled_reopen` | 当前基线有效；若后续选择改变既有 contract surface，必须回开指定 Step | 否；触发后阻塞受影响范围 |
| `downstream_work` | 按文档所有权明确留给正式 `04/05/06/07` 的设计工作 | 否；阻塞对应下游文档完成 |
| `out_of_scope` | 不属于 Capability Hub truth ownership，不得作为 Hub 风险被“解决”为本地能力 | 否；禁止进入本仓实现 |

“尚未实施”“尚未执行测试”“尚无验收签署”不是详细设计 blocker。它们是未来执行事实，本文不得伪造为已完成或把它们当作上游设计缺口。

## 2. 输入闭包

| 输入 | 本步读取结论 |
|---|---|
| Step 1~5 | 当前正式 `00/01/02`、范围、Rust/仓库约束、七 member 布局和模块 owner 已闭合；旧正式 `03` 与 README 冲突内容仅为 historical material |
| Step 6~10 | `43 + 7` 对象/helper、36 Port、250 public protocol type、83 protocol/flow、24 state-like enum / 111 active variant 和 638 ordered pair 已闭合 |
| Step 11~13 | 22 repository trait / 110 method、事务、一致性、17 error、51 issue、canonical digest、atomic reserve、reentry 与 commit-unknown 已闭合；保留两项 L0-core design-sync debt |
| Step 14 | 27 local/base Port、9 external Port / 14 callable、6 source、10 route、8 dispatch 和 Stage 0~7 binding 已闭合；具体 key/profile/product/material 留正式 `04` |
| Step 15 | 60 log、48 metric、27 span、20 durable profile 与 3 event 已闭合；候选实现为现有模块内 private backend-neutral instrumentation |
| Step 16 | 83 flow、24 state family、22 transaction/concurrency、12 binding、12 observability 最小 test cut 已闭合；没有测试执行声明 |
| Step 17 | 16/16 source、7 workspace unit、9 capability cut、mandatory reading、字段/DTO/Query/state/phase 预审和目标仓前置已闭合 |
| project ledger | 旧 blocker 记录、两项 active debt、目标仓缺失事实和连续执行恢复点已核对 |

## 3. SOP 四问裁决

| SOP 问题 | 当前裁决 |
|---|---|
| 哪些问题仍可能影响代码实现？ | L0-core accessor/serde 正式设计同步、目标实现仓、具体配置与产品绑定、具体 observability backend，以及正式 `04/05/06/07` 尚待重建会影响对应实现边界。 |
| 哪些会阻塞实现，哪些只影响后续优化？ | 正式 `03/04/05/06/07` 与 implementation ledger/boundary skeleton 未完成、目标仓未就绪会阻塞实现开工；两项 L0-core debt 当前不阻塞，但签名/字节/serde shape 变化会触发回开；具体产品只阻塞其 adapter/deployment boundary。 |
| 每项需要谁确认？ | 本文主登记表固定 design owner、dependency owner、implementation owner 或下游文档 owner；实现者不是设计缺口的默认裁决者。 |
| 未确认前如何处理？ | 继续使用本文固定的保守契约；不得自造 key/default/product/schema/backend；触发 controlled reopen 时停止受影响边界并回到指定 Step。 |

## 4. Active risk 与开放事项主登记表

| ID | 事项 | 分类 | 当前影响 | Owner / 待确认方 | 触发条件 | 阻塞范围 | 未确认前 / 临时处理 | 回开或承接目标 |
|---|---|---|---|---|---|---|---|---|
| `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` | L0-core 正式 contracts 尚未记录 existing `IdempotencyKey::as_str()` 与 byte-preserving 语义 | `non_blocking_debt` | 跨仓正式设计与 Hub 已授权依赖假设未完全同步 | L0-core design owner；Capability Hub contracts owner 负责监测 | exported signature、返回值保持性或 UTF-8 byte 语义与当前假设不一致 | 受影响的 normalized key、request digest、Inbound digest 与 compatibility fixture；不阻塞当前 Step 19 | 精确使用 `as_str().as_bytes()` 原始 UTF-8；禁止 trim、case-fold、Unicode normalization、`Display`、`Debug` 或 serde 替代 | 语义变化回开 Step 13，并复核 Step 8/14/16；仅文档补齐则同步依赖说明 |
| `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` | L0-core 正式设计未承诺 sibling 当前 shared serde wire shape | `non_blocking_debt` | Hub v1 shared-field compatibility 依赖当前已审计 shape | L0-core/contracts design owner；Hub contracts/test owner 监测 | shared field 名称、tagging、option/newtype/envelope 编码或 bytes 变化 | contracts codec、digest、fixture 与 external binding；不阻塞当前 Step 19 | Hub v1 fixture 锁定当前 bytes；不得把 sibling 当前 shape 表述为 L0-core 永久承诺 | shape 变化回开 Step 8/13/14，并同步 Step 16 与正式 04/05 |
| `CH-PREREQ-03-FORMAL-ASSEMBLY-001` | 新版正式 `03-详细设计.md` 尚待 Step 19 装配 | `implementation_prerequisite` | 当前 calibration 是设计来源，但旧正式 `03` 仍是 historical material，不能作为实现入口 | Detailed-design owner | Step 18 完成后进入正式装配 | 阻塞正式 `03` 交付与后续 `04~07` active baseline；不是上游 blocker | 只允许 Step 19 从 Step 1~18 canonical source 装配，不修补旧正文 | Step 19 / formal `03` |
| `CH-PREREQ-TARGET-REPO-001` | `/home/aris/Projects/quantalithos-capability-hub` 当前不存在 | `implementation_prerequisite` | 不能核实 Cargo workspace、`.git`、branch、git identity、真实命令或写代码 | Formal 07 prerequisite owner；未来 implementation owner | 任一代码 boundary 准备开工 | 阻塞全部代码写入、测试执行和实现 commit；不阻塞设计仓 `03~07` | 不创建替代目录、不推断 repo/Cargo/git 状态；在 07 明确 preflight gate | Formal 07 Step 3/8；implementation ledger preflight |
| `CH-DOWNSTREAM-CONFIG-CATALOG-001` | raw key、source、priority、profile、default、validation、secret ref、activation、failure 尚待正式 04 固定 | `downstream_work` | 实现者目前不能安全发明 config schema 或环境变量 | Configuration-design owner | 正式 `03` 完成后进入 `04` full-restart | 阻塞具体 config reader/runtime builder/deployment binding；不阻塞 Step 19 | 继续使用 Step 14 的 typed owner/category/binding boundary，不写具体 key/default/product | Formal `04` Steps 1~15 |
| `CH-REOPEN-PRODUCT-BINDING-001` | persistence/API/transport/external adapter 的具体产品必须证明满足既有语义 | `controlled_reopen` | 当前 Port 与 failure contract 产品中立；不兼容产品可能破坏 linearizability、UoW、ordering、typed failure 或 fake parity | Architecture/config/adapter owner | 候选产品不能满足 Step 11~14 任一 mandatory semantic，或需 public type/Port/state/config authority 变化 | 只阻塞该产品及依赖它的 implementation boundary | 保持 Configured/DeterministicFake/Disabled/Missing 与现有 Port；不得用 sleep/replica guess/generic error 绕过 | 回开 Step 7/11/12/13/14 的受影响部分，并同步 formal 04/05/06/07 |
| `CH-REOPEN-OBSERVABILITY-BACKEND-001` | concrete observability crate/backend/config/private facade 尚未选择 | `controlled_reopen` | Step 15 只固定 private static instrumentation cut、155 profiles 与 3 events | Observability/config/infra owner | 选择 backend/crate/features；增加 facade/config；第三方类型越过 private boundary；observer failure 改变业务结果 | 只阻塞 concrete instrumentation/backend boundary；不阻塞 domain/application contract 或 Step 19 | 保持现有 `application/infra/api/worker/jobs` 内 private backend-neutral cut；不新增 `ObservabilityPort`、observer repository、业务 state 或第八 crate | 最少回开 Step 14/15 和 formal 04；若 public/file/Port surface 变化，按 Step 15 controlled-reopen matrix 回开 Step 3~8/16 |
| `CH-DOWNSTREAM-TEST-PLAN-001` | 完整 TC、data、environment、automation、evidence contract 尚待正式 05 重建 | `downstream_work` | Step 16 只有 minimum cut 与 planned command contract，不能替代测试方案 | Test-plan owner | Formal 04 完成后进入 `05` full-restart | 阻塞测试实现/执行宣称和 release evidence；不阻塞 Step 19 | 使用 Step 16 exact IDs/counts；不得声称 cut 已实现或通过，不创建真实 run/evidence alias | Formal `05` Steps 1~15 |
| `CH-DOWNSTREAM-ACCEPTANCE-001` | acceptance gates、veto、evidence sufficiency、decision/signoff contract 尚待正式 06 重建 | `downstream_work` | 不能从测试 cut 推断接受、签署或 release readiness | Acceptance-design owner | Formal 05 完成后进入 `06` full-restart | 阻塞正式验收决策；不阻塞 Step 19 | 只定义未来 gate，不伪造签署、豁免、evidence 或通过结果 | Formal `06` Steps 1~15 |
| `CH-DOWNSTREAM-IMPLEMENTATION-PLAN-001` | phase、task、commit boundary、per-boundary gate 与 completion audit 尚待正式 07 重建 | `downstream_work` | 实现 agent 还没有合法执行顺序和 boundary ledger | Implementation-plan owner | Formal 06 完成后进入 `07` full-restart | 阻塞 implementation ledger 和所有代码 boundary 开工 | 不提前创建 implementation ledger/skeleton；Step 17 只作 source handoff | Formal `07` Steps 1~13；完成时同步创建 ledger 与全部 skeleton |
| `CH-OUT-RESPONSIBILITY-001` | runtime/tools execution、marketplace listing、governance approval、method body、external payload body/delivery lifecycle | `out_of_scope` | 若误并入 Hub，会产生第二 truth owner 并污染对象/状态/接口 | Capability Hub design owner；对应外部 owner | 任一后续文档、配置或 boundary 试图把这些能力写成本仓责任 | 禁止该设计/实现 boundary 进入 Hub；不是等待 Hub 解决的 blocker | 仅保留 typed ref、safe summary、seam relation、formal exposure、controlled consumer view 或 stable handoff | 回写正式 `00/01/02/03` owner redline；移交相应 owner project |

## 5. 按阻塞范围归并

| 范围 | 当前阻塞项 | 当前允许动作 |
|---|---|---|
| Step 19 正式装配 | 仅 `CH-PREREQ-03-FORMAL-ASSEMBLY-001` | 装配 formal `03`；其他 active 项均已有保守处理，不阻塞装配 |
| Formal 04 | `CH-DOWNSTREAM-CONFIG-CATALOG-001` | 从 formal `03` 与 Step 14 handoff 建完整 catalog，不发明业务责任 |
| Formal 05 | formal 04 完成和 `CH-DOWNSTREAM-TEST-PLAN-001` | 把 Step 16 cut 变为 exact TC/data/env/gate/evidence contract |
| Formal 06 | formal 05 完成和 `CH-DOWNSTREAM-ACCEPTANCE-001` | 建 gate/veto/decision contract，不声称签署 |
| Formal 07 | formal 06 完成和 `CH-DOWNSTREAM-IMPLEMENTATION-PLAN-001` | 建 phase/boundary/gate，并同步创建 implementation artifacts |
| Implementation start | formal `03~07`、implementation artifacts、`CH-PREREQ-TARGET-REPO-001` | 设计仓继续；代码写入保持禁止 |
| Specific product/backend boundary | `CH-REOPEN-PRODUCT-BINDING-001` 或 `CH-REOPEN-OBSERVABILITY-BACKEND-001` 被触发 | 停止受影响 boundary，按表回开；不阻塞无关 boundary |

当前 unresolved upstream blocker 精确为 `0`。两项 debt 不是 blocker；目标仓缺失不是上游设计 blocker；下游正式文档尚未完成也不是上游冲突。

## 6. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 确认时点 | 未确认前处理 |
|---|---|---|---|---|
| L0-core 是否把 `IdempotencyKey` accessor/bytes 写入正式 contract | 影响跨仓长期稳定性 | L0-core design owner | 任何 dependency upgrade 前；最迟对应实现 boundary preflight | 使用已授权 exact bytes；保持 debt，不推断已同步 |
| L0-core shared serde shape 是否发生变化 | 影响 fixture、digest、wire compatibility | L0-core/contracts owner | Formal 05 fixture 固定前及 dependency upgrade 时 | 锁定当前 Hub v1 fixture；变化即回开 |
| 目标实现仓如何创建、初始化和配置 | 影响所有实现动作 | Formal 07 / repository owner | Formal 07 prerequisite 与 implementation preflight | 不创建、不推断、不写代码 |
| 具体 config key/profile/default/source | 影响 config reader、runtime builder、deployment | Formal 04 owner | Formal 04 Steps 5~9 | 只使用 typed category/owner，不命名 key/default |
| 具体 persistence/API/transport/external product | 影响具体 adapter | Architecture/config/adapter owner | Formal 04 或对应 implementation boundary 前 | 使用 fake/disabled/missing contract；不把产品语义写入 domain |
| 具体 observability backend/crate/facade | 影响 private instrumentation binding | Observability/config/infra owner | Formal 04 与对应 07 boundary | 保持 backend-neutral cut，不增加公开 surface |
| 完整测试、验收和实施门禁 | 影响 verification/release/implementation start | Formal 05/06/07 owner | 各自 SOP Step | 只承接 exact source，不伪造执行事实 |

这些事项均已有 owner、确认时点和临时处理，因此没有需要实现者自行选边的开放问题。

## 7. Historical resolved 项隔离

下表仅证明 active risk 表没有遗漏或复活旧 blocker；状态一律为 `resolved`，不再作为未关闭事项。

| Historical family | 关闭依据 | 当前处理 |
|---|---|---|
| Step 6 object/factory/member/Rustdoc gaps | Step 6 controlled reopen through Steps 8~14 | exact active declaration 由 Step 6 source map 提供；不把旧诊断复制为风险 |
| Step 7 Port/repository/UoW callable gaps | Steps 7/11/13/14 | 36 Port、22/110 repository 与 three-state commit resolution 已闭合 |
| Step 8 protocol/source/capture gaps | Steps 8/9/13/14 | 250 public types、83 protocols 与 exact source/capture contract 已闭合 |
| Step 9 Job transaction/reentry/collaboration gaps | Steps 9/11/12/13 | plan/initial/target/final UoW、winner read、non-recursive entry 已闭合 |
| Step 10 state mismatch and unclassified pairs | Steps 10/13/16 | 24/111 与 `239 + 98 + 301 = 638` 已分类 |
| Step 11/12 persistence/error/recovery gaps | Steps 11~14 | single authority、17 errors、51 issues、83 mappings 已闭合 |
| `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` | 2026-07-18 用户授权的 exact dependency assumption | 原 blocker 为 resolved；只保留新的非阻塞 design-sync debt |
| Step 14 config owner/binding/runtime cleanup gaps | Step 14 batches 14.1~14.6 | typed schema/owner/binding/failure 已闭合；concrete catalog 属 formal 04 |
| Step 15 observability owner/redaction/count gaps | Step 15 R15.1~R15.16 | `155/155 + 3/3` 和 10 high-risk zero-surface 已闭合 |
| README、旧正式 `00~06`、restart 前 Step 版本 | formal `00/01/02` 与各 calibration flow | 只作 historical material，不作为 schema/flow/risk source |

## 8. Forbidden risk resolution shortcuts

| 禁止做法 | 原因 | 正确动作 |
|---|---|---|
| 为消除 debt 在 Hub 复制 `IdempotencyKey` 或 shared type | 制造第二 canonical owner | 监测 L0-core；变化时受控回开 |
| 为推进配置而自造 env key/default/endpoint/TLS/secret | 绕过 formal 04 truth source | 在 formal 04 catalog 中逐项定义 |
| 选择不满足 linearizable/UoW contract 的产品后用 sleep/retry 补偿 | 改写一致性语义 | 停止 product boundary 并回开设计 |
| 为观测新增业务 Port/state/repository/outbox | 把 observer 变成业务 truth | 保持 private non-cancelling instrumentation；需要改变时回开 |
| 把 Step 16 planned cuts 写成 passed tests | 伪造执行事实 | Formal 05 只定义未来 case/evidence contract |
| 在 formal 07 前创建 implementation ledger 或 commit skeleton | 顺序和边界尚无正式 owner | 与 formal 07 完成同步创建 |
| 将范围外能力列为 Hub 待办 | 暗中扩大 bounded context | 维持 typed seam/ref/view/handoff，转交 owner project |

## 9. Formal §17 canonical assembly source

Formal `03-详细设计.md` §17 必须按下列来源装配。正式正文不复制 Step 执行历史，只保留当前有效裁决。

| Formal block | Canonical source | 必须包含 |
|---|---|---|
| `17.1 Classification and current conclusion` | §§1、5 | 六类 closed classification；unresolved upstream blocker=`0` |
| `17.2 Risk table` | §4 | ID、分类、影响、owner、trigger、blocking scope、interim action、reopen/handoff target |
| `17.3 Open questions` | §6 | 确认方、时点、未确认前处理；明确无实现者自由裁量项 |
| `17.4 Historical resolved exclusions` | §7 | 旧 blocker 与旧正式文档不进入 active risk |
| `17.5 Reopen and stop rules` | §§4、8 | dependency/product/observability trigger 与禁止 shortcut |

Formal §17 不得：

- 把两项 L0-core debt 升级为当前 blocker 或伪报 resolved；
- 把目标仓缺失写成上游设计冲突；
- 选择 concrete config/product/observability backend；
- 把下游文档、implementation、test、evidence 或 acceptance 写成已完成；
- 把 runtime/tools execution、marketplace、governance approval、method body 或 delivery lifecycle 收回 Hub。

## 10. Step 19 entry gate

| Gate | Result |
|---|---|
| Step 1~17 未关闭事项已扫描 | pass |
| active 项均有 closed classification | `11/11` |
| active 项均有 owner、trigger、blocking scope、interim action、target | `11/11` |
| unresolved upstream blocker | `0` |
| non-blocking debt | `2`，均有 exact assumption 与 reopen trigger |
| implementation prerequisite | formal Step 19 assembly + target repo；阻塞范围已区分 |
| controlled reopen | product binding + observability backend；局部 stop rule 已定义 |
| downstream work | formal 04/05/06/07 owner 已定义 |
| out-of-scope leakage | `0` active design surface；禁入清单保留 |
| historical resolved blocker reactivated | `0` |
| implementation/test/run/evidence/signoff/commit claimed | none |
| new Rust declaration/struct/field/comment | `0/0/0/0`；未引入结构体注释缺口 |

Step 19 可以从 Step 1~18 装配正式 `03-详细设计.md`。若装配机械审计发现 source/count/name/Rustdoc/owner 不一致，必须回到对应 canonical Step 修正，不能在正式文档中静默选边。

```text
document = 03-详细设计.md
step = 18
status = 03_step_18_completed_continuous_execution
next_allowed_action = enter_03_step_19_formal_document_assembly
unresolved_upstream_blocker = none
non_blocking_cross_repo_debts = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
implementation_repo_prerequisite = pending_target_repo_confirmation
implementation_or_evidence_claimed = false
commit_required = no
```
