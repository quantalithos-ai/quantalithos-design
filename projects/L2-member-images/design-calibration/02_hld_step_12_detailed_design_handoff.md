# L2-member-images 02 概要 Step 12: 详细设计承接清单

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 12 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 13 文件；本文件只列 03 承接，不新增对象、接口、流程或状态

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4~11 已通过的代码主体、组成部分、对象、接口、处理流、状态、异常与配置影响结论 |
| 规范 | 已读取概要设计 SOP Step 12 与书写规范 §4.12 |
| 本步目标 | 为 03 提供唯一、可追溯、带 pending 边界的展开入口，防止详细设计重新发明或暗改概要主语 |
| 本步禁止 | 新增主语、开发任务、排期、测试全集、实施指令、把 pending seam 写成 positive contract |

## 1. 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 五个主要组成部分：`DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived` | 将每部分落为实现责任边界、模块关系和内部依赖；仍不得机械映射为服务 / 数据库，需保持业务部分与实现层正交。 |
| `DefinitionAssemblyCoordinator` 与 definition / baseline / revision 主线 | 展开 command application contract、repository / unit-of-work 边界、完整 invariant、revision / supersede 持久化语义；mapping / seed / component exact seams 依旧受 MI-UP-002/003/006 约束。 |
| `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | 展开完整字段、类型约束、serialization、唯一性、revision / derivation 关系和事务边界；不得加入 Role / live body。 |
| `MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding` | 展开 ref / snapshot validator、freshness、pin completeness、placement contract 和 owner adapter；不定义外部正文或 release schema。 |
| `AssemblyCompletenessGuard`、`PinIntegrityGuard` | 展开 guard 输入 / 结果映射、blocked / conflict 错误模型和配置注入边界；不得通过 config 放宽必要 pin。 |
| `BuildIntentCoordinator`、`BuilderPort`、`RegistryPort` | 展开 intent / attempt / outcome 的 application flow、adapter contract、unknown side-effect 处理和端口 parity；不锁 builder / registry 产品。 |
| `BuildIntent`、`BuildAttempt`、`BuildInputSnapshot`、`BuildOutcomeConclusion`、`CandidateImage` | 展开完整字段、identity / correlation / causation、幂等、事务、attempt recovery 和 candidate formation；不把外部 job body 写入。 |
| `CandidateFormationGuard` | 展开 output ref、input digest、attempt correlation 的验证和错误分类；失败不得生成 candidate。 |
| `QualificationCoordinator`、`EvidenceConclusionPort`、`ArtifactHandoffPort` | 展开 provenance / gate / Artifact 的 ports、safe conclusion mapping、适用性 authority 和 handoff contract；Q-MI-004 / MI-UP-007 未关闭前只实现 neutral / blocked seam。 |
| `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision` | 展开完整 provenance graph、evaluation history、eligibility decision 事务和 supersede 语义；不定义 governance / evidence / Artifact truth。 |
| `ArtifactHandoffRecord`、`ProvenanceCompletenessGuard`、`ApplicableGateGuard` | 展开 handoff / gap persistence、gate unknown fail-closed、owner resolution 和后续 reopen 条件；不自造 ArtifactVersion / lineage / evidence inventory。 |
| `AvailabilityCoordinator`、`EntryPinGuard`、`AvailabilityTransitionGuard` | 展开 publish / replace / rollback / retire 的命令、history append、冲突检测和 pinned entry 验证；不把 container / consumer 状态接入本地写路径。 |
| `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | 展开 entry / transition / gap 字段、唯一性、可查询投影和 recovery；MI-UP-001 未闭口时 positive confirmation 仍 blocked。 |
| `MemberServiceSupplyPort` 与 `ResolveInstantiableEntry` | 展开双方 neutral contract、ref verification、unavailable / contract-gap carrier、compatibility 与确认条件；必须双侧校准，不能单方补齐。 |
| `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness` | 展开 source owner、freshness、gap lifecycle、affected lane、resolution ref 和重建语义；不把 shadow 当 external truth。 |
| `ImageTraceRecord`、`ImageDerivedReadModel` | 展开 trace / watermark / read model 字段、projection builder、rebuild / stale / unavailable contract；projection 不得反写核心。 |
| `ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | 展开 source validity、read-only enforcement、fake seam、rebuild failure mapping；fake 只用于测试切口。 |
| Step 7 的 Command / Query / conditional Event / Job 分类 | 展开完整输入输出 schema、错误映射、idempotency / correlation、协议 carrier 与 handler contract；当前 outbound event absence 不得被补成实现事实。 |
| Step 8 的定义、revision、intent、event、outcome、qualification、handoff、supply、resolve、projection、reconcile flows | 展开函数签名、调用边界、事务 / UoW、并发、retry / timeout、repository / adapter 实现与测试切口；保留 accepted != completed、local truth first。 |
| Step 9 的局部状态轴与迁移 | 展开状态编码、迁移 guard、持久化一致性、late / duplicate / unknown 行为和 projection propagation；不得合并成总 ready 状态。 |
| Step 10 异常与边界口径 | 展开 error type / code、映射、恢复策略、补偿和 observability safe category；不把外部 owner runbook 归入本仓。 |
| Step 11 配置影响与禁止配置化边界 | 展开 `RuntimeConfig` / `ConfigLoader` / `ConfigValidator` / `AdapterConfig` / `JobConfig` / `ConfigError` 的实现契约；04 再定义 key、source、default、填写和 profile。 |

## 2. Pending / future 不进入正向承接清单的项目

| 项目 | 当前 03 承接上限 |
|---|---|
| `MI-UP-001~007` | 只承接 neutral port、contract status、blocked / unavailable / gap、safe conclusion 与重开点；不承接 exact DTO / schema / route / ref mint / success。 |
| `MI-UP-008~009` | 只承接 future trigger / current absence；不创建 hardened-base 或 outbound event active structure。 |
| `Q-MI-001~004` | 只承接 conditional / product-neutral / authority-driven boundary；不锁 restricted、multi-arch、产品或 gate inventory。 |
| 任何 implementation / test / evidence / digest / report / readiness | 不作为 03 输入；只能在真实实施 / 测试 / 验收流程中产生。 |

## 3. 详细设计回退规则

如果详细设计发现上述主语需要变更，说明概要设计还没有真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。回退时至少重开受影响的 Step 5（组成部分）、Step 6（对象）、Step 7（接口）、Step 8（流）或 Step 9（状态），并重新执行项目 ledger、文档 flow 和来源审计；不能用 03 的新字段、目录或实现选择静默改变 02 语义。

## 4. 03 进入条件与不变项

| 条件 | 03 进入时必须保持 |
|---|---|
| owner / truth | 本仓只拥有 definition、revision、intent / attempt / candidate、provenance / eligibility、availability / entry / history；相邻正文和 live state 继续外置。 |
| dependency | Compile 仅正式 Core；runtime / event / ref / adapter / fake 不自动升格源码依赖。 |
| staged decisions | Candidate、eligibility、availability、Artifact handoff、consumer / container state 分开。 |
| failure | missing / stale / conflict / failed / unknown / gap fail closed；恢复走新语境。 |
| projection | 只读、可重建、freshness 显式，不反写 truth。 |
| pending | MI-UP / Q 未关闭前，exact positive contract、产品、schema、readiness 不得进入。 |

## 5. 承接一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 每个 Step 4~11 主语均有 03 展开位置 | `pass` | 主体、对象、接口、流、状态、异常、配置均列出。 |
| 未新增未讨论对象 / 接口 / 流 / 状态 | `pass` | 本表只引用已收稳名称。 |
| pending seam 仍有明确上限 | `pass` | neutral / negative / gap 可展开，positive exact 仍 blocked。 |
| 03 回退规则明确 | `pass` | 发现主语变化必须退回 02。 |
| 未写任务 / 排期 / 测试全集 | `pass` | 仅说明详细设计展开方向。 |

## 6. 回填草稿与下一步门禁

正式第 12 章回填 §1 的两列表和 §3 回退规则；§2、§4~§5 留在 calibration 作为 pending / 审计辅助，不把未来项润色为稳定输入。

`gate_status = pass_stop_review`。Step 12 足以支撑 Step 13；下一动作是读取 Step 12 与 Step 13 规范并创建 `02_hld_step_13_risks_open_questions.md`。
