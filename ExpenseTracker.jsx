 import { useState, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

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

const CHALLENGES = [
  { emoji:"🍕", label:"No Takeaway Week",    color:"#D4537E", light:"#FBEAF0", textCol:"#72243E", diff:"Easy",   diffBg:"#EAF3DE", diffTxt:"#27500A", desc:"No food delivery or takeaway for 7 days. Cook every meal at home. Track what you save!" },
  { emoji:"☕", label:"No Coffee Shops",     color:"#EF9F27", light:"#FAEEDA", textCol:"#633806", diff:"Easy",   diffBg:"#EAF3DE", diffTxt:"#27500A", desc:"Skip Starbucks, Cafe Coffee Day, and any paid coffee for a week. Brew at home instead." },
  { emoji:"🛒", label:"Cash Only Week",      color:"#1D9E75", light:"#E1F5EE", textCol:"#085041", diff:"Medium", diffBg:"#E6F1FB", diffTxt:"#0C447C", desc:"Withdraw a fixed cash budget and use only that for the week. When it's gone, it's gone!" },
  { emoji:"🎮", label:"No Subscriptions",    color:"#7F77DD", light:"#EEEDFE", textCol:"#3C3489", diff:"Hard",   diffBg:"#FBEAF0", diffTxt:"#72243E", desc:"Pause all streaming, gaming, and subscription services for the week." },
  { emoji:"👟", label:"No Shopping Week",    color:"#378ADD", light:"#E6F1FB", textCol:"#0C447C", diff:"Medium", diffBg:"#E6F1FB", diffTxt:"#0C447C", desc:"Zero clothing, gadgets, or non-essential purchases. Window shopping only!" },
  { emoji:"🚗", label:"No Rides/Cabs",       color:"#639922", light:"#EAF3DE", textCol:"#27500A", diff:"Medium", diffBg:"#E6F1FB", diffTxt:"#0C447C", desc:"Walk, cycle, or take public transport all week. No Ola, Uber, or auto above ₹50." },
  { emoji:"🧾", label:"Receipt Every Rupee", color:"#E24B4A", light:"#FCEBEB", textCol:"#791F1F", diff:"Hard",   diffBg:"#FBEAF0", diffTxt:"#72243E", desc:"Log every single expense — even ₹5 chai — in this tracker for a full week!" },
  { emoji:"💸", label:"50% Cut Challenge",   color:"#BA7517", light:"#FAEEDA", textCol:"#412402", diff:"Hard",   diffBg:"#FBEAF0", diffTxt:"#72243E", desc:"Spend only 50% of your average weekly budget. Calculate your average and try to halve it!" },
];

const MEMES = [
  { pct:50,  face:"😬", title:"Halfway there…",               color:"#EF9F27", bg:"#FAEEDA", bd:"#FAC775", textCol:"#633806", sub:"Your wallet is sweating. Maybe put the Zomato app in a folder called 'Do Not Open'." },
  { pct:75,  face:"😰", title:"75% gone. Bro.",               color:"#D4537E", bg:"#FBEAF0", bd:"#F4C0D1", textCol:"#72243E", sub:"Three-quarters of your budget just evaporated. Your savings account is filing a missing persons report." },
  { pct:90,  face:"🫣", title:"90%?! Sir this is a Wendy's.", color:"#E24B4A", bg:"#FCEBEB", bd:"#F7C1C1", textCol:"#791F1F", sub:"You are one impulse buy away from financial chaos. Step AWAY from Amazon. I am begging." },
  { pct:100, face:"💀", title:"BUDGET DEFEATED. GG NO RE.",   color:"#791F1F", bg:"#FCEBEB", bd:"#E24B4A", textCol:"#501313", sub:"Your budget has left the chat. Your bank account is in therapy. Zomato has sent you a thank-you card." },
  { pct:120, face:"🔥", title:"YOU BROKE THE BUDGET IN HALF", color:"#501313", bg:"#FCEBEB", bd:"#E24B4A", textCol:"#501313", sub:"This is not a drill. Your credit card is screaming. The RBI knows your name. Please. Stop." },
];

const HORROR_LEVELS = [
  { min:0,  max:20, title:"Saint of Savings",    emoji:"😇", color:"#1D9E75", bg:"#E1F5EE", textCol:"#085041", desc:"Are you even human? Your wallet is practically glowing. Finance gurus weep at your discipline." },
  { min:21, max:40, title:"Mildly Cursed",        emoji:"😬", color:"#EF9F27", bg:"#FAEEDA", textCol:"#633806", desc:"Some questionable choices but nothing the budget gods can't forgive. Probably." },
  { min:41, max:60, title:"Financially Chaotic",  emoji:"😰", color:"#D4537E", bg:"#FBEAF0", textCol:"#72243E", desc:"Your bank account is a horror movie and you keep walking toward the noise. Classic." },
  { min:61, max:80, title:"Budget Demon",         emoji:"👿", color:"#7F77DD", bg:"#EEEDFE", textCol:"#3C3489", desc:"Economists cry themselves to sleep because of people like you. Zomato thanks you personally." },
  { min:81, max:100,title:"APOCALYPTIC",          emoji:"💀", color:"#E24B4A", bg:"#FCEBEB", textCol:"#791F1F", desc:"Your credit card has filed a restraining order. The RBI is monitoring you. God help us all." },
];

const MOODS = [
  { name:"Broke But Make It Fashion", emoji:"💅", genre:"Sad Bop",       genreBg:"#FBEAF0", genreCol:"#72243E", desc:"You spend like a millionaire and cry like one too. Aesthetic poverty is still poverty.",         songs:[{t:"Broke",a:"Samm Henshaw",w:"your bank balance after Zomato"},{t:"Mo Money Mo Problems",a:"Notorious B.I.G.",w:"except you have neither"},{t:"Bad Guy",a:"Billie Eilish",w:"the bad guy is your debit card"}]},
  { name:"Chaotic Neutral Spender",   emoji:"🌪️", genre:"Hyperpop",      genreBg:"#EEEDFE", genreCol:"#3C3489", desc:"No plan. No budget. Just vibes and receipts. Every purchase is a main character moment.",         songs:[{t:"XS",a:"Rina Sawayama",w:"excess is your personality"},{t:"INDUSTRY BABY",a:"Lil Nas X",w:"except you're not an industry baby"},{t:"Montero",a:"Lil Nas X",w:"you called and Amazon answered"}]},
  { name:"Responsible King/Queen",    emoji:"👑", genre:"Feel-Good Pop",  genreBg:"#EAF3DE", genreCol:"#27500A", desc:"Groceries over Zomato. Needs over wants. You're the friend everyone goes to for money advice.",  songs:[{t:"Happy",a:"Pharrell Williams",w:"because your savings account is"},{t:"Good as Hell",a:"Lizzo",w:"because you actually are"},{t:"Levitating",a:"Dua Lipa",w:"your credit score is floating"}]},
  { name:"Retail Therapy Patient",    emoji:"🛍️", genre:"Sad Girl Pop",   genreBg:"#FAEEDA", genreCol:"#633806", desc:"Something happened. We don't know what. But Amazon Prime definitely knows.",                     songs:[{t:"Cry Baby",a:"Melanie Martinez",w:"every time the bill arrives"},{t:"Buy U a Drank",a:"T-Pain",w:"you buy yourself everything"},{t:"Expensive",a:"Ty Dolla Sign",w:"your taste vs your budget"}]},
];

const ALL_VERDICTS = [
  ["🍕","Zomato Addict",        "You've ordered food delivery more times than you've cooked. Your kitchen is a myth."],
  ["🚗","Cab Connoisseur",      "Walking is not in your vocabulary unless it's to the door to accept your delivery."],
  ["🛒","Impulse Buyer",        "Amazon sees you coming. The algorithm is your best friend and worst enemy."],
  ["🎬","Entertainment Hoarder","You have 6 streaming subscriptions and watch 1. The others are 'for someday'."],
  ["💡","Utility Avoider",      "You noticed the electricity bill only when the lights went out. Classic."],
  ["☕","Chai Budget Buster",   "You said 'just one coffee' 47 times this month. Math is not your friend."],
  ["🎧","Subscription Junkie",  "You pay for 4 music apps. You use Spotify. The rest are feelings."],
  ["🏃","Fitness Liar",         "You have a gym membership and a yoga mat in a bag. You have not moved."],
];

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// ── Alert helpers ─────────────────────────────────────────────────────────────

function getActiveMeme(expenses, budget, dismissed) {
  const thisM = new Date().toISOString().slice(0, 7);
  const spent = expenses.filter(e => e.date.startsWith(thisM)).reduce((s, e) => s + e.amount, 0);
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const triggered = [...MEMES].reverse().find(m => pct >= m.pct);
  if (!triggered) return null;
  const key = triggered.pct + "_" + thisM;
  if (dismissed.includes(key)) return null;
  return { ...triggered, key, spent, pct: Math.round(pct), budget };
}

// ── MemeAlert Component ───────────────────────────────────────────────────────

function MemeAlert({ meme, onDismiss }) {
  const style = {
    position: "relative",
    borderRadius: 16,
    border: `2.5px dashed ${meme.bd}`,
    padding: "1rem 1.25rem",
    marginBottom: "1.25rem",
    background: meme.bg,
    animation: "slideDown .4s cubic-bezier(.22,1,.36,1)",
    textAlign: "center",
  };
  return (
    <div style={style}>
      <button onClick={onDismiss} style={{ position:"absolute", top:10, right:12, background:"none", border:"none", fontSize:18, cursor:"pointer", color:meme.textCol, opacity:.6 }}>✕</button>
      <span style={{ fontSize:52, display:"block", marginBottom:6, animation:"wobble 1.2s ease-in-out infinite alternate" }}>{meme.face}</span>
      <div style={{ fontSize:17, fontWeight:900, color:meme.textCol, marginBottom:6 }}>{meme.title}</div>
      <div style={{ fontSize:12, color:meme.textCol, opacity:.85, lineHeight:1.6, marginBottom:10 }}>{meme.sub}</div>
      <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:meme.color, color:"#fff", fontSize:12, fontWeight:900 }}>
        {meme.pct}% of budget used — {fmt(meme.spent)} / {fmt(meme.budget)}
      </span>
    </div>
  );
}

// ── BudgetBar Component ───────────────────────────────────────────────────────

function BudgetBar({ budget, budgetInput, monthly, onBudgetChange, onBudgetCommit }) {
  const pct = budget > 0 ? Math.min((monthly / budget) * 100, 120) : 0;
  const meterColor = pct >= 100 ? "#E24B4A" : pct >= 75 ? "#D4537E" : pct >= 50 ? "#EF9F27" : "#1D9E75";
  return (
    <div style={{ background:"#fff", border:"2px solid #eee", borderRadius:16, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
      <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#aaa", marginBottom:8 }}>Monthly budget</div>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:13, fontWeight:800, color:"#555" }}>₹</span>
        <input
          type="number"
          value={budgetInput}
          placeholder="Set budget…"
          onChange={e => onBudgetChange(e.target.value)}
          onBlur={onBudgetCommit}
          onKeyDown={e => e.key === "Enter" && onBudgetCommit()}
          style={{ height:36, fontSize:13, padding:"0 12px", borderRadius:20, border:"2px solid #ddd", fontFamily:"'Nunito',sans-serif", fontWeight:700, width:120 }}
        />
        <div style={{ flex:1 }}>
          <div style={{ height:18, borderRadius:20, background:"#f0f0f0", overflow:"hidden", margin:"0 0 4px" }}>
            <div style={{ height:"100%", borderRadius:20, background:meterColor, width:`${pct}%`, transition:"width 1s cubic-bezier(.22,1,.36,1)" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:800, color:"#aaa" }}>
            <span>{fmt(monthly)} spent</span>
            <span>{fmt(budget)} budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DonutChart Component ──────────────────────────────────────────────────────

function DonutChart({ data }) {
  const ref = useRef(null);
  const drawn = useRef(false);

  const draw = () => {
    const canvas = ref.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, R = Math.min(W,H)/2 - 8, r = R * 0.58;
    ctx.clearRect(0, 0, W, H);
    const total = data.reduce((s, d) => s + d.value, 0);
    let angle = -Math.PI / 2;
    data.forEach(d => {
      const sweep = (d.value / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + sweep); ctx.closePath();
      ctx.fillStyle = d.color; ctx.fill();
      angle += sweep;
    });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.fillStyle = "#444"; ctx.font = "bold 13px Nunito, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(fmt(total), cx, cy);
  };

  // Draw on every render
  setTimeout(draw, 0);

  return <canvas ref={ref} width={160} height={160} aria-label="Donut chart of spending by category" />;
}

// ── BarChart Component ────────────────────────────────────────────────────────

function BarChart({ labels, values }) {
  const ref = useRef(null);

  const draw = () => {
    const canvas = ref.current;
    if (!canvas || !values.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { top:10, right:10, bottom:28, left:48 };
    const chartW = W - pad.left - pad.right, chartH = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...values) * 1.15 || 1;
    const barW = (chartW / values.length) * 0.55, gap = chartW / values.length;
    ctx.strokeStyle = "rgba(128,128,128,.15)"; ctx.lineWidth = 1;
    [0, .25, .5, .75, 1].forEach(t => {
      const y = pad.top + chartH * (1 - t);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = "#999"; ctx.font = "10px Nunito, sans-serif"; ctx.textAlign = "right";
      ctx.fillText(Math.round(max * t / 1000) + "k", pad.left - 4, y + 3);
    });
    values.forEach((v, i) => {
      const x = pad.left + gap * i + gap / 2 - barW / 2;
      const barH = (v / max) * chartH, y = pad.top + chartH - barH;
      ctx.fillStyle = BAR_COLORS[i % BAR_COLORS.length];
      const rad = 6;
      ctx.beginPath();
      ctx.moveTo(x+rad, y); ctx.lineTo(x+barW-rad, y); ctx.quadraticCurveTo(x+barW, y, x+barW, y+rad);
      ctx.lineTo(x+barW, y+barH); ctx.lineTo(x, y+barH); ctx.lineTo(x, y+rad); ctx.quadraticCurveTo(x, y, x+rad, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#666"; ctx.font = "bold 10px Nunito, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(labels[i], x + barW / 2, H - 8);
    });
  };

  setTimeout(draw, 0);

  return <canvas ref={ref} width={280} height={180} aria-label="Bar chart of monthly spending" style={{ width:"100%", height:"auto" }} />;
}

// ── SpinWheel Component ───────────────────────────────────────────────────────

function SpinWheel({ onResult }) {
  const canvasRef = useRef(null);
  const angleRef  = useRef(0);
  const rafRef    = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const SEG = (Math.PI * 2) / CHALLENGES.length;
  const W = 300, CX = 150, CY = 150, R = 142;

  const draw = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, W);
    CHALLENGES.forEach((c, i) => {
      const start = rot + i * SEG, end = start + SEG;
      ctx.beginPath(); ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, R, start, end); ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? c.color : c.light;
      ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(CX, CY); ctx.rotate(start + SEG / 2);
      ctx.font = "18px serif"; ctx.textAlign = "right";
      ctx.fillText(c.emoji, R - 8, 7);
      ctx.font = "bold 9.5px Nunito, sans-serif";
      ctx.fillStyle = i % 2 === 0 ? "#fff" : c.textCol;
      ctx.fillText(c.label.length > 13 ? c.label.slice(0, 13) + "…" : c.label, R - 34, 5);
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(CX, CY, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = "bold 10px Nunito, sans-serif";
    ctx.fillStyle = "#333"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("SPIN", CX, CY);
  };

  setTimeout(() => draw(angleRef.current), 0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const extra  = Math.PI * 2 * (8 + Math.floor(Math.random() * 6));
    const target = angleRef.current + extra + Math.random() * Math.PI * 2;
    const duration = 3600, startTime = performance.now(), startAngle = angleRef.current;
    const easeOut = (t) => 1 - Math.pow(1 - t, 4);
    const frame = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      angleRef.current = startAngle + (target - startAngle) * easeOut(t);
      draw(angleRef.current);
      if (t < 1) { rafRef.current = requestAnimationFrame(frame); }
      else {
        setSpinning(false);
        const norm = ((-angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        onResult(CHALLENGES[Math.floor(norm / SEG) % CHALLENGES.length]);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ position:"relative", width:W, height:W }}>
        <div style={{ position:"absolute", top:-16, left:"50%", transform:"translateX(-50%)", width:0, height:0, borderLeft:"13px solid transparent", borderRight:"13px solid transparent", borderTop:"26px solid #333", zIndex:2 }} />
        <canvas ref={canvasRef} width={W} height={W} style={{ borderRadius:"50%", display:"block" }} aria-label="Budget challenge spin wheel" />
      </div>
      <button onClick={spin} disabled={spinning} style={{ marginTop:16, padding:"11px 32px", background:spinning?"#ccc":"#D4537E", color:"#fff", border:"none", borderRadius:24, fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif", cursor:spinning?"not-allowed":"pointer" }}>
        {spinning ? "Spinning…" : "🎲 Spin the wheel!"}
      </button>
    </div>
  );
}

// ── WheelTab Component ────────────────────────────────────────────────────────

function WheelTab() {
  const [result,  setResult]  = useState(null);
  const [active,  setActive]  = useState(null);
  const [history, setHistory] = useState([]);

  const accept = () => {
    setActive(result);
    setHistory(h => [{ c:result, status:"accepted", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }, ...h].slice(0, 8));
    setResult(null);
  };
  const skip = () => {
    setHistory(h => [{ c:result, status:"skipped", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }, ...h].slice(0, 8));
    setResult(null);
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif" }}>
      {active && (
        <div style={{ background:active.light, border:`2px solid ${active.color}`, borderRadius:16, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontSize:26 }}>{active.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:active.textCol }}>🔥 Active challenge</div>
            <div style={{ fontSize:14, fontWeight:900, color:active.textCol }}>{active.label}</div>
            <div style={{ fontSize:12, color:active.textCol, opacity:.8, marginTop:2 }}>{active.desc}</div>
          </div>
          <button onClick={() => setActive(null)} style={{ background:"none", border:`1.5px solid ${active.color}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:800, color:active.textCol, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>Done ✓</button>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <SpinWheel onResult={setResult} />
        {result && (
          <div style={{ background:"#fff", borderRadius:16, padding:"1.25rem 1.5rem", border:"2px solid #eee", textAlign:"center", marginTop:20, width:"100%", maxWidth:380 }}>
            <div style={{ fontSize:44, marginBottom:8 }}>{result.emoji}</div>
            <div style={{ fontSize:18, fontWeight:900, color:"#222", marginBottom:8 }}>{result.label}</div>
            <span style={{ display:"inline-block", padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:800, background:result.diffBg, color:result.diffTxt, marginBottom:10 }}>{result.diff} difficulty</span>
            <div style={{ fontSize:13, color:"#666", lineHeight:1.6, marginBottom:14 }}>{result.desc}</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button onClick={accept} style={{ padding:"9px 22px", background:"#D4537E", color:"#fff", border:"none", borderRadius:20, fontSize:13, fontWeight:900, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>✅ Accept!</button>
              <button onClick={skip}   style={{ padding:"9px 18px", border:"2px solid #ddd", background:"transparent", borderRadius:20, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif", color:"#888" }}>Skip</button>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#aaa", marginBottom:10 }}>Past spins</div>
          {history.map((h, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"#fff", border:"2px solid #eee", borderRadius:12, fontSize:13, marginBottom:6 }}>
              <span style={{ fontSize:16 }}>{h.c.emoji}</span>
              <span style={{ flex:1, fontWeight:700, color:"#333" }}>{h.c.label}</span>
              <span style={{ fontSize:11, fontWeight:800, padding:"2px 10px", borderRadius:10, background:h.status==="accepted"?"#EAF3DE":"#F1EFE8", color:h.status==="accepted"?"#27500A":"#444" }}>{h.status}</span>
              <span style={{ fontSize:11, color:"#aaa" }}>{h.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── VibesTab Component ────────────────────────────────────────────────────────

function computeVibes(expenses) {
  const total = expenses.reduce((s, e) => s + e.amount, 0) || 1;
  const byCat = {};
  expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });

  let score = 0;
  const breakdown = [];

  const foodPts   = Math.round(((byCat.Food  || 0) / total) * 30); breakdown.push({ icon:"🍕", label:"Food delivery ratio",  pts:foodPts,   max:30, color:"#D4537E" }); score += foodPts;
  const entPts    = Math.round(((byCat.Entertainment || 0) / total) * 25); breakdown.push({ icon:"🎮", label:"Entertainment splurge", pts:entPts,    max:25, color:"#7F77DD" }); score += entPts;
  const shopPts   = Math.round(((byCat.Shopping || 0) / total) * 25); breakdown.push({ icon:"🛒", label:"Impulse shopping",      pts:shopPts,   max:25, color:"#EF9F27" }); score += shopPts;
  const transPts  = Math.round(((byCat.Transport || 0) / total) * 10); breakdown.push({ icon:"🚗", label:"Cab dependency",        pts:transPts,  max:10, color:"#378ADD" }); score += transPts;
  const healthPts = Math.round((1 - Math.min(((byCat.Health || 0) / total) * 3, 1)) * 10); breakdown.push({ icon:"💊", label:"Health negligence",     pts:healthPts, max:10, color:"#639922" }); score += healthPts;

  score = Math.min(100, score);
  const level = HORROR_LEVELS.find(l => score >= l.min && score <= l.max) || HORROR_LEVELS[2];
  const moodIdx = score < 25 ? 2 : score < 45 ? 0 : score < 70 ? 3 : 1;
  return { score, level, breakdown, mood: MOODS[moodIdx] };
}

function VibesTab({ expenses }) {
  const { score, level, breakdown, mood } = computeVibes(expenses);
  const [verdictIdx, setVerdictIdx] = useState(() => Math.floor(Math.random() * ALL_VERDICTS.length));
  const verdict = ALL_VERDICTS[verdictIdx];

  const reroll = () => {
    let next;
    do { next = Math.floor(Math.random() * ALL_VERDICTS.length); } while (next === verdictIdx);
    setVerdictIdx(next);
  };

  const ss = {
    card:    { background:"#fff", borderRadius:16, padding:"1.25rem", border:"2px solid #eee" },
    label:   { fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".07em", color:"#aaa", marginBottom:12 },
    songRow: { display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, background:"#fafafa", marginBottom:6 },
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:level.bg, border:`2px solid ${level.color}`, borderRadius:16, padding:"1.25rem", marginBottom:16, display:"flex", gap:14, alignItems:"flex-start" }}>
        <span style={{ fontSize:38 }}>{level.emoji}</span>
        <div>
          <div style={{ fontSize:17, fontWeight:900, color:level.textCol, marginBottom:4 }}>{level.title}</div>
          <div style={{ fontSize:12, color:level.textCol, opacity:.85, lineHeight:1.6 }}>{level.desc}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={ss.card}>
          <div style={ss.label}>Budget Horror Score</div>
          <div style={{ fontSize:62, fontWeight:900, lineHeight:1, color:level.color }}>{score}</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:4 }}>out of 100</div>
          <div style={{ height:14, borderRadius:8, background:"#f0f0f0", overflow:"hidden", margin:"12px 0 5px" }}>
            <div style={{ height:"100%", borderRadius:8, background:level.color, width:`${score}%`, transition:"width 1s cubic-bezier(.22,1,.36,1)" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontWeight:800, color:"#aaa", marginBottom:14 }}>
            <span>Safe</span><span>Demon</span>
          </div>
          {breakdown.map((b, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, marginBottom:7 }}>
              <span style={{ fontSize:16 }}>{b.icon}</span>
              <span style={{ flex:1, fontWeight:700, color:"#333" }}>{b.label}</span>
              <span style={{ fontWeight:900, fontSize:13, color:b.color }}>+{b.pts}</span>
            </div>
          ))}
        </div>

        <div style={ss.card}>
          <div style={ss.label}>Your Spend Mood</div>
          <div style={{ fontSize:50, textAlign:"center", margin:"4px 0 6px" }}>{mood.emoji}</div>
          <div style={{ fontSize:16, fontWeight:900, textAlign:"center", color:"#222", marginBottom:6 }}>{mood.name}</div>
          <div style={{ textAlign:"center", marginBottom:10 }}>
            <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:800, background:mood.genreBg, color:mood.genreCol }}>{mood.genre}</span>
          </div>
          <div style={{ fontSize:12, color:"#666", textAlign:"center", lineHeight:1.6, marginBottom:14 }}>{mood.desc}</div>
          {mood.songs.map((s, i) => (
            <div key={i} style={ss.songRow}>
              <span style={{ fontSize:11, fontWeight:800, color:"#bbb", minWidth:16 }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#222" }}>{s.t}</div>
                <div style={{ fontSize:11, color:"#888" }}>{s.a}</div>
                <div style={{ fontSize:10, fontStyle:"italic", color:"#aaa" }}>"{s.w}"</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...ss.card, marginBottom:16 }}>
        <div style={ss.label}>Today's Verdict</div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:32 }}>{verdict[0]}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:"#222", marginBottom:3 }}>{verdict[1]}</div>
            <div style={{ fontSize:12, color:"#666", lineHeight:1.6 }}>{verdict[2]}</div>
          </div>
        </div>
      </div>

      <button onClick={reroll} style={{ width:"100%", padding:11, borderRadius:24, border:"2px solid #eee", background:"transparent", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", color:"#555" }}>
        🎲 Re-roll verdict
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function ExpenseTracker() {
  const [expenses,        setExpenses]        = useState(SEED);
  const [nextId,          setNextId]          = useState(11);
  const [activeCat,       setActiveCat]       = useState("All");
  const [search,          setSearch]          = useState("");
  const [sort,            setSort]            = useState("date-desc");
  const [modal,           setModal]           = useState(false);
  const [tab,             setTab]             = useState("tracker");
  const [budget,          setBudget]          = useState(10000);
  const [budgetInput,     setBudgetInput]     = useState("10000");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [form, setForm] = useState({ desc:"", amount:"", cat:"Food", date:new Date().toISOString().split("T")[0] });

  const thisM   = new Date().toISOString().slice(0, 7);
  const filtered = expenses
    .filter(e => (activeCat === "All" || e.cat === activeCat) && e.desc.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "date-desc")   return b.date.localeCompare(a.date);
      if (sort === "date-asc")    return a.date.localeCompare(b.date);
      if (sort === "amount-desc") return b.amount - a.amount;
      return a.amount - b.amount;
    });

  const total   = expenses.reduce((s, e) => s + e.amount, 0);
  const monthly = expenses.filter(e => e.date.startsWith(thisM)).reduce((s, e) => s + e.amount, 0);
  const avg     = expenses.length ? total / expenses.length : 0;

  const byCat = {};
  expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const pieData = Object.entries(byCat).map(([cat, value]) => ({ cat, value, color:(CATS[cat]||CATS.Other).chart }));

  const monthMap = {};
  expenses.forEach(e => { const m = e.date.slice(0,7); monthMap[m] = (monthMap[m]||0) + e.amount; });
  const mKeys   = Object.keys(monthMap).sort().slice(-6);
  const mLabels = mKeys.map(m => { const [y,mo] = m.split("-"); return new Date(+y,+mo-1).toLocaleString("en",{month:"short"}); });
  const mVals   = mKeys.map(m => Math.round(monthMap[m]));

  const catTotal = pieData.reduce((s, d) => s + d.value, 0);

  const meme = getActiveMeme(expenses, budget, dismissedAlerts);

  const commitBudget = () => {
    const v = parseFloat(budgetInput);
    if (!isNaN(v) && v > 0) setBudget(v);
  };

  const saveExp = () => {
    if (!form.desc || !form.amount || !form.date) return;
    setExpenses([{ id:nextId, ...form, amount:parseFloat(form.amount) }, ...expenses]);
    setNextId(nextId + 1);
    setModal(false);
    setForm({ desc:"", amount:"", cat:"Food", date:new Date().toISOString().split("T")[0] });
  };

  const delExp = (id) => setExpenses(expenses.filter(e => e.id !== id));

  const METRIC_STYLES = [
    { bg:"#FBEAF0", bd:"#F4C0D1", col:"#72243E" },
    { bg:"#E6F1FB", bd:"#B5D4F4", col:"#0C447C" },
    { bg:"#EAF3DE", bd:"#C0DD97", col:"#27500A" },
    { bg:"#FAEEDA", bd:"#FAC775", col:"#633806" },
  ];
  const METRICS = [
    { label:"Total spent",  val:fmt(total)       },
    { label:"This month",   val:fmt(monthly)     },
    { label:"Transactions", val:expenses.length  },
    { label:"Avg per item", val:fmt(avg)         },
  ];
  const TABS = [
    { id:"tracker", label:"📊 Tracker"        },
    { id:"wheel",   label:"🎲 Challenge Wheel" },
    { id:"vibes",   label:"💀 Horror & Vibes"  },
  ];
  const tabColors = { tracker:"#D4537E", wheel:"#7F77DD", vibes:"#E24B4A" };

  const s = {
    page:      { fontFamily:"'Nunito',sans-serif", padding:"1.5rem 0" },
    header:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem", flexWrap:"wrap", gap:10 },
    title:     { fontSize:24, fontWeight:900, color:"#222", letterSpacing:"-.5px" },
    addBtn:    { display:"flex", alignItems:"center", gap:6, padding:"10px 20px", background:"#D4537E", color:"#fff", border:"none", borderRadius:24, cursor:"pointer", fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif" },
    tabRow:    { display:"flex", gap:8, marginBottom:"1.5rem", flexWrap:"wrap" },
    metrics:   { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:"1.5rem" },
    catRow:    { display:"flex", gap:7, flexWrap:"wrap", marginBottom:"1.25rem" },
    filterRow: { display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:"1.25rem" },
    fi:        { height:36, fontSize:13, padding:"0 12px", borderRadius:20, border:"2px solid #ddd", fontFamily:"'Nunito',sans-serif", fontWeight:700 },
    chartsRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:"1.5rem" },
    chartCard: { background:"#fff", borderRadius:16, padding:"1rem 1.25rem", border:"2px solid #eee" },
    chartTitle:{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:"#888", marginBottom:10 },
    tableWrap: { borderRadius:16, overflow:"hidden", border:"2px solid #eee", background:"#fff" },
    th:        { padding:"10px 14px", textAlign:"left", fontWeight:800, fontSize:11, textTransform:"uppercase", letterSpacing:".06em", color:"#888", borderBottom:"2px solid #eee", background:"#fafafa" },
    td:        { padding:"10px 14px", borderBottom:"1px solid #f0f0f0", fontWeight:700, fontSize:13 },
    overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
    modal:     { background:"#fff", borderRadius:20, padding:"1.5rem", width:340, maxWidth:"90vw", border:"3px solid #D4537E" },
    fLabel:    { display:"block", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"#888", marginBottom:5 },
    fInput:    { width:"100%", height:38, padding:"0 12px", borderRadius:12, border:"2px solid #ddd", fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:700, marginBottom:12 },
    legendRow: { display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 },
    legItem:   { display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:800, color:"#666" },
    legDot:    { width:10, height:10, borderRadius:3, flexShrink:0 },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wobble { from { transform:rotate(-4deg) scale(1); } to { transform:rotate(4deg) scale(1.08); } }
        .meme-face { animation: wobble 1.2s ease-in-out infinite alternate; display:block; }
        .meme-banner { animation: slideDown .4s cubic-bezier(.22,1,.36,1); }
      `}</style>

      <div style={s.page}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.title}>✨ My <span style={{ color:"#D4537E" }}>Expenses</span></div>
          {tab === "tracker" && (
            <button style={s.addBtn} onClick={() => setModal(true)}>+ Add expense</button>
          )}
        </div>

        {/* Tabs */}
        <div style={s.tabRow}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"9px 20px", borderRadius:24,
              border: tab === t.id ? "none" : "2px solid #eee",
              background: tab === t.id ? tabColors[t.id] : "#fff",
              color: tab === t.id ? "#fff" : "#888",
              fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── TRACKER TAB ── */}
        {tab === "tracker" && <>

          {/* Budget bar */}
          <BudgetBar
            budget={budget}
            budgetInput={budgetInput}
            monthly={monthly}
            onBudgetChange={setBudgetInput}
            onBudgetCommit={commitBudget}
          />

          {/* Meme alert */}
          {meme && (
            <div className="meme-banner" style={{ position:"relative", borderRadius:16, border:`2.5px dashed ${meme.bd}`, padding:"1rem 1.25rem", marginBottom:"1.25rem", background:meme.bg, textAlign:"center" }}>
              <button onClick={() => setDismissedAlerts(d => [...d, meme.key])} style={{ position:"absolute", top:10, right:12, background:"none", border:"none", fontSize:18, cursor:"pointer", color:meme.textCol, opacity:.6 }}>✕</button>
              <span className="meme-face" style={{ fontSize:52, marginBottom:6 }}>{meme.face}</span>
              <div style={{ fontSize:17, fontWeight:900, color:meme.textCol, marginBottom:6 }}>{meme.title}</div>
              <div style={{ fontSize:12, color:meme.textCol, opacity:.85, lineHeight:1.6, marginBottom:10 }}>{meme.sub}</div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:meme.color, color:"#fff", fontSize:12, fontWeight:900 }}>
                {meme.pct}% of budget used — {fmt(meme.spent)} / {fmt(meme.budget)}
              </span>
            </div>
          )}

          {/* Metrics */}
          <div style={s.metrics}>
            {METRICS.map((m, i) => (
              <div key={i} style={{ borderRadius:16, padding:"14px 16px", background:METRIC_STYLES[i].bg, border:`2.5px solid ${METRIC_STYLES[i].bd}` }}>
                <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".06em", color:METRIC_STYLES[i].col, opacity:.8, marginBottom:5 }}>{m.label}</div>
                <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-.5px", color:METRIC_STYLES[i].col }}>{m.val}</div>
              </div>
            ))}
          </div>

          {/* Category pills */}
          <div style={s.catRow}>
            {["All", ...Object.keys(CATS)].map(c => {
              const active = activeCat === c, cs = CATS[c];
              const bg  = active ? (c==="All"?"#D4537E":cs.chart) : (c==="All"?"#FBEAF0":cs.bg);
              const col = active ? "#fff" : (c==="All"?"#72243E":cs.text);
              const bd  = active ? "transparent" : (c==="All"?"#F4C0D1":cs.bd);
              return (
                <button key={c} onClick={() => setActiveCat(c)} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:800, cursor:"pointer", border:`2px solid ${bd}`, background:bg, color:col, fontFamily:"'Nunito',sans-serif" }}>{c}</button>
              );
            })}
          </div>

          {/* Filter row */}
          <div style={s.filterRow}>
            <input style={{ ...s.fi, width:190 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            <select style={s.fi} value={sort} onChange={e => setSort(e.target.value)}>
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
                {pieData.map(d => (
                  <span key={d.cat} style={s.legItem}>
                    <span style={{ ...s.legDot, background:d.color }} />
                    {d.cat} {catTotal ? Math.round(d.value/catTotal*100) : 0}%
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
                <tr>{["Description","Category","Date","Amount",""].map((h,i) => <th key={i} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign:"center", padding:"2rem", color:"#999", fontWeight:700 }}>Nothing here yet!</td></tr>
                  : filtered.map(e => {
                    const cs = CATS[e.cat] || CATS.Other;
                    return (
                      <tr key={e.id}>
                        <td style={s.td}>{e.desc}</td>
                        <td style={s.td}><span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800, background:cs.bg, color:cs.text, border:`1.5px solid ${cs.bd}` }}>{e.cat}</span></td>
                        <td style={{ ...s.td, color:"#888" }}>{e.date}</td>
                        <td style={{ ...s.td, fontWeight:900, color:"#A32D2D" }}>{fmt(e.amount)}</td>
                        <td style={s.td}><button onClick={() => delExp(e.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#E24B4A", fontSize:15, padding:"3px 7px" }} aria-label="Delete">🗑</button></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── WHEEL TAB ── */}
        {tab === "wheel" && <WheelTab />}

        {/* ── VIBES TAB ── */}
        {tab === "vibes" && <VibesTab expenses={expenses} />}

        {/* Modal */}
        {modal && (
          <div style={s.overlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
            <div style={s.modal}>
              <div style={{ fontSize:18, fontWeight:900, color:"#D4537E", marginBottom:"1.25rem" }}>🧾 New expense</div>
              <label style={s.fLabel}>Description</label>
              <input style={s.fInput} placeholder="e.g. Zomato dinner" value={form.desc} onChange={e => setForm({...form, desc:e.target.value})} />
              <label style={s.fLabel}>Amount (₹)</label>
              <input style={s.fInput} type="number" min="0" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} />
              <label style={s.fLabel}>Category</label>
              <select style={s.fInput} value={form.cat} onChange={e => setForm({...form, cat:e.target.value})}>
                {Object.keys(CATS).map(c => <option key={c}>{c}</option>)}
              </select>
              <label style={s.fLabel}>Date</label>
              <input style={s.fInput} type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} />
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
                <button style={{ padding:"9px 18px", border:"2px solid #ddd", background:"transparent", borderRadius:20, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }} onClick={() => setModal(false)}>Cancel</button>
                <button style={{ padding:"9px 20px", background:"#D4537E", color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontSize:13, fontWeight:900, fontFamily:"'Nunito',sans-serif" }} onClick={saveExp}>Save it!</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}