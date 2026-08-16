/* ----------------------------------------------------
   TECH TATTVA - Main Application Orchestrator
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', async () => {
  let siteData = {};
  let eventsData = [];
  let announcementsData = [];

  const appMount = document.getElementById('app-mount');

  // Load JSON Data
  try {
    const [siteRes, eventsRes, annRes] = await Promise.all([
      fetch('/data/site.json'),
      fetch('/data/events.json'),
      fetch('/data/announcements.json')
    ]);

    siteData = await siteRes.json();
    eventsData = await eventsRes.json();
    announcementsData = await annRes.json();
  } catch (err) {
    console.error('Error fetching club data:', err);
  }

  // Render Header and Footer
  renderHeader(siteData);
  renderFooter(siteData);

  // Setup Mobile Nav Toggle
  setupMobileNav();

  // Define Routes
  window.AppRouter.addRoute('/home', () => {
    renderHomeView(appMount, siteData, eventsData, announcementsData);
  });

  window.AppRouter.addRoute('/events', () => {
    window.EventsView.renderList(appMount, eventsData);
  });

  window.AppRouter.addRoute('/events/:slug', (params) => {
    window.EventsView.renderDetail(appMount, eventsData, params.slug);
  });

  window.AppRouter.addRoute('/announcements', () => {
    window.AnnouncementsView.renderList(appMount, announcementsData);
  });

  window.AppRouter.addRoute('/announcements/:slug', (params) => {
    window.AnnouncementsView.renderDetail(appMount, announcementsData, params.slug);
  });

  window.AppRouter.addRoute('/about', () => {
    renderAboutView(appMount, siteData);
  });

  window.AppRouter.addRoute('/admin', () => {
    window.AdminView.renderAdmin(appMount, eventsData, announcementsData);
  });

  // 404 Route Handler
  window.AppRouter.setNotFoundHandler(() => {
    render404View(appMount);
  });

  // Initialize Router
  window.AppRouter.init();
});

function renderHeader(site) {
  const headerEl = document.getElementById('site-header-container');
  if (!headerEl) return;

  headerEl.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="/home" data-link class="brand-link">
          <img src="/assets/logo/tech_tattva_logo.jpg" alt="Tech Tattva Logo" class="brand-logo" />
          <div class="brand-title">
            <span class="brand-name">TECH TATTVA</span>
            <span class="brand-sub">Technical Club @ KMCE</span>
          </div>
        </a>

        <button class="mobile-toggle" id="mobileNavBtn" aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <nav>
          <ul class="nav-links" id="navLinks">
            <li><a href="/home" data-link class="nav-link">Home</a></li>
            <li><a href="/events" data-link class="nav-link">Events</a></li>
            <li><a href="/announcements" data-link class="nav-link">Announcements</a></li>
            <li><a href="/about" data-link class="nav-link">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter(site) {
  const footerEl = document.getElementById('site-footer-container');
  if (!footerEl) return;

  const social = site.socialLinks || {};

  footerEl.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <img src="/assets/logo/tech_tattva_logo.jpg" alt="Tech Tattva Logo" class="footer-logo" />
          <div>
            <div style="font-weight: 800; letter-spacing: 0.05em;">TECH TATTVA</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Technical Club @ KMCE</div>
          </div>
        </div>

        <ul class="social-links">
          ${social.github ? `<li><a href="${social.github}" target="_blank" rel="noopener" class="social-link">GitHub</a></li>` : ''}
          ${social.instagram ? `<li><a href="${social.instagram}" target="_blank" rel="noopener" class="social-link">Instagram</a></li>` : ''}
          ${social.linkedin ? `<li><a href="${social.linkedin}" target="_blank" rel="noopener" class="social-link">LinkedIn</a></li>` : ''}
          ${social.email ? `<li><a href="mailto:${social.email}" class="social-link">Contact</a></li>` : ''}
        </ul>

        <div class="footer-copy">
          &copy; ${new Date().getFullYear()} Tech Tattva - KMCE Technical Club. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}

function setupMobileNav() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('#mobileNavBtn');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
      links.classList.toggle('open');
    } else if (links && links.classList.contains('open') && !e.target.closest('.nav-links')) {
      links.classList.remove('open');
    }
  });
}

function renderHomeView(container, site, events, announcements) {
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const latestAnnouncements = announcements.slice(0, 3);

  let html = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <img src="/assets/logo/tech_tattva_logo.jpg" alt="Tech Tattva Logo" class="hero-logo" />
        <h1 class="hero-title">TECH TATTVA</h1>
        <div class="hero-subtitle">Technical Club @ KMCE</div>
        <p class="hero-tagline">Learn. Build. Innovate.</p>
        <div class="hero-actions">
          <a href="/events" data-link class="btn btn-primary" style="padding: 0.8rem 1.75rem;">Explore Events</a>
          <a href="/about" data-link class="btn btn-outline" style="padding: 0.8rem 1.75rem;">About Us</a>
        </div>
      </div>
    </section>

    <!-- Upcoming Events Section -->
    <section class="page-section">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
          <div>
            <h2 class="section-title">Upcoming Events</h2>
            <p class="section-subtitle">Participate in our latest technical workshops and hackathons.</p>
          </div>
          <a href="/events" data-link class="btn btn-outline btn-sm">View All &rarr;</a>
        </div>

        <div class="grid-3">
  `;

  if (upcomingEvents.length === 0) {
    html += `
      <div style="grid-column: 1/-1; background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 2rem; border-radius: var(--radius-md); text-align: center; color: var(--text-muted);">
        No upcoming events scheduled right now. Check back soon!
      </div>
    `;
  } else {
    upcomingEvents.forEach(event => {
      html += window.EventsView.createCardHtml(event);
    });
  }

  html += `
        </div>
      </div>
    </section>

    <!-- Latest Announcements Section -->
    <section class="page-section" style="background-color: var(--bg-subtle); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
      <div class="container" style="max-width: 900px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
          <div>
            <h2 class="section-title">Latest Announcements</h2>
            <p class="section-subtitle">Official news and updates from Tech Tattva.</p>
          </div>
          <a href="/announcements" data-link class="btn btn-outline btn-sm">All Updates &rarr;</a>
        </div>

        <div class="announcements-list">
  `;

  if (latestAnnouncements.length === 0) {
    html += `
      <div style="background: var(--bg-card); border: 1px solid var(--border-light); padding: 2rem; border-radius: var(--radius-md); text-align: center; color: var(--text-muted);">
        No announcements available.
      </div>
    `;
  } else {
    latestAnnouncements.forEach(item => {
      html += window.AnnouncementsView.createItemHtml(item);
    });
  }

  html += `
        </div>
      </div>
    </section>

    <!-- Short About Section -->
    <section class="page-section">
      <div class="container" style="max-width: 850px; text-align: center;">
        <h2 class="section-title">About Tech Tattva</h2>
        <p style="font-size: 1.15rem; color: var(--text-secondary); margin: 1.25rem 0 2rem 0; line-height: 1.8;">
          ${site.aboutShort || 'Tech Tattva is the official technical club of KMCE.'}
        </p>
        <a href="/about" data-link class="btn btn-outline">Read Full About Club</a>
      </div>
    </section>
  `;

  container.innerHTML = html;
}

function renderAboutView(container, site) {
  const activities = site.activities || [];

  container.innerHTML = `
    <section class="page-section">
      <div class="container" style="max-width: 900px;">
        <div class="section-header">
          <h1 class="section-title">About Tech Tattva</h1>
          <p class="section-subtitle">Official Technical Club @ KMCE</p>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2.5rem; margin-bottom: 3rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem;">Who We Are</h2>
          <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.8;">
            ${site.aboutFull || 'Tech Tattva is the premier student-led technical club at KMCE.'}
          </p>
        </div>

        <h2 class="section-title" style="font-size: 1.6rem; margin-bottom: 0.5rem;">Our General Activities</h2>
        <p style="color: var(--text-muted);">What members and participants engage in at Tech Tattva:</p>

        <div class="activities-grid">
          ${activities.map(act => `
            <div class="activity-card">
              <h3 class="activity-title">${act.title}</h3>
              <p class="activity-desc">${act.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function render404View(container) {
  container.innerHTML = `
    <section class="page-section" style="padding: 6rem 0; text-align: center;">
      <div class="container" style="max-width: 550px;">
        <div style="font-size: 5rem; font-weight: 900; letter-spacing: -0.05em; color: var(--text-primary); line-height: 1;">404</div>
        <h1 style="font-size: 1.75rem; font-weight: 800; margin: 1rem 0 0.5rem 0;">Page Not Found</h1>
        <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 2rem;">
          The page you are looking for does not exist or has been moved.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="/home" data-link class="btn btn-primary" style="padding: 0.75rem 1.75rem;">Back to Home</a>
          <a href="/events" data-link class="btn btn-outline" style="padding: 0.75rem 1.75rem;">View Events</a>
        </div>
      </div>
    </section>
  `;
}

