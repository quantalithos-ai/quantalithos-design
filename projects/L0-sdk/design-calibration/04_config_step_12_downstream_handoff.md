# Step 12. 定义测试、验收、实施与运维承接

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 12 中间产物。
> 本步定义配置设计如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续部署运维文档承接。
> 本步不替测试方案写完整用例,不替验收标准写裁决全集,不替实施计划排 phase,不替运维手册写部署命令。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-sdk/04-配置设计.md` §12 测试、验收、实施与运维承接

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 6 环境矩阵 | `local-dev`、`ci-test`、`integration-test`、`candidate-validation` 为 P0,`staging-like` / `production-like` 为 P1/P2 | 定义测试环境、验收 profile 和实施准备输入 |
| Step 7 配置项清单 | 11 个既有 `SdkRuntimeConfig` 配置组和字段级 JSON key | 定义下游可引用的配置契约和测试 / 验收对象 |
| Step 8 敏感配置 | P0 无 secret material,只允许 sensitive reference | 定义 redaction、安全验收和实施检查输入 |
| Step 9 加载校验 | startup / job-startup 加载,parse / type / sensitive / cross-field validate 后进入 builder | 定义 config loader / validator 测试切口和实施顺序 |
| Step 10 变更回滚 | 来源侧变更,下一次 runtime / CLI / job 启动生效,恢复来源并重跑 | 定义验收证据和运维回滚承接 |
| Step 11 失效模式 | fail-fast、fail-closed、pending、failed、stale、skipped、Dependency | 定义负向测试、验收一票否决和实施失败处理 |
| `03-详细设计.md` §13 / §15 / §16 | 配置绑定点、脚本 / artifacts / reports 契约、实施承接清单 | 防止 04 越界修改代码契约 |
| 当前 `05-测试方案.md` / `06-验收标准.md` | 当前仍是旧口径 | 标记后续重校准输入,不作为配置事实源 |
| `07-实施计划.md` / `09-部署与运维手册.md` | 当前尚未创建 | 本步只定义承接要求,不提前替它们展开 |

已确认结论:

```text
04 为 05/06/07/09 提供配置矩阵、配置项、敏感边界、加载校验、变更回滚和失效策略。
05 负责把这些输入转成测试对象、测试场景、自动化门禁、脚本检查和证据归档。
06 负责把这些输入转成通过条件、失败条件、一票否决项和可接受遗留项。
07 负责把这些输入转成实施前置、编码顺序、commit boundary、阶段验证和回退点。
09 或等价运维文档负责真实环境路径、变量注入、provider 绑定、告警、备份和处置步骤。
04 不重新定义 05/06/07/09 的完整内容,下游也不得重新定义 04 的配置契约。
```

## 3. SOP 问题回答

1. 哪些配置场景进入测试方案?

   回答：`05-测试方案.md` 后续重校准时至少承接 8 类场景。第一是 P0 profile 场景,覆盖 local-dev、ci-test、integration-test 和 candidate-validation。第二是来源优先级,验证 defaults、JSON config file、environment variables 的覆盖顺序,并确认 CLI / job args 只作 selector 或 operation-local 参数。第三是 JSON schema 和字段校验,覆盖未知 key、重复 key、非法 enum、非法 path、非法 ref、非法 language target。第四是 cross-field 校验,覆盖 root 隔离、artifact / report 层级、contracts path、fake marker、policy 下限和 job run id。第五是 sensitive boundary,覆盖 raw secret 拒绝、sensitive ref 脱敏、日志 / 错误 / reports / evidence 不泄露。第六是 fail-fast / fail-closed,覆盖非法高优先级配置不回退、boundary ref 非法不放行。第七是运行期支撑面失败,覆盖 source stale / pending、outbox pending / failed、projection stale / rebuilding、runner evidence failed / skipped。第八是 artifacts / reports 归档,覆盖 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。

2. 哪些配置门禁进入验收标准?

   回答：`06-验收标准.md` 后续重校准时至少承接 7 类门禁。第一,11 个 `SdkRuntimeConfig` 配置组和字段级 JSON key 可追溯到 04。第二,普通来源优先级可验证,且非法高优先级值不得 silent fallback。第三,raw secret、token、password、private key、credential value 不得进入配置、日志、错误、审计、reports、artifacts 或 outbox event。第四,redaction、credential protection、fake marker、compatibility gate、run id 等禁止配置化红线不可被关闭或降级。第五,local / CI / integration / candidate P0 profile 全部有通过证据。第六,配置失败策略与 Step 11 一致。第七,reports 和 artifacts 输出路径符合无项目名重复层级的规则。

3. 哪些配置准备进入实施计划?

   回答：`07-实施计划.md` 后续创建时至少承接配置 schema、env mapping、CLI / job selector、defaults、loader、validator、runtime builder 装配、adapter constructor 输入、fake / fixture refs、redaction check、reports / artifacts 脚本和负向测试。实施计划必须要求实现者先阅读 `04-配置设计.md` 及其引用的 `design-calibration/04_config_step_07_config_items.md`、`04_config_step_09_load_validate_apply.md`、`04_config_step_11_failure_modes.md` 和本步中间产物。实施计划不能在 04 之外发明配置字段、profile、错误语义或热更新机制。

4. 哪些配置部署细节留给部署与运维手册?

   回答：真实环境配置文件路径、环境变量注入方式、CI provider 变量配置、secret provider / credential provider 绑定、formal API endpoint、bus boundary、registry token、真实 package registry 发布参数、监控告警、备份恢复、secret ref 轮换、生产事故处置和运行手册命令都留给 `09-部署与运维手册.md` 或等价运维文档。04 只定义这些内容必须遵守的边界: ref-only、redaction、fail-closed、no hot reload、no raw secret、no bypass gate。

5. 下游文档不应重复定义哪些配置契约?

   回答：下游文档不应重新定义 JSON top-level key、字段名、类型、默认值、来源优先级、profile 口径、敏感级别、加载时机、生效方式、失败策略、禁止配置化项、reports / artifacts 根目录规则和是否需要回写 03 的门禁。05 可以引用这些契约设计用例;06 可以引用这些契约定义门禁;07 可以引用这些契约安排实现;09 可以引用这些契约配置真实环境,但都不能另造一套配置真相。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| `04-配置设计.md` | 尚未创建 §12 | 下游不知道从配置设计承接哪些输入 | 本步形成承接表和回填草稿 |
| `05-测试方案.md` | 当前仍是旧口径,环境与配置矩阵未承接新版 Step 6~11 | 后续测试可能漏掉 config loader、validator、redaction、artifacts / reports 门禁 | 标记后续必须重校准 |
| `06-验收标准.md` | 当前仍是旧口径,未纳入配置失败和敏感输出一票否决 | 后续验收可能无法裁决配置红线 | 标记后续必须重校准 |
| `07-实施计划.md` | 当前尚未创建 | 实施者可能脑补 schema、env、CLI 或 commit boundary | 明确 07 必须承接 04,不能发明配置契约 |
| `09-部署与运维手册.md` | 当前尚未创建 | 真实 endpoint、secret provider、部署命令无承接位置 | 明确运维细节留给 09,04 不写命令 |
| `03-详细设计.md` §13 / §15 | 已定义配置绑定和脚本 / 产物最小契约 | 本步不能新增 loader API、DTO、error 或 event | 判定无需回写 03 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 05 承接 | 旧测试方案只泛化写 dev / test / staging | 明确承接 P0 profile、配置来源、校验链、敏感边界、失效模式和 reports / artifacts | 让后续测试方案能按新版配置风险设计 |
| 06 承接 | 旧验收标准未把配置红线单列为门禁 | 明确 raw secret、silent fallback、policy 降级、fake marker 缺失等一票否决 | 让验收可裁决配置是否安全可用 |
| 07 承接 | 尚无实施计划 | 明确 loader / validator / builder / adapter / scripts / tests 的实施输入 | 避免实现阶段脑补配置设计 |
| 09 承接 | 尚无运维文档 | 明确真实路径、env 注入、secret provider、endpoint、告警、轮换等留给运维 | 防止 04 膨胀成部署手册 |
| 配置事实源 | 多篇下游可能各自定义 key 和 profile | 04 作为配置契约来源,下游只能引用和验证 | 降低文档漂移和实现冲突 |
| 03 回写 | 未判断 | 本步只定义承接关系,不改变代码契约 | 无需回写 03 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：04 直接写完整测试用例、验收门禁和实施任务 | 单篇文档看起来完整 | 越界替代 05/06/07,且会重复维护 | 不采用 |
| 方案 B：04 定义下游输入、承接边界和禁止重复定义契约 | 边界清晰,下游可追溯 | 需要 05/06/07/09 继续校准或创建 | 采用 |
| 方案 C：下游文档各自重新定义配置项 | 下游自包含 | 极易产生 key、默认值、profile 和失败策略漂移 | 不采用 |
| 方案 D：04 提前写真实部署命令和 secret provider 操作 | 实施者可直接照做 | 当前未进入部署运维设计,命令会过早绑定平台 | 不采用 |

推荐方案 B。

原因:

- L0-sdk 的配置设计是 SDK runtime / CLI / jobs 的配置契约来源,不是测试方案、验收标准、实施计划或运维 runbook。
- 下游需要的是稳定输入和边界,不是第二套配置定义。
- 当前 `05/06` 仍是旧口径,`07/09` 尚未创建,必须先把承接关系固定清楚。

## 7. 结构化中间产物

#### 下游承接图: L0-sdk 配置设计到下游文档

```text
[04 配置设计]
    |
    +--> [05 测试方案]
    |       uses: profile matrix / config schema / failure modes / evidence roots
    |
    +--> [06 验收标准]
    |       uses: config gates / veto rules / pass-fail criteria / evidence checks
    |
    +--> [07 实施计划]
    |       uses: loader / validator / builder / scripts / commit boundaries
    |
    +--> [09 部署与运维手册]
            uses: env injection / provider binding / runtime operation / rollback runbook
```

关键说明:

- 04 是配置契约来源,05/06/07/09 是承接文档。
- 05/06/07/09 可以引用、验证、实施和部署配置契约,不得重新定义配置项和失败策略。
- 09 承接真实环境操作,04 不写具体部署命令。
- 当前 `05/06` 需要按新版 00~04 重校准,`07/09` 需要后续创建。

### 7.1 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置测试对象、测试场景、自动化门禁、脚本检查、测试数据和证据归档 | Step 6 profile 矩阵;Step 7 配置项;Step 8 敏感配置;Step 9 加载校验;Step 11 失效模式;artifacts / reports 路径规则 |
| `06-验收标准.md` | 配置验收门禁、通过 / 失败条件、一票否决项、风险接受条件 | P0 配置红线、silent fallback 禁止、raw secret 禁止、禁止配置化项、profile 通过证据、报告归档证据 |
| `07-实施计划.md` | 实施前置、编码顺序、commit boundary、阶段测试门禁、回退点 | 配置 schema、env / CLI / job selector、defaults、loader / validator / builder 装配、scripts、负向测试 |
| `09-部署与运维手册.md` 或等价文档 | 真实环境路径、env 注入、credential provider、formal API / bus boundary、告警、备份、恢复和轮换步骤 | profile 语义、sensitive ref-only、变更审计规则、回滚原则、P1/P2 外部集成边界 |
| `reports/` 与 `artifacts/test/` 产物规范 | 配置摘要、redaction check、failure category、run id、profile、evidence index | Step 8 禁止输出;Step 10 审计摘要;Step 11 失效模式;`03` §15 脚本与产物最小契约 |

### 7.2 进入 `05-测试方案.md` 的配置场景

| 测试方向 | 需要覆盖的配置场景 | 证据输入 |
|---|---|---|
| profile matrix | local-dev、ci-test、integration-test、candidate-validation;staging-like / production-like 仅作 P1/P2 承接 | 启动日志、job receipt、profile 摘要 |
| source priority | defaults / JSON / env 覆盖顺序;CLI / job args 只作 selector 或局部参数 | 配置来源摘要、负向测试输出 |
| JSON schema | 严格 JSON、未知 key、重复 key、非法 enum / bool / array / path / ref / language | loader / validator 测试报告 |
| cross-field validate | root 隔离、artifact / report 层级、contracts path、fake marker、language set、run id | 单元 / 集成测试证据 |
| sensitive boundary | raw secret 拒绝、sensitive ref 脱敏、日志 / 错误 / reports / evidence 泄露扫描 | redaction check report |
| fail-fast / fail-closed | 高优先级非法不回退、boundary ref 不可信不放行、unsupported reload 拒绝 | 失败注入测试和错误分类 |
| support failure semantics | source stale / pending、outbox pending / failed、projection stale / rebuild、runner evidence failed / skipped | job receipt、artifact index、report |
| reports / artifacts | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、不重复项目名层级 | 目录检查、报告索引 |

### 7.3 进入 `06-验收标准.md` 的配置门禁

| 验收方向 | 通过条件 | 失败条件 |
|---|---|---|
| 配置契约追溯 | 11 个配置组和字段级 JSON key 均可追溯到 04 | 下游另造 key、字段类型或默认值 |
| 来源优先级 | 覆盖顺序稳定且测试可证明 | 高优先级非法值 silent fallback |
| profile 覆盖 | P0 四个 profile 均有通过证据 | 任一 P0 profile 无法加载、校验或生成证据 |
| 敏感边界 | raw secret 不进入配置、日志、错误、审计、reports、artifacts、event | 任一输出泄露 secret material |
| 禁止配置化 | redaction、credential protection、fake marker、compatibility gate、run id 不可关闭 | 存在可生效的绕过配置 |
| 失效策略 | fail-fast / fail-closed / pending / stale / failed / skipped 与 04 一致 | 错误配置继续运行或默认放行 |
| 证据归档 | artifacts / reports 路径、run id 和 config summary 可追溯 | 证据缺失、路径混乱或无法关联 run |

### 7.4 进入 `07-实施计划.md` 的配置实施输入

| 实施输入 | 用途 |
|---|---|
| 配置 schema 与 JSON key | 指导配置文件解析、env mapping 和 schema 测试 |
| defaults / source priority | 安排 defaults、JSON、env 合并顺序实现 |
| CLI / job selector | 防止 CLI / job args 被实现成全局最高优先级覆盖层 |
| `SdkRuntimeConfig` 11 个配置组 | 保证外部配置只装配到 03 已定义结构 |
| loader / validator / builder 链 | 安排 config loader、validator、runtime builder 和 adapter constructor 的编码顺序 |
| sensitive ref-only | 防止实现阶段把 raw secret、token 或 credential value 写入普通配置或报告 |
| fail-fast / fail-closed 表 | 安排负向测试、错误分类和提交门禁 |
| scripts / reports / artifacts 最小契约 | 安排 `scripts/gates`、`scripts/reports`、`scripts/checks` 和 evidence 产物 |
| 下游不得重复定义契约 | 保证实施计划只安排实现,不修改配置设计 |

### 7.5 留给 `09-部署与运维手册.md` 的内容

| 运维内容 | 为什么不写在 04 |
|---|---|
| 真实配置文件路径、挂载、权限、备份路径 | 属于具体环境操作 |
| CI / job / release 系统中的环境变量注入方式 | 属于平台实现细节 |
| KMS / Vault / secret provider / credential provider 绑定步骤 | P1/P2 安全运维专项 |
| formal API endpoint、bus boundary、registry token 的真实配置 | P0 只定义 ref-only 边界 |
| 进程重启、job invocation、回滚命令 | 属于运维 runbook |
| 告警阈值、监控面板、巡检和事故处置 | 属于运维观测和响应流程 |
| secret ref 轮换、吊销和审计流程 | 属于安全运维流程 |

### 7.6 下游不得重复定义的配置契约

| 契约 | 说明 |
|---|---|
| JSON top-level key 和字段级 key | 以 04 Step 7 / 正文 §7 为准 |
| 字段类型、默认值、敏感级别和失败策略 | 以 04 Step 7 / 正文 §7 为准 |
| 来源优先级和冲突处理 | 以 04 Step 5 / 正文 §5 为准 |
| profile 定义和 P0 / P1 / P2 范围 | 以 04 Step 6 / 正文 §6 为准 |
| sensitive ref-only 和 raw secret 禁止规则 | 以 04 Step 8 / 正文 §8 为准 |
| 加载、校验和生效机制 | 以 04 Step 9 / 正文 §9 为准 |
| 配置变更、审计和回滚原则 | 以 04 Step 10 / 正文 §10 为准 |
| 失效模式与失败策略 | 以 04 Step 11 / 正文 §11 为准 |
| reports / artifacts 根目录规则 | 以 03 §15 和 04 Step 7 / Step 12 为准 |
| 是否需要回写 03 的门禁 | 以 04 Step 14 汇总清单为准 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 05/06/07/09 对配置设计的承接关系 | 否 | 文档承接关系 | 无 | 无回写 |
| 明确下游不得重复定义 P0 配置项、profile 和失败策略 | 否 | 文档一致性规则 | 无 | 无回写 |
| 将测试、验收、实施和运维细节留给对应文档 | 否 | 文档边界规则 | 无 | 无回写 |
| 要求 07 承接 loader / validator / builder / scripts / reports,但不改变函数签名 | 否 | 实施承接规则 | 无 | 无回写 |
| 如果后续下游要求新增可机读 config report / config fingerprint API | 是 | runtime output / DTO / API 变化 | `03-详细设计.md` §13 / §14 / §15 | 待回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、loader public API、adapter constructor 参数、error enum、event、job receipt 或 audit event。
- `config fingerprint` 和 config summary 仍作为证据摘要概念使用;若要进入正式 API 或结构体,必须先回写 03。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §12。

````md
## 12. 测试、验收、实施与运维承接

> 校准来源：
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“下游承接表”“进入测试方案的配置场景”“进入验收标准的配置门禁”“进入实施计划的配置实施输入”“留给部署与运维手册的内容”和“对详细设计的影响判定”小节。

`04-配置设计.md` 是 L0-sdk 配置契约来源。`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续 `09-部署与运维手册.md` 只能承接、验证、实施或部署这些配置契约,不得重新定义 JSON key、字段类型、默认值、来源优先级、profile、敏感级别、加载时机、失败策略或禁止配置化项。

`05-测试方案.md` 需要覆盖 P0 profile、配置来源优先级、JSON schema、cross-field validate、sensitive boundary、fail-fast / fail-closed、运行期支撑面失败和 reports / artifacts 归档。`06-验收标准.md` 需要把 raw secret 禁止、silent fallback 禁止、redaction / credential / fake marker / compatibility gate 不可关闭、P0 profile 覆盖和证据归档转成门禁。

`07-实施计划.md` 需要承接配置 schema、env mapping、CLI / job selector、loader、validator、runtime builder、adapter constructor、scripts、redaction check 和负向测试。真实环境路径、env 注入、credential provider、formal API / bus boundary、registry token、告警、备份、恢复和轮换步骤留给部署与运维手册。
````

## 10. 待确认事项

- 是否接受当前 `05-测试方案.md` 与 `06-验收标准.md` 仍需按新版 00~04 后续重校准。
- 是否接受 `07-实施计划.md` 必须承接 04,不得自行发明配置 schema、env、profile 或错误语义。
- 是否接受真实部署路径、env 注入、secret provider、endpoint、registry 和运维命令留给 `09-部署与运维手册.md` 或等价文档。
- 是否接受本步无需回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 下游承接图已明确。
- [x] 下游承接表已覆盖 05 / 06 / 07 / 09 / reports / artifacts。
- [x] 测试方案、验收标准、实施计划和运维手册各自承接边界已明确。
- [x] 下游不得重复定义的配置契约已列出。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 12 状态从 `[~]` 更新为 `[x]`。
