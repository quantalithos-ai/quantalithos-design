# L6-bridges 06 Step2：目标范围

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step2 / 书写§5.2；回填正式06§2。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| scope | pass | design_static_only_external_gates_open | enter_step_3 | Step1全部问题/诊断/取舍/未决；00§4/9~14和05§2/12/14；验收SOP Step2、书写§5.2。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

单模块：C1~C5主线/横切P0/actual scope；P1/P2及非范围不能删P0。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§2已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step1全部问题/诊断/取舍/未决；00§4/9~14和05§2/12/14；验收SOP Step2、书写§5.2。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 核心目标是裁决Bridges协议适配闭环及不变量，不是平台/owner全系统上线。
2. 00全部16FR及24BR/20DR/16NFR/38AC/6VETO为P0；05已登记P1扩展/P2新产品不替代P0。
3. 六owner/Bus/四平台只验已选typed seam与actual资格，不验其内部全实现；未选WS/Bus不成为默认前置。
4. SDK/账号/pin/secret/driver/probe/producer虽不归本仓选择真相，实际不足阻对应positive；生产部署非06范围但不能宣ready。
5. 六原VETO覆盖truth/越权/泄漏/伪造/效果位置/私审批，其他缺口不冒充新VETO。
6. 03全部19model/191field、20协议/21机与04配置和05expected实例用正式名，不能仅写体验成功。

## 4. 当前材料问题诊断

05§2有synthetic/actual范围，00§14要求缺实际材料时not_evaluated；“只验本地”或把REAL变P1会弱化已确认范围。

## 5. 改动前后对比

| 项 | 改前材料 | 06落实 | 原因 |
|---|---|---|---|
| 范围 | 05切口/优先级 | P0门禁全部保留，actual分支独立 | local非实际资格 |
| 非范围 | 上游全实现/生产部署 | 只验seam，相关资格仍必要 | ownership≠豁免 |
| scope排除 | 未来候选能力 | 只能显式基线变更，不能用risk删P0 | 保原承诺 |

## 6. 验收裁决取舍与复杂度

| 方案 | 判断 |
|---|---|
| C1~C5与shared P0、local机制与actual正向分别声明 | 采用；范围清晰 |
| 只汇总local通过/4平台统一标签 | 不采用；掩actual未覆盖 |

复杂度：范围表足够，本Step不列后续每gate断言；Step5逐FR，Step6~11横切独立。

## 7. 结构化中间产物

### 2.1 裁决目标与范围

裁决受权来源/配置→mapping→正式交接或获准外显→独立known/保守unknown→有限恢复/安全读取/审计交接。只验Bridges已承诺能力及共享保护，不替内部owner或外部平台拥有真相。

| 范围项/来源 | 类型/优先级 | 裁决目标 | 非范围/结论影响 |
|---|---|---|---|
| C1 / FR-BR-001~003、AC-BR-001~007 | 配置/关系/映射 P0 | current双资格、版本/三typed映射、secret refs | 不创建GlobalMember/Conversation；actual安装/授权不足阻正向 |
| C2 / FR-BR-004~006、AC-BR-008~014 | 入站/变化 P0 | 来源/marker/ACK分离、AppendFact/ManifestExternalFact、编辑/删除/线程差异 | 不本地造Turn、不保证平台事件完整性 |
| C3 / FR-BR-007~009、AC-BR-015~021 | 外显/附件/投递 P0 | committed材料、逐披露许可、原effect/attempt/receipt | 不承诺已读/用户收到，不持久正文 |
| C4 / FR-BR-010~011、AC-BR-022~027 | 交互责任 P0 | platform验证+actor/target/action/current/one-use→owner动作 | 不本地审批/直执行Runtime/Tools |
| C5 / FR-BR-012~016、AC-BR-028~036 | 连续性/恢复/审计/读取 P0 | namespace/cursor/gap/rate/原op/read-only | 不把timeout/TTL/NotFound当NoEffect，不借Query修复 |
| 全24BR/20DR/16NFR、AC-BR-037/038及六VETO | shared边界 P0 | 禁材0泄漏要求/独立阶段/实际证据/有限资源 | 不以可用性豁免安全或缺资格 |
| 03全部19model/191field/20protocol/21machine及wholeCAS；04全部82配置/22CF/27F/12CFG | 合同/状态/配置 P0 | exact正式字段/variant/allowedpair/当前basis/冷变更 | 不由06补DTO/状态setter或选技术产品 |
| 05的22cuts/116TC封闭实例/22EV、11targets/13suite/7script | 证据 P0 | 同run真实、完整、schema/digest/关联/审查 | 全planned/not_run；静态表不是运行证据 |
| 四平台及所有selected实际owner/SDK/secret/route/driver/executor/producer | actual seam P0 | 逐scope/pin/method资格和实际正反结果 | 不要求上游全实现；selected不足blocked，不fallbackfake |
| 已批准非关键更多组合 | 扩展 P1 | 不涉及P0/VETO才可按风险规则条件接受 | 当前无实例/接受人 |
| 新平台、热加载、新路由产品 | future P2 | 原00~05变更重审后另立基线 | 本轮非承诺，不生成成功占位 |
| 上游内部全实现/生产部署、值班、发布执行 | 非范围 | 原owner/未来07/运维负责 | 非范围不证明就绪，06通过也不自动部署 |

### 2.2 范围限制

未选Workspace/Bus支路不强制；一旦selected或mandatory即required，不能用null/skip/risk绕过。既有P0/平台差异不能为了结果绿灯删去；实际不支持可按原能力合同验证保护分支，但不是已承诺正向交付完成。任何范围变更先回00~05 owning章节及本06影响追溯，固定新基线/新run后再裁决。

## 8. 回填草稿

正式06§2按书写规范直接摘录§7规范段；章节名为“验收目标与范围”。只补具名校准来源及延伸阅读链接，不搬§3~6诊断/取舍或§10自检状态，不新增结论。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。C1~C5/共享保护/实际资格与非范围映射核对，无削弱P0或新增VETO。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_3。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
