# L2-member-images 04 配置设计 Step 5：定义配置来源、优先级与冲突处理

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5  
> 回填位置：正式 `04-配置设计.md` 第 5 章“配置来源、优先级与冲突处理”  
> 前提：Step 4 已限定 P0 cold-only 和禁止项；本 Step 只定义来源语义，不写实际 key/value/secret/product。

## 1. Step 状态、目标与输入

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 5：定义配置来源、优先级与冲突处理 |
| 当前状态 | `completed` |
| 本步目标 | 为 P0 每个配置域给出唯一来源链、覆盖规则、冲突与不可用处置。 |
| 直接输入 | Step 1~4、03 §13 的 no-implicit-default / raw-read / fake boundary、配置书写规范。 |
| 不做事项 | 不写 provider、endpoint、raw secret、remote config、admin override、hot reload、实装命令。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| defaults、file、env、secret、config center、admin override 的优先级是什么？ | P0 唯一常规链为：**schema-declared safe absence (不产生成功默认)** `<` project JSON `<` environment selector。opaque secret/reference selector 仅可填入已允许的 opaque-reference field，遵守同一普通来源选择次序，但 raw secret 永不进入该链。config center/admin override 不支持。 |
| 同名配置多处出现如何处理？ | 较高优先级值只有在合法、完整、与所有交叉不变量一致时才覆盖低优先级值；高优先级非法、空、unknown 或越界时整体 reject/fail-fast，绝不静默回退到低优先级成功值。 |
| 必填项缺失是否阻断启动？ | P0 required composition identity 或 required slot input 缺失时不装配，`ImageRuntimeConfigRef` / assembly 为 `Blocked`；它不启动任何 runtime/process。optional future seam 缺失形成 conservative blocked/gap，不能升级为 usable。 |
| 密钥系统不可用如何处理？ | P0 无 raw-secret resolution；opaque ref 缺失/格式非法/不可安全暴露时 blocked。不得缓存 raw secret、last-known-good、普通 file fallback 或 fake production fallback。 |
| 哪些来源不能覆盖敏感配置？ | ordinary JSON/env 不能承载 raw secret；它们只能选择 opaque secret/reference identity。任何 secret provider 的原始材料、endpoint 或 credential body 均不允许进入 P0。 |
| 按域如何覆盖与处理不可用？ | 每个域都有唯一的 allow/deny 来源和 no-implicit-success 策略，见 §4；无法判定时 `Blocked` / `Unknown` 而非默认 `Available`。 |

## 3. P0 配置来源链

#### 配置来源链图：L2-member-images P0 覆盖链

```text
[schema-declared safe absence]
          |
          v
[project JSON configuration]
          |
          v
[environment selectors]
          |
          +--> [opaque secret/reference selector only]
          |
          v
[infra/config.rs]
  parse -> validate -> reject conflict -> redact
          |
          v
[body-free config ref / mode / slot intent]
          |
          v
[infra/runtime_builder.rs]
```

关键说明：

- “safe absence”不是 `Bound`、`Available`、fake、real adapter、endpoint 或 product 的默认值；其唯一作用是让解析器识别“未提供”。
- environment 只能覆盖允许的 selector，不能绕开 JSON 以投放 raw secret、external body、immutable pin、owner/state/gate 或 dependency 分类。
- config center、admin override、CLI public flags、cache / LKG 和 deployment-generated default 均不在 P0 覆盖链中。

## 4. 配置来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---:|---|---|---|
| schema-declared safe absence | 0 | 未提供的 optional selector 或显式缺失语境 | 不覆盖任何 supplied value；不能产生 positive default | required field -> fail-fast/blocked；optional external seam -> blocked/unknown/gap。 |
| project JSON configuration | 1 | P0 cold composition、mode、local binding、reference/adapter selector、diagnostic redaction | 结构/类型/交叉校验不通过即 reject | 文件缺失或无效时不装配 P0 composition。 |
| environment selector | 2 | 明确列入 allowlist 的 profile / opaque reference selector；不得承载 body | 合法且交叉校验通过才覆盖 JSON；非法则 reject whole effective config | 缺失回落到合法 JSON；存在但非法不回落。 |
| opaque secret/reference selector | 与携带它的 JSON/env field 一致 | 仅 opaque identity / locator；无 raw material | raw value、非允许 kind、unknown authority 或跨域冲突均 reject | blocked / unknown；无 cache/LKG/fake fallback。 |
| test fixture / deterministic override | isolated test-only | explicit TestOnly harness 内的 fake / fixed ref | 只能在 TestOnly profile 生效，不能覆盖 Production | fixture 缺失使 test composition blocked/fail-fast，不影响 Production semantics。 |
| remote config center / admin override / CLI public flag | 不适用 | P2 / unsupported | 一律 reject as unknown source | 不创建 fallback、无 online source。 |

## 5. 冲突处理表

| 冲突场景 | 处理规则 | 是否阻断启动 / 操作 |
|---|---|---|
| JSON 与 env 对同一普通 selector 给出不同合法值 | env 覆盖 JSON，随后重新执行完整 cross-field validation。 | 不阻断；仅在最终配置有效时进入 assembly。 |
| env 值非法、空、unknown 或非 allowlist | 拒绝有效配置；不得回退 JSON。 | 阻断 P0 assembly。 |
| JSON 缺 required composition/mode/slot binding | 形成 blocked config/assembly；不得从 file name/default/fake 猜补。 | 阻断 P0 assembly。 |
| ordinary source 提供 raw secret / endpoint/provider body | 拒绝；不将其转换为 opaque ref。 | 阻断受影响 assembly，并记录 redacted reason。 |
| secret/reference selector 与 declared owner/kind 不匹配 | 拒绝；不调用 provider 或 copy body。 | 阻断受影响 slot。 |
| Production 选择 TestOnly 或出现 `FakeOnly` slot | 拒绝最终组合。 | 阻断 assembly。 |
| required slot missing/blocked/unknown | assembly 保持/转为 `Blocked`。 | 阻断 assembly；不能开放 write path。 |
| P1 external seam 未闭口 | 允许 conservative blocked adapter / typed gap，但不形成 positive configuration。 | 不阻断本地 P0 negative/read configuration；阻断受影响 positive lane。 |
| 配置试图出现 event/outbound/product/recovery key | 拒绝为不受支持的配置类别。 | 阻断受影响 config load；不创建 disabled placeholder。 |

## 6. 按配置域组织的来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 | 不可用策略 |
|---|---|---|---|---|
| `composition_identity` | JSON、allowlisted env selector、safe absence | raw secret/body、config center/admin override/CLI | absence < JSON < env | required identity 缺失/非法 -> config `Blocked`。 |
| `composition_mode` | JSON、allowlisted env selector、explicit TestOnly fixture | implicit environment inference、remote override | JSON < env；fixture仅 TestOnly | mode 缺失/冲突 -> assembly `Blocked`。 |
| `local_persistence` | JSON、allowlisted env selector、TestOnly fixture | DB product/body、online source | JSON < env；fixture仅 TestOnly | required local slot invalid/unavailable -> `Blocked`；不写 UoW。 |
| `static_references` | JSON opaque ref selector、allowlisted env selector、TestOnly fixture | Role/component/seed body、live state、raw secret | JSON < env；fixture仅 TestOnly | missing/unknown -> blocked/unavailable/gap；不猜 pin。 |
| `external_boundaries` | JSON opaque ref selector、allowlisted env selector、TestOnly deterministic fake | provider body/endpoint/raw credential、online override | JSON < env；fake仅 TestOnly | unresolved -> conservative blocked/unknown/gap；无 positive result。 |
| `diagnostic_redaction` | schema fixed floor、JSON restrictive selector | env 降低 floor、debug raw output、online override | fixed floor不可覆盖；JSON仅可更严格 | invalid/weaker value -> reject；safe diagnostic only。 |

## 7. 来源优先级停审记录

| 配置域 / 来源 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `composition_identity` | 唯一覆盖链、illegal high priority no fallback | 通过 | key/item 留 Step 7。 |
| `composition_mode` | TestOnly fixture 不泄漏 Production | 通过 | 环境矩阵留 Step 6。 |
| `local_persistence` | source 不变为 DB/product/UoW policy | 通过 | physical binding仍 product-neutral。 |
| `static_references` | only opaque ref、无 owner body | 通过 | exact owner schemas pending。 |
| `external_boundaries` | ordinary source 不承载 secret/endpoint，P1不成功 | 通过 | product/contract blockers保持。 |
| `diagnostic_redaction` | floor 不可被 lower-priority/high-priority source降低 | 通过 | backend不在本域。 |

## 8. 跨来源冲突审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 优先级是否唯一 | 通过 | P0 固定 `absence < JSON < env`；fixture仅 TestOnly。 |
| 非法高优先级是否会降级到低优先级 | 不会 | fail-fast/blocked。 |
| raw secret 是否可被普通文件/env覆盖 | 不允许 | 仅 opaque selector，raw material拒绝。 |
| 环境来源是否可伪造 owner/product/positive result | 不允许 | value仍需 owner/kind/cross-field validation。 |
| P1/P2 source 是否混入 P0 | 未发现 | online sources明确 unsupported。 |
| 所有域不可用语义是否一致 | 通过 | required -> blocked；optional unresolved -> conservative gap/unknown。 |

## 9. 当前材料诊断与设计取舍

| 议题 | 不采用 | 采用 | 原因 |
|---|---|---|---|
| 高优先级非法时回退 | silently use JSON/default | reject whole effective config | 避免环境拼写错误造成未知 composition。 |
| 允许 env 装 raw secret | plaintext operational convenience | opaque selector only | static/live/secret boundary。 |
| config center/admin override | online dynamic source | P2 unsupported | 无 authority、reload、audit/rollback契约。 |
| source default | `Available`/TestOnly/product default | safe absence only | 无 implicit positive success。 |
| P1 unresolved adapter | default fake/disabled success | blocked/unknown/gap adapter | fake不能关闭 owner contract。 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 `absence < JSON < env`、illegal high priority reject、opaque ref only | 否 | 来源/优先级/失效语义细化 | 不适用 | 无回写 |
| raw config仅由 infra 读取，other module无source selector | 否 | 已有读取边界承接 | 不适用 | 无回写 |
| 无 config center/admin override/reload/LKG | 否 | unsupported P2 boundary | 不适用 | 无回写 |
| future 若加入 source provider、online override、reload、secret resolution health 或 public flag | 是（future trigger） | config loader/builder/port/error/flow change | 触发时回写 03 §5/§13 及对应 Step | 无回写（当前未触发） |

## 11. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_05_sources_priority_conflicts.md`
>
> 延伸阅读：
> - 建议继续阅读“P0 配置来源链”“配置来源优先级表”“冲突处理表”“按配置域组织的来源覆盖表”和“跨来源冲突审计表”。

正式 `04-配置设计.md` §5 应规定 P0 唯一来源链为 `safe absence < project JSON < allowlisted environment selector`，仅允许 opaque secret/reference selector，非法高优先级值必须拒绝而非回退。remote config、admin override、raw secret、online LKG 与 public flag 均不受支持。P1 unresolved seam 保持 blocked/unknown/gap，不由来源优先级变为 positive result。

## 12. 待确认事项与进入下一步条件

| 事项 | 当前处理 |
|---|---|
| 具体 JSON module/key/field | 留 Step 7。 |
| 各环境 profile 的允许 env selector | 留 Step 6。 |
| raw secret 的真实 provider、rotation、access control | 留 Step 8；当前 P0 only opaque ref。 |
| online sources / admin override / reload | P2 trigger；不进入当前 config。 |

| 自检项 | 结论 |
|---|---|
| 每个域有 allow/deny source、优先级和不可用策略 | 通过。 |
| secret 覆盖与 raw material 泄漏风险已隔离 | 通过。 |
| illegal high priority 无 silent fallback | 通过。 |
| P1/P2 未被写作 P0 source | 通过。 |
| 03 影响无待回写/阻塞待确认 | 通过。 |
| 可进入 Step 6 | 通过；来源、优先级、冲突和不可用策略已按域停审。 |

```text
step_05 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_06_profiles_matrix
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
