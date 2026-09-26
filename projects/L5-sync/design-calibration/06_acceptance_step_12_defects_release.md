# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填位置：正式 `06-验收标准.md` §12

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 12 / defects_release |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前缺陷实例 | `not_provided`；不创建 BUG/缺陷结果 |
| 下一步 | `Step 13 / risk_acceptance` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 测试缺陷规则与复验策略 | `05-测试方案.md` §11/§12/§14 | `available` | severity、retest、regression |
| VETO/Safety gate | Step 11 | `available` | 硬阻断不可接受 |
| NFR/evidence gate | Step 9/10 | `available` | 失败影响结论 |
| 实际缺陷清单/failed run | 送验材料 | `not_provided` | 当前不填实例 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| S/A/B/R 如何定义？ | S=VETO、P0 truth/safety/evidence/dependency/config hard gate；A=P0 用例/阻塞 suite 失败但未命中 VETO；B=非 P0/可维护性/selected-run residual；R=范围外、future、production-like/capacity/vendor residual。 | 05 §11/§12；Step 11 |
| 每级对结论影响？ | S/VETO 未关闭只能不通过；A 未修复不得通过，可在不影响 P0 且有正式接受人时进入有条件通过；B/R 可进入风险接受但不能伪装 P0 已验证。 | 06 SOP Step 12/13 |
| 修复后如何复验？ | 原 TC + 同 family 代表项 + 相关 blocking suite + redaction/dependency/report audit；涉及协议/状态/UoW/config/redaction 全量回归对应 family。保留 failed run 与 fixed run。 | 05 §11/§14 |
| 哪些缺陷阻断下一阶段？ | VETO/S、evidence integrity、redaction/dependency/report audit、Query write、Job repair/submit、unknown 危险副作用、dirty overwrite、silent fallback。 | Step 9/10/11 |
| 何时允许放行？ | 只有全部 P0 门禁、VETO、证据、S/A 规则收口，且风险接受文件完备时，才可使用三值结论；当前不填写实际结论。 | 06 SOP Step 14 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 只有严重程度，没有裁决影响 | 同一缺陷可能被误放行 | 每级绑定结论、复验、风险接受 |
| 修复后只重跑失败 case | 可能漏掉协议/状态/证据回归 | 加同 family、blocking suite、redaction/dependency/report audit |
| VETO 作为普通 A 级 | 可被风险接受绕过 | VETO/S 独立硬阻断 |
| 关闭缺陷覆盖旧证据 | 无法证明原始失败及修复 | 保留 failed/fixed run、artifact、report、复验说明 |
| P1 unavailable 与 P0 defect 混淆 | 结论失真 | B/R residual 与 P0 S/A 分开 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 缺陷等级 | 泛化 blocker/bug | S/A/B/R 稳定分级 | 与 05/验收结论一致 |
| 复验 | 只重跑原失败项 | 原 TC + family + gate audit + 必要回归 | 防回归 |
| 证据 | 修复后覆盖旧报告 | 双 run 保留，固定 path + digest | 可审计 |
| 放行 | 缺陷关闭即通过 | 需 AC/VETO/evidence/risk 全链闭合 | 验收是裁决文档 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只按数量统计失败 case | 简单 | 不区分 VETO/P0/残余 | 拒绝 |
| 所有缺陷都禁止有条件通过 | 保守 | 与三值结论和 P1 residual 不符 | 拒绝 |
| S/A/B/R + VETO override + 证据化复验 | 可判定、可放行、保留硬红线 | 复验资料较多 | 采用 |

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 等级 | 定义 | 对验收结论影响 | 风险接受 | 复验要求 |
|---|---|---|---|---|
| `S` | VETO 命中；P0 truth、security/redaction、dependency、evidence integrity、Query/Job truth repair、P0 config silent fallback、dirty overwrite、unknown 危险 effect | 未关闭只能 `不通过`；不可进入有条件通过 | 禁止 | 原 TC、同 family、相关 blocking suite、redaction/dependency/report audit，必要时全量 P0 regression |
| `A` | P0 case/blocking suite 失败但未命中 VETO，或 P0 能力证据不足且有可替代 raw artifact | 未关闭不得 `通过`；修复后可通过；严格受限且有接受人可成为 `有条件通过` | 仅在不影响 VETO/P0 truth 且有接受人/期限时 | 原 TC、相关 suite、report pairing、关联 AC/VETO recheck |
| `B` | 非 P0、报告可读性、非阻断维护问题、P1 selected-run unavailable | 不阻断 P0；可进入 `有条件通过` 风险清单 | 允许（需结构化记录） | selected suite/report review 或后续补验 |
| `R` | 范围外/future、production-like/capacity/vendor/LFS/浅克隆/GUI residual | 不阻断 P0；必须进入风险/遗留项 | 允许（需触发条件） | 范围升级时重新基线和验收 |

### 7.2 复验规则

| 触发 | 最小复验 | 必须保留 | 不能做 |
|---|---|---|---|
| protocol/envelope/DTO/error 变化 | 全部 public protocol、10 Command、13 Query、3 Consumer、3 Job 相关 family | failed run + fixed run + source/config refs | 只改 report 不重跑 |
| state/flow/transaction/idempotency 变化 | 原 TC、`TC-SYNC-STATE-001~017`、`TC-SYNC-CONSISTENCY-001`、`TC-SYNC-IDEMP-001`、相关 P0 suite | old/new artifact/report、transition/write-set说明 | 用 latest 覆盖旧 run |
| config/profile/activation/redaction 变化 | 42 leaf、4 profile、strict source、builder、all output redaction | config digest、profile、redaction-check | 旧 profile 报告冒充新基线 |
| Git/fs/source/access/review/probe 变化 | 受影响 adapter/flow/fault/negative、VETO-001/005 | blocker status、真实 tool/provider evidence | 用 fake/cache/ACK 关闭 blocker |
| evidence/report generator 变化 | report-audit、evidence-index、path/redaction/dependency audit + affected suites | raw artifacts and generated reports both | 手写 index/checklist |

### 7.3 放行规则

| 条件 | 放行结论 |
|---|---|
| 所有 P0 AC 有真实证据；VETO 全部未触发；S=0；A=0；evidence/report/redaction/dependency audit 完整 | 允许结论候选 `通过` |
| P0 主线和 VETO/evidence 完整；S=0；存在已接受且不影响 P0/VETO 的 A/B/R residual，risk-acceptance 有 owner/acceptor/deadline/trigger | 允许结论候选 `有条件通过` |
| 任一 P0 失败、VETO 命中、S 未关闭、证据不可裁决、redaction/dependency/report audit failed、缺接受人或关键基线 | 只能 `不通过` 或暂停验收 |
| 只有计划 TC/EV、fake、cache、ACK、job report、telemetry 或未审查 handoff | 不得产生任何“通过”结论 |

### 7.4 缺陷/复验停审记录模板

| 字段 | 要求 |
|---|---|
| defect_id | 未来真实缺陷 ID；当前不创建 |
| first_run_ref | 固定 failed `<run_id>`；不能 latest |
| severity | S/A/B/R；需注明是否 VETO |
| affected_ac/veto | 正式 AC/VETO 编号 |
| fixed_run_ref | 修复后新 `<run_id>`；不得覆盖 first run |
| retest_scope | 原 TC、family、suite、audit 清单 |
| evidence_refs | raw artifact、run report、acceptance path |
| disposition | open/fixed/retest_pending/accepted/residual；不填写当前结果 |

## 8. 回填草稿

正式 §12 应使用 S/A/B/R 分级：S/VETO 和证据/安全/边界硬门禁不可风险接受；A 级默认阻断，只有严格条件和正式接受人时才可有条件通过；B/R 可进入风险清单。修复必须保留 failed/fixed run，并重跑原 TC、同 family、相关 blocking suite 和必要 audit；缺陷关闭、report 更新或 ACK 不能单独构成放行。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 缺陷管理系统/ID scheme | 真实 defect_id、状态和审查入口 | 07/执行环境 |
| 复验 runner 与 report generator | fixed run 与双 run pairing | 07/执行环境 |
| A 级接受角色和期限 | 有条件通过可行性 | Step 13/14 |

## 10. 进入下一步条件

- [x] S/A/B/R 定义、结论影响、风险接受边界和复验要求已固定。
- [x] VETO/S 级不可放行已与普通 residual 分离。
- [x] 协议、状态、配置、adapter、evidence 变化的复验矩阵已形成。
- [x] 当前没有真实缺陷实例或复验结果被写入。
- [x] 本步停审；进入 Step 13 前读取残余风险、blocker、05 §14 与 Step 9/11/12。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 缺陷规则可执行，但当前无真实 defect/run/result；未声称任何缺陷已关闭。
- 下一步阅读：05 §14、00 §15、04 §14、`SYNC-UP-*`/`SYNC-LOCAL-*`，创建 Step 13。
