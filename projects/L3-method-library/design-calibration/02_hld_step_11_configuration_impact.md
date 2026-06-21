# Step 11. 配置影响轮廓

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L3-method-library/02-概要设计.md` §11 配置影响轮廓
- 当前模块：Step 11 已完成,等待进入 Step 12 详细设计承接清单

---

## 2. 必读文档

| 文档 | 必读原因 | 当前读取状态 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 固定 Step 11 的问题、产物、禁止下沉内容和完成门禁。 | read |
| `standards/document/概要设计书写规范.md` | 固定正式 §11 配置影响轮廓表、禁止配置化边界表和承接说明格式。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 固定“先整体模块、再逐模块思考 / 写入”的执行方式。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止把配置影响写成未闭口 config key、schema、adapter 参数或 runtime 实现。 | read |
| `projects/L3-method-library/00-需求文档.md` | 提供 P0 / P1 范围、边界规则、接口需求、NFR 和验收口径。 | read |
| `projects/L3-method-library/01-架构设计.md` | 提供系统上下文、依赖方向、数据所有权、运行单元和横切关注点。 | read |
| `projects/L3-method-library/02-概要设计.md` | 对齐当前正式概要章节,识别 §11 缺口和后续章节顺延影响。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_04_code_subject_framework.md` | 配置影响必须回指代码主体框架,不得新增未讨论结构。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_05_components_boundary.md` | 配置影响必须回指主要组成部分和接缝。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 判断入口、adapter、job、query 和 event 是否受配置影响。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_08_processing_flows.md` | 判断处理流中哪些运行策略可能受配置影响。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_09_state_machine.md` | 明确状态机红线禁止配置化。 | read |
| `projects/L3-method-library/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 明确异常、恢复、retry 和边界拒绝哪些只识别影响,不写参数。 | read |

---

## 3. 本步目标

Step 11 只识别配置影响轮廓,不定义配置实现契约。

本步必须回答:

1. 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响。
2. 哪些模块只能间接受配置影响,不能直接读取配置。
3. 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化。
4. 哪些配置影响需要在 `03-详细设计.md` 中继续定义 RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ConfigError 或 runtime builder 注入关系。
5. 哪些配置细节属于 `04-配置设计.md`,不能在概要设计中提前展开。

本步不得写:

- 配置项清单。
- JSON / YAML / env 示例。
- 默认值、环境变量名、secret 名称。
- RuntimeConfig 字段全集。
- ConfigError 枚举全集。
- adapter constructor 完整参数。
- 配置加载函数实现、部署挂载或热更新流程。

---

## 4. 整体模块

| 模块 | 状态 | 任务 | 产物 |
|---|---|---|---|
| 必读文档读取 | completed | 读取并摘要本 Step 输入。 | 必读摘要表。 |
| 模块 A:配置影响候选识别 | completed | 从主要组成部分、入口、adapter、job、worker 和外部接缝中找出配置影响候选。 | 配置影响候选表。 |
| 模块 B:配置影响轮廓写入 | completed | 将候选收敛为正式概要层配置影响轮廓。 | 配置影响轮廓表。 |
| 模块 C:禁止配置化边界思考 | completed | 识别不能被配置开关绕过的领域、状态、审计、一致性和安全边界。 | 禁止配置化边界候选表。 |
| 模块 D:禁止配置化边界写入 | completed | 写入正式禁止配置化边界表。 | 禁止配置化边界表。 |
| 模块 E:详细设计承接思考 | completed | 明确哪些配置实现契约交给 03,哪些配置说明交给 04。 | 配置承接候选表。 |
| 模块 F:详细设计承接写入 | completed | 写入概要层配置实现承接说明。 | 详细设计承接说明。 |
| 模块 G:正式 §11 回填 | completed | 将已确认内容回填到 `02-概要设计.md`。 | 正式文档 §11。 |
| 模块 H:旧材料差异审计 | completed | 对比现有 §11/§12 顺序和旧 Step 文件,记录是否需要后续顺延修正。 | 差异审计表。 |

---

## 5. 当前诊断

| 发现 | 影响 | 当前处理 |
|---|---|---|
| 新版概要规范要求 §11 是配置影响轮廓。 | 当前正式 `02-概要设计.md` 直接从 §10 跳到详细设计承接清单,缺配置影响章节。 | 本 Step 补 §11 配置影响轮廓,后续详细设计承接和风险章节需要顺延审计。 |
| 已有 `02_hld_step_11_detail_design_handoff.md` 是详细设计承接清单。 | 文件编号与新版 SOP 的 Step 11 冲突。 | 不删除旧文件;本 Step 新建 `02_hld_step_11_configuration_impact.md`,后续 Step 12 再处理承接清单迁移。 |
| 配置实现细节容易下沉到概要层。 | 会提前发明 config key、schema、adapter 参数,导致 03/04 设计闭环冲突。 | 本 Step 只写影响类别、禁止配置化边界和承接方向。 |
| 正式文档已插入新版 §11。 | 旧 §11 / §12 / §13 已顺延为 §12 / §13 / §14。 | Step 12 应处理旧 `02_hld_step_11_detail_design_handoff.md` 到新版 `02_hld_step_12_detailed_design_handoff.md` 的迁移或重建。 |

---

## 6. 进入逐模块条件

- [x] 已确认 Step 10 完成。
- [x] 已确认新版 SOP / 书写规范要求补配置影响轮廓。
- [x] 已创建 Step 11 框架。
- [x] 已完成必读文档摘要。
- [x] 已进入模块 A:配置影响候选识别。
- [x] 已完成模块 B 配置影响轮廓写入。
- [x] 已完成模块 C / D 禁止配置化边界。
- [x] 已完成模块 E / F 详细设计承接说明。
- [x] 已完成模块 G 正式 §11 回填。
- [x] 已完成模块 H 旧材料差异审计。

---

## 7. 必读文档摘要

| 输入 | 摘要 | 对 Step 11 的影响 |
|---|---|---|
| 概要设计 SOP Step 11 | 本步只识别配置影响、禁止配置化边界和详细设计承接方向。 | 配置影响必须回指已收稳的主要组成部分、接缝、入口、adapter 或 job。 |
| 概要设计书写规范 §4.11 | 正式章节必须包含配置影响轮廓表、禁止配置化边界表和详细设计承接说明。 | `是否受配置影响` 只能写“是 / 否 / 间接受影响 / 不适用”;影响类型只写类别。 |
| 中间产物规范 | 每个 Step 必须先搭整体模块,再逐模块先思考、后写入;100~300 行只是单次写入批次建议。 | 本 Step 不能一次性薄写总表,每个模块必须保留思考、诊断、取舍、产物和自检。 |
| 真相源闭环标准 | 配置只能绑定 adapter、参数、topic transport、entry 参数或运行装配,不得改变业务不变量、状态机、truth owner 或边界。 | Step 11 不定义 config key、schema、默认值、env 名、secret 名、adapter constructor 参数或 runtime 实现。 |
| `00-需求文档.md` | 本仓定位为方法资产定义源,核心范围覆盖 SPEM 方法内容、生命周期模型、AI 方针、视图策略和分发语义;流程执行、治理执行、UI 渲染、外部正文和 marketplace 交易均为边界外。 | 配置影响不能把外围增强、组织级策略变体、治理执行或 UI 匹配实现提升为核心前置。 |
| `01-架构设计.md` | 架构固定同步入口、异步协作、后台维护、正式状态承载、读取追溯等运行承载,并要求不固定数据库、缓存、消息、任务调度、部署平台或协议。 | 可识别运行承载和外部接缝受配置影响,但不能写具体存储、队列、topic、调度或部署参数。 |
| `02-概要设计.md` | 当前正式文档已有 §10 异常与边界场景,随后直接进入旧 §11 详细设计承接清单。 | 本 Step 需要新增正式 §11 配置影响轮廓;旧 §11 后续应顺延为详细设计承接清单。 |
| Step 4 代码主体框架 | 代码主体分为入口 / application / domain / ports / persistence / projection / collaboration 等层,但不固定代码目录、adapter、DB 或 topic。 | 配置影响只能指向概要层运行装配和 adapter 接缝,不能新增仓内技术主体。 |
| Step 5 主要组成部分 | 已收稳 8 个组成部分:方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 | 配置影响主语必须优先来自这 8 个组成部分及其已确认接缝。 |
| Step 7 接口骨架 | Command、Query、Inbound Event、Outbound Event、Operations Job 均已按概要层骨架识别;topic、payload、job 调度、worker loop、retry 留后续。 | 配置影响可覆盖 entry、event、job、adapter 边界,但不得写协议、payload、调度或 retry 参数。 |
| Step 8 处理流 | 通用 Command、Query、Inbound Consumer、Outbound Event、Operations Job 路径已收稳;job 只刷新材料和收敛状态,不修核心 truth。 | batch size、retry、transport、refresh scope 等只能作为影响类别,且需交给 03 / 04 后续闭合。 |
| Step 9 状态机 | 核心状态机、传播状态和 P1 状态机已被点名;非法迁移、隐式正式化和状态回滚必须禁止。 | 配置不得改变状态词表、允许迁移、非法迁移、dead letter 恢复门槛或 P0 / P1 隔离。 |
| Step 10 异常边界 | gate / version / lifecycle / reference / boundary 失败发生在状态变化前;outbox / propagation 失败不回滚核心 truth;retry 参数和恢复作业参数留后续。 | 配置只能影响运行策略或接缝行为,不能让异常处理绕过 gate、version、boundary、外部正文禁止或下游 truth 边界。 |

---

## 8. 模块 A:配置影响候选识别

### 8.1 问题回答

本模块回答“哪些已收稳的概要层结构可能受配置影响”。

配置影响候选应满足三个条件:

1. 主语已经在 Step 4 / 5 / 7 / 8 / 9 / 10 出现。
2. 影响属于运行装配、外部接缝、入口选择、profile、store root、timeout、batch size、retry、feature policy、secret ref、external endpoint 等类别。
3. 影响不能改变领域不变量、状态机、truth owner、正式化规则、Definition vs Use 边界、审计链或事务一致性。

### 8.2 诊断

- 核心定义类组成部分可以被配置“间接影响”,例如读取材料路径、入口 profile、adapter 可用性或外部来源接入状态,但不能直接读配置来改变方法资产定义真相。
- 运行承载和接缝类结构最容易受配置影响,包括同步入口、异步协作、后台维护、外部摘要接入、outbound event transport、maintenance job 和外围 discovery。
- 后台维护与收敛需要识别 batch size、retry、refresh scope、store root 等影响类别,但这些不能变成 job 修核心 truth 的开关。
- 外围包与方法集组织可受 feature policy 或 external endpoint 影响,但外围不可用不能阻塞 P0 核心闭环。
- 当前正式 `02-概要设计.md` 还没有 §11 配置影响章节,后续正式回填时需要插入新 §11 并把旧 §11 / §12 顺延。

### 8.3 取舍

| 取舍项 | 选项 | 结论 | 理由 |
|---|---|---|---|
| 是否把 8 个组成部分全部写成直接读取配置 | 全部直接受配置影响 / 区分直接与间接 | 区分直接与间接 | 核心 domain 和 truth 不能直接读取 runtime config;配置应通过 application / runtime builder / adapter 注入影响接缝。 |
| 是否恢复旧 fingerprint / outbox / snapshot 配置主线 | 恢复旧配置项 / 只识别当前影响类别 | 只识别当前影响类别 | 旧机制未在本轮重新闭口,不能用旧材料反推 config key 或参数。 |
| 是否把 P1 package / method set 写成核心配置模块 | 核心化 / 保持外围增强 | 保持外围增强 | 00 / 01 已明确外围增强不阻塞核心闭环。 |
| 是否在本 Step 写具体 job 参数 | 写参数 / 写影响类别 | 写影响类别 | retry 次数、批大小、游标、调度属于 03 / 04 / 运维继续展开。 |

### 8.4 配置影响候选表

| 候选主语 | 来源 | 候选影响类别 | 是否可进入正式轮廓 | 初步理由 |
|---|---|---|---|---|
| 方法资产定义与目录 | Step 5 组成部分 | 间接受 profile / store root / read material refresh 影响 | 是 | 定义 truth 不直接配置化,但目录读取材料、存储接缝和运行装配会影响读取可用性。 |
| 正式化与版本 | Step 5 / Step 9 | 间接受 gate source、version store、idempotency / concurrency strategy 影响 | 是 | 正式化规则不能配置绕过,但外部依据接入和持久化接缝需要配置承接。 |
| 受控消费 | Step 5 / Step 7 / Step 8 | feature policy、profile、read material store、availability fallback | 是 | 消费材料和可用性视图受运行 profile 影响,但 Definition vs Use guard 不可配置绕过。 |
| 追溯与一致性保护 | Step 5 / Step 8 | trace material store、impact summary inbound source、retention / safe diagnostic 类别 | 是 | 追溯材料和影响摘要有接缝配置影响,但审计链和正文禁止边界不可配置化。 |
| 关系与分发语义 | Step 5 / Step 8 | distribution context、external endpoint、feature policy | 是 | 分发读取和外围发现可能有接缝配置;关系 truth 和完整性规则不可配置修改。 |
| 外部摘要与引用 | Step 5 / Step 7 / Step 8 | external endpoint、secret ref、adapter kind、timeout、source allowlist 类别 | 是 | 外部接入天然受 adapter 配置影响,但只能承接摘要 / 引用,不得保存正文。 |
| 后台维护与收敛 | Step 5 / Step 7 / Step 8 / Step 10 | job profile、batch size、retry、refresh scope、store root、safe diagnostic policy | 是 | 维护 job 是主要配置影响面,但只能刷新材料和收敛 progress,不能修核心 truth。 |
| 外围包与方法集组织 | Step 5 / Step 8 | feature policy、marketplace context、external endpoint、package store root | 是 | 作为外围增强可被 profile 启停或降级,但不可阻塞 P0 核心闭环。 |
| 同步入口 / API entry | Step 4 / Step 7 | entry profile、config source selector、operation context factory | 是 | 入口需要由 runtime 装配传入配置影响,不能由 domain 读取 raw config。 |
| Inbound Event Consumer | Step 7 / Step 8 | transport binding、source profile、idempotency channel、timeout | 是 | 只能接收 body-free summary / ref / marker;topic / payload / retry 留详细设计。 |
| Outbound Event / collaboration boundary | Step 7 / Step 8 / Step 9 | transport binding、topic transport、retry、dead letter policy | 是 | 传播失败不回滚核心 truth;具体投递参数不能在概要层定义。 |
| Operations Job | Step 7 / Step 8 / Step 10 | job profile、batch size、retry、cursor / scope policy、report root | 是 | job 需要配置影响轮廓,但不写调度、worker loop、报告 schema 或参数值。 |
| Query / projection read material | Step 7 / Step 8 / Step 10 | store root、cache / projection availability、fallback policy | 是 | projection 不可用可受配置装配影响,但不能反写真相或自行生成 missing truth。 |
| 状态机和非法迁移 | Step 9 | 无 | 否 | 状态词表、允许 / 禁止迁移、隐式正式化禁止和 dead letter 恢复门槛是不可配置边界。 |

### 8.5 模块自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 候选是否来自已收稳主语 | pass | 候选均回指 Step 4 / 5 / 7 / 8 / 9 / 10。 |
| 是否写入具体 config key / 默认值 / JSON | pass | 仅写影响类别。 |
| 是否让 domain truth 直接读取配置 | pass | 核心组成部分标为间接受影响或禁止配置化。 |
| 是否恢复旧材料配置项 | pass | 未恢复旧 fingerprint algorithm、outbox batch size、snapshot schema 等具体配置项。 |
| 是否可进入模块 B | pass | 候选表足以收敛为正式配置影响轮廓表。 |

---

## 9. 模块 B:配置影响轮廓写入

### 9.1 问题回答

本模块把模块 A 的候选收敛为正式概要层轮廓。收敛规则如下:

- 只保留已经在前序 Step 出现的主要部分、接缝、入口、job 或运行形态。
- `是否受配置影响` 只使用规范允许的固定值。
- `配置影响类型` 只写类别,不写具体键名、默认值、环境变量名、secret 名或配置文件结构。
- `交给详细设计展开` 只写后续需要定义的契约方向,不写字段全集或函数签名。

### 9.2 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| 同步入口 / Command / Query entry | 是 | config source selector、profile、operation context injection | 03 定义 entry 到 operation context / runtime builder 的注入关系;04 说明入口配置来源与选择规则。 |
| 方法资产定义与目录 | 间接受影响 | store root、read material availability、profile | 03 定义 repository / read material adapter 装配边界;domain object 不直接读取配置。 |
| 正式化与版本 | 间接受影响 | external basis adapter、version store、idempotency / concurrency store | 03 定义 formalization input adapter、version / idempotency port 和 ConfigValidator 对边界可用性的校验。 |
| 受控消费 | 是 | feature policy、profile、read material store、availability fallback | 03 定义 consumption material 装配、availability resolver 和 boundary guard 的注入来源;04 说明不同 profile 下的消费能力配置语义。 |
| 追溯与一致性保护 | 是 | trace material store、impact summary inbound source、safe diagnostic policy | 03 定义 trace / impact / consistency adapter 与 safe diagnostic boundary;04 说明保留期、诊断开关或来源选择的配置语义。 |
| 关系与分发语义 | 间接受影响 | distribution context、external endpoint、feature policy | 03 定义 relation / distribution read material 与外围 discovery adapter 的装配;04 说明外围分发能力启用语义。 |
| 外部摘要与引用 | 是 | external endpoint、secret ref、adapter kind、timeout、source allowlist | 03 定义 external summary adapter、secret ref 承载、timeout / unavailable 映射和正文禁止边界;04 说明来源配置语义。 |
| 后台维护与收敛 | 是 | job profile、batch size、retry、refresh scope、store root、safe diagnostic policy | 03 定义 JobConfig、ConfigError、maintenance runtime builder 和 job result / progress 契约;04 说明批量、重试、范围和报告输出配置。 |
| Inbound Event Consumer | 是 | transport binding、source profile、idempotency channel、timeout | 03 定义 inbound adapter、event envelope、idempotency channel 和 body-free payload 校验;04 说明 transport / source 的配置语义。 |
| Outbound Event / collaboration boundary | 是 | topic transport、retry、dead letter policy、publisher adapter | 03 定义 outbound event adapter、publisher outcome、retry / dead letter 状态映射;04 说明 transport 与发布策略配置。 |
| Query / projection / read material | 是 | store root、cache / projection availability、fallback policy | 03 定义 query resolver、projection adapter、degraded / unavailable surface 和 refresh hint;04 说明读取材料配置语义。 |
| Operations Job | 是 | job profile、batch size、retry、cursor / scope policy、report root | 03 定义 job input / output、cursor / scope typed surface、JobConfig 和 artifact/report 边界;04 说明执行参数和输出位置配置。 |
| 外围包与方法集组织 | 是 | feature policy、marketplace context、external endpoint、package store root | 03 定义外围 package / method set adapter 与降级语义;04 说明外围增强启停和外部上下文配置。 |
| 状态机、领域规则、审计链和数据所有权边界 | 否 | 不适用 | 03 只能定义状态迁移函数、guard 和错误映射;不得把这些边界交给配置开关改变。 |

### 9.3 模块自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用规范固定值 | pass | `是否受配置影响` 仅使用“是 / 否 / 间接受影响”。 |
| 是否新增未讨论主语 | pass | 主语均来自 Step 4 / 5 / 7 / 8 / 9 / 10。 |
| 是否只写影响类别 | pass | 未写具体 key、默认值、JSON、env、secret 名或完整字段。 |
| 是否把实现契约交给 03 / 04 | pass | 每行均只写后续契约方向。 |
| 是否可进入模块 C | pass | 轮廓表已形成,可以继续识别禁止配置化边界。 |

---

## 10. 模块 C:禁止配置化边界思考

### 10.1 问题回答

本模块回答“哪些边界即使存在配置影响,也不能被配置开关改变”。

禁止配置化边界来自五类输入:

1. 需求和架构已固定的 Definition vs Use、truth ownership、外部正文禁止入仓、下游运行 truth 禁止入仓。
2. Step 5 / Step 6 已发现的 policy / guard / invariant。
3. Step 8 已收稳的 job 不修核心 truth、inbound 只接收 body-free summary / ref / marker、outbound 只传播 fact-ref / summary-ref。
4. Step 9 已收稳的状态词表、允许迁移和禁止迁移。
5. Step 10 已收稳的异常边界,尤其是 gate / version / lifecycle / reference / boundary 失败不进入状态变化。

### 10.2 诊断

- 配置最容易误伤的不是 adapter,而是把 feature policy 写成业务规则开关。例如“关闭 gate”“允许下游运行状态回填”“允许 raw artifact 入仓”都必须禁止。
- 维护 job、replay、refresh、rebuild 这类运行能力可以配置运行策略,但不能成为业务修复或重新正式化入口。
- Outbound / inbound 的 transport、retry 和 timeout 可以配置,但事件携带内容、idempotency、body-free 边界和 trace / audit 安全边界不能被配置放宽。
- P1 外围增强可以配置启停或降级,但不能通过 profile 变成 P0 核心成立前置。

### 10.3 禁止配置化边界候选表

| 候选边界 | 来源 | 禁止配置化原因 | 是否进入正式表 |
|---|---|---|---|
| Definition vs Use 分离 | 00 / 01 / Step 5 / Step 8 | 本仓只拥有定义 truth,不能因配置接收运行实例 truth。 | 是 |
| 方法资产定义 truth owner | 00 / 01 / Step 5 | 配置不能把定义真相迁移到 process、identity、runtime、UI、marketplace 或 governance。 | 是 |
| 外部正文 / raw body 禁止入仓 | 00 / 01 / Step 7 / Step 8 | 配置不能允许保存标准全文、artifact 正文、治理执行正文、证据正文或下游 raw state。 | 是 |
| 正式化状态机和非法迁移 | Step 9 | 状态词表和迁移规则是领域语义,不能由 profile 改写。 | 是 |
| gate / basis / version / reference / boundary 前置校验 | Step 8 / Step 10 | 配置不能绕过发布前校验或让失败分支继续落 published。 | 是 |
| 审计链、trace subject 和 safe diagnostic | Step 5 / Step 8 / Step 10 | 配置不能用日志、telemetry 或 raw diagnostic 替代业务审计 / trace。 | 是 |
| 事务一致性和 expected_version | Step 10 | 配置不能忽略并发冲突或把冲突转成静默覆盖。 | 是 |
| Operations Job 不修核心 truth | Step 7 / Step 8 | job 配置不能让维护任务创建、删除或修复核心业务 truth。 | 是 |
| Outbound 传播失败不回滚核心 truth | Step 9 / Step 10 | transport 配置不能改变核心 truth 与传播状态的分层。 | 是 |
| P0 / P1 范围隔离 | 00 / 01 / Step 5 / Step 8 | feature policy 不能让外围 package / method set 阻塞 P0 核心闭环。 | 是 |

### 10.4 模块 C 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 domain invariant | pass | Definition vs Use、truth owner、正式化规则已覆盖。 |
| 是否覆盖状态机红线 | pass | 状态词表、允许 / 禁止迁移和 published 入口已覆盖。 |
| 是否覆盖审计 / 一致性 / 安全 | pass | trace / audit、expected_version、raw body、safe diagnostic 已覆盖。 |
| 是否可进入模块 D | pass | 候选足以写入正式禁止配置化边界表。 |

---

## 11. 模块 D:禁止配置化边界写入

### 11.1 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Definition vs Use 分离 | 本仓只拥有方法资产定义真相,不得因配置接收流程实例、work item、runtime context、UI session 或下游消费成功状态。 | 回到 `00-需求文档.md` 范围边界和 `01-架构设计.md` 数据所有权重新讨论。 |
| 方法资产定义 truth owner | 方法定义、正式版本、定义性关系和受控消费前提不得迁移到消费仓、治理执行、marketplace 或 UI。 | 回到 `01-架构设计.md` 系统边界 / 数据所有权,再同步 02 主要组成部分。 |
| 外部正文 / raw body 禁止入仓 | 标准全文、artifact 正文、archive 正文、治理执行正文、证据正文、marketplace 履约正文和下游运行正文只能被引用或摘要承接。 | 回到 00 / 01 的外部正文边界,并在 03 对 summary / ref schema 重新闭口。 |
| 正式化状态机和非法迁移 | `draft / in_review / published / deprecated / retired / superseded` 等状态语义和非法迁移不能被 profile 或 feature policy 改写。 | 回到 02 Step 9 和 03 状态矩阵 / domain transition 重新讨论。 |
| gate / basis / version / reference / boundary 前置校验 | 发布、正式化、引用和消费边界失败必须阻断对应写入,配置不得允许绕过校验直接 accepted / published。 | 回到 02 Step 8 / Step 10 和 03 function flow / error recovery。 |
| 审计链、trace subject 和 safe diagnostic | 审计 / trace 必须来自正式业务 subject 和 safe summary,不能被日志、metric、raw diagnostic 或 adapter response 替代。 | 回到 03 object contract、port contract、error recovery 和 05 测试证据设计。 |
| 事务一致性和 expected_version | 并发冲突必须显式拒绝或要求重读,配置不得把 expected version 冲突变成静默覆盖。 | 回到 03 persistence / transaction consistency 和 idempotency 设计。 |
| Operations Job 不修核心 truth | refresh / replay / recovery 只能刷新读取材料、追溯材料、progress 和 issue,不能创建、删除、正式化或修复核心业务 truth。 | 回到 02 Step 8 后台维护与收敛处理流和 03 job function flow。 |
| Outbound 传播失败不回滚核心 truth | publisher / transport / retry 配置只能影响传播状态,不能把核心正式化结果回滚或改写。 | 回到 02 Step 9 / Step 10 和 03 outbox / publisher 状态设计。 |
| P0 / P1 范围隔离 | 外围 package、method set、marketplace discovery 或组织级配置不可通过配置变成 P0 核心闭环前置。 | 回到 `00-需求文档.md` P0 / P1 范围和 02 Step 5 / Step 8。 |

### 11.2 模块 D 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用规范表格 | pass | 已使用“禁止配置化边界 / 原因 / 若需改变应回到哪里”。 |
| 是否覆盖规范点名边界 | pass | domain invariant、状态机、审计链、事务一致性、安全 / 边界门禁均已覆盖。 |
| 是否把改变路径写清楚 | pass | 每行均指向需要重审的正式文档或后续详细设计。 |
| 是否可进入模块 E | pass | 禁止配置化边界已完成,可以继续写详细设计承接。 |

---

## 12. 模块 E:详细设计承接思考

### 12.1 问题回答

本模块回答“哪些配置影响应交给 03 定义实现契约,哪些配置细节应交给 04”。

概要层只负责把承接方向写清楚:

- `03-详细设计.md` 负责把配置影响收口成可落码契约,包括 runtime builder、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ConfigError、entry context factory、port / adapter unavailable 映射、query degraded surface 和 job report / progress surface。
- `04-配置设计.md` 负责说明如何填写、选择、校验和使用配置,包括具体 source selector、profile、key、默认值、环境变量、secret 名、文件格式、部署挂载、运维参数和示例。
- `02-概要设计.md` 不能提前决定具体键名、字段全集、默认值、enum spelling、文件路径或部署方式。

### 12.2 诊断

- 如果 03 不定义 RuntimeConfig / AdapterConfig / JobConfig 的边界,实现阶段会把配置影响散落到 service、adapter 和 fake runtime 中。
- 如果 04 不承接具体配置项和示例,概要或详细设计容易提前写 JSON / env / default,造成配置真相源漂移。
- 对 method-library 来说,配置实现契约最重要的闭口点不是“有哪些参数”,而是“配置只能注入到入口、adapter、job、projection 和 runtime builder,不能进入 domain invariant”。
- 外部摘要、inbound / outbound、maintenance 和外围 discovery 必须在 03 中定义 unavailable / degraded / skipped / rejected 的正式映射,否则实现会从 adapter error 字符串或私有状态推断。

### 12.3 配置承接候选表

| 承接主题 | 03 详细设计应定义 | 04 配置设计应说明 | 不在 02 写 |
|---|---|---|---|
| RuntimeConfig / runtime builder | 配置对象边界、注入点、domain 不直接读配置的规则。 | 配置来源、profile 选择和运行装配语义。 | RuntimeConfig 字段全集、JSON、env 名。 |
| ConfigLoader / ConfigValidator | 加载 / 校验契约、错误映射、缺失配置如何进入 safe failure。 | 文件 / env / profile / secret 的填写和校验规则。 | 具体文件格式、默认值、路径。 |
| Entry / operation context | entry 如何从配置和请求形成 operation context。 | entry-local 参数、profile 和配置源选择。 | CLI flag、HTTP path、请求 DTO 字段全集。 |
| External summary adapter | adapter kind、endpoint / secret ref 承载、timeout / unavailable 映射。 | 外部来源如何配置、启停和降级。 | endpoint 字符串、secret 名、重试数值。 |
| Inbound / outbound transport | envelope、idempotency channel、publisher outcome、retry / dead letter 状态映射。 | transport、topic、source profile 和投递策略配置。 | topic 名、payload schema、retry 默认值。 |
| Query / projection material | projection adapter、fallback / unavailable / degraded surface。 | store root、cache / projection 可用性和刷新策略配置。 | DB 表、索引、cache key、fallback 算法。 |
| Operations Job | JobConfig、run / scope typed surface、progress / report / issue ref 契约。 | batch、retry、cursor、scope、report root 和调度配置。 | 具体参数值、cron、worker loop、artifact JSON schema。 |
| Safe diagnostic / audit | safe reason、redaction、trace / audit subject 来源和 adapter diagnostic 边界。 | 诊断输出、保留和脱敏配置语义。 | raw log、stack trace、外部响应正文。 |
| 外围 package / method set | 外围 adapter、feature policy 和降级语义。 | 外围增强启停、marketplace context 和 package source 配置。 | marketplace payload、交易状态、安装履约参数。 |

### 12.4 模块 E 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分 03 与 04 | pass | 03 写实现契约,04 写填写 / 校验 / 使用配置。 |
| 是否避免概要层下沉 | pass | 未写具体配置键、字段全集、默认值、文件格式或部署方式。 |
| 是否覆盖主要配置影响面 | pass | runtime、entry、adapter、transport、query、job、diagnostic、外围增强均覆盖。 |
| 是否可进入模块 F | pass | 可写正式承接说明。 |

---

## 13. 模块 F:详细设计承接写入

### 13.1 详细设计承接说明

本章只识别配置影响轮廓,不定义配置项清单、JSON 示例、RuntimeConfig 字段、ConfigError 枚举或 adapter constructor 参数。

上述配置影响应在 `03-详细设计.md` 中收口为配置实现契约,至少覆盖 RuntimeConfig / runtime builder 注入、ConfigLoader / ConfigValidator、entry context factory、external adapter、inbound / outbound transport、query / projection material、Operations Job、safe diagnostic 和外围增强降级语义。

具体配置来源、profile、key、默认值、环境变量、secret 名称、文件格式、部署挂载、调度表达、运维参数和填写示例应交给 `04-配置设计.md` 继续说明。`03` 和 `04` 都不得用配置开关改变 Definition vs Use、truth owner、正式化状态机、审计链、事务一致性、外部正文禁止入仓、下游运行 truth 禁止入仓或 P0 / P1 范围隔离。

### 13.2 配置影响轮廓图判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要补配置影响轮廓图 | 不需要 | 当前配置影响轮廓表已经把主要部分、接缝和承接方向列清。 |
| 不补图的风险 | 可接受 | 本章不表达复杂拓扑;补图反而容易诱导配置加载实现、部署挂载或 transport 细节下沉。 |
| 后续若补图 | 仅在正式回填审计发现表格不足时补 | 图只能表达配置影响哪些概要层主语,不得表达 JSON、secret、topic、加载流程或热更新。 |

### 13.3 模块 F 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否包含规范要求的承接说明 | pass | 已写“本章只识别...”和 03 / 04 承接口径。 |
| 是否仍未写具体配置 schema | pass | 没有写 key、默认值、env、secret、JSON、字段全集。 |
| 是否明确禁止配置化边界延续到 03 / 04 | pass | 已点名所有不可被配置开关改变的边界。 |
| 是否可进入模块 G | pass | Step 文件已具备正式 §11 回填素材。 |

---

## 14. 模块 G:正式 §11 回填

### 14.1 回填动作

| 回填位置 | 回填内容 | 来源 | 结果 |
|---|---|---|---|
| `02-概要设计.md` 文档元信息 | 日期、版本、变更记录更新到 v0.2.1。 | 本 Step 正式回填动作。 | completed |
| `02-概要设计.md` §1 / §2 | 补充配置影响轮廓作为概要设计必须回答和设计目标之一。 | 模块 B / F。 | completed |
| `02-概要设计.md` §11 | 新增“配置影响轮廓”,包含配置影响轮廓表、禁止配置化边界表和详细设计承接说明。 | 模块 B / D / F。 | completed |
| `02-概要设计.md` §12~§14 | 旧详细设计承接、风险、参考章节顺延编号。 | 当前正式文档结构审计。 | completed |

### 14.2 正式回填自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| §11 是否有配置影响轮廓表 | pass | 已回填 14 行主要部分 / 接缝。 |
| §11 是否有禁止配置化边界表 | pass | 已回填 10 条禁止配置化边界。 |
| §11 是否有详细设计承接说明 | pass | 已说明 03 / 04 承接边界。 |
| 是否提前写配置 schema | pass | 未写具体 key、默认值、JSON、env、secret 名或字段全集。 |
| 标题顺序是否正确 | pass | 正式文档现在为 §11 配置影响、§12 详细设计承接、§13 风险、§14 参考。 |

---

## 15. 模块 H:旧材料差异审计

### 15.1 差异审计表

| 审计对象 | 差异 | 当前处理 | 后续动作 |
|---|---|---|---|
| `02_hld_step_11_detail_design_handoff.md` | 文件编号仍对应旧 Step 11,内容主题是详细设计承接清单。 | 本 Step 不覆盖、不删除旧文件。 | Step 12 到达时迁移或重建为 `02_hld_step_12_detailed_design_handoff.md`。 |
| 正式 `02-概要设计.md` 旧 §11 | 原为详细设计承接清单。 | 已顺延为 §12。 | Step 12 继续审计内容是否仍适配新版 00 / 01 / 02 Step 1~11。 |
| 正式 `02-概要设计.md` 旧 §12 | 原为设计风险与待确认事项。 | 已顺延为 §13。 | Step 13 到达时重审风险是否需要增补配置相关风险。 |
| 正式 `02-概要设计.md` 旧 §13 | 原为参考。 | 已顺延为 §14。 | Step 14 装配时统一校准参考材料范围。 |
| 旧 fingerprint / outbox / snapshot 配置线索 | 历史材料容易把算法、batch size、topic、snapshot schema 写成当前配置项。 | 本 Step 未恢复具体配置项,只写当前影响类别。 | 若 03 / 04 采用这些机制,必须重新闭口 schema / port / config key。 |

### 15.2 差异审计自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否误删旧 Step 文件 | pass | 旧 detail handoff 文件保留,等待 Step 12 处理。 |
| 是否把旧配置项反推到当前 §11 | pass | 仅保留当前影响类别,未恢复旧具体参数。 |
| 是否明确后续迁移动作 | pass | Step 12 负责详细设计承接清单迁移或重建。 |

---

## 16. Step 11 完成门禁

| 门禁 | 结论 | 说明 |
|---|---|---|
| 必读文档已读取并摘要 | pass | §7 已记录摘要。 |
| 整体模块已搭建并逐模块完成 | pass | 模块 A~H 均已完成。 |
| 配置影响轮廓已形成 | pass | §9 和正式文档 §11.1 已完成。 |
| 禁止配置化边界已形成 | pass | §11 和正式文档 §11.2 已完成。 |
| 详细设计承接说明已形成 | pass | §13 和正式文档 §11.3 已完成。 |
| 未提前写配置实现细节 | pass | 未写具体 key、默认值、JSON、env、secret、字段全集、adapter 参数或部署挂载。 |
| 旧材料差异已审计 | pass | §15 已记录 Step 12 迁移动作。 |
| 是否允许进入下一步 | pass | 允许进入 Step 12 详细设计承接清单。 |

### R1.1 开工与必读文档:先思考

#### R1.1.1 当前恢复点判断

当前允许重开 Step 11 的依据:

| 来源 | 当前结论 | 对 Step 11 的影响 |
|---|---|---|
| `02_hld_calibration_flow.md` | Step 10 已由 `R1.27` 记录正式 `§10` 回填,当前恢复点已切到 Step 11 `开工与必读文档:先思考`。 | Step 11 可以重开,但必须先做必读和框架思考。 |
| `project_execution_ledger.md` | 当前恢复点为 Step 11 `开工与必读文档:先思考`。 | 不得直接沿用旧 Step 11 completed 结论,也不得直接进入 Step 11 正文模块。 |
| 正式 `02-概要设计.md` §10 | 已改为当前六个异常族、极简传播图和全局红线结构。 | Step 11 的配置影响必须先服从 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心。 |
| 正式 `02-概要设计.md` §11 | 仍是旧 Step 11 在旧 Step 10 前提下回填的配置影响正文。 | 只作污染检查和差异审计对象,不得作为本轮 Step 11 第一来源。 |
| 本文件既有内容 | 仍是旧 Step 11 已完成版本,默认允许直接进入 Step 12。 | 只作 historical material;本轮必须从开工模块重开。 |
| `02_hld_step_10_exceptions_boundaries.md` `R1.27` | 已明确 Step 11 只能按当前 Step 10 红线重开重审。 | Step 11 必须承接 Step 10 回填后的正式文本和 `R1.1`~`R1.27` 中间产物。 |

#### R1.1.2 旧 Step 11 初步诊断

旧 Step 11 不符合当前输入基线:

| 旧前提 / 旧主线 | 当前问题 | 本轮处理 |
|---|---|---|
| 旧 Step 11 默认 Step 10 已稳定闭口 | 当前 Step 10 已按新六个异常族重写并正式回填,旧 Step 11 未重新核对这些红线。 | 不继承;后续只在差异审计中记录。 |
| 旧 Step 11 允许完成后直接进入 Step 12 | 当前 Step 10 已明确 Step 11 必须先重审,Step 12 继续被阻断。 | 不继承;本轮 Step 11 只讨论重开后的配置影响。 |
| topic / relay / retry / dead letter 容易被当成业务主线配置 | 当前 Step 10 已明确 `event candidate` 不等于 delivery。 | 不得把 delivery 配置主线提升为 Step 11 主轴;如需 transport 参数,仅作外围接缝影响。 |
| 运维 / refresh / recovery 配置容易被写成 truth 修复开关 | 当前 Step 10 已明确 Job 不修 core truth。 | 不得继承这类表述;maintenance 配置只能影响派生材料和 progress。 |
| body-free / external boundary 只被当作 adapter 配置问题 | 当前 Step 10 已明确 raw body、archive 内容、provider payload 和 evidence body 不得越界入仓。 | 不得弱化为可配置放宽项;只能作为禁止配置化边界。 |
| 旧 Step 11 已回填正式 §11 | 当前正式 `§11` 来自旧 Step 11,仍可能携带旧异常主线假设。 | 正式 `§11` 降级为污染审计对象,待本轮 Step 11 完成后再决定是否重回填。 |

#### R1.1.3 Step 11 必读文档候选

本轮 Step 11 开工必须读取以下文档,并在下一批写入状态:

| 类别 | 文档 | 用途 | 下一批状态 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | 确认恢复点、不得跳步和 Step 12 仍被阻断。 | 写入 read。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | 确认 Step 10 completed_formal_backfilled / Step 11 reopening。 | 写入 read。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 11 | 固定配置影响轮廓、禁止配置化边界和承接说明的范围。 | 写入 read。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.11 / §11 | 固定正式 `§11` 的表格、说明深度和禁止下沉内容。 | 写入 read。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 固定先思考后写入、台账和门禁要求。 | 写入 read。 |
| 真相源闭环标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止把配置影响写成未闭口 config key、schema 或运行时私补。 | 写入 read。 |
| 当前正式概要 | `projects/L3-method-library/02-概要设计.md` §5~§11 | §5~§10 是当前输入;§11 是旧回填污染检查对象。 | 写入 read。 |
| 需求边界 | `00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` | 提供必须阻断、不得越界和不得配置化绕过的需求红线。 | 写入 read。 |
| 架构边界 | `01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_14_risks_open_questions.md` | 提供 truth / projection / reference / consistency、运行承载和横切风险输入。 | 写入 read。 |
| Step 4 | `02_hld_step_04_code_subject_framework.md` | 提供入口、application、domain、ports、persistence、projection、collaboration 等代码主体边界。 | 写入 read。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | 提供八个主要组成部分、职责边界和“不由谁处理”。 | 写入 read。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | 提供 Command、Query、Inbound、Outbound、Job 的配置影响落点分类。 | 写入 read。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | 提供配置影响会落在哪些处理流和哪些运行路径。 | 写入 read。 |
| Step 9 | `02_hld_step_09_state_machine.md` `R1.30`~`R1.31` | 提供不可配置化的状态机红线和 Step 10 承接口径。 | 写入 read。 |
| Step 10 | `02_hld_step_10_exceptions_boundaries.md` `R1.24`~`R1.27` | 提供正式 `§10` 草稿、总停审结论和 Step 11 重审红线。 | 写入 read。 |
| 下游依赖 | `02_hld_step_12_detailed_design_handoff.md` | 仅确认 Step 12 仍需等待 Step 11 完成后再重审。 | 写入 read。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_11_configuration_impact.md` | 只参考 Step 11 的章节粒度、候选池组织、禁止配置化边界和停审结构。 | 写入 read。 |

#### R1.1.4 本轮 Step 11 应回答的问题

按 SOP 和本仓当前状态,本轮 Step 11 至少回答:

1. 哪些主要组成部分、入口、adapter、job、transport、query read material 或外围接缝会受配置影响。
2. 哪些结构只能间接受配置影响,不得直接读取配置。
3. 哪些配置影响会触碰 Step 10 全局红线,因此必须被禁止或受严格约束。
4. 哪些配置只影响外部接缝、运行装配、节奏、范围和降级 surface,不能改写 truth owner、状态机和审计链。
5. 哪些配置影响应交给 `03-详细设计.md` 闭合实现契约,哪些具体项应交给 `04-配置设计.md`。
6. 哪些旧 Step 11 结论必须禁止回流,尤其是 delivery / retry 主线、job 修 truth、body-free 放宽和外围变核心前提。

#### R1.1.5 配置影响来源池初筛框架

下一批只搭框架,不写最终配置影响表。建议先按以下来源池筛选:

| 来源组 | 候选配置影响主语 | 初步判断 |
|---|---|---|
| 核心组成部分间接受影响 | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护。 | 配置只能通过 adapter / runtime builder / validated input 间接影响,不得进入 truth owner 或状态机。 |
| 入口与接缝直接影响 | Command / Query entry、Inbound Consumer、Outbound Event / collaboration adapter、Operations Job。 | 可能存在 profile、timeout、idempotency、transport、batch、cursor、target adapter 等配置影响。 |
| Query / visibility / degraded surface | query read material、projection / cache availability、safe diagnostic、fallback policy。 | 允许配置读取面和降级策略,但不得让 Query 写 truth 或放开 visibility / boundary。 |
| body-free / external / publication 边界 | external summary adapter、secret ref、source allowlist、handoff target、publisher adapter。 | 只能影响接缝可用性与 safe failure surface,不得放宽 body-free 边界或把 candidate 当 delivery。 |
| maintenance / refresh / reconciliation | refresh scope、retry、schedule、report root、progress projection。 | 只能影响派生材料和收敛节奏,不得把 job 变成核心 truth 修复路径。 |
| peripheral / package / method set | feature policy、external endpoint、package source、discovery context。 | 只能影响外围增强与降级,不得让外围成为核心闭环前提。 |

#### R1.1.6 Step 内执行框架候选

本轮 Step 11 不应一次性沿用旧总表。建议按以下模块推进:

| 序号 | 模块 | 目标 |
|---:|---|---|
| 1 | 开工与必读文档 | 确认输入基线、旧材料边界和 Step 内框架。 |
| 2 | L1-governance 框架对齐 | 只借 Step 11 的章节粒度、候选池组织和停审结构。 |
| 3 | 配置影响来源池 | 从 Step 4~10 当前结论筛选配置影响主语和排除项。 |
| 4 | 核心组成部分间接受影响 | 收稳哪些核心组成部分只能被间接影响,不得直接读配置。 |
| 5 | 入口 / adapter / transport / job 直接影响 | 收稳 entry、adapter、consumer、publisher、job 的配置影响轮廓。 |
| 6 | Query / visibility / degraded 配置边界 | 收稳读取面、safe diagnostic、projection / fallback 的配置影响边界。 |
| 7 | body-free / publication / peripheral 配置边界 | 收稳 body-free、candidate / delivery、外围增强和 discovery 的配置边界。 |
| 8 | 禁止配置化边界 | 统一收口不得被配置绕过的规则、状态、审计链和一致性边界。 |
| 9 | 03 / 04 承接边界 | 明确哪些实现契约交给 03,哪些填写说明交给 04。 |
| 10 | 旧材料差异审计 | 审计本文件旧内容和正式 `§11` 的污染与保留项。 |
| 11 | 正式 §11 回填草稿 | 形成可回填草稿,不直接改正式文档。 |
| 12 | 自检与停审 | 判断 Step 11 是否完成、是否需要正式回填以及是否允许进入 Step 12。 |

#### R1.1.7 下一写入批次边界

下一批 `R1.2 开工与必读文档:再写入` 只允许写:

1. 必读文档表和读取状态。
2. 当前输入基线确认。
3. 旧 Step 11 降级声明。
4. 本轮 Step 11 模块执行计划。
5. 下一模块停审记录和 `next_allowed_action`。

不得写配置影响轮廓表、禁止配置化边界表、详细设计承接正文、正式 `§11` 回填草稿或正式 `02-概要设计.md`;不得进入 Step 12。

#### R1.1.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只做开工诊断、必读清单和 Step 内框架思考。 |
| 是否直接写 Step 11 正文 | no | 未写配置影响轮廓表、禁止配置化边界表或正式 §11 草稿。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否降级旧 Step 11 | pass | 已明确本文件既有内容和正式 §11 都只能作 historical / 污染审计对象。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 开工。 |

next_allowed_action: 等待用户确认后进入 Step 11 `开工与必读文档:再写入`;只写必读文档表、输入基线、旧 Step 11 降级声明、Step 内模块计划和停审记录,不得写配置影响轮廓表、禁止配置化边界表或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.2 开工与必读文档:再写入

#### R1.2.1 当前有效文件头

| 项 | 当前口径 |
|---|---|
| 当前 Step | Step 11 配置影响轮廓 |
| 当前模式 | full-restart / R1 重审 |
| 第一来源 | 当前项目级台账、文档级 flow、正式 `02-概要设计.md` §5~§10 和 Step 5~10 当前结论 |
| 正式文档目标 | `projects/L3-method-library/02-概要设计.md` §11 |
| 当前禁止 | 不写配置影响轮廓表、不写禁止配置化边界表、不写 `03 / 04` 承接正文、不写正式 §11 回填草稿、不改正式 `02-概要设计.md`、不进入 Step 12 |
| 旧材料处理 | 本文件上方既有 Step 11 completed 内容、当前正式 §11 旧正文和历史 03 / 04 配置材料均为 historical material |

#### R1.2.2 必读文档表

| 类别 | 文档 | 读取状态 | 本步用途 |
|---|---|---|---|
| 项目台账 | `design-calibration/project_execution_ledger.md` | read | 确认当前只允许完成 Step 11 `开工与必读文档:再写入`,不得跳到配置影响正文或 Step 12。 |
| Flow | `design-calibration/02_hld_calibration_flow.md` | read | 确认 Step 10 已正式回填,Step 11 当前为 reopening opening loop。 |
| SOP | `standards/document/概要设计讨论流程_SOP.md` Step 11 | read | 固定配置影响轮廓、禁止配置化边界和 `03 / 04` 承接说明的范围。 |
| 书写规范 | `standards/document/概要设计书写规范.md` §4.11 / §11 | read | 固定正式 §11 的表格结构、说明深度和禁止下沉内容。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | read | 固定先思考后写入、历史材料后置差异审计、项目级 / 文档级 / Step 级门禁。 |
| 真相源闭环标准 | `standards/document/设计真相源闭环与可落码性标准.md` | read | 防止把配置影响写成未闭口 config key、schema、port、state 或 runtime 私补。 |
| 当前正式概要 | `projects/L3-method-library/02-概要设计.md` §5~§11 | read | §5~§10 是当前输入;§11 仅作旧回填污染检查对象。 |
| 需求边界 | `00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` | read | 提供不得配置绕过的业务规则、数据归属和接口边界红线。 |
| 架构边界 | `01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_14_risks_open_questions.md` | read | 提供 truth / projection / reference / transport / 运行承载 / 风险输入。 |
| Step 4 | `02_hld_step_04_code_subject_framework.md` | read | 提供入口、application、domain、ports、projection、persistence、collaboration 的代码主体边界。 |
| Step 5 | `02_hld_step_05_components_boundary.md` | read | 提供八个主要组成部分、职责边界和“不由谁处理”。 |
| Step 7 | `02_hld_step_07_api_interface_skeleton.md` `R1.45` | read | 提供 Command、Query、Inbound、Outbound、Job 的配置影响落点分类。 |
| Step 8 | `02_hld_step_08_processing_flows.md` `R1.30`~`R1.33` | read | 提供配置影响会落在哪些处理流和哪些运行路径。 |
| Step 9 | `02_hld_step_09_state_machine.md` `R1.29`~`R1.31` | read | 提供不可配置化的状态机红线和 Step 10 承接口径。 |
| Step 10 | `02_hld_step_10_exceptions_boundaries.md` `R1.24`~`R1.27` | read | 提供正式 §10 草稿、全局红线和 Step 11 重审前提。 |
| 下游依赖 | `02_hld_step_12_detailed_design_handoff.md` | read | 仅确认 Step 12 仍需等待 Step 11 完成后再重审。 |
| 参考框架 | `projects/L1-governance/design-calibration/02_hld_step_11_configuration_impact.md` | read | 只参考 Step 11 的章节粒度、来源池组织、禁止配置化边界和停审结构。 |

#### R1.2.3 输入基线确认

| 输入 | 当前可用结论 | Step 11 使用方式 |
|---|---|---|
| Step 5 八个主要组成部分 | 已完成并回填正式 §5。 | 作为配置影响主语分组、后续逐模块小循环和禁止配置化边界的反查入口。 |
| Step 6 关键对象 | 已完成并回填正式 §6;`8.45` 已关闭。 | 配置影响必须回指 truth / view / material / task / history / lineage / progress / peripheral 等正式对象。 |
| Step 7 接口骨架 | 已完成并回填正式 §7;`R1.45` 已记录。 | 配置影响必须回指 Command、Query、Inbound、Outbound 或 Job 的正式入口类别。 |
| Step 8 处理流 | 已完成并回填正式 §8;`R1.33` 已记录。 | 配置影响必须回指处理流中的运行装配、外部接缝、降级路径和不允许私补的边界。 |
| Step 9 状态机 | 已完成并回填正式 §9;`R1.31` 已记录。 | 配置不得改写状态 owner、允许 / 禁止迁移和传播红线。 |
| Step 10 异常与边界场景 | 已完成并回填正式 §10;`R1.27` 已记录。 | 配置影响必须服从 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心。 |
| 正式 §11 | 仍为旧 Step 11 在旧 Step 10 前提下回填的正文。 | 仅作差异审计对象,不得作为本轮配置影响来源。 |

#### R1.2.4 旧 Step 11 降级声明

本文件上方既有内容和正式 §11 旧正文全部降级为 historical material。具体裁决如下:

| 旧配置主线 / 旧前提 | 本轮裁决 | 说明 |
|---|---|---|
| 旧 Step 11 默认承接旧 Step 10 | 不继承 | 当前 Step 10 已按六个异常族重写,Step 11 必须先服从新的异常红线。 |
| delivery / relay / retry / dead letter 容易被提升为配置主轴 | 不作为当前主线 | 当前只能把 transport / publication 参数视为外围接缝影响,不得恢复 delivery 主线。 |
| maintenance / refresh / recovery 容易被写成 truth 修复开关 | 不继承 | 当前只能讨论 maintenance 配置对派生材料、progress 和收敛节奏的影响。 |
| body-free / external boundary 被弱化成 adapter 配置问题 | 不继承 | 当前只能作为禁止配置化边界,不得写成可放宽项。 |
| 旧正式 §11 已完成可直接进入 Step 12 | 全部降级 | 本轮 Step 11 必须重开,Step 12 继续被阻断。 |
| 旧 completed 状态 | 不继承 | 本轮只保留为差异审计对象,不得作为当前 gate 通过依据。 |

#### R1.2.5 Step 内模块计划

| 序号 | 模块 | 状态 | 输出 | next_allowed_action |
|---:|---|---|---|---|
| 1 | 开工与必读文档:先思考 | done | `R1.1` 已固定恢复点、旧材料降级、必读候选、来源池初筛和 Step 内执行框架。 | 进入再写入。 |
| 2 | 开工与必读文档:再写入 | done | `R1.2` 已写当前文件头、必读表、输入基线、旧材料降级声明和模块计划。 | 等待进入 L1-governance 框架对齐:先思考。 |
| 3 | L1-governance 框架对齐:先思考 / 再写入 | done | `R1.3` / `R1.4` 已完成可复用框架、禁止复制语义、整体骨架、单模块模板和按需图门禁。 | 进入配置影响来源池:先思考。 |
| 4 | 配置影响来源池:先思考 / 再写入 | done | `R1.5` / `R1.6` 已完成筛选规则、分类框架、主语池、排除清单和后续模块映射。 | 进入核心组成部分间接受影响:先思考。 |
| 5 | 核心组成部分间接受影响:先思考 / 再写入 | done | `R1.7` / `R1.8` 已完成间接受影响判定规则、四个核心组成部分的间接受影响表、合法间接路径和排除口径。 | 等待进入入口 / adapter / transport / job 直接影响:先思考。 |
| 6 | 入口 / adapter / transport / job 直接影响:先思考 / 再写入 | done | `R1.9` / `R1.10` 已完成 direct seam 判定规则、直接影响表、影响类型分类、红线约束和排除口径。 | 等待进入 Query / visibility / degraded 配置边界:先思考。 |
| 7 | Query / visibility / degraded 配置边界:先思考 / 再写入 | done | `R1.11` / `R1.12` 已完成 Query 判定规则、read surface 配置影响表、visibility / degraded 语义和红线约束。 | 等待进入 body-free / publication / peripheral 配置边界:先思考。 |
| 8 | body-free / publication / peripheral 配置边界:先思考 / 再写入 | done | `R1.13` / `R1.14` 已完成 body-free / publication / peripheral 判定规则、配置影响表、红线约束和分流口径。 | 等待进入禁止配置化边界:先思考。 |
| 9 | 禁止配置化边界:先思考 / 再写入 | done | `R1.15` / `R1.16` 已完成 formal forbidden 判定规则、候选表、易误判项排除表和分流说明。 | 等待进入 `03 / 04` 承接边界:先思考。 |
| 10 | `03 / 04` 承接边界:先思考 / 再写入 | done | `R1.17` / `R1.18` 已完成 03 / 04 分工规则表、承接主题表、排除表和边界说明。 | 等待进入旧材料差异审计:先思考。 |
| 11 | 旧材料差异审计:先思考 / 再写入 | done | `R1.19` / `R1.20` 已完成旧材料差异审计表、分类表和后续剔除 / 改写动作表。 | 等待进入正式 §11 回填草稿:先思考。 |
| 12 | 正式 §11 回填草稿:先思考 / 再写入 | done | `R1.21` / `R1.22` 已完成回填草稿框架、直接沿用项、必须改写项和最小改动面说明。 | 等待进入自检与停审:先思考。 |
| 13 | 自检与停审:先思考 / 再写入 | done | `R1.23` / `R1.24` 已完成 Step 11 完成门禁自检、正式 `§11` 可回填判断、Step 12 放行判断、停审裁决和 flow / 台账推进建议。 | 进入正式 §11 回填记录:再写入。 |
| 14 | 正式 §11 回填记录:再写入 | done | `R1.25` 已完成正式 `§11` 回填动作记录、回填后检查、后续风险保留和最终裁决。 | 等待进入 Step 12 开工与必读文档:先思考。 |

#### R1.2.6 下一模块边界

当前 `R1.2` 完成后,下一动作必须等待用户确认再进入 Step 11 `L1-governance 框架对齐:先思考`。

下一模块只允许回答:

1. L1-governance 的 Step 11 框架里,哪些章节粒度和模块顺序可以复用。
2. 哪些候选池组织方法、禁止配置化边界组织法和停审结构值得借用。
3. 哪些 governance 领域语义、治理审批、policy / control 语义必须明确排除。
4. L3-method-library 的 Step 11 后续模块,哪些地方需要比 governance 更强调 body-free、candidate / delivery、maintenance 和 peripheral 边界。

下一模块不得写:

- 本仓配置影响轮廓表正文
- 禁止配置化边界表正文
- `03 / 04` 承接正文
- 正式 §11 回填草稿
- 正式 `02-概要设计.md`

#### R1.2.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入必读文档表 | pass | 已记录项目台账、flow、SOP、书写规范、中间产物规范、真相源闭环标准、当前正式文档、需求 / 架构边界、Step 4~10 和参考框架。 |
| 是否确认输入基线 | pass | 已明确 Step 5~10 和正式 §5~§10 为当前来源,正式 §11 只作污染审计对象。 |
| 是否降级旧 Step 11 | pass | 已明确旧 completed 状态、delivery 主线、job 修 truth 和 body-free 放宽假设不继承。 |
| 是否搭好 Step 内模块计划 | pass | 已把 Step 11 拆成 13 个受控模块,并固定后续顺序。 |
| 是否写配置影响正文 | no | 本模块未写配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 开工阶段之后。 |

next_allowed_action: 等待用户确认后进入 Step 11 `L1-governance 框架对齐:先思考`;只参考 L1-governance 的 Step 11 框架、候选池组织、禁止配置化边界组织方式和停审结构,不得复制 governance 领域语义,不得写本仓配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.3 L1-governance 框架对齐:先思考

#### R1.3.1 本模块问题

本模块只抽象 L1-governance Step 11 的写作框架,用于约束 L3-method-library 后续配置影响模块的深度、顺序和输出形状。它不复制 governance 的领域对象、治理语义、接缝命名或旧 completed 结论。

需要回答:

1. L1-governance 的 Step 11 哪些章节粒度和收口方式可以复用到 L3。
2. 哪些 governance 语义必须明确排除,避免污染 method-library 当前 Step 11。
3. L3 Step 11 后续应采用怎样的“执行层 + 装配层”双层骨架。
4. 哪些内容必须留到 `L1-governance 框架对齐:再写入`,哪些内容仍不得提前写成 L3 的配置影响正文。

#### R1.3.2 governance Step 11 框架观察

L1-governance 的 Step 11 虽然是旧 completed 文件,但它的最终章节收口方式仍可作为框架参照。当前可观察到的框架元素如下:

| 框架元素 | governance 做法 | L3 可借鉴点 |
|---|---|---|
| 本步目标 / 本步输入 | 先交代本步只识别配置影响与禁止配置化边界,再列输入来源。 | L3 也应先固定“只识别轮廓、不写配置项”的边界,并明确承接 Step 5~10。 |
| SOP 问题先回答 | 先回答谁受配置影响、谁只间接受影响、哪些边界禁止配置化、哪些契约交给 03 / 04。 | L3 后续也应先收稳“直接影响 / 间接受影响 / 禁止配置化 / 承接去向”四类问题。 |
| 配置影响轮廓表 | 用单张主表压缩主要部分 / 接缝、影响类型和 03 承接方向。 | L3 正式收口时也应以主表压缩,但不能在当前模块提前写表正文。 |
| 禁止配置化边界表 | 独立列出原因和“若需改变应回到哪里”。 | L3 必须复用这种独立边界表组织法,因为 Step 10 红线需要显式回指。 |
| 配置影响轮廓图（按需） | 用一张极简图表达配置影响落点。 | L3 可以借“按需画图”机制,但不能默认必须有图。 |
| 03 / 04 承接说明 | 将 config ownership、validation、injection、adapter config 等交给 03 / 04。 | L3 也要保留“03 闭合实现契约 / 04 说明配置项”的承接拆分。 |
| 配置细节后移 | 明确 key、默认值、env、产品参数等不在本步展开。 | L3 应继续保持“不写 key / 默认值 / schema / RuntimeConfig 字段”的收口方式。 |
| 问题诊断 / 改动前后 / 设计取舍 | 对旧材料做诊断,说明为什么要这样改。 | L3 需要保留旧 Step 11 / 旧正式 §11 的污染审计与取舍说明。 |
| 回填草稿 / 进入下一步条件 | 在正式装配前先给摘录方向和完成门禁。 | L3 也应在正式 §11 回填前先做草稿和停审,不能跳过中间层。 |

当前判断:

1. governance 的最终收口章节顺序值得借,因为它满足 SOP 和书写规范的正式章节要求。
2. governance 的执行方式偏“一次性完整收口”,这一点不能直接照搬到 L3;L3 当前必须继续使用模块化、小门禁推进。
3. 因此 L3 Step 11 应区分“执行层模块推进”和“最终正式装配结构”两层,不能把两者混成一步。

#### R1.3.3 可迁移到 L3 的双层骨架

建议 L3 Step 11 后续采用“双层骨架”:

| 层次 | 作用 | L3 当前采用方式 |
|---|---|---|
| 执行层 | 解决讨论过程如何拆模块、如何逐批收敛。 | 继续按 `R1.2.5` 的 13 个模块推进,每个模块先思考、再写入。 |
| 装配层 | 解决正式 `§11` 最终长成什么形状。 | 最终压缩为配置影响轮廓表、禁止配置化边界表、按需图、`03 / 04` 承接说明、差异诊断与回填草稿。 |

这意味着:

1. governance 可借的是装配层骨架,不是它的一次性执行节奏。
2. L3 当前模块化执行,最终仍要回收成 SOP 要求的正式 `§11` 形状。
3. 后续每个 L3 模块都要服务于装配层某一块,避免讨论到最后无法压缩回主表和边界表。

#### R1.3.4 禁止复制的 governance 语义清单

以下语义只属于 governance,不得进入 L3 Step 11:

| governance 语义 | L3 禁止原因 | L3 替代口径 |
|---|---|---|
| governance truth core / gate / decision / approval / responsibility | 本仓不拥有治理裁决 truth 或审批责任语义。 | 改为 method asset definition、formalization、consumption、trace、relation、external summary、maintenance、peripheral 的配置影响。 |
| policy / shared rules / control / compliance / nonconformity 配置主线 | 属于治理专属闭环。 | 改为 body-free、boundary guard、consistency protection、maintenance progress、peripheral isolation 的配置边界。 |
| outbox / bus / retry / dead-letter 作为配置主轴 | 当前 L3 只保留 event candidate,不闭口 delivery 主线。 | 只保留 publication / handoff / collaboration 接缝影响,不得恢复 delivery 中心化叙述。 |
| external GRC / dashboard / report 作为正式主输出面 | 不符合本仓当前主目标。 | 改为 read material、safe diagnostic、maintenance report root、peripheral discovery。 |
| 具体 DB / queue / cache / search / object store / bus 产品参数 | 这是 04 / 07 才会关心的实现或部署层内容。 | 当前只保留 adapter / transport / runtime seam 的概要影响。 |
| operator approval / config evidence / change control 具体流程 | 对当前 L3 Step 11 来说过细,且会提前下沉到 03/04/07。 | 只保留“交给 03 / 04 闭合”的承接方向。 |

#### R1.3.5 L3 Step 11 后续整体骨架

结合 governance 的装配层结构和 L3 当前 `R1.2.5` 模块计划,后续整体骨架建议如下:

| 顺序 | 模块 | 对应最终装配位置 |
|---:|---|---|
| 1 | 配置影响来源池 | 为最终配置影响轮廓表筛主语和排除项。 |
| 2 | 核心组成部分间接受影响 | 为主表中的“间接受影响”行提供依据。 |
| 3 | 入口 / adapter / transport / job 直接影响 | 为主表中的“直接受配置影响”行提供依据。 |
| 4 | Query / visibility / degraded 配置边界 | 为主表和禁止配置化边界表提供读取面边界依据。 |
| 5 | body-free / publication / peripheral 配置边界 | 为主表和禁止配置化边界表提供外围接缝与 body-free 边界依据。 |
| 6 | 禁止配置化边界 | 直接沉淀正式 §11 的禁止配置化边界表。 |
| 7 | `03 / 04` 承接边界 | 沉淀正式 §11 的详细设计 / 配置说明承接说明。 |
| 8 | 旧材料差异审计 | 为问题诊断、改动前后和取舍提供污染审计依据。 |
| 9 | 正式 §11 回填草稿 | 将前述模块压缩为正式章节草稿。 |
| 10 | 自检与停审 | 判断 Step 11 是否完成、是否允许回填和进入 Step 12。 |

#### R1.3.6 后续单模块模板

后续每个 Step 11 模块建议按同一模板推进:

| 子段 | 固定输出 | 必须避免 |
|---|---|---|
| 先思考 | 配置影响主语范围、直接 / 间接判断、红线约束、排除项。 | 直接写正式主表正文。 |
| 再写入:主结论 | 主要部分 / 接缝、是否受影响、影响类型、为什么概要层需要点名。 | 写 key、默认值、schema、env、constructor 参数。 |
| 再写入:边界提示 | 哪些影响只能间接发生,哪些属于禁止配置化边界。 | 把运行参数写成业务规则。 |
| 再写入:承接提示 | 哪些契约交给 03,哪些说明交给 04。 | 直接写 03 / 04 正文。 |
| 停审 | 越界检查、旧材料污染检查、下一模块边界。 | 直接修改正式 `02-概要设计.md`。 |

#### R1.3.7 配置影响图触发门禁

Step 11 的配置影响图仍然是“按需”,不是默认必画。建议后续只在同时满足以下条件时才画:

| 门禁 | 要求 |
|---|---|
| 跨结构影响明显 | 需要同时表达核心组成部分、入口 / adapter / job、Query 边界和外围接缝之间的配置影响关系。 |
| 表格不足 | 只靠主表和边界表无法说明“配置只影响哪里、不影响哪里”的结构感。 |
| 图可保持概要层 | 图里不需要写 key、默认值、密钥、部署挂载、热更新流程或具体产品参数。 |
| 红线清楚 | 图只能表达 direct / indirect / forbidden / handoff 关系,不能变成实现时序图。 |

如果以上门禁不能同时满足,Step 11 默认只保留主表、边界表和短文说明。

#### R1.3.8 当前取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否照搬 governance 的一次性完成式写法 | no | L3 当前明确要求模块化推进、逐门禁收口。 |
| 是否复用 governance 的最终章节顺序 | yes_with_adaptation | 该顺序符合 SOP / 书写规范,但执行层仍按 L3 当前模块拆分。 |
| 是否默认必须画配置影响图 | no | SOP 和书写规范都规定“按需”,不应为了形式强行补图。 |
| 是否固定“直接影响 / 间接受影响 / 禁止配置化 / 03-04 承接”四层判断 | yes | 这是 governance 框架中最稳定、也最适合 L3 的抽象层次。 |
| 是否现在就写 L3 具体配置影响轮廓表 | no | 当前模块只做框架思考,具体主语和边界留给后续小循环。 |

#### R1.3.9 下一写入批次边界

下一批 `L1-governance 框架对齐:再写入` 只允许写:

1. governance 可复用框架清单。
2. L3 禁止复制的 governance 语义清单。
3. L3 Step 11 后续整体骨架。
4. Step 11 单模块模板。
5. 配置影响图触发门禁。
6. 停审记录和下一模块边界。

不得写:

- 本仓配置影响轮廓表正文
- 禁止配置化边界表正文
- `03 / 04` 承接正文
- 正式 §11 回填草稿
- 正式 `02-概要设计.md`

#### R1.3.10 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做框架先思考 | pass | 只抽象 governance Step 11 的框架与 L3 适配方式。 |
| 是否复制 governance 领域语义 | no | 未把 gate / decision / policy / control / nonconformity 等语义迁入 L3。 |
| 是否固定了装配层骨架 | pass | 已明确主表、边界表、按需图和 `03 / 04` 承接说明的最终收口方向。 |
| 是否保留了模块化执行层 | pass | 已明确不能照搬 governance 的一次性收口执行方式。 |
| 是否写 L3 配置影响正文 | no | 未写 L3 的配置影响轮廓表、禁止配置化边界表或承接正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 框架对齐阶段。 |

next_allowed_action: 等待用户确认后进入 Step 11 `L1-governance 框架对齐:再写入`;只写可复用框架清单、禁止复制语义清单、L3 后续整体骨架、单模块模板、配置影响图触发门禁和停审记录,不得写本仓配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.4 L1-governance 框架对齐:再写入

#### R1.4.1 可复用框架清单

L1-governance Step 11 中可复用于本仓的是“正式装配骨架”和“边界收口方式”,不是治理领域内容。

| 可复用框架 | L3 当前采用方式 |
|---|---|
| 本步目标先收窄 | 先明确 Step 11 只识别配置影响轮廓、禁止配置化边界和 `03 / 04` 承接方向。 |
| 本步输入显式列出 | 后续每个配置影响模块都必须能回指 Step 5~10 当前结论,不得临时发明新主语。 |
| SOP 问题先回答 | 先回答谁直接受影响、谁间接受影响、哪些边界禁止配置化、哪些契约交给 03 / 04。 |
| 主表压缩收口 | 最终正式 §11 仍应回收成配置影响轮廓主表,而不是保留模块化碎片。 |
| 禁止配置化边界独立成表 | Step 10 红线和 Step 9 状态机红线需要在 Step 11 被单独收口,不能混在正文里。 |
| 图按需而非强制 | 只在结构感不足时补极简图,不为了形式固定出图。 |
| `03 / 04` 承接说明独立陈述 | 详细设计契约和配置说明边界必须分开写,避免混成正文。 |
| 旧材料诊断 / 取舍 / 回填草稿分离 | 污染审计、取舍说明、回填草稿和停审必须分段处理,不能一步跳到正式装配。 |
| 完成门禁后再允许回填 | 正式 §11 回填必须在所有模块收稳后进行,不能靠中途小结提前回填。 |

#### R1.4.2 禁止复制的 governance 语义清单

以下 governance 语义不得进入 L3-method-library Step 11:

| governance 语义 | L3 禁止原因 | L3 替代口径 |
|---|---|---|
| governance truth core / gate / decision / approval / responsibility | 本仓不拥有治理裁决 truth 和审批职责结构。 | 改为 method asset definition、formalization、consumption、trace、relation、external summary、maintenance、peripheral 的配置影响。 |
| policy / shared rules / control / compliance / nonconformity 的配置主线 | 属于治理专属闭环。 | 改为 body-free、boundary guard、consistency protection、maintenance progress、peripheral isolation 的配置边界。 |
| outbox / bus / retry / dead-letter 作为配置章节中心 | 当前 L3 只保留 event candidate,不把 delivery 做成概要主线。 | 只保留 publication / handoff / collaboration 接缝影响。 |
| dashboard / external GRC / report export 作为主要对外交付面 | 不符合本仓当前主目标。 | 改为 read material、safe diagnostic、maintenance report root、peripheral discovery 等只读 / 外围面。 |
| RuntimeConfig / ConfigError / adapter constructor 的类型化闭口 | 这已经下沉到 03 / 04 / 07。 | 当前只保留配置实现契约方向和说明边界。 |
| 具体产品参数、密钥、网络、变更审批 / evidence 细节 | 过早下沉到配置说明、部署或实施计划。 | 当前只保留“哪些内容后移”的承接口径。 |

#### R1.4.3 L3 Step 11 后续整体骨架

本轮 Step 11 后续按以下整体骨架推进:

| 顺序 | 模块 | 输出 |
|---:|---|---|
| 1 | 配置影响来源池 | 配置影响主语筛选规则、候选来源、排除项和后续模块映射。 |
| 2 | 核心组成部分间接受影响 | 哪些核心组成部分只能被间接受配置影响、不得直接读配置。 |
| 3 | 入口 / adapter / transport / job 直接影响 | entry、adapter、consumer、publisher、job 的直接配置影响轮廓。 |
| 4 | Query / visibility / degraded 配置边界 | 读取面、visibility、degraded surface 的配置影响边界。 |
| 5 | body-free / publication / peripheral 配置边界 | body-free、candidate / delivery、外围增强和 discovery 的配置边界。 |
| 6 | 禁止配置化边界 | 正式沉淀禁止配置化边界表。 |
| 7 | `03 / 04` 承接边界 | 明确哪些实现契约交给 03,哪些配置说明交给 04。 |
| 8 | 旧材料差异审计 | 旧 Step 11 和正式旧 §11 的污染审计。 |
| 9 | 正式 §11 回填草稿 | 形成可回填草稿,不直接修改正式文档。 |
| 10 | 自检与停审 | 判断 Step 11 是否可关闭、可回填、可进入 Step 12。 |

#### R1.4.4 Step 11 单模块模板

后续每个 Step 11 模块按同一模板执行:

| 子段 | 固定输出 | 必须避免 |
|---|---|---|
| 先思考 | 配置影响主语范围、直接 / 间接判断、Step 10 红线约束、排除项。 | 直接写正式主表或正式边界表正文。 |
| 再写入:主结论 | 主要部分 / 接缝、是否受影响、影响类型、为什么概要层需要点名。 | 写 key、默认值、schema、env 名、RuntimeConfig 字段或 constructor 参数。 |
| 再写入:边界提示 | 哪些影响只能间接发生,哪些属于禁止配置化边界。 | 把运行参数写成业务规则或状态机例外。 |
| 再写入:承接提示 | 哪些契约交给 03,哪些说明交给 04。 | 直接写 03 / 04 正文。 |
| 停审 | 越界检查、旧材料污染检查、下一模块边界。 | 直接修改正式 `02-概要设计.md`。 |

#### R1.4.5 配置影响图触发门禁

Step 11 的配置影响图只有在以下门禁同时满足时才允许补:

| 门禁 | 要求 |
|---|---|
| 跨结构影响明显 | 需要同时表达核心组成部分、入口 / adapter / job、Query 边界和外围接缝之间的配置影响关系。 |
| 表格不足 | 只靠主表和边界表无法清楚说明“配置影响哪里 / 不影响哪里”的结构感。 |
| 图可保持概要层 | 图中不需要写 key、默认值、密钥、部署挂载、热更新或具体产品参数。 |
| 红线可压缩表达 | 图里只表达 direct / indirect / forbidden / handoff 关系,不变成实现时序或部署图。 |

如果以上门禁不能同时满足,Step 11 默认只保留主表、边界表和短文说明。

#### R1.4.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成框架清单 | pass | 已定稿可复用的 Step 11 正式装配骨架。 |
| 是否明确禁止复制语义 | pass | 已排除 governance 的 gate、decision、policy、control、nonconformity、delivery 中心化和产品参数语义。 |
| 是否给出 L3 后续整体骨架 | pass | 已把 Step 11 后续拆成 10 个受控模块。 |
| 是否给出单模块模板 | pass | 已固定先思考、主结论、边界提示、承接提示和停审结构。 |
| 是否给出配置影响图门禁 | pass | 已明确按需出图的四个前提条件。 |
| 是否写本仓配置影响正文 | no | 未写配置影响轮廓表、禁止配置化边界表或 `03 / 04` 承接正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 框架对齐之后。 |

#### R1.4.7 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `配置影响来源池:先思考`。

下一模块只允许回答:

1. 当前 Step 5~10 下,哪些主要部分、正式对象、入口、处理流或状态边界有资格成为配置影响主语。
2. 这些配置影响主语分别属于核心间接受影响、运行接缝直接影响、读取面边界、body-free / publication 边界还是外围影响。
3. 哪些候选只属于 03 / 04 / 07、实现态、部署态或旧材料污染,不得进入概要 Step 11。

下一模块不得写:

- 本仓配置影响轮廓表正文
- 禁止配置化边界表正文
- `03 / 04` 承接正文
- 正式 §11 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 11 `配置影响来源池:先思考`;只思考配置影响主语范围、分类框架、来源池、排除项和后续模块映射,不得写本仓配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.5 配置影响来源池:先思考

#### R1.5.1 本模块问题

本模块只回答“哪些主要部分、正式对象、入口、处理流或状态边界有资格成为 Step 11 的配置影响主语或影响面”。它不回答配置影响轮廓表正文、禁止配置化边界表正文、`03 / 04` 承接正文或正式 §11 草稿。

需要先把配置影响来源池筛清楚,原因有四点:

1. 当前 Step 5~10 已经点名大量 truth、read material、boundary、task、progress、history 和 peripheral 对象,但并非所有对象都值得进入 Step 11 配置影响讨论。
2. Step 11 讨论的是“哪些概要层结构会受配置影响”,不是“会有哪些配置项”;如果不先筛主语,很容易把 key、默认值、产品参数误写成第一主语。
3. Step 10 已经固定 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心,因此配置影响主语必须先经过这些红线过滤。
4. 旧 Step 11 和 governance Step 11 都容易把 adapter、transport、report、delivery 或治理语义直接拉成配置主线;本轮必须先避免这些污染。

#### R1.5.2 配置影响主语筛选规则

候选进入 Step 11 配置影响来源池,至少需要同时满足以下条件:

| 规则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 有 Step 5 / Step 6 主语归属 | 能回指主要组成部分、truth / state object、view / material、boundary、task / progress 或 peripheral 对象。 | 只作为局部说明、实现细节或 03 / 04 内部内容。 |
| 有 Step 7 / Step 8 触发来源 | 能回指 Command、Query、Inbound intake、Outbound candidate / handoff 或 Operations Job / refresh / recovery。 | 不进入 Step 11 配置影响讨论。 |
| 会改写概要层理解 | 会影响运行装配、外部接缝、读取面、降级 surface、维护收敛节奏或外围隔离边界。 | 降级为实现级参数、测试细节或部署细节。 |
| 主语优先而非配置项优先 | 讨论的是“谁受影响 / 哪里受影响”,不是具体 key、默认值、env 名、schema 或字段。 | 后移到 03 / 04 / 07。 |
| 不穿透全局红线 | 不得让配置改变 truth owner、状态机、审计链、事务一致性、body-free 边界或外围隔离边界。 | 进入后续“禁止配置化边界”候选,而不是普通配置影响候选。 |
| 不复制治理或产品语义 | 不保存 governance truth、delivery 主线、具体产品参数、密钥 / 网络细节或运维机制。 | 排除出 Step 11 来源池。 |

#### R1.5.3 配置影响分类框架

本轮 Step 11 的配置影响来源池先按五类筛选,后续再逐模块展开:

| 分类 | 典型结果 | 当前判断重点 |
|---|---|---|
| 核心组成部分间接受影响 | indirect / injected / bounded by validated input | 哪些核心组成部分会被运行装配或已校验输入间接影响,但不得直接读配置。 |
| 入口 / adapter / transport / job 直接影响 | enablement / target selection / batch / timeout / schedule / cursor / adapter seam | 哪些接缝和运行承载需要直接承接配置。 |
| Query / visibility / degraded 边界 | page / read strategy / consistency hint / stale / unavailable / degraded surface | 哪些读取面允许受配置影响,以及哪些边界绝不能被放宽。 |
| body-free / publication / peripheral 边界 | source allowlist / summary-only / candidate transport / peripheral isolation | 哪些配置只影响外部接缝、传播接缝和外围组织,不得越界进核心。 |
| 禁止配置化候选 | invariant / state redline / audit / consistency / security gate | 哪些结构只能进入后续禁止配置化边界表,不能当普通配置影响。 |

#### R1.5.4 初步配置影响主语池判断

以下只是配置影响主语候选池,不是配置影响轮廓表正文。

| 组成部分 | 强候选配置影响主语 | 主要分类 | 弱候选 / 待后续判断 | 当前排除 |
|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetCatalogView`;definition ref resolution boundary | 核心组成部分间接受影响;Query / visibility / degraded 边界 | catalog search hint / diagnostic view | UI 分类、旧 plugin / configuration、搜索实现细节。 |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | 核心组成部分间接受影响;body-free 边界 | formal read material freshness | fingerprint、schema/version 算法、发布流水线实现。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | Query / visibility / degraded 边界;禁止配置化候选 | downstream safe diagnostic | 下游运行状态、授权引擎、snapshot export。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | 核心组成部分间接受影响;Query / visibility / degraded;禁止配置化候选 | operator diagnostic surface | raw log、report body、telemetry runtime 状态。 |
| 关系与分发语义 | `MethodAssetRelation`;`DistributionReadMaterial`;`RelationIntegrityRule`;distribution / handoff hint | 核心组成部分间接受影响;body-free / publication / peripheral 边界;Query / degraded | discovery ranking hint | runtime dependency graph、marketplace listing / install。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalInboundIntakeFlow` | body-free / publication / peripheral 边界;Query / degraded;禁止配置化候选 | external summary freshness view | 外部正文 payload、artifact body/archive content、外部 API 细节。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`RefreshScopeRef` | 入口 / adapter / transport / job 直接影响;Query / degraded | maintenance run history visibility | scheduler、queue、worker、retry、lock、cron。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageView`;`MethodSetAssemblyView` | body-free / publication / peripheral 边界;Query / degraded;禁止配置化候选 | external package context ref | marketplace transaction/order/install/fulfillment、组织级运行配置细节。 |

#### R1.5.5 触发来源与影响面交叉判断

后续配置影响来源池必须同时看主语和触发来源,避免把只读边界误写成运行承载配置,或把 deployment 参数误写成业务主语:

| 触发来源 | 可能产生的配置影响分类 | 必须避免 |
|---|---|---|
| Runtime builder / adapter assembly | 核心组成部分间接受影响;入口 / adapter / transport / job 直接影响 | 不把 builder 细节、constructor、依赖注入实现本身写成业务主语。 |
| Command intake | 核心组成部分间接受影响;禁止配置化候选 | 不把 config 说成可以放宽 basis / boundary / illegal transition 红线。 |
| Query intake | Query / visibility / degraded 边界 | Query 不得因配置而变成 refresh、repair 或 truth write 路径。 |
| Inbound / external intake | body-free / publication / peripheral 边界;禁止配置化候选 | 不把 inbound 到达等同于 formalization 成立、relation 成立或外围 truth 成立。 |
| Outbound candidate / handoff | body-free / publication / peripheral 边界 | 不恢复 delivery / relay / retry / dead-letter 主线。 |
| Operations Job / refresh / recovery | 入口 / adapter / transport / job 直接影响;Query / degraded;禁止配置化候选 | Job 不得因配置而变成 core truth 修复器。 |

#### R1.5.6 当前取舍诊断

本轮不应把所有“与运行有关的内容”都升级成配置影响主线。建议后续按以下取舍推进:

| 取舍 | 当前判断 | 后续写入要求 |
|---|---|---|
| 每个主要组成部分是否都直接受配置影响 | no | 核心组成部分多数只能间接受影响,不得写成直接读配置。 |
| Query / visibility 是否可并入 adapter 配置 | no | 需要单独保留读取面和 degraded 边界,否则容易掩盖 Query no-write。 |
| body-free / publication / peripheral 是否要提前拆成三个独立主表 | partial_no | 当前来源池阶段先合并观察外部接缝与外围隔离,正文阶段再按边界重点拆开。 |
| maintenance 配置是否等于 truth repair 开关 | no | 只能讨论刷新范围、收敛节奏、progress surface,不得变成修 truth 的开关。 |
| forbidden 候选是否也应先进入来源池 | yes_limited | 可以作为“后续禁止配置化边界表”的来源线索,但当前不写正式边界表。 |
| 外围 package / set 是否可成为核心前置 | no | 只能讨论外围增强和隔离,不得让外围失效反向污染核心闭环。 |

#### R1.5.7 排除口径

以下候选不得进入当前 Step 11 配置影响来源池:

| 排除项 | 排除原因 | 后续位置 |
|---|---|---|
| key / env / 默认值 / 单位 / 文件格式 | 这是配置项本身,不是概要层受影响主语。 | `04-配置设计.md` |
| `RuntimeConfig` / `ConfigError` / loader / validator / builder 具体类型 | 已下沉到实现契约层。 | `03-详细设计.md` |
| DB / queue / cache / search / object store / bus / archive 产品参数 | 属于产品和部署细节。 | `04-配置设计.md`;`07-实施计划.md` |
| secret / token / cert / URL / network / mount / systemd / container 参数 | 属于安全和部署实现。 | `04-配置设计.md`;实施材料 |
| hot reload / rollout / change approval / config evidence 具体流程 | 过早下沉到变更控制和实施层。 | `03` / `04` / `07` |
| governance truth、approval、policy、control、nonconformity 主线 | 不属于本仓领域。 | 留在 governance 或外部系统 |
| delivery / relay / retry / dead-letter 主线 | 当前只保留 event candidate 与 handoff 边界。 | 若需要,后置 03 / 04 / 07 |
| fake runtime、私有 map、测试夹具状态 | 不是设计真相源。 | 不进入正式设计 |

#### R1.5.8 下一写入批次边界

下一批 `配置影响来源池:再写入` 只允许把本模块思考收敛为:

1. 配置影响主语筛选规则定稿。
2. 配置影响分类框架定稿。
3. 配置影响主语候选池表。
4. 排除清单定稿。
5. 后续模块映射。
6. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. 禁止配置化边界表正文。
3. `03 / 04` 承接正文。
4. 正式 §11 回填草稿。
5. 正式 `02-概要设计.md`。

#### R1.5.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只定义配置影响主语筛选规则、分类框架和排除口径。 |
| 是否把配置项当主语 | no | 未写 key、默认值、env、产品参数或 RuntimeConfig 字段。 |
| 是否继续服从 Step 10 红线 | pass | 已把 Query no-write、Job 不修 truth、body-free 不可绕过和外围不污染核心纳入筛选规则。 |
| 是否恢复 governance / 旧 Step 11 主线 | no | 已继续排除 governance truth、delivery 主线和产品化参数叙述。 |
| 是否写配置影响轮廓表正文 | no | 本模块只写来源池,未写正式主表或边界表。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍在 Step 11 来源池模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `配置影响来源池:再写入`;只写筛选规则、分类框架、候选池表、排除清单、后续模块映射和停审记录,不得写本仓配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.6 配置影响来源池:再写入

#### R1.6.1 配置影响主语筛选规则定稿

Step 11 配置影响主语候选必须同时满足以下规则,否则不得进入后续模块小循环:

| 规则 | 定稿口径 | 后续检查 |
|---|---|---|
| 来源闭合 | 必须能回指 Step 5 / Step 6 当前主要组成部分、truth / state object、view / material、boundary、task / progress 或 peripheral 对象。 | 后续每个模块必须写 `配置影响主语 -> Step 5/6 来源`。 |
| 触发闭合 | 必须能回指 Step 7 / Step 8 的 Command、Query、Inbound intake、Outbound candidate / handoff 或 Operations Job / refresh / recovery。 | 不得从自由推理、部署细节或实现私有机制补主语。 |
| 概要可见 | 必须会改写运行装配、读取面、外部接缝、降级 surface、维护收敛节奏或外围隔离边界。 | 只影响错误消息、测试参数或局部实现分支的内容不得进入 Step 11。 |
| 主语优先 | 讨论对象是“谁受影响 / 哪里受影响”,不是 key、默认值、env、schema、字段或产品参数。 | 配置项本身后置到 03 / 04 / 07。 |
| 红线不过线 | 不得让配置改变 truth owner、状态机、审计链、事务一致性、body-free 边界或外围隔离边界。 | 若触碰这些边界,必须转入后续“禁止配置化边界”候选。 |
| 非治理 / 非产品参数 | 不复制 governance truth、delivery 主线、产品参数、密钥 / 网络细节或运维机制。 | 这些内容排除出 Step 11 来源池。 |

#### R1.6.2 配置影响分类框架定稿

后续配置影响讨论按以下五类展开,不得混写成“一个总配置章节”:

| 分类 | 典型结果 | 写入要求 |
|---|---|---|
| 核心组成部分间接受影响 | indirect / injected / bounded by validated input | 只讨论哪些核心组成部分会被已校验输入或运行装配间接影响,不得写成直接读配置。 |
| 入口 / adapter / transport / job 直接影响 | enablement / target selection / batch / timeout / schedule / cursor / adapter seam | 只讨论运行承载和外部接缝的直接配置影响。 |
| Query / visibility / degraded 边界 | page / read strategy / consistency hint / stale / unavailable / degraded surface | 只讨论读取面和降级面配置影响,并明确 Query no-write。 |
| body-free / publication / peripheral 边界 | source allowlist / summary-only / candidate transport / peripheral isolation | 只讨论外部接缝、传播接缝和外围隔离配置影响,不得越界进入核心。 |
| 禁止配置化候选 | invariant / state redline / audit / consistency / security gate | 只作为后续禁止配置化边界表来源,不在当前模块直接写正式边界表。 |

#### R1.6.3 配置影响主语候选池

本表只确定 Step 11 配置影响候选池和后续讨论位置,不定义配置影响轮廓表正文。

| 组成部分 | 配置影响主语候选 | 主要分类 | 典型触发来源 | 后续模块 |
|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetCatalogView`;definition ref resolution boundary | 核心组成部分间接受影响;Query / visibility / degraded 边界 | definition / catalog Command;typed ref Query;catalog material refresh | 核心组成部分间接受影响;Query / visibility / degraded 配置边界 |
| 正式化与版本 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary` | 核心组成部分间接受影响;body-free / publication / peripheral 边界 | formalization / version Command;basis summary intake / read | 核心组成部分间接受影响;body-free / publication / peripheral 配置边界 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | Query / visibility / degraded 边界;禁止配置化候选 | consumption Command;availability Query;material refresh | Query / visibility / degraded 配置边界;禁止配置化边界 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | 核心组成部分间接受影响;Query / visibility / degraded 边界;禁止配置化候选 | trace / impact / protection Command;trace read;refresh / recovery | 核心组成部分间接受影响;Query / visibility / degraded 配置边界;禁止配置化边界 |
| 关系与分发语义 | `MethodAssetRelation`;`DistributionReadMaterial`;`RelationIntegrityRule`;distribution / handoff hint | 核心组成部分间接受影响;body-free / publication / peripheral 边界;Query / degraded | relation Command;distribution read;handoff candidate / refresh | 核心组成部分间接受影响;body-free / publication / peripheral 配置边界;Query / visibility / degraded 配置边界 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalInboundIntakeFlow` | body-free / publication / peripheral 边界;Query / degraded;禁止配置化候选 | external summary Command;Inbound intake;ref resolution / validation | body-free / publication / peripheral 配置边界;Query / visibility / degraded 配置边界;禁止配置化边界 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`RefreshScopeRef` | 入口 / adapter / transport / job 直接影响;Query / degraded | maintenance Command;Operations Job;progress Query | 入口 / adapter / transport / job 直接影响;Query / visibility / degraded 配置边界 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageView`;`MethodSetAssemblyView` | body-free / publication / peripheral 边界;Query / degraded;禁止配置化候选 | package / set Command;peripheral read / refresh | body-free / publication / peripheral 配置边界;Query / visibility / degraded 配置边界;禁止配置化边界 |

#### R1.6.4 排除清单定稿

以下内容在 Step 11 当前范围内排除:

| 排除项 | 定稿处理 |
|---|---|
| key / env / 默认值 / 单位 / 文件格式 | 不作为配置影响主语;后置到 `04-配置设计.md`。 |
| `RuntimeConfig` / `ConfigError` / loader / validator / builder 具体类型 | 不在概要层闭口;后置到 `03-详细设计.md`。 |
| DB / queue / cache / search / object store / bus / archive 产品参数 | 不作为概要主语;后置到 `04-配置设计.md` / `07-实施计划.md`。 |
| secret / token / cert / URL / network / mount / systemd / container 参数 | 不进入 Step 11 来源池;属于安全和部署实现。 |
| hot reload / rollout / change approval / config evidence 具体流程 | 不作为概要主语;后置到 `03` / `04` / `07`。 |
| governance truth、approval、policy、control、nonconformity 主线 | 不属于本仓;不得回流到 Step 11。 |
| delivery / relay / retry / dead-letter 主线 | 当前只保留 event candidate 和 handoff 边界,不定义 delivery 主线。 |
| fake runtime、私有 map、测试夹具状态 | 不是设计真相源,不得进入配置影响来源池。 |

#### R1.6.5 后续模块映射

来源池确认后,Step 11 后续按以下顺序推进:

| 顺序 | 后续模块 | 使用本来源池的方式 |
|---:|---|---|
| 1 | 核心组成部分间接受影响 | 使用 definition、formalization、trace / audit、relation 等核心主语,收稳哪些只能间接受配置影响。 |
| 2 | 入口 / adapter / transport / job 直接影响 | 使用 refresh task、progress view、handoff seam、adapter target 等运行接缝主语。 |
| 3 | Query / visibility / degraded 配置边界 | 使用 catalog / availability / trace / distribution / external / peripheral read 主语。 |
| 4 | body-free / publication / peripheral 配置边界 | 使用 basis summary、external summary、artifact ref、candidate / handoff hint、package / set 主语。 |
| 5 | 禁止配置化边界 | 使用 boundary guard、consistency protection、audit、state redline、body-free rule 等 forbidden 候选。 |
| 6 | `03 / 04` 承接边界 | 基于前述模块收稳哪些实现契约交给 03,哪些配置说明交给 04。 |

#### R1.6.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成主语筛选规则 | pass | 已固定来源闭合、触发闭合、概要可见、主语优先、红线不过线和非治理 / 非产品参数六条规则。 |
| 是否完成分类框架 | pass | 已定稿五类配置影响分类,后续逐模块展开。 |
| 是否完成候选池 | pass | 已按八个主要组成部分列出配置影响主语候选、分类、触发来源和后续模块。 |
| 是否完成排除清单 | pass | 已定稿排除配置项本身、产品参数、治理语义、delivery 主线和 fake runtime。 |
| 是否写配置影响轮廓表正文 | no | 本模块只写来源池,未写正式主表。 |
| 是否写禁止配置化边界表正文 | no | 本模块只保留 forbidden 候选,未写正式边界表。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍在 Step 11 来源池模块。 |

#### R1.6.7 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `核心组成部分间接受影响:先思考`。

下一模块只允许回答:

1. 哪些核心组成部分会受配置影响,但只能通过 validated input、runtime assembly、safe summary 或 task scope 间接受影响。
2. 哪些核心组成部分绝不能直接读配置。
3. 哪些候选虽然看起来受配置影响,但实际上应转入后续禁止配置化边界。

下一模块不得写:

- 入口 / adapter / transport / job 直接影响正文
- Query / visibility / degraded 配置边界正文
- body-free / publication / peripheral 配置边界正文
- 禁止配置化边界表正文
- `03 / 04` 承接正文
- 正式 §11 回填草稿
- 正式 `02-概要设计.md`

next_allowed_action: 等待用户确认后进入 Step 11 `核心组成部分间接受影响:先思考`;只思考核心组成部分的间接受影响范围、不得直接读配置的红线、safe summary / validated input / task scope 的间接作用方式和排除项,不得写本仓配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.7 核心组成部分间接受影响:先思考

#### R1.7.1 本模块问题

本模块只回答“哪些核心组成部分会受配置影响,但只能通过 validated input、runtime assembly、safe summary / ref 或 task scope 间接受影响”。它不直接写配置影响轮廓表正文、禁止配置化边界表正文、`03 / 04` 承接正文或正式 §11 草稿。

本模块需要先想清楚的核心问题有四个:

1. 当前四个核心组成部分里,哪些会受配置影响,但不能直接读取配置。
2. 这些核心组成部分各自允许通过什么中介路径被间接影响。
3. 哪些看起来像“配置进入核心”,但其实已经越过 Query no-write、Job 不修 truth、body-free 或外围隔离边界。
4. 哪些候选虽然与核心闭环强相关,但应留给后续入口 / adapter / job 模块或禁止配置化边界模块处理。

#### R1.7.2 当前来源判断

当前“核心组成部分间接受影响”的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 总表裁决 | 核心闭环是 `方法资产定义与目录`、`正式化与版本`、`受控消费`、`追溯与一致性保护`;支撑、维护和外围不得反向改写核心 truth。 | 锁定本模块只讨论四个核心组成部分,不把 support / operation / peripheral 混进来。 |
| Step 5 组成部分总表 | 核心组件都已写明“不承担什么”,特别是不承接治理执行、外部正文、下游运行 truth、worker / retry / 产品参数。 | 固定“核心不能直接读配置”不是偏好,而是组成部分边界要求。 |
| Step 8 处理流 | Command 改写 truth / boundary / material;Query no-write;Inbound 只承接 body-free summary/ref;Job 只刷新派生材料和 progress。 | 判断核心配置影响只能通过显式 Command 输入、body-free basis、safe summary 或维护范围间接进入。 |
| Step 9 状态机与传播红线 | `Query no-write`、`Job 不修 core truth`、`外部缺失不回滚 truth`、`peripheral 不阻塞核心` 已固定。 | 固定核心组件不得通过 Query / Job / peripheral path 直接读配置或被配置直接重写。 |
| Step 10 全局异常红线 | `candidate != delivery`、`body-free 不可绕过`、`外围不污染核心` 已固定。 | 防止把 transport、delivery、外围 package 或外部正文接缝写成核心组件的直接配置入口。 |
| `R1.6` 来源池 | 已确认核心组件相关主语主要来自 definition、formalization、consumption、trace / audit / consistency 等对象。 | 本模块只在这些已定稿主语上判断“间接影响”的合法形态。 |

#### R1.7.3 间接受影响判定原则

核心组成部分要进入本模块,至少需要同时满足以下间接受影响原则:

| 原则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 核心主语仍保留业务 owner | 配置不能替代 definition、formalization、consumption 或 trace / consistency 的业务拥有者。 | 转入禁止配置化边界候选。 |
| 配置先被外层消化 | 配置先在 runtime assembly、adapter seam、validated request limit、safe summary acceptance 或 task scope 中被吸收。 | 不得说成“核心对象直接读配置”。 |
| 影响结果仍是业务输入或上下文 | 核心只接收已校验的 basis summary、typed ref、boundary input、scope input、availability hint 或 safe diagnostic。 | 不得直接接收 key、env、timeout 数字、topic 名、URL、secret 等。 |
| 不改变状态机和审计链 | 配置只影响是否允许进入、走哪条 safe path、如何选择已允许接缝,不能改状态 owner、迁移红线、审计语义。 | 转入禁止配置化边界候选。 |
| 不借 Query / Job 偷渡 | Query 和 Job 即便读取配置,也不能把它们带成核心 truth 的直接写入开关。 | 相关讨论后移到 Query / Job 或 forbidden 模块。 |

#### R1.7.4 核心组成部分候选判断

当前四个核心组成部分都可能受配置影响,但都只能以“间接影响”方式成立:

| 核心组成部分 | 是否进入本模块 | 间接受影响的主要原因 | 当前禁止 |
|---|---|---|---|
| `方法资产定义与目录` | yes | 会受 definition intake boundary、catalog read strategy、typed ref resolution boundary 和 external summary basis 影响,但 definition truth / catalog truth 不能直接读配置。 | 不得把目录排序、搜索实现、provider 参数、外部 API 细节写成定义 truth 输入。 |
| `正式化与版本` | yes | 会受 formalization basis summary 可用性、validated input、body-free basis 接入和 version read availability 影响,但正式化判断和 formal version 不能直接读配置。 | 不得用配置绕过正式化资格、隐式建立 formal version 或把 fingerprint / snapshot / delivery 当版本依据。 |
| `受控消费` | yes | 会受 consumption material readiness、availability view、boundary guard 和 definition-use guard 的 safe input 影响,但消费边界不能直接读配置。 | 不得用配置扩大消费边界、声明下游已消费、已运行或跳过 boundary guard。 |
| `追溯与一致性保护` | yes | 会受 trace / impact / audit 的 body-free summary、recovery scope、safe diagnostic 和 maintenance-produced material 影响,但追溯语义和 protection judgment 不能直接读配置。 | 不得让配置改写 trace owner、audit 语义、impact meaning 或 consistency protection 决策红线。 |

#### R1.7.5 合法的间接作用路径

当前允许进入核心组件的间接作用路径,主要只有以下几类:

| 间接路径 | 可作用到的核心组成部分 | 允许的作用方式 | 禁止的误写 |
|---|---|---|---|
| validated command input | definition / catalog、formalization / version、consumption、trace / consistency | 通过已校验的 request limit、scope、mode、guarded input 影响走哪条已允许业务路径。 | 把配置直接写成 domain object 字段或状态迁移条件。 |
| runtime assembly / adapter selection | 四个核心组成部分 | 只影响核心从哪个合法 seam 接收 basis、summary、ref、diagnostic 或 material。 | 让 core service 自己读取 adapter config、endpoint、secret、topic 名。 |
| body-free summary / typed ref / safe marker | formalization / version、consumption、trace / consistency,以及部分 definition context | 只把外部 basis、archive ref、evidence lineage、safe summary 作为业务输入或边界语境带进来。 | 把外部正文、provider payload、artifact body、report body 当核心配置输入。 |
| maintenance task / refresh scope | consumption、trace / consistency,以及核心读取面相关对象 | 只影响派生材料、progress、refresh scope 和 recovery scope,不改核心 truth owner。 | 把 maintenance scope 当作重做 formalization、改 definition、修 relation 的开关。 |
| safe diagnostic / availability hint | 四个核心组成部分的读取面 | 只影响读取面返回的 safe absence、degraded、unavailable 或 freshness hint。 | 把读取 hint 写成业务 truth 已变更或自动补写。 |

#### R1.7.6 当前排除与误判

以下内容虽然看起来和核心闭环相关,但不应在本模块被视为“核心组件间接受配置影响”:

| 候选 | 当前排除原因 | 后续位置 |
|---|---|---|
| adapter enablement、transport target、timeout、batch、retry、cursor | 这是运行承载和接缝配置,不是核心组件间接规则本身。 | `入口 / adapter / transport / job 直接影响` |
| Query page、consistency hint、degraded fallback | 这是读取面边界,不应混入核心组件间接影响模块。 | `Query / visibility / degraded 配置边界` |
| body-free allowlist、publication seam、handoff target、peripheral discovery transport | 这是外部接缝和外围边界配置。 | `body-free / publication / peripheral 配置边界` |
| 状态机、审计链、一致性门禁可被配置放宽 | 这不是“间接受影响”,而是 forbidden 候选。 | `禁止配置化边界` |
| key / env / default / RuntimeConfig 字段 | 这是配置项本身,不是核心主语。 | `03` / `04` |
| governance truth、delivery 主线、marketplace 交易 / 履约 | 不属于本仓核心闭环。 | 永不进入当前模块 |

#### R1.7.7 下一写入批次边界

下一批 `核心组成部分间接受影响:再写入` 只允许把本模块思考收敛为:

1. 核心组件间接受影响判定规则定稿。
2. 四个核心组成部分的间接受影响表。
3. 合法间接路径表。
4. 排除清单定稿。
5. 后续与 direct / query / forbidden 模块的分流说明。
6. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. 入口 / adapter / transport / job 直接影响正文。
3. Query / visibility / degraded 配置边界正文。
4. 禁止配置化边界表正文。
5. `03 / 04` 承接正文。
6. 正式 §11 回填草稿。
7. 正式 `02-概要设计.md`。

#### R1.7.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 只定义核心组件的间接受影响判定、路径和排除口径。 |
| 是否把核心组件写成直接读配置 | no | 已明确核心组件只能通过 validated input、runtime assembly、safe summary / ref、task scope 间接受影响。 |
| 是否继续服从 Query / Job / body-free / peripheral 红线 | pass | 已把四类红线作为间接作用判定前提。 |
| 是否混入 direct / query / peripheral 正文 | no | 已将这些内容保留给后续专门模块。 |
| 是否写配置影响轮廓表正文 | no | 本模块未写正式主表或边界表。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍在 Step 11 核心间接受影响模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `核心组成部分间接受影响:再写入`;只写判定规则、四个核心组成部分的间接受影响表、合法间接路径表、排除清单、分流说明和停审记录,不得写本仓配置影响轮廓表、直接影响正文、禁止配置化边界表、`03 / 04` 承接正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.8 核心组成部分间接受影响:再写入

#### R1.8.1 核心组件间接受影响判定规则定稿

本模块定稿后,Step 11 对“核心组成部分间接受影响”的判断统一采用以下规则:

| 规则 | 定稿口径 | 红线回指 |
|---|---|---|
| 核心 owner 不变 | 配置不能替代 `方法资产定义与目录`、`正式化与版本`、`受控消费`、`追溯与一致性保护` 的业务 owner。 | Step 5 核心组成部分边界;Step 9 状态 owner 不改写。 |
| 配置先在外层被消化 | 配置只能先被 runtime assembly、adapter seam、validated request limit、safe summary acceptance 或 task scope 吸收,再以业务可接受输入进入核心。 | Step 4 代码主体边界;Step 8 处理流边界。 |
| 核心只接收 typed business input | 进入核心的只能是 basis summary、typed ref、guarded scope、availability hint、safe diagnostic、refresh scope 等业务语境输入。 | Step 8 body-free / safe summary 约束;Step 10 body-free 不可绕过。 |
| 不改状态机和审计链 | 配置只能影响走哪条已允许业务路径,不能改写状态 owner、迁移红线、trace / audit 语义和一致性保护判断。 | Step 9 状态机红线;Step 10 全局异常红线。 |
| 不借 Query / Job / peripheral 偷渡 | Query 不能补写 truth,Job 不能修 core truth,peripheral 不能反向污染核心。 | Step 9 `Query no-write`;Step 10 `Job 不修 truth`、`外围不污染核心`。 |
| direct seam 与核心间接影响分离 | adapter enablement、transport target、timeout、batch、retry、cursor 等不在本模块落表。 | 后续转入 `入口 / adapter / transport / job 直接影响`。 |

#### R1.8.2 四个核心组成部分的间接受影响表

| 核心组成部分 | 是否成立为间接受影响 | 合法中介 | 只允许影响 | 明确禁止 |
|---|---|---|---|---|
| `方法资产定义与目录` | 是 | validated command input、runtime assembly、typed ref resolution boundary、safe external summary basis | definition intake 是否可成立、catalog read material 从哪类合法接缝取得、目录读取面的 safe absence / availability hint | 把 provider 参数、搜索实现、排序策略、URL、secret、外部正文或 Query fallback 写成 definition truth 输入 |
| `正式化与版本` | 是 | validated basis input、body-free basis summary、runtime-selected basis seam、version availability hint | formalization 判断所承接的 basis summary 来源、formal version 读取语境、版本读取面的 safe availability | 用配置绕过正式化资格、隐式建立 formal version、把 fingerprint / snapshot / delivery 当版本依据 |
| `受控消费` | 是 | guarded consumption input、availability view、typed consumption material、maintenance-produced read material | consumption material readiness、availability surface、boundary guard 所依赖的安全输入 | 用配置扩大消费边界、跳过 Definition vs Use guard、声明下游已消费 / 已运行 / 已采用 |
| `追溯与一致性保护` | 是 | body-free trace / impact summary、typed evidence lineage ref、refresh / recovery scope、safe diagnostic | trace / impact / consistency 读取面、recovery scope、safe diagnostic 和维护产生材料的语境承接 | 让配置改写 trace owner、audit 语义、impact meaning、一致性保护决策红线或把 raw log / report body 拉进核心 |

#### R1.8.3 合法间接路径表

| 间接路径 | 核心前置条件 | 可影响的核心组成部分 | 允许的影响结果 | 禁止滑移 |
|---|---|---|---|---|
| validated command input | 输入已通过 boundary / basis / lifecycle / ownership 校验 | 四个核心组成部分 | 决定进入哪条已允许业务路径、携带哪类 scope / mode / guarded input | 把 key、env、默认值、数字参数直接带入 domain object 或状态迁移条件 |
| runtime assembly / adapter selection | 只在 entry / application / port / adapter seam 完成装配 | 四个核心组成部分 | 选择合法 basis、summary、ref、diagnostic、material 的来源接缝 | 让 core service 自己读取 config、endpoint、secret、topic、queue 或 storage 产品参数 |
| body-free summary / typed ref / safe marker | 输入满足 body-free,且是 typed summary / ref / marker | `正式化与版本`;`受控消费`;`追溯与一致性保护`;部分 `方法资产定义与目录` 读取语境 | 承接 basis summary、archive ref、evidence lineage、safe summary、availability marker | 把外部正文、provider payload、artifact body、report body 或 archive body 当核心输入 |
| maintenance task / refresh scope | 任务只刷新派生材料、progress、scope 或 recovery,不修 truth | `受控消费`;`追溯与一致性保护`;部分核心读取面 | 决定 refresh / recovery scope、材料重建节奏和 safe progress surface | 把 maintenance scope 当作重做 formalization、改 definition、修 relation 或补写 truth 的开关 |
| safe diagnostic / availability hint | 只在读取面 / 诊断面成立,且不伴随 truth 写入 | 四个核心组成部分的读取语境 | 返回 safe absence、degraded、unavailable、freshness hint 或 guarded reason | 把读取 hint 写成 truth 已变更、已修复或可自动补写 |

#### R1.8.4 排除清单定稿

| 排除项 | 不属于本模块的原因 | 去向 |
|---|---|---|
| adapter enablement、transport binding、timeout、batch、retry、cursor、schedule | 这是运行承载和接缝的直接配置影响,不是核心组成部分的间接规则。 | `入口 / adapter / transport / job 直接影响` |
| Query page、projection availability、degraded fallback、consistency hint | 这是读取面和降级面边界,不应混入核心组件间接影响。 | `Query / visibility / degraded 配置边界` |
| body-free allowlist、publication seam、handoff target、peripheral discovery context | 这是外部接缝、传播候选和外围增强边界。 | `body-free / publication / peripheral 配置边界` |
| 状态机、审计链、一致性门禁可被配置放宽 | 这不是间接受影响,而是必须单独审查的 forbidden 候选。 | `禁止配置化边界` |
| key / env / default / RuntimeConfig 字段 / ConfigError 类型 | 这是配置实现细节,不是概要层核心主语。 | `03 / 04` 承接边界 |
| governance truth、delivery 主线、marketplace 交易 / 履约、fake runtime / 私有 map | 不属于本仓核心闭环或不属于设计真相源。 | 永不进入当前模块 |

#### R1.8.5 与后续模块的分流说明

| 模块 | 本模块已经收稳什么 | 后续模块继续处理什么 |
|---|---|---|
| `入口 / adapter / transport / job 直接影响` | 已明确 direct seam 不属于核心间接规则,只能通过外层装配影响核心。 | 继续收稳 entry、consumer、publisher、job、transport、batch、retry、cursor、scope 等直接配置承接面。 |
| `Query / visibility / degraded 配置边界` | 已明确核心读取语境只能承接 safe diagnostic / availability hint,不得补写 truth。 | 继续收稳 projection / material / degraded / unavailable / fallback 等读取面配置边界。 |
| `禁止配置化边界` | 已明确状态机、审计链、一致性门禁和 truth owner 不能被配置改写。 | 继续把这些红线压缩成独立 forbidden 表,并回指 Step 9 / Step 10。 |
| `body-free / publication / peripheral 配置边界` | 已明确 body-free、candidate / delivery、外围隔离不在本模块落正文。 | 继续收稳 publication / handoff / discovery / peripheral enablement 的配置边界。 |

#### R1.8.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成判定规则定稿 | pass | 已统一核心 owner、不直接读配置、typed business input、Query / Job / peripheral 红线和 direct seam 分离口径。 |
| 是否形成四个核心组成部分的间接受影响表 | pass | 已逐项写明合法中介、允许影响和明确禁止。 |
| 是否形成合法间接路径表 | pass | 已固定 validated input、runtime assembly、body-free summary、maintenance scope、safe diagnostic 五类路径。 |
| 是否形成排除清单 | pass | 已把 direct seam、query 边界、body-free / peripheral、forbidden 和 `03 / 04` 细节分流。 |
| 是否提前写配置影响轮廓主表正文 | no | 本模块未写正式 `§11` 主表或禁止配置化边界表正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11,下一步只允许进入 direct seam 先思考。 |

#### R1.8.7 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `入口 / adapter / transport / job 直接影响:先思考`。

下一模块只允许回答:

1. 哪些 entry、adapter、consumer、publisher、job、transport seam 直接承接配置影响。
2. 这些 direct seam 分别承接 enablement、target selection、timeout、batch、retry、cursor、scope 还是 transport binding 一类影响。
3. Step 10 的 `Query no-write`、`Job 不修 truth`、`candidate 不等于 delivery`、`body-free 不可绕过` 如何约束这些 direct seam。
4. 哪些内容仍必须留给 Query 模块、forbidden 模块、`03 / 04` 承接模块或正式 §11 回填阶段。

下一模块不得写:

1. 本仓配置影响轮廓表正文。
2. Query / visibility / degraded 配置边界正文。
3. 禁止配置化边界表正文。
4. `03 / 04` 承接正文。
5. 正式 §11 回填草稿。
6. 正式 `02-概要设计.md`。

next_allowed_action: 等待用户确认后进入 Step 11 `入口 / adapter / transport / job 直接影响:先思考`;只思考 entry、adapter、consumer、publisher、job、transport seam 的直接配置影响范围、红线约束、与核心间接受影响的分工和排除项,不得写本仓配置影响轮廓表、Query / forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.9 入口 / adapter / transport / job 直接影响:先思考

#### R1.9.1 本模块问题

本模块只回答“哪些 runtime seam 会直接承接配置影响,以及这些影响在概要层应如何分组和受红线约束”。它不直接写配置影响轮廓表正文、Query / forbidden / `03 / 04` 正文或正式 §11 草稿。

本模块需要先想清楚五个问题:

1. 哪些 entry、adapter、consumer、publisher、job、transport seam 是配置直接落点,而不是核心组成部分的间接输入。
2. 这些 direct seam 主要承接的是 enablement、target selection、transport binding、timeout、batch、retry、cursor、scope 还是 runtime assembly 一类影响。
3. 哪些 direct seam 虽然受配置直接影响,但其结果只能停留在 entry / application / port / adapter / job runtime 层,不能穿透成 core truth 规则。
4. Step 10 的 `Query no-write`、`Job 不修 truth`、`candidate 不等于 delivery`、`body-free 不可绕过`、`外围不污染核心` 如何限制 direct seam 的写法。
5. 哪些候选应延后到 Query 模块、body-free / publication / peripheral 模块、forbidden 模块或 `03 / 04` 承接模块处理。

#### R1.9.2 当前来源判断

当前“direct seam”判断的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| `R1.8` 核心间接受影响定稿 | 已明确 core 只能被间接影响,adapter enablement、transport target、timeout、batch、retry、cursor 不属于核心间接规则。 | 固定本模块只讨论 direct seam,不把这些内容再写回核心组件。 |
| Step 7 接口骨架 | 已明确 Command / Query / Inbound / Outbound / Operations Job 五类接口,并固定 entry、consumer、publisher、job 的边界。 | 锁定 direct seam 的主要落点必须来自这五类接口或其 runtime assembly。 |
| Step 8 处理流 | 已固定 Command 写 truth、Query 只读、Inbound 只承接 body-free summary / ref、Outbound 只表达 candidate / handoff、Job 只刷新派生材料和 progress。 | 判断 direct seam 只能影响运行路径和接缝装配,不能改业务 owner。 |
| Step 10 全局异常红线 | 已固定 `Query no-write`、`Job 不修 truth`、`candidate 不等于 delivery`、`body-free 不可绕过`、`外围不污染核心`。 | 固定 direct seam 即便直接受配置影响,也不得跨越这些红线。 |
| Step 5 / Step 7 对后台维护与收敛的裁决 | 已明确 maintenance 是支撑运行单元,Operations Job 只负责派生材料和收敛。 | 锁定 job runtime seam 是 direct impact 主场,但不能被写成 truth repair 主场。 |

#### R1.9.3 direct seam 判定原则

direct seam 要进入本模块,至少需要同时满足以下原则:

| 原则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 主语是 runtime seam 而不是 core truth | 候选必须是 entry、application assembly、port / adapter seam、consumer / publisher seam、job runtime seam。 | 转回 `R1.8` 核心间接受影响或 forbidden 模块。 |
| 影响属于运行承载而不是业务语义 | 影响类别只能是 enablement、target selection、transport binding、schedule、batch、retry、cursor、timeout、scope、report root、secret ref 承载等。 | 若在改写业务 meaning、状态 owner、audit 语义,转入 forbidden 模块。 |
| direct 影响停在外层 | 配置可以直接影响 runtime builder、adapter 选择、job runner、source binding,但不能直接变成 domain truth 字段。 | 不得说成“domain object 直接读配置”。 |
| 可回指 Step 7 / Step 8 落点 | 必须能回指五类接口或已收稳处理流中的入口、接缝、consumer、publisher、job。 | 不进入本模块。 |
| 仍服从 Step 10 红线 | direct seam 再直接,也不能让 Query 写 truth、Job 修 truth、Inbound 收正文、Outbound 承诺 delivery、外围阻塞核心。 | 转入排除清单或 forbidden 模块。 |

#### R1.9.4 direct seam 候选族判断

当前 direct seam 候选可先按五族判断:

| direct seam 族 | 是否进入本模块 | 直接承接的影响类别 | 当前提醒 |
|---|---|---|---|
| 同步入口 / Command / Query entry assembly | yes | profile、config source selector、operation context injection、request limit / scope assembly | 入口可直接承接配置,但 Query entry 不能因此获得 refresh / create / repair truth 能力。 |
| adapter assembly seam | yes | repository / read material / external summary / publisher / consumer adapter kind、target selection、secret ref 承载、timeout / endpoint 类别 | 本模块只点名 adapter selection / assembly,不展开外部正文、visibility、degraded 语义。 |
| Inbound consumer / source transport seam | yes | source binding、transport binding、schema / version acceptance context、dedup / idempotency channel、timeout | 只讨论 intake seam 的直接影响,不得把 provider payload 或 raw body 放进来。 |
| Outbound publisher / handoff / collaboration seam | yes | publisher enablement、handoff target、transport binding、publication target selection、delivery unavailable handling 类别 | 只能影响 candidate / handoff 路径,不得升级成 delivery 机制正文。 |
| Operations Job / maintenance runtime seam | yes | job enablement、schedule、batch、retry、cursor、scope preset、report root、maintenance runtime assembly | 这是 direct seam 最集中的运行面,但只能作用于派生材料、progress 和 recovery scope。 |

#### R1.9.5 Step 10 红线下的 direct seam 约束

当前 direct seam 即便属于配置直接落点,也必须服从以下统一约束:

| 红线 | direct seam 约束 | 典型影响 |
|---|---|---|
| `Query no-write` | Query entry、projection adapter、read material adapter 只能影响读取路径、availability、degraded / unavailable surface 的来源,不得触发 create / refresh / repair。 | Query 配置只能决定“从哪里读、如何降级”,不能决定“顺手写回”。 |
| `Job 不修 truth` | job runtime 的 batch、retry、cursor、scope、schedule 只能影响派生材料和收敛节奏。 | maintenance 配置不能变成重做 formalization、修 definition、修 relation 的入口。 |
| `candidate 不等于 delivery` | outbound publisher / handoff transport 的 direct config 只能影响 candidate 的发出接缝和 unavailable surface。 | 不得把 topic、relay、receipt、retry、dead letter 写成概要主线。 |
| `body-free 不可绕过` | inbound consumer、external summary adapter、artifact ref adapter 即便由配置直连,也只能承接 summary / ref / digest / marker。 | 不得因为配置存在就允许 raw body、provider payload、archive body 入仓。 |
| `外围不污染核心` | peripheral discovery / package / set adapter 的 enablement 不能反向成为核心定义、正式化、消费或追溯成立前置。 | 外围 adapter 不可用只能降级外围能力,不能阻断核心闭环。 |

#### R1.9.6 当前排除与延后

以下内容不应在本模块被写成 direct seam 正文:

| 候选 | 当前排除原因 | 后续位置 |
|---|---|---|
| visibility、degraded marker、projection availability 细化 | 这是 Query / read surface 边界,不是 direct seam 总体判断。 | `Query / visibility / degraded 配置边界` |
| body-free allowlist、candidate / delivery 语义细化、handoff safe reason | 这是 publication / body-free / peripheral 边界问题,本模块只先锁 direct seam。 | `body-free / publication / peripheral 配置边界` |
| 状态机、audit、consistency gate 是否可配置放宽 | 这是 forbidden 问题,不是 direct seam 正常能力。 | `禁止配置化边界` |
| RuntimeConfig 字段、ConfigError 类型、env、default、cron 表达式、URL、secret 名、具体 timeout / retry 数值 | 这是实现契约和配置说明细节。 | `03 / 04` 承接边界 |
| queue、worker、scheduler、topic、payload schema、dead letter、lock、cache 产品参数 | 已超出概要层 direct seam 轮廓。 | `03 / 04` 或后续实施设计 |

#### R1.9.7 下一写入批次边界

下一批 `入口 / adapter / transport / job 直接影响:再写入` 只允许把本模块思考收敛为:

1. direct seam 判定规则定稿。
2. 入口 / adapter / consumer / publisher / job 的直接影响表。
3. 影响类型分类表。
4. Step 10 红线约束表。
5. 排除清单和与 Query / forbidden / `03 / 04` 的分流说明。
6. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. Query / visibility / degraded 配置边界正文。
3. body-free / publication / peripheral 配置边界正文。
4. 禁止配置化边界表正文。
5. `03 / 04` 承接正文。
6. 正式 §11 回填草稿。
7. 正式 `02-概要设计.md`。

#### R1.9.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 direct seam 候选、判定原则、红线约束和延后项。 |
| 是否与 `R1.8` 做了分工 | pass | 已把核心间接受影响和 direct seam 明确拆开。 |
| 是否继续服从 Step 10 红线 | pass | 已逐条回指 Query、Job、candidate、body-free、peripheral 红线。 |
| 是否提前写主表正文 | no | 本模块未写正式配置影响轮廓表或 forbidden 表正文。 |
| 是否下沉到 `03 / 04` 细节 | no | 未写 RuntimeConfig 字段、env、default、URL、secret 名或具体数值。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 direct seam 模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `入口 / adapter / transport / job 直接影响:再写入`;只写 direct seam 判定规则、入口 / adapter / consumer / publisher / job 直接影响表、影响类型分类、红线约束表、排除清单、分流说明和停审记录,不得写本仓配置影响轮廓表、Query / body-free / forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.10 入口 / adapter / transport / job 直接影响:再写入

#### R1.10.1 direct seam 判定规则定稿

本模块定稿后,Step 11 对 direct seam 的判断统一采用以下规则:

| 规则 | 定稿口径 | 回指 |
|---|---|---|
| 主语必须是 runtime seam | 只把 entry、application assembly、port / adapter seam、consumer / publisher seam、job runtime seam 视为 direct impact 主语。 | Step 7 五类接口;Step 8 通用处理流骨架。 |
| 影响必须停在外层 | 配置可以直接影响 runtime assembly、adapter selection、source binding、publisher binding、job runner,但不能直接成为 domain truth 字段。 | `R1.8` 核心间接受影响分流。 |
| 影响类型只写运行承载类别 | 只允许写 enablement、target selection、transport binding、timeout、batch、retry、cursor、scope、schedule、report root、secret ref 承载、context injection。 | Step 11 当前仍停在概要层。 |
| direct seam 不改业务语义 | 配置不能借 direct seam 改写状态 owner、formalization meaning、consumption boundary、trace / audit 语义或 relation truth。 | Step 9 状态机红线;Step 10 全局异常红线。 |
| 所有 direct seam 都服从 Step 10 红线 | Query 仍 no-write、Job 仍不修 truth、Inbound 仍 body-free、Outbound 仍 candidate only、外围仍不污染核心。 | Step 10 `R1.27`。 |

#### R1.10.2 入口 / adapter / consumer / publisher / job 直接影响表

| direct seam | 是否直接受配置影响 | 直接影响类型 | 允许影响 | 明确禁止 |
|---|---|---|---|---|
| 同步入口 / Command entry assembly | 是 | profile、config source selector、operation context injection、request limit / scope assembly | 选择哪组合法 command entry context、生效的 boundary context 和 runtime wiring | 把配置变成 domain rule、绕过 basis / boundary / ownership 校验或改写 command 业务语义 |
| 同步入口 / Query entry assembly | 是 | profile、query context injection、read path selection、availability / fallback wiring 类别 | 选择查询从哪类合法 read seam 进入、返回哪类 safe read context | 让 Query entry 获得 create / refresh / repair truth 能力 |
| repository / read material / external summary adapter seam | 是 | adapter kind、target selection、secret ref 承载、timeout / endpoint 类别、runtime assembly | 决定从哪类合法 repository / material / summary seam 读取或写入安全边界内的数据 | 让 adapter 读取外部正文、隐式改写 truth owner、直接决定状态迁移 |
| Inbound consumer / source transport seam | 是 | source binding、transport binding、schema / version acceptance context、dedup / idempotency channel、timeout | 决定 body-free intake 从哪类 source seam 进入、如何做 intake 级接纳上下文装配 | 允许 raw payload、provider payload、archive body、unsafe body 入仓,或让 inbound 直接成立 formal version / relation / package truth |
| Outbound publisher / handoff / collaboration seam | 是 | publisher enablement、handoff target、transport binding、publication target selection、delivery unavailable handling 类别 | 决定 candidate / handoff 从哪类安全发布接缝离开、如何表达 unavailable / blocked | 把 topic、payload schema、outbox、relay、receipt、retry、dead letter 写成概要主线,或把 candidate 当 delivery 成立 |
| Operations Job / maintenance runtime seam | 是 | job enablement、schedule、batch、retry、cursor、scope preset、report root、maintenance runtime assembly | 决定刷新派生材料、推进收敛、记录 progress 的运行节奏与范围 | 把 maintenance 变成修 definition、重做 formalization、修 relation、扩大消费边界或拉正文的入口 |

#### R1.10.3 影响类型分类表

| 影响类型 | 作用落点 | 当前概要口径 | 明确后移内容 |
|---|---|---|---|
| enablement / profile | entry、publisher、job、peripheral seam | 只点名哪些 seam 可启停或按 profile 选择 | profile 名、环境绑定、默认值 |
| target selection / adapter kind | repository、read material、external summary、publisher、consumer | 只点名可选择哪类合法 target / adapter seam | 具体 driver、SDK、client、constructor 参数 |
| transport binding | inbound source seam、outbound publication seam | 只点名存在 transport / source / handoff binding | topic、payload schema、relay、subscriber、delivery guarantee |
| timeout / idempotency channel / acceptance context | consumer、adapter、entry | 只点名影响 intake / adapter 级安全接纳上下文 | 数值、header、token、dedup 存储格式 |
| batch / retry / cursor / schedule | job runtime seam | 只点名影响刷新和收敛节奏 | 批大小、退避、cron、游标 schema、锁实现 |
| scope preset / report root / context injection | entry、job、application assembly | 只点名影响运行范围、输出位置和上下文装配 | path、bucket、目录名、artifact schema、上下文字段全集 |
| secret ref 承载 | adapter / external seam | 只点名 secret 只在外层承载,不进入核心 | secret 名、来源、挂载方式、rotation 细节 |

#### R1.10.4 Step 10 红线约束表

| 红线 | direct seam 允许做什么 | direct seam 不得做什么 |
|---|---|---|
| `Query no-write` | 只装配 read path、availability / degraded 来源和 safe diagnostic 路径 | 不得借 Query entry、projection adapter、read material adapter 做 create / refresh / repair |
| `Job 不修 truth` | 只装配 refresh / recovery / progress 的执行节奏与范围 | 不得借 job config 修 core truth、重做 formalization、修 relation 或补 boundary truth |
| `candidate 不等于 delivery` | 只装配 candidate / handoff 的离站接缝和 unavailable surface | 不得把 publisher config 写成投递保证或 delivery 成立机制 |
| `body-free 不可绕过` | 只装配 summary / ref / digest / marker intake seam | 不得因为 transport / adapter 已配置就允许正文、包体或 provider payload 穿透 |
| `外围不污染核心` | 只允许外围 seam 影响外围读取面、发现面和组织面 | 不得让外围 adapter enablement 成为核心定义、正式化、消费或追溯成立前置 |

#### R1.10.5 排除清单与分流说明

| 排除项 | 不在本模块展开的原因 | 去向 |
|---|---|---|
| visibility、degraded marker、projection availability 细化 | 这是读取面和可见性边界,不是 direct seam 收口正文。 | `Query / visibility / degraded 配置边界` |
| body-free allowlist、handoff safe reason、candidate / delivery 语义细化 | 这是 body-free / publication / peripheral 模块的主问题。 | `body-free / publication / peripheral 配置边界` |
| 状态机、audit、consistency gate 是否允许被配置放宽 | 这是 forbidden 审查对象,不是正常 direct seam 能力。 | `禁止配置化边界` |
| RuntimeConfig 字段、ConfigError 类型、env、default、URL、secret 名、cron、具体 timeout / retry 数值 | 已下沉到实现契约和配置说明层。 | `03 / 04` 承接边界 |
| queue、worker、scheduler、topic、payload schema、relay、dead letter、lock、cache 产品参数 | 已超出概要层 direct seam 轮廓。 | `03 / 04` 或后续实施设计 |

#### R1.10.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 direct seam 判定规则定稿 | pass | 已固定 runtime seam 主语、影响类型边界、外层停留原则和 Step 10 红线服从关系。 |
| 是否形成直接影响表 | pass | 已覆盖 entry、adapter、consumer、publisher、job 五类 direct seam。 |
| 是否形成影响类型分类表 | pass | 已把 enablement、target、transport、timeout、batch / retry / cursor / schedule、scope / report root、secret ref 承载分开。 |
| 是否形成红线约束表 | pass | 已逐条回指 Query、Job、candidate、body-free、peripheral 红线。 |
| 是否完成分流说明 | pass | 已把 Query、body-free / publication、forbidden、`03 / 04` 的后续归属拆开。 |
| 是否提前写配置影响主表正文 | no | 本模块未写正式 `§11` 主表或 forbidden 表正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11,下一步只允许进入 Query / visibility / degraded 模块先思考。 |

#### R1.10.7 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `Query / visibility / degraded 配置边界:先思考`。

下一模块只允许回答:

1. 哪些 query read surface、projection / material / availability seam 会受配置影响。
2. 这些影响如何只停留在读取面、visibility、degraded、unavailable 或 freshness hint,而不反写 truth。
3. Step 10 的 `Query no-write` 与 `body-free 不可绕过` 如何约束 query 侧配置影响。
4. 哪些内容仍必须留给 forbidden 模块、body-free / publication / peripheral 模块或 `03 / 04` 承接模块。

下一模块不得写:

1. 本仓配置影响轮廓表正文。
2. body-free / publication / peripheral 配置边界正文。
3. 禁止配置化边界表正文。
4. `03 / 04` 承接正文。
5. 正式 §11 回填草稿。
6. 正式 `02-概要设计.md`。

next_allowed_action: 等待用户确认后进入 Step 11 `Query / visibility / degraded 配置边界:先思考`;只思考 query read surface、projection / material / availability seam 的配置影响范围、Query no-write 下的读取面边界、与 direct seam / forbidden / `03 / 04` 的分工和排除项,不得写本仓配置影响轮廓表、body-free / publication / peripheral / forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.11 Query / visibility / degraded 配置边界:先思考

#### R1.11.1 本模块问题

本模块只回答“哪些 Query read surface 会受配置影响,以及这些影响如何严格停留在读取面、visibility / availability / degraded / freshness surface 上”。它不直接写配置影响轮廓表正文、body-free / publication / peripheral 正文、forbidden 正文、`03 / 04` 承接正文或正式 §11 草稿。

本模块需要先想清楚五个问题:

1. 哪些 query read surface、projection / material / availability seam 会受配置影响。
2. 本仓所谓 `visibility` 在当前 Step 11 中到底指什么,它与 direct seam、权限治理语义和 truth owner 如何区分。
3. 哪些 degraded / unavailable / stale / partial 语义可以受配置影响,但只能停留在读取面或 safe diagnostic。
4. `Query no-write`、`body-free 不可绕过`、`外部缺失不回滚 truth`、`外围不污染核心` 如何约束 Query 侧配置影响。
5. 哪些候选必须留给 direct seam、body-free / publication / peripheral、forbidden 或 `03 / 04` 承接模块。

#### R1.11.2 当前来源判断

当前“Query / visibility / degraded 配置边界”的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 7 Query API 骨架 | 已按八个主要组成部分固定 Query 读取来源和只读边界。 | 锁定 Query 配置影响必须落在 truth summary、view、read material、diagnostic、history、lineage、progress 或 peripheral view。 |
| Step 8 通用处理流骨架 | 已固定 Query 只读、Inbound body-free、Outbound candidate only、Job 只维护派生材料。 | 固定 Query 配置影响只能改变读取路径和降级 surface,不能借别的路径补 truth。 |
| Step 9 状态机 | 已固定 stale / unavailable / partial / pending / safe absence 只在当前 owner 层成立,且 `view / material` 不反写 truth。 | 固定 Query 配置影响只能作用于 freshness、availability、partialness、context visibility。 |
| Step 10 Query / view / material 降级异常 | 已完成 stale / unavailable / partial / not visible / degraded 的概要口径。 | 本模块直接承接这些读取面降级语义作为配置影响边界。 |
| `R1.10` direct seam 定稿 | 已明确 entry / adapter / consumer / publisher / job 是 direct seam 主场。 | 本模块只讨论读取结果和读取语境,不重复讨论 direct seam 的 runtime assembly。 |

#### R1.11.3 Query / visibility / degraded 判定原则

当前 Query 侧配置影响进入本模块,至少需要同时满足以下原则:

| 原则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 主语必须是读取面 owner | 候选必须是 summary、view、read material、availability、freshness、diagnostic、history、lineage、progress 或 peripheral discovery view。 | 转回 direct seam 或 forbidden 模块。 |
| visibility 只表示读取可见 / 可读边界 | 本仓这里的 visibility 只表示 query side 的 readable / not visible / context unavailable / boundary-disallowed safe surface,不是独立审批或授权域。 | 不得引入 governance / identity 式权限主线。 |
| degraded 只停在读取面 | stale、unavailable、partial、degraded、not visible 只表达当前 owner 的读取状态、材料状态或上下文状态。 | 不得推导成 truth 失效、truth 回滚或自动修复。 |
| 配置影响只能改变读法与降级法 | 配置可以影响 read path selection、projection / material availability source、fallback wiring、safe diagnostic 来源和 freshness hint surface。 | 不得改变 Query 返回的业务 truth、状态 owner 或 audit meaning。 |
| 始终服从 `Query no-write` | 无论读 path 如何配置,Query 都不能 create、refresh、repair、rebuild 或启动 job。 | 转入 forbidden 模块。 |

#### R1.11.4 Query read surface 候选判断

当前 Query 侧配置影响候选可先按读取面族判断:

| Query read surface 族 | 是否进入本模块 | 可能受影响的读取面 | 当前提醒 |
|---|---|---|---|
| 定义 / 目录读取面 | yes | definition summary、definition ref resolution、catalog view、catalog read material freshness | 只允许影响目录读取路径、safe absence 和 freshness hint,不得建 definition 或补 catalog entry。 |
| 正式化 / 版本 / basis 读取面 | yes | formalization state、formal version summary、basis summary、eligibility diagnostic、history material | 只允许影响 basis availability、freshness、history read path,不得推进正式化或生成 formal version。 |
| 受控消费读取面 | yes | consumption material、availability view、boundary diagnostic、consumable context read | 只允许影响 availability、consumption material freshness、safe boundary diagnostic,不得扩大消费边界。 |
| 追溯 / 审计 / lineages 读取面 | yes | trace material、subject trace、impact summary、audit trail、evidence lineage、protection diagnostic | 只允许影响 trace / audit / lineage read path、partialness、safe diagnostic,不得组织新 trace 或补审计。 |
| 关系 / 分发读取面 | yes | relation view、integrity diagnostic、distribution read material、distribution availability | 只允许影响 read material freshness、integrity diagnostic surface、distribution availability,不得修 relation truth。 |
| 外部摘要 / ref / artifact 读取面 | yes | external summary view、source ref resolution、artifact archive ref、body boundary diagnostic、acceptance history | 只允许影响 external summary availability、ref readability、body boundary diagnostic,不得拉外部正文。 |
| 维护进度读取面 | yes | maintenance progress、task summary、run history、pending maintenance scopes | 只允许影响 progress read path、freshness 和 follow-up hint,不得把 progress 解释成 truth 已修复。 |
| 外围 package / assembly / discovery 读取面 | yes | package view、assembly view、composition diagnostic、discovery context、外围 history | 只允许影响外围读取面可见性、availability 和 freshness,不得让外围失败污染核心。 |

#### R1.11.5 Query 侧 visibility / degraded 语义判断

当前本仓在 Query 模块里需要重点固定的 visibility / degraded 语义如下:

| 语义 | 当前定义 | 配置可影响什么 | 不得滑移成什么 |
|---|---|---|---|
| `not visible` / `context unavailable` | 当前 query subject、boundary、context 或采用语境不足以安全呈现该读取面。 | 只可影响 safe diagnostic、not visible / context unavailable surface 的来源和呈现路径。 | 不得滑成“truth 不存在”或“自动补 context / boundary”。 |
| `stale` | 当前 view / material 相对其来源落后。 | 只可影响 freshness hint 来源、fallback wiring、refresh hint surface。 | 不得滑成“来源 truth 失效”或“自动刷新后已修复”。 |
| `unavailable` | 当前 owner 或上下文暂不可读。 | 只可影响 unavailable surface、safe absence、follow-up hint。 | 不得滑成“回滚已成立 truth”或“自动切换到正文拉取”。 |
| `partial` / `incomplete` | 部分材料可读但未完整闭合。 | 只可影响 partial read surface、safe diagnostic 和 maintenance hint。 | 不得滑成“静默补齐”或“自动启动恢复 job”。 |
| `degraded` | 当前 query 只能安全返回降级视图、边界诊断或摘要化结果。 | 只可影响 degraded view 来源、safe summary / diagnostic 选路。 | 不得滑成“返回正文”“跨 boundary 放宽”或“顺手写入修复”。 |

#### R1.11.6 Step 10 红线下的 Query 侧约束

| 红线 | Query 侧允许做什么 | Query 侧不得做什么 |
|---|---|---|
| `Query no-write` | 只在读取面选择 view、material、diagnostic、history、lineage、progress 或 safe absence 路径。 | 不得 create、refresh、repair、rebuild truth / material / view,不得启动 job。 |
| `body-free 不可绕过` | 只允许 query 读取 body-free summary、typed ref、digest hint、marker、safe reason、availability / freshness hint。 | 不得因 fallback 或 projection miss 转去读取正文、artifact body、provider payload。 |
| `外部缺失不回滚 truth` | external unavailable / ref invalid 只能表现为 unavailable / pending / follow-up hint。 | 不得把外部缺失解释成 formal version、relation、trace 或既有 truth 失效。 |
| `外围不污染核心` | package / assembly / discovery unavailable 只影响外围读取面和 discovery surface。 | 不得把外围 unavailable 写成核心 definition / formalization / consumption / trace 失败。 |
| `Job 不修 truth` | Query 可以暴露 maintenance progress、freshness、pending scope。 | 不得把 progress、refresh hint 或 recovery hint 写成 truth 已修复。 |

#### R1.11.7 当前排除与延后

| 候选 | 当前排除原因 | 后续位置 |
|---|---|---|
| entry / adapter / source binding / publisher binding | 这是 direct seam,不是 Query 读取面 owner。 | `R1.10` direct seam 已处理 |
| body-free allowlist、publication target、candidate / delivery 语义 | 这是 body-free / publication / peripheral 模块的主问题。 | `body-free / publication / peripheral 配置边界` |
| 状态 owner、boundary gate、audit 语义可被配置放宽 | 这是 forbidden 问题。 | `禁止配置化边界` |
| RuntimeConfig 字段、fallback 开关名、cache / projection driver、URL、timeout 数值、索引 / projection schema | 已下沉到实现契约和配置说明。 | `03 / 04` 承接边界 |
| 旧 snapshot / fingerprint / projection rebuild / outbox replay 主线 | 当前只能退回 freshness / material / maintenance 语义,不得复活旧主线。 | 永不回流当前模块 |

#### R1.11.8 下一写入批次边界

下一批 `Query / visibility / degraded 配置边界:再写入` 只允许把本模块思考收敛为:

1. Query / visibility / degraded 判定规则定稿。
2. Query read surface 配置影响表。
3. visibility / degraded 语义表。
4. Step 10 红线约束表。
5. 排除清单与分流说明。
6. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. body-free / publication / peripheral 配置边界正文。
3. 禁止配置化边界表正文。
4. `03 / 04` 承接正文。
5. 正式 §11 回填草稿。
6. 正式 `02-概要设计.md`。

#### R1.11.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 Query 读取面候选、visibility / degraded 语义、红线约束和延后项。 |
| 是否把 visibility 限定为读取可见性 | pass | 已明确这里不是独立审批 / 授权域,而是读取可见 / 可读边界。 |
| 是否继续服从 `Query no-write` | pass | 已把 no-write 作为本模块主约束。 |
| 是否与 direct seam / forbidden 分工清楚 | pass | 已把 runtime seam 和 formal forbidden 语义分流。 |
| 是否提前写配置影响主表正文 | no | 本模块未写正式 `§11` 主表、forbidden 表或 `03 / 04` 正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 Query 模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `Query / visibility / degraded 配置边界:再写入`;只写 Query / visibility / degraded 判定规则、Query read surface 配置影响表、visibility / degraded 语义表、红线约束表、排除清单、分流说明和停审记录,不得写本仓配置影响轮廓表、body-free / publication / peripheral / forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.12 Query / visibility / degraded 配置边界:再写入

#### R1.12.1 Query / visibility / degraded 判定规则定稿

本模块定稿后,Step 11 对 Query 侧配置影响的判断统一采用以下规则:

| 规则 | 定稿口径 | 回指 |
|---|---|---|
| 主语必须是读取面 owner | 只把 summary、view、read material、availability、freshness、diagnostic、history、lineage、progress、peripheral discovery view 视为 Query 侧主语。 | Step 7 Query API 骨架。 |
| visibility 只表示读取可见 / 可读边界 | 本仓这里的 visibility 仅表示 query side 的 readable / not visible / context unavailable / boundary-disallowed safe surface。 | `R1.11` 语义限定。 |
| degraded 只停在读取面 | stale、unavailable、partial、degraded、not visible 只表达当前 owner 的读取状态或上下文状态。 | Step 9 状态 owner 约束;Step 10 读取降级异常。 |
| 配置只能改变读法与降级法 | 配置只可影响 read path selection、projection / material availability source、fallback wiring、safe diagnostic 来源、freshness hint surface。 | Step 8 Query 只读骨架。 |
| 始终服从 `Query no-write` | Query 无论如何配置,都不得 create、refresh、repair、rebuild truth / material / view,不得启动 job。 | Step 10 全局红线。 |

#### R1.12.2 Query read surface 配置影响表

| Query read surface | 是否受配置影响 | 配置影响类型 | 允许影响 | 明确禁止 |
|---|---|---|---|---|
| 定义 / 目录读取面 | 是 | read path selection、catalog view availability source、freshness hint wiring、safe absence source | 选择 definition summary / catalog view 从哪类合法读取面返回,以及如何表达 stale / unavailable | 建 definition、补 catalog entry、把搜索 / 索引实现当 truth |
| 正式化 / 版本 / basis 读取面 | 是 | basis availability source、history read path、freshness hint、safe diagnostic routing | 影响 formalization state / version summary / basis summary 的读取路径和 availability surface | 推进正式化、生成 formal version、恢复 fingerprint / snapshot 主线 |
| 受控消费读取面 | 是 | availability source、consumption material freshness、boundary diagnostic routing、fallback wiring | 影响 consumption material / availability view / boundary diagnostic 的安全读取路径 | 扩大消费边界、补 consumption material、读取下游运行 truth |
| 追溯 / 审计 / lineage 读取面 | 是 | trace / audit / lineage read path、partialness surface、safe diagnostic source | 影响 trace material、audit trail、evidence lineage、impact summary 的部分可读 / 降级呈现 | 组织新 trace、补 audit、返回 raw log / report body / evidence body |
| 关系 / 分发读取面 | 是 | relation view freshness、distribution availability source、integrity diagnostic routing | 影响 relation / distribution read material 的 freshness、availability、diagnostic surface | 修 relation truth、执行图算法、把 distribution availability 当 marketplace truth |
| 外部摘要 / ref / artifact 读取面 | 是 | external summary availability source、ref readability、body boundary diagnostic、acceptance history path | 影响 external summary / ref / archive ref 的 readable / unavailable / diagnostic surface | 拉外部正文、artifact body、provider payload、archive 包体 |
| 维护进度读取面 | 是 | progress read path、freshness hint、pending scope surface、follow-up hint routing | 影响 progress / task summary / run history 的读取路径和 safe hint 呈现 | 把 progress、refresh hint、recovery hint 写成 truth 已修复 |
| 外围 package / assembly / discovery 读取面 | 是 | peripheral availability source、discovery context readability、freshness / partialness surface | 影响 package / assembly / discovery view 的可读性、freshness 和 diagnostic surface | 让外围 unavailable 污染核心闭环或变成核心 prerequisite |

#### R1.12.3 visibility / degraded 语义表

| 语义 | 定稿口径 | 配置允许影响 | 严格禁止 |
|---|---|---|---|
| `not visible` / `context unavailable` | 当前 query subject、boundary、context 或采用语境不足以安全呈现读取面。 | safe diagnostic 来源、not visible / context unavailable surface 的选路与呈现层级 | 自动补 context / boundary、把不可见解释成 truth 不存在 |
| `stale` | 当前 view / material 相对其来源落后。 | freshness hint 来源、fallback wiring、refresh hint surface | 解释成来源 truth 失效、自动刷新后已修复 |
| `unavailable` | 当前 owner 或上下文暂不可读。 | unavailable surface、safe absence、follow-up hint 路径 | 回滚已成立 truth、回退成正文拉取或 unsafe source |
| `partial` / `incomplete` | 部分材料可读但未完整闭合。 | partial read surface、safe diagnostic、maintenance follow-up hint | 静默补齐、自动启动恢复 job、把 partial 当 rejected |
| `degraded` | 当前 query 只能安全返回降级视图、边界诊断或摘要化结果。 | degraded view 来源、safe summary / diagnostic 选路 | 返回正文、跨 boundary 放宽、顺手写入修复 |

#### R1.12.4 Step 10 红线约束表

| 红线 | Query 侧允许做什么 | Query 侧不得做什么 |
|---|---|---|
| `Query no-write` | 只在读取面选择 view、material、diagnostic、history、lineage、progress 或 safe absence 路径 | create、refresh、repair、rebuild truth / material / view,或启动 job |
| `body-free 不可绕过` | 只读取 body-free summary、typed ref、digest hint、marker、safe reason、availability / freshness hint | 因 fallback、projection miss 或 unavailable 去读取正文、artifact body、provider payload |
| `外部缺失不回滚 truth` | external unavailable / ref invalid 只表现为 unavailable / pending / follow-up hint | 把 external 缺失解释成 formal version、relation、trace 或既有 truth 失效 |
| `外围不污染核心` | package / assembly / discovery unavailable 只影响外围读取面和 discovery surface | 把外围 unavailable 写成核心 definition / formalization / consumption / trace 失败 |
| `Job 不修 truth` | Query 可暴露 maintenance progress、freshness、pending scope 和恢复 hint | 把 progress、refresh hint、recovery hint 写成 truth 已修复或即将自动修复 |

#### R1.12.5 排除清单与分流说明

| 排除项 | 不在本模块展开的原因 | 去向 |
|---|---|---|
| entry / adapter / source binding / publisher binding | 这是 direct seam,不是 Query 读取面 owner。 | `R1.10` direct seam 已处理 |
| body-free allowlist、publication target、candidate / delivery 语义 | 这是 body-free / publication / peripheral 模块主问题。 | `body-free / publication / peripheral 配置边界` |
| 状态 owner、boundary gate、audit 语义可被配置放宽 | 这是 formal forbidden 问题。 | `禁止配置化边界` |
| RuntimeConfig 字段、fallback 开关名、cache / projection driver、URL、timeout 数值、索引 / projection schema | 已下沉到实现契约和配置说明。 | `03 / 04` 承接边界 |
| 旧 snapshot / fingerprint / projection rebuild / outbox replay 主线 | 当前只能退回 freshness / material / maintenance 语义,不得复活旧主线。 | 永不回流当前模块 |

#### R1.12.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 Query 判定规则定稿 | pass | 已固定读取面主语、visibility 定位、degraded 边界和 `Query no-write` 前提。 |
| 是否形成 Query read surface 配置影响表 | pass | 已覆盖 8 组读取面。 |
| 是否形成 visibility / degraded 语义表 | pass | 已把 not visible、stale、unavailable、partial、degraded 明确限制在读取面。 |
| 是否形成红线约束表 | pass | 已逐条回指 Query、body-free、external、peripheral、job 红线。 |
| 是否完成分流说明 | pass | 已把 direct seam、body-free / publication、forbidden、`03 / 04` 分开。 |
| 是否提前写配置影响主表正文 | no | 本模块未写正式 `§11` 主表、forbidden 表或 `03 / 04` 正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11,下一步只允许进入 body-free / publication / peripheral 先思考。 |

#### R1.12.7 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `body-free / publication / peripheral 配置边界:先思考`。

下一模块只允许回答:

1. 哪些 body-free、publication、handoff、peripheral discovery seam 会受配置影响。
2. 这些影响如何只停留在 summary / ref / marker / candidate / discovery surface,而不放宽正文边界或 delivery 语义。
3. `candidate 不等于 delivery`、`body-free 不可绕过`、`外围不污染核心` 如何约束这些 seam。
4. 哪些内容仍必须留给 forbidden 模块或 `03 / 04` 承接模块。

下一模块不得写:

1. 本仓配置影响轮廓表正文。
2. 禁止配置化边界表正文。
3. `03 / 04` 承接正文。
4. 正式 §11 回填草稿。
5. 正式 `02-概要设计.md`。

next_allowed_action: 等待用户确认后进入 Step 11 `body-free / publication / peripheral 配置边界:先思考`;只思考 body-free summary / ref / marker、publication candidate / handoff、peripheral discovery / package / assembly seam 的配置影响范围、与 Query / direct seam / forbidden / `03 / 04` 的分工和排除项,不得写本仓配置影响轮廓表、forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.13 body-free / publication / peripheral 配置边界:先思考

#### R1.13.1 本模块问题

本模块只回答“哪些 body-free、publication、handoff、peripheral discovery seam 会受配置影响,以及这些影响如何严格停留在 summary / ref / marker / candidate / discovery surface 上”。它不直接写配置影响轮廓表正文、forbidden 正文、`03 / 04` 承接正文或正式 §11 草稿。

本模块需要先想清楚五个问题:

1. 哪些 body-free summary / ref / marker 承接面会受配置影响。
2. 哪些 publication / handoff / collaboration seam 会受配置影响,但只能停留在 candidate / handoff surface。
3. 哪些 peripheral package / assembly / discovery seam 会受配置影响,但只能停留在外围增强与发现语义。
4. `body-free 不可绕过`、`candidate 不等于 delivery`、`外围不污染核心`、`外部缺失不回滚 truth` 如何约束这些 seam。
5. 哪些候选必须留给 direct seam、Query 模块、forbidden 模块或 `03 / 04` 承接模块。

#### R1.13.2 当前来源判断

当前“body-free / publication / peripheral 配置边界”的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 7 Inbound / Outbound / Peripheral 骨架 | 已固定 Inbound 只承接 body-free fact,Outbound 只表达 fact / material / maintenance / peripheral candidate,peripheral 只承接 package / assembly / discovery。 | 锁定本模块主语必须来自 body-free intake、candidate / handoff、peripheral discovery 三个边界面。 |
| Step 8 处理流 | 已固定 Inbound 只做 body-free intake,Outbound 只到 event candidate,外围只做 package / assembly / composition / discovery,不反写核心。 | 固定本模块只能讨论边界语义和安全表面,不能回到正文、delivery 或 marketplace 交易。 |
| Step 9 状态机 | 已固定 external unavailable 不回滚 truth、event candidate 不等于 delivery、peripheral unavailable 不污染核心。 | 固定本模块的配置影响只能作用在 accepted / rejected / unavailable / candidate / discovery / availability surface。 |
| Step 10 external / publication / peripheral 异常边界 | 已分别完成 body-free 边界、publication / handoff 边界、外围异常边界。 | 本模块直接承接这些异常红线作为配置边界。 |
| `R1.10` 与 `R1.12` | direct seam 已收 runtime assembly,Query 已收读取面降级。 | 本模块只讨论边界对象本身,不重复 runtime seam 和 Query read surface。 |

#### R1.13.3 body-free / publication / peripheral 判定原则

当前配置影响进入本模块,至少需要同时满足以下原则:

| 原则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 主语必须是边界 surface owner | 候选必须是 summary、typed ref、digest hint、marker、safe reason、candidate、handoff hint、peripheral discovery / package / assembly surface。 | 转回 direct seam、Query 或 forbidden 模块。 |
| body-free 只承接摘要化对象 | 进入本模块的 body-free 语义只能围绕 summary / ref / digest / marker / safe reason。 | 不得引入 raw body、provider payload、archive 包体或正文摘录。 |
| publication 只停在 candidate / handoff | publication 配置影响只能作用于 candidate produced、handoff blocked、downstream unavailable、report / export safe surface。 | 不得扩展成 delivery、relay、receipt、subscriber、dead letter 语义。 |
| peripheral 只停在外围增强 | peripheral 配置影响只能作用于 package、method set、composition、discovery context、peripheral availability。 | 不得把外围能力变成核心定义、正式化、消费或追溯成立前置。 |
| 红线先于配置成立 | 若某项影响会放宽正文边界、delivery 语义或外围隔离,则不属于本模块正常配置影响。 | 转入 forbidden 模块。 |

#### R1.13.4 边界候选族判断

当前本模块候选可先按三族判断:

| 候选族 | 是否进入本模块 | 可能受配置影响的边界面 | 当前提醒 |
|---|---|---|---|
| body-free summary / ref / marker 边界 | yes | external summary accepted surface、external source ref、artifact archive ref、body boundary violation marker、safe reason、lineage hint | 只允许影响 summary / ref / marker 的承接与呈现,不得让正文或包体穿透 |
| publication / handoff / collaboration 边界 | yes | event candidate、handoff hint、downstream unavailable surface、report / export safe surface、collaboration blocked hint | 只允许影响 candidate / handoff 的边界表面,不得把 candidate 写成 delivery |
| peripheral package / assembly / discovery 边界 | yes | package / assembly view、composition diagnostic、discovery context、peripheral availability、history / candidate surface | 只允许影响外围增强和发现语义,不得让外围 unavailable 回流核心 |

#### R1.13.5 Step 10 红线下的边界约束

| 红线 | 当前边界允许做什么 | 当前边界不得做什么 |
|---|---|---|
| `body-free 不可绕过` | 只承接 safe summary、typed ref、digest hint、marker、safe reason、archive ref。 | 因配置存在就允许 raw document、artifact body、archive 包、provider payload、证据正文入仓。 |
| `candidate 不等于 delivery` | 只表达 candidate produced、handoff target、downstream unavailable、report / export safe surface。 | 进入 topic、payload schema、relay、receipt、retry、dead letter 或投递保证语义。 |
| `外围不污染核心` | 只让 package / assembly / discovery 影响外围读取面、发现面和候选输出面。 | 把外围 availability、composition、marketplace context 写成核心 prerequisite 或核心 failure。 |
| `外部缺失不回滚 truth` | external summary / ref unavailable 只能形成 unavailable / rejected / follow-up / hint surface。 | 把外部缺失写成 formal version、relation、trace 或既有 truth 失效。 |
| `Query no-write` / `Job 不修 truth` | Query / Job 可读取或刷新这些边界 surface 的提示、freshness 或 availability。 | 借 Query 或 Job 补 body-free intake、补 publication delivery、补外围 truth。 |

#### R1.13.6 当前排除与延后

| 候选 | 当前排除原因 | 后续位置 |
|---|---|---|
| source binding、publisher binding、timeout、retry、transport target | 这是 direct seam,不是边界 surface 本身。 | `R1.10` direct seam 已处理 |
| visibility、degraded、projection availability、read fallback | 这是 Query 读取面问题。 | `R1.12` Query 模块已处理 |
| boundary gate、audit 语义、状态 owner 是否可配置放宽 | 这是 formal forbidden 问题。 | `禁止配置化边界` |
| RuntimeConfig 字段、env、default、topic 名、handoff channel、URL、secret 名、report root path、市场化上下文参数 | 已下沉到实现契约和配置说明层。 | `03 / 04` 承接边界 |
| 旧 outbox / relay / snapshot / plugin / configuration 主线 | 当前只能保留 candidate、body-free、package / assembly / discovery 语义,不得复活旧主线。 | 永不回流当前模块 |

#### R1.13.7 下一写入批次边界

下一批 `body-free / publication / peripheral 配置边界:再写入` 只允许把本模块思考收敛为:

1. body-free / publication / peripheral 判定规则定稿。
2. body-free / publication / peripheral 配置影响表。
3. Step 10 红线约束表。
4. 排除清单与分流说明。
5. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. 禁止配置化边界表正文。
3. `03 / 04` 承接正文。
4. 正式 §11 回填草稿。
5. 正式 `02-概要设计.md`。

#### R1.13.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 body-free / publication / peripheral 候选、边界原则、红线约束和延后项。 |
| 是否保持 body-free 边界 | pass | 已明确只允许 summary / ref / marker / safe reason,不允许正文 / 包体穿透。 |
| 是否保持 candidate 不等于 delivery | pass | 已明确 publication 只停在 candidate / handoff surface。 |
| 是否保持外围不污染核心 | pass | 已明确外围只影响 discovery / package / assembly / availability surface。 |
| 是否与 direct seam / Query / forbidden 分工清楚 | pass | 已完成三类分流。 |
| 是否提前写配置影响主表正文 | no | 本模块未写正式 `§11` 主表、forbidden 表或 `03 / 04` 正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 body-free / publication / peripheral 模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `body-free / publication / peripheral 配置边界:再写入`;只写 body-free / publication / peripheral 判定规则、配置影响表、红线约束表、排除清单、分流说明和停审记录,不得写本仓配置影响轮廓表、forbidden / `03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.14 body-free / publication / peripheral 配置边界:再写入

#### R1.14.1 body-free / publication / peripheral 判定规则定稿

本模块定稿后,Step 11 对 body-free / publication / peripheral 配置影响的判断统一采用以下规则:

| 规则 | 定稿口径 | 回指 |
|---|---|---|
| 主语必须是边界 surface owner | 只把 summary、typed ref、digest hint、marker、safe reason、candidate、handoff hint、package / assembly / discovery surface 视为本模块主语。 | Step 7 Inbound / Outbound / Peripheral 骨架。 |
| body-free 只承接摘要化对象 | body-free 配置影响只能作用于 summary / ref / digest / marker / safe reason / archive ref 的承接和呈现。 | Step 7 Inbound 红线;Step 10 external / inbound / body-free 边界。 |
| publication 只停在 candidate / handoff | publication 配置影响只能作用于 candidate produced、handoff blocked、downstream unavailable、report / export safe surface。 | Step 8 Outbound candidate only;Step 10 publication / handoff 红线。 |
| peripheral 只停在外围增强 | peripheral 配置影响只能作用于 package、method set、composition、discovery context、peripheral availability。 | Step 7 / Step 9 peripheral 边界。 |
| 红线先于配置成立 | 若某项影响会放宽正文边界、delivery 语义、外围隔离或 truth owner,则不属于本模块正常配置影响。 | Step 10 全局红线。 |

#### R1.14.2 body-free / publication / peripheral 配置影响表

| 边界面 | 是否受配置影响 | 配置影响类型 | 允许影响 | 明确禁止 |
|---|---|---|---|---|
| body-free summary / ref / marker 承接面 | 是 | accepted surface routing、typed ref readability、digest / marker source、safe reason / lineage hint routing | 影响 external summary accepted、source ref、artifact archive ref、body boundary violation marker 的承接与可见表面 | 接收 raw document、artifact body、archive 包、provider payload、证据正文或正文摘录 |
| publication candidate / handoff 面 | 是 | candidate routing、handoff target selection、downstream unavailable surface、report / export safe surface | 影响 event candidate、handoff hint、collaboration blocked、downstream unavailable 的边界呈现 | 把 candidate 写成 delivery、引入 topic / payload / relay / receipt / dead letter 主线 |
| peripheral package / assembly / discovery 面 | 是 | discovery context availability、package / assembly availability、composition diagnostic routing、peripheral candidate surface | 影响 package / assembly / discovery 的 availability、history、candidate 和 safe diagnostic 表面 | 把外围 capability 变成核心 prerequisite,或把 marketplace / install / transaction 写成本仓 truth |

#### R1.14.3 Step 10 红线约束表

| 红线 | 当前边界允许做什么 | 当前边界不得做什么 |
|---|---|---|
| `body-free 不可绕过` | 只承接 safe summary、typed ref、digest hint、marker、safe reason、archive ref | 因配置存在就允许 raw body、包体、provider payload、证据正文入仓 |
| `candidate 不等于 delivery` | 只表达 candidate produced、handoff target、downstream unavailable、report / export safe surface | 进入 topic、payload schema、relay、receipt、retry、dead letter 或 delivery guarantee 语义 |
| `外围不污染核心` | 只让 package / assembly / discovery 影响外围读取面、发现面和候选输出面 | 把外围 availability / composition / marketplace context 写成核心 prerequisite 或核心 failure |
| `外部缺失不回滚 truth` | external summary / ref unavailable 只形成 unavailable / rejected / follow-up / hint surface | 把 external 缺失写成 formal version、relation、trace 或既有 truth 失效 |
| `Query no-write` / `Job 不修 truth` | Query / Job 可读取、刷新或暴露这些边界 surface 的 freshness / availability / hint | 借 Query 或 Job 补 body-free intake、补 publication delivery、补外围 truth |

#### R1.14.4 排除清单与分流说明

| 排除项 | 不在本模块展开的原因 | 去向 |
|---|---|---|
| source binding、publisher binding、timeout、retry、transport target | 这是 direct seam,不是边界 surface 本身。 | `R1.10` direct seam 已处理 |
| visibility、degraded、projection availability、read fallback | 这是 Query 读取面问题。 | `R1.12` Query 模块已处理 |
| boundary gate、audit 语义、状态 owner 是否可配置放宽 | 这是 formal forbidden 问题。 | `禁止配置化边界` |
| RuntimeConfig 字段、env、default、topic 名、handoff channel、URL、secret 名、report root path、市场化上下文参数 | 已下沉到实现契约和配置说明层。 | `03 / 04` 承接边界 |
| 旧 outbox / relay / snapshot / plugin / configuration 主线 | 当前只能保留 candidate、body-free、package / assembly / discovery 语义,不得复活旧主线。 | 永不回流当前模块 |

#### R1.14.5 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成判定规则定稿 | pass | 已固定 body-free、publication、peripheral 三类边界的主语、红线前置和语义停留层。 |
| 是否形成配置影响表 | pass | 已覆盖 body-free、candidate / handoff、package / assembly / discovery 三类边界面。 |
| 是否形成红线约束表 | pass | 已逐条回指 body-free、candidate、peripheral、external、Query / Job 红线。 |
| 是否完成分流说明 | pass | 已把 direct seam、Query、forbidden、`03 / 04` 分开。 |
| 是否保持 body-free 边界 | pass | 未允许正文、包体、provider payload 或证据正文穿透。 |
| 是否保持 candidate 不等于 delivery | pass | 未回流 delivery / relay / outbox 主线。 |
| 是否保持外围不污染核心 | pass | 未把 package / assembly / discovery 写成核心 prerequisite。 |
| 是否提前写配置影响主表正文 | no | 本模块未写正式 `§11` 主表、forbidden 表或 `03 / 04` 正文。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11,下一步只允许进入 forbidden 模块先思考。 |

#### R1.14.6 下一模块边界

下一动作必须等待用户确认后进入 Step 11 `禁止配置化边界:先思考`。

下一模块只允许回答:

1. 哪些规则、状态 owner、审计链、一致性门禁、truth owner、body-free / delivery / peripheral 隔离属于不可配置化边界。
2. 这些边界为什么不能被 profile、开关、adapter 选择、fallback、job 策略或外围 enablement 改写。
3. 哪些内容必须作为 formal forbidden 写入独立表,而不是留在 direct seam / Query / body-free 模块。
4. 哪些内容仍必须留给 `03 / 04` 承接模块。

下一模块不得写:

1. 本仓配置影响轮廓表正文。
2. `03 / 04` 承接正文。
3. 正式 §11 回填草稿。
4. 正式 `02-概要设计.md`。

next_allowed_action: 等待用户确认后进入 Step 11 `禁止配置化边界:先思考`;只思考不可被配置改写的规则、状态 owner、truth owner、body-free / delivery / peripheral 隔离、一致性门禁和审计链边界,不得写本仓配置影响轮廓表、`03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.15 禁止配置化边界:先思考

#### R1.15.1 本模块问题

本模块只回答“哪些边界根本不能被配置改写”。它不直接写正式 forbidden 表正文、`03 / 04` 承接正文或正式 §11 草稿。

本模块需要先想清楚五个问题:

1. 哪些规则、状态 owner、truth owner、审计链、一致性门禁、body-free / delivery / peripheral 隔离属于 formal forbidden。
2. 这些边界为什么不能被 profile、enablement、adapter selection、fallback、job strategy 或外围 capability 改写。
3. 哪些内容虽然前面看起来受配置影响,但只是 runtime seam / Query read surface / body-free 表面,不应误判成 forbidden。
4. 哪些边界必须单独写入 forbidden 表,而不能散落在 direct seam、Query、body-free 模块里。
5. 哪些内容仍应留给 `03 / 04` 承接,不能在本模块下沉成 config schema 或 validator 细节。

#### R1.15.2 当前来源判断

当前“禁止配置化边界”的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| Step 5 组成部分边界 | 已固定核心闭环、支撑语义、维护支撑、外围增强的 owner 与“不由谁处理”。 | 锁定 truth owner、Definition vs Use、外围非前置等禁止被配置改写。 |
| Step 8 处理流 | 已固定 Command 写 truth、Query 只读、Inbound body-free、Outbound candidate only、Job 只维护派生材料。 | 锁定读写分层和边界类型不能被配置翻转。 |
| Step 9 状态机 | 已固定状态 owner、传播主线、`Query no-write`、`Job 不修 core truth`、`event candidate 不等于 delivery`、`外围不可用不污染核心`。 | 锁定状态 owner 和传播红线是 formal forbidden。 |
| Step 10 异常与边界场景 | 已固定 body-free、candidate、external 缺失不回滚、peripheral 隔离、一致性阻断等全局红线。 | 锁定这些红线不能被配置绕开。 |
| `R1.8` / `R1.10` / `R1.12` / `R1.14` | 已分别收稳核心间接受影响、direct seam、Query 边界、body-free / publication / peripheral 边界。 | 作为 forbidden 的反例基线:凡是已被裁定为“可配置运行面”的,不应再误写成 formal forbidden。 |

#### R1.15.3 formal forbidden 判定原则

某项内容要进入 forbidden 模块,至少需要同时满足以下原则:

| 原则 | 必须满足 | 不满足时处理 |
|---|---|---|
| 该项属于业务边界而非运行承载 | 它定义的是 owner、truth、状态机、审计、一致性、边界保护或仓间隔离,而不是入口 / adapter / timeout / batch / fallback。 | 回退到 direct seam / Query / body-free 模块。 |
| 一旦被改写会破坏仓边界或业务语义 | 配置改写会导致 truth owner 错位、状态 owner 错位、审计失真、delivery 语义越界、外围反向污染核心等。 | 不进入 forbidden。 |
| 不能通过 safe degraded surface 解决 | 如果问题可以只靠 unavailable / stale / partial / safe summary surface 表达,它更可能属于 Query 或 body-free 模块。 | 回退到 Query / body-free 模块。 |
| 不能通过 `03 / 04` 细化来“合法化” | 这类边界无论后续配置设计多细,也不能被放宽。 | 若只是字段 / schema / validator 细节,留给 `03 / 04`。 |
| 必须在正式 §11 单独显式提醒 | 若不单独列出,后续容易在实现或讨论中被配置化误解。 | 进入 forbidden 表候选。 |

#### R1.15.4 formal forbidden 候选族判断

当前 forbidden 候选可先按六族判断:

| forbidden 族 | 是否进入本模块 | 当前候选 | 初步理由 |
|---|---|---|---|
| truth owner / Definition vs Use | yes | 方法资产定义 truth owner、本仓不接下游 Use truth、不接治理执行正文、不接外部正文 | 这些边界一旦被配置改写,仓定位会失效。 |
| 状态 owner / 状态机 / 传播主线 | yes | formalization / version / availability / trace / relation / peripheral 的 owner,以及 `event candidate != delivery` 主线 | 这些是业务状态语义,不能被 profile 或 adapter 改写。 |
| Query / Job / Inbound / Outbound 读写分层 | yes | `Query no-write`、`Job 不修 truth`、Inbound 只 body-free、Outbound 只 candidate | 这是处理流类型边界,不能被配置翻转。 |
| body-free / delivery / external boundary | yes | raw body 禁入、provider payload 禁入、delivery 语义后置、external 缺失不回滚 truth | 这是安全与边界保护主线,不能因为接入配置存在而放宽。 |
| 审计 / trace / consistency protection | yes | audit 不等于 raw log、trace / lineage 不等于 payload、consistency gate 不可跳过 | 这些是解释与保护机制,不能退化成日志开关或快速通道。 |
| peripheral isolation | yes | package / assembly / discovery 不得成为核心 prerequisite,marketplace / install / transaction 不入仓 | 这是外围增强隔离边界,不能因为外围启用而改写核心闭环。 |

#### R1.15.5 当前易误判项

以下内容容易被误写进 forbidden,但当前更适合保留在别的模块:

| 易误判项 | 为什么不是本模块第一落点 | 正确位置 |
|---|---|---|
| timeout、batch、retry、cursor、schedule | 这是运行策略,不是业务边界本身。 | direct seam |
| read fallback、projection availability、freshness hint | 这是读取面降级,不是 formal forbidden。 | Query 模块 |
| candidate routing、handoff safe surface、peripheral candidate surface | 这是边界 surface 的可配置表面,不是“永不可配置”的规则。 | body-free / publication / peripheral 模块 |
| RuntimeConfig 字段、validator 规则名、env、default | 这是后续实现契约和配置说明。 | `03 / 04` 承接 |
| 某个 adapter 不可用时的 safe unavailable 处理 | 这是降级策略,不是 owner / truth / 状态语义本身。 | direct seam 或 Query 模块 |

#### R1.15.6 下一写入批次边界

下一批 `禁止配置化边界:再写入` 只允许把本模块思考收敛为:

1. formal forbidden 判定规则定稿。
2. 禁止配置化边界候选表。
3. 易误判项排除表。
4. 与 direct seam / Query / body-free / `03 / 04` 的分流说明。
5. 停审记录和下一模块边界。

不得写:

1. 本仓配置影响轮廓表正文。
2. `03 / 04` 承接正文。
3. 正式 §11 回填草稿。
4. 正式 `02-概要设计.md`。

#### R1.15.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 forbidden 候选、判定原则、误判项和下一写入边界。 |
| 是否把运行承载与业务边界分开 | pass | 已把 runtime seam / Query / body-free 表面与 formal forbidden 区分。 |
| 是否回指了 Step 5~10 红线 | pass | 已把 owner、状态机、读写分层、body-free、candidate、peripheral 隔离回指到前序结论。 |
| 是否避免下沉到 `03 / 04` 细节 | pass | 未写 schema、validator、env、default 或字段级实现。 |
| 是否提前写 forbidden 正文 | no | 本模块仍停在先思考。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11 forbidden 模块。 |

next_allowed_action: 等待用户确认后进入 Step 11 `禁止配置化边界:再写入`;只写 formal forbidden 判定规则、禁止配置化边界候选表、易误判项排除表、分流说明和停审记录,不得写本仓配置影响轮廓表、`03 / 04` 正文或正式 §11 草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.16 禁止配置化边界:再写入

#### R1.16.1 本批写入目标

本批只把 `R1.15` 的思考收口成当前模块允许的中间产物:

1. formal forbidden 判定规则定稿。
2. 禁止配置化边界候选表。
3. 易误判项排除表。
4. 与 direct seam / Query / body-free / `03 / 04` 的分流说明。
5. 停审记录和下一模块边界。

本批仍不得写:

1. 本仓配置影响轮廓表正文。
2. `03 / 04` 承接正文。
3. 正式 `§11` 回填草稿。
4. 正式 `02-概要设计.md`。

#### R1.16.2 formal forbidden 判定规则定稿

| 判定规则 | 定稿口径 | 不满足时的去向 |
|---|---|---|
| 业务边界优先 | 只有 truth owner、Definition vs Use、状态 owner、审计链、一致性门禁、body-free / delivery / peripheral 隔离这类业务边界才能进入 formal forbidden。 | 回退到 direct seam、Query 或 body-free 模块。 |
| 改写后会破坏仓语义 | 一旦允许配置改写,会导致本仓 owner 失真、状态主线翻转、审计失真、外围反向污染核心或 delivery 语义越界。 | 不进入 forbidden。 |
| 不能靠 safe surface 吸收 | 如果问题能通过 unavailable、stale、partial、safe summary、candidate surface 表达,它优先属于读取面或接缝面,不是 formal forbidden。 | 回退到 Query 或 body-free 模块。 |
| 不能靠 `03 / 04` 细化合法化 | 这类边界即使后续补齐 RuntimeConfig、validator、adapter schema 或配置说明,也不能被放宽。 | 若只是实现契约或说明细节,留给 `03 / 04`。 |
| 必须在正式 `§11` 单独显式提醒 | 若不单独列出,后续讨论或实现很容易把它误降级为“可配置运行面”。 | 保留为 forbidden 表候选。 |

#### R1.16.3 禁止配置化边界候选表

| 禁止配置化边界候选 | 所属族 | 禁止原因 | 若需改变应回到哪里 |
|---|---|---|---|
| Definition vs Use 分离,本仓不接下游 Use truth | truth owner / Definition vs Use | 一旦允许配置接入消费态、运行态或执行态 truth,本仓定位会被改写。 | 回到 `00-需求文档.md` 范围边界、`01-架构设计.md` 数据所有权和 Step 5 组成部分边界。 |
| 方法资产定义 truth owner 不迁移 | truth owner / Definition vs Use | 方法资产定义、正式化结果、定义性关系和受控消费前提必须仍由本仓拥有。 | 回到 `01-架构设计.md` 系统边界 / 数据所有权和 Step 5 主体边界。 |
| 状态 owner、状态机词表和非法迁移红线 | 状态 owner / 状态机 / 传播主线 | profile、enablement、adapter selection 不能改写 formalization、availability、trace、relation 或 peripheral 的状态语义。 | 回到 Step 9 和后续 03 状态矩阵 / transition 设计。 |
| `Query no-write`、`Job 不修 core truth`、Inbound 只 body-free、Outbound 只 candidate | 读写分层 | 配置不能把处理流类型边界翻转,否则 Query、Job、Consumer 会变成隐式写源。 | 回到 Step 8 / Step 10 处理流和后续 03 function flow。 |
| raw body、provider payload、archive 正文、下游运行正文禁止入仓 | body-free / delivery / external boundary | 这些内容只能被摘要、ref、marker 或 safe reason 承接,不能因为接入配置存在而放宽。 | 回到 00 / 01 的正文边界和后续 03 summary / ref 契约。 |
| `event candidate != delivery`,handoff / publish 不得前置成 delivery truth | body-free / delivery / external boundary | transport、topic、publisher adapter 只能影响 candidate / handoff,不能把 delivery 语义提早塞回核心成立边界。 | 回到 Step 8 / Step 9 / Step 10 和后续 03 publication / handoff 设计。 |
| audit / trace / lineage / safe diagnostic 不等于 raw log / payload / telemetry | 审计 / trace / consistency protection | 配置不能用日志、观测或 adapter 原始响应替代正式审计链与追溯语义。 | 回到 Step 8 / Step 10 和后续 03 object / port / evidence 设计。 |
| basis / reference / expected-version / consistency gate 不可跳过 | 审计 / trace / consistency protection | 并发冲突、basis 缺失、boundary 拒绝和 reference 不一致必须显式阻断,不能靠开关静默放行。 | 回到 Step 10 和后续 03 consistency / error recovery / persistence 设计。 |
| external 缺失、adapter unavailable、transport 失败不回滚核心 truth | 读写分层 / consistency protection | 外部可用性只能影响 safe degraded、candidate、progress 或 issue,不能反向改写已成立的核心 truth。 | 回到 Step 10 和后续 03 degraded / publication / maintenance 设计。 |
| peripheral package / method set / marketplace discovery 不得成为 P0 核心 prerequisite | peripheral isolation | 外围增强可以启停或降级,但不能通过配置反向成为核心闭环前提。 | 回到 `00-需求文档.md` P0 / P1 范围、Step 5 和 Step 8。 |

#### R1.16.4 易误判项排除表

| 易误判项 | 为什么不进入 formal forbidden | 正确归属 |
|---|---|---|
| timeout、batch、retry、cursor、schedule、parallelism | 这是运行节奏与吞吐策略,不是业务 owner 或边界语义。 | direct seam |
| projection availability、read fallback、freshness hint、stale / partial surface | 这是读取面降级与可用性表达,不是“永不可配置”的业务边界。 | Query / visibility / degraded 模块 |
| candidate routing、handoff safe surface、publisher target、peripheral candidate surface | 这是接缝层 surface 和目标选择,并不等于 delivery / truth 语义本身。 | body-free / publication / peripheral 模块 |
| RuntimeConfig 字段、validator 规则名、config source、env、default、secret ref spelling | 这是后续实现契约和配置说明的展开内容。 | `03 / 04` 承接边界 |
| adapter unavailable 时的 safe unavailable / skipped / degraded 处理 | 这是可配置的 safe failure surface,不是 owner / truth / 状态主线本身。 | direct seam 或 Query 模块 |

#### R1.16.5 与其他模块的分流说明

| 去向模块 | 当前模块只保留什么 | 分流后的内容 |
|---|---|---|
| direct seam | 只保留“不能把运行参数误写成业务边界”的红线。 | timeout、batch、retry、cursor、schedule、adapter kind、transport binding、profile、enablement。 |
| Query / visibility / degraded | 只保留“读取面不能反写 truth、不能替代 forbidden”的红线。 | projection availability、fallback、freshness、partial、safe diagnostic surface。 |
| body-free / publication / peripheral | 只保留“candidate 不等于 delivery、外围不反向污染核心”的红线。 | candidate routing、handoff surface、discovery / package / assembly seam、外围降级表面。 |
| `03 / 04` 承接边界 | 只保留“formal forbidden 不能被后续配置说明合法化”的原则。 | RuntimeConfig、ConfigValidator、schema、key、default、env、secret、装配说明。 |

#### R1.16.6 停审记录

本批收口后,Step 11 的 forbidden 模块结论为:

- formal forbidden 已固定为业务边界审查模块,不再与 direct seam、Query、body-free 混写。
- 当前已足够支撑下一模块讨论 `03 / 04` 承接边界。
- 仍不得回写本仓配置影响轮廓表、正式 `§11` 草稿或正式 `02-概要设计.md`。
- 仍不得进入旧材料差异审计、正式回填草稿或 Step 12。

#### R1.16.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写当前门禁允许内容 | pass | 只写了判定规则、候选表、排除表、分流说明和停审记录。 |
| 是否回指 `R1.15` 与 Step 5~10 红线 | pass | 所有 forbidden 候选均可回指到 owner、状态机、body-free、candidate、consistency 和 peripheral 隔离红线。 |
| 是否把运行参数误写成业务边界 | pass | timeout / batch / retry / schedule 等已明确排除。 |
| 是否下沉到 `03 / 04` 细节 | pass | 未写 key、schema、default、env、secret、validator 细节。 |
| 是否提前写本仓配置影响轮廓表或正式 `§11` | no | 当前仍停在 forbidden 收口阶段。 |
| 是否修改正式 `02-概要设计.md` | no | 本批未修改正式文档。 |
| 是否进入 Step 12 | no | 当前只推进到 Step 11 `03 / 04` 承接边界:先思考 的前置门禁。 |

next_allowed_action: 等待用户确认后进入 Step 11 `03 / 04` 承接边界:先思考;只思考哪些实现契约必须交给 `03-详细设计.md`,哪些配置说明必须交给 `04-配置设计.md`,以及哪些内容仍不得在概要层下沉为 key / schema / default / env / secret / validator 细节,不得写旧材料差异审计、正式 `§11` 回填草稿或正式 `02-概要设计.md`,不得进入 Step 12。

### R1.17 `03 / 04` 承接边界:先思考

#### R1.17.1 本模块问题

本模块只回答“Step 11 已识别出的配置影响,哪些必须交给 `03-详细设计.md` 闭合实现契约,哪些必须交给 `04-配置设计.md` 说明填写与使用方式”。它不直接写 `03 / 04` 承接正文、旧材料差异审计、正式 `§11` 回填草稿或正式 `02-概要设计.md`。

本模块需要先想清楚五个问题:

1. `03` 与 `04` 的分工边界到底按什么原则切分。
2. 前面 direct seam、Query、body-free / peripheral、forbidden 已收稳的内容,各自应如何落到 `03` 或 `04`。
3. 哪些内容虽然与配置相关,但仍然不应写进 `03 / 04`,而应留给 Step 12、Step 13、`07-实施计划.md` 或实施材料。
4. 哪些内容最容易被误写成 key、schema、default、env、secret 或产品参数,从而提前掉出概要层。
5. 下一批“再写入”允许沉淀哪些表和说明,不允许写哪些正文。

#### R1.17.2 当前来源判断

当前 `03 / 04` 承接边界的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| SOP Step 11 | Step 11 只识别配置影响轮廓、禁止配置化边界和“交给详细设计展开的配置实现契约方向”。 | 锁定本模块只能讨论承接方向,不能落正式正文。 |
| 书写规范 §11 / §12 | `§11` 只写配置影响轮廓;`§12` 才写详细设计承接清单。 | 锁定本模块只为后续 Step 11 / Step 12 提供分工依据。 |
| 真相源闭环标准 | 详细设计中的配置章节只定义代码绑定点、adapter 选择、transport 映射、timeout / retry / retention / batch 等参数的读取位置;具体数值和填写方式留给 `04`。 | 锁定 `03` 只收口绑定点和 typed contract,`04` 才收口配置项说明。 |
| `R1.6` | 已完成配置影响来源池,明确哪些主语是概要层配置影响主语。 | 用来确定承接主题不能脱离已收稳主语。 |
| `R1.10` / `R1.12` / `R1.14` | 已完成 direct seam、Query、body-free / publication / peripheral 的配置影响边界。 | 用来拆分哪些配置影响需要代码绑定契约,哪些只需配置说明。 |
| `R1.16` | 已完成 formal forbidden 收口。 | 用来锁定 `03 / 04` 不得合法化 formal forbidden。 |
| `L1-governance` Step 11 | 已把 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig` 泛化为“后续细化”。 | 只借“先做分工、再进入承接清单”的框架,不借 governance 语义。 |

#### R1.17.3 `03 / 04` 分工原则

当前承接分工可先按以下原则判断:

| 分工原则 | `03-详细设计.md` | `04-配置设计.md` | 不属于本模块 |
|---|---|---|---|
| 代码绑定点优先 | 定义 runtime builder、loader、validator、entry context、adapter / job / query / publisher 绑定点。 | 不负责代码绑定点本身。 | 不写实现代码或部署脚本。 |
| typed contract 优先 | 定义 RuntimeConfig、AdapterConfig、JobConfig、ConfigError、disabled / degraded / unavailable 映射和合法 enum / schema 方向。 | 在 `03` 已有 contract 前提下说明具体配置来源、填写方式和 profile 语义。 | 不写 Rust 类型全集或实现细节。 |
| 具体配置项后置 | 不写 key、default、env、secret 名、文件路径、URL、topic 名、cron 表达式或具体数值。 | 负责说明这些项如何命名、填写、选择、校验和使用。 | 不写系统级挂载、容器、systemd 或平台脚本。 |
| 业务红线不被配置化 | 只声明配置绑定不能改写 truth owner、状态机、query no-write、job no-truth-repair、body-free、candidate / delivery 和 peripheral isolation。 | 只说明配置项也必须服从这些红线。 | 不允许在任一层放宽 formal forbidden。 |
| 仍需更下游落地的内容继续后移 | 可点名“需要 entry local args schema / report binary local args / implementation gate 承接”。 | 可点名“填写/运维说明继续后移”。 | 具体 CLI、argv、挂载、网络、发布流程留给 `07` 或实施材料。 |

#### R1.17.4 承接主题初步分组

当前 Step 11 已收稳的配置影响,下一批可先按以下承接主题分组:

| 承接主题组 | 应优先交给 `03` 的内容 | 应优先交给 `04` 的内容 |
|---|---|---|
| runtime 装配与加载 | runtime builder、ConfigLoader、ConfigValidator、profile 到 runtime seam 的注入关系 | 配置来源、profile 选择、文件 / env / secret 输入方式 |
| entry / consumer / publisher / job 绑定 | entry context factory、inbound / outbound / job 的 adapter binding、idempotency / timeout / cursor / report root 的读取位置 | endpoint / topic / source / schedule / retry / batch / report root 的填写和运维说明 |
| Query / degraded / safe failure | projection / material / fallback / unavailable / degraded 的 typed 映射和绑定点 | freshness、fallback、availability 策略的配置语义与可选项说明 |
| external summary / body-free / peripheral | external adapter、secret ref carrier、handoff / candidate / discovery 的 typed seam 和 disabled / degraded 映射 | source allowlist、adapter kind、marketplace context、package source 等配置项语义 |
| config 枚举与 schema 合法值 | adapter kind、store kind、profile kind、feature kind 等正式 schema / enum 方向与 validation 规则入口 | 每个值如何填写、默认 profile 如何选择、失败时如何使用 |
| 需继续后移的实现 / 运维项 | 只点名“还需 `07` / 实施承接”的 boundary | 只点名“还需部署 / 运维材料承接”的 boundary |

#### R1.17.5 当前易误判项

以下内容容易被误写进下一批 `03 / 04` 承接正文,当前必须先排除:

| 易误判项 | 为什么当前不能写 | 正确去向 |
|---|---|---|
| RuntimeConfig 字段全集、ConfigError 全量枚举、adapter constructor 参数表 | 这已经从承接边界滑到详细设计正文。 | 留到下一批 `03 / 04` 再写入时只写“主题级承接”,不在本模块展开正文。 |
| key、default、env、secret 名、URL、topic、cron、timeout 数值、retry 次数 | 这是 `04` 具体配置项层内容。 | `04-配置设计.md` |
| DB / queue / cache / search / object store / bus / archive 产品参数 | 这是产品和部署层参数。 | `04-配置设计.md` / `07-实施计划.md` / 实施材料 |
| CLI / argv / gate binary / report binary 的完整入口清单 | 这会提前掉入 entry local args 正文。 | `03` / `04` / `07` 后续正式闭口 |
| 借配置说明放宽 forbidden | 这会把 `R1.16` 的 redline 重新打散。 | 永不进入 `03 / 04` 放宽项 |

#### R1.17.6 下一写入批次边界

下一批 `03 / 04 承接边界:再写入` 只允许把本模块思考收敛为:

1. `03 / 04` 分工规则表。
2. 承接主题表。
3. 不得下沉内容排除表。
4. 与 Step 12、`07-实施计划.md`、实施材料的边界说明。
5. 停审记录和下一模块边界。

不得写:

1. 旧材料差异审计正文。
2. 正式 `§11` 回填草稿。
3. 正式 `02-概要设计.md`。
4. 任何 key、default、env、secret、schema 字段全集、URL、topic、cron 或参数值清单。

#### R1.17.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定 `03 / 04` 分工原则、主题分组、误判项和下一写入边界。 |
| 是否回指了 `R1.6` / `R1.10` / `R1.12` / `R1.14` / `R1.16` | pass | 当前承接边界基于已收稳的配置影响来源池、direct seam、Query、body-free 和 forbidden。 |
| 是否把 `03` 与 `04` 分清 | pass | `03` 负责绑定点和 typed contract,`04` 负责配置项填写与使用语义。 |
| 是否把 formal forbidden 留在红线内 | pass | 已明确 `03 / 04` 都不能合法化 forbidden。 |
| 是否提前写 `03 / 04` 正文 | no | 当前仍停在承接边界先思考。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11。 |

next_allowed_action: 等待用户确认后进入 Step 11 `03 / 04` 承接边界:再写入;只写 `03 / 04` 分工规则表、承接主题表、不得下沉内容排除表、与 Step 12 / `07-实施计划.md` / 实施材料的边界说明以及停审记录,不得写旧材料差异审计、正式 `§11` 回填草稿或正式 `02-概要设计.md`,不得进入 Step 12。

### R1.18 `03 / 04` 承接边界:再写入

#### R1.18.1 本批写入目标

本批只把 `R1.17` 的思考收口成当前模块允许的中间产物:

1. `03 / 04` 分工规则表。
2. 承接主题表。
3. 不得下沉内容排除表。
4. 与 Step 12、`07-实施计划.md`、实施材料的边界说明。
5. 停审记录和下一模块边界。

本批仍不得写:

1. 旧材料差异审计正文。
2. 正式 `§11` 回填草稿。
3. 正式 `02-概要设计.md`。
4. 任何 key、default、env、secret、schema 字段全集、URL、topic、cron 或参数值清单。

#### R1.18.2 `03 / 04` 分工规则表

| 分工主题 | `03-详细设计.md` 应负责 | `04-配置设计.md` 应负责 | 当前模块不写 |
|---|---|---|---|
| runtime 装配 | runtime builder、ConfigLoader、ConfigValidator、entry context、adapter / job / query / publisher 的绑定点与注入关系 | profile、source selector、配置来源选择与填写语义 | 代码实现、脚本、部署流程 |
| typed contract | RuntimeConfig、AdapterConfig、JobConfig、ConfigError、enum / schema 方向、disabled / degraded / unavailable 映射 | 各配置项如何填写、选择、校验和组合使用 | 类型全集、字段全集、构造函数参数表 |
| 读取位置与生效边界 | timeout / retry / batch / retention / cursor / report root 等运行参数“从哪里被读取” | 这些参数“怎么配、在哪里填、默认怎么选” | 具体参数值、URL、topic、cron |
| body-free / external / peripheral seam | external summary、handoff、candidate、discovery、package / assembly 的 typed seam 与 safe failure 映射 | source allowlist、adapter kind、外围能力启停、marketplace context 的配置语义 | 外部产品参数、履约流程、市场交易语义 |
| formal forbidden 约束 | 明确配置绑定不得改写 truth owner、状态机、query no-write、job no-truth-repair、body-free、candidate / delivery、peripheral isolation | 明确任何配置项也必须服从这些红线 | 借配置说明放宽 redline |
| 更下游落地 | 只点名需要 Step 12 / `07` / 实施继续承接的正式接口 | 只点名需要运维 / 发布 / 部署材料继续承接的说明 | CLI 清单、挂载脚本、平台参数明细 |

#### R1.18.3 承接主题表

| 承接主题 | 当前已收稳的概要层结论 | `03` 继续展开 | `04` 继续说明 |
|---|---|---|---|
| runtime 装配与加载 | 配置只可作用于 runtime seam,不得进入 domain invariant | runtime builder、loader、validator、profile 注入关系 | config source、profile 选择、文件 / env / secret 来源 |
| entry / consumer / publisher / job 绑定 | 同步入口、Inbound、Outbound、Job 受配置影响,但只在接缝与运行层生效 | entry context factory、transport / publisher / job binding、typed run / scope surface | endpoint / source / schedule / retry / batch / report root 的填写与运维语义 |
| Query / degraded / safe failure | Query 只读,配置只影响 availability / fallback / freshness / degraded surface | projection / material / fallback / unavailable 的 typed binding 与错误映射 | freshness / availability / fallback 策略的配置语义 |
| external summary / body-free / publication | external / handoff / candidate 只能停留在 summary / ref / marker / candidate surface | external adapter、secret ref carrier、candidate / handoff typed seam、safe failure 映射 | source allowlist、adapter kind、handoff target、外围发现配置语义 |
| config 枚举与合法值 | adapter kind、store kind、profile kind、feature kind 不能在实现侧私造字符串 | 正式 schema / enum 方向、validation 入口、失败映射 | 每个值的选择说明、默认 profile 语义、是否可用于 P0 |
| 需继续后移的边界 | 部分 local args、部署 / 发布 / 运维细节不属于概要层 | 只点名需要 Step 12 / `07` 承接的正式输入面 | 只点名需要实施 / 运维材料承接的填写说明 |

#### R1.18.4 不得下沉内容排除表

| 不得下沉内容 | 原因 | 正确去向 |
|---|---|---|
| RuntimeConfig 字段全集、ConfigError 完整枚举、adapter constructor 参数表 | 这已经从承接边界掉进详细设计正文。 | `03-详细设计.md` 正式装配阶段 |
| key、default、env、secret 名、URL、topic、cron、timeout / retry 数值 | 这是配置项和运维参数本体,不属于概要承接边界。 | `04-配置设计.md` |
| DB / queue / cache / search / object store / bus / archive 产品参数 | 这是产品和部署层实现。 | `04-配置设计.md` / `07-实施计划.md` / 实施材料 |
| 完整 CLI / argv / gate binary / report binary 输入清单 | 这是 local args / entry schema 的正式正文,不是当前分工边界。 | `03` / `04` / `07` 后续正式闭口 |
| 通过配置说明改写 formal forbidden | 会破坏 `R1.16` 已收稳的禁止配置化边界。 | 永不进入放宽项 |
| 旧 snapshot / outbox / relay / fingerprint / plugin 主线细节 | 这是历史材料污染,当前不能借承接边界回流。 | 如后续需要,重新在 `03 / 04` 正式闭口 |

#### R1.18.5 与 Step 12 / `07` / 实施材料的边界说明

| 后续去向 | 当前模块交付什么 | 后续再做什么 | 当前不做什么 |
|---|---|---|---|
| Step 12 详细设计承接清单 | 交付“哪些配置影响主题已由 Step 11 收稳,详细设计不能重新发明主语”。 | 把 Step 11 已收稳的配置影响主题列入详细设计输入清单。 | 不提前写 Step 12 正文。 |
| `03-详细设计.md` | 交付“哪些 runtime seam / typed contract 必须正式闭口”。 | 正式定义 binding point、typed config contract、failure mapping、enum / schema 方向。 | 不在当前模块写 03 正文。 |
| `04-配置设计.md` | 交付“哪些配置项说明必须单独成文”。 | 正式说明 key、default、env、secret、profile、填写与校验方式。 | 不在当前模块写 04 正文。 |
| `07-实施计划.md` | 交付“哪些 local args / implementation gate / 运维承接需要在实施边界显式列出”。 | 把 CLI / binary / report / gate / rollout 等实施输入列入 boundary 和 gate。 | 不写实施步骤、命令或脚本。 |
| 实施 / 运维材料 | 交付“哪些内容不是设计正文而是发布 / 部署 / 运维说明”。 | 写挂载、凭据、平台、网络、发布、观测、值班等材料。 | 不把实施材料塞回概要层。 |

#### R1.18.6 停审记录

本批收口后,Step 11 的 `03 / 04` 承接边界结论为:

- `03` 与 `04` 的职责已经按“代码绑定点 / typed contract”与“配置项填写 / 使用说明”稳定拆开。
- direct seam、Query、body-free / peripheral、forbidden 的配置影响已经都有对应承接去向。
- 当前已足够进入下一模块“旧材料差异审计”,审查旧 Step 11 completed 内容和当前正式 `§11` 的污染与可保留项。
- 仍不得回写正式 `§11`、正式 `02-概要设计.md` 或提前进入 Step 12。

#### R1.18.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写当前门禁允许内容 | pass | 只写了分工规则表、承接主题表、排除表、边界说明和停审记录。 |
| 是否回指 `R1.17` 固定分工原则 | pass | 本批完全基于 `R1.17` 的分工原则、主题分组和误判项。 |
| 是否把 `03` / `04` / Step 12 / `07` 分清 | pass | 已分别标出承接边界与后续责任。 |
| 是否避免下沉到 key / schema / default / env / secret | pass | 未写任何配置项明细或参数值。 |
| 是否提前写旧材料差异审计或正式 `§11` | no | 当前仍停在承接边界模块。 |
| 是否修改正式 `02-概要设计.md` | no | 本批未修改正式文档。 |
| 是否进入 Step 12 | no | 当前只推进到 Step 11 `旧材料差异审计:先思考` 的前置门禁。 |

next_allowed_action: 等待用户确认后进入 Step 11 `旧材料差异审计:先思考`;只思考当前文件旧 completed 内容、当前正式 `02-概要设计.md` `§11` 旧正文、历史配置线索和 L1-governance 参考框架中哪些属于污染、哪些可保留、哪些后续要在正式回填前剔除,不得写正式 `§11` 回填草稿或正式 `02-概要设计.md`,不得进入 Step 12。

### R1.19 旧材料差异审计:先思考

#### R1.19.1 本模块问题

本模块只回答“当前有哪些旧材料需要被视为污染审计对象,哪些内容可以保留为后续正式回填原料,哪些内容必须在正式回填前剔除或改写”。它不直接写审计表正文、正式 `§11` 回填草稿或正式 `02-概要设计.md`。

本模块需要先想清楚五个问题:

1. 哪些旧材料对象必须进入当前审计范围。
2. 判断某段旧内容是“污染 / 条件保留 / 可直接保留”的标准是什么。
3. 当前旧 Step 11 completed 内容、正式 `§11` 旧正文和历史配置线索里,哪些最可能与本轮 `R1.*` 结论冲突。
4. 哪些旧内容虽然来源旧,但只是结构性观察或文档编号影响,仍可作为后续回填参考。
5. 下一批“再写入”允许沉淀哪些审计表与停审记录,不允许提前写哪些正文。

#### R1.19.2 当前审计来源池

当前旧材料差异审计的第一来源来自:

| 审计来源 | 当前状态 | 本模块用途 |
|---|---|---|
| 本文件上方旧 completed 内容 | 已被 `R1.2.4` 明确降级为 historical material。 | 审计哪些执行状态、旧模块结论和旧回填动作不能继续作为当前 gate 依据。 |
| 当前正式 `02-概要设计.md` `§11` | 仍是旧 Step 11 在旧基线下回填的正文。 | 审计哪些表结构可留作回填壳,哪些具体语义需要剔除或改写。 |
| 本文件旧 `15. 模块 H:旧材料差异审计` | 属于旧 completed 版本里的审计结论。 | 审计其中哪些只是顺延 / 编号观察,哪些已不够支撑当前重开后的 Step 11。 |
| Step 5 / Step 8 / Step 9 / Step 10 当前结论 | 已形成本轮配置影响、body-free、状态机、异常红线基线。 | 作为判断旧内容是否污染的第一裁决依据。 |
| `R1.16` / `R1.18` | 已固定 formal forbidden 和 `03 / 04` 承接边界。 | 用来判断旧正文是否回流了 outbox / snapshot / dead-letter / 细节配置项等旧主线。 |
| `L1-governance` Step 11 | 只允许当框架参考,不允许当语义来源。 | 审计是否有 governance 语义、治理主语或控制口径被误带入本仓。 |

#### R1.19.3 审计判定原则

当前旧材料审计可先按以下原则判断:

| 判定原则 | 进入“污染 / 待剔除” | 进入“条件保留” | 进入“可保留” |
|---|---|---|---|
| 是否与本轮 gate 冲突 | 旧内容仍宣称 Step 11 completed、允许直入 Step 12、允许正式回填已生效。 | 只保留其“曾做过什么”的历史线索,不可当当前状态。 | 不适用。 |
| 是否与 Step 8~10 红线冲突 | 回流 delivery / relay / outbox / snapshot / fingerprint 主线,或弱化 Query no-write、Job 不修 truth、body-free、外围隔离。 | 结构壳可留,具体语义必须改写。 | 完全服从当前红线。 |
| 是否回流旧状态语义 | 使用旧 lifecycle、旧状态 owner、旧发布主线术语作为当前结论。 | 仅可保留为“待改写提示”。 | 不涉及旧状态语义。 |
| 是否只是文档结构观察 | 若结论仍绑定旧执行状态或旧 completed 假设,则不能直接保留。 | 编号顺延、文件迁移、章节重排这类观察可保留,但要重新挂到当前流程。 | 与当前重开流程一致的结构观察可保留。 |
| 是否引入 governance / 实施 / 运维语义 | 带入 governance shared rules、approval、decision、control 或实现 / 运维正文。 | 只可保留“作为外部参考框架”的备注。 | 完全未越界。 |

#### R1.19.4 旧材料候选池初判

当前待审对象可先按以下几类判断:

| 审计对象 | 当前初判 | 初步理由 |
|---|---|---|
| 本文件顶部 `状态已确认`、`当前模块: Step 11 已完成`、`模块 A~H completed`、`允许进入 Step 12` | 污染 / 待剔除 | 与当前重开门禁直接冲突,不能再作为执行状态。 |
| 本文件旧模块 G / H 中“已回填正式 `§11` / 已完成旧差异审计 / 已允许进入 Step 12” | 污染 / 待剔除 | 这些属于旧回填动作与旧完成门禁,不能作为当前流程依据。 |
| 本文件旧 `15. 模块 H` 中“旧 detail handoff 文件编号冲突、正式章节顺延编号” | 条件保留 | 这是结构观察,本轮仍可能成立,但要重新挂到当前 Step 12 / Step 13 / Step 14。 |
| 当前正式 `§11` 的章节壳: `11.1` 主表、`11.2` forbidden、`11.3` 承接说明、按需图不补 | 条件保留 | 章节壳符合新规范,但正文语义必须逐项复核。 |
| 正式 `§11` 中旧 lifecycle / 发布主线语义,如 `draft / in_review / published`、`accepted / published` | 污染 / 待剔除 | 与本轮 Step 5 / 9 禁止回流旧 lifecycle 主线冲突。 |
| 正式 `§11` 中 `dead letter`、`outbox`、`relay`、`snapshot`、`fingerprint` 倾向性表达 | 污染 / 待改写 | 当前只能保留 publication / handoff / candidate / freshness / maintenance 语义。 |
| 正式 `§11` 中只表达“配置只识别影响轮廓,不写 key / JSON / env / secret” | 可保留 | 与本轮 Step 11 的整体边界一致。 |
| `L1-governance` Step 11 的章节粒度、图和停审结构 | 条件保留 | 只可当框架参照,不得把 governance 语义带入本仓。 |

#### R1.19.5 当前重点污染线索

结合当前正式 `§11` 与旧 completed 内容,本轮应优先盯住以下污染线索:

| 污染线索 | 为什么要优先审计 |
|---|---|
| 旧 lifecycle / published 语义 | 当前 Step 5 / Step 9 已禁止回流旧 `draft / review / publish` 主线。 |
| outbox / relay / dead-letter / delivery 中心化叙事 | 当前 Step 8 / Step 10 / `R1.14` 只允许 publication / handoff / candidate 边界,不恢复 delivery 主线。 |
| snapshot / fingerprint / plugin / configuration 旧主线 | 当前只允许 freshness / material / package / assembly / discovery 语义,不能借配置章节回流旧机制。 |
| “Step 11 已完成、允许直入 Step 12” 的执行状态 | 这是当前文件最直接的 gate 污染。 |
| 把旧结构观察当成当前正式结论 | 例如旧差异审计表中的顺延动作,必须重新挂接到当前流程才能保留。 |

#### R1.19.6 下一写入批次边界

下一批 `旧材料差异审计:再写入` 只允许把本模块思考收敛为:

1. 旧材料差异审计表。
2. 污染 / 条件保留 / 可保留 分类表。
3. 后续剔除 / 改写动作表。
4. 停审记录和下一模块边界。

不得写:

1. 正式 `§11` 回填草稿。
2. 正式 `02-概要设计.md`。
3. Step 12 正文。
4. 对正式章节的直接替换动作。

#### R1.19.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定审计来源池、判定原则、候选池初判和下一写入边界。 |
| 是否回指当前红线而非凭旧文档自证 | pass | 审计判断均回指 Step 8~10、`R1.16` 和 `R1.18`。 |
| 是否把结构观察与旧执行状态分开 | pass | 已区分“可保留的章节壳 / 顺延观察”和“必须剔除的旧完成状态”。 |
| 是否避免提前写审计表正文 | pass | 当前仍停在先思考。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11。 |

next_allowed_action: 等待用户确认后进入 Step 11 `旧材料差异审计:再写入`;只写旧材料差异审计表、污染 / 条件保留 / 可保留分类表、后续剔除 / 改写动作表和停审记录,不得写正式 `§11` 回填草稿、正式 `02-概要设计.md` 或 Step 12 正文,不得进入 Step 12。

### R1.20 旧材料差异审计:再写入

#### R1.20.1 本批写入目标

本批只把 `R1.19` 的思考收口成当前模块允许的中间产物:

1. 旧材料差异审计表。
2. 污染 / 条件保留 / 可保留分类表。
3. 后续剔除 / 改写动作表。
4. 停审记录和下一模块边界。

本批仍不得写:

1. 正式 `§11` 回填草稿。
2. 正式 `02-概要设计.md`。
3. Step 12 正文。
4. 对正式章节的直接替换动作。

#### R1.20.2 旧材料差异审计表

| 审计对象 | 当前表现 | 审计结论 | 当前处理 | 后续动作 |
|---|---|---|---|---|
| 本文件顶部 Step 状态与模块总表 | 仍写“Step 11 已确认”“当前模块: Step 11 已完成”“模块 A~H completed”“允许进入 Step 12”。 | 污染 | 只保留为历史执行痕迹,不得再作为当前 gate 依据。 | 在正式回填前完全忽略其完成态叙述,只从 `R1.1` 之后的新门禁链取当前状态。 |
| 本文件旧模块 G / H 的“正式 `§11` 已回填”“旧差异审计已完成”“允许进入 Step 12” | 把旧 completed 路径写成已生效结论。 | 污染 | 只保留为“旧回填曾发生”的历史线索。 | 正式回填前不得引用这些旧完成结论;改由 `R1.16` / `R1.18` / `R1.20` 重新给出依据。 |
| 本文件旧 `15. 模块 H` 中关于 detail handoff 文件编号冲突、正式章节顺延的观察 | 主要是编号 / 文件迁移 / 章节顺延描述。 | 条件保留 | 可作为结构观察保留,但不能再带旧完成态。 | Step 12 / 13 / 14 到达时重新挂到当前流程和当前 gate。 |
| 当前正式 `02-概要设计.md` `§11` 的章节壳 | 已形成 `11.1` 主表、`11.2` forbidden、`11.3` 承接说明、按需图不补。 | 条件保留 | 壳结构符合新版规范。 | 后续正式回填时保留章节壳,只改写正文语义。 |
| 当前正式 `§11` 中“本章只识别影响轮廓,不写 key / JSON / env / secret / 字段全集” | 与本轮边界一致。 | 可保留 | 可直接作为回填边界约束。 | 正式回填时保留该类边界描述。 |
| 当前正式 `§11.2` 中旧 lifecycle / published 术语 | 如 `draft / in_review / published / deprecated / retired / superseded` 等旧状态语义。 | 污染 | 与本轮 Step 5 / Step 9 已禁止回流的旧 lifecycle 主线冲突。 | 正式回填时改写为当前 formalization / version / state owner 口径,不得保留旧发布主线术语。 |
| 当前正式 `§11.2` 中“发布、accepted / published”类前置校验表述 | 仍把旧发布语义当配置边界主线。 | 污染 | 与本轮 formalization / basis / boundary guard 口径不一致。 | 改写为 formalization / basis / version / reference / boundary 前置校验。 |
| 当前正式 `§11.1` 中 `dead letter policy`、`retry / dead letter 状态映射` 等 delivery 导向表述 | 容易把 delivery / relay / outbox 主线重新拉回正文。 | 污染 | 与 `R1.14` 只允许 publication / handoff / candidate 边界冲突。 | 改写为 publisher unavailable / blocked / handoff failure / candidate surface 语义,去掉 dead-letter 中心化表述。 |
| 历史 fingerprint / snapshot / outbox / relay / plugin / configuration 线索 | 在旧 Step 文件与旧污染说明中多次出现。 | 污染 | 当前只能作为“禁止回流”的污染来源。 | 后续回填时明确不复活这些主线;如未来确需机制,只能在 `03 / 04` 重新正式闭口。 |
| `L1-governance` Step 11 的结构框架 | 提供主表、forbidden、图、承接说明、停审结构。 | 条件保留 | 只可作框架对齐。 | 正式回填时仅复用结构粒度,不得带入 governance 语义和主语。 |

#### R1.20.3 污染 / 条件保留 / 可保留分类表

| 分类 | 对象 | 处理口径 |
|---|---|---|
| 污染 | 旧 completed 状态、旧回填动作、旧 lifecycle / published 术语、delivery / dead-letter 中心化表述、fingerprint / snapshot / outbox / relay / plugin 主线 | 正式回填前必须剔除或改写,不得直接继承。 |
| 条件保留 | 章节壳、文件编号冲突观察、章节顺延观察、L1-governance 的结构框架 | 只保留结构信息,重挂到当前 Step 11 / Step 12 / Step 13 / Step 14 流程,不得保留旧语义。 |
| 可保留 | “只识别影响轮廓、不写配置项细节”的边界说明,以及 `11.1 / 11.2 / 11.3` 的章节分层方式 | 后续正式回填时可直接沿用或轻改。 |

#### R1.20.4 后续剔除 / 改写动作表

| 目标位置 | 剔除 / 改写动作 | 改写依据 |
|---|---|---|
| 本文件顶部旧 completed 内容 | 视为 historical material,后续不得再引用其完成态。 | `R1.2.4`、`R1.19` |
| 正式 `§11.1` 主表中的旧 delivery / dead-letter 倾向表述 | 改写为 publication / handoff / candidate / unavailable / blocked 语义。 | `R1.14`、`R1.16`、`R1.18` |
| 正式 `§11.2` 的旧 lifecycle / published 术语 | 改写为当前 formalization / version / boundary guard 口径。 | Step 5、Step 9、`R1.16` |
| 正式 `§11.2` 的“发布前校验”表述 | 改写为 formalization / basis / version / reference / boundary 前置校验。 | Step 8、Step 10、`R1.16` |
| 正式 `§11.3` 承接说明里的可能旧机制暗示 | 仅保留 `03` / `04` 分工,删除会暗示旧机制回流的词。 | `R1.18` |
| Step 12 / 13 / 14 的顺延动作说明 | 保留结构观察,但重新挂到当前流程。 | 旧模块 H 观察、`R1.20` |
| 任何 fingerprint / snapshot / outbox / relay / plugin 主线残留 | 统一列为污染来源,不得直接回填。 | Step 5、`R1.14`、`R1.19` |

#### R1.20.5 停审记录

本批收口后,Step 11 的旧材料差异审计结论为:

- 当前已经能把“旧执行状态污染”“旧语义污染”和“可保留结构壳”明确拆开。
- 下一模块可以进入“正式 `§11` 回填草稿:先思考”,基于当前审计结果决定哪些章节壳保留、哪些正文必须改写。
- 在正式回填动作开始前,仍不得直接修改正式 `02-概要设计.md`。
- Step 12 仍被阻断,必须等 Step 11 的正式回填与自检完成后再判断。

#### R1.20.6 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写当前门禁允许内容 | pass | 只写了审计表、分类表、改写动作表和停审记录。 |
| 是否把旧执行状态与结构观察分开 | pass | 污染与条件保留已拆开。 |
| 是否回指当前 Step 8~10 / `R1.16` / `R1.18` 红线 | pass | 所有改写动作都有当前依据。 |
| 是否提前写正式 `§11` 回填草稿 | no | 当前仍停在审计模块。 |
| 是否修改正式 `02-概要设计.md` | no | 本批未修改正式文档。 |
| 是否进入 Step 12 | no | 当前只推进到 Step 11 `正式 §11 回填草稿:先思考` 的前置门禁。 |

next_allowed_action: 等待用户确认后进入 Step 11 `正式 §11 回填草稿:先思考`;只思考在保留当前章节壳的前提下,哪些正文段落和表格可以直接沿用、哪些必须按 `R1.16` / `R1.18` / `R1.20` 改写,以及正式回填时应保持怎样的章节顺序与最小改动面,不得直接修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.21 正式 `§11` 回填草稿:先思考

#### R1.21.1 本模块问题

本模块只回答“如果下一批要形成正式 `§11` 回填草稿,应保留哪些章节壳、直接沿用哪些正文、必须改写哪些段落与表格,以及如何把改动面压到最小”。它不直接修改正式 `02-概要设计.md`,也不提前进入 Step 12。

本模块需要先想清楚五个问题:

1. 当前正式 `§11` 的哪些章节壳已经符合新版规范,可以继续保留。
2. 哪些段落和表格可以直接沿用,只需轻微措辞修正。
3. 哪些行和术语已经被 `R1.16` / `R1.18` / `R1.20` 判定为污染,必须整体改写。
4. 正式回填时怎样保持最小改动面,避免把 Step 12 / Step 13 / Step 14 内容带进来。
5. 下一批“再写入”允许写什么形态的回填草稿,不允许做什么。

#### R1.21.2 当前来源判断

当前回填草稿思考的第一来源来自:

| 来源 | 当前结论 | 本模块用途 |
|---|---|---|
| 当前正式 `02-概要设计.md` `§11` | 已有 `11.1` 主表、`11.2` forbidden、`11.3` 承接说明和“不补图”段落。 | 判断章节壳与可沿用段落。 |
| `R1.16` | 已固定 formal forbidden 的新口径。 | 判断 `11.2` 哪些旧术语必须重写。 |
| `R1.18` | 已固定 `03 / 04` 的分工规则与承接主题。 | 判断 `11.1` / `11.3` 哪些承接说明可沿用、哪些要替换。 |
| `R1.20` | 已固定污染 / 条件保留 / 可保留和改写动作。 | 直接决定哪些正文必须改写。 |
| SOP Step 11 与书写规范 §11 | 正式 `§11` 必须只包含配置影响轮廓表、禁止配置化边界表、承接说明和按需图。 | 锁定回填草稿的最终形状。 |

#### R1.21.3 可直接沿用的章节壳与正文候选

当前正式 `§11` 中,以下内容可优先视为“直接沿用或轻改”候选:

| 候选项 | 当前判断 | 原因 |
|---|---|---|
| 章节标题 `## 11. 配置影响轮廓` | 直接沿用 | 与新版规范一致。 |
| `11.1 / 11.2 / 11.3` 三段结构 | 直接沿用 | 与 SOP 和书写规范一致。 |
| “本章只识别配置影响轮廓,不定义配置项清单...” 开场边界段 | 直接沿用 | 与本轮 Step 11 总边界一致。 |
| `11.1` 主表列名 | 直接沿用 | 列名仍符合规范模板。 |
| `11.2` forbidden 表列名 | 直接沿用 | 列名仍符合规范模板。 |
| `11.3` 承接说明的三段结构: 03 收口契约 / 04 说明配置项 / 仍受红线约束 | 条件保留 | 结构可留,具体措辞需按 `R1.18` 复核。 |
| “本章不补配置影响轮廓图...” 段落 | 条件保留 | 不补图的结论仍成立,但应确认措辞不带旧机制。 |

#### R1.21.4 必须改写的正文与表格候选

以下内容在正式回填时必须改写,不能直接沿用:

| 目标位置 | 必须改写内容 | 改写原因 |
|---|---|---|
| `11.1` 的 `Outbound Event / collaboration boundary` 行 | `topic transport`、`dead letter policy`、`retry / dead letter 状态映射` 等 delivery 导向表达。 | `R1.14` / `R1.20` 已判定不能回流 delivery / dead-letter 主线。 |
| `11.2` 的 `正式化状态机和非法迁移` 行 | `draft / in_review / published / deprecated / retired / superseded` 等旧 lifecycle 术语。 | 与本轮 Step 5 / Step 9 当前状态语义冲突。 |
| `11.2` 的 `gate / basis / version / reference / boundary 前置校验` 行 | “发布、accepted / published” 等旧发布主线措辞。 | 必须改写为当前 formalization / basis / boundary guard 口径。 |
| `11.3` 承接说明中任何会暗示旧 outbox / snapshot / fingerprint / relay 机制的词 | 旧机制污染。 | `R1.18` / `R1.20` 已明确不得借承接说明回流旧机制。 |
| 任意引用旧 completed 状态、允许直入 Step 12 的描述 | 旧执行状态污染。 | 当前流程仍在 Step 11 内,不得回填旧完成态。 |

#### R1.21.5 最小改动面原则

正式回填时,应遵守以下最小改动面原则:

| 原则 | 当前要求 |
|---|---|
| 保壳不换章 | 保留 `§11` 标题、`11.1 / 11.2 / 11.3` 分层和“不补图”位置,不重排章节。 |
| 逐行改写污染点 | 只改写被 `R1.20` 点名的污染行和需要同步 `R1.16` / `R1.18` 的承接语句。 |
| 不跨章修补 | 不在本模块顺手改 `§12`、`§13`、`§14`。 |
| 不引入新主语 | 正式回填只使用 Step 11 当前已收稳的主要部分、接缝、forbidden 与承接主题。 |
| 不提前下沉 | 不把 key、default、env、secret、schema 字段全集、URL、topic、cron、参数值写进回填草稿。 |

#### R1.21.6 下一写入批次边界

下一批 `正式 §11 回填草稿:再写入` 只允许把本模块思考收敛为:

1. 正式 `§11` 回填草稿框架。
2. 直接沿用项清单。
3. 必须改写项清单。
4. 最小改动面说明。
5. 停审记录和下一模块边界。

不得写:

1. 正式 `02-概要设计.md`。
2. Step 12 正文。
3. 自检与停审正文。
4. 任何超出 `§11` 的跨章修改。

#### R1.21.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只固定回填壳、沿用项、改写项和最小改动面。 |
| 是否回指 `R1.16` / `R1.18` / `R1.20` | pass | 当前判断全部来自当前 forbidden、承接边界和污染审计结论。 |
| 是否避免直接改正式文档 | pass | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否避免跨章扩写 | pass | 当前只讨论 `§11`。 |
| 是否进入 Step 12 | no | 当前仍停在 Step 11。 |

next_allowed_action: 等待用户确认后进入 Step 11 `正式 §11 回填草稿:再写入`;只写正式 `§11` 回填草稿框架、直接沿用项清单、必须改写项清单、最小改动面说明和停审记录,不得直接修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.22 正式 `§11` 回填草稿:再写入

#### R1.22.1 本批写入目标

本批只把 `R1.21` 的思考收口成当前模块允许的中间产物:

1. 正式 `§11` 回填草稿框架。
2. 直接沿用项清单。
3. 必须改写项清单。
4. 最小改动面说明。
5. 停审记录和下一模块边界。

本批仍不得写:

1. 正式 `02-概要设计.md`。
2. Step 12 正文。
3. 自检与停审正文。
4. 任何超出 `§11` 的跨章修改。

#### R1.22.2 正式 `§11` 回填草稿框架

后续正式回填时,`§11` 应按以下草稿框架落地:

```md
## 11. 配置影响轮廓

> 校准来源: `design-calibration/02_hld_step_11_configuration_impact.md`。
> 建议继续阅读该文件的“配置影响轮廓表”“禁止配置化边界表”和“详细设计承接说明”。

本章只识别配置影响轮廓,不定义配置项清单、JSON 示例、RuntimeConfig 字段、ConfigError 枚举或 adapter constructor 参数。

### 11.1 配置影响轮廓表

[沿用当前正式 `11.1` 主表框架与列名,仅按本模块“必须改写项”替换污染行]

### 11.2 禁止配置化边界表

[沿用当前正式 `11.2` forbidden 表框架与列名,仅按本模块“必须改写项”替换污染行]

### 11.3 详细设计承接说明

[沿用当前 `11.3` 三段结构: 03 收口契约 / 04 说明配置项 / formal forbidden 仍成立;
仅按 `R1.18` 与 `R1.20` 去除旧机制暗示词]

本章不补配置影响轮廓图。当前表格已经表达主要部分、接缝和承接方向;若后续需要补图,图只能表达配置影响哪些概要层主语,不得表达 JSON、secret、topic、加载流程或热更新。
```

#### R1.22.3 直接沿用项清单

| 直接沿用项 | 当前处理 | 说明 |
|---|---|---|
| `## 11. 配置影响轮廓` 标题 | 直接沿用 | 与新版规范完全一致。 |
| `11.1 / 11.2 / 11.3` 三段章节壳 | 直接沿用 | 不改章节顺序、不改层级。 |
| 开场边界段 | 直接沿用 | 继续强调“只识别影响轮廓,不写配置项细节”。 |
| `11.1` 主表列名 | 直接沿用 | 模板仍正确。 |
| `11.2` forbidden 表列名 | 直接沿用 | 模板仍正确。 |
| `11.3` 承接说明的三段结构 | 条件沿用 | 结构保留,正文按 `R1.18` 轻改。 |
| “本章不补配置影响轮廓图...” 段落 | 条件沿用 | 结论保留,措辞只做旧机制清理。 |

#### R1.22.4 必须改写项清单

| 目标位置 | 当前污染表达 | 回填草稿替换口径 |
|---|---|---|
| `11.1` 的 `Outbound Event / collaboration boundary` 行 | `topic transport`、`dead letter policy`、`retry / dead letter 状态映射` | 改为 `publisher binding`、`handoff target`、`candidate publication surface`、`blocked / unavailable mapping`;承接说明改为 `03` 定义 outbound publisher seam、candidate / handoff outcome、blocked / unavailable 映射,`04` 说明 transport、发布目标和 handoff 配置语义。 |
| `11.2` 的 `正式化状态机和非法迁移` 行 | `draft / in_review / published / deprecated / retired / superseded` 等旧 lifecycle 术语 | 改为 `formalization / version / state owner 与非法迁移红线`;原因改为配置不得改写 formalization、availability、trace、relation 或 peripheral 的状态语义。 |
| `11.2` 的 `gate / basis / version / reference / boundary 前置校验` 行 | “发布、accepted / published” | 改为 formalization / basis / version / reference / boundary 失败必须阻断对应写入,不得绕过校验继续成立 truth。 |
| `11.2` 的 `Outbound 传播失败不回滚核心 truth` 行 | `回到 03 outbox / publisher 状态设计` | 改为 `回到 03 publication / handoff / publisher 状态设计`,去掉 outbox 主线暗示。 |
| `11.3` 承接说明中的旧机制暗示词 | outbox / relay / snapshot / fingerprint 等旧主线残留词 | 保留 `03 / 04` 分工结构,删除或替换为 runtime seam / typed contract / config semantics 表述。 |
| 任意旧完成态或直入 Step 12 暗示 | completed / pass / 允许进入 Step 12 | 不进入回填草稿。 |

#### R1.22.5 最小改动面说明

| 最小改动面要求 | 当前执行口径 |
|---|---|
| 保壳不换章 | 保留标题、三段分层和不补图段落。 |
| 只改污染点 | 仅替换 `R1.20` 点名的污染行和旧机制暗示词。 |
| 不重写整章 | 除必要污染行外,不整体重写 `11.1` / `11.2` / `11.3`。 |
| 不跨章扩写 | 不触碰 `§12`、`§13`、`§14`。 |
| 不提前下沉 | 不新增 key、default、env、secret、URL、topic、cron、参数值。 |

#### R1.22.6 本模块停审记录

本批收口后,Step 11 的正式 `§11` 回填草稿结论为:

- 已经形成可执行的回填框架,并明确了哪些内容直接沿用、哪些必须改写。
- 当前尚未修改正式 `02-概要设计.md`,符合门禁。
- 下一模块可以进入“自检与停审:先思考”,判断 Step 11 是否已经具备正式回填与关闭条件。
- Step 12 仍被阻断,必须等 Step 11 自检通过后再判断是否放行。

#### R1.22.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写当前门禁允许内容 | pass | 只写了回填草稿框架、沿用项、改写项、最小改动面和停审记录。 |
| 是否回指 `R1.16` / `R1.18` / `R1.20` | pass | 所有替换口径均来自当前正式结论。 |
| 是否避免直接改正式文档 | pass | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否避免跨章扩写 | pass | 当前只讨论 `§11`。 |
| 是否进入 Step 12 | no | 当前只推进到 Step 11 `自检与停审:先思考` 的前置门禁。 |

next_allowed_action: 等待用户确认后进入 Step 11 `自检与停审:先思考`;只思考 Step 11 当前是否已经形成完整的配置影响轮廓、forbidden、承接边界、旧材料审计和正式回填草稿,以及是否还存在阻止正式回填或进入 Step 12 的未闭口项,不得直接修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.23 自检与停审:先思考

#### R1.23.1 本模块边界

本模块只思考 Step 11 自检与停审口径,不写最终停审结论,不修改正式 `02-概要设计.md`,不进入 Step 12。

本模块目标是判断下一批 `R1.24 自检与停审:再写入` 应如何检查:

1. Step 11 中间产物是否已经完成到可停审状态。
2. `R1.22` 的正式 `§11` 回填草稿是否具备后续正式回填条件。
3. Step 12 详细设计承接清单是否已经具备放行前提,还是仍必须等待正式 `§11` 回填记录。
4. flow / 项目台账应在 `R1.24` 后推进到“等待用户决定正式 `§11` 回填记录或继续阻断 Step 12”的哪种状态。

#### R1.23.2 自检输入盘点

| 输入 | 用途 | 当前判断 |
|---|---|---|
| `R1.1`~`R1.2` 开工与必读文档 | 检查 Step 11 启动基线、旧正式 `§11` 降级和本轮输入边界。 | 已完成,可作为门禁依据。 |
| `R1.3`~`R1.4` L1-governance 框架对齐 | 检查是否只参考章节粒度、来源池组织、forbidden 组织方式和停审结构,未复制 governance 领域语义。 | 已完成,需在自检中确认只借框架不借语义。 |
| `R1.5`~`R1.14` 配置影响主体与边界模块 | 检查间接受影响、direct seam、Query / visibility / degraded、body-free / publication / peripheral 等配置影响范围是否都按模块完成。 | 已完成,是 Step 11 配置影响轮廓闭合的主依据。 |
| `R1.15`~`R1.16` 禁止配置化边界 | 检查 formal forbidden 是否已收稳 Definition vs Use、truth owner、状态 owner、读写分层、body-free、publication、audit、一致性和 peripheral 隔离等红线。 | 已完成,需转入停审表。 |
| `R1.17`~`R1.18` `03 / 04` 承接边界 | 检查 `03-详细设计.md` 与 `04-配置设计.md` 的职责拆分是否已闭合。 | 已完成,需在停审中确认未下沉 key / default / env / secret / schema 细节。 |
| `R1.19`~`R1.20` 旧材料差异审计 | 检查旧 completed 状态、旧 lifecycle / published 术语、outbox / relay / dead-letter / snapshot / fingerprint 等污染是否已被识别。 | 已完成,正式回填前必须继续保留该红线。 |
| `R1.21`~`R1.22` 正式 `§11` 回填草稿 | 检查正式 `11.1` / `11.2` / `11.3` 的保壳、改写点和最小改动面是否已形成。 | 已完成草稿,但尚未修改正式文档。 |
| Step 5 / Step 6 / Step 7 / Step 8 / Step 9 / Step 10 当前结论 | 检查配置影响轮廓是否能回指主要组成部分、关键对象、接口骨架、处理流、状态机与异常红线。 | 已完成,Step 11 可引用其当前结论。 |
| 当前正式 `02-概要设计.md` `§11` | 只用于后置污染比对,判断旧正文是否仍残留 delivery / lifecycle / old completion 主线。 | 已完成审计,不得作为 Step 11 第一来源。 |
| `02_hld_calibration_flow.md` 与 `project_execution_ledger.md` | 检查当前门禁、恢复点和下一步是否仍只允许停审。 | 已完成,当前只允许进入 `R1.24`。 |
| `02_hld_step_12_detailed_design_handoff.md` | 判断 Step 12 是否仍需等待 Step 11 正式回填后再开工。 | 已读取,当前只能视为 blocked_by_step11_recheck。 |

#### R1.23.3 Step 11 完成门禁候选

下一批应写入以下完成门禁表:

| 门禁 | 应检查内容 | 预期结论 |
|---|---|---|
| 必读与开工基线完成 | 是否列明 Step 11 必读文档、输入基线、旧材料只作后置审计。 | 预计 pass。 |
| L1-governance 框架参考正确 | 是否只参考章节粒度、来源池组织和停审结构,未复制 governance 领域语义。 | 预计 pass。 |
| 配置影响来源池与模块映射完成 | 是否已形成主体来源池、直接 / 间接受影响分工和后续模块映射。 | 预计 pass。 |
| 配置影响主体模块逐个完成 | 是否间接受影响、direct seam、Query / visibility / degraded、body-free / publication / peripheral 都已完成先思考、再写入和停审。 | 预计 pass。 |
| formal forbidden 完成 | 是否已独立收口禁止配置化边界,且红线与 Step 10 当前异常边界一致。 | 预计 pass。 |
| `03 / 04` 承接边界完成 | 是否已明确哪些契约交给 `03`,哪些说明交给 `04`,并排除了概要层下沉。 | 预计 pass。 |
| 旧材料差异审计完成 | 是否已识别并隔离旧 lifecycle / delivery / outbox / snapshot / fingerprint / completed 结论污染。 | 预计 pass。 |
| 正式 `§11` 回填草稿完成 | 是否已形成 `11.1` / `11.2` / `11.3` 的回填草稿、直接沿用项、改写项和最小改动面。 | 预计 pass。 |
| Step 10 红线已贯穿 Step 11 | 是否持续保持 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心。 | 预计 pass。 |
| 未下沉详细设计 / 实现 | 是否未写 key、default、env、secret、schema、port、validator、topic、URL、cron、constructor 参数或 test 细节。 | 预计 pass。 |
| 未修改正式文档 / 未进入 Step 12 | 是否仍停留在中间产物停审层。 | 预计 pass。 |

#### R1.23.4 正式 `§11` 可回填性判断口径

正式 `§11` 回填应采用与 Step 9 / Step 10 类似的两段式裁决:

1. `R1.24` 只判断 `R1.22` 草稿是否可回填,并提出 flow / 台账推进建议。
2. 只有在用户明确确认后,才允许实际替换正式 `02-概要设计.md` 的 `## 11` 到 `## 12` 之间内容,并补写正式回填记录。

可回填性检查应覆盖:

| 检查项 | 判断标准 |
|---|---|
| 章节覆盖 | `R1.22` 已覆盖 `11.1`~`11.3`,能替换正式 `§11` 主体。 |
| 来源可追溯 | 每个草稿段落能回指 `R1.8`~`R1.22` 和 Step 5~10 当前结论。 |
| 摘要化适度 | 正式文档只保留配置影响轮廓表、forbidden 表和承接说明;完整审计和裁决留在中间产物。 |
| 旧主线禁入 | 不恢复旧正式 `§11` 的 lifecycle / published / dead-letter / outbox / relay / snapshot / fingerprint / completed 主线。 |
| Step 10 红线一致 | 不得让配置表达削弱 Query no-write、Job 不修 truth、body-free 边界或外围隔离。 |
| 详细设计隔离 | 不写 key、default、env、secret、schema、validator、loader、port、topic、URL、cron、constructor 参数或 test 细节。 |
| 正式文档状态 | 当前仍为 pending_rewrite;实际回填必须等用户确认。 |

#### R1.23.5 Step 12 放行判断口径

Step 12 当前不能直接放行。下一批自检若通过,也只能把 Step 12 维持为 `blocked_by_step11_recheck`,直到正式 `§11` 回填记录完成。

Step 12 放行前应确认:

| 放行条件 | 来源 | 判断口径 |
|---|---|---|
| 配置影响主语已收稳 | `R1.5`~`R1.14` | Step 12 只能承接已被 Step 11 收稳的配置影响主体,不得重新发明影响面。 |
| formal forbidden 已固定 | `R1.16` | Step 12 只能细化承接清单,不得借详细设计承接清单放宽 forbidden。 |
| `03 / 04` 分工已固定 | `R1.18` | Step 12 不得重新分配 `03` / `04` 职责。 |
| 旧材料污染已隔离 | `R1.20` | Step 12 不得从旧正式 `§11` 或旧 completed 记录回流旧 delivery / lifecycle 主线。 |
| 正式 `§11` 已更新 | 后续正式回填记录 | Step 12 只能在正式 `02-概要设计.md` `§11` 与当前中间产物一致后开工。 |

裁决边界:

1. 若 `R1.24` 判断 Step 11 仍有缺口,必须留在 Step 11 修补,不得提前进入 Step 12。
2. 若 `R1.24` 通过,下一步也应先等待用户决定正式 `§11` 回填记录,而不是直接进入 Step 12。

#### R1.23.6 flow / 台账推进策略候选

若 `R1.24` 自检通过,建议状态如下:

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_11_configuration_impact.md` | Step 11 self_check_completed | 等待用户决定:正式回填 `§11` 并补记录,或继续保持 Step 12 阻断。 |
| `02_hld_calibration_flow.md` | Step 11 intermediate_completed / wait_user_decision | 不自动进入 Step 12;等待用户确认正式 `§11` 回填记录。 |
| `project_execution_ledger.md` | Step 11 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 `§11` 回填记录”。 |
| `02_hld_step_12_detailed_design_handoff.md` | blocked_by_step11_recheck | 继续阻断,直到 Step 11 正式回填记录完成。 |
| `02-概要设计.md` | formal `§11` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.22` 草稿整体替换 `§11`。 |

若 `R1.24` 自检不通过,flow / 台账必须留在 Step 11,并明确回到缺口所在模块修补。

#### R1.23.7 下一写入批次结构

下一批 `R1.24 自检与停审:再写入` 只写:

1. `Step 11 完成门禁自检表`。
2. `正式 §11 草稿可回填性检查`。
3. `Step 12 放行判断与后续风险保留`。
4. `停审裁决`。
5. `flow / 台账推进建议`。
6. `next_allowed_action`。
7. `本模块停审记录`。

#### R1.23.8 禁止事项

下一批不得直接修改正式 `02-概要设计.md`,不得进入 Step 12,不得写 key、default、env、secret、schema、validator、port、topic、URL、cron、constructor 参数、部署或测试方案。

若自检发现 Step 11 中间产物缺口,必须停在 Step 11 修补,不得通过正式回填或 Step 12 补口。

#### R1.23.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义 Step 11 停审口径和下一写入结构。 |
| 是否写最终停审结论 | no | 最终 pass / fail 留给 `R1.24`。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 12 | no | 只定义 Step 12 放行判断口径。 |
| 是否允许进入自检与停审:再写入 | pass | 自检口径、可回填判断、Step 12 放行判断和 flow / 台账推进策略已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 11 `自检与停审:再写入`;只写 Step 11 完成门禁自检、正式 `§11` 草稿可回填性检查、Step 12 放行判断与后续风险保留、停审裁决和 flow / 台账推进建议,不得直接修改正式 `02-概要设计.md`,不得进入 Step 12。

### R1.24 自检与停审:再写入

#### R1.24.1 Step 11 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 必读与开工基线完成 | pass | `R1.1`;`R1.2` | 已列明 Step 11 必读文档、输入基线和旧正式 `§11` / historical Step 11 只作后置审计的使用边界。 |
| L1-governance 框架参考正确 | pass | `R1.3`;`R1.4` | 仅参考 Step 11 的章节粒度、来源池组织、forbidden 组织方式和停审结构,未复制 governance 领域语义。 |
| 配置影响来源池与模块映射完成 | pass | `R1.5`;`R1.6` | 已形成配置影响主体来源池、分类框架、排除项和后续模块映射。 |
| 配置影响主体模块逐个完成 | pass | `R1.7`~`R1.14` | 间接受影响、direct seam、Query / visibility / degraded、body-free / publication / peripheral 均完成先思考、再写入和停审记录。 |
| formal forbidden 完成 | pass | `R1.15`;`R1.16` | 已独立收口 Definition vs Use、truth owner、状态 owner、读写分层、body-free、publication、audit、一致性和 peripheral 隔离等红线。 |
| `03 / 04` 承接边界完成 | pass | `R1.17`;`R1.18` | 已明确哪些配置实现契约交给 `03`,哪些配置说明交给 `04`,并排除了概要层下沉。 |
| 旧材料差异审计完成 | pass | `R1.19`;`R1.20` | 已识别并隔离旧 completed 状态、旧 lifecycle / published 术语、outbox / relay / dead-letter / snapshot / fingerprint 等污染。 |
| 正式 §11 回填草稿完成 | pass | `R1.21`;`R1.22` | 已形成 `11.1` / `11.2` / `11.3` 的回填草稿框架、直接沿用项、必须改写项和最小改动面。 |
| Step 10 红线已贯穿 Step 11 | pass | Step 10 `R1.27`;`R1.16`;`R1.18`;`R1.20`;`R1.22` | 已持续保持 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心。 |
| 未下沉详细设计 / 实现 | pass | `R1.5`~`R1.23` | 未写 key、default、env、secret、schema、validator、loader、port、topic、URL、cron、constructor 参数或 test 细节。 |
| 未修改正式文档 / 未进入 Step 12 | pass | `R1.23`;`R1.24` | 当前只完成中间产物停审,未修改正式 `02-概要设计.md`,也未进入 Step 12。 |

#### R1.24.2 正式 `§11` 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.22` 已覆盖 `11.1` 配置影响轮廓表、`11.2` forbidden 表和 `11.3` 详细设计承接说明的回填框架与改写位点。 |
| 来源可追溯 | pass | 草稿来源可回指 `R1.8`~`R1.22`、Step 5 当前组成部分、Step 6 当前对象、Step 7 当前接口、Step 8 当前处理流、Step 9 当前状态机和 Step 10 当前异常红线。 |
| 摘要化适度 | pass | 正式回填只保留配置影响轮廓表、forbidden 表和承接说明;完整来源池、差异审计、取舍和停审过程继续留在中间产物。 |
| 旧主线禁入 | pass | `R1.20` / `R1.22` 已明确替换 `dead letter`、旧 lifecycle / published、outbox / relay / snapshot / fingerprint 与旧 completed 暗示。 |
| Step 10 红线一致 | pass | 回填草稿未允许 Query 写 truth、Job 修 truth、body-free 越界或外围失败污染核心。 |
| 详细设计隔离 | pass | 回填草稿未写 key、default、env、secret、schema、validator、loader、port、topic、URL、cron、constructor 参数或 test 细节。 |
| 正式文档状态 | pending_rewrite | 当前正式 `02-概要设计.md` 的 `§11` 仍未按本轮结论替换,正式文档里仍保留旧 delivery / lifecycle / published 倾向表述。 |
| 回填前置动作 | ready_when_user_confirms | 下一动作可以进入 `正式 §11 回填记录:再写入`,按 `R1.22` / `R1.24` 替换正式 `§11` 并记录回填后检查。 |

#### R1.24.3 Step 12 放行判断与后续风险保留

| 承接 / 风险 | 状态 | 后续要求 |
|---|---|---|
| 配置影响主语已收稳 | ready_after_formal_backfill | Step 12 只能承接 `R1.5`~`R1.14` 已收稳的配置影响主体,不得重新发明影响面。 |
| formal forbidden 已固定 | ready_after_formal_backfill | Step 12 只能细化承接清单,不得借详细设计承接清单放宽 `R1.16` 红线。 |
| `03 / 04` 分工已固定 | ready_after_formal_backfill | Step 12 不得重新分配 `03-详细设计.md` 与 `04-配置设计.md` 职责。 |
| 旧材料污染已隔离 | ready_after_formal_backfill | Step 12 不得从旧 Step 11 completed 记录或旧正式 `§11` 回流 old delivery / lifecycle 主线。 |
| 当前正式 `§11` 仍是旧正文 | blocked_by_formal_backfill_pending | 在正式回填前,`11.1` 中 `topic transport / retry / dead letter policy`、`11.2` 中旧 lifecycle / accepted / published 术语仍在正式文档里,Step 12 不得以当前正式 `§11` 为第一来源。 |
| Step 10 红线继续生效 | active_gate | Step 12 承接清单不得削弱 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 边界或外围隔离。 |
| 正式 `§11` 已更新 | wait_r1_25 | Step 12 只能在正式 `02-概要设计.md` `§11` 与当前中间产物一致后开工。 |

#### R1.24.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 11 中间产物是否完成 | completed | 配置影响轮廓已按当前 Step 5~10 全量重审并完成总停审。 |
| 正式 `§11` 是否已回填 | no | 当前只完成 `R1.22` 可回填草稿与 `R1.24` 停审裁决,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 11 blocker | no_blocker_for_current_step | 未发现配置影响主体、formal forbidden、`03 / 04` 分工、旧材料污染或 Step 10 红线承接缺口。 |
| 是否允许正式 `§11` 回填 | ready_when_user_confirms | 可按 `R1.22` / `R1.24` 整体替换正式 `§11`,但必须等待用户明确确认。 |
| 是否允许进入 Step 12 | blocked_until_formal_backfill_record_completed | Step 12 仍需等待正式 `§11` 回填记录完成,不得提前开工。 |

#### R1.24.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_11_configuration_impact.md` | Step 11 self_check_completed / ready_for_formal_backfill_record | 等待用户确认后进入 `正式 §11 回填记录:再写入`。 |
| `02_hld_calibration_flow.md` | Step 11 intermediate_completed / wait_user_confirm_formal_backfill | 不自动进入 Step 12;等待用户确认正式 `§11` 回填记录。 |
| `project_execution_ledger.md` | Step 11 intermediate_completed / wait_user_confirm_formal_backfill | 恢复点指向“等待用户确认正式 `§11` 回填记录”。 |
| `02_hld_step_12_detailed_design_handoff.md` | blocked_by_step11_formal_backfill | 继续阻断,直到 Step 11 正式回填记录完成。 |
| `02-概要设计.md` | formal `§11` pending_rewrite | 当前不修改;后续若用户确认,按 `R1.22` / `R1.24` 整体替换 `§11`。 |

#### R1.24.6 next_allowed_action

```text
等待用户确认后进入 Step 11 `正式 §11 回填记录:再写入`:
1. 只允许按 `R1.22` / `R1.24` 替换 projects/L3-method-library/02-概要设计.md 的 `§11`,并记录回填动作、回填后检查和 Step 12 门禁。
2. 在正式 `§11` 回填记录完成前,不得进入 Step 12。
3. 在用户明确前,不得直接修改正式 `02-概要设计.md`,不得进入 Step 12。
```

#### R1.24.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 11 完成门禁自检。 |
| 是否判断正式 `§11` 草稿可回填 | pass | `R1.22` / `R1.24` 可作为正式 `§11` 回填依据,但尚未实际修改正式文档。 |
| 是否保留 Step 12 放行风险 | pass | 已保留 formal backfill pending、旧正文污染残留和 Step 10 红线继续生效等门禁。 |
| 是否明确停审裁决 | pass | Step 11 中间产物 completed;下一步等待用户确认正式 `§11` 回填记录。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 12 | no | 未写 Step 12 承接正文。 |

next_allowed_action: 等待用户确认后进入 Step 11 `正式 §11 回填记录:再写入`;只允许按 `R1.22` / `R1.24` 替换正式 `02-概要设计.md` 的 `§11`,并记录回填动作、回填后检查和 Step 12 门禁,在用户明确前不得直接修改正式文档,不得进入 Step 12。

### R1.25 正式 `§11` 回填记录:再写入

#### R1.25.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 `§11` 回填。 |
| 回填来源 | `R1.22 正式 §11 回填草稿:再写入`;`R1.24 自检与停审:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 11. 配置影响轮廓`。 |
| 回填范围 | 仅整体替换正式 `## 11` 到 `## 12` 之前的内容。 |
| 未修改范围 | 未修改正式 `§12` 或后续章节。 |
| 回填方式 | 摘要化回填:保留配置影响轮廓表、禁止配置化边界表、`03 / 04` 承接说明和“不补图”裁决;完整来源池、差异审计、取舍和停审过程仍以本文件 `R1.1`~`R1.24` 为准。 |

#### R1.25.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 `§11` 是否已回填 | pass | 正式 `02-概要设计.md` 的 `§11` 已按 `R1.22` / `R1.24` 整体替换。 |
| 是否只修改 `§11` | pass | 本次回填目标限定在 `## 11` 到 `## 12` 之前。 |
| 是否替换旧 delivery / lifecycle / published 主线 | pass | `§11` 正文已移除 `dead letter policy`、旧 lifecycle / accepted / published 倾向表述和 outbox 中心化暗示。 |
| 是否保持 `11.1` / `11.2` / `11.3` 结构 | pass | 正式 `§11` 继续保持配置影响轮廓表、forbidden 表和详细设计承接说明三段结构。 |
| 是否显式保留 Step 10 红线 | pass | 正式 `§11` 已继续保持 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 不可绕过和外围不污染核心。 |
| 是否下沉 Step 12 | pass | `§11` 只写配置影响轮廓与承接边界,未把详细设计承接清单正文写入本章。 |
| 是否下沉详细设计 / 实现 | pass | `§11` 未写 key、default、env、secret、schema、validator、loader、port、topic、URL、cron、constructor 参数或测试方案。 |

#### R1.25.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| Step 12 当前文件和正式 `§12` 仍是 historical pending_recheck | open_for_step12_reopen | Step 12 必须从 `开工与必读文档:先思考` 重开,按正式 `§11` 回填后文本和当前 Step 5~11 结论重审。 |
| 旧 Step 11 delivery / lifecycle 主线回流 | open_for_step12_recheck | Step 12 不得借承接清单重新恢复 old delivery、accepted / published 或 outbox 中心化主线。 |
| Step 10 全局红线被后续承接讨论削弱 | open_for_step12_recheck | Step 12 必须继续遵守 Query no-write、Job 不修 truth、candidate 不等于 delivery、body-free 边界和外围隔离。 |
| `03 / 04` 职责被 Step 12 重分配 | blocked_by_rule | Step 12 只能承接 `R1.18` 已固定的 `03-详细设计.md` / `04-配置设计.md` 分工,不得重新分配。 |

#### R1.25.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 11 中间产物 | completed | `R1.1`~`R1.24` 已闭合来源池、主体边界、forbidden、旧材料审计、回填草稿和总停审。 |
| 正式 `§11` | backfilled | 正式 `§11` 已按 `R1.22` / `R1.24` 回填。 |
| Step 11 blocker | none | 当前 Step 11 无遗留 blocker。 |
| 下一步 | ready_for_step12_opening | 下一步只能进入 Step 12 `开工与必读文档:先思考`,不得沿用旧正式 `§12` 或 historical Step 12 结论。 |

next_allowed_action: 等待用户确认后进入 Step 12 `开工与必读文档:先思考`;Step 12 必须以正式 `§11` 回填后文本、Step 11 `R1.1`~`R1.25`、Step 10 `R1.27`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 `§12` 或 historical Step 12 作为第一来源。
