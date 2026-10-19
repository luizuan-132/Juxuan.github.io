/* =========================================================
   网巡卫士 · 学习资料站 共享脚本
   ========================================================= */
(function () {
  'use strict';

  /* ---- 移动端菜单 ---- */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* ---- 当前页导航高亮 ---- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.menu a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === here || (here === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- 滚动高亮页内章节 ---- */
  var sections = document.querySelectorAll('section.block[id]');
  var anchorLinks = document.querySelectorAll('.anchor-nav a');
  if (sections.length && anchorLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    anchorLinks.forEach(function (a) {
      var id = (a.getAttribute('href') || '').slice(1);
      if (id) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchorLinks.forEach(function (a) { a.classList.remove('active'); });
        var link = map[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- 回到顶部 ---- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- 键盘快捷键：按 / 聚焦搜索（若存在） ---- */
  var search = document.getElementById('siteSearch');
  if (search) {
    var result = document.getElementById('searchResult');
    var items = [];
    document.querySelectorAll('[data-search]').forEach(function (el) {
      items.push({
        el: el,
        text: (el.getAttribute('data-search') || '').toLowerCase()
      });
    });
    function runSearch() {
      var q = search.value.trim().toLowerCase();
      items.forEach(function (it) { it.el.style.display = ''; });
      if (result) {
        if (!q) { result.textContent = ''; return; }
        var hit = 0;
        items.forEach(function (it) {
          if (it.text.indexOf(q) === -1) { it.el.style.display = 'none'; }
          else { hit++; }
        });
        result.textContent = hit ? ('找到 ' + hit + ' 个匹配项') : '没有匹配项';
      }
    }
    search.addEventListener('input', runSearch);
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault(); search.focus();
      }
      if (e.key === 'Escape') { search.value = ''; runSearch(); search.blur(); }
    });
  }
})();
