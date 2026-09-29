# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8；回填位置：正式 `07-实施计划.md` §8。\
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。\
> 本产物只定义未来实施前置和依赖准备，不创建实现仓、配置文件、secret、adapter、脚本、run 或 artifact。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 8：配置、环境与外部依赖准备 |
| 输入 | Step 3 阅读矩阵；Step 5 Phase；Step 6 boundary；Step 7 门禁矩阵；正式 `01/03/04/05/06` |
| 输出 | 依赖分类、profile/配置准备、fake 边界、阶段准备矩阵、不可用处理 |
| 当前状态 | `completed / dependency_matrix_closed_with_blockers / continue_authorized` |
| 目标实现仓 | `/home/aris/Projects/quantalithos-archive`；当前不存在；本 Step 不创建 |
| compile candidate | 仅经核验的 `L0-core` contracts；实际 package/export/lock 仍需 PH-01 重核 |
| implementation / test / acceptance execution | `false` |
| 下一动作 | `create_and_complete_step_09_spikes_risks_open_questions` |

## 2. 本步输入与读取确认

| 输入 | 用途 | 核验 |
|---|---|---|
| `03-详细设计.md` §3/§4/§13～§15 | workspace、六 role、runtime builder、slot、观测边界 | 已读；不把 planned 文件树当已存在代码 |
| `04-配置设计.md` §3～§11 | 12 配置域、55 P0 keys、6 profile、strict source、assembly/failure | 已读；不填默认值、secret、provider 或数值 |
| `05-测试方案.md` §8/§9/§13 | 7 类环境、profiles、13 suites、5 gates、14 scripts、固定 raw/report roots | 已读；不创建脚本或输出目录 |
| `07` Step 3/5/6/7 | boundary-specific 读取、Phase 准备和门禁 | 已读；依赖必须回指 boundary |
| `子项目目录与代码文件组织规范.md`、依赖裁剪标准 | 仓、Cargo、路径和关系类型 | 已读；禁止非 Core sibling compile dependency |

## 3. SOP 问题回答

| 问题 | 回答与取舍 |
|---|---|
| 哪些仓是编译期依赖 | 只有待核验的 `L0-core` shared contracts；Archive 不编译依赖 L1、Bus、SDK、provider、storage、KMS、receiver 或 observability。 |
| 哪些是 runtime/event/ref/adapter/fake | L1 snapshot/export、workspace view、artifact/evidence、governance decision、storage/integrity、restore receiver、Bus inbound、observability material 和所有 provider 均按实际 seam 分类。 |
| 哪些配置必须先准备 | 12 域/55 P0 keys 的 schema、profile、binding registry、required slot、operation/cursor ref、positive budgets、redaction 和 artifact/report roots；实际值仍 pending。 |
| fake 可以做什么 | 仅做 local contract、negative、controlled failure、ordering、UoW/CAS/idempotency/no-write 和 per-owner isolation；必须保留 typed outcome、version/fence、receipt/report 和 fail-closed 语义。 |
| 外部不可用怎么办 | compile candidate、目标仓、toolchain 或 required local fake 不可用则暂停；formal seam 缺失为 blocked；P1/P2 real-like 不可用只记 residual，不计 P0 pass。 |
| 是否可用配置放宽设计 | 不可。配置不能改变 owner、state、query no-write、outbound absence、digest/key/retention/restore authority 或 finality 语义。 |

## 4. 依赖分类与禁止偷渡

| 依赖对象 | 关系分类 | 允许表达 | 禁止表达 | 不可用姿态 |
|---|---|---|---|---|
| `L0-core` contracts | compile candidate（待核验） | 最小 typed shared symbol、锁定 package/path/version | 复制 Core domain/application；未经核验直接加入 graph | `blocked / wait_design` |
| L1 identity/conversation/work/process | runtime + ref + adapter | owner snapshot/export/ref、version/fence/coverage | Cargo path、影子 schema、Archive 写 owner DB | target `Blocked/Partial/Stale/Missing/Conflicting` |
| L1-governance | runtime + ref + adapter | current decision/hold/delete opaque ref | Archive 自定 policy/期限/风险接受 | `Blocked`，无 decision 无 effect |
| L1-artifact | runtime + ref + adapter | owner-approved material/ref/lineage ref | 通用 Artifact 正文/血缘 truth | material/ref blocked |
| L1-workspace | runtime + ref + adapter | `WorkspaceProjection/Auxiliary` | canonical fallback 或 source closure 补全 | Auxiliary/unavailable |
| L4-observability | runtime + ref + adapter | safe telemetry、脱敏 material handoff | backend/audit chain truth | optional drop；formal blocked |
| L0-bus | event + adapter | trusted inbound envelope/receipt | outbox/topic/publisher/delivery state | reject/quarantine/blocked |
| storage/integrity/KMS/schema | runtime + adapter/ref | typed capability slot/outcome/probe | provider、算法、key、digest、compression 产品选择 | `Unknown/Unsupported/CommitUnknown` |
| restore receivers | runtime + ref + adapter | exact owner receiver/import/command/handoff | direct owner DB write、跨 owner transaction | per-owner blocked/partial/unknown |
| fake/controlled double | fake / test-only | deterministic negative/controlled behavior | production fallback、formal finality/readiness | test-only；不能关闭 blocker |
| SDK/client/cache/UI/runtime/tools | downstream/runtime | consumer-facing boundary outside server graph | Archive server compile dependency或本仓业务 truth | `AR-ARCH-001` 保持开放 |

`compile/runtime/event/ref/adapter/fake` 的关系分类必须进入 dependency-boundary raw/report；静态 import 表不能冒充实际核验结果。

## 5. Profile 与配置准备矩阵

| profile | 用途 | 允许依赖 | 敏感处理 | 证明上限 |
|---|---|---|---|---|
| `local-dev` | schema/domain/编排和安全负向 | in-memory/test-only、disabled seam | test-only opaque ref/absent；无真实 secret | local contract；不证明 owner/storage/integrity/restore |
| `ci-test` | 可重复 contract/domain/application/infra 负例与 fake parity | isolated deterministic fake/fixture | fixture ref；禁止正文/凭据 | controlled local；不证明 external finality |
| `integration-like` | slot mismatch、degraded、unknown、路由验证 | controlled runtime adapter seam；不进 Cargo graph | opaque target/ref | seam behavior；不承诺 provider 成功 |
| `operations-replay` | pinned operation/job replay、partial、probe/reconcile | 脱敏历史 state/ref、受控 adapter | pinned replay ref；不得 current-config 重建 | replay semantics；不升级状态 |
| `staging-like` | P1/P2 real-like 方向 | future durable/provider/owner seam | future approved secret ref | 不属于当前 P0；合同未闭合仍 blocked |
| `production-like` | P1/P2 生产边界 | formal owner/provider/crypto/storage/receiver | secret-provider ref only | 不声明可用、合规、RTO/RPO 或 readiness |

### 5.1 12 配置域实施前检查

| 配置域 | 主要 boundary | 必须检查 | fail-closed 姿态 |
|---|---|---|---|
| `profile` / `assembly` | 01-b | schema/config identity、binding/surface/optional registry | unknown/duplicate/missing → reject candidate |
| `stores` | 01-b、02-b | local store、UoW、CAS、probe、worker control binding | capability 缺失 → assembly blocked |
| `sources` | 04-a | 8 source class exact binding；workspace Auxiliary | owner/fence/coverage 缺失 → source blocked |
| `authority_visibility` | 03-a/b、04-a | authority、visibility、redaction refs | current source 缺失 → NotAvailable/Blocked |
| `integrity_compatibility` | 05-a/b | capability、target、schema refs | unknown/unsupported → assessment blocked |
| `storage_lifecycle` | 06-a/b | storage、decision、schedule refs | 无 current decision/hold/storage → no effect |
| `restore_receivers` | 07-a/b | owner→receiver/schema registry totality | selected owner 缺 exact receiver → item blocked |
| `inbound` | 06-b | family、trusted schema、route registry | unsupported → reject/quarantine；不 ACK success |
| `operation_cursor` | 02-b、03-b | operation key/input digest、public/private cursor mapping | codec/mapping 缺失 → mutation/continuation blocked |
| `budgets` | 01-b、04～07 | positive request/page/source/bundle/restore/worker/timeouts/retry/probe/lease | 缺失/非法 → fail-fast 或保守 Partial/Blocked |
| `observability` | 01-b、03-a/b、07-b、08 | safe sink、redaction、material handoff ref | sink 可 drop；native/evidence seam 缺失 → blocked |
| `test_deterministic`（测试域） | 所有测试 boundary | fixed clock/id、fault/race schedule、isolated root | fixture 不可用 → test failure；不得 production fallback |

不得在本 Step 填写上述 key 的实际值、secret、provider、算法、阈值或 run id；`04` 中的占位符仍是 schema 形状，不是部署输入。

## 6. Phase / boundary 准备表

| Phase | 开工前必须确认 | 可后置 | 不可用处理 |
|---|---|---|---|
| PH-01 | 目标仓、Core candidate、Rust toolchain、Git identity、六 role、raw/report roots、strict parser shape | real provider、durable store | 目标仓/Core/toolchain 缺失暂停；不创建设计仓实现 |
| PH-02 | in-memory store、fixed clock/id、operation codec/input digest、result/report store | external authority adapters | fake 语义失败→suite failed；codec/UoW blocker→wait_design |
| PH-03 | visibility/actor resolver fake、read session、cursor mapping/ref、redaction profile | capture/effect/receiver seams | visibility/cursor 缺失→Query positive blocked；zero-write 仍必须执行 |
| PH-04 | 8 source binding registry、authority/material negative vectors、coverage/fence fixture、redaction | API/job entry polish | owner contract 缺失→formal blocked；workspace 不得 fallback |
| PH-05 | assessment target/schema carrier、typed outcome/finding、immutable assessment store | production integrity/compatibility provider | capability/schema 未闭合→Unknown/Blocked；不得 Verified |
| PH-06 | governance decision/hold fixture、storage effect/probe fake、inbound schema allowlist | real storage/provider | intent/effect/probe fake 失败→blocked；不盲重派 |
| PH-07 | owner set/receiver registry、material/ref fixture、report/compensation store | real receiver/provider | receiver/material 缺失→per-owner blocked；不 direct write |
| PH-08 | fixed run caller、artifact/report roots、all check/report scripts、named reviewer slots | P1/P2 selected run | 任一 required input 缺失→release blocked；不生成静态 EV |

## 7. Fake / controlled / disabled 边界

| seam | 允许证明 | 不允许证明 |
|---|---|---|
| repository/UoW | absent/exact/CAS/read-set/rollback/local commit-unknown probe semantics | production durability 或 restart finality |
| idempotency/result/report | same/same replay、same/different conflict、完整 result/receipt/report | external effect finality 或 authority |
| source resolver | typed owner/ref/fence/coverage、missing/stale/conflicting/unknown | owner canonical truth、真实正文或正式 export closure |
| integrity/compatibility | typed Unknown/Unsupported/IntegrityFailed/Blocked mapping | Verified/Supported、算法/key/digest/signature truth |
| storage/lifecycle | intent-before-effect、ACK/Committed/Unknown 分轴、probe routing | provider commit/retrieval/retention/delete authority |
| restore receiver | owner/item isolation、mapping drift、partial/unknown/compensation shape | receiver commit、owner DB/import、project restored |
| report generator | raw→report pairing、redaction、digest/link/no-static checks | qualified EV、VETO clean、verdict/signoff/readiness |

## 8. 不可用处理与 Gate 责任

| 场景 | gate 状态 | 处理 |
|---|---|---|
| target repo 不存在 | `blocked` | PH-01 不启动；回写 implementation owner，不创建仓 |
| Core package/path/export/lock 未核验 | `blocked` | 不加入 dependency graph；保留 `AR-ARCH-001` |
| required config/slot missing | `blocked` | 不暴露 facade，不切 fake/default |
| fake/fixture 语义不完整 | `failed` 或 `blocked` | 修复测试 seam 或回写设计；不得宣称 local pass |
| owner/formal contract missing | `blocked` | formal suite 非零；保留 owning blocker |
| P1/P2 dependency unavailable | `not_run`/`blocked` | 记 residual，不污染 P0 |
| artifact/report root missing | `blocked` | gate 不生成或不送验；不写 fallback path |

## 9. 跨配置/依赖审计与停审

| 审计项 | 设计层结论 | 限制 |
|---|---|---|
| 12 domains/55 P0 keys 已被 boundary 覆盖 | 通过 | 实际 schema/value 尚未核验 |
| 六 profile 与 P0/P1/P2 证明上限一致 | 通过 | profile 不等环境/readiness |
| compile/runtime/event/ref/adapter/fake 已分开 | 通过 | actual graph 需 PH-01 重新扫描 |
| fake 不冒 authority/durability/finality | 通过 | 执行期仍需 parity tests |
| target repo / Core / provider / owner seam | blocker | 不由本 Step 关闭 |
| 允许配置化边界 | 通过 | 不得改变 truth/state/no-write/outbound/finality |
| 是否可进入 Step 9 | 是（计划层） | 仍不得实现/测试/提交 |

## 10. 回填草稿、待确认与进入 Step 9 条件

正式 `07` §8 应保留：唯一 Core compile candidate、其余依赖分类、12 域/55 key 的准备摘要、6 profile、Phase 准备、fake/controlled/disabled 证明上限和不可用处理。不得复制 `04` 的完整配置表，不得填真实值、secret、provider 或数字。

| 待确认项 | owner | 截止点 | 当前姿态 |
|---|---|---|---|
| target repo、toolchain、Git identity | implementation owner | PH-01 Design/Worktree Gate | absent/pending |
| Core export/package/version/lock | L0-core owner + implementation owner | PH-01 Design/Build Gate | pending；`AR-ARCH-001` open |
| operation/cursor codec、durable UoW、config schema/numbers、telemetry binding | L4-archive owners | 对应 02/03/08 boundary | `AR-03-LOCAL-001～006` open |
| source/integrity/storage/governance/receiver formal vectors | owning projects | PH-04～07 formal Gate | `AR-UP-001～009` open |
| outbound absence | L4-archive/Bus owner | every Phase and PH-08 | `AR-HLD-Q-001` open; no outbound surface |

本 Step 无新增 owning-project blocker；未创建实现仓、配置、脚本、测试、run、artifact、report、evidence 或 commit。

## 11. 自检与进入下一步条件

- [x] 依赖关系按 compile/runtime/event/ref/adapter/fake 分类。
- [x] 12 配置域、55 P0 key、6 profile、raw/report roots 和 boundary 准备已覆盖。
- [x] fake/controlled/disabled 的证明上限和不可用姿态明确。
- [x] 目标仓/Core/owner/provider/local pending 均保持 blocker；未伪造值或 readiness。
- [x] Step 7 门禁矩阵与本 Step 依赖检查无冲突。

`gate_status = pass_with_blocked_positive_lanes`；`next_allowed_action = create_and_complete_step_09_spikes_risks_open_questions`。
