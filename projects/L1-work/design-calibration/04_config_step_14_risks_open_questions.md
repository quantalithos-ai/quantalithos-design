# Step 14. 定义风险与待确认事项

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 14 中间产物。
> 本步汇总 Step 1 至 Step 13 的配置风险、待确认事项和详细设计回写清单。
> 本步不新增配置项,不把 P1/P2 演进方向写成 P0 契约,不创建正式 `04-配置设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
- 回填章节: `projects/L1-work/04-配置设计.md` §14 风险与待确认事项

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_calibration_flow.md` | Step 1 至 Step 13 状态和详细设计影响判定总览 | 汇总 03 回写清单 |
| Step 1 至 Step 13 中间产物 | 配置输入边界、范围、控制面、配置项、敏感、加载、变更、失效、下游承接和演进规则 | 汇总风险和非阻塞待确认事项 |
| `配置设计书写规范.md` §5.14 | 风险表、待确认事项表和详细设计影响表格式 | 固定本步输出结构 |
| `配置设计讨论流程_SOP.md` Step 14 | 待确认项、阻塞范围和 03 回写清单要求 | 判断是否可以进入 Step 15 |

已确认结论:

```text
Step 1 至 Step 13 没有 `待回写` 或 `阻塞待确认` 的详细设计影响项。
当前所有 P0 配置结论均不改变 `03-详细设计.md` 的代码契约。
剩余风险集中在 P1/P2 生产化演进、下游文档承接、旧版 05/06 草案重写和实施阶段规范读取。
这些风险需要记录,但不阻塞 Step 15 生成正式 `04-配置设计.md`。
```

## 3. SOP 问题回答

### 3.1 哪些配置问题仍可能影响落地?

仍可能影响落地的问题集中在未来扩展和下游承接,不影响 P0 配置设计定稿:

| 问题 | 影响 |
|---|---|
| production-like durable DB / MQ / endpoint 字段全集未定义 | 会影响 P1/P2 真实部署和运维,不影响 P0 local / CI / integration-like / replay |
| secret provider / KMS / Vault 产品未定义 | 会影响真实凭据注入和轮换,不影响 P0 ref-only sensitive |
| config center / admin override / hot reload / last-known-good 未定义 | 会影响未来远程配置和在线恢复,不影响 P0 cold update |
| advanced search backend 未闭合 | 若误启用会导致 query 能力虚构,当前默认 disabled 并 fail-fast |
| clock / id generator、reports / artifacts root 不是 `WorkRuntimeConfig` 字段 | 实施时若需要显式配置,必须先回写 03 |
| 旧版 `05-测试方案.md` / `06-验收标准.md` 仍是草案 | 后续必须按新版 04 重写,不能反向作为配置事实源 |
| 下游文档可能重复定义配置契约 | 可能制造第二真相,需在 05 / 06 / 07 / 09 中只引用 04 |

### 3.2 哪些事项会阻塞测试、验收、实施或运维?

当前没有阻塞 Step 15 的配置事项。

阻塞范围按未来阶段划分:

| 事项 | 阻塞范围 | 当前是否阻塞 Step 15 |
|---|---|---|
| 正式 `04-配置设计.md` 已创建 | 历史风险已关闭 | 否 |
| 正式 `05/06` 已按新版生成 | 历史风险已关闭 | 否 |
| 目标实现仓和目录未在本轮配置设计中确认 | `07-实施计划.md` 和实施阶段 | 否 |
| production-like 真实依赖未定义 | P1/P2 部署与运维 | 否 |
| secret provider / config center / hot reload 未定义 | P1/P2 安全运维和远程配置 | 否 |
| advanced search backend 未定义 | 未来启用高级搜索 | 否,当前配置默认 disabled |

### 3.3 每个待确认事项需要谁确认?

| 待确认事项 | 需要谁确认 |
|---|---|
| P1/P2 production-like durable adapter 和真实 endpoint 绑定 | 架构负责人、运维负责人、对应外部系统负责人 |
| secret provider / KMS / Vault 产品和轮换流程 | 安全负责人、运维负责人 |
| config center / admin override / hot reload / last-known-good 是否进入未来范围 | 架构负责人、运维负责人、产品 / 交付负责人 |
| advanced search backend 是否进入后续实现 | 产品负责人、架构负责人、查询 / projection 负责人 |
| clock / id generator、reports / artifacts root 是否需要变成正式配置字段 | 实施负责人、测试负责人、架构负责人 |
| 旧版 `05/06` 如何按新版 04 重写 | 测试负责人、验收负责人 |
| 实现仓目录、技术栈规范和提交规范路径 | `07-实施计划.md` 负责人、实施负责人 |

### 3.4 未确认前应如何处理?

统一处理方式:

- 未确认的 P1/P2 能力不得写成 P0 已支持配置。
- 未确认的配置字段不得出现在 `WorkRuntimeConfig` 清单或 JSON demo 中。
- 未确认的生产 endpoint / secret provider / config center 不得进入测试验收必过口径。
- 下游文档只能标为 future / P1 / P2 / non-P0,不得自行定义字段或默认值。
- 如果后续确认会改变 struct、enum、trait、DTO、adapter constructor、error 或函数流,必须先回写 `03-详细设计.md`。

### 3.5 哪些配置结论改变了 `03-详细设计.md` 的代码契约?

当前没有。

Step 1 至 Step 13 的配置结论都只定义来源、优先级、profile、默认值、敏感级别、加载校验、失败策略、下游承接、迁移规则和风险边界,没有新增:

- `WorkRuntimeConfig` 字段。
- adapter constructor 参数。
- trait / port 方法。
- DTO / event / receipt 字段。
- ConfigError / DomainError 枚举。
- runtime reload API。
- config audit 持久化对象。
- schema_version / migration loader。

### 3.6 这些影响是否已经回写到 `03-详细设计.md`,还是需要标为阻塞待确认?

当前无需回写 `03-详细设计.md`,也没有 `阻塞待确认`。

如果后续引入以下能力,届时才需要回写 03:

- 新增 `WorkRuntimeConfig` section / field。
- 新增 config source: config center / admin override。
- 新增 secret provider / KMS / Vault 绑定字段。
- 新增 runtime hot reload / last-known-good 自动恢复。
- 新增 production-like durable adapter 构造参数。
- 新增 advanced search backend 配置和 query route。
- 新增 clock / id generator、reports / artifacts root 作为 runtime config 字段。
- 新增 deprecated key alias、schema_version 或 migration report 类型。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04_config_calibration_flow.md` | Step 1 至 Step 13 已有影响判定,但尚未集中汇总 | 本步形成总回写清单 |
| Step 2 / 6 / 13 | P1/P2 production-like、secret provider、config center、advanced search 等有演进方向 | 本步列为风险和 future scope,不写成 P0 契约 |
| Step 7 | clock / id、reports、redaction 是控制面但不是配置字段 | 本步列为实施风险,未来如需字段必须回写 03 |
| Step 12 | 已定义下游不得重复定义配置契约 | 本步把该风险提升到正式 §14 |
| 当前旧 `05/06` | 仍可能被误用为配置事实源 | 本步明确后续重写,且不阻塞 Step 15 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险 | 分散在 Step 2 / 6 / 8 / 11 / 13 | 汇总为 P1/P2 演进、下游承接、实施边界三类 | 支撑 Step 15 定稿 |
| 待确认事项 | 每步只说明不阻塞下一步 | 集中说明确认方和未确认前处理方式 | 防止未确认项变成正式契约 |
| 03 回写清单 | 每步单独判断 | 汇总 Step 1 至 Step 13,当前均无回写 | 判断能否进入 Step 15 |
| 下游风险 | Step 12 已有承接规则 | 标为正式风险,要求下游只引用 04 | 防止第二真相 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 非阻塞 P1/P2 风险集中记录,不阻塞 Step 15 | 保持 P0 定稿推进,同时不丢失未来风险 | 未来生产化仍需专项补设计 | 采用 |
| 方案 B: 等 production-like / secret provider / config center 全部确认后再写 04 | 看似完整 | 会把 P0 配置设计卡在 P1/P2 未决事项上 | 不采用 |
| 方案 C: 直接把 P1/P2 字段写入 04 并标“未来使用” | 文档看似覆盖全面 | 会虚构字段,导致实现 agent 误落码 | 不采用 |
| 方案 D: 不写风险,只写当前 P0 | 简洁 | 下游和未来演进容易误读非范围 | 不采用 |

推荐方案 A。

原因:

- 当前 P0 配置控制面已经闭合,不应被生产化细节阻塞。
- P1/P2 风险必须可见,但只能作为 future scope / 待专项设计,不能进入 P0 配置项清单。
- Step 15 可以生成正式 04,前提是正式文档清楚标明这些风险和非范围。

## 7. 结构化中间产物

### 7.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| production-like durable DB / MQ / endpoint 字段全集未定义 | P1/P2 真实部署前无法直接落地生产配置 | P0 只保留接缝;生产化前补 03 / 04 / 09 专项 | 架构负责人、运维负责人 |
| secret provider / KMS / Vault 未定义 | 真实 secret material 读取、轮换和吊销不能按 04 执行 | P0 只允许 ref-only sensitive;安全运维专项补 provider | 安全负责人、运维负责人 |
| config center / admin override / hot reload 未定义 | 未来远程配置或应急 override 不能直接实现 | P0 启用视为 unsupported fail-fast;P1/P2 先补权限、审计、reload、回滚 | 架构负责人、运维负责人 |
| last-known-good 自动恢复未定义 | 不能把配置失败自动吞错恢复 | P0 只支持人工恢复上一版配置后冷重启 / 新 job run | 架构负责人、运维负责人 |
| advanced search backend 未闭合 | 启用高级搜索可能造成 query 能力虚构 | `features.advanced_search_enabled=false` 默认;缺 backend 时 fail-fast | 产品负责人、查询 / projection 负责人 |
| clock / id generator 未作为配置字段 | 实施时若需要显式配置会影响 runtime builder | 当前由 builder 装配;需要字段时先回写 03 | 实施负责人、架构负责人 |
| reports / artifacts root 未作为 runtime config 字段 | 报告路径可能由测试 / 实施规范承接,不在 04 配置项中 | 当前由 05 / 07 / 09 承接;若进入 runtime config 先回写 03 | 测试负责人、实施负责人 |
| 旧版 `05/06` 与新版 04 不一致 | 后续测试验收可能引用旧配置口径 | 后续重写 05 / 06 时以正式 04 为配置事实源 | 测试负责人、验收负责人 |
| 下游文档重复定义配置契约 | 形成第二真相,实现 agent 可能选边 | 05 / 06 / 07 / 09 只引用 04,不得改写字段 / 默认值 / 失败语义 | 各下游文档负责人 |
| 实现阶段未读取配置规范和提交规范 | 可能把 P1/P2 字段、旧草案或未确认配置落码 | 07 实施计划写入阅读门禁和永久记忆种子 | 实施计划负责人、实施负责人 |

### 7.2 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 正式 `04-配置设计.md` 已创建 | 历史风险已关闭 | 已由 Step 15 完成 | 当前以正式 `04` 为准 |
| 目标实现仓 `/home/aris/Projects/quantalithos-work` 是否存在及目录结构 | 影响 07 实施计划和代码落地,不影响 04 | 实施负责人 | 04 不写实现仓命令;交给 07 确认 |
| production-like durable DB / MQ / endpoint 产品绑定 | 影响 P1/P2 部署 | 架构负责人、运维负责人 | P0 不写真实字段全集 |
| secret provider / KMS / Vault 产品选择 | 影响 P1/P2 安全运维 | 安全负责人、运维负责人 | P0 只写 ref-only sensitive |
| config center / admin override / hot reload 是否进入未来范围 | 影响 P1/P2 配置治理 | 架构负责人、运维负责人、产品 / 交付负责人 | P0 视为 unsupported |
| advanced search backend 是否进入后续实现 | 影响 future query 能力 | 产品负责人、查询 / projection 负责人 | P0 默认 disabled,缺 backend fail-fast |
| clock / id generator 是否需要显式 runtime config | 影响 runtime builder 和测试 fixture | 实施负责人、测试负责人、架构负责人 | 当前不新增字段;需要时回写 03 |
| reports / artifacts root 是否需要显式 runtime config | 影响报告路径和部署运维 | 测试负责人、实施负责人、运维负责人 | 当前由 05 / 07 / 09 承接 |
| 旧版 `05/06` 何时重写 | 影响测试验收承接 | 测试负责人、验收负责人 | 正式 04 定稿后再按 04 重写 |

### 7.3 详细设计影响汇总表

| Step | 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|---|
| Step 1 | 04 以新版 `00/01/02/03` 为主输入,旧 `05/06` 仅作下游参考 | 否 | 输入边界 | 无 | 无回写 |
| Step 2 | P0 聚焦默认可验证路径,P1/P2 production 字段全集后移 | 否 | 范围裁剪 | 无 | 无回写 |
| Step 3 | 建立配置控制面和 runtime builder 装配视图 | 否 | 控制面说明 | 无 | 无回写 |
| Step 4 | 定义配置分类、禁止配置化边界和无核心 hot update 口径 | 否 | 边界规则 | 无 | 无回写 |
| Step 5 | 定义 defaults < JSON file < env,entry args 局部输入,secret material 不入普通链 | 否 | 来源和冲突规则 | 无 | 无回写 |
| Step 6 | 定义 local-dev / ci-test / integration-like / operations-replay P0 profile | 否 | 环境矩阵 | 无 | 无回写 |
| Step 7 | 展开 `WorkRuntimeConfig` 既有 9 个 section / 28 个 P0 配置项 | 否 | 配置默认值和示例 | 无 | 无回写 |
| Step 8 | 定义 ref-only sensitive 和 raw material 禁止 | 否 | 配置安全语义 | 无 | 无回写 |
| Step 9 | 定义加载、typed validation、cross-field validation 和冷更新 | 否 | 加载 / 生效规则 | 无 | 无回写 |
| Step 10 | 定义配置变更、审计和回滚 | 否 | 治理规则 | 无 | 无回写 |
| Step 11 | 定义 fail-fast / fail-closed / unresolved / failed / stale 策略 | 否 | 失效策略 | 无 | 无回写 |
| Step 12 | 定义 05 / 06 / 07 / 09 下游承接和不得重复定义契约 | 否 | 文档承接规则 | 无 | 无回写 |
| Step 13 | 定义当前无迁移项和未来新增 / 废弃 / 移除规则 | 否 | 演进规则 | 无 | 无回写 |

### 7.4 Step 15 准入检查表

| 检查项 | 状态 | 说明 |
|---|---|---|
| 所有未关闭事项已有记录和处理方式 | 通过 | §7.1 / §7.2 |
| 不存在 `待回写` 的 03 影响项 | 通过 | §7.3 |
| 不存在 `阻塞待确认` 的 03 影响项 | 通过 | §7.3 |
| P1/P2 演进项未写成 P0 契约 | 通过 | §7.1 |
| 下游承接风险已记录 | 通过 | §7.1 / §7.2 |
| 可以进入 Step 15 生成正式 04 | 通过 | 需在 Step 15 严格引用 Step 1 至 Step 14 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 汇总 Step 1 至 Step 13 后确认当前没有 03 待回写项 | 否 | 风险收口,无代码契约变化 | 无 | 无回写 |
| P1/P2 风险只进入风险表,不进入 P0 配置项清单 | 否 | 范围裁剪,无代码契约变化 | 无 | 无回写 |
| 下游文档必须引用 04,不得重复定义配置契约 | 否 | 文档事实源规则,无代码契约变化 | 无 | 无回写 |

说明:

```text
本步没有新增 WorkRuntimeConfig 字段、adapter constructor、trait、DTO、error、runtime reload API、schema_version 或 migration loader。
当前不存在 `待回写` 或 `阻塞待确认` 的详细设计影响项,可以进入 Step 15。
```

## 9. 回填草稿

正式 `04-配置设计.md` §14 建议采用以下结构:

```text
14. 风险与待确认事项
  14.1 风险表
  14.2 待确认事项表
  14.3 详细设计影响汇总表
  14.4 Step 15 准入检查
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §14.1 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.1 |
| §14.2 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.2 |
| §14.3 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.3 |
| §14.4 | `design-calibration/04_config_step_14_risks_open_questions.md` §7.4 |

## 10. 待确认事项

无阻塞进入 Step 15 的待确认事项。

非阻塞待确认事项已在 §7.2 记录。Step 15 生成正式文档时必须保留这些事项,并明确它们不属于 P0 已支持配置。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有未关闭事项已有记录和处理方式 | 通过 | §7.1 / §7.2 |
| 不存在 `待回写` 的详细设计影响项 | 通过 | §7.3 |
| 不存在 `阻塞待确认` 的详细设计影响项 | 通过 | §7.3 |
| 可以进入 Step 15 | 通过 | 下一步整理正式 `04-配置设计.md` |
