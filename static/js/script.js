let allTraditions=[];

async function loadTraditions(category="all"){
  const res=await fetch(`/api/traditions?category=${encodeURIComponent(category)}`);
  const json=await res.json(); allTraditions=json.data; renderCards(allTraditions);
}
function renderCards(list){
  const box=document.getElementById("cards");
  box.innerHTML=list.map(t=>`
  <article class="card">
    <div class="card-img" style="--bg:url('${imageFor(t.name)}')"><span class="tag">${t.category.toUpperCase()}</span></div>
    <div class="card-body"><h3>${t.name}</h3><p>${t.description}</p>
    <div class="card-foot"><span>📍 ${t.region}</span><button onclick="openTradition(${t.id})">Explore →</button></div></div>
  </article>`).join("");
}
function imageFor(name){
 const imgs={
  "Yellamma":"https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80",
  "Gondhal":"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  "Lavani":"https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  "Jagar":"https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=80",
  "Bharud":"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "Warli Art":"https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=80"
 };
 return imgs[name]||imgs["Gondhal"];
}
function filter(category,btn){document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));btn.classList.add("active");loadTraditions(category);document.getElementById("discover").scrollIntoView({behavior:"smooth"})}
async function searchSite(){
 const q=document.getElementById("searchInput").value.trim();
 if(!q){toast("Type something to explore.");return}
 const res=await fetch(`/api/search?q=${encodeURIComponent(q)}`),json=await res.json();
 document.getElementById("searchTitle").textContent=`Results for “${q}”`;
 document.getElementById("results").innerHTML=json.data.length?json.data.map(t=>`<div class="search-result"><span class="eyebrow dark">${t.category}</span><h3>${t.name}</h3><p>${t.description}</p><button onclick="openTradition(${t.id})">Explore tradition →</button></div>`).join(""):`<p>No exact match found. Try Yellamma, Gondhal, Jagar, Lavani or Bharud.</p>`;
 openModal("searchModal");
}
function quick(q){document.getElementById("searchInput").value=q;searchSite()}
async function openTradition(id){
 closeModal("searchModal");
 const res=await fetch(`/api/traditions/${id}`),json=await res.json();
 if(json.success){toast(`${json.data.name}: detail page will connect to the full cultural database next.`);document.getElementById("chatInput").value=`Tell me about ${json.data.name}`;scrollToId("ai");setTimeout(sendChat,500)}
}
async function sendChat(){
 const input=document.getElementById("chatInput"),q=input.value.trim();if(!q)return;
 addBubble(q,true);input.value="";
 const res=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
 const json=await res.json();setTimeout(()=>addBubble(json.answer||"No answer available.",false),450);
}
function ask(q){document.getElementById("chatInput").value=q;scrollToId("ai");setTimeout(sendChat,300)}
function addBubble(text,user){const d=document.createElement("div");d.className="bubble"+(user?" user":"");d.innerHTML=text;document.getElementById("chatBody").appendChild(d);document.getElementById("chatBody").scrollTop=99999}
async function findLocation(){
 const txt=document.getElementById("locationText");
 if(!navigator.geolocation){txt.textContent="Location is not supported by this browser.";return}
 txt.textContent="Finding your location...";
 navigator.geolocation.getCurrentPosition(()=>{txt.textContent="Location found. Nearby heritage can now be loaded.";toast("Location permission granted!")},()=>{txt.textContent="Location permission was not granted.";toast("Please allow location access.")});
}
document.getElementById("experienceForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const body={tradition:tradition.value,location:expLocation.value,language:language.value,experience:experience.value};
 const res=await fetch("/api/experiences",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const json=await res.json();toast(json.message||"Submitted!");
 if(json.success)e.target.reset();
});
function openModal(id){document.getElementById(id).classList.add("show")}
function closeModal(id){document.getElementById(id).classList.remove("show")}
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2800)}
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark-mode");toast("Theme toggled")};
function toggleNav(){const n=document.querySelector(".navbar nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="78px";n.style.left="0";n.style.right="0";n.style.padding="20px 7%";n.style.background="#fffdf9";n.style.flexDirection="column"}
loadTraditions();
