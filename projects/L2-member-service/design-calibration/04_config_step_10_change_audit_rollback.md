# Step 10：定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节：未来正式 `04-配置设计.md` §10“配置变更、审计与回滚”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md`
> 执行模式：full-restart；本文件定义未来变更控制规则，不生成实际变更、审计、回滚、测试或运行证据

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 10 配置变更、审计与回滚 |
| 当前模块 | `change_audit_rollback` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 7 配置项、Step 8 敏感配置、Step 9 加载 / 校验 / 生效、`03` 错误与观测边界 |
| 正式 `04` 写入 | `false`；只允许 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；以下均是设计要求，不代表已有审批、审计 sink、配置交付系统或回滚能力 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 区分启动配置、job-run-start、entry-local 和 test-entry 的变更作用域。
- [x] 定义不替代 Governance / Identity 授权 truth 的发起和评审前提。
- [x] 按风险级别收束可变更项、拒绝项、审计最小字段与敏感输出禁令。
- [x] 为 cold restart、新 job run、入口重试和 test rerun 定义回滚规则。
- [x] 完成跨变更审计、`03` 影响判定、§10 回填草稿与停审结论。

## 2. 本步目标与边界

本 Step 定义已通过外部授权的配置变更如何被验证、激活、以安全元数据留痕和撤回。它只管理本仓的配置控制面；不裁决谁被授予操作权，不拥有治理审批事实，也不把配置变更写入 Host Truth。

本 Step 不定义：

- 具体工单、审批、权限、身份、审计、制品或配置交付产品；
- 真实 secret provider、credential 签发、轮换或撤销 API；
- remote config、admin override、runtime reload、hot swap 或 online last-known-good；
- Member / Images / Runtime / Sandbox / Core / Bus 的 exact ref、route、envelope 或 feedback schema；
- 实际 restart、回滚、审计、测试、发布或运行结果。

P0 中变更仅能以重新校验后的 cold restart、一次新的 job run、一次新的 entry invocation 或一次 test harness rerun 生效。任何对 static design boundary 的“变更”都不是配置变更，而是需要重开相应设计真相源的设计变更。

## 3. 本步输入

| 输入 | 本 Step 用途 | 状态 |
|---|---|---|
| `04_config_step_07_config_items.md` | 类型、默认、来源、作用域、生效和失败策略 | completed |
| `04_config_step_08_sensitive_secrets.md` | opaque ref、secret body 禁止、轮换 / 撤销边界 | completed |
| `04_config_step_09_loading_validation_activation.md` | startup / job-run-start / entry-local / test-entry 及 P0 无 reload/hot | completed |
| `03_ddd_step_12_errors_recovery.md` | rejected、blocked、unknown、rollback 与 immutable stored replay 语义 | completed |
| `03_ddd_step_15_observability_audit.md` | redacted config issue、低基数记录和 forbidden-body 约束 | completed |
| `MSVC-UP-001~008` | 识别不得由本地配置变更伪造的外部正向合同 | pending / blocked |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些配置可以由谁变更？ | 本仓只接受已由外部授权边界允许的发起方输入。启动配置由受控配置交付方提交；job-run-start 参数由已授权 job invocation 提供；entry-local 参数由当前入口调用者提供；`deterministic_fixture.*` 仅由 `ci-test` test harness / `operations-replay` invocation 提供。`domain`、`contracts`、application、API、worker、job handler 均不直接变更 raw config。 |
| 哪些变更需要评审？ | store / resolver / binding ref、launch credential ref、publication / handoff target、redaction、safe-read、idempotency retention、profile 与 future real-like 绑定属于高风险或禁止项；有限批量、超时、page 上限的收窄可按低风险处理，但仍必须经 validator 和安全留痕。 |
| 变更如何生效？ | startup 变更重新 merge、parse、validate、build 后，以 cold restart 生效；job-run-start 只冻结于新 run；entry-local 只作用当前 entry；`deterministic_fixture.*` 只作用 `ci-test` test 或 `operations-replay` assembly。P0 不存在 runtime reload / hot update。 |
| 审计记录如何处理？ | 未来实现的变更记录只可保存外部 change / initiator / reason 的 opaque ref、配置 section、profile、activation kind、redacted old/new digest、validation outcome、safe issue ref 和 rollback reference。审计记录不是 Host Truth，具体 sink 与保留策略仍 pending。 |
| 变更失败或效果异常如何回滚？ | startup 只可回到先前已验证且已批准的配置 artifact / digest 后再 restart；job 以先前有效输入发起新 run；entry 以先前 selector 重新调用；`deterministic_fixture.*` 仅在 `ci-test` / `operations-replay` 恢复先前 ref 并重新组装。不得修改既有 stored result、Host history、outbox、handoff marker 或以低优先级值掩盖失败。 |
| 敏感变更如何处理？ | 只变更 opaque ref；不得让 raw credential、token、endpoint secret、manifest 或外部正文成为变更输入或审计输出。真实轮换 owner 未闭合时，高风险动作 fail-closed。 |
| 是否有不可变更项？ | 有。执行主语、Host Truth owner、状态机、generation fence、UoW、metadata / idempotency、Query no-write、Job no-authorization、redaction 下限与四层 handoff 不是配置可变项。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| Step 7 | 有配置项和失败策略，缺少变更主体、评审与撤回口径 | 以作用域和风险分级补齐变更控制矩阵 |
| Step 8 | 已区分 opaque ref 与 raw secret，未定义 ref 变更留痕 | 只允许 redacted digest / safe ref 类别进入未来审计表面 |
| Step 9 | 已定义加载和激活，未集中说明异常变更如何退回 | 按 activation kind 定义 restart / new run / rerun 回滚 |
| `03` | 已有 redacted issue 和 immutable replay / history 边界 | 明确配置回滚不能改写 Host Truth 或既有结果 |
| 历史材料 | 可能把部署平台或人工流程写成既定事实 | 改为产品中立的外部授权 / change reference 前提 |

## 6. 改动前后对比

| 项目 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 变更权限 | 仅有来源优先级 | 区分外部授权前提与本仓可接受的作用域 | 避免本仓越权定义 approval truth |
| 风险分级 | 未集中定义 | 低 / 中 / 高 / 禁止四级 | 让高风险 ref 与安全项有统一门禁 |
| 审计 | 仅有禁止输出原则 | 固定最小安全字段和无 owner 规则 | 便于后续测试 / 验收承接，不锁定 sink |
| 回滚 | 仅有 cold 生效说明 | 明确 previous validated artifact / new run / rerun | 防止错误配置被隐藏或改写历史 |
| 敏感 ref | 有禁止明文规则 | 增加 ref 变更和轮换的 digest-only 原则 | 防止审计泄露 |
| hot reload | P0 unsupported | 变更及回滚路径继续明确拒绝 | 不预留无 lifecycle contract 的在线切换 |

## 7. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| 是否指定审批平台 | 指定某产品 / 使用 product-neutral reference | 采用后者；授权与审批 truth 留在外部 owner |
| 是否记录完整配置 diff | 保存完整 diff / 保存 redacted canonical digest 与 section | 采用后者；完整 diff 可能泄露 ref 和拓扑 |
| P0 是否支持在线回滚 | live reload / restart、new run、rerun | 采用后者；前者需新的 `03` lifecycle contract |
| job 参数能否覆盖全局配置 | 可以覆盖 / 仅冻结当前 run | 仅冻结当前 run，且只可在已定义可收窄字段内生效 |
| 变更失败后是否 fallback | 回退低优先级或 fake / reject、blocked、显式回滚 | 采用后者；高优先级非法输入不得被掩盖 |
| 敏感 ref 是否记录原文 | 记录原文 / 记录类别与 digest | 采用类别与 digest，不输出 full ref 或 body |

## 8. 结构化中间产物

### 8.1 发起边界与评审分级

| 变更输入面 | 允许作用域 | 不允许范围 | 最低安全前提 |
|---|---|---|---|
| 受控 startup 配置交付 | 已声明的 startup 配置 section | 直接写 Host Truth、绕过 validator、注入 raw secret | 外部授权语境 + strict validation + restart |
| job-run-start input | `operation_jobs`、允许的 health / target snapshot、replay source | 覆盖 store、binding、redaction、主语、metadata 或 state | 当前 job 的授权 / metadata 已在其入口另行验证 |
| entry-local selector | 当前 profile/source/request selector、受限 diagnostic selector | 持久化全局 config、伪造 job metadata、改变 static boundary | 只影响当前 entry，失败即 reject |
| deterministic fixture / replay | fake seed、固定 clock/id、脱敏 replay ref | 进入 `local-dev`、`integration-like` 或 future profile、写真实 secret 或 external body | `ci-test` / `operations-replay` guard + fixture source 校验 |
| 设计变更入口 | static boundary 或新能力讨论 | 作为普通 P0 config 直接激活 | 先重开 `00~04` 中拥有真相源的 Step |

| 风险级别 | 范围 | 要求 |
|---|---|---|
| `low` | job batch / timeout / page 上限的安全收窄、局部 selector | validator 通过；保留安全变更元数据；仅当前 scope 生效 |
| `medium` | P0 profile 选择、普通 fake / placeholder mode、健康阈值、`ci-test` / `operations-replay` fixture ref | 外部评审语境或受控 test/replay context；profile compatibility 验证 |
| `high` | logical store、qualification resolver、Member / Images / Runtime / Sandbox ref-bearing binding、credential ref、publication / handoff target、idempotency retention、redaction 变更 | 明确 change / reason / rollback reference；完整 validation；cold restart 或 new run |
| `forbidden` | raw secret/body、redaction 放宽、`body-free` 放宽、query repair、hot/reload、remote/admin source、fake 升格 ready、truth/state/owner override | P0 validation reject；如确有需求，先走正式设计变更 |

### 8.2 配置变更控制表

| 配置族 / 变更类型 | 风险 | 生效方式 | 未来安全留痕最小项 | 回滚方式 |
|---|---|---|---|---|
| `profile` / `config_identity` | medium | startup + cold restart | profile、section、old/new config digest、validation outcome | restore previous validated artifact + restart |
| truth / maintenance / idempotency store binding | high | startup + cold restart | logical slot、profile、old/new ref digest、change/reason ref | restore previous approved binding; builder failure 不暴露 facade |
| qualification resolver / ref-bearing lifecycle binding | high | startup + cold restart | family、availability mode、old/new ref digest、validation issue | restore previous binding；不得自动 fallback 成 fake |
| carrier availability marker | medium / high | startup + cold restart | availability、section、change/reason ref | restore previous marker or remain blocked；不引入 carrier ref / release schema |
| registration / heartbeat / health threshold | medium / high | startup；threshold 可 new job run | mode、threshold class、credential ref digest（如有） | restart 或以先前有效输入新建 job run |
| publication / handoff enablement、event / target ref | high | startup 或 new job run | enabled state、event category、target digest、feedback mode | restore previous disabled/target configuration；local truth 不回滚 |
| operation job batch / parallelism / retry / timeout | low / medium | startup 或 new job run | job kind、numeric class、run-local flag、validation outcome | 恢复启动默认值或以先前输入发起新 run |
| safe read / security redaction | high / forbidden | startup + cold restart | section、deny-list / label-list digest、reason / review ref | 仅能恢复先前更严格或已批准配置；放宽被拒绝 |
| clock / id / `deterministic_fixture.*` | medium | startup / test-entry / replay run | profile、mode、fixture digest、test-only marker | restore previous ref / rerun test；不得进入非允许 profile |
| raw secret/body 或 static override 尝试 | forbidden | 不激活 | safe issue class、section、source category | 无运行回滚；记录拒绝语义，必要时重开设计 |

### 8.3 未来变更记录的安全字段规则

下表是未来实现 / 运维承接必须满足的字段语义，不代表本仓已创建任何记录、sink 或 report。

| 字段语义 | 何时需要 | 允许内容 | 禁止内容 |
|---|---|---|---|
| `change_reference` | high 变更必需；low 可用受控 delivery ref 替代 | opaque 外部变更关联 | 审批正文、ticket body、secret |
| `initiator_reference` | 所有可接受变更 | actor / automation / invocation 的安全 ref | credential body、个人敏感正文 |
| `reason_reference` | high 变更必需 | 脱敏原因关联 | 原始审批 / 外部正文 |
| `config_section` / `profile` | 所有变更 | 稳定 section 和 profile 名 | raw config object |
| `activation_kind` | 所有变更 | startup、job-run-start、entry-local、test-entry、rejected | P0 成功状态中的 reload / hot |
| `old/new_config_digest` | startup / artifact 变更 | canonical redacted digest | 完整配置文件、raw value |
| `old/new_ref_digest` | sensitive ref 变更 | ref 的脱敏 digest / category | full ref、endpoint、DSN、token |
| `validation_outcome` / `safe_issue_ref` | 所有变更；失败时 issue 必需 | accepted / rejected / blocked 类别和 safe issue ref | stack、provider body、invalid raw value |
| `rollback_reference` | high 变更 | previous validated artifact 或 new-run invocation ref | rollback script、secret / endpoint |

### 8.4 回滚规则矩阵

| activation kind | 可接受的成功上限 | 失败 / 异常 | 回滚 / 处置 | 明确禁止 |
|---|---|---|---|---|
| startup | 所有本地 parse / validation 通过且 builder 仅完成本地装配 | source / validator / required local binding 失败 | 使用先前已验证配置重新启动；未验证 artifact 不得作为回滚目标 | hot patch、跳过 validator、低优先级 fallback |
| job-run-start | 当前 run 输入已冻结且通过限制校验 | target / batch / timeout / replay source 非法或 unavailable | 拒绝当前 run；以先前有效输入或修正输入启动新 run | 改写既有 stored result / history，复用不同 digest 的同一 key |
| entry-local | 当前 selector 已通过入口校验 | selector、path、profile 或局部参数无效 | 拒绝本次 entry；由调用者重新提交有效 selector | 将 selector 写进全局 startup config |
| test-entry | fixture / fake assembly 符合 test profile | fixture/ref/time/id seed 无效或越界 | 恢复先前 fixture ref 并重新运行测试 / replay | 让 fixture 渗入非 test profile |
| forbidden change | 不存在成功上限 | raw material、invariant override、hot/reload 等 | 不激活；保留安全拒绝语义；必要时重开设计 | emergency flag、静默接受、伪造 ready |

### 8.5 敏感配置变更附加规则

| 敏感配置族 | 变更边界 | 轮换 / 撤销口径 | 审计输出上限 | 未闭合时处理 |
|---|---|---|---|---|
| Member / Images / Runtime / Sandbox ref-bearing binding | 只更新 opaque ref 和 availability，不能补 sibling body | P0 ref update + cold restart | ref 类别、digest、availability | `MSVC-UP-001~004` 保持 blocked / placeholder |
| carrier availability marker | 只更新 availability marker；不提供 carrier ref、release schema 或承载 body | marker update + cold restart | availability、section、issue ref | carrier 合同未闭合时保持 blocked / gap |
| launch credential ref | 只接受外部 owner 提供的 opaque ref | owner 未闭合；P0 不在线重读 | ref digest、safe issue class | `MSVC-UP-006` fail-closed |
| publication / handoff target ref | 只更新 target ref，不定义 Core/Bus route / receipt | ref update + restart 或 new run | target kind / digest、local marker ref | `MSVC-UP-007` pending；不推导 delivered/accepted |
| `deterministic_fixture.*` / replay source ref | 仅 `ci-test` test-entry 或 `operations-replay` replay run，且必须脱敏 | 按当前 run / test 更换 | fixture category / digest | 其他 profile reject |
| future provider ref | 不进入 P0 schema | 未来 provider 规则另行设计 | provider ref digest only | 先回写 `03`，不假设 API |

### 8.6 配置变更停审记录

| 变更域 | 权限 / 评审边界 | 审计 / 回滚 | 结论 |
|---|---|---|---|
| profile / identity / local stores | 外部授权前提、高风险 binding 分级 | digest-only；cold restart 回滚 | 通过 |
| resolvers / sibling bindings | 不定义对端 schema；enabled 不等于 ready | previous binding 或 blocked；不得 fake fallback | 通过（上游 blocker 保留） |
| registration / health / jobs | run-local 不覆盖 startup invariant | new job run，不改写历史 / stored replay | 通过 |
| publication / handoff | target 高风险、四层 feedback 不合并 | local truth 不回滚，保持 blocked / gap / unknown | 通过（Core/Bus pending） |
| safe read / redaction | 放宽和 query repair 属 forbidden | 只允许恢复已批准安全配置 | 通过 |
| sensitive refs / fixture | ref-only、profile 隔离 | digest-only；restart / rerun | 通过 |

### 8.7 跨变更审计与回滚审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| high-risk 配置有评审前提、验证和回滚语义 | pass | 外部审批产品未锁定，采用 opaque reference |
| audit 输出不泄露 secret / full ref / external body | pass | 仅类别、digest、safe issue reference |
| startup、job、entry、fixture 回滚不混用 | pass | 每种 activation 有独立处置 |
| 变更不改 Host Truth / stored replay / outbox | pass | 仅改变未来装配或新 run 参数 |
| invalid high-priority 来源不被 fallback 掩盖 | pass | 承接 Step 5 / Step 9 fail-fast |
| hot/reload / online LKG 未被伪造为 P0 能力 | pass | 明确 forbidden / future design-change-required |
| unresolved sibling 合同未被配置变更伪造 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 持续 pending / blocked |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 以 restart / new run / rerun 生效和回滚 | 否 | 承接既有 config / builder / job 边界 | `03` §13 已有 | 无回写 |
| 变更只记录产品中立安全元数据，不定义 audit backend | 否 | 配置治理语义 | 不适用 | 无回写 |
| 回滚不改 Host Truth、stored replay、outbox 或 handoff marker | 否 | 承接 `03` 一致性与幂等边界 | `03` §11~§13 已有 | 无回写 |
| future remote config、admin override、online LKG、hot reload、dynamic adapter swap、real provider rotation | 是 | loader / builder / Port / error / audit / rollback lifecycle 新契约 | `03` §5、§7、§12~§15 | future design-change-required；当前不进入 P0 |

当前 P0 没有 `待回写` 或 `阻塞待确认` 的详细设计回写项；外部 exact contract 的实现仍受 `MSVC-UP-001~008` 限制，但不改变本 Step 的 fail-closed 配置语义。

## 10. 回填草稿：正式 `04-配置设计.md` §10

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议阅读本文件的“发起边界与评审分级”“配置变更控制表”“未来变更记录的安全字段规则”“回滚规则矩阵”“敏感配置变更附加规则”和“跨变更审计与回滚审计表”。

正式 §10 应写入外部授权前提、风险分级、受控变更表、产品中立的安全留痕字段、按 activation kind 的回滚规则及敏感 ref 附加规则。正文不得把任何具体审批产品、审计 sink、secret provider、实际操作或 actual rollback 写成已存在事实。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 配置变更的外部授权 / approval owner | 影响发起方身份如何被验证 | 本仓只要求外部授权前提，不定义 Governance truth |
| 配置 artifact 保存与 previous validated 版本保留 owner | 影响实际 rollback material | 只定义“先前已验证 artifact”语义，不锁产品 / retention |
| secret provider / credential rotation owner | 影响 launch credential 和 target ref 的实现 | opaque ref + fail-closed；`MSVC-UP-006` pending |
| Core/Bus target、receipt 和 feedback 合同 | 影响 publication / handoff 正向变更验证 | target ref placeholder；四层反馈保持分离 |
| future live reload / config center | 影响所有 change / rollback lifecycle | P0 reject；进入范围前先回写 `03` / `04` |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| 变更作用域与外部授权边界已区分 | pass | 本仓不拥有 approval truth |
| high-risk / forbidden 分类完整 | pass | stores、bindings、redaction、secret 与 static boundary 已覆盖 |
| 每类变更有生效、留痕和回滚语义 | pass | §8.2~§8.4 |
| sensitive ref 不会写入审计正文 | pass | digest / category only |
| rollback 不改 local truth 或已存结果 | pass | new run / restart / rerun only |
| P0 reload/hot 未被引入 | pass | 明确 unsupported / rejected |
| 上游 blocker 未伪装 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 保持 pending / blocked |
| `03` 影响已判定 | pass | 当前无回写，future 需先回写 |
| 正式正文未提前创建 | pass | 仅有 §10 回填草稿 |
| 下一步条件 | pass_with_upstream_blockers | 允许进入 Step 11 |

```text
step_10_status = completed / pass_with_upstream_blockers
step_10_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_11_failure_degradation
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
