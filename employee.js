App.renderDirectory = function() {
  const root = document.getElementById("pageRoot");
  root.innerHTML = this.heading("PEOPLE","Employee Directory","Search employees by name, ID, department, or job position.") + `
    <div class="toolbar"><div class="search-box"><input id="employeeSearch" placeholder="Search name, ID, or keyword (e.g. accountant)..." aria-label="Search employees"></div>
    <select id="departmentFilter" class="select-control"><option value="">All departments</option>${Object.keys(departmentCounts).map(d=>`<option>${d}</option>`).join("")}</select></div>
    <div id="employeeResults" class="employee-grid"></div>`;
  const draw = () => {
    const q = document.getElementById("employeeSearch").value.toLowerCase().trim();
    const dept = document.getElementById("departmentFilter").value;
    const results = employees.filter(e => e.role !== "Administrator" && (!dept || e.department===dept) &&
      [e.name,e.id,e.position,e.department,e.email].some(v=>v.toLowerCase().includes(q)));
    document.getElementById("employeeResults").innerHTML = results.length ? results.map(e=>`
      <article class="employee-card"><div class="employee-card-top"><div class="avatar">${this.initials(e.name)}</div><div><h3>${this.escape(e.name)}</h3><p>${this.escape(e.position)}</p></div></div>
      <div class="employee-details"><span>▤ &nbsp;${this.escape(e.department)}</span><span>✉ &nbsp;${this.escape(e.email)}</span><span><span class="tag">${e.id}</span></span></div></article>`).join("") : `<div class="empty-state"><strong>No employees found</strong>Try another name, employee ID, or job keyword.</div>`;
  };
  document.getElementById("employeeSearch").addEventListener("input",draw);
  document.getElementById("departmentFilter").addEventListener("change",draw);
  draw();
};
