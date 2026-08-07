# L2-tools 02 概要 Step 11: 配置影响轮廓

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 只识别已有主要组成部分、entry、store、projection、job 和 external port 的配置影响类别，以及禁止配置化边界；不定义配置 key、默认值、格式、环境变量、secret 名、完整 config type、constructor、加载算法或部署方式。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 11 配置影响轮廓 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 4 / 5 / 7 / 8 / 9 / 10 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 11；概要书写规范 §4.11 |
| 已读取正式输入 | yes: 正式 01 横切配置 / 变更控制；正式 00 数据、接口、安全和 NFR 约束 |
| 已读取参考粒度 | yes: `L1-governance`、`L1-artifact`、`L3-method-library`、`L3-capability-hub` Step 11 |
| 旧材料处理 | Python / RPC / DB / MCP / builtin / host / policy / SLA 配置只作 historical pollution，不作为配置候选来源 |
| 进入条件 | pass: Step 10 completed |
| next_allowed_action | 识别配置影响主语、禁止配置化边界、03 配置实现契约方向与 04 配置设计后移项。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 标准 / 上游 / 参考读取 | done | §0 / §2 | pass |
| SOP 问题回答 | done | §3 | pass |
| 旧材料诊断 / 设计取舍 | done | §4 | pass |
| 配置影响候选与正式轮廓 | done | §5 / §6 | pass |
| 禁止配置化边界 | done | §7 | pass |
| 配置影响图 | done | §8 | pass |
| 03 / 04 承接与 blocker 审计 | done | §9~§11 | pass |
| 跨 Step / 历史污染 / 正式回填 / 门禁 | done | §12~§15 | pass |

## 2. 本步输入与效力

| 输入 | 本步承接 | 本步不得改写 |
|---|---|---|
| Step 4 代码主体框架 | Inbound / Application / Domain / Ports / Persistence / Projection 的配置装配位置 | 六个业务主体族、实现分层和 blocked port 状态 |
| Step 5 主要组成部分 | 六部分的直接 / 间接配置影响 | 组成部分职责、owner、非职责和 capability 边界 |
| Step 7 接口骨架 | Command / Query / Consumer / Event / Job / Port 的运行装配影响 | 接口分类、写权、公共上下文和 logical / blocked contract 状态 |
| Step 8 处理流 | Entry、store、port、publisher、job / projection builder 的配置注入位置 | Formal re-entry、local commit、sync / async / background 分离 |
| Step 9 状态 | Projection / report freshness 等技术状态可受运行装配影响 | Domain state、允许 / 禁止迁移、terminal immutability 和 owner 分权 |
| Step 10 异常 | Config invalid / missing 对 entry、adapter、job、handoff 的降级方向 | Fail-closed、no host bypass、no fabricated outcome、local-truth-first |
| `L2T-UP-001~009` | 可为未来 adapter / port 预留配置实现契约方向 | 不得用“可配置”把 blocked seam 变成 ready |

## 3. SOP 问题回答

### 3.1 哪些结构受配置影响

直接受配置影响的主语集中在运行装配层：

- Command / Query / Consumer / Job entry 的 profile、输入限制类别、context factory 与超时边界。
- `ToolContractStore`、`CapabilityBindingStore`、`ToolInvocationStore`、`ExecutionHandoffStore`、`OutcomeAuditStore`、`ExternalSubmissionStore` 和 `ProjectionStore` 的 store adapter / root / connection profile。
- `SharedContractAuthorityPort`、`HubControlledSourcePort`、`InvocationCallerPort`、`AuthorizationConsumptionPort`、`SandboxExecutionPort`、`ExecutionSourceIntakePort`、`SafeEventCollaborationPort` 的 adapter / endpoint / timeout / secret-ref / contract-version profile。
- Inbound Consumer 的 source binding、envelope validation、dedup / ordering storage profile 与 forbidden-body guard 装配。
- Event collaboration 的 publisher adapter、target class、local submission timeout 与外部 handoff degradation surface。
- Integrity、Binding consistency、derived rebuild、external status refresh Job 的 schedule / scope / batch / cursor / retry / parallelism 类别。
- Search / diff / diagnostic / guidance / report projection 的 store、freshness / watermark 与 rebuild scope。

### 3.2 哪些模块只能间接受配置影响

六个 domain 组成部分及其关键对象、policy / guard、状态机只能通过 application service 注入的“已校验 adapter、port、store、clock / metadata、safe limit”间接受影响。它们不能直接读取配置，也不能让配置决定：

- `ToolId`、current definition、formal Binding、canonical invocation、terminal outcome 或 ToolAuditEntry 的真相。
- Definition source、Hub、authorization、Sandbox、Bus、Observability 或 Core authority 是否正式可信。
- `explicit_unbound`、authorization allow / deny、Sandbox requirement、safe handoff eligibility 或 gap resolved。
- 哪些状态可迁移、谁可写、后到材料能否覆盖历史。

### 3.3 哪些边界禁止配置化

禁止配置化的核心类别是：truth owner 与依赖裁剪、domain invariant、formal entry / re-entry、状态机红线、L2 内部原子关系、forbidden-body、安全外发四项合取、fail-closed、Sandbox 不旁路、local-truth-first、external status 分权、Query / Consumer / Job no-write、gap evidence guard 和派生 no-fallback。

### 3.4 03 需要继续定义什么

`03-详细设计.md` 需继续定义 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`StoreConfig`、`ConsumerConfig`、`PublisherConfig`、`JobConfig`、`ProjectionConfig`、`ConfigError` 与 runtime builder 注入关系的职责和错误面，但不能因此补造未闭口 provider / route / schema。

### 3.5 哪些细节必须后移 04

配置 key、默认值、范围、单位、文件格式 / 路径、环境变量、secret 名称、endpoint 值、profile 值、schedule、timeout 数字、batch / concurrency 数字、retry / backoff 数字、store 产品参数、示例与运维覆盖规则全部后移 `04-配置设计.md`；量化测试 / 验收和实施步骤分别后移 05 / 06 / 07。

## 4. 当前材料问题诊断与设计取舍

| 旧材料 / 潜在写法 | 问题 | 当前取舍 |
|---|---|---|
| 配置决定 builtin / MCP / provider inventory | 让产品库存 / external registry 成为本地 truth。 | 不进入；Hub ref / future adapter seam 与本地 contract truth 分离。 |
| 配置列出 governed / restricted tool allowlist | 配置成为 authorization / taxonomy owner。 | 禁止；execution requirement 来自 formal definition，authorization 来自正式外部 result。 |
| `sandbox_enabled=false` 触发 host execution | 配置绕过 isolation truth。 | 禁止；Sandbox-required 永不因配置缺失 / disable 而直跑。 |
| Callback / stdout adapter 配置决定 result success | Carrier config 反向定义工具语义。 | 禁止；adapter 只交付 source ref / safe summary，L2 仍经 source assessment / normalization。 |
| Publish / observability 开关决定 invocation success | 外围可用性反写本地 outcome / audit。 | 禁止；只影响 submission / external ref degradation。 |
| Retry / replay config 进入 outcome | Runtime / Bus / Sandbox recovery owner 被吞并。 | 仅允许 adapter / Job 的运行重试类别候选；是否允许及语义必须由 03 的 owner contract约束。 |
| Config fallback 到旧 cache / local registry | 以可用性名义绕过正式来源和 freshness。 | 禁止；explicit stale / unavailable，不把旧派生当 current truth。 |
| Secret / endpoint 正文进入 ToolDefinition | 外部连接与 credential 被迁入领域 truth。 | 禁止；只能存在 secret ref / adapter config，不进入 domain / audit / material。 |
| 固定 Python、RPC、数据库、broker、环境变量 | 旧实现形态污染概要。 | 不继承；只写 config contract 类别。 |

设计取舍：

1. 配置是 Composition Root / adapter / runner 的输入，不是 domain truth 的输入源。
2. “配置存在”只表示实现可装配 / 校验，不证明 external contract、endpoint、provider、route 或 readiness 存在。
3. Config invalid / missing 的影响按 entry blocked、adapter unavailable、job delayed、projection unavailable、handoff degraded 分层，不形成 global service health truth。
4. Retry、timeout、batch 等只点名影响类别；其适用 owner、默认值与算法由 03 / 04 继续收口。
5. 画一张配置影响图，因为 entry、builder、adapter / store / runner 与 domain 间接影响关系仅靠表格不够直观。

## 5. 配置影响候选识别

### 5.1 候选准入规则

候选必须同时满足：

1. 主语已在 Step 4~10 中出现，不新增业务组成部分或接口。
2. 影响属于 config source / profile / store / endpoint / timeout / batch / retry / secret ref / feature exposure / schedule / projection scope 等运行类别。
3. 只改变承载选择、运行节奏、资源边界或 explicit degraded surface，不改变 owner、domain invariant、状态机、安全门禁和正式语义。
4. 对 blocked seam 只允许描述未来 adapter / validator 方向，不能声明 positive route / provider 已存在。

### 5.2 候选表

| 候选主语 | 来源 | 候选影响类型 | 进入正式轮廓 | 理由 / 限制 |
|---|---|---|---|---|
| Command / Query entry | Step 4 / 7 / 8 | config source、profile、context injection、request limit、timeout category | 是 | 入口需装配；actor / metadata / idempotency / forbidden-body guard 不可关闭。 |
| Inbound Consumer entry | Step 7 / 8 | transport binding、source profile、contract version profile、dedup / ordering store、timeout | 是 | 只能形成 ref / assessment / gap；不得直写 core truth。 |
| Operations Job runner | Step 7 / 8 | schedule、scope、batch、cursor、retry、parallelism、watermark profile | 是 | 只检测 / 重建 / refresh 允许对象，不能修 subject。 |
| Persistence ports | Step 4 / 7 / 8 | store adapter、store root / connection profile、transaction capability category | 是 | Store 实现受配置影响；truth owner / atomic invariant 不受影响。 |
| Projection / report ports | Step 4 / 7 / 8 / 9 | projection store、freshness / watermark、rebuild scope、read timeout | 是 | 只影响派生读取；不得 fallback 或反推 core。 |
| Core shared authority port | Step 7 | adapter / contract source profile、version selection policy | 是（blocked-aware） | 配置不能把 candidate / missing authority 变 resolved。 |
| Hub controlled source port | Step 7 / 8 | adapter、endpoint、timeout、contract version、safe snapshot profile | 是 | 不复制 Hub truth，不以 endpoint 可达推导 ref valid。 |
| Invocation caller port | Step 7 / 8 | inbound adapter、profile、timeout、safe request limits | 是 | Caller / carrier 不得分叉 canonical semantics。 |
| Authorization consumption port | Step 7 / 8 / 10 | future adapter、endpoint / timeout、secret ref、contract version profile | 是（blocked-aware） | Owner / source / schema 未闭口仍 fail closed；配置不得 self-allow。 |
| Sandbox execution / source intake ports | Step 7 / 8 / 10 | adapter、endpoint / timeout、secret ref、mapping profile、source contract profile | 是（blocked-aware） | Mapping / receipt 未闭口仍 blocked；配置不得 host bypass 或猜 outcome。 |
| Safe event collaboration port | Step 7 / 8 / 10 | publisher adapter、target profile、timeout、retry category、contract version | 是（blocked-aware） | Route 未闭口不等于可 publish；失败不回滚 outcome / audit。 |
| 六个 Application Service 族 | Step 4 / 5 | injected ports / stores / clock / limit profiles | 间接受影响 | 只接收已验证依赖与 safe limits，不直接解析配置。 |
| 六个 Domain Model / Policy / State 族 | Step 5 / 6 / 9 | 无直接配置 | 否 | 列入禁止配置化；正式语义不能成为 feature toggle。 |
| Safe material / redaction support | Step 5 / 8 / 10 | redaction adapter / target classification profile / size limit category | 是（受限） | 四项合取是 invariant；配置只能选择实现和更严格限制，不能放宽。 |
| Diagnostic / guidance reads | Step 6 / 7 / 8 | projection source、safe display policy、read timeout | 是 | 不成为 health truth、SDK generator 或 Runtime recovery。 |

## 6. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| 工具合同与演进 | 间接受影响 | definition source adapter profile、contract store adapter、clock / idempotency store、safe input limit | 03 定义 builder 注入、store / source adapter config 和 config-invalid rejection；配置不得生成 identity、current revision 或 compatibility结论。 |
| Capability Binding 与受控来源 | 间接受影响 | Hub adapter / endpoint / timeout、snapshot store、consistency job profile | 03 定义 Hub adapter / store / JobConfig 与 unavailable surface；配置不得建立 unbound、valid assessment 或本地 registry fallback。 |
| 规范调用与受理 | 间接受影响 | caller adapter profile、request limit、context factory、idempotency store、command timeout category | 03 定义 entry / caller adapter / idempotency config 与 rejection surface；canonical invocation、admission 和 forbidden-body 不变量不配置化。 |
| 执行前置与条件交接 | 间接受影响 | authorization / Sandbox adapter、endpoint / timeout、secret ref、mapping profile、handoff limit | 03 定义 blocked-aware AdapterConfig、validator 和 port unavailable / mapping blocked surface；配置不能产生 allow、Sandbox readiness 或 bypass。 |
| Outcome、审计与安全交接 | 间接受影响 | source intake adapter、outcome / audit store、redaction adapter、publisher target / timeout / retry category | 03 定义 source / store / redaction / publisher config 和 degradation surface；配置不得决定 normalized semantics、拆开 outcome / audit 或把 submitted 当 delivered。 |
| 引用完整性与受控派生 | 是（运行层） / 间接受影响（domain） | job schedule / scope / batch / cursor / retry、projection / report store、watermark、read timeout | 03 定义 JobConfig、ProjectionConfig、runner / builder 注入和 stale / failed surface；Job / projection 不得修 core truth。 |
| Command / Query entry | 是 | config source selector、runtime profile、context injection、input / timeout category | 03 定义 ConfigLoader / Validator 与 entry builder；不得关闭 actor、metadata、idempotency、consumer boundary 或 body guard。 |
| Inbound Event Consumer | 是 | transport binding、source profile、contract version、dedup / ordering store、timeout category | 03 定义 ConsumerConfig、envelope / authority validation 与 duplicate / rejected / blocked surface；不得直写 contract / Binding / outcome。 |
| Outbound Event skeleton / collaboration port | 是 | publisher adapter、target profile、contract version、timeout / retry category | 03 定义 PublisherConfig、local submission result 与 route-blocked surface；event 名仍是 semantic skeleton，不代表 schema / topic 已发布。 |
| Operations Job runner | 是 | schedule、scope、batch、cursor、retry、parallelism、watermark profile | 03 定义 JobConfig、SystemActorContext 注入、idempotent job result；04 才定义具体值。 |
| Persistence ports | 是 | store adapter、store root / connection profile、transaction capability、retention category | 03 定义 StoreConfig、unit-of-work capability validation 与 unavailable surface；不在 02 选择数据库或保留数字。 |
| Projection / report reads | 是 | projection store、freshness / watermark、rebuild scope、read timeout、safe display profile | 03 定义 ProjectionConfig 与 explicit stale / rebuilding / unavailable result；不 fallback external body / old inventory。 |
| `SharedContractAuthorityPort` | 是（blocked-aware） | authority adapter / source profile、contract version selection | 03 定义 authority resolver config；`L2T-UP-008` 未闭口时 validator 必须保留 blocked，不私造 Core type。 |
| `HubControlledSourcePort` | 是 | adapter / endpoint、timeout、contract version、safe snapshot profile | 03 定义 Hub source adapter config；可达性不等于 authority / relation valid。 |
| `InvocationCallerPort` | 是 | inbound adapter、profile、timeout、safe request limit | 03 定义 caller adapter config；所有 carrier 必须映射同一 Command semantic。 |
| `AuthorizationConsumptionPort` | 是（blocked-aware） | future adapter、endpoint / timeout、secret ref、contract version | 03 仅定义 pending adapter contract / validator 方向；`L2T-UP-001~002` 未闭口时不得启用 positive path。 |
| `SandboxExecutionPort` / `ExecutionSourceIntakePort` | 是（blocked-aware） | adapter、endpoint / timeout、secret ref、mapping / source contract profile | 03 定义 mapping / source adapter config 方向；`L2T-UP-003~004` 未闭口时不得配置出 accepted / receipt / outcome。 |
| `SafeEventCollaborationPort` | 是（blocked-aware） | publisher adapter、target / contract profile、timeout / retry category | 03 定义 handoff config 与 local failure surface；`L2T-UP-004~006` 未闭口时 route 保持 blocked。 |

## 7. 禁止配置化边界表

| ID | 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|---|
| `NC-L2T-001` | L2-tools 是 tool identity / definition / canonical invocation / semantic outcome / ToolAuditEntry truth owner | Owner 不能由部署或 profile 选择，否则产生多套工具合同。 | 回到正式 00 定位 / owner、01 bounded context / write authority。 |
| `NC-L2T-002` | Core compile、Hub / Runtime / Sandbox runtime、Bus / Observability event collaboration 的依赖裁剪 | 配置不能新增源码依赖、直连 external registry 或把 event seam 变执行调用链。 | 回到全局依赖规则与正式 01 依赖设计。 |
| `NC-L2T-003` | Stable `ToolId` 与 contract / definition identity 规则 | 配置值、文件名、provider identity 或 endpoint 不能生成本地正式 identity。 | 回到 Step 3 / 5 / 6，必要时正式 00 / 01。 |
| `NC-L2T-004` | Current definition 只能经 formal establish / assess / adopt / retire flow 变化 | Feature toggle、adapter availability 或 source refresh 不能切 current pointer。 | 回到 Step 7 / 8 / 9。 |
| `NC-L2T-005` | Binding 必须是 bound-active 或 formal explicit-unbound，缺 ref 不等于 unbound | 配置缺省 / disable 不能改变 relation truth。 | 回到 Step 5 / 6 / 9。 |
| `NC-L2T-006` | Hub visibility / exposure / inventory 不等于 authorization | 配置 allowlist / source selector 不能产生执行资格。 | 回到正式 00 业务规则、Step 3 / 10。 |
| `NC-L2T-007` | Canonical invocation 跨 caller / carrier 单一语义 | 不同 adapter profile 不能分叉 request / result / error contract。 | 回到 Step 4 / 5 / 7 / 8。 |
| `NC-L2T-008` | Raw prompt / request / capture / provider response、secret、credential、external-owner body 禁入 | “已加密”“仅审计”“调试模式”或环境 profile 都不能解除禁令。 | 回到正式 00 数据规则、正式 01 安全边界、Step 3。 |
| `NC-L2T-009` | Admission 必须在真实执行前成立，rejected / unavailable 不原地翻转 | 配置不能跳过 admission、把 invalid input 标 accepted 或重试旧 invocation 推进状态。 | 回到 Step 7 / 8 / 9 / 10。 |
| `NC-L2T-010` | Authorization required 时正式 result 缺失 / stale / conflict / unverifiable 必须 fail closed | 配置 fallback、role、local policy、旧 allow 都不能产生 allow。 | 回到正式 00/01 与 Step 9 / 10；owner seam 由上游闭口。 |
| `NC-L2T-011` | `ExecutionRequirement`、authorization decision 与 Sandbox requirement 分权 | 配置不能把工具风险声明变 effective decision，也不能取消适用前置。 | 回到 Step 5 / 6 / 8 / 9。 |
| `NC-L2T-012` | Sandbox-required 不得 host direct execution | Adapter disable、timeout 或 emergency profile 不能旁路 isolation truth。 | 回到正式 00/01、Step 8~10；Sandbox seam 由 owner 闭口。 |
| `NC-L2T-013` | Execution delivery / local attempt 不等于 external accepted / run / receipt | Endpoint 可达、port return 或 adapter status 不是外部 lifecycle truth。 | 回到 Step 7~10。 |
| `NC-L2T-014` | Execution source 必须经 authority / correlation / mapping assessment 才能形成 normalized outcome | Mapping profile 不能把 unknown / raw material 默认成 success / tool error。 | 回到 Step 6 / 8~10；具体 mapping 需上游 / 03 闭口。 |
| `NC-L2T-015` | 每个 invocation 只有一个 immutable L2 terminal outcome | 配置、迟到材料、重放或观测反馈不能覆盖 / 追加第二当前终态。 | 回到 Step 6 / 9 / 10。 |
| `NC-L2T-016` | Outcome 与 ToolAuditEntry 必须在同一 L2 内部边界收口 | Audit disabled / async-only / best-effort 配置会留下不可解释行动。 | 回到 Step 5 / 8 / 10；03 定义 unit-of-work。 |
| `NC-L2T-017` | Safe handoff 四项合取门禁: minimal necessary、body-free、redacted、correlated | 配置只能收紧，不得关闭任一条件或允许正文例外。 | 回到正式 00/01、Step 3 / 8 / 10。 |
| `NC-L2T-018` | Local outcome / audit first，submission / delivery / observation 不参与本地终态提交 | Strong-consistency / wait-for-observation 配置会制造跨 owner 事务和外围反写。 | 回到正式 01、Step 8~10。 |
| `NC-L2T-019` | Bus delivery 与 Observability observation 分属不同 external ref | 配置不能合并为 global handoff success 或用一方状态替代另一方。 | 回到 Step 6 / 9 / 10。 |
| `NC-L2T-020` | Query no-write、Consumer clue no-core-write、Job no-subject-repair | Auto-refresh / auto-heal / replay profile 不能取得 owning Command 写权。 | 回到 Step 4 / 7 / 8 / 10。 |
| `NC-L2T-021` | Gap 关闭必须先有 subject owner formal repair，再验证正式依据 | 配置不能 auto-resolve、忽略 blocker 或接受伪 evidence alias。 | 回到 Step 7~10；03 / 05 / 06 定义验证合同。 |
| `NC-L2T-022` | Projection / report stale / unavailable 不得反写或替代 core truth | Fallback profile 不能使用 old inventory / cache / external body 冒充 current。 | 回到 Step 5 / 8~10。 |
| `NC-L2T-023` | 状态词表、允许 / 禁止迁移、append-only / immutable 纪律 | 配置化状态机使历史解释依环境漂移。 | 回到 Step 6 / 9。 |
| `NC-L2T-024` | Logical / candidate / pending / blocked seam 不等于 implementation ready | 配置项、adapter skeleton 或 fake endpoint 不能证明 contract / provider / route 存在。 | 回到 Step 1 / 3 / 7 / 10 和 blocker owner。 |
| `NC-L2T-025` | Runtime planning / orchestration / retry / recovery、Sandbox recovery、Bus retry / DLQ / replay 不归 L2 | 配置不能把相邻 owner 的恢复主线吸入本仓。 | 回到正式 00 / 01 非目标和依赖边界。 |

## 8. 配置影响轮廓图

```text
<Config Sources / Runtime Profile>
             |
             v
   <ConfigLoader + ConfigValidator>
             |
             v
      <Runtime / Composition Builder>
        |          |             |
        v          v             v
   <Entries>   <Adapters/Ports>  <Stores/Jobs/Projections>
        |          |             |
        +----------+-------------+
                   |
                   v
          <Application Services>
                   |
                   | validated dependencies / safe limits only
                   v
     <Domain Objects / Policies / State Machines>
                   |
                   +-- never read config directly
                   +-- invariants cannot be toggled

Blocked upstream contract
  -> ConfigValidator preserves blocked / unavailable
  -> never synthesizes provider / route / authority / readiness
```

关键说明：

- 配置只经 loader / validator / composition builder 影响 entries、adapters、stores、jobs 和 projections；Domain 只接收已校验依赖与更严格的安全限制。
- Config invalid / missing 应映射为 entry blocked、adapter unavailable、job delayed、projection unavailable 或 handoff degraded 等对象限定 surface，不形成全局 ToolHealth。
- 一个 port 具备配置方向不代表其 external owner、schema、mapping、route、provider 或 readiness 已闭口；blocked seam 仍必须 fail closed 或显式 degrade。
- 图不表达配置文件格式、字段、环境变量、secret 系统、deployment mount、hot reload、rollback 或具体 builder / constructor 实现。

## 9. 配置失败影响轮廓

| 配置失败位置 | 允许的概要影响 | 禁止伪装 |
|---|---|---|
| Loader / global validation | 受影响 runtime composition 启动阻断或显式 unavailable | 使用未校验默认值继续执行，或声称 service ready |
| Command / Query entry profile | 对相应 entry 返回 blocked / invalid / unavailable | 关闭 actor、metadata、idempotency、consumer context 或 body guard |
| Store / unit-of-work capability | 阻断受影响 owning flow，避免半状态 | 写内存 / 临时文件 fallback 冒充正式 truth |
| Hub adapter | Bound consumption stale / unavailable / gap | 回退 local registry / inventory / old snapshot 为 current |
| Authorization adapter | Governed path fail closed | Default allow、role allow、local policy allow |
| Sandbox adapter / mapping | Sandbox-required no-execution unavailable / blocked | Host direct execution、伪 accepted / receipt / result |
| Execution source intake | Source unresolved / mapping blocked，暂不形成 outcome | Delivery / raw material 直接变 success / failure |
| Redaction / safe material support | Eligibility ineligible / unverifiable，不外发 | “加密后外发”、正文例外或跳过 correlation |
| Event publisher | Local submission locally-failed / route-blocked，outcome / audit 不变 | Invocation / outcome failure、delivered / observed |
| Consumer binding | Feedback unknown / stale；核心不变 | 轮询 / fake callback 制造 external truth |
| Job runner | Job delayed / failed；report / projection stale | 自动修 core truth或阻塞不相关 core path |
| Projection store / builder | Derived read stale / rebuilding / unavailable | Fallback old cache / external body 冒充 truth |

## 10. 交给详细设计的配置实现契约方向

| 03 配置实现契约方向 | 需要继续定义 | 必须保持的概要边界 |
|---|---|---|
| `RuntimeConfig` ownership | 哪个 composition root / runtime builder 拥有配置聚合与已校验依赖装配 | Domain 不直接读取；不把配置体变 domain object。 |
| `ConfigLoader` | 配置来源抽象、加载阶段与 source attribution | 不在 03 偷定 04 的 key / 格式 / env；不读取业务正文作为配置。 |
| `ConfigValidator` | Cross-config guard、blocked seam validation、启动 / entry / adapter / job failure surface | 不把 candidate / blocked seam 验成 ready；所有 `NC-L2T-*` 为不可放宽约束。 |
| `ConfigError` | Loader、validation、composition、adapter / store / job config failure 的 typed surface | 不与 domain rejection、authorization deny、tool failure、execution failure 混为一类。 |
| `AdapterConfig` | Hub、Core、caller、authorization、Sandbox execution / source、event collaboration adapter 的职责分型 | Logical / blocked port 仍需正式 contract；endpoint configured 不等于 authority valid。 |
| `StoreConfig` | Truth / attempt / ref / gap / projection store 的适用能力与 unit-of-work requirement | 不选定具体产品；L2 原子关系不可因 store profile 降级。 |
| `ConsumerConfig` | Envelope source / version / dedup / ordering / timeout / body guard 的实现契约 | Consumer 只写 ref / assessment / gap，不取得 core write。 |
| `PublisherConfig` / `HandoffConfig` | Target class、adapter、local timeout / retry category、安全材料 gate 装配 | Route 未闭口保持 blocked；publisher failure 不回滚 local truth。 |
| `JobConfig` | Job scope、cursor、watermark、batch、retry / parallelism category 与 SystemActorContext 注入 | Job 不修 subject、不生成真实 external status。 |
| `ProjectionConfig` | Rebuild scope、freshness / watermark、read / store adapter 与 degraded surface | Projection 不成为 core prerequisite，不 fallback old truth。 |
| Runtime builder / DI | Entries、application services、stores、ports、jobs 和 projection builders 的依赖图 | 六业务组成部分与实现分层不变；blocked-aware adapter 可缺席但必须显式。 |
| Config observability / diagnostics | Config source attribution、invalid / blocked / degraded 的 safe diagnostic surface | 不泄露 secret / endpoint credential，不伪造 run_id、evidence 或 readiness。 |

`RuntimeConfig` 等名称在本 Step 只是 03 的实现契约方向，不是 Step 6 新增业务对象，也不是已经存在的实现类型。

## 11. 后移 `04-配置设计.md` 的内容

| 内容类别 | 04 继续说明 | 本 Step 明确不写 |
|---|---|---|
| 配置来源与覆盖 | 文件 / env / runtime source、优先级、override、attribution | 具体路径、变量名、格式和命令 |
| Entry / runtime profile | 可填写 profile、限制、timeout、启停与校验规则 | 具体 key、默认值、数值范围 |
| Store / projection | Connection / root / retention / migration compatibility 配置说明 | DB / cache / search 产品定稿、DSN、表名 |
| External adapters | Endpoint、contract version、timeout、secret ref、TLS / auth ref 等填写与校验 | 真实 URL、token、certificate、provider 名与 payload |
| Consumer / publisher | Source / target binding、version、dedup / ordering、retry / DLQ 类别 | Topic、queue、consumer group、retry 数字、DLQ 名称 |
| Jobs | Schedule、scope、batch、cursor、parallelism、retry 填写与校验 | Cron、数值、worker topology、lease / lock 算法 |
| Safe handoff | Redaction / target / size / correlation 配置的更严格约束 | 放宽四项合取、raw body 例外 |
| Failure / degraded behavior | Invalid / missing / unavailable 的配置级行为说明 | Domain error code、Runtime recovery、runbook |

热更新、回滚、secret rotation、deployment mount、migration 操作和运维处置是否进入 04 / 07，由对应正式 SOP 后续判断；本 Step 不作实现承诺。

## 12. 跨 Step 一致性审计

### 12.1 六组成部分与接口 / flow 覆盖

| 审计主语 | 配置影响承接 | 禁止配置化保护 | 结果 |
|---|---|---|---|
| 工具合同与演进 | Source / store / clock / idempotency adapter | Identity、current revision、formal adoption / retirement | pass |
| Binding 与受控来源 | Hub adapter / snapshot store / consistency Job | Formal relation、explicit-unbound、valid assessment、no fallback | pass |
| 规范调用与受理 | Caller entry / context / idempotency store | Canonical semantics、body-free、admission before execution | pass |
| 执行前置与条件交接 | Auth / Sandbox adapters / mapping profile | Fail-closed、requirement / decision 分权、no host bypass | pass |
| Outcome、审计与安全交接 | Source / outcome store / redaction / publisher | Mapping gate、one terminal outcome、outcome + audit atomic、safe gate、local truth first | pass |
| 引用完整性与受控派生 | Jobs / projection / report / status adapters | No subject repair、gap evidence guard、projection no-fallback | pass |
| Command / Query common path | Entry / store / timeout config | Command owner不变；Query no-write | pass |
| Consumer common path | Source / envelope / dedup / ordering config | Consumer clue no-core-write / forbidden body | pass |
| Job common path | Schedule / scope / batch / retry config | Job no-subject-repair / no fake external truth | pass |
| Safe outbound path | Publisher / target / timeout config | Four-gate conjunction / local-truth-first | pass |

### 12.2 External port blocked-aware 审计

| Port | 配置方向 | Current contract truth | 配置不得推导 | 结果 |
|---|---|---|---|---|
| `SharedContractAuthorityPort` | Authority resolver / version profile | Tools-specific authority candidate / missing | Core package / type / schema resolved | pass |
| `HubControlledSourcePort` | Adapter / endpoint / snapshot profile | Current logical runtime seam | Hub truth copied、本地 registry、ref valid | pass |
| `InvocationCallerPort` | Inbound adapter / timeout / limits | Current logical runtime seam | Caller-specific private contract | pass |
| `AuthorizationConsumptionPort` | Future adapter / endpoint / secret ref | Owner / source / schema blocked | Provider exists、allow path ready | pass |
| `SandboxExecutionPort` | Adapter / endpoint / mapping profile | Logical blocked mapping / receipt | Host fallback、Sandbox accepted / run / receipt | pass |
| `ExecutionSourceIntakePort` | Source adapter / contract profile | Logical blocked source mapping | Delivery = accepted source / outcome | pass |
| `SafeEventCollaborationPort` | Publisher / target / retry category | Event route / Observability source blocked | Published / delivered / observed / replay ready | pass |

### 12.3 状态与异常审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 状态词表 / 迁移 | pass | 没有状态 enum、transition 或 terminal correction 由配置决定。 |
| Assessment / snapshot | pass | Adapter config 只提供消费边界，不证明 valid / allow / ready / accepted。 |
| Attempt / external refs | pass | Timeout / retry config 不把 attempted 变 accepted / delivered / observed。 |
| Fail-closed | pass | Authorization / Sandbox / required authority 缺失仍 conservative。 |
| Config failure taxonomy | pass | Entry / adapter / job / projection / handoff failure不坍缩为 tool failure 或 ToolHealth。 |
| Partial write / audit chain | pass | Store config 必须满足 L2 atomic invariants，不能以 profile 降级。 |
| Late material | pass | Dedup / ordering config 实现 guard，但不能授权 history overwrite。 |
| Safe material | pass | Redaction config 只能收紧，不能解除 body-free / correlated 等条件。 |

### 12.4 `IB-L2T` 配置影响覆盖

| 需求接口组 | 配置影响位置 | 不可配置化语义 | 结果 |
|---|---|---|---|
| `IB-L2T-001~004` Contract / definition / changes | Entry、source / store、publisher | Identity、formal adoption、safe post-truth event | pass |
| `IB-L2T-005~008` Binding / Hub | Hub adapter、snapshot store、Job / publisher | Relation owner、explicit-unbound、no registry fallback | pass |
| `IB-L2T-009~010` Invocation / admission | Caller entry、context / idempotency store | Canonical semantics、pre-execution admission | pass |
| `IB-L2T-011~012 / 019` Requirement / authorization | Auth adapter / Consumer profile | Requirement != decision、sync result required、fail-closed | pass |
| `IB-L2T-013~014` Sandbox / source | Sandbox / source adapters / mapping profile | No bypass、delivery != source acceptance / outcome | pass |
| `IB-L2T-015~017` Outcome / audit / safe material | Outcome store、redaction、publisher | One terminal、audit atomic、four gates、local truth first | pass |
| `IB-L2T-018` External feedback | Consumer / refresh Job | Submitted != delivered / observed、external refs independent | pass |
| `IB-L2T-E01~E04` Derived / diagnostic / management seam | Projection / Job / entry profiles | No registry / SDK / Runtime recovery / second write path | pass |

## 13. Blocker 配置影响审计

| Blocker | 允许的配置契约方向 | 当前仍禁止 | 结果 |
|---|---|---|---|
| `L2T-UP-001~002` | Future authorization adapter / validator / timeout / secret-ref category | Owner、source matrix、taxonomy、decision schema、positive provider / readiness | open / honest |
| `L2T-UP-003~004` | Sandbox / source adapter、mapping profile placeholder、local timeout / failure surface | Concrete mapping、receipt、retry / DLQ / cleanup contract、positive execution path | open / honest |
| `L2T-UP-005~006` | Publisher / target profile placeholder、route-blocked validation | Producer / source enum、event route、observed / readiness | open / honest |
| `L2T-UP-007` | Config source attribution to current workspace | Frozen commit baseline | open / honest |
| `L2T-UP-008` | Core authority resolver / version selection direction | Tools package / type / schema authority | open / honest |
| `L2T-UP-009` | Consumer guidance read profile | Existing SDK client / wrapper / compatibility configuration | open / honest |

未发现新增 blocker。开放 seam 可进入 `AdapterConfig` / `ConfigValidator` 的 blocked-aware 设计方向，但只有 owner 的正式 contract 闭口后才能在 03 / 04 定义可启用 positive 配置；配置骨架本身不解除 blocker。

## 14. Historical pollution 审计

| Historical 配置线索 | 冲突 | 当前处理 |
|---|---|---|
| Python package / process / RPC / HTTP port | 旧部署和技术栈先验 | 未继承；只保留 entry / adapter / builder 类别。 |
| Database / table / cache / queue / broker / topic | 旧基础设施定稿 | 未继承；只保留 StoreConfig / PublisherConfig 方向。 |
| Builtin / MCP / external provider inventory / endpoint | 产品库存和 external registry 越界 | 未继承；Hub / future adapter ref seam 分离。 |
| ToolPolicy / governed / restricted allowlist | 配置成为 authorization truth | 未继承；formal external result + fail-closed。 |
| Sandbox enabled / host fallback | 配置旁路隔离 | 未继承；Sandbox-required 硬红线。 |
| Retryable / non-retryable、replay / recovery 参数 | 吞并 Runtime / Sandbox / Bus owner | 未继承；仅保留 owner-aware retry category 配置方向。 |
| Raw callback / stdout normalization map | 未闭口 mapping /正文污染 | 未继承；source ref / safe summary + blocked mapping。 |
| Metrics、ToolHealth、SLA / P95 / QPS threshold | 无 measurement authority，派生状态反写 | 未继承；量化配置后移且不定义 truth。 |
| Role extras、member images、marketplace listing | 边界外产品装配 | 未进入配置候选。 |

## 15. 正式 §11 回填草稿与完成门禁

### 15.1 正式回填草稿

正式第 11 章应吸收：

1. §6 配置影响轮廓表的主要部分 / entry / Consumer / Job / store / projection / port 摘要。
2. §7 禁止配置化边界表，至少保留 owner / dependency、identity / relation、canonical invocation、fail-closed / Sandbox、outcome / audit / safe handoff、external refs、Query / Consumer / Job、gap / projection 和 blocked seam 类别。
3. §8 配置影响轮廓图与关键说明。
4. §10 的 03 实现契约方向与 §11 的 04 后移说明。
5. `L2T-UP-001~009` 的 blocked-aware 配置口径。

正式章不得复制所有 25 条红线全文，也不得新增配置 key、默认值、JSON / YAML / TOML、env var、secret 名、endpoint、技术产品、完整类型或 constructor。

### 15.2 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 配置影响主语合法 | pass | 全部来自 Step 4~10 的组成部分、entry、port、store、projection 或 Job。 |
| 直接 / 间接影响分层 | pass | Domain 不直接读取配置；运行装配层直接受影响。 |
| 两张强制表完整 | pass | 配置影响轮廓表和 25 条禁止配置化边界表已形成。 |
| 配置影响图合规 | pass | 只表达 sources -> validator -> builder -> runtime subjects -> domain 间接关系。 |
| 03 实现契约可承接 | pass | ConfigLoader / Validator / RuntimeConfig / Adapter / Store / Consumer / Publisher / Job / Projection / Error / builder 方向完整。 |
| 04 后移清楚 | pass | Key、值、格式、路径、env、secret、endpoint、schedule、数值与示例全部后移。 |
| 六组成部分 / 流 / 状态覆盖 | pass | 配置影响和红线逐项反查，无孤儿主语。 |
| External ports 诚实 | pass | 可配置不等于 authority / mapping / route / provider / readiness 已存在。 |
| Blocker 诚实 | pass | `L2T-UP-001~009` 持续开放，无新增 blocker。 |
| Historical pollution | pass | 技术栈、inventory、policy allowlist、host fallback、replay、SLA 等未回流。 |
| 详细设计越界 | pass | 未写完整 config fields、keys、values、constructors、loader 实现或部署流程。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_12_detailed_design_handoff
formal_document_write_allowed = false
commit_required = false
```
