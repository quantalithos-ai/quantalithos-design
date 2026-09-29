# Step 10. 定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 正式回填：`04-配置设计.md` §10
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 11）

## 1. Step 状态、输入与边界

| 项 | 结论 |
|---|---|
| 当前 Step | Step 10：配置变更、审计与回滚 |
| 输入 | Step 7 配置项清单、Step 8 敏感配置、Step 9 加载/校验/生效矩阵、03 §10～§15 的 UoW/幂等/观测边界 |
| 输出 | 变更分类与权限表、评审/生效/审计/回滚规则、失败与漂移处理、跨变更审计 |
| 变更模型 | 生成不可变 candidate → 严格校验 → 评审 → 新 assembly 或新 job-run-start 生效；不原地改写已 pin 的 operation/effect/plan |
| 本步不做 | 不选择工单系统、部署平台、secret provider、KMS、存储供应商、告警产品或具体回滚命令；不创建配置服务、outbox 或通用审计 ledger |
| 生效上限 | P0 不支持 `reload`、`hot`、online LKG 或动态 adapter replacement；失败只能拒绝 candidate 或建立新的 assembly |
| 下一动作 | 同步 flow/台账后进入 Step 11 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置可以由谁变更？ | 只有经授权的配置维护角色可提交 candidate；评审角色按风险类别分离。普通 internal budget/profile 可由项目配置 owner 提交，涉及 slot、source/owner、authority/visibility、integrity、storage、receiver、codec/cursor、redaction 或 telemetry boundary 的 candidate 必须由相应 owning authority/安全评审角色确认。Archive 不授予这些 owner 的业务决定权。 |
| 哪些变更需要评审？ | 所有 candidate 都要通过 schema、来源冲突和 cross-field 校验；`critical/high` 变更还需独立评审。required slot、敏感 ref、红线/安全边界、恢复 receiver、operation/cursor codec、storage/governance ref 和 profile posture 均视为 high/critical。仅文档注释或未被加载的历史材料不构成运行配置变更。 |
| 变更如何生效？ | startup/assembly 配置通过新 config identity + 新 `ArchiveRuntimeAssembly` 生效；job target、schedule、batch/timeout/retry/probe/lease 通过新 job-run-start 固化；entry-local 仅影响当前入口。没有原地替换 handle 的路径。旧 operation/effect/plan 继续使用其 pinned identity。 |
| 变更如何记录审计？ | 记录安全的 change identity、actor category、profile、domain、classification、old/new redacted identity 或 revision、validation result、review posture、activation posture、rollback relation 和 issue ref。不得记录 raw value、secret、完整 ref、endpoint、selector、owner identity、payload、provider response 或正文。审计记录属于受控配置变更审计边界，不冒充 Archive 业务历史或 observability evidence。 |
| 变更失败或效果异常如何回滚？ | 校验失败不产生 active candidate；assembly 构造失败不暴露 facade；job candidate 失败则该 job rejected/blocked。已生效 candidate 的回滚采用上一个“已验证且仍被允许”的 candidate 重新走校验、评审和新 assembly；不在线覆盖、不删除旧业务记录、不重写外部 intent。若外部效果已进入 Unknown/MayHaveDispatched，先走 probe/reconcile，不能以配置回滚代替事实核验。 |
| 如何处理敏感配置轮换？ | P0 只提交 opaque ref 的新 revision，按 startup/new assembly 或新 job-run-start 生效；真实 secret 由未来受控 provider 私有解析。轮换不改变旧 operation 的 binding identity，也不把 secret 写入审计或日志。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 旧 README/历史 05/06 把配置变更等同于部署命令或供应商控制台操作 | 会把未选定平台写成设计契约 | 仅定义 candidate、评审、校验、assembly 和审计语义；命令与平台留给 09/实施层 |
| 03 只允许 infra 读取 raw config，业务对象保存 pinned identity | 变更若原地替换会造成旧作业漂移 | 所有可生效变更都产生新 config/binding identity；旧 work 不迁移 |
| 外部 storage/receiver/governance/integrity 合同仍有 blocker | 误把“配置已改”当成外部能力已成功 | 变更审计只记 validation/activation posture；外部结果仍按 typed outcome、probe/reconcile 记录 |
| secret/ref 的审计粒度不清 | 变更记录可能泄露凭据或 owner 关系 | 只保留分类、revision、redacted identity/issue ref；raw value 和完整 locator default-deny |
| `reload`/`hot`/LKG 尚未有回滚与并发语义 | 半切换会产生两套 adapter 或不一致 facade | P0 明确 unsupported；需要未来能力时先回写 03/04，不得静默开放 |

## 4. 变更分类与权限边界

| 变更类别 | 典型配置域/项 | 发起方 | 评审要求 | 风险级别 | P0 生效方式 | 回滚方式 |
|---|---|---|---|---|---|---|
| profile/非敏感预算 | `profile.name`、schema/config revision、`budgets.*` | 配置维护角色 | schema + cross-field；影响生产姿态时需独立评审 | medium；profile posture 为 high | 新 assembly；job budget 在新 run 固化 | 重新提交前一 validated candidate，建立新 assembly/run |
| 本地 store/context/worker control | `stores.*` | infra/config owner | store capability、UoW/CAS/probe、fake/production posture 评审 | high | 新 assembly；worker 新 lease context | 前一 validated binding + 新 assembly；旧 work 保持原 identity |
| source/authority/visibility | `sources.*`、`authority_visibility.*` | 对应 source/authority owner + 配置维护角色 | source totality、visibility/redaction、owner contract 评审 | high/critical | 新 assembly；selected target 在新 job 固化 | 前一 binding candidate；当前缺口仍 blocked，不回填 canonical truth |
| integrity/compatibility | `integrity_compatibility.*` | integrity/compatibility authority + 配置维护角色 | capability、schema/version、target 兼容性评审 | critical | 新 assembly；assessment 新 run 固化 | 回到前一 validated ref；未知/unsupported 不自动放行 |
| storage/lifecycle/governance | `storage_lifecycle.*` | storage/governance owner + 配置维护角色 | placement/decision/schedule 关系及 probe 能力评审 | critical | 新 assembly；effect/decision 在新 run 固化 | 新 assembly 使用前一 ref；不撤销 owner decision、不删除记录 |
| restore receiver/inbound trust | `restore_receivers.*`、`inbound.*` | receiver/trust owner + 配置维护角色 | owner totality、schema/trust、ACK/commit 边界评审 | critical | 新 assembly；新 plan/job 固化 owner map | 前一 validated map；未闭合 owner 继续 blocked/quarantine |
| operation/cursor/redaction/telemetry | `operation_cursor.*`、`redaction_profile_ref`、`observability.*` | 安全/协议 owner + 配置维护角色 | codec/mapping、default-deny、Query no-write 和 safe sink 评审 | critical/high | 新 assembly；旧 key/cursor/trace 不漂移 | 前一 validated revision + 新 assembly；不重算旧 digest/cursor |
| 文档说明/注释材料 | JSONC 文档示例、calibration 说明 | 文档维护角色 | 文档审阅；不得改变 strict JSON | low | 不进入 runtime | 修订文档即可，不产生 runtime audit |

权限只按角色类别描述，不假设具体组织、工单、审批系统或人员。任何角色都不能通过配置改变 truth owner、RetentionPolicy/legal hold/delete/risk decision、Archive 状态、Query no-write、UoW/CAS/fence、outbound blocker 或 restore handoff 边界。

## 5. Candidate 变更与生效流程

#### 变更审计链图: L4-archive 配置 candidate、评审、激活与回滚

```text
[authorized change candidate]
             |
             v
[source collection: DECL < JSON < ENV]
             |
             v
[parse + type/range + cross-field + sensitivity checks]
             |
       invalid? ---- yes ---> [reject; safe issue ref; no activation]
             |
             no
             v
[risk classification + independent review when high/critical]
             |
       reject? ---- yes ---> [audit rejected posture; keep active candidate]
             |
             no
             v
[new config identity / new assembly or new job-run-start]
             |
       build fail? ---- yes -> [audit blocked posture; no facade/effect]
             |
             no
             v
[active candidate; old work remains pinned]
             |
       anomaly/withdrawal
             v
[validate + review prior candidate -> new assembly]
```

关键说明:

- 图表达受控 candidate 和 identity 迁移，不表达部署命令、工单产品、secret provider 或外部业务成功。
- “active”只表示本地 validated assembly 暴露了允许的 facade；不表示 Bundle、storage、restore 或 owner readiness。
- rollback 是新的受控变更，不是删除审计记录或重写已提交的 Archive history。

## 6. 变更审计记录字段与禁止输出

| 记录字段 | 来源 | 允许值/处理 | 禁止内容 |
|---|---|---|---|
| `change_ref` / `candidate_ref` | 受控变更边界 | opaque body-free ref | raw request、自由文本正文 |
| `actor_category` | 认证后的角色类别 | finite category | 人员身份、token、session |
| `profile` / `domain` / `classification` | validated candidate | finite enum | 未校验 module path 或任意标签 |
| `old_identity` / `new_identity` | config/binding revision | redacted identity 或安全 revision ref | 完整 locator、endpoint、DSN、secret |
| `validation_posture` | Step 9 issue/result | `accepted/rejected/blocked/unsupported` 等有限值 | raw error/provider response |
| `review_posture` | 评审边界 | `not_required/pending/approved/rejected` | 未经授权的“已批准”断言 |
| `activation_posture` | builder/job-run-start | `not_activated/assembly_ready/target_blocked` 等有限值 | product readiness、外部 commit |
| `rollback_of` / `supersedes` | candidate lineage | opaque relation ref | 删除原记录、伪造旧成功 |
| `issue_ref` / `timestamp` | safe diagnostic/context | safe issue ref、受控时间 | stack、payload、secret、scope/owner |

变更审计记录的保存位置、保留期、访问控制和导出由正式运维/治理 owner 决定；本项目不创建第二套业务审计数据库，也不把配置审计记录当作 `L4-observability` 的完整 evidence chain。

## 7. 变更类型矩阵（权限、评审、生效、审计、回滚）

| 变更类型 | 权限/评审 | 生效与旧工作 | 审计最小集 | 回滚与失败 |
|---|---|---|---|---|
| 普通 internal parameter | 配置维护角色；schema 校验；跨字段影响时独立评审 | 新 assembly 或新 job run；旧 run 不漂移 | domain、classification、revision、validation/activation posture | candidate reject；前一 validated candidate 新 assembly |
| sensitive binding/ref | 配置维护角色 + 相应 owning/security reviewer | 新 assembly/job-run-start；不记录完整 ref | slot/source/target category、redacted revision、review、issue ref | 缺合同则 blocked；不得 fake fallback 或覆盖旧 intent |
| required/optional slot posture | infra owner + 独立评审 | 只能通过 `ArchiveRuntimeAssembly::begin` 新建；required 不可降为 optional | slot family、required-set posture、build result | build fail→不暴露 facade；恢复前一 assembly需重新验证 |
| redaction/telemetry mode | 安全/观测 owner + 独立评审 | 新 assembly；不以 telemetry 开关放宽业务边界 | policy revision、safe validation、activation posture | denylist缺失/冲突→fail-closed；前一安全 revision 新 assembly |
| codec/cursor mapping | 协议/存储 owner + 独立评审 | 新 assembly；旧 operation/cursor 继续 pinned | codec/mapping category、compatibility posture | 未闭合→mutation/continuation blocked；不重算旧 key |
| owner/receiver/decision target | owning authority + 配置维护角色 + 独立评审 | 新 job plan/run；旧 plan 不重写 | target category、decision/schema revision、blocked posture | owner 未确认→blocked；不以回滚制造 owner 决定 |
| rejected/withdrawn candidate | 发起方可撤回未激活 candidate；无需改变 active | 不暴露、不影响旧 work | candidate ref、reason category、validation/review posture | 保持 active candidate；不写业务 history |

## 8. 回滚规则与边界

| 场景 | 允许动作 | 禁止动作 | 结果姿态 |
|---|---|---|---|
| parse/type/cross-field 失败 | 记录 safe issue；保留当前 active assembly | 回退低优先级来源、猜默认值、半应用 | `rejected` / `fail-fast` |
| required slot 缺失或 Degraded | 保持无 facade；修正 candidate 后新 assembly | 用 marker 冒充 handle、启用 fake、缩短 required set | `blocked` |
| 新 assembly 构造失败 | 继续使用尚未替换的 active assembly（若其仍在有效运行边界）；新请求按 gate 处理 | 在线替换一半 adapter、修改旧 identity | `assembly_failed` |
| job-run-start target/预算失败 | 拒绝当前 job；可提交新 candidate/new run | 用 current config 猜旧 run、跳过 owner/decision | `rejected` / `blocked` |
| 外部 effect 已 dispatch 但结果 Unknown | 保持 intent 与 Unknown；先 probe/reconcile | 以 config rollback 直接重派、伪造 committed | `commit_unknown` / `reconcile_required` |
| 发现已激活 candidate 不安全 | 按前一 validated candidate 重新评审并新 assembly；必要时阻断危险入口 | 删除审计记录、secret 泄露、强制 hot swap | `blocked` 或安全旧 assembly |
| source/owner/governance 合同变化 | 等正式 owner 决定并提交新 binding/decision ref | Archive 自行改状态/保留期/hold/delete/risk | `blocked` / `unknown` |

“保留当前 active assembly”只适用于该 assembly 本身仍通过既有安全和版本边界；不构成 online last-known-good 机制，也不允许在配置源不可验证时默默继续。

## 9. 配置变更停审记录

| 配置组/变更类型 | 权限 | 评审 | 审计 | 回滚 | 结论 |
|---|---|---|---|---|---|
| profile/预算 | 通过 | 通过 | safe revision/posture | 新 assembly | 通过；数值 authority 仍 pending |
| stores/source/authority/visibility | 通过 | 通过 | category + redacted identity | 新 assembly；缺合同 blocked | 通过；不升格 owner truth |
| integrity/storage/lifecycle | 通过 | 通过 | target/decision posture | 新 assembly/new job | 通过；外部合同 blocker 保留 |
| restore/inbound | 通过 | 通过 | owner/family/schema posture | 新 map + new plan | 通过；无 all-owner fallback |
| operation/cursor/redaction/telemetry | 通过 | 通过 | policy/codec category | 新 assembly | 通过；local codec/mapping pending |
| rejected/withdrawn candidate | 通过 | 通过 | rejected posture | active candidate unchanged | 通过 |

## 10. 跨变更审计 / 回滚审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 高风险配置是否都有独立评审、审计和回滚路径 | 是 | 评审者只按角色类别描述；不绑定工单产品 |
| 敏感配置变更是否避免 raw secret/ref/endpoint 泄露 | 是 | 只记分类、revision、redacted identity/issue ref |
| 非法高优先级值是否可能回退低优先级来源 | 否 | whole candidate reject；不 fallback |
| 变更是否可能漂移旧 operation/effect/plan | 否 | config/binding identity pinned；旧 work 不重建 |
| rollback 是否会重写 Archive 业务历史或 owner truth | 否 | rollback 是新 candidate/new assembly；不删除或反写 |
| hot reload/online LKG 是否有未定义的半切换路径 | 否 | P0 unsupported；未来能力须回写 03/04 |
| 外部 Unknown 是否会被配置回滚误判为失败或成功 | 否 | 先 probe/reconcile；保留 Unknown/Compensation posture |
| 配置审计是否被误当作 observability evidence 或 readiness | 否 | 三层信号分离；`AR-UP-007` 仍开放 |
| 具体部署/工单/告警产品是否被写成硬依赖 | 否 | 留给 07/09；本步只定义语义 |

## 11. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| candidate 只能经新 assembly/job-run-start 生效，旧 work 使用 pinned identity | 否 | 承接既有 runtime/幂等/事务边界 | 不适用 | 无回写 |
| high/critical 变更需独立评审，审计只保存 safe posture | 否 | 配置治理语义，不改变代码契约 | 不适用 | 无回写 |
| rollback 先 probe/reconcile，不以配置回滚替代外部事实 | 否 | 承接 Step 11/12 external Unknown 语义 | 不适用 | 无回写 |
| P0 不支持 reload/hot/LKG；未来若开放需新增 API/port/error/flow | 是（未来触发） | runtime/builder/lifecycle contract | 03 §4～§15 与对应 calibration Step | 无回写（触发前暂停） |
| 若新增配置审计 durable object/port 或跨仓导出协议 | 是（未来触发） | persistence/observability/protocol contract | 03 Step 06/07/11/15 | 无回写（触发前暂停） |

## 12. 回填草稿与进入下一步条件

正式 §10 应回填：变更分类与权限边界、candidate 变更审计链、审计字段/禁止输出、变更类型矩阵、回滚规则和跨变更审计结论。不得回填具体工单系统、部署命令、供应商、secret、endpoint 或未确认的外部成功。

| 条件 | 状态 |
|---|---|
| 每类可变更配置都有发起方、评审、生效、审计和回滚 | 通过 |
| high/critical 配置有独立评审且敏感值不泄露 | 通过 |
| rollback 与 old-work pinning、Unknown/reconcile 一致 | 通过 |
| P0 reload/hot/LKG 明确 unsupported | 通过 |
| 当前无 03 待回写项 | 通过；未来 API/port/flow 仅作为触发器 |
| 跨变更审计无 unresolved 冲突 | 通过 |
| 可进入 Step 11 | 通过 |
