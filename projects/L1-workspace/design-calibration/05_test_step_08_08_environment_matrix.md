# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8  
> 回填章节：`05-测试方案.md` §8

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / environments_planned_with_real_seams_blocked |
| 输入 | Step6~7；03 §13~16；04 全量配置边界 |
| 输出 | 6个执行语境、4 profile映射、依赖分类、环境拓扑、失效处置 |
| 事实边界 | 未创建/启动任何环境、runner、service、credential 或部署 |

## 2. 本步目标与输入

定义测试在何种执行语境、何种正式 profile、哪些依赖类型和协作方式下运行。环境名称不新增 04 profile；local/CI/controlled/real-seam/staging/release 是测试执行语境，配置仍只取 `local|test|staging|production`。

| 输入 | 用途 |
|---|---|
| Step6 | 用例层级、blocked正向与 fault injection |
| Step7 | 数据集、隔离、清理、test-double authority边界 |
| 00 §6 / 01 | compile/runtime/event/ref/adapter/fake 裁剪 |
| 03 Step14 | WorkspaceLimits、cursor、九AdapterSlot、能力装配 |
| 04 §6~§14 | 四profile、配置项、strict load、secret、fail-fast/blocked |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local/CI/integration/staging分别测什么？ | local做contract/domain/service快速验证；CI在test profile做59 TC中可执行部分；controlled integration做store/adapter/fault；real-seam/staging做owner/bus/durable正向但当前blocked；production只保留未来release/运维验证，不执行。 |
| 依赖哪些服务？ | local/CI只需目标实现、L0-core compile候选及test-only doubles；controlled需本地store/codec/config adapter；real seam需owner query/visibility/event/bus/durable/secret；下游read兼容需正式consumer。 |
| 哪些配置影响结果？ | 04 §7全部 resource/timeout/binding/redaction，及schema_version/profile/source优先级；无新增feature flag。 |
| 哪些可mock/fake？ | 本地失败分类、write spy、fault schedule、synthetic secret/canary可double；owner allow/schema/replay/durable proof不可由fake正向证明。 |
| 环境不可用如何处理？ | local/test装配失败即测试基础设施失败；staging seam缺失为blocked；production不存在为not_scheduled；均不得记pass。 |
| 哪些是compile？ | 仅经核验的L0-core共享契约候选；其他L0-bus/L1/L2/L4均非path compile依赖。 |
| runtime/event/ref如何协作？ | owner safe query/visibility为[runtime/ref]，owner change经L0-bus为[event]，下游为[adapter/ref]；正式vector只用于conformance，不能改写依赖类型。 |

## 4. 当前材料问题诊断

| 首稿问题 | 风险 | 修正 |
|---|---|---|
| local/test/staging/production既像环境又像profile | 执行语境和配置源混淆 | 单列执行语境→正式profile映射 |
| 未区分controlled与real integration | fake可能冒充跨仓集成 | 两者独立，real seam明确blocked |
| 依赖类型未逐项列 | L1 path dependency/共享表风险 | 建立compile/runtime/event/ref/adapter/fake表 |
| 没有环境拓扑 | 跨仓方向难审查 | 增加标注依赖类型的ASCII图 |
| 只说不填DSN | 仍可能暗示staging存在 | 明确所有环境的存在/就绪状态 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 执行语境 | 4个profile名称 | 6个测试语境映射4个正式profile |
| 集成 | 一项 | controlled planned vs real-seam blocked |
| 配置 | “复用04” | 逐配置域/用例/失败姿态映射 |
| 依赖 | 简述 | 每依赖类型、协作方式、风险明确 |
| 就绪事实 | 模糊 | planned/blocked/not_scheduled，不写ready |

## 6. 测试环境设计取舍

1. 不创造 `ci-test`、`integration-like` 等新 profile；CI与controlled integration均使用04的`test` profile，只改变test harness装配。
2. local/test fake不能正向证明owner/bus/durable；staging缺正式seam时保留blocked用例，不用fallback。
3. production profile只做配置负向与未来门禁定义，当前不连接生产数据/credential/endpoint。
4. 环境矩阵不固定实际DSN、host、CI vendor、runner image或数值；这些尚无正式来源。
5. 下游SDK/product/sync/archive只作为read consumer seam，绝不进入workspace写路径或定义export truth。

## 7. 结构化中间产物

### 7.1 执行语境与profile矩阵

| 测试语境 | 正式profile | 用途 | 依赖服务 | 协作方式 | 数据策略 | 当前状态/风险 |
|---|---|---|---|---|---|---|
| local fast | local | contract/domain/service调试 | 目标crate、L0-core候选、in-memory doubles | typed builder/failure fake/write spy | 每case新实例 | planned；非验收证据 |
| CI deterministic | test | 可执行P0 unit/service/entry/config/security | isolated fake store/ports/capture | fixture + deterministic fault/barrier | test_run_id namespace | planned；实现/runner不存在 |
| controlled integration | test | store/cursor/config/composition/failure contract | test adapter、synthetic key、controlled local store | adapter contract/fault injection | run-scoped store | planned；不证明durable/owner |
| real-seam integration | staging | owner query/visibility/event/bus/durable/secret正向 | 正式L1 owners、L0-bus、durable store、secret provider | real-like/正式conformance | provider run namespace | blocked WS-UP/WS-LOCAL |
| downstream compatibility | staging | SDK/product/sync/archive只读兼容 | 正式read consumer contract | adapter/ref selected-run | safe read-only dataset | blocked WS-UP-006；archive串行 |
| release/operations | production | 未来生产profile装配、容量/长稳/恢复 | approved production bindings | real products/no fake | production-safe strategy | not_scheduled；不在当前执行范围 |

### 7.2 环境拓扑图：L1-workspace 测试依赖

```text
                         [L0-core contracts]
                                 |
                             [compile]
                                 v
 [API / Worker / Jobs] --> [L1-workspace application/domain]
         [runtime]                    |
                                      | [adapter]
                                      v
                        [local store / cursor / config]

 [L1 identity/work/conversation/process/governance/artifact]
                  | [runtime/ref]              | [event]
                  v                            v
          [owner query/visibility]       [L0-bus delivery]
                  \                            /
                   \----> [L1-workspace] <----/

 [L1-workspace] --[adapter/ref]--> [SDK / product / sync / L4-archive]

 test-only doubles --[fake]--> workspace ports
   (failure/local mechanism only; never owner authority or real replay proof)
```

关键说明：

- 只有 `L0-core` 是编译期候选；图中其他跨仓关系均不得转成 path dependency。
- owner query/visibility 与 owner event 是不同协作轴，不能用事件 fixture 冒充现时授权。
- downstream 与 archive 只读消费，不存在 workspace→archive 写入/handoff/accepted truth。
- fake 连接只存在测试装配中，production profile必须拒绝。

### 7.3 依赖类型与测试协作方式

| 依赖 | 类型 | path dependency | local/test方式 | staging方式 | 当前风险 |
|---|---|---:|---|---|---|
| L0-core | compile候选 | 条件允许 | 最小导出/类型contract | 固定兼容版本 | WS-UP-007专用schema未闭合 |
| L0-bus | event | 否 | envelope失败/分类fixture；不ACK | 正式delivery/replay | WS-UP-002 blocked |
| L1-identity/work | runtime/event/ref | 否 | resolver failure/blocked vectors | 正式scope/member safe seam | WS-UP-001/003/005 |
| L1-conversation/process | runtime/event/ref | 否 | attention/event负向 | 正式attention/change seam | WS-UP-001~004 |
| L1-governance/artifact | runtime/event/ref | 否 | visibility/safe ref负向 | 正式decision/artifact-safe seam | WS-UP-001~003 |
| local store | adapter/runtime | 否 | fake/controlled adapter | durable selected driver | WS-LOCAL-001 |
| secret/cursor provider | runtime/secret ref | 否 | synthetic key material | approved provider/rotation | WS-LOCAL-003 |
| owner/bus transport | runtime/event | 否 | missing/unavailable double | approved endpoint/transport | WS-LOCAL-002 |
| SDK/product/sync/archive | adapter/ref | 否 | schema/local read boundary | formal compatibility selected-run | WS-UP-006/006-S |
| L2 runtime/tools/member | ref only/排除 | 否 | no binding/static boundary check | no workspace execution binding | WS-UP-008 |

### 7.4 配置域到环境/用例矩阵

| 04配置域 | local/test | staging/production | 覆盖TC | 无效/不可用姿态 |
|---|---|---|---|---|
| schema_version/profile/source priority | 显式fixture、strict解析 | 只接受获准source | CONFIG-001 | missing/unknown/conflict启动fail-fast |
| resource.max_request/page/token | L/L+1边界 | 值待workload | RES-001 | InvalidRequest/CursorInvalid，不clamp |
| resource.max_snapshot/commit | controlled完整集合 | durable值与产品待定 | RES-002、TXN-* | Unavailable/commit失败，不截断Complete |
| resource.max_recovery/invalidation/in_flight | controlled batch/fanout | workload待定 | RES-003、REC/SRC | 超限拒绝，continuation/next显式 |
| timeout.owner_read | immediate deterministic timeout | 正式transport timeout值待定 | SCOPE/VIS/QRY/SRC | SourceUnavailable/Unavailable或Blocked语境 |
| timeout.store_read/commit | fault schedule | driver timeout值待定 | SRC-005、TXN-* | commit timeout→Unknown，不推NotCommitted |
| timeout.shutdown | controlled in-flight | 运维值待定 | CONFIG-002/RES-003 | 停接收、保留未决，不伪终局 |
| binding.store_driver | fake/controlled ref | durable required | CONFIG-003、TXN-* | missing Unavailable；无分步save fallback |
| binding.owner_transport | missing/failure double | exact owner required | SCOPE/VIS/QRY | ContractBlocked/Unavailable，fail-closed |
| binding.bus_transport | missing/failure double | exact event transport required | SRC-* | ContractBlocked/Retry；不声称ACK/replay |
| binding.cursor_key_ref | synthetic test ref | secret provider required | PAGE-002、CONFIG-002 | CursorInvalid/Unavailable；无明文fallback |
| observability.redaction_profile | capture profile required | production-safe required | SEC-* | unknown fail-fast；sink失败不改业务 |

### 7.5 数据集到环境映射

| 环境语境 | 允许的数据集 | 禁止 | 隔离/清理 |
|---|---|---|---|
| local fast | CONTRACT、PARTITION、LOCAL、RECOVERY、RECORD、CONFIG | owner/bus正式vector冒充本地成功 | per-case instance/drop |
| CI deterministic | 除AUTH/EVENT正向blocked外全部local/negative集 | production credential、真实业务正文 | test_run_id/drop/reset |
| controlled integration | FAULT/RACE/CURSOR/CONFIG/RESOURCE/DEPENDENCY及local snapshots | 把fake result标real integration | run-scoped store/zeroize/reset |
| real-seam staging | AUTH-BLOCKED/EVENT-BLOCKED由正式provider替换 | ad hoc JSON/String/vector无版本 | provider namespace/cleanup合同；当前blocked |
| downstream staging | safe read/export vector | archive package/body/accepted state写入workspace | read-only namespace；当前blocked |
| production | 本轮无测试数据 | synthetic fake、test_run_id注入业务key、生产数据复制 | not_scheduled |

### 7.6 环境不可用与跳过规则

| 情况 | 处理 | 可否记通过 |
|---|---|---|
| local/test配置解析或builder失败 | suite infrastructure failure，停止受影响suite | 否 |
| test fake/controlled adapter意外不可用 | test harness defect；保留失败输出候选 | 否 |
| 用例预期注入Unavailable/ContractBlocked | 仅当精确断言匹配时该负向用例可通过 | 仅该负向用例可 |
| owner/bus/durable正式seam缺失 | 对应positive suite/test标blocked，不执行fake替代 | 否 |
| staging凭据/namespace/cleanup未批准 | selected-run blocked | 否 |
| downstream/Archive合同缺失 | compatibility blocked；不影响本地负向用例 | 否（该接缝） |
| workload/baseline缺失 | 性能/容量项pending，不生成阈值verdict | 否 |
| production环境不存在/未授权 | not_scheduled | 否 |

### 7.7 环境与配置停审

| 项目 | profile定位 | 依赖类型明确 | 数据/清理明确 | 不可用姿态 | 结论 |
|---|---|---|---|---|---|
| local fast | local | 是 | 是 | infrastructure fail | pass_as_planned |
| CI deterministic | test | 是 | 是 | infrastructure fail | pass_as_planned |
| controlled integration | test | 是 | 是 | no fake-to-real claim | pass_as_planned |
| real-seam integration | staging | 是 | provider pending | blocked | pass_with_blockers |
| downstream compatibility | staging | 是 | contract pending | blocked | pass_with_blocker |
| release/operations | production | 是 | 未授权/未定义 | not_scheduled | out_of_current_execution |

### 7.8 跨环境审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否复用04四profile | pass；未新增ci/integration profile |
| P0本地测试环境可定位 | pass；local/test语境明确，仍待实现 |
| compile/runtime/event/ref/adapter/fake是否分开 | pass；见§7.2/7.3 |
| 非core sibling path dependency | prohibited |
| controlled是否冒充real seam | no；staging独立blocked |
| production是否写成已存在 | no；not_scheduled |
| 配置是否逐域可定位 | pass；见§7.4，无真实值 |
| 环境跳过是否伪pass | no；blocked/pending/not_scheduled均非pass |
| archive是否反向定义 | no；只读compatibility且串行后续 |

## 8. 对 03/04 的影响判定

环境矩阵复用04正式profile和字段，不新增配置键、feature flag、endpoint或默认值。测试执行语境是05编排概念，不进入RuntimeConfig。未发现需回写03/04的新缺口；现有WS-UP/WS-LOCAL充分承接real seam阻塞。

## 9. 回填草稿

正式§8回填执行语境/profile矩阵、拓扑图、依赖分类、配置域映射、数据环境和不可用规则。必须标注所有环境均为planned/blocked/not_scheduled，不能写“环境已准备好”。

## 10. 待确认事项与进入下一步条件

- CI vendor/runner、测试命令、真实driver/endpoint/credential、staging namespace均未确定。
- local/test的计划环境、数据、配置和失败语义可定位；real seam阻塞明确。
- Step8通过，允许Step9定义planned gate/check/report脚本和artifact/report路径。
