# Step 3. 收稳约束条件

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 3。

### Step 内计划

- [x] 读取项目 ledger、02 flow、Step 1~2 和正式 00/01 的边界/数据/交互/横切结论。
- [x] 回答哪些约束直接改变对象、接口、处理流或状态判断。
- [x] 诊断旧 02 的通用工程约束、provider/SLA 和治理越权。
- [x] 从 source、closure、外部副作用、restore 和依赖分类形成硬约束。
- [x] 检查每条约束均有后续结构落点。

## 2. 本步输入

Step 1~2；正式 00 BR-AR-001~012/NFR/一票否决；正式 01 §3/8~13/15/17。上游 blocker 仅允许保守分支与 required seam。

## 3. SOP 问题回答

1. 对对象有直接影响：Archive-owned truth 与外部 snapshot/projection/ref 必须不同类型；状态轴不能混成一个 `status`。
2. 对接口有直接影响：Command/Query/Event/Job 必须分类；query no-write；event 不等 authority/commit；receiver handoff 无上游数据库能力。
3. 对处理流有直接影响：manifest 输入冻结、每 source/item 独立收敛、外部 intent/result 分离、commit-unknown 先 probe/reconcile。
4. 对状态有直接影响：closure/integrity/compatibility/storage/lifecycle/handoff 独立；本地成功不推导项目、治理或 receiver business 状态。
5. 泛化日志、缓存、框架、数据库和部署偏好不能成为本步约束。

## 4. 当前文档问题诊断

旧 02 的“技术/资源/时间/合规约束”混合 provider、容量等级和产品愿望；以 legal hold 材料不得误删等正确方向掩盖“本仓拥有 RetentionClass/LegalHold”的越权对象；又以 cached archive index、99.9% 降级作为无来源设计前提。当前只保留能改变本仓结构的正式约束。

## 5. 改动前后对比

| 旧口径 | 当前口径 |
|---|---|
| snapshot/index/retention 默认都是本仓 truth | 仅 request/binding/bundle/assessment/execution/handoff 是本仓 truth |
| 单一 archive status | 六类状态轴及逐 source/item 结果 |
| cached index/provider 降级 | source authority 不可替代；外部未知 fail-closed |
| retention/hold 规则本地化 | governance decision ref 与 Archive execution 分离 |
| restore 作为统一恢复结果 | owner-specific handoff，业务 commit 留 owner |

## 6. 设计取舍

- 采用 16 条可直接反查后续结构的硬约束，不重复完整架构文本。
- 状态分轴和外部 intent/result 分离作为概要骨架约束，具体状态枚举与事务算法留 Step 9/03。
- 可配置性不能削弱 authority、闭包、幂等、安全或 unknown-first；具体配置项留 04。

## 7. 结构化中间产物

| 约束 | 说明 |
|---|---|
| HC-AR-01 Archive truth 唯一 | 本仓对象只拥有 request/job、binding/capture、Bundle/manifest/closure、assessment、storage/lifecycle execution、restore plan/material/handoff 记录。 |
| HC-AR-02 外部材料带 authority | owner snapshot/export、workspace projection、Artifact/audit material 与 ref 必须显式分类并绑定 source/version/fence/coverage。 |
| HC-AR-03 projection/ref 不补 canonical 缺口 | workspace、audit summary、Artifact ref 或 cache 不得使 missing/partial source 变 captured。 |
| HC-AR-04 manifest-first 冻结 | closure 只针对固定声明集与固定 material/ref inventory；不得静默后补、忽略越界项或覆写历史 revision。 |
| HC-AR-05 成功分轴 | closure、integrity、compatibility、storage commit/retrieval、lifecycle execution、handoff outcome 使用独立对象/状态，不共用万能 status。 |
| HC-AR-06 sealed 无业务语义 | sealed/verified/durable/accepted 均不得推导 archived/dissolved/restored、治理批准或 owner committed。 |
| HC-AR-07 query no-write | 查询/验证读取不触发 capture、repair、placement、retrieval、handoff 或外部写入；需要动作时返回明确姿态。 |
| HC-AR-08 event 只触发或反馈 | event arrival 不替代 authority query/export、Bundle body、delivery truth 或外部 commit。 |
| HC-AR-09 外部 intent/result 分离 | storage、integrity、lifecycle 与 receiver 副作用先保存可追溯意图，再独立记录反馈；发送成功不等 commit。 |
| HC-AR-10 unknown-first | commit-unknown、unknown、unsupported-version、integrity-failed 不得乐观推进；先核对，不能安全自动恢复时保留人工/补偿姿态。 |
| HC-AR-11 per-source/per-item 收敛 | 一个 source/item 失败不覆盖其他结果；全局汇总不得压平 partial/stale/missing/conflicting。 |
| HC-AR-12 governance decision/execution 分离 | retention、hold、delete、risk 决定只能作为 versioned ref 输入；本仓仅拥有适用检查与执行反馈。 |
| HC-AR-13 restore no-write | Restore Bundle/plan/material 不是跨域权限；只有正式 owner receiver 可接受、拒绝、提交或返回未知。 |
| HC-AR-14 配置不得创造 authority | 配置不能生成 owner、policy、key、算法、receiver、许可或 success，也不能关闭安全/闭包/幂等守卫。 |
| HC-AR-15 依赖种类显式 | 只有核验 `L0-core` 契约可 compile；L1/L4 sibling、Bus、SDK、provider 均保持 runtime/event/ref/adapter/fake 边界。 |
| HC-AR-16 设计证据上限 | fake、文档自检或对象存在不证明集成、真实 Bundle/digest、测试、验收、signoff 或 readiness。 |

约束到后续落点：HC01~06→Step 5/6/9；HC07~11→Step 7~10；HC12~14→Step 5~11；HC15→Step 4/7；HC16→Step 12~14。

## 8. 回填草稿

正式 §3 摘录 16 条约束与落点短文，不保留旧“技术/资源/时间/合规”分类或 SLA。

## 9. 待确认事项

exact source/receiver/schema/provider 仍由 `AR-UP-*` 挂起；约束只定义安全上限，不为其给出答案。

## 10. 进入下一步条件

每条约束都能影响后续对象、接口、流、状态或配置判断；无泛化工程口号和实现参数。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 4。
