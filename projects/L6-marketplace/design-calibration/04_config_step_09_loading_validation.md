# 04 Step 9：定义配置加载、校验与生效机制

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步闭合loader顺序、严格schema、字段关系、secret解析、能力校验和startup/build-time生效；不新增代码契约。

## 2. 本步目标

**目标**：使配置从外部快照到`RuntimeConfig`和运行装配的路径可判定、可失败、可清理。

### 本步输入

Step7项清单、Step8秘密边界、03§13.1～§13.4入口/装配/失败清理、03§7/§11错误映射。

### 本步输出

加载流程图、校验层次、成功/失败生效矩阵、启动与Web build边界，回填正式04§9。

## 3. 应问的问题与SOP回答

1. **配置从哪里进入？** API/Worker通过`--config <path>`或`MARKETPLACE_CONFIG_PATH`选择一个JSON文件；Web通过`VITE_MARKETPLACE_API_BASE`在build-time选择公共API origin；没有自动HOME搜索或config center。
2. **loader先做什么？** 读取一次、拒重复键/未知键、解析`schema_version/profile`、验证六域结构，再映射七字段。
3. **如何验证owner？** 验证kind集合、重复和ref类型；随后由infra validator结合正式consumer contract、SDK exact mapping、current authority计算Bound/Blocked/Disabled。文件中的label不具资格。
4. **如何处理默认值和profile？** 仅locale缺失安全默认En；其余服务项缺失fail-fast或形成明确受影响Blocked。profile不改变业务规则。
5. **何时生效？** server全为startup；Web API base为build-time；locale只影响展示。当前没有hot/reload。任何已运行服务的配置变化需要新快照和重启。

### 当前材料问题诊断与取舍

03已确定七字段、入口和失败清理，但旧材料没有把JSON解析、owner资格验证和RuntimeAssembly的顺序写闭。采用一次读取、严格拒绝、typed映射、provider解析、能力校验、纯装配的单向链；不提供动态换adapter或业务开关。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| loader顺序和资源清理分散 | 七层校验和失败清理形成单一链 |
| 配置通过可能被误解为ready | 明确区分可装配、Blocked和外部资格 |
| 热更新边界不明 | server startup、Web build-time、hot/reload禁用 |

## 4. 加载与装配链

```text
[--config path / MARKETPLACE_CONFIG_PATH]
                 |
                 v
      [read once, strict JSON]
                 |
                 v
[envelope/schema/profile/unknown-key validation]
                 |
                 v
 [typed domain fields + seven RuntimeConfig fields]
                 |
                 v
 [positive/ref/type/range/relationship validation]
                 |
                 v
 [secret-ref resolution and PG/SDK/owner capability checks]
                 |
                 v
 [assemble_runtime -> API or Worker facade]
```

图示说明：

- `schema_version`、`profile`在loader结束后不进入业务RuntimeConfig。
- loader不会调用业务state transition、审批、列表或分发流程。
- PG关键能力失败拒绝装配；外部slot资格未闭合时只能产出明确Blocked/Unavailable，不自动替换fake。
- Web构建链独立校验API base；浏览器永不加载server secret、SDK profile或owner端点。

## 5. 分层校验规则

| 校验层 | 必须检查 | 成功结果 | 失败结果 |
|---|---|---|---|
| 来源选择 | path存在、两入口不冲突、禁止自动搜索 | 得到单一文件 | API/Worker fail-fast |
| JSON语法 | UTF-8/语法/重复键 | 得到解析树 | fail-fast |
| envelope | `schema_version`受支持、`profile`值域正确 | 进入域校验 | fail-fast |
| domain/key | 六域存在性、未知域/键、类型匹配 | 得到typed候选 | fail-fast |
| field relation | bind可解析、ref非空、worker正值/不溢出、locale合法 | 可构造七字段 | fail-fast或Worker单元拒绝 |
| owner set | kind已知、无重复、ref形状合法；缺slot形成Blocked | typed `owner_bindings` | 配置错拒绝；资格缺口不伪造 |
| secret/provider | ref可解析、profile/版本兼容、redaction | adapter资源候选 | 关键storage拒装配；slot Blocked |
| qualification | SDK exact operation/schema、current authority、consumer contract | `Bound`仅由validator得出 | `Blocked`/`Disabled`，不发effect |
| runtime assembly | PG schema/extension/同Tx ports、API/Worker组合 | 只暴露facade | 清理资源后拒启动 |

## 6. 生效和快照规则

| 配置表面 | 生效方式 | 变更方式 | 当前是否启用 |
|---|---|---|---|
| API `api.bind`及server七字段 | `startup` | 新快照+重启 | 是 |
| Worker batch/lease与owner/store/sdk refs | `startup` | 新快照+重启；不动态换adapter | 是 |
| Web公共API base | `build-time` | 重新构建并校验origin | 是 |
| Web default locale | `startup/display`；用户本地偏好仅展示 | 新快照或本地display preference | 是 |
| secret material | provider解析后按adapter生命周期使用 | 受控轮换+重启 | provider合同待定 |
| config center/admin/hot reload | `hot/reload` | 不提供 | 否 |

校验成功只说明快照可装配，不说明owner资格、Governance approval、publisher认证、receiver安装、支付或Observation evidence已成立。

## 7. 失败清理与安全边界

依据03§13.4，校验/装配失败时已打开的PG pool、SDK client和provider handle必须关闭或drop；不得启动listener、claim worker、发送effect或写accepted业务结果。配置解析不调用任何外部业务命令。API与Worker各自加载自己的快照，不共享进程内存事务。

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| strict loader→validate→assemble顺序 | 否 | loader语义 | 03§13.4已有顺序 | 无回写 |
| 只有locale安全默认，其余服务值无默认 | 否 | 缺省/校验 | 03§13.1已有字段约束 | 无回写 |
| qualification由validator计算、配置不能声明Bound | 否 | 外部资格边界 | 03§13.3已有定义 | 无回写 |
| 全server startup、Web build-time、无hot | 否 | 生效方式 | 03§13.2/13.4 | 无回写 |

## 9. 回填草稿、待确认与进入下一步条件

正式§9回填加载链、分层校验、生效表和失败清理口径；不写具体库版本、部署命令或运行证据。待确认：严格JSON parser实现、profile schema、secret provider和PG/SDK兼容核验，进入Step14/07；没有代码契约待回写。

进入Step10条件：每个入口都有单一来源、每个字段都有校验和失败策略、startup/build-time边界明确、资源失败清理闭合。
