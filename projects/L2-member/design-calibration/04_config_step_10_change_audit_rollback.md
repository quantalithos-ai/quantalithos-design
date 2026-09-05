# Step 10. 定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节：`04-配置设计.md` §10 配置变更、审计与回滚
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 10：定义配置变更、审计与回滚 |
| 输入 | Step 7 配置项、Step 8 sensitive 规则、Step 9 生效 / 校验机制、`03 §14` safe audit boundary |
| 输出 | 变更类型表、评审 / 审计 / 应用 / 回滚链、权限边界、停审记录、跨变更审计 |
| 当前状态 | 已完成；允许进入 Step 11 |
| P0 变更方式 | startup 配置通过已审查的新 snapshot + restart；job-run-start 通过新 invocation；entry-local 只对当前 entry；不支持隐式 hot/reload |
| 回滚原则 | 只回滚到已验证、可追溯的旧配置快照；不回滚 local business truth、不删除 history、不撤销未知外部副作用 |
| 持续 blocker | external owner、physical product、24 candidate 等 blocker 继续开放；变更不能关闭 blocker |

## 2. 本步目标与执行边界

本 Step 定义谁可以提出配置变更、哪些变更需要评审、如何记录审计、何时应用以及失败时如何回退。配置变更审计只证明本地配置控制面发生过一次受控操作，不是业务审计、外部 delivery proof、evidence、signoff 或 readiness。

本 Step 不选工单系统、发布平台、密钥产品或具体命令，不写真实 actor 名称、token、endpoint、commit、run_id 或测试结果。P0 不引入自动在线 LKG；“旧 snapshot”必须由受控变更记录明确指定。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 哪些配置可以由谁变更？ | 普通 bounded / posture 配置由被授权的项目维护者或部署操作者提出；Store、resolver、handoff、credential ref、redaction 和 profile 变更属于高风险，必须由对应 owner / 安全 / 运维职责方共同评审。 |
| 哪些变更需要评审？ | 任何改变 startup composition、required slot、sensitive ref、profile、redaction、resolver / handoff availability、projection activation、retry class 或 registry posture 的变更都需评审；entry-local 单次参数仍需入口校验。 |
| 如何生效？ | startup 变更在新 snapshot 校验通过后 restart；job-run-start 只对下一次 invocation；entry-local 在当前 entry 建立时；禁止对运行中 Job 或已开始 Command 追改。 |
| 如何记录审计？ | 记录 actor ref、change ref、profile、scope、changed module / key、old/new redacted fingerprint、validation result、review decision、activation mode、rollback reference 和 safe issue ref；不记录 raw config / secret。 |
| 失败或效果异常如何回滚？ | 在应用前拒绝新 snapshot；应用后发现本地装配异常时，选择最近一次已验证快照并 restart。若外部 side effect 已发生或状态为 Unknown，不做假回滚，保持 attempt / gap / Unknown 并进入 reconciliation。 |
| 敏感变更有何额外要求？ | ref 轮换需验证 owner / scope / expiry / permission；secret provider rotation 只记录 ref fingerprint 和结果；任何 raw secret 泄露、redaction 放宽或 admin bypass 尝试均 reject 并审计。 |
| 是否影响 03？ | 当前不影响。只定义变更控制和审计语义；若未来需要 persistent config history Port、online reload API 或新 error / flow，先回开 03。 |

## 4. 变更审计链图

#### 变更审计链图：L2-member 配置变更、应用与回滚

```text
[change proposal]
        |
        v
[scope + risk classification]
        |
        v
[owner / security review]
        |
        v
[parse + type + cross-field validate]
        |
        +---- invalid ----> [reject + redacted issue audit]
        |
        v
[approved config snapshot]
        |
        v
[startup restart / new job-run / current entry]
        |
        +---- local assembly failure ----> [stop exposure]
        |                                  |
        |                                  v
        |                         [select prior verified snapshot]
        |                                  |
        |                                  v
        +-------------------------- [restart / new invocation]
        |
        v
[change audit record]
```

关键说明：

- 图表达本地 configuration control，不表达部署平台、工单系统或外部 owner 的业务结果。
- 回滚只能恢复 config snapshot / adapter posture；不能删除 append-only history、撤销已发生 external side effect 或伪造 delivery / acceptance。
- 未知或不确定状态下不自动重试或自动切换新目标；使用 safe marker、gap 或 reconciliation 入口。

## 5. 变更类型表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| low-risk bounded posture（非敏感） | 项目维护者 | 至少一名模块 owner 评审 | 新 snapshot + restart；或新 job-run | key、old/new value fingerprint、reason、validation | 选择上一已验证 snapshot + restart |
| required Store / UoW / replay ref | 配置 / 运维责任方 | Store owner + application / security 评审 | startup restart | slot、owner、compatibility、old/new redacted fingerprint | 恢复上一兼容 ref；无法恢复则 no-write / blocked |
| technical Clock / ID / digest ref | 技术 owner | application + 详细设计边界复核 | startup restart | slot、profile、compatibility、validation | 恢复旧 ref；不重建已提交 ID / digest |
| resolver / handoff ref | 对应 owner / 运维责任方 | owner contract + security review | startup restart；新 handoff job 使用新 ref | owner kind、scope、slot、availability、fingerprint | 恢复旧 ref；外部 Unknown 保持 Unknown |
| sensitive credential / secret ref rotation | 安全 / 凭据 owner | 双人或等价独立复核；不得写具体人名 | restart 或 provider-controlled rebind | ref fingerprint、expiry / permission result、activation、rollback ref | 回到上一有效 ref；raw material 不回写本仓 |
| redaction / metric safety policy | 安全 / observability owner | 强制安全评审 | restart | changed fields、strictness、validation | 只能回到更严格的上一 snapshot |
| profile change | 发布 / 配置 owner | 架构、测试、运维影响评审 | startup restart | profile、matrix impact、blocked slots、review refs | 恢复旧 profile；不把 fixture profile 当 fallback |
| projection activation / rebuild target | read-model / operations owner | Query no-write、watermark、source owner 复核 | 新 job-run；activation posture startup | target ref、watermark basis、job invocation | 禁止 Query repair；回到 stale / disabled posture |
| Job batch / retry / timeout / parallelism class | operations owner | Job / safety owner 评审 | 下一次 job-run | job kind、class old/new、reason、validation | 旧 class 用于新 invocation；运行中 job 不变 |
| logical registry posture | module owner | API / worker / Job owner 评审 | startup restart | registry kind、named entry、review | 恢复 logical posture；不创建 process / listener |
| entry-local one-off limit | authorized caller / entry | typed boundary validation | current entry | request / operation ref、bounded class、result | 当前 entry reject；不修改全局 snapshot |
| forbidden configuration attempt | 任意来源 | 不允许批准 | never | safe issue、source class、attempt fingerprint | 无回滚；保持设计不变量 |

## 6. 风险级别与评审门槛

| 风险级别 | 典型项 | 最低门槛 | 未通过处理 |
|---|---|---|---|
| low | non-sensitive bounded class、logical registry posture | schema / type / cross-field validation + module owner review | reject-new-value |
| medium | projection posture、Job retry / batch class、optional handoff | module owner + affected downstream review + planned test cut | reject / keep old snapshot |
| high | profile、required Store / UoW / replay、resolver / handoff ref、credential ref | owner + security + operations review；明确 rollback ref | fail-fast / no-write / blocked |
| critical | redaction weakening、raw secret attempt、double-anchor / owner / state / Query no-write bypass、24 candidate activation | 永不批准；需回开正式设计 / upstream contract | reject + safe issue + design reopen |

## 7. 审计记录最小字段

| 字段 | 是否必填 | 允许内容 | 禁止内容 |
|---|---:|---|---|
| change reference | 是 | opaque change ref | 工单正文 / 自由文本 body |
| actor reference | 是 | typed actor / operator ref | password、token、个人敏感资料 |
| profile / scope | 是 | 有限 profile、process / job / entry scope | 任意 runtime topology |
| changed key / module | 是 | canonical config key、功能模块 | alias、未知 key、raw path |
| old / new fingerprint | 高风险必填 | one-way redacted fingerprint | 完整 ref、secret、body |
| validation result | 是 | finite accepted / rejected / blocked category | stack trace、provider response body |
| review decision | 高风险必填 | finite approved / rejected / deferred | 未经授权的 signoff 伪造 |
| activation mode | 是 | startup / job-run-start / entry-local / rejected | hot（P0 不支持） |
| rollback reference | 可回滚变更必填 | prior verified snapshot ref | 未验证 snapshot、LKG 假设 |
| safe issue / diagnostic ref | 失败或敏感变更必填 | redacted issue ref | raw config / external body |

## 8. 回滚与不可逆边界

| 场景 | 可做的回滚 | 不可做的动作 |
|---|---|---|
| 新 snapshot parse / validate 失败 | 不应用新值，保留当前运行 snapshot | 回退到更低优先级非法值、silent fallback |
| startup assembly 失败 | 停止暴露受影响 facade；恢复上一已验证 snapshot 并 restart | 暴露 partial Ready、绕过 required slot |
| Job 新配置失败 | 拒绝该 invocation；旧 run 不变 | 修改已开始 job 的策略或重放 mutation |
| entry-local invalid | 拒绝当前 entry | 写全局配置或改变其他 entry |
| credential provider 失败 | 保持旧已验证 ref（若仍有效）或 blocked；按 Step 11 处理 | 把 raw file / env / fake 当 credential fallback |
| external handoff Unknown | 保留 local attempt / gap / Unknown，进入 reconciliation | 伪造撤销、delivery success 或重新发送未知副作用 |
| projection activation 异常 | 回到 stale / disabled posture，停止 Query repair | 删除 source fact、让 Query 触发 rebuild |
| redaction 规则放宽失败 | 保留 strict snapshot | 允许 debug bypass 或输出敏感材料 |
| 24 candidate activation 请求 | 永不应用；记录 blocked issue | 创建 event / publisher / outbox / topic / route / retry / DLQ |

## 9. 变更实施顺序与职责隔离

1. 先确定 canonical key、scope 和风险级别，再生成脱敏 proposal。
2. 由对应 owner 评审配置是否仍在 Step 4 允许边界内；不把变更评审当作需求 / 架构修改的替代。
3. `infra/config.rs` 完成 parse、type、cross-field、sensitive ref 和 redaction 校验；失败不进入 builder。
4. `infra/runtime_builder.rs` 仅装配新 snapshot 对应的 slot / Port / blocked seam，并产生 safe availability。
5. 按 startup / job-run-start / entry-local 规则应用；将 old/new fingerprint、validation、activation 和 rollback ref 写入 config-local audit。
6. 发现外部副作用 Unknown 时只保留 local marker / gap，不把 config rollback 当作外部补偿事实。

## 10. 配置变更停审记录

| 变更域 | 权限 / 评审 | 生效边界 | 审计 / rollback | 03 影响 | 结论 |
|---|---|---|---|---|---|
| composition / profile | owner + architecture / ops review | startup restart | required | 无 | 通过 |
| Store / UoW / replay | owner + security review | startup restart | required | 无 | 通过 |
| technical slots | technical review | startup restart | required | 无 | 通过 |
| resolver / handoff / sensitive refs | owner + security review | startup / new job | required | 无 | 通过 |
| boundary / projection / jobs | module review | entry / new job | required by risk | 无 | 通过 |
| registry | module review | startup | required | 无 | 通过 |
| diagnostics / redaction | security review | startup;strict only | required;strict rollback | 无 | 通过 |
| fixture / replay | test owner only | test-only | test audit | 无 | 通过 |
| forbidden / publication candidate | never approvable | never | rejection audit | 无 | 通过 |

## 11. 跨变更审计 / 回滚审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 高风险变更是否必须评审 | 通过 | profile、required slot、sensitive、redaction、handoff 均需 owner / security review |
| 每个可应用变更是否有审计字段 | 通过 | old/new fingerprint、validation、activation、rollback ref 覆盖 |
| rollback 是否有已验证目标 | 通过 | 不支持无记录 LKG；只能选 prior verified snapshot |
| rollback 是否误删业务 history | 通过 | 不操作 local truth、append-only history、result / receipt / report |
| Unknown external side effect 是否被伪回滚 | 通过 | 保留 Unknown / gap，交给 reconciliation |
| secret 是否进入审计 | 通过 | 只记录 ref fingerprint / safe issue，不记录 material |
| P0 hot / admin override 是否被引入 | 通过 | 当前不支持，检测即拒绝 |
| 24 candidate 是否被回滚流程误激活 | 通过 | publication candidate 永不进入可应用变更 |
| 是否新增 03 carrier / Port / error / flow | 未发现 | 当前为控制流程和审计字段语义，无回写 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| startup / new job / entry-local 的变更生效边界 | 否 | 配置生命周期语义 | `03 §13` 既有绑定 | 无回写 |
| audit 只记录脱敏 fingerprint / issue ref | 否 | safe diagnostics 细化 | `03 §14` 已有 | 无回写 |
| rollback 不撤销业务 history 或 external Unknown | 否 | truth / side-effect 边界复核 | `03 §10～§14` 已有 | 无回写 |
| forbidden change 需要正式设计 / owner reopen | 否 | 变更治理流程 | 不适用 | 无回写 |
| 未来引入 online reload、persistent audit Port、new rollback API / error | 是 | 代码契约变化 | `03 §4～§14` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前没有实际“待回写”或“阻塞待确认”项；未来触发器不表示已支持 online rollback。

## 13. 回填草稿：正式 `04-配置设计.md` §10

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“变更审计链图”“变更类型表”“风险级别与评审门槛”“审计记录最小字段”和“回滚与不可逆边界”。

正式 §10 应收口为：

1. 配置变更按风险分级；profile、required Store / UoW / replay、sensitive ref、resolver / handoff、redaction 和 projection / Job 高风险变更必须由对应 owner、安全和运维职责方评审。
2. P0 startup 变更使用已校验的新 snapshot + restart；job-run-start 变更只影响下一次 Job；entry-local 变更只影响当前 entry；不支持隐式 hot / online LKG。
3. 审计记录只保存 change / actor ref、profile、scope、canonical key、old/new redacted fingerprint、validation、review、activation 和 rollback ref；禁止 raw config、secret、endpoint、route、body 和 stack trace。
4. 失败时拒绝新 snapshot 或停止受影响 facade，并可恢复到上一已验证 snapshot；不删除 local history、不改变 truth、不撤销 external Unknown / side effect。
5. `L2M-UP-005` 下的 24 candidate 永不进入可应用变更；任何 publication 配置尝试均 reject 并记录安全 issue。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 具体变更审批角色 / 运维平台 | 执行流程落地 | 只定义职责类别；具体平台留 07 / 09 |
| secret provider rotation API | ref 轮换和权限检查 | provider-neutral；关键 slot fail-fast |
| persistent config audit storage | 审计记录物理承载 | 只定义逻辑字段；产品留 07 / 09 |
| owner exact contracts（`L2M-UP-001~008`） | 高风险 slot review / rollback compatibility | blocked / waiting；不写正向成功 |
| future hot / online LKG | snapshot / API / rollback contract | P0 reject；若提出则回开 03 与 Step 4/9/11 |

## 15. 进入 Step 11 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 变更类型和权限边界明确 | 通过 | §5、§6 |
| 高风险变更有评审、审计和 rollback ref | 通过 | §5、§7 |
| startup / job-run-start / entry-local 生效可判定 | 通过 | §8、§9 |
| rollback 不伪造 external / business reversal | 通过 | §8、§11 |
| sensitive 变更不泄露 secret | 通过 | §7、§8 |
| forbidden / publication candidate 变更不可应用 | 通过 | §8、§11 |
| 跨变更审计完成 | 通过 | §10、§11 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 10 完成。下一步允许创建 `04_config_step_11_failure_degradation.md`，定义缺失、错误、不可达、过期、漂移及各类 fail-fast / fail-closed / degraded 行为。

```text
step_10 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_11_failure_degradation
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
