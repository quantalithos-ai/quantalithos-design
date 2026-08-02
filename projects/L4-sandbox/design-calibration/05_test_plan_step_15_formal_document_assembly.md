# Step 15. 整理正式测试方案文档

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/测试方案书写规范.md`
> 回填章节: 完整`projects/L4-sandbox/05-测试方案.md`
> 生成日期: 2026-07-13
> 状态: completed_current_closeout_v7.9
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 只把用户已确认的Step 1~14收口结论重组为正式15章测试方案,不新增测试语义,不生成真实run / artifact / EV /结果 /缺陷 /风险接受 /验收签署,不进入`06`。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 14 | 是。用户明确回复“同意”;本次只放行Step 15。 |
| 项目 /文档 /Step门禁 | 通过。项目台账和flow已转Step 15;Step 14主件 /分件为reviewed。 |
| 是否读取标准 | 是。已读取Step 15 SOP、测试方案完整书写规范、中间产物规范§5.10和真相源闭环标准。 |
| 是否读取装配输入 | 是。已复核Step 1~14及全部分件、正式`00~04`、L1-governance / artifact正式`05`与Step 15参考。 |
| 旧正式`05`定位 | historical material。旧`SandboxExecution / Session / Command / Output`、TC-001~012、dev / test / staging、Docker / gVisor / host和旧百分比 /阈值不得保留为当前事实。 |
| 当前上游blocker | 无。Step 14 metadata缺口已回写关闭;执行 /激活blocker不阻塞正式测试方案装配。 |
| 当前状态 | 批次15.1~15.8已完成:正式`05`已写入元信息与§1~§15,§5.10十类产物及全文机械审计通过;用户已明确确认并放行`06` Step 1。 |

### 1.1 Step内计划

| 计划项 | 状态 | 产物 /门禁 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料 /旧文档诊断 | done | §4 |
| 设计取舍 | done | §6 |
| 结构化装配映射 | done | §7 |
| 复杂度 /分批判断 | done | §8,8个批次 |
| 正式文档写入 | done | 15.1~15.8全部完成;正式§1~§15无占位 |
| 5.10与全文自检 | done | §9十类固定产物、§10全文机械审计与停审记录 |

## 2. 本步输入与装配事实边界

| 输入 | 状态 | 装配用途 |
|---|---|---|
| Step 1~5 | reviewed | §1~§5输入、范围、切口、分层和追溯 |
| Step 6主件 +5分件 | reviewed | §6 254条TC逐family可执行矩阵 |
| Step 7~10 | reviewed | §7~§10数据、环境、suite / gate和专项 |
| Step 11~12 | reviewed | §11~§12缺陷、复验和双门禁准则 |
| Step 13主件 +schema分件 | reviewed with Step 14 writeback | §13目录、九类schema、21 slot、runtime EV和review |
| Step 14主件 +residual分件 | reviewed | §14 trigger、scope、8 residual和下游门禁 |
| 正式`00~04` | current reviewed baseline | 正式名称 /字段 /状态 /协议 /配置真相源 |
| 旧README /旧`05/06` | historical only | 只做污染扫描,不得进入正文结论 |

事实成熟度必须统一写成`designed / planned_not_implemented / Blocked / NotEvaluated / NotRunConditional / inactive`,不得写implemented / tested / passed / accepted / released。

## 3. SOP问题回答

| 问题 | 装配答案 |
|---|---|
| 是否按15章主链 | 是,章节名严格使用书写规范§3,不得增删或错序。 |
| 是否保留全部P0对象 /场景 /数据 /环境 /门禁 /证据 | 是。38 CUT、254 TC family、28数据集、7 ENV / PROFILE、16 suite、7 gate、250 P0和21 slot均进入正文或稳定索引。 |
| 是否删除过程语气 | 是。问题回答、诊断、取舍、停审和自检只留本文件 /上游Step,正式正文只写收口结论。 |
| 未确认项如何处理 | 只进入§14 RR-SBX-001~008或§12 /§13执行blocker,不写成已接受。 |
| P0 TC能否回指详细设计 | 是。§3 /§5 /§6以CUT / CBC /正式协议、状态、错误和FDT为桥,分件保留逐TC详情。 |
| 是否清除旧名 / phase越界 | 是。旧五主线 /对象 /TC /环境 /阈值全部删除;Tools semantics、agent loop、member lifecycle继续排除。 |
| 能否被`06`直接消费 | 是。§12给退出事实要求,§13给fixed-run evidence,§14给residual / veto输入,但不做裁决。 |

## 4. 旧正式文档诊断

| 旧位置 | 冲突 | 正式装配处理 |
|---|---|---|
| §1 / §13旧五部分 | 使用SandboxExecution / Session / Command / Output / Control主线 | 全量替换为七模块、38 CUT和正式protocol / state / error / config边界 |
| §2旧分层 | unit / integration / event / E2E泛化,缺L5 candidate-real资格 | 替换为L1~L6与P0-C / P0-Q反替代模型 |
| §3 / §6 | 只有9条规则和TC-001~012 | 替换为正式C / FR / BR / AC / VF追溯与254 TC索引 |
| §4环境 | dev / test / staging + host runtime | 替换为ENV-01~07 / PROFILE-01~07,明确P05 blocked / P06 conditional / P07 inactive |
| §8自动化 | 6个口语suite且无固定run / schema | 替换为SUITE-SBX-001~016、7 gate、17脚本和Step 13 schema |
| §9 NFR | 100%、可接受阈值等无来源数字 | 只保留正式零容忍 /结构有界;量化性能转conditional |
| §12证据 | 路径待定且无真实性链 | 替换为fixed-run artifacts / reports、21 slot、runtime EV和pairing / redaction |
| 全文 | 混入Claude作者、旧日期、Accepted checkbox、实施暗示 | 重建元信息,明确designed baseline与0执行事实 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 权威输入 | 旧`02/03`叙事 | current reviewed `00~04` + Step 1~14 |
| 覆盖尺度 | 12条旧TC | 254条formal TC,237 P0-C +13 P0-Q +4 conditional |
| 隔离证明 | host / fake / staging混写 | deterministic P0-C与candidate-real P0-Q双门禁 |
| 数据 /环境 | 少量口语fixture和3环境 | 28数据集、13 builder类、7 ENV / PROFILE |
| 自动化 | 6口语suite | 16 formal suite、7 gate、17 planned脚本 |
| 证据 | 待定路径 /手写索引 | fixed-run九类schema、21 slot、runtime EV / digest / review |
| 回归 /风险 | 5条口语规则 /3风险 | 20 trigger、双轴scope、8 residual和不可接受项 |

## 6. 装配取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 正文粒度 | 保留可执行总矩阵 +分件稳定索引 | 把5900行Step全文粘贴;或压成短摘要 | 前者重复过程,后者无法落码 /执行 |
| 254 TC呈现 | family / range总表 +全部正式分件链接 | 正文复制254行;或只写总数 | 兼顾正式可执行性和审查长度 |
| schema呈现 | 正文给目录 / enum /关键字段 /digest,完整字段引用schema分件 | 正文省略schema;或复制275行 | `06/07`可直接定位,避免双写漂移 |
| 当前状态 | 全文planned / blocked / conditional明确 | 用checkbox打勾或写passed | 不伪造执行事实 |
| 旧正式文件 | 整体替换 | 局部编辑 | 旧编号 /对象 /环境污染面过大 |

## 7. 章节装配映射

| 正式章节 | 校准来源 | 正文必须保留 |
|---|---|---|
| §1 | Step 1 | 权威顺序、回答 /不回答、historical与blocker原则 |
| §2 | Step 2 | TG-SBX-01~11、P0-C /Q、P1 /P2、重点边界 /非范围 |
| §3 | Step 3 | 七模块 /对象、CUT-SBX-001~038、55协议 /状态 /错误 /配置闭集 |
| §4 | Step 4 | L1~L6、CUT分层、双门禁与E2E反替代 |
| §5 | Step 5 | 正向 /反向追溯、PER / EHR、成熟度与未覆盖项 |
| §6 | Step 6 +5分件 | 254 TC family、共用前置 /断言、逐family索引 |
| §7 | Step 7 | 28 DS、13 builder、复用 /替身 /隔离 /清理 |
| §8 | Step 8 | ENV / PROFILE、拓扑、依赖类型、不可用传播 |
| §9 | Step 9 +Step 14 writeback | 16 suite、7 gate、17脚本、fixed run与metadata |
| §10 | Step 10 | 六类NFR、安全四维、恢复 /观测、阈值来源 |
| §11 | Step 11 | S / A / B、L-R1~5、证据失效与风险接受边界 |
| §12 | Step 12 | ENT / QENT / EXT、250 P0、conditional与当前readiness |
| §13 | Step 13 +schema | 21 slot、九类schema、目录 /报告 /保留 /review |
| §14 | Step 14 +residual | 20 trigger、scope算法、8 residual、下游裁决 |
| §15 | Step 1~14 +标准 | 正式输入、全部校准产物、标准和下游承接 |

## 8. 分批写入计划

| 批次 | 正式范围 | 状态 | 批次完成检查 |
|---|---|---|---|
| 15.1 | 元信息 + §1~§2 +15章框架 | done | 15章标题 /来源块齐全;旧内容仅在historical排除语句中出现;handoff ID已按正式`TSH/FDT/AHG/EHR`校正;`git diff --check`通过 |
| 15.2 | §3~§4 | done | 38 CUT无缺号;55协议完整索引;状态 /错误 /配置闭集;L1~L6逐CUT责任、profile传播和双门禁齐全;`git diff --check`通过 |
| 15.3 | §5~§6 | done | 正反追溯与VF闭合;CUT / CBC / PER同序;14 family共254 TC=237 P0-C +13 P0-Q +4 conditional;38 CBC索引 /统一断言齐全;`git diff --check`通过 |
| 15.4 | §7~§8 | done | 28 DS全量;13类构造契约;替身 /隔离 /清理;7 ENV / PROFILE、compile / runtime / event依赖、配置域与Blocked传播齐全;`git diff --check`通过 |
| 15.5 | §9~§10 | done | 16 suite、7 gate、17 planned scripts、fixed-run路径 / metadata、六类NFR、零容忍 /结构有界 /conditional阈值齐全;`git diff --check`通过 |
| 15.6 | §11~§12 | done | S/A/B、L-R、ENT/QENT/EXT、250 P0、readiness与`git diff --check`通过 |
| 15.7 | §13~§14 | done | 21 slot、九schema、15 shared enum、20 RT、8 RR与`git diff --check`通过 |
| 15.8 | §15 +5.10 /全文自审 | done | 15章 /来源 /ID /状态 /证据 /historical污染审计通过;Phase / commit整体审计诚实标记`not_applicable_until_07` |

单批只写100~300行左右;批次是写入审查单位,不是正文长度上限。每批完成后更新本表与flow /台账恢复点。

### 8.1 批次15.1写入记录

| 检查项 | 结果 |
|---|---|
| full-restart替换 | 旧正式`05`已整体移除后重建,未在旧章节上追加新版内容。 |
| 正式装配范围 | 已写入文档元信息、§1、§2和§3~§15规范标题 /具体校准来源入口;未提前装配§3以后正文。 |
| §1输入边界 | 已固定正式`00~04`权威顺序、本文回答 /不回答、planned handoff成熟度、historical与execution /qualification blocker处理。 |
| §2范围边界 | 已固定TG-SBX-01~11、SCP-SBX-001~036分组、P0-C /P0-Q不可替代、PROFILE-01~07证明上限、相邻仓接缝与非范围owner。 |
| 命名检查 | 首稿误加的`TSH-SBX / FDT-SBX / AHG-SBX / EHR-SBX`已按上游正式编号纠正为`TSH / FDT / AHG / EHR`;未新增私有handoff ID。 |
| 污染扫描 | 旧对象、旧TC、旧环境、产品和旧阈值只出现在明确的historical排除语句中,未成为当前测试对象、环境或门禁。 |
| 机械检查 | 15章标题顺序正确;每章有具体来源块;Markdown表格抽查和`git diff --check`通过。 |

### 8.2 批次15.2写入记录

| 检查项 | 结果 |
|---|---|
| §3对象闭集 | 七模块、对象族、CUT-SBX-001~038、五类55协议、8状态批次 /30 owner-level state machines /31 Step 10 enum entries、38错误及TSH / FDT / VF / VETO / AHG / EHR边界已装配。 |
| §3可执行索引 | 38个CUT逐项保留正式来源、优先级、主发现层与最低验证要求;55协议完整列名,逐协议异常继续稳定引用Step 3 /6分件。 |
| §4分层闭集 | L1~L6定义、双门禁图、38个CUT主发现层 /强制补强层、高风险最早发现层、PROFILE-01~07传播与L6边界已装配。 |
| 数量 /命名检查 | CUT-SBX-001~038无缺号;Command 10、Query 13、Consumer 9、Event 13、Job 10名称与正式`03`一致。 |
| 成熟度检查 | CUT-034~036与PROFILE-05保持`Blocked`,PROFILE-06为`NotRunConditional`,PROFILE-07为`inactive`;未生成执行或资格事实。 |
| 机械检查 | 正式章节顺序未变;§5以后仍为来源骨架;污染词只在historical排除或禁止升格语句出现;`git diff --check`通过。 |

### 8.3 批次15.3写入记录

| 检查项 | 结果 |
|---|---|
| §5正向追溯 | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010、六类NFR与外围增强已按设计 /CUT /成熟度分组装配。 |
| §5反向追溯 | CUT-SBX-001~038、CBC-SBX-001~038、PER-SBX-001~038保持同序一一对应;EHR仍是planned requirement。 |
| §6用例契约 | 已固定ID、正式来源、前置、操作、正式结果、副作用、自动化、PER与成熟度规则。 |
| §6规模 /索引 | 14个TC family逐项给出正式范围、数量、主题、权威分件和成熟度;38 CBC逐项给出TC范围 /断言 /PER。 |
| 机械计数 | 五分件唯一TC机械汇总为254条:237 P0-C、13 P0-Q、4 conditional;14前缀均从001连续。 |
| 事实检查 | 全部TC仍为设计状态;未创建真实EV、artifact、report、run_id、pass / fail或签署。 |
| 机械检查 | 表格列数一致;章节来源块未变;ID污染扫描与`git diff --check`通过。 |

### 8.4 批次15.4写入记录

| 检查项 | 结果 |
|---|---|
| §7数据闭集 | B / E / X / C / R / Q六类、13类Fixture / Builder / Script契约及28个DS-SBX数据集已装配。 |
| §7执行边界 | 254 TC全覆盖、external seam替身证明上限、namespace隔离、rollback先断言后清理、P0-Q guard-first lab teardown已固定。 |
| §8环境闭集 | SBX-ENV-01~07与PROFILE-01~07一一绑定;用途、依赖、source / adapter、数据、隔离、成熟度和证明上限已装配。 |
| 依赖裁剪 | 仅`core-contracts`允许sibling compile依赖;runtime / event / handoff均保持port / fixture / controlled / candidate / real-like边。 |
| 配置覆盖 | S01~S08、I001~I101、D01~D44、NCFG / FC / XVAL按环境保留逐项coverage义务。 |
| 机械计数 | 正式正文机械提取28个唯一DS;13个构造器逐项出现;SBX-ENV-01~07 / PROFILE-01~07无缺号。 |
| 事实检查 | ENV-05保持`Blocked`,ENV-06保持`NotRunConditional`,ENV-07保持`inactive`;未创建环境实例或凭据。 |
| 机械检查 | ASCII拓扑中的`|`未被误作正式表格;真实表格列数一致;`git diff --check`通过。 |

### 8.5 批次15.5写入记录

| 检查项 | 结果 |
|---|---|
| §9 suite / gate | SUITE-SBX-001~016逐项职责、TC主归属、环境、触发、阻断和planned入口;GATE-SBX七类触发 /选择 /传播已装配。 |
| §9 scripts | 5 gate +3 report +9 check共17个planned script逐项固定输入责任和失败语义;全部`planned_not_implemented`。 |
| §9 fixed run | artifacts / reports / acceptance draft路径、最低status、`meta/context.json` intent / scope / trigger / change refs与no-latest规则已固定。 |
| §10专项 | 性能、可用性、安全、审计追溯、幂等一致性、可观测性六类NFR已装配;恢复 / lifecycle作为可用性与安全横切矩阵展开。 |
| 阈值边界 | 正式零容忍与结构有界进入P0;无产品 / workload / baseline的量化性能只为`NotRunConditional`,未继承旧数字。 |
| 机械计数 | 16 suite、7 gate、17 script唯一ID /路径均完整。 |
| 事实检查 | suite / script / CI /环境 / artifact均未实现或执行;P0-Q保持Blocked,PROFILE-06量化保持conditional。 |
| 机械检查 | fixed-run路径分工、表格列数、旧阈值 /伪结果扫描与`git diff --check`通过。 |

### 8.6 批次15.6写入记录

| 检查项 | 结果 |
|---|---|
| §11归因 /分级 | Failed / InfraFailed / Blocked / NotRunConditional / Passed与产品、测试基础设施、design-reopen、execution blocker、conditional residual已分离;S / A / B定义和升级规则已装配。 |
| §11不可降级 | VF-SBX-001~010、VETO-CFG-01~16、安全 / truth / evidence红线、16 suite及完整性check升级条件已进入正式正文。 |
| §11复验 /关闭 | L-R1~L-R5、变更面必跑集合、P0-Q identity完整重跑、生命周期、关闭材料、证据失效、风险接受和自动化补强已闭合。 |
| §12进入准则 | ENT-SBX-001~015、ENT-SBX-C01~C05和QENT-SBX-001~007共27项完整装配且全部未勾选。 |
| §12退出准则 | EXT-SBX-C01~C10、EXT-SBX-Q01~Q08和EXT-SBX-P01~P10共28项完整装配;250 P0 = 237 P0-C +13 P0-Q,4 conditional不得补偿。 |
| 状态真实性 | 目标仓、suite / gate / check、ENV-02~05和RELEASE保持Blocked;P0-C为NotEvaluated,P0-Q为Blocked / NotEvaluated,P1为NotRunConditional。 |
| 机械检查 | 稳定ID连续性、checkbox未勾选、S / A / B与L-R1~L-R5出现性、表格列数及`git diff --check`通过。 |

### 8.7 批次15.7写入记录

| 检查项 | 结果 |
|---|---|
| §13 identity / slot | planned ESLOT到real raw / report / checks、runtime EV、fixed-run index及新版`06`的派生链已装配;ESLOT-SBX-001~021逐项保留PER / CUT、TC / suite、AC / VF与成熟度。 |
| §13 EHR /目录 | EHR-01~20到slot / producer承接、machine artifact / human report / acceptance draft / independent review固定路径和四级报告成熟度已装配。 |
| §13 schema | 九类JSON schema、15个shared enum、required字段摘要、RFC 8785、SHA-256自身digest、path guard、forbidden carrier、失败保留与condition-based retention已装配。 |
| §14 trigger / scope | RT-SBX-001~020逐项最小集合、owner、升级 /重开条件及Targeted / Family / Suite / P0-C / P0-Q / Release / Conditional / DesignReopen效力已装配。 |
| §14 invalidation / risk | 既有结果失效矩阵、RR-SBX-001~008的owner / `pending_for_06` / condition expiry /关闭位置、不可接受项与`06/07/09`职责已装配。 |
| 事实边界 | 未创建真实run、artifact、report、EV alias、review、acceptance draft、风险接受或签署;P0-Q与release执行状态未改变。 |
| 下游路径回查 | 验收Step 10依当前测试 / 验收标准将`gate-summary.md`受控回写为固定`gate-results.md`,并同步planned writer名;不改本步装配计数、schema、状态或事实成熟度。 |
| 机械检查 | 21 ESLOT、20 RT、8 RR与源集合无差异;九schema /15 enum存在;表格列数、历史污染 /伪事实扫描及`git diff --check`通过。 |

### 8.8 批次15.8写入记录

| 检查项 | 结果 |
|---|---|
| 正式§15 | 已装配当前正式`00~04`、flow与Step 1~15全部主件 /分件、七项标准 / SOP /目录规范、17个planned工具、`06/07/09`承接和全文自审。 |
| §5.10固定产物 | 已形成真相源、字段、DTO / Event / Job构造、状态、Query view、Phase / commit、public protocol传递类型、命名、冲突与修正、正反例十类产物。 |
| Phase / commit真实性 | 正式`07`、implementation ledger和planned skeleton均不存在;只判定测试方案输入已准备,整体实施移交审计为`not_applicable_until_07`。 |
| 同源差集 | 正式`03`与正式`05`的55协议零差异;31个 Step 10 canonical status enum entries与STA零差异;38 typed error与ERR零差异。 |
| 规模 /连续性 | 14 family共254 TC均从001连续;38 CUT / CBC / PER闭合;28 DS、7 ENV / PROFILE、16 suite、7 gate、17 script、21 ESLOT、九schema、15 shared enum、20 RT、8 RR完整。 |
| 来源 /结构 | §1~§15顺序完整且有15个校准来源块;正式§15引用的现有Markdown文件均存在,唯一缺失`07`是明确登记的future gap。 |
| 准则真实性 | 27项进入 +28项退出共55个checkbox全部未勾选;无runtime EV alias、静态run ID、实现commit、结果、风险接受或签署。 |
| Markdown /污染 | fenced-aware表格检查70张表无列错;旧名 /旧TC /旧环境只位于historical或禁止语句;`TODO/TBD/占位`为空;项目范围`git diff --check`通过。 |

## 9. 中间产物规范§5.10跨文档一致性复核

本节是测试方案收口阶段的固定审计产物。它只检查当前正式`00~05`与已审查Step之间是否闭合,不把汇总表升格为新的对象 /协议 /状态真相源。字段、variant或函数细节与本节冲突时,仍以正式`03/04`及其对应校准产物为准;测试侧必须回写修正,不得让实现者自行选择。

### 9.1 真相源表

| 设计事实 | 真相源文档 | 章节 /中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| sandbox职责、重点边界、非范围、C / FR / BR / AC / VF | 正式`00-需求文档.md` | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010 | `05/06/07` | 旧README /旧`05/06`冲突时以正式`00`为准;测试不得引入tools semantics、agent loop或member lifecycle。 |
| 独立truth center、依赖方向、数据所有权、no weak fallback | 正式`01-架构设计.md` | 架构边界、运行承载、依赖裁剪和安全红线 | `03/04/05/07` | 产品名、host fallback或相邻仓直连线索不能覆盖正式架构。 |
| 代码主体、主要组成部分、接口骨架、flow /状态摘要 | 正式`02-概要设计.md` | 六个主要组成部分、关键对象、12类flow和六组状态 | `03/05/07` | 与旧五段主线冲突时以正式`02`为准。 |
| Domain对象、字段、构造函数、owner | 正式`03-详细设计.md` | §5~§6;`03_ddd_step_06_object_contracts.md` | CUT、TC、fixture、实现 | 字段缺失或owner不清必须回写`03` Step 6,不得由`05`补字段。 |
| Port / repository / adapter callable surface | 正式`03-详细设计.md` | §6;`03_ddd_step_07_trait_port_adapter_contracts.md` | service / integration TC、fake parity | TC不得调用未开放的mutating surface;发现缺口回写`03` Step 7。 |
| 10 Command、13 Query、9 Consumer、13 Event、10 Job及public carrier | 正式`03-详细设计.md` | §7;`03_ddd_step_08_protocol_contracts.md` | CTR / CMD / QRY / CNS / EVT / JOB TC | 协议名、DTO或传递类型不一致时回写`03` Step 8;测试别名无效。 |
| 55个函数级flow、副作用顺序和no-write / no-repair / no-rollback | 正式`03-详细设计.md` | §8;`03_ddd_step_09_function_flows.md` | service / transaction / recovery TC | TC不得调整UoW顺序或把副作用失败改成owner truth回滚。 |
| 8批、30 owner-level state machines、31个 Step 10 canonical status enum entries | 正式`03-详细设计.md` | §9;`03_ddd_step_10_state_matrix.md` | STA-001~031及关联TC | 同名variant只在owner内解释;旧状态或口语状态不得进入断言。 |
| persistence、UoW、version、cursor、幂等与38错误 | 正式`03-详细设计.md` | §10~§12;Step 11~13 | TXN / RACE / ERR TC | fake必须保持语义parity;错误不得按string匹配;cursor / version / key不得混用。 |
| 配置source、PROFILE、I001~I101、40组、D01~D44、FDT / VETO | 正式`04-配置设计.md` | §5~§14;`04_config_step_12_downstream_handoff.md` | CFG / ARCH / CONF / COND TC | `05`只验证既有配置契约;动态source、reload、hot等future surface先重开`03/04`。 |
| 38 CUT、38 CBC、38 PER与254 TC | 正式`05-测试方案.md` | §3 /§5 /§6;Step 3 /5 /6及5个分件 | suite / gate / `06/07` | 正式正文与分件冲突时暂停装配并修正Step /正文;不得改分母掩盖缺口。 |
| 28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本 | 正式`05-测试方案.md` | §7~§9;Step 7~9 | 测试实现、CI与运行前检查 | 全部为planned contract;目标仓或实例不存在不能改写为available。 |
| 21 ESLOT、九schema、fixed-run目录与runtime EV派生规则 | 正式`05-测试方案.md` | §13;Step 13主件 /schema分件 | report tooling、新版`06` | ESLOT不是EV;无raw / report / checks不得分配alias或生成验收结论。 |
| 20 RT、8 RR、失效 /重跑 /风险边界 | 正式`05-测试方案.md` | §14;Step 14主件 /risk register | `06/07/09` | 未接受风险保持`pending_for_06`;不可接受项不能被`07/09`豁免。 |
| 最终验收裁决 | 新版`06-验收标准.md` | 当前尚未重建 | release / implementation | 旧`06`只作historical material;当前不得引用其checkbox或签署为事实。 |
| phase / commit boundary及实施台账 | 未来正式`07-实施计划.md` | 当前文件不存在 | implementation agent | 当前只提供测试输入;不得预造boundary ID、ledger、commit或通过状态。 |

### 9.2 字段闭环表

为避免复制正式对象schema形成第二真相源,下表按可构造对象组列出测试必须观察的字段闭集;逐字段类型和factory签名继续引用`03_ddd_step_06_object_contracts.md`及`03_ddd_step_08_protocol_contracts.md`。

| Domain对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `ControlledExecutionContext` | context / responsibility / intake字段组 | typed refs + `ControlledExecutionIntakeStatus` | command metadata、actor context、resolver safe summary、id / clock | open pending + accept / reject / unresolved | context command / result / changed event | validation、unresolved或rejected;不得补造identity | CMD-001/002;STA-001;ERR-014/015 | ESLOT-SBX-002 planned;新版`06`裁决 |
| `ExecutionEnvironmentIdentity` / `ReferenceResolutionState` | identity / source / tracked refs / resolution字段组 | typed refs + identity / resolution status | caller / work / runtime / tool safe refs、resolver、trusted event | identity factory / reference update | context command;reference consumers / refresh job | missing / stale / conflict -> pending、delayed、rejected或degraded | STA-002/003;CNS-001~012;JOB-002 | ESLOT-SBX-002/010 planned |
| `BoundaryRequirementSet` / `BoundaryEstablishmentDecision` / `CoherentBoundary` | resource / filesystem / network / process / workspace / coherence字段组 | 五维typed carrier + boundary status | accepted context、matching identity、explicit request requirements、builder-injected profile / template / runtime generation、capability summary | requirement / decision / coherent boundary factories | boundary command / result / event / view | 任一维缺失、identity / generation不匹配、stale、unsupported或partial ->整体Rejected / Failed / Blocked;不得读取后序policy | CMD-003/004;STA-004~006;CONF-001~006 | ESLOT-SBX-003/017 planned |
| `IsolationEnvironmentHandle` / `LeaseRecord` / orphan state | handle / backend / lease window / lifecycle字段组 | typed refs + handle / lease / orphan status | generation-scoped backend establishment outcome、clock、I065 frozen lease profile、inspect marker | handle / lease / recovery factories | boundary result;run exact-read guard;backend lifecycle consumer;reaper job | unavailable -> pending / failed;run不得重算lease window;non-Allowed guard时release=0 | STA-007~009;JOB-005;CONF-007/009 | ESLOT-SBX-003/006/018 planned |
| `PolicyApplicabilitySnapshot` / `PolicyExecutionDecision` / `HighRiskActionDecision` | summary refs / decision / high-risk字段组 | typed refs + policy statuses | body-free policy / authorization summaries与guard | policy decision factories | policy command / result / event / view | missing / stale / conflict / unknown -> fail-closed,不得allow | CMD-005/006;STA-010~012;QRY-005/006 | ESLOT-SBX-004 planned |
| `ControlledExecutionRun` | run / context / boundary / policy / handle / status字段组 | typed refs + `ControlledExecutionRunStatus` | accepted context、coherent boundary、active handle、active non-expired persisted lease、accepted policy、launch outcome | run start / control / failure transitions | run command / result / event / execution view | 任一exact-ref / owner / active / expiry / policy guard不满足则backend call=0;launch失败不得伪Running / Completed | CMD-007/008;STA-013;CONF-007 | ESLOT-SBX-005/018 planned |
| `CaptureFact` / `CapturedMaterialRef` | capture / run / status / material / observability字段组 | body-free refs + `CaptureFactStatus` | capture adapter safe outcome | complete / partial / failed factory | capture command / result / event / view | raw body或关系缺失 -> reject / failed / degraded;不得升格artifact truth | CMD-009/010;STA-014;QRY-007/008;CONF-008 | ESLOT-SBX-005/015/018 planned |
| `HandoffFact` | handoff / capture / target / status / receipt字段组 | typed refs + `HandoffFactStatus` | capture truth、target binding、adapter / feedback | open / feedback transition | handoff command / event / consumer / view | mismatch quarantine;retryable / failed不回滚capture | CMD-011/012;STA-015;CNS-013~016;QRY-009/010 | ESLOT-SBX-005/009 planned |
| `FailureClassification` / `ControlFact` | failure / source / control / status字段组 | typed refs + failure / control enums | policy、backend、capture、handoff、control、redline markers | classifier / control factory | failure / control commands / events / view | unknown保持pending;conflict reject;不得执行runtime recovery | CMD-013~016;STA-016/017;QRY-011/012 | ESLOT-SBX-006/012 planned |
| `CleanupGuard` / `RedlineContainment` | guard / evidence / redline / investigation / containment字段组 | typed refs + cleanup / redline status | capture、handoff、investigation、redline truth | evaluator / containment factory | cleanup / redline commands / events / view / jobs | non-Allowed或active redline时release=0;缺调查保持pending / blocked | CMD-017~020;STA-018/019;JOB-006/007;CONF-009/010 | ESLOT-SBX-006/018 planned |
| `SandboxReadProjection` / `DerivedInspectPreviewTrendState` / reconciliation report | projection / source / freshness / finding字段组 | typed refs + read-side statuses | committed snapshot、projection / derived / report repositories | rebuild / maintain / reconcile jobs | 13 query views;projection / derived / finding events | missing / stale / failed显式surface;Query不得rebuild / repair | QRY-001~026;STA-020~023;JOB-008~010 | ESLOT-SBX-007 planned |
| `SandboxEventRelayRecord` / `SandboxAuditTrace` | source truth / cursor / relay / trace字段组 | typed refs + cursor + relay / trace enum | committed UoW、payload / audit mapper | relay append / trace append | outbound envelope / consumer feedback / relay job | append失败随source tx回滚;publish失败不回滚source;raw detail禁止 | EVT-001~015;STA-024;CNS-021/022;JOB-001 | ESLOT-SBX-009/015 planned |
| `SandboxIdempotencyRecord` / `SandboxStoredOperationResult` | operation / key / digest / stored result / status字段组 | typed refs + digest + status | Command / Consumer / Job metadata与canonical request | reserve / complete / replay | command result / receipt / job report | same key不同digest conflict;stored result缺失不得重算 | CTR-003/004;STA-025~028;TXN-007~012 | ESLOT-SBX-010/011 planned |
| runtime config / adapter availability state | profile / generation / adapter / runtime status字段组 | config refs + availability / runtime status | strict source、validator、builder、adapter health | candidate build / atomic publish | config summary、entry binding、safe report | invalid / partial -> StartupBlocked;Degraded不得放宽hard guard | CFG-001~030;STA-029/030;ARCH-001~003 | ESLOT-SBX-013~016 planned |

### 9.3 DTO / Event / Job到Domain对象构造闭环表

| 输入契约 | 目标Domain对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 关联处理流 /测试 |
|---|---|---|---|---|---|---|
| 10个Command request -> `SandboxCommandResultDto` | context、identity、boundary、policy、run、capture、handoff、failure、control、cleanup、redline及stored result | 是;10 /10协议与20个CMD正反case同源 | id / clock、repository lookup、resolver、policy / backend / handoff port | idempotency key != object ref;expected version != cursor;trace ref != truth ref | reject / pending / fail-closed / failed / rollback;accepted / rejected / failed result均可存储 | `03` Step 9 Command flows;CMD-001~020;TXN-001~014 |
| 13个Query request -> response view / page | projection、truth snapshot、derived / audit read model;不构造mutable core truth | 是;13 /13各有visible / empty / degraded及no-write case | repository lookup、visibility resolver、projection marker、page mapping | page cursor != source cursor;view ref != mutable version;missing ref不得scan latest | Empty / NotVisible / Restricted / Stale / Degraded / MissingProjection / Unavailable;write=0 | `03` Step 9 Query flows;QRY-001~026 |
| 9个Inbound Event envelope -> receipt及reference / handoff / control / relay状态 | reference state、handoff feedback、control input、relay feedback、stored receipt | 是 if envelope与typed payload合法;9 /9协议有22个CNS case | source authority、schema、dedup key、payload digest、UoW marker cursor | source event ref != dedup key / local relay ref;trusted source != bypass | duplicate replay;unavailable delayed;invalid / forbidden quarantined;不得写guessed truth | `03` Step 9 Consumer flows;CNS-001~022 |
| 13个Outbound Event payload -> stored envelope / relay record | committed truth / reference / projection / derived / report snapshot | 是;13 /13 payload另有family-match与relay case | committed source cursor、trace context、payload builder、event id | event id != source object id;payload ref != body;source cursor != page cursor | source tx append失败回滚;publish retry / dead-letter不回滚source truth | `03` Step 9 Relay flows;EVT-001~015 |
| 10个Operations Job input -> maintenance object / stored report | relay、reference / capability、handoff、lease / cleanup / redline、projection / derived / reconciliation | 是;10 /10 job有selection、item result、partial与replay case | job metadata、scope、page、repository selection、port outcome、clock | job run ref != idempotency key;internal `JobReportStatus` != public `SandboxJobReportStatus`;report != evidence | invalid / empty / skipped / partial / degraded如实保存;duplicate返回stored report且0 target call | `03` Step 9 Job flows;JOB-001~012;TXN-009~011 |

机械集合审计确认正式`03`与Step 6的协议名完全一致:10 Command、13 Query、9 Consumer、13 Event、10 Job,合计55 /55。required / missing / wrong-family、duplicate / conflict、retry / partial、safe surface和owner side effect均有formal TC;逐字段schema仍由`03_ddd_step_08_protocol_contracts.md`唯一拥有。

### 9.4 状态闭环表

| 状态批次 /正式enum | 产生函数 /owner | 合法迁移要求 | 代表性禁止迁移 | 测试用例 | Planned证据 |
|---|---|---|---|---|---|
| 10.1: `ControlledExecutionIntakeStatus`;`ExecutionEnvironmentIdentityStatus`;`ReferenceResolutionStatus` | context / identity factory与resolver / consumer | pending / active / resolution outcome按owner单调演进 | rejected / closed / invalidated不得复活;conflicted / unavailable不得猜Resolved | STA-001~003;CMD-001/002;CNS-001~012 | ESLOT-SBX-002 |
| 10.2: `BoundaryDecisionStatus`;`BoundaryCoherenceStatus`;`BackendCapabilityStatus`;`IsolationHandleStatus`;`LeaseStatus`;`OrphanRecoveryStatus` | boundary / handle / lease / reaper owner | 四维同代coherence、guard-first release、orphan正式恢复 | stale / unsupported直接Established;partial -> Coherent;Released -> Active | STA-004~009;CMD-003/004;JOB-005;CONF-001~010 | ESLOT-SBX-003/017/018 |
| 10.3: `PolicyApplicabilityStatus`;`PolicyExecutionDecisionStatus`;`HighRiskActionDecisionStatus` | policy snapshot / decision factories | applicable / fresh / authorized才可Accepted / Allowed | missing / stale / conflicted / unsupported -> Accepted / Allowed | STA-010~012;CMD-005/006 | ESLOT-SBX-004 |
| 10.4: `ControlledExecutionRunStatus`;`CaptureFactStatus`;`HandoffFactStatus`;`HandoffTargetProgressStatus` | run / capture / handoff owners | preparing -> running -> terminal;capture `record` immutable;opening建完整progress set且0外呼;per-target attempt-before-call;聚合机械派生 | terminal run复活;capture使用Pending / 原地改Complete;跳过Attempting;同attempt重发;handoff失败回滚capture | STA-013~015/031;CMD-007~012 | ESLOT-SBX-005 |
| 10.5: `FailureClassificationStatus`;`ControlFactStatus`;`CleanupGuardStatus`;`RedlineContainmentStatus` | failure / control / cleanup / redline owners | formal source、single control、Allowed guard、containment / investigation链 | unknown -> success;conflict双应用;non-Allowed release;redline advisory-only | STA-016~019;CMD-013~020;JOB-005~007 | ESLOT-SBX-006/018 |
| 10.6: `QueryAccessStatus`;`SandboxProjectionStatus`;`DerivedFreshnessStatus`;`ReconciliationReportStatus` | query surface、projection / derived / report owners | stale -> rebuild -> fresh由job完成;read side如实degraded | Query触发rebuild / repair;derived failure改core truth;scope scan latest | STA-020~023;QRY-001~026;JOB-008~010 | ESLOT-SBX-007 |
| 10.7: `SandboxEventRelayStatus` | relay append / publisher exact-attempt observation | pending / retryable -> published / failed / dead-letter等finite status | terminal重开;unknown猜状态;同attempt重发;publish失败回滚source truth | STA-024;EVT-015;CNS-021/022;JOB-001 | ESLOT-SBX-009 |
| 10.8: `IdempotencyRecordStatus`;`StoredResultStatus`;`ConsumerReceiptStatus`;`JobReportStatus`;`AdapterAvailabilityStatus`;`RuntimeConfigStatus` | reserve / stored replay、consumer、job、builder / adapter owner | reserve -> complete / conflict;formal receipt / report;valid generation原子发布 | duplicate重跑;missing result重算;partial report写Succeeded;Degraded放宽hard guard | STA-025~030;TXN-007~012;CFG-001~030 | ESLOT-SBX-010/013 |

31个 Step 10 canonical enum entries与STA-001~031逐项一一对应且无缺号。测试中internal `JobReportStatus`的owner状态必须显式映射到public `SandboxJobReportStatus`;两者不是同一类型,不得合并、互相替代或让public DTO泄露domain-only enum。

### 9.5 Query response / view闭环表

| Query | Response DTO / View | 关键字段来源 | empty / not visible / degraded口径 | public id / ref规则 | 测试覆盖 |
|---|---|---|---|---|---|
| `GetSandboxExecutionStatus` | `SandboxQueryResponseDto<SandboxExecutionStatusViewDto>` | context / run / capture snapshot + projection marker | missing -> Unavailable;越scope -> NotVisible;stale显式 | context / view refs来自request / snapshot,不得重构 | QRY-001/002 |
| `GetBoundaryStatus` | `SandboxQueryResponseDto<BoundaryStatusViewDto>` | boundary decision、capability ref、handle / lease truth | missing index -> MissingProjection;stale capability -> Degraded | boundary ref来自truth /正式index;不scan store | QRY-003/004 |
| `GetPolicyDecisionSummary` | `SandboxQueryResponseDto<PolicyDecisionSummaryViewDto>` | policy decision truth + safe summary refs | missing / stale / unavailable显式且fail-closed不变 | policy ref来自truth;不读取DSL / approval body | QRY-005/006 |
| `GetCaptureSummary` | `SandboxQueryResponseDto<CaptureSummaryViewDto>` | capture truth + body-free material refs | no capture -> Empty;terminal run缺capture -> Degraded | capture / material refs不指向正文 | QRY-007/008 |
| `GetMaterialHandoffStatus` | `SandboxQueryResponseDto<MaterialHandoffStatusViewDto>` | handoff truth + feedback / relay markers | missing / pending / retryable / failed如实 | handoff ref来自truth / index;不retry | QRY-009/010 |
| `GetFailureControlStatus` | `SandboxQueryResponseDto<FailureControlStatusViewDto>` | failure / control / lease snapshots | missing -> Empty / Unavailable;unknown非success;restricted不泄露 | failure / control refs来自truth | QRY-011/012 |
| `GetCleanupReadiness` | `SandboxQueryResponseDto<CleanupReadinessViewDto>` | cleanup guard、capture / handoff / investigation markers | missing projection / pending evidence / blocked显式 | guard ref来自truth;Query不evaluate或release | QRY-013/014 |
| `GetRedlineContainmentStatus` | `SandboxQueryResponseDto<RedlineContainmentViewDto>` | redline truth + investigation summary | missing / restricted / handoff pending / degraded显式 | containment ref来自truth;Query不release | QRY-015/016 |
| `GetSandboxReadProjection` | `SandboxQueryResponseDto<SandboxReadProjectionDto>` | projection repository + committed source cursor | MissingProjection / Rebuilding / Stale / Degraded显式 | projection ref来自repository key;source cursor不是page cursor | QRY-017/018 |
| `GetDerivedInspectPreviewTrend` | `SandboxQueryResponseDto<DerivedInspectPreviewTrendViewDto>` | derived repository + body-free source refs | Empty / Stale / Failed / Degraded显式 | derived ref来自repository;不得升格execution truth | QRY-019/020 |
| `GetBackendCapabilityComparison` | `SandboxQueryResponseDto<BackendCapabilityComparisonViewDto>` | capability reference / comparison projection | stale / unavailable -> Stale / Unavailable / Degraded | comparison ref来自projection;不代表资格或allow | QRY-021/022 |
| `GetSandboxReconciliationReport` | `SandboxQueryResponseDto<SandboxReconciliationReportDto>` | immutable report repository + formal index | no index -> Validation / Empty;degraded report如实 | report ref来自正式index;scope-only不得猜latest | QRY-023/024 |
| `GetSandboxAuditTrace` | `SandboxPagedResponseDto<SandboxAuditTraceItemDto>` | audit repository + stable sort + page mapping | empty page / Restricted / invalid cursor显式 | page cursor opaque且不等于truth cursor / version | QRY-025/026 |

13 /13 Query均有一条主要可见路径和一条missing / restricted / stale / degraded路径,并统一断言write UoW、refresh、rebuild、retry、cleanup、release与audit append调用为0。测试不创建临时view ref、projection ref或“latest”selector。

### 9.6 Phase / commit boundary闭环表

正式`07-实施计划.md`、implementation ledger和planned boundary skeleton当前均不存在。因此本表只审计`05`是否已为未来boundary准备可引用的测试输入,不定义正式Phase / commit ID、顺序、提交范围或通过状态;待新版`06`完成且进入`07`时,必须对正式`03/05/06/07`逐boundary重做本表。

| Future boundary subject | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试输入 | 验收输入 | 当前结论 |
|---|---|---|---|---|---|---|---|
| workspace / contracts scaffold | 目标仓precheck、workspace、7 crate、typed refs、metadata、DTO / enum / schema | domain mutation、route产品绑定、真实backend | 正式`03` §3~§7;`04`依赖规则 | 不得用future implementation或evidence定义schema | CTR-001~006;ARCH-001~003;SUITE-001/003/011 | AC-031/034/035/040;VF-005/009 | 测试输入已准备;boundary未定义 |
| domain objects / states / invariants | objects、31 Step 10 enum entries、合法 /禁止迁移、cleanup / redline guard | repository物理实现、entry、backend产品 | 正式`03` §5 /§6 /§9 /§11 | 不得由infra fake定义domain状态 | STA-001~031;ERR适用;SUITE-002/010 | AC-001~023 /026~030 /037~041适用;VF-001~010 | 测试输入已准备;boundary未定义 |
| application Command / Query services | 10 Command、13 Query、UoW、stored result、fail-closed、no-write | durable store、真实transport、真实隔离 | 正式`03` §7~§12;`04` runtime summary | 不得依赖后续adapter决定flow顺序或状态 | CMD-001~020;QRY-001~026;TXN-001~014;ERR适用;SUITE-004/007/010 | AC / VF按§5追溯;ESLOT-SBX-002~007/010~012 | 测试输入已准备;boundary未定义 |
| worker relay / consumers / jobs | 9 Consumer、13 Event、10 Job、dedup、receipt、relay、partial report、no-repair | 相邻仓内部语义、runtime agent loop、member orchestration | 正式`03` §7~§12;正式seam | 不得以真实bus或下游服务补协议缺口 | CNS-001~022;EVT-001~015;JOB-001~012;SUITE-005/006/011/012 | AC / VF按§5;ESLOT-SBX-008/009 | 测试输入已准备;boundary未定义 |
| repositories / UoW / adapters / config builder | fake / durable parity、version / cursor、atomic generation、failure mapping | 修改public DTO或domain invariant、weak fallback | 正式`03` §10~§13;正式`04` | 不得依赖后续entry放宽invalid / partial generation | TXN / RACE / CFG / ERR / ARCH;SUITE-003/007~010/014 | ESLOT-SBX-011~016;新版`06`待裁决 | 测试输入已准备;physical product仍开放 |
| candidate backend qualification | PROFILE-05 fixed identity、四维真实限制、lifecycle / capture / cleanup / redline、anti-substitution | host / fake / fixture、其他candidate、P06 / production | candidate、capability、template、generation、provider、ENV-05 / lab全部形成 | 不得依赖P0-C、L6、P1或旧run替代P0-Q | CONF-001~013;SUITE-013;GATE-P0Q | ESLOT-SBX-017~019;VF-001~010适用 | 输入已准备但执行`Blocked`;boundary未定义 |
| test tooling / gates / reports | 16 suite、7 gate、17 scripts、九schema、fixed-run / pairing / redaction / digest | 静态EV、`latest`、手写pass、验收签署 | 正式`05` §6~§14;新版`06`最终alias /裁决规则 | 不得依赖future result反定义TC / PER / slot | 254 TC、38 PER、21 ESLOT、Step 9 /13契约 | 新版`06`消费raw / report / review链 | implementation input已准备;工具未实现 |

阶段审计结论:`05`已提供未来实施计划所需的测试范围、suite / gate、脚本、schema、证据与暂停条件输入;但完整Phase / commit boundary闭环当前为`not_applicable_until_07`。这不是“通过实施移交”,也不允许提前创建implementation ledger、planned skeleton或commit记录。

### 9.7 Public protocol传递类型闭环表

| 协议surface | 外层DTO | 字段 /传递类型 | 正式归属与schema位置 | 缺失 / duplicate / retry口径 | 依赖边界 | 测试覆盖 |
|---|---|---|---|---|---|---|
| 10 Command result | `SandboxCommandResultDto` | operation / command kind、`SandboxCommandResultStatus`、typed primary / affected refs、audit / relay / stored result refs、`SandboxPublicErrorDto` | `contracts`;`03_ddd_step_08_protocol_contracts.md` §10.4 /§11 | required carrier缺失reject;duplicate返回stored result;missing stored result不重算 | public DTO不依赖domain;service显式映射owner state | CTR-001~006;CMD-001~020;TXN-007/010/011;SUITE-001/004/011 |
| 13 Query response / page | `SandboxQueryResponseDto<T>`;`SandboxPagedResponseDto<T>` | `SandboxQuerySurfaceStatus`、typed view、`SandboxPageInfoDto`、`SandboxProjectionMarkerDto`、visibility / error | `contracts`;Step 8 §10.2~§10.3 /§12 | empty / restricted / stale / degraded / missing显式;不得duplicate-write或repair | view从snapshot / projection映射;contracts不引用domain-only type | CTR-005;QRY-001~026;SUITE-004/008/011 |
| 9 Inbound Event | `SandboxInboundEventEnvelopeDto<TPayload>` | source / envelope refs、schema、authority、dedup key、payload digest、typed payload | `contracts`;Step 8 §10.5 /§13 | required缺失reject / quarantine;same digest duplicate返回stored receipt;unavailable delayed | worker adapter只解析carrier;trusted source不绕validation | CTR-001~006;CNS-001~022;SUITE-005/011 |
| Consumer receipt | `SandboxConsumerReceiptDto` | `SandboxConsumerReceiptStatus`、operation / stored result / trace / affected / quarantine refs、delayed time、error | `contracts`;Step 8 §10.5 /§13 | accepted / duplicate / delayed / rejected / failed / quarantined / no-op完整;不把delayed写success | application拥有receipt语义;不暴露internal state / raw body | CNS-001~022;STA-027;TXN-008/010/011 |
| 13 Outbound Event | `SandboxOutboundEventEnvelopeDto<TPayload>` | event ref / kind、source truth ref / cursor、payload ref、trace / audit、typed payload | `contracts` + application relay builder;Step 8 §10.5 /§14 | source append失败rollback;publish retry / dead-letter只改relay;payload family错reject | publisher port不反向定义source truth;payload body-free | EVT-001~015;STA-024;RACE-014;SUITE-005/009/011 |
| 10 Job input | `SandboxJobInputDto<TSpec>` | job run / kind、metadata、idempotency key、scope、page、typed spec | `contracts`;Step 8 §10.6 /§15 | invalid input Failed / Skipped按formal spec;same digest duplicate不selection / target call | jobs entry不修core truth;page cursor不作truth cursor | JOB-001~012;TXN-009/010;SUITE-006/011/012 |
| Job report | `SandboxJobReportDto`;`SandboxJobReportItemDto` | public `SandboxJobReportStatus`、counts、success / failed / skipped / degraded refs、next cursor、stored result / error | `contracts`;Step 8 §10.6 /§15 | partial必须`PartialFailed`;失败也存report;duplicate完整replay | internal `JobReportStatus`必须显式映射public enum,不得直接泄露或合并 | JOB-001~012;STA-028;TXN-009/011 |
| Public error | `SandboxPublicErrorDto` | `SandboxPublicErrorKind`、safe reason、retryable、opaque source / trace ref、redaction marker | `contracts` + application mapper;Step 8 §10.7;正式`03` §11 | 38 internal errors逐项typed mapping;unknown / raw error不得猜success | 不暴露SQL / IO / HTTP / SDK body / stack / secret | CTR-006;ERR-001~038;CFG-009/030;SUITE-001/010 |

五类55协议均经过`SUITE-SBX-011` planned inventory且有owner suite;`TC-SBX-CTR-001~006`验证shared carrier。唯一允许的sibling compile dependency仍为`core-contracts`;tools、runtime、member、policy、artifact和observability等相邻仓只能经port / adapter / event / handoff / controlled fixture协作。

### 9.8 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 /口语名 | 出现位置 | 修正要求 /结果 |
|---|---|---|---|---|
| 设计项目 /目标实现仓 | `projects/L4-sandbox`;future `/home/aris/Projects/quantalithos-sandbox` | 把`L4-sandbox`用作crate名;临时`sandbox-service`仓 | 正式`03` §3 /§4;`05` §1 /§12 | 设计导航与实现仓身份分离;目标仓存在性仍为`07` precheck。 |
| Workspace roles | `contracts`;`domain`;`application`;`infra`;`api`;`worker`;`jobs` | 旧`session/isolation/command/output/control`顶层树 | 正式`03` §4 /§5 | 未来`07`只引用planned layout,不得沿用旧README目录。 |
| Context truth | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity` | `SandboxExecution`;`SandboxSession` | 正式`03`;`05` CUT / CMD / STA | 旧名只允许出现在historical排除语句。 |
| Boundary truth / status | `BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`BoundaryCoherenceStatus::Coherent` | `IsolationConfig`;`RuntimeHost`;`BackendSession`;`CoherentBoundaryStatus` | 正式`03` Step 6 /8 /10;TC-SBX-CMD-004 | CMD-004已回写正式enum名;不得再创建同义status。 |
| Policy surface | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | `SandboxPolicy`;`Allowlist`;policy body | 正式`03`;`05` CMD / QRY / STA | 只保存safe summary / refs;external truth body不进入sandbox。 |
| Capture / handoff | `CaptureFact`;`CapturedMaterialRef`;`HandoffFact`;`ObservabilityMaterialRef` | `SandboxOutput`;artifact / observability truth body | 正式`03`;`05` CMD / EVT / ESLOT | 只允许body-free ref / digest /safe summary。 |
| Cleanup / redline | `CleanupGuard`;`RedlineContainment` | cleanup flag;security warning;advisory redline | 正式`03`;`05` safety TC | non-Allowed不得release;redline必须formal containment。 |
| Query surface | `SandboxQuerySurfaceStatus`;13个正式`*ViewDto` / response | `ok/missing/error` bool;临时view名;`latest` query | 正式`03` Step 8;QRY-001~026 | 使用formal surface;missing不得scan / repair /造ref。 |
| Job owner / public status | internal `JobReportStatus`;public `SandboxJobReportStatus` | 把二者合成一个enum或互换 | 正式`03` Step 8 /10;JOB / STA用例 | Step 6 job分件已补显式mapping约束。 |
| 测试ID | `TC-SBX-<FAMILY>-NNN`;`CUT/CBC/PER-SBX-NNN` | 旧`TC-001~012`;无family编号 | 正式`05` §3 /§5 /§6 | 14 family共254条连续;38 CUT / CBC / PER同序。 |
| 执行 /证据状态 | `Passed / Failed / Blocked / NotRunConditional / InfraFailed`;assertion另有`NotEvaluated` | `Skipped`;`Waived`;`Partial`;`UnknownPass`;设计态写passed | 正式`05` §11~§13 | 当前只使用designed / planned / Blocked / NotEvaluated / conditional / inactive。 |
| Evidence identity | planned `ESLOT-SBX-001~021`;runtime `EV-SBX-<FAMILY>-NNN` only after validation | 静态EV、手写alias、ESLOT当证据 | 正式`05` §13 | 当前无EV实例;slot后缀只约束未来合法runtime alias。 |
| 固定运行路径 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance/*.md`;`reports/review/*.md` | project子层;acceptance / review run子目录;`latest`;静态pass文件 | 正式`05` §9 /§13 | Step 9 /13路径已按标准和验收Step 3回写;固定run identity写入acceptance / review文件正文。 |
| Environment / profile | `SBX-ENV-01~07`;`SBX-PROFILE-01~07` | `ENV-*` / `PROFILE-*`机器值;dev / test / staging口语环境;host profile | 正式`04` §6;正式`05` §8 /§13 | 正文可按已声明规则简写,机器enum必须使用canonical全名;P05 Blocked、P06 conditional、P07 inactive。 |

### 9.9 冲突与修正表

| 冲突ID | 冲突位置 | 冲突类型 | 影响范围 | 修正 /处理口径 | 处理状态 |
|---|---|---|---|---|---|
| `SBX-TEST-HIST-001` | 旧README /旧`05/06` | 旧对象、旧TC、host /产品、环境、阈值和checkbox污染 | 全文 | 只保留historical排除和差异审计,不进入当前事实。 | `contained_as_historical_material` |
| `AUDIT-SBX-05-001` | Step 6 Command分件TC-SBX-CMD-004 | enum命名漂移:`CoherentBoundaryStatus`不存在 | boundary negative assertion | 已改为正式`BoundaryCoherenceStatus::Coherent`,并扫描正式`03`同源。 | `resolved_by_step_15_writeback` |
| `AUDIT-SBX-05-002` | Step 6 Job分件 | internal `JobReportStatus`与public `SandboxJobReportStatus`可能被误合并 | 10 Job report / replay实现 | 已补显式mapping与不可合并约束;正式public carrier保持`SandboxJobReportStatus`。 | `resolved_by_step_15_writeback` |
| `SBX-TEST-EVIDENCE-PRODUCER-001` | Step 13 / 正式`05`§13.2 | slot producer catalog漏列同行TC的主归属suite | future raw / report pairing、evidence item completeness和验收Step 8定位 | 已补齐`ESLOT-SBX-002/009/011/013/018/019/020/021`的producer suite;未改TC、slot、suite主归属、source role或成熟度。 | `resolved_by_acceptance_step_8_writeback` |
| `SBX-TEST-EVIDENCE-PATH-001` | Step 9 vs Step 13 | suite result / log路径不一致 | pairing / digest /失败保留 | Step 9已回写`report.json`,`stdout.log`,`stderr.log`固定配对。 | `resolved_by_step_13_writeback` |
| `SBX-ACC-BASELINE-PATH-001` | 正式`05` / Step 9 / Step 13 vs 当前测试与验收标准 | acceptance / review路径把fixed run放入子目录,与标准固定平铺入口冲突 | Step 3基线、后续Step 10~14证据引用和`07` writer boundary | 已回写为`reports/acceptance/*.md`与`reports/review/*.md`;fixed release run、来源digest和review version写入文件正文。 | `resolved_by_acceptance_step_3_writeback` |
| `SBX-ACC-BASELINE-IDENTITY-001` | 正式`04` vs Step 13机器schema / Release gate | machine ENV / PROFILE缩写不是canonical ID,且ReleaseAggregation无聚合器identity | fixed run context、P0-Q packet、Release聚合与后续实现 | 机器enum回写为SBX-ENV / SBX-PROFILE全名;Release聚合器固定SBX-ENV-02 / SBX-PROFILE-02且无证明效力。 | `resolved_by_acceptance_step_3_writeback` |
| `SBX-ACC-BASELINE-SOURCE-RUN-001` | 正式`05` / Step 9~14 | GATE-SBX-MAIN同时声明ENV-02与controlled ENV-03,但一个run context只能绑定一组ENV / PROFILE / config identity | fixed source run、证据schema、Release聚合与验收基线真实性 | 保持单一MAIN gate,拆为MAIN-CONTRACT和MAIN-SEAM两个fixed source run;Release按四源固定顺序消费并逐源校验identity / digest。 | `resolved_by_acceptance_step_3_writeback` |
| `SBX-TEST-REGRESSION-META-001` | Step 13 vs Step 14 | run metadata缺intent / scope / trigger / change refs | 回归选择可审计性 | Step 13 schema与Step 9 writer已回写,九schema数量不变。 | `resolved_by_step_14_writeback` |
| `SBX-DOC-GAP-ACCEPT-001` | `06-验收标准.md` | 旧验收文档与当前`03~05`不一致 | 验收裁决 /签署 | 旧`06`保持historical;后续按验收SOP full-restart,不得阻塞`05`设计收口。 | `open_downstream` |
| `SBX-DOC-GAP-002` | `07-实施计划.md` | 正式实施计划、ledger、boundary skeleton缺失 | implementation transfer | 进入`07`后逐Step创建;完成正式`07`时同步创建implementation ledger和全部planned skeleton。 | `open_downstream` |
| `SBX-TEST-EXECUTION-001` | target repo / suite / CI / ENV-02~05 | 执行基础设施未形成 | 所有真实run / evidence | 不阻塞设计收口;阻塞执行,不得伪造。 | `open_for_07_precheck` |
| `SBX-TEST-P0Q-001` | ENV-05 / candidate / provider / lab | P0-Q资格前置缺失 | SUITE-013 / release | 保持Blocked;P0-C、L6或P1不得替代。 | `open_for_p0q_execution` |
| `SBX-TEST-PROFILE-001` | P05 / P06 / P07 activation | backend / provider / anti-leak / durable / rollout资格未闭合 | profile激活 | P05 blocked、P06 conditional、P07 inactive;后续按activation gate关闭。 | `open_for_p05_p06_p07_activation` |

审计未发现阻塞正式`05`收口的上游设计冲突。开放项均属于下游文档、实现、执行、资格或激活阶段;任一开放项被要求成为current capability时,必须按§14触发DesignReopen或相应下游门禁,不能在本文中润色为ready / passed / accepted。

### 9.10 正反例

| 类型 | 示例 | 结论 |
|---|---|---|
| 正例 | TC-SBX-CMD-004引用正式`BoundaryCoherenceStatus::Coherent`,注入任一四维缺失后断言整体非Coherent、partial handle不可用、safe error mapping成立。 | 可接受:字段 /状态 /错误 /副作用和formal TC / PER同源。 |
| 正例 | QRY-017在projection Stale时返回正式surface与source cursor,并断言write UoW、rebuild、mark-stale和audit append均为0。 | 可接受:Query response / no-write闭合。 |
| 正例 | EVT-015区分source tx append失败与已commit后的publisher失败;后者只更新relay为retryable / dead-letter。 | 可接受:Event构造、事务和owner truth no-rollback闭合。 |
| 正例 | 未来`07`只引用正式`03` §9 + STA-001~031 + SUITE-002来定义domain-state boundary,并在开工前重做5.10审计。 | 可接受:引用真相源且没有复制状态表为第二真相源。 |
| 反例 | 用ENV-02 fake / ENV-04 simulation结果给ENV-05 candidate分配EV并宣称四维隔离通过。 | 不可接受:P0-C不能替代P0-Q,且当前无真实run / EV。 |
| 反例 | 把internal `JobReportStatus::PartialFailed`直接序列化到public DTO,或统一改名为一个状态enum。 | 不可接受:domain owner状态与public carrier类型必须显式映射。 |
| 反例 | 在`reports/acceptance/latest/pass.md`手写ESLOT / EV和签署,补齐缺失raw。 | 不可接受:路径、identity、pairing、digest、review和真实性全部断裂。 |
| 反例 | 当前创建`PH-SBX-*`、commit boundary skeleton和implementation ledger并标记passed。 | 不可接受:`07`尚不存在;当前Phase / commit整体审计不适用。 |

## 10. 全文自审与停审

| 审计项 | 结论 | 机械 /人工依据 |
|---|---|---|
| 章节与校准来源 | 通过 | §1~§15连续;15个正式章节各有具体来源和延伸阅读;正式§15列全主件 /分件。 |
| TC / CUT / CBC / PER | 通过 | 14 family、254 TC均从001连续;38 CUT / CBC / PER完整同序;237 P0-C +13 P0-Q +4 conditional。 |
| Protocol / state / error | 通过 | 55协议、31个 Step 10 canonical status enum entries和38 typed error分别与正式`03`源集合零差异。 |
| 数据 /环境 /自动化 | 通过 | 28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本完整;无实现或环境实例声明。 |
| Evidence / regression | 通过 | 21 ESLOT、九schema、15 shared enum、20 RT、8 RR完整;无runtime EV或风险接受。 |
| 进入 /退出 | 通过 | 55个checkbox均未勾选;P0-C NotEvaluated、P0-Q Blocked、P1 NotRunConditional。 |
| §5.10闭环 | 通过 /部分不适用 | 十类固定产物完整;因正式`07`尚不存在,Phase / commit整体审计为`not_applicable_until_07`。 |
| Historical /命名 | 通过 | 旧对象、旧TC、旧环境、产品名只位于historical /禁止 /冲突记录;本轮两项命名问题已回写。 |
| Markdown /文件来源 | 通过 | fenced-aware 70张表无列错;现有引用文件均存在;缺失`07`已作为future gap登记。 |
| 伪事实 | 通过 | 无实现commit、真实run_id、artifact / report实例、EV alias、测试结果、验收签署或风险接受。 |
| diff格式 | 通过 | `git diff --check -- projects/L4-sandbox`无输出。 |

当前没有阻塞正式`05`设计基线的上游blocker。执行与资格blocker继续开放:目标实现仓、suite / scripts / CI、ENV-02~05实例、candidate backend、provider、dedicated lab和retention物理策略。旧`06`仍是historical material,正式`07`仍缺失。

```text
current_document = `05-测试方案.md`
current_step = Step 15 `整理正式测试方案文档`
gate_status = passed_to_06
next_allowed_action = 本Step已收口;项目后续由`06_acceptance_calibration_flow.md`和当前验收Step接续
formal_document_write = completed
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```

## 12. Current closeout override (`v7.9-closeout`)

本节覆盖前述正式 `06/07` 缺失、Phase / boundary 审计不适用以及继续传播到验收的历史装配快照。正式 `05`、正式
`06/07`、implementation ledger 与 32 /32 planned skeleton 均已形成；测试仍未执行，planned slot 仍不是 evidence。

```text
current_document = 05-测试方案.md
current_step = Step 15 current test inventory closeout completed
design_chain_status = completed_current_closeout
state_slots = STA-001..STA-031
test_design_inventory = 254_total|237_P0-C|13_P0-Q|4_conditional|250_P0
implementation_ledger_created = yes_32_boundary_package_by_07_step_13
planned_boundary_skeleton_created = yes_32_of_32
real_test_execution = not_started
real_evidence_created = no
acceptance_status = NotEntered
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
commit_required = no
```

## 11. DesignReopen current test inventory override (`v0.3.0`)

| 项 | current 设计库 | 成熟度 |
|---|---:|---|
| `STA-001~031` | 31 | designed only |
| P0-C | 237 | not executed |
| P0-Q | 13 | blocked for qualification |
| conditional | 4 | not run conditional |
| P0 total | 250 | no Passed result |
| TC total | 254 | no run / evidence / acceptance fact |

`STA-031` 专门验证 `HandoffTargetProgressStatus` 的 attempt-before-call、same-attempt inspection、terminal guard 和
aggregate re-derive。它归入现有 `SUITE-SBX-002` 和 handoff deterministic dataset，不新增 suite、gate、environment、
evidence slot 或执行声明。

```text
formal_05_writeback = completed_design_static_only
real_test_execution = not_started
real_evidence_created = no
acceptance_status = NotEntered
commit_required = no
```

## 12. Final technical-verification assembly authorization (`DC-03`)

正式 `05` 获准在现有 suite/gate 中追加三组 planned checks，不增加 Passed 结果：exact Rust/core manifest/graph/build
核验；RFC 8785 official/negative/roundtrip/digest/path fixtures；17/17 Bash syntax、ShellCheck `0.10.0`、strict-mode 与
exit/status propagation negative fixtures。结果初值统一为 `NotRun`，失败分别传播为 `Blocked`、`InfraFailed` 或
`Failed`，不得以工具缺失记 `N/A`。

```text
assembly_authorization = DC-04_formal_05_planned_technical_verification
test_inventory_recount_required = no
real_test_execution = not_started
next_allowed_action = update_formal_05_then_continue_authorized_closeout
```

## 13. DC-06 current-truth audit repair authorization

允许把正式§15.5的实施计划行与ledger/Boundary行从历史`blocked / wait_design`更新为
`blocked / activation_gate / handoff`。测试设计库存、门禁、结果初值和evidence状态不变。

```text
assembly_authorization = DC-06_formal_05_current_boundary_route_only
test_inventory_changed = no
real_test_execution = not_started
next_allowed_action = update_formal_05_current_boundary_route
```

## 14. DC-06 phase-boundary status repair authorization

最终静态审计确认，正式 `07`、implementation ledger 与 32 件 planned Boundary skeleton 均已形成，且正式 `07`
已经完成 14 /14 phase、32 /32 Boundary 的设计静态审计。因此允许把正式 §15.6 中发生时成立的“`07` 不存在、
Phase / commit 整体审计不适用”更新为 current truth。该回填只修改下游设计链状态，不新增或重算 TC、suite、gate、
script、ESLOT，也不产生测试执行、runtime evidence 或验收事实。

```text
assembly_authorization = DC-06_formal_05_phase_boundary_status_only
formal_delta = section_15_6_phase_boundary_status
phase_design_audit = 14_of_14_completed_design_static_only
boundary_design_audit = 32_of_32_completed_design_static_only
test_inventory_changed = no
real_test_execution = not_started
real_evidence_created = no
next_allowed_action = update_formal_05_current_status_only
```

## 15. DC-06 downstream-document role wording repair authorization

正式 §15.1 中“当前磁盘上的 `06-验收标准.md`”是 full-restart 装配发生时的旧文件快照，现已被正式 `06/07` 下游
设计取代。允许将该句澄清为 historical material，并明确正式 `06/07` 已形成但不属于 `05` 的上游测试真相源。
该修复不改变正式 `00~04` 的输入权威顺序，也不把下游设计完成写成执行事实。

```text
assembly_authorization = DC-06_formal_05_downstream_document_role_wording_only
formal_delta = section_15_1_historical_06_wording
test_truth_source_changed = no
downstream_design_chain = formal_06_and_07_present
real_test_execution = not_started
real_evidence_created = no
next_allowed_action = update_formal_05_current_status_only
```

## 16. PHYSICAL EOF DC-06 final audit disposition

前述三项 DC-06 授权均已被正式 `05` 精确消费：§15.1 澄清旧 `06` 的 historical/downstream 角色，§15.5 更新
Boundary handoff 路由，§15.6 更新 14/14 phase 与 32/32 Boundary 的设计静态审计状态。254/250 测试库存、suite、gate、
script、ESLOT 和结果初值均未改变。

```text
dc_06_assembly_disposition = exact_formal_delta_completed
formal_05_delta = section_15_1_downstream_role|section_15_5_boundary_route|section_15_6_phase_boundary_status
test_inventory_changed = no
real_test_execution = not_started
real_evidence_created = no
design_audit_status = completed_design_static_only
```
