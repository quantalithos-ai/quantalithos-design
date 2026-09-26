# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6。
> 回填章节：未来正式 `04-配置设计.md` §6「环境、部署 profile 与配置矩阵」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `6 / environment_profiles_matrix` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～5 均 `pass_with_upstream_blockers` |
| 正式 04 写入 | `false`；Step 15 前不得创建 |
| 允许的下一动作 | `enter_step_07_config_items` |
| 实现 / 测试 / commit | `false / false / false` |

本 Step 只建立 profile 的语义矩阵、来源组合、外部依赖姿态、敏感配置边界和下游承接。`local-dev`、`ci-test`、`integration-like`、`operations-replay` 是配置设计语义，不是已创建的部署实例；`staging-like`、`production-like` 只记录未来方向。任何 profile 名都不能关闭 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`，也不能把 fake、ref、ACK、日志或 local result 解释成 capability、accepted、evidence 或 readiness。

## 2. 本步目标与输入

本 Step 回答 local、CI、受控集成、运维重放和未来生产类 profile 如何组合 Step 5 的来源优先级，以及 profile 差异如何交给 05/06/07。它不决定 raw key、JSON schema、环境变量名、secret provider API、真实端点、数据库/消息系统产品、部署命令、容量数值或运维 runbook。

| 输入 | 权威级别 | 本 Step 采用内容 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 当前 04 校准输入 | profile/candidate 控制面、八个 family、composition 和 snapshot 边界 |
| `04_config_step_04_categories_boundaries.md` | 当前 04 校准输入 | startup/cold、job-run-start、entry-local、test-only 和 P0 无 hot update |
| `04_config_step_05_sources_priority_conflicts.md` | 当前 04 校准输入 | `approved default < selected JSON < allowlisted environment`、fail-fast、ref-only 和 unsupported source |
| `03-详细设计.md` §3、§4、§13、§15、§17 | 当前正式直接输入 | TypeScript planned layout、`SyncRuntimeProfileRef`、四态 capability、test-double ceiling、真实依赖 blocker |
| `03_ddd_step_14_config_dependencies.md` §6～§16 | 当前详细设计中间产物 | 八个 config family、adapter composition、route capability、failure 和 forbidden boundaries |
| 当前正式 00～02 | 当前正式上游 | ownership、显式选择、non-overwrite、review/provenance 和依赖裁剪 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | `historical_material / direction_only` | 只吸收 profile 测试/验收方向，不继承旧产品、数字或结果 |
| `L1-governance` 04 Step 6 | 框架参考 | 参考矩阵、依赖、敏感处理和下游承接粒度，不导入 Governance profile truth |

## 3. SOP 问题回答

### 3.1 哪些环境 / profile 适用？

P0 配置契约只定义四个可审查的语义 profile：

- `local-dev`：本地手动调用、探索和局部故障演练；可以使用显式 test composition，但不等价于真实平台接入。
- `ci-test`：可重复的 domain/application/contract/fake-adapter 组合；每次 run 应隔离 local state 和 deterministic provider，但本轮不声称已有 runner 或结果。
- `integration-like`：验证 SDK/Git/filesystem/metadata/diagnostics seam 的接缝和负向姿态；可使用 controlled 或 real-like adapter，但不锁定真实产品，也不添加 sibling source/package dependency。
- `operations-replay`：以脱敏、明确引用的 local history / job input / report carrier 复核 duplicate、partial、unknown、probe 和 bounded jobs；不是生产重放服务，也不自动修复 truth。

`staging-like` 与 `production-like` 仅为 P1/P2 方向标签，不能成为 P0 必过条件、默认 profile 或已部署环境。若后续需要它们进入 current schema，必须先确认真实 adapter、secret provider、运维 owner、部署边界并在 03/04 重新审计。

### 3.2 每个 profile 的来源组合是什么？

所有 profile 继承 Step 5 的普通来源顺序：

```text
approved code-declared default (only when Step 7 marks default_allowed)
  < selected strict JSON candidate
  < allowlisted environment override
```

profile selector 只选择语义 profile；不得根据 `NODE_ENV`、当前目录、Git branch、Project、version、source 或 target 隐式推断。entry-local selector 若被后续协议明确允许，只能选择当前入口的 candidate/profile，不得覆盖已验证 runtime config。test fixture 和 replay input 是隔离的 composition/job input，不是 production-like override。

### 3.3 每个 profile 依赖哪些外部服务或 adapter？

profile 只声明所需的 adapter **姿态**，不宣称具体实现存在：

- `local-dev` / `ci-test` 可以规划 in-memory metadata、typed test double、deterministic Clock/ID/Digest 和 disabled optional operations；这些只能证明本地契约，不能关闭 SDK、source、permission、handoff、physical metadata 或 Git/fs blocker。
- `integration-like` 可规划 controlled/real-like seam，通过既有 ports 注入；依赖合同、schema、权限、source comparator 或 effect probe 未闭合时 capability 仍是 `blocked`/`unknown`。
- `operations-replay` 读取已脱敏的 local carriers 和明确的 replay refs；它不得从当前平台重新猜 source authority，也不得把 report/job result 变成 owner truth。
- `staging-like` / `production-like` 所需 durable store、SDK surface、secret provider、Git/fs tool matrix、handoff/observability endpoint 均未锁定，状态为 `planned / blocked / waiting`。

### 3.4 敏感配置在不同 profile 如何处理？

所有 profile 均只允许 opaque ref。raw token、password、certificate/private key、endpoint credential、provider response、file body、Git stdout/stderr、external body、evidence/report/verdict/signoff/readiness 永远不进入 candidate、snapshot、`.qs-sync`、status、diagnostics 或错误。

- `local-dev` / `ci-test`：只能使用 fake/deterministic ref 或无 secret 的 disabled slot；不得把 fixture material 伪装成 production credential。
- `integration-like`：可以记录 credential、endpoint、handoff destination 的 opaque ref；真实解析、轮换和审计留 Step 8/运维，未解析时保持 `blocked/unknown`。
- `operations-replay`：只使用历史 ref、fake ref 或受控 provider ref；replay carrier 必须脱敏，不保存或回放 raw body。
- `staging-like` / `production-like`：未来只允许 secret-provider ref；具体 provider、注入和轮换不在当前 04 实例化。

### 3.5 哪些 profile 差异交给测试、验收和实施？

profile 差异只提供测试/验收/实施输入，不提前生成结果：

| profile | 05 测试方案输入 | 06 验收方向 | 07/运维输入 | 证据上限 |
|---|---|---|---|---|
| `local-dev` | smoke、显式 blocked/unknown、dirty/non-overwrite 负向切口 | 不作为 integration 或 production gate | 本地 candidate 组织和手动入口 | 无 production evidence/readiness |
| `ci-test` | typed validation、cross-field、UoW fake、query zero-write、idempotency/replay、redaction | P0 local contract gate | test composition、fixture boundary、runner 选择待确认 | 仅设计级 planned，未运行 |
| `integration-like` | adapter mapping、unavailable/degraded、capability classification、handoff ACK≠accepted、Git/fs partial/unknown | 接缝 gate；真实上游合同闭合后才可升级 | adapter registry 和 dependency checks | controlled seam 不能证明生产成功 |
| `operations-replay` | job bounded scope、exact replay、commit/effect unknown、probe/manual、report carrier 完整性 | 运维恢复方向 | replay input、retention/restore 规则待后续 | local replay 不是正式 report/evidence |
| `staging-like` | P1 real-like adapter、secret/provider 和部署验证（未来） | P1/P2 方向 | 产品、挂载、rotation、runbook | 当前 `waiting / blocked` |
| `production-like` | 正式运维与真实 owner/source/handoff 验证（未来） | 非 P0 must-pass | 由部署/运维/ADR 决定 | 当前不生成任何 readiness |

## 4. Profile 选择与共同不变量

### 4.1 选择规则

1. `profileRef` 必须来自严格 candidate 或明确允许的 entry-local selector；不存在“按环境变量名自动猜 profile”的规则。
2. candidate 中的 profile、entry selector 与外部 profile context 若不一致，按 Step 5 冲突规则 reject；不得静默选择更宽松或更高权限的 profile。
3. profile 只能影响 adapter/binding 组合、provider/ref 语境、可用的测试替身和 job/diagnostic 组织；不能改变 command/query DTO、state matrix、owner truth、scope、actor、idempotency、UoW 顺序或 result-layer。
4. 新 profile 必须先定义来源、依赖、sensitivity、capability ceiling、failure posture 和 05/06/07 承接；不能只添加一个字符串或 feature flag。
5. profile 变化是 cold new composition。旧 operation/plan/candidate/attempt 继续引用原 `runtimeBindingSnapshotRef`；不做在途 profile swap。

### 4.2 共同不变量矩阵

| 不变量 | 全部 P0 profile 的要求 | profile 能否改变 |
|---|---|---|
| truth ownership | Project/Artifact/Baseline/Gate/Decision/Workspace projection/Archive/Git remote 仍由 owner 持有 | 否 |
| explicit selection | actor、project、version、source、target 必须显式且可追溯 | 否 |
| capability posture | 只使用 `bound/blocked/unsupported/unknown`；ref/fake 不自动 promotion | 否 |
| query isolation | Query 不持有 UoW/write/lock/probe/handoff/diagnostic-emit | 否 |
| local safety | dirty/untracked/path/symlink/root/lock unknown 时 fail-closed；不覆盖用户修改 | 否 |
| effect/recovery | timeout/partial/unknown 不当作未发生；不盲 retry、merge、rebase、push 或换 key | 否 |
| provenance/metadata | `.qs-sync` 为受控 logical namespace；protected history append-only；raw body/secret 不入库 | 否 |
| review handoff | upload ACK 只表示 transport 层事实，不是 accepted/Decision/readiness | 否 |
| evidence boundary | fake、local commit、job report、telemetry 不是 artifact/report/evidence/verdict/signoff/readiness | 否 |

## 5. 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源组合 | 外部依赖姿态 | 敏感配置处理 | 当前能力上限 |
|---|---|---|---|---|---|
| `local-dev` | 本地手动 command/query/job 与负向安全演练 | selected strict JSON 可选；allowlisted env 可选；approved defaults 仅按 Step 7；entry-local 仅显式 selector/request | planned in-memory metadata、typed test double、disabled/blocked SDK/source/handoff/consumer；Git/fs 只按已核验 adapter | fake/absent opaque refs；禁止 raw material | 可构造 local facade/blocked surface；不证明真实 clone/pull/push-review |
| `ci-test` | deterministic unit/application/contract/fault composition | test JSON + CI-safe env；test fixture 仅 test composition；无 production source merge | planned isolated stores、fixed Clock/ID/Digest、test adapters；real SDK/Git/fs integration 仍 blocked/waiting | fixture refs only；禁止 raw secret/body | 只支持设计级测试切口；不声称 runner、run 或结果存在 |
| `integration-like` | controlled cross-adapter seam 与 failure mapping | JSON + allowlisted env refs；entry-local 仅当前 run | controlled/real-like ports；上游合同未闭合的 SDK/source/handoff/metadata/Git/fs capability 保持 blocked/unknown | credential/endpoint/destination opaque refs；resolver unavailable 不 fallback | 可验证 adapter boundary 设计；不等于 production integration |
| `operations-replay` | 显式重放 local job/run/attempt/result carrier | replay JSON + allowlisted env + explicit job/replay refs |脱敏 local history、replay store、controlled/fake adapters；不猜远端 truth | historical/fake refs；禁止 raw historical body | 可设计 exact replay/partial/unknown 检查；不自动 repair 或提交外部 effect |
| `staging-like` | 未来 P1 pre-production 接缝 | deployment/operations source（未定义） | future durable store、approved SDK/source/handoff/observability/Git/fs | future secret-provider refs only | `planned / blocked / waiting`；非 P0 gate |
| `production-like` | 未来 P1/P2 生产运维语境 | deployment/operations source（未定义） | future approved products/endpoints/owner contracts | future secret-provider refs only | 只记录演进方向；没有实例、测试、readiness 或 signoff |

## 6. 外部依赖与 capability ceiling 矩阵

| Profile | metadata / `.qs-sync` | SDK owner/source/handoff | Git / filesystem | diagnostics / Clock-ID-Digest | operations Consumer/Job |
|---|---|---|---|---|---|
| `local-dev` | logical adapter 可规划；physical schema/atomic/crash proof 未闭合则 mutation `blocked` | fake/disabled/blocked；不提供 owner/source truth | typed observation/apply seam；unsafe/unknown `blocked`；不启用 remote/LFS/shallow/GUI | deterministic or local provider planned；sink failure isolated | nullable/blocked；显式 job only，不启动 daemon |
| `ci-test` | test double 只验证 logical UoW/version/replay mechanics；不证明 physical backend | test double 可覆盖 negative mechanics；positive owner/source/handoff 仍 blocked | test double 可模拟 clean/dirty/partial/unknown；不证明 host tool | fixed provider planned；redaction must remain strict | planned test handlers；不注册 private topic |
| `integration-like` | controlled durable-like seam；`SYNC-UP-006` 未关闭则不标 `metadata_atomic_write=bound` | controlled/real-like adapter；`SYNC-UP-001~005/008` 未关闭则 route blocked/unknown | controlled adapter；`SYNC-UP-007/009/010` 未关闭则 no unsafe apply | controlled sink/ref；不生成 evidence/readiness | formal consumer/job contract 未闭合则 blocked |
| `operations-replay` | replay carrier 必须 exact/脱敏；不从 current config 重建旧 snapshot | replay refs/fake read only；不重新提交 handoff/probe effect | replay observations only；不自动 apply/merge/rebase | replay-safe redaction；diagnostic failure 不改变 result | explicit bounded jobs；不扩大 scope或修复 truth |
| `staging-like` | future approved adapter | future approved SDK/owner/source/handoff | future approved tool matrix | future approved sink/providers | future formal registrations |
| `production-like` | future approved physical metadata | future approved contracts and secret resolution | future approved local tool policy | future operations controls | future scheduler/runner only after separate contract |

矩阵中的 `planned`、`blocked`、`waiting` 是设计状态，不是实现、运行或测试结果。任何 profile 的 test double 都必须在 snapshot/输出中保留 test-double ceiling，不能输出 integration evidence 或 readiness。

## 7. Profile 配置来源矩阵

| Profile | approved default | strict JSON candidate | environment override | entry-local selector/request | fixture / replay input | secret/provider ref |
|---|---|---|---|---|---|---|
| `local-dev` | 仅使用 Step 7 明确允许的非敏感 default | 可选但显式；缺失 required leaf 仍 fail-fast | 可选、allowlisted、非法即 fail-fast | 当前命令/查询的显式选择；不覆写 runtime family | 仅显式 test composition | fake/absent ref；无 raw secret |
| `ci-test` | 仅 approved test-safe default | test candidate；具体 suite override 留 05/07 | CI-safe ref/selector；不接 production secret | run-scoped input、fixture selector | 显式 required for deterministic test composition | fake/deterministic ref only |
| `integration-like` | 只提供 approved baseline，不暗示 external readiness | required candidate | allowlisted adapter/profile refs | current integration scenario / bounded job input | optional controlled scenario；不得伪造 owner body | opaque credential/endpoint/destination refs |
| `operations-replay` | approved baseline only | required replay candidate | replay-safe refs | required explicit run/job/replay selector | required redacted carrier refs | historical/fake/provider ref only |
| `staging-like` | future decision | future deployment candidate | operations-controlled refs | restricted explicit operator input | forbidden | future secret-provider ref |
| `production-like` | future decision | future deployment candidate | restricted operations-controlled refs | restricted and audited outside current 04 | forbidden | future secret-provider ref only |

所有 profile 都遵守：source 缺失按 Step 5 的 required/default 规则处理；source 存在但非法不回退；secret raw value、provider payload 和 forbidden body 永不进入 candidate。

## 8. 敏感配置与 profile 处理矩阵

| 敏感材料类别 | `local-dev` | `ci-test` | `integration-like` | `operations-replay` | `staging-like` / `production-like` |
|---|---|---|---|---|---|
| credential / token / certificate / private key | 不提供；仅 fake/absent ref | 不提供；仅 deterministic ref | 仅 opaque provider ref；材料解析待 Step 8 | historical/fake/provider ref；不保存材料 | 仅 future secret-provider ref；具体注入待运维 |
| endpoint / destination | 不写 raw endpoint material | 不写 raw endpoint material | 仅 opaque endpoint/destination ref | 仅 opaque replay target ref；默认不发外部 effect | future approved ref only |
| provider response / external body | 禁止 | 禁止 | 禁止进入 config、snapshot、metadata、status、diagnostics | replay 前必须脱敏；禁止 raw body | 禁止进入普通配置 |
| redaction policy | strict planned policy；不能 relax | strict deterministic policy | strict policy；unsafe change reject | replay-safe policy | future approved policy; no hot relax |

## 9. 测试、验收、实施与运维承接

| 下游 | profile 输入 | 明确不承接 |
|---|---|---|
| 正式 05 | profile-specific source/capability/failure matrix；`ci-test` 的 planned cuts；`integration-like` 的 blocked/unknown/partial cuts；`operations-replay` 的 replay cases | 不把 profile 名当 test run、fixture、结果、coverage、artifact 或 evidence |
| 正式 06 | P0 profile 的 config validity、forbidden-field、no-fallback、capability ceiling、profile isolation gate | 不把 fake/controlled seam 当 production accepted/readiness |
| 正式 07 | 每个 profile 的 loader/validator/composition、test-double registry、adapter boundary、secret/ref handoff 的 planned batch | 不创建实现 ledger、boundary skeleton、部署命令、commit 或真实环境实例 |
| 运维/部署（未来） | staging/production 的文件挂载、secret provider、rotation、endpoint、runbook | 不回写当前 P0 schema 或绕过 03/04 boundary |

## 10. Profile 停审记录

| Profile / 类别 | 来源组合 | 外部依赖姿态 | 敏感边界 | 03 影响检查 | 停审结论 |
|---|---|---|---|---|---|
| `local-dev` | Step 5 顺序；显式 local candidate | fake/disabled/blocked，不宣称真实 capability | fake/absent ref only | 复用 `profileRef` 与四态 snapshot | 通过（带上游 blocker） |
| `ci-test` | test candidate + CI-safe env + test fixture isolation | deterministic test composition only | no raw secret/body | 不新增 test runtime type 或 runner | 通过（带上游 blocker） |
| `integration-like` | JSON + allowlisted env refs | controlled/real-like；positive surface 受 blocker | opaque refs only | 复用 adapter slots/capability classification | 通过（上游 blocker） |
| `operations-replay` | replay candidate + explicit replay/job refs | local carrier replay；no external effect | redacted refs/carriers | 复用 jobs/result/snapshot refs | 通过（带上游 blocker） |
| `staging-like` / `production-like` | future operations source | not instantiated | future provider refs | 不进入 P0 runtime enum/schema | 通过（方向性；当前 waiting） |

逐 profile 停审结论：每个 current profile 都有唯一来源组合、外部依赖姿态、敏感处理、测试/验收承接和 capability ceiling；未来 profile 未被写成当前实例。profile 只改变 composition 语境，不改变 truth、state、transaction、visibility、idempotency 或 safety 不变量。

## 11. 跨 profile 审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| local / CI / integration-like / replay 是否覆盖 P0 需要的差异 | 通过 | 四个语义 profile 已覆盖本地、确定性、接缝和恢复重放 |
| staging / production 是否被误写成 P0 must-pass | 无 | 仅 P1/P2 direction，状态 waiting/blocked |
| fake 是否被当作真实 SDK/source/Git/fs/metadata 成功 | 无 | test-double ceiling 明确；正向能力仍受 `SYNC-UP-*` |
| profile 是否能隐式选择 project/version/source/target | 不允许 | `profileRef` 只表达语境；entry input 仍显式 |
| profile 是否能改变 state/UoW/idempotency/query/review 语义 | 不允许 | 共同不变量矩阵固定 |
| raw secret/body 是否因环境不同而放宽 | 不允许 | 全 profile ref-only/redacted |
| source priority 是否在不同 profile 漂移 | 无 | 统一继承 Step 5；fixture/replay 是隔离输入，不是普通 override |
| operations replay 是否自动 repair、resubmit 或扩大 scope | 不允许 | explicit bounded job；unknown/manual/probe 保留 |
| 是否引入 sibling source/package/Cargo dependency | 无 | 所有 profile 仅经既有 port/adapter seam |
| 旧 README/05/06 是否成为 profile truth | 无 | 仅 historical/direction input |
| 是否需要回写 03 | 未发现 | 只使用既有 `SyncRuntimeProfileRef` 和 capability snapshot |

## 12. 对详细设计的影响判定

| profile 结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 使用四个语义 profile，staging/production 仅方向 | 否 | 配置矩阵分类，不新增 runtime enum | 不适用 | `无回写` |
| 所有 profile 继承 Step 5 来源顺序和 Step 4 冷生效边界 | 否 | 复用现有 loader/composition/lifecycle | 不适用 | `无回写` |
| profile 只改变 adapter/ref/test composition 语境，不改变 domain/owner truth | 否 | 重申已有 ownership 和 capability invariant | 不适用 | `无回写` |
| integration/replay 维持 blocked/unknown、无 fake promotion 或自动 effect | 否 | 继承四态 capability、unknown/recovery 和 evidence boundary | 不适用 | `无回写` |
| 若生产 profile 需要动态替换 adapter、真实 endpoint schema、secret hot rotation 或新 scheduler | 是（未来触发） | 改变 runtime config/builder/adapter lifecycle 或 operations contract | `03` §4/§13、Step 14 | 当前不触发；变更前必须回流 |

当前计数：`待回写=0`；`阻塞待确认=0`。上游和本地 blocker 影响 profile 的 positive capability，不影响本 Step 的矩阵设计。

## 13. 回填草稿（未来正式 §6）

正式 `04-配置设计.md` §6 应回填：P0/P1/P2 profile 总表、外部依赖矩阵、来源矩阵、敏感配置处理矩阵、测试/验收/实施承接、profile 停审和跨 profile 审计。

正式正文必须保留：

- `local-dev`、`ci-test`、`integration-like`、`operations-replay` 是 P0 语义 profile，不是已部署实例；`staging-like`、`production-like` 不属于 P0 must-pass。
- 所有 profile 统一使用 Step 5 的普通 source precedence；profile 不根据目录、branch、Project 或 `NODE_ENV` 隐式选择。
- test double 只证明 local contract / deterministic mechanics；不关闭 SDK、source、permission、metadata、Git/fs、handoff 或 probe blocker。
- profile 不能改变 Project/Artifact/Baseline/Gate/Decision/Workspace/Archive/Git remote ownership、状态/事务/幂等/query/safety/review/evidence 红线。
- raw secret、endpoint/body、provider payload、文件正文、Git 输出和 readiness claim 永不进入配置或 snapshot；真实 secret provider、产品和部署操作留后续文档/运维。

本节不写真实产品、端点、部署命令、CI run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。

## 14. 待确认事项

| 事项 | 影响 | 当前姿态 | 归属 |
|---|---|---|---|
| profileRef 的最终 raw key / profile registry 形式 | Step 7 配置项和 Step 9 validation | 只固定语义 profile；不新增 enum 或实例 registry | 04 Step 7/9 |
| `ci-test` runner、fixture store 和 deterministic adapter 实现 | 测试执行边界 | planned/not_created；不声称 run/result | 05/07，`SYNC-LOCAL-004` |
| integration-like 的真实/controlled adapter 选择 | positive capability | controlled seam；上游合同未闭合保持 blocked/unknown | `SYNC-UP-001~010`、07 |
| operations-replay carrier、retention 和 restore 规则 | replay 可复核性 | 仅引用 typed local carrier；物理 metadata 未锁 | `SYNC-UP-006`、04 Step 12/13、07 |
| staging/production 的产品、secret provider、endpoint、运维 owner | P1/P2 实例化 | 方向性 waiting；不进入 P0 schema | 未来 ADR/运维/07 |
| 是否需要 profile-specific source overlay 或动态切换 | 新 loader/lifecycle contract | P0 不支持；需先回流 03 | 未来需求/03/04 Step 13/14 |

这些事项属于后续 Step 或真实上游确认，不构成当前 `03` 回写或 Step 6 阻塞；本 Step 可以进入 Step 7。

## 15. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| local/CI/integration-like/operations-replay profile 均有用途、来源、依赖、敏感处理和差异 | pass |
| staging-like/production-like 已明确为 future direction，不是 P0 must-pass | pass |
| 所有 profile 继承 Step 5 precedence，缺失/非法/unsupported 策略可判定 | pass |
| profile 不能隐式选择业务对象或改变 ownership/state/UoW/idempotency/query/review 语义 | pass |
| fake/test/replay 不被写成 real integration、artifact、report、evidence 或 readiness | pass |
| raw secret/body/provider payload 在所有 profile 均禁止 | pass |
| 每个 profile 的外部依赖 capability ceiling 和 upstream blocker 已登记 | pass_with_upstream_blockers |
| 测试/验收/实施/运维承接边界清楚，未提前创建下游事实 | pass |
| 03 影响判定无待回写、无阻塞待确认 | pass |
| 未创建正式 04、未创建 Step 7 以后的文件、未实现/测试/提交 | pass |

### Step 6 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_07_config_items.md`。正式 `04-配置设计.md` 仍保持不存在，直到 Step 15。
