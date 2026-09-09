# Step 15. 正式配置设计文档装配

## 1. Step状态

in_progress / formal_assembly；Step1~14均已完成，正式04尚未创建。

## 2. 本步输入

Step1~14、正式00/01/02/03、配置设计SOP Step15、配置设计书写规范§5.1~5.15、项目台账。

## 3. 装配规则

正式04按十五章主链组织；每章标注校准来源。配置项清单只包含03已有WorkspaceLimits与明确技术绑定槽位；具体值、真实DSN、部署命令、owner schema和运行证据不写入。Step14中的风险/blocker必须原样保留。

## 4. 审计计划

检查十五章、控制面→分类→来源→矩阵→清单→secret→加载→变更→失效→承接→演进→风险闭环；每项有类型/必填/来源/作用域/敏感性/生效/失败策略或明确pending；无“待回写”漏项；链接、围栏、表格和本项目修改范围可审。

## 5. 完成门禁

创建04正文并通过静态审计后，更新本Step、flow和project ledger为formal_stop_review / wait_user_before_05。不得自动进入05。
