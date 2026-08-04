# L4-observability 07-实施计划 Step 07：测试与验收门禁嵌入

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.7
> 直接输入：current Step 05~06、`05-测试方案.md`、`06-验收标准.md`
> 文档性质：设计讨论中间产物。本文只定义 planned gate，不表示测试已运行、artifact/report 已生成或验收已通过。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 07 / 测试与验收门禁嵌入` |
| mode | `full-restart` |
| status | `completed_current_step_07` |
| current module | `test-acceptance-evidence-gate-matrix` |
| upstream | current Step 01~06；current formal `05/06` |
| test baseline | 99 TC、82 DS、9 primary suite、6 environment lane、3 runtime profile、5 script/check |
| acceptance baseline | 31 AC、24 NFR、8 NFG、10 VF、9 EVG |
| execution reality | target repo、runner、CI/INT/RT、真实 `<run_id>`、artifact/report/evidence 均不存在 |
| design gate | `pass_with_affected_and_environment_preconditions` |
| new upstream blocker | `none` |
| inherited affected | 12 项保持 open/controlled/conditional；见 §12 |
| next allowed action | `continue_to_step_08` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 current Step 05~06 和正式 `05/06` | phase/boundary/test/acceptance 输入 | done | 数量、ID、路径和状态口径可定位 |
| 固定 planned gate 与状态语义 | gate catalog、状态优先级 | done | 设计态与执行态严格分离 |
| 映射 phase 和 16 boundary | phase/boundary gate matrix | done | 每个 phase/boundary 至少一个测试门禁；适用者绑定 AC/VF |
| 固定 artifact/report/review 责任 | provenance 与 review 表 | done | canonical path、同 run、失败保留和人工/Agent责任明确 |
| 复核 affected、停审和跨门禁覆盖 | affected binding、audit | done | 无 orphan boundary、AC、NFR、VF 或证据归属 |

## 3. 输入权威与历史材料诊断

| 输入 | Current 用法 | 冲突处理 |
|---|---|---|
| `05-测试方案.md` §3~§14 | 唯一 current TC/DS/suite/lane/profile/script/artifact/report contract | 不沿用旧 suite alias、旧 case 数或静态 evidence 表 |
| `06-验收标准.md` §3~§14 | 唯一 current AC/NFG/VF/EVG、裁决、审查和签署边界 | 不沿用旧 VETO 名、旧硬阈值或旧 verdict |
| Step 05 | 8 个 phase 与依赖顺序 | 门禁不得改变 phase 或把后续能力前移 |
| Step 06 | 16 个 boundary、范围、批次、经验复核 | 每个 boundary 必须有提交前 gate 和失败动作 |
| 旧 Step 07 / 旧正式 `07` | `historical_material` | 旧摘要只写通用 observability 主语，缺 exact gate，不计 current |

当前没有发现 `05/06` 与 Step 05~06 的新冲突。目标仓和执行环境缺失是实施 readiness blocker，不阻断本 Step 完成 gate 设计。

## 4. 设计取舍

| 议题 | 采用 | 禁止 | 原因 |
|---|---|---|---|
| gate identity | 使用 `GATE-OBS-01~12` 作为实施门禁，suite 仍保持 `S-OBS-*` 唯一测试身份 | 把 historical gate alias 当第二套 suite | 防止一个 case 被重复计数 |
| case ownership | 99 个 TC 各有一个 primary suite，secondary check 不创建第二 evidence identity | 以 wildcard 或 check report替代 exact TC | 保持 99/99 join 可机器审计 |
| dataset | 82 个 current `DS-OBS-*` 由 `05` exact mapping选择 | boundary 自造 fixture/schema/body | 防止实现侧补造测试 truth |
| evidence maturity | raw -> run report -> candidate linkage -> acceptance/review handoff | design 表、静态模板、`latest`、旧 run 生成 pass | 保证 evidence 来源真实 |
| environment | ISO、INT、RT 分 invocation、分 run identity | 低等级 lane 填充高等级结果 | 保持环境真实性 |
| acceptance | AC/VF/NFR 只作为未来裁决规则 | boundary gate pass 等同最终验收通过 | 实施测试不拥有验收 verdict |

## 5. Planned gate catalog

| Gate | 核心检查 | 主要 suite/check | 失败动作 |
|---|---|---|---|
| `GATE-OBS-01` | workspace、format、compile、crate/package、only-core dependency | workspace check + dependency check | 当前 boundary blocked，不提交 |
| `GATE-OBS-02` | public DTO/ref/protocol、27+1 state、factory/policy/history | `S-OBS-CONTRACT-DOMAIN` | schema/owner/state 缺口回写设计 |
| `GATE-OBS-03` | Command/Consumer accepted flow、UoW、idempotency、completion、Query zero-write | `S-OBS-SERVICE-FLOW` | 保留失败，修复当前 boundary 或回写设计 |
| `GATE-OBS-04` | fake/durable parity、CAS/cursor/outbox/rollback/commit unknown | `S-OBS-REPOSITORY-CONFORMANCE` | INT 前置缺失为 blocked/not_run，不降级 |
| `GATE-OBS-05` | API/worker/jobs facade-only、pre-parse、ack/fence/least authority | `S-OBS-ENTRY-CAPABILITY` | 越权 capability 或默认 completion 阻断 |
| `GATE-OBS-06` | recovery/replay/job plan/claim/fence/report/external phase | `S-OBS-RECOVERY-REPLAY` | unknown 保持 indeterminate/manual；不盲重试 |
| `GATE-OBS-07` | 三 profile、13-stage activation、strict source、availability | `S-OBS-CONFIG-REDLINE` | invalid/partial/fallback 均 fail closed |
| `GATE-OBS-08` | redaction-before-serialization、body-free、finite metric labels、recursion guard | `S-OBS-TELEMETRY-SAFETY` + redaction/metric checks | 任一 forbidden finding 阻断，不可风险接受 |
| `GATE-OBS-09` | truth ownership、no-write、dependency、historical material | `S-OBS-STATIC-REDLINE` + dependency check | writer/forbidden edge/history elevation 阻断 |
| `GATE-OBS-10` | 99 TC/82 DS/9 suite 同 run artifact/report/provenance | report generator + `EVG-OBS-001~007` | orphan、wrong run、静态 pass 均阻断 |
| `GATE-OBS-11` | 五能力 release composite 与底层 suite 同时成立 | `S-OBS-RELEASE-SMOKE` | RT 未建立为 not_evaluated，不用 ISO 替代 |
| `GATE-OBS-12` | handoff、VF checklist、open issue、risk/review 输入完整且已审查 | `EVG-OBS-008~009` | 未审查初稿不得送验或宣称完成 |

`GATE-OBS-*` 只编排 current `05/06` 已定义的测试与验收输入，不新增 TC、DS、AC、NFR、VF 或 evidence alias。

## 6. 测试资产和状态真实性

### 6.1 Primary suite manifest

| Primary suite | TC 数 | 主 lane/profile | 实施期状态约束 |
|---|---:|---|---|
| `S-OBS-CONTRACT-DOMAIN` | 10 | `ENV-CI-ISO` / `LocalTest` | runner 未建立前 `planned/not_run` |
| `S-OBS-SERVICE-FLOW` | 24 | ISO；指定 row 独立 INT follow-up | INT 不可用不得由 ISO 覆盖 |
| `S-OBS-REPOSITORY-CONFORMANCE` | 12 | `ENV-CI-INT` / `IntegrationLike` | durable 前置缺失为 blocked/not_run |
| `S-OBS-ENTRY-CAPABILITY` | 5 | exact ISO/INT row | I05 positive 保持 blocked_upstream |
| `S-OBS-RECOVERY-REPLAY` | 12 | `ENV-CI-INT` / `IntegrationLike` | J06 positive 保持 controlled blocked |
| `S-OBS-CONFIG-REDLINE` | 6 | `ENV-CI-ISO` / `LocalTest` | profile/legal matrix 不得缩减 |
| `S-OBS-TELEMETRY-SAFETY` | 11 | ISO；必要时独立 INT check | redaction/metric finding 同 run 保留 |
| `S-OBS-STATIC-REDLINE` | 12 | `ENV-CI-ISO` / `LocalTest` | dependency/history/owner finding blocking |
| `S-OBS-RELEASE-SMOKE` | 7 | `ENV-STG-RT` / `RuntimeLike` | lane 未建立只允许 not_evaluated/blocked |
| **合计** | **99** | 6 lane / 3 profile | 不跨 profile 拼成 pass |

### 6.2 TC family completeness

`AUD4 + AUT3 + CFG6 + COR3 + DEG5 + DEP3 + DIA4 + EVD4 + EXT3 + HIST2 + ING4 + NFR3 + NW5 + OWN4 + QRY4 + REB6 + RED4 + REL5 + RET5 + RPT5 + SIG6 + TRUTH3 + UOW8 = 99`。82 个 DS 必须从 current `05` §7 exact set选取，runner manifest 出现 unknown DS、重复 primary suite 或 wildcard 视为 input-integrity failure。

### 6.3 状态聚合优先级

```text
input/evidence integrity failure
  > VF/hard redline failure
  > required P0 case failure
  > required lane blocked or not_run
  > conditional or indeterminate affected path
  > numeric/RuntimeLike not_evaluated
  > passed
```

执行态允许 `passed/failed/blocked/not_run/conditional/indeterminate/not_evaluated`；设计期只写 `planned`。聚合不得改写原始状态，`blocked/not_run/conditional/indeterminate/not_evaluated` 均不得汇总为 `passed`。

## 7. Phase 门禁矩阵

| Phase | 测试门禁 | 验收/VF 重点 | artifact/report 规划 | 失败处理 |
|---|---|---|---|---|
| PH-01 | `GATE-OBS-01/07/09` | `AC-OBS-019/024/030/031`;`VF-OBS-008~010` | workspace/config/check raw；targeted ledger summary | repo/tool/config 缺失保持 blocked；不写静态 pass |
| PH-02 | `GATE-OBS-02/08/09` | `AC-OBS-006~018/025~028`;`VF-OBS-002~005` | contract/domain case raw + suite report | owner/schema/state gap 回设计，不进入 PH-03 |
| PH-03 | `GATE-OBS-03/04/05/08` | `AC-OBS-001/006~008/019/025/029`;`VF-OBS-001/002/004/005` | intake/service/entry/UoW raw + reports | I05 只保留 fail-closed；unknown 不默认 ack |
| PH-04 | `GATE-OBS-02~04/08/09` | `AC-OBS-002/009/010/020/025~028`;`VF-OBS-003~005` | audit/evidence/repository/query raw + reports | evidence body、owner drift、Query write 阻断 |
| PH-05 | `GATE-OBS-03/04/08/09` | `AC-OBS-003/011~014/021/022/026`;`VF-OBS-002/004/005` | signal/query/telemetry/static raw + reports | false Fresh、高基数、writer call 阻断 |
| PH-06 | `GATE-OBS-03/04/06/08/09` | `AC-OBS-004/005/015~018/022/023`;`VF-OBS-005~007` | handoff/retention/recovery reports | J06/external affected 保持 blocked/conditional |
| PH-07 | `GATE-OBS-05/07~10` | `AC-OBS-019/024/028~031`;`VF-OBS-002/005/008~010` | config/entry/static/check raw + report audit | partial activation、fallback、scanner fail-open 阻断 |
| PH-08 | `GATE-OBS-10~12` | `AC-OBS-001~031`;`NFG-OBS-001~008`;`VF-OBS-001~010` | canonical raw/run/acceptance/review roots | 任一 required evidence缺失不可完成或送验 |

## 8. Commit boundary 门禁矩阵

| Boundary | 提交前测试 / check | AC / VF 关联 | planned evidence 归属 | 失败处理 |
|---|---|---|---|---|
| `commit-01-a` | fmt/check/metadata/dependency/whitespace | AC024/030/031；VF008~010 | boundary ledger + dependency raw candidate | 不提交；修 workspace/dependency |
| `commit-01-b` | config parse、CLI/path dry-run、no-latest | AC019/029/031；VF006/009/010 | config/path raw candidate | 不提交；修 config/script root |
| `commit-02-a` | contract roundtrip、owner/body-free/static map | AC006~018/027/028；VF002~004/006 | contract suite case/report path | schema/owner/wire gap 回设计 |
| `commit-02-b` | state/factory/policy/history/error tests | AC001~005/025/026/029；VF001/004/005 | domain suite case/report path | state/field/persistence gap 回设计 |
| `commit-03-a` | ING/COR/RED/UOW service rows、write spy | AC001/006~008/019/025/029；VF001/002/004/005 | service/repository/telemetry case path | UoW/unknown/redaction失败阻断 |
| `commit-03-b` | entry/pre-parse/completion/I05 controlled rows | AC001/006~008/019/027；VF002/004/005 | entry/service/recovery case path | I05 positive 不构造；默认 ack 阻断 |
| `commit-04-a` | AUD/EVD/UOW/OWN append/repository rows | AC002/009/010/020/025/027/028；VF003~005 | service/repository/redaction case path | body/owner/partial write 阻断 |
| `commit-04-b` | Q05/Q06 no-write、visibility、snapshot provenance | AC002/009/010/013/020/026；VF003~005 | service/static case path | read repair/cross-time join 阻断 |
| `commit-05-a` | SIG/DEG/RED/TRUTH projection rows + metric check | AC003/011/012/021/026；VF002/004 | telemetry/repository case/check path | high-cardinality/false Fresh/authority 阻断 |
| `commit-05-b` | QRY/DIA/NW exhaustive writer-spy rows | AC004/012~014/022/026；VF004/005 | service/static case path | 任一 writer/fallback/partial view 阻断 |
| `commit-06-a` | RPT/AUT/RET/EXT immutable input/no-verdict rows | AC004/015~017/022/023/028；VF003/005~007 | service/recovery/redaction case path | verdict/evidence body/protected cleanup 阻断 |
| `commit-06-b` | REB/UOW/NW/RET/RPT/EXT recovery rows | AC005/018/023/029；VF001/005/007 | recovery/repository case path | J06 positive保持blocked；盲重试阻断 |
| `commit-07-a` | CFG/entry/activation/profile/dependency rows | AC019/024/029~031；VF005/008~010 | config/entry/static case path | complete-or-error不成立则不激活 |
| `commit-07-b` | redaction/metric/dependency/report provenance checks | AC021/024/028~031；VF002~006/008~010 | same-run check raw/report | scanner/input缺失不得 clean |
| `commit-08-a` | 9 suite manifest、99/82 join、raw/report generator audit | AC001~031；NFG001~008；VF001~010 | canonical raw + run report roots | missing/orphan/wrong-run/static-pass阻断 |
| `commit-08-b` | handoff/VF/open issue/risk/review schema audit | AC001~031；VF001~010；EVG008~009 | acceptance/review roots | 初稿未审查不得送验/完成 |

所有路径均为 future output contract。表中的“case/report path”只有真实 runner 执行后才可填写具体 `<run_id>` 和状态。

## 9. Canonical artifact、report 与脚本规则

| 层 | 唯一根/脚本 | 规则 |
|---|---|---|
| raw artifact | `artifacts/test/<run_id>` | 保存 meta、source/config/dataset manifest、gate/check raw、suite/case raw、失败输出；失败材料不可覆盖 |
| run report | `reports/runs/<run_id>` | 仅由同 run raw生成 summary、suite report、evidence-index、gate-results、redaction/metric/dependency/report audit |
| acceptance | `reports/acceptance` | handoff、veto-checklist、risk-acceptance、open-issues 只允许生成初稿并等待审查 |
| review | `reports/review` | reviewer notes 与 Agent review 输入；不生成 final verdict |
| gate | `scripts/gates/run_ci_gate.sh` | 校验 run/root/profile 后执行 manifest；缺输入、timeout、artifact failure 返回 nonzero |
| report | `scripts/reports/generate_reports.sh` | 不读取 `latest`、旧 run 或设计表补 pass；不修改 raw/source truth |
| checks | `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` | 独立 finding/status；scanner 运行成功不等于检查通过 |

99 candidate linkage 必须满足 `TC suffix == EV-CAND suffix`、一个 primary suite、DS 属于 82 exact set、artifact/report/run identity一致。`EV-CAND-OBS-*` 不是正式 evidence alias。

## 10. Report 审查与责任

| 产物 | 自动生成责任 | Agent 审查 | 人工责任 | 未完成状态 |
|---|---|---|---|---|
| suite/run reports | test/report tooling | 检查 manifest、状态折叠、raw back-link、敏感信息 | 测试负责人确认执行范围和异常分类 | blocked |
| evidence-index/report-audit | report tooling | 检查 99/99 join、digest、same-run、no-static-pass | 测试/验收负责人确认候选关系可复查 | 不可裁决 |
| redaction/metric/dependency reports | check tooling | 检查 scanner input和finding未被吞掉 | 安全/架构负责人处理 hard finding | failed/blocked |
| acceptance handoff/open issues | generator 仅建初稿 | 检查 baseline、run、scope、blocked/residual 无遗漏 | 验收负责人补充并确认送验输入 | draft，不得送验 |
| veto checklist/risk acceptance | generator 仅投影输入 | 检查 VF evidence/finding和不可接受项 | 授权角色独立裁决/签署 | not_evaluated/open |
| final verdict/signoff | 不允许自动生成 | 不允许 Agent代签 | 仅 `06` 定义的授权角色 | absent |

## 11. AC、NFR、VF 和 EVG 反向覆盖

| Source set | 覆盖位置 | Current 设计结论 |
|---|---|---|
| `AC-OBS-001~005` | PH-03~06 capability + PH-08 `REL-001~005` composite | 5/5 有基础 suite和composite；composite不覆盖底层失败 |
| `AC-OBS-006~018` | commit-02~06 exact protocol/flow/state gates | 13/13 有测试 family；affected positive path保持条件态 |
| `AC-OBS-019~024` | config/redaction/dependency/history/no-write gates | 6/6 有 static/dynamic evidence入口 |
| `AC-OBS-025~028` | owner/body-free/read/provenance gates | 4/4 有 OWN/TRUTH/UOW/RED/EVD入口 |
| `AC-OBS-029~031` | `NFG-OBS-001~008`、config/evidence integrity | 3/3 有结构性 gate；无来源 numeric threshold=0 |
| `NFR-OBS-001~024` | `NFG-OBS-001~008` + phase/boundary映射 | 24/24；性能/容量/期限未冻结项只not_evaluated |
| `VF-OBS-001~010` | PH-01~08 redline + `GATE-OBS-08~12` | 10/10；任一命中不可由局部 pass 覆盖 |
| `EVG-OBS-001~009` | commit-08-a/b + report/review责任 | 9/9；缺输入、wrong-run、static-pass或未审查均阻断 |

## 12. Inherited affected 到门禁的绑定

| Affected | Boundary/Gate | Current 可验证面 | 禁止的正向声明 |
|---|---|---|---|
| I05 schema + producer binding 两项 | `commit-03-b/07-a/08-a`;GATE05/09/10 | pre-parse/binding fail-closed、disabled/controlled slot | positive decode/landing/completion |
| H13 upstream | `commit-06-b/08-b`;GATE06/12 | approved scope + controlled Blocked/manual | J06 Completed/H13 result |
| UoW + recovery owner | `commit-03-a/04-a/06-b`;GATE03/04/06 | exact order、rollback、unknown probe、no default | 全 flow atomicity/recovery已实现 |
| external phase 两项 | `commit-06-b/07-a`;GATE06/07 | same token/binding、unknown probe、no blind retry | real endpoint/retry accounting完成 |
| consumer outbox + completion 两项 | `commit-03-b/06-b`;GATE03/05/06 | conditional snapshot、commit unknown无默认action | 所有consumer positive effect完成 |
| job report ref owner | `commit-06-a/06-b`;GATE02/06 | missing/wrong ref fail closed、immutable fold | positive report mint/rehydrate完成 |
| secondary type owner | `commit-02-a/06-a`;GATE02/09 | declaration/use/static owner scan | alias/String fallback或owner已实现 |
| per-flow implementation proof | all boundaries；GATE02~11 | 60 protocol/99 TC设计映射 | implementation proof完成 |

## 13. 门禁停审与跨门禁审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| 8 phase 是否均有测试门禁 | 8/8 | pass_design |
| 16 boundary 是否均有提交前门禁、AC/VF和失败动作 | 16/16 | pass_design |
| 99 TC / 82 DS / 9 suite 是否改变身份 | 0 change；99/82/9保留 | exact mapping仍以 `05` 为准 |
| 31 AC / 24 NFR / 10 VF / 9 EVG 是否 orphan | 0 orphan | pass_design |
| required lane 是否允许降级 | 0 allowed | blocked/not_run/not_evaluated原样保留 |
| artifact/report 是否使用canonical root | yes | 禁止 `latest`、project嵌套根和cross-run join |
| 自动报告是否会生成 verdict/signoff | no | acceptance/review只生成输入初稿 |
| redaction/no-write/dependency finding 是否可风险接受 | no | hard block |
| inherited affected 是否被关闭 | no | 12项继续open/controlled/conditional |
| 新 upstream blocker | none | 可进入 Step 08 |

## 14. 正式 `07` §7 回填草稿

正式 §7 应保留 `GATE-OBS-01~12`、9 suite manifest、phase/boundary矩阵、canonical artifact/report规则、状态优先级、review责任和affected门禁。正文只写收口规则，不复制99行TC/EV或82行DS明细；明细由正式 `05/06` 与本中间产物提供。

## 15. Step 自检

| 检查项 | 结论 |
|---|---|
| 是否每个 phase/boundary都有门禁 | pass；8/8、16/16 |
| 是否绑定 AC/NFR/VF和证据归属 | pass |
| 是否明确失败、blocked、not_run、not_evaluated | pass |
| 是否明确 Agent/人工审查责任 | pass |
| 是否伪造 run/artifact/report/evidence/verdict/signoff | no |
| gate_status | `pass_with_affected_and_environment_preconditions` |
| next_allowed_action | `continue_to_step_08` |

## 16. 参考

- `projects/L4-observability/05-测试方案.md` §3~§14
- `projects/L4-observability/06-验收标准.md` §3~§14
- `projects/L4-observability/design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
- `standards/document/代码实施台账与门禁规范.md`
