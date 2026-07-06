// Mode-switch flow + open question recommendations
function ModeSwitch(){
  return (
    <div className="frame" style={{width:'100%',height:'100%'}}>
      <div className="fhdr"><span>SETTINGS · INTERACTION MODE · SWITCH</span><span><b>fieldstate</b></span></div>
      <div className="body" style={{padding:'28px 36px'}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8}}>
          <span className="chip">CURRENT</span>
          <span style={{fontSize:18,fontWeight:600,letterSpacing:'-0.01em'}}>MCP-only · single user</span>
          <span style={{color:'var(--ink-fade)',fontFamily:'var(--mono)',fontSize:11}}>since 2026-04-12</span>
        </div>
        <p style={{color:'var(--ink-soft)',fontSize:13.5,lineHeight:1.5,margin:'10px 0 22px',maxWidth:560}}>Upgrading to Hosted provisions an Atlas conversation, system prompts, model bindings, and a server-side bus consumer. Your existing MCP token keeps working.</p>

        <div className="surf" style={{padding:'18px 20px'}}>
          <div className="lbl" style={{color:'var(--accent)'}}>UPGRADE PREVIEW</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:18,alignItems:'center',marginTop:14}}>
            <div className="surf" style={{padding:14,background:'var(--bg)'}}>
              <div style={{fontSize:13,fontWeight:600}}>MCP-only</div>
              <ul style={{margin:'8px 0 0',padding:'0 0 0 16px',fontSize:12,color:'var(--ink-soft)',lineHeight:1.6}}>
                <li>1 token · brett/cc</li>
                <li>Chat panel: read-only inbox</li>
                <li>Kickoff via tool call</li>
                <li>Cost: $0/mo atlas</li>
              </ul>
            </div>
            <div style={{color:'var(--accent)',fontFamily:'var(--mono)',fontSize:18}}>→</div>
            <div className="surf" style={{padding:14,background:'rgba(255,90,54,0.04)',borderColor:'var(--accent-mid)'}}>
              <div style={{fontSize:13,fontWeight:600,color:'var(--accent)'}}>Hosted (additive)</div>
              <ul style={{margin:'8px 0 0',padding:'0 0 0 16px',fontSize:12,color:'var(--ink-soft)',lineHeight:1.6}}>
                <li>Existing token preserved</li>
                <li>Chat input → atlas</li>
                <li>+ workspace/atlas presence</li>
                <li>Cost: ~$8–40/mo at this rate</li>
              </ul>
            </div>
          </div>

          <div style={{marginTop:18,padding:'10px 12px',background:'var(--bg)',border:'1px solid var(--line)',borderRadius:'var(--r-2)',display:'flex',alignItems:'center',gap:10}}>
            <span style={{display:'inline-block',width:8,height:8,background:'var(--warn)',borderRadius:'50%'}}/>
            <span style={{fontSize:12,color:'var(--ink-soft)'}}>Estimated based on 28 turns/wk over the last 30 days. Set a soft cap before billing locks in.</span>
          </div>

          <div style={{marginTop:14,display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn ghost">Cancel</button>
            <button className="btn">Configure cap first</button>
            <button className="btn primary">Provision Atlas + upgrade →</button>
          </div>
        </div>

        <div style={{marginTop:18,fontSize:12.5,color:'var(--ink-fade)',display:'flex',justifyContent:'space-between',fontFamily:'var(--mono)',letterSpacing:'0.04em'}}>
          <span>HOSTED → MCP downgrade: archives Atlas history, decommissions process</span>
          <a style={{color:'var(--ink-soft)',borderBottom:'1px solid var(--line-2)'}}>downgrade instead →</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ModeSwitch });
