# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节：`05-测试方案.md` §14

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 回归策略与残余风险 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 变更触发可判定回归；未覆盖风险必须有 owner、影响和触发条件 |
| 停审结论 | P0 全量集、最小回归规则和 residual 表可被 `06/07` 消费 |

## 2. 回归触发表

| 变更类型 | 最小回归集 | 全量 P0 触发条件 | 责任 owner |
|---|---|---|---|
| `contracts` ref/DTO/error/schema | contract-domain-fast、entry-worker-job | public field/enum/version、redaction 或 protocol 分母变化 | contracts owner |
| domain object/policy/state | contract-domain-fast、service-flow-fast | state axis、owner、invariant、generation 或 static boundary 变化 | domain owner |
| command / application flow | service-flow-fast、release-main-smoke | UoW 写集、sidecar、idempotency、phase 变化 | application owner |
| query / projection / history | service-flow-fast、operations-replay-core | no-write、cursor、projection source 或 visibility 变化 | application/query owner |
| consumer / worker / publisher | entry-worker-job、operations-replay-core | envelope、receipt、outbox snapshot、handoff layer 变化 | worker owner |
| jobs / selector / report | entry-worker-job、operations-replay-core | job authorization、stable key、report schema 或 no-truth-repair 变化 | jobs owner |
| persistence / UoW / store | infra-runtime-fake、service-flow-fast | revision、rollback、cursor、logical owner、atomicity 变化 | infra owner |
| adapter / sibling seam | infra-runtime-fake、negative boundary suites | error mapping、availability、exact contract、source body boundary 变化 | adapter / contract owner |
| config / profile / secret | config-redline、redaction-boundary、release-main-smoke | static boundary、source priority、builder、sensitive class 或 activation 变化 | config owner |
| observability / artifact / report | redaction-boundary、dependency-boundary、report audit | evidence schema、path、redaction、digest 或 gate behavior 变化 | test/evidence owner |

## 3. 全量 P0 回归集

全量 P0 回归至少包括：

1. `contract-domain-fast`
2. `service-flow-fast`
3. `infra-runtime-fake`
4. `entry-worker-job`
5. `operations-replay-core`
6. `config-redline`
7. `redaction-boundary`
8. `dependency-boundary`
9. `release-main-smoke`
10. artifact/report pairing、no-static-evidence、evidence index integrity checks

全量回归仍需为每次运行生成新的固定 `run_id`；不得覆盖旧 run 或引用 `latest`。

## 4. 最小回归选择规则

| 触发风险 | 必选切口 |
|---|---|
| subject / intent / decision | `TC-INTENT-*`、`TC-DECISION-*`、`TC-IDEMP-001~003` |
| qualification / assembly / readiness | `TC-QUAL-*`、`TC-ASSEMBLY-*`、`TC-CONFIG-*` |
| registration / endpoint / session | `TC-REG-*`、`TC-SESSION-*`、old-generation feedback |
| health / recovery / restart | health state、`TC-IDEMP-005~008`、operations replay |
| closure / cleanup / residual | close、cleanup feedback、`TC-JOB-003/004/007` |
| material / outbox / projection | `TC-MATERIAL-001`、`TC-JOB-005/006`、cursor separation |
| query / job no-write | query write audit、job no-truth-repair |
| config / secret / output | config-redline + redaction-boundary |
| dependency / evidence | dependency-boundary + report audit |

## 5. 残余风险表

| 风险 | 未覆盖 / 受限原因 | 影响 | 缓解 / 触发条件 | 接受人 |
|---|---|---|---|---|
| `MSVC-UP-001` Runtime entry/session/handoff exact contract | 对端未闭合 | Runtime 正向 session / execution handoff 不能判定 | 保持 placeholder/blocked；合同闭合后重开 protocol/environment/evidence | Runtime + member-service owner（待确认） |
| `MSVC-UP-002` Member launch/register/heartbeat/status | 字段、IPC、credential context pending | 注册/健康真实正向联调 waiting | 只测 safe input、非法/迟到/重放；正式合同闭合后 selected integration | Member + member-service owner |
| `MSVC-UP-003` Images pinned manifest/ref/verification | exact supply contract pending | image qualification / readiness positive blocked | mutable/不可验证输入负向；合同闭合后补 fixture 与 integration | Images + member-service owner |
| `MSVC-UP-004` Sandbox binding/release/cleanup | schema/caller/backend pending | isolation / cleanup positive blocked | required binding no-fallback；合同闭合后补 controlled integration | Sandbox + member-service owner |
| `MSVC-UP-005` policy propagation owner | 当前无正式 FR / contract | 不构造 policy positive test | 若正式纳入范围，先回写 `00~04` | 架构 / governance owner |
| `MSVC-UP-006` launch credential signer/revoke | owner/provider pending | credential positive qualification blocked | opaque ref、不保存正文、不复用；owner 闭合后补 | security / member owner |
| `MSVC-UP-007` Core/Bus event family/route/receipt | exact schema pending | publication/delivery/feedback positive blocked | topic-neutral candidate、no inference；schema 闭合后补 | Core/Bus owner |
| `MSVC-UP-008` SDK compile target/self-test | target pending | compile evidence unavailable | 只保留 dependency classification；target 闭合后补 gate | SDK owner |
| production-like durable / capacity / SLO | product/workload/authority 未定 | 无硬性能或容量判定 | candidate metrics；authority + workload 后转 P1/P2 | 架构 / 运维 |
| observability backend / retention / alert | backend 未定 | physical retention/alert 不可验 | 只验 safe local output；产品确定后补 | 运维 / observability |

## 6. 不可风险接受项

以下事项不得以任何角色的风险接受替代修复或重新设计：

- VF-MS-001~009 任何实际违反。
- forbidden body / secret / credential / endpoint / manifest 泄漏。
- 非项目主语或未授权输入创建、迁移、停止或重启宿主。
- Query 写入、Job 创建授权 / decision / generation、projection 反写 source。
- duplicate / unknown 盲重放不可逆动作、第二 current host、历史抹写。
- fake / placeholder / planned / blocked 被记为真实 ready、evidence、verdict 或 signoff。

## 7. 必须转入新版 `06-验收标准.md` 的事项

| 事项 | 交给 `06` 的内容 |
|---|---|
| P0 core / redline | 证据族、VF 引用、阻断条件和不可降级规则 |
| MSVC-UP positive blocked | 正向验收的 waiting / blocked 限制，不得判 ready |
| P1/P2 residual | 风险接受人、触发条件、selected-run 要求 |
| evidence integrity | raw artifact/report pairing、redaction、no-static-evidence |
| performance candidate | authority、workload、环境、统计口径齐备后才可量化 |

## 8. 回归 / residual 停审与回填草稿

| 审计项 | 结论 |
|---|---|
| 变更类型均有最小回归 | pass |
| 全量 P0 回归集清楚 | pass |
| 未覆盖风险有 owner / 触发条件 | pass_with_upstream_blockers |
| 不可风险接受项明确 | pass |

正式 §14 应写回归触发表、全量 P0 集、最小选择规则、残余风险、不可接受项和 `06` 承接；不填写实际回归结果或风险签署。

- [x] 回归可被实施计划引用。
- [x] residual 不隐藏 blocker。
- [x] 可进入 Step 15。
