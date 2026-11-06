App.renderAdmin = function() {
  const root = document.getElementById("pageRoot");
  if(this.currentUser.role!=="Administrator"){this.navigate("dashboard");return;}
  root.innerHTML = this.heading("SYSTEM MANAGEMENT","Administrator Dashboard","A quick overview of employees and company activity.") + `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-top">Total accounts <span class="stat-icon">♙</span></div><div class="stat-number">${employees.filter(person => person.role !== "Administrator").length}</div><div class="stat-note">Employee records</div></div>
      <div class="stat-card"><div class="stat-top">Departments <span class="stat-icon">▤</span></div><div class="stat-number">8</div><div class="stat-note">Active departments</div></div>
      <div class="stat-card"><div class="stat-top">Announcements <span class="stat-icon">◉</span></div><div class="stat-number">${this.announcements.length}</div><div class="stat-note">Published notices</div></div>
      <div class="stat-card"><div class="stat-top">Help requests <span class="stat-icon">✉</span></div><div class="stat-number">${this.tickets.length}</div><div class="stat-note">Submitted this session</div></div>
    </div>
    <section class="panel"><div class="panel-header"><div><h2>Employee account overview</h2><p>Registered employee accounts.</p></div><button class="link-button" id="adminDirectory">Open directory →</button></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Employee</th><th>Employee ID</th><th>Department</th><th>Position</th></tr></thead><tbody>${employees.filter(e=>e.role !== "Administrator").slice(0,12).map(e=>`<tr><td><div class="person-cell"><div class="avatar">${this.initials(e.name)}</div><div><strong>${this.escape(e.name)}</strong><small>${this.escape(e.email)}</small></div></div></td><td>${e.id}</td><td>${this.escape(e.department)}</td><td>${this.escape(e.position)}</td></tr>`).join("")}</tbody></table></div>${employees.some(e=>e.role !== "Administrator") ? "" : "<div class=\"empty-state\"><strong>No employee accounts yet</strong>Employees will appear here after they register.</div>"}</section>`;
  document.getElementById("adminDirectory").addEventListener("click",()=>this.navigate("directory"));
};
