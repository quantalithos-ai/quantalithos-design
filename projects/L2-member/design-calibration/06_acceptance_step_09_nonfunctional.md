# Step 9. 定义非功能验收门禁

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 9
> 回填章节：06-验收标准.md §9
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_09_nonfunctional.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义非功能验收门禁 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | 00 NFR-L2M-001~016；03 §11~§15；04 §6、§8、§11~§12；05 §10、§13、§14 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_09_nonfunctional.md |

## 2. 本步目标

定义性能结构性 sample、可用性 / 降级、安全 / redaction、配置 fail-fast、依赖边界、恢复 / replay、可观测性和证据完整性的非功能门禁。没有来源的硬 P95、SLA、吞吐或生产阈值不写入当前 P0。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 00 §13 | NFR-L2M-001~016 的需求语义 |
| 03 §11~§15 | error、recovery、idempotency、config、observability |
| 04 §6、§8、§11~§12 | profile、secret、validation、生效和降级 |
| 05 §10、§13、§14 | 专项测试、EV、证据和 residual |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能属于 P0？ | 阶段 duration / count sample、依赖失效可判别、fail-closed、body-free、low-cardinality、Query no-write、Job no-repair、replay / rollback、config fail-fast、Core-only compile 和 report integrity。 |
| 阈值来自哪里？ | 安全、依赖、redaction、no-write、事实等级是硬门禁；性能只有需求 / 设计允许的阶段分解 sample，当前没有可引用的硬数值阈值。 |
| 哪些专项未覆盖？ | production-like 容量、真实 DB / Bus / provider / image 产品、P1 selected-run、长期 retention 和深度外部集成；进入 residual，不冒充 P0 pass。 |
| 哪些失败阻断？ | redaction leak、non-Core package、config silent fallback、P0 slot unavailable 却标通过、Query / Job 修 source、evidence / report 伪造、核心恢复 / idempotency 失败。 |
| 证据来自哪里？ | 05 规划的 local-smoke、service-flow-fast、config-redline、dependency-boundary、infra-fake-parity、replay-recovery、redaction-boundary、report-generation-audit 等 suite 的真实报告。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 有旧 P95 / SLA 数字 | 删除，不具当前来源效力 |
| 外部可用性被当作 member 性能 | 分解 local stage 与 external wait，只验姿态和 sample |
| 安全只写“无泄露” | 固定 forbidden body / secret / stack / high-cardinality 的 scan 规则 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 性能 | 固定数字但无 workload authority | 结构性 duration / count sample；数值进入风险 |
| 可用性 | 外部服务可用即通过 | unavailable / degraded / blocked / unknown 可判别且 local truth 不变 |
| 安全 | 泛化安全检查 | artifact、report、log、metric、trace、audit、outbound 全面脱敏 |
| 依赖 | “能联调” | compile / runtime / event / ref / adapter 分类和事实等级 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 恢复旧 P95/SLA | 恢复 / 不恢复 | 不恢复；等待正式 workload / SLO authority |
| P1 selected-run unavailable | 阻断全部 P0 / 记录 residual | 记录 residual，除非被显式提升为 P0 |
| redaction 失败 | 可风险接受 / 不可 | 不可，命中 VF-L2M-004 |
| dependency boundary 失败 | 有条件通过 / 不可 | 不可，命中 VF-L2M-007 |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 | 维度 | 要求 / 阈值 | planned 证据 | 结论口径 |
|---|---|---|---|---|
| AC-L2M-NFR-001 | 性能结构性 sample | local processing、external wait、derived path 分段有 duration / count sample；无硬 P95 / SLA | EV-L2M-SMOKE-*、EV-L2M-REPORT-* | 无 sample 或依赖 P1/P2 才能完成则不通过；数值偏高进 residual |
| AC-L2M-NFR-002 | 可用性 / 降级 | host / Runtime / Bus / resolver / Store 不可用时返回 blocked / waiting / unknown / stale / gap，保留历史 | EV-L2M-ENTRY-*、EV-L2M-INFRA-* | 姿态缺失、默认成功或 local truth 被逆写则不通过 |
| AC-L2M-NFR-003 | 安全 / redaction | raw body、secret、token、hidden reasoning、definition body、full stack、foreign body 不出现在任何输出面 | EV-L2M-REDACTION-*；redaction-check.md | 任一泄露直接阻断，不得风险接受 |
| AC-L2M-NFR-004 | 配置 fail-fast | P0 profile 可校验；非法值、高优先级非法 env、required slot 缺失、production fixture 混入均 fail-fast / reject | EV-L2M-DEPENDENCY-*、EV-L2M-CONTRACT-* | silent fallback、partial Ready 或错误 profile 不通过 |
| AC-L2M-NFR-005 | dependency boundary | 只有 core-contracts 为 planned compile candidate；运行期 / 事件 / ref / adapter / fake 分类正确 | EV-L2M-DEPENDENCY-* | 任一 non-Core package 或 pending seam 伪闭口不通过 |
| AC-L2M-NFR-006 | 恢复 / 幂等 | duplicate、conflict、in-flight、commit-unknown、rollback、CAS、partial item 可解释且不第二写者 | EV-L2M-REPLAY-*、EV-L2M-INFRA-*、EV-L2M-JOB-* | 盲重跑、空成功、缺 carrier 或 source repair 不通过 |
| AC-L2M-NFR-007 | 可观测性 / 审计 | accepted / rejected / blocked / unknown / consumer / Job / config failure 均有 safe ref、低基数标签和可关联 trace；不依赖 backend ready | EV-L2M-REDACTION-*、EV-L2M-SERVICE-* | 缺关键关联、泄露或高基数标签不通过 |
| AC-L2M-NFR-008 | 证据完整性 | 每个 P0 suite 有 raw artifact、report、failure reason、digest；EV 从真实 pair 推导 | EV-L2M-REPORT-* | orphan / static EV、缺 pair 或 latest 路径阻断 |

### 8.2 NFR 到需求的映射

| 需求 NFR | 本 Step 门禁 |
|---|---|
| NFR-L2M-001~003 | AC-L2M-NFR-001 |
| NFR-L2M-004~005 | AC-L2M-NFR-002 |
| NFR-L2M-006~008 | AC-L2M-NFR-003、NFR-004 |
| NFR-L2M-009~010 | AC-L2M-NFR-007 |
| NFR-L2M-011~013 | AC-L2M-NFR-006 |
| NFR-L2M-014~015 | AC-L2M-NFR-003、NFR-007 |
| NFR-L2M-016 | AC-L2M-NFR-004、NFR-005、NFR-008 |

### 8.3 非功能停审

| 审计项 | 结论 | 说明 |
|---|---|---|
| 硬阈值有来源 | 通过（设计级） | 当前只保留 sample / trend |
| redaction / dependency 为硬门禁 | 通过 | 不可风险接受 |
| P1/P2 未污染 P0 | 通过 | selected-run / production future 进入 residual |
| 证据可回指 TC / artifact / report | 通过（规划） | 执行时需真实 pair |

## 9. 回填草稿

正式 §9 应写入 AC-L2M-NFR-001~008、NFR 映射和无硬性能数字的解释；不得把旧 P95 / SLA 写成阈值。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| workload / SLO authority | 性能硬阈值 | 后续正式基线后重审 |
| production-like profile | 发布资格 | P1/P2 residual |
| retention / archive policy | 长期证据 | 后续运维标准 |

## 11. 进入下一步条件

- [x] P0 非功能门禁、阈值来源和失败影响明确。
- [x] 安全、依赖、恢复、观测和证据完整性可判定。
- [x] 未引入无来源性能数字。
