# Step 16. 需求追溯矩阵

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `cross_capability_traceability_audit` | pass | 以 F-MI-001~015 和 F-MI-E01~E05 为主轴的矩阵已连接 capability、US、BR、D 与 AC;补充矩阵覆盖 IF、DEP、NFR、VETO、R、MI-UP 和 Q;无孤儿、重复、边界串线或新增未确认项 | 进入 Step 17 正式文档装配 | `00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md` |

### 1.1 Step 内计划

- [x] 读取项目 ledger、00 flow、需求 SOP Step 16 和书写规范 §4.16。
- [x] 确认 C-MI-1~5 已完成 Step 8~14 全部能力级停审。
- [x] 固定以功能需求为主轴,不改用故事、规则、能力或验收作主轴。
- [x] 按 C-MI-1 -> C-MI-5 建立 15 条核心功能主追溯矩阵并逐节点停审。
- [x] 将 5 条外围功能纳入矩阵并明确不进入核心完成分母。
- [x] 建立 IF / DEP / NFR / VETO 补充矩阵,不修改规范固定主表列。
- [x] 建立 R / MI-UP / Q 补充矩阵,保持 pending 对 positive readiness 的限制。
- [x] 反向检查孤儿故事、功能、规则、数据、接口、依赖、NFR、AC / VETO 和风险 / blocker。
- [x] 后置检查重复定义、owner 串线、依赖类型冲突和 historical 污染。
- [x] 形成正式 00 §16 回填草稿并更新 flow / ledger。

## 2. 本步输入

| 输入 | 状态 | 本步使用方式 |
|---|---|---|
| Step 7 | pass | 固定 C-MI-1~5 与外围能力层级 |
| Step 8 | pass | 固定 US-MI-001~015、US-MI-E01~E05 |
| Step 9 | pass | F-MI-001~015、F-MI-E01~E05 作为主矩阵主轴 |
| Step 10 | pass | 映射 BR-MI-001~025、BR-MI-E01~E03 |
| Step 11 | pass | 映射 D-MI-001~030、D-MI-E01~E04 |
| Step 12 | pass | 补充映射 IF-MI-001~014、IF-MI-E01~E03、DEP-MI-001~016 |
| Step 13 | pass | 补充映射 NFR-MI-001~022 |
| Step 14 | pass | 映射 AC-MI-001~030、VETO-MI-001~007 |
| Step 15 | pass | 映射 R-MI-001~010、MI-UP-001~009、Q-MI-001~004 的挂起上限 |

## 3. SOP 问题回答

1. 每个核心能力节点是否完成了小循环?

   回答:是。C-MI-1~5 均已分别完成 US、F、BR、D、IF / DEP、NFR 和 AC / VETO 停审;本 Step 只连接这些编号。

2. 能力、故事、功能、规则、数据和验收如何连接?

   回答:完整映射见 §7.1。每条 F 都有唯一主能力层级、至少一个 US 来源、保护它的 BR、支撑 / 限制它的 D 和对应节点 AC;核心 F 还共同承接 AC-MI-026~029。

3. 接口、依赖和非功能要求如何避免在固定主表中丢失?

   回答:§7.2 按能力节点补充 IF / DEP / NFR / AC / VETO 映射。该表只引用 Step 12~14 既有编号,不增加正式主矩阵列或新合同。

4. 风险和 blocker 如何进入追溯?

   回答:§7.3 将 R、MI-UP、Q 挂到受影响能力范围。它们限制正向合同和 readiness,不反向创造功能或验收来源。

5. 是否存在孤儿或串线?

   回答:没有。20 条故事 / 功能、28 条规则、34 条数据项、17 个接口、16 条依赖、22 条 NFR、30 条 AC、7 条 VETO、10 条风险、9 条 MI-UP 和 4 条 Q 均有承接或明确外围 / pending 放置。

6. 是否为了补矩阵新增了需求?

   回答:没有。矩阵中的所有编号均来自 Step 7~15;没有新对象、规则、接口、状态、schema、指标或产品。

## 4. 当前文档问题诊断

| 追溯候选 | 问题 | 当前处置 |
|---|---|---|
| 只追 US -> F | BR、D、AC 和 owner 红线会消失 | 使用规范固定六列主矩阵 |
| 将 IF / DEP / NFR 强加到主矩阵 | 破坏固定结构且每行过载 | 另建能力级补充矩阵 |
| 外围功能不进入矩阵 | 会被误判为孤儿或被后续遗忘 | 保留五行并标注外围 / Step 15 挂起 |
| Pending seam 映射到 positive AC | 伪造 readiness | 只映射 conservative AC 和 MI-UP / Q |
| 为没有映射的项现场补规则 | Step 16 越权新增需求 | 若发现缺口应回退;本次未发现 |
| 旧功能 / 指标编号混入 | full-restart 污染 | 只接受 Step 7~15 的 `*-MI-*` 正式校准编号 |

## 5. 改动前后对比

| 维度 | 旧正式 00 | 当前 Step 16 |
|---|---|---|
| 主轴 | 旧 F 与测试 / 数字松散映射 | F-MI 核心 / 外围功能统一主轴 |
| 纵向链 | 故事、功能、规则、数据、验收关系靠阅读猜测 | 固定矩阵显式连接 |
| 横切项 | Interface / NFR / blocker 容易丢失 | 补充矩阵和反向覆盖表 |
| 外围 | 多架构等混入核心 | 明确外围并由 AC-MI-030 / Step 15 挂起 |
| Readiness | 构建 / 安全指标暗示完成 | 追溯只证明设计覆盖,不证明实现结果 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只映射 15 条核心 F | 表短 | 外围已确认方向会成为追溯盲区 | 不采用 |
| 为外围新增专用 AC | 对称 | 违反 Step 16 不新增前文结论 | 不采用;只复用 AC-MI-030 |
| 固定主矩阵 + 三张补充 / 审计表 | 规范兼容且覆盖完整 | 文档较长 | 采用 |

## 7. 结构化中间产物

### 7.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| `F-MI-001` Variant 与 persona 镜像定义承接 | C-MI-1 | US-MI-001/003 | BR-MI-001/003/004 | D-MI-001/003~005 | AC-MI-001~005;AC-MI-026~029 |
| `F-MI-002` Mapping 来源有效性判定 | C-MI-1 | US-MI-002 | BR-MI-002~005 | D-MI-002~005 | AC-MI-001~005;AC-MI-026~029 |
| `F-MI-003` 镜像定义来源追溯 | C-MI-1 | US-MI-002/003 | BR-MI-001/003~005 | D-MI-001~005 | AC-MI-001~005;AC-MI-026~029 |
| `F-MI-004` Pinned 静态装配基线形成 | C-MI-2 | US-MI-004 | BR-MI-006/008/010 | D-MI-006/009/010/012 | AC-MI-006~010;AC-MI-026~029 |
| `F-MI-005` 静态输入与 live state 边界判定 | C-MI-2 | US-MI-004/005 | BR-MI-007/008/010 | D-MI-006/010~012 | AC-MI-006~010;AC-MI-026~029 |
| `F-MI-006` Base 到 variant 派生与修订追溯 | C-MI-2 | US-MI-004/006 | BR-MI-009/010 | D-MI-007~009/012 | AC-MI-006~010;AC-MI-026~029 |
| `F-MI-007` 受控构建意图形成 | C-MI-3 | US-MI-007/008 | BR-MI-011/013/015 | D-MI-013/017/018 | AC-MI-011~015;AC-MI-026~029 |
| `F-MI-008` 构建输入快照与执行交接 | C-MI-3 | US-MI-007/009 | BR-MI-012~015 | D-MI-014~016/018 | AC-MI-011~015;AC-MI-026~029 |
| `F-MI-009` 构建候选结果与不确定性分层 | C-MI-3 | US-MI-007/009 | BR-MI-013~015 | D-MI-014/016/018 | AC-MI-011~015;AC-MI-026~029 |
| `F-MI-010` 候选 digest 与 provenance 绑定 | C-MI-4 | US-MI-010/012 | BR-MI-016/018/020 | D-MI-019/025 | AC-MI-016~020;AC-MI-026~029 |
| `F-MI-011` 正式适用证据门禁承接 | C-MI-4 | US-MI-011 | BR-MI-017/018/020 | D-MI-020~023/025 | AC-MI-016~020;AC-MI-026~029 |
| `F-MI-012` 镜像资格与 Artifact handoff 分层 | C-MI-4 | US-MI-011/012 | BR-MI-018~020 | D-MI-019/020/022/024/025 | AC-MI-016~020;AC-MI-026~029 |
| `F-MI-013` 镜像供给 availability 管理 | C-MI-5 | US-MI-014/015 | BR-MI-021/022/025 | D-MI-016/024/026/027 | AC-MI-021~029 |
| `F-MI-014` Pinned 可实例化镜像入口供给 | C-MI-5 | US-MI-013/015 | BR-MI-021/023/024 | D-MI-016/024/027/030 | AC-MI-021~029 |
| `F-MI-015` 供给交接与消费 gap 分层 | C-MI-5 | US-MI-014/015 | BR-MI-023~025 | D-MI-026/028~030 | AC-MI-021~029 |
| `F-MI-E01` 多架构供给增强 | 外围增强 | US-MI-E01 | BR-MI-E01/E02 | D-MI-E01/E04 | AC-MI-030;Step 15 按 Q-MI-002 挂起 |
| `F-MI-E02` 特殊收缩 variant 增强 | 外围增强 | US-MI-E02 | BR-MI-E01/E02 | D-MI-E01/E04 | AC-MI-030;Step 15 按 Q-MI-001 挂起 |
| `F-MI-E03` 安全变化快速重建增强 | 外围增强 | US-MI-E03 | BR-MI-E01 | D-MI-E04 | AC-MI-030;Step 15 按外围增强挂起 |
| `F-MI-E04` 加固基础镜像承接增强 | 外围增强 | US-MI-E04 | BR-MI-E01/E02 | D-MI-E02/E04 | AC-MI-030;Step 15 按 MI-UP-008 挂起 |
| `F-MI-E05` 只读供给使用摘要增强 | 外围增强 | US-MI-E05 | BR-MI-E03 | D-MI-E03/E04 | AC-MI-030;Step 15 按外围增强挂起 |

能力级停审:

| 节点 | 功能范围 | 小循环覆盖 | 结果 |
|---|---|---|---|
| C-MI-1 | F-MI-001~003 | US / BR / D / AC 全有,无 mapping truth 越界 | pass |
| C-MI-2 | F-MI-004~006 | US / BR / D / AC 全有,无 live-state / owner 串线 | pass |
| C-MI-3 | F-MI-007~009 | US / BR / D / AC 全有,无 adapter outcome 伪造 | pass |
| C-MI-4 | F-MI-010~012 | US / BR / D / AC 全有,无 evidence / Artifact truth 伪造 | pass |
| C-MI-5 | F-MI-013~015 | US / BR / D / AC 全有,无 consumer / container 串线 | pass |
| 外围 | F-MI-E01~E05 | 已有 US / BR / D 边界和 AC-MI-030,不进核心分母 | pass |

### 7.2 接口、依赖、质量与否决补充矩阵

| 能力范围 | 对外能力接口 | 依赖 / seam | 能力级与全局 NFR | AC 承接 | VETO 保护 |
|---|---|---|---|---|---|
| C-MI-1 | IF-MI-001/002 | DEP-MI-001/002;runtime + ref / conditional compile | NFR-MI-001~003/017~022 | AC-MI-001~005/026~029 | VETO-MI-001~003/007 |
| C-MI-2 | IF-MI-003/004 | DEP-MI-003~006;ref | NFR-MI-004~006/017~022 | AC-MI-006~010/026~029 | VETO-MI-001~003/007 |
| C-MI-3 | IF-MI-005~008 | DEP-MI-007~009;event / adapter / ref | NFR-MI-007~009/017~022 | AC-MI-011~015/026~029 | VETO-MI-001/004/007 |
| C-MI-4 | IF-MI-009~011 | DEP-MI-010~013;ref / adapter(pending) | NFR-MI-010~012/017~022 | AC-MI-016~020/026~029 | VETO-MI-001/005/007 |
| C-MI-5 | IF-MI-012~014 | 复用 DEP-MI-009/012;DEP-MI-014 runtime + ref | NFR-MI-013~022 | AC-MI-021~029 | VETO-MI-001~003/006/007 |
| 外围 | IF-MI-E01~E03 | DEP-MI-015/016;ref / snapshot | NFR-MI-018/019/022 | AC-MI-030 | VETO-MI-002/003/007 |

补充审计:IF-MI-001~014、IF-MI-E01~E03、DEP-MI-001~016、NFR-MI-001~022、AC-MI-001~030 和 VETO-MI-001~007 均至少出现一次。C-MI-5 对 registry / Artifact 只复用既有边,未重复定义第二依赖。当前仍无 event output。

### 7.3 风险、上游条件与待决策补充矩阵

| 能力范围 | 风险 | 上游条件 | 待决策 / 当前上限 |
|---|---|---|---|
| C-MI-1 | R-MI-001/003/007~009 | MI-UP-003/004 | Positive mapping / shared schema 保持 pending;no-fallback current |
| C-MI-2 | R-MI-002/003/007/008 | MI-UP-002/006 | Component / seed positive binding 保持 blocked;pin / no-body current |
| C-MI-3 | R-MI-003/004/007~009 | MI-UP-005 | Event positive lane unavailable;nightly / conservative outcome current |
| C-MI-4 | R-MI-003/005/007/008 | MI-UP-007 | Q-MI-004 evidence kind / priority pending;generic gate fail-closed current |
| C-MI-5 | R-MI-003/006~008 | MI-UP-001/007/009 | Exact entry / Artifact handoff / event output 不 ready;availability / gap semantics current |
| 外围 / 全局 | R-MI-008~010 | MI-UP-008 | Q-MI-001~003 按外围 / 04 挂起,不进入核心完成分母 |

补充审计:R-MI-001~010、MI-UP-001~009、Q-MI-001~004 均有能力或外围 / 全局承接;它们只限制范围和 positive lane,没有被当成功能或 AC 来源。

### 7.4 反向覆盖与跨能力审计

| 被审计集合 | 覆盖结论 | 孤儿 / 冲突 |
|---|---|---|
| C-MI-1~5 | 每个节点各有 3 个核心 US、3 个 F、5 个 BR、D / IF / DEP / NFR 和 5 个节点 AC | 无孤儿能力 |
| US-MI-001~015 | 每个核心故事至少映射 1 个 F;同一故事跨 F 仍停留在同一能力节点 | 无孤儿 / 跨节点重复故事 |
| US-MI-E01~E05 | 各映射同号外围 F | 无孤儿,不升级核心 |
| F-MI-001~015 | 每条均有 C、US、BR、D、AC | 无孤儿功能 |
| F-MI-E01~E05 | 每条均有外围 US / BR / D 边界和 AC-MI-030 / Step 15 挂起 | 无孤儿,不进核心分母 |
| BR-MI-001~025 | 每条至少保护 1 个核心 F,并由节点规则 AC / VETO 承接 | 无孤儿规则 |
| BR-MI-E01~E03 | 保护外围 F 并由 AC-MI-030 承接 | 无孤儿外围规则 |
| D-MI-001~030 | 每项至少支撑 / 限制 1 个核心 F,四类均由数据 AC 承接 | 无孤儿 / 重复 truth |
| D-MI-E01~E04 | 支撑外围 F,只在启用后形成 | 无孤儿 / owner 冲突 |
| IF-MI-001~014 | 每个接口均映射同节点核心 F 和功能 AC | 无孤儿接口 |
| IF-MI-E01~E03 | 映射外围功能与 AC-MI-030 | 无孤儿外围接口 |
| DEP-MI-001~016 | 每条依赖均映射核心或外围 F,类型与 Step 6 / 12 一致 | 无孤儿 / compile-runtime-event 冲突 |
| NFR-MI-001~022 | 能力级要求映射同节点,全局 017~022 由 AC-MI-026~029 跨链承接 | 无孤儿 / 全局硬塞局部 |
| AC-MI-001~030 | 001~025 对应五节点五类来源,026~030 对应跨链 / 外围来源 | 无来源验收为零 |
| VETO-MI-001~007 | 均回指 C / BR / D / NFR / DEP / MI-UP,且不承载一般缺陷 | 无来源或过宽 veto 为零 |
| R / MI-UP / Q | 全部在 §7.3 有影响放置,未伪装 closed / ready | 无漏挂 blocker / decision |
| Owner 边界 | Method、runtime、tools、member、Artifact、member-service、Sandbox、governance、observability 等 truth 未转入本仓 | 无边界串线 |
| Historical 污染 | 固定 Role 数、SLA、产品、架构枚举、retention 和测试结果未进入矩阵 | 无旧结论回流 |

### 7.5 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。F-MI-001~015 与 F-MI-E01~E05 均有对应 US。 |
| 是否存在没有闭环映射的功能需求 | 否。核心 F 映射 C-MI-1~5,外围 F 明确映射外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。所有核心 F 均有 BR-MI-001~025 承接。 |
| 是否存在没有数据归属支撑的功能需求 | 否。所有 F 均映射 truth / snapshot / ref / forbidden body 中的适用项。 |
| 是否存在没有接口能力承接的核心功能 | 否。IF-MI-001~014 覆盖 F-MI-001~015。 |
| 是否存在没有验收标准的功能需求 | 否。核心 F 有节点 AC;外围 F 由 AC-MI-030 和 Step 15 挂起。 |
| 是否存在没有承接的业务规则 | 否。核心 / 外围 BR 均映射 F、AC 或 VETO。 |
| 是否存在没有承接的数据归属要求 | 否。核心 / 外围 D 均映射 F、数据 AC 或边界 VETO。 |
| 是否存在没有来源的接口、依赖或 NFR | 否。全部有功能 / 能力 / 目标来源和 AC 承接。 |
| 是否存在没有来源的 AC / VETO | 否。AC-MI-001~030、VETO-MI-001~007 均可回指前文。 |
| 是否存在跨能力重复定义或边界串线 | 否。跨节点复用只复用 ref / dependency / global NFR,不重复 truth。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本 Step 没有新增编号或需求结论。 |
| 是否把 pending / fake / adapter 映射成 readiness | 否。MI-UP / Q 挂起和 conservative AC 保持显式。 |

### 7.6 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-MI-1~5 均有 US、F、BR、D、IF / DEP、NFR 和 AC / VETO 承接。 |
| 功能完整性 | F-MI-001~015 全部闭合;F-MI-E01~E05 保留为外围且不阻塞核心。 |
| 边界完整性 | 相邻 owner、四类数据、seam 类型、no-event-output、no-live-state 和 no-body 边界均可追溯。 |
| 质量 / 验收完整性 | NFR-MI-001~022 由节点 / 跨链 AC 承接,VETO 保护关键红线。 |
| Pending 完整性 | MI-UP-001~009、Q-MI-001~004 均保持受影响范围和正向上限,未伪关闭。 |
| Step 17 门禁 | 允许依据 Step 1~16 重建正式 `00-需求文档.md`;Step 17 只可重组 / 润色。 |

## 8. 回填草稿

正式 00 §16 完整回填 §7.1 主追溯矩阵、§7.5 漏项检查表和 §7.6 追溯结论。§7.2~7.4 保留在校准材料作为接口 / 质量 / blocker 的深层审计入口;正式正文在章节引言中明确这些补充矩阵存在,不得用主矩阵的六列限制来推导接口、NFR 或 pending 已被省略。

## 9. 待确认事项

本 Step 不新增待确认事项。MI-UP-001~009 与 Q-MI-001~004 继续使用 Step 15 的性质、影响和当前状态;矩阵出现它们只表示追溯到受影响范围,不表示已关闭。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否以功能需求为主轴形成固定结构主矩阵 | pass |
| C-MI-1~5 是否全部完成小循环并逐节点停审 | pass |
| 是否完成外围、IF / DEP / NFR / VETO 和风险 / blocker 补充审计 | pass |
| 是否完成规范漏项检查和扩展孤儿检查 | pass |
| 是否存在孤儿、重复、串线、依赖冲突或新需求 | no |
| 是否保持 pending / historical / readiness 纪律 | pass |

`gate_status = pass`;允许创建 Step 17 并重建正式 00,不得现场新增需求结论或进入正式 01。
