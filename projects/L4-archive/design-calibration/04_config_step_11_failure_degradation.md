# Step 11. 定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 正式回填：`04-配置设计.md` §11
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 12）

## 1. Step 状态、输入与边界

| 项 | 结论 |
|---|---|
| 当前 Step | Step 11：配置失效、降级与 fail-fast |
| 输入 | Step 5 来源/冲突规则、Step 7 配置项、Step 9 加载/校验/生效、Step 10 变更/回滚、03 §11/§14/§15 错误和观测边界 |
| 输出 | 失效模式表、profile/配置域策略、告警与测试切口、降级红线和恢复动作 |
| 总原则 | 影响安全、真相、完整性、恢复、授权、事务或外部效果的配置失败必须 fail-fast 或 fail-closed；只有不影响业务真相的 telemetry sink 可 degraded/drop |
| 术语 | `fail-fast`=阻止 candidate/assembly/入口继续；`fail-closed`=拒绝危险动作并保留明确 blocked/unknown；`degraded`=有限非真相能力继续；`last-known-good` 仅指受控新 assembly 前的现存安全运行，不是 online fallback |
| 本步不做 | 不定义告警产品、SLO/RTO 数值、自动修复、盲重试、secret provider、供应商健康判定或 owner 状态推导 |
| 下一动作 | 同步 flow/台账后进入 Step 12 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必填配置缺失时如何处理？ | startup required field 缺失→candidate reject、assembly 不暴露 facade；job-run-start 条件项缺失→当前 job rejected/blocked；entry-local 缺失→当前入口拒绝。不得用低优先级来源、空值、zero 或 fake-success 补齐。 |
| 类型/范围/交叉字段错误如何处理？ | strict JSON parse、duplicate/unknown/alias、type/range、cross-field 任一失败都拒绝整份 candidate；不部分应用，不回退低优先级值。关联 job/入口保持原 active assembly 或明确 rejected posture。 |
| secret/KMS/Vault 不可用如何处理？ | P0 不假设具体 provider。opaque ref 无法由受控 adapter 解析时，required capability 为 `Unavailable/Blocked`；不把 raw ref 当 secret、不重试危险 effect、不启用 fake。非必需 telemetry/sink 可 drop。 |
| config center 不可达如何处理？ | 当前设计不使用 remote config center；若未来出现该来源，因不在 allow-list 而 `UnsupportedSource`，candidate reject。不得在线拉取或使用未验证 LKG。 |
| 配置漂移/过期如何发现？ | 通过 config/binding identity、schema revision、profile 和 job pinned identity 的一致性检查发现；不以时间或外部健康猜测。发现不一致→新入口/任务 blocked 或 rejected；旧已提交历史不改写。 |
| 是否允许降级？ | 仅允许安全 telemetry sink、可选 observability material handoff 和明确 optional surface 的有限 degraded；不允许对 required store、authority/visibility、source fence/coverage、integrity/compatibility、storage/receiver、governance decision、codec/cursor 或 redaction fail-open。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 历史材料把“连接失败”统一写成重试或默认切换 | 可能重复外部 effect 或伪造成功 | 按 local commit、external dispatch、owner decision、telemetry 四类边界分离姿态 |
| 旧文档有具体存储/配置中心假设 | 会把不可用供应商变成硬依赖 | config center 不在 P0；storage/secret 仅 opaque slot，合同缺失即 blocked |
| `Ready`、`accepted`、`ACK` 容易被误读为产品可用 | 失效时可能继续暴露危险 facade | Ready 只表示本地 assembly；accepted/ACK/Committed 各自按 03 状态语义，不能互相升级 |
| last-known-good 术语可能掩盖在线漂移 | 旧 binding 与新 candidate 混用 | 禁止 online LKG/hot；只允许在新 assembly 完成前保留现有安全实例，不迁移旧 work |
| worker 重试配置未知 | 自动 retry 可能无限或放大 effect | retry/probe budget 缺失时不自动重试；先保持 Unknown/Blocked，等待显式 reconcile/new invocation |

## 4. 失效模式矩阵

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| 配置文件不存在/不可读 | 无法形成 candidate | `ParseFailed`/candidate reject；不暴露 facade | 是（safe issue category） | missing file、permission/read failure |
| JSON 语法错误、重复/未知/alias key | 配置语义不确定 | 整份 candidate fail-fast；不回退 | 是 | strict parser matrix |
| 必填字段缺失或 null/zero | required capability 不完整 | startup fail-fast；条件 job blocked | 是 | each required key absent/zero |
| 类型/枚举/范围错误 | 参数可能越界或改变边界 | candidate reject；高优先级非法值不 fallback | 是 | type/range/enum boundary |
| cross-field 冲突 | slot、profile、target 或预算关系不一致 | candidate reject；不部分 assembly | 是 | profile/slot/owner/cursor/budget matrix |
| raw secret/body/credential 出现在普通来源 | 泄露或非法信任 | `ForbiddenSecretMaterial`；fail-closed，不记录值 | 是（不带值） | redaction and forbidden-material input |
| required slot 缺失、错配或 `Degraded` | facade 可能越权/无能力 | assembly failed；不暴露 affected/all facade | 是 | exact required-set/marker-only/fake rejection |
| source owner/fence/coverage contract unknown | 快照不完整或非 canonical | source item/target `Blocked/Partial/Unknown`；不宣称 complete | 是（safe source class） | missing/stale/conflicting/unknown source |
| authority/visibility/redaction 不可用 | 访问或输出可能越权 | query/mutation surface blocked；不 fail-open | 是 | denied/unknown/unavailable/redaction conflict |
| integrity/compatibility capability unknown/unsupported | 无法证明 Bundle 可验证/可读 | assessment blocked/unknown；不恢复、不 seal success | 是 | unsupported version/integrity failed |
| storage/lifecycle binding 或 governance decision 缺失 | 可能误放置/误删除 | no dispatch；cleanup disabled/blocked；不生成 retention/delete decision | 是 | missing storage/decision/schedule |
| restore receiver/schema map 不完整 | 可能写错 owner | per-item/plan blocked；不 all-owner fallback | 是 | owner totality/unsupported receiver |
| inbound family/trust schema unknown | 未可信输入可能改变状态 | reject/quarantine；不 ACK success | 是 | unknown family/schema/duplicate receipt |
| operation key/input codec 缺失 | duplicate 无法安全判断 | mutation reserve blocked；不借 Bundle digest | 是 | codec absent/mismatch/same-different input |
| cursor mapping/codec 缺失或漂移 | continuation 可能泄露/错页 | continuation blocked/NotAvailable；不回传 private cursor | 是 | stale/mismatch/expired cursor |
| budget relation invalid/unknown | 资源放大或无限等待 | startup fail-fast 或 affected job rejected；不隐式默认 | 是 | page/batch/timeout/retry/probe/lease ordering |
| secret/provider/ref 解析不可用 | required adapter 无法安全构造 | `Unavailable/Blocked`；不 fake fallback、不盲重试 | 是（无 provider detail） | adapter resolution unavailable |
| config center source appears | 未授权来源覆盖配置 | `UnsupportedSource`；不在线读取/LKG | 是 | remote source rejection |
| config/binding identity drift | old work 与 current candidate 不一致 | old work 使用 pinned；新入口/恢复 blocked，需新 run | 是 | pinned identity mismatch |
| external effect timeout/MayHaveDispatched | 事实未知，重派有重复风险 | `CommitUnknown/ReconcileRequired`；只 probe/reconcile | 是 | timeout, duplicate feedback, probe |
| local commit timeout/unknown | 本地提交状态未知 | `probe_commit`；未确认前不重放/重派 | 是 | commit unknown/probe outcome |
| telemetry sink unavailable/redaction failure | 观测信号丢失 | drop/degraded；不改变业务 UoW/result，不递归 | 可选 safe counter | sink timeout, redaction fail |
| audit/material handoff unavailable | 外部材料未交接 | 保留本地 native record；handoff blocked；不称 evidence complete | 是（safe category） | observability handoff unavailable |

## 5. 按配置域的降级边界

| 配置域 | 允许降级 | 禁止降级/必须 fail-closed | 失效后可见姿态 |
|---|---|---|---|
| `profile`/`assembly` | 无（candidate 可被拒绝） | 不得缩减 required set、切换 fake 或放宽 surface | `Failed`/`Blocked` |
| `stores` | 测试 harness 可明确 fail-fast | production store、UoW/CAS/probe 不得空实现 | assembly blocked；local Unknown 保留 |
| `sources` | 单个非必选 auxiliary/material 可标 unavailable | canonical source、fence、coverage 不得 workspace fallback | per-source Partial/Unknown/Blocked |
| `authority_visibility` | 无危险 surface 的诊断可继续 | authority、visibility、redaction 不得 fail-open | query/effect blocked |
| `integrity_compatibility` | 仅记录 unknown/unsupported assessment | 不得把 unknown 当 verified/compatible | assessment blocked/unknown |
| `storage_lifecycle` | 非执行性诊断可继续 | no dispatch、no cleanup、no delete/hold/risk inference | effect/lifecycle blocked |
| `restore_receivers` | 其他 owner item 可独立继续（若其合同完整） | 缺 receiver 不得 all-owner fallback | per-item partial/blocked |
| `inbound` | 未暴露 family 可 disabled | 已暴露但不可信不得 ACK success | quarantine/rejected |
| `operation_cursor` | 不支持 continuation 时可提供首页面（若 current query contract允许） | mutation 无 codec、cursor mapping不完整不得继续 | reserve/continuation blocked |
| `budgets` | 无 | 不得 zero/default/无限；关系未知即拒绝 | startup/job rejected |
| `observability` | sink drop、material handoff blocked | 不得改变业务结果、redaction 或 native audit义务 | degraded/dropped signal |

## 6. 配置失效处理流程

#### 配置加载流程图: L4-archive 失效分类与安全处置

```text
[source / candidate]
          |
          v
[parse + type/range + cross-field]
     invalid? | yes
          v
 [fail-fast: reject candidate]
          |
          no
          v
[assemble exact required slots]
 missing/mismatch/degraded? | yes
          v
 [fail-closed: no facade/effect]
          |
          no
          v
[entry / job / external boundary]
 local commit unknown? -> [probe_commit]
 external may-have-dispatched? -> [probe/reconcile]
 telemetry sink/redaction issue? -> [drop/degrade only]
          |
          v
[typed posture + safe issue + native history when committed]
```

关键说明:

- 图把配置错误、assembly 缺陷、local/external Unknown 与 telemetry 丢失分开；不把它们都归为 retry。
- `probe_commit` 和 external reconcile 必须使用 03 已定义的 typed boundary；没有 probe 合同时保持 Unknown/Blocked。
- safe issue/telemetry 不能证明外部成功、readiness、evidence 或验收通过。

## 7. 告警与测试切口边界

| 类别 | 可观测信号 | 禁止推断 | 测试承接 |
|---|---|---|---|
| fail-fast candidate | safe issue category、profile/domain class | 不推断部署成功或配置已发布 | 05 配置 parse/type/cross-field |
| assembly blocked | slot family、posture、issue ref | 不推断 provider 故障细节或 readiness | 05 required-slot/fake rejection |
| source/owner blocked | source class、partial/unknown | 不推断 canonical completeness | 05 source matrix |
| effect unknown | target kind、commit/reconcile posture | 不推断 dispatched/committed | 05 unknown/reconcile |
| telemetry degraded | signal kind、suppressed counter | 不推断业务失败或成功 | 05 sink/redaction non-interference |
| identity drift | config/binding revision category | 不重放旧 work、不推断数据损坏 | 05 pinned identity |

## 8. 失效策略停审与跨域审计

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 必填、类型、范围、cross-field 失败是否 fail-fast | 是 | 整份 candidate reject；无低优先级 fallback |
| required capability 不可用是否 fail-closed | 是 | 不暴露 facade、不派发危险 effect |
| owner/source/integrity/storage/receiver 缺口是否被默认值掩盖 | 否 | 保持 blocked/partial/unknown/unsupported |
| local/external Unknown 是否有独立 probe/reconcile | 是 | 无合同则不自动重试，保持 Unknown |
| telemetry sink failure 是否影响业务结果 | 否 | 只 drop/degrade；不回滚、不重跑 |
| config center/LKG/hot 是否误进入 P0 | 否 | unsupported source/activation；需未来回写 |
| profile 间 fail-open 差异是否存在 | 否 | local/CI 也不能放宽 truth/security boundary |
| 03 错误/状态/审计语义是否被重新定义 | 否 | 只引用既有 typed posture；无新代码契约 |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| required/安全/真相相关失败统一 fail-fast/fail-closed，telemetry 可 degraded | 否 | 承接既有 errors/state/observability | 不适用 | 无回写 |
| local commit Unknown 与 external MayHaveDispatched 分走 probe/reconcile | 否 | 承接 Step 11/12/15 | 不适用 | 无回写 |
| config center、hot、online LKG 继续 unsupported | 否 | 配置生命周期边界 | 不适用 | 无回写 |
| 若未来新增自动修复、retry state、health API 或新的降级 facade | 是（未来触发） | error/state/port/flow contract | 03 §6～§15 | 无回写（触发前暂停） |

## 10. 回填草稿与进入下一步条件

正式 §11 应回填失效模式矩阵、按配置域降级边界、失效流程图、告警/测试切口和跨域审计结论。不得回填供应商健康、自动修复、默认数值或未经授权的 readiness 声明。

| 条件 | 状态 |
|---|---|
| 缺配置、错配置、不可达、过期/漂移均有处理方式 | 通过 |
| 高风险失败无 silent fallback | 通过 |
| fail-fast/fail-closed/degraded 边界可判定 | 通过 |
| local/external Unknown 与 telemetry failure 未混淆 | 通过 |
| 当前无 03 待回写项 | 通过；未来新 API/state/port 为触发器 |
| 跨失效策略审计无 unresolved 冲突 | 通过 |
| 可进入 Step 12 | 通过 |
