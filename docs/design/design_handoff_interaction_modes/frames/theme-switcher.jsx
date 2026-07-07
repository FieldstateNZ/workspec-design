// Theme switcher mock — segmented aesthetic + segmented theme controls.
// Lives in the workspace top bar or settings → appearance.

function ThemeSwitcher_Inline(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>SETTINGS · APPEARANCE</span><span><b>fieldstate</b></span></div>
      <div className="body" style={{padding:'28px 36px'}}>
        <h2 style={{fontSize:24,letterSpacing:'-0.02em',fontWeight:700,margin:'0 0 6px'}}>Appearance</h2>
        <p style={{color:'var(--ink-soft)',fontSize:13,lineHeight:1.5,margin:'0 0 24px',maxWidth:560}}>Two independent toggles. Aesthetic changes the idiom (typography, density, accent treatment). Theme changes the surface ramp.</p>

        {/* Aesthetic */}
        <div className="lbl">Aesthetic</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8,maxWidth:560}}>
          <div className="surf" style={{padding:14,borderColor:'var(--accent)',background:'rgba(255,90,54,0.04)',cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:14,fontWeight:600}}>Console</span>
              <span style={{color:'var(--accent)'}}><Icon.check/></span>
            </div>
            <div style={{fontSize:12,color:'var(--ink-soft)',marginTop:4,lineHeight:1.5}}>Mono-heavy · dense · technical</div>
          </div>
          <div className="surf" style={{padding:14,cursor:'pointer'}}>
            <div style={{fontSize:14,fontWeight:600}}>Paper</div>
            <div style={{fontSize:12,color:'var(--ink-soft)',marginTop:4,lineHeight:1.5}}>Editorial · warm · crafted</div>
          </div>
        </div>

        {/* Theme */}
        <div className="lbl" style={{marginTop:24}}>Theme</div>
        <div style={{display:'inline-flex',border:'1px solid var(--line-2)',borderRadius:'var(--r-2)',overflow:'hidden',marginTop:8}}>
          <div style={{padding:'8px 16px',fontFamily:'var(--mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',color:'var(--ink-fade)'}}>Light</div>
          <div style={{padding:'8px 16px',fontFamily:'var(--mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',background:'var(--accent)',color:'var(--on-accent,#0a0a0c)',fontWeight:700,cursor:'pointer'}}>Dark</div>
          <div style={{padding:'8px 16px',fontFamily:'var(--mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',color:'var(--ink-fade)',borderLeft:'1px solid var(--line-2)'}}>Auto · system</div>
        </div>

        {/* Preview matrix */}
        <div className="lbl" style={{marginTop:28}}>Preview · 2×2</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8,maxWidth:560}}>
          {[
            ['Console · Dark','#0a0a0c','#e8e8ea','#ff5a36',true],
            ['Console · Light','#f7f5f0','#16140f','#d94a26',false],
            ['Paper · Light','#f3ecd8','#1c1814','#c96442',false],
            ['Paper · Dark','#161310','#ede4cf','#e07a55',false],
          ].map(([n,bg,ink,a,on])=>(
            <div key={n} style={{border:'1px solid '+(on?'var(--accent)':'var(--line)'),borderRadius:'var(--r-2)',background:bg,padding:'14px 14px',position:'relative',cursor:'pointer'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:ink,opacity:0.55}}>{n.split(' · ')[0]}</div>
              <div style={{fontSize:14,fontWeight:600,color:ink,marginTop:3}}>{n.split(' · ')[1]}</div>
              <div style={{display:'flex',gap:4,marginTop:10}}>
                <span style={{width:14,height:14,borderRadius:3,background:a}}/>
                <span style={{width:14,height:14,borderRadius:3,background:ink,opacity:0.7}}/>
                <span style={{width:14,height:14,borderRadius:3,background:ink,opacity:0.25}}/>
              </div>
              {on && <span style={{position:'absolute',top:8,right:8,color:'var(--accent)'}}><Icon.check/></span>}
            </div>
          ))}
        </div>

        <div style={{marginTop:24,padding:'10px 12px',background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:'var(--r-2)',fontSize:12,color:'var(--ink-soft)',lineHeight:1.5,maxWidth:560}}>
          Workspace-wide. Each member can override per-device under <code className="code">profile → appearance</code>.
        </div>
      </div>
    </div>
  );
}

// Compact dropdown variant for the workspace top bar
function ThemeSwitcher_Compact(){
  return (
    <div style={{padding:32,background:'var(--bg)',height:'100%',boxSizing:'border-box',display:'flex',flexDirection:'column',gap:18}}>
      <div className="kicker" style={{color:'var(--accent)'}}>COMPACT · TOP BAR DROPDOWN</div>

      {/* compact in-bar control */}
      <div className="surf" style={{padding:14,display:'flex',alignItems:'center',gap:14}}>
        <span className="lbl">in workspace top bar →</span>
        <div style={{display:'inline-flex',border:'1px solid var(--line-2)',borderRadius:'var(--r-2)',overflow:'hidden',height:26}}>
          <div style={{padding:'0 10px',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',display:'flex',alignItems:'center',color:'var(--accent)',background:'rgba(255,90,54,0.08)',cursor:'pointer',fontWeight:700}}>console</div>
          <div style={{padding:'0 10px',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',display:'flex',alignItems:'center',color:'var(--ink-fade)',cursor:'pointer',borderLeft:'1px solid var(--line-2)'}}>paper</div>
        </div>
        <div style={{display:'inline-flex',border:'1px solid var(--line-2)',borderRadius:'var(--r-2)',overflow:'hidden',height:26}}>
          <div style={{padding:'0 10px',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',display:'flex',alignItems:'center',color:'var(--ink-fade)',cursor:'pointer'}}>☀</div>
          <div style={{padding:'0 10px',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',display:'flex',alignItems:'center',background:'var(--accent)',color:'var(--on-accent,#0a0a0c)',cursor:'pointer',fontWeight:700,borderLeft:'1px solid var(--line-2)'}}>☾</div>
          <div style={{padding:'0 10px',fontFamily:'var(--mono)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',display:'flex',alignItems:'center',color:'var(--ink-fade)',cursor:'pointer',borderLeft:'1px solid var(--line-2)'}}>auto</div>
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-fade)',letterSpacing:'0.06em',marginLeft:'auto'}}>⌘⇧L cycles</span>
      </div>

      <div className="surf" style={{padding:14}}>
        <div className="lbl">Implementation</div>
        <div className="codeblk" style={{marginTop:8}}>{`<html data-aesthetic="console" data-theme="dark">
  <link rel="stylesheet" href="tokens/console-dark.css"/>
  <link rel="stylesheet" href="shell.css"/>
</html>`}</div>
        <p style={{margin:'10px 0 0',fontSize:12,color:'var(--ink-soft)',lineHeight:1.5}}>Two attributes. Four token files. Components don't branch — they read the same <code className="code">--ink</code>, <code className="code">--bg</code>, <code className="code">--accent</code>. Switching is one CSS file swap + one attribute change.</p>
      </div>
    </div>
  );
}

Object.assign(window, { ThemeSwitcher_Inline, ThemeSwitcher_Compact });
