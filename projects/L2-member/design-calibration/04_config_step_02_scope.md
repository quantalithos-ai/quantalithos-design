# L2-member 04 配置设计 Step 2：明确目标、范围与非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.2
> 回填位置：正式 `04-配置设计.md` §2「本次配置设计目标与范围」
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_02_scope.md`；只借鉴 Step 状态、P0/P1/P2、范围表、回写判定与停审格式，不继承其 outbox、publisher、GRC、产品或事实。
> 创建日期：2026-09-03
> 执行模式：`full-restart + single-agent-serial`
> 当前状态：`completed / pass_with_explicit_blockers / stop_review`；本文件完成后立即停审，未经用户明确确认不得创建 Step 3 或正式 `04-配置设计.md`。

## 1. Step 开工确认与 Step 内计划

| 门禁层级 | 检查 | 结论 |
|---|---|---|
| 项目级 | 已先读取 `project_execution_ledger.md`；用户最新“继续”解除 Step 1 停审，仅授权进入 Step 2。 | `pass` |
| 文档级 | 已读取 `04_config_calibration_flow.md` 与已完成的 Step 1；当前只允许创建 Step 2。 | `pass` |
| Step 级 | 已复核配置 SOP / 书写规范、当前正式 `00~03`、03 §13 / Step 14、相关风险与测试切口，以及 `L1-governance` Step 2 的结构粒度。 | `pass` |
| 禁止动作 | 不定义 key、默认值、来源优先级、profile 名、JSON、secret、产品、endpoint、route、topic、物理 Store、部署命令、实现、测试或 readiness。 | `active` |

| 小阶段 | 可审查产物 | 状态 | 当前门禁 |
|---|---|---|---|
| 1. 输入复核 | §2～§3 | completed | 只承接已存在的 logical binding 与不变量 |
| 2. P0/P1/P2 收敛 | §4、§8.3 | completed | P0 不等于生产集成或 implementation readiness |
| 3. 范围与非范围收口 | §5～§8.6 | completed | 每个非范围均有去向 |
| 4. 03 影响判定 | §9 | completed | 当前结论不新增 code contract |
| 5. 回填草稿与停审 | §10～§12 | completed | 等待用户明确确认后才可进入 Step 3 |

## 2. 本步目标、输入与输出

### 2.1 本步目标

定义本轮 `04-配置设计.md` 要覆盖的 member-local configuration control plane，划分 P0 / P1 / P2，并把不属于配置设计、尚不能由配置闭合和应交给后续文档的事项明确分流。

这里的优先级是**配置设计收敛优先级**：P0 表示必须先定义才能完成 local composition 与 fail-closed 主链的配置语义；它不是生产部署承诺、外部集成成功、实现完成或 readiness 分级。

### 2.2 本步输入

| 输入 | 当前效力 | 本步用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成的前序 Step | 复用候选配置域、历史污染边界、blocker 与 03 回写门禁。 |
| 当前正式 `00~02` | formal authority | 承接 member-local 职责、双锚、body-free、CP01～CP07、可裁剪 outlet 与不可配置化红线。 |
| 当前正式 `03` §13～§17 | direct formal input | 承接唯一 raw-read / builder、logical Store / adapter / boundary / registry binding、planned verification cut 与风险。 |
| `03_ddd_step_14_configuration_external_bindings.md` | direct calibration input | 复核 validated ref、mandatory local slot、blocked seam、Core-only compile 与 zero-event-config 约束。 |
| 当前上游 / sibling 台账 | pending owner input | 保留 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 的范围影响，不补合同。 |
| 旧 README、旧 `05/06`、`draft/` | historical / discussion input | 只审计范围膨胀与旧产品、协议、指标污染；不形成 P0/P1/P2 事实。 |

### 2.3 本步输出

- 配置设计目标、覆盖范围与非范围表。
- P0 / P1 / P2 的设计优先级口径和无配置路径判定。
- 外部 blocked seam、物理产品、下游文档与实施动作的分流边界。
- 对 `03-详细设计.md` 的影响判定、正式 §2 回填草稿和 Step 3 门禁。

## 3. 本步执行边界

本 Step 将已有 logical configuration binding 分级，不把它们变成具体字段或 external contract。特别是：

- P0 可定义 local Store、technical slot、entry / read / Consumer / Job、projection、resolver / handoff 的**配置语义范围**，但不选择实现、文件、值、来源或产品；
- external slot 的 P0 含义仅是可表达 `Blocked`、`Waiting`、`Unknown` 或 `NotAvailable` 的保守装配姿态，不是 host、Runtime、image、Bus、owner 或 downstream 已可用；
- `L2M-UP-005` 前的 24 个 semantic outbound event candidate 本轮为 zero configuration，不能借 P1 或 P2 预设 publisher、outbox、topic、route、retry、DLQ 或 delivery；
- non-project execution subject、双锚、truth owner、body-free、screening owner、状态迁移、Query no-write、UoW / CAS、typed replay、Unknown fence 与 dependency 分类不是 P2 扩展，均为禁止配置化不变量。

## 4. SOP 五问回答

| SOP 问题 | Step 2 收敛回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链？ | P0 必须先定义 profile / provenance 与唯一 loader / builder 的控制面；local write/read 主链所需的 logical Store、UoW、idempotency / typed-result、Clock / ID / digest availability；Command / Query、Consumer、Job、projection / summary 与 logical registry 的已校验 posture；以及 owner-specific resolver、host / Runtime / publication / observation handoff 在合同未闭合时的 blocked-aware availability。它们只支撑 member-local composition、safe read surface、local attempt / gap 与 fail-closed，绝不表示 external positive activation。 |
| 哪些配置属于 P1 / P2 或后续扩展？ | P1 是在现有语义不变前提下，待产品 authority 与 owner contract 出现后才可收敛的 durable Store / adapter realization、contracted external slot activation、optional capability outlet source activation、integration-like profile 和已证明安全的运行参数细化。P2 是多区域 / 多租户以外的环境扩展、backend-specific tuning、动态控制面与容量 / SLO 细化等未来演进；它们不得改变项目型双锚，也不能用配置引入第三种执行主语。 |
| 哪些配置细节应留给部署与运维手册？ | 配置文件或 secret 的具体挂载、provider 操作、证书与密钥轮换执行、实例与容器拓扑、真实 endpoint 填写、发布命令、告警面板、值班和故障处置属于部署与运维材料。04 只定义配置语义、来源规则、校验、生效、审计和失效口径。 |
| 哪些配置细节应留给实施计划？ | config loader / builder、logical slot、fake、物理 adapter 的实现顺序；选择 authority 后的迁移批次；测试 / 验收门禁嵌入；变更、回滚和提交边界，均留给未来 `07-实施计划.md`。本 Step 不创建 implementation ledger、代码、commit 或排期。 |
| 哪些非范围仍有残余风险？ | external exact contract、physical Store / UoW / scheduler / secret / observability product、`L2M-DDD-001~007` 与 `scope_supersede_gap` 仍阻塞相应正向激活或实现；旧 `05/06` 尚未重建，无法给出环境、证据或验收结论；若后续配置语义要求新增 typed carrier、builder / adapter constructor、Port、error、DTO 或 flow，必须先回开 03。 |

## 5. 当前文档与输入诊断

| 位置 / 材料 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 候选域 | 只说明可进入 04 的逻辑类别，尚未区分主链、条件能力与未来演进。 | 按 local P0、contract-gated P1、演进性 P2 分层。 |
| `03` §13 / Step 14 | 已有 binding、blocked seam 与 fake posture，但没有配置设计优先级和非范围去向。 | 保留既有 binding，不增加任何 config carrier；为后续控制面 Step 预留分级输入。 |
| `00~02` | 已固定 member responsibilities 和可裁剪 outlet，却不能由配置重写 owner / invariant。 | 将 summary 的安全展示姿态纳入 P0，optional outlet 的正向激活列为条件性 P1。 |
| 旧 README、旧 `05/06` | 含 transport、DB、endpoint、CI、指标、evidence 与部署假设，易被误当“最低可运行配置”。 | 不进入任何优先级；仅作为 historical pollution 风险。 |
| 正式 `04` | 尚未创建。 | 只形成 Step 2 回填草稿；正式正文仍后置至 Step 15。 |

## 6. 改动前后与设计取舍

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 无配置判断 | Step 1 已识别多个 binding，但尚未给出范围裁决。 | 明确本仓不是无配置项目。 | local composition、availability 与 safe posture 需要可审查的控制面。 |
| P0 含义 | 容易被误读为最低生产部署或所有外部接缝已可调用。 | P0 限定为 local composition + fail-closed 主链语义。 | 保护 external owner 与 blocked seam。 |
| optional outlet | 容易与摘要、registry 或 invocation readiness 混写。 | 安全展示 posture 为 P0；source-driven active outlet 只在条件满足后归 P1。 | `available` 不能升格为 registry、authorization 或 execution。 |
| outbound event | 易被历史 publisher / topic 设想带入优先级。 | 24 candidate 一律 zero configuration。 | `L2M-UP-005` 前不存在可物化 event contract。 |
| 物理与运维细节 | 容易借配置设计提前锁定产品或部署。 | 分流至 owner / ADR、07 或部署运维材料。 | 当前 authority 未选择产品，也没有执行事实。 |

## 7. 配置设计取舍

| 议题 | 备选方案 | 结论 |
|---|---|---|
| 是否走无配置路径 | A. 因 external seam 未闭合而判定无配置；B. 承认 member-local control plane。 | 采用 B；03 已明确 raw-read、builder 与多类 logical binding。 |
| P0 范围 | A. 纳入真实 host / Runtime / Bus 正向配置；B. 仅纳入 local binding 与 conservative posture。 | 采用 B；正向合同仍由上游 owner 持有。 |
| 物理 Store / adapter | A. 在 P0 锁定产品；B. 先保留 product-neutral logical section。 | 采用 B；P1 仅在 authority 到位后再收敛。 |
| capability outlet | A. 作为核心 write-path 前置；B. 保留安全展示 / 裁剪姿态，正向 source activation 条件化。 | 采用 B；不让 outlet 反向阻塞 CP01～CP05。 |
| non-project subject | A. 作为 P2 profile 开关；B. 继续 fail-closed。 | 采用 B；这需要需求 / 架构与 owner contract 回开，不是配置扩展。 |
| 24 event candidate | A. 预留 P1 publisher 配置；B. 维持 zero configuration。 | 采用 B；不得绕过 `L2M-UP-005`。 |

## 8. 结构化中间产物

### 8.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 收稳 member-local control plane | 将 03 已有 binding 组织为可审查配置域，而不新建 code contract。 | Step 3 控制面 / 配置域输入。 |
| 固定 P0 安全主链 | 明确 local composition、mandatory availability 与 conservative external posture 的最小范围。 | Step 4～11 的配置边界、校验与失效输入。 |
| 延后条件能力 | 把 product、正向 external activation、optional outlet 与运维优化从 P0 移出。 | Step 6、13、14 的 profile、演进与风险输入。 |
| 保持不可配置化红线 | 防止配置绕过 dual anchor、owner、body-free、no-write、replay、CAS、Unknown 或 event blocker。 | Step 4 禁止项与 05 / 06 negative gate 输入。 |
| 分流下游工作 | 让测试、验收、实施与运维各接收自己的配置输入，而非把它们混进 04。 | Step 12 与未来 05 / 06 / 07 / 运维材料。 |

### 8.2 本轮覆盖范围表

| 范围 | 本轮必须收敛的配置语义 | 优先级 / 后续 Step |
|---|---|---|
| composition / provenance | profile 选择语义、来源可解释性、唯一 raw-read 与 builder 边界。 | P0；Step 3、5、6、9、10 |
| local consistency slots | CP01～CP07 logical Store、UoW、idempotency / typed-result、Clock / ID / digest 的 mandatory / unavailable posture。 | P0；Step 3、4、7、9、11 |
| entry and read posture | Command / Query boundary、Consumer dedup、projection freshness、summary visibility、logical API / worker / Job registry。 | P0；Step 3～7、9、11 |
| continuation posture | Job batch / retry category、attempt / gap continuation 与 unknown fence 的配置边界。 | P0 只收敛语义；Step 4、7、9、11 |
| owner seam posture | resolver、host、Runtime、publication / observation handoff 与 image availability 的 blocked-aware slot。 | P0 仅保守装配；P1 才可能条件化正向绑定；Step 3、7、8、11、14 |
| derived display | summary projection 的安全展示；capability outlet 的 disabled / stale / not-available posture。 | summary P0；outlet active source P1；Step 3、4、6、7、9、11 |
| security / diagnostics | config provenance、redacted issue、sensitive-class boundary、safe diagnostic surface。 | P0；Step 4、8～10、12 |
| downstream handoff | 测试 / 验收 / 实施 / 运维可引用的矩阵、门禁和分流。 | P0 设计交付；Step 12～14 |

### 8.3 P0 / P1 / P2 配置口径

| 等级 | 纳入标准 | 本仓范围 | 当前限制 |
|---|---|---|---|
| P0 | 不定义就无法说明 local composition、mandatory local lane 或 fail-closed safe surface。 | provenance、local Store / UoW / replay、technical slot、boundary / Consumer / Job / projection / registry posture、redacted diagnostics、external slot 的 blocked-aware availability。 | 不给具体 key、值、来源、产品或 external positive outcome；`Ready` 只表示 local composition。 |
| P1 | 已有逻辑 seam，但须等产品 authority、字段级 owner contract 或安全前置条件才能细化。 | durable / real-like realization、contracted host / Runtime / image / resolver / handoff binding、optional outlet source activation、integration-like profile、经验证的运行参数细化。 | 当前只记录条件与风险；不得构造 endpoint、credential、schema、route、publisher 或 success。 |
| P2 | 仅在不改变已定 owner / invariant 的未来规模化或控制面演进中才可能讨论。 | multi-region、backend-specific tuning、动态控制面、容量 / SLO / 运维细粒度和更复杂的环境差异。 | 不预设产品或 timeline；non-project subject、policy override、body-free 放宽和 event candidate activation永远不是 P2。 |

### 8.4 非范围与去向表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、业务规则、成员 owner、dual anchor、body-free、screening 判定、状态 / transaction / replay 不变量 | 当前正式 `00~03`；若需变化，按受控回开处理。 |
| 新增或改名 config carrier、runtime builder / adapter constructor、Port、DTO、error、function flow | `03-详细设计.md` 与 owning calibration Step，先回写再继续 04。 |
| host IPC / credential、Runtime entry / handoff、image release、Core / Bus member event schema / route、owner source taxonomy | 对应上游 / sibling formal contract；未闭合前保持 blocker。 |
| 具体 key、默认值、来源优先级、JSON、环境矩阵、secret 分类、加载校验、变更和失效细节 | 本文档后续 Step 3～11；本 Step 不提前定义。 |
| DB / broker / scheduler / transport / secret / observability backend 产品、成本与容量决策 | ADR / 技术 authority、未来 `07-实施计划.md` 与部署运维材料。 |
| 挂载、实例拓扑、真实 endpoint、证书安装、发布命令、告警、值班和 runbook | 部署与运维材料。 |
| 测试数据、脚本、执行、report / artifact / evidence | 未来 `05-测试方案.md`；当前只能提供 planned input。 |
| 验收 verdict、signoff、readiness | 未来 `06-验收标准.md`，且须来自真实执行。 |
| 实现顺序、phase / commit boundary、实际迁移或回滚执行 | 未来 `07-实施计划.md`；本 Step 不生成 implementation fact。 |

### 8.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否已有唯一 raw configuration 读取 / 校验边界 | 是 | 03 §13 已限定 `infra/config.rs`。 |
| 是否已有唯一 composition root 与 logical binding | 是 | 03 §13 已限定 `infra/runtime_builder.rs`、Store / adapter / boundary / registry refs。 |
| 是否需要 local slot / availability / safe posture 语义 | 是 | local truth、Query、projection、Consumer、Job 与 blocked seam 都必须可判别。 |
| external contract 未闭合能否使本仓变为无配置 | 否 | 它只限制 positive activation，不消除 member-local configuration control plane。 |
| 是否可走无配置说明文档路径 | 否 | 后续 Step 3～14 均适用；正式 04 需完整配置设计而非空说明。 |

### 8.6 非范围残余风险表

| 风险 | 影响 | 当前处理 |
|---|---|---|
| `L2M-UP-001~004/006~008` exact contract 未闭合 | external slot 只能被保守装配，不能定义 positive configuration。 | P0 保留 blocked-aware posture；P1 等 owner contract。 |
| `L2M-UP-005` 未闭合 | 24 candidate 不能形成任何 event / publisher 配置。 | zero configuration；待 Core / Bus authority 后 targeted reopen。 |
| physical Store / UoW / scheduler / secret / backend 未选 | 影响 P1 字段、来源、敏感分类与 failure semantics。 | 保持 product-neutral；不拿 fake 或 local `Ready` 伪补。 |
| `L2M-DDD-001~007`、`scope_supersede_gap` | 影响受影响 lane 的 activation、test cut 与 implementation path。 | 继续 blocked / waiting；不由 config default 覆盖。 |
| 旧材料或 P1/P2 过早回流 P0 | 可能引入 route、产品、指标、persona 或伪成功。 | 后续每 Step 做 historical / scope audit。 |
| 具体项引发代码契约变化 | 可能破坏 03 可落码性。 | 停止相关收敛，先回开 03。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 本仓不是无配置项目；P0 是 local composition 与 fail-closed 主链语义 | 否 | 对既有 §13 binding 的范围分层 | 不适用 | 无回写 |
| P0 / P1 / P2 不选择具体 product、key、source、value 或 external positive activation | 否 | 配置设计范围控制 | 不适用 | 无回写 |
| 24 candidate 保持 zero configuration | 否 | 承接既有 `Blocked(L2M-UP-005)` | 03 §7 / §13 | 无回写 |
| non-project subject 不属于 P2，保持 fail-closed | 否 | 承接双锚与 subject boundary | 03 §3 / §6 / §13 | 无回写 |
| 后续某配置项要求新增 / 改名 carrier、builder / constructor、Port、DTO、error 或 flow | 是 | 代码契约变化 | 03 §4～§13 与对应 owning Step | 已回写（03 已有回开规则；future trigger 当前未触发） |

本 Step 没有产生当前 `待回写` 或当前 `阻塞待确认` 的 03 修改项；最后一行仅是未来触发器。若触发，不能继续将该结论写入正式 04，必须先完成 03 的针对性回开。

## 10. 回填草稿：正式 `04-配置设计.md` §2

> 本草稿仅供 Step 15 在所有 Step 完成并通过三层装配门禁后使用；不是正式 `04` 正文。

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 五问回答”“本轮覆盖范围表”“P0 / P1 / P2 配置口径”“非范围与去向表”“非范围残余风险表”和“对详细设计的影响判定”小节，了解范围如何从既有 binding 与 blocker 收敛而来。

正式 §2 应表达：

1. `L2-member` 不是无配置项目；配置设计以 member-local composition 和 safe availability posture 为中心，不把 configuration 等同于部署或 external integration。
2. P0 必须覆盖 provenance、local consistency / technical / entry / read / Consumer / Job / projection / registry posture、redacted diagnostics，以及 external slot 的 fail-closed availability；其 `Ready` 仅代表 local composition。
3. P1 只在产品 authority 和 formal owner contract 到位后处理 durable / real-like realization、contracted external binding、optional outlet source activation 与 integration-like profile；P2 仅记录不改变不变量的未来演进。
4. 24 个 outbound semantic candidate 在 `L2M-UP-005` 前保持 zero configuration；non-project subject、owner、body-free、Query no-write、typed replay、CAS 与 Unknown fence 禁止配置化。
5. 部署运维、产品 / ADR、测试、验收、实施和 upstream contract 均有明确去向；具体配置项、来源、环境、敏感性、加载和失效将在本文件后续 Step 中继续收敛。

## 11. 待确认事项与 blocker

| 事项 | 影响范围 | 未确认前处理 |
|---|---|---|
| `L2M-UP-001/006` host / credential、`L2M-UP-002` image、`L2M-UP-003/004` Runtime | P1 external activation 与 sensitive / availability 细节。 | P0 只记录 blocked-aware slot；不写 endpoint、credential、manifest、entry payload 或 success。 |
| `L2M-UP-005` member event contract | 全部 24 candidate。 | 不创建 P1 event configuration；等待 Core / Bus contract 后重新审计 03 / 04。 |
| `L2M-UP-007/008` policy taxonomy / execution subject | screening / subject profile 任何扩展。 | safe result only；project-scoped dual anchor 之外 fail-closed。 |
| physical products 与 `L2M-DDD-*` gaps | P1、实施、测试和验收的具体可用性。 | 不选择产品、不伪造 fake parity 或 positive flow。 |
| 新版 05 / 06 / 07 尚未成文 | downstream configuration matrix、gate 与 implementation handoff。 | Step 12 仅准备 planned handoff；不声明测试、evidence 或 implementation facts。 |

## 12. 完成门禁与停审记录

| 检查项 | 结果 | 依据 |
|---|---|---|
| 三层恢复门禁已完成 | pass | §1；项目台账、04 flow、Step 1。 |
| SOP 五问已逐项回答 | pass | §4。 |
| P0 / P1 / P2 与无配置路径已收稳 | pass | §8.3、§8.5。 |
| 范围与非范围均有去向 | pass | §8.2、§8.4。 |
| external / design blocker 未被配置伪关闭 | pass_with_explicit_blockers | §3、§8.6、§11。 |
| 未定义具体项、值、来源、产品、部署或执行事实 | pass | §1、§3。 |
| 当前 03 无回写项 | pass | §9。 |
| 正式 `04-配置设计.md` 与 Step 3 均未创建 | pass | 符合严格 Step 串行与后置装配纪律。 |

### 停审结论

Step 2 已把 `L2-member` 的配置设计范围收敛为 member-local composition、logical binding 与 fail-closed external posture；P1 / P2、上游 contract、产品和下游执行均未越权提前闭合。下一步只能在用户明确确认后进入 Step 3「建立配置控制面总览」。

```text
step_02 = completed
gate_status = pass_with_explicit_blockers / stop_review
gate_reason = scope_and_non_scope_closed;P0_P1_P2_closed_without_new_code_contract;all_upstream_and_design_blockers_preserved
next_allowed_action = wait_for_explicit_user_confirmation_before_create_step_03_control_plane
formal_04_write_allowed = false_until_step_15
future_step_files_allowed = false_until_explicit_user_confirmation
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
