# Step 1. 确认上游配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 正式回填：`04-配置设计.md` §1
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 2）

## 1. Step 状态与门禁

| 项 | 结论 |
|---|---|
| 当前 Step | Step 1：上游配置输入边界 |
| 用户授权 | 已明确连续完成正式 04 的 Step 1～15；完成正式 04 后停审，不进入 05 |
| 本步输入 | 正式 00/01/02/03、03 Step 14/15、专项上游当前正式文档、配置 SOP/书写规范 |
| 本步输出 | 上游输入映射、不再回答清单、必须回答清单、历史材料诊断和 03 影响初判 |
| 写入范围 | 仅 `projects/L4-archive/design-calibration/` 与项目台账；不改正式 03、不写代码 |
| 下一动作 | 更新 flow/台账后进入 Step 2 |

## 2. 本步目标

确认配置设计所依赖的需求、架构、概要、详细设计及下游方向输入是否足够，并把“可作为配置真相的输入”和“只能作为历史/方向材料的输入”分开。本步不列完整配置项，不选择 provider、算法、secret、endpoint、数值或部署形态。

## 3. 输入清单与权威等级

| 输入 | 权威等级 | 本步用途 | 处置 |
|---|---|---|---|
| `00-需求文档.md` | 本仓正式上游 | 需求、NFR、安全、数据所有权、source-authority、恢复与生命周期红线 | 作为配置边界真相 |
| `01-架构设计.md` | 本仓正式上游 | 六 CP、系统上下文、依赖裁剪、运行/事件/ref/adapter 边界 | 作为配置控制面边界 |
| `02-概要设计.md` | 本仓正式上游 | 26 对象、入口、状态、错误、配置影响轮廓和禁止配置化项 | 作为配置承接骨架 |
| `03-详细设计.md` | 直接正式输入 | `infra/config.rs`、`runtime_builder.rs`、slot、port、UoW、flow、错误、观测和测试切口 | 作为唯一代码契约输入 |
| `03_ddd_step_14_config_external_binding.md` | 直接校准输入 | typed ref、11 类 `ArchiveAdapterSlot`、required-set、builder 顺序与 fail-closed | 作为配置绑定细节 |
| `03_ddd_step_15_observability_audit.md` | 直接校准输入 | safe telemetry、redaction、native durable record、sink 边界 | 作为敏感/观测输入 |
| L1 truth owner 正式文档 | 专项正式上游 | identity、conversation、work、process、governance 的 source/decision/restore authority | 只消费正式边界；合同缺口登记 blocker |
| `L1-artifact` 正式文档 | 专项正式上游 | Artifact body/version/lineage/material ref 边界 | 不复制 Artifact truth |
| `L1-workspace` 正式文档及其 04 | 专项上游/粒度参考 | workspace projection/export 的 Auxiliary 限制和配置文档粒度 | 不复制其领域主语、算法或数值 |
| `L4-observability` 正式文档 | 专项上游 | audit/evidence material、redaction、backend authority | 不拥有后端配置真相 |
| `L0-core`、`L0-bus`、`L0-sdk` 正式文档 | 平台边界输入 | Core compile candidate、Bus event、SDK 方向 | SDK 方向 blocker 保留 |
| 旧 `README.md`、旧 `05/06`、`draft/` | `historical_material` | 污染审计、旧风险和下游方向线索 | 不得直接继承 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前配置设计要承接哪些需求、NFR、安全和环境差异？ | 承接受控归档/恢复流程、逐源 authority/fence/coverage、Bundle 闭包、完整性/兼容性、存储/生命周期执行、owner-specific restore、Query no-write、最小披露、失败可见和环境差异可测试等要求。环境具体矩阵留 Step 6。 |
| 03 中哪些配置引用、runtime builder、adapter 或外部依赖要进入配置设计？ | `infra/config.rs` 的 raw reader、`runtime_builder.rs` 的 validated binding 与 frozen required slots、Store/Context/Authority/Visibility、各 SourceExport、Integrity、Compatibility、GovernanceDecision、ArchiveStorage、RestoreReceiver、InboundConsumer，以及 budgets、cursor/operation codec、retention schedule ref、observability/redaction seam。 |
| 哪些测试和验收场景依赖配置矩阵？ | required-slot 缺失/错配、fake 与 durable 隔离、source/receiver 精确路由、Query continuation、secret redaction、profile 组合、commit-unknown、配置漂移和 fail-closed 场景。旧 `05/06` 仅提供方向，不能覆盖新版 03。 |
| 哪些内容不应在配置设计中重新定义？ | 不重新定义需求目标、架构方案、26 个对象、DTO、trait/port、函数流、状态机、错误枚举、owner truth、治理裁决、Artifact 正文、workspace canonical truth、observability backend、部署命令或实施 commit boundary。 |
| 当前上游是否阻塞进入 Step 2？ | 不阻塞本地范围收敛。`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 和 `AR-03-LOCAL-001~005` 会限制正向 provider、outbound、预算和 codec，但可在配置设计中以 blocked/pending/fail-closed 表达。 |

## 5. 当前材料问题与 historical pollution 诊断

| 材料/位置 | 发现 | 当前处置 |
|---|---|---|
| `README.md` | 出现 S3/MinIO、PostgreSQL、Glacier、固定七年、性能数字及合规 claim | 仅登记 historical material；不生成配置项或默认值 |
| 旧 `05-测试方案.md`、`06-验收标准.md` | 旧对象名、旧 `StorageTier`/`RetentionClass`、旧 snapshot/digest 流程和环境假设 | 只作污染审计和下游方向；以新版 00～03 覆盖 |
| `draft/` | 早期能力/模块推演，未经过当前 owner、依赖和安全审计 | `pre-calibration_input`，不作为正式配置事实 |
| `03` §13 | 已固定 raw reader、builder、slots 和外部关系，但未给文件 schema、来源优先级、profile、数值和 secret 方案 | 正是本 04 的展开范围 |
| `03` §17 | 产品、算法、存储、receiver、workload 等未闭合 | 保持 blocker/pending；不得由配置设计私造选择 |

## 6. 上游输入映射与正式回填

| 来源 | 可承接的配置输入 | 正式 04 回填章节 |
|---|---|---|
| `00` §2/4/6/7/9/11/12/13/14 | 配置不能改变 truth owner、项目状态、治理许可、恢复写权、数据披露和失败语义 | §1、§4、§11、§14 |
| `01` §3~§8 | 依赖分类、六 CP、runtime/event/ref/adapter/fake、系统边界和产品中立 | §1、§3、§4、§5 |
| `02` §3~§14 | 配置影响轮廓、required seam、状态/错误/事务/Query no-write 红线 | §2、§4、§7、§9、§11 |
| `03` §4~§17 | config reader、runtime builder、typed binding、slot registry、预算/codec/retention/telemetry pending | §3、§7、§8、§9、§14 |
| 03 Step 14/15 | 代码读取边界、source-authority、redaction、外部关系和 fake 上限 | §3、§4、§8、§9、§11 |
| 旧 05/06 与专项配置样本 | profile/test/验收方向和粒度参考 | §6、§12；不能覆盖正式输入 |

## 7. 配置设计不再回答的问题

- 不重新裁决 source-authority matrix、项目 `archived/dissolved/restored` 状态、RetentionPolicy、legal hold、delete authority 或 risk acceptance。
- 不选择对象存储、数据库、Bus、KMS/secret provider、签名/摘要/加密/压缩/schema evolution 供应商或算法。
- 不把 L1 snapshot/export、workspace projection、Artifact/evidence、observability backend 或 SDK 变成 Cargo 依赖。
- 不在 `04` 中新定义 Rust struct/enum/trait/port/DTO/function/flow/error；若配置结论需要这些变化，先回写 `03`。
- 不写部署命令、容器编排、真实 endpoint、凭据、密钥材料、工单系统字段、测试 run、artifact 或 readiness。

## 8. 配置设计必须回答的问题

- 配置控制面、功能配置域和禁止配置化边界是什么。
- 来源覆盖、优先级、同级冲突、非法高优先级值和来源不可达如何处理。
- local/CI/staging-like/production-like profile 的能力、fake、敏感配置和 blocker 差异是什么。
- 每个配置项的稳定名称、类型、默认/必填、作用域、生效、敏感级别、失败策略和关联模块是什么。
- secret 只以何种 opaque reference 进入配置，如何轮换、审计和禁止输出。
- parse/type/cross-field/binding validation、runtime assembly、变更审计、回滚、失效和演进如何闭环。
- 05/06/07/09 如何承接，而不把下游文档或部署手册反向变成配置真相。

## 9. 设计取舍

| 议题 | 方案 A | 方案 B | 采用 |
|---|---|---|---|
| 直接写正式 04 | 跳过中间产物 | 先完成 04 flow/Step 产物再装配 | B，符合 SOP 和三层门禁 |
| 继承旧 05/06 配置 | 直接复制旧 key/值 | 只作方向与污染输入，按 00～03 重建 | B，防止历史口径回流 |
| 锁定 provider/算法 | 在配置阶段替实现/安全 owner 选型 | 只定义 typed ref、blocked/fail-closed seam | B，保持 owner 权限和产品中立 |
| 允许配置改变代码契约 | 在 04 静默增加字段/constructor | 记录影响并回写/阻塞 03 | B，保持唯一真相源 |
| 是否走无配置路径 | 以“外部产品未定”为无配置 | 依据既有 runtime/binding/预算需求判定为有配置 | B；Step 2 继续确认 |

## 10. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置设计承接 `03` §13 与 Step 14/15 的既有 binding、slot 和 builder | 否 | 输入映射 | 不适用 | 无回写 |
| raw config 只由 `infra/config.rs` 读取，builder 只消费 validated refs | 否 | 既有边界重申 | 不适用 | 无回写 |
| 旧 README/05/06/draft 不作为当前配置真相 | 否 | historical 处置 | 不适用 | 无回写 |
| 后续若新增 `CoreRuntimeConfig` 字段、builder 生命周期、adapter constructor、port、error、DTO 或 flow | 是（未来触发） | 代码契约变更 | `03` §4～§15 及对应 Step | 无回写（未来触发前暂停并回写） |

当前未发现需要立即回写的本地配置结论；最后一行作为全流程硬门禁保留。

## 11. 回填草稿

> 校准来源：`design-calibration/04_config_step_01_upstream_boundary.md`

正式 §1 应说明：本配置设计以正式 00～03 为权威基线，尤其承接 03 §13 的 `infra/config.rs`/`runtime_builder.rs`、11 类 exact adapter slot、source-authority 与 fail-closed 规则；专项上游只用于核验 owner 边界；旧 README、旧 05/06 和 draft 仅作 historical material。配置设计不重定义代码契约；任何影响 runtime config、builder、adapter constructor、port、error、DTO 或 flow 的结论必须先回写 03 或标为阻塞。

## 12. 待确认事项与进入下一步条件

| 待确认事项 | 影响 | 未确认前处理 |
|---|---|---|
| 各 L1 owner 的 exact export/restore schema 尚未统一 | per-source/per-owner 配置 binding 不能宣称 ready | 保留 typed ref，exact slot `Blocked`/`Partial` |
| integrity/storage/KMS/schema provider 未选 | 不能生成 digest/signature/location/commit 成功 | 只定义 capability ref，结果 `Unknown`/`Unsupported` |
| operation/cursor codec 和 workload 数值未闭合 | mutation reserve/continuation/预算不能安全启用 | 无隐式默认，分别 `Blocked` 或 `fail-fast` |
| outbound event family 未核验 | 不能定义 publisher/topic/outbox 配置 | 不创建对应配置组或 slot |

| 进入 Step 2 条件 | 状态 |
|---|---|
| 权威输入清单已固定 | 通过 |
| 历史材料已隔离 | 通过 |
| 配置设计不再回答/必须回答边界已记录 | 通过 |
| 03 影响判定已记录且无当前待回写项 | 通过；future 代码契约仍为硬阻塞规则 |
| Step 1 产物写入、flow/项目台账同步 | 待本轮同步后通过 |
