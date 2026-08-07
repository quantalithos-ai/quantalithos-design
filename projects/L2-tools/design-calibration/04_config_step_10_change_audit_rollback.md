# L2-tools 04 配置设计 Step 10：配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.10
> 回填目标：`projects/L2-tools/04-配置设计.md` §10
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 10 定义变更 actor、风险级别、评审、审计、activation 和 rollback。 |
| 前序门禁 | Step 9 `completed / pass`；P0 只有 startup/entry-local/job-startup/static，没有 hot/reload。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 正式写入 | 关闭；只形成 §10 回填草稿。 |
| blocker | 无新增；外部 blocker 不能通过配置变更关闭。 |
| 下一动作 | 连续授权下进入 Step 11 失效模式。 |
| 提交 | 不需要。 |

### 1.1 Step 内计划

- [x] 读取 SOP Step 10、书写规范、Step 7~9 和 `03` phase/redaction/unknown 约束。
- [x] 按配置语义划分 low/medium/high/critical 变更风险。
- [x] 定义 actor/approval/safe audit field，不绑定具体工单系统。
- [x] 定义 startup、entry、job 和 rejected change 的 rollback。
- [x] 补敏感 ref 轮换、上游 blocker 和 unknown fence 的附加门禁。
- [x] 完成变更停审、跨审计/回滚审计和 `03` 影响判定。

## 2. 本步目标与边界

配置变更不是业务 Command，不创建 Tool/Binding/Invocation/Outcome/Audit truth，也不是在线管理 API。本 Step 只规定配置 artifact/ref 在进入下一次 assembly、entry 或 Job 前必须满足的治理条件。

P0 的 global rollback 是“取此前已批准且当前仍有效的完整候选，重新执行 V0~V8 和 B0~B8”；不是把运行中 object 改回、跳过 validator、使用低优先级值掩盖错误，或恢复 revoked/compromised secret material。

## 3. 本步输入与 SOP 问题回答

| 问题 | 当前回答 |
|---|---|
| 谁可发起 | release/config automation、受授权 operator、测试 harness owner、entry/job caller；均以 opaque `actor_ref` 记录，不由 L2 定义 IAM。 |
| 哪些需评审 | adapter/Store/UoW/replay/target/safety/profile 等 high；安全放宽、raw secret、fake production、hot/reload、truth override 属 critical reject/design-change。 |
| 如何生效 | global 新 assembly/restart；entry-local 重新调用；job-startup 创建新 Job snapshot；static override 不生效。 |
| 如何审计 | safe refs、section/slot、profile、activation、old/new safe digest、validation result/issue、rollback ref；无 raw diff/value/full sensitive ref。 |
| 如何回滚 | 重新装配 previous approved candidate，且需重新校验当前有效性；entry/job 以新请求重新运行。 |
| 异常如何处理 | 新 graph 未激活则保留旧运行实例由 deployment owner管理；L2 不定义 online LKG 或 traffic switch。已激活后异常需明确新 deployment/restart，不 live patch。 |

## 4. 当前材料诊断、对比与取舍

| 项 | 本步前 | 本步后 |
|---|---|---|
| 变更主体 | 仅 source/profile | actor class、review level 与 section 风险明确。 |
| 审计 | 有 safe config identity | 固定 audit allowlist 和敏感 digest限制。 |
| 回滚 | 知道 new assembly | 明确 previous candidate 重新验证、revoked material不可回滚。 |
| entry/job | 有冻结语义 | 明确新 entry/job，旧 result/report immutable。 |
| critical | 仅 unsafe override error | 列出 reject/design-change 类别和无运行时回滚。 |

设计取舍：不选具体 ticket/approval/secret平台；不创建 L2 config audit Store；配置变更审计由部署/release owner持有，L2 只定义安全记录字段。若未来要求 runtime admin API、online rollout/LKG 或审计 repository，须先回写架构与 `03`。

## 5. 结构化中间产物

### 5.1 变更风险与评审层级

| 级别 | 配置变更 | 发起方 | 评审要求 | 生效 |
|---|---|---|---|---|
| low | bounded selector/limit 在既有安全范围内收紧；关闭可选外围 feature | caller/release automation | automated validation + actor attribution | new entry/Job 或 new startup assembly。 |
| medium | local-dev/ci-test/integration-like profile、显式 fixture、blocked-aware mode、bounded policy category | profile/test/release owner | reviewer/approval ref + full validation | new assembly/test run。 |
| high | seven Store/UoW/idempotency refs、adapter/visibility/target refs、retention/retry/timeout、安全 policy ref、开启外围 external feature | authorized config/release owner | independent review、reason、rollback plan、safe digest、V0~B8 gates | new assembly/restart；Job target snapshot另审。 |
| critical | redaction/body-free 放宽、raw secret/body、fake/fixture进入 real-like、hot/reload/admin/config center、UoW/pair/idempotency/query-write/unknown fence/truth override | any attempt | P0 直接 reject；若业务确需则正式设计变更 | 不生效。 |

### 5.2 配置变更总表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录 | 回滚方式 |
|---|---|---|---|---|---|
| ordinary bounded value | release automation/operator | low/medium by section | complete candidate + startup or new scope | actor/source/section/digest/result | previous candidate重新校验装配。 |
| profile/source selection | release/test owner | medium；real-like high | startup/entry selector | actor/profile/source class/result | previous valid selector/candidate。 |
| Store/UoW/sidecar ref | release/storage owner | high + capability review | B1~B2 new graph | slot/kind/safe digest/capability/result | previous still-valid complete group + restart。 |
| external adapter/visibility ref/mode | integration/release owner | high；blocker owner input | B3~B4 new graph | slot/mode/blocked category/result | previous validated blocked-aware graph。 |
| handoff target/policy | integration/job owner | high + one-call/unknown review | startup registry or new Job snapshot | target class/count/set digest/policy/result | new Job with previous target snapshot；不重放旧 unknown。 |
| Clock/ID/fixture | test/release owner | medium；real-like high | new graph/test assembly | slot/profile/mode/result | previous valid refs；不改旧 identity。 |
| feature registration | release/integration owner | low when disable；high when enable external | B7 new graph | feature/dependency completeness/result | previous complete graph。 |
| redaction/body policy | security/release owner | high if equal/stricter；weaken critical reject | B8 new graph | policy class/safe digest/result | previous non-revoked equal/stricter policy。 |
| secret/provider material | provider/security owner，非 L2 config actor | provider process + high config review | provider update then new assembly | only safe provider audit ref + config result | revoked/compromised material不可回滚；fix-forward。 |
| unsupported lifecycle/source | any | critical reject | none | actor/attempt class/issue ref | remove request or formal design change。 |

### 5.3 配置变更审计字段

| 字段 | 必填 | 说明 | 禁止 |
|---|---:|---|---|
| `change_request_ref` | high/critical | 产品中立变更引用 | ticket body/free text。 |
| `actor_ref` | 是 | human/automation/test/job caller opaque ref | credential/personal body。 |
| `reason_ref` | high/critical | safe approved reason reference | raw approval text。 |
| `config_source_ref` | 是 | source class/ref | raw file/env。 |
| `profile_ref` | 是 | target profile | false readiness label。 |
| `config_section` / `adapter_slot` | 是 | canonical section/slot | full sensitive ref。 |
| `activation_kind` | 是 | startup/entry-local/job-startup/rejected | hot/reload success。 |
| `old_config_digest` / `new_config_digest` | startup | canonical safe projection digest | full config/raw secret-derived hash。 |
| `old_ref_digest` / `new_ref_digest` | sensitive high | 仅已定义 safe projection | full ref/endpoint/credential identity。 |
| `validation_result` | 是 | accepted/rejected/assembly-failed | fabricated test/readiness。 |
| `validation_issue_ref` | reject/failure | typed safe issue | parser/backend body。 |
| `rollback_ref` | high | previous approved candidate/run ref | embedded rollback script/secret。 |
| `provider_audit_ref` | secret rotation optional/conditional | provider owner生成的safe ref | L2伪造provider访问记录。 |

### 5.4 变更审计链图

```text
[change intent + actor/reason refs]
              |
              v
[risk classification + review gate]
              |
        +-----+-----+
        |           |
   [critical]   [allowed candidate]
        |           |
    [reject]     [V0..V8]
                    |
               [B0..B8]
                    |
        +-----------+-----------+
        |                       |
    [failed]                [new assembly]
        |                       |
[safe issue audit]     [activation audit ref]
        |                       |
        +----> [rollback/fix-forward if required]
```

关键说明：审计链只表达设计门禁，不代表已选工单/部署系统；任何分支均不记录 raw config/secret；new assembly 不等于外部 readiness；critical 没有 emergency bypass。

### 5.5 回滚规则矩阵

| 作用域 | 成功判定 | 失败/异常 | 回滚 | 禁止 |
|---|---|---|---|---|
| startup | V0~V8 + B0~B8 complete；deployment owner完成切换 | validation/builder/activation owner失败 | previous approved candidate重新全量校验/装配/切换 | partial graph、skip validation、invalid source fallback。 |
| entry-local | selector valid且只作用当前 entry | selector/profile/snapshot invalid | 拒绝当前 entry；caller用旧selector新调用 | 写回global config/修改已完成result。 |
| job-startup | scope/target/bounds valid并冻结 | invalid/ineligible/conflict | 拒绝当前 Job；用新job identity/key按协议重启 | 改旧 report、不同digest复用key、unknown自动重调。 |
| sensitive ref/material | new ref/provider version valid且new graph complete | missing/revoked/expired/mismatch | 未 compromised 的 previous ref 可重装配；否则fix-forward | 恢复 revoked/compromised material、fallback fixture。 |
| blocked external contract | blocked-aware mapping仍符合当前上游事实 | blocker仍open或schema变更 | 保持/恢复previous blocked-aware graph | 用endpoint/fake变Available。 |
| critical reject | validation前/中拒绝 | unsafe attempt | 无runtime rollback；记录safe issue | emergency flag生效。 |

### 5.6 配置变更停审记录

| 变更组 | actor/评审 | audit | rollback | 敏感/失败 | 结论 |
|---|---|---|---|---|---|
| ordinary/profile | 完整 | safe fields | previous candidate | invalid no fallback | 通过 |
| Store/UoW/sidecar | high | slot/capability | complete group | no half graph | 通过 |
| adapters/blockers | high | blocked category | previous graph | no readiness upgrade | 通过 |
| handoff/Job | high | target class/set | new Job | unknown fence | 通过 |
| Clock/ID/fixture | medium/high | profile/mode | new assembly | no old identity mutation | 通过 |
| feature/safety | low/high/critical | feature/policy | complete graph/fix-forward | core invariant fixed | 通过 |
| secret/provider | provider + high | safe ref only | no compromised rollback | no material output | 通过 |

### 5.7 跨变更审计 / 回滚审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| high 风险是否无评审 | 通过 | independent review/reason/rollback required。 |
| 是否假定具体工单/secret平台 | 通过 | 只用产品中立 refs。 |
| 是否存在 online hot/LKG | 通过 | P0 reject。 |
| rollback 是否跳过当前 validation | 通过 | previous candidate也须重走V0~B8。 |
| sensitive 是否泄露或恢复 compromised material | 通过 | safe projection only；compromised fix-forward。 |
| entry/job 是否改写旧 truth/report | 通过 | 只创建新 entry/Job。 |
| blocker 是否通过变更被关闭 | 通过 | `L2T-UP-001~009` 只能由 owner contract关闭。 |
| 是否需要新 `03` config audit Store/API | 通过 | 未定义本地Store/API；当前无回写。 |

## 6. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| startup/entry/job 变更与重新装配 | 否 | config governance detail | 03 §13.3 | 无回写 |
| sensitive ref rotation/new assembly | 否 | lifecycle detail | 03 §13.2~§13.3 | 无回写 |
| no automatic retry after unknown | 否 | existing phase invariant | 03 §13.5~§13.8 | 无回写 |
| future admin API/hot rollout/LKG/config audit Store | 是 | API/lifecycle/persistence | 先回写 01/03 | future trigger，当前未触发 |

## 7. 回填草稿、待确认与门禁

正式 §10 应装配风险层级、变更总表、审计字段、审计链图和回滚矩阵。不得声明真实 actor、ticket、approval、deployment、rollback run 或 audit record 已存在。

| 待确认事项 | 影响 | 未确认前处理 |
|---|---|---|
| safe config/ref digest canonical projection | `05/06/07/09` | 未定义时省略digest，禁止full ref/hash。 |
| deployment owner如何原子切换进程实例 | `09` 运维 | 本文只规定新assembly barrier，不写切换命令。 |
| provider revoke/rotation audit schema | future production | 只接safe provider audit ref，不声明schema。 |

| 门禁 | 状态 |
|---|---|
| actor/评审/审计/回滚完整 | 通过 |
| high/critical 变更安全门禁 | 通过 |
| 敏感和 unknown 附加规则 | 通过 |
| 变更逐组停审/跨审计 | 通过 |
| 03 当前无回写 | 通过 |
| 下一动作 | 连续授权下进入 Step 11 |
