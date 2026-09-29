# 01 架构 Step 1：确认需求基线

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；模式：`full-restart + single-agent-serial`；对应架构 SOP Step 1。

### Step 内计划

- [x] 读取项目台账、01 flow、正式 00、架构 SOP/书写规范及专项正式上游。
- [x] 回答需求稳定性、边界、所有权、依赖与一致性问题。
- [x] 诊断 README、旧 01 与 draft 污染。
- [x] 形成需求基线、架构硬约束和未关闭风险。
- [x] 判断复杂度、回填位置并执行本步自检。

本步只筛选基线，不预设架构单元；Step 5 才正式推导内部语义单元。

## 2. 本步输入

- 本仓正式 `00-需求文档.md`：A1~A9、F-AR-001~009、BR-AR-001~012、AR-UP-001~009。
- `standards/document/全局项目依赖关系与裁剪规则.md`：Layer 4 串行顺序和 L4-archive 总矩阵。
- `L1-workspace` 正式 00~07 与 project ledger：只读 projection、coverage/freshness、下游 archive seam。
- identity、conversation、work、process、governance、artifact 的正式 00~07 与必要台账：业务 truth owner 与 export/restore 边界。
- `L4-observability` 正式 00~07 与台账：审计/证据材料和 backend authority。
- `L0-core`、`L0-bus`、`L0-sdk` 正式文档：共享契约、事件主干和下游访问边界。
- README、旧正式 01/02/03/05/06、`draft/01~03`：只作历史诊断。

输入状态：正式 00 可作为直接基线；专项上游允许得出保守边界，但精确 export、decision、storage、integrity 和 restore receiver 合同未闭合。

## 3. SOP 问题回答

1. 架构依赖哪些需求结论？依赖受控请求、逐源捕获、manifest/closure、验证、存储/生命周期、只读验证、恢复计划、owner handoff 与逐项补偿九段闭环。
2. 哪些已经稳定？Archive 自有真相范围、外部 truth owner、projection/ref 不升格、无跨域写权、未知 fail-closed 和依赖类型分离稳定。
3. 哪些仍待确认？逐 owner export/fence/coverage、项目状态 handoff、governance decision、密码学、存储、Artifact/Observability 材料、workspace export 和 restore receiver 合同。
4. 哪些影响边界？项目状态、治理裁决、Artifact 正文/血缘、审计链、workspace projection 归属直接限制 Archive 职责。
5. 哪些影响数据所有权？Bundle/manifest/job/result 属 Archive；L1 snapshot/export、workspace projection、artifact/audit material 仍归来源 owner。
6. 哪些影响依赖和一致性？只有核验的共享契约可 compile；跨域 capture/restore 是 runtime/ref/event/adapter，按 source/item 局部收敛而非全域事务。

## 4. 历史材料诊断

| 历史主张 | 诊断 | 当前处置 |
|---|---|---|
| 固定六域切片、SoA/AIIA/Claim 必含 | 没有 owner-safe export 和治理 authority | 不继承；按请求声明与 source-authority matrix 判定 |
| archived/dissolved 自动触发、Restore 改回 Active | 侵入 `L1-work`/正式 owner 生命周期 | 禁止；只消费决定并 handoff |
| 默认 7 年、自动 purge | 侵入 governance/法律 owner | 保持 blocked，缺 decision fail-closed |
| Rust/PostgreSQL/S3/MinIO/Glacier | 未经实现仓与配置阶段核验 | 不作为架构事实 |
| 固定 hash/signature、完整率 100% | 算法、KMS、签名 authority 未闭合 | 只能表达验证 seam 和 unknown |
| 5 分钟/2 分钟/99.9% | 无 workload 和测量 authority | 不承诺数值；只保留可判别进度/失败 |
| archive index/Workspace/audit summary 是业务快照 | 将 projection/摘要/ref 升格 | 明确分层且禁止作为 canonical truth |
| Restore 是例外写权 | Bundle 被误当跨域写权限 | 删除例外；owner receiver 自己决定提交 |

## 5. 改动前后对比

| 项 | 历史材料 | 当前架构基线 | 原因 |
|---|---|---|---|
| 归档范围 | 固定域集合 | 请求声明集合 + 逐 source authority | 防止假完整性 |
| 项目生命周期 | Archive 推动状态 | 正式 owner 决定；Archive 仅记录 ref | 保持单一真相 |
| 恢复 | 跨域逆向写入 | owner-specific material + handoff/outcome | 无通用跨域写权 |
| 完整性 | 生成 hash 即可信 | closure、digest、signature、compatibility 独立判别 | 未知不能伪装通过 |
| 设施 | 固定产品/拓扑 | 外部 adapter seam | 产品选择未关闭 |
| 成功 | 局部成功推导全局成功 | per-source/per-item 状态与 unknown/partial | 防止语义压平 |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 以正式 00 为直接基线，历史材料只做污染审计 | 防止旧结论反向污染 | 需重建全部架构推导 | 采用 |
| 按逐源/逐 owner 局部可判别闭合 | 可保留 partial 与异构合同 | 不承诺单一全局快照 | 采用 |
| 用 workspace projection 填补 owner 缺口 | 读取方便 | 产生伪 canonical truth | 不采用 |
| 由 Archive 统一解释 policy 与恢复提交 | 表面闭环简单 | 打穿治理与 truth owner | 不采用 |

## 7. 结构化中间产物

### 7.1 架构需求基线

| 基线 ID | 稳定需求结论 | 直接影响 | 状态 |
|---|---|---|---|
| `AB-AR-001` | 请求必须携带可解释主体、范围、依据与幂等语境 | 入口、作业、审计 | stable |
| `AB-AR-002` | 每个 slice 独立绑定 authority、version/watermark、fence、coverage、status | 上下文、数据、一致性 | stable boundary；合同 pending |
| `AB-AR-003` | manifest 声明与材料/ref 集合必须形成可判别闭包 | Bundle 核心语义 | stable |
| `AB-AR-004` | closure、digest/signature、compatibility、storage commit 必须分轴 | 状态、交互、失败 | stable boundary；机制 pending |
| `AB-AR-005` | storage location/tier/lifecycle execution 属 Archive 执行记录，不等于 policy truth | 数据、设施、治理 seam | stable boundary |
| `AB-AR-006` | 只读验证携带 provenance、coverage、integrity、compatibility 与 lifecycle 姿态 | 输出、安全 | stable |
| `AB-AR-007` | 恢复先验证并形成 per-owner plan/material | 交互、恢复边界 | stable |
| `AB-AR-008` | owner handoff 不直接写库，accepted/committed 由 receiver owner 定义 | 依赖、补偿 | stable boundary；receiver pending |
| `AB-AR-009` | partial/stale/missing/conflicting/unsupported-version/integrity-failed/commit-unknown 不得压平 | 所有状态和横切 | stable |
| `AB-AR-010` | Workspace、Artifact、Observability 材料必须标明自身 authority 类型 | source-authority matrix | stable |

### 7.2 架构硬约束

1. Archive 只拥有归档专属请求/作业、Bundle/manifest、capture/closure/verification/storage execution、restore plan/material/handoff/outcome。
2. Archive 不拥有、不推断、不反写任何 L1、workspace 或 observability 业务 truth。
3. 项目 archived/dissolved/restored、retention、legal hold、删除授权和风险接受必须来自正式 owner。
4. 恢复只能经 owner-specific 正式 receiver；Bundle 不是通用写权限。
5. 每类来源必须明确 authority；workspace projection、artifact ref、audit material 不得替代 L1 canonical source。
6. 只有已核验共享契约可形成 compile dependency；runtime/event/ref/adapter/fake 保持边界类型。
7. 未闭合的存储、密码学、schema evolution、policy 和 receiver 合同默认 blocked/unknown/fail-closed。
8. 局部成功不能推导 sealed、verified、archived、restored、owner committed 或 readiness。

### 7.3 未关闭需求风险

| 风险 | owning project / authority | 架构影响 | 保守口径 |
|---|---|---|---|
| `AR-UP-001` owner export/fence/coverage | 各 L1 truth owner | capture 和跨源一致性 | per-source partial/blocked |
| `AR-UP-002` 项目状态与 handoff | `L1-work`/正式项目 owner | admission/restore 前置 | 只读 decision ref |
| `AR-UP-003` policy/hold/delete/risk | `L1-governance`/明确 owner | lifecycle action | 缺失或冲突即 blocked |
| `AR-UP-004` digest/signature/KMS/schema | 密码学/契约 owner 待定 | verification/compatibility | unknown/unsupported |
| `AR-UP-005` storage/tier/retrieval | 外部设施 owner 待定 | location/commit/readability | adapter + commit-unknown |
| `AR-UP-006` Artifact closure | `L1-artifact` | content closure | approved material/ref only |
| `AR-UP-007` audit/evidence export | `L4-observability` | evidence coverage | redacted material/ref only |
| `AR-UP-008` workspace export | `L1-workspace` | auxiliary projection slice | explicitly projection only |
| `AR-UP-009` restore receivers/outcomes | 各 truth owner | handoff/compensation | per-item unknown/partial |

## 8. 复杂度、停审与回填草稿

本步复杂度为跨仓基线筛选，不拆 U 单元。正式 §1 承接来源关系，§3 承接硬约束，§15 承接风险，§16 以 AB-AR-001~010 作为追溯入口。历史诊断不进入正式正文。

本步停审：基线均来自正式 00 与正式上游边界；未把任何 pending 合同写成可用；未提前定义内部模块、协议、schema 或设施产品。

## 9. 待确认事项

仅承接 `AR-UP-001~009`，本步未新增 owner 事实。它们不阻塞保守架构推导，但阻塞相应正向成功、精确协议与 readiness 声明。

## 10. 自检与下一步门禁

| 检查 | 结果 |
|---|---|
| 需求基线来自正式 00 与正式上游 | pass |
| 稳定边界与 pending 合同分离 | pass |
| 历史材料未直接继承 | pass |
| truth/projection/ref/adapter 类型未混淆 | pass |
| 可进入 Step 2 | `pass_with_upstream_blockers` |

`thinking = done`；`writing = done`；`self_check = done`；`next_allowed_action = Step 2 架构目标与约束`。本 pass 仅为设计静态门禁。
