# Step 8. 用户故事与逐能力需求小循环

## 1. Step 状态

`pass / stop_review`；正式回填 §8。SOP §2.4、Step 8～14 与规范 §4.8～§4.14 已读取；依 Step 7 只创建当前 Step 文件及当前能力附录。附录不是未来 Step 的占位，后续 Step 9～14 到达后才单独落盘。

### 1.1 Step 内计划

- [x] 读取前序与后半段适用规范。
- [x] 五节点骨架：C1 来源责任 → C2 上架 → C3 发现选择 → C4 分发 → C5 撤回恢复。
- [x] 每节点依次问题/诊断/取舍，再结构化/草稿/自检。
- [x] 跨节点故事去重、草稿装配与 Step 自检。

| 能力 | 思考 | 写入 | 自检 | 下一许可 |
|---|---|---|---|---|
| C-MP-1 | done | done | pass / stop_review | 允许 C2 |
| C-MP-2 | done | done | pass / stop_review | 允许 C3 |
| C-MP-3 | done | done | pass / stop_review | 允许 C4 |
| C-MP-4 | done | done | pass / stop_review | 允许 C5 |
| C-MP-5 | done | done | pass / stop_review | 允许跨能力故事审计 |

## 2. 本步输入

Step 5 角色、Step 7 节点/停审条件；Step 1～6 的正式源与诊断、取舍、pending。每能力附录固定十段，保留完整小循环及证据上限；不创建 implementation ledger。

## 3. SOP 问题回答（主控）

1. 当前节点：C1；后续节点未审先不生成故事。
2. 哪些角色目标支撑核心：可信责任、正式上架、可见选择、受控获取、撤回与审计恢复。
3. 外围角色目标：收藏推荐、评分评论等目前不正式纳入。
4. 不应纳入：购买结算、approval 自审、安装激活、资产正文编辑。
5. 映射要求：每节点附录逐故事给出编号与价值，后续各主题保留同源编号。
6. 无来源故事：不能用“用户希望”补财务/认证 owner。
7. 进入功能讨论：只在当前能力故事自检后；完整能力停审后才进入下一节点。

## 4. 当前文档问题诊断

旧 00 §5 US-004 将平台扫描当核心用户目标、US-002 合并购买/安装成功、US-005 保证已安装用户通知却缺实际关系与送达来源。draft 原型交互不是故事成立的 evidence。

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 故事组织 | 全仓动作表 | 节点内目标至验收小循环 | 防止事后贴标签 |
| 成功 | UI 可点击/ACK | 可判别边界、外部结果 unknown | 不伪造外部成功 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 当前能力附录完整小循环 | 来源与门槛一起收敛 | 后续需主题汇总审计 | 采用 |
| 一次全仓故事再铺功能 | 快 | 孤儿、重复、越界难发现 | 不采用 |

## 7. 结构化中间产物

当前从 `00_req_step_08_capability_c1_source_responsibility.md` 开始；其余附录未到达不创建。共用词汇：owner source version != market version != distribution receipt；资格、审批、接收和送达分别由正式 authority 决定。

## 8. 回填草稿

待各节点停审后摘录附录故事表，当前不提前输出全仓表。

## 9. 待确认事项

MP-UP/MP-SRC 继续，未确认正向路径必须有相应拒绝/等待情景。

## 10. 进入下一步条件

五附录自检并跨能力去重后才能进入 Step 9；当前 gate=in_progress。

## 跨能力故事审计与最终停审

| 能力 | 当前附录（同目录） | 核心故事 | 停审结果 |
|---|---|---|---|
| C1 | `00_req_step_08_capability_c1_source_responsibility.md` | US-MP-101/102 | pass |
| C2 | `00_req_step_08_capability_c2_review_publication.md` | US-MP-201/202 | pass |
| C3 | `00_req_step_08_capability_c3_discovery_selection.md` | US-MP-301/302 | pass |
| C4 | `00_req_step_08_capability_c4_distribution.md` | US-MP-401/402 | pass |
| C5 | `00_req_step_08_capability_c5_withdrawal_recovery.md` | US-MP-501/502/503 | pass |

C1 关注可信来源/责任，不重复 C3 发现选择；C2 是申请与适用决定，不重复 C5 撤回通知；C4 关系与结果为 C5 影响来源，C5 不是安装器；审计横切不重复每节点来源功能。11 个核心故事逐节点形成，无孤儿或正文/Billing/approval 目标。外围收藏/推荐/评论/高级统计未成为正式故事；不能借原型 session state 增需求。五附录已完成故事至验收小循环，自检只证明需求一致，不关闭正向合同 blocker。

最终回填草稿：§8 逐节点摘录附录故事表，保持11编号与价值，不增加故事。复杂度：五独立附录已满足能力审查，主控不重复全仓巨表。最终 `gate_status=pass / stop_review`；全部 Step 内计划 done（对应附录及此审计）；允许 Step 9，只汇总功能主题及双重映射，不补造新功能。原主控 in_progress 字段为开工批次历史，由此记录替代。
