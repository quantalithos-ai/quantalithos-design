# Step 9. 定义非功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填位置：正式 `06-验收标准.md` §9

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 9 / nonfunctional |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收范围 | `AC-SYNC-015~020` 与跨门禁质量属性 |
| 下一步 | `Step 10 / evidence_audit` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 能力级 NFR | `00-需求文档.md` §13 | `available` | 性能、可用性、安全、审计、幂等、观测 |
| 配置 profile/failure/redaction | `04-配置设计.md` §6/§9/§11 | `available` | strict source、fail-fast、profile isolation |
| observability/error/recovery contract | `03-详细设计.md` §11/§12/§14 | `available` | safe signal、unknown、redaction、sink isolation |
| 专项测试与证据边界 | `05-测试方案.md` §8/§10/§13/§14 | `planned` | 当前只有设计级计划 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些非功能指标是 P0？ | 结构性进度/可解释性、fail-closed 可用性、security/redaction、strict config、dependency boundary、恢复/幂等/unknown、safe observability；不硬化旧 P95/SLA 数字。 | 00 §13；05 §10 |
| 阈值来自哪里？ | 若 00/04/03 未提供权威数字，只要求存在可审计 sample、bounded budget、failure disposition 和 profile；任何数字需在送验基线中另行固定。 | 00 §13；04 §7/§9 |
| 哪些专项未覆盖？ | 真实 provider/DB/bus/Git implementation、production-like capacity、LFS/浅克隆/GUI、长期 retention 为 P1/P2 residual；不可伪装为 P0 pass。 | 05 §2/§10/§14；SYNC-UP/SYNC-LOCAL |
| 哪些失败阻断总体结论？ | 安全泄露、dependency 越界、silent fallback、dirty overwrite、unknown 升格、Query/Job truth repair、证据完整性失败均阻断；性能 sample 数值高低在无阈值时进入风险而非自行判决。 | 00 VETO；04 §12.3 |
| 证据来自哪里？ | P0 `EV-SYNC-*` 计划、四 profile 运行报告、redaction/dependency/report audit；当前尚无实例。 | 05 §13 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 沿用旧同步器吞吐/延迟数字 | 无当前 workload/source，数字不可裁决 | 只要求 sample/bounded/可解释，数字后置 |
| 把 blocked/unknown 当不可用失败 | 将安全降级误判成系统缺陷 | 对 owner/network/Git/fs/冲突使用 typed blocked/unknown/manual |
| 将 capability bound 当 health/authorization | 可能越权继续操作 | `bound` 只代表构造/静态能力，不代表 health/fresh/accepted |
| 将日志/telemetry 当业务成功 | 破坏 observability boundary | signal 只能证明 technical observation |
| 配置错误 silent fallback | 可能运行在错误 source/profile | strict validation、fail-fast、无 hot/LKG |

## 5. 改动前后对比

| 维度 | 改动前 | 当前口径 | 理由 |
|---|---|---|---|
| 性能 | 固定数字/历史选择 | workload 与阈值待权威基线；先验结构性 sample | 不伪造目标 |
| 可用性 | 失败就继续或重试 | blocked/pending/unknown/unsupported/manual 是安全结果 | 防危险副作用 |
| 安全 | 只看权限 | ownership、redaction、path/dirty、private seam、no-output 全链 | 覆盖 VETO |
| 配置 | 默认值/回退 | strict JSON、source precedence、profile isolation、fail-fast | 对齐 04 |
| 恢复 | 重试次数 | checkpoint/probe/idempotency/commit reload | 对齐 03 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 现在填满 P95/SLA/容量数字 | 看起来具体 | 无 workload authority，数字不可复验 | 拒绝 |
| 只保留“系统稳定/安全” | 简短 | 无可判定门禁 | 拒绝 |
| 有来源的 structural gate + 未定量项显式 residual | 可判定且不伪造 | 需要 Step 13 风险跟踪 | 采用 |

## 7. 结构化中间产物

### 7.1 非功能验收门禁表

| 验收项 | 维度 | 指标/要求 | 通过条件 | 失败条件 | 证据计划 | 结论口径 |
|---|---|---|---|---|---|---|
| `AC-SYNC-015` | 性能/进度可解释性 | clone/pull/status/conflict/recovery/handoff 产生 bounded duration/count/progress sample；不依赖 P1/P2 能力 | sample 具备 profile、operation、bounded correlation、safe disposition；无 unbounded retry/scan | 无 sample、无限重试/批次/输出、用假 cache 宣称性能，或核心链依赖未授权能力 | `EV-SYNC-FLOW-001`、`EV-SYNC-OPS-001`; `reports/runs/<run_id>/...` | 无权威硬阈值时数值进入 residual；结构性缺失不通过 |
| `AC-SYNC-016` | 可用性/降级 | owner/network/Git/fs/metadata/Review/probe failure 映射为 blocked/pending/unknown/partial/unsupported/manual；local truth 保持可解释 | failure 不丢事实、不危险继续、不伪造 success；可给 next action | silent success、盲重试、dirty overwrite、unknown→known、sink failure 改业务结果 | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001`、`EV-SYNC-HANDOFF-001` | 安全降级可接受；危险继续不通过/VETO |
| `AC-SYNC-017` | 安全/边界 | owner 单一、explicit selection、fail-closed、no private seam、dirty/path protection、raw body/credential/token/path/output no-output | 所有 negative/redaction/path/dependency 检查 clean；unknown 时无危险副作用 | 越权 truth、私有 endpoint/共享 DB/任意 bus、敏感泄露、dirty overwrite、unknown apply/handoff | `EV-SYNC-ARCH-001`、`EV-SYNC-REDACT-001`、`EV-SYNC-BLOCKER-001`; `redaction-check.md`/`dependency-boundary.md` | 任一硬红线失败不通过，不能风险接受 |
| `AC-SYNC-018` | 审计/可追溯 | selection/binding/materialization/conflict/recovery/handoff/posture 变化有 source/correlation/provenance/transition/result refs；历史受保护 | local relation 可回链、旧链不静默删除；diagnostic 不冒充 formal evidence | 缺 provenance、伪造 parent/digest、无法解释状态变化、用日志代 history/evidence | `EV-SYNC-TRACE-001`、`EV-SYNC-HANDOFF-001`；`evidence-index.md` | 缺关键 local trace 不通过；正式 evidence readiness 由 Step 10 裁决 |
| `AC-SYNC-019` | 幂等/一致性/恢复 | canonical digest、namespaced key、exact replay、in-flight zero second writer、commit unknown reload、cursor/finalize safety | 同输入 replay exact carrier；不同 digest conflict；unknown 可 probe/manual；无重复 effect | 换 key 重放、duplicate mutation、stale overwrite、partial/unknown 推 cursor、ACK/log 判断结果 | `EV-SYNC-CONSISTENCY-001`、`EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/...` | 任何 blind replay/stale write 不通过；可命中 VETO |
| `AC-SYNC-020` | 可观测性/诊断 | closed low-cardinality log/metric/span/safe diagnostic；sink failure isolated；redaction applied | signal safe、bounded、不会改变 public result；durable local history 与 telemetry 分层 | raw body/secret/path/ref leak、free-form sensitive labels、sink failure 重放 effect、telemetry→readiness | `EV-SYNC-OPS-001`、`EV-SYNC-REDACT-001`; `redaction-check.md` | 泄露/信号混淆不通过；sink unavailable 可安全降级 |

### 7.2 配置与 profile 门禁

| 主题 | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|
| source precedence | approved default < selected strict JSON < allowlisted env；高优先级非法不 fallback | unknown/alias/duplicate/forbidden/invalid value 回退到旧 JSON/default/cache | `EV-SYNC-CONFIG-001` |
| 42 leaf | 38 required 必须存在；4 operations slot 只允许 null/opaque ref；类型/范围/cross-field 严格 | empty-as-null、非有限/越界/错误单位、inline secret/body/path、静默缺省 | `EV-SYNC-CONFIG-001` |
| composition | capability total mapping；read graph/mutation facade 按能力和失败姿态装配 | 半装配 mutation facade、bound 被解释成 health/authorization/readiness | `EV-SYNC-CONFIG-001`、`EV-SYNC-ARCH-001` |
| activation | startup/cold、job-run-start、entry-local/test harness 受控生效；在途对象不被热替换 | config center/admin override/reload/hot/online LKG 改写在途 snapshot | `EV-SYNC-CONFIG-001` |
| four P0 profiles | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可区分能力上限 | staging/production-like fake positive；profile unavailable 却 marked passed | `EV-SYNC-CONFIG-001` |

### 7.3 P1/P2 非功能残余

| 残余 | 当前姿态 | 不得如何处理 |
|---|---|---|
| 真实 SDK/provider/DB/bus/Git/fs 性能与故障数字 | P1 blocked/waiting | 不用 fake/ACK/report 宣称 production-like pass |
| LFS、浅克隆、GUI/Tauri | historical/pending | 不写成当前支持矩阵或放宽安全门禁 |
| capacity/SLO/长期 retention | P2/future trigger | 不在当前 AC 填未经授权数字 |
| 外部 Review/Archive 深度行为 | P1 seam only | 不改变 owner truth/accepted/signoff 解释 |

### 7.4 非功能失败裁决

| 失败类型 | 结论影响 |
|---|---|
| redaction leak、dependency boundary、dirty overwrite、unknown 危险副作用、silent fallback | 不通过；进入 VETO/S 级 |
| Query 写入、Job repair/submit、telemetry/log 升格 | 不通过；进入 VETO/S 级 |
| 无硬阈值的 duration/count sample 数值偏高 | 进入风险/趋势，不自动否决；前提是结构性 sample 完整 |
| P1 positive unavailable 且 P0 local gate 完整 | residual/有条件通过候选，须 Step 13 明确接受人和触发器 |

## 8. 回填草稿

正式 §9 应以 AC-SYNC-015～020 定义结构性非功能门禁：性能只要求有来源、bounded、可解释 sample，不填未授权数字；可用性必须 fail-closed 并保留 blocked/unknown/partial/manual；安全必须满足 ownership、dirty/path、dependency、redaction；审计必须有 local provenance/transition/result refs；幂等/一致性必须 exact replay、unknown reload、no stale overwrite；观测必须 closed、低基数、body-free、sink failure isolated。P1/P2 的真实产品性能、LFS/浅克隆/GUI 和长期能力进入 residual，不得替代 P0。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 权威 workload、SLO/P95/P99、capacity model | AC-015 定量门禁 | future baseline / Step 13 trigger |
| 真实 Git/fs/provider failure timing | AC-016/019 P1 positive | blocker 解锁 |
| report/redaction/dependency audit generator | AC-017/020 真实证据 | Step 10/07 |

## 10. 进入下一步条件

- [x] AC-SYNC-015~020 均有来源、通过/失败条件、证据计划和结论口径。
- [x] 无权威阈值的性能/容量项未被擅自数字化。
- [x] P1/P2 residual 与 P0 硬阻断已分离。
- [x] profile、strict config、activation、redaction 和 capability ceiling 已纳入 NFR 门禁。
- [x] 本步停审；进入 Step 10 前读取 03 §14、05 §13、证据规范和 acceptance handoff 规则。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 非功能门禁可判定但尚无真实 run/evidence；未填写实际 NFR 结论。
- 下一步阅读：05 §13、验收 SOP Step 10、书写规范 evidence 规则，创建 Step 10。
