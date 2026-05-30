# Step 6. 定义环境、部署 profile 与配置矩阵

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 6 中间产物。
> 本步定义 L0-bus 在 local、CI、test / integration、staging-like、production-like 和 operations-recovery 语境下的配置来源、依赖、敏感配置处理和差异。
> 本步不定义完整配置项清单,不写 JSON 示例,不新增 `RuntimeConfig.profile` 字段,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-bus/04-配置设计.md` §6 环境、部署 profile 与配置矩阵

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已确认普通来源优先级、CLI 局部输入、secret ref 边界和 fail-fast 规则 | 固定各 profile 的配置来源和覆盖方式 |
| `04_config_step_04_classification_boundaries.md` | 已确认 P0 核心配置冷更新、诊断配置边界和禁止配置化项 | 固定各 profile 的生效方式和不可越界项 |
| `01-架构设计.md` §7 / §11 / §13 | Bus API、Delivery worker、Outbox relay worker、Recovery worker、Read output worker、Bus store、MQ backend capability 等运行单元;P0 in-memory default path;P1 production adapter | 判断 local / CI / test / staging / prod 如何适用 |
| `03-详细设计.md` §13 / §15 / §17 | `RuntimeConfig`、配置绑定点、测试切口、reports / artifacts 目录、`04` 缺失风险 | 将 profile 差异映射到既有 config 组,不新增代码契约 |
| `03_ddd_step_14_config_dependencies.md` | in-memory / fake default path、fixture source、secret ref、production adapter 后移 | 确定 profile 下的外部依赖和敏感配置处理 |

已确认结论:

```text
L0-bus 是可以运行 API、worker 和 operations jobs 的子项目。
因此 staging-like 和 production-like 是适用语境,但不等于 P0 必须完成生产 MQ / durable store / KMS / config center 全量接入。

profile 是配置矩阵分类,不是本步新增的 `RuntimeConfig.profile` 字段。
P0 必须覆盖 local-dev、ci-test、integration-test 和 operations-recovery。
staging-like / production-like 作为 P1/P2 承接方向,在本步只定义边界和差异。
```

---

## 3. SOP 问题回答

### 3.1 local / CI / test / staging / prod 分别是否适用?

| 环境语境 | 是否适用 | 当前口径 |
|---|---|---|
| local | 适用 | P0 必须支持本地 API / worker / jobs 的默认可验证路径,使用 in-memory / fake / fixture profile |
| CI | 适用 | P0 必须支持自动化测试、配置校验、redaction check、deterministic clock / id generator 和 artifact 生成 |
| test / integration | 适用 | P0 必须支持跨 handler / service / adapter / projection 的集成测试,仍以 in-memory / fake 为主 |
| staging | 适用,但不阻塞 P0 | 作为 staging-like profile,用于后续真实或 real-like backend / store / secret provider / publisher 集成 |
| prod | 适用,但不阻塞 P0 | 作为 production-like / production-ops profile,具体部署、secret 注入、MQ / DB 参数和 runbook 留给 P1/P2 与运维手册 |

### 3.2 每个环境配置来源是什么?

所有 profile 均遵守普通来源顺序：

```text
code defaults < JSON config file < environment variables
```

CLI args 只作为 config source selector 或 operations job 局部参数,不作为全局覆盖层。

| profile | 配置来源 |
|---|---|
| local-dev | code defaults + local JSON config file + optional env override;job 局部 CLI 可传 run id / dry-run |
| ci-test | code defaults + test JSON config file + CI env override;CI job 可传 artifact root / run id |
| integration-test | test JSON config file + env override;fixture source 和 in-memory adapter 必须显式可追踪 |
| staging-like | staging JSON config file + env override + secret / connection refs;真实值由外部注入,不写入配置正文 |
| production-like | production JSON config file + env override + secret / connection refs;config center / admin override 后续专项 |
| operations-recovery | recovery JSON config file + env override + job 局部 CLI 参数;用于 retry / DLQ / replay preparation / projection rebuild |

### 3.3 每个环境依赖哪些外部服务?

| profile | 外部依赖 |
|---|---|
| local-dev | 不依赖真实外部服务;使用 in-memory store、fixture outbox source、in-memory backend、in-memory publisher、deterministic test utility |
| ci-test | 不依赖真实 MQ / DB / KMS;使用临时目录、in-memory / fake adapter、fixture source、deterministic clock / id generator |
| integration-test | 可以使用 real-like local process 或 fixture-backed adapter,但不依赖生产 MQ / durable store;必须可离线复现 |
| staging-like | 可以接入真实或 real-like MQ backend、durable store、secret provider、publisher boundary 和 observability consumer |
| production-like | 依赖真实 MQ backend、durable store、secret provider、publisher、observability / governance / SDK 消费面;具体产品参数后续定义 |
| operations-recovery | 依赖既有 bus truth、delivery history、DLQ、audit、projection store 或它们的受控 fixture / snapshot |

### 3.4 敏感配置在不同环境如何处理?

| profile | 敏感配置处理 |
|---|---|
| local-dev | 不允许 raw secret;可使用 fake secret ref 或禁用真实 adapter |
| ci-test | 不允许 raw secret;fixture 中只能出现不可解析假引用或测试 secret ref,不得输出真实 secret |
| integration-test | 不允许 raw secret;real-like adapter 如需 credential 只能使用 secret ref / connection ref |
| staging-like | 允许 secret ref / connection ref;真实 secret material 由外部注入,不得进入 JSON / env / CLI / report |
| production-like | 只允许 secret ref / connection ref;真实 material 由部署与运维手册和安全边界承接 |
| operations-recovery | 只读取脱敏引用和受控 secret ref;不得把历史 raw secret 写入 replay config、audit、report 或中间产物 |

### 3.5 哪些环境差异会影响测试和验收?

| 差异 | 对测试 / 验收的影响 |
|---|---|
| in-memory vs production-like backend | P0 验收只能证明 transport semantic 和 adapter boundary,不能宣称生产 MQ 能力 |
| in-memory store vs durable store | P0 必须验证 repository / UnitOfWork 语义;生产持久化性能和 HA 后续验收 |
| fixture source vs real outbox source | P0 验证 committed outbox fact 消费语义;真实 CDC / relay 形态后续专项 |
| deterministic clock / id generator vs system source | CI 必须可复现;production-like 需要 trace / audit 一致性验证 |
| fake publisher vs real publisher | P0 验证 outbound event contract;真实发布能力后续集成验收 |
| no secret vs secret ref | P0 必须验证 raw secret 被拒绝;staging / prod 必须验证 ref 解析和 redaction |
| projection stale marker | test 必须验证 stale marker;staging / prod 后续验证 lag 和 rebuild 运维流程 |
| operations-recovery profile | 必须验证 retry / DLQ / replay preparation / projection rebuild 不反写真相且不泄露 secret |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已定义来源优先级,但还没有落到环境矩阵 | Step 7 无法判断默认值和 profile 差异 |
| `01-架构设计.md` §7 | 已定义运行单元,但没有配置 profile 维度 | API / worker / jobs 的启动差异容易被实施者脑补 |
| `03-详细设计.md` §13 | 已定义配置绑定点,但没有 local / CI / integration / staging / prod 的配置使用口径 | 实现者可能把 production adapter 当 P0 前置 |
| 当前旧 `05/06` | 环境矩阵仍与新版设计主链不一致 | 后续测试验收必须基于本步重写 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有泛化 local / CI / test / staging / prod | 明确 local-dev、ci-test、integration-test、staging-like、production-like、operations-recovery | 让配置矩阵可直接承接到测试和实施 |
| P0 范围 | 容易把 staging / prod 当成 P0 生产接入 | P0 只要求 local / CI / integration / recovery 默认可验证路径;staging / prod 后移 | 避免生产 MQ / durable store / KMS 阻塞 P0 |
| 敏感配置 | 只说明 raw secret 禁止 | 按 profile 明确 fake ref、secret ref、connection ref 和真实 material 处理 | 支撑 Step 8 敏感配置设计 |
| 外部依赖 | 只列运行期依赖类型 | 按 profile 区分 in-memory / fake、real-like、真实外部能力 | 支撑测试矩阵和验收边界 |
| 03 回写 | 未判断 | profile 只是配置矩阵分类,不新增 `RuntimeConfig.profile` 字段 | 无需回写 03 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 dev / test / staging / prod 四环境写 | 通用、读者熟悉 | 难以表达 bus 的 worker / jobs / recovery profile,也容易误把 prod 写成 P0 | 不采用 |
| 方案 B：按 local-dev / ci-test / integration-test / staging-like / production-like / operations-recovery 写 | 贴合 L0-bus 的运行单元和恢复语义 | profile 数量更多,需要解释 P0 / P1 边界 | 采用 |
| 方案 C：新增正式 `RuntimeConfig.profile` 字段 | 实现上显式 | 本步只是矩阵分类,过早新增字段会回写 03 | 不采用 |
| 方案 D：完全不写 staging / prod | 避免生产字段虚构 | SOP 要求回答 staging / prod,且后续实施者会缺少承接边界 | 不采用 |

推荐方案 B。

原因：

- L0-bus 的配置差异不只是环境差异,还包括 API、worker、operations job、recovery、projection 等运行形态差异。
- P0 必须能在 local / CI / integration 下验证完整语义,但不应该承诺生产 MQ / DB / KMS 已完成。
- staging-like 和 production-like 需要在配置设计中给出边界,否则 P1/P2 实现会重新发明配置语义。

---

## 7. 结构化中间产物

### 7.1 环境 / profile 配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| local-dev | 本地开发、手动 API / worker / job 验证、最小主链调试 | defaults + local JSON file + env override;job 局部 CLI 可传 run id / dry-run | in-memory store、fixture outbox source、in-memory backend、in-memory publisher、deterministic utilities | 不使用 raw secret;可用 fake secret ref 或禁用真实 adapter | P0 必需;不代表生产能力 |
| ci-test | 自动化测试、配置校验、redaction check、确定性 fixture | defaults + test JSON file + CI env override;CI job 可传 artifact root / run id | 临时目录、in-memory / fake adapter、fixture source、deterministic clock / id generator | 不使用 raw secret;测试 secret ref 只能是假引用或 fixture ref | P0 必需;所有失败必须可复现 |
| integration-test | 跨 crate / handler / service / adapter / projection 集成测试 | test JSON file + env override | fixture-backed adapter、real-like local process 或 in-memory adapter | 不使用 raw secret;real-like adapter 只能使用 ref | P0 必需;用于验证 P0 主闭环 |
| staging-like | 后续跨仓集成、real-like backend / store / publisher 演练 | staging JSON file + env override + secret / connection refs | real-like MQ backend、durable store、secret provider、observability / governance consumer boundary | 只允许 secret ref / connection ref;真实 material 外部注入 | P1;不阻塞 P0 |
| production-like | 生产运行语境和正式 adapter / store / publisher 配置承接 | production JSON file + env override + secret / connection refs;config center 后续专项 | 真实 MQ backend、durable store、secret provider、publisher、observability / governance / SDK 消费面 | raw secret 不进配置;真实 material 由运维和安全边界管理 | P1/P2;具体产品字段后续定义 |
| operations-recovery | retry、DLQ、replay preparation、projection rebuild、backend capability check 等恢复 / 运维作业 | recovery JSON file + env override + job 局部 CLI 参数 | 既有 bus truth、history、DLQ、audit、projection store 或受控 fixture / snapshot | 只读脱敏引用和 secret ref;不得把历史 raw secret 写入配置或报告 | P0 必需;证明恢复路径和只读输出边界 |

### 7.2 profile 到测试验收承接表

| profile | 应进入测试方案的场景 | 应进入验收标准的门禁 |
|---|---|---|
| local-dev | 默认路径、local JSON、env override、job 局部 CLI、fake adapter、非法路径 fail-fast | 本地最小链路可运行,但不能单独作为最终验收通过依据 |
| ci-test | 重复 key、非法 env、缺失配置、raw secret 拒绝、redaction check、deterministic ID / clock | CI 能稳定复现配置成功和失败路径 |
| integration-test | publication acceptance -> delivery -> feedback -> recovery -> read-only output 的 P0 集成链 | P0 主闭环在默认可验证路径上通过 |
| staging-like | real-like backend / store / publisher / consumer boundary 的配置校验 | P1 集成不破坏 P0 transport semantic 和 redaction |
| production-like | 真实 adapter / store / publisher / secret provider 的配置和运维验证 | 生产配置不得绕过禁止配置化项,且 raw secret 不落盘 |
| operations-recovery | retry / DLQ / replay preparation / projection rebuild / backend capability check | recovery 不产生第二套 truth,不泄露 secret,不绕过 audit chain |

### 7.3 profile 与 P0 / P1 / P2 映射

| profile | 优先级 | 是否阻塞 P0 | 说明 |
|---|---|---|---|
| local-dev | P0 | 是 | 支撑开发和最小可运行路径 |
| ci-test | P0 | 是 | 支撑自动化测试、配置校验和证据生成 |
| integration-test | P0 | 是 | 支撑跨模块 P0 主闭环验证 |
| operations-recovery | P0 | 是 | 支撑 retry / DLQ / replay preparation / projection rebuild 验证 |
| staging-like | P1 | 否 | 支撑真实或 real-like 外部能力集成 |
| production-like | P1/P2 | 否 | 支撑生产 adapter、durable store、secret provider 和运维手册 |

### 7.4 profile 关系图

```text
P0 profiles
|
+-- local-dev
+-- ci-test
+-- integration-test
+-- operations-recovery
|
v
P1 / P2 profiles
|
+-- staging-like
+-- production-like
```

关键说明：

- P0 profiles 证明 L0-bus 默认可验证路径和配置红线成立。
- staging-like / production-like 承接后续生产化,但不改变 P0 设计边界。
- 所有 profile 都遵守普通来源优先级和 secret ref 边界。
- profile 是配置矩阵分类,不是本步新增代码字段。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| profile 是配置矩阵分类,不新增 `RuntimeConfig.profile` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| local-dev / ci-test / integration-test / operations-recovery 作为 P0 profile | 否 | 配置取值差异 | 无 | 无回写 |
| staging-like / production-like 作为 P1/P2 承接方向 | 否 | 范围分级 | 无 | 无回写 |
| 各 profile 均使用既有 config 组表达差异 | 否 | 不改变 `RuntimeConfig` / 子 config 结构 | 无 | 无回写 |

说明：

- 本步没有新增 runtime builder 参数、profile enum、adapter constructor 参数或错误枚举。
- Step 7 如果认为必须将 profile 做成正式配置字段,需要标记 `待回写` 并回到 `03-详细设计.md`。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §6。

````md
## 6. 环境、部署 profile 与配置矩阵

> 校准来源：
> - `design-calibration/04_config_step_06_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境 / profile 配置矩阵”“profile 到测试验收承接表”“profile 与 P0 / P1 / P2 映射”和“对详细设计的影响判定”小节，了解本章 profile 口径如何收敛。

L0-bus 的配置矩阵按 local-dev、ci-test、integration-test、staging-like、production-like 和 operations-recovery 展开。profile 是配置矩阵分类,不是本步新增的 `RuntimeConfig.profile` 字段。

P0 必须覆盖 local-dev、ci-test、integration-test 和 operations-recovery。它们共同证明 L0-bus 的默认可验证路径、配置加载、配置校验、in-memory / fake adapter、fixture source、redaction、recovery 和 projection 边界成立。

staging-like 和 production-like 适用于后续跨仓集成和生产化,但不阻塞 P0。生产 MQ backend、durable store、secret provider、config center、admin override 和完整 ops runbook 属于 P1/P2 或部署与运维手册承接内容。

所有 profile 均遵守普通配置来源顺序 `code defaults < JSON config file < environment variables`。CLI args 只作为 config source selector 或 operations job 局部参数。raw secret 不得进入普通配置来源、日志、错误返回、审计正文、测试报告或中间产物。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
````

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受 local-dev、ci-test、integration-test、operations-recovery 作为 P0 profile | A. 接受;B. 只保留 local / CI;C. 把 staging 也作为 P0 | 推荐 A | 这四类 profile 能覆盖开发、自动化、集成和恢复主线 |
| 是否接受 staging-like / production-like 不阻塞 P0 | A. 接受;B. staging 必须进入 P0;C. production-like 必须进入 P0 | 推荐 A | 生产 adapter、durable store 和 secret provider 未定,不应阻塞默认路径 |
| 是否接受 profile 只是配置矩阵分类,不新增 `RuntimeConfig.profile` 字段 | A. 接受;B. 新增字段;C. 等 Step 7 决定 | 推荐 A | 本步无需改变代码契约,Step 7 如有必要再评估 |

---

## 11. 进入下一步条件

- [x] P0 profile 划分已明确。
- [x] staging / production-like 的适用口径已明确。
- [x] 敏感配置在不同 profile 下的处理边界已明确。
- [x] 环境差异对测试和验收的影响已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 6 状态从 `[~]` 更新为 `[x]`。
