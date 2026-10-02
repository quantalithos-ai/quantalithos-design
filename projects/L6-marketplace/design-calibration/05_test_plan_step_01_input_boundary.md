# Step 1：确认测试输入边界

> 对应 SOP：测试方案讨论流程 Step 1
> 回填章节：`05-测试方案.md` §1

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 输入边界 |
| 当前状态 | completed / stop_review |
| 输入基线 | 当前正式 00～04；旧 05/06 仅 historical_material |
| 输出 | 测试输入权威顺序、缺口和证明上限 |
| 实际执行 | 未实现、未运行、未生成 evidence |

`source_files`：正式00～04、03 Step16、本轮测试SOP/书写规范、中间产物规范三层门禁及闭环标准§2.15/§7。开工/问题回答/诊断/取舍/结构化/草稿已回核；`gate_status=pass`仅表示允许继续05 Step2，正式回填须等Step15；不表示外部资格或运行通过。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：当前正式00～04和03 Step16 |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入与目标

确定测试方案可以验证哪些正式需求、对象、协议、状态、配置和证据边界；排除旧 commerce/install/payment 文档和原型对当前测试真相的污染。

### 本步输出：输入映射与权威顺序

| 输入 | 直接测试用途 | 权威性 |
|---|---|---|
| `00-需求文档.md` | C-MP-1～5、FR/BR/NFR/AC/VETO、数据所有权与非范围 | 正式 |
| `01-架构设计.md` | Web/API/Worker运行单元、依赖裁剪、禁止源码/事务反向依赖 | 正式 |
| `02-概要设计.md` | 七 U、组件、关键对象、处理流和状态概览 | 正式 |
| `03-详细设计.md` | 43 对象、17 port/146 methods、21C/16Q/12J、14 carrier、事务/错误/幂等/观测 | 直接真相源 |
| `03_ddd_step_16_test_cuts.md` | 最小模块/入口/状态/一致性/安全/配置切口 | 直接切口 |
| `04-配置设计.md` | JSON envelope、六域、七字段、八 slot、四 profile、fail-fast/degraded | 直接配置真相源 |
| 旧 `05/06`、README、draft/原型 | 识别历史 commerce/install/UI 口径 | 禁止覆盖 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 测试方案承接什么？ | 承接 C-MP-1～5、FR-MP-101～504、BR-MP-101～505、NFR-MP-101～503/G01～G04、AC-MP-101～504/G01～G04、五个 VETO，以及 03/04 的可落码约束。 |
| 详细设计哪些部分直接决定测试对象？ | 七模块/U、43 对象、17 ports、49 入口、14 状态 carrier、持久化/事务/锁序、错误恢复、canonical fingerprint、分页 current disclosure、projection manifest、Observation/审计和 Step16 测试切口。 |
| 哪些内容需要证据？ | 每个 P0 命令/查询/job 的正负断言；状态非法转换；幂等、Unknown、A/B crash、PG 原子性；配置 fail-fast、production no-fake、redaction、query/replay no-write、Web EN/ZH 语义保持。 |
| 测试方案不应重定义什么？ | 不重定义字段/DTO/port/状态/错误/owner authority、安装/支付/通知送达、配置业务开关、性能阈值、验收 verdict 或实施 commit。 |
| 现有缺口是否阻塞测试设计？ | 不阻塞本地和 controlled P0 设计；正式 owner/SDK/PG/provider/TLS/auth positive qualification 标记 blocked/pending，不能用拒绝用例冒充集成完成。 |

## 4. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 仍有 `PackageRelease`、`InstallRecord`、`EntitlementView`、payment/subscription 等旧主线 | Step15 删除并重建，保留为历史来源，不继承编号 |
| 旧 `06-验收标准.md` | 旧验收口径不能裁决新版 evidence/veto | 只记录方向，06 另行 full-restart |
| draft/原型 | UI 内容和 `0.0.0.0:9090` 是原型，不是生产协议或运行证据 | 只为 Web workflow/locale 的显示输入 |
| 03 | 已给最小切口，但未分配 TC、数据、环境、suite 和 evidence | 由 Step2～14展开 |
| 04 | 已给配置承接但未形成执行矩阵 | 由 Step8～10/12/13展开 |

本轮恢复还发现：此前flow/ledger把未创建的Step11～15标completed；现已改为实际进度。03§17将`MP-SRC-003`定义为draft TS/React与正式Rust/Vue差异，04§14及05初稿误称publisher资格。05采用03§17的ID语义；publisher/human/org/auth只回指`MP-UP-003`，不新增关闭结论。该标签差异不改变七字段/八slot/拒绝策略，不阻断本地测试设计；04原标签需后续受控核对，05不覆写其正式正文。

## 5. 改动前后对比

| 项 | 之前 | 本 Step 结论 |
|---|---|---|
| 权威来源 | 旧 05 可能被误读为当前基线 | 00～04和03 Step16唯一当前输入 |
| 测试对象 | 旧文档按安装/交易故事组织 | 从43对象、49入口、14 carrier逐项抽取 |
| 外部依赖 | 可能将 owner/API 存在当作 ready | 资格分层为 Bound/Blocked/Disabled/Unavailable，positive仍 pending |
| 证据 | 可能写静态 passed/latest | 固定 run_id、raw artifact、report、evidence index 的未来 schema |

## 6. 测试设计取舍

| 方案 | 优点 / 风险 | 结论 |
|---|---|---|
| 00～04正式契约驱动，历史稿后置诊断 | 保持对象/状态/字段authority；外部positive受限 | 采用 |
| 继承旧05 commerce/install案例或原型数据 | 写作快但会引入第二套truth和伪资格 | 不采用 |
| 在05补缺失owner schema | 表面可测试但越过owner边界 | 不采用；受影响positive保持blocked |

## 7. 结构化中间产物

```text
00需求/AC/VETO
       | 追溯
       v
01架构/02概要 ----> 03对象/协议/状态/事务/错误/切口
                                  |
                                  v
                         05 case/data/suite/evidence
                                  ^
                                  |
                        04 config/profile/failure
```

测试设计只消费已经提交的 local truth 和 owner 提供的 typed reference；不复制 owner 正文、材料、决定或凭证。

## 8. 回填草稿

正式 §1 应声明：新版 00～04 和 03 Step16 是正式输入；旧 05/06、README、draft/原型均为历史或讨论材料；测试方案不替代详细设计，不创建 approval、安装、支付、通知送达、资产正文或真实证据。

## 9. 待确认事项与影响判定

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| owner/SDK exact operation、schema、scope 和版本映射 | 真实 positive integration | 保持 blocked，P0 用 controlled contract |
| PG/extension/lock/容量预算 | 集成和非功能 | 配置 fail-fast，容量只保留 candidate |
| publisher/auth、Governance binding、receiver/notice/observation producer | C1/C2/C4/C5正向路径 | 不由Marketplace补造 |
| Billing、Archive、active event/outbox | 交易/归档扩展 | future/blocker，不进入测试对象 |

本步不回写 00～04；缺口由后续 06/07 或 owner 合同承接。

## 10. 进入 Step 2 条件

- 权威输入顺序已固定。
- 历史 commerce/install/payment 口径已隔离。
- 证明上限和 external blocker 已登记。
- 不需要新增字段、状态、port 或配置项即可开始范围设计。

回核结论：上述条件文档侧满足；下一步读取SOP Step2/规范§5.2、正式00§4/13/14及本Step。无需提交commit。
