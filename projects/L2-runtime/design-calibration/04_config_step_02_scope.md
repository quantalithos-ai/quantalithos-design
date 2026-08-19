# L2-runtime 04 配置设计 Step 2：目标、范围与非范围

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`scope / priority / applicability`
> 回填位置：正式 `04-配置设计.md` 第 2 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 项目/flow 恢复点 | 当前只允许 Step 2；Step 1 已通过 |
| 输入 | Step 1 输入映射、正式 00~03、配置 SOP/规范 |
| typed baseline | 9 policy、13 slot、7 job 和相关 value/error 已在 03 闭合 |
| blocker | external positive seam 保持 blocked，不阻塞配置负向语义 |
| 禁止 | 不创建 Step 3，不修改正式 04，不实现 loader/config artifact |

## 2. SOP 问题回答

### 2.1 P0 必须定义哪些配置才能运行主链

P0 必须能把一份 project-local strict JSON 确定性装配为 `RuntimeConfigSnapshot`，并且只有验证通过的 snapshot 才能进入 `RuntimeBuilder`。最低闭环包括：

1. `profile`：config schema、entry profile 与 environment validation class。
2. `scope/context/working_memory/model_decision/action_guard/delegation/checkpoint_recovery/handoff_projection/idempotency`：九组 typed policy 的外部字段或静态派生规则。
3. `adapter_slots`：13 个 canonical slot 的精确 closed set、requirement、activation、ref/schema/blocker。
4. `jobs`：7 个 canonical job 的精确 closed set、activation、partition/lease/page/attempt；operation/retry posture 由 key 静态派生。
5. strict JSON、来源、冲突、type/range/cross-field/forbidden 校验、startup publication 和失败原子性。
6. raw secret、endpoint、route、quota、cost、owner body、readiness 和历史 alias 的拒绝规则。

### 2.2 P1/P2 是什么

| 级别 | 内容 | 当前处理 |
|---|---|---|
| P1 | 在保持同一 03 typed contract 的前提下，增加受控配置准备/比较、恢复上一份已验证文件并重启 | 只定义 change/audit/rollback 语义；不承诺 in-process reload |
| P1 | external slot 在正式 owner contract/schema/implementation qualification 后从 Blocked 变为 Candidate | 定义进入条件；不声明当前可进入 |
| P1 | integration/production candidate 配置包与 deployment binding | 只定义校验姿态；路径、credential 注入和发布由 09/实现负责 |
| P2 | config center、admin override、remote dynamic config、hot reload、gray rollout | unsupported；触发 03/04/07/09 受控重开 |
| P2 | provider/vendor-specific extension map | unsupported；由 owning adapter 设计，不进入 Runtime root |

### 2.3 哪些细节留给部署与运维

- 配置文件发现路径、mount、ownership/mode、容器/进程注入、service unit 和启动命令。
- secret provider/KMS/Vault 产品、credential ref 实际解析、轮换操作和应急流程。
- process topology、环境实例命名、config package 发布、备份位置和 restart orchestration。
- 告警路由、值班系统、dashboard/backend、采样和保留产品参数。

### 2.4 哪些细节留给实施计划

- parser/validator/store/builder 的 planned file、commit boundary、实现次序和测试 gate。
- 实现仓/target path 创建、依赖版本、具体 serde/JSON parser 选择。
- 每个 config type、error mapping、fixture 和 negative test 的实现任务。
- 真实 source binding、deployment artifact 和环境准备任务；当前均不得标为完成。

### 2.5 非范围有哪些残余风险

| 非范围 | 残余风险 | 当前姿态 |
|---|---|---|
| concrete store/runtime/broker/scheduler | 物理能力可能无法满足 03 UoW/lease/cursor | `L2R-CP-001/L2R-IMPL-001`；profile blocked |
| provider credential/route | adapter 可能无法正向调用 | slot Blocked；Runtime config 不补定义 |
| upstream contract/schema | contract ref 可能不存在或不兼容 | activation 不得 Candidate；fail-closed |
| deployment path/permission | 正确 schema 仍可能无法加载 | 09 负责；P0 loader 返回 SourceUnavailable |
| performance capacity | 无真实 baseline | 数值无生产默认；配置必须显式给出并受 typed positivity/cross-field 校验 |

## 3. 配置设计目标

| ID | 优先级 | 目标 | 说明 | 交付给下游 |
|---|---|---|---|---|
| CFG-G-01 | P0 | 唯一 raw schema | 12 个顶层域、closed strict JSON、无 extension map | parser/schema contract tests；implementation boundary |
| CFG-G-02 | P0 | 1:1 typed assembly | 每个外部 leaf 或静态派生值都映射唯一 03 field | validator/builder implementation map |
| CFG-G-03 | P0 | 确定性来源 | 一份 selected strict JSON 是唯一外部内容；source selector 只选文档，entry assertion 只做相等校验；static-derived 值不属于外部来源 | source/selection/conflict negative tests |
| CFG-G-04 | P0 | fail-closed profile/slot/job | 4 environment x 4 entry；13 slot；7 job；无 `Ready` | environment/config gate |
| CFG-G-05 | P0 | immutable operation capture | startup 发布一次；operation 绑定 snapshot ref；进程内不变 | concurrency/replay tests |
| CFG-G-06 | P0 | 禁止 secret/owner drift | raw secret/route/endpoint/body/owner truth/alias 一律拒绝 | security veto |
| CFG-G-07 | P0 | 完整失败语义 | parse/type/cross-field/binding/source/blocker 均有确定性错误或 negative posture | 05/06 failure matrix |
| CFG-G-08 | P0 | 下游可承接 | 05/06/07/09 不需重新发明字段、枚举、source 或 gate | traceability matrix |
| CFG-G-09 | P1 | change/audit/rollback preparation | 比较 redacted digest、审核、恢复 validated config 并 restart | operational design input |
| CFG-G-10 | P2 | 明确 future reopen | dynamic source/reload/vendor extension 不伪装成当前支持 | migration/reopen gate |

## 4. P0 范围

| 配置面 | 本文必须定义 | 明确不控制 |
|---|---|---|
| document format | UTF-8 strict JSON、duplicate/unknown rejection、12 exact roots | YAML/TOML/JSONC runtime input、extension map |
| bootstrap/profile | schema version、entry profile、environment validation class | process topology、readiness、deployment product |
| scope | exact entry authorities 和 typed scope policy assembly | actor/scope identity creation、scope expansion |
| context | count/weight/omission/freshness bounds | raw prompt/body、unsafe mandatory omission |
| working memory | window entry/compaction/stale policy | durable episodic/semantic body/index/delete |
| model decision | purpose、owner-neutral selection bounds、semantic schema ref、context requirement | provider/model product/route/secret/quota/cost |
| action guard | required guard/effect/freshness policy | approval、capability exposure、Tools/Sandbox execution truth |
| delegation | enabled 与 child depth/turn/action/context/duration bounds | member/container/child lifecycle、parent scope/budget expansion |
| checkpoint/recovery | allowed modes；stable/unknown rules static derive | fence closure、physical commit、unknown retry |
| handoff/projection | page/freshness/redaction ref；eligibility static derive | delivery/accepted/observed、projection domain write |
| idempotency | four retention values and digest schema | permanent uniqueness、exactly-once claim |
| adapter slots | 13 exact object entries and binding posture | endpoints、credentials、owner readiness、direct Sandbox slot |
| jobs | 7 exact object entries and bounded controls | cadence、scheduler、container/member lifecycle、unsafe retry selector |
| lifecycle | select/load/parse/validate/assemble/publish/startup failure | document merge、online hot reload、remote config control plane |
| change/failure | reviewed replacement、redacted audit identity、restart rollback、drift response | concrete ticket/alert/backend commands |

## 5. P0/P1/P2 交付边界

| 能力 | P0 contract | P1 preparation | P2 unsupported |
|---|---|---|---|
| source | one selected JSON + source selector + optional entry assertion | reviewed whole-document replacement | config center/admin |
| activation | startup once | restart with new validated config | in-process hot/reload |
| rollback | fix/restore file then restart | validated predecessor identity | automatic online LKG switch |
| adapter | Disabled/Blocked/Candidate schema | formal qualification may permit Candidate | Runtime-owned route/credential |
| environments | local/CI/integration/production candidate validation | controlled environment package | readiness-labelled profile |
| extensions | none | schema-versioned new field via reopen | arbitrary vendor map |

`Candidate`、`Bound`、`integration_candidate` 和 `production_candidate` 均不等于 operational readiness。

## 6. 非范围与唯一去向

| 非范围 | 唯一 owner/文档 | `04` 中的处理 |
|---|---|---|
| Rust struct/enum/trait/function/Flow 变化 | `03-详细设计.md` 受控重开 | 只登记影响，不静默新增 |
| concrete dependency/runtime/storage | implementation ADR + `07` | `not_selected`/blocker |
| deployment path/mount/command/service | `09-部署与运维手册.md` | 仅定义 source semantics |
| raw credential and provider settings | owning adapter/security design | forbidden key/value |
| tool/sandbox/capability/governance/method truth | respective upstream owner | ref/slot/blocker only |
| observability backend and evidence | Observability/Artifact + 05/06 actual run | safe event/audit field boundary only |
| member service/images/marketplace/product entry | owning product projects | explicitly excluded |
| test case/result/evidence/verdict | `05/06` + actual execution | only test/acceptance inputs |
| implementation repository/config artifact | `07` and implementation process | remains absent/not_started |
| commit | user-authorized git workflow | current `commit_required=false` |

## 7. 适用性判定

`L2-runtime` 不能裁剪为“无配置项目”。理由：

- 03 已定义 `RuntimeConfigSnapshot`、9 组 typed policy、13-slot set、7-job set 和 builder binding。
- Api/Worker/Jobs/TestFake 的 entry composition 不同，必须由 validated profile 决定暴露面。
- 上游 seam 尚未闭合时仍需要 explicit Disabled/Blocked posture，不能靠“没有实现”隐式表达。
- context/delegation/job/idempotency 的边界值必须由部署候选显式选择，不能由实现者私自写容量默认。
- strict JSON 和 forbidden-key 规则是防止 owner/secret/readiness 漂移的 P0 安全控制面。

## 8. 关键设计取舍

| 议题 | 选择 | 原因 | 未选方案 |
|---|---|---|---|
| runtime format | strict JSON | 标准要求；可做 exact/duplicate/unknown 审计 | YAML/TOML/JSONC runtime |
| root count | exact 12 | 与 03 唯一 typed owner 对齐 | `limits`、`observability`、`secrets` shadow roots |
| activation | startup-only P0 | 03 无 reload entry/flow；避免 in-flight/builder 漂移 | 自动 hot reload |
| numeric defaults | `none (required)` | 无容量/性能事实来源 | 继承旧 50/60/300 等数字 |
| negative posture | 所有 activation/blocker/ref leaf 显式出现；Disabled/Blocked 不允许省略字段 | full exact shape 且 fail-closed，不制造 readiness | omission、assembler fallback、Candidate/Ready default |
| secrets | raw secret zero-field | provider settings不归 Runtime | secret string/ref root |
| jobs retry | per-operation static derivation | 防止配置放宽副作用 retry | arbitrary retry enum key |
| slot identity | key-derived exact set | 防 alias、重复、mismatch | array with free-form slot string |

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 12 root 对应 9 policy + slot/job/profile | 否 | JSON mapping | 03 §13 已闭合 | 无回写 |
| P0 startup-only，operation snapshot immutable | 否 | 当前生命周期收窄 | `RuntimeConfigSnapshotPort` 已支持 | 无回写 |
| 不支持 in-process reload | 否 | 未来能力裁剪 | 未来触发时重开 03 | 无回写 |
| job operation/retry 从 key 静态派生 | 否 | 禁止配置化既有 field | 03 §13.4 exact mapping | 无回写 |
| numeric field 无 code capacity default | 否 | default/source 语义 | 不适用 | 无回写 |
| raw secret/route/endpoint 不进入 snapshot | 否 | 既有 owner 红线 | 03 §1/6/13 | 无回写 |

## 10. 改动前后与回填草稿

| 维度 | historical Step 2 | 当前结论 |
|---|---|---|
| P0 | 同时承诺 reload/limits/default | startup-only、typed-owner、无来源数值 required |
| source | 广泛 env override | JSON + 仅 profile selectors env |
| schema | 12 roots 但含 shadow carrier | 12 roots 1:1 current 03 |
| jobs | retry 可配置 | retry/operation key-derived static |
| rollback | online LKG 暗示 | validated file restore + restart |

正式 §2 应写入 CFG-G-01~10、P0/P1/P2 表、范围/非范围和适用性结论；不得写部署路径、实现任务或 readiness。

## 11. 自检与下一门禁

| 检查 | 结果 |
|---|---|
| P0/P1/P2 可区分 | pass |
| 所有非范围有唯一去向 | pass |
| 12-root applicability 明确 | pass |
| 无 reload/secret/backend/implementation fabrication | pass |
| blocker 不被范围裁剪为 positive | pass |
| 03 影响没有待回写/阻塞待确认 | pass |

```text
step_02 = done
gate_status = pass
gate_reason = scope_and_non_scope_closed; startup_only_p0_selected
next_allowed_action = delete_and_rebuild_step_03_control_plane
formal_04_write_allowed = false
commit_required = false
```
