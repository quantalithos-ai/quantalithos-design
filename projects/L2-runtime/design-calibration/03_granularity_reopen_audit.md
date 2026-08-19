# L2-runtime 03 第二次粒度重开审计

> 创建日期: 2026-08-09
> 状态: accepted_reopen_input
> 用户结论: 同意重开

## 1. 量化诊断

| 范围 | L2-runtime | L1-governance | L2-tools |
|---|---:|---:|---:|
| 正式 03 | 907 行 | 679 行 | 2159 行 |
| Step 5~18 中间产物 | 3469 行 | 20499 行 | 17385 行 |

正式正文总行数被第 6 章 Port 签名抬高，不能证明逐对象/逐接口粒度。Step 5~18 总量只有 Governance 约 17%、Tools 约 20%，重点 Step 6~10 分别只有 Governance 的 1.9%、14.9%、10.1%、14.2%、17.7%。

## 2. 结构性缺口

| Step | 缺口 | 新门槛 |
|---|---|---|
| 5 | capability 只在总表出现 | 12 capability 各有独立实现卡、crate/file/object/Port/protocol/Flow/state/transaction/test 闭环 |
| 6 | 大量 `create(...)`、无完整 Rust 类型 | 每个 public/domain/application/infra/entry 对象独立卡；完整 fields/enum/functions/errors/source/invariants |
| 7 | Port 虽有签名但模块/adapter/fake/错误/事务参与不足 | 每个 Port 独立契约；每个函数有 caller、authority、read/write、version/cursor、error、fake |
| 8 | secondary type/view/report schema 不完整 | 每个协议与每个二级 public type 独立 schema；DTO 到对象构造闭环 |
| 9 | Query/Event 合并为通用段落 | 重开时曾以 15 Command 诊断；Step 8 对照当前 02 逐项表后修正为 17 Command。17 Command、12 Query、6 Event consumer、7 Job 均有独立 Flow；6 outbound event 有独立 materialization flow |
| 10 | 18 状态主语压成总表 | 每个状态机独立 enum、ASCII 图、完整 transition matrix、非法迁移、side effect、test |
| 11~17 | 多为 cross-cut 摘要 | 逐 record/Flow/state/config/observation/test/IU 承接，不得只列总规则 |

## 3. 禁止压缩标记

新产物不得用以下写法替代实现契约：

- `...`、`same`、`同上`、`分别按`、`对应 repository`。
- 无类型的 `sources`、`refs`、`repos/UoW`、`expected versions`。
- 多个 service/object/state 合并为一行且没有独立字段和函数。
- Query/Event/Job 只引用通用模板而不列差异化读取面、结果映射和错误。
- 使用行数达标代替字段/DTO/状态/事务/测试闭环。

## 4. 正式装配门禁

实现 Agent 不得需要自行发明：类型名、字段类型、enum variant、函数参数/返回、Port read surface、DTO secondary type、状态迁移、事务参与、幂等 identity、错误映射、配置 binding、test assertion 或 implementation phase dependency。任一需要猜测即门禁失败。
