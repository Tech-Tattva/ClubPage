/* ----------------------------------------------------
   TECH TATTVA - Announcements View Renderer
   ---------------------------------------------------- */

window.AnnouncementsView = (function() {

  function renderList(container, announcements) {
    let html = `
      <section class="page-section">
        <div class="container" style="max-width: 850px;">
          <div class="section-header">
            <h1 class="section-title">Announcements</h1>
            <p class="section-subtitle">Stay updated with official news, updates, and notices from Tech Tattva KMCE.</p>
          </div>

          <div class="announcements-list">
    `;

    if (!announcements || announcements.length === 0) {
      html += `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 2rem; border-radius: var(--radius-md); text-align: center; color: var(--text-muted);">
          No announcements available right now.
        </div>
      `;
    } else {
      announcements.forEach(item => {
        html += createAnnouncementItemHtml(item);
      });
    }

    html += `
          </div>
        </div>
      </section>
    `;

    container.innerHTML = html;
  }

  function createAnnouncementItemHtml(item) {
    return `
      <article class="announcement-item">
        <div class="announcement-date">${item.date}</div>
        <h2 class="announcement-title">
          <a href="/announcements/${item.slug}" data-link style="color: inherit;">${item.title}</a>
        </h2>
        <p class="announcement-summary">${item.summary || item.content}</p>
        <div>
          <a href="/announcements/${item.slug}" data-link class="btn btn-outline btn-sm">Read Full Notice &rarr;</a>
        </div>
      </article>
    `;
  }

  function renderDetail(container, announcements, slug) {
    const item = announcements.find(a => a.slug === slug);

    if (!item) {
      container.innerHTML = `
        <section class="page-section">
          <div class="container" style="text-align: center;">
            <h2>Announcement Not Found</h2>
            <p style="color: var(--text-muted); margin: 1rem 0 2rem 0;">The requested announcement could not be found.</p>
            <a href="/announcements" data-link class="btn btn-primary">Back to Announcements</a>
          </div>
        </section>
      `;
      return;
    }

    container.innerHTML = `
      <section class="page-section">
        <div class="container" style="max-width: 800px;">
          <a href="/announcements" data-link class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to All Announcements
          </a>

          <article style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2.5rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
              ${item.date}
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; line-height: 1.3; margin-bottom: 1.5rem; color: var(--text-primary);">${item.title}</h1>
            <div style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.8; border-top: 1px solid var(--border-light); padding-top: 1.5rem;">
              <p>${item.content.replace(/\n/g, '<br/><br/>')}</p>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  return {
    renderList: renderList,
    renderDetail: renderDetail,
    createItemHtml: createAnnouncementItemHtml
  };
})();
