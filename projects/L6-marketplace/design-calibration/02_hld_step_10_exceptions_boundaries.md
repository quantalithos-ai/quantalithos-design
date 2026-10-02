# 02 Step 10：异常与边界场景轮廓

## 1. Step状态

开工：用户已确认01并授权全部02；Step 10 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_09_states_transitions.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些关键异常路径必须在概要设计层先点名？

答：错owner/type/ref/version/digest/scope、publisher/missingmaterial、错Govbinding/waived/ACK、hiddencount、原result缺失、撤回竞争、unknown/迟到/notice失败、缺rebuildplan必须点名。

2. 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系？

答：取消与已dispatch/unknown、withdraw与lateconfirmed、source不可见与staleprojection、workercrash与claimedfence、partialimpact与后续增量改变协作责任，不能混为Failed。

3. 哪些失败不能留到详细设计才发现？

答：源正向合同缺失、不具probe、完整原result丢失、metadata冲突、typed sidecar缺失、安全裁剪泄漏与body复制均不可留实现发现。

4. 异常与边界场景在概要设计层需要讲到什么程度才足够？

答：场景→所属部分→本地拒绝/blocked/unknown/degraded及durable责任；不枚举HTTP/errorcode或补偿算法。

5. 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节，不应在本步展开？

答：03细化错误taxonomy/resultkind/事务冲突/probe/retry条件/codec，04预算配置，05异常/并发切口，06证据上限，07boundary。

## 4. 当前文档问题诊断

Step8/9不同失败有不同truth source；00NFR303要求empty与dependencyfailed区分，不能一律返回空页。Projectedcounts跨scope泄漏需与正向access同级处理。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 失败 | 各flow/state散布 | 场景→唯一处理部分→可判别安全结果 | 不用空页/failed压平unknown |
| 边界 | VETO/NFR泛读 | 撤回竞争/完整result/typedplan/存在性泄漏具体化 | 03和05有明确切口 |

## 6. 设计取舍

选场景矩阵，不画额外异常影响图；所有异常严格落既有49入口与14statecarrier，拒绝泛化重试一切/unknown覆盖成功/通知失败回滚撤回。

## 7. 结构化中间产物

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| source type/ref/version/digest/visibility不完整或错映射 | U1；U3/U4当前gate | 不造digest/body/正式enum；Verify保存安全缺口，发布/获取positive blocked |
| publisher/组织/授权owner未绑定，系统actor伪装免校验 | U1及全入口 | Identity不是human认证；当前scope不成立reject/no disclosure；不建本地verified凭据 |
| 签名/scan/SBOM缺失、过期、wrong-kind或失败 | U1/U2 | 材料仅正式ref+适用依据，不自动approved；新fixedbasis需重核验 |
| Submitted被请求改材料/版本 | U2 | Revise拒绝；新申请/新审查语境，不覆盖旧basis/决定 |
| Gov summary可读但无approved/binding或waived/旧批准 | U2/U3/U4 | formal读取不证明批准；Record不匹配拒绝，List/Request/Dispatch拒绝或contractblocked |
| Gov申请交接timeout或worker许可后crash | U2/U6 | Review CommitUnknown或work可能外发，原intentprobe；无probe等待正式人工依据 |
| scope未知/隐藏与缺失读取 | U3/U7 | 未授权统一安全不可用，不暴露存在性/count；允许安全诊断scope才区分missing/not-visible |
| 目录空与索引/owner失效 | U3/U7 | empty必须合法查询确无可见项；依赖失败degraded/failed，不伪空成功 |
| projection stale与最新ownervisibility冲突 | U3/U7 | currentresolver优先，裁剪旧合法safe信息或不可用；不放宽权限 |
| exact版本无可用/已撤回 | U3/U4 | 返回明确不可用；不latest fallback、不暗建获取意图 |
| 免费/内部用户被误当获取授权 | U4 | 同currentgate，无Billing不造entitlement/transaction writer |
| 同operation/scope/key意图重复/冲突 | U6及所有command/job | samecanonicalintent typed原完整结果重放；异fingerprint conflict，Reserved busy/reconcile |
| Completed record但原result missing/错kind | U6 | 完整性缺口，不从currenttruth/view重建结果、不重跑domain |
| accepted但audit/result/durablework部分写入失败 | U6/所属部分 | 最终localUoW整体不accepted；reserve可保留待核对，不承诺跨owner回滚 |
| localcommit结果未知 | U6/所属部分 | typed operation/result读取核对，缺证据保持unknown，不创建第二关系/新意图 |
| 新Request/派发许可与withdraw并发 | U3/U4/U5 | 同versionserialization；withdrawcommit后无新admission/未许可dispatch；旧许可按可能外发影响独立收敛 |
| intent取消与已提交/unknown receiver竞争 | U4/U5 | localCancelled可与confirmed/unknownattempt并存；不造externalcancel，lateformalresult增量impact |
| receiver结果错intent/version/consumer/receiver/scope或乱序 | U4 | 正式匹配+CAS/fence/历史append；错bindingreject，duplicateS，不把ACKinstalled/paid |
| 外部commitunknown且无probe | U4/U5/U6 | 原intentwaitingmanualformalbasis，不盲重发/新intent、不填成功 |
| 影响页cursor缺失/late关系确认 | U5 | Partial/gap显式；stableknown集去重增量，late确认durable补充，不声称全安装 |
| noticechannel缺失/timeout/失败/ACK | U5 | Blocked/CommitUnknown/Failed或明确ACK层，formaloutcome独立；撤回仍有效，不自动卸载 |
| observation未准入/脱敏失败/ACK/timeout | U6 | local safeaudit仍成立；producer/receipt缺口独立，不能宣称admitted/archived |
| 缺typed snapshot本体/sidecar只有state | U7/所属部分 | commandblocked/querydegraded/jobitemgap；typedget不得用private map/opaque解析补齐 |
| rebuildplan缺失/空typed输入/错scope/sourcecursor竞争 | U7 | 不从旧index修truth，不发布partial为Fresh；Unavailable或Stale+完整逐itemreport |
| refresh失败但有旧安全材料 | U7 | 明确Stale+typed旧材料+failure；不可见或无合法材料Unavailable，不能仅state成功 |
| 恢复请求指向外部truth/SQL/删除历史 | U6 | finite typed目标+formalauthority；拒绝越权，unknown先probe，恢复不自动Listed |
| 正文/凭据/rawscan/log混入任何面 | 全U及Web/API/Worker | entry/adapter安全边界前置拒绝；不存拒绝正文于日志/报告/索引 |
| 中文检索/分页压力/等待无界 | U3/U5/U6/U7 | 声明scope/有界页/稳定cursor/完整失败，Q-MP-01阈值需正式profile实测，不编数字 |

复杂度：覆盖功能失败、业务边界、事务/幂等、外部未知、读取/恢复/性能安全，矩阵足够，不另画可选异常图。错误码、backoff/lease/probe具体契约与补偿细节交03，不新建跨ownerrollback能力。

## 8. 回填草稿

正式§10仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。表中场景均有§7/8/9已有入口，无errorcode/配置值或外部补偿新authority。 外部资格不关闭，允许进入Step 11。
