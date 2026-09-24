# Step 10. 定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10
> 回填章节：`04-配置设计.md` §10
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_10_change_audit_rollback.md`
> 输入：Step 7～9、03 Step 12/13/15
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与范围

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 10 |
| current_module | `change:audit_and_rollback` |
| gate_status | `pass_for_step_11` |
| gate_reason | 变更角色/风险级别、逐域评审、生效、安全记录、whole-document rollback、Job snapshot 和跨变更审计均已闭合；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_11_failure_degradation.md` |

Runner runtime 不提供 admin 配置写 API，也不拥有正式 configuration audit/evidence truth。本文只定义外部 configuration/release owner 必须满足的产品中立变更语义，以及 Runner loader/builder 的安全响应；不指定工单、审批、artifact store 或命令。

## 2. SOP 问题回答与取舍

| 问题 | 收口回答 |
|---|---|
| 谁可变更？ | 由外部 configuration/release maintainer 或受控 automation 生成/选择完整文档；authorized entry caller只能选整份文档/profile；authorized Job caller只能提交 03 已有 run-local输入；test harness只改 test fixture。用户页面、domain/application、owner response不得修改配置。 |
| 哪些需评审？ | 每份文档变更均需基本 review。profile/store/binding/redaction/determinism/idempotency/retry/feature false→true/敏感 ref 属高风险；fake进入非test、raw secret、guard/invariant放宽、hot/admin override直接 reject/design change。 |
| 如何生效？ | 创建完整新文档→离线/启动校验→新 config identity→new assembly。Job run-local变更只影响新 run；不存在 leaf patch/hot reload/当前 builder 原地替换。 |
| 如何审计？ | 正式记录由外部 owner 持有，至少含 document/version ref、old/new redacted digest、safe section/key class、actor/reviewer/reason/change refs、validation/activation outcome、rollback target ref；禁止 raw values/body/secret/full sensitive ref。 |
| 如何回滚？ | 选择上一份仍获批准且在当前 schema/authority 下重新校验通过的完整文档，创建新 assembly。不能把内存对象、旧缓存或“曾经可用”当自动 LKG。 |

| 风险候选 | 取舍 |
|---|---|
| runtime admin toggle/remote patch | 否决；会新增 authority、concurrency、audit和rollback contract |
| 单 key 回滚 | 否决；可能破坏 cross-field 与 snapshot basis |
| 新 bootstrap失败自动切回旧文档 | 不称自动回滚；当前实例可保持其冻结 snapshot，外部 owner明确选择/复核rollback artifact |
| adapter运行时 unavailable触发换config | 否；这是 dependency/recovery，不是配置回滚依据 |
| Runner本地日志作为正式审计 | 否；只可 safe diagnostic marker |
| 已开始 Job随配置变更 | 否；保持原 snapshot/basis，new run使用新配置 |

## 3. 变更角色与风险级别

| 角色边界 | 允许 | 禁止 | 安全记录 |
|---|---|---|---|
| configuration/release maintainer ref | 提交完整 startup document、选择 rollback target | 绕过 validator、修改 owner/domain truth、写 raw secret | actor/change/reason/reviewer refs + document digest/result |
| release/config automation ref | 对已批准 artifact 执行 selection/validation/new assembly | 自动批准高风险变更、猜 LKG | automation/run ref + source/config refs + result |
| entry caller ref | 选择一个完整 source/profile并启动新入口 | leaf override、持久化全局 config、传 secret | entry/source selector class + result |
| authorized Job caller ref | 提交已有 protocol 的 bounded run-local input | 扩大 cap、改 global snapshot、重用 conflicting idempotency key | job/run/input digest/result |
| test harness ref | 选择 fixture/fake test document | 进入 local/integration/product runtime | test/fixture digest/profile |
| design authority ref | 改 schema、slot、lifecycle、VETO | 当普通 config 变更 | design review/baseline ref（由正式流程提供） |

| 级别 | 适用 | 最低要求 |
|---|---|---|
| low | 文档说明、在已有 authority cap内收窄 run-local page/batch | validation + safe change record |
| medium | test fixture、local-safe presentation/disabled peripheral变化 | reviewer/automation approval + rollback target |
| high | profile、stores/cache、external slots、redaction、clock/id/digest、limits/horizons/retry、feature启用、sensitive refs | architecture/security/contract/operations中相关 owner review + rollback plan |
| critical/rejected | raw secret/body、fake污染非test、redaction/guard/no-write/no-replay放宽、owner truth override、hot/reload/admin bypass | 不得激活；若确需改变先重开 00～04/03 |

## 4. 配置变更表

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 安全记录 | 回滚/失败 |
|---|---|---|---|---|---|
| schema/profile/source selector policy | maintainer/design authority | high；schema扩展先设计 review | new document/new assembly | old/new schema/profile class、digest、review refs | previous approved whole document revalidate；unsupported不激活 |
| stores/cache refs | maintainer/automation | high：durability/UoW/version/quarantine/protection | new assembly | slot、old/new redacted ref digest、capability result | rollback whole document；能力不足 builder blocked |
| external/platform binding refs | maintainer/automation | high：public contract/SDK/security | new assembly | slot、ref digests、contract/readiness class | rollback whole document；不fallback private/fake |
| numeric limits/hard-cap relation | maintainer/authority；Job caller只可收窄 | high for startup/widen；low for run-local narrowing | new assembly/new Job | policy class、old/new value digest/range class、authority ref | previous document/new run；无authority不激活 |
| idempotency windows/retry policy | maintainer/authority | high：commit-unknown/no-replay/recovery | new assembly/new Job where allowed | policy ref digest、horizon validation、review refs | previous document；不得删除 unresolved或自动 replay |
| redaction binding/policy | maintainer/security authority | high/critical if relaxing | new assembly | policy/binding digest、validation/reviewer refs | previous stricter approved document；失败无 visible content |
| diagnostic/handoff/telemetry refs | maintainer/contract owner | high when enabled | new assembly | slot/ref digest、feature transition、availability class | disable via reviewed whole document/new assembly；业务truth不回滚 |
| clock/id/digest refs | maintainer/implementation authority；test harness in test | high outside test；medium test | new assembly/test startup | provider family/digest/profile/result | previous approved ref；mutation blocked until valid |
| feature false→true / target ref | maintainer/contract/security owner | high，formal prerequisite required | new assembly | feature class、ref digest、contract result | reviewed false document/new assembly；不把失败改success |
| feature true→false | maintainer | medium；确认不破坏core dependency | new assembly | transition + affected surface | previous whole document if needed |
| Job run-local policy/target | authorized Job caller | protocol/limit validation；不能扩大 startup cap | new run only | run/input digest、effective policy/config ref | reject当前run；用previous valid input建新run，旧report不改 |
| test fixture | test harness | test review/fixture isolation | test startup | fixture digest/profile/test run ref | previous fixture + rerun；无生产fallback |
| forbidden key/material/VETO override | any source | critical reject | no activation | safe forbidden class + issue/source ref | 无runtime rollback；文档修复或正式design change |

## 5. 安全审计/变更记录字段

| 字段类别 | 必填 | 语义 | 禁止 |
|---|---:|---|---|
| document/source/version ref | startup change yes | 外部 configuration artifact identity | raw document/path/URL |
| old/new redacted canonical digest | change yes | 比较完整 snapshot，算法待 implementation authority | secret/full sensitive ref/plain diff |
| safe section/key/slot/policy classes | yes | 定位受影响控制面 | raw values |
| actor/reviewer/reason/change refs | high yes | 外部 formal record correlation | 人员正文、credential、审批正文 |
| validation outcome + safe issue refs | yes | accepted/rejected/blocked and why | raw parser/provider error |
| activation kind/result | yes | new assembly/new Job/test/rejected | hot/reload success value |
| config/profile refs | yes | 当前 snapshot correlation | 将 config_ref称artifact/evidence digest |
| rollback target/change ref | high yes | 明确回退选择 | implicit LKG/“latest good” |
| timestamp/trace | 由可信外部/本地 clock按边界提供 | correlation only | owner time/evidence claim |

Runner 可生成本地 safe config-validation/assembly marker供诊断，但它不是正式审计、evidence、verdict、signoff 或批准记录。本设计未生成任何真实 record、digest、artifact 或 change ref。

## 6. 回滚与并存 snapshot 矩阵

| 场景 | 旧 runtime/Job | 新 assembly/run | 恢复/回滚 | 禁止 |
|---|---|---|---|---|
| source/parse/type/cross-field失败 | 已运行实例保持其 immutable snapshot，生命周期不被隐式改变 | 不构造 | 修正文档或显式选择previous approved document并重验 | 自动lower-priority/LKG fallback |
| core store/provider builder失败 | 旧实例不被新配置原地修改 | facade不暴露/affected mutation blocked | whole-document rollback + new assembly | 删除失败slot后绕过review |
| optional slot unavailable after activation | 旧实例按per-slot degraded/unavailable | N/A | dependency recovery；必要时经评审新文档 | 自动换private/fake adapter或改truth |
| 新配置合法但表现异常 | 旧/新实例生命周期由host/product owner明确管理 | 新实例可安全停止/替换 | reviewed previous artifact重新验证并new assembly | 从UI toast/log推断rollback成功 |
| sensitive provider rotation失败 | 已开始调用/Job按其basis进入typed outcome | 新 assembly/operation blocked | previous still-approved ref或新approved ref；重验 | 输出material、偷偷复用旧secret |
| 已开始 Job期间startup配置改变 | Job继续使用原 config/policy basis | new Jobs使用new snapshot | 不回滚旧 Job；必要时新run/reconcile | 中途热改timeout/retry/target、改写report |
| Unknown/commit-unknown存在 | recovery case/records保持 | config rollback不解决effect uncertainty | query-first/manual review；不 replay | 借rollback重发副作用/删除unresolved |
| previous artifact不兼容/撤销 | 不能因“曾可用”信任 | 不构造 | 创建新的approved修复document | 强行回滚或latest搜索 |

## 7. 逐域停审与跨变更审计

| 域 | 权限/评审 | 生效 | safe record | 回滚 | 结论 |
|---|---|---|---|---|---|
| runtime | high | new assembly | profile/source/digest | whole document | pass |
| stores | high capability review | new assembly | slot/digest/result | whole document | pass with physical blocker |
| bindings | high contract/security | new assembly | slot/digest/readiness | whole document | pass with upstream blockers |
| limits | authority/high；run-local narrowing | assembly/new Job | class/digest/horizon | whole doc/new run | pass pending authority |
| observability | security/contract high | new assembly | policy/slot digest | stricter/previous doc | pass with blockers |
| determinism | high outside test | assembly/test | provider family/digest | previous ref | pass |
| features | high enablement | new assembly | transition/prerequisite | false/previous doc | pass |

| 跨变更审计项 | 结论 |
|---|---|
| high-risk是否都有评审、安全记录和rollback | yes |
| 是否假设具体ticket/audit产品 | no |
| 是否允许leaf/hot/admin patch | no |
| sensitive/raw material是否进入change record | no |
| rollback是否绕过current schema/authority | no |
| old/new snapshot是否混用 | no |
| Job report/result是否被rollback改写 | no |
| Unknown是否因rollback自动replay | no |
| Runner local log是否冒充formal audit | no |
| 是否生成真实audit/evidence/artifact | no |

## 8. 03 影响、回填与门禁

| 结论 | 是否影响 03 | 类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| whole-document/new-assembly变更与rollback | 否 | configuration governance | N/A | 无回写 |
| 已开始Job冻结snapshot，stored report不改写 | 否 | 承接既有basis/idempotency | N/A | 无回写 |
| Runner不拥有formal config audit | 否 | truth/evidence boundary | N/A | 无回写 |
| future runtime admin/remote config/hot switch/automatic LKG/secret live rotation | 是 | port/builder/lifecycle/concurrency/audit/error | 03 Step 6/7/9/12/13/14/15 | 当前排除，未来重开 |

未来正式 §10 应回填角色/风险级别、变更表、safe record字段和回滚矩阵；不得写具体审批系统或声称已产生记录。

| 待确认事项 | 当前处理 |
|---|---|
| exact configuration/release owner、artifact/version/digest机制 | 外部 authority/07/09 pending；只定语义 |
| runtime instance lifecycle/zero-downtime切换 | `RUN-DDD-002`；P0不定义在线切换 |
| production smoke/rollback oracle | 05/06/09承接；当前无测试/验收事实 |

| 进入 Step 11 条件 | 结论 |
|---|---|
| 每类变更 actor/review/activation/record/rollback 可判定 | pass |
| 敏感、Unknown、Job snapshot 和 formal audit 边界闭合 | pass |
| 跨变更审计无 unresolved 内部冲突 | pass |
| 无当前 `待回写`/`阻塞待确认` 03 影响 | pass |

Step 10 完成，允许进入 Step 11；正式 04 仍不可写。
