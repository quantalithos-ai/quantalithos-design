# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13  
> 回填章节：`05-测试方案.md` §13  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / evidence_structure_planned_not_instantiated |
| 输入基线 | Step5/6/9~12；测试规范 §4.6/§5.13；中间产物规范 §5.9 |
| 本步输出 | 59 EV 槽位规则、raw/report schema、目录、生成/审查、真实性与追溯审计 |
| 事实边界 | 只定义 planned boundary；没有真实 run_id、artifact、report、EV instance、review 或验收引用 |
| 下一动作 | Step14 定义回归触发与残余风险 |

## 2. 本步目标与输入

本步固定未来一次测试运行如何从真实 case assertion 形成 suite raw、run report 和可供 06 引用的 EV 实例。Step5/6 已注册的 59 个 `EV-WS-*` 是稳定槽位，不是当前存在的证据；只有固定 run 中的真实 raw、派生 report、redaction/integrity 检查和明确状态共同存在时，才形成该 run 的 EV 实例。

| 输入 | 本步用途 |
|---|---|
| Step5 | 固定 59 TC 与 59 EV 一对一编号，不重命名或扩号 |
| Step6 | 固定每个 TC 的断言、外部 blocked 部分与同序 EV |
| Step9 | 固定 13 suite、9 planned scripts、raw/report 根与重跑规则 |
| Step10 | 固定 telemetry 非业务证据、redaction 和 measurement 边界 |
| Step11 | 固定失败保留、复验新 run 与关闭材料 |
| Step12 | 固定完整退出需 raw→report→EV 且 blocked/not_run 非通过 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据？ | 每个被选 TC 输出 case JSON；每个 suite 输出 report.json、redacted stdout/stderr 与 failure reason；固定 run 输出 context、suite汇总、EV index、redaction与integrity报告。无需DB snapshot时，以安全的事务前后结构化断言替代，不复制业务正文。 |
| 保存在哪里？ | raw统一在 `artifacts/test/<run_id>/`；人读报告在 `reports/runs/<run_id>/`；验收草案在 `reports/acceptance/`；审查意见在 `reports/review/`。 |
| 如何关联 TC 和验收？ | EV槽位与TC一对一；未来EV实例必须包含run、TC、suite/case raw路径及digest、report路径、状态、redaction状态。06创建前验收引用为 `pending_06`，不得发明AC。 |
| 哪些输出必须保留？ | context、全部选定suite report、全部已运行/blocked/not_run case raw、redacted stdout/stderr（可为空但文件/状态明确）、失败原因、EV index、gate/redaction/integrity报告。 |
| 保留多久？ | 至少保留至对应验收与相关缺陷复验完成，并服从未来正式归档/retention政策；当前不得写天数、TTL或自动GC。 |
| 失败 suite 是否仍输出？ | 是。若进程可控，必须写失败/blocked/infrastructure_failed的report、已完成case和安全失败原因；若无法写，则gate记录missing-output并失败，不能手写补pass。 |
| 如何证明redaction？ | 扫描raw、stdout/stderr、run reports和acceptance草案；scanner无法完成即非通过。扫描报告本身只保存安全位置/类别，不回显canary值。 |
| 如何防静态造证据？ | EV index只能从同run的case/suite raw和report路径/digest派生；任何缺raw、跨run、引用latest、状态改写、手填pass均由output-integrity check阻断。 |
| 谁补充报告？ | scripts只生成事实草案；人/Agent只补说明、风险和争议，不得改raw状态或代替06 verdict/signoff。 |

## 4. 当前材料问题诊断

| 旧模板问题 | 风险 | 本步修正 |
|---|---|---|
| 只有三行目录表 | EV无法回到具体TC/case/digest | 定义raw与EV item最小字段 |
| “候选EV必须在06前复核”含糊 | 可能认为静态槽位就是证据 | 明确slot与run instance两层 |
| 一个TC可在多suite执行但无权威规则 | 冲突状态可能被任选成功值 | 定义required source set与保守聚合 |
| 未覆盖failed/blocked/not_run | 报告可能只保留绿色结果 | 所有状态进入raw/report，非passed不能满足退出 |
| 没有acceptance/review边界 | 脚本草案可能冒充signoff | 人/Agent可补说明但不能改raw或裁决 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| EV | 59 个计划编号 | 仍是59槽位；定义每run实例形成条件 |
| raw | 目录名 | context/suite/case/index最小字段与状态 |
| 多suite | 未决 | required source、保守聚合、冲突阻断 |
| report | “由脚本生成” | 输入、输出、人工审查和失败语义逐项 |
| 验收 | 06消费 | pending_06，不发明AC/verdict/signoff |

## 6. 证据归档设计取舍

| 议题 | 采用方案 | 未采用方案及原因 |
|---|---|---|
| EV编号粒度 | 59个TC一对一EV槽位 | 不合并成族级EV，避免单个失败被族级通过掩盖 |
| EV是否预创建文件 | 运行时由真实raw派生 | 不在设计或实现初始骨架中填空白/假证据 |
| 多suite取值 | 对该TC声明的required sources全部聚合，最保守状态胜出 | 不取“最后一次”或“任选一次passed” |
| blocked是否有证据实例 | 可有真实blocked raw实例，但不能作为通过证据 | 不删除blocked，也不填passed |
| artifact digest算法 | exact算法交07实现选择；字段必须存在且可重算 | 05不未经实施评估锁定算法/规范 |
| retention | 条件式保留，无数字 | 无正式archive/retention owner合同 |

## 7. 结构化中间产物

### 7.1 规则来源与产物分工

| 类型 | 固定路径 | 生成方 | 消费方 | 可人工补充 |
|---|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/` | gate / runner / check | report script / reviewer | 否 |
| run report | `reports/runs/<run_id>/` | `scripts/reports/*` 从raw生成 | reviewer / 06 | 只能加说明，不改raw事实 |
| acceptance draft | `reports/acceptance/` | script草案 + 人/Agent审查 | 06 | 是，但不可写伪verdict/signoff |
| review notes | `reports/review/` | 人/Agent | 06/缺陷复验 | 是，不替代raw |

### 7.2 EV槽位与实例规则

| 项 | 规则 |
|---|---|
| 稳定槽位 | 恰好使用Step5注册的59个 `EV-WS-<FAMILY>-NNN`，与同序 `TC-WS-*` 一对一 |
| 实例身份 | `run_id + evidence_id + tc_id + source_case_digest集合` 唯一定位；不能跨run拼接 |
| 形成条件 | 同run真实case raw存在；suite report引用并校验digest；run report路径存在；redaction/integrity有明确状态 |
| 状态来源 | 从required case sources保守派生，禁止人工或静态表直接赋passed |
| passed条件 | 所有required assertions/sources passed，且redaction/integrity passed；含external positive的TC必须有formal-seam source |
| 非通过状态 | failed、blocked、not_run、infrastructure_failed任一出现，则EV实例不得是passed |
| 冲突 | 两个required sources状态/事实矛盾时为failed/integrity conflict，不能挑选成功值 |
| 验收引用 | 目前 `pending_06`；正式AC只能由06创建后回填映射，不回写历史raw |

### 7.3 59个EV到suite归档面

| EV范围 | 数量 | 主raw suite | 条件性required source | 后续验收引用 |
|---|---:|---|---|---|
| EV-WS-CONTRACT-001~003 | 3 | contracts-protocol | api/worker/jobs（public mapping变更时） | pending_06 |
| EV-WS-SCOPE-001~003 | 3 | query-no-write | SCOPE-001需formal-seam；api-read-surface | pending_06 |
| EV-WS-VIS-001~003 | 3 | query-no-write | VIS-001需formal-seam | pending_06 |
| EV-WS-QRY-001~006 | 6 | query-no-write | api-read-surface；外部正向需formal-seam | pending_06 |
| EV-WS-SRC-001~006 | 6 | maintenance-consistency / worker-consumer-boundary | 正式event/order/replay项需formal-seam | pending_06 |
| EV-WS-INBOX-001~003 | 3 | worker-consumer-boundary | 明示attention/reopen需formal-seam | pending_06 |
| EV-WS-LOCAL-001~004 | 4 | maintenance-consistency | LOCAL-001关系正向需formal-seam；api主例 | pending_06 |
| EV-WS-REC-001~006 | 6 | jobs-recovery-boundary / maintenance-consistency | baseline/cutover durable项需formal-seam | pending_06 |
| EV-WS-STATE-001~003 | 3 | domain-invariants | maintenance-consistency | pending_06 |
| EV-WS-TXN-001~003 | 3 | maintenance-consistency / infra-adapter-contract | durable restart/原子证明需formal-seam | pending_06 |
| EV-WS-IDEM-001~003 | 3 | maintenance-consistency | durable/event proof需formal-seam | pending_06 |
| EV-WS-PAGE-001~002 | 2 | contracts-protocol / infra-adapter-contract | product crypto/rotation需formal-seam | pending_06 |
| EV-WS-CONFIG-001~003 | 3 | infra-adapter-contract / config-redaction-check | production composition检查 | pending_06 |
| EV-WS-SEC-001~003 | 3 | config-redaction-check | all-output redaction scan | pending_06 |
| EV-WS-DEP-001~002 | 2 | dependency-boundary-check | read-model-boundary | pending_06 |
| EV-WS-RES-001~003 | 3 | infra-adapter-contract | selected hardening仅采样，不替代语义结果 | pending_06 |
| EV-WS-BOUND-001~003 | 3 | read-model-boundary | entry suites/formal seam按断言需要 | pending_06 |

合计17族、59个EV槽位；没有新增族级EV、report EV或telemetry EV。report-integrity-check自身输出gate结果，不占用第60个业务EV。

### 7.4 Planned artifact目录

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/
    report.json
    stdout.log
    stderr.log
    cases/<TC-ID>.json
```

| 文件 | 最小字段 / 内容 | 真实性规则 |
|---|---|---|
| meta/context.json | schema_version、run_id、design/source refs、profile、suite selection、seam manifest refs、runner version、started/finished、safe environment summary | run_id非latest；无credential/body；source refs不可为空 |
| suites/*/report.json | schema_version、run_id、suite、status、selected/observed TC、case path+digest、failure reason ref、timing、stdout/stderr refs | 聚合不覆盖case状态；失败也写；缺case列入missing |
| cases/TC.json | schema_version、run_id、suite、tc_id、status、assertion列表、required source kind、safe failure/blocker refs、artifact refs、digest | tc_id必须在59注册表；expected回指05/03；actual不含正文/secret |
| evidence-index.json | run_id、59槽位中本run实际item、tc_id、status、source case paths/digests、report path、redaction/integrity、acceptance mapping状态 | 只由同run raw/report派生；不允许静态默认passed |
| stdout/stderr | redacted runner输出或明确空文件/缺失分类 | 扫描失败即非通过；不得用作唯一业务证明 |

#### Planned状态枚举

| 层 | 允许状态 | 聚合约束 |
|---|---|---|
| assertion | passed / failed / blocked / not_run | blocked用于必需外部前置缺失，不可当passed |
| case | passed / failed / blocked / not_run / infrastructure_failed | 所有required assertion passed才passed |
| suite | passed / failed / blocked / not_run / infrastructure_failed | required case最保守状态；missing output为failed/infrastructure_failed |
| EV instance | passed / failed / blocked / not_run / infrastructure_failed | 同TC required sources最保守状态 + redaction/integrity |

### 7.5 Planned reports目录

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    suites/<suite>.md
    evidence/<EV-ID>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

- `summary.md` 必须列出passed/failed/blocked/not_run/infrastructure_failed，不能只报通过数。
- `evidence/<EV-ID>.md` 仅在该run有真实EV实例时生成；非passed也保留真实状态。不得为59槽位预生成“通过”占位。
- `reports/acceptance/*` 引用固定run；脚本只生成草案，06之前不得出现最终VETO、verdict、signoff或readiness。
- `reports/review/*` 可记录争议、抽检和风险，但不能编辑或覆盖run report/raw。

### 7.6 Planned脚本与报告生成映射

| 报告 / 检查 | 输入 | Step9 planned脚本 | 输出 | 审查要求 |
|---|---|---|---|---|
| suite与run summary | context + suite/case raw | `scripts/reports/generate_test_reports.sh` | summary、gate-results、suite reports | 状态/数量/失败原因与raw一致 |
| raw EV index + human EV index | case raw + suite reports | `scripts/reports/generate_test_reports.sh` | raw evidence-index + report evidence-index/EV pages | 59 ID唯一；required source与digest完整 |
| redaction report | raw + run reports + acceptance drafts | `scripts/checks/check_redaction.sh` | redaction raw/result + redaction-check.md | 扫描范围完整；不回显canary |
| dependency report | manifest/import/composition metadata | `scripts/checks/check_dependency_boundary.sh` | dependency suite raw/report | L1/L2/L4 compile和production fake为阻断 |
| output integrity | context/raw/reports/EV index | `scripts/checks/check_test_outputs.sh` | report-integrity suite raw/report | 无跨run/latest/orphan/静态pass/状态改写 |
| acceptance草案 | fixed-run reports + defects/risks | `scripts/reports/generate_acceptance_handoff.sh` | handoff/veto/risk/open-issues草案 | 人/Agent补充，保留blocked且无裁决 |

其余Step9 gate脚本负责产生/调度raw，不新增脚本名称。上述路径和命令均planned，当前未创建。

### 7.7 EV item最小字段

| 字段 | 必填 | 规则 |
|---|---:|---|
| schema_version | 是 | test artifact schema版本；exact值由07实施固化 |
| run_id | 是 | 固定且非latest，与全部source相同 |
| evidence_id | 是 | 59个 `EV-WS-*` 之一 |
| tc_id | 是 | 与evidence_id同族同序且唯一 |
| status | 是 | 从required source保守派生 |
| source_cases | 是 | 一项以上suite/case path/digest；passed时覆盖全部required sources |
| suite_reports | 是 | 对应report path/digest |
| design_refs | 是 | 03/04/05的具体契约/TC引用 |
| acceptance_refs | 条件 | 当前为空且mapping_status=pending_06；送验前由06映射 |
| redaction_status | 是 | passed/failed/not_run；非passed不能形成passed EV |
| integrity_status | 是 | passed/failed/not_run；校验路径/digest/run/status |
| generated_by | 是 | planned report script source/version |
| review_status | 是 | pending/reviewed/disputed；reviewed不等验收passed |

### 7.8 失败、blocked与复验归档

| 场景 | 必须保留 | 禁止 |
|---|---|---|
| assertion failed | case raw、suite report、redacted stdout/stderr、safe failure ref | 删除失败或同run重写passed |
| formal seam缺失 | context、blocked case/suite、具体WS-UP/LOCAL ref | 用fake结果填该EV passed |
| runner/bootstrap崩溃 | context、可得stdout/stderr、missing-output清单、infrastructure_failed suite | 手写case/report补齐 |
| redaction命中 | scanner raw、位置类别、失败状态 | 在诊断中复制命中的secret/body |
| report生成失败 | 已有raw、失败日志、缺失report列表 | 手写evidence-index消洞 |
| defect复验 | 原失败run不变 + 新run完整链 | 用新run覆盖旧目录或复用run_id |

### 7.9 人 / Agent审查补充

| 材料 | 审查重点 | 不得做 |
|---|---|---|
| handoff.md | 运行范围、source refs、P0 blocked与限制 | 写验收通过/readiness |
| veto-checklist.md | 每条否决是否有真实EV/raw或仍blocked | 默认勾全pass |
| risk-acceptance.md | 风险、影响、角色、触发/到期 | 代替真实签署或接受S缺陷 |
| open-issues.md | S/A、failed/blocked/not_run、缺report | 隐藏未执行项 |
| reviewer/agent notes | 抽检digest/路径/状态、争议 | 修改raw事实或生成缺失证据 |

### 7.10 禁止路径与引用

| 禁止项 | 正确口径 |
|---|---|
| `artifacts/test/<project>/<run_id>` | `artifacts/test/<run_id>` |
| `reports/<project>` | `reports/runs/<run_id>` |
| 正式引用 `latest` | 固定 `<run_id>` |
| 脚本放在reports目录 | `scripts/gates|checks|reports/*` |
| 跨run拼接passed EV | 单一run内required source完整 |
| 静态JSON/手表声明pass | 从真实case/suite raw与report派生 |
| raw secret/body/credential | 安全ref、类别和redacted摘要 |
| telemetry单独充当EV | response/局部record/断言raw共同证明 |

### 7.11 证据停审与跨证据真实性审计

| 审计项 | 设计结论 | 当前事实 |
|---|---|---|
| 59 TC是否各有唯一EV槽位 | pass；17族合计59，一对一 | 0个真实实例 |
| 每个EV是否有suite/raw/report路径 | pass；§7.3~7.7 | 路径均planned |
| 多suite冲突是否可被挑成功 | no；required source保守聚合 | 未执行 |
| failed/blocked/not_run是否保留 | pass | 未产生 |
| raw→report→EV能否静态伪造 | integrity check应阻断 | 脚本未实现 |
| redaction覆盖raw/report/acceptance | pass_as_design | scanner未实现 |
| AC引用是否伪造 | no；全部pending_06 | 06尚未创建 |
| retention数字是否发明 | no | policy pending |
| report是否形成verdict/signoff/readiness | no | 仅planned草案 |

## 8. 对详细设计 / 配置的影响判定

本步只设计测试基础设施输出，不增加生产DTO、业务key、状态、存储或配置。artifact schema exact版本、digest算法与runner writer由07实施计划承接；如其选择会影响可重算/防篡改目标，应回写05，不得弱化真实性要求。

## 9. 回填草稿

正式 §13 回填slot/instance规则、59 EV归档面、目录、最小字段、报告生成、失败归档、人/Agent审查与禁止项。必须在章节开头说明当前没有任何真实run/artifact/report/EV，并将AC引用保留为pending_06。

## 10. 待确认事项与进入下一步条件

- artifact schema exact版本、digest算法、CI writer、retention policy、06 AC/VETO ID均待后续闭合。
- 这些待确认不妨碍05固定真实性边界，但阻止声称脚本或证据ready。
- 59个P0用例都有planned归档方式，跨证据无unresolved设计冲突；Step13通过，允许进入Step14。
