# 01 Step03 · 职责边界

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step01/02、00§2/9/10/11。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step01/02、00§2/9/10/11 |

## 2. SOP问题回答

本仓做发布责任关联、引用核验过程、申请与审核交接、listing/市场版本上架处置、分类metadata、获取关系、撤回已知影响和通知、本地安全审计恢复。方法/角色/模板、Registry/Adapter、镜像内容、Artifact血缘、Identity和Governance真相归相邻owner。最易串线的是review等于approval、distribution等于install、publisher relation等于认证、签名扫描等于审核以及市场分类等于方法目录。绝不能在query或worker里隐式完成上架或创建外部truth。

## 3. 输入诊断

旧01§5 Installation Lifecycle把接收系统执行状态收入市场；SecurityAttestation跨authority混归属；Package组织不是包正文ownership。当前00已纠正，01只转译职责，不回退旧主题。

## 4. 设计取舍

采用市场局部责任与外部主语分列；不采用“市场非truth，全部projection”，因为它无法承载申请、分发和撤回事实。也不把分类和listing合入任一资产owner。思考done。

## 5. 结构化中间产物

### 正式§4职责边界

| 职责项 | 类型 | 说明 |
|---|---|---|
| 市场来源核验过程/publisher relation | 做 | 责任关联由市场拥有，资格依据外置。 |
| 发布申请/固定基线/review handoff | 做 | 本地流程不替代Governance裁决。 |
| Listing/市场版本/目录分类/metadata | 做 | 市场事实不能被Registry或方法目录吸收。 |
| 获取意图/分发关系/attempt/反馈映射 | 做 | 市场拥有交接过程，不拥有安装。 |
| 撤回处置/已知影响/通知计划与尝试 | 做 | 停新获取与外部通知结果分开。 |
| 局部安全审计/恢复过程 | 做 | accepted变化和unknown可解释，不冒充外部audit完成。 |
| 资产正文/版本/Registry/Adapter/镜像/Artifact血缘 | 不做 | 分别归资产及Artifact owner。 |
| Identity truth/人类认证/组织资质/权限裁决 | 不做 | 身份引用和责任关联不能创造authority。 |
| Governance approval/Policy truth | 不做 | 仅消费有效正式决定。 |
| 扫描/签名/SBOM正文及生成平台 | 不做 | 材料authority与适用合同外置。 |
| 安装、激活、付款、订阅及财务账本 | 不做 | receiver及未来财务owner拥有。 |
| 窄entitlement视图 | 易混淆职责 | 仅source-backed获取资格，不是授权或交易账本。 |
| Review进展、市场上架与正式批准 | 易混淆职责 | 三主语不可合并、不能本地“批准”。 |
| 市场版本与源版本 | 易混淆职责 | exact绑定不拥有源正文生命周期。 |
| 安全日志与业务审计 | 易混淆职责 | 运行诊断不证明accepted变化或外部接收。 |

红线：外部正文不进入存储/索引/日志/事件/报告；扫描/签名/ACK不可上架；免费不绕授权；撤回不等卸载；恢复不修改owner/历史；所有入口不因技术配置改语义。

## 6. 复杂度判断

职责独立单元，不提前展开数据表或接口；无必要图。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
