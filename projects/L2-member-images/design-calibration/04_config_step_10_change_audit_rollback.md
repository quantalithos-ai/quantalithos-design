# L2-member-images 04 配置设计 Step 10：配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10  
> 回填位置：正式 `04-配置设计.md` §10“配置变更、审计与回滚”  
> 本 Step 只定义：21 个 P0 配置项的离线变更约束、审查输入、safe audit surface 和显式重启回退。  
> 本 Step 不创建：审批系统、持久化审计对象、在线配置中心、热更新、容器生命周期、配置产物、镜像 digest 或外部成功事实。

## 1. Step 状态、目标与执行计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10：定义配置变更、审计与回滚 |
| 当前状态 | `completed`；域级变更规则、敏感边界、回退语义和跨变更审计已完成 |
| 输入基线 | Step 7 配置项；Step 8 敏感/secret 边界；Step 9 加载、校验与 startup activation；正式 `03-详细设计.md` §13~§14 |
| 输出文件 | `design-calibration/04_config_step_10_change_audit_rollback.md` |
| 本 Step 后动作 | 仅可按串行门禁创建并完成 Step 11；正式 04 仍不得写入 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断/取舍 | 结构化产物 | 03 影响判定 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| change authority / review | done | done | done | done | done | done | `pass` | 进入 safe audit / rollback |
| safe audit surface | done | done | done | done | done | done | `pass` | 进入 domain change matrix |
| five-domain change / rollback | done | done | done | done | done | done | `pass` | 进行跨变更审计 |
| cross-change audit | done | done | done | done | done | done | `pass` | 允许创建 Step 11 |

`pass` 只表示本 Step 的配置语义可供后续 Step 承接。它不表示存在可执行的审批、审计、重启、回滚、镜像构建、发布、Artifact handoff、consumer confirmation 或 readiness。

## 2. 本步边界、输入与 SOP 问题回答

### 2.1 本步目标与非范围

本 Step 将 P0 配置变更限定为：外部配置/发布过程准备新的 body-free 输入，运行进程在下一次启动时重新执行 Step 9 的严格加载与校验；只有通过者才能形成新的本地 `Assembled`，否则为 `Blocked`。回退同样是用先前**已验证且仍可取得**的 body-free 配置输入启动新一轮装配，而不是修改当前运行时、领域真相或历史。

| 本 Step 覆盖 | 本 Step 不覆盖 |
|---|---|
| 谁可作为离线变更提交者、哪些 P0 域需要独立复核、什么元数据可安全留痕 | 具体工单、审批、身份、权限、审计平台、审批结论或治理 truth |
| startup-only 生效、拒绝前的零副作用、下一次启动的重新校验 | hot reload、online override、LKG/live switch、部分应用或静默 fallback |
| safe audit 字段类别、敏感 selector 轮换和禁止输出 | raw config/full ref/secret、endpoint、credential、provider body、日志保留/告警产品 |
| 显式 restart 回退输入、回退失败的 fail-closed 口径 | host/container/process orchestration、流量切换、发布/回滚执行记录 |

### 2.2 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | completed | 继承 `safe absence < project JSON < allowlisted env selector`、非法高优先级值整份拒绝和无在线 override。 |
| `04_config_step_07_config_items.md` | completed | 覆盖五域 21 个 P0 item、必填性、scope、startup-only 与失败策略。 |
| `04_config_step_08_sensitive_secrets.md` | completed | 继承 19 个 sensitive selector、raw material 禁止、轮换与无输出边界。 |
| `04_config_step_09_loading_validation_activation.md` | completed | 继承 strict parse、cross-field、builder、`Unassembled/Assembled/Blocked` 和无 reload/LKG。 |
| `03-详细设计.md` §13~§14 | current formal | 继承唯一 raw reader、private builder、slot、fake、redaction 与 no-readiness 边界。 |
| `L1-governance` 04 Step 10 | format / granularity reference | 参考 actor、评审、audit、rollback、停审和交叉审计的组织粒度；不继承治理对象、outbox 或正向合同。 |

### 2.3 SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 哪些配置可以由谁变更？ | 只有外部的配置/发布过程可提交 project JSON 或 allowlisted env selector 的候选变更；显式 TestOnly harness 仅能在 `ci-test + test_only` 范围准备 fixture selector。`contracts`、`domain`、`application`、`api`、`worker`、`jobs` 均不是配置写入者。该角色分类不是本仓的身份/授权系统。 |
| 哪些配置变更需要评审？ | 所有会改变 P0 effective input 的非 TestOnly 变更均为高风险；尤其 profile/mode、local store、static pin/seed/base、external boundary 和 redaction selector。提交前须由外部变更过程保留 scoped review/reason 的 opaque reference；本仓不解析或裁定该 reference。 |
| 变更如何生效？ | 所有 P0 都是 startup-only：新输入必须重新收集、严格校验并由 builder 重新装配后，才可在一次新的启动中使用。没有 reload、hot、online override、partial apply 或 LKG。 |
| 变更如何记录审计？ | 本仓只定义可安全关联的类别和 opaque refs：配置域/key category、profile/mode category、activation disposition、change/actor/reason/review/rollback reference、safe validation issue reference，以及可选的 owner-provided redacted config identity。它们不是本仓创建的 durable audit truth，也不是 image/build digest。 |
| 变更失败或效果异常如何回滚？ | 校验失败的候选从未激活，无需 runtime rollback；已启动配置的回退只能由外部过程提供先前已验证且仍符合当前 schema/profile 的 body-free 输入，再启动新的校验/装配。若该输入不可得、已失效或无法校验，则保持 `Blocked`，不得 cache、LKG、fake 或降级为成功。 |
| 是否逐项回指 Step 7/8/9/11？ | 是。§5 将全部 21 个 P0 item 按五域映射到变更、敏感、activation 和 Step 11 失效承接；Step 11 仍将独立定义失效矩阵。 |
| 是否存在高风险无评审、审计、回滚或敏感泄露？ | 未发现本 Step 内部缺口：所有 P0 非 TestOnly 变更均收为 high-risk、restart-only、safe audit、explicit rollback input。上游 owner/policy blocker 仍不被变更流程关闭。 |

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 位置 | 已有结论 | 本 Step 补齐 / 保持的边界 |
|---|---|---|
| Step 7 | P0 item 的来源、scope、敏感性和失败策略已列出，但没有变更责任与回退输入。 | 按五域补齐 change class、提交边界、review input、audit category 和 restart rollback。 |
| Step 8 | raw material 禁止、new selector + restart 的方向已存在。 | 明确轮换也不是在线替换；审计不输出 full ref 或伪造 digest。 |
| Step 9 | validation/assembly/startup 已闭合，P0 reload rejected。 | 将“新配置”与“退回配置”都收敛为新的 startup validation，禁止 LKG/partial apply。 |
| 03 §13~§14 | raw config 只在 infra；Assembled 不等 readiness；安全诊断有严格红线。 | 不新增 audit aggregate、authorization port、rollback API、reload state 或 observability backend。 |
| sibling / owner pending | consumer、Artifact、base、mapping、seed、registry 等正向合同未闭合。 | selector 的更新只能影响本地 slot binding；不把 review/restart 写成 external availability 或 success。 |

### 3.2 改动前后对比

| 项目 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| P0 change class | 只有 startup-only 生效方向 | 所有非 TestOnly P0 effective-input 变更明确为 high-risk | 防止将 ref 替换误当作低风险参数调节。 |
| 审查输入 | 未定义 | 外部过程须能关联 change/reason/review 的 opaque ref；本仓不拥有 approval truth | 可追溯而不私造治理系统。 |
| 审计 | 只有 redaction/no-output原则 | 固定 safe field categories 与禁止字段；不产生 durable audit object | 防止审计本身泄漏配置或越界。 |
| 回退 | “restart”方向未逐域细化 | 只允许 prior validated body-free input + fresh validation + new startup | 阻止 LKG、cache 或原地篡改。 |
| 失败语义 | 侧重新候选拒绝 | 区分 reject-before-activation、rollback-input-invalid 与 owner-gap；均 fail-closed | 防止失败被描述为发布成功或 readiness。 |

### 3.3 设计取舍

| 议题 | 取舍 | 原因 |
|---|---|---|
| 是否定义本仓审批/权限服务 | 不定义；只允许外部 opaque review input。 | governance approval truth 不属于本仓，且尚无 owner contract。 |
| 是否写入 config diff 或完整 selector | 不写；仅保留域/key 类别和安全 reference。 | full config/ref 可能泄漏部署拓扑、secret 或外部 body。 |
| 是否以 digest 表示配置版本 | 不把任何 image/build/Artifact digest 写入变更结果；可选的 owner-provided redacted config identity 只是关联输入。 | 本仓不得伪造 provenance、digest 或发布事实。 |
| 是否支持自动回退或 LKG | 不支持。 | 03/09 没有在线切换、缓存或恢复契约，自动回退会绕过 strict validation。 |
| 是否允许 TestOnly fixture 作为通用回退 | 不允许；仅 `ci-test + explicit TestOnly harness`。 | fake 不能覆盖 production-like、integration-like 或 owner-gap。 |

## 4. 变更控制面：角色、等级和安全审计边界

### 4.1 角色分类与责任边界

| 提交者类别 | 允许动作 | 明确禁止 | 本仓可见的最小关联 |
|---|---|---|---|
| 外部 configuration / release process | 离线准备 project JSON 或 allowlisted env selector，发起新启动或回退输入交接 | 绕过 validator、直接改 domain truth、修改 live state、在线替换已装配 facade | opaque `change_ref`、`actor_ref`、`reason_ref`、可选 `review_ref`。 |
| explicit TestOnly harness | 仅在 `ci-test + test_only` 提供/替换 deterministic fixture selector，并重新运行 harness | 向任何非 TestOnly profile 注入 fake、改变普通 startup invariant、声明真实外部成功 | opaque `test_context_ref`、fixture category、safe validation issue ref。 |
| `infra/config.rs` | 收集 source、严格解析/校验、拒绝非法候选 | 裁定外部审批、读取 raw secret、保留 LKG、写审计 truth | safe validation disposition / issue ref。 |
| `infra/runtime_builder.rs` | 消费 validated binding 并组装既有 local slots | 重载运行态、调用 provider、创建 candidate/digest/Artifact/consumer result | `Unassembled` / `Assembled` / `Blocked` local state。 |
| 其余本仓模块 | 只消费 typed carrier、port、facade 或 safe disposition | 读取/写入 raw config、实现 config mutator、越过 startup guard | 无 direct config write surface。 |

外部 `actor_ref`、`review_ref` 或 `reason_ref` 的存在不证明授权已发生；它们也不是 governance signoff。本仓不实现其存储、真实性验证、访问控制或保留策略。若未来需要 runtime 强制授权或 durable `ConfigChangeAudit`，必须先重开 03 的 port/object/flow 设计，再重开 04。

### 4.2 变更等级与不可变红线

| 等级 | 覆盖范围 | 允许的变更方式 | 必须具备 | 禁止 |
|---|---|---|---|---|
| `high` | 全部非 TestOnly P0 effective input | 离线替换 body-free JSON/env selector，随后 fresh validation + restart | external change/reason/review input，safe audit category，明确 rollback input | 在线变更、静默 fallback、raw material、无 review 的正向宣称。 |
| `test-only bounded` | `ci-test + explicit TestOnly harness` 下的 fixture selector | 重跑 harness 前替换 selector | test context、显式 fake mode、strict validation | 泄漏到 local-dev/integration/staging/production-like；作为生产回退。 |
| `rejected` | raw secret/body、weaker redaction、unknown field、hot/reload、invariant override、Production + fake | 不激活 | safe issue ref（若安全可得） | “紧急开关”、部分应用、LKG、回退到低优先级 source。 |
| `design-change required` | 新 source、secret provider、authorization check、config center、online reload、new audit persistence、新的 product/provider contract | 先重开 03/04，由 owner 确权 | 更新后的正式设计输入 | 在本 Step 或实现现场直接添加。 |

### 4.3 Safe audit surface 与禁止输出

| 类别 | 可以记录 / 传递的安全内容 | 不得记录 / 传递的内容 |
|---|---|---|
| 变更关联 | opaque `change_ref`、`actor_ref`、`reason_ref`、`review_ref`、`rollback_input_ref`（若外部 owner 已提供） | 工单/审批正文、身份凭证、治理 approval truth 或 signoff。 |
| 配置定位 | config domain、key category、profile/mode category、activation disposition、slot kind | JSON body、完整 selector、endpoint、route、provider/consumer/Artifact body。 |
| 校验 | accepted/rejected/blocked 类别、safe validation issue ref、redaction policy category | 原始非法值、匹配片段、secret、credential、stack trace。 |
| 配置身份 | 可选 owner-provided redacted configuration identity reference | image/build/Artifact digest、provenance、manifest、tag、发布结果，或在本仓计算任何 digest。 |
| 回退 | `rollback_requested` / `rollback_rejected` / `restart_required` 等安全 disposition | host command、container id、traffic/health result、live-state snapshot。 |

这些内容可供未来的外部 change process 或安全诊断关联，但本 Step 不创建 event、outbox、trace truth、report、evidence alias、测试结果或审计后端。当前 outbound inventory 仍为 `NoneAuthorized`。

## 5. 五域 P0 变更、审查、审计与回滚矩阵

| 配置域与覆盖项 | 提交者 / 评审要求 | 生效与 safe audit | 回滚方式 | Step 8 / 9 / 11 承接 |
|---|---|---|---|---|
| `composition.profile`、`composition.mode`、`composition.config_ref` | 外部 configuration/release process；非 TestOnly 改动均 `high`，需 scoped external review input。TestOnly 仅 harness 且显式 `ci-test + test_only`。 | 新启动前严格 profile/mode/ref 校验；记录 domain/key category、profile/mode category、change/review refs、issue ref；失败不激活。 | 用先前已验证、仍与 profile/mode/harness 相容的 body-free input 重新校验并启动；不可得即 `Blocked`。 | Step 8 禁 raw config/secret；Step 9 CF-01/02/09；Step 11 处理缺失、冲突、漂移。 |
| `local_persistence.truth_store_ref`、`projection_store_ref`、`idempotency_store_ref` | 外部 configuration/release process；`high`，需 review 与回退输入。TestOnly fixture 仅 CI harness。 | startup validator 检查三 slot 完整、owner/kind/ref-shape；audit 只列 slot category、profile、safe disposition/issue。 | 以先前完整且已验证的三 binding 重启；不能用单个旧 slot、cache、fake、`enabled=false` 或 query-time repair。 | Step 8 禁 DSN/credential；Step 9 CF-02；Step 11 处理 required local slot 不可用。 |
| `static_references.mapping_ref`、五类 component refs/collections、四类 seed/base refs（11 项） | 外部 configuration/release process；`high`。任何 owner/scope 未闭合项只可作为 pending selector，不因 review 变为已可用。 | fresh owner/kind/mutable/scope/collection validation；audit 仅列 static slot/layer category、safe gap/issue；不读 body。 | 用先前 immutable、已验证且仍符合 scope 的 selector 重新启动；若上游 ref 已不可验证，保持 `Unknown`/`Gap`/`Blocked`。 | Step 8 保持 pin/no-`latest` 与 static/live 分离；Step 9 CF-03~05；Step 11 处理 owner/ref 不可用。 |
| `external_boundaries.build_registry_ref`、`qualification_artifact_ref`、`member_service_supply_ref` | 外部 configuration/release process；`high`。任何需调换 selector 的外部过程不能代替 Builder/Artifact/Member Service owner review。 | 只校验 boundary selector shape、profile/fake compatibility 与 mandatory scope；audit 仅 seam category、safe marker/issue；不调 provider。 | 以先前已验证 selector 重新启动；若 pending owner contract 仍未闭合或 input 不可验证，保持 `Blocked`/`Gap`/`Unavailable`/`ReopenRequired`。 | Step 8 禁 endpoint/manifest/gate body；Step 9 CF-06；Step 11 处理 external unavailable，不产生 candidate/digest/gate/Artifact/confirmation。 |
| `diagnostics.redaction_policy_ref` | 外部 configuration/release process；`high`。只允许同等或更严格 selector；放宽/清空 floor 为 `rejected`，不是可回滚变更。 | 新启动前检查 restrictive floor；audit 只列 diagnostics category、policy category、safe issue/ref；不得回显策略正文。 | 仅可切回先前已验证且不弱于 fixed floor 的 selector，或使用固定 floor；weaker/unknown input 不能激活。 | Step 8 禁 raw output；Step 9 CF-07；Step 11 处理 policy selector 缺失/非法。 |

### 5.1 变更到前后 Step 的逐域回指

| 配置域 | Step 7 item / schema | Step 8 敏感规则 | Step 9 生效规则 | Step 11 失效承接 |
|---|---|---|---|---|
| `composition` | 三项 enum/ref；safe absence 非成功 | `config_ref` sensitive，profile/mode internal | strict parse + CF-01/02/09 + startup freeze | 缺失、enum/模式冲突、非法 env、rollback input 无效。 |
| `local_persistence` | 三项 required local opaque ref | 所有 ref sensitive；不含 DSN/credential | CF-02 后 builder binding；无 UoW repair | slot 缺失/unknown/mismatch 时 fail-closed。 |
| `static_references` | 11 项 scalar/collection opaque ref | selector sensitive；无 mapping/component/seed/base body | CF-03~05；scope required 时 slot `Blocked` | owner/kind/mutable/scope 或 ref 漂移引起 gap/blocked。 |
| `external_boundaries` | 三项 conditionally required opaque boundary ref | selector sensitive；无 endpoint/manifest/gate/consumer body | CF-06；只装配 conservative marker | optional unavailable 保守 marker；mandatory scope fail-closed。 |
| `diagnostics` | 一项 optional restrictive opaque ref | selector sensitive；缺省 fixed floor | CF-07；startup freeze | weaker/unknown/invalid reject，固定 floor 不降级。 |

## 6. 生效、回退与拒绝流程

### 6.1 配置变更与 restart 回退链图

```text
[offline candidate JSON / allowlisted env selector]
                  |
                  v
[external change/reason/review refs, if supplied]
                  |
                  v
[strict load + source merge + validation]
       | rejected                         | validated
       v                                  v
[safe issue / no activation]      [new process startup / builder assembly]
                                          |
                              +-----------+-----------+
                              |                       |
                              v                       v
                       [Assembled (local)]       [Blocked]
                              |
                              v
              [later rollback: prior validated input -> same validation chain]
```

- 图中的 external refs 只提供变更过程的关联输入，不是本仓鉴权、审计或审批实现。
- `Assembled` 仍仅表示本地 composition validation；不表示镜像、registry、qualification、Artifact、Member Service、runtime、container 或 readiness。
- “prior validated input”必须在新的 source collection 中仍能取得且通过当前 strict validation；不能用缓存、LKG、复制 raw body 或 TestOnly fake 代替。
- restart 的 host/container 生命周期、流量、健康判断和实际操作记录不属于本仓；本 Step 不声称它们已经发生或可由 image project 执行。

### 6.2 回退规则矩阵

| 情况 | 正式处理 | 可见安全 disposition | 明确禁止 |
|---|---|---|---|
| 新候选 parse/type/ref/sensitive/cross-field 失败 | 整份 effective config reject；不进入 builder activation | `rejected_before_activation` + safe issue ref | 低优先级 fallback、部分 slot 应用、写 domain/UoW/event/Artifact。 |
| 新候选通过 validator 但 required slot assembly `Blocked` | 不暴露可执行业务 facade；外部过程可准备另一候选或 prior validated input | `blocked_during_assembly` | 以 optional slot、fake、cache 或 readiness 假设补齐。 |
| 已启动配置需要回退 | 外部过程以 prior validated body-free input 发起新的 source collection、validation 与启动 | `restart_required` / `rollback_requested`（安全流程标识） | 原地修改 live config、回写历史、改变 static/live state。 |
| prior rollback input 缺失、已过期、owner/kind 不再可验证或与 current schema/profile 冲突 | 回退候选自身 reject，local assembly 保持/进入 `Blocked` | `rollback_rejected` + safe issue/gap marker | LKG、旧 cache、删除校验、TestOnly 代替或把 gap 报为成功。 |
| raw secret/body、weaker redaction、reload/hot 或 invariant override 尝试 | 在 activation 前拒绝；必要时仅安全诊断 | `rejected_policy_violation` | emergency bypass、debug/raw 输出、在线恢复。 |
| pending external owner contract 导致 selector 无法验证 | 保守 `Unknown`/`Gap`/`Blocked`/`Unavailable`/`ReopenRequired`；不调用 provider | seam/slot category + safe marker | 生成 candidate、image digest、gate/Artifact/consumer success，或宣布 rollback 完成。 |

### 6.3 敏感 selector 轮换附加规则

| 敏感配置族 | 轮换输入 | 生效与回退 | 可审计内容 | 严格禁止 |
|---|---|---|---|---|
| `config_ref` / local store refs | 新的 opaque selector；不携带 physical connection material | fresh validation + restart；回退也须 prior validated selector | section/slot category、profile category、safe refs/issues | DSN、password、token、provider body、LKG。 |
| mapping/component/seed/base refs | 新 immutable opaque selector 或集合 | fresh owner/kind/mutable/scope validation + restart | static layer/slot category、gap/issue category | `latest`、manifest/body、live memory/checkpoint/workspace。 |
| external boundary refs | 新 typed boundary selector | conservative-slot validation + restart；owner gap 不因轮换解除 | seam category、safe marker/issue | endpoint、credential、request/response、candidate/digest/gate/Artifact/confirmation。 |
| redaction selector | 同等或更严格 opaque selector | fresh floor validation + restart；回退不得低于 fixed floor | policy category、safe validation disposition | raw/debug bypass、matched values、弱化策略。 |

## 7. 配置变更停审与跨变更审计

### 7.1 域级停审记录

| 配置项 / 变更类型 | 权限与评审 | 审计与敏感性 | 回退与失败 | 停审结论 |
|---|---|---|---|---|
| `composition.*` | 外部 process；high；TestOnly 有显式范围 | 只 safe category/ref；无 config body | prior validated compatible input + restart；否则 blocked | 通过；无隐式 profile/fake 回退。 |
| `local_persistence.*` | 外部 process；high | 只 slot category；无 DSN/credential | 三 slot 同时重新验证；无 cache/fake/repair | 通过；不改 UoW/recovery。 |
| `static_references.*` | 外部 process；high；owner gap 保持 gap | 只 static slot/layer/gap | immutable prior input + restart；unverifiable 保持 blocked | 通过；不读取 body或伪造 pin。 |
| `external_boundaries.*` | 外部 process；high；不替 owner 裁定合同 | 只 seam/marker；无 provider body | prior selector + restart；owner unresolved 仍保守 | 通过；不形成 positive result。 |
| `diagnostics.*` | 外部 process；high；weaker change reject | 只 policy category/issue；无 raw output | prior restrictive selector 或 fixed floor | 通过；floor 不可降低。 |
| rejected/design-change attempts | 不属于 ordinary config mutation | 仅 safe issue / external ref | 不激活；需要时回设计 | 通过；无 emergency bypass。 |

### 7.2 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 21 个 P0 是否均有发起边界、评审等级、生效、审计和回退口径 | 通过 | §5 按五域覆盖；所有非 TestOnly effective-input change 均为 high。 |
| 是否将 application/domain/API/worker/jobs 误作 config mutator | 否 | 只有 external process 与 bounded TestOnly harness 可准备候选；raw reader 仍唯一为 `infra/config.rs`。 |
| 是否假定具体工单、审批、权限或审计产品 | 否 | 只使用 opaque external ref；不创建 approval/audit truth。 |
| 是否存在 high-risk 无 review/audit/rollback 口径 | 否 | 需要 external review input、safe audit category 与 prior validated restart input；缺任一正向条件不宣称应用成功。 |
| 是否记录 raw config、full ref、secret、endpoint、body 或 image/build digest | 不允许 | §4.3、§6.3 明确禁止；不计算或伪造 digest/provenance。 |
| 是否支持 online reload、LKG、partial apply 或 fake fallback | 不允许 | P0 只能 fresh validation + restart；所有旁路 reject。 |
| rollback 是否会修改 live state、UoW、history、trace、event、candidate、Artifact 或 consumer truth | 不允许 | 回退只是新一轮 startup input validation；其余边界仍归各 owner。 |
| review/restart 是否被写成 owner contract closure 或 readiness | 不允许 | MI-UP / Q-MI、DDD 与 PF blocker 全部保持开放。 |
| 是否新增需回写 03 的当前代码契约 | 否 | 仅细化现有 source/validator/builder 的配置语义；见 §8。 |

## 8. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 变更统一为 fresh validation + restart；无 hot/LKG/partial apply | 否 | 细化 Step 9 activation 语义 | 不适用；承接 03 §13 | 无回写 |
| change/reason/review/rollback 仅为外部 opaque reference，不创建本仓 audit/approval object | 否 | 配置治理边界 | 不适用；不新增 port/object/flow | 无回写 |
| safe audit output 不携带 raw config/full ref/secret/body/digest | 否 | 承接 03 §14 redaction/no-body | 不适用 | 无回写 |
| prior validated input 的回退须重新走现有 loader/builder，不改 `ImageRuntimeAssemblyState` | 否 | 启动期配置语义 | 不适用；现有 `Unassembled/Assembled/Blocked` 不变 | 无回写 |
| 若未来要 runtime authorization、durable config audit、online reload/LKG、secret provider rotation API、rollback orchestration 或 config version/digest algorithm | 不属于当前配置结论 | 触发时才可能影响 config carrier、port、builder、error/flow | 触发时重开 03 §5/§6/§8/§13/§14 与对应 calibration Step | 无回写（当前未触发） |

当前没有“待回写”或“阻塞待确认”的 03 影响项。`MI-UP-001/002/003/006/007/008`、`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 与 `PF-UNAVAILABLE-RECOVERY` 继续存在，且不能由 change/review/restart 关闭。

## 9. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议继续阅读“角色分类与责任边界”“变更等级与不可变红线”“Safe audit surface 与禁止输出”“五域 P0 变更、审查、审计与回滚矩阵”“配置变更与 restart 回退链图”“回退规则矩阵”“敏感 selector 轮换附加规则”和“跨变更审计 / 回滚审计表”。

正式 `04-配置设计.md` §10 应回填以下收口结论：

1. 所有 21 个 P0 配置项都只能由外部 configuration/release process 离线准备候选输入；TestOnly harness 只可在 `ci-test + explicit TestOnly` 内准备 fixture selector。项目模块均不直接写入配置。
2. 非 TestOnly P0 effective-input change 均为 high-risk：外部过程必须保留 scoped change/reason/review input；本仓不拥有或验证 governance approval truth。
3. 生效统一为 `new input -> strict validation -> new startup -> local assembly`；不支持 reload、hot、online override、LKG、partial apply 或 fake fallback。
4. audit 只能包含配置域/key/slot/seam/profile/mode 类别、安全 disposition/issue ref、及外部 opaque change/actor/reason/review/rollback ref。不得输出 raw JSON、full selector、secret、endpoint、body、image/build/Artifact digest、manifest、gate 或 consumer truth。
5. 回退只能使用先前已验证且当前仍能严格校验的 body-free 输入，重新启动并重新装配；输入缺失、过期、scope/owner/profile 不符或 owner contract 未闭合时保持 `Blocked`/`Gap`/`Unknown` 等保守结果。
6. 配置回退不修改 runtime live state、domain truth、UoW、history、trace、event、candidate、Artifact 或 consumer confirmation；`Assembled` 永远不升级为 readiness。

正式章节不得把 external review ref 写成 approval/signoff 事实，不得新增审计表、digest 算法、发布/回滚命令、secret/provider 产品、在线运行时接口或外部成功结果。任何此类需求必须先重开 03 与 04。

## 10. 待确认事项与持续 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 外部 change/review/authorization process 的 owner、schema 与 retention | 影响 opaque reference 的实际解析与审计执行 | 本仓只规定 safe association，不声称已授权、已审计或已 signoff。 |
| config artifact 的真实存放、previous validated input 的保留与 restart execution | 影响实际 rollback 操作 | 不定义 host/container/runbook；prior input 不可得时 fail-closed。 |
| `MI-UP-001` Member Service contract | `member_service_supply_ref` 的可验证性及回退 | 保持 `ConsumerHandoffGap`/unavailable/reopen，不写 manifest/confirmation。 |
| `MI-UP-002/003/006/008` component/mapping/seed/base owner contracts | static selector 的稳定性和回退 | 保持 opaque pending ref 或 gap；不复制 body/兼容性/基线。 |
| `MI-UP-007`、`Q-MI-003/004` Artifact/builder/qualification policy | external selector 的正向解释 | 不产生 candidate/digest/gate/Artifact/发布事实。 |
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 配置变更后的 application write/recovery lane | 配置不解除 blocker；继续既有 zero-effect / safe marker 语义。 |

## 11. 自检与 Step 10 停审门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否逐域覆盖全部 21 个 P0 item | 通过 | §5、§5.1 覆盖五域和全部 item 组。 |
| 是否为每类变更定义提交者、评审、生效、审计和回退 | 通过 | §4、§5、§6。 |
| 是否把具体审批/工单/审计产品写成前提 | 否 | 仅 external opaque refs，§4.1、§4.3。 |
| 是否有高风险无审查或无回退语义 | 否 | 全部非 TestOnly P0 为 high；prior validated restart input。 |
| 是否泄漏 raw config/full ref/secret/endpoint/body/digest | 否 | §4.3、§6.3 明确禁止。 |
| 是否引入 hot reload、LKG、partial apply、online override 或 fake fallback | 否 | §3.3、§4.2、§6.2。 |
| 是否把 review、rollback 或 `Assembled` 误作 readiness/发布/owner contract closure | 否 | §5~§7 明确 local/fail-closed 边界。 |
| 是否新增 03 未定义的当前 object/port/flow/constructor | 否 | §8 全部无回写；未来 trigger 未发生。 |
| 是否将持续 blocker 写成已关闭 | 否 | §8、§10 全部保持 pending/blocker。 |

```text
step_10 = completed
gate_status = pass
current_module = cross-change-audit (closed)
next_allowed_action = create_and_complete_step_11_failure_degradation
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

**停审结论：** Step 10 已完成。用户已授权完成全部 04，因此下一动作只能严格创建并完成 Step 11；不得跳过失效策略、下游承接、演进、风险与正式装配，也不得进入 05~07、实现、测试执行、证据或 commit。
