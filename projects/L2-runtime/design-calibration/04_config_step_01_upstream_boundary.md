# L2-runtime 04 配置设计 Step 1：配置输入边界

> 创建日期：2026-08-17
> 状态：`done`
> 执行模式：`full-restart / controlled_reopen / single-agent-serial`
> 当前模块：`upstream_boundary / canonical_03_contract_audit`
> 回填位置：正式 `04-配置设计.md` 第 1 章

## 1. Step 开工确认

| 门禁 | 结论 |
|---|---|
| 项目台账 | 当前文档为 `04-配置设计.md`，当前允许动作是 Step 1 配置契约审计 |
| 文档 flow | 旧正式 04 和旧 Step 1~15 均为 `historical_material`，不得继承完成状态 |
| 当前输入 | 当前正式 00~03、配置 SOP/规范、全局依赖规则与专项上游正式链可读 |
| 禁止动作 | 不进入实现仓，不实现代码，不写测试/证据/readiness，不提交 commit |
| 当前写入 | 只重建 Step 1，并完成配置 SOP 允许的 03 最小反向校准 |

## 2. 本步目标与输入

本步确认 `04` 能从唯一、可落码的 `03` 配置读取面继续展开，并把外部 blocker 与本仓内部设计缺口分开。配置设计只能细化 JSON key、来源、优先级、profile、敏感性、加载、生效、变更和失败语义；凡改变 typed snapshot、builder、Port、error 或函数流的缺口，必须先回写 `03`。

| 输入类别 | 已读取材料 | 本步用途 | 效力 |
|---|---|---|---|
| normative | 配置 SOP/书写规范、编写通则、中间产物规范、真相源闭环标准、全局依赖规则 | 决定 15 Step 顺序、JSON 规则、回写与停审门禁 | normative authority |
| direct chain | Runtime 当前正式 `00/01/02/03` | owner、能力、对象、Port、状态、事务、typed config 与 builder | current formal |
| direct upstream | `L2-tools` 正式 `00~07` | 唯一工具行动合同；开放 execution seam 原样传递 | current formal with blockers |
| upstream definitions | Capability Hub、Method Library 正式 `00~07` | capability/definition identity、descriptor、formal exposure ref | current formal; Method workspace caveat |
| execution/observation | Sandbox、Observability 正式 `00~07` | isolation/observation seam 与未闭合正向接口 | current formal with blockers |
| foundations | L0-core、L0-bus、L0-sdk 当前正式链和台账 | compile candidate、event seam、downstream SDK 边界 | current formal |
| truth/granularity | Governance、Artifact 当前正式链 | approval/policy truth、artifact ref 和字段级配置粒度 | current formal |
| downstream direction | Runtime 旧 `05/06/07` 及其台账 | 仅检查未来测试/验收/实施承接面 | historical downstream material |
| old local material | Runtime README、旧正式 04、旧 Step 1~15 | 污染和差异审计 | historical material |

## 3. SOP 五问回答

### 3.1 承接哪些需求、非功能、安全和环境差异

- 承接 bounded runtime loop、scope/budget/freshness、working memory、provider-neutral model decision、action guard、delegation、checkpoint/recovery、handoff/projection、幂等与 7 个有界 job。
- 承接 strict owner boundary、local truth first、record-before-call、Unknown fence、append-only、body-free、no-Ready 和 fake-only-in-test。
- 环境差异只能决定来源与验证上下文；`local/CI/integration/production candidate` 均不能表示 readiness。
- 不继承旧文档中的固定容量、性能、部署或生产资格数字。

### 3.2 哪些详细设计配置引用必须进入 04

| `03` contract | `04` 必须继续定义 |
|---|---|
| `RuntimeConfigSnapshot` | 外部严格 JSON 到 immutable typed snapshot 的唯一映射、identity、validation 与 publication 语义 |
| `RuntimeProfile` + 9 policy profiles | 12 顶层域中的 9 个策略域、字段、枚举、必填性、来源、校验和失败 |
| `AdapterSlotConfigSet` | 精确 13 slot 的 closed object、activation/blocker/ref 约束 |
| `JobControlSet` | 精确 7 job 的 closed object、activation/lease/page/attempt/retry 约束 |
| `RuntimeDependencySlots` / `RuntimeBuilder` | slot 配置到依赖绑定的 1:1 映射、禁止 fake/alias/方向违规 |
| `RuntimeConfigSnapshotPort` | startup publication 后的 current/ref lookup、operation 捕获；进程内 snapshot 不可变 |
| `ConfigError` / `BuildError` | parse/type/cross-field/publication/binding 的确定性失败映射 |

### 3.3 哪些测试和验收场景依赖配置矩阵

- strict JSON：duplicate/unknown/missing/type/enum/range/cross-field/forbidden secret。
- 4 个 environment class x 4 个 entry profile 的允许与禁止组合。
- 9 policy profile 的边界值、收窄关系、unknown/freshness/fence 负向路径。
- 13 slot 的 `Disabled/Blocked/Candidate`、contract/schema/blocker 一致性和不存在 `Ready`。
- 7 job 的 operation/key 一致性、lease/page/attempt/retry 固定关系与依赖阻断。
- startup-only publication、invalid candidate 阻断新进程启动、snapshot immutability、整文档冷进程替换/回退、redacted audit identity。

### 3.4 哪些内容不得在 04 重新定义

- Runtime 的 owner、能力、17 Command、12 Query、6+6 Event、7 Job、SM-01~31、UoW/CAS/inbox/outbox/lease/cursor 语义。
- tools execution、capability registry、method body、governance approval、sandbox isolation/cleanup、durable memory body、observability backend 和 provider route/secret/quota/cost。
- database/broker/scheduler/transport/async runtime/secret provider 产品、挂载路径、部署命令或容器生命周期。
- 测试结果、artifact/report/evidence alias、验收 verdict、签署、commit、run_id 或真实 readiness。

### 3.5 上游缺口是否阻塞配置设计

开放 seam 不阻塞 strict schema、negative posture 和 fail-closed 配置设计；它们阻塞相应 slot/job 的 `Candidate` 正向 qualification、integration、evidence 和 readiness。不存在仍需用户裁决的 Runtime 内部 typed-config 缺口。

## 4. 上游输入映射

| 来源 | 配置输入 | `04` 展开 | 不得继承/重定义 | 回填 |
|---|---|---|---|---|
| Runtime 00 | bounded policy、fail-closed、body-free、NFR | 允许配置化类别和失败姿态 | 需求目标/验收事实 | §1/2/4/11 |
| Runtime 01 | owner、依赖分类、adapter boundary、local truth | control plane、禁止项、source class | owner/ADR/部署拓扑 | §1/3/4 |
| Runtime 02 | profile、policy、slot、job configuration impact | 12 domain 总览 | 当时未选择的 key/default | §3~7 |
| Runtime 03 §6/11/13 | exact typed carriers、Port、builder、error | JSON shape、validation、activation | 新 struct/enum/trait/flow | §1/7/9 |
| Runtime 03 §9~12 | state/UoW/Unknown/retention/lease/cursor | cross-field 和失败规则 | 状态/事务/retry 资格 | §4/7/11 |
| Runtime 03 §14~16 | observation/redaction/test cuts | safe audit 与下游切口 | backend/test result/evidence | §8/10/12 |
| L2-tools | action/receipt/feedback contract + open seam | `invocation_caller` slot posture | ToolAction alias、tools execution | §7/11/14 |
| Sandbox | isolation truth remains behind Tools | blocker only；无 Runtime slot | direct Sandbox slot/Port | §4/11/14 |
| Capability Hub | identity/exposure/descriptor ref | `capability_exposure` slot | registry/adapter truth | §7/9 |
| Method Library | definition ref/version/safe view | `definition_resolver` slot | body/source/immutable commit claim | §7/14 |
| Governance | effective decision/policy view | `governance` slot/freshness | approval/policy truth | §7/11 |
| Model/memory owner seam | provider-neutral result/ref | model/materializer/memory slot posture | route/secret/cost/body/lifecycle | §7/8/11 |
| L0 core/bus/sdk | compile candidate/event/downstream | schema/contract ref posture | package dependency fabrication | §1/7/14 |
| Observability/Artifact | safe material/ref handoff | publisher/handoff/redaction posture | observed/evidence/verdict truth | §7/8/11 |

## 5. 不再回答的问题

| 已闭合问题 | 唯一答案位置 |
|---|---|
| Runtime 拥有什么、不拥有什么 | 正式 00~03 owner/boundary 章节 |
| Rust workspace、crate/file、对象、Port、协议、Flow、状态、事务 | 正式 03 |
| compile/runtime/event/ref/adapter/fake 依赖分类 | 正式 01/03 |
| Unknown、append-only、record-before-call、ack/delivery/observed 分层 | 正式 03 |
| direct Sandbox 是否是 Runtime seam | 否；`InvocationCallerPort` 是唯一 action seam |
| positive external readiness 是否可由配置产生 | 否；配置最高只有 `Candidate` |

## 6. `04` 必须回答的问题

| ID | 问题 | 目标产物 |
|---|---|---|
| Q04-01 | 12 顶层域如何形成 closed strict JSON | root/schema/unknown/duplicate 规则 |
| Q04-02 | 每个 JSON leaf 如何映射 typed field | 完整字段表和逐模块 strict JSON |
| Q04-03 | 单份 selected strict JSON 如何被选择，selector/assertion/fixture 与其边界是什么 | source/selection/conflict matrix |
| Q04-04 | environment 与 entry profile 如何正交验证 | 4 x 4 matrix |
| Q04-05 | 153 个 exposed leaf 如何全部 required，nullable/disabled/bound 字段如何显式编码 | required/null/zero/exact-shape/failure 列 |
| Q04-06 | 13 slot 如何表达 negative/candidate posture | exact slot object + blocker/ref gates |
| Q04-07 | 7 job 如何独立配置且不拥有 scheduler | exact job object + dependency gates |
| Q04-08 | raw secret、route、endpoint 如何被拒绝 | sensitive/forbidden-key rules |
| Q04-09 | parse/type/cross-field/assemble/publish 如何原子闭合 | V0~Vn + builder stages |
| Q04-10 | startup publication、整文档冷进程替换/回退和失败如何处理 | startup-only/cold-replacement/fail-closed matrix |
| Q04-11 | 05/06/07/09 如何承接而不伪造事实 | downstream contract matrix |

## 7. Historical pollution audit

| 旧材料污染 | 当前 canonical 裁决 | 处理 |
|---|---|---|
| `RuntimePolicyProfileSet` + `policies` | `RuntimeProfile` 唯一拥有 9 组 policy value | 删除旧 carrier；不得作为 alias |
| `RuntimeLimitSet` / `limits.max_page_limit` | 各 typed profile/job 字段在自身消费边界校验 | 不建立 `limits` root |
| `ToolAction` slot / `ToolActionPort` | `InvocationCaller` / `InvocationCallerPort` | historical only |
| `SandboxHandoff` slot/Port | Runtime 无 Sandbox slot；Tools seam 内部处理 isolation | historical only |
| `Handoff` slot / `HandoffPort` | `HandoffSubmission` / `HandoffSubmissionPort` | historical only |
| 缺 `ModelContextMaterializer` | canonical 13 slots 必须包含 | 已回写 03 |
| `blocked_until_contract` requirement | requirement 仅 `Required/Optional`；阻断由 activation+blocker 表达 | 禁止第三枚举 |
| `continuation_lease_required` | lease 是静态不变量 | 禁止配置化 |
| `max_resume_scan_items` | J04 `page_limit` 已是唯一 owner | 删除重复项 |
| `external_emission` | handoff/publisher slot activation 已是唯一 owner | 删除重复项 |
| `expiry_requires_domain_uniqueness` | uniqueness survives expiry 是静态不变量 | 禁止配置化 |
| 无来源容量数字 | 数值策略默认 `none (required)`；demo 值仅为示例 | 不声明安全/生产默认 |
| 四类粗 entry kind | `EntryAuthority` 精确六 variant | 已回写 03，04 使用六类 |
| logical selection 缺 capability class | 完整四维 `ModelSelectionBounds` | 已回写 03；class 使用 opaque typed ref |

## 8. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| snapshot、profile、slot、job 出现重复 carrier/alias | 是 | typed carrier 唯一性 | 正式 03 §13.1；Step 6/14 | 已回写 |
| 正文引用 config/definition/publisher/outbox Port 但签名不全 | 是 | Port/error/carrier | 正式 03 §6.8/§11；Step 6 | 已回写 |
| 9 policy 与 13 dependency 字段存在缩写映射 | 是 | builder 字段命名 | 正式 03 §13.1；Step 6 | 已回写 |
| availability 类型只有引用且 alias 漂移 | 是 | canonical enum | 正式 03 §6.8.5；Step 6 model/infra | 已回写 |
| 配置专用 value types / 7 `JobOperation` 未给 exact shape | 是 | enum/struct 装配面 | 正式 03 §13.2/§13.4；Step 14 | 已回写 |
| scope 需映射 exact `EntryAuthority` | 是 | profile field | 正式 03 §13.2 | 已回写 |
| model bounds 需四维且 schema ref 可在 blocked posture 缺省 | 是 | profile field | 正式 03 §13.2 | 已回写 |
| JSON key/source/default/environment matrix | 否 | 04 专属配置语义 | 不适用 | 无回写 |
| external positive contract remains blocked | 否 | blocker 传递 | 正式 03 §17 | 无回写 |

内部回写项均已关闭；上游 blocker 不是 `03` 内部待回写，不阻塞 Step 2。

## 9. Blocker 传递

| Blocker | `04` 可设计 | 不可宣称 |
|---|---|---|
| `L2R-UP-001~003` | invocation slot、contract/schema/blocker ref、negative job posture | Tools/Sandbox execution/cleanup/schema readiness |
| `L2R-UP-004` | logical model policy、materializer/model slot | provider route/secret/quota/cost/Ready |
| `L2R-UP-005` | durable-memory retrieval slot disabled/blocked | durable write/index/lifecycle readiness |
| `L2R-UP-006/007` | event publisher/projection/handoff candidate schema | route/backend/observed readiness |
| `L2R-UP-008` | current definition ref/version placeholder | immutable upstream commit |
| `L2R-CP-001` | checkpoint slot、reconcile-only/blocked posture | physical commit/atomicity qualification |
| `L2R-ENTRY-001` | typed entry profile/scope input | member/product lifecycle |
| `L2R-IMPL-001` | planned schema/file/test boundary | config artifact/implementation existence |

## 10. 改动前后与回填草稿

| 维度 | 旧 Step 1 | 重建后 |
|---|---|---|
| typed baseline | 默认认为 03 已完整 | 对 snapshot/profile/slot/job/value type 做逐字段反向审计 |
| slots | 历史 13-slot 组合 | canonical 13-slot exact set |
| policy owner | 第二套 policy carrier | `RuntimeProfile` 唯一 owner |
| limits/default | 全局 limits + 无来源数字 | typed owner；无来源数值 required |
| blocker | 与 activation 混写 | blocker_ref + negative posture；不制造 readiness |

正式 §1 回填要点：列出 current formal 输入及效力、说明 `04` 只展开配置控制面、列出 03 已完成回写和持续 blocker、显式声明 historical material 不提供当前配置事实。

## 11. 自检与下一门禁

| 检查 | 结果 |
|---|---|
| SOP 五问全部回答 | pass |
| 当前正式 00~03 与专项上游均有映射 | pass |
| 不再回答/必须回答问题分离 | pass |
| historical pollution 有 canonical 替代 | pass |
| 所有内部 03 影响均为 `已回写` 或 `无回写` | pass |
| 上游 blocker 保持 pending/blocked/fail-closed | pass |
| 无实现、测试结果、证据、readiness 或 commit 事实 | pass |

```text
step_01 = done
gate_status = pass
gate_reason = canonical_03_config_contract_closed; upstream_positive_seams_explicitly_blocked
next_allowed_action = delete_and_rebuild_step_02_scope
formal_04_write_allowed = false
commit_required = false
```
