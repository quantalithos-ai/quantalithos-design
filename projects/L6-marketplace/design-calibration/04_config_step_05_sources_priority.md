# 04 Step 5：定义配置来源、优先级与冲突处理

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。Step1～4已完成；本步只收敛来源和冲突，不新增RuntimeConfig字段、adapter constructor或运行接口。

## 2. 本步目标

**目标**：固定配置来源的可审计顺序，避免环境变量、命令行和密钥系统对业务规则形成隐式覆盖。

### 本步输入

- [Step3控制面](04_config_step_03_control_plane.md)的来源链和六个配置域。
- [Step4分类边界](04_config_step_04_categories_boundaries.md)的startup/build-time/sensitive分类。
- [03详细设计§13](../03-详细设计.md#13-配置引用与外部依赖绑定)的`--config`、`MARKETPLACE_CONFIG_PATH`、`VITE_MARKETPLACE_API_BASE`和七字段RuntimeConfig。

### 本步输出

来源优先级表、冲突处理表、逐域覆盖规则和来源停审记录，回填正式04§5。

## 3. 应问的问题与SOP回答

1. **哪些来源可以覆盖配置？** 服务器只读取一个严格JSON文件；`--config`与`MARKETPLACE_CONFIG_PATH`只选择路径，不能逐项覆盖。Web的`VITE_MARKETPLACE_API_BASE`是build-time输入。secret provider只解析文件中的opaque reference，不参与配置合并。
2. **默认值在哪里？** 只有`web.default_locale`允许安全默认`En`；`api`、`storage`、`sdk`、`owner`、`worker`的服务字段无生产默认，缺失即拒绝相应装配。
3. **重复或冲突如何处理？** 重复JSON键、未知键、同一项多来源、路径参数不一致、profile不一致均fail-fast；不采用最后写入胜出。
4. **配置文件不可用如何处理？** 文件不可读、解析失败、schema版本不支持或profile不允许时，API/Worker不启动；secret provider不可达时只保留明确的受影响Blocked姿态，不伪造Bound。
5. **哪些来源禁止覆盖敏感引用？** 普通环境变量、命令行参数和Web bundle不得携带raw password/token/private key；只能传递受控的配置路径或secret reference。

## 4. 当前材料问题诊断与取舍

旧draft只有“使用环境变量”的方向，没有优先级、冲突或失败语义。若允许每个环境变量覆盖任意JSON键，便无法审计`owner_bindings`、worker预算和业务bypass。采用“单文件快照 + 路径选择 + secret ref解析”方案；静态安全不变量永远高于文件值，配置不能覆盖03不变量。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| env方向但无覆盖边界 | env/CLI只选路径，JSON是唯一业务外部快照 |
| 缺失/冲突处理不明 | 重复键、未知键、path/profile冲突均fail-fast |
| ref可能被误读为资格 | provider只解析ref，Bound仍由validator计算 |

## 5. 来源优先级与冲突规则

这里的“优先级”是解析权威顺序，不代表低层可覆盖高层安全约束。

| 来源 / 层 | 优先级 | 适用配置 | 冲突处理 | 不可用策略 |
|---|---:|---|---|---|
| 代码静态安全不变量 | 最高 | 七字段类型、八kind集合、禁止配置键、无hot/reload | 任何文件值违反即拒绝 | 启动fail-fast |
| 严格JSON配置文件 | 主来源 | `api`、`storage`、`sdk`、`owner`、`worker`、`web` | 一个快照内重复键/未知键/类型错即拒绝 | API/Worker拒启动；Web构建失败 |
| `--config <path>`或`MARKETPLACE_CONFIG_PATH` | 选择器 | 配置文件路径 | 两者只允许相同规范化路径；不同即拒绝 | 无路径即拒启动，不自动搜索 |
| secret provider | 引用解析 | 文件中标记为ref的PG/SDK/owner凭据 | provider返回的secret不能回写普通配置或日志 | 受影响adapter不可用；关键storage失败则拒启动 |
| `VITE_MARKETPLACE_API_BASE` | Web build-time | Web公共API base | 只允许一个受控origin；不进入服务RuntimeConfig | 构建拒绝 |
| config center/admin override/hot reload | 不适用 | 无 | 不接受、不静默忽略未知来源 | 设计上拒绝 |

| 冲突场景 | 处理规则 | 阻断范围 |
|---|---|---|
| `--config`与`MARKETPLACE_CONFIG_PATH`同时给出且路径不同 | fail-fast | API/Worker启动 |
| JSON重复键、未知顶层域、未知域内键 | fail-fast | 当前配置快照 |
| `schema_version`不支持或`profile`与受控环境不匹配 | fail-fast | 当前进程 |
| 文件声明的`profile`与外部部署姿态冲突 | 不自动选择另一profile；拒绝 | 当前进程 |
| secret reference被raw value覆盖 | fail-fast并记录redacted诊断 | 当前配置快照 |
| owner slot重复、未知kind或ref类型不合法 | fail-fast；缺失slot则由validator形成Blocked | owner能力，不造fake |
| Web API base非allowlist origin或包含凭证 | 构建拒绝 | Web bundle |

## 6. 按配置域覆盖表与停审

| 配置域 | 允许来源 | 禁止来源 | 有效顺序 | 不可用策略 |
|---|---|---|---|---|
| `api` | JSON文件、路径选择器 | 逐项env覆盖、admin/hot | 静态不变量→文件 | bind解析失败拒启动 |
| `storage` | JSON opaque ref、secret provider | raw DSN、Web bundle、逐项env | 静态不变量→文件→ref解析 | PG关键能力失败拒装配 |
| `sdk` | JSON profile ref、secret provider | generic endpoint自证、逐项env | 静态不变量→文件→ref解析 | positive adapter保持Blocked |
| `owner` | JSON八kind ref、secret provider | disposition字段、approval/visibility开关 | 静态不变量→文件→资格校验 | 受影响slot Blocked/Disabled |
| `worker` | JSON正值预算 | `retry_all`、state/fence开关、hot | 静态不变量→文件 | 缺失/非法拒Worker启动 |
| `web` | build-time API base；JSON locale | SDK/DB/secret进入bundle；运行时admin | 静态不变量→build/file | 构建拒绝或安全默认En |

停审结论：来源链唯一；没有同名逐项覆盖；secret不被普通来源覆盖；配置文件不能改变approval、visibility、state、idempotency、installed/paid或审计原子性。

## 7. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 单JSON快照、路径选择器、secret ref解析 | 否 | 来源语义 | 03§13已定义入口边界 | 无回写 |
| 不启用config center/admin/hot | 否 | 生效限制 | 03§13已定义reload边界 | 无回写 |
| 逐项env覆盖、approval开关均禁止 | 否 | 领域/安全约束复述 | 03§2、§9～§14 | 无回写 |

## 8. 回填草稿、待确认与进入下一步条件

正式§5应回填来源表、冲突表和逐域规则；不得写真实路径、DSN、secret值或部署命令。待确认仅包括平台如何注入路径、secret provider的正式合同和各profile外部资格，统一进入Step14风险，不改变本步来源语义。

进入Step6条件：每个配置域已有唯一来源、优先级、冲突和不可用策略；无`待回写`项；MP-UP/MP-SRC/Q资格继续保持pending/blocked。
