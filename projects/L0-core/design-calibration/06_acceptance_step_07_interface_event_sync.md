# Step 7. 定义接口、事件与跨仓同步验收

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-core/06-验收标准.md` §7

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `03-详细设计.md` §7 | Command API、Query API、Outbound Event、Operations Job、错误映射 | 定义接口、事件和 job 的验收对象 |
| `03-详细设计.md` §8 | 写路径、查询路径、job / relay 处理流 | 定义每类入口的主线结果和失败边界 |
| `05-测试方案.md` §5 / §6 | TC-DTO、TC-CMD、TC-QUERY、TC-EVENT、TC-OUTBOX、TC-JOB、TC-E2E | 绑定接口、事件和 job 的测试证据 |
| `05-测试方案.md` §8 / §10 / §13 | 下游只验接缝、outbox / CloudEvent / relay boundary、EV 证据 | 定义跨仓同步和下游未就绪口径 |
| Step 2 验收范围 | L0-bus、L0-sdk、L1+ 只验接缝,不验完整实现 | 防止验收越界到相邻仓 |
| Step 6 架构红线 | 下游不得反写真相、相邻仓职责不进入本仓 | 约束接口与跨仓同步验收不能打穿数据边界 |

依赖的前序 Step：Step 1~6 已确认。

## 3. SOP 问题回答

1. 每个 P0 Command / Query 如何验收?

   回答：P0 Command 验收关注入口契约、返回 receipt、错误映射、审计 / outbox 副作用和失败不伪成功。`CreateContractDraft`、`UpdateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle` 必须均有对应 P0 用例和 EV 证据。P0 Query 验收关注只读语义、current / stale / not found 口径和不得写 audit / outbox。`GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`TraceContractEvolution`、`GetCompatibilityTrace`、`GetContractPackage`、`GetContractGuideSample` 必须至少覆盖当前 05 已有的 P0 查询切口。

2. 每个 P0 Event 如何证明可消费 / 可重放?

   回答：Event 不验真实 L0-bus 投递,只验 CloudEvent 结构、outbox 持久化、event id 稳定、pending / failed 可恢复、traceparent 和 actor 字段完整。`ContractBaselinePublished` 等 P0 事件必须能被 outbox relay boundary 读取,失败时保留 pending / failed 状态,重放不产生新 truth。

3. 每个 P0 Job 如何证明幂等和恢复?

   回答：`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob`、`OutboxRelayWorker` 必须通过 job input DTO、receipt、状态、副作用、失败证据和重跑行为证明。幂等细节在 Step 8 进一步裁决;本步只验 job 入口 / 输出 / 恢复边界是否可被下游和运维使用。

4. 跨仓同步成功标准是什么?

   回答：本轮跨仓同步成功不等于真实下游全部消费成功,而是 L0-core 对外输出的同步接缝成立:发布快照可读取、CloudEvent / outbox 可被 relay boundary 读取、package / guide sample view 可供 SDK 或下游消费、trace / evidence 可定位。真实 L0-bus runtime、L0-sdk 高层封装和 L1 业务联调不作为本步 P0 成功条件。

5. 下游未就绪时如何验接缝?

   回答：下游未就绪时使用 fake / real-like adapter、outbox relay boundary suite、schema contract suite、package view / sample view fixture 和 E2E minimal loop 验接缝。只要本仓输出的契约、快照、事件、引用和证据可定位且不要求真实下游完成,即可作为 P0 接缝成立;若本仓强依赖真实下游或将下游未就绪伪装为已同步成功,则不通过。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §4 / §7 | 仍以 bus/sdk consume base 验收旧 primitive | 没有覆盖新版 Command / Query / Event / Job 接口族 |
| `06-验收标准.md` 全文 | 未说明 CloudEvent / outbox 只验边界,不验 L0-bus runtime | 容易把 L0-bus 的投递、确认、重试、死信误算作 L0-core P0 |
| `06-验收标准.md` 全文 | 未说明下游未就绪时如何验接缝 | 可能阻塞 L0-core 独立验收 |
| `06-验收标准.md` 全文 | 未引用 TC-DTO、TC-CMD、TC-QUERY、TC-EVENT、TC-OUTBOX、TC-JOB、TC-E2E 证据 | 接口和跨仓同步裁决不可追溯 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口对象 | RegisterSharedRef / primitive registry | Command / Query / Event / Job 四类正式接口 | 对齐详细设计 §7 |
| 事件验收 | bus consume base compare | CloudEvent 结构 + outbox boundary + relay recovery | 守住 L0-core / L0-bus 边界 |
| 下游同步 | bus/sdk consume 成功 | 发布快照、schema、package view、outbox 接缝可消费 | 不要求相邻仓完整实现 |
| 下游未就绪 | 未说明 | 使用 fake / real-like adapter 和 boundary suite 验接缝 | 支撑独立验收 |
| 证据引用 | 泛化 trace / compare | 明确 TC / EV | 支撑可审计裁决 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 要求真实 L0-bus、L0-sdk、L1 全部联调成功 | 平台信心强 | 越过 L0-core 仓边界,阻塞独立验收 | 不采用 |
| B. 只验本地 Command / Query,不验事件和下游接缝 | 简单 | 无法证明共享契约来源能被下游感知和消费 | 不采用 |
| C. 验本仓接口、CloudEvent / outbox boundary、job 和最小消费接缝 | 边界清楚,证据可定位,不依赖真实下游 | 真实联调风险需进入 Step 13 | 采用 |
| D. 将 job 幂等和事务全部放在本步 | 表面完整 | 会和 Step 8 状态 / 事务 / 一致性重复 | 不采用 |

## 7. 结构化中间产物

### 7.1 接口、事件与跨仓同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-SYNC-001 | Command API 入口族 | 5 个 P0 Command 均可按 DTO 调用;返回对应 receipt;错误映射稳定;成功路径产生必要 audit / outbox | 任一 P0 Command 无法调用、返回不符合 receipt、错误码漂移、失败伪成功或缺少证据 | `TC-CMD-001`~`TC-CMD-006`;EV-SVC-001、EV-UNIT-001、EV-AUDIT-001 |
| AC-SYNC-002 | Query API 入口族 | P0 Query 只读;支持 current / stale / not found 口径;package view 和 guide sample 可读且不含禁止正文 | Query 写入 truth / audit / outbox;stale 被当作 current;sample 返回禁止正文;EV 缺失 | `TC-QUERY-001`、`TC-QUERY-002`、`TC-QUERY-003`、`TC-QUERY-007`、`TC-QUERY-008`;EV-SVC-001、EV-TRACE-001、EV-SEC-001 |
| AC-SYNC-003 | DTO / schema contract | Command / Query / Event / Job DTO roundtrip 成立;schema version 和 required fields 稳定 | DTO 字段丢失、required 字段漂移、schema version 不可判定或 roundtrip 失败 | `TC-DTO-001`;EV-CONTRACT-001 |
| AC-SYNC-004 | Outbound Event / CloudEvent | P0 event 满足 `specversion`、`source`、`subject`、`datacontenttype`、`traceparent`、actor 字段约束 | CloudEvent 字段缺失、traceparent 缺失、actor 缺失、事件 type/source 漂移 | `TC-EVENT-001`;EV-CONTRACT-002、EV-TRACE-001 |
| AC-SYNC-005 | Outbox / relay boundary | command / job 成功事实进入 outbox;relay 可读取 pending;publish fail 后 pending / failed 可恢复;event id 稳定 | outbox 缺失、relay 失败丢事件、重放产生新 truth、event id 不稳定 | `TC-OUTBOX-001`、`TC-OUTBOX-002`;EV-CONTRACT-002、EV-INT-001 |
| AC-SYNC-006 | Operations Job 入口族 | 5 个 P0 job 和 relay worker 均有输入 DTO、输出 receipt、失败状态和可定位证据 | job input / receipt 缺失、失败无证据、source missing 伪成功、worker 单条失败终止整批 | `TC-JOB-001`~`TC-JOB-005`、`TC-OUTBOX-002`;EV-WORKER-001、EV-CONTRACT-002 |
| AC-SYNC-007 | 下游消费接缝 | release snapshot、package view、guide sample、CloudEvent / outbox boundary 可被 fake / real-like 下游读取 | 本仓要求真实下游完成才算成功;发布快照不可读;package / sample view 缺失;outbox 不可消费 | `TC-JOB-002`、`TC-QUERY-007`、`TC-QUERY-008`、`TC-E2E-001`;EV-WORKER-001、EV-SVC-001、EV-E2E-001 |
| AC-SYNC-008 | 下游未就绪处理 | 真实 L0-bus / L0-sdk / L1 未就绪时,本仓仍能通过 boundary suite 证明输出接缝;风险进入 Step 13 | 本仓把下游未就绪伪装为真实同步成功,或强依赖真实下游导致 P0 不能验 | EV-CONTRACT-001、EV-CONTRACT-002、EV-E2E-001、EV-NIGHTLY-001 |

### 7.2 下游接缝裁决表

| 下游对象 | 本轮验收内容 | 本轮不验内容 | 失败口径 |
|---|---|---|---|
| L0-bus | CloudEvent payload、outbox append、relay boundary、pending / failed 可恢复 | publish / subscribe / ack / retry / dead-letter runtime | L0-core 无法产出可消费事件则不通过;真实 bus 未接入进入风险 |
| L0-sdk | DTO / schema 稳定、package view、guide sample 最小消费入口 | SDK 高层客户端、认证封装、重试、developer experience | schema / view 不稳定则不通过;SDK 高层缺失进入风险 |
| L1+ 仓 | 共享契约基线、只读发布快照、禁止业务正文入仓 | L1 业务聚合、业务状态机、真实业务联调 | L0-core 吸收业务语义则不通过;真实联调未做进入风险 |
| L4-observability / archive | trace context、audit / event 字段、禁止正文边界 | 观测存储、归档包、面板和恢复流程 | trace / audit 字段缺失则不通过;真实系统未接入进入风险 |

### 7.3 接口失败对最终结论的影响

| 情况 | 结论影响 |
|---|---|
| AC-SYNC-001~AC-SYNC-007 任一失败 | 不通过 |
| AC-SYNC-008 中真实下游未就绪,但 boundary suite 通过且风险被接受 | 有条件通过 |
| CloudEvent / DTO 字段漂移且未更新基线 | 不通过 |
| outbox 丢事件或 relay 失败伪成功 | 一票否决候选 |
| 本仓要求真实下游完成才允许 P0 验收 | 不通过,因为违反仓边界 |

## 8. 回填草稿

```md
## 7. 接口、事件与跨仓同步验收

> 校准来源：
> - `design-calibration/06_acceptance_step_07_interface_event_sync.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“接口、事件与跨仓同步验收表”“下游接缝裁决表”和“接口失败对最终结论的影响”小节,了解接口与跨仓接缝如何从详细设计协议和 05 的 TC / EV 证据收敛。

| 验收项 ID | 接口 / 事件 / 下游 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-SYNC-001 | Command API 入口族 | 5 个 P0 Command 均可调用,返回 receipt,错误映射稳定,成功路径产生必要 audit / outbox | 任一 P0 Command 不可调用、receipt 不符、错误码漂移、失败伪成功或 EV 缺失 | `TC-CMD-001`~`TC-CMD-006`;EV-SVC-001、EV-UNIT-001、EV-AUDIT-001 |
| AC-SYNC-002 | Query API 入口族 | P0 Query 只读,current / stale / not found 口径明确,package view 和 guide sample 可读 | Query 写入副作用、stale 被当作 current、sample 返回禁止正文或 EV 缺失 | `TC-QUERY-001`、`TC-QUERY-002`、`TC-QUERY-003`、`TC-QUERY-007`、`TC-QUERY-008`;EV-SVC-001、EV-TRACE-001、EV-SEC-001 |
| AC-SYNC-003 | DTO / schema contract | DTO roundtrip 成立,schema version 和 required fields 稳定 | DTO 字段丢失、required 字段漂移、schema version 不可判定 | `TC-DTO-001`;EV-CONTRACT-001 |
| AC-SYNC-004 | Outbound Event / CloudEvent | CloudEvent 基础字段、traceparent 和 actor 字段完整 | CloudEvent 字段缺失、traceparent 缺失、event type/source 漂移 | `TC-EVENT-001`;EV-CONTRACT-002、EV-TRACE-001 |
| AC-SYNC-005 | Outbox / relay boundary | 成功事实进入 outbox,relay 可读取 pending,publish fail 后可恢复,event id 稳定 | outbox 缺失、relay 失败丢事件、重放产生新 truth | `TC-OUTBOX-001`、`TC-OUTBOX-002`;EV-CONTRACT-002、EV-INT-001 |
| AC-SYNC-006 | Operations Job 入口族 | P0 job 和 relay worker 均有输入 DTO、输出 receipt、失败状态和证据 | job input / receipt 缺失、失败无证据、source missing 伪成功 | `TC-JOB-001`~`TC-JOB-005`、`TC-OUTBOX-002`;EV-WORKER-001、EV-CONTRACT-002 |
| AC-SYNC-007 | 下游消费接缝 | release snapshot、package view、guide sample、CloudEvent / outbox boundary 可被 fake / real-like 下游读取 | 本仓要求真实下游完成才算成功,或发布快照 / outbox 不可消费 | `TC-JOB-002`、`TC-QUERY-007`、`TC-QUERY-008`、`TC-E2E-001`;EV-WORKER-001、EV-SVC-001、EV-E2E-001 |
| AC-SYNC-008 | 下游未就绪处理 | 真实下游未就绪时,boundary suite 仍可证明输出接缝,风险进入 Step 13 | 本仓把下游未就绪伪装为真实同步成功,或强依赖真实下游导致 P0 不能验 | EV-CONTRACT-001、EV-CONTRACT-002、EV-E2E-001、EV-NIGHTLY-001 |
```

## 9. 待确认事项

- 是否接受“跨仓同步成功”在本轮只表示 L0-core 输出接缝成立,不表示真实下游全部消费成功。
- 是否接受 AC-SYNC-008 将真实 L0-bus / L0-sdk / L1 未就绪作为风险,而不是 P0 失败。
- 是否接受 job 的幂等和事务细节留到 Step 8,本步只验 job 入口 / 输出 / 恢复边界。

## 10. 进入下一步条件

- [x] P0 接口、事件和同步都有裁决口径。
- [x] Command / Query / Event / Job 都有验收项和证据来源。
- [x] 下游未就绪时的接缝验收口径已明确。
- [x] 可以进入 Step 8 定义状态机、事务与一致性验收。
