# L6-bridges 05 Step2：目标范围

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| scope | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step03_skeleton | 本Step§2/7；实际静态审计 |

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

已读Step1§3/4/6~10，复核00§9/10/11/13/14及SOP Step2、书写§5.2。03§15是P0最小清单；04§12提供配置承接。未把旧05/06作为输入。

## 3. SOP问题回答

1. P0必须证明C1~C5、16FR全部保护性边界、20协议正反、21机、wholeCAS/unknown、四平台差异/私有材料与证据真实性；local机制与真实资格分别报告。
2. 不把关键异常划P1/P2；P1仅批准范围内更广泛兼容组合，P2未来产品/路由变化待重新校准，不代表已承诺能力可省测。
3. 六owner、SDK、Bus只测Bridges消费/交接seam及actual资格，不测试对方全部功能。
4. 平台版本/账号/provider/pin与准入缺失是残余阻塞，不用mock规避。未选Workspace/Bus分支不强制引入。
5. 六VETO均P0，任何泄露/越权/重复效果/阶段伪造不能因总体通过率容忍。

## 4. 当前材料问题诊断

单写“正常发送/接收”会遗漏config/binding、双重current、unknown、readonly、报告伪证据等安全闭环；正向fake不能判断实际owner/平台接受。测试范围必须按能力和禁止面，而不是按运行成功率。

## 5. 改动前后对比

| 旧式范围 | 本轮范围 |
|---|---|
| 收发消息一条happy-path | C1~C5含正常、拒绝、未知、重放/并发/撤销 |
| SDK连接=平台验证 | compile、runtime、event及provider资格独立 |
| 核心用例通过就退出 | P0全部有TC/DS/suite/EV，actual缺口阻相应退出 |
| 非范围无去向 | owner完整实现/平台SLA/实施部署交回对应owner与06/07 |

## 6. 测试设计取舍与复杂度

采用P0守住已承诺闭环、P1扩展非关键组合、P2未来重新校准的分级；不创建新吞吐或SLA。当前约80行，小批范围表后实际自检；具体TC留Step6，不提前补实现细节。

## 7. 结构化中间产物

### 7.1 目标与范围

目标是在不取得内部/平台truth的前提下，验证来源→授权→映射→正式交接/效果→已知或保守未知→安全只读/交接的完整Bridges闭环，并提供可由06引用的安全、固定run证据计划。

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标/风险归属 |
|---|---|---|---|---|
| C1配置/binding/三mapping | 功能/规则/数据 | P0 | FR001~003、BR001~005、DR001~006；两端资格/current/CAS/typed回链 | 不授平台/内部owner权限；actual资格不足blocked |
| C2 inbound/change/owner handoff | 功能/协议 | P0 | FR004~006；来源/marker/回环、ACK独立、版本/线程/删除差异 | 不自产Turn、不宣平台消息完整性 |
| C3 presentation/attachment/delivery | 功能/规则 | P0 | FR007~009；committed安全投影/Gate/ref、原effect/attempt/receipt | 不宣送达/已读、不保存材料、无替代公开URL |
| C4 callback/action handoff | 功能/安全 | P0 | FR010/011；actor/source/target/action/current/one-use、owner负责动作 | 不批准Gate/写Decision/直调Runtime或Tools |
| C5 key/cursor/rate/recovery/audit/read | 一致性/恢复/观测 | P0 | FR012~016；原身份/窗口/预算、gap、权威probe、no-write | 不发明NoEffect、不造consumer接受/evidence |
| 20协议/19flow/21机、immutable/view | 合同/状态 | P0 | 完整codec、全部pair/guard、19logical collections/wholeUoW实际commit | 禁止generic setter/owner私表读写 |
| 04配置12切口/22CF/27F、stop-budget | 配置/资源 | P0 | 严格parse/required/冷变更/secret/ref/finite结果 | 配置文件不授authority或qualification |
| 四平台adapter及SDK/owner/Bus seams | 边界/兼容 | P0 | 每平台能力/来源/method、当前可核版本资格与独立phase | fake只local；未建立actual资格不宣4/4通过 |
| 禁止材料/六VETO/证据真实性 | 安全/交付 | P0 | DR017~020、NFR015/016、AC037/038，任何出口0泄露要求 | 不是已测0泄露；不能自动signoff |
| 已批准范围内更多非关键组合 | 扩展回归 | P1 | 实际基线后按变更影响选增补 | 不替代任一P0异常/配置/平台 |
| 新平台/热加载/新路由产品 | 未来候选 | P2 | 重新校准00~04后才安排 | 当前非承诺能力，不造placeholder成功 |
| 上游全功能、生产部署/值班、真实验收裁决 | 非范围 | 不适用 | 只交接Bridges契约影响 | 上游owner、06/07/未来运维负责；风险不因非范围消失 |

### 7.2 优先级与否决

P0所有已承诺16FR及共享24BR/20DR/16NFR/38AC方向都必须有可执行断言。VETO-BR-001~006独立覆盖并阻止受影响验收：truth/身份越界、未授权、材料泄漏、阶段/证据伪造、效果/位置/读取破坏、私有审批/直接执行。

P1失败不自动忽略：按影响重评P0/VETO、真实证据和06裁决；P2没有当前run/case承诺。未核平台时限、限流或probe、未知driver/secret/producer、WS/affected开放项写blocked/not_evaluated，不以保护性拒绝声明正向闭环成功。

## 8. 回填草稿

正文§2装配§7.1/7.2，保全部非范围去向；不用测试优先级重写需求能力。

## 9. 待确认事项

BR-UP/WS/affected继续open；P0实际正向退出不能成立。下一Step抽取逐对象/协议/状态/配置切口，复读03§15与原schema/state必要段。

## 10. 自检与进入下一步条件

实际自检：P0与五能力/16FR/六VETO逐项匹配；所有非范围明确owner/后续文档去向；无新SLA或事实放行。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step03_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
