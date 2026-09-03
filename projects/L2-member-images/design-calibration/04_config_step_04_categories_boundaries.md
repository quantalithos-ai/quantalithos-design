# L2-member-images 04 配置设计 Step 4：定义配置分类与禁止配置化边界

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4  
> 回填位置：正式 `04-配置设计.md` 第 4 章“配置分类与边界”  
> 前提：Step 3 的六个配置域已完成控制面停审；本 Step 不写来源优先级或具体 JSON item。

## 1. Step 状态、目标与输入

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 4：配置分类与禁止配置化边界 |
| 当前状态 | `completed` |
| 本步目标 | 为每个配置域确定适用类别、冷生效边界与不可配置不变量。 |
| 直接输入 | Step 1~3，正式 `00~03`，尤其 `03` §13 与 Step 14。 |
| 不做事项 | 不定义实际 key、值、profile 文件、产品、热更新、部署或恢复算法。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 当前系统有哪些启动、运行时、策略、敏感、调试配置？ | 当前 P0 只有启动读取的 composition、private binding-policy、TestOnly fake 和 redaction 语义。没有 P0 hot runtime policy、public debug switch、remote configuration 或 raw secret。 |
| 哪些配置允许热更新？ | 当前 P0 无 hot/reload 项；全部 P0 配置是 cold/startup-only。任何在线替换 slot、source、fake、secret 或 adapter 的能力均为 P2，必须先重开 03/04。 |
| 哪些配置只能冷更新或启动读取？ | profile、slot binding mode、configuration source identity、local-store binding、reference/external boundary disposition均只能在新 composition 前读取。变更时需重新 parse/validate/assemble，不能修改已运行/已记录 domain truth。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化？ | Role mapping truth、immutable pin/no-`latest`、static/live、candidate/eligibility/availability、Artifact/consumer truth、state/UoW/version/append-only/recovery、dependency category、event activation/outbound、redaction floor 均禁止。 |
| 禁止项如需改变应走什么流程？ | 需求/架构/详细设计变更或唯一 owner 合同重开；不得以 env、feature flag、profile、fake 或 default 绕开。 |
| 每域类别与禁止项是否一致？ | 一致：各域只可在 private composition 边界选择现有 slot implementation 或 fail-closed disposition，不能决定任何 staged truth。 |

## 3. 配置分类表

| 配置类别 | 说明 | 本仓 P0 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| `startup-composition` | 新 composition 前读取，决定 private wiring 前置条件 | explicit profile、config-source identity、slot binding mode | 否 | 误把 local wiring 当 runtime/readiness。 |
| `local-binding-policy` | 约束 local store / resolver / conservative adapter 使用 required、blocked 或 TestOnly fake | local store required；pending external seam blocked | 否 | 以 mode 伪造 external availability。 |
| `test-isolation` | 只在 test harness 显式选择 deterministic fake | `ImageFakeMode::TestOnly` + fake-only slot | 否 | fake 污染 Production 或被当 evidence。 |
| `diagnostic-redaction` | 限定安全可输出的 category / ref，不放宽 redaction floor | safe reason / redacted diagnostic policy | 否 | raw config、secret、endpoint 或 provider body 泄漏。 |
| `sensitive-reference` | 仅允许 opaque ref 的私有定位；P0 没有 raw secret | future secret/reference selector | 否 | 把 opaque ref 或 raw material当普通字符串。 |
| `debug` | 未定义 P0 public debug configuration | 不适用 | 不适用 | debug 开关降低安全/审计边界。 |
| `online-control` | remote config、admin override、hot reload、LKG | P2 future only | 不适用 | 未定义 authority、rollback、lifecycle 与 error model。 |

## 4. 按配置域组织的分类边界表

| 配置域 | 适用配置类别 | 不适用类别 | 热/冷结论 | 禁止配置化项 | 原因 |
|---|---|---|---|---|---|
| `composition_identity` | startup-composition、diagnostic-redaction | test isolation、online control | cold/startup | config authority body、domain identity、Role mapping | raw config 只可形成 body-free ref；owner truth 外置。 |
| `composition_mode` | startup-composition、test-isolation | sensitive reference、online control | cold/startup | implicit TestOnly、process/container lifecycle、write activation | mode 只约束 composition；不能打开行为。 |
| `local_persistence` | local-binding-policy、test-isolation | online control、public debug | cold/startup | store product/schema、UoW/version/append-only/recovery | 技术 binding 不能改变 consistency contract。 |
| `static_references` | local-binding-policy、test-isolation、diagnostic-redaction | online control | cold/startup | mapping/component/seed/base body、pin/no-`latest`、live state | 仅 typed static ref/safe conclusion 可进入。 |
| `external_boundaries` | local-binding-policy、test-isolation、sensitive-reference (opaque ref only) | online control、public debug | cold/startup | provider product/endpoint/credential/result、candidate/gate/Artifact/consumer truth、event activation | external owner contract 和 positive lane 尚未闭合。 |
| `diagnostic_redaction` | diagnostic-redaction | online control、public debug | cold/startup | raw output、redaction floor、observability backend/retention | 安全最小输出不应被普通配置降低。 |

## 5. 禁止配置化项表

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| RoleDefinition、Role-to-variant mapping truth/body | `L3-method-library` owner；本仓只可消费 ref/snapshot/gap。 | owner 合同闭合并重开受影响 00~04。 |
| image family/variant identity、revision/history、owner authority | configuration 不能创造、覆盖或回写本仓 domain truth。 | 需求/架构/详细设计变更。 |
| necessary pin、immutable selector、生产禁 `latest` | 安全与可追溯红线。 | 改 ADR/需求/架构，不能用 profile 放宽。 |
| template/seed 与 live memory/checkpoint/workspace、credential | static/live 分离和 secret 排除是硬边界。 | 外部 owner 合同与范围重开；不作为 config fallback。 |
| candidate、digest/provenance、eligibility、availability | staged truth 必须经既有 guard / flow；config 不产生输出事实。 | 先关闭 DDD/owner/product blocker，再重开 03/04。 |
| Artifact acceptance/lineage、consumer confirmation、container/health | 分属 Artifact/consumer/runtime owner。 | 由相应 owner 定义合同，双方重新校准。 |
| domain state、UoW、version、append-only、idempotency/replay/recovery | 03 详细设计不变量；当前仍有 `DDD-*`/`PF-*` blocker。 | 重开 03 指定 Step，不能设置 retry/TTL/lease。 |
| compile/runtime/event/ref/adapter/fake 分类 | 全局依赖裁剪规则，而非运行策略。 | 通过正式依赖决策；不能因 config 加 Cargo。 |
| inbound event activation、broker/topic/receipt/dedup | `MI-UP-005` 未闭合；worker 当前仅 marker-only。 | event owner 提供正式合同后重开。 |
| outbound publisher/outbox/topic/delivery | `ImageOutboundEventInventory::NoneAuthorized` 是严格零。 | 取得 authority 后重开范围；不能设置 disabled placeholder。 |
| redaction floor、raw-secret/raw-body 禁止输出 | 安全边界不能被 config 降级。 | 不允许通过配置改变；安全设计变更须独立审查。 |

## 6. 禁止项与既有详细设计不变量映射

| 禁止项族 | 03 / 上游依据 | 违反时处理 |
|---|---|---|
| raw-read boundary / body-free carrier | `03` §13，Step 14 §5/§6 | config validation reject；不得传播 raw value。 |
| fake / assembly boundary | `ImageFakeMode`、`ImageRuntimeAssemblyState` | Production + FakeOnly 必须 Blocked。 |
| state/write/recovery | `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | zero-effect / no-write / no-repair；回写对应 03 Step。 |
| owner / staged truth | `00~03` owner tables、MI-UP / Q-MI | typed ref/gap/blocked/unknown；不得造 positive fact。 |
| dependency / event boundary | 全局裁剪规则、`03` §13 | current active sibling Cargo dependency = zero；outbound = zero。 |
| static/live / redaction | `00` NFR / VETO、`03` §13/14 | reject baseline or config；不记录 raw fields。 |

## 7. 分类边界停审记录

| 配置域 / 禁止项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `composition_identity` | 只有 startup / redaction，未把 ref/body混同 | 通过 | 具体 source 留 Step 5。 |
| `composition_mode` | 仅 explicit cold mode，无 auto test/hot path | 通过 | Step 6 定义环境矩阵。 |
| `local_persistence` | binding 不改 UoW/recovery | 通过 | 产品/physical store继续 deferred。 |
| `static_references` | ref-only、pin/static-live红线未放松 | 通过 | owner contracts仍 pending。 |
| `external_boundaries` | no product/no positive/no event activation | 通过 | P1 contract blockers保持。 |
| `diagnostic_redaction` | redaction floor不可降低、无 raw diagnostic | 通过 | backend留 09/owner。 |
| 全部禁止项 | 有依据和重开流程 | 通过 | 无新增直接配置化缺口。 |

## 8. 跨分类 / 禁止项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 同一行为在不同域分类是否冲突 | 未发现 | 所有域均为 cold composition，外部 result 不属于配置。 |
| P1/P2 是否污染 P0 | 未发现 | P1/P2 仅以 future trigger 记录。 |
| fake 是否被列为 Production fallback | 未发现 | fake only TestOnly。 |
| security / audit / consistency 是否被 boolean 绕过 | 未发现 | 列入禁止项。 |
| event/outbound 是否出现禁用占位项 | 未发现 | 严格不建立配置 section。 |
| 03 影响是否遗漏 | 未发现当前影响 | future trigger 在 Step 14 汇总。 |

## 9. 当前材料诊断与设计取舍

| 议题 | 不采用 | 采用 | 原因 |
|---|---|---|---|
| 为每个 P0 字段提供 hot reload | online replacement | 全部 cold/startup | 03 未定义 reload/rollback/lifecycle。 |
| 给每个 slot 提供 `enabled` 开关 | enable/disable 可绕过 required seam | required/blocked/TestOnly policy，仅 builder 验证 local availability | 禁止以 switch 伪造 availability。 |
| 将 redaction 声明为可选 debug policy | debug raw output | redaction floor 不可配置 | 防止泄漏。 |
| 以 timeout/retry/TTL 管理 external failure | 先设定数值 | 仅保留 blocked/unknown/no-blind-retry | 03 未定义 recovery / retry contract。 |
| 以 config “关闭” event/outbound | disabled feature | 不建立配置域 | 当前 inbound/outbound authority 均不足。 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 全部 cold/startup，TestOnly 显式，redaction floor/static invariants不可配置 | 否 | 既有 carrier/boundary 的配置分类 | 不适用 | 无回写 |
| 禁止项承接 03/owner existing redline | 否 | 约束归档 | 不适用 | 无回写 |
| P2 online control / real provider / event activation 暂不支持 | 否 | future unsupported boundary | 不适用 | 无回写 |
| future 若增加 reload/hot swap/TTL/retry/provider or public config control | 是（future trigger） | builder/port/error/flow/state change | 触发时回写 03 对应章节/Step | 无回写（当前未触发） |

## 11. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读“配置分类表”“按配置域组织的分类边界表”“禁止配置化项表”“分类边界停审记录”和“跨分类 / 禁止项审计表”。

正式 `04-配置设计.md` §4 应写明：P0 只有 cold startup-composition、local binding-policy、explicit TestOnly isolation 与 non-lowerable redaction；没有 hot/reload、public debug 或 online control。所有 staged truth、pin/static-live、state/UoW/recovery、owner contract、dependency classification、event/outbound 和 security redline 均禁止配置化，变更只能走 owner/03/上游设计重开。

## 12. 待确认事项与进入下一步条件

| 事项 | 当前处理 |
|---|---|
| 来源覆盖、secret ref 形态与冲突规则 | 留 Step 5。 |
| local/CI/staging/production profile 差异 | 留 Step 6。 |
| P0 JSON item / demo | 留 Step 7。 |
| P1/P2 product/reload/event/real secret provider | 保持 future/blocker，不能在分类中激活。 |

| 自检项 | 结论 |
|---|---|
| 每域已有适用/不适用类别与冷边界 | 通过。 |
| 禁止项有 owner/详细设计依据和变化流程 | 通过。 |
| 无安全/审计/一致性绕过开关 | 通过。 |
| 跨分类没有 unresolved 冲突 | 通过。 |
| 可进入 Step 5 | 通过；分类、冷边界与禁止项已停审。 |

```text
step_04 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_05_sources_priority_conflicts
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
