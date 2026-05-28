# Step 3. 建立配置控制面总览

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 3 中间产物。
> 本步建立配置来源、装配入口、使用模块和下游影响的全景。
> 本步不展开最终优先级规则,不列完整配置项清单,不新增 `CoreRuntimeConfig` 字段,不改变 `03-详细设计.md` 中的代码契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-core/04-配置设计.md` §3 配置控制面总览

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 2 范围 | P0 覆盖本地 CLI / job 主链和 03 已有 runtime config 输入 | 限定本步只画 P0 主控制面,不把 P1/P2 外部集成写成 P0 |
| `03-详细设计.md` §13 | `CoreRuntimeConfig`、`build_cli_runtime`、`build_job_runtime`、配置引用表、外部依赖绑定表 | 固定配置进入系统的装配入口和 adapter 绑定边界 |
| `02-概要设计.md` §5.9 | 技术承载与外部适配支撑主体集合 | 确认哪些 port / adapter 受配置装配影响 |
| `01-架构设计.md` §13 | 配置与变更控制不能绕开正式承接、核心真相或边界 | 确认配置不能控制领域不变量、审计链和架构红线 |

已确认结论:

```text
配置来源只进入 runtime config 装配层。
CLI / job 入口负责收集配置源并构造 CoreRuntimeConfig。
infra runtime wiring 根据 CoreRuntimeConfig 装配 ports 和 adapters。
application service、domain object、domain policy 不直接读取 config file、env、CLI flag 或 secret。
```

---

## 3. SOP 问题回答

1. 当前系统配置从哪些来源读取?

   回答：P0 先支持 code defaults、project config file、environment variables、CLI flags 四类普通配置来源;secret refs 作为敏感配置引用形态进入后续 Step 8,本步只保留边界。真实 config center、admin override、KMS / Vault 自动轮换属于 P2,不进入 P0 控制面。最终覆盖顺序和冲突处理在 Step 5 收口。

2. 配置进入系统的唯一或主要装配入口是什么?

   回答：配置进入系统的主要装配入口是 `CoreRuntimeConfig`。CLI 入口和 job 入口先把配置源解析为 `CoreRuntimeConfig`,再分别调用 `build_cli_runtime(CoreRuntimeConfig config)` 和 `build_job_runtime(CoreRuntimeConfig config)`。这两个 runtime builder 是配置影响 ports / adapters 的唯一正门。

3. 哪些模块读取配置,哪些模块不得直接读取配置?

   回答：允许读取配置源的是 CLI / job entry 和 infra runtime wiring。允许消费已解析配置的是文件型 store、reference resolver、gate / blob adapter、event publisher adapter、toolchain runner adapter、clock / id / unit of work adapter。application services 只接收装配好的 ports 和策略对象;domain aggregate、domain value object、domain policy、repository trait、Command / Query / Event DTO 不得直接读取配置源。

4. 配置控制哪些行为,不控制哪些领域不变量?

   回答：配置可以控制 source / snapshot / projection / audit / outbox / idempotency root、外部引用解析策略、adapter 绑定模式、fake / real-like runner、event publisher 边界模式、配置缺失和依赖不可达时的失败策略。配置不能控制契约范围判断、已发布内容不可原地修改、append-only 审计、truth / audit / outbox 原子边界、兼容性门禁必须存在、外部正文不得吸收、凭据正文不得保存、L0-bus runtime 是否由本仓实现等领域和架构不变量。

5. 配置变化会影响哪些下游文档?

   回答：配置控制面会影响 `05-测试方案.md` 的环境矩阵、缺失配置和错误配置测试;影响 `06-验收标准.md` 的配置门禁和一票否决项;影响 `07-实施计划.md` 的配置解析、默认模板、fake / real-like adapter 实施顺序;影响后续部署与运维手册的环境文件、secret ref、回滚和审计 runbook。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §3 | 尚未存在配置控制面总览 | 后续配置分类、来源优先级和配置项清单缺少全景 |
| `03-详细设计.md` §13.1 | 只画了 `[config source] -> [CoreRuntimeConfig] -> runtime builder` | 没有说明配置来源类别、哪些模块能读配置、哪些不变量不能被配置控制 |
| `03-详细设计.md` §13.3 | 外部依赖绑定表已有 adapter 边界 | 需要在 04 中转译成配置控制面,避免误读为领域对象直接读配置 |
| `01-架构设计.md` §13 | 配置与变更控制是横切约束 | 需要在 04 中明确配置不能绕开架构红线 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置来源 | 只有笼统的 `config source` | 拆成 defaults、config file、env、CLI flags、secret refs 边界 | 后续 Step 5 可以继续定义优先级和冲突处理 |
| 装配入口 | 只知道进入 `CoreRuntimeConfig` | 明确 CLI / job entry 构造 config,infra runtime wiring 装配 ports / adapters | 实施者不会让 application/domain 直接读配置 |
| 控制面 | 只列配置字段 | 按 storage roots、resolver、adapter binding、toolchain、outbox relay、failure policy、observability handoff 分控制面 | 方便后续分类、清单和测试矩阵展开 |
| 不变量 | 未在配置控制面中集中说明 | 明确领域不变量、审计和架构红线不能配置化 | 避免用配置破坏 00/01/03 的边界 |
| 03 回写 | 未判断 | 本步不改变代码契约,无需回写 03 | 保持 04 只做配置控制面总览 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：让每个 adapter 自己读取 env / file | adapter 自主性高 | 配置来源分散,测试困难,application / infra 边界不清 | 不采用 |
| 方案 B：CLI / job 入口统一解析为 `CoreRuntimeConfig`,runtime builder 装配 adapters | 来源集中,边界清晰,便于测试和验收 | 需要配置加载层承担解析和校验责任 | 采用 |
| 方案 C：引入在线配置中心作为统一入口 | 长期能力更强 | 当前 L0-core 没有在线 runtime container,会扩大 P0 范围 | 不采用,列为 P2 |

---

## 7. 结构化中间产物

#### 配置来源链图: L0-core 配置覆盖链

```text
[code defaults]
  |
  v
[project config file]
  |
  v
[environment variables]
  |
  v
[CLI flags]
  |
  v
[CoreRuntimeConfig]
  |
  +--> build_cli_runtime(CoreRuntimeConfig config)
  |       |
  |       v
  |   [CoreCliRuntime]
  |
  +--> build_job_runtime(CoreRuntimeConfig config)
          |
          v
      [CoreJobRuntime]

[secret refs]
  |
  v
[adapter-local sensitive binding]
```

关键说明:

- 本图表达配置来源进入 `CoreRuntimeConfig` 的覆盖链;最终优先级和冲突处理在 Step 5 定义。
- `secret refs` 不表示 raw secret 进入普通配置文件,只表示敏感引用由 adapter-local 绑定处理。
- 本图不表达部署命令、容器挂载、KMS / Vault 接入命令或生产 runbook。
- 领域不变量、架构红线、审计链和数据所有权不受配置来源覆盖。

### 7.1 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 |
|---|---|---|---|
| 配置来源与覆盖链 | 定义 defaults、file、env、CLI flags 如何进入 runtime config | CLI entry / job entry / config loader | 是 |
| Runtime 装配入口 | 将 `CoreRuntimeConfig` 转换为 CLI / job runtime | `build_cli_runtime` / `build_job_runtime` | 是 |
| 契约源码 root | 指向结构化契约源码真相目录 | `ContractSourceStorePort` adapter | 是 |
| 发布快照 root | 指向只读发布快照资产目录 | `ReleaseSnapshotStorePort` adapter | 是 |
| Projection root | 指向查询投影和追溯索引目录 | projection store adapter | 是 |
| Audit root | 指向审计记录存储目录 | `AuditLogPort` adapter | 是 |
| Outbox root | 指向待发布事实 / event outbox 存储目录 | `OutboxPort` / `OutboxRelayWorker` | 是 |
| Idempotency root | 指向 command / job 幂等记录目录 | `IdempotencyRepository` adapter | 是 |
| Reference resolver | 控制外部引用解析边界和 fail closed 策略 | `ReferenceResolverPort` adapter | 是 |
| Gate / blob adapter binding | 控制门禁引用和 blob 引用校验边界 | `GateDecisionPort` / `BlobRefPort` adapter | 是 |
| Event publisher boundary | 控制 outbox relay 交给 L0-bus 边界的方式 | `EventPublisherPort` adapter | 是 |
| Toolchain runner boundary | 控制 validation / fingerprint / snapshot exporter runner 绑定方式 | toolchain runner adapters | 是 |
| Clock / ID / UoW binding | 控制基础运行时支撑对象来源 | `ClockPort` / `IdGeneratorPort` / `UnitOfWork` | 是 |
| Secret ref boundary | 控制敏感引用如何进入 adapter-local binding | future publisher / secret-aware adapter | 否,P1/P2 |
| Online config center | 控制在线配置拉取和 admin override | future config provider | 否,P2 |

### 7.2 模块读取边界表

| 模块 / 层 | 是否读取配置源 | 允许读取 / 消费内容 | 禁止事项 |
|---|---|---|---|
| CLI entry | 是 | config file path、env、CLI flags、defaults | 不直接执行业务规则 |
| Job entry | 是 | job profile、config file path、env、defaults | 不绕过 runtime builder |
| Infra runtime wiring | 是 | `CoreRuntimeConfig` 和 adapter-local config | 不修改 domain truth |
| Infra adapters | 否,只消费已解析配置 | root path、resolver policy、publisher mode、runner binding | 不自行读取全局配置源 |
| Application services | 否 | 已装配好的 ports、policies、metadata | 不读取 env / file / CLI flags |
| Domain objects / policies | 否 | 显式参数和领域对象 | 不读取配置,不把不变量配置化 |
| Contracts DTO / events | 否 | 协议字段 | 不携带部署配置或 secret |

### 7.3 不受配置控制的不变量

| 不变量 | 原因 | 改变方式 |
|---|---|---|
| 契约范围判断不能关闭 | 保护 L0-core 只收跨仓共享契约 | 需求 / 架构 / 详细设计变更 |
| 已发布内容不可原地修改 | 保护版本、fingerprint 和下游消费稳定 | 新版本 / supersede / 正式发布流程 |
| truth、audit、outbox 原子边界不能关闭 | 保护追溯和事实传播一致性 | 详细设计一致性变更 |
| 外部正文和凭据正文不得吸收 | 保护数据所有权和安全边界 | 需求 / 架构变更 |
| gate / reference / blob 失败不得默认放行 | 保护发布正确性和引用安全 | 安全评审 + 详细设计回写 |
| L0-bus runtime 不由本仓实现 | 保护 L0-core / L0-bus 边界 | 跨仓架构决策 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本步定义配置来源链和控制面总览,不改变 `CoreRuntimeConfig` 结构 | 否 | 无代码契约变化 | 无 | 无回写 |
| CLI / job entry 作为配置来源读取方,承接 03 已有 runtime builder 入口 | 否 | 已有设计解释 | 无 | 无回写 |
| Infra adapters 只消费已解析配置,不自行读取全局配置源 | 否 | 边界说明,不改变 trait | 无 | 无回写 |
| `secret refs` 只作为敏感配置边界,不新增具体字段 | 否 | P1/P2 边界说明 | 无 | 无回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、adapter constructor 参数、trait 方法或错误枚举。
- 后续 Step 5 如果定义了 CLI flag / env / file 的具体字段名,仍可只留在 04;除非需要改变 03 的函数签名或类型。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §3。

````md
## 3. 配置控制面总览

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane_overview.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置来源链图”“配置控制面总表”“对详细设计的影响判定”和“待确认事项”小节，了解本章控制面如何收敛。

L0-core 的配置控制面围绕 `CoreRuntimeConfig` 和 runtime builder 展开。配置来源先由 CLI / job 入口解析和合并,再形成 `CoreRuntimeConfig`,最后由 `build_cli_runtime(CoreRuntimeConfig config)` 或 `build_job_runtime(CoreRuntimeConfig config)` 装配对应 runtime。

配置可以控制文件型 store root、reference resolver、gate / blob adapter、event publisher 边界、toolchain runner、clock / id / unit of work 等 infra wiring,但不能控制契约范围、已发布内容不可原地修改、审计链、truth / audit / outbox 原子边界、外部正文不得吸收、凭据正文不得保存和 L0-bus runtime 边界。

#### 配置来源链图: L0-core 配置覆盖链

```text
[code defaults]
  -> [project config file]
  -> [environment variables]
  -> [CLI flags]
  -> [CoreRuntimeConfig]
```

关键说明:

- 最终优先级和冲突处理在 §5 定义。
- `secret refs` 不表示 raw secret 进入普通配置文件,只表示敏感引用由 adapter-local 绑定处理。
- 领域不变量、架构红线、审计链和数据所有权不受配置来源覆盖。
````

---

## 10. 待确认事项

- 是否接受 P0 配置来源先限定为 code defaults、project config file、environment variables、CLI flags,不引入在线配置中心。
- 是否接受 `secret refs` 先作为敏感配置边界进入 Step 8,不在本步定义具体字段。
- 是否接受 infra adapters 不自行读取全局配置源,只消费 runtime wiring 已解析后的局部配置。

---

## 11. 进入下一步条件

- [x] 用户确认配置来源链图。
- [x] 用户确认配置控制面总表。
- [x] 用户确认领域不变量不进入配置控制面。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 3 状态从 `[~]` 更新为 `[x]`。
