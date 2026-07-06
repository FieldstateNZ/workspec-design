// Workspace creation flow — 4 steps shown as 4 frames.
function Creation_Step1(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>STEP 01 · NAME</span><span><b>workspec</b> · new workspace</span></div>
      <div className="body" style={{padding:'40px 56px'}}>
        <div className="steps">
          <div className="s cur"><div className="d">1</div><span>Name</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">2</div><span>Seat mode</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">3</div><span>Interaction</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">4</div><span>Connect</span></div>
        </div>
        <h2 style={{fontSize:36,letterSpacing:'-0.025em',fontWeight:700,margin:'40px 0 6px'}}>What are you building?</h2>
        <p style={{color:'var(--ink-soft)',fontSize:14,lineHeight:1.5,margin:'0 0 28px',maxWidth:480}}>A workspace is a graph of artifacts that grows with the project. You can rename it later.</p>

        <div className="lbl">Workspace name</div>
        <div className="input" style={{marginTop:8,height:44,fontSize:16,borderColor:'var(--accent)',boxShadow:'0 0 0 3px var(--accent-soft)'}}>
          <input defaultValue="fieldstate" autoFocus/>
          <span style={{color:'var(--ink-fade)',fontFamily:'var(--mono)',fontSize:11}}>workspec.app/fieldstate</span>
        </div>

        <div style={{marginTop:14}}>
          <div className="lbl">Optional</div>
          <div className="input" style={{marginTop:6}}><input placeholder="organization (acme, personal, …)" defaultValue="pukekos"/></div>
        </div>

        <div style={{marginTop:40,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--ink-fade)',letterSpacing:'0.06em',textTransform:'uppercase'}}>1 of 4 · ⏎ continue</span>
          <button className="btn primary lg">Continue →</button>
        </div>
      </div>
    </div>
  );
}

function Creation_Step2(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>STEP 02 · SEAT MODE</span><span><b>fieldstate</b></span></div>
      <div className="body" style={{padding:'40px 56px'}}>
        <div className="steps">
          <div className="s done"><div className="d"><Icon.check/></div><span>Name</span></div>
          <div className="sep"/>
          <div className="s cur"><div className="d">2</div><span>Seat mode</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">3</div><span>Interaction</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">4</div><span>Connect</span></div>
        </div>
        <h2 style={{fontSize:36,letterSpacing:'-0.025em',fontWeight:700,margin:'40px 0 6px'}}>Just you, or a team?</h2>
        <p style={{color:'var(--ink-soft)',fontSize:14,lineHeight:1.5,margin:'0 0 28px',maxWidth:520}}>Pick what fits today. Upgrade single → multi any time without losing data.</p>

        <div className="segchoice">
          <div className="opt on">
            <div className="row">
              <div style={{display:'flex',alignItems:'center',gap:10}}><Icon.user/><span className="ttl">Single user</span></div>
              <span className="price">$12/mo</span>
            </div>
            <div className="desc">One human owner. No invites, no roles, no presence. Cheapest tier.</div>
            <div className="feat"><span className="chip">1 SEAT</span><span className="chip">UNLIMITED ARTIFACTS</span></div>
          </div>
          <div className="opt">
            <div className="row">
              <div style={{display:'flex',alignItems:'center',gap:10}}><Icon.users/><span className="ttl">Multi user</span></div>
              <span className="price">$28 /seat/mo</span>
            </div>
            <div className="desc">Workspace members with invites + roles. Presence cursors, notes, shared MCP endpoint.</div>
            <div className="feat"><span className="chip">2+ SEATS</span><span className="chip">PRESENCE</span><span className="chip">NOTES</span></div>
          </div>
        </div>

        <div style={{marginTop:18,padding:'12px 14px',background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:'var(--r-2)',fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-soft)'}}>
          <span style={{color:'var(--accent)'}}>i</span>&nbsp;&nbsp;Plan upgrade required for multi · 14d trial available
        </div>

        <div style={{marginTop:32,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn ghost">← Back</button>
          <button className="btn primary lg">Continue →</button>
        </div>
      </div>
    </div>
  );
}

function Creation_Step3(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>STEP 03 · INTERACTION MODE</span><span><b>fieldstate</b> · single user</span></div>
      <div className="body" style={{padding:'40px 56px'}}>
        <div className="steps">
          <div className="s done"><div className="d"><Icon.check/></div><span>Name</span></div>
          <div className="sep"/>
          <div className="s done"><div className="d"><Icon.check/></div><span>Seat mode</span></div>
          <div className="sep"/>
          <div className="s cur"><div className="d">3</div><span>Interaction</span></div>
          <div className="sep"/>
          <div className="s"><div className="d">4</div><span>Connect</span></div>
        </div>
        <h2 style={{fontSize:36,letterSpacing:'-0.025em',fontWeight:700,margin:'40px 0 6px'}}>How do you want to drive it?</h2>
        <p style={{color:'var(--ink-soft)',fontSize:14,lineHeight:1.5,margin:'0 0 28px',maxWidth:520}}>Hosted is additive — you can always also connect your own client. MCP-only skips the hosted Atlas process entirely.</p>

        <div className="segchoice">
          <div className="opt on">
            <div className="row">
              <div style={{display:'flex',alignItems:'center',gap:10}}><Icon.plug/><span className="ttl">MCP-only</span></div>
              <span className="price">+$0</span>
            </div>
            <div className="desc">Bring your own AI client — Claude Code, ChatGPT, Cursor. Use your existing subscription. Chat panel is read-only inbox.</div>
            <div className="feat"><span className="chip">FLAT</span><span className="chip">BYO AGENT</span><span className="chip">TOOL-ONLY KICKOFF</span></div>
          </div>
          <div className="opt">
            <div className="row">
              <div style={{display:'flex',alignItems:'center',gap:10}}><Icon.bolt/><span className="ttl">Hosted</span></div>
              <span className="price">~$8–40/mo · usage</span>
            </div>
            <div className="desc">Hosted Atlas in a chat panel as primary input. MCP also exposed. Best for non-technical owners.</div>
            <div className="feat"><span className="chip">CHAT INPUT</span><span className="chip">+ MCP</span><span className="chip">METERED</span></div>
          </div>
        </div>

        <div style={{marginTop:18,padding:'12px 14px',background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:'var(--r-2)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-soft)'}}>
          <div><b style={{color:'var(--ink)',fontWeight:500}}>Estimated MCP-only:</b> $0 in atlas turns · use your Claude/ChatGPT plan</div>
          <div><b style={{color:'var(--ink)',fontWeight:500}}>Estimated hosted:</b> ~$0.04 / atlas turn · soft cap configurable</div>
        </div>

        <div style={{marginTop:32,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn ghost">← Back</button>
          <button className="btn primary lg">Provision workspace →</button>
        </div>
      </div>
    </div>
  );
}

function Creation_Step4(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>STEP 04 · CONNECT FIRST CLIENT</span><span><b>fieldstate</b> · single · MCP-only · ✓ provisioned</span></div>
      <div className="body" style={{padding:'32px 48px'}}>
        <div className="steps">
          <div className="s done"><div className="d"><Icon.check/></div><span>Name</span></div>
          <div className="sep"/>
          <div className="s done"><div className="d"><Icon.check/></div><span>Seat mode</span></div>
          <div className="sep"/>
          <div className="s done"><div className="d"><Icon.check/></div><span>Interaction</span></div>
          <div className="sep"/>
          <div className="s cur"><div className="d">4</div><span>Connect</span></div>
        </div>
        <h2 style={{fontSize:32,letterSpacing:'-0.025em',fontWeight:700,margin:'32px 0 4px'}}>Connect your AI client.</h2>
        <p style={{color:'var(--ink-soft)',fontSize:14,lineHeight:1.5,margin:'0 0 22px',maxWidth:540}}>Pick where you want to drive WorkSpec from. We'll generate a token scoped to <b style={{color:'var(--ink)'}}>brett @ fieldstate</b> and walk you through wiring it up. You can connect more later.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:18}}>
          {[
            ['cc','Claude Code','recommended'],
            ['gpt','ChatGPT desktop',''],
            ['cur','Cursor',''],
            ['custom','Custom','any MCP'],
          ].map(([k,n,t],i)=>(
            <div key={k} className={"surf"+(i===0?' on':'')} style={{padding:'14px 14px',cursor:'pointer',borderColor:i===0?'var(--accent)':'var(--line)',background:i===0?'rgba(255,90,54,0.04)':'var(--bg-soft)',position:'relative'}}>
              <div className={"av "+k} style={{marginBottom:8}}>{k.toUpperCase().slice(0,2)}</div>
              <div style={{fontSize:13,fontWeight:600,letterSpacing:'-0.005em'}}>{n}</div>
              {t && <div style={{fontFamily:'var(--mono)',fontSize:9.5,color:i===0?'var(--accent)':'var(--ink-fade)',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:3}}>{t}</div>}
              {i===0 && <div style={{position:'absolute',top:10,right:10,width:14,height:14,borderRadius:'50%',background:'var(--accent)',color:'#0a0a0c',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.check size={9}/></div>}
            </div>
          ))}
        </div>

        <div className="lbl" style={{marginBottom:6}}>Paste this into <code className="code">~/.config/claude-code/mcp.json</code></div>
        <div className="codeblk">{`{
  `}<span className="k">"mcpServers"</span>{`: {
    `}<span className="k">"workspec"</span>{`: {
      `}<span className="k">"url"</span>{`: `}<span className="s">"https://workspec.app/mcp/fieldstate"</span>{`,
      `}<span className="k">"transport"</span>{`: `}<span className="s">"sse"</span>{`,
      `}<span className="k">"headers"</span>{`: { `}<span className="k">"Authorization"</span>{`: `}<span className="s">"Bearer ws_a1b2…d9f4"</span>{` }
    }
  }
}`}</div>

        <div style={{marginTop:14,display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn"><Icon.copy/>&nbsp;&nbsp;Copy config</button>
          <button className="btn">Reveal token</button>
          <span className="chip" style={{color:'var(--agent)',borderColor:'rgba(92,242,192,0.4)'}}><span style={{display:'inline-block',width:5,height:5,background:'var(--agent)',borderRadius:'50%'}}/> WAITING FOR FIRST CALL</span>
        </div>

        <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn ghost">Skip · I'll connect later</button>
          <div style={{display:'flex',gap:8}}>
            <button className="btn">Test connection</button>
            <button className="btn primary lg" disabled style={{opacity:0.5,cursor:'not-allowed'}}>Open workspace →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Creation_Step1, Creation_Step2, Creation_Step3, Creation_Step4 });
