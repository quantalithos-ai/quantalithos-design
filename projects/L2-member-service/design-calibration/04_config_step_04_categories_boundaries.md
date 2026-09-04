# Step 4：定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节：未来正式 `04-配置设计.md` §4“配置分类与边界”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_04_categories_boundaries.md`
> 执行模式：full-restart；旧材料仅用于 historical_material / 污染审计
> 完成日期：2026-09-02

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 4 定义配置分类与禁止配置化边界 |
| 当前模块 | `categories_boundaries` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 用户授权 | “完成全部的 04”授权继续 Step 4~15；不授权实现、测试执行或 commit |
| 正式 `04` 写入 | `false`；仅在 Step 15 装配 |
| 实现 / 证据 | `false`；不产生实现、测试结果、artifact、report、evidence、verdict、signoff 或 readiness |
| commit | `false` |

### 1.1 Step 内计划

- [x] 读取 ledger、flow、Step 1~3、`00/01/02/03`、配置 SOP / 书写规范与 L1-governance 参考。
- [x] 分类启动、job-run-start、entry-local、敏感、诊断、测试和外围启用配置。
- [x] 明确 startup / 冷更新、job-run-start、entry-local 与 P0 禁止 hot update 的边界。
- [x] 列出 Host Truth、状态、事务、幂等、审计、安全和外部 owner 的禁止配置化项。
- [x] 按 Step 3 功能域建立适用 / 不适用类别矩阵。
- [x] 完成跨分类审计、`03` 影响判定、回填草稿和停审自检。

## 2. 本步输入

| 输入 | 状态 / 效力 | 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | `completed / pass_with_upstream_blockers` | 控制面、功能域和来源链基线 |
| `04_config_step_01_upstream_boundary.md` | `completed / pass_with_upstream_blockers` | 上游 owner、历史污染和禁止越界 |
| `04_config_step_02_scope.md` | `completed / pass_with_upstream_blockers` | P0/P1/P2 范围与有配置项目判定 |
| `03-详细设计.md` §3、§7、§9~§15 | 正式直接输入 | state、UoW、幂等、错误、观测、builder 和不可配置化不变量 |
| `03_ddd_step_14_config_dependencies.md` | 字段级直接输入 | config section、读取层、adapter / fake / blocked seam |
| `L1-governance` Step 4 | 只读粒度参考 | 分类表、更新边界、禁止项和停审格式 |

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 当前有哪些启动、运行时、策略、敏感和调试配置？ | 启动配置包括 profile、logical store、adapter availability、topic-neutral binding、redaction 与 clock/id；job-run-start 包括 batch、parallelism、timeout、retry 和目标可用性快照；entry-local 只包括当前入口的 source / profile selector、受限输出路径和 dry-run 诊断；policy-like 只表示技术旋钮，不表示治理策略；敏感配置只保存 opaque ref；诊断配置只控制安全输出；`deterministic_fixture.*` 仅用于 `ci-test` / `operations-replay`，`local-dev` 只用普通 fake / placeholder，`integration-like` 只走 controlled seam。 |
| 哪些配置可以热更新？ | P0 不允许核心 hot update。store、adapter、publisher、handoff、redaction、幂等、边界和 feature 配置通过重启生效；job 参数在新 run 开始时冻结；entry-local 仅对当前调用生效。未来 hot reload 必须先回写 `03` 的 lifecycle、builder、rollback 和审计契约。 |
| 哪些配置只能冷更新或启动读取？ | logical truth / maintenance store、resolver、Member / Images / Runtime / Sandbox ref-bearing seam、carrier availability marker、publisher / handoff target、redaction deny list、feature peripheral enablement、clock/id adapter 和安全边界均为 startup/cold；P0 缺失或非法时 fail-fast。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化？ | ProjectMemberRef 执行主语、GlobalMemberRef 身份锚、Host Truth owner、状态矩阵、generation fence、expected revision、UoW 写集、command metadata、幂等与 stored replay、Query no-write、Job no-authorization、四层 handoff、forbidden-body、redaction deny list 放宽、外部 owner truth 以及 compile/runtime/event/ref/adapter/fake 分类。 |
| 禁止项如需改变应走什么流程？ | 必须修改相应 `00/01/02/03` 正式设计和 ADR，再同步配置、测试、验收、实施与运维；不能由 JSON、env、profile 或 feature flag 静默改变。 |
| 每个配置域的分类是否明确？ | 已完成见 §7。每个域至少有适用类别、不适用类别、更新时机、禁止项和失败上限。 |
| 是否存在同一行为在多个分类中含义不同？ | 已收敛：retry / timeout / batch 是技术旋钮；feature 只能控制外围 emission / export；`deterministic_fixture.*` 仅 `ci-test` / `operations-replay`；任何分类都不能改变 accepted truth。 |

## 4. 当前材料诊断

| 位置 | 问题 | 本 Step 修正 |
|---|---|---|
| Step 3 控制面表 | 已有功能域，但没有区分启动、job-run-start、entry-local 与 static boundary | 建立分类与更新时机表 |
| `03` §13 | 禁止配置化规则散落在状态、UoW、幂等和依赖段落 | 汇总为可执行的禁止项和变更流程 |
| 旧 README / 旧 `05/06` | 可能把容器、心跳阈值、数据库和产品开关误当 P0 配置 | 降级为历史审计，不继承产品和数值 |
| 兄弟 seam | unresolved contract 容易被 feature flag 伪装成 ready | 对应域只允许 placeholder / disabled / blocked / unknown |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 类别 | 只有“可配置 / 不可配置”粗粒度 | static、startup、job-run-start、entry-local、technical、sensitive、diagnostic、fixture、peripheral | 支撑来源优先级和配置项逐域收口 |
| 更新时机 | 未定义 | P0 核心只支持 startup/cold、new-job-run、entry-local；hot update 明确不适用 | 避免运行中修改状态和 adapter 语义 |
| 禁止项 | 分散于 00~03 | 形成 owner、原因、违规处理和正式设计变更路径表 | 防止配置越界 |
| 上游缺口 | 可能被开关掩盖 | 统一映射为 blocked / waiting / unknown / disabled | 保持 truth 诚实 |

## 6. 配置设计取舍

| 议题 | 方案 | 采用结论 |
|---|---|---|
| P0 是否支持 hot reload | 支持运行中替换 / 仅重启或新 job run | 采用后者；当前 `03` 没有在线替换和 LKG 合同 |
| technical knob 是否等于 policy | 等同治理策略 / 仅 retry、timeout、batch、retention 等执行参数 | 采用后者；治理规则和裁决不配置化 |
| feature flag 能否关闭核心 command | 可以 / 只控制外围发布、handoff、派生维护和可选诊断 | 采用后者；accepted path、幂等、审计和安全检查不可关闭 |
| deterministic fixture 能否用于非 test/replay profile | 可以复用 / 仅 `ci-test`、`operations-replay` | 采用后者；`local-dev`、`integration-like` 与 future profile 必须拒绝 `deterministic_fixture.*`；普通 fake / placeholder 另按 profile 规则处理 |
| 禁止项是否可由配置审批修改 | 可以 / 必须走正式需求、架构、详细设计变更 | 采用后者；配置不是架构决策入口 |

## 7. 结构化中间产物

### 7.1 配置分类表

| 配置类别 | 说明 | 目标域示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| `static-design-boundary` | 设计不变量，不是普通配置 | 主语、owner、状态、UoW、Query no-write、Job no-authorization | 不适用 | 被当作开关会绕过设计红线 |
| `startup-runtime` | 启动解析、校验并冻结 | profile、store、resolver、adapter、topic binding、redaction、clock/id | P0 不允许 | 中途替换会破坏一致性和可复核性 |
| `job-run-start` | 每次 job run 开始时冻结 | batch、parallelism、timeout、retry、target availability snapshot | 不属于 hot update | 运行中变化会使 report 无法复核 |
| `entry-local` | 当前 API / worker / job 调用的局部选择 | config source、profile selector、request source、dry-run selector | 仅当前调用 | 覆盖全局安全边界或协议 metadata |
| `policy-like-technical` | 执行技术旋钮，不是治理策略 | retry、backoff、retention、page / batch limit | startup 或 job-run-start | 被误写为 shared rule 或业务阈值 |
| `sensitive-ref` | 只保存 opaque ref，真实秘密由安全设施处理 | credential、DSN、endpoint、handoff target ref | P0 不允许 raw hot update | raw secret 进入配置、日志、错误或审计 |
| `diagnostic-redaction` | 控制 safe output 和 forbidden-field 扫描 | deny list、label allowlist、诊断开关 | startup 冻结 | 放宽导致正文或高基数泄露 |
| `test-fixture-deterministic` | `ci-test` / `operations-replay` 可复现的 fixture、clock、id、seed | deterministic fixture、fixed clock/id、脱敏 replay input | test entry 或 replay job-run-start | 进入 `local-dev`、`integration-like` 或 future profile 伪造外部完成 |
| `feature-peripheral` | 控制外围能力的启用 | publisher、handoff、derived projection、可选观测 | startup 冻结 | 误关核心 sidecar 或 accepted audit |

### 7.2 更新时机边界表

| 时机 | 允许内容 | 禁止内容 | 生效规则 |
|---|---|---|---|
| `static / design-time` | truth boundary、状态矩阵、协议 schema、依赖分类 | JSON / env / flag 值 | 只通过正式设计和版本变更生效 |
| `startup / cold` | profile、stores、seams、targets、redaction、clock/id、外围 feature | 启动后无审计替换核心 adapter / store | restart 后重新 parse、validate、assemble |
| `job-run-start` | batch、parallelism、timeout、retry、目标可用性快照、selector | 改 scope、actor、generation、idempotency key 或 mutation semantics | 新 run 冻结并写入 job report 语义 |
| `entry-local` | source selector、受限 profile selector、dry-run、输出路径 | 覆盖 global config、scope、actor、metadata、状态和权限 | 只对当前 entry 有效 |
| `hot-runtime` | P0 无 | store、adapter、topic、redaction、幂等和状态规则 | 输入直接拒绝；未来需先回写 `03` |

### 7.3 禁止配置化项表

| 禁止项 | 原因 | 设计来源 | 违规处理 |
|---|---|---|---|
| `ProjectMemberRef` 执行主语 / `GlobalMemberRef` 身份锚 | 防止用 GlobalMember、endpoint 或 backend ID 替代正式范围 | `00` BR-MS-002、BR-MS-049；`03` command guard | validator reject；需改 `00/01/02/03` |
| Host Truth owner 和第二写源 | 防止 Runtime、Member、Sandbox、backend 或配置文件反写宿主事实 | `00` D / BR-MS-049；`01` owner 表 | design reject |
| domain state matrix / generation fence | 防止 profile 改变合法迁移或旧 generation 覆盖 current | `03` §10、§13 | validator reject；回到状态设计 |
| expected revision、UoW ordering、rollback 语义 | 防止关闭并发保护或局部提交 | `03` §11~§13 | validator reject；禁止 feature 绕过 |
| command metadata、幂等 key、stored replay | 防止 accepted mutation 无法恢复或重复执行 | `03` §7、§13 | entry reject；不提供 disable 开关 |
| Query no-write、Job no-authorization | 防止查询或维护任务变成隐式 command | `02`/`03` query/job flow | design reject；忽略配置尝试 |
| accepted history/material/outbox/audit | 防止已提交事实不可追溯或不可传播 | `03` §9、§11、§14~§15 | startup/config reject |
| outbox payload snapshot 来源 | 防止 publisher 从 current truth 临时重建正文 | `03` §8、§11 | design reject；不得提供 `rebuild_payload` 开关 |
| 四层 handoff (`submitted/delivered/observed/accepted`) | 防止 receipt、timeout 或 adapter `Ok` 越级 | `00` BR-MS-043；`03` §9 | fail-closed；保持 unknown/gap |
| forbidden body、raw secret、manifest、endpoint secret | 防止外部正文和敏感材料进入本仓 | `00` BR-MS-049；`03` §14~§15 | fail-closed；拒绝加载或输出 |
| Identity / Work / Images / Runtime / Sandbox / Governance truth | 外部 owner 不由配置取得 authority | `00` NG-MS-001~005、BR-MS-009/013/024 | 只允许 ref / safe summary / placeholder |
| event kind、schema、topic-neutral key | transport route 不应改变公共语义 | `03` §8、MSVC-UP-007 | route/schema 未闭合则 blocked |
| compile/runtime/event/ref/adapter/fake 分类 | 运行期协作不应变成源码耦合 | `00` BR-MS-048；`03` §3、§13 | implementation gate reject |
| fake semantic shortcut | fake 不能跳过 revision、state、marker、rollback 或 body guard | `03` §12.5 | test/profile reject |

### 7.4 按配置域组织的分类边界表

| 配置域 | 适用类别 | 不适用类别 | 冻结边界 | 关键禁止项 |
|---|---|---|---|---|
| `profile` / `config_identity` | startup、entry-local selector、`ci-test` / `operations-replay` deterministic fixture guard | hot、业务 policy | startup 后 profile 不变 | 不改主语、owner、状态 |
| logical truth stores | startup、sensitive ref | hot、entry-local store swap | 每个 logical owner 独立绑定 | 不改 schema、revision、UoW |
| maintenance stores | startup、job-run-start retention / selector | query-time repair、hot | history/material/outbox/projection/replay 分域 | 不删除历史、不从 current truth 组包 |
| qualification / resolver | startup、sensitive ref、ordinary fake / placeholder 或 `integration-like` controlled seam | business policy、hot、`deterministic_fixture.*` 覆盖 | unresolved 保持 blocked/unknown | 不复制 Identity/Work/Images truth |
| member / images / runtime / sandbox ref-bearing seam | startup、feature peripheral | hot、正向 truth flag | availability 只表达 ref-bearing seam | 不伪造 register、manifest、run、policy、cleanup complete |
| carrier availability marker | startup、feature peripheral | hot、carrier ready / release flag | 只表达 availability marker | 不定义 carrier ref、release、backend 或 cleanup complete |
| registration / session / health | startup、job-run-start assessment knobs | state override、hot | signal 与 assessment 参数按 run 冻结 | 不把进程存活当 healthy |
| publication / handoff | startup、job-run-start retry/target snapshot | event semantics、hot | each target/layer 独立 | 不由 receipt 推导 delivered/accepted |
| operations jobs | startup、job-run-start | authorization、decision、generation | job 只选择已提交 work | 不创建 intent / decision / key |
| safe read / boundary | startup、entry-local read limit | actor/visibility override、hot | body-free、query no-write | 不刷新、修复或反写 source |
| security / redaction | startup、diagnostic | hot relax、raw secret | deny list 只收紧 | 不放宽 forbidden body / labels |
| clock / id / fixture | startup；`ci-test` test fixture / `operations-replay` replay fixture | handler/domain synthesis、hot、非允许 profile 的 `deterministic_fixture.*` | Port 注入且可复现 | 不把时间当 revision/cursor |

### 7.5 跨分类 / 禁止项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| retry / timeout / batch 是否被误归入 Governance Policy | 否 | 只归 technical / job-run-start；shared policy 继续外置 |
| feature enablement 是否能关闭 accepted path | 否 | 只允许外围 publisher、handoff、projection、diagnostic |
| `deterministic_fixture.*` 是否能进入 `local-dev`、`integration-like`、staging-like / production-like | 否 | profile validator 拒绝；普通 fake / placeholder 与 controlled seam 不等同于该配置域 |
| entry-local 是否覆盖全局 actor/scope/metadata | 否 | 仅 selector、路径和 dry-run；协议 metadata 来自 envelope |
| sensitive ref 是否与普通字符串混淆 | 否 | Step 8 单独处理；raw secret 直接拒绝 |
| 不同域是否重复拥有 readiness / health | 否 | 域只拥有配置 binding；业务结论仍由 domain/application 形成 |
| hot update 是否绕过 rollback / audit | 否 | P0 统一 reject；未来需回写 `03` |

## 8. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 将 Step 3 功能域映射到 startup、job-run-start、entry-local、sensitive、diagnostic、fixture、peripheral | 否 | 配置分类组织 | 不适用 | 无回写 |
| P0 核心不支持 hot update；通过 restart / 新 job run / 当前 entry 生效 | 否 | 既有 builder 与 entry 约束的配置表达 | 不适用 | 无回写 |
| 禁止配置化项汇总并标注违规处理 | 否 | 复用 `03` 已有 state / UoW / idempotency / handoff 红线 | 不适用 | 无回写 |
| 未来增加 hot reload、online LKG、动态 adapter replacement 或新配置字段 | 是 | builder lifecycle / Port / error / flow 契约 | `03` §4、§7、§13 及对应 Step | 阻塞待确认（当前不进入 P0） |
| 通过 profile 改变主语、状态、幂等、Query no-write 或 handoff 层级 | 是 | 破坏详细设计不变量 | `03` §3、§9~§14 | 设计拒绝；不得进入正式 `04` |

## 9. 回填草稿：正式 `04-配置设计.md` §4

> 校准来源：
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读：
> - 建议阅读本文件的“配置分类表”“更新时机边界表”“禁止配置化项表”“按配置域组织的分类边界表”和“跨分类 / 禁止项审计表”。

正式 §4 仅回填：

1. static design boundary、startup runtime、job-run-start、entry-local、policy-like technical、sensitive ref、diagnostic/redaction、test fixture 和 feature/peripheral 九类配置。
2. P0 核心配置不支持 hot update；startup 配置重启生效，job 参数在新 run 开始时冻结，entry-local 只作用于当前调用。
3. 配置不能改变 ProjectMemberRef / GlobalMemberRef 双锚、Host Truth owner、状态、generation、UoW、幂等、Query no-write、Job no-authorization、四层 handoff、redaction 和外部 truth owner。
4. unresolved sibling / backend seam 只允许 placeholder、disabled、blocked、unknown、degraded 或 fail-closed。

## 10. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 是否未来支持 hot reload / online LKG | 影响 builder、rollback、audit 和 in-flight 语义 | P0 直接拒绝 hot update；若立项先回写 `03` |
| policy 传递 owner 与 launch credential owner | 影响 sensitive ref 和 qualification 分类 | 只保存 opaque ref；owner pending |
| durable / observability / DLQ 产品 | 影响 startup binding 和 P1/P2 technical knobs | product-neutral；P0 fake / in-memory / disabled |
| Core/Bus exact schema 与 topic mapping | 影响 publication / handoff 分类 | topic-neutral placeholder；不写 route / receipt |

## 11. 进入下一步条件与自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 配置类别覆盖 Step 3 所有功能域 | pass | 见 §7.4 |
| 更新时机、热更新边界明确 | pass | P0 核心无 hot update |
| 禁止配置化项可执行且有正式变更路径 | pass | 见 §7.3 |
| fixture、feature、technical knob 未越过业务不变量 | pass | 见 §7.5 |
| sibling / backend blocker 未伪装 ready | pass_with_upstream_blockers | 保持 placeholder / blocked / unknown |
| `03` 影响已判定 | pass | 当前 P0 无需回写 |
| 正式正文污染检查 | pass | 仅形成回填草稿，未创建正式 `04` |
| 下一门禁 | pass_with_upstream_blockers | 允许进入 Step 5 来源优先级与冲突处理 |

## 12. Step 4 停审结论

```text
step_04_status = completed / pass_with_upstream_blockers
step_04_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_05_sources_priority_conflicts
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
