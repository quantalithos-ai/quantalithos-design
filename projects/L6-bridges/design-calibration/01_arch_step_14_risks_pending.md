# L6-bridges 01 Step 14：风险与待确认事项

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step1~13 pass；已读架构SOP Step14、规范§4.15、00 Step15风险register、专项owner正式语义和必要台账。先把已识别且会影响主线的风险与尚未定论的待确认事项分开，再逐项写影响、当前保守口径、阻塞性和缺失确认；不写任务、最终解决方案、负责人、时间或ready结论。

| 讨论面 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 正式风险登记 | done | done | done | pass / risks_registered |
| 待确认事项登记 | done | done | done | pass / pending_registered |
| 上游状态与历史冲突核验 | done | done | done | pass / inherited_state_checked |
| 阻塞性与当前口径审计 | done | done | done | pass / risk_pending_audit |

## 2. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 尚未关闭的风险？ | human/AI/owner责任串线、材料/ref断裂、平台版本/scope漂移、unknown副作用、cursor/gap/dedup窗口、敏感材料泄露、产品/seam默认行为、Observability交接和来源污染。 |
| 影响哪层结构？ | U1~U6边界、依赖裁剪、数据归属、一致性、通信降级、技术机制、横切安全与演进触发；每项在风险表中标明具体范围。 |
| 尚未形成定论的事项？ | BR-UP-001~009的owner/平台/配置合同和BR-UP-010的并行输入资格；它们有来源和缺失确认，但不能用风险表把未定论伪装成已知运行事实。 |
| 哪些影响正向成立？ | 缺human责任、material ref、平台能力、secret/provider、probe/comparator或consumer资格时，相关正向激活/实施/联调/验收声明保持阻塞或有条件阻塞。 |
| 哪些可继续？ | 保守的边界、失败路径、引用/快照和禁止材料设计可继续；不因设计自检、上游commit或公开来源关闭正向缺口。 |

## 3. 当前材料诊断与取舍

旧材料以“未来补齐”或“平台可用”掩盖风险，没有区分架构已经识别的风险与仍缺外部确认的事项。当前风险表只收纳已经知道会影响主线的未关闭问题，待确认表只收纳尚未形成定论且缺具体确认的问题；两者都保守限制正向能力，但不替上游或平台做结论。当前处理口径只说明如何暂存/收缩，不给出实施修复方案。

## 4. 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| R-BR-001 外部human、AI身份与owner责任链可能串线 | U1绑定、U2入站、U4动作；FR002/003/010/011、AC003/004/023/024 | 按主体kind、显式binding、当前actor/basis和有效期收口；缺责任链时拒绝或blocked，不把external_id转为GlobalMember | 有条件阻塞 | 风险已知且会改变授权与责任主线；安全失败路径可继续，正向绑定/动作不能激活。 |
| R-BR-002 source/material/ref与重解析边界可能缺失 | U2/U3/U5/U6；FR004/005/007/008/014、AC009/010/016/017/031 | 只允许瞬时转换和获准owner/Artifact ref；缺ref或准入保持blocked/missing_source，不保存raw body | 有条件阻塞 | 缺材料时可靠接管、外显、附件和恢复均不能宣称成立。 |
| R-BR-003 平台版本、scope、入口和能力差异可能造成虚假兼容 | 四平台adapter、U1~U5；FR001/003/004/006~010/012/013 | 逐installation记录来源/版本/capability，未核验路径标unsupported/degraded/waiting；Telegram来源不完整保持待核 | 有条件阻塞 | 设计可继续，但具体安装/能力激活受版本和官方合同约束，不宣称4/4。 |
| R-BR-004 owner或平台未知效果可能被误作失败并重复执行 | U2/U3/U4/U5；FR005/009/011/013/014、AC010/018/024/030/031 | 保留原operation/effect与indeterminate；只按权威probe/同effect结果对账，不换target、不新建effect | 有条件阻塞 | 自动重试和送达/动作正向声明被阻塞，保守记录与人工出口不阻止设计。 |
| R-BR-005 cursor跨epoch、gap或dedup窗口不足可能吞变化/重复回放 | U2/U3/U5/U6；FR006/012~014、AC011/029~031 | 仅在正式stream/epoch/comparator可比时推进；不可比进入gap/quarantine/manual，窗口不明不自动回放 | 有条件阻塞 | 连续性和自动恢复不能激活；不以时间戳、裸ID或日志补齐。 |
| R-BR-006 敏感Gate、附件、callback私有材料或平台错误可能泄露 | U2/U3/U4/U6全部durable与观察出口；DR017~020、AC016/017/026/037/038 | 只允许body-free白名单ref/版本/阶段/有限reason；缺准入不外显、不写日志/证据，不用可还原派生规避 | 阻塞违规路径 | 一旦突破是架构VETO，不是可延期优化；当前安全边界仍可继续校准。 |
| R-BR-007 SDK/OAuth/API Key/KMS/路由默认行为可能绕授权、限流或effect连续性 | adapter/config/secret/recovery seam；FR001/004/009/010/013/014 | 产品/版本/供应方式保持not_selected/not_established；缺有效ref、scope、rotation和失败语义不激活 | 有条件阻塞 | 不阻止机制设计，但阻塞任何具体实现、配置和运行资格声明。 |
| R-BR-008 Observability producer/consumer/handoff资格可能被本地记录冒称 | U6、所有审计/证据出口；FR015/016、AC032/033/037/038 | 只写本地body-free intent/attempt/handoff；继承十二affected状态，consumer unknown不升级为accepted/evidence/ready | 有条件阻塞 | 强制观察/验收声明受阻，安全有限handoff设计不被伪造关闭。 |
| R-BR-009 陈旧台账、并行Chat或历史正文可能污染来源资格 | 00来源、Step1/15、正式01装配和后续追溯 | 只承接正式文档和明确状态；L5-chat保持reference_only，旧正文只作冲突扫描，不回写上游 | 阻塞错误输入 | 一旦把未停审材料当正式输入，主线追溯失真；当前已隔离该输入。 |

## 5. 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| BR-UP-001 Conversation bridge-origin交接兼容、safe material owner/ref和accepted/unknown对账 | U2/U3/U5；FR003~007/009/014，AC008~021/031 | 缺owner对source版本/变化、target mode/actor/kind/digest、材料准入/重解析和结果查询的兼容合同 | 只承接已知正式语义；缺合同的正向接管/外显/恢复保持blocked，不新造泛用提交接口 | 现有Conversation设计提供正式分支，但Bridges消费资格尚未完成确认，不能把缺口写成风险已闭合。 |
| BR-UP-002 human account、AI身份与internal actor/participant责任链 | U1/U2/U4；FR002/003/010/011 | 缺正式human认证/责任owner、主体kind、scope/action、有效期/撤销和跨主体判定 | 无完整链条不绑定/不交接动作；AI GlobalMember引用不替human资格 | 这是外部确认尚未形成结论的责任链问题，当前不能指定统一认证provider。 |
| BR-UP-003 Policy/Gate展示、存在性、action和callback owner状态 | U3/U4/U5；FR002/005/007/010/011/014 | 缺逐对象/范围当前basis、敏感裁剪、受控入口、动作结果和撤销/expiry读取合同 | 缺依据不外显/不执行；低敏感不默认按钮，受控入口未建立不造URL | Governance是owner边界，不因Bridges需要而被扩大为统一登录/权限中心。 |
| BR-UP-004 Artifact附件准入、ref有效性和传播范围 | U2/U3/U5；FR005/008/014、AC017/031 | 缺文件瞬时接收、正式纳管、authorized ref、读取/传播/撤销/expiry及必要性合同 | 必要附件不可用则blocked；可省略必须有owner依据；不缓存文件或公开链接 | 现有Artifact语义不等Bridges已具备平台文件联调能力。 |
| BR-UP-005 Workspace safe read/export/visibility provenance | U1/U2/U3/U6条件分支；FR003/007/016、AC004/016/033 | 缺实际消费路径所需source/scope/read-export和local binding/driver/crypto资格 | 仅影响选用分支；有独立owner依据的路径不强制经Workspace，缺条件返回denied/unavailable | Workspace不是频道、权限或桥接owner，台账开放项保持原状。 |
| BR-UP-006 Observability producer准入、safe材料、consumer disposition和环境资格 | U6及强制审计操作；FR015/016、AC032/035~038 | 缺具体producer contract、body-free redaction、准入/预算、真实consumer accepted/unknown处理 | 保留本地handoff和unknown；强制准入不足限制相应操作，不出具本地evidence/verdict | pre_implementation_blocked及十二affected不被统一关闭或改写。 |
| BR-UP-007 正式SDK/client、平台SDK/OAuth/API Key/KMS/路由与secret binding | U1~U5、配置/部署/恢复；FR001/004/009/010/013/014 | 缺版本/pin、安装scope、grant/rotation/revoke、provider/ref解析、受权路由和SSRF边界 | 机制先固定，具体载体保持not_selected；无有效ref/解析资格不激活 | 公开平台资料不证明账号、scope、provider、运行或默认重试行为。 |
| BR-UP-008 四平台按安装、版本和能力支持矩阵 | U1~U5所有平台交互；FR001/003/004/006~010/012~014 | 缺部署版本对应来源和逐平台入口/变化/附件/callback/ACK/cursor/限流能力合同 | 每installation独立supported/degraded/unsupported；Telegram官网核验缺口保持blocked | 不用四个平台共同失败词或源码master推断云服务能力。 |
| BR-UP-009 幂等键、namespace/epoch/comparator、预算和同effect probe | U2/U3/U4/U5；FR009/012~014、AC018/029~031/034/036 | 缺可执行编码/冲突、窗口/保留、claim/fence、lane/bucket/retry预算和权威probe结果合同 | 不能证明则incomparable/gap/indeterminate/manual；重建不产生新效果 | 需求语义已收稳，详细可执行合同尚未形成，不能在本步补实现方案。 |
| BR-UP-010 L5-chat并行入口是否可成为正式协作边界 | 来源资格、依赖裁剪、追溯 | 缺用户授权、停审正式产品/owner合同和可引用消费语义 | 保持reference_only，不进入Bridges输入或审批路由 | 这不是当前运行依赖风险，而是来源资格挂起项；不把并行产品升级为强前置。 |

## 6. 上游继承状态核验

| 上游材料 | 当前已知状态 | 本仓不作的推论 |
|---|---|---|
| Identity implementation ledger | `commit-08-c / ready_for_design_gate`（按上游台账记录） | 不推断human认证、Bridges联调或外部绑定已验证。 |
| Artifact implementation ledger | `commit-01-a / ready_for_design_gate`（按上游台账记录） | 不推断附件上传、读取、传播或链接已运行。 |
| Workspace ledger | WS-UP-001~008/006-S、WS-LOCAL-001~003维持原开放状态 | 不把文档停审或部分设计记录当safe read/export/visibility闭合。 |
| Observability ledger | `pre_implementation_blocked / wait_design`及十二affected原状态 | 不把covered_conditional/design_record_closed_implementation_open升级为真实producer/consumer/evidence。 |
| L5-chat | `reference_only` | 不读取其未停审内容，不以其路由或产品结论补Bridges事实。 |

## 7. 当前处理口径说明

风险表收纳的是已经知道会改变主线成立条件的问题，因此必须给出保守限制和阻塞性；待确认表收纳的是仍缺owner、平台或来源确认、尚不能定论的问题。当前允许继续的是边界和失败语义的校准，不是受影响正向能力的激活、联调或验收。所有风险/待确认项的释放依据都是相应正式合同和真实材料，不能用本仓静态自检、上游commit、公开链接或台账记录替代。

## 8. 历史材料后置核对

| 历史误读 | 当前判断 |
|---|---|
| 旧01把外部账号直接映射GlobalMember、把低敏感Gate默认为外部审批 | 作为冲突输入，不继承；当前以主体kind、显式basis和owner action收口。 |
| 旧01把KMS、SDK、语言和四平台成功率写成事实 | 不继承产品、版本、账号或4/4运行口径；当前均保持not_selected或逐安装待核。 |
| 旧README/旧设计把桥接消息正文和审计记录平列为本仓数据 | 不继承正文/敏感材料存储；只保body-free引用和阶段记录边界。 |

## 9. 回填草稿、来源与门禁

正式 `01-架构设计.md §15` 计划摘录：§4风险表、§5待确认表、§6继承状态和§7当前处理口径的压缩版；精确释放依据留校准材料延伸阅读。不要把风险表改写成任务列表，也不要把待确认项回填为前文确定结论。

来源：`00_req_step_15_risks_open_questions.md`、`01_arch_step_01_requirements_baseline.md`、`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_07_dependencies.md`、`01_arch_step_10_technology_seams.md`、`01_arch_step_12_cross_cutting.md`、`01_arch_step_13_evolution.md`、专项owner正式文档/必要台账、架构SOP Step14、架构设计书写规范§4.15。

自检：风险与待确认事项分表；每项有具体影响、当前口径和阻塞/缺失确认；BR-UP-001~009仍open、BR-UP-010仍reference_only；上游继承状态未改写，未伪造实现、证据、签署或ready。当前agent设计自检通过。

`gate_status=pass`；`gate_reason=risks_and_pending_items_separated_with_precise_impacts`；`next_allowed_action=read_step_15_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
