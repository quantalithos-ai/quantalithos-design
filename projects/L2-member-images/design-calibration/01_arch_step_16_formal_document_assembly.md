# Step 16. 整理正式文档

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `formal_document_assembly` | pass | 旧正式 01 已只读审计并删除;新版已从空 18 章骨架分批重建,章节 / 来源 / 图表 / ID / owner / seam / pending / 产品 / 数值 / historical pollution 审计通过 | `stop_review`;等待用户明确确认,不得进入 02 | `01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md`;`../01-架构设计.md`;架构 SOP / 书写规范 |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 1~15、架构 SOP Step 16、书写规范 18 章主链与参考正式装配粒度。
- [x] 在 Step 15 通过后首次读取旧正式 01,仅用于 historical pollution audit。
- [x] 核对 Step 5 / 7 / 8 / 9 / 12 / 15 的架构单元和决定停审状态。
- [x] 完成职责、依赖、数据、通信、横切、ADR / 需求和 blocker 的跨单元装配前审计。
- [x] 建立 18 章来源映射、术语 / 编号统一和旧材料准入矩阵。
- [x] 删除旧正式 01,再从空 18 章骨架分批重建。
- [x] 每章写入具体 calibration 来源,只重组已停审结论。
- [x] 执行章节、图、表、来源、ID、owner、依赖、pending、产品、数值和 historical pollution 全量审计。
- [x] 将正式 01、flow、项目 ledger 切换为 `stop_review`,不得进入 02。
- [x] 保持无 commit、无实现、无 run / digest / report / evidence / test / verdict / signoff / readiness claim。

## 2. 本步输入

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md` | completed / pass | 正式正文唯一架构结论来源 |
| `../00-需求文档.md` | stop-reviewed requirement baseline | 核对需求 ID、owner、开放条件与禁止推导 |
| `standards/document/架构设计讨论流程_SOP.md` | normative | 控制 Step 16 后置装配与停审门禁 |
| `standards/document/架构设计书写规范.md` | normative | 控制 18 章正式结构、图表和来源块 |
| `standards/document/设计文档编写通则.md` 等启动标准 | normative | 控制 truth、来源、依赖、过程材料与可落码边界 |
| `architecture/adr/0005-member-image-per-role.md` | accepted / scoped | 仅承接经正式 00 核验的预构建、nightly、mapping owner、pin / no-latest |
| `L2-runtime` / `L1-governance` 正式 01 与 Step 16 | pattern reference only | 参考正式 18 章装配粒度,不复制领域结论 |
| 旧 `../01-架构设计.md` | historical_material / audited | 只识别污染和可重新核验线索,不直接继承 |

## 3. SOP 问题回答

1. 已确认结论如何落位?

   回答:Step 1 支撑 §1 / §3 / §16,Step 2 支撑 §2 / §3,Step 3~14 分别支撑 §4~15,Step 15 同时支撑 §16 / §17,Step 16 只生成 §18 参考和全篇统一。详细来源映射见 §7.1。

2. 哪些结论需要跨章承接而非机械复制?

   回答:Owner / no-body / pin / fail-closed / history / six seams / pending discipline 横跨职责、依赖、数据、交互、技术、横切、风险和追溯;每章只写其本章落点。BC / LS、运行角色和代码模块也必须保持不同粒度,不能一一映射。

3. 哪些术语和编号必须统一?

   回答:统一 BC-MI-01~05、LS-MI-01~04、IX-MI-01~06、TM-MI-001~010、XC-MI-001~010、ED / ET、R / AR、MI-UP / Q、TR 和 ADR-MI 编号;统一 truth / snapshot / ref / forbidden body、candidate / eligibility / availability、entry / handoff / consumer gap 语义。正式文档不新建字段级状态枚举。

4. 哪些内容必须继续挂起?

   回答:MI-UP-001~009、Q-MI-001~004、exact contract、Core image schema、event family、Artifact handoff、consumer confirmation、seed owner、hardened base、outbound event、variant / platform scope、产品、gate inventory 和量化 baseline 均保持原状态。

5. 参考章节如何收口?

   回答:§18 只列正式需求、accepted ADR、规范、正式 owner 文档与本轮 calibration 入口;不列旧 README / 旧 01 为正式参考,也不重复 §1 / §16 / §17 的来源、映射和决策内容。

6. 跨架构单元是否允许正式装配?

   回答:Step 5 / 7 / 8 / 9 / 12 / 15 的逐项停审和跨项审计均通过;职责、依赖、数据、交互、横切与追溯没有 unresolved 内部冲突。Open exact seams 仍是显式缺口,但不阻塞 product-neutral / fail-closed 架构正文装配。

## 4. 当前材料问题诊断

| 旧正式 01 表达 | 污染 / 冲突 | Step 16 处理 |
|---|---|---|
| 17 章结构,将架构风格置于 §3,上线策略置于 §14 | 不符合当前 18 章主链,混入实施 / 运维 | 删除旧正文;按固定 18 章重建,不保留上线策略章 |
| “运行镜像工厂 / 产物真相层”与 CI pipeline 主线 | 将镜像域 truth 降为构建工具 / registry 附属 | 重建为独立镜像资产与供给 truth + staged decisions |
| 固定 9 Role、固定 base / overlay、Role 列表 / 工具清单 | Role / mapping truth 外溢且无当前 authority | 全部排除;只消费 Method Library 正式 mapping source |
| 9/9、99.9%、100%、时延、大小、构建批次等数字 | 无 workload / measurement baseline | 全部排除;只保留离散架构判断口径 |
| Docker / buildx / Trivy / Grype / cosign / registry / CI / KMS | 产品与部署载体被硬化 | 全部恢复为 product-neutral adapter / deferred config |
| 固定 scan / sign / BOM 必过 | Q-MI-004 gate inventory 未闭口 | 只保留 authority-driven applicable gate fail closed |
| 单一 build -> validate -> publish / single lifecycle | 压平 candidate / eligibility / availability 和 owner gap | 使用 BC-MI-01~04 staged decisions + BC-MI-05 support |
| CompatibilityReport / ImageBOM / SignatureRef 为本仓 truth | 吞并 component / evidence / Artifact owner | 只保存 ref / safe conclusion / local evaluation / gap |
| Registry / CI / member-service outcome 改写 image state | Adapter / consumer truth 冒充本地 decision | Local truth 与 external outcome 分层,失败保守挂起 |
| 发布通知、member-service pull / run / sample launch | MI-UP-001/009 未闭口且越过 container owner | 仅 pinned entry / gap;无 outbound event / launch success |
| 多架构、restricted role、hardened / rootless 等 current | Q-MI-001/002、MI-UP-008 为 conditional / future | 保持条件型范围扩展,不进 current core |
| 具体重试、灰度、回滚步骤、告警阈值 | 下沉实施 / 运维 / 测试层 | 架构只保留新语境恢复、history 和判断口径 |
| ADR-0007 checkpoint / recovery 关联镜像 | Runtime live truth 错配且未被本轮来源接受 | 不进入 ADR 索引;checkpoint 明确排除 |
| 自审全部通过、L2 五仓已补齐 | 伪造停审 / readiness / 跨项目完成事实 | 删除;只记录本项目正式 01 的文档门禁状态 |

旧稿可重新核验的线索仅包括:镜像运行环境应在构建期预装、nightly 语义、mapping 归 Method Library、必要输入 pinned、production 禁 `latest`、运行时 secret / live state 不入静态镜像。它们进入新版的依据是正式 00、ADR-0005 与 Step 1~15,不是旧稿本身。

## 5. 改动前后对比

| 维度 | 旧正式 01 | 新正式 01 装配口径 |
|---|---|---|
| 结构 | 17 章 + 上线策略 / 自审尾章 | 规范固定 18 章,无额外实施结论 |
| Truth 主线 | CI / registry / report objects | Definition -> candidate -> eligibility -> availability 的镜像域 truth |
| Role | 固定枚举与 overlay | Method mapping source + image variant / persona assembly identity |
| Gate | 固定 scanner / signer / BOM | Authority-driven applicable gate + safe conclusion |
| State | 单流水线 success / publish | 多 decision context、external gaps 与 history |
| Dependency | 工具 / SDK / pipeline 调用 | compile / runtime / event / ref / adapter / fake 显式裁剪 |
| Deployment | CI / runner / registry 固定 | 三类处理角色 + 两类状态承载,产品 / 进程 deferred |
| Quality | 伪量化 SLA / thresholds | 离散结构判断,measurement baseline pending |
| Status | 自审通过 / 已补齐 | formal 01 complete pending user review;implementation not_started |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 642 行正文上局部替换 | 改动表面较小 | 旧 17 章、数字、产品、对象、状态和 readiness 极易残留 | 不采用 |
| 删除旧正文,建立空 18 章骨架后分批回填 | 真相源干净,可逐章审计来源 | 需要完整重建 | 采用 |
| 机械复制 15 个 Step 的 §7 | 快速 | 正式文档冗长且章节职责混乱 | 不采用 |
| 从每个 Step 摘录本章结果并保留来源入口 | 可追溯且正式正文可读 | 需要交叉引用审计 | 采用 |
| 在装配时补 schema / API /产品 / 数字 | 看似更可落地 | 违反 Step 16 不新增结论 | 不采用 |

## 7. 结构化中间产物

### 7.1 章节回填与来源映射

| 正式章节 | 主要 calibration 来源 | 回填重点 | 禁止混入 |
|---:|---|---|---|
| 1 | Step 1、4、15 | Authority 顺序、上游关系、historical / pending 限制 | 重写需求或旧稿正文 |
| 2 | Step 1、2 | 背景、驱动力、AG-MI-001~008 | 量化成功指标 |
| 3 | Step 1、2、14 | HC / IC、阶段取舍、非目标 | 产品 / schema / future readiness |
| 4 | Step 3 | 做 / 不做 / 协作 / 易混淆与红线 | 系统上下文、接口细节 |
| 5 | Step 4 | 上下文图、输入 / 输出面、降级上限 | 内部 BC / 调用时序 |
| 6 | Step 5 | BC / LS、关系图、统一语言 | 代码模块 / service / database |
| 7 | Step 6 | 处理角色、状态承载、部署边界 | 产品、进程数、资源参数 |
| 8 | Step 7 | 向内依赖、六类 seam、跨仓裁剪 / 禁止依赖 | 消费即源码依赖 |
| 9 | Step 8 | 数据类别、owner、一致性、恢复 | Schema、transaction、retention |
| 10 | Step 9 | IX-MI-01~06、通信方式、失败口径 | Protocol、route、topic、DTO |
| 11 | Step 10 | TM-MI-001~010、当前不硬化边界 | 技术产品横评 |
| 12 | Step 11 | 主线、5 条替代路径、排除方向 | Future 愿望池 |
| 13 | Step 12 | XC-MI-001~010、单元映射、判断边界 | 监控 / 安全 / 运维手册 |
| 14 | Step 13 | 条件车道、ED / ET、保持不变量 | 排期 / 版本路线图 |
| 15 | Step 14 | R / AR、MI-UP / Q、owner closure 上限 | TODO / 最终方案 /伪 closure |
| 16 | Step 15 | TR-MI-001~012、反向覆盖、trace gaps | 项目状态 / 补齐计划 |
| 17 | Step 15 | ADR-0005 scoped + ADR-MI-001~007 | 未定事项 / 外部文件 claim |
| 18 | Step 16 | 克制的正式参考清单 | 旧稿 / draft / 链接大全 |

### 7.2 装配前跨架构单元总审计

| 审计维度 | 结果 | 装配结论 |
|---|---|---|
| 职责重叠 | pass | BC-MI-01~04 单向决策,BC-MI-05 只支撑;外部 owner 不吸收。 |
| 子域 / 影子归类 | pass | 四核心 + 一支撑;LS-MI-01~04 只保存 ref / snapshot / conclusion / gap。 |
| 依赖方向 | pass | 向内依赖;compile 仅正式 Core,其余五类 seam 不获 package 权限。 |
| 数据所有权 | pass | Truth / snapshot / ref / forbidden body 四类明确,external / projection 不反写。 |
| 一致性 / 恢复 | pass | Local decision invariant 强一致;跨 owner 有界最终一致;新语境恢复。 |
| 通信方式 | pass | 即时领域判断、后台长时承接、conditional inbound event 分离;无 outbound event。 |
| 横切约束 | pass | XC-MI-001~010 覆盖五个 BC,无产品、手册或伪数值。 |
| ADR / 需求追溯 | pass | 需求命名空间、架构结果与 8 项决策无孤儿;trace gaps 显式。 |
| Blocker preservation | pass | MI-UP-001~009、Q-MI-001~004 均未关闭或升级。 |
| Sibling 状态 | pass | `L2-member` / `L2-member-service` 进行中架构只作 pending input。 |

### 7.3 术语 / 编号统一

| 正式术语 / 编号 | 统一含义 | 禁止替代 |
|---|---|---|
| Image-domain truth | Definition / revision / intent / attempt / candidate / provenance / eligibility / availability / entry / local gap | CI state、registry record、Artifact truth、container state |
| Image variant / persona assembly identity | 本仓镜像定义身份,回指正式 Role mapping source | 本地 Role 枚举 / RoleDefinition copy |
| Pinned static assembly baseline | Component / extras / base / seed refs 与 placement 的完整装配 binding | Runtime live state、secret、latest / guessed version |
| Candidate / eligibility / availability | 三类分别成立的本地 decision | 单一 ready / publish success |
| Ref / snapshot / safe conclusion / gap | 受控外部 shadow | External body / second truth |
| Compile / runtime / event / ref / adapter / fake | 跨仓关系类型 | 一律 package dependency |
| BC-MI / LS-MI / IX-MI / TM-MI / XC-MI | 语义单元、影子、交互、机制、横切约束 | 代码 module / process / table 编号 |
| R / AR / MI-UP / Q | 风险、架构风险、外部条件、正式待决策 | TODO / implemented status |
| ADR-MI-* | 本文内长期决定索引 | 已存在的仓外 ADR 文件 / signoff |

### 7.4 正式写入门禁

```text
project_ledger = stop_review_formal_01_pending_user_confirmation
document_flow = stop_review_step_16_complete
step_01_to_15 = pass
cross_unit_audit = pass
old_formal_01 = historical_audited_not_authoritative
formal_write_order = delete_old_then_create_empty_18_chapter_skeleton_then_fill
formal_document = formal_01_complete_pending_user_review
future_document_write = forbidden
commit_required = false
```

### 7.5 正式正文审计结果

| 审计面 | 结果 | 说明 |
|---|---|---|
| 章节结构 | pass | 恰好 18 个规范编号章节,顺序与架构书写规范一致。 |
| 校准来源 | pass | 18 个章节均有具体来源块;共引用 16 个实际存在的 Step 文件,无目录级泛指。 |
| 图与表 | pass | 5 张架构图均含图类型、标题、ASCII 正文和图后说明;Markdown 表格列数一致。 |
| 编号与 owner | pass | BC-MI-01~05、LS-MI-01~04、IX-MI-01~06、TM / XC / ED / ET、R / AR / TR 与 ADR 索引集合完整;owner 无反转。 |
| 依赖分类 | pass | Compile / runtime / event / ref / adapter / fake 均有定义、对象、权限上限和禁止依赖。 |
| Pending / blocker | pass | MI-UP-001~009、Q-MI-001~004 全量保留;兄弟项目进行中输入未关闭 positive lane。 |
| 历史污染 | pass | 固定 Role、无 authority 数字、具体产品、固定 gate、单 lifecycle、伪 Artifact / consumer outcome 和伪完成事实未回流。 |
| Readiness / evidence | pass | 只有设计门禁状态;无实现仓、commit、run、真实 digest、report、evidence、测试、verdict、signoff 或 readiness claim。 |
| 格式静态检查 | pass | `git diff --check -- projects/L2-member-images` 与忽略 ASCII code block 的表格列审计均通过。 |

## 8. 回填草稿

正式 `01-架构设计.md` 使用 `L2-member-images 架构设计` 标题和 18 章固定主链。文首写明 `full-restart`、需求基线、设计状态 `formal_01_complete_pending_user_review`(仅在审计完成后使用)及实施状态 `not_started`。每章必须列具体 `design-calibration/01_arch_step_*.md` 来源和简短延伸阅读;正文按 §7.1 摘录,不复制 Step 的过程问答、诊断和全部停审表。

## 9. 待确认事项

- Step 16 不关闭 MI-UP-001~009、Q-MI-001~004、exact contract、正式 decision 或量化 trace gaps;historical pollution gap 仅从 `deferred` 更新为 `audited`,R-MI-008 继续防止回流。
- 旧正式 01 的任何线索必须经正式 00 / ADR-0005 / Step 1~15 二次来源支撑;否则排除。
- `L2-member` / `L2-member-service` 架构仍在进行中,不得在正式 01 写成已停审合同。
- `ADR-MI-001~007` 不声明仓外文件、review 或 signoff。
- 正式文档中的 `pass` / `complete` 只能描述设计文档门禁,不得描述实现、integration、test 或 release。
- 当前未创建 commit,也不进入 02。

## 10. 进入停审条件

| 检查项 | 当前结果 |
|---|---|
| 旧正式 01 是否已只读审计并形成准入 / 排除结论 | pass |
| Step 5 / 7 / 8 / 9 / 12 / 15 是否已停审 | pass |
| 跨架构单元总审计是否无 unresolved 内部冲突 | pass |
| 18 章来源映射、术语和写入顺序是否明确 | pass |
| 旧正式 01 是否已删除且空骨架已建立 | pass |
| 18 章是否已分批回填并完成全量静态审计 | pass |
| Flow / ledger / formal doc 是否已切换 stop_review | pass |

`gate_status = pass`;正式 01 已完成并进入 `stop_review`。下一动作严格为等待用户明确确认;不得进入 02、修改其他正式文档或提交 commit。
