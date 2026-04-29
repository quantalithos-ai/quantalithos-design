/* ============================================================
   Quantalithos Console — App Logic & Mock Data
   ============================================================ */

const MOCK = {
  project: { id: 'blog', name: '个人博客系统' },

  stages: [
    { id: 'alignment', name: '目标校准', status: 'completed' },
    { id: 'requirement', name: '需求理解', status: 'completed' },
    { id: 'design', name: '方案拆解', status: 'completed' },
    { id: 'development', name: '迭代开发', status: 'running' },
    { id: 'acceptance', name: '验收确认', status: 'pending' },
    { id: 'release', name: '发布执行', status: 'pending' },
  ],

  agents: [
    { id: 'tech-lead', name: 'TL', role_name: '项目负责人', css: 'tl', status: 'idle', task: '' },
    { id: 'backend-dev-1', name: 'BE-1', role_name: '后端开发', css: 'be', status: 'executing', task: 'TASK-003 标签系统' },
    { id: 'frontend-dev-1', name: 'FE-1', role_name: '前端开发', css: 'fe', status: 'executing', task: 'TASK-004 评论系统' },
    { id: 'tester-1', name: 'QA-1', role_name: '测试工程师', css: 'qa', status: 'idle', task: '' },
  ],

  workitems: [
    { id: 'TASK-001', title: '项目脚手架', type: 'task', status: 'completed', assignee: 'backend-dev-1', priority: 'high', wave: 1, deps: [] },
    { id: 'TASK-002', title: '文章 CRUD', type: 'task', status: 'completed', assignee: 'backend-dev-1', priority: 'high', wave: 1, deps: [] },
    { id: 'TASK-003', title: '标签系统', type: 'task', status: 'in_review', assignee: 'backend-dev-1', priority: 'medium', wave: 2, deps: ['TASK-002'] },
    { id: 'TASK-004', title: '评论系统', type: 'task', status: 'in_progress', assignee: 'frontend-dev-1', priority: 'medium', wave: 2, deps: ['TASK-002'] },
    { id: 'TASK-005', title: '搜索功能', type: 'task', status: 'pending', assignee: 'backend-dev-1', priority: 'low', wave: 3, deps: ['TASK-003', 'TASK-004'] },
  ],

  roles: [
    { id: 'tech_lead', name: '项目负责人', scope: 'system', file: 'tech_lead.yaml' },
    { id: 'backend_dev', name: '后端开发工程师', scope: 'system', file: 'backend_dev.yaml' },
    { id: 'frontend_dev', name: '前端开发工程师', scope: 'system', file: 'frontend_dev.yaml' },
    { id: 'tester', name: '测试工程师', scope: 'system', file: 'tester.yaml' },
    { id: 'devops', name: 'DevOps 工程师', scope: 'system', file: 'devops.yaml' },
    { id: 'assistant', name: '项目助手', scope: 'system', file: 'assistant.yaml' },
  ],

  rules: [
    { id: 'communication', name: '沟通规则', type: 'hard', enabled: true },
    { id: 'verification', name: '完成验证', type: 'hard', enabled: true },
    { id: 'tdd', name: '测试驱动开发', type: 'soft', enabled: true },
    { id: 'debugging', name: '系统化调试', type: 'soft', enabled: true },
  ],

  flowTemplates: [
    { id: 'standard_pipeline', name: '标准六阶段流程', type: 'pipeline', nodes: 12, status: 'active' },
    { id: 'requirement_analysis', name: '需求分析', type: 'stage', nodes: 7, status: 'active' },
    { id: 'design_and_planning', name: '方案拆解', type: 'stage', nodes: 8, status: 'active' },
    { id: 'tdd_workflow', name: 'TDD 工作流', type: 'agent', nodes: 7, status: 'active' },
    { id: 'review_workflow', name: '代码审查流程', type: 'agent', nodes: 5, status: 'draft' },
  ],

  gitFiles: [
    { name: 'src/', type: 'dir', children: [
      { name: 'main.rs', type: 'file', size: '1.2 KB' },
      { name: 'models/', type: 'dir', children: [
        { name: 'mod.rs', type: 'file', size: '0.3 KB' },
        { name: 'article.rs', type: 'file', size: '2.1 KB' },
        { name: 'tag.rs', type: 'file', size: '1.4 KB' },
      ]},
      { name: 'handlers/', type: 'dir', children: [
        { name: 'mod.rs', type: 'file', size: '0.5 KB' },
        { name: 'articles.rs', type: 'file', size: '3.2 KB' },
        { name: 'tags.rs', type: 'file', size: '1.8 KB' },
      ]},
      { name: 'db.rs', type: 'file', size: '0.8 KB' },
    ]},
    { name: 'tests/', type: 'dir', children: [
      { name: 'article_test.rs', type: 'file', size: '2.5 KB' },
      { name: 'tag_test.rs', type: 'file', size: '1.9 KB' },
    ]},
    { name: 'Cargo.toml', type: 'file', size: '0.6 KB' },
    { name: 'README.md', type: 'file', size: '1.1 KB' },
  ],

  commits: [
    { hash: 'a3f2c1d', msg: 'feat: add tag model and CRUD', author: 'BE-1', time: '29 分钟前', files: 3 },
    { hash: 'b7e4a9f', msg: 'feat: add article-tag relation', author: 'BE-1', time: '45 分钟前', files: 2 },
    { hash: 'c1d8e3b', msg: 'feat: article CRUD endpoints', author: 'BE-1', time: '2 小时前', files: 4 },
    { hash: 'd9f1b2a', msg: 'feat: init project scaffold', author: 'BE-1', time: '3 小时前', files: 5 },
  ],

  containers: [
    { name: 'blog-backend', image: 'rust:1.77', status: 'running', cpu: '12%', ram: '256 MB', port: '4001→8080' },
    { name: 'blog-postgres', image: 'postgres:16', status: 'running', cpu: '3%', ram: '128 MB', port: '4002→5432' },
    { name: 'blog-redis', image: 'redis:7', status: 'running', cpu: '1%', ram: '32 MB', port: '4003→6379' },
    { name: 'blog-frontend', image: 'node:20', status: 'stopped', cpu: '0%', ram: '0 MB', port: '4004→3000' },
  ],

  activities: [
    { time: '10:20', agent: 'TL', action: '代码审查通过 TASK-003', icon: '✅' },
    { time: '10:15', agent: 'BE-1', action: 'TASK-003 标签系统完成', icon: '✅' },
    { time: '10:10', agent: 'FE-1', action: '评论组件开发中...', icon: '🔵' },
    { time: '09:30', agent: 'BE-1', action: 'TASK-001 项目脚手架完成', icon: '✅' },
    { time: '09:06', agent: 'TL', action: '任务拆解完成，5 个工单', icon: '📋' },
    { time: '09:00', agent: 'System', action: '阶段推进：方案拆解 → 迭代开发', icon: '🔔' },
  ],
};

// --- Navigation ---
function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  const map = { 'index.html': 'dashboard', 'workitems.html': 'workitems', 'agents.html': 'agents', 'flow.html': 'flow', 'git.html': 'git', 'sandbox.html': 'sandbox' };
  return map[file] || 'dashboard';
}

function initNav() {
  const current = getCurrentPage();
  document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
    if (item.dataset.page === current) item.classList.add('active');
    item.addEventListener('click', () => {
      const pages = { dashboard: 'index.html', workitems: 'workitems.html', agents: 'agents.html', flow: 'flow.html', git: 'git.html', sandbox: 'sandbox.html' };
      const target = pages[item.dataset.page];
      if (target && item.dataset.page !== current) window.location.href = target;
    });
  });
}

// --- Helpers ---
function badge(status) {
  const map = {
    completed: ['badge-success', '✅ 完成'], running: ['badge-primary', '🔵 进行中'],
    pending: ['badge-neutral', '⬜ 待开始'], in_progress: ['badge-primary', '🔵 进行中'],
    in_review: ['badge-info', '👀 审查中'], in_testing: ['badge-warning', '🧪 测试中'],
    blocked: ['badge-error', '🚫 阻塞'], idle: ['badge-success', '● 空闲'],
    executing: ['badge-primary', '● 执行中'], active: ['badge-success', '启用'],
    draft: ['badge-neutral', '草稿'], hard: ['badge-error', '硬约束'], soft: ['badge-neutral', '软指引'],
  };
  const [cls, label] = map[status] || ['badge-neutral', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function avatar(agent) {
  const a = MOCK.agents.find(x => x.id === agent);
  if (!a) return `<span class="agent-avatar be">?</span>`;
  return `<span class="agent-avatar ${a.css}">${a.name}</span>`;
}

function renderPipeline(container) {
  container.innerHTML = '<div class="pipeline-bar">' + MOCK.stages.map((s, i) => {
    const conn = i > 0 ? `<div class="pipeline-connector ${MOCK.stages[i-1].status === 'completed' ? 'done' : ''}"></div>` : '';
    const icon = s.status === 'completed' ? '✓' : (s.status === 'running' ? '●' : (i+1));
    return `${conn}<div class="pipeline-stage ${s.status}"><div class="dot">${icon}</div><span class="name">${s.name}</span></div>`;
  }).join('') + '</div>';
}

// --- Sidebar HTML (shared) ---
function sidebarHTML() {
  return `
    <div class="sidebar-group">
      <div class="sidebar-group-title">项目</div>
      <div class="sidebar-item" data-page="dashboard"><span class="icon">📊</span>仪表盘</div>
      <div class="sidebar-item" data-page="workitems"><span class="icon">📋</span>工单管理<span class="badge">5</span></div>
    </div>
    <div class="sidebar-group">
      <div class="sidebar-group-title">配置</div>
      <div class="sidebar-item" data-page="agents"><span class="icon">🤖</span>Agent 配置</div>
      <div class="sidebar-item" data-page="flow"><span class="icon">🔀</span>流程管理</div>
    </div>
    <div class="sidebar-group">
      <div class="sidebar-group-title">开发</div>
      <div class="sidebar-item" data-page="git"><span class="icon">📦</span>Git 仓库</div>
      <div class="sidebar-item" data-page="sandbox"><span class="icon">🐳</span>沙箱监控</div>
    </div>
    <div class="sidebar-group">
      <div class="sidebar-group-title">系统</div>
      <div class="sidebar-item" data-page="monitor"><span class="icon">📈</span>监控</div>
      <div class="sidebar-item" data-page="settings"><span class="icon">⚙️</span>设置</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = sidebarHTML();
  initNav();
});
