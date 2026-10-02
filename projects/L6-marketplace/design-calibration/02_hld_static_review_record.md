# 02 静态文档检查记录

日期：2026-10-01；范围：正式02、02 flow、14主Step、35部分附录，共51个设计文件。此记录仅文档结构与来源核对，不是implementation run/report/evidence/verdict/signoff/readiness。

## 实际检查结果

| 检查 | 结果 |
|---|---|
| 正式章节 | 14章编号连续，标题符合现行规范 |
| 对象 | 43独立卡片，基本/字段/成员/工厂/禁止表齐全 |
| 接口/流程 | 21Commands、16Queries、12内部Jobs；49独立图，接口到flow一一对应 |
| 状态 | 14carrier，初始/终态/全pair矩阵、guard/trigger/保存与副作用，carrier都有对象卡 |
| 复杂Step产物 | Step5～9每Step U1～7共35附录，先思考后结构化/回填/自检 |
| 主Step | 14份固定十段完整，未来Step未提前创建 |
| 编号承接 | 16FR/21BR/17NFR/20AC/14IF/11DEP/5VETO，104来源编号已映射 |
| 本地链接 | 上述51文件86个Markdown本地链接存在 |
| 格式 | 上述文件968个表格列数一致，394个代码围栏闭合，无未定义插值或装配标记 |
| 范围内diff | git diff --check -- projects/L6-marketplace无错误 |
| 写入范围 | 仅正式02、02 calibration/项目台账；00/01/draft/原型/其他项目未由本轮修改 |

这些数量是本次检查所选51文件的实际输出，不将本记录本身/最终台账的后来导航链接计入原统计。

## 语义反查与已修复缺口

- SourceVerification Pending/Blocked允许缺正式sourcebinding，另存typed安全source_candidate；Qualified必须正式依据。
- Application Draft存safe draft_spec，正式basis/review在Submitted同UoW形成，不在草稿捏造qualified材料。
- Review/Notice补安全failure/dispatch回指；原结果完整持久化，typedget不能从currentprojection重构。
- 保存读取明确逐对象typed方法/byuniquekey；publisher Released立刻让currentgate失败，有限核验失效集合按正式关联处理，重复key仍只重放原结果。
- Domain写路径只核验该操作ownerguard；late receiver outcome不以withdrawn禁止记录，但禁止新的admission。
- 五展示类别只是Method/ProcessTemplate/RoleDefinition/Capability/MemberImage候选映射，不创造上游enum或源内容truth。
- 当前0activeevent producer/consumer/outbox，Billing/Archive active lane absent；signature/scan/ACK不approval。
- localaccepted+safeaudit+完整result+必要durable责任同UoW；originalintentunknown probe，无probe等待正式依据；通知失败不复活withdrawn。
- defaultEnglish/中英切换不变业务语义；原型9090不作为生产配置。

## 保留缺口与停审

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01与Hub/Images/Observability受影响consumer资格未关闭。正式owner/SDK positive合同不能通过上述结构检查替代。完整schema/签名/codec/配置/test/实施闭环只交后续03～07，当前不进入。

02完成后立即stop_review；等用户明确确认02再读取03详细设计SOP/规范及相关owner exact contracts。无实现、测试执行或commit。
