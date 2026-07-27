# 00 Step 16 · 需求追溯矩阵

> 所属文档: `00-需求文档.md`
> Step: Step 16
> 目标章节: 正式文档 §16 `需求追溯矩阵`
> 当前状态: completed_stop_review
> 当前约束: 本步只把 Step 7~Step 15 已确认的闭环、故事、功能、规则、数据、接口、非功能和验收显式连接;不得新增前文未确认的需求、规则、数据、接口、验收或待确认项;不得写 API、DTO、状态机、测试方案、实施计划或正式文档正文。

---

## 1. Step 状态

| 字段 | 值 |
|---|---|
| step | Step 16 |
| status | completed_stop_review |
| gate_status | pass_for_step_16_only |
| previous_step | Step 15 `风险与待确认事项` |
| next_allowed_action | wait_user_review_to_step_17 |
| formal_section | `00-需求文档.md` §16 |
| formal_write_status | not_written |
| blocker_status | no_upstream_blocker_for_step_16 |

---

## 2. Step 内计划

| 序号 | 动作 | 状态 | 输出 |
|---|---|---|---|
| 1 | 回读项目台账、需求 flow、Step 1~15 | done | 确认用户已同意进入 Step 16,且不得跳到 Step 17 或正式文档装配。 |
| 2 | 读取需求 SOP Step 16 和书写规范 4.16 | done | 确认主矩阵必须以功能需求为主轴,固定列为功能、闭环、故事、规则、数据、验收。 |
| 3 | 读取讨论中间产物规范和真相源闭环标准 | done | 确认 Step 16 只能做追溯和漏项审计,不能在矩阵中补写遗漏项。 |
| 4 | 读取上游参考 Step 16 | done | 参考 `L1-governance`、`L3-method-library`、`L0-sdk` 的矩阵密度、接口审计、跨能力审计和停审方式。 |
| 5 | 读取旧 `00-需求文档.md` | done | 识别旧文档没有新版追溯矩阵,且旧 `QueryCapabilities` / Provider Contract / Cost / KMS / Policy 口径不能作为当前矩阵来源。 |
| 6 | 梳理 Step 7~Step 14 已确认编号 | done | 固定 `C-CH-1~5`、`US-CH-001~017`、`FR-CH-001~016`、`BR-CH-001~037`、Step 11 数据项、`AC-CH-001~037` 和 `VF-CH-001~013`。 |
| 7 | 以功能需求为主轴形成主追溯矩阵 | done | 每个 `FR-CH-*` 都回指闭环、故事、规则、数据和验收。 |
| 8 | 形成接口 / 依赖追溯审计 | done | 承接 Step 12,但不进入主矩阵固定列,不写协议或实现。 |
| 9 | 形成跨能力追溯审计、漏项检查和风险影响标注 | done | 检查孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿验收、重复定义和边界串线。 |
| 10 | 形成回填草稿、自检与停审 | done | 为 Step 17 正式文档装配提供 §16 输入,但不写正式文档。 |

---

## 3. 本步输入与读取结论

### 3.1 前序 Step 输入

| 来源 | 已确认结论 | 对 Step 16 的影响 |
|---|---|---|
| Step 7 | 核心闭环为 C-CH-1 稳定身份、C-CH-2 受控注册目录、C-CH-3 可解释接入描述、C-CH-4 governance seam / method relation、C-CH-5 formal exposure / 受控消费。 | 主矩阵的“支撑的核心能力闭环”列必须只使用这些节点或“外围增强”。 |
| Step 8 | 核心故事为 `US-CH-001~017`,外围增强为 `US-CH-E01~E07`,边界外故事已排除。 | 每项核心功能必须回指至少一个核心故事;外围增强功能回指外围故事。 |
| Step 9 | 功能需求为 `FR-CH-001~016`,外围增强为 `FR-CH-E01~E07`;旧 F-001~F-010 不作为当前编号体系。 | 主矩阵以这些功能需求为唯一主轴,不得新增行或恢复旧功能。 |
| Step 10 | 规则为 `BR-CH-001~037` 与 `BR-CH-E001`,覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 | 每项核心功能都必须能映射到规则保护;外围增强映射到总边界规则。 |
| Step 11 | 数据归属分为真相、快照、引用、禁止保存正文;本仓 truth 限定为 capability access truth。 | 主矩阵数据列只写数据归属要求,不写字段、表、对象或 schema。 |
| Step 12 | 接口与依赖为能力级查询、变更、事件输出、事件输入和后台任务;`L0-core` 是唯一编译期依赖候选。 | 接口 / 依赖单独审计,不改写主矩阵固定列,不写 API 或 event schema。 |
| Step 13 | NFR 为 `NFR-CH-001~020`,旧 P95、30s、SLA、grep、cost coverage 不作为硬指标。 | NFR 不进入主矩阵固定列,但进入跨能力追溯和验收映射审计。 |
| Step 14 | 验收为 `AC-CH-001~037` 与 `VF-CH-001~013`。 | 主矩阵验收列必须回指这些验收项,不得新增测试项或证据项。 |
| Step 15 | 当前待确认项不阻塞 Step 16,但必须防止旧口径和边界外能力回流。 | 风险影响只做标注,不得在矩阵中关闭后续设计待确认项。 |

### 3.2 规范输入

| 输入文件 | 本步读取重点 | 对 Step 16 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 16 | Step 16 输出主追溯矩阵、跨能力追溯审计和漏项检查结论。 | 不得新增前文未确认项;发现漏项只能回退前序 Step。 |
| `需求文档书写规范.md` 4.16 | 主矩阵固定以功能需求为中心,列为功能需求、核心能力闭环、用户故事、业务规则、数据归属要求、验收标准。 | 不得改用故事、规则、数据或验收作为主轴。 |
| `设计文档讨论中间产物规范.md` | 每个 Step 必须保留问题回答、诊断、取舍、结构化产物、回填草稿和停审状态。 | 本文件必须成为 Step 17 正式 §16 的具体校准来源。 |
| `设计真相源闭环与可落码性标准.md` | 追溯矩阵必须帮助发现多真相源、孤儿项和边界串线。 | consumer view、snapshot、observability、marketplace 和旧 QueryCapabilities 不能反写 truth。 |

### 3.3 上游参考输入

| 参考文件 | 使用方式 | 结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/00_req_step_16_traceability_matrix.md` | 参考“主矩阵 + 漏项检查 + 追溯结论”的结构。 | 本仓也需要完整主矩阵,不能只写摘要。 |
| `projects/L3-method-library/design-calibration/00_req_step_16_traceability_matrix.md` | 参考“接口 / 依赖追溯审计”和“风险影响标注”的密度。 | 本仓应单独审计 Step 12,防止接口边界在追溯中消失。 |
| `projects/L0-sdk/design-calibration/00_req_step_16_traceability_matrix.md` | 参考“旧功能编号失效、外围增强不进核心前置”的写法。 | 本仓的外围增强进入矩阵但标注为外围增强,不阻塞核心闭环。 |

### 3.4 旧材料输入

| 旧材料 | 差异结论 | 当前处理 |
|---|---|---|
| 旧 `00-需求文档.md` §5~§11 | 旧文档用旧用例、旧 F-001~F-010、旧 BR-001~BR-006、旧实体和旧验收串联,没有新版功能主轴追溯矩阵。 | 只作为 historical material,不得继承旧编号或旧验收项。 |
| 旧 `QueryCapabilities` / provider lookup | 旧查询面会把 formal exposure、allow / deny 和 runtime 查询混写。 | 在矩阵中只承接为 `FR-CH-014~016` 的受控消费表达 / 变化感知,不保留旧接口名。 |
| 旧 Provider Contract / KMS / key / quota / route / cost | 旧对象把 adapter descriptor、secret、provider runtime 和 cost 混写。 | 只承接为 `FR-CH-007~009` 的 descriptor / 风险摘要边界,secret 和 cost 进入禁止正文或风险。 |
| 旧 CostRecord / cost events | 旧数据和验收属于 finance / observability / execution 语境。 | 不进入当前矩阵,只作为 forbidden body / historical conflict。 |
| 旧 Policy 30s / shared_rules / allowlist | 旧口径把 governance truth、policy cache 和执行白名单混写。 | 只承接为 governance seam、正式可见性和变化感知边界。 |

---

## 4. SOP 问题回答

### 4.1 每个核心能力节点是否已完成故事、功能、规则、数据、接口和验收的小循环?

| 核心能力节点 | 故事 | 功能 | 规则 | 数据 | 接口 / 依赖 | 验收 | 小循环结论 |
|---|---|---|---|---|---|---|---|
| C-CH-1 稳定身份 | US-CH-001~003 | FR-CH-001~003 | BR-CH-001;002;005;010;019;020;023;035;036 | 外部能力接入语境;capability identity;identity 风险解释与接入审查事实;external capability source ref | identity 变更 / 查询;外部 MCP / A2A / API 来源;`L0-core` 引用基线 | AC-CH-001;006~008;023;029;036;VF-CH-001;002 | pass |
| C-CH-2 受控注册目录 | US-CH-004~006;US-CH-015;US-CH-016 | FR-CH-004~006;FR-CH-015;FR-CH-016 | BR-CH-002;003;009;011;021;026;034;037 | capability registry entry;registry visibility / lifecycle semantics;registry maintenance / reconciliation record;directory search / browse summary | registry 变更 / 查询 / 后台维护;`L0-bus`;下游消费边界 | AC-CH-002;009~011;020~021;023;025;029~030;VF-CH-001;003;010 | pass |
| C-CH-3 可解释接入描述 | US-CH-007~009 | FR-CH-007~009 | BR-CH-004;005;008;012;013;016;022;025;031;035 | adapter descriptor;descriptor risk / constraint summary;secret ref;secret safe summary;禁止 secret / provider runtime 正文 | descriptor 变更 / 查询;外部能力来源;secret ref 条件边界 | AC-CH-003;012~014;023~024;029;031~032;035;VF-CH-001;004 | pass |
| C-CH-4 治理 / 方法关系接缝 | US-CH-010~013 | FR-CH-010~013 | BR-CH-006;007;014;015;018;019;023;024;028;029;034~036 | governance seam relation;access review responsibility separation fact;capability-method body-free relation;traceability record;governance result ref;method asset ref | governance seam 变更 / 查询;method relation 变更 / 查询;`L1-governance`;`L3-method-library`;traceability 读取 | AC-CH-004;015~018;024;027;029;031~032;036;VF-CH-001;005;006;009 | pass |
| C-CH-5 受控消费表达与变化感知 | US-CH-009;013~017 | FR-CH-006;009;013~016 | BR-CH-003;008;009;012;016~018;025~027;030;032;033;036;037 | formal exposure boundary;formal visibility / applicability fact;controlled consumer view;consumer impact fact;runtime/tools ref;SDK exposure ref;observability ref | formal exposure 变更 / 查询;受控消费视图;变化输出;runtime / tools / SDK 下游消费;`L0-bus` 事件协作 | AC-CH-005;019~022;024~026;028;030~031;033~037;VF-CH-001;007;008;010 | pass |

### 4.2 每个核心能力闭环节点对应哪些用户故事?

| 核心能力闭环 | 对应用户故事 |
|---|---|
| C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-001;US-CH-002;US-CH-003 |
| C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-004;US-CH-005;US-CH-006 |
| C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-007;US-CH-008;US-CH-009 |
| C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-010;US-CH-011;US-CH-012;US-CH-013 |
| C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009;US-CH-013;US-CH-014;US-CH-015;US-CH-016;US-CH-017 |
| 外围增强 | US-CH-E01;US-CH-E02;US-CH-E03;US-CH-E04;US-CH-E05;US-CH-E06;US-CH-E07 |

### 4.3 每个用户故事对应哪些功能需求?

| 用户故事 | 对应功能需求 |
|---|---|
| US-CH-001 | FR-CH-001 |
| US-CH-002 | FR-CH-002 |
| US-CH-003 | FR-CH-003 |
| US-CH-004 | FR-CH-004 |
| US-CH-005 | FR-CH-005;FR-CH-015 |
| US-CH-006 | FR-CH-006 |
| US-CH-007 | FR-CH-007 |
| US-CH-008 | FR-CH-008 |
| US-CH-009 | FR-CH-009;FR-CH-014 |
| US-CH-010 | FR-CH-010 |
| US-CH-011 | FR-CH-011 |
| US-CH-012 | FR-CH-012 |
| US-CH-013 | FR-CH-013 |
| US-CH-014 | FR-CH-014 |
| US-CH-015 | FR-CH-015 |
| US-CH-016 | FR-CH-016 |
| US-CH-017 | FR-CH-014 |
| US-CH-E01 | FR-CH-E01 |
| US-CH-E02 | FR-CH-E02 |
| US-CH-E03 | FR-CH-E03 |
| US-CH-E04 | FR-CH-E04 |
| US-CH-E05 | FR-CH-E05 |
| US-CH-E06 | FR-CH-E06 |
| US-CH-E07 | FR-CH-E07 |

### 4.4 每个功能需求对应哪些业务规则、数据归属和验收标准?

完整答案见 §7.1 主追溯矩阵。当前 `FR-CH-001~016` 均有故事来源、闭环映射、业务规则、数据归属和验收标准。`FR-CH-E01~E07` 作为外围增强进入矩阵并标注外围口径,不作为核心闭环通过前置。

### 4.5 是否存在没有来源的功能、没有承接的规则、没有验收的能力?

未发现。

当前结论:

- 没有无故事来源的功能需求。
- 没有无闭环映射的核心功能需求。
- 没有无规则保护的核心功能。
- 没有无数据归属支撑的核心功能。
- 没有无接口 / 依赖承接的核心功能。
- 没有无验收标准的核心功能。
- 没有在矩阵中新增前文未确认的新项。

### 4.6 是否存在跨能力重复定义、边界串线或依赖口径冲突?

未发现当前阻塞项,但有需要后续持续防回流的风险:

- `FR-CH-006` 同时支撑 registry 维护和 C-CH-5 变化感知,但其 truth owner 仍是 registry maintenance / capability access fact,未变成事件或消费方 truth。
- `FR-CH-009` 同时支撑 descriptor 与受控消费,但 descriptor truth 仍归本仓,下游只消费说明。
- `FR-CH-013` 同时支撑 governance / method seam 与受控消费追溯,但 observability 不成为 truth store。
- `FR-CH-014` 同时承接系统消费和 SDK exposure,但 SDK client / language package 不归本仓。
- 外围增强 `FR-CH-E01~E07` 进入追溯矩阵仅为保留已确认需求线索,不阻塞核心闭环。

---

## 5. 当前文档问题诊断

| 诊断对象 | 当前表现 | 问题 | Step 16 处理 |
|---|---|---|---|
| 旧 `00-需求文档.md` | 没有以当前 `FR-CH-*` 为主轴的追溯矩阵。 | 后续读者无法判断新版功能、规则、数据、验收是否闭合。 | 新增固定结构主矩阵。 |
| 旧功能 / 验收编号 | 使用旧 `F-001~F-010`、旧 `BR-001~BR-006`、旧 Given-When-Then。 | 与 restart 后 Step 7~14 编号和边界冲突。 | 旧编号全部作为 historical material,不进入当前矩阵。 |
| 前序 Step 结构 | Step 7~14 均有映射,但分散在多个文件。 | 不利于 Step 17 正式文档装配和后续 01~07 追溯。 | 汇总为主矩阵、接口 / 依赖审计和漏项检查。 |
| 外围增强 | 已进入 Step 8 / Step 9。 | 若不进入追溯矩阵会变成孤儿功能;若不标注又可能误升核心前置。 | 进入矩阵并明确“外围增强 / 不阻塞核心闭环”。 |
| Step 15 待确认事项 | API、DTO、state、evidence、implementation boundary 未定。 | 如果在 Step 16 尝试补齐,会越界到后续文档。 | 仅做风险影响标注,不补设计。 |

---

## 6. 设计取舍

### 6.1 主矩阵主轴取舍

| 方案 | 内容 | 优点 | 缺点 | 当前取舍 |
|---|---|---|---|---|
| 方案 A | 以 C-CH-1~5 为主轴 | 能突出闭环节点。 | 不符合 4.16 固定结构,不利于发现孤儿功能。 | 不采用。 |
| 方案 B | 以 `FR-CH-001~016` 与 `FR-CH-E01~E07` 为主轴 | 对齐规范,覆盖所有功能,能检查故事、规则、数据、验收承接。 | 表格较长。 | 采用。 |
| 方案 C | 只列核心 `FR-CH-001~016`,外围增强不进矩阵 | 表格更短。 | 外围增强会变成追溯盲区。 | 不采用。 |
| 方案 D | 在矩阵中补新增验收或规则 | 表面上能补洞。 | 违反 Step 16 只做映射的约束。 | 不采用。 |

### 6.2 接口 / 依赖审计取舍

| 方案 | 内容 | 取舍 |
|---|---|---|
| 把接口 / 依赖加入主矩阵固定列 | 不采用。4.16 固定列没有接口 / 依赖列,强行加入会破坏正式章节结构。 |
| 单独形成接口 / 依赖追溯审计表 | 采用。既承接 Step 12,又不把需求追溯写成接口设计。 |
| 不审计接口 / 依赖 | 不采用。Step 16 SOP 要检查孤儿接口和依赖口径冲突。 |

### 6.3 风险与待确认事项取舍

| 议题 | 当前取舍 |
|---|---|
| 是否关闭 Step 15 待确认项 | 不关闭。Step 16 只标注其对追溯矩阵的影响。 |
| 是否为待确认项新增矩阵行 | 不新增。若未来纳入核心,必须回写 Step 7~16。 |
| 是否把旧硬指标写入验收列 | 不写。验收列只使用 Step 14 已确认 `AC/VF`。 |
| 是否把 API / DTO / event / state 补到接口审计 | 不补。后续 `01~07` 负责闭口。 |

---

## 7. 结构化中间产物

### 7.1 主追溯矩阵

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| FR-CH-001 外部能力接入语境建立 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-001 | BR-CH-001;BR-CH-010;BR-CH-020 | 外部能力接入语境为本仓真相数据;external capability source ref 只作引用;URL、provider 名、tool config、runtime config、marketplace listing 不得替代 identity。 | AC-CH-001;AC-CH-006;AC-CH-023;AC-CH-029;VF-CH-001;VF-CH-002 |
| FR-CH-002 能力身份稳定识别 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-002 | BR-CH-001;BR-CH-002;BR-CH-010;BR-CH-020 | capability identity 为本仓真相数据;注册、描述、治理引用、方法关系和消费均围绕同一 identity;消费面不得隐式合并、拆分或更正身份。 | AC-CH-001;AC-CH-007;AC-CH-023;AC-CH-029;AC-CH-036;VF-CH-001;VF-CH-002;VF-CH-010 |
| FR-CH-003 接入身份风险解释 | C-CH-1 外部能力能够以稳定身份进入接入语境 | US-CH-003 | BR-CH-005;BR-CH-019;BR-CH-023;BR-CH-035 | identity 风险解释与接入审查事实为本仓真相数据;接入审查意见不得替代 governance approval;外部敏感正文禁止保存。 | AC-CH-008;AC-CH-016;AC-CH-027;AC-CH-029;AC-CH-035;VF-CH-001;VF-CH-005 |
| FR-CH-004 能力注册目录管理 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-004 | BR-CH-002;BR-CH-021;BR-CH-027 | capability registry entry 为本仓真相数据;registry 必须锚定稳定 identity;runtime / tools execution、allow / deny enforcement、外部调用结果和运行状态不归本仓。 | AC-CH-002;AC-CH-009;AC-CH-025;AC-CH-026;AC-CH-029;VF-CH-001;VF-CH-003 |
| FR-CH-005 目录可见性与生命周期语义 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义 | US-CH-005;US-CH-015 | BR-CH-003;BR-CH-021;BR-CH-034 | registry visibility / lifecycle semantics、formal visibility / applicability fact 为本仓真相数据;governance safe summary 只能补充正式 result ref;草稿、候选、未描述、未治理不得被误认为正式能力。 | AC-CH-002;AC-CH-010;AC-CH-020;AC-CH-023;AC-CH-029;AC-CH-034;VF-CH-003;VF-CH-008 |
| FR-CH-006 目录维护与一致性保护 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-006;US-CH-016 | BR-CH-009;BR-CH-011;BR-CH-026;BR-CH-037 | registry maintenance / reconciliation record、capability change / consumer impact fact 为本仓维护 / 变化真相;directory search / browse summary 只能作为快照;维护、对账、派生和变化协作不得创造新业务接入结论。 | AC-CH-011;AC-CH-021;AC-CH-025;AC-CH-030;AC-CH-034;AC-CH-036;AC-CH-037;VF-CH-007;VF-CH-010 |
| FR-CH-007 Adapter descriptor 表达 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-007 | BR-CH-004;BR-CH-022;BR-CH-031 | adapter descriptor 为本仓真相数据;external capability source ref 和 external standard / protocol / document ref 只作引用;descriptor 不得变成 Provider Contract、secret 容器、provider runtime、quota / route / cost contract。 | AC-CH-003;AC-CH-012;AC-CH-023;AC-CH-026;AC-CH-029;AC-CH-031;VF-CH-001;VF-CH-004 |
| FR-CH-008 接入风险与约束摘要 | C-CH-3 已注册能力能够拥有可解释的接入描述 | US-CH-008 | BR-CH-005;BR-CH-013;BR-CH-022;BR-CH-035 | descriptor risk / constraint summary 为本仓解释真相;secret ref 为引用数据,secret handling safe summary 为快照数据;provider API key、KMS / Vault truth、quota、route、cost、failover、retry 正文禁止保存。 | AC-CH-003;AC-CH-013;AC-CH-024;AC-CH-026;AC-CH-032;AC-CH-035;VF-CH-004;VF-CH-011 |
| FR-CH-009 描述边界消费支撑 | C-CH-3 已注册能力能够拥有可解释的接入描述;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009 | BR-CH-004;BR-CH-008;BR-CH-012;BR-CH-016;BR-CH-025 | adapter descriptor 与 formal exposure boundary 为本仓真相数据;controlled consumer view 只是快照数据;runtime / tools / SDK consumer ref 只是引用数据;下游不得补造 provider runtime、secret、quota 或请求 / 响应协议 truth。 | AC-CH-003;AC-CH-014;AC-CH-019;AC-CH-024;AC-CH-030;AC-CH-031;VF-CH-004;VF-CH-007 |
| FR-CH-010 治理结果接缝承接 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-010 | BR-CH-006;BR-CH-014;BR-CH-023;BR-CH-028;BR-CH-034 | governance seam relation 为本仓关系真相;governance result / policy result ref 为引用数据,governance safe summary 为快照数据;approval、Policy、shared_rules truth 正文禁止保存。 | AC-CH-004;AC-CH-015;AC-CH-024;AC-CH-026;AC-CH-027;AC-CH-029;AC-CH-031;VF-CH-005 |
| FR-CH-011 接入审查与治理职责区分 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-011 | BR-CH-019;BR-CH-023;BR-CH-035 | capability access review responsibility separation fact 为本仓真相数据;access review fact 可追溯但不得替代 governance approval、Policy effective fact 或 shared_rules truth。 | AC-CH-004;AC-CH-016;AC-CH-027;AC-CH-029;AC-CH-035;VF-CH-005 |
| FR-CH-012 Method asset body-free relation | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界 | US-CH-012 | BR-CH-007;BR-CH-015;BR-CH-024;BR-CH-029 | capability-method body-free relation 为本仓关系真相;method asset ref 为引用数据;Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 和方法正文版本禁止保存。 | AC-CH-004;AC-CH-017;AC-CH-024;AC-CH-026;AC-CH-029;AC-CH-031;AC-CH-032;VF-CH-006 |
| FR-CH-013 接入事实追溯 | C-CH-4 接入事实能够承接治理结果并保持方法资产关系边界;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-013 | BR-CH-009;BR-CH-018;BR-CH-036;BR-CH-037 | capability access traceability record 为本仓真相数据;observability / audit ref 和 safe summary 只作引用 / 快照;observability log、trace、metric、alert、audit store 和 cost ledger 正文禁止保存。 | AC-CH-004;AC-CH-005;AC-CH-018;AC-CH-027;AC-CH-029;AC-CH-031;AC-CH-036;AC-CH-037;VF-CH-009;VF-CH-011 |
| FR-CH-014 受控消费表达 | C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-009;US-CH-014;US-CH-017 | BR-CH-008;BR-CH-012;BR-CH-016;BR-CH-025;BR-CH-030;BR-CH-036 | formal exposure boundary 与 controlled consumer view 分层:服务端 exposure 为本仓真相,consumer view 为快照;runtime / tools / SDK ref 只作引用;SDK client、多语言 package、runtime loop 和 tool invocation 正文禁止保存。 | AC-CH-005;AC-CH-019;AC-CH-024;AC-CH-026;AC-CH-030;AC-CH-031;AC-CH-036;VF-CH-007;VF-CH-012 |
| FR-CH-015 正式可见性表达 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-005;US-CH-015 | BR-CH-003;BR-CH-021;BR-CH-025;BR-CH-034 | formal visibility / applicability fact 为本仓真相数据;governance result ref 或允许摘要可作为正式可见前提;草稿、候选、未描述、未治理能力不得被暴露为正式可消费能力。 | AC-CH-002;AC-CH-005;AC-CH-020;AC-CH-025;AC-CH-027;AC-CH-029;AC-CH-034;VF-CH-008 |
| FR-CH-016 能力变化协作与感知 | C-CH-2 外部能力能够进入受控注册目录并形成生命周期语义;C-CH-5 正式接入事实能够被下游按边界消费并持续感知变化 | US-CH-006;US-CH-016 | BR-CH-009;BR-CH-026;BR-CH-036;BR-CH-037 | capability change / consumer impact fact 为本仓真相数据;downstream consumption impact summary 为快照数据;`L0-bus` 只做事件协作,变化输出不得成为 truth 写源。 | AC-CH-005;AC-CH-021;AC-CH-025;AC-CH-030;AC-CH-034;AC-CH-036;AC-CH-037;VF-CH-007;VF-CH-009;VF-CH-010;VF-CH-012 |
| FR-CH-E01 管理入口与批量整理 | 外围增强 | US-CH-E01 | BR-CH-E001 | 管理入口和批量整理只能消费 identity、registry、descriptor、seam、relation、exposure 的正式接入事实;UI / 管理状态不得成为 truth。 | AC-CH-022;AC-CH-028 |
| FR-CH-E02 目录搜索与浏览优化 | 外围增强 | US-CH-E02 | BR-CH-E001;BR-CH-009;BR-CH-037 | directory search / browse summary 为派生快照;搜索、过滤、浏览不得隐式创建、更正或替代 registry truth。 | AC-CH-022;AC-CH-028;AC-CH-030;VF-CH-007 |
| FR-CH-E03 外部能力候选自动发现 | 外围增强 | US-CH-E03 | BR-CH-E001;BR-CH-011 | external capability candidate discovery summary 为候选快照;候选发现输入不得直接形成 capability identity 或 registry entry。 | AC-CH-022;AC-CH-028;VF-CH-010 |
| FR-CH-E04 安全摘要与 secret reference 提示深化 | 外围增强 | US-CH-E04 | BR-CH-E001;BR-CH-013;BR-CH-031 | secret ref 为引用数据,secret handling safe summary 为快照;secret 正文、KMS / Vault truth 和密钥生命周期不进入本仓。 | AC-CH-022;AC-CH-028;AC-CH-032;AC-CH-035;VF-CH-004;VF-CH-011 |
| FR-CH-E05 SDK / 客户端消费说明增强 | 外围增强 | US-CH-E05 | BR-CH-E001;BR-CH-016;BR-CH-030 | SDK exposure consumer ref 为引用数据;SDK 说明只解释服务端 exposure boundary,不得产生 SDK client、language package 或客户端 convenience truth。 | AC-CH-022;AC-CH-028;AC-CH-031;VF-CH-007 |
| FR-CH-E06 只读生态发现 | 外围增强 | US-CH-E06 | BR-CH-E001;BR-CH-017;BR-CH-032 | read-only ecosystem discovery summary / marketplace ecosystem object ref 只能作为快照 / 引用;listing、transaction、pricing、fulfillment 正文禁止保存。 | AC-CH-022;AC-CH-028;AC-CH-031;VF-CH-011 |
| FR-CH-E07 审计友好导出 | 外围增强 | US-CH-E07 | BR-CH-E001;BR-CH-018;BR-CH-033;BR-CH-037 | exported capability access summary、observability / audit safe summary 只作派生快照;audit store、trace、metric、alert、cost ledger 不归本仓。 | AC-CH-022;AC-CH-028;AC-CH-030;AC-CH-037;VF-CH-011 |

### 7.2 接口 / 依赖追溯审计

| 功能需求 | 对应接口 / 依赖 | 审计结论 |
|---|---|---|
| FR-CH-001 | 外部能力接入语境与 identity 建立;外部 MCP / A2A / API 来源输入;`L0-core` 引用基线。 | 有能力级变更入口和来源引用承接,未写 API / DTO。 |
| FR-CH-002 | capability identity 查询与引用;identity 更正 / 退役;`L0-core` 定义来源依赖。 | 身份查询与显式变化边界成立,唯一编译期依赖仍为 `L0-core`。 |
| FR-CH-003 | 接入身份风险解释与审查事实维护;外部能力来源输入。 | 风险解释有能力入口,未写认证协议或治理 approval。 |
| FR-CH-004 | registry 纳入 / 退出与生命周期变更;registry 可见性读取。 | registry 管理有变更 / 查询承接,未写 allowlist 或 runtime 状态。 |
| FR-CH-005 | registry 可见性读取;formal visibility 读取;governance seam 输入。 | 正式可见性有 registry 和 governance seam 承接,未写白名单刷新。 |
| FR-CH-006 | registry 维护与一致性对账;capability access fact 变化输出;`L0-bus` 事件协作。 | 维护与变化协作有后台 / 事件边界,未写 outbox、payload 或事务。 |
| FR-CH-007 | adapter descriptor 建立与替换;外部 MCP / A2A / API 来源输入。 | descriptor 有变更入口和外部来源边界,未写 Provider Contract 或 KMS 接口。 |
| FR-CH-008 | descriptor / 风险摘要读取;secret ref 条件边界。 | 安全摘要可读,secret 只作为 ref / safe summary,未进入 secret 平台。 |
| FR-CH-009 | descriptor 读取;formal exposure / 受控消费视图读取;runtime / tools 消费边界。 | 下游消费同一 descriptor,未写 provider lookup 或请求 / 响应 schema。 |
| FR-CH-010 | governance seam 挂接 / 失效;governance result 输入;seam 读取。 | 治理结论依赖成立,不拥有 approval / Policy truth。 |
| FR-CH-011 | 接入审查事实维护;governance seam 与审查边界读取。 | 审查与治理职责分离在接口边界中保留。 |
| FR-CH-012 | capability-method relation 变更 / 查询;`L3-method-library` 定义来源边界。 | relation 有能力边界,不依赖 method-library 源码或正文。 |
| FR-CH-013 | relation / seam / traceability 读取;capability access fact 变化输出;observability ref 条件边界。 | 追溯由 access truth 支撑,observability 只作 ref / safe summary。 |
| FR-CH-014 | formal exposure 变更;正式可见性 / 受控消费视图读取;runtime / tools / SDK 下游消费。 | 服务端 exposure 可被消费,SDK client 和 runtime execution 不回流。 |
| FR-CH-015 | formal visibility 读取;registry 可见性读取;governance result 输入。 | 正式可见性有 registry + seam 来源,未写 marketplace listing。 |
| FR-CH-016 | capability access fact 变化输出;下游消费影响输入;`L0-bus` 事件协作。 | 变化感知有事件协作边界,未写事件 schema 或 relay。 |
| FR-CH-E01 | 管理 / 批量整理外围入口;registry 后台维护。 | 外围增强,不改变核心 truth。 |
| FR-CH-E02 | 目录搜索与浏览摘要读取。 | 派生摘要读取,不成为 truth 写源。 |
| FR-CH-E03 | 外部能力候选发现输入。 | 候选发现输入不直接形成正式接入 truth。 |
| FR-CH-E04 | secret ref 条件边界;安全摘要读取。 | 只允许 ref / safe summary,不进入 secret 平台。 |
| FR-CH-E05 | SDK / 客户端消费说明读取;`L0-sdk` 下游消费。 | 说明服务端 exposure,不实现 SDK client。 |
| FR-CH-E06 | 只读生态发现摘要读取;`L6-marketplace` 外围消费。 | 只读发现不形成 listing / transaction truth。 |
| FR-CH-E07 | 审计友好摘要导出准备;observability / audit ref 条件边界。 | 审计摘要不拥有 audit store 或 cost ledger。 |

### 7.3 非功能追溯审计

| 非功能范围 | 对应功能 / 规则 / 验收 | 审计结论 |
|---|---|---|
| NFR-CH-001~003 性能 | FR-CH-006;FR-CH-014~016;FR-CH-E02;FR-CH-E07;BR-CH-008;009;026;037;AC-CH-033 | 性能口径保护核心读取 / 受控消费不被外围增强阻塞,未继承旧 P95。 |
| NFR-CH-004~006 可用性 | FR-CH-001~016;Step 12 外部依赖边界;AC-CH-034 | 外围、外部输入、事件协作和下游失败时不伪造或反写 truth。 |
| NFR-CH-007~010 安全 | FR-CH-003;008;010;011;014;BR-CH-012~019;027~035;AC-CH-035 | 禁止正文、safe summary / ref、governance 职责分离均有验收承接。 |
| NFR-CH-011~013 审计 / 可追溯 | FR-CH-013;016;FR-CH-E07;BR-CH-020~026;036;037;AC-CH-036 | 关键变化、跨仓引用、派生输出可解释,不依赖 observability store 替代 truth。 |
| NFR-CH-014~017 幂等 / 一致性 | FR-CH-001~016;BR-CH-001~011;020~026;AC-CH-036 | 单一正式语义、重复输入不分叉、显式变化和消费一致均有追溯。 |
| NFR-CH-018~020 可观测性 | FR-CH-006;013;016;FR-CH-E07;BR-CH-036;037;AC-CH-037 | 核心状态、边界异常、依赖延迟和消费 / 维护失败可识别,观测材料不替代 truth。 |

### 7.4 跨能力追溯审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿故事 | 否 | `US-CH-001~017` 均映射到 `FR-CH-001~016`;`US-CH-E01~E07` 均映射到 `FR-CH-E01~E07`。 |
| 是否存在孤儿功能 | 否 | 每个 `FR-CH-*` 均有闭环、故事、规则、数据、接口和验收映射。 |
| 是否存在孤儿规则 | 否 | `BR-CH-001~037` 均在核心功能、边界规则、数据归属、NFR 或验收中承接;`BR-CH-E001` 承接外围增强。 |
| 是否存在孤儿数据 | 否 | Step 11 数据项均能回指功能需求、规则、接口 / 依赖或禁止正文边界。 |
| 是否存在孤儿接口 | 否 | Step 12 接口 / 依赖边界均映射到核心功能或外围增强功能。 |
| 是否存在孤儿验收 | 否 | `AC-CH-001~037` 均回指闭环、功能、规则、数据或 NFR;`VF-CH-001~013` 均回指一票否决边界。 |
| 是否存在跨能力重复定义 | 未发现 | C-CH-1~5 分别承担 identity、registry、descriptor、seam / relation、formal exposure;跨节点功能只表达合理依赖。 |
| 是否存在边界串线 | 未发现当前阻塞项 | execution、secret、cost、governance truth、method body、SDK client、marketplace、observability 均作为边界、引用、快照或禁止正文处理。 |
| 是否存在依赖类型冲突 | 未发现 | `L0-core` 仍是唯一编译期依赖候选;`L0-bus` 是事件协作;其余为运行期、外部或消费边界。 |
| 是否存在待确认项被写成正式结论 | 未发现 | governance seam 形态、method relation 摘要强度、descriptor 分类、secret summary、SDK 交接、API / DTO / state / evidence / boundary 均仍后移。 |
| 是否存在实现机制进入矩阵 | 未发现 | 未写 API path、Command、Query、DTO、event schema、state enum、repository、handler、outbox、DDL、测试脚本或 evidence alias。 |
| 是否存在外围增强阻塞核心闭环 | 未发现 | 外围增强进入矩阵但明确不作为核心通过前置。 |

### 7.5 漏项检查表

| 检查项 | 结果 |
|---|---|
| 是否存在没有故事来源的功能需求 | 否。 |
| 是否存在没有闭环映射的功能需求 | 否。核心功能均映射到 C-CH-1~C-CH-5;外围增强明确标为外围增强。 |
| 是否存在没有规则保护的核心功能 | 否。`FR-CH-001~016` 均有 `BR-CH-*` 保护。 |
| 是否存在没有数据归属承接的功能需求 | 否。核心功能均映射到真相、快照、引用或禁止保存正文边界。 |
| 是否存在没有接口 / 依赖承接的功能需求 | 否。Step 12 已为核心和外围功能提供能力级接口 / 依赖边界。 |
| 是否存在没有验收标准的功能需求 | 否。核心功能均有 `AC-CH-*` 验收;外围增强由 `AC-CH-022` 和 `AC-CH-028` 管住边界。 |
| 是否存在没有承接的业务规则 | 否。 |
| 是否存在没有承接的数据归属要求 | 否。 |
| 是否存在没有来源的验收标准 | 否。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否。 |
| 是否存在边界外能力混入核心功能矩阵 | 否。 |
| 是否存在外围增强被误写成核心闭环前置 | 否。 |
| 是否存在 Step 15 待确认项被直接关闭 | 否。 |

### 7.6 风险与待确认事项影响标注

| 风险 / 待确认主题 | 对追溯矩阵的当前影响 |
|---|---|
| Provider Contract / KMS / key / quota / cost / failover 回流 | 当前矩阵只保留 adapter descriptor、secret ref / safe summary 和 forbidden body;若后续把这些回流为 truth,必须回写 Step 7~16。 |
| QueryCapabilities / allow-deny / 白名单刷新回流 | 当前矩阵只保留 formal exposure / controlled consumer view;不继承旧接口名、runtime decision 或 Policy refresh。 |
| CostRecord / finance 回流 | 当前矩阵将 cost / billing / finance ledger 作为禁止正文 / historical conflict;不进入功能或验收主线。 |
| consumer view / SDK / runtime / query / export / maintenance 反写真相 | 当前矩阵用 `BR-CH-008/009/012/016/025~037`、`AC-CH-019~021/030/036~037`、`VF-CH-007` 管住。 |
| governance seam 承载形态 | 当前矩阵只要求 governance result ref 或 allowed safe summary;字段、事件或状态形态后移。 |
| method relation 摘要强度 | 当前矩阵只要求 body-free relation 与 method asset ref;relation type 和摘要字段后移。 |
| adapter descriptor 分类 | 当前矩阵不按 MCP / A2A / API / LLM provider API 拆功能行;分类后移 01~03 / 04。 |
| secret safe summary 最小内容 | 当前矩阵只钉住 secret 正文和 KMS / Vault truth 禁止入仓;summary 结构后移。 |
| SDK exposure 交接 | 当前矩阵只确认服务端 formal exposure 归本仓、SDK client 归 `L0-sdk`;package / client 验证后移。 |
| marketplace / console / observability / finance / KMS 外围边界 | 当前矩阵保留只读、外围或条件边界,不升为核心 truth。 |
| API / DTO / event / state / storage / config / evidence / implementation boundary | 当前矩阵不补这些设计项;后续 `01~07` 必须闭口后才能交付实现。 |

### 7.7 追溯结论

| 结论项 | 结论 |
|---|---|
| 核心闭环完整性 | C-CH-1~C-CH-5 均有故事、功能、规则、数据、接口、非功能和验收承接。 |
| 功能完整性 | `FR-CH-001~016` 均闭合;`FR-CH-E01~E07` 作为外围增强保留且不阻塞核心闭环。 |
| 规则完整性 | `BR-CH-001~037` 与 `BR-CH-E001` 均有功能、数据、NFR 或验收承接。 |
| 数据完整性 | 真相、快照、引用、禁止保存正文四类边界均有规则和验收承接。 |
| 接口 / 依赖完整性 | Step 12 能力级接口和依赖均映射到功能需求,没有协议或实现提前锁死。 |
| 验收完整性 | `AC-CH-001~037` 和 `VF-CH-001~013` 均可追溯到前序结构。 |
| 旧材料处理 | 旧 README 和旧 `00~06` 只作为 historical material;旧 QueryCapabilities、Provider Contract、KMS、CostRecord、Policy 30s、SLA 不进入新版追溯基线。 |
| 是否允许进入 Step 17 | 允许在用户确认后进入 Step 17 正式 `00-需求文档.md` 装配。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §16。正式文档可摘录本文件 §7.1、§7.4、§7.5 和 §7.7,不重复扩写 SOP 问题回答、诊断和设计取舍。

```md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/00_req_step_16_traceability_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“接口 / 依赖追溯审计”和“漏项检查表”小节,了解本章如何检查闭环、故事、功能、规则、数据、接口、非功能和验收之间的追溯关系。

本文采用 `design-calibration/00_req_step_16_traceability_matrix.md` §7 的追溯结论。主矩阵以功能需求为中心,连接核心闭环、用户故事、业务规则、数据归属要求和验收标准。当前没有孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿验收或新增未确认项;外围增强功能已按外围增强处理,不作为当前核心闭环通过前置。

正式章节应摘录:

- `design-calibration/00_req_step_16_traceability_matrix.md` §7.1 主追溯矩阵。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.4 跨能力追溯审计。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.5 漏项检查表。
- `design-calibration/00_req_step_16_traceability_matrix.md` §7.7 追溯结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-CH-016-001 | Step 17 正式 `00-需求文档.md` 是否完整摘录主矩阵。 | 当前建议完整摘录。主矩阵是需求追溯的正式审查入口。 |
| OQ-CH-016-002 | 外围增强是否在正式矩阵中保留。 | 当前建议保留并标注外围增强,因为它们已进入 Step 8 / Step 9,不能在追溯中消失。 |
| OQ-CH-016-003 | 接口 / 依赖追溯审计是否进入正式 §16。 | 当前建议正式 §16 可摘要审计结论,完整审计留在本中间产物。 |

上述事项不阻塞 Step 17;Step 17 只负责按规范装配正式文档,不得新增本步矩阵未确认的新项。

---

## 10. Blocker 判定

| blocker | 判定 | 说明 |
|---|---|---|
| 上游 blocker | 未发现 | Step 7~15 已提供 Step 16 所需闭环、故事、功能、规则、数据、接口、NFR、验收和风险输入。 |
| 孤儿项 blocker | 未发现 | 未发现孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿验收。 |
| 旧文档冲突 | 不阻塞 | 旧 README 和旧 `00~06` 已作为 historical material;冲突口径未进入当前矩阵。 |
| 正式文档写入 | 未执行 | Step 16 只写中间产物;正式 `00-需求文档.md` 必须等 Step 17 用户确认后装配。 |

---

## 11. 自检与停审

| 检查项 | 状态 | 说明 |
|---|---|---|
| 已读取 Step 16 SOP / 书写规范 | pass | 已按 4.16 固定结构生成主矩阵和漏项检查。 |
| 主矩阵是否以功能需求为主轴 | pass | 使用 `FR-CH-001~016` 和 `FR-CH-E01~E07` 为主轴。 |
| 是否连接闭环、故事、规则、数据、验收 | pass | §7.1 每行均包含固定列。 |
| 是否单独审计接口 / 依赖 | pass | §7.2 承接 Step 12,未破坏主矩阵固定列。 |
| 是否检查孤儿项和串线项 | pass | §7.4 和 §7.5 已检查。 |
| 是否新增前文未确认项 | pass | 未新增功能、规则、数据、接口、验收或风险。 |
| 是否把旧正式文档内容带回基线 | pass | 旧 QueryCapabilities、Provider Contract、KMS、CostRecord、Policy 30s、SLA 均只作为 historical conflict。 |
| 是否写入正式 `00-需求文档.md` | no | 正式文档仍未装配。 |
| 是否允许进入 Step 17 | blocked_until_user_confirm | 必须等待用户确认后才能继续。 |

当前 Step 16 已完成并停审。下一步只有在用户确认后,才允许进入 Step 17 `整理正式文档`。
