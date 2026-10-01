# Step 15 · 风险与待确认事项

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §15「风险与待确认事项」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 15  
> 对应书写规范：`standards/document/需求文档书写规范.md` §4.15  
> 直接输入：Step 1～14 中尚未关闭的边界、依赖、规则、数据、非功能和验收问题。  
> 本步只显式保留风险与待确认事项，不补写功能、不作最终方案选择、不伪造 owner 合同或 readiness。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 · 风险与待确认事项 |
| 输出文件 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes；需求 SOP Step 15、书写规范 §4.15 与中间产物规范 |
| 已读取前序输入 | yes；Step 1～14 的来源、边界、功能、规则、数据、接口、NFR 和验收门禁 |
| 模块骨架 | done：风险表、待确认表、影响映射、当前处理口径、跨能力审计和门禁 |
| 进入条件 | `pass`；Step 14 已完成并通过门禁 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 汇总前文显式暴露的上游依赖和质量风险 | done | 见 §7.1 |
| 将风险与待确认事项拆成两张独立表 | done | 见 §7.1、§7.2 |
| 为每条风险写影响范围和当前如何约束/暂存 | done | 见 §7.1 |
| 为每条待确认事项写影响章节和当前如何挂起 | done | 见 §7.2 |
| 检查没有把 TODO、普通优化或实施方案写成风险 | done | 见 §5、§8 |
| 完成跨能力重复、遗漏和阻塞级别审计 | done | 见 §7.3、§8 |
| 形成正式回填草稿、自检和门禁 | done | 见 §9、§10、§11 |

## 3. 本步输入与分类边界

| 输入 | 本步使用方式 | 不在本步完成的事项 |
|---|---|---|
| `CHAT-UP-001~007`、`WS-UP-001~008` | 作为已知上游合同缺口，分别登记其风险影响和待确认问题。 | 不替 SDK/owner 设计 API、DTO、事件 schema 或实现。 |
| `CHAT-NF-Q-001~005` | 作为非功能 authority 和诊断/兼容矩阵的不确定性来源。 | 不补历史 P95、SLO、设备矩阵或测试阈值。 |
| `CHAT-AC-Q-001~004` | 作为验收精确面尚未闭合的确认问题。 | 不把 blocked/read-only 伪装成正向能力已完成。 |
| Step 10/11 的边界规则 | 作为风险约束和待确认挂起上限。 | 不在本步重新定义 truth owner、数据分类或规则。 |

## 4. SOP 问题回答

### 4.1 当前尚未关闭的风险是什么？

当前风险集中在：SDK typed surface 不能稳定承接 Chat 的 query/command/event/ref；Conversation 和 Workspace 的 visibility、cursor、resume、分页和 freshness 合同可能导致 N4 恢复语义漂移；Governance receipt/幂等/Decision event 未闭合可能让 GateCard 误报；Artifact safe preview/ref、跨 owner 摘要层级和 Observability handoff 仍可能把正文、权限或诊断边界推回 Chat；历史技术/指标材料可能污染正式需求；性能、SLO、辅助技术和安全诊断 authority 未确认会阻塞精确验收阈值。

### 4.2 这些风险影响哪一层需求结构？

- SDK/owner 合同风险影响 Step 6、Step 12、Step 13、Step 14 的接口、恢复、质量和验收正向条件。
- truth/visibility/cache 风险影响 Step 2、Step 10、Step 11、Step 14 的边界、数据归属和一票否决。
- 性能/SLO/兼容矩阵风险影响 Step 13、Step 14 的精确目标，但不推翻当前行为级口径。
- 历史材料污染风险影响正式 `00` §1、§5、§7、§10～§14 的来源和回填，必须在 Step 17 后置差异审计中继续隔离。

### 4.3 哪些风险当前可接受，哪些会阻塞后续推进？

行为级风险可以通过 `blocked/read-only/partial/stale/unavailable/unknown`、fail-closed、局部降级和禁止正文规则暂存，因此不阻塞 Step 16 追溯矩阵和 Step 17 正式装配。未闭合 exact owner surface、性能/SLO 数值、辅助技术矩阵和诊断 envelope 会阻塞对应正向实现/精确证据，但不允许成为伪造完成的理由；如果后续发现某项缺口会打穿 truth/权限/敏感数据/正式结果边界，则升级为项目级阻塞和一票否决。

### 4.4 当前还有哪些待确认事项？

待确认事项见 §7.2，均是会改变前文接口、质量、验收或正式装配成立条件的问题，不是普通实现 TODO。每项均保留当前挂起姿态，不在本步强行选定技术或补充 owner 结论。

## 5. 当前材料问题诊断

| 误用方式 | 问题 | 当前处理 |
|---|---|---|
| 把“SDK surface 尚未统一”写成“后续补 SDK” | 这是待确认的正式接入合同与当前风险，不是 Chat 自己的实现任务。 | 拆成 `CHAT-UP-001` 风险与对应 open question，当前维持 SDK-only 和 blocked。 |
| 把“性能还没测”写成风险 | 没有 authority、场景和测量边界时，单纯缺少测试不是需求风险。 | 只记录数值 authority/SLO 归属未确认；行为级性能口径继续成立。 |
| 把 Mobile、搜索、复杂附件列为核心风险 | 这些在 Step 7 已归为外围增强或临时方案，不决定 V1 核心闭环。 | 当前暂按外围增强/后续平台矩阵处理，不阻塞核心追溯。 |
| 把所有未来优化都塞进风险表 | 会把普通 backlog 与会破坏需求成立的风险混淆。 | 只保留影响 truth、权限、结果、恢复、安全、质量 authority 或正式装配的事项。 |
| 把待确认写成“未定” | 没有说明问题如何被暂存，也不能指导后续装配。 | 每项写明影响章节和当前状态，如 blocked/read-only、外围处理或保持待确认。 |

## 6. 设计取舍

| 主题 | 不采用的做法 | 当前取舍 |
|---|---|---|
| 风险与待确认关系 | 混在一张 TODO 表中。 | 风险描述已知暴露和当前约束；待确认描述会改变前文成立条件的问题。 |
| 上游缺口 | 在 Chat 中复制 owner 合同或先选协议。 | 保留能力级边界，缺口面保持 blocked/unknown/read-only。 |
| 数值目标 | 沿用历史首屏/P95/SLA/固定规模。 | 保留行为级验收，数值 authority 单独挂起。 |
| 外围能力 | 为补齐产品清单而提升为核心风险。 | 搜索、通知、富文本/附件、Mobile 仍是外围或临时平台选项。 |
| 正式装配 | 先把 open item 改成确定结论。 | Step 17 才做旧文档差异审计与正式装配；当前不提前关闭不确定性。 |

## 7. 结构化中间产物

### 7.1 风险清单

| 风险 | 影响范围 | 当前如何约束 / 暂存 |
|---|---|---|
| `RISK-CHAT-001` SDK typed query/command/event/ref surface 与各 owner 的公开合同可能继续漂移，导致 Chat adapter、reducer 和错误/receipt 语义无法稳定承接。 | Step 6、Step 12、Step 13、Step 14；N1～N4；`CHAT-UP-001`。 | 当前只保留能力级 seam，业务读取/变化/意图继续限定经 `L0-sdk`；exact surface 未闭合的能力维持 blocked/deferred，不建立 Chat shadow contract。 |
| `RISK-CHAT-002` Conversation visibility、cursor、分页、resume 和 change identity 若不一致，可能造成错误 scope 展示、重复/缺口、错误恢复或缓存延长可见性。 | N1、N2、N4；`F-CHAT-001~008`、`013~016`；`CHAT-UP-002`。 | 当前按 fail-closed、stale/gap/blocked/requery 约束；不从时间戳或 transport 连接猜顺序，不把未闭合实时能力写成 ready。 |
| `RISK-CHAT-003` Governance receipt、幂等、授权语境和 Decision event 若不闭合，GateCard 可能把点击、ACK 或重复请求误认为审批完成。 | N2、N3、N4；`F-CHAT-006`、`011~012`；`CHAT-UP-003`。 | 当前 GateCard 只显化语境并提供受控入口；结果只能保持 submitted/pending/unknown，未获正式 owner result 不显示 confirmed。 |
| `RISK-CHAT-004` Artifact safe preview/ref、版本和 visibility 合同若不闭合，引用可能被误读为正文、权限或版本真相。 | N2、数据归属、Step 14 一票否决；`CHAT-UP-004`。 | 当前只接受 safe ref/summary/preview metadata；contract 缺失时 unavailable，禁止从 ref 猜正文或下载未授权材料。 |
| `RISK-CHAT-005` Workspace safe view、attention、freshness、cursor 和 export 合同未闭合，可能让 Chat 重新聚合 Workspace truth 或把过期投影当当前事实。 | N1、N2、N4；`CHAT-UP-005`、`WS-UP-001~008`。 | 当前仅消费正式 safe view/export，保留 stale/partial/unavailable/blocked；不在 Chat 计算 projection、attention 或跨项目完成结论。 |
| `RISK-CHAT-006` Identity、Work、Member、Runtime 摘要层级不一致，可能把成员在场、项目进度、运行 outcome 串成同一生命周期。 | N2、数据归属、来源/审计；`CHAT-UP-006`。 | 当前按 owner 分域保存安全快照/引用，页面必须标出来源和不确定性，不跨 owner 推断生命周期或完成。 |
| `RISK-CHAT-007` Observability 的客户端诊断、低敏 correlation 和 handoff surface 未闭合，可能使 UI 日志越权成为正式观察真相或泄露 raw payload。 | N3、N4、可观测性和数据禁止正文；`CHAT-UP-007`。 | 当前只保留低敏本地诊断意图，诊断失败不改变业务结果；不直订内部 bus，不把客户端日志当 audit/evidence。 |
| `RISK-CHAT-008` 历史 README/旧 `00` 中 AG-UI、SSE/WebSocket、React/Svelte/Tauri/RN、P95/SLA/固定规模和旧对象名可能在正式装配时重新污染当前需求。 | Step 1、Step 7、Step 13、Step 14、Step 17。 | 当前全部标记为 `historical_material`；正式 `00` 只能从校准中间产物回填，Step 17 才做后置差异审计，不把候选升级为合同。 |
| `RISK-CHAT-009` 本地缓存、离线恢复和多端并行若被误当 owner truth，可能使撤销后仍可见、unknown 被误报成功或出现跨端语义漂移。 | Step 10、Step 11、Step 13、Step 14；`BR-CHAT-005`、`025~028`。 | 当前缓存只恢复展示/草稿并受版本、visibility 和 freshness 约束；跨端共享状态语义，平台 shell 不改变业务结果；无法验证时保持 stale/unknown/blocked。 |
| `RISK-CHAT-010` 性能预算、Chat SLO、辅助技术矩阵和诊断 envelope 没有正式 authority，可能使精确验收、配置和证据边界被历史数字或局部假设替代。 | Step 13、Step 14；`CHAT-NF-Q-001~004`、`CHAT-AC-Q-001~004`。 | 当前采用可判断行为底线，不写旧数字、不替 owner 承诺 SLA；精确目标、兼容矩阵和低敏 envelope 保持待确认，行为级追溯继续推进。 |

### 7.2 待确认事项

| 待确认事项 | 影响章节 | 当前如何挂起 / 当前状态 |
|---|---|---|
| `OPEN-CHAT-001` `L0-sdk` 是否能统一提供 Chat 所需的 typed query、command、event、resume、error、redaction、receipt 和 retry surface？ | Step 6、Step 12、Step 13、Step 14、Step 16；`CHAT-UP-001`。 | 当前保持 `L0-sdk` 唯一业务接入边界；exact 方法/DTO/schema 不强行定论，缺失面按 blocked/deferred 挂起。 |
| `OPEN-CHAT-002` Conversation group/channel/dm/thread 的 visibility、scope、分页、cursor、change identity 和 resume 消费合同是什么？ | Step 5、Step 7、Step 9、Step 12～14；`CHAT-UP-002`。 | 当前按 stale/gap/requery/blocked 验收，不把 transport 连接或时间戳作为顺序依据；保持待确认状态。 |
| `OPEN-CHAT-003` Governance Gate/Decision 的授权语境、receipt、幂等、结果和事件 surface 是否足以支撑受控入口？ | Step 9、Step 10、Step 12～14；`CHAT-UP-003`。 | 当前只保留 GateCard 显化与受控 intent 入口；正向 confirmed 依赖正式 owner result，未闭合时 read-only/unknown。 |
| `OPEN-CHAT-004` Artifact safe ref、preview、版本/visibility 和不可预览原因的正式 contract 是否闭合？ | Step 9、Step 11～14；`CHAT-UP-004`。 | 当前只消费 body-free ref/summary/preview metadata；contract 缺失时显示 unavailable，不推断正文或权限。 |
| `OPEN-CHAT-005` Workspace safe view/export、freshness、attention、cursor 和跨项目范围如何正式提供？ | Step 6、Step 9、Step 12～14；`CHAT-UP-005`、`WS-UP-001~008`。 | 当前不在 Chat 聚合 Workspace projection；未闭合能力按 stale/partial/blocked，保持待 owner 合同确认。 |
| `OPEN-CHAT-006` Identity/Work/Member/Runtime 的安全摘要层级、来源和生命周期边界如何对齐？ | Step 5、Step 9、Step 11～14；`CHAT-UP-006`。 | 当前按 owner 分域展示和引用，不跨域推断；在正式摘要层级确认前保持 opaque/stale/blocked。 |
| `OPEN-CHAT-007` Observability 是否提供客户端低敏错误分类、correlation/ref、handoff 和诊断失败隔离能力？ | Step 12、Step 13、Step 14；`CHAT-UP-007`。 | 当前只保留本地低敏诊断意图；不把日志、内部 bus 或 UI 状态升级为正式 audit/evidence，保持 deferred。 |
| `OPEN-CHAT-008` Chat 本地交互、safe view、事件更新、命令回查和恢复的正式性能预算与 Chat 自身 SLO 归属是什么？ | Step 13、Step 14、未来配置/测试边界；`CHAT-NF-Q-001~002`、`CHAT-AC-Q-001`。 | 当前采用不被无关 owner 阻塞、有界、局部进展和可解释失败口径；历史 `<2s`、P95、`99.9%` 和 owner SLA 不作为目标，保持数值待 authority。 |
| `OPEN-CHAT-009` V1 Desktop 及后续 Web/Mobile 的受支持 shell、浏览器、辅助技术、输入方式和核心路径矩阵是什么？ | Step 4、Step 7、Step 13、Step 14；`CHAT-NF-Q-003`、`CHAT-AC-Q-004`。 | 当前 Desktop-first；Web 保留共享 UI，Mobile 仍为临时候选；核心路径先按等价可访问语义要求，具体矩阵保持待确认。 |
| `OPEN-CHAT-010` owner safe snapshot、局部缓存、draft 和 recovery metadata 的持久化/失效上限是什么？ | Step 11～14；`CHAT-NF-Q-005`、`CHAT-AC-Q-002`。 | 当前只允许按版本、visibility、freshness 和撤销语境消费；不得从“可展示”推导为可长期保存，具体政策留待 SDK/owner/config authority。 |
| `OPEN-CHAT-011` Desktop/Web/Mobile shell 的通知、深链、存储、离线和恢复差异如何保持同一业务状态语义？ | Step 7、Step 10、Step 13、Step 14；`BR-CHAT-028`、`NFR-CHAT-011`, `018`, `024`。 | 当前 shell 只作非业务适配，缺能力时 unavailable/needs-action；不为各端新增业务 truth，保持跨端合同待确认。 |
| `OPEN-CHAT-012` 低敏诊断 envelope 是否允许关联 owner、能力、阶段和结果引用，且不泄露正文/secret？ | Step 11～14；`CHAT-NF-Q-004`、`CHAT-AC-Q-004`。 | 当前只要求最小分类/ref 和 sink 失败隔离；具体关联粒度保持 blocked/deferred，不写字段或日志方案。 |

### 7.3 风险与待确认跨能力审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否把风险和待确认事项拆成两张表？ | pass | §7.1 只写已知风险与当前约束，§7.2 只写影响前文成立的问题及挂起状态。 |
| 每条风险是否有影响范围和当前处理口径？ | pass | 没有用“后续解决”或空泛 TODO 代替当前约束。 |
| 每条待确认事项是否有影响章节和当前状态？ | pass | 每项都注明 blocked、deferred、read-only、外围处理或保持待 authority。 |
| 是否把普通功能 TODO、未来优化或技术任务写成风险？ | no | 搜索、复杂附件、Mobile 和数值补测均按外围/authority 问题挂起，不作为新增需求。 |
| 是否引入前文未确认的新功能、owner 或技术方案？ | no | 沿用已有 N1～N4、F/BR/NFR、SDK/owner blocker 和平台候选。 |
| 是否覆盖 SDK、Conversation、Governance、Artifact、Workspace、摘要层级、Observability、性能、可访问性和持久化不确定性？ | pass | `RISK-CHAT-001~010` 与 `OPEN-CHAT-001~012` 已覆盖。 |
| 是否标明哪些不阻塞行为级追溯、哪些阻塞精确正向证据？ | pass | exact surface、数值 authority、兼容矩阵和诊断 envelope 的影响已分别说明。 |

## 8. 复杂度判断

本步收纳 10 条具体风险和 12 条会影响前文成立条件的待确认事项。它们主要集中在上游合同、truth/visibility、结果/恢复、敏感数据、数值 authority 和跨端质量矩阵；没有把普通实现 backlog 扩大为需求风险。当前可以继续做 Step 16 追溯矩阵，因为风险和待确认事项已有显式挂起口径；正式 `00` 仍不得在 Step 17 前装配，也不得把 open item 改写成 readiness。

## 9. 正式文档回填草稿

正式 `00-需求文档.md` §15 可回填：

1. §7.1 的风险清单，保留影响范围和当前如何约束/暂存；
2. §7.2 的待确认事项表，保留影响章节和当前如何挂起/状态；
3. §7.3 的拆分与跨能力审计说明。

正式正文不得把风险表改写成实施计划，不得将待确认项写成已确认结论，也不得删除 `blocked/read-only/stale/unavailable/unknown` 等当前安全姿态。

## 10. Step 15 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否拆分风险与待确认事项两张表？ | pass | §7.1 与 §7.2 独立维护。 |
| 每条风险是否是具体风险句，并有影响范围与当前处理口径？ | pass | 没有把空泛复杂度或 TODO 当风险。 |
| 每条待确认事项是否会影响前文结构成立，并有影响章节与当前状态？ | pass | 均回指已存在的 owner/authority/跨端合同缺口。 |
| 是否写入最终解决方案、实现步骤或技术任务？ | no | 本步只描述当前约束、暂存和挂起，不给出 implementation plan。 |
| 是否把外围增强、数值目标或兼容矩阵误写成核心功能？ | no | 已按外围、authority 或待确认处理。 |
| 是否保留所有上游 blocker 和数据/安全红线？ | pass | `CHAT-UP-*`、`WS-UP-*` 和 Step 10/11/13/14 边界均有承接。 |
| 是否伪造合同、证据、验收、readiness、测试或 commit？ | no | 没有声明任何外部确认或执行结果。 |
| 是否发现会阻塞 Step 16 的需求级问题？ | no | 风险和 open question 已拆分并可挂起，允许进入追溯矩阵。 |

## 11. Step 15 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 风险/待确认两表、影响范围、当前处理口径、挂起状态和跨能力审计完成。 | 更新 flow 与项目台账，进入 Step 16。 |
| 文档级 | `pass_to_step_16` | 所有已知不确定性均显式收纳，没有通过脑补关闭问题，也没有新增需求。 | 创建并完成 `00_req_step_16_traceability_matrix.md`。 |
| 项目级 | `pass_with_open_contracts` | 上游 exact contract、数值 authority、兼容矩阵和诊断 envelope 仍待确认，但不阻塞追溯矩阵收敛。 | 只进入 Step 16；不得重建正式 `00` 或开始 `01`。 |

## 12. 本步结论

Step 15 已将 L5-chat 的未闭合内容拆成两类：风险表保留 SDK/owner 合同漂移、visibility/cursor/恢复、治理结果、Artifact/Workspace、摘要层级、Observability、历史污染、缓存/跨端和质量 authority 暴露，并为每项写出当前约束；待确认表保留会影响接口、非功能、验收和正式装配成立条件的问题，并明确其 blocked、deferred、read-only、外围或待 authority 状态。没有把普通 TODO 或实施方案混入风险，也没有用空泛“未定”替代挂起口径。下一步可进入 Step 16，建立以功能需求为中心的追溯矩阵。
## 13. 原型修复回写

原型审查新增风险：流程 projection 或阶段层级不一致会造成错误进度认知；群聊/项目绑定传播延迟会造成错误入口；成员目录与群聊成员混淆会造成越权暗示；Gate 与并行汇聚状态若缺少正式 owner 结果会被误解为已完成。

- 新增风险承接：`RISK-CHAT-011~012`。
- 新增待确认承接：`OPEN-CHAT-013~015`。
- 自检：风险保持 pending/blocked，不以原型静态内容关闭上游合同。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

本轮新增风险集中在流程 projection 的层级/拓扑/版本缺失、项目绑定 owner 不清和三类成员可见性混淆；对应事项保持 open、blocked 或 deferred。


### 15.1 风险

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| `RISK-CHAT-001` SDK typed query/command/event/ref surface 可能继续漂移。 | Step 6、12～14；N1～N4；`CHAT-UP-001`。 | 只保留能力级 seam；exact surface 未闭合时 blocked/deferred，不建 Chat shadow contract。 |
| `RISK-CHAT-002` Conversation visibility/cursor/resume/分页不一致可能造成错误 scope、重复/缺口或错误恢复。 | N1/N2/N4；`CHAT-UP-002`。 | fail-closed、stale/gap/blocked/requery；不从时间戳或连接猜顺序。 |
| `RISK-CHAT-003` Governance receipt/幂等/Decision event 不闭合可能误报 Gate 成功。 | N2/N3/N4；`CHAT-UP-003`。 | GateCard 只显化语境；未有 owner result 只保留 submitted/pending/unknown。 |
| `RISK-CHAT-004` Artifact safe preview/ref/visibility 不闭合可能让引用被误读为正文/权限。 | N2、数据归属、一票否决；`CHAT-UP-004`。 | 仅消费 safe ref/summary/metadata；缺 contract 时 unavailable。 |
| `RISK-CHAT-005` Workspace safe view/attention/cursor/export 不闭合可能让 Chat 形成第二聚合 truth。 | N1/N2/N4；`CHAT-UP-005`、`WS-UP-001~008`。 | 只消费正式 safe view/export；不在 Chat 计算 projection/attention。 |
| `RISK-CHAT-006` Identity/Work/Member/Runtime 摘要层级不一致可能串成同一生命周期。 | N2、数据和审计；`CHAT-UP-006`。 | 按 owner 分域展示和引用，不跨 owner 推断。 |
| `RISK-CHAT-007` Observability handoff 未闭合可能让 UI 日志越权成为正式观察真相或泄露 raw payload。 | N3/N4、可观测性和禁止正文；`CHAT-UP-007`。 | 只保留低敏本地诊断意图；不直订内部 bus。 |
| `RISK-CHAT-008` 历史 README/旧 `00` 可能重新污染当前需求。 | §1、§4、§7、§12～§16。 | 旧内容只作 historical material；正式章节只从 calibration 回填。 |
| `RISK-CHAT-009` 缓存、离线恢复和多端并行可能被误当 owner truth。 | §10、§11、§13、§14。 | 缓存受版本/visibility/freshness 约束；无法验证时 stale/unknown/blocked。 |
| `RISK-CHAT-010` 性能/SLO/辅助技术/诊断 authority 缺失可能污染精确验收。 | §13、§14；`CHAT-NF-Q-*`、`CHAT-AC-Q-*`。 | 采用行为底线，不写旧数字；精确 authority 挂起。 |
| `RISK-CHAT-011` 项目流程投影若缺少层级、边、版本或并行语义，用户可能把展示图误读为项目完成真相。 | §2、§7、§9、§12～§16；`FORMAL-002/003`。 | 只显示正式 projection；分叉、汇聚和 Governance Gate 分离；缺少投影能力时保持 unavailable/blocked。 |
| `RISK-CHAT-012` Project / Conversation 绑定和多群聊成员边界不清，可能把项目成员误当成群聊可见成员。 | §2、§5、§6、§9、§11；`FORMAL-001/004`。 | 分别消费绑定、项目成员和群聊参与者来源；不由客户端合并或推断。 |

### 15.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| `OPEN-CHAT-001` SDK 是否统一提供 typed query/command/event/resume/error/redaction/receipt/retry？ | §6、§12～§14、§16 | 保持 `L0-sdk` 唯一边界；exact 方法/DTO/schema 不强行定论，缺失面 blocked/deferred。 |
| `OPEN-CHAT-002` Conversation visibility/scope/分页/cursor/change identity/resume 合同是什么？ | §5、§7、§9、§12～§14 | 按 stale/gap/requery/blocked 验收，不以连接或时间戳代替正式顺序。 |
| `OPEN-CHAT-003` Governance 授权、receipt、幂等、Decision event 是否闭合？ | §9、§10、§12～§14 | 仅保留受控入口和 unknown/read-only；正向 confirmed 依赖 owner result。 |
| `OPEN-CHAT-004` Artifact safe ref/preview/版本/visibility contract 是否闭合？ | §9、§11～§14 | 缺 contract 时 unavailable，不推断正文或权限。 |
| `OPEN-CHAT-005` Workspace safe view/export/freshness/attention/cursor 如何正式提供？ | §6、§9、§12～§14 | 不在 Chat 聚合 projection；未闭合按 stale/partial/blocked。 |
| `OPEN-CHAT-006` Identity/Work/Member/Runtime 摘要层级、来源和生命周期如何对齐？ | §5、§9、§11～§14 | owner 分域展示；正式确认前 opaque/stale/blocked。 |
| `OPEN-CHAT-007` Observability 是否提供低敏错误、correlation/ref、handoff 和 sink 隔离？ | §12～§14 | 仅保留低敏诊断意图；不把 UI 日志升级为 audit/evidence。 |
| `OPEN-CHAT-008` 本地交互、safe view、事件、回查和恢复的性能预算与 Chat SLO 归属是什么？ | §13、§14 | 不采用历史 `<2s`、P95、`99.9%`、`500+` 或 owner SLA，保持数值待 authority。 |
| `OPEN-CHAT-009` V1 Desktop 及后续 Web/Mobile 的 shell、浏览器、辅助技术和核心路径矩阵是什么？ | §4、§7、§13、§14 | Desktop-first；先要求等价可访问语义，具体矩阵待确认。 |
| `OPEN-CHAT-010` safe snapshot、缓存、draft 和 recovery metadata 的持久化/失效上限是什么？ | §11～§14 | “可展示”不等于可长期保存；具体政策待 SDK/owner/config authority。 |
| `OPEN-CHAT-011` 各 shell 的通知、深链、存储、离线和恢复差异如何保持同一业务语义？ | §7、§10、§13、§14 | shell 只作非业务适配，缺能力时 unavailable/needs-action。 |
| `OPEN-CHAT-012` 低敏诊断 envelope 是否可安全关联 owner/能力/阶段/结果 ref？ | §11～§14 | 只要求最小分类/ref 和 sink 隔离，具体粒度 blocked/deferred。 |
| `OPEN-CHAT-013` Project 与 Conversation 的单向绑定约束、解除绑定和撤销传播由哪个正式 owner 提供？ | §2、§6、§9、§12 | 原型采用“一群聊最多一个项目、项目多个群聊”的体验假设；正式关系与撤销合同待 Work / Conversation / SDK 确认。 |
| `OPEN-CHAT-014` BPMN 节点、边、并行网关、阶段子流程和汇聚条件的正式 projection 如何版本化？ | §7、§9、§11～§14 | Chat 不生成拓扑、不计算汇聚；等待 Work / Governance / SDK contract。 |
| `OPEN-CHAT-015` 公司成员目录、项目成员和群聊成员的搜索、可见性和撤销范围如何分别定义？ | §5、§6、§9、§11～§14 | 只显示授权 safe summary；不能从空结果推断不存在或无权限。 |

这些事项不会被正式正文改写成已确认结论；它们是后续 owner/SDK 合同与质量 authority 的输入，不构成 Chat 自行扩张范围的理由。
