# Step 11. 定义提交、评审与交付纪律

## 1. Step 状态

`completed / no_commit_now`。

## 2. 提交前规则

未来实现仓提交必须在 boundary 门禁通过、用户明确授权、staged scope 无越界且台账已更新后进行；当前 design 仓不提交。每笔提交对应一个 BND，不按文件/函数拆分，不混入无关格式化或后续 phase。

## 3. Commit Gate / Handoff Gate

| 项 | 要求 |
|---|---|
| design_baseline | 记录正式文档 baseline；当前 pending |
| required_reads | 当前 phase/boundary 的 00~07 与 scoped calibration |
| allowed/forbidden scope | 与 BND 台账一致；禁止私补 schema/port/state/config/evidence |
| required_checks | fmt、check、targeted tests、redaction/dependency/report（按 boundary） |
| Commit Gate | staged scope、unrelated diff、message、whitespace、checks 全有证据 |
| Handoff Gate | commit hash/message、剩余 blocker、未跑测试、next boundary、用户改动保护 |

## 4. 提交信息与配置

实现仓未来默认英文 `type(scope): subject`，源码/rustdoc/测试名英文；当前 design 文档仓若提交由用户另行授权，不能在本轮擅自提交。git user.name/email、项目历史提交和提交规范必须在实现前核验；本计划不伪造配置或 commit。

## 5. 评审与交付

评审必须按 boundary、设计 baseline、required checks、AC/VETO 和 evidence path 审查。交付只能交 planned/真实生成的固定 run 报告；blocked、缺 raw、未审 acceptance 草案不能当 ready。当前无交付事实。

## 6. 回填与进入下一步

提交/评审/交付纪律已固定，允许 Step12。
