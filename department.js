App.renderDepartments = function() {
  const root = document.getElementById("pageRoot");
  const total = employees.length;
  const counts = Object.fromEntries(Object.keys(departmentCounts).map(name => [name, employees.filter(person => person.department === name).length]));
  root.innerHTML = this.heading("ORGANIZATION","Departments","Explore teams and see how employees are distributed.") + `
    <div class="department-grid">${Object.entries(counts).map(([name,count],i)=>`
      <article class="department-card"><div class="stat-icon">${["♧","＄","⌘","✧","↗","▦","§","☏"][i]}</div><h3>${name}</h3><p>${count} employees</p><div class="progress"><span style="width:${total ? count/total*100 : 0}%"></span></div><div class="meta">${(total ? count/total*100 : 0).toFixed(0)}% of workforce</div></article>`).join("")}</div>`;
};
