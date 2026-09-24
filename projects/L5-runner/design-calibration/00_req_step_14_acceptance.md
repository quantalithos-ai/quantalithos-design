# 00 需求 Step 14 · 验收标准

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_10_business_rules.md`、`00_req_step_11_data_ownership.md`、`00_req_step_13_nonfunctional.md`
> 回填章节：正式 `00` §14 验收标准

## 1. 验收口径

验收以用户可见行为、Runner 本地真相和上游 owner 的正式引用为依据。`accepted`、本地 PID、端口开放、cache 命中、HTTP 200、toast、stdout/stderr 或 handoff receipt 均不能单独证明运行成功、清理完成、审计成立或治理批准。上游合同未闭合的正向案例保持 `blocked/pending`，不得用 fixture、fake 或本地推断替代。

## 2. 核心验收标准

| 验收 ID | 能力节点 | 场景与通过条件 | 失败/禁止条件 | 承接 |
|---|---|---|---|---|
| `AC-RUN-001` | `CP-RUN-01` | 在有效 actor/session/project 语境下，用户选择一个 immutable Release/version；页面显示来源、scope、选择世代和有效性。 | 缺少语境、只给 `latest`、默认分支或目录最新文件时不得进入取得或运行。 | `FR-RUN-001~002`; `BR-RUN-001~005` |
| `AC-RUN-002` | `CP-RUN-01` | 版本 authority 不可见、过期、撤销或冲突时，Runner 显示对应 blocked/restricted/invalidated 姿态并保持无副作用。 | 本地角色、历史成功、缓存或空结果不得补齐 authority。 | `FR-RUN-002`; `BR-RUN-003~005` |
| `AC-RUN-003` | `CP-RUN-02` | 取得阶段能区分 pending、progress、paused/resumable、failed、complete；断线后可安全恢复或重新选择。 | 传输完成不得直接标为 verified；失败材料不得进入 Sandbox。 | `FR-RUN-003`; `BR-RUN-006~007` |
| `AC-RUN-004` | `CP-RUN-02` | manifest/digest/signature、source freshness、平台资格和 cache 绑定均有效时，材料才显示 qualified。 | 缺失、漂移、不匹配或 stale 时保持 quarantine/invalid/blocked，不得通过改名或重新声明放行。 | `FR-RUN-004`; `BR-RUN-006~008` |
| `AC-RUN-005` | `CP-RUN-03` | 运行请求携带选择、资格、资源语境和关联；用户可区分未发出、accepted、pending、rejected、unknown。 | `accepted`、PID、端口或 toast 不得显示为 running 或成功。 | `FR-RUN-005~006`; `BR-RUN-009~011` |
| `AC-RUN-006` | `CP-RUN-03` | 正式 owner 返回状态后，Runner 展示准备、启动、运行、停止、终态及来源；控制意图与结果分开。 | 缺少 Runtime/Sandbox owner ref 时不得确认 running/terminal success。 | `FR-RUN-006~007`; `BR-RUN-011~013` |
| `AC-RUN-007` | `CP-RUN-04` | 端口、路径、磁盘、进程和平台冲突可见并标注影响；正式 allocation/lease 与本地 probe 不一致时显示 conflict。 | 不得静默抢占、伪造可用或以本地 probe 覆盖 owner 结论。 | `FR-RUN-008`; `BR-RUN-015~016` |
| `AC-RUN-008` | `CP-RUN-04` | stop/cleanup 后能区分意图、owner 接收、控制确认、资源释放和保护材料；active lease/capture/handoff/retention/orphan 存在时保留保护。 | guard 未确认不得删除或淘汰材料；磁盘压力不得绕过保护。 | `FR-RUN-009`; `BR-RUN-013~016` |
| `AC-RUN-009` | `CP-RUN-04` | 断线、休眠、重启或 session 过期时冻结危险副作用，重连后重新验证语境并呈现 reconciled/manual-review。 | 不得凭 cursor、cache、旧页面或重连成功自动重放未知 start/stop/cancel/cleanup。 | `FR-RUN-010`; `BR-RUN-012`, `BR-RUN-017~018`, `BR-RUN-024` |
| `AC-RUN-010` | `CP-RUN-05` | 输出预览、失败诊断和 handoff 均有 source ref、freshness、visibility/redaction 姿态；可显示 partial/stale/restricted/blocked。 | 不得泄露 secret/raw body 或把本地材料、ACK、preview 当 evidence/report/verdict/signoff。 | `FR-RUN-011~013`; `BR-RUN-019~023` |
| `AC-RUN-011` | 全局边界 | 跨域协作只经 SDK/正式 API/公开 adapter，Runner 不修改 Release、policy、execution、lease、audit 或 archive truth。 | 直接调用 Sandbox 私有 backend、共享数据库事务或绕过 SDK 必须被边界拒绝。 | `BR-RUN-022`, `BR-RUN-025` |

## 3. 非功能验收

| 类别 | 通过条件 | 当前不固定的量化项 |
|---|---|---|
| 性能 | 选择、取得/验证、状态展示、恢复均有可解释进度，不因本地编排阻塞主流程；后续分别测量各阶段。 | P95/P99、冷/热启动秒数、并发量、带宽和容量待权威 workload。 |
| 可用性 | 断线、取得失败、owner 暂不可用、资源冲突时提供安全下一步并保持 blocked/unknown 语义。 | 平台覆盖率、恢复时限和成功率待合同与测试环境。 |
| 安全 | 无隐式版本、越权 truth、私有实现调用或敏感正文泄露；所有未知副作用 fail-closed。 | 具体算法、沙箱技术和平台策略后置。 |
| 审计/可追溯 | 选择、authority、取得/验证、请求、控制、清理、恢复、预览、诊断、handoff 可回指 source/correlation/freshness。 | 正式 audit/evidence/report/verdict 的 owner 指标后置。 |
| 幂等/一致性 | source version/digest、generation、lease epoch 冲突时停止副作用；查询/刷新/重连不写上游 truth。 | 重试窗口、并发上限、存储 TTL 后置。 |
| 可观测性 | 本地异常可形成 redacted、bounded 诊断摘要；telemetry 与业务审计分离。 | retention、采样和平台 exporter 后置。 |

## 4. 验收边界与证据

本 Step 只定义未来验收判断，不声称已有实现、测试结果、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness。所有上游 blocker 必须在验收记录中显示为 blocked/pending，直到 owner 正式合同闭合。

## 5. 自检与门禁

- [x] 五个能力节点均有正向和负向验收。
- [x] `FR-RUN-001~016`、`BR-RUN-001~025`、六类 NFR 均有承接。
- [x] 数据归属、owner truth、redaction 和未知副作用有验收边界。
- [x] 未引入实现协议、技术选型或伪造测试事实。

`Step 14 gate_status = pass`；下一步允许进入 `Step 15 风险与待确认事项`。
