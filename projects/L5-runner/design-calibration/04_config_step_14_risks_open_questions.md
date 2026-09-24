# Step 14. 定义风险与待确认事项

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 14
> 书写规范：`standards/document/配置设计书写规范.md` §5.14
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 回填章节：`04-配置设计.md` §14
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_14_risks_open_questions.md`、`projects/L5-console/design-calibration/04_config_step_14_risks_open_questions.md`
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与门禁结论

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 14 |
| current_module | `risks:open_questions_and_03_impact_audit` |
| gate_status | `pass_for_step_15` |
| gate_reason | Step 1～13 的风险、待确认事项、持续 blocker、当前 03 影响与未来设计触发器已完整汇总；当前正式配置合同不存在 `待回写` 或 `阻塞待确认`。 |
| formal_04_write_allowed | `true_step_15_only` |
| formal_05_write_allowed | `false` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 `04_config_step_15_formal_document_assembly.md`，full-restart 装配正式 `04-配置设计.md` |

门禁结论：外部、物理、文档和运维 blocker 没有被关闭，也不能由配置关闭；它们已被约束为 `blocked`、`pending`、`disabled`、`unknown`、`unsupported` 或 `authority-pending`，不会被写成正向 readiness。当前 Step 1～13 只细化 03 已有的 profile、ref、limit、policy、builder 和安全边界，没有新增当前 runtime config 字段、builder 参数、port、DTO、error、flow 或 state，因此允许进入 Step 15。

## 2. 本步目标、输入与非目标

### 2.1 目标

- 汇总仍影响实现、测试、验收、集成、运维或生产化的风险。
- 为每项风险和待确认事项标出影响范围、确认方及未确认前处理。
- 逐 Step 审计 Step 1～13 对 `03-详细设计.md` 的影响。
- 区分当前正式合同与未来设计触发器，防止 future 候选污染 P0 schema。
- 判定是否满足 Step 15 正式装配门禁。

### 2.2 输入

| 输入 | 本步用途 |
|---|---|
| `04_config_step_01_upstream_boundary.md` ～ `04_config_step_13_migration_deprecation_evolution.md` | 汇总来源、profile、配置项、敏感边界、加载、变更、失败、下游与演进风险 |
| `03_ddd_step_18_risks_open_questions.md` | 继承 `RUN-UP-*`、`RUN-DDD-*`、`RUN-DOC-*`、`RUN-OPS-*` 的精确定义与影响范围 |
| `03-详细设计.md` §13～§17 | 核对配置绑定、观测、安全、实施前置和正式 blocker |
| 配置 SOP 与书写规范 | 执行 Step 14 回写清单和 Step 15 禁入条件 |
| `project_execution_ledger.md` | 核对当前文档顺序、授权范围和持续 blocker |

### 2.3 非目标

- 不关闭任何未由 owner/authority 提供事实的上游、物理或运维 blocker。
- 不选择实现仓、语言、GUI/CLI shell、store/cache、parser、secret provider、SDK 方法、endpoint 或部署机制。
- 不新增配置项、alias、profile、默认数值、hot reload、remote config 或 online LKG。
- 不创建正式 `04-配置设计.md`；正式写入只在 Step 15。
- 不创建 05～07 calibration、implementation ledger、boundary skeleton、代码、测试或证据。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些配置问题仍可能影响落地？ | 目标仓与技术栈未定、local store/cache guarantees 未选、上游 owner/SDK exact seam 未闭合、外部配置文档 delivery/selector 未定、数值 workload authority 未定、真实 sensitive resolver 与正式配置审计 owner 未定。 |
| 哪些事项阻塞测试、验收、实施或运维？ | `RUN-DOC-002` 阻塞新版测试/验收移交，`RUN-DOC-003` 阻塞实施计划和代码开工；`RUN-DDD-*` 阻塞物理落码；`RUN-UP-*` 阻塞对应正向集成；`RUN-OPS-*` 阻塞真实 integration/production evidence 与运维验收。它们不阻塞当前 fail-closed 配置合同装配。 |
| 谁需要确认？ | 用户/架构 authority、实现计划维护者、L0-sdk 与各 truth owner、平台/安全/运维 authority、测试与验收维护者、配置/release owner。 |
| 未确认前如何处理？ | 保持技术中立、单一严格 JSON、opaque refs、无生产默认数值、per-slot blocked/unsupported、redaction fail-closed、Unknown/no-replay、whole-document/new-assembly；不得 fake/private/LKG fallback。 |
| 哪些当前配置结论改变了 03 代码契约？ | 无。当前七域 schema 只序列化和约束 03 已存在的 semantic binding/policy seam。 |
| 是否存在需要先回写 03 的事项？ | 当前没有。未来若启用 remote/admin config、hot reload、online LKG、真实 secret provider callable contract、新 slot/profile/public error/DTO/flow/state，必须先回写 03，再重开相关 04 Step。 |

## 4. 当前问题诊断、改动前后与取舍

| 议题 | Step 14 前的分散状态 | 本 Step 收口 | 取舍依据 |
|---|---|---|---|
| 外部 blocker | 分布在 Step 1～13 的域内停审 | 统一保留 `RUN-UP-001~008`，明确只阻塞对应 positive surface | 配置存在不能产生 owner contract/readiness |
| 物理 blocker | repo/技术/store 决策散落 | 统一保留 `RUN-DDD-001~003` | 04 只能定义语义配置，不能伪造落码事实 |
| 下游文档 | 旧 05/06 与不存在的 07 容易被误当可承接事实 | `RUN-DOC-001` 仅待 Step 15；`RUN-DOC-002/003` 持续开放 | 严格 `00→…→07` 串行与 full-restart |
| 运维/证据 | telemetry、真实 integration 未选 | 保留 `RUN-OPS-001/002`，不把 local marker 升级 evidence | Runner 不拥有 Observability truth |
| 03 影响 | 每 Step 各自记录 future 触发器 | 当前结论全部 `无回写`；future 单列为 reopen trigger | 避免把未进入 schema 的未来能力误标成当前 blocker |
| 数值 | demo 中存在 `1` | 固定为 parser/type fixture；真实值 authority-pending | 不伪造 workload、SLO 或验收阈值 |
| 正式装配 | 正式 04 不存在 | Step 14 只开放 Step 15 写权限，不提前写正文 | 遵守中间产物先于正式文档 |

关键取舍：Step 15 的门禁要求不是“所有外部能力已经 ready”，而是“正式配置结论内部闭合、事实诚实、没有未处理的当前 03 契约变化”。因此保留 blocker 与允许装配并不矛盾；正式 04 的状态必须是 `completed_with_upstream_blockers`，不能写成 implementation-ready 或 product-ready。

## 5. 结构化中间产物

### 5.1 风险与 blocker 表

| ID | 风险 | 影响 / 阻塞范围 | 缓解与未确认前处理 | 负责人 / 待确认方 |
|---|---|---|---|---|
| `RUN-UP-001` | Artifact 缺完整可下载 Release consumption object、locator/transport、integrity manifest、digest/signature、revoke/expire 合同 | 阻塞真实取得、验证、资格判定和 cache promotion | 只保留 opaque binding、显式版本和 fail-closed；不猜 API/算法/locator | Artifact owner、L0-sdk |
| `RUN-UP-002` | Governance approval/baseline authority chain、scope、expiry/revoke/conflict 未闭合 | 阻塞 approved/baselined 正向 gate | 未验证即 Blocked/Stale；配置不得本地批准或绕过 | Governance owner、L0-sdk |
| `RUN-UP-003` | Sandbox request、幂等、lease、断线、orphan/reaper、cleanup handoff 合同未闭合 | 阻塞正式 run/control/cleanup 集成 | `accepted != running`；Unknown/RecoveryCase/query-first；不接私有 backend | Sandbox owner、L0-sdk |
| `RUN-UP-004` | Runtime 端侧安全 read/status/result/recovery surface 未闭合 | 阻塞 Running/outcome 正向投影 | 仅 safe read seam；不从 ACK/PID/log 推断 execution truth | Runtime owner、L0-sdk |
| `RUN-UP-005` | Observability safe diagnostic DTO、handoff、visibility/freshness/retention seam 未闭合 | 阻塞正式诊断交接与 evidence | redaction fail-closed；本地日志/marker 不升级 evidence | Observability owner、L0-sdk |
| `RUN-UP-006` | Archive 正向 reference/restore 协作合同未闭合 | 阻塞 Archive 外围能力，不阻塞 run/cleanup 核心成功 | feature 默认 false；requested 时显式 Blocked | Archive owner、L0-sdk |
| `RUN-UP-007` | 跨平台 resource/port probe、Sandbox allocation 与 cleanup 责任未统一 | 阻塞真实平台 adapter 与跨平台验收 | bounded observation + fail-closed；不写 PID/port/path/平台数字 truth | Platform/Sandbox owners |
| `RUN-UP-008` | L0-sdk exact client/version/error/redaction/trace surface 未核验 | 阻塞 compile/runtime integration | SDK-first、semantic adapter、safe issue；不猜 package/method/version | L0-sdk owner |
| `RUN-DDD-001` | 目标实现仓 `/home/aris/Projects/quantalithos-runner` 不存在 | 阻塞源码、manifest、构建与测试开工 | 不创建、不伪造路径/baseline/commit；等待 07 前置 | 用户、实施计划维护者 |
| `RUN-DDD-002` | language/runtime/GUI-CLI shell/process/packaging 未获 authority | 阻塞物理模块、入口、命令和配置 delivery 实现 | 04 保持技术中立；不继承 Rust/Tauri/Docker | 架构 authority、用户 |
| `RUN-DDD-003` | local store/cache atomicity、locking、migration、corruption repair 未定 | 阻塞 durable store/cache adapter | 只定义 required guarantees 与 logical refs；不写 backend/DSN/path | 架构/平台/安全 authority |
| `RUN-DOC-001` | 正式 `04-配置设计.md` 尚未创建 | Step 15 前阻塞正式配置移交 | 只在 Step 15 full-restart 装配；成功后关闭该项 | 配置文档维护者 |
| `RUN-DOC-002` | 旧 `05/06` 未按新版 03/04 full-restart | 阻塞正式测试/验收移交和 evidence/verdict | 04 只给输入；等待用户授权后逐文档重写 | 测试/验收维护者、用户 |
| `RUN-DOC-003` | `07-实施计划.md` 未生成 | 阻塞 implementation ledger、boundary skeleton、phase/commit 和代码开工 | 当前不提前创建；等待 05/06 串行完成 | 实施计划维护者、用户 |
| `RUN-OPS-001` | durable telemetry/DLQ/diagnostic store/SLO 未选 | 阻塞 production observability 与验收 evidence | 只定义 safe marker/低基数字段；不生成 report/evidence | 运维/测试/infra authority |
| `RUN-OPS-002` | 真实 sibling integration 环境与 external GRC target 未定 | 阻塞真实 integration acceptance | fake/fixture 仅 `test-deterministic` 且显式；不写产品格式 | 相邻 owner、运维/测试 authority |

### 5.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 目标实现仓、语言、shell、process、packaging | 无法落定 parser、文件、入口和启动方式 | 用户、架构/实施 authority | `RUN-DDD-001/002` 保持；04 只写逻辑模块与生效语义 |
| local store/cache backend 与 guarantees | 无法证明 durable composition | 架构/平台/安全 authority | required refs + capability marker；不足即 builder Blocked |
| host 如何交付/选择完整 JSON 文档 | 07/09 无实际 path/env/CLI/command | host/实施/运维 authority | 只定义 source-of-source selector；不得叶级覆盖 |
| exact owner/SDK binding 与 required product slot set | integration/product 无正向 readiness | 各 truth owner、L0-sdk、架构 authority | per-slot configured/blocked；不直接复用私有实现 |
| production limits、hard caps 与 horizons | 无合法 product 数值 | workload/security/platform、测试/验收 authority | required/authority-pending；demo `1` 禁止迁移 |
| sensitive resolver/provider、material 生命周期与轮换审计 owner | 无真实 secret/provider 接入 | 安全/运维/L0-sdk/实现 authority | JSON 仅 opaque ref；provider 不可用 fail-closed；new assembly 轮换 |
| config artifact/version/digest 与正式审计 owner | 无真实变更/回滚记录 | configuration/release/运维 authority | Runner 只产 safe local marker；不伪造 artifact/digest/audit |
| 新版 05/06/07 的启动时点 | 当前无测试、验收、实施可信闭环 | 用户及对应文档维护者 | Step 15 后停审；未经确认不进入 05 |
| telemetry/DLQ/diagnostic/SLO 与真实 integration 环境 | 无 production evidence/acceptance | 运维/测试/owner authority | 保持 `RUN-OPS-001/002`；不以本地日志或 fake 代替 |

### 5.3 Blocker 对当前配置合同的影响

| Blocker 类别 | 当前 04 可正式定义 | 未闭合前绝对不能声明 |
|---|---|---|
| `RUN-UP-*` | binding slot/ref、capability posture、负向和 fail-closed 语义 | exact API/DTO、formal positive binding、owner truth、Ready |
| `RUN-DDD-*` | 技术中立 schema、logical refs、required guarantees、builder 顺序 | 真实仓、文件、backend、命令、manifest、实现完成 |
| `RUN-DOC-001` | Step 1～14 已收口结论 | Step 15 前的正式配置移交 |
| `RUN-DOC-002/003` | 05/06/07 的输入、暂停条件和事实边界 | 测试结果、verdict、phase、commit、implementation ledger |
| `RUN-OPS-*` | safe telemetry/redaction/handoff seam 与 test-only fake 隔离 | production report/evidence/SLO、真实 integration acceptance |

### 5.4 Step 1～13 当前 03 影响总审计

| 来源 Step | 当前正式配置结论 | 当前是否改变 03 | 处理状态 |
|---:|---|---|---|
| 1 | 只序列化 03 已有 semantic profile/ref/limit/policy 绑定 | 否 | 无回写 |
| 2 | P0/P1/P2 只组织当前绑定与未来 seam | 否 | 无回写 |
| 3 | 七域、唯一 raw-config reader 和 builder 顺序承接 03 | 否 | 无回写 |
| 4 | startup/new-assembly/job-start 类别与 VETO 细化现有边界 | 否 | 无回写 |
| 5 | safe defaults + one strict document；无 leaf override | 否 | 无回写 |
| 6 | 四个 profile 只是受控 `RunnerRuntimeProfileRef` 语义 | 否 | 无回写 |
| 7 | 七域字段映射既有 runtime config/ports/policies；派生 marker 不入 JSON | 否 | 无回写 |
| 8 | opaque sensitive ref、zero raw material 和 new-assembly rotation | 否 | 无回写 |
| 9 | strict parse/validate/snapshot/existing builder 与 safe issue 语义 | 否 | 无回写 |
| 10 | whole-document/new-assembly、Job snapshot 与外部 audit ownership | 否 | 无回写 |
| 11 | invalid config fail-fast；runtime failure 使用 03 typed blocked/degraded/unknown | 否 | 无回写 |
| 12 | 只向 05/06/07/09 提供输入，不改变 03 | 否 | 无回写 |
| 13 | initial/unreleased schema、当前无迁移、历史 key 全拒绝 | 否 | 无回写 |

当前审计结论：`待回写 = 0`，`阻塞待确认 = 0`。该数字只描述当前正式配置结论的 03 回写状态，不代表外部 blocker 数量为零，也不代表实现 ready。

### 5.5 Future design-change triggers

以下内容不是当前配置结论，不进入 `runner-config/v1`，因此当前不产生 03 回写项。一旦被正式需求或 authority 纳入范围，必须先暂停 04/下游实施，回写指定 03 契约，再重跑相关配置 Step。

| Future trigger | 可能改变的 03 契约 | 必须重开 |
|---|---|---|
| remote config center、admin override、多 overlay、env/CLI leaf override | loader port、source priority、authority、audit、error、concurrency | 03 Step 7/9/12～14；04 Step 3～13 |
| runtime hot reload、dynamic adapter/store replacement、online LKG | builder lifecycle、old/new snapshot、in-flight Job、rollback/recovery | 03 Step 7/9/11～14；04 Step 4/9～13 |
| real secret provider callable contract、live rotation/health | runtime config、adapter constructor/port、error、observability | 03 Step 6/7/9/12/14/15；04 Step 5/7～11 |
| 新 adapter slot、profile、public config error/DTO | object/enum/port/protocol/builder/test slice | 03 对应 Step 6～16；04 全链 |
| product-specific endpoint/DSN/path/backend schema | adapter/store contract、技术/安全边界 | 架构/03/04/07；不得从 README 继承 |
| planned Consumer positive path、outbound event、formal evidence producer | requirement、protocol、flow、state、transaction、truth ownership | 00～03 与 04 全链 |

### 5.6 未确认前统一处理规则

| 场景 | 处理规则 |
|---|---|
| exact public contract 未闭合 | 仅保留 semantic slot/ref；per-slot `Blocked/Unsupported/Unknown`，不发起私有正向调用 |
| required local guarantee 未证明 | builder/facade/mutation fail-closed；不 fallback 到 in-memory/test backend |
| numeric authority 未定 | 值保持 required/authority-pending；不复制示例 `1`、README 或旧 05/06 数字 |
| source/delivery 未定 | 只定义 exactly-one whole-document selector；不发明 path/env/CLI key |
| secret provider 未定 | ordinary JSON 只含 opaque ref；不保存、输出或 fallback raw material |
| dependency timeout/possible effect | `Unknown + RecoveryCase + query-first/manual review`；禁止 replay/resend/reclaim/resume |
| redaction 不可用 | 无 visible content、无 handoff、无 raw log fallback |
| configuration change/rollback | reviewed whole document + revalidation + new assembly；禁止 `latest good` |
| local config/log/report | 只作 safe local correlation；不是 formal audit/evidence/verdict/signoff |

### 5.7 Step 15 装配门禁审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 1～13 是否全部完成并自审 | pass | 对应 13 份中间产物均为 completed/pass |
| Step 3～11 七域/配置项是否全部停审 | pass with explicit blockers | blocker 影响已逐域保真，不存在内部 unresolved 冲突 |
| 来源、profile、配置项、敏感、加载、变更、失败是否一致 | pass | single document、四 profile、七域、startup/new assembly、fail-closed 一致 |
| 是否有当前 `待回写` | no | §5.4 全部 `无回写` |
| 是否有当前 `阻塞待确认` | no | future trigger 未进入当前 schema |
| 是否把外部 blocker 写成 closed/ready | no | §5.1/§5.3 保持 blocked scope |
| 是否允许正式 04 写入 | yes | 仅限 Step 15 full-restart 装配 |
| 是否允许进入 05 | no | Step 15 完成后必须停审等待用户确认 |

## 6. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 14 汇总当前风险、blocker 和未确认前处理 | 否 | 风险治理与门禁 | 不适用 | 无回写 |
| 当前七域正式合同保持 existing config/builder/port/policy seam | 否 | 配置语义收口 | 不适用 | 无回写 |
| 当前不支持 remote/admin/hot/LKG/real secret callable/new slot/profile | 否 | unsupported/future boundary | 不适用 | 无回写 |
| Step 15 可在保留 blocker 的前提下装配正式 04 | 否 | 文档装配 | 不适用 | 无回写 |

## 7. 回填草稿（未来正式 §14）

> 校准来源：
> - `design-calibration/04_config_step_14_risks_open_questions.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“风险与 blocker 表”“待确认事项表”“Step 1～13 当前 03 影响总审计”“Future design-change triggers”和“未确认前统一处理规则”小节。

正式 §14 应装配：

- `RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-DOC-002/003`、`RUN-OPS-001/002` 的持续风险和阻塞范围。
- `RUN-DOC-001` 在 Step 15 正式文档成功创建后关闭的记录。
- 未确认事项、确认方和 fail-closed/blocked/pending 处理。
- 当前 03 回写清单全部为 `无回写`，future trigger 不进入当前 schema。
- 正式 04 完成不等于实现、测试、验收、运维或 product readiness。

过程性的问答、诊断、pass 统计和门禁推导留在本文件，不进入正式正文。

## 8. 待确认事项与进入 Step 15 条件

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 用户对正式 04 的审查 | 决定后续是否允许进入 05 | Step 15 完成后立即停审，不自行进入 05 |
| 上游/物理/运维 blockers 何时关闭 | 决定正向 integration、implementation 和 acceptance | 由对应 authority 后续提供事实；配置不能关闭 |
| future trigger 是否进入路线 | 决定是否需回写 03/04 | 当前全部不进入 schema；正式触发时重开设计 |

| 进入 Step 15 条件 | 状态 | 说明 |
|---|---|---|
| 所有未关闭事项有影响、确认方和处理 | 通过 | 见 §5.1～§5.3 |
| Step 1～13 的当前 03 影响全部审计 | 通过 | 见 §5.4 |
| 当前不存在 `待回写` / `阻塞待确认` | 通过 | 当前正式合同全部 `无回写` |
| Future 候选未写成当前配置项 | 通过 | 见 §5.5 |
| Step 3～11 域/项停审与跨域一致性通过 | 通过 | 见 §5.7 |
| 正式写入严格限于 Step 15 | 通过 | `formal_04_write_allowed=true_step_15_only` |

Step 14 完成，允许进入 Step 15。该门禁不关闭任何外部、物理、下游或运维 blocker，也不证明实现仓、配置 artifact、baseline、commit、测试、run_id、report、evidence、verdict、signoff 或 readiness 存在。
