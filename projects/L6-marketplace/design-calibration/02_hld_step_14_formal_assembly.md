# 02 Step 14：参考

## 1. Step状态

开工：用户已确认01并授权全部02；Step 14 completed，正式02已分批装配并静态检查，当前stop_review。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_13_risks_open_questions.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些已确认结论应分别回填到哪些正式章节？

答：Step1～13分别回填正式§1～13；本Step参考回填§14。Step6/8/9保留独立对象/流程/状态，不用索引代替。

2. 哪些结论需要拆分吸收到多个章节，而不是机械复制？

答：Step4主体与Step5职责不机械重复；§6对象卡与§9状态矩阵分层；§7接口骨架与§8独立流分别保留；§10错误轮廓与§13外部风险不混。

3. 哪些术语、编号或交叉引用需要统一？

答：统一U1～7/43objects/21commands/16queries/12jobs/49flows/14statecarriers，所有名由已pass产物；localkey/meta与ownerdigest语义分开。

4. 哪些内容仍应继续保留为设计风险或待确认，而不能润色成定论？

答：全部MP-UP001～008、SRC003/010/013、QMP01与pathqualifiedpending保留，no ownerapproval/integrationready。

5. 哪些细节仍应留给详细设计，而不应在整理阶段被补进来？

答：不装配完整schema/DDL/Rust签名/配置值、runtime结果/真实asset/evidence/commit；03未获授权，不在装配新增库/接口。

6. 当前概要设计实际依赖了哪些参考材料，每份材料用途是什么？

答：当前00/01、九owner受影响formal02与necessaryledger/CoreGovformal03线索、全局Rust/Vue/SDK与SOP/规范为参考；旧02仅后置historicalaudit不是设计来源。

## 4. 当前文档问题诊断

独立推导完成后完整读取658行historical02：旧§1/6将市场自带package/install/subscription/transaction/rating运营五部，旧§5.4自给99.9%/§6.4P95<200ms，旧§7只概念交互没有typed接口/状态矩阵。与当前00/01不符，不能局部修补继承；先删除旧稿再14章骨架分批装配。

## 5. 改动前后对比

| 项 | 历史02 | 新独立结论 | 原因 |
|---|---|---|---|
| 主体/范围 | 五部交易/安装/运营、自造package主体 | 七市场局部U，无财务/安装truth | 当前00/01唯一基线 |
| 结构 | 新人说明与概念交互 | 14章代码骨架/typed入口/独立流/全状态矩阵 | 当前书写规范 |
| 性能 | 99.9%、P95<200ms无来源 | Q-MP-01挂起，有界结构待实测 | 不造数值 |
| 治理/恢复 | 缺formal批准binding与unknown闭环 | 固定basis/正式决定/local原子/原结果/probe | 不造approval或副作用成功 |

## 6. 设计取舍

严格采用已passStep结论装配，历史仅污染检查；删除旧02不保留旧正式结构。选择§6/8/9按U分批写入，不一次性生成正式全稿再补calibration。完成实际静态检查才把Step14/flow/ledger标completed，立即停审。

## 7. 结构化中间产物

| 参考材料 | 用途 |
|---|---|
| [当前需求](../00-需求文档.md) | §9～14 FR/BR/数据/IF/DEP/NFR/AC/VETO，§15合同缺口；正式直接基线 |
| [当前架构](../01-架构设计.md) | §6～13 U/承载/依赖/一致性/技术/横切，§16/17追溯/ADR |
| [Core详细设计](../../L0-core/03-详细设计.md) | §5/7 shared actor/metadata正式来源；exact导出/codec/metadata消费由03核验，不创造共享类型 |
| [SDK概要](../../L0-sdk/02-概要设计.md) / [SDK flow](../../L0-sdk/design-calibration/02_hld_calibration_flow.md) | §3～5/7正式client/read/call与support资格线索，flow状态不自动等于consumerready |
| [Identity概要](../../L1-identity/02-概要设计.md) / [flow](../../L1-identity/design-calibration/02_hld_calibration_flow.md) | §3～5/7 GlobalMember非人类认证，正式AI引用边界 |
| [Governance概要](../../L1-governance/02-概要设计.md) / [详细设计](../../L1-governance/03-详细设计.md) / [flow](../../L1-governance/design-calibration/02_hld_calibration_flow.md) | 02§3～7独立裁决truth，03§7.2 GetGateDecision只读线索；marketapprovedbinding与状态冲突仍pending |
| [Artifact概要](../../L1-artifact/02-概要设计.md) / [台账](../../L1-artifact/design-calibration/project_execution_ledger.md) | §3～5/7版本/lineage/baseline/consumable引用，不重造正式资产或材料结果 |
| [Method概要](../../L3-method-library/02-概要设计.md) / [台账](../../L3-method-library/design-calibration/project_execution_ledger.md) | §3/4/7定义/正式版本/受控读取/分发语义，与market交易/安装分离 |
| [Hub概要](../../L3-capability-hub/02-概要设计.md) / [台账](../../L3-capability-hub/design-calibration/project_execution_ledger.md) | §3/7 Registry/Descriptor/Exposure/visibility，当前repair资格只受影响路径挂起 |
| [Images概要](../../L2-member-images/02-概要设计.md) / [台账](../../L2-member-images/design-calibration/project_execution_ledger.md) | §3/7 pinnedentry/consumerhandoffgap/0outbound，正式供给不等市场安装 |
| [Observability概要](../../L4-observability/02-概要设计.md) / [台账](../../L4-observability/design-calibration/project_execution_ledger.md) | §3/7 redaction/produceradmission/正式receipt，与local业务audit分层；affected未解除 |
| [Archive概要](../../L4-archive/02-概要设计.md) / [台账](../../L4-archive/design-calibration/project_execution_ledger.md) | §3/4/7 owner-specificsource/export/restore；当前市场不纳active合同 |
| [仓库拆分方案](../../../architecture/仓库拆分方案.md) | §9.2/十/十一 Rust服务端+Vue前端、发布CLI形态与SDK向下依赖 |
| [全局依赖规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) | §4.1 Layer5并行窗口；本项目00→07 full-restart串行与runtime/compile/event裁剪 |
| [概要SOP](../../../standards/document/概要设计讨论流程_SOP.md) / [书写规范](../../../standards/document/概要设计书写规范.md) | 14Step、现行14章、按部分小循环/独立对象与流程/状态及配置深度 |
| [设计通则](../../../standards/document/设计文档编写通则.md) / [中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md) | full-restart、分批写入、三层台账与文档停审 |
| [真相源闭环标准](../../../standards/document/设计真相源闭环与可落码性标准.md) | typed字段/sidecar/metadata/result/state/projection闭环，unknown/配置/测试与证据边界 |

这些引用是实际使用的设计来源/受影响接缝导航，不证明正式consumer资格、真实运行或实现readiness。旧README/旧02～06、draft/HTML原型和临时比较材料不是当前正式实施基线。

### 装配执行计划

先删除旧02→新建14章骨架→Step1～5分章填→Step6七部分独立卡分批→Step7填→Step8七部分独立flow分批→Step9七部分状态分批→Step10～14填→编号/链接/表列/状态/flow/边界审计→项目台账与停审。不提前标completed。

### 装配与实际总检查

已执行旧02删除→14章新骨架→§1～5分章→§6七部分卡片→§7→§8七部分49flow→§9七部分14矩阵→§10～14。Step14反查补强均回修原Step：typed保存/读取、有限publisher失效与原结果重放、source_candidate、五类映射/逐功能行、104需求编号。无装配新增scope/owner/API/state。

实际检查见[静态文档记录](02_hld_static_review_record.md)：14章、43对象、21/16/12接口、49flow、14carrier、14主Step/35附录、86本地链接、表列/围栏与范围内diff均通过；这不是运行测试/evidence。

## 8. 回填草稿

§14摘录本Step参考表；其他章节仅对应已pass产物，完整卡/图/矩阵按U分批。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。正式14章已分批装配，静态文档检查无残留错误；立即stop_review，02→03 waiting_user_confirmation，禁止实现/commit。 外部资格不关闭，允许进入等待用户确认02，禁止03。
