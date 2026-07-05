# Step 1. 确认配置输入边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节: `04-配置设计.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认配置输入边界 |
| 当前状态 | 已启动;待用户审查 |
| 输入基线 | 新版 `00/01/02/03`;旧 `04` 仅作待复核历史输入 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_01_upstream_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步目标

确认 `L1-artifact` 配置设计依赖的需求、架构、概要、详细设计和下游输入是否足够,并明确哪些配置线索可以作为正式配置设计输入。

本 Step 只回答:

- 当前配置设计承接哪些上游文档。
- 详细设计中哪些配置引用、runtime builder、adapter、外部依赖和禁止配置化边界需要进入配置设计。
- `05-测试方案.md` 和 `06-验收标准.md` 当前是否可作为配置真相源。
- 配置设计不再回答哪些问题,必须回答哪些问题。
- 当前是否存在阻塞进入 Step 2 的输入缺口。

本 Step 不定义配置项清单、默认值、环境矩阵、secret 存储方式、加载函数、校验规则、热更新策略、部署命令或产品选型。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 新版正式文档 | 抽取配置相关需求边界、非功能、安全、数据归属、外部依赖和验收红线 |
| `01-架构设计.md` | 新版正式文档 | 抽取配置不得越过的架构边界、依赖裁剪、产品中立和横切约束 |
| `02-概要设计.md` | 新版正式文档 | 抽取配置影响轮廓、禁止配置化边界和详细设计承接清单 |
| `03-详细设计.md` | 新版正式文档 | 抽取 runtime config、adapter availability、external dependency、config / adapter test cut 和未关闭风险 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 作为配置引用与外部依赖绑定的字段级来源 |
| `02_hld_step_11_configuration_impact.md` | 已完成概要设计中间产物 | 作为配置影响轮廓和禁止配置化边界的来源 |
| `05-测试方案.md` | 旧 / 待复核草案 | 只作为测试环境与配置矩阵方向输入,不得覆盖新版 `03` |
| `06-验收标准.md` | 旧 / 待复核草案 | 只作为验收环境与配置门禁方向输入,不得覆盖新版 `03` |
| `04-配置设计.md` | 当前不存在 | 本轮目标正式文档,不得假设已有配置真相源 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异? | 承接 truth 独立性、正文排除、唯一编译期依赖、外部依赖延迟可发现、外围增强失效不影响核心闭环、敏感 / forbidden body 不落日志审计和配置不得越界等要求。环境差异先只承接旧 `05/06` 中 test / staging 方向,正式环境矩阵留给 Step 6 重新收敛。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计? | `03` §13 明确 runtime mode / adapter availability、repository / projection / reference / outbox store、inbound consumer binding、publisher / topic binding、handoff / archive / external GRC target、observability / redaction 进入配置设计。`03` §4 / §5 / §6 还定义了 `infra::config`、`runtime_builder`、source resolver、publisher、handoff、external GRC adapter 和 fake / durable / disabled / degraded adapter。 |
| 哪些测试和验收场景依赖配置矩阵? | 旧 `05` 的环境与配置矩阵、CI / integration / staging、controlled event bus、deterministic emit adapter、isolated tables、fixed request fixtures、emitted result replay / audit compare 等只是方向输入。新版 `05/06` 需要在正式 `04` 后复核,不能反向定义配置项。 |
| 哪些内容不应在配置设计中重新定义? | 不重新定义需求目标、架构方案、概要组成部分、详细设计对象 / DTO / trait / port / flow / error / state。也不定义部署命令、容器挂载、人员值班、具体 DB / bus / search / metric / DLQ / external GRC 产品最终选型或容量 SLO。 |
| 当前上游是否存在会阻塞配置设计的缺口? | 不阻塞 Step 2。正式 `04` 不存在是本轮目标而非阻塞。`05/06` 需要按新版 `03/04` 复核,只能作为方向输入。具体产品未锁定不阻塞配置设计,但会在后续 Step 7~14 形成待确认或 disabled / fake / product-neutral 口径。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `04-配置设计.md` | 文件当前不存在 | 建立 `04_config_*` 中间产物链,正式 `04` 等 Step 15 装配 |
| `05-测试方案.md` | 文档声明前置 `04-配置设计.md`,但当前 `04` 不存在且 `05` 可能仍含旧口径 | 标记为方向输入,不得作为配置真相源 |
| `06-验收标准.md` | 环境基线和准入项可能引用旧测试 / 配置口径 | 标记为方向输入,后续需按新版 `03/04` 复核 |
| `03-详细设计.md` §13 | 只定义代码绑定点,不定义完整 profile、默认值、环境变量、secret、迁移、样例和产品选择 | 本轮配置设计继续展开 |
| `03-详细设计.md` §17 | 记录 durable DB / broker / search / HTTP、metric backend、DLQ、diagnostic store、external GRC 产品未锁定 | Step 1 记录为后续配置风险输入,不提前选型 |
| 旧文档链 | 旧 external GRC、PostgreSQL、audit store、Policy engine、report system 和旧性能数字不能直接继承 | 只作为历史候选输入,不得高于新版 `00/01/02/03` |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 没有正式 `04`;配置线索分散在 `02/03/05/06` | 建立 `04_config_calibration_flow.md` 和 Step 1 输入边界 | 符合配置 SOP 中间产物先行 |
| 下游 `05/06` 地位 | 可能被误当成配置输入真相源 | 标记为旧 / 待复核方向输入 | 避免旧测试或验收反向定义配置项 |
| 产品选型 | 旧文档和风险中出现 DB / bus / search / external GRC 候选 | 不在 Step 1 锁定产品,后续按配置域和待确认项处理 | 配置设计不替代 ADR / 实施计划 |
| 详细设计影响 | 配置线索只在 `03` §13 / §17 摘要出现 | 本 Step 明确配置设计若改变代码契约必须回写 `03` | 防止 `04` 静默新增 runtime config 或 adapter constructor |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接写正式 `04` | A. 直接生成正式配置文档;B. 先走 `04_config_*` 中间产物 | 采用 B。SOP 要求中间产物先行 |
| 是否沿用旧 `05/06` 环境矩阵 | A. 直接继承;B. 作为方向输入重新收敛 | 采用 B。旧文档需要按新版 `03/04` 复核 |
| 是否当前锁定 DB / bus / external GRC 产品 | A. 锁定产品;B. 先保持 product-neutral config seam | 采用 B。架构与详细设计未把产品选型定为真相源 |
| 是否允许配置设计新增 runtime config 字段 | A. 可直接在 `04` 新增;B. 影响代码契约时回写 `03` | 采用 B。配置设计不能静默修改详细设计 |
| 是否需要“无配置说明文档”路径 | A. 不考虑;B. 保留判断路径 | 采用 B。若 Step 2 判断无配置,仍需按 SOP 生成必要中间产物和正式无配置说明 |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | `L1-artifact` truth 独立性、外部正文排除、外围增强不前置、唯一编译期依赖、依赖延迟可发现和配置不得越界 | `04` §1 / §3 / §4 / §11 |
| `01-架构设计.md` | 配置不得弱化 truth ownership、正文排除、派生不反写、依赖裁剪和产品中立;具体 DB / bus / search / external GRC 产品未锁定 | `04` §1 / §4 / §13 / §14 |
| `02-概要设计.md` | Step 11 配置影响轮廓;ConfigLoader、ConfigValidator、RuntimeConfig、AdapterConfig、JobConfig、ConfigError 和 builder 注入需要详细 / 配置设计继续定义;禁止配置化边界已列出 | `04` §1 / §3 / §4 / §7 / §9 |
| `03-详细设计.md` | runtime mode / adapter availability、store binding、consumer binding、publisher topic、handoff / archive / external GRC target、observability / redaction;fake / durable / disabled / degraded adapter;禁止配置化边界 | `04` §1 / §3 / §4 / §7 / §9 / §11 |
| `03_ddd_step_14_config_external_binding.md` | config section、adapter binding、external dependency availability、runtime builder 顺序和禁止配置化边界 | `04` §3 / §4 / §7 / §9 |
| `02_hld_step_11_configuration_impact.md` | 配置影响轮廓、禁止配置化边界和详细设计承接方向 | `04` §1 / §4 / §12 |
| `05-测试方案.md` | test / staging、controlled event bus、deterministic emit adapter、isolated tables、fixed fixtures、audit compare 等测试环境方向 | `04` §6 / §12 |
| `06-验收标准.md` | test / staging 级接缝环境、输入语义稳定构造和环境准入方向 | `04` §6 / §12 / §14 |

### 8.2 配置设计不再回答的问题

- truth ownership 是否独立于 process、work、governance、conversation、runtime、observability 或 external GRC。
- `L0-core` 是否是唯一编译期依赖。
- 是否允许用配置改变 truth ownership、正文排除、状态机合法迁移、query no-write、projection 不反写、outbox snapshot 来源或 external GRC 不定义 truth。
- 是否选择具体 DB、message bus、cache、search、object storage、audit store、scheduler、rule engine 或 external GRC 产品。
- 是否重新定义 `03-详细设计.md` 中的 struct / enum / trait / function / DTO / flow / error / state。
- 是否重写测试方案、验收标准、实施计划或部署运维手册。

### 8.3 配置设计必须回答的问题

- `L1-artifact` 有哪些配置控制面和配置域。
- 哪些行为允许配置化,哪些禁止配置化。
- 配置来源、优先级和冲突处理规则是什么。
- test、staging、production-like 等环境 / profile 差异如何表达。
- 每个配置项的类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块是什么。
- token、password、cert、private key、DSN、secret ref 等敏感配置如何存储、读取、轮换、审计和禁止输出。
- 配置如何加载、校验、生效、变更、审计、回滚和失效。
- fake / durable / disabled / degraded / unavailable adapter 如何通过配置进入正式 runtime surface。
- `05/06/07/09` 如何承接配置矩阵、配置门禁、实施准备和运维部署。
- 哪些配置结论会影响 `03-详细设计.md`,需要回写或阻塞待确认。

### 8.4 初始配置输入候选表

| 候选配置域 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| runtime mode / adapter availability | `03` §13;Step 14 | 有正式绑定点 | Step 3 建立控制面,Step 7 定义项 |
| repository / projection / reference / outbox store binding | `03` §13;Step 4 / Step 11 | 有正式绑定点,产品未锁定 | Step 3 / 7 product-neutral 定义 |
| inbound consumer binding | `03` §13;Step 8 / Step 9 | 有事件协作边界 | Step 3 / 5 / 7 定义来源和 schema allowlist |
| publisher / topic binding | `03` §13;Step 8 / Step 14 | 有 topic map 约束 | Step 5 / 7 定义来源优先级和冲突处理 |
| handoff / archive / external GRC target | `03` §13;Step 9 / Step 14 | 有 adapter target,产品未锁定 | Step 7 / 8 / 11 / 14 定义 disabled / fake / secret / failure |
| observability / redaction | `03` §13~§15 | 有 forbidden body 和 safe field 约束 | Step 8 / 9 / 12 定义 secret / redaction gate 承接 |
| test / staging environment matrix | 旧 `05/06` | 待新版复核 | Step 6 重新定义,不得直接继承 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 正式 `04` 当前不存在,需要从新版 `00/01/02/03` 生成 | 否 | 配置文档生成路径 | 不适用 | 无回写 |
| `05/06` 只能作为方向输入,不得覆盖新版 `03` | 否 | 下游文档权威级别 | 不适用 | 无回写 |
| 配置设计必须承接 `03` §13 的 runtime / adapter / store / publisher / handoff / redaction 绑定点 | 否 | 配置设计输入确认 | 不适用 | 无回写 |
| 后续若新增 runtime config 字段、adapter constructor 参数、port、error 或 flow | 是 | 代码契约变更 | `03` §4~§13 对应章节 | 阻塞待确认 |
| 当前不锁定 DB / bus / metric / DLQ / external GRC 产品 | 否 | 产品中立配置口径 | 不适用 | 无回写 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对详细设计的影响判定”和“待确认事项”小节,了解配置设计输入边界如何从新版 `00/01/02/03` 收敛。

正式 `04-配置设计.md` §1 应回填:

- 本配置设计直接承接新版 `00/01/02/03`。
- `03-详细设计.md` 是直接输入,尤其是 §13 配置引用与外部依赖绑定。
- `05-测试方案.md` 和 `06-验收标准.md` 当前只作为方向输入,后续需按新版 `03/04` 复核。
- 旧 external GRC、PostgreSQL、audit store、Policy engine、report system 和旧性能数字不得直接成为配置真相源。
- 配置设计不得静默修改 `03` 的代码契约;若影响 runtime config、builder、adapter constructor、port、error、flow 或 DTO,必须回写 `03` 或阻塞待确认。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `04-配置设计.md` 尚未存在 | 需要完整配置 SOP 才能正式移交后续测试 / 实施 | 本轮按 Step 1~15 生成 |
| `05-测试方案.md` / `06-验收标准.md` 是否按新版 `03/04` 复核 | 影响测试环境矩阵、验收门禁和 evidence | 本 Step 只标记为方向输入,后续由测试 / 验收文档处理 |
| 具体 DB / bus / search / metric / DLQ / external GRC 产品是否锁定 | 影响配置项默认值、secret、endpoint、failure mode 和 adapter | 后续 Step 3~14 以 product-neutral / fake / disabled / 待确认方式处理 |
| 是否存在“无配置”结论可能 | 影响 Step 3~13 是否适用 | Step 2 判定;当前已有多个配置绑定点,倾向于需要配置 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 配置设计边界明确 | 通过 | 见 §8.2 / §8.3 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| 对 `03` 的影响判定已记录 | 通过 | 见 §9 |
| 可进入 Step 2 | 通过 | 下一步明确配置设计目标、范围和非范围 |
