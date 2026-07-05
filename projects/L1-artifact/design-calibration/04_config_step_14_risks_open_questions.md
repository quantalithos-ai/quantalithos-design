# Step 14. 定义风险与待确认事项

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
> 回填章节: `04-配置设计.md` §14 风险与待确认事项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义风险与待确认事项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~13 中间产物;`03` Step 14 配置绑定;配置设计 SOP Step 14 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_14_risks_open_questions.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

本 Step 汇总 `L1-artifact` 配置设计在 Step 1~13 中尚未闭合、但又不应误写成 P0 已支持契约的风险、待确认事项和 `03-详细设计.md` 回写触发器。

本 Step 只回答:

- 哪些配置问题仍可能影响后续测试、验收、实施或运维落地。
- 哪些事项必须等待产品选型、ADR、运维方案或 future 设计变更确认。
- 未确认前这些事项如何处理,避免被误写成正式 `04` 契约。
- Step 1~13 所有“是否影响 `03` = 是”的配置结论,当前是否真的触发回写。
- 当前是否允许进入 Step 15 装配正式 `04-配置设计.md`。

本 Step 不定义:

- 具体产品型 DB / bus / archive / observability / secret provider / config center / endpoint 参数。
- 具体 env key、部署命令、告警阈值、Pager 策略、rotation 周期或 release 日历。
- future P1/P2 能力的正式 runtime config schema、adapter constructor、port、DTO、error 或 flow。
- 正式 `04-配置设计.md` 正文;正式装配仍在 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供产品未锁定、旧 `05/06` 历史材料定位和 `03` 回写红线 |
| `04_config_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围分层和产品化残余风险 |
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置控制面和 `ArtifactRuntimeConfig` 影响边界 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供禁止配置化边界和 hot reload / dynamic replacement 风险 |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 config center / admin override / source priority future 风险 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 正式 profile 和 `staging-like` / `production-like` future 风险 |
| `04_config_step_07_config_items.md` | 已完成 | 提供 config section、product-neutral refs 和 future product schema 触发器 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 opaque ref、raw secret 禁止和 future secret provider 风险 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、builder activation、reload/LKG future 风险 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供 high-risk change、rollback、digest 和 admin override / hot reload 风险 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 fail-fast/fail-closed/degraded 边界和 future provider failure contract 风险 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 `05/06/07/09` 承接风险和下游不得重定义的边界 |
| `04_config_step_13_migration_deprecation_evolution.md` | 已完成 | 提供当前无迁移项、future evolution queue 和 design-change-required 条目 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 runtime builder、adapter registry、fake/disabled seam 和跨仓绑定边界 |
| `projects/L1-governance/design-calibration/04_config_step_14_risks_open_questions.md` | 已参考 | 提供 Step 14 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置问题仍可能影响落地? | P1/P2 的 durable store、real bus、archive/observability/sync targets、external content source real binding、真实 secret provider、remote config center、admin override、runtime hot reload、online LKG、`staging-like` / `production-like` hardening、旧 `05/06` 重写和未来 `07/09` 承接都会影响落地,但都不属于当前 P0 必须支持的配置契约。 |
| 哪些事项会阻塞测试、验收、实施或运维? | 当前 P0 `04` 定稿不被阻塞。真正阻塞的是 future/conditional 能力: 一旦实施要求引入真实 provider、config center、reload、产品级 endpoint/credential schema、adapter constructor 新参数、builder lifecycle 变化或 public protocol 变化,必须先回写 `03` 和相关 Step 后再实施。 |
| 每个待确认事项需要谁确认? | 产品/架构确认 P1/P2 能力是否进入路线;安全/运维确认 secret provider、rotation、redaction 和 break-glass 方案;实施负责人确认 runtime builder、adapter registry 和 config evidence 落地方式;测试/验收负责人确认 profile / redaction / rollback / replay gates。 |
| 未确认前应如何处理? | 一律不写成 P0 正式契约。P0 继续保持 strict JSON、`defaults < file < env`、product-neutral refs、fake/disabled/controlled/replay-backed adapter、restart/new job run 生效、no config center、no admin override、no hot reload、no online LKG、no raw secret。 |
| 哪些配置结论改变了 `03-详细设计.md` 的代码契约? | 当前 P0 没有新增改变。Step 1~13 中所有“是”的项都属于 future/conditional 触发器,只有将来把这些能力纳入实施时,才会改变 runtime config、builder、adapter constructor、port、error、flow、DTO 或 observability 契约。 |
| 这些影响是否已经回写到 `03-详细设计.md`,还是需要标为阻塞待确认? | 当前 P0 不触发,因此没有当前待回写项。future/conditional 项在本 Step 统一转为“设计变更触发器”;未来一旦进入范围,必须先回写 `03`,再重跑对应配置 Step。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1~13 `是否影响 03` 表 | 多处以“阻塞待确认”标记 future 能力 | 统一收口为“当前 P0 未触发;future 触发前必须先回写 `03`” |
| 正式 `04` | 尚未装配 | Step 15 才装配;本 Step 只确认是否允许进入装配 |
| `03` Step 14 | 已给 binding point,但未决定是否引入真实 provider / config center | 本 Step 明确这些只是 future 触发器,当前不进入 P0 |
| 旧 `05/06` | 仍是历史材料,未按新版 `03/04` 重写 | 记为下游承接风险,不阻塞当前 `04` 定稿 |
| `07/09` 缺失 | 配置实施和运维文档仍未建立 | 记为后续文档链风险,不得反向污染当前配置契约 |
| 产品化能力 | durable store、bus、archive、observability、sync、secret provider、config center 未锁定 | 记为 future ADR / design-change-required,不在 P0 展开 |
| 配置证据落地 | digest canonicalization、redaction scan、rollback drill、profile matrix 仍需下游承接 | Step 12 已给 handoff 表,本 Step 记录负责方和未确认前处理 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险位置 | 分散在 Step 1~13 | 汇总为统一风险表和待确认事项表 | 便于 Step 15 判断是否可定稿 |
| `03` 回写状态 | 多处写成 `阻塞待确认` | 当前 P0 收口为“无待回写”;future 项转为触发器 | 避免 future 能力误阻塞 P0 定稿 |
| 下游缺口 | 分散在 Step 12 / Step 13 | 统一记录 `05/06/07/09` 承接风险 | 防止 `04` 被误当成下游已完成 |
| 产品选型 | 风险散落在各 Step | 明确不阻塞 P0,但阻塞 P1/P2 实接 | 保持产品中立 |
| 未确认项处理 | 可能被误写成配置项 | 明确未确认前不得进入正式契约 | 满足 SOP 约束 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| future `03` 影响项是否阻塞 Step 15 | A. 全部阻塞;B. 仅当前 P0 触发时阻塞 | 采用 B。当前 P0 不实现相关能力,正式 `04` 可写明 unsupported/future |
| 产品未锁定是否阻塞 P0 | A. 阻塞;B. P0 使用 product-neutral/fake/disabled/controlled refs | 采用 B。产品选型留给 ADR / P1/P2 |
| 旧 `05/06` 是否覆盖 `04` | A. 继续作为当前配置输入;B. 只作为待重写历史材料 | 采用 B。新版 `03/04` 才是后续真相源 |
| hot reload / config center 是否预留隐式成功路径 | A. 预留 disabled key;B. P0 出现即 reject | 采用 B。当前 `03` 没有对应 builder / flow contract |
| secret provider 是否在 P0 定义产品 API | A. 先定义 provider-facing API;B. 只保留 opaque refs/no raw secret | 采用 B。真实 provider 属 future design-change-required |

## 8. 结构化中间产物

### 8.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| Durable store、real bus、archive/observability/sync target、external content source 产品未锁定 | 影响 P1/P2 config schema、secret ref、failure strategy、acceptance evidence | P0 只使用 product-neutral refs、fake/disabled/controlled adapter 和 strict validation;真实产品进入 ADR 和 future `03/04` 变更 | 架构负责人;实施负责人;运维负责人 |
| 真实 secret provider / KMS / Vault 未定义 | 影响 credential resolution、rotation、health、adapter constructor 和 no-output tests | P0 仅保存 opaque refs,不解析 raw secret;真实 provider 必须先回写 `03` builder / adapter contract | 安全负责人;运维负责人;实施负责人 |
| Remote config center / admin override 未定义 | 影响 source priority、audit、rollback、actor capability 和 builder lifecycle | P0 不接受 config center/admin override 来源或 key;未来先补 `03/04/10/11/13` | 架构负责人;安全负责人 |
| Runtime hot reload / online LKG 未定义 | 影响 runtime lifecycle、adapter replacement、rollback、partial failure 和 audit | P0 只支持 restart/new job run 生效;reload/LKG 出现即 design-change-required | 架构负责人;运行时负责人;运维负责人 |
| `staging-like` / `production-like` 仍是 future direction | 影响 profile isolation、fake rejection、真实 endpoint/secret/route hardening | P0 只定义 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;future profile 不写成当前可用配置 | 架构负责人;运维负责人;测试负责人 |
| 旧 `05-测试方案.md` / `06-验收标准.md` 未按新版 `03/04` 重写 | 影响后续 evidence 和 release gate 的可靠性 | Step 12 已给承接表;正式 `04` 完成后再重写 `05/06` | 测试负责人;验收负责人 |
| `07-实施计划.md` / `09-部署与运维手册.md` 尚未承接新版配置 | 影响 commit boundary、startup args、env key、artifact deployment 和 runbook | 正式 `04` 后再创建 / 重写 `07/09`;不得由实施侧临时发明 config key | 项目负责人;实施负责人;运维负责人 |
| Config digest canonicalization、redaction scan、rollback drill 仍需实现细化 | 影响 drift detection、audit compare、release evidence | `04` 只定义语义;具体算法和脚本进入实施/测试,且不得包含 raw secret/raw body | 实施负责人;测试负责人 |
| Retry/backoff/alert threshold 等 ops 数值未产品化 | 影响运行调优和告警灵敏度 | P0 使用 safe defaults/range validation;产品级阈值进入 P1/P2 配置变更 | 运维负责人;测试负责人 |
| Future migration/deprecation automation 未定义 | 影响已发布配置演进效率 | Step 13 仅定义状态与 evidence;自动化工具未来再设计 | 实施负责人;release 负责人 |

### 8.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| P1/P2 durable store、bus、archive、observability、sync、external content source 产品是否锁定 | 不影响 P0 `04`;影响 future product schema | 架构负责人;产品负责人;运维负责人 | P0 保持 product-neutral/fake/disabled/controlled |
| `staging-like` / `production-like` 是否进入近期路线 | 不影响 P0;影响 future profile hardening 和 fake rejection evidence | 产品负责人;架构负责人;运维负责人 | 只作为 future direction,不写入正式 P0 profile |
| 真实 secret provider 是否进入 runtime builder | 不影响 P0;影响 adapter constructor、health、rotation、no-output | 安全负责人;运维负责人;实施负责人 | P0 只允许 opaque refs;raw secret reject |
| Remote config center / admin override 是否进入 future 版本 | 不影响 P0;影响 source priority、actor audit、rollback | 架构负责人;安全负责人 | P0 不接受对应来源或 key |
| Runtime hot reload / online LKG 是否需要 | 不影响 P0;影响 lifecycle、rollback、adapter replacement | 架构负责人;运行时负责人;运维负责人 | P0 restart/new job run 生效;reload/LKG key reject |
| 旧 `05/06` 何时 full-restart | 不影响 Step 15;影响测试验收闭环 | 测试负责人;验收负责人 | `04` 定稿后按 Step 12 输入重写 |
| `07/09` 何时承接配置 | 不影响 Step 15;影响实施与运维落地 | 项目负责人;实施负责人;运维负责人 | 不允许实施侧或运维侧临时发明 config key/env key |
| Deprecated warning 是否进入 public protocol surface | 当前 P0 不需要;未来若进入会影响 DTO/error | 架构负责人;实施负责人 | 当前只要求 redacted issue/log;public surface 变化先回 `03` |
| Config digest canonicalization 具体算法 | 当前 `04` 只定义语义;影响测试和实现细节 | 实施负责人;测试负责人 | 实施时固定 redacted canonical algorithm 并补测试 |
| 迁移自动化工具是否需要 | 当前首版无迁移;未来影响 release tooling | release 负责人;实施负责人 | 当前不定义工具,只定义迁移规则和 evidence |

### 8.3 详细设计回写清单

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前 P0 配置设计不新增 runtime config、adapter constructor、port、error、flow 或 DTO | 否 | 当前 P0 契约保持 | 不适用 | 无回写 |
| P0 采用 `infra::config` -> `runtime_builder` -> injected ports/typed params;application/domain/contracts 不读取 raw config | 否 | 承接既有详细设计配置绑定 | 不适用 | 无回写 |
| P0 无 remote config center、admin override、runtime hot reload、online LKG、真实 secret provider API | 否 | unsupported boundary | 不适用 | 无回写 |
| P0 使用 product-neutral refs、fake/disabled/controlled/replay-backed adapter 和 strict validation | 否 | 配置语义和 profile isolation | 不适用 | 无回写 |
| Future 如果新增 runtime config 字段、adapter constructor 参数、port、error、flow、DTO、builder lifecycle、reload、config center、secret provider health 或产品级 schema | 是 | future 代码契约变更 | `03` §4~§15 或对应 calibration Step | 无回写 |

> 说明: 最后一行是 future/conditional 触发器,当前 P0 未触发,因此处理状态为“无回写”。未来一旦进入实施范围,必须先把状态改为“待回写/阻塞待确认”,回写 `03`,再重新执行相关配置 Step。

### 8.4 Step 1~13 影响 `03` 汇总表

| 来源 Step | 原配置结论 | 当前收口 | 当前处理状态 |
|---|---|---|---|
| Step 1 | 若后续新增 runtime config 字段、adapter constructor 参数、port、error 或 flow | 当前 P0 不新增;future 触发前回写 `03` | 无回写 |
| Step 2 | 后续具体配置项若要求新增 runtime config 字段、adapter constructor 参数、trait、error 或 flow | 当前配置项不要求新增;future 触发前回写 `03` | 无回写 |
| Step 3 | 后续若配置项要求新增 `ArtifactRuntimeConfig` 字段、adapter constructor 参数、port、error、flow 或 DTO | 当前 P0 只承接既有绑定;future 触发前回写 `03` | 无回写 |
| Step 4 | 若未来需要 hot reload、动态 adapter replacement 或配置改变 core flow | 当前 P0 不支持;future 触发前回写 `03` | 无回写 |
| Step 5 | 若后续需要 remote config、admin override 或 hot reload | 当前 P0 不引入;future 触发前回写 `03` | 无回写 |
| Step 6 | 若后续要求 `production-like` 动态 adapter replacement、真实 secret provider 或产品级 endpoint schema | 当前 future profile 未进入范围;future 触发前回写 `03` | 无回写 |
| Step 7 | 若后续需要 remote config、真实 secret-provider fields、dynamic adapter replacement 或 product-specific endpoint schema | 当前 P0 不实现这些能力;future 触发前回写 `03` | 无回写 |
| Step 8 | 若后续引入 secret provider、hot reload、admin override 或 provider-backed audit schema | 当前 P0 只保存 opaque refs;future 触发前回写 `03` | 无回写 |
| Step 9 | 若后续引入 runtime reload、last-known-good config、secret provider resolution 或 product-specific adapter constructor | 当前 P0 restart/new job run 生效;future 触发前回写 `03` | 无回写 |
| Step 10 | 若后续引入 remote config center、admin override、runtime hot reload、last-known-good live switch 或 secret provider rotation API | 当前 P0 不支持;future 触发前回写 `03` | 无回写 |
| Step 11 | 若后续引入 config center、secret provider、live reload 或 provider-backed failure contract | 当前 P0 不支持;future 触发前回写 `03` | 无回写 |
| Step 12 | 若下游要求新增 hot reload、config center、provider runtime health contract 或改 runtime builder | 当前下游不得新增;future 触发前回写 `03` | 无回写 |
| Step 13 | future config center、admin override、hot reload、online LKG、secret provider health contract | 当前只作为 evolution queue;future 触发前回写 `03` | 无回写 |

### 8.5 未关闭事项处理规则

| 类型 | 是否可写入正式 P0 `04` | 未关闭前处理 |
|---|---|---|
| 当前 P0 已决策边界 | 可以 | 写成正式配置契约 |
| Future/P1/P2 direction | 可以写成未来演进说明 | 不得写成 P0 可用配置项 |
| 产品选型未定 | 不写具体产品字段 | 使用 product-neutral ref / fake / disabled / controlled |
| 会改变 `03` 代码契约的能力 | 不写成已支持 | 标记 design-change-required,未来先回写 `03` |
| 下游测试/验收/实施/运维未重写 | 可写承接要求 | 不把当前 `04` 视作下游 evidence 已完成 |
| 安全红线未确认 | 不写宽松 fallback | fail-fast/fail-closed/reject |

### 8.6 风险停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 所有 Step 1~13 未关闭事项是否汇总 | 通过 | 见 §8.1 / §8.2 |
| 所有“是否影响 `03` = 是”是否覆盖 | 通过 | 见 §8.3 / §8.4 |
| 是否仍存在当前 P0 `待回写` | 无 | future/conditional 未触发 |
| 是否仍存在当前 P0 `阻塞待确认` | 无 | 阻塞范围已收窄到 future 能力 |
| 是否把待确认事项写成正式配置契约 | 未写入 | Step 15 仅可写为风险/未来演进/unsupported |
| 是否清楚说明 blocked scope | 通过 | future 实接、reload、config center、secret provider、public protocol 变化才会阻塞 |
| 是否可进入 Step 15 | 通过 | 当前无待回写或阻塞待确认项 |

### 8.7 跨风险 / 回写审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 产品未锁定是否影响 P0 配置定稿 | 不影响 | P0 采用 product-neutral/fake/disabled/controlled |
| Future provider/config center/hot reload 是否进入 P0 schema | 不进入 | 只保留 unsupported/future 说明 |
| Raw secret/raw body 是否可能进入正式配置 | 不允许 | Step 8 / Step 11 fail-closed |
| Test fixture 是否可能进入 future `production-like` | 不允许 | future hardening 必须 reject fake/test fixture |
| Entry-local/job-run-start 是否覆盖 startup invariant | 不允许 | 只影响当前 entry 或当前 job |
| 旧 `05/06` 是否覆盖新版 `03/04` | 不允许 | 后续按新版设计重写 |
| Future `03` 回写是否被遗漏 | 未遗漏 | §8.4 已逐 Step 覆盖 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 14 将 Step 1~13 的 future/conditional `03` 影响项收口为未来设计变更触发器 | 否 | 风险治理和门禁收口 | 不适用 | 无回写 |
| 当前 P0 正式 `04` 可写入已决策配置边界、风险、unsupported 能力和 future evolution queue | 否 | 配置文档装配 | 不适用 | 无回写 |
| 当前 P0 不新增 runtime config、builder lifecycle、adapter constructor、port、DTO、error 或 flow | 否 | 保持既有详细设计契约 | 不适用 | 无回写 |
| 未来如果把 provider/config center/hot reload/production schema/admin override/online LKG 变成可实现能力 | 是 | runtime config / builder / adapter / source priority / audit / rollback / error / flow contract | `03` §4~§15 或对应 calibration Step | 无回写 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_14_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险表”“待确认事项表”“详细设计回写清单”“Step 1~13 影响 `03` 汇总表”“未关闭事项处理规则”“风险停审记录”和“跨风险 / 回写审计表”小节。

正式 `04-配置设计.md` §14 应回填:

- 风险表。
- 待确认事项表。
- 详细设计回写清单。
- Step 1~13 影响 `03` 汇总表。
- 未关闭事项处理规则。
- 风险停审记录。
- 跨风险 / 回写审计表。

回填要求:

- 必须明确当前 P0 无待回写或阻塞待确认项。
- 必须明确 future/conditional 能力不得写成 P0 已支持配置契约。
- 必须保留 future 能力触发 `03/04` 回写的规则。
- 必须说明正式 `04` 并不等于 `05/06/07/09` 已重写完成。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 15 是否按 Step 1~14 装配正式 `04-配置设计.md` | 影响正式配置设计产出 | 等用户审查本 Step 后进入 Step 15 |
| Future P1/P2 产品化是否进入路线 | 影响后续 ADR / `03/04/07/09` | 当前只作为风险和演进项 |
| 旧 `05/06` 重写排期 | 影响测试验收闭环 | 当前只承接输入,不阻塞 `04` 定稿 |
| `07/09` 新版文档排期 | 影响实施和运维落地 | 当前只承接输入,不阻塞 `04` 定稿 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有未关闭事项都有记录和处理方式 | 通过 | 见 §8.1 / §8.2 / §11 |
| 所有 Step 1~13 “是否影响 `03` = 是”均已覆盖 | 通过 | 见 §8.4 |
| 当前 P0 不存在 `待回写` | 通过 | future/conditional 未触发 |
| 当前 P0 不存在 `阻塞待确认` | 通过 | 阻塞范围已收窄到 future 能力 |
| 待确认项未写成正式配置契约 | 通过 | Step 15 只能写为风险/演进/unsupported |
| 可进入 Step 15 | 通过 | 用户审查通过后装配正式 `04-配置设计.md` |
