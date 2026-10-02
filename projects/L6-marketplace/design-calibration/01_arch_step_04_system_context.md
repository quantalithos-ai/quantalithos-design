# 01 Step04 · 系统边界与上下文

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step01～03、00§6/12、九owner01§4/9/10。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step01～03、00§6/12、九owner01§4/9/10 |

## 2. SOP问题回答

本仓位于Layer5产品/生态分发窗口，不是上游资产管理子模块。正式来源为方法库、Hub、Images、Artifact；正式审核依赖Governance；SDK提供client消费。输出安全审计材料到Observability需准入合同；Archive/Console是候选而非active接缝。人类authority、receiver、通知是必要外部能力但owner未指定，不画成已成立系统。依赖失效仅阻断受影响positive，读取也只有scope可证明才允许安全降级。

## 3. 输入诊断

旧上下文图混入角色及scan工具，且无合同SLA；这里角色应留00、技术运行细节留Step06/09。九owner不能全塞单图，缩为关键正式节点并用表补全，不删除资格缺口。

## 4. 设计取舍

采用六关键上下文对象主图+条件关系表；不采用“市场连任意外部安全/支付服务”的图，因未指定owner无法形成正式边界。思考done。

## 5. 结构化中间产物

### 正式§5系统上下文

#### 系统上下文图

```text
 +-------------------+ +-------------------+ +------------------+
 | L3-method-library | | L3-capability-hub | | L2-member-images |
 +---------+---------+ +---------+---------+ +--------+---------+
           | input               | input             | input
           +---------------------+-------------------+
                                 v
 L1-governance -- dependency --> L6-marketplace <-- input -- L1-artifact
                                 |
                                 | output (contract pending)
                                 v
                         L4-observability
```

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。
- 三资产owner保留自己的truth；Governance批准必须完整匹配市场基线，不是图连通即可通过。
- Observability输出是设计必要关系，不代表producer准入已qualified；SDK/条件Identity及候选Archive在表中补充。

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| L3-method-library | 输入 | 来源 | 方法/流程模板/角色正式消费来源 | 展示label非owner enum。 |
| L3-capability-hub | 输入 | 来源 | 正式能力曝光与安全摘要 | Registry非market version。 |
| L2-member-images | 输入 | 来源 | immutable entry/provenance/eligibility | supply非consumer安装。 |
| L1-artifact | 输入 | 来源 | 材料及consumable回指 | ref存在不证明所有market资格。 |
| L1-governance | 输入 | 治理依赖 | 正式决定与适用依据 | outcome/binding public合同缺口。 |
| L1-governance | 输出 | 消费 | 正式发布审核请求语境 | 本地handoff非批准。 |
| L0-sdk | 输入 | 来源 | 官方client及共享消费语义 | 不成为server facade/auth owner。 |
| L1-identity | 输入 | 来源 | 条件AI actor/member安全引用 | 非人类publisher登录/资质。 |
| L4-observability | 输出 | 消费 | 安全局部变化与交接材料 | 准入/脱敏/receipt pending。 |
| Authority/receiver/notification能力 | 输入/输出 | 治理依赖/消费 | publisher/org/scope依据及交付/通知结果 | 必要能力，owner未绑定，不声明active服务。 |
| L4-archive、L5-console | 输出，候选 | 消费 | 未来归档/管理摘要 | 当前主链不启用。 |

市场独立形成跨owner生态表面，消费的正式结论仍由相应owner提供。SDK是接入前提，不是额外业务truth。人类publisher authority、材料authority、receiver和通知通道未绑定，仅作为缺失能力而非已部署系统。失效时局部历史不删除，当前资格未知不开放新上架/获取，读取无法证明visibility时不返回敏感摘要。

## 6. 复杂度判断

主图七对象含本仓，其余在表中；无需新增上下文图类型。

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
