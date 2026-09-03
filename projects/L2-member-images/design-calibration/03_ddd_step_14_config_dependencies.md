# L2-member-images 03 详细设计 Step 14：配置引用与外部依赖绑定

> 创建日期：2026-08-31  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14  
> 回填位置：正式 `03-详细设计.md` 第 13 章“配置引用与外部依赖绑定”（当前仅形成回填草稿，禁止装配正式 03）  
> 当前门禁：Step 14 已完成并停审；未经用户再次明确确认，不得进入 Step 15、装配正式 `03-详细设计.md`、实现、测试或提交。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 14：配置引用与外部依赖绑定。 |
| 恢复入口 | 已先读取项目执行台账、03 flow、Step 13 及其必要前序材料；本 Step 还须读取详细设计 SOP/书写规范、配置设计 SOP/书写规范、全局依赖裁剪规则、上游正式文档和台账中的当前状态。 |
| 直接输入 | Step 3 的语言/依赖约束，Step 4 的 planned workspace 与 `infra/config.rs` / `infra/runtime_builder.rs`，Step 5~7 的模块、对象和 port，Step 8~13 的协议、flow、状态、持久化、错误及并发边界。 |
| 方法参照 | 只借鉴 `L1-governance` Step 14 的“配置边界 → 绑定表 → 跨仓分类 → runtime builder → 前序审计”粒度；不继承其 outbox、publisher、event topic、report、scheduler、GRC 或正向运行结论。 |
| 当前可达写路径 | 10 个 Command 和 6 个 Job 仍在 `DDD-S9-B01` 后 fail-closed；Query 只读；两条条件入站仍是 marker-only，`accepted_input=false`；outbound inventory 仍为 `NoneAuthorized`。配置不得把这些边界变为可达。 |
| 本 Step 目标 | 收稳本仓可被代码读取的配置引用类别、读取/注入边界、运行期/事件/adapter/fake 协作方式、跨仓 compile 分类及不可用时的 fail-closed 处理。 |
| 本 Step 不做 | 不创建 `04-配置设计.md` 或其 future Step 文件；不选择部署产品、配置文件格式、环境变量、endpoint、secret、timeout/retry/retention/batch 数值、Cargo manifest、sibling DTO、builder/registry/Artifact/member-service 正向合同或任何运行/测试事实。 |
| 当前门禁 | `pass_with_explicit_blockers`：已完成输入审计、配置/依赖表、回填草稿和自检；现在停审，等待用户明确确认 Step 15。 |

## 1. Step 内计划、批次与停审门禁

| 批次 | 覆盖范围 | 状态 | 完成判断 |
|---:|---|---|---|
| 14.0 | 恢复、SOP 问答、输入准入、当前/未来可达性判定 | `done` | 已读取标准、前序 Step、目标正式 00~02、相关 owner 正式链及台账；旧正式 03 仍不可读。 |
| 14.1 | 配置边界、允许/禁止配置化与详细设计/配置设计分工 | `done` | 仅保留代码 binding point，不通过开关改写 truth、协议、write gate 或 owner 边界。 |
| 14.2 | 配置引用表与 runtime composition 绑定顺序 | `done` | 每项已有类型层级、读取模块、无隐式默认口径、04 落点及未闭合输入。 |
| 14.3 | 外部依赖、跨仓 compile/runtime/event/ref/adapter/fake 分类与不可用处理 | `done` | 不把消费关系写成 Cargo 依赖；sibling/owner 未闭合一律 pending/fake/blocked。 |
| 14.4 | 前序闭环审计、03 回填草稿、Step 15 handoff、自检与停审 | `done` | 不新增 03 正式正文或 04 文件；flow 和项目台账已同步为 completed-stop-review。 |

| Step / 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `config_dependencies` | `done` | `done` | `done` | `done` | `done` | `done` | `pass_with_explicit_blockers` | 已停审，等待用户明确确认 Step 15。 |

## 2. 本步输入与准入检查

| 输入 | 当前状态 | 本 Step 的限定用法 | 不可从中推导的内容 |
|---|---|---|---|
| `详细设计讨论流程_SOP.md` Step 14、`详细设计书写规范.md` §5.13 | `normative / 已读取` | 固定“配置引用表、外部依赖绑定表、跨仓依赖表”和只写代码 binding point 的要求。 | 完整配置手册、产品选择或实际装配结果。 |
| `配置设计讨论流程_SOP.md`、`配置设计书写规范.md` | `normative / 已读取` | 分清本 Step 的代码读取边界与未来 04 的来源、优先级、敏感性、校验、生效和回写纪律。 | 提前创建 04、配置 key、环境变量、JSON、secret 或 profile 值。 |
| `全局项目依赖关系与裁剪规则.md` | `normative / 已读取` | 强制保留 `compile/runtime/event/ref/adapter/fake` 分类；仅 compile 才可能成为 Cargo dependency。 | 因本地目录、physical composition 或 adapter slot 推导 path dependency。 |
| 重建版正式 `00/01/02` | `current formal input` | 承接 static/live 红线、五个阶段 truth、pinned/no-`latest`、outbound absence、配置影响轮廓和 owner 边界。 | 外部 owner 的正文、产品、exact manifest/DTO/topic、digest、发布或 readiness。 |
| Step 3、4 | `completed` | 承接零 active sibling Cargo dependency、planned `infra/config.rs` / `infra/runtime_builder.rs` 与 workspace dependency direction。 | 已存在的目标实现仓、Cargo manifest、实际 config loader 或 adapter。 |
| Step 5、6、7 | `completed` | 承接七模块责任、已有 `ImageRuntimeConfigRef` / slot / availability / fake carrier，以及 application-owned ports 的 injection direction。 | raw config public type、provider client、external positive adapter、entry process 或 service readiness。 |
| Step 8~13 | `completed with explicit blockers` | 承接 protocol/flow/state/persistence/error/concurrency 的禁止项、zero-write current posture和 future/reopen 条件。 | 以配置消除 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 或 `PF-UNAVAILABLE-RECOVERY`。 |
| `L1-governance` Step 14 | `granularity reference only` | 借鉴“边界 → 表 → runtime builder → 前序审计”的收束方法。 | 其 outbox、publisher、topic、report、scheduler、external GRC、默认 fake 或正向运行结论。 |
| `L2-runtime`、`L2-tools` 正式 `00~07` 与台账 | `formal owner boundary; implementation not implied` | 确认 runtime loop、live state、tool execution/capability truth 外置；本仓仅承接 static component ref 方向。 | runtime/tools 实例、loop、tool body、Sandbox action、provider endpoint 或 release readiness。 |
| `L3-method-library` 正式链与台账 | `owner direction stable; exact mapping surface pending` | 保留 RoleDefinition / Role-to-variant mapping 的 owner、runtime+ref seam 和 `MI-UP-003`。 | mapping body、exact query/schema、hardcoded role mapping 或 positive source conclusion。 |
| `L1-artifact`、`L4-sandbox`、`L0-core` 正式链与台账 | `owner/category input; affected details pending` | 保留 Artifact truth、Sandbox policy/backend 和 Core compile-category的外置边界。 | Artifact accept/lineage、hardened base、Sandbox policy/backend、image-specific Core type 或 Cargo binding。 |
| `L2-member`、`L2-member-service` 当前材料与台账 | `parallel sibling / pending only` | 记录 member component 与 pinned entry consumer 的 owner/direction；维持 `MI-UP-001/002`。 | exact release/compatibility、manifest/ref/confirmation、container lifecycle 或双方已闭合合同。 |
| 旧正式 `03-详细设计.md` | `historical_material / not opened` | 无。 | 读取、继承或修补旧正文；仅 Step 19 可作污染审计。 |

### 2.1 当前可达性与配置准入结论

| 面向 | 当前可由配置影响的结论 | 当前绝对不能由配置开启的结论 |
|---|---|---|
| `infra` composition | 仅能形成 planned 的 `ImageRuntimeConfigRef`、slot availability 与 `Assembled/Blocked` 本地组合判断。 | 真实 adapter、runtime process、worker、job scheduler、container 或任何 readiness 已启动。 |
| Command / Job | 无；十个 Command 和六个 Job 都在 `DDD-S9-B01/B02` 前停下。 | UoW、reservation、repository mutation、external call、result/replay、trace、projection 或 commit。 |
| Query | 已有只读 local/query surface 可被 future assembled facade 注入。 | query-time config repair、projection rebuild、gap/freshness write 或 external refresh。 |
| 条件入站 | `ImageEntryBoundaryPort` 仅可表达 marker disposition。 | broker connection、topic、envelope、receipt、dedup、accepted input 或 core truth write。 |
| 出站协作 | 无配置面；inventory 固定为 `ImageOutboundEventInventory::NoneAuthorized`。 | publisher、outbox、topic、payload、delivery、notification 或发布成功。 |
| fake | 只能在显式 `ImageFakeMode::TestOnly` composition 中作为 future test seam。 | production fallback、evidence、gate pass、candidate/entry/consumer positive truth。 |

因此，本 Step 的输入足以收束“哪些 binding 可以存在、谁读取、缺失时如何 fail closed”；不足以收束任何实际配置 schema、物理后端、数值策略或外部正向合同。该不足是设计上可见的 blocker，不是由配置补偿的理由。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 哪些模块需要读取配置？ | 只有 planned `infra/config.rs` 与 `infra/runtime_builder.rs` 可以读取、校验或持有 raw configuration。前者负责来源读取、红线校验和 redacted blocked reason；后者把已验证的配置语境转换为 local store、adapter slot、blocked adapter 或 test fake 的 composition。`contracts`、`domain`、`application` 不得持有 raw config；`api`、`worker`、`jobs` 只接收已装配 facade 或 boundary disposition，不能读取 config。 |
| 配置项的类型、默认值和读取位置是什么？ | 本 Step 只定义已有 body-free config ref、explicit fake mode 与 slot category的逻辑 binding。所有项的默认口径均是“没有隐式默认”：缺失、unknown、未验证或与当前 authority 不匹配时形成 `Blocked` / `Unknown`；`TestOnly` 也必须显式选择。key、值、文件格式、来源优先级和数值默认值留给 04。 |
| 哪些外部依赖需要通过 adapter 注入？ | mapping/component/seed/base 只经 `ImageAssemblyReferenceResolverPort`；builder/registry 只经 `BuilderRegistryPort`；gate/evidence/Artifact 边界只经 `QualificationBoundaryPort`；Member Service 只经 `MemberServiceSupplyPort`；conditional inbound/job boundary 只经 `ImageEntryBoundaryPort`；clock/ID、local store、projection、idempotency和availability只经已有 technical/repository port。 |
| 外部依赖的超时、重试、降级策略是什么？ | 当前不定义 timeout、retry、backoff、retention、batch、parallelism或 scheduler 参数。安全语义已经固定：配置/slot/store不可用时不进入 mutation；resolver/adapter不可用只输出 blocked/unavailable/unknown/gap 的既有安全分支；Query 只返回现有 stale/unavailable/gap surface；未知 external result 不盲重试。具体数值只能在 04、且不改变 Step 12/13 约束时讨论。 |
| 哪些配置细节应留给配置设计文档？ | config source、优先级/冲突、profile、敏感值管理、endpoint/credential reference、validated private adapter constructor input、产品资格、numeric policy、cold/hot 生效、审计/回滚、环境矩阵、failure diagnostic 和对 03 的影响判定均留 04。若这些结论改变 builder constructor、port、error、DTO 或 flow，04 必须回写 03，而不能静默追加。 |
| 哪些跨仓 Rust 编译期依赖可通过本地 path dependency 引入？ | 当前为**零** active sibling dependency。`L0-core` 只是 conditional compile category；`MI-UP-004`关闭且真实 package/path/type 经重新核验前，不得写 `Cargo.toml`。所有非-Core sibling 均不得因 config、adapter 或 physical composition 进入 Cargo。 |
| 哪些运行期依赖或事件协作依赖应通过 adapter / event / projection / fake 表达？ | Method Library mapping 使用 `runtime + ref`；runtime/tools/member component、seed和base使用 `ref` 或 `ref + adapter`；builder/registry、qualification/Artifact、Member Service 使用 adapter/ref seam；inbound 仅为 conditional `event`；projection是 local read model；fake 仅 test-only。详细分类见 §7。 |
| 依赖仓不存在或合同未闭合时，暂停、fake还是等待？ | 若某 future implementation 必须直接引用未闭合 Core type，暂停该 compile lane；若依赖是 runtime/ref/adapter 且外部正向合同未闭合，production composition保持 blocked/gap，而不是伪造成功；仅测试可用 deterministic fail-closed fake。需要外部 DTO、event schema、manifest、Artifact ref或 confirmation 才能继续的路径必须等待 owner contract 并重开受影响 Step。 |

## 4. 当前材料诊断、改动前后与设计取舍

### 4.1 当前材料诊断

| 来源 / 现象 | 已有可用结论 | 若不校准的风险 | 本 Step 的处置 |
|---|---|---|---|
| Step 6 infra carrier | 有 `ImageRuntimeConfigRef`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode`。 | 可能把 body-free ref误扩展为 raw config schema，或将 `Assembled` 当作 runtime/readiness。 | 保持 carrier 不变；只定义读取归属、slot binding 和缺失处理。 |
| Step 7 port matrix | port 已归 application，infra 实现/blocked/fake parity 已有方向。 | application/entry 可能读取 secret、endpoint或直接创建 provider client。 | 仅 infra composition 读 raw config；application只收 port，entry只收 facade/boundary。 |
| Step 8~10 protocol/flow/state | public protocol、flow和状态已把 write/current/future分开。 | config feature 开关可能绕过 B01/B02、从 `Available` 升格为 candidate/gate/entry。 | config validation 必须拒绝改变 protocol、write gate、状态机或 staged truth 的组合。 |
| Step 11~13 consistency/error/concurrency | UoW、projection、replay、unknown/recovery和reservation缺口均已显式。 | 用 retry/retention/default等配置暗中发明 recovery、lease或 in-flight semantics。 | 不引入任何此类字段；现有 `DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`继续阻断。 |
| external owner / sibling 状态 | owner方向清楚，但 exact contract/product仍开放。 | endpoint/adapter profile被误写成实质合同、Cargo依赖或 readiness。 | 只绑定 named seam slot；owner未闭合即 local `Blocked/Unknown` 或 local gap。 |
| outbound inventory | 当前严格 `NoneAuthorized`。 | 参照其他项目时误加 publisher/outbox/topic配置。 | 明确没有 outbound config section、adapter slot、feature flag或 fallback。 |

### 4.2 改动前后与取舍

| 议题 | 进入 Step 14 前 | 本 Step 后 | 取舍理由 |
|---|---|---|---|
| config ownership | 仅知 infra 有 config carrier，读取者和 raw-body边界尚未集中。 | 只有 `infra/config.rs`、`infra/runtime_builder.rs` 可读/校验 raw config；其他模块只见 ports或安全 marker。 | 防止配置跨越 domain、application和entry依赖方向。 |
| default posture | carrier有 blocked/unknown，但未统一说明缺项行为。 | 所有 logical binding 都采用 no-implicit-default；缺失即 blocked/unknown，test fake必须显式。 | 不允许默认 profile/缓存/fake 掩盖缺少 authority。 |
| config granularity | 02 只给影响轮廓，细节可能诱导提前写 key/product。 | 03 只列 logical ref/slot/读取位置；04 才决定来源、值、profile和敏感性。 | 使代码 binding 与配置控制面分工清楚。 |
| adapter wiring | 已有 port和planned adapter file，但未连到 composition入口。 | runtime builder 按既有 slot/port 装配 real、blocked或 test fake implementation；不新增 provider或正向结果。 | 让实现者知道注入位置，同时保持 product-neutral。 |
| cross-repo use | 全局分类已存在，仍可能因 local source存在而误加 Cargo。 | 当前零 active compile；每个外部 seam保留分类、port和不可用处理。 | 遵守依赖裁剪并保持 Layer 3 sibling pending。 |

| 被比较的方案 | 结论 | 原因 |
|---|---|---|
| 让 `contracts` 或 `application` 暴露/传递 raw config | 不采用 | 配置不是 public protocol，也不是 domain policy truth；会使 ports、DTO和external body边界失守。 |
| 缺少 adapter/config 时由环境默认、cache或 fake 自动补齐 | 不采用 | 会把 missing authority转成伪 `Bound` / `Available`，违反 fail-closed。 |
| 使用 feature/profile 打开写路径、event、consumer confirmation或 external positive lane | 不采用 | 配置只能装配受控接缝，不能关闭 `MI-UP-*` / `Q-MI-*` 或 `DDD-*` blocker。 |
| 在本 Step 选择 DB、broker、builder、registry、evidence、secret 或 scheduler 产品 | 不采用 | `Q-MI-003/004`和 04/07 的授权尚未给出；产品名会伪造架构/实现事实。 |
| 以 infra-local validated ref + slot marker + explicit fake mode 建模 | 采用 | 完整承接已定义对象，支持安全 assembly、blocked composition 与未来 04 而不新增 public contract。 |

## 5. 配置控制面与禁止配置化边界

### 5.1 配置读取与注入责任矩阵

| 位置 | 可以做什么 | 只能接收什么 | 禁止事项 |
|---|---|---|---|
| `infra/config.rs` | 读取配置来源、校验红线、形成 body-free `ImageRuntimeConfigRef` 或 redacted blocked reason。 | raw config仅留在本地加载/验证过程；输出既有 ref/marker所需的安全信息。 | 向 domain/application/contracts/entry传播 raw value、secret、endpoint、provider body，或写任何 domain truth。 |
| `infra/runtime_builder.rs` | 校验 composition 组合，声明/读取 slot，构造 real/blocked/test fake port implementation，并形成 `ImageRuntimeAssemblyState`。 | 已验证配置语境、slot declaration、`ImageFakeMode`、safe availability marker。 | 启动 runtime/worker/job/container、选择未授权产品、调用domain transition，或把 `Assembled`说成 readiness。 |
| 其他 `infra` adapter/store 文件 | 接收 builder 已构造的 private binding或已装配 client，实施已有 port。 | port输入、typed ref、safe marker；不得再读 raw config。 | 自行读取环境、旁路 config validator、推导 owner truth或把 adapter ACK写成阶段成功。 |
| `application` | 通过 constructor 接收 Step 7 port trait及已经类型化的业务输入。 | port trait、typed ref、safe conclusion、existing boundary disposition。 | raw config、secret、endpoint、provider choice、slot private state或 config-driven domain branch。 |
| `domain` / `contracts` | 保持 object、guard、state和workspace-local carrier的纯性。 | 明确的 factory/guard参数和既有 body-free typed carrier。 | config object、env access、feature flag、adapter、SDK、raw config ref/body。 |
| `api` / `worker` / `jobs` | 接收 assembled facade或 `ImageEntryBoundaryPort` result。 | validated command/query/job/marker输入和安全输出。 | config source selector、raw config、scheduler/cron、broker activation、direct adapter/repository/domain access。 |

### 5.2 允许配置化的边界

| 可配置的逻辑对象 | 本 Step 的允许上限 | 未闭合时的行为 | 04 的后续责任 |
|---|---|---|---|
| config authority / composition profile 选择 | 仅通过 existing `ImageRuntimeConfigRef` 表达已验证、body-free的配置语境。 | `Blocked`，不从环境或文件名猜出 bound ref。 | 定义来源、优先级、profile、敏感性、校验和变更控制。 |
| local store / projection / idempotency 的 composition binding | 仅作为 `LocalStore` slot 的 infra implementation 选择；不定义 physical schema或产品。 | required slot不是 `Available` 即 composition `Blocked`。 | 决定获得 authority 后的 private binding、failure strategy与测试profile；如影响 port/constructor则回写03。 |
| mapping、component、seed/base source binding | 只选择已有 named body-free ref 的 resolver/adapter slot；不提供外部正文。 | resolver结果只能 blocked/unavailable/unknown/gap，受影响 baseline/revision保持不可正向推进。 | 定义被允许的 source/profile与redaction，不得新增 owner schema。 |
| builder/registry、qualification/Artifact、Member Service boundary binding | 只装配已有 non-positive/controlled port implementation，保留 slot availability。 | 保持 blocked/unknown/gap/reopen；不能提供 candidate、Passed、Accepted、Resolved或 confirmation。 | 待 owner/product合同关闭后定义 private binding；任何正向 result需先回写 03。 |
| test fake composition | 只允许显式 `ImageFakeMode::TestOnly` 与 `FakeOnly` slot 同时出现。 | 未显式 TestOnly 或 production 时一律阻断。 | 定义 test profile和隔离规则；不得将 fixture当 production默认。 |

### 5.3 禁止配置化边界

| 禁止配置化项 | 原因 | 违规后的必须处理 |
|---|---|---|
| RoleDefinition、Role-to-variant mapping owner或 mapping body | Method Library 是唯一 owner；本仓只能消费 ref/snapshot/gap。 | 验证拒绝；保留 `MI-UP-003`，不得 hardcode或写 local mapping。 |
| image family/variant identity、persona语义、revision/history、owner和写权限 | configuration不能创造或覆盖本仓 domain truth。 | 验证拒绝；若业务语义需要变更，重开 00~03 受影响设计。 |
| necessary pin、immutable selector、`latest` 禁令、static/live边界 | 可追溯性和安全红线不能随 profile 放松。 | 验证拒绝；baseline/revision/entry保持 blocked。 |
| runtime/tools/member/supervisor/extra、policy/memory/workspace的正文或 live state | 外部正文与运行态不归本仓，且禁止进入 image input。 | 验证拒绝；只能保留 typed ref/static placement或 gap。 |
| candidate、eligibility、availability、Artifact acceptance、consumer confirmation、container/host/health | staged truth及外部 owner边界不能由 infra availability升级。 | 验证拒绝；只保留原有 local state/gap。 |
| state matrix、append/supersede、projection单向性、query no-write和版本/UoW规则 | 这些是 Step 10~13 的实现不变量。 | 验证拒绝；不得以 profile改变 mutation/recovery/replay。 |
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 配置无法补齐 canonical mapper、reservation语义或不可用恢复合同。 | 继续 fail closed并登记 blocker；不得启动 write path。 |
| compile/runtime/event/ref/adapter/fake 分类或 Core-only conditional compile | 分类来自全局裁剪，不是 config policy。 | 拒绝将 sibling/source/adapter填成 Cargo，或将 event/ref伪装成compile。 |
| inbound event activation与任何 outbound publisher/outbox/topic | `MI-UP-005`未闭合且 outbound inventory为零。 | 保持 marker-only / `NoneAuthorized`；不得创建配置 section或 feature flag。 |
| raw secret、endpoint、credential、provider response、timeout/retry/retention/batch数值进入 public/local truth carrier | 本 Step 未定义其 schema，且 body-free / no-product约束仍有效。 | 仅能在 future 04 的 infra-private范围讨论；若影响03契约，先回写。 |

## 6. 结构化中间产物：配置引用与 runtime composition

### 6.1 配置引用表

> 下表的“逻辑 binding”不是配置 key、JSON 字段、环境变量或已存在的配置文件。它只标出既有 Rust-facing carrier 如何由未来 `infra/config.rs` / `infra/runtime_builder.rs` 读取、校验和注入。任何具体 source、value、default、profile 或 secret 都留给尚未开始的 04。

| 逻辑 binding / 配置引用 | 既有类型或 carrier | raw 读取 / 注入位置 | 无隐式默认口径 | 未来 `04-配置设计.md` 落点 |
|---|---|---|---|---|
| 已验证配置语境 | `ImageRuntimeConfigRef` | raw source只可在 `infra/config.rs` 读取；body-free ref交给 `infra/runtime_builder.rs`。 | 不能得到合规 body-free ref时使用 `ImageRuntimeConfigRef::blocked`；不能由文件名、环境、cache或私有fake补成 `Bound`。 | 配置来源、优先级、profile、redaction、加载校验和失败诊断。 |
| 组合模式 / fake 隔离 | `ImageFakeMode` | `infra/config.rs` 校验显式选择；`infra/runtime_builder.rs` 传入 `ImageRuntimeAssemblyState::start`。 | 不存在隐式 `TestOnly`；未明确选择或 production出现 fake-only slot 时不得 fallback。 | test profile、fake 隔离、生产/测试变更控制。 |
| local truth / history / projection / idempotency 组合 | `ImageAdapterSlotKind::LocalStore`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker` | `infra/runtime_builder.rs` 选择并注入 Step 7 的 repository、UoW、projection 和 idempotency implementation。 | 没有 slot marker不等 `Available`；required local composition 未验证时为 `Blocked`。 | private store binding、故障策略、测试 profile；不得把 physical backend写回 domain。 |
| Role mapping source 组合 | `ImageAdapterSlotKind::MappingSource`、`ImageAssemblyReferenceResolverPort` | `infra/runtime_builder.rs` 为 `source_adapters.rs` 装配 resolver implementation。 | 缺 mapping authority/schema时只能让 resolver返回 blocked/unavailable/unknown，不硬编码 Role 或 mapping。 | owner-approved source/profile、redaction 与验证规则；`MI-UP-003` 未关不得新增 body/schema。 |
| runtime / tools / member / supervisor component ref 组合 | `ImageAdapterSlotKind::ComponentReference`、`ImageAssemblyReferenceResolverPort` | `infra/runtime_builder.rs` 为 static component-ref resolver 注入 implementation。 | 缺 immutable release/compatibility conclusion时不把 ref 视为可用 pin。 | 允许的 private source binding；release shape、compatibility和正文仍归 owner。 |
| static seed / template 组合 | `ImageAdapterSlotKind::SeedReference`、`ImageAssemblyReferenceResolverPort` | `infra/runtime_builder.rs` 为 static seed resolver 注入 implementation。 | 缺 owner-side template ref/placement时返回 gap/blocked；不能导入 live memory、checkpoint 或 workspace body。 | source/profile/redaction；不定义 semantic body或 live-state access。 |
| base-image reference | 既有 `BaseImage` body-free ref 与 `ImageAssemblyReferenceResolverPort`；**不新增 slot kind**。 | 与 static assembly resolver 同一 composition边界处理。 | hardened base仍属 `MI-UP-008` future；不得因存在 resolver而进入 current input。 | base-source eligibility仅在 scope/owner闭合后重新讨论。 |
| builder / registry conservative seam | `ImageAdapterSlotKind::BuildAndRegistry`、`BuilderRegistryPort` | `infra/runtime_builder.rs` 为 `build_adapters.rs` 装配 implementation。 | 未绑定产品或未知结果只能得到 existing non-positive/controlled result；ACK/tag/cache不能成为 candidate。 | product/private binding、credential和失败策略；`Q-MI-003`未闭合时无正向设置。 |
| qualification / Artifact boundary | `ImageAdapterSlotKind::QualificationAndArtifact`、`QualificationBoundaryPort` | `infra/runtime_builder.rs` 为 `qualification_adapters.rs` 装配 implementation。 | no authority/gate/Artifact contract时保持 blocked/unavailable/unknown/gap/reopen；不得产生 `Passed`、`Eligible` 或 `Accepted`。 | authority/profile/private binding；`Q-MI-004`、`MI-UP-007`关闭前不列 gate或 Artifact payload。 |
| Member Service supply boundary | `ImageAdapterSlotKind::MemberServiceSupply`、`MemberServiceSupplyPort` | `infra/runtime_builder.rs` 为 `supply_adapters.rs` 装配 implementation。 | consumer contract/ref/confirmation缺失时仅 `ConsumerHandoffGap` lane；local entry不能当 confirmation。 | future consumer binding；`MI-UP-001`关闭前不得定义 manifest/endpoint/confirmation value。 |
| local composition availability | `ImageAdapterAvailabilityMarker`、`ImageAdapterAvailabilityPort`、`ImageRuntimeAssemblyState` | `infra/config.rs` / `infra/runtime_builder.rs` 形成和读取 local marker；application只可读 port结果。 | missing marker=`None` / unknown，不是 available；`Assembled`不是 runtime、container或消费方 readiness。 | validation issue、profile validation和测试隔离；不记录 provider health/body。 |

`ImageClockPort`、`ImageIdGeneratorPort` 以及各 application facade 并不获得独立 raw-config surface：它们由 runtime builder 注入既有 implementation。任何未来把其产品、source或参数变成配置项的提议，必须先证明不会新增 03 的 carrier/constructor/port 需求；否则应从 04 回写并重开本 Step。

### 6.2 当前不得建立的“伪配置”

| 被误当成配置的内容 | 当前结论 | 原因 / 重新开启条件 |
|---|---|---|
| Command / Job canonical input、result-ref mapper、reservation namespace、in-flight cleanup、idempotency retention | 没有当前 config binding。 | `DDD-S9-B01/B02` 和 `DDD-S13-OPEN-01/02` 未解决；配置不能定义或开启算法、TTL、lease或 replay。 |
| projection unavailable 恢复、rebuild retry、sidecar repair | 没有当前 config binding。 | `PF-UNAVAILABLE-RECOVERY` 未闭合；不得用 retry/default把 `Unavailable` 变成 `Fresh/Rebuilding`。 |
| availability transition repair / overwrite | 没有当前 config binding。 | `DDD-S11-B03` 未闭合；不得用 profile做 delete/reinsert、supersede或 terminal repair。 |
| conditional inbound broker、topic、receipt、dedup 或 activation | 没有当前 config binding。 | `MI-UP-005` 未提供 event authority/schema；worker维持 marker-only。 |
| scheduler、cron、lease、cursor、batch、parallelism、run/report/evidence | 没有当前 config binding。 | jobs只是 bounded action marker；任何这些概念会超出 Step 7~13 已定义边界。 |
| outbound publisher、outbox、topic、delivery / notification feature | 严格不存在。 | `ImageOutboundEventInventory::NoneAuthorized` 和 `MI-UP-009`；不得以 disabled feature 或空配置占位。 |
| HTTP/RPC/API route、entry process、container/runtime/service lifecycle | 严格不存在。 | api/worker/jobs是 logical entry，L2-member-service/runtime等 owner外置；不得通过配置创建运行入口。 |
| builder/registry/evidence/store/secret 产品及其 endpoint、credential、numeric policy | 本 Step 不建立。 | `Q-MI-003/004`以及 04 的后续控制面未开始；private product binding也不能越过 owner / truth 红线。 |

### 6.3 config section 到代码绑定

| logical config section | 唯一读取 / 绑定位置 | 被注入的既有对象或 port | 必须保持的不变量 |
|---|---|---|---|
| config source、identity与红线 validation | `infra/config.rs` | `ImageRuntimeConfigRef::bound/blocked` | raw source不得进入 `contracts` / `domain` / `application` / entry；validation failure不得写 domain truth。 |
| composition mode与slot declaration | `infra/runtime_builder.rs` | `ImageFakeMode`、`ImageAdapterSlot`、`ImageRuntimeAssemblyState` | slot kind与 `DependencySeamKind` 只能取 Step 6/Step 5 已有分类；不能新增 product/source dependency。 |
| local-store binding | `infra/runtime_builder.rs` → `repositories.rs` / `projection_store.rs` / `idempotency_store.rs` | `ImageUnitOfWorkManager`、five repository groups、projection/idempotency ports | store不可用时不开始写 UoW；view/cache/fake不反写 core truth。 |
| static reference binding | `infra/runtime_builder.rs` → `source_adapters.rs` | `ImageAssemblyReferenceResolverPort` | 只接受/返回 named body-free ref与safe conclusion；不能传 Role/component/seed/base body或 live state。 |
| build / qualification / consumer boundary binding | `infra/runtime_builder.rs` → `build_adapters.rs` / `qualification_adapters.rs` / `supply_adapters.rs` | `BuilderRegistryPort`、`QualificationBoundaryPort`、`MemberServiceSupplyPort` | product configuration不得改变 candidate、gate、Artifact或 consumer state；pending output只走既有安全分支。 |
| technical composition / entry-boundary binding | `infra/runtime_builder.rs`、`clock_id.rs` | `ImageClockPort`、`ImageIdGeneratorPort`、`ImageAdapterAvailabilityPort`、`ImageEntryBoundaryPort` | clock/ID不是 config-derived business identity；entry只能调用 application facade / boundary port。 |
| fake test composition | `infra/runtime_builder.rs` → `fakes.rs` | deterministic test-only port implementation | fake必须与 `TestOnly`/`FakeOnly` 显式匹配；不得出现在 production wiring、evidence或 positive local truth。 |

### 6.4 slot 与 assembly 的 fail-closed 规则

| 观察 / 组合条件 | runtime builder 的唯一动作 | 绝不代表 |
|---|---|---|
| `ImageRuntimeConfigRef::Blocked` | `ImageRuntimeAssemblyState` 保持 / 转为 `Blocked`，不装配 facade。 | 一个可以被环境默认补齐的配置、已启动的服务或 ready。 |
| required slot没有 marker，或 marker=`Blocked` / `Unknown` | 对该 composition做 fail-closed；不得将缺 marker解释为 `Available`。 | external owner失败、candidate失败或任何阶段状态的自动写入。 |
| boundary-conforming adapter implementation 已装配，但其外部调用只能返回 non-positive assessment | 可以记录 local implementation availability；application仍必须遵循该 port的 blocked/unavailable/unknown/gap output。 | mapping可用、build成功、gate pass、Artifact接受或 consumer确认。 |
| `ImageFakeMode::Production` + 任一 `FakeOnly` slot | composition必须 `Blocked`。 | 可通过 fallback 获得 production mode。 |
| `ImageFakeMode::TestOnly` + `FakeOnly` slot | 只允许 future deterministic test composition；仍遵循 port、version、UoW、body-free与negative parity。 | 实现、集成、证据、验收或 readiness。 |
| all required local bindings通过 validation | 才可得到 `ImageRuntimeAssemblyLifecycle::Assembled`。 | runtime process、worker、scheduler、container、external dependency或 Member Service success。 |

其中“local implementation availability”和“外部业务结果”必须分开：一个受控 blocked adapter 可以作为本地已装配 implementation 存在，但其 port output 仍然只能是 blocked/unavailable/unknown/gap。反之，缺失或不合规的 local slot marker 不能仅因外部接口看似可达而升格为 `Available`。

#### 配置绑定顺序: planned runtime composition

```text
[private config source]
          | load and validate
          v
[infra config]
          | body-free ref or blocked reason
          v
[ImageRuntimeConfigRef]
          | declare and validate local slots
          v
[infra runtime builder]
          | local store and technical ports
          | static reference resolver
          | build qualification consumer boundary ports
          v
[application facade and entry boundary]
          | local composition validation only
          v
[ImageRuntimeAssemblyState]
          | Assembled or Blocked
          v
[no process no scheduler no container start]
```

关键说明：

- 上图表达的是未来 infra composition 的依赖顺序，不表达配置文件格式、环境变量、provider client、I/O、进程拓扑或部署动作。
- `ImageRuntimeAssemblyState::Assembled` 只说明本仓 local composition 的输入和 implementation boundary已经通过检查；所有 external positive lane仍需各自的 ref、guard、owner contract和 flow gate。
- 任何 Command/Job 仍必须先遇到 `DDD-S9-B01/B02`；runtime builder 的存在不构成绕过 canonical mapper、result mapper、UoW 或 reservation 的入口。

## 7. 结构化中间产物：外部依赖与跨仓绑定

### 7.1 本仓依赖裁剪表

| 关联项目 / 边界 | 全局关系 | 本仓角色 | 分类 | 是否进入本 Step 主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | member-images 的唯一 conditional compile authority | potential consumer | `compile`（conditional） | 是 | 只记录 `MI-UP-004` 下的可能 shared contract；当前没有实际 type/package/path，不能写 Cargo。 |
| `L3-method-library` | Role / image mapping定义来源 | runtime/ref consumer | `runtime + ref` | 是 | mapping owner方向稳定，但 exact query/body仍 `MI-UP-003`；经 resolver / snapshot / gap，不进 Cargo。 |
| `L2-runtime` | static runtime component release供给方向 | ref consumer | `ref`（适用 runtime） | 是 | runtime loop/live memory/checkpoint外置；只可消费 future immutable component ref或安全结论。 |
| `L2-tools` | static tools/extras component供给方向 | ref consumer | `ref`（适用 runtime） | 是 | 不消费 tool execution/capability registry/adapter truth；仅 static component/release reference。 |
| `L2-member` | member component供给方向 | ref consumer | `ref`（适用 runtime） | 是 | `MI-UP-002`未闭合 release shape/compatibility；不能配置化为 usable component。 |
| `L2-member-service` | pinned entry consumer / host owner | supply collaborator | `runtime + ref + adapter` | 是 | `MI-UP-001`下只有 local entry/gap direction；没有 manifest、confirmation或 lifecycle contract。 |
| `L1-artifact` | Artifact / lineage truth owner | ref/adapter collaborator | `ref + adapter` | 是 | `MI-UP-007`下 handoff只诊断 gap；不能绑定 Artifact payload、acceptance或 lineage。 |
| `L4-sandbox` | base/sandbox policy/backend owner | ref/adapter boundary | `ref + adapter` | 是（future-limited） | current hardened base为 `MI-UP-008` future；不消费 sandbox policy/backend、container或 execution truth。 |
| `L1-governance` / evidence authority | applicable gate / evidence owner direction | boundary collaborator | `ref + adapter` | 是 | `Q-MI-004`未给 inventory/priority；qualification port只能非正向诊断。 |
| `L0-bus` / inbound event owner | conditional build/source-event direction | conditional consumer | `event` | 是（blocked only） | `MI-UP-005`未闭合 event authority/schema；当前 worker marker-only，不能设 broker/topic。 |
| builder / registry provider | build handoff / safe observation boundary | adapter consumer | `adapter + ref` | 是 | `Q-MI-003`下未选择产品；ACK、tag、cache不形成 candidate/digest。 |
| seed authority / policy-memory-workspace template owner | static seed direction | ref/adapter consumer | `ref + adapter` | 是 | `MI-UP-006`未闭合 semantic/placement contract；只保留 static ref/placement，live state永久排除。 |
| test double / fixture | test-only parity support | local test user | `fake` | 是 | 不属于外部仓或production dependency；只能在 explicit TestOnly composition使用。 |
| L5/L6 products、marketplace、SDK、observability backend | downstream / out-of-scope | none | none / future | 否 | 不拥有产品入口、listing或 observation backend；不作为本仓 config/adapter/Cargo输入。 |

### 7.2 外部依赖绑定表

> “超时 / 重试”一栏只记录当前可实现的**语义上限**，不是参数、次数、时长、policy object或默认值。所有时序/数值仍留 04，且不得跨越 §6.2 的无当前 binding 边界。

| 依赖 / local seam | 绑定位置 | 使用接口 | 超时 / 重试语义上限 | 不可用时的降级策略 |
|---|---|---|---|---|
| local truth / history store | `infra/runtime_builder.rs` → `repositories.rs` | five repository ports、`ImageUnitOfWorkManager` | 不定义 retry；store unavailable前不得 begin write UoW。 | Command/Job当前本已 B01/B02 stop；future仅返回 existing `Unavailable` / `TransactionBoundary`，不partial commit。 |
| projection / idempotency store | `infra/runtime_builder.rs` → `projection_store.rs` / `idempotency_store.rs` | projection、truth snapshot、idempotency/replay ports | 不定义 rebuild/retry/retention；`Unavailable` recovery未闭合。 | Query仅读 existing view；保留 stale/unavailable/gap，禁止 query-time repair、replay重算或 marker提升。 |
| local clock / ID | `infra/runtime_builder.rs` → `clock_id.rs` | `ImageClockPort`、`ImageIdGeneratorPort` | 无 provider retry模型；不可用不得自行拼 timestamp/ID。 | fail before local factory/mutation；test fake仅 TestOnly。 |
| mapping / component / seed / base ref source | `infra/runtime_builder.rs` → `source_adapters.rs` | `ImageAssemblyReferenceResolverPort` | 不定义 resolver timeout/retry；unknown不能盲重查或改用 cache。 | safe resolution为 blocked/unavailable/unknown/gap；baseline/revision保持 incomplete/blocked，不读 owner body。 |
| builder / registry | `infra/runtime_builder.rs` → `build_adapters.rs` | `BuilderRegistryPort` | 不定义 submit/inspect retry；unknown external outcome不重试。 | 只保留 handoff/observation安全分支；不由 ACK/tag/cache形成 candidate、digest或 availability。 |
| qualification / Artifact | `infra/runtime_builder.rs` → `qualification_adapters.rs` | `QualificationBoundaryPort` | 无当前 gate retry/priority/config；不能通过失败重试获取 pass。 | blocked/unavailable/unknown/gap/reopen；不能 `Passed`、`Eligible`、Artifact `Accepted`。 |
| Member Service supply | `infra/runtime_builder.rs` → `supply_adapters.rs` | `MemberServiceSupplyPort` | 不定义 confirmation retry、manifest publish或 lifecycle retry。 | `ConsumerHandoffGap` / unavailable / reopen；local `Available` entry不改变 consumer状态。 |
| conditional inbound / bounded job entry | `infra/runtime_builder.rs` | `ImageEntryBoundaryPort` | 无 broker redelivery、scheduler、lease、job retry或 run policy。 | inbound重复只能重复 marker；job Declared仍于 B01/B02停止；不产生 receipt/run/report。 |
| test fake | `infra/runtime_builder.rs` → `fakes.rs` | all existing testable port implementations | deterministic only；不是生产降级或 external retry。 | fake只验证同一 negative/blocked/version/UoW/body-free行为；不得产生positive事实或 readiness。 |

### 7.3 跨仓 Rust / 协作方式绑定表

| 依赖仓 / 边界 | 依赖分类 | 本地路径或部署位置 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` / `L0-core` | conditional `compile` | `/home/aris/Projects/quantalithos-core`；真正 crate target须 future verify。 | **当前无 Cargo 引用**。只有 `MI-UP-004`关闭后，才能重新核验 package、crate、type、member和真实 path；届时优先 local path dependency。 | potential `contracts` / `domain` / `application` shared carrier consumer。 | 暂停所有直接使用该 shared type的 implementation；不以 local alias、copy、adapter或 config绕过。 |
| `quantalithos-method-library` / `L3-method-library` | `runtime + ref` | `/home/aris/Projects/quantalithos-method-library` | 不进 Cargo；经 `ImageAssemblyReferenceResolverPort`、body-free mapping ref/snapshot/gap协作。 | DefinitionAssembly / ReferenceDerived。 | `MI-UP-003`下返回 blocked/unavailable/unknown/gap；不 hardcode Role/mapping。 |
| `quantalithos-runtime` / `L2-runtime` | `ref`（适用 runtime） | `/home/aris/Projects/quantalithos-runtime` | 不进 Cargo；经 immutable component release ref / safe conclusion。 | static assembly component reference。 | 缺 ref/compatibility即 pin/baseline blocked；不导入 loop/checkpoint/memory。 |
| `quantalithos-tools` / `L2-tools` | `ref`（适用 runtime） | `/home/aris/Projects/quantalithos-tools` | 不进 Cargo；经 immutable tools/extras ref / safe conclusion。 | static assembly component/extras reference。 | 缺 ref/compatibility即 blocked；不导入 tool invocation/execution/capability registry。 |
| `quantalithos-member` / `L2-member` | `ref`（适用 runtime） | `/home/aris/Projects/quantalithos-member` | 不进 Cargo；经 future immutable member component ref / safe conclusion。 | static assembly component reference。 | `MI-UP-002`下保持 gap/blocked；不能猜 release shape或 compatibility。 |
| `quantalithos-member-service` / `L2-member-service` | `runtime + ref + adapter` | `/home/aris/Projects/quantalithos-member-service` | 不进 Cargo；经 `MemberServiceSupplyPort` 与 local `ConsumerHandoffGap` 协作。 | SupplyEntry handoff/reconcile direction。 | `MI-UP-001`下仅 gap/unavailable/reopen；无 manifest/ref confirmation/launch/health。 |
| `quantalithos-artifact` / `L1-artifact` | `ref + adapter` | `/home/aris/Projects/quantalithos-artifact` | 不进 Cargo；经 `QualificationBoundaryPort`、local handoff record/gap。 | Qualification / Artifact handoff。 | `MI-UP-007`下不 mint Artifact ref、不接受、不写 lineage。 |
| `quantalithos-sandbox` / `L4-sandbox` | `ref + adapter` future-limited | `/home/aris/Projects/quantalithos-sandbox` | 不进 Cargo；future base identity只能经 body-free ref / approved adapter。 | future base-image reference only。 | `MI-UP-008`下不装配 hardened base、不读 policy/backend。 |
| `quantalithos-bus` / event owner | conditional `event` | broker/product未选 | 不进 Cargo；future verified inbound event必须经 owner-authorized adapter/worker boundary。 | `worker` conditional intake。 | `MI-UP-005`下 marker-only；无 topic/envelope/receipt/dedup/broker activation。 |
| builder / registry / evidence / seed provider | `adapter + ref` | provider/product未选 | 不进 Cargo；经对应 application port、blocked adapter或 TestOnly fake。 | infra adapter implementation matrix。 | 未授权/不可用即 non-positive output；不选产品、不伪造 request/response/digest。 |
| test support | `fake` | project-local future test support | 非 external dependency；只在 `ImageFakeMode::TestOnly` wiring出现。 | `infra/fakes.rs` / future tests。 | 不可用于 production；没有 fake 不可改变 owner contract或打开正向 lane。 |

当前没有任何可复制的 Cargo 片段：即使 `L0-core` 日后成为 compile lane，真实 package、crate、type、member和路径仍需在实施前重新核验。表中给出的本地目录只用于定位 sibling，不构成 path dependency 证据。

### 7.4 分类保持与不可用处理审计

| 分类 | 可由本仓配置/组合做的事 | 不可用 / 未闭合时唯一处理 | 明确禁止 |
|---|---|---|---|
| `compile` | 仅在 future formal Core contract经重新核验后，允许建立受批准的 local compile binding。 | 当前暂停 direct-type lane。 | 从 runtime/ref/adapter slot推导 package、copy/shadow Core type、写 Cargo。 |
| `runtime` | 将已验证 port implementation放入 infra composition。 | local assembly可 blocked；外部结果保持 port安全输出。 | 将 endpoint/client/consumer result当 compile 或 domain truth。 |
| `event` | 只保留 future verified inbound adapter位置。 | `InboundContractMarker` 维持 unavailable/rejected/reopen。 | topic、envelope、receipt、dedup、outbound event、broker/process claim。 |
| `ref` | 传递 typed body-free identity、snapshot、safe conclusion或 gap。 | missing/stale/conflict/unavailable冻结受影响 lane。 | 复制 body、mutable selector、`latest`、guess version/digest。 |
| `adapter` | 实现 application-owned port，转为保守 local input或 boundary assessment。 | blocked/unavailable/unknown/gap/reopen；由 guard/flow判断。 | SDK/provider body、ACK shortcut、positive external contract或来源 owner takeover。 |
| `fake` | 在 explicit TestOnly 组合中提供 deterministic parity。 | fake不存在就保持 test ability pending，生产仍按真实 slot/owner判断。 | production fallback、truth write bypass、evidence/readiness/contract closure。 |

#### 依赖裁剪图: L2-member-images

```text
                      [compile conditional only]
L0-core --------------------------------------> L2-member-images
                                                     |
     [runtime + ref] Method Library                 | [ref / adapter]
L3-method-library --------------------------------> | <--- Runtime / Tools / Member
                                                     |
                                                     | [ref + adapter]
                                                     +---- Artifact / Sandbox / seed / providers
                                                     |
                                                     | [runtime + ref + adapter]
                                                     +---- Member Service
                                                     |
                                                     | [event conditional only]
                                                     +---- inbound build/source owner via Bus
                                                     |
                                                     +---- [fake test only] local deterministic doubles
```

关键说明：

- 图只裁剪与本仓有关的依赖边，不表达全局仓图、调用顺序、运行拓扑或实现状态。
- `compile` 目前仍是零 active dependency；图中的 conditional箭头只记录将来必须先经过 `MI-UP-004` 和真实 package/path/type核验的分类。
- runtime、event、ref、adapter 和 fake 绝不因为在图中相连或被 runtime builder装配就成为 Cargo dependency。
- Member Service、Artifact、Mapping、event 和 product provider 的正向合同未闭合时，图中边只允许产生 local blocked/gap/marker，不表达 confirmation、acceptance、delivery或 readiness。

## 8. Step 3~13 跨文档闭环审计

### 8.1 前序 Step 对照

| 前序 Step | Step 14 读取并承接的结论 | 本 Step 的审计结论 | 配置不得改变的边界 |
|---|---|---|---|
| Step 3：实现约束 | Rust workspace 只是 planned control-plane；当前只有 Core 可能成为 conditional compile，且没有 active sibling Cargo dependency。 | `pass`。配置、slot、adapter 与本地目录均不构成 package/path 证据。 | 不选择数据库、broker、builder、registry、secret、scheduler 或 SDK 产品；不写 Cargo。 |
| Step 4：文件布局 | 只有 planned `infra/config.rs` 与 `infra/runtime_builder.rs` 是 composition 归属；api、worker、jobs 是逻辑入口，不是已启动进程。 | `pass`。raw configuration 仅在这两个 infra 文件的 future implementation 中读取/校验。 | 不以配置创建 server、worker、cron、lease、container、deployment 或 process topology。 |
| Step 5：模块契约 | contracts/domain/application 保持 inward 与产品中立；infra 负责受控实现；entry 只能调用 application boundary。 | `pass`。configuration 只在 infra 形成 private composition，不进入 public carrier 或 domain policy。 | 不把 endpoint、secret、provider body、profile selector 传入 contracts/domain/application/api/worker/jobs。 |
| Step 6：对象契约 | 现有 `ImageRuntimeConfigRef`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode` 已足以表达 local composition。 | `pass`。本 Step 没有新增 config object、slot kind、state variant 或 public DTO。 | Assembled/Available 不能被升级为 build、digest、gate、Artifact、entry consumer、container 或 readiness。 |
| Step 7：port / adapter | 所有外部能力都由 application-owned port 表达，infra 只实现 real/blocked/test-fake parity。 | `pass_with_pending`。runtime builder 只按已有 port/slot 注入；外部 positive contract 仍由 owner 决定。 | application/entry 不读 raw configuration；fake 不得进入 Production；不得新增 publisher/outbox port。 |
| Step 8：协议 | 10 Command、10 Query、2 条 conditional inbound 与 6 条 Job 的协议边界已分开；outbound inventory 是 `NoneAuthorized`。 | `pass`。配置没有 DTO、key、route、topic、receipt 或 feature flag 入口。 | 不用 profile 开启 Command/Job write、accepted input、outbound event、manifest/confirmation 或 external success。 |
| Step 9：函数流 | Command/Job 当前在 `DDD-S9-B01/B02` 前停止；Query 只读；inbound 为 marker-only。 | `pass_with_blockers`。runtime builder 不是 flow entry，不会调用 facade、UoW、repository 或 adapter business action。 | 不因 slot 已装配而越过 canonical mapper、result mapper、reservation、page selection、trace、replay 或 commit。 |
| Step 10：状态矩阵 | staged local truth、gap、projection 与 technical marker 各有独立状态主语；没有 global ready。 | `pass`。configuration 只影响 local composition verdict，不触发 domain transition。 | 不改变 append/supersede、candidate/eligibility/availability 的分域，或构造 Accepted、Resolved、Passed、Fresh 等受阻断正向状态。 |
| Step 11：持久化 / 一致性 | local truth、projection、idempotency 与 UoW 只有 future/reopen 写入契约；raw body 不入库。 | `pass_with_blockers`。config source、private binding、slot declaration 和 fake mode 不进入 domain store、trace、replay 或 read model。 | 不用 config mutation 代替 UoW、version、append-only、result-before-complete 或 committed-truth-only rebuild。 |
| Step 12：错误 / 恢复 | unavailable、unknown、gap、manual consistency 与 owner-blocked 已有 fail-closed 口径。 | `pass_with_blockers`。配置/slot 校验失败只在 composition 层形成 blocked/unknown，不制造 persistent success 或自动恢复。 | 不配置化 retry、backoff、retention、repair、compensation、Unavailable recovery、B03 修复或 owner resolution。 |
| Step 13：并发 / 幂等 | key、opaque stable input、same-object version 与 duplicate replay 均有严格上限；in-flight 与 namespace 仍开放。 | `pass_with_open_items`。本 Step 没有新增 hot reload、lease、TTL、reservation cleanup、namespace 或 result identity 语义。 | 不以配置值/hash/clock/route/tag 充当 idempotency identity，不因 profile change 重入或重放副作用。 |

结论：配置引用没有改变任何前序对象、trait、协议、flow、状态、store、error 或 concurrency contract。所有已存在 blocker 仍在原 owner/重开位置；本 Step 只补足其在 infra composition 中的读取边界与 fail-closed 处理。

### 8.2 与概要配置影响轮廓的反向核验

| 02 Step 11 的方向性轮廓 | 03 Step 14 的落实 | 一致性判定 |
|---|---|---|
| source、adapter、projection、job 和 composition 可受配置影响 | 只落为 body-free config reference、slot declaration、private infra binding 和 future profile validation。 | `pass`；没有把方向性名称静默扩展为新的 struct、config key 或 product contract。 |
| 必要 pin、owner、gate、history、static/live、dependency kind 不可配置化 | §5.3 与 §8.1 逐项保持这些红线。 | `pass`；缺 owner input 时仍为 blocked/gap，而非配置默认。 |
| Job 的 schedule/batch/concurrency 只是未来配置影响类别 | 当前 jobs 仍没有 scheduler、cron、lease、cursor、run 或 report；Step 14 不建立其配置面。 | `pass_with_blocker`；任何具体 job policy 必须先满足 B01/B02 与 Step 13 reopen 条件。 |
| external endpoint / credential / profile 属于后续配置控制面 | 本 Step 未定义 endpoint、credential、格式、优先级、热更新、数值或 secret。 | `pass`；这些问题只能由 future 04 在不改变 03 契约的前提下展开。 |

### 8.3 横切反例审计

| 审计点 | 通过条件 | 结果 | 若未来违反，必须动作 |
|---|---|---|---|
| raw configuration 泄漏 | raw source、secret、endpoint、provider body 不进入 contracts/domain/application/entry、store、trace、error 或 fixture。 | `pass` | 停止实现；先重开 Step 5~7 与受影响 DTO/port 边界。 |
| local composition 冒充业务成功 | Assembled/Available 只表示本地 wiring/slot；所有 external positive lane 继续由 guard、owner contract 和 flow 决定。 | `pass` | 重开 Step 6/7/9/10，不能仅加 configuration switch。 |
| 依赖分类漂移 | compile/runtime/event/ref/adapter/fake 均保持原分类；当前 compile 为零 active dependency。 | `pass` | 重新核验全局关系、real package/type/path 与实施边界。 |
| entry 激活与 outbound 偷渡 | 没有 broker/topic/receipt、scheduler/run 或 publisher/outbox/topic 的配置面。 | `pass` | 先取得对应 owner authority，重开 Step 5/7/8/9/11~14。 |
| fake 越界 | FakeOnly 仅和显式 TestOnly composition 同时出现；production 发现 FakeOnly 即 Blocked。 | `pass` | 停止 production composition；重审 Step 7/14/16。 |
| recovery / concurrency 偷渡 | 没有 timeout/retry/retention/lease/TTL/repair/default config 使 B01/B02、B03、PF 或 DDD-S13 open item 失效。 | `pass_with_open_items` | 保持 fail closed；先重开对应 Step 并定义状态、UoW、version 和测试切口。 |

## 9. 正式 `03-详细设计.md` 回填草稿（禁止当前装配）

> 对应正式章节：第 13 章“配置引用与外部依赖绑定”。  
> 写入前门禁：项目台账必须允许正式 03 装配，03 flow 必须完成至 Step 19，且所有后续 Step 的回填均已批准。当前条件均不满足。

```md
## 13. 配置引用与外部依赖绑定

> 校准来源：
> - `design-calibration/03_ddd_step_14_config_dependencies.md`
> - `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> - `design-calibration/03_ddd_step_12_error_recovery.md`
> - `design-calibration/03_ddd_step_11_persistence_consistency.md`
>
> 延伸阅读：
> - 本章只定义代码绑定点和不可用时的语义上限。配置来源、优先级、格式、敏感值、实际值、环境矩阵和变更控制留给 future `04-配置设计`。

本仓只允许 planned `infra/config.rs` 与 `infra/runtime_builder.rs` 读取、校验或私有持有 raw configuration。contracts、domain、application、api、worker 与 jobs 只接收 typed business carrier、application port、assembled facade 或 safe boundary disposition，绝不接收 raw value、secret、endpoint、provider body 或 product selection。所有 logical binding 均无隐式默认：缺失、unknown、未验证或 authority 不匹配时必须 Blocked/Unknown；TestOnly 也必须显式选择。

### 13.1 配置引用表

| 逻辑配置引用 | 类型 / carrier | 读取或绑定模块 | 默认口径 | future 配置设计责任 |
|---|---|---|---|---|
| 已验证配置语境 | `ImageRuntimeConfigRef` | `infra/config.rs` 读取与校验；`infra/runtime_builder.rs` 消费 body-free ref。 | 无隐式 Bound；无合规 ref 即 Blocked。 | 来源、优先级、profile、redaction、加载校验与诊断。 |
| 组合模式与 fake 隔离 | `ImageFakeMode` | `infra/config.rs` 校验显式模式；`infra/runtime_builder.rs` 传入 assembly。 | 未选择不是 TestOnly；Production 加 FakeOnly 必须 Blocked。 | 测试 profile、隔离与变更控制。 |
| local truth/history/projection/idempotency 组合 | `ImageAdapterSlot` / `ImageAdapterAvailabilityMarker` 的 LocalStore slot | `infra/runtime_builder.rs` 向 repository、UoW、projection 与 idempotency implementation 注入。 | 缺 marker 或非 Available 不装配 write-capable composition。 | private store binding、故障策略和测试 profile；不写 physical backend 到 domain。 |
| mapping/component/seed/base 的 static reference 组合 | existing source/component/seed slot 与 `ImageAssemblyReferenceResolverPort` | `infra/runtime_builder.rs` 向 `source_adapters.rs` 注入。 | 缺 immutable ref 或 safe conclusion 即 blocked/unavailable/unknown/gap。 | owner-approved source/profile/redaction；不新增 mapping/body/seed/base owner schema。 |
| builder/registry conservative seam | BuildAndRegistry slot 与 `BuilderRegistryPort` | `infra/runtime_builder.rs` 向 `build_adapters.rs` 注入。 | 无产品 binding 或结果 unknown 时无 positive default。 | 产品、credential 和失败策略；Q-MI-003 未闭合前不配置 positive result。 |
| qualification/Artifact boundary | QualificationAndArtifact slot 与 `QualificationBoundaryPort` | `infra/runtime_builder.rs` 向 `qualification_adapters.rs` 注入。 | 缺 authority/Artifact contract 时保持 blocked/unavailable/unknown/gap/reopen。 | authority/profile/private binding；Q-MI-004 与 MI-UP-007 闭合前无 gate/Artifact payload。 |
| Member Service supply boundary | MemberServiceSupply slot 与 `MemberServiceSupplyPort` | `infra/runtime_builder.rs` 向 `supply_adapters.rs` 注入。 | consumer ref/confirmation 缺失时只有 ConsumerHandoffGap lane。 | consumer binding；MI-UP-001 闭合前无 manifest/endpoint/confirmation value。 |
| local composition availability | `ImageRuntimeAssemblyState` 与 `ImageAdapterAvailabilityPort` | `infra/config.rs` 和 `infra/runtime_builder.rs` 形成/读取 local marker。 | missing marker 不是 Available；Assembled 不是 runtime 或 consumer readiness。 | validation issue、profile validation和 test isolation；不记录 provider health/body。 |

### 13.2 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | timeout / retry 语义上限 | 不可用时降级 |
|---|---|---|---|---|
| local truth/history store | `infra/runtime_builder.rs` 到 `repositories.rs` | repository ports、`ImageUnitOfWorkManager` | 不定义 retry；store unavailable 前不得 begin write UoW。 | 当前 Command/Job 已在 B01/B02 停止；future 仅返回 existing Unavailable/TransactionBoundary，不 partial commit。 |
| projection/idempotency store | `infra/runtime_builder.rs` 到 `projection_store.rs`、`idempotency_store.rs` | projection、truth snapshot、idempotency/replay ports | 不定义 rebuild/retry/retention。 | Query 仅读 existing view，保留 stale/unavailable/gap；不 query-time repair 或 replay 重算。 |
| local clock/ID | `infra/runtime_builder.rs` 到 `clock_id.rs` | `ImageClockPort`、`ImageIdGeneratorPort` | 没有 provider retry。 | 在 local factory/mutation 前 fail closed；fake 只限 TestOnly。 |
| mapping/component/seed/base ref source | `infra/runtime_builder.rs` 到 `source_adapters.rs` | `ImageAssemblyReferenceResolverPort` | 不定义 resolver timeout/retry；unknown 不盲重查。 | 返回 blocked/unavailable/unknown/gap，受影响 baseline/revision 不正向推进。 |
| builder/registry | `infra/runtime_builder.rs` 到 `build_adapters.rs` | `BuilderRegistryPort` | 不定义 submit/inspect retry；unknown outcome 不重试。 | 仅 handoff/observation 安全分支；ACK/tag/cache 不形成 candidate、digest 或 availability。 |
| qualification/Artifact | `infra/runtime_builder.rs` 到 `qualification_adapters.rs` | `QualificationBoundaryPort` | 不定义 gate retry、priority 或 default pass。 | blocked/unavailable/unknown/gap/reopen；不形成 Passed、Eligible 或 Artifact Accepted。 |
| Member Service supply | `infra/runtime_builder.rs` 到 `supply_adapters.rs` | `MemberServiceSupplyPort` | 不定义 confirmation/manifest/lifecycle retry。 | ConsumerHandoffGap/unavailable/reopen；local entry 不改变 consumer state。 |
| conditional inbound / bounded job entry | `infra/runtime_builder.rs` | `ImageEntryBoundaryPort` | 无 broker redelivery、scheduler、lease、job retry 或 run policy。 | inbound 只重复 marker；Job Declared 仍在 B01/B02 停止；无 receipt/run/report。 |
| deterministic test fake | `infra/runtime_builder.rs` 到 `fakes.rs` | existing testable port implementations | deterministic only，不是 production retry 或 fallback。 | 只验证同一 negative/blocked/version/UoW/body-free parity；不得产生 evidence 或 readiness。 |

### 13.3 跨仓 Rust 与协作绑定

当前没有 active sibling Cargo dependency。只有 L0-core 是 conditional compile category；在 MI-UP-004 关闭且 package、crate、type、workspace member 与真实 path 重新核验前，不得写 Cargo.toml。其余关系均不能因配置或 local composition 变成 path dependency。

| 依赖边界 | 分类 | 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|
| L0-core | conditional compile | 当前无 Cargo；future 经重新核验后才可能采用 local path dependency。 | potential shared carrier consumer。 | 暂停 direct-type lane；不得 copy/shadow 或 config 绕过。 |
| L3-method-library | runtime + ref | `ImageAssemblyReferenceResolverPort` 的 body-free mapping ref/snapshot/gap。 | DefinitionAssembly、ReferenceDerived。 | MI-UP-003 下 blocked/unavailable/unknown/gap；不 hardcode Role/mapping。 |
| L2-runtime | ref | immutable runtime component release ref 或 safe conclusion。 | static assembly component reference。 | 缺 ref/compatibility 即 pin/baseline blocked；不导入 loop/checkpoint/live memory。 |
| L2-tools | ref | immutable tools/extras ref 或 safe conclusion。 | static assembly component/extras reference。 | 缺 ref/compatibility 即 blocked；不导入 tool execution/capability registry。 |
| L2-member | ref | future immutable member component ref 或 safe conclusion。 | static assembly component reference。 | MI-UP-002 下 gap/blocked；不猜 release shape/compatibility。 |
| L2-member-service | runtime + ref + adapter | `MemberServiceSupplyPort` 与 local ConsumerHandoffGap。 | SupplyEntry handoff/reconcile direction。 | MI-UP-001 下 gap/unavailable/reopen；无 manifest/ref confirmation/launch/health。 |
| L1-artifact | ref + adapter | `QualificationBoundaryPort` 与 local handoff gap。 | qualification/Artifact handoff。 | MI-UP-007 下不 mint Artifact ref、不 accept、不写 lineage。 |
| L4-sandbox | future-limited ref + adapter | future body-free base ref / approved adapter。 | future base-image reference only。 | MI-UP-008 下不装配 hardened base、不读 Sandbox policy/backend。 |
| L0-bus / inbound owner | conditional event | future owner-authorized worker adapter。 | worker conditional intake。 | MI-UP-005 下 marker-only；无 topic/envelope/receipt/dedup/broker activation。 |
| builder/registry/evidence/seed provider | adapter + ref | application port、blocked adapter 或 TestOnly fake。 | infra adapter matrix。 | non-positive output；不选产品、不伪造 request/response/digest。 |
| test support | fake | project-local TestOnly wiring。 | `infra/fakes.rs` 与 future tests。 | 不能用于 production；不改变 owner contract。 |

### 13.4 composition 与禁止配置化规则

private config source 只能经 `infra/config.rs` 校验为 body-free configuration context；`infra/runtime_builder.rs` 随后校验 required slot、fake mode 和 local implementation，再将 port implementation 注入 application facade 或 entry boundary。其唯一 verdict 是 local `ImageRuntimeAssemblyState` 的 Assembled 或 Blocked：它不启动 process、worker、scheduler 或 container，也不表示 external dependency、build、digest、gate、Artifact、Member Service 或 consumer success。

RoleDefinition/mapping body、image identity/history、necessary pin/no-latest、static/live 红线、runtime/tools/member/extras 正文、policy/memory/workspace live state、candidate/eligibility/availability、Artifact acceptance、consumer confirmation、state/UoW/version/recovery rules、dependency category、inbound activation 与 outbound publisher 均不可配置化。Configuration 不会解除 DDD-S9-B01/B02、DDD-S11-B03、DDD-S13-OPEN-01/02、PF-UNAVAILABLE-RECOVERY、MI-UP 或 Q-MI blocker。
```

## 10. 待确认事项、Step 15 handoff 与停审门禁

### 10.1 blocker 与待确认事项

本 Step 没有关闭、弱化或新增任何 owner contract；下表中的 blocker 仍按原 owner、原 reopen Step 和原 fail-closed 语义处理。

| ID | 当前影响 | 本 Step 后的处理 | 关闭或重开前提 |
|---|---|---|---|
| `DDD-S9-B01` | 所有 10 Command 与 6 Job 不能 canonicalize、reserve 或写入。 | configuration 不提供 canonical carrier/mapper；当前仍在 validation/context 后零 mutation。 | 重开 Step 7/8，闭合 per-protocol canonical carrier、field source 与 mapper。 |
| `DDD-S9-B02` | result save、complete 与 duplicate replay 不可实施。 | 不配置 result ref、body、shell 或 replay default。 | 重开 Step 6/7/8，闭合唯一 factory 与 shell/body consistency。 |
| `DDD-S11-B03` | AvailabilityTransition 既有 record 的 terminal/supersede 持久化语义不安全。 | configuration 不能选择 history update strategy；继续禁止 delete/reinsert/overwrite。 | 重开 Step 7/10，确定 versioned update 或 append-final-record model。 |
| `DDD-S13-OPEN-01/02` | existing Reserved/in-flight 语义与跨 channel/name namespace 尚未统一。 | 不引入 lease、TTL、cleanup、hot reload 或 global raw-key setting。 | 重开 reservation/store/recovery、identity 与 concurrency contract。 |
| `PF-UNAVAILABLE-RECOVERY` | ProjectionFreshness::Unavailable 没有正式恢复函数。 | 不用 profile/retry 开关构造 Unavailable 到 Rebuilding/Fresh。 | 定义 function、truth source、version/UoW 和 planned test cut 后重开。 |
| `MI-UP-001 / MI-UP-002` | Member Service consumer contract 与 member component release/compatibility 未停审。 | local supply/component slots 只能 blocked/gap/ref；无 manifest、confirmation 或 compatibility positive result。 | 对应 sibling 正式合同停审并完成双方校准。 |
| `MI-UP-003 / MI-UP-006 / MI-UP-008` | Method mapping、seed placement、hardened base 的 exact authority/shape 未闭合。 | 只允许 body-free ref、safe conclusion、static placement或 gap；永不接收 live body。 | 对应 owner formal ref/semantic/scope contract 后重审受影响 seam。 |
| `MI-UP-004 / MI-UP-005` | Core shared contract 与 inbound event authority/schema 未闭合。 | 当前没有 Core Cargo binding；worker 继续 marker-only。 | Core formal acceptance或 event owner formal schema/identity/dedup/receipt contract。 |
| `MI-UP-007 / MI-UP-009` | Artifact handoff 与 outbound event authority未闭合。 | Artifact 只能 Pending/Gap；outbound configuration inventory为零。 | Artifact consumable/lineage/acceptance contract，或 outbound owner/consumer/schema/delivery contract，并重开多个 Step。 |
| `Q-MI-001 / Q-MI-002` | restricted/read-only 与 multi-architecture scope 未裁定。 | 不以 profile 选择 Role、architecture enum 或 completion claim。 | 正式 scope/governance decision 后重开 affected variant design。 |
| `Q-MI-003 / Q-MI-004` | builder/registry/evidence product，以及 applicable gate inventory/priority 未闭合。 | 不写 product、endpoint、credential、gate list、default pass、digest/evidence/report。 | 正式 infrastructure/configuration 与 governance/Artifact authority。 |

### 10.2 Step 15 交接（仅输入，不自动进入）

| Step 15 可消费的输入 | 已由本 Step 提供 | Step 15 不得提前假设 |
|---|---|---|
| composition observation | local config validation、slot marker、Assembled/Blocked 的严格 local 含义，以及 redacted safe reason 边界。 | 已有 observability backend、log schema、metric、trace、audit record、report、evidence 或 readiness。 |
| sensitive-data boundary | raw config、secret、endpoint、provider body 不能进入 public/domain/store/error/fixture。 | 可以为了审计而记录 raw configuration 或 credential。 |
| error / recovery boundary | config/slot failure只走 blocked/unknown/unavailable/gap；unknown external outcome 不盲重试。 | retry/backoff、repair、lease、scheduler、outbound notification 或 automatic recovery 已被授权。 |
| dependency observation | compile/runtime/event/ref/adapter/fake 分类与 owner blocker 已明确。 | adapter availability 等于 external health、build success、gate pass、Artifact acceptance 或 consumer confirmation。 |

Step 15 如获用户明确确认，只能在上述输入上定义可观测性与审计的 planned contract；它仍不能借配置 slot 新增 outbound publisher、run/report/evidence、external backend 或 positive readiness。

### 10.3 完成检查与停审记录

- [x] 已按详细设计 Step 14 要求形成配置引用表、外部依赖绑定表和跨仓 Rust/协作绑定表。
- [x] 已明确只有 `infra/config.rs` 与 `infra/runtime_builder.rs` 可读取 raw configuration；其余模块的注入边界不变。
- [x] 已把 no-implicit-default、Production/FakeOnly 拒绝、Assembled 非 readiness 与 slot fail-closed 规则写为实现约束。
- [x] 已把每个外部依赖回指既有 port、adapter、event、ref 或 fake seam；没有把消费关系升级为 Cargo dependency。
- [x] 已复核 Step 3~13 与 02 配置影响轮廓；未新增对象、port、DTO、状态、event、outbox、publisher、scheduler、store、产品或外部 positive contract。
- [x] 已保留 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009` 与 `Q-MI-001~004`。
- [x] 未读取旧正式 03，未装配正式 03，未创建 04 或 Step 15，未实现代码、运行测试、创建实现仓、生成 run/report/digest/evidence/verdict/signoff/readiness 或提交 commit。

| 项目 | 记录 |
|---|---|
| Step 14 状态 | `completed_stop_review` |
| gate_status | `pass_with_explicit_blockers` |
| 已形成材料 | 配置控制面边界、logical config reference、runtime composition、slot fail-closed、外部依赖/跨仓分类、前序闭环审计、正式回填草稿、blocker ledger 与 Step 15 handoff。 |
| 正式文档状态 | `03-详细设计.md` 仍禁止写入；旧正式 03 仍未读取。 |
| 下一步 | 必须等待用户明确确认后，才可创建并进入 `03_ddd_step_15_observability_audit.md`。 |
| 提交 | 当前无需提交；未经用户明确要求不得提交。 |

```text
Step 14 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_15
formal_03_write_allowed = false_until_step_19
implementation_allowed = false
commit_required = false
```
