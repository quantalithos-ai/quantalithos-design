# L4-observability 04-配置设计 Step 01：确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节：`04-配置设计.md` §1
> 当前模式：`full-restart`
> 本步边界：只确认 current 上游、权威顺序、配置候选输入、不再回答的问题、必须回答的问题和输入充分性；不定义正式 key、默认值、来源优先级、环境矩阵、secret provider、加载实现或正式正文

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `04-配置设计.md` |
| 当前 Step | Step 01 `确认配置输入边界` |
| 当前模块 | `upstream-boundary-after-current-M3` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_01_upstream_boundary.md` |
| 用户授权 | 已明确要求开始完成 M4；按既定逐 Step 门禁，本轮只完成 `04` Step 01 |
| 当前模式 | `full-restart` |
| 写入状态 | `completed_current_design_record` |
| 自检状态 | `pass` |
| gate_status | `pass_waiting_user_before_step_02` |
| gate_reason | current `00~03`、配置 SOP/规范、historical `04` 现实和 L1 粒度参考均已读取；五个 SOP 问题、结构化输入、12 affected 传递、`03` 影响判定与回填草稿完整 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker / affected | I05 两项 `open_upstream_internal`、H13 `open_controlled` 与其余 9 项 inherited affected 保持开放；本 Step 不关闭、不补造 |
| implementation readiness | `blocked`；current `04~07`、目标仓、逐 boundary 审计、current implementation ledger/skeleton 和真实测试/evidence 未完成 |
| next_allowed_action | `stop_wait_user_confirmation_before_04_step_02` |

### 1.1 Step 内执行记录

| 序号 | 动作 | 结果 | 状态 |
|---:|---|---|---|
| 1 | 读取项目台账与 M3 current closure | 唯一进入点为 `04` full-restart Step 01 | done |
| 2 | 读取配置 SOP、书写规范和通用标准 | 固定五问、双表、历史后置、三层门禁与逐 Step 停审 | done |
| 3 | 读取 current formal `00~03` | formal `03` §13 是配置代码契约直接上游，§15~§17提供验证与 affected gate | done |
| 4 | 读取旧 formal `04`、旧 flow、旧 Step 01~15 | 全部登记为 pre-M3 historical material，不恢复旧完成状态 | done |
| 5 | 读取 L1-governance/L1-artifact Step 01 | 只采用结构和粒度，不复制相邻域配置语义 | done |
| 6 | 回答五个 SOP 问题并形成结构化产物 | 输入映射、禁止重答、必须回答、候选输入和影响判定已闭合 | done |
| 7 | 更新 flow / ledger 并停审 | 等待用户确认后才允许读取 Step 02 标准与输入 | done |

### 1.2 写入前与越界检查

| 检查项 | 结论 |
|---|---|
| 项目级门禁 | pass；用户已解除 M3 到 `04` 的文档切换门禁 |
| 文档级门禁 | pass_for_step_01_only；不得恢复旧 Step 10 current 状态 |
| Step 级门禁 | pass；先完成标准和 current 上游读取，再写本产物 |
| 正式 `04` | 未修改；旧 292 行正文保持 historical material，Step 15 前不得装配 |
| 未来 Step | 未读取 Step 02 专项材料，未写 Step 02~15 current 结论 |
| 实现资产 | 未修改旧 implementation ledger/boundaries；它们继续是 historical material |
| 真实性 | 未实现代码、未运行测试、未创建真实 artifact/report、未伪造 commit/run_id/evidence/signoff |

## 2. 本步目标与输入

### 2.1 本步目标

本步只回答三个边界问题：

1. 哪些 current 上游结论必须进入 `04`，并由后续配置 Step 继续展开。
2. 哪些业务、架构、代码和实施问题已经有唯一 owner，`04` 不得重新定义。
3. 上游材料是否足以进入 Step 02；若有缺口，缺口阻塞哪一段，而不是用配置默认值掩盖。

本步不判断 P0/P1/P2，不形成配置域最终清单，不指定 JSON key、ENV key、默认值、数值范围、产品、provider、profile、热更新或回滚方案。

### 2.2 规范输入

| 输入 | 本步采用内容 |
|---|---|
| `配置设计讨论流程_SOP.md` | Step 1 五问、输入映射、不再回答/必须回答、`03` 影响判定、逐 Step 停审 |
| `配置设计书写规范.md` | §5.1 的上游映射表和详细设计影响表；正式 15 章主链；配置不替代代码契约 |
| `设计文档讨论中间产物规范.md` | full-restart、三层恢复、historical 后置审计、Step 独立、写入前门禁 |
| `设计文档编写通则.md` | 正式正文只承载收口结论；配置域先小循环再跨域审计 |
| `设计真相源闭环与可落码性标准.md` | 配置字段、reader、builder、adapter、failure 与 boundary 必须有唯一 owner；缺口不得交给实现者猜 |
| `全局项目依赖关系与裁剪规则.md` | L4-observability 只保留允许的编译/运行/事件协作边界，不以配置制造 sibling compile edge |

### 2.3 项目输入与权威身份

| 输入 | 当前身份 | 本步读取目的 | 禁止用法 |
|---|---|---|---|
| `00-需求文档.md` | current requirement baseline | truth/no-write、forbidden material、NFR、安全、审计和验收方向 | 不从需求文字发明 key、type、数值或产品 |
| `01-架构设计.md` | current architecture baseline | 仓边界、依赖裁剪、运行单元、外部协作、产品中立与失效边界 | 不重选架构或让配置接管业务 truth |
| `02-概要设计.md` | current HLD baseline | 组成部分、配置影响轮廓、禁止配置化边界与下游承接 | 不把概要对象当代码 schema |
| `03-详细设计.md` §13 | direct typed config baseline | owner、10 sections、binding、catalog、snapshot、builder、validation、entry slice | 不改 struct/enum/trait/function/error/flow |
| `03-详细设计.md` §14~§15 | telemetry/test input | redaction、correlation、audit/no-write 与 planned config/runtime test cuts | 不声称测试已运行或 sink 是 truth |
| `03-详细设计.md` §16.10/§17 | affected/readiness baseline | 12 项 inherited activation gate、未关闭前行为和关闭 owner | 不用配置 alias/default/disable 成功关闭 affected |
| `03_ddd_step_14_config_external_binding.md` | current detailed calibration source | formal §13 的字段级和 builder 级解释 | 不高于 formal `03`，冲突时以 formal 为准 |
| 旧 `04-配置设计.md`、旧 flow、旧 Step 01~15 | `historical_material_pre_current_M3` | 识别旧 key/profile/value/source/gate 冲突 | 不恢复旧 pass/current 指针或技术结论 |
| 旧 `05/06/07` 与旧 implementation assets | historical downstream reality | 识别后续测试、验收、实施方向和过期 ID | 不反向定义 current `04`，不作为 kickoff 资产 |
| L1-governance/L1-artifact `04` Step 01 | granularity reference | 对齐固定结构、问题深度和停审口径 | 不复制 governance/artifact truth、key 或 provider |

### 2.4 真相源优先级

```text
current standards
  -> current formal 00 -> 01 -> 02 -> 03
  -> current 03 calibration referenced by formal 03
  -> current 04 Step artifacts, one confirmed Step at a time
  -> formal 04 assembled only by current Step 15

old README / old formal 04~07 / old 04 Step files / old implementation assets
  -> historical diagnosis only

L1/L0 reference projects
  -> structure and granularity only
```

正式 `03` 已固定代码层的 typed configuration contract。`04` 后续可以定义 external representation、来源、优先级、环境映射、合法值和失效策略，但不能通过配置改变 protocol、状态、事务、truth ownership、redaction/no-write 或 external token/probe 语义。

## 3. SOP 问题回答

### 3.1 当前配置设计要承接哪些需求、非功能、安全和环境差异？

| 承接面 | current 上游结论 | 后续 `04` 必须展开 | Step 01 保持未决定 |
|---|---|---|---|
| truth ownership | Observability 只拥有观测事实、审计投影、body-free linkage、local marker、handoff/export/maintenance projection | 证明所有 source/profile/binding 都不能扩大写 authority | 不新增 business truth、source mutation 或第二权威状态 |
| forbidden material | raw log/metric/trace、source audit/evidence/artifact body、provider response、credential 不得进入 public/domain/store/telemetry/report | redaction、allowlist、secret locator、scanner 与 no-output 配置边界 | 不创建 `allow_raw_body`、关闭 scanner 或泄露 secret 的开关 |
| correlation/evidence | correlation id、evidence linkage、retention marker、report handoff 都是可审计 linkage，不是业务 verdict | source、mapping、binding revision、retention/handoff 的配置承接 | 不把 correlation/evidence alias 变成 truth 或 acceptance evidence |
| availability | Disabled/Misconfigured/Unavailable/Degraded 必须显式，不能 silent fallback/fake success | 各配置缺失、无效、provider 不可用时的 exact 策略 | 不改 formal error/outcome enum |
| consistency | accepted UoW、reservation/result、claim/fence、stable token/probe、immutable Job snapshot 不得被配置绕过 | timeout、lease、retry、retention、limit 等 bounded value 的来源与 gate | 不改 save order、idempotency key/digest 或 external phase |
| auditability | config/binding revision、activation/change/rollback 必须可解释且 body-free | config identity、change authority、activation、rollback 与 historical binding policy | 不伪造 durable audit/event/evidence owner |
| dependency | `L0-core`/共享契约是允许编译边；bus/OTel/store/provider 是运行或事件协作 | product-neutral locator/capability/catalog 和 selected binding | 不通过配置引入 sibling Cargo/path dependency |
| environment | code 层固定 `LocalTest`/`IntegrationLike`/`RuntimeLike` 三类 runtime class | 实际 environment/deployment profile 到 runtime class 的映射 | 不恢复旧 profile 字符串或假定 prod/staging 拓扑 |
| NFR | 安全、可追溯、幂等、bounded work 是硬约束；没有可信的现成 P95/retention days | 数值来源、hard bound、环境差异与下游验证入口 | 不继承 README 或旧 `04` 数字 |

结论：本项目需要完整配置设计。formal `03` 已存在 10 个 typed section、external catalog、entry registration、Job snapshot 和 complete-or-error runtime builder，因此不适用“无配置项目”裁剪路径。

### 3.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计？

| candidate input family | formal `03` 已固定 | `04` 后续仍须回答 |
|---|---|---|
| config identity/raw source | `ConfigBindingRef`；raw 仅归 `infra::config`；validated root body-free | JSON shape、source allowlist/precedence、unknown field、revision identity |
| `technical` | clock/ID mode与binding；test/runtime-like约束 | external representation、required/default、profile mapping |
| `boundary` | request/page/query timeout/schema set使用 positive/bounded type | key、default、range、override与缺失行为 |
| `safety` | redaction/source allowlist/safe label/correlation/visibility/body-free scanner policy refs | locator/source/sensitivity、environment差异、fail-closed和no-output |
| `stores` | observation/projection/idempotency-result/job store binding、transaction timeout、schema revision | binding source、capability gate、compatibility和migration输入 |
| `digest` | write v1/readable set与retire-old不变量 | raw表示、dual-read/switch-write/retire配置生命周期 |
| `idempotency` | Command/Consumer/Job/reconciliation/intent technical retention | exact duration、hard bound、source；不得授权source cleanup |
| `projection` | capture/relation closure、batch limits、freshness policy | exact bounded values、environment/profile与snapshot规则 |
| `execution` | lease/heartbeat、parallelism、plan limit、retry、Job timeout | values、backoff/jitter、schedule、exhaustion与profile |
| `external` | resolver/publisher/event/handoff/export typed binding与phase capability | locator/target/transport/credential refs、rotation和capability validation |
| `entries` | enabled sets、9 Consumer bindings、Job schedules、outbox loop；entry只收 locator-free slice/registrar | source/profile、complete mapping、disabled/startup-fail与registration policy |
| runtime builder | 13-stage complete-or-error assembly和既有 startup errors | loading/validation/activation/rollback策略；不得新增stage或partial runtime |
| Job snapshot | relevant immutable subset进入plan digest，resume只读stored snapshot | 哪些配置进入各 Job snapshot、old binding保留和兼容窗口 |
| runtime/event collaboration | compile/runtime/event协作已裁剪 | product-neutral selected locator与capability；不得生成新的compile edge |

这些是候选输入族，不是 Step 03 的最终配置域，也不是 Step 07 的配置项清单。后续不得为了减少配置项而把 owner 不同、reader 不同或 failure 不同的 section 合并成一个无类型 `runtime/common` map。

### 3.3 哪些测试和验收场景依赖配置矩阵？

| 场景族 | current 来源 | `04` 需要交给下游的矩阵输入 | 当前事实状态 |
|---|---|---|---|
| owner/source isolation | formal `03` §15.8 | 每种 source 的唯一 reader、raw/validated/entry exposure | planned/not_run |
| validation order | formal `03` §13.8/§15.8 | parse/type/range/cross-field/redline/capability/complete assembly顺序 | planned/not_run |
| redline not switchable | formal `03` §13.9 | 所有环境均禁止出现的 override/key/variant | planned/not_run |
| catalog totality | formal `03` §13.5~§13.7 | enabled protocol/event/job到exact binding的完整唯一映射 | planned/not_run |
| store capability | formal `03` §13.6/§15.8 | atomic UoW/unique/CAS/fence等profile capability要求 | planned/not_run |
| historical binding | formal `03` §12/§13 | old/new binding、drain、rollback、probe/manual组合 | planned/not_run |
| Job snapshot resume | formal `03` §12.6/§13.5 | start/resume/finalize固定snapshot与binding的组合 | planned/not_run |
| sensitive locator | formal `03` §13/§14 | secret source、provider outage、rotation、redaction/no-output | planned/not_run |
| complete runtime | formal `03` §13.8 | startup-required/optional/disabled依赖组合和zero-partial结果 | planned/not_run |
| availability surface | formal `03` §11/§13.6 | Disabled/Misconfigured/Unavailable/Degraded的不同期望结果 | planned/not_run |
| dependency/no-write | formal `01`与formal `03` §15 | profile不能引入非法compile edge或source write | planned/not_run |
| requirement VETO | formal `00` | raw body、truth write、retention/handoff越权在所有配置组合下均拒绝 | requirement direction only |

旧 `05/06` 的 case/AC/evidence ID 不是 current truth。Step 12 只能把上述矩阵方向交给未来 current `05/06`，不能在 `04` 声称测试通过、验收签署或 evidence 已存在。

### 3.4 哪些内容不应在配置设计中重新定义？

| 禁止重定义 | current owner | `04` 唯一允许的承接 |
|---|---|---|
| 仓定位、truth ownership、source no-write | formal `00/01` | 作为所有配置源/profile的不可变红线 |
| crate/module/file owner与依赖方向 | formal `03` §4~§6 | 说明 raw source 只由 `infra::config` 读取，不改 owner |
| 60 public protocols及二级类型 | formal `03` §7~§8 | 配置 enabled/binding subset，不增删或合并 schema |
| 27 正式状态 owner/transition | formal `03` §9 | 提供 validated policy input，不配置状态 variant/transition |
| logical store、UoW、cursor、accepted save order | formal `03` §10 | 选择符合 capability 的binding，不改事务语义 |
| error/recovery/public surface | formal `03` §11 | 将配置失败映射到既有 typed surface，不新建平行 error |
| key/digest/claim/fence/token/probe | formal `03` §12 | 提供 bounded 参数与capability，不允许关闭或替代 |
| typed root、10 sections、entry slices/registrars | formal `03` §13 | 定义 external representation/source/value，不改代码字段语义 |
| telemetry/audit schema与non-authority | formal `03` §14 | 绑定安全sink/capability，不让telemetry成为truth/evidence verdict |
| suite/case/fixture、AC/VETO裁决、evidence/signoff | future current `05/06` | 提供配置矩阵和前置条件，不生成执行结论 |
| phase/commit boundary、部署命令、runbook | future current `07`/运维文档 | 提供配置准备/change/rollback语义，不写执行动作 |
| product/provider SDK | ADR/受控选型/implementation | 保持 product-neutral locator/capability，不假定产品 |

### 3.5 当前上游是否存在会阻塞配置设计的缺口？

| 检查项 | 当前判断 | 阻塞范围 | 本 Step 处理 |
|---|---|---|---|
| current formal `00~03` 主链 | 一致，足以开始 `04` | none | 作为唯一 current 上游 |
| exact key/source precedence/environment mapping | 尚未定义，属于 `04`职责 | Step 03~07 | 不在 Step 01 猜测 |
| exact duration/limit/retry/retention值 | 尚未定义，属于配置与下游验证闭口 | relevant config domain | 只保留 positive/bounded/fail-closed约束 |
| physical store/transport/OTel/provider产品 | 未选，不阻塞 product-neutral config design | 对应真实 adapter boundary | 记录 locator/capability 候选，不引入 SDK |
| current `05/06/07` | 未重建 | 阻塞 test/acceptance/implementation readiness，不阻塞 Step 02 | 旧文档仅作 historical direction |
| target implementation repo | 尚未建立/审计 | implementation kickoff | 留给 current `07` precondition |
| I05 payload schema/binding | 两项 `open_upstream_internal` | I05 positive decode/registration/accepted path | slot不激活或startup fail closed；配置不得补 schema/binding |
| H13 positive execution | `open_controlled` | J06 positive execution/completion/audit write | 保持 Blocked/manual与zero fabrication |
| 其余 9 inherited affected | open activation gates | 各自 boundary | 保留 exact owner/未关闭前行为，不视为 Step 01 blocker |
| 是否立即回写 `03` | 本 Step 没有新增代码契约 | none | `无回写`；后续发生签名/owner/flow变化才登记 |

本轮新发现上游 blocker=`none`。这只表示输入足以进入 Step 02，不表示 inherited affected 已关闭，也不表示配置项、产品、测试、验收或实现已经 ready。

## 4. Historical material 差异诊断

| 旧材料位置 | 旧结论/状态 | current 判断 | 冲突原因 | 后续处理 |
|---|---|---|---|---|
| 旧 `04_config_calibration_flow.md` 顶部 | Step 10完成、等待Step 11 | historical checkpoint | 该链早于current M3 formal `03`，不能跨新正式基线续跑 | current flow从Step 01重建 |
| 旧 Step 01~10 | 曾标 current/pass | historical material | 输入基线、affected/readiness和恢复点早于M3；完成状态无效 | 每个Step获确认后全量重建 |
| 旧 Step 11~15 | 物理存在或待启动 | historical material | 未经本轮逐Step门禁，不能作为current | 进入对应Step后后置审计 |
| 旧 formal `04` | 292行完整正文 | historical material | 来自旧自动装配链，不是current Step01~14的收口 | Step15前不修改，Step15全量替换 |
| 旧 formal §5 | CLI/env/file/secret/default固定优先级 | unverified historical choice | 未按current配置域、source owner与secret locator边界审计 | Step05重新讨论 |
| 旧 formal §6 | old local/CI/integration/operations profile | stale naming | 未与`RuntimeProfileClass`建立current typed mapping | Step06重新讨论 |
| 旧 formal §7 | `observability.*` key、26项值和历史数值 | stale/unsafe | key命名、默认值、范围和owner缺current来源，部分把redline变开关 | Step04/07逐项重建 |
| 旧 formal §7 | `forbidden_body_scan=true`、`protect_active_consumers=true`等 | forbidden configuration | formal `03`禁止把truth/no-write/redaction/retention guard配置成可关闭 | Step04登记禁止项 |
| 旧 formal/README | OTel/Prometheus/Grafana/TimescaleDB等产品 | historical candidate only | current架构要求product-neutral，未有current ADR | 不进入Step01结论 |
| 旧 `05/06/07` | 旧TC/AC/evidence/phase ID | historical direction only | current正式链尚未重建，且不能反向定义`04` | Step12只承接方向，不复用通过状态 |
| 旧 implementation ledger/boundaries | 16个boundary skeleton和旧恢复状态 | historical material | 创建时点早于current `07`，不能用于实施恢复 | current `07`完成时重建全部planned skeleton |

旧材料的存在不构成 current 进度。后续每个 Step 必须先读取 current 标准和上游，再读取对应旧 Step 做差异审计；不得整批恢复旧 Step 02~10。

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 对比项 | pre-M3 旧链 | current Step 01 | 选择理由 |
|---|---|---|---|
| 恢复位置 | 从旧 Step 10等待Step 11 | 从Step 01重新确认输入 | formal `03`已在M3重装，配置直接上游发生基线切换 |
| 配置主语 | 旧log/metric/trace/audit schema和26个key | typed root、10 sections、binding/catalog/snapshot/builder | 配置必须承接代码契约而非先列key |
| truth状态 | 旧flow宣称上游blocker none且Step01~10 current | no new blocker；12 inherited affected显式保留 | “可继续配置设计”不等于positive boundary可激活 |
| source/profile/value | 已经固定旧优先级、profile和数字 | 全部留给Step05~07逐域审计 | Step01只确认输入，不提前作配置结论 |
| 下游文档 | 旧05~07被当作可引用结果 | 仅historical direction | current文档链必须按04->05->06->07重建 |
| implementation资产 | 旧ledger/skeleton看似可恢复 | historical，current 07完成时重建 | 避免实现agent从过期boundary开工 |
| 正式正文 | 旧04已装配 | 保持historical且不修改 | formal只允许Step15从current Step01~14装配 |

### 5.2 关键设计取舍

| 取舍 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| 配置输入组织 | 先按typed owner/reader/builder识别候选族 | 从ENV/key大表反推控制面 | 防止raw key成为第二代码契约 |
| affected处理 | 保留owner、阻塞范围和未关闭前行为 | 用disabled/default/placeholder声明关闭 | 配置不能补上游schema、owner或flow |
| 产品选择 | product-neutral locator/capability | 直接固定OTel/vendor/store/bus产品 | current架构没有相关ADR，且产品不是truth |
| 数值处理 | 后续逐项给出来源、hard bound和验证去向 | 恢复README/旧04数字 | historical数字无current权威来源 |
| 配置失效 | 映射既有startup/availability/recovery surface | 新建04专属error/state | 代码错误契约只能由03拥有 |
| 下游方向 | 输出matrix/precondition给current 05/06/07 | 在04生成case/verdict/commit/evidence | 保持文档职责边界和真实性 |

## 6. 结构化中间产物

### 6.1 上游输入映射表

| 来源文档 | 配置输入 | current锚点 | 后续展开章节 |
|---|---|---|---|
| `00-需求文档.md` | truth/no-write、body-free、redaction、correlation、evidence linkage、retention/handoff、安全、NFR与VETO方向 | current正式需求中的范围、边界、NFR、验收方向 | §2、§4、§8、§11、§12 |
| `01-架构设计.md` | 仓依赖裁剪、运行单元、外部协作、数据ownership、product-neutral和失效原则 | §4~§8及风险/决策 | §2~§6、§8~§11 |
| `02-概要设计.md` | 组成部分、接口/外部依赖轮廓、配置影响与禁止配置化项 | current HLD配置和下游承接章节 | §2~§4、§12 |
| `03-详细设计.md` §13 | raw/validated/entry三层、typed root、10 sections、catalog、snapshot、builder/validation | §13.1~§13.10 | §3~§11、§13 |
| `03-详细设计.md` §11~§12 | startup/availability/recovery、idempotency、claim/fence/token/probe、historical binding | §11~§12 | §7、§9~§11、§13 |
| `03-详细设计.md` §14 | log/metric/trace/native audit、redaction、correlation/evidence/retention/handoff、recursion | §14.1~§14.11 | §4、§7~§12 |
| `03-详细设计.md` §15 | config/runtime/security planned test cuts | §15.8~§15.9 | §6、§7、§11~§12 |
| `03-详细设计.md` §16~§17 | handoff、12 affected、14 risks、12 questions、implementation blocked | §16.5~§16.10、§17 | §1、§2、§9~§14 |
| old `05/06/07` | negative config、environment、VETO、boundary方向 | historical only | §12只记录handoff，不继承ID/结论 |

### 6.2 配置设计不再回答的问题

| 不再回答的问题 | 唯一owner | `04`中的处理 |
|---|---|---|
| Observability拥有何种truth、是否可反写source | formal `00/01` | 作为不可配置红线引用 |
| 60协议的schema、callable、flow和owner | formal `03` §6~§8 | 只绑定enabled subset和runtime slot |
| 27状态机、合法转换和same-UoW副作用 | formal `03` §9~§10 | 只提供validated参数和capability gate |
| error/recovery/public response enum | formal `03` §11 | 配置失败总映射到已有surface |
| idempotency key/digest/frame、claim/fence/token/probe算法 | formal `03` §12 | 仅定义允许的bounded配置输入 |
| root struct、typed section、reader/builder/registrar签名 | formal `03` §13 | 定义external representation，不改变签名 |
| telemetry/audit schema、field allowlist和truth authority | formal `03` §14 | 绑定sink/capability，不能扩字段或权威 |
| 测试如何运行、什么case通过 | future current `05` | `04`只提供配置矩阵 |
| 什么结果算验收通过、evidence如何签署 | future current `06` | `04`只提供门禁输入 |
| phase、commit boundary、部署命令和实现恢复 | future current `07`/运维文档 | `04`只提供配置准备/change/rollback语义 |

### 6.3 配置设计必须回答的问题

| ID | 必须回答的问题 | 目标 Step | 不回答的后果 |
|---|---|---:|---|
| CFG-Q-001 | 哪些控制面/配置域在本轮范围内，P0/P1/P2如何裁剪？ | 02~04 | 配置项无边界、redline可能变开关 |
| CFG-Q-002 | raw source、reader、external representation和source precedence是什么？ | 03、05、07 | 多reader漂移或runtime读取env/secret |
| CFG-Q-003 | environment/deployment profile如何映射三种`RuntimeProfileClass`？ | 06 | test-only mode可能进入runtime-like |
| CFG-Q-004 | 每项key/type/default/required/range/scope/effect/failure/reader是什么？ | 07 | 实现者被迫猜值或构造无类型map |
| CFG-Q-005 | 哪些是secret locator，如何解析、轮换、审计且绝不输出material？ | 08 | credential泄漏或错误fallback |
| CFG-Q-006 | parse/type/range/cross-field/redline/capability/assembly/entry activation顺序是什么？ | 09 | partial runtime或错误优先级漂移 |
| CFG-Q-007 | startup/restart/change/rollback/drain/retirement由谁发起和审计？ | 10 | config revision和old binding不可追溯 |
| CFG-Q-008 | 缺失、无效、冲突、不可达、漂移和旧binding丢失如何fail？ | 11 | silent fallback/fake success/重复external effect |
| CFG-Q-009 | current 05/06/07需要哪些matrix、gate、precondition和运维handoff？ | 12 | 下游无法构造完整suite/AC/boundary |
| CFG-Q-010 | schema/key/profile/binding如何迁移、兼容和废弃？ | 13 | resume/replay读取旧material时漂移 |
| CFG-Q-011 | 哪些风险、open question和`03`回写阻塞formal 04？ | 14 | 正式装配隐藏未决项 |

### 6.4 初始候选配置输入族

| Candidate ID | 候选输入族 | typed owner/consumer | 核心边界 | 后续首个owner Step |
|---|---|---|---|---:|
| CFG-IN-01 | config identity与ordinary raw source | `infra::config` -> validated root | raw只在infra；unknown/conflict不可静默 | 03/05 |
| CFG-IN-02 | technical clock/ID binding | technical builder | test-only不得进入runtime-like | 03/06 |
| CFG-IN-03 | request/query/boundary limits | boundary section/readers | positive/bounded；不能改变协议schema | 03/07 |
| CFG-IN-04 | safety/redaction/correlation/visibility/body-free policy refs | safety validators/application pure policy | redline不可关闭；material不得输出 | 03/04/08 |
| CFG-IN-05 | four logical store bindings与transaction/schema capability | repository/UoW builder | no silent in-memory fallback；atomic capability required | 03/06/07 |
| CFG-IN-06 | digest write/read compatibility | digest builders/loaders | retained profile不可移除；不覆盖旧digest | 03/07/13 |
| CFG-IN-07 | technical idempotency/result/intent retention | reservation/result/intent adapters | 不授权source cleanup | 03/07 |
| CFG-IN-08 | projection batch/freshness/rebuild parameters | projection services/jobs | bounded work；不升级truth/freshness | 03/07 |
| CFG-IN-09 | execution lease/heartbeat/parallelism/retry/timeout | Job/maintenance/publication services | fence/token/probe不可配置掉 | 03/07 |
| CFG-IN-10 | resolver/publisher/event/handoff/export binding catalogs | infra adapter registry/safe application catalog | product-neutral；phase capability complete | 03/07/08 |
| CFG-IN-11 | entry enabled sets、Consumer registration、Job schedule、outbox loop | runtime builder + entry registrars | locator-free entry；group atomic activation | 03/07/09 |
| CFG-IN-12 | runtime activation/change/rollback/historical binding | host/process composition | complete-or-error；old snapshot不读current binding | 09/10/13 |

这些 Candidate ID 只用于当前 calibration 追踪，不是外部配置 key、代码 enum、测试 ID 或验收 ID。

### 6.5 Inherited affected 的配置承接

| Affected ID | 当前状态 | `04`相关面 | 未关闭前配置行为 | `04`是否可关闭 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | schema allowlist、Consumer slot | 不激活；parse/UoW/ack前fail closed | 否；只记录owner-backed closure输入 |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | producer allowlist/registration | disabled或startup fail；zero write | 否；需上游producer owner |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 enabled/schedule/activation | 保持Blocked/manual；zero fabrication | 否；需H13 owner决定 |
| `R06-F-AFFECT-UOW-01` | `inherited_affected` | store capability/transaction config | 不能改accepted save order | 否；`07`逐boundary audit |
| `S08-RECOVERY-CLASS-OWNER-01` | `inherited_affected` | failure/retry config | 未分类fail closed，不用retry default猜 | 否；`03/05/07` mapper audit |
| `R07-EXTERNAL-PHASE-LINK-01` | `inherited_affected` | external binding/capability | link不完整不调用external target | 部分提供binding record，不能单独关闭 |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `inherited_affected` | retry/probe/capability | same token；Unknown probe/manual，禁止blind retry | 部分提供capability audit，不能单独关闭 |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `inherited_affected` | event/Consumer mapping | 无same-UoW snapshot则不启用positive write | 否；`03/07` vertical slice |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `inherited_affected` | worker completion policy | 不ack success；probe后controlled retry/manual | 否；`03/05/07` gate |
| `S08-JOB-REPORT-REF-OWNER-01` | `inherited_affected` | Job enabled/schedule/finalize | 缺owner不得完成Job，不配置假ref | 否；`03/07` Job slice |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `inherited_affected` | public schema/binding validation | 不用alias/default/private duplicate | 否；`03/07` owner/compile audit |
| `03-RPR-S09-PER-FLOW` | `inherited_affected` | enabled surface到handler/flow mapping | exact flow未审计不得因配置完整宣称ready | 否；`07` per-boundary audit |

### 6.6 配置输入边界图

图类型：配置输入与权威边界图
图标题：Current formal design 到配置控制面的单向承接

```text
current 00 requirements
  truth / VETO / NFR / forbidden material
              |
current 01 architecture
  ownership / dependency / runtime boundary
              |
current 02 HLD
  component and configuration impact outline
              |
current 03 detailed design
  typed root / 10 sections / builder / binding / affected gates
              |
              v
current 04 calibration, one Step at a time
  external shape -> source -> profile -> item -> secret
  -> validation -> change -> failure -> handoff -> evolution
              |
              v
future current 05 / 06 / 07
  tests       acceptance       implementation boundaries

Historical 04~07 and implementation assets ----X----> current truth
Reference projects -----------------------------> structure only
```

- 箭头是设计承接，不是运行调用或仓依赖。
- `04`只具体化配置控制面，不能逆向修改truth、协议、状态或事务。
- 12项affected沿唯一owner和activation gate传递，不因配置项存在而关闭。
- current `05/06/07`必须在各自full-restart后才能成为下游正式真相源。

### 6.7 输入完整性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| current `00~03`均可读取且顺序一致 | pass | formal `03`明确承接current `00~02`并已完成M3全文门禁 |
| 代码配置owner可回指 | pass | formal `03` §13固定raw/validated/entry、typed sections和builder |
| safety/no-write/truth边界可回指 | pass | formal `00/01`与formal `03` §13.9/§14 |
| 下游配置测试方向可回指 | pass_with_future_handoff | formal `03` §15有planned cuts；current `05`尚未重建 |
| affected未被隐藏 | pass_with_affected_open | 12项逐项保留，I05/J06 positive仍reserved/blocked |
| historical材料未成为current | pass | 旧04~07/ledger/skeleton仅作差异诊断 |
| orphan candidate input | none_at_step_01 | 12个候选族均有typed owner、reader或后续Step |
| 重复truth owner | none_introduced | 本Step不新增schema/type/key/error/state |

## 7. 对详细设计的影响判定

### 7.1 当前判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 以formal `03` §13的typed root、10 sections、binding/catalog/builder为直接输入 | 否 | 只承接既有代码契约 | n/a | 无回写 |
| 旧04 key/profile/value/source order全部降为historical | 否 | 移除过期配置结论，不改代码契约 | n/a | 无回写 |
| 12项affected必须继续阻塞对应activation boundary | 否 | 传播formal `03` §16.10/§17既有门禁 | n/a | 无回写 |
| current 05/06/07和implementation assets尚未建立 | 否 | 下游readiness状态 | n/a | 无回写 |
| Step01不选择product/provider或新增配置field | 否 | 边界声明 | n/a | 无回写 |

当前没有`待回写`或`阻塞待确认`项。该结论只适用于Step01；后续每个配置域/配置项仍须独立执行影响判定。

### 7.2 后续必须触发 `03` 回写的条件

| 触发条件 | 必须回写的设计面 | 未回写前门禁 |
|---|---|---|
| 新增/删除/重命名typed root section或字段 | formal `03` §5/§6/§13 | 阻塞对应配置域和formal `04` |
| reader从`infra::config`扩散到application/entry | module contract、dependency、flow | 阻塞；不得以便利性接受多reader |
| 新增adapter constructor参数、port、error或builder stage | formal `03` §5/§11/§13 | 阻塞；不得只写在04 |
| 允许reload/hot update或partial activation | runtime flow、state/error/concurrency | 阻塞；需完整回归详细设计 |
| 新增public profile/schema/DTO/wire token | contracts/protocol/compatibility | 阻塞；04不能拥有public type |
| 改变UoW、idempotency、claim/fence、token/probe或Job snapshot | formal `03` §10~§13 | 阻塞；配置不得绕过不变量 |
| runtime telemetry sink取得业务authority或durable audit ownership | formal `03` §14 | 阻塞；违反truth/no-recursion边界 |

## 8. 正式 `04` §1 回填草稿

> 本节只是 Step 15 的可追溯草稿；本轮不得写入正式 `04-配置设计.md`。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“对详细设计的影响判定”和“待确认事项”，了解本章如何隔离pre-M3 historical配置材料并从current正式`00~03`收敛配置输入。

| 来源文档 | 配置输入 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | truth/no-write、forbidden material、安全、NFR与验收方向 | 配置红线、敏感边界、失效与下游矩阵 |
| `01-架构设计.md` | 仓边界、依赖类型、运行单元、外部协作和product-neutral原则 | source、profile、binding、capability与availability |
| `02-概要设计.md` | 组成部分、配置影响轮廓和禁止配置化边界 | 配置控制面、范围和分类 |
| `03-详细设计.md` | typed root、10 sections、runtime builder、adapter/catalog、entry registration、Job snapshot、telemetry与12项activation gate | external shape、来源、环境、配置项、secret、加载生效、变更、失效、下游承接和演进 |

配置设计只具体化配置控制面，不重新定义协议、状态、事务、error、truth ownership或代码签名。旧`04~07`和旧implementation assets仅为historical material；current正式`04`只在Step 15由本轮Step 01~14装配。

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本章只确认current配置输入、权威顺序和禁止重定义边界 | 否 | 承接既有typed contract | n/a | 无回写 |
| 12项inherited affected保持原状态并继续约束activation | 否 | 传播既有门禁 | n/a | 无回写 |
```

## 9. 待确认事项

| ID | 待确认事项 | 当前建议 | 决策 owner/Step | 未确认前处理 |
|---|---|---|---|---|
| CFG-OQ-01 | Step02如何划分本轮P0/P1/P2与非范围 | 以typed runtime可启动和安全红线为P0候选，不在Step01定案 | 用户 + Step02 | 不提前建立配置域 |
| CFG-OQ-02 | 12候选输入族是否在Step03拆成多少配置域 | 按owner/reader/failure/activation边界拆分，不按key前缀合并 | Step03逐域停审 | Candidate仅作输入索引 |
| CFG-OQ-03 | actual environment/deployment profile集合 | 必须映射三种runtime class且不能恢复旧字符串 | Step06 | 只使用typed class称谓 |
| CFG-OQ-04 | product/provider/secret system选择 | 保持product-neutral，选型需current依据 | Step08/07或ADR | 不写vendor、SDK或真实locator |
| CFG-OQ-05 | exact numeric baseline与hard range来源 | 逐配置项给出design/operational/test来源 | Step07及future05/06 | 不使用README/旧04数字 |

这些是后续Step的正常待决输入，不构成当前Step02启动blocker。I05/H13和其他affected另按§6.5保留，不并入普通配置待确认事项。

## 10. 自检与进入下一步条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 五个SOP问题逐项回答 | pass | §3.1~§3.5完整 |
| 上游输入映射表 | pass | §6.1覆盖00~03、planned downstream和historical边界 |
| 不再回答/必须回答清单 | pass | §6.2~§6.3有唯一owner和目标Step |
| 候选配置输入可追溯 | pass | 12族均回指typed owner/consumer和后续Step |
| 12 affected逐项保留 | pass_with_affected_open | 没有关闭、合并、默认或placeholder绕过 |
| historical后置审计 | pass | 旧Step10 current状态、旧key/profile/value和旧implementation资产已隔离 |
| 详细设计影响判定 | pass | 当前全为`无回写`；触发回写条件明确 |
| 正式回填草稿 | pass_as_draft | 未修改formal `04`，草稿只供Step15消费 |
| truth/no-write边界 | pass | Observability只承载观测与审计投影，不拥有或反写business truth |
| 真实性 | pass | 未实现、未测试、未生成真实evidence或signoff |

### 10.2 完成门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 当前Step内容门禁 | `pass_waiting_user_before_step_02` | 五问、结构化输入、historical审计、affected与影响判定完整 |
| 本轮新上游blocker | `none` | I05/H13为既有blocker/affected，不是本轮新发现 |
| 正式文档门禁 | `blocked_until_step_15` | 正式`04`继续保持historical，当前不得回填 |
| 下一Step门禁 | `stop_wait_user_confirmation_before_04_step_02` | 只有用户明确确认后才读Step02 SOP/规范和current Step01 |
| 当前提交 | `not_required` | 用户未要求commit |

当前恢复点：

```text
04_Step01_current_completed_waiting_user_before_Step02
```

现在必须停审。未经用户明确确认，不得读取或修改 current Step 02~15，不得修改正式`04-配置设计.md`，
不得进入`05~07`，不得恢复或修改 historical implementation ledger/boundaries，也不得实现代码。
