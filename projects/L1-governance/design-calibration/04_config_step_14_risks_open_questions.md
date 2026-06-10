# Step 14. 定义风险与待确认事项

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
> 回填章节: `04-配置设计.md` §14 风险与待确认事项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义风险与待确认事项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~13 中间产物;配置设计 SOP Step 14 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_14_risks_open_questions.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

本 Step 汇总 `L1-governance` 配置设计阶段尚未关闭的风险、待确认事项和 `03-详细设计.md` 回写判定。

本 Step 只回答:

- 哪些配置问题仍可能影响测试、验收、实施或运维。
- 哪些事项需要未来 ADR、产品选型、运维方案或详细设计变更确认。
- 未确认前如何处理,避免把未确认内容写成正式配置契约。
- Step 1~13 中所有“是否影响 03 = 是”的配置结论,当前是否触发回写。
- 是否允许进入 Step 15 装配正式 `04-配置设计.md`。

本 Step 不定义:

- 具体产品选型、供应商、endpoint、DSN、topic、secret provider、配置中心或部署命令。
- future P1/P2 能力的正式 runtime config、adapter constructor、port、DTO、error 或 flow。
- 正式 `04-配置设计.md`;正式文档仍必须等 Step 15 装配。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供上游缺口、产品未锁定和未来 `03` 回写边界 |
| `04_config_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围和非范围残余风险 |
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置控制面和详细设计绑定点 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供允许/禁止配置化边界和 hot reload 风险 |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供来源优先级、config center/admin override 风险 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 profile 矩阵和 production-like future 风险 |
| `04_config_step_07_config_items.md` | 已完成 | 提供配置项清单和 future 产品化触发条件 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供敏感配置、secret provider 和 no-output 风险 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供加载、校验、生效和 reload/LKG 风险 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供变更、审计、回滚和高风险配置风险 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供失败模式、降级和 silent fallback 红线 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供测试、验收、实施和运维承接风险 |
| `04_config_step_13_migration_deprecation_evolution.md` | 已完成 | 提供迁移、废弃、演进和 future design-change-required 队列 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置问题仍可能影响落地? | P1/P2 产品选型、真实 secret provider、remote config center、admin override、hot reload、online last-known-good、production-like hardening、旧 `05/06` 重写、未来 `07/09` 承接都会影响后续落地,但均不属于当前 P0 必须闭合的配置契约。 |
| 哪些事项会阻塞测试、验收、实施或运维? | 当前 P0 `04` 定稿不被阻塞。阻塞范围仅限未来相关能力: 如果实施要求引入真实 provider、config center、hot reload、产品级 endpoint/DSN/topic schema、adapter constructor 新参数或 public protocol 变更,必须先回写 `03` 和 `04`。 |
| 每个待确认事项需要谁确认? | 产品/架构确认 P1/P2 能力是否进入范围;安全/运维确认 secret provider、redaction、rotation、runbook;实施负责人确认 runtime builder/adapter contract 是否需要新增;测试/验收负责人确认 evidence gate。 |
| 未确认前应如何处理? | 一律不写成 P0 正式配置契约。P0 保持 strict JSON、defaults < file < env、fake/disabled/product-neutral refs、restart/new job run 生效、no hot reload、no config center、no admin override、no raw secret。 |
| 哪些配置结论改变了 `03-详细设计.md` 的代码契约? | 当前 P0 无新增改变。Step 1~13 中“是”的项均为 future/conditional 触发: 只有未来启用相关能力时才改变 runtime config、builder、adapter constructor、port、error、flow、DTO 或 observability contract。 |
| 这些影响是否已经回写到 `03-详细设计.md`,还是需要标为阻塞待确认? | 当前 P0 不触发,因此无当前待回写项。future/conditional 项在本 Step 记录为设计变更触发器;未来一旦进入实施范围,必须先回写 `03` 并重新跑对应配置 Step。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1~13 影响 `03` 表 | 多处使用 `阻塞待确认` 标记 future/conditional 能力 | 本 Step 统一收口为“当前 P0 未触发;未来触发前必须先回写设计” |
| 正式 `04` | 尚未创建 | Step 15 才能装配;本 Step 不创建正式文档 |
| 旧 `05/06` | 旧测试/验收口径未按新版 `03/04` 重写 | 记录为下游重写风险,不阻塞当前 `04` 定稿 |
| `07/09` | 当前未形成新版实施计划/部署运维手册 | 记录为后续承接风险,不反向污染当前配置契约 |
| P1/P2 产品化 | durable store、bus、secret provider、config center、production-like 未锁定 | 记录为 future design-change-required 或 ADR 事项 |
| 配置证据 | digest canonicalization、redaction evidence、profile gate 需要后续测试承接 | Step 12 已给承接表;本 Step 记录风险和负责人 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险归属 | 分散在 Step 1~13 | 汇总为风险表和待确认事项表 | 便于 Step 15 判断是否可定稿 |
| `03` 回写判断 | 多处 future 项标为阻塞待确认 | 当前 P0 无待回写;future 项转为触发器 | 避免未来能力阻塞 P0 配置定稿 |
| 下游缺口 | 分散在 Step 12/13 | 统一记录 `05/06/07/09` 承接风险 | 防止正式 `04` 被误当作测试/部署完成证据 |
| 产品选型 | 作为未锁定风险散落 | 明确不阻塞 P0,但阻塞 P1/P2 实接 | 保持产品中立 |
| 未确认项 | 可能被误写成配置项 | 明确未确认前不得进入正式契约 | 满足 SOP 约束 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| future `03` 影响项是否阻塞 Step 15 | A. 全部阻塞;B. 仅当前 P0 触发时阻塞 | 采用 B。当前 P0 不实现相关能力,正式 `04` 可写明 unsupported/future |
| 产品未锁定是否阻塞 P0 | A. 阻塞;B. P0 使用 product-neutral/fake/disabled refs | 采用 B。产品选型留 ADR / P1/P2 |
| 旧 `05/06` 是否作为配置真相源 | A. 作为输入覆盖 `04`;B. 作为待重写下游草案 | 采用 B。新版 `03/04` 才是后续测试验收输入 |
| hot reload / config center 是否预留成功路径 | A. 预留 disabled key;B. P0 出现即 reject | 采用 B。当前 `03` 没有 reload/config center contract |
| secret provider 是否在 P0 定义产品 API | A. 定义;B. 仅 opaque refs/no raw secret | 采用 B。真实 provider 属 future design-change-required |

## 8. 结构化中间产物

### 8.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| Durable store / bus / search / metric / DLQ / external GRC 产品未锁定 | 影响 P1/P2 默认值、secret ref、endpoint、failure strategy 和验收 evidence | P0 使用 product-neutral refs、fake/disabled adapter、strict validation;真实产品进入 ADR 和 future `03/04` 变更 | 架构负责人;实施负责人;运维负责人 |
| 真实 secret provider / KMS / Vault 未定义 | 影响 credential resolution、rotation、health、adapter constructor 和 no-output 测试 | P0 只保存 opaque refs,不解析 raw secret;未来 provider 先回写 `03` runtime builder/adapter contract | 安全负责人;运维负责人;实施负责人 |
| Remote config center / admin override 未定义 | 影响 source priority、availability、audit、rollback 和 actor capability | P0 不接受 config center/admin override key;未来先补 `03/04/10/11/13` | 架构负责人;安全负责人 |
| Runtime hot reload / online last-known-good 未定义 | 影响 runtime lifecycle、adapter replacement、rollback、partial failure 和 audit | P0 只支持 restart/new job run 生效;hot reload/LKG 出现即 design-change-required | 架构负责人;运行时负责人 |
| Production-like / staging-like 仅为 future direction | 影响 profile isolation、fake rejection、真实 endpoint/secret/route/schema | P0 只定义 local-dev、ci-test、integration-like、operations-replay;production-like 不允许 fake/test fixture | 架构负责人;运维负责人;测试负责人 |
| 旧 `05-测试方案.md` / `06-验收标准.md` 未按新版 `03/04` 重写 | 影响后续 evidence 和 release gate 可用性 | Step 12 已给下游承接;正式 `04` 完成后重写 `05/06` | 测试负责人;验收负责人 |
| `07-实施计划.md` 和 `09-部署与运维手册.md` 尚未承接新版配置 | 影响 commit boundary、entry args、env key、artifact deployment、runbook | 正式 `04` 后再写 `07/09`;不得由实施侧临时发明 config key | 项目负责人;实施负责人;运维负责人 |
| Config digest canonicalization 仍需实现细化 | 影响证据比对、drift detection、rollback report | `04` 只要求 redacted canonical digest;具体算法进入实施/测试,不得包含 raw secret/raw body | 实施负责人;测试负责人 |
| Retry/backoff/alert threshold 等 ops 数值未产品化 | 影响运行调优和告警 | P0 使用 safe defaults/range validation;产品级阈值进入 P1/P2 配置变更 | 运维负责人;测试负责人 |
| Future migration/deprecation automation 未定义 | 影响已发布配置演进 | Step 13 定义状态和 evidence;自动化工具未来再设计 | 实施负责人;release 负责人 |

### 8.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| P1/P2 durable store、bus、metric、DLQ、diagnostic store、external GRC 产品是否锁定 | 不影响 P0 `04`;影响 future product schema | 架构负责人;产品负责人;运维负责人 | P0 保持 product-neutral/fake/disabled |
| `staging-like` / `production-like` 是否进入近期路线 | 不影响 P0;影响 profile hardening 和 fake rejection evidence | 产品负责人;架构负责人;运维负责人 | 只作为 future direction,不写正式 P0 profile |
| 真实 secret provider 是否进入 runtime builder | 不影响 P0;影响 adapter constructor、health、rotation、no-output | 安全负责人;运维负责人;实施负责人 | P0 只允许 opaque refs;raw secret reject |
| Remote config center / admin override 是否进入未来版本 | 不影响 P0;影响 source priority、actor audit、rollback | 架构负责人;安全负责人 | P0 不接受对应来源或 key |
| Runtime hot reload / online LKG 是否需要 | 不影响 P0;影响 lifecycle、rollback、adapter replacement | 架构负责人;运行时负责人;运维负责人 | P0 restart/new job run 生效;reload key reject |
| 旧 `05/06` 何时重写 | 不影响 Step 15;影响测试验收闭环 | 测试负责人;验收负责人 | `04` 定稿后按 Step 12 输入重写 |
| `07/09` 何时承接配置 | 不影响 Step 15;影响实施和运维落地 | 项目负责人;实施负责人;运维负责人 | 不允许实施侧临时发明 config key/env key |
| Deprecated warning 是否进入 public protocol surface | 当前 P0 不需要;未来若进入会影响 DTO/error | 架构负责人;实施负责人 | 当前只要求 redacted issue/log;public surface 变化先回 `03` |
| Config digest canonicalization 具体算法 | 当前 `04` 只定义语义;影响测试实现 | 实施负责人;测试负责人 | 实施时固定 redacted canonical algorithm 并补测试 |
| 迁移自动化工具是否需要 | 当前首版无迁移;未来影响 release tooling | release 负责人;实施负责人 | 当前不定义工具,只定义迁移规则和 evidence |

### 8.3 详细设计回写清单

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前 P0 配置设计不新增 runtime config、adapter constructor、port、error、flow 或 DTO | 否 | 当前 P0 契约保持 | 不适用 | 无回写 |
| P0 采用 `infra::config` -> `runtime_builder` -> injected ports/typed params,application/domain/contracts 不读取 raw config | 否 | 承接既有详细设计配置绑定 | 不适用 | 无回写 |
| P0 无 remote config center、admin override、runtime hot reload、online LKG、真实 secret provider API | 否 | unsupported boundary | 不适用 | 无回写 |
| P0 使用 product-neutral refs、fake/disabled adapter 和 strict validation | 否 | 配置语义和 profile isolation | 不适用 | 无回写 |
| Future 如果新增 runtime config 字段、adapter constructor 参数、port、error、flow、DTO、builder lifecycle、reload、config center、secret provider health 或产品级 schema | 是 | future 代码契约变更 | `03` §4~§15 或对应 calibration Step | 无回写 |

> 说明: 最后一行是 future/conditional 触发器,当前 P0 未触发,因此处理状态为“无回写”。未来一旦进入实施范围,必须先把状态改为“待回写/阻塞待确认”,回写 `03`,再重新执行相关配置 Step。

### 8.4 Step 1~13 影响 `03` 汇总表

| 来源 Step | 原配置结论 | 当前收口 | 当前处理状态 |
|---|---|---|---|
| Step 1 | 后续若新增 runtime config 字段、adapter constructor 参数、port、error 或 flow | 当前 P0 不新增;未来触发前回写 `03` | 无回写 |
| Step 2 | 后续具体配置项若要求新增 runtime config 字段或 adapter constructor 参数 | 当前配置项不要求新增;未来触发前回写 `03` | 无回写 |
| Step 3 | 后续若配置项要求新增 `GovernanceRuntimeConfig` 字段、adapter constructor 参数、port、error、flow 或 DTO | 当前 P0 只承接既有绑定;未来触发前回写 `03` | 无回写 |
| Step 4 | 若未来需要 hot reload、动态 adapter replacement 或配置改变 core flow | 当前 P0 不支持 hot reload/dynamic replacement;未来触发前回写 `03` | 无回写 |
| Step 5 | 若后续需要远程配置中心、admin override 或 hot reload | 当前 P0 不引入;未来触发前回写 `03` | 无回写 |
| Step 6 | 若后续要求 production-like 动态 adapter replacement、真实 secret provider 或产品级 endpoint schema | 当前 production-like 仅 future direction;未来触发前回写 `03` | 无回写 |
| Step 7 | 若后续实现要求真实 secret provider、remote config center、admin override、hot reload、产品级 DSN schema 或 adapter constructor 新参数 | 当前 P0 不实现这些能力;未来触发前回写 `03` | 无回写 |
| Step 8 | 若后续要求 adapter 在 runtime builder 中解析真实 secret provider、支持 hot reload、admin override 或产品级 credential schema | 当前 P0 只保存 opaque refs;未来触发前回写 `03` | 无回写 |
| Step 9 | 若后续要求 runtime reload、last-known-good config、secret provider resolution、product-specific adapter constructor 或 config center | 当前 P0 restart/new job run 生效;未来触发前回写 `03` | 无回写 |
| Step 10 | 若后续要求 remote config center、admin override、runtime hot reload、last-known-good live switch 或 real secret provider rotation API | 当前 P0 不支持;未来触发前回写 `03` | 无回写 |
| Step 11 | 若后续要求 remote config center、online LKG、hot reload、secret provider health contract 或 production alert threshold | 当前 P0 不支持;未来触发前回写 `03` | 无回写 |
| Step 12 | 若下游要求新增 hot reload、config center、production secret provider health port 或改变 runtime builder contract | 当前下游不得新增;未来触发前回写 `03` | 无回写 |
| Step 13 | future config center、admin override、hot reload、online LKG、secret provider health contract | 当前 P0 只作为 evolution queue;未来触发前回写 `03` | 无回写 |

### 8.5 未关闭事项处理规则

| 类型 | 是否可写入正式 P0 `04` | 未关闭前处理 |
|---|---|---|
| 当前 P0 已决策边界 | 可以 | 写成正式配置契约 |
| Future/P1/P2 direction | 可以写成未来演进说明 | 不得写成 P0 可用配置项 |
| 产品选型未定 | 不写具体产品字段 | 使用 product-neutral ref / disabled / fake |
| 会改变 `03` 代码契约的能力 | 不写成已支持 | 标记 design-change-required,未来先回写 `03` |
| 下游测试/验收/实施/运维未重写 | 可写承接要求 | 不把当前 `04` 视作下游 evidence 已完成 |
| 安全红线未确认 | 不写宽松 fallback | fail-fast/fail-closed/reject |

### 8.6 风险停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 所有 Step 1~13 未关闭事项是否汇总 | 通过 | 见 §8.1 / §8.2 |
| 所有“是否影响 03 = 是”是否覆盖 | 通过 | 见 §8.4 |
| 是否仍存在当前 P0 `待回写` | 无 | future/conditional 未触发 |
| 是否仍存在当前 P0 `阻塞待确认` | 无 | 阻塞范围已收窄到 future 能力 |
| 是否把待确认事项写成正式配置契约 | 未写入 | Step 15 仅可写为风险/未来演进 |
| 是否清楚说明 blocked scope | 通过 | Future 实接、reload、config center、secret provider、public protocol 变更会阻塞 |
| 是否可进入 Step 15 | 通过 | 当前无待回写或阻塞待确认项 |

### 8.7 跨风险 / 回写审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 产品未锁定是否影响 P0 配置定稿 | 不影响 | P0 product-neutral/fake/disabled |
| Future provider/config center/hot reload 是否进入 P0 schema | 不进入 | 只保留 unsupported/future 说明 |
| Raw secret/raw body 是否可能进入正式配置 | 不允许 | Step 8/11 fail-closed |
| Test fixture 是否可能进入 production-like | 不允许 | production-like future hardening 必须 reject fake |
| Entry-local/job-run-start 是否覆盖 global startup config | 不允许 | 只影响当前入口或当前 job |
| 旧 `05/06` 是否覆盖新版 `03/04` | 不允许 | 后续按新版设计重写 |
| Future `03` 回写是否被遗漏 | 未遗漏 | §8.4 逐 Step 覆盖 |

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
> - 建议继续阅读上述中间产物的“风险表”“待确认事项表”“详细设计回写清单”“Step 1~13 影响 03 汇总表”“未关闭事项处理规则”“风险停审记录”和“跨风险 / 回写审计表”小节,了解配置设计定稿前仍有哪些 future 风险和当前 P0 为什么不被阻塞。

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
| 所有 Step 1~13 “是否影响 03 = 是”均已覆盖 | 通过 | 见 §8.4 |
| 当前 P0 不存在 `待回写` | 通过 | future/conditional 未触发 |
| 当前 P0 不存在 `阻塞待确认` | 通过 | 阻塞范围已收窄到 future 能力 |
| 待确认项未写成正式配置契约 | 通过 | Step 15 只能写为风险/演进/unsupported |
| 可进入 Step 15 | 通过 | 用户审查通过后装配正式 `04-配置设计.md` |
