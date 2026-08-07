# L2-tools 04 配置设计 Step 11：失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.11
> 回填目标：`projects/L2-tools/04-配置设计.md` §11
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | 定义配置 invalid、binding blocked、runtime unavailable、degraded、unknown 和 drift 的不混淆行为。 |
| 前序门禁 | Step 5/7/9/10 已完成来源、item、validation/activation 和 rollback。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 正式写入 | 关闭；只形成 §11 回填草稿。 |
| blocker | 无新增；`L2T-UP-001~009` 继续映射为 blocked/unverifiable，而不是配置错误或正向 readiness。 |
| 下一动作 | 连续授权下进入 Step 12 下游承接。 |
| 提交 | 不需要。 |

### 1.1 Step 内计划

- [x] 读取 SOP Step 11、书写规范、Step 5/7/9/10、`03` §13.6~§13.9 与最小测试切口。
- [x] 固定 fail-fast/fail-closed/blocked/unavailable/degraded/unknown/partial/reject 的区别。
- [x] 覆盖缺失、malformed、cross-field、secret/ref、unsupported source、drift 与 runtime dependency failure。
- [x] 按配置域映射 public/worker/job surface、观测与恢复。
- [x] 定义告警安全字段与后续测试切口，不伪造测试结果。
- [x] 完成逐域停审、跨策略审计与 `03` 影响判定。

## 2. 失效语义词表

| 语义 | 精确定义 | 适用 | 绝不表示 |
|---|---|---|---|
| `fail-fast` | 候选配置或 required local capability 无效，阻止 runtime assembly/当前 scope 启动 | parse/type/cross-field/Store/UoW/replay/Clock-ID | degraded ready、使用旧/default值继续。 |
| `fail-closed` | 安全/authority 前置无法证明，拒绝危险动作 | auth/source/body/redaction/visibility、安全 override | deny truth、provider failure、可重试许可。 |
| `blocked` | owner/schema/mapping/route contract 未闭合 | `L2T-UP-*` external seam | config malformed、provider success/failure。 |
| `unavailable` | 已配置依赖当前无法回答/调用 | runtime Store/Port/visibility | blocked contract 已闭合、allow/accepted。 |
| `degraded` | 仅提供已有设计允许的有限 read/peripheral surface并显式标记 | projection stale/unavailable、optional collaboration | silent fallback、core truth repair。 |
| `unknown` | side-effect/commit结果无法证明 | Prepared/call/submission/commit ambiguity | success、failure、automatic retry。 |
| `partial` | bounded Job 各 item disposition 混合 | JobReport | all success、whole scan、truth repaired。 |
| `entry/job reject` | global runtime valid，但当前 selector/scope/target/input invalid | entry-local/job-startup | global graph invalid或被修改。 |

配置 invalid 永远不通过 `degraded` 掩盖。`last-known-good` 不是 P0 runtime 功能；previous validated candidate 只能由 deployment owner发起新 assembly。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填缺失 | global required item/capability -> startup fail-fast，无 entry bundle；条件必填在 feature/Job 激活时同样失败。 |
| 类型/范围/组合错误 | V0~V8 typed reject；高优先级非法不回退；entry/job局部错误只拒绝当前 scope。 |
| secret/provider不可用 | raw secret本身拒绝；required ref/registry capability缺失 fail-fast；未来 provider material不可用不回退fixture/plaintext。 |
| config center不可达 | P0 不支持 config center；配置 source 请求本身 `UnsupportedCapability/UnsafeOverrideAttempt`，不存在 LKG fallback。 |
| 漂移/过期 | 比较 redacted config identity/safe digest 与 expected deployment reference；mismatch 阻断新 assembly或告警现有 deployment owner，不读取/打印raw diff。 |

## 4. 当前材料诊断、对比与取舍

| 项 | 本步前 | 本步后 |
|---|---|---|
| failure词表 | Step 7 item级策略 | 明确 config invalid、contract blocked、runtime unavailable、unknown/partial。 |
| config center | unsupported | 明确“不可达”不适用，不产生LKG。 |
| drift | 仅 safe config identity | 定义expected/actual safe identity mismatch与无raw diff。 |
| runtime failure | `03` 有 Port/Store语义 | 按配置域和入口 surface 映射。 |
| alert/test | 只有最小 cuts | 形成安全告警字段和计划测试切口。 |

取舍：不选择告警平台、阈值、SLO、runbook或自动恢复；不把 external runtime error改写为 config error；不为“尽量可用”引入 fallback Store、local registry、host execution、default allow、fake或truth reconstruction。

## 5. 结构化中间产物

### 5.1 配置失效模式总表

| ID | 失效模式 | 影响 | 系统行为 | 是否应观测 | 计划测试切口 |
|---|---|---|---|---|---|
| `CFG-F-01` | strict JSON unreadable/malformed/comment/trailing/duplicate/unknown | candidate不存在 | fail-fast；value-free issue | 是，error | parser negative matrix。 |
| `CFG-F-02` | required section/item缺失 | graph不完整 | fail-fast；无entry | 是，error | each required/conditional missing。 |
| `CFG-F-03` | type/enum/bound/ref grammar非法 | item不可用 | fail-fast或当前entry/job reject | 是 | type/range/ref boundary。 |
| `CFG-F-04` | 高优先级 env/file 非法 | source conflict | fail-fast；不回退低优先级 | 是，error | invalid-high no-fallback。 |
| `CFG-F-05` | cross-section conflict | invariant不成立 | fail-fast / `UnsafeOverrideAttempt` | 是，error/security | 12 cross gates。 |
| `CFG-F-06` | Store/UoW capability mismatch | local write atomicity不可证明 | fail-fast；no partial graph | 是，error | CAS/pair/UoW capability negative。 |
| `CFG-F-07` | replay surface/retention不足 | exact replay不可保证 | fail-fast；不从current truth重算 | 是，error | result/receipt/report missing。 |
| `CFG-F-08` | sensitive ref malformed/registry missing | constructor/binding不可证明 | fail-fast；无raw/plaintext/fixture fallback | 是，security/error | ref-only and no-output。 |
| `CFG-F-09` | unsupported source/lifecycle | P0 contract外请求 | reject/fail-fast | 是，security/error | config center/admin/hot/reload/LKG。 |
| `CFG-F-10` | external owner/schema/mapping/route未闭 | positive seam blocked | valid blocked-aware graph；相关flow fail-closed | 是，warn/error aggregated | one test per `L2T-UP-001~009`。 |
| `CFG-F-11` | configured external adapter runtime unavailable | current call不可答 | typed unavailable；按flow拒绝/降级 | 是 | Port unavailable parity。 |
| `CFG-F-12` | visibility不可用 | scope不可证明 | Query/entry unavailable；不default visible | 是 | no scope bypass。 |
| `CFG-F-13` | projection stale/rebuilding/unavailable | derived read不新鲜 | explicit degraded marker；Query no-write | 可聚合 | stale/degraded no-write。 |
| `CFG-F-14` | handoff/submit timeout无call proof | side-effect结果歧义 | unknown/manual resolution；不自动重调 | 是，error | Prepared/unknown fence。 |
| `CFG-F-15` | optional peripheral disabled/route-blocked | event/status/Job外围不可用 | only registration skipped / local attempt status；core truth不变 | 可聚合 | feature-off core invariants。 |
| `CFG-F-16` | entry/job selector/scope/target非法 | 当前scope无效 | reject current scope；global config不变 | 是 | selector/snapshot isolation。 |
| `CFG-F-17` | bounded Job item混合失败 | report mixed | partial/blocked/failed report；不repair truth | 是 | item disposition/report replay。 |
| `CFG-F-18` | config identity/digest drift | deployment预期不一致 | new assembly blocked或现有实例告警给deployment owner | 是，error | safe digest mismatch/no raw diff。 |
| `CFG-F-19` | new builder stage失败 | partial graph存在风险 | dispose whole prefix；不暴露bundle | 是，error | B0~B8 failure injection。 |
| `CFG-F-20` | unsafe output detected | leak risk | output fail-closed；safe issue only | 是，security/error | forbidden sweep across surfaces。 |

### 5.2 按配置域组织的失败策略

| 域组 | Config-invalid | Runtime dependency failure | Public/worker/job surface | 禁止fallback |
|---|---|---|---|---|
| profile/source/identity | fail-fast/entry-reject | drift -> alert/block new assembly | no bundle/current entry reject | lower source/LKG。 |
| boundary | fail-fast/entry/job reject | N/A | protocol invalid/quarantine/job reject | unbounded/clamp/coercion。 |
| Stores/UoW | fail-fast | repository/UoW unavailable/commit unknown per `03` | command unavailable/error；no half write | memory/cache/hidden tx。 |
| idempotency/replay | fail-fast | missing stored result/claim conflict typed | no mutation or exact replay defect | rerun/current reconstruction。 |
| projection | fail-fast/job reject | stale/rebuilding/unavailable | Query degraded no-write；Job partial | live core read repair。 |
| jobs | fail-fast/job reject | item unavailable/partial | bounded report | whole-job scan/retry。 |
| Auth/Sandbox/source | malformed ref fail-fast | blocked/unavailable/unverifiable | fail-closed/no-execution/gap | default allow/host/outcome inference。 |
| collaboration/visibility | malformed ref fail-fast | route-blocked/unavailable | local attempt; Query unavailable | delivered/observed/default-visible。 |
| handoff | cross conflict fail-fast/job reject | call unknown/target ineligible | manual unknown/local disposition | second call after ambiguity。 |
| Clock/ID | fail-fast | runtime primitive unavailable before mutation | entry unavailable | DB/default time/ID semantics。 |
| features | incomplete enablement fail-fast | optional route/status degraded | core flows unaffected | disable safety/core。 |
| safety/telemetry | fail-closed | output sink unavailable only affects safe observation, not truth | body-free issue/no unsafe output | raw diagnostic/Observability truth。 |

### 5.3 生效方式到失效策略矩阵

| Scope | 检测点 | 失败策略 | 恢复 |
|---|---|---|---|
| static | V7/B8 forbidden audit | reject/fail-closed | 删除override或正式设计变更。 |
| startup | load/V0~V8/B0~B8 | fail-fast，无bundle | 修复或previous candidate新assembly。 |
| entry-local | entry selector/guard | reject current entry | 新调用使用valid snapshot。 |
| job-startup | Job admission/snapshot | reject current Job | 新Job使用valid scope/target。 |
| runtime observational Port | typed call mapping | blocked/unavailable/degraded/fail-closed by role | bounded retry only if `03` permits。 |
| runtime side-effect Port | Prepared/one call/phase-2 | local failure with proof or unknown | named resolution/manual，no generic retry。 |

### 5.4 告警安全字段

| 场景 | 级别方向 | 允许字段 | 禁止字段 |
|---|---|---|---|
| startup validation/builder reject | error | source ref、profile、section、slot、issue kind/ref、config safe digest | raw JSON/env/full ref/secret/backend text。 |
| unsafe override/raw secret detection | security/error | forbidden class、section、issue ref | attempted raw value/hash。 |
| external blocked/unavailable | warn/error aggregated | adapter slot/kind、availability/blocked category、diagnostic ref | endpoint/provider body/readiness claim。 |
| projection degraded | warn aggregated | query/view/freshness class、gap refs | subject/body/high-cardinality key。 |
| side-effect unknown | error | phase、attempt/material safe ref、resolution state | request/provider response/target credential。 |
| config drift | error | expected/actual safe digest、profile | raw diff/config body。 |

告警“应产生”是后续实现/测试承接要求，不声明当前已有告警或运行结果。

### 5.5 配置失效停审与跨策略审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| 必填/type/cross-field | 通过 | fail-fast/reject明确，无silent fallback。 |
| sensitive/provider | 通过 | ref-only；不可用不回退raw/fake。 |
| unsupported config center/hot/LKG | 通过 | reject，非“不可达后降级”。 |
| external blocker | 通过 | blocked-aware与config-invalid/ready分离。 |
| degraded | 通过 | 仅read/peripheral surface；不修truth。 |
| unknown | 通过 | 不推断、不自动重调。 |
| partial | 通过 | 仅bounded Job report。 |
| drift/rollback | 通过 | safe digest；new assembly；无raw diff。 |
| 03 error/state | 通过 | 未新增variant/state；沿用既有typed surface。 |

## 6. 对详细设计影响、回填与门禁

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| config invalid/fail-fast与Port blocked/unavailable分离 | 否 | existing error/availability detail | 03 §11、§13 | 无回写 |
| degraded/unknown/partial限定 | 否 | existing state/flow detail | 03 §9、§11、§13 | 无回写 |
| config drift safe identity处理 | 否 | operations/config detail | 03 §14 safe fields | 无回写 |
| future online LKG/auto recovery/new failure state | 是 | lifecycle/state/error | 先回写 03 | future trigger |

正式 §11 应装配失效词表、20类模式表、域组策略、scope矩阵和告警安全字段。不得写真实告警、测试通过、run/evidence或SLO。

| 待确认 | 影响 | 未确认前 |
|---|---|---|
| alert aggregation/threshold | `09` | 只定义安全字段与事件类别。 |
| expected config digest由谁注入 | `07/09` | deployment owner 输入safe ref；不在L2生成部署truth。 |
| runtime Store unavailable的产品级恢复 | `09` | 按`03` typed error；不选backend/runbook。 |

| 门禁 | 状态 |
|---|---|
| P0失效模式覆盖 | 通过 |
| fail-fast/closed/blocked/degraded/unknown不混淆 | 通过 |
| 高风险无silent fallback | 通过 |
| 逐域停审/跨审计 | 通过 |
| 03当前无回写 | 通过 |
| 下一动作 | 连续授权下进入 Step 12 |
