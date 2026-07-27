# L3-capability-hub 04 配置设计 Step 1：确认配置输入边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §1
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_01_completed_continuous_execution`

---

## 1. Step 状态与目标

| 项目 | 内容 |
|---|---|
| 当前 Step | Step 1 `确认配置输入边界` |
| 输入基线 | active formal `00/01/02/03`; DDD Step 14/15 exact source; old `05/06` historical only |
| 本步目标 | 确定 04 必须承接的需求、架构、概要、详细设计与下游方向，并判定是否有上游缺口阻塞 Step 2 |
| 本步不做 | 不定义 raw key、数值、默认、source precedence、secret product、endpoint 或 formal 04 正文 |
| 输出 | 上游输入映射、不再回答清单、必须回答清单、historical disposition、对 03 影响判定 |

## 2. 必读输入与权威判定

| 输入 | 读取结论 | 本 Step 用法 | 禁止用法 |
|---|---|---|---|
| 配置设计 SOP / 书写规范 | 15 Step / 15 chapter 主链已确认，formal 04 只能 Step 15 装配 | 固定本 Step 问题和输出形状 | 不合并 Step，不提前写正文 |
| `00-需求文档.md` §§2、6、10~14 | capability identity/registry/descriptor/seam/relation/exposure 是主线；依赖、数据、NFR、红线已闭合 | 抽取不可配置业务规则、external seam、安全/可用性意图 | 不用配置改变仓责任或 acceptance intent |
| `01-架构设计.md` §§2~17 | single truth owner、dependency type、container、UoW/consistency、security/observation 边界已闭合 | 抽取 deployment/runtime binding 和禁止配置化架构不变量 | 不选择新架构或新 truth store |
| `02-概要设计.md` §11 | 配置影响轮廓、禁止配置化表与 DDD handoff 已闭合 | 作为控制面和分类的概要来源 | 不以轮廓替代 formal 03 exact typed surface |
| `03-详细设计.md` §13 | immutable root、27 rows、27+9/14+6+10+8 binding、Stage 0~7、profile/failure 已闭合 | 作为 04 的直接配置契约 | 不拆并 typed row，不加 Port/field/state/error |
| `03-详细设计.md` §§10~12、14~17 | persistence/idempotency/error/observer/test/handoff/risk 限定配置效果 | 定义后续 validation/failure/change/test handoff 的硬边界 | 不用 timeout/retry/diagnostics 改变 business result |
| DDD Step 14 §§138~148 | exact 04 Step 1~15 handoff、27-row table、33-row dependency table、Cargo table | 后续逐 Step 解析 operator-facing schema | 不把早期候选或 batch status 当 canonical config |
| DDD Step 15 §§123~150 | Off/Redacted、redaction、observer failure、backend reopen 已闭合 | diagnostics/backend config 的安全与 failure 输入 | 不把 observability profile 当 evidence 或 business truth |
| old `05-测试方案.md` | 仍有 provider contract/decision/cost/runtime 主线 | 识别需在新 05 中删除的历史配置方向 | 不作为 environment/default/fixture 真相源 |
| old `06-验收标准.md` | 仍有旧安全/配置/实施前置 | 识别后续验收门禁需重建的方向 | 不作为通过值、signoff 或 product readiness 事实 |

## 3. SOP 问题回答

| SOP 问题 | 收口答案 | 证据入口 | 对后续 Step 的约束 |
|---|---|---|---|
| 1. 承接哪些需求、NFR、安全和环境差异？ | 承接主体稳定性、body-free、single authority、dependency discoverability、startup fail-fast、non-cancelling timeout、bounded retry、redaction、deterministic fake parity、Local/Integration/Deployment 差异；不把责任红线改成 toggle | formal 00 §§6、10~14; formal 01 cross-cutting; formal 03 §§13~15 | Step 3~7 每个 config domain 必须回指这些 owner/invariant |
| 2. 哪些 config/runtime builder/adapter/dependency 进入 04？ | 完整承接27-row typed surface、single local authority、9 external slots、6 source slots、10 route refs、8 Jobs entry、Stage 0~7、fixed codec/dependency、Local/Integration/Deployment、Off/Redacted | formal 03 §13.1~13.12; DDD Step 14 §§145~148 | Step 7 必须对每个 typed row 提供 exact raw catalog 覆盖，不丢 row |
| 3. 哪些测试/验收场景依赖配置矩阵？ | root/version/unknown/duplicate、profile/entry mismatch、local authority/fake parity、9-slot availability、6 source actor/schema gates、10 route completeness、8 Jobs limits、timeout/retry、commit observation、diagnostics/redaction、product unavailable 都必须交给新 05/06 | formal 03 §§15.6~15.8; DDD Step 16 | Step 12 交接 exact scenario IDs，不声称已执行 |
| 4. 哪些内容不应在 04 重新定义？ | 需求目标、architecture owner、Rust schema/Port/flow/state/error、transaction/idempotency、protocol identity、observer profiles、test oracle、acceptance threshold、implementation phase、deployment command | formal 00~03; configuration writing standard §2 | 发现缺口时记 impact/reopen，不在 04 内补 code contract |
| 5. 是否有阻塞配置设计的上游缺口？ | 无。typed surface、owner、phase、failure 和 reopen gate 已足够进入 Step 2。product/backend 未选定属后续 controlled reopen/实施前置，不是 Step 1 upstream blocker | formal 03 §17; DDD Step 18/19 | 不得把未选 product 伪造为现实或用它阻塞 product-neutral 04 |

## 4. 上游配置输入映射

| 来源 | 配置输入 | 进入 formal 04 | 不可改变的上游结论 |
|---|---|---|---|
| formal 00 §§2/4/6 | Hub 定位、运行期/事件/下游依赖分类 | §§1~4、6、11、14 | identity/registry/integration truth 不与 execution/listing/approval 合并 |
| formal 00 §10 | 43 项业务/边界规则，尤其 BR-CH-001~019/027~034 | §§4 forbidden configuration | 不可配置化 truth owner、formal exposure source、body-free 或禁止数据 |
| formal 00 §11/13 | 本仓数据、forbidden body、availability/security/audit intent | §§8、11~12 | secret/method/governance/runtime/audit body 不进 config/log/store |
| formal 01 | compile/runtime/event/downstream dependency、single authority、startup/exposure 边界 | §§3~6、9、11 | 配置不得引入 second authority/source-code sibling 或 best-effort consistency |
| formal 02 §11 | config categories 候选、profile、adapter/entry influence、forbidden surface | §§3~6 | 概要轮廓不得越过 formal 03 exact row set |
| formal 03 §13.1~13.2 | one immutable root and 27 canonical typed rows | §§3、5~7、9 | 27 row identity/shape/reader/presence/failure 不可拆并 |
| formal 03 §13.3~13.8 | 27 local/base、9/14 external、6 source、10 route、8 Jobs | §§3、6~9、11 | complete named cardinality、no generic adapter/route/job |
| formal 03 §13.9~13.12 | Stage 0~7、codec、timeout/retry、dependency、profiles | §§5~11、13~14 | no partial graph、Missing fallback、Deployment fake、runtime algorithm selector |
| formal 03 §14 | 155+3 observer profile contract and Off/Redacted | §§8~11 | observer failure cannot alter business outcome; no raw mode |
| formal 03 §15~17 | future cuts、implementation handoff、debt/reopen/prerequisite | §§12~14 | planned obligation is not test/evidence/readiness fact |

## 5. 配置设计不再回答的问题

- Capability identity、registry、descriptor、governance seam、method relation 和 formal exposure 的业务责任与状态如何定义。
- Hub 是否执行 MCP/A2A/API、tools/runtime invocation、governance approval、method body、SDK client 或 marketplace listing。
- 43+7 objects、36 Ports、22/110 repository surface、250 types、83 flows、24/111/638 states、17/51 errors/issues 如何实现。
- UoW、commit resolution、idempotency、race winner、Outbound A/B/C、Job plan/target/final 的算法。
- observability 的 60/48/27/20+3 profile field semantics，以及测试是否通过、验收是否签署。
- 具体部署命令、密钥挂载操作、值班流程、人员分工、implementation phase 和 commit boundary。

## 6. 配置设计必须回答的问题

1. 27 个 canonical typed rows 对应什么 JSON path、类型、单位、边界、默认、必填性和失效策略。
2. file/env/CLI 如何表达，如何解析为一个 candidate，优先级、duplicate 和 conflict 如何 fail-fast。
3. Local/Integration/Deployment 下 local authority、9 external slots、6 sources、10 routes 与三个 entry 如何组合。
4. Configured/DeterministicFake/Disabled/Missing 在各 phase 的允许性、构造材料与不可用出口是什么。
5. endpoint、credential ref、TLS、feed、trusted actor、route destination 和 secret reference 如何安全表达，如何避免 raw value 泄漏。
6. 配置如何 parse、type/cross-field validate、assemble、activate，为何当前无 hot reload。
7. timeout/retry/page/body/diagnostic 失效时是 startup reject、invocation failure、typed unavailable 还是 observer-only failure。
8. 变更如何 review/audit/rollback，schema/profile/product 如何迁移和废弃。
9. 新 05/06/07/09 各自承接哪些 matrix、negative case、prerequisite 和 operator detail。

## 7. 当前文档问题诊断与 historical disposition

| Material/problem | Diagnosis | Step 1 disposition |
|---|---|---|
| formal 04 absent | no operator-facing schema, source order, default/profile matrix or examples exist | expected target; rebuild through Steps 1~15 |
| old 05 provider/decision/cost/runtime assumptions | conflict with active formal 00~03 responsibility model | `historical_material`; no key/default/product can be inherited |
| old 06 security/product/acceptance claims | may encode old owner and unverified environment readiness | `historical_material`; no gate/signoff fact can be inherited |
| target implementation repo absent | no parser/config/product facts can be inspected | `implementation_prerequisite`; not a Step 1 blocker |
| concrete persistence/HTTP/broker/secret/observer product absent | no verified constructor material or readiness | later `controlled_reopen` / product-selection item; keep product-neutral refs |
| two L0-core wire/key design debts | current audited semantics exist but upstream formal promise incomplete | retain `non_blocking_debt`; fixture/version change triggers reopen |

## 8. 设计取舍

| 议题 | 裁决 | 原因 |
|---|---|---|
| 是否因 formal 04 缺失而停止 | 否 | 这是本轮目标，formal 03 输入已足够 |
| 是否从旧 05/06 提取 environment/default | 否 | 两者与 active owner 冲突且未重建 |
| 是否在 Step 1 选 database/broker/KMS/backend | 否 | 产品选择要通过后续 semantic compatibility/reopen gate |
| 是否把 27 typed rows 压缩为少数 config groups | 否 | group 可用于组织，但 canonical row identity 必须 27/27 可追溯 |
| 是否允许 04 新增 raw extension map | 否 | 会绕过 typed root、Rustdoc 和 unknown-field rejection |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 承接 exact 27-row surface 与 27+9/14+6+10+8 binding | 否 | existing contract trace | formal §13; DDD Step 14 §§145~148 | 无回写 |
| 将 old 05/06 记为 historical material | 否 | authority disposition | formal §1/§17 | 无回写 |
| 将 product/backend 未选定保留为后续 item | 否 | risk/handoff only | formal §13.11~13.12/§17 | 无回写 |
| 新增/modify typed field/Port/flow/error/state | 本 Step 未发生 | code-contract trigger | originating DDD Step | 无回写 |

Detailed-design impact audit: `待回写=0`, `阻塞待确认=0`.

## 10. Formal §1 回填草稿

Formal §1 must state that active formal `00/01/02/03` are the only upstream authority; formal 03 §13 and its canonical Step 14 sections provide the exact typed/binding surface; old 05/06 and README are historical diagnostics only. It must list what 04 continues to define and explicitly deny redefining types, Ports, protocol flows, state, error, transaction, responsibility or acceptance facts.

The chapter must include the upstream mapping from §4 and the detailed-design impact result `无回写`. It must not contain raw keys, defaults or product selections because those are not Step 1 outputs.

## 11. 待确认事项与风险

| 事项 | 当前分类 | 本 Step 处理 | 后续 owner |
|---|---|---|---|
| persistence/API/transport/secret/observer product | controlled reopen candidate | 不选定、不伪造 | Steps 7~9/14 + formal 07 boundary |
| target implementation repository | implementation prerequisite | 不影响 04 设计 | formal 07 / repository owner |
| two L0-core design-sync debts | non-blocking debt | 保留 exact current assumption | core/contracts owner + formal 05 fixture |
| new formal 05/06 | downstream work | 不在 04 中代写 | Steps 12 then formal 05/06 SOP |

Unresolved upstream blocker: `0`.

## 12. Step 完成门禁

| 检查 | 结果 |
|---|---|
| SOP 5 问是否逐项回答 | pass |
| active 00/01/02/03 是否完整映射 | pass |
| 27-row / binding / profile / observer 输入是否可追溯 | pass |
| old 05/06 是否隔离 | pass |
| 不再回答/必须回答清单是否闭合 | pass |
| 对 03 影响是否判定 | pass; no writeback |
| raw key/default/product/formal 04 是否未提前生成 | pass |
| 伪造实现/测试/evidence/signoff/commit | 0 |

```text
document = 04-配置设计.md
step = 1
status = 04_step_01_completed_continuous_execution
unresolved_upstream_blocker = none
detailed_design_writeback = none
next_allowed_action = complete_04_step_02_scope
commit_required = no
```
