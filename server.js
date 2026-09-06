import http from 'node:http';
import { readFile, stat, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedTickets, seedCustomers, seedKnowledgeBase, seedTeam, seedSettings, seedNotifications } from './data/store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const runtimePath = path.join(__dirname, 'data', 'runtime.json');
const port = process.env.PORT || 4173;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const clone = value => JSON.parse(JSON.stringify(value));
const wait = ms => new Promise(r=>setTimeout(r,ms));

let db;
async function loadDb(){
  try{
    await access(runtimePath);
    db = JSON.parse(await readFile(runtimePath,'utf8'));
  }catch{
    db = {tickets:clone(seedTickets),customers:clone(seedCustomers),knowledgeBase:clone(seedKnowledgeBase),team:clone(seedTeam),settings:clone(seedSettings),notifications:clone(seedNotifications),activity:[]};
    await persist();
  }
}
async function persist(){ if(db) await writeFile(runtimePath,JSON.stringify(db,null,2)); }

const json=(res,status,payload)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(payload));};
const readBody=req=>new Promise((resolve,reject)=>{let data='';req.on('data',c=>data+=c);req.on('end',()=>{try{resolve(data?JSON.parse(data):{})}catch(e){reject(e)}});req.on('error',reject)});
const nowLabel=()=> 'just now';
const idFor=(prefix,list)=>{let n=Math.max(0,...list.map(x=>Number(String(x.id).replace(/\D/g,''))||0))+1;return `${prefix}-${n}`;};
const tokenize=s=>new Set(String(s||'').toLowerCase().replace(/[^a-z0-9₦]+/g,' ').split(/\s+/).filter(w=>w.length>2));

function hydrate(ticket){
  const customer=db.customers[ticket.customerId]||null;
  return {...ticket,customer,sources:(ticket.sources||[]).map(id=>db.knowledgeBase.find(k=>k.id===id)).filter(Boolean)};
}
function logActivity(type,text,meta={}){db.activity.unshift({id:`act-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type,text,time:new Date().toISOString(),...meta});db.activity=db.activity.slice(0,120);}
function pushNotification(item){db.notifications.unshift({id:`nt-${Date.now()}`,read:false,time:'just now',...item});db.notifications=db.notifications.slice(0,30);}

function retrieve(ticket){
  const customer=db.customers[ticket.customerId]||{};
  const text=[ticket.subject,ticket.summary,ticket.category,...(ticket.tags||[]),...(ticket.messages||[]).map(m=>m.text),customer.notes,...(customer.history||[]).map(h=>`${h.label} ${h.note}`)].join(' ');
  const words=tokenize(text);
  return db.knowledgeBase.map(k=>{
    const tags=[...(k.tags||[]),k.title,k.section,k.excerpt].join(' ');
    const kw=tokenize(tags);let score=0;for(const w of words)if(kw.has(w))score+=3;
    for(const tag of k.tags||[])if(text.toLowerCase().includes(tag.toLowerCase()))score+=6;
    if(ticket.category&&tags.toLowerCase().includes(ticket.category.toLowerCase()))score+=4;
    return {...k,_score:score};
  }).filter(x=>x._score>0).sort((a,b)=>b._score-a._score).slice(0,Math.max(1,db.settings.retrievalLimit||3));
}

function draftFor(ticket,docs){
  const c=db.customers[ticket.customerId]||{name:'there',history:[],tags:[]};
  const first=c.name.split(' ')[0];
  const text=[ticket.subject,ticket.summary,...ticket.messages.map(m=>m.text)].join(' ').toLowerCase();
  let draft='',confidence=78,rationale=[];
  if(/renew|subscription|cancel before renewal/.test(text)){
    draft=`${first}, I can see the annual renewal happened recently. Our policy allows a one-time 72-hour goodwill reversal when paid features have not been used after renewal. I still need to verify your post-renewal activity before I can promise the reversal. If no paid usage is recorded, I can process it for you and confirm once it is complete.`;
    const knownUsage=/no verified post-renewal activity/i.test(c.notes||'');confidence=knownUsage?62:74;
    rationale=['The request appears to be inside the 72-hour goodwill window.','Renewal policy requires confirming post-renewal paid usage before promising a reversal.','Current account context does not prove whether paid features were used after renewal.'];
  }else if(/old address|address|rerout/.test(text)){
    draft=`${first}, I checked the shipment timeline. The address-change request reached support after the carrier had already received the parcel, so the shipping label can no longer be edited directly. The next step is to request a carrier reroute or hold-at-location. That can add 1–2 business days. I’ll keep this ticket open while the reroute is attempted and update you as soon as the carrier confirms the new delivery plan.`;
    confidence=83;rationale=['The address-change request came after carrier handoff.','The shipping playbook says labels cannot be edited after handoff.','Carrier rerouting is the documented next step and can add 1–2 business days.'];
  }else if(/late|delay|replacement/.test(text)){
    const repeat=(c.history||[]).filter(h=>/delay|replacement|failure/i.test(`${h.label} ${h.note}`)).length>0;
    draft=`${first}, I checked the shipment and your recent support history. ${repeat?'Because this is another recent service failure, I want to give you a concrete resolution rather than another tracking update. ':''}I can arrange an expedited replacement at no additional cost, or if the shipment is confirmed lost or cancelled, move this into the eligible refund path. ${c.plan==='Priority'?'I can also add a goodwill credit after I confirm the repeated failures on your account. ':''}I’ll keep ownership of the ticket and update you at the next carrier checkpoint.`;
    confidence=c.plan==='Priority'?92:86;rationale=['The customer is asking for a concrete delivery resolution.','The delivery playbook supports expedited replacement after a material delay.',...(c.plan==='Priority'?['Customer history and plan qualify the case for service-recovery review.']:[])];
  }else if(/invoice|contract|charge|billing/.test(text)){
    draft=`${first}, thanks for flagging the disputed charge. I’ve marked the line for billing review and will keep the disputed amount out of any avoidable collection follow-up while we compare it with the signed pricing terms. I won’t state that the charge is correct or incorrect until Finance verifies the contract reference. I’ll keep this ticket open and send you the outcome as soon as the review is complete.`;
    confidence=79;rationale=['The customer identified a specific disputed billing line.','Billing guidance recommends review before taking a position on a contractual mismatch.','The workspace does not contain the signed contract itself, so the reply avoids an unsupported conclusion.'];
  }else if(/sign in|login|email|access|password/.test(text)){
    draft=`${first}, I can help you recover access. First I need to verify the account email and one secondary account detail before changing any recovery information. Since the sign-in link is reaching your previous address, I’ll use the manual recovery path rather than asking you to share any password or sensitive code here. Once verification is complete, we can update the recovery email and get you back into the account.`;
    confidence=88;rationale=['The issue is an account-access recovery request.','Recovery guidance requires two account facts before changing recovery details.','The response avoids asking for passwords or unrelated one-time codes.'];
  }else if(/cancel.*order|order.*cancel/.test(text)){
    draft=`${first}, I can help with the cancellation. Orders can usually be cancelled before fulfilment begins, but I need to confirm the current fulfilment status before I promise the cancellation or refund. I’m checking that now. If fulfilment has not started, I’ll cancel it and confirm the refund path; if it has started, I’ll explain the next available option.`;
    confidence=84;rationale=['The customer requested cancellation shortly after ordering.','Order policy requires checking fulfilment state before promising cancellation.','The draft clearly separates what is known from what still needs verification.'];
  }else{
    const doc=docs[0];
    draft=`${first}, thanks for the details. I’ve reviewed your message${doc?` alongside our ${doc.title}`:''}. I’m checking the relevant account and order facts now so I can give you a specific next step rather than a generic answer. I’ll keep ownership of the ticket and update you as soon as the required verification is complete.`;
    confidence=docs.length?76:58;rationale=[docs.length?'Relay found relevant support guidance for this issue.':'No strong knowledge match was found, so the suggestion stays cautious.','The draft avoids promising an outcome before the required account facts are verified.'];
  }
  if(docs.length===0)confidence=Math.min(confidence,60);
  if(ticket.priority==='Urgent'&&confidence>=70)confidence=Math.min(96,confidence+2);
  return {draft,confidence,rationale,sources:docs.map(d=>d.id)};
}

function applyDraftPreferences(result,prefs={}){
  let draft=result.draft;
  const tone=String(prefs.tone||db.settings.defaultTone||'Clear & warm');
  const length=String(prefs.length||db.settings.defaultLength||'Balanced');
  if(tone==='Formal'){
    draft=draft.replace(/I’ll/g,'I will').replace(/I’m/g,'I am').replace(/can’t/g,'cannot').replace(/don’t/g,'do not').replace(/you’ll/g,'you will');
  }else if(tone==='Empathetic'){
    const comma=draft.indexOf(',');
    if(comma>0) draft=draft.slice(0,comma+1)+' I understand why this needs a clear answer. '+draft.slice(comma+1).trim();
  }
  if(tone==='Concise'||length==='Short'){
    const parts=draft.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[draft];
    draft=parts.slice(0,Math.min(2,parts.length)).join(' ').replace(/\s+/g,' ').trim();
  }else if(length==='Detailed'&&!/next update|next checkpoint|keep ownership/i.test(draft)){
    draft += ' I will keep ownership of this conversation and share the next confirmed update here so you do not have to repeat the context.';
  }
  return {...result,draft};
}

function analytics(){
  const open=db.tickets.filter(t=>t.status==='Open').length,pending=db.tickets.filter(t=>t.status==='Pending').length,resolved=db.tickets.filter(t=>t.status==='Resolved').length;
  const confidence=db.tickets.filter(t=>Number.isFinite(t.confidence));
  const avgConfidence=confidence.length?Math.round(confidence.reduce((a,t)=>a+t.confidence,0)/confidence.length):0;
  const approved=db.tickets.filter(t=>t.state==='approved').length,edited=db.tickets.filter(t=>t.state==='edited').length,rejected=db.tickets.filter(t=>t.state==='rejected').length;
  const qualityRaw={approved:54+approved,edited:33+edited,rejected:13+rejected};const qualityTotal=qualityRaw.approved+qualityRaw.edited+qualityRaw.rejected;const qApproved=Math.round(qualityRaw.approved/qualityTotal*100),qEdited=Math.round(qualityRaw.edited/qualityTotal*100),qRejected=100-qApproved-qEdited;
  const categories=Object.entries(db.tickets.filter(t=>t.status!=='Resolved').reduce((a,t)=>(a[t.category]=(a[t.category]||0)+1,a),{})).map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);
  return {headline:{open,pending,resolvedToday:38+resolved,aiAssistRate:Math.round(db.tickets.filter(t=>t.draft||t.state==='approved').length/db.tickets.length*100),avgConfidence,csat:4.7},responseTime:[43,39,35,31,29,26,23],resolution:[66,69,73,75,79,82,85],confidenceBands:{high:61,medium:27,low:12},queue:categories,quality:{approvedWithoutEdit:qApproved,editedThenApproved:qEdited,rejected:qRejected},activity:db.activity.slice(0,12)};
}

async function routeApi(req,res,url){
  if(url.pathname==='/api/bootstrap'&&req.method==='GET')return json(res,200,{tickets:db.tickets.map(hydrate),team:db.team,settings:db.settings,notifications:db.notifications});
  if(url.pathname==='/api/tickets'&&req.method==='GET')return json(res,200,db.tickets.map(hydrate));
  if(url.pathname==='/api/tickets'&&req.method==='POST'){
    const b=await readBody(req);const name=String(b.customerName||'').trim(),email=String(b.email||'').trim();if(!name||!email||!b.subject)return json(res,400,{error:'Customer name, email and subject are required'});
    let customer=Object.values(db.customers).find(c=>c.email.toLowerCase()===email.toLowerCase());
    if(!customer){const cid=`c${Object.keys(db.customers).length+1}`;customer={id:cid,name,initials:name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(),email,phone:b.phone||'—',plan:b.plan||'Standard',since:'Sep 2026',lifetimeValue:0,satisfaction:0,health:'New',company:b.company||'—',location:b.location||'—',tags:['New customer'],notes:'',history:[]};db.customers[cid]=customer;}
    const id=idFor('TKT',db.tickets);const ticket={id,customerId:customer.id,subject:String(b.subject).trim(),channel:b.channel||'Email',priority:b.priority||'Normal',status:'Open',state:'new',assignee:b.assignee||'Marvellous O.',updatedAt:'just now',createdAt:new Date().toISOString(),sentiment:b.sentiment||'Neutral',category:b.category||'General',tags:Array.isArray(b.tags)?b.tags:[],summary:String(b.message||'').slice(0,180),messages:[{id:`m-${Date.now()}`,from:'customer',time:'Now',text:String(b.message||'').trim()||'No opening message provided.'}],draft:'',confidence:null,rationale:[],sources:[],draftVersion:0,notes:[]};db.tickets.unshift(ticket);logActivity('ticket',`${id} created`,{ticketId:id});await persist();return json(res,201,hydrate(ticket));
  }
  if(url.pathname==='/api/analytics'&&req.method==='GET')return json(res,200,analytics());
  if(url.pathname==='/api/knowledge'&&req.method==='GET')return json(res,200,db.knowledgeBase);
  if(url.pathname==='/api/knowledge'&&req.method==='POST'){
    const b=await readBody(req);if(!b.title||!b.body)return json(res,400,{error:'Title and content are required'});const item={id:`kb-${String(b.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}-${Date.now().toString().slice(-4)}`,title:b.title,collection:b.collection||'Playbooks',section:b.section||'General',updated:'2026-09-06',owner:b.owner||'CX Operations',status:'Published',excerpt:b.excerpt||String(b.body).slice(0,180),body:b.body,tags:Array.isArray(b.tags)?b.tags:[]};db.knowledgeBase.unshift(item);logActivity('knowledge',`${item.title} published`,{knowledgeId:item.id});await persist();return json(res,201,item);
  }
  const knowledgeMatch=url.pathname.match(/^\/api\/knowledge\/([^/]+)$/);
  if(knowledgeMatch&&req.method==='PUT'){
    const item=db.knowledgeBase.find(k=>k.id===knowledgeMatch[1]);if(!item)return json(res,404,{error:'Article not found'});Object.assign(item,await readBody(req),{updated:'2026-09-06'});logActivity('knowledge',`${item.title} updated`,{knowledgeId:item.id});await persist();return json(res,200,item);
  }
  if(url.pathname==='/api/customers'&&req.method==='GET')return json(res,200,Object.values(db.customers));
  const customerMatch=url.pathname.match(/^\/api\/customers\/([^/]+)$/);
  if(customerMatch&&req.method==='PATCH'){
    const c=db.customers[customerMatch[1]];if(!c)return json(res,404,{error:'Customer not found'});const b=await readBody(req);for(const key of ['name','email','phone','plan','health','company','location','notes','tags'])if(b[key]!==undefined)c[key]=b[key];logActivity('customer',`${c.name} profile updated`,{customerId:c.id});await persist();return json(res,200,c);
  }
  if(url.pathname==='/api/team'&&req.method==='GET')return json(res,200,db.team);
  if(url.pathname==='/api/settings'&&req.method==='GET')return json(res,200,db.settings);
  if(url.pathname==='/api/settings'&&req.method==='PUT'){Object.assign(db.settings,await readBody(req));logActivity('settings','AI assistance settings updated');await persist();return json(res,200,db.settings);}
  if(url.pathname==='/api/notifications'&&req.method==='GET')return json(res,200,db.notifications);
  const notificationMatch=url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if(notificationMatch&&req.method==='POST'){const n=db.notifications.find(x=>x.id===notificationMatch[1]);if(n)n.read=true;await persist();return json(res,200,n||{});}
  if(url.pathname==='/api/notifications/read-all'&&req.method==='POST'){db.notifications.forEach(n=>n.read=true);await persist();return json(res,200,{ok:true});}
  if(url.pathname==='/api/reset'&&req.method==='POST'){db={tickets:clone(seedTickets),customers:clone(seedCustomers),knowledgeBase:clone(seedKnowledgeBase),team:clone(seedTeam),settings:clone(seedSettings),notifications:clone(seedNotifications),activity:[]};await persist();return json(res,200,{ok:true});}

  const ticketMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)$/);
  if(ticketMatch&&req.method==='GET'){const t=db.tickets.find(x=>x.id===ticketMatch[1]);return t?json(res,200,hydrate(t)):json(res,404,{error:'Ticket not found'});}
  if(ticketMatch&&req.method==='PATCH'){
    const t=db.tickets.find(x=>x.id===ticketMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});const b=await readBody(req);for(const key of ['status','priority','assignee','subject','category','tags','sentiment'])if(b[key]!==undefined)t[key]=b[key];t.updatedAt=nowLabel();logActivity('ticket',`${t.id} updated`,{ticketId:t.id});await persist();return json(res,200,hydrate(t));
  }
  const messageMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/messages$/);
  if(messageMatch&&req.method==='POST'){
    const t=db.tickets.find(x=>x.id===messageMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});const b=await readBody(req);const text=String(b.text||'').trim();if(!text)return json(res,400,{error:'Message cannot be empty'});const message={id:`m-${Date.now()}`,from:b.from==='customer'?'customer':'agent',time:'Now',text};t.messages.push(message);t.updatedAt='just now';if(b.resolve)t.status='Resolved';logActivity('message',`Reply sent on ${t.id}`,{ticketId:t.id});await persist();return json(res,201,hydrate(t));
  }
  const noteMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/notes$/);
  if(noteMatch&&req.method==='POST'){
    const t=db.tickets.find(x=>x.id===noteMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});const b=await readBody(req);const text=String(b.text||'').trim();if(!text)return json(res,400,{error:'Note cannot be empty'});t.notes=t.notes||[];t.notes.push({id:`n-${Date.now()}`,author:b.author||'Marvellous O.',time:'Now',text});t.updatedAt='just now';await persist();return json(res,201,hydrate(t));
  }
  const generateMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/generate$/);
  if(generateMatch&&req.method==='POST'){
    const t=db.tickets.find(x=>x.id===generateMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});
    const docs=retrieve(t),result=draftFor(t,docs);t.state='generating';t.draft='';t.confidence=null;t.rationale=[];t.sources=[];
    res.writeHead(200,{'content-type':'application/x-ndjson; charset=utf-8','cache-control':'no-store','connection':'keep-alive'});
    const events=[{type:'status',value:'Reading the conversation'},{type:'status',value:'Retrieving relevant knowledge'},{type:'sources',value:docs.map(({_score,...d})=>d)},{type:'status',value:'Checking customer history'},{type:'status',value:'Drafting a grounded response'}];
    for(const evt of events){res.write(JSON.stringify(evt)+'\n');await wait(300);}
    const words=result.draft.split(' ');let chunk='';for(let i=0;i<words.length;i++){chunk+=(chunk?' ':'')+words[i];if(i%6===5||i===words.length-1){res.write(JSON.stringify({type:'chunk',value:chunk})+'\n');chunk='';await wait(70);}}
    t.draft=result.draft;t.confidence=result.confidence;t.rationale=result.rationale;t.sources=result.sources;t.state=result.confidence<(db.settings.reviewThreshold||70)?'low':'ready';t.draftVersion=(t.draftVersion||0)+1;t.updatedAt='just now';logActivity('ai',`Relay drafted a response for ${t.id}`,{ticketId:t.id,confidence:t.confidence});await persist();res.write(JSON.stringify({type:'done',value:hydrate(t)})+'\n');res.end();return;
  }
  const draftMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/draft$/);
  if(draftMatch&&req.method==='PUT'){const t=db.tickets.find(x=>x.id===draftMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});const b=await readBody(req);t.draft=String(b.draft||'').trim();t.state='edited';t.draftVersion=(t.draftVersion||0)+1;t.updatedAt='just now';logActivity('ai',`Agent edited AI draft on ${t.id}`,{ticketId:t.id});await persist();return json(res,200,hydrate(t));}
  const approveMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/approve$/);
  if(approveMatch&&req.method==='POST'){const t=db.tickets.find(x=>x.id===approveMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});if(!t.draft)return json(res,400,{error:'There is no draft to approve'});const b=await readBody(req);if(b.draft)t.draft=String(b.draft).trim();t.state='approved';t.status=b.keepOpen?'Open':'Resolved';t.updatedAt='just now';t.messages.push({id:`m-${Date.now()}`,from:'agent',time:'Now',text:t.draft});logActivity('message',`AI-assisted reply sent on ${t.id}`,{ticketId:t.id});pushNotification({type:'sent',title:'Reply sent',text:`${t.id} was ${t.status==='Resolved'?'resolved':'kept open'} after approval.`,ticketId:t.id});await persist();return json(res,200,hydrate(t));}
  const rejectMatch=url.pathname.match(/^\/api\/tickets\/([^/]+)\/reject$/);
  if(rejectMatch&&req.method==='POST'){const t=db.tickets.find(x=>x.id===rejectMatch[1]);if(!t)return json(res,404,{error:'Ticket not found'});const b=await readBody(req);t.state='rejected';t.updatedAt='just now';t.notes=t.notes||[];if(b.reason)t.notes.push({id:`n-${Date.now()}`,author:'Marvellous O.',time:'Now',text:`AI draft rejected: ${b.reason}`});logActivity('ai',`AI draft rejected on ${t.id}`,{ticketId:t.id});await persist();return json(res,200,hydrate(t));}
  return false;
}

await loadDb();
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host}`);
  try{
    if(url.pathname.startsWith('/api/')){const handled=await routeApi(req,res,url);if(handled!==false)return;if(!res.headersSent)return json(res,404,{error:'API route not found'});}
    let filePath=path.join(publicDir,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname));const normalized=path.normalize(filePath);if(!normalized.startsWith(publicDir))return json(res,403,{error:'Forbidden'});
    try{const info=await stat(normalized);filePath=info.isDirectory()?path.join(normalized,'index.html'):normalized;const data=await readFile(filePath);res.writeHead(200,{'content-type':types[path.extname(filePath)]||'application/octet-stream','cache-control':'no-cache'});res.end(data);}catch{const data=await readFile(path.join(publicDir,'index.html'));res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(data);}
  }catch(err){console.error(err);if(!res.headersSent)json(res,500,{error:'Unexpected server error'});else res.end();}
});
server.listen(port,()=>console.log(`Relay running at http://localhost:${port}`));
