# L5-chat 项目设计讨论执行台账

> 提交授权更新（2026-10-02）：用户明确要求三个设计提交，按draft/00/01、02/03/04、05/06/07归组；对应校准产物随正文，共享项目台账和07实施台账/全部21planned skeleton归第三组。下文“未提交/不提交”是之前设计停审轮的历史记录；当前仅设计仓提交获授权，代码实施、运行、证据、验收、发布和readiness仍未授权/未发生。

> 最新完成记录（2026-10-02）：用户“现在完成 全部07”已由当前agent串行执行；07 Step1～13 done / formal_stop_review。正式07十三章、implementation项目台账和全部21planned boundary skeleton已完成静态审计并停审。下列06/05/04/03记录均为历史；当前恢复点见§1。

本轮修改38份：07-实施计划.md；07flow与13独立Step；本设计台账；implementation_execution_ledger.md与implementation-boundaries/21份。只修改projects/L5-chat/，00～06七文件指纹和十个专项上游80指纹未变，未修改SDK、原型、standards或其他项目。

静态检查：13章/逐Step来源一致；10phase/21boundary/63计划批次；43协议/17主体/12enum、216既有TC/16suiteEV、142P0gate/10VETO/36actualAC与21×55经验适用性闭合；38文件链接/围栏/表格列/cursor/placeholder/尾随空白及本轮scope diff检查通过。完整L5-chat diff中前序00/01八处Markdown硬换行尾随空白保留，不声称全项目diff通过。

只有commit-01-a是current且blocked/wait_design，未来20项planned/wait_until_current；189实施门禁全部blocked，actual/evidencewaiting。approved designcommit与实施授权waiting；无实现、安装、build/run/应用test、actualartifact/report/EV、验收结论/风险接受/签署/readiness或commit。正式07停下，下一步仅用户审阅。

> 历史06完成记录（2026-10-02停审复核）：用户“现在完成全部06”已执行；06 Step1～15由当前agent串行完成，正式06十五章原路径full-restart并立即停审。下列05/04/03完成及停点记录均为历史，当前恢复点见§1。

本轮文件：06-验收标准.md、06_acceptance_calibration_flow.md、06十五份独立Step产物、本台账，共18份。原06 Step内回填聚合、expected/actual实例、签署digest与E018审阅顺序，校正相对链接；只修改projects/L5-chat/，00～05指纹未变，未修改SDK、原型、其他项目或实现代码。

静态文档审查：十五章/来源逐章一致、36实际AC/142唯一子gate/216既有plannedTC/16既有plannedEV/10VETO追溯有效，43协议/17主体/12enum与03一致；私有验收DTO的15接口117字段传递类型/必填声明、18份文件链接/围栏/表格列及git diff --check通过。过程十表和停审留calibration，正式正文只收口条件。没有安装、实现、编译、应用测试、真实build/run/report/EV、验收结论、风险接受、签署、readiness或commit。当前停在06，不进入07，不创建implementationledger/boundary skeleton。

> 历史05完成记录（2026-10-01）：用户“现在完成全部05”已执行；05 Step1～15单agent串行完成，正式05十五章原路径重写并停审。

本轮文件：05-测试方案.md原路径full-restart；新增05_test_plan_calibration_flow.md及05十五份Step产物；更新本台账。只修改projects/L5-chat/，无00～04、SDK、原型、其他项目或实现代码修改。

静态文档审查：十五章顺序、43协议成对/17主体三类与合法全行矩阵、216planned TC族、16suite/16planned EV、12CFG成对、14并发/15错误、需求/实际AC追溯、10类跨文档复核；17份05文件的围栏/表格列/相对链接、TC唯一注册/EV映射与git diff --check通过。host-unit TS/Rust入口分域，report先machine检查→生成候选→final检查，无digest引用环。只文档审查，未实现/安装/编译/运行应用测试，未生成真实run/artifact/EV/验收或readiness，不提交commit。

> 历史04完成记录（2026-10-01）：下列两段为上一轮04授权执行结果，当前恢复点以§1正式06停审为准。

本轮文件：新增04-配置设计.md、04_config_calibration_flow.md及04十五份独立Step产物；更新本台账、03正式§5.9.1.1/§13、03 Step6/14及03flow必要配置反向校准。没有更改00～02、SDK、原型、其他项目、真实config/源代码/tests/scripts；未创建implementation ledger或boundary skeleton。

静态文档审查：十五章/来源、八域十四字段、八模块及完整strict JSON九块（均可解析、模块与汇总一致）、六profile、十二planned CUT-CFG；类型/必填/三安全缺省/范围单位/source/敏感/生效/失败/rollback与03映射闭合；Markdown围栏/表格/编号/文件链接、git diff --check通过。仅文档校验，不是应用test/build/run/验收/ready。SDK/owner/native批准/生产预算/精确版本兼容继续blocked；当前停下，不进入05，不提交commit。

> 本轮完成记录（2026-10-01）：用户“现在完成全部03”授权已执行，03 Step11～19串行完成且正式03原路径收口；后续章节所记Step4/Step7/Step10停点均是历史，当前恢复点见§1。

本轮修改文件：03-详细设计.md；新增03 Step11～19各独立中间产物；原位修正Step4 planned脚本职责、Step6读取暂不可用错误与native origin/有限拒绝映射、Step9错误映射、Step17计数措辞；03flow及本台账同步。只写projects/L5-chat/，未修改SDK或其他项目，也未创建代码或实施台账。

静态文档审查：十八主章、43协议/43flow逐名相同、43独立调用图、17状态主体/17图、12canonical enum、43协议测试切口/17状态切口、15错误码、14配置字段；全部Step6 schema保留且无重复声明，围栏/表格列/相对文件链接有效，git diff --check通过。此处只记录设计文件检查，不是应用测试、run、证据、验收或readiness。全部外部blocker继续保留，当前正式03停审，不提交commit。

> 创建日期：2026-09-25
> 当前模式：`full-restart + single-agent-serial`；前轮已完成文档按正式来源读取，旧06/README及历史停点记录不直接继承。
> 当前任务：07 Step1～13 done / formal_stop_review；按用户新授权完成draft/00/01、02/03/04、05/06/07三笔设计提交后停下；implementation not_started / blocked，无代码实施授权。
> 实施状态：`not_started`；本轮只做设计文档和校准中间产物，不实现代码、不执行测试、不创建实现仓、不提交 commit。
> 修改范围：仅 `projects/L5-chat/` 下的设计文档、`design-calibration/` 中间产物和本项目台账。

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07` formal_stop_review | Step1～13 done | 十三章、planned实施台账/21骨架 | blocked | 本地设计静态闭环通过；批准实施baseline/授权及上游positive能力仍缺，不进入实现 | 停审，等待用户审阅；获后续明确实施授权才读取实施台账/current boundary | `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | `stopped` | Step 17 chapter repair complete | 00 保持前轮停审；本轮已另获授权完成01，本轮不改00。 | CHAT-UP、WS-UP、OPEN-CHAT及CHAT-BASE-001保持open。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | `stopped` | Step 16 chapter review complete | 前轮修复完成并停审；本轮只作为02直接基线。 | CHAT-UP、WS-UP、OPEN-CHAT保持pending/blocked。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | `stopped` | Step 14 chapter review complete | 已逐章承接当前01，完成02后停审，不进入03。 | CHAT-UP008/009、CHAT-BASE001及继承合同缺口保持open。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | `formal_stop_review` | Step1～19 done | 正式03十八章停审；后续04/05授权已执行。 | CHAT-UP001～009、WS-UP001～008、CHAT-BASE001及host/storage/config/quality保持open/blocked。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | `formal_stop_review` | Step1～15 done | 十五章已完成并停审；05授权已执行。 | CHAT-UP/WS-UP/BASE/native/生产budget/版本兼容继续blocked。 |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | `formal_stop_review` | Step1～15 done | 十五章原路径完成并停审；本轮作为已获授权06的直接基线。 | CHAT-UP/WS-UP/BASE/native/quality/归档继续blocked |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | `formal_stop_review` | Step1～15 done | 前轮停审完成；本轮07连续授权已执行，06仅作正式来源未修改。 | CHAT-UP/WS-UP/BASE/native/quality/version/source/归档继续blocked |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | `formal_stop_review` | Step1～13 done | 十三章与implementation台账/全部21planned skeleton已完成静态审计并停审；等待用户审阅，不进入实现。 | CHAT-UP/WS-UP/BASE/native/质量/版本/归档/实施baseline与授权仍blocked |

## 3. 执行纪律

文档新鲜度说明：当前00～07均已设计停审；00～06七文件指纹与07启动时一致，正式07指纹已固定到implementation台账。05定义planned TC/fixture/suite/EV，06定义裁决规则；SDK/native/AT、预算/版本/来源/归档仍blocked，不等实现、应用测试或ready。十个上游80正式来源指纹一致；implementation项目台账和全部21planned骨架已经建立，实际实施仍not_started / blocked。

| 规则 | 状态 | 说明 |
|---|---|---|
| 只修改本项目 | active | 不修改其他项目正式文档，不修改 SDK 源码或 SDK 正式文档。 |
| 单 agent 串行 | active | 当前 agent 独立完成阅读、分析、写入和审计；不创建、调用或委派 sub-agent、worker 或并行代理。 |
| full-restart | active | 旧 README、旧正式文档和未停审兄弟设计只能作为 `historical_material` 或边界审计输入。 |
| 正式文档顺序 | active | 严格 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`。 |
| Step 顺序 | active | 当前 Step 自检通过后才创建下一 Step 文件；不得预先批量创建未来 Step 文件。 |
| SDK 改进范围 | active | 只在 Chat 校准材料中登记 `required capability / gap / owner / blocker`；除非用户另行扩大范围，不改 `projects/L0-sdk/`。 |
| 不伪造事实 | active | 不写实现、commit、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 正式文档停审 | active | 当前授权全部07；正式07和全部planned实施台账骨架完成后立即停审，不进入代码实施。 |
| 当前提交范围 | active | 仅用户指定的本项目三笔设计提交；其余项目/根文件不纳入，不创建实施commit或推进代码实施。 |

## 4. 上游与历史材料台账

| 材料 | 定位 | 本项目处理口径 |
|---|---|---|
| 六份全局设计 / 需求规范 | `normative_authority` | 决定流程、结构、依赖裁剪、真相源闭环和写入门禁。 |
| `projects/L0-sdk/00~07` | `current_formal_upstream` | SDK 是客户端接入层；提供 typed query / command / event / auth / transport / retry / error / trace / redaction surface，不拥有 UI、产品工作流或领域 truth。 |
| `projects/L1-conversation/00~07` | `current_formal_truth_owner` | Conversation、Turn、Participant、scope、visibility、change cursor 和对话事件 truth 归 conversation；Chat 只消费正式读取 / 命令 / 变化能力。 |
| `projects/L1-identity/00~07` | `current_formal_truth_owner` | AI员工GlobalMember/actor/identity lifecycle归identity；不自动提供完整人类+AI公司人员目录，Chat只展示正式安全摘要。 |
| `projects/L1-process/01/02` | `current_formal_truth_owner_supplement` | 补充复核ProcessInstance/Activity/Token/Gateway、过程汇聚与只读派生边界；不证明Chat SDK projection/change/resume已闭合。 |
| `projects/L1-work/00~07` | `current_formal_truth_owner` | Project、ProjectMember、Backlog、WorkItem、Iteration 和项目进度 truth 归 work；Chat 只显示协作级状态。 |
| `projects/L1-governance/00~07` | `current_formal_truth_owner` | Gate、Approval、Decision、Policy、Control、AIIA / SoA 与 Nonconformity 治理 truth 归 governance；Chat 只能显化并通过正式命令入口发起受控请求。 |
| `projects/L1-artifact/00~07` | `current_formal_truth_owner` | Artifact 正文、版本、血缘、Evidence / Baseline truth 归 artifact；Chat 只消费 body-free ref、safe summary、预览或正式下载入口。 |
| `projects/L1-workspace/00~07` | `current_formal_truth_owner_with_open_contracts` | Workspace 是跨 L1 的只读 read model / local view state owner；Chat 只能消费其已闭合的 safe view / export，`WS-UP-001~008` 继续作为 blocker。 |
| `projects/L2-member/00~07` | `current_formal_truth_owner_with_open_contracts` | Member 容器内在场、交互边界、筛选 / 投递 / 出站尝试语义归 member；Chat 不把 member 交互边界误写成身份或 runtime truth。 |
| `projects/L2-runtime/00~07` | `current_formal_truth_owner_with_open_contracts` | Runtime run、decision、checkpoint、outcome 和 handoff attempt truth 归 runtime；Chat 只显示 safe summary / status / gap。 |
| `projects/L4-observability/00~07` | `current_formal_truth_owner_with_open_contracts` | 观测材料、审计投影、body-free evidence linkage、report handoff 和 no-write 违例归 observability；Chat 不把前端提示当作观测后端 truth。 |
| `projects/L6-bridges/*` | `parallel_sibling_boundary_reference` | 只作为外部平台映射边界参考；未停审设计不进入 Chat 的正式输入，不吸收 bridge mapping、外部事件或平台正文。 |
| `projects/L5-chat/README.md`、旧 `00~06` | `historical_material` | 只做污染审计和差异对照；旧框架、AG-UI 17、React/Svelte/Tauri/RN、指标和对象名不得直接继承。 |

## 5. 当前上游 blocker / gap

| ID | 来源 | 影响 | 当前处理 |
|---|---|---|---|
| `CHAT-UP-001` | `L0-sdk` 与各 owner 的 public surface 仍需按 Chat 消费场景逐项确认 | typed query / command / event adapter 不能凭旧 SDK 草案固化 | 在 Chat 校准中登记所需能力；未确认前保持 `pending / blocked`。 |
| `CHAT-UP-002` | `L1-conversation` change cursor、visibility、resume 与各 consumer scope 的精确消费合同仍需在 SDK surface 汇总 | group / channel / dm / thread 的实时更新、重连和历史分页无法宣称已接通 | 只记录消费意图、失败语义和所需 cursor；不复制 Conversation DTO。 |
| `CHAT-UP-003` | `L1-governance` Gate / Decision 命令结果、授权语境、幂等 receipt 和状态事件需经 SDK 暴露 | GateCard 只能显示，无法把点击直接当审批成功 | 使用 `submitted / confirmed / rejected / failed / unknown` 客户端状态；正向提交保持依赖阻塞。 |
| `CHAT-UP-004` | `L1-artifact` safe preview / reference / visibility contract 需明确 | Artifact 预览不能从引用猜正文或权限 | 只设计 ref / summary / preview unavailable 语义。 |
| `CHAT-UP-005` | `L1-workspace` safe view、freshness、attention、cursor 和 export contract 未完全闭合 | Inbox、跨项目摘要和本地恢复不能固化为上游 truth | 仅消费已正式提供的 view；缺失时显示 `unavailable / stale / blocked`。 |
| `CHAT-UP-006` | `L1-identity`、`L1-work`、`L2-member`、`L2-runtime` 的成员 / 项目 / 运行摘要层级需逐项对齐 | Member lens、项目进度和运行状态容易串权 | Chat 只保存安全展示快照和引用，不推断状态。 |
| `CHAT-UP-007` | `L4-observability` 前端交互观测与安全 handoff surface 未闭合 | Chat 不能直接订阅内部 bus 或把 UI 日志当 Observability truth | SDK 若无正式能力则保持 `blocked / deferred`；只记录低敏客户端事件意图。 |
| `CHAT-UP-008` | `L1-process` 整体/阶段流程、Gateway/分支状态、节点关联、版本与正式 SDK change/resume 消费面待确认；00 OPEN-CHAT-014 未明确 Process authority | 不能从 WorkItem、Runtime、原型图或分支颜色重建流程或判断汇聚 | Process owner 已辨明，正向 projection 未确认，保持 blocked；本轮不改 00/SDK/上游。 |
| `CHAT-UP-009` | Project/Conversation 绑定 owner、解除/撤销、公司目录 provider 与人类/AI人员覆盖及访问合同未确认 | 双向入口与三类成员可见性可能串权，身份摘要不能替代完整目录 | 继承 OPEN-CHAT-013/015，关系与目标访问独立验证；无正式 capability 保持 blocked/unavailable。 |

## 6. 恢复顺序

上游编号缺口 `CHAT-BASE-001`：00 §16 新增行引用 AC-NFR-CHAT-008～024，但 §14 只定义 AC-NFR-CHAT-001～007；01 仅引用已定义 AC-NFR001～007、NFR001～024 和 AC-FR011～014。该缺口 open，本轮不改已停审00。

任意后续“继续”或上下文恢复必须按以下顺序执行：

```text
1. 读取本文件 project_execution_ledger.md
2. 读取 design-calibration/07_implementation_plan_calibration_flow.md
3. 读取07当前Step与前序产物，再读必要03/04/05/06合同、配置、测试/证据与基线来源
4. 按当前07授权读取对应 SOP 与书写规范；代码实施未授权，保持not_started
5. 核对当前 Step、当前模块、gate_status、blocker 和下一动作
6. 只在项目级/文档级/Step级门禁允许且当前 Step 自检通过后创建下一 Step 文件
```

## 7. 当前下一动作

```text
正式07 Step1～13及全部planned实施台账已完成静态审计并停审；当前只等待用户审阅，不自动进入实现、安装或运行。后续获明确实施授权，先读implementation_execution_ledger→唯一current commit-01-a boundary→正式07 §3/6/7/9～12/对应校准及SDK/版本/source批准来源，固定真实approved含00～07 designcommit。
CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/AT/生产budget/version/source/release/quality/归档继续open/blocked。实现not_started；第一boundary blocked/wait_design，未来20planned/wait_until_current，全部actualgate blocked/actualwaiting。未实现、应用test、实施commit或readiness；本轮三笔设计提交已获授权，完成后停审，代码实施仍未授权。
```

## 8. 前置 draft 清单

| 文件 | 状态 | 作用 |
|---|---|---|
| `draft/01_项目作用与交互对象.md` | done | 收敛 Chat 的产品定位、UI/SDK 取舍、owner 边界和依赖裁剪。 |
| `draft/02_功能推演.md` | done | 推演四个核心能力、页面入口、状态语义、降级姿态和外围增强。 |
| `draft/03_模块划分与分层.md` | done | 推演共享客户端 core、SDK adapter、reducer、缓存恢复和跨平台 shell 分层。 |

## 9. Draft 平台决策记录

| 决策项 | 当前结论 | 状态 |
|---|---|---|
| V1 主平台 | Desktop-first；优先验证 Tauri Desktop shell 下的协作入口、GateCard、Artifact preview、草稿、重连和恢复。 | `accepted for draft` |
| Web | 保留 React/TypeScript shared UI，作为开发/预览和后续扩展面，不扩大 V1 交付范围。 | `candidate` |
| Mobile | 暂定 Capacitor 复用 Web UI；不作为 V1 前置，移动需求成熟后可重新评估 React Native 或其他方案。 | `temporary candidate` |
| 共享客户端 core | TypeScript view model、store、reducer、SDK adapter 和状态语义。 | `candidate` |

## 10. 03 Step3/4修正记录（2026-09-29）

用户“先修正”授权修复误判和不完整校准。已关闭虚假的TECH/CODE/LAYOUT blocker：现有TS规范与SDK真实package已确认，后置技术选型由Step3按已认可方向收敛，目标仓未创建不阻塞计划布局。先前Step3 blocked时创建Step4的顺序错误在产物诊断中保留；本次先删除重建Step3并pass，再删除重建Step4并pass。Step1/2同步改正承接措辞，03flow与本台账统一为Step4停审。

修正写入范围只有本项目03 Step1～4、03flow与本台账；不修改已停审正式00～02或旧formal03。所有实现文件/lock/测试源位置均planned；SDK skeleton不能视作formal消费可用，HOST/SDK/owner/storage集成blocker仍open。未创建实现仓、未安装、未build/run/test、未提交或生成真实证据。

## 11. 03已完成部分逐节重审记录（2026-10-01）

串行审查并原位修复03 Step1～6，Step7只同步现有§1～3兼容性。主要修复：当前00/01/02输入、Process owner、项目五标签与目录范围、十八planned布局路径、模块功能承接、七新增独立对象、三coordinator、页面/组件props、actor/source/target/request代次、source分区store与显式CAS检查、普通receipt不确认、图/列表/AT同安全拓扑、配置/测试切口与证据边界。

修改文件仅03七份Step中间产物、03flow、本台账共九份；未新建替代设计文档，未修改正式00～03、SDK、其他项目、原型或实现代码。静态核对通过围栏/标题、关键对象单一定义、TS成员命名及Rust注释分域；无build/run/test/验收结果。Step7未写批次仍waiting，未来03 Step8～19未创建；正式03仍historical_material，本轮至此停审，不提交commit。

## 12. Step5～10启动准备（2026-10-01）

用户新授权进入Step5～10，参考L1-governance同Step框架和粒度。已读取其模块主轴、对象模板/应用carrier/字段状态闭环、port读写/版本、协议分族、逐接口flow、状态筛选/图/矩阵及停审结构，计划写入03flow §7。

本次准备修改现有Step5、Step6、03flow和本台账四文件；未创建Step8～10或替代文档。Step5原位整理独立职责/测试/依赖/归属核对；Step6建立六批次carrier补齐计划并登记local设计缺口。外部SDK/Process/绑定/目录/host/durable blocker继续open。后续按6-A～F→Step7→8→9→10执行，全部完成后停审；未实现、未运行测试、不提交commit。

## 13. Step5～10完成与当前停点（2026-10-01）

在§12准备完成后，按用户新“同意，现在开始”连续授权串行完成Step6 6-A～F→Step7→Step8→Step9→Step10。参考L1-governance同Step职责/字段/ports/schema/flow/状态矩阵粒度，适配TS Desktop客户端；未复制后端truth/UoW/outbox/bus。Step5准备复核已通过，本轮承接。

本轮文件：03_ddd_step_06_object_contracts.md、03_ddd_step_07_trait_port_adapter_contracts.md原位修复；03_ddd_step_08_protocol_contracts.md、03_ddd_step_09_function_flows.md、03_ddd_step_10_state_matrix.md顺序新增；03_ddd_calibration_flow.md、本台账同步。仅projects/L5-chat/design-calibration/共七文件，不修改正式00～03、SDK、原型、其他项目，不创建新替代设计文档。

反向构造回查同步：前入口QualifiedEntryResolution/隐藏nullable字段、目录pageInfo/lineage、独立source消费slots与root entry/list/preview/capability/群聊关联slice、typed coordinator完整Input、Governance Gate/action去重、dispatch前reservation、repo保存currentfence防pending save复活、五Page.failLoad、Draft.releaseSubmission和Access.markUnavailable。local carrier缺口closed_design；上游全部保持blocked/open。

结果：Step8 43协议，Step9 43独立flow/图，Step10 17local主体/图和12canonical enum；逐批/逐模块/逐接口/逐机local设计停审及静态文档闭环核对完成。无应用测试、编译、运行或实现证据；仓级diff check中的前轮00/01 Markdown硬换行空格不在本轮修复范围。正式03仍historical_material，没有装配。

**当前stopped_after_step10**。下一步是用户审阅；没有Step11+连续授权，不继续。当获后续授权时先按恢复顺序读本台账→03flow→Step10→Step11 SOP/书写规范5.10/Governance Step11/必要SDK与host-storage合同。本轮不提交commit，所有实施仍not_started，04～07 waiting；implementation ledger与planned boundary skeleton仅正式07完成时创建。
