# L1-process 03 DDD Step 18 风险与待确认事项

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 书写规范: `standards/document/详细设计书写规范.md` §5.17
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md`
> - `projects/L1-process/05-测试方案.md`
> - `projects/L1-process/06-验收标准.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1~17 中间产物 | 汇总详细设计已闭合契约和未关闭事项 | 字段、DTO、flow、状态、幂等、测试切口已具备 Step 19 装配条件 |
| Step 16 | 测试切口与脚本契约 | `05-测试方案.md` 仍需后续按新版 03 同步 |
| Step 17 | 实施承接和跨文档复核 | 正式 `03` 已装配;`04`、`07` 已生成但仍需随新版 03 复核 / 提交;目标实现仓未发现 |
| 当前项目目录 | 检查正式文档现状 | `03-详细设计.md`、`04-配置设计.md`、`07-实施计划.md` 已存在;`05/06` 仍需按新版 03 同步 |
| 目标实现仓检查 | 实施开工条件 | `/home/aris/Projects/quantalithos-process` 当前未发现 |

---

## 3. SOP 问题回答

1. 哪些问题仍可能影响代码实现?

   回答:仍可能影响代码实现的问题分为四类。第一类是正式文档链仍需同步:正式 `03` 已装配,`04`、`07` 已生成但仍需随新版 03 复核 / 提交,`05/06` 仍需按新版 03 同步。第二类是开工环境未确认:目标实现仓 `/home/aris/Projects/quantalithos-process` 当前未发现。第三类是生产化实现未锁定:durable DB / bus / HTTP / search / metric backend / DLQ / diagnostic store / redaction scan 规则尚未由下游文档或实施计划固定。第四类是实现阶段仍可能遇到上游 typed contract 不匹配,需要按设计真相源闭环标准暂停回写。

2. 哪些问题会阻塞实现,哪些只影响后续优化?

   回答:`07` phase / commit boundary 未复核提交、目标实现仓未确认会阻塞正式实现开工。`05/06` 旧口径会阻塞测试 / 验收门禁,但不阻塞 `03` 详细设计主体落码审查。durable store、真实 broker、metric backend、DLQ、真实相邻仓 adapter 和 redaction scan 细则不阻塞 P0 fake / in-memory 默认实现,但阻塞生产化 adapter、真实集成测试和验收证据。

3. 每个待确认事项需要谁确认?

   回答:正式 `03` 由 design owner 在 Step 19 装配并自检。`04/05/06/07` 由对应文档维护者按新版 03 继续 SOP。目标实现仓和 git config 由 implementation owner / implementation agent 在 PH-01 前确认。durable 产品、真实 adapter、metric backend、DLQ、redaction scan 和 integration 环境由架构、实施计划、测试方案、运维或对应相邻仓负责人确认。

4. 未确认前实现者应该如何处理?

   回答:未确认前不得自行补设计。正式实现必须以当前新版 `03-详细设计.md` 为入口,不得恢复旧 `03` 或按旧文档开工。`05/06` 未同步前不得引用旧测试 / 验收用例作为实现门禁。目标仓未确认前不得写实现代码。运行期依赖未就绪时只能使用 fake / fixture / stub,并保留 delayed、quarantine、partial failure、unavailable 或 handoff failed 语义。上游 typed contract 缺失时暂停对应代码,不得复制上游类型。

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 正式 `03-详细设计.md` 已装配 | 可作为详细设计入口 | 记录为已关闭 |
| `04-配置设计.md` 已生成但需随新版 03 校准 / 提交 | 配置默认值、运行期 binding 和产品选择需以正式 `04` 为准 | 记录为后续配置 SOP 复核 |
| `05-测试方案.md` / `06-验收标准.md` 仍含旧口径 | 测试 / 验收不能直接承接新版 03 | 记录为后续同步风险 |
| `07-实施计划.md` 已生成但需完成 phase / commit boundary 复核并提交 | phase / commit boundary 和提交门禁需以正式 `07` 为准 | 记录为正式实现开工门禁 |
| 目标实现仓未发现 | 无法直接创建 workspace 和提交代码 | 记录为 PH-01 前置确认 |
| 生产化技术产品未锁定 | durable adapter、真实集成和运维证据无法固定 | 标为不阻塞 P0 fake,阻塞 production adapter |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把所有旧风险继续列出 | A. 全部保留;B. 只列仍未关闭且影响实现 / 移交的风险 | 采用 B。已由 Step 6~17 闭合的字段 / DTO / 状态问题不重复列入 |
| 正式 `03` 缺席如何处理 | A. 恢复旧文档;B. Step 19 从中间产物装配 | 采用 B。旧 `03` 不得作为新版真相源 |
| `05/06` 旧口径如何处理 | A. 暂时沿用;B. 标记为后续重建 / 校准 | 采用 B。避免测试验收与新版 03 双真相 |
| 目标实现仓未发现是否阻塞详细设计 | A. 阻塞 Step 18;B. 阻塞正式实现开工 | 采用 B。设计 SOP 可继续到 Step 19 |
| 生产化产品未定是否阻塞 P0 | A. 阻塞全部实现;B. P0 fake / in-memory 可先闭环 | 采用 B。不得把 fake 误报为真实集成 |

---

## 6. 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| 正式 `03-详细设计.md` 尚未装配 | 没有正式详细设计入口,不能移交实现 | 阻塞正式实现开工 | Step 19 从 Step 1~18 装配正式文档并执行自检 | design owner |
| `04-配置设计.md` 已生成但需随新版 03 校准 / 提交 | 配置默认值、运行期 binding、产品选择需以正式 `04` 为准 | 阻塞 production adapter 最终口径 | 后续按配置设计 SOP 复核,不得由代码补配置 schema | design owner |
| `05-测试方案.md` / `06-验收标准.md` 仍为旧口径 | 测试 / 验收门禁可能引用旧 `ProcessTemplate` / frozen profile | 阻塞测试 / 验收正式移交 | 后续按新版 03 与 Step 16 重建或校准 `05/06` | test / acceptance owner |
| `07-实施计划.md` 已生成但需完成 phase / commit boundary 复核并提交 | phase / commit boundary、提交规范和开工门禁需以正式 `07` 为准 | 阻塞实现 agent 开工门禁 | 后续按实施计划 SOP 复核,引用正式 03 和 calibration Step | implementation plan owner |
| `/home/aris/Projects/quantalithos-process` 当前未发现 | 无法创建 Rust workspace、运行代码测试或提交实现仓 commit | 阻塞代码写入 | `07` PH-01 前置检查确认或创建目标仓 | implementation owner |
| `core-contracts` path dependency 可能与设计引用不匹配 | Actor / Trace / Metadata / shared ref 等 typed contract 无法编译 | 阻塞依赖 core 类型的代码 | 开工前检查 core baseline;缺失时暂停回写上游或设计 | implementation owner / core owner |
| 非 core sibling 仓误入 Cargo dependency | 破坏全局依赖裁剪和 L1 平权边界 | 阻塞相关 commit | 只通过 port、event、snapshot、external ref、handoff、fake 协作 | implementation owner |
| durable DB / broker / search / HTTP 产品未锁定 | durable adapter、migration、row lock、真实 transport 无法稳定实现 | 不阻塞 P0 fake;阻塞 production adapter | P0 使用 in-memory / fake;产品化前由 `04/07/09` 固定 | architecture / implementation owner |
| metric backend、DLQ、diagnostic store 未锁定 | 观测、dead-letter、诊断证据无法完整落地 | 不阻塞埋点契约;阻塞运维集成 | 实现安全日志字段和低基数指标;backend 进入运维 / 实施文档 | operations owner |
| redaction check 具体扫描规则未定义 | 脚本只能有契约,无法完整验收所有 forbidden field | 阻塞最终脚本验收 | Step 16 保留脚本契约;后续测试方案或脚本设计补扫描规则 | test owner / implementation owner |
| 真实相邻仓 adapter 未全部可用 | integration test 无法覆盖真实 method/work/governance/artifact/runtime/conversation/handoff | 不阻塞 P0 truth center;阻塞真实集成验收 | 使用 fake / fixture / stub,并显式报告 fake evidence | sibling owners / implementation owner |

---

## 7. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 正式 `03-详细设计.md` 装配 | 不能正式移交实现 | design owner | 继续 Step 19;不得恢复旧 `03` |
| `04-配置设计.md` 是否已按新版 03 校准并提交 | 配置 schema / 默认值 / product binding 需以正式 `04` 为准 | design owner | 不在实现代码中补配置真相源 |
| `05-测试方案.md` / `06-验收标准.md` 是否重建或校准 | 测试和验收仍可能指向旧用例 | test / acceptance owner | 不引用旧用例作为新版实现门禁 |
| `07-实施计划.md` 的 phase / commit boundary 是否已复核并提交 | 实现顺序、提交粒度和开工门禁需以正式 `07` 为准 | implementation plan owner | 不自行拆 commit 或写实现 |
| 目标实现仓路径和创建方式 | `/home/aris/Projects/quantalithos-process` 当前未发现 | implementation owner | PH-01 前暂停代码写入 |
| core baseline 和 `core-contracts` 可用性 | 共享 typed contract 是否与设计匹配未复核 | implementation owner / core owner | 开工前检查;缺失即暂停 |
| durable store / broker / HTTP / search 产品选择 | 影响 durable adapter 和真实集成 | architecture / implementation owner | P0 用 fake / in-memory |
| metric backend / DLQ / diagnostic store | 影响运维证据和真实恢复链路 | operations owner | 只实现安全字段和 marker 语义 |
| redaction checker 扫描规则 | 影响脚本验收完整性 | test owner | 只保留脚本契约和 forbidden field 清单 |
| 首批真实相邻仓 adapter 接入范围 | 影响 integration test 和验收范围 | sibling owners / implementation owner | 使用 fake / fixture,真实 adapter 后续 phase 接入 |

---

## 8. 未确认前实现处理规则

| 场景 | 处理规则 |
|---|---|
| 正式 `03` 未生成 | 不恢复旧 `03`;不正式移交实现;继续 Step 19 |
| `04/05/06/07` 未同步 | 不把旧测试、验收、配置或 phase 口径交给实现者 |
| 实现仓未确认 | 不写代码、不提交实现仓 commit |
| phase / commit boundary 不清楚 | 不自行拆分;等待正式 `07` |
| 字段 / DTO / 状态 / flow 缺口 | 暂停并回写对应 design Step;不得在代码中补 placeholder |
| 上游 typed contract 缺失 | 暂停对应代码;不得复制上游类型 |
| 运行期依赖不可用 | 使用 fake / fixture / stub,并保留正式 failure / marker 语义 |
| durable 产品未定 | 不把 DB / broker / search 产品选择写入 domain / application |
| 观测后端未定 | 输出 Step 15 安全字段,不得保存 forbidden body |
| redaction 规则未定 | 不声称最终 redaction gate 通过,只实现基础契约 |

---

## 9. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_18_risks_open_questions.md`
>
> 延伸阅读:
> - Step 16 测试切口
> - Step 17 实施承接清单

`03-详细设计.md` §17 必须写入本 Step 的风险表、待确认事项表和未确认前处理规则。正式 §17 不得新增对象字段、协议字段、状态转换、配置默认值、技术产品或 commit boundary。已经由 Step 6~17 闭合的字段、DTO、状态、flow、metadata、idempotency 问题不得重复写成风险。

正式实现开工前必须关闭或转交以下事项:

- Step 19 已装配正式 `03-详细设计.md`。
- `04/05/06/07` 已按新版 `03` 生成、校准并提交。
- `/home/aris/Projects/quantalithos-process` 已确认或创建。
- 每个 phase / commit boundary 已在 `07` 中完成字段、DTO、状态、测试、验收和 phase boundary 复核。

---

## 10. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 未关闭事项均有影响范围 | 通过 | 见 §6 / §7 |
| 会阻塞实现的事项标注阻塞范围 | 通过 | 见风险表 `阻塞范围` |
| 未确认前处理方式明确 | 通过 | 见 §8 |
| 未把不确定项写成已确认契约 | 通过 | 本 Step 不新增 schema / state / phase |
| 可进入 Step 19 | 通过 | 正式 `03` 装配是下一步 |
