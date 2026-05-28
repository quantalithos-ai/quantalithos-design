# Step 1. 确认配置输入边界

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 1 中间产物。
> 本步只确认配置设计需要承接哪些上游输入、哪些内容不再由配置设计回答、哪些缺口需要进入待确认事项。
> 本步不创建正式 `04-配置设计.md`,不提前定义完整配置项 schema,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-core/04-配置设计.md` §1 与上游文档的关系声明

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | L0-core 的定位、目标、非目标、跨仓依赖和边界约束 | 确认配置设计不能吸收 SDK 高层配置、认证封装、重试策略和客户端体验 |
| `01-架构设计.md` | 系统上下文、责任边界、外部依赖、横切关注点、配置与变更控制 | 确认配置不能绕开契约范围、兼容性策略、发布基线、快照派生和事实输出 |
| `02-概要设计.md` | 主要组成部分、关键对象轮廓、接口轮廓、流程、支撑端口 | 确认哪些组成部分受配置影响,哪些支撑端口需要配置承接 |
| `03-详细设计.md` | `CoreRuntimeConfig`、runtime builder、adapter、port、配置引用表、外部依赖绑定表 | 固定配置设计的主要输入来源和不能重新定义的实现契约 |
| `05-测试方案.md` | 测试环境与配置矩阵方向 | 作为后续 Step 12 的下游承接参考;当前内容存在旧口径,不作为配置事实源 |
| `06-验收标准.md` | 配置相关验收门禁方向 | 作为后续 Step 12 的下游承接参考;当前内容存在旧口径,不作为配置事实源 |

已确认结论:

```text
L0-core 当前没有在线 runtime container,也不负责 SDK 高层客户端体验。
配置设计必须围绕本地 CLI / job runtime、文件型 store、reference resolver、gate / blob adapter、toolchain runner、outbox relay 等边界展开。
正式配置设计只承接上游设计,不重新定义 Rust 对象、函数签名、trait、事件 schema 或部署命令。
```

---

## 3. SOP 问题回答

1. 当前配置设计要承接哪些需求、非功能、安全和环境差异?

   回答：需要承接 `00-需求文档.md` 中的 L0-core 仓库定位、非目标和跨仓边界;承接 `01-架构设计.md` 中“配置与变更控制”横切关注点;承接 `02-概要设计.md` 中 source、snapshot、audit、outbox、reference resolver、gate、unit of work 等支撑接缝;承接 `03-详细设计.md` 中 runtime config、runtime builder、adapter 和失败策略。安全上要重点承接“不保存凭据正文、不吸收外部正文、引用解析 fail closed、配置不能绕过审计和门禁”的约束。环境差异主要体现在 local、CI / test、release-like、operations replay 等 profile 的 root path、fake / real-like adapter、toolchain runner 和 event publisher 绑定差异。

2. 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计?

   回答：必须进入配置设计的详细设计输入包括 `CoreRuntimeConfig`、`build_cli_runtime(CoreRuntimeConfig config)`、`build_job_runtime(CoreRuntimeConfig config)`、`contract_source_root`、`release_snapshot_root`、`projection_index_root`、`audit_root`、`outbox_root`、`idempotency_root`、`reference_resolver_config`、`CoreInfraPorts`、文件型 source / snapshot / projection / audit / outbox / idempotency store、`GateDecisionAdapter`、`ReferenceResolverAdapter`、`BlobRefAdapter`、`L0BusEventPublisherAdapter`、toolchain runner、clock、id generator 和 unit of work。

3. 哪些测试和验收场景依赖配置矩阵?

   回答：缺失 root、非法 path、只读 snapshot、audit / outbox / idempotency root 隔离、reference resolver allow-list、gate / blob / reference fail closed、fake 与 real-like adapter 切换、toolchain runner 路径与超时、outbox relay 发布失败、projection rebuild、job replay、默认配置加载、冲突配置拒绝等场景都依赖配置矩阵。当前 `05/06` 尚未按新版 L0-core 主线校准,配置设计应先提供矩阵输入,后续测试和验收再据此重写。

4. 哪些内容不应在配置设计中重新定义?

   回答：不应重新定义需求目标、系统上下文、主要组成部分、Rust struct / enum / trait / function、Command / Query / Event / Job DTO、状态机、事务语义、错误枚举、具体测试用例、部署命令、CI 脚本、运维值班流程、SDK 高层配置体验、认证封装或 L0-bus runtime。

5. 当前上游是否存在会阻塞配置设计的缺口?

   回答：不存在阻塞 Step 1~Step 2 的缺口,但存在后续必须收口的缺口：当前未定义完整配置 schema、环境变量名、CLI flag 名、配置文件格式、reference resolver allow-list 细节、toolchain runner 二进制路径与参数、event publisher 真实绑定参数、敏感配置策略以及正式 `04-配置设计.md`。另外 `05-测试方案.md` 与 `06-验收标准.md` 仍有 shared primitive / registry / admission 等旧口径,需要在配置设计完成后再校准。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-core/04-配置设计.md` | 文件尚未创建 | 配置控制面无法被测试、验收、实施和运维引用 |
| `projects/L0-core/03-详细设计.md` §13 | 只列出配置引用和依赖绑定,没有定义来源优先级、环境矩阵、配置项 schema、敏感配置和变更审计 | 实现者知道需要哪些配置,但不知道配置从哪里来、如何覆盖、如何校验和如何失效 |
| `projects/L0-core/05-测试方案.md` | 仍有旧版 shared primitive / registry / admission 口径 | 不能直接作为新版配置测试矩阵事实源 |
| `projects/L0-core/06-验收标准.md` | 仍有旧版 replay / registry / catalog 口径 | 不能直接作为新版配置验收门禁事实源 |
| `standards/document/配置设计讨论流程_SOP.md` | 已要求每个 Step 记录详细设计影响判定 | 本轮必须显式判断配置结论是否需要回写 03 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 配置内容散落在 `03-详细设计.md` §13 | 新增独立配置设计校准流程,最终产出 `04-配置设计.md` | 配置是测试、验收、实施和运维共同引用的控制面,不适合只藏在详细设计中 |
| 上游承接 | 默认从 03 的配置表直接扩写 | 明确从 00/01/02/03 承接边界,05/06 只作下游参考 | 防止把旧测试验收口径或实现细节误写成配置事实 |
| 详细设计关系 | 只说 04 承接 03 | 每步都判断是否需要反向回写 03 | 防止在 04 中静默新增 runtime config、adapter、trait 或 error 契约 |
| 下游关系 | 测试和验收先行引用旧口径 | 配置设计先提供新版配置矩阵,再反向支撑 05/06 校准 | 配置矩阵应成为测试和验收的输入 |
| 非范围 | 未显式说明 | 明确不重新定义 Rust 契约、部署命令、SDK 配置体验和 L0-bus runtime | 防止配置设计越界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续把配置写在 `03-详细设计.md` §13 | 改动少,与 runtime builder 紧贴 | 无法系统表达来源优先级、环境矩阵、敏感配置、变更审计和失效策略;测试验收难引用 | 不采用 |
| 方案 B：新增正式 `04-配置设计.md`,先用中间产物逐步收敛 | 配置控制面清晰,可承接 03 并交付给 05/06/07/09 | 需要额外维护 15 个 Step 中间产物 | 采用 |
| 方案 C：把配置设计推迟到实施阶段 | 早期设计负担低 | 实施者会自行发明 env / CLI / file schema,导致跨仓和测试口径漂移 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | L0-core 不承担 SDK 高层配置、认证封装、重试策略;不保存凭据正文;跨仓只提供契约来源 | §1 / §2 / §4 / §8 |
| `01-架构设计.md` | 无在线 runtime container;配置与变更控制保护契约范围、兼容性策略、发布基线、快照派生和事实输出 | §1 / §3 / §4 / §10 |
| `02-概要设计.md` | source、snapshot、audit、outbox、reference resolver、gate、unit of work、event publisher 等支撑接缝 | §3 / §7 / §9 / §11 |
| `03-详细设计.md` | `CoreRuntimeConfig`、runtime builder、配置引用表、外部依赖绑定表、失败策略 | §3 / §5 / §7 / §9 / §11 |
| `05-测试方案.md` | 测试环境矩阵、fake / real-like adapter、配置错误场景方向 | §12,但需后续校准 |
| `06-验收标准.md` | 配置门禁、失败一票否决、证据要求方向 | §12,但需后续校准 |

### 7.2 不再回答的问题清单

| 问题 | 交给哪份文档 / 哪一层 |
|---|---|
| Rust struct / enum / trait / function 如何定义 | `03-详细设计.md` |
| Command / Query / Event / Job schema 如何定义 | `03-详细设计.md` |
| 具体测试用例、fixture 和覆盖率目标如何写 | `05-测试方案.md` |
| 什么结果算验收通过或失败 | `06-验收标准.md` |
| 实施顺序、开发任务、提交节奏如何安排 | `07-实施计划.md` |
| 具体部署命令、容器挂载、值班流程如何执行 | 部署与运维手册 |
| SDK 高层客户端如何读取配置、重试和认证 | `L0-sdk` |
| L0-bus publish / subscribe / ack / retry runtime 如何实现 | `L0-bus` |

### 7.3 配置设计必须回答的问题清单

| 问题 | 目标章节 |
|---|---|
| L0-core 有哪些配置控制面 | §3 |
| 哪些行为允许配置化,哪些禁止配置化 | §4 |
| 配置来源有哪些,按什么优先级覆盖 | §5 |
| local / CI / release-like / operations profile 有哪些配置差异 | §6 |
| 每个配置项的名称、类型、默认值、必填性、来源、作用域和失败策略是什么 | §7 |
| 是否存在敏感配置,如何通过 secret ref 或 adapter-local config 处理 | §8 |
| 配置如何加载、解析、校验、装配 runtime 并生效 | §9 |
| 配置变更如何审计、回滚和防漂移 | §10 |
| 配置缺失、错误、冲突、不可达时如何 fail fast / fail closed / retry / replay | §11 |
| 配置设计如何交付给测试、验收、实施和运维 | §12 |
| 配置如何迁移、废弃和演进 | §13 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 1 只确认 `04-配置设计.md` 的上游输入边界 | 否 | 无代码契约变化 | 无 | 无回写 |
| `05/06` 当前只作为下游承接方向参考,不作为配置事实源 | 否 | 下游文档校准关系 | 无 | 无回写 |
| 本步不新增 `CoreRuntimeConfig` 字段、不拆分 `ReferenceResolverConfig`、不改变 runtime builder 签名 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

- 本步没有发现必须立即回写 `03-详细设计.md` 的配置结论。
- 后续 Step 如果决定拆分 `reference_resolver_config`、新增 adapter constructor 参数、增加配置错误类型或改变 runtime builder 入口,必须在对应 Step 标记为 `待回写`。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“对详细设计的影响判定”“回填草稿”和“待确认事项”小节，了解本章配置设计输入边界如何从上游文档收敛而来。

本配置设计承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 与 `03-详细设计.md`。

`00-需求文档.md` 确定 L0-core 的定位和非目标：本仓提供可派生契约来源，不承担 SDK 高层客户端配置、认证封装、重试策略和开发者体验。

`01-架构设计.md` 确定 L0-core 没有在线 runtime container，配置与变更控制只能保护契约范围、兼容性策略、发布基线、快照派生和事实输出，不能通过配置绕开架构红线。

`02-概要设计.md` 确定 source、snapshot、audit、outbox、reference resolver、gate、unit of work、event publisher 等支撑接缝，这些接缝决定配置控制面的主要覆盖范围。

`03-详细设计.md` 确定 `CoreRuntimeConfig`、`build_cli_runtime(CoreRuntimeConfig config)`、`build_job_runtime(CoreRuntimeConfig config)`、配置引用表和外部依赖绑定表。配置设计只承接这些实现契约，不重新定义 Rust struct、enum、trait、function、DTO、状态机或事务语义。

本章未发现需要立即回写 `03-详细设计.md` 的配置结论。后续章节若改变 runtime config、builder、adapter、trait、error 或函数流，必须先进入详细设计回写清单并完成回写后再定稿。

`05-测试方案.md` 与 `06-验收标准.md` 当前作为下游承接方向参考。配置设计完成后，应把配置矩阵、配置错误场景和配置门禁回流给测试与验收文档继续校准。
```

---

## 10. 待确认事项

- 是否接受本轮配置设计先以新版 `00/01/02/03` 为主输入,暂不把当前 `05/06` 的旧口径作为配置事实源。
- 是否接受正式 `04-配置设计.md` 只在 Step 15 统一创建,前 14 个 Step 只写 `design-calibration/` 中间产物。
- 是否接受 Step 2 开始优先收敛 P0 配置范围,将 toolchain 细节、真实 event publisher 参数和部署命令留给后续 Step 或实施 / 运维文档。

---

## 11. 进入下一步条件

- [x] 用户确认配置设计以上游 `00/01/02/03` 为主输入。
- [x] 用户确认 `05/06` 目前只作为下游方向参考,不作为配置事实源。
- [x] 用户确认正式 `04-配置设计.md` 在 Step 15 统一整理。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 1 状态从 `[~]` 更新为 `[x]`。
