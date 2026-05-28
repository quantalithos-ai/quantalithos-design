# Step 16. 定义测试切口与最小验证清单

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 16 中间产物。
> 本步只收稳最小测试切口,不写完整测试方案,不写测试环境部署,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
- 回填章节: `projects/L0-core/03-详细设计.md` §15 测试切口与最小验证清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 模块实现契约主轴 | 模块边界、暴露内容、依赖方向 | 固定测试切口按模块归位 |
| Step 8 协议契约 | Command / Query / Event / Job DTO 和错误映射 | 固定接口测试切口 |
| Step 9 函数级处理流 | 每个 flow 的入口、事务边界、副作用和错误映射 | 固定每个关键处理流的验证路径 |
| Step 10 状态机与转换矩阵 | 状态 enum、合法转换和非法转换 | 固定状态机测试切口 |
| Step 11 持久化、事务与一致性 | UoW、repository、outbox、projection、snapshot | 固定事务、一致性和持久化切口 |
| Step 12 错误模型 | `Conflict`、`PreconditionFailed`、`Port` 等错误映射 | 固定异常测试切口 |
| Step 13 并发、幂等与重入保护 | 幂等、expected version、replay、重入 | 固定重复请求和并发冲突测试切口 |

已确认结论:

```text
每个关键模块、协议、状态机和幂等分支都必须拥有最小验证入口。
测试切口不是完整测试方案,而是“足以让测试方案继续展开”的最小集合。
P0 以 crate / module 边界测试为主,不强求完整系统级回归。
```

---

## 3. 本步写作策略

本步按“模块 -> 协议 -> 状态机 -> 一致性 / 幂等 -> 回填草稿”展开:

```text
先给模块最小验证入口 -> 再给接口正负向切口 -> 再给状态机合法 / 非法转换 -> 最后给并发与幂等验证
```

写作约束:

- 每个测试切口都必须能回指 Step 5 / 8 / 9 / 10 / 11 / 12 / 13 中至少一个契约。
- 每个关键 Command / Job 至少一个正向测试切口和一个异常测试切口。
- 每个关键 Query 至少一个命中切口和一个空结果 / 失效切口。
- 状态机测试必须同时覆盖合法转换和非法转换。
- 本步不写测试代码,只写最小验证清单和建议测试类型。
- 不把测试方案中的覆盖率目标、排期、环境矩阵写进本步。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 16.1 | [x] | 模块测试切口汇总 |
| 16.2 | [x] | 接口测试切口汇总 |
| 16.3 | [x] | 状态机测试切口表 |
| 16.4 | [x] | 一致性 / 幂等测试切口表 |
| 16.5 | [x] | 回填草稿 |

---

## 5. SOP 问题回答

### 5.1 每个模块至少需要哪些单元测试？

| 模块 | 最小测试切口 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contract_source_assets` | source tree 解析与 package ref 生成 | 目录结构、缺失文件、引用路径错误 | 单元测试 / 临时文件系统测试 |
| `release_snapshot_assets` | snapshot tree 读写与不可变引用 | 快照路径、只读引用、派生结果完整性 | 单元测试 / 临时文件系统测试 |
| `contracts` | DTO 序列化、反序列化、字段约束 | command / query / event / job schema 和版本标签 | 单元测试 / roundtrip 测试 |
| `domain_definition` | 草稿创建、编辑、提交、发布、弃用、退役、替代 | 生命周期不变量、版本推进、演进记录 | 纯单元测试 |
| `domain_packages` | package 生命周期和引用校验 | 包内引用是否完整、是否允许发布 | 纯单元测试 |
| `domain_release` | baseline / compatibility 状态迁移 | gate 通过、兼容判定、发布锚点 | 纯单元测试 |
| `domain_snapshot` | snapshot ready / archived 迁移 | 快照与 baseline / fingerprint 的绑定 | 纯单元测试 |
| `domain_reference_projection` | resolve / invalidate / stale / rebuild | 引用有效性、读面状态、追溯索引 | 单元测试 / 投影测试 |
| `domain_fact` | fact delivery 状态迁移 | 事实输出是否可追踪、是否能重放 | 纯单元测试 |
| `domain_policies` | scope / boundary / fingerprint / reference 规则 | 纯函数决策是否稳定 | 纯单元测试 |
| `application_services` | command / query / job 编排 | port 调用顺序、事务边界、错误映射 | 应用层测试 / 依赖替身测试 |
| `application_ports` + `infra_adapters` | repository / audit / outbox / idempotency / toolchain 绑定 | 端口实现是否符合契约、失败是否可注入 | 适配器测试 / 临时文件系统测试 |
| `cli_entry` | 命令解析、metadata 传递、退出码映射 | CLI 参数、actor / request metadata、错误码 | CLI 集成测试 |
| `jobs` | job 输入、重跑、失败传播、relay loop | job run id、重复执行、outbox relay | job 集成测试 |

### 5.2 每个接口至少需要哪些正向和异常测试？

| 接口 | 正向切口 | 异常切口 | 建议测试类型 |
|---|---|---|---|
| `CreateContractDraft` | 有效草稿创建并返回 receipt | idem key 重复且 payload 不同 / 缺少必填字段 | 应用层测试 |
| `UpdateContractDraft` | 在正确 version 下更新草稿 | stale version / 无效引用 / 重复 key 冲突 | 应用层测试 |
| `SubmitContractForReview` | 草稿满足门槛并进入 `InReview` | 草稿不完整 / 非法状态迁移 | 应用层测试 |
| `PublishContractBaseline` | gate 通过且生成发布基线 | gate fail / fingerprint 不匹配 / 基线冲突 | 应用层测试 |
| `UpdateContractLifecycle` | 合法弃用、退役或替代 | 终态继续迁移 / 缺少 reason / 旧 version | 应用层测试 |
| `GetContractDefinition` | 按 id 返回当前 definition | not found / stale view 标记 | 查询测试 |
| `ListContractDefinitions` | 返回符合条件的定义列表 | 空结果 / 过滤条件不命中 | 查询测试 |
| `GetContractReleaseBaseline` | 返回已发布 baseline | baseline 不存在 / 尚未发布 | 查询测试 |
| `GetContractReleaseSnapshot` | 返回 ready snapshot | snapshot 仍在 building / 已失效 | 查询测试 |
| `TraceContractEvolution` | 返回完整演进轨迹 | definition 不存在 / 轨迹缺口 | 查询测试 |
| `GetCompatibilityTrace` | 返回兼容追溯和结论 | trace 不存在 / 索引 stale | 查询测试 |
| `GetContractPackage` | 返回 package 及其引用 | package 不存在 / package 处于不可用状态 | 查询测试 |
| `GetContractGuideSample` | 返回可用示例 | 示例未生成 / 包上下文不完整 | 查询测试 |
| `ContractDraftChanged` | 正确封装事件 payload 和 CloudEvent 元数据 | 缺少必要 ref / 重复发布同一 event id | 事件序列化测试 |
| `ContractReviewSubmitted` | 提交事件与草稿状态一致 | 未进入 review 就发布事件 | 事件序列化测试 |
| `ContractBaselinePublished` | 事件携带 gate_ref 和 fingerprint | baseline 未提交就发事件 / payload 不完整 | 事件序列化测试 |
| `ContractLifecycleChanged` | 生命周期变化后发布事件 | 非法状态迁移不应发事件 | 事件序列化测试 |
| `ContractCompatibilityStatusChanged` | 兼容性结论和 trace 一致 | 缺少 trace / reason / status | 事件序列化测试 |
| `ContractSnapshotReady` | snapshot ready 事件与派生结果一致 | snapshot 未 ready / 重复发布同一 snapshot | 事件序列化测试 |
| `ContractFactPublished` | 事实发布事件与 fact record 一致 | relay 重放时不产生新 truth | 事件序列化测试 |
| `ValidateContractChangeJob` | 校验通过并返回结果 | toolchain fail / reference 无效 / gate fail | job 测试 |
| `DeriveReleaseSnapshotJob` | 成功生成 snapshot | snapshot path 缺失 / fingerprint 冲突 | job 测试 |
| `RebuildContractIndexJob` | 成功重建并推进 watermark | watermark 倒退 / 重复 rebuild id | job 测试 |
| `RecalculateFingerprintJob` | fingerprint 与 source 一致 | source 缺失 / 计算失败 | job 测试 |
| `PublishContractFactJob` | 正确发布 fact 并记录 receipt | outbox 写失败 / fact 冲突 | job 测试 |
| `OutboxRelayWorker` | 单条 pending 事件只发布一次 | publish 失败后保持 pending / 重试仍用同一 event id | worker 测试 |

### 5.3 状态机合法转换和非法转换如何测试？

| 状态机 | 正向切口 | 非法切口 | 验证内容 |
|---|---|---|---|
| `ContractLifecycleState` | `Draft -> InReview -> Published` | `Published -> Draft` | 生命周期主线与终态保护 |
| `CompatibilityValue` | `Pending -> Compatible` / `Pending -> Incompatible` | `Compatible -> Pending` 绕过 reset | 兼容结论不可随意倒退 |
| `ContractReleaseBaselineStatus` | `Prepared -> Released` | `Released -> Prepared` | 发布锚点不可回退 |
| `ContractReleaseSnapshotStatus` | `Building -> Ready` | `Ready -> Building` 直接回写 | 快照派生单向收口 |
| `FactDeliveryStatus` | `Pending -> Published` | `Published -> Pending` | 事实发布后不可伪装回退 |
| `DownstreamConsumptionStatus` | `Pending -> Stale` / `Pending -> Retired` | `Retired -> Pending` | 下游消费引用终态保护 |
| `ReferenceState` | `Pending -> Resolved` / `Pending -> Stale` | `Invalidated -> Pending` | 引用失效不可直接恢复 |
| `IndexState` | `Rebuilding -> Active` | `Active -> Rebuilding` 绕过 job | 索引重建须经过受控路径 |
| `TraceIndexState` | `Rebuilding -> Active` | `Stale -> Active` 绕过 rebuild | 追溯索引必须可追踪 |
| `ReadModelState` | `Active -> Stale` | `Stale -> Active` 绕过 refresh | 只读模型必须经由刷新 |
| `ProjectionState` | `Active -> Stale` | `Stale -> Active` 绕过 rebuild | 投影必须经由重建 |
| `ContractPackageLifecycleState` | `Draft -> Published -> Deprecated` | `Retired -> Published` | 包管理扩展的终态保护 |

### 5.4 事务、一致性、幂等和并发如何验证？

| 场景 | 最小切口 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| 同一 command 重复提交 | `IdempotencyRepository.reserve(...)` | 同 payload 返回既有 receipt | 幂等测试 |
| 同一 command 不同 payload 复用同一 key | `IdempotencyRepository.reserve(...)` | 返回 `Conflict` | 幂等测试 |
| 两个写请求并发修改同一 definition | `save(expected_version)` | 后写请求冲突并保留前写结果 | 并发测试 |
| outbox relay 重复发布 | `OutboxRelayWorker` + CloudEvent `id` | 重复投递不产生新 truth | 幂等测试 / relay 测试 |
| snapshot derive 重跑 | `DeriveReleaseSnapshotJob` | 相同 job / fingerprint 不产生重复快照 | 重跑测试 |
| projection rebuild 并发 | `RebuildContractIndexJob` + watermark | watermark 不倒退,旧 rebuild 不能覆盖新结果 | 并发测试 |
| audit / truth 同事务提交 | `UnitOfWork` + audit store | 成功时 truth 和审计同时提交,失败时同时回滚 | 事务测试 |
| toolchain 失败 | validation / fingerprint / snapshot runner | 失败只影响 job 结果,不改写 truth | 失败恢复测试 |

### 5.5 哪些测试细节应留给测试方案？

| 项目 | 当前处理方式 | 后续文档 |
|---|---|---|
| 覆盖率目标 | 不在本步定义 | 测试方案 |
| 测试执行顺序 | 不在本步定义 | 测试方案 |
| 环境矩阵 | 不在本步定义 | 测试方案 |
| fixture / seed 管理 | 只定义最小输入条件 | 测试方案 |
| 端到端回归排期 | 不在本步定义 | 测试方案 |
| 性能 / 压测门槛 | 不在本步定义 | 测试方案或运维手册 |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| 测试切口散落在 Step 11 / 12 / 13 | 实现者知道规则,但不知道最小验证入口放在哪 | 本步统一收口为模块 / 接口 / 状态机 / 幂等四类切口 |
| 只写“要测”不写“测什么” | 测试方案难以反推最小用例 | 本步把每个关键契约都映射成正向和异常切口 |
| 状态机与并发 / 幂等混在一起 | 实现者会把重试、冲突、非法迁移混为一谈 | 本步分别列出状态机测试和一致性 / 幂等测试 |
| 测试方案和详细设计边界容易混 | 详细设计可能膨胀成完整测试计划 | 本步只给最小切口,把覆盖率和排期留给测试方案 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 模块测试 | 只知道模块存在 | 每个模块都有最小验证入口 |
| 接口测试 | 只有协议清单 | 每个关键接口都有正向和异常切口 |
| 状态机测试 | 只列状态图 | 同时列合法转换和非法转换 |
| 幂等测试 | 只在前文分散描述 | 集中成独立一致性 / 幂等切口表 |
| 测试边界 | 容易和测试方案混写 | 明确只写最小验证清单，不替代测试方案 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否只写模块级测试 | 只写模块测试 | 模块 + 接口 + 状态机 + 一致性 / 幂等 | B | 详细设计需要足以支撑实现者和测试方案继续展开 |
| 是否把完整测试计划写进详细设计 | 写入 | 不写入,只写最小切口 | B | 完整测试计划属于测试方案,不能吞掉详细设计边界 |
| 是否只列正向测试 | 只列正向 | 正向 + 异常一起列 | B | 异常路径是实现契约的一部分,不能留空 |
| 是否把 query 也当成写路径测试 | 是 | 否,只测读取命中 / 缺失 / stale | B | query 不改写真相,测试重点应放在可用性和视图边界 |

---

## 9. 结构化中间产物

### 9.1 测试切口层级图

```text
[模块测试]
   |
   +--> [接口测试]
   |        |
   |        +--> [状态机测试]
   |        |
   |        +--> [一致性 / 幂等测试]
   |
   +--> [测试方案]
```

关键说明:

- 模块测试回答“代码主体骨架是否能单独工作”。
- 接口测试回答“协议是否能被正确调用和拒绝”。
- 状态机测试回答“允许和禁止的迁移是否一致”。
- 一致性 / 幂等测试回答“重复、并发、回重放时会发生什么”。

### 9.2 模块测试切口汇总表

| 测试切口 | 覆盖对象 / 函数 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| source tree 解析 | `contract_source_assets` | 目录和引用是否可解析 | 文件系统单测 |
| snapshot tree 读写 | `release_snapshot_assets` | 快照是否只读、写入是否完整 | 文件系统单测 |
| DTO roundtrip | `contracts` | schema / 版本 / 字段约束 | 序列化单测 |
| lifecycle transitions | `domain_definition` | 草稿 / 审核 / 发布 / 退役 / 替代 | 单元测试 |
| package lifecycle | `domain_packages` | 包引用是否完整 | 单元测试 |
| release gating | `domain_release` | compat / baseline / gate 规则 | 单元测试 |
| snapshot readiness | `domain_snapshot` | baseline 绑定和 fingerprint | 单元测试 |
| read-side projection | `domain_reference_projection` | resolve / stale / rebuild 语义 | 投影测试 |
| fact delivery | `domain_fact` | 事实状态转换 | 单元测试 |
| pure policies | `domain_policies` | boundary / fingerprint / reference rule | 单元测试 |
| application orchestration | `application_services` | 事务、port 调用和错误映射 | 应用层测试 |
| adapter wiring | `application_ports` / `infra_adapters` | port 实现和失败注入 | 适配器测试 |
| CLI bridge | `cli_entry` | 命令解析和退出码 | CLI 测试 |
| job entry | `jobs` | job 输入、重跑和 relay | job 测试 |

### 9.3 接口测试切口汇总表

| 接口 | 正向切口 | 异常切口 | 建议测试类型 |
|---|---|---|---|
| `CreateContractDraft` | 生成草稿和 receipt | idem key 冲突 / 字段缺失 | 应用层测试 |
| `UpdateContractDraft` | 正确 version 更新 | stale version / 引用错误 | 应用层测试 |
| `SubmitContractForReview` | 进入 review | 非法状态 / 内容不完整 | 应用层测试 |
| `PublishContractBaseline` | 生成 baseline | gate fail / fingerprint mismatch | 应用层测试 |
| `UpdateContractLifecycle` | 合法生命周期迁移 | 终态继续迁移 | 应用层测试 |
| `GetContractDefinition` | 命中 definition | not found / stale | 查询测试 |
| `ListContractDefinitions` | 返回列表 | 空结果 | 查询测试 |
| `GetContractReleaseBaseline` | 返回 baseline | 未发布 | 查询测试 |
| `GetContractReleaseSnapshot` | 返回 snapshot | building / invalid | 查询测试 |
| `TraceContractEvolution` | 返回完整演进 | trace 缺口 | 查询测试 |
| `GetCompatibilityTrace` | 返回兼容追溯 | trace stale | 查询测试 |
| `GetContractPackage` | 返回 package | 不存在 / 不可用 | 查询测试 |
| `GetContractGuideSample` | 返回示例 | 示例不可用 | 查询测试 |
| `ContractDraftChanged` | 正确封装事件 | 必要字段缺失 / 重复发布 | 事件测试 |
| `ContractReviewSubmitted` | review 事件正确 | 状态不一致 | 事件测试 |
| `ContractBaselinePublished` | baseline 事件正确 | gate_ref 缺失 | 事件测试 |
| `ContractLifecycleChanged` | 生命周期事件正确 | 非法迁移不发 | 事件测试 |
| `ContractCompatibilityStatusChanged` | 兼容性事件正确 | trace / reason 缺失 | 事件测试 |
| `ContractSnapshotReady` | snapshot 事件正确 | 重复 snapshot | 事件测试 |
| `ContractFactPublished` | fact 发布事件正确 | relay 重放不应新建 truth | 事件测试 |
| `ValidateContractChangeJob` | 校验通过 | 工具链 / 引用失败 | job 测试 |
| `DeriveReleaseSnapshotJob` | 生成 snapshot | fingerprint 冲突 | job 测试 |
| `RebuildContractIndexJob` | 重建索引 | watermark 倒退 | job 测试 |
| `RecalculateFingerprintJob` | 指纹复算通过 | source 缺失 | job 测试 |
| `PublishContractFactJob` | 发布 fact | outbox 失败 | job 测试 |
| `OutboxRelayWorker` | 精确一次发布 | publish 失败后保持 pending | worker 测试 |

### 9.4 状态机测试切口表

| 状态机 | 正向转换 | 非法转换 | 验证内容 |
|---|---|---|---|
| `ContractLifecycleState` | `Draft -> InReview -> Published` | `Published -> Draft` | 主线 truth 生命周期 |
| `CompatibilityValue` | `Pending -> Compatible` | `Compatible -> Pending` 绕过 reset | 兼容结论不可随意倒退 |
| `ContractReleaseBaselineStatus` | `Prepared -> Released` | `Released -> Prepared` | 发布锚点不可回退 |
| `ContractReleaseSnapshotStatus` | `Building -> Ready` | `Ready -> Building` | 快照派生单向收口 |
| `FactDeliveryStatus` | `Pending -> Published` | `Published -> Pending` | 事实发布后不可伪装回退 |
| `DownstreamConsumptionStatus` | `Pending -> Stale` / `Pending -> Retired` | `Retired -> Pending` | 下游引用终态保护 |
| `ReferenceState` | `Pending -> Resolved` / `Pending -> Stale` | `Invalidated -> Pending` | 引用失效不可直接恢复 |
| `IndexState` | `Rebuilding -> Active` | `Active -> Rebuilding` 绕过 job | 索引重建须经过受控路径 |
| `TraceIndexState` | `Rebuilding -> Active` | `Stale -> Active` 绕过 rebuild | 追溯索引必须可追踪 |
| `ReadModelState` | `Active -> Stale` | `Stale -> Active` 绕过 refresh | 只读模型必须经由刷新 |
| `ProjectionState` | `Active -> Stale` | `Stale -> Active` 绕过 rebuild | 投影必须经由重建 |
| `ContractPackageLifecycleState` | `Draft -> Published -> Deprecated` | `Retired -> Published` | 包管理扩展的终态保护 |

### 9.5 一致性 / 幂等测试切口表

| 场景 | 最小切口 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| 重复 command 同 key 同 payload | `IdempotencyRepository.reserve(...)` | 返回既有 receipt | 幂等测试 |
| 重复 command 同 key 不同 payload | `IdempotencyRepository.reserve(...)` | 返回 `Conflict` | 幂等测试 |
| 两个写请求并发修改同一 definition | `save(expected_version)` | 后写请求冲突 | 并发测试 |
| outbox relay 重复发布 | `OutboxRelayWorker` + CloudEvent `id` | 重复投递不产生新 truth | 幂等测试 |
| snapshot derive 重跑 | `DeriveReleaseSnapshotJob` | 相同 job / fingerprint 不产生重复快照 | 重跑测试 |
| projection rebuild 并发 | `RebuildContractIndexJob` + watermark | watermark 不倒退 | 并发测试 |
| audit / truth 同事务提交 | `UnitOfWork` + audit store | 成功同时提交,失败同时回滚 | 事务测试 |
| toolchain 失败 | validation / fingerprint / snapshot runner | 失败只影响 job 结果,不改写 truth | 失败恢复测试 |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §15 先写模块测试切口汇总表,再写接口测试切口汇总表、状态机测试切口表和一致性 / 幂等测试切口表。
2. 每个测试切口必须能回指前文具体契约,不能只写“应测试”。
3. 每个关键 Command / Job 至少写一个正向切口和一个异常切口。
4. 不把测试方案的覆盖率目标、执行顺序和环境矩阵写进详细设计。
```

建议正式文档 §15 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `15.1 模块测试切口汇总` | 模块、覆盖对象、验证内容、建议测试类型 |
| `15.2 接口测试切口汇总` | Command / Query / Event / Job 的正负向切口 |
| `15.3 状态机测试切口表` | 合法转换、非法转换和验证内容 |
| `15.4 一致性 / 幂等测试切口表` | 重复请求、并发、重跑、relay 和事务验证 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否只写模块测试切口 | A. 只写模块; B. 模块 + 接口 + 状态机 + 幂等 | B | 详细设计需要直接支撑实现者和测试方案 | 已按 B 作为本轮口径 |
| 是否把完整测试方案写进详细设计 | A. 写入; B. 只写最小验证切口 | B | 完整方案属于测试方案 | 已按 B 作为本轮口径 |
| 是否只列正向测试 | A. 只列正向; B. 正向 + 异常一起列 | B | 异常路径也是实现契约的一部分 | 已按 B 作为本轮口径 |
| 是否把 query 当成写路径测试 | A. 是; B. 否,只测读取命中 / 缺失 / stale | B | query 不改写真相,测试重点应放在可用性和视图边界 | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 16 完成后必须满足:

- 实现者知道每个模块和每个协议至少应如何做最小验证。
- 状态机的合法转换和非法转换已经分别给出测试切口。
- 幂等、并发、重跑和事务边界已经有最小验证入口。
- 测试方案可以在本文件基础上继续展开,而不是从零发明切口。
- 可以进入 Step 17 “收口详细设计到实施计划的承接清单”。
