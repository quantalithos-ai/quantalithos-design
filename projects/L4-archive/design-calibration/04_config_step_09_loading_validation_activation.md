# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 正式回填：`04-配置设计.md` §9
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 10）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 9：配置加载、校验与生效机制 |
| 输入 | Step 7 配置项、Step 8 敏感边界、Step 5 来源优先级、03 §13/§14、DDD Step 14/15 |
| 输出 | 加载流程、parse/type/range/cross-field 校验、assembly target、生效矩阵、issue surface 和停审审计 |
| 本步限制 | 不定义 Rust 函数签名、具体 error variant 实现、secret provider API、热更新、在线 LKG、部署命令或 provider 健康证明 |
| 生效总规则 | P0 仅 `startup/new assembly`、`job-run-start`、`entry-local` 和 `test harness`；`reload`/`hot`/`online LKG` 均 unsupported |
| 下一动作 | 更新 flow/台账后进入 Step 10 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置在什么时机加载？ | startup 时由 `crates/infra/src/config.rs` 读取并冻结 candidate；`crates/infra/src/runtime_builder.rs` 只消费 validated refs/parameters。job-run-start 只冻结当前作业的 target、batch、timeout、retry/probe budget 和 pinned config identity；entry-local 只选择当前入口，不覆盖 startup invariant；test harness 只装配 test-only fake。 |
| 如何 parse 和 type validate？ | 运行配置只能是严格 JSON；先收集 `DECL < JSON < allow-listed ENV` 的已授权 occurrence，再拒绝 duplicate/unknown/alias/profile conflict，之后 parse object、校验 finite enum、typed ref、positive bound、duration、list uniqueness、map key 和 optional/conditional 形状。JSONC 仅用于文档，不可作为运行时输入。 |
| 哪些项需要 cross-field validate？ | profile 与 adapter/test posture、exposed surface 与 required slot、selected source/owner 与 exact binding、query cursor 四元绑定、operation codec 与 non-Query surface、retention schedule 与 formal decision、batch/page/timeout/lease/retry/probe 关系、redaction denylist 与 telemetry mode、inbound family 与 trusted schema、old-work pinned identity 与 current config 均必须交叉校验。 |
| startup/reload/hot/build-time/static 如何区分？ | profile、binding、store、codec、redaction、required slot 和进程级 budget 是 startup/new assembly；job budgets/targets 是 job-run-start；入口 selector 是 entry-local；fixtures 是 test harness；truth ownership、state machine、UoW/CAS/fence、Query no-write、restore write boundary、outbound blocker 是 static design boundary。reload/hot/online LKG 不在 P0。 |
| 校验失败如何处理？ | startup candidate 失败则 assembly `Failed` 且不暴露 facade；job-run-start 失败则当前 job rejected，不进入 mutation/effect；entry-local 失败只拒绝当前入口；fixture 失败 test fail-fast。高优先级非法值永不回退低优先级来源。raw secret/body、forbidden invariant override、required slot 缺失均 fail-closed。 |
| 是否与 Step 7/8 一致？ | 是。每个配置域均给出 parse、type/range、cross-field、assemble target、expose boundary 和失败策略；sensitive material 只由 exact adapter 私有解析并只返回 typed outcome。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 旧 README/旧 05/06 把环境文件、数据库或供应商当成默认 | 运行时 loader 会被迫绑定历史产品 | 不继承；只接受 typed refs、有限 registry 和 owner 合同 |
| 03 已固定 reader/builder 但未固定完整 schema | 实现者可能让 api/worker 直接读 ENV 或隐式默认 | raw 只进 `infra/config.rs`；builder 只消费 validated refs/parameters |
| 外部 slot 未闭合 | loader 可能把 ref 存在误判为能力 ready | schema validation 与 handle construction 分离；marker 不可替代 handle；required slot 缺失不暴露 facade |
| sensitive ref/secret 分层未闭合 | 错误路径可能泄露 endpoint/body | issue surface 只带 safe category/issue ref；raw value/provider response 永不进入错误/日志 |
| job input 与旧 operation 关系不清 | current config 漂移可能重放旧 intent | job-run-start 保存 config/binding identity；old work 不按 current config 重建 |

## 4. 配置加载流程图

#### 配置加载流程图: L4-archive 配置加载与校验

```text
[code declaration / schema metadata]
              |
              v
[one strict JSON document] ---> [allow-listed ENV leaves]
              |                         |
              +-----------+-------------+
                          v
              [source occurrence collection]
                          |
          duplicate / unknown / alias / profile conflict
                          |
                          v
                 [infra::config.rs]
        parse -> type/range -> sensitive/body checks
                          |
                  cross-field validation
                          |
          body-free typed refs + validated parameters
                          v
              [infra::runtime_builder.rs]
  freeze profile + surfaces + selected targets + required slots
                          |
       inspect exact binding -> build real handle + marker
                          |
     reject missing/mismatch/Degraded/required Disabled
                          |
            [ArchiveRuntimeAssembly::Ready]
             /                         \
  restricted application facades       worker facades
```

关键说明：

- 图只表达来源、校验、装配和暴露关系，不表达部署命令、provider 产品、网络拓扑或真实 secret。
- `Ready` 只表示当前 exact local assembly 的 required handle 已构造；不表示 Bundle、storage、receiver、owner 或产品 readiness 成功。
- `job-run-start` 和 `entry-local` 输入只能在已装配 facade 的受限边界内冻结，不得重新读取 raw config 或缩短 required set。

## 5. 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `profile.*` | startup | strict object、profile/revision allow-list、source conflict | new assembly 固化 profile/config identity | candidate reject / fail-fast |
| `assembly.*` | startup | exact registry shape、surface/optional registry consistency | `ArchiveRuntimeAssembly::begin` 冻结 | missing/mismatch→不暴露 facade |
| `stores.*` | startup | typed binding ref、atomic UoW/CAS/read-set/probe capability declaration | builder 注入 local store/context/worker control | required capability 缺失→assembly blocked |
| `sources.*` | startup；job-run-start 选择 selected target | SourceClass totality、owner/fence/coverage contract ref、无 workspace fallback | selected target pinned to job | target-specific blocked/partial/unknown |
| `authority_visibility.*` | startup | exact slot、redaction profile、denylist/security posture | assembly 注入 authority/visibility/safe output | unavailable/unsafe→surface blocked/fail-closed |
| `integrity_compatibility.*` | startup；assessment job start 固化 target | target registry、capability ref、schema/version context | assessment wrapper | unknown/unsupported/conflicting→不验证/不恢复 |
| `storage_lifecycle.*` | startup；placement/lifecycle job start 固化 target/decision ref | storage/governance exact slot、schedule≠decision、probe capability | effect wrapper/worker | missing decision/storage→不派发或 blocked |
| `restore_receivers.*` | startup；restore plan/job start 固化 owner set | exact owner map、receiver schema/capability ref | per-owner receiver dispatcher | missing/unsupported owner→item blocked |
| `inbound.*` | startup | exact family map、trusted schema/trust ref、unknown family reject | worker consumer registry | quarantine/no ACK success |
| `operation_cursor.*` | startup | codec/mapping ref shape、non-Query vs Query requirement | idempotency/query boundary wrapper | mutation reserve/continuation blocked |
| `budgets.*` | startup；selected job-run-start values | positive/range/ordering and no-zero implicit | API/application/worker wrappers | fail-fast or affected job rejected |
| `observability.*` | startup | telemetry mode, safe sink/ref, denylist and backend boundary | Layer A safe emitter and optional material seam | sink drop/degrade; mandatory native UoW failure stays failure |

## 6. 配置域的 parse / type / cross-field / assembly 闭环

| 配置域 | parse | type / range | cross-field | assemble target | expose boundary |
|---|---|---|---|---|---|
| `profile` / `assembly` | top-level objects | finite profile, revision/ref, bool-free invariant flags | profile 与 test/fake posture；surface 与 required/optional registry | `ArchiveRuntimeProfileRef`、`ArchiveInfraConfigRef`、`ArchiveRuntimeBindings` | 仅 builder/composition root |
| `stores` | nested binding objects | exact binding refs；不接受 DSN/body | Store/Context/Worker slots 与 UoW/CAS/probe capability | typed store/context/control handles + markers | application ports / worker control |
| `sources` | finite SourceClass map | key set、opaque binding ref、requiredness由 frozen target决定 | source class 与 owner/coverage/fence contract | source adapter registry | source/restore services；不进 domain truth |
| `authority_visibility` | slot objects | exact authority/visibility/redaction refs | query surface 必须 Visibility；redaction 不得放宽 | authority/visibility handles、safe redactor | application/API safe views |
| `integrity_compatibility` | target/capability objects | target ref、capability/version ref | target registry 与 selected manifest/receiver context | integrity/compatibility handles | assessment/restore guard |
| `storage_lifecycle` | target/decision/schedule objects | storage/governance refs；schedule ref 不等 decision | effect kind、decision applicability、probe support | storage/governance handles | placement/lifecycle jobs |
| `restore_receivers` | owner map/schema objects | owner/ref totality、schema capability | frozen owner set 与 exact receiver map | per-owner receiver dispatcher | restore job only |
| `inbound` | family/schema objects | family/version/trust refs | exposed family 必须有 exact route；unknown schema不可接收 | consumer registry | worker consumer entry |
| `operation_cursor` | codec/mapping objects | body-free refs | non-Query reserve requires both key/input codec；continuation requires public/private mapping | idempotency/cursor wrappers | command/consumer/job or Query boundary |
| `budgets` | scalar/object values | positive bounded number/duration | page≤request; batch≤declared max; retry/probe/lease relation | validated typed budgets | owning wrapper only |
| `observability` | safe telemetry object | finite mode/ref/denylist | disabled telemetry still cannot relax redaction; material handoff requires owner contract | safe telemetry facade | infra hooks; Query remains zero-write |

## 7. Cross-field 校验矩阵

| 规则 | 输入 | 校验 | 失败 |
|---|---|---|---|
| profile 与 adapter posture | `profile.name`、test/fake/controlled marker | production-like 拒绝 fake/test；local/CI 仅 test assembly；integration-like 可 controlled | startup fail-fast |
| surface 与 required slots | exposed surfaces、selected source/owner/family | 对每一 surface 计算 exact required set；不得由 config 删除 required | assembly failed |
| source totality | selected `SourceClass` set、binding map、owner contract refs | required source 每项唯一；WorkspaceProjection 仍 Auxiliary，ObservabilityMaterial 仍 material | target blocked |
| restore owner totality | frozen owner set、receiver registry | 每个 selected owner exact match；禁止 all-owner fallback | item/plan blocked |
| query cursor binding | query kind、public codec、repository mapping、visibility/snapshot/order basis | continuation 需要完整 mapping；不能出 repository cursor | continuation blocked |
| operation codec | non-Query surface、operation key/input digest refs | command/consumer/job 缺任一 ref 不允许 reserve；不借 Bundle digest | mutation blocked |
| storage/lifecycle authority | schedule ref、GovernanceDecision ref、action kind | schedule 不产生 retention/hold/delete/risk decision；dispatch 前需 current decision | lifecycle blocked |
| budget ordering | request/page/batch/timeout/retry/probe/lease values | all required positive；page/batch不得越界；unknown 不得用 retry 代替 probe | fail-fast / job rejected |
| redaction safety | redaction profile、telemetry mode、field denylist | denylist 必须覆盖 03 forbidden classes；telemetry off 不放宽 | fail-closed |
| inbound trust | family、schema/version、trusted source marker | family/schema 未闭合不得 ACK success；未知 schema quarantine | consumer rejected |
| pinned old work | stored config/binding identity、current candidate | old operation/effect/plan 只能使用 stored identity；不按 current candidate 重建 | replay/restore blocked |

## 8. 生效方式矩阵

| 生效方式 | P0 适用内容 | 失败处理 | 旧工作处理 |
|---|---|---|---|
| `startup / new assembly` | profile、all binding refs、required/optional slots、store、codec、redaction、process budgets、telemetry mode | validation/build fail-fast；`Ready` 前不暴露 facade | 已运行 operation 不漂移；新 assembly 有新 identity |
| `job-run-start` | selected source/owner target、job batch/timeout/retry/probe/lease、schedule ref、replay input | 当前 job rejected 或 blocked；不进入 mutation/effect | run 固化 values；partial resume 用新 operation + explicit unresolved set |
| `entry-local` | profile selector、safe input source selector、仅当前 entry 的 lower bound/diagnostic selector | 当前入口 rejected；不得改 startup invariant | 不改变 stored result/intent |
| `test harness` | deterministic fake/clock/id/fixture | test fail-fast；fake 不进 production builder | 仅 test assembly |
| `reload` | P0 unsupported | presence of reload source/key→`UnsupportedReload` | 无 online LKG；走 new assembly/restart |
| `hot` | P0 unsupported | presence→reject candidate；不得半切换 adapter | 无 |
| `build-time` | compile graph/dependency discipline，不是运行配置 | implementation gate 处理 | 不影响 runtime identity |
| `static` | truth owner、状态、UoW/CAS/fence、Query no-write、restore write boundary、outbound blocker | 配置出现 override key→ForbiddenInvariantOverride | 必须回到 00～03/owner ADR |

## 9. Config validation issue surface

| Issue 类别 | 载荷 | 禁止携带 | 处理 |
|---|---|---|---|
| `ParseFailed` | source kind、redacted location、safe issue ref | raw JSON/body | candidate reject |
| `UnknownField` / `DuplicateField` / `AliasField` | module path、field class、issue ref | raw value when sensitive | candidate reject |
| `MissingRequired` | module path、required class、issue ref | secret/ref body | fail-fast/affected target blocked |
| `InvalidType` / `InvalidEnum` / `InvalidRange` | expected class、module path、issue ref | sensitive raw value | fail-fast/entry/job rejected |
| `CrossFieldConflict` | rule ref、module paths、issue ref | involved secret/body values | fail-fast |
| `ForbiddenSecretMaterial` | forbidden class、module path、issue ref | detected material | fail-closed |
| `ForbiddenInvariantOverride` | forbidden boundary class、issue ref | attempted payload | fail-closed; design change required |
| `UnsupportedSource` / `UnsupportedReload` | source/activation class、profile class、issue ref | source body | reject candidate |
| `BindingMismatch` / `CapabilityBlocked` | exact slot family、safe issue ref | provider response/credential | assembly/target blocked |

Issue refs are safe diagnostic handles only; they do not prove external success, readiness, evidence or acceptance.

## 10. 配置域停审与跨加载校验审计

| 配置域 | 必填 | type/range | cross-field | 生效/失败 | 结论 |
|---|---|---|---|---|---|
| profile/assembly | 通过 | 通过 | 通过 | startup fail-fast;no facade before Ready | 通过 |
| stores | 通过 | 通过 | UoW/CAS/probe capability | missing/blocked assembly | 通过；provider仍 pending |
| sources/authority/visibility | 通过 | 通过 | source/owner/visibility/redaction | target/surface blocked | 通过 |
| integrity/storage/lifecycle | 通过 | 通过 | target/decision/schedule/probe | no verification/dispatch | 通过 |
| restore/inbound | 通过 | 通过 | owner/family/schema totality | item quarantine/blocked | 通过 |
| operation/cursor | 通过 | 通过 | mutation/query distinct mapping | reserve/continuation blocked | 通过；local codec pending |
| budgets | 通过 | 通过 | page/batch/retry/probe/lease ordering | fail-fast/job rejected | 通过；numbers pending |
| observability | 通过 | 通过 | denylist/mode/material handoff | safe degradation only | 通过；sink contract pending |

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验必填项 | 未发现 | Step 7 required/conditional entries all mapped |
| 未覆盖类型/范围 | 未发现 | enum/ref/list/map/positive bound/duration all covered |
| cross-field 缺口 | 未发现 | profile、slot、source、owner、cursor、retention、budget、redaction、inbound covered |
| 非法高优先级 fallback | 不允许 | whole candidate reject |
| raw secret/body 进入 issue/log | 不允许 | safe issue ref only |
| builder 半装配暴露 facade | 不允许 | marker-only/partial assembly rejected |
| reload/hot 无回滚 | 不适用 | P0 rejects reload/hot |
| old work 受 current config 漂移 | 不允许 | pinned identity required |
| `03` 当前回写缺口 | 未发现 | future reload/provider/new code contract remains trigger |

## 11. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| strict JSON → typed validation → builder assembly → exact facade exposure | 否 | 承接既有 Step 14 顺序 | 不适用 | 无回写 |
| `Ready` 前不暴露 facade；required set 在 begin 冻结 | 否 | 承接 runtime assembly/fail-closed | 不适用 | 无回写 |
| job-run-start/entry-local 不得覆盖 startup invariant；old work pinned | 否 | 生效与一致性边界 | 不适用 | 无回写 |
| P0 reload/hot/online LKG unsupported | 否 | 生命周期边界 | 不适用 | 无回写 |
| future 若引入 reload/LKG/secret provider API、new error/port/DTO/flow | 是（未来触发） | runtime/builder/security contract | 03 §4～§15 与对应 calibration Step | 无回写（触发前暂停） |

## 12. 回填草稿与进入下一步条件

正式 §9 应回填加载流程图、配置加载校验表、配置域闭环表、cross-field 矩阵、生效矩阵、issue surface 和审计结果。不得写具体函数签名、provider、endpoint、密钥或热更新机制。

| 条件 | 状态 |
|---|---|
| parse/type/range/cross-field/sensitive validation 均有规则 | 通过 |
| builder assemble 与 facade exposure 边界可判定 | 通过 |
| required slot、old-work pinning、Query no-write 未被生效方式放宽 | 通过 |
| reload/hot/online LKG 明确 unsupported | 通过 |
| 当前无 03 待回写项 | 通过；future code contract 为触发器 |
| 可进入 Step 10 | 通过 |
