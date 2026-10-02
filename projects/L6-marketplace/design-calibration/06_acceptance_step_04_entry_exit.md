# Step 4：定义验收进入与退出条件

## 1. Step 状态

SOP Step4/规范5.4；回填§4；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=三门禁与未送验状态自检完成；next_allowed_action=Step5功能项。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取输入 | done | §2 |
| 问题回答 | done | §3 |
| 材料诊断 | done | §4 |
| 取舍 | done | §6 |
| 结构化 | done | §7 |
| 复杂度 | done | checklist留主控 |
| 回填草稿 | done | §8 |
| 自检/下一步 | done | §10 |

## 2. 本步输入

source_files：[Step3](06_acceptance_step_03_baseline.md)基线/入口/失效及待确认；05§11/12退出、缺陷复验、00五VETO。当前没有实际送验材料，所有checklist必须未勾选。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始前什么基线确认？ | explicit scope/run/review、设计/实现/测试/配置/DS/依赖；formal selected另有真实owner/auth/data资格。 |
| 哪些证据先生成？ | full98主TC/required raw、11suite/六artifact及seal checks、run JSON/MD、final98EV/index、机器draft和人工handoff说明。 |
| 什么缺陷阻进入？ | S/污染证据/不明baseline阻合格送验；P0失败可作为失败材料交审但绝不成为通过候选。 |
| 退出要什么结论？ | 每门禁、五VETO、缺陷/风险有actual裁决且正式authority签署；“不通过”也是可结束审查，不是可放行。 |
| 哪些风险先接受？ | 只有证据证明无P0影响的真实非P0残余；接受人/动作/责任/截止齐备，VETO/资格/证据缺口不可接受。 |

## 4. 当前文档问题诊断

旧06§3用样本主线退出且遗漏raw/integrity/current disclosure；05退出为送验准备不是06裁决。必须区分审阅失败/未具备准入、结束审查、授予通过，避免没有证据就写实际“不通过”。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 样本成功即可退出 | 全98/库存/证据/签署 | 不遗漏P0参数化 |
| 未准备等不通过 | 未送验/未裁决不赋三值 | 不伪造执行结论 |
| 审查结束等放行 | 不通过可结案，下一阶段仍拒绝 | 分离过程和授予许可 |

## 6. 设计取舍

采用严格通过候选准入，同时允许真实失败材料进行failure review并明确材料缺口。未采用缺证据按“有条件通过”：会将不可判定资格/P0包装成已接受残余。所有勾选只能来自未来实际材料，设计自检不勾运行表。

## 7. 结构化中间产物

### 7.1 合格送验进入条件（当前全部未满足/未勾选）

- [ ] scope/exclusions/run/review与当前00～06/规范性附录baseline已正式固定。
- [ ] actual实现仓/commit/build/依赖lock和环境可查，非planned路径或原型。
- [ ] 98TC/98EV/11suite及全部库存required subcase实际执行，不择优挑passed。
- [ ] actual PG/多连接、API/Worker/browser、13DS/故障窗口与validated配置可复现。
- [ ] 六checks在artifact及seal两stage有效，raw/report/JSON/MD/schema/hash/redaction/coverage配对完整。
- [ ] final EV/index及机器draft生成，人工handoff/五VETO/风险记录通过exact三入口登记。
- [ ] 无S、P0阻断A/VETO finding或污染材料；expected安全拒绝不算产品缺陷。
- [ ] formal-selected全部exact资格/data授权成立；local明确缺口/不外推正式positive。
- [ ] 非P0残余如申请条件通过，真实接受authority/责任/动作/截止完整。

发现实际失败可提交failure review材料，必须标failed/blocked/gap，不能声称合格通过候选。没有run的本轮状态是未送验/未裁决，而不是已经“不通过”。

### 7.2 结束审查条件（不等放行）

- [ ] 本scope每20AC及专项子门禁有实际证据裁决；缺证据项不授予pass。
- [ ] 五VETO逐项实际核查，trigger即总体不通过，未核查不能写未触发。
- [ ] S/A/B、首次失败/fresh复验/失效EV、开放项状态与责任明确。
- [ ] 三值总体结论、功能/非功能/发布准备/下一阶段许可均有对应依据。
- [ ] 真实审查authority、角色、日期和可核验签署记录完整，详情不可变。

### 7.3 通过授予条件

本scope全部P0满足、VETO无触发且证据完整、无阻断缺陷；全部残余关闭→通过，只有合法已接受非P0残余→有条件通过。缺P0/positive资格/证据、S/VETO或未接受残余禁止授予通过；实际送验后由§14正式裁决不通过。生产发布另需运维/安全/产品authority与部署证据，本06 local结论不自动授权。

## 8. 回填草稿

正式§4候选采用§7三门禁，全部checklist保持未勾选。送验准备、实际审查结案与放行分别判定；失败材料可审阅但不能成通过候选。缺运行材料保持未送验/未裁决，文档完成不赋verdict。

## 9. 待确认事项

实际baseline/run/handoff/资格与审查authority未提供，当前仅design。上游十二项仍开放。

## 10. 进入下一步条件

自检：五问、九准入、五结束及通过授予条件明确；无已勾运行事实，无风险替代P0。独立停审pass。下一读SOP Step5/规范5.5、03七U/05Step5/6，逐16业务AC小循环并分配4全局AC；不提交。
