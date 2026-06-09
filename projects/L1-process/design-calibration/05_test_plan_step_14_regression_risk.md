# Step 14. 定义回归策略与残余风险

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 14 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节: `05-测试方案.md` §14 回归策略与残余风险
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。回归策略按变更类型触发最小回归集;残余风险承接 `03` Step 18、`04` Step 14 和本测试方案未覆盖项。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 9 自动化套件 | 定义回归集 | 每类变更映射到最小 suite |
| Step 10 专项测试 | 定义一票否决风险 | S 级失败必须全量相关回归 |
| Step 13 证据归档 | 定义回归证据 | 回归必须重新生成 fixed run_id 证据 |
| `03_ddd_step_18_risks_open_questions.md` | 设计残余风险 | production adapter、目标实现仓、redaction scan 细则等需保留 |
| `04_config_step_14_risks_open_questions.md` | 配置残余风险 | production-like config、secret provider、运维 runbook 后续承接 |

---

## 3. SOP 问题回答

1. 哪些变更触发最小回归?

   回答:contracts、domain、application、infra、api、worker、jobs、config、scripts、observability、dependencies、reports 均有最小回归集。

2. 哪些条件触发全量回归?

   回答:public protocol schema、state matrix、UoW / idempotency、outbox / event mapping、config source priority、redaction、runtime builder、report evidence schema 变更触发全量 P0 回归。

3. 哪些风险可以接受?

   回答:P1 real-like adapter、production-like config、remote config、redaction checker 细则、实现仓目标路径等可在 P0 测试退出时以角色接受,但不得伪装为已验证。

4. 谁接受残余风险?

   回答:当前以角色占位: design owner、test owner、acceptance owner、implementation owner、architecture owner、operations owner、sibling owner。具体人名由后续项目治理 / `06` / `07` 指定。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 回归策略只覆盖少量流程变更 | 按 crate / protocol / config / evidence 变更重建 |
| `03` Step 18 | 风险中部分已经被 04 / 05 推进 | 保留仍未关闭项 |
| `04` | production-like 和 secret provider 后移 | 进入残余风险 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 回归触发 | ProcessInstance / checkpoint / projection | contracts、domain、service、infra、entry、config、script、report |
| 残余风险 | GUIDED / runtime / governance | production adapter、AC sync、redaction scan、target repo |
| 接受人 | TL / Owner | 角色化责任人 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| P1 未覆盖是否阻断 P0 | 不阻断,但必须明示并接受 |
| 具体人名是否写入 | 当前不写,用角色占位 |
| 是否把所有旧 03 风险复制进来 | 不复制已关闭项,只保留仍影响测试 / 验收 / 实施的事项 |

---

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| contracts DTO / enum / metadata | `contract` + affected entry-contract | public protocol schema、receipt、error surface 改动 | implementation owner / test owner |
| domain object / policy / state | `domain` + affected service | state matrix、policy guard、terminal semantics 改动 | domain owner |
| application command / query service | `service` + affected integration | UoW、idempotency、operation result、error mapping 改动 | application owner |
| repository / UoW / idempotency store | `integration` + `service` | transaction ordering、rollback、version conflict 改动 | infra owner |
| inbound consumer / outbound publisher | `entry-contract` + `integration` | event mapping、quarantine / delayed、outbox state 改动 | worker owner |
| operations jobs | `entry-contract` + `recovery-replay` | job receipt、partial failure、no auto repair 改动 | jobs owner |
| config loader / validator / runtime builder | `config-security` + `integration` | source priority、forbidden boundary、adapter binding 改动 | infra / config owner |
| source resolver / publisher / handoff adapter | `integration` + affected job / worker | retryable / permanent mapping、no fake fallback 改动 | infra owner |
| observability / audit / redaction | `config-security` + `evidence-scripts` | forbidden field、metric label、audit schema 改动 | observability / test owner |
| scripts / reports / evidence index | `evidence-scripts` + affected suite report | artifact / report path、evidence schema、redaction semantics 改动 | test / release owner |
| non-core dependency / workspace layout | `config-security` + dependency scan | Cargo dependency boundary 改动 | architecture / implementation owner |
| minimum E2E flow | `minimum-e2e` + all affected lower suites | 多入口组合、release candidate 或 P0 suite structural change | release owner |

### 7.2 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| `07-实施计划.md` 尚未生成 | 当前只做测试方案 | suite 到 commit / phase 的落点待定义 | 后续按实施计划 SOP 生成 | implementation plan owner |
| `/home/aris/Projects/quantalithos-process` 未确认 | 当前设计仓无法写实现 | 无法验证真实 workspace test layout | `07` PH-01 前确认或创建 | implementation owner |
| production-like DB / broker / secret provider 未锁定 | `04` 将其列为 P1/P2 | 真实容量、真实 transport 和运维证据未覆盖 | P0 使用 fake / in-memory;P1 real-like smoke 单列 | architecture / operations owner |
| real sibling adapter 未全部可用 | 跨仓实现进度独立 | integration-like 只能验证 controlled adapter | fake / event replay 不得伪装 production | sibling owner |
| redaction checker 具体扫描模式未定义 | `03` 只固定契约和失败语义 | 可能漏扫某类 forbidden content | 实现阶段补扫描规则并扩展 fixture | test owner |
| evidence index JSON schema 未细化 | `05` 只定义路径和语义 | 实现可能需要再细化字段 | `07` / 实现阶段定义,不得改变 EV 语义 | test / implementation owner |
| p1-real-like-smoke 是否阻断 release 未定 | 环境能力和发布策略未定 | release 风险判断不稳定 | 在 release plan / `06` 中决定 | release owner |

---

## 8. 回填草稿

`05-测试方案.md` §14 应输出回归触发表和残余风险表。所有未覆盖 P1/P2、待 `06/07`、待实现仓确认和待运维定义事项必须明示,不得混入 P0 已通过结论。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP14-OPEN-001 | 具体风险接受人 | 当前以角色占位 |
| TP14-OPEN-002 | P1 real-like smoke 阻断策略 | 待 `06/07` 或 release plan |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 回归触发和最小回归集明确 | 通过 |
| 残余风险有缓解方式和接受人角色 | 通过 |
| 未把 P1/P2 写成 P0 已覆盖 | 通过 |
