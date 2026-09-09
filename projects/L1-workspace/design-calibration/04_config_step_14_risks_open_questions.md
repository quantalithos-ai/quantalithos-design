# Step 14. 定义风险与待确认事项

## 1. Step状态

completed / pass_with_external_slots；风险收口完成，尚未装配正式04。

## 2. 本步输入

Step1~13、03 §13、项目台账、配置SOP Step14与书写规范§5.14。

## 3. SOP问题回答

配置设计可在本地收敛 typed limits、来源优先级、profile、secret reference、加载和失效姿态；不能关闭上游 owner schema、具体 driver/transport、密钥 provider 或运行环境事实。所有影响03 constructor/port/error/flow的未决项必须阻塞待确认，不能进入正式定稿为已确认配置。

## 4. 风险表

| 风险 | 影响 | 缓解 | 负责人 |
|---|---|---|---|
| WS-UP-001~005输入契约未闭合 | owner binding、scope、visibility、attention无法正向启用 | capability blocked/fail-closed | 各owner |
| WS-UP-002 replay/baseline未闭合 | recovery与consumer无法保证连续性 | Gap/Unknown，不伪造实时 | owner/L0-bus |
| WS-UP-006/006-S/008下游与seed边界未闭合 | export/seed/执行主语越界 | 只读边界，archive串行 | 下游owners |
| WS-UP-007 Core专用schema未确认 | 共享依赖和版本不确定 | 仅核验子集，不复制schema | L0-core |
| WS-LOCAL-001 driver终局未验证 | unknown、隔离和重启恢复风险 | 04只定义能力，实施期验证 | infra/实施 |
| WS-LOCAL-002 配置全schema未闭合 | 缺值、profile、endpoint无法加载 | required slot、fail-fast | 本项目04/05 |
| WS-LOCAL-003 crypto/pin未验证 | token/随机数/兼容性风险 | 固定算法合同，禁止自制实现 | 本项目04/实施 |

## 5. 待确认表

| 事项 | 当前影响 | 确认方/关闭证据 | 未确认处理 |
|---|---|---|---|
| WorkspaceLimits具体值与上限 | 04项校验与05边界 | 04/05正式schema与验收 | 不填默认值，缺失fail-fast |
| store/owner/bus driver与endpoint | capability构造 | 具体绑定与兼容性检查 | affected branch unavailable |
| secret provider、key rotation | cursor与凭据读取 | provider契约和轮换测试 | 仅ref，不加载明文 |
| profile拓扑与部署注入 | 环境矩阵 | 运维/实施正式资料 | 逻辑profile，不写命令 |
| WS-UP九项及LOCAL-001/003 | 正向集成和运行事实 | owning docs/真实验证 | pending/blocker |

## 6. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 处理状态 |
|---|---|---|---|
| 既有limits、AEAD、no-write和error语义 | 是（承接） | 配置语义 | 无回写 |
| 具体driver/provider/reload API | 是 | constructor/adapter/port | 阻塞待确认 |
| 业务授权、状态、source identity配置 | 是 | truth/flow | 禁止配置化；无回写 |

## 7. 回填与门禁

正式§14承接本表；存在阻塞待确认项但无本地“待回写”项，允许Step15装配。不得把pass_with_external_slots写为实现就绪。
