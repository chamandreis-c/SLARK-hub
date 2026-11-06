window.App = {
  currentUser: null,
  currentPage: "dashboard",
  announcements: [
    {title:"Welcome to SLARK Hub", body:"Our employee portal is now available. Explore the directory and keep your profile updated.", date:"November 5, 2026", author:"Human Resources"},
    {title:"Monthly Department Meeting", body:"Department meetings will be held during the second week of this month. Please check with your manager for the schedule.", date:"November 3, 2026", author:"Administration"},
    {title:"System Maintenance Notice", body:"A short maintenance window is planned this weekend. Save your work before signing out.", date:"October 30, 2026", author:"IT Department"}
  ],
  tickets: [],
  init() {
    // One-time reset for the zero-employee release. This removes test accounts
    // left by the previous version so the first new registration starts at EMP001.
    const dataVersion = "connectHub-zero-employees-v2";
    if (localStorage.getItem("connectHubDataVersion") !== dataVersion) {
      localStorage.removeItem("registeredEmployees");
      localStorage.removeItem("registeredPasswords");
      sessionStorage.removeItem("currentEmployee");
      localStorage.setItem("connectHubDataVersion", dataVersion);
    }
    this.loadRegisteredEmployees();
    this.ensureAdministratorAccount();
    this.bindNavigation();
    this.bindGlobalActions();
    const saved = sessionStorage.getItem("currentEmployee");
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.showApp();
    }
  },
  bindNavigation() {
    document.getElementById("mainNav").addEventListener("click", e => {
      const button = e.target.closest("[data-page]");
      if (button) this.navigate(button.dataset.page);
    });
    document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => this.navigate(b.dataset.go)));
    document.getElementById("mobileMenu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  },
  ensureAdministratorAccount() {
    // Seed a built-in administrator account without changing existing employee IDs.
    const adminId = "ADMIN001";
    let admin = employees.find(person => person.id === adminId);
    if (!admin) {
      admin = {
        id: adminId,
        name: "System Administrator",
        position: "Administrator",
        department: "IT",
        email: "admin@connecthub.local",
        phone: "Not provided",
        location: "Not specified",
        role: "Administrator",
        registeredAccount: true
      };
      employees.push(admin);
      this.saveRegisteredEmployees();
    } else {
      // Keep the administrator's access role even if the record was edited.
      admin.role = "Administrator";
      admin.registeredAccount = true;
      this.saveRegisteredEmployees();
    }

    const passwords = JSON.parse(localStorage.getItem("registeredPasswords") || "{}");
    if (!passwords[adminId]) {
      passwords[adminId] = "Admin@123";
      localStorage.setItem("registeredPasswords", JSON.stringify(passwords));
    }
  },
  loadRegisteredEmployees() {
    try {
      const registered = JSON.parse(localStorage.getItem("registeredEmployees") || "[]");
      registered.forEach(person => {
        if (!employees.some(existing => existing.id === person.id)) employees.push(person);
      });
    } catch (error) {
      console.warn("Could not load registered employee accounts.", error);
    }
  },
  saveRegisteredEmployees() {
    const registered = employees.filter(person => person.registeredAccount);
    localStorage.setItem("registeredEmployees", JSON.stringify(registered));
  },
  bindGlobalActions() {
    document.getElementById("showRegister").addEventListener("click", () => this.showAuthForm("register"));
    document.getElementById("showLogin").addEventListener("click", () => this.showAuthForm("login"));
    document.getElementById("logoutButton").addEventListener("click", () => {
      sessionStorage.removeItem("currentEmployee");
      this.currentUser = null;
      document.getElementById("app").classList.add("hidden");
      document.getElementById("loginScreen").classList.remove("hidden");
      this.showAuthForm("login");
    });
  },
  showAuthForm(form) {
    document.getElementById("loginForm").classList.toggle("hidden", form !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", form !== "register");
    document.getElementById("loginError").textContent = "";
    document.getElementById("registerError").textContent = "";
  },
  showApp() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("topAvatar").textContent = this.initials(this.currentUser.name);
    document.querySelectorAll(".admin-only").forEach(el => el.classList.toggle("hidden", this.currentUser.role !== "Administrator"));
    this.navigate("dashboard");
  },
  navigate(page) {
    if (page === "admin" && this.currentUser.role !== "Administrator") page = "dashboard";
    this.currentPage = page;
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
    document.getElementById("pageCrumb").textContent = ({
      dashboard:"Dashboard",directory:"Employee Directory",departments:"Departments",
      announcements:"Announcements",profile:"My Profile",admin:"Administrator Dashboard"
    })[page] || "Dashboard";
    document.querySelector(".sidebar").classList.remove("open");
    const renderers = {
      dashboard: this.renderDashboard, directory: this.renderDirectory,
      departments: this.renderDepartments, announcements: this.renderAnnouncements,
      profile: this.renderProfile, admin: this.renderAdmin
    };
    renderers[page].call(this);
  },
  initials(name) { return name.split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase(); },
  heading(kicker,title,desc,action="") {
    return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
  },
  renderDashboard() {
    const root = document.getElementById("pageRoot");
    root.innerHTML = this.heading("OVERVIEW","Good day, "+this.currentUser.name.split(" ")[0]+" 👋","Here is what's happening across your organization.") + `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-top">Total employees <span class="stat-icon">♙</span></div><div class="stat-number">${employees.filter(person => person.role !== "Administrator").length}</div><div class="stat-note">Registered employee accounts</div></div>
        <div class="stat-card"><div class="stat-top">Departments <span class="stat-icon">▤</span></div><div class="stat-number">8</div><div class="stat-note">Company-wide teams</div></div>
        <div class="stat-card"><div class="stat-top">Announcements <span class="stat-icon">◉</span></div><div class="stat-number">${this.announcements.length}</div><div class="stat-note">Latest company updates</div></div>
        <div class="stat-card"><div class="stat-top">My department <span class="stat-icon">⌂</span></div><div class="stat-number" style="font-size:18px">${this.currentUser.department}</div><div class="stat-note">Your assigned team</div></div>
      </div>
      <div class="content-grid">
        <section class="panel"><div class="panel-header"><div><h2>Latest announcements</h2><p>Important updates from your organization</p></div><button class="link-button" data-shortcut="announcements">View all →</button></div>
        ${this.announcements.slice(0,3).map(a=>`<article class="announcement-item"><h3>${this.escape(a.title)}</h3><p>${this.escape(a.body)}</p><div class="meta">${a.author} · ${a.date}</div></article>`).join("")}</section>
        <section class="panel"><div class="panel-header"><div><h2>Quick access</h2><p>Go to a frequently used section</p></div></div>
          ${[["directory","♙","Find an employee"],["departments","▤","Explore departments"],["profile","◎","Update my profile"]].map(x=>`<div class="activity-row"><div class="stat-icon">${x[1]}</div><div style="flex:1"><strong>${x[2]}</strong><small>Open ${x[2].toLowerCase()}</small></div><button class="link-button" data-shortcut="${x[0]}">Open →</button></div>`).join("")}
        </section>
      </div>`;
    root.querySelectorAll("[data-shortcut]").forEach(b=>b.addEventListener("click",()=>this.navigate(b.dataset.shortcut)));
  },
  escape(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
};
document.addEventListener("DOMContentLoaded", () => App.init());
