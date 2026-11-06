App.renderProfile = function() {
  const root = document.getElementById("pageRoot"), u = this.currentUser;
  root.innerHTML = this.heading("ACCOUNT","My Profile","View and update your employee information.") + `
    <div class="profile-layout"><section class="panel profile-card"><div class="profile-big">${this.initials(u.name)}</div><h2>${this.escape(u.name)}</h2><p>${this.escape(u.position)}</p><span class="tag">${u.id}</span><div class="meta">${this.escape(u.department)}</div></section>
    <section class="panel"><div class="panel-header"><div><h2>Personal information</h2><p>Keep your contact details up to date.</p></div></div>
      <form id="profileForm" class="form-grid">
        <div class="field"><label>Full name</label><input name="name" value="${this.escape(u.name)}" required></div>
        <div class="field"><label>Email address</label><input name="email" type="email" value="${this.escape(u.email)}" required></div>
        <div class="field"><label>Phone number</label><input name="phone" value="${this.escape(u.phone)}"></div>
        <div class="field"><label>Work location</label><input name="location" value="${this.escape(u.location)}"></div>
        <div class="field full"><button class="primary-button">Save changes</button></div>
      </form>
    </section></div>`;
  document.getElementById("profileForm").addEventListener("submit",e=>{
    e.preventDefault();const f=new FormData(e.target);
    ["name","email","phone","location"].forEach(k=>u[k]=f.get(k));
    const index=employees.findIndex(x=>x.id===u.id);employees[index]=u;
    sessionStorage.setItem("currentEmployee",JSON.stringify(u));
    document.getElementById("topAvatar").textContent=this.initials(u.name);
    this.renderProfile();
    const note=document.createElement("div");note.className="notice";note.textContent="Profile changes saved for this demo session.";root.prepend(note);
  });
};
