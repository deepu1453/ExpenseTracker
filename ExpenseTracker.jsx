import { useState, useEffect, useRef } from "react";

const CATS = {
  Food:          { bg:"#FAEEDA", bd:"#FAC775", text:"#633806", chart:"#EF9F27" },
  Transport:     { bg:"#E1F5EE", bd:"#9FE1CB", text:"#085041", chart:"#1D9E75" },
  Entertainment: { bg:"#EEEDFE", bd:"#CECBF6", text:"#3C3489", chart:"#7F77DD" },
  Shopping:      { bg:"#FBEAF0", bd:"#F4C0D1", text:"#72243E", chart:"#D4537E" },
  Health:        { bg:"#EAF3DE", bd:"#C0DD97", text:"#27500A", chart:"#639922" },
  Utilities:     { bg:"#E6F1FB", bd:"#B5D4F4", text:"#0C447C", chart:"#378ADD" },
  Other:         { bg:"#F1EFE8", bd:"#D3D1C7", text:"#444441", chart:"#888780" },
};

const BAR_COLORS = ["#D4537E","#7F77DD","#1D9E75","#EF9F27","#378ADD","#639922"];

const SEED = [
  { id:1,  desc:"Zomato order",     cat:"Food",          date:"2025-06-01", amount:320  },
  { id:2,  desc:"Uber ride",        cat:"Transport",     date:"2025-06-02", amount:150  },
  { id:3,  desc:"Movie tickets",    cat:"Entertainment", date:"2025-06-03", amount:500  },
  { id:4,  desc:"Grocery store",    cat:"Food",          date:"2025-06-05", amount:1200 },
  { id:5,  desc:"Netflix",          cat:"Entertainment", date:"2025-05-15", amount:499  },
  { id:6,  desc:"Electricity bill", cat:"Utilities",     date:"2025-05-20", amount:1800 },
  { id:7,  desc:"Pharmacy",         cat:"Health",        date:"2025-05-22", amount:380  },
  { id:8,  desc:"Amazon order",     cat:"Shopping",      date:"2025-06-04", amount:2100 },
  { id:9,  desc:"Ola bike",         cat:"Transport",     date:"2025-05-28", amount:80   },
  { id:10, desc:"Swiggy breakfast", cat:"Food",          date:"2025-06-06", amount:210  },
];

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ── Mini chart components (pure Canvas, no external lib needed) ──────────────

function DonutChart({ data }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 8, r = R * 0.58;
    ctx.clearRect(0, 0, W, H);
    const total = data.reduce((s, d) => s + d.value, 0);
    let angle = -Math.PI / 2;
    data.forEach((d) => {
      const sweep = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += sweep;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#444";
    ctx.font = "bold 13px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fmt(total), cx, cy);
  }, [data]);
  return <canvas ref={ref} width={160} height={160} role="img" aria-label="Donut chart of spending by category" />;
}

function BarChart({ labels, values }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !values.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top:10, right:10, bottom:28, left:48 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...values) * 1.15 || 1;
    const barW = (chartW / values.length) * 0.55;
    const gap  = chartW / values.length;
    ctx.strokeStyle = "rgba(128,128,128,.15)";
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
      const y = pad.top + chartH * (1 - t);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = "#999";
      ctx.font = "10px Nunito, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(max * t / 1000) + "k", pad.left - 4, y + 3);
    });
    values.forEach((v, i) => {
      const x = pad.left + gap * i + gap / 2 - barW / 2;
      const barH = (v / max) * chartH;
      const y = pad.top + chartH - barH;
      ctx.fillStyle = BAR_COLORS[i % BAR_COLORS.length];
      const rad = 6;
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.lineTo(x + barW - rad, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + rad);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + rad);
      ctx.quadraticCurveTo(x, y, x + rad, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#666";
      ctx.font = "bold 10px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], x + barW / 2, H - 8);
    });
  }, [labels, values]);
  return <canvas ref={ref} width={280} height={180} role="img" aria-label="Bar chart of monthly spending" style={{ width:"100%", height:"auto" }} />;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExpenseTracker() {
  const [expenses, setExpenses]   = useState(SEED);
  const [nextId,   setNextId]     = useState(11);
  const [activeCat, setActiveCat] = useState("All");
  const [search,   setSearch]     = useState("");
  const [sort,     setSort]       = useState("date-desc");
  const [modal,    setModal]      = useState(false);
  const [form, setForm] = useState({ desc:"", amount:"", cat:"Food", date: new Date().toISOString().split("T")[0] });

  // ── Derived data ─────────────────────────────────────────────────────────
  const filtered = expenses
    .filter((e) => (activeCat === "All" || e.cat === activeCat) && e.desc.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "date-desc")    return b.date.localeCompare(a.date);
      if (sort === "date-asc")     return a.date.localeCompare(b.date);
      if (sort === "amount-desc")  return b.amount - a.amount;
      return a.amount - b.amount;
    });

  const total   = expenses.reduce((s, e) => s + e.amount, 0);
  const thisM   = new Date().toISOString().slice(0, 7);
  const monthly = expenses.filter((e) => e.date.startsWith(thisM)).reduce((s, e) => s + e.amount, 0);
  const avg     = expenses.length ? total / expenses.length : 0;

  const byCat = {};
  expenses.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const pieData = Object.entries(byCat).map(([cat, value]) => ({ cat, value, color: (CATS[cat] || CATS.Other).chart }));

  const monthMap = {};
  expenses.forEach((e) => { const m = e.date.slice(0, 7); monthMap[m] = (monthMap[m] || 0) + e.amount; });
  const mKeys   = Object.keys(monthMap).sort().slice(-6);
  const mLabels = mKeys.map((m) => { const [y, mo] = m.split("-"); return new Date(+y, +mo - 1).toLocaleString("en", { month: "short" }); });
  const mVals   = mKeys.map((m) => Math.round(monthMap[m]));

  // ── Handlers ──────────────────────────────────────────────────────────────
  const saveExp = () => {
    if (!form.desc || !form.amount || !form.date) return;
    setExpenses([{ id: nextId, ...form, amount: parseFloat(form.amount) }, ...expenses]);
    setNextId(nextId + 1);
    setModal(false);
    setForm({ desc:"", amount:"", cat:"Food", date: new Date().toISOString().split("T")[0] });
  };
  const delExp = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    page:    { fontFamily:"'Nunito', sans-serif", padding:"1.5rem 0" },
    header:  { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:10 },
    title:   { fontSize:24, fontWeight:900, color:"#222", letterSpacing:"-.5px" },
    titleSpan: { color:"#D4537E" },
    addBtn:  { display:"flex", alignItems:"center", gap:6, padding:"10px 20px", background:"#D4537E", color:"#fff", border:"none", borderRadius:24, cursor:"pointer", fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif" },
    metrics: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:"1.5rem" },
    catRow:  { display:"flex", gap:7, flexWrap:"wrap", marginBottom:"1.25rem" },
    filterRow:{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:"1.25rem" },
    input:   { height:36, fontSize:13, padding:"0 12px", borderRadius:20, border:"2px solid #ddd", fontFamily:"'Nunito',sans-serif", fontWeight:700, width:190 },
    select:  { height:36, fontSize:13, padding:"0 12px", borderRadius:20, border:"2px solid #ddd", fontFamily:"'Nunito',sans-serif", fontWeight:700 },
    chartsRow:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:"1.5rem" },
    chartCard:{ background:"#fff", borderRadius:16, padding:"1rem 1.25rem", border:"2px solid #eee" },
    chartTitle:{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#888", marginBottom:10 },
    tableWrap: { borderRadius:16, overflow:"hidden", border:"2px solid #eee", background:"#fff" },
    th: { padding:"10px 14px", textAlign:"left", fontWeight:800, fontSize:11, textTransform:"uppercase", letterSpacing:".06em", color:"#888", borderBottom:"2px solid #eee", background:"#fafafa" },
    td: { padding:"10px 14px", borderBottom:"1px solid #f0f0f0", fontWeight:700, fontSize:13 },
    amt: { fontWeight:900, color:"#A32D2D" },
    delBtn: { background:"none", border:"none", cursor:"pointer", color:"#E24B4A", fontSize:15, padding:"3px 7px" },
    overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
    modal:  { background:"#fff", borderRadius:20, padding:"1.5rem", width:340, maxWidth:"90vw", border:"3px solid #D4537E" },
    modalTitle:{ fontSize:18, fontWeight:900, color:"#D4537E", marginBottom:"1.25rem" },
    fLabel: { display:"block", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#888", marginBottom:5 },
    fInput: { width:"100%", height:38, padding:"0 12px", borderRadius:12, border:"2px solid #ddd", fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:700, marginBottom:12 },
    saveBtn:{ padding:"9px 20px", background:"#D4537E", color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontSize:13, fontWeight:900, fontFamily:"'Nunito',sans-serif" },
    cancelBtn:{ padding:"9px 18px", border:"2px solid #ddd", background:"transparent", borderRadius:20, cursor:"pointer", fontSize:13, fontWeight:800, fontFamily:"'Nunito',sans-serif" },
    legendRow:{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 },
    legItem:{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:800, color:"#666" },
    legDot: { width:10, height:10, borderRadius:3, flexShrink:0 },
  };

  const METRIC_STYLES = [
    { bg:"#FBEAF0", bd:"#F4C0D1", col:"#72243E" },
    { bg:"#E6F1FB", bd:"#B5D4F4", col:"#0C447C" },
    { bg:"#EAF3DE", bd:"#C0DD97", col:"#27500A" },
    { bg:"#FAEEDA", bd:"#FAC775", col:"#633806" },
  ];
  const METRICS = [
    { label:"Total spent",    val: fmt(total)   },
    { label:"This month",     val: fmt(monthly) },
    { label:"Transactions",   val: expenses.length },
    { label:"Avg per item",   val: fmt(avg)     },
  ];

  const catTotal = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.page}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.title}>✨ My <span style={s.titleSpan}>Expenses</span></div>
          <button style={s.addBtn} onClick={() => setModal(true)}>+ Add expense</button>
        </div>

        {/* Metric cards */}
        <div style={s.metrics}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ borderRadius:16, padding:"14px 16px", background: METRIC_STYLES[i].bg, border:`2.5px solid ${METRIC_STYLES[i].bd}` }}>
              <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color: METRIC_STYLES[i].col, opacity:.8, marginBottom:5 }}>{m.label}</div>
              <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-.5px", color: METRIC_STYLES[i].col }}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* Category pills */}
        <div style={s.catRow}>
          {["All", ...Object.keys(CATS)].map((c) => {
            const active = activeCat === c;
            const cs = CATS[c];
            const bg  = active ? (c === "All" ? "#D4537E" : cs.chart) : (c === "All" ? "#FBEAF0" : cs.bg);
            const col = active ? "#fff" : (c === "All" ? "#72243E" : cs.text);
            const bd  = active ? "transparent" : (c === "All" ? "#F4C0D1" : cs.bd);
            return (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:800, cursor:"pointer", border:`2px solid ${bd}`, background:bg, color:col, fontFamily:"'Nunito',sans-serif" }}>
                {c}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={s.filterRow}>
          <input style={s.input} placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select style={s.select} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>

        {/* Charts */}
        <div style={s.chartsRow}>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>By category</div>
            <div style={s.legendRow}>
              {pieData.map((d) => (
                <span key={d.cat} style={s.legItem}>
                  <span style={{ ...s.legDot, background: d.color }} />
                  {d.cat} {catTotal ? Math.round(d.value / catTotal * 100) : 0}%
                </span>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <DonutChart data={pieData} />
            </div>
          </div>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Monthly trend</div>
            <BarChart labels={mLabels} values={mVals} />
          </div>
        </div>

        {/* Table */}
        <div style={s.tableWrap}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Nunito',sans-serif" }}>
            <thead>
              <tr>{["Description","Category","Date","Amount",""].map((h, i) => <th key={i} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:"center", padding:"2rem", color:"#999", fontWeight:700 }}>Nothing here yet!</td></tr>
              ) : filtered.map((e) => {
                const cs = CATS[e.cat] || CATS.Other;
                return (
                  <tr key={e.id}>
                    <td style={s.td}>{e.desc}</td>
                    <td style={s.td}>
                      <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800, background: cs.bg, color: cs.text, border:`1.5px solid ${cs.bd}` }}>{e.cat}</span>
                    </td>
                    <td style={{ ...s.td, color:"#888" }}>{e.date}</td>
                    <td style={{ ...s.td, ...s.amt }}>{fmt(e.amount)}</td>
                    <td style={s.td}><button style={s.delBtn} onClick={() => delExp(e.id)} aria-label="Delete">🗑</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal && (
          <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <div style={s.modal}>
              <div style={s.modalTitle}>🧾 New expense</div>
              <label style={s.fLabel}>Description</label>
              <input style={s.fInput} placeholder="e.g. Zomato dinner" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              <label style={s.fLabel}>Amount (₹)</label>
              <input style={s.fInput} type="number" min="0" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <label style={s.fLabel}>Category</label>
              <select style={{ ...s.fInput }} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {Object.keys(CATS).map((c) => <option key={c}>{c}</option>)}
              </select>
              <label style={s.fLabel}>Date</label>
              <input style={s.fInput} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
                <button style={s.cancelBtn} onClick={() => setModal(false)}>Cancel</button>
                <button style={s.saveBtn} onClick={saveExp}>Save it!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}