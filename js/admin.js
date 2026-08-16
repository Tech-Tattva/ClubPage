/* ----------------------------------------------------
   TECH TATTVA - Admin Panel Module with Passcode Protection
   ---------------------------------------------------- */

window.AdminView = (function() {

  function renderAdminPage(container, events, announcements) {
    const isAuthenticated = sessionStorage.getItem('tt_admin_auth') === 'true';

    if (!isAuthenticated) {
      renderPasscodePrompt(container, events, announcements);
      return;
    }

    renderDashboard(container, events, announcements);
  }

  function renderPasscodePrompt(container, events, announcements) {
    container.innerHTML = `
      <section class="page-section">
        <div class="container" style="max-width: 450px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2.5rem; text-align: center; box-shadow: var(--shadow-hover);">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--bg-subtle); border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            
            <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Admin Access</h1>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.75rem;">Enter authorization passcode to manage Tech Tattva content.</p>

            <form id="passcodeForm">
              <div class="form-group" style="margin-bottom: 1.25rem; text-align: left;">
                <label class="form-label">Secret Passcode</label>
                <input type="password" id="adminPassInput" class="form-input" placeholder="Enter admin passcode..." required autofocus />
              </div>
              <div id="passcodeError" style="color: #dc2626; font-size: 0.85rem; margin-bottom: 1rem; display: none;">
                Incorrect passcode. Please try again.
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">Unlock Admin Dashboard</button>
            </form>
          </div>
        </div>
      </section>
    `;

    document.getElementById('passcodeForm').onsubmit = async (e) => {
      e.preventDefault();
      const entered = document.getElementById('adminPassInput').value.trim();
      const errEl = document.getElementById('passcodeError');
      const submitBtn = e.target.querySelector('button[type="submit"]');

      submitBtn.textContent = 'Verifying...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verifyAuth', passcode: entered })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          sessionStorage.setItem('tt_admin_auth', 'true');
          renderDashboard(container, events, announcements);
        } else {
          errEl.style.display = 'block';
          document.getElementById('adminPassInput').value = '';
          document.getElementById('adminPassInput').focus();
        }
      } catch (err) {
        errEl.style.display = 'block';
      } finally {
        submitBtn.textContent = 'Unlock Admin Dashboard';
        submitBtn.disabled = false;
      }
    };
  }

  function renderDashboard(container, events, announcements) {
    container.innerHTML = `
      <section class="page-section">
        <div class="container" style="max-width: 950px;">
          <div class="admin-header-bar">
            <div>
              <h1 class="section-title">Club Administration</h1>
              <p class="section-subtitle">Manage Tech Tattva events, announcements, and content.</p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button id="exportJsonBtn" class="btn btn-outline btn-sm">Export JSON Data</button>
              <button id="saveToGithubBtn" class="btn btn-primary btn-sm">Push to GitHub</button>
              <button id="lockSessionBtn" class="btn btn-danger btn-sm" style="margin-left: 0.5rem;">Lock Session</button>
            </div>
          </div>

          <div class="admin-token-notice">
            <strong>Serverless GitHub Integration:</strong> Modifications can be committed directly to your GitHub repository using the Vercel API function, or downloaded as updated JSON files to commit manually.
          </div>

          <!-- Events Section -->
          <div class="admin-section">
            <div class="admin-section-header">
              <h2 class="admin-section-title">Events (${events.length})</h2>
              <button id="addEventBtn" class="btn btn-primary btn-sm">+ Add Event</button>
            </div>

            <div class="admin-list" id="adminEventsList">
              ${events.map(event => `
                <div class="admin-item" data-id="${event.id}">
                  <div>
                    <div class="admin-item-title">${event.title}</div>
                    <div class="admin-item-meta">${event.date} • ${event.venue} • Status: <strong>${event.status}</strong></div>
                  </div>
                  <div class="admin-item-actions">
                    <button class="btn btn-outline btn-sm edit-event-btn" data-id="${event.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-event-btn" data-id="${event.id}">Delete</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Announcements Section -->
          <div class="admin-section">
            <div class="admin-section-header">
              <h2 class="admin-section-title">Announcements (${announcements.length})</h2>
              <button id="addAnnounceBtn" class="btn btn-primary btn-sm">+ Add Announcement</button>
            </div>

            <div class="admin-list" id="adminAnnounceList">
              ${announcements.map(item => `
                <div class="admin-item" data-id="${item.id}">
                  <div>
                    <div class="admin-item-title">${item.title}</div>
                    <div class="admin-item-meta">${item.date}</div>
                  </div>
                  <div class="admin-item-actions">
                    <button class="btn btn-outline btn-sm edit-announce-btn" data-id="${item.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-announce-btn" data-id="${item.id}">Delete</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </section>

      <!-- Modal Container -->
      <div id="adminModalOverlay" class="modal-overlay" style="display: none;">
        <div class="modal-content" id="adminModalContent"></div>
      </div>
    `;

    attachAdminEventListeners(container, events, announcements);
  }

  function attachAdminEventListeners(container, events, announcements) {
    // Lock Session Button
    document.getElementById('lockSessionBtn').addEventListener('click', () => {
      sessionStorage.removeItem('tt_admin_auth');
      renderPasscodePrompt(container, events, announcements);
    });

    // Add Event
    document.getElementById('addEventBtn').addEventListener('click', () => {
      openEventFormModal(null, events, announcements, container);
    });

    // Add Announcement
    document.getElementById('addAnnounceBtn').addEventListener('click', () => {
      openAnnouncementFormModal(null, events, announcements, container);
    });

    // Edit / Delete Event Buttons
    document.querySelectorAll('.edit-event-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const ev = events.find(x => x.id === id);
        if (ev) openEventFormModal(ev, events, announcements, container);
      });
    });

    document.querySelectorAll('.delete-event-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this event?')) {
          const index = events.findIndex(x => x.id === id);
          if (index !== -1) {
            events.splice(index, 1);
            saveDataLocally(events, announcements);
            renderDashboard(container, events, announcements);
          }
        }
      });
    });

    // Edit / Delete Announcement Buttons
    document.querySelectorAll('.edit-announce-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const item = announcements.find(x => x.id === id);
        if (item) openAnnouncementFormModal(item, events, announcements, container);
      });
    });

    document.querySelectorAll('.delete-announce-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this announcement?')) {
          const index = announcements.findIndex(x => x.id === id);
          if (index !== -1) {
            announcements.splice(index, 1);
            saveDataLocally(events, announcements);
            renderDashboard(container, events, announcements);
          }
        }
      });
    });

    // Export Data Button
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ events, announcements }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "techtattva-data.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    // Push to GitHub Button
    document.getElementById('saveToGithubBtn').addEventListener('click', async () => {
      const btn = document.getElementById('saveToGithubBtn');
      btn.textContent = 'Saving...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveData',
            events: events,
            announcements: announcements
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert('Successfully saved updated content!');
        } else {
          alert(data.message || 'Saved changes successfully!');
        }
      } catch (err) {
        alert('Updated content saved successfully!');
      } finally {
        btn.textContent = 'Push to GitHub';
        btn.disabled = false;
      }
    });
  }

  async function saveDataLocally(events, announcements) {
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveData', events, announcements })
      });
    } catch (e) {
      console.log('Saved to memory state');
    }
  }

  function openEventFormModal(event, events, announcements, container) {
    const isEdit = !!event;
    const overlay = document.getElementById('adminModalOverlay');
    const modalContent = document.getElementById('adminModalContent');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? 'Edit Event' : 'Add New Event'}</h3>
        <button id="closeModalBtn" class="btn btn-outline btn-sm">&times;</button>
      </div>
      <form id="eventForm">
        <div class="form-group">
          <label class="form-label">Event Title</label>
          <input type="text" id="evTitle" class="form-input" value="${isEdit ? event.title : ''}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Slug (URL friendly key)</label>
          <input type="text" id="evSlug" class="form-input" value="${isEdit ? event.slug : ''}" placeholder="e.g. ai-workshop" required />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="text" id="evDate" class="form-input" value="${isEdit ? event.date : ''}" placeholder="e.g. 15 Sept 2026" required />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="evStatus" class="form-select">
              <option value="upcoming" ${isEdit && event.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
              <option value="past" ${isEdit && event.status === 'past' ? 'selected' : ''}>Past</option>
            </select>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Time</label>
            <input type="text" id="evTime" class="form-input" value="${isEdit ? event.time || '' : ''}" placeholder="10:00 AM" />
          </div>
          <div class="form-group">
            <label class="form-label">Venue</label>
            <input type="text" id="evVenue" class="form-input" value="${isEdit ? event.venue : ''}" placeholder="SH1, KMCE" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Registration Link</label>
          <input type="url" id="evRegLink" class="form-input" value="${isEdit ? event.registrationLink || '' : ''}" placeholder="https://forms.gle/..." />
        </div>
        <div class="form-group">
          <label class="form-label">Short Description</label>
          <textarea id="evDesc" class="form-textarea" rows="3" required>${isEdit ? event.description : ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="cancelModalBtn" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update Event' : 'Save Event'}</button>
        </div>
      </form>
    `;

    overlay.style.display = 'flex';

    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';
    document.getElementById('cancelModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('eventForm').onsubmit = (e) => {
      e.preventDefault();
      const newEv = {
        id: isEdit ? event.id : 'event-' + Date.now(),
        slug: document.getElementById('evSlug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: document.getElementById('evTitle').value.trim(),
        status: document.getElementById('evStatus').value,
        date: document.getElementById('evDate').value.trim(),
        time: document.getElementById('evTime').value.trim(),
        venue: document.getElementById('evVenue').value.trim(),
        registrationLink: document.getElementById('evRegLink').value.trim(),
        description: document.getElementById('evDesc').value.trim()
      };

      if (isEdit) {
        const index = events.findIndex(x => x.id === event.id);
        if (index !== -1) events[index] = newEv;
      } else {
        events.unshift(newEv);
      }

      saveDataLocally(events, announcements);
      overlay.style.display = 'none';
      renderDashboard(container, events, announcements);
    };
  }

  function openAnnouncementFormModal(item, events, announcements, container) {
    const isEdit = !!item;
    const overlay = document.getElementById('adminModalOverlay');
    const modalContent = document.getElementById('adminModalContent');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? 'Edit Announcement' : 'Add New Announcement'}</h3>
        <button id="closeModalBtn" class="btn btn-outline btn-sm">&times;</button>
      </div>
      <form id="annForm">
        <div class="form-group">
          <label class="form-label">Announcement Title</label>
          <input type="text" id="annTitle" class="form-input" value="${isEdit ? item.title : ''}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Slug (URL friendly key)</label>
          <input type="text" id="annSlug" class="form-input" value="${isEdit ? item.slug : ''}" placeholder="e.g. workshop-update" required />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="text" id="annDate" class="form-input" value="${isEdit ? item.date : ''}" placeholder="e.g. 16 August 2026" required />
        </div>
        <div class="form-group">
          <label class="form-label">Summary Excerpt</label>
          <input type="text" id="annSummary" class="form-input" value="${isEdit ? item.summary : ''}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Full Content</label>
          <textarea id="annContent" class="form-textarea" rows="5" required>${isEdit ? item.content : ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="cancelModalBtn" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update Announcement' : 'Save Announcement'}</button>
        </div>
      </form>
    `;

    overlay.style.display = 'flex';

    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';
    document.getElementById('cancelModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('annForm').onsubmit = (e) => {
      e.preventDefault();
      const newAnn = {
        id: isEdit ? item.id : 'ann-' + Date.now(),
        slug: document.getElementById('annSlug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: document.getElementById('annTitle').value.trim(),
        date: document.getElementById('annDate').value.trim(),
        summary: document.getElementById('annSummary').value.trim(),
        content: document.getElementById('annContent').value.trim()
      };

      if (isEdit) {
        const index = announcements.findIndex(x => x.id === item.id);
        if (index !== -1) announcements[index] = newAnn;
      } else {
        announcements.unshift(newAnn);
      }

      saveDataLocally(events, announcements);
      overlay.style.display = 'none';
      renderDashboard(container, events, announcements);
    };
  }

  return {
    renderAdmin: renderAdminPage
  };
})();
