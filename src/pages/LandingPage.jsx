import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, Eye, Database, Shield, Server, Search, ExternalLink, Home, Radio, FileText, MapPin, Clock } from 'lucide-react';

const CRIME_KEYWORDS = [
  "murder","killed","death","dead","body found","theft","robbery","burglary","stolen","loot",
  "arrested","arrest","custody","detained","fir","case registered","complaint filed",
  "rape","assault","attack","molest","scam","fraud","cheated","swindle","kidnap","abduct",
  "missing","drug","narcotics","smuggling","accident","hit and run","crash","fire","arson",
  "riot","violence","clash","extortion","blackmail","shoot","shot","gun","stab","knife",
  "police","crime",
];

const KW_COLORS = {
  murder:'#ef4444',killed:'#ef4444',death:'#ef4444',dead:'#ef4444',
  theft:'#f97316',robbery:'#f97316',burglary:'#f97316',stolen:'#f97316',loot:'#f97316',
  arrested:'#8b5cf6',arrest:'#8b5cf6',police:'#8b5cf6',fir:'#8b5cf6',custody:'#8b5cf6',
  accident:'#06b6d4',crash:'#06b6d4','hit and run':'#06b6d4',
  fire:'#f59e0b',arson:'#f59e0b',
  drug:'#10b981',narcotics:'#10b981',smuggling:'#10b981',
  fraud:'#ec4899',scam:'#ec4899',cheated:'#ec4899',
  stab:'#ef4444',shoot:'#ef4444',shot:'#ef4444',gun:'#ef4444',knife:'#ef4444',
  missing:'#a78bfa',kidnap:'#a78bfa',abduct:'#a78bfa',
  default:'#e63946',
};

function getKwColor(kw) { return KW_COLORS[(kw||'').toLowerCase()] || KW_COLORS.default; }

const DEFAULT_LOCATION = 'Uttam Nagar';

const MOCK_NEWS = [
  { source:'Hindustan Times', title:'Bike-borne snatchers held after chase in Uttam Nagar', summary:'Delhi Police nabbed two bike-borne snatchers in Uttam Nagar after a high-speed chase. The duo had snatched a mobile phone from a woman near Uttam Nagar West metro station. The accused have three prior cases.', matched_keyword:'arrested', link:'https://www.hindustantimes.com/cities/delhi-news', published:'Wed, 25 Mar 2026 09:14:00 +0530' },
  { source:'Times of India', title:'Car theft ring busted; 3 arrested from Uttam Nagar locality', summary:'A three-member car theft syndicate operating across west Delhi was dismantled after police arrested the accused from a rented flat in Uttam Nagar. Stolen vehicles worth ₹40 lakh recovered from an underground garage.', matched_keyword:'theft', link:'https://timesofindia.indiatimes.com', published:'Tue, 24 Mar 2026 18:45:00 +0530' },
  { source:'NDTV', title:'FIR filed against property dealer in Uttam Nagar cheating case', summary:'A case of fraud has been registered against a property dealer in Uttam Nagar who allegedly collected deposits from multiple tenants for the same flat. Police have detained the accused for further questioning.', matched_keyword:'fraud', link:'https://feeds.feedburner.com/ndtvnews-cities-news', published:'Tue, 24 Mar 2026 11:22:00 +0530' },
  { source:'Indian Express', title:'Man stabbed during parking dispute in Uttam Nagar', summary:'A 34-year-old man was stabbed multiple times after a heated dispute over a parking spot in the Bindapur area of Uttam Nagar. The victim is recovering at DDU Hospital; one suspect arrested from nearby.', matched_keyword:'stab', link:'https://indianexpress.com/section/cities/delhi', published:'Mon, 23 Mar 2026 22:10:00 +0530' },
  { source:'India Today', title:'Drug peddler held with heroin near Uttam Nagar bus depot', summary:'Acting on a tip-off, Delhi Police Special Staff seized 120 grams of heroin from a peddler near the Uttam Nagar bus depot. The accused has three prior narcotics cases and is being interrogated.', matched_keyword:'drug', link:'https://www.indiatoday.in', published:'Mon, 23 Mar 2026 14:55:00 +0530' },
];

function timeAgo(pub) {
  if (!pub) return '';
  try {
    const diff = (Date.now() - new Date(pub)) / 1000;
    if (diff < 3600) return `${Math.round(diff/60)}m ago`;
    if (diff < 86400) return `${Math.round(diff/3600)}h ago`;
    return `${Math.round(diff/86400)}d ago`;
  } catch { return ''; }
}

/* ── Crime Feed Panel ─────────────────────────────────────── */
function CrimeFeedPanel() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [inputVal, setInputVal] = useState(DEFAULT_LOCATION);
  const [articles, setArticles] = useState(MOCK_NEWS);
  const [loading, setLoading] = useState(false);
  const [activeKw, setActiveKw] = useState(null);

  const allKws = [...new Set(articles.map(a=>a.matched_keyword).filter(Boolean))];
  const visible = activeKw ? articles.filter(a=>a.matched_keyword===activeKw) : articles;

  async function fetchNews(loc) {
    setLoading(true); setActiveKw(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          messages:[{ role:'user', content:`You are a Delhi crime news aggregator. Generate 5 realistic crime news articles for the Delhi neighbourhood "${loc}".
Respond ONLY with valid JSON (no markdown):
{"articles":[{"source":"Hindustan Times","title":"...","summary":"2-3 sentences specific to ${loc}, Delhi...","matched_keyword":"one of: murder|theft|arrested|fraud|drug|stab|accident|fire|missing|assault","link":"https://www.hindustantimes.com/cities/delhi-news","published":"Wed, 25 Mar 2026 10:00:00 +0530"}]}
Use varied sources: Hindustan Times, Times of India, NDTV, Indian Express, India Today. Make each unique and journalistic.`}],
        }),
      });
      const data = await res.json();
      const text = (data.content||[]).map(b=>b.text||'').join('');
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setArticles(parsed.articles||MOCK_NEWS);
    } catch { setArticles(MOCK_NEWS); }
    finally { setLoading(false); }
  }

  function handleSearch() {
    const loc = inputVal.trim()||DEFAULT_LOCATION;
    setLocation(loc); fetchNews(loc);
  }

  return (
    <div style={{
      background:'linear-gradient(180deg, rgba(8,11,24,0.96) 0%, rgba(5,8,18,0.98) 100%)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:24,
      overflow:'hidden',
      display:'flex',
      flexDirection:'column',
      height:'min(100%, 72vh)',
      maxHeight:'72vh',
      minHeight:0,
      position:'relative',
      boxShadow:'0 32px 80px rgba(2,6,23,0.38), 0 0 0 1px rgba(255,255,255,0.03) inset',
    }}>
      {/* grid bg */}
      <div style={{ position:'absolute', inset:0, opacity:0.03, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(56,189,248,0.9) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.9) 1px,transparent 1px)',
        backgroundSize:'34px 34px' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent 34%), radial-gradient(circle at bottom left, rgba(99,102,241,0.1), transparent 32%)' }} />

      {/* Header */}
      <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'relative', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:10, border:'1px solid rgba(34,211,238,0.25)', background:'rgba(15,23,42,0.78)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px rgba(34,211,238,0.08)' }}>
              <Radio style={{ width:13, height:13, color:'#22d3ee' }} />
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#22d3ee', boxShadow:'0 0 10px rgba(34,211,238,0.95)', animation:'blink 2s infinite', flexShrink:0 }} />
                <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#67e8f9', letterSpacing:2.6, textTransform:'uppercase' }}>
                  Live Intel Feed
                </span>
              </div>
              <div style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:18, color:'#f8fafc', marginTop:4, fontWeight:700, lineHeight:1.1 }}>
                Delhi incident pulse
              </div>
            </div>
          </div>
          <div style={{ padding:'6px 9px', borderRadius:999, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(15,23,42,0.72)', fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#94a3b8', letterSpacing:1.2, whiteSpace:'nowrap' }}>
            {articles.length} live items
          </div>
        </div>

        {/* Search row */}
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ flex:1, position:'relative' }}>
            <MapPin style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:13, height:13, color:'#38bdf8', flexShrink:0 }} />
            <input
              value={inputVal}
              onChange={e=>setInputVal(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleSearch()}
              placeholder="Search neighbourhood…"
              style={{ width:'100%', background:'rgba(15,23,42,0.82)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:12, padding:'9px 12px 9px 32px', color:'#e2e8f0', fontSize:11,
                fontFamily:'"IBM Plex Mono",monospace', outline:'none', boxSizing:'border-box' }}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} style={{
            background:loading?'rgba(34,211,238,0.2)':'linear-gradient(135deg, rgba(34,211,238,0.95), rgba(59,130,246,0.95))', border:'1px solid rgba(103,232,249,0.25)', borderRadius:12,
            padding:'9px 14px', color:'#03111d', fontFamily:'"IBM Plex Mono",monospace', fontSize:10,
            fontWeight:700, letterSpacing:1.5, cursor:loading?'wait':'pointer', display:'flex',
            alignItems:'center', gap:5, whiteSpace:'nowrap', transition:'all 0.2s',
            boxShadow:loading?'none':'0 10px 24px rgba(14,165,233,0.22)',
          }}>
            {loading
              ? <span style={{ display:'inline-block', width:11, height:11, border:'2px solid rgba(3,17,29,0.18)', borderTopColor:'#03111d', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
              : <Search style={{ width:11, height:11 }} />}
            {loading?'…':'SCAN'}
          </button>
        </div>

        {/* KW pills */}
        {allKws.length>0 && (
          <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
            <button onClick={()=>setActiveKw(null)} style={{ padding:'3px 9px', borderRadius:999, fontSize:8.5, fontFamily:'"IBM Plex Mono",monospace', letterSpacing:1.1, border:`1px solid ${activeKw===null?'rgba(34,211,238,0.45)':'rgba(255,255,255,0.08)'}`, background:activeKw===null?'rgba(34,211,238,0.12)':'rgba(255,255,255,0.02)', color:activeKw===null?'#67e8f9':'#64748b', cursor:'pointer', transition:'all 0.15s', textTransform:'uppercase' }}>All</button>
            {allKws.map(kw=>{
              const c=getKwColor(kw); const on=activeKw===kw;
              return <button key={kw} onClick={()=>setActiveKw(on?null:kw)} style={{ padding:'3px 9px', borderRadius:999, fontSize:8.5, fontFamily:'"IBM Plex Mono",monospace', letterSpacing:1.1, textTransform:'uppercase', border:`1px solid ${on?c:'rgba(255,255,255,0.07)'}`, background:on?`${c}1a`:'rgba(255,255,255,0.02)', color:on?c:'#64748b', cursor:'pointer', transition:'all 0.15s' }}>{kw}</button>;
            })}
          </div>
        )}
      </div>

      {/* Location label */}
      <div style={{ padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'rgba(255,255,255,0.015)' }}>
        <span style={{ fontFamily:'"IBM Plex Sans",sans-serif', fontSize:11, color:'#64748b' }}>
          Tracking{' '}<span style={{ color:'#e2e8f0', fontWeight:600 }}>{location}</span>
        </span>
        <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#475569' }}>
          {visible.length}/{articles.length}
        </span>
      </div>

      {/* Articles scroll */}
      <div className="crime-scroll" style={{ flex:1, overflowY:'auto', padding:'8px' }}>
        {loading ? (
          [...Array(5)].map((_,i)=>(
            <div key={i} style={{ height:68, background:'rgba(255,255,255,0.03)', borderRadius:14, marginBottom:6, animation:'shimmer 1.5s infinite' }} />
          ))
        ) : visible.map((art,i)=>{
          const c=getKwColor(art.matched_keyword);
          return (
            <div key={i}
              style={{ margin:'0 0 6px', padding:'10px 12px', background:'rgba(15,23,42,0.66)', border:'1px solid rgba(255,255,255,0.06)', borderLeft:`2px solid ${c}`, borderRadius:14, transition:'all 0.18s', cursor:'default', boxShadow:'0 12px 24px rgba(2,6,23,0.12)' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(15,23,42,0.9)'; e.currentTarget.style.transform='translateY(-1px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(15,23,42,0.66)'; e.currentTarget.style.transform='translateY(0)';}}
            >
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5, flexWrap:'wrap' }}>
                <span style={{ padding:'2px 7px', borderRadius:999, fontSize:8, fontFamily:'"IBM Plex Mono",monospace', textTransform:'uppercase', letterSpacing:1.1, background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>{art.source}</span>
                <span style={{ padding:'2px 7px', borderRadius:999, fontSize:8, fontFamily:'"IBM Plex Mono",monospace', textTransform:'uppercase', letterSpacing:1.1, background:`${c}16`, color:c, border:`1px solid ${c}35` }}>{art.matched_keyword}</span>
                <span style={{ marginLeft:'auto', fontFamily:'"IBM Plex Mono",monospace', fontSize:8, color:'#64748b', display:'flex', alignItems:'center', gap:3, whiteSpace:'nowrap' }}>
                  <Clock style={{ width:8, height:8 }} />{timeAgo(art.published)}
                </span>
              </div>
              <div style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:12, fontWeight:700, color:'#f8fafc', lineHeight:1.28, marginBottom:3 }}>
                {art.title}
              </div>
              <div style={{ fontFamily:'"IBM Plex Sans",sans-serif', fontSize:10, color:'#94a3b8', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:5 }}>
                {art.summary}
              </div>
              <a href={art.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:8.5, color:c, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:3, opacity:0.82 }}>
                Read article <ExternalLink style={{ width:8, height:8 }} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding:'7px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', flexShrink:0, background:'rgba(255,255,255,0.015)' }}>
        <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:8.5, color:'#475569', letterSpacing:1.2 }}>
          SOURCES · HT · IE · NDTV · TOI · INDIA TODAY
        </span>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.7}}
        .crime-scroll::-webkit-scrollbar{width:3px}
        .crime-scroll::-webkit-scrollbar-track{background:transparent}
        .crime-scroll::-webkit-scrollbar-thumb{background:rgba(230,57,70,0.25);border-radius:2px}
      `}</style>
    </div>
  );
}

/* ── Cyber Card ───────────────────────────────────────────── */
const CyberCard = ({ title, icon, desc, glowColor }) => {
  const t = {
    cyan:  { text:'text-cyan-400',   ring:'group-hover:ring-cyan-500/50',   shadow:'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',   glow:'from-transparent via-cyan-500/10 to-transparent' },
    violet:{ text:'text-violet-400', ring:'group-hover:ring-violet-500/50', shadow:'hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]', glow:'from-transparent via-violet-500/10 to-transparent' },
    blue:  { text:'text-blue-400',   ring:'group-hover:ring-blue-500/50',   shadow:'hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]',   glow:'from-transparent via-blue-500/10 to-transparent' },
  }[glowColor]||{text:'text-cyan-400',ring:'',shadow:'',glow:''};
  return (
    <div className={`relative group p-8 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-white/20 ${t.shadow}`}>
      <div className={`absolute -inset-1 bg-gradient-to-r ${t.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`p-4 bg-slate-800 rounded-2xl w-fit mb-6 ring-1 ring-white/10 ${t.ring} transition-all duration-500`}>
          {React.cloneElement(icon, { className:`w-8 h-8 ${t.text}` })}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
};

/* ── Pulse Ticker ─────────────────────────────────────────── */
const CyberPulseTicker = () => (
  <div className="w-full bg-slate-900/80 backdrop-blur-xl border-t border-b border-b-white/5" style={{ borderTopColor:'rgba(34,211,238,0.4)' }}>
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white font-bold tracking-wider">
        <Activity className="w-5 h-5 text-cyan-400" />
        <span>SYS.TELEMETRY</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 flex-1 px-8">
        {[['GRID STATUS','NOMINAL','text-cyan-400'],['ACTIVE NODES','14,204','text-blue-400'],['THREAT LEVEL','ALPHA ZERO','text-green-400'],['DATA STREAM','2.4 PB/S','text-violet-400']].map(([l,v,c])=>(
          <div key={l} className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold tracking-widest">{l}</span>
            <span className={`text-sm font-mono tracking-wider ${c}`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-slate-400 font-mono">REC</span>
      </div>
    </div>
  </div>
);

/* ── Report Modal ─────────────────────────────────────────── */
function ReportModal({ onClose }) {
  const [form, setForm] = useState({ location:'', category:'Infrastructure', desc:'' });
  const [submitted, setSubmitted] = useState(false);
  function submit() {
    if (!form.location||!form.desc) return;
    setSubmitted(true);
    setTimeout(onClose, 2400);
  }
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#0b0d1a', border:'1px solid rgba(99,102,241,0.28)', borderRadius:20, padding:32, width:'100%', maxWidth:460, boxShadow:'0 0 80px rgba(99,102,241,0.12)', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'#666', width:28, height:28, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:'"IBM Plex Mono",monospace', color:'#10b981', fontSize:12, letterSpacing:2 }}>REPORT FILED SUCCESSFULLY</div>
            <div style={{ color:'#444', fontSize:12, marginTop:6, fontFamily:'"IBM Plex Sans",sans-serif' }}>Ticket dispatched to civic authority.</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#6366f1', letterSpacing:3, textTransform:'uppercase', marginBottom:5 }}>Civic Issue Report</div>
            <h3 style={{ fontFamily:'"Playfair Display",serif', color:'#fff', fontSize:22, marginBottom:20, fontWeight:700 }}>Report an Issue</h3>
            {[{label:'Location / Area',key:'location',placeholder:'e.g. Uttam Nagar, Sector 12'}].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#555', letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>{f.label}</label>
                <input placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm(x=>({...x,[f.key]:e.target.value}))} style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, fontFamily:'"IBM Plex Sans",sans-serif', outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#555', letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>Category</label>
              <select value={form.category} onChange={e=>setForm(x=>({...x,category:e.target.value}))} style={{ width:'100%', background:'#13152a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, fontFamily:'"IBM Plex Sans",sans-serif', outline:'none', boxSizing:'border-box' }}>
                {['Infrastructure','Road Damage','Water Supply','Electricity','Sanitation','Public Safety','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontFamily:'"IBM Plex Mono",monospace', fontSize:9, color:'#555', letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>Description</label>
              <textarea rows={3} placeholder="Describe the issue…" value={form.desc} onChange={e=>setForm(x=>({...x,desc:e.target.value}))} style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, fontFamily:'"IBM Plex Sans",sans-serif', outline:'none', resize:'none', boxSizing:'border-box' }} />
            </div>
            <button onClick={submit} style={{ width:'100%', background:'#6366f1', border:'none', borderRadius:10, padding:'12px 0', color:'#fff', fontFamily:'"IBM Plex Mono",monospace', fontWeight:700, fontSize:11, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
              Submit Report →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Mobile Bottom Nav ────────────────────────────────────── */
function MobileBottomNav({ onReport }) {
  const [active, setActive] = useState('home');
  const tabs = [
    { id:'home',   icon:<Home style={{width:20,height:20}} />,    label:'Home',   color:'#06b6d4' },
    { id:'crime',  icon:<Radio style={{width:20,height:20}} />,   label:'Crime',  color:'#e63946' },
    { id:'report', icon:<FileText style={{width:20,height:20}} />,label:'Report', color:'#6366f1' },
  ];
  function go(id) {
    setActive(id);
    if (id==='home') window.scrollTo({top:0,behavior:'smooth'});
    if (id==='crime') document.getElementById('mobile-crime')?.scrollIntoView({behavior:'smooth'});
    if (id==='report') onReport();
  }
  return (
    <nav className="mobile-nav" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'rgba(4,6,16,0.97)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-around', alignItems:'center', padding:'10px 0 14px' }}>
      {tabs.map(tab=>{
        const on=active===tab.id;
        return (
          <button key={tab.id} onClick={()=>go(tab.id)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'4px 24px', color:on?tab.color:'#2e2e3a', transition:'all 0.2s', position:'relative' }}>
            {on && <span style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:28, height:2, background:tab.color, borderRadius:2, boxShadow:`0 0 10px ${tab.color}` }} />}
            {tab.icon}
            <span style={{ fontFamily:'"IBM Plex Mono",monospace', fontSize:9, letterSpacing:1, textTransform:'uppercase' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */
function HeroSection({ onReport }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-white/10 pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/25 rounded-full blur-[160px] pointer-events-none" />

      {/* ── DESKTOP two-column ── */}
      <div className="hidden lg:flex items-stretch max-w-7xl mx-auto px-8 gap-10 min-h-[680px] py-16">
        {/* LEFT: Crime Panel */}
        <div style={{ width:400, flexShrink:0 }}>
          <CrimeFeedPanel />
        </div>

        {/* RIGHT: Hero copy */}
        <div className="flex flex-col justify-center flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8 backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-sm font-medium tracking-wide uppercase">System Online</span>
          </div>

          <h1 className="text-6xl xl:text-[5.5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight leading-[1.05]">
            CityScope<br />
            <span className="text-cyan-400" style={{ textShadow:'0 0 60px rgba(34,211,238,0.25)' }}>Neural Nexus</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-lg font-light leading-relaxed">
            The autonomous cyber-intelligence core. Real-time urban analytics driven by predictive machine learning and live crime feeds.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] text-sm"
            >
              Initialize Dashboard
            </button>
            <button
              onClick={() => navigate('/map')}
              className="px-7 py-3.5 rounded-xl bg-slate-800/50 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-medium transition-all hover:bg-slate-800/80 text-sm"
            >
              View Live Intel
            </button>
            <button onClick={onReport} className="px-7 py-3.5 rounded-xl bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-all text-sm">
              Report Civic Issue
            </button>
          </div>

          <div className="flex gap-10 mt-12 pt-8 border-t border-white/5">
            {[['14.2K','Active Nodes'],['5','News Sources'],['24/7','Live Monitoring']].map(([n,l])=>(
              <div key={l}>
                <div className="text-2xl font-bold text-white font-mono">{n}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE stacked ── */}
      <div className="lg:hidden flex flex-col items-center text-center px-6 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 text-sm font-medium tracking-wide uppercase">System Online</span>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 mb-4 tracking-tight">
          CityScope<br /><span className="text-cyan-400">Neural Nexus</span>
        </h1>
        <p className="text-lg text-slate-400 mb-8 font-light max-w-sm">
          Autonomous cyber-intelligence. Real-time urban analytics.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm"
          >
            Initialize Dashboard
          </button>
          <button
            onClick={() => navigate('/map')}
            className="w-full px-7 py-3.5 rounded-xl bg-slate-800/50 border border-white/10 text-white font-medium text-sm"
          >
            View Live Intel
          </button>
          <button onClick={onReport} className="w-full px-7 py-3.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium text-sm">Report Civic Issue</button>
        </div>
      </div>

      {/* City wireframe strip — desktop */}
      <div className="hidden lg:block h-28 opacity-15 pointer-events-none overflow-hidden relative">
        <div className="absolute inset-0 flex items-end gap-px px-4">
          {[...Array(80)].map((_,i)=>(
            <div key={i} className="flex-1 border-l border-t border-cyan-500/25 bg-slate-900/20" style={{ height:`${15+((i*41+i*i*13)%75)}%` }} />
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/60" style={{ boxShadow:'0 0 12px rgba(34,211,238,0.6)' }} />
      </div>
    </section>
  );
}

/* ── Mobile Crime Section ─────────────────────────────────── */
function MobileCrimeSection() {
  return (
    <section id="mobile-crime" className="lg:hidden py-14 px-5 border-t border-white/5">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-300 text-xs font-mono tracking-widest uppercase">Live Intel</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Crime Feed</h2>
        <p className="text-slate-500 text-sm">Search any Delhi neighbourhood.</p>
      </div>
      <div style={{ height:540 }}>
        <CrimeFeedPanel />
      </div>
    </section>
  );
}

/* ── Main App ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [showReport, setShowReport] = useState(false);
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Bg glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-indigo-950/30 blur-[180px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-950/20 blur-[180px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#020617]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tighter">CITY<span className="text-cyan-400">SCOPE</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Intel Map</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Nodes</a>
            <a href="#systems" className="hover:text-cyan-400 transition-colors">Systems</a>
          </div>
          <button onClick={()=>setShowReport(true)} className="hidden md:block px-5 py-2.5 rounded-lg border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/10 transition-all text-sm">
            Report Issue
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <HeroSection onReport={()=>setShowReport(true)} />
        <CyberPulseTicker />

        {/* Core Protocols */}
        <section id="systems" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Protocols</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The foundational systems that interpret raw urban data into actionable directives.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <CyberCard title="Sensory Grid"      icon={<Eye />}      desc="Millions of urban data points collected via decentralised IOT networks to form a complete operational picture." glowColor="cyan" />
            <CyberCard title="Neural Analysis"   icon={<Database />} desc="Deep learning clusters process environmental, transit, and social telemetry to predict urban anomalies in real-time." glowColor="violet" />
            <CyberCard title="Autonomous Action" icon={<Shield />}   desc="Automated infrastructure response protocols deploy countermeasures before critical failures occur." glowColor="blue" />
          </div>
        </section>

        {/* Intel Map */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="relative w-full h-[500px] rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
            <div className="text-center relative z-10 transition-transform duration-700 group-hover:scale-105">
              <Server className="w-16 h-16 text-cyan-400/50 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4 text-white">Dark Intelligence Map</h3>
              <p className="text-slate-400 max-w-lg mx-auto">Visualising the heartbeat of the city. A living organism of interconnected data layers pulsating in real-time.</p>
              <div className="mt-8 inline-flex items-center gap-2 text-cyan-400 font-mono text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                CONNECTING TO GEOSPATIAL CLUSTERS...
              </div>
            </div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
          </div>
        </section>

        {/* Mobile crime section */}
        <MobileCrimeSection />
      </main>

      <footer className="border-t border-white/10 bg-[#020617]/80 backdrop-blur-xl py-12 text-center text-slate-500 relative z-10 pb-28 lg:pb-12">
        <p className="font-mono text-sm tracking-widest">© 2026 CITYSCOPE NEURAL NETWORK.</p>
        <p className="text-xs mt-2 text-slate-600">UNAUTHORIZED ACCESS WILL BE LOGGED AND TRACED.</p>
      </footer>

      {showReport && <ReportModal onClose={()=>setShowReport(false)} />}
      <MobileBottomNav onReport={()=>setShowReport(true)} />

      <style>{`
        @media(min-width:1024px){.mobile-nav{display:none!important}}
      `}</style>
    </div>
  );
}
