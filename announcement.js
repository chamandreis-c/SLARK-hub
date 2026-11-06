App.renderAnnouncements = function() {
  const root = document.getElementById("pageRoot");
  const canPost = this.currentUser.role === "Administrator";
  root.innerHTML = this.heading("COMPANY UPDATES","Announcements","Stay informed about news, events, and important notices.",canPost?'<button id="newAnnouncement" class="primary-button">＋ New announcement</button>':"") + `
    <div id="announcementFormSlot"></div><div class="panel">${this.announcements.map(a=>`<article class="announcement-item"><h3>${this.escape(a.title)}</h3><p>${this.escape(a.body)}</p><div class="meta">Posted by ${this.escape(a.author)} · ${a.date}</div></article>`).join("")}</div>`;
  if(canPost) document.getElementById("newAnnouncement").addEventListener("click",()=>{
    document.getElementById("announcementFormSlot").innerHTML=`<form id="announcementForm" class="panel form-panel"><div class="field"><label>Announcement title</label><input name="title" required></div><div class="field" style="margin-top:12px"><label>Message</label><textarea name="body" required></textarea></div><button class="primary-button" style="margin-top:14px">Publish</button></form>`;
    document.getElementById("announcementForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);this.announcements.unshift({title:f.get("title"),body:f.get("body"),author:this.currentUser.name,date:new Date().toLocaleDateString()});this.renderAnnouncements();});
  });
};
