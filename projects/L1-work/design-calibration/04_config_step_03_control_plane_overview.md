# Step 3. 建立配置控制面总览

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 3 中间产物。
> 本步建立配置来源链、配置进入 Work runtime 的装配入口、模块读取边界和配置控制面总表。
> 本步不新增 `WorkRuntimeConfig` 字段,不定义 JSON demo,不改变 `03-详细设计.md` 的代码契约。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
- 回填章节: `projects/L1-work/04-配置设计.md` §3 配置控制面总览

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_02_scope.md` | 已确认 P0 聚焦默认可验证路径和稳定配置接缝 | 限定控制面只覆盖 P0 必须项和 P1/P2 接缝 |
| `00-需求文档.md` §12 / §13 / §14 | 外部依赖边界、非功能和验收红线 | 确认配置不得复制相邻仓正文或绕过项目工作事实边界 |
| `01-架构设计.md` §8 / §9 / §10 / §13 | 依赖方向、数据所有权、关键交互和横切关注点 | 固定 Work truth、派生不反写、handoff 不拥有外部系统的边界 |
| `02-概要设计.md` §11 | 配置影响轮廓和禁止配置化边界 | 提供控制面总表的主要分类 |
| `03-详细设计.md` §13 | 配置边界、配置引用表和外部依赖绑定 | 提供 runtime builder、adapter、store、job 和 report 的读取入口 |

已确认前提:

```text
L1-work 的配置控制面围绕 WorkRuntimeConfig、ConfigLoader / load_and_validate 和 WorkRuntimeBuilder 展开。
配置可以选择运行 profile、store profile、adapter profile、job policy、report output 和安全 redaction policy。
配置不能改变 Work truth 归属、外部正文排除、formalize / promote、状态机、幂等语义、派生不反写、audit / outbox 和 handoff 失败不回滚 truth。
```

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取?

P0 默认来源链为 code defaults、JSON config file、environment overrides、secret / credential refs 和入口局部 args。remote config / config center / admin override 不进入 P0 默认来源链,只作为 P2 演进入口。

| 来源 | 是否 P0 | 作用 | 限制 |
|---|---|---|---|
| code defaults | 是 | 提供 local / CI 可启动默认值 | 只能给安全默认值,不得默认启用真实外部写入 |
| JSON config file | 是 | 提供模块级配置主文件 | 默认配置格式为 JSON |
| environment overrides | 是 | 覆盖本地路径、profile、endpoint ref、batch 和 timeout 等运行参数 | 不得通过 env 写 raw secret 或 forbidden body |
| secret / credential refs | 是 | 指向外部凭据或 secret provider 的引用 | 只保存 ref,不保存 raw token / raw secret |
| entry local args | 是 | api / worker / job 启动时提供局部 run id、config path 或 job scope | 不能覆盖领域红线 |
| config center / admin override | 否,P2 | 后续远程配置、受控变更和审计覆盖 | 当前不设计字段全集和热更新流程 |

### 3.2 配置进入系统的唯一或主要装配入口是什么?

配置主要进入 `infra::runtime_builder`。入口模块可以读取配置路径、profile 或 job run 参数,但正式 runtime 装配必须收口到 loader、validator 和 runtime builder。

```text
api / worker / jobs entry
  -> config path / profile / run args
  -> WorkRuntimeConfig::load_and_validate(...)
  -> WorkRuntimeBuilder
  -> WorkRuntime
```

该入口保证 `domain`、`contracts` 和 `application` 不直接读取环境变量、配置文件或 secret provider。

### 3.3 哪些模块读取配置,哪些模块不得直接读取配置?

| 模块 | 是否直接读取配置 | 允许读取内容 | 边界 |
|---|---|---|---|
| `infra` | 是 | store、projection、idempotency、resolver、publisher、handoff、clock / id、report 和 runtime builder 配置 | 只负责装配 adapter 和技术承载 |
| `api` | 有限 | config path、runtime profile、entry config | 不直接读取 store / secret / adapter 细节 |
| `worker` | 有限 | worker profile、event source profile、relay profile | 不绕过 runtime builder 装配 |
| `jobs` | 有限 | job profile、batch、retry、timeout、report output、job run args | 不改变 job 业务状态机 |
| `application` | 否 | 通过注入 port / repository / policy 参数间接受影响 | 不直接读取配置来源 |
| `domain` / `contracts` | 否 | 无 | 不读取运行配置,不因配置改变对象不变量 |

### 3.4 配置控制哪些行为,不控制哪些领域不变量?

配置控制运行承载和外部接缝,不控制业务成立条件。

| 配置可控制 | 配置不可控制 |
|---|---|
| runtime profile、store profile、entry profile | Work truth 归属 |
| fake / configured resolver、publisher、handoff adapter | 外部正文排除和来源仓 truth 边界 |
| batch、parallelism、retry、timeout、retention window | formalize / promote 显式边界 |
| projection、derived views、advanced search、reference refresh feature | ProjectMember / Actor visibility 和授权判断 |
| reports root、artifacts root、redaction check | 状态机迁移和幂等冲突语义 |
| credential ref / secret ref | 派生不反写真相、handoff 失败不回滚 truth |
| deterministic fake clock / id generator | business id、trace、audit 和 outbox 的可追溯要求 |

### 3.5 配置变化会影响哪些下游文档?

| 下游文档 | 承接内容 |
|---|---|
| `05-测试方案.md` | 配置来源、profile matrix、缺失 / 错误配置、fake adapter marker、redaction gate 和 report path 测试 |
| `06-验收标准.md` | 配置门禁、禁止配置化红线、artifact / report evidence 和一票否决项 |
| `07-实施计划.md` | config loader、validator、runtime builder、adapter profile、script 和 report 生成顺序 |
| 部署 / 运维材料 | 真实环境值、secret provider、endpoint、rollout、rollback 和 audit 操作 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` | 本 Step 撰写时尚未创建控制面总览;当前已回填正式 §3 | 历史风险已关闭;实现时以正式 `04` 为准 |
| `03-详细设计.md` §13 | 已列配置引用表,但没有来源链和装配图 | 实现者可能直接在 api / worker / jobs 中读取细节配置 |
| `02-概要设计.md` §11 | 已列配置影响和禁止边界,但不是正式配置控制面 | 需要转译为 04 的控制面总表 |
| 当前旧 `05/06` | 本 Step 撰写时尚未按新版配置控制面重写;当前已生成正式 `05/06` | 历史风险已关闭;测试验收以正式 `05/06` 为准 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源链 | 只有配置引用点 | 明确 code defaults -> JSON file -> env overrides -> secret / credential refs -> entry args | 防止每个入口自行发明配置覆盖关系 |
| 装配入口 | `infra` 读取配置的描述较散 | 收敛为 `WorkRuntimeConfig::load_and_validate(...)` / `WorkRuntimeBuilder` | 保护依赖方向和测试入口 |
| 控制面 | 按字段散列 | 按 runtime、store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、clock / id、security 组织 | 便于 Step 7 生成模块级 JSON demo 和配置项表 |
| 禁止边界 | 分散在 01 / 02 / 03 | 在 Step 3 总览中先集中声明 | 防止配置设计后续越界 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 每个入口独立读取自身配置 | 入口实现简单 | api / worker / jobs 容易产生不同覆盖规则 | 不采用 |
| 方案 B: loader / validator / runtime builder 统一装配,入口只传局部参数 | 来源链一致,测试和验收可复用,依赖方向清楚 | runtime builder 需要承担更多装配责任 | 采用 |
| 方案 C: 当前只写配置项表,不写控制面 | 文档短 | 后续无法判断字段属于哪个模块和边界 | 不采用 |

推荐方案 B。

原因:

- `03-详细设计.md` 已经把 `infra` 定位为 repository、adapter、config 和 runtime builder 的承载层。
- `api`、`worker`、`jobs` 是入口形态,不应各自定义 store、resolver、publisher 或 handoff 装配规则。
- 统一控制面能让 `05/06/07` 直接引用同一套配置来源链和模块边界。

## 7. 结构化中间产物

### 7.1 配置来源链图

#### 配置来源链图: L1-work 配置覆盖链

```text
[code defaults]
  -> [JSON config file]
  -> [environment overrides]
  -> [secret / credential refs]
  -> [entry local args]
  -> [validated WorkRuntimeConfig]
  -> [WorkRuntimeBuilder]
```

关键说明:

- 本图表达配置来源覆盖和进入 runtime builder 的主链。
- 本图不表达部署命令、容器挂载、secret provider 产品或热更新流程。
- `secret / credential refs` 只表达引用,不表达 raw secret 值。
- 领域不变量和架构红线不受配置来源覆盖。

### 7.2 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 |
|---|---|---|---|
| runtime bootstrap | 加载、校验并构造 Work runtime | `infra::config`、`infra::runtime_builder`、`api`、`worker`、`jobs` | 是 |
| store profile | 装配 truth、projection、outbox、idempotency store | `infra::repositories`、`infra::projection_stores`、`infra::idempotency_store` | 是 |
| boundary profile | 控制 command body、query timeout、page limit 和入口保护 | `api`、`infra::runtime_builder` | 是 |
| idempotency policy | 控制 command retention、event dedup retention 和 reserved record max age | `infra::idempotency_store`、`application::idempotency` | 是 |
| projection policy | 控制 projection store、stale threshold、replace scope 和 failed marker | `infra::projection_stores`、`jobs::projection_rebuild` | 是 |
| jobs policy | 控制 batch、parallelism、retry、timeout、job run id 和 partial failure report | `jobs::*`、`worker::*` | 是 |
| external resolver | 控制 identity、method-library、source work、evidence、process timebox resolver | `infra::source_resolvers`、`jobs::reference_refresh` | 是 |
| outbox publisher | 控制 event collaboration publisher、retry、timeout 和 fake marker | `infra::publishers`、`worker::outbox_publisher`、`jobs::outbox_publisher` | 是 |
| trace / archive handoff | 控制 trace handoff、archive handoff、redaction 和 retry | `infra::handoff_adapters`、`jobs::handoff_delivery` | 是 |
| feature switches | 控制 derived views、advanced search 等外围能力 | `infra::runtime_builder`、`api`、`jobs` | 是 |
| clock / id generator | 控制 deterministic fake、system clock 和 id generator adapter | `infra::clock_id`、`infra::runtime_builder` | 是 |
| reports output | 控制 artifact / report root 和 run output | `jobs::reconciliation`、`jobs::handoff_delivery`、`scripts/reports` | 是 |
| security redaction | 控制 forbidden body、raw secret、raw payload 的拒绝和 evidence 检查 | `infra::handoff_adapters`、`jobs::*`、`scripts/checks` | 是 |
| remote config / admin override | 后续远程配置、受控覆盖和审计变更 | 后续配置中心 / ops 接缝 | 否,P2 |

### 7.3 模块读取边界表

| 模块 | 读取方式 | 不得做的事 |
|---|---|---|
| `infra::config` | 读取 JSON、env、secret / credential ref 和 entry args | 不读取相邻仓正文 |
| `infra::runtime_builder` | 接收已校验 config 并装配 repository / adapter / port | 不改变领域对象字段和状态机 |
| `api` | 只读取入口参数和 runtime handle | 不直接构造 store / resolver / publisher |
| `worker` | 只读取 worker profile 和 runtime handle | 不绕过 outbox / consumer 幂等 |
| `jobs` | 只读取 job profile、run args 和 runtime handle | 不通过配置开启 truth 自动修复 |
| `application` / `domain` / `contracts` | 不直接读取配置 | 不感知配置来源 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 3 建立配置来源链、装配入口和控制面总览,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| 统一以 load_and_validate / runtime builder 作为配置装配主入口 | 否 | 与 `03` §13 的 infra config / runtime builder 口径一致 | 无 | 无回写 |
| domain / contracts / application 不直接读取配置 | 否 | 与 `03` §13 模块读取边界一致 | 无 | 无回写 |

说明:

```text
本步只建立控制面视图。若 Step 7 需要新增 `WorkRuntimeConfig` 字段或 Step 9 需要新增 `ConfigError` 枚举值,必须在对应 Step 记录 03 回写。
```

## 9. 回填草稿

正式 `04-配置设计.md` §3 建议采用以下结构:

```text
3. 配置控制面总览
  3.1 配置来源链图
  3.2 配置装配入口
  3.3 配置控制面总表
  3.4 模块读取边界
  3.5 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §3.1 | `design-calibration/04_config_step_03_control_plane_overview.md` §7.1 |
| §3.2 | `design-calibration/04_config_step_03_control_plane_overview.md` §3.2 |
| §3.3 | `design-calibration/04_config_step_03_control_plane_overview.md` §7.2 |
| §3.4 | `design-calibration/04_config_step_03_control_plane_overview.md` §7.3 |
| §3.5 | `design-calibration/04_config_step_03_control_plane_overview.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 4 的待确认事项。

后续 Step 必须继续收口:

- Step 5 明确 entry local args 与 env override 的优先级和冲突处理。
- Step 7 按本步控制面生成模块级 JSON demo 和配置项作用表。
- Step 8 明确 secret / credential ref 的字段形态和禁止 raw secret 规则。
- Step 9 明确 loader / validator / runtime builder 的错误分类和 fail-fast / degraded 行为。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源链已形成 | 通过 | §7.1 |
| 配置控制面总表已形成 | 通过 | §7.2 |
| 模块读取边界已形成 | 通过 | §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 4 | 通过 | 下一步定义配置分类与禁止配置化边界 |
