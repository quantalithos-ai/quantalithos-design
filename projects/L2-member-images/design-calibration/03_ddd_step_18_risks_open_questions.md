# L2-member-images 03 详细设计 Step 18：风险与待确认事项

> 创建日期：2026-09-01  
> 状态：`completed_stop_review`（本 Step 风险登记已完成；等待用户明确确认后才可进入 Step 19）  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18  
> 书写约束：`standards/document/详细设计书写规范.md` §5.17  
> 中间产物约束：`standards/document/设计文档讨论中间产物规范.md` §3、§5.10  
> 回填位置：新版正式 `03-详细设计.md` §17“风险与待确认事项”（当前仅为回填草稿，禁止装配）  
> 历史材料边界：旧正式 `03-详细设计.md` 仍未读取；仅可在 Step 19 的后置污染审计中作为 `historical_material` 使用。

## 0. Step 状态、授权范围与执行计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 18：风险与待确认事项。 |
| 用户授权 | 用户于 2026-09-01 明确“同意”；本次授权仅允许完成 Step 18。 |
| 本 Step 输入 | 已停审的 Step 1 至 Step 17、重建版正式 00/01/02、项目级与文档级台账，以及本 Step SOP / 书写规范。 |
| 本 Step 输出 | 本风险与待确认事项登记；03 flow 与项目执行台账的恢复点更新。 |
| 本 Step 做什么 | 汇总未关闭问题、影响面、责任 owner、重开条件及未确认前的 fail-closed 处置。 |
| 本 Step 不做什么 | 不新增对象、字段、port、DTO、route、topic、状态边、配置默认值、产品、测试用例、验收 evidence、phase、commit 或实施任务。 |
| 当前实现状态 | 未授权实现；此前 Step 3 / Step 17 记录的目标实现仓 `quantalithos-member-images` 未发现，本 Step 不创建或重新接管它。 |
| 当前正式文档状态 | 新版正式 03 尚未装配；04、07 尚未创建；05、06 现有文件仍仅是 historical material，不能作为新版下游基线。 |
| 强制停点 | 完成本 Step 后立即停审；未经用户再次明确确认，不得创建 Step 19、读取旧正式 03、装配正式 03 或进入实现。 |

### 0.1 Step 内完成门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化登记 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| `risk_open_questions` | done | done | done | done | done | done | `pass` | 等待用户明确确认 Step 19。 |

`pass` 只表示 Step 18 已把每个尚未关闭的事项记录到可追溯的 owner、影响和未确认前处置；它不解除任何 blocker，也不表示设计、实施、发布、Artifact handoff、consumer confirmation 或 readiness 已通过。

### 0.2 本 Step 保持的结论分级

| 分级 | 当前可保留的内容 | 不可误读为 |
|---|---|---|
| `current-negative/no-write` | Command / Job 在 `DDD-S9-B01/B02` 前停止；Query 严格只读；conditional inbound 仅 marker；outbound inventory 为零。 | 可 mutation、replay、adapter 调用、发布或外部成功。 |
| `planned-pure-contract` | 本仓 local object、typed ref、guard、状态词表、配置读取边界、fake parity 与测试切口。 | 已存在代码、store、fixture、run 或测试结果。 |
| `future/reopen-positive` | 在唯一 owner 合同和本仓 blocker 均补齐后，才可重新讨论的 build、qualification、handoff、availability 与 recovery 正向 lane。 | 当前可以由 fake、cache、ACK、配置或 sibling 草稿补足。 |
| `blocked` | 缺少唯一、owner-controlled、可落码输入的事项。 | 实现者可自行选 schema、digest、产品、gate 或恢复策略。 |

## 1. 本步目标与风险登记边界

本 Step 只回答“哪些未关闭事项仍会影响实现或后续设计、谁需要确认、未确认时应该如何停止”，不把风险登记变成第二套详细设计或实施计划。

它尤其不能改变下列边界：

- 本仓拥有成员镜像资产层和构建产物供给层的 local staged truth，不拥有 member 主体、RoleDefinition、runtime loop、tool execution、live memory / checkpoint / workspace、container 生命周期、sandbox policy / backend、Artifact truth、governance approval、observability backend、外部 adapter truth 或产品入口。
- template、static seed、pinned build input、candidate / entry 等 local record 与运行时 live state 必须继续分离；未闭合 owner 的 body 只能表现为 body-free ref、safe conclusion、gap、blocked、unknown 或 marker。
- 依赖只能按 `compile`、`runtime`、`event`、`ref`、`adapter`、`fake` 分类。镜像被消费、相邻仓存在或 sample 可读都不产生源码 / Cargo 依赖。
- `Available`、`Assembled`、`Fresh`、`Resolved`、`Accepted`、`Passed`、`Eligible`、`Buildable`、`Complete`、`Succeeded` 都只表示各自 local/staged subject 的状态，绝不汇总为 global readiness。

## 2. 本步输入与准入结论

| 输入 | 状态 | 本 Step 的用途 | 不可从中推导 |
|---|---|---|---|
| 重建版 00、01、02 | 已停审的本仓基线 | 回指范围、owner、VETO、五 capability、技术模块、依赖分类与状态骨架。 | 外部 exact DTO、产品、运行事实或 positive readiness。 |
| Step 1 至 Step 4 | 已完成 | 回指上游缺口、范围、Rust planned baseline、目录 / 仓库与 compile 约束。 | 实现仓、manifest、git identity 或 active sibling dependency 已存在。 |
| Step 5 至 Step 10 | 已完成 | 回指模块、对象、port、协议、flow 与 local lifecycle 的已定义部分。 | protocol surface 已自动成为可写 / 可发布能力。 |
| Step 11 至 Step 13 | 已完成且有开放项 | 回指 store、UoW、错误、unknown、concurrency、idempotency 与 recovery 的缺口。 | 可以由实现现场选择 upsert、lease、TTL、global key 或 retry。 |
| Step 14 至 Step 16 | 已完成且有开放项 | 回指 config / composition、seam 分类、redaction、观测与测试切口。 | config、slot、fake、signal 或 test seam 是 external success / evidence。 |
| Step 17 | 已完成 | 回指 blocker 到受影响 logical surface、重开 Step 与后续 07 审计前置。 | 已生成 07、phase、commit 或 implementation ledger。 |
| `draft/05_旧材料差异审计与待确认.md` | historical / pending registry | 保留原 `MI-UP-*`、`Q-MI-*` 编号、owner 和污染防线。 | 兄弟项目草稿或旧文档已成为闭合合同。 |
| L2-member、L2-member-service 的进行中材料 | 并行窗口 placeholder | 只确认 owner、方向、gap 与需要重新校准的条件。 | manifest / variant / ref / compatibility / confirmation 已闭合。 |
| L1-governance Step 18 | 格式与审计粒度参考 | 参考风险分层、风险表、待确认表、回填和停审组织方法。 | 其治理领域、outbox、publisher、产品、evidence 或已闭合正向合同。 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 哪些问题仍可能影响代码实现？ | 正式文档链尚未完成；目标实现仓与 activation 条件未核验；本仓 canonical input / result / UoW / replay、availability terminal persistence、projection recovery 仍有设计 blocker；所有 `MI-UP-*` 与 `Q-MI-*` 的受影响正向 lane 仍缺 owner-controlled 输入。 |
| 哪些问题会阻塞实现，哪些只影响后续优化？ | 新版正式 03、04、05、06、07 与每个实际 07 boundary 的审计是所有正式代码开工门禁。`DDD-S9-B01/B02` 阻塞全部 Command / Job mutation；`B03`、`OPEN-01/02`、`PF` 阻塞相应 local write / recovery；`MI-UP-*`、`Q-MI-*` 阻塞各自 external / product positive lane。已定义的 pure contract、Query strict no-write 与 marker-only negative seam 只能作为未来 boundary 的输入，不能替代开工批准。 |
| 每个待确认事项需要谁确认？ | 本仓 detailed-design owner 负责 Step 19 装配和污染审计；04/05/06/07 分别由其文档流程负责；本仓 local blocker 需回到指定 03 Step；跨仓事项只能由对应唯一 owner 的正式停审材料和双方重新校准确认。 |
| 未确认前实现者应该如何处理？ | 不得自行补设计或以 fake / cache / tag / ACK / configuration / sample body 生成正向事实。对不影响 read-only / marker-only 的输入保留 typed gap、blocked、unknown 或 unavailable；任何需要 mutation、replay、recovery、handoff、consumer confirmation、gate pass 或 product adapter 的行为必须暂停并回写设计。 |

## 4. 当前材料诊断

| 诊断 | 风险 | 本 Step 的处置 |
|---|---|---|
| 新版正式 03 尚未由 Step 19 装配。 | calibration 细节可能被误当成正式实现基线，旧正式 03 也可能被误用。 | 列为全局正式移交 blocker；本 Step 不读取旧正式 03。 |
| 04、05、06、07 没有新版连续基线。 | 配置、测试、验收、phase / commit、implementation ledger 与 planned boundary skeleton 的职责可能被提前塞入 03 或实现。 | 列为文档链风险；不预写其内容或生成其文件。 |
| Step 8/9 描述了逻辑 surface，但 write path 有显式 stop。 | 把 DTO / flow 存在误读为 Command / Job 可写，进而以 fake 成功绕过 canonicalizer、result、UoW 或 replay。 | 保持 B01/B02 为 blocker，并在风险表明确受影响的 10 Command / 6 Job。 |
| local staged state 较多且彼此正交。 | 将 `Buildable`、`Succeeded`、`Eligible`、`Available` 或 `Fresh` 串成 release / consumer / runtime ready。 | 风险表和未确认前规则继续要求 staged isolation。 |
| 并行 sibling 与上游 owner 尚未共同停审 exact contract。 | 从消费方向、运行时关系或旧材料推导 Cargo、route、topic、schema、digest、Artifact acceptance 或 confirmation。 | 保持 seam 分类及 body-free / gap / fail-closed 语义；列出逐 owner 重开条件。 |
| 旧 README / 旧正式文档含有未经当前 authority 复核的定量、产品和对象口径。 | Step 19 或下游文档发生历史污染回流。 | 列为装配前污染审计风险；不在本 Step 猜测、继承或修复旧正式 03。 |

## 5. 改动前后对比

| 主题 | Step 18 前 | Step 18 后 | 不代表 |
|---|---|---|---|
| 未关闭项 | 分散在 Step 1 至 Step 17 和 draft 中。 | 已按文档链、local blocker、owner contract、产品 / scope 与历史污染分层登记。 | 任一事项已关闭。 |
| blocker 影响面 | 可回指但阅读成本高。 | 每一组均有受影响 lane、当前禁止事项、确认方和重开位置。 | 实施任务或 commit 已拆分。 |
| pending 输入 | 可能被误读为“即将可用”。 | 明确只能是 placeholder，不可形成正向合同。 | sibling 内容已被本仓接受。 |
| 正式回填 | 仅有前序 Step 的分散草稿。 | 有 §17 的受控回填草稿。 | 已装配或修改正式 03。 |

## 6. 设计取舍

| 议题 | 采用 | 未采用 | 原因 |
|---|---|---|---|
| 风险登记粒度 | 以能影响 implementation boundary 或下游正式文档的事项为主，并保留既有 ID。 | 把所有已由后续 Step 处理的中间疑问重新列为 blocker。 | 避免风险表成为第二套对象 / 协议清单，同时不丢失可执行的回流路径。 |
| local blocker 处置 | 明确指定回到哪个 03 Step 重开。 | 让 07 或实现者自行选择技术解。 | canonicalization、history persistence、replay 与 recovery 均没有可由现场补齐的唯一解。 |
| owner pending 处置 | ref / safe conclusion / gap / blocked / unknown / marker-only。 | fake success、默认通过、tag 推 digest、ACK 代 outcome。 | 外部 truth 和 positive confirmation 不归本仓所有。 |
| 依赖表达 | 保持六类 seam，compile 当前为零 active sibling path dependency。 | 将运行时消费关系转成 Cargo、HTTP、topic 或产品绑定。 | 防止 owner 反转、循环依赖和伪合同。 |
| 文档链处置 | Step 19 后再串行进入 04、05、06、07。 | 以 Step 18 直接开始 04 / 05 / 06 / 07 或实施。 | 用户要求项目内正式文档严格串行且每文档停审。 |

## 7. 风险分层图

```text
L2-member-images detailed-design open items
  |
  +-- Formal-document chain
  |     +-- Step 19 formal 03 is not assembled
  |     +-- 04 / 05 / 06 / 07 new baselines do not exist
  |     +-- target implementation-repository activation is unconfirmed
  |
  +-- Local detailed-design blockers
  |     +-- canonical input / result / UoW / replay
  |     +-- availability history terminal persistence
  |     +-- in-flight namespace and projection-unavailable recovery
  |
  +-- Owner-controlled contract gaps
  |     +-- member-service / member / method / Core / event / seed
  |     +-- Artifact / sandbox / outbound authority
  |
  +-- Scope, product and policy gaps
  |     +-- restricted scope / multi-architecture
  |     +-- builder, registry, store, evidence and gate authority
  |
  +-- Historical-material contamination
        +-- legacy quantitative, product and object vocabulary
```

关键说明：

- 分层按“影响和确认路径”组织，不把每一层变成 implementation phase、service、crate 或 deployment topology。
- 同一事项可影响多个 logical surface，但只能由指定本仓 Step 或唯一 owner 合同重开；不能用另一个层的配置或 fake 绕过。
- 该图不表达任何已发生的构建、digest、Artifact、release、consumer handoff、测试、验收或 readiness。

## 8. 已有唯一来源、但不等于当前可实施的事项

下表不是“风险已消失”的声明；它仅说明这些事项已有详细设计来源，因此不应被实现者重新选择。若后续发现冲突，必须回写来源，而不是在代码、配置或本风险表中临时变更。

| 事项 | 已有真相源 | 当前仍需遵守的限制 |
|---|---|---|
| 七技术模块、五 capability 与向内依赖 | Step 5 | 不按 capability 拆独立服务，不从 consumer 关系推 compile dependency。 |
| local object、typed ref、static / live 红线与状态词表 | Step 6、Step 10 | field / factory 缺口回 Step 6；local state 不等 global readiness。 |
| application-owned port、fake 与 seam 分类 | Step 7、Step 14 | port 存在不等 provider / product / owner contract 可调用；fake 只用于明确 TestOnly 组成。 |
| 10 Command、10 Query、2 条 marker-only inbound、6 Job、零 outbound 的逻辑边界 | Step 8、Step 9 | Command / Job 仍受 B01/B02；Query 零写；inbound 无 envelope / receipt；outbound 不得扩张。 |
| 错误、unknown、redaction、观测与测试切口 | Step 12、Step 15、Step 16 | 这些是设计 / planned seam，不是 run、report、evidence、verdict 或 signoff。 |

## 9. 风险登记：文档链与本仓 local blocker

| ID / 风险 | 当前影响与阻塞范围 | 未确认前缓解 / 禁止事项 | 负责人 / 重开条件 |
|---|---|---|---|
| `DOC-03-001`：新版正式 03 未装配 | 阻塞正式详细设计移交、后续 04~07 的新版直接输入和任何实现开工。 | 不得按 calibration 或旧正式 03 开工；不得把本登记当正式正文。 | 详细设计维护者在获用户确认的 Step 19 从 Step 1~18 装配并自检。 |
| `DOC-03-002`：04、05、06、07 新版基线未生成 | 阻塞 config truth、测试方案、验收、phase / commit boundary、implementation ledger 与 planned boundary skeleton。 | 不猜 config key / product / profile；不执行测试；不造 evidence / verdict / signoff；不拆 phase / commit。 | 各文档按严格 `03 -> 04 -> 05 -> 06 -> 07` 顺序生成并各自停审。 |
| `DOC-03-003`：历史材料污染 | 阻塞 Step 19 装配通过；可能把旧 Role 数量、指标、产品、对象或外部成功口径带回新版。 | 旧 README、旧 00/01/02/03/05/06 均不能直接继承；旧正式 03 当前不得读取。 | Step 19 才做逐项 historical audit；冲突回写当前 authority Step。 |
| `IMP-03-001`：目标实现仓 / activation 未确认 | 阻塞代码、Cargo、配置、脚本、测试和实现仓 commit。 | 不创建或接管 `quantalithos-member-images`；不假定 workspace、toolchain、git identity 或目录存在。 | 仅未来正式 07 首个 activation boundary 可实际核验并记录。 |
| `DDD-S9-B01`：canonical input 与 mutation UoW 链未闭合 | 阻塞全部 10 Command 与 6 Job 的 canonicalize、reserve、UoW、read/save、adapter、trace / history / gap / freshness / result 与 commit。 | 保持 validation / context 后 zero-effect；不可通过 fake、metadata、config 或 scheduler 绕过。 | 重开 Step 7/8/9，定义 per-protocol canonical input、字段来源、mapper 与同 boundary 规则；随后复核 Step 11~16。 |
| `DDD-S9-B02`：stored result / result-ref / replay 链未闭合 | 阻塞 result identity、保存、complete reservation、duplicate replay 和从 current truth 重算 response。 | 不 mint result ref，不保存 shell/body，不宣称 duplicate replay。 | 重开 Step 6/7/8，闭合 factory、shell/body mapper 和 UoW ordering；随后复核 Step 9、11~16。 |
| `DDD-S11-B03`：availability transition terminal persistence 未闭合 | 阻塞 `TransitionAvailability`、`RollbackOrRetireEntry` 与既有 history 的终结 / supersede 持久化。 | 禁止 delete、reinsert、overwrite 或以 current entry 代替 transition terminalization。 | 重开 Step 7/10，选择并闭合 versioned update 或 append-final-record 模型；同步 Step 11~16。 |
| `DDD-S13-OPEN-01`：in-flight / Reserved recovery 未闭合 | 阻塞并发 first / second writer、crash re-entry、idempotency store / UoW 的合法恢复。 | 禁止私加 lease、TTL、cleanup、`AlreadyInProgress`、second-writer retry 或 public Reserved result。 | 重开 Step 6/7/11/13，闭合 lookup、outcome、recovery 与 durable/fake parity。 |
| `DDD-S13-OPEN-02`：channel/name/key namespace 未闭合 | 阻塞跨 Command / Job replay 和 idempotency conflict mapping。 | 不假定 raw key 全局唯一，不建 global raw-key index，不跨 surface replay。 | 重开 Step 6/7/11/13，统一 namespace、lookup 与 conflict policy。 |
| `PF-UNAVAILABLE-RECOVERY`：projection `Unavailable` 无恢复函数 | 阻塞 `RebuildImageDerivedViews`、projection recovery 与相关 test / operations lane。 | 不把 `Unavailable` 直接改为 `Rebuilding` / `Fresh`；Query、cache、fake 都不可 repair。 | 重开 Step 10~16，定义 function、committed truth source、version / UoW、error 与 test，再由 07 审计实际 boundary。 |

## 10. 风险登记：owner-controlled contract gap

以下项目均保留原 `MI-UP-*` 编号。它们不是本仓可以关闭的 implementation TODO；只有 owner 的正式文档与双方重新校准才可能解除相应 lane。未明确列出的字段、schema、产品、route、topic、digest、evidence 或 confirmation 一律仍未获得授权。

| ID / 风险 | 当前影响与阻塞范围 | 未确认前缓解 / 禁止事项 | 唯一确认方 / 重开条件 |
|---|---|---|---|
| `MI-UP-001`：Member Service consumer contract | 阻塞 `MemberServiceSupplyPort`、`ConsumerHandoffGap`、`ResolveInstantiableEntry` 与 handoff reconciliation 的正向 consumer lane。 | 只可保留 local pinned entry、typed consumer slot、gap / unavailable；不得造 manifest、variant、ref、qualification、confirmation、host / container / launch / health / readiness。 | `L2-member-service` 正式停审并与本仓校准 exact consumer contract / ref / confirmation 后，重开 Step 7~11、14~16 的受影响 seam。 |
| `MI-UP-002`：member component release / compatibility | 阻塞 `AssemblyBaseline`、`ComponentPinSet`、revision guard 与 component resolver 的正向 completeness。 | 只能使用 opaque future pinned ref 或 blocked baseline；不得猜 release shape、compatibility、member truth 或 confirmation。 | `L2-member` 与相关 runtime owner 提供正式 pinned release / compatibility 合同后，重开 Step 6~10、14~16。 |
| `MI-UP-003`：Role-to-variant mapping surface | 阻塞 `MappingReferencePort`、`MappingSourceSnapshot`、definition / baseline / revision 的 mapping input。 | 不 hardcode Role-to-variant，不复制 `RoleDefinition` 或 mapping body，不把 absence 判为 usable。 | `L3-method-library` 提供正式 body-free query / snapshot / ref 合同后，重开 Step 7~10、14~16 的 mapping lane。 |
| `MI-UP-004`：Core shared carrier | 阻塞任何 image-specific shared type 的 active Cargo 使用。 | 当前 active sibling compile dependency 为零；不得加 Core path dependency、shadow schema 或把 actor ref 误作 authorization。 | `L0-core` 正式接受 image-specific shared contract，且在目标实现仓复核 package / lib / path 后，重开 Step 3/4/7/8/14 与未来 07 dependency boundary。 |
| `MI-UP-005`：inbound build / source event authority | 阻塞 worker、conditional inbound、event-triggered BuildIntent 与 source refresh 的正向 lane。 | 仅 `InboundContractMarker::{Unavailable, Rejected, ReopenRequired}`，`accepted_input=false`；不得造 envelope、payload、identity、receipt、dedup、quarantine、topic 或 accepted write。 | Bus / Core / event owner 正式关闭 authority、family、schema、identity、version、dedup、receipt 与 transport 后，重开 Step 7~10、12、13、16。 |
| `MI-UP-006`：policy / memory / workspace seed owner and placement | 阻塞 `SeedReferencePort`、`SeedPlacementBinding`、`AssemblyBaseline` 的完整 static binding。 | 只保留 body-free static template ref、placement 或 gap；不得复制 semantic body，绝不把 seed 写成 live memory / workspace state。 | template owner 正式关闭 semantic owner / ref / placement / static-safe contract 后，重开 Step 6~10、14~16。 |
| `MI-UP-007`：Artifact consumable handoff | 阻塞 `QualificationBoundaryPort`、`ArtifactHandoffRecord`、`RecordArtifactHandoff` 与 reconciliation 的 `Accepted` lane。 | 仅 Pending / Gap；不得 mint ArtifactVersion、lineage、consumable ref、storage / delivery receipt 或 Artifact acceptance。 | `L1-artifact` 提供正式 image handoff schema、`ConsumableArtifactReference`、resolution / acceptance contract 后，重开 Step 7~11、14~16。 |
| `MI-UP-008`：hardened base / Sandbox direction | 阻塞将 hardened base 作为当前 build input 或 core scope。 | 不读取 Sandbox policy / backend，不声明 hardened result，不将其写入 current baseline。 | `L4-sandbox` / scope owner 给出 pinned base boundary；若范围启用，先回退 00~02 并重开受影响的 03 Step。 |
| `MI-UP-009`：outbound build / release event authority | 阻塞任何 outbound event、outbox、publisher、delivery / receipt / retry surface。 | `ImageOutboundEventInventory::NoneAuthorized` 是严格零；不得以 local publish、disabled config 或 notification placeholder 代替。 | Bus / Core owner 提供正式 outbound authority、consumer、schema、version、delivery-failure semantics 后，从 Step 5 起跨 Step 重开。 |

## 11. 风险登记：scope、product 与 policy gap

| ID / 风险 | 当前影响与阻塞范围 | 未确认前缓解 / 禁止事项 | 唯一确认方 / 重开条件 |
|---|---|---|---|
| `Q-MI-001`：restricted / read-only variant scope | 影响 DefinitionAssembly、Qualification 与是否存在特殊 Role variant。 | 不枚举特殊 Role，不把它纳入核心分母，不自产 governance truth。 | scope / governance authority 正式裁定；必要时回退 00~02 并重开受影响对象、协议、状态。 |
| `Q-MI-002`：multi-architecture dimension | 影响 variant identity、snapshot、catalog 与 coverage 语义。 | 不自创 architecture enum、覆盖率 / complete ratio 或平台成功结论。 | product / SRE scope 明确 identity basis 后，回退 00~02 并重开受影响 03 Step。 |
| `Q-MI-003`：builder / registry / store / evidence product | 阻塞 real adapter、endpoint / credential、provider outcome、immutable output observation 与 production composition。 | infra 只保留 product-neutral slot、availability、blocked / test-fake parity；不得选产品、endpoint、credential，或从 ACK / tag / cache 猜 digest / candidate。 | infrastructure / configuration authority 给出 safe adapter / product contract 后，重开 Step 7~16 及未来 04。 |
| `Q-MI-004`：applicable gate / evidence inventory and priority | 阻塞 `GateEvaluation::Passed`、positive eligibility 和依赖正式 evidence 的 Artifact interaction。 | 不枚举 BOM / scan / signature，不 default-pass，不生成 report / evidence / gate success。digest / provenance 的 local staged boundary不因此升级为 qualified output。 | security / governance / Artifact authority 给出 gate / evidence kind、priority、safe conclusion contract 后，重开 Step 7~16。 |

## 12. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 正式 03 装配与历史污染审计 | 没有新版详细设计正式入口。 | 用户确认后由详细设计维护者执行 Step 19。 | 停在 Step 18；不读旧正式 03，不装配正式 03，不移交实现。 |
| 新版 04 配置设计 | 没有 config source、priority、profile、secret、product binding 的正式真相源。 | 配置设计流程 / 维护者，在正式 03 停审后处理。 | 不在 code、infra slot 或本风险表中补 key、endpoint、credential、default 或 profile。 |
| 新版 05 测试方案与 06 验收标准 | 没有新版 test case、fixture、automation gate、evidence、verdict / signoff 基线。 | 测试与验收流程 / 维护者，严格承接 04 后输入。 | Step 16 仅为 planned seam；不执行测试、不生成 run_id、report、evidence、verdict 或 signoff。 |
| 新版 07 实施计划 | 没有 phase、commit boundary、implementation ledger、planned boundary skeleton 或 activation decision。 | 实施计划流程 / 维护者，严格承接 06 后输入。 | 不拆任务 / phase / commit，不创建 implementation ledger / skeleton，不写实现代码。 |
| 目标实现仓、workspace、toolchain 与项目级 git identity | 无法安全创建 / 接管实现环境或提交。 | 未来 07 首个 activation boundary。 | 不创建仓、Cargo、代码、脚本、测试或 commit；不使用 global git config 代替项目级核验。 |
| `DDD-S9-B01/B02` 写侧与 replay 链 | Command / Job mutation 和 replay 不可落码。 | 本仓 detailed-design owner 按指定 Step 重开。 | 保持 zero-effect stop；不能以 Query、marker、fake、config 或 scheduler 补写。 |
| `DDD-S11-B03` history terminal model | availability transition 的终结记录不安全。 | 本仓 detailed-design owner 按 Step 7 / 10 重开。 | 不 delete / reinsert / overwrite history，不将 local current entry 当 terminal record。 |
| `DDD-S13-OPEN-01/02` 与 `PF-UNAVAILABLE-RECOVERY` | 并发 / replay / crash recovery、namespace、projection recovery 无唯一实现契约。 | 本仓 detailed-design owner 按指定前序 Step 重开。 | 不私加 lease / TTL / cleanup / global key / automatic repair / cache recovery。 |
| `MI-UP-001~009` | affected external positive lane 不能形成本仓合同。 | 相应唯一 owner 正式停审，随后双方重新校准。 | 使用 ref / safe conclusion / gap / blocked / unknown / marker-only；不造 route、topic、DTO、manifest、digest、Artifact 或 confirmation。 |
| `Q-MI-001~004` | special scope、architecture、adapter product、gate / evidence policy 未定。 | scope、SRE、infrastructure、security / governance / Artifact authority。 | product-neutral、fail-closed；不锁产品，不默认通过，不声明 coverage / evidence / readiness。 |

## 13. 未确认前的统一处理规则

| 场景 | 强制处理规则 |
|---|---|
| 正式 03 未装配或旧正式 03 未审计 | 不以旧文件、校准片段或口头摘要为实现基线；等待 Step 19。 |
| 后续 04~07 未形成连续正式链 | 不把设计中的 slot、seam、测试切口或承接清单升级为 config、test、acceptance、phase 或 commit truth。 |
| 本仓 local blocker 未关闭 | 暂停受影响 lane，并回写指定 Step；不让实现者挑 store / recovery / replay 策略。 |
| owner contract 未闭合 | 只使用 typed ref、safe conclusion、gap、blocked、unknown、unavailable 或 marker-only；不得复制 body、schema 或 positive result。 |
| runtime / product dependency 不可用 | fake 只能是明确的 TestOnly seam，不能成为 Production fallback、evidence、digest、gate pass、Artifact acceptance 或 consumer confirmation。 |
| live state 与 static material 边界 | template / seed / pin / build input 不能承载 live memory、checkpoint、workspace、container 或 session state；相关 live truth 必须留给其 owner。 |
| 状态名或 staged relation 有歧义 | 停止并回指 Step 6 / 10；不得合并为 `ready`、`published`、`delivered`、`launched` 或相近口语状态。 |
| 依赖形态有歧义 | 先按 `compile/runtime/event/ref/adapter/fake` 重新分类；没有正式 compile approval 时 Cargo dependency 为零。 |

## 14. 正反例

### 14.1 正确：把 owner pending 维持为 gap

```text
ResolveInstantiableEntry reads an existing local InstantiableEntry.
If the Member Service contract is not formally resolved,
return the typed ConsumerHandoffGap and no consumer confirmation.
```

原因：`Available` 只表达 local pinned supply；它没有把 consumer / container / runtime truth 纳入本仓，也没有用缓存或 sample manifest 关闭 `MI-UP-001`。

### 14.2 错误：以 fake 闭合正向 build lane

```text
Use a fake registry success, derive a digest from a tag,
then mark CandidateImage and EligibilityDecision as ready.
```

原因：这同时越过 `DDD-S9-B01/B02`、`Q-MI-003` 与 `Q-MI-004`；ACK、tag、fake outcome 和 local state 都不能取代 verified immutable identity、owner gate conclusion 或正式实施边界。

### 14.3 正确：把 write blocker回写到设计

```text
The first writer reaches the unclosed idempotency namespace rule.
Stop the operation with no reservation or result write,
then reopen Step 6/7/11/13 instead of introducing a TTL.
```

原因：`DDD-S13-OPEN-01/02` 缺的是唯一 identity、lookup 与 recovery contract；TTL / lease 是新设计，不是风险缓解。

### 14.4 错误：将配置或 Query 作为 recovery 入口

```text
Enable a retry profile that changes ProjectionFreshness::Unavailable
to Fresh when a Query observes an empty cache.
```

原因：这规避了 `PF-UNAVAILABLE-RECOVERY`，把 configuration / cache / Query 错当 committed truth、UoW 与恢复函数。

## 15. 正式 03 §17 回填草稿（禁止当前装配）

> 回填前提：用户明确确认 Step 19；Step 19 完成新版正式 03 装配及 historical pollution audit；项目级、文档级与 Step 级门禁均允许正式回填。当前所有前提均不满足。

### 17. 风险与待确认事项

本仓详细设计的未关闭事项分为四类：正式文档链与实现 activation、本仓 local detailed-design blocker、owner-controlled external contract gap，以及 scope / product / policy gap。它们均有明确影响、确认方和未确认前的 fail-closed 处理；不得由实现者自行补字段、schema、状态、产品、digest、evidence、phase 或 commit。

风险表至少应保留：

1. 新版正式 03 尚未装配、04~07 尚未连续生成、目标实现仓 activation 未确认和历史材料污染审计；
2. `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` 的 local write / replay / persistence / recovery 上限；
3. `MI-UP-001~009` 和 `Q-MI-001~004` 的 owner、受影响 lane、未确认前禁止事项与重开条件。

未确认前，Command / Job 保持 B01/B02 前的 zero-effect stop，Query 保持 strict no-write，conditional inbound 保持 marker-only 且 `accepted_input=false`，outbound inventory 保持严格为零。template、static seed、build input、candidate / entry 和 runtime live state 不得混同；任何 local staged state 都不构成 external or global readiness。

## 16. Step 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP 要求的风险表和待确认事项表已形成 | `pass` | §9~§12。 |
| 所有未关闭事项都有影响、owner / 重开条件或未确认前处置 | `pass` | §9~§13。 |
| local blocker 未被弱化 | `pass_with_explicit_blockers` | `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`仍开放。 |
| sibling / owner pending 未被写成已闭合合同 | `pass_with_explicit_blockers` | §10、§11；`MI-UP-*`、`Q-MI-*` 均保持 pending。 |
| 未新增 schema、state、config、product、test / acceptance fact、phase 或 commit | `pass` | §0、§1、§6、§15。 |
| 未读取旧正式 03、未装配正式 03 | `pass` | 本 Step 仅创建本文件并回写台账。 |
| 未创建 04~07、implementation ledger、planned boundary skeleton、实现仓或代码 | `pass` | 本 Step 范围与项目级串行门禁。 |
| 是否允许自动进入 Step 19 | `blocked` | 仍须等待用户明确确认；Step 18 完成不等于 Step 19 已授权。 |

```text
step_18 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_19
formal_03_write_allowed = false_until_step_19_and_user_confirmation
old_formal_03_read_allowed = false_until_step_19_historical_audit
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
