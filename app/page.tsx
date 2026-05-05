
'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Building2, Plus, Save, Pencil, Trash2, Download, Search, FileText, DollarSign, CheckCircle2, AlertCircle, X } from "lucide-react";

const STORAGE_KEY = "zobrist-project-control-v1";

const currency = (value: any) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value || 0));

const percent = (value: any) => `${Number(value || 0).toFixed(1)}%`;

const statusClass: Record<string,string> = {
  Approved: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
  Draft: "bg-slate-100 text-slate-700",
  Open: "bg-yellow-100 text-yellow-800",
  Closed: "bg-green-100 text-green-800",
  Active: "bg-blue-100 text-blue-800",
  Complete: "bg-green-100 text-green-800",
};

const defaultData: any = {
  projects: [{
    id: 1, number: "26-014", name: "Sample Office Renovation", owner: "Sample Owner",
    architect: "Design Group", address: "Peoria, IL", pm: "Nick Zobrist", estimator: "Ryan Zobrist",
    startDate: "2026-06-01", completionDate: "2026-10-15", contractAmount: 850000, retainagePct: 10,
    status: "Active", notes: "Sample project used to test workflow."
  }],
  contracts: [
    { id: 1, projectId: 1, company: "Zobrist Construction", scope: "General Conditions / Self-Perform", original: 185000, type: "Self-Perform", contact: "Nick Zobrist" },
    { id: 2, projectId: 1, company: "ABC Mechanical", scope: "HVAC", original: 125000, type: "Subcontractor", contact: "Tom Jones" },
    { id: 3, projectId: 1, company: "River City Electric", scope: "Electrical", original: 98000, type: "Subcontractor", contact: "Mike Brown" }
  ],
  changeOrders: [
    { id: 1, projectId: 1, coNumber: "COP-001", title: "Add breakroom casework", status: "Approved", ownerAmount: 18500, subCost: 9400, selfPerformCost: 2800, markupPct: 15, date: "2026-06-18", description: "Added casework, countertop, blocking, and related finish work at breakroom.", contractCompany: "Zobrist Construction" },
    { id: 2, projectId: 1, coNumber: "COP-002", title: "Revise HVAC diffuser layout", status: "Pending", ownerAmount: 7200, subCost: 5900, selfPerformCost: 0, markupPct: 15, date: "2026-06-24", description: "Rework diffuser layout due to revised ceiling plan.", contractCompany: "ABC Mechanical" }
  ],
  directory: [
    { id: 1, projectId: 1, company: "Sample Owner", contact: "Dave Smith", role: "Owner", email: "dave@example.com", phone: "309-555-0100" },
    { id: 2, projectId: 1, company: "Design Group", contact: "Diane Miller", role: "Architect", email: "diane@example.com", phone: "309-555-0110" }
  ],
  rfis: [{ id: 1, projectId: 1, number: "RFI-001", subject: "Door hardware clarification", sentTo: "Architect", status: "Open", due: "2026-07-02" }],
  submittals: [{ id: 1, projectId: 1, spec: "08 71 00", item: "Door Hardware", company: "River City Hardware", status: "Pending", due: "2026-07-05" }],
  schedule: [{ id: 1, projectId: 1, activity: "Mobilization", start: "2026-06-01", finish: "2026-06-05", status: "Complete" }],
  closeout: [{ id: 1, projectId: 1, item: "Punch List", responsible: "Zobrist Construction", due: "2026-10-01", status: "Open" }]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  } catch {
    return defaultData;
  }
}

function Button({ children, onClick, variant="solid", className="" }: any) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
  const styles = variant === "outline" ? "border bg-white text-slate-900 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-700";
  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function Card({ children, className="" }: any) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
}

function StatCard({ title, value, icon: Icon, subtext }: any) {
  return (
    <Card><div className="p-5 flex justify-between gap-4">
      <div><p className="text-sm text-slate-500">{title}</p><p className="mt-1 text-2xl font-semibold">{value}</p>{subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}</div>
      <div className="rounded-2xl bg-slate-100 p-3 h-fit"><Icon className="h-5 w-5 text-slate-700" /></div>
    </div></Card>
  )
}

function StatusPill({ status }: any) {
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
}

function SimpleTable({ columns, rows, onEdit, onDelete }: any) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{columns.map((c:any)=><th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}{(onEdit||onDelete)&&<th className="px-4 py-3">Actions</th>}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length+1}>No records yet.</td></tr> :
          rows.map((r:any)=><tr key={r.id} className="hover:bg-slate-50">
            {columns.map((c:any)=><td key={c.key} className="px-4 py-3 align-top">{c.render ? c.render(r) : r[c.key]}</td>)}
            {(onEdit||onDelete)&&<td className="px-4 py-3"><div className="flex gap-2">{onEdit&&<button onClick={()=>onEdit(r)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4"/></button>}{onDelete&&<button onClick={()=>onDelete(r)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4"/></button>}</div></td>}
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

function Field({ label, value, onChange, type="text", options }: any) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold uppercase text-slate-500">{label}</span>
    {options ? <select className="w-full rounded-xl border p-2 text-sm" value={value ?? ""} onChange={e=>onChange(e.target.value)}>{options.map((o:string)=><option key={o} value={o}>{o}</option>)}</select> :
    <input className="w-full rounded-xl border p-2 text-sm" type={type} value={value ?? ""} onChange={e=>onChange(type==="number" ? Number(e.target.value) : e.target.value)} />}
  </label>
}

function Modal({ title, children, onClose }: any) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-xl">
      <div className="flex justify-between border-b p-4"><h3 className="text-lg font-semibold">{title}</h3><button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5"/></button></div>
      <div className="p-5">{children}</div>
    </div>
  </div>
}

function ProjectForm({ initial, onSave, onCancel }: any) {
  const [form, setForm] = useState(initial || { number:"", name:"", owner:"", architect:"", address:"", pm:"", estimator:"", startDate:"", completionDate:"", contractAmount:0, retainagePct:10, status:"Active", notes:"" });
  const set = (k:string,v:any)=>setForm((p:any)=>({...p,[k]:v}));
  return <div className="grid gap-4 md:grid-cols-2">
    {["number","name","owner","architect","address","pm","estimator"].map(k=><Field key={k} label={k.replace(/([A-Z])/g," $1")} value={form[k]} onChange={(v:any)=>set(k,v)} />)}
    <Field label="Start Date" type="date" value={form.startDate} onChange={(v:any)=>set("startDate",v)} />
    <Field label="Completion Date" type="date" value={form.completionDate} onChange={(v:any)=>set("completionDate",v)} />
    <Field label="Contract Amount" type="number" value={form.contractAmount} onChange={(v:any)=>set("contractAmount",v)} />
    <Field label="Retainage %" type="number" value={form.retainagePct} onChange={(v:any)=>set("retainagePct",v)} />
    <Field label="Status" value={form.status} onChange={(v:any)=>set("status",v)} options={["Active","Bidding","Complete","Warranty","On Hold"]} />
    <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={()=>onSave(form)}><Save className="mr-2 h-4 w-4"/>Save</Button></div>
  </div>
}

function ContractForm({ initial, projectId, onSave, onCancel }: any) {
  const [form, setForm] = useState(initial || { projectId, company:"", scope:"", original:0, type:"Subcontractor", contact:"" });
  const set = (k:string,v:any)=>setForm((p:any)=>({...p,[k]:v}));
  return <div className="grid gap-4 md:grid-cols-2">
    <Field label="Company" value={form.company} onChange={(v:any)=>set("company",v)} />
    <Field label="Contact" value={form.contact} onChange={(v:any)=>set("contact",v)} />
    <Field label="Scope" value={form.scope} onChange={(v:any)=>set("scope",v)} />
    <Field label="Original Contract" type="number" value={form.original} onChange={(v:any)=>set("original",v)} />
    <Field label="Type" value={form.type} onChange={(v:any)=>set("type",v)} options={["Subcontractor","Self-Perform","Vendor","Allowance"]} />
    <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={()=>onSave(form)}><Save className="mr-2 h-4 w-4"/>Save</Button></div>
  </div>
}

function COForm({ initial, projectId, contracts, onSave, onCancel }: any) {
  const [form, setForm] = useState(initial || { projectId, coNumber:`COP-${String(Date.now()).slice(-3)}`, title:"", status:"Draft", ownerAmount:0, subCost:0, selfPerformCost:0, markupPct:15, date:new Date().toISOString().slice(0,10), description:"", contractCompany:"" });
  const set = (k:string,v:any)=>setForm((p:any)=>({...p,[k]:v}));
  const totalCost = Number(form.subCost||0)+Number(form.selfPerformCost||0);
  return <div className="grid gap-4 md:grid-cols-2">
    <Field label="CO Number" value={form.coNumber} onChange={(v:any)=>set("coNumber",v)} />
    <Field label="Date" type="date" value={form.date} onChange={(v:any)=>set("date",v)} />
    <Field label="Title" value={form.title} onChange={(v:any)=>set("title",v)} />
    <Field label="Status" value={form.status} onChange={(v:any)=>set("status",v)} options={["Draft","Pending","Approved","Rejected"]} />
    <Field label="Related Company" value={form.contractCompany} onChange={(v:any)=>set("contractCompany",v)} options={["", ...contracts.map((c:any)=>c.company)]} />
    <Field label="Markup %" type="number" value={form.markupPct} onChange={(v:any)=>set("markupPct",v)} />
    <Field label="Sub Cost" type="number" value={form.subCost} onChange={(v:any)=>set("subCost",v)} />
    <Field label="Self-Perform Cost" type="number" value={form.selfPerformCost} onChange={(v:any)=>set("selfPerformCost",v)} />
    <Field label="Owner Amount" type="number" value={form.ownerAmount} onChange={(v:any)=>set("ownerAmount",v)} />
    <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">Cost + Markup Check</p><p className="mt-1 text-xl font-semibold">{currency(totalCost*(1+Number(form.markupPct||0)/100))}</p></div>
    <label className="md:col-span-2 block"><span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Description</span><textarea className="min-h-28 w-full rounded-xl border p-2 text-sm" value={form.description} onChange={e=>set("description", e.target.value)} /></label>
    <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={()=>onSave(form)}><Save className="mr-2 h-4 w-4"/>Save</Button></div>
  </div>
}

export default function App() {
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<any>(null);
  const [selectedCOId, setSelectedCOId] = useState(1);

  useEffect(()=>{ setData(loadData()); setLoaded(true); },[]);
  useEffect(()=>{ if(loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); },[data,loaded]);

  const project = data.projects.find((p:any)=>p.id===activeProjectId) || data.projects[0];
  const projectContracts = data.contracts.filter((c:any)=>c.projectId===activeProjectId);
  const projectCOs = data.changeOrders.filter((c:any)=>c.projectId===activeProjectId);
  const selectedCO = projectCOs.find((c:any)=>c.id===selectedCOId) || projectCOs[0];

  const addRecord = (key:string, record:any) => setData((p:any)=>({...p,[key]:[...p[key],{...record,id:Date.now()}]}));
  const updateRecord = (key:string, id:number, patch:any) => setData((p:any)=>({...p,[key]:p[key].map((r:any)=>r.id===id?{...r,...patch}:r)}));
  const deleteRecord = (key:string, id:number) => setData((p:any)=>({...p,[key]:p[key].filter((r:any)=>r.id!==id)}));

  const approvedCOsByCompany = (company:string) => projectCOs.filter((co:any)=>co.status==="Approved" && co.contractCompany===company).reduce((s:number,co:any)=>s+Number(co.ownerAmount||0),0);

  const totals = useMemo(()=>{
    const originalBudget = projectContracts.reduce((s:number,c:any)=>s+Number(c.original||0),0);
    const approvedOwnerCOs = projectCOs.filter((c:any)=>c.status==="Approved").reduce((s:number,c:any)=>s+Number(c.ownerAmount||0),0);
    const pendingOwnerCOs = projectCOs.filter((c:any)=>c.status==="Pending").reduce((s:number,c:any)=>s+Number(c.ownerAmount||0),0);
    const approvedCost = projectCOs.filter((c:any)=>c.status==="Approved").reduce((s:number,c:any)=>s+Number(c.subCost||0)+Number(c.selfPerformCost||0),0);
    const revisedContract = Number(project?.contractAmount || 0)+approvedOwnerCOs;
    const grossMargin = revisedContract-originalBudget-approvedCost;
    return { originalBudget, approvedOwnerCOs, pendingOwnerCOs, approvedCost, revisedContract, coMargin: approvedOwnerCOs-approvedCost, grossMargin, grossMarginPct: revisedContract ? grossMargin/revisedContract*100 : 0 };
  },[projectContracts,projectCOs,project]);

  const filteredCOs = projectCOs.filter((co:any)=>[co.coNumber,co.title,co.status,co.description].join(" ").toLowerCase().includes(search.toLowerCase()));
  const tabs = ["Dashboard","Projects","Contracts","Change Orders","CO Proposal","AIA Billing","Directory","RFIs/RFPs","Submittals","Schedule","Closeout"];

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <aside className="fixed left-0 top-0 hidden h-full w-72 border-r bg-white p-5 lg:block">
      <div className="mb-8 flex items-center gap-3"><div className="rounded-2xl bg-slate-900 p-3 text-white"><Building2 className="h-6 w-6"/></div><div><h1 className="text-lg font-bold">Zobrist Project Control</h1><p className="text-xs text-slate-500">MVP · browser saved</p></div></div>
      <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Active Project</label>
      <select className="mb-5 w-full rounded-xl border bg-white p-2 text-sm" value={activeProjectId} onChange={e=>setActiveProjectId(Number(e.target.value))}>{data.projects.map((p:any)=><option key={p.id} value={p.id}>{p.number} · {p.name}</option>)}</select>
      <nav className="space-y-1">{tabs.map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={`w-full rounded-xl px-3 py-2 text-left text-sm ${activeTab===tab ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{tab}</button>)}</nav>
    </aside>

    <main className="lg:ml-72">
      <header className="sticky top-0 z-10 border-b bg-white/90 px-5 py-4 backdrop-blur md:px-8">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div><p className="text-sm text-slate-500">{project?.number}</p><h1 className="text-2xl font-semibold">{project?.name}</h1></div>
          <div className="flex gap-2"><Button onClick={()=>setModal({type:"project"})}><Plus className="mr-2 h-4 w-4"/>New Project</Button><Button variant="outline" onClick={()=>window.print()}><Download className="mr-2 h-4 w-4"/>Print / PDF</Button></div>
        </div>
      </header>

      <div className="p-5 md:p-8">
        {activeTab==="Dashboard" && <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Original Contract" value={currency(project?.contractAmount)} icon={FileText} subtext="Owner contract amount"/>
            <StatCard title="Approved Owner COs" value={currency(totals.approvedOwnerCOs)} icon={CheckCircle2} subtext="Added to contract"/>
            <StatCard title="Pending CO Exposure" value={currency(totals.pendingOwnerCOs)} icon={AlertCircle} subtext="Not yet approved"/>
            <StatCard title="CO Margin" value={currency(totals.coMargin)} icon={DollarSign} subtext="Approved owner COs less CO costs"/>
          </div>
          <Card><div className="p-5"><h2 className="text-xl font-semibold">Project Financial Snapshot</h2><div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Revised Owner Contract</p><p className="text-2xl font-semibold">{currency(totals.revisedContract)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Original Buyout / Budget</p><p className="text-2xl font-semibold">{currency(totals.originalBudget)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Approved CO Cost</p><p className="text-2xl font-semibold">{currency(totals.approvedCost)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Estimated Gross Margin</p><p className="text-2xl font-semibold">{currency(totals.grossMargin)}</p><p className="text-xs text-slate-500">{percent(totals.grossMarginPct)}</p></div>
          </div></div></Card>
        </div>}

        {activeTab==="Projects" && <div><div className="mb-4 flex justify-between"><div><h2 className="text-xl font-semibold">New Job Info</h2><p className="text-sm text-slate-500">Project setup based on your new job sheet.</p></div><Button onClick={()=>setModal({type:"project", record:project})}><Pencil className="mr-2 h-4 w-4"/>Edit Project</Button></div>
          <Card><div className="grid gap-4 p-5 md:grid-cols-2">{Object.entries(project||{}).filter(([k])=>k!=="id").map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">{k.replace(/([A-Z])/g," $1")}</p><p className="mt-1 text-sm">{k.toLowerCase().includes("amount") ? currency(v) : String(v)}</p></div>)}</div></Card></div>}

        {activeTab==="Contracts" && <div><div className="mb-4 flex justify-between"><div><h2 className="text-xl font-semibold">Contracts & Changes</h2><p className="text-sm text-slate-500">Original contracts and revised values by company/scope.</p></div><Button onClick={()=>setModal({type:"contract"})}><Plus className="mr-2 h-4 w-4"/>Add Contract</Button></div>
          <SimpleTable columns={[
            {key:"company",label:"Company"},{key:"scope",label:"Scope"},{key:"type",label:"Type"},
            {key:"original",label:"Original",render:(r:any)=>currency(r.original)},
            {key:"approvedCOs",label:"Approved COs",render:(r:any)=>currency(approvedCOsByCompany(r.company))},
            {key:"revised",label:"Revised",render:(r:any)=>currency(Number(r.original)+approvedCOsByCompany(r.company))}
          ]} rows={projectContracts} onEdit={(r:any)=>setModal({type:"contract",record:r})} onDelete={(r:any)=>deleteRecord("contracts",r.id)} /></div>}

        {activeTab==="Change Orders" && <div><div className="mb-4 flex justify-between"><div><h2 className="text-xl font-semibold">Change Order Master Log</h2><p className="text-sm text-slate-500">Owner price, sub/internal cost, status, exposure, and margin.</p></div><Button onClick={()=>setModal({type:"co"})}><Plus className="mr-2 h-4 w-4"/>Add CO</Button></div>
          <div className="mb-4 flex items-center rounded-2xl border bg-white px-3 py-2 shadow-sm"><Search className="mr-2 h-4 w-4 text-slate-400"/><input className="w-full outline-none" placeholder="Search COs..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <SimpleTable columns={[
            {key:"coNumber",label:"CO #"},{key:"title",label:"Title"},{key:"status",label:"Status",render:(r:any)=><StatusPill status={r.status}/>},{key:"contractCompany",label:"Company"},
            {key:"ownerAmount",label:"Owner Amount",render:(r:any)=>currency(r.ownerAmount)},
            {key:"cost",label:"Cost",render:(r:any)=>currency(Number(r.subCost)+Number(r.selfPerformCost))},
            {key:"margin",label:"Margin",render:(r:any)=>currency(Number(r.ownerAmount)-Number(r.subCost)-Number(r.selfPerformCost))},{key:"date",label:"Date"}
          ]} rows={filteredCOs} onEdit={(r:any)=>{setSelectedCOId(r.id); setModal({type:"co",record:r})}} onDelete={(r:any)=>deleteRecord("changeOrders",r.id)} /></div>}

        {activeTab==="CO Proposal" && <div><div className="mb-4 flex justify-between"><div><h2 className="text-xl font-semibold">Change Order Proposal</h2><p className="text-sm text-slate-500">Choose a CO and print/save this view as a PDF.</p></div><select className="rounded-xl border bg-white p-2 text-sm" value={selectedCO?.id || ""} onChange={e=>setSelectedCOId(Number(e.target.value))}>{projectCOs.map((co:any)=><option key={co.id} value={co.id}>{co.coNumber} · {co.title}</option>)}</select></div>
          {selectedCO ? <Card><div className="p-8">
            <div className="mb-6 flex justify-between border-b pb-4"><div><h2 className="text-2xl font-bold">Change Order Proposal</h2><p className="text-sm text-slate-500">Zobrist Construction</p></div><div className="text-right text-sm text-slate-600"><p><strong>{selectedCO.coNumber}</strong></p><p>{selectedCO.date}</p></div></div>
            <div className="grid gap-4 md:grid-cols-2"><p><strong>Project:</strong> {project.name}</p><p><strong>Project No.:</strong> {project.number}</p><p><strong>Owner:</strong> {project.owner}</p><p><strong>Architect:</strong> {project.architect}</p><p className="md:col-span-2"><strong>Change:</strong> {selectedCO.title}</p></div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="font-semibold">Scope of Work</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedCO.description}</p></div>
            <div className="mt-6 overflow-hidden rounded-2xl border"><table className="w-full text-sm"><tbody className="divide-y"><tr><td className="p-3 text-lg font-semibold">Total Proposal Amount</td><td className="p-3 text-right text-lg font-bold">{currency(selectedCO.ownerAmount)}</td></tr></tbody></table></div>
          </div></Card> : <Card><div className="p-5">No change order selected.</div></Card>}</div>}

        {activeTab==="AIA Billing" && <Card><div className="p-5"><h2 className="text-xl font-semibold">AIA Billing / Continuation Sheet</h2><p className="mt-2 text-slate-600">Next build: SOV lines, previous billing, this period, retainage, and balance to finish. This should pull revised contract and approved owner COs automatically.</p></div></Card>}
        {activeTab==="Directory" && <SimpleTable columns={[{key:"company",label:"Company"},{key:"contact",label:"Contact"},{key:"role",label:"Role"},{key:"email",label:"Email"},{key:"phone",label:"Phone"}]} rows={data.directory.filter((d:any)=>d.projectId===activeProjectId)} />}
        {activeTab==="RFIs/RFPs" && <SimpleTable columns={[{key:"number",label:"Number"},{key:"subject",label:"Subject"},{key:"sentTo",label:"Sent To"},{key:"status",label:"Status",render:(r:any)=><StatusPill status={r.status}/>},{key:"due",label:"Due"}]} rows={data.rfis.filter((r:any)=>r.projectId===activeProjectId)} />}
        {activeTab==="Submittals" && <SimpleTable columns={[{key:"spec",label:"Spec"},{key:"item",label:"Item"},{key:"company",label:"Company"},{key:"status",label:"Status",render:(r:any)=><StatusPill status={r.status}/>},{key:"due",label:"Due"}]} rows={data.submittals.filter((s:any)=>s.projectId===activeProjectId)} />}
        {activeTab==="Schedule" && <SimpleTable columns={[{key:"activity",label:"Activity"},{key:"start",label:"Start"},{key:"finish",label:"Finish"},{key:"status",label:"Status"}]} rows={data.schedule.filter((s:any)=>s.projectId===activeProjectId)} />}
        {activeTab==="Closeout" && <SimpleTable columns={[{key:"item",label:"Item"},{key:"responsible",label:"Responsible"},{key:"due",label:"Due"},{key:"status",label:"Status"}]} rows={data.closeout.filter((c:any)=>c.projectId===activeProjectId)} />}
      </div>
    </main>

    {modal?.type==="project" && <Modal title={modal.record ? "Edit Project" : "New Project"} onClose={()=>setModal(null)}><ProjectForm initial={modal.record} onCancel={()=>setModal(null)} onSave={(form:any)=>{ modal.record ? updateRecord("projects", modal.record.id, form) : addRecord("projects", form); setModal(null); }} /></Modal>}
    {modal?.type==="contract" && <Modal title={modal.record ? "Edit Contract" : "Add Contract"} onClose={()=>setModal(null)}><ContractForm initial={modal.record} projectId={activeProjectId} onCancel={()=>setModal(null)} onSave={(form:any)=>{ modal.record ? updateRecord("contracts", modal.record.id, form) : addRecord("contracts", form); setModal(null); }} /></Modal>}
    {modal?.type==="co" && <Modal title={modal.record ? "Edit Change Order" : "Add Change Order"} onClose={()=>setModal(null)}><COForm initial={modal.record} projectId={activeProjectId} contracts={projectContracts} onCancel={()=>setModal(null)} onSave={(form:any)=>{ modal.record ? updateRecord("changeOrders", modal.record.id, form) : addRecord("changeOrders", form); setModal(null); }} /></Modal>}
  </div>
}
