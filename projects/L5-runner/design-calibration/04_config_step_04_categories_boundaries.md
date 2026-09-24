# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节：`04-配置设计.md` §4
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_04_categories_boundaries.md`
> 输入：Step 1～3、正式 00/01/02/03、03 Step 10/11/13/14/15
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与内计划

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 4 |
| current_module | `categories:allowed_and_forbidden_boundaries` |
| gate_status | `pass_for_step_05` |
| gate_reason | 配置类别、startup/job-start/test-only 生效方式、逐域禁止项、跨分类一致性和 VETO 审计均已完成；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_05_sources_priority_conflicts.md` |

### 1.1 Step 内计划

| 项目 | 状态 | 产物/门禁 |
|---|---|---|
| 全局类别表 | done | static/startup/job/test/feature/sensitive |
| 热/冷/静态边界 | done | 生效方式矩阵 |
| 逐域分类 | done | 七域分类表 |
| 禁止配置化 VETO | done | 红线表 |
| 跨分类审计 | done | 无冲突/无遗漏 |
| 自检 | done | `pass_for_step_05` |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些配置类别适用？ | `static_design_boundary`（不是普通配置）、`startup_assembly`、`job_run_start_policy`、`entry_local_selector`、`sensitive_ref`、`diagnostic_redaction`、`test_deterministic`、`peripheral_feature_request`。 |
| 哪些允许热更新？ | P0 不允许 hot update。影响 builder、store/UoW、adapter registry、redaction、idempotency、clock/id/digest、limits 或 feature marker 的值均 startup/new-builder；Job policy 在每次 job start 固化；entry-local 只影响当前入口。 |
| 哪些可以 reload？ | 只有未来明确设计的非核心、可回滚 policy 才可另行引入；当前没有 reload/hot 配置项。 |
| 哪些绝不能配置？ | truth ownership、exact Release/version/generation、authority/integrity gate、state matrix、Query no-write、idempotency/no-replay、RecoveryCase、redaction 下限、数据归属、依赖方向、protocol schema、outbound event 数量和 evidence boundary。 |
| feature 是否可打开 reserved path？ | 不可。feature 只可关闭外围能力或请求已有 safe seam；当前 planned Consumer positive path、owner approval、Sandbox/Runtime execution 和 formal evidence 永远不能由 flag 开启。 |

## 3. 当前问题诊断、改动前后对比与取舍

| 议题 | 风险/候选 | 收口后 | 理由 |
|---|---|---|---|
| 热更新 | 运行中改 binding/limit/guard 可能打断 basis、UoW 或 recovery | P0 startup-only；新值必须新 builder/新 marker；旧运行保持原 snapshot | 保证可复核和多轴一致性 |
| 默认值 | 使用零值/无限值隐藏缺失 | 必填项缺失 fail-fast；安全布尔/空集合可有默认；无 authority 数值不设默认 | 防止隐式放行和伪造容量 |
| policy vs truth | 用配置改变状态或审批 | policy 仅是 typed technical input；domain/owner truth 不可配置 | 保持所有权和状态机不变量 |
| test fake | 将 fake/in-memory 当 production fallback | 只在 test profile；生产-like 发现 test provider 即拒绝 | 事实诚实和安全隔离 |
| sensitive ref | 把 ref 当 raw secret 或 URL | 只允许 opaque ref/locator；secret material 永不进入普通配置 | redaction 和审计边界 |

## 4. 结构化中间产物

### 4.1 配置类别表

| 配置类别 | 含义 | 示例 | 生效方式 | 主要风险 |
|---|---|---|---|---|
| `static_design_boundary` | 设计不变量声明，不是可覆盖 key | truth owner、state matrix、no-write、redaction mandatory | `static` | 被误做开关会绕过架构/安全红线 |
| `startup_assembly` | 决定 profile、store、binding、builder graph 和 marker | profile ref、store/adapter binding、redaction profile | `startup` / `new_assembly` | 中途变化破坏 UoW、basis、依赖一致性 |
| `job_run_start_policy` | 每个 Job 启动时冻结的 bounded policy | page/batch/read budget、timeout/retry policy、claim window | `job_run_start` | job 中途变更会使 report 不可复核；retry 可能重放副作用 |
| `entry_local_selector` | 当前 command/query/job 的局部选择，不是全局覆盖 | config source selector、profile selector、dry-run/read-only selector | `entry_start` | 被用来携带 protocol metadata 或绕过全局验证 |
| `sensitive_ref` | 只保存 secret/endpoint/credential 的 opaque locator/ref | adapter credential ref、handoff target ref | `startup` / `job_run_start` | raw secret、URL、credential 泄露 |
| `diagnostic_redaction` | 安全摘要、日志/metric 低基数和 forbidden-field policy | redaction profile ref、safe telemetry binding | `startup` | 关闭/放宽会泄露 raw body/secret |
| `test_deterministic` | local/CI 的 fake adapter、fixed clock/id/digest、fixture profile | deterministic provider ref | `test_startup` | fake 渗入 production-like 或伪造 owner success |
| `peripheral_feature_request` | 请求或禁用外围 safe view、diagnosis、archive reference 等 | feature marker | `startup` | 被误用开启 reserved consumer/owner truth |

### 4.2 生效方式矩阵

| 生效方式 | 适用域 | 当前允许 | 失败处理 |
|---|---|---|---|
| `startup` | runtime/stores/bindings/observability/determinism/features | 是 | whole snapshot reject 或 builder blocked；不回退低优先级非法值 |
| `new_assembly` | 任何需替换 provider/builder 的配置 | 是，逻辑语义 | 创建新 marker/builder；不原地改变已暴露 truth |
| `job_run_start` | limits、job policy、外部 read budget | 是 | 当前 job rejected/blocked；已 claim 的 job 不热改 |
| `entry_start` | entry-local selector | 是 | 当前入口 rejected；不写全局配置 |
| `test_startup` | deterministic fake/fixture | 仅 test profile | profile mismatch fail-fast |
| `hot` / `reload` | P0 全部核心域 | 否 | `UnsupportedConfigReload`/reject-new-value；保持当前 snapshot |
| `static` | 设计不变量 | 不是普通配置 | 需要回写 00/01/02/03 与设计评审 |

### 4.3 按配置域组织的分类边界

| 配置域 | 适用类别 | 不适用类别 | 域内禁止项 | 03 影响 |
|---|---|---|---|---|
| `runtime` | startup_assembly、entry_local_selector | test_deterministic（仅由 profile 引用） | 改变 profile enum、truth、state 或 readiness | 无回写 |
| `stores` | startup_assembly、sensitive_ref、test_deterministic | hot/reload、peripheral feature | raw DSN/path、共享 owner store、无保障 fallback | 无回写；`RUN-DDD-003` |
| `bindings` | startup_assembly、sensitive_ref、test_deterministic | hot/reload | private backend、SDK method、raw endpoint/body/secret | 无回写；`RUN-UP-*` |
| `limits` | job_run_start_policy、entry_local_selector | hot/reload、static override | unlimited/zero bypass、删除 unresolved、auto replay | 无回写；数值 authority pending |
| `observability` | diagnostic_redaction、startup_assembly、sensitive_ref | hot/reload、feature bypass | 关闭 mandatory redaction、evidence/report creation | 无回写；`RUN-UP-005` |
| `determinism` | startup_assembly、test_deterministic | production fake、hot/reload | ad hoc ID/time/digest、raw input hash | 无回写 |
| `features` | peripheral_feature_request、startup_assembly | static truth override、hot/reload | enable reserved positive path/owner mutation | 无回写 |

### 4.4 禁止配置化项表（VETO）

| 禁止配置化项 | 原因 | 如需改变应走什么流程 |
|---|---|---|
| implicit `latest/default/newest/tag/branch` 或 mutable version | 破坏显式 immutable Release/version、generation 和 traceability | 回到 00/02/03 selection contract；更新 schema/state/tests |
| 本地批准/基线/撤销/过期 override | Runner 无 Artifact/Governance truth ownership | 上游 owner contract + 03 authority seam |
| integrity/signature/manifest/platform gate bypass | 未验证材料可能进入 run | 00/03/上游 Artifact 合同和验收门禁 |
| `Complete/Verified/Qualified`、`Accepted/Running`、`Confirmed/Cleaned` 合并 | 破坏多轴 state matrix | 回到 02/03 状态和 flow；不得用 flag 修复 |
| Query/render/reconnect write/refresh/reconcile | 破坏 no-write 和恢复边界 | 修改 03 protocol/flow，不能加 config switch |
| expected-version/generation/lease/protection guard 关闭 | 可能造成 stale write、误删或重放 | 修改 03 consistency/guard contract |
| Unknown/commit-unknown 自动 replay/resend/reclaim/resume | 可能重复副作用 | 修改 03 recovery/idempotency contract；当前永久禁止 |
| raw payload/log/body/secret/host path/PID/port 入普通配置或记录 | 泄露和事实越界 | 安全/观测设计重开；当前 reject |
| local log/receipt/report/handoff → formal audit/evidence/verdict/signoff | Runner 不拥有正式证据真相 | Observability/06 合同重开 |
| private sibling DB/bus/Sandbox backend 或 package path | 绕过 SDK/public boundary 和全局依赖规则 | 公开 SDK/API/adapter 合同 + 依赖裁剪 |
| outbound event/outbox/topic 由 feature flag 创建 | 当前 Runner outbound event=0 | 回退 00～03/正式事件合同；当前 reject |
| production fake/in-memory fallback | 把测试语义伪造成真实能力 | 07/技术 authority 选定真实实现后重开 |

### 4.5 分类边界停审与跨分类审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 每域适用类别是否明确 | pass | 七域矩阵已登记 |
| hot/reload 是否误开 | no | P0 全面拒绝；新 builder 代替原地修改 |
| static invariant 是否混入普通配置 | no | VETO 表明确回写路径 |
| test fake 是否可进入 production-like | no | profile mismatch fail-fast |
| sensitive ref 是否可变成 raw secret | no | Step 8 再做零泄露审计 |
| limits 是否有无限/零值绕过 | no | finite/required/authority-pending |
| feature 是否可启用 reserved positive path | no | availability/contract gate 必须独立 |
| 是否影响 03 代码契约 | no | 只收口配置类别/边界 |

## 5. 回填草稿（未来正式 §4）

Runner 配置分为静态设计不变量、启动装配、Job 启动策略、入口局部选择、敏感引用、诊断/脱敏、测试确定性和外围 feature request。P0 核心配置 startup-only；Job policy 在 job start 固化；热更新和原地 reload 不支持。truth ownership、显式版本、状态迁移、no-write、idempotency/no-replay、guard、redaction、证据边界和依赖方向均为禁止配置化项。

## 6. 待确认事项与进入下一步条件

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| concrete reload/hot design | 未来运维体验 | P0 reject；若要引入先回写 03/04 |
| numeric bound authority | limits 默认/范围 | required/authority-pending，不设隐式无限/零 |
| exact secret provider | sensitive_ref 解析 | 只保存 opaque ref；解析失败 fail-closed |

| 进入 Step 5 条件 | 结论 |
|---|---|
| 类别表和生效方式完成 | pass |
| 每域禁止项完成 | pass |
| VETO 与 00/01/02/03 红线可回指 | pass |
| 跨分类无 unresolved 冲突 | pass |
| 无 `待回写`/`阻塞待确认` 的 03 影响 | pass |

Step 4 完成，允许进入 Step 5；正式 04 仍不可写。
