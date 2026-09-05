# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节：`projects/L2-member/05-测试方案.md` §8「测试环境与配置矩阵」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_08_environment_config.md`
> 环境口径：本文定义 planned 环境、配置和依赖协作方式，不声明环境已部署、服务已可用或测试已执行。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8：设计测试环境与配置矩阵 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 6 用例；Step 7 数据集；`03` §13 外部绑定；`04` §6~§12 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_08_environment_config.md` |
| 回填位置 | 正式 `05-测试方案.md` §8（Step 15） |
| 停审方式 | 环境矩阵、配置矩阵、依赖类型和不可用姿态完成后停审 |

## 2. 本步目标

定义 P0 用例在 local、CI、integration-like、operations-replay 和未来 staging / production-like 环境中的测试边界，明确哪些关系是编译期依赖、运行期依赖、事件协作、ref、adapter、fake 或 sibling 只读材料。所有环境不可用都必须有可判定的 blocked / waiting / not-available 处理，不能用默认成功补齐。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases.md` | P0 用例与自动化候选 |
| `05_test_plan_step_07_test_data.md` | 数据集、隔离、fake / controlled / disabled 规则 |
| `03-详细设计.md` §13 | 配置引用、Port、adapter、依赖分类 |
| `04-配置设计.md` §6~§12 | profile、配置项、加载 / 校验、生效、失效策略 |
| `01-架构设计.md` 依赖裁剪 | Core-only compile candidate 与跨仓边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / integration / replay 分别测什么？ | `local-dev` 做契约探索和 domain / service 快速验证；`ci-test` 做可重复 P0 unit / fake boundary / redaction / dependency；`integration-like` 只在 owner contract 可用时做受控接缝；`operations-replay` 只读对账 duplicate / gap / report / projection，不重放未知副作用。 |
| 每个环境依赖哪些服务？ | P0 只依赖本仓 logical Store / UoW、deterministic Clock / ID / digest、fake resolver / handoff、配置 validator 和 instrumentation spy。Runtime、host、Bus、image、identity、governance、tools 等作为 opaque ref / controlled seam，不把对方内部服务或状态机纳入本仓环境。 |
| 哪些 feature/config 影响结果？ | `composition.*`、`stores.*`、`technical.*`、`command_boundary.*`、`query_boundary.*`、`consumer.*`、`projection.*`、`jobs.*`、`resolvers.*`、`handoff.*`、`registry.*`、`diagnostics.*` 和 test-only `fixtures.*`；具体 key 以 `04` 正式清单为准。双锚、UoW、CAS、Query no-write、Unknown fence、24 candidate block 不可配置化。 |
| 哪些依赖用 mock / fake？ | 物理 Store、broker、transport、scheduler、host / Runtime / publication / observation handoff、owner resolver、secret provider 和 image assembly 在 P0 使用 fake / controlled / disabled；real-like 只在 P1 且合同闭合后启用。 |
| 环境不可用如何处理？ | required local slot 缺失 -> fail-fast / no-write；optional projection / resolver / handoff -> stale / blocked / waiting / not-available；外部正向环境缺失 -> `blocked / not_run`，不生成 positive evidence。 |
| 哪些是编译期依赖？ | 只有已核验的 `L0-core` / `core-contracts` primitive 是 planned compile candidate；L2-runtime、L2-tools、member-service、member-images、Bus 和其他 sibling 不写成 Cargo path dependency。 |
| 哪些是运行期或事件协作？ | Runtime / host / resolver / handoff 是 runtime adapter/ref 关系；Bus 入站 / 出站是 event collaboration；它们必须通过 fake、controlled response 或 replay descriptor 测试，不能伪装 package dependency。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 使用 dev/test/staging 的固定端口和产品名 | 删除无 authority 的端口、产品和部署假设，只保留逻辑 profile |
| 运行期 / 事件依赖可能被写成 package dependency | 用依赖类型表和拓扑连线标签 `[compile]`、`[runtime]`、`[event]` 固定分类 |
| fake success 容易被写成 integration | 每个环境明确 local oracle、blocked posture 和不得作出的外部结论 |
| config key / secret 可能泄漏到测试 | 只引用 `04` key，secret 仅 opaque ref，redaction 作为环境前置 |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| 环境 | dev/test/staging 模糊 | 六类逻辑 profile | 可定位测试目的、边界和不可用策略 |
| 依赖 | sibling 可能直接联编 | compile / runtime / event / ref / adapter / fake 分类 | 遵守全局裁剪规则 |
| 外部服务 | 默认可用 | blocked-aware / controlled | 上游合同仍 pending |
| 配置 | 旧 key / 端口 | `04` 正式 key 和 non-configurable invariants | 防止历史污染 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否建立完整 staging 拓扑 | 只建立逻辑拓扑，staging-like 留 P1 | image / host / Runtime / Bus 合同未闭合 |
| 是否用真实 DB / broker | P0 不用 | 物理产品未定，fake parity 足以验证 local contract |
| 是否让 CI 读取真实 secret | 不允许 | secret provider 和凭据 owner pending，CI 使用 ephemeral opaque ref |
| 是否允许环境自动降级为 fake | 不允许 silent fallback | 需要显式 profile / slot，避免 fake 被当真实集成 |

## 8. 结构化中间产物

### 8.1 环境矩阵

| 环境 / profile | 用途 | 依赖服务 / slot | 依赖类型 | 测试协作方式 | 关键配置 | 数据策略 | 不可用 / 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 契约探索、手工调用、domain/service 快速反馈 | local logical Store、fake technical、blocked external slots | compile + local runtime fake | deterministic fake | `composition.profile=local-dev`、`fixtures.*` | `DS-L2M-*` per-run | 外部 slot blocked；不算 integration |
| `ci-test` | PR / main P0 自动化 | in-memory / logical Store、fake resolver / handoff、redaction spy | compile + runtime fake | deterministic controlled | `ci-test`、fixed Clock / ID、strict redaction | ephemeral run-scope | fixture / Store 缺失阻断；不产生外部 evidence |
| `integration-like` | 合同闭合后的 selected seam | owner-approved adapter / durable-like Store | runtime + event + ref | controlled / real-like selected | environment JSON + allowlisted env | isolated namespace | `L2M-UP-*` 未闭合则 blocked / not_run |
| `operations-replay` | duplicate、gap、report、projection 对账 | read-only carrier / marker、replay descriptor | runtime replay | no-side-effect replay | `operations-replay`、read-only target | de-identified refs | 未知副作用不重放；缺 carrier 为 defect |
| `staging-like` | 未来组合 smoke | 全部 owner / product slot | runtime + event + adapter | approved controlled | audited profile | no fixture | P1 future；未激活 |
| `production-like` | 未来正式验证 | physical Store、provider、host、Runtime、Bus、image | runtime + event + external | change-controlled | approved provider refs | production policy | P1/P2 future；不纳入当前退出 |

### 8.2 逻辑环境拓扑图：L2-member 测试依赖

```text
                         [P1 owner-approved selected run]
                   [host] [Runtime] [Bus] [resolver] [image]
                    [runtime/ref/event/adapter - blocked today]
                                      ^
                                      |
 [ci-test / local-dev] --> [member test composition] <-- [operations-replay]
                                |
              +-----------------+------------------+
              |                 |                  |
       [logical Store]   [fake resolver/handoff]  [redaction spy]
          [runtime]             [runtime]             [local]
              |
        [core-contracts] [compile]
```

关键说明：

- 只有 `core-contracts` 作为 `[compile]` 依赖；其他连线不是 package dependency。
- `operations-replay` 只读取已提交 carrier / marker，不执行未知外部副作用。
- P1 外部连线在 blocker 关闭前保持 blocked / not_run；不把环境可启动当服务可用。

### 8.3 配置矩阵

| 配置组 | `local-dev` | `ci-test` | `integration-like` | `operations-replay` | 失败姿态 |
|---|---|---|---|---|---|
| `composition.*` | local profile | fixed test profile | audited profile | replay profile | parse / profile fail-fast |
| `stores.*` | logical fake | deterministic fake | durable-like selected | read-only target | required 缺失 no-write |
| `technical.*` | deterministic | fixed deterministic | approved provider | fixed replay | missing fail-fast |
| `command_boundary.*` | safe bounded class | safe bounded class | same invariant | no mutation | invalid reject |
| `query_boundary.*` | safe page / stale posture | same | same | read-only | no-write / not-available |
| `consumer.*` | blocked-by-default source | controlled descriptor | owner source contract | replay descriptor | reject / blocked |
| `projection.*` | disabled-until-watermark | deterministic watermark | selected source | read-only rebuild target | stale / job blocked |
| `jobs.*` | deterministic-single | deterministic-single | controlled class | no-unknown-retry | reject / partial report |
| `resolvers.*` / `handoff.*` | opaque ref / null | fake / blocked | owner-approved | replay-only | waiting / blocked / unknown |
| `diagnostics.*` | strict / low-cardinality | strict / low-cardinality | strict | strict | fail-fast / redact more |
| `fixtures.*` | allowed | allowed | forbidden unless explicit test | forbidden | profile mismatch reject |

### 8.4 依赖类型与协作方式

| 关系 | 类型 | P0 方式 | P1 方式 | 不得写成 |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile | path / published primitive（仅 planned） | 同上 | foreign business crate |
| `L2-runtime` | runtime + ref | fake entry / safe material / blocked | owner-approved selected run | Cargo dependency / Runtime truth |
| `L2-tools` | runtime + ref | safe view / unavailable | selected resolver | tool execution / package dependency |
| `L2-member-service` | runtime + ref | host request / signal / report fake | IPC contract selected run | host lifecycle / health |
| `L2-member-images` | ref / supply | pinned-ref availability marker | release compatibility run | image build / manifest truth |
| `L0-bus` | event collaboration | descriptor / blocked route | controlled event run | broker / ack / DLQ truth |
| `L1-work` / `identity` / `governance` | ref / resolver | safe snapshot / unknown | owner-approved resolver | foreign body / policy truth |
| test fake / stub | test-only runtime | deterministic parity | not production | readiness evidence |

## 9. 环境与配置停审记录

| 项 | 结果 | 说明 |
|---|---|---|
| P0 local / CI profile 可定位 | `covered` | profile、依赖和数据策略明确 |
| integration-like 边界 | `blocked-aware` | 只在合同关闭后启用，当前不产生 positive 结论 |
| operations replay | `covered` | no-side-effect、read-only、缺 carrier 为 defect |
| 配置 key 与 `04` 一致 | `covered` | 不新增 key，不改变 invariant |
| compile / runtime / event 分类 | `covered` | 拓扑标注和依赖表完整 |
| secret / raw body | `blocked` | opaque ref、strict redaction，禁止明文 |

## 10. 依赖与环境审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| sibling path dependency | `none_allowed` | 只有 Core compile candidate |
| runtime / event 误写 package | `prevented` | 标记 `[runtime]` / `[event]` |
| fake 伪装 real-like | `prevented` | profile 显式，blocked / not_run 保留 |
| environment unavailable handling | `defined` | fail-fast / blocked / stale / not-available 分类 |
| production secret / fixture contamination | `prevented` | profile validator 阻断 |

## 11. 回填草稿（供正式 §8）

测试环境分为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like` 和 `production-like`。P0 主要使用 deterministic logical Store、fixed Clock / ID / digest、fake / controlled resolver / handoff、strict redaction 和隔离数据；`integration-like` 仅在 owner contract 闭合后做 selected run，`operations-replay` 只读对账，不重放未知副作用。

依赖严格区分：只有 `core-contracts` 是 planned compile candidate；Runtime、Tools、member-service、member-images、Bus 与各 truth owner 通过 runtime / event / ref / adapter 协作。配置引用 `04` 的正式 key 和 profile，双锚、UoW、CAS、Query no-write、Unknown fence、redaction 和 24 candidate zero-configuration 不可配置化。环境不可用时必须记录 blocked / waiting / stale / not-run，不得伪造 positive integration。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| implementation repo / runner | 实际环境命令 | `L2M-DDD-001`，留 Step 9 / 07 |
| physical Store / transport 产品 | P1 integration-like | `L2M-DDD-002`，不阻塞 P0 |
| host / Runtime / Bus / image exact contract | P1 selected run | `L2M-UP-001~005`，blocked-aware |

- [x] local / CI / replay / future profile 已定义用途、依赖、协作和不可用策略。
- [x] compile / runtime / event / ref / adapter / fake 分类无混淆。
- [x] 配置、secret、fixture 和 non-configurable invariants 已审计。

**Step 8 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 9。
