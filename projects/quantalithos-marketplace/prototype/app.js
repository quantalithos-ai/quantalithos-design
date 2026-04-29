/* Quantalithos Marketplace — App Logic & Mock Data */

const MOCK = {
  assets: [
    { id: 'tdd-workflow', name: 'TDD 工作流', type: 'process_template', icon: '🔀', desc: '红-绿-重构循环的标准 TDD 工作流模板，适用于所有开发任务。', author: 'Quantalithos', rating: 4.8, reviews: 12, downloads: 156, tags: ['workflow', 'tdd', 'development'], version: 'v1.2' },
    { id: 'code-review', name: '代码审查流程', type: 'process_template', icon: '👀', desc: '包含静态分析、逻辑审查、安全检查的完整代码审查工作流。', author: 'Community', rating: 4.5, reviews: 8, downloads: 89, tags: ['workflow', 'review'], version: 'v1.0' },
    { id: 'fullstack-role', name: '全栈开发角色', type: 'role_definition', icon: '🧑‍💻', desc: '前后端通吃的全栈开发角色定义，适合小型项目。', author: 'Community', rating: 4.2, reviews: 5, downloads: 67, tags: ['role', 'fullstack'], version: 'v1.1' },
    { id: 'security-rules', name: '安全编码规范', type: 'shared_rule', icon: '🔒', desc: 'OWASP Top 10 对应的安全编码规则集，含硬约束和软指引。', author: 'Quantalithos', rating: 4.9, reviews: 15, downloads: 203, tags: ['security', 'rules', 'owasp'], version: 'v2.0' },
    { id: 'api-testing-skill', name: 'API 测试技能包', type: 'skill', icon: '🧪', desc: '自动生成 API 测试用例的技能包，支持 REST 和 GraphQL。', author: 'Community', rating: 4.3, reviews: 6, downloads: 45, tags: ['testing', 'api', 'skill'], version: 'v0.9' },
    { id: 'comment-component', name: '评论组件', type: 'component', icon: '💬', desc: '支持嵌套回复、表情、@提及的通用评论组件。', author: 'Community', rating: 4.6, reviews: 9, downloads: 112, tags: ['ui', 'component', 'vue'], version: 'v1.3' },
    { id: 'blog-app', name: '个人博客系统', type: 'app', icon: '📝', desc: '完整的个人博客系统，支持 Markdown、标签、评论、搜索。', author: 'AI Team', rating: 4.7, reviews: 11, downloads: 78, tags: ['app', 'blog', 'rust'], version: 'v0.3' },
    { id: 'kanban-component', name: '看板组件', type: 'component', icon: '📋', desc: '拖拽式看板组件，支持自定义列和卡片模板。', author: 'Community', rating: 4.4, reviews: 7, downloads: 93, tags: ['ui', 'component', 'kanban'], version: 'v1.0' },
    { id: 'ci-workflow', name: 'CI/CD 流程模板', type: 'process_template', icon: '🚀', desc: '标准的持续集成/部署流程，含构建、测试、部署三阶段。', author: 'Quantalithos', rating: 4.6, reviews: 10, downloads: 134, tags: ['workflow', 'ci', 'devops'], version: 'v1.1' },
  ],

  categories: [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'process_template', name: '流程模板', icon: '🔀' },
    { id: 'skill', name: '技能包', icon: '🧪' },
    { id: 'role_definition', name: '角色定义', icon: '🧑‍💻' },
    { id: 'shared_rule', name: '共享规则', icon: '📜' },
    { id: 'component', name: 'UI 组件', icon: '🧩' },
    { id: 'app', name: '应用作品', icon: '📱' },
  ],

  reviews: [
    { author: 'User-A', rating: 5, date: '2026-04-28', text: '非常好用的 TDD 模板，直接导入就能用，Agent 执行效果很好。' },
    { author: 'User-B', rating: 4, date: '2026-04-25', text: '整体不错，但希望能增加重构步骤的自定义选项。' },
    { author: 'User-C', rating: 5, date: '2026-04-20', text: '强制 TDD 让代码质量提升明显，推荐所有项目使用。' },
  ],

  myPublished: [
    { id: 'tdd-workflow', name: 'TDD 工作流', downloads: 156, rating: 4.8 },
  ],
  myFavorites: ['security-rules', 'comment-component', 'ci-workflow'],
};

// --- Navigation ---
function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const map = { 'index.html': 'browse', 'detail.html': 'browse', 'publish.html': 'publish', 'profile.html': 'profile' };
  return map[path] || 'browse';
}

function initNav() {
  const current = getCurrentPage();
  document.querySelectorAll('.nav-link[data-page]').forEach(el => {
    if (el.dataset.page === current) el.classList.add('active');
    el.addEventListener('click', () => {
      const pages = { browse: 'index.html', publish: 'publish.html', profile: 'profile.html' };
      const target = pages[el.dataset.page];
      if (target) window.location.href = target;
    });
  });
}

// --- Helpers ---
function renderStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return `<div class="rating">
    ${'<span class="star">★</span>'.repeat(full)}${'<span class="star empty">★</span>'.repeat(empty)}
    <span class="score">${rating}</span>
  </div>`;
}

function typeLabel(type) {
  const map = { process_template: '流程模板', skill: '技能包', role_definition: '角色定义', shared_rule: '共享规则', component: 'UI 组件', app: '应用作品' };
  return map[type] || type;
}

function typeBadgeClass(type) {
  const map = { process_template: 'badge-primary', skill: 'badge-warning', role_definition: 'badge-success', shared_rule: 'badge-primary', component: 'badge-warning', app: 'badge-success' };
  return map[type] || 'badge-primary';
}

document.addEventListener('DOMContentLoaded', () => { initNav(); });
