# 01 架构 Step 3：职责边界

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 3。

### Step 内计划

- [x] 读取 Step 1~2 与正式 00 的定位、能力、规则和数据归属。
- [x] 回答做什么、不做什么、易混淆职责和隐式行为。
- [x] 诊断旧 01 的 archive/retention/restore/compliance 越界。
- [x] 形成职责表、红线、回填和自检。

## 2. 本步输入

`AB-AR-001~010`、Step 2 六项目标与七项约束、正式 00 §2/7/10/11，及各 L1、workspace、artifact、observability 正式 owner 边界。

## 3. SOP 问题回答

1. 做什么？管理 Archive 自有请求/作业、Bundle/manifest、逐源绑定、闭包/验证、存储/生命周期执行记录、恢复计划/材料/handoff/outcome。
2. 不做什么？不决定业务状态、policy/hold/delete/risk，不拥有上游正文，不直接 restore 上游，不经营外部设施或产品表面。
3. 哪些易混淆？保存 owner-approved snapshot 不等于拥有 source truth；记录 decision 不等于作出 decision；handoff accepted 不等于 owner committed。
4. 哪些行为绝不能隐式发生？用 projection 补缺、从 sealed 推导 archived、从上传 ack 推导 durable、对 commit-unknown 盲重试、由查询触发维护或外部写。
5. 最容易串线的边界？Artifact body/lineage、audit chain、workspace projection、retention/hold、project lifecycle 和 restore import。

## 4. 历史诊断、前后对比与取舍

| 历史职责 | 问题 | 当前职责 |
|---|---|---|
| Compliance Bundle 生成 SoA/AIIA/Claim | 自造治理/合规结论 | 仅保存获准 decision/evidence material/ref |
| Retention 子域定义期限与自动清除 | 侵入治理 authority | 仅执行正式 decision 并记录 outcome |
| Restore archived→active | 侵入 work/owner 状态机 | 仅形成 plan/material/handoff |
| 六域聚合真相仓 | 产生第九个跨域 truth | Bundle 只是真相来源明确的历史材料容器 |
| Archive 可在 restore 例外写 L1 | Bundle 获得通用写权 | 无例外；必须 receiver-owned commit |

取舍：采用“Archive local truth + external authority/ref + owner receiver”的职责三分；不采用共享数据库、统一业务模型或 Archive 业务裁决。

## 5. 结构化中间产物

### 5.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 归档/恢复请求与作业协调 | 做 | 这是本仓正式流程主语，不改变外部业务状态。 |
| 逐源 authority binding 与 capture/coverage | 做 | 用于说明每份材料由谁、在哪个版本和范围提供。 |
| Archive Bundle、manifest 与内容闭包 | 做 | 是本仓核心材料边界和声明一致性。 |
| 完整性与兼容结果 | 做 | 本仓保存验证判断及历史，不拥有算法/密钥 authority。 |
| 存储位置、冷热层级及生命周期执行状态 | 做 | 本仓记录外部设施和治理动作的执行事实。 |
| 只读验证与审计安全查询 | 做 | 只提供 Archive provenance/status，不冒充业务查询。 |
| 恢复计划、owner-specific 材料与 handoff/outcome | 做 | 本仓协调和记录，owner 负责业务接受与提交。 |
| identity/conversation/work/process 真相 | 不做 | 归相应 L1 owner。 |
| 治理 policy、legal hold、删除授权和风险接受 | 不做 | 归 governance 或明确 owner。 |
| 通用 Artifact 正文、版本与血缘真相 | 不做 | 归 `L1-artifact`。 |
| workspace view 与 observability backend/audit chain | 不做 | 分别归 `L1-workspace`、`L4-observability`。 |
| 外部对象存储、KMS/secret、签名、压缩服务 | 不做 | 作为外部能力接缝，不并入本仓。 |
| Bundle 与 L1 canonical truth 的关系 | 易混淆职责 | Bundle 可保存获准快照，但不成为 source owner。 |
| lifecycle execution 与 policy truth | 易混淆职责 | 执行记录属于 Archive，规则和授权不属于 Archive。 |
| handoff outcome 与业务恢复状态 | 易混淆职责 | 本仓只记录 receiver 反馈，不推断 committed/restored。 |
| workspace projection 与 L1 slice | 易混淆职责 | projection 只能是明确标注的辅助 slice。 |

### 5.2 边界红线

- 不读取或共享任一 owner 私有表，不以跨仓事务构建 Bundle。
- 不从事件、缓存、projection、摘要或 ref 猜测缺失 canonical body。
- 不生成代表 governance 或项目 owner 的 policy、claim、状态或事件。
- 不让查询、验证或 retry 隐式触发外部写入。
- 不让 `sealed/verified/eligible/material-ready/accepted` 互相推导或推导全局成功。
- 不在 commit-unknown 下盲重放可能产生副作用的 handoff/storage action。
- 不把供应商、KMS、secret、runtime、sandbox、UI、SDK cache 纳入 Archive 业务核心。

## 6. 复杂度、回填与待确认

职责按“请求/采集/包/验证/存储/读取/恢复”能力面检查，但此步尚不宣布它们是最终限界上下文。正式 §4 承接职责表与红线；`AR-UP-001~009` 保留在风险章。

## 7. 自检与下一步门禁

做/不做/易混淆均有 owner 归因；没有展开系统图、数据表、接口或实现。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 4 系统边界与上下文`。
