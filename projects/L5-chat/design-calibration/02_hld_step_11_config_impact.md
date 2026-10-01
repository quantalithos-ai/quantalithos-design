# L5-chat 02 · Step 11 配置影响轮廓

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：识别哪些主要组成部分、入口、adapter、job、存储和运行形态会受到配置影响，明确哪些边界禁止配置化，并把实现契约方向交给 03/04。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 11；`standards/document/概要设计书写规范.md` §4.11。
> 上游输入：Step 4～10 中间产物、`projects/L5-chat/01-架构设计.md` §11～§15、`projects/L5-chat/draft/03_模块划分与分层.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取结构 | 代码主体、主要部分、接口、流、状态、异常 | `done` | 配置影响均能回指前文主语 |
| 识别配置影响 | 平台、SDK、缓存、恢复、诊断、AT、feature policy | `done` | 只写影响类别 |
| 禁止配置化边界 | owner truth、结果门控、redaction、清理、状态机红线 | `done` | 硬边界明确 |
| 详细设计承接 | RuntimeConfig/Loader/Validator/AdapterConfig/JobConfig 方向 | `done` | 不写字段全集/默认值 |
| 图示判断 | 表格足够，不补配置图 | `done` | 符合按需规则 |
| 回填、自检和门禁 | §11 草稿 | `done` | 完成后 `pass` |

## 2. SOP 问题回答

### 2.1 哪些结构受配置影响？

受影响的结构包括：平台 shell 与宿主能力声明、SDK capability/profile 与错误/redaction/retry 适配策略、页面/路由功能开关、缓存/本地投影留存和清理姿态、恢复/resume/requery 策略、低敏诊断 allowlist、可访问性和通知偏好、Artifact preview/打开能力的产品策略、以及开发/预览/生产边界的 endpoint/profile 注入。它们只能选择已允许的能力或展示姿态，不能改变 owner truth 或业务结果。

### 2.2 哪些模块只能间接受配置影响？

`ChatSemanticPolicy`、`VisibilityGuard`、`CommandResultGate`、`ChangeAcceptanceRecord` 和核心状态迁移只能间接受配置影响：配置可以提供 profile/能力来源或存储/宿主策略，但不能关闭、放宽或重写这些硬边界。页面 view model 和 reducer 只能读取已验证的 config posture，不能直接解释原始配置。

### 2.3 哪些领域规则、状态机、审计链和安全门禁禁止配置化？

禁止配置化：owner truth 归属、actor/scope/visibility 授权、confirmed 结果门控、unknown 非重放、formal change/resume 来源、redaction/body-free、logout/revoke/expiry 清理、跨端业务状态语义、Chat 不执行 Runtime/Tools/治理/Observability backend，以及低敏诊断不升级为 audit/evidence 的边界。

### 2.4 03/04 要继续定义什么？

03 应定义 `RuntimeConfig`、`ConfigSource`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`ConfigError` 和 runtime builder/adapter 注入关系的实现契约；04 应说明配置项、profile、默认/覆盖、敏感值引用、环境/平台差异、校验和填写方式。本步不写这些字段全集、默认值、JSON/YAML/TOML、环境变量或部署挂载。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| README/旧文档把框架、目录和 endpoint 当固定配置 | 把实现载体伪装成正式产品事实 | 只识别 platform/profile/adapter 影响，不锁包名/目录/endpoint。 |
| 旧文档用 feature flag 绕过 Gate/Policy/Runtime 边界 | 配置可越权或生成第二 truth | 关键 invariant/结果门控/安全清理列为禁止配置化。 |
| 旧文档把 offline mode 当全局开关 | 可能允许离线写入/审批 | 只配置展示缓存/草稿/恢复姿态，离线业务能力明确不进入。 |
| 旧文档把 retry/timeout 数字写成既定值 | 无 authority，且可能影响副作用语义 | 只登记 retry/timeout 受配置影响，具体参数留给 03/04。 |

## 4. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Desktop/Web/Mobile platform shell | 是 | `platform profile`、`capability profile`、`window/notification/deep-link/storage posture` | `PlatformConfig`、`PlatformCapabilityAdapter` 注入、能力探测和缺失姿态。 |
| `ClientApplicationShell` / route entry | 间接受影响 | `feature policy`、`entry profile`、`deep-link policy` | 应用壳装配、路由 policy 注入和不可见/blocked 处理。 |
| `SdkQueryAdapter` / `SdkCommandAdapter` | 是 | `SDK profile`、`endpoint reference`、`timeout/retry category`、`redaction profile` | `AdapterConfig`、SDK capability discovery、error/redaction 映射和 builder 注入。 |
| `SdkChangeAdapter` / `ResumeCoordinator` | 是 | `change/resume profile`、`requery policy`、`backoff category` | `ChangeAdapterConfig`、resume/requery policy 注入和配置错误处理。 |
| `CommandResultGate` / `VisibilityGuard` | 间接受影响 | `capability profile`、`disclosure profile`（只能收紧） | validator 只能验证允许 profile；不得用配置关闭 gate/guard。 |
| `SafeMaterialComposer` / `PreviewBoundary` | 是 | `safe material profile`、`preview capability policy`、`redaction profile` | safe material/preview adapter 配置和缺失/冲突处理。 |
| `ClientStateStore` / `LocalProjectionRepository` | 是 | `store root`、`retention category`、`cache profile`、`encryption capability` | `StorageConfig`、repository builder、版本/迁移/失败姿态。 |
| `DraftStore` | 是 | `draft retention`、`restore policy`、`clear-on-logout` | `DraftConfig`、清理和恢复 contract；不得改变 draft≠submission。 |
| `CacheEvictionCoordinator` | 是 | `eviction policy`、`clear trigger profile`、`retention category` | `EvictionConfig`、清理顺序、失败回退和安全检查。 |
| `RecoveryCoordinator` / `RecoveryViewModel` | 是 | `recovery profile`、`offline read posture`、`unknown probe policy` | `RecoveryConfig`、恢复装配、禁止副作用重放和用户决定入口。 |
| `AccessibilitySemanticAdapter` | 是 | `accessibility profile`、`motion/contrast/announcement preference` | `AccessibilityConfig`、能力探测和等价语义映射。 |
| `StatusAnnouncement` / notifications | 是 | `announcement policy`、`notification capability`、`redaction profile` | 公告/通知适配器、去重和安全文本生成；不产生业务结果。 |
| `DiagnosticHandoffAdapter` | 是 | `diagnostic allowlist`、`redaction profile`、`sink profile` | `DiagnosticConfig`、低敏字段过滤和 sink failure posture。 |
| `ChangeReducer` / `ClientStateStore` 状态迁移 | 间接受影响 | `profile` 只选择允许的呈现/缓存姿态 | `StateConfig` 验证；不能改写状态机 invariant 或 owner authority。 |
| 测试/fake adapter | 是 | `fixture profile`、`failure injection profile` | 03/05 的测试 seam；fake 不得被当生产 readiness。 |

## 5. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Conversation/Turn/Participant/Project/Member/Gate/Decision/Artifact/Workspace/Runtime/Observability truth owner | 配置不能创建第二 truth 或转移生命周期/授权 | 对应 owner 与 `01-架构设计.md` |
| `VisibilityGuard` 的 fail-closed 规则 | 配置不能把未知 visibility 变为 visible/available | Identity/Governance/SDK 合同与 `03` |
| `CommandResultGate` 的 formal authority 要求 | 配置不能把 ACK/cache/button/notification 变成 confirmed | SDK/owner command contract 与 `03` |
| unknown 副作用禁止自动重放 | 配置不能绕过副作用不确定性 | owner probe/query contract 与 `03` |
| formal change/resume 来源、幂等和 gap 语义 | 配置不能把内部 bus/offset/arrival time 变成事实 | SDK/conversation owner 与 `03` |
| body-free、redaction、credential/secret/raw body 禁存 | 安全和最小披露硬边界 | SDK/owner security contract 与 `04` |
| logout/revoke/expiry/scope-change 清理 | 配置不能延长授权或恢复失效材料 | Identity/SDK/04 |
| 跨端业务状态、结果和权限语义 | 平台 profile 不得造成语义分叉 | `01` 与后续平台设计 |
| Chat 不执行 Runtime/Tools/Governance/Observability backend | feature flag 不能改变仓职责 | 对应专项 owner |
| 本地 projection 反写 owner、diagnostic 变 audit/evidence | 保护单向消费和证据权威 | `01`、L4-observability 与后续设计 |

## 6. 配置读取与边界说明

本轮只定义影响方向：配置应由运行装配层读取、校验并以受限 profile 注入 adapter、store、job、platform 和 presentation seam；核心语义对象不直接读取原始配置。配置缺失/冲突/不兼容时，相关能力进入 `blocked`、`unavailable`、`needs-action` 或安全默认姿态，不能自动放宽权限、结果或持有面。

不补配置影响图：当前表格已能表达配置来源、受影响部分、禁止配置化边界和 03/04 承接方向；画图会诱导读者把 profile 装配误解为运行拓扑或配置项清单。

## 7. 详细设计承接说明

本章只识别配置影响轮廓，不定义配置项清单、JSON/YAML/TOML 示例、默认值、环境变量、密钥名称、`RuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 完整参数或部署挂载。上述影响应在 `03-详细设计.md` 中收口为配置实现契约，并由 `04-配置设计.md` 继续说明如何填写、校验、覆盖、引用敏感值和按平台使用。

## 8. 回填草稿（正式 §11）

> 校准来源：本文件 `§4 配置影响轮廓表`、`§5 禁止配置化边界表`、`§7 详细设计承接说明`。

概要设计识别的配置影响集中在平台 shell/宿主能力、SDK adapter、formal change/resume、safe material/preview、local projection/draft/cache、recovery/probe、可访问性/通知、低敏诊断以及 fake adapter。配置只选择已允许的 profile、能力姿态、存储/清理/恢复策略或 redaction/allowlist；核心语义、owner truth、visibility fail-closed、正式结果门控、unknown 非重放、formal change/resume 来源、body-free、撤销清理、跨端业务语义和 Chat 职责边界禁止配置化。

03 需要继续定义配置加载、校验、注入和错误边界；04 需要定义配置项、profile、默认/覆盖、敏感值引用、平台差异和填写规则。本章不产生配置项、默认值、部署参数或 readiness 结论。

## 9. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| SDK capability/profile discovery 的正式来源 | adapter、版本兼容和 feature posture | 只登记 `SDK profile` 类别；未闭合时 blocked/deferred。 |
| local storage/retention/clear 的正式安全合同 | cache/draft/recovery 配置 | 只允许最小安全材料和清理方向；具体上限留给 owner/04。 |
| Desktop/Web/Mobile 宿主能力 profile | platform adapter 和等价路径 | Desktop-first；其他 shell candidate，不产生兼容矩阵。 |
| Diagnostic allowlist/sink profile | 低敏 handoff 和支持入口 | optional/blocked；不把配置生成 audit/evidence。 |

## 10. 自检与门禁

### 10.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否列出受配置影响的主要部分/接缝？ | 是；均回指前文主体。 |
| 是否显式列出禁止配置化边界？ | 是；owner truth、权限、结果、恢复、redaction、清理、职责均覆盖。 |
| 是否写配置项、默认值、环境变量、密钥或部署参数？ | 否。 |
| 是否把核心语义直接绑定原始配置？ | 否；由装配层验证后注入 profile。 |
| 是否说明 03/04 的承接方向？ | 是。 |
| 是否把 feature flag 当 readiness 或安全授权？ | 否。 |

### 10.2 进入下一步条件

- 配置影响已按主要部分、接缝和运行形态收稳。
- 禁止配置化边界明确，且没有进入配置项/默认值/部署细节。
- 详细设计和配置设计的承接方向清楚。

### 10.3 门禁结论

`gate_status = pass`。Step 11 已完成，下一动作是创建并执行 `02_hld_step_12_ddd_handoff.md`；Step 12 将把前述代码主体、对象、接口、处理流、状态和配置影响明确交给详细设计，禁止详细设计暗改主语。

## 2026-10-01 当前逐章复核

计划/输入：Step11 SOP、规范§4.11、现有§11与当前Step4～10主体。SOP回答：项目/目录coordinator、只读renderer、局部navigation/cache受装配profile/展示偏好影响；guard/reducer/result/context隔离只能间接受验证后的姿态，不能读原始配置或放宽不变量。

诊断/结构结果：旧表缺流程viewer/目录provider/消费隔离。补coordinator/renderer/nav配置影响；禁止配置化Process truth、汇聚/Gate分立、绑定owner/人员覆盖、source/context/请求代次检查。图库配置不得生成BPMN或注入生产demo。实际图库/adapter constructor/config字段/默认数值留03/04；provider只有正式SDK能力才装配。

复杂度表足够，无需配置图。回填§11.1/2，既有§11.3装配读取规则有效。自检每主体来自§4～8，无新业务模块/配置值；Step11 done gate pass，进入Step12；合同blocked，无实现/测试/提交。
