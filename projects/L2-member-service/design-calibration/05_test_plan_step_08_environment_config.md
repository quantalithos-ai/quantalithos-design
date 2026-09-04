# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节：`05-测试方案.md` §8

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 测试环境与配置矩阵 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 明确依赖类型与协作方式；只有 compile 依赖可写 path dependency |
| 停审结论 | P0 四 profile 可定位；staging/production 仅 future |

## 2. 环境矩阵

| 环境 / profile | 用途 | 依赖服务 / seam | 全局依赖类型 | 协作方式 | 关键配置 | 风险 |
|---|---|---|---|---|---|---|
| `local-dev` | 手动边界、命令和查询 smoke | in-memory stores、fake / placeholder resolver、disabled publication | runtime / ref / adapter / fake | 普通 fake、placeholder、disabled、blocked；不使用 deterministic fixture | `profile.name=local-dev`、`safe_read_boundary.body_mode=body-free` | 不构成验收，可能只覆盖 happy path |
| `ci-test` | contract/domain/service/fake integration/redaction | 每 run 隔离 in-memory、deterministic fake、fake publisher | runtime / event / fake | test-entry 可启用 `deterministic_fixture.*` | `profile.allow_fixture=true`、固定 clock/id、strict JSON | 不证明真实 sibling / product |
| `integration-like` | adapter failure、handoff、availability mapping | controlled resolver、controlled publisher、controlled sandbox/carrier seam | runtime / event / adapter / ref | controlled / real-like seam；不使用 deterministic fixture | opaque refs、availability markers、fault selector | exact upstream contract 未闭合时只能 blocked |
| `operations-replay` | publication、projection、reconciliation、cleanup、handoff gap replay | 脱敏历史 marker/outbox/report、fake publisher、replay target | event / ref / fake | replay-run 可启用 `deterministic_fixture.*` | `unknown_item_mode=hold`、replay selector | 不修 source truth，不代表真实 delivery |
| `staging-like` | future selected release smoke | future durable / Bus / sibling / Sandbox / observability | runtime / event / adapter | future approved real-like | future deployment material | P1/P2，当前不判定 |
| `production-like` | future operations / capacity | future approved products | runtime / event / adapter | approved provider refs | future restricted config | P2，当前不判定 |

## 3. P0 依赖拓扑

#### 环境拓扑图：L2-member-service P0 测试边界

```text
[test entry / gate]
        |
        v
[validated config + runtime_builder]
        |
        v
[application facade]
   |       |       |       |
 [in-memory stores] [fake/controlled resolver] [fake publisher] [safe sink]
       [runtime/ref]       [event]              [adapter]
```

关键说明：

- 图表达 P0 的受控测试拓扑，不表达真实部署或兄弟仓源码依赖。
- `L0-core` / `L0-sdk` 仅在正式编译基线明确后按 compile seam 接入；其他 sibling 走 runtime/event/ref/adapter/fake。
- `MSVC-UP-001~008` 未闭合时，正向路径保留 blocked/unknown，不以 fake 结果宣告 ready。

## 4. 依赖类型与协作方式判定

| 依赖 | 类型 | P0 协作 | 禁止转换 |
|---|---|---|---|
| `L0-core` | compile（基线待确认） | typed contract / planned compile check | 不扩展为 runtime client |
| `L0-sdk` | compile（准确 target pending） | compile boundary check | 不当作宿主运行期依赖 |
| `L1-identity` | runtime / event / ref | fake safe identity + controlled availability | 不复制身份 truth |
| `L1-work` | runtime / event / ref | fake project-member safe summary | 不复制 ProjectMember truth |
| `L2-member` | runtime / event / ref | placeholder registration/signal/status | 不存 Member body |
| `L2-member-images` | runtime / ref | placeholder pinned supply availability | 不解析 manifest/build truth |
| `L2-runtime` | runtime / ref / event | placeholder session/handoff feedback | 不存 run/turn/checkpoint |
| `L4-sandbox` | runtime / ref / event | controlled host binding/release marker | 不拥有 backend/policy/execute |
| carrier / container / registry | adapter | fake/controlled availability and failure | 不让产品定义 domain state |
| `L0-bus` / observability | event | fake publisher / safe sink / replay | 不由 receipt 推导 delivered/observed |

## 5. Profile 配置矩阵

| 配置项族 | `local-dev` | `ci-test` | `integration-like` | `operations-replay` | 失败策略 |
|---|---|---|---|---|---|
| `profile.*` | fixture=false | fixture 可由 test-entry 启用 | fixture=false | replay-run 可启用 | 非允许 profile 使用 fixture => fail-fast |
| `truth_store_binding.*` | in-memory | run-scoped in-memory | in-memory / controlled durable-like | replay-input store | 缺 required store => builder fail-fast |
| `qualification_resolvers.*` | fake/placeholder | deterministic fake | controlled seam | snapshot/replay | unavailable => blocked/unknown |
| `member/images/runtime/sandbox_binding.*` | blocked/placeholder | blocked/fake | opaque ref + controlled | replay ref/blocked | malformed ref => fail-fast；缺合同 => blocked |
| `carrier_binding.availability` | blocked/fake | fake | controlled / blocked | replay target | 不接受 `carrier_binding.binding_ref` |
| `publication.*` / `handoff_feedback.*` | disabled | fake | controlled | fake/replay | target/event unresolved => blocked/gap |
| `operation_jobs.*` | conservative run-local | deterministic values | controlled values | replay values | 非正值 / 超界 => job rejected |
| `safe_read_boundary.*` / `security_redaction.*` | body-free / safe | body-free / safe | body-free / safe | body-free / safe | 放宽即 fail-fast |
| `deterministic_fixture.*` | 禁止 | test-entry only | 禁止 | replay-run only | outside profile => fail-fast |

## 6. 配置项到测试切口矩阵

| 配置项 | 测试切口 | 关键断言 |
|---|---|---|
| `profile.name` / `profile.allow_fixture` | `config_validation_builder` | profile enum 和 fixture guard 正确 |
| `config_identity.*` | contracts/config | schema version、canonical、source label 安全 |
| `truth_store_binding.*` / `maintenance_store_binding.*` | repository/UoW | logical owner 不合并、缺失不启动 |
| `idempotency_result_binding.*` | idempotency | unavailable 时 mutation rejected，不静默重跑 |
| `qualification_resolvers.*` / binding availability | qualification/adapter | fake/placeholder/blocked 不升级 positive |
| `registration_session.*` / `health_assessment.*` | registration/health/job | pending / stale / unknown 正确映射 |
| `publication.*` / `handoff_feedback.*` / `carrier_binding.availability` | material/outbox/handoff | marker 分层、target 缺失 blocked/gap |
| `operation_jobs.*` | jobs | run-local 参数不创建授权或新 key |
| `safe_read_boundary.*` / `security_redaction.*` | query/redaction | body-free、no-write、低基数不可关闭 |
| `clock_id.*` / `deterministic_fixture.*` | determinism | Clock/ID 注入；fixture 仅允许 profile |

## 7. 环境不可用处理

| 不可用类型 | 测试行为 | 允许结论 |
|---|---|---|
| config parse/builder 不可用 | gate fail-fast，保留 safe issue | P0 not run；不得 fallback |
| required local store 不可用 | mutation suite blocked | 不得以空 store 伪造通过 |
| sibling seam 不可用 | negative / blocked case 继续；positive selected-run unavailable | blocked / unknown / residual |
| publication / handoff 不可用 | local truth 测试可继续，交接 case gap | 不回滚 local truth，不声明 delivered |
| observability sink 不可用 | safe local material + unavailable marker | 不影响本地判断，但证据完整性需补说明 |

## 8. 环境 / 配置停审与回填草稿

| 审计项 | 结论 |
|---|---|
| P0 profile 可定位 | pass |
| 依赖类型清楚 | pass |
| path dependency 仅用于 compile | pass |
| deterministic fixture profile 隔离 | pass |
| carrier 未被误写成 binding ref | pass |

正式 §8 应写环境矩阵、拓扑图、依赖类型、profile 配置、配置项切口和不可用处理；不写真实 endpoint、产品名、secret 或实际运行结果。

- [x] P0 环境与配置可判定。
- [x] 跨仓连线带类型边界。
- [x] 可进入 Step 9。
