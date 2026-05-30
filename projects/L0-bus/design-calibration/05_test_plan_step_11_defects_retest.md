# L0-bus 05 测试方案 Step 11: 缺陷管理与复验规则

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 11 中间产物。
> 本步定义测试缺陷分级、升级、修复、复验和关闭证据要求。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义缺陷管理与复验规则 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §11 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已确认 | 提取 P0 主链、一票否决候选、P1/P2 风险归属 |
| `05_test_plan_step_06_cases.md` | 已确认 | 提取 `TC-BUS-*` 用例、断言点和证据编号 |
| `05_test_plan_step_09_automation_ci_gates.md` | 已确认 | 提取 PR / main CI / release gate 阻断规则 |
| `05_test_plan_step_10_special_nonfunctional.md` | 已确认 | 提取红线型通过条件和专项测试矩阵 |
| `00-需求文档.md` §14 | 已完成 | 提取功能、规则、非功能验收方向 |

---

## 3. SOP 问题回答

### 3.1 哪些缺陷属于 S 级阻断?

本项目使用 `S0 / S1 / S2 / S3 / P1-risk` 分级。`S0` 是一票否决级,`S1` 是 P0 主链阻断级。

| 缺陷类型 | 等级 | 说明 |
|---|---|---|
| forbidden body / raw secret / backend private body 泄漏 | S0 | 安全红线,不得降级 |
| bus 重新定义或绕过 `L0-core` 契约 | S0 | core / bus 双真相 |
| replay 缺少 DLQ / history / audit chain 仍 ready | S0 | 恢复链可信度破坏 |
| Query 写 truth 或自动 rebuild projection | S0 | 只读边界破坏 |
| failure material 生成 governance decision body | S0 | governance 边界破坏 |
| P0 gate 无法生成必要 artifacts / reports | S0 | 验收证据缺失 |
| F-001~F-006 任一主链能力不可用 | S1 | P0 主闭环不成立 |
| F-007 / F-008 默认支撑边界不可用 | S1 | P0-min 支撑边界断裂 |
| 幂等 same key different digest 不 conflict | S1 | 请求混淆风险 |
| publisher / source ack / projection failure 回滚已提交 truth | S1 | 事务与副作用语义破坏 |
| P0 API / event / job schema 破坏 | S1 | 外部契约不稳定 |

### 3.2 哪些缺陷可以风险接受?

| 缺陷类型 | 可否风险接受 | 条件 |
|---|---|---|
| P1 production adapter smoke 失败 | 可以 | 不影响 P0 fake / in-memory 默认路径,进入 Step 14 残余风险 |
| staging-like 环境不可用 | 可以 | 当前版本不声明交付 P1 adapter |
| dashboard / alerting / SDK convenience 缺陷 | 可以 | 属于下游仓或产品层,且 bus 输出接缝通过 |
| 性能 baseline 无生产 SLO | 可以 | 已生成默认路径 baseline,未触发 gate timeout |
| nightly stress 波动 | 有条件 | 不能对应 S0 / S1 红线,需记录调查 |
| 文档措辞或非阻断报告格式问题 | 可以 | 不影响 evidence 可追溯和 acceptance index |

S0 / S1 不得风险接受。S2 / S3 可以在有 owner、到期时间、影响范围和复验计划时风险接受。

### 3.3 修复后必须回归哪些用例?

| 缺陷区域 | 最小回归范围 |
|---|---|
| publication / core boundary | `TC-BUS-PUB-001`~`004`、`bus-contract` |
| transport semantic / backend boundary | `TC-BUS-SEM-001`~`002`、`TC-BUS-BND-001`~`003` |
| delivery lifecycle | `TC-BUS-DLV-001`~`004`、state machine unit tests |
| feedback / idempotency | `TC-BUS-FDB-001`~`004`、idempotency suite |
| recovery / replay | `TC-BUS-REC-001`~`004`、`bus-release-recovery` |
| read-only output / Query | `TC-BUS-OUT-001`~`006`、no-write Query tests |
| outbox relay | `TC-BUS-OBX-001`~`002`、consumer integration |
| config | `TC-BUS-CFG-001`~`003`、`bus-config` |
| redaction / evidence | `TC-BUS-RED-001`~`002`、`check_redaction.sh`、`generate_reports.sh` |
| transaction / UoW | affected service tests + integration failure injection |
| script / report layout | `check_artifact_layout.sh`、`check_report_links.sh`、acceptance index generation |

### 3.4 缺陷关闭需要哪些证据?

| 关闭证据 | 适用缺陷 |
|---|---|
| 修复提交引用 | 全部缺陷 |
| 失败用例复现证据 | S0 / S1 / S2 |
| 修复后通过的 `TC-BUS-*` 证据 | S0 / S1 / S2 |
| 对应 gate run id | 所有自动化缺陷 |
| `artifacts/test/<run_id>` 证据路径 | S0 / S1 / release 相关缺陷 |
| `reports/runs/<run_id>` 报告 | release gate / redaction / coverage / report 缺陷 |
| redaction report | 安全和 forbidden body 缺陷 |
| risk acceptance record | S2 / S3 / P1-risk |

### 3.5 是否需要新增自动化防回归?

| 缺陷等级 | 自动化要求 |
|---|---|
| S0 | 必须新增或修复自动化用例 / check / gate,不得只人工复验 |
| S1 | 必须进入 PR 或 main CI 自动化 |
| S2 | 应进入自动化;无法自动化时需说明原因和人工复验步骤 |
| S3 | 可人工复验,但若重复出现必须自动化 |
| P1-risk | 如果未来转入 P1 交付,必须补专项自动化 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 缺陷分级未定义 | 无法判断哪些阻断 PR / release | 红线缺陷可能被普通化 | 本步定义 S0 / S1 / S2 / S3 / P1-risk |
| 一票否决缺陷可能被风险接受 | 安全、replay、Query no-write 等红线缺少管理规则 | 验收失真 | 本步明确 S0 / S1 不得风险接受 |
| 复验范围不清 | 修复后只跑局部测试 | 回归缺口 | 本步按缺陷区域绑定最小回归用例 |
| 关闭证据不清 | 缺陷关闭只靠口头确认 | 无法审计 | 本步定义 run id、artifact、report、redaction report |
| 自动化防回归不清 | 同类缺陷反复出现 | 质量退化 | 本步按等级定义自动化要求 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 缺陷等级 | 未定义 | S0 / S1 / S2 / S3 / P1-risk | 可裁决 |
| 风险接受 | 模糊 | S0 / S1 禁止风险接受,S2+ 条件接受 | 防止红线降级 |
| 回归范围 | 缺少映射 | 缺陷区域到 `TC-BUS-*` 和 gate 映射 | 可执行 |
| 关闭证据 | 不稳定 | commit、run id、artifacts、reports、redaction report | 可审计 |
| 防回归 | 未要求 | S0 / S1 必须自动化 | 降低复发 |

---

## 6. 测试设计取舍

### 6.1 是否允许 S0 缺陷风险接受

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许架构负责人接受 | 灵活 | 会破坏一票否决 | 不采用 |
| B. 不允许风险接受,必须修复或回退 | 守住红线 | 可能延迟交付 | 采用 |
| C. 降级为 S1 | 表面缓和 | 失去红线意义 | 不采用 |

### 6.2 是否所有缺陷都必须新增自动化

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部必须自动化 | 防回归强 | 对文档/轻微问题成本过高 | 不采用 |
| B. S0 / S1 必须自动化,S2 应自动化,S3 可人工 | 平衡成本和风险 | 需要分级判断 | 采用 |
| C. 都可人工复验 | 快 | 重复缺陷风险高 | 不采用 |

### 6.3 是否把 P1 adapter 缺陷阻断当前 P0

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 阻断当前 P0 | 提前暴露生产化问题 | 超出当前范围 | 不采用 |
| B. 记录 P1-risk,不阻断 P0 | 范围清晰 | 生产化风险后置 | 采用 |
| C. 完全忽略 | 文档更短 | 后续专项缺口 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S0 | 一票否决 / 安全红线 / 验收证据不可用 | forbidden body 泄漏、Query 写 truth、replay 绕过审计链、无 reports | 立即修复或回退;必须补自动化;不得风险接受 | 阻断 PR / release / acceptance |
| S1 | P0 主链或 P0-min 支撑边界不可用 | F-001~F-008 用例失败、schema 破坏、幂等 conflict 缺失 | 修复后跑最小回归 + 对应 gate | 阻断 PR / main CI / release |
| S2 | P0 非主链问题或非红线质量缺陷 | performance baseline 波动、非关键报告字段缺失 | 指定 owner、期限和复验计划;可条件风险接受 | 视影响阻断 |
| S3 | 文档、提示、低风险易用性问题 | 报告文字不清、非阻断脚本提示不友好 | 可排期修复;重复出现升级 | 不默认阻断 |
| P1-risk | 当前 P0 非范围,但影响后续生产化 | staging-like adapter 失败、真实 MQ smoke 不稳定 | 记录残余风险,后续 P1 专项处理 | 不阻断当前 P0 |

### 7.2 复验规则表

| 缺陷等级 | 复验要求 | 证据要求 |
|---|---|---|
| S0 | 复现失败 -> 修复 -> 跑相关 `TC-BUS-*` + release gate 相关 check | failed evidence、fixed evidence、run id、redaction / report |
| S1 | 跑相关用例族 + PR / main CI gate | run id、artifact path、summary |
| S2 | 跑受影响用例或专项 suite | run id 或人工复验记录 |
| S3 | 人工确认或轻量测试 | issue / review 记录 |
| P1-risk | 记录到 Step 14,若进入 P1 则补专项用例 | risk record、owner、target phase |

### 7.3 缺陷区域到回归映射

| 缺陷区域 | 必跑用例 / suite | 必要报告 |
|---|---|---|
| security / redaction | `TC-BUS-PUB-003`、`TC-BUS-RED-001`、`bus-release-redaction` | `redaction-check.md` |
| publication / contract | `TC-BUS-PUB-001`~`004`、`bus-contract` | coverage matrix |
| delivery / state | `TC-BUS-DLV-001`~`004`、state machine tests | delivery evidence |
| feedback / idempotency | `TC-BUS-FDB-001`~`004` | idempotency evidence |
| recovery / replay | `TC-BUS-REC-001`~`004`、`bus-release-recovery` | recovery evidence |
| read-only output | `TC-BUS-OUT-001`~`006` | query / audit evidence |
| config | `TC-BUS-CFG-001`~`003`、`bus-config` | config summary |
| reports / artifacts | `TC-BUS-RED-002`、report scripts | summary + acceptance index |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_11_defects_retest.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“缺陷分级表”“复验规则表”和“缺陷区域到回归映射”小节，了解本章缺陷管理与复验规则如何支撑验收裁决。

本测试方案采用 `S0 / S1 / S2 / S3 / P1-risk` 缺陷分级。`S0` 表示一票否决、安全红线或验收证据不可用,不得风险接受;`S1` 表示 P0 主链或 P0-min 支撑边界不可用,默认阻断 PR、main CI 或 release;`S2` 和 `S3` 可以在 owner、期限、影响范围和复验计划明确时条件接受;`P1-risk` 只记录当前 P0 非范围但影响后续生产化的风险。

缺陷关闭必须提供修复提交、复现证据、修复后通过的用例或 gate 证据、`run_id`、artifact / report 路径。S0 / S1 缺陷必须新增或修复自动化防回归,不得只靠人工复验。

---

## 9. 待确认事项

当前没有阻塞进入 Step 12 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| S0 是否允许风险接受 | A. 允许;B. 不允许;C. 降级为 S1 | 采用 B | S0 对应一票否决和安全红线 |
| S2 是否可条件接受 | A. 可以;B. 不可以;C. 全部延后 | 采用 A | 非红线问题可在 owner、期限和复验计划明确时接受 |
| P1 adapter 缺陷是否阻断当前 P0 | A. 阻断;B. 记录 P1-risk;C. 忽略 | 采用 B | 当前 P0 不交付 production adapter,但必须保留风险记录 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| S 级阻断缺陷已定义 | 已满足 |
| 可风险接受缺陷范围已定义 | 已满足 |
| 修复后最小回归范围已定义 | 已满足 |
| 缺陷关闭证据已定义 | 已满足 |
| 自动化防回归规则已定义 | 已满足 |
| 一票否决缺陷不得降级为普通风险 | 已满足 |

结论: 可以进入 Step 12,定义进入准则与退出准则。
