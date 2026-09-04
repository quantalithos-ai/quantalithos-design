# Step 13. 定义风险接受与遗留项 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填章节：`06-验收标准.md` §13 风险接受与遗留项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 风险接受与遗留项 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 9~12；`00` §15 风险 / Q-MS；`05-测试方案.md` §14；项目全局 blocker 台账 |
| 输出文件 | `design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 真实执行状态 | 未执行；没有实际风险签署、acceptor、deadline 或最终结论 |
| gate_status | `pass_with_upstream_blockers` |
| gate_reason | residual 分类、不可风险接受项、风险文件字段、owner / acceptor / trigger 和三值结论连接已固定；实际接受必须在真实验收 run 中逐项完成 |
| next_allowed_action | 进入 Step 14，定义最终结论与签署口径 |

### 1.1 Step 内计划

- [x] 读取 `00` 风险 / 待确认项、`05` residual 和 Step 12 缺陷规则。
- [x] 区分 P0 blocker、可接受 residual、future capability 和未评估项。
- [x] 固定风险接受文件的必填字段和证据要求。
- [x] 固定 VETO / S / evidence gap 不可接受边界。
- [x] 完成风险接受停审和与最终结论的冲突审计。

## 2. 本步目标

风险接受不是“把失败改成通过”，而是对不影响本轮 P0 硬门禁的已知 residual 明确承担影响、后续动作和期限。只有 `B/R`，以及经过严格限制、未命中 VETO 且不破坏 P0 truth / 安全 / 证据的 `A` 级问题，才可能进入有条件通过候选。

本步不填写真实 acceptor、日期、issue、run 或签署结果。`MSVC-UP-001~008`、真实产品 / backend、性能 authority 和外围能力均以 pending / blocked / waiting / future 记录；若某项被本轮定义为必需前置，则不能靠风险接受绕过，应转为暂停或不通过。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 风险与待确认项 | `00-需求文档.md` §15、`00_req_step_15_risks_open_questions.md` | 复用稳定风险 ID、影响和触发条件 |
| 上游 blocker | `project_execution_ledger.md` MSVC-UP-001~009 | 固定跨项目 pending 的正向限制 |
| 缺陷与放行规则 | Step 12、`05` §11 / §14 | 判断哪些缺陷可进入 residual |
| VETO 与证据门禁 | Step 10~11 | 排除不可接受项 |
| 风险文件规范 | `验收标准书写规范.md` §5.13 | 固定 risk acceptance 字段和签署边界 |

## 4. SOP 问题回答

| 问题 | 回答 | 裁决依据 |
|---|---|---|
| 哪些风险可以支持有条件通过？ | 仅不影响 P0 truth、scope、owner、安全、依赖、证据和 Query / Job no-write 的 B/R residual，或经限制且有证据的 A 级问题；必须逐项有 acceptor 和期限。 | Step 12；书写规范 §5.13 |
| 哪些风险不能接受？ | VETO-MS-001~009、S 级缺陷、forbidden body、owner 越界、required seam fail-open、second current、unknown 盲重放、Query/Job truth repair、dependency violation、证据伪造或缺证据导致的 `not_evaluable`。 | Step 11~12 |
| 每个风险的接受人是谁？ | 由职责对应的业务 / 架构 / 测试 / 实施 / 运维安全负责人逐项指定；当前只记录角色占位，不能自填姓名或默认由提交者接受。 | 书写规范 §5.13、§5.14 |
| 后续动作和截止时间是什么？ | 必须是可验证的 follow-up（合同闭合、selected-run、回写文档、补测试、运维标准或实施任务）和明确日期或触发条件；缺一不可。 | `05` §14；本步 §8.3 |
| 风险是否需要同步到实施计划？ | 需要。每个 residual 必须有 `follow_up_ref`，实施计划生成后引用 phase / boundary / issue；当前 `07` 尚未生成，先保留 placeholder。 | `07` 尚未生成；ledger |
| upstream blocker 能否直接条件放行？ | 只有在本轮范围明确排除该正向能力且 P0 安全接缝已有真实证据时，才能作为 residual；若是 P0 必需前置或证据不可裁决，则暂停 / 不通过。 | Step 4、Step 10、Step 12 |
| 未量化性能趋势能否接受？ | 无 authority 的数字不作为 P0 失败；但必须有结构性 sample。缺 sample 是 `not_evaluable`，有 sample 但未定目标可作为 R residual，需后续 workload / authority。 | Step 9 |
| acceptance 文件能否代替证据？ | 不能。`risk-acceptance.md` 只能记录责任和理由，必须引用真实 EV / report / defect；不能将 unavailable 或 not_run 改为 passed。 | Step 10 |
| 一个风险能否由多角色共同默认接受？ | 不允许“默认接受”。可有多个确认人，但必须明确唯一 account owner、每个 acceptor 的职责和签署范围。 | 书写规范 §5.13~§5.14 |
| 风险到期后如何处理？ | 到期或 trigger 触发时重开风险，重新固定基线并执行 selected/full run；不能自动延长或继续条件放行。 | `05` §14；本步 §8.4 |
| 风险接受是否代表最终签署？ | 不代表。风险接受只承担指定 residual；最终验收签署仍需按 Step 14 的结论矩阵执行。 | 书写规范 §5.14 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 `06` | 只有“待修复 / 待评审”文字，没有接受人、动作和期限。 | 固定结构化 risk acceptance 记录和三值边界。 |
| `05` residual | blocker、future 能力和一般缺陷混列，容易被一并当作条件通过。 | 分成 P0 blocker、可接受 residual、future / R，并定义 eligibility。 |
| 证据缺口 | `not_run` / `unavailable` 可能被当作可接受风险。 | 证据不可裁决不支持有条件通过，除非该范围明确不进入本轮且有交接记录。 |
| 签署边界 | 业务或技术签署可能被误读为自动接受所有风险。 | 明确 risk acceptance 与最终 signoff 分离，逐项签署。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| residual 结构 | 自由文本 | 稳定 risk ID、影响、理由、证据、owner、acceptor、deadline/trigger、follow-up | 可审计 |
| blocker 处理 | 可能直接带入通过 | 必需前置阻断；范围外或 P1/P2 才可作 residual | 防止越权放行 |
| 缺证据 | 可被解释为风险 | `not_evaluable`，不能支撑条件通过 | 证据诚实 |
| 风险签署 | 与最终结论混合 | 风险接受独立，不能覆盖 VETO/S | 责任清晰 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| `MSVC-UP` 正向 blocker 是否统一可接受？ | A. 统一可接受；B. 按本轮范围和 P0 必需性逐项判定 | 采用 B；必需 seam 不可接受，范围外正向可记录 residual。 |
| 缺 artifact / report 是否可用风险接受？ | A. 可以；B. 不可以 | 采用 B；缺证据导致 `not_evaluable`，不能条件通过。 |
| 无 authority 的性能目标是否写入接受表？ | A. 写硬阈值；B. 只写 sample / 后续触发 | 采用 B。 |
| 风险是否允许无期限？ | A. 允许；B. 必须 deadline 或 trigger | 采用 B。 |
| VETO / S 是否可由最高负责人接受？ | A. 可以；B. 不可以 | 采用 B；硬门禁不可被角色覆盖。 |

## 8. 结构化中间产物

### 8.1 风险接受资格矩阵

| 类型 | 例子 | 是否可进入有条件通过 | 必要条件 |
|---|---|---|---|
| VETO / S | VF-MS-001~009、redaction leak、owner 越界、证据伪造 | 否 | 修复、影响分析、新固定 run、完整复验 |
| P0 `not_evaluable` | 缺 raw artifact/report、未闭合必需 schema、未运行 blocking suite | 否 | 补齐基线和真实证据；不能用说明替代 |
| A（受限） | 不影响硬边界的 P0 报告细节或局部可维护性问题 | 可，逐项 | P0 主线证据完整、VETO 未命中、acceptor + deadline + follow-up |
| B | 非关键排序、诊断可读性等 | 可 | 影响可控、owner 和后续动作明确 |
| R / P1 / P2 | 真实 provider、容量、长期保留、future 能力、上游正向合同 | 可，若明确不属于本轮 P0 | 范围说明、影响、owner、acceptor、trigger；不得伪装 P0 完成 |

### 8.2 候选遗留项登记表（当前均为 pending，非已接受）

| risk_id | 遗留项 / 状态 | 影响 | 当前允许口径 | 证据 / 触发 | owner / acceptor |
|---|---|---|---|---|---|
| `R-MS-001` | Runtime entry / host session / handoff exact contract，`MSVC-UP-001` pending | Runtime 正向 session、execution handoff 不可裁决 | 只验 host-side placeholder、unknown、fail-closed；不能宣告 Runtime run truth | `EV-MS-CONSUMER-001`、`EV-MS-MATERIAL-001`（未来）；合同闭合 trigger | Runtime + member-service owner / 待填 |
| `R-MS-002` | Member launch / register / heartbeat / status exact contract，`MSVC-UP-002` waiting | 真实注册、健康、凭据联调不可裁决 | 只验 safe ref、非法 / 迟到 / 重放拒绝；正向 selected-run 后置 | `EV-MS-CONSUMER-001`、`EV-MS-DOMAIN-001`（未来） | Member + member-service owner / 待填 |
| `R-MS-003` | Images pinned manifest / verification contract，`MSVC-UP-003` blocked | 真实 qualification / readiness 不可裁决 | 只验 opaque ref、availability、no Role→image bypass | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001`（未来） | Images + member-service owner / 待填 |
| `R-MS-004` | Sandbox bind / release / cleanup contract，`MSVC-UP-004` blocked | 隔离和 external cleanup positive 不可裁决 | required binding no-fallback、local attempt / gap；不宣告 backend completion | `EV-MS-JOB-001`、`EV-MS-MATERIAL-001`（未来） | Sandbox + member-service owner / 待填 |
| `R-MS-005` | launch credential signer / revoke owner，`MSVC-UP-006` pending | credential positive qualification 不可裁决 | 只保存 opaque、实例绑定、不可复用 ref；不保存正文 | `EV-MS-REDACTION-001`、`EV-MS-CONFIG-001`（未来） | security / member owner / 待填 |
| `R-MS-006` | policy transfer owner，`MSVC-UP-005` pending | 无当前 policy 正向验收 | 不新增 policy input、allowlist 或本地裁决；正式纳入前回写 `00~04` | formal owner decision trigger | architecture / governance owner / 待填 |
| `R-MS-007` | Core / Bus event family、receipt、SDK target，`MSVC-UP-007/008` pending | route、receipt、准确 compile target 不可裁决 | topic-neutral、body-free seam；只验依赖分类 | `EV-MS-ARCH-001`、`EV-MS-MATERIAL-001`（未来） | Core/Bus/SDK owner / 待填 |
| `R-MS-008` | container runtime / orchestration / registry product semantics未锁 | 真实 backend 故障与容量不可裁决 | adapter / ref / snapshot / unknown；不固定产品或结果状态 | `EV-MS-ARCH-001`、`EV-MS-NFR-001`（future） | architecture / ops / 待填 |
| `R-MS-009` | Bus / observability / downstream receipt owner未闭合 | delivered / observed / accepted 正向证据不可裁决 | 四层独立；缺反馈保持 unknown / gap / waiting | `EV-MS-MATERIAL-001`、`EV-MS-CONSUMER-001`（future） | integration / observability owner / 待填 |
| `R-MS-010` | workload、capacity、health window、性能 authority未定 | 无硬 P95/SLA 或容量结论 | 只要求分阶段 sample；authority 后才量化 | `EV-MS-NFR-001`（future） | test / ops owner / 待填 |
| `R-MS-011` | 旧 REST/RPC/状态/产品材料污染风险 | 可能把 historical material 当 current truth | 只作污染审计；不得回流正式主链 | `EV-MS-REPORT-001`（future audit） | design owner / 待填 |
| `R-MS-012` | 非 ProjectMember 主语未来扩张风险 | 可能以 GlobalMemberRef 替代正式执行主语 | 当前项目型-only；扩展前重开 C-MS-1 与 owner contract | scope change trigger | product / architecture owner / 待填 |
| `R-MS-013` | forensic / observability 正文泄漏风险 | 外部日志、capture、evidence、report 或 secret 进入本仓 | body-free safe ref；泄漏命中 VF-MS-005，不可接受 | `EV-MS-REDACTION-001`（未来） | security / ops owner / 待填 |

### 8.3 风险接受文件必填字段

`reports/acceptance/risk-acceptance.md` 的每一条记录必须包含：

| 字段 | 必填 | 约束 |
|---|---|---|
| `risk_id` | 是 | 使用 `R-MS-*` 或缺陷稳定 ID，不得只写自由文本 |
| `scope` | 是 | P1/P2/future/operations 或 B/R/受限 A；说明是否在本轮 P0 |
| `impact` | 是 | 对本轮验收、下一阶段、上线或审计的具体影响 |
| `acceptance_reason` | 是 | 说明为何不影响 P0，不能写“后续再看” |
| `evidence_refs` | 是 | 真实 EV / report / defect；`planned`、`not_run` 不能冒充支撑证据 |
| `owner` | 是 | 后续动作责任人 |
| `acceptor` | 是 | 有权承担该范围风险的角色 / 姓名；缺失不得条件通过 |
| `deadline_or_trigger` | 是 | 日期或可判定触发条件，禁止无期限 |
| `follow_up_ref` | 是 | issue、实施计划 boundary、ADR、运维标准或下一轮验收入口 |
| `status` | 是 | `pending` / `accepted` / `expired` / `reopened`；设计期只能 `pending` |

### 8.4 风险生命周期

```text
identified -> assessed -> (not_eligible | pending_acceptance)
                              |
                              v
                          accepted
                              |
                              v
                    deadline/trigger reached
                              |
                       rebaseline + retest
                        /              \
                   closed             reopened
```

关键说明：

- `accepted` 只代表指定 residual 被指定 acceptor 接受，不代表 P0 evidence 或最终验收通过。
- `not_eligible` 包括 VETO、S、P0 `not_evaluable` 和硬边界失败；必须修复或暂停。
- 到期后必须重新基线和复验，不能自动续期。

### 8.5 不可风险接受项

以下事项不得写入有效的有条件通过依据：

- `VETO-MS-001~009` 或 `VF-MS-001~009` 任一命中。
- S 级缺陷、owner truth 越界、forbidden body / secret / endpoint / manifest 泄漏。
- required seam 缺失 / unknown 仍 Ready、Healthy、Delivered、Observed 或 Accepted。
- duplicate / concurrent / late / unknown 形成第二 current、第二 session、盲重放或历史抹写。
- Query、projection、reconciliation、handoff 或 Job 反写 Host Truth 或外部 owner truth。
- 非 Core / SDK sibling 进入源码依赖，或 runtime/event/ref/adapter 伪装 compile seam。
- evidence index、VETO checklist、report 或 acceptance 文件静态伪造 passed；缺 raw artifact/report/digest 的 `not_evaluable`。
- P0 profile unavailable、blocking suite not_run 或未复验修复被记录为通过。

### 8.6 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| residual 与 P0 范围可区分 | 通过 | 资格矩阵区分 P0 blocker、B/R、P1/P2 |
| 每项有影响、理由、owner、acceptor、期限 | 通过（规则层） | 当前姓名 / 日期仍待真实验收填写 |
| VETO / S / evidence gap 不可接受 | 通过 | 见 §8.5 |
| risk acceptance 不替代 evidence | 通过 | 必须引用真实 EV / report / defect |
| 到期 / trigger 重开 | 通过 | 见 §8.4 |
| 当前实际风险是否已接受 | 未执行 | 无真实 acceptor、签署、run 或最终结论 |

### 8.7 跨风险 / 缺陷 / VETO 审计

| 审计项 | 结论 | 后续要求 |
|---|---|---|
| VETO 被风险表覆盖 | 已禁止 | Step 14 继续检查 |
| P0 `not_evaluable` 被当 residual | 已禁止 | 必须暂停 / 补证据 |
| 同一风险多个版本丢历史 | 已禁止 | 追加 revision，不覆盖旧记录 |
| acceptor 缺失 | 已禁止 | 不得有条件通过 |
| deadline / trigger 缺失 | 已禁止 | 不得视为有效接受 |
| `MSVC-UP` 正向 blocker 伪装完成 | 已禁止 | 只保留 blocked / waiting / future |

## 9. 回填草稿

正式 §13 应列出风险接受资格矩阵和稳定 residual 表；风险接受只适用于 B/R、明确不属于本轮 P0 的 P1/P2/future 项，或不影响硬边界且有证据、acceptor、期限和后续动作的受限 A。VETO、S、P0 `not_evaluable`、redaction / dependency / evidence integrity 失败、Query/Job truth repair 和 required seam fail-open 不得风险接受。`reports/acceptance/risk-acceptance.md` 必须包含 risk_id、scope、impact、acceptance_reason、evidence_refs、owner、acceptor、deadline_or_trigger、follow_up_ref 和 status；当前所有候选均为 pending，不代表已接受。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实风险接受人名单 | 影响有条件通过 | 正式验收时按职责填写，当前不虚构姓名 |
| 每项 residual 的 issue / 实施计划引用 | 影响后续闭环 | `07-实施计划.md` 尚未生成，保留 follow_up placeholder |
| evidence retention / 运维触发 | 影响长期风险关闭 | 由运维标准和后续 selected-run 固定 |
| 受限 A 级可接受范围 | 影响放行 | 必须逐项审查，默认不接受 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| residual 分类和资格矩阵完整 | 通过 | 见 §8.1~§8.2 |
| 风险接受必填字段和生命周期完整 | 通过 | 见 §8.3~§8.4 |
| VETO / S / evidence gap 不可接受 | 通过 | 见 §8.5 |
| 当前未伪造风险签署 | 通过 | 所有候选保持 pending |
| 可进入 Step 14 | 允许 | 定义最终结论与签署口径 |
