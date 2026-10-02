# 04 Step 11：定义失效模式与降级 / fail-fast 策略

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步完成配置错误、依赖失效和安全降级姿态；不把失败结果改写为成功，不新增错误枚举。

## 2. 本步目标

**目标**：把配置错误与外部能力缺口分层，明确哪些阻断启动、哪些只阻断受影响能力，且所有结果复用03错误/状态语义。

### 本步输入

Step8秘密策略、Step9校验顺序、Step10回滚、03§9状态、§11错误恢复、§13装配、`MP-UP`/`MP-SRC`/`Q-MP-01`缺口。

### 本步输出

失效矩阵、禁止降级表、启动/操作级fail-fast与fail-closed规则，回填正式04§11。

## 3. 应问的问题与SOP回答

1. **哪些错误必须阻止启动？** 文件不可读、JSON/schema错误、未知键、类型/关系错误、关键PG ref不可用、worker必填预算缺失或不安全溢出。
2. **哪些错误只阻断能力？** SDK/owner profile或某个slot的正式资格不可用时，相关adapter为Blocked/Unavailable；Scope缺失按03规则使所有受影响读写fail closed。
3. **能否用空列表、fake或默认值降级？** 不能。列表/搜索不可用不返回伪Empty，owner不可达不返回成功，production不fallback fake。
4. **外部effect未知如何处理？** 沿03 intent-before-effect、probe-first、原operation resolution；配置层不得retry-all或生成新intent。
5. **观测失败是否改变业务？** 不改变；诊断丢失只记safe failure，不触发replay或业务补偿。

### 当前材料问题诊断与取舍

旧draft倾向把不可用依赖隐藏成空列表或成功状态。采用配置级fail-fast、能力级fail-closed和有限degraded telemetry；任何Unknown、Blocked、Unavailable都沿03语义暴露，不由配置压成成功。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 缺失配置可能被静默默认 | 关键项缺失阻断启动或Worker |
| 外部资格缺口可能被fake补齐 | 受影响slot保持Blocked/Unavailable |
| telemetry失败可能触发补偿 | 诊断降级不改变业务结果、不触发replay |

## 4. 失效矩阵

| 失效场景 | 检测层 | 结果 | 处理策略 | 禁止行为 |
|---|---|---|---|---|
| 配置路径缺失/不可读 | source loader | 进程不启动 | fail-fast | 自动搜索HOME/隐式默认 |
| JSON语法、重复键、未知键 | parser/schema | 快照拒绝 | fail-fast | 忽略未知项/最后写入胜出 |
| schema/profile不支持 | envelope | 进程不启动 | fail-fast | 自动降级旧profile |
| `api.bind`非法 | typed validator | API不启动 | fail-fast | 使用原型9090生产默认 |
| PG ref/provider/能力不足 | storage builder | 无本地accepting assembly | fail-fast | 只读fake、空存储或假成功 |
| SDK profile缺失/不兼容 | SDK validator | 受影响positive adapter Blocked | fail-closed | generic client自证资格 |
| owner ref缺失/slot未知/重复 | schema/adapter validator | 配置错误拒绝；缺slot明确Blocked | fail-fast + fail-closed | 文件声明Bound、自动补slot |
| owner current资格/consumer contract缺失 | qualification | 受影响操作Blocked/Unavailable | fail-closed | 用scan/signature/ACK替代approval |
| Scope resolver不可用 | scope port | 所有依赖scope的读写拒绝 | fail-closed | 默认内部actor/全量可见 |
| worker batch/lease缺失、0或溢出 | worker validator | Worker不启动 | fail-fast | 无限批量/盲续租 |
| locale非法 | web/runtime validator | 快照拒绝；缺失只回En | fail-fast/default En | 改变业务key/ref |
| Web API base非法/含凭证 | build validator | Web构建拒绝 | fail-fast | 浏览器直连owner/DB |
| 运行中配置漂移 | deployment boundary | 继续使用已验证快照或受控停机 | no hot reload | 半热切换/部分进程新旧混用 |
| telemetry/audit sink不可用 | telemetry | 业务结果不改变 | degraded safe diagnostics | 以观测丢失触发重放 |
| 外部dispatch结果Unknown | application/worker | 保留Unknown，先probe | 03 resolution path | retry-all/new intent |

## 5. 降级允许范围

| 可降级面 | 允许姿态 | 结束条件 |
|---|---|---|
| 非关键telemetry | `degraded`，只保留有限本地诊断 | sink恢复或运维处理 |
| 某个未启用owner slot | `Disabled`，不提供相关能力 | 新快照+正式资格 |
| 未闭合positive owner | `Blocked/Unavailable` | current authority、SDK映射和consumer合同闭合 |
| Web展示locale缺失 | 安全默认`En` | 新构建/用户展示偏好 |

不允许对storage、scope、审核匹配、版本exact选择、幂等、撤回序列化或外部Unknown使用`default-fallback`。不允许把`Blocked`、`Unavailable`、`Unknown`压缩为空成功、Empty列表、Installed、Paid或NoticeDelivered。

## 6. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置错误fail-fast、资格缺口fail-closed | 否 | 错误/能力姿态 | 03§11～§13已有语义 | 无回写 |
| telemetry失败不触发业务重放 | 否 | 观测边界 | 03§14已有定义 | 无回写 |
| 禁止retry-all/force-success/fake生产 | 否 | 领域不变量复述 | 03§2、§9～§13 | 无回写 |

## 7. 回填草稿、待确认与进入下一步条件

正式§11回填失效矩阵和降级允许范围；错误名称复用03，不能在04新增`ConfigError`或状态枚举。待确认：各owner正式probe/timeout、PG容量、provider故障SLO和Q-MP-01，进入Step14；不关闭任何外部资格。

进入Step12条件：每类配置/依赖错误均有启动或操作级结果；没有默认成功、伪Empty、fake生产或盲重试路径。
