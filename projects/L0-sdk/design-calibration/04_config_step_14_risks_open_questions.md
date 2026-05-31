# Step 14. 定义风险与待确认事项

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 14 中间产物。
> 本步汇总 Step 1 ~ Step 13 的风险、待确认事项和详细设计回写清单。
> 本步用于判断是否允许进入 Step 15 正式 `04-配置设计.md` 定稿。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 14
- 回填章节：`projects/L0-sdk/04-配置设计.md` §14 风险与待确认事项

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 ~ Step 13 中间产物 | 已确认配置范围、控制面、配置项、敏感边界、失效模式、下游承接和演进规则 | 汇总风险和待确认事项 |
| `04_config_calibration_flow.md` | Step 1 ~ Step 13 的详细设计影响判定总览 | 判断是否存在当前阻塞 Step 15 的回写项 |
| `03-详细设计.md` §13 / §15 / §17 | 已定义 11 个 `SdkRuntimeConfig` 配置组、脚本 / 产物契约和已知风险 | 判断配置结论是否改变代码契约 |
| 当前 `05-测试方案.md` / `06-验收标准.md` | 当前仍是旧口径 | 记录下游校准风险,不作为当前配置事实源 |
| 当前 `07-实施计划.md` / `09-部署与运维手册.md` | 当前尚未创建 | 记录实施和运维承接风险 |
| Step 12 下游承接 | 05/06/07/09 承接边界 | 判断后续文档需要承接哪些配置结论 |
| Step 13 演进规则 | 当前无迁移项;未来代码契约变化先回写 03 | 区分当前阻塞项和未来触发项 |

已确认结论:

```text
Step 1 ~ Step 13 的当前生效配置结论都不改变 03 的代码契约。
当前没有必须先回写 03 才能进入 Step 15 的配置结论。
Step 7 ~ Step 13 中出现的“若未来 / 如果后续”项属于未来触发项,不是当前 P0 定稿阻塞项。
05 / 06 当前旧口径是下游校准风险,但不阻塞 04 先完成配置设计。
07 / 09 尚未创建是实施和运维承接风险,但不阻塞 04 先完成配置设计。
```

## 3. SOP 问题回答

1. 哪些配置问题仍可能影响落地?

   回答：主要风险有 8 类。第一,实施者可能把 `SdkRuntimeConfig.profile`、remote config、public registry token、production endpoint matrix、config center、hot reload 等 candidate / rejected 项误写成 P0 active。第二,当前 `05/06` 仍是旧口径,如果不重校准会遗漏配置 loader、validator、redaction、silent fallback、reports / artifacts 等门禁。第三,`07/09` 尚未创建,配置实现顺序、commit boundary、真实环境路径、env 注入、secret provider、endpoint 和运维命令需要后续承接。第四,`config fingerprint` 目前只是证据摘要概念,如果实现成 API / DTO / job receipt 字段会影响 03。第五,raw secret、token、credential value 如果进入配置、日志、错误、reports、artifacts 或 event,会破坏安全边界。第六,高优先级非法配置如果 silent fallback,会破坏来源优先级和验收可判定性。第七,禁止配置化项如果做成开关,会绕过 redaction、credential protection、fake marker、compatibility gate 或 run id。第八,Step 15 组装正式 04 时可能遗漏中间产物引用或把 future candidate 写成 active。

2. 哪些事项会阻塞测试、验收、实施或运维?

   回答：`05/06` 旧口径会阻塞最终测试和验收准确性;`07` 缺失会阻塞开发实施;`09` 缺失会阻塞真实部署和运维;P1/P2 的 config center、KMS / Vault、registry credential、production endpoint matrix 未设计会阻塞生产化。它们不阻塞当前 04 定稿。会阻塞 Step 15 的事项只有一种: 当前已确认配置结论改变 03 代码契约却未回写。经本步汇总,当前不存在这种阻塞项。

3. 每个待确认事项需要谁确认?

   回答：当前需要用户 / 架构负责人确认的是: 是否接受无当前 03 回写项;是否接受 future candidate 不进入 P0 active;是否接受 `config fingerprint` 暂不进入正式 API / 字段;是否接受 `05/06` 后续校准但不阻塞 04;是否接受 `07/09` 后续承接但不阻塞 04。未来如果要引入 config center、KMS / Vault、runtime profile、registry credential、reload / hot update 或 public registry publish token,则需要架构、详细设计、实施、测试、验收和运维共同确认。

4. 未确认前应如何处理?

   回答：未确认前不得把待确认项写成正式配置契约。推荐保守处理: 04 只定义当前 P0 配置契约;future candidate 只写为风险和演进门禁;不新增 03 代码契约;05/06/07/09 后续按 04 承接。如果用户不接受该方案,必须暂停 Step 15,先回到对应 Step 或 `03-详细设计.md` 校准。

5. 哪些配置结论改变了 `03-详细设计.md` 的代码契约?

   回答：当前没有已确认并生效的配置结论改变 `03-详细设计.md`。本轮正式 P0 配置项只在 03 已有 11 个 `SdkRuntimeConfig` 配置组内细化 JSON key;不新增 root 配置组、不新增 `SdkRuntimeConfig.profile`、不新增公开 loader API、不新增 reload / hot update、不新增 config center、不新增 credential provider 字段、不新增 config change event、不新增 `config_schema_version`、不新增迁移器 API。

6. 这些影响是否已经回写到 `03-详细设计.md`,还是需要标为阻塞待确认?

   回答：当前无需回写,因此没有 `待回写` 或 `阻塞待确认` 的当前生效项。Step 7 ~ Step 13 中提到的“待回写”都是未来触发项,例如“如果后续把 config fingerprint 放入正式 API”。这些不写入当前正式配置契约,也不阻塞 Step 15;但必须在本步登记为未来触发型回写清单。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §14 | 尚未存在风险与待确认事项章节 | 读者无法判断当前契约、下游风险和 future candidate 的边界 |
| Step 7 / 8 / 9 / 10 / 11 / 12 / 13 | 多处出现“若未来 / 如果后续”触发型回写项 | 需要统一判定不阻塞当前 Step 15 |
| 当前 `05-测试方案.md` / `06-验收标准.md` | 仍是旧口径 | 需要作为下游校准风险记录 |
| 当前 `07-实施计划.md` / `09-部署与运维手册.md` | 尚未创建 | 需要作为后续承接风险记录 |
| 正式 `04-配置设计.md` | 尚未创建 | Step 15 必须保证引用完整、章节一致、无越界内容 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险状态 | 分散在各 Step 的待确认事项中 | 汇总成风险表、待确认事项表和回写清单 | 便于判断能否进入 Step 15 |
| 03 回写判断 | 各 Step 有当前项和未来项混写 | 区分当前生效项和未来触发项 | 避免条件性风险误阻塞定稿 |
| 下游风险 | Step 12 已说明承接关系 | 明确 05/06 旧口径、07/09 缺失为后续风险 | 防止正式 04 误以为下游已完成 |
| 待确认处理 | 只列问题 | 为关键事项给出可选方案、推荐方案和原因 | 便于用户确认后进入 Step 15 |
| Step 15 门禁 | 未形成 | 明确当前无 `待回写` / `阻塞待确认` 当前项 | 满足 SOP 定稿前置 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把所有未来触发项都当成当前 `待回写` | 最保守 | 会无谓阻塞 04 首版定稿 | 不采用 |
| 方案 B：区分当前生效配置契约和未来触发项 | 能推进首版 P0,同时保留演进门禁 | Step 15 必须写清 future candidate 不是 active | 采用 |
| 方案 C：删除未来触发项 | 文档更短 | 后续 agent 容易绕过 03 直接扩展 04 | 不采用 |
| 方案 D：把 05/06/07/09 缺口写成 04 定稿阻塞 | 端到端一致性强 | 下游本应在 04 后承接,会打断配置设计定稿 | 不采用 |

推荐方案 B。

原因:

- 当前 P0 配置契约没有改变 `03-详细设计.md` 的代码主体。
- 未来触发项必须被看见,但不能成为当前 active 配置项。
- 04 是 05/06/07/09 的输入,应先完成配置设计再让下游承接。

## 7. 结构化中间产物

#### 风险收敛图: L0-sdk 配置设计 Step 14 门禁

```text
[Step 1~13 confirmed outputs]
        |
        v
[collect risks and open questions]
        |
        v
[separate current contract vs future trigger]
        |
        +--> [current 03 impact?]
        |          |
        |          +--> yes --> [block Step 15 and update 03]
        |          |
        |          +--> no  --> [can proceed to Step 15]
        |
        v
[record downstream handoff risks]
        |
        v
[assemble formal 04 only after user confirms Step 14]
```

关键说明:

- 本图表达 Step 14 的收口门禁,不表达正式配置加载流程。
- 当前没有生效的 03 回写阻塞项。
- 未来触发项必须保留,但不得写成当前 active 配置契约。
- 用户确认 Step 14 后,才能进入 Step 15 创建正式 `04-配置设计.md`。

### 7.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| candidate 配置被误写成 active 配置项 | 实施者可能新增 03 未定义字段或 adapter 参数 | 在正式 §7 / §13 / §14 明确 candidate 不是 P0 active;如需配置化先回写 03 | 配置设计负责人 / 详细设计负责人 |
| `05-测试方案.md` 当前旧口径 | 配置来源、失效模式、raw secret、silent fallback、reports / artifacts 测试缺失 | 04 完成后按 Step 12 输入重写或校准 05 | 测试方案负责人 |
| `06-验收标准.md` 当前旧口径 | 配置门禁和一票否决项缺失 | 04 完成后按 Step 12 输入重写或校准 06 | 验收负责人 |
| `07-实施计划.md` 尚不存在 | 配置 schema、env / CLI 映射、默认目录、校验实现顺序无法执行 | 04 完成后编写 07,明确实施前置和阶段门禁 | 实施计划负责人 |
| `09-部署与运维手册.md` 尚不存在 | 真实路径、权限、KMS / Vault、secret ref、恢复命令无人承接 | 后续由 09 或等价运维文档承接真实环境和 runbook | 运维负责人 |
| `config fingerprint` 被误实现为 API / 字段 | 会改变 job receipt、DTO 或观测契约 | 当前只作为证据摘要概念;如需结构化输出先回写 03 | 详细设计负责人 |
| raw secret 进入 file / env / CLI / 日志 / reports / event | 安全边界被破坏 | 正式 §8 / §11 / §12 写为强门禁,05/06 做负向测试和验收 | 安全 / 测试 / 验收 |
| 高优先级非法配置 silent fallback | 错误配置被掩盖,验收不可判定 | 正式 §5 / §9 / §11 明确 fail-fast,05 覆盖负向测试 | 配置实现负责人 |
| 禁止配置化项被做成开关 | 绕过 redaction、credential protection、fake marker、compatibility gate 或 run id | 正式 §4 / §11 写为拒绝配置;改变红线必须回上游设计 | 架构负责人 |
| Step 15 组装遗漏校准来源或章节漂移 | 正式 04 与 SOP / 书写规范不一致 | Step 15 使用自检清单并逐章引用中间产物 | 文档负责人 |

### 7.2 待确认事项方案表

| 事项 | 方案 A | 方案 B | 方案 C | 推荐方案 | 原因 | 未确认前处理方式 |
|---|---|---|---|---|---|---|
| 当前是否需要回写 `03-详细设计.md` | 立即回写所有未来触发项 | 当前不回写,仅登记未来触发项 | 删除未来触发项 | 方案 B | 当前 P0 没有改变代码契约;保留未来门禁即可 | 不进入 Step 15,直到用户确认 |
| future candidate 是否进入 P0 active | 全部进入 active | 留作 candidate / future / rejected | 删除候选项 | 方案 B | 03 未定义字段和 builder 行为,不能由 04 静默扩展 | 未确认前不得写入正式配置项清单 |
| `config fingerprint` 是否进入正式 API / 字段 | 进入正式 DTO / job receipt | 作为证据摘要概念 | 完全不提 | 方案 B | 当前需要证据概念,但实现字段会影响 03 | 未确认前不得定义函数签名或字段 |
| `05/06` 旧口径是否阻塞 04 | 阻塞,先重写 05/06 | 不阻塞,04 完成后承接校准 | 忽略旧口径 | 方案 B | 04 是下游输入,应先完成配置设计再校准 05/06 | 正式 04 §12 / §14 记录后续承接 |
| `07/09` 不存在是否阻塞 04 | 阻塞,先写 07/09 | 不阻塞,04 完成后编写 | 不需要 07/09 | 方案 B | 实施和运维应承接 04,不应成为 04 前置 | 正式 04 §12 / §14 记录后续承接 |
| 是否在 P0 引入 config center / admin override | 引入 P0 | 作为 P2 future / rejected for P0 | 完全删除 | 方案 B | 当前无在线配置生命周期,引入会扩大范围 | 正式 04 只写为 future / rejected |
| 是否在 P0 引入 KMS / Vault 正式配置项 | 引入 P0 | P0 无 secret material,真实凭据留 P1/P2 | 完全不提 secret | 方案 B | P0 不应依赖外部密钥系统,但要保留安全边界 | 正式 04 §8 / §13 记录 |

### 7.3 当前待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 当前无生效的 03 回写项 | 决定能否进入 Step 15 | 用户 / 架构负责人 | 不创建正式 `04-配置设计.md` |
| future candidate 不进入 P0 active | 决定正式 §7 / §13 写法 | 用户 / 配置设计负责人 | 不把候选项写入配置项清单 |
| `config fingerprint` 只作为证据摘要 | 决定是否需要新增 API / 字段 | 用户 / 详细设计负责人 | 不定义结构体字段或函数签名 |
| 05/06 后续校准但不阻塞 04 | 决定下游推进顺序 | 用户 / 测试验收负责人 | 在正式 §12 / §14 记录风险 |
| 07/09 后续承接但不阻塞 04 | 决定实施与运维推进顺序 | 用户 / 实施运维负责人 | 在正式 §12 / §14 记录风险 |

### 7.4 当前生效详细设计回写清单

| Step | 配置结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|---|
| Step 1 | 确认配置设计输入边界 | 否 | 无代码契约变化 | 无回写 |
| Step 2 | 定义 P0 / P1 / P2 配置设计范围 | 否 | 无代码契约变化 | 无回写 |
| Step 3 | 定义配置控制面总览 | 否 | 无代码契约变化 | 无回写 |
| Step 4 | 定义配置分类和禁止配置化边界 | 否 | 无代码契约变化 | 无回写 |
| Step 5 | 定义配置来源优先级与冲突处理 | 否 | 无代码契约变化 | 无回写 |
| Step 6 | 定义 profile 矩阵 | 否 | 无代码契约变化 | 无回写 |
| Step 7 | 在 11 个既有 `SdkRuntimeConfig` 配置组内细化字段级 JSON key | 否 | 配置 schema 细化,不改变 root 配置组 | 无回写 |
| Step 8 | 定义敏感配置与密钥边界 | 否 | 安全配置规则,不改变字段结构 | 无回写 |
| Step 9 | 定义加载、校验与生效机制 | 否 | 配置行为规则,不新增公开 API | 无回写 |
| Step 10 | 定义变更、审计与回滚规则 | 否 | 配置治理规则,不新增审计事件 | 无回写 |
| Step 11 | 定义失效模式与失败策略 | 否 | 配置失效策略,不新增恢复 API | 无回写 |
| Step 12 | 定义下游承接关系 | 否 | 文档承接规则 | 无回写 |
| Step 13 | 定义迁移、废弃与演进规则 | 否 | 配置演进门禁,不新增迁移 API | 无回写 |

结论:

```text
当前不存在 `待回写` 或 `阻塞待确认` 的生效配置结论。
用户确认 Step 14 后,可以进入 Step 15 组装正式 `04-配置设计.md`。
```

### 7.5 未来触发型回写清单

| 未来触发条件 | 影响类型 | 03 回写位置 | 当前处理状态 |
|---|---|---|---|
| 新增公开 config loader API 或固定 Rust 函数签名 | function / module contract | `03-详细设计.md` §13 或 infra module 契约 | 未触发,不阻塞 |
| 新增 `SdkRuntimeConfig.profile` 或 root `profile` | runtime config / builder contract | `03-详细设计.md` §13 | 未触发,不阻塞 |
| 新增 remote config / config center | online config / audit / rollback / permission | 架构设计 + `03-详细设计.md` §13 / §14 | 未触发,不阻塞 |
| 新增 admin override | permission / audit / rollback contract | 架构设计 + `03-详细设计.md` §13 / §14 | 未触发,不阻塞 |
| 新增 reload / hot update | runtime lifecycle / adapter swap / consistency | `03-详细设计.md` §13 / §14 | 未触发,不阻塞 |
| 新增 public registry publish token | secret binding / release job contract | `03-详细设计.md` job / adapter 契约 | 未触发,不阻塞 |
| 新增 registry credential ref / secret provider binding | sensitive binding / adapter contract | `03-详细设计.md` §13 或 adapter 契约 | 未触发,不阻塞 |
| 新增 production endpoint matrix | endpoint config / adapter contract / operations binding | `03-详细设计.md` §13 或 adapter 契约 | 未触发,不阻塞 |
| 新增 remote runner args / timeout | runner contract / job contract | `03-详细设计.md` job / runner 契约 | 未触发,不阻塞 |
| 将 `config fingerprint` 放入正式 API / DTO / job receipt | runtime output / DTO / API | `03-详细设计.md` §13 / §14 / §15 | 未触发,不阻塞 |
| 新增 config migration API 或 `config_schema_version` 字段 | loader / migration / runtime config contract | `03-详细设计.md` §13 | 未触发,不阻塞 |
| 将禁止配置化项变成配置开关 | 需求 / 架构 / 详细设计契约变化 | 00 / 01 / 03 或 ADR | 未触发,当前应拒绝 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 14 仅汇总风险、待确认事项和回写清单 | 否 | 文档收口 | 无 | 无回写 |
| 当前 Step 1 ~ Step 13 生效结论均不改变 03 代码契约 | 否 | 总结判定 | 无 | 无回写 |
| 未来触发项不写入当前 active 配置契约 | 否 | 演进门禁 | 无 | 无回写 |

说明:

- 当前没有 `待回写` 或 `阻塞待确认` 的生效项。
- 如果用户决定把未来触发项改为当前 P0 active 配置项,则必须暂停 Step 15,先回写 `03-详细设计.md`。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §14。

````md
## 14. 风险与待确认事项

> 校准来源：
> - `design-calibration/04_config_step_14_risks_open_questions.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“风险表”“待确认事项方案表”“当前生效详细设计回写清单”和“未来触发型回写清单”小节，了解本章风险和定稿门禁如何收敛。

本轮配置设计的当前生效结论不改变 `03-详细设计.md` 的代码契约。P0 配置项只在 03 已有 11 个 `SdkRuntimeConfig` 配置组内细化字段级 JSON key;`SdkRuntimeConfig.profile`、remote config、config center、admin override、reload / hot update、public registry token、registry credential ref、production endpoint matrix、remote runner 和 config report API 仍为 candidate / future / rejected,不是当前 active 配置项。

当前无 `待回写` 或 `阻塞待确认` 的生效配置结论。若未来要将 candidate 配置项转为正式配置项,或要新增 config loader 公共 API、config change event、config fingerprint 字段、config migration API 或 `config_schema_version`,必须先回写 `03-详细设计.md`。

主要风险包括: 下游 `05/06` 当前仍需按新版 04 重新校准;`07/09` 尚需承接实施和运维细节;实现阶段不得把 raw secret 写入普通配置来源或输出;高优先级非法配置不得 silent fallback;禁止配置化项不得被做成开关。
````

## 10. 待确认事项

- 是否接受当前无生效的 `03-详细设计.md` 回写项。
- 是否接受 future candidate 不进入 P0 active 配置项。
- 是否接受 `config fingerprint` 暂只作为证据摘要概念,不定义字段或 API。
- 是否接受 `05/06` 后续校准但不阻塞 04 定稿。
- 是否接受 `07/09` 后续承接但不阻塞 04 定稿。
- 是否接受确认后进入 Step 15 创建正式 `projects/L0-sdk/04-配置设计.md`。

## 11. 进入下一步条件

- [x] 所有未关闭事项都有记录和处理方式。
- [x] 当前生效详细设计回写清单已覆盖 Step 1 ~ Step 13。
- [x] 不存在 `待回写` 的详细设计影响项。
- [x] 不存在 `阻塞待确认` 的详细设计影响项。
- [x] 条件性未来影响项已记录且不进入当前契约。
- [x] Step 14 状态从 `[~]` 更新为 `[x]`。
