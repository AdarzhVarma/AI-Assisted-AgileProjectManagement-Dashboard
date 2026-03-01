import { useState, useContext, createContext } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, LineChart, Line } from "recharts";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const DARK = {
  id: "dark",
  bg:        "#0F1117",
  surface:   "#171C28",
  surface2:  "#1E2535",
  border:    "#28334A",
  border2:   "#323D52",
  text:      "#C8D3E4",
  textSub:   "#8896AA",
  textDim:   "#4A5568",
  accent:    "#5B9CF6",   // calm blue
  green:     "#4FA87A",   // muted green
  yellow:    "#C8952A",   // warm amber
  red:       "#C9534F",   // muted red
  purple:    "#8878C3",   // softer purple
  gridLine:  "rgba(91,156,246,0.035)",
  scrollbar: "#28334A",
};
const LIGHT = {
  id: "light",
  bg:        "#F4F7FB",
  surface:   "#FFFFFF",
  surface2:  "#EBF0F8",
  border:    "#D2DAEA",
  border2:   "#C4CEDC",
  text:      "#1C2A3E",
  textSub:   "#5A6A82",
  textDim:   "#9BAAB8",
  accent:    "#2A6FCC",
  green:     "#2D7A52",
  yellow:    "#9E6C10",
  red:       "#B53530",
  purple:    "#5B47A8",
  gridLine:  "rgba(42,111,204,0.04)",
  scrollbar: "#D2DAEA",
};

// Dev colors per theme — calmer palette
const DEV_COLORS = {
  dark:  ["#5B9CF6","#C9534F","#4FA87A","#C8952A"],
  light: ["#2A6FCC","#B53530","#2D7A52","#9E6C10"],
};

const ThemeCtx = createContext(DARK);
const useT = () => useContext(ThemeCtx);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SPRINT_CONFIG = { name:"Sprint 4", totalDays:14, currentDay:7, startDate:"Feb 17, 2026", endDate:"Mar 2, 2026", goal:"Complete Auth system, API layer & QA foundation" };

const INIT_DEVS = [
  { id:1, name:"Arjun Mehta",  role:"Frontend Dev", avatar:"AM", colorIdx:0, mood:"crushing",   streak:5, leaves:[{day:3,reason:"Sick leave"}],
    tasks:[
      {id:"t1",name:"Auth Module",         category:"Feature",     storyPoints:8, completedPoints:7, status:"on-track",    eta:"1 day",  assignedTo:1, blockers:[], daily:[{d:"D1",p:2},{d:"D2",p:2},{d:"D3",p:0},{d:"D4",p:1},{d:"D5",p:1},{d:"D6",p:1},{d:"D7",p:0}], notes:"Token refresh logic nearly complete."},
      {id:"t2",name:"Login UI Components", category:"UI",          storyPoints:6, completedPoints:6, status:"completed",   eta:"Done ✓", assignedTo:1, blockers:[], daily:[{d:"D1",p:2},{d:"D2",p:2},{d:"D3",p:0},{d:"D4",p:2},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Shipped and in review."},
      {id:"t3",name:"Session Management",  category:"Feature",     storyPoints:5, completedPoints:1, status:"at-risk",     eta:"8 days", assignedTo:1, blockers:[{id:"b1",desc:"Unclear spec on session timeout rules",since:"D4",assignedTo:"PM",reason:"PM hasn't responded in 3 days",status:"open"}], daily:[{d:"D1",p:0},{d:"D2",p:0},{d:"D3",p:0},{d:"D4",p:1},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Blocked pending spec clarification."},
    ], dependencies:[], githubCommits:12, prsOpen:2, prsReviewed:3,
  },
  { id:2, name:"Sara Kim",    role:"Backend Dev",  avatar:"SK", colorIdx:1, mood:"struggling", streak:2, leaves:[],
    tasks:[
      {id:"t4",name:"OAuth Integration",  category:"Integration", storyPoints:10,completedPoints:3, status:"at-risk",     eta:"14 days",assignedTo:2, blockers:[{id:"b2",desc:"Vendor OAuth docs outdated — endpoint returns 401",since:"D3",assignedTo:"Scrum Master",reason:"External vendor issue, no ETA",status:"open"}], daily:[{d:"D1",p:2},{d:"D2",p:1},{d:"D3",p:0},{d:"D4",p:0},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Completely blocked since D3."},
      {id:"t5",name:"REST API Endpoints", category:"Backend",     storyPoints:8, completedPoints:5, status:"slow",        eta:"6 days", assignedTo:2, blockers:[], daily:[{d:"D1",p:1},{d:"D2",p:1},{d:"D3",p:1},{d:"D4",p:1},{d:"D5",p:1},{d:"D6",p:0},{d:"D7",p:0}], notes:"Steady but slow. Depends on Arjun Auth token."},
      {id:"t6",name:"Database Schema",    category:"Backend",     storyPoints:6, completedPoints:6, status:"completed",   eta:"Done ✓", assignedTo:2, blockers:[], daily:[{d:"D1",p:2},{d:"D2",p:2},{d:"D3",p:2},{d:"D4",p:0},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Completed on day 3."},
    ], dependencies:[{dependsOn:1,task:"REST API Endpoints",waitingFor:"Auth Module token format"}], githubCommits:5, prsOpen:1, prsReviewed:1,
  },
  { id:3, name:"Dev Patel",   role:"Full Stack",   avatar:"DP", colorIdx:2, mood:"crushing",   streak:7, leaves:[{day:6,reason:"Personal leave"}],
    tasks:[
      {id:"t7",name:"Dashboard UI",        category:"UI",          storyPoints:8, completedPoints:8, status:"completed",   eta:"Done ✓", assignedTo:3, blockers:[], daily:[{d:"D1",p:2},{d:"D2",p:2},{d:"D3",p:2},{d:"D4",p:2},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Delivered 2 days early."},
      {id:"t8",name:"Chart Components",    category:"UI",          storyPoints:5, completedPoints:5, status:"completed",   eta:"Done ✓", assignedTo:3, blockers:[], daily:[{d:"D1",p:1},{d:"D2",p:2},{d:"D3",p:2},{d:"D4",p:0},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Recharts done, responsive."},
      {id:"t9",name:"Notification System", category:"Feature",     storyPoints:6, completedPoints:2, status:"on-track",    eta:"3 days", assignedTo:3, blockers:[], daily:[{d:"D1",p:0},{d:"D2",p:0},{d:"D3",p:0},{d:"D4",p:0},{d:"D5",p:1},{d:"D6",p:0},{d:"D7",p:1}], notes:"Started after completing tasks. Good pace."},
    ], dependencies:[], githubCommits:22, prsOpen:0, prsReviewed:7,
  },
  { id:4, name:"Mia Torres",  role:"QA Engineer",  avatar:"MT", colorIdx:3, mood:"okay",       streak:4, leaves:[{day:5,reason:"Team offsite"}],
    tasks:[
      {id:"t10",name:"Unit Test Suite",         category:"Testing", storyPoints:6, completedPoints:4, status:"on-track",  eta:"3 days", assignedTo:4, blockers:[], daily:[{d:"D1",p:1},{d:"D2",p:1},{d:"D3",p:1},{d:"D4",p:1},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Consistent 1pt/day."},
      {id:"t11",name:"E2E Test Coverage",       category:"Testing", storyPoints:8, completedPoints:2, status:"slow",      eta:"12 days",assignedTo:4, blockers:[{id:"b3",desc:"Test env crashes on mobile viewport",since:"D5",assignedTo:"Dev Patel",reason:"CI pipeline bug",status:"in-progress"}], daily:[{d:"D1",p:1},{d:"D2",p:0},{d:"D3",p:0},{d:"D4",p:1},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Blocked by env issue."},
      {id:"t12",name:"Performance Benchmarks",  category:"Testing", storyPoints:4, completedPoints:0, status:"not-started",eta:"TBD",   assignedTo:4, blockers:[], daily:[{d:"D1",p:0},{d:"D2",p:0},{d:"D3",p:0},{d:"D4",p:0},{d:"D5",p:0},{d:"D6",p:0},{d:"D7",p:0}], notes:"Queued — after E2E."},
    ], dependencies:[{dependsOn:3,task:"E2E Test Coverage",waitingFor:"Stable Dashboard UI build"}], githubCommits:3, prsOpen:0, prsReviewed:5,
  },
];

const SPRINT_HISTORY = [
  {sprint:"Sprint 1",committed:60,delivered:42,velocity:1.0,accuracy:70},
  {sprint:"Sprint 2",committed:55,delivered:50,velocity:1.2,accuracy:91},
  {sprint:"Sprint 3",committed:70,delivered:58,velocity:1.4,accuracy:83},
  {sprint:"Sprint 4",committed:76,delivered:37,velocity:1.1,accuracy:49},
];
const DEV_HISTORY = {
  1:[{s:"S1",c:18,d:14},{s:"S2",c:16,d:15},{s:"S3",c:20,d:17},{s:"S4",c:19,d:14}],
  2:[{s:"S1",c:20,d:12},{s:"S2",c:18,d:17},{s:"S3",c:22,d:18},{s:"S4",c:24,d:14}],
  3:[{s:"S1",c:12,d:12},{s:"S2",c:14,d:14},{s:"S3",c:16,d:16},{s:"S4",c:19,d:15}],
  4:[{s:"S1",c:10,d:8},{s:"S2",c:14,d:12},{s:"S3",c:12,d:12},{s:"S4",c:14,d:12}],
};
const BURNDOWN_DATA = [
  {day:"D1",ideal:76,actual:76,predicted:76},{day:"D2",ideal:70,actual:68,predicted:68},
  {day:"D3",ideal:64,actual:60,predicted:60,event:"Arjun leave · Sara blocked"},
  {day:"D4",ideal:58,actual:52,predicted:52,event:"Session spec blocker"},
  {day:"D5",ideal:52,actual:44,predicted:44,event:"Mia offsite · E2E crash"},
  {day:"D6",ideal:46,actual:40,predicted:40,event:"Dev Patel leave"},
  {day:"D7",ideal:40,actual:37,predicted:37},
  {day:"D8",ideal:34,actual:null,predicted:32},{day:"D9",ideal:28,actual:null,predicted:28},
  {day:"D10",ideal:22,actual:null,predicted:25,event:"⚠ Projected slip"},
  {day:"D11",ideal:16,actual:null,predicted:22},{day:"D12",ideal:10,actual:null,predicted:18},
  {day:"D13",ideal:4,actual:null,predicted:14},{day:"D14",ideal:0,actual:null,predicted:10},
];
const ORIGINAL_PTS = {t1:6,t2:6,t3:3,t4:8,t5:8,t6:6,t7:8,t8:5,t9:5,t10:5,t11:6,t12:4};
const SORT_ORDER = {"at-risk":0,"slow":1,"on-track":2,"not-started":3,"completed":4};
const CATEGORIES = ["Feature","UI","Backend","Integration","Testing"];
const pct = (a,b) => b===0?0:Math.round((a/b)*100);

function mkStatus(T){return{
  "completed":  {label:"Done",       color:T.green,  bg:`${T.green}1A`},
  "on-track":   {label:"On Track",   color:T.accent, bg:`${T.accent}14`},
  "slow":       {label:"Slow",       color:T.yellow, bg:`${T.yellow}18`},
  "at-risk":    {label:"At Risk",    color:T.red,    bg:`${T.red}1A`},
  "not-started":{label:"Not Started",color:T.textSub,bg:`${T.textSub}12`},
};}
function mkCat(T){return{Feature:T.purple,UI:T.accent,Backend:T.red,Integration:T.yellow,Testing:T.green};}
function mkMood(T){return{crushing:{emoji:"🚀",color:T.green,label:"Crushing"},okay:{emoji:"😐",color:T.yellow,label:"Okay"},struggling:{emoji:"😟",color:T.red,label:"Struggling"}};}

function devStats(dev){
  const totalPts=dev.tasks.reduce((s,t)=>s+t.storyPoints,0);
  const donePts=dev.tasks.reduce((s,t)=>s+t.completedPoints,0);
  const done=dev.tasks.filter(t=>t.status==="completed").length;
  const atRisk=dev.tasks.filter(t=>t.status==="at-risk").length;
  const blockers=dev.tasks.reduce((s,t)=>s+t.blockers.length,0);
  const overallStatus=atRisk>0?"at-risk":dev.tasks.some(t=>t.status==="slow")?"slow":done===dev.tasks.length?"completed":"on-track";
  const allDaily=dev.tasks.reduce((acc,t)=>{t.daily.forEach((d,i)=>{acc[i]=(acc[i]||0)+d.p;});return acc;},[]);
  const leaveDays=dev.leaves.map(l=>l.day-1);
  const activeDays=allDaily.filter((_,i)=>!leaveDays.includes(i)&&allDaily[i]>0);
  const velocity=activeDays.length?(activeDays.reduce((a,b)=>a+b,0)/activeDays.length).toFixed(1):"0.0";
  const sparkline=allDaily.map((p,i)=>({d:`D${i+1}`,p}));
  return{totalPts,donePts,done,atRisk,blockers,overallStatus,velocity,sparkline};
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
function Card({children,style={}}){
  const T=useT();
  return <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,...style}}>{children}</div>;
}
function Label({children,style={}}){
  const T=useT();
  return <p style={{margin:0,fontSize:9,color:T.textSub,letterSpacing:1.8,...style}}>{children}</p>;
}
function InputField({value,onChange,placeholder,style={}}){
  const T=useT();
  return <input value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7,padding:"9px 11px",color:T.text,fontSize:12,outline:"none",fontFamily:"inherit",...style}}/>;
}
function SelectField({value,onChange,children,style={}}){
  const T=useT();
  return <select value={value} onChange={onChange} style={{width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7,padding:"9px 11px",color:T.text,fontSize:12,outline:"none",fontFamily:"inherit",...style}}>{children}</select>;
}
function Btn({onClick,children,variant="ghost",color,style={}}){
  const T=useT();
  const c=color||T.accent;
  const bg={ghost:"transparent",primary:`${c}18`,solid:c}[variant]||"transparent";
  const textC={ghost:T.textSub,primary:c,solid:T.bg}[variant]||T.textSub;
  return <button onClick={onClick} style={{padding:"7px 14px",borderRadius:7,border:`1px solid ${variant==="ghost"?T.border:`${c}44`}`,background:bg,color:textC,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:variant==="primary"?700:400,...style}}>{children}</button>;
}
function KpiTile({label,value,sub,color}){
  const T=useT();
  return(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`}}/>
      <p style={{margin:"0 0 4px",fontSize:9,color:T.textSub,letterSpacing:1.5}}>{label.toUpperCase()}</p>
      <p style={{margin:"0 0 2px",fontSize:22,fontWeight:700,color,lineHeight:1}}>{value}</p>
      <p style={{margin:0,fontSize:10,color:T.textDim}}>{sub}</p>
    </div>
  );
}
function ProgressBar({pct:p,color,h=5}){
  const T=useT();
  return <div style={{height:h,background:T.border,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:color,borderRadius:4,transition:"width 0.4s"}}/></div>;
}
function StatusBadge({status}){
  const T=useT();
  const ST=mkStatus(T);
  const s=ST[status]||ST["not-started"];
  return <span style={{padding:"2px 8px",borderRadius:20,fontSize:9,background:s.bg,color:s.color,border:`1px solid ${s.color}22`}}>{s.label}</span>;
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────
function TaskRow({task,devColor,isActive,onToggle}){
  const T=useT();
  const ST=mkStatus(T);
  const CAT=mkCat(T);
  const cfg=ST[task.status];
  const p=pct(task.completedPoints,task.storyPoints);
  return(
    <div onClick={onToggle} style={{background:isActive?T.surface2:T.surface,border:`1px solid ${isActive?devColor+"55":T.border}`,borderRadius:9,padding:"10px 13px",cursor:"pointer",transition:"all 0.15s",marginBottom:5}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
          <span style={{flexShrink:0,fontSize:9,padding:"2px 6px",borderRadius:4,background:`${CAT[task.category]||T.textSub}18`,color:CAT[task.category]||T.textSub}}>{task.category}</span>
          <span style={{fontSize:12,color:T.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.name}</span>
          {task.blockers.length>0&&<span style={{fontSize:11,flexShrink:0}}>🚧</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0,marginLeft:8}}>
          <div style={{width:52,height:4,background:T.border2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:devColor,borderRadius:3}}/></div>
          <span style={{fontSize:10,color:devColor,minWidth:26,textAlign:"right"}}>{p}%</span>
          <StatusBadge status={task.status}/>
          <span style={{fontSize:10,color:isActive?devColor:T.textDim,marginLeft:2}}>{isActive?"▲":"▼"}</span>
        </div>
      </div>
      {isActive&&(
        <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div>
            <Label style={{marginBottom:6}}>DAILY STORY POINTS</Label>
            <ProgressBar pct={p} color={devColor} h={4}/>
            <div style={{marginTop:6}}>
              <ResponsiveContainer width="100%" height={72}>
                <AreaChart data={task.daily} margin={{top:2,right:2,bottom:0,left:0}}>
                  <defs><linearGradient id={`tg${task.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={devColor} stopOpacity={0.25}/><stop offset="100%" stopColor={devColor} stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="d" tick={{fill:T.textSub,fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:T.textSub,fontSize:9}} axisLine={false} tickLine={false} width={14}/>
                  <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,fontSize:11,color:T.text}}/>
                  <Area type="monotone" dataKey="p" stroke={devColor} strokeWidth={1.5} fill={`url(#tg${task.id})`} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {[["Points",`${task.completedPoints}/${task.storyPoints} pts`],["ETA",task.eta],["Status",cfg.label],["Blockers",task.blockers.length>0?`${task.blockers.length} open`:"None"]].map(([k,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:11,color:T.textSub}}>{k}</span>
                <span style={{fontSize:11,color:k==="Blockers"&&task.blockers.length>0?T.red:k==="Status"?cfg.color:T.text}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:4,padding:"8px 10px",background:T.surface2,borderRadius:7}}>
              <p style={{margin:0,fontSize:11,color:T.textSub,lineHeight:1.5}}>💬 {task.notes}</p>
            </div>
            {task.blockers.map(b=>(
              <div key={b.id} style={{padding:"8px 10px",background:`${T.red}0D`,border:`1px solid ${T.red}28`,borderRadius:7}}>
                <p style={{margin:"0 0 2px",fontSize:9,color:T.red,letterSpacing:1}}>🚧 {b.status.toUpperCase()}</p>
                <p style={{margin:"0 0 1px",fontSize:11,color:T.text}}>{b.desc}</p>
                <p style={{margin:0,fontSize:10,color:T.textSub}}>Since {b.since} · {b.assignedTo} · {b.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEV CARD ─────────────────────────────────────────────────────────────────
function DevCard({dev,devColor,isOpen,onToggle,allDevs,allDevsColors,onReassign}){
  const T=useT();
  const [activeTask,setActiveTask]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const s=devStats(dev);
  const ST=mkStatus(T);
  const MOOD=mkMood(T);
  const cfg=ST[s.overallStatus];
  const mood=MOOD[dev.mood];
  const sortedTasks=[...dev.tasks].sort((a,b)=>SORT_ORDER[a.status]-SORT_ORDER[b.status]);
  const overallPct=pct(s.donePts,s.totalPts);
  const leaveDays=dev.leaves.map(l=>l.day);
  return(
    <div
      onDragOver={e=>{e.preventDefault();setDragOver(true);}}
      onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{e.preventDefault();setDragOver(false);const tid=e.dataTransfer.getData("taskId");const fromId=parseInt(e.dataTransfer.getData("fromDevId"));if(fromId!==dev.id)onReassign(tid,fromId,dev.id);}}
      style={{background:T.surface,border:`1px solid ${dragOver?T.purple:isOpen?devColor+"66":T.border}`,borderRadius:13,overflow:"hidden",transition:"border-color 0.2s",boxShadow:isOpen?`0 2px 16px ${devColor}0C`:"none"}}
    >
      <div onClick={onToggle} style={{padding:"16px 18px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:9,background:`${devColor}18`,border:`1px solid ${devColor}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:devColor}}>{dev.avatar}</div>
            <div>
              <p style={{margin:0,fontSize:14,fontWeight:700,color:T.text}}>{dev.name}</p>
              <p style={{margin:"2px 0 0",fontSize:11,color:T.textSub}}>{dev.role} · {mood.emoji} <span style={{color:mood.color}}>{mood.label}</span> · 🔥{dev.streak}d</p>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            <StatusBadge status={s.overallStatus}/>
            {leaveDays.length>0&&<span style={{fontSize:9,color:T.yellow}}>📅 {leaveDays.length} leave</span>}
            <span style={{fontSize:9,color:T.textDim}}>{dev.githubCommits} commits · {dev.prsOpen} PR{dev.prsOpen!==1?"s":""}</span>
            <span style={{fontSize:9,color:isOpen?devColor:T.textDim}}>{isOpen?"▲":"▼"}</span>
          </div>
        </div>
        <div style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:T.textSub}}>{s.donePts}/{s.totalPts} pts</span>
            <span style={{fontSize:12,color:devColor,fontWeight:700}}>{overallPct}%</span>
          </div>
          <ProgressBar pct={overallPct} color={devColor} h={6}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:9}}>
          {[{val:`${s.done}/${dev.tasks.length}`,sub:"done",color:T.green},{val:s.atRisk,sub:"at risk",color:s.atRisk>0?T.red:T.textDim},{val:s.blockers,sub:"blocked",color:s.blockers>0?T.red:T.textDim},{val:s.velocity,sub:"pts/day",color:devColor}].map((st,i)=>(
            <div key={i} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7,padding:"5px 6px",textAlign:"center"}}>
              <p style={{margin:0,fontSize:14,fontWeight:700,color:st.color,lineHeight:1}}>{st.val}</p>
              <p style={{margin:"3px 0 0",fontSize:8,color:T.textDim,letterSpacing:0.5}}>{st.sub.toUpperCase()}</p>
            </div>
          ))}
        </div>
        {/* Sprint calendar strip */}
        <div style={{display:"flex",gap:2,marginBottom:5}}>
          {Array.from({length:SPRINT_CONFIG.totalDays},(_,i)=>{
            const dn=i+1,isLeave=leaveDays.includes(dn),isCur=dn===SPRINT_CONFIG.currentDay,isPast=dn<SPRINT_CONFIG.currentDay;
            const allDA=dev.tasks.reduce((acc,t)=>{t.daily.forEach((d,j)=>{acc[j]=(acc[j]||0)+d.p;});return acc;},[]);
            const hasOut=isPast&&(allDA[i]||0)>0;
            return <div key={i} title={isLeave?`D${dn}: ${dev.leaves.find(l=>l.day===dn)?.reason}`:`Day ${dn}`} style={{flex:1,height:10,borderRadius:2,background:isLeave?T.yellow+"44":isCur?devColor+"55":hasOut?devColor+"44":isPast?T.border:T.surface2,border:isCur?`1px solid ${devColor}88`:isLeave?`1px solid ${T.yellow}44`:"1px solid transparent"}}/>;
          })}
        </div>
        <ResponsiveContainer width="100%" height={22}>
          <AreaChart data={s.sparkline} margin={{top:0,right:0,bottom:0,left:0}}>
            <defs><linearGradient id={`ds${dev.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={devColor} stopOpacity={0.18}/><stop offset="100%" stopColor={devColor} stopOpacity={0}/></linearGradient></defs>
            <Area type="monotone" dataKey="p" stroke={devColor} strokeWidth={1.5} fill={`url(#ds${dev.id})`} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {isOpen&&(
        <div style={{padding:"0 16px 16px",borderTop:`1px solid ${T.border}`}}>
          {dev.leaves.length>0&&<div style={{margin:"10px 0 7px",padding:"6px 11px",background:`${T.yellow}0E`,border:`1px solid ${T.yellow}28`,borderRadius:8}}><p style={{margin:0,fontSize:10,color:T.yellow}}>📅 {dev.leaves.map(l=>`D${l.day} (${l.reason})`).join(" · ")} — excluded from velocity</p></div>}
          {dev.dependencies&&dev.dependencies.length>0&&<div style={{margin:"0 0 7px",padding:"6px 11px",background:`${T.purple}0E`,border:`1px solid ${T.purple}28`,borderRadius:8}}>{dev.dependencies.map((dep,i)=>{const fromDev=allDevs.find(d=>d.id===dep.dependsOn);return(<p key={i} style={{margin:0,fontSize:10,color:T.purple}}>🔗 <b>{dep.task}</b> waits on {fromDev?.name.split(" ")[0]} — {dep.waitingFor}</p>);})}</div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0 7px"}}>
            <Label>TASKS — DRAG TO REASSIGN</Label>
            <span style={{fontSize:9,color:T.textDim}}>click to inspect</span>
          </div>
          {sortedTasks.map(task=>(
            <div key={task.id} draggable onDragStart={e=>{e.dataTransfer.setData("taskId",task.id);e.dataTransfer.setData("fromDevId",dev.id);}} style={{cursor:"grab"}}>
              <TaskRow task={task} devColor={devColor} isActive={activeTask===task.id} onToggle={()=>setActiveTask(activeTask===task.id?null:task.id)}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TASK CREATION MODAL ──────────────────────────────────────────────────────
function TaskModal({devs,devsColors,onAdd,onClose}){
  const T=useT();
  const [form,setForm]=useState({name:"",category:"Feature",storyPoints:5,assignedTo:devs[0]?.id||1,notes:""});
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <Card style={{padding:26,width:480,maxWidth:"92vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <p style={{margin:0,fontSize:14,fontWeight:700,color:T.text}}>➕ Create New Task</p>
          <Btn onClick={onClose}>✕</Btn>
        </div>
        {[{label:"Task Name",key:"name",ph:"e.g. Implement password reset flow"},{label:"Notes",key:"notes",ph:"Acceptance criteria or context"}].map(({label,key,ph})=>(
          <div key={key} style={{marginBottom:13}}>
            <Label style={{marginBottom:5}}>{label.toUpperCase()}</Label>
            <InputField value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13}}>
          <div>
            <Label style={{marginBottom:5}}>CATEGORY</Label>
            <SelectField value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </SelectField>
          </div>
          <div>
            <Label style={{marginBottom:5}}>STORY POINTS</Label>
            <div style={{display:"flex",gap:5}}>
              {[1,2,3,5,8,13].map(pt=>(
                <button key={pt} onClick={()=>setForm(p=>({...p,storyPoints:pt}))} style={{flex:1,padding:"8px 2px",borderRadius:6,border:`1px solid ${form.storyPoints===pt?T.accent:T.border}`,background:form.storyPoints===pt?`${T.accent}18`:"transparent",color:form.storyPoints===pt?T.accent:T.textSub,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{pt}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <Label style={{marginBottom:7}}>ASSIGN TO</Label>
          <div style={{display:"flex",gap:7}}>
            {devs.map((dev,i)=>{const dc=devsColors[i];return(
              <button key={dev.id} onClick={()=>setForm(p=>({...p,assignedTo:dev.id}))} style={{flex:1,padding:"9px 4px",borderRadius:8,border:`1px solid ${form.assignedTo===dev.id?dc:T.border}`,background:form.assignedTo===dev.id?`${dc}14`:"transparent",color:form.assignedTo===dev.id?dc:T.textSub,fontSize:10,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                <div style={{fontWeight:700,marginBottom:2}}>{dev.avatar}</div>
                <div style={{fontSize:9}}>{dev.name.split(" ")[0]}</div>
                <div style={{fontSize:8,marginTop:1,color:T.textDim}}>{devStats(dev).velocity}v/d</div>
              </button>
            );})}
          </div>
        </div>
        <button onClick={()=>{if(form.name.trim())onAdd(form);}} style={{width:"100%",padding:"11px",borderRadius:8,background:`${T.accent}18`,border:`1px solid ${T.accent}44`,color:T.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
          Create → {devs.find(d=>d.id===form.assignedTo)?.name.split(" ")[0]}
        </button>
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationPanel(){
  const T=useT();
  const [dismissed,setDismissed]=useState([]);
  const notes=[
    {id:"n1",text:"Sara's OAuth blocker unresolved 4 days — escalate to vendor TODAY",color:T.red},
    {id:"n2",text:"Cascade risk: Arjun's Auth delay bottlenecking Sara's REST API",color:T.purple},
    {id:"n3",text:"Sara struggling 3 days straight — scrum check-in recommended",color:T.red},
    {id:"n4",text:"Dev Patel available — consider reassigning Arjun's Session Mgmt",color:T.green},
    {id:"n5",text:"Sara Kim — 0 GitHub commits in 4 days on OAuth branch",color:T.yellow},
  ].filter(n=>!dismissed.includes(n.id));
  return(
    <Card style={{padding:"16px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <Label>AI NOTIFICATIONS</Label>
          {notes.length>0&&<span style={{background:T.red,color:"#fff",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{notes.length}</span>}
        </div>
        <Btn onClick={()=>setDismissed(["n1","n2","n3","n4","n5"])}>Clear all</Btn>
      </div>
      {notes.length===0?<p style={{color:T.textDim,fontSize:12,textAlign:"center",padding:12}}>✓ All clear</p>
      :notes.map(n=>(
        <div key={n.id} style={{marginBottom:6,padding:"8px 10px",background:`${n.color}0A`,border:`1px solid ${n.color}28`,borderRadius:7,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <p style={{margin:0,fontSize:11,color:T.text,lineHeight:1.5,flex:1}}>{n.text}</p>
          <button onClick={()=>setDismissed(p=>[...p,n.id])} style={{marginLeft:7,background:"transparent",border:"none",color:T.textDim,cursor:"pointer",fontSize:14,padding:"0 2px",lineHeight:1}}>×</button>
        </div>
      ))}
    </Card>
  );
}

// ─── BLOCKERS PANEL ───────────────────────────────────────────────────────────
function BlockersPanel({devs,devsColors,onResolve,onEscalate,onAddBlocker}){
  const T=useT();
  const [expanded,setExpanded]=useState(null);
  const [escalateTo,setEscalateTo]=useState({});
  const [comment,setComment]=useState({});
  const [showCreate,setShowCreate]=useState(false);
  const [newB,setNewB]=useState({desc:"",reason:"",assignedTo:"PM",taskId:"",devId:devs[0]?.id||1});

  const allBlockers=devs.flatMap(d=>d.tasks.flatMap(t=>t.blockers.map(b=>({...b,devId:d.id,devName:d.name,devColor:devsColors[d.colorIdx],taskId:t.id,taskName:t.name}))));
  const open=allBlockers.filter(b=>b.status==="open");
  const escalated=allBlockers.filter(b=>b.status==="escalated");
  const inProg=allBlockers.filter(b=>b.status==="in-progress");
  const resolved=allBlockers.filter(b=>b.status==="resolved");
  const TARGETS=["PM","Scrum Master","Manager","CTO","External Vendor","Dev Patel","Arjun Mehta","Sara Kim","Mia Torres"];
  const daysSince=s=>SPRINT_CONFIG.currentDay-parseInt(s.replace("D",""));
  const scColors={open:T.red,escalated:T.purple,"in-progress":T.yellow,resolved:T.green};

  const allTasks=devs.flatMap(d=>d.tasks.map(t=>({...t,devId:d.id,devName:d.name})));

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[{label:"Open",value:open.length,color:T.red},{label:"Escalated",value:escalated.length,color:T.purple},{label:"In Progress",value:inProg.length,color:T.yellow},{label:"Resolved",value:resolved.length,color:T.green}].map((k,i)=>(
          <KpiTile key={i} {...k} sub={k.label==="Open"&&k.value>0?"action needed":k.label==="Resolved"?"this sprint":""}/>
        ))}
      </div>

      {/* Create new blocker */}
      <Card style={{padding:"16px 18px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showCreate?14:0}}>
          <Label>ADD NEW BLOCKER</Label>
          <Btn onClick={()=>setShowCreate(s=>!s)} variant="primary" color={T.accent}>{showCreate?"✕ Cancel":"+ Report Blocker"}</Btn>
        </div>
        {showCreate&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <Label style={{marginBottom:5}}>BLOCKER DESCRIPTION</Label>
                <InputField value={newB.desc} onChange={e=>setNewB(p=>({...p,desc:e.target.value}))} placeholder="What is blocking progress?"/>
              </div>
              <div>
                <Label style={{marginBottom:5}}>ROOT CAUSE / REASON</Label>
                <InputField value={newB.reason} onChange={e=>setNewB(p=>({...p,reason:e.target.value}))} placeholder="Why is this blocked?"/>
              </div>
              <div>
                <Label style={{marginBottom:5}}>ASSIGN TO</Label>
                <SelectField value={newB.assignedTo} onChange={e=>setNewB(p=>({...p,assignedTo:e.target.value}))}>
                  {TARGETS.map(t=><option key={t} value={t}>{t}</option>)}
                </SelectField>
              </div>
              <div>
                <Label style={{marginBottom:5}}>AFFECTED TASK</Label>
                <SelectField value={newB.taskId} onChange={e=>{const t=allTasks.find(t=>t.id===e.target.value);setNewB(p=>({...p,taskId:e.target.value,devId:t?.devId||p.devId}));}}>
                  <option value="">Select task...</option>
                  {allTasks.map(t=><option key={t.id} value={t.id}>{t.devName.split(" ")[0]}: {t.name}</option>)}
                </SelectField>
              </div>
            </div>
            <Btn variant="primary" color={T.red} style={{width:"100%"}} onClick={()=>{if(newB.desc&&newB.taskId){onAddBlocker(newB);setNewB({desc:"",reason:"",assignedTo:"PM",taskId:"",devId:devs[0]?.id||1});setShowCreate(false);}}}>
              🚧 Report Blocker
            </Btn>
          </div>
        )}
      </Card>

      {allBlockers.length===0&&<p style={{color:T.textDim,textAlign:"center",padding:32,fontSize:13}}>✓ No blockers — team is fully unblocked</p>}

      {[...open,...escalated,...inProg,...resolved].map(b=>{
        const isExp=expanded===b.id;
        const days=daysSince(b.since);
        const isCrit=b.status==="open"&&days>=3;
        const sc=scColors[b.status]||T.textSub;
        return(
          <Card key={b.id} style={{marginBottom:9,border:`1px solid ${isCrit?T.red+"66":sc+"33"}`,overflow:"hidden"}}>
            <div style={{padding:"13px 15px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                  <div style={{width:24,height:24,borderRadius:5,background:`${b.devColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:b.devColor}}>{b.devName.split(" ").map(n=>n[0]).join("")}</div>
                  <span style={{fontSize:12,color:T.text,fontWeight:600}}>{b.devName}</span>
                  <span style={{fontSize:10,color:T.textSub}}>·</span>
                  <span style={{fontSize:11,color:b.devColor}}>{b.taskName}</span>
                  {isCrit&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:10,background:`${T.red}18`,color:T.red}}>CRITICAL</span>}
                </div>
                <p style={{margin:"0 0 4px",fontSize:12,color:T.text}}>🚧 {b.desc}</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:T.textSub}}>Since: <b style={{color:T.yellow}}>{b.since}</b> · {days}d blocked</span>
                  <span style={{fontSize:10,color:T.textSub}}>→ <span style={{color:T.purple}}>{b.assignedTo}</span></span>
                  <span style={{fontSize:10,color:T.textSub}}>{b.reason}</span>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,marginLeft:11,flexShrink:0}}>
                <span style={{padding:"2px 8px",borderRadius:20,fontSize:9,background:`${sc}14`,color:sc}}>{b.status}</span>
                {b.status!=="resolved"&&<Btn onClick={()=>setExpanded(isExp?null:b.id)}>{isExp?"▲ Close":"⚙ Actions"}</Btn>}
                {b.status==="resolved"&&<span style={{fontSize:10,color:T.green}}>✓ Cleared</span>}
              </div>
            </div>
            {isExp&&(
              <div style={{padding:"13px 15px",borderTop:`1px solid ${T.border}`,background:T.surface2}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
                  <div style={{padding:"12px 13px",background:`${T.green}0A`,border:`1px solid ${T.green}28`,borderRadius:9}}>
                    <Label style={{marginBottom:6,color:T.green}}>MARK AS RESOLVED</Label>
                    <InputField value={comment[b.id]||""} onChange={e=>setComment(p=>({...p,[b.id]:e.target.value}))} placeholder="Resolution note (optional)" style={{marginBottom:8}}/>
                    <button onClick={()=>{onResolve(b.id,b.taskId,b.devId);setExpanded(null);}} style={{width:"100%",padding:"8px",borderRadius:7,background:`${T.green}18`,border:`1px solid ${T.green}44`,color:T.green,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✓ Mark Resolved</button>
                  </div>
                  <div style={{padding:"12px 13px",background:`${T.purple}0A`,border:`1px solid ${T.purple}28`,borderRadius:9}}>
                    <Label style={{marginBottom:6,color:T.purple}}>ESCALATE TO</Label>
                    <SelectField value={escalateTo[b.id]||""} onChange={e=>setEscalateTo(p=>({...p,[b.id]:e.target.value}))} style={{marginBottom:8}}>
                      <option value="">Select person...</option>
                      {TARGETS.filter(t=>t!==b.assignedTo).map(t=><option key={t} value={t}>{t}</option>)}
                    </SelectField>
                    <button onClick={()=>{if(escalateTo[b.id]){onEscalate(b.id,b.taskId,b.devId,escalateTo[b.id]);setExpanded(null);}}} style={{width:"100%",padding:"8px",borderRadius:7,background:`${T.purple}18`,border:`1px solid ${T.purple}44`,color:T.purple,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>↗ Escalate</button>
                  </div>
                </div>
                <div style={{padding:"8px 11px",background:`${T.red}08`,border:`1px solid ${T.red}18`,borderRadius:7}}>
                  <p style={{margin:0,fontSize:10,color:T.textSub}}>Sprint impact: {days>=4?`${days} days lost · ~${Math.round(days*0.8)} pts undelivered so far`:`Resolve before D${SPRINT_CONFIG.currentDay+2} to avoid further drift`}</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── SPRINT INSIGHTS ──────────────────────────────────────────────────────────
function SprintInsightsPanel({devs,devsColors}){
  const T=useT();
  const [hovEvent,setHovEvent]=useState(null);
  const daysLeft=SPRINT_CONFIG.totalDays-SPRINT_CONFIG.currentDay;
  const allTotalPts=devs.reduce((s,d)=>s+d.tasks.reduce((ss,t)=>ss+t.storyPoints,0),0);
  const allDonePts=devs.reduce((s,d)=>s+d.tasks.reduce((ss,t)=>ss+t.completedPoints,0),0);
  const remaining=allTotalPts-allDonePts;
  const projEnd=BURNDOWN_DATA[BURNDOWN_DATA.length-1]?.predicted||0;
  const openBlk=devs.flatMap(d=>d.tasks.flatMap(t=>t.blockers)).filter(b=>b.status==="open");
  const atRiskTasks=devs.flatMap(d=>d.tasks.filter(t=>t.status==="at-risk"||t.status==="slow").map(t=>({...t,devName:d.name,devColor:devsColors[d.colorIdx]})));
  const DRIFT=[
    {day:"D3",type:"leave",   label:"Arjun sick leave",             impact:"−2 pts",color:T.yellow},
    {day:"D3",type:"blocker", label:"Sara: OAuth blocker raised",   impact:"7 pts stalled",color:T.red},
    {day:"D4",type:"blocker", label:"Arjun: Session spec unclear",  impact:"1 task frozen",color:T.red},
    {day:"D4",type:"dep",     label:"Sara waits on Arjun Auth token",impact:"API bottlenecked",color:T.purple},
    {day:"D5",type:"leave",   label:"Mia offsite — team event",     impact:"−3 pts",color:T.yellow},
    {day:"D5",type:"blocker", label:"Mia: E2E env crash",           impact:"8 pts at risk",color:T.red},
    {day:"D6",type:"leave",   label:"Dev Patel personal leave",     impact:"−4 pts",color:T.yellow},
  ];
  const riskScore=dev=>{const s=devStats(dev);let sc=0;if(s.overallStatus==="at-risk")sc+=40;if(s.overallStatus==="slow")sc+=20;sc+=s.blockers*15;sc+=dev.leaves.length*8;if(dev.mood==="struggling")sc+=15;return Math.min(sc,100);};
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
        {[
          {label:"Remaining",value:remaining,sub:`of ${allTotalPts} pts`,color:remaining>30?T.red:T.yellow},
          {label:"Days Left",value:daysLeft,sub:`D${SPRINT_CONFIG.currentDay}/${SPRINT_CONFIG.totalDays}`,color:T.accent},
          {label:"Predicted Leftover",value:`${projEnd}pts`,sub:"at sprint end",color:projEnd>8?T.red:T.green},
          {label:"Open Blockers",value:openBlk.length,sub:openBlk.length>0?"action needed":"clear",color:openBlk.length>0?T.red:T.green},
          {label:"Sprint Health",value:projEnd<=8?"72%":"48%",sub:projEnd<=8?"manageable":"intervention needed",color:projEnd<=8?T.yellow:T.red},
        ].map((k,i)=><KpiTile key={i} {...k}/>)}
      </div>
      {/* Burndown */}
      <Card style={{padding:"20px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <Label style={{marginBottom:3}}>BURNDOWN — IDEAL vs ACTUAL vs PREDICTED</Label>
            <p style={{margin:0,fontSize:11,color:T.textSub}}>{SPRINT_CONFIG.startDate} → {SPRINT_CONFIG.endDate} · {SPRINT_CONFIG.goal}</p>
          </div>
          <span style={{padding:"5px 12px",borderRadius:20,fontSize:10,background:`${projEnd<=8?T.green:T.red}14`,color:projEnd<=8?T.green:T.red}}>
            {projEnd<=8?"Manageable drift":"⚠ Sprint at risk"}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={BURNDOWN_DATA} margin={{top:8,right:8,bottom:0,left:0}}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.textSub} stopOpacity={0.08}/><stop offset="100%" stopColor={T.textSub} stopOpacity={0}/></linearGradient>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.14}/><stop offset="100%" stopColor={T.accent} stopOpacity={0}/></linearGradient>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.red} stopOpacity={0.08}/><stop offset="100%" stopColor={T.red} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false} width={26}/>
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,fontSize:11,color:T.text}} labelFormatter={l=>{const ev=BURNDOWN_DATA.find(d=>d.day===l);return ev?.event?`${l} — ${ev.event}`:l;}} formatter={(v,n)=>[v===null?"—":v+" pts",n]}/>
            <ReferenceLine x={`D${SPRINT_CONFIG.currentDay}`} stroke={T.accent} strokeDasharray="3 3" strokeOpacity={0.5} label={{value:"TODAY",fill:T.accent,fontSize:9,position:"top"}}/>
            <Area type="monotone" dataKey="ideal"     name="Ideal"     stroke={T.textSub} strokeWidth={1} strokeDasharray="5 3" fill="url(#ig)" dot={false} connectNulls/>
            <Area type="monotone" dataKey="actual"    name="Actual"    stroke={T.accent}  strokeWidth={2} fill="url(#ag)" dot={{fill:T.accent,r:3}} connectNulls/>
            <Area type="monotone" dataKey="predicted" name="Predicted" stroke={T.red}     strokeWidth={1.5} strokeDasharray="4 2" fill="url(#pg)" dot={false} connectNulls/>
          </AreaChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:14,marginTop:5}}>
          <span style={{fontSize:10,color:T.textSub}}>── Ideal</span>
          <span style={{fontSize:10,color:T.accent}}>── Actual</span>
          <span style={{fontSize:10,color:T.red}}>╌ Predicted</span>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        {/* Drift events */}
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:12}}>WHY WE DRIFTED — EVENT TIMELINE</Label>
          {DRIFT.map((ev,i)=>(
            <div key={i} onMouseEnter={()=>setHovEvent(i)} onMouseLeave={()=>setHovEvent(null)} style={{marginBottom:7,padding:"8px 11px",background:hovEvent===i?`${ev.color}0E`:T.surface2,border:`1px solid ${ev.color}33`,borderRadius:8,transition:"background 0.15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:10,color:ev.color,fontWeight:700,minWidth:22}}>{ev.day}</span>
                  <span style={{fontSize:9,padding:"1px 5px",borderRadius:8,background:`${ev.color}14`,color:ev.color}}>{ev.type==="leave"?"📅":ev.type==="blocker"?"🚧":"🔗"} {ev.type}</span>
                </div>
                <span style={{fontSize:10,color:ev.color}}>{ev.impact}</span>
              </div>
              <p style={{margin:0,fontSize:11,color:T.text}}>{ev.label}</p>
            </div>
          ))}
        </Card>
        {/* Dev risk scores */}
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:12}}>DEVELOPER RISK SCORES</Label>
          {devs.map((dev,i)=>{
            const dc=devsColors[dev.colorIdx];
            const risk=riskScore(dev);
            const rc=risk>=60?T.red:risk>=35?T.yellow:T.green;
            const s=devStats(dev);
            return(
              <div key={dev.id} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:26,height:26,borderRadius:5,background:`${dc}18`,border:`1px solid ${dc}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:dc}}>{dev.avatar}</div>
                    <div>
                      <p style={{margin:0,fontSize:12,color:T.text,fontWeight:600}}>{dev.name.split(" ")[0]}</p>
                      <p style={{margin:0,fontSize:9,color:T.textSub}}>{s.blockers>0?`${s.blockers} blk`:""}{dev.leaves.length>0?` ${dev.leaves.length} leave`:""}</p>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{margin:0,fontSize:15,fontWeight:700,color:rc}}>{risk}</p>
                    <p style={{margin:0,fontSize:8,color:rc}}>{risk>=60?"HIGH":risk>=35?"MED":"LOW"}</p>
                  </div>
                </div>
                <ProgressBar pct={risk} color={rc} h={5}/>
              </div>
            );
          })}
          <div style={{marginTop:10,padding:"7px 10px",background:T.surface2,borderRadius:7}}>
            <p style={{margin:0,fontSize:10,color:T.textSub}}>Score: at-risk×40 + slow×20 + blockers×15 + leave×8 + mood×15</p>
          </div>
        </Card>
      </div>
      {/* At-risk tasks */}
      <Card style={{padding:"16px 18px",marginBottom:14}}>
        <Label style={{marginBottom:12}}>AT-RISK & SLOW TASKS</Label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9}}>
          {atRiskTasks.map((task,i)=>{
            const ST=mkStatus(T);
            const cfg=ST[task.status];
            const eta=parseInt(task.eta)||0;
            const willMiss=eta>daysLeft;
            return(
              <div key={i} style={{padding:"11px 13px",background:T.surface2,border:`1px solid ${cfg.color}33`,borderRadius:9}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div>
                    <p style={{margin:"0 0 1px",fontSize:12,color:T.text,fontWeight:600}}>{task.name}</p>
                    <p style={{margin:0,fontSize:10,color:task.devColor}}>{task.devName}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <StatusBadge status={task.status}/>
                    {willMiss&&<p style={{margin:"3px 0 0",fontSize:9,color:T.red}}>⚠ misses sprint</p>}
                  </div>
                </div>
                <ProgressBar pct={pct(task.completedPoints,task.storyPoints)} color={cfg.color} h={4}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                  <span style={{fontSize:10,color:T.textSub}}>{task.completedPoints}/{task.storyPoints} pts · ETA: {task.eta}</span>
                  {task.blockers.length>0&&<span style={{fontSize:9,color:T.red}}>🚧 {task.blockers[0].desc.slice(0,24)}…</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {/* Root cause */}
      <Card style={{padding:"18px",border:`1px solid ${T.red}22`}}>
        <Label style={{marginBottom:12,color:T.red}}>AI ROOT CAUSE ANALYSIS</Label>
        {[
          {icon:"🔴",color:T.red,    title:"Primary: Sara's OAuth blocker (D3–D7)",    body:"Unresolved external dependency for 4 days. ~7 undelivered pts — 40% of the gap."},
          {icon:"🟡",color:T.yellow, title:"Secondary: 3 unplanned leave days",          body:"Arjun D3, Mia D5, Dev Patel D6 removed ~9 pts of capacity not in sprint plan."},
          {icon:"🟣",color:T.purple, title:"Cascade: Arjun → Sara dependency chain",    body:"Arjun's leave + PM spec blocker delayed Auth Module, bottlenecking Sara's REST API."},
          {icon:"⚪",color:T.textSub,title:"Minor: Mia's E2E environment issue (D5)",   body:"Infrastructure blocker, 8 QA pts at risk. Not flagged until D5."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:11,marginBottom:9,padding:"10px 13px",background:`${item.color}07`,border:`1px solid ${item.color}18`,borderRadius:9}}>
            <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
            <div><p style={{margin:"0 0 3px",fontSize:12,color:item.color,fontWeight:700}}>{item.title}</p><p style={{margin:0,fontSize:11,color:T.textSub,lineHeight:1.5}}>{item.body}</p></div>
          </div>
        ))}
        <div style={{marginTop:10,padding:"11px 13px",background:`${T.accent}08`,border:`1px solid ${T.accent}18`,borderRadius:8}}>
          <Label style={{marginBottom:7,color:T.accent}}>IMMEDIATE ACTIONS</Label>
          {["Escalate OAuth vendor today — reassign Sara's task to Dev Patel if unresolved by D9","Clarify session spec with PM before D8 or descope from sprint","Flag E2E env fix as P0 for Dev Patel","Add 10% capacity buffer in Sprint 5 planning for leave days"].map((a,i)=>(
            <p key={i} style={{margin:"0 0 4px",fontSize:11,color:T.text}}>→ {a}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── HISTORY PANEL ────────────────────────────────────────────────────────────
function HistoryPanel({devs,devsColors}){
  const T=useT();
  const [selDev,setSelDev]=useState(null);
  const avgC=SPRINT_HISTORY.reduce((s,sp)=>s+sp.committed,0)/SPRINT_HISTORY.length;
  const avgD=SPRINT_HISTORY.reduce((s,sp)=>s+sp.delivered,0)/SPRINT_HISTORY.length;
  const overcommit=Math.round((1-(avgD/avgC))*100);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[{label:"Avg Committed",value:Math.round(avgC),sub:"pts/sprint",color:T.accent},{label:"Avg Delivered",value:Math.round(avgD),sub:"pts/sprint",color:T.green},{label:"Overcommit Rate",value:`${overcommit}%`,sub:"consistent pattern",color:T.red},{label:"Velocity Trend",value:"↑ +10%",sub:"improving",color:T.green}].map((k,i)=><KpiTile key={i} {...k}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:10}}>COMMITTED VS DELIVERED</Label>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={SPRINT_HISTORY}>
              <XAxis dataKey="sprint" tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false} width={22}/>
              <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,fontSize:11,color:T.text}}/>
              <Bar dataKey="committed" name="Committed" fill={T.border2} radius={[3,3,0,0]}/>
              <Bar dataKey="delivered" name="Delivered" fill={T.accent+"BB"} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:9,padding:"8px 11px",background:`${T.red}08`,border:`1px solid ${T.red}18`,borderRadius:8}}>
            <p style={{margin:0,fontSize:11,color:T.text}}>⚠ Team consistently overcommits by ~{overcommit}%. Recommend −15–20% in Sprint 5.</p>
          </div>
        </Card>
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:10}}>VELOCITY TREND</Label>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={SPRINT_HISTORY}>
              <XAxis dataKey="sprint" tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false} width={22}/>
              <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,fontSize:11,color:T.text}}/>
              <Line type="monotone" dataKey="velocity" name="Velocity" stroke={T.green} strokeWidth={2} dot={{fill:T.green,r:4}}/>
              <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke={T.yellow} strokeWidth={1.5} strokeDasharray="4 2" dot={{fill:T.yellow,r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card style={{padding:"16px 18px"}}>
        <Label style={{marginBottom:10}}>PER-DEVELOPER HISTORY</Label>
        <div style={{display:"flex",gap:7,marginBottom:12}}>
          {devs.map((dev,i)=>{const dc=devsColors[dev.colorIdx];return(
            <button key={dev.id} onClick={()=>setSelDev(selDev===dev.id?null:dev.id)} style={{flex:1,padding:"7px",borderRadius:7,border:`1px solid ${selDev===dev.id?dc:T.border}`,background:selDev===dev.id?`${dc}10`:"transparent",color:selDev===dev.id?dc:T.textSub,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              {dev.avatar} {dev.name.split(" ")[0]}
            </button>
          );})}
        </div>
        {selDev&&(()=>{
          const dev=devs.find(d=>d.id===selDev);
          const dc=devsColors[dev.colorIdx];
          const hist=DEV_HISTORY[dev.id];
          const avgAcc=Math.round(hist.reduce((s,h)=>s+pct(h.d,h.c),0)/hist.length);
          return(
            <div>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={hist}>
                  <XAxis dataKey="s" tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:T.textSub,fontSize:10}} axisLine={false} tickLine={false} width={18}/>
                  <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,fontSize:11,color:T.text}}/>
                  <Bar dataKey="c" name="Committed" fill={T.border2} radius={[3,3,0,0]}/>
                  <Bar dataKey="d" name="Delivered" fill={dc+"99"} radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
              <div style={{marginTop:9,padding:"8px 11px",background:`${dc}0A`,border:`1px solid ${dc}22`,borderRadius:7}}>
                <p style={{margin:0,fontSize:11,color:T.text}}>{avgAcc<80?`⚠ ${dev.name.split(" ")[0]} delivers ${100-avgAcc}% less than committed — adjust estimates upward`:`✓ ${dev.name.split(" ")[0]} reliably delivers ~${avgAcc}% of commitments`}</p>
              </div>
            </div>
          );
        })()}
      </Card>
    </div>
  );
}

// ─── ALERTS PANEL ─────────────────────────────────────────────────────────────
function AlertsPanel(){
  const T=useT();
  const [rules,setRules]=useState([
    {id:"r1",active:true,trigger:"Blocker unresolved",threshold:2,unit:"days",notify:"Scrum Master",severity:"high"},
    {id:"r2",active:true,trigger:"Dev logs 0 pts",threshold:3,unit:"consecutive days",notify:"Manager",severity:"medium"},
    {id:"r3",active:true,trigger:"Sprint completion below",threshold:60,unit:"% with 5 days left",notify:"Manager",severity:"high"},
    {id:"r4",active:false,trigger:"Task ETA exceeds sprint",threshold:1,unit:"day past sprint end",notify:"Scrum Master",severity:"medium"},
  ]);
  const [showAdd,setShowAdd]=useState(false);
  const [newR,setNewR]=useState({trigger:"",threshold:2,unit:"days",notify:"Manager",severity:"medium"});
  const SC={high:{color:T.red},medium:{color:T.yellow},low:{color:T.textSub}};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><Label>ALERT RULES — CONFIGURABLE BY MANAGER</Label><p style={{margin:"3px 0 0",fontSize:11,color:T.textDim}}>{rules.filter(r=>r.active).length} active rules</p></div>
        <Btn onClick={()=>setShowAdd(s=>!s)} variant="primary" color={T.accent}>{showAdd?"✕ Cancel":"+ New Rule"}</Btn>
      </div>
      {showAdd&&(
        <Card style={{padding:"14px 16px",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
            {[{label:"Trigger condition",key:"trigger",ph:"e.g. Velocity drops below"},{label:"Threshold",key:"threshold",ph:"2"},{label:"Unit",key:"unit",ph:"days"},{label:"Notify",key:"notify",ph:"Manager"}].map(({label,key,ph})=>(
              <div key={key}><Label style={{marginBottom:4}}>{label.toUpperCase()}</Label><InputField value={newR[key]} onChange={e=>setNewR(p=>({...p,[key]:e.target.value}))} placeholder={ph}/></div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <span style={{fontSize:10,color:T.textSub}}>Severity:</span>
            {["high","medium","low"].map(s=>(
              <button key={s} onClick={()=>setNewR(p=>({...p,severity:s}))} style={{padding:"4px 11px",borderRadius:6,border:`1px solid ${newR.severity===s?SC[s].color:T.border}`,background:newR.severity===s?`${SC[s].color}14`:"transparent",color:newR.severity===s?SC[s].color:T.textSub,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
            ))}
            <Btn style={{marginLeft:"auto"}} variant="primary" color={T.accent} onClick={()=>{if(newR.trigger){setRules(p=>[...p,{...newR,id:`r${Date.now()}`,active:true}]);setShowAdd(false);setNewR({trigger:"",threshold:2,unit:"days",notify:"Manager",severity:"medium"});}}}>Add Rule</Btn>
          </div>
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {rules.map(rule=>{
          const sc=SC[rule.severity];
          return(
            <div key={rule.id} style={{padding:"12px 14px",background:T.surface,border:`1px solid ${rule.active?sc.color+"33":T.border}`,borderRadius:9,display:"flex",alignItems:"center",gap:12,opacity:rule.active?1:0.5}}>
              <div onClick={()=>setRules(p=>p.map(r=>r.id===rule.id?{...r,active:!r.active}:r))} style={{width:34,height:18,borderRadius:18,background:rule.active?`${sc.color}33`:T.border,border:`1px solid ${rule.active?sc.color:T.border2}`,cursor:"pointer",position:"relative",flexShrink:0,transition:"all 0.2s"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:rule.active?sc.color:T.textSub,position:"absolute",top:2,left:rule.active?18:2,transition:"all 0.2s"}}/>
              </div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:12,color:T.text}}>If <span style={{color:sc.color}}>{rule.trigger}</span> for <b>{rule.threshold} {rule.unit}</b> → notify <span style={{color:T.purple}}>{rule.notify}</span></p>
              </div>
              <span style={{padding:"2px 8px",borderRadius:20,fontSize:9,background:`${sc.color}14`,color:sc.color,flexShrink:0}}>{rule.severity}</span>
              <button onClick={()=>setRules(p=>p.filter(r=>r.id!==rule.id))} style={{background:"transparent",border:"none",color:T.textDim,cursor:"pointer",fontSize:16,padding:"0 2px",lineHeight:1}}>×</button>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:14,padding:"13px 15px",background:`${T.accent}08`,border:`1px solid ${T.accent}18`,borderRadius:9}}>
        <Label style={{marginBottom:8,color:T.accent}}>CURRENTLY FIRING</Label>
        {[{fire:true,text:"Blocker unresolved > 2 days — Sara's OAuth (4 days)"},{fire:true,text:"Dev logs 0 pts > 3 days — Sara Kim D3–D7"},{fire:false,text:"Sprint below 60% with 5 days left — 7 days left, not triggered yet"}].map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:t.fire?T.red:T.textDim,flexShrink:0}}/>
            <p style={{margin:0,fontSize:11,color:t.fire?T.text:T.textSub}}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RETRO PANEL ──────────────────────────────────────────────────────────────
function RetroPanel({devs,devsColors}){
  const T=useT();
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <Label>AUTO-GENERATED SPRINT RETROSPECTIVE</Label>
        <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,background:`${T.yellow}14`,color:T.yellow}}>Sprint in progress — preview</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:11}}>COMMITTED VS DELIVERED</Label>
          {devs.map((dev,i)=>{const dc=devsColors[dev.colorIdx];const s=devStats(dev);const r=pct(s.donePts,s.totalPts);return(
            <div key={dev.id} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:dc}}>{dev.name.split(" ")[0]}</span>
                <span style={{fontSize:11,color:r>=80?T.green:r>=60?T.yellow:T.red}}>{s.donePts}/{s.totalPts} pts ({r}%)</span>
              </div>
              <ProgressBar pct={r} color={dc} h={4}/>
            </div>
          );})}
        </Card>
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:11}}>TOP 3 DRIFT CAUSES</Label>
          {[{rank:1,text:"Sara's OAuth vendor dependency",impact:"−7 pts · 4 days",color:T.red},{rank:2,text:"3 unplanned leave days",impact:"−9 pts capacity",color:T.yellow},{rank:3,text:"Arjun spec ambiguity (Session)",impact:"−4 pts · 3 days",color:T.yellow}].map(b=>(
            <div key={b.rank} style={{display:"flex",gap:9,marginBottom:9,padding:"8px 10px",background:T.surface2,border:`1px solid ${b.color}22`,borderRadius:7}}>
              <span style={{fontSize:13,fontWeight:800,color:b.color,flexShrink:0}}>#{b.rank}</span>
              <div><p style={{margin:"0 0 1px",fontSize:12,color:T.text}}>{b.text}</p><p style={{margin:0,fontSize:10,color:b.color}}>{b.impact}</p></div>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{padding:"18px",border:`1px solid ${T.green}22`}}>
        <Label style={{marginBottom:12,color:T.green}}>AI RECOMMENDATIONS FOR SPRINT 5</Label>
        {[{icon:"📉",title:"Reduce scope by 18%",body:"Team delivers 79% of commitments. Sprint 5 recommended: 62 pts (down from 76)."},
          {icon:"🔗",title:"Resolve external blockers before sprint start",body:"OAuth vendor must be escalated before Sprint 5 begins. No tasks that depend on unresolved external blockers."},
          {icon:"📅",title:"Account for leave in capacity",body:"Add 10% capacity buffer. Sprint 4 lost 9 pts to unplanned leave not in original plan."},
          {icon:"🔄",title:"Reassign Sara's OAuth task if unresolved by D2",body:"Dev Patel has bandwidth and delivered ahead of schedule — natural reassignment target."},
          {icon:"⚖️",title:"Rebalance workloads",body:"Dev Patel consistently underloaded (100% delivery). Redistribute 5–6 pts from Sara in Sprint 5."},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",gap:11,marginBottom:9,padding:"9px 12px",background:`${T.green}07`,border:`1px solid ${T.green}18`,borderRadius:8}}>
            <span style={{fontSize:15,flexShrink:0}}>{r.icon}</span>
            <div><p style={{margin:"0 0 3px",fontSize:12,color:T.green,fontWeight:700}}>{r.title}</p><p style={{margin:0,fontSize:11,color:T.textSub,lineHeight:1.5}}>{r.body}</p></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── CAPACITY PANEL ───────────────────────────────────────────────────────────
function CapacityPanel({devs,devsColors}){
  const T=useT();
  const [sprintDays,setSprintDays]=useState(14);
  const [leaves,setLeaves]=useState({1:1,2:0,3:1,4:1});
  const totalCap=devs.reduce((s,dev)=>s+(sprintDays-leaves[dev.id])*parseFloat(devStats(dev).velocity),0);
  const safeCap=Math.round(totalCap*0.82);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[{label:"Raw Capacity",value:Math.round(totalCap),sub:"pts (100% util)",color:T.textSub},{label:"Safe Capacity",value:safeCap,sub:"pts (82% accuracy)",color:T.accent},{label:"Sprint Duration",value:`${sprintDays}d`,sub:"adjustable",color:T.yellow}].map((k,i)=><KpiTile key={i} {...k}/>)}
      </div>
      <Card style={{padding:"18px 20px",marginBottom:14}}>
        <Label style={{marginBottom:12}}>SPRINT DURATION</Label>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <input type="range" min={7} max={21} value={sprintDays} onChange={e=>setSprintDays(Number(e.target.value))} style={{flex:1,accentColor:T.accent,cursor:"pointer"}}/>
          <span style={{fontSize:20,fontWeight:700,color:T.accent,minWidth:40}}>{sprintDays}d</span>
          <span style={{fontSize:11,color:T.textSub}}>{sprintDays<=10?"Short":sprintDays<=14?"Standard 2-week":sprintDays<=16?"Extended":"Long — milestone"}</span>
        </div>
        <Label style={{marginBottom:10}}>PLANNED LEAVE DAYS</Label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
          {devs.map((dev,i)=>{const dc=devsColors[dev.colorIdx];return(
            <div key={dev.id} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px 10px",textAlign:"center"}}>
              <p style={{margin:"0 0 3px",fontSize:12,color:dc,fontWeight:700}}>{dev.avatar}</p>
              <p style={{margin:"0 0 8px",fontSize:11,color:T.textSub}}>{dev.name.split(" ")[0]}</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                <button onClick={()=>setLeaves(p=>({...p,[dev.id]:Math.max(0,p[dev.id]-1)}))} style={{width:22,height:22,borderRadius:5,background:"transparent",border:`1px solid ${T.border}`,color:T.textSub,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                <span style={{fontSize:15,fontWeight:700,color:leaves[dev.id]>0?T.yellow:T.textDim,minWidth:18,textAlign:"center"}}>{leaves[dev.id]}</span>
                <button onClick={()=>setLeaves(p=>({...p,[dev.id]:Math.min(sprintDays,p[dev.id]+1)}))} style={{width:22,height:22,borderRadius:5,background:"transparent",border:`1px solid ${T.border}`,color:T.textSub,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
              </div>
              <p style={{margin:"5px 0 0",fontSize:10,color:T.textDim}}>{sprintDays-leaves[dev.id]}d working</p>
              <p style={{margin:"2px 0 0",fontSize:11,color:dc}}>{((sprintDays-leaves[dev.id])*parseFloat(devStats(dev).velocity)).toFixed(0)} pts</p>
            </div>
          );})}
        </div>
      </Card>
      <Card style={{padding:"16px 18px",border:`1px solid ${T.green}22`}}>
        <Label style={{marginBottom:8,color:T.green}}>SPRINT 5 RECOMMENDATION</Label>
        <p style={{margin:"0 0 6px",fontSize:13,color:T.text,lineHeight:1.6}}>
          Based on <b style={{color:T.accent}}>{sprintDays} sprint days</b>, <b style={{color:T.yellow}}>{Object.values(leaves).reduce((a,b)=>a+b,0)} leave days</b>, and historical accuracy of <b style={{color:T.red}}>79%</b> — commit to <b style={{color:T.green,fontSize:16}}>{safeCap} story points</b>.
        </p>
        <p style={{margin:0,fontSize:11,color:T.textSub}}>Above {safeCap} pts risks a repeat of Sprint 4 where {76-37} pts went undelivered.</p>
      </Card>
    </div>
  );
}

// ─── DEPENDENCIES PANEL ───────────────────────────────────────────────────────
function DepsPanel({devs,devsColors}){
  const T=useT();
  const allTasks=devs.flatMap(dev=>dev.tasks.map(t=>({...t,devId:dev.id,devName:dev.name,devColor:devsColors[dev.colorIdx]})));
  const deps=[
    {from:"t5",to:"t1",label:"REST API needs Auth token format",type:"data",risk:"medium"},
    {from:"t11",to:"t7",label:"E2E tests need stable Dashboard build",type:"prereq",risk:"low"},
    {from:"t3",to:"t1",label:"Session Mgmt builds on Auth Module",type:"technical",risk:"high"},
    {from:"t9",to:"t7",label:"Notification System uses Dashboard state",type:"technical",risk:"low"},
  ];
  const TYPE={data:{color:T.yellow,label:"Data"},prereq:{color:T.purple,label:"Prereq"},technical:{color:T.accent,label:"Technical"}};
  const RISK={high:{color:T.red},medium:{color:T.yellow},low:{color:T.textSub}};
  return(
    <div>
      <Label style={{marginBottom:14}}>TASK DEPENDENCY MAP — WHO IS WAITING ON WHO</Label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        {deps.map((dep,i)=>{
          const ft=allTasks.find(t=>t.id===dep.from);
          const tt=allTasks.find(t=>t.id===dep.to);
          if(!ft||!tt)return null;
          const ST=mkStatus(T);
          const isBlk=tt.status==="at-risk"||tt.status==="slow";
          return(
            <Card key={i} style={{padding:"13px 15px",border:`1px solid ${isBlk?T.red+"33":T.border}`}}>
              <div style={{display:"flex",gap:6,marginBottom:9}}>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:`${TYPE[dep.type].color}14`,color:TYPE[dep.type].color}}>{TYPE[dep.type].label}</span>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:`${RISK[dep.risk].color}14`,color:RISK[dep.risk].color}}>{dep.risk} risk</span>
                {isBlk&&<span style={{fontSize:9,color:T.red}}>⚠ cascading</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                <div style={{flex:1,background:T.surface2,border:`1px solid ${ft.devColor}28`,borderRadius:7,padding:"7px 9px"}}>
                  <p style={{margin:"0 0 1px",fontSize:10,color:ft.devColor}}>{ft.devName.split(" ")[0]}</p>
                  <p style={{margin:"0 0 2px",fontSize:11,color:T.text,fontWeight:600}}>{ft.name}</p>
                  <StatusBadge status={ft.status}/>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}><span style={{fontSize:14,color:TYPE[dep.type].color}}>→</span><p style={{margin:0,fontSize:8,color:T.textDim}}>needs</p></div>
                <div style={{flex:1,background:T.surface2,border:`1px solid ${tt.devColor}28`,borderRadius:7,padding:"7px 9px"}}>
                  <p style={{margin:"0 0 1px",fontSize:10,color:tt.devColor}}>{tt.devName.split(" ")[0]}</p>
                  <p style={{margin:"0 0 2px",fontSize:11,color:T.text,fontWeight:600}}>{tt.name}</p>
                  <StatusBadge status={tt.status}/>
                </div>
              </div>
              <p style={{margin:0,fontSize:10,color:T.textSub}}>📌 {dep.label}</p>
            </Card>
          );
        })}
      </div>
      <Card style={{padding:"14px 16px",border:`1px solid ${T.red}22`}}>
        <Label style={{marginBottom:9,color:T.red}}>CASCADE RISK</Label>
        <p style={{margin:"0 0 7px",fontSize:12,color:T.text,lineHeight:1.6}}>🔴 <b style={{color:T.red}}>Auth Module (Arjun)</b> is a critical node — 2 tasks depend on it. Session Mgmt blocker could cascade into Sprint 5.</p>
        <p style={{margin:0,fontSize:12,color:T.text,lineHeight:1.6}}>🟡 <b style={{color:T.yellow}}>Dashboard UI (Dev Patel)</b> is complete, unblocking Mia — however E2E env blocker is now the limiting factor.</p>
      </Card>
    </div>
  );
}

// ─── SCOPE CREEP PANEL ────────────────────────────────────────────────────────
function ScopePanel({devs,devsColors,onAdjust}){
  const T=useT();
  const [adjTask,setAdjTask]=useState(null);
  const [newPts,setNewPts]=useState({});
  const allTasks=devs.flatMap(d=>d.tasks.map(t=>({...t,devId:d.id,devName:d.name,devColor:devsColors[d.colorIdx]})));
  const inflated=allTasks.filter(t=>(ORIGINAL_PTS[t.id]||t.storyPoints)<t.storyPoints);
  const totalCreep=allTasks.reduce((s,t)=>s+Math.max(0,t.storyPoints-(ORIGINAL_PTS[t.id]||t.storyPoints)),0);
  const underEst=allTasks.filter(t=>t.completedPoints/t.storyPoints<0.3&&t.daily.filter(d=>d.p>0).length>=3&&t.status!=="not-started"&&t.storyPoints>=5);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[{label:"Tasks With Creep",value:inflated.length,color:inflated.length>0?T.red:T.green,sub:"pts added mid-sprint"},{label:"Total Pts Added",value:totalCreep,color:totalCreep>0?T.red:T.green,sub:"beyond commitment"},{label:"Under-estimated",value:underEst.length,color:underEst.length>0?T.yellow:T.green,sub:"tracking behind"},{label:"Overload",value:`+${totalCreep}`,color:totalCreep>5?T.red:T.yellow,sub:"above sprint plan"}].map((k,i)=><KpiTile key={i} {...k}/>)}
      </div>
      <Card style={{padding:"16px 18px",marginBottom:14}}>
        <Label style={{marginBottom:4}}>ALL TASKS — ORIGINAL VS CURRENT STORY POINTS</Label>
        <p style={{margin:"0 0 12px",fontSize:11,color:T.textDim}}>Flagged = scope added after sprint start</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9}}>
          {allTasks.map(task=>{
            const orig=ORIGINAL_PTS[task.id]||task.storyPoints;
            const diff=task.storyPoints-orig;
            const hasCreep=diff>0;
            const isAdj=adjTask===task.id;
            return(
              <div key={task.id} style={{padding:"11px 13px",background:T.surface2,border:`1px solid ${hasCreep?T.red+"44":T.border}`,borderRadius:9}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                  <div><p style={{margin:"0 0 1px",fontSize:12,color:T.text,fontWeight:600}}>{task.name}</p><p style={{margin:0,fontSize:10,color:task.devColor}}>{task.devName}</p></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:11,color:T.textSub,textDecoration:hasCreep?"line-through":"none"}}>{orig}pts</span>
                      {hasCreep&&<><span style={{fontSize:9,color:T.red}}>→</span><span style={{fontSize:13,fontWeight:700,color:T.red}}>{task.storyPoints}</span><span style={{fontSize:9,padding:"1px 4px",borderRadius:8,background:`${T.red}14`,color:T.red}}>+{diff}</span></>}
                      {!hasCreep&&<span style={{fontSize:13,fontWeight:700,color:T.textSub}}>{task.storyPoints}</span>}
                    </div>
                    <StatusBadge status={task.status}/>
                  </div>
                </div>
                <ProgressBar pct={pct(task.completedPoints,task.storyPoints)} color={hasCreep?T.red:T.textSub} h={3}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                  <span style={{fontSize:10,color:T.textSub}}>{task.completedPoints}/{task.storyPoints} pts</span>
                  <Btn onClick={()=>setAdjTask(isAdj?null:task.id)}>{isAdj?"Close":"Adjust"}</Btn>
                </div>
                {isAdj&&(
                  <div style={{marginTop:9,padding:"9px 11px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7}}>
                    <Label style={{marginBottom:6}}>SET NEW STORY POINTS</Label>
                    <div style={{display:"flex",gap:5,marginBottom:7}}>
                      {[1,2,3,5,8,13,21].map(pt=>(
                        <button key={pt} onClick={()=>setNewPts(p=>({...p,[task.id]:pt}))} style={{flex:1,padding:"6px 2px",borderRadius:5,border:`1px solid ${(newPts[task.id]||task.storyPoints)===pt?T.accent:T.border}`,background:(newPts[task.id]||task.storyPoints)===pt?`${T.accent}14`:"transparent",color:(newPts[task.id]||task.storyPoints)===pt?T.accent:T.textSub,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{pt}</button>
                      ))}
                    </div>
                    {newPts[task.id]&&newPts[task.id]!==task.storyPoints&&(
                      <p style={{margin:"0 0 6px",fontSize:10,color:newPts[task.id]>task.storyPoints?T.red:T.green}}>
                        {newPts[task.id]>task.storyPoints?`⚠ +${newPts[task.id]-task.storyPoints} pts — scope creep flagged`:`✂ −${task.storyPoints-newPts[task.id]} pts — descoping`}
                      </p>
                    )}
                    <Btn variant="primary" color={T.accent} style={{width:"100%"}} onClick={()=>{if(newPts[task.id]&&newPts[task.id]!==task.storyPoints){onAdjust(task.id,task.devId,newPts[task.id]);setAdjTask(null);}}}>Apply</Btn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      {underEst.length>0&&(
        <Card style={{padding:"14px 16px",border:`1px solid ${T.yellow}22`,marginBottom:14}}>
          <Label style={{marginBottom:8,color:T.yellow}}>LIKELY UNDER-ESTIMATED</Label>
          {underEst.map((t,i)=>(
            <div key={i} style={{marginBottom:7,padding:"9px 11px",background:`${T.yellow}08`,border:`1px solid ${T.yellow}22`,borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:T.text,fontWeight:600}}>{t.name}</span>
                <span style={{fontSize:11,color:T.yellow}}>{Math.round((t.completedPoints/t.storyPoints)*100)}% done after {t.daily.filter(d=>d.p>0).length} active days</span>
              </div>
              <p style={{margin:"3px 0 0",fontSize:10,color:T.textSub}}>Consider re-pointing to {Math.round(t.storyPoints*1.5)}pts at current pace</p>
            </div>
          ))}
        </Card>
      )}
      <Card style={{padding:"14px 16px",border:`1px solid ${T.purple}18`}}>
        <Label style={{marginBottom:7,color:T.purple}}>AI SCOPE ANALYSIS</Label>
        <p style={{margin:"0 0 6px",fontSize:12,color:T.text,lineHeight:1.6}}>{totalCreep===0?"✓ No scope creep detected — all tasks within original commitments.`":`⚠ ${totalCreep} pts added mid-sprint. Combined with ${3} leave days and ${3} blockers, this is a major factor in the sprint falling behind.`}</p>
        <p style={{margin:0,fontSize:11,color:T.textSub}}>💡 Lock scope after Day 2. New requirements go to next sprint backlog — no additions without equal descoping.</p>
      </Card>
    </div>
  );
}

// ─── GITHUB PANEL ─────────────────────────────────────────────────────────────
function GithubPanel({devs,devsColors}){
  const T=useT();
  const commits=[
    {devIdx:0,avatar:"AM",message:"feat: implement JWT token refresh logic",branch:"feature/auth-module",time:"2h ago",pr:null,pts:1},
    {devIdx:2,avatar:"DP",message:"feat: add real-time notification polling",branch:"feature/notifications",time:"3h ago",pr:"PR #47",pts:1},
    {devIdx:1,avatar:"SK",message:"fix: attempt OAuth fallback endpoint",branch:"fix/oauth-integration",time:"5h ago",pr:"PR #45",pts:0},
    {devIdx:0,avatar:"AM",message:"refactor: clean up session middleware",branch:"feature/auth-module",time:"6h ago",pr:null,pts:0},
    {devIdx:3,avatar:"MT",message:"test: add unit tests for auth validation",branch:"test/unit-suite",time:"Yesterday",pr:"PR #44",pts:1},
    {devIdx:2,avatar:"DP",message:"feat: merge dashboard charts",branch:"feature/charts",time:"Yesterday",pr:"PR #43 ✓",pts:0},
  ];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {devs.map((dev,i)=>{const dc=devsColors[dev.colorIdx];return(
          <Card key={dev.id} style={{padding:"13px 15px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
              <div style={{width:30,height:30,borderRadius:6,background:`${dc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:dc}}>{dev.avatar}</div>
              <p style={{margin:0,fontSize:12,color:T.text,fontWeight:700}}>{dev.name.split(" ")[0]}</p>
            </div>
            {[["Commits",dev.githubCommits,dc],["PRs Open",dev.prsOpen,dev.prsOpen>0?T.yellow:T.textDim],["Reviewed",dev.prsReviewed,T.green]].map(([k,v,c],j)=>(
              <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:10,color:T.textSub}}>{k}</span>
                <span style={{fontSize:11,color:c,fontWeight:700}}>{v}</span>
              </div>
            ))}
          </Card>
        );})}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{padding:"16px 18px"}}>
          <Label style={{marginBottom:11}}>RECENT COMMITS</Label>
          {commits.map((c,i)=>{const dc=devsColors[c.devIdx];return(
            <div key={i} style={{marginBottom:8,padding:"8px 10px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:7}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:10,fontWeight:700,color:dc}}>{c.avatar}</span>
                  <span style={{fontSize:11,color:T.text}}>{c.message}</span>
                </div>
                {c.pts>0&&<span style={{fontSize:9,color:T.green,flexShrink:0}}>+{c.pts}pt</span>}
              </div>
              <div style={{display:"flex",gap:7}}>
                <span style={{fontSize:9,color:T.textDim}}>{c.branch}</span>
                {c.pr&&<span style={{fontSize:9,color:T.purple}}>{c.pr}</span>}
                <span style={{fontSize:9,color:T.textDim,marginLeft:"auto"}}>{c.time}</span>
              </div>
            </div>
          );})}
        </Card>
        <div>
          <Card style={{padding:"14px 16px",marginBottom:12,border:`1px solid ${T.green}22`}}>
            <Label style={{marginBottom:9,color:T.green}}>AUTO-DETECTED PROGRESS</Label>
            {[{devIdx:0,task:"Auth Module",text:"+1 pt auto-logged from PR merge"},{devIdx:2,task:"Chart Components",text:"+2 pts from merged PR #43"},{devIdx:3,task:"Unit Test Suite",text:"+1 pt from test commit"}].map((a,i)=>{const dc=devsColors[a.devIdx];return(
              <div key={i} style={{marginBottom:7,padding:"7px 9px",background:`${T.green}08`,border:`1px solid ${T.green}18`,borderRadius:7}}>
                <p style={{margin:"0 0 1px",fontSize:11,color:dc,fontWeight:700}}>{devs[a.devIdx].name.split(" ")[0]}</p>
                <p style={{margin:"0 0 1px",fontSize:11,color:T.text}}>{a.task}</p>
                <p style={{margin:0,fontSize:10,color:T.green}}>{a.text}</p>
              </div>
            );})}
          </Card>
          <Card style={{padding:"14px 16px"}}>
            <Label style={{marginBottom:9}}>INTEGRATION STATUS</Label>
            {[{k:"Repository",v:"nexus-project/main",s:"ok"},{k:"Auto-progress detection",v:"Active",s:"ok"},{k:"PR → task mapping",v:"Enabled",s:"ok"},{k:"Sync interval",v:"Every 15 min",s:"ok"},{k:"Sara Kim — OAuth branch",v:"No commits in 4 days",s:"warn"}].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:10,color:T.textSub}}>{item.k}</span>
                <span style={{fontSize:10,color:item.s==="warn"?T.red:T.green}}>{item.v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── TASK BOARD ───────────────────────────────────────────────────────────────
function TaskBoard({devs,devsColors,onReassign,onCreateTask}){
  const T=useT();
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <Label>ALL TASKS — DRAG CARDS TO REASSIGN</Label>
        <Btn onClick={onCreateTask} variant="primary" color={T.accent}>+ Add Task</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {devs.map((dev,i)=>{
          const dc=devsColors[dev.colorIdx];
          const s=devStats(dev);
          return(
            <div key={dev.id}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9,padding:"8px 11px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8}}>
                <div style={{width:26,height:26,borderRadius:5,background:`${dc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:dc}}>{dev.avatar}</div>
                <div><p style={{margin:0,fontSize:12,color:T.text,fontWeight:700}}>{dev.name.split(" ")[0]}</p><p style={{margin:0,fontSize:9,color:T.textSub}}>{dev.tasks.length} tasks · {s.donePts}/{s.totalPts} pts</p></div>
              </div>
              {[...dev.tasks].sort((a,b)=>SORT_ORDER[a.status]-SORT_ORDER[b.status]).map(task=>{
                const ST=mkStatus(T);
                const cfg=ST[task.status];
                return(
                  <div key={task.id} draggable onDragStart={e=>{e.dataTransfer.setData("taskId",task.id);e.dataTransfer.setData("fromDevId",dev.id);}} style={{marginBottom:7,padding:"10px 11px",background:T.surface,border:`1px solid ${cfg.color}33`,borderRadius:8,cursor:"grab"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,color:T.text,fontWeight:600}}>{task.name}</span>
                      <StatusBadge status={task.status}/>
                    </div>
                    <ProgressBar pct={pct(task.completedPoints,task.storyPoints)} color={cfg.color} h={3}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{fontSize:9,color:T.textSub}}>{task.completedPoints}/{task.storyPoints} pts</span>
                      {task.blockers.length>0&&<span style={{fontSize:9,color:T.red}}>🚧 blocked</span>}
                      <span style={{fontSize:9,color:T.textDim}}>⠿</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard(){
  const [isDark,setIsDark]=useState(true);
  const T=isDark?DARK:LIGHT;
  const devsColors=isDark?DEV_COLORS.dark:DEV_COLORS.light;

  const [devs,setDevs]=useState(INIT_DEVS);
  const [openCard,setOpenCard]=useState(null);
  const [expandAll,setExpandAll]=useState(false);
  const [activeTab,setActiveTab]=useState("Overview");
  const [showCreateTask,setShowCreateTask]=useState(false);

  const allTotalPts=devs.reduce((s,d)=>s+d.tasks.reduce((ss,t)=>ss+t.storyPoints,0),0);
  const allDonePts=devs.reduce((s,d)=>s+d.tasks.reduce((ss,t)=>ss+t.completedPoints,0),0);
  const allTasks=devs.reduce((s,d)=>s+d.tasks.length,0);
  const allDone=devs.reduce((s,d)=>s+d.tasks.filter(t=>t.status==="completed").length,0);
  const allBlockers=devs.reduce((s,d)=>s+d.tasks.reduce((ss,t)=>ss+t.blockers.length,0),0);
  const totalLeaves=devs.reduce((s,d)=>s+d.leaves.length,0);

  function handleReassign(taskId,fromDevId,toDevId){
    setDevs(prev=>{
      const task=prev.find(d=>d.id===fromDevId)?.tasks.find(t=>t.id===taskId);
      if(!task)return prev;
      return prev.map(d=>{
        if(d.id===fromDevId)return{...d,tasks:d.tasks.filter(t=>t.id!==taskId)};
        if(d.id===toDevId)return{...d,tasks:[...d.tasks,{...task,assignedTo:toDevId}]};
        return d;
      });
    });
  }
  function handleCreateTask(form){
    const t={id:`t${Date.now()}`,name:form.name,category:form.category,storyPoints:form.storyPoints,completedPoints:0,status:"not-started",eta:"TBD",assignedTo:form.assignedTo,blockers:[],daily:Array(SPRINT_CONFIG.totalDays).fill(null).map((_,i)=>({d:`D${i+1}`,p:0})),notes:form.notes||""};
    setDevs(prev=>prev.map(d=>d.id===form.assignedTo?{...d,tasks:[...d.tasks,t]}:d));
    setShowCreateTask(false);
  }
  function handleResolve(blockerId,taskId,devId){
    setDevs(prev=>prev.map(d=>d.id===devId?{...d,tasks:d.tasks.map(t=>t.id===taskId?{...t,blockers:t.blockers.map(b=>b.id===blockerId?{...b,status:"resolved"}:b)}:t)}:d));
  }
  function handleEscalate(blockerId,taskId,devId,to){
    setDevs(prev=>prev.map(d=>d.id===devId?{...d,tasks:d.tasks.map(t=>t.id===taskId?{...t,blockers:t.blockers.map(b=>b.id===blockerId?{...b,assignedTo:to,status:"escalated"}:b)}:t)}:d));
  }
  function handleAddBlocker(form){
    const newB={id:`b${Date.now()}`,desc:form.desc,reason:form.reason,assignedTo:form.assignedTo,since:`D${SPRINT_CONFIG.currentDay}`,status:"open"};
    setDevs(prev=>prev.map(d=>d.id===form.devId?{...d,tasks:d.tasks.map(t=>t.id===form.taskId?{...t,blockers:[...t.blockers,newB],status:t.status==="completed"?"slow":t.status==="on-track"?"at-risk":t.status}:t)}:d));
  }
  function handleAdjustScope(taskId,devId,newSP){
    setDevs(prev=>prev.map(d=>d.id===devId?{...d,tasks:d.tasks.map(t=>t.id===taskId?{...t,storyPoints:newSP,scopeCreep:true}:t)}:d));
  }

  const TABS=["Overview","Sprint","Task Board","History","Blockers","Scope Creep","Alerts","Retro","Capacity","Dependencies","GitHub"];

  return(
    <ThemeCtx.Provider value={T}>
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",color:T.text,transition:"background 0.3s,color 0.3s"}}>
        <div style={{position:"fixed",inset:0,zIndex:0,backgroundImage:`linear-gradient(${T.gridLine} 1px,transparent 1px),linear-gradient(90deg,${T.gridLine} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>

        {showCreateTask&&<TaskModal devs={devs} devsColors={devsColors} onAdd={handleCreateTask} onClose={()=>setShowCreateTask(false)}/>}

        <div style={{position:"relative",zIndex:1,maxWidth:1440,margin:"0 auto",padding:"22px 26px"}}>

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.accent,opacity:0.9}}/>
                <span style={{fontSize:10,color:T.accent,letterSpacing:2}}>{SPRINT_CONFIG.name.toUpperCase()} · LIVE · DAY {SPRINT_CONFIG.currentDay}/{SPRINT_CONFIG.totalDays}</span>
              </div>
              <h1 style={{margin:0,fontSize:24,fontWeight:700,color:T.text,letterSpacing:-0.5}}>Project Nexus</h1>
              <p style={{margin:"2px 0 0",fontSize:11,color:T.textSub}}>4 devs · {allTasks} tasks · {totalLeaves} leave days this sprint</p>
            </div>
            <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
              {/* Theme toggle */}
              <button onClick={()=>setIsDark(d=>!d)} style={{padding:"7px 13px",borderRadius:7,border:`1px solid ${T.border}`,background:T.surface,color:T.textSub,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginRight:6}}>
                {isDark?"☀ Light":"🌙 Dark"}
              </button>
              <button onClick={()=>setShowCreateTask(true)} style={{padding:"7px 14px",borderRadius:7,background:`${T.accent}14`,border:`1px solid ${T.accent}44`,color:T.accent,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,marginRight:5}}>+ New Task</button>
              <div style={{width:1,height:26,background:T.border,marginRight:3}}/>
              {TABS.map(tab=>{
                const badge=(tab==="Blockers")&&allBlockers>0?allBlockers:null;
                return(
                  <button key={tab} onClick={()=>setActiveTab(tab)} style={{position:"relative",padding:"6px 11px",borderRadius:6,border:`1px solid ${activeTab===tab?T.accent:T.border}`,background:activeTab===tab?`${T.accent}12`:"transparent",color:activeTab===tab?T.accent:T.textSub,fontSize:9,letterSpacing:0.8,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                    {tab.toUpperCase()}
                    {badge&&<span style={{position:"absolute",top:-5,right:-5,background:T.red,color:"#fff",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9,marginBottom:16}}>
            {[
              {label:"Sprint Progress",value:`${pct(allDonePts,allTotalPts)}%`,sub:`${allDonePts}/${allTotalPts} pts`,color:T.accent},
              {label:"Tasks Done",value:`${allDone}/${allTasks}`,sub:"across team",color:T.green},
              {label:"Days Left",value:`${SPRINT_CONFIG.totalDays-SPRINT_CONFIG.currentDay}`,sub:`of ${SPRINT_CONFIG.totalDays}`,color:T.yellow},
              {label:"Open Blockers",value:allBlockers,sub:allBlockers>0?"needs action":"clear",color:allBlockers>0?T.red:T.green},
              {label:"Leave Days",value:totalLeaves,sub:"this sprint",color:T.yellow},
              {label:"GitHub Commits",value:devs.reduce((s,d)=>s+d.githubCommits,0),sub:"this sprint",color:T.green},
            ].map((k,i)=><KpiTile key={i} {...k}/>)}
          </div>

          {activeTab==="Overview"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                  <Label>DEVELOPER CARDS — DRAG TASKS BETWEEN CARDS TO REASSIGN</Label>
                  <Btn onClick={()=>{setExpandAll(!expandAll);setOpenCard(null);}}>{expandAll?"▲ Collapse all":"▼ Expand all"}</Btn>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                  {devs.map((dev,i)=>(
                    <DevCard key={dev.id} dev={dev} devColor={devsColors[dev.colorIdx]} isOpen={expandAll||openCard===dev.id} onToggle={()=>{if(!expandAll)setOpenCard(openCard===dev.id?null:dev.id);}} allDevs={devs} allDevsColors={devsColors} onReassign={handleReassign}/>
                  ))}
                </div>
              </div>
              <NotificationPanel/>
            </div>
          )}
          {activeTab==="Sprint"&&<SprintInsightsPanel devs={devs} devsColors={devsColors}/>}
          {activeTab==="Task Board"&&<TaskBoard devs={devs} devsColors={devsColors} onReassign={handleReassign} onCreateTask={()=>setShowCreateTask(true)}/>}
          {activeTab==="History"&&<HistoryPanel devs={devs} devsColors={devsColors}/>}
          {activeTab==="Blockers"&&<BlockersPanel devs={devs} devsColors={devsColors} onResolve={handleResolve} onEscalate={handleEscalate} onAddBlocker={handleAddBlocker}/>}
          {activeTab==="Scope Creep"&&<ScopePanel devs={devs} devsColors={devsColors} onAdjust={handleAdjustScope}/>}
          {activeTab==="Alerts"&&<AlertsPanel/>}
          {activeTab==="Retro"&&<RetroPanel devs={devs} devsColors={devsColors}/>}
          {activeTab==="Capacity"&&<CapacityPanel devs={devs} devsColors={devsColors}/>}
          {activeTab==="Dependencies"&&<DepsPanel devs={devs} devsColors={devsColors}/>}
          {activeTab==="GitHub"&&<GithubPanel devs={devs} devsColors={devsColors}/>}

          <div style={{marginTop:16,padding:"10px 0",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:10,color:T.textDim}}>NEXUS AI PM · v0.7 · {TABS.length} modules</span>
            <span style={{fontSize:10,color:T.textDim}}>Light/Dark toggle · Drag to reassign · + New Task · Report blockers</span>
          </div>
        </div>
        <style>{`*{box-sizing:border-box;}button:hover{opacity:0.82;}input[type=range]{height:4px;cursor:pointer;}select option{background:${T.surface};color:${T.text};}`}</style>
      </div>
    </ThemeCtx.Provider>
  );
}
