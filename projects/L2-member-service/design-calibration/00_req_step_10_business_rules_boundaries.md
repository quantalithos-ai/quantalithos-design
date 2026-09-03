# Step 10. 业务规则与边界约束

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 10
- 回填章节：`00-需求文档.md` §10（书写规范 4.10）
- 范围基线：当前版只支持以 `ProjectMemberRef` 为执行主语、以 `GlobalMemberRef` 为身份锚的项目型宿主；非项目型 launch fail closed
- 停审约束：本文件完成后停审；未经用户再次明确确认，不得创建 Step 11 或修改正式 `00-需求文档.md`

### 1.1 Step 内计划

- [x] 读取 SOP Step 10、书写规范 4.10、Step 02 / 07 / 09
- [x] 复核 `L2-runtime`、`L2-member`、`L2-member-images`、`L4-sandbox` 当前边界与停审状态
- [x] 按 `C-MS-1 -> C-MS-2 -> C-MS-3 -> C-MS-4 -> C-MS-5` 串行形成规则并逐节点停审
- [x] 补充跨节点 owner、正向合同、依赖类型和派生消费边界
- [x] 映射全部规则到功能需求或 Step 02 边界来源
- [x] 后置审计旧 `BR-001~005`，不继承固定数字、技术动作或旧 owner 假设
- [x] 完成孤儿、重复、冲突、串线、实现泄漏和 sibling readiness 审计

## 2. 本步输入与效力

| 输入 | 效力 | 本步使用方式 |
|---|---|---|
| 需求 SOP Step 10 / 书写规范 4.10 | current_standard | 固定规则类型、四列表结构、功能挂载、逐节点停审和跨节点审计门禁 |
| `00_req_step_02_position_boundary.md` | pass | 固定 control plane、host truth、runtime session、execution handoff 四层及仓际 owner 边界 |
| `00_req_step_07_core_capability_loop.md` | pass | 固定 C-MS-1~5、项目型-only 范围和正向 seam fail-closed 总则 |
| `00_req_step_09_functional_requirements.md` | pass | 提供 FR-MS-001~012、FR-MS-E01~E04；每条规则必须有功能或边界来源 |
| `L2-runtime` 正式 00~07 | current_formal_stopped | 本仓不得接管 run / goal / plan / memory / checkpoint、工具行动和 runtime outcome truth |
| `L2-member/00-需求文档.md` | current_formal_stopped | 正式消费请求 / 信号 / 报告与宿主接受 / registry / session / health 的需求级 owner 分工；字段和协议仍 pending |
| `L2-member-images` 正式 00 与当前台账 | requirement_boundary_formally_stopped；detailed_contract_pending | 正式消费 pinned entry 供给方向；不得把需求级方向升格为 exact manifest / handoff 合同或 readiness |
| `L4-sandbox`、`L2-tools` 当前正式边界 | current_formal | 本仓只拥有宿主级 binding 关联和编排结论；isolation truth 与逐动作 execute 外置 |
| ADR-0004 / ADR-0005、`L1-identity`、`L1-work` | accepted_or_current_formal | 固定项目型双锚、成员 / 项目 truth owner 与 pinned 镜像原则 |
| 旧 `00-需求文档.md` §6.2 / README | historical_material | 只在新规则独立形成后做污染审计，不继承旧规则编号或固定阈值 |

## 3. SOP 问题回答

1. 哪些不变量必须始终成立？

   回答：项目型双锚与正式意图来源、装配 owner/ref/freshness、实例绑定注册、分层健康、实例世代、清理与交接状态分层必须始终成立。

2. 哪些行为必须禁止？

   回答：禁止隐式创建或变更宿主、主语 fallback、Role 到镜像的本地解析、安全后端 fallback、凭据冒用或重放、迟到材料覆盖当前事实、心跳缺失直接等同 crashed、unknown 时盲重试，以及用 attempt 冒充外部完成。

3. 哪些变化必须显式发生？

   回答：意图受理和编排决定、装配与就绪结论、注册和会话失效、健康与失败分类、恢复 / 重启 / 终止决定、关联失效、对账处置都必须显式发生并保留历史。

4. 哪些边界不能被打穿？

   回答：identity / work / member / runtime / images / sandbox / governance / bus / observability 的 owner truth 不因宿主编排而转移；运行期、事件、ref、adapter 和 fake seam 不能伪装为源码依赖或真实集成。

5. 哪些操作必须附带治理、审计或引用条件？

   回答：本仓当前不拥有治理裁决，故不新建孤立的治理规则；关键决定、装配、注册、健康处置、清理、对账和交接必须具备正式引用与 body-free 审计关联。

## 4. 能力节点串行执行与停审

| 顺序 | 节点 | 规则范围 | gate_status | 停审结论 |
|---:|---|---|---|---|
| 1 | C-MS-1 宿主意图与执行主语 | BR-MS-001~007 | pass | 正式来源、项目型双锚、稳定决定与零隐式宿主成立 |
| 2 | C-MS-2 宿主装配与隔离就绪 | BR-MS-008~017 | pass | owner-safe 条件、pinned 资产、安全 binding 与 partial 非 ready 成立 |
| 3 | C-MS-3 注册与运行会话 | BR-MS-018~026 | pass | 实例绑定、活动关联唯一、member / host owner 分工与会话分层成立 |
| 4 | C-MS-4 健康、恢复与终止 | BR-MS-027~036 | pass | 四类失败分层、显式控制决定、unknown fence 与实例世代成立 |
| 5 | C-MS-5 清理、对账与事实交接 | BR-MS-037~045 | pass | 关联失效、attempt / cleanup / handoff 分层和历史保留成立 |
| 6 | 跨节点与外围审计 | BR-MS-046~050 | pass | pending 不伪造 ready、owner 不转移、依赖分类和派生只读边界成立 |

## 5. C-MS-1 规则：宿主意图与执行主语

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-001` | 不变量 | 每个正式宿主意图必须能回指正式来源、当前版支持的 `ProjectMemberRef` 执行主语及与其一致的 `GlobalMemberRef` 身份锚。 | 宿主意图与执行主语 |
| `BR-MS-002` | 边界约束 | ProjectMember、GlobalMember 及其关联的正式真相分别归 Work 与 Identity；本仓不得创建、修改、修复或反推这些领域真相。 | member-service / work / identity 边界 |
| `BR-MS-003` | 禁止行为 | 输入、引用、查询、信号或外部事实出现本身不得隐式创建、启动、停止、重启或迁移宿主。 | 宿主生命周期入口 |
| `BR-MS-004` | 显式变化 | 宿主意图的受理、拒绝、等待、无动作，以及 launch、stop、restart、relocate 等编排决定必须显式形成并可追溯。 | 意图受理与编排决定 |
| `BR-MS-005` | 不变量 | 等价意图在相同已提交宿主事实下必须得到稳定结论；未裁定冲突不得产生第二套并行生效的编排决定。 | 重试、重复与冲突决定 |
| `BR-MS-006` | 禁止行为 | 非项目型、主语不受支持或授权不可验证时，不得以 GlobalMember、Workspace view、默认 actor 或其他本地替代物降级放行。 | 当前版范围与 fail-closed |
| `BR-MS-007` | 审计约束 | 每个编排决定必须能回链意图来源、执行主语、身份锚、所依据的既有宿主事实和结论原因，且不得复制外部正文。 | 编排决定审计 |

节点停审：7 条规则均回指 FR-MS-001 / 002 或 Step 02；未写 command、handler、鉴权字段、事务或状态机。`gate_status = pass`。

## 6. C-MS-2 规则：宿主装配与隔离就绪

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-008` | 不变量 | 每项宿主装配条件必须具有可验证 owner、引用、适用 scope 与新鲜度；缺失、陈旧或冲突必须保持显式。 | 装配条件 |
| `BR-MS-009` | 边界约束 | 本仓只消费正式镜像供给方提供的 pinned 镜像引用及允许的安全材料，不解析 Role 到镜像映射，不拥有镜像内容、构建、发布或供应链证据 truth。 | member-service / member-images 边界 |
| `BR-MS-010` | 禁止行为 | mutable selector、不可验证、来源冲突或与当前装配条件不一致的镜像材料不得进入正向装配或就绪结论。 | 镜像装配输入 |
| `BR-MS-011` | 边界约束 | launch credential 的签发、撤销和凭据正文不归本仓；本仓只消费能绑定当前宿主实例并可验证有效性的正式结果。 | 凭据 owner 边界 |
| `BR-MS-012` | 禁止行为 | 不得跨宿主实例复用凭据，也不得用 owner unknown、已失效或无法验证的凭据形成 ready。 | 宿主凭据消费 |
| `BR-MS-013` | 边界约束 | 本仓只拥有宿主级 `SandboxBinding` 的装配关联与本地结论，不拥有隔离 backend、enforcement、policy、逐动作 execute 或外部 cleanup truth。 | member-service / sandbox / tools 边界 |
| `BR-MS-014` | 禁止行为 | 需要宿主级隔离时，binding 缺失、陈旧、失败或 unknown 不得通过 host fallback、旁路执行或默认后端降级。 | 宿主级隔离前置 |
| `BR-MS-015` | 不变量 | 宿主承载、正式镜像、所需挂载、凭据和适用 binding 等必要前置必须共同成立；任一部分成功不得替代整体就绪。 | 宿主装配就绪 |
| `BR-MS-016` | 显式变化 | 分项装配结果及整体 ready、blocked、degraded、unknown 结论必须显式形成；迟到结果不得隐式覆盖当前结论。 | 装配结果与就绪结论 |
| `BR-MS-017` | 审计约束 | 装配和就绪结论必须能回链正式条件引用、分项结果、缺口与决定来源，并保持安全、最小、body-free。 | 装配审计 |

节点停审：10 条规则均回指 FR-MS-003~005 或 Step 02；`L2-member-images` 正向合同仍 pending，故规则只锁消费边界，不伪造 manifest 字段或 ready。`gate_status = pass`。

## 7. C-MS-3 规则：注册与运行会话

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-018` | 不变量 | 注册来源必须同时匹配当前宿主实例、`ProjectMemberRef` 执行主语、关联身份锚和适用的正式凭据语境。 | 注册受理 |
| `BR-MS-019` | 禁止行为 | 不得冒用、重放或跨实例使用注册凭据；迟到、冲突或旧实例注册不得覆盖当前实例关联。 | 注册可信性 |
| `BR-MS-020` | 不变量 | 同一当前宿主实例的活动注册与接入关联必须唯一可判定；重复或并发输入不得形成互相冲突的当前关联。 | 活动注册与接入关联 |
| `BR-MS-021` | 显式变化 | 注册建立、替换、拒绝和失效必须显式发生，不得由进程存活、心跳出现或 endpoint 可达性隐式推导。 | 注册生命周期语义 |
| `BR-MS-022` | 边界约束 | `L2-member` 拥有注册请求、存活信号、状态报告及本地尝试；本仓拥有注册接受、endpoint registry、host session 与宿主健康判定。 | member / member-service 正式需求边界 |
| `BR-MS-023` | 不变量 | endpoint 与接入材料必须关联当前活动注册和宿主实例，并显式表达适用性与新鲜度；陈旧材料不得继续作为当前接入依据。 | endpoint 与接入可用性 |
| `BR-MS-024` | 边界约束 | 本仓只拥有 host session 壳及其宿主关联，不拥有 Runtime run、turn、goal、plan、memory、checkpoint、entry 或运行结果 truth。 | host session / runtime 边界 |
| `BR-MS-025` | 显式变化 | 宿主被替代或终结、注册失效时，当前 endpoint、接入与 host session 关联必须显式失效；旧关联历史不得被删除或改写。 | 接入与会话失效 |
| `BR-MS-026` | 审计约束 | 注册、替换、拒绝、失效和会话关联变化必须能回链来源、实例、主语与决定；迟到或冲突材料只能形成新的关联事实或 unknown。 | 注册与会话审计 |

节点停审：9 条规则均回指 FR-MS-006 / 007 或 Step 02；`L2-member` 的需求级 owner 分工已正式停审，字段、IPC、凭据形态和协议仍保持 pending。`gate_status = pass`。

## 8. C-MS-4 规则：健康、恢复与终止

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-027` | 不变量 | 健康判断必须保留信号来源、适用时点与新鲜度，并区分 host、session、backend 和 unknown 层级。 | 宿主健康与失败分类 |
| `BR-MS-028` | 禁止行为 | 心跳缺失本身不得直接等同 crashed、restart 或 terminate；进程存活本身也不得等同业务成功、Runtime 进度或隔离有效。 | 健康信号解释 |
| `BR-MS-029` | 边界约束 | Runtime 失败 / 进度 / checkpoint、Sandbox 隔离结果和承载后端事实各归其 owner；本仓只形成宿主侧分类与关联，不得压平为单一失败 truth。 | host / runtime / sandbox / backend 边界 |
| `BR-MS-030` | 显式变化 | 宿主健康结论和失败分类的建立、变化、恢复或 unknown 必须显式发生；迟到或冲突信号不得逆写当前结论。 | 健康与失败变化 |
| `BR-MS-031` | 不变量 | recover、restart、stop、terminate 或 hold 的决定必须基于正式意图、已提交宿主事实、失败分类和适用的外部前置。 | 恢复与终止控制 |
| `BR-MS-032` | 显式变化 | 恢复、重启、停止、终止、保持等待及决定替代必须显式形成；原始信号不得直接成为隐式控制动作。 | 宿主处置决定 |
| `BR-MS-033` | 不变量 | 重启或替代产生的新宿主实例必须具有可区分身份并关联旧实例；新事实不得改写旧实例历史。 | 宿主实例世代 |
| `BR-MS-034` | 禁止行为 | 外部副作用或提交结果 unknown 时不得盲重试、创建竞争宿主或升格为成功，必须保持 hold / blocked / unknown 语义。 | unknown fence |
| `BR-MS-035` | 边界约束 | 宿主重启、替代或恢复决定不等同 Runtime checkpoint 已恢复、运行已继续、Sandbox 已恢复或业务已接受。 | 恢复结果分层 |
| `BR-MS-036` | 审计约束 | 健康分类和宿主处置决定必须能回链相关信号、旧实例、决定来源、外部前置与已知结果，不保存运行或隔离正文。 | 健康与恢复审计 |

节点停审：10 条规则均回指 FR-MS-008 / 009 或 Step 02；未继承 `30s x 3`，未定义健康状态机、重试算法或 checkpoint 恢复动作。`gate_status = pass`。

## 9. C-MS-5 规则：清理、对账与事实交接

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-037` | 显式变化 | 宿主终结或被替代后，本地注册、endpoint、host session 与宿主级 binding 关联必须显式失效；外部结果未知时必须保留 gap。 | 下线关联失效 |
| `BR-MS-038` | 不变量 | cleanup / release 的本地决定、尝试、已知完成、gap 和 residual 必须保持可区分。 | 清理结果分层 |
| `BR-MS-039` | 禁止行为 | 发起清理、收到请求回执、等待超时或本地关联失效不得被解释为外部 cleanup completed，也不得据此删除历史。 | 清理完成语义 |
| `BR-MS-040` | 不变量 | 残留、孤儿和漂移必须保留与宿主实例及当前控制面事实的关联，直至形成显式处置；不得为消除差异而删除既有事实。 | 残留与孤儿对账 |
| `BR-MS-041` | 显式变化 | 对账的修复、保持、升级或 unknown 结论必须显式形成；查询、扫描或维护动作不得隐式创建、终结或改写宿主。 | 对账处置 |
| `BR-MS-042` | 边界约束 | 承载资源删除、Sandbox release / cleanup、Bus delivery、Observability observed 和下游 accepted truth 归各自 owner，本仓只保留本地关联与允许反馈。 | 外部完成 truth 边界 |
| `BR-MS-043` | 不变量 | 本地事实、handoff attempt、gap、delivered、observed 与 accepted 必须分层；外部交付或观测失败不得回滚已提交本地宿主 truth。 | 宿主事实交接 |
| `BR-MS-044` | 禁止行为 | 迟到、重复或冲突的外部反馈不得覆盖既有本地决定、清理或交接事实，只能形成新的关联事实或 unknown。 | 迟到反馈 |
| `BR-MS-045` | 审计约束 | 清理、残留、对账和交接必须形成 body-free、最小且可关联的记录，能说明本地来源、目的、尝试与缺口，不含 secret 或外部正文。 | 清理与交接审计 |

节点停审：9 条规则均回指 FR-MS-010~012 或 Step 02；未把 release attempt、Bus receipt 或 observed 状态伪造为本仓完成事实。`gate_status = pass`。

## 10. 跨节点与外围规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-MS-046` | 边界约束 | 任一正向 seam 尚未正式闭口时，受影响能力只能保持 pending、waiting、blocked、degraded、unknown 或 fail-closed，不得声明 ready。 | 全部正向跨仓合同 |
| `BR-MS-047` | 边界约束 | 外部 owner truth 不因本仓编排、缓存、关联、对账、派生或交接而转移；本仓不得补造外部 owner 的结论。 | 全仓 truth ownership |
| `BR-MS-048` | 边界约束 | compile、runtime、event、ref、adapter 与 fake seam 必须保持分类；运行期 / 事件 / ref 协作不得写成源码依赖，adapter 不转移 authority，fake 不证明真实集成。 | 依赖与可裁剪边界 |
| `BR-MS-049` | 边界约束 | LLM loop、goal / plan、memory / checkpoint、tool execution、capability registry、外部 MCP / A2A / API、member 主体、镜像内容 / 构建、Sandbox backend / policy、Governance approval、Observability backend 与 L1 领域 truth 不得并入 control plane 或 host truth。 | control plane / host truth 总边界 |
| `BR-MS-050` | 禁止行为 | 查询、聚合视图、诊断报告、容量建议、预热结果、forensic 材料或派生重建不得成为宿主事实写源，也不得隐式改变核心闭环结论。 | 外围增强与派生消费 |

外围停审：FR-MS-E01~E04 只受核心规则和 BR-MS-046~050 约束，不新增可反写 truth 的外围规则；外围失败不影响核心事实，也不伪造 readiness 或 forensic completeness。`gate_status = pass`。

## 11. 规则与来源映射

| 规则范围 | 主能力节点 | 功能 / 边界来源 | 保护结论 |
|---|---|---|---|
| BR-MS-001~002 | C-MS-1 | FR-MS-001；Step 02 四层与 identity / work 边界 | 项目型双锚和外部主体 truth 不转移 |
| BR-MS-003~007 | C-MS-1 | FR-MS-001~002 | 零隐式宿主、稳定决定和决定审计 |
| BR-MS-008~010 | C-MS-2 | FR-MS-003；Step 02 images 边界 | owner-safe 条件与 pinned 镜像消费 |
| BR-MS-011~014 | C-MS-2 | FR-MS-004；Step 02 credential / sandbox 边界 | 凭据实例绑定、binding 分层和禁止 host fallback |
| BR-MS-015~017 | C-MS-2 | FR-MS-004~005 | 必要前置共同成立、partial 非 ready 和装配审计 |
| BR-MS-018~022 | C-MS-3 | FR-MS-006；Step 02 member 边界 | 可信注册、活动关联唯一和正式 owner 分工 |
| BR-MS-023~026 | C-MS-3 | FR-MS-007；Step 02 runtime session 边界 | 当前接入、会话壳分层、失效与审计 |
| BR-MS-027~030 | C-MS-4 | FR-MS-008；Step 02 host / runtime / sandbox 边界 | 四类失败、信号解释和显式健康变化 |
| BR-MS-031~036 | C-MS-4 | FR-MS-009；Step 02 恢复边界 | 显式处置、实例世代、unknown fence 与恢复结果分层 |
| BR-MS-037~042 | C-MS-5 | FR-MS-010~011；Step 02 execution handoff 边界 | 关联失效、清理 / 对账分层和外部完成 truth 外置 |
| BR-MS-043~045 | C-MS-5 | FR-MS-012；Step 02 handoff 边界 | local-first 交接、迟到反馈和 body-free 审计 |
| BR-MS-046~049 | 跨节点 | FR-MS-001~012；Step 02 / 06 / 07 | pending、owner、依赖类型与总 owner 边界 |
| BR-MS-050 | 外围增强 | FR-MS-E01~E04；Step 02 | 建议、预热、forensic 与视图不得反写核心 truth |

映射审计：50 条规则全部至少回指一项 `FR-MS-*` 或 Step 02 边界；孤儿规则为 0。核心 FR-MS-001~012 均受多条硬规则保护；外围 FR-MS-E01~E04 均受 BR-MS-046~050 和对应核心规则约束。

## 12. Pending 对规则的影响

| Pending | 最新状态 | 当前规则口径 |
|---|---|---|
| MSVC-UP-001 runtime entry / session surface | open_boundary | BR-MS-024 / 029 / 035 / 046 只定义宿主侧关联，不定义 entry、run 或恢复成功 |
| MSVC-UP-002 member launch / register / heartbeat / status | requirement_boundary_formally_stopped；detailed_contract_pending | `L2-member` 正式 00 已停审，BR-MS-022 可正式采用 owner 分工；字段、协议、凭据形态与真实联调仍 pending |
| MSVC-UP-003 member-images pinned ref / manifest | requirement_boundary_formally_stopped；detailed_contract_pending | BR-MS-009 / 010 正式承接 pinned entry 消费和 fail-closed；manifest / verification schema 不闭口 |
| MSVC-UP-004 SandboxBinding / release | schema_pending | BR-MS-013 / 014 / 037~042 只锁宿主级关联与结果分层，不定义字段或逐动作 caller |
| MSVC-UP-005 policy 到宿主传递 owner | owner_pending | 不预建规则或功能；若 owner 落入本仓，必须重开 Step 04 / 07~10 |
| MSVC-UP-006 launch credential owner | owner_pending | BR-MS-011 / 012 / 018 / 019 只锁消费安全，不定义签发、撤销协议或正文 |
| MSVC-UP-007 Core schema / event family | schema_pending | BR-MS-046 / 048 阻止本地 shadow 与伪 ready，字段和事件后移 |
| MSVC-UP-008 SDK compile target / Server 自测 | design_pending | BR-MS-048 只锁依赖分类；准确 target 后移 01 / 03 |
| MSVC-UP-009 非项目型执行主语 | resolved_for_current_scope | BR-MS-001 / 006 固定项目型-only；未来纳入须先有正式主语并重开受影响 Step |

这些 pending 不阻止需求级硬规则成立，但持续阻止协议、字段、owner、adapter、集成和真实 readiness 被声明闭口。

## 13. 旧材料后置污染审计

| 旧规则 | 污染 / 缺口 | 当前处理 |
|---|---|---|
| BR-001 `30s x 3` 心跳失败即 crashed | 无当前 authority，把信号阈值直接压成失败状态 | 数字与直接迁移均不继承；BR-MS-027~030 改为来源 / 时点 / 四层分类和显式结论 |
| BR-002 Role 无 `image_variant` 即拒绝启动 | 旧路径让本仓直接解析 method-library truth | 不继承解析动作；正式 pinned 镜像引用不可验证时按 BR-MS-009 / 010 / 046 blocked |
| BR-003 Policy 30 秒内下发 | owner 与时延均未闭口 | 不进入当前规则；保留 MSVC-UP-005，数字后续无 authority 仍不得继承 |
| BR-004 容器重启即重签 launch_token | 把外部凭据 owner 与具体动作写入本仓规则 | 不继承重签动作；只保留当前实例绑定、不可跨实例复用与可验证消费边界 |
| BR-005 identity cache 延迟大于 5 分钟 warning | 以缓存实现和无来源数字定义规则 | cache 与数字均删除；只保留 owner / ref / scope / freshness 和 stale 显式语义 |

## 14. 跨节点审计与回填草稿

### 14.1 跨节点审计

| 审计项 | 结论 |
|---|---|
| 规则类型 | 不变量 13；禁止行为 11；显式变化 8；边界约束 13；审计约束 5；治理约束 0（当前无本仓拥有的治理动作） |
| 孤儿规则 / 未受保护核心功能 | 0 / 0 |
| 重复规则 | 无；节点规则保护各自主对象，BR-MS-046~050 只作跨节点总约束 |
| 规则冲突 | 无；本地 truth 与外部反馈、host session 与 runtime run、binding 与 isolation truth 均保持分层 |
| 跨能力串线 | 无；恢复不接管 checkpoint，装配不接管镜像 / sandbox truth，注册不接管 member 内部 truth |
| sibling readiness 伪造 | 无；member / member-images 均只消费已停审需求级边界，详细合同与正向 readiness 继续 pending |
| 实现泄漏 | 无接口签名、事件 schema、字段清单、异常码、事务、数据库约束、handler、repository、重试算法或固定阈值 |
| historical pollution | 无；旧编号、数字、cache、Role 解析、Policy proxy 和重签动作均未继承 |

### 14.2 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_10_business_rules_boundaries.md`

正式装配时采用 BR-MS-001~050 的四列规则表，并保留 §11 的能力级映射摘要。过程停审、pending 明细、旧材料审计和自检留在校准材料；风险在 Step 15 统一承接。不得在装配时新增规则、字段、协议或实现结论。

### 14.3 门禁自检

- [x] 50 条规则均具有编号、正式规则类型、规则内容和约束对象
- [x] 五个能力节点已按顺序逐一停审，外围与跨节点规则已单独审计
- [x] 每条规则均有功能或 Step 02 边界来源，无孤儿规则
- [x] 正向 pending、unknown、fail-closed 和外部 owner truth 分层完整
- [x] 未提前写数据归属表、接口协议、状态机实现、事务、配置、NFR、验收或实施方案
- [x] 未修改正式 `00-需求文档.md`，未创建 Step 11

结论：`gate_status = pass`，`current_state = stop_review`。下一步仅可在用户再次明确确认后读取 Step 11 SOP / 书写规范并创建 `00_req_step_11_data_ownership.md`。
