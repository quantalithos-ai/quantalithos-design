# Step 14. 定义风险与待确认事项

> 对应规范：`standards/document/配置设计讨论流程_SOP.md` Step 14、`standards/document/配置设计书写规范.md` §5.14、`standards/document/设计文档讨论中间产物规范.md`。
> 正式回填：`projects/L4-archive/04-配置设计.md` §14。
> 模式：`full-restart + single-agent-serial`。

## 1. Step 状态与边界

| 项 | 结论 |
|---|---|
| 当前 Step | Step 14：风险与待确认事项 |
| 状态 | `completed / pass_with_upstream_blockers / continuous_authorization`；允许进入 Step 15 装配 |
| 输入 | Step 1～13 中间产物、正式 00～03、项目台账、配置设计 SOP/书写规范 |
| 输出 | 风险表、上游 blocker 表、本地 pending 表、03 影响回写清单、Step 1～13 汇总、装配门禁 |
| 本步不做 | 不选择 provider/算法/密钥/endpoint，不创建测试或实施事实，不修改 owning project，不实现代码 |
| 完成上限 | 可以在保留 blocker 的情况下定稿正式 04；不得声明外部能力、测试、验收、恢复或 readiness 成功 |

## 2. 本步目标与 SOP 问题回答

本步把前序 Step 的未闭合问题按“持续跨仓 blocker / 本地设计 pending / future 代码契约触发器”分层，确保正式 §14 可供 05、06、07 和后续运维资料承接，而不会把未知内容写成配置契约。

| SOP 问题 | 回答 |
|---|---|
| 哪些配置问题仍可能影响落地？ | 各 L1 source/export、治理决定、完整性/兼容性、对象存储、Artifact material、observability material、workspace projection、restore receiver、SDK 依赖方向、outbound 合同仍未闭合；本地 operation/cursor codec、durable store、完整 schema/数值、telemetry binding 也未形成实施证明。 |
| 哪些事项会阻塞测试、验收、实施或运维？ | 每个 blocker 至少阻塞其对应 exact target 的正向能力；`AR-03-LOCAL-006` 直接阻塞实施开工。05/06/07/09 尚未创建或重写时，不得生成对应事实。P0 配置语义本身可在 fail-closed 上限内定稿。 |
| 谁需要确认？ | 各 L1 truth owner 确认 source/restore 合同；治理 owner 确认 retention/hold/delete/risk decision；Artifact 与 observability owner 确认材料闭包；基础设施/安全/存储 owner 确认 provider、crypto、store；全局依赖 owner 与 `L0-sdk` 确认 SDK 方向；本项目后续 04～07/实施边界确认本地 pending。 |
| 未确认前如何处理？ | exact slot 保持 `Blocked`、`Partial`、`Stale`、`Missing`、`Conflicting`、`Unknown` 或 `Unsupported`；不填默认值、不构造正向 handle、不把 fake 当真实集成、不盲重试、不把 ACK/日志/文档检查升级为成功。 |
| 哪些结论会改变 03 代码契约？ | 当前 P0 没有新增 `CoreRuntimeConfig` 字段、builder 生命周期、adapter constructor、trait/port、error、DTO、状态或 flow。若未来启用 remote/admin/hot/LKG、真实 secret provider、动态 adapter replacement、新 codec/health API 或 outbound，才会触发 03 回写。 |
| 是否已经回写 03？ | 当前没有需要立即回写的行。所有“是否影响 03=是”的行都是尚未触发的 future-only 条件，状态统一为“无回写（未来触发前暂停并回写）”；一旦条件进入实施范围，必须先回写 03 并重跑受影响 Step。 |

## 3. 前序材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 旧 README、旧 05/06 和 draft 含具体供应商、保留年限、性能数字、旧对象和成功口径 | 历史假设会伪装成默认配置或验收依据 | 继续登记为 `historical_material`，不建立 alias、不进入 schema、不关闭 blocker |
| Step 1～6 的部分 future 行曾写成“阻塞待确认” | 未来能力会错误地阻塞当前 P0 定稿，且违反装配门禁语义 | 已校正为“是（未来触发）/无回写（未来触发前暂停并回写）”；当前 P0 无待回写/阻塞待确认 |
| 外部 slot 已有 typed seam，但 owner/provider/schema 未闭合 | `ref present` 容易被误读为 capability ready | 对每个 target 保持 exact slot posture；缺合同即 blocked，不能由配置补事实 |
| workspace projection、Artifact ref、observability 摘要可被误当 canonical/body | manifest closure 和恢复材料会被夸大 | 正式 source-authority matrix 强制标注 `WorkspaceProjection/Auxiliary`、`Artifact/MaterialOrReference`、`ObservabilityMaterial` |
| P0 需要配置语义但没有产品化数值/部署事实 | 实现者可能猜测 zero、默认值、endpoint 或 provider | 配置项保留类型、必填、来源、范围/关系和失败策略；具体值、产品和部署注入留 pending |
| rollback、local commit unknown、external may-have-dispatched 语义不同 | 以配置回滚替代 probe/reconcile 会重复外部副作用 | 回滚只建立新 candidate/new assembly；历史 intent/result/binding identity 不改写 |

## 4. 持续上游 blocker（12 项）

下表中的“关闭证明”是未来允许正向启用的必要证据，不是当前已经存在的证据。各项按 exact source/target 独立关闭，不能用一个 owner 或一份 fake 结果覆盖其他项。

| ID | Owner / 待确认方 | 当前影响与 exact 阻塞范围 | 关闭证明（未来） | 未确认前 fail-closed 姿态 |
|---|---|---|---|---|
| `AR-UP-001` | 各 L1 truth owner | source snapshot/export/query 的 selector、schema、version/watermark、fence、coverage 未统一；阻塞 J02～J04、manifest source entry、source restore material | 每个 `SourceClass` 的正式 schema、authority、版本/水位、fence、coverage、错误和兼容合同，并逐 target 记录版本 | 对应 source slot `Blocked/Partial/Unknown`；不宣称跨域完整快照 |
| `AR-UP-002` | `L1-work` / 项目状态 owner | project lifecycle、archive trigger、restore handoff 未闭合；阻塞 lifecycle 解释、触发和恢复完成判定 | owner 正式定义 archived/dissolved/restored 的状态、触发/撤销、适用版本和 handoff 反馈 | Archive 不决定、不发布、不反写项目状态；缺失即 `Blocked` |
| `AR-UP-003` | `L1-governance` 或明确治理 owner | RetentionPolicy、legal hold、删除授权、风险接受和优先级未闭合；阻塞 cleanup/purge/delete/lifecycle execution | versioned decision/ref、scope、validity、hold precedence、delete/risk authority、执行反馈和冲突语义 | decision 缺失/过期/冲突/hold→`Blocked`；不清理、不删除、不推导保留期 |
| `AR-UP-004` | 安全、schema、基础设施正式 owner | digest、签名、加密、压缩、密钥和 schema evolution authority 未确定；阻塞 seal/verify/compatibility 和长期读取 | approved algorithm/capability/version/key ref、sign/verify/encrypt/compress/schema 兼容与失败合同 | `Unknown/Unsupported/Blocked/IntegrityFailed`；不生成或声称 digest/signature/Verified |
| `AR-UP-005` | 存储/基础设施 owner | 对象存储位置、冷热层级、迁移、取回、commit/probe 语义未确定；阻塞 placement/retrieve/tier/lifecycle | location/tier、effect correlation、commit/probe/retrieve/transition、timeout/unknown 语义 | intent-before-effect；ACK 不等 commit，unknown 只 probe/reconcile |
| `AR-UP-006` | `L1-artifact` | Artifact 正文、ref、版本、血缘和 archive 内容闭包/恢复边界未闭合；阻塞 material closure、manifest 和 restore material | owner-approved body/ref/lineage schema、closure/version/compatibility、export/import 与缺口反馈 | 只保存批准的 material/ref；ref 集合不等正文/血缘闭包 |
| `AR-UP-007` | `L4-observability` | audit/evidence material、redaction、coverage、verification、保留和交接未闭合；阻塞正向审计材料 handoff | safe material/ref schema、redaction basis、coverage/verification、retention 与 handoff contract | 仅保留本仓 native record/runtime telemetry；不建 backend、不称 evidence complete |
| `AR-UP-008` | `L1-workspace` | workspace archive read/export contract、projection version/generation/coverage 未闭合；阻塞辅助投影输入 | 明确 read/export schema、projection revision、visibility、coverage 以及 Auxiliary 标记 | slot `Blocked/Unavailable`；不得补任何 L1 canonical gap |
| `AR-UP-009` | 各 owning domain / restore receiver | receiver resolve/import/restore/command/handoff、partial/stale/missing/conflicting/unsupported/integrity-failed/commit-unknown/compensation 反馈未闭合；阻塞 per-owner restore | 每个 owner 的 receiver schema/version、effect key、提交/探测/补偿和结果枚举 | per-owner `Blocked/Partial/Unknown`；Bundle 不直接写 owner DB，不 all-owner fallback |
| `AR-ARCH-001` | 全局依赖标准 owner + `L0-sdk` | 全局矩阵列 SDK compile dependency，但 Archive 服务端边界将 SDK 视为下游/runtime adapter，存在反向依赖或循环风险 | 权威矩阵修正或可证明无环的 exact dependency graph、consumer direction 和版本合同 | Archive server 不引入 SDK compile dependency；仅保留 runtime/ref/adapter 下游关系 |
| `AR-HLD-Q-001` | Archive 架构 + `L0-bus`/consumer owners | outbound event family、outbox、publisher/topic、delivery 和 committed-fact 必要性未核验；阻塞所有 outbound 正向面 | 必要性、event schema/version、owner、UoW/outbox、delivery/replay/consumer 合同 | 不创建 outbound key、slot、topic、publisher、outbox 或 delivery evidence；若解锁须回退 02/03 |
| `AR-HLD-Q-002` | workload/environment/test authority | Bundle 规模、吞吐、page/batch/lease/retry、容量、RTO/RPO 和验收阈值无正式 authority；阻塞数值 baseline 和性能/恢复声明 | 可追溯 workload profile、Bundle distribution、环境、测量法、目标阈值及 owner | 只定义 typed positive bounds 和关系校验，不填数字、不截断 Complete、不宣称达标 |

## 5. 本地 pending（6 项）

| ID | Owner / 关闭材料 | 当前影响与 exact 阻塞范围 | 未确认前处理 |
|---|---|---|---|
| `AR-03-LOCAL-001` | Archive 配置/安全/协议 owner；正式 04 codec/hash binding、05 parity/restart 测试 | operation key namespace、canonical input digest 的跨实现稳定性；阻塞非 Query durable reservation、same/same 与 same/different 判定 | 仅保存 opaque binding ref；mutation reserve `Blocked`；不借 Bundle integrity digest、不由 fake 私定算法 |
| `AR-03-LOCAL-002` | Archive query/store/security owner；正式 04 cursor 选择与 05 安全/重启切口 | public cursor 与 repository cursor mapping、selector/snapshot/order/visibility 绑定；阻塞五类 Query continuation | continuation `Blocked/Stale/NotAvailable`；不回传 private cursor，不临时 base64/JSON 映射 |
| `AR-03-LOCAL-003` | Archive infra/实施 owner；04 binding、05/06 contract/failure、实施期真实 adapter proof | durable store、UoW、CAS、range/negative read-set、probe、claim fence、restart parity；阻塞 production local persistence | store slot `Blocked`；fake 只证明语义，不证明 durability 或重启事实 |
| `AR-03-LOCAL-004` | Archive 配置 owner + workload/environment authority；正式 04 完整 schema/数值闭环 | provider refs、page/batch/lease/timeout/retry/probe/retention、secret binding 的完整必填与关系；阻塞 production assembly/job | 无隐式默认；缺 required ref/value 不暴露 capability；不隐式 retry/cleanup |
| `AR-03-LOCAL-005` | Archive 04/05 与运维 owner；safe sink/material binding、redaction operational checks | telemetry sink/runtime binding、采样和脱敏运维接入；阻塞 production telemetry integration 与 evidence handoff | safe signal contract 可保留；sink failure 只 degraded/drop；不称 backend/evidence ready |
| `AR-03-LOCAL-006` | 项目负责人、后续文档维护者、用户实施授权 | 正式 04～07、implementation ledger、planned boundary skeleton、目标实现仓和实施开工事实尚未形成；阻塞整体 implementation start | 当前只完成设计；05/06/07 继续按用户授权逐文档停审；不创建代码/仓/ledger/skeleton，不生成 run/baseline/readiness |

## 6. Step 1～13 对 03 的影响汇总

| 来源 Step | “是否影响 03=是”的结论 | 当前 P0 收口 | 处理状态 |
|---|---|---|---|
| Step 1 | 未来新增 `CoreRuntimeConfig` 字段、builder 生命周期、adapter constructor、port、error、DTO 或 flow | 当前只承接 03 §13/Step 14/15；没有新增代码契约 | 无回写（未来触发前暂停并回写） |
| Step 2 | 未来范围扩展要求新增 runtime field、constructor、port、error、DTO 或 flow | P0/P1/P2 仅做配置语义分层；future 能力不进入当前 schema | 无回写（未来触发前暂停并回写） |
| Step 3 | 未来控制面新增 config field/builder/adapter/port/error/DTO/flow | 12 个控制域只重组既有 binding/slot；不增加接口 | 无回写（未来触发前暂停并回写） |
| Step 4 | 未来引入 hot reload、dynamic replacement、source/admin actor 或 bypass | P0 永久禁止这些绕过；若进入路线先重开 03/04 | 无回写（未来触发前暂停并回写） |
| Step 5 | 未来新增 source、admin actor、config center、builder reload 或新错误/DTO | 来源固定为 code declaration < one strict JSON < allow-listed ENV；remote/admin unsupported | 无回写（未来触发前暂停并回写） |
| Step 6 | 未来 dynamic adapter replacement、secret provider API、profile-specific constructor/port/error/DTO/flow | profile 只改变装配/测试姿态，不改变代码图或 required set | 无回写（未来触发前暂停并回写） |
| Step 7 | 未来真实 provider、产品 DSN schema、dynamic replacement 或新 adapter constructor | P0 只列 typed ref、required、range/关系和失败策略；不列产品字段 | 无回写（未来触发前暂停并回写） |
| Step 8 | 未来真实 secret provider、rotation API、hot reload 或 credential schema | P0 只接受 opaque ref；secret resolver 不进入普通覆盖链 | 无回写（未来触发前暂停并回写） |
| Step 9 | 未来 reload/LKG、provider resolution、product-specific constructor 或 config center | P0 仅 startup/new assembly、job-run-start、entry-local、test harness | 无回写（未来触发前暂停并回写） |
| Step 10 | 未来 remote/admin/hot/LKG/rotation API 或新增 durable audit object | rollback 只建新 assembly；不扩充 03 审计对象或 outbox | 无回写（未来触发前暂停并回写） |
| Step 11 | 未来自动修复、health API、新 retry state 或降级 facade | 高风险仍 fail-fast/fail-closed；telemetry 是唯一可 drop 的 P0 类别 | 无回写（未来触发前暂停并回写） |
| Step 12 | 下游若要求新 field/port/error/DTO/flow、hot reload 或 durable audit object | 05/06/07/09 只能承接正式 04，不得反定义契约 | 无回写（未来触发前暂停并回写） |
| Step 13 | future config center、admin、hot/LKG、secret health、codec evolution 改变代码合同 | 当前仅保留演进候选和重开门禁；没有迁移 alias | 无回写（未来触发前暂停并回写） |

### 6.1 当前回写门禁结论

- 当前 P0 不存在 `待回写`。
- 当前 P0 不存在 `阻塞待确认`。
- 上表的 `是（未来触发）` 只表示触发条件，不表示当前配置结论已经改变 03。
- 未来触发时必须暂停实施/装配，回写正式 `03-详细设计.md` 及对应 Step，重新通过本配置流程；不能由 05、06、07、09 或实现者自行补充。

## 7. 未确认事项与保守处理

| 事项 | 当前影响 | 需要谁确认 / 关闭入口 | 未确认前处理 |
|---|---|---|---|
| source/export、owner version/fence/coverage | 阻塞对应 source/manifest/restore 正向输入 | 各 L1 owner 当前正式合同与台账 | exact source blocked；workspace 不 fallback |
| governance decision、retention、hold、delete/risk | 阻塞 lifecycle/cleanup/purge | governance owner 正式 decision contract | 不配置 policy、不执行动作 |
| integrity/signature/key/compression/schema | 阻塞 seal/verify/compatibility | 安全/schema/infrastructure authority | Unknown/Unsupported；不生成 digest/signature |
| storage location/tier/commit/probe | 阻塞 placement/retrieve/lifecycle | storage owner 正式 adapter contract | intent-only；unknown 只 reconcile |
| Artifact body/ref/lineage closure | 阻塞 Bundle content closure/restore material | `L1-artifact` 正式 material contract | ref 不等正文；缺项可见 |
| observability material/redaction handoff | 阻塞正向 audit/evidence export | `L4-observability` 正式 seam | native record/runtime signal only |
| workspace projection export | 仅阻塞 Auxiliary 输入 | `L1-workspace` WS-UP-006 及相关合同 | Auxiliary/Unavailable；不补 canonical |
| per-owner restore receiver | 阻塞 selected restore item | 各 owner receiver contract | item blocked/partial/unknown |
| operation codec/cursor mapping/store | 阻塞本地 durable mutation/continuation | `AR-03-LOCAL-001~003` 对应正式 04/05/实施证明 | fail-closed；fake 不等 production |
| 完整 config schema、provider ref、预算数值 | 阻塞 assembly/job 的实际装配 | 正式 04、workload/environment authority | required-without-default；不猜数值 |
| telemetry runtime binding | 阻塞生产观测接入 | 正式 04/05 与运维 owner | safe signal 可丢弃，不称 evidence |
| 05/06/07 和实施启动 | 阻塞下游闭环与开工 | 用户逐文档明确授权及各自停审 | 继续留在设计台账，不创建事实 |

## 8. 关闭、回流与证据规则

1. blocker 关闭必须记录 exact owner 文档、章节、symbol/schema/version、适用 source/target 和失败语义；口头确认、文件存在、ACK、fake、日志或静态检查都不足以关闭。
2. source/receiver 合同变化时回查 03 Step 06～12；配置、算法、codec、store 或预算变化时回查 03 Step 13～16 及本 04 Step 5～11；outbound 解锁至少回退 02 与 03 的对象、协议、UoW、错误和测试切口。
3. 任何外部正向能力尚未有 closure proof 时，formal 04 只能写 ref、条件、blocked/unknown/unsupported 和失败姿态，不能写 vendor、算法、密钥、成功 digest、恢复成功、readiness 或 signoff。
4. 旧 operation/effect/plan、Bundle/manifest、governance decision、owner history 和审计材料必须按已固定 identity/版本解释；新配置不能重写历史。

## 9. 正式 §14 回填草稿

正式文档只回填：持续 blocker 的 exact 阻塞面、负责人和未确认前姿态；六项本地 pending；Step 1～13 的 03 影响收口；当前无待回写/阻塞待确认的门禁说明。问题回答、历史差异诊断和本节取舍保留在本中间产物。

## 10. 跨风险审计与进入 Step 15 条件

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 12 项上游 blocker 是否逐项登记 | 通过 | `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 均有 exact scope/owner/posture |
| 6 项本地 pending 是否与上游 blocker 分离 | 通过 | `AR-03-LOCAL-001~006` 单列，不扩充跨仓分母 |
| Step 1～13 所有“是否影响 03=是”是否覆盖 | 通过 | §6 逐 Step 汇总，future-only 统一收口 |
| 当前是否存在待回写 | 否 | 当前 P0 无新增代码契约 |
| 当前是否存在阻塞待确认 | 否 | 未确认只阻塞未来 exact positive capability，不阻塞 P0 文档定稿 |
| 是否把未确认内容写成正式配置契约 | 否 | 正式 04 只写 typed ref、条件、失败姿态和 future gate |
| 是否伪造外部成功、测试、验收或 readiness | 否 | 全部保持 pending/planned/blocked/waiting |
| 是否可进入 Step 15 | 是 | Step 1～13 已停审；跨域审计无 unresolved 配置冲突；正式装配仍需 Step 15 自检 |

## 11. Step 14 进入下一步条件

- [x] 风险、待确认和处理方式已完整记录。
- [x] 12 项持续 blocker 与 6 项本地 pending 有 owner、exact 阻塞范围、关闭证明和 fail-closed 姿态。
- [x] Step 1～13 的 03 影响判定已汇总；当前无 `待回写` 或 `阻塞待确认`。
- [x] 正式 §14 回填边界已确定，不会把过程诊断写入正文。
- [x] 允许进入 Step 15 正式文档装配。
