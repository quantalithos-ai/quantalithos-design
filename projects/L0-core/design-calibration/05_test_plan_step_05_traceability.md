# Step 5. 建立需求追溯与覆盖矩阵

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-core/05-测试方案.md` §5

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `00-需求文档.md` §9 / §10 / §14 / §16 | F-001~F-007、BR-001~BR-014、需求验收和追溯矩阵 | 建立需求到测试场景的追溯 |
| Step 3 测试切口 | P0 对象、接口、状态、一致性、配置、观测切口 | 绑定测试场景 |
| Step 4 测试分层 | unit / service / integration / contract-worker / E2E-release gate | 绑定自动化和证据层级 |
| `03-详细设计.md` §7~§15 | 协议、处理流、状态机、事务、配置、观测和最小测试切口 | 作为设计依据 |
| `04-配置设计.md` §7~§12 | 配置项、配置失效和测试验收承接 | 作为配置覆盖依据 |

依赖的前序 Step：Step 1~4 已确认。

## 3. SOP 问题回答

1. 每个 P0 需求对应哪些设计章节?

   回答：F-001 对应 02 §5.3 / §6.2 和 03 §5 / §8;F-002 对应 02 §7 和 03 §7;F-003 对应 02 §9、03 §9~§12;F-004 对应 02 §5.6 / §7.4 / §7.5 和 03 §7 / §10;F-005 对应 03 §7.5 / §8.4 / §15;F-006 对应 02 §8.6、03 §8.3 / §14;F-007 对应 02 §7 / query views / package views。配置相关测试追溯到 04 §7~§12。

2. 每个 P0 需求至少有哪些测试场景?

   回答：F-001 至少需要范围准入和负向边界场景;F-002 需要协议 roundtrip、Command / Query / Event / Job schema 场景;F-003 需要 lifecycle、release gate、compatibility、audit trace 场景;F-004 需要 snapshot、package、outbox event boundary 场景;F-005 需要 validate / derive / rebuild / recalculate / relay job 场景;F-006 需要 trace query、audit evidence、projection stale 场景;F-007 需要 guide sample / package view 查询场景。

3. 哪些场景必须自动化?

   回答：所有 P0 正向主线、关键负向边界、状态非法迁移、幂等冲突、事务回滚、配置失效、outbox relay 和 job 重跑场景必须自动化。P1/P2 future candidate 可只记录风险或待补。

4. 每个场景的证据如何编号?

   回答：测试证据使用 `EV-<层级>-<三位序号>`。例如 unit 层为 `EV-UNIT-001`,service 层为 `EV-SVC-001`,integration 为 `EV-INT-001`,contract / worker 为 `EV-CONTRACT-001` 或 `EV-WORKER-001`,E2E 为 `EV-E2E-001`,配置为 `EV-CONFIG-001`。

5. 哪些需求暂未覆盖,原因是什么?

   回答：F-001~F-007 都有 P0 或 P1 覆盖。未完整覆盖的是多语言 binding、完整 SDK developer experience、L0-bus runtime、真实 secret provider、config center、hot reload 和旧 06 验收口径,原因是它们属于相邻仓、P1/P2 或下游待校准。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §3 | 覆盖矩阵只覆盖旧 admission 规则 | 无法追溯 F-001~F-007 |
| `05-测试方案.md` §6 | 用例 ID `TC-001` 这类编号缺少模块语义 | 后续证据难以引用 |
| `05-测试方案.md` §12 | 证据归档未绑定需求 / 设计 / 用例 | `06-验收标准.md` 无法直接消费 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖对象 | 旧 shared primitive 需求 | F-001~F-007 + BR + NFR | 与新版需求基线一致 |
| 用例编号 | `TC-001` | `TC-SCOPE-001`、`TC-CMD-001` 等 | 稳定、可定位 |
| 证据编号 | 未形成统一规则 | `EV-UNIT-*`、`EV-SVC-*`、`EV-INT-*` 等 | 便于验收引用 |
| 未覆盖项 | 未显式列出 | 单独列非覆盖 / P1/P2 风险 | 防止静默遗漏 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只按 F-001~F-007 建矩阵 | 清晰 | 漏掉 BR / NFR / 配置 | 不采用 |
| B. 以 F 为主轴,同时挂载 BR、NFR、设计章节和证据 | 可追溯、可验收 | 表格更宽 | 采用 |
| C. 等用例全部设计完再建矩阵 | 用例更完整 | 前期缺少覆盖门禁 | 不采用 |

## 7. 结构化中间产物

### 7.1 需求追溯与覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| F-001 / BR-001 / BR-002 | 02 §5.3 / 03 §5 / §8 | 契约范围准入与边界外对象拒绝 | TC-SCOPE-001 / TC-SCOPE-002 | 是 | EV-UNIT-001 / EV-SVC-001 | 已覆盖 |
| F-002 / BR-003 / BR-008 | 02 §7 / 03 §7 | Command / Query / Event / Job DTO roundtrip 与 schema 约束 | TC-DTO-001 / TC-EVENT-001 / TC-JOB-001 | 是 | EV-UNIT-002 / EV-CONTRACT-001 | 已覆盖 |
| F-003 / BR-004 / BR-007 / BR-013 / BR-014 | 02 §9 / 03 §9~§12 | 生命周期、发布门禁、兼容性、审计追溯 | TC-STATE-001 / TC-REL-001 / TC-AUDIT-001 | 是 | EV-UNIT-003 / EV-SVC-002 / EV-INT-001 | 已覆盖 |
| F-004 / BR-005 / BR-009~BR-012 | 02 §5.6 / §7.4 / 03 §7 / §10 | snapshot 派生、package / sample 查询、outbox boundary | TC-SNAPSHOT-001 / TC-QUERY-001 / TC-OUTBOX-001 | 是 | EV-WORKER-001 / EV-CONTRACT-002 | 已覆盖 |
| F-005 | 03 §7.5 / §8.4 / §15 | validate、derive、rebuild、recalculate、publish fact job | TC-JOB-001~TC-JOB-005 | 是 | EV-WORKER-002 | 已覆盖 |
| F-006 / BR-014 | 02 §8.6 / 03 §8.3 / §14 | trace query、audit append、projection stale / rebuild | TC-TRACE-001 / TC-AUDIT-001 / TC-REBUILD-001 | 是 | EV-SVC-003 / EV-INT-002 | 已覆盖 |
| F-007 | 02 §7.3 / 03 §7.3 | guide sample / package view 查询 | TC-QUERY-007 / TC-QUERY-008 | 是 | EV-CONTRACT-003 | 已覆盖 |
| NFR 性能 | 00 §13 / 03 §15 | query、snapshot、job 基础耗时与主链不阻塞 | TC-NFR-001 | 部分 | EV-NFR-001 | 已覆盖 |
| NFR 可用性 | 00 §13 / 03 §11 / 04 §11 | 外围依赖失败不破坏核心 truth | TC-RECOVERY-001 | 是 | EV-INT-003 | 已覆盖 |
| NFR 审计 / 可追溯 | 00 §13 / 03 §14 | audit、trace、evidence 完整性 | TC-AUDIT-001 / TC-TRACE-001 | 是 | EV-AUDIT-001 | 已覆盖 |
| NFR 幂等 / 一致性 | 00 §13 / 03 §10 / §12 | idempotency、expected version、outbox atomics | TC-IDEM-001 / TC-CONC-001 / TC-TXN-001 | 是 | EV-INT-004 | 已覆盖 |
| 配置设计 P0 | 04 §7~§12 | config source priority、7 个配置项、fail fast / closed | TC-CONFIG-001~TC-CONFIG-004 | 是 | EV-CONFIG-001 | 已覆盖 |

### 7.2 未覆盖 / 延后项清单

| 项 | 原因 | 处理 |
|---|---|---|
| L0-bus publish / subscribe / ack / retry / dead-letter runtime | 属于 `L0-bus` | 仅测试 outbox / publisher boundary |
| L0-sdk 高层重试、认证、配置和 developer experience | 属于 `L0-sdk` | 仅测试可派生契约来源和 DTO / schema |
| L1 业务聚合和业务状态机 | 属于 L1 仓 | 仅测试禁止业务正文进入 L0-core |
| config center、admin override、hot reload | 04 明确为 P2 | Step 14 残余风险记录 |
| 真实 KMS / Vault / secret provider | 04 明确为 P1/P2 | P0 只测 raw secret 禁止 |
| 旧 `06-验收标准.md` | 仍是旧 shared primitive 口径 | 05 完成后重写 06 |

## 8. 回填草稿

```md
## 5. 需求追溯与覆盖矩阵

> 校准来源：
> - `design-calibration/05_test_plan_step_05_traceability.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“需求追溯与覆盖矩阵”“未覆盖 / 延后项清单”和“待确认事项”小节,了解测试覆盖如何从 F-001~F-007、业务规则、非功能和配置设计收敛。

本章建立需求、设计、测试场景、用例和证据之间的追溯关系。P0 需求不得只通过人工确认覆盖;如果某项能力属于相邻仓或 P1/P2,必须显式列入未覆盖 / 延后项。

| 需求 / 规则 ID | 设计依据 | 测试场景 | 用例 ID | 自动化 | 证据 ID | 覆盖状态 |
|---|---|---|---|---|---|---|
| F-001 / BR-001 / BR-002 | 02 §5.3 / 03 §5 / §8 | 契约范围准入与边界外对象拒绝 | TC-SCOPE-001 / TC-SCOPE-002 | 是 | EV-UNIT-001 / EV-SVC-001 | 已覆盖 |
| F-002 / BR-003 / BR-008 | 02 §7 / 03 §7 | Command / Query / Event / Job schema | TC-DTO-001 / TC-EVENT-001 / TC-JOB-001 | 是 | EV-UNIT-002 / EV-CONTRACT-001 | 已覆盖 |
| F-003 / BR-004 / BR-007 / BR-013 / BR-014 | 02 §9 / 03 §9~§12 | 生命周期、发布门禁、兼容性、审计追溯 | TC-STATE-001 / TC-REL-001 / TC-AUDIT-001 | 是 | EV-UNIT-003 / EV-SVC-002 / EV-INT-001 | 已覆盖 |
| F-004 / BR-005 / BR-009~BR-012 | 02 §5.6 / §7.4 / 03 §7 / §10 | snapshot 派生、查询、outbox boundary | TC-SNAPSHOT-001 / TC-QUERY-001 / TC-OUTBOX-001 | 是 | EV-WORKER-001 / EV-CONTRACT-002 | 已覆盖 |
| 配置设计 P0 | 04 §7~§12 | config source priority、配置项、fail fast / closed | TC-CONFIG-001~TC-CONFIG-004 | 是 | EV-CONFIG-001 | 已覆盖 |
```

## 9. 待确认事项

- 是否接受用例 ID 先在本步建立稳定命名,Step 6 再展开完整用例矩阵。
- 是否接受旧 `06-验收标准.md` 作为未覆盖 / 延后项,不把旧验收口径写入新版测试方案。

## 10. 进入下一步条件

- [x] P0 覆盖矩阵无空洞。
- [x] 未覆盖 / 延后项已进入风险或非范围。
- [x] 用例 ID 和证据 ID 命名口径已形成。
- [x] 可以进入 Step 6 设计测试场景与用例矩阵。
