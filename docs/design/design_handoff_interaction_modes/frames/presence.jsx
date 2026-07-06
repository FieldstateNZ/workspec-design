// Multi-agent presence on canvas — 3 variants
function PresenceCanvas({variant}){
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
    {x:380,y:115,k:'cc',l:'brett/claude-code'},
    {x:610,y:235,k:'gpt',l:'brett/chatgpt'},
    {x:600,y:340,k:'atlas',l:'workspace/atlas'},
    {x:230,y:160,k:'brett',l:'brett'},
  ];
  return (
    <div className="pres-canvas" style={{position:'relative',width:'100%',height:'100%'}}>
      <div className="grid"/>
      <div style={{position:'absolute',top:14,left:14,fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{variant} · multi-agent presence</div>
      <div style={{position:'absolute',top:14,right:variant==='LOUD'?224:14,display:'flex',gap:6}}>
        <span className="chip"><Av k="cc" name="CC"/>&nbsp;BRETT/CC · ADVISOR</span>
        <span className="chip"><Av k="gpt" name="GP"/>&nbsp;BRETT/GPT · CONCIERGE</span>
        <span className="chip agent"><span style={{display:'inline-block',width:5,height:5,background:'var(--agent)',borderRadius:'50%'}}/>ATLAS</span>
      </div>

      {arts.map((a,i)=>(
        <div key={i} className={"art "+a.t.toLowerCase()} style={{left:a.x,top:a.y+30,position:'absolute',width:170}}>
          <div className="type">{a.t}</div>
          <div className="ttl" style={{fontSize:12.5}}>{a.ttl}</div>
          <div className="sub" style={{fontSize:11}}>{a.sub}</div>
          {variant!=='MINIMAL' && a.by && <span className={"author-dot "+a.by} title={a.by}/>}
          {variant==='LOUD' && a.by && (
            <div style={{position:'absolute',bottom:-8,left:6,padding:'1px 6px',fontFamily:'var(--mono)',fontSize:9,letterSpacing:'0.06em',background:'#0a0a0c',border:'1px solid var(--line-2)',borderRadius:99,color:'var(--ink-soft)'}}>
              <span className={"author-dot "+a.by} style={{position:'static',display:'inline-block',marginRight:4,width:6,height:6,border:0,verticalAlign:'1px'}}/>
              {a.by}
            </div>
          )}
        </div>
      ))}

      {cursors.map((c,i)=>(
        <div key={i} className={"cursor "+c.k} style={{left:c.x,top:c.y+30}}>
          <Icon.cursor c={c.k==='cc'?'#9ec6ff':c.k==='gpt'?'#10a37f':c.k==='atlas'?'#5cf2c0':c.k==='cur'?'#c4b5fd':'#ff5a36'}/>
          <span className="lbl" style={{marginLeft:-2,marginTop:8}}>{c.l}</span>
        </div>
      ))}

      {variant==='LOUD' && (
        <div className="activity">
          <div className="lbl" style={{textTransform:'uppercase',color:'var(--ink-fade)'}}>activity · live</div>
          <div className="it"><span className="dot" style={{background:'var(--agent)'}}/><div><b style={{color:'var(--agent)',fontWeight:500}}>atlas</b> added Decision · just now</div></div>
          <div className="it"><span className="dot" style={{background:'#10a37f'}}/><div><b style={{color:'#5cf2c0',fontWeight:500}}>brett/gpt</b> annotated SAML scenario · 14s</div></div>
          <div className="it"><span className="dot" style={{background:'#9ec6ff'}}/><div><b style={{color:'#9ec6ff',fontWeight:500}}>brett/cc</b> linked First-time GH → OAuth · 31s</div></div>
          <div className="it"><span className="dot" style={{background:'var(--accent)'}}/><div><b style={{color:'var(--accent)',fontWeight:500}}>brett</b> selected feature · 1m</div></div>
          <div className="it"><span className="dot" style={{background:'#9ec6ff'}}/><div><b style={{color:'#9ec6ff',fontWeight:500}}>brett/cc</b> created OAuth feature · 2m</div></div>
          <div className="it"><span className="dot" style={{background:'#10a37f'}}/><div><b style={{color:'#5cf2c0',fontWeight:500}}>brett/gpt</b> created fallback · 2m</div></div>
        </div>
      )}

      <div style={{position:'absolute',bottom:14,left:14,fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.06em',maxWidth:340,lineHeight:1.5}}>
        {variant==='MINIMAL' && '· cursors only · attribution on hover · least visual noise'}
        {variant==='MEDIUM' && '· cursors + author dots on artifacts · click to filter by agent'}
        {variant==='LOUD' && '· cursors + author dots + chip + activity stream'}
      </div>
    </div>
  );
}

Object.assign(window, { PresenceCanvas });
