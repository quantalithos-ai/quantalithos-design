# L4-observability 04-配置设计 Step 10 · 定义配置变更、审计与回滚

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节: `04-配置设计.md` §10
> 当前模式: `full-restart`
> 本步边界: 定义 configuration control plane 如何评审、冷激活、审计、排空、回滚和退役 L4-observability 配置；不实现代码，不支持 hot reload / in-place adapter swap，不创建 L4 业务配置审计 truth

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前正式文档 | `projects/L4-observability/04-配置设计.md` 仍为 `historical_material`；本 Step 不修改 |
| 当前 Step | Step 10 定义配置变更、审计与回滚 |
| 前序门禁 | Step 09 current M3复核`pass`；用户于2026-08-02授权连续完成全部M4 |
| 当前模块 | `cold-change-authority-audit-rollback-retirement` |
| 输入状态 | Step 10 SOP / 书写规范、current Step 07~09、formal `03` runtime assembly / historical binding / telemetry、旧 L4 Step 10 与 L1/L0 粒度参考均已按 current-first 顺序读取 |
| 写入状态 | `batch_01_to_07_written_and_checked_under_continuous_authorization`；变更治理、23 域回指、cold activation、外部权威审计、rollback / retirement、逐类停审和总收口均已完成 |
| gate_status | `pass_consumed_by_step_11` |
| next_allowed_action | `continue_to_current_step_11_under_continuous_M4_authorization` |
| 上游 blocker | `none`；current formal `03` 已足以承载 host-owned cold activation，且不需要新增本仓 business audit object / repository / UoW |
| implementation readiness | `blocked`；formal `04~07`、target repo、concrete control plane / provider / store / adapter、真实 tests / evidence 均未完成 |

### 1.1 分批写入计划

| 批次 | 本批产物 | 当前状态 | 本批门禁 |
|---:|---|---|---|
| 1 | Step 状态、目标 / 非目标、输入优先级、SOP 八问、historical / reference 诊断、核心设计取舍 | `completed` | 不提前声称逐类停审、23 域、VETO 或总审计已通过 |
| 2 | actor / responsibility、四级风险、change source、配置变更主表 | `completed` | 每个 change class 均有发起、评审、生效、审计、回滚边界 |
| 3 | `CFG-D01~D23` changeability 与 Step 07/08/09/11 回指 | `completed` | exact 23 域，无“同上”式省略；migration class 单独阻断 |
| 4 | cold activation、host switch、old admission 与 drain 协议 | `completed` | candidate ready、activated、drained、retirable 四个事实分离 |
| 5 | 外部权威审计 owner、事件 / 字段、runtime telemetry 与 sensitive no-output | `completed` | 不新增 L4 truth；无 raw / full ref / fingerprint / evidence 泄露 |
| 6 | rollback eligibility / failure、accepted durable work、historical binding retirement | `completed` | 先前候选重新全量校验；不重写 business truth 或旧 effect |
| 7 | 逐类停审、跨变更审计、10 VETO、`03` impact、formal §10 草稿、handoff、自检门禁 | `completed_and_checked` | 全部检查通过，flow / ledger 同步后停在 Step 10 用户审查点 |

### 1.2 第 1 批写入前检查

| 检查面 | 结果 |
|---|---|
| 用户是否确认进入 Step 10 | yes |
| 是否已读取 Step 10 SOP 与 §5.10 | yes |
| 是否先读 current Step 07~09 / formal `03` | yes |
| 是否后置读取旧 Step 10 与 L1/L0 参考 | yes |
| 正式 `04` 是否允许写入 | no；formal 只允许 Step 15 装配 |
| 是否允许读取 Step 11 | no；Step 10 完成且用户确认前不得读取 |
| 是否允许创建本仓 generic config audit ledger | no；无 current object / repository / UoW owner |
| 是否允许假定具体工单 / deployment 产品 | no；仅使用 product-neutral refs 与 role |
| 是否允许把旧 process handle 当回滚候选 | no；rollback 必须重新 build / validate prior protected candidate |
| 是否允许声称真实 change / activation / rollback / test 已执行 | no；本产物仅定义设计契约 |

## 2. 本步目标与非目标

### 2.1 本步目标

1. 为 Step 07 中每个可变更配置项建立唯一 change class，并固定谁可以发起、谁必须评审、谁可以批准和谁执行冷激活。
2. 用 `low / medium / high / critical` 四级风险区分普通 bounded parameter、入口 / 调度、safety / sensitive / durable effect 与静态不变量变更，禁止把高风险变更降级为普通部署动作。
3. 固定 P0 只接受受保护候选快照、new-process complete assembly、host-level admission switch 与 old-process drain，不支持 runtime reload、watch、field patch、进程内 adapter swap 或 admin override。
4. 区分 candidate parsed / validated / assembled / host activated / old drained / historical binding retired；任何前一事实都不能替代后一事实。
5. 明确配置变更审计的权威 owner 是外部 host / deployment configuration control plane；L4 runtime telemetry 只提供非权威、安全、有限的 assembly / process 信号。
6. 定义审计事件与字段 allowlist，使审计可证明 request、review、candidate validation、activation、drain、rollback 与 retirement decision，同时不输出 raw config、diff、locator、credential、endpoint、topic、full sensitive ref 或 fingerprint。
7. 定义 rollback eligibility：选择受保护的先前候选，在当前 binary / config schema / capability 下重新执行 Step 09 完整 parse / validate / assemble，再通过同一 activation 流程切换。
8. 保证 accepted Job、outbox、intent、preparation、token、plan、snapshot、result、report 和 historical binding 不因当前配置变更或回滚而被重写、重路由或重新解释。
9. 将 store destination / schema 与 digest profile / schema revision 归入 migration class；在 Step 13 和 formal `07` 未闭合 migration / rollback 前不得作为普通配置变更激活。
10. 定义 historical binding overlap scan 与 retirement gate；active、ambiguous、replay、manual 或 retention obligation 未关闭时不得退役 exact old binding resolution。
11. 对每类变更完成权限、评审、审计、回滚、失败处理和敏感性停审，并完成跨变更 / VETO / `03` impact 审计。

### 2.2 本步非目标

- 不实现 loader、configuration control plane、deployment controller、process supervisor、route switch、consumer rebalance、scheduler pause、drain tracker、audit sink 或 rollback executor。
- 不新增 remote config center、admin API、CLI field override、watcher、runtime reload、hot swap、partial root activation、entry-local override 或 Job-local config override。
- 不选择 GitOps、ticket、CI/CD、orchestrator、secret manager、store、transport、scheduler、telemetry backend 等具体产品，也不写其专属字段或 API。
- 不把 `ConfigBindingRef` 当 configuration artifact locator、审批记录、diff、digest、LKG pointer、run id、evidence alias 或 acceptance signoff。
- 不新增 `ConfigChangeAuditRecord`、`ConfigRollbackRecord`、repository、business service、UoW write 或本仓 durable generic audit event；若未来要求 L4 自有权威审计，必须回写 formal `03`。
- 不以 runtime log / metric / span、health probe、assembly success、process readiness 或 sink ack 证明权威审批、激活完成、业务成功、evidence、verdict 或 signoff。
- 不定义 schema / data / binding migration 的执行步骤；本 Step 只分类和阻断，Step 13 定义演进语义，formal `07` 定义可执行 boundary / rollback / pause gate。
- 不定义 Step 11 的完整失效模式、告警和降级矩阵；本 Step 只提供每类变更的预期失败处理 handoff，未经确认不得进入 Step 11。
- 不删除、缩短或重新解释既有 durable material；retention 配置只能作用于 new material，并继续受 active reference guard 约束。
- 不伪造 candidate、change request、actor、review、activation、rollback、audit event、commit、run、测试结果、evidence 或签署实例。

## 3. 输入与采用方式

| 输入 | 当前身份 | 本 Step 采用方式 |
|---|---|---|
| 配置设计 SOP Step 10 / 书写规范 §5.10 | current standard | 固定八问、六列变更表、逐类停审、跨变更审计与 formal §10 回填位置 |
| 通用编写 / 中间产物 / 可落码 / 依赖标准 | current standard | 固定逐 Step 停审、current-first、owner 闭环、`03` impact、only-core compile edge 与 no-fabrication |
| current Step 07 | direct upstream | exact root / leaf / nested field registry、required / default / source / scope / sensitivity / failure / module 与 23 域 mapping |
| current Step 08 | direct upstream | 27 行 sensitive inventory、R/S-L/mixed ownership、rotation decision、historical binding retention、audit no-output handoff |
| current Step 09 | direct upstream | one coherent candidate、61 ENV、`CFGIDv1`、13-stage complete assembly、entry registration、activation boundary 与 historical snapshot |
| formal `03` §5 / §10~§14 / §16 | code and truth baseline | builder / error / snapshot / effect token / exact historical binding / native audit / runtime telemetry / implementation precondition |
| DDD Step 14 / 15 / 17 / 18 / 19 | detailed source | config ownership、runtime telemetry owner、historical binding open material、future trigger 与 full-document handoff |
| current formal `00~02` | governing upstream | truth ownership、VETO、cross-cutting role、no-write、product-neutral dependency / runtime class boundary |
| old L4 Step 10 | historical material | 只诊断旧 81 行 schema-first / generic summary / automatic pass，不继承其对象、结论或 gate |
| L1-governance / L1-artifact / L1-identity / L0-bus Step 10 | granularity reference | 只采用 actor / risk / change table / stop review / cross-audit 结构，不采用 digest、LKG、job-run / entry override 或相邻业务语义 |
| README / old formal `04~07` | historical material | 仅识别产品、数值、旧流程与实现假设冲突；不得反向定义 current change contract |

### 3.1 真相源优先级

发生冲突时按以下顺序裁定：

```text
current standards
  > current formal 00/01/02/03
  > current 04 Step01~09
  > old L4 Step10 as historical diagnosis only
  > L1/L0 Step10 as structure/granularity reference only
  > README / old formal 04/05/06/07 as historical material only
```

旧材料声称的产品、热更新、LKG、digest audit、job-run override、自动 rollback 或自动 pass，只要与 current source 冲突，一律不能沿用。Current source 尚未定义的具体 control-plane product、artifact repository、process supervisor 和 audit landing 保持 `not_selected / not_established`，不能由参考仓补齐。

### 3.2 本步判断原则

| 原则 | 具体含义 |
|---|---|
| Authority before mutation | 只有 configuration control plane 中被授权的 actor 才能提出 / review / approve / activate；process runtime 不接受自助修改 |
| Protected candidate before build | ordinary source 必须先形成不可变、可追溯、受保护候选；临时文件、工作区、当前进程内存和 raw diff 不是 rollback source |
| Full validation before activation | 每次 forward change 和 rollback 都重新执行 Step 09 完整 source / parse / type / cross-field / profile / redline / sensitive / capability / registration gate |
| Cold process boundary | P0 change 只通过 new process / root composition 与 host-level admission ownership 切换；不在既有 runtime 中 mutate adapter / policy / catalog |
| New work only | activation 只决定随后新接纳 work 使用哪个 complete runtime；不改变已 accepted request / Job / outbox / intent / preparation 的 durable authority |
| Audit owner separation | external control plane 保存权威 change history；L4 runtime 只 emit safe telemetry，且不得自回采为 observation truth |
| No hash escape | full ref、locator、credential、endpoint、topic、raw config / diff / value 即使 hash、mask、base64 或 fingerprint 后仍禁止输出 |
| Rollback is a new activation | rollback 不是 pointer flip、LKG reuse 或旧 process resurrection；prior candidate 必须在 current binary / schema 下重新证明可用 |
| Migration is not rollback | destination、schema、digest profile / schema revision 变化需要迁移设计和实施 boundary；禁止包装成普通 cold restart |
| Historical exactness | old durable effect 始终按 stored snapshot / binding / token；current config 和 rollback target 都不能替代 exact historical identity |
| No truth rewrite | configuration control plane、host switch、telemetry、rollback 和 retirement 都不得改写 L1~L4 business truth、result、report、receipt 或 signoff |
| Evidence honesty | design 只定义未来真实记录的 schema / producer / consumer；当前不创建 fake change、run、evidence alias、pass 或签署 |

## 4. SOP 问题回答

### 4.1 哪些配置可以由谁变更？

只有外部 configuration control plane 中的授权 `change initiator` 可以提交受保护候选；候选内容必须来自 Step 05 / 07 允许的 ordinary source，不允许 runtime、entry、Job、adapter、telemetry sink 或业务 actor 自行改配置。`configuration reviewer` 审查语义与风险，`security reviewer` 审查 safety / sensitive / credential rotation，`data / compatibility reviewer` 审查 store / schema / digest / historical readability，`activation operator` 只执行已批准候选，`process host` 只实施 admission / ownership switch 与 drain，`historical binding custodian` 只按独立 retirement gate 退役旧解析能力。Exact role / separation-of-duty 在第 2 批固定。

可配置不等于可任意修改：Step 04 禁止配置化的不变量、任何 raw secret / body、runtime hot / admin override、business truth / state / UoW / idempotency / no-write / redaction bypass 都只能被拒绝或进入正式设计变更，不属于合法配置变更。

### 4.2 哪些配置变更需要评审？

所有受保护候选在激活前都至少需要 syntactic / semantic validation 与授权 review。`medium` 及以上需要独立 configuration reviewer；`high` 需要相应 safety / security / data / integration owner 之一的专项 review 和明确 rollback plan；`critical` 需要双人分离审批、migration / historical recovery 证明或直接被 current P0 VETO。降低 redaction / body-free / visibility、安全 policy 失效、raw material、in-place hot、truth override、unsupported schema/digest removal 等请求不能通过“高风险批准”放行，而是 rejected / design-change-only。Exact 四级风险与变更映射在第 2 批固定。

### 4.3 变更如何生效？

P0 只支持 cold activation：control plane 固定受保护候选 -> 启动 new process / root -> 执行 Step 09 全部 13-stage assembly 与 entry registration -> host 验证进程级 ready（不是业务成功）-> 原子或有界地切换 API route、consumer ownership、scheduler admission 和 outbox loop ownership -> 关闭 old admission -> 排空已接纳 synchronous work -> 停止 old process，但继续保留 durable historical binding resolution。不能在一个 process 内 watch / reload / partial swap，也不能把 builder success 当 host activation / drain / retirement。Exact phase / abort / timeout 规则在第 4 批固定。

### 4.4 变更如何记录审计？

权威审计由外部 host / deployment configuration control plane 记录，不落入 L4 business repositories / UoW。它至少记录 product-neutral safe change ref、actor / reviewer refs、risk / change class、canonical field IDs 或 finite subject family、old / candidate `ConfigBindingRef`（仅在 owner policy 允许时）、validation / assembly / activation / drain / rollback / retirement finite result、safe issue ref 和时间；不得记录 raw config / diff / value、ENV value / path、locator、credential、endpoint、topic、full consumer / target / binding ref、其 hash / fingerprint、provider body、run / evidence / verdict / signoff。

L4 process 可按 formal `03` 既有 `observability.runtime.assembly` span 和 safe runtime log / metric 输出有限补充信号，但这些信号不具有审批或激活 authority，不创建 durable config audit truth，也不得经本仓 intake / Consumer / loop 自回采为 observation truth。Exact owner / event / field matrix 在第 5 批固定。

### 4.5 变更失败或效果异常如何回滚？

候选在 activation 前失败时，丢弃 candidate resources，old process lifecycle 不变；这叫 rejected candidate，不叫 rollback success。Activation 后需要回滚时，control plane 选择受保护的先前候选，在**当前 binary / config schema / provider / store / adapter capability**下重新执行完整 parse / validate / assemble，随后走与 forward change 相同的 host switch / drain 流程。禁止仅切换 config pointer、复用未重新校验的旧 process handle、跳过 validator、fallback lower-priority source 或把 old runtime 仍存活写成 rollback 完成。

Rollback 只影响新 work 的 admission。已 accepted Job / outbox / intent / preparation 继续使用 durable snapshot / historical binding / token；不得回退 state、result、report、receipt、marker、plan 或 external outcome。Store destination / schema、digest profile / schema revision 等 migration class 在迁移闭环前没有普通 rollback 资格。Exact eligibility / failure 与 historical retirement 规则在第 6 批固定。

### 4.6 每个可变更配置项是否回指 Step 07、Step 08、Step 09 和 Step 11？

Yes。§8.2 以 `CFG-D01~D23` 为完整索引，对每域列出 Step 07 exact field family、Step 08 sensitivity / rotation、Step 09 source / assembly / activation 和 Step 11 failure-handoff；11 个 raw root family 与 source / identity / lifecycle / view derived domain 均已归入唯一 change / lifecycle disposition。D02 / D22 等无 direct raw field 的域也已显式保留。

当前状态：`pass`；Step 11 handoff 仅为 `CFG-FH-01~06`，未读取或预判 Step 11 正文。

### 4.7 每类配置变更完成后是否通过停审？

Yes。§12.1 对 `CFG-CHG-01~12` 逐类检查权限、评审、生效、失败处理、权威审计、rollback / retirement 与敏感性；prohibited / design-change-only 和 migration-only 另列硬阻断。所有行均为 `pass_for_step_10`，没有 unresolved 设计缺口；这不表示真实 control plane / actor / change 已存在。

当前状态：`pass`。

### 4.8 是否存在高风险配置无评审、无审计、无回滚或敏感配置变更泄露？

No。§7 固定高风险专项 review / separation-of-duty，§10 固定外部权威 audit 与 allowlist / no-hash-escape，§11 固定 rollback eligibility / migration block / durable no-rewrite，§12.1~§12.3完成逐类、跨变更和10项VETO审计。具体 control plane 未选择时只能阻塞真实实施，不得由 L4 telemetry 顶替。

当前状态：`pass`；当前上游 blocker 为 `none`。

## 5. Historical material 与粒度参考诊断

### 5.1 旧 L4 Step 10 诊断

| 旧材料表现 | Current 诊断 | 本轮处理 |
|---|---|---|
| 仅 81 行通用 schema-first 模板 | 没有从 Step 07 exact fields、Step 08 sensitive inventory、Step 09 assembly / activation 推导变更契约 | 全量替换，不保留正文结构 |
| 把 log / metric / trace / audit schema 摘要重复为 Step 10 主体 | 偏离“配置如何变更、评审、审计和回滚”的 SOP 目标 | 仅保留 observability 非 truth 边界，删除 schema 摘要替代设计的做法 |
| 没有 actor / separation of duty / 四级风险 | 无法判断谁可发起、审批、激活、排空、rollback、retire | 第 2 批建立 product-neutral role / risk model |
| 没有 23 域 / exact field 回指 | 无法落码或测试每个配置族的 changeability | 第 3 批逐域展开，不用“其他同类”省略 |
| 没有 host switch / consumer / scheduler / drain | 把 new assembly ready 与实际生效混为一谈 | 第 4 批定义 cold host lifecycle |
| 没有权威 audit owner 与 telemetry 分层 | 容易私建 L4 generic audit truth 或以 runtime signal 冒充权威记录 | 第 5 批明确 external control-plane owner |
| 没有 rollback eligibility / migration class | 容易把 pointer flip、旧 process handle 或 store/schema 变化写成普通 rollback | 第 6 批定义重新校验与 migration block |
| 没有 accepted durable work / historical retirement | 可能用 current binding 重解释 old effect 或过早删除解析能力 | 第 6 批定义 exact snapshot / overlap scan |
| 自动标记 `gate_status=pass` / `next_step_or_formal_assembly` | 违反逐 Step、逐批停审和用户确认规则 | 第 7 批真实检查后才允许 pass，之后仍停审 |

旧文件的物理存在和过去的 pass 文本均不构成 current evidence。该文件已作为 `historical_material_replaced_in_progress` 处理，本轮只承认当前分批写入内容。

### 5.2 L1 / L0 粒度采用边界

| 参考结构 | 是否采用 | Current L4-observability 调整 |
|---|---|---|
| actor 与评审层级 | yes | 增加 host switch、consumer / scheduler ownership、historical binding custodian 与 truth boundary reviewer |
| low / medium / high / critical 风险 | yes | 风险由 L4 exact safety / store / external effect / historical recovery 语义推导，不复制相邻项目级别 |
| 六列配置变更表 | yes | 每行必须回指 Step 07~09 和 downstream failure handoff |
| 敏感配置附加规则 | yes | 强化 no full ref / fingerprint / endpoint / topic / provider body / hash escape |
| 逐类停审 / 跨变更审计 | yes | 增加 23 域、10 VETO、migration 与 no-truth-write 审计 |
| redacted config / ref digest 作为 audit 默认字段 | no | Current L4 没有批准 safe fingerprint schema；opaque full ref 的 hash 仍可关联和泄露 |
| previous digest / LKG pointer rollback | no | rollback 必须从 protected candidate 重新完成 current validation / assembly |
| job-run-start / entry-local override | no | accepted Job frozen snapshot，entry 只消费 validated slice / registrar，不存在 root override |
| runtime hot / zero-downtime in-process reload | no | P0 只有 new process / host-level cold switch；未来需要先回写 formal `03` |
| adjacent business audit object / report owner | no | L4 不导入相邻项目 truth，也不创建 generic config audit business row |

参考仓平均约 290~300 行，只能作为结构下限，不是 L4 篇幅上限。L4 需要额外闭合 23 配置域、13-stage assembly、entry registration、durable historical effect 和 telemetry self-recursion，因此不能压缩成相邻项目的摘要级表格，也不能复制其 digest / LKG / job-run 语义。

## 6. 核心设计取舍

| 议题 | 采用方案 | 放弃方案 | 理由 / current source |
|---|---|---|---|
| 变更 authority | external host / deployment configuration control plane | L4 application / entry / adapter 自助配置；generic admin API | 配置不拥有 business truth，formal `03` 无 local change command / repository |
| 候选形态 | immutable protected whole candidate | mutable field patch、temporary file、current memory、raw diff | Step 09 要求 coherent whole source 与 complete candidate |
| P0 生效 | new process / root + host admission ownership switch + old drain | reload / watch / hot / in-place adapter swap | Formal builder 只返回 complete runtime，没有 partial activation API |
| registrar 语义 | new process 内按 Step 09 `prepare-all -> totality -> arm-all` 完成 entry root；host 再切 ownership | 为 Step 10 发明 standby / activate / partial registrar API | 避免配置文档静默扩展 formal `03` code contract |
| 审批模型 | risk-based review + separation of duty | 所有变更同级、operator 单人 emergency bypass | SOP 要求高风险 review / audit / rollback，VETO 不能由批准绕过 |
| 权威审计 | external control plane durable history | L4 business audit row、runtime telemetry、observation self-ingest | owner 闭环且不让观测投影成为配置 truth |
| 审计表示 | safe refs / finite field IDs / family / count / result allowlist | raw config / diff / value、full sensitive refs、hash / digest / fingerprint | Step 08 / formal `03` 明确 no-output 与 no-hash-escape |
| Rollback | prior protected candidate revalidated under current binary / schema，然后走同一 activation | pointer flip、unvalidated old process handle、automatic LKG | 防止 binary/schema/provider/capability drift，保持 all-or-error |
| Candidate failure | reject candidate，clean resources，old lifecycle unchanged | 声称 automatic rollback succeeded | 未发生 activation 就没有需要反向切换的事实 |
| 已接纳 work | durable snapshot / exact historical binding / stable token 始终有效 | rollback 重写 plan / state / outbox / intent / target / token | Formal `03` idempotency / external-effect recovery 不允许 current fallback |
| Store / schema / digest evolution | migration class，先闭合 Step 13 + formal `07` | 当成普通 config rollback / restart | 涉及数据位置、readability、schema compatibility，非指针级变化 |
| Historical retirement | 独立 obligation scan + explicit retirement decision | activation / rollback / terminal process 自动 retire | active / ambiguous / replay / manual / retention obligation 可能跨 process |
| Runtime telemetry | non-authoritative safe supplement，禁止 self-recursion | approval / activation / evidence authority 或回采为 observation truth | Formal `03` telemetry sink failure / ack 均非 truth，OBS-TELEM guard 适用 |
| 未选产品 | 保持 role / artifact / event / ref product-neutral | 假定 ticket / GitOps / orchestrator / secret manager / backend | 标准禁止把具体工单系统作为默认前提，真实产品留 `07` / operations |

### 6.1 第 1 批阶段结论

第 1 批只固定了设计前提和决策，不构成 Step 10 内容门禁通过。当前可以进入第 2 批的前提是用户审查并明确确认；第 2 批只允许写 actor / responsibility、四级风险、change source 与配置变更主表，不得提前写第 3 批或读取 Step 11。

| 第 1 批检查项 | 当前结论 |
|---|---|
| Step 10 标准 / current source / historical / reference 顺序 | `pass` |
| 目标、非目标和 owner 边界 | `pass_for_batch_01` |
| SOP 八问是否均已诚实回答 | `pass_for_batch_01`；第 6~8 问保留后续 proof 状态 |
| 是否误建 L4 business config audit truth | no |
| 是否误支持 hot / in-place swap / admin override | no |
| 是否把 rollback 写成 pointer / LKG | no |
| 是否伪造真实 change / run / evidence / test / signoff | no |
| 上游 blocker | `none` |
| Step 10 总门禁 | `not_evaluated`；等待第 2~7 批 |
| next_allowed_action | `consumed_by_batch_02` |

## 7. 变更治理模型

### 7.1 Actor 与职责

本 Step 使用职责角色而非组织名或产品账号。一个真实主体可以承担多个低风险角色，但每次 change 的 required separation-of-duty 仍必须满足；角色合并不能消除独立 review、approval、activation 或 retirement decision。所有 actor ref 均由外部 control plane 管理，本仓不解析身份正文、不持有权限 truth。

| Role ID / actor | 可以做 | 必须产出的 control-plane fact | 不得做 |
|---|---|---|---|
| `CFG-A01 change_initiator` | 提交 one protected whole candidate、声明目的 / scope / expected class、提出 rollback 或 migration disposition | safe change ref、candidate artifact ref、declared field families / subject counts、reason ref | 直接审批自己需要独立 review 的变更；提交 raw secret / body；修改 running process |
| `CFG-A02 candidate_custodian` | 以 immutable / access-controlled / versioned 方式封存候选与先前候选；向 loader 提供 exact candidate bytes / ordinary source snapshot | protected candidate ref、immutability / availability state、source class | 修改已批准候选；把 `ConfigBindingRef` 当 artifact locator；从 runtime memory 反构候选 |
| `CFG-A03 configuration_reviewer` | 审查 Step 07 field、Step 09 validation、change class / risk、cross-field / profile / entry totality 与 rollback eligibility | review decision、reviewer ref、risk / class disposition、safe reason / issue ref | 跳过 validator；批准 prohibited / design-change-only 项；替代专项 reviewer |
| `CFG-A04 specialty_reviewer` | 按 subtype 审查 safety / security、data / compatibility、entry / integration、historical recovery | specialty kind、decision、constraints / migration requirement、safe reason ref | 接收或输出 raw secret / full locator / provider body；用产品健康替代 contract review |
| `CFG-A05 change_approver` | 在 required reviews 全部通过后批准 candidate 进入 activation；批准 forward / rollback / retirement 是三种不同 decision | approval decision、approved candidate ref、risk、required review set、expiry / supersession state | 既发起又单独批准 high / critical；批准未保护候选；用 emergency bypass 绕 VETO |
| `CFG-A06 activation_operator` | 请求 exact approved candidate 的 new-process assembly、核对 safe result、触发 host-level switch / abort / rollback workflow | activation attempt ref、candidate / prior config safe refs、finite phase result、safe issue ref | 改候选、跳过 assembly、在 process 内 hot swap、把 ready 写成 activated / drained |
| `CFG-A07 process_host` | 创建隔离 new process / root，执行 API route、consumer ownership、scheduler admission、outbox loop ownership switch，控制 old admission / drain / stop | process-generation safe ref、ownership phase / result、drain category / counts、safe issue ref | 选择或审批候选；改 business state；以 health / telemetry 代替 control-plane decision |
| `CFG-A08 audit_recorder` | 在 external configuration control plane 追加不可变权威 change / review / activation / rollback / retirement event | 按第 5 批 allowlist 的 ordered records 与 references | 成为候选 source、审批者或激活器；写 L4 business repository；保存 raw config / diff / sensitive material |
| `CFG-A09 historical_binding_custodian` | 维护 exact historical descriptor / locator resolution availability；扫描 active / ambiguous / replay / manual / retention obligation；执行 approved retirement | scan scope / result、obligation categories / counts、retirement decision / result、safe issue ref | 因 process stopped / config rollback 自动退役；重绑 identity；改写 old token / intent / report |

`CFG-A04 specialty_reviewer` 是一个 role family，至少包含 `safety_security`、`data_compatibility`、`entry_integration`、`historical_recovery` 四种 finite specialty。真实 control plane 可以由不同团队或 automation 承担，但 audit 必须记录 specialty kind，不能只写 generic “reviewed”。

### 7.2 职责分离与授权矩阵

| Action | Initiate | Review | Approve | Execute / record | Required separation |
|---|---|---|---|---|---|
| low forward change | A01 | A03 可与 A05 合并；仍不得与 A01 为同一 automation identity 且无 second control | A05 | A02 / A06 / A07 / A08 | submitter 与 final authorization 至少二元控制 |
| medium forward change | A01 | A03 required | A05 | A02 / A06 / A07 / A08 | A03 与 A01 分离；A05 不得只依据 initiator self-review |
| high forward change | A01 | A03 + all applicable A04 | A05 | A02 / A06 / A07 / A08 | A01、至少一名 required reviewer、A05 三方分离；A06 不得兼任唯一 A05 |
| critical compatible change | A01 | A03 + all applicable A04 | A05 双人批准 | A02 / A06 / A07 / A08 | 两个 approver 彼此分离且都与 A01 分离；无 emergency bypass |
| prohibited / design-change-only request | A01 或 detector | A03 / A04 classify only | none | A08 records rejected classification | 没有任何角色可把 VETO 转为 approved config change |
| rollback request | A01 / A06 / incident authority | A03 + original applicable A04；migration class 另行阻断 | A05 | A02 / A06 / A07 / A08 | rollback 不是 operator 单人动作；prior candidate 重新全审 |
| historical retirement | A09 proposes after scan | A04 `historical_recovery` required；high family 追加 safety / data specialty | A05 as distinct retirement approval | A09 + A08 | A06 / A07 的 process stop 不能充当 retirement approval |

Automation 可以执行 deterministic validation、candidate custody 和 audit append，但 automation identity 必须是明确 actor ref，且不能以“pipeline passed”替代 required human / authority review。具体组织、值班模型和工具未选择，保持 `not_established`；这不改变 separation contract。

### 7.3 四级风险与取最高原则

| Risk | 判定条件 | Required review / approval | Activation / rollback expectation | 不允许的降级 |
|---|---|---|---|---|
| `low` | 仅改变不触及 external effect / entry / safety / store / schema / digest / retention guard 的 bounded technical scalar；减小资源使用且不缩短已冻结 / active obligation | A03 或 A05 中具备 config-review authority 的独立主体；one approval | cold new assembly；prior compatible candidate 可按同流程重建 | 因数值在 hard range 内就跳过 review / audit；hot patch |
| `medium` | 改变 request / query bounds、projection batch、concurrency / lease / timeout / retry、technical adapter mode、entry cadence，或扩大资源 / 执行窗口但不改变 binding / schema / safety owner | A03 required；涉及 execution / entry 时 A04 `entry_integration`；A05 approval | cold new assembly；rollback 需确认 current binary / store capability 仍兼容 | 把 Job snapshot / retry / timeout 当即时可变；以进程重启替代 review |
| `high` | 改变 safety policy ref、source allowlist、freshness policy、entry enabled sets / Consumer / schedule、resolver mode / ref、credential / transport、publication / handoff / export target / binding、retention duration，或影响 historical exact recovery | A03 + all applicable A04；A05 approval；明确 rollback / retention / overlap disposition | cold activation +专项 preflight；prior candidate 重新校验；old binding 独立保留 | 用 redacted digest 代替 review；把 optional target / credential-only 视为 low；activation 自动 retire |
| `critical` | 改变 store destination / mode、required schema revision、digest write / readable profiles、external destination / idempotency namespace 且影响 old tokens，移除 active readable / historical capability，或任何可能破坏 atomicity / no-write / redaction / truth / recovery 的请求 | A03 + all applicable A04 + two A05 approvers；若属 migration class，必须等待 Step 13 / `07` closure；若属 prohibited invariant，直接 reject | compatible critical 才可进入 cold activation；migration 有独立 plan / pause / rollback；prohibited 无 activation | emergency override、automatic migration、current-route fallback、删 old binding 后观察、把 VETO 叫 critical approval |

风险计算规则：

1. 候选先按 changed canonical field families / finite subjects 分类，再取全部命中规则的最高 risk；不能按文件大小、行数、环境名或 initiator 声明降级。
2. Whole-object / whole-catalog replacement 必须逐 leaf / subject 分类；如果同时触达多个 class，required reviewer 集合取并集。
3. `old -> null`、Disabled、删 catalog item、缩短 retention / timeout、降低 limits 不天然更安全；其风险由失去能力、active obligation、drain 和 historical recovery 影响决定。
4. 同值重发布若 candidate bytes / provenance 改变但 effective `ConfigBindingRef` 相同，仍是 custody / activation event；不得声称业务配置变更，但必须审计 deployment attempt。
5. Effective semantics 变化却错误地产生同一 config ref 是 identity collision / consistency blocker，不得继续 activation 或靠风险审批放行。
6. Profile / lane 不降低风险。LocalTest 的 fake / in-memory 组合也必须使用同一 schema / source / no-secret / no-truth-write gate；只有适用 reviewer 可以按非生产 scope 调整批准过程。

### 7.4 Change source 与候选保护规则

| Source / artifact | 是否可提交 change | Custody / validation rule | 禁止用途 |
|---|---|---|---|
| protected strict JSON candidate | yes；作为 whole candidate | A02 封存 exact bytes、immutable ref、access policy；Step 09 strict parse；批准后不可改 | 不记录 raw bytes / diff 到 audit；不作为 secret store |
| approved deployment ENV occurrence set | yes；作为该 process candidate 的 R2 snapshot | exact 61-key allowlist、one coherent occurrence snapshot；与 JSON / DECL 合并后保护 effective candidate | shell history、ad hoc `export`、unknown key、value logging、runtime reread |
| code declaration defaults | only through versioned binary release | 仅 Step 07 明确 DECL default；binary identity / release custody 由 host control plane 管理 | operator 临时修改；假装 deployment override |
| secret / provider-side material rotation | yes，only as external controlled rotation event；root 仍只含 typed ref | A04 safety/security review；new assembly reconstructs adapter；same-ref 需 destination / token overlap proof | 把 provider response 当 ordinary source；in-place mutate active adapter；输出 fingerprint |
| prior protected candidate | yes，only as rollback input after current validation | 必须仍可取回 exact candidate，且在 current binary / schema / provider / capability 下全量重建 | LKG pointer、old process memory、跳过 current validator |
| runtime memory / assembled root / safe slice | no | 只可提供 non-authoritative runtime status | 反序列化为候选、生成 diff、成为 rollback source |
| entry request / Job request / schedule invocation | no | 只携带 formal operation input；accepted Job 使用 stored snapshot | root / field override、current config reread、schedule 注入 actor / key / input |
| admin / debug / emergency input | no；current surface nonexistent | request classified prohibited / design-change-only | bypass review / validation / redaction、hot / partial activation |
| README / old formal / old Step / reference project | no | historical / granularity material only | 恢复旧 key / value / product / precedence / LKG semantics |

Candidate protection至少要证明：artifact immutable、approved bytes与loaded bytes同一 custody chain、source occurrence snapshot coherent、candidate未过 approval expiry / supersession、无 raw secret / body、能由 current loader完整读取。具体 artifact store、签名 / provenance机制和binary release system为 `not_selected`；formal `07`必须在 implementation / deployment boundary 前选择并验证，当前不得伪造 artifact ID 或签名结果。

### 7.5 Change class 词表与组合规则

| Class ID | Change class | 典型 Step 07 family | Base risk | Applicable specialty |
|---|---|---|---|---|
| `CFG-CHG-01` | runtime / technical composition | `profile`;`technical.*` | medium；binding ref high | entry_integration；safety_security when sensitive ref |
| `CFG-CHG-02` | bounded request / query / projection parameter | `boundary.*`;projection numeric leaves | low or medium；schema set high | entry_integration for protocol/schema |
| `CFG-CHG-03` | safety / policy / source visibility | `safety.*`;`projection.freshness_policy_ref` | high；unsafe relax prohibited | safety_security |
| `CFG-CHG-04` | store / transaction / schema compatibility | `stores.*`;transaction timeout / required revision | medium timeout；store / revision critical migration | data_compatibility + historical_recovery；safety_security for locator |
| `CFG-CHG-05` | digest / technical retention compatibility | `digest.*`;`idempotency.*` | high；profile removal / incompatible write critical migration | data_compatibility + historical_recovery |
| `CFG-CHG-06` | execution / claim / retry budget | `execution.*` | medium；recovery weakening prohibited | entry_integration + data_compatibility where durable claim affected |
| `CFG-CHG-07` | resolver / external adapter | root `external.<adapter>.*` | high；destination / idempotency semantic change critical | entry_integration + safety_security + historical_recovery as applicable |
| `CFG-CHG-08` | publication / handoff / export target catalog | three `external.*targets` catalogs | high；old-token incompatibility / destination migration critical | entry_integration + safety_security + historical_recovery |
| `CFG-CHG-09` | API / Consumer / Job / schedule entry catalog | `entries.*` | high；schema/protocol expansion design-change-only | entry_integration + safety_security for actor / transport policy |
| `CFG-CHG-10` | credential-only provider rotation | resolved material behind unchanged typed ref / binding | high；same-ref recoverability loss critical | safety_security + historical_recovery |
| `CFG-CHG-11` | activation / rollback lifecycle | derived `ConfigBindingRef`;no raw field | inherits candidate max risk | all candidate specialties + historical_recovery for rollback |
| `CFG-CHG-12` | historical binding retirement | no root field；infra registry obligation | high；active / ambiguous removal prohibited | historical_recovery + source class specialties |

本 Step 使用 12 个 change class，而不是把所有行为压成“配置文件变更”。`CFG-CHG-11/12` 没有 raw field，但必须作为 lifecycle change 审计；它们不能被遗漏或计入 Step 07 field count。第 3 批将把 `CFG-D01~D23` 和所有 Step 07 field family 映射到该词表；映射完成前不能声称字段覆盖 pass。

组合规则：

```text
changed field / subject families
  -> classify all applicable CFG-CHG-* rows
  -> union all specialty reviewers
  -> risk = maximum(base risk, contextual escalation)
  -> detect prohibited or migration-only conditions
  -> validate one protected whole candidate
  -> authorize one indivisible cold activation attempt
```

一个 candidate 可以命中多个 class，但只能作为 one protected candidate / one approval set / one activation attempt；不得把高风险 catalog / binding 变更拆成多个 low-risk scalar ticket 后分别激活，也不得混合不同审批版本的字段形成第三份候选。

### 7.6 配置变更主表

下表满足 SOP 六列要求；“审计记录”只列 semantic event / safe category，exact owner 与字段 allowlist 留第 5 批，“回滚方式”只固定 disposition，exact eligibility / failure 留第 6 批。表中所有生效均为 cold new-process path，不能解释为已实现或已执行。

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| `CFG-CHG-01` runtime / technical composition | A01；binary declaration变化还需 release authority | medium；A03 + entry specialty；binding ref 加 safety specialty / high | protected whole candidate -> full assembly -> host switch / drain | requested classes、finite technical family / mode category、candidate validation / activation finite result | prior protected candidate 在 current binary 下重新 assembly；不得复用 old clock / ID handle |
| `CFG-CHG-02` bounded request / query / projection parameter | A01 / authorized operations tuning authority | low/medium；A03；schema set high + entry specialty | complete root / slices only；只影响 new request / new Job snapshot | canonical field IDs、direction category、risk、validation / activation result；不记值 | revalidate prior candidate；已 accepted request / Job 不改 limit / work set |
| `CFG-CHG-03` safety / policy / source visibility | A01 + policy owner | high；A03 + safety specialty；relax redline / bypass prohibited | policy resolution + redline + complete assembly，new work only | finite safety family、change direction category、review / validation / activation result | prior policy candidate重新 resolve；不重判 committed truth、不降低 old safety record |
| `CFG-CHG-04` store / transaction / schema compatibility | A01 + data / infra authority | timeout medium；store mode / destination / schema critical；A03 + data + historical，locator加 safety | timeout compatible change cold；destination / schema / mode 作为 migration class blocked until Step 13 / `07` | store slot / change category / compatibility result / migration disposition；无 locator / DSN | timeout prior candidate可重建；migration按独立 plan，禁止 current pointer / InMemory fallback |
| `CFG-CHG-05` digest / technical retention compatibility | A01 + data / retention authority | high；移除 readable / 改 incompatible write 为 critical；A03 + data + historical | compatible additive / duration change只影响 new material；incompatible profile migration blocked | finite digest / retention family、add/remove/extend/shorten category、active-reference gate result | prior compatible candidate；不得重算 old digest、缩短 active obligation或删除仍需 reader |
| `CFG-CHG-06` execution / claim / retry budget | A01 + execution operations authority | medium；A03 + entry；claim/store capability加 data；blind retry / fence bypass prohibited | complete assembly；只冻结到 new accepted Job / loop | field family、increase/decrease category、validation / capability / activation result | prior candidate；existing plan / claim / retry budget / report保持 stored snapshot |
| `CFG-CHG-07` resolver / external adapter | A01 + integration owner | high；A03 + entry + safety；影响 historical effect 时加 historical；destination/idempotency drift critical | descriptor / sensitive / capability gates + complete assembly | adapter family / mode category / capability / overlap result / safe issue；无 endpoint / ref fingerprint | prior candidate重建；old work仍 exact binding；不能 reroute / fallback current adapter |
| `CFG-CHG-08` publication / handoff / export target catalog | A01 + target integration owner | high；A03 + entry + safety + historical；old-token incompatibility critical | whole catalog validate / totality + complete assembly；new accepted effect pin new binding | finite target family / phase / outbound event names、added/removed counts、totality / activation result | prior whole catalog重建；old outbox / intent / preparation不改 target / token；retirement另审 |
| `CFG-CHG-09` API / Consumer / Job / schedule entry catalog | A01 + entry owner | high；A03 + entry；transport / actor policy加 safety；协议扩张 design-change-only | exact static map / private slot / registrar totality + new process；host 切 entry ownership | operation family / finite operation names or counts、totality / registration / switch result | prior candidate重新 register；old accepted event / Job不重消费 / 重列；无 partial root |
| `CFG-CHG-10` credential-only provider rotation | A01 + security / provider authority | high；A03 + safety + historical；same-ref recovery loss critical | provider-controlled rotation + reconstruct complete new assembly；same binding only under strict proof | family、rotation class、same-ref eligibility / overlap / activation result；无 locator / fingerprint / provider body | prior credential candidate or provider rollback须可重建；active / ambiguous old token保持可 probe / finalize |
| `CFG-CHG-11` forward activation / rollback activation | A06 only after A05 approval；rollback可由 incident authority request | inherits max candidate risk；rollback重新走 A03 / applicable A04 / A05 | 第 4 批 exact host switch / drain；forward 与 rollback 同一 cold protocol | attempt / phase / result、old / candidate safe config refs、safe issue；ready不等于activated | before switch abort candidate；after switch用 approved prior candidate启动新 activation；不 pointer flip |
| `CFG-CHG-12` historical binding retirement | A09 after complete obligation scan | high；A04 historical required，按 source class加 safety / data；A05 distinct approval | 不触发 runtime config activation；只在第 6 批 retirement gate后移除 exact resolution capability | binding family、obligation categories / counts、scan / decision / retirement result；无 full binding ref | 尚未删除则 cancel retirement；已删后不是 config rollback，必须按 operations restoration / manual authority处理且不得伪造可恢复 |
| prohibited / design-change-only request | A01 / detector | classification only；没有 approval path | reject before candidate activation | prohibited category、safe reason / issue、request actor ref | no runtime rollback；返回 formal `00~03` / current `04` owning Step 重新设计 |

### 7.7 第 2 批局部一致性检查

| 检查项 | 当前结论 |
|---|---|
| product-neutral actor 是否唯一分工 | `pass_for_batch_02`；A01~A09 覆盖 submit / custody / review / approve / activate / host / audit / retire |
| high / critical 是否存在独立 review / approval | `pass_for_batch_02`；high 三方分离，critical 双 approver，VETO 无批准路径 |
| 风险是否按 whole candidate 最高值计算 | `pass_for_batch_02`；class union + reviewer union + max risk |
| candidate source 是否仍符合 Step 05 / 09 | `pass_for_batch_02`；whole strict candidate + exact ENV snapshot + DECL，runtime / entry / admin 均非 source |
| SOP 六列表是否完整 | `pass_for_batch_02`；12 change class + prohibited row均有发起 / review / activation / audit / rollback disposition |
| 是否把审计字段 / host protocol / rollback eligibility 提前声称闭合 | no；分别保留第 5 / 4 / 6 批 exact proof |
| 是否把 migration 当普通 rollback | no；store / schema / incompatible digest在 Step 13 / `07` 前 blocked |
| 是否误写具体产品 / artifact / actor 实例 | no；concrete control plane 与 custody mechanism仍 `not_selected / not_established` |
| 是否伪造执行 / audit / evidence / test result | no；仅设计 role / future event contract |
| 上游 blocker | `none` |
| Step 10 总门禁 | `not_evaluated`；等待第 3~7 批 |
| next_allowed_action | `consumed_by_batch_03` |

## 8. 配置域 changeability 与上游回指

### 8.1 Failure-handoff 词表

第 3 批只定义 Step 10 向未来 Step 11 交付的 failure subject，不读取 Step 11 正文，也不预先决定其告警、降级或测试矩阵。每个域至少回指一个 handoff ID；第 11 Step 启动后必须从 current Step 10 消费并重新审查。

| Handoff ID | Step 10 failure subject | 当前必须行为 | Step 11 后续必须补齐 |
|---|---|---|---|
| `CFG-FH-01 candidate_rejected` | source / parse / type / range / cross-field / profile / redline / identity 不通过 | activation 前停止，zero new root，old lifecycle unchanged；不得称 rollback | impact、operator surface、alert condition、retry / correction boundary、test cut |
| `CFG-FH-02 assembly_unavailable` | sensitive ref、store capability、adapter construction、required capability、entry registration失败 | candidate cleanup；zero exposure；old admission不变；safe issue only | dependency-specific fail-fast / degraded taxonomy、alert、recovery test |
| `CFG-FH-03 activation_indeterminate` | host ownership switch、old admission close或phase acknowledgement不确定 | 不推进下一 phase；按第 4 批 ownership probe / abort；不得双 owner或猜成功 | exact detection、degraded surface、operator escalation、failure injection |
| `CFG-FH-04 drain_incomplete` | old synchronous work未在policy窗口内排空，或old host stop状态不确定 | new admission与old accepted work分离；不得kill并声称rollback；保留safe count/category | timeout / cancellation / force-stop authority、availability / alert、test cut |
| `CFG-FH-05 historical_unavailable` | accepted Job / outbox / intent / preparation 的exact stored config / binding无法解析 | external call前停止；retain durable material；manual / consistency；no current fallback | degraded/manual surface、restoration authority、alert与recovery test |
| `CFG-FH-06 migration_or_retirement_blocked` | migration closure缺失，或active / ambiguous / replay / manual / retention obligation阻止retire | 不激活 migration-only candidate或不执行retirement；保持old reader / binding | long-lived degraded / blocked behavior、operator alert、recheck schedule、test cut |

`CFG-FH-*` 是文档 handoff ID，不是 `RuntimeAssemblyError` variant、public issue enum、metric label或业务 state。Step 11 不得把它们直接复制成代码类型；若需要新 public / internal contract，必须先完成 `03` impact 判定。

### 8.2 `CFG-D01~D23` changeability 与 Step 07/08/09/11 回指表

| Domain | Step 07 exact field / material | Change class / risk | Step 08 sensitive / history rule | Step 09 activation / failure | Step 11 handoff / current disposition |
|---|---|---|---|---|---|
| `CFG-D01` source acquisition | compile-time registry、one strict JSON、61 exact ENV；无第二 source field | CHG-11 lifecycle；source mechanism变化为 design-change-only | source只携 opaque ref，不得携material或provider result | coherent capture + winner no fallback；cold load only | FH-01；unknown/duplicate/incoherent / unsupported source reject，不能fallback / hot reread |
| `CFG-D02` config identity | no raw field；derived whole-candidate `ConfigBindingRef` | CHG-11；identity algorithm/domain变化为 critical migration/design change | 排除source/path/locator/material/fingerprint | stage4 deterministic identity；collision / semantic same-ref阻断activation | FH-01/FH-06；不允许random/time/path ref，不允许silent reinterpret old snapshot |
| `CFG-D03` runtime / technical | `profile`;clock / ID mode + binding ref | CHG-01；mode medium，R ref high | two R refs；old in-flight request只随old runtime drain | profile P01~P04 + constructor complete assembly | FH-01/FH-02；不得fallback first adapter、reuseold handle或由lane降低风险 |
| `CFG-D04` protocol boundary | four boundary scalars + `accepted_inbound_schema_versions` | CHG-02；scalar low/medium，schema set high；protocol expansion design-only | no sensitive field；不得从payload/header推secret | validated API/worker slice；request只可formal收窄 | FH-01；schema mismatch不parse，limit invalid不截断；future Step11审告警/impact |
| `CFG-D05` entry dispatch / scheduling | enabled Command/Query/Job sets、Consumer/schedule catalogs、outbox cadence/limit | CHG-09 high；cadence-only medium；protocol enum expansion design-only | transport S-L、actor/schedule R；entry不得读provider/env | raw/private/safe/catalog totality + registrar all-or-none | FH-02/FH-03/FH-04；registration failure zero root；host ownership切换另见第4批 |
| `CFG-D06` redaction / body-free | redaction + body-free scanner policy refs | CHG-03 high；disable / relax prohibited | safety-critical R；no Disabled/test bypass/body escape | resolve before façade；redline fail closed | FH-01/FH-02；不得degraded bypass或把old policy热装到candidate |
| `CFG-D07` correlation / visibility / label | source allowlist + safe-label/correlation/visibility policy refs | CHG-03 high；扩大到unsupported source / truth inference prohibited | three R refs；no identity / authorization body | X11 + policy resolution；safe mapper/set only | FH-01/FH-02；无default truth、NotVisible不变Missing、无high-cardinality fallback |
| `CFG-D08` atomic observation / idempotency stores | observation + idempotency_result store mode/ref | CHG-04 critical migration | store locator S-L；no DSN / InMemory fallback；old rows不迁移暗示 | schema / atomicity / CAS gate before write façade | FH-02/FH-06；destination/mode change在Step13/`07`前不得激活，能力不足fail-fast |
| `CFG-D09` projection store | projection store mode/ref | CHG-04 critical migration | store locator S-L；unavailable不等于Fresh | X14/X15 + qualified projection repository | FH-02/FH-06；no inline repair / false Fresh；destination migration blocked |
| `CFG-D10` Job execution / report store | job_execution store mode/ref | CHG-04 critical migration | store locator S-L；must retain plan/claim/report recovery | enabled Job requires durable claim/fence/report capability | FH-02/FH-06；no process lock/current resume；migration blocked until complete recovery plan |
| `CFG-D11` transaction / schema | `transaction_timeout_ms`;`required_schema_revision` | timeout CHG-04 medium；revision critical migration | descriptor private；timeout/revision非credential | X13~X15；mismatch exact error，no auto migration | FH-01/FH-02/FH-06；timeout不证明rollback，revision变化不自动repair/migrate |
| `CFG-D12` digest compatibility | `write_profile`;`readable_profiles` | CHG-05 high；incompatible write / removal critical migration | no secret digest surrogate；old profile在引用期保留 | X09 + readable history gate；never recompute old digest | FH-01/FH-05/FH-06；reader缺失manual/block，profile migration未闭合不得激活 |
| `CFG-D13` technical retention | five idempotency / intent durations | CHG-05 high；shorten with active obligation critical/prohibited | numeric N；retention不授权secret / binding retirement | X03/X04 + active reference guard；new material only | FH-01/FH-06；不删除active reservation/intent，不改变business retention marker |
| `CFG-D14` projection / freshness | six projection limits + freshness policy ref | numeric CHG-02 medium；policy CHG-03 high | policy R；no policy body/default Fresh | X05 + policy resolution；new Job snapshot | FH-01/FH-02；overflow whole boundary fail，accepted Job不resize/relist |
| `CFG-D15` claim / concurrency / budget | claim lease、parallelism、plan items、job timeout | CHG-06 medium；fence/claim weakening prohibited | no locator；claim/fence token不是config / audit output | X04/X06 + durable capability；accepted Job freezes | FH-01/FH-02；no hot reread/process-lock，timeout不证明external abort |
| `CFG-D16` retry | four complete family-specific retry objects | CHG-06 medium；blind retry / provider override prohibited | numeric N；provider不可重写recovery | X07 + formal recovery ceiling；Job snapshot | FH-01/FH-05；Unknown/Unsupported / commit unknown仍禁止retry，不改existing budget |
| `CFG-D17` safe resolvers | four root adapter mode/ref/credential/timeout/capability objects | CHG-07 high；destination/idempotency semantic drift critical | binding R + credential S-L；private material/formal outcome only | RQ04/X08/X16/P + descriptor/capability gate | FH-01/FH-02/FH-05；no fallback body/provider/current adapter，old exact recovery独立保持 |
| `CFG-D18` publication | event publisher + 12-subject outbound target catalog | CHG-07 + CHG-08 high；old-token incompatible destination critical | effect R + transport/credential S-L；old outbox pins exact binding | 12-event totality + publisher capability + historical X21 | FH-02/FH-05/FH-06；no reroute/fake Published，retirement scan覆盖Pending/Failed/ambiguous |
| `CFG-D19` report handoff | whole typed report target catalog | CHG-08 high；destination/idempotency drift critical | consumer/effect R + mixed adapter；same binding across prepare/deliver | consumer uniqueness + exact two phases + history | FH-02/FH-05/FH-06；receipt不等于signoff，old preparation不得重定向 |
| `CFG-D20` peripheral export | whole typed peripheral target catalog | CHG-08 high；destination/idempotency drift critical | consumer/effect R + mixed adapter；external truth不进入core | target isolation + exact phases + history | FH-02/FH-05/FH-06；Delivered不等于verdict，target failure不污染core truth |
| `CFG-D21` sensitive refs | all Step07 R/S-L/mixed winners + provider-side credential material | CHG-01/03/04/07/08/09 + CHG-10；取最高风险 | identity后owner-specific resolution；no raw material / full ref / fingerprint；rotation按§8.9 | stage5 private resolution + reverse cleanup；entry只见safe metadata/registrar | FH-01/FH-02/FH-05；same-ref rotation必须证明destination/token/overlap，否则new binding或manual |
| `CFG-D22` lifecycle / history | no raw field；candidate config ref、stored config/effect binding/token | CHG-11 + CHG-12；inherits max/high | old work pin exact snapshot/binding；retirement independent | new runtime只eligible；failed candidate no swap；old missing no call | FH-03/FH-04/FH-05/FH-06；第4/6批闭合switch/drain/rollback/retire |
| `CFG-D23` environment / verification view | no lane field；`profile` references six-lane matrix | follows touched class；lane本身无change class | same no-secret parity；无instance evidence | same loader/schema/source/P01~P04；view not source | FH-01/FH-02；profile mismatch reject；不能用test/debug/emergency降低门禁或伪造result |

### 8.3 Root / nested family coverage

| Step 07 root / derived family | Covered domains | Change classes | Coverage assertion |
|---|---|---|---|
| `profile` / `technical` | D03/D23 | CHG-01/11 | mode/ref/null与profile组合均覆盖；binary DECL变化不能当ENV override |
| `boundary` | D04 | CHG-02 | four scalars + schema set覆盖；schema/protocol expansion不由config发明 |
| `safety` | D06/D07/D21 | CHG-03 | five policy refs + source set完整；无Disabled/relax/fingerprint |
| `stores` | D08~D11/D21 | CHG-04 | four store objects + timeout/revision逐类覆盖；destination/mode/revision migration blocked |
| `digest` | D12 | CHG-05 | write/read profiles覆盖；readability / removal不是普通rollback |
| `idempotency` | D13 | CHG-05 | five durations覆盖；active reference guard优先于new值 |
| `projection` | D14/D21 | CHG-02/03 | six limits + freshness policy ref覆盖；Job snapshot immutable |
| `execution` | D15/D16 | CHG-06 | claim two leaves、three scalar budget、four complete retry objects全部覆盖 |
| root `external` adapters | D17/D21 | CHG-07/10 | five root slots的mode/ref/credential/timeout/capability覆盖 |
| outbound target catalog | D18/D21 | CHG-07/08/10 | 12 event subjects、effect + transport binding与publisher全部覆盖 |
| report / export catalogs | D19/D20/D21 | CHG-08/10 | consumer/effect/adapter nested leaves及phase capability全部覆盖 |
| `entries` | D05/D21 | CHG-09 | Command/Query/Job sets、9 Consumer five-field entries、schedule two-field entries、loop two scalars覆盖 |
| source / config identity / lifecycle / lane view | D01/D02/D22/D23 | CHG-11/12 or inherited | 四个无普通raw owner的域均显式审计，没有虚构field |

### 8.4 Migration / design-change classification

| Trigger | Current classification | 为什么不能普通 cold rollback | Required closure before activation |
|---|---|---|---|
| durable store `mode` / `binding_ref` 改变destination或atomic group | `critical_migration` | old rows/plan/result/outbox可能在原store，pointer回退不能证明跨store一致性 | Step13 data movement / dual-read / cutover / abort semantics + `07` boundary / capability / rollback |
| `stores.required_schema_revision`变化 | `critical_migration` | current builder只验证exact revision，不执行DDL或truth migration | Step13 schema evolution + `07` migration command / artifact / verification / pause |
| `digest.write_profile`变化或移除in-use readable profile | `critical_migration` | old digest不可重算，reader compatibility跨active retention | Step13 dual-reader/writer / deprecation + active reference scan + `07` implementation/test gate |
| external destination / idempotency namespace变化且old token不兼容 | `critical_binding_migration` | old intent/token/probe必须在old destination完成，current target不能替代 | new binding identity + historical overlap / restoration + Step13/`07` rotation/cutover boundary |
| protocol enum / schema新增、state / truth / UoW / no-write / redaction invariant变化 | `design_change_only` | 超出validated config schema和formal code contract | 返回 formal `00~03` owning Steps，重建current `04~07`相关contract |
| remote/admin/hot/in-process swap或new public config audit owner | `design_change_only` | 需要新loader/port/state/error/concurrency/persistence/telemetry contract | 回写 formal `01/03` + current `04`；未确认前hard block |

Migration class candidate可以被解析和静态分类，但在 required closure 不存在时不得获得 activation approval，也不得以“先切换、失败再回滚”规避。Current `upstream blocker=none` 指 Step 10 设计可以继续；这些是 future activation / implementation boundary blockers，不是本 Step 的上游文档冲突。

### 8.5 第 3 批局部一致性检查

| 检查项 | 当前结论 |
|---|---|
| `CFG-D01~D23` 是否exact覆盖 | `pass_for_batch_03`；23个唯一域逐行回指 |
| Step07 root / nested family 是否全覆盖 | `pass_for_batch_03`；11 raw roots + derived source/identity/lifecycle/view均有owner |
| Step08 sensitive / history 是否逐域回指 | `pass_for_batch_03`；R/S-L/mixed、rotation、old binding均未省略 |
| Step09 activation / failure 是否逐域回指 | `pass_for_batch_03`；完整assembly / no partial / snapshot语义保持 |
| Step11 handoff 是否诚实 | `pass_for_batch_03`；仅定义FH-01~06输入，未读取Step11、未声明其完成 |
| migration class 是否单独阻断 | `pass_for_batch_03`；store/schema/digest/external binding迁移不进入普通rollback |
| 是否新增 raw field / public error / business state | no |
| 上游 blocker | `none` |
| next_allowed_action | `consumed_by_batch_04` |

## 9. Cold activation 与 host lifecycle 协议

### 9.1 Activation phase 词表

下列 phase 是外部 configuration control plane / process host 对一次 activation attempt 的有限事实词表，不是 L4 business state、public API enum、进程内 registrar 方法或已选产品的部署状态。一次 attempt 绑定 one protected candidate、one approval set 和 one process generation；forward 与 rollback 使用同一词表，只以 `activation_kind=forward|rollback` 区分。

| Phase ID / phase | 进入前提 | 本 phase 动作 | 完成事实 | 失败 / 不确定时 |
|---|---|---|---|---|
| `CFG-ACT-P01 candidate_locked` | A02 已封存 exact whole candidate | 固定 candidate ref、source occurrence custody、supersession / expiry state | 本 attempt 后续只读取该 exact candidate | custody 不完整则 `CFG-FH-01`，不创建 new process |
| `CFG-ACT-P02 authorization_verified` | P01；class / risk 已计算 | 核对 A03/A04 review、A05 approval、migration disposition 与 separation-of-duty | approval 对 exact candidate、binary scope 和 activation kind 仍有效 | 缺失、过期、被 supersede 或 actor 冲突则 reject |
| `CFG-ACT-P03 new_process_building` | P02；host isolation 可用 | 在 separate process / root 执行 Step 09 全部 13-stage assembly 与 entry registration | complete root 构建结束，尚无 host admission ownership | assembly failure 清理 candidate resources；old lifecycle 不变 |
| `CFG-ACT-P04 candidate_ready` | P03 complete-or-error 成功 | host 核对 process 存活、完整 root、registration totality 与 body-free readiness | candidate generation eligible for ownership；zero new admission | readiness 缺失则停止 candidate；不得写 activated / rollback success |
| `CFG-ACT-P05 old_admission_closing` | P04；无 unresolved earlier attempt | host 对 API、Consumer、scheduler、outbox loop 发出 old admission close / ownership revoke | 四类 old admission 均进入 closing，old accepted work仍受保护 | 任一 ownership 结果未知则 P07 前停止并进入 `CFG-FH-03` |
| `CFG-ACT-P06 old_admission_closed` | P05 | 逐类 probe old generation 已不再接纳 new work | 四类 required ownership 均有 finite closed / revoked fact | 不能证明 closed 时不得 grant candidate ownership |
| `CFG-ACT-P07 new_ownership_granting` | P06；candidate 仍 ready | 向 candidate generation 授予四类 required admission ownership | 每类 grant 均绑定同一 attempt / candidate generation | partial / unknown grant 立即冻结后续 grant并进入 reconciliation |
| `CFG-ACT-P08 activated` | P07 | probe candidate 对全部 required ownership 是唯一 owner | candidate 对 new work 生效；old accepted work可继续 drain | 任一类未证实 exclusive 时不得写 activated |
| `CFG-ACT-P09 old_draining` | P08 | old generation只处理 P06 前已 accepted 的 process-local work，并把 durable work留在正式状态 / snapshot 中 | no new old admission；drain category / safe count 可观测 | timeout / unknown进入 `CFG-FH-04`，不得改 durable truth |
| `CFG-ACT-P10 old_drained` | P09 | 证明 old process 无仍依赖其内存才能安全完成的 accepted work | process-local drain 完成；durable historical obligation可仍存在 | 无证明则保持 old process受控或按未来 Step 11 authority 处理 |
| `CFG-ACT-P11 old_process_stopped` | P10 | host 停止 old process generation | process stop 已确认；old candidate artifact / historical binding未自动删除 | stop unknown 不得写 retirement 或 completed |
| `CFG-ACT-P12 attempt_completed` | P08 且 P10/P11 的 required disposition已记录 | 关闭 activation attempt，保留后续独立 historical obligation | forward / rollback lifecycle已形成可审计终态 | audit 缺口或 unresolved ownership使 attempt保持 open / indeterminate |

允许的 attempt terminal result 只有 `rejected_before_build`、`build_failed`、`aborted_before_new_admission`、`activation_indeterminate`、`activated_drain_incomplete`、`completed` 和 `rollback_required`。这些 result 不替代 phase fact；尤其 `build_failed` 不是 rollback，`activated` 不是 drained，`old_process_stopped` 不是 historical binding retired。

### 9.2 四个必须分离的事实

| Fact | Exact meaning | 可由什么证明 | 明确不证明 |
|---|---|---|---|
| `candidate_ready` | separate candidate process 已完成 Step 09 whole assembly / registration，且保持 admission-isolated | P03/P04 finite result + process-generation readiness probe | 已获 route / partition / schedule / loop ownership；业务成功；审批完成 |
| `activated` | candidate generation 是四类 required admission 的唯一 new-work owner | P06 closed set + P07 grant set + P08 exclusivity probe | old accepted work已完成；old process已停止；external effect成功 |
| `drained` | old process已无必须依赖该 process memory继续执行的 accepted work | P09 drain inventory + P10 finite result | durable Job/outbox/intent/preparation历史已终结；binding可退役 |
| `retirable` | A09 的独立 historical obligation scan 为零，并经 A04/A05 单独批准 | 第 11 节 retirement eligibility、scan 与 approval | activation / rollback / process stop自动允许删除；candidate artifact可随意丢弃 |

任何实现、runbook 或审计查询都不得把四个字段压成单一 `deployed=true` / `healthy=true`。Readiness / health / telemetry 只能作为 control-plane decision 的输入，不能自行产生 activation authority。

### 9.3 Candidate protection 与 activation preconditions

| Precondition ID | Required proof before P03 / P05 | Failure disposition |
|---|---|---|
| `CFG-ACT-G01` exact custody | protected artifact immutable、approved bytes与loaded bytes属于同一 custody chain | reject candidate；不从 runtime memory、workspace 或 old process反构 |
| `CFG-ACT-G02` authorization freshness | class/risk/reviewer union、A05 approval、expiry、supersession和activation kind一致 | reject / request review；不允许 operator emergency bypass |
| `CFG-ACT-G03` current compatibility | current binary、loader schema、profile、store / adapter descriptors可验证 candidate | full Step 09 reject / unavailable；不调用 old validator结果 |
| `CFG-ACT-G04` migration closure | candidate 未命中 migration-only，或 Step 13 + formal `07` 已有已确认的独立 migration boundary | 未闭合时 block activation；不以 rollback plan代替 migration plan |
| `CFG-ACT-G05` host isolation | separate process可在 zero admission 下完成 assembly，且 host能关闭 / 授予四类 ownership | affected implementation boundary blocked；不发明 in-process standby API |
| `CFG-ACT-G06` ownership inventory | old generation、四类 required ownership、pending attempt和当前 admission state均可 finite probe | 不开始 P05；unknown 不按 old/new default解释 |
| `CFG-ACT-G07` rollback disposition | high/critical candidate有 prior protected candidate availability或明确 no-rollback / forward-repair disposition | approval blocked；不能写 generic LKG |
| `CFG-ACT-G08` historical resolution | accepted durable work所需 exact config/effect binding仍可解析，retirement没有越过 active obligation | block affected activation / rotation；不得 current fallback |
| `CFG-ACT-G09` authoritative audit availability | 第 10 节要求的 pre-mutation authority records可 append并关联 attempt | P05 前停止；runtime telemetry不能补权威记录 |

P03/P04 的 new process 必须使用 candidate自己的 current source snapshot、private sensitive resolution和fresh runtime handles。它不能借用 old process 的 clock、ID generator、store session、adapter、registrar、consumer handle、scheduler lease或outbox loop lease。Host 可以在外部隔离该 process，具体容器、service、route、lease或orchestrator产品保持 `not_selected`。

### 9.4 Host ownership switch matrix

四类 ownership 构成 one activation set。P0 优先使用 host 能证明的 atomic replace；若产品不能跨四类原子替换，则必须使用 `close_all_old -> prove_closed -> grant_new`，接受有界无 admission 窗口，禁止 old/new 同时接纳。若连 close/probe/grant 的 exclusive ownership 都无法证明，对应 production activation boundary 在 formal `07` 中必须阻断。

| Ownership class | Old admission close / proof | Candidate grant / proof | 已 accepted work disposition | 禁止 |
|---|---|---|---|---|
| API route ownership | 撤销 old generation 的 new-request route；probe old不再收到新 request | 只把 route ownership授予 candidate generation；probe新请求只命中该 generation | P06 前已进入 old façade 的 request留 old process drain；不得转移半执行 UoW | weighted old/new canary、request级 config override、仅凭 readiness endpoint猜 route state |
| Consumer ownership | revoke old assignment / lease并确认 old不再接收新 envelope | candidate获得 exact enabled Consumer set的唯一 assignment / generation | old已 accepted envelope按 formal ack/UoW边界完成或保留正式 retry/dead-letter状态 | 双 consumer generation、重放来验证切换、改 source event / ack truth |
| Scheduler admission | 关闭 old schedule trigger / lease并证明不再产生新 Job admission | candidate按 exact enabled schedule catalog取得唯一 trigger authority | 已 durable accepted Job继续 stored snapshot；未接受 tick可由new generation未来触发，不伪造补跑 | 同一 schedule 双 owner、把 process clock 当 ownership proof、重列 existing Job plan |
| Outbox loop ownership | old generation停止 claim new outbox item并释放 / fence loop ownership | candidate获得唯一 claim loop generation；formal item claim/fence仍适用 | 已 claim item按 stable token / exact binding完成、probe或进入 formal ambiguous/manual | 抢占未过期 claim、换 token / target、以 current route处理 old item |

不同 ownership class 不允许选择不同 candidate generation。P07 若只完成部分 grant，已由 candidate接纳的 work仍按 candidate snapshot保存；control plane 必须进入 reconciliation，不得删除记录、把该 work重新送给 old generation或宣称 whole activation从未发生。

### 9.5 Old admission、drain 与 stop

| Drain subject | P06 后允许 | Drained criterion | 不完整时处理 |
|---|---|---|---|
| synchronous API / Query / Command | 只完成 P06 前已进入 old façade 的调用和其既定 UoW / response | active process-local request count为零，所有已开始 UoW有formal outcome | 保持 old process隔离且不接新流量；不得 kill 后写 success |
| Consumer item | 完成已 accepted envelope的当前 formal transaction / ack decision | 无只存在 old process memory中的 uncommitted ownership；后续 retry由durable transport/formal state承接 | 保留 formal retry/dead-letter/unknown；不伪造 ack或重投 current config |
| scheduler / Job | 不再产生新 admission；已 accepted Job继续 durable plan / snapshot | old process无未持久化 Job admission或仅内存中的 claim authority | 释放/过期必须按formal lease/fence；不把 Job terminal作为process drain前提 |
| outbox / external effect | 已 claim work按 stored token / binding进行known-success finalize、probe或formal manual handoff | 无必须依赖 old process内存才能解释的 call outcome；durable intent/preparation保留 | ambiguous保留并停止 blind retry；不能为 drain 改 target/token/result |
| runtime resources | reverse close old entry handles、adapter sessions与private material | host确认process可停止且无 admission ownership | cleanup failure记录safe category；不输出locator/material/body |

`drained` 只关闭 process-local lifecycle，不等待所有历史 Job、outbox、intent、preparation、report、receipt或retention marker终结。后者可能跨多个 process generation长期存在，只能由 exact historical resolution和第 11 节 retirement scan管理。

### 9.6 Abort、indeterminate 与 reconciliation

| 观察点 | Classification | Required action | 明确禁止 |
|---|---|---|---|
| P01/P02失败 | `rejected_before_build` | 记录拒绝，candidate保持受保护或按custody policy处置；old不变 | 写 rollback success、启动部分 root |
| P03/P04失败 | `build_failed` | reverse cleanup candidate process；确认zero exposure；old admission不变 | 自动 LKG、把 old仍运行当 rollback event |
| P05前 operator取消 | `aborted_before_new_admission` | 停 candidate；old lifecycle不变 | 把 ready写 activated |
| P05/P06中部分 old ownership未知 | `activation_indeterminate` | 冻结 P07；逐类 authoritative probe；恢复到 exactly one known admission owner或保持closed并升级 | 猜 old仍owner、同时 grant new、依赖telemetry sample |
| P06已完成且尚无 candidate admission | `aborted_before_new_admission` | 可在显式 abort-restore decision和ownership probe后恢复 incumbent old admission；这不是 config rollback | 把恢复 old admission写成 prior candidate reactivation成功 |
| P07 partial grant但 candidate可能已接纳work | `activation_indeterminate` | 停止新增 grant；保存candidate work；reconcile为完成forward或启动第11节正式rollback | 丢candidate work、直接复开old造成双owner、声称attempt未发生 |
| P08后发现效果异常 | `rollback_required` | 保持事实，按第11节选择prior protected candidate并新建rollback attempt | pointer flip、复用未重建old process、改business result |
| P09/P10超时 | `activated_drain_incomplete` | candidate继续是new-work owner；old保持no-admission；交 `CFG-FH-04` | 把 drain failure当activation未发生或自动rollback |
| ownership / audit事实冲突 | `activation_indeterminate` | 以host authoritative ownership probe和external control-plane record reconciliation；暂停下一phase | 用L4 log/metric/span回写权威状态 |

Reconciliation 的目标不是“尽快写 success”，而是恢复四项可证明事实：每类至多一个 admission owner、每个 accepted work绑定其实际 generation / snapshot、每个 physical transition有权威 event、未证明的 phase保持 indeterminate。无法闭合时保持 admission closed或受控的已知 owner，并交未来 Step 11定义可用性、告警和人工 authority。

### 9.7 第 4 批局部一致性检查

| 检查项 | 当前结论 |
|---|---|
| phase 是否finite且可逐阶段审计 | `pass_for_batch_04`；P01~P12与7个terminal result分离 |
| candidate ready / activated / drained / retirable是否混淆 | no；四事实有独立proof和反例 |
| 四类admission ownership是否闭合 | `pass_for_batch_04`；API / Consumer / scheduler / outbox均有close、grant、accepted-work和禁项 |
| 是否允许old/new双owner | no；atomic replace或close-all-then-grant，unknown立即冻结 |
| failed candidate是否被误称rollback | no；P08前按reject/build-fail/abort分类 |
| drain是否改写durable work | no；只收口process-local work，history仍exact binding |
| 是否发明formal `03`未定义的standby/activate registrar API | no；仅定义external host lifecycle fact；具体产品/API留`07`验证 |
| Step 11是否被提前读取或定义 | no；只交付FH-03/FH-04 failure subject |
| 上游 blocker | `none` |
| next_allowed_action | `consumed_by_batch_05` |

## 10. 外部权威审计与 runtime telemetry 分层

### 10.1 Authority、owner 与 landing

配置变更权威历史由 `CFG-A08 audit_recorder` 在 external host / deployment configuration control plane 中记录。该 control plane 同时拥有 change request、candidate custody metadata、review / approval、host ownership transition、rollback decision和retirement decision之间的有序关联；本仓只消费已批准候选并输出受限 runtime telemetry，不拥有这些 decision truth。

| Surface | Owner / landing | Authority | 不得承担 |
|---|---|---|---|
| configuration change history | external configuration control plane 的受保护审计存储 | request / review / approval / activation / rollback / retirement 的唯一权威历史 | L4 business truth、运行结果、evidence、verdict、signoff |
| candidate artifact custody | A02 管理的 external protected artifact facility | approved bytes、immutability、availability、supersession / expiry | 把 artifact locator / bytes / diff复制到通用audit或L4 telemetry |
| host ownership fact | A07 可 authoritative probe 的 route / assignment / schedule / loop control surface | physical close / grant / exclusivity / process stop事实 | 选择配置、批准变更、推断business outcome |
| L4 runtime telemetry | formal `03` Layer A，process / host-managed sink | validation / assembly / availability 的非权威安全补充 | 形成审批、激活、drain、rollback、retirement或acceptance authority |
| L4 durable repositories / UoW | formal `03` 已有 native business owner | 仅既有 observation-owned accepted fact / history | 新增 generic config audit、change row、rollback row或control-plane mirror |

“受保护审计存储”是语义要求，不表示当前已选择 ticket、GitOps、CI/CD、orchestrator、database 或日志产品。具体 product、physical schema、retention和report/export机制保持 `not_selected`，必须在 formal `07` / operations boundary 前建立；在此之前不能声称 auditable implementation 已存在。

### 10.2 权威 audit event 词表与事件矩阵

`CFG-AUD-*` 是设计事件 kind，不是本仓 Rust DTO、domain event、outbox event、metric label或已产生记录。每条记录以 `change_ref` 串联同一 change，以 `activation_attempt_ref` 串联一次 forward / rollback attempt；同一 physical action不得因重试生成彼此矛盾的成功事实。

| Event ID / kind | Producer | Emit timing | Required semantic payload | Failure handling |
|---|---|---|---|---|
| `CFG-AUD-E01 change_requested` | A01 / control plane | candidate进入review前 | change ref、initiator ref、declared class set、finite subject / field IDs、reason ref、request result | 缺失则不进入review；不从raw diff重建 |
| `CFG-AUD-E02 candidate_protected` | A02 | exact candidate custody完成后 | candidate control ref、custody result、source class、supersession / expiry state | custody fact缺失则P01失败；不记录artifact locator/bytes |
| `CFG-AUD-E03 review_recorded` | A03/A04 | 每个required review完成时 | reviewer ref、review kind / specialty、decision、risk / class disposition、constraint / issue ref | required review缺失或冲突则不能approve |
| `CFG-AUD-E04 approval_recorded` | A05 | P02前；forward / rollback / retirement各自独立 | approver refs、decision kind、approved candidate control ref、risk、required review-set result、expiry | append失败或双人分离不成立则不开始P03 |
| `CFG-AUD-E05 validation_completed` | A06 + control plane | Step 09 parse / validate / identity完成后 | attempt ref、candidate config ref?、runtime release ref、finite validation stage / result、safe issue ref | failure写finite reject；无raw field/value/error chain |
| `CFG-AUD-E06 candidate_ready_recorded` | A07 | P04 authoritative host check后 | attempt ref、process-generation ref、assembly / registration result、required ownership-set kind | runtime span OK不能替代该host fact |
| `CFG-AUD-E07 old_admission_closed` | A07 | P06每类probe收齐后 | attempt ref、four-class closed set / count、result、safe issue ref | partial / unknown写indeterminate并阻断grant |
| `CFG-AUD-E08 ownership_activation_recorded` | A07 | P08 exclusivity probe后 | attempt ref、activation kind、candidate / prior config refs?、four-class exclusive set / count、result | append/probe不确定时attempt保持indeterminate；不猜success |
| `CFG-AUD-E09 drain_recorded` | A07 | P09/P10 finite checkpoint | attempt ref、drain subject categories、bounded counts、result、safe issue ref | incomplete保持activated_drain_incomplete；不改durable work |
| `CFG-AUD-E10 attempt_closed` | A06/A07 + A08 | P12或terminal result确定后 | attempt ref、terminal result、last proven phase、ownership disposition、safe issue ref | unresolved phase不得压成completed |
| `CFG-AUD-E11 rollback_requested` | incident authority / A01/A06 | 判断需要恢复prior candidate时 | triggering attempt ref、finite reason category、requested prior candidate control ref、urgency class | request无activation authority；不包含incident正文 |
| `CFG-AUD-E12 rollback_decided` | A03/A04/A05 | 第11节eligibility重新审查后 | decision、eligibility / compatibility / migration result、new rollback attempt ref?、safe issue ref | rejected / blocked需保留；approved后仍走P01~P12 |
| `CFG-AUD-E13 retirement_scan_recorded` | A09 | 每次historical obligation scan后 | binding family、scan scope class、obligation category counts、coverage / result、safe issue ref | incomplete / nonzero只允许blocked；无full binding/target/ref |
| `CFG-AUD-E14 retirement_decided` | A04/A05 | 与activation分离的retirement review后 | decision、binding family、scan ref、review / approval result、expiry | activation approval不能复用为retirement approval |
| `CFG-AUD-E15 retirement_executed` | A09 | exact resolution capability移除尝试后 | binding family、execution result、post-check result、safe issue ref | unknown / failed进入operations restoration，不伪造retired |
| `CFG-AUD-E16 reconciliation_recorded` | A07/A08 | ownership或audit事实曾indeterminate且完成probe时 | attempt ref、previous unknown category、authoritative ownership disposition、reconciliation result | 不删除原unknown记录；追加纠正事实和关联 |

Forward activation和rollback activation都复用 E05~E10，不创建一套更宽松的 rollback event。E11/E12只表达 rollback request / authority decision，不能替代 prior candidate重新验证、new process ready、exclusive ownership和drain事实。Retirement E13~E15独立于process stop。

### 10.3 Safe field allowlist 与 requiredness

| Field family | Required when | Allowed form | 禁止形式 |
|---|---|---|---|
| `event_kind`,`event_time`,`event_sequence` | all events | finite kind、control-plane time、owner-local monotonic ordering | 用runtime log arrival time推断physical order |
| `change_ref`,`activation_attempt_ref`,`related_attempt_ref?` | change / activation events | external control-plane body-free opaque ref | real test run id、evidence alias、ticket正文、ref hash |
| actor / reviewer / approver ref | request/review/approval/decision | control-plane authorized identity ref，按访问策略展示 | credential、identity body、token、email/free text替代authority |
| candidate control ref | custody/review/approval/rollback | 指向受保护candidate metadata record的opaque ref | artifact path、URL、repository locator、raw candidate / diff |
| `config_ref?` | validation/activation，在owner policy允许且visibility guard通过时 | body-free whole-candidate `ConfigBindingRef` | per-field digest、canonical bytes、full effect/store/target/consumer binding ref |
| runtime release / process-generation ref | validation/ready/activation | external body-free release / generation ref | container dump、host path、endpoint、dynamic product payload |
| class / risk / specialty / decision / phase / result | corresponding events | 本Step finite vocabulary | raw reason、driver / provider message、unbounded dynamic tag |
| canonical field IDs / finite subject kinds | request/review | sorted unique IDs或subject family + bounded count | field value、old/new value、raw diff、secret presence detail |
| direction category | request/review when needed | `add/remove/enable/disable/increase/decrease/rotate/replace/no_effective_change` | old/new scalar、endpoint、topic、schedule、locator摘要 |
| ownership / drain category and count | E07~E10 | four finite ownership kinds、finite drain subjects、nonnegative bounded count | request body、event payload、Job plan/item refs、external token |
| obligation category and count | E13~E15 | `active/ambiguous/replay/manual/retention` + bounded count / scan completeness | exact token、intent、outbox、report、receipt或binding ref清单 |
| `reason_ref?`,`issue_ref?`,`constraint_ref?`,`scan_ref?` | decision/error/reconciliation | body-free ref owned by external control plane | reason/error/incident正文、stack、SQL、provider response |

Requiredness rules:

1. 每条 event 必须包含 event kind、time、producer actor ref、finite result和change / attempt关联中的至少一个；“operator did something”不是合法记录。
2. E03 必须逐 required specialty落一条decision；generic review不能覆盖 safety、data、entry或historical specialty。
3. E04 / E12 / E14 必须记录实际required approver集合是否满足，但不得伪造身份或签署。没有真实record时状态只能是pending / absent。
4. E05~E10必须带attempt ref和last proven finite phase；E08 success必须有四类exclusive ownership coverage，不能只记录`deployed`。
5. E13必须同时给scan completeness和五类obligation count；仅`zero found`但scope不完整不能进入E14。
6. Optional ref 不可读时省略或按finite restricted状态处理，不得hash / truncate / mask后输出；记录完整性由owner-side protected relation保证。

### 10.4 Runtime telemetry 非权威映射

| Control-plane concern | Existing L4 runtime supplement | 可表达 | 不能表达 |
|---|---|---|---|
| candidate validation | `observability_config_validation_total`；config validation log | finite stage / result / error kind | review通过、candidate获批、artifact custody |
| runtime assembly | `observability.runtime.assembly` span；`observability_runtime_assembly_total`；assembly log | complete builder/error、assembly stage、restricted config ref、safe issue ref | host candidate_ready、route/consumer/scheduler/loop ownership |
| adapter availability | `observability_adapter_availability_state` + safe log | finite family/mode/availability snapshot | operation success、rollback eligibility、historical recoverability |
| telemetry suppression / sink failure | two existing process-local counters | unsafe field/recursion/sink finite failure | audit append失败、change失败、business no-write violation |
| approval / activation / drain / rollback / retirement | no L4 runtime signal is authoritative；host可有自己的product-neutral telemetry | 最多作为external control plane的诊断输入 | 任何E03~E16权威event、evidence、verdict、signoff |

本 Step 不新增 metric、span、log name或L4 audit event。尤其不得新增高基数 `change_ref` / `attempt_ref` metric label；runtime `config_ref`只在formal `03`明确允许的restricted log/span位置出现。Host telemetry若未来需要进入本仓 formal contract，必须先回写`03`，不能由implementation私加。

### 10.5 Sensitive change 附加审计规则

| Sensitive change | 审计可记录 | 必须禁止 |
|---|---|---|
| safety / policy ref变化 | canonical field ID、policy family、direction category、review/result、safe issue ref | full policy ref、policy body、old/new ref、fingerprint、放松规则正文 |
| store binding / schema变化 | store slot、migration classification、compatibility result、schema-change category | locator/DSN/path、revision raw value、table/index/driver message |
| resolver / publisher / target catalog变化 | adapter/target family、add/remove counts、capability/result | endpoint/topic/route、full consumer/target/binding ref、credential、provider body |
| Consumer / schedule catalog变化 | finite operation family/name或count、enable/disable category、registration result | transport binding、topic、cron/schedule value、actor-policy ref、private slot |
| credential-only rotation | adapter family、rotation class、same-ref eligibility、overlap/result | credential ref/material/version、locator、secret fingerprint、provider receipt/body |
| historical binding retirement | binding family、five obligation counts、scan/decision/execution result | exact historical binding、token、intent/outbox/preparation/report列表 |

“redacted digest”“masked locator”“last four characters”“stable fingerprint”“base64摘要”都不是合法替代。若一个值因权限或敏感性不能原样进入allowlist，它也不能经任何可关联变换进入audit、log、metric、span、error、report或artifact。

### 10.6 No-hash-escape、self-recursion 与 report boundary

1. A08只向external control-plane landing追加记录，不调用本仓 Command / Consumer / Job / publication façade，不创建L4 outbox、Job、gap、no-write violation或business retry。
2. L4 runtime telemetry必须继续满足 `OBS-TELEM-001~006`；不得经同process、route、topic或sink callback回采为`SubmitObservationMaterial`、`RecordSafeSignal`或任一`Consume*` truth。
3. Audit append失败不得触发L4业务补偿。P05前失败阻断physical mutation；P05后失败保持真实ownership并标记indeterminate / reconciliation，不能用runtime telemetry补齐权威记录。
4. Audit recorder、telemetry emitter和sink failure handler均不能成为change approver或activation operator；“recorded”不是“authorized”。
5. External control plane未来可把自己的审计历史交给其report / compliance consumer，但该handoff产品、schema与retention不由本仓定义。L4 `ReportHandoffRecord`、`EvidenceIndexInputView`和peripheral export不得镜像raw config-change history。
6. `change_ref` / `attempt_ref`只提供审计链关联，不是evidence alias、real run id、acceptance verdict或signoff；任何报告引用都必须保持这一语义。

### 10.7 第 5 批局部一致性检查

| 检查项 | 当前结论 |
|---|---|
| authoritative owner / landing是否唯一 | `pass_for_batch_05`；external control plane唯一，L4 repository/UoW不新增owner |
| request到retirement事件是否闭合 | `pass_for_batch_05`；E01~E16覆盖change/review/approval/validation/activation/drain/rollback/retirement/reconciliation |
| pre/post mutation audit failure是否有确定处理 | `pass_for_batch_05`；P05前block，P05后保留事实并reconcile |
| safe field是否有requiredness和deny边界 | `pass_for_batch_05`；allowlist + event requiredness + sensitive附加规则闭合 |
| runtime telemetry是否冒充权威审计 | no；只复用formal `03`既有validation/assembly/availability/suppression信号 |
| 是否新增L4 metric/span/audit DTO/store/UoW | no |
| no-hash-escape与self-recursion是否保持 | yes；变换输出和own-facade回采均禁止 |
| 是否伪造event/ref/evidence/run/signoff | no；全部为future schema，产品/record均`not_selected/not_established` |
| 上游 blocker | `none` |
| next_allowed_action | `consumed_by_batch_06` |

## 11. Rollback、durable work 与 historical retirement

### 11.1 Rollback 语义与 eligibility

Rollback 是 `activation_kind=rollback` 的新 activation attempt：A02选择一个 prior protected candidate，A03/A04按**当前**影响重新review，A05重新approve，A06/A07在separate process执行 P01~P12。它不是撤销审计记录、恢复旧进程内存、切换LKG指针、反向patch字段、数据库回退或重写已接纳工作。

| Eligibility ID | 必须成立 | 不成立时的decision |
|---|---|---|
| `CFG-RBK-G01 prior_candidate_available` | exact prior whole candidate仍由A02保护，bytes / custody可读且未被修改 | `rollback_unavailable`；不得从old runtime、audit diff或current snapshot反构 |
| `CFG-RBK-G02 authority_complete` | E11 request后重新计算class/risk/reviewer union，A03/A04/A05对rollback kind作独立decision | `rollback_rejected`或`review_pending`；incident urgency不构成bypass |
| `CFG-RBK-G03 current_validation_passed` | prior candidate在current binary、loader/schema、profile/redline和Step 09全部规则下重新parse / validate / identify | `rollback_candidate_invalid`；不调用其上次validation结果 |
| `CFG-RBK-G04 current_assembly_ready` | current provider、store、adapter、entry capability下完成fresh 13-stage assembly和P04 ready | `rollback_candidate_unavailable`；current active generation的事实不被覆盖 |
| `CFG-RBK-G05 ownership_reconciled` | triggering attempt的四类ownership已有authoritative known disposition，或rollback plan明确从已知closed状态授予 | `rollback_blocked_indeterminate`；不得在unknown owner上再叠一层切换 |
| `CFG-RBK-G06 durable_history_resolvable` | prior/current两侧accepted work所需config/effect binding、digest reader和token probe能力仍可用 | `rollback_blocked_history`；不把prior route当old work fallback |
| `CFG-RBK-G07 non_migration_path` | change不属于未闭合的store/schema/digest/external-binding migration class | `rollback_blocked_migration`；只服从Step 13 / formal `07`独立migration disposition |
| `CFG-RBK-G08 audit_precondition` | E11/E12及P05前required authority record可写，rollback attempt ref已建立 | `rollback_pending_audit`；runtime signal不能补齐 |

Eligibility finite result 为 `eligible`、`rejected`、`unavailable`、`invalid_current_contract`、`blocked_indeterminate`、`blocked_history` 或 `blocked_migration`。只有 `eligible` 可进入P05；“以前成功运行”“artifact仍存在”“old process尚未停止”都不能单独证明eligible。

### 11.2 Before-switch reject、after-switch rollback 与失败矩阵

| Trigger / observation | 当前事实 | Required disposition | 不能声称 |
|---|---|---|---|
| candidate在P01~P04失败 | incumbent仍是四类new-work owner | reject / cleanup candidate，记录E05/E10 finite failure | rollback succeeded、prior restored |
| P05前取消 | ownership未变 | abort candidate；incumbent继续 | activation happened、business state reverted |
| P05~P07 ownership unknown | 不能证明incumbent或candidate唯一owner | 先按§9.6 reconcile；必要时保持admission closed | 直接启动另一个rollback generation |
| P08后出现配置效果异常 | candidate已是new-work owner | E11 request -> eligibility -> E12 decision -> new rollback attempt | 删除forward attempt、把异常改写成未激活 |
| prior candidate validation / assembly失败 | forward generation的activation事实仍成立 | rollback attempt在P04前失败；按Step 11未来规则决定forward继续、停admission或人工处置 | 自动尝试更老candidate、恢复old process handle |
| rollback P05~P07不确定 | ownership必须重新probe | 同forward reconciliation；保存两侧实际accepted work | rollback完成、forward仍owner或prior已owner的猜测 |
| rollback P08成功 | prior candidate generation只对随后new work生效 | drain被替换的forward generation；保持两代durable history | 所有forward-period work已回退 |
| rollback P09/P10不完整 | prior是new-work owner，forward generation仍有process-local drain责任 | `activated_drain_incomplete`，保持no-new-admission并交FH-04 | rollback失败等于重新切回forward |
| rollback后仍异常 | 已完成attempt事实不变 | 新request、新review和新的eligible candidate；必要时停止admission/manual | 循环LKG、无界automatic rollback chain |
| migration candidate已发生partial mutation | 数据/reader/destination可能分叉 | 按migration plan pause / reconcile / forward-repair / rollback boundary处理 | 普通cold config rollback可恢复一致性 |

每次rollback最多选择一个明确prior candidate，不允许“依次尝试所有历史版本”。若没有eligible candidate，系统保持当前可证明ownership或已知closed admission，并交未来Step 11定义degraded / fail-fast / manual surface；本Step不预设availability策略。

### 11.3 Prior candidate 重新构建顺序

```text
select exact prior protected candidate
  -> classify under current CFG-CHG rules
  -> repeat current reviews and rollback approval
  -> current source custody / strict parse
  -> current type / required / cross-field / profile / redline validation
  -> current whole-candidate ConfigBindingRef derivation
  -> current sensitive resolution / store / adapter capability gates
  -> current entry totality and fresh complete assembly
  -> candidate_ready with zero admission
  -> same P05~P12 ownership switch / drain protocol
```

Prior candidate的旧`ConfigBindingRef`若在current identity semantics下不再代表相同effective semantics，属于identity migration / design conflict，不得静默生成“等价”新ref后继续。Current binary已删除required field、reader、adapter或digest profile时，rollback必须失败并进入design/migration closure，不能通过deprecated parser、hidden default或current route兜底。

### 11.4 Durable work 不改写矩阵

| Durable / accepted material | Forward / rollback后继续使用 | 绝对禁止改写 / 重建 |
|---|---|---|
| P06前accepted synchronous request / UoW | 接纳它的process generation、immutable handles和formal transaction outcome | 转交另一generation、用new config重跑、把unknown commit改success/failure |
| accepted Consumer envelope / receipt | original dedup identity、source order、stored result / receipt、formal ack / retry disposition | 重置dedup、改producer/schema、伪造ack、因rollback重新accept |
| Job execution / immutable plan | stored `JobExecutionConfigSnapshot`、plan、claim/fence、item outcome和report | current config reread、relist/resize plan、重置attempt/budget、改terminal result |
| reservation / idempotency result | original actor/key/digest、retention obligation和immutable stored result | 换key/digest、删除active reservation、从telemetry重建result |
| outbox record / payload snapshot | exact event snapshot、stable publication token、stored effect binding和formal state | 从current truth重建payload、换target/token/binding、Failed改Pending |
| external intent / preparation | committed intent/preparation、exact historical binding、same token和phase probe | 用prior/current route替代、删除ambiguous record、provider success直接写Delivered |
| handoff / peripheral delivery | existing local lifecycle、consumer/effect binding、receipt、report | 把delivery改verdict/signoff、换consumer、重写report/evidence input |
| observation truth / native history / audit projection | existing owner/version/cursor/history和body-free linkage | config control plane反写、补偿删除、重判safety/visibility/freshness |
| digest / schema interpretation | material创建时的write profile和required compatible reader | 重算old digest、用new schema猜旧row、删除active reader |
| retention / no-write / gap marker | formal owner state、active protection和既有transition | 用config retirement event代替marker、缩短既有obligation、伪造closed |

Rollback只改变P08之后由新generation接纳的work。若一个durable item缺失exact historical config/effect binding，必须在external call或mutation前停止、保留material并进入`CFG-FH-05`；“rollback到创建它的配置”也不能替代缺失的exact resolution proof。

### 11.5 Retirement subject 与 obligation scan

Retirement必须先区分subject，避免把停止process、删除candidate artifact和移除historical effect resolution混为一件事：

| Retirement subject | 失去的能力 | Minimum independent gate |
|---|---|---|
| protected candidate artifact | 将该whole candidate用于future rollback rebuild | no pending approval/rollback disposition；A02 custody policy + A05 explicit decision |
| historical config revision / reader | 解释stored Job config snapshot、schema/digest profile和config ref | 所有引用该revision/reader的active/replay/retention obligation为零 |
| historical effect binding resolution | 解析old destination、provider idempotency namespace、descriptor / locator和phase probe capability | 所有outbox/intent/preparation/handoff/export active/ambiguous/manual obligation为零 |
| credential / provider overlap capability | 用same historical identity完成old token probe / known-success finalize | old and ambiguous token coverage为零，或replacement被证明对每个old token exact-compatible |

删除protected candidate artifact不自动删除historical reader / binding；后者retired也不删除business records。若physical registry需要新增本仓public port、repository、schema或UoW，必须回写formal `03`，不能在implementation中私建。

| Obligation category | Complete scan必须覆盖 | Zero condition | Nonzero disposition |
|---|---|---|---|
| `active` | nonterminal Job/plan/claim、pending/claimed/failed outbox、prepared/delivering intent、active handoff/export、仍受保护reservation | 没有仍可能执行 / finalize / duplicate replay的active reference | keep exact reader/binding；不得retire |
| `ambiguous` | commit unknown、provider outcome unknown、probe pending、ownership/drain indeterminate | 每项已按same token/exact binding得到formal known outcome或进入仍需binding的manual owner | keep capability并进入manual/probe；不得猜success |
| `replay` | idempotency stored result、duplicate Consumer receipt、outbox snapshot、Job terminal replay和schema/digest read window | replay/compatibility retention窗口关闭且无active protection | keep reader / digest / schema support |
| `manual` | historical unavailable、consistency defect、dead-letter/manual intervention、failed restoration或retirement retry | manual authority明确关闭且不再需要exact resolution | keep capability和safe issue relation |
| `retention` | formal active-reference protection、idempotency/intent duration、audit/report/handoff保存义务、migration compatibility window | 所有owner-defined retention/protection条件已到期且无更高优先级guard | keep metadata/reader；配置缩短值不追溯生效 |

Scan必须使用已关闭的subject assignment范围、完整owner/source registry和一致性cut；scan期间若仍可能创建该binding的新引用，则结果无效。真实store、index、watermark和scan command尚未选择，formal `07`必须逐owner映射并证明完整性；本Step不伪造scan结果。

### 11.6 Retirement eligibility、执行与失败

```text
binding no longer eligible for new assignment
  -> prove no pending activation can restore assignment
  -> complete five-category obligation scan
  -> append E13 with completeness and counts
  -> A04 historical/data/security review as applicable
  -> separate A05 retirement approval (E14)
  -> remove only approved exact resolution capability
  -> post-removal lookup / assignment guard check
  -> append E15 finite result
```

| Condition / failure | Required behavior | 禁止 |
|---|---|---|
| scan incomplete或任一count非零 | `retirement_blocked`；保留全部相关capability，按owner-defined时机重扫 | 抽样零当全量零、process stop后直接retire |
| scan结果过期或出现new reference | approval失效；回到完整scan | 沿用旧zero result |
| approval缺失/过期/scope不符 | 不执行移除 | 复用activation/rollback approval |
| removal在mutation前失败 | 保持capability，E15 failed | 写retired或删除metadata |
| removal outcome unknown | 停止进一步删除，probe capability；进入manual / operations reconciliation | 假定已删或反复执行破坏性cleanup |
| removal成功但post-check仍可assignment | consistency defect；关闭new assignment并修复control surface | 把可解析与可新分配混为同一开关 |
| removal成功后发现遗漏obligation | `historical_unavailable` critical operations restoration；保留durable item，不current fallback | config rollback、删除item、伪造恢复成功 |
| migration class reader/binding | 仅按Step 13 / formal `07` compatibility-window removal gate | 使用普通retirement流程绕migration proof |

Retirement audit metadata必须保留，即使被审计的resolution capability已移除；但它仍不得保存full binding、locator、credential、token或durable item清单。Control-plane record也不替代L4 `RetentionMarker` / `ActiveReferenceProtection`。

### 11.7 第 6 批局部一致性检查

| 检查项 | 当前结论 |
|---|---|
| rollback是否为fresh activation | `pass_for_batch_06`；G01~G08 + current full assembly + P01~P12 |
| before-switch reject与after-switch rollback是否分离 | yes；P08前不伪称rollback，P08后保留forward事实 |
| prior candidate是否跳过current validation | no；current binary/schema/provider/capability全部重验 |
| accepted durable work是否被改写 | no；10类material逐项固定stored identity / state / token / binding |
| migration是否有普通rollback资格 | no；只进入Step13 / formal `07`独立boundary |
| five historical obligation是否闭合 | `pass_for_batch_06`；active/ambiguous/replay/manual/retention均有coverage/zero/nonzero行为 |
| activation/drain/process stop是否自动retire | no；subject分离、E13~E15和独立approval |
| 是否发明historical registry public API/store | no；physical mapping留`07`，若需新contract先回写`03` |
| 是否伪造rollback/scan/retirement事实 | no；仅定义future contract，所有真实result仍不存在 |
| 上游 blocker | `none` |
| next_allowed_action | `consumed_by_batch_07` |

## 12. 配置变更停审与跨变更审计

### 12.1 十二类配置变更逐类停审

本表是 SOP 要求的配置变更停审记录。每一行同时审查权限、评审、审计、rollback、失败处理和敏感性；`pass_for_step_10` 只表示设计字段已闭合，不表示真实 actor、control plane、candidate、activation、rollback、scan或audit record已经存在。

| 配置项 / 变更类型 | 权限与评审 | 生效与失败处理 | 权威审计 | Rollback / retirement | 敏感性 | 结论 / 缺口修正 |
|---|---|---|---|---|---|---|
| `CFG-CHG-01` runtime / technical composition | A01发起；A03 + entry specialty，binding ref追加safety；A05批准 | complete new process；constructor/ready失败zero exposure；host switch unknown走FH-03 | E01~E10；field family/mode category/result，不记binding正文 | prior whole candidate重建；old clock/ID/runtime handle不可复用 | technical ref restricted；无full ref/fingerprint | `pass_for_step_10`；具体clock/ID provider与host mechanism留`07` |
| `CFG-CHG-02` bounded request/query/projection parameter | A01；low/medium仍有独立authorization；schema set追加entry/high | cold whole candidate；invalid reject；只作用new request/new Job snapshot | canonical field ID、direction、risk、validation/activation result；不记值 | prior candidate；accepted request/Job limit/work set不改变 | numeric internal；policy/schema ref仍按其级别处理 | `pass_for_step_10`；无hot scalar patch |
| `CFG-CHG-03` safety/policy/source visibility | A01 + policy owner；A03 + safety specialty；unsafe relax直接VETO | resolve/redline后complete assembly；failure fail closed，无degraded bypass | finite safety family、direction、review/result、safe issue ref | prior policy candidate重建；不重判old truth/safety/visibility | full policy ref/body/fingerprint全部禁止 | `pass_for_step_10`；无例外审批路径 |
| `CFG-CHG-04` store/transaction/schema | data/infra authority；A03 + data/historical，locator追加safety；critical双批准 | timeout兼容变更cold；destination/mode/revision命中migration则阻断 | store slot、change category、compatibility/migration result；无locator/DSN/revision值 | compatible timeout可rollback；migration只走Step13/`07` | store locator S-L，driver/body禁止 | `pass_for_step_10`；physical store/migration仍是实施前置，不是Step blocker |
| `CFG-CHG-05` digest/technical retention | data/retention authority；A03 + data/historical；incompatible/remove critical | additive/新duration只作用new material；active guard失败FH-06 | finite family、add/remove/extend/shorten、reader/guard result | prior compatible candidate；不重算old digest、不缩短active obligation | digest不能作为secret/ref surrogate | `pass_for_step_10`；profile migration后移Step13/`07` |
| `CFG-CHG-06` execution/claim/retry budget | operations authority；A03 + entry，durable claim追加data | new complete assembly/new Job snapshot；invalid/capability failureFH-01/02 | field family、direction、capability/activation result | prior candidate；existing plan/claim/fence/retry/report不改 | no token/fence/key/digest output | `pass_for_step_10`；blind retry/fence bypass无批准路径 |
| `CFG-CHG-07` resolver/external adapter | integration owner；A03 + entry/safety，影响history加historical；semantic drift critical | descriptor/sensitive/capability gate；old binding缺失FH-05 | adapter family/mode/capability/overlap/result；无endpoint/ref fingerprint | prior candidate重建；old work exact binding，禁止current fallback | binding R + credential S-L/material private | `pass_for_step_10`；destination/idempotency drift按migration |
| `CFG-CHG-08` publication/handoff/export catalog | target integration owner；A03 + entry/safety/historical；critical双批准 | whole catalog totality + cold switch；failure zero partial catalog | target family/phase/event names或counts、totality/result | prior whole catalog；old outbox/intent/preparation target/token不改；retire另审 | full consumer/target/binding、transport/credential禁止 | `pass_for_step_10`；report receipt不成为verdict/signoff |
| `CFG-CHG-09` API/Consumer/Job/schedule entry catalog | entry owner；A03 + entry，transport/actor追加safety；协议扩张design-only | static total map + all-or-none registrar + four-class host switch；FH-02/03/04 | finite operation names/family/count、registration/ownership result | prior candidate重新register；old envelope/Job不重消费/重列 | transport/topic/schedule value/actor-policy ref禁止 | `pass_for_step_10`；不发明partial/in-process activation API |
| `CFG-CHG-10` credential-only rotation | security/provider authority；A03 + safety/historical；same-ref loss critical | provider-controlled rotation + fresh complete assembly；selected material失败FH-02/05 | family、rotation class、same-ref eligibility/overlap/result | prior material必须可fresh resolve；old/ambiguous token保持probe/finalize | credential ref/material/version/fingerprint/provider body禁止 | `pass_for_step_10`；无in-place adapter mutation |
| `CFG-CHG-11` activation/rollback lifecycle | A06只执行A05批准；rollback重新A03/A04/A05；继承candidate最高风险 | P01~P12；partial/unknown ownership reconcile；drain incomplete FH-04 | E05~E12/E16；ready/activated/drained/retirable分离 | P08前reject/abort；P08后fresh prior candidate activation | restricted config ref only；metric label禁止 | `pass_for_step_10`；无pointer/LKG/old-handle rollback |
| `CFG-CHG-12` historical binding retirement | A09提议；A04 historical + applicable specialty；A05独立retirement批准 | five-category full scan -> E13/E14 -> remove -> post-check/E15；FH-05/06 | family、scope completeness、五类counts、decision/result | mutation前可cancel；移除后失败走operations restoration，不是config rollback | full binding/token/item list/locator禁止 | `pass_for_step_10`；physical registry/scan留`07`，新local contract则先回写`03` |

| Additional request | 权限 / 评审 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| prohibited / design-change-only | A03/A04只能分类，A05无approval path | `pass_rejected_by_design` | 返回formal `00~03`或current `04` owning Step；不得以critical/emergency放行 |
| migration-only candidate | 可解析/分类/评审，但在Step13/`07`闭合前无activation approval | `pass_blocked_as_migration` | 后续补data/schema/digest/binding migration的cutover/pause/verification/rollback boundary |

十二类变更均没有 unresolved 的权限、评审、审计、rollback disposition、failure handoff或敏感输出缺口。`not_selected/not_established` 的具体control-plane、host、artifact、provider、store和scan实现只阻塞对应 implementation / operations boundary，不改变Step 10语义闭合。

### 12.2 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 证据 | 缺口 / 修正 |
|---|---|---|---|
| 每个Step07可变field family是否归类 | pass | §8.2~§8.3，11 raw roots + derived domains -> CHG-01~12 | none |
| `CFG-D01~D23`是否都有Step07/08/09/11回指 | pass | §8.2 exact 23 rows；FH-01~06只作future handoff | Step11正文未读取，需用户确认后消费 |
| risk是否按whole candidate最高值 | pass | §7.3/§7.5；class/reviewer union + max risk | none |
| high/critical是否有独立review/approval | pass | §7.2；high三方分离、critical双approver、VETO无path | 真实组织/identity mapping留`07`/operations |
| candidate是否immutable/coherent | pass | §7.4、ACT-G01~G03 | artifact product/custody implementation未选择 |
| 是否存在field patch/hot/watch/admin override | no | §2.2、§6、§9 | future request需回写`03`/`04` |
| ready/activated/drained/retirable是否分离 | pass | §9.2独立事实/proof | none |
| API/Consumer/scheduler/outbox是否可能双owner | prohibited | §9.4 close/prove/grant；unknown冻结reconcile | host必须在`07`证明exclusive capability |
| failed candidate是否被误写成rollback | no | §9.6；P08前reject/build_failed/abort | none |
| activation audit owner是否闭合 | pass_for_design | §10.1 external control plane；E01~E16 | concrete landing/retention/report未选择，阻塞真实可审计实现声明 |
| runtime telemetry是否替代权威audit | no | §10.4只复用formal `03` Layer A | none |
| audit字段是否泄露sensitive material | no | §10.3/§10.5 allowlist + no-hash-escape | 实现需redaction checker，当前无真实test/result |
| 审计是否成为evidence/verdict/signoff | no | §10.6；change/attempt refs仅审计关联 | none |
| rollback是否重新全量校验/装配 | pass | RBK-G01~G08、§11.3 | no eligible candidate时不自动尝试更老版本 |
| migration是否被包装成普通rollback | no | §8.4、§11.2/§11.7 | Step13/`07`未闭合前activation blocked |
| durable accepted work是否被重写 | no | §11.4十类material矩阵 | none |
| old binding缺失是否fallback current/prior route | no | FH-05、RBK-G06、§11.4 | manual/restoration由future Step11/operations承接 |
| process stop是否自动retire | no | §9.2、§11.5~§11.6 | none |
| retirement是否完整覆盖历史义务 | pass_for_design | active/ambiguous/replay/manual/retention五类scan | physical owner/index/watermark/command留`07`逐项映射 |
| config audit是否反写L4 business truth | no | §10.1/§10.6；无local DTO/repository/UoW | 若未来要求local durable mirror必须先回写`03` |
| telemetry/audit是否self-recursive | no | formal `OBS-TELEM-001~006` + §10.6 | external product callback仍需实施验证 |
| 是否假定具体工单/部署产品 | no | role/ref/event均product-neutral | product selection是实施前置，不是current truth |
| 是否伪造candidate/actor/event/run/evidence/test/signoff | no | 本产物只定义future contract，open material保持not_* | none |

跨变更审计没有 unresolved 的设计冲突。表中 implementation / operations 前置不能被改写成“已实现”或“可上线”；它们将由Step 12、formal `05~07`和部署运维材料继续闭合。

### 12.3 Requirement VETO 映射

| Requirement VETO | Step 10 guard | 结论 |
|---|---|---|
| `VF-OBS-001` core closure missing | candidate必须完整13-stage root；四类ownershipone generation；failed/partial不暴露 | covered |
| `VF-OBS-002` forbidden body/secret/full sensitive ref进入 | source/custody不含material；audit/telemetry allowlist + no-hash-escape | covered |
| `VF-OBS-003` external evidence/artifact/identity/governance body stored | control plane只持candidate/audit metadata；L4不镜像external body或generic row | covered |
| `VF-OBS-004` observation/audit/telemetry/handoff冒充external truth | runtime telemetry non-authority；config audit只证明change lifecycle；report receipt非verdict | covered |
| `VF-OBS-005` query/maintenance/report/export反写source truth | activation/rollback/retirement均不调用business write或改old work | covered |
| `VF-OBS-006` fake run/evidence/verdict/signoff | change/attempt/config/issue refs均非这些身份；无真实记录/结果声明 | covered |
| `VF-OBS-007` retention删除active material | five-category obligation scan + independent retirement approval；nonzero hard block | covered |
| `VF-OBS-008` non-core sibling compile dependency | host/control plane/provider保持external/product-neutral；本Step不新增Cargo edge | covered |
| `VF-OBS-009` named product成为truth/prerequisite | ticket/GitOps/orchestrator/store/telemetry product均`not_selected` | covered |
| `VF-OBS-010` historical material promoted | old L4 Step10只作诊断，L1/L0只作粒度参考；无digest/LKG/job override继承 | covered |

任何环境、profile、emergency、rollback urgency、provider、optional target或old process存在都不能放宽VETO。VETO失败没有“风险接受后激活”路径。

## 13. 对详细设计的影响判定

### 13.1 Current impact conclusion

| Step 10 conclusion | 是否改变code contract | Current `03` basis | Action |
|---|---|---|---|
| immutable protected candidate + cold complete assembly | no | formal §13.8已固定P0 immutable、new complete runtime和no in-place swap | no writeback |
| external host执行four-class admission ownership switch | no current L4 business/public contract | formal builder只到eligible，host lifecycle明确后置`04`；本Step不发明registrar activate API | `07`选择/验证host mechanism；若需新增L4 public host port/state则先回写`03` |
| external configuration control-plane authority/audit | no | formal §14区分Layer A telemetry与existing native business audit，并禁止generic second ledger | no local writeback；`07`选择external landing。若要求L4 durable mirror则回写§5/§8/§10/§14 |
| runtime validation/assembly telemetry映射 | no | formal §14已有exact log/metric/`observability.runtime.assembly` span与allowlist | no new signal/schema |
| rollback为fresh current assembly | no | formal §13.8明确activation/rollback不改state/reservation/outbox/plan/intent/receipt/report | no writeback |
| accepted work固定stored snapshot/binding/token | no | formal §12/§13 external-effect exact historical binding与Job snapshot已定义 | no writeback |
| five-category retirement obligation scan | no semantic expansion | formal §13已要求old ambiguous binding保留到probe/finalize/manual；本Step细化operational gate | physical registry/scan留`07`；若需新L4 repository/port/schema则先回写`03` |
| store/schema/digest/external binding migration blocked | no | formal §10/§13禁止auto migration/current fallback，演进后置current Step13/`07` | no activation before downstream closure |

Current Step 10没有新增public/business struct、enum、trait、port、state、protocol、repository、UoW、metric、span、business event或Cargo dependency。`03` impact结论为 `no_immediate_writeback`，上游 blocker=`none`；这不表示external control plane、host switch、artifact custody、historical scan或tests已经实现。

### 13.2 Future impact triggers

| Future request / discovery | Required return point | Block-until behavior |
|---|---|---|
| reload/watch/hot/in-process adapter or registrar swap、partial root/canary ownership | DDD Step09/11~14/17/19 + formal §8/§10~§13；再回current`04` | current only separate-process cold activation |
| L4-owned config change/rollback/audit record、repository、UoW、query或outbox | DDD Step05~09/11/14/15/17/19 + formal §5~§14 | external control plane only；禁止implementation私建ledger |
| public host lifecycle/route/consumer/scheduler/loop orchestration port/state/error | DDD Step04~09/12~14/17/19 | `07`不能用代码补设计缺口 |
| historical registry/scan需要new local schema/repository/port/API | DDD Step05~07/10~14/17/19 | retain semantic requirement；affected boundary blocked until writeback |
| config identity alias/algorithm migration、dual schema/reader或artifact digest输出 | DDD Step06/11~15/17 + current Step13 | no silent reinterpretation/hash escape |
| automatic rollback chain、emergency bypass或LKG pointer | formal `00~03` owning authority/recovery Steps + current `04` | current request rejected/design-change-only |
| runtime telemetry新增activation/approval/retirement authority signal或self-ingest | DDD Step15 + formal §14；architecture review as needed | existing telemetry remains non-authoritative/no-recursion |

## 14. 正式 `04` §10 回填草稿

Formal `04-配置设计.md`只能在Step15装配。以下草稿是future §10的唯一current输入；本Step不修改formal `04`，正式正文不得加入真实actor、candidate、event、product、run、evidence、test、verdict或signoff实例。

````md
## 10. 配置变更、审计与回滚

> 校准来源:
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“变更治理模型”“23域回指”“Cold activation”“外部权威审计”“Rollback与historical retirement”“逐类停审”和“详细设计影响判定”。

### 10.1 变更authority与风险

配置只能由external host/deployment configuration control plane中的授权actor发起、review、approve和执行。候选必须是immutable protected whole candidate；risk按全部changed canonical field/subject命中的最高等级计算。High需要configuration reviewer和全部适用specialty reviewer，critical需要双approver；prohibited/design-change-only没有approval path。

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| runtime/technical composition | authorized initiator/release authority | config + entry；sensitive binding加security | fresh complete process + host switch | finite family/mode/result | prior protected candidate fresh rebuild |
| request/query/projection bounds | authorized tuning authority | low/medium config；schema加entry/high | cold whole candidate，new work only | field ID/direction/result，无值 | prior candidate；old request/Job不改 |
| safety/policy/visibility | policy owner | high config + safety；unsafe relax reject | redline + complete assembly | family/direction/review/result | prior policy candidate；不重判truth |
| store/transaction/schema | data/infra authority | data+historical；locator加security；migration critical | compatible timeout cold；destination/schema blocked as migration | slot/category/compatibility/result | compatible prior candidate；migration独立plan |
| digest/retention compatibility | data/retention authority | high data+historical；incompatible critical | additive/new-material only；active guard | family/direction/guard result | no old digest recompute/active shortening |
| execution/claim/retry | execution authority | config+entry；durable claim加data | cold new Job snapshot | family/direction/capability result | existing plan/claim/budget/report不改 |
| resolver/external adapter | integration owner | high entry+security+applicable history | descriptor/capability complete assembly | adapter family/overlap/result | old effect exact binding；no current fallback |
| publication/handoff/export catalog | target integration owner | high entry+security+history | whole catalog totality + cold switch | family/phase/event/count/result | old target/token不改；retire另审 |
| API/Consumer/Job/schedule catalog | entry owner | high entry；transport/actor加security | all-or-none registration + host ownership switch | finite operation/registration/switch result | no reconsume/replan/partial root |
| credential-only rotation | security/provider authority | high security+history | fresh assembly；same-ref strict overlap | family/rotation/eligibility/result | old token remains exact probe/finalize capable |
| activation/rollback lifecycle | approved activation operator | inherits candidate；rollback重新review/approve | P01~P12 cold protocol | attempt/phase/ownership/drain/result | pre-switch abort；post-switch fresh rollback attempt |
| historical binding retirement | historical custodian | history + applicable specialty + distinct approval | full obligation scan then remove/post-check | family/five counts/decision/result | cancel before removal；after failure operations restore |

### 10.2 Cold activation

P0只支持separate new process。Host依次固定候选和authorization、完成13-stage assembly、确认candidate ready、关闭并证明old API/Consumer/scheduler/outbox admission、向同一candidate generation授予四类唯一ownership、排空old process-local work并停止old process。`candidate_ready`、`activated`、`drained`和`retirable`是四个独立事实；partial/unknown ownership停止后续phase并reconcile，禁止old/new双owner、hot swap和in-process registrar activation。

### 10.3 权威审计与敏感边界

External configuration control plane保存change request、candidate custody、review、approval、validation、ready、ownership activation、drain、rollback、retirement和reconciliation权威历史。安全字段只允许body-free change/attempt/actor/candidate-control/config/release/process refs、canonical field IDs、finite family/class/risk/phase/result、bounded counts和safe issue refs。Raw config/diff/value、ENV value/path、locator、credential、endpoint、topic、full consumer/target/binding ref、hash/fingerprint、provider body、run/evidence/verdict/signoff全部禁止。

L4只复用existing config-validation/runtime-assembly/availability telemetry作为non-authoritative supplement，不新增config audit DTO/repository/UoW，也不得self-ingest runtime telemetry或用sink ack补审批/激活事实。

### 10.4 Rollback与durable history

P08前失败是candidate reject/abort，不是rollback。P08后rollback选择exact prior protected candidate，在current binary/schema/profile/provider/store/adapter/entry capability下重新完整validate和assemble，再走相同host switch/drain。Rollback只改变随后new-work admission；existing request、Consumer receipt、Job plan/snapshot、reservation/result、outbox、intent/preparation、token/binding、handoff/report、truth/history、digest/reader和retention marker均不得重写。

Store destination/mode、required schema revision、incompatible digest profile或old-token-incompatible external destination属于migration，Step13和formal `07`闭合前无普通activation/rollback资格。

### 10.5 Historical retirement

Process stop不等于historical binding退役。Retirement先关闭new assignment，再完整扫描`active/ambiguous/replay/manual/retention`五类obligation；任一非零、scope不完整或scan过期都保留exact reader/binding。独立historical review和retirement approval后只移除获批resolution capability并做post-check；不得删除或改写durable business material，也不得用current route恢复遗漏义务。
````

Formal §10装配时必须保留12类六列表、四类host ownership、四事实分离、external authority、safe-field禁止项、rollback eligibility、durable no-rewrite和五类retirement obligation。不得把它压缩成“修改配置后重启，失败恢复上一版”。

## 15. Downstream handoff 与 open material

### 15.1 Step 11 handoff

Step 11尚未读取。用户确认进入后，必须先读其SOP/书写规范与current source，再消费下表；不得把`CFG-FH-*`、`CFG-ACT-*`、`CFG-AUD-*`或`CFG-RBK-*`直接复制成代码enum/business state。

| Step 10 fixed input | Step 11必须补齐 | 不得改变 |
|---|---|---|
| FH-01 candidate rejected | impact/operator surface/alert/correction/retry boundary/test cut | zero root、old unchanged、no LKG claim |
| FH-02 assembly unavailable | dependency-specific fail-fast/degraded taxonomy与recovery | no sensitive fallback/partial exposure |
| FH-03 activation indeterminate | exact detection、availability surface、escalation、failure injection | no dual owner/no telemetry authority |
| FH-04 drain incomplete | timeout/cancel/force-stop authority、alert、test | candidate remains new owner；durable work不改 |
| FH-05 historical unavailable | manual/restoration/degraded surface、alert/recovery test | stop before effect；no current/prior route fallback |
| FH-06 migration/retirement blocked | long-lived blocked surface、recheck schedule、operator alert | no activation/removal before closure |

### 15.2 Formal downstream handoff

| Downstream | Required input from Step 10 | Must not claim |
|---|---|---|
| Step 12 | actor/risk/class、P01~P12、E01~E16、RBK-G01~G08、five obligations、open products | tests/acceptance/implementation/operations already closed |
| current `05` | authority/separation、candidate custody、phase/ownership fault injection、audit allowlist/deny scan、rollback/current-validation、durable no-rewrite、retirement scan tests | real case IDs/runs/results/evidence from this design Step |
| current `06` | high/critical review VETO、no dual owner、no raw/hash escape、no telemetry authority、no history rewrite/current fallback、no early retire | pass/verdict/signoff or risk acceptance already issued |
| current `07` | control-plane/custody/host/audit physical boundary、four ownership adapters、drain/reconcile、prior rebuild、historical registry/scan/restoration及all planned tests | implementation commit、selected product、target repo/CI/environment readiness |
| deployment/operations | actor mapping、artifact protection、binary/candidate scope、admission switch、audit retention/report、rollback/restore/runbook | redefine config semantics、VETO、truth owner或claim production evidence |

### 15.3 Open material classification

| Open material | Status | Blocking scope | Required closure |
|---|---|---|---|
| configuration control-plane product / audit landing / retention / report | `not_selected` | blocks real auditable change implementation/operation，不阻塞Step 10 design | ADR/`07`/operations before first real change |
| protected candidate artifact facility / custody proof | `not_selected` | blocks activation/rollback implementation | `07` boundary + access/immutability/supersession verification |
| host API/Consumer/scheduler/outbox exclusive ownership mechanism | `not_established` | blocks production activation | `07` reality check/spike；capability不足则boundary blocked |
| drain timeout/cancel/force-stop/availability policy | deferred toStep11/operations | does not block lifecycle semantics；blocks runnable failure handling | Step11 then Step12/`05~07`/runbook |
| historical binding registry physical owner/store/index/scan/watermark | `not_selected` | blocks external-effect recovery/retirement readiness | `07` map every owner；new L4 contract requires`03` writeback |
| migration/cutover/dual-read/deprecation plan | deferred toStep13/`07` | blocks migration-class candidate activation | Step13 semantic closure + formal`07` executable boundary |
| real provider/store/transport/scheduler capabilities | `not_established/not_evaluated` | blocks affected RuntimeLike/production boundary | selected adapter precheck/spike and real tests |
| target repository/toolchain/tests/artifacts/evidence | `not_established/not_run` | blocks implementation/acceptance/release | formal `05~07`, target reality and actual execution |

这些均为明确的downstream precondition，不是Step 10上游 blocker，也不能由README、旧formal文档、reference project或implementation猜测补齐。

## 16. Current M3 affected lifecycle register

| Affected ID | Change/rollback relevance | Activation/retirement stop rule | Current状态 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | schema owner未闭合的candidate不能借变更激活I05 | prior/new candidate均不得带local invented schema | open_upstream_internal |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | binding变更必须exact owner-approved mapping | no full-subscribe/name-match migration | open_upstream_internal |
| `R06.6-F2-H13-UPSTREAM` | rollback/activation不能改变J06 controlled-open | old/new runtime均保持Blocked/manual | open_controlled |
| `R06-F-AFFECT-UOW-01` | config switch不重写accepted UoW或durable rows | drain前后都保持exact save order | inherited_affected |
| `S08-RECOVERY-CLASS-OWNER-01` | retry setting变更只影响future frozen policy | 不能借rollback重分类old branch | inherited_affected |
| `R07-EXTERNAL-PHASE-LINK-01` | destination/binding变更必须保留old exact resolver | active/ambiguous link存在不得retire old binding | inherited_affected |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | old attempt保留same token/accounting | rollback/new credential不得重置budget或blind retry | inherited_affected |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | change不修补already committed Consumer outbox | old/new registration都需same-UoW surface | inherited_affected |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | drain期间commit-unknown仍按stored probe处理 | 不因process retirement ack success | inherited_affected |
| `S08-JOB-REPORT-REF-OWNER-01` | old Job pin原snapshot/report owner | config rollback不mint/refill report ref | inherited_affected |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | migration不能引入temporary alias/private type | candidate validation前必须canonical owner | inherited_affected |
| `03-RPR-S09-PER-FLOW` | each boundary change需重新审计affected exact flows | runtime activation不等于vertical slices完成 | inherited_affected |

Final M3 confirms activation is host-owned cold lifecycle:new candidate protected -> complete build -> readiness check -> exclusive
admission switch -> old drain -> historical overlap scan -> retirement decision。Rollback rebuilds a protected prior candidate under
the current binary and same validation;it never reuses an unvalidated process handle or rewrites durable work。Step10 closes`0/12`，
new upstream blocker=`none`。

## 17. 第 7 批自检与完成门禁

### 17.1 写入后检查结果

| 检查项 | 当前状态 | 证据 / 待执行 |
|---|---|---|
| SOP八问、六列表、停审、跨变更审计 | pass | §4、§7.6、§12.1~§12.2均完整 |
| 12 class / 23 domain / 6 FH exact coverage | pass | 静态unique检查=`12 / 23 / 6`，无编号缺口 |
| P01~P12 / E01~E16 / G01~G08 exact coverage | pass | 静态unique检查=`12 / 16 / 8`，无编号缺口 |
| active/ambiguous/replay/manual/retention coverage | pass | §11.5五类均有scan scope、zero与nonzero disposition |
| 10 VETO exact coverage | pass | `VF-OBS-001~010` unique=10；§12.3 |
| `03` impact与future trigger | pass | §13结论=`no_immediate_writeback`，future扩权均有return point |
| formal §10 draft与downstream handoff | pass | §14~§15已完成；formal `04`未修改，Step11未读取 |
| no code/product/event/test/evidence fabrication | pass | 仅定义future contract；open material保持`not_selected/not_established/not_run/not_evaluated` |
| Markdown table/fence/title/whitespace/diff | pass | 1054行；表格pipe一致；10条fence成对；无重复标题/尾随空白；`git diff --check`通过 |

### 17.2 Completion gate

| Gate | Current status | Reason / next action |
|---|---|---|
| Step 10 input gate | `pass` | standards/current upstream/historical/reference已按current-first读取 |
| Step 10 content gate | `pass_consumed_by_step_11` | 第1~7批与最终M3 lifecycle/12项affected复核通过；连续授权已消费本Step |
| upstream blocker | `none` | current formal `03`足以承载external host-owned cold lifecycle；无local audit truth扩张 |
| formal `04` gate | `blocked` | only Step15 may assemble formal document |
| implementation readiness | `blocked` | formal `04~07`、target repo、selected mechanisms、tests/evidence均未完成 |
| next_allowed_action | `continue_to_current_step_11_under_continuous_M4_authorization` | 按SOP进入Step11失效/降级；formal `04`仍冻结 |
