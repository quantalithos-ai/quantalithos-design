## Step 10. 异常与边界场景轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 10
- 回填章节：`02-概要设计.md` §10 异常与边界场景轮廓

### 2. 本步输入

- `02_hld_step_08_processing_flows.md`
- `02_hld_step_09_state_machine.md`
- `02_hld_step_06_key_objects.md`
- `02_hld_step_07_api_interface_skeleton.md`
- `00-需求文档.md` 中 SDK 不拥有外部业务 truth、不保存业务正文、三语言一致和验证证据要求
- `01-架构设计.md` 中 formal API、L0-bus、上游契约、fake boundary、redaction 和 credential 边界

### 3. SOP 问题回答

1. 哪些关键异常路径必须在概要设计层先点名？

   回答：必须先点名七类异常：上游契约或 formal API 快照不可用、派生视图 stale / unsupported / unknown、服务能力 fake only / pending / unsupported、runtime service call 或 bus publish 边界失败、candidate 验证失败或证据不足、redaction / credential / fake success 边界失败、compatibility breaking / rejected / pending evidence、deprecated 移除缺少 migration ref。这些异常会影响状态机和主处理流，不能留到详细设计才发现。

2. 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系？

   回答：`GeneratePackageCandidate` 遇到非 `Fresh` 视图时不得生成 verified candidate；runtime client command 失败时不得把外部失败写成 SDK truth；`PublishBusEvent` 失败时不得制造 bus publication truth；unredacted evidence 不得进入可引用证据；fake / fixture 成功不得被标为生产成功；breaking compatibility 不得让 candidate 进入 stable；projection rebuild 只能重建只读视图，不能改写 truth 状态。

3. 哪些失败不能留到详细设计才发现？

   回答：不能后置的失败包括：candidate 使用 stale / unknown 上游引用、fake only 能力被暴露为 supported、skipped evidence 被当作 passed、redacted marker 被当作验证通过、raw secret / payload body 进入 evidence 或 outbound event、breaking change 静默 stable、deprecated API 静默 removed、Query 或 projection rebuild 反向改写真相。

4. 异常与边界场景在概要设计层需要讲到什么程度才足够？

   回答：概要设计只需要说明异常场景、应由哪个主要部分处理、对状态机和处理流的影响、是否阻断 candidate / stable / query / outbound event。错误码、retry 次数、dead-letter 策略、runner exit code、HTTP / RPC mapping、事务隔离和具体补偿实现留给详细设计、测试方案和实施计划。

5. 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节，不应在本步展开？

   回答：不在本步定义完整 error enum、HTTP status、proto status、retry backoff、job checkpoint、artifact layout、report schema、stream reconnect、bus delivery retry、credential provider 细节、repository lock、outbox delivery 和 projection rebuild 算法。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 异常场景被混入 release / wrapper / docs 叙述 | 不清楚异常影响哪个状态机和主要部分 |
| Step 8 处理流 | 已说明主线，但异常路径仍只在关键设计点中点到为止 | 详细设计可能不知道哪些异常必须成为一等分支 |
| Step 9 状态机 | 已定义禁止迁移，但未把触发这些禁止迁移的异常场景分组 | 测试和验收难以抽取负向场景 |
| runtime / bus 边界 | SDK runtime command 失败容易被误写成本地 truth 失败 | 可能破坏服务端和 bus 的真相边界 |
| evidence 边界 | redaction、fake success、skipped evidence 语义容易混淆 | 可能把不合格证据误用于 candidate stable |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 异常组织方式 | 分散在主流程说明里 | 按异常类别、处理部分、状态影响和详细设计承接方向组织 | 让详细设计能抽取错误分支和测试切口 |
| 上游异常 | 只说 refresh / freshness | 明确 unavailable、unsupported、stale、unknown 对 candidate 的阻断 | 防止旧视图生成 verified candidate |
| runtime 异常 | 容易和 SDK 本地写失败混淆 | 明确 runtime call / bus publish 不写 SDK truth | 保护外部 truth 边界 |
| 验证异常 | failed / skipped / redacted 可能混用 | 明确 result、redaction、fake source 的不同影响 | 防止 evidence 被误判为 passed |
| 兼容异常 | breaking / migration 只在流程里出现 | 明确 breaking / rejected / pending evidence 阻断 stable | 支撑后续验收门禁 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：异常全部留给详细设计 | 概要设计更短 | 主线状态机无法判断禁止迁移由什么触发 | 不采用 |
| 方案 B：概要设计写完整错误码和恢复策略 | 看似完整 | 过早进入详细设计，且会和测试方案 / 实施计划重复 | 不采用 |
| 方案 C：概要层只列关键异常场景、处理归属、状态影响和后续承接 | 能支撑详细设计继续展开，又不提前写实现细节 | 需要控制异常表粒度 | 采用 |

### 7. 结构化中间产物

#### 7.1 异常与边界场景总表

| 场景 | 应落在哪个部分处理 | 影响对象 / 状态 | 当前概要口径 | 详细设计承接 |
|---|---|---|---|---|
| 上游 snapshot 或 formal API ref 不可读取 | 上游契约消费与派生视图 | `SnapshotFreshnessState=Unknown / PendingRefresh` | 不生成 verified candidate，不复制上游正文 | 错误类型、重试、source port 失败映射 |
| 上游变化无法派生为 SDK 视图 | 上游契约消费与派生视图 | `SnapshotFreshnessState=Unsupported` | 显式裁剪，不伪装为 fresh | unsupported reason、query view、报告证据 |
| 派生视图 stale | 上游契约消费与派生视图 | `SnapshotFreshnessState=Stale` | 阻止 candidate verified / stable | freshness check job、状态转换错误 |
| 服务能力缺 formal API | 平台能力访问与正式边界适配 | `CapabilitySupportState=Pending / Unsupported` | 不暴露为 supported SDK 能力 | formal API ref 校验和错误映射 |
| 服务能力只能 fake / fixture 验证 | 平台能力访问与正式边界适配 | `CapabilitySupportState=FakeOnly` | 不宣称生产可用，不支撑 stable | fake boundary 标记和测试证据 |
| `InvokeServiceCapability` 外部调用失败 | 平台能力访问与正式边界适配 | 不改写 SDK truth | 返回 boundary result / diagnostic ref，SDK 不拥有服务端事实 | formal API adapter error、trace、redaction |
| `PublishBusEvent` 发布失败 | 事件客户端视图 | 不生成 bus publication truth | 失败归 bus boundary，SDK 不伪造 publication / delivery | bus adapter error、idempotency、trace |
| event mapping 不匹配 bus 语义 | 事件客户端视图 | `BusEventClientView` stale / unsupported | 不允许 publish 或只返回显式不支持 | mapping validation 和错误类型 |
| candidate 使用非 fresh 视图 | package candidate 与验证证据 | `PackageCandidateStatus=NotVerified` 或不创建 candidate | 阻断 verified candidate | candidate factory 前置校验 |
| 三语言 artifact 缺失或不一致 | package candidate 与验证证据 | `PackageCandidateStatus=NotVerified / Failed` | 不允许 stable | package builder result 和语言覆盖校验 |
| 验证运行失败 | package candidate 与验证证据 | `VerificationEvidence=Failed`、candidate failed | 失败证据阻断 candidate | runner result、evidence schema、测试用例 |
| 验证被 skipped | package candidate 与验证证据 | `VerificationEvidence=Skipped` | skipped 不等于 passed | scope 裁剪理由和验收风险 |
| evidence 未脱敏 | 横切默认行为 / 验证证据 | 不允许成为可引用 evidence | 不进入 outbound event 或 report | redaction error、artifact policy |
| fake success 被标为生产成功 | 横切默认行为 / 验证证据 | candidate 不得 verified / stable | `BoundaryGuard` 阻断 | fake marker、boundary guard error |
| credential 明文进入 SDK 状态或证据 | 横切默认行为 | 阻断 command / evidence | 拒绝保存，只允许 credential ref | credential protection error |
| compatibility 证据不足 | 文档、兼容与演进 | `CompatibilityDecision=PendingEvidence` | 阻止 stable | evidence sufficiency rule |
| compatibility breaking / rejected | 文档、兼容与演进 | `CompatibilityDecision=Breaking / Rejected` | 阻止静默 stable | ADR / migration / release gate |
| requires migration 但无 migration ref | 文档、兼容与演进 | 不允许 stable | 必须补 `MigrationGuideRef` | migration gate 规则 |
| deprecated API 静默 removed | 文档、兼容与演进 | 禁止 `Announced -> Removed` | 必须经过 deprecated / pending removal | removal policy 和 migration evidence |
| Query 触发状态变化 | 查询 / projection | 禁止状态迁移 | Query 只读 | handler / service 只读约束 |
| projection rebuild 改写 truth | projection rebuild | 禁止 truth 改写 | 只能从 truth 重建 read model | rebuild job 和 repository 权限 |

#### 异常影响图: L0-sdk 主线异常阻断关系

```text
[Upstream / formal API / bus / runner]
  | failure or unsupported
  v
[Boundary / policy / freshness check]
  | classify
  v
[SDK local state]
  | Stale / Unsupported / FakeOnly / Failed / PendingEvidence / Breaking
  v
[Candidate / compatibility gate]
  | blocks
  v
[No Verified or Stable candidate]

[Runtime call failure]
  | boundary result
  v
[Caller diagnostic]
  | no local truth write
  v
[SDK state unchanged]
```

关键说明：
- 图表达异常如何阻断 candidate verified / stable。
- runtime call 和 bus publish 失败不改写 SDK 本地 truth。
- 图不表达错误码、重试次数、HTTP / RPC 映射或 runner 命令。

#### 7.2 边界场景与禁止事项

| 边界 | 禁止事项 | 正确处理 |
|---|---|---|
| SDK 与服务端 formal API | SDK 不保存服务端业务 truth | 只保存 service capability ref、view、trace 或脱敏 diagnostic ref |
| SDK 与 `L0-bus` | SDK 不实现 publication / delivery runtime | 经 bus boundary publish / subscribe，并保留语义引用 |
| SDK 与上游契约 | SDK 不复制 core / bus / formal API 正文为第二套 truth | 只保存 version ref、snapshot ref、freshness 和派生视图 |
| SDK 与验证证据 | evidence 不保存 raw request / response / payload / secret | 只保存脱敏 evidence 和 artifact ref |
| SDK 与 fake / fixture | fake 成功不能伪装生产成功 | evidence 和 capability support 必须显式标记 fake |
| SDK 与 public release | `Stable` 不等于公共 registry 发布 | release / registry 状态留给后续仓或实施计划 |
| SDK Query | Query 不触发 refresh、candidate、compatibility 或 deprecated 迁移 | 改状态必须走 command、consumer 或 job |

#### 7.3 异常到测试 / 验收切口提示

| 异常类别 | 后续测试切口 | 后续验收关注 |
|---|---|---|
| stale / unsupported freshness | candidate generation negative case | 不得生成 verified / stable candidate |
| fake only capability | boundary guard negative case | 不得宣称生产可用 |
| failed / skipped / unredacted evidence | evidence validation case | failed / skipped / unredacted 不支撑 stable |
| breaking compatibility | compatibility gate case | breaking / rejected 阻断 stable |
| runtime / bus boundary failure | adapter boundary case | 不改写 SDK truth |
| deprecated silent removal | deprecated lifecycle negative case | removed 前必须存在 migration / pending removal |

### 8. 回填草稿

本步回填 `02-概要设计.md` §10 时建议使用以下结构：

```text
## 10. 异常与边界场景轮廓
### 10.1 异常与边界场景总表
### 10.2 异常影响图
### 10.3 边界场景与禁止事项
### 10.4 后续测试与验收切口提示
```

回填时可引用本文件 `7.1` ~ `7.3` 的结构化中间产物，不需要重复保留 SOP 问题回答、问题诊断和设计取舍。

### 9. 待确认事项

- runtime service call 和 bus publish 的具体错误码、retry、idempotency 和 trace 格式留给 03 详细设计，不在概要设计收口。
- public registry 发布和 release rollback 不属于 L0-sdk P0 状态机；如后续需要，应由发布相关仓或实施计划承接。
- 是否需要单独的 `EvidenceRedactionStatus` enum，由 03 详细设计结合 Rust 类型拆分；概要设计只要求 redaction 不替代验证结果。

### 10. 进入下一步条件

- [x] 已点名关键异常路径和边界场景。
- [x] 已说明异常影响哪些主要部分、对象、处理流和状态机。
- [x] 已明确 runtime / bus boundary failure 不改写 SDK 本地 truth。
- [x] 已明确 failed / skipped / unredacted / fake evidence 不支撑 stable。
- [x] 未展开错误码、retry、补偿、runner 命令或完整恢复实现。
