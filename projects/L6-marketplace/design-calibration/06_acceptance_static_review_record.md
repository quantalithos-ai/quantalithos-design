# 06 验收标准静态审查记录

## 1. 审查范围

- 日期：2026-10-02
- 模式：full-restart / single-agent / design only
- 目标：`06-验收标准.md`、`06_acceptance_calibration_flow.md`、Step1～15中间产物和本项目执行台账
- 证明上限：只证明Markdown结构、链接、索引和设计闭环；不证明编译、PG/API/Worker/Web执行、owner资格、资产、扫描、签名、支付、evidence、verdict、signoff或readiness

## 2. 正式文档核对

| 检查项 | 规则 | 结果 |
|---|---|---|
| 旧稿纪律 | 旧06先删除，再建新骨架和正文 | pass；旧10章commerce/install/rating/ranking未继承 |
| 主章节 | 15章，编号1～15连续 | pass |
| 校准来源 | 每章具体列出`design-calibration`文件与延伸阅读 | pass；15/15 |
| 正式内容 | 只写收口门禁，不写SOP问题/诊断/过程/actual运行结果 | pass |
| 旧名/无来源承诺 | 无PackageRelease/InstallRecord/EntitlementView/RatingReview/RankingView、无P95<200ms | pass |
| scope边界 | local-contract/formal-selected/capacity-candidate分层；Billing/Archive/Event边界保留 | pass |
| 三值 | 仅通过/有条件通过/不通过；未送验/未裁决为过程状态 | pass |

## 3. 跨文档与库存核对

| 库存/闭环 | 预期 | 结果 |
|---|---:|---|
| 需求ID | 16 FR / 21 BR / 17 NFR / 20 AC / 14 IF / 11 DEP / 5 VETO | 已由00/05/06来源块承接 |
| canonical验收项 | 20 `AC-MP-*` | §5功能16+4全局，Step5/10/14闭环 |
| 否决 | 5 `VETO-MP-*` | §11五项；不可风险接受 |
| TC/EV | 98/98唯一双射 | Step10独立索引98行，Node只读核对无重复/孤儿 |
| 主suite | D6/S22/I5/P21/W14/B2/C14/X1/R11/E1/M1 | Step10索引与05主归属一致 |
| 入口/状态 | 49入口、14 carrier、222 pair、73A/51S/98R | §7/§8回指03/05完整参数化来源 |
| ports/methods | 17 / 146 | §7 shared conformance与03唯一签名 |
| canonical/page | 33 DTO、16Q/33 replay、7 PageReadContext | §6/§8/§9/§10闭环，Query/replay零写 |
| configuration | 六域、七RuntimeConfig字段、八slot、四profile | §6/§7/§9/§11沿04 |
| external gaps | MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01、R-MP-DDD-01～10 | §13全部保留未接受 |

Step10总审计中发现的72条细分门禁反向锚点已回写到 `06_acceptance_step_10_evidence_index.md`；这些是已有AC/VETO支持边，不是新增canonical、TC、EV或运行结果。

## 4. 自动化式只读检查

以下检查由临时Node只读脚本完成，未写入实现仓、artifact或report目录：

1. 正式06标题集合为 `1,2,3,4,5,6,7,8,9,10,11,12,13,14,15`，文件520行。
2. 正式06每章都有具体校准来源和延伸阅读；未发现旧业务对象/无来源延迟阈值/角色槽位污染。
3. 正式06与06 calibration范围内本地Markdown链接107条，目标文件和显式anchor全部存在。
4. 范围内Markdown表格列数一致、代码围栏闭合；Step1～14主控十段与必需`source_files/gate_status/gate_reason/next_allowed_action`字段通过。
5. Step10设计索引逐行解析得到98行、98唯一EV、98唯一TC、每行有canonical AC锚点；与05用例主suite/EV映射一致。
6. 只读检查不解析/执行JSON Schema，不生成hash、不运行测试、不读取secret、不赋实际status。

## 5. 设计停审与真实性边界

Step5～11的逐项门禁均标记`design-stop/pass`，仅表示字段/来源/通过失败/证据路径/裁决已设计；Step12～14仅定义缺陷、风险、三值和签署规则。全部实际TC/EV/report/owner positive/人工审查仍planned、blocked或waiting。

不存在实现仓、implementation ledger、boundary skeleton、run、asset package、digest、scan/signature/payment result、acceptance verdict、risk acceptance、signoff或readiness。按约束，implementation ledger和全部planned/blocked/waiting skeleton等07完成时才创建。

## 6. 结论

`06-验收标准.md` 已完成正式重建和静态自检，项目级06状态为 `design completed / selfcheck_done / stop_review / waiting_user_confirmation`。上游资格和风险未关闭；当前不进入07，不执行代码或测试，不提交commit。
