const form=document.getElementById("jobForm");
const message=document.getElementById("message");
const settingsMessage=document.getElementById("settingsMessage");
const settingsPanel=document.getElementById("settingsPanel");
const overlay=document.getElementById("overlay");
const STATUS_KEY="twenty8ApplicationStatus";
const DATA_KEY="twenty8ApplicationData";

function setTheme(theme){
  document.body.classList.toggle("light",theme==="light");
  document.getElementById("themeSelect").value=theme;
  localStorage.setItem("twenty8Theme",theme);
}
setTheme(localStorage.getItem("twenty8Theme")||"dark");

document.getElementById("themeToggle").onclick=()=>{
  setTheme(document.body.classList.contains("light")?"dark":"light");
};
document.getElementById("themeSelect").onchange=e=>setTheme(e.target.value);

function openSettings(){
  settingsPanel.classList.add("open");
  overlay.classList.add("show");
}
function closeSettings(){
  settingsPanel.classList.remove("open");
  overlay.classList.remove("show");
}
document.getElementById("settingsBtn").onclick=openSettings;
document.getElementById("closeSettings").onclick=closeSettings;
overlay.onclick=closeSettings;

function collectData(){
  return {
    fullName:fullName.value,idNumber:idNumber.value,gender:gender.value,country:country.value,
    phone:phone.value,email:email.value,position:position.value,coverLetter:coverLetter.value
  };
}
function saveChanges(show=true){
  localStorage.setItem(DATA_KEY,JSON.stringify(collectData()));
  if(show){
    message.textContent="Changes saved on this device.";
    settingsMessage.textContent="Application details saved successfully.";
  }
}
function loadSaved(){
  try{
    const d=JSON.parse(localStorage.getItem(DATA_KEY)||"null");
    if(!d)return;
    ["fullName","idNumber","gender","country","phone","email","position","coverLetter"].forEach(id=>{
      if(d[id]!==undefined)document.getElementById(id).value=d[id];
    });
  }catch(e){}
}
loadSaved();

document.getElementById("saveBtn").onclick=()=>saveChanges(true);
document.getElementById("saveSettingsBtn").onclick=()=>{saveChanges(true);openSettings();};

function getStatus(){return localStorage.getItem(STATUS_KEY)||"pending";}
function updateStatus(){
  const status=getStatus();
  const badge=document.getElementById("statusBadge");
  badge.textContent=status==="verified"?"Verified":"Pending";
  badge.className="status-badge "+status;
  document.getElementById("statusDescription").textContent=status==="verified"
    ?"Your application has been verified by the recruitment team."
    :"Your application is pending review by the recruitment team.";
}
updateStatus();

form.addEventListener("submit",e=>{
  e.preventDefault();
  const cv=document.getElementById("cv").files[0];
  const photo=document.getElementById("photo").files[0];
  if(cv&&cv.size>5*1024*1024){message.textContent="CV is too large. Please use a file smaller than 5 MB.";return;}
  if(photo&&photo.size>3*1024*1024){message.textContent="Profile picture is too large. Please use a file smaller than 3 MB.";return;}
  saveChanges(false);
  localStorage.setItem(STATUS_KEY,"pending");
  updateStatus();
  message.textContent="Application submitted successfully. Current status: Pending.";
  openSettings();
});

document.getElementById("viewApplicationBtn").onclick=()=>{
  updateStatus();
  settingsMessage.textContent=getStatus()==="verified"
    ?"Your application status is VERIFIED."
    :"Your application status is PENDING.";
};

document.getElementById("helpBtn").onclick=()=>document.getElementById("helpModal").classList.add("show");
document.getElementById("aboutBtn").onclick=()=>document.getElementById("aboutModal").classList.add("show");
document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.onclick=()=>document.getElementById(btn.dataset.close).classList.remove("show");
});
document.querySelectorAll(".modal").forEach(modal=>{
  modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show");});
});
