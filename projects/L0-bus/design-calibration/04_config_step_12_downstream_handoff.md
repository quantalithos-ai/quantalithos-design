# L0-bus 04 配置设计 Step 12: 测试、验收、实施与运维承接

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 12 中间产物。
> 本步定义 `04-配置设计.md` 如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续部署运维文档承接。
> 本步不替测试方案写完整用例,不替运维手册写部署命令。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义测试、验收、实施与运维承接 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §12 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_06_profiles_matrix.md` | local-dev、ci-test、integration-test、operations-recovery 为 P0;staging-like、production-like 为 P1/P2 | 确定测试和验收 profile 覆盖 |
| `04_config_step_07_config_items.md` | 配置项清单、JSON demo 和完整 demo 已定义 | 为测试、验收、实施提供配置字段输入 |
| `04_config_step_08_sensitive_secrets.md` | 敏感配置只保存引用,输出必须脱敏 | 为 redaction、安全验收和实施检查提供输入 |
| `04_config_step_09_load_validate_apply.md` | 加载、校验、生效和 reload 拒绝规则已定义 | 为 config loader / validator 测试和实施任务提供输入 |
| `04_config_step_11_failure_modes.md` | 失效模式和 fail-fast / fail-closed 规则已定义 | 为失败场景测试和验收门禁提供输入 |
| 当前 `05-测试方案.md` / `06-验收标准.md` | 当前仍是旧版下游文档 | 本步只定义后续重校准承接关系 |

---

## 3. SOP 问题回答

### 3.1 哪些配置场景进入测试方案?

`05-测试方案.md` 后续重校准时至少承接:

- 默认配置路径: 无配置文件时使用 code defaults 并通过 validator。
- JSON 配置解析: 严格 JSON,不支持注释。
- env override: 合法覆盖和非法值 fail-fast。
- 配置项范围校验: batch、timeout、poll interval。
- cross-field 校验: kind/ref mismatch、external kind 缺 ref。
- forbidden boundary: security policy 放宽、redaction 关闭、projection truth write。
- sensitive ref: fake ref、非法 ref、provider unavailable。
- reload / hot update 拒绝。
- profile matrix: local-dev、ci-test、integration-test、operations-recovery。
- reports / artifacts redaction check。

测试方案不应重新定义配置字段,只引用 `04` 的配置项和失败策略。

### 3.2 哪些配置门禁进入验收标准?

`06-验收标准.md` 后续重校准时至少承接:

- 所有 P0 配置项可被 loader 解析并生成 `ValidatedRuntimeConfig`。
- 非法配置不得构造 `RuntimeGraph`。
- 高优先级非法 env 不得回退低优先级旧值。
- sensitive ref 不得出现明文 material。
- redaction check 必须通过。
- reload / hot update 请求必须被拒绝。
- P0 不自动 last-known-good,不自动 degrade 到 in-memory。
- 正式报告必须包含配置摘要和红线校验结果。

验收标准不应重新发明配置来源优先级或 JSON key。

### 3.3 哪些配置准备进入实施计划?

`07-实施计划.md` 后续编写时至少承接:

- 实现 `ConfigLoader` 的 defaults / JSON / env / job local args 输入。
- 实现 `ConfigValidator` 的 type、range、ref、cross-field、forbidden boundary 校验。
- 实现 `ValidatedRuntimeConfig` 到 `RuntimeBuilder` 的装配。
- 实现 fake ref / fake provider 测试支撑。
- 实现 redaction check 脚本或测试入口。
- 实现 config summary 输出,但不得输出敏感值。
- 在 commit boundary 中单独安排 config loader / validator / runtime wiring / tests。

实施计划不应改动配置设计结论;如实现发现配置契约不足,必须回到 `04` 或 `03` 对应 Step。

### 3.4 哪些配置部署细节留给部署与运维手册?

后续 `09-部署与运维手册.md` 或等价运维文档承接:

- 实际配置文件路径。
- 环境变量命名和部署注入方式。
- secret provider / connection provider 的产品级配置。
- external store / MQ / publisher 的生产参数。
- 进程重启、job invocation 和回滚操作命令。
- 配置备份、审批记录和运行值巡检。
- staging-like / production-like 的具体部署拓扑。

这些内容不应提前写进 `04`,否则会把配置设计变成部署手册。

### 3.5 下游文档不应重复定义哪些配置契约?

下游不应重复定义:

- JSON 顶层 key 和配置项字段名。
- 配置来源优先级。
- sensitive ref / connection ref 存储口径。
- P0 不支持 reload / hot update。
- fail-fast / fail-closed / degraded / last-known-good 口径。
- 安全边界 policy 的固定值。
- 本地配置不包 `bus` / `l0_bus` 项目前缀。

下游只能引用、测试、验收、实施或部署这些契约。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 下游当前文档仍是旧版 | `05` / `06` 存在,但早于新版 `00~04` | 后续测试验收可能漏掉配置红线 | 本步明确后续重校准承接输入 |
| 配置设计容易替测试方案写用例 | Step 11 已有大量测试切口 | `04` 过度展开会污染职责 | 本步只列承接场景,不写完整用例 |
| 配置设计容易替运维手册写命令 | Step 10 有变更和回滚口径 | 提前绑定部署方式 | 本步只定义留给运维的内容 |
| 下游可能重复定义配置契约 | 多个文档都可能写 JSON key 或 env 规则 | 造成漂移 | 本步明确下游只引用 `04` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试承接 | 未系统列出 | 明确配置解析、校验、失败、redaction、profile 测试输入 | 方便后续 `05` 重校准 |
| 验收承接 | 未系统列出 | 明确 P0 配置门禁 | 方便后续 `06` 重校准 |
| 实施承接 | 只在详细设计中有 config binding | 明确 loader、validator、runtime wiring、redaction check 任务输入 | 方便后续 `07` 编写 |
| 运维边界 | 未明确 | 部署路径、env 名称、provider 产品配置留给运维手册 | 保持 `04` 不膨胀 |
| 重复定义边界 | 未明确 | 下游不得重新定义配置契约 | 降低文档漂移 |

---

## 6. 配置设计取舍

### 6.1 是否在配置设计中写完整测试用例

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只列测试场景和输入 | 保持配置设计边界清晰 | 需要 `05` 继续展开 | 采用 |
| B. 在 `04` 写完整测试用例 | 读者一次看到更多 | 侵入测试方案职责 | 不采用 |
| C. 不提测试 | 简洁 | 下游承接不清 | 不采用 |

结论: `04` 只提供测试输入和门禁,完整用例留给 `05`。

### 6.2 是否在配置设计中写部署命令

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不写命令,只写运维承接边界 | 稳定,不绑定部署工具 | 运维文档还需补充 | 采用 |
| B. 直接写命令 | 可操作 | 当前未选定部署形态,容易过期 | 不采用 |
| C. 只写示例命令 | 有参考 | 仍容易被误认为正式流程 | 不采用 |

结论: 部署命令留给 `09-部署与运维手册.md` 或等价文档。

---

## 7. 结构化中间产物

### 7.1 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | config loader、validator、profile、source priority、failure modes、redaction、reload rejection 测试场景 | Step 6 profile 矩阵;Step 7 配置项;Step 8 敏感配置;Step 9 加载校验;Step 11 失效模式 |
| `06-验收标准.md` | P0 配置门禁、非法配置拒绝、安全红线、reports / artifacts redaction、配置摘要 | Step 7 配置清单;Step 8 禁止输出;Step 9 生效机制;Step 11 失败策略 |
| `07-实施计划.md` | loader / validator / runtime builder / fake provider / redaction check / config tests 的实施任务 | Step 7 JSON 契约;Step 8 sensitive ref;Step 9 函数路径;Step 10 变更审计;Step 11 失效策略 |
| `09-部署与运维手册.md` 或等价文档 | 配置文件路径、env 注入方式、secret provider、external adapter 生产参数、重启和回滚操作 | Step 5 来源优先级;Step 8 ref-only;Step 10 变更回滚;Step 11 P0 不自动 LKG |
| `reports/` 与 `artifacts/test/` 产物规范 | 配置摘要、redaction check 结果、失败分类、profile 记录 | Step 8 禁止输出;Step 11 redaction 失败模式 |

### 7.2 下游不得重复定义的配置契约

| 配置契约 | 下游正确做法 | 禁止做法 |
|---|---|---|
| JSON key 与配置项清单 | 引用 `04` §7 | 在测试或实施文档中重新命名字段 |
| 来源优先级 | 引用 `04` §5 | 在实施计划中把 CLI 写成全局最高优先级 |
| sensitive ref | 引用 `04` §8 | 在测试中引入明文密钥路径 |
| reload / hot update | 引用 `04` §9 | 在实施计划中新增 P0 reload |
| 变更与回滚 | 引用 `04` §10 | 在运维文档中加入 bypass validator 的紧急流程 |
| fail-fast / fail-closed | 引用 `04` §11 | 在测试或验收中接受 silent fallback |

### 7.3 下游承接关系图

```text
04-configuration-design
  +-- Step 6 profiles
  +-- Step 7 config items
  +-- Step 8 sensitive refs
  +-- Step 9 load / validate / apply
  +-- Step 10 change / audit / rollback
  +-- Step 11 failure modes
        |
        +--> 05-test-plan
        +--> 06-acceptance-criteria
        +--> 07-implementation-plan
        +--> 09-deployment-operations-guide
        +--> reports / artifacts rules
```

图后说明:

- `04` 是配置契约来源。
- `05/06/07/09` 只承接、验证、实施或部署配置契约。
- 下游如发现配置契约不足,必须回到 `04` 对应 Step,不能在下游私自扩展。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 下游文档只承接配置契约,不重新定义配置代码结构 | 否 | 文档承接规则 | 无 | 无回写 |
| `07` 实施计划需承接 loader / validator / runtime builder 任务,但不改变函数签名 | 否 | 实施承接规则 | 无 | 无回写 |
| `05/06` 后续需覆盖配置失败和 redaction 门禁 | 否 | 测试验收承接规则 | 无 | 无回写 |
| 如下游实施发现 `03` 函数签名不足 | 是 | 详细设计回写 | `03-详细设计.md` §13 / §15 / §17 | 当前未发现 |

本步判定:

```text
Step 12 不要求回写 03-详细设计.md。

理由:
- 本步只定义下游承接关系。
- 没有新增配置项、函数、状态或 adapter 边界。
- 当前没有发现必须修改 03 的事项。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §12 应从本文件摘录,不在回填草稿中重复完整表格。

建议回填结构:

```text
## 12. 测试、验收、实施与运维承接

> 校准来源:
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 12 §7.1~§7.3,获取下游承接表、不得重复定义的配置契约和承接关系图。

### 12.1 下游承接表

摘录 `04_config_step_12_downstream_handoff.md` §7.1。

### 12.2 下游不得重复定义的配置契约

摘录 `04_config_step_12_downstream_handoff.md` §7.2。

### 12.3 下游承接关系图

摘录 `04_config_step_12_downstream_handoff.md` §7.3。
```

回填时必须保留以下说明:

- `05/06` 当前旧版内容后续需要按 `04` 重校准。
- `04` 不写完整测试用例。
- `04` 不写部署命令。
- 下游不能重新定义 JSON key、来源优先级、敏感配置口径或 reload 机制。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| `04` 是否写完整测试用例 | A. 不写,只给输入;B. 写完整;C. 不提测试 | 推荐 A | 完整用例属于 `05` | 按 A 写入本步 |
| `04` 是否写部署命令 | A. 不写;B. 写正式命令;C. 写示例命令 | 推荐 A | 命令属于部署运维文档 | 按 A 写入本步 |
| 下游是否允许重新命名配置项 | A. 不允许;B. 允许;C. 仅测试允许 | 推荐 A | 避免配置契约漂移 | 按 A 写入本步 |
| 当前旧版 `05/06` 是否立即修改 | A. 先由 `04` 定稿后再重校准;B. 现在同步改;C. 不改 | 推荐 A | 避免在 `04` 未定稿前重复修改下游 | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 下游承接关系明确 | 已满足 | §7.1 覆盖 `05/06/07/09` 和 reports / artifacts |
| 不替测试方案写完整用例 | 已满足 | 只列配置测试场景和输入 |
| 不替运维手册写部署命令 | 已满足 | 只列运维承接内容 |
| 下游不得重复定义配置契约 | 已满足 | §7.2 明确 |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 12 可以标记为已确认,并进入 Step 13“定义配置迁移、废弃与演进”。
