# L1-conversation 05 测试方案 Step 8: 设计测试环境与配置矩阵

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §8 测试环境与配置矩阵
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 设计测试环境与配置矩阵 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_08_environment_config.md` |

本步定义测试环境、配置矩阵、依赖类型和协作方式。自动化套件、CI/CD 门禁、执行脚本、artifact / report 输出映射和证据编号分别留给 Step 9 和 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | P0 用例矩阵 | 作为环境覆盖对象 |
| `05_test_plan_step_07_test_data.md` | 数据集、fixture、seed、隔离和清理规则 | 作为数据策略来源 |
| `04-配置设计.md` §6 / §7 / §9 / §11 / §12 | profile、配置项、加载校验、失效模式和下游承接 | 作为环境配置真相源 |
| `03-详细设计.md` §13 / §15 | runtime config、adapter、scripts、artifacts / reports | 作为配置绑定点和脚本路径来源 |
| `00-需求文档.md` §12 | 编译期、运行期、事件协作依赖 | 作为跨仓测试协作方式来源 |

## 3. SOP 问题回答

### 3.1 local / CI / integration / staging 分别测什么?

| 环境 | 本轮测试口径 |
|---|---|
| local-dev | 本地最小主链调试和手动复现,必须能跑通 space、fact、query、manifestation、outbox 和 handoff 默认 fake 路径 |
| ci-test | P0 自动化默认环境,使用 deterministic fixture、in-memory store、fake adapter 和 run-scoped artifacts / reports |
| integration-like | P0/P1 边界环境,验证 configured local / controlled resolver、publisher、handoff、store profile 接缝,不要求真实生产 endpoint |
| operations-replay | outbox、projection、snapshot、handoff、consistency、cursor cleanup 的重跑、partial failure 和 diagnostic 环境 |
| staging-like | P1 后续跨仓集成环境,当前只说明边界,不作为 P0 通过条件 |
| production-like | P1/P2 生产运维语境,当前不生成测试通过条件 |

### 3.2 每个环境依赖哪些服务?

P0 环境不依赖真实 DB、真实 broker、真实 resolver、真实 handoff endpoint。编译期依赖使用 path dependency；运行期和事件协作依赖使用 fake / controlled adapter / event replay。

### 3.3 哪些 feature flag / config 影响测试结果?

本仓不用 feature flag 改变领域语义。影响测试结果的是 `runtime.profile`、`storage.*.kind`、`api.*`、`worker.*`、`outbox.publisher.*`、`resolver.*`、`handoff.*`、`jobs.*`、`projection.*`、`reports.*` 和 `security.redaction_policy`。这些配置只能承接 `04-配置设计.md`,不得在测试方案重新定义字段。

### 3.4 哪些依赖需要 mock 或 fake?

`L0-core` 是编译期 path dependency。`L0-bus` 的投递、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L6-bridges`、`L4-observability`、`L4-archive` 在 P0 默认使用 fake、controlled adapter 或 event replay。fake 必须保留 unresolved、retry、failed、quarantine、redaction 和 fake marker。

### 3.5 环境不可用时如何处理?

local-dev / ci-test 配置不可用时 fail-fast。integration-like 的 controlled adapter 不可用时该环境失败,不得回退为 fake success。operations-replay 数据或 report root 不可用时 job / gate fail-fast。staging-like / production-like 不可用不阻塞 P0。

### 3.6 哪些依赖是编译期依赖,可用 path dependency?

`L0-core` 的 shared ID、ActorRef、TraceContext、metadata、error、typed ref 和通用契约是编译期依赖,可在实现仓通过本地 path dependency 引入。测试方案不要求把运行期服务以 path dependency 方式注入。

### 3.7 哪些依赖是运行期依赖或事件协作依赖,必须用 mock / fake / real-like / event replay?

事件协作依赖包括 `L0-bus`、上游 fact committed / changed 事件和 downstream outbox publish；运行期依赖包括 identity、work、governance、artifact、runtime、bridges、observability、archive 的 resolver / handoff / boundary。P0 使用 fake / event replay；integration-like 使用 controlled adapter；staging-like 后续使用 real-like。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧环境未区分 compile / runtime / event 依赖,也缺少 profile 与配置项映射 | 不继承旧环境描述 |
| Step 7 | 已定义数据集和 fixture,但未分配到环境 | 本步建立环境与数据集映射 |
| `04` §6 / §7 | 已定义 profile 和配置项,但测试方案需要指出用哪些 profile 测哪些用例 | 本步承接配置,不重定义字段 |
| `03` §15 | 已定义脚本路径和 artifacts / reports root | 本步只承接路径规则,不定义执行命令 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 环境口径 | 只知道有 local / CI | 明确 local-dev、ci-test、integration-like、operations-replay、staging-like、production-like |
| 依赖类型 | 容易混用 | 区分 `[compile]`、`[runtime]`、`[event]` |
| 配置定位 | 可能口头说明 | 指向 `04` 的正式 JSON key |
| 外部替身 | fake / mock 未分工 | fake、controlled adapter、event replay、real-like 分层 |
| 环境失败 | 未定义 | fail-fast / fail-closed / 不阻塞 P0 明确 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| P0 是否要求真实外部服务 | 要求真实 DB / broker / resolver | 使用 in-memory、fake、controlled adapter | B | P0 验证本仓 truth center,真实服务属于 P1 |
| integration-like 是否等于生产联调 | 视为真实集成通过 | 只验证 controlled 接缝 | B | 避免 fake / controlled evidence 被误判 production |
| path dependency 使用范围 | 所有相邻仓都 path dependency | 只对编译期契约使用 path dependency | B | 运行期和事件协作必须用替身或回放策略 |
| 环境不可用是否降级 | 自动回退 fake 成功 | fail-fast 或标记环境失败 | B | 防止证据污染 |
| 配置是否在 05 重定义 | 重新列字段全集 | 引用 `04` 正式 key 并说明测试用途 | B | 配置真相源在 `04-配置设计.md` |

## 7. 结构化中间产物

### 7.1 环境拓扑图

#### 测试环境拓扑图: L1-conversation P0 test dependencies

```text
[quantalithos-conversation test runtime]
  | [compile] path dependency
  v
[L0-core contracts]

[quantalithos-conversation test runtime]
  | [event] fake publisher / event replay
  v
[L0-bus collaboration seam]

[quantalithos-conversation test runtime]
  | [runtime] fake / controlled resolver
  v
[L1-identity / L1-work / L1-governance / L1-artifact / L2-runtime / L6-bridges]

[quantalithos-conversation test runtime]
  | [runtime] fake / controlled handoff
  v
[L4-observability / L4-archive]

[quantalithos-conversation test runtime]
  | writes
  v
[artifacts/test/<run_id>] -> [reports/runs/<run_id>]
```

关键说明:

- `[compile]` 只表示本地 path dependency 或已发布契约包。
- `[runtime]` 不允许用 path dependency 伪装服务可用,必须使用 fake / controlled adapter / real-like。
- `[event]` 不要求真实 broker,但必须保留 event id、idempotency、retry、failed 和 quarantine 语义。
- artifacts / reports 路径必须 run-scoped,不得写 `latest` 或 `<project>` 层级。

### 7.2 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| local-dev | 本地最小主链和人工复现 | 本地进程、in-memory store、fake resolver / publisher / handoff | `[compile] L0-core`; `[runtime] fake`; `[event] fake` | defaults + optional JSON | `runtime.profile=local-dev`; `storage.*=in_memory`; `outbox.publisher.kind=fake`; `security.redaction_policy=strict` | Step 7 基础数据和 happy path 数据 | 不代表验收通过 |
| ci-test | P0 自动化默认环境 | 临时目录、deterministic fake adapters、no-op / fake publisher | `[compile] L0-core`; `[runtime] fake`; `[event] fake` | deterministic fixture + in-memory + fake scripts | `runtime.profile=ci-test`; `reports.artifacts_root=artifacts/test`; `reports.output_root=reports`; `reports.run_id_source=job` | 全部 P0-blocking 数据集,run-scoped | 配置漂移或路径错误导致 fail-fast |
| integration-like | controlled 接缝验证 | configured local resolver / publisher / handoff / store profile | `[runtime] controlled`; `[event] controlled` | controlled adapter,credential ref only | `runtime.profile=integration-like`; configured adapter refs; raw secret forbidden | external / handoff / outbox / source 数据集 | 不代表 production pass |
| operations-replay | 重跑、恢复、partial failure、diagnostic | 脱敏历史状态、outbox、projection、snapshot、handoff、report root | `[runtime] replay`; `[event] replay` | replay JSON + fake / historical refs | `runtime.profile=operations-replay`; `jobs.*`; `projection.*`; `reports.*` | outbox、derived、handoff、consistency、cursor 数据集 | replay 数据不完整时 job fail-fast |
| staging-like | 后续跨仓集成演练 | real-like DB / event bus / resolver / handoff | `[runtime] real-like`; `[event] real-like` | 后续专项 | P1 部署材料定义 | 后续专项数据 | 不阻塞 P0 |
| production-like | 生产运维语境 | real DB / event bus / source adapters / secret provider | `[runtime] production`; `[event] production` | 后续运维专项 | P1/P2 运维材料定义 | 不在当前测试方案生成 | 不阻塞 P0 |

### 7.3 配置矩阵

| 配置组 | local-dev | ci-test | integration-like | operations-replay | 失败处理 |
|---|---|---|---|---|---|
| `runtime.profile` | `local-dev` | `ci-test` | `integration-like` | `operations-replay` | unsupported profile fail-fast |
| `storage.*.kind` | `in_memory` | `in_memory` | `in_memory` 或 configured local | replay-compatible store | unsupported kind fail-fast |
| `api.command_intake.enabled` / `api.query_intake.enabled` | true / true | true / true | true / true | optional | invalid bool fail-fast |
| `api.metadata_policy` | `strict` | `strict` | `strict` | `strict` | non-strict rejected |
| `worker.inbound_event_sources.*` | fake / disabled until configured | deterministic fake | configured controlled | replay event source | configured 缺 ref fail-fast |
| `worker.outbox_relay.enabled` | true | true | true | true | invalid bool fail-fast |
| `outbox.publisher.*` | fake | deterministic fake | controlled publisher | replay / fake publisher | unavailable -> retry / failed,truth 不回滚 |
| `resolver.*` | fake | deterministic fake | controlled resolver | replay / historical ref | unavailable -> unresolved / fail-closed |
| `handoff.*` | fake + redaction required | deterministic fake + redaction required | controlled handoff | replay / historical handoff | failure -> retry / failed |
| `jobs.*` | small default | deterministic batch | configured batch | replay batch / retry | out of range fail-fast |
| `projection.*` | read model enabled,search optional | read model enabled,search fixture | configured projection | rebuild / failed marker | failure -> stale / failed marker |
| `reports.*` | optional local run | required run-scoped | required run-scoped | required run-scoped | path unwritable / extra layer fail-fast |
| `security.redaction_policy` | `strict` | `strict` | `strict` | `strict` | non-strict 一票否决 |

### 7.4 依赖类型与协作方式判定表

| 依赖方 | 依赖内容 | 全局依赖类型 | P0 协作方式 | path dependency 是否允许 | 说明 |
|---|---|---|---|---|---|
| `L0-core` | shared ID、ActorRef、TraceContext、metadata、error、typed ref | `[compile]` | local path dependency 或契约包 | 是 | 只引入契约,不运行 core 服务 |
| `L0-bus` | outbound event collaboration、publish retry / failed | `[event]` | fake publisher、event replay、controlled publisher | 否 | 不要求真实 broker |
| `L1-identity` | actor / member / AI member ref 解析 | `[runtime]` | fake resolver / controlled resolver | 否 | 不测试身份生命周期 |
| `L1-work` | project / work context ref | `[runtime]` / `[event]` | fake resolver、event replay | 否 | 不复制 work truth |
| `L1-governance` | governance fact ref | `[runtime]` / `[event]` | fake resolver、event replay | 否 | 不裁决治理结论 |
| `L1-artifact` | artifact fact ref / safe snapshot | `[runtime]` / `[event]` | fake resolver、event replay | 否 | 不保存 artifact body |
| `L2-runtime` | runtime result committed event | `[event]` | ref-only event replay | 否 | reasoning body forbidden |
| `L6-bridges` | bridge mapped fact event | `[event]` | ref-only event replay | 否 | platform body forbidden |
| `L4-observability` | trace handoff | `[runtime]` | fake / controlled handoff | 否 | payload ref-only |
| `L4-archive` | archive handoff | `[runtime]` | fake / controlled handoff | 否 | package ref-only |

### 7.5 数据集到环境映射

| 数据集 | local-dev | ci-test | integration-like | operations-replay |
|---|---|---|---|---|
| `DS-CONV-BASE-SPACE` | 是 | 是 | 是 | 否 |
| `DS-CONV-FACT-HAPPY` | 是 | 是 | 是 | 否 |
| `DS-CONV-IDEMPOTENCY` | 可选 | 是 | 是 | 是 |
| `DS-CONV-STATE-BOUNDARY` | 可选 | 是 | 否 | 否 |
| `DS-CONV-AUTH-VISIBILITY` | 是 | 是 | 是 | 否 |
| `DS-CONV-MANIFESTATION` | 是 | 是 | 是 | 是 |
| `DS-CONV-CONSUMER` | 可选 | 是 | 是 | 是 |
| `DS-CONV-HANDOFF` | 是 | 是 | 是 | 是 |
| `DS-CONV-OUTBOX` | 是 | 是 | 是 | 是 |
| `DS-CONV-DERIVED` | 可选 | 是 | 可选 | 是 |
| `DS-CONV-CONFIG` | 可选 | 是 | 是 | 是 |

### 7.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | 处理 |
|---|---|---|
| local-dev config | JSON parse、unsupported profile、non-strict redaction | fail-fast |
| ci-test artifact / report root | unwritable path、extra `<project>` layer、missing run id | fail-fast |
| fake resolver | configured wrong script 或返回 forbidden body | fail-fast / quarantine |
| fake publisher | publish failure | outbox `RetryPending` / `Failed`,truth 不回滚 |
| fake handoff | delivery failure | handoff `RetryPending` / `Failed`,fact / trace truth 不回滚 |
| integration-like controlled adapter | endpoint / credential ref missing | environment failure,不得回退 fake success |
| operations-replay input | replay state 缺失或 schema drift | job fail-fast 或 partial failure evidence |
| staging-like / production-like | 环境未准备 | 不阻塞 P0,记录为后续专项 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §8 时摘录。

```markdown
## 8. 测试环境与配置矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境拓扑图”“环境矩阵”“配置矩阵”“依赖类型与协作方式判定表”和“环境不可用处理表”小节，了解 P0 测试如何区分编译期依赖、运行期依赖和事件协作依赖。

本轮 P0 测试环境包括 local-dev、ci-test、integration-like 和 operations-replay。local-dev 用于确认路径和人工复现；ci-test 是 P0 自动化默认环境；integration-like 只验证 controlled 接缝,不代表 production pass；operations-replay 验证 outbox、projection、snapshot、handoff、consistency 和 cursor cleanup 的重跑与 diagnostic。

跨仓依赖必须区分 `[compile]`、`[runtime]` 和 `[event]`。只有 `L0-core` shared contracts 这类编译期契约允许 path dependency。运行期和事件协作依赖必须使用 fake、controlled adapter、event replay 或后续 real-like 环境,不得用 path dependency 伪装服务可用。
```

## 9. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续 Step 必须继续收口:

- Step 9 定义自动化套件、执行位置、阻断级别和脚本,不得在本步提前固化。
- Step 13 定义 artifact / report 证据编号和归档索引。
- staging-like / production-like 只作为 P1/P2 后续专项,不得在 P0 验收中被误判为当前通过条件。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试环境可定位 | 通过 | local-dev、ci-test、integration-like、operations-replay 已定义 |
| 配置可定位 | 通过 | 配置组均回指 `04-配置设计.md` 正式 key |
| 依赖类型已区分 | 通过 | `[compile]`、`[runtime]`、`[event]` 已标注 |
| 环境不可用处理明确 | 通过 | fail-fast、retry / failed、后续专项已区分 |
| 可以进入 Step 9 | 通过 | 下一步设计自动化与 CI/CD 门禁 |
