# 04 Step 6：定义环境、部署 profile 与配置矩阵

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。Step5来源优先级已通过；本步只定义逻辑profile和能力姿态，不填写真实部署值。

## 2. 本步目标

**目标**：让测试、实施和运维能够区分环境差异，同时不把profile差异误写成业务资格或审批结果。

### 本步输入

Step5来源规则、01/02部署边界、03§13装配与失败清理、`Q-MP-01`容量约束缺口。

### 本步输出

local、test、staging、production四个逻辑profile的配置矩阵、外部依赖姿态、敏感处理规则和切换门禁，回填正式04§6。

## 3. 应问的问题与SOP回答

1. **哪些profile需要定义？** 定义`local`、`test`、`staging`、`production`。CI使用`test`姿态；不另造CI业务profile。
2. **每个profile从哪里取值？** 均使用严格JSON快照；路径由受控入口选择，secret由provider按ref解析；不在文档写命令或真实值。
3. **fake能否作为生产替代？** 不能。fake只允许测试组合且不得强化语义；production缺正式owner资格时保持Blocked/Unavailable。
4. **profile是否改变业务规则？** 不改变。它只改变技术资源、外部绑定和诊断姿态；approval、scope、visibility、state、fingerprint和结果语义固定。
5. **环境差异如何交给05/06/07？** 05使用矩阵设计配置负例和依赖组合，06将必填/阻断条件转为门禁，07再安排planned boundary；本轮不生成测试run或实施任务。

## 4. 当前材料问题诊断与取舍

原型的`0.0.0.0:9090`是局域网演示绑定，不是生产profile。旧材料没有区分“配置可解析”与“外部资格可用”。采用逻辑profile而不是部署拓扑：每一行只说明允许的适配器姿态、secret要求和失败结果；所有真实端点、容量数值、TLS/auth合同留待正式平台/owner输入。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 原型端口和环境概念混在一起 | 四个逻辑profile，明确原型端口非生产 |
| fake/真实资格边界不明 | fake只在test composition；production无fallback |
| 环境差异无法交给测试 | 每个profile有来源、依赖、敏感和能力门禁 |

## 5. 环境与配置矩阵

| profile | 用途 | 配置来源 | storage姿态 | owner/SDK姿态 | 敏感项 | 允许的验证范围 | 不能宣称 |
|---|---|---|---|---|---|---|---|
| `local` | 开发者解析、局部负例和Web联调 | 本地严格JSON；受控路径 | 可只做schema/loader验证；真实PG未绑定则Unavailable | 不得把原型或泛型client当Bound；缺slot为Blocked | 仅ref，禁止提交明文 | 配置解析、类型/禁止键、UI展示 | 不宣称真实发布、审核、分发或ready |
| `test` | 单元/契约/故障注入与CI | 测试快照；secret由测试provider或安全fixture引用 | 允许隔离测试存储 | 允许等价fake/test adapter；不强于正式port | 只使用测试秘密，日志必须redacted | 负例、冲突、边界、Blocked姿态 | 不宣称生产owner资格或真实交付 |
| `staging` | 非生产接缝验证 | 受控环境文件+secret provider | durable能力和schema/extension待实施核验 | 只接已批准的非生产正式合同；未闭合则Blocked | 禁止生产secret混入；轮换按provider合同 | 集成前置检查和受控验收准备 | 不宣称生产容量、审批或支付 |
| `production` | 正式服务 | 受控配置快照+正式secret provider | 必须有正式PG能力，否则拒装配 | 八slot逐项exact consumer/SDK/资格核验；无fake | raw secret不得进文件、日志或bundle | 仅在正式资格和实施证据完成后运行 | 当前不宣称可部署、ready、paid或installed |

## 6. Profile能力门禁

| 能力 | `local` | `test` | `staging` | `production` |
|---|---|---|---|---|
| JSON/schema/unknown-key校验 | 允许 | 必须 | 必须 | 必须 |
| 七字段RuntimeConfig装配 | 可做负例 | 允许测试组合 | 需真实前置 | 需正式前置 |
| 八slot positive `Bound` | 不可宣称 | 仅等价fake测试姿态 | 逐slot待核验 | 逐slot正式核验 |
| 发布/审核/列表/获取主链 | 不可宣称 | 负例或受控fixture | 待资格闭合 | 当前blocked |
| hot/reload | 禁止 | 禁止 | 禁止 | 禁止 |
| 生产fake fallback | 禁止 | 仅test composition | 禁止 | 禁止 |

profile值不能改变`default_locale`以外的业务枚举；`profile=production`也不能自行把`owner_bindings`变成Bound。当前`MP-UP-001～008`、`MP-SRC-003/010/013`和`Q-MP-01`的缺口沿原03保持受影响。

## 7. 跨profile审计与停审

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否把原型端口当生产默认 | 否 | `0.0.0.0:9090`只在draft原型，正式配置不填默认 |
| 是否用profile绕过审批/可见性 | 否 | profile只控制装配姿态，禁止业务bypass键 |
| fake边界是否一致 | 是 | 仅`test`组合允许，生产和staging不fallback |
| secret处理是否随环境漂移 | 否 | 各profile均只ref；provider合同未闭合记风险 |
| 容量值是否被伪造 | 否 | worker数值和Q-MP-01上限留必填/blocked |
| CI是否引入额外业务profile | 否 | CI复用`test`，避免矩阵分裂 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 四个逻辑profile与test-only fake边界 | 否 | profile语义 | 03§13已定义fake/Blocked边界 | 无回写 |
| staging/production不提供数值默认 | 否 | fail-fast姿态 | 03§13已有缺失失败清理 | 无回写 |
| CI复用test而非新增业务profile | 否 | 测试承接 | 03§15/05承接 | 无回写 |

## 9. 回填草稿、待确认与进入下一步条件

正式§6回填四profile矩阵和能力门禁；不写部署命令、真实DSN、secret provider名称、数值baseline或外部验证结果。待确认项包括正式环境拓扑、PG/SDK/owner资格和Q-MP-01容量预算，统一进入Step14。

进入Step7条件：profile值域、来源、外部能力和敏感处理可判定；没有profile差异能改变业务truth或代码契约。
