# Step 16. 需求追溯矩阵

## 1. Step 状态

- 状态：[x] 已完成并通过（2026-08-22）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 16
- 回填章节：`00-需求文档.md` §16（书写规范 4.16）
- 主轴：以功能需求为中心，矩阵只连接 Step 07~15 已确认项，不新增需求

### 1.1 Step 内计划

- [x] 读取 Step 16 SOP、书写规范 4.16 和 Step 07~15 全部编号产物
- [x] 确认 C-MS-1~5 已完成 Step 08~14 能力级停审
- [x] 按 C-MS-1 -> C-MS-5 建立 12 条核心功能主矩阵并逐节点停审
- [x] 将 4 条外围功能纳入主矩阵，明确不进入核心完成分母
- [x] 建立接口 / 依赖 / NFR / AC / VETO 补充矩阵
- [x] 建立风险 / MSVC-UP / Q 补充矩阵
- [x] 反向审计故事、功能、规则、数据、接口、依赖、NFR、AC / VETO 和开放项
- [x] 审计重复 truth、跨节点串线、依赖类型冲突、pending 伪关闭和历史污染
- [x] 形成漏项检查表、回填草稿和 Step 17 门禁

## 2. 本步输入

| 输入 | 状态 | 本步使用方式 |
|---|---|---|
| Step 07 | pass | 固定 C-MS-1~5 和外围能力层级 |
| Step 08 | pass | 固定 US-MS-001~015 / US-MS-E01~E04 |
| Step 09 | pass | FR-MS-001~012 / FR-MS-E01~E04 作为主矩阵主轴 |
| Step 10 | pass | 映射 BR-MS-001~050 |
| Step 11 | pass | 映射 D-MS-001~037 / D-MS-E01~E04 及跨节点复用 |
| Step 12 | pass | 补充映射 IB-MS-001~017 / IB-MS-E01~E04 和外部依赖边界 |
| Step 13 | pass | 补充映射 NFR-MS-001~020 |
| Step 14 | pass | 映射 AC-MS-001~039 / VF-MS-001~009 |
| Step 15 | pass | 映射 R-MS-001~013 / Q-MS-001~011 / MSVC-UP-001~009 的挂起上限 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个能力节点是否完成小循环？ | 是。C-MS-1~5 均已有 US、FR、BR、D、IB / dependency、NFR 和 AC / VF，并分别在 Step 08~14 停审。 |
| 故事如何连接功能？ | 15 条核心故事归并为 12 条核心功能；4 条外围故事与同号外围功能一一映射。 |
| 功能如何连接规则、数据和验收？ | §4 主矩阵逐功能列出既有 BR、D 和 AC；跨节点总规则与 NFR 验收只作复用，不创建第二主功能。 |
| 接口、依赖和 NFR 如何追溯？ | §6 另设能力级补充矩阵，保持规范主矩阵固定六列。 |
| 风险和 blocker 如何追溯？ | §7 将 R、MSVC-UP 和 Q 挂到受影响能力；它们只限制 positive lane，不作为功能或通过证据来源。 |
| 是否存在孤儿或串线？ | 未发现。反向覆盖、重复 owner、边界和依赖类型审计见 §8~10。 |
| 是否为补矩阵新增结论？ | 否。本 Step 没有新增编号、对象、状态、协议、指标、产品或验收事实。 |

## 4. 主追溯矩阵

> `~` 表示引用前文连续编号范围，不生成新条目。外围功能明确标为“外围增强”，不升级为核心闭环。

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| `FR-MS-001` 项目型宿主意图受理与范围判定 | C-MS-1 | US-MS-001 / 003 | BR-MS-001~004 / 006~007 / 046~049 | D-MS-001 / 004~007 | AC-MS-001 / 006 / 022 / 028 / 035~038 |
| `FR-MS-002` 宿主编排决定与重复冲突控制 | C-MS-1 | US-MS-001~002 | BR-MS-003~005 / 007 / 046~049 | D-MS-002~003；复用 D-MS-001 / 004~006；D-MS-007 禁止正文 | AC-MS-001 / 007 / 022 / 028 / 034 / 037~038 |
| `FR-MS-003` 正式宿主装配条件形成 | C-MS-2 | US-MS-004~005 | BR-MS-008~010 / 017 / 046~049 | D-MS-008 / 012 / 015~016；复用 D-MS-004~006 | AC-MS-002 / 008 / 023 / 029 / 034~037 / 039 |
| `FR-MS-004` 宿主承载与隔离装配协调 | C-MS-2 | US-MS-005~006 | BR-MS-011~017 / 046~049 | D-MS-009~010 / 012~017 | AC-MS-002 / 009 / 023 / 029 / 034~039 |
| `FR-MS-005` 宿主装配就绪与安全降级判定 | C-MS-2 | US-MS-005~006 | BR-MS-010 / 012 / 014~017 / 046~049 | D-MS-010~011 / 015~017；复用 D-MS-008~009 / 012~014 | AC-MS-002 / 010 / 023 / 029 / 035~039 |
| `FR-MS-006` 可信注册与宿主实例关联 | C-MS-3 | US-MS-007 / 009 | BR-MS-018~022 / 026 / 046~049 | D-MS-018~019 / 021 / 023；复用 D-MS-009 / 013 | AC-MS-003 / 011 / 024 / 030 / 035~039 |
| `FR-MS-007` 宿主接入与会话可用性维护 | C-MS-3 | US-MS-008~009 | BR-MS-020 / 023~026 / 046~049 | D-MS-019~024；复用 D-MS-009 | AC-MS-003 / 012 / 024 / 030 / 034~039 |
| `FR-MS-008` 宿主健康与失败分层判定 | C-MS-4 | US-MS-010 / 012 | BR-MS-027~030 / 036 / 046~049 | D-MS-025 / 028~030；复用 D-MS-009 / 020~021 | AC-MS-004 / 013 / 025 / 031 / 034~039 |
| `FR-MS-009` 宿主恢复、重启与终止控制 | C-MS-4 | US-MS-011~012 | BR-MS-031~036 / 046~049 | D-MS-026~030；复用 D-MS-002 / 009 / 025 | AC-MS-004 / 014 / 025 / 031 / 034~039 |
| `FR-MS-010` 宿主下线清理与关联失效 | C-MS-5 | US-MS-013 | BR-MS-037~039 / 042 / 045~049 | D-MS-031~032 / 035~037；复用 D-MS-009 / 014 / 019~020 | AC-MS-005 / 015 / 026 / 032 / 035~039 |
| `FR-MS-011` 残留与孤儿宿主对账处置 | C-MS-5 | US-MS-014 | BR-MS-040~042 / 044~049 | D-MS-032~033 / 035~037；复用 D-MS-009 / 025 / 028~029 | AC-MS-005 / 016 / 026 / 032 / 034~039 |
| `FR-MS-012` 宿主事实安全表达与交接分层 | C-MS-5 | US-MS-015 | BR-MS-042~049 | D-MS-034~037；复用 D-MS-003 / 009 / 019~020 / 025 / 031~033 | AC-MS-005 / 017 / 026 / 032 / 035~039 |
| `FR-MS-E01` 跨宿主容量与放置优化建议 | 外围增强 | US-MS-E01 | BR-MS-046~050 | D-MS-E01；复用允许的核心 safe snapshot | AC-MS-018 / 027 / 033~035 / 037 / 039 |
| `FR-MS-E02` 正式宿主资产预热 | 外围增强 | US-MS-E02 | BR-MS-009~017 / 046~050 | D-MS-E02；复用 D-MS-012 / 015~017 | AC-MS-019 / 027 / 033~036 / 038~039 |
| `FR-MS-E03` forensic 安全关联材料 | 外围增强 | US-MS-E03 | BR-MS-036 / 045~050 | D-MS-E03；复用 D-MS-034 / 037 | AC-MS-020 / 027 / 033 / 035~039 |
| `FR-MS-E04` 聚合宿主安全视图 | 外围增强 | US-MS-E04 | BR-MS-043 / 046~050 | D-MS-E04；复用已提交核心 truth | AC-MS-021 / 027 / 033~035 / 037 / 039 |

## 5. 能力级小循环停审

| 能力节点 | 核心故事 | 核心功能 | 规则 / 数据 | 核心 / 功能 AC | 结果 |
|---|---|---|---|---|---|
| C-MS-1 | US-MS-001~003 | FR-MS-001~002 | BR-MS-001~007；D-MS-001~007 | AC-MS-001 / 006~007 | pass；主语、意图、决定和历史完整 |
| C-MS-2 | US-MS-004~006 | FR-MS-003~005 | BR-MS-008~017；D-MS-008~017 | AC-MS-002 / 008~010 | pass；条件、装配、ready 和外部 owner 分层完整 |
| C-MS-3 | US-MS-007~009 | FR-MS-006~007 | BR-MS-018~026；D-MS-018~024 | AC-MS-003 / 011~012 | pass；注册、endpoint、host session 和兄弟边界完整 |
| C-MS-4 | US-MS-010~012 | FR-MS-008~009 | BR-MS-027~036；D-MS-025~030 | AC-MS-004 / 013~014 | pass；健康、处置、unknown 和实例世代完整 |
| C-MS-5 | US-MS-013~015 | FR-MS-010~012 | BR-MS-037~045；D-MS-031~037 | AC-MS-005 / 015~017 | pass；清理、对账、handoff 和结果分层完整 |
| 外围增强 | US-MS-E01~E04 | FR-MS-E01~E04 | BR-MS-046~050 + 适用核心规则；D-MS-E01~E04 | AC-MS-018~021 / 027 / 033 | pass；不进入核心完成分母，不成为写源 |

## 6. 接口、依赖、质量与否决补充矩阵

| 能力范围 | 能力接口 | 主要外部依赖边界 | NFR | AC 承接 | VETO 保护 |
|---|---|---|---|---|---|
| C-MS-1 | IB-MS-001~003 | Core / SDK compile；Identity / Work runtime + event | NFR-MS-001 / 004 / 007 / 010 / 013 / 017 / 020 | AC-MS-001 / 006~007 / 022 / 028 / 034~039 | VF-MS-001~003 / 006 / 008~009 |
| C-MS-2 | IB-MS-004~006 | Member Images / Sandbox runtime；承载 / registry adapter | NFR-MS-002 / 005 / 008~010 / 015 / 017~018 / 020 | AC-MS-002 / 008~010 / 023 / 029 / 034~039 | VF-MS-001 / 003~009 |
| C-MS-3 | IB-MS-007~009 | Member / Runtime 双向 runtime pending seam | NFR-MS-001 / 005 / 007~008 / 010 / 014 / 017~018 / 020 | AC-MS-003 / 011~012 / 024 / 030 / 034~039 | VF-MS-001~006 / 008~009 |
| C-MS-4 | IB-MS-010~012 | Member / Sandbox runtime；承载 adapter；Runtime ref | NFR-MS-002 / 005~006 / 008 / 010 / 012 / 014~018 / 020 | AC-MS-004 / 013~014 / 025 / 031 / 034~039 | VF-MS-001 / 003~009 |
| C-MS-5 | IB-MS-013~017 | Sandbox runtime；承载 adapter；Bus / Observability event | NFR-MS-003~006 / 008 / 010~012 / 015~020 | AC-MS-005 / 015~017 / 026 / 032 / 034~039 | VF-MS-001 / 003 / 005~009 |
| 外围增强 | IB-MS-E01~E04 | 核心 safe material；承载 / registry adapter；授权消费方 | NFR-MS-003~004 / 008 / 017 / 020 | AC-MS-018~021 / 027 / 033~039 | VF-MS-003 / 005 / 007 / 009 |

补充审计：IB-MS-001~017、IB-MS-E01~E04、NFR-MS-001~020、AC-MS-001~039 和 VF-MS-001~009 均至少出现一次。Step 12 的每条外部依赖边界均落入对应能力行；`ref` 不改变 compile / runtime / event 类型，adapter 不转移 authority，fake 不证明 readiness。

## 7. 风险、上游条件与待确认补充矩阵

| 能力范围 | 风险 | 上游条件 | 待确认 / 当前上限 |
|---|---|---|---|
| C-MS-1 | R-MS-002 / 007 / 011~012 | MSVC-UP-002 / 007~009 | Q-MS-002 / 007~008；项目型-only current，其他 launch fail closed |
| C-MS-2 | R-MS-003~008 / 010~011 / 013 | MSVC-UP-003~008 | Q-MS-003~009 / 011；positive assembly blocked，no-bypass current |
| C-MS-3 | R-MS-001~002 / 005 / 007 / 011 / 013 | MSVC-UP-001~002 / 006~008 | Q-MS-001~002 / 006~008；owner boundary current，positive IPC / session surface pending |
| C-MS-4 | R-MS-001~005 / 008 / 010~011 / 013 | MSVC-UP-001~004 / 006~007 | Q-MS-001~004 / 006~007 / 009 / 011；host disposition current，Runtime recovery excluded |
| C-MS-5 | R-MS-001 / 004 / 007~011 / 013 | MSVC-UP-001 / 004 / 007 | Q-MS-001 / 004 / 007 / 009~011；local attempt / gap current，external completion blocked |
| 外围 / 全局 | R-MS-006~013 | MSVC-UP-005 / 008~009 | Q-MS-005 / 008 / 011；外围不进核心，未来范围须重开 |

补充审计：R-MS-001~013、Q-MS-001~011 与 MSVC-UP-001~009 均有影响放置。MSVC-UP-009 是当前范围已解决项；出现在矩阵只表示其保护 C-MS-1 与未来重开边界，不表示重新 pending。

## 8. 反向覆盖审计

| 被审计集合 | 覆盖结论 | 孤儿 / 冲突 |
|---|---|---|
| C-MS-1~5 | 每个节点有 3 核心 US、2~3 核心 FR、节点 BR / D / IB / NFR 和闭环 / 功能 AC | 无孤儿能力 |
| US-MS-001~015 | 每个核心故事至少映射一个 FR；复用故事不跨出所属能力节点 | 无孤儿 / 跨节点重复故事 |
| US-MS-E01~E04 | 各映射同号外围 FR | 无孤儿，不升级核心 |
| FR-MS-001~012 | 每项有 C、US、BR、D、IB、NFR 和 AC / VF 承接 | 无孤儿核心功能 |
| FR-MS-E01~E04 | 每项有外围 US、规则 / 数据边界、IB 和 AC | 无孤儿，不进核心分母 |
| BR-MS-001~045 | 每条至少保护同节点核心 FR，并由 AC-MS-022~026 / VF 承接 | 无孤儿规则 |
| BR-MS-046~050 | 保护跨节点 / 外围 FR，并由 AC-MS-027 / VF 承接 | 无孤儿全局规则 |
| D-MS-001~037 | 每项至少支撑或限制同节点 FR，并由 AC-MS-028~032 / VF-MS-005 承接 | 无孤儿 / 重复 truth |
| D-MS-E01~E04 | 各支撑同号外围 FR，并由 AC-MS-033 承接 | 无孤儿，不成外部 truth |
| IB-MS-001~017 | 每个接口均在 Step 12 映射核心 FR，并出现在 §6 | 无孤儿核心接口 |
| IB-MS-E01~E04 | 各映射同号外围 FR | 无孤儿外围接口 |
| 外部依赖边界 | Step 12 正式依赖行均由 §6 对应能力承接；policy / credential 无 FR / owner 的边不被补造 | 无孤儿依赖或类型冲突 |
| NFR-MS-001~020 | 能力 NFR 映射同节点；全局质量约束由 AC-MS-034~039 / VF 承接 | 无孤儿 / 全局硬塞局部 |
| AC-MS-001~039 | 001~005 对应闭环，006~021 对应功能，022~027 对应规则，028~033 对应数据，034~039 对应 NFR | 无来源验收为 0 |
| VF-MS-001~009 | 均回指 C / BR / D / NFR / seam，且不承载一般缺陷 | 无来源或过宽 veto 为 0 |
| R / Q / MSVC-UP | 全部在 §7 有影响放置，状态没有被伪造 closed / ready | 无漏挂开放项 |

## 9. 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。FR-MS-001~012 与 FR-MS-E01~E04 均有对应 US。 |
| 是否存在没有闭环映射的功能需求 | 否。核心 FR 映射 C-MS-1~5，外围 FR 明确映射外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。所有核心 FR 均有同节点 BR-MS 和跨节点 BR-MS-046~049。 |
| 是否存在没有数据归属支撑的功能需求 | 否。所有 FR 均映射 truth / snapshot / ref / forbidden-body 中适用项。 |
| 是否存在没有接口能力承接的功能需求 | 否。IB-MS-001~017 / E01~E04 覆盖全部核心 / 外围 FR。 |
| 是否存在没有验收标准的功能需求 | 否。核心和外围 FR 均有独立功能 AC 及适用边界 / 数据 / NFR AC。 |
| 是否存在没有承接的业务规则 | 否。BR-MS-001~050 均映射 FR、AC 或 VF。 |
| 是否存在没有承接的数据归属要求 | 否。D-MS-001~037 / E01~E04 均映射 FR、数据 AC 或边界 VF。 |
| 是否存在没有来源的接口、依赖或 NFR | 否。全部具有功能 / 能力 / 规则来源和 AC 承接。 |
| 是否存在没有来源的 AC / VF | 否。AC-MS-001~039、VF-MS-001~009 均可回指前文。 |
| 是否存在跨能力重复定义或边界串线 | 否。跨节点只复用同一 truth / ref / snapshot / dependency / global NFR，不复制 owner。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。本 Step 没有新增任何编号或需求结论。 |
| 是否把 pending / placeholder / fake / adapter 映射成 readiness | 否。MSVC-UP / Q 的 positive 上限保持 blocked / waiting。 |

## 10. 重复定义与边界串线审计

| 审计对象 | 结论 | 保护口径 |
|---|---|---|
| ProjectMember / GlobalMember / authorization | 无 owner 重复 | 只作 ref / snapshot；Identity / Work truth 不转移 |
| 宿主实例 / Member 主体 / Runtime run | 无对象压平 | 本仓拥有 host truth / host session 壳；Member 主体和 Runtime run 外置 |
| pinned image / Role mapping / image content | 无第二解析或构建 truth | 正式消费 Member Images pinned entry 供给方向；exact contract 与 positive integration 仍 blocked |
| SandboxBinding / Tool execution / isolation truth | 无跨仓串线 | 本仓只拥有宿主级 binding 关联；逐动作 execute 和 enforcement 外置 |
| health / runtime progress / backend / business success | 无单一失败 truth 压平 | 本仓只拥有四层宿主分类，不推断 Runtime 或业务结论 |
| cleanup / delivery / observed / accepted | 无结果层级压平 | 本地决定 / attempt / gap 与外部 owner 状态分层 |
| compile / runtime / event / ref / adapter / fake | 无类型冲突 | 仅 Core / SDK compile；其他保持原 seam；fake 不证明 readiness |
| 核心 / 外围 | 无重复功能或隐式前置 | E01~E04 只读 / 预热 / 调查增强，不反写核心 truth |
| historical material | 无旧编号、阈值、协议、产品或结果回流 | 旧 README / 正式 00~06 仅留污染审计 |

## 11. 追溯结论与 Step 17 门禁

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-MS-1~5 均有 US、FR、BR、D、IB / dependency、NFR 和 AC / VF 承接。 |
| 功能完整性 | FR-MS-001~012 全部闭合；FR-MS-E01~E04 保留为外围且不阻塞核心。 |
| 边界完整性 | L1 / Member / Runtime / Images / Tools / Sandbox / Governance / Observability / infrastructure owner 均可追溯且未迁移。 |
| 质量与验收完整性 | NFR-MS-001~020 由六类 AC 承接，VF 保护核心硬边界。 |
| Pending 完整性 | R-MS-001~013、Q-MS-001~011、MSVC-UP-001~009 均保留影响和 positive 上限，未伪关闭。 |
| Step 17 门禁 | 允许依据 Step 01~16 重建正式 `00-需求文档.md`；Step 17 只可重组、统一术语和补交叉引用。 |

### 11.1 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_16_traceability_matrix.md`

正式装配时完整回填 §4 主追溯矩阵、§9 漏项检查表和 §11 追溯结论；§6~10 保留为校准审计入口，正式章节用短说明引用，不把补充矩阵省略误读成接口、NFR 或 pending 已关闭。

### 11.2 门禁自检

- [x] 固定六列主矩阵以 16 项功能为唯一主轴
- [x] C-MS-1~5 能力级小循环均已完成并停审
- [x] 外围、接口 / 依赖 / NFR / VF 和风险 / blocker 补充审计齐备
- [x] 反向覆盖、规范漏项、重复 owner、边界串线和依赖冲突审计通过
- [x] 无孤儿、新需求、pending 伪关闭、readiness 伪造或 historical 回流

结论：`gate_status = pass`，`current_state = stop_review`。下一动作是先更新 flow / ledger，再读取 Step 17 SOP、书写规范正式结构与三层装配门禁，删除旧正式正文并重建 `00-需求文档.md`。
