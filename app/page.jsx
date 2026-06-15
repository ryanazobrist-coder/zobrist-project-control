
'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {Building2, Download, Plus, RefreshCw, Save, Pencil, Trash2} from 'lucide-react';

const KEY = 'zobrist-v3-aia-stable';

const money = v => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(v||0));
const money0 = v => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v||0));
const percent = v => `${Number(v||0).toFixed(2)}%`;

const baseSov = [
 ['1.1','','Lump Sum',0,0,0],['1.2','','Project Management - Zobrist',48000,40800,7200],['1.3','','Dumpsters',6000,5100,900],['1.4','','Cleaning and Material Handling',13696,11641.6,2054.4],['1.5','','Lift Rental',5000,4250,750],['1.6','','Building Permit',7200,7200,0],['1.7','','Concrete Demo and Pourback',10000,10000,0],['1.8','','Selective Demolition',12840,12840,0],['1.9','','Stair Labor',17120,17120,0],['1.10','','Stair Material',5250,5250,0],['1.11','','Misc. Carpentry Labor',4280,3638,642],['1.12','','Misc. Carpentry Materials',889.05,755.69,133.36],['1.13','','Casework Labor',1712,0,1712],['1.14','','Casework Materials - Riverside',15900,0,15900],['1.15','','Door Materials - S&S',8483.95,8483.95,0],['1.16','','Door Install - Zobrist',4280,3638,642],['1.17','','Carpet Materials - Carpet Weavers',2715,0,2715],['1.18','','Carpet Labor',1685,0,1685],['1.19','','Resilient Materials',24325,0,24325],['1.20','','Resilient Labor',18620,0,18620],['1.21','','Tape and Paint Labor - Vogue',26750,9690,17060],['1.22','','Tape and Paint Material',6690,970,5720],['1.23','','Framing, Drywall, Ceiling Labor Zobrist',21828,18553.8,3274.2],['1.24','','Framing, Drywall, Ceiling Materials',9273,7882.05,1390.95],['1.25','','Fire Sprinkling Labor - Pipco',8000,5200,2800],['1.26','','Fire Sprinkling Material',4000,2600,1400],['1.27','','Fire Sprinkling Demo',3000,1950,1050],['1.28','','Fire Sprinkling Fabrication',1000,650,350],['1.29','','Fire Sprinkling Design',2500,1625,875],['1.30','','Fire Sprinkling Admin & Supervision',1500,975,525],['1.31','','Fire Sprinkling Insurance',910,591.5,318.5],['1.32','','Plumbing Labor - Illini',24269,17745,6524],['1.33','','Plumbing Material',16969,11627,5342],['1.34','','HVAC Work - Standard HVAC',10957,1000,9957],['1.35','','Thermostat Allowance',945,0,945],['1.36','','Electrical Demo - L&F',5000,5000,0],['1.37','','Light Fixtures',9000,9000,0],['1.38','','Electrical Rough-In Material',15000,15000,0],['1.39','','Electrical Rough-In Labor',40000,40000,0],['1.40','','Electrical Trim Material',8000,3000,5000],['1.41','','Electrical Trim Labor',20000,6000,14000],['1.42','','Fire Alarm Material',9900,9900,0],['1.43','','Fire Alarm Labor',18000,17000,1000],['1.44','','Overhead and Profit - Zobrist',37719,32061.15,5657.85]
];

const seed = {
 projects:[{id:1,number:'25.8102',name:'Kid & Play',owner:'KID AND PLAY LLC',ownerAddress:'7620 N University St.\\nPeoria, Illinois 61614',architect:'',address:'7620 N University St\\nPeoria, Illinois 61615',pm:'Nick Zobrist',estimator:'Ryan Zobrist',originalOwnerContract:509206,retainagePct:10,status:'Active'}],
 commitments:[
  {id:1,projectId:1,company:'N. Zobrist & Sons, Inc.',scope:'General Conditions',type:'Self-Perform',originalContract:79896},
  {id:2,projectId:1,company:'N. Zobrist & Sons, Inc.',scope:'Carpentry Work',type:'Self-Perform',originalContract:88417.05},
  {id:3,projectId:1,company:'L&F Electric Inc.',scope:'Electrical',type:'Subcontractor',originalContract:124900},
  {id:4,projectId:1,company:'Illini Plumbing Inc.',scope:'Plumbing',type:'Subcontractor',originalContract:41238},
  {id:5,projectId:1,company:'PIPCO Companies Ltd.',scope:'Fire Sprinkling',type:'Subcontractor',originalContract:20910},
  {id:6,projectId:1,company:'Vogue Painting Inc.',scope:'Painting',type:'Subcontractor',originalContract:33440},
  {id:7,projectId:1,company:'Carpet Weavers',scope:'Flooring',type:'Subcontractor',originalContract:47345},
  {id:8,projectId:1,company:'Standard Heating & Cooling',scope:'HVAC',type:'Subcontractor',originalContract:10957},
  {id:9,projectId:1,company:'N. Zobrist & Sons, Inc.',scope:'OH & Profit',type:'Self-Perform',originalContract:37719}
 ],
 changeOrders:[{id:1,projectId:1,number:'CO-001',title:'Approved final added scope',status:'Approved',date:'2026-04-30',description:'Approved owner change orders included in final application.',items:[
  {id:101,type:'Owner',description:'Net change by change orders',amount:27170.64},
  {id:102,type:'Commitment',commitmentId:6,description:'Taping & painting added scope',amount:1700},
  {id:103,type:'Commitment',commitmentId:3,description:'Electrical added scope',amount:4085},
  {id:104,type:'Commitment',commitmentId:2,description:'Carpentry labor/material added scope',amount:6330},
  {id:105,type:'Commitment',commitmentId:9,description:'Profit/overhead added scope',amount:3073.11},
  {id:106,type:'Commitment',commitmentId:5,description:'Fire protection added heads',amount:2952.37},
  {id:107,type:'Commitment',commitmentId:4,description:'Plumbing miscellaneous',amount:2698.16},
  {id:108,type:'Commitment',commitmentId:7,description:'Bathroom flooring',amount:6332}
 ]}],
 sovLines: baseSov.map((r,i)=>({id:i+1,projectId:1,sourceType:'Base',sourceId:null,itemNo:r[0],budgetCode:r[1],description:r[2],scheduledValue:r[3],previousAmount:r[4],thisPeriod:r[5],storedMaterials:0,retainagePct:''})),
 payApps:[{id:1,projectId:1,appNo:4,invoiceNo:'25.8102Pay Application #4',periodStart:'2026-04-01',periodEnd:'2026-04-30',status:'Draft',createdDate:'2026-05-31',previousPaid:313863.95}]
};

function loadData(){ try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; } }

function Button({children,onClick,variant='solid'}){return <button className={`btn ${variant==='outline'?'out':''}`} onClick={onClick}>{children}</button>}
function Card({children}){return <div className="card">{children}</div>}
function Field({label,value,onChange,type='text',options}){return <label><span className="label">{label}</span>{options?<select className="select" value={value??''} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input className="input" type={type} value={value??''} onChange={e=>onChange(type==='number'?Number(e.target.value):e.target.value)} />}</label>}
function Modal({title,children,onClose}){return <div className="modal-bg"><div className="modal"><div className="modal-head"><b>{title}</b><button onClick={onClose}>×</button></div><div className="modal-body">{children}</div></div></div>}
function Table({cols,rows,onEdit,onDelete}){return <div className="table"><table><thead><tr>{cols.map(c=><th key={c.key} className={c.num?'num':''}>{c.label}</th>)}{(onEdit||onDelete)&&<th>Actions</th>}</tr></thead><tbody>{rows.length===0?<tr><td colSpan={cols.length+1}>No records.</td></tr>:rows.map(r=><tr key={r.id}>{cols.map(c=><td key={c.key} className={c.num?'num':''}>{c.render?c.render(r):r[c.key]}</td>)}{(onEdit||onDelete)&&<td>{onEdit&&<button onClick={()=>onEdit(r)}><Pencil size={14}/></button>}{onDelete&&<button onClick={()=>onDelete(r)}><Trash2 size={14}/></button>}</td>}</tr>)}</tbody></table></div>}

function calcBilling(project,payApp,lines,approvedCOs){
 const contract = Number(project.originalOwnerContract||0) + Number(approvedCOs||0);
 const completed = lines.reduce((s,l)=>s+Number(l.previousAmount||0)+Number(l.thisPeriod||0)+Number(l.storedMaterials||0),0);
 const retainage = lines.reduce((s,l)=>{
  const base = Number(l.previousAmount||0)+Number(l.thisPeriod||0);
  const rp = l.retainagePct==='' || l.retainagePct==null ? Number(project.retainagePct||0) : Number(l.retainagePct);
  return s + base * rp / 100;
 },0);
 const earned = completed - retainage;
 const prev = Number(payApp?.previousPaid||0);
 return {contract,completed,retainage,earned,prev,currentDue:earned-prev,balance:contract-earned};
}

function SOVForm({initial,projectId,onSave,onCancel}){
 const [f,setF]=useState(initial||{projectId,sourceType:'Base',sourceId:null,itemNo:'',budgetCode:'',description:'',scheduledValue:0,previousAmount:0,thisPeriod:0,storedMaterials:0,retainagePct:''});
 const set=(k,v)=>setF(p=>({...p,[k]:v}));
 return <div className="form">
  <Field label="Item No." value={f.itemNo} onChange={v=>set('itemNo',v)}/><Field label="Budget Code" value={f.budgetCode} onChange={v=>set('budgetCode',v)}/>
  <label className="full"><span className="label">Description</span><textarea className="textarea" value={f.description} onChange={e=>set('description',e.target.value)}/></label>
  <Field label="Scheduled Value" type="number" value={f.scheduledValue} onChange={v=>set('scheduledValue',v)}/><Field label="Previous Amount" type="number" value={f.previousAmount} onChange={v=>set('previousAmount',v)}/>
  <Field label="This Period" type="number" value={f.thisPeriod} onChange={v=>set('thisPeriod',v)}/><Field label="Stored Materials" type="number" value={f.storedMaterials} onChange={v=>set('storedMaterials',v)}/>
  <Field label="Retainage % Override" type="number" value={f.retainagePct} onChange={v=>set('retainagePct',v)}/>
  <div className="full actions"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={()=>onSave(f)}><Save size={15}/>Save</Button></div>
 </div>
}

function PayAppForm({initial,projectId,onSave,onCancel}){
 const [f,setF]=useState(initial||{projectId,appNo:1,invoiceNo:'',periodStart:'',periodEnd:'',status:'Draft',createdDate:new Date().toISOString().slice(0,10),previousPaid:0});
 const set=(k,v)=>setF(p=>({...p,[k]:v}));
 return <div className="form">
  <Field label="Application No." type="number" value={f.appNo} onChange={v=>set('appNo',v)}/><Field label="Invoice No." value={f.invoiceNo} onChange={v=>set('invoiceNo',v)}/>
  <Field label="Period Start" type="date" value={f.periodStart} onChange={v=>set('periodStart',v)}/><Field label="Period End" type="date" value={f.periodEnd} onChange={v=>set('periodEnd',v)}/>
  <Field label="Previous Paid / Certified" type="number" value={f.previousPaid} onChange={v=>set('previousPaid',v)}/><Field label="Status" value={f.status} onChange={v=>set('status',v)} options={['Draft','Submitted','Paid']}/>
  <div className="full actions"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={()=>onSave(f)}><Save size={15}/>Save</Button></div>
 </div>
}

export default function App(){
 const [data,setData]=useState(seed);
 const [loaded,setLoaded]=useState(false);
 const [tab,setTab]=useState('Control Center');
 const [pid,setPid]=useState(1);
 const [view,setView]=useState('worksheet');
 const [payId,setPayId]=useState(1);
 const [modal,setModal]=useState(null);

 useEffect(()=>{setData(loadData());setLoaded(true)},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(KEY,JSON.stringify(data))},[data,loaded]);

 const project = data.projects.find(p=>p.id===pid) || data.projects[0];
 const commitments = data.commitments.filter(c=>c.projectId===pid);
 const cos = data.changeOrders.filter(c=>c.projectId===pid);
 const lines = data.sovLines.filter(l=>l.projectId===pid).sort((a,b)=>String(a.itemNo).localeCompare(String(b.itemNo),undefined,{numeric:true}));
 const payApps = data.payApps.filter(p=>p.projectId===pid);
 const payApp = payApps.find(p=>p.id===payId) || payApps[0];

 const approvedOwnerCOs = cos.filter(c=>c.status==='Approved').flatMap(c=>c.items).filter(i=>i.type==='Owner').reduce((s,i)=>s+Number(i.amount||0),0);
 const approvedCostCOs = cos.filter(c=>c.status==='Approved').flatMap(c=>c.items).filter(i=>i.type==='Commitment').reduce((s,i)=>s+Number(i.amount||0),0);
 const revisedOwner = Number(project.originalOwnerContract||0) + approvedOwnerCOs;
 const committedCost = commitments.reduce((s,c)=>s+Number(c.originalContract||0),0) + approvedCostCOs;
 const margin = revisedOwner - committedCost;
 const billing = calcBilling(project,payApp,lines,approvedOwnerCOs);

 const add = (key,rec)=>setData(d=>({...d,[key]:[...d[key],{...rec,id:Date.now()}]}));
 const update = (key,id,patch)=>setData(d=>({...d,[key]:d[key].map(r=>r.id===id?{...r,...patch}:r)}));
 const del = (key,id)=>setData(d=>({...d,[key]:d[key].filter(r=>r.id!==id)}));

 const syncCOs = () => {
  const existing = new Set(data.sovLines.filter(l=>l.projectId===pid && l.sourceType==='CO').map(l=>l.sourceId));
  const additions = [];
  cos.filter(co=>co.status==='Approved').forEach((co,idx)=>{
   const ownerTotal = co.items.filter(i=>i.type==='Owner').reduce((s,i)=>s+Number(i.amount||0),0);
   if(ownerTotal && !existing.has(co.id)){
    additions.push({id:Date.now()+idx,projectId:pid,sourceType:'CO',sourceId:co.id,itemNo:`2.${idx+1}`,budgetCode:co.number,description:`${co.number} - ${co.title}`,scheduledValue:ownerTotal,previousAmount:0,thisPeriod:ownerTotal,storedMaterials:0,retainagePct:0});
   }
  });
  if(additions.length) setData(d=>({...d,sovLines:[...d.sovLines,...additions]}));
 };

 const tabs = ['Control Center','Commitments','Change Orders','AIA Billing','CO Proposal','Directory','RFIs/RFPs','Submittals','Schedule','Closeout'];

 return <div className="app">
  <aside className="side">
   <div className="brand"><div className="logo">Z</div><div><h1>Zobrist Project Control</h1><p>Contracts + AIA Billing</p></div></div>
   <label className="label">Active Project</label>
   <select className="select" value={pid} onChange={e=>setPid(Number(e.target.value))}>{data.projects.map(p=><option key={p.id} value={p.id}>{p.number} · {p.name}</option>)}</select>
   <nav className="nav">{tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</nav>
  </aside>
  <main className="main">
   <header className="header"><div><div className="kicker">{project.number}</div><h2>{project.name}</h2></div><div className="actions"><Button variant="outline" onClick={()=>window.print()}><Download size={15}/>Print / PDF</Button></div></header>
   <div className="content">
    {tab==='Control Center' && <><div className="notice">Approved COs update live contract values. Pending COs stay out of the real contract total.</div><section className="section"><div className="section-head"><div><h3>Owner Contract Summary</h3><p className="desc">Owner contract and approved change order position.</p></div></div><div className="grid g4"><Card><div className="stat-title">Original Owner Contract</div><div className="stat">{money0(project.originalOwnerContract)}</div></Card><Card><div className="stat-title">Approved Owner COs</div><div className="stat green">{money0(approvedOwnerCOs)}</div></Card><Card><div className="stat-title">Revised Owner Contract</div><div className="stat">{money0(revisedOwner)}</div></Card><Card><div className="stat-title">Current Margin</div><div className={`stat ${margin<0?'red':'green'}`}>{money0(margin)}</div></Card></div></section></>}
    {tab==='Commitments' && <section className="section"><div className="section-head"><div><h3>Commitments</h3><p className="desc">Subcontractor and self-perform commitment values.</p></div></div><Table rows={commitments} cols={[{key:'company',label:'Company'},{key:'scope',label:'Scope'},{key:'type',label:'Type'},{key:'originalContract',label:'Original',num:true,render:r=>money(r.originalContract)}]}/></section>}
    {tab==='Change Orders' && <section className="section"><div className="section-head"><div><h3>Change Orders</h3><p className="desc">Owner side and cost side change order tracking.</p></div></div><Table rows={cos.map(co=>{const owner=co.items.filter(i=>i.type==='Owner').reduce((s,i)=>s+Number(i.amount),0);const cost=co.items.filter(i=>i.type==='Commitment').reduce((s,i)=>s+Number(i.amount),0);return {...co,owner,cost,margin:owner-cost}})} cols={[{key:'number',label:'CO #'},{key:'title',label:'Title'},{key:'status',label:'Status',render:r=><span className={`pill ${r.status}`}>{r.status}</span>},{key:'owner',label:'Owner',num:true,render:r=>money(r.owner)},{key:'cost',label:'Cost',num:true,render:r=>money(r.cost)},{key:'margin',label:'Margin',num:true,render:r=><span className={r.margin<0?'red':'green'}>{money(r.margin)}</span>}]}/></section>}
    {tab==='AIA Billing' && <section className="section print-section">
     <div className="section-head no-print"><div><h3>AIA Billing / SOV</h3><p className="desc">Summary page + continuation sheet flow. Approved owner COs can sync into the SOV.</p></div><div className="actions"><Button variant="outline" onClick={syncCOs}><RefreshCw size={15}/>Sync Approved COs to SOV</Button><Button onClick={()=>setModal({type:'sov'})}><Plus size={15}/>Add SOV Line</Button><Button onClick={()=>setModal({type:'payapp'})}><Plus size={15}/>New Pay App</Button></div></div>
     <div className="tabs no-print"><button className={`tab ${view==='worksheet'?'active':''}`} onClick={()=>setView('worksheet')}>Worksheet</button><button className={`tab ${view==='print'?'active':''}`} onClick={()=>setView('print')}>Summary + Continuation</button></div>
     <div className="no-print" style={{marginBottom:16}}><label className="label">Pay Application</label><select className="select" style={{maxWidth:420}} value={payApp?.id||''} onChange={e=>setPayId(Number(e.target.value))}>{payApps.map(p=><option key={p.id} value={p.id}>App #{p.appNo} · {p.invoiceNo}</option>)}</select></div>
     {view==='worksheet' ? <><div className="grid g4" style={{marginBottom:16}}><div className="box"><div className="t">Revised Contract</div><div className="v">{money(billing.contract)}</div></div><div className="box"><div className="t">Completed + Stored</div><div className="v">{money(billing.completed)}</div></div><div className="box"><div className="t">Retainage</div><div className="v">{money(billing.retainage)}</div></div><div className="box"><div className="t">Current Due</div><div className="v">{money(billing.currentDue)}</div></div></div><Table rows={lines.map(l=>{const total=Number(l.previousAmount)+Number(l.thisPeriod)+Number(l.storedMaterials);const rp=l.retainagePct===''||l.retainagePct==null?project.retainagePct:Number(l.retainagePct);const retain=(Number(l.previousAmount)+Number(l.thisPeriod))*rp/100;return {...l,total,percent:l.scheduledValue?total/l.scheduledValue*100:0,balance:Number(l.scheduledValue)-total,retain}})} cols={[{key:'itemNo',label:'Item'},{key:'budgetCode',label:'Budget Code'},{key:'description',label:'Description'},{key:'scheduledValue',label:'Scheduled',num:true,render:r=>money(r.scheduledValue)},{key:'previousAmount',label:'Previous',num:true,render:r=>money(r.previousAmount)},{key:'thisPeriod',label:'This Period',num:true,render:r=>money(r.thisPeriod)},{key:'storedMaterials',label:'Stored',num:true,render:r=>money(r.storedMaterials)},{key:'total',label:'Total',num:true,render:r=>money(r.total)},{key:'percent',label:'%',num:true,render:r=>percent(r.percent)},{key:'balance',label:'Balance',num:true,render:r=>money(r.balance)},{key:'retain',label:'Retainage',num:true,render:r=>money(r.retain)}]} onEdit={r=>setModal({type:'sov',record:r})} onDelete={r=>del('sovLines',r.id)}/></> : <div className="doc"><div className="doc-head"><div><h2>Application and Certificate for Payment</h2><div className="muted">Document Summary Sheet</div></div><div style={{textAlign:'right'}}><b>Application No:</b> {payApp?.appNo}<br/><b>Invoice No:</b> {payApp?.invoiceNo}<br/><b>Period:</b> {payApp?.periodStart} - {payApp?.periodEnd}<br/><b>Project No:</b> {project.number}</div></div><div className="grid g3"><div><b>To Owner/Client:</b><br/>{project.owner}<br/><span style={{whiteSpace:'pre-wrap'}}>{project.ownerAddress}</span></div><div><b>Project:</b><br/>{project.name}<br/><span style={{whiteSpace:'pre-wrap'}}>{project.address}</span></div><div><b>From Contractor:</b><br/>N. Zobrist Construction<br/>95 Commerce Dr.<br/>Morton, Illinois 61550</div></div><h3>Contractor's Application for Payment</h3><table><tbody><tr><td>1. Original Contract Sum</td><td className="num">{money(project.originalOwnerContract)}</td></tr><tr><td>2. Net Change by Change Orders</td><td className="num">{money(approvedOwnerCOs)}</td></tr><tr><td>3. Contract Sum to Date</td><td className="num">{money(billing.contract)}</td></tr><tr><td>4. Total Completed and Stored to Date</td><td className="num">{money(billing.completed)}</td></tr><tr><td>5. Total Retainage</td><td className="num">{money(billing.retainage)}</td></tr><tr><td>6. Total Earned Less Retainage</td><td className="num">{money(billing.earned)}</td></tr><tr><td>7. Less Previous Certificates for Payment</td><td className="num">{money(billing.prev)}</td></tr><tr><td><b>8. Current Payment Due</b></td><td className="num"><b>{money(billing.currentDue)}</b></td></tr><tr><td>9. Balance to Finish, Including Retainage</td><td className="num">{money(billing.balance)}</td></tr></tbody></table><h3>Continuation Sheet</h3><Table rows={lines.map(l=>{const total=Number(l.previousAmount)+Number(l.thisPeriod)+Number(l.storedMaterials);const rp=l.retainagePct===''||l.retainagePct==null?project.retainagePct:Number(l.retainagePct);const retain=(Number(l.previousAmount)+Number(l.thisPeriod))*rp/100;return {...l,total,percent:l.scheduledValue?total/l.scheduledValue*100:0,balance:Number(l.scheduledValue)-total,retain}})} cols={[{key:'itemNo',label:'Item'},{key:'budgetCode',label:'Budget Code'},{key:'description',label:'Description'},{key:'scheduledValue',label:'Scheduled',num:true,render:r=>money(r.scheduledValue)},{key:'previousAmount',label:'Previous',num:true,render:r=>money(r.previousAmount)},{key:'thisPeriod',label:'This Period',num:true,render:r=>money(r.thisPeriod)},{key:'storedMaterials',label:'Stored',num:true,render:r=>money(r.storedMaterials)},{key:'total',label:'Total',num:true,render:r=>money(r.total)},{key:'percent',label:'%',num:true,render:r=>percent(r.percent)},{key:'balance',label:'Balance',num:true,render:r=>money(r.balance)},{key:'retain',label:'Retainage',num:true,render:r=>money(r.retain)}]}/></div>}
    </section>}
    {['CO Proposal','Directory','RFIs/RFPs','Submittals','Schedule','Closeout'].includes(tab) && <Card><h3>{tab}</h3><p className="desc">Placeholder for next build.</p></Card>}
   </div>
  </main>
  {modal?.type==='sov' && <Modal title={modal.record?'Edit SOV Line':'Add SOV Line'} onClose={()=>setModal(null)}><SOVForm initial={modal.record} projectId={pid} onCancel={()=>setModal(null)} onSave={f=>{const clean={...f,projectId:pid,sourceType:f.sourceType||'Base'}; modal.record?update('sovLines',modal.record.id,clean):add('sovLines',clean); setModal(null);}} /></Modal>}
  {modal?.type==='payapp' && <Modal title="New Pay App" onClose={()=>setModal(null)}><PayAppForm projectId={pid} onCancel={()=>setModal(null)} onSave={f=>{add('payApps',f);setModal(null);}} /></Modal>}
 </div>
}
