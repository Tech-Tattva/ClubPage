/* ----------------------------------------------------
   TECH TATTVA - Clean SPA Vanilla Router
   ---------------------------------------------------- */

window.AppRouter = (function() {
  let routes = [];
  let currentPath = '';
  let notFoundHandler = null;

  function addRoute(pathPattern, handler) {
    routes.push({ pattern: pathPattern, handler: handler });
  }

  function setNotFoundHandler(handler) {
    notFoundHandler = handler;
  }

  function matchRoute(path) {
    // Clean trailing slash unless root
    const cleanPath = (path.length > 1 && path.endsWith('/')) ? path.slice(0, -1) : path;

    for (let r of routes) {
      if (r.pattern === cleanPath) {
        return { handler: r.handler, params: {} };
      }
      
      // Dynamic route matching, e.g. /events/:slug
      const patternParts = r.pattern.split('/');
      const pathParts = cleanPath.split('/');

      if (patternParts.length === pathParts.length) {
        let params = {};
        let isMatch = true;

        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].slice(1);
            params[paramName] = decodeURIComponent(pathParts[i]);
          } else if (patternParts[i] !== pathParts[i]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          return { handler: r.handler, params: params };
        }
      }
    }

    return null;
  }

  function navigateTo(url, pushState = true) {
    let path = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const u = new URL(url);
      path = u.pathname;
    }
    
    // Normalize root to /home
    if (path === '/' || path === '') {
      path = '/home';
    }

    if (pushState && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    currentPath = path;
    resolveRoute(path);
  }

  function resolveRoute(path) {
    const matched = matchRoute(path);
    if (matched) {
      matched.handler(matched.params);
    } else if (notFoundHandler) {
      notFoundHandler(path);
    } else {
      navigateTo('/home', false);
    }
    updateActiveNavLinks(path);
    window.scrollTo(0, 0);
  }

  function updateActiveNavLinks(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === path || (path.startsWith(href) && href !== '/home' && href !== '/'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function init() {
    window.addEventListener('popstate', () => {
      resolveRoute(window.location.pathname);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          navigateTo(href);
        }
      }
    });

    // Initial resolution
    const initialPath = window.location.pathname === '/' ? '/home' : window.location.pathname;
    resolveRoute(initialPath);
  }

  return {
    addRoute,
    setNotFoundHandler,
    navigateTo,
    init,
    getCurrentPath: () => currentPath
  };
})();
