# L6-bridges 05 Step9：TEST-03-001必要反校准

## 1. 范围与依据

测试SOP/03§15约束选脚本前登记03§4/15及对应Step4/16。用户授权全部05涵盖该具名设计反校准，不重开00~04业务语义。仅新增七planned script职责与S/P原testtarget内test-only artifact DTO；无新增业务接口/状态/owner/产品决定。

## 2. 问题、诊断与取舍

缺真实脚本I/O/失败路径时实现者会自行collector/report/schema或永久省门禁；选择gate/check/report职责分离、固定run、安全writer/reader闭环，具体schema由05 Step13收稳。先登记完整参数/路径/I/O/有限失败合同，再允许05 Step9写入。

## 3. 同步位置

| 位置 | 修改 | 状态 |
|---|---|---|
| 03正式§4 / Step4§7 | 七planned完整路径/tree/类型/参数/I/O/退出与harness归属 | synchronized_design |
| 03正式§15 / Step16脚本边界 | 当前已选但未实现，沿同一完整合同 | synchronized_design |
| 05 Step9/13 | suite/gate/report配对及可编码schema | 当前Step9 / Step13尚未到达 |
| 07 | 实施ledger和全planned boundary | waiting；不提前创建 |

## 4. 可落码合同

2026-10-04；05已获用户授权，登记TEST-03-001。只增加以下七个planned脚本责任位置和S/P原testtarget内test-only harness DTO职责；不新增Rustsource文件/业务DTO/port/state/DDL，不创建脚本、输出目录、实现台账或boundary。旧161文件统计仍为Step4当时审计，当前具名planned职责新增7；其实现/boundary由正式07完成时登记。

#### 文件布局树: planned测试门禁与报告工具

```text
quantalithos-bridges/scripts/
|  +-- gates/
|  |   +-- run-bridge-local.sh
|  |   +-- run-bridge-real-seams.sh
|  |   +-- run-bridge-release.sh
|  +-- checks/
|  |   +-- check-bridge-run-context.sh
|  |   +-- check-bridge-test-evidence.sh
|  +-- reports/
|      +-- build-bridge-test-report.sh
|      +-- build-bridge-acceptance-handoff.sh
```

关键说明：全部planned；脚本不得放reports。gate产生安全机器材料，check只验证，report只读取机器产物再形成可审查初稿；三个角色都不授qualification或裁决。脚本能力/S-P自测、minimal index shell、finalEV pages、human acceptance handoff四成熟度不互证。

| 完整planned路径 | 类型/输入 | 输出/职责 |
|---|---|---|
| `scripts/gates/run-bridge-local.sh` | gate；原十一target的synthetic套件及TOOLS | cargo按11membermanifest/testtarget运行；profile声明expected实例、输出safe context/case/suite/index；不外呼 |
| `scripts/gates/run-bridge-real-seams.sh` | gate；SUITE-REAL与actual B/L/A/C/P/I/W/J | 先actualselected资格/安全sandbox/current注册；任一缺失blocked，绝不fallbackfixture；逐actualcase输出typed安全结果 |
| `scripts/gates/run-bridge-release.sh` | gate；fixed-run complete coverage汇总（非部署/验收裁决） | 只读同run已有synthetic+real-seam实例/contexts；两个check→两个report；少actual实例blocked，无新effect/伪pass |
| `scripts/checks/check-bridge-run-context.sh` | check；immutable context与approved safe profile/manifest/qualification | 校验run/build/config/selection/mode/qualification slot；不读secret值/业务ref，context缺失/漂移拒；零网络或业务mutation |
| `scripts/checks/check-bridge-test-evidence.sh` | check；case/suite/index/safe blobs与本05完整schema | 验证schema/digest/baseline/封闭实例/TC→DS→suite→EV→AC/allowlist与redaction；不造case/result/consumer接受 |
| `scripts/reports/build-bridge-test-report.sh` | report；经两check验证的原case/suite/index | 生成reports/runs/<run_id>/summary.md、evidence/<EV-ID>.json及index.json；不从静态plan造passed |
| `scripts/reports/build-bridge-acceptance-handoff.sh` | report；validated runreport/EV及原00 AC计划映射 | 生成reports/acceptance/<run_id>/handoff.md/json初稿；human/Agent review另reports/review/<run_id>/，不自动verdict/signoff/readiness |

参数合同：全部脚本支持`--run-id`（required，`^br-[0-9]{8}T[0-9]{6}Z-[a-z0-9]{6,12}$`）、`--artifact-root`（省略时仅`artifacts/test/<run_id>`）、`--config-profile`（required，04selector ASCII grammar的批准harnessprofile标记，不是raw config/ref）、`--help`（无运行IO）。重复/未知/缺参数拒，不能eval任意命令。artifact-root即implementationrepo内固定该run根；不同位置/absolute/.. /symlink/错误run拒，不能扩大写入范围。CLI是test-only，不新增production三入口参数。

I/O合同：context.json、case/suite安全JSON、index.json及非JSONtoken-only stdout/stderr在`artifacts/test/<run_id>/`；report到`reports/runs/<run_id>/`和`reports/acceptance/<run_id>/`，review只人审。完整harness schema/digest与文件清单由05§13固定；无latest或<project>层。case writer来自真实runner逐实例，stdout/stderr不inherit：未验证output仅bounded私有内存，每stream64KiB上限；安全allowlist后才写token-only blob，不保存raw SDK/平台错误或compiler自由文案。禁止消息/附件body、token/secret/私有callback/敏感审批及可还原派生，连摘要也不保留。

runner合同：仅调用原11target的membermanifest和Cargo test binary；例如S固定`cargo test --manifest-path crates/contracts/Cargo.toml --test protocol_surface_tests -- --test-threads=1`，其他按原target路径derive，不任意filter/跳过params。S/P testtarget内test-only DTO/writer先验safe字段后输出case artifact；不可导出到production wire/lib。只可用test-only env `BR_TEST_RUN_ID`/`BR_TEST_ARTIFACT_ROOT`/`BR_TEST_CONFIG_PROFILE`/`BR_TEST_MODE`/`BR_TEST_CONTEXT_PATH`传非敏感harness上下文，不能传token或原config值。每suite timeout从批准harnessbudget显式取得，缺失blocked；timeout/scopedcancel保existing safety材料和实际原unknown/对账责任，不retry整个real suite造新effects。

有限退出：0=该工具本次合同通过（非readiness）；1=assertion/check失败；2=参数/schema/path错误；3=blocked资格/coverage/baseline；4=unavailable工具/环境/IO。失败/blocked/unavailable保留已有安全artifact/report与有限failure分类，不能制造替case、伪通过或echo canary/raw error；无法安全建立context时仅有限stderr，不编造context或run实例。每run独占writer，immutablecontext/case输出禁止覆盖，minimalindex到finalindex只受控CAS/atomicrename；报告重复生成须同内容或拒冲突，不覆盖旧run。

状态仍planned/not_run/blocked实际seam；正式07才指定全部planned implementationboundary，implementation/test/stage/commit权限=false。


## 5. 实际审查

四处同步完成；实际path/参数/64KiB安全捕获/TEST-03-001检索通过，sources=3（正式03两章+两来源）、plannedScripts=7、errors=[]；仅design，不implementation/script capability/run/evidence。原state§9 excerpt未变，后续Step13明确schema再复核引用，无待反校准公共合同。

commit_required=false。
