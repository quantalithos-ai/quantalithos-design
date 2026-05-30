# L0-bus 06 验收标准 Step 12: 缺陷分级、复验与放行规则

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 12 中间产物。
> 本步把测试方案中的缺陷规则、一票否决项和证据门禁转换为验收结论可直接使用的缺陷裁决规则。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义缺陷分级、复验与放行规则 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §12 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §11 | 已完成 | 继承 S0 / S1 / S2 / S3 / P1-risk 缺陷定义、处理要求和最小回归范围 |
| `05-测试方案.md` §12 | 已完成 | 继承进入 / 退出准则中 S0 / S1 关闭、S2 / P1-risk 条件接受口径 |
| `05-测试方案.md` §14 | 已完成 | 继承变更类型到最小回归集、残余风险和必须转入验收的内容 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承通过、有条件通过、不通过三值结论与进入阻断规则 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承非功能失败到 S0 / S1 / S2 / P1-risk 的裁决边界 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 fixed `<run_id>`、risk acceptance、open issues 和 evidence handoff 要求 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承 `VETO-BUS-*` 一票否决项和不可风险接受规则 |

---

## 3. SOP 问题回答

### 3.1 S/A/B 缺陷如何定义?

验收 SOP 使用 S/A/B 作为通用表达,L0-bus 已在测试方案中采用更细的 S0 / S1 / S2 / S3 / P1-risk 分级。正式验收采用 L0-bus 的细分级别,并保留与通用分级的映射。

| 通用级别 | L0-bus 级别 | 定义 |
|---|---|---|
| S | S0 | 一票否决、安全红线、证据不可用、数据边界破坏或 `VETO-BUS-*` 命中 |
| S | S1 | P0 主链或 P0-min 支撑边界不可用,但未必命中不可风险接受红线 |
| A | S2 | P0 非主链问题或非红线质量缺陷,可以在条件满足时作为有条件通过输入 |
| B | S3 | 文档、提示、低风险易用性问题,默认不阻断当前 P0 验收 |
| 风险项 | P1-risk | 当前 P0 非范围但影响后续生产化或后续阶段的风险项 |

因此,本项目不再另造 S/A/B 新编号,而是以 S0 / S1 / S2 / S3 / P1-risk 为正式缺陷分级。

### 3.2 每级缺陷对验收结论有什么影响?

| 缺陷级别 | 对验收结论的影响 |
|---|---|
| S0 | 只能形成“不通过”;不得通过、不得有条件通过、不得风险接受 |
| S1 | 未关闭时只能形成“不通过”;关闭并完成自动化复验后可继续裁决 |
| S2 | P0 / P0-min 全部通过且无 S0 / S1 时,可进入“有条件通过”候选 |
| S3 | 默认不影响通过结论;重复出现、影响证据可读性或误导裁决时升级为 S2 |
| P1-risk | 不阻断当前 P0,但必须明确非当前交付范围,并进入风险接受或后续专项 |
| 未分级缺陷 | 阻断进入验收或阻断最终签署,必须先完成分级和影响判断 |

### 3.3 修复后如何复验?

修复后复验不能只看失败用例转绿,还必须覆盖受影响的最小回归范围、相关门禁和证据链。

| 缺陷级别 | 复验要求 |
|---|---|
| S0 | 必须修复或回退;补充自动化防回归;重跑 redline 相关套件、release gate、redaction / evidence checks;更新 veto checklist |
| S1 | 必须修复;重跑失败用例、所属功能族最小回归集、对应 PR / main CI / release gate |
| S2 | 重跑失败用例和直接影响范围;更新 owner / deadline / retest 记录;如仍未关闭必须进入 risk acceptance |
| S3 | 可用文档审查、脚本输出审查或局部测试复验;重复出现时按 S2 复验 |
| P1-risk | 不要求当前 P0 全量复验;必须确认未污染 P0 声明,并记录后续专项、owner 和触发条件 |

### 3.4 哪些缺陷可以风险接受?

只允许 S2、S3 和 P1-risk 在条件齐全时风险接受。

风险接受必须同时具备:

- owner。
- impact scope。
- deadline。
- retest plan。
- acceptance record。
- fixed `<run_id>` 下的 open issue 或 risk acceptance 引用。

S0、`VETO-BUS-*`、未关闭 S1、P0 evidence 不可用、forbidden body 泄漏、Query 写 truth、replay 绕过 audit chain、core / bus 双真相均不得风险接受。

### 3.5 哪些缺陷必须阻断下一阶段?

| 缺陷 / 状态 | 阻断阶段 | 原因 |
|---|---|---|
| S0 或 `VETO-BUS-*` 命中 | PR、release、acceptance、后续实现交接 | 破坏验收红线或证据可信度 |
| 未关闭 S1 | PR、main CI、release、acceptance | P0 主链或 P0-min 支撑边界不可用 |
| 未分级缺陷 | acceptance signoff | 无法判断影响范围和结论 |
| P0 evidence 缺失或不可审计 | acceptance signoff | 结论无法复查 |
| S2 缺少 owner / deadline / retest / acceptance record | conditional pass | 条件通过不可追责 |
| P1-risk 被误声明为当前 P0 已交付 | acceptance signoff | 验收范围被污染 |
| 风险接受记录与 evidence / open issues 不一致 | conditional pass | 证据链断裂 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 测试方案已有缺陷规则,但验收结论映射不够集中 | S0 / S1 / S2 在 `05` 中用于测试退出,未形成验收裁决表 | 验收时可能不知道能否有条件通过 | 本步固定缺陷级别到通过 / 有条件通过 / 不通过的映射 |
| 一票否决和 S0 / S1 容易混淆 | VETO、S0、S1 都可能导致不通过 | 可能错误地把 VETO 当作可修复后条件接受项 | 本步规定 VETO / S0 不得风险接受,S1 修复复验后可重新裁决 |
| 复验范围容易只看失败用例 | 修复后可能只重跑单测 | 回归遗漏导致同类链路再次失败 | 本步按缺陷区域绑定最小回归集 |
| P1-risk 容易被误判为当前缺陷 | production adapter、KMS、dashboard 等后置能力 | 当前 P0 被错误阻断或错误宣称已交付 | 本步把 P1-risk 定义为非阻断但必须记录 |
| 有条件通过缺少可追责条件 | S2 可接受,但缺少 owner / deadline / retest 时会失控 | 放行后无法追踪 | 本步把风险接受材料作为硬条件 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 缺陷分级 | `05` 中已有测试级别 | `06` 中形成验收裁决级别 | 可签署 |
| 结论影响 | 分散在进入 / 退出和非功能章节 | 集中定义每级缺陷对三值结论的影响 | 可判定 |
| 复验规则 | 按测试方案描述最小回归 | 按缺陷级别和缺陷区域双维度裁决 | 防遗漏 |
| 风险接受 | S2 / S3 可接受原则存在 | 补齐 owner、deadline、impact、retest、record 硬条件 | 可追责 |
| P1-risk | 测试方案中列残余风险 | 验收中明确不阻断 P0,但不得误声明 | 防范围漂移 |
| 下一阶段阻断 | 未集中表达 | 明确哪些状态阻断 PR / release / acceptance / signoff | 可执行 |

---

## 6. 验收设计取舍

### 6.1 是否沿用 SOP 的 S/A/B 分级

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 重新改成 S/A/B | 与 SOP 字面一致 | 会丢失当前 S0 / S1 / S2 / S3 / P1-risk 的精细语义 |
| B. 保留 L0-bus 细分级别,并给出 S/A/B 映射 | 兼容 SOP,也保留项目语义 | 需要一张映射表 | 采用 |
| C. 同时维护两套正式级别 | 看似完整 | 容易形成重复真相 | 不采用 |

### 6.2 是否允许 S1 有条件通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行更灵活 | S1 表示 P0 主链或 P0-min 支撑不可用,会破坏交付可信度 |
| B. 不允许;S1 必须关闭并复验后再裁决 | 边界清楚 | 修复前不能进入条件放行 | 采用 |
| C. 由验收人临场决定 | 灵活 | 不可审计 | 不采用 |

### 6.3 是否把 P1-risk 作为缺陷处理

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 作为当前缺陷阻断 | 严格 | 与当前 P0 范围冲突 |
| B. 作为风险项处理,只在污染 P0 声明或触发红线时阻断 | 范围准确 | 需要风险章节承接 | 采用 |
| C. 不进入验收标准 | 文档更短 | 后续生产化风险不可见 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S0 | 一票否决、安全红线、验收证据不可用、数据边界破坏或 `VETO-BUS-*` 命中 | 只能不通过;不得风险接受 | 修复或回退;补自动化;重跑 redline、release gate、evidence checks;更新 veto checklist |
| S1 | P0 主链或 P0-min 支撑边界不可用 | 未关闭时不通过;关闭复验后可重新裁决 | 重跑失败用例、所属最小回归集和对应 gate |
| S2 | P0 非主链问题或非红线质量缺陷 | 可作为有条件通过输入 | 重跑影响范围;未关闭时必须 risk acceptance 完整 |
| S3 | 文档、提示、低风险易用性问题 | 默认不阻断;重复或误导裁决时升级 | 文档审查、脚本输出审查或局部复验 |
| P1-risk | 当前 P0 非范围但影响后续生产化 | 不阻断当前 P0;必须记录残余风险 | 确认未污染 P0,记录后续专项、owner 和触发条件 |
| Unclassified | 未完成级别、影响和证据判断的缺陷 | 阻断进入验收或签署 | 先完成分级、影响分析和证据绑定 |

### 7.2 缺陷区域到最小回归映射表

| 缺陷区域 | 最小回归范围 | 需要更新的证据 |
|---|---|---|
| publication / core boundary | `TC-BUS-PUB-001`~`004`、`bus-contract` | contract compile、publication evidence、gate result |
| transport semantic / backend boundary | `TC-BUS-SEM-001`~`002`、`TC-BUS-BND-001`~`003` | semantic mapping evidence、backend boundary evidence |
| delivery lifecycle | `TC-BUS-DLV-001`~`004`、state machine unit tests | delivery history、state transition evidence |
| feedback / idempotency | `TC-BUS-FDB-001`~`004`、idempotency suite | feedback record、idempotency evidence |
| recovery / replay | `TC-BUS-REC-001`~`004`、`bus-release-recovery` | DLQ material、replay preparation、audit chain |
| read-only output / Query | `TC-BUS-OUT-001`~`006`、no-write Query tests | projection / Query evidence、no-write UoW evidence |
| outbox relay | `TC-BUS-OBX-001`~`002`、consumer integration | source ack、duplicate fact、committed outbox evidence |
| config control plane | `TC-BUS-CFG-001`~`003`、`bus-config` | config summary、validation result、reload rejection evidence |
| redaction / evidence | `TC-BUS-RED-001`~`002`、`check_redaction.sh`、`generate_reports.sh` | redaction-check、artifact-index、evidence-index |
| artifacts / reports | report scripts、link checks、acceptance index | `reports/runs/<run_id>`、`reports/acceptance/*` |

### 7.3 复验规则表

| 场景 | 必须执行的复验 | 通过条件 |
|---|---|---|
| S0 修复 | 原失败用例、redline 相关最小回归、release gate、redaction / evidence checks | VETO 不再命中;P0 evidence 可审计;新增自动化防回归 |
| S1 修复 | 原失败用例、所属缺陷区域最小回归、对应 PR / main CI / release gate | P0 主链或 P0-min 支撑恢复;无同类阻断 |
| S2 修复 | 原失败用例、直接影响范围、相关报告字段或脚本检查 | 缺陷关闭;或以 risk acceptance 记录残余影响 |
| S3 修复 | 文档 / 提示 / 局部脚本检查 | 不再误导执行者或验收人 |
| P1-risk 复核 | 风险边界复核、P0 声明复核、后续专项登记 | 不污染当前 P0;owner 和后续触发条件明确 |
| 证据路径修复 | `check_artifact_layout.sh`、`check_report_links.sh`、`generate_acceptance_index.sh` | 无 `latest`;无 `<project>` 层级;fixed `<run_id>` 引用完整 |

### 7.4 放行规则表

| 结论 | 缺陷条件 | 放行规则 |
|---|---|---|
| 通过 | 无 S0 / S1 / 未接受 S2;P0 / P0-min 全部通过;证据链完整 | 可签署通过 |
| 有条件通过 | 无 S0 / S1;P0 / P0-min 全部通过;仅剩已接受 S2 / S3 / P1-risk | 必须有 `risk-acceptance.md`、`open-issues.md`、owner、deadline、retest plan |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 主链失败、P0 evidence 不可审计、未分级缺陷无法裁决 | 必须记录失败证据、整改入口和复验范围 |
| 不进入签署 | 基线漂移、证据路径非法、缺陷未分级、P1-risk 被误声明为 P0 | 先修正输入、证据或范围声明 |

### 7.5 缺陷裁决流

```text
发现缺陷
  -> 绑定 fixed <run_id> 证据
  -> 完成缺陷分级
        |
        +-- 未分级
        |     -> 阻断验收签署
        |
        +-- S0 或 VETO-BUS-*
        |     -> 不通过
        |     -> 修复/回退 + redline 复验 + 更新 veto checklist
        |
        +-- S1
        |     -> 未关闭时不通过
        |     -> 修复 + 最小回归 + 对应 gate 后重新裁决
        |
        +-- S2 / S3
        |     -> 关闭后可通过
        |     -> 未关闭时必须 risk acceptance 完整,否则不得有条件通过
        |
        +-- P1-risk
              -> 不阻断当前 P0
              -> 记录 owner / 后续专项 / 不污染 P0 声明
```

图后说明:

- 缺陷裁决的第一步是证据绑定和分级,不是直接决定是否放行。
- S0 / VETO 永远不能被风险接受覆盖。
- 有条件通过只承载已接受的 S2 / S3 / P1-risk。

---

## 8. 回填草稿

以下内容用于 Step 15 回填 `06-验收标准.md` §12。

```markdown
## 12. 缺陷分级、复验与放行规则

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_release.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“缺陷分级表”“缺陷区域到最小回归映射表”“复验规则表”和“放行规则表”小节，了解缺陷如何影响验收结论。

正式验收采用 S0 / S1 / S2 / S3 / P1-risk 分级。S0 对应一票否决、安全红线或证据不可用;S1 对应 P0 主链或 P0-min 支撑边界不可用;S2 对应 P0 非主链或非红线质量问题;S3 对应低风险文档、提示或易用性问题;P1-risk 对应当前 P0 非范围但影响后续生产化的风险项。

S0、`VETO-BUS-*` 和未关闭 S1 不得风险接受。S2、S3 和 P1-risk 只有在 owner、impact scope、deadline、retest plan、acceptance record 和 fixed `<run_id>` 证据完整时,才可支撑有条件通过。

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S0 | 一票否决、安全红线、验收证据不可用、数据边界破坏或 `VETO-BUS-*` 命中 | 只能不通过;不得风险接受 | 修复或回退;补自动化;重跑 redline、release gate、evidence checks;更新 veto checklist |
| S1 | P0 主链或 P0-min 支撑边界不可用 | 未关闭时不通过;关闭复验后可重新裁决 | 重跑失败用例、所属最小回归集和对应 gate |
| S2 | P0 非主链问题或非红线质量缺陷 | 可作为有条件通过输入 | 重跑影响范围;未关闭时必须 risk acceptance 完整 |
| S3 | 文档、提示、低风险易用性问题 | 默认不阻断;重复或误导裁决时升级 | 文档审查、脚本输出审查或局部复验 |
| P1-risk | 当前 P0 非范围但影响后续生产化 | 不阻断当前 P0;必须记录残余风险 | 确认未污染 P0,记录后续专项、owner 和触发条件 |
| Unclassified | 未完成级别、影响和证据判断的缺陷 | 阻断进入验收或签署 | 先完成分级、影响分析和证据绑定 |

修复后复验必须覆盖原失败用例、所属缺陷区域最小回归集、对应门禁和证据链。证据路径修复必须重新执行 artifact layout、report links 和 acceptance index 检查。

| 结论 | 缺陷条件 | 放行规则 |
|---|---|---|
| 通过 | 无 S0 / S1 / 未接受 S2;P0 / P0-min 全部通过;证据链完整 | 可签署通过 |
| 有条件通过 | 无 S0 / S1;P0 / P0-min 全部通过;仅剩已接受 S2 / S3 / P1-risk | 必须有 `risk-acceptance.md`、`open-issues.md`、owner、deadline、retest plan |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 主链失败、P0 evidence 不可审计、未分级缺陷无法裁决 | 必须记录失败证据、整改入口和复验范围 |
| 不进入签署 | 基线漂移、证据路径非法、缺陷未分级、P1-risk 被误声明为 P0 | 先修正输入、证据或范围声明 |
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 是否使用 S/A/B 作为正式缺陷级别 | A. 改成 S/A/B;B. 保留 S0 / S1 / S2 / S3 / P1-risk 并映射;C. 双轨维护 | 采用 B |
| 是否允许未关闭 S1 有条件通过 | A. 允许;B. 不允许;C. 临场决定 | 采用 B |
| 是否把 P1-risk 计入当前阻断缺陷 | A. 是;B. 否,除非污染 P0 或触发红线;C. 完全不记录 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 已回答 SOP Step 12 的 5 个问题 | 已满足 |
| 已形成缺陷分级表 | 已满足 |
| 已形成复验规则 | 已满足 |
| 已形成缺陷区域到最小回归映射 | 已满足 |
| 已形成放行规则 | 已满足 |
| 缺陷规则与一票否决项一致 | 已满足 |
| 缺陷对通过 / 有条件通过 / 不通过的影响可判定 | 已满足 |

结论: 可以进入 Step 13,定义风险接受与遗留项。
