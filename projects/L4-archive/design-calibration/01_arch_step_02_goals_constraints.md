# 01 架构 Step 2：架构目标与约束

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 2。

### Step 内计划

- [x] 读取 Step 1、正式 00 的目标/规则/NFR/blocker。
- [x] 回答必须成立的结构、不可变约束、阶段取舍与非目标。
- [x] 诊断旧材料中的功能、技术和无来源数字混层。
- [x] 形成四类结构化结论、回填草稿和门禁自检。

## 2. 本步输入

Step 1 的 `AB-AR-001~010`、八项硬约束和 `AR-UP-001~009`；正式 00 §2/4/7/10/13/15；架构规范 §4.2/4.3。

## 3. SOP 问题回答

1. 必须确保什么成立？跨域材料必须逐源可归因、Bundle 闭包与各验证轴可独立判断、恢复只交给 owner、所有未知都可见。
2. 什么不可变？真相单一、无跨域直写、治理决定外置、projection/ref 不升格、依赖分类不混淆、未知 fail-closed。
3. 什么可接受收缩？当前不固定统一 export schema、存储/密码学产品、量化 SLA；只保留稳定 seam 与状态上限。
4. 哪些目标可判断？source/manifest 项可追溯、闭包可判别、验证轴不互相推导、handoff 逐 owner 有结果或未知。
5. 什么不是当前架构主线？UI/SDK cache、runtime/tools/sandbox/capability/marketplace、观测后端、通用 Artifact 和跨域业务状态。

## 4. 历史材料诊断与前后对比

| 问题 | 历史表达 | 当前结论 |
|---|---|---|
| 目标与功能混写 | “支持 Bundle/Restore/Retention” | 改为必须守住的结构性结果 |
| 约束与方案混写 | 固定六域、S3、PG、Rust | 从目标/约束移除 |
| 阶段取舍与越界混写 | “先不恢复 dissolved” | Archive 根本无项目状态裁决权，列为非目标/红线 |
| 成功口径 | 上传/签名/交接即成功 | closure/integrity/storage/handoff 独立，不互相推导 |
| 数值 | 5/2 分钟、99.9%、7 年 | 无 authority，不作为目标或约束 |

## 5. 设计取舍

| 取舍 | 可选路径 | 结论 | 理由 |
|---|---|---|---|
| 跨源一致性 | 全局一致快照 / per-source fenced slice | 采用后者 | owner 合同异构且无全局事务权 |
| 完整性 | 单一 sealed 状态 / 多轴状态 | 采用多轴 | 避免局部成功推导全局可信 |
| 外部能力 | 固定产品 / port-adapter seam | 采用 seam | authority 与配置尚未闭合 |
| 恢复 | Archive 编排写入 / owner handoff | 采用 handoff | 保持业务提交 owner 不变 |

## 6. 结构化中间产物

### 6.1 架构目标

| 架构目标 | 说明 |
|---|---|
| 承载可归因的跨域归档材料边界 | 否则多来源历史材料无法证明 owner、版本、fence 与覆盖范围。 |
| 守住 Bundle 声明与内容闭包 | 否则缺失、多余或越界材料会被误判为完整。 |
| 分离完整性、兼容性、存储和生命周期执行状态 | 否则任一局部结果会越权替代其他判断。 |
| 支撑长期只读验证而不冒充业务查询 | 否则 Archive 会成为陈旧的影子业务仓。 |
| 支撑 owner-specific 恢复计划与交接 | 否则 Bundle 会被误当跨域写权限。 |
| 保持失败、未知、重试和补偿可追溯 | 否则异步外部副作用会被重复或伪装完成。 |

### 6.2 不可变约束

| 约束 | 说明 |
|---|---|
| 不拥有或反写外部业务 truth | 保护 identity/conversation/work/process/governance/artifact/workspace/observability owner。 |
| 不自行决定项目状态或治理结果 | `archived/restored`、retention、hold、delete、risk 均归正式 owner。 |
| 不把 projection、摘要或 ref 当 canonical body | 本地材料存在不转移 authority。 |
| 不以单一时间戳声称跨域一致 | 每个 source 只能依据自己的可比版本/fence/coverage。 |
| 不让 Bundle 或 sealed 获得业务语义 | Archive 自有状态不推导 owner 状态。 |
| 不把 runtime/event/ref/adapter/fake 伪装成 package 依赖 | 保护跨仓编译边界。 |
| 不在未知外部结果时乐观推进 | 缺失、冲突、unsupported、commit-unknown 必须 fail-closed。 |

### 6.3 当前阶段可接受取舍

| 取舍 | 当前口径 |
|---|---|
| 统一切片 schema 尚未确定 | 保留逐 source binding 和兼容判定，不固化字段。 |
| 存储/签名/KMS/压缩产品尚未确定 | 只定义外部能力角色与结果语义。 |
| 无统一 workload baseline | 只要求进度、阻断和局部结果可见，不给分钟级承诺。 |
| 并非所有 owner 都已有 restore receiver | 允许计划/材料停在 blocked/pending，不宣称恢复完成。 |
| 外围搜索、跨区灾备与复杂介质演进 | 当前不进入核心闭环，未来仅由触发条件开启。 |

### 6.4 架构非目标

| 非目标 | 不展开原因 |
|---|---|
| 不设计项目/成员/对话/流程/治理/制品生命周期 | 这些是相邻 owning domain 的架构。 |
| 不设计统一授权、RetentionPolicy 或法律处置系统 | Archive 只消费正式决定。 |
| 不设计通用 Artifact、审计后端或 workspace view | 各自已有正式 owner。 |
| 不设计产品 UI、SDK client/cache 或同步产品 | 属下游消费表面。 |
| 不设计 runtime/tools/capability/sandbox/marketplace | 与归档业务语义无关。 |
| 不在 01 固化 schema、API、数据表、算法、产品或部署参数 | 属后续设计或未闭合外部 authority。 |

## 7. 复杂度、回填与待确认

目标/约束是全仓横向结论，无需拆 U 单元。正式 §2 承接目标，§3 承接不可变约束、取舍与非目标。`AR-UP-001~009` 原样进入 §15；不把“采用 seam”误写成外部能力 ready。

## 8. 自检与下一步门禁

四类结论互不混淆；目标不是功能清单，约束不是技术方案，取舍不包含边界外职责，非目标不伪装阶段 TODO。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 3 职责边界`。
