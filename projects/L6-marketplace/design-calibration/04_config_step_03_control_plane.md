# 04 Step 3：建立配置控制面总览

## 1. Step状态

2026-10-02；completed / selfcheck_done / stop_review。Step1～2完成；本Step按配置控制面→功能域→03装配入口展开，未进入配置项大表。

### Step内计划

| 字段 | 收口结论 |
|---|---|
| 本步目标 | 建立来源链、装配入口、六配置域和读取边界 |
| 本步输入 | Step2范围、03 RuntimeConfig/entry/slot、01/02运行边界 |
| 本步输出 | ASCII来源链图、控制面总表、域边界和跨面审计 |
| 应问的问题 | 谁读配置；谁不得读；配置控制/不控制什么；是否有重叠域 |
| 期望产出 | 来源链、六域表、停审与审计表 |
| 回填位置 | 正式04§3 |
| 执行约束 | 先域后项；不把业务truth或资格写成开关 |
| 进入下一步条件 | 六域无重叠/遗漏，03影响为无回写 |

## 2. 本步输入

[Step2范围](04_config_step_02_scope.md)、03§13 RuntimeConfig/入口/八slot、01部署边界、02 Step11配置影响。当前配置读取者限定为infra runtime builder、API/Worker启动和Web build/runtime公共边界。

## 3. SOP问题回答

来源链为静态安全常量→仅允许的路径选择器→严格JSON文件→secret provider解析ref；当前不启用config center/admin override。主要装配入口是`--config <path>`/`MARKETPLACE_CONFIG_PATH`经API/Worker loader，Web使用既有`VITE_MARKETPLACE_API_BASE`。contracts/domain/application不能读raw env/file/secret；application只接validated RuntimeConfig/ports。

## 4. 当前文档问题诊断

将`storage`、`sdk`、`owner`混为一个runtime域会导致来源、敏感级别和失败策略重叠；将adapter disposition写入配置会让文件伪造资格。拆为六个功能域，owner binding只提供ref和kind，Bound/Blocked由validator和正式consumer资格计算。

## 5. 改动前后对比

| 项 | 之前 | 本Step结论 |
|---|---|---|
| 来源 | draft env方向 | 明确文件主载体、env仅选路、secret只解析ref |
| 装配 | 模块可自行读取 | API/Worker loader→infra builder→typed ports |
| 配置域 | runtime混杂 | api/storage/sdk/owner/worker/web六域 |
| 领域规则 | 可能被开关影响 | approval/visibility/state/幂等/audit均禁止配置化 |

## 6. 配置设计取舍

保留`profile`作为环境选择metadata，不把它传播到domain。选择“文件一次解析、validated snapshot一次装配、startup生效”，拒绝多源逐项覆盖和运行时动态修改造成的不可审计差异。

## 7. 结构化中间产物

#### 配置来源链图: L6-marketplace 配置覆盖链

```text
[static safety invariants + locale default]
                 |
                 v
 [approved path selector only]
                 |
                 v
       [strict JSON config file]
                 |
                 v
       [secret provider resolves refs]
                 |
                 v
 [parse -> validate -> RuntimeConfig -> builder]
                 |
                 v
       [API / Worker / Web public surface]
```

关键说明：图只表达配置来源和装配关系，不表达部署命令；secret provider只返回受控内部资源；domain/application不直接读取配置。配置不控制业务truth、审批、状态、审计原子性或外部结果。

| 控制面 | 作用 | 对应模块 | P0 |
|---|---|---|---|
| Listener | `api_bind`与公共Web API binding | api/web | 是 |
| Local storage | `postgres_config_ref`及PG能力引用 | infra/postgres | 是 |
| SDK profile | `sdk_profile_ref`及schema/operation映射引用 | infra/sdk | 是 |
| Owner bindings | 八kind configuration_ref与资格输入 | infra/sdk/application ports | 是 |
| Worker budget | `worker_batch_limit`、`lease_millis` | worker/application | 是 |
| Display | `default_locale`与EN/ZH资源选择 | web | 是（安全默认） |

| 配置域 / 功能模块 | 来源控制面 | 允许配置的能力 | 禁止控制的能力 |
|---|---|---|---|
| api | Listener | bind字符串、配置路径选择 | auth通过、scope、route业务规则 |
| storage | Local storage | PG引用/受控资源profile | schema truth、隔离绕过、提交顺序 |
| sdk | SDK profile | SDK profile引用 | 任意owner operation、retry绕过probe |
| owner | Owner bindings | 八slot ref与profile关联 | Bound/approval/visibility/receipt |
| worker | Worker budget | batch/lease正值预算 | blind retry、state/intent/fence语义 |
| web | Display/公开binding | API base、默认locale | 浏览器直连owner、业务状态/幂等key |

| 配置域 | 来源链 | 控制边界 | 03影响 |
|---|---|---|---|
| 六域 | 文件/selector/secret ref | 仅装配和运行姿态 | 无回写；严格映射既有七字段 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 六配置域映射既有RuntimeConfig与Web边界 | 否 | 控制面语义 | 03§13已存在 | 无回写 |
| loader不向domain/application开放raw来源 | 否 | 分层约束 | 03§5/13已存在 | 无回写 |

## 9. 回填草稿与待确认事项

正式§3采用来源链图、六域总表和模块禁止项。待确认仅是各profile外部资源和secret provider的正式实现；未确认时相应adapter disposition保持Blocked/Unavailable。

## 10. 进入下一步条件

来源链、装配入口、六配置域和领域禁止边界清楚；控制面无重叠或孤儿域。Step3停审通过，进入Step4。
