# Step 3：固定验收基线

## 1. Step 状态

SOP Step3/规范5.3；正式§3；status=completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=基线/路径/失效自检完成；next_allowed_action=Step4准入退出。

### 1.1 Step 内计划

| 小阶段 | 状态 | 产物 |
|---|---|---|
| 输入/前序结论 | done | §2 |
| SOP问题 | done | §3十问 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 结构化 | done | §7基线/路径/失效 |
| 复杂度 | done | 主控内表，不新增机器schema |
| 草稿 | done | §8 |
| 自检/下一步 | done | §10 |

## 2. 本步输入

source_files：[Step2](06_acceptance_step_02_scope.md)问题/诊断/取舍/待确认；03库存与§17、04§5～11、05§6/7/8/9/13、05Step13 schema/semantic rules。送验build/commit/image、run与账号/资源没有实际提供，不能编值。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪版需求设计？ | 未来run记录当前00～04/06及规范性附录exact bytes来源，不用“最新”。 |
| 哪版测试/结果？ | 确认05/registry/subcase manifest/fixture/generator baseline和actual同run raw/report。 |
| build/commit/image？ | actual实现仓/不可变commit及build标识由未来交付提供；无image则明确not_applicable，不造digest。 |
| 环境配置数据依赖？ | test/qualified staging、strict JSON validated snapshot、七字段/八slot、13DS/seed/隔离、Core/SDK/PG等actual版本。 |
| 变更怎么处理？ | 受影响EV不适用新基线，新run/full回归；未变原失败保留，不能拼旧通过。 |
| run_id是什么？ | 当前未分配；未来harness显式给出合法finite标识，不把日期当run。 |
| artifact在哪？ | artifacts/test/<run_id>/；全RecordRef同run，无project重复层。 |
| report在哪？ | reports/runs/<run_id>/；JSON/MD配对与EV回raw。 |
| handoff在哪？ | reports/acceptance/三个固定人工导航入口→explicit run/review详情，规则见§7。 |
| 禁止路径？ | latest/跨run/逃逸/symlink/覆写completed run/项目重复层全部拒绝。 |

## 4. 当前文档问题诊断

旧06§2只写当前批次，无immutable交付、run/DS/工具来源。05机器draft只能pending，不承担审查结论；其risk-notes不等risk acceptance。06固定入口若按“最新”覆写会破坏追溯，必须保留显式审查记录。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 当前文档批次 | actual baseline+exact bytes refs | 设计dirty状态不能冒commit |
| draft/notes充当签核 | 机器draft与人工审查分层 | 05不产verdict |
| 固定入口指最新 | append-only显式run/review注册 | 不隐藏历史，不跨run采证 |

## 6. 设计取舍

采用三个固定Markdown入口作为append-only人工导航，每个review有不可变详情；机器RecordRef/DAG完全沿05。未采用新增acceptance JSON/自动verdict脚本：无必要且会另造schema/writer/authority。未采用固定文件覆写到最近run：与无latest、失败留存冲突。

## 7. 结构化中间产物

### 7.1 基线必填语义（本轮无实际值）

| 基线类型 | 内容/标识 | 复核/缺失后果 |
|---|---|---|
| 需求/设计 | 00～04、06及引用的全部规范性附录exact bytes来源 | 与确认版本一致；dirty文档可用bytes摘要固定，不能伪称已commit |
| 测试 | 05/registry/required-subcase manifest/13DS/fixtures | 98唯一TC-EV、11主suite、13CUT/DS；缺库存阻送验 |
| 实现/交付 | actual repo、immutable commit/tree、build和依赖lock；image适用时actual ref | planned215文件不能充实现baseline；当前未提供 |
| 环境 | profile/OS/toolchain/PG与extensions/多连接/browser/运行资源 | PG项actual PG；local与formal能力标明，不fake替代必要层 |
| 配置 | schema_version/profile、validated snapshot来源、六域七字段八slot及构建Webbase | 只safe refs/实际姿态，不存secret/locator，不配资格 |
| 数据 | DS/seed/builder版本、fixture隔离、故障窗口、required子例 | 无prod正文/secret；清理不能删除失败证据 |
| 上游依赖 | Core/SDK版本与exact owner type/operation/schema/consumer/scope资格 | selected positive须实际证明；其余blocked/future显式排除 |
| 执行 | explicit run_id、全部execution_id及主执行选择 | 主执行在执行前固定；首次失败不可择优覆盖 |
| artifacts | artifacts/test/<run_id>/全部schema记录 | 重算hash/schema/redaction/coverage；不能跨run |
| reports | reports/runs/<run_id>/summary、gate-results、redaction-check、EV index与配对JSON/MD | 可回raw/六两stage checks；缺报告阻交接 |
| 人工审查 | review_id、冻结scope/baseline、三入口中的exact注册行与详情raw-byte引用 | 不作为05 RecordRef，不改变机器结果；缺失不可宣称交接完整 |

### 7.2 固定入口与不可变详情

以下全是未来设计路径，不创建报告。review_id由未来正式审查协调人显式分配，沿run_id同一finite路径语法；禁止latest/点目录/逃逸，同(run_id,review_id)不得复用或覆盖。

| 固定入口（人工导航） | 每review不可变详情 | 绑定/作用 |
|---|---|---|
| reports/acceptance/handoff.md | reports/acceptance/<run_id>-<review_id>-handoff.md | 注册scope/baseline/机器draft/summary/index/六seal checks、open issues、三值结论与签署说明 |
| reports/acceptance/veto-checklist.md | reports/acceptance/<run_id>-<review_id>-veto-checklist.md | 五VETO逐行TC/EV/report/实际finding/影响；不是05工具的同run预填表 |
| reports/acceptance/risk-acceptance.md | reports/acceptance/<run_id>-<review_id>-risk-acceptance.md | 每残余七字段、真实authority/期限/证据；无接受也须明确未接受/无eligible残余 |

入口由审查协调人**append-only**登记exact run_id/review_id/scope、详情路径和实际raw-byte摘要；不设current/latest、不覆盖旧行，不自动选择任何review。读者必须指定run_id/review_id，校对三个入口的同一组合与不可变详情；多review导航不是跨run证据合并。修正详情→新review_id并显式supersedes旧review，保留原记录；测试基线/实现/配置/TC变化还须新run。

MD人工记录不增加05机器kind/RecordRef/脚本，不让机器index反指人工文件或形成hash环。05生成的<run_id>-draft.json/md、veto-checklist/open-issues/risk-notes继续作为pending工具输出；不能覆盖人工detail，也不能冒签署/风险接受。详情须回指同run完整报告，签署不写进05 acceptance-draft enum。未来MD实际hash按exact bytes，本文不提供hash值。

### 7.3 锁定库存与失效

104需求（16FR/21BR/17NFR/20AC/14IF/11DEP/5VETO）、七U/43对象、17ports/146methods、21C/16Q/12J/0active Event、14carrier/222pair（73A/51S/98R）、33canonical写DTO、七PageReadContext、18ErrorCode；六配置域/七字段/八slot/四profile；98TC↔98EV、11suite、13DS/13CUT、22planned脚本、11artifact kind/48defs是设计库存。

run前registry必须展开完整字符串/required subcase，不用计数代替逐项身份。文档、实现、owner contract、configuration、fixture、generator/schema或scope改变，受影响EV不再适用于新baseline；共享契约变化执行全98/full required新run，不将旧EV拼入final index。已失败/blocked run保留历史，不能重写为pass。

## 8. 回填草稿

正式§3候选：按§7固定未来送验的设计/实现/测试/环境/数据/配置/owner/execution基线，当前运行值未提供。三个固定人工入口只登记exact run/review不可变详情，机器证据继续05同runDAG；缺handoff或资格不能宣称送验完整。基线变化要求fresh复验与显式supersession，不引用latest。

## 9. 待确认事项

actual实现/build/run/profile/资格/人名均未提供；未来审查协调人须显式分配review_id，当前不分配或造报告。十二上游项仍保留。

## 10. 进入下一步条件

自检：十问逐答、十一类基线、三个固定入口、03/04/05库存及失效均闭口；未新增机器schema/脚本/真实run/hash。Step3设计停审pass。下一读SOP Step4/规范5.4、05§11/12，定义可送验/可结束与可放行区别；无commit。
