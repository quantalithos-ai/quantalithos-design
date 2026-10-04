# L6-bridges 05 Step11：缺陷复验

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| defects_retest | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step12_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已读Step6/9/10全部case/suite/非功能与六VETO，复核SOP Step11五问题/书写§5.11。当前无真实缺陷实例或run，不创建issue/signoff/report；只定义后续safe流程。

## 3. SOP问题回答

1. S级VETO/泄露/越权/truth破坏/重复效果/阶段或证据伪造立即阻受影响运行/归档/验收，不能降级。
2. 仅不涉及P0/VETO的非关键兼容/文案/P1风险可由正式责任人按06批准材料决定，当前不授接受。
3. 修复沿changedcontract→cut→全部TC+横切STATE/LOCAL/PRIVATE/EVIDENCE及actual所需REAL回归，不只失败case。
4. 必有原failed/blocked固定run安全索引、修复实际source/manifest、独立复验run/TC实例、check/report/digest/资格baseline与人工复核；无真材料不关闭。
5. 漏保护性断言/参数必须先校准source/TC/expectedmanifest再加入自动化，不能靠调宽断言或skip漏实例。

## 4. 当前材料问题诊断

测试失败、环境blocked和upstreamnotestablished必须分责，不能把blocked改普通bug后跑fake关闭。缺陷描述自身也是禁材出口，不能保存SDKrawerror/ref/secret/私有callback/敏感审批。

## 5. 改动前后对比

| 常见风险 | 规则 |
|---|---|
| flaky重跑后忘原失败 | 保旧run，新run复验，不删或覆盖 |
| 稳定性缺陷只看exit | wholeTC/params与原phase/资格/digest完整复核 |
| 没证据直接closed | fixedrun真实实例+safeartifacts/check/report+ownerreview才closed |
| issue泄露业务body/secret | finite safe模板，不放原对象/rawerror或业务ref |

## 6. 测试设计取舍与复杂度

缺陷等级、有限状态与复验链三小节，无新业务状态机/API。明确test-management记录归harness/报告流程，不形成BridgesDomaintruth。约85行。

## 7. 结构化中间产物

### 7.1 缺陷等级与阻断

| 等级 | 定义/示例 | 处理要求 | 阻断 |
|---|---|---|---|
| S | 任一VETO、越权/敏感泄露/ownertruth越界、duplicateeffects、unknown错误NoEffect、Query写入、假run/EV/pass | 立即阻受影响IO/证据/验收；保安全原责任，按正式incident/owner机制，不输出敏感材料 | 必阻，不能风险接受或降级 |
| A | 已承诺P0协议/guard/wholeCAS/config/entry不成立，缺parameter/requiredartifact/actual资格被绕过 | 修复+全切口/横切回归及真实资格复核 | 必阻local或actual对应退出 |
| B | 不涉及P0/VETO的批准P1兼容扩展失败 | 明确影响cut/平台/版本，06责任人决定是否接受；无批准仍未关闭 | 默认阻受影响范围；不能替代P0 |
| C | 不影响安全、协议、P0断言的非关键报告排版/展示问题 | 修复复验或具名后续处理 | 仍需安全/真实关联，不能掩盖失败 |
| qualification_blocker | actualprovider/account/manifest/pin/producer/owner接口/WS/affected未建立 | 记blocker与影响case/AC，等待原owner/实际资格，不fake修复 | 阻对应real出口，非“passed with warning” |

级别S/A不允许按通过率、环境不稳、管理员授权或“临时上线”接受。缺陷severity与suite status不同，不能把Blocked/Unavailable换成nonblockingB。

### 7.2 Safe缺陷材料与状态

test-management disposition只open/triaged/fix_planned/retest_required/closed_deferred/closed_verified；不是业务Domainstate或验收verdict。closed_deferred仅B/C有正式风险接受且未覆盖范围仍标blocked/not_evaluated；closed_verified须以下复验真实材料。

安全记录只deviation_id（测试工具ID）、severity、cut_refs/tc_refs/parameter tokens、固定old_run/new_run、safeassertion/failure分类、受影响env/mode/platform有限labels、schema/build/approvedbaseline refs与digest、责任role、处置/复核材料路径。不得写业务subject/op外部ID/namespace/ref/URL/config值、原消息/附件/凭证/审批、rawstack/error/canary或其派生。runtime原unknown责任通过正式owner私有查询渠道，safe缺陷页不复制。

本05仅计划schema/规则，无缺陷实例、修复commit或关闭记录；真实source_revision只实际实现后取得，不假填。

### 7.3 复验与防回归链

```text
[actual failed/blocked safe run]
        -> [source-contract diagnosis + affected cuts]
        -> [approved source/TC/expected-manifest repair]
        -> [new actual run, preserved original business identities if unresolved]
        -> [affected full cut + shared STATE/LOCAL/PRIVATE/EVIDENCE + needed REAL]
        -> [context/evidence checks + validated report]
        -> [human responsible review; closed_verified only with actual evidence]
```

关键说明：旧失败run/report保留，不覆盖、删参数、改断言成宽松结果、fake替actual或自动全suite重试。业务original/key/effect/window/used不因newtest_run变化；actual未知副作用先按原权威readonlyprobe/manual责任恢复，未证明不能创建替effects。

回归至少所有失败cut TC及其参与targets、对应protocol/state pairs/configCF-F/四平台差异、横切secret/private/reportchecks。无完整real资格时可以局部synthetic复验，但不能关闭actual缺陷或受影响AC。后续新增TC编号/参数manifest需具名03/05反校准和06/07影响审查，不实现者临时造测试接口。

## 8. 回填草稿

正文§11取等级/safe材料/复验链，无真实issue或缺陷关闭实例。审批责任由06/owner，工具不能自动接受S/A。

## 9. 待确认事项

所有real资格blocker保持原状态；当前116TC planned。下一Step把进入/退出分design/local/real/report/handoff可判定，不在本轮实际执行。

## 10. 自检与进入下一步条件

实际自检：S/A不可接受、qualification单列、safe缺陷模板与固定run复验链审查；无issue实例/假修复关闭，newrun不改原businessidentity。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step12_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
