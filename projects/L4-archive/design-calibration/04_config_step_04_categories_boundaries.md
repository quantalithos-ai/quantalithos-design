# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
> 正式回填：`04-配置设计.md` §4
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 5）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 4：配置分类与禁止配置化边界 |
| 输入 | Step 3 控制面；正式 00/01/02/03 的安全、状态、事务、审计、依赖边界 |
| 输出 | 配置分类、热/冷更新边界、禁止配置化矩阵、逐域分类停审与跨分类审计 |
| 约束 | 不定义具体 key、数值、环境变量、secret provider 或产品；不改变 03 契约 |
| 下一动作 | 更新 flow/台账，进入 Step 5 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前有哪些配置类别？ | 分为 startup/assembly、bounded runtime parameter、binding/availability、policy/reference binding、sensitive locator、test-only deterministic 和 migration metadata。不存在可绕过安全的 debug/admin 类别。 |
| 哪些允许热更新？ | 当前无普通 `hot` 配置。profile、binding、store、codec、security、source/receiver、budget 和 schedule 均在 startup/new assembly 或 job-run-start 固化；未来热更新若改变 builder/状态/审计契约必须回写 03。 |
| 哪些只能冷更新？ | 所有影响 required slot、UoW/CAS/fence、authority/visibility、source matrix、integrity/compatibility、storage target、receiver、operation/cursor codec、redaction 和 retention reference 的配置均 startup/new assembly 生效。 |
| 哪些安全、审计、事务和领域规则禁止配置化？ | truth ownership、source requiredness 分类、项目状态、治理决定、manifest closure、integrity result、intent-before-effect、idempotency/replay、UoW/CAS/fence、Query no-write、owner restore write boundary、redaction denylist、evidence/readiness 和依赖方向。 |
| 禁止项要如何改变？ | 重新打开相应正式 00/01/02/03 或 owning project 合同，形成 ADR/设计回写并重新执行受影响 Step；不能通过 feature flag、emergency profile、test override 或 rollback 绕过。 |

## 3. 配置分类表

| 配置类别 | 说明 | Archive 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| `startup_assembly` | 决定 profile、schema identity、exact binding 与 facade 是否可构造 | profile ref、store/adapter slot bindings | 否；new assembly | partial assembly、旧新 binding 漂移 |
| `bounded_parameter` | 对请求、页、批、worker、超时、probe、重试的有界技术预算 | page/batch/timeout/lease/retry/probe limits | 否；startup 或 job-run-start | 中途改变导致不可复核或超限 |
| `availability_binding` | 标记 exact capability 是否 enabled/optional/blocked/degraded | `AdapterAvailabilityState` registry | 否；new assembly | marker 冒充 handle、required 被禁用 |
| `policy_reference` | 引用正式 authority/visibility/redaction/retention decision，不携带决定正文 | decision/policy/visibility/redaction refs | 否；重新装配 | 把 ref 当决定、fail-open |
| `target_mapping` | 将有限 source/owner/consumer/target 映射到已核验 adapter | `SourceExport(SourceClass)`、`RestoreReceiver(owner)` | 否；old work pinning | 错路由、跨 owner 越权 |
| `sensitive_locator` | opaque secret/credential/key/endpoint locator；材料私有解析 | secret/provider binding ref | 否；受控轮换需新 assembly | raw secret 泄露、轮换破坏旧 intent |
| `test_deterministic` | 只在 test support 提供 fake、fixture、故障注入和固定时钟/ID | deterministic fake profile | 否；isolated assembly | fake 进入 production、伪成功 |
| `migration_metadata` | schema/revision、deprecated key 记录和迁移窗口元数据 | config schema revision | 否；版本切换 | 无记录删除旧配置、读旧语义 |

## 4. 按配置域的分类边界

| 配置域 | 适用类别 | 不适用类别 | 允许配置能力 | 禁止配置化项 |
|---|---|---|---|---|
| `profile/assembly` | startup_assembly、availability_binding、migration_metadata | hot/debug | 选择已验证 profile 和 exact required set | 改 facade 权限、缩短 required set |
| `stores/consistency` | startup_assembly、sensitive_locator、bounded_parameter | hot、test override in prod | 选择 local store/UoW capability ref 与预算 | 关闭 atomicity/CAS/read-set/fence |
| `sources/authority_visibility` | target_mapping、policy_reference、sensitive_locator | hot、fallback | per-source binding、authority/visibility ref | workspace 升格 canonical、改 requiredness |
| `integrity/compatibility` | target_mapping、policy_reference、sensitive_locator | default-success、hot | capability/target binding ref | 选择算法/key、Unknown→Verified |
| `storage/lifecycle` | target_mapping、policy_reference、bounded_parameter | hot、self-authorizing | storage target、decision/schedule ref、执行预算 | 生成 retention/hold/delete/risk 决定 |
| `restore_receivers` | target_mapping、sensitive_locator、bounded_parameter | cross-owner fallback | owner-specific receiver ref 与预算 | Bundle 授予写权、owner 状态推断 |
| `inbound` | availability_binding、target_mapping、bounded_parameter | payload-defined dynamic | five event family mapping、schema/trust allowlist | ACK=commit、未知 schema 自动接收 |
| `operation_cursor` | startup_assembly、sensitive_locator、migration_metadata | ad hoc runtime codec | canonical codec/mapping binding ref | debug/JSON 临时编码、private cursor 出站 |
| `budgets` | bounded_parameter | zero/implicit fallback | typed page/batch/timeout/lease/retry/probe | 截断后 Complete、blind retry |
| `observability` | policy_reference、sensitive_locator、test_deterministic（仅 test） | body dump/debug bypass | safe telemetry/redaction binding | raw body/secret、audit backend truth |

## 5. 永久禁止配置化事项

| 禁止配置化项 | 原因 | 如需改变应走的流程 |
|---|---|---|
| source-authority matrix 与 Canonical/Conditional/Auxiliary 分类 | authority 是 owning domain 事实，配置不能改变 | 重新核验 owning project 合同与 00/01/03 |
| identity/conversation/work/process/governance/artifact/workspace/observability truth | Archive 不拥有也不反写这些 truth | owner 正式文档与边界变更 |
| 项目 `archived/dissolved/restored` 状态 | Archive 局部状态不能推导项目状态 | `L1-work`/正式 owner 状态流程 |
| RetentionPolicy、legal hold、delete authorization、risk acceptance | 需要正式治理决定；不能 default allow | governance decision/ADR；缺失即 blocked |
| manifest closure、revision immutability、source coverage | 不能因 batch/limit 截断或缺 material 仍 Complete/Sealed | 03 对象/状态/持久化设计回写 |
| digest/signature/encryption/compression/schema authority 与结果 | provider/算法/key 未闭合 | 安全/基础设施 owner + 03/04 回写 |
| operation key equality、canonical input、duplicate replay | 防止异输入覆盖和盲重放 | 03 concurrency/idempotency 重新设计 |
| intent-before-effect、commit-unknown probe/reconcile | 保护外部副作用和未知提交 | 03 flow/error/port 重新设计 |
| local atomic UoW、CAS/read-set/fence/append-only history | 不能由 backend profile 放宽一致性 | 03 persistence/transaction 回写 |
| current visibility、Query no-write、redaction denylist | 防泄露和隐式写 | 03 protocol/security/observability 回写 |
| per-owner restore receiver 与跨域写权限 | registry/endpoint 不是授权 | owner receiver/import contract |
| fake success、evidence、signoff、readiness | 测试替身和局部状态不能证明真实事实 | 05/06/07 实际证据链 |
| outbound event/outbox/publisher | `AR-HLD-Q-001` 未闭合 | 回退 02/03 与 Bus 合同后重开 |
| SDK compile dependency direction | 防服务端反向依赖和循环 | 全局依赖标准与 `L0-sdk` ADR |

## 6. 配置变更生效边界

| 变更类型 | 当前生效方式 | 允许的旧工作处理 |
|---|---|---|
| profile/binding/slot/codec/security | 新 assembly；旧 operation/intent 继续使用已固定 identity | 旧 work 不从 current config 重构；不兼容则 blocked |
| page/batch/timeout/retry/lease/probe | startup 或新 job-run-start 固化 | 已运行 job 保留其 fixed budget；不得中途漂移 |
| retention/lifecycle schedule ref | 新执行资格检查 | schedule 不能替代 decision；未决动作不自动清理 |
| redaction/safe output policy | 新 assembly；现有安全记录不回写原文 | 旧记录仍受原安全边界约束 |
| test fixture/fake binding | 仅 test assembly | production profile 必须拒绝 test-only source |

当前不开放 remote config center、admin override、online LKG 或自动 hot reload。若未来需要，必须先定义新 source/actor/audit/rollback/builder 契约并回写 03。

## 7. 分类边界停审

| 配置域/禁止项 | 类别是否明确 | 冷/热边界 | 红线是否可执行 | 结论 |
|---|---|---|---|---|
| profile/assembly | 是 | 冷 | 是 | 通过 |
| stores/consistency | 是 | 冷 | 是 | 通过 |
| sources/authority/visibility | 是 | 冷 | 是 | 通过；workspace Auxiliary 固定 |
| integrity/storage/lifecycle | 是 | 冷 | 是 | 通过；不选算法/provider |
| restore/inbound | 是 | 冷 | 是 | 通过；exact owner/family |
| operation_cursor/budgets | 是 | 冷 | 是 | 通过；缺 binding/数值保持 blocked |
| observability | 是 | 冷 | 是 | 通过；不建 backend |

## 8. 跨分类/禁止项审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 同一行为是否在多个域分类冲突 | 未发现 | storage target 与 lifecycle decision 分离；authority 与 visibility 分离 |
| P1/P2 是否污染 P0 | 否 | provider/hot/multi-region 仅 future/pending |
| 是否存在 debug/emergency 绕过 | 否 | 无 debug/admin bypass 类别 |
| 是否把 required slot 当可选 | 否 | required set 在 builder begin 冻结 |
| 是否把 projection/ref 当 canonical | 否 | workspace 永远 Auxiliary；ref 不等 body |
| 是否允许配置改变 Query/no-write/transaction | 否 | 永久禁止项覆盖 |
| 是否需要回写 03 | 当前不需要 | 仅重申既有不变量；future 能力触发回写 |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置分为 startup、bounded、binding、policy ref、sensitive、test-only、migration metadata | 否 | 配置语义分类 | 不适用 | 无回写 |
| 当前所有 P0 配置冷生效；无 hot reload/online LKG/admin override | 否 | 生效边界 | 不适用 | 无回写 |
| 永久禁止配置化项承接既有 00～03 红线 | 否 | 边界重申 | 不适用 | 无回写 |
| future 若引入 hot reload、dynamic replacement、source/admin actor 或新 bypass | 是（未来触发） | builder/port/error/audit/flow 变化 | 03 §4/§7/§9/§10/§12～§15 | 无回写（未来触发前暂停并回写） |

## 10. 回填草稿与下一步门禁

正式 §4 应回填配置分类表、按域分类边界、永久禁止项和冷/热生效口径。不得在正式正文中把禁止项变成可选布尔开关，也不得列出 provider/算法/真实密钥。

| 进入 Step 5 条件 | 状态 |
|---|---|
| 配置类别和热/冷边界已明确 | 通过 |
| 每个配置域已停审 | 通过 |
| 禁止配置化事项已回指 owner/03 红线 | 通过 |
| 跨分类审计无 unresolved 冲突 | 通过 |
| 03 影响判定已记录 | 通过；future 能力仍为硬门禁 |
