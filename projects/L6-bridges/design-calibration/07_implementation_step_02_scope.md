# L6-bridges 07 Step2：实施目标与范围

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step2 / 书写§5.2；仅设计校准，正式回填由Step13单独门禁控制。

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 输入和前序结论 | read | §2/当前正式来源 |
| SOP问题回答 | done_design_static | §3 |
| 材料诊断/前后对比 | done_design_static | §4/5 |
| 取舍与复杂度 | done_design_static | §6 |
| 结构化产物 | done_design_static | §7 |
| 回填草稿 | done_design_static | §8 |
| 待确认 | done_design_static | §9 |
| 实际静态自检 | done_design_static | §10；无项目测试 |

| 模块 | gate_status | next_allowed_action | source_files |
|---|---|---|---|
| step_02 | pass | enter_step_03 | Step1设计输入/hash/资格；00§9~14/03§2/04§2/05§2/06§2 |

## 2. 输入

Step1设计输入/hash/资格；00§9~14/03§2/04§2/05§2/06§2。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

目标是可验证Bridges纵切和安全失败/恢复，不是创建ownertruth；全部四平台P0保留，actual不足阻对应正向。local fake与actual两轨不互升，P1/P2不可替P0。

## 4. 材料诊断

常见错误是先做无授权外呼、将四平台当任选子集或把保护性拒绝统计为送达成功。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 常见错误是先做无授权外呼、将四平台当任选子集或把保护性拒绝统计为送达成功。 | 保持五能力及共享保护完整范围；planned不是实施；分开代码闭环、actual seam与最终验收。 |

## 6. 取舍与复杂度

保持五能力及共享保护完整范围；planned不是实施；分开代码闭环、actual seam与最终验收。

## 7. 结构化中间产物

### 2.1 目标与范围

| 能力 | P0增量 | 必须交付/验证 | 排除 |
|---|---|---|---|
| C1 / FR001~003 | 配置、经授权绑定、三typed mapping | current/两端basis/版本/去重；C01~03/Q01 | 自动GlobalMember/自动频道或Conversation |
| C2 / FR004~006 | E01入站与编辑/删除/线程差异 | bridge-origin/回环/ACK独立、原op交接/known-unknown、gap/coverage | 平台事件完整性保证、内部Turn自建 |
| C3 / FR007~009 | C04/E02安全材料及J01投递 | Gate降级/附件ref/原effect/attempt/receipt/rate lane | 敏感审批正文、附件字节、私有公开URL或送达承诺 |
| C4 / FR010~011 | C05/E03回调 | 平台验证+actor/target/action/current/one-use→正式owner | 直执行Runtime/Tools、签名即内部授权 |
| C5 / FR012~016 | dedup/cursor/recovery/audit/read | C06/Q01~04/J02~05/E04/条件O01、Query零写、有限失败 | new replay effect、telemetry即EV/consumer接受 |
| 共享保护 | 24BR/20DR/16NFR、六VETO | 所有输出body-free、资源/secret/current、wholeUoW与21机 | P0降级为P1、缺资格豁免或假run |
| 四平台 | Slack/Mattermost/Telegram/Discord | 各自能力快照/identity-channel-message mapping/ACK/rate/retry/edit/delete/thread/附件/callback差异 | 只selected subset宣4/4完成、新平台或新路由产品 |

### 2.2 不进入本轮

本轮产物只有07设计、校准、implementation planned台账；没有实现仓/代码/配置值/脚本/运行/测试。未来计划不包含上游全功能、生产部署/值班、任意运营后台、新平台、热加载或未来源SLA。optional Workspace/Bus不强制装配，selected/mandatory仍required；P1扩组合、P2扩功能不能填P0分母。

### 2.3 完成层次

设计闭环、代码门禁、actual运行资格、运行证据、最终人工裁决五层分别记录；任何上一层不能推下一层。ACK、内部accepted、平台accepted、consumeraccepted、EV互不等价；平台accepted仍不是用户收到/已读。全部139门禁保持planned/not_evaluated，最终verdict只通过/有条件通过/不通过；blocked/pause/waiting不是第四值。


## 8. 回填草稿

回填正式07§2仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

五能力、四平台与共享保护无遗漏；没有将actual缺口转P1、改139门禁或引入第四verdict；文档十节静态检查。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step3。
