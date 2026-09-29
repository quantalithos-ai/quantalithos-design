# Step 18. 风险与待确认事项

> 对应：`standards/document/详细设计讨论流程_SOP.md` Step 18、`详细设计书写规范.md` §5.17。
> 回填位置：正式 `03-详细设计.md` §17。
> 状态：`completed / pass_with_explicit_external_blockers_and_local_pending / continue_authorized`。本步通过只表示未关闭事项已完整登记，不表示实现、外部合同、测试或 readiness 已通过。

## 1. Step 状态与边界

| 项 | 结论 |
|---|---|
| 当前范围 | 汇总 Step 01～17 仍未关闭、会影响后续设计或实施的风险与待确认事项 |
| 上游 blocker 分母 | `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`，共 12 项，全部继续开放 |
| 本地 pending | operation codec、cursor mapping、durable store、具体配置/数值、telemetry binding、后续正式文档与实施前事实检查 |
| 不新增内容 | 不新增对象、字段、接口、状态、算法、配置默认值、provider、phase、commit boundary、验收编号或实施事实 |
| 完成上限 | 允许 Step 19 装配正式 03；受影响 production positive path 仍按项 blocked/fail-closed |
| 本轮禁止 | 不修改 owning project，不创建 04～07、implementation ledger、boundary skeleton 或目标实现仓，不提交 commit |

## 2. 本步输入

| 输入 | 状态 | 本步用途 |
|---|---|---|
| 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 已停审 | 保持业务边界、owner、依赖分类、风险 ID 与完成上限 |
| Step 01～04 | completed | 上游缺口、范围、编码/runtime、planned 文件布局风险 |
| Step 05～08 | completed | 6 crate、26 对象、8 service、ports 与 30 入口的合同风险 |
| Step 09～13 | completed | 函数流、18 状态、事务、一致性、错误、并发和幂等风险 |
| Step 14～16 | completed | 配置 binding、观测边界和 planned test cuts 的未闭合事项 |
| Step 17 | completed | 实施承接分类、跨文档闭环预审和未来 boundary 输入 |
| 详细设计 SOP Step 18 / 书写规范 §5.17 | 已读取 | 风险表、待确认表、影响范围、owner 和保守姿态格式 |
| `L1-governance` / `L1-workspace` Step 18 | 粒度样本 | 参考分层、关闭证明和回流粒度，不复制领域主语 |

旧 `README.md`、旧正式 03/05/06 与 `draft/` 仍只作为 `historical_material` 或污染审计输入；不得据其关闭任何风险。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题仍可能影响代码实现？ | 12 项持续 blocker 会影响 exact source、lifecycle authority、integrity/storage、artifact/audit/workspace material、restore receiver、SDK 方向、outbound 与 NFR；本地 pending 会影响 production reservation、continuation、durable UoW、runtime assembly、观测绑定和实施开工。 |
| 哪些会阻塞实现，哪些只影响优化？ | 每项都至少阻塞其 exact positive production boundary；正式 04～07、目标仓和实施台账缺失阻塞整体 implementation start。低基数 telemetry 本地接口、纯 domain invariant 和 fake contract test 可作为未来 planned boundary，但当前没有编码授权。不存在可用“仅优化”解释绕过的 authority、integrity、commit 或 compatibility 缺口。 |
| 每项由谁确认？ | canonical truth 合同由相应 L1 owner；Artifact 与 observability 分别由 `L1-artifact`、`L4-observability`；workspace 只确认 projection export；governance/security/storage/Bus/receiver/全局依赖由其正式 owner；本地 codec/store/config/test/implementation gate 由后续 04～07 及届时实施事实检查确认。 |
| 未确认前如何处理？ | exact slot Blocked/Unsupported/Unknown，partial/stale/missing/conflicting 保真；不填默认值、不构造 positive handle、不 blind retry、不把 fake 当 integration proof、不把 Bundle 当写权限、不声称 success/readiness。 |

## 4. 问题诊断与取舍

### 4.1 诊断

| 观察 | 风险 | 本步处置 |
|---|---|---|
| 本地字段/DTO/状态/flow 已闭合，外部 positive input 仍未知 | 容易把“port 已定义”误报为“integration ready” | 用 `locally_closed / blocked_external / future_document_required` 三态继续分离 |
| 12 项 blocker 跨越不同 owner 和不同 target | 用一个“上游待定”无法判断可继续范围 | 每项列 owner、阻塞面、关闭证明和未确认姿态 |
| codec、store、数值和 backend 属本仓后续设计 | 若并入上游 blocker 会把本地责任外推 | 单列本地 pending，不新增跨仓 blocker |
| fake 可以覆盖本地正负语义 | fake positive 可能被误作真实合同/存储/加密/恢复证明 | fake 只作 test support；真实 integration 仍由对应 blocker 控制 |
| 旧正式 03 已有大量历史设计 | 逐段修补会保留旧领域主语、供应商和成功口径 | Step 19 整体删除重建并做污染审计 |
| 正式 04～07 与目标实现仓均未就绪 | 正式 03 完成被误解为可开工 | 将其列为 implementation start 硬门禁，而非 03 本地设计失败 |

### 4.2 取舍

| 议题 | 选择 | 理由 |
|---|---|---|
| 是否因外部 blocker 停止正式 03 | 完成本地详细设计并把 exact positive boundary 标为 blocked | 可固化职责、失败姿态和 adapter seam，同时不伪造外部事实 |
| 是否给未知 provider/算法/数值临时默认 | 不给默认，required slot fail-closed | 临时值会进入持久 key、cursor、digest、retention 或 success truth |
| 是否将 workspace projection 作为缺失 L1 truth 的 fallback | 永不允许 | projection 是 Auxiliary，不具 canonical authority |
| 是否用通用 outbox 模板补 outbound | 不创建 | `AR-HLD-Q-001` 未关闭，没有获准 event family 或 delivery truth |
| 是否把目标实现仓缺失记成跨仓 blocker | 仅记 implementation start precondition | 当前任务是设计；目标仓创建需未来正式 07 和用户实施授权 |
| 是否提前给 07 phase/commit | 不给 | 04/05/06 尚未完成，当前只能提供 boundary family 输入 |

## 5. 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| L1 snapshot/export/version/fence/coverage 不统一 | 无法证明跨域切片是同一受控语义下的完整输入 | source binding、capture、closure、恢复材料正向集成 | 逐 source typed binding；保留 partial/stale/missing/conflicting；不统一伪 schema | 各 L1 truth owner；`AR-UP-001` |
| Archive 越权决定项目 lifecycle | archived/dissolved/restored 被本仓错误发布 | archive trigger、lifecycle result、restore completion | 只消费正式 owner decision/ref；Archive 状态不外推为项目状态 | `L1-work` / 正式项目状态 owner；`AR-UP-002` |
| retention、hold、delete、risk authority 未闭合 | 可能违规迁移、删除或绕过 hold | lifecycle execution、purge/delete、保留期配置 | decision missing/stale/conflicting/hold 一律 Blocked；不设年限或默认许可 | `L1-governance` 或明确 owner；`AR-UP-003` |
| digest/signature/key/encryption/compression/schema authority 未闭合 | 伪造完整性、可读性或长期兼容结论 | Bundle verification/seal、crypto adapter、compatibility positive | 只保存 typed ref/Unknown/Unsupported；不选算法、不造 digest/signature/key | security/schema/infrastructure 正式 owner；`AR-UP-004` |
| archive storage location/tier/commit/retrieval 语义未闭合 | ACK/timeout 可能被误作 durable/available | placement、retrieve、tier transition、probe/reconcile | intent-before-effect；只有正式 commit/probe 更新状态；unknown 不 blind retry | storage/infrastructure owning project；`AR-UP-005` |
| Artifact ref 被当正文与血缘闭包 | manifest 完整但实际缺少 owner material | artifact capture、manifest closure、restore material | 只接 owner-approved material/ref；exact-set finding 可见；不复制 Artifact model | `L1-artifact`；`AR-UP-006` |
| observability 摘要被当完整审计链 | 归档/验证证据范围被夸大，或本仓吞并 backend | audit material capture/export、验收 evidence | runtime telemetry 非权威；只消费获准脱敏 material/ref；Archive 不建 audit backend | `L4-observability`；`AR-UP-007` |
| workspace projection 被提升为 canonical | projection 漂移污染跨域 snapshot 与恢复 | workspace capture、coverage、closure | 永远标 `WorkspaceProjection/Auxiliary`；不能填任何 canonical gap | `L1-workspace`；`AR-UP-008` |
| restore receiver 合同和提交语义未闭合 | Bundle 被当跨域写权限，partial success 被压成 restored | per-owner resolve/import/handoff/probe/compensation | frozen per-owner item；正式 receiver port；独立 outcome；commit unknown 只 probe | 各 truth owner / restore receiver；`AR-UP-009` |
| SDK 依赖方向冲突污染 package graph | Archive 服务端反向依赖 client，可能形成循环 | compile dependency 与 server public boundary | 服务端不引入 SDK；只保留 downstream/runtime 关系，等待全局标准对齐 | 全局依赖标准 owner + `L0-sdk`；`AR-ARCH-001` |
| 未核验 outbound event/outbox 被模板化创建 | 本仓产生未授权事实与伪 delivery evidence | publisher、topic、outbox、delivery state | 当前 outbox 恒空；若正式解锁必须回退 02/03 的对象、协议、UoW 与测试设计 | Archive + Bus/consumer contract owners；`AR-HLD-Q-001` |
| workload、Bundle 规模和恢复目标无 authority | 任意 page/batch/lease/retry/RTO 可能不可行或误导验收 | 配置数值、容量、性能、recovery test 与 acceptance | 不设默认和通过阈值；等待 workload/environment/test authority | workload/environment/test owner；`AR-HLD-Q-002` |
| operation key/cursor codec 未闭合 | durable duplicate 判定或分页 continuation 跨进程漂移 | 全部非 Query reservation；Q01～Q05 continuation | 结构化语义已固定；04 未绑定前 production reserve/continuation fail-closed | Archive 04 / security / store owner |
| durable store 和 transaction capability 未选 | 无法证明 UoW、CAS、range read-set、probe、fence、restart 等价 | production local persistence 与 worker positive path | adapter 必须通过 Step 11/16 contract；不以 in-memory fake 证明 durability | Archive infra owner / 04～07 |
| runtime 配置、provider、secret 与数值未成正式 schema | builder 可能用环境猜测或静默 fallback | production assembly 与 external slot construction | raw config 仅 infra；required slot 缺失拒绝 facade；正式 04 逐项闭合 | Archive 配置维护者 / 04 |
| telemetry sink/backend 与 redaction operational rule 未绑定 | 安全字段可定义但无法证明运维接入和全量脱敏 | production telemetry integration、05/06 evidence | sink failure 不影响业务；禁止字段保持禁止；不声称 backend/evidence ready | Archive 04/05、运维 owner；audit export 另受 `AR-UP-007` |
| historical material 回流 | 旧供应商、7 年、性能数值、旧对象/API/成功口径污染正式真相 | Step 19 装配与后续文档 | 整体重建正式 03；逐项 denominator/source-authority/owner 污染审计 | 当前详细设计维护者 |
| 正式 04～07、ledger/skeleton 与目标实现仓尚未就绪 | 无配置、测试、验收、commit boundary 或真实开工入口 | 整体 implementation start | 严格逐文档完成并停审；07 才创建 planned ledger/skeleton；另获用户实施授权 | 后续文档维护者 / 用户 |

## 6. 上游 blocker 待确认表

| ID / 事项 | 当前影响与 exact 阻塞范围 | 需要谁确认 / 正式读取入口 | 关闭所需证明 | 未确认前处理方式 |
|---|---|---|---|---|
| `AR-UP-001` source snapshot/export/query | J02～J04、E02、manifest source member、恢复 source material | 各 L1 truth owner 正式 02/03/接口合同及 flow/ledger | 每个 SourceClass 的 selector、authority、schema/version、fence/watermark、coverage、错误与兼容证明 | exact slot Blocked/Unsupported；partial/stale/missing/conflicting 保真 |
| `AR-UP-002` project lifecycle / trigger / restore handoff | C01/C02/E01 与 job/lifecycle 的 owner decision 解释 | `L1-work` 或正式项目状态域当前正式文档 | archived/dissolved/restored owner、触发/撤销、version/applicability 与 handoff 合同 | Archive 不决定、不回写、不发布项目状态 |
| `AR-UP-003` retention/hold/delete/risk | C03、E03、J11/J12 与 result retention cleanup | `L1-governance` 或明确 owner 正式合同 | typed decision/ref、scope/version/validity、hold precedence、delete/risk authority 与反馈 | missing/stale/conflicting/hold→Blocked；不清理、不执行删除 |
| `AR-UP-004` integrity/security/schema | J06～J08、seal/verify/compatibility、长期读取 | 正式 security/schema/infrastructure authority | approved algorithm/capability/version/key ref、sign/verify/encrypt/compress/schema evolution 与 failure 合同 | Unknown/Unsupported/Blocked；不生成或声称 digest/signature/verified |
| `AR-UP-005` object storage | J09～J12、E04、J14 retrieve 与 placement/lifecycle history | storage/infrastructure owning project 正式合同 | location/tier、operation/effect correlation、commit/probe/retrieve/transition 与 unknown semantics | 不把 ACK 当 commit；MayHaveDispatched 只 exact probe/reconcile |
| `AR-UP-006` Artifact archive material | artifact source entry、manifest closure、restore material | `L1-artifact` 当前正式 02/03/接口合同及 ledger | body/ref/lineage owner、material closure/version/compatibility、export/import boundary | 只存获准 material/ref；引用集合不等正文或血缘闭包 |
| `AR-UP-007` observability material | audit/evidence source slice、redaction、coverage/verification、未来 export | `L4-observability` 当前正式文档及 ledger | safe material/ref schema、redaction、coverage、verification、retention 与交接合同 | 只保留本仓 native record/runtime telemetry；无正向 audit handoff |
| `AR-UP-008` workspace projection export | Auxiliary source slice 与 coverage | `L1-workspace` 当前正式文档/ledger，尤其其 archive read/export blocker | read/export schema、projection version/coverage/visibility 和明确 Auxiliary 标记 | exact slot Blocked；永不补 canonical source |
| `AR-UP-009` restore receiver | J13～J17、E05、per-owner completion/compensation | 各 owning domain 正式 import/restore/command/handoff 合同 | receiver resolve、material schema/version、effect key、outcome/probe/compensation、unsupported/conflict/unknown semantics | per-owner Blocked/Partial/Unknown；Bundle 不直接写 owner DB |
| `AR-ARCH-001` SDK direction | Cargo/package graph 与 public protocol consumer direction | 全局依赖标准 owner + `L0-sdk` 正式设计 | 权威矩阵修正或 exact non-cyclic dependency 裁决 | Archive server compile graph 排除 SDK |
| `AR-HLD-Q-001` outbound family | committed fact、outbox、publisher/topic、delivery/result | Archive 架构 + Bus/consumer contract owners | 必要性、event family/schema/version、owner、UoW/outbox、delivery 与 consumer contract | 不创建任何 outbound slot/outbox/publisher/evidence；解锁须回退设计 |
| `AR-HLD-Q-002` workload/NFR | limits、budgets、吞吐、RTO/RPO/容量与测试阈值 | workload/environment/test authority | 可追溯 workload profile、Bundle distribution、环境、测量法和目标阈值 | 不填数字、不截断为 Complete、不声明性能/恢复达标 |

逐 target 关闭，不能以“owning project 已完成 00～07”一次关闭整项。关闭时必须记录 exact 文档章节、symbol/schema/version、适用 target 与失败语义；未覆盖 target 继续开放。

## 7. 本地 pending 与后续前置表

| ID / 事项 | 当前影响 | 关闭材料 / 确认方 | 未确认前处理 |
|---|---|---|---|
| `AR-03-LOCAL-001` operation canonical codec/digest | 非 Query durable reservation、same/same 与 same/different 跨实现一致性 | 正式 04 的 codec/hash binding 与 security review；05 parity tests | production reserve Blocked；不借 Bundle digest，不让 fake 私定 |
| `AR-03-LOCAL-002` public/repository cursor mapping | 五 Query continuation、visibility/snapshot/order binding | 正式 04 选择 authenticated stateless codec 或 durable mapping；05 安全/重启测试 | continuation Blocked；不回传 private cursor，不用临时 base64/JSON |
| `AR-03-LOCAL-003` durable store/UoW driver | atomicity、CAS/range read-set、transaction probe、claim fence、restart | 04 binding；05/06 contract/故障/并发判据；实施期真实 adapter proof | production store slot Blocked；fake 仅验证语义，不证明 durability |
| `AR-03-LOCAL-004` 完整 config schema 与数值 | provider refs、page/batch/lease/timeout/retry/probe/retention 与 secret binding | 正式 04 逐项定义来源、优先级、合法范围、是否 required 和 reload 规则 | 无默认；缺 required slot 不暴露 capability；不隐式 retry/cleanup |
| `AR-03-LOCAL-005` telemetry runtime binding | sink/backend、采样、redaction operational checks 与运维集成 | 正式 04/05 及运维 owner；06 定义证据边界 | 只保留安全 signal contract；sink failure 不改变业务；不宣称 evidence ready |
| `AR-03-LOCAL-006` 正式 04～07 与 implementation start | 配置/测试/验收/phase/commit、ledger/skeleton、目标仓和 project-local facts | 每份正式文档按 SOP 完成停审；07 创建 planned ledger/skeleton；未来实施授权时重验仓、Git、toolchain、Core | 当前不写代码、不创建目标仓/ledger/skeleton、不生成 baseline/run/evidence/readiness |

这些 ID 是 L4-archive 本地设计 pending，不扩充跨项目 blocker 分母，也不把本仓责任推给上游。任何一项若在后续设计发现影响已停审 00～03 的正式契约，必须回退相应 Step 和正式文档重新校准，而不是只改状态。

## 8. 已关闭问题与不得重复开放项

| 已关闭设计问题 | 关闭依据 | 保持方式 |
|---|---|---|
| contracts/domain definition owner 与 dependency direction | Step 05/06 | 固定 2 contracts + 24 domain；六 crate 单向依赖 |
| 26 正式对象的字段、factory、invariant 与 source | Step 06 | 外部字段只能由正式 port outcome 构造 |
| 7 port family、adapter slot 与 fake boundary | Step 07/14 | production exact slot fail-closed；fake test-only |
| 3C + 5Q + 5E + 17J 协议分母 | Step 08 | 30 logical entries / 32 method surfaces，不随实现增减 |
| 函数流、18 状态、UoW、unknown 与 retry 姿态 | Step 09～13 | intent-before-effect、CAS/read-set、probe/reconcile、完整 replay |
| Query safe view 与 no-write | Step 06/08/09/11/15 | 一个 committed snapshot 即时组装；telemetry 开关均零本仓写 |
| runtime config 读取与装配 owner | Step 14 | raw config 仅 infra；required set 冻结；不代表具体值已闭合 |
| telemetry 与 durable audit truth 分层 | Step 15 | runtime signal 非权威；durable review 复用 native record；backend 不入本仓 |
| planned test cut 分母 | Step 16 | 关键对象/入口/状态均有切口；未运行、无 evidence |
| future implementation handoff 输入 | Step 17 | 仅 boundary family 和 required reads；正式 07 才决定 phase/commit |

上述本地结论不得因外部 blocker 退化为让实现者自行选择；外部 blocker 只关闭或阻断对应 slot 的正向实现。

## 9. 关闭、回流与重校准规则

1. 当前只在本项目登记 blocker，不修改或通知 owning project；跨仓回流需用户另行授权。
2. owner 正式文档变更后，必须读取其正文及 flow/ledger，记录 exact contract、版本和目标范围；不能以口头结论关闭。
3. source 合同变化时回查 Step 06～11；配置/算法变化时回查 Step 13～16；outbound 解锁时至少回退正式 02 及 03 Step 06～16。
4. 每个 target 独立关闭：一个 SourceClass、receiver、storage action 或 schema version 的证明不能覆盖其他 target。
5. 关闭 proof 只能是正式设计合同或未来真实实施/测试证据；fake、日志、摘要、ACK、文档静态检查均不能代替。
6. 未确认期间保持 `Blocked/Unsupported/Unknown/Partial/Stale/Missing/Conflicting/CommitUnknown` 的精确姿态，不压平为 success/failure。
7. 发现字段、DTO、状态、flow、UoW 或 owner 冲突时先回源修正；正式 03 不能用“后文优先”掩盖冲突。

## 10. 正式回填草稿

正式 §17 应保留：

- 风险表，明确每项阻塞范围、缓解方式和 owner；
- 12 项持续 blocker 的待确认表，含 exact 关闭证明与 fail-closed 姿态；
- 六类本地 pending/后续前置，不把本地责任误写成上游 blocker；
- 已关闭本地设计问题不再重复开放的边界；
- 逐 target 关闭、回流与重校准规则；
- 正式 03 完成不等于 implementation start、integration ready 或测试/验收通过。

正式正文只写结论与未确认事实，不写本步诊断过程或方案比较。

## 11. 待确认事项与 Step 19 门禁

§6、§7 全部保持开放；没有生成 owner 确认、provider 选择、algorithm、config value、目标仓、baseline、test run、artifact、report、evidence、verdict、signoff 或 readiness。

| 完成条件 | 结果 |
|---|---|
| 所有 Step 01～17 未关闭项均被归档 | pass |
| blocker 分母与正式 00～02/ledger 一致 | pass：12 项，无新增/关闭 |
| 每项含影响/阻塞范围、owner、关闭证明、未确认姿态 | pass |
| local pending 与 external blocker 分离 | pass |
| 未确定内容未写成正式契约 | pass |
| 可进入 Step 19 | pass；按连续授权装配正式 03 |

本 Step 完成后仍不得修改正式 03，须先同步 flow/ledger 为 Step 18 completed、Step 19 in progress；只有 Step 19 才允许整体删除并重建 historical 正式 03。
