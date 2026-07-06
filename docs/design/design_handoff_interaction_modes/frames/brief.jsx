// Top-of-canvas brief explaining the spec, the matrix, and design moves.
function Brief(){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div className="kicker">Workspec · v4 · Interaction modes · Design</div>
      <h1 style={{fontSize:56,lineHeight:0.96,letterSpacing:'-0.035em',fontWeight:700,margin:'4px 0 0',color:'var(--ink)'}}>Two axes.<br/>Four cells.<br/>One canvas.</h1>
      <p style={{fontSize:16,lineHeight:1.55,color:'var(--ink-soft)',maxWidth:640,margin:'0'}}>Until v4, WorkSpec assumed one interaction model: type into the in-product chat, hosted Atlas drives the canvas. Dogfooding via Claude Code surfaced a second: the user's own AI client drives WorkSpec through MCP. These aren't competing — they're two cells of a 2×2.</p>
      <p style={{fontSize:16,lineHeight:1.55,color:'var(--ink-soft)',maxWidth:640,margin:'0'}}>This canvas resolves the workspace creation flow, the chat-panel reframe across all four cells, the connections settings, the multi-agent presence model, and recommendations for the eight open questions.</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18,marginTop:18,paddingTop:20,borderTop:'1px solid var(--line)'}}>
        <div><div className="lbl">Aesthetic</div><b style={{display:'block',marginTop:4}}>Terminal</b></div>
        <div><div className="lbl">Surfaces</div><b style={{display:'block',marginTop:4}}>5 + open Q's</b></div>
        <div><div className="lbl">Cells</div><b style={{display:'block',marginTop:4}}>All four</b></div>
        <div><div className="lbl">Status</div><b style={{display:'block',marginTop:4,color:'var(--accent)'}}>For review</b></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginTop:8}}>
        <div className="surf" style={{padding:14}}>
          <div className="lbl">Identity model</div>
          <p style={{margin:'6px 0 0',fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.5}}>Agent is now <code className="code">{'(user, client)'}</code>. <b style={{color:'var(--ink)'}}>brett/claude-code</b> and <b style={{color:'var(--ink)'}}>brett/chatgpt</b> are distinct presences with distinct cursors.</p>
        </div>
        <div className="surf" style={{padding:14}}>
          <div className="lbl">Hosted is additive</div>
          <p style={{margin:'6px 0 0',fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.5}}>Hosted workspaces also expose MCP. The conversation bar is the default surface; MCP is there for the technical user.</p>
        </div>
        <div className="surf" style={{padding:14}}>
          <div className="lbl">Roles → hats</div>
          <p style={{margin:'6px 0 0',fontSize:12.5,color:'var(--ink-soft)',lineHeight:1.5}}>Concierge / advisor / architect become token <b style={{color:'var(--ink)'}}>scopes</b>, not identities. Same partitioning across hosted Atlas and MCP clients.</p>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Brief });
