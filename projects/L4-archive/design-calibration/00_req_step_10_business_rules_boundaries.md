# Step 10. 业务规则与边界约束

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §10
- gate_status：`pass_with_blockers`
- gate_reason：规则仅表达需求层硬约束，已覆盖 A1~A9；治理和上游合同未闭合项保持 fail-closed。
- next_allowed_action：进入 Step 11 数据需求与数据归属。

### 1.1 Step 内计划

- [x] 读取 Step 2、Step 7、Step 9 和需求 SOP/书写规范的规则章节。
- [x] 按 A1~A9 回答不变量、禁止行为、显式变化、边界、治理和审计问题。
- [x] 诊断旧文档中固定六域、项目状态、合规声明和固定 retention 规则污染。
- [x] 比较按能力挂载规则与按对象/实现校验罗列规则的方案。
- [x] 形成 BR-AR-001~012、功能映射和能力级停审记录。
- [x] 形成回填草稿、待确认事项并完成跨能力规则自检。

## 2. 本步输入

- `design-calibration/00_req_step_02_position_boundary.md`
- `design-calibration/00_req_step_07_core_capability_loop.md`
- `design-calibration/00_req_step_09_functional_requirements.md`
- `standards/document/需求文档讨论流程_SOP.md` Step 10
- `standards/document/需求文档书写规范.md` §4.10
- 旧 `00-需求文档.md` §6.2（仅作污染审计）

## 3. SOP 问题回答

1. 当前讨论哪些能力节点，哪些不变量必须成立？

   覆盖 A1~A9。每个切片必须有可解释 authority；manifest 必须与材料/引用闭包一致；integrity、compatibility、storage 和 handoff 结果彼此独立；任何局部或未知结果不得提升为全局成功。

2. 哪些行为必须禁止？

   禁止 Archive 自行决定项目状态、治理结论、保留期限、legal hold、删除授权、销毁权限或 owner committed；禁止 projection/ref/摘要冒充 canonical truth；禁止恢复直接写上游数据库。

3. 哪些变化必须显式发生？

   digest/signature/compatibility、storage placement/lifecycle action、restore plan、handoff outcome、retry/compensation 必须分别产生可追溯结果，不能从相邻阶段隐式推导。

4. 哪些治理、审计和边界条件必须附带？

   retention/hold/delete/risk action 必须附带正式 decision/ref；请求、source binding、closure、verification、storage、handoff 和补偿必须能追溯来源或外部反馈。

5. 是否有孤儿规则或实现泄漏？

   无。BR-AR-001~012 均能回指 F-AR-001~009 或仓边界，且不包含 API、字段、事务、异常码或内部校验函数。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 BR-001/002/005 | 把 archived/dissolved/active 当作 Archive 可判断或修改的状态。 | 越过 `L1-work` 等生命周期 owner。 |
| 旧 00 BR-003 | “缺任一六域即失败”把固定集合冒充请求与 owner authority。 | 无法表达合法裁剪、partial 和 unsupported source。 |
| 旧 00 BR-004 | 强制 SoA/AIIA/Conformance Claim。 | Archive 反向定义 governance 真相。 |
| 旧 00 BR-006 | 把 retention 执行写成 Archive 自有决定。 | legal hold/delete/risk 边界失守。 |
| 旧 01/03 | 把数据库约束、API 校验和供应商行为当业务规则。 | 需求层混入实现机制。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 规则主轴 | 项目状态与固定六域 | A1~A9 的材料与交接不变量 | 对齐 Archive-owned boundary。 |
| 成功语义 | 归档/恢复统一完成 | closure、integrity、storage、handoff 独立 | 防止局部结果冒充全局成功。 |
| retention/delete | Archive 自动决定 | 只执行正式治理 decision | 保持 governance authority。 |
| 恢复 | 直接写回 active | owner-specific handoff | 保持各 truth owner 写权。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 规则按能力/功能挂载 | 可追溯且能直接防止串仓。 | 同一全局规则可能保护多个能力。 | 采用。 |
| B. 按 Bundle/Restore 对象罗列 | 表格较短。 | 容易遗漏 source、治理和提交未知边界。 | 不采用。 |
| C. 按校验函数、DB constraint、API 条件罗列 | 接近实现。 | 越过需求层且绑定未定技术。 | 不采用。 |

## 7. 结构化中间产物

### 7.1 业务规则表

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-AR-001` | 不变量 | 每个归档切片必须关联请求声明的范围、source authority、版本/水位、fence、coverage 和当前状态；缺一项不得宣称 captured。 | A1/A2 source binding |
| `BR-AR-002` | 不变量 | manifest 只能声明请求范围内且实际存在的材料或引用；声明集合与内容闭包不一致时不得形成 sealed。 | A3 manifest/closure |
| `BR-AR-003` | 不变量 | `sealed` 只表示 Archive 自有 closure/integrity 前置条件满足，不表示项目 archived/dissolved、治理批准、owner committed 或恢复成功。 | Bundle 状态 |
| `BR-AR-004` | 禁止行为 | Archive 不得把 `L1-workspace` projection、observability 摘要或 Artifact ref 集合冒充 L1 canonical truth 或完整正文。 | source authority 边界 |
| `BR-AR-005` | 显式变化 | digest、signature、compatibility、storage placement、lifecycle action 和 handoff outcome 必须分别形成可判别结果，不得由前一阶段隐式推导。 | A4/A5/A8 状态 |
| `BR-AR-006` | 治理约束 | retention、legal hold、删除授权、风险接受及销毁处置只能依据正式 owner decision 执行；缺失或冲突时保持 blocked。 | A5 lifecycle |
| `BR-AR-007` | 禁止行为 | Archive 不得自行生成 SoA/AIIA/Conformance Claim，不得决定项目生命周期或发布代表 owner 决定的业务事件。 | governance/work 边界 |
| `BR-AR-008` | 不变量 | 未知版本、缺失摘要/签名、完整性失败、冲突或提交未知必须保留原状态，并以 fail-closed 方式阻止不安全推进。 | A4/A7/A9 |
| `BR-AR-009` | 边界约束 | 恢复只能生成 owner-specific material/ref 并通过正式 import/restore/command/handoff 边界交接；Archive 不直接写上游数据库。 | A7/A8 |
| `BR-AR-010` | 显式变化 | 每个 owner/item 的 accepted、rejected、partial、conflicting、commit-unknown 和 compensation-required 结果必须独立记录。 | A8/A9 outcome |
| `BR-AR-011` | 审计约束 | 请求、source binding、closure、verification、storage/lifecycle、restore plan、handoff 和补偿动作必须可追溯到其来源决定或外部反馈。 | 全链路审计 |
| `BR-AR-012` | 边界约束 | Archive 不拥有 identity、conversation、work、process、governance、artifact、workspace、observability 的业务真相、正文或授权裁决。 | 全仓职责边界 |

### 7.2 规则与功能映射

| 功能 | 保护规则 |
|---|---|
| F-AR-001~003 | BR-AR-001~003、011 |
| F-AR-004~006 | BR-AR-003~008、011 |
| F-AR-007~009 | BR-AR-008~011 |
| 全仓职责边界 | BR-AR-004、007、009、012 |

## 8. 能力级停审

| 能力 | 保护规则 | 结果 |
|---|---|---|
| A1 | BR-AR-001、011 | pass_with_blockers |
| A2 | BR-AR-001、004、008 | pass_with_blockers |
| A3 | BR-AR-002、003 | pass_with_blockers |
| A4 | BR-AR-005、008 | pass_with_blockers |
| A5 | BR-AR-005、006、007 | pass_with_blockers |
| A6 | BR-AR-003、004、011 | pass_with_blockers |
| A7 | BR-AR-008、009 | pass_with_blockers |
| A8 | BR-AR-009、010、011 | pass_with_blockers |
| A9 | BR-AR-008、010、011 | pass_with_blockers |

跨能力规则审计未发现重复定义冲突、相互矛盾或无法挂载的孤儿规则；共享规则只表达跨阶段不变量。

## 9. 回填草稿

Archive 的规则围绕来源、闭包、验证、治理执行和 owner handoff 建立。每个切片必须保留 authority、范围、版本/fence/coverage；manifest 与材料集合不闭合时不得 sealed；验证、存储和交接状态必须独立、显式、可追溯。Archive 不决定项目状态、治理结论或销毁权限，不把 workspace projection、observability 摘要或 Artifact ref 冒充 canonical truth，不直接写上游数据库。所有未知、冲突和提交未知均 fail-closed。

## 10. 待确认事项

- `AR-UP-001~009` 继续限制 source、governance、integrity、storage 和 restore receiver 的正向规则判定。
- owner-specific 状态枚举和 governance decision schema 在需求层不固定；具体合同留待 owning project 与后续设计核验。

## 11. 自检与进入下一步条件

- [x] 规则均能回指功能和能力节点。
- [x] 已区分不变量、禁止行为、显式变化、边界、治理和审计约束。
- [x] 未写 API、字段、事务、异常码或实现校验。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 11。
