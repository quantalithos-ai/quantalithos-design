# 04 Step 2：明确配置设计目标、范围和非范围

## 1. Step状态

2026-10-02；completed / selfcheck_done / stop_review。Step1已通过；正式04尚未装配。目标是把配置职责分为P0、P1、P2，避免将部署或业务策略混入配置设计。

### Step内计划

| 字段 | 收口结论 |
|---|---|
| 本步目标 | 明确配置目标、P0/P1/P2、范围和非范围去向 |
| 本步输入 | Step1边界、03字段/入口、02配置影响 |
| 本步输出 | 目标表、非范围表、后续文档承接 |
| 应问的问题 | 主链必须配置什么；哪些留给部署/测试/实施；哪些永不配置化 |
| 期望产出 | P0/P1/P2结构化结论和非范围去向 |
| 回填位置 | 正式04§2 |
| 执行约束 | 不写部署命令、业务bypass或外部结果 |
| 进入下一步条件 | 范围稳定且无配置契约待回写 |

## 2. 本步输入

[Step1边界](04_config_step_01_upstream_boundary.md)、03§2/§3/§13、02§2/§11及配置SOP Step2。03已有七字段和八slot，不新增RuntimeConfig字段。

## 3. SOP问题回答

P0覆盖启动可解析性、API监听绑定、PG配置引用、SDK profile引用、八slot引用、Worker批量/租约和默认语言。P1覆盖profile差异、secret rotation、配置变更审计、失败姿态和测试矩阵；P2是未来config center/admin override、动态reload、扩展adapter或Billing/Archive配置，当前不启用。部署命令、容器挂载、真实端点和运维值班交给09/平台资料。

## 4. 当前文档问题诊断

若将所有owner capability、搜索相关性、retry、approval、可见性和状态转换列为配置，会破坏03不变量。若把API原型`0.0.0.0:9090`当生产默认，会违反03§13。需将技术资源边界与业务决策边界明确分开。

## 5. 改动前后对比

| 目标层 | 之前 | 本Step结论 |
|---|---|---|
| P0 | 未分层 | 七字段映射与严格启动装配 |
| P1 | 混入运行策略 | profile/审计/secret/失效/下游承接 |
| P2 | 未声明 | 动态中心、admin override、新owner lane均future/blocker |
| 非范围 | 仅“部署另文档” | 明确交给03、05、06、07、09或上游owner |

## 6. 配置设计取舍

采用单一结构化JSON文件、按功能域分层；不允许环境变量逐项静默覆盖。API/Worker共用解析模型但按进程使用字段；Web公共API base是build-time边界，不进入服务RuntimeConfig。所有server配置startup，改变需新快照/重启。

## 7. 结构化中间产物

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| P0启动装配 | 解析七字段映射、八slot引用和profile envelope | 03 RuntimeConfig builder可校验输入 |
| P0安全边界 | secret只ref、不输出、不自称资格 | 05/06安全与阻断门禁 |
| P1环境姿态 | local/ci/staging/production能力矩阵 | 05环境覆盖、07配置准备 |
| P1失败闭合 | 缺失/错配/不可达/漂移分别fail-fast或fail-closed | 05负例、06配置门禁 |
| P2保留 | config center、admin、hot reload、财务/归档 | 风险/重开条件，不写成当前项 |

| 非范围 | 留给哪一层 / 文档 |
|---|---|
| 部署命令、挂载、进程拓扑、证书申请和值班流程 | 09部署运维与平台配置 |
| 完整test case、fixture、run、report | 05测试方案 |
| acceptance verdict/evidence/signoff | 06验收标准 |
| phase/task/commit/boundary | 07实施计划（正式07后创建台账） |
| owner approval、资产正文、支付、安装、通知阅读 | 相应owner或受控00/01重开 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| P0/P1/P2分层只约束配置文档范围 | 否 | 范围 | 不适用 | 无回写 |
| Web API base作为既有03§13 build-time边界 | 否 | 配置语义 | 03§13 | 无回写 |

## 9. 回填草稿与待确认事项

正式§2写P0/P1/P2、非范围去向、原型端口非生产声明。待确认的profile容量值和TLS/auth来源不作为默认值；没有这些值时配置结构可审查，但不能宣称可部署。

## 10. 进入下一步条件

目标、P0/P1/P2与非范围稳定；不存在代码契约待回写。Step2停审通过，进入Step3。
