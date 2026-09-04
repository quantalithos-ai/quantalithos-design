# Step 3：建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节：未来正式 `04-配置设计.md` §3“配置控制面总览”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_03_control_plane.md`
> 执行模式：full-restart；旧材料仅作 historical_material / 污染审计输入
> 完成日期：2026-09-02

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 3 建立配置控制面总览 |
| 当前模块 | `control_plane`；已完成整体骨架后按控制面审查 |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 用户授权 | 本轮“完成全部的 04”授权继续 Step 3~15；正式 `04` 仍只在 Step 15 装配 |
| 输入基线 | Step 1 输入边界、Step 2 范围、新版 `00/01/02/03`、`03_ddd_step_14_config_dependencies.md` |
| 正式 `04` 写入 | `false` |
| 实现 / 测试 / 证据 | `false`；不产生实现、测试结果、artifact、report、evidence、verdict、signoff 或 readiness |
| commit | `false` |
| Step 门禁 | 本 Step 自检通过后允许进入 Step 4；仍保留上游 blocker |

### 1.1 Step 内计划

- [x] 读取项目 ledger、04 flow、Step 1/2、00/01/02/03、Step 14 和配置规范。
- [x] 逐项回答 Step 3 的配置控制面问题。
- [x] 诊断旧材料和 `03` 绑定点未按控制面组织的问题。
- [x] 比较技术层拆分、业务控制面拆分和混合拆分，确定取舍。
- [x] 形成来源链图、控制面总表、配置域总表和跨控制面审计。
- [x] 判断对 `03-详细设计.md` 的影响，保持当前无回写。
- [x] 形成正式 §3 回填草稿，不写正式 `04`。
- [x] 完成模块停审、自检和下一步门禁记录。

## 2. 本步输入

| 输入 | 状态 / 效力 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | `completed / pass_with_upstream_blockers` | 提供配置输入权威级别、候选绑定点和禁止越界规则 |
| `04_config_step_02_scope.md` | `completed / pass_with_upstream_blockers` | 提供 P0/P1/P2 范围、非范围和有配置项目判定 |
| `00-需求文档.md` | 新版正式上游 | 提供双锚、Host Truth、四层语义和外部 truth 边界 |
| `01-架构设计.md` | 新版正式上游 | 提供 Host Truth Center、A/S/P 分层、依赖方向和架构红线 |
| `02-概要设计.md` | 新版正式上游 | 提供 CMP-MS-01~07、实现分层和配置影响轮廓 |
| `03-详细设计.md` §4、§7~§15 | 新版直接输入 | 提供 crate、入口、Port、logical store、job、handoff、观测和配置读取边界 |
| `03_ddd_step_14_config_dependencies.md` | 字段级直接输入 | 提供 config section、builder 顺序、依赖类型和 P0 fake/blocked 策略 |
| L1-governance Step 3 | 只读粒度参考 | 参考控制面总览、域表、停审和跨域审计格式，不提供本仓 truth |

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取？

配置来源在本 Step 只收敛为来源类型和进入链路，不提前决定具体 key、环境变量名或产品：安全默认值 / code defaults、严格 JSON 配置文件、环境覆盖、opaque secret reference、入口或 job 的 typed local 参数、仅限 `ci-test` / `operations-replay` 的 deterministic fixture。`local-dev` 只使用普通 fake / placeholder，`integration-like` 只允许 controlled adapter seam 的场景选择 / 故障注入。未来若采用 config center 或 admin override，必须作为 P1/P2 新来源经过 ADR，不得默认为 P0 来源。

### 3.2 配置进入系统的主要装配入口是什么？

入口固定为 `infra/config.rs` 读取 raw source 并做类型化校验，再交给 `infra/runtime_builder.rs` 组装 logical stores、Port adapter、availability marker、入口和 job runner。`api`、`worker`、`jobs` 只得到已校验的 boundary / runner 参数；`domain`、`contracts` 和 application use-case 不读取 raw config、env 或 secret body。

### 3.3 哪些模块可以读取配置，哪些模块不得直接读取？

| 模块 | 允许接触的内容 | 禁止内容 |
|---|---|---|
| `infra/config.rs` | raw source、profile、opaque ref、校验问题 | Host Truth、外部正文、raw secret |
| `infra/runtime_builder.rs` | validated config、adapter registry、availability | 将 availability 升级为 Ready/Healthy |
| `api` / `worker` / `jobs` entry | 已校验的入口边界和 runner 参数 | raw config、环境变量、具体 client |
| `application` | typed 参数、Port trait、validated policy-like knobs | `MemberServiceConfig`、产品 adapter |
| `domain` / `contracts` | 显式方法参数和值对象 | config、env、secret、adapter handle |

### 3.4 配置控制哪些行为，不控制哪些领域不变量？

配置可控制 profile、logical store / repository adapter、resolver 与 host seam availability、publisher / handoff 的外围启停、job runner 参数、safe read 边界、clock/id fixture 和 redaction sink。配置不可控制 `ProjectMemberRef` 执行主语、`GlobalMemberRef` 身份锚、Host Truth owner、状态合法迁移、UoW / expected revision、generation fence、Query no-write、Job no-authorization、四层 handoff、正文排除和外部 truth owner。

### 3.5 配置变化会影响哪些下游文档？

会影响本 `04` 的 Step 4~14，并向 `05` 提供环境与失败矩阵、向 `06` 提供配置门禁、向 `07` 提供配置准备和 blocker 顺序、向 `09` 提供具体环境文件与 secret 操作的语义输入。任何改变 `03` 的 runtime config、builder、adapter constructor、Port、DTO、error 或 flow 的结论必须暂停并回写 `03`。

### 3.6 每个控制面应拆成哪些配置域？

按功能控制面而非技术目录拆成：runtime/profile、logical truth stores、qualification/resolver、host lifecycle/session/health、publication/feedback、operations jobs、safe read/boundary、security/redaction、clock/id/deterministic test。每个控制面下的配置域仍需在 Step 4~7 逐域停审。

### 3.7 每个配置域如何回指详细设计？

每个配置域必须回指 `03` 的 config section、runtime builder binding、Port / adapter、entry 或 job runner。配置设计只补来源、优先级、profile、敏感性和失效语义；若需要新字段或新构造参数，不能在 `04` 静默补充。

### 3.8 本 Step 是否存在配置域重叠？

存在可观察的交叉关系，但不构成 owner 冲突：store binding 负责承载，job runner 负责执行节奏，publication 负责 transport target，handoff 负责层级反馈，redaction 负责安全输出。交叉引用用 ref / typed parameter 连接，不把一个配置域复制为另一个 truth owner。

### 3.9 控制面拆分是否产生 `03` 回写？

没有。此处只是把 `03` 已存在的绑定点按控制面归类，没有新增 runtime reload、adapter constructor、Port、DTO 或错误契约。动态 adapter 替换、热更新或新配置字段若未来需要，属于 `03` 回写 blocker。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `03` §13 | section 和 binding 按代码入口罗列，未形成配置控制面 | Step 4~7 无法按功能域收敛 | 将 section 归入控制面和配置域 |
| Step 2 范围表 | 只区分 P0/P1/P2，未说明配置进入系统的链路 | 可能把产品选择误当配置语义 | 固定 `config.rs -> runtime_builder` |
| 旧 README / `05/06` | 混有 Docker、数据库、心跳和性能数字 | 旧产品或数字可能污染 P0 | 降级为历史审计输入 |
| 兄弟项目 seam | Member、Images、Runtime、Sandbox、Bus 合同未闭合 | 容易以 endpoint / receipt 假装 ready | 只保留 placeholder / blocked / unavailable 域 |
| 配置模块命名 | 可能以 `storage`、`runtime`、`common` 聚合不同功能 | 后续 JSON 无法检索和审计 | 按 logical owner / 功能边界拆域 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源表达 | 候选来源散落于 Step 1/2 和 `03` | 形成来源类型与单一装配链预览 | 为 Step 5 的覆盖和冲突规则提供稳定输入 |
| 拆分依据 | 以 crate、adapter 或部署技术为主 | 以控制面和功能域为主，并回指代码 binding | 配置文档回答控制语义，不是文件目录索引 |
| 外部依赖 | 可能被写成具体产品或正向联调 | 以 runtime/event/ref/adapter/fake seam 表达 | 保持依赖裁剪与 pending 诚实 |
| 禁止边界 | 只有全局范围级红线 | 每个控制面均列允许 / 禁止能力 | 防止配置绕过 owner、状态和安全边界 |
| `03` 影响 | 仅有总声明 | 每个控制面显式判定无回写 | 确保不静默新增代码契约 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate / 技术层拆配置 | 容易对照目录 | 同一功能被拆散，`storage` 等泛化模块掩盖 owner | 不采用 |
| 按业务控制面和功能域拆 | 能回指 Host Truth 主链、配置行为和下游影响 | 需要额外维护与代码 binding 的映射 | 采用 |
| P0 直接锁定 DB、Bus、容器或 RPC 产品 | 示例具体 | 上游没有产品 authority，会伪造 readiness | 不采用 |
| P0 只锁 product-neutral adapter / fake / blocked seam | 可装配、可测试、可审计且不伪造外部完成 | 真实联调需 P1 再收敛 | 采用 |
| 将所有 external seam 合并成 `external` 开关 | 配置项少 | 无法区分 Member、Images、Runtime、Sandbox 和 handoff 失败 | 不采用 |
| 按 resolver、carrier、publication、handoff 等功能拆分 | 能表达不同 owner、失败和敏感边界 | 配置域数量较多 | 采用 |

## 7. 结构化中间产物

### 7.1 配置来源链图

#### 配置来源链图：L2-member-service 配置覆盖链

```text
[code defaults / safe defaults]
          -> [strict JSON file]
          -> [environment override]
          -> [opaque secret references]
          -> [entry-local or job-run-start typed params]
          -> [ci-test / operations-replay deterministic fixture only]
                         |
                         v
              [infra/config.rs load + parse]
                         |
                         v
                  [type / cross-field validate]
                         |
                         v
              [ValidatedMemberServiceConfig]
                         |
                         v
             [infra/runtime_builder.rs]
       /         |          |          \
 [logical] [qualification] [host seam] [entries/jobs]
  stores       adapters      adapters      + safe sinks
```

关键说明：

- 该图表达来源类型和装配顺序预览，不表达部署命令、产品选择或最终覆盖优先级。
- secret 只能以 opaque reference 进入配置；真实秘密材料不进入普通 JSON、日志、错误或审计正文。
- deterministic fixture 仅限 `ci-test` / `operations-replay`；`local-dev` 不启用该配置域，`integration-like` 的场景注入只走 controlled adapter seam。
- `domain`、`contracts`、application use-case 和入口 handler 只接收 validated config 派生的 typed 参数或 Port。
- 外部 adapter 的 availability 不等于 Host Ready、Healthy、Delivered、Observed 或 Accepted。

### 7.2 配置控制面总表

| 控制面 | 主要作用 | 对应模块 / 入口 | P0 口径 | P1/P2 延伸 |
|---|---|---|---|---|
| runtime / profile assembly | 选择 profile、校验身份和装配组合 | `infra/config.rs`、`runtime_builder.rs` | local / fixture / blocked 组合可判定 | real-like / 多 profile 产品化 |
| logical truth stores | 绑定 control、qualification、progression、session、closure 等逻辑仓 | `infra/persistence/*`、UoW | in-memory / fake per owner | durable store、lease / lock |
| maintenance stores | 承载 history、material、outbox、projection、idempotency、result | `infra/persistence/*`、jobs | deterministic fake，缺失则显式 defect | durable / retention 产品 |
| qualification / resolver | 绑定 Identity、Work、Member、Images、Runtime、Sandbox、carrier seam | `application/ports`、`infra/adapters` | placeholder / fake / unavailable | exact adapter、credential、real-like |
| host lifecycle / session / health | 控制入口暴露、registration/session/health 依赖可用性 | `api`、`worker`、lifecycle adapters | unresolved 时 blocked / disabled | 真实 host runtime 联调 |
| publication / feedback / handoff | 绑定 outbox publisher、四层反馈和目标 | worker、handoff adapter | fake / disabled / unknown | Core/Bus/target exact contract |
| operations jobs | 控制 action、health、cleanup、reconcile、projection、publication、handoff runner | `jobs`、worker loops | serial deterministic、已提交 work only | scheduler、批量与重试产品 |
| safe read / boundary | 控制 page/body/visibility/diagnostic boundary | `api` query、read mapper | body-free、query no-write | production limit / rate policy |
| security / redaction | 控制 deny list、safe diagnostic、敏感 ref 处理 | config validator、observability sink | fail-closed guard | KMS/Vault、审计后端 |
| clock / id / deterministic test | 注入时间、ID 和 fixture | `ClockPort`、`IdGeneratorPort`、test harness | deterministic fake | runtime implementation / replay |

### 7.3 配置域 / 功能模块总表

| 配置域 / 功能模块 | 所属控制面 | 对应 `03` 绑定点 | 允许配置的能力 | 禁止配置的能力 |
|---|---|---|---|---|
| `profile` | runtime assembly | `infra/config.rs` profile | 选择已验证 profile | 改变执行主语、状态机或 owner |
| `config_identity` | runtime assembly | config validator / safe issue | 保存脱敏配置身份、校验摘要 | raw config、secret、URL、外部正文 |
| `control_store` / `qualification_store` / `progression_store` | logical truth | logical repository + UoW | 选择每个 owner 的 adapter | schema、expected revision、UoW 顺序 |
| `session_store` / `closure_store` | logical truth | session / closure repositories | 选择逻辑承载 | 把 session 或 cleanup 改成 Runtime/Sandbox truth |
| `history_store` / `material_store` | maintenance stores | history / material repositories | 选择 append-only / marker 承载 | 删除历史、保存正文、重算缺失 sidecar |
| `outbox_store` / `projection_store` | maintenance stores | outbox / projection repositories | 选择 immutable payload / derived view 承载 | current truth 临时组包、projection 反写 source |
| `idempotency_store` / `result_store` | maintenance stores | reservation / stored result ports | 选择 replay surface 承载 | 关闭 replay、缺失结果后重跑 mutation |
| `identity_resolver` / `work_resolver` | qualification | qualification ports | 选择 resolver ref、fake 或 unavailable | 复制 L1 truth、用旧缓存形成 Ready |
| `member_binding` / `images_binding` | qualification | Member / Images placeholders | 选择 opaque ref、availability、blocked | register body、manifest、digest、credential truth |
| `runtime_session_binding` / `sandbox_binding` | ref-bearing host seam | Runtime / Sandbox adapter ports | 选择 opaque binding ref、availability 和 disabled/blocked 状态 | Runtime run、Sandbox policy/backend、逐动作 execute |
| `carrier_binding` | carrier handoff marker | carrier availability marker seam | 只选择 availability marker 和 disabled/blocked 状态；不选择 binding ref 或 release schema | carrier backend、release、handoff accepted |
| `registration_session` / `health_signal` | lifecycle | registration/session/signal adapters | 选择入口和受限 signal seam | 用心跳数值改写 Host Truth 或 Runtime 状态 |
| `publication` / `handoff_feedback` | publication / handoff | publisher / feedback ports | 目标 ref、层级可用性、safe attempt | 用 receipt 推导 delivered/accepted |
| `action_jobs` / `health_jobs` / `cleanup_jobs` | operations jobs | job runner entries | runner availability、已提交 work 的技术参数 | 创建 authorization、decision、generation、新 key |
| `projection_job` / `reconciliation_job` | operations jobs | derived maintenance jobs | selector、批次、报告承载 | query 写 source、reconcile 自动修复 truth |
| `api_boundary` / `worker_runner` / `job_runner` | safe boundary | typed entry parameters | body/page/batch 等受限参数 | 绕过 actor、scope、metadata、幂等 |
| `redaction` / `diagnostics` | security | redaction checker、safe sink | safe allowlist、deny list、诊断 ref | 放宽 forbidden body、raw secret 或高基数标签 |
| `clock` / `id_generator` / `fixture` | deterministic test | Clock/ID Port、fake assembly | deterministic adapter | handler/domain 自拼 ID、把时间当 revision/cursor |

### 7.4 配置域停审记录

| 配置域组 | 来源链 | 允许 / 禁止边界 | `03` 影响 | 结论 |
|---|---|---|---|---|
| runtime / profile / identity | 已回指 `config.rs` | 只选择已验证组合，不改业务语义 | 无 | 通过 |
| logical / maintenance stores | 已回指 repository / UoW | 物理 adapter 不改变 logical owner | 无 | 通过 |
| qualification / host seam | 已回指 Port / placeholder | unresolved 只能 blocked / disabled / unknown | 无 | 通过（保留 blocker） |
| lifecycle / publication / handoff | 已回指入口与四层 marker | 不把局部 receipt 或 adapter `Ok` 升级 | 无 | 通过（保留 blocker） |
| operations jobs / safe boundary | 已回指 jobs / entry | job 只推进已提交 work，query no-write | 无 | 通过 |
| security / deterministic support | 已回指 redaction、Clock/ID Port | raw secret / body 禁入，fixture 不进生产 | 无 | 通过 |

### 7.5 跨控制面审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否有单一 raw config 读取入口 | 是 | 固定为 `infra/config.rs`；其余层只收 typed 注入 |
| 是否把 `storage` / `runtime` 泛化模块当作最终配置域 | 否 | 按 logical owner 和功能拆分 |
| 是否存在同一 adapter 被多个控制面重复定义 | 无 owner 重复 | target / availability 通过单一 binding，引用可跨域 |
| 是否把 sibling runtime/event/ref/adapter 变成 compile 依赖 | 否 | 保持 Port / event / ref / adapter / fake 分类 |
| 是否把 availability、receipt、timeout 当成 readiness | 否 | 正向未闭合保持 blocked / unknown / gap |
| 是否把 query / job 作为可关闭的安全门禁 | 否 | Query no-write、Job no-authorization 视为静态红线 |
| 是否需要新增 `03` 类型或函数 | 当前不需要 | 动态 reload、新 constructor 或新字段须先回写 `03` |

## 8. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 将既有 config section 按控制面和功能域重新归类 | 否 | 配置文档组织 | 不适用 | 无回写 |
| 固定 `infra/config.rs -> runtime_builder -> typed entry` 读取链 | 否 | 承接既有 builder 约束 | 不适用 | 无回写 |
| logical store、resolver、host seam、publication、job、redaction 各自保留功能域 | 否 | 既有 binding 的配置化表达 | 不适用 | 无回写 |
| P0 只支持 fake / in-memory / deterministic / placeholder / blocked 组合 | 否 | 既有 fake/blocked 运行上限 | 不适用 | 无回写 |
| 未来增加 hot reload、dynamic adapter replacement 或新 runtime config 字段 | 是 | runtime builder / Port / flow 契约变化 | `03` §4、§5、§13 及对应 Step | 阻塞待确认（不属于当前正式结论） |
| 通过开关改变 Host Truth、状态、幂等、Query no-write、Job no-authorization 或 handoff 层级 | 是 | 破坏详细设计不变量 | `03` §3、§9~§14 | 设计拒绝；不得进入正式 `04` |

## 9. 回填草稿：正式 `04-配置设计.md` §3

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“配置来源链图”“配置控制面总表”“配置域 / 功能模块总表”“配置域停审记录”和“跨控制面审计表”小节，了解本章配置控制面如何从 `03` 的 binding 收敛。

正式 §3 只回填以下收口内容：

1. 配置来源链固定为 code defaults、严格 JSON、environment override、opaque secret ref、entry/job typed 参数和仅 `ci-test` / `operations-replay` 的 deterministic fixture 分层输入；`local-dev` 只用普通 fake / placeholder，`integration-like` 只走 controlled seam；config center / admin override 不是 P0 默认来源。
2. 主要装配入口固定为 `infra/config.rs` 的加载与校验，再由 `infra/runtime_builder.rs` 组装 logical stores、Port adapters、availability、entries、jobs 和安全 sink。
3. `domain`、`contracts`、application use-case、API / worker / job handler 不读取 raw config、env 或 secret body。
4. 配置控制面包括 runtime/profile、logical truth、maintenance stores、qualification/host seam、lifecycle、publication/handoff、jobs、safe boundary、security/redaction 和 clock/id/test。
5. 每个配置域按功能边界组织，配置只影响 adapter / runner / fixture / safe boundary / degradation；不改变双锚、Host Truth owner、状态、UoW、幂等、Query no-write、Job no-authorization、redaction 和四层 handoff。
6. `MSVC-UP-001~008`、具体产品、cursor exact type、credential / policy owner 和观测后端未闭合时，受影响域只能配置为 placeholder、disabled、blocked、unknown、degraded 或 fail-closed。

## 10. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| durable store、lease / lock、DLQ / diagnostic store、observability backend 产品 | 影响 logical store、replay、故障报告和 P1 配置项 | 保持 product-neutral；P0 使用 fake / in-memory 或显式 blocked |
| Core / Bus route、envelope、receipt exact contract | 影响 publication / consumer 配置 | 只保留 topic-neutral / candidate / fake；不写 route 或 receipt schema |
| Member / Images / Runtime / Sandbox exact adapter contract | 影响 qualification 与 host seam | opaque ref + placeholder / unavailable；不可形成 positive ready |
| policy 传递与 launch credential owner | 影响 sensitive ref 与 handoff | owner pending；不得配置 raw secret 或治理裁决 |
| 是否未来支持 hot reload / dynamic replacement | 影响 builder、rollback 和 in-flight 语义 | P0 不支持；未来须先回写 `03` |

## 11. 进入下一步条件与自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 来源链与主要装配入口明确 | pass | `config.rs -> runtime_builder -> typed injection` |
| 允许读取与禁止读取层明确 | pass | raw config 只在 infra；其他层只接 validated input |
| 控制面已按功能而非技术泛化拆分 | pass | 见 §7.2~§7.3 |
| 每个配置域已列允许 / 禁止能力 | pass | 见 §7.3 |
| sibling / backend blocker 未伪装 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 继续显式 |
| 跨控制面重叠与 03 影响已审计 | pass | 当前无回写 |
| 正文污染检查 | pass | 本文件含过程材料；正式正文只取 §9 收口结论 |
| 下步门禁 | pass_with_upstream_blockers | 允许进入 Step 4，先定义分类与禁止配置化边界 |

## 12. Step 3 停审结论

```text
step_03_status = completed / pass_with_upstream_blockers
step_03_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_04_categories_boundaries
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```

本 Step 只形成配置控制面和域级输入，没有写入正式 `04-配置设计.md`，没有锁定具体产品、数值、endpoint、secret provider 或外部 schema。可按本轮用户授权进入 Step 4。
