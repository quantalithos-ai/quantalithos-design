# L2-member 00 需求 Step 15: 风险与待确认事项

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 15 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 风险与待确认事项 |
| 输出文件 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.15:风险 / 待确认两表;第三列写当前约束 / 挂起方式,不写方案) |
| 已读取前序输入 | yes(Step 1~14 待确认事项;台账 §5 `L2M-UP-001~008`) |
| 当前模式 | full-restart |
| 进入条件 | Step 14 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | gate_status |
|---|---|---|
| 上游 blocker 承接 | done | pass |
| 风险清单 | done | pass |
| 待确认事项 | done | pass |
| 回填草稿 / 自检 | done | pass |

## 2. 结构化中间产物

### 2.1 上游 blocker 承接

| ID | 状态 | 影响 | 当前约束 | 是否阻塞需求完成 |
|---|---|---|---|---|
| `L2M-UP-001` | sibling_step_09_pass_contract_pending | member-service 已到需求 Step 9 pass / Step 10 pending;影响启动语境、注册请求 / 接受、存活信号、endpoint registry、host session 与健康判定分界(FR-001/003) | 采用当前已通过材料一致的 owner 分层:member 拥有请求 / 信号 / 报告与本地尝试,宿主拥有接受 / registry / session / health;正式 00 与字段合同未闭口时 fail closed | 否;阻塞正向宿主合同与联调 |
| `L2M-UP-002` | sibling_step_09_in_progress_contract_pending | member-images Step 1~8 pass / Step 9 in progress;影响静态镜像资产、pinned 入口与打包 / 装配边界 | 不进入运行主链;只引用已通过材料中的静态资产 owner 与 pinned 入口方向,不引用进行中结论,不声明 manifest / version / readiness | 否 |
| `L2M-UP-003` | open_upstream_contract | 入站投递物与 Runtime formal trigger mapping(FR-006) | 只保留 entry seam 语义;mapping blocked | 否;阻塞正向投递 qualification |
| `L2M-UP-004` | open_integration_boundary | Runtime handoff source family 与观测 route(FR-007/008/010) | 出站与观测只保留 attempt / gap;不声明 delivered / observed | 否;阻塞 observed / evidence |
| `L2M-UP-005` | schema_and_route_pending | member-specific Core schema / event family | CloudEvents / W3C Trace Context 与共享 envelope 继承 Core 当前 authority;member-specific type / source / subject / payload / route pending,不本地 shadow | 否;阻塞 member-specific schema / route 定稿 |
| `L2M-UP-006` | owner_contract_pending | 启动凭据 / 身份锚点 owner 契约(FR-001) | 凭据形态 pending;校验语义 fail closed | 否;阻塞正向入场 qualification |
| `L2M-UP-007` | open_upstream_contract | 筛选规则来源与 taxonomy(FR-005) | 只消费正式结果 / safe snapshot;unknown 保守处置 | 否;阻塞筛选规则定稿 |
| `L2M-UP-008` | execution_subject_scope_pending | 项目型实例的双锚与非项目型 / personal 场景执行主语(FR-001) | 项目型路径以 `ProjectMemberRef` 为执行主语并关联 `GlobalMemberRef`;member-service 当前版项目型-only仅作 sibling 输入。L2-member 非项目型路径在自身范围闭口前 fail closed,不得以 GlobalMember / Workspace view 代替 | 否;阻塞非项目型正向能力与 qualification |

### 2.2 风险清单

| ID | 风险 | 影响范围 | 当前处理口径 |
|---|---|---|---|
| `R-L2M-001` | member 与 Runtime 的容器内分界在 01~03 展开时可能被重新混写(如 member 侵入 run 语义或 Runtime 直连 bus) | §2、§7、§9、§10 | 当前已由边界判定口径、BR-011/012/014 和 VF-001/003 显式收口;后续按该边界审查。 |
| `R-L2M-002` | 入站筛选可能在实现推进中膨胀为本地裁决(allowlist / 规则自管理) | §9 FR-005、§10、§14 | 当前按 BR-009/010 + VF-002/003 约束;规则 truth 留在 owner,taxonomy 随 `L2M-UP-007` 挂起。 |
| `R-L2M-003` | 出站四层分层可能被下游或实现压平(delivery 当作成功、accepted 当作本地终态) | §9 FR-007/008、§13、§14 | 当前按 BR-016/017 + AC-013 + VF-005 约束;分层语义进入验收合同。 |
| `R-L2M-004` | member-service 后续 Step 10~17 / 正式 00 可能与本仓注册、会话、健康分界冲突 | §6、§9 FR-003、§12 | 当前只冻结双方截至 member-service Step 9 一致的 owner 方向;字段合同继续 pending,冲突时回开受影响 Step,不单方面吸收。 |
| `R-L2M-005` | 旧 README / 旧正式链的协议、凭据、指标结论回流(旧 member-specific CloudEvents / AG-UI / UDS / launch_token / P95) | 全文;后续 01~07 | CloudEvents / W3C 基线只经 Core 当前 authority 承接;旧 member-specific event detail 与其余项目逐项 historical / pending,不得整包继承。 |
| `R-L2M-006` | 能力出口视图可能被消费方当作 capability registry 或调用资格 | §9 FR-012、§11、§14 | 当前按 BR-025/026 + AC-017 约束;视图只读派生,失效显式;子项可裁剪。 |
| `R-L2M-007` | 追溯与观测材料可能在实现期以"排障需要"为名扩张为正文日志 | §9 FR-009/010、§13 | 当前按 BR-021 + NFR-007/015 + VF-004 约束;正文一律禁止。 |
| `R-L2M-008` | member 域 Core schema 未闭口时,后续设计可能本地私造共享类型 | §6、§11、§12 | 当前按 BR-028/029 约束;只引用类别,`L2M-UP-005` 闭口前保持 pending。 |
| `R-L2M-009` | `GlobalMemberRef` 身份锚或 Workspace view 在后续设计中被误写为执行主语,或未定义非项目型实例被放行 | §2、§7、§9 FR-001、§14 | 项目型路径按 BR-001 / AC-006 双锚;非项目型路径随 `L2M-UP-008` / `Q-L2M-009` fail closed。 |
| `R-L2M-010` | 入站正文边界被误解为"完全不可读取"或反向放宽为"可持久化 / 透明转发" | §9 FR-005/006、§10、§11、§14 | 仅允许正式授权范围内瞬时受控检查;禁止持久化为 member truth和 raw body 透明转发。 |

### 2.3 待确认事项

| ID | 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|---|
| `Q-L2M-001` | 宿主启动语境 / 凭据的正式 owner 契约与形态(identity 与 member-service 的分工) | §6、§9 FR-001/003、§12 | 当前保持待确认;入场按 fail-closed 挂起,不指定凭据形态。 |
| `Q-L2M-002` | member 投递物与 Runtime formal trigger 的正式 mapping(承接 Runtime `Q-L2R-001`) | §9 FR-006、§12 | 当前只保留 entry seam;mapping 不在本仓单方面定义。 |
| `Q-L2M-003` | 筛选规则来源矩阵与风险 taxonomy(Policy effective 消费口径细化) | §9 FR-005、§10、§13 | 当前按保守处置挂起;不自建分级标准。 |
| `Q-L2M-004` | member 出站材料与 conversation / observability 的正式 source family 与 route | §9 FR-008/010、§12 | 当前只形成本地 attempt / gap;route 待上游闭口。 |
| `Q-L2M-005` | member-specific Core shared types、CloudEvent type / source / subject / payload 与 route 最小集合 | §6、§11、§12 | CloudEvents / W3C 与共享 envelope 已承接 Core;member-specific 集合继续等待 Core / Bus 正式合同。 |
| `Q-L2M-006` | 能力出口子项(FR-012 / AC-017)进入第一批核心还是降级外围 | §7、§9、§14 | 当前保留为 C5 内可裁剪子项,不强行定论;01 阶段复核。 |
| `Q-L2M-007` | 追溯 / 观测记录的保留与归档口径 | §11、§13 | 当前只锁"可追溯 + 不可原地改写";retention 后移 03/04。 |
| `Q-L2M-008` | 出站是否存在需正式治理前置的场景 | §10 | 当前治理约束类规则为 0 的判断保持;随 `L2M-UP-007` 挂起,出现场景即回开 Step 10。 |
| `Q-L2M-009` | `L2-member` 当前版是否像 member-service 一样只支持项目型实例;若未来支持非项目型 / personal 实例,其第三种正式执行主语与生命周期是什么 | §2、§7、§8、§9 FR-001、§14 | 当前正向需求仅覆盖 `ProjectMemberRef` 执行主语的项目型实例;非项目型路径 fail closed,不得以 `GlobalMemberRef` 或 PersonalWorkspace view 替代。 |

## 3. 回填草稿

按 2.1(承接表)+ 2.2(风险)+ 2.3(待确认)回填第 15 章;结尾声明:这些事项不阻塞本需求的 owner、能力、失败和 fail-closed 边界成文,但阻塞后续正向 schema、配置激活、测试执行、证据、联调和 readiness 声明;owner 反转、forbidden body、fail-open 或历史污染回流必须回写需求真相源并重开受影响 Step。

## 4. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 风险 / 待确认两表分开 | pass |
| 第三列均为当前约束 / 挂起方式,无方案 / 空话 | pass |
| 无 TODO 混入 | pass |
| 全部 blocker 有承接 | pass |
| Step 16 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_16_traceability_matrix
formal_document_write_allowed = false
```
