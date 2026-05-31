# L0-sdk 06 验收标准 Step 13: 风险接受与遗留项

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 13 中间产物。
> 本步定义哪些风险可以支撑有条件通过、哪些风险不能接受、风险接受记录必须包含哪些字段。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义风险接受与遗留项 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §13 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §14 | 已完成 | 提取残余风险候选项 |
| `05_test_plan_step_14_regression_risks.md` | 已确认 | 继承残余风险表和风险转验收映射 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承有条件通过的退出条件 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 `risk-acceptance.md`、`open-issues.md` 和固定 `run_id` 证据规则 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承 `VETO-SDK-*` 不可风险接受规则 |
| `06_acceptance_step_12_defects_release.md` | 已确认 | 继承 S0 / S1 / S2 / S3 放行规则 |

---

## 3. SOP 问题回答

### 3.1 哪些风险可以支持有条件通过?

只有不影响 P0、未触发 `VETO-SDK-*`、不污染 truth / security / candidate gate、且已形成完整接受记录的风险，才能支持有条件通过。

| 风险类型 | 是否可支持有条件通过 | 条件 |
|---|---|---|
| S2 | 可以 | 不影响 P0；有 owner、接受人、截止时间、复验入口 |
| S3 | 可以 | 不影响证据裁决、报告可信度和实现契约理解 |
| P1 / P2 非范围 | 可以 | handoff 明确不属于当前 P0；不得被声明为已交付 |
| public registry 发布未覆盖 | 可以 | 当前仅声明 local package candidate 通过 |
| production endpoint 全量覆盖未完成 | 可以 | 当前仅声明最小 formal / fake boundary 通过 |
| real credential provider 未覆盖 | 可以 | 当前只验 credential ref-only 和 raw secret forbidden |
| fixed performance threshold 未收稳 | 可以 | 当前只声明测量点存在，不声明固定阈值达标 |

### 3.2 哪些风险不能接受?

| 风险类型 | 是否可接受 | 原因 |
|---|---|---|
| `VETO-SDK-*` | 不可接受 | 一票否决必须导致不通过 |
| S0 | 不可接受 | P0 核心闭环、安全边界或 truth 不变量被破坏 |
| S1 | 不可接受 | P0 用例、gate、evidence 或配置门禁失败 |
| raw secret / credential / body 泄露 | 不可接受 | 安全红线 |
| fake-only success 支撑 `Stable` | 不可接受 | candidate gate 被污染 |
| P1 / P2 被声明为 P0 已交付 | 不可接受 | 验收范围失真 |
| 无接受人、无期限、无后续动作的风险 | 不可接受 | 无法追责 |
| 引用 `latest` 或跨 run 拼接证据的风险 | 不可接受 | 证据不可审计 |

### 3.3 每个风险的接受人是谁?

设计阶段只能定义接受人角色，正式送验时必须在 `reports/acceptance/risk-acceptance.md` 中补成具体人或明确责任账号。

| 风险 | 默认接受人角色 |
|---|---|
| public registry 发布 | release / operations owner |
| production endpoint 全量覆盖 | service capability owner |
| real credential provider | security reviewer |
| remote config / hot reload | configuration owner |
| gateway / MCP / REST / GraphQL / REPL | architecture owner |
| fixed performance threshold | SDK maintainer + acceptance owner |
| full service client coverage | SDK maintainer + service capability owner |
| S2 / S3 缺陷遗留 | 缺陷 owner + acceptance owner |

### 3.4 后续动作和截止时间是什么?

| 风险类别 | 后续动作 | 截止时间口径 |
|---|---|---|
| public registry 发布 | 建立 release / operations 专项，补 crates.io / PyPI / npm 发布、签名、撤回和回滚验收 | public registry release 前 |
| production endpoint 全量覆盖 | 服务 API 稳定后分批加入真实 endpoint smoke / contract | 对应服务 API stable 前 |
| real credential provider | 建立 security / operations 专项，验证 secret provider 故障、轮换和权限边界 | production credential 接入前 |
| remote config / hot reload | 进入配置 P1/P2 设计，补在线配置一致性和回滚策略 | remote config 启用前 |
| gateway / MCP / REST / GraphQL / REPL | 后续架构裁剪并决定是否进入 SDK 或其他仓 | 对应入口进入 P0 前 |
| fixed performance threshold | 收集 baseline 后补阈值、环境和回归门禁 | 性能阈值进入需求前 |
| full service client coverage | 按 formal API 稳定度分批纳入 client coverage | 相关服务 client 宣称 stable 前 |
| S2 / S3 缺陷遗留 | 建 issue、指定 owner、补复验入口 | risk acceptance 记录指定日期或 milestone |

### 3.5 风险是否需要同步到实施计划或问题记录?

需要。所有风险接受项必须写入 `reports/acceptance/risk-acceptance.md`。所有仍需后续动作的遗留项必须写入 `reports/acceptance/open-issues.md`。如果后续动作会改变实现范围、发布流程、配置能力或跨仓依赖，还必须同步到实施计划或对应仓库问题记录。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 残余风险来自测试方案，但验收中未形成签署字段 | 只有风险、影响、缓解方式和接受人角色 | 正式验收时无法确认谁接受 | 本步固定 risk acceptance 必填字段 |
| P1/P2 非范围容易被误声明为已完成 | local candidate 可能被误读为 public registry 发布 | 验收结论夸大 | 本步要求明确声明非 P0 交付 |
| 风险接受可能覆盖 S0/S1 | 风险表如果不限制，可能把阻断缺陷包装为接受风险 | P0 失败被放行 | 本步禁止 VETO/S0/S1 风险接受 |
| 后续动作缺少截止时间口径 | 只有“后续专项” | 无法追责 | 本步要求日期或 milestone |
| open issues 和 risk acceptance 边界不清 | 遗留问题可能只写在一个地方 | 复验入口缺失 | 本步要求风险接受写 `risk-acceptance.md`，后续动作写 `open-issues.md` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 风险来源 | 测试方案列出残余风险 | 验收标准承接为可签署风险接受项 | 可裁决 |
| 接受人 | 只有角色 | 正式送验必须补具体人或责任账号 | 可追责 |
| 可接受范围 | 泛化说 P1/P2 可接受 | 只允许 S2/S3/P1/P2 risk，且不得污染 P0 | 不误放行 |
| 不可接受范围 | 分散在 VETO 和缺陷章节 | 汇总 VETO/S0/S1/raw secret/fake stable 等禁止项 | 可检查 |
| 后续动作 | 后续专项描述 | 每类风险有后续动作和截止时间口径 | 可复验 |

---

## 6. 验收裁决取舍

### 6.1 是否在设计文档中填写具体接受人姓名

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 设计阶段填写具体姓名 | 看起来完整 | 设计文档无法预知正式验收人员 | 不采用 |
| B. 设计阶段定义接受人角色，正式送验补具体人或责任账号 | 可复用且可落地 | 需要验收时补齐 | 采用 |
| C. 不写接受人 | 文档更短 | 不符合 SOP，不能支撑有条件通过 | 不采用 |

### 6.2 是否允许 P1/P2 风险不写入 risk acceptance

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许，只要非范围即可 | 简单 | 容易遗漏后续闭环 |
| B. 不允许；凡用于有条件通过的 P1/P2 risk 必须记录 | 可审计 | 需要维护风险表 | 采用 |
| C. 只记录 high risk | 灵活 | 分级主观，标准不可重复 | 不采用 |

### 6.3 open issues 是否可以替代 risk acceptance

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 可以替代 | 文件少 | open issue 不等于风险签署 |
| B. 不可替代；risk acceptance 负责签署，open issues 负责后续执行 | 责任清楚 | 需要两个文件保持引用 | 采用 |
| C. 只用 issue tracker | 工程化 | 验收报告不可自洽 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 风险接受表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| public registry 发布未覆盖 | local candidate 不代表公网分发可用 | P0 只要求 local package candidate | 补 release / operations 专项 | release / operations owner | release / operations owner | public registry release 前 |
| production endpoint 全量覆盖未完成 | fake / fixture 通过不代表所有服务能力可用 | P0 只要求最小 formal / fake boundary | 服务 API stable 后分批接入 | service capability owner | service capability owner | 对应服务 API stable 前 |
| real credential provider 未覆盖 | 未验证真实 secret provider 故障 | P0 只验证 ref-only 和 raw secret forbidden | 安全 / 运维专项 | security reviewer | security reviewer | production credential 接入前 |
| remote config / hot reload 未覆盖 | 未验证在线配置一致性 | P0 明确拒绝 remote config / hot reload | 配置 P1/P2 设计 | configuration owner | configuration owner | remote config 启用前 |
| gateway / MCP / REST / GraphQL / REPL 未覆盖 | 不证明这些入口体验 | 生态增强非当前 P0 | 后续架构裁剪 | architecture owner | architecture owner | 对应入口进入 P0 前 |
| fixed performance threshold 未收稳 | 不能声明固定微基准达标 | 当前需求只要求测量点和明显瓶颈判断 | 补性能 baseline 和阈值门禁 | SDK maintainer | SDK maintainer + acceptance owner | 性能阈值进入需求前 |
| full service client coverage 未完成 | 当前只证明最小接入 | 全量服务 client 是 P1/P2 扩展 | 按 formal API 稳定度分批加入 | SDK maintainer + service capability owner | SDK maintainer + service capability owner | 相关服务 client stable 前 |

### 7.2 `risk-acceptance.md` 必填字段

| 字段 | 作用 | 是否必填 |
|---|---|---|
| risk_id | 稳定引用风险 | 是 |
| risk_title | 简短说明风险 | 是 |
| severity | 只能是 S2 / S3 / P1 / P2 risk | 是 |
| affected_scope | 说明影响范围 | 是 |
| non_p0_reason | 说明为什么不阻断 P0 | 是 |
| acceptance_reason | 说明为什么可以有条件接受 | 是 |
| owner | 后续处理责任人 | 是 |
| accepter | 风险接受人，必须是具体人或责任账号 | 是 |
| deadline | 日期或 milestone | 是 |
| followup_action | 后续动作 | 是 |
| retest_entry | 复验入口 | 是 |
| evidence_ref | 固定 `run_id` 的证据引用 | 是 |
| open_issue_ref | 如有后续动作，引用 `open-issues.md` 或 issue | 条件必填 |

### 7.3 不可接受风险表

| 禁止项 | 裁决 |
|---|---|
| `VETO-SDK-*` 任一触发 | 不通过 |
| S0 / S1 未关闭 | 不通过 |
| P0 gate failed | 不通过 |
| raw secret、credential value、request / response / payload body 泄露 | 不通过 |
| fake-only success 支撑 production supported 或 `Stable` | 不通过 |
| skipped / failed / missing / unredacted evidence 支撑 `Verified` / `Stable` | 不通过 |
| P1/P2 非范围被声明为 P0 已交付 | 不通过或不得进入验收 |
| 风险无接受人、无期限、无复验入口 | 不得有条件通过 |

### 7.4 风险接受流

图类型: 风险接受裁决流

图标题: L0-sdk 风险接受链

```text
remaining defect or risk
  |
  v
classify severity
  |
  +-- VETO / S0 / S1 --> not accepted
  |                       risk acceptance forbidden
  |
  +-- S2 / S3 / P1 / P2 -> create risk-acceptance.md entry
                              |
                              v
                         owner + accepter + deadline
                              |
                              v
                         open issue + retest entry
                              |
                              v
                         conditional acceptance allowed
```

关键说明:

- `risk-acceptance.md` 是签署依据，`open-issues.md` 是后续执行入口。
- 没有接受人的风险不能支撑有条件通过。
- 风险接受不能改变 P0 验收事实，只能说明非阻断遗留如何被承接。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“风险接受表”“risk-acceptance.md 必填字段”“不可接受风险表”和“风险接受流”小节，了解本章如何把残余风险转为正式验收可签署记录。

L0-sdk 只有 S2、S3 或 P1 / P2 risk 可以作为有条件通过的风险接受对象。`VETO-SDK-*`、S0、S1、P0 gate failed、raw secret / credential / body 泄露、fake-only success 支撑 `Stable`、未脱敏或不可追溯证据支撑 `Verified` / `Stable`，均不得通过风险接受放行。

风险接受必须记录到 `reports/acceptance/risk-acceptance.md`。每项记录必须包含 risk id、severity、affected scope、non-P0 reason、acceptance reason、owner、accepter、deadline、followup action、retest entry 和 evidence ref。存在后续动作时，还必须同步到 `reports/acceptance/open-issues.md` 或对应问题记录。

本轮可接受的残余风险包括 public registry 发布未覆盖、production endpoint 全量覆盖未完成、real credential provider 未覆盖、remote config / hot reload 未覆盖、gateway / MCP / REST / GraphQL / REPL 未覆盖、fixed performance threshold 未收稳、full service client coverage 未完成。它们不阻断 P0 的前提是：当前验收只声明 local package candidate、最小 formal / fake boundary、credential ref-only 和测量点成立，不声明公网发布、全量生产服务接入、真实 secret provider、远程配置或全量生态入口已完成。

没有接受人、没有截止时间、没有复验入口、没有固定 `run_id` 证据引用的风险，不得支撑有条件通过。

---

## 9. 决策记录

| 决策点 | 可选方案 | 采用方案 | 原因 |
|---|---|---|---|
| 接受人写法 | A. 设计阶段写具体姓名；B. 设计阶段写角色，验收时补具体人；C. 不写 | 采用 B | 文档可复用且正式验收可签署 |
| P1/P2 risk 是否必须记录 | A. 可不记录；B. 支撑有条件通过时必须记录 | 采用 B | 防止非范围风险被遗忘 |
| open issues 是否替代 risk acceptance | A. 可替代；B. 不可替代 | 采用 B | 签署和执行职责不同 |
| fixed performance threshold 如何处理 | A. 宣称达标；B. 只声明测量点，阈值后续收稳 | 采用 B | 当前需求未固定具体阈值 |
| local candidate 是否代表 public registry | A. 是；B. 否 | 采用 B | local package candidate 不等同公网发布 |

---

## 10. 进入下一步检查

| 检查项 | 状态 |
|---|---|
| SOP 问题已逐项回答 | 已满足 |
| 风险接受表已定义 | 已满足 |
| 不可接受风险已定义 | 已满足 |
| 接受人、后续动作和截止时间口径已定义 | 已满足 |
| 风险同步到 `risk-acceptance.md` / `open-issues.md` 的规则已定义 | 已满足 |
| 所有残余风险都有处理口径 | 已满足 |
| 正式文档未修改 | 已满足 |

结论: 可以进入 Step 14,定义最终结论与签署口径。
