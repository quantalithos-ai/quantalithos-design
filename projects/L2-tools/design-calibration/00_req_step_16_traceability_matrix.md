# L2-tools 需求 Step 16:需求追溯矩阵

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §16
> 本步原则: 只连接 Step 7~15 已确认的能力、故事、功能、规则、数据、接口、非功能与验收关系;不在矩阵中补写新需求、协议、实现或 evidence。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 16 |
| status | `completed_stop_review` |
| current_module | `traceability_and_orphan_audit:completed` |
| gate_status | `pass` |
| gate_reason | 23 项 FR 的固定六列主矩阵完整,接口 / 依赖、NFR、VF 与跨能力审计均无孤儿项或新增关系。 |
| next_allowed_action | 更新 flow / ledger 后创建 `00_req_step_17_formal_document_assembly.md`;正式 `00-需求文档.md` 仍不可写。 |
| source_files | `00_req_step_07_core_capability_loop.md`~`00_req_step_15_risks_open_questions.md`;`standards/document/需求文档讨论流程_SOP.md`;`standards/document/需求文档书写规范.md` |
| formal_write_status | `blocked_until_step_17_three_level_gate` |

### 1.1 Step 内计划

| 序号 | 动作 | 状态 | 可审查产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目 ledger、需求 flow 与 Step 7~15 | done | 三层恢复点只允许 Step 16,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 16、规范 §4.16 与当前中间产物规范 | done | 固定六列主矩阵、固定漏项检查表与固定十段结构。 |
| 3 | 逐能力检查故事、FR、BR、DR、IB / DB、NFR、AC / VF 停审 | done | 五节点与外围增强均已在 Step 8~14 停审。 |
| 4 | 以 FR 为主轴抽取 23 行既有映射 | done | 17 项核心 FR、6 项外围 FR,无合并漏项。 |
| 5 | 审计接口 / 依赖、NFR 与 VF 承接 | done | 23 项 IB、8 项 DB、19 项 NFR、13 项 VF 均可定位。 |
| 6 | 执行跨能力与 blocker 影响审计 | done | 无重复定义、边界串线或 blocker 状态漂移。 |
| 7 | 形成回填草稿和漏项检查表 | done | 正式 §16 可原样承接主矩阵与检查结论。 |
| 8 | 自检与进入下一步条件 | done | 不新增对象、关系、测试或实施事实;允许进入 Step 17。 |

## 2. 本步输入

| 输入 | 已读取结论 | 本步使用方式 |
|---|---|---|
| Step 7 | `C-L2T-1~5`、条件路径、核心 / 外围分层及能力级停审轴已固定。 | 作为核心能力闭环列和跨能力审计主轴。 |
| Step 8 | `US-L2T-001~017` 与 `US-L2T-E01~E06` 已按能力节点收敛。 | 只承接已确认 FR -> US 映射。 |
| Step 9 | `FR-L2T-001~017` 与 `FR-L2T-E01~E06` 已确认。 | 作为主矩阵 23 行唯一主轴。 |
| Step 10 | `BR-L2T-001~042` 与 `BR-L2T-E01` 已映射到 FR。 | 只复制主要规则映射,不重新解释规则。 |
| Step 11 | `DR-L2T-001~034` 已分类并映射到 FR。 | 只复制主要数据归属映射。 |
| Step 12 | `IB-L2T-001~019`、`IB-L2T-E01~E04` 与 `DB-L2T-001~008` 边界记录全集已确认;当前依赖子集与 pending / future 记录已区分。 | 在主矩阵外做接口 / 依赖孤儿审计,不得把记录全集误写成八条当前依赖。 |
| Step 13 | `NFR-L2T-001~019` 的 FR 来源已确认。 | 在主矩阵外做 NFR 范围审计,不新增逐 FR 关系。 |
| Step 14 | `AC-L2T-001~039` 与 `VF-L2T-001~013` 已确认。 | 主矩阵承接既有 AC;VF 按既有能力范围单列。 |
| Step 15 | `R-L2T-001~012`、`Q-L2T-001~008` 与 `L2T-UP-001~009` 开放状态已确认。 | 检查矩阵是否误闭 blocker 或伪称 readiness。 |
| SOP Step 16 / 规范 §4.16 | 主矩阵固定为以 FR 为中心的六列结构,另有漏项检查表。 | 不改列、不用总结替代矩阵、不现场补项。 |

## 3. SOP 问题回答

| 应问问题 | 回答 |
|---|---|
| 每个核心能力节点是否完成故事到验收的小循环 | 是。Step 8~14 的五节点停审均已通过,且开放约束继续保持开放;这些约束未被改写为失败或完成事实。 |
| 每个核心能力节点对应哪些故事 | `C-L2T-1~5` 的故事范围见 §7.1 每行 US 映射与 §7.5 能力范围审计。 |
| 每个用户故事是否有功能承接 | 是。17 项核心故事和 6 项外围故事均至少映射一项 FR。 |
| 每个 FR 是否有规则保护 | 是。17 项核心 FR 各有主要 BR;6 项外围 FR 共同受 `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` 保护。 |
| 每个 FR 是否有数据归属要求 | 是。核心 FR 均有具体 DR;外围只读消费核心 truth 或可重建快照,未新增外围 truth。 |
| 每个 FR 是否有验收标准 | 是。核心 FR 有节点 AC、独立功能 AC 及适用规则 / 数据 / NFR AC;外围 FR 有 `AC-L2T-023` 与适用边界 AC。 |
| 是否有孤儿接口、依赖、NFR、AC 或 VF | 无。附属审计覆盖全部 23 项 IB、8 项 DB、19 项 NFR、39 项 AC 与 13 项 VF。 |
| 是否有跨能力重复定义或边界串线 | 无。相似关系分别由本地 truth、外部 ref / snapshot、forbidden body 和 owner 边界区分。 |
| 是否为补齐矩阵新增未确认项 | 否。所有 ID 和关系均来自 Step 7~15;未新增字段、API、事件、阈值、owner 或 route。 |

## 4. 当前文档问题诊断

| 诊断对象 | 当前问题 | 对 Step 16 的约束 |
|---|---|---|
| 旧正式 `00` | 旧需求没有以当前五节点为轴的六列追溯矩阵,且混有失效的 builtin / MCP / extras、事件与 SLA 主线。 | 不在旧矩阵上增补;完全以当前 Step 7~15 重建。 |
| Step 9~11 映射 | FR -> BR 与 FR -> DR 已存在,但分散在不同中间产物。 | 只聚合 ID 映射,不把规则和数据正文复制到单元格。 |
| Step 12 | 接口与依赖不是规范六列字段。 | 在主矩阵外做独立覆盖审计,防止改动固定表头。 |
| Step 13 | NFR 多数跨多个 FR 或全仓,逐 FR 重复会制造虚假精度。 | 复用 Step 13 已确认的 NFR -> FR 范围表。 |
| Step 14 | AC 可按既有来源映射到 FR;VF 只显式确认到能力 / 范围,没有逐 FR 表。 | AC 进入第六列;VF 单列复用已确认范围,不新增逐 FR -> VF 关系。 |
| Step 15 | 开放 blocker 不阻塞需求映射,但阻塞具体正向 contract 与 readiness。 | 矩阵不得把 candidate / open 润色为 resolved 或 implementation-ready。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 追溯主轴 | 旧正式文档缺少符合当前规范的完整主矩阵。 | 以 23 项 FR 为唯一主轴形成固定六列矩阵。 | 满足 §4.16 并可直接发现孤儿 FR。 |
| 核心 / 外围 | 旧材料把具体库存和客户端能力混入主线。 | 17 项核心与 6 项外围均入矩阵,但外围明确不成为核心前置。 | 保留完整追溯而不误升范围。 |
| 接口 / NFR / VF | 分散在 Step 12~14,强塞六列会改变规范或新增关系。 | 分别建立范围审计表。 | 保持固定表头与既有关系 authority。 |
| Blocker | 旧材料可被误读为协议和集成已经存在。 | 九项 blocker 保持开放,逐项说明只阻塞后续定稿。 | 防止追溯完整被误写成 readiness。 |
| 验收事实 | 旧链混有测试阈值和完成语气。 | 只引用需求层 AC / VF 定义,不写 run、evidence 或签署。 | 验收定义不等于实际验收。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 采用:FR 为主轴的固定六列矩阵 + 独立附属审计 | 符合规范,完整覆盖核心与外围,且接口 / NFR / VF 可审计。 | 附属表数量较多。 | 采用;完整性优先于摘要化。 |
| 不采用:把 IB / DB / NFR / VF 全塞入主矩阵 | 单表看似集中。 | 破坏固定六列并会暗示未经确认的逐 FR -> VF 关系。 | 不采用。 |
| 不采用:只列核心 17 项 FR | 表更短。 | 造成 6 项外围 FR、外围故事和边界验收孤儿。 | 不采用。 |
| 不采用:按能力节点或故事作主轴 | 能突出业务叙事。 | 不符合 §4.16,无法直接检查每项 FR 的规则、数据和验收。 | 不采用。 |
| 不采用:为开放 seam 补写 owner / schema / route | 表面可消除空白。 | 会越过 Step 15 blocker authority 并伪造合同。 | 不采用;保持 open / candidate / fail-closed。 |

## 7. 结构化中间产物

### 7.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| `FR-L2T-001` 稳定工具身份建立 | `C-L2T-1` | `US-L2T-001`;`US-L2T-004` | `BR-L2T-001`;`BR-L2T-005` | `DR-L2T-001`;`DR-L2T-005`;`DR-L2T-006` | `AC-L2T-001`;`AC-L2T-006`;`AC-L2T-024`;`AC-L2T-026`;`AC-L2T-030`;`AC-L2T-032~039` |
| `FR-L2T-002` 正式工具定义表达与受控读取 | `C-L2T-1` | `US-L2T-001`;`US-L2T-003`;`US-L2T-004` | `BR-L2T-002~004`;`BR-L2T-007`;`BR-L2T-008` | `DR-L2T-002`;`DR-L2T-005`;`DR-L2T-006` | `AC-L2T-001`;`AC-L2T-007`;`AC-L2T-024~025`;`AC-L2T-027`;`AC-L2T-030`;`AC-L2T-032~039` |
| `FR-L2T-003` 定义演进、兼容与追溯 | `C-L2T-1` | `US-L2T-002`;`US-L2T-009` | `BR-L2T-005~007`;`BR-L2T-021` | `DR-L2T-002`;`DR-L2T-003`;`DR-L2T-005`;`DR-L2T-006` | `AC-L2T-001`;`AC-L2T-008`;`AC-L2T-025~026`;`AC-L2T-030`;`AC-L2T-032~039` |
| `FR-L2T-004` 外部能力关联分类 | `C-L2T-2` | `US-L2T-005` | `BR-L2T-009`;`BR-L2T-012` | `DR-L2T-007`;`DR-L2T-012` | `AC-L2T-002`;`AC-L2T-009`;`AC-L2T-024`;`AC-L2T-028`;`AC-L2T-030`;`AC-L2T-033~039` |
| `FR-L2T-005` 受控 capability binding 建立 | `C-L2T-2` | `US-L2T-005`;`US-L2T-006` | `BR-L2T-010~012`;`BR-L2T-014` | `DR-L2T-008`;`DR-L2T-010~012` | `AC-L2T-002`;`AC-L2T-010`;`AC-L2T-024`;`AC-L2T-026~028`;`AC-L2T-030~039` |
| `FR-L2T-006` Binding 校验、失效与变化追溯 | `C-L2T-2` | `US-L2T-006`;`US-L2T-007` | `BR-L2T-013~015` | `DR-L2T-009~012` | `AC-L2T-002`;`AC-L2T-011`;`AC-L2T-025~026`;`AC-L2T-030~039` |
| `FR-L2T-007` Canonical invocation 语境形成 | `C-L2T-3` | `US-L2T-004`;`US-L2T-008` | `BR-L2T-016`;`BR-L2T-018` | `DR-L2T-013`;`DR-L2T-015~018` | `AC-L2T-003`;`AC-L2T-012`;`AC-L2T-024`;`AC-L2T-027`;`AC-L2T-030~039` |
| `FR-L2T-008` 合同一致的调用受理与执行前拒绝 | `C-L2T-3` | `US-L2T-008`;`US-L2T-012` | `BR-L2T-018~020` | `DR-L2T-013~018` | `AC-L2T-003`;`AC-L2T-013`;`AC-L2T-025~027`;`AC-L2T-030~039` |
| `FR-L2T-009` 跨调用方与承载方式统一调用语义 | `C-L2T-3` | `US-L2T-009`;`US-L2T-010` | `BR-L2T-017`;`BR-L2T-021`;`BR-L2T-022`;`BR-L2T-027` | `DR-L2T-002`;`DR-L2T-013`;`DR-L2T-015~018` | `AC-L2T-003`;`AC-L2T-014`;`AC-L2T-024`;`AC-L2T-026~027`;`AC-L2T-030~039` |
| `FR-L2T-010` 执行要求判断 | `C-L2T-4` | `US-L2T-003`;`US-L2T-011` | `BR-L2T-003`;`BR-L2T-004`;`BR-L2T-023` | `DR-L2T-002`;`DR-L2T-007~011`;`DR-L2T-013`;`DR-L2T-015`;`DR-L2T-019`;`DR-L2T-026` | `AC-L2T-004`;`AC-L2T-015`;`AC-L2T-024`;`AC-L2T-027`;`AC-L2T-030~039` |
| `FR-L2T-011` 正式 authorization 结果承接与 fail-closed | `C-L2T-4` | `US-L2T-011`;`US-L2T-012` | `BR-L2T-024`;`BR-L2T-025` | `DR-L2T-020`;`DR-L2T-022`;`DR-L2T-024`;`DR-L2T-026` | `AC-L2T-004`;`AC-L2T-016`;`AC-L2T-025`;`AC-L2T-028`;`AC-L2T-030~039` |
| `FR-L2T-012` 条件化执行承载与隔离不可旁路 | `C-L2T-4` | `US-L2T-010`;`US-L2T-011`;`US-L2T-013` | `BR-L2T-023`;`BR-L2T-025~027` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-019~024`;`DR-L2T-026` | `AC-L2T-004`;`AC-L2T-017`;`AC-L2T-024~025`;`AC-L2T-027`;`AC-L2T-030~039` |
| `FR-L2T-013` Sandbox 交接与执行材料语义消费 | `C-L2T-4` | `US-L2T-010`;`US-L2T-013` | `BR-L2T-028~031` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-021`;`DR-L2T-023`;`DR-L2T-025`;`DR-L2T-026` | `AC-L2T-004`;`AC-L2T-018`;`AC-L2T-024`;`AC-L2T-027`;`AC-L2T-029~039` |
| `FR-L2T-014` Normalized tool result 形成 | `C-L2T-5` | `US-L2T-013`;`US-L2T-014` | `BR-L2T-030`;`BR-L2T-032`;`BR-L2T-034` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-025`;`DR-L2T-027`;`DR-L2T-032`;`DR-L2T-034` | `AC-L2T-005`;`AC-L2T-019`;`AC-L2T-024`;`AC-L2T-027`;`AC-L2T-030~039` |
| `FR-L2T-015` Normalized error 与无执行终态形成 | `C-L2T-5` | `US-L2T-012`;`US-L2T-014`;`US-L2T-016` | `BR-L2T-019`;`BR-L2T-020`;`BR-L2T-025`;`BR-L2T-032~034` | `DR-L2T-013~015`;`DR-L2T-020`;`DR-L2T-025`;`DR-L2T-028`;`DR-L2T-032`;`DR-L2T-034` | `AC-L2T-005`;`AC-L2T-020`;`AC-L2T-024~027`;`AC-L2T-030~039` |
| `FR-L2T-016` Tool-domain audit 追溯 | `C-L2T-5` | `US-L2T-015`;`US-L2T-016` | `BR-L2T-035~037`;`BR-L2T-039`;`BR-L2T-042` | `DR-L2T-001~003`;`DR-L2T-013~015`;`DR-L2T-017`;`DR-L2T-020`;`DR-L2T-025`;`DR-L2T-027~029`;`DR-L2T-032~034` | `AC-L2T-005`;`AC-L2T-021`;`AC-L2T-024~026`;`AC-L2T-029~039` |
| `FR-L2T-017` 安全外部交接与降级显式化 | `C-L2T-5` | `US-L2T-016`;`US-L2T-017` | `BR-L2T-035`;`BR-L2T-038~042` | `DR-L2T-027~031`;`DR-L2T-033`;`DR-L2T-034` | `AC-L2T-005`;`AC-L2T-022`;`AC-L2T-024~027`;`AC-L2T-030~039` |
| `FR-L2T-E01` 工具契约搜索、浏览与比较 | 外围增强:契约搜索 / 浏览 / diff | `US-L2T-E01` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-004` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-031`;`AC-L2T-034~036`;`AC-L2T-038` |
| `FR-L2T-E02` 批量维护与兼容提示 | 外围增强:批量维护 / 兼容提示 | `US-L2T-E02` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-004` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-031`;`AC-L2T-034~036`;`AC-L2T-038` |
| `FR-L2T-E03` 派生索引与一致性报告 | 外围增强:派生索引 / 一致性检查 | `US-L2T-E03` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-004` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-031`;`AC-L2T-034~036`;`AC-L2T-038` |
| `FR-L2T-E04` 只读诊断与审计摘要 | 外围增强:只读诊断 / 审计摘要 | `US-L2T-E04` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-031`;`DR-L2T-034` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-031`;`AC-L2T-033~036` |
| `FR-L2T-E05` 客户端消费说明 | 外围增强:客户端消费说明 | `US-L2T-E05` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-006`;`DR-L2T-034` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-033~036` |
| `FR-L2T-E06` 契约管理入口 | 外围增强:管理入口 | `US-L2T-E06` | `BR-L2T-007`;`BR-L2T-041`;`BR-L2T-E01` | `DR-L2T-034` 和适用核心 truth 的只读消费 | `AC-L2T-023`;`AC-L2T-025`;`AC-L2T-027`;`AC-L2T-033~036`;`AC-L2T-038` |

### 7.2 接口与依赖覆盖审计

| FR 范围 | 接口承接 | 主要外部依赖 | 结论 |
|---|---|---|---|
| `FR-L2T-001~003` | `IB-L2T-001~004` | `DB-L2T-001`;`DB-L2T-005`;适用时 `DB-L2T-006` | 身份 / 定义建立、读取、演进和安全变化边界完整;`DB-L2T-001` 当前编译期关系已承接,具体 Tools-specific shared schema / contract authority 仍为候选并待闭口。 |
| `FR-L2T-004~006` | `IB-L2T-005~008` | `DB-L2T-002`;适用时 `DB-L2T-006` | Binding 变更、查询、检查和变化输出完整;Hub truth 不复制。 |
| `FR-L2T-007~009` | `IB-L2T-002`;`IB-L2T-009~010`;适用时 `IB-L2T-015` | `DB-L2T-001`;`DB-L2T-005`;条件化 `DB-L2T-004` | Canonical invocation 与 Runtime consumption 完整;carrier 不分叉语义。 |
| `FR-L2T-010~012` | `IB-L2T-010~013`;`IB-L2T-019`;适用时 `IB-L2T-015` | pending `DB-L2T-003`;条件化 `DB-L2T-004` | `IB-L2T-019` 同步消费正式 authorization 结果,`IB-L2T-012` 只承接变化输入;owner 未解析时 fail closed,执行承载仍只构成适用前置。 |
| `FR-L2T-013~016` | `IB-L2T-013~016`;适用时 `IB-L2T-010`;`IB-L2T-015` | `DB-L2T-004`;`DB-L2T-005` | Sandbox source refs 被消费为工具语义 outcome / audit,execution truth 不转移。 |
| `FR-L2T-017` | `IB-L2T-017~018` | `DB-L2T-006`;条件化 `DB-L2T-007` | Safe material 与降级读取完整,外部状态不反写。 |
| `FR-L2T-E01~E06` | `IB-L2T-E01~E04` | 仅 `FR-L2T-E05` 关联 future / excluded `DB-L2T-008` | 6 项外围由 4 个外围能力面承接;SDK 记录不构成当前依赖。 |

接口并集为 `IB-L2T-001~019` 与 `IB-L2T-E01~E04`;依赖边界记录全集为 `DB-L2T-001~008`,当前已确认项目依赖子集为 `DB-L2T-001~002`、`DB-L2T-004~007`。`DB-L2T-003` 是 owner 未解析的 pending 记录,`DB-L2T-008` 是 future / excluded 记录;material handoff 只附着 Sandbox runtime 或 Bus / Observability event carrier,未形成第四种依赖类型。

### 7.3 NFR 范围审计

| NFR | 已确认 FR 范围 | 追溯结论 |
|---|---|---|
| `NFR-L2T-001` | `FR-L2T-001~002`;`FR-L2T-006~017` | 核心读取 / 判断不成为不可解释瓶颈。 |
| `NFR-L2T-002` | `FR-L2T-007~017` | 性能不得牺牲正确性和硬边界。 |
| `NFR-L2T-003` | `FR-L2T-001~017`;`FR-L2T-E01~E06` | 外围和外部交接不阻塞核心。 |
| `NFR-L2T-004` | `FR-L2T-001~017`;`FR-L2T-E01~E06` | 外围失效不使五节点整体失效。 |
| `NFR-L2T-005` | `FR-L2T-004~006`;`FR-L2T-010~013` | 必要外部输入异常时 fail closed。 |
| `NFR-L2T-006` | `FR-L2T-014~017` | 下游失败不改写本地 outcome / audit。 |
| `NFR-L2T-007` | `FR-L2T-001~017`;`FR-L2T-E04~E06` | Forbidden body / secret 不入仓、不外发。 |
| `NFR-L2T-008` | `FR-L2T-010~013` | 不自授权、不旁路隔离。 |
| `NFR-L2T-009` | `FR-L2T-004~017`;`FR-L2T-E01~E06` | 不复制外部 truth,不接受相邻 owner 反写。 |
| `NFR-L2T-010` | `FR-L2T-017` | Safe material 满足四项合取门禁。 |
| `NFR-L2T-011` | `FR-L2T-001~017` | 身份至 outcome 关键链可追溯。 |
| `NFR-L2T-012` | `FR-L2T-005~017` | 多 owner 来源和故障可区分。 |
| `NFR-L2T-013` | `FR-L2T-017` | Handoff 尝试 / 降级按时点关联。 |
| `NFR-L2T-014` | `FR-L2T-001~006`;`FR-L2T-E01~E03`;`FR-L2T-E06` | 重复维护输入不分叉 truth。 |
| `NFR-L2T-015` | `FR-L2T-007~015` | 调用语义不因 caller / carrier 分叉。 |
| `NFR-L2T-016` | `FR-L2T-007~017` | 消费时点锚定事实不被原地改写。 |
| `NFR-L2T-017` | `FR-L2T-001~017` | 关键本地状态可稳定判断。 |
| `NFR-L2T-018` | `FR-L2T-006`;`FR-L2T-008`;`FR-L2T-011~017` | 越界、来源缺口和多 owner 故障可发现。 |
| `NFR-L2T-019` | `FR-L2T-017` | 外部 route / producer 缺口可见但不反写。 |

### 7.4 VF 范围审计

Step 14 只确认“能力节点 / FR 范围 -> VF 范围”,没有确认逐 FR -> VF 关系,因此本表逐字承接既有范围而不把 VF 塞入六列主矩阵。

| 能力节点 / 范围 | FR 范围 | VF 承接 |
|---|---|---|
| `C-L2T-1` | `FR-L2T-001~003` | `VF-L2T-001~002`;`VF-L2T-008`;`VF-L2T-010~013` |
| `C-L2T-2` | `FR-L2T-004~006` | `VF-L2T-001`;`VF-L2T-003`;`VF-L2T-005`;`VF-L2T-010~013` |
| `C-L2T-3` | `FR-L2T-007~009` | `VF-L2T-001~002`;`VF-L2T-004`;`VF-L2T-006~008`;`VF-L2T-010~013` |
| `C-L2T-4` | `FR-L2T-010~013` | `VF-L2T-001`;`VF-L2T-003`;`VF-L2T-005~008`;`VF-L2T-010~013` |
| `C-L2T-5` | `FR-L2T-014~017` | `VF-L2T-001`;`VF-L2T-004`;`VF-L2T-006~013` |
| 外围增强 | `FR-L2T-E01~E06` | `VF-L2T-002`;`VF-L2T-009~010`;`VF-L2T-012~013` |

全局门禁中,`VF-L2T-001` 验证五节点整体定位,`VF-L2T-012` 验证 Step 6 / 12 依赖裁剪,`VF-L2T-013` 验证 historical material、blocker 与事实可信性。13 项 VF 均已进入以上能力范围或全局门禁。

### 7.5 跨能力追溯审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 孤儿核心故事 | 无 | `US-L2T-001~017` 均至少由一项核心 FR 承接。 |
| 孤儿外围故事 | 无 | `US-L2T-E01~E06` 与外围 FR 一一对应。 |
| 孤儿功能 | 无 | 17 项核心 FR 与 6 项外围 FR 均进入主矩阵。 |
| 孤儿规则 | 无 | `BR-L2T-001~042` 与 `BR-L2T-E01` 的并集均保护 FR 或明确 owner 边界。 |
| 孤儿数据 | 无 | `DR-L2T-001~034` 均有 FR / BR / 边界来源;外围未新增 truth。 |
| 孤儿接口 | 无 | 19 项核心 IB 与 4 项外围 IB 均有 FR 来源。 |
| 孤儿依赖边界记录 | 无 | `DB-L2T-001~008` 均有适用 FR 范围;pending / future 记录未升格为当前依赖。 |
| 孤儿 NFR | 无 | `NFR-L2T-001~019` 均有 FR 范围或全仓边界来源。 |
| 孤儿 AC | 无 | `AC-L2T-001~039` 覆盖节点、功能、规则、数据和六类 NFR。 |
| 孤儿 VF | 无 | `VF-L2T-001~013` 均有能力范围、依赖裁剪或事实可信性来源。 |
| 重复定义 | 无 | 同一 owner 语义没有在不同能力节点建立第二 truth。 |
| 边界串线 | 无 | Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK、provider / inventory owner 均保持外部。 |
| 依赖口径冲突 | 无 | 当前项目依赖只使用 compile / runtime / event 三类;pending / future 记录使用“不适用”,未全局化为确定项目边。 |
| 新增未确认项 | 无 | 矩阵和附属表只引用 Step 7~15 既有 ID 与关系。 |
| 实现 / 测试事实泄漏 | 无 | 未写 DTO、API、event schema、代码组织、run、evidence alias、测试结果或签署。 |

### 7.6 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否 |
| 是否存在没有闭环映射的功能需求 | 否;外围增强显式标记为外围而非伪挂核心节点。 |
| 是否存在没有规则保护的核心功能 | 否 |
| 是否存在没有验收标准的功能需求 | 否 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否 |
| 是否存在没有数据归属的核心功能 | 否 |
| 是否存在未承接的接口、依赖、NFR 或一票否决项 | 否 |
| 是否存在因矩阵完整而被误写为 resolved 的 blocker | 否 |

### 7.7 Blocker 影响审计

| Blocker | 需求追溯状态 | 后续仍阻塞 |
|---|---|---|
| `L2T-UP-001~002` | 已由 FR / BR / DR / AC / VF 的 fail-closed 边界承接,不阻塞矩阵。 | Authorization owner / source matrix、taxonomy 与正向 contract。 |
| `L2T-UP-003~004` | 已由 Sandbox adapter / material handoff 边界承接,不阻塞矩阵。 | Mapping、receipt / DLQ / feedback / cleanup 及测试。 |
| `L2T-UP-005~007` | 已由 safe material、local truth first 与 baseline 可信性边界承接。 | Observability producer / source / route 与 immutable readiness。 |
| `L2T-UP-008` | 已由 `DB-L2T-001` 当前编译期依赖承接;具体 Tools-specific shared schema / contract authority 仍为候选 / 待闭口。 | Tools-specific shared schema / package authority。 |
| `L2T-UP-009` | 已由 `DB-L2T-008` future / excluded 边界记录承接;tools-specific client seam 仍为 pending。 | Tools-specific client seam 与联调。 |

九项 blocker 均保持开放,没有因 Step 16 追溯闭合而被解决、降级或伪称 implementation-ready。

## 8. 回填草稿

正式 §16 应完整装配 §7.1 的 23 行固定六列主矩阵与 §7.6 漏项检查表。为防止接口 / NFR / VF 在主矩阵外成为孤儿,同时保留 §7.2~7.5 的短审计表;§7.7 只以短说明提醒开放 blocker 不因追溯闭合而 resolved。

正式章节不得把 FR、BR、DR 或 AC 文本压成摘要,不得新增第七列,不得把 VF 解释成实际验收结果,也不得写实现顺序或测试计划。

## 9. 待确认事项

本 Step 没有新增待确认事项。`Q-L2T-001~008` 与 `L2T-UP-001~009` 原样继承 Step 15;它们不阻塞 Step 17 装配,但受影响的 owner / schema / mapping / route / client / measurement / readiness 仍不得定稿或声称成立。

## 10. 进入下一步条件

| 条件 | 结果 |
|---|---|
| 主矩阵是否保持规范固定六列并以 FR 为主轴 | pass |
| 17 项核心与 6 项外围 FR 是否全部且仅出现一次 | pass |
| 核心能力、故事、规则、数据和 AC 是否均来自前序 Step | pass |
| IB / DB、NFR、VF 与跨能力孤儿审计是否完成 | pass |
| 固定漏项检查表是否完整且结论可判定 | pass |
| 是否没有新增关系、实现细节或伪事实 | pass |
| 开放 blocker 是否保持原状态 | pass |

```text
step_status = completed_stop_review
gate_status = pass
gate_reason = 23-row matrix and auxiliary orphan audits complete with no new relationship
next_allowed_action = update flow and ledger, then create 00_req_step_17_formal_document_assembly.md
source_files = Step 7~15 + requirements SOP Step 16 + requirements specification 4.16
formal_00_write_allowed = false
commit_required = false
```
