/* ----------------------------------------------------
   TECH TATTVA - Events View Renderer (No Poster Images)
   ---------------------------------------------------- */

window.EventsView = (function() {

  function renderEventsList(container, events) {
    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const pastEvents = events.filter(e => e.status === 'past');

    let html = `
      <section class="page-section">
        <div class="container">
          <div class="section-header">
            <h1 class="section-title">Events</h1>
            <p class="section-subtitle">Discover upcoming technical workshops, hackathons, and past club activities.</p>
          </div>

          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 800;">Upcoming Events</h2>
    `;

    if (upcomingEvents.length === 0) {
      html += `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 2rem; border-radius: var(--radius-md); text-align: center; color: var(--text-muted); margin-bottom: 3rem;">
          No upcoming events scheduled at the moment. Check back soon!
        </div>
      `;
    } else {
      html += `<div class="grid-3" style="margin-bottom: 4rem;">`;
      upcomingEvents.forEach(event => {
        html += createEventCardHtml(event);
      });
      html += `</div>`;
    }

    if (pastEvents.length > 0) {
      html += `
        <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 800; border-top: 1px solid var(--border-light); padding-top: 3rem;">Past Events</h2>
        <div class="grid-3">
      `;
      pastEvents.forEach(event => {
        html += createEventCardHtml(event);
      });
      html += `</div>`;
    }

    html += `
        </div>
      </section>
    `;

    container.innerHTML = html;
  }

  function createEventCardHtml(event) {
    const isUpcoming = event.status === 'upcoming';
    const badgeClass = isUpcoming ? 'upcoming' : 'past';
    const badgeLabel = isUpcoming ? 'Upcoming' : 'Completed';

    return `
      <article class="event-card">
        <div class="event-body">
          <span class="event-status-badge ${badgeClass}">${badgeLabel}</span>
          <h3 class="event-name">${event.title}</h3>
          <div class="event-meta">
            <div class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${event.date}</span>
            </div>
            <div class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${event.venue}</span>
            </div>
          </div>
          <p class="event-desc">${event.description}</p>
          <div class="event-footer">
            <a href="/events/${event.slug}" data-link class="btn btn-outline btn-sm" style="flex: 1;">View Details</a>
            ${isUpcoming && event.registrationLink ? `<a href="${event.registrationLink}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Register</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderEventDetail(container, events, slug) {
    const event = events.find(e => e.slug === slug);

    if (!event) {
      container.innerHTML = `
        <section class="page-section">
          <div class="container" style="text-align: center;">
            <h2>Event Not Found</h2>
            <p style="color: var(--text-muted); margin: 1rem 0 2rem 0;">The requested event could not be found.</p>
            <a href="/events" data-link class="btn btn-primary">Back to Events</a>
          </div>
        </section>
      `;
      return;
    }

    const isUpcoming = event.status === 'upcoming';

    container.innerHTML = `
      <section class="page-section">
        <div class="container">
          <a href="/events" data-link class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to All Events
          </a>

          <article class="event-detail">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <span class="event-status-badge ${isUpcoming ? 'upcoming' : 'past'}">
                ${isUpcoming ? 'Upcoming Event' : 'Past Event'}
              </span>
            </div>

            <h1 style="font-size: 2.2rem; font-weight: 800; line-height: 1.25; margin-bottom: 1.5rem;">${event.title}</h1>

            <div class="event-detail-meta-grid">
              <div class="meta-block">
                <span class="meta-label">Date</span>
                <span class="meta-value">${event.date}</span>
              </div>
              <div class="meta-block">
                <span class="meta-label">Time</span>
                <span class="meta-value">${event.time || 'TBA'}</span>
              </div>
              <div class="meta-block">
                <span class="meta-label">Venue</span>
                <span class="meta-value">${event.venue}</span>
              </div>
            </div>

            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">About This Event</h2>
            <div class="event-detail-content">
              <p>${event.description}</p>
            </div>

            ${isUpcoming && event.registrationLink ? `
              <div style="border-top: 1px solid var(--border-light); padding-top: 2rem; display: flex; justify-content: flex-end;">
                <a href="${event.registrationLink}" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1.05rem;">
                  Register Now
                </a>
              </div>
            ` : ''}
          </article>
        </div>
      </section>
    `;
  }

  return {
    renderList: renderEventsList,
    renderDetail: renderEventDetail,
    createCardHtml: createEventCardHtml
  };
})();
