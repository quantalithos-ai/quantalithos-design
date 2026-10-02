# 01 Step10 · 关键技术机制

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step02/07/08/09、全局§9.2/十、draft04§2与00MP-SRC-003。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step02/07/08/09、全局§9.2/十、draft04§2与00MP-SRC-003 |

## 2. SOP问题回答

需要上升架构决定的是模块化市场边界、向内依赖/SDK防腐接缝、命令查询分离、immutable refs及固定申请、局部原子持久化与延后副作用、持久幂等原结果/unknown对账、withdrawal序列化与范围读取、可重建索引及分层安全追溯。不是为便利而列全部框架名。其代价是额外引用核验、结果/attempt保留、投影滞后、receiver probe合同、API/Worker兼容约束。当前不采用full ES、独立搜索产品/微服务、支付引擎或scan生产平台。

## 3. 输入诊断

draft04推荐TS/React/Fastify对全局Rust/Vue没有受控变更授权，00明确未批准覆盖。选择上位约束不是否定用户认可运行分离；保留draft alternative为待确认变更，不私改draft。数据库PostgreSQL适合局部原子/查询及可靠后台承载，但FTS/trigram对中文能力不能凭名字声称已满足，具体carrier/codec/语言搜索测量留02/03/05。

## 4. 设计取舍

当前正式架构遵循Rust API/Worker+Vue前端的上位技术约束（Vue TypeScript表达不冲突），不采用TS/React覆盖。这一约束决定可稳定进入01；MP-SRC-003的draft替换/栈变更仍待用户及全局owner受控确认，不伪称变更批准。架构选择PostgreSQL作为局部事务和派生承载方向，不锁Axum/Tokio/ORM/前端组件或版本；02按当前约束选实现载体。

## 5. 结构化中间产物

### 正式§11关键技术机制

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 一个模块化市场边界、多运行入口 | UI/API/Worker重复市场语义 | 同ownership保持本地一致，交付分别演进 | 共享契约/存储兼容需受控升级 | 非每子域一个微服务。 |
| 向内依赖与SDK-owner防腐接缝 | 外部模型和协议侵入核心 | 内侧只消费qualified body-free能力 | 每type/operation资格与结果映射不可省略 | 不绕官方SDK。 |
| immutable source与固定审查基线 | 来源漂移/旧批准套新版本 | exact版本与材料/scope绑定长期可审 | 修改需新依据/复审语境 | 禁latest fallback。 |
| 命令查询职责分离、可重建projection | 搜索/维护反写或泄漏 | 本地truth唯一，shadow可失效/重建 | freshness、scope resolver、rebuild来源复杂度 | 不是full ES。 |
| 局部事务持久化与延后副作用责任 | accepted/审计/原结果/backlog部分成功 | 一个market原子承诺，不锁外部owner | 可靠claim/attempt/fence与兼容恢复需后续细化 | 采用PostgreSQL作为局部承载方向，不共享owner表。 |
| 持久幂等原完整结果与unknown核对 | 重复交付/取消竞争/timeout假成功 | 同canonical intent重放，外部commit未知不猜 | result save/get、probe支持、人工等待均须闭合 | 不宣称exactly-once网络。 |
| 当前gate与撤回序列化、派发前再核验 | 查询选择到执行之间资格变化 | 禁新受理与已有交接分层 | 外部全球即时撤销不是本地原子保证 | 无正式依据则fail closed。 |
| 条件canonical事件交接 | 无schema私造变化提示 | 只有owner/SDK授权后发布或消费 | 无payload时outbound禁用，不建伪发送成果 | 本地任务意图不等canonical event outbox。 |
| 安全审计与观测分层 | logs/ACK冒充业务或外部完成 | 本地审计与外部准入可独立解释 | 脱敏、准入、result refs及unknown记录 | 无正文/evidence/verdict生产。 |

当前语言/运行技术约束遵循全局Rust服务端（API/Worker）+Vue前端；前端可用TypeScript表达，后端不得按draft纯TS域直接落码。MP-SRC-003保留为draft变更确认，未经受控上位变更不能切Next/React/Fastify。PostgreSQL为局部事务/派生/可靠任务承载的架构方向；具体ORM、HTTP框架、FTS/trigram与中文检索、测试框架/版本由02～05在相同约束下闭合，不预称支持或测试通过。

未采用full ES、独立搜索/缓存/消息产品作为首期硬前置，也不引入无authority的Billing/包/扫描生产系统。机制的理由/代价可回指Step08/09；本章不把框架清单当架构决定。

## 6. 复杂度判断

技术机制与技术约束分开，具体工具候选不升格ADR；栈变更未批准，保持明确单一当前约束。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
