# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节：`05-测试方案.md` §14
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 定义 Console 的设计、实现、配置、依赖和测试证据变化如何触发最小或全量 P0 回归，并集中登记当前不能形成 positive verdict 的风险。它不执行回归、不填写缺陷状态、不接受风险，也不替代新版 06 的验收裁决。

回归集合只覆盖客户端模块/协议/状态/adapter/carrier/config/a11y/diagnostic 和 evidence boundary；不引入 Console 不拥有的 DB、repository、UoW、outbox、worker、job、服务端 replay 或 owner 业务内部测试。

## 2. 输入与固定原则

| 输入 | 用途 |
|---|---|
| Step 6 | 96 个 TC、required/conditional/blocked posture |
| Step 9 | PR/main/nightly/release/selected suites 与 planned checks |
| Step 10 | 非功能、安全、redaction、dependency、a11y 和结构性 sample |
| Step 11 | S/A/B/R、复验触发和不可接受项 |
| Step 12 | 进入、退出、暂停和环境 unavailable 规则 |
| Step 13 | 固定 run 的 artifact/report/evidence 归档合同 |
| 03 Step 18 / 04 Step 14 | `CON-Q-034～047`、实现与配置 blocker |

固定原则：原失败 TC 必跑；同 family 正/负/边界代表必跑；相邻 suite 与红线 check 随影响运行；每个未来回归使用新显式 run_id 并按 Step 13 归档；P1/selected unavailable 不能替代 P0 或计入 positive EV。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些变化触发最小回归？ | 局部模块、Port/adapter、状态、配置、diagnostic/a11y、suite/report 变化至少触发受影响 TC family、primary suite 和相邻红线 check。 |
| 哪些变化触发全量回归？ | truth/authority boundary、5+16+1 inventory、状态/phase、unknown/no-replay、state scope、四项配置、redaction/dependency/evidence schema、release blocking 分类或任一 S 级修复。 |
| 哪些暂不覆盖？ | exact owner positive、observed invalidation、configured durability、具体 browser/AT、production diagnostic、正式数字阈值、未停审 L5/L6 link 和真实 implementation runner。 |
| 谁接受 residual？ | 当前不接受；按 owner/SDK、产品、架构、测试、运维、验收或相邻项目维护者列待确认角色，必须在新版 06/未来 acceptance review 中明确。 |
| 哪些必须转入 06？ | blocked positive 的裁决上限、P1 selected 是否强制、量化/兼容门槛、证据保留期、风险接受角色、VETO 证据充分性与 production readiness 禁止推导。 |

## 4. 变更类型 → 最小回归集

| 变更类型 | 最小 TC / Suite / Check | 全量 P0 触发 | 责任角色 |
|---|---|---|---|
| requirement / AC / VETO | 受影响 family + release safety + traceability review | 任一 C/FR/BR/DR/IF/DEP/NFR/AC/VETO 语义变化 | 产品/设计 + 测试 |
| `entry/access/navigation` | CTX/NAV/SEC；pure-contract/module-flow/semantic-a11y | context/visibility/qualification/disclosure 上限变化 | 客户端 + 安全 |
| `views` / 16 Query | VIEW/ADAPTER；module-flow/port-adapter/redaction | Query surface、safe-field、source axes、zero-write 变化 | 客户端 + owner/SDK |
| `intent` / 5 Command | INTENT/CONSISTENCY；module-flow/port-adapter/concurrency | submit/result/reconcile/dispatch/unknown/no-replay 变化 | 客户端 + command owner |
| eight topic composition | TOPIC/SEC/RECOVERY；controlled-composition/recovery | owner set/order/activation/strict-empty/partition isolation 变化 | 客户端 + affected owners |
| recovery/error/a11y | RECOVERY/A11Y；recovery-matrix/semantic-a11y/redaction | error union、recovery ceiling、core semantic action 变化 | 客户端 + 测试/a11y |
| Port/adapter/SDK binding | ADAPTER + affected protocol family；port-adapter/architecture | public contract、owner mapping、private dependency boundary 变化 | SDK/owner + 客户端 |
| conditional invalidation | ADAPTER-005/006、CONSISTENCY-008；concurrency/architecture | envelope/order/dedup/apply 语义首次启用或改变 | SDK + 客户端 |
| carrier/state scope | STATE/CONSISTENCY；pure-contract/concurrency/composition | medium/scope/TTL/migration/whole-record/single-writer 变化 | 客户端 + 架构/config |
| diagnostics/redaction | DIAG/SEC；redaction/report audit | envelope whitelist、sink、forbidden corpus、scan scope 变化 | 客户端 + observability/security |
| 四项配置/profile | CONFIG + ADAPTER-004/005；config-redline/architecture | key/default/profile/source/lifecycle/failure/rollback 变化 | config + 客户端 |
| module/protocol/dependency graph | ARCH；architecture-static/release-dependency | 10 modules、5+16+1、0 Event/Job、唯一 owner write 变化 | 架构 + 客户端 |
| suite/gate/blocking 分类 | changed suite + report-pairing/no-static-evidence | PR/main/nightly/release blocking topology 变化 | 测试 tooling/release |
| artifact/report/evidence schema | report-pairing/no-static + representative source suite | evidence fields、pairing、digest、acceptance draft 变化 | 测试 tooling + 验收 |
| S 级缺陷修复 | 原失败 TC + same family + related suite/check | 一律全量 P0 | 缺陷 owner + 测试 |

## 5. 全量 P0 回归触发与集合

以下任一条件要求未来执行全量 P0：七项 VETO 相关变化/修复；owner truth 或 Policy/Gate 边界变化；5 Command/16 Query/consumer inventory 或唯一 owner write 变化；formal/local phase、unknown/no-replay、state scope/positive recovery 变化；四项配置或三 profile 变化；redaction/dependency/report pairing/no-static-evidence 变化；release blocking 分类变化；任一 S 级缺陷修复。

全量集合至少包含：

- `console-pure-contract`
- `console-module-flow`
- `console-config-redline`
- `console-architecture-static`
- `console-port-adapter`
- `console-controlled-composition`
- `console-semantic-a11y`
- `console-redaction-boundary`
- `console-concurrency-race`
- `console-recovery-matrix`
- `console-report-pairing-audit`
- 五个 release safety/config/redaction/dependency/report suites/checks
- Step 13 的 report generation、pairing、redaction、no-static-evidence 与 review-ready acceptance draft

blocked positive 与 selected suite 不因全量回归而自动解锁；仍按对应 authority 判定 `blocked/not_run_environment_unavailable`。

## 6. S 级修复与特殊变更回归

| 触发 | 强制回归 |
|---|---|
| context/permission bypass | CTX/NAV/SEC/INTENT + full P0 + release safety/redaction |
| Query write 或第二 owner write | VIEW/ARCH + full P0 + architecture/release dependency |
| unknown replay/phase elevation | INTENT/STATE/CONSISTENCY + full P0 |
| forbidden body/secret/full ref 泄露 | leak corpus + affected suite + full redaction/report audit + full P0 |
| partition failure 扩散/掩盖 | TOPIC/SEC/RECOVERY + composition/recovery + full P0 |
| config silent fallback/partial protected runtime | CONFIG/ADAPTER + config/redaction + full P0 |
| static evidence/run mismatch/orphan report | affected source suite + pairing/no-static/report generation + full P0 |
| dependency bypass/protocol drift | ARCH/ADAPTER + architecture/release dependency + full P0 |

配置、redaction、dependency 或 evidence 变更即使没有已知缺陷，也必须按上表相关项和 §5 的触发规则回归；不得只运行生成脚本而跳过来源 suite。

## 7. 残余风险表

| 风险 / blocker | 未覆盖原因 | 影响 | 当前缓解与触发 | 接受/确认角色 |
|---|---|---|---|---|
| `CON-Q-034` exact owner/SDK Query/Command/Result/Ref/activation | formal schema 未闭口 | positive adapter、submit、active posture不能证明 | safety/no-call/blocked P0；合同到达重开 03/05 并跑 selected/full | owner + SDK + 验收待确认 |
| `CON-Q-035～037` scope/visibility/qualification/safe-field | authority 未闭口 | positive disclosure/action/read view 无完整证据 | fail-closed/minimum disclosure；到达后 contract + security 回归 | identity/Policy/Gate/owners |
| `CON-Q-038` reconciliation/idempotency/dispatch | formal boundary 未闭口 | positive reconcile/submit 仍 blocked | ambiguous→unknown、no replay；到达后 INTENT/CONSISTENCY/full | command owner + SDK |
| `CON-Q-039～043` 专项 owner seams | 各 owner surface 未停审完整 | 八主题 positive/material/action 不完整 | per-owner pending/read-only/partial；逐 owner到达后 selected | 对应 owner + 验收 |
| invalidation envelope/order/dedup | SDK event contract 未闭口 | observed/apply 正向不能证明 | disabled/zero-write；首次启用触发全量 P0 | SDK + 客户端 |
| `CON-Q-044` state medium/TTL/migration | 产品/架构未定 | 无 durable/cross-session 保证 | session-volatile/exact-scope；变更先回 03/04/05 | 产品 + 架构 + config |
| `CON-Q-046` browser/AT matrix | 具体组合未定 | 只证明语义，不证明兼容性 | semantic P0；authority 到达跑 selected matrix | 产品 + 测试 + 验收 |
| `CON-Q-046` diagnostic envelope/sink | production authority 未定 | 不证明 production telemetry binding | disabled/body-free fake；sink 到达后 redaction/selected | observability + 运维 |
| `CON-Q-045` quantitative authority | 无场景/环境/窗口/阈值 | 无 latency/load/SLO verdict | structural duration/count sample only | 产品 + 架构 + 测试 + 运维 |
| `CON-Q-047` 未停审 L5/L6 links | 双方合同未停审 | peripheral deep-link 正向未覆盖 | disabled/no mainline dependency；双方停审后重审 | 相邻项目维护者 |
| framework/router/bundler/package manager/runner 未定 | 目标实现仓不存在 | 无真实 compile/browser/CI 运行证据 | framework-neutral planned suite；07/实施前确认 | 客户端/实施负责人 |
| implementation repo 不存在 | 无代码、runner、CI/environment | 当前全部 suite 不可实际执行 | 保持 planned/not_created；不得造 run/evidence | 实施负责人 + 验收 |
| evidence retention 天数未定 | 属运维/归档 policy | 无长期保留承诺 | 保留至验收和复验关闭；数字转 06/运维 | 验收 + 运维 |

## 8. 不可风险接受项

| 项 | 处理 |
|---|---|
| `VETO-CON-001～007` 任一命中 | 必须修复并全量 P0；不得签署风险接受 |
| DB/private API/bus/sibling source、第二 truth 或 Query write | 必须修复；architecture/dependency + full P0 |
| context/visibility/qualification bypass | 必须修复；security/access + full P0 |
| receipt/toast/cache/diagnostic 伪完成或 unknown replay | 必须修复；intent/state/consistency + full P0 |
| forbidden body/secret/full ref 进入对象、state、log、artifact/report | 必须修复；redaction + full P0 |
| UI/flag/threshold/partial result 推导 verdict/active/readiness | 必须修复；flow/composition/security + full P0 |
| semantic a11y 核心路径不等价 | 必须修复；a11y/recovery + full P0 |
| owner partition failure 扩散或被掩盖 | 必须修复；composition/recovery + full P0 |
| config silent fallback/partial runtime/profile 冒充 ready | 必须修复；config/release + full P0 |
| 静态证据、缺 artifact/report pair、run mismatch 或伪 signoff | 必须修复；report audit + source suites + full P0 |

## 9. 必须转入新版 06 的事项

| 事项 | 新版 06 应收口 |
|---|---|
| AC/VETO 与 future EV 的充分性 | 固定每项 required evidence family、blocked/failed 判定和不得替代项 |
| blocked positive 验收上限 | 明确 safety pass 不等 formal positive、production integration 或 readiness |
| P1 selected owner/browser/AT 是否强制 | 指定 release 条件、环境不可用处理和证据要求 |
| quantitative hard threshold | 若需要，定义场景、数据量、窗口、环境、阈值和责任人 |
| risk acceptance | 固定允许范围、角色、签署条件；P0/VETO/S 仍不可接受 |
| evidence retention/review/signoff | 固定保留期、归档介质、审查人与签署边界 |
| production-pending | 明确它只表示配置姿态，不能作为生产 readiness 证据 |
| implementation repo/runner unavailable | 未实施时只能 blocked/not-run，不能用设计自审替代执行 |

## 10. 回归证据归档

| 回归类型 | Step 13 归档要求 |
|---|---|
| 最小回归 | 新 run_id、scope、source refs、suite artifacts/reports、evidence index |
| 全量 P0 | 完整 run report、全部 blocking suite/check、acceptance draft 与 review-ready risk list |
| S/A 缺陷复验 | failed run + fixed run + 原 TC + same-family/suite/check + 防回归决定 |
| selected/conditional | authority ref、selected environment、blocked/unavailable 不贡献 positive EV |
| residual review | `reports/acceptance/risk-acceptance.md` 与 `reports/review/*`；不替代 06 裁决 |

每次未来回归均不得覆盖旧 run，也不得引用 `latest`；没有真实 artifact/report pair 就没有 evidence instance。

## 11. 跨回归与风险审计

| 审计项 | 结论 | 依据 |
|---|---|---|
| P0 变更是否都有最小回归 | pass | §4 |
| 全量触发与集合是否明确 | pass | §5 |
| S/config/redaction/dependency/evidence 是否特殊闭合 | pass | §6 |
| residual 是否有原因、影响、缓解和确认角色 | pass | §7 |
| 是否存在可接受 P0/VETO/S | pass；不存在 | §8 |
| 是否把 unavailable/blocked 写成 pass | pass；禁止 | §5、§7、§10 |
| 是否把旧阈值或 production-pending 当 readiness | pass；禁止 | §7、§9 |
| 是否迁入服务端回归模型 | pass；无 DB/UoW/outbox/worker/job suite |
| 是否可由 06/07 消费 | pass | §4～§10 |

## 12. 回填草稿与门禁

正式 §14 应回填变更→回归矩阵、全量集合、S 与特殊变化、残余风险、不可接受项、06 转入项与 Step 13 归档规则。

> 校准来源：`design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：建议继续阅读本文件的“变更类型 → 最小回归集”“全量 P0 回归触发与集合”“S 级修复与特殊变更回归”“残余风险表”“不可风险接受项”和“必须转入新版 06 的事项”。

| 进入 Step 15 条件 | 结论 |
|---|---|
| 最小/全量回归可判定 | pass |
| residual 与不可接受项分离 | pass |
| 06/07 承接入口明确 | pass |
| 回归证据与 Step 13 闭合 | pass |

Step 14 `done / pass / self_reviewed`；未执行回归、未接受风险、未生成 run/artifact/report/evidence/verdict/signoff/readiness。
