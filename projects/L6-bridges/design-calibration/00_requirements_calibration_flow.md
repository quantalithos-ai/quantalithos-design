# L6-bridges 00 需求文档全量重启校准流程

> 创建日期：2026-10-02
> 模式：`full-restart / single-agent-serial`
> 正式目标：`00-需求文档.md`
> 项目台账：`project_execution_ledger.md`
> 授权：全部00已完成停审；用户随后明确要求全部01，允许文档切换。
> 当前状态：`confirmed_for_01_input`；Step1~17已完成，00正文写权限继续关闭。

## 1. 文档级恢复点

| 当前Step | 当前模块 | 模块骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| 17 | confirmed_for_01_input | done | done | done | done | pass | 用户明确授权01，解除切换等待；00无新增写入许可或验收签署 | restore_01_flow_and_current_step |

source_files：本项目台账、需求SOP/书写规范、专项上游正式文档及必要台账。blocker索引：项目台账§5；精确对接缺口由当前Step记录，Step15汇总。

## 2. 总流程计划

| Step | 名称 | 必读输入 / 前序 | 输出文件 | 状态 | 完成门禁 / 下一步许可 |
|---:|---|---|---|---|---|
| 1 | 上游关系 | 标准、上游正式来源、授权draft | `00_req_step_01_upstream_relation.md` | done / pass | 来源主题可定位、历史后置；已允许2 |
| 2 | 定位边界 | 1、相邻owner正式边界 | `00_req_step_02_position_boundary.md` | done / pass | 固定边界表自检通过；已允许3 |
| 3 | 背景问题 | 2、产品/平台背景 | `00_req_step_03_problem_context.md` | done / pass | 无虚构量化；已允许4 |
| 4 | 目标非目标 | 2/3 | `00_req_step_04_goals_non_goals.md` | done / pass | 可验证范围两表通过；已允许5 |
| 5 | 用户角色 | 2/4、平台官方公开资料 | `00_req_step_05_users_roles.md` | done / pass | 角色与来源附录通过；已允许6 |
| 6 | 使用方依赖 | 2/5、全局规则§2/4.1/5/6 | `00_req_step_06_consumers_dependencies.md` | done / pass | 三表与依赖图通过；已允许7 |
| 7 | 核心能力 | 2/4/6 | `00_req_step_07_core_capability_loop.md` | done / pass | 五卡与跨节点审计通过；已允许8 |
| 8 | 用户故事 | 5/7 | `00_req_step_08_user_stories.md` | done / pass | 十一故事无孤儿；已允许9 |
| 9 | 功能需求 | 7/8 | `00_req_step_09_functional_requirements.md` | done / pass | 十六FR及平台/阶段语义通过；已允许10 |
| 10 | 规则边界 | 2/7/9 | `00_req_step_10_business_rules_boundaries.md` | done / pass | 二十四规则无孤儿；已允许11 |
| 11 | 数据归属 | 2/9/10 | `00_req_step_11_data_ownership.md` | done / pass | 二十项四类型与生命周期通过；已允许12 |
| 12 | 接口依赖 | 6/9/11 | `00_req_step_12_interfaces_dependencies.md` | done / pass | 十一接口/十依赖自检通过；已允许13 |
| 13 | 非功能 | 7/10/11/12 | `00_req_step_13_non_functional_requirements.md` | done / pass | 六类16项质量、五节点/全局自检通过；已允许14 |
| 14 | 验收 | 7/9/10/11/12/13 | `00_req_step_14_acceptance_criteria.md` | done / pass | 38AC/6VETO及五能力停审、跨能力自检通过；已允许15 |
| 15 | 风险疑问 | 前序未闭合项、上游台账 | `00_req_step_15_risks_open_questions.md` | done / pass | 九风险/十BR-UP、释放依据及继承状态自检通过；已允许16 |
| 16 | 追溯矩阵 | 7~15、能力停审 | `00_req_step_16_traceability_matrix.md` | done / pass | 六列FR主矩阵与跨能力审计通过，无孤儿/新项；已允许17计划 |
| 17 | 正式装配 | 1~16全部产物 | `00_req_step_17_formal_document_assembly.md` | done / confirmed_for_01_input | 16章审计完成并停审；后续用户明确授权01，仅允许切换 |

总计划不是未来文件占位许可。到达一个Step，先恢复台账，再只创建该Step，模块先思考后写入；完成一项即更新本flow和台账，不批量报done。

## 3. 输入分层与事实纪律

| 输入 | 用法 |
|---|---|
| 标准与需求SOP/书写规范 | 流程、16章成文形式、三层门禁、依赖类型 |
| L0-sdk及六个专项上游 | 只承接当前正式设计合同；设计、停审、实现、运行证据分开 |
| 本项目draft 01~03 | 用户认可讨论方向，按本Step重核，不直接复制对象/状态/port |
| 本项目旧README和正式文档 | historical_material，当前独立结论形成后差异扫描 |
| 平台官方公开文档 | 核验平台事实与限制，不代表账号/权限/SDK/provider已建立 |
| L5-chat | parallel reference_only，未停审内容不作正式输入 |

需求层具体表达平台对象、mapping维度、in/out语义、阶段结果、幂等namespace、cursor可比性、限流/恢复约束、secret引用、测试/证据边界；最终字段、协议、函数、状态机和配置schema在正式02/03/04收口。没有正向contract就保留blocked，不以“后续补”代替当前失败语义。

## 4. 能力小循环规则

Step7先按能力节点形成故事目标、可见功能主题、保护规则、数据/接口边界、质量和否决的语义卡；当前节点设计审查后才进入下一节点。Step8~14按相同节点顺序逐一编号和专题校准，不改变1~17文件创建顺序。此处“审查通过”只表示当前agent的设计自检，不冒称用户或外部owner签署；正式00另须用户停审。

## 5. 当前文档门禁

```text
formal_00_assembly_allowed = false
current_step = 17
current_module = confirmed_for_01_input
document_status = confirmed_for_01_input
gate_status = pass
gate_reason = explicit_user_authorization_to_complete_01_after_00_stop_review
next_allowed_action = restore_01_flow_and_current_step
design_self_review = pass
user_confirmation = explicit_continue_to_01
acceptance_verdict = not_evaluated
next_formal_document = 01-架构设计.md
next_formal_document_allowed = true_for_01_calibration_only
future_step_files_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 6. 执行记录

- 2026-10-02：中断恢复检查确认calibration尚不存在；创建本flow与项目台账，不创建未来Step文件，不修改旧00或其他项目。
- 2026-10-02：Step1来源映射及上游状态冲突自检通过；进入Step2，正式00仍未修改。
- 2026-10-02：Step2两批完成仓级定位与边界自检；Step1补做批次纪律复核；进入Step3。
- 2026-10-02：Step3背景、三项问题和分类两批完成；进入Step4。
- 2026-10-02：Step4目标/非目标两批完成；进入Step5与四平台公开资料核验。
- 2026-10-02：Step5角色、权限与四平台来源附录完成；Telegram网页仍unavailable，其余来源按读取范围登记；进入Step6。
- 2026-10-02：Step6依赖五表、裁剪ASCII与SDK/OAuth/API key/KMS/路由seam复核完成；进入Step7逐节点校准。
- 2026-10-02：Step7五张能力语义卡串行完成及逐卡自检停审，跨节点审计通过；进入Step8；没有用户/owner签署或运行证据。
- 2026-10-02：Step8按五卡顺序编号十一故事、逐组及跨组自检完成；进入Step9。
- 2026-10-02：Step9十六FR、行为语义、平台差异与阶段guard完成；进入Step10，未定contract不伪装已实现。
- 2026-10-02：Step10二十四规则按五节点与六类型收口、自检完成；进入Step11。
- 2026-10-02：Step11二十数据项、四类型与引用失效边界完成；进入Step12。
- 2026-10-02：Step12十一能力接口/十依赖及交互姿态完成；进入Step13。
- 2026-10-02：恢复至Step13，先读三层台账与规范、前序五卡；建立当前Step骨架并完成C1思考。当前gate使用规范值pass/blocked，in_progress仅用于工作状态；此前头部gate=in_progress不继续沿用。
- 2026-10-02：Step13按五节点及全局逐组思考/结构化/自检，16项质量与六类适用性通过；旧SLA/覆盖率不承接为当前运行事实。进入Step14。
- 2026-10-02：Step14逐节点完成38AC五类别、六VETO及能力级设计停审；跨能力审计与只读编号检查通过，不代表项目测试/owner签署。进入Step15复核上游未闭合项。
- 2026-10-02：Step15九风险、十既有BR-UP与正式释放依据完成；复核Workspace开放项、Observability十二原affected状态及Identity/Artifact实施报告资格，未关闭/回写上游。进入Step16。
- 2026-10-02：Step16六列FR矩阵、NFR/IF/DEP补充及五能力跨审计完成，集合检查无漏项/未知ID；旧矩阵不承接。进入Step17计划，正式00尚未改写。
- 2026-10-02：Step17 preflight发现Step8/10~12问题回答合并，逐一回源展开/定位历史材料并复核，既有编号/结论不变；三层装配门禁pass，只允许删除旧00并从骨架分批回填。
- 2026-10-02：Step17 B6完成正式§13/14；16NFR、38AC、6VETO精确匹配来源，表结构及diff whitespace静态检查通过，非项目测试。同步恢复点至B7，先读Step15/16再装配；无上游状态关闭或提交。
- 2026-10-02：Step17 B7完成正式§15/16；9R/10BR-UP、主/补矩阵32行与允许来源精确匹配，字典回源补齐已有简写；状态抽查未发现需改上游姿态。转B8全文审计；正式01、实现、测试和提交仍未授权。
- 2026-10-02：Step17 B8完成全文审计；补齐§16已有Step14来源、恢复§6.3五个主链值的明确是/否。16章/16来源区、33有效路径、51表/2图、全部编号/映射、17主Step结构及12继承状态静态复核通过；设计语义无装配新增结论。00立即formal_stop_review，关闭正式写入并等待用户确认01；上游仍open/reference_only，无项目测试、真实证据或提交。
- 2026-10-02：用户明确要求“现在完成全部的 01”；00作为01正式输入，保留Step17当时停审记录，仅解除文档切换等待，不改00正文，不关闭BR-UP或产生验收/owner签署。
