# Step 15. 整理正式配置设计文档

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 15 中间产物。
> 本步把 Step 1 ~ Step 14 的已确认结论组装为正式配置设计文档。
> 本步不新增配置项、不改变 `03-详细设计.md` 代码契约、不把测试、验收、实施或运维内容提前展开成完整方案。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 15
- 输出文档：`projects/L0-sdk/04-配置设计.md`

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 ~ Step 14 中间产物 | 已确认配置输入边界、范围、控制面、分类、来源、profile、配置项、敏感配置、加载校验、变更、失效、下游承接、演进和风险 | 组装正式 04 主体 |
| `04_config_calibration_flow.md` | 全部 Step 状态和详细设计影响判定 | 判断是否允许定稿 |
| Step 14 回写清单 | 当前无 `待回写` 或 `阻塞待确认` | 作为 Step 15 放行条件 |
| `配置设计书写规范.md` | 15 章主链、校准来源、图表和评审规则 | 校验正式文档结构 |
| `03-详细设计.md` | 11 个 `SdkRuntimeConfig` 配置组、配置绑定点、脚本 / 产物契约 | 确保 04 不静默新增代码契约 |

## 3. SOP 问题回答

1. 正式文档是否按书写规范章节主链组织?

   回答：是。正式 `04-配置设计.md` 使用 15 章主链: 上游关系、目标范围、控制面、分类边界、来源优先级、profile 矩阵、配置项清单、敏感配置、加载校验、生效机制、变更审计回滚、失效策略、下游承接、迁移演进、风险与参考。

2. 每章是否保留校准来源入口?

   回答：是。每个正式章节都保留 `校准来源` 和 `延伸阅读`,指向对应 `design-calibration/04_config_step_*.md` 中间产物。重内容章节只摘录正式契约,完整讨论、问题回答、取舍和回填草稿留在中间产物中。

3. 配置来源、优先级、环境矩阵、配置项、敏感配置、加载校验和失效策略是否互相一致?

   回答：一致。普通来源统一为 `code defaults < JSON config file < environment variables`;CLI / job args 只作 selector 或 operation-local 参数;P0 profile 统一为 local-dev、ci-test、integration-test、candidate-validation;配置项只在 11 个既有 `SdkRuntimeConfig` 配置组内细化;P0 无 secret material;加载校验在 builder 前完成;非法配置 fail-fast 或 fail-closed。

4. 下游 `05/06/07/09` 是否可以直接承接?

   回答：可以承接配置输入,但 `05/06` 当前仍是旧口径,需要后续按 04 重校准。`07/09` 当前尚未创建,需要后续承接配置 schema、loader / validator、实施任务、真实路径、env 注入、secret provider 和运维命令。正式 04 不替它们展开完整内容。

5. 是否存在改变 `03-详细设计.md` 代码契约但未回写的配置结论?

   回答：不存在。Step 1 ~ Step 14 当前生效结论均不改变 `03-详细设计.md`。future candidate 如 remote config、config center、reload / hot update、registry credential、config fingerprint API、root `profile` 或 `config_schema_version` 不进入当前 active 配置契约。

6. 是否有内容误放到部署手册、测试方案或实施计划?

   回答：没有。正式 04 只定义配置契约、矩阵、边界和下游输入;完整测试用例、验收裁决、编码顺序、commit boundary、部署命令、真实环境值和运维 runbook 均留给 05/06/07/09。

## 4. 结构化中间产物

### 4.1 正式文档组装清单

| 正文章节 | 来源 Step | 处理方式 |
|---|---|---|
| §1 | Step 1 | 摘录上游输入边界和事实源 |
| §2 | Step 2 | 摘录 P0 / P1 / P2 范围与非范围 |
| §3 | Step 3 | 摘录配置进入 runtime 的总图和控制面 |
| §4 | Step 4 | 摘录分类、冷更新口径和禁止配置化表 |
| §5 | Step 5 | 摘录来源优先级与冲突处理 |
| §6 | Step 6 | 摘录 profile 矩阵 |
| §7 | Step 7 | 摘录配置项清单和 JSON demo 规则 |
| §8 | Step 8 | 摘录敏感配置与禁止输出 |
| §9 | Step 9 | 摘录加载、校验与生效机制 |
| §10 | Step 10 | 摘录变更、审计与回滚 |
| §11 | Step 11 | 摘录失效模式与失败策略 |
| §12 | Step 12 | 摘录下游承接表 |
| §13 | Step 13 | 摘录迁移、废弃与演进规则 |
| §14 | Step 14 | 摘录风险、待确认和回写清单 |
| §15 | Step 15 + 规范 | 列出参考文档 |

### 4.2 自检清单

| 检查项 | 结果 | 说明 |
|---|---|---|
| 承接 `03-详细设计.md` | 通过 | 仅细化既有 11 个 `SdkRuntimeConfig` 配置组 |
| 使用配置设计 15 章主链 | 通过 | 章节名与书写规范一致 |
| 每章有校准来源 | 通过 | 每章均引用具体中间产物 |
| 配置项清单完整 | 通过 | 覆盖 store / sources / boundaries / runners / artifacts / outbox / projections / language_packages / policies / cli / jobs |
| 敏感配置单独处理 | 通过 | §8 单独定义 sensitive ref 和 raw secret 禁止 |
| 加载校验和失效策略明确 | 通过 | §9 / §11 分别定义 |
| 详细设计影响判定已完成 | 通过 | §14 汇总无当前回写项 |
| 必要的 03 回写已完成 | 不适用 | 当前无需要回写的生效结论 |
| 下游承接明确 | 通过 | §12 明确 05/06/07/09 和 reports / artifacts |
| 未把未来项写成 active | 通过 | §13 / §14 保留 future candidate 边界 |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 组装正式 `04-配置设计.md` | 否 | 文档定稿 | 无 | 无回写 |
| 继续保持当前 P0 配置项在 11 个既有配置组内 | 否 | 配置 schema 细化 | 无 | 无回写 |
| future candidate 不进入 active 配置契约 | 否 | 演进门禁 | 无 | 无回写 |

## 6. 完成条件

- [x] 正式 `projects/L0-sdk/04-配置设计.md` 已创建。
- [x] 正式文档按配置设计书写规范 15 章主链组织。
- [x] 每章保留校准来源和延伸阅读。
- [x] 当前无改变 `03-详细设计.md` 代码契约但未处理的配置结论。
- [x] 下游承接关系明确。
- [x] Step 15 状态从 `[~]` 更新为 `[x]`。
