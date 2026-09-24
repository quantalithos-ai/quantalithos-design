# Step 3. 建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节：`04-配置设计.md` §3
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_03_control_plane.md`
> 输入：`04_config_step_01_upstream_boundary.md`、`04_config_step_02_scope.md`、03 §13、03 Step 14
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与内计划

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 3 |
| current_module | `control_plane:source_assembly_and_domain_inventory` |
| gate_status | `pass_for_step_04` |
| gate_reason | 来源链、唯一逻辑装配入口、配置读取层、七个功能配置域、允许/禁止能力和跨控制面审计均已闭合；不新增 03 字段。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_04_categories_boundaries.md` |

### 1.1 Step 内计划

| 项目 | 状态 | 产物/门禁 |
|---|---|---|
| 来源链图 | done | defaults → document → selector/ref → validator |
| 唯一装配入口 | done | infra/config + runtime builder |
| 读取层边界 | done | infra/entry/worker/operations only |
| 配置域骨架 | done | runtime/stores/bindings/limits/observability/determinism/features |
| 域内停审 | done | 每域允许/禁止能力和 blocker 明确 |
| 跨控制面审计 | done | 无重叠、无 owner truth 配置化、无 03 回写 |
| 自检 | done | `pass_for_step_04` |

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 配置从哪里进入系统？ | 逻辑来源是安全 code declaration/defaults 加一个经过选择器定位的外部严格 JSON 文档；selector 只选择文档/profile，不覆盖叶子值。具体文件挂载、env 名称和部署注入留给 07/09。 |
| 唯一装配入口是什么？ | `infra/config` 负责 source snapshot、parse、type/cross-field validate 和 redaction；`infra/runtime_builder` 按顺序构造 logical store/UoW、result/idempotency、semantic adapters、clock/id/digest、application facade、entry/worker/operations。不存在第二个 raw-config 入口。 |
| 哪些模块能读取配置？ | `infra/config`、`infra/runtime_builder`、`entry` 的边界校验、`worker` 的 readiness gate、`operations` 的 job-run policy 读取 validated snapshot；application 只接 typed policy/ports，domain/contracts 不持有配置句柄。 |
| 配置控制什么？ | profile 姿态、logical store/cache/adapter binding、有限 page/body/batch/read/job policy、redaction/telemetry binding、clock/id/digest binding 和外围功能的请求/禁用状态。 |
| 配置不控制什么？ | Release/Artifact/Governance/Project/Work/Sandbox/Runtime/Observability/Archive truth、审批、版本选择语义、状态迁移、Query no-write、idempotency 必填、RecoveryCase/no-replay、权限/visibility、owner contract 和技术架构。 |
| 需要哪些配置域？ | 七个功能域：`runtime`、`stores`、`bindings`、`limits`、`observability`、`determinism`、`features`。它们对应 03 Step 14 的 binding 类别，不代表七个代码模块或七个物理文件。 |
| 外部依赖是否因配置而 ready？ | 否。配置存在只表示 requested/configured；adapter marker、公开合同、能力探测和 owner safe read 仍决定 enabled/ready。上游 blocker 保持 blocked/unknown。 |

## 3. 当前文档问题诊断、改动前后对比与取舍

| 议题 | 诊断 | 收口后 | 理由 |
|---|---|---|---|
| 来源数量 | 若允许 file/env/CLI/remote/admin 任意覆盖，结果不可复核 | 普通配置以 defaults + 一个严格 JSON document 为主；selector 不覆盖叶子 | 消除来源漂移和隐式 override |
| 配置读者 | 若 domain/application 直接读 config，会把控制面带入业务真相 | 仅 infra/entry/worker/operations 读 validated snapshot | 保持依赖方向和 domain 纯度 |
| 配置域粒度 | 单一 `runtime`/`common` 大桶会混合 store、资源、观测和功能 | 按功能拆七域；每域有独立停审 | 满足 JSON 模块粒度与可追溯性 |
| binding 与实例 | 把 URL、client、store instance 写入 JSON 会伪造实现/secret | JSON 只承载 typed/opaque binding ref 和有限 marker | 适配未知实现仓和 SDK surface |
| feature flag | flag=true 可能被误读为能力 ready | feature 只请求或禁用外围路径；ready 由 formal adapter marker 决定 | 防止配置越权 |

## 4. 结构化中间产物

### 4.1 配置来源链图：L5-runner 配置汇流与装配

```text
[static code declarations / safe optional defaults]
                    |
                    v
       [one selected external strict JSON document]
                    |
                    v
          [source snapshot + strict parse]
                    |
       [type + cross-field + forbidden checks]
                    |
                    v
          [validated immutable config snapshot]
                    |
                    v
              [infra runtime builder]
        /            |             \
 [local stores] [semantic adapters] [clock/id/digest]
        \            |             /
                    v
       [application facade + entry/worker/operations]
                    |
      [configured / enabled / ready markers]
```

关键说明：

- 图表达配置控制面和覆盖关系，不表达部署命令、具体 env 名称、transport、SDK method、数据库或平台拓扑。
- static declarations 包含必填性、禁止字段、最大允许边界等不可被外部文档放宽的约束。
- 外部文档提供值和 opaque refs；非法高优先级值不能回退低优先级值。
- `configured`、`enabled`、`ready` 是不同 marker；配置不能直接构造 owner readiness。

### 4.2 配置控制面总表

| 控制面 | 作用 | 读取/装配层 | P0 | 禁止控制 |
|---|---|---|---|---|
| runtime/profile | 选择已登记的运行姿态和配置 schema 语义 | `infra/config`、builder | 是 | 新增状态、权限、owner truth、技术架构 |
| stores | 注入 local truth、projection/read-section、idempotency/result、material cache 的 logical binding | `infra` stores/UoW | 是 | DSN、物理路径、raw body、fallback truth store |
| bindings | 绑定 14 个 semantic ports 和平台/观测/交接能力的 opaque refs | adapter registry/builder | 是 | 私有 backend、SDK method、endpoint credential、owner body |
| limits | page/body/batch/read budget、idempotency window、job policy 的 typed finite inputs | entry/operations/worker | 是 | 绕过 guard、改变状态、隐式 success、无 authority 数字 |
| observability | redaction profile、safe telemetry、diagnosis/handoff binding | infra/diagnostic/telemetry | 是 | raw log/body/secret、formal evidence/report/verdict |
| determinism | clock、ID、digest provider 的 semantic binding；测试 profile 可用 deterministic fake | builder/test harness | 是 | ad hoc timestamp/ID/hash、生产 fake fallback |
| features | 只请求或禁用外围 safe view、diagnosis、archive reference 等 | registry/entry/operations | 是（外围） | 开启 reserved Consumer positive path、改变 owner truth |

### 4.3 配置域 / 功能模块总表

| 配置域 | 03 绑定来源 | 允许配置的能力 | 明确禁止 |
|---|---|---|---|
| `runtime` | profile/config identity | 选择已登记 profile ref、schema/ref posture | 以 profile 名称声称 ready；改变 state/owner |
| `stores` | `RunnerStoreConfigRef` 族 | 选择 logical store/UoW/projection/result/cache binding ref | 选择数据库产品、路径、共享 owner store 或无保障 fallback |
| `bindings` | `RunnerAdapterConfigRef` / Set | 选择 semantic port binding refs 和 optional availability requests | endpoint、topic、SDK method、raw credential、owner payload |
| `limits` | typed finite limits / job policy / durations | 为入口、查询、Job 提供 bounded inputs | 通过零值/无限值绕过 guard、删除 unresolved records、自动 replay |
| `observability` | redaction/diagnostic/handoff/telemetry ports | 选择 safe binding/profile 和低基数 policy | 关闭 mandatory redaction、生成 formal evidence |
| `determinism` | clock/id/digest ports | 选择正式 provider 或 test-only deterministic provider | 在生产 profile 使用 fake、从 route/body 拼 ref/digest |
| `features` | finite feature markers | 禁用外围路径或请求已闭合 safe path | 将 blocked/ reserved path 变成 positive ready |

### 4.4 域内停审记录

| 配置域 | 来源链清楚 | 允许/禁止清楚 | 03 影响 | 结论 |
|---|---|---|---|---|
| runtime | 是 | 是 | 无新字段 | pass |
| stores | 是 | 是；backend/path 留 blocked | 无新字段 | pass with `RUN-DDD-003` |
| bindings | 是 | 是；owner seam 留 blocked | 无新字段 | pass with `RUN-UP-001~008` |
| limits | 是 | 是；数值 authority pending | 无新字段 | pass pending authority |
| observability | 是 | 是；backend/SLO pending | 无新字段 | pass with `RUN-UP-005/RUN-OPS-001` |
| determinism | 是 | 是；exact provider pending | 无新字段 | pass pending authority |
| features | 是 | 是；reserved path fixed | 无新字段 | pass |

### 4.5 跨控制面审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 是否遗漏 03 Step 14 binding 类别 | pass | profile/store/cache/external/limits/clock/id/digest/feature 全有归属 |
| 是否把功能混入一个泛化 `runtime` 域 | no | 七域按功能拆分 |
| 是否把依赖实例/endpoint/secret 写进 JSON | no | 只允许 ref/typed policy；实例由 builder/authority 提供 |
| 是否允许 application/domain 读 raw config | no | 只注入 typed ports/policies |
| 是否能由 config 改变 truth/state/no-write/replay | no | 禁止边界在 Step 4 继续展开 |
| 是否有 profile/feature 之间冲突 | 未发现；Step 5/6 继续校验 | `enabled` 不等 `ready`，reserved path 永远不可由 flag 开启 |
| 是否需要回写 03 | no | 本步只组织已有 semantic binding |

## 5. 回填草稿（未来正式 §3）

Runner 配置通过单一逻辑装配链进入 `infra/runtime_builder`。普通配置由安全静态声明和一个严格 JSON 文档组成；配置读取限于 `infra/config`、builder、entry、worker、operations 和安全观测装配层。配置域按 `runtime`、`stores`、`bindings`、`limits`、`observability`、`determinism`、`features` 划分。配置只提供 validated refs、finite policies 和外围请求，不改变 owner truth、state、Query no-write、idempotency/no-replay、redaction 或依赖方向。

## 6. 待确认事项与进入下一步条件

| 待确认事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| 外部 JSON 文档的实际 delivery mechanism | 07/09 的部署承接 | 保持 source role；不写路径/env/挂载命令 |
| 14 个 port 的 exact binding registry | positive adapter | opaque ref + `blocked/unknown` |
| local store/cache capability | builder readiness | 缺失则 affected write/run blocked；不 fallback |
| limits 的 workload authority | 默认/范围 | required 或 authority-pending；不写历史数字 |

| 进入 Step 4 条件 | 结论 |
|---|---|
| 来源链和唯一装配入口明确 | pass |
| 配置域已按功能拆分并逐域停审 | pass |
| 跨控制面无 unresolved 内部冲突 | pass |
| 无 `待回写`/`阻塞待确认` 的 03 影响项 | pass |

Step 3 完成，允许进入 Step 4；正式 04 仍不可写。
