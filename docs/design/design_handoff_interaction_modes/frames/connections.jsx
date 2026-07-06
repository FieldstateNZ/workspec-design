// Connections settings + MCP wizard
function ConnectionsSettings(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>WORKSPACE SETTINGS · CONNECTIONS</span><span><b>fieldstate</b> · brett</span></div>
      <div className="body" style={{padding:'28px 36px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14}}>
          <div>
            <h2 style={{fontSize:24,letterSpacing:'-0.02em',fontWeight:700,margin:0}}>Your connections</h2>
            <p style={{color:'var(--ink-soft)',fontSize:13,lineHeight:1.5,margin:'6px 0 0',maxWidth:560}}>One token per client. Each surfaces as a distinct presence on the canvas. Revoke independently.</p>
          </div>
          <button className="btn primary">+ Connect new client</button>
        </div>

        <div className="conn">
          <div className="row live">
            <div className="ic" style={{color:'var(--ink)'}}>CC</div>
            <div>
              <div className="nm">Claude Code · work laptop</div>
              <div className="id">brett/claude-code · ws_a1b2…d9f4</div>
            </div>
            <div className="scope" style={{color:'var(--accent)'}}>advisor · full</div>
            <div className="last">2 min ago</div>
            <div className="actions"><button className="btn sm ghost">⋯</button></div>
          </div>
          <div className="row">
            <div className="ic" style={{color:'#10a37f'}}>GP</div>
            <div>
              <div className="nm">ChatGPT desktop</div>
              <div className="id">brett/chatgpt · ws_g7h8…m2n1</div>
            </div>
            <div className="scope">concierge</div>
            <div className="last">3h ago</div>
            <div className="actions"><button className="btn sm ghost">⋯</button></div>
          </div>
          <div className="row">
            <div className="ic" style={{color:'#c4b5fd'}}>Cu</div>
            <div>
              <div className="nm">Cursor</div>
              <div className="id">brett/cursor · ws_p4q5…t8u9</div>
            </div>
            <div className="scope" style={{color:'var(--accent)'}}>advisor · full</div>
            <div className="last">yesterday</div>
            <div className="actions"><button className="btn sm ghost">⋯</button></div>
          </div>
          <div className="row" style={{opacity:0.6}}>
            <div className="ic">×</div>
            <div>
              <div className="nm" style={{textDecoration:'line-through'}}>Custom · zed test</div>
              <div className="id">brett/zed · revoked 2026-04-21</div>
            </div>
            <div className="scope" style={{color:'var(--ink-fade)'}}>—</div>
            <div className="last">revoked</div>
            <div className="actions"><button className="btn sm ghost">restore</button></div>
          </div>
        </div>

        <div style={{marginTop:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div className="surf" style={{padding:14}}>
            <div className="lbl">Workspace endpoint</div>
            <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--ink)',marginTop:6}}>https://workspec.app/mcp/<span style={{color:'var(--accent)'}}>fieldstate</span></div>
            <div style={{fontSize:12,color:'var(--ink-soft)',marginTop:8,lineHeight:1.5}}>One endpoint per workspace. Bearer token distinguishes clients.</div>
          </div>
          <div className="surf" style={{padding:14}}>
            <div className="lbl">Default scope · new clients</div>
            <div style={{display:'flex',gap:6,marginTop:8}}>
              <button className="btn sm">Concierge</button>
              <button className="btn sm primary">Advisor</button>
              <button className="btn sm ghost">Ask each time</button>
            </div>
            <div style={{fontSize:11.5,color:'var(--ink-fade)',marginTop:8,lineHeight:1.5,fontFamily:'var(--mono)',letterSpacing:'0.04em'}}>REC: ADVISOR FOR IDE CLIENTS, CONCIERGE FOR WEB CHATGPT</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectWizard(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>CONNECT NEW CLIENT · WIZARD</span><span>step 2 of 3</span></div>
      <div className="body" style={{padding:'28px 36px'}}>
        <div style={{display:'flex',gap:24}}>
          <div style={{flex:'0 0 220px'}}>
            <div className="lbl" style={{marginBottom:10}}>1 · pick client</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[
                ['cc','Claude Code',true],
                ['gpt','ChatGPT',false],
                ['cur','Cursor',false],
                ['custom','Custom · MCP',false],
              ].map(([k,n,on])=>(
                <div key={k} className={"surf"} style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',borderColor:on?'var(--accent)':'var(--line)',background:on?'rgba(255,90,54,0.05)':'var(--bg-soft)'}}>
                  <div className={"av "+k} style={{width:22,height:22,fontSize:9}}>{k.slice(0,2).toUpperCase()}</div>
                  <span style={{fontSize:13,fontWeight:on?600:500}}>{n}</span>
                  {on && <span style={{marginLeft:'auto',color:'var(--accent)'}}><Icon.check/></span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1}}>
            <div className="lbl">2 · label · scope</div>
            <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:10,marginTop:8}}>
              <div className="input"><input defaultValue="work laptop · brett"/></div>
              <div style={{display:'flex',border:'1px solid var(--line-2)',borderRadius:'var(--r-2)',overflow:'hidden'}}>
                <div style={{flex:1,padding:'8px 10px',fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--ink-fade)',cursor:'pointer'}}>concierge</div>
                <div style={{flex:1,padding:'8px 10px',fontFamily:'var(--mono)',fontSize:10.5,letterSpacing:'0.08em',textTransform:'uppercase',color:'#0a0a0c',background:'var(--accent)',fontWeight:700,cursor:'pointer'}}>advisor</div>
              </div>
            </div>

            <div className="lbl" style={{marginTop:20}}>3 · paste config</div>
            <div className="codeblk" style={{marginTop:8}}>{`{
  `}<span className="k">"mcpServers"</span>{`: {
    `}<span className="k">"workspec"</span>{`: {
      `}<span className="k">"url"</span>{`: `}<span className="s">"https://workspec.app/mcp/fieldstate"</span>{`,
      `}<span className="k">"transport"</span>{`: `}<span className="s">"sse"</span>{`,
      `}<span className="k">"headers"</span>{`: { `}<span className="k">"Authorization"</span>{`: `}<span className="s">"Bearer ws_NEW…tok9"</span>{` }
    }
  }
}`}</div>

            <div style={{marginTop:14,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <button className="btn"><Icon.copy/>&nbsp;&nbsp;Copy config</button>
              <button className="btn">Reveal token (once)</button>
              <button className="btn ghost">Download <code className="code">mcp.json</code></button>
            </div>

            <div style={{marginTop:18,padding:'10px 12px',background:'rgba(92,242,192,0.06)',border:'1px solid rgba(92,242,192,0.3)',borderRadius:'var(--r-2)',display:'flex',alignItems:'center',gap:10}}>
              <span style={{display:'inline-block',width:8,height:8,background:'var(--agent)',borderRadius:'50%',animation:'pulse 1.4s ease-in-out infinite'}}/>
              <span style={{fontSize:12.5,color:'var(--ink)'}}>Listening for first call from <code className="code" style={{color:'var(--agent)'}}>brett/claude-code</code>… connection will appear when it lands.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConnectionsSettings, ConnectWizard });
