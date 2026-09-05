# Step 11. 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.12
> 回填位置: 正式 `01-架构设计.md` §12
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~10 已通过;本文件通过前未创建 Step 12

## 1. 本步输入与比较准则

| 输入 | 作用 |
|---|---|
| Step 2 AG / AIC / AT | 比较方案必须保护的目标、红线和当前阶段收缩。 |
| Step 5 BC01~07 | 当前方案的语义结构。 |
| Step 7 / 8 / 9 | 依赖、数据、一致性、通信的评价维度。 |
| Step 10 TM-L2M-001~014 | 当前机制组合及代价。 |

有效备选必须能回答同一问题:“谁拥有 member 交互边界 truth,如何隔离 Runtime / host / Bus / downstream,如何处理 forbidden body 和 external failure”。语言、框架、transport、数据库、进程管理器和局部算法不能单独构成架构级替代路径。

## 2. 当前主线方案

`ALT-L2M-A` 当前方案:

```text
Independent member interaction-boundary truth
  + BC01~05 core semantics
  + BC06 anti-corruption mirror
  + BC07 isolated read projection
  + inward dependency boundaries
  + local-truth-first / immutable history / unknown fence
  + sync admission / async committed facts / background continuation
  + body-free safe material / external truth by ref
```

它保留 member 与 Runtime / host 的逻辑 boundary,允许位于同一 AI Member 容器但不共享 truth;物理 topology 与 transport 后移。

## 3. 方案路径比较

| 方案 | Owner / truth | 依赖与数据边界 | 失败语义 | 优点 | 代价 / 不采用原因 | 结论 |
|---|---|---|---|---|---|---|
| `ALT-L2M-A` 独立 member truth + bounded contexts + inward seams | member 拥有 presence / screening / delivery / outbound / trace;external truth 外置 | Core-only compile;ref / snapshot / safe material;projection 隔离 | local truth first、gap、fence、append feedback | owner 清楚,可审计,可替换 transport,支持 pending seam | 状态 / correlation / adapter / projection 复杂度高,early integration 受限 | 采用 |
| `ALT-L2M-B` 透明 Event / IPC 管道(B1~B6 风格) | 几乎无 member truth,screening / publish 只是动作 | raw / event / transport 容易贯穿 | success / retry 容易压平 | 初期模块和调用链简单 | 无法解释筛选 / 投递 / 出站决定,正文 / delivery 边界失控,违反 VF-001 | 不采用 |
| `ALT-L2M-C` 并入 Runtime | Runtime 同时拥有 run truth 和 external interaction | 边界 / adapter 进入 Runtime core | external failure 侵入 run / outcome | 少一个逻辑组件,局部调用短 | 违反 Runtime 正式非目标与 member 单一 owner;Runtime 重新变厚 | 不采用 |
| `ALT-L2M-D` 并入 member-service / host control | host 同时拥有容器外 lifecycle 与容器内筛选 /出站 | control plane 直入 Runtime / Bus / body boundary | host health 与 presence / interaction success 混合 | 控制面集中 | 形成自举 / 远程门面,host failure 接管本地 truth,违反 sibling owner 分层 | 不采用 |
| `ALT-L2M-E` 全事件化 member | 所有请求 / 反馈均按事件最终收敛 | Bus 成为每条路径前置 | 无即时 admission,caller 只能等事件 | 异步扩展与解耦自然 | startup / Runtime entry 缺同步 accept / reject;Bus unavailable 时核心边界失真 | 不采用 |
| `ALT-L2M-F` 全同步 RPC facade | 一条同步链覆盖 host -> member -> Runtime -> Bus / downstream | transport 与长链强耦合 | timeout 难区分 accepted / running / delivered | caller 心智简单 | 长时 run / eventual delivery 伪同步,级联失败,无法 local truth first | 不采用 |
| `ALT-L2M-G` member / Runtime / host 共享状态或 shared DB | 通过共享记录制造“一致” | owner / schema / transaction 混在一起 | external failure / update 可直接覆盖 | 查询和联表看似简单 | 双真相、跨仓编译 / schema 耦合、回滚 / recovery 不可归责 | 不采用 |
| `ALT-L2M-H` 通用 agent gateway / capability adapter | member 同时经营 registry / provider / MCP / A2A / API | 外部 adapter 直穿 member | 外部错误与交互 truth 混合 | 对外入口集中 | 吞并 capability-hub / Runtime -> Tools 职责,扩大攻击面与依赖 | 不采用 |

## 4. 关键取舍对照

| 当前选择 | 放弃什么 | 换来什么 | 可接受条件 |
|---|---|---|---|
| 独立 member truth | 最短调用链 / 最少状态对象 | owner 唯一、interaction 可归责 | BC01~05 不吸收 external truth。 |
| local truth first | 跨系统“一次成功”假象 | external failure 不污染 local decision | attempt / gap / feedback 分层可读。 |
| eventual external feedback | 即时全局一致 | 无 shared DB / distributed transaction | duplicate / late / unknown 可分类。 |
| fail-closed / unknown fence | 部分可用性和自动恢复率 | 避免未授权或重复副作用 | resolution / operator path 后续必须可设计。 |
| body-free safe material | 完整上下文就地调查便利 | 最小暴露和 owner 回源 | ref / source / reason category 足以追溯。 |
| anti-corruption mirror | 直接复用外部 schema 的速度 | core 语言稳定、stale / conflict 显式 | Mirror 不膨胀成 registry / gateway。 |
| isolated projection | 强读一致与直接 core query | read failure 不拖垮 core,可重建 | freshness / gap 对消费者可见。 |
| transport-neutral seam | 早期协议闭口和短期实现确定性 | 可等待 host / Runtime 正式合同 | mapping closure 后回开受影响设计,不静默替换。 |
| project-scoped only | 非项目型 / personal 覆盖 | 主语唯一、身份与执行分层 | 第三种主语出现时重开 BC01 /相关交互。 |
| capability outlet optional | 初期完整能力可见性 | C1~C4 不受 Tools / method ref 影响 | 裁剪必须显式,不伪装 stale 为 available。 |

## 5. 不进入正式方案比较的事项

| 事项 | 原因 | 正确后续位置 |
|---|---|---|
| Rust vs Go vs Python | 实现语言变体,不改变 owner / data / communication | 07 / implementation decision |
| UDS vs TCP localhost vs pipe | transport 变体,entry mapping 未闭口 | 03 / 04 / 07 |
| gRPC vs HTTP / custom framing | protocol / schema 实现变体 | 03 |
| PostgreSQL vs embedded store | physical state carrier 变体 | 03 / 04 |
| supervisord vs sidecar / single process | deployment carrier 变体 | 04 / 07 / host design |
| capability outlet 首批开 / 关 | 阶段裁剪,不改变 projection architecture | Step 13 / 07 |
| fixed latency / heartbeat / retry number | 无 evidence 的配置 /测试问题 | 04 / 05 |

## 6. 历史方案审计

旧正式 `01` 选择“member / Runtime 双进程 + Rust + UDS gRPC + B1~B6 + supervisord”。其中“member / Runtime owner 分离”经当前上游重新证明后进入 `ALT-L2M-A`;双进程、语言、transport、模块、manager 不构成同一个不可拆的架构选择,已分别降为 deferred / historical。旧方案把合理边界与无 authority 实现绑定,是本轮 full-restart 必须拆开的核心污染。

## 7. 最终选择结论

选择 `ALT-L2M-A`。该方案牺牲早期直连速度、单状态模型和自动 fallback,换取:

- member / Runtime / host / Bus / downstream owner 可证明;
- raw / hidden / secret / definition body 不进入 member;
- local decision、attempt、delivery、observed、accepted 分层;
- pending seam 可在不私造 schema 的条件下进入后续设计;
- projection / capability outlet 可裁剪,核心 C1~C4 不受拖累。

如果未来正式需求要求共享 transaction、全同步完成、member 直连 provider 或由 host / Runtime 接管 screening / outbound truth,必须回开 Step 1~11,不能把它当局部 transport 调整。

## 8. 结构化中间产物与回填草稿

- 采用方案: `ALT-L2M-A`。
- 拒绝方案: `ALT-L2M-B~H`。
- 核心取舍: owner / correctness / traceability 优先于早期直连和单一 success。
- deferred implementation variants 不进入架构方案比较。

正式 §12 回填当前主线、方案路径比较表、关键取舍表和边界说明。不得把“尚未实现”写成被放弃架构方案,也不得在本章重新选 language / transport / DB。

## 9. 门禁自检

| 检查项 | 结果 |
|---|---|
| 备选是否为有效架构路径而非实现变体 | pass |
| 是否围绕 owner / dependency / data / consistency / evolution 比较 | pass |
| 是否说明被放弃方案的优点与不采用原因 | pass |
| 最终选择是否说明牺牲与收益 | pass |
| 是否把阶段延后事项误写为备选方案 | pass:未误写 |
| Step 11 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_12_cross_cutting_concerns.md`;正式 `01` 仍禁止修改。
