# Step 14：定义风险与待确认事项

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 14
> 回填章节：未来正式 `04-配置设计.md` §14“风险与待确认事项”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_14_risks_open_questions.md`
> 执行模式：full-restart；本文件汇总风险与门禁，不把未确认内容写成已闭合配置契约

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 14 风险与待确认事项 |
| 当前模块 | `risks_open_questions` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1~13 全部中间产物、项目级 blocker 台账、配置 SOP Step 14 |
| 正式 `04` 写入 | `false`；仅 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；风险表不表示已存在产品、测试、报告或缓解完成证据 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 汇总 Step 1~13 的上游、产品、配置、下游和安全风险。
- [x] 明确每个待确认事项的影响、确认方向及未确认前处置。
- [x] 汇总所有可能影响 `03` 的配置结论，区分当前 P0 与 future trigger。
- [x] 检查当前 P0 是否存在 `待回写` / `阻塞待确认`，作为 Step 15 门禁。
- [x] 完成风险停审、跨风险审计、§14 回填草稿和正式装配前检查。

## 2. 本步目标与边界

本 Step 将此前各 Step 的未闭合事项集中为可追溯风险、待确认事项和详细设计回写门禁。它的目标是使正式 `04` 能诚实表达 P0 已收口内容与 future / external blocker 的界线。

本 Step 不：

- 选择数据库、Bus、DLQ、observability、container、scheduler、secret provider、KMS 或 configuration center 产品；
- 补造 `L2-member`、`L2-member-images`、`L2-runtime`、`L4-sandbox`、Core/Bus/SDK 的 exact contract；
- 创建 `05/06/07/09`、实现、测试、artifact、report、verdict、signoff 或 readiness；
- 将 future P1/P2 方向、未确认 owner、产品候选或 external availability 写成 P0 ready。

## 3. 本步输入

| 输入 | 本 Step 用途 | 状态 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 上游输入、历史污染和 initial blocker | completed |
| `04_config_step_02_scope.md` | P0/P1/P2 及非范围 | completed |
| `04_config_step_03_control_plane.md` ~ `04_config_step_13_migration_deprecation_evolution.md` | 控制面、分类、来源、profile、配置项、敏感、激活、变更、失效、下游和演进风险 | completed |
| `project_execution_ledger.md` | `MSVC-UP-001~008`、并行窗口和项目纪律 | current input |
| `03-详细设计.md` / Step 14 | 当前 builder/Port 边界及可能回写位置 | completed |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些配置问题仍影响落地？ | exact sibling adapter/ref/feedback、policy/credential owner、Core/Bus route/envelope/receipt、SDK target、具体产品和数值、provider/config center/hot reload、future profile hardening、下游重写和 evidence 载体均仍会影响 future 实接。 |
| 哪些事项阻塞测试、验收、实施或运维？ | 当前 P0 `04` 定稿不被阻塞；它们阻塞对应 future positive integration、产品化、P1/P2 实施或下游 evidence。若实施要求将这些能力写成可实现 P0，就必须先回 `03/04`。 |
| 需要谁确认？ | 对端项目 owner 确认 exact contract；架构/产品确认 P1/P2 scope 和产品选择；安全/运维确认 secret、rotation、runbook；测试/验收确认 evidence gate；实施确认代码契约和实际交付路径。 |
| 未确认前如何处理？ | P0 只使用 strict JSON、product-neutral opaque ref、fake/disabled/placeholder、blocked/unknown/fail-closed、cold restart/new job run，且不声明 ready。 |
| 哪些结论影响 `03`？ | 当前 P0 无新增 runtime config、builder lifecycle、constructor、Port、DTO、error 或 flow。remote/admin source、online LKG/hot reload、provider health/rotation、production product schema、新 external feedback 等只是 future trigger。 |
| 当前是否有 `待回写` 或 `阻塞待确认`？ | 当前 P0 没有。future/conditional 行为不是当前 P0 配置契约；一旦进入范围，状态必须改为待回写/阻塞待确认并回写 `03` 后重跑受影响 `04` Step。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| Step 1~13 `03` 影响表 | future 项可能被不同措辞标为 blocker | 统一为“当前 P0 不触发；future 入范围前回写” |
| project ledger | 顶部旧恢复记录滞后于 Step 9+ | 在 Step 15 最终审计时以当前 flow / Step 状态刷新，保留历史记录只作历史 |
| sibling contract | 需求级方向与 exact schema 容易混淆 | 分离 requirement-level consumption 与 detailed-contract pending |
| 下游状态 | `05/06` 为旧材料，`07/09` 未创建 | 标为承接风险，不误称 evidence ready |
| 产品选型 | 容易被配置 demo 暗示为已定 | 只允许 opaque ref/availability，不锁产品 |
| 风险措辞 | 可能让 P0 看似被完全阻塞 | 说明 current P0 configuration semantics 可定稿，但真实正向集成仍 blocked |

## 6. 改动前后对比

| 项目 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险位置 | 分散在每个 Step | 汇总为风险、待确认、回写和处理规则 | Step 15 可审计 |
| `03` 回写 | future 项的状态表述不一致 | 当前 P0 无回写；future 是明确触发器 | 防止误阻塞或遗漏 |
| cross-project blockers | 可能被 profile/ref 示例淡化 | 每个关键 contract 均保留 MSVC ID 与 fail-closed 上限 | 不伪造 ready |
| 下游缺口 | 可能被 `04` 定稿掩盖 | 明确下游重写 / 实施 / 运维仍待后续 | 保持文档串行 |
| 产品化风险 | 散落在 profile、secret、failure 章节 | 集中列为 P1/P2 / ADR 事项 | 保持 P0 产品中立 |

## 7. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| future `03` 影响是否阻塞 Step 15 | 全部阻塞 / 仅当前 P0 触发时阻塞 | 仅当前 P0 触发时阻塞；future 写为 design-change-required |
| 产品未锁定是否阻塞 P0 | 阻塞 / P0 product-neutral/fake/disabled | 后者；产品选择阻塞 P1/P2 实接 |
| 旧 `05/06` 是否覆盖新版配置 | 是 / 只作 historical input | 只作 historical input，后续必须按新版重写 |
| hot/config center 是否保留 disabled key | 保留 / P0 直接 reject | 直接 reject；避免暗示能力可用 |
| external exact contract 是否由本仓补全 | 补 placeholder schema / 保留 opaque ref+blocked | 后者；owner contract 未闭合不可 shadow |

## 8. 结构化中间产物

### 8.1 风险表

| ID | 风险 | 影响 | 缓解 / 当前处置 | 确认方向 |
|---|---|---|---|---|
| `MSVC-UP-001` | Runtime session / execution handoff exact surface 未闭合 | session 正向关联、feedback mapper、测试 | `runtime_session_binding` 仅 placeholder/blocked；不定义 run/outcome | L2-runtime / 双侧合同 |
| `MSVC-UP-002` | Member launch/register/heartbeat/status exact contract pending | registration、health、credential ref | 需求级 owner 可消费；positive path blocked/unknown | L2-member |
| `MSVC-UP-003` | Images pinned supply/manifest/digest contract pending | launch qualification | 仅 supply ref/availability；不解析 manifest 或 Role mapping | L2-member-images |
| `MSVC-UP-004` | Sandbox bind/release/cleanup schema and caller pending | isolation handoff、closure | unsafe / unknown binding fail-closed；不定义 backend/policy truth | L4-sandbox |
| `MSVC-UP-005` | policy 传递 owner 未闭合 | configuration source / allowed action path | 不定义 policy config，保持 external pending | Governance / architecture owner |
| `MSVC-UP-006` | launch credential signer/revoke owner 未闭合 | credential ref rotation / failure | opaque ref only；高风险 fail-closed | security / member owner |
| `MSVC-UP-007` | Core/Bus route/envelope/receipt/event family pending | publication/handoff positive mapping | topic-neutral/event ref placeholder；不推导 delivered/accepted | L0-core / L0-bus |
| `MSVC-UP-008` | SDK compile target / self-test pending | compile/fake seam 和测试承接 | 不声明 compile/self-test ready | L0-sdk |
| `MSVC-CFG-001` | durable store/Bus/DLQ/observability/container/scheduler 产品未锁定 | P1/P2 values、adapter、运维和 evidence | P0 in-memory/fake/product-neutral；future ADR | architecture / SRE |
| `MSVC-CFG-002` | provider/rotation/audit artifact owner 未锁定 | sensitive ref、credential、rollback | opaque ref + digest-only；no raw material | security / operations |
| `MSVC-CFG-003` | remote config/admin/LKG/hot reload 未设计 | source、lifecycle、rollback、audit | P0 reject；future 先回写 `03/04` | architecture / operations |
| `MSVC-CFG-004` | future production-like/staging-like 未进入当前范围 | real integration and release profile | 仅 future direction；fake/fixture protection保持 | product / architecture |
| `MSVC-CFG-005` | `05/06` 未按新版重写、`07/09` 未创建 | evidence、acceptance、implementation、operations 闭环 | Step 12 承接输入；不声称已完成 | test / acceptance / implementation / operations |
| `MSVC-CFG-006` | digest canonicalization、expiry、retention、retry/alert 数值无 authority | evidence comparison / operations tuning | 仅定义语义和范围，具体算法/值 future | implementation / test / operations |

### 8.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| Runtime/Member/Images/Sandbox exact refs、feedback、availability | 阻塞 positive integration | 相应对端 owner | placeholder / blocked / unknown / fail-closed |
| policy / launch credential owner 和 lifecycle | 阻塞 enabled policy/credential 实接 | Governance/security/member owner | no policy config；opaque credential ref |
| Core/Bus topic/envelope/receipt | 阻塞 delivered/observed/accepted 正向 mapping | Core/Bus owner | event-family / target ref only |
| durable / observability / DLQ / carrier 产品 | 影响 P1/P2 adapter 和运维 | architecture/SRE/product | product-neutral ref / fake / disabled |
| secret provider 和 rotation audit | 影响 future provider integration | security/operations | ref-only、restart/new run、no raw material |
| config center/admin/hot/LKG | 影响 source/activation/rollback | architecture/security/operations | P0 reject，future design change |
| production-like/staging-like 路线 | 影响 future profile | product/architecture/operations | current P0 four profiles only |
| `05/06` 重写、`07/09` 创建 | 影响下游真正闭环 | corresponding document owner | Step 12 input only |
| config digest algorithm / evidence storage | 影响 future comparison and audit | implementation/test/operations | semantic digest only, no algorithm claim |

### 8.3 详细设计回写清单

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 `infra/config.rs` → `ValidatedMemberServiceConfig` → `runtime_builder`，其他层不读 raw config | 否 | 承接现有 builder 边界 | `03` §13 已有 | 无回写 |
| P0 strict JSON、defaults < file < env、cold restart/new job run、opaque ref | 否 | 配置语义 | 不适用 | 无回写 |
| P0 禁止 remote/admin/hot/LKG/raw provider body | 否 | unsupported / security boundary | `03` §13 已有 | 无回写 |
| P0 static owner/state/idempotency/query/handoff 禁止 override | 否 | 承接既有 redline | `03` §13~§15 已有 | 无回写 |
| future runtime config field、adapter constructor、Port、DTO、error、flow 或 profile enum | 是 | code contract expansion | 对应 `03` object/port/flow/builder Step | future trigger；当前无回写 |
| future config center/admin override/online LKG/hot reload/dynamic swap | 是 | loader/builder/lifecycle/rollback/audit | `03` §5、§7、§12~§15 | future trigger；当前无回写 |
| future secret provider health/rotation or product schema | 是 | adapter/handle/error/observability | `03` §7、§12~§15 | future trigger；当前无回写 |
| future public protocol/deprecation warning externalization | 是 | contracts/DTO/error schema | `03` protocol/error Step | future trigger；当前无回写 |

### 8.4 Step 1~13 `03` 影响汇总

| 来源 Step | 可能触发 | 当前 P0 收口 | 处理状态 |
|---|---|---|---|
| Step 1~3 | 新 runtime section、builder target、adapter constructor | 仅承接既有 config/builder | 无回写 |
| Step 4~6 | hot replacement、real profile/product binding | P0 禁止/仅 future profile | 无回写 |
| Step 7~8 | real provider、credential handle、product-specific ref schema | P0 opaque ref only | 无回写 |
| Step 9 | reload、LKG、config center、dynamic runtime field | P0 unsupported | 无回写 |
| Step 10 | admin override、live rollback、online provider rotation | P0 unsupported | 无回写 |
| Step 11 | provider health、production alert / retry contract | P0 only semantic failure categories | 无回写 |
| Step 12 | downstream demands change to builder/Port | downstream prohibited from redefining | 无回写 |
| Step 13 | future migration / production evolution features | design-change-required queue | 无回写 |

### 8.5 未关闭事项处理规则

| 类型 | 可否写入正式 P0 `04` | 处理方式 |
|---|---|---|
| 已收口 P0 配置边界 | 可以 | 写为明确规则和配置项 |
| cross-project exact contract pending | 可以写风险 / placeholder semantics | 不写 exact field/schema，不声明 ready |
| future P1/P2 direction | 可以写未来演进 | 不写为当前可用 key/adapter |
| 产品选型未定 | 不写具体产品字段 | opaque ref / disabled / fake / blocked |
| 影响 `03` 代码契约的能力 | 不写为已支持 | 标记 design-change-required，先回写 `03` |
| 下游尚未重写 | 可以写承接要求 | 不把 `04` 当 evidence/readiness |
| 安全或 static 红线 | 可以写拒绝规则 | fail-fast/fail-closed，不提供宽松 fallback |

### 8.6 风险停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 1~13 未关闭事项是否已汇总 | pass | §8.1~§8.2 |
| 每项是否有未确认前处置 | pass | placeholder/fail-closed/future/ADR 分层 |
| current P0 是否有 `待回写` | 无 | future triggers 未激活 |
| current P0 是否有 `阻塞待确认` | 无 | exact integrations blocked，但不改变 P0 config semantics |
| 待确认项是否被写成 P0 contract | 否 | §8.5 限制 |
| 下游未完成是否被写成 evidence | 否 | Step 12 仅输入 |
| 是否可进入 Step 15 | pass_with_upstream_blockers | 允许正式装配，但仍需 final audit |

### 8.7 跨风险 / 回写审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 产品未锁定是否阻塞 P0 配置定稿 | 不阻塞 | P0 product-neutral/fake/disabled/blocked |
| cross-project pending 是否被写成 ready | 未写成 | 仅 requirement-level direction / placeholder |
| future provider/config center/hot 是否进入 P0 schema | 不进入 | reject / design-change-required |
| raw secret/body 是否可能进入正式配置 | 不允许 | Step 8/11 fail-closed |
| fixture 是否越界到 production-like | 不允许 | profile guard |
| entry/job 是否覆盖 startup invariant | 不允许 | Step 9/10/11 边界 |
| 下游是否可覆盖 `04` | 不允许 | 冲突回 `04/03` |
| future `03` 回写是否遗漏 | 未遗漏 | §8.3~§8.4 汇总 |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 风险与回写门禁的汇总本身 | 否 | 文档治理 | 不适用 | 无回写 |
| 当前 P0 可写入已收口配置边界、风险和 future queue | 否 | 正式 04 装配 | 不适用 | 无回写 |
| 当前 P0 未新增 runtime config/builder/adapter/Port/DTO/error/flow | 否 | 保持详细设计基线 | 不适用 | 无回写 |
| future 将 provider/config center/hot reload/production schema/admin override/online LKG 变为实现范围 | 是 | config/builder/adapter/error/flow 变更 | `03` §4~§15 | future trigger；当前无回写 |

## 10. 回填草稿：正式 `04-配置设计.md` §14

> 校准来源：
> - `design-calibration/04_config_step_14_risks_open_questions.md`
>
> 延伸阅读：
> - 建议阅读“风险表”“待确认事项表”“详细设计回写清单”“Step 1~13 `03` 影响汇总”“未关闭事项处理规则”“风险停审记录”和“跨风险 / 回写审计表”。

正式 §14 应写入风险、待确认、P0 无 current `03` 回写、future trigger、处理规则和风险审计。正文必须保留 `MSVC-UP-001~008`，说明下游尚未重写，且不得把 blocker、未来产品或 evidence 写成 ready。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 15 是否按 Step 1~14 装配正式 `04` | 影响正式配置设计产出 | 当前 Step 已通过，下一步进行 final assembly/audit |
| future P1/P2 产品化范围 | 影响 ADR、`03/04/07/09` | 保持 risk/future queue |
| 旧 `05/06` 重写排期 | 影响测试验收闭环 | 不阻塞 `04`，但不宣称完成 |
| `07/09` 创建时点 | 影响实施和运维落地 | 不阻塞 `04`，但不得临时发明配置契约 |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| 风险与待确认事项已覆盖 Step 1~13 | pass | §8.1~§8.2 |
| `MSVC-UP-001~008` 保持显式 | pass_with_upstream_blockers | 未伪造 ready |
| 当前 P0 `03` 回写清单为空 | pass | future trigger 已集中 |
| 当前 P0 `阻塞待确认` 为空 | pass | exact positive integration 仍 blocked，但不改变配置语义 |
| future 能力未写成 P0 key | pass | §8.5 |
| 下游未完成未被伪造成 evidence | pass | Step 12 boundary |
| 正式正文未提前创建 | pass | 仅有 §14 回填草稿 |
| 进入 Step 15 条件 | pass_with_upstream_blockers | 允许创建 formal assembly Step 文件，再装配正式 `04` |

```text
step_14_status = completed / pass_with_upstream_blockers
step_14_gate = pass_with_upstream_blockers
formal_04_write_allowed = true_for_step_15_assembly_only
next_allowed_action = enter_step_15_formal_document_assembly
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
