# Step 13：测试报告与证据归档

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（schema/证据设计）。输入Step6/9/12、00AC/VETO与证据闭环标准；输出唯一EV计划、机器schema、writer/reader、paths、成熟度和防静态造证据规则。不创建实际artifact/report/index、digest或run。

Step内计划：EV/TC/AC绑定→schema/source ownership→摘要/DAG/脱敏→逐报告停审→跨证据审计；全部完成设计审查。只读JSON解析/局部ref/required字段检查：11kinds、48defs、135局部ref无断裂；不是生成器/validator运行测试。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_12_entry_exit.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 已拆规范性artifact JSON Schema附录，主控保留目录/归属/停审 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step5编号](05_test_plan_step_05_traceability_coverage.md)、[Step6主TC/EV](05_test_plan_step_06_cases.md)、[Step9](05_test_plan_step_09_automation_gates.md)、[Step12](05_test_plan_step_12_entry_exit.md)、SOP Step13、书写规范§4.4～4.6/5.13、闭环标准§7.1～7.5。06仅未来消费者，不读取/继承旧06 verdict。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类证据？ | actual case assertions/redacted logs、suite/run报告、schema/coverage/redaction checks；PG证明来自实际PG测试raw，不fake充数。 |
| 保存哪里？ | §7.1 artifacts/test/<run_id>与reports/runs/<run_id>；统一无项目子目录。 |
| 关联TC/验收？ | 每EV一个显式主TC数组，suite/raw/report/AC/VETO均由validated实际run关系生成，不只registry静态映射。 |
| 哪些log/trace/DB保留？ | redacted stdout/stderr、有限事件/实际assertion；DB只安全断言，不dump ownerbody/secret/完整库。 |
| 保留多久？ | 正式retention authority未定，不编天数、不自动删历史；访问/轮换受控，测试临时清理与证据保留分开。 |
| machine统一根？ | artifacts/test/<run_id>/meta/context.json、suite/raw/check/EV/index，固定run。 |
| readable统一根？ | reports/runs/<run_id>，JSON来源生成MD；禁止手写覆盖结果。 |
| acceptance根？ | reports/acceptance/<run_id>-draft.json/md及受控人工补充，不能作为verdict。 |
| 谁生成？ | Step9四report scripts，具体writer/reader与格式见§7.2。 |
| 人工补充？ | 检查真实执行范围/故障解释/blocked资格/风险责任，不修改raw或代填owner签核。 |
| 失败仍report/log？ | finalizer必须保留失败原因/每未执行case/安全stdout/stderr；无法输出也阻gate并有tooling gap。 |
| 脱敏证明？ | 实际capture+sentinel assertions+raw/report/bundle scanner；字段声称passed不自证，import必须重新验证。 |
| 真artifact而非静态？ | registry仅expected；EV必须实际case/subcase及report配对完整、同baseline/source/timestamp约束。 |
| EV回链？ | EV→明确TC→主suite全部required raw→报告→AC/VETO；CUT反查如下。 |
| 逐报告停审？ | schema产物完成后§7.6逐类。 |
| 跨证据缺口？ | 校验孤儿/重复/缺raw/report/跨run/脱敏/摘要/phase，不能以draft index填补。 |

## 4. 当前文档问题诊断

之前仅EV family没有可编码schema；把record自身摘要及report/index互相引用会产生循环；将index shell当final evidence会提前完成验收。失败报告也必须有机器来源与安全日志。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 字段清单/占位EV | strict JSON Schema+semantic检查+98唯一EV主表 | 可落码/可拒绝 |
| 多向摘要引用 | 单向DAG与唯一自引用排除规则 | 摘要可复算 |
| 静态链接当证据 | actual raw/report校验后final EV | 防虚假执行 |

## 6. 测试设计取舍

采用JSON Schema2020-12加显式semantic校验，非手拼文本/parser；未来Rust/TS generator共享该版本schema。未采用hash任意JSON字符串或信任`redaction=passed`标签：必须canonical SHA256及重新扫描。机器类型只属于测试harness/scripts，绝不进入public contracts/domain/application，不新建Evidence业务truth。

## 7. 结构化中间产物

### 7.1 Planned目录（不存在，不创建）

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/registry.json
  meta/subcase-manifest.json
  suites/<suite>/report.json
  suites/<suite>/cases/<tc_id>/<subcase_id>.json
  suites/<suite>/logs/<execution_id>.jsonl
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  checks/<stage>-<check_id>.json
  run-report.json
  evidence/EV-<LEVEL>-NNN.json
  evidence-index.json
reports/
  runs/<run_id>/
    summary.json
    summary.md
    gate-results.md
    redaction-check.md
    checks/<stage>-<check_id>.md
    suites/<suite>.json
    suites/<suite>.md
    evidence/EV-<LEVEL>-NNN.md
    evidence-index.md
    review-notes.md
  acceptance/
    <run_id>-draft.json
    <run_id>-draft.md
    <run_id>-veto-checklist.md
    <run_id>-open-issues.md
    <run_id>-risk-notes.md
```

human notes允许补充且按run隔离，不改actual机器结果；risk-notes不是risk acceptance。任何future roots override仍需按Step9验证，正式引用用上述logical相对路径，无latest。

### 7.2 Writer/reader与报告映射

| 产物/kind | writer（未来） | reader | 生成/来源/审查 |
|---|---|---|---|
| registry/subcase-manifest/context | run harness | 全gate/check/report | 从已确认TC/EV/DS与实际baseline/profile/资格构造expected；不得写测试passed |
| case/log-entry | 被测suite runner/capture | build_suite_report/checks | 实际执行、assertions、safe code/计数；时间不是人工填值 |
| suites/<suite>/report.json | suite gate/finalizer | suite report builder/checks | 完整actual raw aggregate；failed/blocked/unavailable/not_run也记录 |
| reports/.../suites/<suite>.json/md | build_suite_report.sh | run builder/EV/import审查 | 同kind schema JSON附source_refs；MD仅其渲染，失败原因安全 |
| check-report | 6 checks各writer | run builder/EV/seal checker | actual scope/pairing/redaction/integrity/coverage，不能自己给自己证明 |
| run-report/summary JSON/MD | build_run_report.sh | EV/draft/import | suite与check全集，不选最好重跑 |
| evidence-detail/EV MD | build_evidence_index.sh | evidence index/import/审查 | 每EV唯一主TC及required actual raw+报告+checks |
| evidence-index/MD | build_evidence_index.sh | seal checks/acceptance draft | minimal shell或final明确maturity，绝不自动升级 |
| acceptance-draft/各人工notes | build_acceptance_draft.sh + 正式审查人 | 未来06消费 | 同run final index+seal checks；pending review，no verdict/signoff |

机器结构见[规范性artifact schema](05_test_plan_step_13_artifact_schema.md)，包括required/optional、enum、writer/reader、SHA256、自引用和semantic验证。没有日志任意message或raw error stack字段。

### 7.3 EV/TC/suite/AC归档索引（计划）

98个EV编号和TC一一对应定义在Step6每行（Step5双射复核），每个实例`tc_refs=[该完整TC字符串]`；不能写“all P0”、区间、glob或人工检查。suite取该行主suite，artifact为同run该suite全部required subcase，report为同run该suite机器/MD，AC/VETO来自Step5逐需求反向匹配；无直接业务需求的共享契约须用下表设计风险AC，不成为孤儿EV。

| CUT-MP | TC代表→EV代表 | 主suite/保存 | AC/VETO锚点 |
|---|---|---|---|
| 01 | TC-CROSS-011→EV-UNIT-003 | D、run scoped raw+suite report | AC-MP-G01/G04 |
| 02 | TC-CROSS-012/013→EV-DOMAIN-027/028 | D、完整factory/pair subcase | AC-MP-G02、VETO-MP-5 |
| 03 | TC-CROSS-014→EV-UNIT-004；TC-CROSS-018→EV-API-003 | I/W、flow/port/route raw | AC-MP-G01/G02 |
| 04 | TC-CROSS-015→EV-PG-019 | P、actual PG assertions | AC-MP-G02 |
| 05 | TC-RECOVERY-005/006→EV-RECOVERY-005/006；TC-CROSS-019→EV-WORKER-021 | R/W、fault/probe raw | AC-MP-403/504、VETO-MP-5 |
| 06 | TC-CROSS-001/002→EV-UNIT-001/002 | D、33body canonical raw | AC-MP-G02 |
| 07 | TC-CROSS-017→EV-PG-021 | P、七paged/as-of raw | AC-MP-302/303、VETO-MP-3 |
| 08 | TC-CROSS-016→EV-PG-020 | P、race/late raw | AC-MP-203/501/502、VETO-MP-5 |
| 09 | TC-REFERENCE-003→EV-PG-013；TC-CROSS-004→EV-PG-018 | P、manifest/search raw | AC-MP-301/303/504 |
| 10 | TC-CONFIG-001/012→EV-CONFIG-001/012；TC-CROSS-020→EV-UNIT-005；TC-CROSS-022→EV-CONFIG-014 | C/D、loader/依赖/assembly raw | AC-MP-G01/G03、VETO-MP-4 |
| 11 | TC-CROSS-006→EV-REDACTION-001；TC-CROSS-010→EV-RELEASE-001 | X/E、capture/工具真实运行raw | AC-MP-503/G01/G02、VETO-MP-1/5 |
| 12 | TC-CROSS-005→EV-API-001 | W、全readonly/replay spy raw | AC-MP-302/G02 |
| 13 | TC-CROSS-008/021→EV-WEB-001/002；TC-CROSS-023→EV-RELEASE-002 | B/M、browser/闭环raw | AC-MP-G04及五能力AC |

代表表是风险入口，不替代98EV实例；生成器从Step6 registry和实际raw关系导出完整明细。工具负例的synthetic输入不进入final EV；但CROSS-010真实执行validator的raw/assertions本身可以形成EV-RELEASE-001，不混为真实业务运行输入。

### 7.4 摘要、引用DAG与失败留存

算法固定SHA256，小写64hex；JSON record经RFC8785（成熟库）canonical UTF-8，仅删除该record顶层`record_digest`再hash，其他child/ref digest全保留。无其他忽略字段；hash不提供approval/evidence owner签名。整数计数上限2^53-1或明确decimal string，非法/duplicate key/NaN/unknown先拒绝，不能parser normalize后掩盖。

log/MD等非JSON-file引用hash exact UTF-8 bytes；JSONL日志按文件raw bytes hash，各line本身也有record_digest。RecordRef mode区分`json-record`/`raw-bytes`，不能混用或将asset_digest当artifact hash。JSON refs核对record摘要与重算值；MD正文不含自己digest，不回指index。

生成DAG：registry/manifest→context→logs/case→suite/raw与rendered report→artifact-stage checks→run report→EV detail→index→seal-stage checks→acceptance draft。EV/detail不反向引用index，index不引用seal check，checks不包含自己的output ref；seal checks只向后验证已生成index/run/EV，不要求其回指seal。各writer final serialization自身strict/redaction校验，import重新全量验证，不信声称passed。

failure/unavailable/blocked suites仍finalize report、redacted stdout/stderr及安全failure_code；无实际执行subcase not_run不伪造started_at。若report writer本身失败，gate非0并保原raw/tooling gap，不造成功report。污染raw secret仅内存检出和安全隔离，归档redacted结构，不归档原secret为了证明scanner。

### 7.5 四级成熟度

| 级别 | 未来允许产物 | 禁止外推 | 当前 |
|---|---|---|---|
| script capability | 实际参数/paths/checks/report器能运行；工具负例 | 不等完整业务TC/evidence | planned |
| minimal index shell | 从actual run生成可解析context/suite链接、entries可空且incomplete | 不生成qualified final EV/退出或verdict | planned |
| final EV details | 98主TC全部required actual raw/report/check通过才完整index和EV MD | 不等正式owner全资格/06签核 | planned/blocked |
| acceptance handoff draft | final index+seal checks+人工说明补充 | 不能verdict/signoff/readiness/risk acceptance | waiting |

正式07须分别排boundary并为每级建planned/blocked/waiting skeleton，本轮不创建implementation ledger。retention/访问policy由正式authority确认；未经授权不得以自动cleanup删除证据历史。

### 7.6 证据归档停审与跨真实性审计

| 产物 | 逐类设计停审 | 来源/字段/摘要/phase检查 |
|---|---|---|
| registry/manifest/context | pass | expected不写actual pass；98唯一TC/EV/DS，实际baseline/provider资格未提供不得伪填 |
| case/log | pass | complete assertions/actual counters/times、有限诊断、JSONL/非JSON文件摘要明确 |
| suite/run报告 | pass | raw aggregate+source_refs、失败仍报告/安全日志，不因finalizer成功转gate pass |
| check-report | pass | 六check、artifact/seal两stage不overwrite/不self-ref；真实检查而非标签 |
| EV detail/MD | pass | exact一个主TC+全部required raw/report/checks，同run/hash/AC，synthetic输入不混入 |
| evidence index | pass | shell不complete；final需要全部expected合格EV及MD，DAG无循环 |
| acceptance draft/notes | pass | 同run final+seal，仅pending/annotated review，不签核/裁决 |

跨真实性审计：98TC/EV主表唯一、13CUT均有真实归档方式；没有孤儿/重复编号、无静态运行实例，schema必填/nullable/enum/writer/reader/算法闭合。已修JSON缺闭合与artifact/seal文件覆盖风险；所有report/source/EV引用DAG单向。静态检查只证明设计可解析，执行与final证据全部planned/blocked/waiting。

## 8. 回填草稿

正式§13收录目录、writer/reader、EV归档索引、完整schema入口、摘要/DAG/失败/成熟度。过程诊断/停审留calibration；不存在实际EV。

## 9. 待确认事项

真实impl/generator/run、retention/访问/风险authority和owner exact qualification仍未提供。详细设计影响判定：只测试管理schema，不进入public domain、不持有owner正文/approval/交易/Obs evidence。后续若要加入新capture字段或生成器格式必须重审schema与redaction，不临时保存rawpayload。

## 10. 进入下一步条件

machine schema/semantic检查、98TC/EV/AC回链和逐报告/跨真实性设计审计完成；本步设计门禁pass，实际artifact/report/evidence仍不存在。下一读SOP Step14/规范§5.14、03§17的12开放项及复验/回归传播，不提交commit。
