# Step 17. 正式需求文档装配

## 1. 状态与计划

`pass / stop_review`；SOP Step17、规范章节级§4.1～§4.16及评审清单已读。项目用户授权完成全部00；不授权01。正式写入已在此Step完成。

### 1.1 Step内计划

- [x] 读项目/flow/各Step门禁与能力停审。
- [x] 装配问题回答、旧口径诊断、结构取舍。
- [x] 三层装配许可同步、旧00替换、分批装配16章。
- [x] 引用/ID/表格/边界/跨章自检，发现问题回源修。
- [x] 台账00 completed/stop_review；01 waiting_user_confirmation，立即停止。

## 2. 输入

Step1～16最终pass记录与五能力附录；Step15风险/重开条件、Step16主矩阵与旁路审计。旧README及formal00 historical，01～06保持历史不改。draft讨论非formal authority。

## 3. 装配问题回答

1. 可装配什么？已有来源/边界/问题/目标/角色/依赖/五能力/11US/16FR/21BR/数据四类/14IF/11DEP/17NFR/20AC/5VETO/风险/矩阵。
2. 哪些不能确定化？8UP/13SRC、验证/批准/receiver/通知/审计合同、29110适用/包owner、Billing、stack、容量。
3. 写入是否产生新结论？仅摘录已确认小循环，若发现遗漏回对应Step，不现场造schema或authority。
4. 什么表示完成？需求审查与正式重写完成；不等运行ready、owner合同通过、risk acceptance、用户签核或进入01。

## 4. 旧文档诊断

旧00§1用README派生功能、§3/§6包/认证/支付/安装越权、§7无依据100%、缺16章来源与矩阵，不能作为当前正式基线。旧头下游“04实施计划”不合00→07顺序，重建后改成05测试/06验收/07实施依次。

## 5. 对比

| 项 | 改前 | 改后 | 理由 |
|---|---|---|---|
| 正式来源 | 旧README/愿景直接生成 | 17Step及五能力停审来源 | full-restart |
| 结构 | 旧混合章节 | 书写规范章节级16章 | §1/2、§6、§7责任分别存在 |
| 状态 | Draft可误读可实现 | calibration-complete/stop_review，集成门禁保留 | 不伪ready |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 16章逐来源装配、正文结论与校准过程分离 | 可读可追溯 | 文件较长 | 采用 |
| 沿SOP末尾旧14章建议合并边界/依赖 | 短 | 章节级规范已独立16主题 | 不采用，以具体§4规范为准 |
| 在旧00上局部修字 | 少diff | 旧职责/指标残留 | 不采用，全量替换 |

## 7. 结构化装配清单 / 写入前检查

§1～§16分别对应同编号Step；§8～§14额外链接五能力附录，编号保持原样。§6三裁剪表/ASCII/path判定从Step6；§11唯一类别从Step11；§15风险/待确认两表；§16FR主矩阵+漏项表。

写入类型：正式正文重建。目标：`projects/L6-marketplace/00-需求文档.md`。项目门禁：pass，用户只授权00。flow门禁：Step17；Step1～16均done。Step/能力门禁：五能力与16Step最终pass，草稿可回填；思考done。正式正文污染：no，只结论/正式风险不放诊断/取舍。分批完整性：各章内容不因单批长度删掉失败语义；末批完成才算formal_complete。上游正向blocker不是未完成能力需求讨论，显式进入§15，不能伪装ready。

## 8. 回填草稿

按上述章节逐批装配已停审正文，正文只结论；链接可查中间产物与具体结构化/草稿/pending。首批§1～7，后续§8～16，不进入01。

## 9. 待确认

Step15全部保持；实施ledger与boundary skeleton仅到07创建，目前禁止提前创建。不会生成实现仓、asset、digest、扫描/签名、付款结果、evidence、verdict、signoff。

## 10. 完成条件

当前pending：正式16章、链接/ID/边界自检、台账终态同步；完成后stop_review，需用户明确确认才允许01 SOP/规范阅读与执行。

## 装配后自检与最终停审

2026-10-01 完成三批正式00装配：§1～7、§8～12、§13～16。静态读取检查：16章编号连续，每章有具体校准来源，24个本地来源链接存在；正式11US/16FR/21BR/14IF/11DEP/17NFR/20AC/5VETO数量及表格列数一致，五附录都有stop_review；`git diff --check -- projects/L6-marketplace`通过。该检查只是文档结构，不是实现测试、owner集成或真实evidence。

人工边界复核：source/market/receiver/notice/audit独立；Gov public summary不足不推approval；Identity不当publisher认证；文件/原型/scan/signature/ACK不代替正式资格；Billing/可执行包/归档恢复未qualified维持future/blocker；五类标签不冒充owner enum；scope/duplicate/unknown/withdrawal race/安全审计与恢复有AC和VETO。读取记录未宣称九owner所有00～07全文已读。

本轮修改仅市场正式00、calibration及本ledger/flow；外部工作树变化保留，未改其他项目、draft/原型、实现代码或commit。未生成asset/digest/scans/payment/evidence/verdict/signoff/readiness。

Step内计划全部done（对应上述装配与自检）；最终`gate_status=pass / stop_review`，formal_00=completed/stop_review，01=waiting_user_confirmation。三层台账终态已同步，不再启动下一文档。上游blocker保持Step15状态；用户确认不等于自动解除owner contract。

最终一致性复核：22份Step/能力文件（17主Step+5能力附录）均有最终pass/stop_review；Step2～17及五附录固定十段顺序和完成计划已归一，Step1早期调查保留为历史且顶部指向最终来源自检。正式链接、项目/flow终态再次核验无异常；范围内diff空白检查通过。git状态中draft目录为此前既有未跟踪材料，本轮没有修改；其他项目已有变化未触碰。无实现测试或commit。
