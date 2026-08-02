# L4-sandbox 实施计划 Step 8 Commit Boundary准备矩阵分件

> 主件: `07_implementation_plan_step_08_config_environment_dependencies.md`
> Boundary真相源: `07_implementation_plan_step_06_tasks_commit_boundaries.md`
> Gate真相源: `07_implementation_plan_step_07_test_acceptance_gates.md`
> 配置 /环境真相源: 正式`04-配置设计.md`;正式`05-测试方案.md`
> 创建日期: 2026-07-17
> 状态: completed_supporting_register
> 事实边界: 本表定义future Activation准备,不表示任一boundary已active / implemented / tested / reviewed / committed。

---

## 1. 使用规则

1. Step 13创建32件planned skeleton时,每件必须复制本表对应行的`config / environment / dependency / unavailable`语义,并与Step 6 /7的required reads、scope、test / evidence gate合并。
2. Activation检查只判断“是否允许开始当前boundary”;Build / Test / Evidence / Commit / Handoff仍按Step 6 /7执行。
3. `ENV-xx / PROFILE-xx`只表示该boundary测试harness或binding的准备身份,不表示环境实例、source run或结果已经存在。
4. ENV-02 /03 /04 targeted fixture不自动成为MAIN-CONTRACT / MAIN-SEAM / OPS source;只有future fixed source invocation使用正式role时才成立。
5. 任一required dependency未就绪时,保持当前boundary`blocked`;后序boundary继续`planned / wait_until_current`。
6. 配置字段语义只回指正式`04`;本表不得被用来改key、default、source、profile、material class或failure disposition。

### 1.1 通用Activation前置

| 范围 | 必需准备 | 未关闭处理 |
|---|---|---|
| 全部boundary | HDO-SBX-00、真实design baseline、项目implementation ledger、32件skeleton、唯一current、前序Handoff Gate | `wait_design`;不得开工 |
| 全部Cargo boundary | target repo、local git、fixed Rust baseline、core revision /worktree、Cargo graph约束 | `dependency_wait`;台账`blocked / handoff`;不得复制shared type |
| 02C /14B | RFC 8785 writer /verifier选择和fixtures | boundary不激活 |
| 02D /14A~14C | approved Shell规则 /lint或等价检查 | script boundary不提交 |
| 03A+ runtime slice | previous complete config generation及required adapter registry | fail-fast;无partial /mixed generation |
| 13A /13B | candidate /P05 /ENV-05 /generation /template /provider /material /lab packet | `Blocked`;probe /launch=0 |
| future fixed source | exact baseline、ENV /PROFILE /role、fixed root与immutable config /candidate identity | source不执行;不得标Skipped /Passed |

## 2. PH-01~PH-08 Boundary准备矩阵

| Boundary | Config / source准备 | ENV / adapter准备 | 外部 /工具依赖与检查 | 不可用 /越界处置 |
|---|---|---|---|---|
| `CB-SBX-01A` | 无runtime config;只固定future raw owner /七crate边界 | 不要求ENV实例 | HDO;target repo /git;Rust baseline;core exact revision;Cargo metadata /graph /naming | repo /core /version缺失记`dependency_wait`并`blocked / handoff`;design baseline缺失`blocked / wait_design`;无业务claim |
| `CB-SBX-02A` | 无raw config;typed ref /metadata /status /error只承接core | ENV-02 contract fixture identity可构造,不需要CI | core shared carriers可解析;contracts test harness | shared type缺失回L0 /`wait_design`;不得自造private replacement |
| `CB-SBX-02B` | 直接constructor fixture;尚不依赖03A loader;预留I017 /I022 /I096 /I097正式绑定 | ENV-02 semantic store /UoW /clock /id fake | deterministic scheduler、rollback /version /three-channel replay fixtures | 外部harness缺失记`dependency_wait`并`blocked / handoff`;当前scope fake实现失败为`blocked / fix_gate_failure`;不得以无事务map /sleep替代 |
| `CB-SBX-02C` | machine schema identity /path /status不来自runtime config | ENV-02 synthetic artifact corpus;无真实run | RFC 8785 implementation、sha256 rules、canonical /noncanonical /self-digest /path fixtures | PRE-SBX-008未关闭则blocked;禁止以`jq` /`sha256sum`存在代替 |
| `CB-SBX-02D` | fixed artifact /report roots与CLI profile参数schema;不加载业务config | ENV-02 synthetic raw;不要求CI provider | approved Shell rule、`bash -n`、lint /等价check;minimum six script entries | PRE-SBX-007未关闭则blocked;只可产fixture,无source /EV |
| `CB-SBX-03A` | S00~S08;40组 /I001~I101 /D01~D44 expected manifests;NCFG /FC /XVAL;single raw owner | ENV-01 loader smoke + ENV-02 negative config corpus;P01~07 eligibility static | normalized JSON corpus、allowlisted env mapping、config coverage index | unknown /duplicate /ambiguous /unsupported即0 publication;不得补implicit default |
| `CB-SBX-03B` | P01~05 composition;23 descriptors /10 class;S04 fake outcomes;S05 /S06 isolation;atomic generation | ENV-01~04 fake /controlled /simulation registry;P05 missing-input rejection;P06 conditional;P07 inactive | runtime builder constructor graph、availability /redaction /lease-revoke fixtures | partial /mixed generation或raw material阻断;真实provider /candidate不在scope |
| `CB-SBX-04A` | consume complete generation carrier contract;无adapter call | ENV-02 contract /domain fixture | core refs、config identity /generation refs可构造 | missing carrier回03B;不得为resolver补外部正文 |
| `CB-SBX-04B` | I017 /I020 /I028 /I091 /I094~I097适用;exact frozen generation | ENV-02 context resolver semantic fake;ENV-03 controlled seam仅补强 | body-free resolver、truth /audit /relay /replay stores、API runtime handle | required fake缺失阻断;real source缺失不匿名 /不自造context |
| `CB-SBX-05A` | I039 /I040 /I065 typed refs和generation source map | ENV-02 contract /domain fixture;无backend call | active identity、four-dimension isolation + workspace requirement /template /lease constructor fixtures | identity或任一required dimension缺失、weak variant为`wait_design`;P0-Q保持NotEvaluated |
| `CB-SBX-05B` | I035~I043 /I065;capability /boundary /backend同代;I065只在establishment消费 | ENV-02 non-executing backend +capability fake;ENV-03 availability seam补强 | exact context /identity /requirement reads、grouped UoW、adapter call trace | unsupported /stale /unavailable formal reject;无candidate /host /weak fallback |
| `CB-SBX-06A` | I031~I034 strict high-risk /freshness语义;无port调用 | ENV-02 contract /domain fixture | policy /authorization body-free carrier和fail-closed matrix | missing /stale /conflict /unsupported不得Accepted |
| `CB-SBX-06B` | I031~I034 + exact prior requirement ref;current config不可重建old decision | ENV-02 policy semantic fake;ENV-03 controlled policy seam补强 | one-shot policy port、truth /audit /relay /replay stores | unavailable /stale fail-closed;backend launch call=0 |
| `CB-SBX-07A` | I041 /I042 /I065 + persisted boundary /handle /lease +Accepted policy refs | ENV-02 non-executing launch outcome fake;ENV-03 lifecycle seam仅补强 | backend port call trace、exact four-way guard、worker fixture | mismatch /inactive /expired /non-Accepted call=0;不重算lease /不实现tool semantics |
| `CB-SBX-07B` | I044~I048 /I057~I058 /I094~I095;body-free material class | ENV-02 capture fake;ENV-03 controlled capture /obs seam | capture outcome /size /redaction fixtures;no raw process body | unavailable /failed /partial诚实;不得升格Artifact /Obs truth |
| `CB-SBX-07C` | I055~I064;registered target与frozen material refs | ENV-02 handoff fake;ENV-03 controlled target /receipt seam | target identity、retryable /failed、no-capture-rollback trace | target missing current command reject或failed;receipt不等于downstream accepted |
| `CB-SBX-08A` | entry /worker envelope与safe output;无新recovery config | ENV-02 control /failure fixtures;ENV-04 race simulation补强 | deterministic control race、classification source、audit /replay stores | unknown保持unknown /failed;不得混入runtime recovery orchestration |
| `CB-SBX-08B` | I043 /I059~I060 /I065~I075 /I094~I095;guard配置完整 | ENV-02 negative guard + ENV-04 simulated handle /lease /release /containment | investigation /release fake、call budget、resource disposition fixture | non-Allowed release=0;缺evidence /target保持Blocked /Contained;无真实delete |

## 3. PH-09~PH-14 Boundary准备矩阵

| Boundary | Config / source准备 | ENV / adapter准备 | 外部 /工具依赖与检查 | 不可用 /越界处置 |
|---|---|---|---|---|
| `CB-SBX-09A` | I003 /I005 /I018~I020 /I079~I085 typed read /page /scope refs | ENV-02 contract /domain fixture | 13 view /selector /cursor /marker constructors;typed read ports | callable finder缺失不得scan /string-guess;design gap `wait_design` |
| `CB-SBX-09B` | complete projection /derived /reference generation;visibility /timeout /bounded page | ENV-02 semantic read fake;ENV-04 boundedness /stale simulation补强 | read repository /API runtime、write-audit=0 | store unavailable映射degraded /missing;不得write /refresh /repair |
| `CB-SBX-10A` | I007~I009 /I024 /I049 /I094~I101;9-key source /quarantine registry | ENV-02 fixture consumers;ENV-03 controlled event seam | schema allowlist、source identity、dedup /receipt stores、worker loop | missing enabled binding loop不启动;invalid quarantine;consumer不造core success |
| `CB-SBX-10B` | I014 /I015 /I021 /I050~I054 /I091 /I094~I095;13-key route map | ENV-02 fake publisher主slice;ENV-03 controlled publisher seam | stored payload /relay store、route coverage、retry /dead-letter fixtures | enabled dependency缺失startup reject;publish failure no rollback;无real topic provisioning |
| `CB-SBX-11A` | I010~I013 /I022 /I025~I027;10 job registry和typed scope | ENV-02 deterministic job harness | selection /page、per-item UoW、stored report /replay store | missing report /scope source阻断;duplicate不得重做owner calls |
| `CB-SBX-11B` | I052~I064 /I076~I078;registered relay /context /capability /handoff refs | ENV-02 deterministic jobs;ENV-03 controlled seam;ENV-04 replay simulation适用 | manual job entry、publisher /resolver /handoff fake、bounded report | adapter failure写partial /failed,no rollback /no core repair;不要求real scheduler |
| `CB-SBX-11C` | I065~I085;simulation cadence /scope /guard完整 | ENV-04 primary operations simulation;ENV-02 contract补强 | simulated handle /lease /release、projection /derived stores、atomic report | guard-first;non-Allowed release=0;manual-only不伪装已调度 |
| `CB-SBX-12A` | 40 /101 /44 expected index与55 /30 owner machines /31 enum entries /39 shared declarations /38 /254 manifests可读取 | ENV-02 inventory /contract harness | generated manifests、protocol /state /error /TC scanners | missing /duplicate /换义为Failed或`wait_design`;不得新增同义ID |
| `CB-SBX-12B` | P01~04 complete generation、S06 run isolation、all safety /redaction settings | ENV-02 MAIN-CONTRACT writer能力;ENV-03 MAIN-SEAM能力;ENV-04 OPS能力;当前无source run | 14 TXN /19 race、fake parity、source schema /writer、checks与fixed roots | harness /role /pairing失败阻断;不得写source Passed /merge MAIN roles |
| `CB-SBX-13A` | exact P05、ENV-05、candidate /generation /template /capability /provider /material identity;S06 absent | ENV-05 dedicated lab /candidate adapter preflight;当前均未形成 | candidate ADR /revision、provider principal /audit、lab authorization、0-launch check | 任一缺失`blocked_pre_implementation`;probe /launch=0;不得candidate search /substitution |
| `CB-SBX-13B` | 13A immutable packet;capture /release /cleanup /redline /material bindings完整 | 同一ENV-05 /P05;candidate-real;controlled non-production target | CONF-001~013 harness、identity /redaction /cleanup checks、product +lab disposition | preflight异常不执行CONF;failure保留;teardown /containment无处置不提交 |
| `CB-SBX-14A` | 7 gate /9 check参数、ENV /PROFILE /role闭集、四source固定顺序 | ENV-02 /03 /04 /05 synthetic source fixtures;CI binding可后置到真实执行前 | prior 13B Handoff;Shell rule /lint;status /identity /digest /missing fixtures | 前序未完成不激活;CI未绑定只可验证local fixture,不得声称workflow /source存在 |
| `CB-SBX-14B` | nine schema、21 slot、fixed roots、canonical digest /path /status规则 | synthetic raw /report corpus;无真实EV | RFC 8785、pairing /no-static、writer /reader /renderer roundtrip | missing raw /schema /pair nonzero;无合法pair不分配EV |
| `CB-SBX-14C` | fixed RELEASE packet schema、VETO /defect /risk /conditional fields、review roots | synthetic RELEASE fixture;无真实acceptance process | acceptance generator /redaction /path /scope fixtures | 只生成draft能力;不得预填verdict /risk acceptance /review /signature |

## 4. 32 /32 Activation停审

| Phase | Boundary count | 配置准备 | ENV /adapter准备 | 外部依赖处置 | 结论 |
|---|---:|---|---|---|---|
| PH-01 | 1 | covered | not_required_before_bootstrap | covered | passed_design |
| PH-02 | 4 | covered | ENV-02 synthetic /semantic | canonical /Shell blockers exact | passed_design_with_open_activation_prerequisites |
| PH-03 | 2 | 40 /101 /44 /23 owner | ENV-01~04 +P05 absence | real provider not required for fake descriptor | passed_design |
| PH-04 | 2 | covered | ENV-02 required;ENV-03 supplemental | real context not required P0-C | passed_design |
| PH-05 | 2 | covered | P0-C fake;P0-Q not substituted | candidate deferred to13A | passed_design |
| PH-06 | 2 | covered | P0-C policy fake /controlled | real policy not required P0-C | passed_design |
| PH-07 | 3 | covered | fake /controlled,no real launch claim | targets typed | passed_design |
| PH-08 | 2 | covered | ENV-04 simulated destructive paths | real delete forbidden | passed_design |
| PH-09 | 2 | covered | ENV-02 /04 | durable store conditional | passed_design |
| PH-10 | 2 | covered | ENV-02 /03 | real bus not required P0-C | passed_design |
| PH-11 | 3 | covered | ENV-02~04 | real scheduler not required P0-C | passed_design |
| PH-12 | 2 | complete manifest /source writer config | ENV-02 /03 /04 roles distinct | current source execution absent | passed_design |
| PH-13 | 2 | exact P05 packet | ENV-05 candidate-real | five open activation groups retained | passed_design_blocked_activation |
| PH-14 | 3 | gate /schema /draft config | synthetic fixtures;future fixed sources | CI binding and source runs absent | passed_design |

```text
boundary_count = 32_of_32
boundary_with_config_or_explicit_no_runtime_config = 32_of_32
boundary_with_environment_identity = 32_of_32
boundary_with_dependency_check = 32_of_32
boundary_with_unavailable_disposition = 32_of_32
active_boundary = 0
implemented_boundary = 0
real_commit = 0
```

## 5. 跨Boundary审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否改变Step 6顺序 | 否 | 仍严格`01A -> ... -> 14C`且单current |
| 是否让03A loader成为02B循环前置 | 否 | 02B使用constructor fixture;03A后才走raw config |
| 是否让candidate成为05B P0-C前置 | 否 | 05B只用non-executing semantic fake;P0-Q仍NotEvaluated |
| 是否让fake替代P0-Q | 否 | 13A /13B exact P05 /ENV-05且S06 forbidden |
| 是否让CI binding阻塞script fixture实现 | 否 | 02D /14A可本地验证;真实source执行仍需CI /authorized runner |
| 是否允许PH-14越过blocked PH-13 | 否 | 14A Activation仍要求13B Handoff;本表不授权跳步 |
| 是否把controlled seam计为coherent boundary | 否 | ENV-03只证明port /failure mapping |
| 是否把simulation计为真实cleanup | 否 | ENV-04所有destructive adapter为0 real call |
| 是否混入tools /runtime /member领域 | 否 | 只消费formal request /ref /summary /event /handoff seam |
| 是否预填runtime事实 | 否 | 当前32件skeleton未创建,0 active /commit /run /EV /result |
