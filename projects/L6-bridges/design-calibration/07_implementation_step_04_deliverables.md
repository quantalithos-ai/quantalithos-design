# L6-bridges 07 Step4：实施对象与交付物

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step4 / 书写§5.4；仅设计校准，正式回填由Step13单独门禁控制。

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
| step_04 | pass | enter_step_05 | Step3目录/台账；03§4/5/7~16、04§7~12、05§3/9/13、06§5~11 |

## 2. 输入

Step3目录/台账；03§4/5/7~16、04§7~12、05§3/9/13、06§5~11。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

对象交付是十九local model、二十协议/十九flow、四Q view、二十三port、四平台和六owner adapter；每个field/state/method必须同功能增量带required read/save/current与测试，不裸拆类型。harness独立于业务producer，未来writer只05schema。

## 4. 材料诊断

对象/协议已经闭口，若只按contracts/domain/infra层排实施会出现业务先写、Query/安全审计/wholeCAS后补，当前phase无法自洽。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 对象/协议已经闭口，若只按contracts/domain/infra层排实施会出现业务先写、Query/安全审计/wholeCAS后补，当前phase无法自洽。 | 把交付面转为功能纵切和资格验证；本步抽取现有落点，不提前设计phase ID/boundary，精确文件来自03§4，不创造实现。 |

## 6. 取舍与复杂度

把交付面转为功能纵切和资格验证；本步抽取现有落点，不提前设计phase ID/boundary，精确文件来自03§4，不创造实现。

## 7. 结构化中间产物

### 4.1 交付物与完成判定

| 交付物 | 类型/来源 | 计划落点 | 可验证完成判定 |
|---|---|---|---|
| bridges-contracts / bridges_contracts | contracts；03§4~6/16 | `crates/contracts/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-domain / bridges_domain | domain；03§4~6/16 | `crates/domain/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-application / bridges_application | application；03§4~6/16 | `crates/application/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-infra / bridges_infra | infra；03§4~6/16 | `crates/infra/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-api / bridges_api | api；03§4~6/16 | `crates/api/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-worker / bridges_worker | worker；03§4~6/16 | `crates/worker/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| bridges-jobs / bridges_jobs | jobs；03§4~6/16 | `crates/jobs/`精确既有文件 | 当前boundary编译/格式/接口与targeted TC；不以空lib或成功placeholder完成 |
| 191字段/17构造/二级carrier | 19model、shared/ref/schema；03§6/7/16.2~16.5 | 原Contracts/Domain/Application owner文件 | 来源/optional/empty/order/typed kind/guard/digest/fake-durable等价全部回指原表 |
| 20协议/19flow/23port | C6/Q4/E4/条件O1/J5；03§7/8 | 原service/handler/invocation/adapter文件 | 每flow包括同op replay/result、current/wholeCAS、安全audit/conditional outbox及no-writequery |
| 三mapping/游标去重/receipt | 03§6/9~12/16 | 原domain、repository/localmutation adapter | 全expected/unique/stagedset/immutable seed、commit未知probe同driver；无owner真相 |
| 21机101状态 | 03§9/16.6；05 state registry | domain/技术entry原owner | 150允许pair+375未列candidate，完整guard/factory来源而非只Happy path |
| 四平台adapter | 03§6/13；04公开再核验 | `crates/infra/src/platform/`原四平台文件 | 各平台入出/ACK/编辑删除线程/附件/回调/rate与current资格，实际缺项blocked |
| 82配置/secret refs | 04§7~12/03§13 | 原infra/config、runtime/private、profiles | strictparse/default拒绝/purpose/key/revision/批准bounds/clock/冷变更；零raw值 |
| 11测试target/7script/harness | 05§3/6/9.5/13 | 原11target + scripts/gates/checks/reports | 116TC/22DS/13suite路由、22EV计划安全schema和fixed-runwriter-reader，空index不达标 |
| 报告/交接 | 05§13/06§10/14 | future artifacts/test/<run_id>、reports/runs/acceptance/review/<run_id> | 真实runner材料、两个check、draft_for_review；没有机器verdict/signoff |
| 全部实施台账 | 本文§3/台账规范 | design-calibration/implementation_execution_ledger.md与全部boundary skeleton | 正式07同轮预建，全部planned/blocked/waiting、未来wait_until_current、无虚构commit/run |

### 4.2 真相归属与业务交付分组

| 分组 | exact models | 协议/关联面 | 必须随增量带入 |
|---|---|---|---|
| 配置/绑定/映射 | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | C01~03/Q01 | 资格/授权basis、三mapping来源/位置/版本/生命周期 |
| inbound | InboundHandoffRecord | E01 | origin/author/current/privacy、source编辑删除线程、ACK独立、ownercommit未知 |
| presentation/delivery | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt、DispatchLane | C04/E02/J01/Q02 | sensitive Gate降级、附件authorizedref、原effect/claim/receipt/rate/retry |
| callback | ExternalActionBinding、CallbackHandoffRecord | C05/E03；Q02读取callback原operation | signed source+internalactor/actiontarget/current/oneuse/owner结果 |
| continuity | DedupRecord、StreamCursor、GapRecord、RecoveryRecord | 所有写入口/C06/J02/J03/J05 | key/resultread、两coverage/comparator、expiry、同原operation权威readonly |
| safety handoff | SafeAuditRecord、SafeHandoffRecord | 所有localmutation、条件O01/E04/J04 | audit与telemetry分层、canonical/admission/NonRecursiveResultOnly |
| read载体 | BridgeLocalView六字段，非Domain独立truth | Q01~04 | samecommitted source/noID/noUoW/noaudit/no repair；非持久projection |

### 4.3 交付面差异

业务audit属于local truth提交；观测producer属于有资格的外部交接；测试harness属于运行材料。三者不共享业务正文、receipt或伪造consumer接受。报表工具只计划落点，不在设计仓创建scripts/artifacts/reports/运行JSON。七role/sevenbins是布局非部署拓扑；真实provider选择需Spike，不改03owner或跨仓compile图。


## 8. 回填草稿

回填正式07§4仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

十九模型+只读view、七role/sevenbins、20协议/23port及82config/11target/7script/harness来源覆盖；没有裸对象实施任务或实际交付事实；下一逐phase小循环。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step5。
