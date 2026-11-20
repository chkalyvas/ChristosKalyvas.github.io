(function(){

const UPDATED = "2026-10-30";
const DATA = [
 {id:"AIR-2026-001",name:"OpenAI evaluation agents breach Hugging Face (the swarm breach)",cls:"A",activity:"20 Apr – 13 Jul 2026",disclosed:"2026-07-16",by:"Hugging Face",lag:3,approx:false,impact:"~700 of ~1,200 agents in the attack; 14 credentials shared; 22 admin accounts created",mechanism:"Shared artifact cache used as a coordination channel",status:"verified",src:"https://www.redwoodresearch.org/research/hugging-face-incident",post:"/posts/the-swarm-breach/"},
 {id:"AIR-2026-002",name:"Taiwan government agencies (Hermes + OpenClaw)",cls:"B",activity:"Early Jul 2026 (4 days)",disclosed:"2026-08-12",by:"FT; MODA 13 Aug",lag:39,approx:true,impact:"85 accounts, >2,500 personnel records, 21 systems mapped",mechanism:"Agent-assisted intrusion, up to 8 agents in parallel",status:"verified · outcome disputed",src:"https://csoonline.com/article/4209210/ai-agents-wage-near-autonomous-cyberattack-on-asian-government-networks.html"},
 {id:"AIR-2026-003",name:"PaperCut NG/MF exploitation campaign",cls:"B",activity:"31 Aug – 2 Sep 2026",disclosed:"2026-09-09",by:"GreyNoise; Blackpoint",lag:7,approx:false,impact:"≥440 instances in 395 organisations, 48 countries; 12 domain admin",mechanism:"Operator's 28-country exclusion list partly ignored by its agents",status:"verified · autonomy disputed",src:"https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf"},
 {id:"AIR-2026-004",name:"UK AISI cyber evaluation, unsanctioned agent actions",cls:"A",activity:"25–28 Jul 2026",disclosed:"2026-08-04",by:"UK AISI",lag:7,approx:false,impact:"19 unsanctioned actions in 10 of 122 runs; pull request under fake identities; no real-world harm",mechanism:"Scope set by instructions only",status:"verified",src:"https://aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing"},
 {id:"AIR-2026-005",name:"OpenAI agents write to DseWiki as a back-channel",cls:"A",activity:"24 May – 2 Jul 2026",disclosed:"2026-09-04",by:"Researchers; OpenAI 5 Sep",lag:64,approx:false,impact:"~18,000 posts under >3,700 agent names",mechanism:"'Read-only' egress allowed edits over GET requests",status:"verified",src:"https://venturebeat.com/security/agents-identifying-as-openai-systems-wrote-17-000-posts-to-a-wiki-no-one-was-supposed-to-write-to"},
 {id:"AIR-2026-006",name:"Symantec 'Skynet' LLMjacking agent",cls:"B",activity:"Summer 2026 (honeypot)",disclosed:"2026-10-21",by:"Symantec",lag:51,approx:true,impact:"74 tools, 100,000-step ceiling; no confirmed victim",mechanism:"Stolen access to exposed AI models drives an attack loop",status:"verified",src:"https://labs.cloudsecurityalliance.org/research/csa-research-note-llmjacking-autonomous-attack-agent-2026102/"},
 {id:"AIR-2026-007",name:"knaithe / KnYuan (DeepSeek + Hermes, Telegram control)",cls:"B",activity:"May 2026",disclosed:"2026-07-30",by:"Unit 42",lag:60,approx:true,impact:">460 targets; 3 NetScaler exfiltrations; 11 Marimo command executions",mechanism:"Operator exposed by the agent's own web server",status:"verified",src:"https://www.bleepingcomputer.com/news/security/hacker-uses-deepseek-ai-to-autonomously-attack-vulnerable-servers/"}
];
const fmt = d => new Date(d+"T00:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let cls="all", q="", sortK="disclosed", dir=-1;
const tbody=document.querySelector(".air #reg tbody");
function render(){
  const rows=DATA.filter(r=>(cls==="all"||r.cls===cls)&&(!q||(r.name+" "+r.mechanism+" "+r.by+" "+r.impact).toLowerCase().includes(q)))
    .sort((a,b)=>{const x=a[sortK],y=b[sortK];return (typeof x==="number"?x-y:String(x).localeCompare(String(y)))*dir;});
  tbody.innerHTML=rows.map(r=>`<tr><td>${r.id}</td><td><a href="${esc(r.src)}" rel="noopener">${esc(r.name)}</a>${r.post ? (" · <a href=\""+r.post+"\">analysis</a>") : ""}</td><td><span class="cls c${r.cls}">${r.cls}</span></td><td>${esc(r.activity)}</td><td>${fmt(r.disclosed)}<div class="st">${esc(r.by)}</div></td><td>${r.approx?"~":""}${r.lag}</td><td>${esc(r.impact)}</td><td>${esc(r.mechanism)}</td><td class="st">${esc(r.status)}</td></tr>`).join("");
  document.getElementById("count").textContent=DATA.length;
  document.querySelectorAll(".air th").forEach(th=>th.removeAttribute("aria-sort"));
  const th=document.querySelector(`th[data-k="${sortK}"]`); if(th) th.setAttribute("aria-sort",dir>0?"ascending":"descending");
}
document.getElementById("updated").textContent=fmt(UPDATED);
document.querySelectorAll(".air .controls button").forEach(b=>b.onclick=()=>{cls=b.dataset.cls;document.querySelectorAll(".air .controls button").forEach(x=>x.setAttribute("aria-pressed",x===b));render();});
document.getElementById("q").oninput=e=>{q=e.target.value.trim().toLowerCase();render();};
document.querySelectorAll(".air th").forEach(th=>th.onclick=()=>{const k=th.dataset.k;dir=(sortK===k)?-dir:1;sortK=k;render();});
render();

})();
