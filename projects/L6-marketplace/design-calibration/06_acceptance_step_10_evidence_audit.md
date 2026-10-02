# Step 10：可观测性、审计与证据门禁

## 1. Step 状态

SOP Step10/规范5.10；正式§10；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=十二证据项/98EV独立停审、归档双射与跨真实性审计完成；next_allowed_action=读取Step11五VETO输入。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| 逐问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 逐类证据门禁 | done | §7 |
| 复杂度/98EV独立附录 | done | 完整归档索引另拆，非实际index |
| 回填草稿 | done | §8 |
| 跨真实性审计 | done | §10及只读98双射/主suite核对 |

## 2. 本步输入

source_files：[Step9](06_acceptance_step_09_nonfunctional.md)、[Step3](06_acceptance_step_03_baseline.md)、[Step5](06_acceptance_step_05_function_gate.md)与独立AC附录、03§14/[逐flow观测审计](03_ddd_step_15_observability_audit.md)、[05证据归档](05_test_plan_step_13_evidence.md)、[完整schema/semantic规则](05_test_plan_step_13_artifact_schema.md)、[98TC/EV](05_test_plan_step_06_cases.md)、[11suite/六checks两stage/四report器](05_test_plan_step_09_automation_gates.md)、05Step5 canonical反向映射。前序全部门禁和十二开放项继承；无实际材料。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些audit必有？ | 每21C真实accepted同Tx safe六字段；12J原A checkpoint/permission和新B真实结果/Blocked audit/fullreport；16Q/33replay无新audit。 |
| trace/log/metric？ | 49入口/Runner/PG/八SDK有限字段与原Core trace；03十二metric的打点语义/finite labels可由实际capture断言，不拿诊断指标证明业务结果。 |
| 哪些报告归档？ | 全11主suite JSON/MD、run/summary、gate-results/redaction-check、六checks两stage JSON/MD、98EV JSON/MD/index、机器draft、三个review人工记录。 |
| 缺失是否不通过？ | actual送验的P0 raw/report/check/EV缺失不授通过；当前未送验不伪填不通过。handoff缺失交接不完整。 |
| 如何复查？ | 先同run report→index→EV→suite→全部required raw，重验schema/hash/redaction/coverage和baseline，不信passed标签。 |
| index覆盖全部？ | 必须exact98及全required identity，完整反向附录逐EV停审；静态计划不是实际覆盖。 |
| gates覆盖全部？ | 11suite+release orchestrator的12gates与六checks，exit2/3/4阻P0；不能finalizer成功洗gate失败。 |
| redaction证明什么？ | actual全sink sentinel/capture与raw/report/bundle扫描，失败输出同样安全；不保存raw secret作证明。 |
| handoff经审查？ | 未来协调人登记exact run/review/scope，审查人补充来源/缺陷/资格/结论；当前没有记录或签署。 |
| VETO checklist？ | 五项逐actual证据/finding/裁决，Step11展开；缺项不写未触发。 |
| 风险接受？ | 七字段+actual authority/范围/期限/动作，Step13；机器risk-notes不是接受。 |
| 每EV回TC/suite/report/AC？ | 05唯一双射和主suite保持，完整附录给canonical AC/VETO补充锚点，不新增TC/EV或GT机器值。 |
| 每证据门禁停审？ | 每类先来源/风险/取舍/通过失败/路径/影响，再逐98EV设计停审，最后跨项。 |
| 静态造证/孤儿/缺raw怎么办？ | 直接证据无效，不能靠人工说明修passed；保首次失败，受影响fresh run/new review。 |

## 4. 当前文档问题诊断

旧06的口头样本和角色槽位不构成证据；既有机器schema不承载最终verdict或signature。完整98归档计划必须逐项可反查，而非只列代表EV。metric/call counter/Obs receipt只能诊断或局部绑定事实，不是审批/安装/支付/通知送达/验收evidence。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 代表EV表冒全覆盖 | 98逐行TC/suite/raw/report/AC及缺失影响 | 防孤儿与挑子例 |
| 导航或draft当签核 | 单向机器DAG+人工不可变review详情 | 不造自动verdict或摘要环 |
| 声称redacted/passed | 实际capture/check与import重新验证 | 不信自报标签 |

## 6. 设计取舍

采用05 marketplace-test/v1（11kind/48defs/135local refs）原schema与全semantic规则，不增acceptance机器kind/脚本。人工三入口沿Step3 append-only exact导航，详情按raw-byte摘要；reader显式选run/review，不选latest。归档计划附录只固定设计关系，实际index必须从actual suite/raw/report生成。所有planned路径保持未创建。

## 7. 结构化中间产物

### 7.1 十二证据门禁独立小循环

全项P0，风险/取舍、必须材料/固定位置、通过/失败、canonical AC与TC-EV各行独立回核；最后一列为设计停审，不是运行通过。EV的统一JSON/MD与同run index关系沿Step5§7及本Step98附录。

| GT / canonical AC | 风险取舍/必须证据与固定位置 | 通过条件 | 失败条件/影响 | TC → EV / 独立停审 |
|---|---|---|---|---|
| GT-MP-E01 / AC-MP-G01/G02 | 采用expected与actual分层；meta/context.json、registry.json、subcase-manifest.json及safe validated配置摘要 | actual impl/generator commit、00～06 bytes、profile/scope/DS/资格一致；98及七inventory精确集合 | 假commit/伪qualified/漏inventory/静态passed阻送验和授通过 | TC-CROSS-010→EV-RELEASE-001；TC-CROSS-023→EV-RELEASE-002；design-stop/pass |
| GT-MP-E02 / AC-MP-G02 | 采用实际runner/capture；suites/<suite>/cases/<tc>/<subcase>.json、logs/<execution>.jsonl、stdout.log/stderr.log | 全required主执行真实assertions/times/counters，finite log-entry；未启动时间null，失败保真 | 空断言、默认0、重选passed、缺safe日志或raw阻通过 | TC-CROSS-005→EV-API-001；TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E03 / AC-MP-503/G02 | 采用safe六字段+真实local frame；原audit/operation/result/work/plan/checkpoint/permission断言 | audit_ref/subject_ref/operation_ref/actor_ref/basis_refs/cursor与真实accepted同Tx，原auditset；Q/replay无写 | audit缺失/脱节、A提前成功、Obs递归/Archivewriter阻P0，适用VETO5 | TC-CROSS-015→EV-PG-019；TC-RECOVERY-007/008/009→EV-RECOVERY-007/008/009；design-stop/pass |
| GT-MP-E04 / AC-MP-503/G01/G04 | 采用03 finite capture；runtime API/Worker/PG/八adapter/log-trace-metric/bundle安全断言 | 原Core trace单authority，12metric名/标签沿03，无高基数和raw；export failure不回滚事实/不自投递 | secret/body/隐藏存在性泄漏VETO1/3；安全diagnostic不足P0；不能用metric证明外部结果 | TC-CROSS-006→EV-REDACTION-001；TC-CONFIG-007→EV-CONFIG-007；design-stop/pass |
| GT-MP-E05 / AC-MP-G02/G03 | 采用raw aggregate；artifact suite report.json与reports suites JSON/MD | 11suite主集合互斥且全98，counts/status来自raw，失败亦finalize，PG/browser必要层实际运行 | 空suite passed、补层替主、缺pair/report或fake替PG阻P0 | TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E06 / AC-MP-G01/G02/G03 | 采用六check独立artifact/seal；checks/<stage>-<check_id>.json/md | dependency/config/redaction/no-static/schema-integrity/coverage完整inputs与实际检查；两stage不覆写/不self-ref | 非0、漏check、自证明、只有标签均阻通过；泄漏按VETO1 | TC-CROSS-006/009/010/020→EV-REDACTION-001/CONFIG-013/RELEASE-001/UNIT-005；design-stop/pass |
| GT-MP-E07 / AC-MP-G02 | 采用单向run aggregate；run-report.json、summary.json/md、gate-results.md、redaction-check.md | 全11suite/12gates和artifact checks，机器/MD配对；finalizer成功不洗gate2/3/4；失败仍有gap | 缺suite/gate/失败/实际precondition、伪counts或raw摘要错阻通过 | TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E08 / 全20AC | 采用actual关系生成；98 evidence JSON/MD和index JSON/MD | 每EV一个主TC+该TC所有required raw、主suite JSON/MD、六artifact checks、design/AC/scope；reader重新验证 | orphan/重复/漏subcase/跨run/无raw/report/GT入enum阻通过 | 全98TC↔EV见独立索引；TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E09 / AC-MP-G02 | 采用成熟度显式；index.maturity/completeness与shell/final | shell永incomplete；final全98有效/MD complete；每级脚本/产物未来实际可验证 | shell冒final、失败补EV、计划映射冒actual阻通过 | TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E10 / AC-MP-G02 | 采用final→seal→draft；acceptance/<run_id>-draft.json/md及notes | marketplace-test/v1 Draft仅pending/annotated，引用final与全部seal，无verdict/signoff/risk acceptance | 用risk-notes/annotated冒接受/签署、index回seal/hash环阻通过 | TC-CROSS-010→EV-RELEASE-001；design-stop/pass |
| GT-MP-E11 / AC-MP-G01/G02 | 采用人工不可变记录；三个固定导航和exact run-review详情 | writer/reader/phase/范围/来源/缺陷/风险/五VETO明确，实际审查签署另须Step14；导航校摘要/无latest | 缺handoff交接不完整，缺VETO不授通过，缺风险接受不授条件通过；机器工具不能代签 | TC-CROSS-010→EV-RELEASE-001仅工具边界；人工actual记录须逐项复核，不能凭TC代替；design-stop/pass |
| GT-MP-E12 / AC-MP-G02/504 | 采用失败保留/新run-newreview；原raw/report与supersession关系 | 失败/Blocked/not_run不覆写；数据清理与证据retention分开；变更按Step3失效 | 自动删失败/挑跨run passed/假旧report/没权限删证据阻通过 | TC-CROSS-010→EV-RELEASE-001；TC-RECOVERY-005→EV-RECOVERY-005；design-stop/pass |

### 7.2 完整98归档与机器检查规则

[98逐EV独立归档索引](06_acceptance_step_10_evidence_index.md)是本章规范性计划附录；正反需求映射沿05Step5，shared风险沿05Step13 CUT与06门禁补充。不能复制计划表生成actual evidence-index。

JSON Schema只校形状，semantic必须同时执行：duplicate/unknown/严格UTC；同run safe paths及identity唯一；registry/manifest与49/43/222/17/146/33/7集合相等；actual assertions/counters/times/selection；expected counts精确；actual baseline/slot资格；required全部raw/report；四级成熟度；DAG/source_refs；redaction/import重检；工具synthetic输入隔离。不能把这些检查改warning。

SHA-256小写64hex，JSON用RFC8785成熟库，仅去本record顶层record_digest；child/ref摘要全部保留。MD/设计来源/JSONL文件用exact raw bytes，JSONL每line另有record摘要。fingerprint、owner asset digest、artifact digest不混用，不是approval/签名。无实际摘要值。

生成方向固定：registry/manifest→context→log/case→suite/raw/rendered JSON/MD→六artifact checks→run/summary→98EV→index→六seal checks→machine draft。EV不指index、index不指seal、check不自指。人工详情读取已seal材料但不加入05 RecordRef/DAG，index不反指人工文件。

### 7.3 Report完整性检查表（未来必检，当前未勾选）

| 检查项 | 固定logical位置 | 通过条件/缺失影响 |
|---|---|---|
| expected/actual | artifacts/test/<run_id>/meta/*.json | exact98/11suite/库存/全required manifest、actual baseline；缺失送验不成立 |
| 主suite pair | artifacts/test/<run_id>/suites/<suite>/report.json；reports/runs/<run_id>/suites/<suite>.json/md | raw/source_refs/counts/机器与展示一致，失败仍report；缺raw/pair阻通过 |
| 全raw/log | suites/<suite>/cases/<tc>/<subcase>.json、logs/<execution>.jsonl、stdout.log/stderr.log（artifact根） | 真实主执行、safe内容/actual摘要，全部required；缺失阻通过 |
| run与release | artifacts/test/<run_id>/run-report.json；reports/runs/<run_id>/summary.json/md、gate-results.md | 全11suite与12gates/checks，非0不洗白；缺失阻通过 |
| 六checks两stage | artifacts/test/<run_id>/checks/<stage>-<check_id>.json；reports/runs/<run_id>/checks/<stage>-<check_id>.md | artifact/seal各六，inputs/schema/hash/redaction/coverage有效；任何缺失/失败阻通过 |
| 脱敏展示 | reports/runs/<run_id>/redaction-check.md | 回实际六checks/capture，无raw secret/body/bundle泄漏；实际泄漏VETO1 |
| 98EV pair/index | artifacts/test/<run_id>/evidence/<EV-ID>.json、evidence-index.json；reports/runs/<run_id>/evidence/<EV-ID>.md、evidence-index.md | 一个主TC/全部raw/report/六artifact checks，final complete；shell不退出 |
| machine draft/notes | reports/acceptance/<run_id>-draft.json/md及05指定veto/open-issues/risk-notes | 真实final/seal，pending/annotated，不能代人工裁决或接受 |

### 7.4 人工固定入口、详情字段与handoff检查

沿Step3三个入口不变，全部未来planned。review_id与run_id同finite语法，不能latest/点目录；协调人分配前必须核对三个渲染详情路径唯一，连字符组合碰撞也拒复用并另分review_id，不覆写历史。

| 固定入口 / 不可变详情 | future writer / reader | 最小内容与缺失规则 |
|---|---|---|
| reports/acceptance/handoff.md → reports/acceptance/<run_id>-<review_id>-handoff.md | 审查协调人组织并登记；交付/测试供actual来源，正式审查者读取 | exact run/review、review phase、scope/exclusions/selected tuple、00～06/impl/test/config/DS/owner基线引用、machine draft/summary/index/12gates/六seal checks、open issues/复验/风险/VETO详情引用、各维度结论与签署状态、supersedes；缺任一必要绑定交接不完整 |
| reports/acceptance/veto-checklist.md → reports/acceptance/<run_id>-<review_id>-veto-checklist.md | 安全/架构审查角色逐项核查，协调人登记；裁决人/owner审阅 | 同组合/baseline/phase；五VETO identity/正式来源、TC/EV/完整report/raw、actual finding与审查结论、阻断影响、审查角色/日期；未核查明确未核查，不能填未触发 |
| reports/acceptance/risk-acceptance.md → reports/acceptance/<run_id>-<review_id>-risk-acceptance.md | 风险责任人提案、正式接受authority给真实决定，协调人登记；裁决人/07消费者读取 | 同组合/baseline/phase；全部残余与scope外blocker、资格影响、每eligible风险七字段/actual接受依据/期限/失效条件；未接受明确未接受，无eligible残余也显式说明；缺失不能条件通过 |

每导航登记行必有exact run_id/review_id/scope/phase、不可变详情path、actual SHA-256/raw-bytes摘要、登记角色/日期、supersedes或明确无；reader显式指定组合并重算校对三个入口，不能自动选最后一行。MD不内嵌自身digest，摘要只放导航。三个详情可按先VETO/风险后handoff的单向引用封存，VETO/风险不反指handoff，避免人工引用环。

人工工作笔记在正式封存前只属于审查材料，不能作为signed/detail事实。submission review可记录“未裁决/未签署”，满足送验交接但不满足结束/放行；实际decision review必须重新分review_id并显式supersedes送验review、保持同run/baseline，填真实三值/authority记录。封存详情不能原处补签或改结论；更正文档审查用newreview，测试/实现/环境/config/scope变更还需newrun。此phase仅人工MD说明，不新增05机器字段/脚本或签署能力。

handoff必检：指定组合唯一、三详情原字节/来源可读、同baseline/scope、98EV与全部required raw/六seal checks真实、formal-selected exact资格、实际缺陷与首次失败/复验保留、VETO全部审查、风险authority与动作期限、decision角色分权。检查事实只能未来实际记录；当前一项都未勾选。

### 7.5 成熟度与跨证据审计

script capability、minimal index shell、final EV details、acceptance handoff draft四级仍planned/planned/planned-blocked/waiting。07完成时分别建立implementation boundary与planned/blocked/waiting skeleton；不提前创建。脚本可运行不等业务证据，final evidence不等owner资格、draft/annotated不等verdict，人工签署也不等Governance approval/安装/支付/生产readiness。

十二E门禁和98EV独立设计停审完成；report/check/raw与人工writer/reader固定，无孤儿/重复/跨run/静态运行填值/自引用/不明风险接受。实际schema/hash/捕获/报告可用性仍未执行，不把本节静态审计作为证据已存在。

## 8. 回填草稿

正式§10装配十二证据门禁、98归档附录入口、schema/semantic/hash/DAG、report完整性、三个固定人工导航与不可变detail/phase/authority规则、四级成熟度。实际先report后raw复核，缺P0证据或redaction失败不授通过；当前未送验、无run/EV/report。

## 9. 待确认事项

actual impl/generator/run、provider/PG/browser、retention/访问/删除authority、审查协调人与正式签署权限全部未提供。MP-UP-008 safe producer/Obs受影响项继续开放；本地audit/runtime和验收EV分层，没有Archive market lane。不会创建实际三入口或digest。

## 10. 进入下一步条件

自检：SOP十四问、十二逐类门禁、全98独立反向归档、完整11kind schema/semantic/摘要及六checks两stage、machine/pending与人工decision分层、report/handoff检查表和跨真实性设计审计齐备。Step10设计pass；下一读SOP Step11/规范5.11、00五VETO、05正反映射及S/A/B；不提交commit。
