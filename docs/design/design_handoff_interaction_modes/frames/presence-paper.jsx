// Paper variant — multi-agent presence canvas
// In paper, cursors become small ink-stamped pointers with badges,
// author dots become small circles, glow → ink-stroke borders.

function PresenceCanvasPaper({variant}){
  const arts = [
    {x:120,y:90,t:'PERSONA',ttl:'Sarah · PM',sub:'spec lead',by:null},
    {x:120,y:200,t:'PERSONA',ttl:'Marcus · CTO',sub:'enterprise',by:null},
    {x:340,y:90,t:'FEATURE',ttl:'GitHub OAuth',sub:'v3 · 3 sources',by:'cc'},
    {x:340,y:200,t:'FEATURE',ttl:'Email/pw fallback',sub:'2 sources',by:'gpt'},
    {x:560,y:90,t:'SCENARIO',ttl:'First-time GH user',sub:'redirect',by:'cc'},
    {x:560,y:200,t:'SCENARIO',ttl:'SAML failover',sub:'IDP allowlist',by:'gpt'},
    {x:560,y:310,t:'DECISION',ttl:'Retry policy',sub:'just added',by:'atlas'},
  ];
  const cursors = [
    {x:380,y:115,k:'cc',l:'brett/claude-code',c:'#1c1814'},
    {x:610,y:235,k:'gpt',l:'brett/chatgpt',c:'#1f6a52'},
    {x:600,y:340,k:'atlas',l:'workspace/atlas',c:'#3f7a5c'},
    {x:230,y:160,k:'brett',l:'brett',c:'#c96442'},
  ];
  return (
    <div className="paper" style={{height:'100%'}}>
      <div className="pres-canvas" style={{position:'relative',width:'100%',height:'100%'}}>
        <div className="grid"/>
        <div style={{position:'absolute',top:14,left:14,fontFamily:'JetBrains Mono, monospace',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.14em',textTransform:'uppercase'}}>{variant} · multi-agent presence</div>
        <div style={{position:'absolute',top:14,right:variant==='LOUD'?224:14,display:'flex',gap:6}}>
          <span className="chip"><span className="av cc" style={{width:14,height:14,fontSize:7}}>CC</span>&nbsp;BRETT/CC · ADVISOR</span>
          <span className="chip"><span className="av gpt" style={{width:14,height:14,fontSize:7}}>GP</span>&nbsp;BRETT/GPT · CONCIERGE</span>
          <span className="chip agent"><span style={{display:'inline-block',width:5,height:5,background:'var(--agent)',borderRadius:'50%'}}/>ATLAS</span>
        </div>

        {arts.map((a,i)=>(
          <div key={i} className={"art "+a.t.toLowerCase()} style={{left:a.x,top:a.y+30,position:'absolute',width:170}}>
            <div className="type">{a.t}</div>
            <div className="ttl">{a.ttl}</div>
            <div className="sub" style={{fontSize:11}}>{a.sub}</div>
            {variant!=='MINIMAL' && a.by && <span className={"author-dot "+a.by} title={a.by}>{a.by==='cc'?'C':a.by==='gpt'?'G':a.by==='atlas'?'A':'B'}</span>}
            {variant==='LOUD' && a.by && (
              <div style={{position:'absolute',bottom:-9,left:6,padding:'1px 7px',fontFamily:'JetBrains Mono, monospace',fontSize:9,letterSpacing:'0.08em',background:'var(--bg-elevated)',border:'1px solid var(--ink)',borderRadius:99,color:'var(--ink)'}}>
                {a.by}
              </div>
            )}
          </div>
        ))}

        {cursors.map((cur,i)=>(
          <div key={i} className={"cursor "+cur.k} style={{left:cur.x,top:cur.y+30,position:'absolute',display:'flex',alignItems:'flex-start'}}>
            <svg width="14" height="16" viewBox="0 0 14 16" style={{flex:'0 0 auto'}}>
              <path d="M 1 1 L 1 13 L 5 9 L 8 14 L 10 13 L 7 8 L 12 8 Z" fill={cur.c} stroke="#1c1814" strokeWidth="0.7" strokeLinejoin="round"/>
            </svg>
            <span className="lbl">{cur.l}</span>
          </div>
        ))}

        {variant==='LOUD' && (
          <div className="activity">
            <div className="lbl" style={{textTransform:'uppercase',color:'var(--ink-fade)',marginBottom:6}}>activity · live</div>
            <div className="it"><span className="dot" style={{background:'var(--agent)'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'var(--agent)'}}>atlas</b> added Decision · just now</div></div>
            <div className="it"><span className="dot" style={{background:'#1f6a52'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'#1f6a52'}}>brett/gpt</b> annotated SAML scenario · 14s</div></div>
            <div className="it"><span className="dot" style={{background:'#1c1814'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'var(--ink)'}}>brett/cc</b> linked First-time GH → OAuth · 31s</div></div>
            <div className="it"><span className="dot" style={{background:'var(--accent)'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'var(--accent)'}}>brett</b> selected feature · 1m</div></div>
            <div className="it"><span className="dot" style={{background:'#1c1814'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'var(--ink)'}}>brett/cc</b> created OAuth feature · 2m</div></div>
            <div className="it"><span className="dot" style={{background:'#1f6a52'}}/><div><b style={{fontFamily:'Source Serif 4, Georgia, serif',fontWeight:500,color:'#1f6a52'}}>brett/gpt</b> created fallback · 2m</div></div>
          </div>
        )}

        <div style={{position:'absolute',bottom:14,left:14,fontFamily:'JetBrains Mono, monospace',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.08em',maxWidth:340,lineHeight:1.5}}>
          {variant==='MINIMAL' && '· cursors only · attribution on hover · least visual noise'}
          {variant==='MEDIUM' && '· cursors + author dots on artifacts · click to filter by agent'}
          {variant==='LOUD' && '· cursors + author dots + chip + activity ledger'}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PresenceCanvasPaper });
