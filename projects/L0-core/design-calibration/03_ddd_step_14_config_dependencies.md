# Step 14. 定义配置引用与外部依赖绑定

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 14 中间产物。
> 本步只收稳运行时配置项、配置读取位置、外部依赖绑定位置、超时 / 重试 / 降级口径。
> 本步不写完整配置手册,不设计独立配置中心,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
- 回填章节: `projects/L0-core/03-详细设计.md` §13 配置引用与外部依赖绑定

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 模块主轴 | `application_services`、`infra_adapters`、`cli_entry`、`jobs` 的职责边界 | 固定哪些模块从运行时读取配置 |
| Step 7 Trait / Port / Adapter 契约 | `CoreRuntimeConfig`、`CoreInfraPorts`、adapter 实现边界 | 固定配置注入位置和 adapter 绑定边界 |
| Step 11 持久化、事务与一致性 | source / snapshot / projection / outbox / audit / idempotency 的存储要求 | 固定目录型存储配置 |
| Step 12 错误模型 | `Port` / `PreconditionFailed` / `Internal` 等错误映射 | 固定外部依赖失败时的降级口径 |
| Step 13 并发、幂等与重入保护 | `IdempotencyRepository`、`OutboxRelayWorker`、`ProjectionRebuildId` | 固定重试和 replay 的配置绑定点 |

已确认结论:

```text
CLI / job 启动时读取 CoreRuntimeConfig,然后交给 build_cli_runtime / build_job_runtime。
文件型 source / snapshot / projection / audit / idempotency / outbox store 只需要根目录配置,不需要在线连接配置。
Gate / reference / blob / toolchain / event publisher 的细节不在 domain 内读取,而是由 adapter 注入或在 adapter 构造时读取局部配置。
外部依赖失败时,truth 不应被错误回滚;应按 Step 11 / 12 / 13 的口径处理为失败、replay、retry 或 fail closed。
```

---

## 3. 本步写作策略

本步按“配置项 -> 读取模块 -> 绑定位置 -> 失败策略”展开:

```text
先定 runtime config 的入口 -> 再定 adapter 的绑定位置 -> 再定外部依赖失败时怎么降级
```

写作约束:

- 只写会影响实现接线的配置和依赖绑定。
- 不写完整配置文件格式、不写环境变量全集、不写配置中心设计。
- 只为当前 P0 会实际落地的 adapter 和 runtime 入口定义配置项。
- 外部依赖的超时 / 重试 / 降级只写会影响业务语义的部分。
- 任何留给配置设计文档的细节都要明确标注“待补”。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 14.1 | [x] | 配置和依赖总览 |
| 14.2 | [x] | SOP 问题回答 |
| 14.3 | [x] | 配置引用表 |
| 14.4 | [x] | 外部依赖绑定表 |
| 14.5 | [x] | 失败策略与降级口径 |
| 14.6 | [x] | 回填草稿 |

---

## 5. SOP 问题回答

### 5.1 哪些模块需要读取配置？

| 模块 | 读取内容 | 说明 |
|---|---|---|
| `l0_core_cli/src/main.rs` | `CoreRuntimeConfig` | CLI 入口负责从本地配置源装配 runtime |
| `l0_core_jobs/src/bin/*.rs` | `CoreRuntimeConfig` | 所有后台 job 入口统一走 runtime 装配 |
| `l0_core_infra` 各 adapter 构造器 | 路径 root / resolver config / adapter-local defaults | 具体 adapter 从 runtime config 取得根目录和局部配置 |
| `build_cli_runtime(...)` / `build_job_runtime(...)` | 全量 runtime config | 是配置进入 application / infra 的唯一正门 |
| `application_services` | 不直接读取配置 | 只接收已装配好的 port 和策略对象 |

### 5.2 配置项的类型、默认值和读取位置是什么？

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `contract_source_root` | `ContractSourceRoot` | `build_cli_runtime` / `build_job_runtime` | `./contract-source` | 待补（配置设计文档） |
| `release_snapshot_root` | `ReleaseSnapshotRoot` | `build_cli_runtime` / `build_job_runtime` | `./release-snapshots` | 待补（配置设计文档） |
| `projection_index_root` | `ProjectionIndexRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/projection` | 待补（配置设计文档） |
| `audit_root` | `AuditRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/audit` | 待补（配置设计文档） |
| `outbox_root` | `OutboxRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/outbox` | 待补（配置设计文档） |
| `idempotency_root` | `IdempotencyRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/idempotency` | 待补（配置设计文档） |
| `reference_resolver_config` | `ReferenceResolverConfig` | `build_cli_runtime` / `build_job_runtime` | `ReferenceResolverConfig::default()` | 待补（配置设计文档） |

### 5.3 哪些外部依赖需要通过 adapter 注入？

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| `FilesystemContractSourceStore` | `CoreInfraPorts.source_store` | `ContractSourceStorePort` | 无网络超时;I/O 失败可在命令 / job 级别重试 | fail fast,返回 `Port` |
| `FilesystemReleaseSnapshotStore` | `CoreInfraPorts.snapshot_store` | `ReleaseSnapshotStorePort` | 无网络超时;快照导出失败可重跑 job | 资产写失败时不写 metadata |
| `FileProjectionIndexStore` | `CoreInfraPorts.projection_store` | `ProjectionStorePort` | 无网络超时;重建可重跑 | 保留旧 projection 或 stale view |
| `FileAuditLogStore` | `CoreInfraPorts.audit_log_store` | `AuditLogPort` | 无网络超时;与 truth 同事务 | truth 不应在 audit 失败时静默成功 |
| `FileIdempotencyStore` | `CoreInfraPorts.idempotency_store` | `IdempotencyRepository` | 无网络超时;重复请求通过 replay 处理 | 预占失败则返回 `Conflict` / `Port` |
| `FileOutboxStore` | `CoreInfraPorts.outbox_store` | `OutboxPort` | 无网络超时;relay 可重试 | outbox 保留 pending / failed |
| `GateDecisionAdapter` | `CoreInfraPorts.gate_decision_adapter` | `GateDecisionPort` | 依赖读取失败后不自动放行,调用方可重试 | fail closed,返回 `PreconditionFailed` 或 `Port` |
| `ReferenceResolverAdapter` | `CoreInfraPorts.reference_resolver_adapter` | `ReferenceResolverPort` | 解析失败可重试,但不缓存正文 | fail closed,阻断发布或校验 |
| `BlobRefAdapter` | `CoreInfraPorts.blob_ref_adapter` | `BlobRefPort` | blob 不可读时可重试 | fail closed,不读取正文 |
| `L0BusEventPublisherAdapter` | `CoreInfraPorts.event_publisher_adapter` | `EventPublisherPort` | 由 outbox relay 重试 / replay | 不回滚 truth,保留 outbox 状态 |
| `SystemClockAdapter` | `CoreInfraPorts.clock` | `ClockPort` | 不适用 | 使用系统时间或测试时间 |
| `StableIdGeneratorAdapter` | `CoreInfraPorts.id_generator` | `IdGeneratorPort` | 不适用 | 生成失败则直接报错,不继续写入 |
| `ContractValidationRunner` | `CoreInfraPorts.validation_runner` | `ContractValidationRunnerPort` | 事务外运行,失败可重跑 job | 记录 job 失败,不改写真相 |
| `CanonicalFingerprintRunner` | `CoreInfraPorts.fingerprint_runner` | `FingerprintRunnerPort` | 事务外运行,失败可重跑 job | 记录 job 失败,不改写真相 |
| `CanonicalSnapshotExporter` | `CoreInfraPorts.snapshot_exporter` | `SnapshotExporterPort` | 事务外运行,失败可重跑 job | 资产失败不写快照元数据 |
| `FileUnitOfWorkAdapter` | `CoreInfraPorts.unit_of_work` | `UnitOfWork` | 失败则整体回滚 | 不吞掉 application error |

### 5.4 外部依赖的超时、重试、降级策略是什么？

| 依赖类别 | 超时 | 重试 | 降级 / 失败口径 |
|---|---|---|---|
| 文件型 store / audit / idempotency / outbox / projection | 不走网络超时;仅 I/O 和锁失败 | 由 command / job / relay 重试 | fail fast,返回 `Port` 或让上层回滚 |
| 门禁 / 引用 / blob 校验 | 依赖读取失败时等同不可用 | 可以在同一 command / job 重新尝试 | fail closed,阻断发布 / 校验 / 快照派生 |
| outbox event publisher | 以单条发布超时为界 | relay worker 重放同一事件 | truth 不回滚,outbox 保留 pending / failed |
| validation / fingerprint / snapshot exporter 工具链 | 外部进程执行超时 | job 级重跑 | 失败写 job 失败审计,不改写真相 |
| clock / id generator | 不适用 | 不适用 | 生成失败时直接报错,不继续写入 |

### 5.5 哪些配置细节应留给配置设计文档？

| 项目 | 当前处理方式 | 后续文档 |
|---|---|---|
| 配置文件格式 | 不在本步定义 | 配置设计文档 |
| 环境变量名 | 不在本步定义 | 配置设计文档 |
| CLI flag 解析 | 不在本步定义 | 配置设计文档 |
| 具体 resolver 目录 / scheme allow-list | 仅保留 `ReferenceResolverConfig` 作为入口 | 配置设计文档 |
| toolchain 二进制路径、参数和运行时镜像 | 本步只定义 adapter 绑定 | 实施计划 / 配置设计文档 |
| 详细超时阈值和重试退避策略 | 只写语义口径 | 配置设计文档或运维手册 |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| 之前 `CoreRuntimeConfig` 只写了 source / snapshot / projection / outbox / reference resolver | audit / idempotency 的文件型实现没有显式根目录 | 已回补 `audit_root` 和 `idempotency_root` |
| `CoreInfraPorts` 里没有 idempotency store | Step 13 幂等契约无法落到 runtime wiring | 已回补 `FileIdempotencyStore` 字段 |
| Step 7 只说 adapter 实现,没说配置从哪里进入 | 运行时装配点不清晰 | 已固定 `build_cli_runtime` / `build_job_runtime` 为唯一入口 |
| 外部依赖的失败策略散落在 Step 11 / 12 / 13 | 容易在实现时重复定义 | 本步统一收口为 fail fast / fail closed / replay / rerun |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| runtime config | 只有 source / snapshot / projection / outbox / reference resolver | 补齐 audit / idempotency 根目录，能支撑全部文件型 state store |
| adapter 绑定 | 只强调实现 port | 明确 `CoreInfraPorts` 字段、装配入口和依赖策略 |
| 外部依赖 | 仅知道有哪些 adapter | 明确哪些是 fail closed，哪些可 replay，哪些需要 rerun |
| 配置细节 | 容易被写成完整配置手册 | 明确哪些细节留给配置设计文档 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| audit / idempotency 目录是否单独作为 root | 复用其他 root | 单独 root | B | 文件型 state store 的职责和生命周期不同，独立 root 更清楚 |
| `ReferenceResolverConfig` 是否在本步展开全部字段 | 直接展开完整 schema | 只保留配置入口 | B | 细节容易牵涉后续配置设计文档，不应在详细设计里过度绑定 |
| gate / blob / reference 失败是否默认放行 | 放行 | fail closed | B | 这些依赖失败时继续发布会破坏契约正确性 |
| toolchain 失败是否回滚 truth | 回滚 truth | 保留 truth,记录 job 失败 | B | 工具链是派生和校验边界,不能反向打碎已提交真相 |

---

## 9. 结构化中间产物

### 9.1 配置到 runtime 的流向

```text
[config source]
  |
  v
[CoreRuntimeConfig]
  |
  +--> build_cli_runtime(...)
  |       |
  |       v
  |   [CoreCliRuntime]
  |
  +--> build_job_runtime(...)
          |
          v
      [CoreJobRuntime]
```

关键说明:

- 配置进入系统的唯一入口是 runtime 装配函数。
- application service 不直接读取文件、环境变量或 CLI flag。
- adapter 只拿自己需要的局部配置,不接触无关配置。

### 9.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `contract_source_root` | `ContractSourceRoot` | `build_cli_runtime` / `build_job_runtime` | `./contract-source` | 待补（配置设计文档） |
| `release_snapshot_root` | `ReleaseSnapshotRoot` | `build_cli_runtime` / `build_job_runtime` | `./release-snapshots` | 待补（配置设计文档） |
| `projection_index_root` | `ProjectionIndexRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/projection` | 待补（配置设计文档） |
| `audit_root` | `AuditRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/audit` | 待补（配置设计文档） |
| `outbox_root` | `OutboxRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/outbox` | 待补（配置设计文档） |
| `idempotency_root` | `IdempotencyRoot` | `build_cli_runtime` / `build_job_runtime` | `./state/idempotency` | 待补（配置设计文档） |
| `reference_resolver_config` | `ReferenceResolverConfig` | `build_cli_runtime` / `build_job_runtime` | `ReferenceResolverConfig::default()` | 待补（配置设计文档） |

### 9.3 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| 文件型 store / audit / idempotency / outbox / projection | `CoreInfraPorts` 对应字段 | 对应 port | 无网络超时;I/O 失败由上层重试 | fail fast,保留 truth |
| 门禁 / 引用 / blob | `CoreInfraPorts` 对应 adapter | `GateDecisionPort` / `ReferenceResolverPort` / `BlobRefPort` | 读取失败可重试,但不默认放行 | fail closed,阻断发布 / 校验 |
| 事件发布 | `CoreInfraPorts.event_publisher_adapter` | `EventPublisherPort` | 由 outbox relay 重试 / replay | outbox 保留 pending / failed |
| 工具链 runner | `CoreInfraPorts.validation_runner` / `fingerprint_runner` / `snapshot_exporter` | `ContractValidationRunnerPort` / `FingerprintRunnerPort` / `SnapshotExporterPort` | 事务外执行,失败可重跑 job | 记录 job 失败,不回滚 truth |
| 运行时基础支撑 | `CoreInfraPorts.unit_of_work` / `clock` / `id_generator` | `UnitOfWork` / `ClockPort` / `IdGeneratorPort` | 不适用 | 失败直接报错,不继续写入 |

### 9.4 回补说明

本步要求的配置与依赖绑定已经回补到前序文件:

| 回补位置 | 回补内容 |
|---|---|
| Step 7 Trait / Port / Adapter 契约 | `CoreRuntimeConfig` 增加 `audit_root`、`idempotency_root`;`CoreInfraPorts` 增加 `FileIdempotencyStore`;adapter 实现表增加 `FileIdempotencyStore` |
| Step 4 文件布局 | `l0_core_application/src/ports/idempotency.rs`、`l0_core_infra/src/idempotency_store/` |
| Step 11 持久化与一致性 | `idempotency_records` / `IdempotencyRepository` |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §13 先写 runtime config 总览,再写配置引用表和外部依赖绑定表。
2. `build_cli_runtime` / `build_job_runtime` 必须作为唯一配置入口。
3. 文件型 state store 的根目录配置必须显式写出默认值。
4. 只写会影响实现绑定的配置,不写完整配置手册。
5. 外部依赖失败策略必须和 Step 11 / 12 / 13 保持一致。
```

建议正式文档 §13 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `13.1 配置与 runtime 总览` | runtime config 入口和配置流向 |
| `13.2 配置引用表` | 配置项、类型、读取模块、默认值、文档位置 |
| `13.3 外部依赖绑定表` | 依赖、绑定位置、使用接口、超时 / 重试、降级策略 |
| `13.4 配置细节边界` | 明确哪些细节留给配置设计文档 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `projection_index_root` 默认目录是否单独成根 | A. 复用 outbox 根; B. 单独 projection 根 | B | projection 是独立读面资产,便于重建和清理 | 已按 B 作为本轮口径 |
| `audit_root` / `idempotency_root` 是否各自独立 | A. 合并到 outbox 根; B. 独立根目录 | B | 审计和幂等都有独立生命周期,适合单独管理 | 已按 B 作为本轮口径 |
| `ReferenceResolverConfig` 是否在本步展开字段 | A. 展开完整字段; B. 只保留入口 | B | 详细字段留给配置设计文档,避免过早绑定 | 已按 B 作为本轮口径 |
| toolchain 配置是否并入 `CoreRuntimeConfig` | A. 并入; B. 保持 adapter-local | B | 当前 P0 只需要绑定点,细节留给 adapter / 配置设计文档 | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 14 完成后必须满足:

- 实现者知道 CLI / job 从哪里读取配置。
- 每个文件型 state store 的根目录已经有默认值。
- `CoreInfraPorts` 的每个关键 adapter 都有明确绑定位置。
- 外部依赖的失败策略已经分清 fail fast、fail closed、replay 和 rerun。
- `build_cli_runtime` / `build_job_runtime` 已被确认为唯一装配入口。
- 配置设计文档需要继续承接的部分已经明确标注。
- 可以进入 Step 15 “定义可观测性与审计埋点契约”。
